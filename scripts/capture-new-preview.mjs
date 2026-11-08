import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.preview-evidence');
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(output, { recursive: true });

// Start preview server on 4173
const previewServer = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
  cwd: root,
  shell: true,
  stdio: 'ignore'
});

await new Promise(r => setTimeout(r, 2000));

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=9338',
  `--user-data-dir=${path.join(output, 'capture-profile-new')}`,
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9338/json/new?about:blank', {
        method: 'PUT',
        signal: AbortSignal.timeout(1000)
      });
      endpoint = (await response.json()).webSocketDebuggerUrl;
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  socket = new WebSocket(endpoint);
  await new Promise((res, rej) => {
    socket.addEventListener('open', res, { once: true });
    socket.addEventListener('error', rej, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });

  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });

  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  const capture = async name => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
    console.log(`Saved screenshot: ${name}.png`);
  };

  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: 'http://127.0.0.1:4173' });

  await new Promise(r => setTimeout(r, 1500));
  await capture('remodeled-desktop-overview');

  // Click Research
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Research')); if (btn) btn.click(); })()`);
  await capture('remodeled-desktop-research');

  // Click Tasks
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Task')); if (btn) btn.click(); })()`);
  await capture('remodeled-desktop-tasks');

  // Click Syndicate Chat
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Chat')); if (btn) btn.click(); })()`);
  await capture('remodeled-desktop-chat');

  // Click System Architecture
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Architecture')); if (btn) btn.click(); })()`);
  await capture('remodeled-desktop-blueprint');

  // Mobile view test
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Dashboard')); if (btn) btn.click(); })()`);
  await capture('remodeled-mobile-overview');

} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill();
  previewServer.kill();
}
