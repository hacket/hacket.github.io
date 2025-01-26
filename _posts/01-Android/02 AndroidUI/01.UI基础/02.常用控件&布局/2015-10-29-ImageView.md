---
date_created: Tuesday, October 29th 2015, 12:08:52 am
date_updated: Sunday, January 26th 2025, 7:45:23 pm
title: ImageView
author: hacket
categories:
  - AndroidUI
category: ImageView
tags: [ImageView]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期四, 九月 26日 2024, 3:07:00 下午
date updated: 星期一, 一月 6日 2025, 9:54:08 晚上
image-auto-upload: true
feed: show
format: list
aliases: [常用属性]
linter-yaml-title-alias: 常用属性
---

# 常用属性

## 设置透明

如果 ImageView 控件使用的【src】属性设置图片，则用【setImageAlpha】设置透明度，如果使用的【background】属性设置图片，则用【getBackground().setAlpha】设置透明度

## adjustViewBounds

当为 true 时，文档中说是调整 ImageView 的界限来保持纵横比不变，但这并不意味 ImageView 的纵横比就一定和图像的纵横比相同

- 如果设置的 layout_width 与 layout_height 都是固定值，那么设置 adjustViewBounds 是没有作用的，ImageView 就一直是设定宽和高
- 如果设置的 layout_width 与 layout_height 都是 wrap_content 属性,那么设置 adjustViewBounds 也没啥用，因为 ImageView 将始终与图片拥有相同的宽高比（但是并不是相同的宽高值，通常都会放大一些）
- 如果两者中有一个是固定值，一个是 wrap_content，比如 `layout_width="666px"`,`layout_height="wrap_content"` 时，ImageView 的宽将始终是 666px，而高就有所变化了：
  - 当图片的宽小于 666px 时，layout_height 将与图片的高相同，即图片不会缩放，完整显示在 ImageView 控件中，ImageView 高度与图片实际高度相同。图片没有占满 ImageView，ImageView 中有空白。
  - 当图片的宽大于等于 666px 时，此时 ImageView 将与图片拥有相同的宽高比，因此 ImageView 的 layout_height 值为：666 除以图片的宽高比。比如图片是 500X500 的，那么 layout_height 是 666。图片将保持宽高比缩放，完整显示在 ImageView 中，并且完全占满 ImageView。

案例：

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <TextView
        style="@style/LabelText"
        android:text="图片500x312" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 固定尺寸" />

    <ImageView
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽高都wrap_content" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽wrap_content，高固定" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="100dp"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽和高都match_parent" />

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

</LinearLayout>
```

![ekw89](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261945820.png)

# ShapeableImageView (API21)

## 什么是 ShapeableImageView？

是 ImageView 的一个子类、通过提供的 Shape 绘制 bitmap

## ShapeableImageView 属性

- strokeWidth 描边宽度
- strokeColor 描边颜色
- shapeAppearance ShapeableImageView 的形状外观覆盖样式
- shapeAppearanceOverlay 同上，叠加层

# ImageFilterView、ImageFilterButton

## ImageFilterView、ImageFilterButton 属性

> 带有圆角、简单滤镜的 ImageView 和 ImageButton(saturation、contrast、warmth、warmth)

支持的滤镜或效果如下：

|              | 介绍                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| altSrc       | Provide and alternative image to the src image to allow cross fading (altSrc 提供的资源将会和 src 提供的资源通过 crossfade 属性形成交叉淡化效果，默认 crossfade=0 及 altSrc 引用的资源不可见，取值 0-1)                      |
| round        | 圆角具体值                                                                                                                                                                      |
| roundPercent | 数组类型 0-1 的小数，根据数值的大小会使图片在方形和圆形之间按比例过度                                                                                                                                        |
| warmth       | This adjust the apparent color temperature of the image.1=neutral, 2=warm, .5=cold 调节色温                                                                                    |
| brightness   | Sets the brightness of the image. 0 = black, 1 = original, 2 = twice as bright 调节亮度                                                                                        |
| saturation   | Sets the saturation of the image. 0 = grayscale, 1 = original, 2 = hyper saturated 调节饱和度                                                                                   |
| contrast     | This sets the contrast. 1 = unchanged, 0 = gray, 2 = high contrast 调节对比度                                                                                                   |
| crossfade    | Set the current mix between the two images. 0=src 1= altSrc image                                                                                                          |
| overlay      | Defines whether the alt image will be faded in on top of the original image or if it will be crossfaded with it. Default is true. Set to false for semitransparent objects |

```xml
<androidx.constraintlayout.utils.widget.ImageFilterView
    android:id="@+id/imageFilterView"
    ...
    android:background="@color/imageBg"
    android:src="@drawable/th"
    app:saturation="2"
    app:brightness="2"
    app:warmth="3"
    app:contrast="2"
    app:crossfade="2"
    app:roundPercent="1"
    app:overlay="true"
/>

<androidx.constraintlayout.utils.widget.ImageFilterButton
    android:id="@+id/imageFilterButton"
    ...
    app:srcCompat="@drawable/th"
    android:background="@color/imageBg"
    app:saturation="0"
    app:brightness="0"
    app:warmth="5"
    app:contrast="1"
    app:crossfade="1"
    app:roundPercent="0.3"
    app:round="16dp"
    app:overlay="true"
/>
```

![jv0r0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261945822.png)
