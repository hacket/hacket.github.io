---
banner: 
date_created: Thursday, June 26th 2025, 11:32:57 pm
date_updated: Sunday, August 3rd 2025, 1:56:03 am
title: Gemini CLI
author: hacket
categories:
  - AI
category: Gemini
tags: [AI, GeminiCLI, VibeCoding]
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
aliases: [Gemini CLI]
linter-yaml-title-alias: Gemini CLI
---

# Gemini CLI

- <https://github.com/google-gemini/gemini-cli>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/index.md>

## Gemini 基础

### 什么是 Gemini CLI?

Gemini CLI 是 google 推出的基于 Gemini 2.5 Pro 模型的开源命令行界面工具，和 Claude Code 体验比较接近，开源的。个人用户通过谷歌账号登录，即可获得 Gemini 2.5 Pro 的使用权，享有 100 万 Token 的上下文窗口，以及 每分钟 60 次、每天 1000 次 的模型请求额度。

### Gemini CLI 安装

- 安装 Node.js (Node 和 NPM)
- 安装 Gemini CLI (升级也一样)

```shell
npm install -g @google/gemini-cli
# 如遇到权限问题，请加入 sudo 命令。
```

### Gemini CLI 授权

<https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/authentication.md#authentication-setup>

#### Login with Google

选择登录方式，这里我们选择使用谷歌账号登录。

```shell
Select Auth Method
│ ● Login with Google
│ ○ Gemini API Key
│ ○ Vertex AI
```

运行登录命令后，会自动打开浏览器，跳转到登录页面，使用谷歌账号登录即可。

**错误 1：**
提示：`Login Failed: "Ensure your Google account is not a Workspace account"` 的话，这是因为你的 Google 账号绑定了 Google Cloud，导致被误判成了 Workspace 账号。
**错误 2：**
可能需要 `GOOGLE_CLOUD_PROJECT`，配置到环境变量中

```shell
GOOGLE_CLOUD_PROJECT=the-monkey-king-assistant
```

#### Gemini API key

- `Google AI Studio` 创建 API key ：<https://aistudio.google.com/app/apikey>
- 导出 `GEMINI_API_KEY` 环境变量

#### Gemini CLI 授权问题

- 科学上网
- 谷歌云创建项目才能有 API key
- 终端一直超时，可能登录的时候要用软路由或者 tun 模式才能登录（在 Windows CMD 不开启 TUN 就一直授权不通过）
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250627005838474.png)

## 配置

Gemini CLI 的行为可通过 `settings.json` 自定义，按以下优先级加载：

- 全局设置：`~/.gemini/settings.json`
- 项目设置：`(项目根目录)/.gemini/settings.json`

主要配置项：

- `theme`：CLI 主题名称，如 `"GitHub"`。
- `contextFileName`：指定上下文文件名，默认为 `GEMINI.md`，可设为数组如 `["GEMINI.md", "PROMPT.md"]`。
- `fileFiltering`：
- `respectGitIgnore`：是否遵循 `.gitignore`，默认 `true`。
- `enableRecursiveFileSearch`：是否递归搜索文件以补全 `@`，默认 `true`。
- `autoAccept`：自动跳过安全工具的执行确认，默认 `false`。
- `sandbox`：启用沙盒（`true` 或 `"docker"`），默认 `false`。
- `checkpointing`：
- `enabled`：启用 `/restore`，默认 `false`。
- `preferredEditor`：指定差分显示编辑器，默认 `"vscode"`。
- `coreTools` / `excludeTools`：指定或排除内置工具。
- `mcpServers`：定义提供自定义工具的 MCP 服务器。

## CLI 命令

gemini-cli 的命令分为 3 种：`/` 命令、 `@` 命令 和 `!` 命令。

### 斜杠 (/) 命令 会话与元控制

这类命令用于控制 CLI 本身的行为，管理会话和设置。

- `/help` 或 /?：显示帮助信息，列出所有可用命令。
- `/chat save`：保存当前的对话历史，并打上一个标签，方便后续恢复。
- `/chat resume`：从之前保存的某个标签恢复对话。
- `/chat list`：列出所有已保存的对话标签。
- `/compress`：用一段摘要来替换整个聊天上下文。在进行了长篇对话后，这个命令可以帮你节省大量的 Token，同时保留核心信息。
- `/memory show`：显示当前从所有 GEMINI.md 文件中加载的分层记忆内容。
- `/memory refresh`：重新从 GEMINI.md 文件加载记忆，当你修改了配置文件后非常有用。
- `/restore [tool_call_id]`：撤销上一次工具执行所做的文件修改。这是一个「后悔药」功能，需要在使用 gemini 命令时加上 --checkpointing 标志来开启。
- `/stats`：显示当前会话的详细统计信息，包括 Token 使用量、会话时长等。
- `/theme`：打开主题选择对话框。
- `/clear` (快捷键 Ctrl+L)：清空终端屏幕。
- `/quit 或 /exit`：退出 Gemini CLI。

### At (@) 命令：注入文件与目录上下文

- `@<file_path>`：将指定文件的内容注入到你的 Prompt 中。

```shell
例如：What is this file about? @README.md
```

- `@<directory_path>`：将指定目录及其子目录下所有（未被 gitignore 的）文本文件的内容注入。例如：@src

```shell
@src/my_project/ Summarize the code in this directory.
```

- 路径中的空格需要用反斜杠 `\` 转义。

### 感叹号 (!) 命令：与你的 Shell 无缝交互

这让你无需退出 Gemini CLI 就能执行系统命令。

- `!<shell_command>`：执行单条 Shell 命令，并返回到 Gemini CLI。例如：`!ls -la` 或 `!git status`。
- `! (单独输入)`：切换到「Shell 模式」。在此模式下，你输入的任何内容都会被直接当作 Shell 命令执行，终端提示符也会变色以作区分。再次输入 ! 可以退出 Shell 模式，回到与 AI 的对话中。

### shift+table ：切换手动确认和自动修改模式

## MCP

<https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md>

配置在 `settings.json` 文件中：

```json
{ ...file contains other config objects
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "cwd": "./server-directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

## Ref

- <https://www.xugj520.cn/archives/gemini-cli-ai-tool.html>
