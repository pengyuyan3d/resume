// 生成作品集首屏的「雨岛」插画地图：晴天海面 + 沙滩草地 + 四座基点的建筑与小人。
// 用法：node tools/gen-map.mjs  → public/island.svg
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/island.svg");

const W = 1200;
const H = 780;
const CX = 596;
const CY = 408;
const KX = 0.866;
const KY = 0.5;

const n = (v) => Math.round(v * 10) / 10;
const pt = ([x, y]) => `${n(x)},${n(y)}`;
const poly = (pts, fill, extra = "") => `<polygon points="${pts.map(pt).join(" ")}" fill="${fill}" ${extra}/>`;

const rnd = (() => {
  let a = 20261118;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

function blob(cx, cy, rx, ry, wob = 0.03, phase = 0, steps = 120) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const k = 1 + wob * Math.sin(3 * t + phase) + wob * 0.55 * Math.sin(5 * t + phase * 2.3);
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  return pts;
}
const d = (pts) => `M${pts.map(pt).join(" L")} Z`;

function proj(cx, cy, x, y, z = 0) {
  return [cx + (x - y) * KX, cy + (x + y) * KY - z];
}

function box(cx, cy, ex, ey, h, c) {
  const p = (x, y, z) => proj(cx, cy, x, y, z);
  const A1 = p(-ex, -ey, h), B1 = p(ex, -ey, h), C1 = p(ex, ey, h), D1 = p(-ex, ey, h);
  const B0 = p(ex, -ey, 0), C0 = p(ex, ey, 0), D0 = p(-ex, ey, 0);
  return `${poly([D1, C1, C0, D0], c.left)}${poly([B1, C1, C0, B0], c.right)}${poly([A1, B1, C1, D1], c.top)}`;
}

/* ---------- 树 ---------- */
function tree(x, y, s = 1, tone = 0) {
  const greens = ["#8fbf6c", "#7fb35f", "#96c574", "#78ab58"][tone % 4];
  const dark = ["#6b9e4f", "#5f8f45", "#72a457", "#578840"][tone % 4];
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">
    <ellipse cx="6" cy="3" rx="17" ry="6" fill="#a9814f" opacity=".24"/>
    <rect x="-2" y="-12" width="4" height="14" rx="1.5" fill="#a87c4f"/>
    <circle cx="0" cy="-18" r="13" fill="${dark}"/>
    <circle cx="0" cy="-22" r="11" fill="${greens}"/>
    <circle cx="-5" cy="-26" r="7" fill="${greens}" opacity=".95"/>
    <circle cx="5" cy="-24" r="6" fill="${dark}" opacity=".55"/>
    <circle cx="-3" cy="-29" r="4" fill="#b9dc96" opacity=".7"/>
  </g>`;
}

function bush(x, y, s = 1) {
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">
    <ellipse cx="2" cy="2" rx="10" ry="3.6" fill="#a9814f" opacity=".22"/>
    <circle cx="0" cy="0" r="7" fill="#7fb35f"/>
    <circle cx="-2" cy="-2" r="4.6" fill="#96c574"/>
  </g>`;
}

function rock(x, y, s = 1) {
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">
    <ellipse cx="1" cy="2" rx="7" ry="2.6" fill="#a9814f" opacity=".22"/>
    <path d="M-6 0 Q-3 -7 3 -5 Q7 -3 6 1 Z" fill="#c9b48c"/>
    <path d="M-6 0 Q-3 -7 1 -6 Q-1 -2 -6 0 Z" fill="#dccaa6"/>
  </g>`;
}

/* ---------- 小人 ---------- */
function person(x, y, s = 1, shirt = "#e05a3a", flip = false) {
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${flip ? -s : s} ${s})">
    <ellipse cx="0" cy="1" rx="4.6" ry="1.8" fill="#a9814f" opacity=".3"/>
    <path d="M-3.4 -9 Q0 -11 3.4 -9 L2.4 -2 L-2.4 -2 Z" fill="${shirt}"/>
    <circle cx="0" cy="-13.4" r="2.9" fill="#f0c9a4"/>
    <path d="M-0.6 -16.4 Q2.8 -16.8 3.2 -13.6 Q0.6 -15 -0.6 -16.4 Z" fill="#3d3a33"/>
    <rect x="-2.2" y="-2.2" width="1.7" height="2.4" rx=".8" fill="#4a5a63"/>
    <rect x="0.6" y="-2.2" width="1.7" height="2.4" rx=".8" fill="#4a5a63"/>
  </g>`;
}

/* ---------- 四座基点 ---------- */
function harbor() {
  const x = 398, y = 486;
  let s = `<g>
    <ellipse cx="${x}" cy="${y + 26}" rx="58" ry="19" fill="#a9814f" opacity=".22"/>`;
  s += box(x, y, 44, 26, 34, { top: "#e6d3b0", left: "#e0cba4", right: "#f7edd9" });
  // 屋顶
  const p = (dx, dy, z) => proj(x, y, dx, dy, z);
  const A = p(-44, -26, 34), B = p(44, -26, 34), C = p(44, 26, 34), Dc = p(-44, 26, 34);
  const apex = [x + 2, y - 34 - 22];
  s += poly([Dc, C, apex], "#c25b3d") + poly([C, B, apex], "#d9704f") + poly([A, B, apex], "#a94a31");
  // 门与窗
  s += `<path d="M${x + 6} ${y + 6} L${x + 24} ${y + 16} L${x + 24} ${y + 30} L${x + 6} ${y + 20} Z" fill="#8a5f38"/>`;
  s += `<circle cx="${x + 36}" cy="${y + 16}" r="4" fill="#ffd479"/>`;
  // 码头：从岸边伸进浅水的木栈桥
  s += `<g transform="rotate(148 392 554)">
      <rect x="392" y="548" width="72" height="12" rx="2" fill="#d8b782"/>
      <rect x="392" y="548" width="72" height="4" rx="2" fill="#ead2a4"/>
    </g>
    <g stroke="#9a7444" stroke-width="2.6" stroke-linecap="round">
      <path d="M344 592 v13"/><path d="M362 583 v13"/>
    </g>`;
  return s + `</g>`;
}

function workshop() {
  const x = 745, y = 472;
  let s = `<g>
    <ellipse cx="${x}" cy="${y + 26}" rx="56" ry="18" fill="#a9814f" opacity=".22"/>`;
  s += box(x, y, 42, 25, 30, { top: "#e6d3b0", left: "#e0cba4", right: "#f7edd9" });
  // 人字屋顶
  {
    const p = (dx, dy, z) => proj(x, y, dx, dy, z);
    const A = p(-42, -25, 30), B = p(42, -25, 30), C = p(42, 25, 30), Dc = p(-42, 25, 30);
    const apex = [x + 2, y - 30 - 20];
    s += poly([Dc, C, apex], "#c25b3d") + poly([C, B, apex], "#d9704f") + poly([A, B, apex], "#a94a31");
  }
  // 烟囱
  s += box(x + 30, y - 8, 7, 7, 44, { top: "#cfd6cd", left: "#e2e7de", right: "#f6f8f2" });
  s += `<g class="smoke" transform="translate(${x + 34} ${y - 58})">
      <circle r="5" fill="#eef5ef"/><circle r="7" fill="#eef5ef"/><circle r="9" fill="#eef5ef"/>
    </g>`;
  // 门窗
  s += `<path d="M${x - 4} ${y + 4} L${x + 16} ${y + 14} L${x + 16} ${y + 26} L${x - 4} ${y + 16} Z" fill="#8a5f38"/>`;
  s += `<circle cx="${x - 26}" cy="${y + 8}" r="4.2" fill="#ffd479"/>`;
  return s + `</g>`;
}

function lighthouse() {
  const x = 550, y = 286;
  const top = y - 96;
  let s = `<g>
    <ellipse cx="${x}" cy="${y + 8}" rx="26" ry="9" fill="#a9814f" opacity=".22"/>
    <ellipse cx="${x}" cy="${y + 2}" rx="24" ry="8" fill="#dccaa6"/>
    <path d="M${x - 15} ${y - 2} L${x - 10} ${top + 8} L${x + 10} ${top + 8} L${x + 15} ${y - 2} Z" fill="#fbf4e4"/>
    <path d="M${x - 14} ${y - 26} L${x - 11.4} ${top + 26} L${x + 11.4} ${top + 26} L${x + 14} ${y - 26} Z" fill="#e05a3a" opacity=".9"/>
    <path d="M${x - 15} ${y - 2} L${x - 2} ${y - 2} L${x - 2} ${top + 8} L${x - 10} ${top + 8} Z" fill="#d9c8a6" opacity=".55"/>
    <rect x="${x - 13}" y="${top + 2}" width="26" height="8" rx="2" fill="#4a5a63"/>
    <circle cx="${x}" cy="${top + 6}" r="5.5" fill="#ffd479"/>
    <path d="M${x - 14} ${top + 2} L${x} ${top - 16} L${x + 14} ${top + 2} Z" fill="#e05a3a"/>
    <path d="M${x} ${top + 6} L${x - 40} ${top - 18} L${x - 40} ${top + 12} Z" fill="#ffe7a8" opacity=".22"/>
    <path d="M${x} ${top + 6} L${x + 40} ${top - 18} L${x + 40} ${top + 12} Z" fill="#ffe7a8" opacity=".22"/>
  </g>`;
  return s;
}

function camp() {
  const x = 831, y = 528;
  const tent = (tx, ty, s, a, b) => `<g transform="translate(${n(tx)} ${n(ty)}) scale(${s})">
      <ellipse cx="3" cy="4" rx="22" ry="7" fill="#a9814f" opacity=".22"/>
      <path d="M-20 2 L0 -24 L20 2 Z" fill="${a}"/>
      <path d="M0 -24 L8 2 L-20 2 Z" fill="${b}"/>
      <path d="M0 -24 L4 2 L-5 2 Z" fill="#8a5f38" opacity=".5"/>
      <path d="M0 -24 L0 -32" stroke="#a87c4f" stroke-width="1.6"/>
    </g>`;
  let s = `<g>`;
  s += tent(x - 26, y - 6, 1, "#fff6e3", "#f4e3c4");
  s += tent(x + 26, y + 8, 0.82, "#a8ded6", "#8fcbc2");
  // 篝火
  s += `<g transform="translate(${n(x)} ${n(y + 30)})">
      <ellipse cx="0" cy="4" rx="12" ry="4" fill="#a9814f" opacity=".22"/>
      <path d="M-8 2 L0 -10 L8 2 Z" fill="#d9b48a"/>
      <path d="M0 1 L-3.5 -7 L0 -4 L3 -10 L4.5 -2 Z" fill="#f2a03c"/>
      <path d="M0 1 L-1.4 -3.6 L1.4 -2 Z" fill="#ffe2a8"/>
    </g>`;
  // 旗
  s += `<path d="M${x + 44} ${y + 12} L${x + 44} ${y - 26}" stroke="#a87c4f" stroke-width="2"/>
    <path d="M${x + 44} ${y - 26} L${x + 62} ${y - 21} L${x + 44} ${y - 16} Z" fill="#e05a3a"/>`;
  return s + `</g>`;
}

/* ---------- 组装 ---------- */
function scene() {
  const island = blob(CX, CY, 384, 220, 0.035, 0.6);
  const grass = blob(CX - 4, CY - 8, 330, 186, 0.04, 2.2);
  const contours = [0.86, 0.7, 0.54, 0.38, 0.22].map((k, i) =>
    blob(CX - 10 + 8 * i, CY - 12, 320 * k, 180 * k, 0.05, 0.9 + i * 0.8),
  );
  const depths = [1.14, 1.3, 1.48].map((k, i) => blob(CX, CY + 8, 384 * k, 220 * k, 0.026, 1.4 + i * 0.9));

  // 树：沿草地边缘成簇
  const spots = [
    [430, 350, 1.05], [468, 330, 0.85], [700, 318, 1.1], [736, 340, 0.9], [770, 322, 0.8],
    [880, 400, 1.0], [905, 430, 0.8], [352, 430, 0.95], [330, 462, 0.8], [620, 560, 1.0],
    [660, 578, 0.8], [480, 560, 0.9], [890, 500, 0.9],
    [520, 330, 0.75], [600, 322, 0.95], [650, 336, 0.7], [838, 372, 0.85], [404, 392, 0.75],
    [700, 600, 0.85], [560, 610, 0.75], [930, 452, 0.7], [300, 452, 0.7],
  ];
  const trees = spots.map(([x, y, s], i) => tree(x, y, s, i)).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="雨岛插画地图：工作港、项目工坊、校园灯塔、内容营地四座基点">
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0" stop-color="#c2efe8"/>
      <stop offset="52%" stop-color="#8adcd8"/>
      <stop offset="100%" stop-color="#5cc6c6"/>
    </linearGradient>
    <radialGradient id="shallow" cx="50%" cy="50%" r="50%">
      <stop offset="0.6" stop-color="#eafaf3" stop-opacity=".95"/>
      <stop offset="1" stop-color="#eafaf3" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sand" x1="0" y1="0" x2="0.1" y2="1">
      <stop offset="0" stop-color="#f8e7bb"/>
      <stop offset="100%" stop-color="#e7ce97"/>
    </linearGradient>
    <linearGradient id="meadow" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#c7d99b"/>
      <stop offset="100%" stop-color="#a9c37f"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#0e5f5e" opacity=".07"/>
    </pattern>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
    <style>
      .smoke circle { opacity: 0; animation: rise 6s ease-out infinite; }
      .smoke circle:nth-child(2) { animation-delay: 2s; }
      .smoke circle:nth-child(3) { animation-delay: 4s; }
      @keyframes rise { 0% { opacity: 0; transform: translate(0,6px) scale(.6) } 30% { opacity: .5 } 100% { opacity: 0; transform: translate(10px,-26px) scale(1.4) } }
      @media (prefers-reduced-motion: reduce) { .smoke circle { animation: none; opacity: .35 } }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sea)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- 等深线 -->
  <g fill="none" stroke="#2f9c9b" stroke-width="1.1">
    ${depths.map((p, i) => `<path d="${d(p)}" stroke-opacity="${(0.3 - i * 0.08).toFixed(2)}" stroke-dasharray="7 9"/>`).join("\n    ")}
  </g>

  <!-- 浅滩与浪花 -->
  <ellipse cx="${CX}" cy="${CY + 16}" rx="500" ry="300" fill="url(#shallow)"/>
  <ellipse cx="${CX + 6}" cy="${CY + 30}" rx="392" ry="226" fill="#2f9c9b" opacity=".13" filter="url(#soft)"/>
  <path d="${d(blob(CX, CY, 392, 227, 0.035, 0.6))}" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="3"/>

  <!-- 岛体 -->
  <path d="${d(island)}" fill="url(#sand)"/>
  <path d="${d(grass)}" fill="url(#meadow)"/>
  <path d="${d(grass)}" fill="none" stroke="#8fb067" stroke-width="2" opacity=".7"/>

  <!-- 等高线 -->
  <g fill="none" stroke="#7d9a52" stroke-width="1">
    ${contours.map((p, i) => `<path d="${d(p)}" stroke-opacity="${(0.26 - i * 0.04).toFixed(2)}"/>`).join("\n    ")}
  </g>

  <!-- 小路 -->
  <path d="M398 520 Q470 500 560 484 Q650 470 690 486 Q730 500 745 516" fill="none" stroke="#e2c894" stroke-width="9" stroke-linecap="round" opacity=".9"/>
  <path d="M398 520 Q470 500 560 484 Q650 470 690 486 Q730 500 745 516" fill="none" stroke="#c9a86e" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 9"/>

  ${rock(360, 560, 1)} ${rock(700, 590, 0.9)} ${rock(940, 470, 0.9)}
  ${bush(470, 470, 1)} ${bush(690, 520, 0.9)} ${bush(820, 470, 0.8)} ${bush(300, 500, 0.9)}

  ${trees}

  ${harbor()}
  ${workshop()}
  ${lighthouse()}
  ${camp()}

  <g fill="#e08a5a" opacity=".75">
    <circle cx="560" cy="556" r="2.2"/><circle cx="568" cy="550" r="1.8"/><circle cx="575" cy="558" r="2"/>
    <circle cx="470" cy="600" r="2.2"/><circle cx="478" cy="594" r="1.8"/>
    <circle cx="700" cy="552" r="2"/><circle cx="708" cy="558" r="1.8"/>
    <circle cx="840" cy="452" r="2.2"/><circle cx="848" cy="447" r="1.8"/>
  </g>

  <g stroke="#3d8f8e" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round">
    <path d="M236 214 q8 -7 16 0 q8 -7 16 0"/>
    <path d="M292 186 q7 -6 14 0 q7 -6 14 0"/>
    <path d="M960 258 q8 -7 16 0 q8 -7 16 0"/>
  </g>

  ${person(505, 498, 1, "#e05a3a")}
  ${person(640, 480, 0.92, "#3f7f8a")}
  ${person(864, 492, 0.86, "#e0a13a", true)}

  <!-- 小船 -->
  <g transform="translate(326 578)">
    <ellipse cx="0" cy="6" rx="26" ry="6" fill="#2f9c9b" opacity=".18"/>
    <path d="M-24 -2 Q0 12 24 -2 Q4 6 0 6 Q-4 6 -24 -2 Z" fill="#c9a670"/>
    <path d="M0 -4 L0 -30" stroke="#a87c4f" stroke-width="2"/>
    <path d="M0 -28 L17 -6 L0 -6 Z" fill="#fff6e3"/>
  </g>

  <!-- 指北针 -->
  <g transform="translate(196 630)" opacity=".6">
    <circle r="26" fill="#ffffff" fill-opacity=".35" stroke="#1f7b79" stroke-width="1" stroke-opacity=".4"/>
    <path d="M0 -20 L5.5 2 L0 -3 L-5.5 2 Z" fill="#e05a3a"/>
    <path d="M0 20 L4 5 L0 8 L-4 5 Z" fill="#1f7b79" opacity=".55"/>
  </g>

  <!-- 比例尺 -->
  <g transform="translate(930 690)" opacity=".45" stroke="#1f7b79" stroke-width="1.2">
    <path d="M0 0 H110 M0 -5 V5 M55 -3.5 V3.5 M110 -5 V5"/>
  </g>
</svg>
`;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, scene(), "utf8");
console.log("wrote", OUT);
