---
banner:
date_created: Wednesday, October 8th 2025, 5:07:01 pm
date_updated: Friday, October 17th 2025, 11:35:41 pm
title: Github Spec Kit
author: hacket
categories:
  - AI
category: AI工作流
tags: [AI, AI工作流, spec-kit]
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
aliases: [Github Spec Kit]
linter-yaml-title-alias: Github Spec Kit
---

# Github Spec Kit

<https://github.com/github/spec-kit>

## Spec-Driven Development 是什么？

### SDD 介绍

规范驱动开发（Spec-Driven Development）颠覆了传统的软件开发模式。几十年来，code 一直是核心 —— 而 specifications 只是我们搭建的脚手架，一旦 " 真正的 " 编码工作开始，它们就会被丢弃。规范驱动开发改变了这一点：规范变得可执行，直接生成可运行的实现，而不仅仅是作为指导。

它与 AI 编码工具（如 GitHub Copilot、Claude Code、Gemini CLI）集成，帮助开发者构建更高质量的软件。

SSD 将开发过程组织成一系列清晰的、人与 AI 强协同的阶段，例如规范、规划、任务、实现，其中一条至关重要的规则是：在当前阶段未被完全验证之前，绝不进入下一阶段。这种机制强制引入了纪律性，确保了每个步骤的质量。

**从大的层次划分，Spec Coding 主要分成三个阶段**。

#### 阶段 1：需求文档的规范化

> 在一家公司的工业级项目中，需求文档一般由产品同学编写，而需求质量又直接决定了最终产出的质量，是整个流程中价值最高的部分。大家应该也遇到过一句话需求的问题。

一种方式是定义一套标准的 PRD 规范，强制要求产品同学遵循。但在实践中，这类硬性约束往往难以长期维持，容易流于形式。

**一种更好的解法是：AI 辅助澄清与结构化。**

我们可以让 AI 扮演一个经验丰富的产品专家角色。产品同学可以先按照原有的工作方式完成第一版需求文档，然后 AI 会基于预设的**需求背景知识**进行追问和引导，通过交互式的方式辅助产品同学逐步澄清、细化需求，并最终自动生成一份结构清晰、要素完整的需求文档。

#### 阶段二：技术方案的规范化

有了上一步输出的高质量需求文档后，就进入了技术实现阶段。直接把整份文档丢给 AI 说 " 帮我实现它 "，这还是 Vibe Coding 的思路，结果必然不可控。

在 Spec Coding 中，第二阶段的核心是**技术规划**。

我们可以将第一阶段产出的需求给到 AI，让其结合我们的代码库（`比如在Cursor中或者Claude Code中，尽量选择更好的模型`）生成一份技术实现方案，这份方案并非代码，而是一份高层次的蓝图，可能包含：

- **架构影响分析**：需要新增、修改、抽象哪些模块？
- **核心组件设计**：关键的类、函数、或模块的的职责定义。
- **数据模型变更**：涉及的数据库表结构设计或修改。
- **协议设计：** 需要设计的通信协议细节（`注：如果已经有通信协议了，那么可以设计业务层的实体对象`）。
- **依赖与风险**：指出潜在的技术难点、外部依赖或风险。

有了设计的技术方案后，我们要做的就是认真审查、修订并最终确认这份由 AI 生成的规划。在这个过程中，可以和 AI 一起迭代优化、直至方案收敛到一个理想状态。

这个阶段需要确保的是在正确的方向上做事，避免在错误的技术路线上执行接下来的工作。

#### 阶段三：分解并执行任务

当技术方案确认后，我们就拥有了一份清晰的 " 施工图 "。这一阶段的核心任务，便是将这份 " 施工图 " 拆解成一系列可以独立执行的原子任务。这与敏捷开发原则相契合，可以尽量保障由 AI 完成的每一步编码工作更容易被调试和确认。

传统开发中，这一步依赖于负责的开发同学手动拆分，而在 Spec Coding 流程中，我们可以让 AI 根据第二阶段的规划，自动生成一份详细的有明确前后依赖关系的任务清单（`相当于在实际开发时，先做A、再做B`）。

由于每个任务足够简单且已被前面的阶段充分定义，AI 生成代码的准确性会指数级提升（`要用较好的模型`）。开发同学只需进行少量审查和微调，就可以快速完成功能。这个过程将复杂的系统开发，降维成了一系列 " 连连看 " 式的操作，有效提升了编码效率和代码质量的稳定性。

**还有一个细节点**，Spec Coding 非常适合测试驱动开发的工作模式（TDD），在拆解开发任务的过程中，我们可以要求 AI 为每个任务生成一个测试用例（`纯逻辑场景`）。AI 的核心工作就是编写代码，使得这个预先定义的测试能够通过。

### 解决的核心痛点

- **" 氛围编码 " 问题**：传统 AI 编码中，你描述目标，得到代码块，但往往 " 看起来对，但实际不工作 "
- **缺乏结构化流程**：从想法到实现缺乏清晰的步骤和检查点
- **质量不一致**：生成的代码缺乏统一的质量标准和测试覆盖

### 主要功能

- **规格优先开发**：先写规格说明，再生成代码
- **四阶段工作流**：Specify（规格化） → Plan（规划） → Tasks（任务分解） → Implement（实现）
- **强制测试驱动开发（TDD）**：必须先生成测试，再生成实现代码
- **与 AI 工具无缝集成**：支持 Claude Code、GitHub Copilot 等

## 安装

```shell
# 安装uv
brew install uv

# 安装spec-kit
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
## 初始化
specify init <PROJECT_NAME>  # 用.表示当前路径的项目
## 校验specify cli是否能用
specify check
## 或者：在Claude Code中检查是否有/specify命令可用
```

## 使用

详细步骤：[spec-kit/spec-driven.md at main · github/spec-kit · GitHub](https://github.com/github/spec-kit/blob/main/spec-driven.md)

### 开始：Establish project principles

用 `/speckit.constitution` 命令来创建项目的管理原则和开发指南，以指导所有后续开发。

```shell
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

### 阶段 1：Specify（规格化）

**目标**：明确项目需求和规格

**执行命令：**
使用 `/speckit.specify` 命令描述你要构建的内容：
- 专注于**什么**和**为什么**，而不是技术栈
- 描述用户旅程和体验
- 定义成功标准

```shell
/speckit.specify 我需要构建一个用户注册系统，允许用户通过邮箱注册账号，验证邮箱地址，并在注册成功后自动登录
```

**审查和修改：**
执行 `/speckit.specify` 命令后，Claude Code 会生成详细的规格文档（`spec.md`）。你需要审查并修改：
- **业务逻辑准确性**：是否符合你的业务需求
- **功能完整性**：是否遗漏重要功能
- **边界条件**：错误处理、异常情况
- **性能要求**：响应时间、并发用户数等
- **安全要求**：认证、授权、数据保护

### 阶段 2：Plan（规划）

**目标**：制定技术实现计划

**执行命令：**
使用 `/speckit.plan` 命令提供技术实现规划：

```shell
/speckit.plan 使用Node.js + Express.js后端，MongoDB数据库，JWT认证，nodemailer发送验证邮件
```

**审查技术计划：**
Claude Code 会生成详细的技术计划，包括：
- **架构设计**：系统整体架构
- **技术栈选择**：前后端技术栈
- **数据库设计**：数据模型和关系
- **API 端点规划**：RESTful API 设计
- **部署策略**：部署和运维方案

### 阶段 3：Tasks（任务分解）

**目标**：将规格和计划分解为可执行任务

**执行命令：**

```shell
/speckit.tasks 将上述规格和计划分解为可执行的开发任务
```

**任务列表管理：**
生成的任务列表需要你：
- **优先级排序**：调整任务执行顺序
- **任务细化**：对复杂任务进一步分解
- **依赖关系**：确认任务间的依赖关系

### 阶段 4：Implement（实现）

**目标**：基于 TDD 原则实现代码

**代码生成原则：**
让 Claude 生成代码时遵循：
- **必须先写测试**（TDD 原则）
- 获得测试批准后再生成实现代码
- 通过迭代测试和审查完善代码

```shell
/speckit.implement
```
