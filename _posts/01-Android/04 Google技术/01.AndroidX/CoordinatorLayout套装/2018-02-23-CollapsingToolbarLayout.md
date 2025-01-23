---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:22:23 pm
title: CollapsingToolbarLayout
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
aliases: [CollapsingToolbarLayout]
linter-yaml-title-alias: CollapsingToolbarLayout
---

# CollapsingToolbarLayout

## 介绍

`CollapsingToolbarLayout` 是用来对 `Toolbar` 进行再次包装的 `ViewGroup`，主要是用于实现折叠（其实就是看起来像伸缩~）的 App Bar 效果。它需要放在 `AppBarLayout` 布局里面，并且作为 `AppBarLayout` 的直接子 `View`。`CollapsingToolbarLayout` 主要包括几个功能：

- Collapsing title 折叠 Title<br />当布局内容全部显示出来时，title 是最大的，但是随着 View 逐步移出屏幕顶部，title 变得越来越小。你可以通过调用 `setTitle` 函数来设置 title。
- Content scrim 内容纱布<br />根据滚动的位置是否到达一个阀值，来决定是否对 View" 盖上纱布 "。可以通过 setContentScrim(Drawable) 来设置纱布的图片。
- Status bar scrim 状态栏纱布<br />根据滚动位置是否到达一个阀值决定是否对状态栏 " 盖上纱布 "，你可以通过 `setStatusBarScrim(Drawable)` 来设置纱布图片，但是只能在 `LOLLIPOP` 设备上面有作用。
- Parallax scrolling children 视差滚动子 View<br />子 View 可以选择在当前的布局是否以 " 视差 " 的方式来跟随滚动（其实就是让这个 View 的滚动的速度比其他正常滚动 View 的速度稍微慢一点）。<br />将布局参数 `app:layout_collapseMode` 设为 `parallax`，以及 `CollapsingToolbarLayout.LayoutParams.setParallaxMultiplier(float)`
- Pinned position children 固定子 View 位置<br />子 View 可以选择是否在全局空间上固定位置，这对于 Toolbar 非常有用，当布局移动时，可以将 Toolbar 固定位置不受移动的影响。<br />将布局参数 `app:layout_collapseMode` 设为 `pin`

## 使用

### 注意

- 里面定义的 Toolbar，及其他的 header 区域，不可在外面在套一层布局，要作为 CollapsingToolbarLayout 的直接子 View

### 属性

- contentScrim<br />设置当完全 CollapsingToolbarLayout 折叠 (收缩) 后 Toolbar 的背景颜色。
- expandedTitleMarginStart、expandedTitleMarginEnd、expandedTitleGravity<br />设置扩张时候 (还没有收缩时)title 向左/向右填充的距离、title 的 gravity
- layout_collapseMode 折叠模式
- pin 设置为这个模式时，当 CollapsingToolbarLayout 完全收缩后，Toolbar 还可以保留在屏幕上
- parallax 设置为这个模式时，在内容滚动时，CollapsingToolbarLayout 中的 View（比如 ImageView) 也可以同时滚动，实现视差滚动效果，通常和 layout_collapseParallaxMultiplier(设置视差因子) 搭配使用
- layout_collapseParallaxMultiplier<br />搭配 `layout_collapseMode` 使用，当设置为 1 时，背景 View 固定不移动 (只有 `parallax` 有效)；设置为 0 时，和 pin 效果一样<br />![](http://img.blog.csdn.net/20150716100244080#id=qdet6&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
- setTitle、setExpandedTitleColor、setCollapsedTitleTextColor<br />使用 CollapsingToolbarLayout 时必须把 title 设置到 CollapsingToolbarLayout 上，设置到 Toolbar 上不会显示<br />该变 title 的字体颜色：
- 扩张时候的 title 颜色：mCollapsingToolbarLayout.setExpandedTitleColor();
- 收缩后在 Toolbar 上显示时的 title 的颜色：mCollapsingToolbarLayout.setCollapsedTitleTextColor();
- 这个颜色的过度变化其实 CollapsingToolbarLayout 已经帮我们做好，它会自动的过度，比如我们把收缩后的 title 颜色设为绿色<br />![](http://img.blog.csdn.net/20150716102438894#id=QxPSv&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:fitsSystemWindows="false"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <!-- AppBarLayout，作为CoordinatorLayout的子类 -->
    <android.support.design.widget.AppBarLayout
            android:id="@+id/activity_appbar_layout"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

        <android.support.design.widget.CollapsingToolbarLayout
                android:id="@+id/collapsing_toolbar"
                app:layout_scrollFlags="scroll|exitUntilCollapsed"
                app:contentScrim="@color/material_blue_500"
                app:expandedTitleMarginStart="10dp"
                app:expandedTitleGravity="left|bottom"
                app:expandedTitleTextAppearance="@android:style/TextAppearance.Widget.TextView"
                app:expandedTitleMarginEnd="50dp"
                app:toolbarId="@id/toolbar"
                android:layout_width="match_parent"
                android:layout_height="wrap_content">

            <ImageView
                    android:id="@+id/main.backdrop"
                    android:layout_width="match_parent"
                    android:layout_height="200dp"
                    android:scaleType="centerCrop"
                    android:src="@drawable/girl"
                    app:layout_collapseParallaxMultiplier="0"
                    app:layout_collapseMode="parallax"/>

            <android.support.v7.widget.Toolbar
                    app:layout_collapseMode="pin"
                    android:id="@+id/toolbar"
                    android:title="AppbarLayout Demo"
                    android:background="#44FFFFFF"
                    android:titleTextColor="@android:color/black"
                    android:navigationIcon="@drawable/ic_back"
                    android:layout_width="match_parent"
                    app:titleMarginStart="50dp"
                    android:layout_height="?attr/actionBarSize">
                <ImageView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:scaleType="centerCrop"
                        android:src="@drawable/ic_back"
                        app:layout_collapseMode="parallax"/>
            </android.support.v7.widget.Toolbar>

        </android.support.design.widget.CollapsingToolbarLayout>

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
