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

  // 4. Normalize absolute paths in required-server-files.json
  const reqFilesPaths = [
    path.join(openNextDir, 'server-functions', 'default', '.next', 'required-server-files.json'),
    path.join(assetsDir, 'server-functions', 'default', '.next', 'required-server-files.json')
  ];
  reqFilesPaths.forEach((reqPath) => {
    if (fs.existsSync(reqPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(reqPath, 'utf8'));
        data.appDir = ".";
        data.outputFileTracingRoot = ".";
        if (data.config) {
          data.config.outputFileTracingRoot = ".";
          if (data.config.turbopack) {
            data.config.turbopack.root = ".";
          }
        }
        fs.writeFileSync(reqPath, JSON.stringify(data, null, 2), 'utf8');
        console.log('✅ Normalized absolute paths in required-server-files.json');
      } catch (err) {
        console.error('Warning patching required-server-files.json:', err);
      }
    }
  });

  // 5. Patch absolute paths in handler.mjs if present
  const handlerPaths = [
    path.join(assetsDir, 'server-functions', 'default', 'handler.mjs'),
    path.join(assetsDir, '_worker.js')
  ];
  handlerPaths.forEach((handlerPath) => {
    if (fs.existsSync(handlerPath)) {
      let content = fs.readFileSync(handlerPath, 'utf8');
      content = content.replace(/import\("[^"]*?resvg\.wasm"\)/gi, 'Promise.reject("WASM disabled")');
      content = content.replace(/import\("[^"]*?yoga\.wasm"\)/gi, 'Promise.reject("WASM disabled")');
      fs.writeFileSync(handlerPath, content, 'utf8');
    }
  });
  console.log('✅ Patched handler.mjs absolute WASM path references');

  console.log('🎉 Cloudflare Pages output directory .open-next/assets is fully prepared!');
} else {
  console.error('❌ Error: .open-next/worker.js not found!');
  process.exit(1);
}
