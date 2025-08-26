---
banner:
date_created: Thursday, January 2nd 2022, 10:45:50 pm
date_updated: Thursday, July 31st 2025, 11:09:59 pm
title: Obsidian Markdown相关插件
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
date created: Saturday, June 1st 2024, 11:27:00 am
date updated: Friday, January 17th 2025, 8:04:33 am
feed: show
format: list
image-auto-upload: true
aliases: [Markdown Formatting Assistant]
linter-yaml-title-alias: Markdown Formatting Assistant
---

# Markdown Formatting Assistant

## 介绍

是一款可以快速输入 markdown 格式的插件 Markdown Formatting Assistant，具体的效果如下，可能类似于一些 md 软件的状态栏

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240222205323.png)

Github 地址：<https://github.com/Reocin/obsidian-markdown-formatting-assistant-plugin>

## 使用

开启插件后，在软件右侧的 side pane（显示双链、标签、大纲的地方）会出现新的一栏，显示了许多 md 的格式，直接点击就能快速输入到 md 中。

在 md 中输入 `\` 就能弹出一个下拉选框

## 插件设置

插件的设置非常简单：\
第一行是设置触发下拉选单的命令，默认是 `\`，如果与你的习惯不符，可以进行修改。\
第二行是设置 md 的面板显示在何处（？）。\
我个人没有去修改以上的选项，都采用了默认的设置。\
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250102205902.png)

# ~~Markdown Prettifier~~ 过时 (用 linter 替代)

**注意：** 存在格式化的问题，可用 [[Obsidian插件之linter]] 替换

## 统一 Markdown 格式

把 Markdown Prettifier 的快捷键设置成 `Ctrl + S`，按下此快捷键后，插件会按预先的配置将文章的 Markdown 格式规范和统一。比如将所有的无序列表标记统一置换为 `-`。

## 更新元数据 YAML front matter

### 日期

Markdown Prettifier 还有一个非常好用的功能：更新文件的元数据。勾选插件设置中的「Update header」和「Add new headers」，

在 header 设置中填入模板，例如 ![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501170800675.png)

，它会在按下快捷键后更新笔记中的 `updated` 一栏的数据为当前时间，如果没有相关的条目，则会自动补充。

![image.png|900 ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403120850580.png)

### 更新时添加 Digital Gargen 发布头

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412232337767.png)

# Editing Toolbar（必装的可视化编辑工具，替代 cMenu）

Editing Toolbar 是 Cumany 二次开发的**可视化编辑工具栏**，旨在增强 Obsidian 的可视化编辑体验。提供类似于 Word，在线办公软件 的浮动工具栏等交互方式。

## 基本功能

- 内置了 markdown 常用命令
- Editing Toolbar 可以自定义添加命令，只要是 命令面板里能看到的都可以加。也可以自由调整顺序，非常方便。

## 与其他插件一起使用

### obsidian-emoji-toolbar

和 [obsidian-emoji-toolbar](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/obsidian-emoji-toolbar) 快速插入表情符号，通过自定义工具栏命令

![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main/pic/202209092001600.gif)

### Obsidian-Table-Generator

配合自定义工具栏命令，快速插入和编辑表格

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403070036245.png)

# obsidian-pandoc

用 pandoc 将 Markdown 文件转换为 PDF

- [GitHub - OliverBalfour/obsidian-pandoc: Pandoc document export plugin for Obsidian (https://obsidian.md)](https://github.com/OliverBalfour/obsidian-pandoc)
