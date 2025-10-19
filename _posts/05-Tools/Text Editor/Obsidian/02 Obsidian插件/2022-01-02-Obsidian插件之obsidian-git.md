---
banner: 
date_created: Thursday, January 2nd 2022, 10:45:50 pm
date_updated: Friday, October 3rd 2025, 8:43:24 pm
title: Obsidian插件之obsidian-git
author: hacket
categories:
  - Tools
category: Obsidian
tags: [obsidian]
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
aliases: [Obsidian 同步相关插件]
linter-yaml-title-alias: Obsidian 同步相关插件
---

# Obsidian 同步相关插件

## Obsidian git

- 安装 Obsidian git 插件：<https://github.com/denolehov/obsidian-git>
- obsidian 默认安装目录：`~/Documents/Obsidian Vault`
- 在 Github 创建一个空仓库，将这个仓库 clone 到 `~/Documents/Obsidian Vault`

### 常用配置

#### Commit message script

obsidian-git 插件这个怎么用

Suggest new conversation rejected for message

这个是 Obsidian Git 插件的 "Commit message script" 功能。让我解释一下它的用法：

这个功能允许你使用脚本来自动生成 git 提交消息，而不是每次都手动输入。

**脚本格式**
脚本使用 `sh -c` 命令执行，可以使用以下占位符：
- `{{hostname}}` - 主机名
- `{{date}}` - 当前日期

 **示例脚本**
- 简单的日期时间提交消息：

```bash
echo "Auto backup: {{date}} from {{hostname}}"
```

- 更复杂的脚本示例：

```bash
echo "📝 Obsidian notes updated on {{date}} | Host: {{hostname}}"
```

- 使用 Git 状态信息：

```bash
CHANGED=$(git diff --name-only --cached | wc -l)
echo "Updated $CHANGED files on {{date}}"
```

- AI 生成提交消息（如果你有 AI 工具）：

```bash
git diff --cached | ai-commit-message-generator
```

**高级用法**

你也可以创建更复杂的脚本来：

- 分析修改的文件类型
- 根据修改内容生成描述性消息
- 包含统计信息（添加/删除的行数等）

**注意事项**

- 脚本必须输出到 `stdout`，插件会使用输出作为提交消息
- 确保脚本有执行权限
- 脚本执行失败时会回退到默认消息

这个功能特别适合那些想要自动化提交消息生成的用户，可以让你的 git 历史更加一致和信息丰富。

#### Line author information

![obsidian20240222203345](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/obsidian20240222203345.png)

#### 其他

[使用Git插件实现Obsidian同步 \| 文雅的疯狂的学习笔记](https://www.aiexplorernote.com/article/obsidian-git#1f0d1f9cc2a38001beb7db66bb3a4f6e)

### Github 同步 Vault 配置忽略文件

1. `git rm --cached .obsidian/workspace.json`
2. 添加

```shell
# 工作台配置，如打开的文件
.obsidian/workspace.json

# obsidian-git插件配置
.obsidian/plugins/obsidian-git/data.json
```

## Remotely Save

### webdav 配置

以 `Obsidian` 中配置 `123云盘` 的 webdav 为例

- 123 云盘后台添加 webdav 应用，要注意授权的目录在网盘以及存在
![202510031740672](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202510031740672.png)
- 确保 123 云盘存在 `WebDavs/obsidian-vault` 目录（报 40X 的错误，就是不存在路径）
- 配置 `Obsidian`→ `Remotely Save`
![202510031743893](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202510031743893.png)
- 然后点击下面的 `chekc` 看是否正常

## cloud-sync

<https://github.com/ai-bytedance/obsidian-cloud-sync>
