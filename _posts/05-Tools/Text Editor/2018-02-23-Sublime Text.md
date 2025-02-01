---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:48:05 am
title: Sublime Text
author: hacket
categories:
  - Tools
category: 
tags: []
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
aliases: [Sublime text]
linter-yaml-title-alias: Sublime text
---

# Sublime text

## 快捷键

### 1、基本编辑快捷键

- Ctrl + Enter 在当前行下面新增一行然后跳至该行
- Ctrl + Shift + Enter 在当前行上面增加一行并跳至该行
- Ctrl + ←/→进行逐词移动
- Ctrl + Shift + ←/→进行逐词选择
- Ctrl + ↑/↓ 上下移动当前显示区域（移动一行）
- Ctrl + Shift + ↑/↓ 上下移动当前选中的区域

### 2、选择

支持多重选择（同时选择多个区域，然后同时进行编辑）

- Ctrl + D 选择当前光标所在的词并高亮该词所有出现的位置，再次 Ctrl + D 选择该词出现的下一个位置；在多重选词的过程中，使用 Ctrl + K 进行跳过，使用 Ctrl + U 进行回退，使用 Esc 退出多重编辑。（Ctrl+K 忽略这次选择，Ctrl+U 回滚选择）
- Ctrl + Shift + L 可以将当前选中区域打散，然后进行同时编辑
- Ctrl + J 可以把当前选中区域合并为一行

### 3、查找&替换

- 快速查找&替换<br>Ctrl + D 选中关键字，然后 F3 跳到其下一个出现位置，Shift + F3 跳到其上一个出现位置<br>用 Alt + F3 选中其出现的所有位置（之后可以进行多重编辑，也就是快速替换，替换所有选择的关键字）
- 标准查找&替换<br>查找：搜索某个已知但不在当前显示区域的关键字 Ctrl + F<br>替换：Ctrl + H 进行替换
- 关键字查找&替换<br>在搜索框输入关键字后 Enter 跳至关键字当前光标的下一个位置，Shift + Enter 跳至上一个位置，Alt + Enter 选中其出现的所有位置（同样的，接下来可以进行快速替换）。

Sublime Text 的查找有不同的模式：Alt + C 切换大小写敏感（Case-sensitive）模式，Alt + W 切换整字匹配（Whole matching）模式（全词匹配）<br>Sublime Text 还支持在选中范围内搜索（Search in selection），这个功能没有对应的快捷键，但可以通过以下配置项自动开启。（这样在选中文本的状态下范围内搜索就会自动开启，配合这个功能，局部重命名（Local Renaming）变的非常方便）

- 正则表达式查找&替换
- 多文件搜索&替换<br>使用 Ctrl + Shift + F 开启多文件搜索&替换（注意此快捷键和搜狗输入法的简繁切换快捷键有冲突）：多文件搜索&替换默认在当前打开的文件和文件夹进行搜索/替换，我们也可以指定文件/文件夹进行搜索/替换。

### 4、跳转

- 跳转到文件<br>Ctrl + P 会列出当前打开的文件（或者是当前文件夹的文件），输入文件名然后 Enter 跳转至该文件。（文件名使用模糊字符串匹配）
- 跳转到符号<br>Sublime Text 能够对代码符号进行一定程度的索引。Ctrl + R 会列出当前文件中的符号（例如类名和函数名，但无法深入到变量名），输入符号名称 Enter 即可以跳转到该处。此外，还可以使用 F12 快速跳转到当前光标所在符号的定义处（Jump to Definition）。

对于 Markdown，Ctrl + R 会列出其大纲，非常实用。

- 跳转到某行<br>Ctrl + G 输入行号可以跳转到指定行
- 组合跳转<br>在 Ctrl + P 匹配到文件后，我们可以进行后续输入以跳转到更精确的位置：

```
@ 符号跳转：输入@symbol跳转到symbol符号所在的位置
# 关键字跳转：输入#keyword跳转到keyword所在的位置
: 行号跳转：输入:12跳转到文件的第12行。
```

> 所以 Sublime Text 把 Ctrl + P 称之为 "Go To Anything"，这个功能如此好用，以至于我认为没有其它编辑器能够超越它。

## 窗口&标签

### 窗口

- 新建一个新的窗口<br>Ctrl + Shift + N（该快捷键再次和搜狗输入法快捷键冲突）
- 关闭窗口<br>Ctrl + W

### 标签

- 新建标签<br>Ctrl + N
- 关闭标签<br>Ctrl + W
- 恢复刚刚关闭的标签<br>Ctrl + Shift + T
- 分屏<br>`Alt + Shift + X([1-4])  ` 左右分 X 屏<br>Alt + Shift + 5 上下左右分 4 屏<br>Alt + Shift + 8  上下分 2 屏<br>Alt + Shift + 9  上下分 3 屏<br>Ctrl + 数字键跳转到指定屏<br>Ctrl + Shift + 数字键将当前屏移动到指定屏

> 例如，Ctrl + 1 会跳转到 1 屏，而 Ctrl + Shift + 2 会将当前屏移动到 2 屏。

- 全屏<br>Sublime Text 有两种全屏模式：普通全屏和无干扰全屏。（建议开启全屏前关闭菜单栏）<br>F11 切换普通全屏<br>Shift + F11 切换无干扰全屏

## 风格

## 代码

Ctrl + M 可以快速的在起始括号和结尾括号间切换<br>Ctrl + Shift + M 可以快速选择括号间的内容<br>对于缩进型语言（例如 Python）则可以使用 Ctrl + Shift + J。

## 插件

### `BracketHighlighter`

`BracketHighlighter` 插件以高亮显示配对括号以及当前光标所在区域

## Reference

<https://www.cnblogs.com/gaosheng-221/p/6108033.html>
