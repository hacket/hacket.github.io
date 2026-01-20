---
banner:
date_created: Tuesday, December 9th 2025, 12:01:46 am
date_updated: Thursday, January 15th 2026, 12:18:32 am
title: Google Antigravity
author: hacket
categories:
  - AI
category: Gemini
tags: [AI, Gemini]
toc: true
description:
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
aliases: [Google Antigravity]
linter-yaml-title-alias: Google Antigravity
---

# Google Antigravity

## Google Antigravity 使用前提

- 全局代理：Antigravity 是桌面应用，其登录流量（OAuth 授权）需要全局代理，而非仅浏览器代理。在你的代理软件（如 Clash、V2Ray、Clash for Windows）中，找到 "`TUN 模式`" 或 "`虚拟网卡模式`" 并启用。
- 全局代理，开启 TUN 模式无效时，使用 Proxifier 强制代理
	- 配置代理服务器 (Proxy Server)：填入你魔法的本地端口（通常是 127.0.0.1:7890，具体看你的软件设置）
	- 配置代理规则 (Proxification Rules)
- 美国 IP：并且要确保自己配置了一个纯净美区 IP，单独使用静态住宅 IP 网速可能受限，可以在推上找找教程，配合机场节点部署一套链式代理。
- 美国 Google 账号 (或者支持的国家列表中)

## Antigravity 问题

使用 AI 服务，登录账号就是必需的，后续的 AI 功能也是要联网的。所以对国内用户而言真正的难点就是：账号问题和联网问题。

### Antigravity 网络问题

世界上有两种软件，代理友好的和代理不友好的。Antigravity 目前不会跟随系统或环境的代理设置，也不支持用户自己设置，所以属于代理不友好的软件。虽然 Editor 设置里有一个 proxy 设置，但是目前它没有覆盖到 Antigravity 的所有部分，所以还是有问题。

解决方法（这里只说原理，不介绍具体方法）：

1. 全局代理模式：强行让电脑上的所有程序都走代理。
2. 局部代理模式：有些代理工具可以指定特定的程序或进程走代理，这样你只需要找出 Antigravity 相关的进程就可以了。
用系统自带的进程管理器或者 Antigravity "Help 菜单 - Open Process Explore" 都行。主要是 `Antigravity`、`Antigravity Helper`、`language_server_xxx` (如 language_server_macos_arm ）。其中主进程负责账号登录，language_server 进程负责 agent 的相关功能。
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/antigravity_process_view.png)

**目前可用的方式：**
- 一种方式是用 `Proxifier` 软件让 Antigravity 都走代理
- 还有就是用 `Clash Verge` 开启 Tun 模式（虚拟网卡）走代理

### Antigravity 账号地区问题

你的账号需要是受支持的国家地区且年满 18 周岁，具体支持哪些国家见 <https://antigravity.google/docs/faq> 。必要时需要修改你的账号所属地区和验证年龄。

节点已经切到了 US 或 SG，结果依然被挡在门外，其实不是节点问题，而是你的 Google 账户归属地。Google 账号有一个隐藏属性："`Country Association`"（账户归属地）

即便你当前的 IP 在美国，如果你的 Google 账号被系统判定为归属在某个 " 不支持的地区 "，依然无法访问对应的服务。

因此，要解决这个报错，你真正需要修改的是 Google 账户的归属地。

在 [https://policies.google.com/terms](https://policies.google.com/terms) 查看你 google 账号的关联地区，在 [https://policies.google.com/country-association-form](https://policies.google.com/country-association-form) 可以申请修改账号当前的国家或地区版本。

**申请：**
 - 打开 Google 官方申诉表单
👉 <https://policies.google.com/country-association-form>
这是 Google 官方提供的地区关联修改页面。
- 填写并提交申请
	- 进入页面后：
	- 填写你的 Google 账号邮箱
	- 地区选择 **US**（或 SG）
	- 原因选择 **Other（其他原因）**，很多人不知道理由怎么写，我可以分享我自己是怎么填的：**我如实告诉 Google：需要使用 Antigravity 开发应用，因此希望调整账号的 Country Association。**
	- 对应英文："I need to use Antigravity for app development, so I would like to request a change to my account's Country Association."
- 修改不是即时生效的，需要 Google 系统审核。需要几小时或几天，审核完会发送邮件。
- 收到邮件后，记得清缓存再登录；为了避免旧缓存导致地区判定还停留在修改前：
	- 清浏览器缓存
	- 或清 Antigravity 的缓存
	- 再重新登录即可

**避坑：**
- **1. 不要频繁切换地区**
频繁改地区、频繁切节点都容易触发 Google 风控。  
会出现验证码变多、服务访问异常等情况。

- **2. 选择与你常用节点一致的地区**
保持 **" 人号合一 "** 最稳妥：
- 你常用哪个国家的节点
- Google 账户也设为同一个国家
这样最不容易触发风控。

### 其他一些问题

❶授权成功但不跳转，可能原因：浏览器/缓存问题

清浏览器缓存，或重装 Antigravity。Windows 用户确保安装在 C: 盘。

❷无限转圈，可能原因：服务器过载或率限

等 5 小时（免费版刷新周期），或升级 Google AI Pro（更高限额）。检查 Antigravity 状态页 有无维护。

❸Mac/Windows 特定卡住，可能原因：系统权限/缓存

Mac: 删除 ~/Library/Application Support/Antigravity/Cache 文件夹。Windows: 以管理员运行。

## Antigravity 使用

### Agent Manager 窗口

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/antigravity_agent_manager_20260105000255482.png)

点击 Editor 窗口右上角的 `Open Agent Manager` 或使用快捷键 `Cmd/Ctrl + E` 即可打开 Agent Manager 窗口。

`Agent Manager` 是所有 Agent 的集中管理窗口，这里你可以管理所有 workspace 的对话（conversation）。这是传统 IDE 没有的。在 agent 使用模式下，用户和 agent 是通过对话进行互动的。

他们的关系如下：

- Antigravity 可以有多个 workspace （所以就有多个 workspace 的 Editor 窗口）和一个 Agent Manager 窗口。
- 一个 workspace 中可以有一个或多个对话。
- Editor 窗口右侧的 agent 面板和 Agent Manager 窗口中相应的对话是一样的，并且 UI 是同步的。你在哪边用都可以。
- Agent Manager 可以同时发起和管理多个对话，Editor 窗口右侧的 agent 面板一次只能显示一个对话（点击顶部的 + 可以创建新的对话，但只能显示一个）。

Agent Manager 中还有一个特殊的 Playground ，它不是 workspace ，但是也可以进行对话，方便你尝试各种功能。你可以把它理解为一个临时的 workspace 。另外，通过 Agent Manager 窗口顶部的 Move 按钮，可以把 Playground 中的某个对话移动到你指定的文件夹中保存。

窗口的各部分功能：

- `Inbox`：所有最近的对话
- `Start Conversation 或 + 号`：新建对话
- `Workspace`：各个 workspace 下的对话
- `Playground`：临时的功能试验区
- `右侧主面板`：显示某个具体的对话。注意，点击对话中的某些信息，会在它的右侧再展开一个面板用于显示相关的信息，如 Task List 、浏览器截图等。
- `Knowledge`：自动生成的知识库，需要使用一段时间才可能有
- `Browser`：启动浏览器
- `Provide Feedback`：提交 bug 或 feature request

另外顶部的 Review Changes 和它旁边的那个小按钮也很有用。

#### Start Conversation

新建对话时，你可以选择：

- 对话是在哪个 workspace 下运行，或在 Playground 中运行
- Fast 还是 Planning 模式：前者适合简单任务，后者适合复杂的任务，比如从头开始创建一个应用时就要用 Planing 模式。

模型选择：不同的模型能力不同、速度不同、token 消耗不同，目前支持：

- Gemini 3 Pro (high)
- Gemini 3 Pro (low)
- Claude Sonnet 4.5
- Claude Sonnet 4.5 (thinking)
- Claude Opus 4.5 (thinking)
- GPT-OSS

价格：目前都是免费的，但是有使用额度限制。Google AI Ultra 会员给的额度最高，其次是 Google AI Pro 会员，使用额度每 5 小时刷新一次。免费用户额度最小，每周刷新一次，也就是说短时间内用用问题不大。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20260105005129818.png)

通过对话下达任务，每一个对话在执行的时候就是一个 agent 实例。开发者可以同时让最多 5 个 agent 实例并行运行。执行的时候，UI 会不断更新显示 agent 的运行状态。很多任务需要数分钟的时间才能完成，所以你也不需要一直盯着它，需要请求权限、review 或任务完成时，它会发出系统通知提醒你。

### 上下文引用

在对话输入框中，你可以使用 `@` 符号引用文件、目录、MCP 等，这样 agent 好知道相关的目标对象。

此外，还可以使用 `/` 符号引用自定义工作流（workflow）执行。

### Artifacts

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20260105005312647.png)

Planning 模式的对话，在 agent 在执行的过程中，会产生一些中间产物，这些中间产物被称为 Artifacts 。比如新建一个应用的时候，它会生成 Task Lists、Implementation Plan 和 Walkthrough，也就是任务列表、实现方案和工作总结。前两个是在生成代码之前的产出，Walkthrough 是任务完成后的产出。你可以通过添加评论的方式和这些产物交互，然后 agent 会做相应的变更。此外，Artifacts 还包括 code diff、屏幕截图、屏幕录像等。

在 Agent Manager 窗口中查看 Artifacts： 点击对话顶部的 Review Changes 按钮，以及它旁边的另一个按钮。

在 Editor 窗口中查看 Artifacts：agent 对话输入框上方有一个图标按钮也可以查看 Artifacts 。

**注意：** 删除对话会同时删除该对话产生的 Artifacts 。

还可以评论：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20260105011313744.png)

### 编辑器和命令行中的 AI 功能

除了在对话窗口中让 agent 执行任务，还可以在 Editor 窗口的编辑器和 Terminal 中通过对话生成代码。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20260105005417303.png)

比如在 Terminal 中，按 `Cmd/Ctrl + I` 弹出一个小窗口，输入提示词 " 统计 src 目录下所有 .js 文件的行数 "，它会生成需要执行 shell 命令。

在代码编辑器中，可以选中几行代码然后按下 `Cmd/Ctrl + I` 弹出输入框输入你的指令。也可以按 `Cmd + L` 激活对话窗口，它会自动使用 @ 符号引用这几行代码。当然，也可以不选中代码直接使用该功能，比如生成新的函数。

### 内置浏览器 agent

Antigravity 内置了 Chrome 浏览器工具。它可以打开网站、查看网页内容、滚动页面、输入内容、截图、录像等。比如你对 agent 说 " 打开 google.com ，搜索 " 北京天气 "，把截图发给我 "，或者 " 访问 news.google.com ，告诉我今日要闻 "。总之，非常适合自动化任务。

agent 在自动执行的时候，为了告诉你这是内置的浏览器在自动工作，别和你自己的浏览器页面混淆，它会在页面的四周显示蓝色边框。另外，需要授权的时候会在 agent 窗口向你请求权限，比如打开页面、执行 JS 等工作。

手工打开内置浏览器：在 Editor 窗口点击顶部右上角的浏览器图标，或者在 Agent Manager 窗口点击左下角的浏览器图标。

第一次打开浏览器，页面会提示你需要安装一个 Chrome 扩展，点击安装即可。因为这个内置的浏览器是由 Antigravity 的 Browser Subagent 控制的，目前它应该是基于 Chrome 扩展实现的功能。其实，Chrome 团队在今年 9 月也推出了自己的 DevTools MCP ，可以实现类似的功能，甚至更强大。Antigravity 和 Chrome 是两个不同的团队，所以目前有各自的实现，以后说不定会统一。不过由于 Antigravity 支持 MCP ，所以你也可以自己在 Antigravity 中添加 DevTools MCP 。

### MCP Servers

点击 Editor 窗口 Agent 面板的右上角，选择 MCP Servers ，就会显示 MCP 的管理界面。这里列出了很多内置支持的 MCP Servers ，选择安装就行了。

### Rules 和 Workflows

![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dps4Ar86cJnXVgu58rvHJlzsWY4pfvdqicAuqUpmG48uUHY1Swcic8E2UMmKUCp2Cmdx5pPbOvsGh0vksYYg3c9g/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=12)

在 Editor 窗口中点击 agent 面板右上角，点击 Customizations 菜单即可显示 `Rules` 和 `Workflows` 定制界面。

- Rule（规则）：用来定义 agent 的行为。比如让代码遵循特定 code style ，让所有方法都有文档注释。定义了 Rule 之后，agent 在执行的时候始终会注意这些要求，而不用每次对话都嘱咐它。所以 Rule 相当于系统指令。
- Workflows（工作流）：是保存起来的自定义提示词。和 Rule 不同，它不会主动触发，而是需要手工触发。在对话窗口中，使用 `/` 符号引用要执行的 workflow 即可。相当于给经常要重复执行的命令做了个快捷键。

Rule 和 Workflow 的作用域都有全局和 workspace 之分。全局就是影响所有的 workspace ；workspace 就是只对当前 workspace 生效。他们的保存路径是：

- Global rule: `~/.gemini/GEMINI.md`
- Global workflow: `~/.gemini/antigravity/global_workflows/` 目录中
- Workspace rule: `your-workspace/.agent/rules/` 目录
- Workspace workflow: `your-workspace/.agent/workflows/` 目录

### Nano Banana 生成图片

目前，Antigravity 已经支持 Nano Banana ，在对话窗口中告诉它生成图片就行。比如根据代码生成一张图解释类之间的关系，或者为网站设计一个 logo。

### 安全

让 agent 在你的电脑本地执行各种命令可能有安全风险。目前 Antigravity 通过以下这些设置加以控制（`Antigravity - Settings`）：

- Secure Mode：新增的功能，启用后会增强安全，同时也会影响下面这些其它设置功能。
- Terminal 中是否自动执行命令设置，以及允许执行的 Allow List 和不允许执行的 Deny List
- Browser 中是否自动执行 Javascript 的设置，以及 Browser URL Allowlist
- File Access：Workspace 隔离设置（是否可以访问 workspace 之外的文件）和是否允许访问 .gitignore 文件。
- Artifact Review Policy 设置

## Antigravity 辅助工具

### Antigravity Quota Watcher

Google Antigravity AI 模型配额监控插件：<https://github.com/wusimpl/AntigravityQuotaWatcher>

## Ref

- [# Google Antigravity 快速入门](https://mp.weixin.qq.com/s/TMuVdfNlphvGa-elEKlRFQ)
