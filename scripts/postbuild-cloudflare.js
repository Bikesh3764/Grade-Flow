const fs = require('fs');
const path = require('path');

const projectRootDir = path.join(__dirname, '..');
const openNextDir = path.join(projectRootDir, '.open-next');
const assetsDir = path.join(openNextDir, 'assets');
const targetWorker = path.join(assetsDir, '_worker.js');
const sourceWorker = path.join(openNextDir, 'worker.js');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

function copySsgHtmlFiles(srcAppDir, targetAssetsDir) {
  if (!fs.existsSync(srcAppDir)) return;

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.html')) {
        const relPath = path.relative(srcAppDir, fullPath);
        const cleanedRelPath = relPath
          .replace(/\\\([^)]+\)\\/g, '\\')
          .replace(/\([^)]+\)\//g, '')
          .replace(/^\([^)]+\)[/\\]/, '');
        
        const destPath = path.join(targetAssetsDir, cleanedRelPath);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(fullPath, destPath);

        const rscSrc = fullPath.replace(/\.html$/, '.rsc');
        if (fs.existsSync(rscSrc)) {
          fs.copyFileSync(rscSrc, destPath.replace(/\.html$/, '.rsc'));
        }
      }
    });
  }

  traverse(srcAppDir);
  console.log(`✅ Copied pre-rendered SSG HTML files from ${path.relative(projectRootDir, srcAppDir)} to .open-next/assets`);
}

function patchWorkerForDebug(workerPath) {
  if (!fs.existsSync(workerPath)) return;
  let content = fs.readFileSync(workerPath, 'utf8');
  if (!content.includes('CATCH_DEBUG_PATCH')) {
    content = content.replace(
      /async fetch\(request,\s*env,\s*ctx\)\s*\{/g,
      `async fetch(request, env, ctx) { /* CATCH_DEBUG_PATCH */ try {`
    );
    // Add catch before final closing brace of export default
    content = content.replace(
      /\}\s*;\s*$/g,
      `} catch (err) { return new Response("WORKER_ERROR: " + (err.stack || err.message || String(err)), { status: 500, headers: { "content-type": "text/plain" } }); } };`
    );
    fs.writeFileSync(workerPath, content, 'utf8');
    console.log('✅ Patched _worker.js with error catch block for live diagnosis');
  }
}

function sanitizeAbsolutePathsInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) return;
  const items = fs.readdirSync(folderPath);
  items.forEach((item) => {
    const fullPath = path.join(folderPath, item);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      sanitizeAbsolutePathsInFolder(fullPath);
    } else if (item.endsWith('.js') || item.endsWith('.mjs') || item.endsWith('.json') || item.endsWith('.cjs')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const patched = content
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow[/\\]\.open-next[/\\]assets[/\\]?/gi, '"./')
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow[/\\]\.open-next[/\\]server-functions[/\\]default[/\\]?/gi, '"./')
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow["']/gi, '"."')
          .replace(/import\("[^"]*?resvg\.wasm"\)/gi, 'Promise.reject("WASM disabled")')
          .replace(/import\("[^"]*?yoga\.wasm"\)/gi, 'Promise.reject("WASM disabled")');
        
        if (patched !== content) {
          fs.writeFileSync(fullPath, patched, 'utf8');
        }
      } catch (e) {
        // Ignore unreadable binary or locked files
      }
    }
  });
}

if (fs.existsSync(sourceWorker)) {
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Copy worker.js -> assets/_worker.js
  fs.copyFileSync(sourceWorker, targetWorker);
  console.log('✅ Copied worker.js -> assets/_worker.js');

  // 2. Copy all required support directories into assets folder so relative imports resolve
  const dirsToCopy = ['cloudflare', 'middleware', 'server-functions', '.build', 'dynamodb-provider'];
  dirsToCopy.forEach((dirName) => {
    const src = path.join(openNextDir, dirName);
    const dest = path.join(assetsDir, dirName);
    if (fs.existsSync(src)) {
      copyFolderRecursiveSync(src, dest);
      console.log(`✅ Copied .open-next/${dirName} -> .open-next/assets/${dirName}`);
    }
  });

  // 3. Copy pre-rendered SSG HTML files to assets root directory for instant sub-10ms CDN serving
  const ssgAppDirs = [
    path.join(projectRootDir, '.next', 'server', 'app'),
    path.join(openNextDir, 'server-functions', 'default', '.next', 'server', 'app')
  ];
  ssgAppDirs.forEach(dir => copySsgHtmlFiles(dir, assetsDir));

  // 4. Copy server-functions/default/.next/server into node_modules/server for Turbopack chunk resolution
  const defaultNextServer = path.join(openNextDir, 'server-functions', 'default', '.next', 'server');
  if (fs.existsSync(defaultNextServer)) {
    const nodeModulesServer1 = path.join(assetsDir, 'server-functions', 'default', 'node_modules', 'server');
    const nodeModulesServer2 = path.join(assetsDir, 'node_modules', 'server');
    copyFolderRecursiveSync(defaultNextServer, nodeModulesServer1);
    copyFolderRecursiveSync(defaultNextServer, nodeModulesServer2);
    console.log('✅ Copied .next/server -> node_modules/server for Turbopack chunk resolution');
  }

  // 5. Sanitize absolute paths across all generated code and configs
  sanitizeAbsolutePathsInFolder(assetsDir);

  // 6. Patch _worker.js with error catch block for live diagnosis
  patchWorkerForDebug(targetWorker);

  console.log('🎉 Cloudflare Pages output directory .open-next/assets is fully prepared!');
} else {
  console.error('❌ Error: .open-next/worker.js not found!');
  process.exit(1);
}
