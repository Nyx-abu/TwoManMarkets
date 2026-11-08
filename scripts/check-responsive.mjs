import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.preview-evidence');
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const previewServer = spawn('npx', ['vite', 'preview', '--port', '4174', '--host', '127.0.0.1'], {
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
  '--remote-debugging-port=9339',
  `--user-data-dir=${path.join(output, 'capture-profile-responsive')}`,
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9339/json/new?about:blank', {
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

  const capture = async (name, width, height) => {
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
    console.log(`Captured: ${name}.png (${width}x${height})`);
  };

  await command('Page.enable');
  await command('Page.navigate', { url: 'http://127.0.0.1:4174' });
  await new Promise(r => setTimeout(r, 1500));

  // Tablet (iPad 768px and 820px)
  await capture('test-tablet-768-overview', 768, 1024);
  await capture('test-tablet-820-overview', 820, 1180);

  // Phone (iPhone 390px)
  await capture('test-mobile-390-overview', 390, 844);

  // Mobile Research
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Research')); if (btn) btn.click(); })()`);
  await capture('test-mobile-390-research', 390, 844);

  // Mobile Tasks
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Task')); if (btn) btn.click(); })()`);
  await capture('test-mobile-390-tasks', 390, 844);

  // Mobile Chat
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Chat')); if (btn) btn.click(); })()`);
  await capture('test-mobile-390-chat', 390, 844);

} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill();
  previewServer.kill();
}
