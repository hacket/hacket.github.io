---
date_created: Thursday, February 29th 2022, 10:50:50 pm
date_updated: Saturday, January 25th 2025, 11:58:28 pm
title: 3 Obsidian markdown
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
dg-content-classes: 
date created: Monday, December 23rd 2024, 1:07:00 am
date updated: Tuesday, January 7th 2025, 7:44:29 am
image-auto-upload: true
feed: show
format: list
aliases: [标准 markdown]
linter-yaml-title-alias: 标准 markdown
---

# 标准 markdown

## 强调

| Style    | 语法                | 键盘快捷键                                    | 示例                                       | 输出            |
| -------- | ----------------- | ---------------------------------------- | ---------------------------------------- | ------------- |
| 加粗       | `** **` 或 `__ __` | Command+B (Mac) 或 Ctrl+B (Windows/Linux) | `**This is bold text**`                  | **这是粗体文本**    |
| 斜体       | `* *` 或 `_ _`     | Command+I (Mac) 或 Ctrl+I (Windows/Linux) | `*This text is italicized*`              | _这是斜体文本_      |
| 删除线      | `~~ ~~`           |                                          | `~~This was mistaken text~~`             | ~~这是错误文本~~    |
| 粗体和嵌入的斜体 | `** **` 和 `_ _`   |                                          | `**This text is _extremely_ important**` | **此文本 _ 非常 _ 重要** |
| 全部粗体和斜体  | `*** ***`         |                                          | `***All this text is important***`       | 所有这些文本都很重要    |
| 下标       | `<sub> </sub>`    |                                          | `<sub>This is a subscript text</sub>`    | 这是下标文本        |
| 上标       | `<sup> </sup>`    |                                          | `<sup>This is a superscript text</sup>`  | 这是上标文本        |

# Obsidian 特有 markdown

## block 块

在 obsidian 中也有块的概念，但这个不是通用的语法，可能在别的软件里支持不太好，酌情使用。

`block块` 是笔记中的文本单位，例如段落、块引号，甚至是列表项

`^XXX`

## [Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts) 标注块

callout 标注块是 obsidian 新增的格式，也被称为**admonitions 警告**表现形式是带颜色的块引用，有标题、背景颜色和 icon 图标。 他极大的丰富了 obsidian 的排版，增加了美观度。

在别的 markdown 编辑器中也有类似的样式，但语法稍有不同。

### 语法

```
> [!info] 自定义标题
> 包裹的内容
> 可以是多行的内容
```

在标题部分可以使用 `-` 和 `+` 符号，让 callout 面板折叠或者展开，比如：

> [!info]+ 这是一个可折叠的 callout
> 包裹的内容，注意上面的 + 号

> [!info]- 这是一个被折叠的 callout
> 包裹的内容，注意上面的 - 号

> [!info] 默认的 callout
> 包裹的内

示例：

> [!info]
> Here's a callout block.
> It supports **Markdown**, [[Internal link|Wikilinks]], and [[Embed files|embeds]]!
> ![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/Engelbart.jpg)

### 参数

callout 可以有很多的样式，替换 `[!info]` 中的名称

- Note
- Abstract
- Info
- Todo
- Tip
- Success
- Question
- Warning
- Failure
- Danger
- Bug
- Example
- Quote

**使用技巧**

- 在使用 callout 的时候，注意中间不要有空行，否则会导致空行下面的内容不被包裹。
- 如果是一大段文字，可以先写内容，然后在使用插件 `Admonition` 插入 callout。
- 标题中也支持 markdown 语法

### Admonition 插件

Admonition 使用非常简单

1. 先选中你要包裹的内容，命令面板呼出，输入 callout。
2. 弹窗选择样式就结束了。
3. 样式、标题、折叠与否去代码里修改，语法在上面

![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240224150859.png)
