import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.preview-evidence');
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

await mkdir(output, { recursive: true });

const previewServer = spawn('npx', ['vite', 'preview', '--port', '4175', '--host', '127.0.0.1'], {
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
  '--remote-debugging-port=9340',
  `--user-data-dir=${path.join(output, 'capture-profile-verify')}`,
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9340/json/new?about:blank', {
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
    await new Promise(resolve => setTimeout(resolve, 400));
    const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
  };

  await command('Page.enable');
  await command('Page.navigate', { url: 'http://127.0.0.1:4175' });
  await new Promise(r => setTimeout(r, 1500));

  const testViewports = [
    { name: 'phone-360', width: 360, height: 740 },
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 800 }
  ];

  console.log('--- RESPONSIVE VERIFICATION SUITE ---');

  for (const vp of testViewports) {
    await command('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.width < 600 });
    await new Promise(resolve => setTimeout(resolve, 400));

    const check = await evaluate(`(() => {
      const docScrollWidth = document.documentElement.scrollWidth;
      const winInnerWidth = window.innerWidth;
      const hasHorizontalScroll = docScrollWidth > winInnerWidth;

      // Find all buttons in topbar and page-header
      const buttons = [...document.querySelectorAll('header button, .page-header button')].map(b => {
        const rect = b.getBoundingClientRect();
        return {
          text: (b.innerText || b.getAttribute('aria-label') || '').trim().replace(/\\n/g, ' '),
          rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
          offscreenRight: rect.right > winInnerWidth + 1,
          offscreenLeft: rect.left < -1
        };
      });

      return {
        winInnerWidth,
        docScrollWidth,
        hasHorizontalScroll,
        overflowDelta: docScrollWidth - winInnerWidth,
        buttons
      };
    })()`);

    console.log(`Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`  Horizontal Scroll: ${check.hasHorizontalScroll ? 'FAILED (overflow: ' + check.overflowDelta + 'px)' : 'PASSED (0px overflow)'}`);
    
    const offscreen = check.buttons.filter(b => b.offscreenRight || b.offscreenLeft);
    if (offscreen.length > 0) {
      console.log(`  Offscreen buttons: ${JSON.stringify(offscreen)}`);
    } else {
      console.log(`  All ${check.buttons.length} header/topbar buttons fully on-screen.`);
    }

    await capture(`verified-${vp.name}-overview`, vp.width, vp.height);
  }

  // Also test clicking to Research on phone-360
  await command('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
  // Open mobile menu
  await evaluate(`(() => { const btn = document.querySelector('.mobile-menu-btn'); if (btn) btn.click(); })()`);
  await new Promise(r => setTimeout(r, 300));
  await capture('verified-phone-360-menu-open', 360, 740);

  // Click Research
  await evaluate(`(() => { const btn = [...document.querySelectorAll('.nav-link')].find(b => b.textContent.includes('Research')); if (btn) btn.click(); })()`);
  await new Promise(r => setTimeout(r, 400));
  await capture('verified-phone-360-research', 360, 740);

  // Check research horizontal scroll
  const researchCheck = await evaluate(`(() => {
    return {
      docScrollWidth: document.documentElement.scrollWidth,
      winInnerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  })()`);
  console.log(`Research Page (360px): ${researchCheck.hasOverflow ? 'FAILED (overflow)' : 'PASSED (0px overflow)'}`);

} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill();
  previewServer.kill();
}
