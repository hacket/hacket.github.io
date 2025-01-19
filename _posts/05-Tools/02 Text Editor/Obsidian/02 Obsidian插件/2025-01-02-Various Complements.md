---
date_created: Thursday, January 2nd 2025, 10:45:50 pm
date_updated: Monday, January 20th 2025, 12:45:25 am
title: Various Complements
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
date created: Saturday, June 1st 2024, 11:30:00 am
date updated: Thursday, January 16th 2025, 12:03:51 am
image-auto-upload: true
feed: show
format: list
aliases: [8.Various Complements]
linter-yaml-title-alias: 8.Various Complements
---

# 8.Various Complements

可以自动根据你当前的输入，检测词典，并给出对应的提示。词典内容可以自定义，也可使是你本库内已经输入的内容。或者自动化输入一些格式，比如不同的 callout 类型

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/various-complements.gif)

官方： <https://github.com/tadashi-aikawa/obsidian-various-complements-plugin>

## 配置

Various Complements 允许你根据自己的需要进行配置：

- 你可以在插件的设置中调整补全的灵敏度。
- 你可以选择在特定的情况下启用或禁用自动补全功能。
- 你还可以自定义补全的触发条件，比如只在输入特定的字符后才显示建议。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240223142800.png)

### 中文支持

- 在新版的 Various Complements 中加强了对中文的支持，不过你需要下载一个中文包，下载地址：[CC-CEDICT download - MDBG Chinese Dictionaryopen in new window](https://www.mdbg.net/chinese/dictionary?page=cc-cedict)
- 也可直接下载压缩 [cedict_1_0_ts_utf-8_mdbg.zipopen in new window](https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip)，解压缩之后，将 `cedict_ts.u8` 文件复制到当前库的根目录下，然后重启 obsidian 生效

怎么打开当前库的根目录

> [!important] 怎么打开当前库的根目录
>
> 1. 当前库目录，就是你新建库文件时候建立的文件夹。打开步骤如下：
> 2. 左侧菜单栏，左下角 " 打开其他库 "
> 3. 在弹出窗口，在左侧找到你的库名称，点击旁边的 "…" 更多菜单，选择 " 在系统资源管理器中显示仓库文件夹 "，会弹出资源管理器，如下图所示
> 4. 打开的资源管理器，点击你的库名称，就是根目录。注意是在和 "`.obsidian`" 文件夹同级的位置。

[# Chinese strategy doesn't work as expected](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/137)

### 自定义词典

## 使用

使用 Various Complements 插件非常简单：

- 开始输入：在任何笔记中开始输入，插件会自动开始工作。
- 选择建议：当补全建议出现时，使用键盘上下箭头选择一个建议。
- 确认补全：按下 Tab 或 Enter 键来选择高亮的补全建议。
