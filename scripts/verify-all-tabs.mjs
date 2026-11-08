import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const previewServer = spawn('npx', ['vite', 'preview', '--port', '4176', '--host', '127.0.0.1'], {
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
  '--remote-debugging-port=9341',
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9341/json/new?about:blank', {
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

  await command('Page.enable');
  await command('Page.navigate', { url: 'http://127.0.0.1:4176' });
  await new Promise(r => setTimeout(r, 1500));

  const tabs = [
    'Command Center',
    'Research & Theses',
    'Task Management',
    'Syndicate Chat',
    'Portfolio & ROI',
    'Staff & Directory',
    'Admin & RBAC Control',
    'System Architecture'
  ];

  for (const width of [360, 390, 414, 768, 1280]) {
    console.log(`\n=== TESTING VIEWPORT WIDTH: ${width}px ===`);
    await command('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: width < 900 });
    await new Promise(resolve => setTimeout(resolve, 300));

    for (const tabName of tabs) {
      // If mobile width, click hamburger menu first to open sidebar
      if (width < 900) {
        await evaluate(`(() => {
          const btn = document.querySelector('.mobile-menu-btn');
          if (btn) btn.click();
        })()`);
        await new Promise(r => setTimeout(r, 200));
      }

      // Click the tab in sidebar
      await evaluate(`(() => {
        const link = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('${tabName.split(' ')[0]}'));
        if (link) link.click();
      })()`);
      await new Promise(r => setTimeout(r, 250));

      // Measure document horizontal scroll & buttons
      const check = await evaluate(`(() => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const winInnerWidth = window.innerWidth;
        const hasHorizontalScroll = docScrollWidth > winInnerWidth;
        const buttons = [...document.querySelectorAll('button:not(.sidebar button)')].map(b => {
          const rect = b.getBoundingClientRect();
          return {
            text: (b.innerText || b.getAttribute('aria-label') || '').trim().replace(/\\n/g, ' '),
            offscreenRight: rect.right > winInnerWidth + 1,
            offscreenLeft: rect.left < -1
          };
        });
        const offscreen = buttons.filter(b => b.offscreenRight || b.offscreenLeft);
        return {
          hasHorizontalScroll,
          overflowDelta: docScrollWidth - winInnerWidth,
          offscreenCount: offscreen.length,
          offscreen
        };
      })()`);

      const status = (!check.hasHorizontalScroll && check.offscreenCount === 0) ? 'PASSED (0px overflow, 0 offscreen)' : `FAILED (overflow: ${check.overflowDelta}px, offscreen: ${check.offscreenCount})`;
      console.log(`  Tab [${tabName}]: ${status}`);
      if (check.offscreenCount > 0) {
        console.log(`    Offscreen buttons:`, check.offscreen);
      }
    }
  }

} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill();
  previewServer.kill();
}
