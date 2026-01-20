---
banner:
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Monday, December 1st 2025, 8:32:12 am
title: 嵌套滑动之CoordinatorLayout
author: hacket
categories:
  - AndroidUI
category: 事件
tags: [AndroidX, 事件, 嵌套滑动]
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
aliases: [CoordinatorLayout]
linter-yaml-title-alias: CoordinatorLayout
---

# CoordinatorLayout

CoordinatorLayout(协调者布局) 是在 Google IO/15 大会发布的，遵循 Material 风格，包含在 support Library 中，结合 `AppbarLayout`, `CollapsingToolbarLayout` 等可产生各种炫酷的效果。

## CoordinatorLayout 主要实现以下四个功能

- 处理子控件的依赖下的交互
- 处理子控件的嵌套滑动（里面的方法同 `NestedScrollingParent`）
- 处理子控件的测量与布局
- 处理子控件的事件拦截与响应

而上述四个功能，都依托于 `CoordainatorLayout` 中提供的一个叫做 `Behavior` 的 " 插件 "。Behavior 内部也提供了相应方法来对应这四个不同的功能：

![njhfl](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/njhfl.png)

### 子控件依赖下的交互设计

![zb93p](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/zb93p.png)

当 CoordainatorLayout 中子控件（childView1) 的位置、大小等发生改变的时候，那么在 CoordainatorLayout 内部会通知所有依赖 childView1 的控件，并调用对应声明的 Behavior，告知其依赖的 childView1 发生改变。那么如何判断依赖，接受到通知后如何处理。这些都交由 Behavior 来处理。

### 子控件的嵌套滑动的设计

![q1b8p](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/q1b8p.png)

CoordinatorLayout 实现了 NestedScrollingParent2 接口。那么当事件（scroll 或 fling) 产生后，内部实现了 NestedScrollingChild 接口的子控件会将事件分发给 CoordinatorLayout，CoordinatorLayout 又会将事件传递给所有的 Behavior。

接着在 Behavior 中实现子控件的嵌套滑动。那么再结合上文提到的 Behavior 中嵌套滑动的相关方法，我们可以得到如下流程：

![5cr6n](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/5cr6n.png)

> 相对于 NestedScrolling 机制（参与角色只有子控件和父控件），CoordainatorLayout 中的交互角色更为丰富，在 CoordainatorLayout 下的子控件可以与多个兄弟控件进行交互。

### 子控件的测量、布局、事件的设计

![vt6dg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/vt6dg.png)

因为 CoordainatorLayout 主要负责的是子控件之间的交互，内部控件的测量与布局，就简单的类似 FrameLayout 处理方式就好了。在特殊的情况下，如子控件需要处理宽高和布局的时候，那么交由 Behavior 内部的 onMeasureChild 与 onLayoutChild 方法来进行处理。同理对于事件的拦截与处理，如果子控件需要拦截并消耗事件，那么交由给 Behavior 内部的 onInterceptTouchEvent 与 onTouchEvent 方法进行处理

## Behavior

### 什么是 Behavior？

CoordinatorLayout 作用是把它的 View 连接起来，使它们之间相互很好的配合，通知各个子 View 之间状态的变换。`Behavior` 就是当中的中间媒介。

### Behavior 中的方法？

```java
public static abstract class Behavior<V extends View> {
	public Behavior() {
	}
	public Behavior(Context context, AttributeSet attrs) {
	}
   // 省略了若干方法
}
```

其中有一个泛型，它的作用是指定要使用这个 `Behavior` 的 `View` 的类型，可以是 `Button`、`TextView` 等等。如果希望所有的 `View` 都可以使用则指定泛型为 `View` 即可。

自定义 `Behavior` 可以选择重写以下的几个方法有：

- `onInterceptTouchEvent()`：是否拦截触摸事件
- `onTouchEvent()`：处理触摸事件
- `layoutDependsOn()`：确定使用 `Behavior` 的 `View` 要依赖的 `View` 的类型
- `onDependentViewChanged()`：当被依赖的 `View` 状态改变时回调
- `onDependentViewRemoved()`：当被依赖的 `View` 移除时回调
- `onMeasureChild()`：测量使用 `Behavior` 的 `View` 尺寸
- `onLayoutChild()`：确定使用 `Behavior` 的 `View` 位置
- `onStartNestedScroll()`：嵌套滑动开始（`ACTION_DOWN`），确定 `Behavior` 是否要监听此次事件
- `onStopNestedScroll()`：嵌套滑动结束（`ACTION_UP` 或 `ACTION_CANCEL`）
- `onNestedScroll()`：嵌套滑动进行中，要监听的子 `View` 的滑动事件已经被消费
- `onNestedPreScroll()`：嵌套滑动进行中，要监听的子 `View` 将要滑动，滑动事件即将被消费（但最终被谁消费，可以通过代码控制）
- `onNestedFling()`：要监听的子 `View` 在快速滑动中
- `onNestedPreFling()`：要监听的子 `View` 即将快速滑动

### Behavior 依赖交互

#### CL 下的多个子控件的依赖交互

- public boolean layoutDependsOn(CoordinatorLayout parent, V child, View dependency) { return false; } 定义依赖关系
- public boolean onDependentViewChanged(CoordinatorLayout parent, V child, View dependency) {return false; }
- public void onDependentViewRemoved(CoordinatorLayout parent, V child, View dependency) {}

参数介绍：

- child 某个子 view，配置了 behavior 的 view
- dependency child 依赖的 view

##### layoutDependsOn

boolean layoutDependsOn

至少被调用一次，确定 child 是否依赖 dependency；true 依赖，false 不依赖。

确定一个 child 控件（childView1) 依赖另外一个 dependency 控件 (childView2) 的时候，是通过 layoutDependsOn 这个方法。其中 child 是依赖对象 (childView1)，而 dependency 是被依赖对象 (childView2)，该方法的返回值是判断是否依赖对应 view。如果返回 true。那么表示依赖。反之不依赖。一般情况下，在我们自定义 Behavior 时，我们需要重写该方法。当 layoutDependsOn 方法返回 true 时，后面的 onDependentViewChanged 与 onDependentViewRemoved 方法才会调用。

##### onDependentViewChanged

boolean onDependentViewChanged

当一个 child 控件（childView1) 所依赖的另一个 dependency 控件 (childView2) 位置、大小发生改变的时候，该方法会调用。其中该方法的返回值，是由 childView1 来决定的，如果 childView1 在接受到 childView2 的改变通知后，childView1 的位置或大小发生改变，那么就返回 true,反之返回 false。

##### onDependentViewRemoved

void onDependentViewRemoved

当一个 child 控件（childView1) 所依赖的另一个 dependency 控件 (childView2) 被删除的时候，该方法会调用。

#### app:layout_anchor

不重写 layoutDependsOn 方法，而是在布局使用 xml 中使用 `layout_anchor` 来确定依赖关系，XML 中的 `app:layout_anchor` 定义依赖关系（优先 `layoutDependsOn`）

```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <me.hacket.assistant.samples.google.materialdesigncomponents.coordinatorlayout.behavior.依赖交互layoutDependsOn.DependedView
        android:id="@+id/dependency_view"
        android:layout_width="80dp"
        android:layout_height="40dp"
        android:layout_gravity="center"
        android:background="#f00"
        android:gravity="center"
        android:textColor="#fff"
        android:textSize="18sp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="跟随兄弟"
        app:layout_anchor="@id/dependency_view"
        app:layout_behavior=".samples.google.materialdesigncomponents.coordinatorlayout.behavior.依赖交互layoutDependsOn.BrotherFollowBehavior" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="变色兄弟"
        app:layout_anchor="@id/dependency_view"
        app:layout_behavior=".samples.google.materialdesigncomponents.coordinatorlayout.behavior.依赖交互layoutDependsOn.BrotherChameleonBehavior" />
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

对应的源码：

```java
final void onChildViewsChanged(@DispatchChangeEvent final int type) {
    final int childCount = mDependencySortedChildren.size();
    for (int i = 0; i < childCount; i++) {
        // Check child views before for anchor
        for (int j = 0; j < i; j++) {
            final View checkChild = mDependencySortedChildren.get(j);

            if (lp.mAnchorDirectChild == checkChild) {
                offsetChildToAnchor(child, layoutDirection);
            }
        }
    }
}
```

#### 原理

在 dependency View 的 onTouchEvent 方法中，我们根据手势修改了 DependedView 的位置，我们都知道当子控件位置、大小发生改变的时候，会导致父控件重绘，也就是会调用 onDraw 方法。而在 `CoordinatorLayout#onAttachedToWindow` 中使用了 ViewTreeObserver，并设置了绘制前监听器 `OnPreDrawListener`

```java
// CoordinatorLayout
public class CoordinatorLayout extends ViewGroup implements NestedScrollingParent2, NestedScrollingParent3 {
    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (mNeedsPreDrawListener) {
            if (mOnPreDrawListener == null) {
                mOnPreDrawListener = new OnPreDrawListener();
            }
            final ViewTreeObserver vto = getViewTreeObserver();
            vto.addOnPreDrawListener(mOnPreDrawListener);
        }
    }
}
class OnPreDrawListener implements ViewTreeObserver.OnPreDrawListener {
    @Override
    public boolean onPreDraw() {
        onChildViewsChanged(EVENT_PRE_DRAW);
        return true;
    }
}
```

现在看 `onChildViewsChanged()`

```java
// CoordinatorLayout
final void onChildViewsChanged(@DispatchChangeEvent final int type) {
    // ...
    for (int i = 0; i < childCount; i++) { // 获取内部的所有的子控件
        final View child = mDependencySortedChildren.get(i);
        final LayoutParams lp = (LayoutParams) child.getLayoutParams();
        // ...
        // Check child views before for anchor。是否设置了anchor
        for (int j = 0; j < i; j++) {
            final View checkChild = mDependencySortedChildren.get(j);
            if (lp.mAnchorDirectChild == checkChild) {
                offsetChildToAnchor(child, layoutDirection);
            }
        }
        // ...
        for (int j = i + 1; j < childCount; j++) {
            final View checkChild = mDependencySortedChildren.get(j);
            final LayoutParams checkLp = (LayoutParams) checkChild.getLayoutParams();
            final Behavior b = checkLp.getBehavior(); // 获取Behavior
            if (b != null && b.layoutDependsOn(this, checkChild, child)) { // 调用当前子控件的Behavior的layoutDependsOn方法判断是否依赖
                if (type == EVENT_PRE_DRAW && checkLp.getChangedAfterNestedScroll()) {
                    // If this is from a pre-draw and we have already been changed
                    // from a nested scroll, skip the dispatch and reset the flag
                    checkLp.resetChangedAfterNestedScroll();
                    continue;
                }
                final boolean handled;
                switch (type) {
                    case EVENT_VIEW_REMOVED:
                        // EVENT_VIEW_REMOVED means that we need to dispatch
                        // onDependentViewRemoved() instead
                        b.onDependentViewRemoved(this, checkChild, child);
                        handled = true;
                        break;
                    default:
                        // Otherwise we dispatch onDependentViewChanged()
                        handled = b.onDependentViewChanged(this, checkChild, child);
                        break;
                }
                if (type == EVENT_NESTED_SCROLL) {
                    // If this is from a nested scroll, set the flag so that we may skip
                    // any resulting onPreDraw dispatch (if needed)
                    checkLp.setChangedAfterNestedScroll(handled);
                }
            }
        }
    }
}
```

程序中使用了一个名为 mDependencySortedChildren 的集合，通过遍历该集合，我们可以获取集合中控件的 LayoutParam，得到 LayoutParam 后，我们可以继续获取相应的 Behavior。并调用其 layoutDependsOn 方法找到所依赖的控件，如果找到了当前控件所依赖的另一控件，那么就调用 Behavior 中的 onDependentViewChanged 方法。

看到这里，多个控件依赖交互的原理已经非常清楚了，在 CoordinatorLayout 下，控件 A 发生位置、大小改变时，会导致 CoordinatorLayout 重绘。而 CoordinatorLayout 又设置了绘制前的监听。在该监听中，会遍历 mDependencySortedChildren 集合，找到依赖 A 控件的其他控件。并通知其他控件 A 控件发生了改变。当其他控件收到该通知后。就可以做自己想做的效果啦。

### Behavior 实现嵌套滑动的原理与过程

![47cyd](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/47cyd.png)

#### CoordinatorLayout 的事件传递过程

Behavior 的嵌套滑动其实都是围绕 CoordinatorLayout 的的 onInterceptTouchEvent 与 onTouchEvent 方法展开的。

先从 onInterceptTouchEvent 方法讲起：

```java
// CoordinatorLayout
public boolean onInterceptTouchEvent(MotionEvent ev) {
    final int action = ev.getActionMasked();
    // ...
    final boolean intercepted = performIntercept(ev, TYPE_ON_INTERCEPT);
    // ...
    return intercepted;
}
```

在 CoordinatorLayout 的的 onInterceptTouchEvent 方法中，内部其实是调用了 performIntercept 来处理是否拦截事件

```java
// CoordinatorLayout
private boolean performIntercept(MotionEvent ev, final int type) {
    boolean intercepted = false;
    boolean newBlock = false;

    MotionEvent cancelEvent = null;

    final int action = ev.getActionMasked();
    //获取内部的控件集合，并按照z轴进行排序
    final List<View> topmostChildList = mTempList1;
    getTopSortedChildren(topmostChildList);

    // 获取所有子view
    final int childCount = topmostChildList.size();
    for (int i = 0; i < childCount; i++) {
        final View child = topmostChildList.get(i);

        //获取子类的Behavior
        final LayoutParams lp = (LayoutParams) child.getLayoutParams();
        final Behavior b = lp.getBehavior();

        if ((intercepted || newBlock) && action != MotionEvent.ACTION_DOWN) {
            if (b != null) {
                // ...
                switch (type) {
                    case TYPE_ON_INTERCEPT:
                        //调用拦截方法
                        b.onInterceptTouchEvent(this, child, cancelEvent);
                        break;
                    case TYPE_ON_TOUCH:
                        b.onTouchEvent(this, child, cancelEvent);
                        break;
                }
            }
            continue;
        }

        if (!intercepted && b != null) {
            switch (type) {
                case TYPE_ON_INTERCEPT:
                   //调用behavior的onInterceptTouchEvent，如果拦截就拦截
                    intercepted = b.onInterceptTouchEvent(this, child, ev);
                    break;
                case TYPE_ON_TOUCH:
                    intercepted = b.onTouchEvent(this, child, ev);
                    break;
            }
            //注意这里，比较重要找到第一个behavior对象，并赋值
            if (intercepted) {
                mBehaviorTouchView = child;
            }
        }
        // ...
    }
    // ...
    return intercepted; // 是否拦截与CoordinatorLayout中子view的behavior有关
}
```

1. 获取内部的控件集合（topmostChildList），并按照 z 轴进行排序
2. 循环遍历 topmostChildList，获取控件的 Behavior，并调用 Behavior 的 onInterceptTouchEvent 方法判断是否拦截事件，如果拦截事件，则事件又会交给 CoordinatorLayout 的 onTouchEvent 方法处理。
3. 有多个 behavior 都拦截的话，只会取第一个 behavior 来处理

一般情况下，Behavior 的 onInterceptTouchEvent 方法基本都是返回 false。那么 CoordinatorLayout 就不会拦截事件，根据事件传递机制，事件就传递到了子控件中去了。如果我们的子控件实现是了 NestedScrollingChild 接口（如 RecyclerView 或 NestedScrollView),并且在 onTouchEvent 方法调用了相关嵌套滑动 API，那么再根据嵌套滑动机制，会调用实现了 NestedScrollingParent2 接口的父控件的相应方法。又因为 CoordinatorLayout 实现了 NestedScrollingParent2 接口。那么就又回到了嵌套滑动机制了。

#### CoordinatorLayout 嵌套滑动机制

首先看 `onStartNestedScroll()`（子控件调用 startNestedScroll 时回调 CoordinatorLayout）：

```java
// CoordinatorLayout
public boolean onStartNestedScroll(View child, View target, int axes, int type) {
    boolean handled = false;
    final int childCount = getChildCount();
    for (int i = 0; i < childCount; i++) { // 循环遍历所有子view
        final View view = getChildAt(i);
        if (view.getVisibility() == View.GONE) {
            // If it's GONE, don't dispatch // 如果当前控件隐藏，则不传递嵌套滑动
            continue;
        }
        final LayoutParams lp = (LayoutParams) view.getLayoutParams();
        final Behavior viewBehavior = lp.getBehavior();
        if (viewBehavior != null) { // 有behavior
            // 调用behavior的onStartNestedScroll
            final boolean accepted = viewBehavior.onStartNestedScroll(this, view, child,
                    target, axes, type);
            handled |= accepted; // 只要有一个behavior接受了嵌套滑动，代表CoordinatorLayout就能处理嵌套滑动事件了
            lp.setNestedScrollAccepted(type, accepted); // 调用LayoutParams的setNestedScrollAccepted，保存是否是touch类型
        } else {
            lp.setNestedScrollAccepted(type, false);
        }
    }
    return handled;
}
```

只要有一个 behavior 接受了嵌套滑动，代表 CoordinatorLayout 就能处理嵌套滑动事件了，那么就会走 `CoordinatorLayout#onNestedScrollAccepted`：

```java
// CoordinatorLayout
public void onNestedScrollAccepted(View child, View target, int nestedScrollAxes, int type) {
    mNestedScrollingParentHelper.onNestedScrollAccepted(child, target, nestedScrollAxes, type);
    mNestedScrollingTarget = target;

    final int childCount = getChildCount();
    for (int i = 0; i < childCount; i++) { // 遍历所有子view
        final View view = getChildAt(i);
        final LayoutParams lp = (LayoutParams) view.getLayoutParams();
        if (!lp.isNestedScrollAccepted(type)) { // 判断类型是否接受
            continue;
        }

        final Behavior viewBehavior = lp.getBehavior();
        if (viewBehavior != null) { // 有behavior
            viewBehavior.onNestedScrollAccepted(this, view, child, target,
                    nestedScrollAxes, type); // 调用behavior的onNestedScrollAccepted
        }
    }
}
```

同样在 `CoordinatorLayout#onNestedScrollAccepted` 方法中，也会调用所有控件的 Behavior 的 onNestedScrollAccepted 方法，需要注意的是，在该方法中增加了 `if(!lp.isNestedScrollAccepted(type))` 的判断，也就是说只有 Behavior 的 onStartNestedScroll 方法返回 true 的时候（因为在 setNestedScrollAccepted 保存了类型，否则这里会返回 false），该方法才会执行。

接下来看 `CoordinatorLayout#onNestedPreScroll`，子 view 第一次问 CoordinatorLayout 是否处理嵌套滑动事件：

```java
// CoordinatorLayout
public void onNestedPreScroll(View target, int dx, int dy, int[] consumed, int  type) {
    int xConsumed = 0;
    int yConsumed = 0;
    boolean accepted = false;
    final int childCount = getChildCount();
    for (int i = 0; i < childCount; i++) {
        final View view = getChildAt(i);
        if (view.getVisibility() == GONE) {
            // If the child is GONE, skip...
            continue;
        }
        final LayoutParams lp = (LayoutParams) view.getLayoutParams();
        if (!lp.isNestedScrollAccepted(type)) {
            continue;
        }
        final Behavior viewBehavior = lp.getBehavior();
        if (viewBehavior != null) {
            // mBehaviorConsumed子view消费的dx和dy
            mBehaviorConsumed[0] = 0;
            mBehaviorConsumed[1] = 0;
            // behavior处理子view第一次给的嵌套滑动距离
            viewBehavior.onNestedPreScroll(this, view, target, dx, dy, mBehaviorConsumed, type);
            
            // 取所有子view的behaviordx消费的最大dx距离
            xConsumed = dx > 0 ? Math.max(xConsumed, mBehaviorConsumed[0])
                    : Math.min(xConsumed, mBehaviorConsumed[0]);
            // 取所有子view的behaviordx消费的最大dy距离
            yConsumed = dy > 0 ? Math.max(yConsumed, mBehaviorConsumed[1])
                    : Math.min(yConsumed, mBehaviorConsumed[1]);
            accepted = true;
        }
    }
    // 将所有behavior处理的最大dx和dy距离赋值给consumed
    consumed[0] = xConsumed;
    consumed[1] = yConsumed;
    if (accepted) { 
        // 有behavior接受了嵌套滑动事件，调用onChildViewsChanged通知依赖对应view的改变
        onChildViewsChanged(EVENT_NESTED_SCROLL);
    }
}
```

如果有剩余的距离，子 view 自己处理后，如果还有剩余的距离，子 view 就会调用 `CoordinatorLayout#onNestedScroll` 方法继续询问 CoordinatorLayout 处理：

```java
// CoordinatorLayout
private final int[] mBehaviorConsumed = new int[2];
public void onNestedScroll(@NonNull View target, int dxConsumed, int dyConsumed,
        int dxUnconsumed, int dyUnconsumed, @ViewCompat.NestedScrollType int type,
        @NonNull int[] consumed) {
    final int childCount = getChildCount();
    boolean accepted = false;
    int xConsumed = 0;
    int yConsumed = 0;

    for (int i = 0; i < childCount; i++) {
        final View view = getChildAt(i);
        if (view.getVisibility() == GONE) { // GONE的子view不处理
            // If the child is GONE, skip...
            continue;
        }
        final LayoutParams lp = (LayoutParams) view.getLayoutParams();
        if (!lp.isNestedScrollAccepted(type)) { // behavior的onStartNestedScroll未返回false return
            continue;
        }

        final Behavior viewBehavior = lp.getBehavior();
        if (viewBehavior != null) {
            // behavior消费的dx和dy
            mBehaviorConsumed[0] = 0;
            mBehaviorConsumed[1] = 0;

            // 第二次交给behavior来处理嵌套滑动
            viewBehavior.onNestedScroll(this, view, target, dxConsumed, dyConsumed,
                    dxUnconsumed, dyUnconsumed, type, mBehaviorConsumed);

            // 第二次消费子view传递过来未处理的dx和dy距离
            xConsumed = dxUnconsumed > 0 ? Math.max(xConsumed, mBehaviorConsumed[0])
                    : Math.min(xConsumed, mBehaviorConsumed[0]);
            yConsumed = dyUnconsumed > 0 ? Math.max(yConsumed, mBehaviorConsumed[1])
                    : Math.min(yConsumed, mBehaviorConsumed[1]);
            accepted = true;
        }
    }
    consumed[0] += xConsumed;
    consumed[1] += yConsumed;
    if (accepted) { // 通知依赖的view变化了
        onChildViewsChanged(EVENT_NESTED_SCROLL);
    }
}
```

在 CoordinatorLayout 下的比较重要的嵌套滑动方法基本上讲解完毕了。余下的 `onNestedPreFling` 与 `onNestedFling` 方法都大同小异。

### Behavior 的 measure

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    // ...
    final int childCount = mDependencySortedChildren.size();
    for (int i = 0; i < childCount; i++) {
        final View child = mDependencySortedChildren.get(i);
        final LayoutParams lp = (LayoutParams) child.getLayoutParams();
        int childWidthMeasureSpec = widthMeasureSpec;
        int childHeightMeasureSpec = heightMeasureSpec;

        final Behavior b = lp.getBehavior();
        // 调用Behavior的测量方法，返回true即behavior自主测量，false为默认测量
        if (b == null || !b.onMeasureChild(this, child, childWidthMeasureSpec, keylineWidthUsed,
                childHeightMeasureSpec, 0)) {
            onMeasureChild(child, childWidthMeasureSpec, keylineWidthUsed, childHeightMeasureSpec, 0);
        }

        widthUsed = Math.max(widthUsed, widthPadding + child.getMeasuredWidth() +
                lp.leftMargin + lp.rightMargin);

        heightUsed = Math.max(heightUsed, heightPadding + child.getMeasuredHeight() +
                lp.topMargin + lp.bottomMargin);
        childState = View.combineMeasuredStates(childState, child.getMeasuredState());
    }

    final int width = View.resolveSizeAndState(widthUsed, widthMeasureSpec,
            childState & View.MEASURED_STATE_MASK);
    final int height = View.resolveSizeAndState(heightUsed, heightMeasureSpec,
            childState << View.MEASURED_HEIGHT_STATE_SHIFT);
    setMeasuredDimension(width, height);
}
public void onMeasureChild(View child, int parentWidthMeasureSpec, int widthUsed,
        int parentHeightMeasureSpec, int heightUsed) {
    measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed,
            parentHeightMeasureSpec, heightUsed);
}
```

子控件进行遍历，调用子控件的 `Behavior#onMeasureChild` 方法，判断是否自主测量，如果为 true，那么则以子控件的测量为准，返回 false 系统自己测量。

当子控件测量完毕后，会通过 widthUsed 和 heightUsed 这两个变量来保存 CoordinatorLayout 中子控件最大的尺寸。这两个变量的值，最终将会影响 CoordinatorLayout 的宽高。

### Behavior 的 layout

```java
// CoordinatorLayout
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    final int layoutDirection = ViewCompat.getLayoutDirection(this);
    final int childCount = mDependencySortedChildren.size();
    for (int i = 0; i < childCount; i++) {
        final View child = mDependencySortedChildren.get(i);
        if (child.getVisibility() == GONE) {
            // If the child is GONE, skip...
            continue;
        }

        final LayoutParams lp = (LayoutParams) child.getLayoutParams();
        final Behavior behavior = lp.getBehavior();

        //  获取子控件的Behavior方法，并调用其onLayoutChild方法判断子控件是否需要自己布局
        if (behavior == null || !behavior.onLayoutChild(this, child, layoutDirection)) {
            onLayoutChild(child, layoutDirection);
        }
    }
}
public void onLayoutChild(@NonNull View child, int layoutDirection) {
    final LayoutParams lp = (LayoutParams) child.getLayoutParams();
    if (lp.checkAnchorChanged()) {
        throw new IllegalStateException("An anchor may not be changed after CoordinatorLayout"
                + " measurement begins before layout is complete.");
    }
    if (lp.mAnchorView != null) {
        layoutChildWithAnchor(child, lp.mAnchorView, layoutDirection);
    } else if (lp.keyline >= 0) {
        layoutChildWithKeyline(child, lp.keyline, layoutDirection);
    } else {
        layoutChild(child, layoutDirection);
    }
}
```

在对子 View 进行遍历的时候，CoordinatorLayout 有主动向子控件的 Behavior 传递布局的要求，如果调用 `Behavior#onLayoutChild` 子控件返回了 true，则以它的结果为准；false 的话否将调用 `onLayoutChild` 方法默认布局。

## 已知的 behavior 效果

### @string/appbar_scrolling_view_behavior（Android 原生自带）

com.google.android.material.appbar.AppBarLayout$ScrollingViewBehavior

见: [[appbar_scrolling_view_behavior]]

### @string/bottom_sheet_behavior

com.google.android.material.bottomsheet.BottomSheetBehavior

### appbarlayout-spring-behavior（帮助 AppbarLayout 滚动回弹效果）

![muukg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/43kke.gif)

### behavior-learn

<https://github.com/iielse/behavior-learn>

CoordinatorLayout 自定义 Behavior 高仿美团商家详情界面 实现页面内容复杂联动效果

### CoordinatorLayout 有用的方法

1. getDependencies 获取 child 依赖的 view 的集合（child behavior 配置 layoutDependsOn=true 或配置了 layout_anchor）

```java
public List<View> getDependencies(@NonNull View child) {
    final List<View> dependencies = mChildDag.getOutgoingEdges(child);
    mTempDependenciesList.clear();
    if (dependencies != null) {
        mTempDependenciesList.addAll(dependencies);
    }
    return mTempDependenciesList;
}
```

2. getDependents 获取依赖 child 的 view 的集合

```java
public List<View> getDependents(@NonNull View child) {
    final List<View> edges = mChildDag.getIncomingEdges(child);
    mTempDependenciesList.clear();
    if (edges != null) {
        mTempDependenciesList.addAll(edges);
    }
    return mTempDependenciesList;
}
```

注意：两个方法不必要同时调用，如果后面调用的方法会将 mTempDependenciesList 清空，导致 2 个都为 empty

```kotlin
val dependencies = parent.getDependencies(child)
val dependents = parent.getDependents(child)
// 如果child没有被其他view依赖，那么这两个返回值都会变成empty
```

## CoordinatorLayout 总结

1. behavior 只能作用于 Coordinatorlayout 直接子 view 吗？
是

2. 在 xml 引用自定义 Behavior 时，一定要声明 2 个参数的构造函数。不然在程序的编译过程中，会提示知道不到相应的 Behavior。

## CoordinatorLayout 问题

### CoordinatorLayout 下的 ScrollView 显示不完整

把 ScrollView 改成 NestedScrollview 就好了

## Ref

- [x] 自定义 View 事件篇进阶篇 (三)-CoordinatorLayout 与 Behavior<https://juejin.cn/post/6844903904623214599>
- [x] 自定义 View 事件之进阶篇 (四)- 自定义 Behavior 实战<https://juejin.cn/post/6844903904820330510>

### 博客

- [Android Design Support Library: 学习CoordinatorLayout](http://www.cnblogs.com/yuanchongjie/p/4997134.html)
- [拦截一切的CoordinatorLayout](https://github.com/bboyfeiyu/android-tech-frontier/blob/master/issue-43/%E9%80%9A%E8%BF%87CoordinatorLayout%E7%9A%84Behavior%E6%8B%A6%E6%88%AA%E4%B8%80%E5%88%87.md)
- [CoordinatorLayout 布局的使用方式](http://www.wangchenlong.org/2016/03/22/1603/228-coordinator-layout-first/)
- [掌握 Coordinator Layout](https://www.aswifter.com/2015/11/12/mastering-coordinator/)
- [CoordinatorLayoutDemos](https://github.com/sungerk/CoordinatorLayoutDemos)

### 推荐的项目

- [**smooth-app-bar-layout**](https://github.com/henrytao-me/smooth-app-bar-layout) 原生的 appBarLayout 滑动起来不顺畅，而且向下 Fling 时无法到达 AppBarLayout 扩大的状态，推荐使用这个。
- [**coordinated-effort**](https://github.com/devunwired/coordinated-effort)
