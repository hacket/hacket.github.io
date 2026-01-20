---
banner:
date_created: Wednesday, September 17th 2025, 8:33:07 am
date_updated: Friday, October 17th 2025, 11:35:34 pm
title: BMAD Method
author: hacket
categories:
  - AI
category: AI工作流
tags: [AI, AI工作流]
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
aliases: [BMAD-METHOD]
linter-yaml-title-alias: BMAD-METHOD
---

# BMAD-METHOD

<https://github.com/bmad-code-org/BMAD-METHOD>

## 什么是 BMAD-METHOD?

**BMAD-METHOD**（Breakthrough Method of Agile AI-Driven Development）是一个突破性的 AI 代理编排框架，它的核心理念是通过专门的 AI 代理来模拟完整的敏捷开发团队，让一个人就能拥有整个团队的力量。基础；不仅是一个开发框架，更是一个将人类专业知识转化为 AI 可访问格式的平台。每个扩展包都让专业知识更容易获得，每个新代理都扩展了 AI 协助的边界。

一人 Scrum 团队的核心优势

**专业角色完整覆盖**

- **业务分析师（Analyst）**：市场调研、需求收集
- **产品经理（PM）**：PRD 创建、功能优先级排序
- **架构师（Architect）**：系统设计、技术架构
- **开发人员（Developer）**：顺序任务执行、测试
- **QA 专家（QA）**：代码审查、重构
- **UX 专家（UX）**：UI/UX 设计
- **产品负责人（PO）**：需求管理
- **Scrum Master（SM）**：冲刺规划、故事创建

**真正的敏捷工作流**
不是简单的 AI 助手，而是严格遵循敏捷方法论的完整流程，每个 AI 代理都有明确的职责和交付物。

## 安装 BMAD-METHOD

```shell
# 一键安装
npx bmad-method install
## 这个命令会在你的项目中安装 BMAD-METHOD 框架，自动配置所有必要的 AI 代理和模板文件。安装完成后，你就可以开始使用各种角色命令了。

# 或者如果已经安装过
git pull
npm run install:bmad
```

**注意：** 安装过程会让选择安装位置（安装位置要选项目根目录），要安装的组件等

## BMAD-METHOD 介绍

### BMAD 2 个创新

BMAD-METHOD 有 2 个创新：

**1. Agentic Planning:** Dedicated agents (`Analyst`, `PM`, `Architect` agent) 与您合作创建详细的，一致的 PRDs 和 Architecture 文档。通过先进的 prompt engineering 和 human-in-the-loop 的改进，这些 planning agents 产生了全面的规范，远远超出了通用的人工智能任务生成。

**2. Context-Engineered Development:** `Scrum Master agent`（敏捷教练）将这些详细的 plans 转化为包含开发人员所需的一切的超详细开发 stories——full context, implementation details, and architectural guidance embedded directly in story files.。

这种两阶段的方法消除了**planning inconsistency** and **context loss**，这是人工智能辅助开发中最大的问题。您的 `Dev agent` 打开故事文件时，会完全理解要构建什么、如何构建以及为什么构建。

### Greenfield 与 Brownfield 对比表

| 对比项            | Greenfield Planning（绿地规划）                       | Brownfield（棕地项目）                                        |
| -------------- | ----------------------------------------------- | ------------------------------------------------------- |
| **字面含义**       | 绿地：一片全新的土地，没有开发痕迹或历史设施                          | 棕地：已有建筑、设施或污染的土地，需要处理遗留问题                               |
| **项目起点**       | 从零开始，无历史包袱                                      | 基于现有系统或环境，必须考虑现有资产与限制                                   |
| **常见场景（IT 领域）** | 新创公司开发第一款产品；从零设计全新网站；构建新系统架构                    | 升级老旧 ERP/CRM 系统；将新功能集成进已有电商平台；老代码重构                       |
| **技术自由度**      | 高，自由选择最新技术栈、架构和工具                               | 受限，需要兼容旧平台、旧语言、旧数据库                                     |
| **风险类型**       | 功能与需求未知，全部要新设计；研发过程试错成本高                        | 兼容性问题、历史技术债、文档缺失、老功能影响新功能                               |
| **优点**         | - 完全自由的设计空间<br>- 可一次性应用最佳实践<br>- 没有遗留的技术债务      | - 可以利用现有的系统和资源<br>- 与既有业务高度适配<br>- 开发周期可能短于从零开发（取决于复杂度） |
| **缺点**         | - 所有系统和组件要从零开始搭建<br>- 需要更多的架构设计与验证<br>- 项目周期可能长 | - 历史包袱大<br>- 改动受现有架构限制<br>- 测试和回归工作量大                   |
| **开发者要求**      | 创新和架构设计能力                                       | 熟悉旧系统、善于兼容和迁移、处理技术债能力                                   |
| **项目管理方式差异**   | 需求可以灵活调整，适合敏捷开发、迭代试错                            | 需要更多沟通与测试，敏捷需结合较大的回归测试，变更要谨慎                            |
| **比喻**         | 在空地上造一栋楼，随便怎么设计                                 | 在老房子基础上翻修，需要保留部分结构和管道                                   |

## BMAD Plan and Execute Workflow

### 自定义 Gemini Gen

![PixPin_2025-10-03_21-10-45.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202510032110562.png)

## BMAD-METHOD 使用

### 使用流程

#### 第一步：需求分析与头脑风暴（业务分析师 Business Analyst, BA）

先别急著一开始就请 AI 写程序，使用 GPT-4 或 Claude 的深度思考模式，从与 AI 对话中厘清脑中的想法，让想做的事更具体、深挖重要各项细节。之后每一步骤要建立专案资料夹存成 Markdown 格式让 AI 彼此沟通协作。

**任务：** 使用 AI 的「深度思考模式」，透过与用户来回对话，引导出所有专案细节。

**成果：** 一个经过良好提炼、准备交付给专案经理的详细构想。

---

**使用 `/BMad:agents:analyst` 命令启动分析师角色**

- 分析师会与你进行深入的头脑风暴对话
- 探讨项目背景、目标用户、核心需求
- 根据内置模板自动生成一份完整的**项目简报**
- 为后续的产品设计奠定基础

#### 第二步：产品规划与需求文档 (Project Manager, PM)

将 BA 处理好的资料给，PM 角色的 AI 去研究市场上类似的竞争产品、搜寻一些设计参考、找出最佳实践方案，规划 MVP (最小可行产品)，将上述撰写成一份完整的产品需求文件 (PRD)。

- **任务：** 使用 AI 的「深度研究模式」（如 OpenAI 或 Gemini 的深度研究）进行广泛研究。这包括分析您的想法、搜寻网路、寻找类似应用程式、风格和技术。
- **成果：** 一份产品需求文件 (PRD)，详细说明了要建立的应用程式以及 MVP (最小可行产品) 的目标。这确保了从一开始就拥有清晰的产品路线图，能够增量式地开发，避免大规模变更。

---

**使用 `/BMad:agents:pm` 命令呼唤产品经理角色**
- 产品经理基于项目简报进行深入分析
- 自动生成详细的 **PRD（产品需求文档）**
- 创建项目的 **Epic（史诗故事）**
- 确定功能优先级和产品路线图

#### 第三步：系统架构设计 (System Architect, SA)

架构师根据上述步骤的文件，来规划架构文件。选用什么程式语言和框架来开发、理清会需要哪些函式库、资料库设计、资料模型。并基于安全性考量，规划基础设施和部署的策略。

- **任务：** 结合 BA 和 PM 的输出，设计详细的技术架构文件。该文件会明确指出技术选择（语言、函式库）、应用程式页面、转换逻辑、安全性、基础设施、部署、资料库架构和资料模型等所有代理所需的细节。
- **成果：** 一份详细的技术路线图，为整个专案的开发提供明确指引。

---

**使用 `/BMad:agents:architect` 命令呼唤架构师角色**
- 架构师基于 PRD 和 Epic 进行技术分析
- 设计完整的**系统架构文档**
- 确定技术栈、数据库设计、API 结构
- 为开发团队提供技术实施指导

#### 可选：产品负责人 (Product Owner, PO)

把架构师的技术规划，转换成可执行的任务清单。将大功能拆解成一个各的小任务，并依照逻辑顺序排列任务，确保每个任务都具体与详细。让任务难度即便是初级开发人员也能逐步执行。

- **任务：** 根据架构师和专案经理的输出，利用「高级思考模式」制定一份细粒度且按逻辑顺序排列的任务清单。这些任务必须足够清晰，即使是初级开发人员也能逐一实施，从头到尾建立起应用程式功能，不遗漏任何手动步骤或设置。
- **成果：** 一份详尽且可执行的任务清单。

#### 第四步：敏捷教練 (Scrum Master, SM)

把所有资讯、PRD、架构文件和任务清单整合，然后将其转化为一系列的 Epic (功能群组) 和 Story (使用者故事) 准备交付给开发代理。

- Epic (功能群组)：逻辑相关的功能集合。
- Story (使用者故事)：是更小的、细粒度的工作单元，其内容包含所有开发代理在新聊天执行绪中完成该任务所需的上下文和细节（例如资料模型、档案位置、专案结构、PRD 相关脉络以及先前 Story 的完成情况）。每个 Story 都保持独立和完整，有助于保持脉络的干净，节省 AI token 成本。

---

**使用 `/sm` 命令呼唤 Scrum Master 角色**
- Scrum Master 基于 PRD、Epic 和架构文档
- 创建下一个待开发的**用户故事（User Story）**
- 定义验收标准和完成定义
- 估算故事点数和优先级

#### 第五步：故事开发实现

文件准备：把所有文件转换成 Markdown 格式，放在专案的 AAI 资料夹中。每个 Story (使用者故事) 都是独立档案，并且按顺序编号，如 001-setup-project.md、002-database-config.md…。

---

**使用 `/dev` 命令呼唤开发者角色**
- 开发者接收刚刚创建的用户故事
- 进行编码实现、单元测试、集成测试
- 确保代码质量和功能完整性
- 完成故事的最终交付

#### 第六步：持续迭代循环

**重复步骤 4-5，直到项目完成**

```shell
/sm → 创建下一个故事
  ↓
/dev → 实现故事
  ↓
/sm → 创建下一个故事
  ↓
/dev → 实现故事
  ↓
... 持续循环
```

### 简单使用

```shell
# 安装
npx bmad-method install

# 运行
claude

# 使用分析师代理进行市场调研（可选）
/analyst

# 使用产品经理代理创建PRD
/pm

# 使用UX专家创建前端规范
/ux-expert

# 使用架构师设计技术架构
/architect

# 文档分片（Document Sharding）
/po
*shard-doc docs/prd.md prd
*shard-doc docs/architecture.md architecture

# Scrum Master创建下一个故事
/sm
*create

# 开发者实施故事
/dev

# QA代理审查代码
/qa
```

### 典型工作流程

**1、规划阶段（Web UI）：**

```shell
*analyst          # 启动市场分析
*pm              # 创建产品需求文档
*architect       # 设计系统架构
*po              # 验证文档一致性
```

**2、开发阶段（IDE）：**

```shell
*po shard-epics    # 分解史诗故事
*sm               # 生成开发故事
*dev              # 实现具体功能
*qa               # 代码审查
```

## 小结

### 使用小结

- 如果不知道想做什么产品, 可以呼唤出分析师 Mary, 她会引导你和她对话, 和你一起做头脑风暴, 最后给你生成一份项目简报, 挺有用的.
- 用过 3.0 版本的，对话生成方案的地方挺不错的，能聊出来很多没想到的问题，生成的内容也比较详细。就是 Epic 和 Story 这套结构不太符合国内的习惯
- 这就是开发循环流程。sm 负责创建故事，dev 负责实现

### 小技巧

#### 保持 Context Window 干净

​虽然 Claude Code 看似可以无限延续的内容视窗，但这不代表你应该这样做。

​最佳实务：​

1. 与一个代理人完成特定任务（比如脑力激荡）
2. 当代理人产生输出档案并储存到 Docs 资料夹时
3. 开始一个新的聊天对话
4. 重新载入相同或不同的代理人继续下一个任务​

即使你要和同一个 Agent 继续对话，也建议开始新的 Claude 会话。​因为这样可以，确保每个阶段的专注度。

#### 模型怎么选？

重要的 Opus，其他 Sonnet？

Brian 特别强调了在不同阶段使用不同模型的重要性：

- ​架构阶段强烈建议使用 Opus，特别是在具挑战的项目上。
- ​QA 阶段也建议 Opus： QA 验证阶段比开发更需要高阶模型
这是确保 Agent 行为正确的关键。​其他阶段可用 Sonnet： ​对于脑力激荡、产品规划等阶段，Sonnet 模型通常就足够了，可以在成本和效果间取得平衡。

对于脑力激荡、产品规划等阶段，Sonnet 模型通常就足够了，可以在成本和效果间取得平衡。​

## Ref

- [The Official BMad-Method Masterclass (The Complete IDE Workflow) - YouTube](https://www.youtube.com/watch?v=LorEJPrALcg)
- [使用 BMad-Method 幫你打造一支免費的 AI Agent 開發團隊  - YouTube](https://www.youtube.com/watch?v=5mhjgwTWAPA)
- [🚀彻底颠覆传统开发！Claude Code再添利器！BMad-Method多智能体协作框架轻松打造敏捷AI驱动开发工作流！自动生成PRD文档、架构设计！支持Cursor、Cline、windsurf等 - YouTube](https://www.youtube.com/watch?v=ak9kOecZGRc)
