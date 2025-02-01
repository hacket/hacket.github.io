---
date_created: Saturday, February 1st 2022, 10:28:40 am
date_updated: Saturday, February 1st 2025, 11:16:30 pm
title: Obsidian插件之shell commands
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
aliases: [Obsidian 插件之 shell commands]
linter-yaml-title-alias: Obsidian 插件之 shell commands
---

# Obsidian 插件之 shell commands

## 内置变量

| 变量名称               | 说明                                                 |
| ------------------ | -------------------------------------------------- |
| `{{vault}}`        | 自动替换为当前 Obsidian Vault 仓库的根目录绝对路径                  |
| `{{file.path}}`    | 当前文件的**绝对路径**（如 `/Users/name/vault/notes/note.md`） |
| `{{file.name}}`    | 当前文件的**文件名**（如 `note.md`）                          |
| `{{file.content}}` | 当前文件的**全文内容**（需谨慎使用，内容过长可能导致命令执行失败）                |
| `{{title}}`        | 当前文件的标题（通常是文件名去掉扩展名，如 `note`）                      |
| `{{tags}}`         | 当前文件的所有标签（逗号分隔，如 `#work, #meeting`）                |

## 示例

### Open the current file in vscode and jump to the current position

用 vscode 打开当前文件，并跳转到当前位置。

```shell
code --goto {{file_path:absolute}}:{{caret_position}}
```

![ueyzf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ueyzf.png)
