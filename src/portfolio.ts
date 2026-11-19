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
    tagline: "七个作品，都按问题 → 做法 → 结果写清楚",
    short: "七个作品",
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
  {
    name: "3D 课本插图",
    role: "独立作品 · 三个知识点，一个引擎",
    line: "把课本里的一道题，编译成能转、能调、能一步步讲的 3D 课件。",
    problem:
      "课本是一张静态图，学生只能想象它转起来的样子；老师在黑板上画 3D 更难。要做的不是一段动画，而是把一道题拆成「能按步骤讲」的状态：每一步显示什么、哪个参数在变、公式读数跟着谁变。",
    approach: [
      "场景数据（题目、步骤、参数、讲解词）与播放器分开：加一个知识点只写一份 JSON + 一个场景模块",
      "三个知识点：磁场中的带电粒子（v / θ / B 三个滑杆，实时算半径、周期、螺距）、单摆（摆长与 g 可调）、正方体截面（倾角 / 方位 / 位置，三角形到正六边形）",
      "轨迹按解析解算，不做数值积分；参数、公式与 3D 画面同屏，讲的时候不用来回切",
      "构建脚本把 three.js 与样式内联成一个 HTML，约 660KB，离线可开、投影仪直接放",
    ],
    result: "三个成品都是单文件、离线可开；加新知识点只需要一份场景 JSON 加一个场景模块，播放器不用动。",
    tags: ["Three.js", "解析解", "单文件离线", "数据驱动"],
    links: [
      { label: "在线看", href: "https://pengyuyan3d.github.io/textbook3d/" },
      { label: "磁场 Demo", href: "https://pengyuyan3d.github.io/textbook3d/demos/lorentz.html" },
      { label: "源码", href: "https://github.com/pengyuyan3d/textbook3d" },
    ],
    cover: { src: "shots/physics3d.webp", alt: "带电粒子在磁场中的 3D 课件截图" },
    note: "三个知识点，不是完整课程库；磁场是匀强场，没有边界场与相对论效应。",
  },
  {
    name: "喵伴 MiaoBan",
    role: "独立作品 · Windows 桌面应用",
    line: "一只住在桌面上的像素猫：你打字它踩奶，打得太快会过热。",
    problem:
      "桌面宠物容易两头不讨好：要么吃内存、要么抢焦点——你正打着字，点一下猫就把输入打断了。目标是小到可以常驻、并且绝对不打扰。",
    approach: [
      "纯 C# + WinForms / GDI+，零第三方依赖，一个 exe 约 70KB",
      "分层窗口 + 逐像素 alpha（UpdateLayeredWindow + DIB section），形状边缘没有白边",
      "WM_MOUSEACTIVATE → MA_NOACTIVATE，点猫不抢输入焦点；键盘钩子被系统拦住时用活动检测兜底",
      "32×36 像素画逐行定义剪影，白色描边由轮廓外扩生成；右键用原生 TrackPopupMenu",
      "高 DPI（PerMonitorV2）、单实例、配置持久化；开机自启只写当前用户 Run 项，不动系统目录",
    ],
    result:
      "一个可下载的 Windows 包：踩奶、过热、追鼠标、摸头、番茄钟、喝水与久坐提醒等十个动作，免安装、不联网。",
    tags: ["C#", "Win32", "桌面应用", "像素画"],
    links: [
      { label: "在线页", href: "https://pengyuyan3d.github.io/miaoban/" },
      {
        label: "下载 exe",
        href: "https://github.com/pengyuyan3d/miaoban/releases/latest/download/miaoban-v2-win64.zip",
      },
      { label: "源码", href: "https://github.com/pengyuyan3d/miaoban" },
    ],
    cover: { src: "shots/miaoban.webp", alt: "喵伴桌面像素猫截图" },
    note: "只做了 Windows；暂时没有声音，自定义花纹也只做了一半。",
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
    name: "textbook3d",
    desc: "3D 课本插图：磁场 / 单摆 / 正方体截面三个场景，一个引擎，单文件离线",
    href: "https://github.com/pengyuyan3d/textbook3d",
  },
  {
    name: "miaoban",
    desc: "喵伴：Windows 桌面像素猫，纯 C# 单文件 exe，Release 可直接下载",
    href: "https://github.com/pengyuyan3d/miaoban",
  },
  {
    name: "fangcun",
    desc: "方寸：38KB 单文件方块消除，零依赖，纯 Canvas + WebAudio",
    href: "https://github.com/pengyuyan3d/fangcun",
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
