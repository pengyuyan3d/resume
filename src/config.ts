export const siteConfig = {
  // 基本信息
  name: "张雨",
  title: "全栈开发工程师 · AI 应用与产品闭环",
  description:
    "张雨的作品集与简历：偏产品的全栈开发工程师（Python/FastAPI、Go、Vue3/React、Flutter、Three.js 与企业级 LLM 应用落地）。",
  accentColor: "#C9553D",
  location: "北京",
  phone: "16637433317",
  phoneFormatted: "166 3743 3317",
  portfolioUrl: "https://pengyuyan3d.github.io/resume/",
  status: "2026 届 · 随时到岗 · 期望 10–15K",

  social: {
    email: "2693825087@qq.com",
    github: "https://github.com/pengyuyan3d",
    linkedin: "",
    twitter: "",
  },

  aboutMe:
    "2026 届智能科学与技术本科（国家奖学金 · GPA 3.4/4 · 专业 Top 5% · 省数学竞赛一等奖）。在北京衔远科技负责企业级 AI 产品从 Python/FastAPI、Go 后端到 Vue 3/React、Flutter 客户端的端到端交付；既能一人把复杂交互产品闭环推上线，也习惯在流式断线恢复、跨服务鉴权幂等与 LLM 结构化降级等生产边界上补齐恢复逻辑与回归测试。",

  skills: [
    "Python / FastAPI",
    "Go / Gin",
    "Vue 3 / TypeScript",
    "React / Astro",
    "Flutter",
    "Three.js",
    "PostgreSQL / SQLite",
    "Redis",
    "Docker / K8s",
    "RAG / LangGraph",
  ],

  projects: [
    {
      name: "智审领航 · AuditPilot（独立全栈代表作）",
      description:
        "面向事务所的智能审计核查工作台：L1 确定性算账算子 + SQLite Authorizer 只读 SQL 沙箱 + BM25/Dense RRF 混合检索条款溯源 + 网关层归一化脱敏与 LangGraph 主备模型降级；内置 12 项自动化评测（100% 通过、PII 零泄露）。",
      link: "https://pengyuyan3d.github.io/audit-pilot/",
      linkLabel: "在线工作台",
      skills: ["FastAPI", "LangGraph", "混合 RAG", "SQLite 沙箱", "脱敏网关"],
    },
    {
      name: "3D 内容工厂（独立产品代表作）",
      description:
        "把纸质装配说明书和门店全景照片编译成可交互静态 3D 页面：说明书线按零件表生成分步拆装与原页对照，看店线支持 360 全景拖拽与热点详情；两条产品线共用一套引擎与数据校验流水线。",
      link: "https://pengyuyan3d.github.io/3d-content-kit/",
      linkLabel: "在线 Demo",
      skills: ["TypeScript", "Three.js", "Next.js", "编译式生成"],
    },
    {
      name: "CIP / Leadeep 企业 AI 工作台",
      description:
        "Web 与 Flutter 客户端共用一套流式会话与任务状态模型：针对断线、杀进程重进和重复事件做 SQLite 持久化、幂等去重与游标增量恢复；用 Redis 分布式锁协调多租户 Token 并发刷新。",
      link: "",
      linkLabel: "",
      skills: ["Python", "FastAPI", "Flutter", "SQLite", "Redis"],
    },
    {
      name: "大观 · 身份权限与跨服务授权",
      description:
        "Go IAM 与 Python 服务的租户授权推送：以任务快照 + 幂等标识 + 本地事务 + 持久化回执处理重复请求与超时未知结果重放；组织树改为单次关系查询 + 内存遍历，权限查询按每批 100 个组织有界并发执行。",
      link: "",
      linkLabel: "",
      skills: ["Go", "Gin", "PostgreSQL", "Redis", "并发控制"],
    },
  ],

  experience: [
    {
      company: "北京衔远科技有限公司",
      title: "全栈开发工程师（企业级 AI 产品研发）",
      bullets: [
        "CIP / Leadeep 企业 AI 工作台：负责 Python/FastAPI 后端与 Flutter 客户端接入，打通流式对话、历史消息与成果附件，实现 Web 与移动端状态同步；针对断线、重进与重复事件落地 SQLite 持久化、幂等去重与增量恢复，收敛终态不一致。",
        "大观身份权限与运营服务：参与 Go IAM 与 Python 服务联调，用「任务快照 + 幂等标识 + 事务 + 持久化回执」支撑跨服务授权安全重放；将组织树逐节点读取重构为单次管理关系查询 + 内存遍历，权限按每批 100 组织有界并发查询。",
        "飞鹤 KOS AI 内容生成与运营系统：开发 Vue 3/TypeScript 管理台、消费者 H5 与 FastAPI 接口（含 RBAC 权限）；为 3 风格笔记导写接入 LLM 结构化输出校验、重试与降级，用 Redis 锁兜底长链路评论异步任务，完成 Docker/Harbor/K8s 联调。",
      ],
    },
    {
      company: "星域文化传媒有限公司",
      title: "游戏逻辑开发（玩法与交互实现）",
      bullets: [
        "主导《暴走拖拉机》核心地图逻辑与可复用行为模块构建，按留存与对局数据持续迭代手感调优，上线后周活 2000+，获评平台 A 级标杆作品。",
      ],
    },
  ],

  education: [
    {
      school: "福建理工大学",
      degree: "智能科学与技术 · 本科",
      dateRange: "2022.09 — 2026.07",
      achievements: [
        "国家奖学金 · GPA 3.4/4（专业 Top 5%）",
        "全国大学生数学竞赛 · 福建省一等奖",
      ],
    },
  ],
};
