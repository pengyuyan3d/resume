// 作品集（雨岛）的内容数据：只放事实，措辞与简历原文对齐。
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
  /** 底部索引里的一句话 */
  short: string;
  /** 标签相对锚点的方位 */
  place: "top" | "bottom" | "left" | "right";
}

export const zones: Zone[] = [
  {
    id: "work",
    no: "01",
    name: "工作港",
    en: "WORK HARBOR",
    tagline: "三段真实交付：企业 AI 工作台、身份权限、内容运营系统",
    short: "三段企业交付",
    x: 33.2,
    y: 63.7,
    place: "left",
  },
  {
    id: "build",
    no: "02",
    name: "项目工坊",
    en: "BUILD LAB",
    tagline: "五个作品，都按问题 → 做法 → 结果写清楚",
    short: "五个作品",
    x: 62.1,
    y: 61.4,
    place: "right",
  },
  {
    id: "campus",
    no: "03",
    name: "校园灯塔",
    en: "CAMPUS LIGHT",
    tagline: "智能科学与技术 · 数学底子换来的工程判断",
    short: "学校与获奖",
    x: 45.8,
    y: 36.4,
    place: "left",
  },
  {
    id: "camp",
    no: "04",
    name: "内容营地",
    en: "SIGNAL CAMP",
    tagline: "GitHub、联系方式和一份能打印的简历",
    short: "联系方式与简历",
    x: 69.3,
    y: 68.8,
    place: "bottom",
  },
];

export interface CaseItem {
  name: string;
  period?: string;
  role?: string;
  /** 一句话定位 */
  line: string;
  problem: string;
  approach: string[];
  result: string;
  tags: string[];
  links?: { label: string; href: string }[];
  note?: string;
  cover?: { src: string; alt: string };
}

/** 02 项目工坊：可以点开看的作品 */
export const works: CaseItem[] = [
  {
    name: "3D 内容工厂",
    role: "独立开发 · 两条产品线共用一套引擎",
    line: "把纸质说明书和门店照片，编译成能点、能看、能用的 3D 页面。",
    problem:
      "家具说明书只有线稿和编号，用户装到第三步就卡住；商家介绍门店只有照片和文案，顾客看不出动线。两者都需要「能自己点开看」的页面，但客户没有 3D 建模预算。",
    approach: [
      "定义一份最小数据格式：零件表 + 步骤表 + 可选原书页图，脚本一条命令编译成单页 3D 演示",
      "3D 说明书：三维零件按步骤高亮、可旋转缩放、点零件看尺寸与五金清单，右侧对照原始说明书页",
      "360 看店：全景图 + 热点表编译成可拖拽浏览、点标记看详情的页面，手机竖屏可用",
      "内置验收清单与坏数据样例，编译前先校验再出图",
    ],
    result:
      "两条产品线各自有可点的线上 Demo：书柜 10 步装配、咖啡店全景 4 个热点；引擎和接单/验收流程整理成可复用 Skill。",
    tags: ["Three.js", "编译式生成", "零后端", "全景热点"],
    links: [
      {
        label: "3D 说明书 Demo",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/manual/demo-bookcase/index.html",
      },
      {
        label: "360 看店 Demo",
        href: "https://pengyuyan3d.github.io/3d-content-kit/demos/shop/cafe/index.html",
      },
      { label: "源码", href: "https://github.com/pengyuyan3d/3d-content-kit" },
    ],
    cover: { src: "shots/manual3d.webp", alt: "3D 装配说明书 Demo 截图" },
  },
  {
    name: "CIP / Leadeep 企业 AI 工作台",
    period: "2026.07 — 2026.10",
    role: "后端 + 客户端接入",
    line: "断线、重进、重复事件之后，历史消息和实时消息还能对上。",
    problem:
      "企业 AI 工作台同时跑 Web 与 Flutter 客户端，流式对话一旦断线、应用被杀掉重进，或者同一事件重复到达，任务终态就会不一致——用户看到两条半截回答，或者任务永远「进行中」。",
    approach: [
      "SQLite 持久化消息与任务状态，客户端重进时做增量恢复，而不是整段重拉",
      "按幂等键去重重复事件，统一任务终止与重试入口，收敛历史与实时消息的终态",
      "多租户登录与切换：请求与异步任务都绑定租户上下文，用 Redis 锁协调多租户 Token 并发刷新",
      "补 React 内容分享页与 STS 临时凭证文件直传",
    ],
    result:
      "Web 与移动端共用一套任务状态与消息模型，异常路径（断线、重进、重复事件）有了恢复逻辑和回归测试。",
    tags: ["Python / FastAPI", "Flutter", "SQLite", "Redis", "多租户"],
    note: "企业内部系统，无公网 Demo；可现场讲代码与故障复现步骤。",
  },
  {
    name: "大观 · 身份权限与运营服务",
    period: "2026.07 — 2026.10",
    role: "Go IAM 与 Python 服务联调",
    line: "授权推送要么成功、要么可重放，不能「不知道成没成」。",
    problem:
      "租户授权要跨服务推送，网络超时或进程重启后不知道对方到底执行没有；组织树按节点逐个读取，权限查询的组织一多就是成百次请求。",
    approach: [
      "授权推送用「任务快照 + 幂等标识 + 事务 + 持久化回执」处理重复请求与未知结果重放",
      "组织树改成一次管理关系查询 + 内存遍历，去掉逐节点读取",
      "权限查询按每批 100 个组织执行，配有界并发与超时控制",
      "补权限接口与数据库迁移的回归测试，做平台品牌配置与工作台资源代理",
    ],
    result:
      "推送链路具备可重放语义；组织树与权限查询从逐节点请求收敛为按批查询，调用次数随组织规模线性可控。",
    tags: ["Go / Gin", "PostgreSQL", "幂等与回执", "并发控制"],
    note: "企业内部系统，无公网 Demo。",
  },
  {
    name: "飞鹤 KOS · AI 内容生成与运营",
    period: "2026.04 — 2026.06",
    role: "管理台 + H5 + 异步任务",
    line: "让 LLM 的输出能进业务：校验、重试、降级，一个都不能少。",
    problem:
      "品牌方要按用户回答生成三种风格的种草笔记，再生成评论。模型输出格式不稳定、链路长、第三方回调会重复，任何一环出错用户就卡在加载中。",
    approach: [
      "Vue 3 / TypeScript 管理台与消费者 H5，串联活动配置、用户问答、AI 导写、结果展示，接登录与 RBAC 菜单",
      "FastAPI 活动与会话接口，按答案生成 3 种风格草稿；LLM 结构化输出校验 + 重试 + 降级，支持历史轮次与重新生成",
      "评论生成做成异步任务：链接解析、内容缓存、知识库匹配、第三方回调串起来，用 Redis 锁与恢复接口兜住重复执行",
      "写活动/会话/任务恢复测试，完成 Docker 构建、Harbor 推送与 Kubernetes 测试环境联调",
    ],
    result:
      "从活动配置到笔记与评论产出跑通一条完整链路，模型异常有降级路径，重复执行不再产生重复内容。",
    tags: ["Vue 3 / TS", "FastAPI", "LLM 结构化输出", "Redis", "K8s"],
    note: "品牌方项目，无公网 Demo。",
  },
  {
    name: "订单可靠性实验",
    role: "学习项目 · goqite",
    line: "把「订单可靠」拆成可以反复跑的故障测试。",
    problem:
      "文档只能告诉我队列「会重试」，但重试、幂等在真实故障下到底会发生什么，得自己造一遍才看得清。",
    approach: [
      "以 goqite（SQLite 队列）为基础，在本地搭一条最小的 Go 订单任务链路",
      "给链路写故障注入测试，把「出错时到底会发生什么」变成可以重复执行的实验",
      "在 README 里标注 AI 辅助脚手架的范围，区分哪些是生成、哪些是自己判断和改的",
    ],
    result: "一套能重复跑的故障测试与结论记录，用来检验自己对重试与幂等的判断，而不是停在「应该没问题」。",
    tags: ["Go", "goqite", "故障注入", "测试"],
    links: [{ label: "源码", href: "https://github.com/pengyuyan3d/order-reliability-lab" }],
    note: "学习/实验项目，不是线上系统。",
  },
];

/** 03 校园 */
export const campus = {
  school: "福建理工大学",
  major: "智能科学与技术 · 本科",
  period: "2022.09 — 2026.07",
  facts: [
    { k: "GPA", v: "3.4 / 4", d: "专业 Top 5%" },
    { k: "国家奖学金", v: "1 次", d: "综合评定" },
    { k: "数学竞赛", v: "省一等奖", d: "全国大学生数学竞赛 · 福建赛区" },
  ],
  story:
    "数学训练留下的不是公式，是「先问边界条件」的习惯：组织树那次改成一次查询 + 内存遍历，靠的就是先把 N+1 的调用次数算清楚，再决定在哪一层收敛。",
};

/** 04 内容营地 */
export const signals = [
  { label: "GitHub", value: "github.com/pengyuyan3d", href: "https://github.com/pengyuyan3d" },
  { label: "邮箱", value: siteConfig.social.email, href: `mailto:${siteConfig.social.email}` },
  { label: "电话", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
  { label: "本站源码", value: "github.com/pengyuyan3d/resume", href: "https://github.com/pengyuyan3d/resume" },
];

export const repos = [
  {
    name: "3d-content-kit",
    desc: "3D 内容工厂：说明书 3D 化 + 360 全景看店，两条产品线共用一套引擎",
    href: "https://github.com/pengyuyan3d/3d-content-kit",
  },
  {
    name: "order-reliability-lab",
    desc: "基于 goqite 的 Go 订单可靠性实验，含故障注入测试（学习项目）",
    href: "https://github.com/pengyuyan3d/order-reliability-lab",
  },
  {
    name: "resume",
    desc: "这个站：Astro + 手绘地形图，无框架运行时；一页 A4 简历由 /resume/ 导出",
    href: "https://github.com/pengyuyan3d/resume",
  },
];
