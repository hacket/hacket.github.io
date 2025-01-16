---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# [SwipeRefreshLayout](https://developer.android.com/reference/android/support/v4/widget/SwipeRefreshLayout.html)

## SwipeRefreshLayout案例

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

## WebView下拉刷新与SwipeRefreshLayout事件冲突解决

### 问题

会发现网页无法上拉，往上滑动就会触发下拉刷新控件的refresh事件

### 事件冲突解决：

关于两个控件的冲突问题，网络上有不少解决办法，有的是自定义SwipeRefreshLayout重写onTouchEvent方法；有的是重写WebView的scroll监听。

现在我们通过SwipeRefreshLayout的setOnChildScrollUpCallback来实现。

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

> 说明：canChildScrollUp方法返回的true/false表示子视图是否可返回顶部，我们改成webView.getScrollY() > 0后表示webView到顶部时返回false，refreshLayout可接收到下拉动作，触发refresh事件。

此时上拉、下拉都没问题了。

OnChildScrollUpCallback 接口就一个canChildScrollUp方法，返回是否可滚动。

在上述实现过程中，我们判断WebView的状态：

1. 在顶部时，返回false，表示子视图不可滚动，refreshLayout接收到滑动事件，引出滑动视图和调用滑动刷新方法；
2. 不在顶部时，webView.getScrollY() > 0，返回true，表示子视图可滚动，refreshLayout中canChildScrollUp()返回true，刷新控件不再处理滑动问题，所以没有调用滑动刷新方法。

## SwipeRefreshLayout和RecyclerView的冲突解决

> 当你是自定义item布局时，必须要重写OnChildScrollUpCallback()方法–原文说明：Override this if the child view is a custom view.

在做项目的时候，大部分的机型是没有什么问题的，但是在一款华为的手机上，就发现了一个问题：滑动冲突了。在往下滑的时候，RecyclerView还没有到达顶部就触发了下拉刷新的动作。这里产生的具体原因未知，得去看源码才知道。

解决方法是，在swipeRefreshLayout类的内部，实现了OnChildScrollUpCallback()方法，这个方法返回值指示swipeRefreshLayout内部的view有没有可能向上滚动，返回true表示可以滚动，返回false表示不可滚动，触发刷新。如果里面的控件是自定义的，就需要重写这个方法。API提供了setOnChildScrollUpCallback()方法给我们重写

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

在这里我们先获得RecyclerView的布局管理器LinearLayoutManager这里使用的是线性布局，还有网格布局GridLayoutManager和瀑布流StaggeredGridLayoutManager布局管理器，可以很方便的实现绚丽的各种界面。

然后findFirstCompletelyVisibleItemPosition()返回的位置是可见区域第一个全部可见的item的位置，这里注意：是整个item全部出现了才算。如果返回的位置不等于0，结果为true，那么swipeRefreshLayout里面的RecyclerView标志为可滚动的，RecyclerView就可以往上滚动。当到了第一个全部item可见的时候，返回的position为0，结果false，那么说明RecyclerView已经到顶了，那么RecyclerView就标志位不可滚动的状态，继续下拉就会触发swipeRefreshLayout的刷新机制了。

# Ref

- [ ] SwipeRefreshLayout 源码分析<br /><https://github.com/hanks-zyh/SwipeRefreshLayout>
