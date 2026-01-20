---
banner:
date_created: Friday, November 28th 2025, 8:17:32 am
date_updated: Sunday, December 7th 2025, 9:13:59 am
title: NotebookLM最佳实践与高级技巧
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
aliases: [NotebookLM 最佳实践与高级技巧]
linter-yaml-title-alias: NotebookLM 最佳实践与高级技巧
---

# NotebookLM 最佳实践与高级技巧

## 最佳实践清单

### 资源选择最佳实践

- 优先使用原始文献和官方文档
- 避免混杂多个主题的资源
- 保持资源的时效性（特别是技术、新闻类）
- 对于学术研究，选择同行评审的论文

### 提示词设计最佳实践

- **明确指定角色/人设**：例如 " 作为一位数据科学家…"
- **清晰定义输出格式**：指定使用表格、列表或段落
- **设置限制**：指定字数、要点数量等
- **举例说明**：给出期望输出的示例
- **避免歧义**：使用具体词汇而非模糊描述

### 工作流程最佳实践

- 先用 Mind Map 理解全局，再深入细节
- Audio Overview 用于快速复习，Deep Dive Chat 用于精细理解
- 在创建 Quiz 之前先完成 Flashcards 学习
- 定期导出重要的笔记和报告作为备份

### 协作最佳实践

- 为共享 Notebook 添加清晰的描述
- 使用标准化命名规范：`[项目名]-[主题]-[版本号]`
- 为他人创建 "`Public Notebook`" 时，选择 "`Chat only`" 共享模式
- 定期更新资源，保持信息最新

## 高级技巧

### 技巧 1：链式提示法（Prompt Chaining）

不依赖一个复杂提示，而是进行多个对话：

```shell
第一条：请分析这个资源中的三个关键观点。
[获取回复]
第二条：对于观点1，批判性评价其说服力。
[获取回复]
第三条：这三个观点中是否存在矛盾？如何调和？
```

### 技巧 2：迭代优化

- 第一次查询获取初始回复
- 基于反馈调整提示词
- 逐步完善，直到满足需求

### 技巧 3：多角度分析

```shell
使用自定义Instructions轮流切换视角：
- 批评者的角度
- 支持者的角度
- 实践者的角度
- 理论家的角度
对同一话题进行多轮分析
```

### 技巧 4：内容复用

- 用一份资源生成多种格式（音频 + 视频 + 文本）
- 将生成的闪卡导出创建自己的学习平台
- 将报告转化为博客文章、演讲稿等

### 技巧 5：质量控制

- 生成后一定要校对，特别是引用
- 使用 `Deep Dive Chat` 验证 facts
- 对于重要的学术工作，交叉验证信息来源

### 让 Prompt 更有效的 5 个技巧

1. **角色定义** - " 作为一位 `[角色]`" 开头能显著提高质量
2. **格式指定** - 明确要求输出格式（表格/列表/段落）
3. **长度限制** - 指定字数让 AI 更精准
4. **具体例子** - 给出期望输出的样本
5. **输出验证** - 最后加 " 验证内容的准确性 "

## 学科特定的使用指南

### 文学与人文学科

- 上传原始文本、评论著作和研究论文
- 使用 Deep Dive Chat 进行文本分析和比较
- 生成 mind map 梳理文学主题和人物关系
- 创建闪卡记忆关键文献和时间线

### STEM 学科

- 上传教科书、研究论文、实验数据
- 使用 Audio Overview 理解复杂理论
- 生成 Quiz 测试公式和概念理解
- 创建 Video Overview 讲解步骤

### 商业与管理

- 上传案例研究、行业报告、竞争分析
- 使用 Deep Research 研究市场趋势
- 生成 Briefing Documents 用于演讲
- 创建 SWOT 分析模板

### 语言学习

- 上传教科书、原文文本、对话记录
- 使用 Flashcards 记忆词汇和短语
- 生成 Audio Overview 进行发音练习
- 创建 Quiz 测试语法理解

## 使用场景

### 生成博客（可学习的多语言播客）

- 将书丢进去，然后用里面的播客生成功能，为我生成了一段 30 分钟不到的播客
- 将笔记，知识库问答，然后可以把知识转成播客
- 公众号文章或者自己的推文变成播客，放到 `小宇宙` 上
- 懒人福音，5 分钟看完一本书语音版
- 内容创作者的利器：将文章或视频一键转换成播客，扩大内容覆盖范围，甚至实现多语种发布。

### 学习 Youtube 视频

- 可以直接添加 YouTube 视频
- 去提炼 YouTube Poadcast
- 用来看 YouTube 长视频，节省了很多时间
- 主要用于学习，还可以构建私有知识库，我的做法是把想读的书，丢进去，然后转成播客进行学习，会比自己啃舒服很多
- 很多功能 `Youmind` 也支持，对于上述的播客生成，`lsitenhub` 更加专业

**示例：** 最近在了解如何提升人体的核心力量，把 YouTube 上几个比较专业的视频导入到 NotebookLM，就可以生成一个很好的播客简明扼要的介绍这几个 YouTube 内容

### 英语学习工具

将自己的中文内容（如播客文稿、视频脚本）转换成英文播客，通过听自己熟悉的内容来提高英语表达能力。

### 构建个人知识库

- 上传与特定主题相关的所有内容（视频、应用案例等）
- 保存有价值的对话内容
- 灵活选择背景信息，避免无用上下文干扰

NotebookLM 支持上传 50 个来源，足以满足大多数主题学习和研究需求。

### NotebookAPI

有 API，但是我看只有创建，检索，查找，删除和分享笔记本，还有创建播客

[创建和管理笔记本 (API)   Google Cloud](https://cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks?hl=zh-CN)

### 应用

#### 读透一本书

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/notebooklm_how_to_read_book.png)

#### 实际案例

- **用 Reddit 做品牌舆情自动化监控:** <https://x.com/yanhua1010/status/1982646275565928546>
