# 搭子Match · 产品演示 Demo

> 面向在校大学生的项目组队与协作平台。本仓库包含 **用户端 App** 与 **平台管理端** 两套可直接运行的前端演示程序。

搭子Match 通过「多维意向 + 能力画像 + 信用体系」帮助大学生找到靠谱的项目搭子，解决校园组队中信息分散、匹配低效、协作风险高的问题。本仓库为产品原型演示，所有数据均为前端 Mock，无需后端服务。

---

## 一、在线预览

| 演示 | 在线体验 | 本地地址 | 说明 |
| --- | --- | --- | --- |
| 用户端 App | [打开演示](https://match-platform-user-app-5y34.vercel.app/) | `http://localhost:5173/user-app/` | 移动端 390 × 844 手机壳预览 |
| 平台管理端 | [打开后台](https://match-platform-admin-console-efkt.vercel.app/) | `http://localhost:5173/admin-console/admin.html` | PC 端 1280 宽屏，需登录 |

本地启动（任选其一）：

```bash
# 在仓库根目录执行
python -m http.server 5173
```

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

> 两个 Demo 均通过 CDN 加载 React 18、Tailwind、Babel 与 lucide 图标，首次打开需要联网。

---

## 二、仓库结构

```
match-platform/
├── README.md                     # 仓库总览（当前文件）
├── .gitignore
├── docs/                         # 产品与演示文档（描述 Demo 现状）
│   ├── 01-产品说明.md             # 定位、目标用户、核心流程
│   ├── 02-功能清单.md             # 用户端 / 管理端已实现功能
│   ├── 03-页面地图.md             # 页面与路由说明
│   ├── 04-更新日志.md             # 版本迭代记录
│   ├── 05-前期调研报告.md         # 需求调研与竞品分析（含 6 张佐证截图）
│   └── assets/pre-research/       # 前期调研报告附图
├── user-app/                     # 用户端演示（移动端）
│   ├── README.md
│   ├── index.html                # 构建产物，可直接打开
│   ├── index-shell.html          # HTML 外壳模板
│   └── src/                      # 拆分源码（按模块）
├── admin-console/                # 平台管理端演示（PC 端）
│   ├── README.md
│   ├── admin.html                # 单文件应用，可直接打开
│   └── vercel.json               # Vercel 部署重写配置
└── scripts/
    ├── build-user-app.ps1        # 用户端源码 → index.html 组装脚本
    └── start.ps1                 # 本地静态服务器启动脚本
```

---

## 三、演示账号

管理端登录页已预填演示账号，直接点击「登录」即可：

| 字段 | 值 |
| --- | --- |
| 账号 | `admin` |
| 密码 | `admin123` |

用户端从隐私政策引导页进入，可选择：

- **登录**：任意 11 位手机号 + 4~6 位验证码，直接进入广场；
- **注册**：网名 + 手机号 + 验证码 → 实名认证 → 完善资料三步 → 广场。

---

## 四、技术栈

| 项目 | 选型 |
| --- | --- |
| UI 框架 | React 18（UMD，无构建） |
| 样式 | Tailwind CSS（CDN + 自定义主题） |
| 图标 | lucide（UMD） |
| 编译 | Babel Standalone（浏览器内转译 JSX） |
| 路由 | 用户端自研页面栈；管理端 hash 路由 |
| 数据 | 纯前端 Mock 常量 |

选择「无构建」是为了让演示 Demo 开箱即用：克隆仓库后无需 `npm install`，双击即可运行。

---

## 五、用户端核心流程

```
隐私政策 → 同意并继续
   ├─ 登录（任意 11 位手机号 + 验证码）→ 广场
   └─ 注册 → 实名认证 → 完善资料 Step1~3 → 广场

广场 / 搜索 → 帖子详情 → 发起沟通（聊天）
   └→ 精准匹配（来源：个人主页 / 帖子 / 手动）→ 权重设置 → 匹配结果

发帖 → AI 帮我写 → 选择竞赛与标签 → 发布 → 广场同步
```

---

## 六、管理端模块

| 模块 | 路由 | 能力 |
| --- | --- | --- |
| 数据看板 | `#/dashboard` | 核心指标、趋势、待办概览 |
| 审核中心 | `#/audit` | 投诉举报 / 评价申诉 / 内容审核 |
| 用户管理 | `#/users` | 30 条用户数据、三态封禁与解封 |
| 帖子管理 | `#/posts` | 帖子检索、下架与恢复 |

---

## 七、文档索引

`docs/` 只描述当前 Demo 的实现现状，**不作为需求依据**。产品需求、分期与验收标准以 GitHub Issue 为准：

- [产品全景与研发路线图 #27](https://github.com/ZR415/match-platform/issues/27) · 需求与分期总览
- [核心需求点清单 #3](https://github.com/ZR415/match-platform/issues/3) · 需求来源
- [核心需求解决方案与功能拆解 #4](https://github.com/ZR415/match-platform/issues/4) · 方案来源
- [核心功能与用户故事说明文档 #9](https://github.com/ZR415/match-platform/issues/9) · F01–F75 功能索引

Demo 文档：

- [产品说明](docs/01-产品说明.md)
- [功能清单（Demo 现状）](docs/02-功能清单.md)
- [页面地图](docs/03-页面地图.md)
- [更新日志](docs/04-更新日志.md)
- [前期调研报告](docs/05-前期调研报告.md) · 同步 Issue [#8](https://github.com/ZR415/match-platform/issues/8)

---

## 八、说明

本项目仅用于产品演示与交流，不包含真实用户数据，也不连接任何后端服务。演示中的学校、用户、帖子、举报等信息均为虚构。

Demo 与需求的关系：`docs/` 与前端代码描述“已经做出来的样子”，实际要做什么、做到什么程度，以 [Issue #27](https://github.com/ZR415/match-platform/issues/27) 及其 17 个子 Issue 为准。
