---
date created: Wednesday, January 1st 2025, 9:56:00 am
date updated: Thursday, January 16th 2025, 12:02:57 am
title: Commander
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
categories: 
feed: show
format: list
image-auto-upload: true
aliases: [Commander]
linter-yaml-title-alias: Commander
---

# Commander

## 命令面板

`Ctrl+P` 唤起命令面板

## 核心插件 Command palette

**如果有常用命令，可以在命令面板设置中将其置顶：**
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501011823046.png)

## 斜杠命令 （Slash commands）/

在 v0.12.17 中更新了 斜杠命令（Slash commands）

**只要在编辑器中输入斜杠** `/` ，即可查找并执行命令。同时，在命令面板设置中置顶的命令也会在此处置顶。

不过斜杠命令目前看上去就像是一个「缩小版」的命令面板，有些时候使用起来可能还不如原本的命令面板好用。

/

## 什么是 Commander？

使用 Commander 插件，**可以把命令添加至 UI 界面的各个区域，包括标题栏、状态栏、侧边栏、页头、文件菜单、右键菜单等。**（见下图，直观展示了 Commander 的作用范围。）

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012335099.png)

它的前身是 `Customizable Sidebar`，在 Commander 发布后，已不再维护。

**它是以下几个插件的组合版：**

- Customizable Sidebar：能够把命令添加至右侧栏，还能隐藏一些核心插件或社区插件自带的图标（比如隐藏核心插件「命令面板」的图标）
- Customizable Page Header and Title Bar ：把命令添加至页头与标题栏
- Customizable Menu ：把命令添加至右键菜单

## Commander 的功能概述

简单概述一下它的功能。它可以在 UI 界面的各处：

- 增加、删除想要 pin 的命令，并为命令设置显示的别名与图标
- 隐藏核心插件或社区插件自带的命令图标
- 支持修改显示顺序
- 支持设置移动端、桌面端各显示哪些命令

安装后进入设置，可以在最上方的导航 tab 切换想要设置的 UI 区域：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012337443.png)

### General

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012339193.png)

- `Always ask before removing?` 勾选表示：移除一个 command 前弹窗确认

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012342789.png)

- Show "Add Command" Button 勾选表示：在每个菜单添加一个 `Add Command` 选项
- Choose custom spacing for command buttons 设置 command 按钮之间的间隔

### 添加 Command

#### 添加的位置

- Ribbon：左侧栏；并且可以把不需要的命令图标隐藏（比如命令面板、快速切换等）：
- Tab Bar：顶部 Tab bar
- Status Bar：状态栏（Status Bar）也能够隐藏一些内容（反向链接、编辑器状态、词数统计等）：
- Edit Menu
- File Menu
- Explorer

#### 如何添加 Command

例如，我想在左侧栏添加一个「加星/取消加星」的命令，只需将其加入列表。并且，支持自定义以下内容（见图示的序号标注）：

1. 显示的图标
2. 显示的别名（即鼠标悬浮时 tooltip 的名称）
3. 显示顺序
4. 显示设备（全部、桌面端、移动端、仅当前设备）

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012351679.png)

> 修改别名的好处：有些命令的默认名称特别长，别名能方便我们理解。

设置完毕，左侧栏就变成下图这样：原本核心插件自带的图标没有了，只显示我们刚才添加的「加星/取消加星」命令图标。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012351458.png)

#### 一些示例

**示例，在 Tab Bar 添加一个命令：**
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012347175.png)
效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012348791.png)

**Titlebar，切换专注模式**
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020039009.png)

**Page Header，复制当前文档 URL：**
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020039649.png)

File Menu，给当前文档中英文间添加空格，也就是「**盘古插件**」。像盘古插件这样名称是中文、在命令面板中输入起来比较麻烦的命令，把它钉起来是很好的选择。（仅为举例，我目前已用 **Linter**插件全面接管了文本格式化的任务。）

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020040767.png)

**Context Menu:** 切换引用块。**右键菜单适合添加一些与文本编辑有关的命令，如切换引用块、切换代码块等。**在需要多行选中、一起切换的时候，非常适用。
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020040407.png)

**Status Bar，删除文档: **
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020041684.png)
