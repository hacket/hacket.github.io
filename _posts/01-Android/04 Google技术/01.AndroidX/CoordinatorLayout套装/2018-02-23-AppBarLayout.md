---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Wednesday, January 29th 2025, 7:10:10 pm
title: AppBarLayout
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX]
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
aliases: [AppbarLayout]
linter-yaml-title-alias: AppbarLayout
---

# AppbarLayout

## AppbarLayout 介绍、用途

AppBarLayout，顾名知意，就是用来给 AppBar 布局的容器，是 LinearLayout 的子类。而 AppBar 就包含我们通常所知道的 ActionBar，Toolbar。

AppBarLayout 继承自 LinearLayout，布局方向为垂直方向。所以你可以把它当成垂直布局的 LinearLayout 来使用。AppBarLayout 是在 LinearLayou 上加了一些材料设计的概念，它可以让你定制当**_ 某个可滚动 View_**的滚动手势发生变化时，其内部的子 View 实现何种动作。

**请注意**：上面提到的**_ 某个可滚动 View_**，可以理解为某个 ScrollView。怎么理解上面的话呢？就是说，当某个 ScrollView 发生滚动时，你可以定制你的 " 顶部栏 " 应该执行哪些动作（如跟着一起滚动、保持不动等等）。

Material App bar:<br /><https://material.google.com/layout/structure.html#structure-app-bar>

## 使用

### 步骤

1. `AppBarLayout` 需要作为 `CoordinatorLayout` 的直接子 View。如果在其他的 ViewGroup 中，大部分功能失效。<br />内部的子 View 通过在布局中加 `app:layout_scrollFlags` 设置执行的动作，或者代码 `AppBarLayout.LayoutParams.setScrollFlags(int)`

```xml
app:layout_scrollFlags
```

2. `AppBarLayout` 需要一个可滚动的兄弟 View 用来告知什么时候滚动。已经存在一个 Behavior:`AppBarLayout.ScrollingViewBehavior`

### 属性

- scroll 所有想滚动出屏幕的 view 都需要设置这个 flag，没有设置这个 flag 的 view 将被固定在屏幕顶部。
- enterAlways 实现 quick return 效果，当向下移动时，立即显示 View(如 Toolbar)
- exitUntilCollapsed 向上滚动时收缩 View，当可以固定 Toolbar 一直在上面
- enterAlwaysCollapsed 当你的 View 已经设置 minHeight 属性又使用此标志时，你的 View 只能以最小的高度进入，只有当滚动视图到达顶部时才扩大的完整高度

> enterXXX 表示进入，指向下滑动（手指从上往下滑动）；exitXXX 表示退出，指向上滑动（手指从下往上滑动）

#### scroll

View 会跟随滚动事件一起发生移动。就是当指定的 ScrollView 发生滚动时，该 View 也跟随一起滚动，就好像这个 View 也属于这个 ScrollView 一样；向上滑动过程中停下来会保持那个状态；当已经完全滚动上去时，再向下滚动 ScrollView 需要 ScrollView 滚动到最上面时该 View 才会跟随 ScrollView 滚动<br />![n0cp5](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/n0cp5.webp)<br />**scroll 小结**<br />往上跟着滑动退出，往下到顶时进入

#### enterAlways

当 ScrollView 往下滚动时，该 View 会直接往下滚动。而不用考虑 ScrollView 是否在滚动。和 scroll 的区别是，scroll 需要 ScrollView 滚动到顶再往下滚动，该 View 才会滚动下来，而 enterAlways 是只要 ScrollView 你往下滚动，而不关心 ScrollView 是否到顶了该 View 都会滚动。需要配合 scroll 使用，要不然该 View 滚动不上去。<br />![481y1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/481y1.webp)<br />**enterAlways 小结**<br />往上给 scroll，只要往下就进入

#### exitUntilCollapsed

设置为 `exitUntilCollapsed` 的 View，当这个 View 要往上逐渐 `消逝` 时，会一直往上滑动，直到剩下的高度达到它的最小高度后，再响应 ScrollView 的内部滑动事件，直到 ScrollView 向上滑动到底，该 View 一直都只出现最小高度。其实就是在 ScrollView 往上滑动时，首先是 View 把滑动事件夺走，由 View 去执行滑动，直到滑动最小高度后，再把这个事件还回去，让 ScrollView 内部去上滑。需要配合 scroll 使用，要不然该 View 滚动不上去。<br />![64cav](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/64cav.webp)<br />**exitUntilCollapsed 小结**<br />往上先自己，到最小高度给他人，后保持最小高度；往下 `scroll` 到顶再进入

#### enterAlwaysCollapsed

`enterAlwaysCollapsed` 是 `enterAlways` 的附加选项，一般跟 `enterAlways` 一起使用，它是指，在 View 往下出现时，首先是 `enterAlways` 效果，当 View 的高度达到最小高度时，View 就暂停不去往下滑动，直到 ScrollView 滑动到顶部时，View 再继续往下滑动，直到滑到 View 的顶部结束。需要配合 scroll 使用，要不然该 View 滚动不上去。<br />![exh5d](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/exh5d.webp)

**enterAlwaysCollapsed 小结**<br />往上给 scroll，往下先 `enterAlwasy` 自己，然后他人，然后再自己进入。

#### snap

当滚动结束时，如果 View 只有部分可见，它将会自动滑动到最近的边界（完全可见或完全隐藏）

### AppbarLayout 去掉阴影

用 `app:elevation="0dp"` 而不是 `android:elevation="0dp"`

### 将 AppBarLayout 与 ScrollView 关联起来

AppBarLayout 与 ScrollView 之间动作 " 相互依赖 "。把 ScrollView 和 AppBarLayout 作为 CoordinateLayout 的子 View，然后编写一个 Behavior，在这个 Behavior 里面判断当前的操作是应该让 ScrollView 时刻保持在 AppBarLayout 之下（即只要改变 AppBarLayout 的位置就可以一起滑动），还是应该让 ScrollView 内部滚动而不让 AppBarLayout 位置发生变化等等这些需求，都是可以在 Behavior 里面处理的。你可以去针对你的 ScrollView 编写 Behavior。然而，我们的 AppBarLayout 事先的功能比较复杂，如果我们自己去定义这样的效果，代码非常复杂，还要考虑很多方面，好在 Android 帮我们写好啦，我们直接用就是了，这个 ScrollView 就是 NestedScrollView，请注意，它并没有继承 ScrollView，它继承的是 FrameLayout，但是它实现的效果把它可以看成是 ScrollView。<br />把 NestedScrollView 放入到我们的 layout 文件里面就可以啦，`app:layout_behavior="@string/appbar_scrolling_view_behavior"`，它就是指定 Behavior 的，`appbar_scrolling_view_behavior` 对应的类的名称是：`android.support.design.widget.AppBarLayout$ScrollingViewBehavior`。

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <!-- AppBarLayout，作为CoordinatorLayout的子类 -->
    <android.support.design.widget.AppBarLayout
            android:id="@+id/activity_appbar_layout"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

        <android.support.v7.widget.Toolbar
                app:layout_scrollFlags="scroll|enterAlways|enterAlwaysCollapsed"
                android:id="@+id/toolbar"
                android:title="AppbarLayout Demo"
                android:background="?attr/colorPrimary"
                android:layout_width="match_parent"
                android:minHeight="?attr/actionBarSize"
                android:layout_height="200dp">

        </android.support.v7.widget.Toolbar>

        <TextView
                android:text="This is a test for appbarlayout"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>

        <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入密码"
                android:ems="10"/>
    </android.support.design.widget.AppBarLayout>

    <android.support.v4.widget.NestedScrollView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:layout_behavior="@string/appbar_scrolling_view_behavior">
        <!-- Your scrolling content -->

        <TextView
                android:id="@+id/tv_content"
                android:textSize="16sp"
                android:textColor="@android:color/holo_blue_dark"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>
    </android.support.v4.widget.NestedScrollView>

</android.support.design.widget.CoordinatorLayout>
```

### AppBarLayout.OnOffsetChangedListener

`fitsSystemWindows` 对 AppBarLayout 滚动的影响，如果设置了 `fitsSystemWindows` 为 true，那么 AppBarLayout 会把 statusBar 状态栏给忽略掉；设置为 false 那么 AppbarLayout 会考虑 statusBar 的高度。

## 注意

### CoordinatorLayout 配合 AppBarLayout，AppBarLayout 不显示

CoordinatorLayout 配合 AppBarLayout，AppBarLayout 不显示。<br />`app:layout_behavior` 属性作用位置不对，作用于 AppBarLayout 下的内容直接布局容器上

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <LinearLayout
            android:orientation="vertical"
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <View android:id="@+id/fake_statusbar_view"
              android:layout_width="match_parent"
              android:layout_height="@dimen/statusbar_view_height"
              android:background="@color/colorPrimary"/>

        <android.support.design.widget.CoordinatorLayout
                android:id="@+id/home_content"
                android:layout_below="@id/fake_statusbar_view"
                android:layout_width="match_parent"
                android:layout_height="match_parent">

            <android.support.design.widget.AppBarLayout
                    app:elevation="0dp"
                    android:id="@+id/abl_app_bar"
                    android:orientation="vertical"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content">

                <com.qiushibaike.inews.widget.CommonToolbar
                        app:layout_scrollFlags="scroll|enterAlways|snap"
                        android:id="@+id/common_toolbar"
                        app:toolbar_mode="center_image"
                        android:background="@color/colorPrimary"
                        app:center_titleIcon="@drawable/ic_home_title_logo"
                        android:layout_width="match_parent"
                        android:layout_height="35dp">
                </com.qiushibaike.inews.widget.CommonToolbar>

            </android.support.design.widget.AppBarLayout>

            <LinearLayout
                    android:id="@+id/fl_home_realtabcontent"
                    app:layout_behavior="@string/appbar_scrolling_view_behavior"
                    android:orientation="vertical"
                    android:layout_width="match_parent"
                    android:layout_height="match_parent">

                <com.qiushibaike.inews.widget.PagerSlidingTabStrip
                        android:layout_width="match_parent"
                        android:layout_height="35dp"
                        android:layout_below="@id/fake_statusbar_view"
                        android:id="@+id/psts_category_tab_indicator"/>

                <View android:id="@+id/divider"
                      style="@style/Divider.Horizontal.Blue"
                      android:layout_below="@id/psts_category_tab_indicator"/>

                <!--放app:layout_behavior="@string/appbar_scrolling_view_behavior"这里AppBarLayout不显示-->
                <com.qiushibaike.inews.widget.CustomViewPager
                        android:layout_below="@+id/divider"
                        android:layout_width="match_parent"
                        android:layout_height="match_parent"
                        android:id="@+id/vp_category_tab_content"/>
            </LinearLayout>

        </android.support.design.widget.CoordinatorLayout>
    </LinearLayout>

    <com.qiushibaike.common.widget.InewsImageView
            android:id="@+id/iv_new_user_float_img"
            android:src="@drawable/ic_new_user_red_packet_float_window"
            android:visibility="gone"
            android:layout_alignParentRight="true"
            android:layout_alignParentBottom="true"
            android:layout_marginBottom="58dp"
            android:layout_marginRight="@dimen/margin_small"
            android:layout_width="42.5dp"
            android:layout_height="45dp"/>

</RelativeLayout>
```

## Reference

- [ ] 玩转 AppBarLayout，更酷炫的顶部栏<br /><http://www.jianshu.com/p/d159f0176576>
