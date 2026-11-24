// 作品集（雨岛）的内容数据：不展示工作起止时间，聚焦工程问题、做法与可核验结果。
import { siteConfig } from "./config";

export type ZoneId = "work" | "build" | "campus" | "camp";

export interface Zone {
  id: ZoneId;
  no: string;
  name: string;
  en: string;
  tagline: string;
  /** 标记在岛图上的位置（百分比，基准 1200×780） */
  x: number;
  y: number;
  /** 底部索引与悬停微提示 */
  short: string;
  hoverHint: string;
  /** 标签相对锚点的方位 */
  place: "top" | "bottom" | "left" | "right";
}

export const zones: Zone[] = [
  {
    id: "work",
    no: "01",
    name: "工作港",
    en: "WORK HARBOR",
    tagline: "企业级全栈交付：AI 工作台、跨服务鉴权与内容生成系统",
    short: "企业级 AI 全栈交付",
    hoverHint: "Web + Flutter + Python/Go 端到端落地",
    x: 33.2,
    y: 63.7,
    place: "left",
  },
  {
    id: "build",
    no: "02",
    name: "项目工坊",
    en: "BUILD LAB",
    tagline: "双王牌全栈作品 + 三段生产架构复盘 + 四个造物小品",
    short: "2 王牌 + 3 生产架构 + 4 小品",
    hoverHint: "5 个项目可直接浏览器点开试玩",
    x: 62.1,
    y: 59.5,
    place: "top",
  },
  {
    id: "campus",
    no: "03",
    name: "校园灯塔",
    en: "CAMPUS LIGHT",
    tagline: "智能科学与技术 · 国家奖学金 · 省数学竞赛一等奖",
    short: "国家奖学金 · Top 5%",
    hoverHint: "数学底子换来的边界推演习惯",
    x: 45.8,
    y: 36.4,
    place: "left",
  },
  {
    id: "camp",
    no: "04",
    name: "内容营地",
    en: "SIGNAL CAMP",
    tagline: "GitHub 干净源码、联系方式与实时同步的一页简历 PDF",
    short: "联系方式与一页 PDF",
    hoverHint: "北京随时到岗 · 一键下载 PDF",
    x: 69.3,
    y: 70.2,
    place: "bottom",
  },
];

export type WorkTier = "flagship" | "enterprise" | "mini";
export type WorkCategory = "ai" | "3d";

export interface CaseItem {
  slug: string;
  tier: WorkTier;
  category: WorkCategory;
  name: string;
  role: string;
  /** 一句话定位 */
  line: string;
  problem: string;
  approach: string[];
  result: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  tags: string[];
  links?: { label: string; href: string; primary?: boolean }[];
  note?: string;
  cover?: { src: string; alt: string };
  /** 宽卡副配图 */
  secondaryShots?: { src: string; alt: string; href?: string }[];
}

/** 02 项目工坊：按「双王牌 → 企业交付 → 实验小品」分层组织 */
export const works: CaseItem[] = [
  {
    slug: "audit-pilot",
    tier: "flagship",
    category: "ai",
    name: "智审领航 · AuditPilot",
    role: "独立全栈代表作 · Python / FastAPI / LangGraph",
    line: "把财务审计里的「算不准、不敢信、怕泄密」拆成确定性算子、混合溯源与脱敏网关。",
    problem:
      "直接让大模型审财务流水与采购合同会踩三个死穴：浮点数与金额汇总容易产生幻觉、法务条款引用对不上原文段落、真实对公账号与主体信息不能裸发给外部 API。",
    approach: [
      "算账与推理分离：L1 确定性审计算子负责拆分付款、连日重付与节假日大额筛查；L2 用 SQLite Authorizer 构建底层只读 SQL 沙箱拦截写操作与注入",
      "条款级可信溯源：BM25 + Dense 向量经 RRF 融合重排，输出精确到合同编号与条款号的证据锚点，并与台账做跨源交叉核验",
      "网关层零信任脱敏：外发 Prompt 前将多格式银行卡号、税号与主体归一化为一致占位符，SSE 流式返回时实时还原，保证跨格式零误报、零泄露",
      "LangGraph 显式状态机编排核查节点，内置主备模型超时降级、TTL 语义缓存与 CPA 复核 DPO 数据导出飞轮",
    ],
    result:
      "内置 12 项自动化评测基准 100% 通过（Hybrid Recall@3 达 100%、外发 Prompt 敏感信息零泄露、缓存命中延迟从 43.7ms 降至 1.3ms）；提供零 API Key 离线可交互在线工作台，亦支持填入个人 Key 切换真实流式推理。",
    beforeAfter: {
      before: "纯 Prompt 裸调大模型：金额加总易错、SQL 拼接有删改库风险、账号带空格导致漏脱敏",
      after: "确定性算子 + Authorizer 只读沙箱 + 归一化占位符流式还原，12/12 评测全绿且 PII 零泄露",
    },
    tags: ["Python / FastAPI", "LangGraph", "混合 RAG 溯源", "SQLite 沙箱", "流式脱敏网关"],
    links: [
      { label: "在线工作台 ↗", href: "https://pengyuyan3d.github.io/audit-pilot/", primary: true },
      { label: "GitHub 源码", href: "https://github.com/pengyuyan3d/audit-pilot" },
    ],
    cover: {
      src: "shots/auditpilot-diagram.svg",
      alt: "智审领航 AuditPilot 架构示意：确定性算子、只读沙箱、混合 RAG 与归一化脱敏网关",
    },
    note: "内置脱敏仿真账套与采购合同，打开浏览器即可跑通核查全流程。",
  },
  {
    slug: "3d-content-kit",
    tier: "flagship",
    category: "3d",
    name: "3D 内容工厂",
    role: "独立产品代表作 · TypeScript / Three.js / Next.js",
    line: "把纸质说明书和门店全景照片，一条命令编译成能旋转、能拆解、能进官网与小程序的 3D 页面。",
    problem:
      "家具说明书只有黑白线稿和编号，用户装到第三步容易装反；实体商家展示门店只有静态照片，顾客看不出空间动线。中小品牌想要可交互的 3D 页面，但承担不起专门建模和后端运维成本。",
    approach: [
      "定义极简声明式输入：零件表 + 步骤表 + 原书页图（或一张 360 全景图 + 热点表），构建脚本直接编译成零后端单页应用",
      "3D 装配说明书线：三维零件按步骤高亮动画、支持自由旋转缩放、点零件查尺寸与五金，右侧同步对照原始纸质说明书页",
      "360 全景看店线：全景球面映射 + 空间热点锚定，支持手机竖屏拖拽浏览与商品价格卡片弹出",
      "前置坏数据门禁：内置尺寸越界、悬空零件与缺图校验清单，编译前拦截异常数据",
    ],
    result:
      "两条产品线共用同一套渲染与构建内核，线上提供「10 步书柜装配」与「咖啡店全景看店」两个可直接交互的完整 Demo。",
    tags: ["TypeScript", "Three.js", "Next.js", "编译式生成", "零后端静态产物"],
    links: [
      {
        label: "3D 说明书 Demo ↗",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/manual/demo-bookcase/index.html",
        primary: true,
      },
      {
        label: "360 看店 Demo ↗",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/shop/cafe/index.html",
      },
      { label: "GitHub 源码", href: "https://github.com/pengyuyan3d/3d-content-kit" },
    ],
    cover: { src: "shots/manual3d.webp", alt: "3D 装配说明书分步交互截图" },
    secondaryShots: [
      {
        src: "shots/manual3d.webp",
        alt: "3D 装配说明书 Demo",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/manual/demo-bookcase/index.html",
      },
      {
        src: "shots/space3d.webp",
        alt: "360 全景看店 Demo",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/shop/cafe/index.html",
      },
    ],
  },
  {
    slug: "cip-workbench",
    tier: "enterprise",
    category: "ai",
    name: "CIP / Leadeep 企业 AI 工作台",
    role: "企业交付 · Python 后端 + Web / Flutter 客户端",
    line: "断线、杀进程重进、重复事件到达之后，Web 与移动端的历史消息和实时任务终态依然严格一致。",
    problem:
      "企业 AI 工作台同时跑 Web 与 Flutter 客户端，流式对话一旦遇到弱网断线、切换后台被杀重进或同一回调重复到达，客户端就容易出现「两条半截回答」或任务永远卡在「进行中」。",
    approach: [
      "SQLite 持久化消息流与任务状态机，客户端重进时按游标做增量恢复而非整段重拉",
      "按幂等键拦截重复事件，收拢统一的任务终止与重试入口，对齐实时流与历史查询的终态判定",
      "多租户上下文透传：所有 HTTP 请求与后台异步任务均显式绑定租户隔离域，用 Redis 锁协调多租户 Token 并发刷新",
      "补齐 React 内容分享页与对象存储 STS 临时凭证客户端直传链路",
    ],
    result:
      "Web 与 Flutter 共用同一套消息与任务终态模型，弱网断线、应用重进与重复投递等边界路径均具备确定性恢复能力与回归测试。",
    beforeAfter: {
      before: "改动前：流式中断后内存态丢失，重进重拉偶发双半截回复或状态永久悬停「进行中」",
      after: "改动后：事件幂等落库 + 客户端游标增量追平 + 统一终态机，跨端状态 100% 收敛",
    },
    tags: ["Python / FastAPI", "Flutter", "React", "SQLite 增量恢复", "Redis 分布式锁"],
    cover: {
      src: "shots/cip-diagram.svg",
      alt: "CIP 工作台结构示意：Web/Flutter 客户端、FastAPI、SQLite 持久化、Redis 锁与幂等去重",
    },
    note: "企业内部生产系统，无公网入口；面试时可完整拆解状态机流转、游标协议与故障复现用例。",
  },
  {
    slug: "daguan-iam",
    tier: "enterprise",
    category: "ai",
    name: "大观 · 身份权限与运营服务",
    role: "企业交付 · Go IAM 与 Python 服务联调",
    line: "跨服务授权推送要么原子成功、要么安全重放，并把百次级 N+1 组织树查询压成单次查询。",
    problem:
      "租户授权需要跨服务推送，一旦遇到网络超时或进程重启，调用方无法区分下游「到底执行了没有」；同时组织架构树按层级逐节点查库，租户组织稍多就会放大成上百次串行请求。",
    approach: [
      "授权推送采用「任务快照 + 幂等标识 + 本地事务 + 持久化回执」四件套，让超时未知结果与重复请求均可无副作用重放",
      "将组织树逐节点递归查库重构为「单次管理关系表查询 + 内存构树遍历」，彻底消除 N+1 放大",
      "大批量权限查询按每批 100 个组织切片，配合有界并发池与上下文超时控制保护下游数据库",
      "补齐权限边界接口与数据库迁移回归测试，落地平台品牌动态配置与工作台资源代理",
    ],
    result:
      "跨服务授权链路具备完整的幂等可重放语义；组织树与权限查询耗时不再随层级指数膨胀，调用次数按批次线性可控。",
    beforeAfter: {
      before: "改动前：推送超时结果未知不敢重试；组织树逐节点读取导致单次鉴权触发百次级查询",
      after: "改动后：快照 + 幂等回执支持任意重放；单次关系拉取 + 内存构树 + 100 组织分批有界并发",
    },
    tags: ["Go / Gin", "Python", "PostgreSQL", "跨服务幂等", "有界并发"],
    cover: {
      src: "shots/daguan-diagram.svg",
      alt: "大观授权推送结构示意：任务快照、幂等标识、事务与持久化回执",
    },
    note: "企业内部生产系统，无公网入口。",
  },
  {
    slug: "feihe-kos",
    tier: "enterprise",
    category: "ai",
    name: "飞鹤 KOS · AI 内容生成与运营",
    role: "企业交付 · Vue 3 管理台 + H5 + FastAPI 异步链路",
    line: "把不稳定的大模型输出关进「结构化校验 + 重试 + 降级 + 异步防重」的业务笼子里。",
    problem:
      "品牌运营需要按消费者问答实时生成三种风格的种草笔记，并异步产出互动评论。真实线上常遇到模型返回格式漂移、外部链接解析慢、第三方回调重复触发等问题，任一环裸奔都会让用户卡死在加载页。",
    approach: [
      "独立完成 Vue 3 / TypeScript 运营管理台与消费者端 H5，串联活动配置、动态问答、AI 导写与 RBAC 菜单权限",
      "FastAPI 会话与生成服务：对 3 风格草稿执行严格的 Schema 结构化输出校验，失败自动带纠错重试，超限平滑触发保底降级策略",
      "评论生成拆为异步流水线（链接解析 → 内容缓存 → 知识库匹配 → 第三方回调），用 Redis 锁与恢复接口兜住重复执行",
      "编写活动/会话/任务恢复测试，跑通 Docker 多阶段镜像构建、Harbor 推送与 Kubernetes 环境联调",
    ],
    result:
      "打通从后台活动配置到 C 端问答成稿与异步评论的全栈闭环，模型抖动有降级兜底，重复回调不再产生脏数据。",
    beforeAfter: {
      before: "改动前：LLM JSON 格式偶发残缺直接前端白屏；第三方重复回调导致同一内容被重复生成入库",
      after: "改动后：Schema 校验 + 自动重试 + 兜底模板保障可用性；Redis 锁与幂等恢复接口彻底防重",
    },
    tags: ["Vue 3 / TS", "FastAPI", "LLM 结构化校验", "Redis", "Docker / K8s"],
    cover: {
      src: "shots/feihe-diagram.svg",
      alt: "飞鹤 KOS 结构示意：管理台与 H5、FastAPI、LLM 校验重试降级、评论异步任务",
    },
    note: "品牌方线上运营项目，无公开测试入口。",
  },
  {
    slug: "textbook3d",
    tier: "mini",
    category: "3d",
    name: "3D 课本插图",
    role: "造物小品 · 单文件离线课件引擎",
    line: "把高中物理与立体几何题编译成能旋转、能拉滑杆调参、按步骤讲透的 660KB 单文件 HTML。",
    problem:
      "课本配图是静态二维线稿，学生难想象三维洛伦兹力螺旋轨迹或正方体六边形截面；老师上课也需要零安装、投影仪双击即开的交互教具。",
    approach: [
      "数据驱动播放器：题目配置、分步讲解词与渲染引擎解耦，新增知识点只需一份 JSON 与解析解模块",
      "实现带电粒子磁场运动（v/θ/B 实时算半径周期螺距）、单摆与正方体截面三个完整教学场景",
      "构建脚本将 Three.js 与样式内联打包成单个离线 HTML，无网络教室亦可直接演示",
    ],
    result: "三个单文件可交互课件在线即点即看，验证了「声明式题库 → 离线 3D 教具」的极简管线。",
    tags: ["Three.js", "解析解驱动", "单文件离线"],
    links: [
      { label: "在线体验 ↗", href: "https://pengyuyan3d.github.io/textbook3d/", primary: true },
      { label: "源码", href: "https://github.com/pengyuyan3d/textbook3d" },
    ],
    cover: { src: "shots/physics3d.webp", alt: "带电粒子在磁场中的 3D 课件截图" },
  },
  {
    slug: "miaoban",
    tier: "mini",
    category: "3d",
    name: "喵伴 MiaoBan",
    role: "造物小品 · Windows 原生桌面应用",
    line: "纯 C# 零第三方依赖写出的 ~50KB 桌面像素猫：逐像素透明无白边，点它绝不抢输入焦点。",
    problem:
      "常见 Electron/WPF 桌面挂件动辄吃几百 MB 内存，且点击时容易抢走正在打字的编辑器焦点。",
    approach: [
      "基于 Win32 UpdateLayeredWindow + DIB 逐像素 Alpha 渲染轮廓，配 PerMonitorV2 高分屏适配",
      "拦截 WM_MOUSEACTIVATE 返回 MA_NOACTIVATE 保证点击不抢焦点，内置番茄钟与久坐提醒等十种像素状态",
    ],
    result: "单文件免安装 exe 约 50KB，不联网、不写系统目录，GitHub Release 可直接下载运行。",
    tags: ["C#", "Win32 API", "零依赖 50KB"],
    links: [
      { label: "介绍页 ↗", href: "https://pengyuyan3d.github.io/miaoban/", primary: true },
      {
        label: "下载 exe",
        href: "https://github.com/pengyuyan3d/miaoban/releases/latest/download/miaoban-v2-win64.zip",
      },
      { label: "源码", href: "https://github.com/pengyuyan3d/miaoban" },
    ],
    cover: { src: "shots/miaoban-cover.webp", alt: "喵伴桌面像素猫截图" },
  },
  {
    slug: "fangcun",
    tier: "mini",
    category: "3d",
    name: "方寸 · fangcun",
    role: "造物小品 · 38KB 纯前端单页游戏",
    line: "38KB 单文件方块消除：零外部依赖、零图片音频素材，纯 Canvas 绘制与 WebAudio 合成音效。",
    problem:
      "探索在不引入任何游戏引擎和外部静态资源的前提下，用原生浏览器 API 能做出多细腻的手感反馈。",
    approach: [
      "单 HTML 内聚渲染循环、拖拽吸附判定、消除粒子动画与 WebAudio 实时合成打击音效，支持移动端触控",
    ],
    result: "整站仅 38KB，秒开可玩，附带核心棋盘逻辑单元测试。",
    tags: ["Canvas", "WebAudio", "38KB 零依赖"],
    links: [
      { label: "在线试玩 ↗", href: "https://pengyuyan3d.github.io/fangcun/", primary: true },
      { label: "源码", href: "https://github.com/pengyuyan3d/fangcun" },
    ],
    cover: { src: "shots/fangcun.webp", alt: "方寸单文件方块消除游戏截图" },
  },
  {
    slug: "order-reliability-lab",
    tier: "mini",
    category: "ai",
    name: "Go 订单可靠性实验",
    role: "工程实验 · Go 1.24 / goqite",
    line: "基于 SQLite 队列搭出本地订单异步链路，用可重复跑的故障注入测试验证超时、重放与幂等边界。",
    problem:
      "光看文档知道消息队列「会重试」不够直观，需要在本地复现进程崩溃、下游超时与重复投递时的真实状态变化。",
    approach: [
      "基于 maragudk/goqite 构建双库隔离的模拟下单与下游消费链路，编写自动化故障注入演练与 CI 测试",
    ],
    result: "沉淀出一套可一键复现的幂等与故障恢复测试用例（README 明确标注 AI 辅助范围与独立改动边界）。",
    tags: ["Go", "goqite", "故障注入测试"],
    links: [{ label: "源码与演练记录", href: "https://github.com/pengyuyan3d/order-reliability-lab", primary: true }],
    cover: { src: "shots/orderlab-diagram.svg", alt: "订单可靠性实验结构示意" },
  },
];

/** 03 校园 */
export const campus = {
  school: "福建理工大学",
  major: "智能科学与技术 · 本科",
  period: "2022.09 — 2026.07",
  facts: [
    { k: "国家奖学金", v: "获奖", d: "教育部国家级荣誉" },
    { k: "学业排名", v: "Top 5%", d: "GPA 3.4 / 4.0" },
    { k: "数学竞赛", v: "省一等奖", d: "全国大学生数学竞赛 · 福建赛区" },
  ],
  story:
    "数学与算法训练留下的核心收益是「动手写代码前先算边界条件」：大观组织树那次把逐节点查询压成单次关系查询 + 内存遍历，AuditPilot 把算账从大模型抽离成确定性算子，本质上都是先把最坏情况与错误率算清楚，再决定架构切分。",
};

/** 04 内容营地 */
export const signals = [
  { label: "GitHub", value: "github.com/pengyuyan3d", href: "https://github.com/pengyuyan3d" },
  { label: "邮箱", value: siteConfig.social.email, href: `mailto:${siteConfig.social.email}` },
  { label: "电话", value: siteConfig.phoneFormatted, href: `tel:${siteConfig.phone}` },
  { label: "本站源码", value: "github.com/pengyuyan3d/resume", href: "https://github.com/pengyuyan3d/resume" },
];

export const repos = [
  {
    name: "audit-pilot",
    desc: "智审领航：确定性审计算子 + 只读 SQL 沙箱 + 混合 RAG 溯源 + 流式脱敏网关（12/12 评测通过）",
    href: "https://github.com/pengyuyan3d/audit-pilot",
  },
  {
    name: "3d-content-kit",
    desc: "3D 内容工厂：说明书 3D 化 + 360 全景看店，两条产品线共用一套编译引擎",
    href: "https://github.com/pengyuyan3d/3d-content-kit",
  },
  {
    name: "textbook3d",
    desc: "3D 课本插图：磁场 / 单摆 / 正方体截面三个交互场景，单文件离线可开",
    href: "https://github.com/pengyuyan3d/textbook3d",
  },
  {
    name: "miaoban",
    desc: "喵伴：Windows 桌面像素猫，纯 C# 单文件约 50KB exe，不抢输入焦点",
    href: "https://github.com/pengyuyan3d/miaoban",
  },
  {
    name: "fangcun",
    desc: "方寸：38KB 单文件方块消除，零依赖，纯 Canvas + WebAudio",
    href: "https://github.com/pengyuyan3d/fangcun",
  },
  {
    name: "order-reliability-lab",
    desc: "基于 goqite 的 Go 订单可靠性实验，含故障注入测试与 CI 验证",
    href: "https://github.com/pengyuyan3d/order-reliability-lab",
  },
  {
    name: "resume",
    desc: "本站源码：Astro + 内联手绘活海图，构建自动同步一页超链接 PDF",
    href: "https://github.com/pengyuyan3d/resume",
  },
];
