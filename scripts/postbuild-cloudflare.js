const fs = require('fs');
const path = require('path');

const openNextWorker = path.join(__dirname, '..', '.open-next', 'worker.js');
const targetWorker = path.join(__dirname, '..', '.open-next', 'assets', '_worker.js');

if (fs.existsSync(openNextWorker)) {
  const assetsDir = path.dirname(targetWorker);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  fs.copyFileSync(openNextWorker, targetWorker);
  console.log('✅ Copied .open-next/worker.js -> .open-next/assets/_worker.js for Cloudflare Pages Advanced Worker deployment!');
} else {
  console.log('⚠️ .open-next/worker.js not found');
}
