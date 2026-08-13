const fs = require('fs');
const path = require('path');

const openNextDir = path.join(__dirname, '..', '.open-next');
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
        // Replace Windows absolute paths like C:\Users\... or C:/Users/... with "."
        const patched = content
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow[/\\]\.open-next[/\\]assets[/\\]?/gi, '"./')
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow[/\\]\.open-next[/\\]server-functions[/\\]default[/\\]?/gi, '"./')
          .replace(/["'][A-Za-z]:[/\\]Users[/\\][^"']*?[/\\]GradeFlow["']/gi, '"."')
          .replace(/import\("[^"]*?resvg\.wasm"\)/gi, 'Promise.reject("WASM disabled")')
          .replace(/import\("[^"]*?yoga\.wasm"\)/gi, 'Promise.reject("WASM disabled")');
        
        if (patched !== content) {
          fs.writeFileSync(fullPath, patched, 'utf8');
          console.log(`✅ Stripped absolute paths from: ${path.relative(assetsDir, fullPath)}`);
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

  // 3. Copy server-functions/default/.next/server into node_modules/server for Turbopack chunk resolution
  const defaultNextServer = path.join(openNextDir, 'server-functions', 'default', '.next', 'server');
  if (fs.existsSync(defaultNextServer)) {
    const nodeModulesServer1 = path.join(assetsDir, 'server-functions', 'default', 'node_modules', 'server');
    const nodeModulesServer2 = path.join(assetsDir, 'node_modules', 'server');
    copyFolderRecursiveSync(defaultNextServer, nodeModulesServer1);
    copyFolderRecursiveSync(defaultNextServer, nodeModulesServer2);
    console.log('✅ Copied .next/server -> node_modules/server for Turbopack chunk resolution');
  }

  // 4. Sanitize absolute paths across all generated code and configs
  sanitizeAbsolutePathsInFolder(assetsDir);

  console.log('🎉 Cloudflare Pages output directory .open-next/assets is fully prepared!');
} else {
  console.error('❌ Error: .open-next/worker.js not found!');
  process.exit(1);
}
