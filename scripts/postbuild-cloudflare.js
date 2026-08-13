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
    // Skip node_modules inside server-functions to prevent exceeding 20k file limit
    if (file === 'node_modules') return;

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
  let copiedCount = 0;

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
        
        let destPath;
        if (cleanedRelPath === 'index.html' || cleanedRelPath === 'page.html') {
          destPath = path.join(targetAssetsDir, 'index.html');
        } else {
          const slugName = cleanedRelPath.replace(/\.html$/, '');
          destPath = path.join(targetAssetsDir, slugName, 'index.html');
        }

        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        // Copy ONCE as slug/index.html (no duplicate files to stay under 20k Cloudflare file limit)
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(fullPath, destPath);
          copiedCount++;
        }
      }
    });
  }

  traverse(srcAppDir);
  console.log(`✅ Copied ${copiedCount} pre-rendered SSG HTML files to .open-next/assets`);
}

function patchWorkerAssetsFallback(workerPath) {
  if (!fs.existsSync(workerPath)) return;
  let content = fs.readFileSync(workerPath, 'utf8');

  const targetCode = `const { handler } = await import("./server-functions/default/handler.mjs");`;
  const replacementCode = `if (env && env.ASSETS) {
                try {
                    // 1. Try direct fetch for raw assets (CSS, JS chunks, images, fonts)
                    let assetResp = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
                    if (assetResp && assetResp.status === 200) {
                        return assetResp;
                    }
                    // 2. If direct fetch fails and route has no extension, try cleanPath + "/index.html" (for SSG HTML pages)
                    const urlObj = new URL(request.url);
                    if (!urlObj.pathname.includes(".")) {
                        const cleanPath = urlObj.pathname.endsWith("/") ? urlObj.pathname.slice(0, -1) : urlObj.pathname;
                        const targetPath = cleanPath === "" ? "/index.html" : cleanPath + "/index.html";
                        const assetUrl = new URL(targetPath, request.url);
                        assetResp = await env.ASSETS.fetch(new Request(assetUrl.href, { method: "GET" }));
                        if (assetResp && assetResp.status === 200) {
                            return assetResp;
                        }
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
  // Wipe existing assets folder so old files/duplicates are completely removed
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Copy worker.js -> assets/_worker.js
  fs.copyFileSync(sourceWorker, targetWorker);
  console.log('✅ Copied worker.js -> assets/_worker.js');

  // 2. Copy all required support directories into assets folder (skipping node_modules)
  const dirsToCopy = ['cloudflare', 'middleware', 'server-functions', '.build', 'dynamodb-provider'];
  dirsToCopy.forEach((dirName) => {
    const src = path.join(openNextDir, dirName);
    const dest = path.join(assetsDir, dirName);
    if (fs.existsSync(src)) {
      copyFolderRecursiveSync(src, dest);
      console.log(`✅ Copied .open-next/${dirName} -> .open-next/assets/${dirName}`);
    }
  });

  // 3. Copy pre-rendered SSG HTML files ONCE as slug/index.html to stay under 20k Cloudflare file limit
  const ssgAppDirs = [
    path.join(projectRootDir, '.next', 'server', 'app'),
    path.join(openNextDir, 'server-functions', 'default', '.next', 'server', 'app')
  ];
  ssgAppDirs.forEach(dir => copySsgHtmlFiles(dir, assetsDir));

  // 4. Copy server-functions/default/.next/server into server-functions/default/server for Turbopack chunk resolution
  const defaultNextServer = path.join(openNextDir, 'server-functions', 'default', '.next', 'server');
  if (fs.existsSync(defaultNextServer)) {
    const serverChunksDest = path.join(assetsDir, 'server-functions', 'default', 'server');
    copyFolderRecursiveSync(defaultNextServer, serverChunksDest);
    console.log('✅ Copied .next/server -> server-functions/default/server for Turbopack chunk resolution');
  }

  // 5. Sanitize absolute paths across all generated code and configs
  sanitizeAbsolutePathsInFolder(assetsDir);

  // 6. Patch _worker.js to serve static assets via safe env.ASSETS fallback
  patchWorkerAssetsFallback(targetWorker);

  // 7. Verify total file count in .open-next/assets is under 20,000 Cloudflare limit
  let totalFiles = 0;
  function countFiles(dir) {
    fs.readdirSync(dir).forEach((f) => {
      const p = path.join(dir, f);
      if (fs.lstatSync(p).isDirectory()) countFiles(p);
      else totalFiles++;
    });
  }
  countFiles(assetsDir);
  console.log(`📊 Total files in .open-next/assets: ${totalFiles} (Limit: 20,000)`);

  if (totalFiles > 20000) {
    console.error(`❌ Error: Total files ${totalFiles} exceeds Cloudflare Pages 20,000 file limit!`);
    process.exit(1);
  }

  console.log('🎉 Cloudflare Pages output directory .open-next/assets is fully prepared and verified!');
} else {
  console.error('❌ Error: .open-next/worker.js not found!');
  process.exit(1);
}
