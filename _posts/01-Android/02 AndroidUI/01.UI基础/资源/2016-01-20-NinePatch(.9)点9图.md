---
date_created: Monday, January 20th 2016, 11:53:51 pm
date_updated: Sunday, February 2nd 2025, 9:07:58 pm
title: NinePatch(.9)点9图
author: hacket
categories:
  - AndroidUI
category: UI杂项
tags:
  - Drawable
  - UI杂项
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
date created: 2024-10-11 15:26
date updated: 2024-12-24 00:29
aliases:
  - 9patch 图
linter-yaml-title-alias: 9patch 图
---

# 9patch 图

- [x] [创建可调整大小的位图（9-patch 文件）](https://developer.android.com/studio/write/draw9patch)
- [x] [NinePatch 可绘制对象](https://developer.android.com/guide/topics/graphics/drawables?hl=zh-cn#nine-patch)

## 什么是 `.9`？

[NinePatchDrawable](https://developer.android.com/reference/android/graphics/drawable/NinePatchDrawable?hl=zh-cn) 图形是一种可拉伸的位图，可用作视图的背景。Android 会自动调整图形的大小以适应视图的内容。NinePatch 图片的其中一项用途是用作标准 Android 按钮（按钮必须拉伸以适应各种长度的字符串）的背景。NinePatch 图形是标准 PNG 图片，包含一个额外的 1 像素边框。必须使用 9. Png 扩展名将其保存在项目的 `res/drawable/` 目录下。

`.9.png` 可以保证图片在合适的位置进行局部拉伸，避免了图片全局缩放造成的图片变形问题。

## 9 patch

![84yvv](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/84yvv.png)

左侧和顶部的线定义可拉伸区域，通过底部和右侧的线定义可绘制区域。

在上方的图片中，灰色虚线表示图片中为了拉伸图片而复制的区域。在下方的图片中，粉色矩形表示允许放置视图内容的区域。如果内容不适合此区域，则图片会拉伸以使其合适。

## .9 图制作工具

### Android Studio Draw 9-patch 工具

#### 步骤

1. 将图片放到 `res/drawable`
2. 右击该图片选择 `Create 9-Patch file` 选项

![gx13j](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/gx13j.png)

3. 操作
   - 使用鼠标在图片的边缘拖动就可以进行绘制
   - 按住 shift 键拖动可以进行擦除

#### Draw 9 patch 工具

![02ylr](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/02ylr.png)

**界面介绍：**

- <font style="color:rgb(98, 98, 98);">Zoom : 左边原图的缩放比例</font>
- <font style="color:rgb(98, 98, 98);">Patch scale : 右边 .9 图缩放后的效果，可用来预览横向纵向拉伸效果</font>
- <font style="color:rgb(98, 98, 98);">show lock : 勾选后，鼠标放到原图上，会显示红色斜线部分，表示 .9 图锁定的区域</font>
- <font style="color:rgb(98, 98, 98);">show content</font>
  - <font style="color:rgb(98, 98, 98);">勾选后，右边图中的蓝色区域表示可以填充内容，绿色区域便是不可填充内容</font>
  - <font style="color:rgb(98, 98, 98);">移动原图中右边和下边的修改可填充内容的区域，规则如上</font>
- <font style="color:rgb(98, 98, 98);">show patches : 显示原图中可以缩放的区域 (top 和 left 交界处的粉红色区域)</font>
- Show bad patches
  - 在补丁区域周围添加红色边框，在拉伸时可能会在图形中产生伪影。如果消除所有不良补丁，将保持拉伸图像的视觉一致性。

### [Simple nine-patch generator](https://romannurik.github.io/AndroidAssetStudio/nine-patches.html#source.type=image&sourceDensity=640&name=lv_1019)

这个不能定义多个 `Stretch region` (拉伸区域) 和 `Content Padding`

## .9 图制作

### 9 patch 四个边对应的黑线（黑点）的意义

![ozsaa](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ozsaa.png)

- 1：黑色条位置向下覆盖的区域表示图片横向拉伸时，只拉伸该区域（横向区域）
- 2：黑色条位置向右覆盖的区域表示图片纵向拉伸时，只拉伸该区域（纵向区域）
- 3：黑色条位置向上覆盖的区域表示图片纵向显示内容的区域（在手机上主要是文字区域）
- 4：黑色条位置向左覆盖的区域表示图片横向显示内容的区域（在手机上主要是文字区域）

> Top, left 定义缩放区域；bottom, right 定义内容区域，可以用来代替内边距

## Badge patches

Badge Patches 原因可参考：[关于.9图失效以及.9图不可以错过的细节点](https://blog.csdn.net/z302766296/article/details/104005464)

### 解决

假若图片拉伸区域简单，那么请把 left 和 top 的拉伸像素值设置成 1 px，都可以直接避免 bad patches 的产生。

解释：按照上面 bad patches 产生的原因，因为垂直方向和水平方向的像素值只有 1，所以 group 也只有一个，不能作为横纵向对比。那么他们只剩下一个交叉区域的对比了，但是交叉区域又是 1 个 px 的，所以也没有对比可言，所以就不会产生 bad patches 了。

案例：

![h6dwu](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/h6dwu.png)

解决后：

![od3zu](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/od3zu.png)

## 示例

原图：等级背景图

![slwa0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/slwa0.png)

目标：在不同场景下，图标不会被压贬了

.9 图：

![uiutj](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/uiutj.png)

## 注意

1. 9 patch 图片要放在 `drawable` 中而不是 mipmap 中
2. 左边和上边的线用于限制可以拉伸的区域，右边和下边的线用于限制内容可以显示的区域；
3. 拉伸区域选择没有内容的区域进行拉伸

# 代码创建 `.9` 图

<https://juejin.im/entry/5d82306ff265da03d42fdc1e>
