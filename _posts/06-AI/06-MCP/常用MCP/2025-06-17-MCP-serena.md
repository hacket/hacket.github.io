---
banner: 
date_created: Tuesday, June 17th 2025, 12:15:57 am
date_updated: Monday, October 13th 2025, 11:57:56 pm
title: MCP-serena
author: hacket
categories:
  - AI
category: MCP
tags: [AI, MCP, VibeCoding]
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
aliases: [serena]
linter-yaml-title-alias: serena
---

# serena

serena 是一个代码 Agents 工具包，提供 semantic retrieval 和 editing capabilities (MCP server & other integrations)。

## 什么是 Serena？

简单来说，**Serena 是一个开源的编码代理工具包**。

你可以把它想象成一个 " 超级插件 "，它能让任何大模型（比如 GPT-4、Claude、本地模型）从 " 只会聊天的 AI" 升级为 " 能动手干活的编码代理 "。

**它和普通 AI 助手有什么区别？**

| 普通 AI 助手         | Serena + AI                     |
| -------------- | ------------------------------- |
| 只能 " 看 " 你发给它的代码片段 | 能**直接访问整个项目**，像 IDE 一样理解代码结构      |
| 回答基于文本模式匹配     | 基于**语言服务器协议（LSP）**，知道函数在哪、变量怎么用 |
| 修改代码 = 替换整文件   | 能做 "**手术刀式修改**"，精准插入、替换、重构       |
| 无法运行代码或执行命令    | 可以**读写文件、运行测试、执行终端命令**          |

**一句话：** Serena 让 AI 从 " 旁观者 " 变成了 " 参与者 "。

## Serena MCP

Serena MCP，一个免费开源的 MCP 服务器，专门为程序开发场景打造。

有了它，Claude Code 或其他支持 MCP 的 IDE／Agent，不再仅仅是「看你贴的那段程序代码」，而能更可靠地理解项目整体架构与关联。

**差别大致如下：**
- 未使用 Serena／MCP 的情况：部分 Agent 或许能从你贴过来的多档案内容中理解跨档案关联，但这种方式依赖整批贴上、token 成本高、难以自动追踪改动与执行跨档案操作。
- 使用 Serena MCP：Agent 可以通过 Serena 提供的索引 + 语义理解能力做跨档案重构、更新 requirements.txt、执行测试、保持项目一致性。

**Serana MCP 解决的问题：**

Serena MCP 我理解就相当于是给 AI 用的 IDE。 AI 现在用 `Grep` 太原始了，你想，咱们用编辑器是你搜索快，还是基于 编辑器/IDE 点击跳转到定义快？

这个 MCP 就是解决这类问题。

**Serana MCP 作用：**
Serena 通过语言服务器协议（LSP）实现项目级代码理解，支持符号定位、引用查找、安全给项目重命名、理解代码结构和关系。另外还有提供项目全局记忆功能。以及提供了 40 多个给 AI 使用的工具。

```shell
Serena is a great way to make Claude Code both cheaper and more powerful!
```

Serana 让 Claude Code 更便宜、更强大

## 安装 Serena MCP

- 安装 uv：(安装后重启会话使命令生效)

```shell
# Windows
set UV_INSTALL_DIR=D:\tools\uv
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- 启动 Serena

```shell
uvx --from git+https://github.com/oraios/serena serena-mcp-server
```

- 在 Claude Code 中配置 MCP

```shell
# Mac
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)

# Windows: 由于 Windows 环境的命令行限制，手动编辑配置文件是最可靠的方式。
## 打开或创建 ~/.claude.json，添加以下配置：
 {
   "mcpServers": {
     "serena": {
       "command": "uvx",
       "args": [
         "--from",
         "git+https://github.com/oraios/serena",
         "serena",
         "start-mcp-server",
         "--context",
         "ide-assistant",
         "--project",
         "D:\\android\\AndroidStudioProjects\\OpenSources\\king-assist"
       ]
     }
   }
 }
##  - Windows 路径使用双反斜杠 \\ 或单正斜杠 /
##  - --project 参数指向你的项目绝对路径
```

## Configuration 配置

有默认配置，也可以自定义

- 全局 `~/.serena/serena_config.yml`

```yml
gui_log_window: false

web_dashboard: true

web_dashboard_open_on_launch: true

log_level: 20
# the minimum log level for the GUI log window and the dashboard (10 = debug, 20 = info, 30 = warning, 40 = error)

trace_lsp_communication: false

ls_specific_settings: {}

tool_timeout: 240
# timeout, in seconds, after which tool executions are terminated

excluded_tools: []
# list of tools to be globally excluded

included_optional_tools: []

jetbrains: false


default_max_tool_answer_chars: 150000

record_tool_usage_stats: false
# whether to record tool usage statistics, they will be shown in the web dashboard if recording is active.

token_count_estimator: TIKTOKEN_GPT4O

projects:
- D:\android\AndroidStudioProjects\OpenSources\king-assist

```

变更配置：

```xml
uvx --from git+https://github.com/oraios/serena serena config edit
```

- 项目根目录 `.serena/project.yml`，项目激活时加载
这个文件首次加载时生成，也可以用下面命令生成

```shell
uvx --from git+https://github.com/oraios/serena serena project generate-yml
```

## Project Activation & Indexing

如果经常在相同的项目工作，可以配置在启动的时候传递 `--project <path_or_name>` to the `start-mcp-server` 命令给 MCP client 配置，特别是 Claude Code：

```json
"serena": {
   "command": "uvx",
   "args": [
	 "--from",
	 "git+https://github.com/oraios/serena",
	 "serena",
	 "start-mcp-server",
	 "--context",
	 "ide-assistant",
	 "--project",
	 "D:\\android\\AndroidStudioProjects\\OpenSources\\king-assist"
   ]
 }
```

或者问 LLM，让 LLM 激活

```shell
"Activate the project /path/to/my_project"
"Activate the project my_project"
```

也可以问 LLM 是否激活了：

![PixPin_2025-10-13_00-33-09.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202510130033294.png)

激活的项目会自动添加到 `serena_config.yml` 配置文件中去，对于每个项目都会生成 `.serena/project.yml` 文件，你也可以调整，如 name，确保 2 个不同的项目不会有相同的 name。

**大型项目：** 对于大型项目，我们推荐 index 你的项目以加速 Serena 工具，否则第 1 个 tool 会很慢，在项目根目录执行：

```shell
uvx --from git+https://github.com/oraios/serena serena project index
```

## Claude Code

`v1.0.52` 版本及以上，Claude Code 会读取 senera 的指令自动处理；低版本可以手动添加指令 `"read Serena's initial instructions"` 或运行 `/mcp__serena__initial_instructions` 命令加载指令文本。

## serena 实践

### 项目记忆与上下文管理

Serena 支持 " 记忆 " 功能，让 AI 记住你的项目设计；这样即使切换对话，AI 也能 " 无缝衔接 "。

```shell
请为这个重构任务创建一个详细的计划，并保存为记忆
显示所有项目记忆
读取关于数据库设计的记忆
```

### 大型项目重构利器

把项目里所有旧 API 换成新 API。

```shell
请找出所有调用旧API `fetch_data_v1` 的地方，并替换为 `fetch_data_v2`
每处修改后请运行相关测试
```

AI 自动完成查找、替换、测试，你只需要喝杯咖啡。
