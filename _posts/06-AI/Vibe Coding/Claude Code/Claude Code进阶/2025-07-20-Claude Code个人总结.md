---
banner: 
date_created: Sunday, July 20th 2025, 1:10:05 am
date_updated: Tuesday, August 12th 2025, 11:12:26 pm
title: Claude Code个人总结
author: hacket
categories:
  - AI
category: ClaudeCode
tags: [AI, ClaudeCode, VibeCoding]
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
aliases: [Claude Code 个人总结]
linter-yaml-title-alias: Claude Code 个人总结
---

# Claude Code 个人总结

## 个人总结

### 实现 UI

#### 实现 UI 效果

**方法 1：**
如果你有一张效果图，但是你不知道怎么描述，prompt 怎么写？你可以这样做：
- 将图片复制到 Claude Code (或其他支持读取图片的 LLM 模型中)，让大模型分析图片的内容，然后给出精确的 prompt，可以保存到 md 文件中去
- 将这个 md 和图片丢给 Claude Code 进行 Coding 了

**方法 2：**
- 如果是是 Figma UI 图，可以先安装 Figma MCP
- 先切换到 Plan Mode，用 kiro spec 工作流，将要实现的 Figma 区域选中，复制链接，丢给 Claude Code，写好要的实现功能及要求，等 Claude Code 生成好的需求文档 requirements.md 后，继续补充直到达到你的要求
- 然后生成 design.md，代码架构设计
- 接着生成 task.md，最终的任务列表
- 然后让 Claude Code 一项项任务执行

#### 如何让 AI 写出的 UI 带点儿审美？

1、找到你认为 UI 牛逼的任何网页。使用 figma html to design 插件，生成 figma 设计稿（如遇网页需要登录态才能看到满意的 UI 界面，可以使用 html to design 的浏览器插件）。

2、用 Figma Bridge MCP，让 AI 通读设计文件（粘贴 URL 给 AI 即可）。之后，要求 AI 按照 XXDesign 文件夹，colors、typography、tokens、components、utils 子文件夹的结构，生成设计系统 Design System。

3、得到设计系统文件后，依据它，先生成设计系统演示板文件，微调之，辱骂 AI，让它不要看起来像是完全照抄了最初的网页。之后，生成 CLAUDE MD 文件或 Cursor Rule 文件。

4、让 AI 根据设计系统来设计你的 UI 界面。

### 生成模板代码命令

#### cart abt

```shell
# 使用
/project:/cart_abt


```

配合浏览网页的 mcp，给一个 poskey 的关键字，自动从网页爬取相应的字段填到

#### bean 生成

- 自定义一个 slash-command 命令
- 配合 `mcp-chrome` 自动生成

### 基于网页 PRD 完成需求

1. 先用 `mcp-chrome` 和 `plan mode` 生成 md 需求单（如果需求文档的平台支持 MCP 更好）
2. 在 plan mode 下再次对齐校验需求单
3. 对齐好需求单后，再用 `auto-accept edits` 模型下编码
4. 再喂给 CC 实现需求
5. 收尾的，安全，代码指令的 review，规范是否符合等

### subagents

工作中的一些常用的工作都可以写成 slash commands，但我更建议写成 subagents，比如：

- 根据 Figma 链接，实现 UI 效果
