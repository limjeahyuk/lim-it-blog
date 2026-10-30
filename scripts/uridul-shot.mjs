// 우리둘 데브로그 사진 찍기 (AGENTS.md §5-3).
// 로컬 우리둘(127.0.0.1:5173, npm run dev)과 로컬 Supabase 가 떠 있어야 합니다. 테스트 계정으로 로그인해서 390px 폰 폭(×3)으로 찍습니다.
//
//   node scripts/uridul-shot.mjs <outdir> <이름>=<#해시>[@스크롤Y] ...
//   WHO=partner@uridul.test node scripts/uridul-shot.mjs ...   ← 상대 계정으로
//   LS='js' / PRE='js'   ← 찍기 전에 localStorage 를 만지거나, 페이지마다 먼저 돌릴 스크립트
//
// 크롬은 Playwright 가 받아 둔 headless shell 을 씁니다 (~/Library/Caches/ms-playwright).
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';

const BIN = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const APP = process.env.APP || 'http://127.0.0.1:5173';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const [out, ...shots] = process.argv.slice(2);
const email = process.env.WHO || 'icon@uridul.test';
mkdirSync(out, { recursive: true });

const session = await fetch('http://127.0.0.1:54321/auth/v1/token?grant_type=password', {
  method: 'POST', headers: { apikey: ANON, 'content-type': 'application/json' },
  body: JSON.stringify({ email, password: 'test1234' }),
}).then(r => r.json());

const chrome = spawn(BIN, ['--remote-debugging-port=9333', '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  target = await fetch('http://127.0.0.1:9333/json').then(r => r.json()).then(l => l.find(t => t.type === 'page')).catch(() => null);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const wait = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); wait.get(m.id)?.(m.result); });
const cdp = (method, params = {}) => new Promise(r => { const id = ++seq; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); });

await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await cdp('Page.navigate', { url: APP + '/' });
await sleep(1500);
await cdp('Runtime.evaluate', { expression: `localStorage.setItem('sb-127-auth-token', ${JSON.stringify(JSON.stringify(session))})` });
if (process.env.LS) await cdp('Runtime.evaluate', { expression: process.env.LS });
if (process.env.PRE) await cdp('Page.enable'), await cdp('Page.addScriptToEvaluateOnNewDocument', { source: process.env.PRE });

for (const s of shots) {
  const i = s.indexOf('='), name = s.slice(0, i), rest = s.slice(i + 1);
  const [hash, y] = rest.split('@');
  await cdp('Page.navigate', { url: `${APP}/?r=${seq}${hash}` });
  await sleep(3500);
  if (y) { await cdp('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` }); await sleep(600); }
  const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${out}/${name}.png`, Buffer.from(data, 'base64'));
  console.log('saved', name);
}
ws.close(); chrome.kill();
