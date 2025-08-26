---
banner: 
date_created: Monday, August 11th 2025, 1:43:16 am
date_updated: Tuesday, August 26th 2025, 8:56:31 am
title: Claude Code使用其他大模型
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
aliases: [Claude Code 使用其他大模型]
linter-yaml-title-alias: Claude Code 使用其他大模型
---

# Claude Code 使用其他大模型

## qwen 3

<https://help.aliyun.com/zh/model-studio/claude-code?spm=a2c4g.11186623.0.0.b58d77e95DPaSC>

在 Claude Code 中使用百炼提供的 `Qwen3-Coder-Plus` 模型，只需配置以下两个环境变量：

- ANTHROPIC_BASE_URL：设置为 `https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy`
- ANTHROPIC_AUTH_TOKEN：设置为 [阿里云百炼API Key](https://help.aliyun.com/zh/model-studio/get-api-key)

参考：

- [claudeCode使用免费qwen3 coder](https://mp.weixin.qq.com/s/cp9owfvI1ti1Qs3HfnZ0vg)

## GLM 4.5 智谱清言

### 申请 API Key

打开智谱大模型开放平台 BigMoModel： <https://bigmodel.cn/usercenter/proj-mgmt/apikeys>

在「个人中心」-「项目管理」-「API keys」下，点「添加新的 API Key」，然后复制 API key。

### 配置环境变量

- Windows 配置在环境变量中
- Mac/Linux，配置的 `~/.zshrc` 或 `~/.bashrc`

```shell
export ANTHROPIC_BASE_URL=https://open.bigmodel.cn/api/anthropic
export ANTHROPIC_AUTH_TOKEN="刚才复制的 API Key"
```

### 验证

输入 claude 命令，看到 API Base URL 如下图，说明可以开始用 GLM-4.5 干活了。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250812003958841.png)

**看是否生效，查看费用明细：**
<https://bigmodel.cn/finance/expensebill/list>

**注意：** 看模型是 haiku，这不影响

## Gemini Pro 2.5

## Deepseek

据说也会推出兼容 Claude Code 的 API

## kimi-2

- 申请 API Key <https://platform.moonshot.cn/console/api-keys>
- 执行脚本配置 Kimi K2 模型
执行这个开源项目的脚本：[https://github.com/LLM-Red-Team/kimi-cc](https://link.zhihu.com/?target=https%3A//github.com/LLM-Red-Team/kimi-cc)，通过脚本自动配置 Claude Code 使用 `Kimi K2` 模型。
- 关闭并重新启动终端
如果你是使用 Cursor、Windsurf 或者 VS Code 的终端安装 Claude Code，那就完全退出对应软件。

```shell
source ~/.zshrc
```

- 验证

```shell
claude
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian-ubuntu/20250826085423059.png)
