---
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:39:52 pm
title: SwipeRefreshLayout
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
aliases: [SwipeRefreshLayout]
linter-yaml-title-alias: SwipeRefreshLayout
---

# [SwipeRefreshLayout](https://developer.android.com/reference/android/support/v4/widget/SwipeRefreshLayout.html)

## SwipeRefreshLayout 案例

```java
// 通过 setEnabled(false) 禁用下拉刷新
// swipeRefreshLayout.setEnabled(false);

// 设置手指在屏幕下拉多少距离会触发下拉刷新
swipeRefreshLayout.setDistanceToTriggerSync(300);

// 设置下拉出现小圆圈是否是缩放出现，出现的位置，最大的下拉位置
swipeRefreshLayout.setProgressViewOffset(true, 50, 200);

// 设置下拉圆圈的大小，两个值 LARGE， DEFAULT
swipeRefreshLayout.setSize(SwipeRefreshLayout.LARGE);

// 设定下拉圆圈的背景
swipeRefreshLayout.setColorSchemeResources(android.R.color.holo_blue_bright,
        android.R.color.holo_green_light, android.R.color.holo_orange_light, android.R.color.holo_red_light);

// 设置手势下拉刷新的监听
swipeRefreshLayout.setOnRefreshListener(new OnRefreshListener() {
    // 刷新动画开始后回调到此方法
    @Override
    public void onRefresh() {
        LogUtil.i("onRefresh...");
        new Handler().postDelayed(new Runnable() {
            public void run() {
                data.add(0, "hacket add item_" + new Random(100).nextInt());
                adapter.notifyDataSetChanged();

                swipeRefreshLayout.setRefreshing(false);
            }
        }, 5000);
    }
});
```

## WebView 下拉刷新与 SwipeRefreshLayout 事件冲突解决

### 问题

会发现网页无法上拉，往上滑动就会触发下拉刷新控件的 refresh 事件

### 事件冲突解决

关于两个控件的冲突问题，网络上有不少解决办法，有的是自定义 SwipeRefreshLayout 重写 onTouchEvent 方法；有的是重写 WebView 的 scroll 监听。

现在我们通过 SwipeRefreshLayout 的 setOnChildScrollUpCallback 来实现。

```java

swipeRefreshLayout.setOnChildScrollUpCallback(new SwipeRefreshLayout.OnChildScrollUpCallback() {

    @Override

    public boolean canChildScrollUp(@NonNull SwipeRefreshLayout parent, @Nullable View child) {

        if (mWebView != null) {

            return mWebView.getScrollY() > 0;

        }

        return true;

    }

});
```

> 说明：canChildScrollUp 方法返回的 true/false 表示子视图是否可返回顶部，我们改成 webView.getScrollY() > 0 后表示 webView 到顶部时返回 false，refreshLayout 可接收到下拉动作，触发 refresh 事件。

此时上拉、下拉都没问题了。

OnChildScrollUpCallback 接口就一个 canChildScrollUp 方法，返回是否可滚动。

在上述实现过程中，我们判断 WebView 的状态：

1. 在顶部时，返回 false，表示子视图不可滚动，refreshLayout 接收到滑动事件，引出滑动视图和调用滑动刷新方法；
2. 不在顶部时，webView.getScrollY() > 0，返回 true，表示子视图可滚动，refreshLayout 中 canChildScrollUp() 返回 true，刷新控件不再处理滑动问题，所以没有调用滑动刷新方法。

## SwipeRefreshLayout 和 RecyclerView 的冲突解决

> 当你是自定义 item 布局时，必须要重写 OnChildScrollUpCallback() 方法–原文说明：Override this if the child view is a custom view.

在做项目的时候，大部分的机型是没有什么问题的，但是在一款华为的手机上，就发现了一个问题：滑动冲突了。在往下滑的时候，RecyclerView 还没有到达顶部就触发了下拉刷新的动作。这里产生的具体原因未知，得去看源码才知道。

解决方法是，在 swipeRefreshLayout 类的内部，实现了 OnChildScrollUpCallback() 方法，这个方法返回值指示 swipeRefreshLayout 内部的 view 有没有可能向上滚动，返回 true 表示可以滚动，返回 false 表示不可滚动，触发刷新。如果里面的控件是自定义的，就需要重写这个方法。API 提供了 setOnChildScrollUpCallback() 方法给我们重写

```java
swipeRefreshLayout.setOnChildScrollUpCallback(new SwipeRefreshLayout.OnChildScrollUpCallback() {
        @Override
        public boolean canChildScrollUp(SwipeRefreshLayout parent, @Nullable View child) {
            if (mRecyclerView == null) {
                return false;
            }
            LinearLayoutManager linearLayoutManager = (LinearLayoutManager) mRecyclerView.getLayoutManager();
            return linearLayoutManager.findFirstCompletelyVisibleItemPosition() != 0;
        }
    });
```

在这里我们先获得 RecyclerView 的布局管理器 LinearLayoutManager 这里使用的是线性布局，还有网格布局 GridLayoutManager 和瀑布流 StaggeredGridLayoutManager 布局管理器，可以很方便的实现绚丽的各种界面。

然后 findFirstCompletelyVisibleItemPosition() 返回的位置是可见区域第一个全部可见的 item 的位置，这里注意：是整个 item 全部出现了才算。如果返回的位置不等于 0，结果为 true，那么 swipeRefreshLayout 里面的 RecyclerView 标志为可滚动的，RecyclerView 就可以往上滚动。当到了第一个全部 item 可见的时候，返回的 position 为 0，结果 false，那么说明 RecyclerView 已经到顶了，那么 RecyclerView 就标志位不可滚动的状态，继续下拉就会触发 swipeRefreshLayout 的刷新机制了。

# Ref

- [ ] SwipeRefreshLayout 源码分析<br /><https://github.com/hanks-zyh/SwipeRefreshLayout>
