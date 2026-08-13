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
        
        // 1. Copy as slug.html
        const destPathHtml = path.join(targetAssetsDir, cleanedRelPath);
        fs.mkdirSync(path.dirname(destPathHtml), { recursive: true });
        fs.copyFileSync(fullPath, destPathHtml);

        // 2. Copy as slug/index.html if not root index.html
        if (cleanedRelPath !== 'index.html' && cleanedRelPath !== 'page.html') {
          const slugName = cleanedRelPath.replace(/\.html$/, '');
          const destPathIndex = path.join(targetAssetsDir, slugName, 'index.html');
          fs.mkdirSync(path.dirname(destPathIndex), { recursive: true });
          fs.copyFileSync(fullPath, destPathIndex);
        }

        // Also copy corresponding .rsc if present
        const rscSrc = fullPath.replace(/\.html$/, '.rsc');
        if (fs.existsSync(rscSrc)) {
          fs.copyFileSync(rscSrc, destPathHtml.replace(/\.html$/, '.rsc'));
        }
      }
    });
  }

  traverse(srcAppDir);
  console.log(`✅ Copied pre-rendered SSG HTML files from ${path.relative(projectRootDir, srcAppDir)} to .open-next/assets`);
}

function patchWorkerAssetsFallback(workerPath) {
  if (!fs.existsSync(workerPath)) return;
  let content = fs.readFileSync(workerPath, 'utf8');

  const targetCode = `const { handler } = await import("./server-functions/default/handler.mjs");`;
  const replacementCode = `if (env && env.ASSETS) {
                try {
                    const urlObj = new URL(request.url);
                    const cleanPath = urlObj.pathname.endsWith("/") ? urlObj.pathname.slice(0, -1) : urlObj.pathname;
                    const targetPath = cleanPath === "" ? "/index.html" : (cleanPath.endsWith(".html") ? cleanPath : cleanPath + "/index.html");
                    const assetUrl = new URL(targetPath, request.url);
                    const assetResp = await env.ASSETS.fetch(new Request(assetUrl.href, { method: "GET" }));
                    if (assetResp && assetResp.status === 200) {
                        return assetResp;
                    }
                } catch (e) {}
            }
            const { handler } = await import("./server-functions/default/handler.mjs");`;

  if (content.includes(targetCode)) {
    content = content.replace(targetCode, replacementCode);
    fs.writeFileSync(workerPath, content, 'utf8');
    console.log('✅ Patched _worker.js with safe env.ASSETS static asset fallback handler');
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

  // 6. Patch _worker.js to serve static assets via safe env.ASSETS fallback
  patchWorkerAssetsFallback(targetWorker);

  console.log('🎉 Cloudflare Pages output directory .open-next/assets is fully prepared!');
} else {
  console.error('❌ Error: .open-next/worker.js not found!');
  process.exit(1);
}
