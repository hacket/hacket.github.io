---
banner: 
date_created: Wednesday, May 29th 2022, 12:37:40 am
date_updated: Saturday, February 8th 2025, 1:04:04 am
title: Obsidian插件之dataview
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
aliases: [dataview]
linter-yaml-title-alias: dataview
---

# dataview

## 什么是 dataview？

Obsidian 的 Dataview 插件是一个高度强大的数据管理工具，允许用户在 Obsidian 中以各种方式查询和组织数据。通过 Dataview，你可以更高效地管理和提取笔记中的信息。

**功能概览：**
- `数据查询`：Dataview 允许你使用类似于 SQL 的查询语言来搜索你的笔记，并返回满足特定条件的笔记。
- `动态列表和表格`：根据你的查询，Dataview 可以生成动态的列表或表格，当相关笔记内容变化时，这些列表和表格会自动更新。
- `元数据支持`：Dataview 特别适用于有元数据的笔记。你可以在笔记的前导部分定义元数据，例如日期、作者、标签等，然后使用 Dataview 查询和组织这些数据。
- `灵活的显示选项`：除了常规的列表和表格，你还可以使用 Dataview 创建任务列表、日历视图等。

## dataview 使用？

### 基本查询

在你的笔记中，你可以使用以下代码块形式来进行查询：

```
table
from "你的笔记文件夹"
where your-condition
```

这会从指定的文件夹中查询满足条件的笔记，并以表格形式显示。

### 高级查询

你可以使用更复杂的查询，例如：

```
table title, date(created) as "创建日期"
from "你的笔记文件夹"
where contains(title, "关键词")
sort date(created)
```

这将列出包含 " 关键词 " 的标题以及笔记的创建日期，并按创建日期排序。

如，查询 obsidian 目录下：

```dataview
table title, date(date_created) as "创建日期"
from "obsidain"
where contains(title, "obsidain")
sort date(date_created)
```

### 其他视图

除了 `table` 视图，你还可以使用 `list` 和 `task` 视图来展示查询结果。

## dataview 应用场景？

**1) 项目管理：**

你可以为每个项目创建一个笔记，并在其中添加相关的元数据，如项目开始日期、结束日期、负责人等。然后使用 Dataview 查询和组织这些项目笔记。

**2) 书籍或文章索引：**

如果你有一个书籍或文章的笔记集合，你可以使用 Dataview 为这些笔记添加作者、出版日期等元数据，并创建一个动态的书籍或文章索引。

**3) 日常任务跟踪：**

你可以在笔记中定义任务，并为其添加截止日期、优先级等元数据。然后使用 Dataview 创建一个动态的任务列表。
