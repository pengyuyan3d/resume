// 跨平台（Windows / Linux CI）自动将构建后的 /resume/resume/ 打印为一页超链接 PDF，并可选更新 og-cover.jpg 与截图验收
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const PUBLIC = resolve(ROOT, "public");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error("Chrome/Chromium executable not found");
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".json": "application/json; charset=utf-8",
};

function startDistServer() {
  return new Promise((resolveServer) => {
    const srv = createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        if (urlPath.startsWith("/resume")) {
          urlPath = urlPath.slice("/resume".length) || "/";
        }
        let file = join(DIST, normalize(urlPath).replace(/^(\.\.[/\\])+/, ""));
        if (existsSync(file) && statSync(file).isDirectory()) {
          file = join(file, "index.html");
        }
        if (!existsSync(file)) {
          res.writeHead(404);
          res.end("404");
          return;
        }
        res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
        res.end(readFileSync(file));
      } catch {
        res.writeHead(500);
        res.end("500");
      }
    });
    srv.listen(0, "127.0.0.1", () => {
      resolveServer({ srv, port: srv.address().port });
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cdpClient(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: res, reject: rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    }
  });
  return (method, params = {}) =>
    new Promise((res, rej) => {
      const mid = ++id;
      pending.set(mid, { resolve: res, reject: rej });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
}

const { srv, port: httpPort } = await startDistServer();
const debugPort = 9600 + Math.floor(Math.random() * 200);
const profile = mkdtempSync(join(tmpdir(), "resume-pdf-"));
const chromeBin = findChrome();

const chrome = spawn(
  chromeBin,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-prefers-reduced-motion",
    "--no-first-run",
    "--disable-extensions",
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${debugPort}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);

try {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (r.ok) break;
    } catch {}
    await sleep(120);
  }

  const tab = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });
  const send = cdpClient(ws);
  await send("Page.enable");
  await send("Runtime.enable");

  // 1. Export A4 Resume PDF
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 1600, deviceScaleFactor: 2, mobile: false });
  await send("Page.navigate", { url: `http://127.0.0.1:${httpPort}/resume/resume/` });
  await sleep(1200);
  const pdfRes = await send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  const pdfBuf = Buffer.from(pdfRes.data, "base64");
  writeFileSync(join(PUBLIC, "resume.pdf"), pdfBuf);
  writeFileSync(join(DIST, "resume.pdf"), pdfBuf);
  console.log(`Exported resume.pdf (${(pdfBuf.length / 1024).toFixed(1)} KB)`);

  // 2. If --shots passed, also refresh og-cover.jpg & verification screenshots
  if (process.argv.includes("--shots")) {
    await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 2, mobile: false });
    await send("Page.navigate", { url: `http://127.0.0.1:${httpPort}/resume/` });
    await sleep(1500);
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    const ogRes = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
    const ogBuf = Buffer.from(ogRes.data, "base64");
    writeFileSync(join(PUBLIC, "og-cover.jpg"), ogBuf);
    writeFileSync(join(DIST, "og-cover.jpg"), ogBuf);
    console.log(`Updated og-cover.jpg (${(ogBuf.length / 1024).toFixed(1)} KB)`);

    const scratchShots = process.env.SHOT_OUT_DIR;
    if (scratchShots) {
      mkdirSync(scratchShots, { recursive: true });
      await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1.5, mobile: false });
      await send("Page.navigate", { url: `http://127.0.0.1:${httpPort}/resume/` });
      await sleep(1200);
      const desktopHero = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(scratchShots, "verify-desktop.png"), Buffer.from(desktopHero.data, "base64"));

      await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
      await send("Page.navigate", { url: `http://127.0.0.1:${httpPort}/resume/` });
      await sleep(1000);
      const mobileHero = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(scratchShots, "verify-mobile.png"), Buffer.from(mobileHero.data, "base64"));
      console.log("Saved verification screenshots to", scratchShots);
    }
  }

  // 3. Run QA checks across all 3 pages
  for (const route of ["/resume/", "/resume/profile/", "/resume/resume/"]) {
    await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `http://127.0.0.1:${httpPort}${route}` });
    await sleep(900);
    const qa = await send("Runtime.evaluate", {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
        await new Promise(r => setTimeout(r, 500));
        const imgs = [...document.images].filter(i => !i.hidden && i.getAttribute('src'));
        const broken = imgs.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.src);
        const counts = {};
        document.querySelectorAll('[id]').forEach(el => counts[el.id] = (counts[el.id]||0)+1);
        const dupIds = Object.entries(counts).filter(([,n]) => n > 1).map(([k]) => k);
        const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
        return { route: "${route}", imgs: imgs.length, brokenCount: broken.length, broken, dupIds, overflowX };
      })()`,
    });
    console.log("[QA]", JSON.stringify(qa.result.value));
    if (qa.result.value.brokenCount > 0 || qa.result.value.dupIds.length > 0 || qa.result.value.overflowX) {
      throw new Error("QA check failed on " + route);
    }
  }

  ws.close();
} finally {
  try { chrome.kill(); } catch {}
  try { srv.close(); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
