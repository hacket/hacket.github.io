---
banner: 
date_created: Tuesday, June 17th 2025, 12:15:57 am
date_updated: Wednesday, October 1st 2025, 8:41:16 pm
title: MCP-exa-code
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
aliases: [exa-code]
linter-yaml-title-alias: exa-code
---

# exa-code

## exa-code 介绍

<https://github.com/exa-labs/exa-mcp-server>

引入 `exa-code`，这是消除 LLM 代码幻觉的一大步。索引了超过 10 亿个文档页面、Github 代码库、StackOverflow 帖子等。给定一个查询，exa-code 会对这些数据进行混合搜索，将其分块，然后返回一个连接起来的、高效标记的字符串。在我们的代码幻觉评估中，exa-code 的表现优于所有流行的网络搜索工具（包括 Exa！）。

幻觉率排行，值越低表示幻觉率越低：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidianExa%20Context.png)

## 安装

### Claude Code

- Local

```shell
# Mac
claude mcp add exa -e EXA_API_KEY=YOUR_API_KEY -- npx -y exa-mcp-server

# Windows

# 安装exa
npm install -g exa-mcp-server

# 添加MCP
claude mcp add exa "npx exa-mcp-server" -e EXA_API_KEY=d76cdd43-dc02-4804-8cba-ae85b77xxx
```

- 官方 (需要填写 API_KEY)

```shell
https://mcp.exa.ai/mcp?exaApiKey=YOUREXAKEY

claude mcp add --transport http exa "https://mcp.exa.ai/mcp?exaApiKey=8d52e07c-1ef3-4f7f-ab76-9e38b9218aa4"
```

> 获取 ApiKey: [Exa API Dashboard](https://dashboard.exa.ai/api-keys)

- Remote (smithery.ai)，不需要填写 API_KEY
<https://smithery.ai/server/exa?code=c417056e-ea72-44d7-8f6c-cb7ac5080031>

```shell
claude mcp add --transport http exa "https://server.smithery.ai/exa/mcp?api_key=fa231676-570f-429a-96f3-a2322e7db27b&profile=satisfactory-condor-MGWY80"
```

## Available Tools

| Tool                       | Description                                                                                                                                                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`get_code_context_exa`** | **NEW!** Search and get relevant code snippets, examples, and documentation from open source libraries, GitHub repositories, and programming frameworks. Perfect for finding up-to-date code documentation, implementation examples, API usage patterns, and best practices from real codebases |
| `web_search_exa`           | Performs real-time web searches with optimized results and content extraction                                                                                                                                                                                                                   |
| `deep_researcher_start`    | Start a smart AI researcher for complex questions. The AI will search the web, read many sources, and think deeply about your question to create a detailed research report                                                                                                                     |
| `deep_researcher_check`    | Check if your research is ready and get the results. Use this after starting a research task to see if it's done and get your comprehensive report                                                                                                                                              |
| `company_research`         | Comprehensive company research tool that crawls company websites to gather detailed information about businesses                                                                                                                                                                                |
| `crawling`                 | Extracts content from specific URLs, useful for reading articles, PDFs, or any web page when you have the exact URL                                                                                                                                                                             |
| `linkedin_search`          | Search LinkedIn for companies and people using Exa AI. Simply include company names, person names, or specific LinkedIn URLs in your query                                                                                                                                                      |

## 使用

在 prompt 后加上 `use exa` 即可；不加的话也可能能识别，但也有可能不识别，可能用 `context7`

## 示例

### Code Search Examples

```shell
Show me how to use React hooks with TypeScript use exa
```

- "Find examples of how to implement authentication with NextJS"
- "Get documentation and examples for the pandas library"

### Other Search Examples

- "Research the company exa.ai and find information about their pricing"
- "Start a deep research project on the impact of artificial intelligence on healthcare, then check when it's complete to get a comprehensive report"
