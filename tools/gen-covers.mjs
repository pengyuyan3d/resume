// 为没有截图的项目生成结构示意图（880×550 SVG），风格与站点一致。
// 用法：node tools/gen-covers.mjs → public/shots/*.svg
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/shots");
mkdirSync(OUT, { recursive: true });

const W = 880;
const H = 550;
const INK = "#22322c";
const MUTED = "#5c6b62";
const FAINT = "#8a968e";
const LINE = "#c9c2b2";
const PAPER = "#fdf9ee";
const CARD = "#fffdf7";
const CORAL = "#c2492c";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function box(x, y, w, h, title, sub, opts = {}) {
  const accent = opts.accent ? CORAL : LINE;
  const dashed = opts.dashed ? ' stroke-dasharray="4 4"' : "";
  const fill = opts.fill || CARD;
  let s = `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="${accent}" stroke-width="${opts.accent ? 1.4 : 1}"${dashed}/>
    <text x="${x + 14}" y="${y + 27}" font-size="19" font-weight="600" fill="${INK}">${esc(title)}</text>`;
  if (sub) {
    sub.split("\n").forEach((line, i) => {
      s += `<text x="${x + 14}" y="${y + 51 + i * 19}" font-size="14" fill="${MUTED}">${esc(line)}</text>`;
    });
  }
  s += `</g>`;
  return s;
}

function chip(x, y, text, opts = {}) {
  const w = 10 + text.length * 13.6;
  const h = 24;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${opts.fill || "#f4eddc"}" stroke="${opts.stroke || LINE}"/>
    <text x="${x + w / 2}" y="${y + 17}" font-size="13" fill="${opts.color || MUTED}" text-anchor="middle">${esc(text)}</text>
  </g>`;
}

function arrow(x1, y1, x2, y2, opts = {}) {
  const dashed = opts.dashed ? ' stroke-dasharray="5 5"' : "";
  const color = opts.color || FAINT;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // 简单箭头：直线 + 三角头
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  const len = 7;
  const p1 = [x2 + Math.cos(a1) * len, y2 + Math.sin(a1) * len];
  const p2 = [x2 + Math.cos(a2) * len, y2 + Math.sin(a2) * len];
  return `<g stroke="${color}" stroke-width="1.2" fill="none">
    <path d="M${x1} ${y1} L${x2} ${y2}"${dashed}/>
    <polygon points="${x2},${y2} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${color}" stroke="none"/>
  </g>`;
}

function text(x, y, s, opts = {}) {
  const size = opts.size || 13.5;
  const fill = opts.color || MUTED;
  const anchor = opts.anchor || "start";
  const weight = opts.weight || 400;
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
}

function frame(body, caption) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(caption)}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif">
    ${body}
  </g>
  <text x="24" y="${H - 22}" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10.5" fill="${FAINT}" letter-spacing="0.08em">${esc(caption)}</text>
</svg>
`;
}

/* ---------- 1. CIP 企业 AI 工作台 ---------- */
const cip = frame(
  `
  ${box(30, 60, 180, 84, "Web 工作台", "流式对话 · 附件")}
  ${box(30, 168, 180, 84, "Flutter 客户端", "同一套任务状态")}
  ${box(300, 100, 250, 112, "FastAPI 服务", "会话 / 消息 / 任务", { accent: true })}
  ${box(640, 44, 210, 78, "SQLite 持久化", "重进时增量恢复")}
  ${box(640, 140, 210, 78, "Redis 锁", "多租户 Token 刷新")}
  ${box(640, 236, 210, 78, "幂等去重", "重复事件只落一次")}

  ${arrow(210, 102, 300, 130)}
  ${arrow(210, 210, 300, 186)}
  ${arrow(550, 140, 640, 86)}
  ${arrow(550, 160, 640, 178)}
  ${arrow(550, 186, 640, 268)}

  ${chip(300, 380, "断线")} ${chip(380, 380, "应用重进")} ${chip(488, 380, "重复事件")}
  ${arrow(350, 380, 388, 216, { dashed: true, color: CORAL })}
  ${arrow(430, 380, 430, 216, { dashed: true, color: CORAL })}
  ${arrow(515, 380, 472, 216, { dashed: true, color: CORAL })}

  ${text(30, 452, "终态一致：历史消息 = 实时消息；任务有明确的 完成 / 失败 / 可重试", { size: 13, color: INK })}
  ${text(30, 476, "断线、重进、重复事件都有恢复路径与回归测试", { size: 12 })}
  `,
  "CIP / Leadeep · 终态一致性",
);

/* ---------- 2. 大观 身份权限 ---------- */
const daguan = frame(
  `
  ${box(30, 56, 190, 78, "租户授权推送", "跨服务调用")}
  ${box(280, 56, 200, 78, "任务快照", "记录这次要做什么")}
  ${box(280, 158, 200, 78, "幂等标识", "同一任务只执行一次", { accent: true })}
  ${box(540, 56, 170, 78, "事务", "本地变更原子提交")}
  ${box(540, 158, 170, 78, "持久化回执", "结果可查、可重放")}
  ${box(740, 56, 110, 78, "可重放", "未知结果")}

  ${arrow(220, 95, 280, 95)}
  ${arrow(380, 134, 380, 158)}
  ${arrow(480, 95, 540, 95)}
  ${arrow(480, 197, 540, 197)}
  ${arrow(710, 95, 740, 95)}
  ${arrow(625, 134, 625, 158)}

  <rect x="30" y="286" width="820" height="94" rx="3" fill="${CARD}" stroke="${LINE}"/>
  ${text(48, 314, "组织树：逐节点读取（N 次查询） → 一次管理关系查询 + 内存遍历", { size: 14, color: INK, weight: 600 })}
  ${text(48, 340, "权限查询按每批 100 个组织执行，配有界并发与超时控制", { size: 12.5 })}
  ${text(48, 362, "补了权限接口与数据库迁移的回归测试", { size: 12.5 })}

  ${text(30, 428, "结果：推送链路具备幂等语义，重复请求与未知结果都能安全重放", { size: 13, color: INK })}
  `,
  "大观 · 授权推送与批量查询",
);

/* ---------- 3. 飞鹤 KOS ---------- */
const feihe = frame(
  `
  ${box(30, 50, 170, 74, "管理台 Vue 3", "活动配置 · RBAC")}
  ${box(30, 146, 170, 74, "消费者 H5", "问答 · 结果展示")}
  ${box(260, 96, 210, 78, "FastAPI", "活动 / 会话接口", { accent: true })}
  ${box(540, 50, 150, 74, "LLM 导写", "3 种风格草稿")}
  ${box(540, 146, 150, 74, "结构化校验", "不合格就重试")}
  ${box(720, 98, 130, 74, "降级", "兜底输出")}

  ${arrow(200, 87, 260, 120)}
  ${arrow(200, 183, 260, 155)}
  ${arrow(470, 120, 540, 87)}
  ${arrow(540, 124, 540, 146)}
  ${arrow(690, 183, 720, 150)}

  <rect x="30" y="270" width="820" height="130" rx="3" fill="${CARD}" stroke="${LINE}"/>
  ${text(48, 298, "评论生成：长链路异步任务", { size: 14, color: INK, weight: 600 })}
  ${chip(48, 314, "链接解析")} ${chip(176, 314, "内容缓存")} ${chip(300, 314, "知识库匹配")} ${chip(450, 314, "第三方回调")}
  ${arrow(160, 326, 176, 326, { color: MUTED })}
  ${arrow(288, 326, 300, 326, { color: MUTED })}
  ${arrow(438, 326, 450, 326, { color: MUTED })}
  ${text(48, 372, "Redis 锁 + 恢复接口兜住重复执行；Docker → Harbor → Kubernetes 测试环境联调", { size: 12.5 })}

  ${text(30, 444, "结果：从活动配置到笔记与评论产出跑通一条链路，模型异常有降级路径", { size: 13, color: INK })}
  `,
  "飞鹤 KOS · LLM 输出进业务",
);

/* ---------- 4. 订单可靠性实验 ---------- */
const orderlab = frame(
  `
  ${box(40, 200, 150, 76, "下单", "HTTP 入口")}
  ${box(240, 200, 170, 76, "goqite 队列", "SQLite 支撑", { accent: true })}
  ${box(460, 200, 150, 76, "消费", "重试 / 幂等")}
  ${box(660, 200, 180, 76, "状态落库", "可对照的终态")}

  ${arrow(190, 238, 240, 238)}
  ${arrow(410, 238, 460, 238)}
  ${arrow(610, 238, 660, 238)}

  ${chip(240, 96, "重复投递")} ${chip(400, 96, "超时")} ${chip(520, 96, "进程重启")}
  ${arrow(300, 120, 320, 200, { dashed: true, color: CORAL })}
  ${arrow(424, 120, 420, 200, { dashed: true, color: CORAL })}
  ${arrow(548, 120, 500, 200, { dashed: true, color: CORAL })}

  <rect x="240" y="330" width="600" height="86" rx="3" fill="${CARD}" stroke="${LINE}"/>
  ${text(258, 358, "故障注入测试：把「出错时会发生什么」变成可重复执行的实验", { size: 13, color: INK, weight: 600 })}
  ${text(258, 382, "每次跑完记录实际行为，对照自己对重试与幂等的判断", { size: 12.5 })}
  ${arrow(380, 276, 380, 330, { dashed: true })}

  ${text(40, 452, "学习项目，不是线上系统；README 标注了 AI 辅助脚手架的范围", { size: 12, color: FAINT })}
  `,
  "订单可靠性实验 · 故障注入",
);

writeFileSync(resolve(OUT, "cip-diagram.svg"), cip, "utf8");
writeFileSync(resolve(OUT, "daguan-diagram.svg"), daguan, "utf8");
writeFileSync(resolve(OUT, "feihe-diagram.svg"), feihe, "utf8");
writeFileSync(resolve(OUT, "orderlab-diagram.svg"), orderlab, "utf8");
console.log("wrote 4 diagrams to", OUT);
