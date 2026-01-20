---
banner:
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, December 1st 2025, 8:20:35 am
title: appbar_scrolling_view_behavior
author: hacket
categories:
  - AndroidUI
category: 事件
tags: [嵌套滑动]
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
aliases: ["@string/appbar_scrolling_view_behavior"]
linter-yaml-title-alias: "@string/appbar_scrolling_view_behavior"
---

# @string/appbar_scrolling_view_behavior

## @string/appbar_scrolling_view_behavior 是什么？

`@string/appbar_scrolling_view_behavior` 本质上是一个 **Android 资源字符串**，它指向一个具体的 `Behavior` 类：**AppBarLayout.ScrollingViewBehavior**。

- **完整类名：** `com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior`。
- **用途：** ScrollingViewBehavior 是 Material Design 库中的一个 CoordinatorLayout.Behavior 子类，专门用于协调 **顶部应用栏（AppBarLayout）** 和**内容区域**联动滚动效果（如 RecyclerView、NestedScrollView）的关键机制。

### 关键属性详解

关键属性详解

**layout_scrollFlags**（最重要）
app:layout_scrollFlags="scroll|enterAlways|snap"

| 组合      | 代码                                          | 效果             | 使用场景   |
|---------|---------------------------------------------|----------------|--------|
| 基础滚动    | scroll                                      | 向上隐藏，滑到顶才显示    | 不常用的头部 |
| 快速返回    | scroll + enterAlways                        | 向上隐藏，向下立即显示    | 常用工具栏  |
| 快速返回 + 吸附 | scroll + enterAlways + snap                 | 快速返回 + 自动吸附    | 避免中间状态 |
| 折叠保留    | scroll + exitUntilCollapsed                 | 折叠到最小高度保留      | 详情页大图  |
| 分段展开    | scroll + enterAlways + enterAlwaysCollapsed | 先展开到最小高度，再完全展开 | 可扩展工具栏 |

**常用组合方式**

- 组合 1：scroll（基础滚动）

  app:layout_scrollFlags="scroll"

  - 向上滑：隐藏
  - 向下滑：只有滑到顶部才显示

  适用：不常用的工具栏

- 组合 2：scroll|enterAlways（快速返回）

  app:layout_scrollFlags="scroll|enterAlways"

  - 向上滑：隐藏
  - 向下滑：立即显示

  适用：常用的工具栏、搜索框

- 组合 3：scroll|enterAlways|snap（吸附效果）

  app:layout_scrollFlags="scroll|enterAlways|snap"

  - 同上 + 自动吸附到完全显示/隐藏

  适用：避免停留在中间状态

- 组合 4：scroll|exitUntilCollapsed（折叠保留）

```xml
<CollapsingToolbarLayout
      app:layout_scrollFlags="scroll|exitUntilCollapsed">

      <Toolbar
          android:layout_height="?attr/actionBarSize"
          app:layout_collapseMode="pin"/>
  </CollapsingToolbarLayout>
```

  - 折叠时保留 Toolbar 高度

  适用：详情页大图折叠

```
或者用列表形式更清晰：

  layout_scrollFlags 常用组合

  1️⃣ 基础滚动

  app:layout_scrollFlags="scroll"
  - 效果：向上隐藏，滑到顶才显示
  - 场景：不常用的头部

  ---
  2️⃣ 快速返回

  app:layout_scrollFlags="scroll|enterAlways"
  - 效果：向上隐藏，向下立即显示
  - 场景：常用工具栏

  ---
  3️⃣ 快速返回 + 吸附

  app:layout_scrollFlags="scroll|enterAlways|snap"
  - 效果：快速返回 + 自动吸附
  - 场景：避免中间状态

  ---
  4️⃣ 折叠保留

  app:layout_scrollFlags="scroll|exitUntilCollapsed"
  - 效果：折叠到最小高度保留
  - 场景：详情页大图

  ---
  5️⃣ 分段展开

  app:layout_scrollFlags="scroll|enterAlways|enterAlwaysCollapsed"
  - 效果：先展开到最小高度，再完全展开
  - 场景：可扩展工具栏

  ---
  快速记忆口诀

  scroll           → 能滚动（必须有）
  enterAlways      → 向下立即显示
  enterAlwaysCollapsed → 先显示一点
  exitUntilCollapsed   → 折叠时保留一点
  snap             → 自动吸附
```

## 在协调滚动中的核心作用

**三个核心功能：**

1. 初始布局定位
 ┌──────────────┐
 │ AppBarLayout │ ← 200dp 高度
 ├──────────────┤
 │ RecyclerView │ ← 自动从 AppBar 下方开始（Y = 200dp）
 └──────────────┘

2. 滚动联动
 用户向上滑动 → AppBar 折叠 → RecyclerView 自动向上移动填充空间

3. 嵌套滚动协调
 RecyclerView 滚动时 → 先折叠/展开 AppBar → 再滚动自己的内容

**使用：**

```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout>

      <com.google.android.material.appbar.AppBarLayout>
          <Toolbar app:layout_scrollFlags="scroll|enterAlways"/>
      </com.google.android.material.appbar.AppBarLayout>

      <androidx.recyclerview.widget.RecyclerView
          app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
          <!-- ↑ 加这一行就够了 -->

  </androidx.coordinatorlayout.widget.CoordinatorLayout>
```

## 常见使用场景

### 标准折叠工具栏

```xml
<CoordinatorLayout>
      <AppBarLayout>
          <Toolbar 
              app:layout_scrollFlags="scroll|enterAlways"/>
      </AppBarLayout>

      <RecyclerView 
          app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
  </CoordinatorLayout>
```

效果：向上滑动时 Toolbar 隐藏，向下滑动时立即出现

### 带图片的折叠头部（详情页）

```xml
<CoordinatorLayout>
      <AppBarLayout>
          <CollapsingToolbarLayout
              app:layout_scrollFlags="scroll|exitUntilCollapsed">

              <!-- 背景图片：视差滚动 -->
              <ImageView
                  android:layout_height="200dp"
                  app:layout_collapseMode="parallax"/>

              <!-- Toolbar：固定不动 -->
              <Toolbar
                  app:layout_collapseMode="pin"/>

          </CollapsingToolbarLayout>
      </AppBarLayout>

      <NestedScrollView 
          app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
  </CoordinatorLayout>
```

效果：商品详情页、用户资料页的大图折叠效果

### TabLayout + ViewPager

```xml
<CoordinatorLayout>
      <AppBarLayout>
          <Toolbar 
              app:layout_scrollFlags="scroll|enterAlways"/>

          <TabLayout 
              app:layout_scrollFlags="scroll|enterAlways"/>
      </AppBarLayout>

      <ViewPager2 
          app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
  </CoordinatorLayout>
```

效果：滑动页面时，Toolbar 和 TabLayout 一起滚动隐藏

### 搜索框吸顶

```xml
<CoordinatorLayout>
      <AppBarLayout>
          <!-- 可滚动的头部 -->
          <ImageView
              android:layout_height="150dp"
              app:layout_scrollFlags="scroll"/>

          <!-- 固定的搜索框 -->
          <EditText
              android:layout_height="48dp"/>
              <!-- 没有 layout_scrollFlags，不会滚动 -->
      </AppBarLayout>

      <RecyclerView 
          app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
  </CoordinatorLayout>
```

效果：头部图片滚动消失，搜索框固定在顶部

## 工作原理（4 步）

// 1. 声明依赖关系

layoutDependsOn() → " 我依赖 AppBarLayout"

// 2. 调整测量尺寸

onMeasureChild() → 高度 = 屏幕高度 - AppBar 高度

// 3. 调整初始位置  
onLayoutChild() → RecyclerView.top = AppBar.bottom

// 4. 动态跟随偏移

onDependentViewChanged() → AppBar 改变时，RecyclerView 自动调整位置

ScrollingViewBehavior 的本质：

  1. 依赖声明：通过 `layoutDependsOn` 建立与 AppBarLayout 的依赖关系
  2. 测量调整：在 `onMeasureChild` 中计算可用空间（减去 AppBar 高度）
  3. 布局调整：在 `onLayoutChild` 中将内容视图放置在 AppBar 下方
  4. 动态偏移：在 `onDependentViewChanged` 中根据 AppBar 的滚动状态调整内容视图位置
  5. 性能优化：使用 `ViewOffsetHelper` 通过 `offsetTopAndBottom` 而非 layout() 来避免重复布局

  这个设计体现了 关注点分离 和 解耦 的思想：

  - AppBarLayout 只负责自己的滚动行为
  - RecyclerView 只负责内容展示
  - ScrollingViewBehavior 作为中间协调者，处理两者的联动

## 常见问题与解决方案

- 问题 1：RecyclerView 内容被 AppBarLayout 遮挡

```xml
// 原因：忘记添加 ScrollingViewBehavior
<androidx.recyclerview.widget.RecyclerView
  android:layout_width="match_parent"
  android:layout_height="match_parent"/>

  <!-- 缺少 app:layout_behavior -->

// 解决：添加 behavior
<androidx.recyclerview.widget.RecyclerView
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
```

- 问题 2：AppBarLayout 不响应滚动

```xml
// 原因：Toolbar 没有设置 layout_scrollFlags

<com.google.android.material.appbar.AppBarLayout
  android:layout_width="match_parent"
  android:layout_height="wrap_content">

  <androidx.appcompat.widget.Toolbar
	  android:layout_width="match_parent"
	  android:layout_height="?attr/actionBarSize"/>
	  <!-- 缺少 app:layout_scrollFlags -->

</com.google.android.material.appbar.AppBarLayout>

// 解决：添加 scrollFlags

<androidx.appcompat.widget.Toolbar
  android:layout_width="match_parent"
  android:layout_height="?attr/actionBarSize"
  app:layout_scrollFlags="scroll|enterAlways|snap"/>
```

- 问题 3：Fitsystemwindows 冲突

```xml
// 当使用透明状态栏时
<com.google.android.material.appbar.AppBarLayout
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:fitsSystemWindows="true"> ← AppBar 处理状态栏

<androidx.recyclerview.widget.RecyclerView
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:fitsSystemWindows="false"  ← RecyclerView 不处理
  app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
```
