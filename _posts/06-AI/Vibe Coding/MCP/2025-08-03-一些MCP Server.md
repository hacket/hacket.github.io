---
banner: 
date_created: Sunday, August 3rd 2025, 1:07:12 am
date_updated: Thursday, August 7th 2025, 1:03:22 am
title: 一些MCP Server
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
aliases: [一些 MCP Server]
linter-yaml-title-alias: 一些 MCP Server
---

# 一些 MCP Server

## 操作系统

### Windows MCP

#### 安装

**Windows：**

```shell
git clone https://github.com/CursorTouch/Windows-MCP.git
cd Windows-MCP
```

**Gemini CLI:** 在 `settings.json` 配置：

```json
{
  "theme": "Default",
  …
//MCP Server Config
  "mcpServers": {
    "windows-mcp": {
      "command": "uv",
      "args": [
        "--directory",
        "<path to the windows-mcp directory>",
        "run",
        "main.py"
      ]
    }
  }
}
```

> 其中 `<path to the windows-mcp directory>` 替换为 clone 下来的目录

最终的配置：

```json
{
  "theme": "GitHub",
  "selectedAuthType": "oauth-personal",
  "mcpServers": {
    "windows-mcp": {
      "command": "uv",
      "args": [
        "--directory",
        "D:\\AI\\Windows-MCP",
        "run",
        "main.py"
      ]
    }
  }
}
```

### apple-mcp

<https://github.com/supermemoryai/apple-mcp>

## Zen MCP

Zen MCP 是一个基于 Model Context Protocol 的服务器，它为 Claude 提供了访问多个 AI 模型的能力，包括 Gemini 2.5 Pro、Gemini 2.0 Flash、OpenAI O3 等。简单来说，它就像是 "Claude Code for Claude Code"，让不同的 AI 模型能够在同一个对话线程中协作完成任务。

<https://github.com/BeehiveInnovations/zen-mcp-server>

## supabase-mcp 数据库

<https://github.com/supabase-community/supabase-mcp>

## deepwiki

让 AI 辅助理解项目

<https://docs.devin.ai/work-with-devin/deepwiki-mcp#for-claude-code%3A>
