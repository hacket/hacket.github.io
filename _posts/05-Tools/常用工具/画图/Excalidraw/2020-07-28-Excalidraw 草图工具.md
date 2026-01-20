---
date_created: Sunday, July 28th 2020, 6:03:29 pm
date_updated: Monday, January 20th 2025, 1:01:54 am
title: Excalidraw 草图工具
author: hacket
categories:
  - Tools
category: DevTools
tags: [辅助开发工具]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: Sunday, July 28th 2024, 6:04:00 pm
date updated: Friday, January 17th 2025, 7:59:37 am
image-auto-upload: true
feed: show
format: list
aliases: [Excalidraw]
linter-yaml-title-alias: Excalidraw
---

# Excalidraw

## Excalidraw 介绍

Excalidraw 本是开源的在线协作手写软件，来自匈牙利的 Zsolt Viczian 大叔将其融合进了 Obsidian。这个融合是高度融合，目前与原项目已经大相径庭了，主要差别在于对 Obsidian 的适配，包括双链，文件拖拽，嵌入笔记并实时更新，脚本系统，图库系统，手写压感，pdf 批注和引用等。这样强大的插件，完全可以当作一个独立的软件来学习！这个大叔倡导的是视觉化笔记，笔记方法也很值得参考。大叔在官方 Github 项目下录有数十个从入门到进阶的教程，并有分享笔记方法在 Youtube 上。本文只起到一个引导的作用，很难面面俱到 Excalidraw 插件的功能，非常强大。

## `Excalidraw` 基本使用

### 工具和样式面板

为插件版本更新的不同，呼出菜单的方式和样式略有变化，但是核心功能一般不会丢失。另外就是图标的表意上基本也是近似的。

- 对于在画板中已经创建的元素，需要通过鼠标框选才能选择多个。选择之后右击，菜单栏中有**Group Selection**, 能够组合成一个合并单元进行操作。

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407281814958.png)

- 顶部工具功能区，按数字就能选中对应的图形
- 左边是画板样式，用来调背景，线条的样式等
- 选中图形，按住 Atl 能复制（Mac 按 option）

### 右键菜单

- 右击元素或者背景画布，会弹出一个右键的上下文菜单，可以对一个或多个元素进行翻转、复制样式、添加到库等操作。

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407282306536.png)

### 图库

`excalidraw` 可以把常用的一些绘图存为小组件库，也可以从网上白嫖别人绘制好的组件。 [Excalidraw Libraries](https://libraries.excalidraw.com/?target=_blank&referrer=app%3A%2F%2Fobsidian.md&useHash=true&token=QsBDpV33IaUrThzJN19Od&theme=dark&version=2&sort=default)

#### 如何导入 Excalidraw Library 的素材包

- 点击 Excalidraw 侧边工具栏的📖 `library` 图标，即打开 `Excalidraw` 的 `Library` 库，注：默认是空白的库
- 下载素材 [Excalidraw Libraries](https://libraries.excalidraw.com/?target=_blank&referrer=app%3A%2F%2Fobsidian.md&useHash=true&token=FJeYgBKCeAYtm3HX9zttC&theme=light&version=2&sort=default)
- 离线保存素材包

> 其中 **Add to Excalidraw** 仅适用于 Excalidraw 在线版，对 Obsidian 的 Excalidraw 插件不适用，所以你想导入 Obsidian 的 Excalidraw 插件中，只能 **Download** 离线素材包 (`.excalidrawlib`) 到本地来导入。

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407282313601.png)

- 导入素材包

> 方法一：Open 加载：点击 Open 按钮后导入离线素材包 (.excalidrawlib) 就可以加载素材了
> 方法二：直接拖入：直接将素材包 (.excalidrawlib) 拖入界面就行

### 嵌入

1. 实时嵌入：你可以修改绘图，其嵌入的地方都会同步更新。修改起来也非常方便，只要点一下嵌入的图就能进入绘图界面。
2. 自定义大小：在默认设置中，你可以自定义嵌入图的默认大小，当然也可以用类似 `![[test.excalidraw|200]]` 这样的语法进行调节
3. 自定义嵌入样式：绘图想要白色背景，嵌入想要黑色背景，透明背景？想要边框？想要无边框？想要不同的字体？没问题，设置里可以添加 CSS 样式文件！
4. Excalidraw 局部嵌入 Obsidian： Excalidraw 生成链接局部嵌入图形到 Obsidian 中

### 脚本引擎 Excalidraw Scripts

这些脚本是一些自动化创建一些常用图形的方式，比如：

- 选中图里的文字，一键给所有文本元素添加框
- 一键对齐选中的元素
- 一键把弯箭头转换为直角箭头
- 一键 OCR 图表文字
- 一键重命名图片
- 一键设置链接别名
- 把图形转换为脑图模式

当然，你也可以到 [obsidian-excalidraw-plugin/Add Connector Point.md](https://github.com/zsviczian/obsidian-excalidraw-plugin/blob/master/ea-scripts/Add%20Connector%20Point.md) 下载和学习脚本自己学习，这也有大叔录制的 [Youtube视频](https://www.youtube.com/watch?v=hePJcObHIso&feature=youtu.be) 教程，熟悉 Javascript 还是挺容易上手的。我曾经尝试过在 Excalidraw 里做动画，这些都是可以实现的。

# Ref

- [Excalidraw 使用](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/excalidraw/obsidian-excalidraw-plugin/)
