---
date_created: Thursday, January 2nd 2025, 10:45:50 pm
date_updated: Monday, January 20th 2025, 8:30:10 am
title: Obsidian插件之linter
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
feed: show
format: list
image-auto-upload: true
aliases: [Linter]
linter-yaml-title-alias: Linter
---

# Linter

## 什么是 YAML front matter?

**YAML**：是一种表达数据序列化的格式。
**Front matter**：直译为 " 前置内容 "，它是基于 YAML 格式的纯文本内容，放置在文档开头，用于标明文档的各种属性（元信息）。

### Front matter 的格式

```
---
key: value
key: [one, two, three]
key:
- 1
- 2
- 3
---
```

- 用 `---` 标明 Front matter 的起始位置。
- 其有效内容以 "**键值对**" 的形式呈现：
	- `key`（键）：属性名
	- `value`（值）：属性值
- 一个键可以对应一个值也可以对应多个值，其表示方法如上所示。
- **注意：** Front matter 里的冒号是英文 ": "，而且冒号后**要加空格**才能让键值对生效。

### Front matter 的用法

当前的 Obsidian 包含三个原生的 key：`tags`、`aliases` 和 `cssclass`。除此之外，我们还可以人为添加 key，比如 `time`、`progress` 和 `简介`。

```
---
aliases:
- YAML front matter
tags:
- Obsidian
time: 2023-01-12 09:51
progress: 进行中
简介: Obsidian 中 YAML front matter 的用法。
---
```

- `aliases`：别名  
	我给这篇笔记取了一个别名叫 "YAML front matter"，方便我在其他笔记中引用这篇笔记。
- `tags`：标签  
	为了防止标签出现在正文中，破坏文章结构，这里我将它放到了 Front matter 中，而且这么做还有利于统一查看和管理一篇笔记的标签。
- `time`：创建时间  
	创建这篇笔记的日期和具体时间，结合模板使用。
- `progress`：笔记进度  
	共有 " 未开始 "、" 进行中 "、" 已完成 " 和 " 已放弃 " 四种属性值，用于任务管理。
- `简介`：用一句话介绍笔记内容。

## 什么是 Linter ?

[Obsidian Linter](https://github.com/platers/obsidian-linter/) 是一个用于帮助用户维护 Obsidian 笔记一致性和格式化的插件。它通过自动检查和修正笔记中的格式问题来确保你的笔记符合一定的规范。Linter 插件主要用于提高笔记的可读性和整洁性，特别适合那些需要高质量、结构化笔记的用户

## Linter 插件的功能

### YAML Front Matter 格式化

- 自动检查并修复 YAML front matter 的格式问题。例如，确保 `title`、`date` 等字段的正确性，或者调整字段的顺序。
- 自动删除无用的空格、空行，确保 `YAML front matter` 看起来更加整洁。

### Markdown 格式化

- 确保 Markdown 文件符合标准格式，包括：
  - 统一的标题级别（确保标题层级合理，避免无序的 `#` 符号）。
  - 自动格式化链接、图片等元素的语法。
  - 自动修正列表缩进、换行等格式问题。
- 统一处理空格和标点符号，确保一致性。

### 代码块格式化

- 自动修复代码块的语法高亮标签（例如 `python`、`javascript`），确保代码块的标记符合规定。
- 修复代码块缩进错误。

### 检查多余空行

- 自动清理笔记中的多余空行，特别是在段落和标题之间。
- 去除文件开头和结尾的不必要空行，保持文件内容紧凑。

### 自动修复常见错误

- 该插件可以自动修正某些常见的格式错误，如：
  - 缺少闭合的括号或引号。
  - 错误的 `Markdown` 语法，如缺失的 `[]` 或 `()`。
  - 统一的列表符号（如从 `-` 改为 `*`，或反之）。

### 自定义规则

- 插件允许用户根据自己的需要定义规则，比如强制某些元素的顺序或格式。
- 用户可以选择开启或关闭特定的规则，例如不允许使用某些 Markdown 特性，或者在每个文件中都需要一个特定的字段。

## 配置 Linter 插件

配置项包括：

- 选择启用或禁用特定的格式检查规则。
- 配置规则的强度（例如，强制修复还是仅提醒）。
- 自定义规则的执行顺序和偏好。
- 自动或手动运行 Linter（例如，你可以选择在每次保存时自动运行 Linter，或者手动触发）。

## 如何使用 Linter

Linter 可以在笔记中自动检查和修复格式问题。你可以在编辑模式下使用以下操作：

- **自动修复**：点击菜单中的 **Fix Issues**（修复问题）按钮，Linter 将尝试自动修复文件中的格式问题。
- **检查文件**：Linter 会在后台检查文件，通常会显示一个图标，提示文件中有格式问题。
- **手动修复**：如果你只想修复某些特定的问题，可以选择性地手动修复。

### lint folder

右击文件夹，`lint folder`，会对该文件夹所有笔记格式化，要注意使用

## YAML 格式化

可用于替换 `markdown prettifier` 插件

### 保存时插入新的 yaml key

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250102161209.png)

新增的 yaml 属性如下：

```yaml
dg-publish: true
image-auto-upload: true
feed: show
format: list
```
