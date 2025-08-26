---
banner: 
date_created: Thursday, August 14th 2025, 12:36:37 am
date_updated: Friday, August 15th 2025, 12:33:58 am
title: SuperClaude V4
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
aliases: [SuperClaude V4（基于 Beta 版）]
linter-yaml-title-alias: SuperClaude V4（基于 Beta 版）
---

# SuperClaude V4（基于 Beta 版）

<https://github.com/SuperClaude-Org/SuperClaude_Framework/tree/SuperClaude_V4_Beta>

## V4 相比 V3 的改进

- **21 specialized commands**：命令从 V3 版本的 17 个 增加到 21 个
- **13 specialized agents**：V3 版本的 persona system 转换为了 subagent
- **4 Behavioral Modes**：不同的工作用不同的 mode (Brainstorming, Introspection, Task Management, Token Efficiency)
- **6 MCP servers**：MCP 集成
- **Session Lifecycle**：会话持久化管理，通过命令：`/sc:load` and `/sc:save`
- **增强的 Hook 系统**：可扩展和可自定义
- **SuperClaude-Lite**： 轻量级版本

## 特性

### 21 Specialized Commands

**Development**: `/sc:implement`, `/sc:build`, `/sc:design`  
**Analysis**: `/sc:analyze`, `/sc:troubleshoot`, `/sc:explain`  
**Quality**: `/sc:improve`, `/sc:test`, `/sc:cleanup`  
**Session**: `/sc:load`, `/sc:save`, `/sc:brainstorm`, `/sc:reflect`  
**Workflow**: `/sc:task`, `/sc:spawn`, `/sc:workflow`, `/sc:select-tool`  
**Others**: `/sc:document`, `/sc:git`, `/sc:estimate`, `/sc:index`

### 13 Specialized Agents

- 🏗️ **architect** - System design and architecture
- 🎨 **frontend** - UI/UX and modern frontend development
- ⚙️ **backend** - APIs, infrastructure, and server-side logic
- 🔍 **analyzer** - Debugging and system analysis
- 🛡️ **security** - Security assessment and vulnerability analysis
- ✍️ **scribe** - Technical documentation and writing
- ⚡ **performance** - Optimization and performance engineering
- 🧪 **qa** - Quality assurance and testing strategies
- 📊 **data** - Data analysis and processing
- 🤖 **devops** - Infrastructure and deployment automation
- 🔧 **sre** - Site reliability and system operations
- 💼 **product** - Product strategy and requirements
- 🎯 **specialist** - Adaptive expertise for unique domains

### 4 Behavioral Modes

### 6 MCP Server Integration

- **Context7** - Official library documentation and patterns
- **Sequential** - Multi-step analysis and complex reasoning
- **Magic** - Modern UI component generation
- **Playwright** - Browser automation and E2E testing
- **Morphllm** - Intelligent file editing with Fast Apply capability
- **Serena** - Semantic code analysis and project-wide operations

### Session Lifecycle System

- **`/sc:load`** - 使用完整 context 恢复来初始化项目
- **`/sc:save`** - 创建检查点并保存会话状态
- **Automatic Checkpoints**
- **Cross-Session Learning**

### Hooks System

- **Framework Coordinator** - Cross-component orchestration
- **Performance Monitor** - Real-time metrics and optimization
- **Quality Gates** - 8-step validation pipeline
- **Session Lifecycle** - Event-driven session management

### SuperClaude-Lite

轻量级的

### V4 版本亮点

#### Behavioral Intelligence 行为智能

- **Automatic Mode Detection** - 根据上下文行为适应
- **Cross-Mode Coordination** - 行为模式之间的无缝集成
- **Progressive Enhancement** - 能力随复杂性而扩展

#### Agent Orchestration

- **Intelligent Routing** - 基于领域专业知识的 agents 的选择
- **Collaborative Problem-Solving** - 复杂任务的多 agents 协调
- **Context Preservation** - agents 在交互过程中保持意识

#### Session Management

- **Persistent Context** - 跨 session 的完整项目状态保存
- **Intelligent Checkpointing** - 根据风险和完成情况自动保存
- **Cross-Session Learning** - 积累的洞察力和模式识别

### Configuration

具有增强行为控制的 V4 配置：

- `~/.claude/settings.json` - Main V4 configuration with modes and agents
- `~/.claude/*.md` - Behavioral mode configurations
- `~/.claude/agents/` - Agent-specific customizations
- `~/.serena/` - Session lifecycle and memory management

## 21 Specialized Commands

### Development

**Development**: `/sc:implement`, `/sc:build`, `/sc:design`  

### Analysis

**Analysis**: `/sc:analyze`, `/sc:troubleshoot`, `/sc:explain`  

### Quality

**Quality**: `/sc:improve`, `/sc:test`, `/sc:cleanup`  

### Session

**Session**: `/sc:load`, `/sc:save`, `/sc:brainstorm`, `/sc:reflect`  

### Workflow

**Workflow**: `/sc:task`, `/sc:spawn`, `/sc:workflow`, `/sc:select-tool`  

### Others

**Others**: `/sc:document`, `/sc:git`, `/sc:estimate`, `/sc:index`
