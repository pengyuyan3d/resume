// 生成高颜值现代产品窗口级预览图（880×550 SVG）：渐变极光底衬 + 圆角拟物窗口 + 精致状态胶囊与阴影层级
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/shots");
mkdirSync(OUT, { recursive: true });

const W = 880;
const H = 550;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function appWindow({ bgGrad, urlText, statusBadge, statusColor = "#10b981", body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(urlText)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgGrad[0]}"/>
      <stop offset="55%" stop-color="${bgGrad[1]}"/>
      <stop offset="100%" stop-color="${bgGrad[2]}"/>
    </linearGradient>
    <filter id="winShadow" x="-8%" y="-6%" width="116%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.13"/>
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.06"/>
    </filter>
    <filter id="cardShadow" x="-6%" y="-6%" width="112%" height="118%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.05"/>
    </filter>
  </defs>

  <!-- 柔和极光底衬 -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="760" cy="80" r="190" fill="#ffffff" opacity="0.38"/>
  <circle cx="110" cy="470" r="160" fill="#ffffff" opacity="0.28"/>

  <!-- 拟物浏览器主窗口 -->
  <g filter="url(#winShadow)">
    <rect x="46" y="38" width="788" height="474" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <!-- 顶栏 -->
    <path d="M46 54 Q46 38 62 38 L818 38 Q834 38 834 54 L834 82 L46 82 Z" fill="#f8fafc"/>
    <line x1="46" y1="82" x2="834" y2="82" stroke="#edf2f7" stroke-width="1"/>
    <circle cx="72" cy="60" r="5.5" fill="#fb7185"/>
    <circle cx="90" cy="60" r="5.5" fill="#fbbf24"/>
    <circle cx="108" cy="60" r="5.5" fill="#34d399"/>

    <!-- 地址栏 -->
    <rect x="240" y="48" width="340" height="24" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="410" y="64" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11.5" fill="#64748b">${esc(urlText)}</text>

    <!-- 右上状态胶囊 -->
    <rect x="692" y="48" width="122" height="24" rx="12" fill="${statusColor}" fill-opacity="0.12"/>
    <circle cx="707" cy="60" r="3.8" fill="${statusColor}"/>
    <text x="717" y="64" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="11" font-weight="600" fill="${statusColor}">${esc(statusBadge)}</text>
  </g>

  <!-- 窗口内容 -->
  <g font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif">
    ${body}
  </g>
</svg>
`;
}

function uiCard(x, y, w, h, fill = "#f8fafc", stroke = "#e2e8f0") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" filter="url(#cardShadow)"/>`;
}

function pill(x, y, text, bg, fg) {
  const w = 18 + text.length * 11.5;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="${bg}"/>
    <text x="${x + w / 2}" y="${y + 16}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${fg}">${esc(text)}</text>
  </g>`;
}

/* 1. AuditPilot 智能审计工作台 */
const auditpilot = appWindow({
  bgGrad: ["#dbeafe", "#e0f2fe", "#fef3c7"],
  urlText: "audit-pilot · L1 算账 + 混合溯源 + 脱敏网关",
  statusBadge: "12/12 评测全绿",
  statusColor: "#059669",
  body: `
    <!-- 顶部 3 枚核心指标卡 -->
    ${uiCard(72, 102, 232, 86, "#ffffff", "#e2e8f0")}
    <text x="90" y="128" font-size="12" font-weight="600" fill="#64748b">L1 确定性异常检出</text>
    <text x="90" y="158" font-size="23" font-weight="700" fill="#0f172a">¥545,000</text>
    <text x="208" y="157" font-size="11.5" font-weight="600" fill="#e11d48">同日拆分规避</text>
    <text x="90" y="176" font-size="11" fill="#94a3b8">SQLite Authorizer 只读拦截写注入</text>

    ${uiCard(320, 102, 232, 86, "#ffffff", "#e2e8f0")}
    <text x="338" y="128" font-size="12" font-weight="600" fill="#64748b">BM25 + Dense RRF 溯源</text>
    <text x="338" y="158" font-size="23" font-weight="700" fill="#0f172a">100%</text>
    <text x="412" y="157" font-size="11.5" font-weight="600" fill="#0284c7">Recall@3 命中</text>
    <text x="338" y="176" font-size="11" fill="#94a3b8">精确锚定 CT-2026-001 第 4 条</text>

    ${uiCard(568, 102, 240, 86, "#f0fdf4", "#bbf7d0")}
    <text x="586" y="128" font-size="12" font-weight="600" fill="#15803d">外发网关流式脱敏</text>
    <text x="586" y="158" font-size="23" font-weight="700" fill="#14532d">0 泄露</text>
    <text x="670" y="157" font-size="11.5" font-weight="600" fill="#16a34a">43.7→1.3ms</text>
    <text x="586" y="176" font-size="11" fill="#166534">多格式卡号一致占位 · SSE 实时还原</text>

    <!-- 左下：LangGraph 状态流 -->
    ${uiCard(72, 206, 444, 280, "#0f172a", "#1e293b")}
    <text x="94" y="236" font-size="13" font-weight="600" fill="#e2e8f0">LangGraph 核查状态机 · 主备模型自动降级</text>
    <rect x="94" y="254" width="120" height="52" rx="8" fill="#1e293b" stroke="#38bdf8"/>
    <text x="154" y="277" text-anchor="middle" font-size="12.5" font-weight="600" fill="#f8fafc">确定性算子</text>
    <text x="154" y="295" text-anchor="middle" font-size="10.5" fill="#94a3b8">拆分 / 重付 / 节假日</text>

    <path d="M214 280 L236 280" stroke="#38bdf8" stroke-width="1.8"/>
    <rect x="236" y="254" width="120" height="52" rx="8" fill="#1e293b" stroke="#818cf8"/>
    <text x="296" y="277" text-anchor="middle" font-size="12.5" font-weight="600" fill="#f8fafc">混合 RAG 核验</text>
    <text x="296" y="295" text-anchor="middle" font-size="10.5" fill="#94a3b8">账套 × 合同交叉比对</text>

    <path d="M356 280 L378 280" stroke="#818cf8" stroke-width="1.8"/>
    <rect x="378" y="254" width="116" height="52" rx="8" fill="#1e293b" stroke="#34d399"/>
    <text x="436" y="277" text-anchor="middle" font-size="12.5" font-weight="600" fill="#f8fafc">归一化网关</text>
    <text x="436" y="295" text-anchor="middle" font-size="10.5" fill="#6ee7b7">[ORG_1] 脱敏流</text>

    <rect x="94" y="326" width="400" height="138" rx="8" fill="#162033" stroke="#334155"/>
    <text x="110" y="352" font-family="ui-monospace, Consolas, monospace" font-size="11.5" fill="#38bdf8">[MASK] 6222 0210 **** → &lt;ACCT_01&gt; (跨空格一致映射)</text>
    <text x="110" y="376" font-family="ui-monospace, Consolas, monospace" font-size="11.5" fill="#fbbf24">[WARN] 检出超合同总额付款 ¥380,000 · 溯源 CT-2026-001#4</text>
    <text x="110" y="400" font-family="ui-monospace, Consolas, monospace" font-size="11.5" fill="#34d399">[SAFE] 拦截恶意 SQL: DROP TABLE ledger → Authorizer Denied</text>
    <text x="110" y="426" font-family="ui-monospace, Consolas, monospace" font-size="11.5" fill="#cbd5e1">[DONE] CPA 人工复核通过 → 自动导出 DPO 对齐样本</text>

    <!-- 右下：合同证据溯源卡 -->
    ${uiCard(534, 206, 274, 280, "#fffbeb", "#fde68a")}
    <text x="554" y="236" font-size="13" font-weight="700" fill="#92400e">合同原文条款高亮溯源</text>
    <rect x="554" y="252" width="234" height="82" rx="8" fill="#ffffff" stroke="#fcd34d"/>
    <text x="568" y="275" font-size="11.5" font-weight="600" fill="#b45309">采购合同 CT-2026-001 · 第四条</text>
    <text x="568" y="297" font-size="11.5" fill="#475569">单笔结算上限 200,000 元，严禁</text>
    <text x="568" y="316" font-size="11.5" fill="#475569">同日拆分多笔规避集团审批流。</text>
    ${pill(554, 352, "零 Key 离线可交互", "#fef3c7", "#b45309")}
    ${pill(554, 386, "支持自定义 DeepSeek 流式", "#e0f2fe", "#0369a1")}
    <text x="554" y="446" font-size="11.5" fill="#78716c">点击「在线工作台」即可在浏览器</text>
    <text x="554" y="465" font-size="11.5" fill="#78716c">直接运行完整审计核查闭环。</text>
  `,
});

/* 2. CIP 企业 AI 工作台 */
const cip = appWindow({
  bgGrad: ["#e0f2fe", "#f0fdf4", "#fefce8"],
  urlText: "cip-workbench · 跨端状态同步与断线增量恢复",
  statusBadge: "终态 100% 收敛",
  statusColor: "#0284c7",
  body: `
    ${uiCard(72, 106, 226, 250, "#ffffff", "#e2e8f0")}
    <text x="92" y="136" font-size="14" font-weight="700" fill="#0f172a">Web + Flutter 双端同源</text>
    <rect x="92" y="154" width="186" height="68" rx="8" fill="#f0f9ff" stroke="#bae6fd"/>
    <text x="106" y="178" font-size="12.5" font-weight="600" fill="#0369a1">Web 流式工作台</text>
    <text x="106" y="199" font-size="11.5" fill="#475569">SSE 增量对话 · STS 附件直传</text>
    <rect x="92" y="236" width="186" height="68" rx="8" fill="#f0fdf4" stroke="#bbf7d0"/>
    <text x="106" y="260" font-size="12.5" font-weight="600" fill="#15803d">Flutter 移动客户端</text>
    <text x="106" y="281" font-size="11.5" fill="#475569">杀进程重进按游标追平状态</text>
    <text x="92" y="332" font-size="11.5" fill="#64748b">共用同一套任务终态机模型</text>

    ${uiCard(318, 106, 490, 250, "#ffffff", "#cbd5e1")}
    <text x="340" y="136" font-size="14" font-weight="700" fill="#0f172a">FastAPI 核心保障层（异常恢复三件套）</text>
    <rect x="340" y="156" width="142" height="104" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="356" y="182" font-size="13" font-weight="700" fill="#0f172a">SQLite 持久化</text>
    <text x="356" y="204" font-size="11.5" fill="#475569">落盘消息与任务游标</text>
    <text x="356" y="224" font-size="11.5" fill="#475569">重进只拉增量分片</text>

    <rect x="494" y="156" width="142" height="104" rx="10" fill="#fff7ed" stroke="#fed7aa"/>
    <text x="510" y="182" font-size="13" font-weight="700" fill="#c2410c">事件幂等去重</text>
    <text x="510" y="204" font-size="11.5" fill="#7c2d12">拦截重复回调投递</text>
    <text x="510" y="224" font-size="11.5" fill="#7c2d12">杜绝双半截残缺回答</text>

    <rect x="648" y="156" width="140" height="104" rx="10" fill="#eef2ff" stroke="#c7d2fe"/>
    <text x="664" y="182" font-size="13" font-weight="700" fill="#4338ca">Redis 租户锁</text>
    <text x="664" y="204" font-size="11.5" fill="#3730a3">多租户上下文隔离</text>
    <text x="664" y="224" font-size="11.5" fill="#3730a3">并发刷新 Token 互斥</text>

    ${pill(340, 282, "弱网断线恢复", "#fee2e2", "#b91c1c")}
    ${pill(468, 282, "杀后台重进收敛", "#fef3c7", "#b45309")}
    ${pill(612, 282, "统一终止与重试", "#dcfce7", "#15803d")}

    ${uiCard(72, 376, 736, 110, "#0f172a", "#1e293b")}
    <text x="96" y="408" font-size="13" font-weight="600" fill="#f8fafc">生产边界收敛对比</text>
    <text x="96" y="434" font-size="12" fill="#fca5a5">改动前：SSE 断流后内存态丢失，客户端重进偶发「两条半截回复」或任务永久卡在「进行中」</text>
    <text x="96" y="460" font-size="12" fill="#6ee7b7">改动后：event_id 幂等落库 + 游标增量追平 + 统一终态机，实时流与历史消息 100% 严丝合缝</text>
  `,
});

/* 3. 大观 身份权限与跨服务运营 */
const daguan = appWindow({
  bgGrad: ["#ede9fe", "#e0f2fe", "#f0fdf4"],
  urlText: "daguan-iam · Go 跨服务幂等授权与批量并发收敛",
  statusBadge: "N+1 → 单次查询",
  statusColor: "#4f46e5",
  body: `
    ${uiCard(72, 106, 736, 172, "#ffffff", "#e2e8f0")}
    <text x="94" y="136" font-size="14" font-weight="700" fill="#0f172a">跨服务租户授权推送链路（安全重放四件套）</text>

    <rect x="94" y="156" width="154" height="92" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="112" y="184" font-size="13" font-weight="700" fill="#0f172a">1. 任务快照</text>
    <text x="112" y="206" font-size="11.5" fill="#475569">固化授权变更输入</text>
    <text x="112" y="225" font-size="11.5" fill="#475569">支持断点现场还原</text>

    <rect x="272" y="156" width="154" height="92" rx="10" fill="#eef2ff" stroke="#a5b4fc"/>
    <text x="290" y="184" font-size="13" font-weight="700" fill="#4338ca">2. 幂等标识</text>
    <text x="290" y="206" font-size="11.5" fill="#3730a3">唯一键防重校验</text>
    <text x="290" y="225" font-size="11.5" fill="#3730a3">重复推送无副作用</text>

    <rect x="450" y="156" width="154" height="92" rx="10" fill="#f0fdf4" stroke="#86efac"/>
    <text x="468" y="184" font-size="13" font-weight="700" fill="#15803d">3. 本地事务</text>
    <text x="468" y="206" font-size="11.5" fill="#166534">PostgreSQL 原子提交</text>
    <text x="468" y="225" font-size="11.5" fill="#166534">杜绝半成品脏权限</text>

    <rect x="628" y="156" width="158" height="92" rx="10" fill="#fffbeb" stroke="#fcd34d"/>
    <text x="646" y="184" font-size="13" font-weight="700" fill="#b45309">4. 持久化回执</text>
    <text x="646" y="206" font-size="11.5" fill="#92400e">超时未知结果可查</text>
    <text x="646" y="225" font-size="11.5" fill="#92400e">支持放心自动重放</text>

    ${uiCard(72, 298, 358, 188, "#fff1f2", "#fecdd3")}
    <text x="94" y="328" font-size="13.5" font-weight="700" fill="#be123c">重构前：逐节点递归读取 (N+1)</text>
    <text x="94" y="356" font-size="12" fill="#881337">• 每展开一层组织树发起一次 DB 查询</text>
    <text x="94" y="380" font-size="12" fill="#881337">• 大租户鉴权瞬间放大为上百次串行请求</text>
    <text x="94" y="404" font-size="12" fill="#881337">• 网络超时后状态不明，不敢盲目重试</text>

    ${uiCard(450, 298, 358, 188, "#ecfdf5", "#a7f3d0")}
    <text x="472" y="328" font-size="13.5" font-weight="700" fill="#047857">重构后：单次查询 + 分批有界并发</text>
    <text x="472" y="356" font-size="12" fill="#065f46">• 一次拉取管理关系表 + 内存高速构树遍历</text>
    <text x="472" y="380" font-size="12" fill="#065f46">• 权限按每批 100 个组织切片 + 有界并发池</text>
    <text x="472" y="404" font-size="12" fill="#065f46">• 统一超时控制 + 数据库迁移回归测试覆盖</text>
  `,
});

/* 4. 飞鹤 KOS 内容生成系统 */
const feihe = appWindow({
  bgGrad: ["#fef3c7", "#fce7f3", "#e0f2fe"],
  urlText: "feihe-kos · LLM 结构化校验降级与长链路异步防重",
  statusBadge: "全栈闭环上线",
  statusColor: "#d97706",
  body: `
    ${uiCard(72, 106, 232, 210, "#ffffff", "#e2e8f0")}
    <text x="92" y="136" font-size="13.5" font-weight="700" fill="#0f172a">双端交互入口</text>
    <rect x="92" y="152" width="192" height="62" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="106" y="176" font-size="12.5" font-weight="600" fill="#0f172a">Vue 3 + TS 运营管理台</text>
    <text x="106" y="196" font-size="11" fill="#64748b">活动配置 · 知识库 · RBAC 菜单</text>
    <rect x="92" y="226" width="192" height="62" rx="8" fill="#fdf2f8" stroke="#fbcfe8"/>
    <text x="106" y="250" font-size="12.5" font-weight="600" fill="#be185d">消费者移动端 H5</text>
    <text x="106" y="270" font-size="11" fill="#9d174d">动态问答 · 3 风格种草笔记生成</text>

    ${uiCard(322, 106, 486, 210, "#ffffff", "#e2e8f0")}
    <text x="344" y="136" font-size="13.5" font-weight="700" fill="#0f172a">FastAPI 大模型高可用输出守卫</text>
    <rect x="344" y="156" width="138" height="90" rx="10" fill="#eff6ff" stroke="#bfdbfe"/>
    <text x="360" y="182" font-size="12.5" font-weight="700" fill="#1d4ed8">3 风格并行导写</text>
    <text x="360" y="204" font-size="11" fill="#1e40af">支持多轮历史上下文</text>
    <text x="360" y="222" font-size="11" fill="#1e40af">与单篇重新生成</text>

    <rect x="496" y="156" width="138" height="90" rx="10" fill="#fffbeb" stroke="#fde68a"/>
    <text x="512" y="182" font-size="12.5" font-weight="700" fill="#b45309">Schema 强校验</text>
    <text x="512" y="204" font-size="11" fill="#92400e">JSON 漂移自动捕获</text>
    <text x="512" y="222" font-size="11" fill="#92400e">带错误提示自愈重试</text>

    <rect x="648" y="156" width="138" height="90" rx="10" fill="#ecfdf5" stroke="#a7f3d0"/>
    <text x="664" y="182" font-size="12.5" font-weight="700" fill="#047857">平滑保底降级</text>
    <text x="664" y="204" font-size="11" fill="#065f46">模型超时/限流兜底</text>
    <text x="664" y="222" font-size="11" fill="#065f46">C 端体验零白屏卡死</text>

    ${pill(344, 266, "Docker 镜像构建", "#f1f5f9", "#334155")}
    ${pill(486, 266, "Harbor 仓库推送", "#f1f5f9", "#334155")}
    ${pill(630, 266, "Kubernetes 联调", "#e0f2fe", "#0369a1")}

    ${uiCard(72, 334, 736, 152, "#0f172a", "#1e293b")}
    <text x="94" y="366" font-size="13.5" font-weight="600" fill="#f8fafc">长链路异步评论生成 · Redis 分布式锁防重</text>
    ${pill(94, 384, "1. 外部链接解析", "#1e293b", "#93c5fd")}
    ${pill(242, 384, "2. 内容提取缓存", "#1e293b", "#93c5fd")}
    ${pill(390, 384, "3. 品牌知识库匹配", "#1e293b", "#93c5fd")}
    ${pill(554, 384, "4. 第三方回调幂等入库", "#064e3b", "#6ee7b7")}
    <text x="94" y="454" font-size="12" fill="#cbd5e1">通过 Redis 锁与任务恢复接口拦截第三方重复回调，保障长耗时异步链路只落库唯一有效结果。</text>
  `,
});

/* 5. Go 订单可靠性实验 */
const orderlab = appWindow({
  bgGrad: ["#e0e7ff", "#ecfeff", "#f0fdf4"],
  urlText: "order-reliability-lab · Go 1.24 + goqite 故障注入演练",
  statusBadge: "CI Drills Passing",
  statusColor: "#0d9488",
  body: `
    ${uiCard(72, 112, 736, 168, "#0f172a", "#1e293b")}
    <text x="96" y="144" font-family="ui-monospace, Consolas, monospace" font-size="13" font-weight="600" fill="#5eead4">$ go test -v ./internal/lab/... -run TestOrderFaultDrills</text>
    <text x="96" y="176" font-family="ui-monospace, Consolas, monospace" font-size="12" fill="#cbd5e1">=== RUN   TestDuplicateSubmissionIdempotency   --- PASS (0.04s)</text>
    <text x="96" y="202" font-family="ui-monospace, Consolas, monospace" font-size="12" fill="#cbd5e1">=== RUN   TestDownstreamTimeoutAndSafeReplay   --- PASS (0.11s)</text>
    <text x="96" y="228" font-family="ui-monospace, Consolas, monospace" font-size="12" fill="#cbd5e1">=== RUN   TestWorkerCrashRecoveryConsistency   --- PASS (0.09s)</text>
    <text x="96" y="256" font-family="ui-monospace, Consolas, monospace" font-size="12" fill="#34d399">PASS · 双 SQLite 隔离模拟应用库与下游账本，全部终态对账一致</text>

    ${uiCard(72, 302, 736, 180, "#ffffff", "#e2e8f0")}
    <text x="96" y="334" font-size="14" font-weight="700" fill="#0f172a">实验设计：把「消息队列会重试」拆成可量化的故障注入矩阵</text>
    ${pill(96, 356, "幂等键防双花", "#e0f2fe", "#0369a1")}
    ${pill(228, 356, "提交超时未知态恢复", "#fef3c7", "#b45309")}
    ${pill(398, 356, "重复消息投递", "#ede9fe", "#5b21b6")}
    ${pill(538, 356, "PROVENANCE 诚实边界标注", "#dcfce7", "#15803d")}
    <text x="96" y="424" font-size="12.5" fill="#475569">基于 maragudk/goqite 构建零外部依赖本地可靠性演练场，GitHub Actions 每次提交自动执行全量故障测试。</text>
  `,
});

writeFileSync(resolve(OUT, "auditpilot-diagram.svg"), auditpilot, "utf8");
writeFileSync(resolve(OUT, "cip-diagram.svg"), cip, "utf8");
writeFileSync(resolve(OUT, "daguan-diagram.svg"), daguan, "utf8");
writeFileSync(resolve(OUT, "feihe-diagram.svg"), feihe, "utf8");
writeFileSync(resolve(OUT, "orderlab-diagram.svg"), orderlab, "utf8");
console.log("Generated 5 polished UI mockup SVGs in", OUT);
