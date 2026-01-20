---
banner:
date_created: Wednesday, November 26th 2025, 8:11:34 am
date_updated: Thursday, December 25th 2025, 11:40:11 pm
title: NotebookLM入门
author: hacket
categories:
  - AI
category: NotebookLM
tags: [AI, Gemini, NotebookLM]
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
aliases: [NotebookLM 使用入门]
linter-yaml-title-alias: NotebookLM 使用入门
---

# NotebookLM 使用入门

## NotebookLM 入门

<https://notebooklm.google.com/> ，AI 研究工具与思考伙伴

### 什么是 NotebookLM？

NotebookLM 是谷歌开发的一款 AI 驱动的笔记和研究助手工具，它能根据用户上传的文档（如 PDF、Google 文档、网站、YouTube 视频等）来分析和整理信息。该工具内嵌了 Gemini 模型，可以自动生成摘要、提炼重点、回答问题，并支持将内容转换为语音摘要（类似于 Podcast）等形式，从而帮助用户更高效地学习、研究和创作。 

主要功能和特点

- **资料分析与整合**：上传各种格式的文件（PDF、Google 文档、YouTube 视频、音频、网站），NotebookLM 可以利用 AI 来分析和理解这些资料。
- **信息生成**：能够根据上传的资料，自动生成摘要、学习指南、常见问题解答等。
- **交互式问答**：用户可以直接向 NotebookLM 提问，它会根据你上传的资料提供有依据的答案。
- **内容形式转换**：可以将笔记内容转换成多种形式，例如可听的 Podcast 形式的语音摘要，方便用户在不同场景下学习。
- **提供引用来源**：回答问题时，NotebookLM 会提供清晰的 " 文内引用 "，确保信息来源的准确性和透明度。
- **多语言支持**：支持多种语言，包括中文的语音摘要。
- **跨平台可用**：除了桌面端，还推出了移动端应用程序，支持 iOS 和 Android 设备。

### NotebookLM 核心功能

![](https://cdn.gooo.ai/gen-images/25436506a00e25771658eb1596a475ce5440f6ed1bc1f53a0ae8046911c95b81.svg)

#### 主界面

- 最左侧是来源区域
- 中间是问答区域
- 最右侧的是工作区域

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/notebooklm_ui_20251127.png)

#### Audio Overview 播客（支持多语言）

将您上传的资源转换为生动的 AI 主播对话讨论。

> 音频摘要，生成比较耗时，仅次于视频时长，预计 10mins-15mins

**特点：**
- 两位 AI 主播进行自然对话
- 自动总结关键点
- 在主题间建立关联
- 可下载并离线收听
- 适合通勤、运动时学习

**4 种音频格式：**
1. **Podcast 对话** - 两位主播深度讨论（通常 8-15 分钟）
2. **Brief 简介** - 1-2 分钟概览
3. **Teacher 讲师** - 教育式讲解
4. **Friend 朋友** - 轻松聊天风格

**使用场景：**
- 长论文阅读后的快速复习
- 生成学习播客分享给同学
- 制作公司培训音频内容

#### Video Overview

将笔记转换为可视化视频展示

> 非常耗时预计要 10mins-20mins，时长 7-10 分钟左右；支持 80 种语言 (How to Monitor Reddit for Brand Mentions, Keywords, and …, Google NotebookLM | AI Research Tool & Thinking Partner)

**自定义选项：**
- **格式选择**：
	- Explainer（讲解型）- 详细展示
	- Brief（简短型）1-2 分钟快速总结
- **视觉风格**：
	- 经典（Classic）
	- 白板（Whiteboard）
	- 复古（Retro Print）
	- 动漫（Anime）
	- 其他主题
- **语言选择**：支持 80+ 种语言
- **自定义提示**：告诉 AI 应该强调什么内容

**使用场景：**
- 制作课程讲解视频
- 生成产品演示
- 创建知识普及内容

#### MindMap 思维导图

以交互式思维导图展示概念之间的关系。

**特点：**
- 自动识别主要话题
- 展示概念间的关联
- 可交互式探索
- 帮助理解复杂主题的结构

**最适合：**
- 梳理复杂学科知识体系
- 准备考试或研究项目
- 理清思路和逻辑关系

#### Reports

生成报告。

**预设类型：**
- Study Guide（学习指南）
- Briefing Document（简报文档）
- FAQ（常见问题）
- Table of Contents（目录）

**新增功能：** 完全自定义报告
- 在生成前指定内容要点
- 自定义报告结构
- 选择响应长度（简洁/标准/详细）
- 调整语气（正式/非正式/技术性）

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/notebooklm_reports_20251127.png)

#### Flashcards 和 Quiz

学完了知识一定要进行测验，不然很快就会忘记，这时候我们点击 `Flashcar` 和 `Quiz`。

##### Flashcards

自动从资源生成学习闪卡。

**特点：**
- 自动提取关键知识点
- 无需手工制作
- 支持批量生成
- 可自定义编辑

**使用场景：**
- 语言学习（词汇记忆）
- 概念理解
- 准备考试
- 技能培训

##### Quiz（测验）

自动生成基于资源的测验题目。

**特点：**
- 多种题型支持
- 即时反馈
- 帮助检验学习成效
- 识别薄弱区域

**学习流程建议：**
闪卡学习 → 理解消化 → Quiz 测验 → 弱点回顾

#### Deep Dive Conversation（深度对话）

与 AI 进行关于资源内容的对话式讨论。目前可以写 10000 字符提示词

**特点：**

- 所有回答都基于您的资源
- 带有引用和出处
- 可进行多轮深入讨论
- 支持自定义对话风格

**使用方式：**
- 聊天框输入问题
- AI 会基于您上传的资源回答
- 可要求更深入的分析

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/notebooklm_deep_dive_conversation_20251127.png)

#### Discover Sources（文档发现）

基于您的笔记，AI 推荐相关的补充资源。

**特点：**
- 自动识别您正在研究的主题
- 推荐相关来源
- Plus 版本功能

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/notebooklm_discover_source_20251127.png)

#### infographic 图表 (需要 Pro)

### Deep Research 深度研究功能 (2025.11 推出)

#### 什么是 Deep Research？

NotebookLM 最新推出的功能（2025 年 11 月），能自动搜索数百个网站并生成源文献支撑的研究报告。

#### Deep Research 的优势

✅ 自动创建研究计划

✅ 扫描数百个网站

✅ 优先选择可信来源

✅ 自动进行搜索优化

✅ 生成带源引用的报告

✅ 在后台运行，不中断您的工作

✅ 通常在数分钟内完成

![](https://cdn.gooo.ai/gen-images/956a58be8af7f9e07fc8f1934c2ce768e771cf29101741e324be9eff9bf15b33.svg)

#### 如何使用 Deep Research？

##### 第一步：开启 Deep Research

演示示例视频：[https://x.com/berryxia_ai/status/1989140910412890523?s=20](https://x.com/berryxia_ai/status/1989140910412890523?s=20)

1. 打开一个 Notebook
2. 在左侧 "**添加来源**" 面板中
3. 从下拉菜单选择 "**Web**"

##### 第二步：选择研究类型

- 选择 "**Fast Research**"（快速）或 "**Deep Research**"（深度）

#### 第三步：输入研究查询

- 输入详细的研究问题或主题
- 可以指定搜索的特定领域或来源

##### 第四步：系统自动执行

- AI 创建研究计划
- 浏览网站进行信息收集
- 不断优化搜索策略
- 生成组织化的报告

##### 第五步：导入结果

- 报告和来源直接导入您的 Notebook
- 可继续添加其他资源
- 利用其他 NotebookLM 功能（音频、视频等）进一步分析

#### 撰写有效的 Deep Research 查询

```shell
Deep Research查询：寻找关于远程工作对员工心理健康
影响的最新科学研究，包括积极和消极两方面。
```

**避免：**
- 过于宽泛的主题（如 "AI"）
- 不清楚的表述
- 混杂多个不相关的话题

### NotebookLM 的优缺点

#### 优点

- NotebookLM 最佳学习工具
- NotebookLM 的特点是长文本，幻觉低
- NotebookLM 确实让学习变得高效又有趣

#### 不足

- 对中文支持不是很好？

## NotebookLM 工作流程建议

```shell
新建Notebook
    ↓
上传核心资源（PDF、视频、网页等）
    ↓
使用Deep Research找补充资源
    ↓
通过Deep Dive Chat深入理解
    ↓
生成Audio Overview了解全景
    ↓
创建Mind Map梳理体系
    ↓
生成Flashcards进行复习
    ↓
参加Quiz自我评估
    ↓
生成Study Guide或Report总结
    ↓
分享Video Overview给他人
```

## 按学习阶段选择工具

**初始学习阶段**
- Audio Overview（快速概览）
- Mind Map（理解结构）
- Study Guide（系统总结）

**深化理解阶段**
- Deep Dive Chat（回答具体问题）
- Flashcards（强化记忆）
- Reports（详细分析）

**检验阶段**
- Quiz（自我测试）
- Video Overview（教给他人）

**高级应用阶段**
- Deep Research（扩展知识）
- Custom Instructions（专业应用）
- 导出内容（创建自己的内容）

## 自定义提示词模板库

见：[[NotebookLM自定义提示词]]

## NotebookLM 更新

### NotebookLM 手机客户端迎来 3 大重要更新

**1、手机端现在支持直接上传或拍照当作资料**
拍白板、讲义、书页都能让模型立即识别并回答。

**2、手机 APP 也能生成信息图和 PPT 幻灯片了**
Nano Banana Pro 的视觉能力下放到手机端，随时做海报/PPT。

**3、音频讲解支持自动保存进度**
听到哪儿都记得住，关掉再开、网页和手机同步进度，换手机都能继续。

Ref: [NotebookLM 手机客户端迎来3大重要更新](https://x.com/i/status/1997116251425124474)

### 手机端功能单独用很强，但组合起来更强

你可以对手机说出想法、灵感、乱七八糟的脑洞笔记。

把这个语音文件 上传到 NotebookLM 当作来源。

NotebookLM 会帮你把这些口述内容 " 加工成型 "：

比如整理、总结、变成文章、做成结构化内容等。

一句话： 把语音记录 + NotebookLM 结合起来，你的碎片想法就能自动变成清晰的内容。

![G7cufmiaUAAF9kk](https://pbs.twimg.com/media/G7cufmiaUAAF9kk?format=jpg&name=900x900)

## Ref

- [《NotebookLM 学习手册（完整版）》](https://youmind.site/VZhAMc6O3idy6M)
