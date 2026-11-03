# 搭子Match

> 面向高校学生的项目组队平台：用「多维意向 + 能力画像 + 信用体系」，把散落在群聊、校园墙和 Excel 里的组队信息，收拢成一条可检索、可匹配、可追责的链路。

本仓库包含两部分：**产品需求体系（GitHub Issues）** 与 **可运行的高保真 Demo（用户端 + 管理端）**。当前阶段是 MVP 需求拆解完成、Demo 已覆盖主流程。

---

## 目录

- [项目概览](#项目概览)
- [需求体系](#需求体系)
- [在线 Demo](#在线-demo)
- [核心流程](#核心流程)
- [技术实现](#技术实现)
- [仓库结构](#仓库结构)
- [说明](#说明)

---

## 项目概览

校园组队真正难的从来不是“发一条招募”，而是三件事：

1. **找不到**：信息散在微信群、QQ 频道、表白墙，发帖即沉底，跨校、跨校区更难触达；
2. **不敢信**：无法确认对方是不是真实在校生，也不知道他写的技能是真是假；
3. **管不住**：招满人帖子关不掉、被骚扰没有地方投诉、合作完的差评与好评无法沉淀。

搭子Match 用四层机制回应：**实名准入**（校园身份核验 + 隐私保护）、**结构化表达**（意图双轨 + 强制标签 + 圈层可见范围）、**撮合与信用**（智能匹配 + 能力举证 + 双向互评）、**可控闭环**（关闭帖子、举报投诉、后台处置）。

当前范围：

| 维度 | 内容 |
| --- | --- |
| 功能模块 | 11 个 C 端模块 + 6 个 B 端模块 |
| 功能点 | F01–F75，编号连续、不重复 |
| 分期 | MVP（11 个 Issue）、P1（9 个 Issue）、P2（7 个 Issue） |
| Demo | 用户端主流程可点可走；管理端覆盖审核、用户、帖子、看板 |
| 数据 | 全部前端 Mock，不连接后端 |

---

## 需求体系

需求以 GitHub Issue 为唯一来源，前端代码只描述“已经做出来的样子”。

- [产品全景与研发路线图 #27](https://github.com/ZR415/match-platform/issues/27) · 分期、冷启动、合规底线、研发规范（17 个子 Issue 的进度在此查看）
- [前期调研报告 #8](https://github.com/ZR415/match-platform/issues/8) · 调研结论与竞品分析
- [核心需求点清单 #3](https://github.com/ZR415/match-platform/issues/3) · 9 条原始需求与调研依据
- [核心需求解决方案与功能拆解 #4](https://github.com/ZR415/match-platform/issues/4) · 现有方法对比与方案推导
- [核心功能与用户故事说明文档 #9](https://github.com/ZR415/match-platform/issues/9) · F01–F75 功能索引

### 功能模块

| 编号 | 模块 | 阶段 | 功能点 | Issue |
| --- | --- | --- | --- | --- |
| C-01 | 账号准入与实名认证 | MVP | F01–F03 | [#10](https://github.com/ZR415/match-platform/issues/10) |
| C-02 | 个人档案与能力画像 | MVP / P1 | F04–F07 | [#11](https://github.com/ZR415/match-platform/issues/11) |
| C-03 | 组队信息发布 | MVP / P1 | F08–F11 | [#12](https://github.com/ZR415/match-platform/issues/12) |
| C-04 | 信息浏览与检索 | MVP / P1 | F12–F17 | [#13](https://github.com/ZR415/match-platform/issues/13) |
| C-05 | 建立联系 | MVP / P1 | F18–F25 | [#14](https://github.com/ZR415/match-platform/issues/14) |
| C-06 | 消息与关系管理 | P1 / P2 | F26–F31 | [#15](https://github.com/ZR415/match-platform/issues/15) |
| C-07 | 智能匹配 | P1 / P2 | F32–F38 | [#16](https://github.com/ZR415/match-platform/issues/16) |
| C-08 | 信任与互评体系 | MVP / P1 | F39–F41 | [#17](https://github.com/ZR415/match-platform/issues/17) |
| C-09 | 个人中心与资产 | MVP / P1 / P2 | F42–F48 | [#18](https://github.com/ZR415/match-platform/issues/18) |
| C-10 | 极简体验与辅助 | P1 / P2 | F49–F52 | [#19](https://github.com/ZR415/match-platform/issues/19) |
| C-11 | AI 辅助能力 | P2 | F53–F55 | [#20](https://github.com/ZR415/match-platform/issues/20) |
| B-01 | 管理员登录与后台框架 | MVP | F56–F58 | [#21](https://github.com/ZR415/match-platform/issues/21) |
| B-02 | 用户管理与封禁 | MVP | F59–F62 | [#22](https://github.com/ZR415/match-platform/issues/22) |
| B-03 | 内容审核 | MVP | F63–F66 | [#23](https://github.com/ZR415/match-platform/issues/23) |
| B-04 | 投诉举报处理 | MVP | F67–F68 | [#24](https://github.com/ZR415/match-platform/issues/24) |
| B-05 | 评价申诉审核 | P1 | F70–F71 | [#25](https://github.com/ZR415/match-platform/issues/25) |
| B-06 | 数据看板 | P1 / P2 | F69、F72–F75 | [#26](https://github.com/ZR415/match-platform/issues/26) |

每个 Issue 都包含：背景与痛点、现有方法横向对比、用户故事、分期范围与功能描述、验收标准、依赖模块与 Demo 深链。

### MVP 最小闭环

`认证 → 建档 → 发帖 → 浏览 → 联系 → 审核/封禁 → 举报`，对应 C 端 7 个 Issue + B 端 4 个 Issue。收藏、帮助中心、空状态、引导、数据看板等不进入 MVP，已按 P1/P2 重新安放。

---

## 在线 Demo

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

### 演示账号

管理端登录页已预填演示账号，直接点击「登录」即可：

| 字段 | 值 |
| --- | --- |
| 账号 | `admin` |
| 密码 | `admin123` |

用户端从隐私政策引导页进入：

- **登录**：任意 11 位手机号 + 4~6 位验证码，直接进入广场；
- **注册**：网名 + 手机号 + 验证码 → 实名认证 → 完善资料三步 → 广场。

---

## 核心流程

```
隐私政策 → 同意并继续
   ├─ 登录（任意手机号 + 验证码）→ 广场
   └─ 注册 → 实名认证 → 完善资料 Step1~3 → 广场

广场 / 搜索 → 帖子详情 → 发起沟通（聊天）
   └→ 精准匹配（来源：个人主页 / 帖子 / 手动）→ 权重设置 → 匹配结果

发帖 → AI 帮我写 → 选择竞赛与标签 → 发布 → 广场同步
```

管理端四个模块：

| 模块 | 路由 | 能力 |
| --- | --- | --- |
| 数据看板 | `#/dashboard` | 核心指标、趋势、待办概览 |
| 审核中心 | `#/audit` | 内容审核 / 投诉举报 / 评价申诉三个队列 |
| 用户管理 | `#/users` | 用户检索、三态封禁与解封 |
| 帖子管理 | `#/posts` | 帖子检索、下架与恢复 |

---

## 技术实现

| 项目 | 选型 |
| --- | --- |
| UI 框架 | React 18（UMD，无构建） |
| 样式 | Tailwind CSS（CDN + 自定义主题） |
| 图标 | lucide（UMD） |
| 编译 | Babel Standalone（浏览器内转译 JSX） |
| 路由 | 用户端自研页面栈（`?page=` 深链）；管理端 hash 路由 |
| 数据 | 纯前端 Mock 常量 |

选择「无构建」是为了让 Demo 开箱即用：克隆仓库后无需 `npm install`，启动静态服务器即可查看。

---

## 仓库结构

```
match-platform/
├── README.md                     # 仓库总览（当前文件）
├── .gitignore
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

## 说明

本项目用于产品演示与交流，不包含真实用户数据，也不连接任何后端服务。演示中的学校、用户、帖子、举报等信息均为虚构。

要做什么、先做哪些、做到什么程度，以 [Issue #27](https://github.com/ZR415/match-platform/issues/27) 及其 17 个子 Issue 为准；前端代码只描述“已经做出来的样子”。
