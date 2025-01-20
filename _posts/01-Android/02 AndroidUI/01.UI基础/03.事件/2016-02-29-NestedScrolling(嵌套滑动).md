---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:21:51 pm
title: NestedScrolling(嵌套滑动)
author: hacket
categories:
  - AndroidUI
category: 事件
tags: [嵌套滑动, 事件]
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
date created: 2024-05-30 16:04
date updated: 2024-12-24 00:28
aliases: [嵌套滑动 (NestedScrolling 机制)]
linter-yaml-title-alias: 嵌套滑动 (NestedScrolling 机制)
---

# 嵌套滑动 (NestedScrolling 机制)

## 嵌套滑动介绍

### 传统事件机制处理嵌套滑动的局限性

在传统的事件分发机制中，当一个事件产生后，它的传递过程遵循如下顺序:`父控件->子控件`，事件总是先传递给父控件，当父控件不对事件拦截的时候，那么当前事件又会传递给它的子控件。

同一事件序列，父控件需要拦截事件，那么子控件是没有机会接受该事件的

```xml
<NestedTraditionLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <ImageView
        android:id="@+id/iv_head_image"
        android:layout_width="match_parent"
        android:layout_height="200dp" />
    <com.google.android.material.tabs.TabLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />
    <androidx.viewpager.widget.ViewPager
       android:id="@+id/view_pager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</NestedTraditionLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688194584993-997265d4-61e3-49f4-aa23-a952cfd838eb.png#averageHue=%235394df&clientId=ufeb6a1d2-1bec-4&from=paste&height=480&id=u8bb8bcb7&originHeight=960&originWidth=646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=284971&status=done&style=none&taskId=ue064f258-2077-4fa8-b7e5-f6d8a8100ef&title=&width=323)![](http://note.youdao.com/yws/res/62450/31F2D5FE64354F959A9648DACD9BB653#id=Ug1KG&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

- 实现的效果：

1. headerView 未消失前，手指从下向上滑动时，先隐藏 headView，然后再滑动 viewpager
2. headerView 消失后，手指从上往下滑动时，先展开 headView，然后再滑动 viewPager

- 传统的解决缺陷：

1. headerView 未消失前，手指从下向上滑动时，先隐藏 headView 后，此时事件是由 NestedTraditionLayout 拦截了，后续的 move 事件无法交给 viewpager 处理，导致在一个事件序列隐藏 headerview 后，viewpager 是无法滑动的，只能等待下一个事件序列
2. 同样的问题

- NestedScrolling 解决的问题<br />一个事件序列中，父控件拦截 view 后子控件无法获取事件，实现连贯的嵌套滑动

### 基本原理

嵌套滑动机制可以理解为一个约定, 原生的支持嵌套滑动的控件都是依据这个约定来实现嵌套滑动的, 例如 CoordinatorLayout, 所以如果你自定义的控件也遵守这个约定, 那么就可以跟原生的控件进行嵌套滑动了.

嵌套滑动的基本原理是在子控件接收到滑动一段距离的请求时, 先询问父控件是否要滑动, 如果滑动了父控件就通知子控件它消耗了一部分滑动距离, 子控件就只处理剩下的滑动距离, 然后子控件滑动完毕后再把剩余的滑动距离传给父控件。通过这样的嵌套滑动机制, 在一次滑动操作过程中

> 父控件和子控件都有机会对滑动操作作出响应, 尤其父控件能够分别在子控件处理滑动距离之前和之后对滑动距离进行响应。

这解决了传统事件分发机制一个事件序列不连贯的问题。

### 默认处理逻辑

1. 虽然 View 和 ViewGroup(SDK21 之后) 本身就具有嵌套滑动的相关方法, 但是默认情况是是不会被调用, 因为 View 和 ViewGroup 本身不支持滑动。

> 本身不支持滑动的控件即使有嵌套滑动的相关方法也不能进行嵌套滑动。

让控件支持嵌套滑动条件：

1. 首先要控件类具有嵌套滑动的相关方法, 要么仅支持 SDK21 之后版本, 要么实现对应的接口, 为了兼容低版本, 更常用到的是后者。
2. 默认的情况是不会支持滑动的, 所以控件要在合适的位置主动调起嵌套滑动的方法 (由 childView 调用)。

## 嵌套滑动相关类

子控件 child 是嵌套滑动的发起者

- 父控件需要实现的接口与使用到的类：

```
NestedScrollingParent（接口）
NestedScrollingParent2（也是接口并继承NestedScrollingParent）
NestedScrollingParentHelper（类）
```

- 子控件需要实现的接口与使用到的类：

```
NestedScrollingChild（接口）
NestedScrollingChild2（也是接口并继承NestedScrollingChild）
NestedScrollingChildHelper（类）
```

### NestedScrollingChild 子控件实现

都需要一个 final 的变量 NestedScrollingChildHelper，来代理操作，实现兼容。

#### 1. void setNestedScrollingEnabled(boolean enabled) 设置 child 开启或关闭嵌套滑动

```java
/**
 * 设置当前子控件是否支持嵌套滑动，如果不支持，那么父控件是不能够响应嵌套滑动的；在`nested scroll`过程中关闭嵌套滑动相当于调用`stopNestedScroll()`停止嵌套滑动
 *
 * @param enabled true 支持
 */
public void setNestedScrollingEnabled(boolean enabled) {}
```

#### 2. boolean isNestedScrollingEnabled() 当前 child 是否开启了嵌套滑动

```java
/**
 * 当前子控件是否支持嵌套滑动
 */
public boolean isNestedScrollingEnabled()
```

#### 3. boolean startNestedScroll([@ScrollAxis](/ScrollAxis) int axes) 开启滑动

```java
/**
 * 开启一个嵌套滑动（起始方法, 主要作用是找到接收滑动距离信息的外控件）；每增加scroll，caller应该调用`dispatchNestedPreScroll`，parent应该消费部分delta，caller调整scroll
 *
 * @param axes 支持的嵌套滑动方法，分为水平方向，竖直方向，或不指定
 * @return 如果返回true, 表示当前子控件已经找了一起嵌套滑动的view
 */
public boolean startNestedScroll(int axes)
```

#### 4. boolean dispatchNestedPreScroll(int dx, int dy, int[] consumed, int[] offsetInWindow); 在内控件 (child) 处理滑动前把滑动信息分发给外控件。返回 true，parent 消费了部分或全部 delta

```java
/**
 * 在子控件滑动前，将事件分发给父控件，由父控件判断消耗多少
 *
 * @param dx             水平方向嵌套滑动的子控件想要变化的距离 dx<0 向右滑动 dx>0 向左滑动
 * @param dy             垂直方向嵌套滑动的子控件想要变化的距离 dy<0 向下滑动 dy>0 向上滑动
 * @param consumed       子控件传给父控件数组，用于存储父控件水平与竖直方向上消耗的距离，consumed[0] 水平消耗的距离，consumed[1] 垂直消耗的距离
 * @param offsetInWindow 子控件在当前window的偏移量
 * @return 如果返回true, 表示父控件已经消耗了
 */
public boolean dispatchNestedPreScroll(int dx, int dy, int[] consumed, int[] offsetInWindow)
```

#### 5. boolean dispatchNestedScroll(int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int[] offsetInWindow)  在内控件 (child) 处理完滑动后把剩下的滑动距离信息分发给外控件 (parent)

```java
/**
 * 当父控件消耗事件后，子控件处理后，又继续将事件分发给父控件, 由父控件判断是否消耗剩下的距离。
 *
 * @param dxConsumed     水平方向嵌套滑动的子控件滑动的距离(消耗的距离)
 * @param dyConsumed     垂直方向嵌套滑动的子控件滑动的距离(消耗的距离)
 * @param dxUnconsumed   水平方向嵌套滑动的子控件未滑动的距离(未消耗的距离)
 * @param dyUnconsumed   垂直方向嵌套滑动的子控件未滑动的距离(未消耗的距离)
 * @param offsetInWindow 子控件在当前window的偏移量
 * @return 如果返回true, 表示父控件又继续消耗了
 */
public boolean dispatchNestedScroll(int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, @Nullable int[] offsetInWindow)
```

#### 6. void stopNestedScroll() 结束方法, 主要作用就是清空嵌套滑动的相关状态

```java
/**
 * 子控件停止嵌套滑动
 */
public void stopNestedScroll()
```

#### 7. boolean dispatchNestedPreFling(float velocityX, float velocityY) child 子控件产生 fling 先询问 parent 是否处理

```java
/**
 * 当子控件产生fling滑动时，判断父控件是否处拦截fling，如果父控件处理了fling，那子控件就没有办法处理fling了。
 *
 * @param velocityX 水平方向上的速度 velocityX > 0  向左滑动，反之向右滑动
 * @param velocityY 竖直方向上的速度 velocityY > 0  向上滑动，反之向下滑动
 * @return 如果返回true, 表示父控件拦截了fling
 */
public boolean dispatchNestedPreFling(float velocityX, float velocityY) {}
```

#### 8. boolean dispatchNestedFling(float velocityX, float velocityY, boolean consumed)

```java
/**
 * 当父控件不拦截子控件的fling, 那么子控件会调用该方法将fling，传给父控件进行处理
 *
 * @param velocityX 水平方向上的速度 velocityX > 0  向左滑动，反之向右滑动
 * @param velocityY 竖直方向上的速度 velocityY > 0  向上滑动，反之向下滑动
 * @param consumed  子控件是否可以消耗该fling，也可以说是子控件是否消耗掉了该fling
 * @return 父控件是否消耗了该fling
 */
public boolean dispatchNestedFling(float velocityX, float velocityY, boolean consumed)
```

#### 9. boolean hasNestedScrollingParent() child 子控件是否拥有嵌套滑动的 parent 控件

```java
/**
 * 判断当前子控件是否拥有嵌套滑动的父控件
 */
public boolean hasNestedScrollingParent() {}
```

### NestedScrollingParent 父控件实现

> 因为 child 控件是发起者, 所以 parent 控件的大部分方法都是被 child 控件的对应方法回调的

外控件通过 `onNestedPreScroll` 和 `onNestedScroll` 来接收内控件响应滑动前后的滑动距离信息，这两个方法是实现嵌套滑动效果的关键方法

#### 1. boolean onStartNestedScroll(View child, View target, [@ScrollAxis](/ScrollAxis) int axes)  parent 是否接受嵌套滑动

```java
/**
 * 有嵌套滑动到来了，判断父控件是否接受嵌套滑动（内控件调用该方法）
 *
 * @param child            嵌套滑动对应的父类的子类(因为嵌套滑动对于的父控件不一定是一级就能找到的，可能挑了两级父控件的父控件，child的辈分>=target)
 * @param target           具体嵌套滑动的那个子类
 * @param nestedScrollAxes 支持嵌套滚动轴。水平方向，垂直方向，或者不指定
 * @return 父控件是否接受嵌套滑动， 返回true才会执行剩下的嵌套滑动方法
 */
public boolean onStartNestedScroll(View child, View target, int nestedScrollAxes)
```

#### 2. void onNestedScrollAccepted(View child, View target, [@ScrollAxis](/ScrollAxis) int axes) parent 接受嵌套滑动

```java
/**
 * 当onStartNestedScroll返回为true时，也就是父控件接受嵌套滑动时，该方法才会调用；提供了child和parent做一些嵌套滑动的配置初始化工作
 */
public void onNestedScrollAccepted(View child, View target, int axes)
```

#### 3. void onNestedPreScroll(View target, int dx, int dy, int[] consumed) parent 首次消费嵌套事件

```java
/**
 * 在嵌套滑动的子控件未滑动之前，判断父控件是否优先与子控件处理(也就是父控件可以先消耗，消耗部分或者全部滑动距离，然后给子控件消耗）
 *
 * @param target   具体嵌套滑动的那个子类
 * @param dx       水平方向嵌套滑动的子控件想要变化的距离 dx<0 向右滑动 dx>0 向左滑动
 * @param dy       垂直方向嵌套滑动的子控件想要变化的距离 dy<0 向下滑动 dy>0 向上滑动
 * @param consumed 这个参数要我们在实现这个函数的时候指定，回头告诉子控件当前父控件消耗的距离
 *                 consumed[0] 水平消耗的距离，consumed[1] 垂直消耗的距离 好让子控件做出相应的调整
 */
public void onNestedPreScroll(View target, int dx, int dy, int[] consumed)
```

#### 4. void onNestedScroll([@NonNull](/NonNull) View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed) parent 处理 child 消费过后的事件

```java
/**
 * 嵌套滑动的子控件在滑动之后，判断父控件是否继续处理（也就是父消耗一定距离后，子再消耗，最后判断父消耗不） onStartNestedScroll必须返回true才调用该方法
 *
 * @param target       具体嵌套滑动的那个子类
 * @param dxConsumed   水平方向嵌套滑动的子控件滑动的距离(消耗的距离)
 * @param dyConsumed   垂直方向嵌套滑动的子控件滑动的距离(消耗的距离)
 * @param dxUnconsumed 水平方向嵌套滑动的子控件未滑动的距离(未消耗的距离)
 * @param dyUnconsumed 垂直方向嵌套滑动的子控件未滑动的距离(未消耗的距离)
 */
public void onNestedScroll(View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed)
```

#### 5.  onStopNestedScroll(View child) 嵌套滑动结束

```java
/**
 * 嵌套滑动结束，用来做一些收尾工作。对应stopNestedScroll
 */
public void onStopNestedScroll(View child) {}
```

#### 6. boolean onNestedPreFling(View target, float velocityX, float velocityY) parent 是否拦截 fling

```java
/**
 * 当子控件产生fling滑动时，判断父控件是否处拦截fling，如果父控件处理了fling，那子控件就没有办法处理fling了。
 *
 * @param target    具体嵌套滑动的那个子类
 * @param velocityX 水平方向上的速度 velocityX > 0  向左滑动，反之向右滑动
 * @param velocityY 竖直方向上的速度 velocityY > 0  向上滑动，反之向下滑动
 * @return 父控件是否拦截该fling
 */
public boolean onNestedPreFling(View target, float velocityX, float velocityY)
```

#### 7. boolean onNestedFling(View target, float velocityX, float velocityY, boolean consumed)

```java
/**
 * 当父控件不拦截该fling,那么子控件会将fling传入父控件
 *
 * @param target    具体嵌套滑动的那个子类
 * @param velocityX 水平方向上的速度 velocityX > 0  向左滑动，反之向右滑动
 * @param velocityY 竖直方向上的速度 velocityY > 0  向上滑动，反之向下滑动
 * @param consumed  子控件是否可以消耗该fling，也可以说是子控件是否消耗掉了该fling
 * @return 父控件是否消耗了该fling
 */
public boolean onNestedFling(View target, float velocityX, float velocityY, boolean consumed)
```

#### 8. int getNestedScrollAxes() 返回 parent 的嵌套滑动方向

```java
/**
 * 返回当前父控件嵌套滑动的方向，分为水平方向、垂直方向或者不变，作用不大
 * ViewCompat#SCROLL_AXIS_HORIZONTAL、ViewCompat#SCROLL_AXIS_VERTICAL、ViewCompat#SCROLL_AXIS_NONE
 */
public int getNestedScrollAxes()
```

### NestedScrollingChild2 与 NestedScrollingParent2 简介

NestedScrollingParent 与 NestedScrollingChild 的 API 设计中。并没有考虑如下问题：

1. 父控件根本不可能知道子控件是否 fling 结束。子控件只是在 ACTION_UP 中调用了 stopNestedScroll 方法。虽然通知了父控件结束嵌套滑动，但是子控件仍然可能处于 fling 中。
2. 子控件没有办法将部分 fling 传递给父控件。父控件必须处理整个 fling。

NestedScrollingChild2 与 NestedScrollingParent2 接口，只是在原有的方法中增加了 `TYPE_NON_TOUCH` 参数来让父控件区分到底是手势滑动还是 fling

### 版本兼容

1. Lollipop(sdk21/Android5.0) 之后

嵌套滑动的相关逻辑作为普通方法直接写进了最新的 (SDK21 之后)View 和 ViewGroup 类。

2. sdk21 之前的版本

官方在 android.support.v4 兼容包中提供了两个接口 `NestedScrollingChild` 和 `NestedScrollingParent`, 还有两个辅助类 `NestedScrollingChildHelper` 和 `NestedScrollingParentHelper` 来帮助控件实现嵌套滑动。

> 两个接口 NestedScrollingChild 和 NestedScrollingParent 分别定义上面提到的 View 和 ViewParent 新增的普通方法

- 那么怎么知道调用的方法是控件自有的方法, 还是接口的方法? 在代码中是通过 ViewCompat 和 ViewParentCompat 类来实现。

> ViewCompat 和 ViewParentCompat 通过当前的 Build.VERSION.SDK_INT 来判断当前版本, 然后选择不同的实现类, 这样就可以根据版本选择调用的方法。例如如果版本是 SDK21 之前, 那么就会判断控件是否实现了接口, 然后调用接口的方法, 如果是 SDK21 之后, 那么就可以直接调用对应的方法。

#### 辅助类 `NestedScrollingChildHelper` 和 `NestedScrollingParentHelper`

除了接口兼容包还提供了 `NestedScrollingChildHelper` 和 `NestedScrollingParentHelper` 两个辅助类, 这两个辅助类实际上就是对应 View 和 ViewParent 中新增的普通方法, 简单对比下就可以发现, 对应方法实现的逻辑基本一样

> 只要在接口方法内对应调用辅助类的方法就可以兼容嵌套滑动了。例如在 NestedScrollingChild#startNestedScroll 方法中调用 NestedScrollingChildHelper#startNestedScroll

> 这里实际用了代理模式来让 SDK21 之前的控件具有了新增的方法.

##### NestedScrollingParentHelper

实现了 NestedScrollingParent 的子类，都需要一个 final 的变量保存 `NestedScrollingParentHelper`，所有的操作都交给 NestedScrollingParentHelper，来实现兼容 Android21 以下版本

##### NestedScrollingChildHelper

## 嵌套滑动调用逻辑

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688194634575-6d873f5b-a4d1-416e-9d32-ab6b8e13e60b.png#averageHue=%23f3f3f3&clientId=ufeb6a1d2-1bec-4&from=paste&height=285&id=uc42bc123&originHeight=569&originWidth=732&originalType=binary&ratio=2&rotation=0&showTitle=false&size=82832&status=done&style=none&taskId=uddf15899-e17a-4f4b-baca-fec59736775&title=&width=366)

- 步骤 1<br />如果父控件不拦截事件，子控件收到滑动事件后，先询问父控件是否支持嵌套滑动 (`child.startNestedScroll`)，支持就交给父控件处理 (`child.dispatchNestedPreScroll`)
- 步骤 2<br />如果父控件支持嵌套滑动 (`parent.onStartNestedScroll/onNestedScrollAccepted`)，那么父控件进行预先滑动 (`parent.onNestedPreScroll`)；然后将处理剩余的距离交给子控件处理
- 步骤 3<br />如果子控件收到父控件剩余的滑动距离并滑动结束后，如果滑动距离还有剩余，又会询问父控件是否需要继续 (`child.dispatchNestedScroll`) 消耗剩下的距离，父控件需要的话就会全部处理掉剩余的距离 `parent.onNestedScroll`
- 步骤 4<br />如果子控件产生了 fling，会先询问父控件是否预先拦截 fling(`child.dispatchNestedPreFling`)。如果父控件拦截 (`parent.onNestedPreFling`)，则交给父控件处理 fling，子控件不处理 fling
- 步骤 5<br />如果父控件不预先拦截 fling, 那么会将 fling 传给父控件处理 (`child.dispatchNestedFling` `parent.onNestedFling`)。同时子控件也会处理 fling
- 步骤 6<br />当整个嵌套滑动结束时，子控件通知父控件嵌套滑动结束 (`child.stopNestedScroll` `parent.onStopNestedScroll`)

### 子控件方法调用时机

在低版本下，子控件向父控件传递事件需要配合 `NestedScrollingChildHelper` 类与 `NestedScrollingChild` 接口一起使用

#### 子控件 startNestedScroll 方法调用时机

根据嵌套滑动的机制设定，子控件如果想要将事件传递给父控件，那么父控件是不能拦截事件的。当子控件想要将事件交给父控件进行预处理，那么必然会在其 onTouchEvent 方法，将事件传递给父控件。需要注意的是当子控件调用 startNestedScroll 方法时，只是判断是否有支持嵌套滑动的父控件，并通知父控件嵌套滑动开始。这个时候并没有真正的传递相应的事件。故该方法只能在子控件的 `onTouchEvent` 方法中事件为 `MotionEvent.ACTION_DOWN` 时调用。

```java
// NestedScrollView
public boolean onTouchEvent(MotionEvent event) {
    int action = event.getActionMasked();
    switch (action) {
        case MotionEvent.ACTION_DOWN: {
            mLastX = x;
            mLastY = y;
            // 查找嵌套滑动的父控件，并通知父控件嵌套滑动开始。这里默认是设置的竖直方向
            startNestedScroll(ViewCompat.SCROLL_AXIS_VERTICAL);
            break;
        }
    }
    return super.onTouchEvent(event);
}
```

startNestedScroll 通过调用了 `NestedScrollingChildHelper#startNestedScroll`

```java
public boolean startNestedScroll(@ScrollAxis int axes, @NestedScrollType int type) {
    if (hasNestedScrollingParent(type)) { // 是否已经有一个NestedScrolling parent
        // Already in progress
        return true;
    }
    if (isNestedScrollingEnabled()) { // 子view是否支持NestedScroll嵌套滑动
        ViewParent p = mView.getParent();  // 获取当前的view的父控件
        View child = mView;
        while (p != null) {
            // 判断当前父控件是否支持嵌套滑动
            if (ViewParentCompat.onStartNestedScroll(p, child, mView, axes, type)) {
                setNestedScrollingParentForType(type, p);
                ViewParentCompat.onNestedScrollAccepted(p, child, mView, axes, type); // 父控件接受嵌套滑动事件
                return true;
            }
            if (p instanceof View) {
                child = (View) p;
            }
            // 循环继续向上寻找子view的Parent，直到找到一个有一个能处理嵌套滑动事件的View
            p = p.getParent();
        }
    }
    return false;
}
```

然后调用 `ViewParentCompat.onStartNestedScroll`，这里兼容处理了，分情况调用 parent 的各个版本的 `onStartNestedScroll` 来判断是否支持嵌套滑动。

在 startNestedScroll 中如果当前父控件不支持嵌套滑动，那么会一直向上寻找，直到找到为止。如果仍然没有找到，那么接下来的子父控件的嵌套滑动方法都不会调用。如果子控件找到了支持嵌套滑动的父控件，那么接下来会调用父控件的 `onNestedScrollAccepted` 方法，表示父控件接受嵌套滑动。

#### 子控件 dispatchNestedPreScroll 方法调用时机

当父控件接受嵌套滑动后，那么子控件需要将手势滑动传递给父控件，因为这里已经产生了滑动，故会在 onTouchEvent 中筛选 MotionEvent.ACTION_MOVE 中的事件，然后调用 dispatchNestedPreScroll 方法将滑动事件传递给父控件。

```java
private final int[] mScrollConsumed = new int[2]; // 记录父控件preScroll消费的距离，[0]表dx，[1]表dy
// NestedScrollView
public boolean onTouchEvent(MotionEvent ev) {
    final int actionMasked = ev.getActionMasked();
    switch (actionMasked) {
        case MotionEvent.ACTION_MOVE:
            if (mIsBeingDragged) {
                // Start with nested pre scrolling
                if (dispatchNestedPreScroll(0, deltaY, mScrollConsumed, mScrollOffset,  ViewCompat.TYPE_TOUCH)) {
                    deltaY -= mScrollConsumed[1];
                    mNestedYOffset += mScrollOffset[1];
                }
                
                // 如果还有剩余的距离，那么继续询问父view是否处理剩余的距离
                final int scrolledDeltaY = getScrollY() - oldY;
                final int unconsumedY = deltaY - scrolledDeltaY;
                mScrollConsumed[1] = 0;
                dispatchNestedScroll(0, scrolledDeltaY, 0, unconsumedY, mScrollOffset, ViewCompat.TYPE_TOUCH, mScrollConsumed);
            }
            break;
    }
}
```

然后调用 `NestedScrollingChildHelper#dispatchNestedPreScroll`，

```java
public boolean dispatchNestedPreScroll(int dx, int dy, @Nullable int[] consumed,
        @Nullable int[] offsetInWindow, @NestedScrollType int type) {
    if (isNestedScrollingEnabled()) { // 嵌套滑动是否可用
        final ViewParent parent = getNestedScrollingParentForType(type); // 获取当前嵌套滑动的父控件，如果为null，直接返回
        if (parent == null) {
            return false;
        }

        if (dx != 0 || dy != 0) {
            int startX = 0;
            int startY = 0;
            if (offsetInWindow != null) {
                mView.getLocationInWindow(offsetInWindow);
                startX = offsetInWindow[0];
                startY = offsetInWindow[1];
            }

            if (consumed == null) {
                consumed = getTempNestedScrollConsumed();
            }
            consumed[0] = 0;
            consumed[1] = 0;
             // 调用父控件的onNestedPreScroll处理事件
            ViewParentCompat.onNestedPreScroll(parent, mView, dx, dy, consumed, type);

            if (offsetInWindow != null) {
                mView.getLocationInWindow(offsetInWindow);
                offsetInWindow[0] -= startX;
                offsetInWindow[1] -= startY;
            }
            // 父控件可能会将子控件传递的滑动事件全部消耗。那么子控件就没有继续可处理的事件了。
            return consumed[0] != 0 || consumed[1] != 0; // consumed都是0表示全部消费，返回false
        } else if (offsetInWindow != null) {
            offsetInWindow[0] = 0;
            offsetInWindow[1] = 0;
        }
    }
    return false;
}
```

#### 子控件 dispatchNestedScroll 方法调用时机

当父控件预先处理滑动事件后，也就是调用 onNestedPreScroll 方法并把消耗的距离传递给子控件后，子控件会获取剩下的事件并消耗。如果子控件仍然没有消耗完，那么会调用 dispatchNestedScroll 将剩下的事件传递给父控件。如果父控件不处理。那么又会传递给子控件进行处理。

#### 子控件 stopNestedScroll 方法调用时机

当整个事件序列结束的时候 (当手指抬起或取消滑动的时候)，需要通知父控件嵌套滑动已经结束。故我们需要在 OnTouchEvent 中筛选 MotionEvent.ACTION_UP、MotionEvent.ACTION_CANCEL 中的事件，并通过 stopNestedScroll() 方法通知父控件

```java
public boolean onTouchEvent(MotionEvent event) {
    int action = event.getActionMasked();
    switch (action) {
        case MotionEvent.ACTION_UP: {   // 当手指抬起的时，结束事件传递，在stopNestedScroll()方法中，最终会调用父控件的onStopNestedScroll()方法
            stopNestedScroll();
            break;
        }
        case MotionEvent.ACTION_CANCEL: {   //当手指抬起的时，结束事件传递
            stopNestedScroll();
            break;
        }
    }
    return super.onTouchEvent(event);
}
```

#### 子控件 fling 分发时机

在 Android 系统下，手指在屏幕上滑动然后松手，控件中的内容会顺着惯性继续往手指滑动的方向继续滚动直到停止，这个过程叫做 `fling`。也就是我们需要在 onTouchEvent 方法中筛选 MotionEvent.ACTION_UP 的事件并获取需要的滑动速度。

```java
// NestedScrollView
private void initOrResetVelocityTracker() {
    if (mVelocityTracker == null) {
        mVelocityTracker = VelocityTracker.obtain();
    } else {
        mVelocityTracker.clear();
    }
}
public void onTouchEvent(MotionEvent event) {
    // ...
    case MotionEvent.ACTION_DOWN: {
        initOrResetVelocityTracker();
        break;
    case MotionEvent.ACTION_UP:
        final VelocityTracker velocityTracker = mVelocityTracker;
        velocityTracker.computeCurrentVelocity(1000, mMaximumVelocity);
        int initialVelocity = (int) velocityTracker.getYVelocity(mActivePointerId);
        if ((Math.abs(initialVelocity) >= mMinimumVelocity)) {
            if (!dispatchNestedPreFling(0, -initialVelocity)) { // 返回false表示父控件不处理fling，子控件处理
                // 将fling效果传递给父控件
                dispatchNestedFling(0, -initialVelocity, true);
                // 子控件自己处理fling
                fling(-initialVelocity);
            }
        } 
        endDrag();
        break;
    // ...
}
private void endDrag() {
    mIsBeingDragged = false;

    recycleVelocityTracker();
    stopNestedScroll(ViewCompat.TYPE_TOUCH);

    if (mEdgeGlowTop != null) {
        mEdgeGlowTop.onRelease();
        mEdgeGlowBottom.onRelease();
    }
}
```

1. 子控件 dispatchNestedPreFling 最终会调用父控件的 onNestedPreFling 方法
2. 子控件的 dispatchNestedFling 最终会调用父控件的 onNestedFling 方法
3. 如果父控件的拦截 fling(也就是 onNestedPreFling 方法返回为 true)。那么子控件是没有机会处理 fling 的
4. 如果父控件不拦截 fling(也就是 onNestedPreFling 方法返回为 false)，则父控件会调用 onNestedFling 方法与子控件同时处理 fling
5. 当父控件与子控件同时处理 fling 时，子控件会立即调用 stopNestedScroll 方法通知父控件嵌套滑动结束

## NestedScrollView 分析

NestedScrollView 简单地说就是支持嵌套滑动的 ScrollView, 内部逻辑简单, 而且它既可以是内控件, 也可以是外控件。

## CoordinatorLayout

见 `CoordinatorLayout.md` 章节

## 嵌套滑动实战

Android 嵌套滑动机制（NestedScrolling）<br /><https://segmentfault.com/a/1190000002873657>

Android 嵌套滑动机制实战演练<br /><https://www.jianshu.com/p/20efb9f65494>

## Ref

- [ ] 一点见解: Android 嵌套滑动和 NestedScrollView<br /><https://www.jianshu.com/p/1806ed9737f6>

### 嵌套滑动系列

- [x] 自定义 View 事件之进阶篇 (一)-NestedScrolling(嵌套滑动) 机制<br /><https://juejin.cn/post/6844903901771071496>
- [x] 自定义 View 事件篇进阶篇 (二)- 自定义 NestedScrolling 实战<br /><https://juejin.cn/post/6844903901850763277>

<https://juejin.cn/post/6844903788789104648>
