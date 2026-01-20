---
banner:
date_created: Friday, December 5th 2025, 12:54:55 am
date_updated: Saturday, December 6th 2025, 8:40:23 am
title: Context Engineering
author: hacket
categories: 
category:
tags: []
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
aliases: [Context Engineering]
linter-yaml-title-alias: Context Engineering
---

# Context Engineering

## What is Context Engineering？

上下文工程是构建系统的艺术和科学，这些系统会填充大型语言模型（LLM）的 context window 以提升其性能。

与我们常与撰写更优质提示词联系在一起的提示词工程不同，上下文工程是一个更宽泛的术语，它包含许多甚至在提示词创建之前就已经开展的活动。

包括：

- 提供 `broader context`（例如，战略、领域、市场）以增强自主性。
- 检索和转换 `relevant knowledge`（例如，来自外部系统或其他智能体）。
- 管理 `memory`，以便智能体能够记住其先前的交互、收集经验、保存用户偏好并从错误中学习。
- 确保智能体拥有 `necessary tools` 并知道如何使用它们。

![](https://substackcdn.com/image/fetch/$s_!e7dH!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F450836ef-0655-47aa-9317-74ebbc50e72a_970x465.png)

Ref: [A Guide to Context Engineering for PMs](https://www.productcompass.pm/p/context-engineering)

## 6 Types of Context for AI Agents

![](https://pbs.twimg.com/media/GxA8tdpWEAAqOmM?format=jpg&name=medium)

### Instructions

Define:

→ Who: Encourage an LLM to act as a persona

→ Why is it important (motivation, larger goal, business value)

→ What are we trying to achieve (desired outcomes, deliverables, success criteria)

💡Providing strategic context beyond raw task specification improves AI autonomy arXiv:2401.04729

### Requirements (How)

Define:

→ Steps to take (reasoning, tasks, actions)

→ Conventions (style/tone, coding rules, system-design)

→ Constraints (performance, security, test coverage, regulatory)

→ Response format (JSON, XML, plain text)

→ Examples (positive/negative, responses/behaviors)

💡Negative examples might help you address issues identified during error analysis

### Knowledge

Define:

→ External Context:

- Domain (strategy, business model, market facts)
- System (overall goals, other agents/services)
→ Task Context:
- Workflow (process steps, process, hand‑offs)
- Documents (specs, procedures, tickets, logs)
- Structured Data (variables, tables, arrays, JSON/XML)

### Memory

An LLM can access:

→ Short-term memory

- Previous messages, chat history
- State (e.g., reasoning steps, progress)
→ Long-term memory
- Semantic (facts, preferences, user knowledge)
- Episodic (experiences, past interactions)
- Procedural (instructions from previous interactions)

💡Memory is not part of the prompt you can type. It can be automatically attached by the orchestration layer or accessed as a tool.

### Tools

Provide description, what it does, how to use it, return value, parameters.

💡It's special "functions" block in the LLM context window. It does consume your input tokens and affect the performance.

💡Treat tool descriptions as micro-prompts that guide agents' reasoning.

💡Descriptions provided by MCP servers are often insufficient and do not consider your specific domain context.

### Tool results

💡To call a function, an LLM uses a special format interpreted by the system. It's like saying, "Please call this tool with these parameters."

💡Next, an orchestration layer responds by attaching a special message to the messages list.

Ref: <https://x.com/PawelHuryn/status/1950126237562671313?t=Ot05u5YR7Pf7r0HBuGPOWA&s=09>

## 对于 context engineering 大佬的观点

- Context Engineering without standards and a feedback loop is like a smooch without a squeeze.
<https://x.com/AutomatedAgile/status/1950200120563106200?s=20>
