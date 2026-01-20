---
banner: 
date_created: Tuesday, June 17th 2025, 12:15:57 am
date_updated: Monday, June 23rd 2025, 12:17:20 am
title: MCP-context7
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
aliases: [MCP Context 7]
linter-yaml-title-alias: MCP Context 7
---

# MCP Context 7

**精准锚定最新文档，对抗代码幻觉（Hallucination）**

## Context7 介绍

### Context7 背景

在使用 AI 编程助手（如 Cursor、Claude、Windsurf 等）时，是否曾遇到生成的代码引用了过时的 API 或虚构的函数？这类 "`代码幻觉(Hallucination)`" 问题常常源于模型训练数据的滞后。为了解决这一问题，Upstash 团队推出了 Context7 —— 一个基于 MCP（Model Context Protocol）协议的开源工具，旨在为大型语言模型（LLMs）提供最新、版本特定的官方文档和代码示例。

为了解决上面的痛点，Context 7 直接从源头提取最新版本的具体文档和代码示例，并将其直接放入 AI 编程工具的提示上下文中。这样我们能确保 Cursor 使用最新最准确的版本库的最佳实践，依赖于确定存在的接口或者函数，降低代码幻觉。

### 什么是 Context7？

Context7 是一个开源平台，能够从官方源（如文档站点、GitHub 仓库）实时提取最新的、特定版本的文档和代码示例，并通过 MCP 协议将其注入到 AI 模型的上下文中。这使得 AI 编程助手能够生成更准确、实用的代码，显著减少 " 幻觉 " 现象。

### Context7 的核心功能

- **实时文档检索**：通过 MCP 协议，Context7 能够实时从官方源获取最新的文档和代码示例。
- **版本精确匹配**：支持按库的具体版本过滤文档，确保提供的信息与当前使用的技术栈完全一致。
- **AI 友好格式**：生成专为 LLM 设计的文档格式，便于模型理解和使用。
- **广泛的库支持**：目前已支持超过 3000 个主流库，包括 Next.js、React、Tailwind、Upstash Redis、FastAPI 等。
- **免费使用**：Context7 对个人用户免费开放，适用于各种 AI 编程场景。

## 安装 Context7

Context7 提供了多种集成方式，适用于不同的开发环境：

<https://github.com/upstash/context7?tab=readme-ov-file#%EF%B8%8F-installation>

### 命令行安装

```shell
npx -y @upstash/context7-mcp@latest
```

### 集成到开发工具

#### Cursor

在设置中添加 MCP Server，或在项目文件夹中创建 `.cursor/mcp.json` 文件，配置如下：

- Context 7 官方提供了远程服务器连接：

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

- 也可以下载代码本地安装：

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

测试本地安装是否成功，本地执行命令，不报错就安装成功了：

```shell
 npx -y @upstash/context7-mcp
```

**使用：**
在每次让 Cursor 生成或者修改代码时，指定其使用 context 7: `use context7`。比如我希望 Cursor 帮我使用 ` @antv/x6 ` 画一个关系图：

```shell
根据后端返回的响应报文结构，zen画出各个节点的关系图。use context7.

响应报文结构描述：
...
...
```

可以看到 Cursor 先从 context 7 MCP 获取对于库的文档和代码示例，再进行代码生成：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250620002244953.png)

context 7 官方列出来他们索引的所有代码库。地址：<https://context7.com/>

#### VSCode

```json
{
	"servers": {
	  "Context7": {
		"type": "stdio",
		"command": "npx",
		"args": ["-y", "@upstash/context7-mcp@latest"]
	  }
	}
}
```

#### Windsurf、Zed、Claude Desktop、BoltAI 等

按照相应的 MCP 配置方式添加 Context7，具体配置可参考官方文档。

### Docker

<https://glama.ai/mcp/servers/%40upstash/context7-mcp?locale=zh-CN&utm_source=chatgpt.com>

- 创建 Dockerfile：

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @upstash/context7-mcp@latest
CMD ["context7-mcp"]
```

- 构建 Docker 镜像：

```shell
docker build -t context7-mcp .
```

- 配置 MCP 客户端以使用 Docker 命令。

## 使用

### 视频

- [解决 AI 代码幻觉！用 Context7 获取最新文档，支持 MCP 调用 - YouTube](https://www.youtube.com/watch?v=lhqhrBzmv7o)
- [解决 AI 代码幻觉！用 Context7 获取最新文档，支持 MCP 调用 - YouTube](https://www.youtube.com/watch?v=lhqhrBzmv7o)

## Ref

- [这三个 MCP 组合，让 Cursor 指哪打哪](https://mp.weixin.qq.com/s/Nx4qapsaBV7dhneYh29l-g?mpshare=1&scene=1&srcid=0616UorQObLgfDP9UlabELe6&sharer_shareinfo=896773c0db4d02399fcb3952bab89745&sharer_shareinfo_first=28b799ddc86de3cb4be1bc3ffcb3aecc&version=4.1.36.99603&platform=mac#rd)
