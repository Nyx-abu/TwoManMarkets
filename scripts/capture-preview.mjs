import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.preview-evidence');
const origin = process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(output, { recursive: true });
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=9337', `--user-data-dir=${path.join(output, 'capture-profile')}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let endpoint;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:9337/json/new?about:blank', { method: 'PUT', signal: AbortSignal.timeout(1000) });
      endpoint = (await response.json()).webSocketDebuggerUrl;
      break;
    } catch {
      if (attempt === 39) throw new Error('Headless Chrome debugging endpoint did not become ready.');
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
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
    await new Promise(resolve => setTimeout(resolve, 300));
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
    const metrics = await evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth,title:document.title})');
    console.log(JSON.stringify({ name, ...metrics }));
    if (metrics.document > metrics.viewport) throw new Error(`${name}: horizontal document overflow`);
  };
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: origin });
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await evaluate('!!document.querySelector(".nav-item")')) break;
    if (attempt === 49) throw new Error('Preview navigation did not render.');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const page of ['Overview', 'Research', 'Tasks', 'Chat & updates', 'Analytics', 'Team', 'Admin']) {
    const clicked = await evaluate(`(() => {const b=[...document.querySelectorAll('.nav-item')].find(b=>b.textContent.includes(${JSON.stringify(page)})); if(!b)return false;b.click();return true;})()`);
    if (!clicked) throw new Error(`Missing navigation: ${page}`);
    await capture(`desktop-${page.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`);
  }
  await evaluate("[...document.querySelectorAll('.nav-item')].find(b=>b.textContent.includes('Overview')).click()");
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await capture('mobile-overview');
  for (const page of ['Research', 'Tasks', 'Chat & updates', 'Analytics', 'Team', 'Admin']) {
    await evaluate(`[...document.querySelectorAll('.nav-item')].find(b=>b.textContent.includes(${JSON.stringify(page)})).click()`);
    await capture(`mobile-${page.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`);
  }
  await evaluate("[...document.querySelectorAll('.nav-item')].find(b=>b.textContent.includes('Research')).click()");
  const opened = await evaluate("(() => {const b=document.querySelector('.research-table tbody tr button, .research-table tbody tr, tbody tr button');if(!b)return false;b.click();return true;})()");
  if (opened) {
    await capture('mobile-research-detail');
    await command('Emulation.setDeviceMetricsOverride', { width: 320, height: 568, deviceScaleFactor: 1, mobile: true });
    await capture('small-research-detail');
    const modal = await evaluate("(() => {const e=document.querySelector('[role=dialog]'); if(!e)return null;const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:innerHeight,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight};})()");
    console.log(JSON.stringify({ modal }));
    if (modal && (modal.top < 0 || modal.bottom > modal.height)) throw new Error('Research dialog is outside the small viewport.');
  }
  else console.log('Research detail capture skipped: no matching detail trigger.');
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill();
}
