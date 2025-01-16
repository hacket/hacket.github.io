---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# CoordinatorLayout

CoordinatorLayout(协调者布局)是在 Google IO/15 大会发布的，遵循Material 风格，包含在 support Library中，结合`AppbarLayout`, `CollapsingToolbarLayout`等可产生各种炫酷的效果。

## CoordinatorLayout主要实现以下四个功能

- 处理子控件的依赖下的交互
- 处理子控件的嵌套滑动（里面的方法同NestedScrollingParent）
- 处理子控件的测量与布局
- 处理子控件的事件拦截与响应

而上述四个功能，都依托于CoordainatorLayout中提供的一个叫做`Behavior`的“插件”。Behavior内部也提供了相应方法来对应这四个不同的功能：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223599759-056c5662-7d4a-4a3b-87c8-4ad79a5dee8c.png#averageHue=%2382db8c&clientId=u3edcbdc0-889c-4&from=paste&height=382&id=ua428a3bf&originHeight=763&originWidth=699&originalType=binary&ratio=2&rotation=0&showTitle=false&size=188723&status=done&style=none&taskId=u59f43dd8-e0b7-42c8-bc2a-f6221ff2aec&title=&width=349.5)

### 子控件依赖下的交设计

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223613310-7aeb376f-5f64-43a8-afe1-837e682d2541.png#averageHue=%2320a1a1&clientId=u3edcbdc0-889c-4&from=paste&height=468&id=uec3025ac&originHeight=936&originWidth=818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=293822&status=done&style=none&taskId=u5d5b44d1-547b-4fc9-870c-4246d22ab54&title=&width=409)<br />![](http://note.youdao.com/yws/res/63068/77ED1F183EE6412F934E236976472523#id=qPIVg&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />当CoordainatorLayout中子控件（childView1)的位置、大小等发生改变的时候，那么在CoordainatorLayout内部会通知所有依赖childView1的控件，并调用对应声明的Behavior，告知其依赖的childView1发生改变。那么如何判断依赖，接受到通知后如何处理。这些都交由Behavior来处理。

### 子控件的嵌套滑动的设计

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223627144-743bfec1-884d-4c7d-854f-2ba31c5e5a96.png#averageHue=%23f1f2f0&clientId=u3edcbdc0-889c-4&from=paste&height=424&id=uc633e17f&originHeight=848&originWidth=917&originalType=binary&ratio=2&rotation=0&showTitle=false&size=119050&status=done&style=none&taskId=u9cdef092-1e21-48f1-b5ac-1cd7754ce0e&title=&width=458.5)<br />CoordinatorLayout实现了NestedScrollingParent2接口。那么当事件（scroll或fling)产生后，内部实现了NestedScrollingChild接口的子控件会将事件分发给CoordinatorLayout，CoordinatorLayout又会将事件传递给所有的Behavior。接着在Behavior中实现子控件的嵌套滑动。那么再结合上文提到的Behavior中嵌套滑动的相关方法，我们可以得到如下流程：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223640361-f757b22b-852a-4f0d-843a-24e7f869a5fc.png#averageHue=%23afd688&clientId=u3edcbdc0-889c-4&from=paste&height=440&id=u37ad80b3&originHeight=879&originWidth=1240&originalType=binary&ratio=2&rotation=0&showTitle=false&size=201528&status=done&style=none&taskId=ufbc75af6-1a97-42ac-a3c8-33278ceb623&title=&width=620)

> 相对于NestedScrolling机制（参与角色只有子控件和父控件），CoordainatorLayout中的交互角色更为丰富，在CoordainatorLayout下的子控件可以与多个兄弟控件进行交互。

### 子控件的测量、布局、事件的设计![](http://note.youdao.com/yws/res/63082/912666D0C63B4F62876124A8E9BE469F#id=xk3M8&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223706686-c5cd576e-8627-4bfa-b1c8-fd790f0b5e3e.png#averageHue=%23c4cdc5&clientId=u3edcbdc0-889c-4&from=paste&height=453&id=u6393c2ca&originHeight=905&originWidth=935&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140829&status=done&style=none&taskId=uc3cefcfa-a7c1-4b4c-bf12-05a0732a45e&title=&width=467.5)<br />因为CoordainatorLayout主要负责的是子控件之间的交互，内部控件的测量与布局，就简单的类似FrameLayout处理方式就好了。在特殊的情况下，如子控件需要处理宽高和布局的时候，那么交由Behavior内部的onMeasureChild与onLayoutChild方法来进行处理。同理对于事件的拦截与处理，如果子控件需要拦截并消耗事件，那么交由给Behavior内部的onInterceptTouchEvent与onTouchEvent方法进行处理

## Behavior

### 什么是Behavior？

CoordinatorLayout作用是把它的View连接起来，使它们之间相互很好的配合，通知各个子View之间状态的变换。`Behavior`就是当中的中间媒介。

### 依赖交互

#### CoordainatorLayout下的多个子控件的依赖交互-layoutDependsOn定义依赖关系

```
public boolean layoutDependsOn(CoordinatorLayout parent, V child, View dependency) { return false; }
public boolean onDependentViewChanged(CoordinatorLayout parent, V child, View dependency) {return false; }
public void onDependentViewRemoved(CoordinatorLayout parent, V child, View dependency) {}
```

参数介绍：

- child 某个子view，配置了behavior的view
- dependency child依赖的view

##### boolean layoutDependsOn

至少被调用一次，确定child是否依赖dependency；true依赖，false不依赖。

确定一个child控件（childView1)依赖另外一个dependency控件(childView2)的时候，是通过layoutDependsOn这个方法。其中child是依赖对象(childView1)，而dependency是被依赖对象(childView2)，该方法的返回值是判断是否依赖对应view。如果返回true。那么表示依赖。反之不依赖。一般情况下，在我们自定义Behavior时，我们需要重写该方法。当layoutDependsOn方法返回true时，后面的onDependentViewChanged与onDependentViewRemoved方法才会调用。

##### boolean onDependentViewChanged

当一个child控件（childView1)所依赖的另一个dependency控件(childView2)位置、大小发生改变的时候，该方法会调用。其中该方法的返回值，是由childView1来决定的，如果childView1在接受到childView2的改变通知后，childView1的位置或大小发生改变，那么就返回true,反之返回false。

##### void onDependentViewRemoved

当一个child控件（childView1)所依赖的另一个dependency控件(childView2)被删除的时候，该方法会调用。

#### XML中的`app:layout_anchor`定义依赖关系（优先`layoutDependsOn`）

不重写layoutDependsOn方法，而是在布局使用xml中使用`layout_anchor`来确定依赖关系

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

在dependency View的onTouchEvent方法中，我们根据手势修改了DependedView的位置，我们都知道当子控件位置、大小发生改变的时候，会导致父控件重绘，也就是会调用onDraw方法。而在`CoordinatorLayout#onAttachedToWindow`中使用了ViewTreeObserver，并设置了绘制前监听器`OnPreDrawListener`

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

现在看onChildViewsChanged()

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

程序中使用了一个名为mDependencySortedChildren的集合，通过遍历该集合，我们可以获取集合中控件的LayoutParam，得到LayoutParam后，我们可以继续获取相应的Behavior。并调用其layoutDependsOn方法找到所依赖的控件，如果找到了当前控件所依赖的另一控件，那么就调用Behavior中的onDependentViewChanged方法。<br />看到这里，多个控件依赖交互的原理已经非常清楚了，在CoordinatorLayout下，控件A发生位置、大小改变时，会导致CoordinatorLayout重绘。而CoordinatorLayout又设置了绘制前的监听。在该监听中，会遍历mDependencySortedChildren集合，找到依赖A控件的其他控件。并通知其他控件A控件发生了改变。当其他控件收到该通知后。就可以做自己想做的效果啦。

### Behavior实现嵌套滑动的原理与过程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691223727549-669048d1-e95f-4d6a-b2d2-10746129227f.png#averageHue=%23fafafa&clientId=u3edcbdc0-889c-4&from=paste&height=640&id=u551fb261&originHeight=1280&originWidth=880&originalType=binary&ratio=2&rotation=0&showTitle=false&size=129487&status=done&style=none&taskId=u806c0696-8f9c-46e0-a6dc-562b0d39b08&title=&width=440)<br />![](http://note.youdao.com/yws/res/63143/C5EAC09EE4994F0F975EFBB4F86A09E4#id=Nkpr1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### CoordinatorLayout的事件传递过程

Behavior的嵌套滑动其实都是围绕CoordinatorLayout的的onInterceptTouchEvent与onTouchEvent方法展开的。

先从onInterceptTouchEvent方法讲起：

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

在CoordinatorLayout的的onInterceptTouchEvent方法中，内部其实是调用了performIntercept来处理是否拦截事件

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

1. 获取内部的控件集合（topmostChildList），并按照z轴进行排序
2. 循环遍历topmostChildList，获取控件的Behavior，并调用Behavior的onInterceptTouchEvent方法判断是否拦截事件，如果拦截事件，则事件又会交给CoordinatorLayout的onTouchEvent方法处理。
3. 有多个behavior都拦截的话，只会取第一个behavior来处理

一般情况下，Behavior的onInterceptTouchEvent方法基本都是返回false。那么CoordinatorLayout就不会拦截事件，根据事件传递机制，事件就传递到了子控件中去了。如果我们的子控件实现是了NestedScrollingChild接口（如RecyclerView或NestedScrollView),并且在onTouchEvent方法调用了相关嵌套滑动API，那么再根据嵌套滑动机制，会调用实现了NestedScrollingParent2接口的父控件的相应方法。又因为CoordinatorLayout实现了NestedScrollingParent2接口。那么就又回到了嵌套滑动机制了。

#### CoordinatorLayout嵌套滑动机制

首先看`onStartNestedScroll()`（子控件调用startNestedScroll时回调CoordinatorLayout）：

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

只要有一个behavior接受了嵌套滑动，代表CoordinatorLayout就能处理嵌套滑动事件了，那么就会走`CoordinatorLayout#onNestedScrollAccepted`：

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

同样在`CoordinatorLayout#onNestedScrollAccepted`方法中，也会调用所有控件的Behavior的onNestedScrollAccepted方法，需要注意的是，在该方法中增加了`if(!lp.isNestedScrollAccepted(type))`的判断，也就是说只有Behavior的onStartNestedScroll方法返回true的时候（因为在setNestedScrollAccepted保存了类型，否则这里会返回false），该方法才会执行。

接下来看`CoordinatorLayout#onNestedPreScroll`，子view第一次问CoordinatorLayout是否处理嵌套滑动事件：

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

如果有剩余的距离，子view自己处理后，如果还有剩余的距离，子view就会调用`CoordinatorLayout#onNestedScroll`方法继续询问CoordinatorLayout处理：

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

在CoordinatorLayout下的比较重要的嵌套滑动方法基本上讲解完毕了。余下的`onNestedPreFling`与`onNestedFling`方法都大同小异。

### Behavior的measure

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

子控件进行遍历，调用子控件的`Behavior#onMeasureChild`方法，判断是否自主测量，如果为true，那么则以子控件的测量为准，返回false系统自己测量。<br />当子控件测量完毕后，会通过widthUsed和heightUsed这两个变量来保存CoordinatorLayout中子控件最大的尺寸。这两个变量的值，最终将会影响CoordinatorLayout的宽高。

### Behavior的layout

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

在对子View进行遍历的时候，CoordinatorLayout有主动向子控件的Behavior传递布局的要求，如果调用`Behavior#onLayoutChild`子控件返回了true，则以它的结果为准；false的话否将调用`onLayoutChild`方法默认布局。

## 已知的behavior效果

### appbar_scrolling_view_behavior（Android原生自带）

### appbarlayout-spring-behavior（帮助AppbarLayout滚动回弹效果）

![](https://github.com/ToDou/appbarlayout-spring-behavior/raw/master/screenshot/appbar_spring.gif#id=hXlJb&originHeight=956&originWidth=572&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://github.com/ToDou/appbarlayout-spring-behavior/raw/master/screenshot/appbar_spring_blur_tab.gif#id=c2dw2&originHeight=958&originWidth=576&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://github.com/ToDou/appbarlayout-spring-behavior/raw/master/screenshot/appbar_scrollview_fling_fix.gif#id=WzMpX&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### behavior-learn

<https://github.com/iielse/behavior-learn>

CoordinatorLayout 自定义Behavior 高仿美团商家详情界面 实现页面内容复杂联动效果

### CoordinatorLayout有用的方法

1. getDependencies 获取child依赖的view的集合（child behavior配置layoutDependsOn=true或配置了layout_anchor）

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

2. getDependents 获取依赖child的view的集合

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

注意：两个方法不必要同时调用，如果后面调用的方法会将mTempDependenciesList清空，导致2个都为empty

```kotlin
val dependencies = parent.getDependencies(child)
val dependents = parent.getDependents(child)
// 如果child没有被其他view依赖，那么这两个返回值都会变成empty
```

## CoordinatorLayout总结

1. behavior只能作用于coordinatorlayout直接子view吗？

> 是

2. 在xml引用自定义Behavior时，一定要声明2个参数的构造函数。不然在程序的编译过程中，会提示知道不到相应的Behavior。

## CoordinatorLayout问题

### CoordinatorLayout下的ScrollView显示不完整

把ScrollView改成nestedscrollview就好了

## Ref

- [x] 自定义View事件篇进阶篇(三)-CoordinatorLayout与Behavior<br /><https://juejin.cn/post/6844903904623214599>
- [x] 自定义View事件之进阶篇(四)-自定义Behavior实战<br /><https://juejin.cn/post/6844903904820330510>

### 博客

- [Android Design Support Library: 学习CoordinatorLayout](http://www.cnblogs.com/yuanchongjie/p/4997134.html)
- [拦截一切的CoordinatorLayout](https://github.com/bboyfeiyu/android-tech-frontier/blob/master/issue-43/%E9%80%9A%E8%BF%87CoordinatorLayout%E7%9A%84Behavior%E6%8B%A6%E6%88%AA%E4%B8%80%E5%88%87.md)
- [CoordinatorLayout 布局的使用方式](http://www.wangchenlong.org/2016/03/22/1603/228-coordinator-layout-first/)
- [掌握 Coordinator Layout](https://www.aswifter.com/2015/11/12/mastering-coordinator/)
- [CoordinatorLayoutDemos](https://github.com/sungerk/CoordinatorLayoutDemos)

### 推荐的项目

- [**smooth-app-bar-layout**](https://github.com/henrytao-me/smooth-app-bar-layout)原生的appBarLayout滑动起来不顺畅，而且向下Fling时无法到达AppBarLayout扩大的状态，推荐使用这个。

- [**coordinated-effort**](https://github.com/devunwired/coordinated-effort)
