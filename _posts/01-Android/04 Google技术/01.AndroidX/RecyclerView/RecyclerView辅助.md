---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# RecyclerView之SnapHelper

## SnapHelper介绍

RecyclerView在24.2.0版本中新增了`SnapHelper`这个辅助类，用于辅助RecyclerView在滚动结束时将Item对齐到某个位置。特别是列表横向滑动时，很多时候不会让列表滑到任意位置，而是会有一定的规则限制，这时候就可以通过SnapHelper来定义对齐规则了。

SnapHelper是一个抽象类，官方提供了一个`LinearSnapHelper`的子类，可以让RecyclerView滚动停止时中间的ItemView停留RecyclerView中间位置。25.1.0版本中官方又提供了一个`PagerSnapHelper`的子类，可以使RecyclerView像ViewPager一样的效果，一次只能滑一页，而且居中显示。

## 注意

1. 每次只能注册一个SnapHelper，否则报错

```
java.lang.IllegalStateException: An instance of OnFlingListener already set.
```

2. onScroll和onFling都会滚动，不会冲突吗？

## 官方提供的SnapHelper

### LinearSnapHelper

默认实现是对齐中间的childView到RecyclerView的中间；如果需要更改默认行为，复写`SnapHelper#calculateDistanceToFinalSnap()`方法。

### PagerSnapHelper

每次滚动一页

## SnapHelper分析

### attachToRecyclerView

`SnapHelper#attachToRecyclerView`入口：

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

> SnapHelper是一个抽象类，实现了RecyclerView.OnFlingListener接口，入口方法attachToRecyclerView在SnapHelper中定义，该方法主要起到清理、绑定回调关系和初始化位置的作用，在setupCallbacks中设置了addOnScrollListener和setOnFlingListener两种回调；

### SnapHelper处理回调流程

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

逻辑处理的入口在onScrollStateChanged方法中，当newState==RecyclerView.SCROLL_STATE_IDLE且滚动距离不等于0，触发snapToTargetExistingView方法；snapToTargetExistingView():

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

snapToTargetExistingView()方法顾名思义是移动到指定已存在的View的位置，findSnapView是查到目标的SnapView，calculateDistanceToFinalSnap是计算SnapView到最终位置的距离；由于findSnapView和calculateDistanceToFinalSnap是抽象方法，所以需要子类的具体实现；<br />整理一下滚动状态回调下，SnapHelper的实现流程图如下：

![](http://note.youdao.com/yws/res/41132/D8D7AC46E6794AAF8898386C300E1356#id=HUZe9&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489946047-f5f8a339-ae02-41b2-bd61-d4ba9db321c8.png#averageHue=%23f5f4f4&clientId=u4bb3d248-2555-4&from=paste&height=577&id=u7827bcfc&originHeight=866&originWidth=593&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=100089&status=done&style=none&taskId=u198adf72-be31-4f1e-a76a-030bf4e6f1a&title=&width=395.3333333333333)

#### Fling结果回调处理 OnFlingListener

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

如果velocityX和velocityY都大于最小值的minFlingVelocity(默认值是50)，返回逻辑由snapFromFling来处理：

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

子类实现`findTargetSnapPosition`来决定滚动的position

### SnapHelper重要方法

#### View findSnapView(RecyclerView.LayoutManager layoutManager);

提供给scroll/fling用。在scroll处于idle时需要snap时，回调该方法找一个snap的view。在fling时也会调用

#### int[] calculateDistanceToFinalSnap(RecyclerView.LayoutManager layoutManager, View targetView)

提供给scroll用。参数2 targetView就是findSnapView找到的snap的View。计算滚动到targetView的坐标

#### int findTargetSnapPosition(RecyclerView.LayoutManager layoutManager, int velocityX, int velocityY)

提供给fling用。要snap的在adapter的position。

# OrientationHelper

OrientationHelper其实就是对RecycleView中子View管理的工具类，并且它只是一个抽象类，类中定义了获取View布局信息的相关方法。<br />默认实现：`createHorizontalHelper`（对应水平的LayoutManager）和`createVerticalHelper`（对应竖直的LayoutManager）方法

## API （需要注意RTL，很多API都是相对于Left和Right的，要注意转换）

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

注：RV左上角(0,0)为坐标原点，下面原点都指该点

### getTotalSpace() RV宽/高减去padding

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

### getEnd() end边距离原点的距离，包括padding（同RV的宽度）

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

### getStartAfterPadding() start边距离原点的距离，加上paddingStart距离 （同RV的paddingLeft）

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

### getEndAfterPadding() end边距离原点的距离，加上paddingEnd距离 （同RV的width减去paddingRight，针对水平方向）

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

### getDecoratedMeasurement(View view) 返回view在水平方向上所占位置的大小（包括view的左右margin和padding）

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

### getDecoratedMeasurementInOther(View view) 返回view在竖直方向上所占位置的大小（包括view的上下外边距）

```java
// 水平
public int getDecoratedMeasurementInOther(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedMeasuredHeight(view) + params.topMargin
            + params.bottomMargin;
}
```

### getDecoratedStart(View view) 返回view左边界点（包含左内边距和左外边距）在父View中的位置（以父View的（0，0）点位坐标系）

> 通俗地讲：子View左边界点到父View的（0，0）点的水平间距，不管是否RTL

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

> 注意：在RTL中，也是距离RV原点的距离

### getDecoratedEnd(View view) 回view右边界点（包含右内边距和右外边距）在父View中的位置（以父View的（0，0）点位坐标系）

> 通俗地讲：子View右边界点到父View的（0，0）点的水平间距，不管是否RTL

```java
// 水平
public int getDecoratedEnd(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)
            view.getLayoutParams();
    return mLayoutManager.getDecoratedRight(view) + params.rightMargin;
}
```

### getEndPadding() 返回Recycleview右侧内边距大小（paddingRight）

```java
// 水平
public int getEndPadding() {
    return mLayoutManager.getPaddingRight();
}
```

### getTransformedStartWithDecoration(View view) 返回view水平方向的开始位置（包含左侧的装饰，如你自定义了分割线（ItemDecoration），这个是减去分割线宽度的开始位置），相对父容器

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

### getTransformedEndWithDecoration(View view) 返回view水平方向的结束位置（包含右侧的装饰，如你自定义了分割线（ItemDecoration），这个是带分割线宽度的结束位置），相对父容器

```java
// 水平
public int getTransformedEndWithDecoration(View view) {
    mLayoutManager.getTransformedBoundingBox(view, true, mTmpRect);
    return mTmpRect.right;
}
```

### getMode()  获取Recycleview宽度测量模式

### getModeInOther()   获取Recycleview高度测量模式
