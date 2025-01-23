---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:28:31 pm
title: RecyclerView辅助
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, Google, RecyclerView]
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
aliases: [RecyclerView 之 SnapHelper]
linter-yaml-title-alias: RecyclerView 之 SnapHelper
---

# RecyclerView 之 SnapHelper

## SnapHelper 介绍

RecyclerView 在 24.2.0 版本中新增了 `SnapHelper` 这个辅助类，用于辅助 RecyclerView 在滚动结束时将 Item 对齐到某个位置。特别是列表横向滑动时，很多时候不会让列表滑到任意位置，而是会有一定的规则限制，这时候就可以通过 SnapHelper 来定义对齐规则了。

SnapHelper 是一个抽象类，官方提供了一个 `LinearSnapHelper` 的子类，可以让 RecyclerView 滚动停止时中间的 ItemView 停留 RecyclerView 中间位置。25.1.0 版本中官方又提供了一个 `PagerSnapHelper` 的子类，可以使 RecyclerView 像 ViewPager 一样的效果，一次只能滑一页，而且居中显示。

## 注意

1. 每次只能注册一个 SnapHelper，否则报错

```
java.lang.IllegalStateException: An instance of OnFlingListener already set.
```

2. onScroll 和 onFling 都会滚动，不会冲突吗？

## 官方提供的 SnapHelper

### LinearSnapHelper

默认实现是对齐中间的 childView 到 RecyclerView 的中间；如果需要更改默认行为，复写 `SnapHelper#calculateDistanceToFinalSnap()` 方法。

### PagerSnapHelper

每次滚动一页

## SnapHelper 分析

### attachToRecyclerView

`SnapHelper#attachToRecyclerView` 入口：

```java
public void attachToRecyclerView(@Nullable RecyclerView recyclerView)
        throws IllegalStateException {
    if (mRecyclerView == recyclerView) {
        return; // nothing to do
    }
    if (mRecyclerView != null) {
        destroyCallbacks(); // 如果该SnapHelper之前已经绑定了一个RecyclerView，解除该RecyclerView历史回调的关系
    }
    mRecyclerView = recyclerView;
    if (mRecyclerView != null) {
        setupCallbacks(); // 注册回调
        mGravityScroller = new Scroller(mRecyclerView.getContext(),
                new DecelerateInterpolator());
        snapToTargetExistingView(); // 移动到指定View
    }
}
```

setupCallbacks():

```java
private void setupCallbacks() throws IllegalStateException {
    if (mRecyclerView.getOnFlingListener() != null) {
        throw new IllegalStateException("An instance of OnFlingListener already set.");
    }
    mRecyclerView.addOnScrollListener(mScrollListener); // 添加OnScrollListener监听
    mRecyclerView.setOnFlingListener(this); // 设置OnFlingListener监听
}
```

destroyCallbacks():

```java
private void destroyCallbacks() {
    mRecyclerView.removeOnScrollListener(mScrollListener); // 移除OnScrollListener监听
    mRecyclerView.setOnFlingListener(null); // 移除OnFlingListener监听
}
```

> SnapHelper 是一个抽象类，实现了 RecyclerView.OnFlingListener 接口，入口方法 attachToRecyclerView 在 SnapHelper 中定义，该方法主要起到清理、绑定回调关系和初始化位置的作用，在 setupCallbacks 中设置了 addOnScrollListener 和 setOnFlingListener 两种回调；

### SnapHelper 处理回调流程

#### 滚动状态回调处理 OnScrollListener

```java
// SnapHelper
// Handles the snap on scroll case.
private final RecyclerView.OnScrollListener mScrollListener =
    new RecyclerView.OnScrollListener() {
        boolean mScrolled = false;

        @Override
        public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
            super.onScrollStateChanged(recyclerView, newState);
            //  静止状态且滚动过一段距离，触发snapToTargetExistingView();
            if (newState == RecyclerView.SCROLL_STATE_IDLE && mScrolled) {
                mScrolled = false;
                 // 移动到指定的已存在的View
                snapToTargetExistingView();
            }
        }

        @Override
        public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
            if (dx != 0 || dy != 0) {
                mScrolled = true;
            }
        }
    };
```

逻辑处理的入口在 onScrollStateChanged 方法中，当 newState==RecyclerView.SCROLL_STATE_IDLE 且滚动距离不等于 0，触发 snapToTargetExistingView 方法；snapToTargetExistingView():

```java
// SnapHelper
// 移动到指定的已存在的View；attachToRecyclerView时会调用，滚动停止时也会调用
void snapToTargetExistingView() {
    if (mRecyclerView == null) {
        return;
    }
    RecyclerView.LayoutManager layoutManager = mRecyclerView.getLayoutManager();
    if (layoutManager == null) {
        return;
    }
    View snapView = findSnapView(layoutManager); //  查找需要对齐的SnapView
    if (snapView == null) {
        return;
    }
    int[] snapDistance = calculateDistanceToFinalSnap(layoutManager, snapView); // 计算SnapView到最终目标的距离
    if (snapDistance[0] != 0 || snapDistance[1] != 0) {
        mRecyclerView.smoothScrollBy(snapDistance[0], snapDistance[1]);
    }
}
```

snapToTargetExistingView() 方法顾名思义是移动到指定已存在的 View 的位置，findSnapView 是查到目标的 SnapView，calculateDistanceToFinalSnap 是计算 SnapView 到最终位置的距离；由于 findSnapView 和 calculateDistanceToFinalSnap 是抽象方法，所以需要子类的具体实现；<br />整理一下滚动状态回调下，SnapHelper 的实现流程图如下：

![](http://note.youdao.com/yws/res/41132/D8D7AC46E6794AAF8898386C300E1356#id=HUZe9&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489946047-f5f8a339-ae02-41b2-bd61-d4ba9db321c8.png#averageHue=%23f5f4f4&clientId=u4bb3d248-2555-4&from=paste&height=577&id=u7827bcfc&originHeight=866&originWidth=593&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=100089&status=done&style=none&taskId=u198adf72-be31-4f1e-a76a-030bf4e6f1a&title=&width=395.3333333333333)

#### Fling 结果回调处理 OnFlingListener

```java
// SnapHelper
@Override
public boolean onFling(int velocityX, int velocityY) {
    RecyclerView.LayoutManager layoutManager = mRecyclerView.getLayoutManager();
    if (layoutManager == null) {
        return false;
    }
    RecyclerView.Adapter adapter = mRecyclerView.getAdapter();
    if (adapter == null) {
        return false;
    }
    int minFlingVelocity = mRecyclerView.getMinFlingVelocity();
    return (Math.abs(velocityY) > minFlingVelocity || Math.abs(velocityX) > minFlingVelocity)
            && snapFromFling(layoutManager, velocityX, velocityY);
}
```

如果 velocityX 和 velocityY 都大于最小值的 minFlingVelocity(默认值是 50)，返回逻辑由 snapFromFling 来处理：

```java
// SnapHelper
private boolean snapFromFling(@NonNull RecyclerView.LayoutManager layoutManager, int velocityX,
        int velocityY) {
    if (!(layoutManager instanceof RecyclerView.SmoothScroller.ScrollVectorProvider)) {
        return false;
    }

    RecyclerView.SmoothScroller smoothScroller = createScroller(layoutManager);
    if (smoothScroller == null) {
        return false;
    }

    int targetPosition = findTargetSnapPosition(layoutManager, velocityX, velocityY);
    if (targetPosition == RecyclerView.NO_POSITION) {
        return false;
    }

    smoothScroller.setTargetPosition(targetPosition);
    layoutManager.startSmoothScroll(smoothScroller);
    return true;
}
```

子类实现 `findTargetSnapPosition` 来决定滚动的 position

### SnapHelper 重要方法

#### View findSnapView(RecyclerView.LayoutManager layoutManager)

提供给 scroll/fling 用。在 scroll 处于 idle 时需要 snap 时，回调该方法找一个 snap 的 view。在 fling 时也会调用

#### int[] calculateDistanceToFinalSnap(RecyclerView.LayoutManager layoutManager, View targetView)

提供给 scroll 用。参数 2 targetView 就是 findSnapView 找到的 snap 的 View。计算滚动到 targetView 的坐标

#### int findTargetSnapPosition(RecyclerView.LayoutManager layoutManager, int velocityX, int velocityY)

提供给 fling 用。要 snap 的在 adapter 的 position。

# OrientationHelper

OrientationHelper 其实就是对 RecycleView 中子 View 管理的工具类，并且它只是一个抽象类，类中定义了获取 View 布局信息的相关方法。<br />默认实现：`createHorizontalHelper`（对应水平的 LayoutManager）和 `createVerticalHelper`（对应竖直的 LayoutManager）方法

## API （需要注意 RTL，很多 API 都是相对于 Left 和 Right 的，要注意转换）

```java
public static OrientationHelper createHorizontalHelper(
        RecyclerView.LayoutManager layoutManager) {
    return new OrientationHelper(layoutManager) {
        @Override
        public int getEndAfterPadding() {
            // 返回RecycleView内容右边界位置（RecycleView的宽度，出去右侧内边距）
            return mLayoutManager.getWidth() - mLayoutManager.getPaddingRight();
        }

        @Override
        public int getEnd() {
            // 返回RecycleView的宽度，不包括padding
            return mLayoutManager.getWidth();
        }

        @Override
        public void offsetChildren(int amount) {
        //水平横移子View amount距离
            mLayoutManager.offsetChildrenHorizontal(amount);
        }

        @Override
        public int getStartAfterPadding() {
            // 获取RecycleView左侧内边距（paddingLeft）
            return mLayoutManager.getPaddingLeft();
        }

        @Override
        public int getDecoratedMeasurement(View view) {
            // 返回view在水平方向上所占位置的大小（包括view的左右外边距）
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            return mLayoutManager.getDecoratedMeasuredWidth(view) + params.leftMargin
                    + params.rightMargin;
        }

        @Override
        public int getDecoratedMeasurementInOther(View view) {
        //返回view在竖直方向上所占位置的大小（包括view的上下外边距）
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            return mLayoutManager.getDecoratedMeasuredHeight(view) + params.topMargin
                    + params.bottomMargin;
        }

        @Override
        public int getDecoratedEnd(View view) {
        //返回view右边界点（包含右内边距和右外边距）在父View中的位置（以父View的（0，0）点位坐标系）
        //通俗地讲：子View右边界点到父View的（0，0）点的水平间距
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            return mLayoutManager.getDecoratedRight(view) + params.rightMargin;
        }

        @Override
        public int getDecoratedStart(View view) {
        //返回view左边界点（包含左内边距和左外边距）在父View中的位置（以父View的（0，0）点位坐标系）
        //通俗地讲：子View左边界点到父View的（0，0）点的水平间距
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
                    view.getLayoutParams();
            return mLayoutManager.getDecoratedLeft(view) - params.leftMargin;
        }

        @Override
        public int getTransformedEndWithDecoration(View view) {
        //返回view水平方向的结束位置（包含右侧的装饰，如你自定义了分割线（ItemDecoration），这个是带分割线宽度的结束位置），相对父容器
            mLayoutManager.getTransformedBoundingBox(view, true, mTmpRect);
            return mTmpRect.right;
        }

        @Override
        public int getTransformedStartWithDecoration(View view) {
        //返回view水平方向的开始位置（包含左侧的装饰，如你自定义了分割线（ItemDecoration），这个是减去分割线宽度的开始位置），相对父容器
            mLayoutManager.getTransformedBoundingBox(view, true, mTmpRect);
            return mTmpRect.left;
        }

        @Override
        public int getTotalSpace() {
        //返回Recycleview水平内容区空间大小（宽度，除去左右内边距）
            return mLayoutManager.getWidth() - mLayoutManager.getPaddingLeft()
                    - mLayoutManager.getPaddingRight();
        }

        @Override
        public void offsetChild(View view, int offset) {
        //相当于layout效果（在layout基础上偏移offset像素）
            view.offsetLeftAndRight(offset);
        }

        @Override
        public int getEndPadding() {
        //返回Recycleview右侧内边距大小
            return mLayoutManager.getPaddingRight();
        }

        @Override
        public int getMode() {
        //获取Recycleview宽度测量模式
            return mLayoutManager.getWidthMode();
        }

        @Override
        public int getModeInOther() {
       //获取Recycleview高度测量模式
            return mLayoutManager.getHeightMode();
        }
    };
}
```

注：RV 左上角 (0,0) 为坐标原点，下面原点都指该点

### getTotalSpace() RV 宽/高减去 padding

```
// 水平
public int getTotalSpace() {
    return mLayoutManager.getWidth() - mLayoutManager.getPaddingLeft()
            - mLayoutManager.getPaddingRight();
}
// 垂直
public int getTotalSpace() {
    return mLayoutManager.getHeight() - mLayoutManager.getPaddingTop()
            - mLayoutManager.getPaddingBottom();
}
```

### getEnd() end 边距离原点的距离，包括 padding（同 RV 的宽度）

```
// 水平
public int getEnd() {
    return mLayoutManager.getWidth();
}
// 垂直
public int getEnd() {
    return mLayoutManager.getHeight();
}
```

### getStartAfterPadding() start 边距离原点的距离，加上 paddingStart 距离 （同 RV 的 paddingLeft）

```
// 水平
public int getStartAfterPadding() {
    return mLayoutManager.getPaddingLeft();
}

// 垂直
public int getStartAfterPadding() {
    return mLayoutManager.getPaddingTop();
}
```

### getEndAfterPadding() end 边距离原点的距离，加上 paddingEnd 距离 （同 RV 的 width 减去 paddingRight，针对水平方向）

```
// 水平
public int getEndAfterPadding() {
    return mLayoutManager.getWidth() - mLayoutManager.getPaddingRight();
}

// 垂直
public int getEndAfterPadding() {
    return mLayoutManager.getHeight() - mLayoutManager.getPaddingBottom();
}
```

### getDecoratedMeasurement(View view) 返回 view 在水平方向上所占位置的大小（包括 view 的左右 margin 和 padding）

```java
// 水平
public int getDecoratedMeasurement(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedMeasuredWidth(view) + params.leftMargin + params.rightMargin;
}
// LayoutManager
public int getDecoratedMeasuredWidth(@NonNull View child) {
    final Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
    return child.getMeasuredWidth() + insets.left + insets.right;
}
```

### getDecoratedMeasurementInOther(View view) 返回 view 在竖直方向上所占位置的大小（包括 view 的上下外边距）

```java
// 水平
public int getDecoratedMeasurementInOther(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedMeasuredHeight(view) + params.topMargin
            + params.bottomMargin;
}
```

### getDecoratedStart(View view) 返回 view 左边界点（包含左内边距和左外边距）在父 View 中的位置（以父 View 的（0，0）点位坐标系）

> 通俗地讲：子 View 左边界点到父 View 的（0，0）点的水平间距，不管是否 RTL

```
public int getDecoratedStart(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedLeft(view) - params.leftMargin;
}
// LayoutManager
public int getDecoratedLeft(@NonNull View child) {
    return child.getLeft() - getLeftDecorationWidth(child);
}
```

> 注意：在 RTL 中，也是距离 RV 原点的距离

### getDecoratedEnd(View view) 回 view 右边界点（包含右内边距和右外边距）在父 View 中的位置（以父 View 的（0，0）点位坐标系）

> 通俗地讲：子 View 右边界点到父 View 的（0，0）点的水平间距，不管是否 RTL

```java
// 水平
public int getDecoratedEnd(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedRight(view) + params.rightMargin;
}
```

### getEndPadding() 返回 Recycleview 右侧内边距大小（paddingRight）

```java
// 水平
public int getEndPadding() {
    return mLayoutManager.getPaddingRight();
}
```

### getTransformedStartWithDecoration(View view) 返回 view 水平方向的开始位置（包含左侧的装饰，如你自定义了分割线（ItemDecoration），这个是减去分割线宽度的开始位置），相对父容器

```java
// 水平
public int getTransformedStartWithDecoration(View view) {
    mLayoutManager.getTransformedBoundingBox(view, true, mTmpRect);
    return mTmpRect.left;
}
// LayoutManager
public void getTransformedBoundingBox(@NonNull View child, boolean includeDecorInsets,
        @NonNull Rect out) {
    if (includeDecorInsets) {
        Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
        out.set(-insets.left, -insets.top,
                child.getWidth() + insets.right, child.getHeight() + insets.bottom);
    } else {
        out.set(0, 0, child.getWidth(), child.getHeight());
    }

    if (mRecyclerView != null) {
        final Matrix childMatrix = child.getMatrix();
        if (childMatrix != null && !childMatrix.isIdentity()) {
            final RectF tempRectF = mRecyclerView.mTempRectF;
            tempRectF.set(out);
            childMatrix.mapRect(tempRectF);
            out.set(
                    (int) Math.floor(tempRectF.left),
                    (int) Math.floor(tempRectF.top),
                    (int) Math.ceil(tempRectF.right),
                    (int) Math.ceil(tempRectF.bottom)
            );
        }
    }
    out.offset(child.getLeft(), child.getTop());
}
```

### getTransformedEndWithDecoration(View view) 返回 view 水平方向的结束位置（包含右侧的装饰，如你自定义了分割线（ItemDecoration），这个是带分割线宽度的结束位置），相对父容器

```java
// 水平
public int getTransformedEndWithDecoration(View view) {
    mLayoutManager.getTransformedBoundingBox(view, true, mTmpRect);
    return mTmpRect.right;
}
```

### getMode()  获取 Recycleview 宽度测量模式

### getModeInOther()   获取 Recycleview 高度测量模式
