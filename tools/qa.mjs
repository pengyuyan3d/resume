// 页面体检：控制台报错、坏图、坏链接、标题结构、重复 id。
// 用法：node tools/check.mjs http://127.0.0.1:4399/resume/
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = process.argv[2] ?? "http://127.0.0.1:4399/resume/";
const port = 9500 + Math.floor(Math.random() * 200);
const profile = mkdtempSync(join(tmpdir(), "dsh-check-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-prefers-reduced-motion",
    "--no-first-run",
    "--disable-extensions",
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevtools() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {}
    await sleep(120);
  }
  throw new Error("devtools not ready");
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
}

const finish = (code = 0) => {
  try {
    chrome.kill();
  } catch {}
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {}
  process.exit(code);
};

try {
  await waitForDevtools();
  const created = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
  const ws = new WebSocket(created.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });
  const send = cdp(ws);

  const issues = [];
  const logs = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Runtime.exceptionThrown") {
      issues.push("异常: " + msg.params.exceptionDetails.text);
    }
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      logs.push(msg.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
    }
    if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400) {
      issues.push(`HTTP ${msg.params.response.status}: ${msg.params.response.url}`);
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url });
  await sleep(2200);

  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text);
    return res.result.value;
  };

  const report = await evaluate(`(() => {
    const imgs = [...document.images].map(i => ({src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, alt: i.alt}));
    const broken = imgs.filter(i => !i.ok);
    const noAlt = imgs.filter(i => i.ok && !i.alt);
    const counts = {};
    document.querySelectorAll('[id]').forEach(el => counts[el.id] = (counts[el.id]||0)+1);
    const dupIds = Object.entries(counts).filter(([,n]) => n > 1).map(([k]) => k);
    const ids = new Set(Object.keys(counts));
    const badAnchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h !== '#' && !ids.has(h.slice(1)));
    const emptyLinks = [...document.querySelectorAll('a')].filter(a => !a.getAttribute('href')).length;
    const h1 = [...document.querySelectorAll('h1')].map(h => h.textContent.trim());
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName);
    let orderBad = null;
    for (let i = 1; i < headings.length; i++) {
      if (Number(headings[i][1]) - Number(headings[i-1][1]) > 1) { orderBad = headings.slice(Math.max(0,i-2), i+1).join(' > '); break; }
    }
    const contacts = [...document.querySelectorAll('button,a')].filter(el => !el.textContent.trim() && !el.getAttribute('aria-label') && !el.querySelector('svg, img')).length;
    return {
      title: document.title,
      desc: (document.querySelector('meta[name=description]')||{}).content?.length || 0,
      imgs: imgs.length, broken, noAlt, dupIds, badAnchors, emptyLinks, h1, orderBad, contacts,
      textLength: document.body.innerText.replace(/\\s+/g,' ').length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
        ? document.documentElement.scrollWidth + ' > ' + window.innerWidth : null,
      url: location.href,
    };
  })()`);

  console.log(JSON.stringify({ ...report, consoleErrors: logs, issues }, null, 2));
  ws.close();
  finish(issues.length || report.broken.length || report.dupIds.length ? 1 : 0);
} catch (err) {
  console.error("check failed:", err.message);
  finish(1);
}
