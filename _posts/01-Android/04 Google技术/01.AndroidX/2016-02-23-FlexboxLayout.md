---
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Wednesday, January 29th 2025, 10:11:11 pm
title: FlexboxLayout
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, Google]
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [FlexboxLayout]
linter-yaml-title-alias: FlexboxLayout
---

# FlexboxLayout

<https://github.com/google/flexbox-layout>

## FlexboxLayout 介绍

FlexboxLayout 是去年 Google I/O 上开源的一个布局控件，使得 Android 里的 CSS Flexible Layout 模块也能拥有同样强大的功能。

FlexboxLayout 可以理解成一个高级版的 LinearLayout，因为两个布局都把子 view 按顺序排列。两者之间最大的差别在于 FlexboxLayout 具有换行的特性。

![atco4](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/atco4.png)

- flex item<br />FlexBoxLayout 的的 child view
- main axis 主轴<br />主要的 axis，新元素排列方向为主轴，一般是 left 到 right 摆放 item，从左到右：main start→main end
- cross axis .副轴<br />次要的 axis，与主轴垂直方向为副轴，从上到下：cross start→cross end

### FlexboxLayout 和 FlexboxLayoutManager

两种方式对比，FlexboxLayoutManager 部分属性不支持：<br /><https://github.com/google/flexbox-layout#supported-attributesfeatures-comparison>

## FlexboxLayout 自身属性

### app:flexDirecition 主轴排列方向

> 子元素在主轴的排列方向

1. row 默认值，主轴为水平方向，起点在左，从左到右
2. row_reverse 和 row 属性相反，主轴为水平方向，从右到左，起点在右端
3. column 主轴为竖直方向，起点在上端，从上到下
4. column_reverse 和 column 相反，主轴为竖直方向，起点在下方从下到上

### app:flexWrap 换行方式

> 控制 flexbox 是否是单行还是多行；控制 cross axis 的方向。

1. nowrap 不换行。（如果位置不足会压缩子元素）  (default for FlexboxLayout)
2. wrap 按正常方向换行，cross axis 从上到下。(default for FlexboxLayoutManager)
3. wrap_reverse 按反方向换行，cross axis 从下到上。(not supported by FlexboxLayoutManager)

### app:justifyContent 主轴对齐模式

> 控制主轴上元素的对齐方式

1. flex_start （默认值）左对齐。
2. flex_end 右对齐。
3. center 居中对齐
4. space_between 两端对齐，相邻两元素间隔相等（首尾 Item 紧贴边界，Item 平分内部空隙）
5. space_around 相邻 item 两侧间隔相等，两侧 item 元素和边框的间隔是两个 item 间隔的一半（item 之间的间隔=2 倍 item 到边框的间隔）
6. space_evenly 同 space_around，只是 item 直接的间隔和 item 到边框的间隔是一样的

### alignItems 副轴对齐模式

> 控制子元素在副轴的排列方向（副轴垂直主轴的方向为副轴），主轴水平方向、副轴竖直方向

1. stretch stretch 默认值，如果子元素未设置高度或设为 auto，将占满整个父容器的高度
2. flex_start 副轴的起点对齐。
3. flex_end 副轴的终点对齐。
4. center 副轴的中点对齐。
5. baseline  Item 的第一行文字的基线对齐。（注意: 如果有的 Item 没有文本基线，那么它的基线默认是左上角。）

> alignItems 从 v2.0 开始，默认值改为 flex_start

![e0dym](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/e0dym.png)

### alignContent 多根轴对齐模式

> 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

1. flex_start 与交叉轴的起点对齐
2. flex_end 与交叉轴的终点对齐
3. center：与交叉轴的中点对齐
4. space_between：与交叉轴两端对齐，轴线之间的间隔平均分布。
5. space_around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
6. stretch 默认值，充满副轴的高度，只有副轴排列 app:alignItems="stretch" 时，app:alignContent="stretch" 才会生效，<br />即 app:alignItems="stretch" 且 app:alignContent="stretch"；貌似 height 要设置成 match_parent 才有效

> alignContent 从 v2.0 开始，默认值改为 flex_start

alignContent 和 justifyContent 其实里面的属性值都是一样的，一个是设置主轴的对齐方式，一个是设置多个轴的对齐方式，通俗的讲可以理解为比如是项目是水平换行，alignContent 就是设置垂直方向的对齐方式，justifyContent 就是设置水平方向的对齐方式。现在我们想让每个项目距离上右下左的距离是一样的，需要把 alignContent 和 justifyContent 都设置为 space_around 就可以了：

```xml
app:alignContent="space_around"
app:justifyContent="space_around"
```

### 其他属性

#### showDividerHorizontal

两端对齐，轴线之间的间隔相等

控制显示水平方向的分割线，值为 none | beginning | middle | end 其中的一个或者多个

#### dividerDrawableHorizontal

设置 Flex 轴线之间水平方向的分割线。或 flexDirection 设置为 `column` 或 `column_rebase`

#### showDividerVertical

控制显示垂直方向的分割线，值为 none | beginning | middle | end 其中的一个或者多个。

#### dividerDrawableVertical

设置子元素垂直方向的分割线。或 flexDirection 设置为 `column` 或 `column_rebase`

#### showDivider

控制显示水平和垂直方向的分割线，值为 none | beginning | middle | end 其中的一个或者多个。

#### dividerDrawable

设置水平和垂直方向的分割线，但是注意,如果同时和其他属性使用，比如为 Flex 轴、子元素设置了 `justifyContent=”space_around”` 、`alignContent=”space_between”` 等等。可能会看到意料不到的空间，因此应该避免和这些值同时使用。

Example of putting both vertical and horizontal dividers.

- res/drawable/divider.xml:

```xml
<shape xmlns:android="http://schemas.android.com/apk/res/android">
  <size
      android:width="8dp"
      android:height="12dp" />
  <solid android:color="#44A444" />
</shape>
```

- res/layout/content_main.xml:

```xml
<com.google.android.flexbox.FlexboxLayout xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:alignContent="flex_start"
  app:alignItems="flex_start"
  app:flexWrap="wrap"
  app:showDivider="beginning|middle"
  app:dividerDrawable="@drawable/divider" >

  <TextView
      style="@style/FlexItem"
      android:layout_width="220dp"
      android:layout_height="80dp"
      android:text="1" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="120dp"
      android:layout_height="80dp"
      android:text="2" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="160dp"
      android:layout_height="80dp"
      android:text="3" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="80dp"
      android:layout_height="80dp"
      android:text="4" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="100dp"
      android:layout_height="80dp"
      android:text="5" />
```

- 效果:<br />![lgrj8](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/lgrj8.png)

## FlexboxLayout 子元素属性

### layout_order 自身排列权重

子元素默认是按照元素的位置先后排列的，但是 `layout_order` 的值可以控制元素的排列顺序，按照数字的大小排列；给子元素加上该属性后，FlexboxLayout 将按负值在前，正值在后，按照从小到大的顺序依次排列子元素。

> 从小到大依次排序，负数在前，正数在后。

### layout_flexGrow 子元素瓜分剩余空间比重

元素放大比例，默认为 0，类似于 LinearLayout 中的 layout_weight 属性，根据比例等分，如果有一个子元素的 layout_flexGrow 是一个正值，那么会将全部剩余空间分配给这个 Item,如果有多个 Item 这个属性都为正值，那么剩余空间的分配按照 layout_flexGrow 定义的比例等分。

> 属性值越大，表示瓜分剩余空间比重越大。

### layout_flexShrink 空间不足时子元素缩小比重

子元素缩小比例，默认为 1，当子元素多行时无效，

如果所有子元素的 layout_flexShrink 值为 1，空间不足时，都等比缩小，如果有一个为 0，其他为 1，空间不足时，为 0 的不缩小，负值无效。

### layout_alignSelf 自身对齐方式

子元素的对齐方式， 允许单个子元素有与其他子元素不一样的对齐方式，可覆盖 alignItems 属性。默认值为 auto，表示继承父元素的 alignItems 属性，如果没有父元素，则等同于 stretch。

1. auto (default) 继承父元素 alignItems 属性，父元素 alignItems 属性不存在则默认 stretch
2. flex_start 同 alignItems 的 flex_start 属性
3. flex_end 同 alignItems 的 flex_end 属性
4. center 同 alignItems 的 cente 属性
5. baseline 同 alignItems 的 baseline 属性
6. stretch 同 alignItems 的 stretch 属性

### layout_flexBasisPercent 自身占主轴空间百分比

子元素占父容器长度的百分比，覆盖了子元素自身的 layout_width 或 layout_height，前提是父容器的长度或者宽度设置了值，否则无效

> 属性值填 "80%" 之类的。

### layout_minWidth / layout_minHeight

强制限定子元素的最小宽度或者最小高度，即使 layout_flexShrink 缩小比例，也会保证不小于子元素宽度或者高度的最小值

### layout_maxWidth / layout_maxHeight

强制限定子元素的最大宽度或者最大高度，即使 layout_flexGrow 放大比例，也会保证不大于子元素宽度或者高度的最大值

### layout_wrapBefore

强制换行，即使父容器设置了 flex_wrap=nowrap,依然将当前元素换到下一行的第一个元素显示。

## Flexbox 存在的问题

### RV 中嵌套 RV FlexboxLayoutManager，最后一个 item 显示不出来

```kotlin
private fun generateLabelLayoutManager(): RecyclerView.LayoutManager? {
    val layoutManager = FlexboxLayoutManager(context)
    layoutManager.flexDirection = FlexDirection.ROW
    layoutManager.flexWrap = FlexWrap.WRAP
    layoutManager.alignItems = AlignItems.FLEX_START
    layoutManager.justifyContent = JustifyContent.FLEX_START
    return layoutManager
}
```

## Ref

- [ ] 关于 Google 新的适配方式 ---FlexboxLayout

<https://blog.csdn.net/dazhaodai/article/details/72126813>
