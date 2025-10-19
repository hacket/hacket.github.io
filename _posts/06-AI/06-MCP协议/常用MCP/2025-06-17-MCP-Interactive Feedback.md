---
banner: 
date_created: Tuesday, June 17th 2025, 12:13:51 am
date_updated: Tuesday, June 24th 2025, 12:54:30 am
title: MCP-Interactive Feedback
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
aliases: [Interactive Feedback]
linter-yaml-title-alias: Interactive Feedback
---

# Interactive Feedback

<https://github.com/noopstudios/interactive-feedback-mcp>

## Interactive Feedback 介绍

### 背景

深度使用 Cursor 写前端，随着项目代码增多，Cursor 就越来越难用了。经常出现丢失上下文，乱改文件的情况，一个简单的修改都要消耗好几个次数。

500 次请求不够用，这个月刚刚过半查看使用情况，发觉还有不到 100 次，很是无语。网上搜索一圈，就找到了今天的主角：**Interactive Feedback MCP**。

### 什么是 Interactive Feedback？

Interactive Feedback MCP 会启动一个简单的 MCP 服务，用于在 Cursor 等 AI 辅助开发工具中启用人工参与的工作流程。该服务允许您运行命令、查看输出，并直接向 AI 提供文本反馈。

根据介绍，可以看出它可以在单次 Cursor 请求周期内进行无限次数的追问，来实现多次追问的效果。这样在进行 bug 修复时，当 Cursor 认为已经完成工作时不会简单的结束该次请求进程，而是调用 Interactive Feedback MCP 开始交互式反馈，直到用户关闭了交互窗口或者返回空，Cursor 才会结束工作。

## 安装

### **前置条件：**

- Python 3.11 或更高版本
	- 安装 uv 包管理器：
- Windows: `pip install uv`
- Linux/Mac: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### 安装/启动

<https://github.com/noopstudios/interactive-feedback-mcp?tab=readme-ov-file#installation-cursor>

```shell
git clone https://github.com/noopstudios/interactive-feedback-mcp.git

cd path/to/interactive-feedback-mcp

# 安装依赖
uv sync

# 运行 mcp 服务
uv run server.py
```

只要没有报错就表示启动成功了。

**配置 Cursor:**

```json
"interactive-feedback-mcp": {
  "command": "uv",
  "args": [
	"--directory",
	"D:\\AI\\MCP\\interactive-feedback-mcp",
	"run",
	"server.py"
  ],
  "timeout": 600,
  "autoApprove": [
  	"interactive_feedback"
  ]
}
```

测试：

```
 uv --directory D:\AI\MCP\interactive-feedback-mcp run run_server.py
```

## 使用

### Prompt Engineering

添加规则：

```
Whenever you want to ask a question, always call the MCP interactive_feedback.
Whenever you’re about to complete a user request, call the MCP interactive_feedback instead of simply ending the process. Keep calling MCP until the user’s feedback is empty, then end the request.
```

### 实战

当我们发出请求后，Cursor 开始像往常一样的工作。等到它工作结束完成了工作总结时，可以看到它并没有像往常一样直接收工，而是根据设定的规则调用 MCP： `Call MCP tool interactive_feedback`。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250623011210733.png)

此时会弹出一个交互界面，询问是否需要进一步修改：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250623011231801.png)

这里我会检查前端界面是否符合我的预期，如果不符合则继续追问，Cursor 会在当前会话上下文上继续工作，而不会消耗新的请求次数，随着会话上下文拉长，Cursor 会变得很蠢，需要适时的关闭交互窗口结束对话。

### 小结

通过拦截 Cursor 工作结束信号，在结束时调用 `Interactive Feedback MCP` 服务，允许用户在 `Interactive Feedback` 的交互窗口进行追问。

使得追问和修改都在同一个请求会话中进行，达到减少请求 Cursor 次数的效果。

## 类似

### 10x-Tool-Calls

<https://github.com/perrypixel/10x-Tool-Calls>

## Ref

- <https://github.com/noopstudios/interactive-feedback-mcp>
- [Cursor 付费用户必看！这个神器让你的 500 次变 2500 次，月费瞬间回本 - AI全书](https://aibook.ren/archives/cursor-use-reduce-mcp-tools)
