---
date created: 星期四, 三月 7日 2024, 12:39:00 凌晨
date updated: 星期四, 一月 2日 2025, 9:00:11 晚上
title: Obsidian增强
dg-publish: true
feed: show
format: list
image-auto-upload: true
aliases: [Easy Typing]
linter-yaml-title-alias: Easy Typing
---

# Easy Typing

见：[[Easy Typing]]

# Commander 在各个位置自定义命令 + 图标

见：[[Commander]]

# Hider 隐藏各种

隐藏不需要的菜单，可按 `Ctrl+,` 打开这个插件的设置页面

![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240307212641.png)

# `omnisearch` 增强搜索

`omnisearch` 是用来增强 Obsidian 中的搜索功能，支持 PDF 和 OCR；基于 [MiniSearch](https://github.com/lucaong/minisearch) 库的

![|1000](https://raw.githubusercontent.com/scambier/obsidian-omnisearch/master/images/omnisearch.gif)

- [obsidian-omnisearch:](https://github.com/scambier/obsidian-omnisearch)

## 用法

### OmniSearch Contexts

#### Vault Search

- 通过 Command Palette **Omnisearch: In-file search**
- 搜索笔记

#### In-File Search

- `In-File Search` 指的是在当前打开文件内搜索；对应 Command Palette **Omnisearch: In-file search**
- 在 `Vault Search` 按 tab 键进入 `In-File Search` 模式

### 高级搜索

#### 限制搜索 path

**规则：**

```
path:xxx keywords
```

如：搜索路径带 Tool 的包含 view 的 note

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240627103437.png)

- Use `ext:"png jpg"` or `ext:png`, or a plain `.png` to specify the filetype(s)
- Use `"exact expressions"` in quotes to further filter the results returned by the query
- Use `-exclusions` to exclude notes containing certain words
