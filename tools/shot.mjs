// 用独立 headless Chrome + CDP 截图，不干扰用户正在用的浏览器。
// 用法：
//   node tools/shot.mjs --url http://127.0.0.1:4399/resume/ --out shot.png
//   node tools/shot.mjs --url ... --out shot.png --w 390 --h 844 --mobile
//   node tools/shot.mjs --url ... --out shot.png --scroll 1760
//   node tools/shot.mjs --url ... --out shot.png --full
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const argv = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce((acc, cur, i, arr) => {
      if (cur.startsWith("--")) {
        const next = arr[i + 1];
        acc.push([cur.slice(2), next && !next.startsWith("--") ? next : true]);
      }
      return acc;
    }, []),
);

const url = argv.url ?? "http://127.0.0.1:4399/resume/";
const out = argv.out ?? "shot.png";
const width = Number(argv.w ?? 1280);
const height = Number(argv.h ?? 800);
const mobile = Boolean(argv.mobile);
const scrollY = Number(argv.scroll ?? 0);
const full = Boolean(argv.full);
const waitMs = Number(argv.wait ?? 1500);
const port = 9400 + Math.floor(Math.random() * 200);

const profile = mkdtempSync(join(tmpdir(), "dsh-shot-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-prefers-reduced-motion",
    "--no-first-run",
    "--no-default-browser-check",
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
      if (res.ok) return res.json();
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

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  if (mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

  const loaded = new Promise((resolve) => {
    const onMsg = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === "Page.loadEventFired") {
        ws.removeEventListener("message", onMsg);
        resolve();
      }
    };
    ws.addEventListener("message", onMsg);
  });
  await send("Page.navigate", { url });
  await Promise.race([loaded, sleep(8000)]);
  await sleep(waitMs);

  if (scrollY) {
    await send("Runtime.evaluate", { expression: `window.scrollTo({top:${scrollY},behavior:'instant'})` });
    await sleep(350);
  }

  const params = { format: "png" };
  if (full) {
    const metrics = await send("Page.getLayoutMetrics");
    const size = metrics.cssContentSize ?? metrics.contentSize;
    params.clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
    params.captureBeyondViewport = true;
  } else {
    const y = scrollY || 0;
    params.clip = { x: 0, y, width, height, scale: 1 };
    params.captureBeyondViewport = true;
  }
  const shot = await send("Page.captureScreenshot", params);
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log("saved", out);
  ws.close();
  finish(0);
} catch (err) {
  console.error("shot failed:", err.message);
  finish(1);
}
