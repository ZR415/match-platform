# 用户端演示 · user-app

移动端校园组队 App 的可运行原型，画布尺寸 390 × 844，外层带手机壳预览。

## 运行

```bash
# 仓库根目录
python -m http.server 5173
# 浏览器打开
http://localhost:5173/user-app/
```

也可以直接用浏览器打开 `index.html`（部分浏览器对 `file://` 的 CDN 加载有限制，建议用本地服务器）。

## 源码组织

`index.html` 是构建产物，由 `scripts/build-user-app.ps1` 将 `src/` 下的模块按顺序拼接进 `index-shell.html` 的 `/*__APP_CODE__*/` 占位符生成。修改源码后需要重新构建：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-user-app.ps1
```

| 文件 | 职责 |
| --- | --- |
| `src/00-core.js` | 全局上下文、Icon/Avatar/Page/Header/TabBar/Modal/Drawer/Toast 等基础组件 |
| `src/01-data.js` | 学校、技能、意向、用户、帖子、会话等 Mock 数据 |
| `src/01b-pickers.js` | 竞赛 / 比赛选择器数据（7 类 55 项） |
| `src/02-auth.js` | 隐私政策、注册登录双轨、实名认证、完善资料三步 |
| `src/03-square.js` | 广场、搜索、发帖（含 AI 写作弹窗与竞赛选择） |
| `src/04-detail.js` | 帖子详情、AI 对话、精准匹配全流程 |
| `src/05-chat.js` | 消息列表、聊天、能力自证（发凭证）、举报 |
| `src/06a-profile.js` | 我的、设置、隐私、退出登录 |
| `src/06b-library.js` | 个人信息库、资产、收藏、他人主页、帮助反馈 |
| `src/07-app.js` | 自研路由栈、全局状态、页面渲染入口 |

## 页面栈规则

- `go(name)`：入栈，用于卡片 / 按钮跳转，返回时精准退回上一页；
- `back()`：出栈，栈底兜底回广场；
- `tab(name)`：重置为单层栈，用于底部 Tab 切换与退出登录（等价 replace）；
- 发帖走 `go('post')`，属于二级页面，关闭后回到原页面。

## 关键交互

- **登录 / 注册双轨**：登录直接进广场；注册必须先实名认证，再走完善资料 Step1~3；
- **精准匹配**：来源选择（个人主页 / 帖子 / 手动）→ 权重 → 雷达 Loading → 结果 / 空状态；匹配状态提升到全局，跨页返回不丢失；
- **发凭证**：提交作品集 / 获奖证明 / 项目经历三类能力自证，支持勾选与文件卡片；
- **AI 帮我写**：弹窗内可输入需求，一键转化回填标题与正文；
- **搜索**：帖子 / 用户双 Tab，关键词分词模糊匹配，带空状态兜底。
