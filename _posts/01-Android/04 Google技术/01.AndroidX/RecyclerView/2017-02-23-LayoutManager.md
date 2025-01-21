---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:28:15 pm
title: LayoutManager
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
aliases: [什么是 LayoutManager？]
linter-yaml-title-alias: 什么是 LayoutManager？
---

# 什么是 LayoutManager？

LayoutManager 是 RecyclerView 中 Item 的布局管理器，LayoutManager 是 RecyclerView 的内部类，RecyclerView 把它的测量和布局工作都转交给了 LayoutManager。可以控制 Item 的位置，回收，显示，大小和滚动等。

# 系统提供的 LayoutManager

## LinearLayoutManager

![vertical未reverse](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936168937-0b9dc4dc-b772-4b34-bba4-e1a0a7d17dc8.gif#averageHue=%23bbd0b3&clientId=uf83f1ffe-ae0a-4&from=paste&height=370&id=u0c2dc91a&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=uae989ca2-eb19-443a-969a-1c4f09abd9a&title=vertical%E6%9C%AAreverse&width=211 "vertical未reverse")![vertical且reverse](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936270993-4f84f20b-4610-42fa-8fae-b2a95187ea20.gif#averageHue=%23bbd0b3&clientId=uf83f1ffe-ae0a-4&from=paste&height=372&id=u5f17c8f4&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=uf1f60bf7-7118-4852-a089-727018479f7&title=vertical%E4%B8%94reverse&width=212 "vertical且reverse")![horizontal](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936190076-6024aab2-dfe7-4303-8f2f-24db71df4e97.gif#averageHue=%23dac1a1&clientId=uf83f1ffe-ae0a-4&from=paste&height=370&id=u8de4b690&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u1fe084e2-24d5-458a-9d60-47e9d82b9e6&title=horizontal&width=211 "horizontal")

> 图一是 VERTICAL 未 reverse；图二是 VERTICAL 且 reverse 了；图三是 HORIZONTAL

### 提供的常见方法

1. int findFirstVisibleItemPosition() 找到最前显示 item 的位置
2. int findFirstCompletelyVisibleItemPosition() 找到最前完全显示 item 的位置
3. int findLastCompletelyVisibleItemPosition() 找到最后完全显示 item 的位置
4. int findLastVisibleItemPosition() 找到最后显示 item 的位置

## GridLayoutManager

提供了与 GridView 类似的功能，网格展示。<br />![vertical未reverse](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936381057-47a389cf-2294-4fda-b040-d3cabec8e58d.png#averageHue=%23dbcfac&clientId=uf83f1ffe-ae0a-4&from=paste&height=426&id=uac1f28c8&originHeight=1885&originWidth=1079&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=494308&status=done&style=none&taskId=u686be5f5-5156-4e51-af2d-646a5a46ff8&title=vertical%E6%9C%AAreverse&width=244 "vertical未reverse")![vertical且reverse](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936496260-d801591a-b686-4115-99e6-8741b922cbbb.png#averageHue=%23dbcfac&clientId=uf83f1ffe-ae0a-4&from=paste&height=449&id=uccbd7df4&originHeight=1887&originWidth=1079&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=492671&status=done&style=none&taskId=u98174c9c-0cd6-4c53-88c7-e97933291da&title=vertical%E4%B8%94reverse&width=257 "vertical且reverse")![horizontal](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936556550-61ffa4ea-79fd-47b5-90e5-12c44e65f0d0.gif#averageHue=%23bfd1b2&clientId=uf83f1ffe-ae0a-4&from=paste&height=349&id=u8efe440b&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u18e85e76-52bf-43be-b34e-e43cbfe7cdf&title=horizontal&width=199 "horizontal")<br />GridLayoutManager 的 Vertical 排列：

> 1 2 3
> 4 5 6
> 7 8 9

GridLayoutManager 的 Horizontal 排列：

> 1 3 5 7
> 2 4 6 8

### GridLayoutManager wrap_content 无效

## StaggeredGridLayoutManager

StaggeredGridLayoutManager 交错的网格布局，如果子 View 宽高一致，那效果就和 GridLayoutManager 一样，如果子 View 宽高不一致，就可以实现瀑布流效果。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936757812-ea0ac68b-fee2-408b-805c-6fc8e584c14d.png#averageHue=%23bbc8ac&clientId=uf83f1ffe-ae0a-4&from=paste&height=592&id=u9b611355&originHeight=1920&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=1656356&status=done&style=none&taskId=u32f7946c-5cb4-4d46-88ab-83aaa5b42dc&title=&width=333)

## FlexboxLayoutManager

[flexbox-layout](https://github.com/google/flexbox-layout) 流式布局<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936822631-2a7108bb-6225-4917-acd3-acec007f24af.png#averageHue=%23e8dfd3&clientId=uf83f1ffe-ae0a-4&from=paste&height=622&id=u27151a33&originHeight=1920&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=96724&status=done&style=none&taskId=uf4611c31-deb9-45c5-b933-5dd55b1c777&title=&width=350)

# 自定义 LayoutManager

## 自定义 LayoutManager 常见 API

### 添加 View

#### LayoutManager#addView 添加一个 view 到 RecyclerView

- public void addView(View child)
- public void addView(View child, int index)

```java
// LayoutManager
private void addViewInt(View child, int index, boolean disappearing) {
    mChildHelper.addView(child, index, false);
}
// ChildHelper
void addView(View child, int index, boolean hidden) {
    final int offset;
    if (index < 0) {
        offset = mCallback.getChildCount();
    } else {
        offset = getOffset(index);
    }
    mBucket.insert(offset, hidden);
    if (hidden) {
        hideViewInternal(child);
    }
    mCallback.addView(child, offset);
}
// RecyclerView
private void initChildrenHelper() {
    mChildHelper = new ChildHelper(new ChildHelper.Callback() {
        @Override
        public void addView(View child, int index) {
            RecyclerView.this.addView(child, index);
            dispatchChildAttached(child);
        }
    }
}
```

LayoutManager#addView，通过 ChildHelper#addView，最后是调用的 RecyclerView#addView，将 itemView 添加到 RecyclerView 中去。

#### addDisappearingView

```
addDisappearingView(View child)
addDisappearingView(View child, int index)
```

addDisappearingView 方法主要用于支持预测动画，例如：notifyItemRemoved 时的删除动画

### 测量布局 API

#### LayoutManager#measureChildXXX 测量

- boolean shouldMeasureChild(View child, int widthSpec, int heightSpec, LayoutParams lp) 是否需要测量 child（child 从未被测量）
- boolean shouldReMeasureChild(View child, int widthSpec, int heightSpec, LayoutParams lp) 是否需要重新测量 child（child 已经测量过一次了）
- public static int getChildMeasureSpec(int parentSize, int parentMode, int padding, int childDimension, boolean canScroll)
- public void measureChild(View child, int widthUsed, int heightUsed) 测量 child，不包括 margin
- public void measureChildWithMargins(View child, int widthUsed, int heightUsed) 测量 child，包括 margin
- public int getDecoratedMeasuredWidth([@NonNull](/NonNull) View child)  获取 child 测量后的宽度 +docorration 的宽度
- public int getDecoratedMeasuredHeight([@NonNull](/NonNull) View child) 获取 child 测量后的长度 +docorration 的长度

##### LayoutManager#getChildMeasureSpec

```java
// LayoutManager
public static int getChildMeasureSpec(int parentSize, int parentMode, int padding, int childDimension, boolean canScroll) {
    int size = Math.max(0, parentSize - padding); // RecyclerView提供大尺寸-RecyclerView的padding
    int resultSize = 0;
    int resultMode = 0;
    if (canScroll) { // RecyclerView能滚动
        if (childDimension >= 0) { // childDimension为具体的尺寸，resultSize为具体的尺寸，resultMode为EXACTLY
            resultSize = childDimension; 
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) { // childDimension为MATCH_PARENT
            switch (parentMode) {
                case MeasureSpec.AT_MOST:
                case MeasureSpec.EXACTLY: // RecyclerView为AT_MOST或EXACTLY，resultSize为RecyclerView所能提供的最大尺寸
                    resultSize = size;
                    resultMode = parentMode;
                    break;
                case MeasureSpec.UNSPECIFIED:
                    resultSize = 0;
                    resultMode = MeasureSpec.UNSPECIFIED;
                    break;
            }
        } else if (childDimension == LayoutParams.WRAP_CONTENT) { // childDimension为WRAP_CONTENT，resultSize=0
            resultSize = 0;
            resultMode = MeasureSpec.UNSPECIFIED;
        }
    } else { // RecyclerView不能滚动
        if (childDimension >= 0) { // childDimension为具体的尺寸，resultSize为具体的尺寸，resultMode为EXACTLY
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) { // childDimension为MATCH_PARENT，resultSize为RecyclerView所能提供的最大尺寸，resultMode为RecyclerView的mode
            resultSize = size;
            resultMode = parentMode;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {  // childDimension为WRAP_CONTENT，resultSize为RecyclerView所能提供的最大尺寸
            resultSize = size;
            if (parentMode == MeasureSpec.AT_MOST || parentMode == MeasureSpec.EXACTLY) {
                resultMode = MeasureSpec.AT_MOST;
            } else {
                resultMode = MeasureSpec.UNSPECIFIED;
            }
        }
    }
    //noinspection WrongConstant
    return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
}
```

参数：

1. parentSize RecyclerView 提供给子 View 的大小
2. parentMode RecyclerView 的 mode
3. padding RecyclerView 的 padding
4. childDimension child 期望的具体尺寸或 `MATCH_PARENT/WRAP_CONTENT`，一般通过 child 的 LayoutParams 获取
5. canScroll RecyclerView 是否能滚动

##### LayoutManager#measureChild 测量子 view，不包括子 view 的 margin

```java
// LayoutManager
public void measureChild(@NonNull View child, int widthUsed, int heightUsed) {
    final LayoutParams lp = (LayoutParams) child.getLayoutParams();

    final Rect insets = mRecyclerView.getItemDecorInsetsForChild(child); // 获取child的decoration，Rect包含了child到left/top/right/bottom的间距
    widthUsed += insets.left + insets.right; // 水平方向上所有decoration的使用的尺寸
    heightUsed += insets.top + insets.bottom; // 竖直方向上所有decoration的使用的尺寸
    final int widthSpec = getChildMeasureSpec(getWidth(), getWidthMode(),
            getPaddingLeft() + getPaddingRight() + widthUsed, lp.width,
            canScrollHorizontally()); // width测量
    final int heightSpec = getChildMeasureSpec(getHeight(), getHeightMode(),
            getPaddingTop() + getPaddingBottom() + heightUsed, lp.height,
            canScrollVertically()); // height测量
    if (shouldMeasureChild(child, widthSpec, heightSpec, lp)) {
        child.measure(widthSpec, heightSpec);
    }
}
```

##### LayoutManager#measureChildWithMargins 测量子 view，包括子 view 的 margin

```java
// LayoutManager
public void measureChildWithMargins(@NonNull View child, int widthUsed, int heightUsed) {
    final LayoutParams lp = (LayoutParams) child.getLayoutParams();

    final Rect insets = mRecyclerView.getItemDecorInsetsForChild(child);
    widthUsed += insets.left + insets.right;
    heightUsed += insets.top + insets.bottom;

    final int widthSpec = getChildMeasureSpec(getWidth(), getWidthMode(),
            getPaddingLeft() + getPaddingRight()
                    + lp.leftMargin + lp.rightMargin + widthUsed, lp.width,
            canScrollHorizontally());
    final int heightSpec = getChildMeasureSpec(getHeight(), getHeightMode(),
            getPaddingTop() + getPaddingBottom()
                    + lp.topMargin + lp.bottomMargin + heightUsed, lp.height,
            canScrollVertically());
    if (shouldMeasureChild(child, widthSpec, heightSpec, lp)) {
        child.measure(widthSpec, heightSpec);
    }
}
```

和 `measureChild` 不同的是，measureChildWithMargins 包括了 child 的 margin

##### LayoutManager#getDecoratedMeasuredWidth

```java
// LayoutManager
public int getDecoratedMeasuredWidth(@NonNull View child) {
    final Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
    return child.getMeasuredWidth() + insets.left + insets.right;
}
```

##### LayoutManager#getDecoratedMeasuredHeight

```java
// LayoutManager
public int getDecoratedMeasuredHeight(@NonNull View child) {
    final Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
    return child.getMeasuredHeight() + insets.top + insets.bottom;
}
```

#### LayoutManager#layoutDecoratedXXX 布局

- public void layoutDecorated(View child, int left, int top, int right, int bottom)
- public void layoutDecoratedWithMargins(View child, int left, int top, int right, int bottom)

##### layoutDecorated layout 一个 child，不包括其 margin

```java
// LayoutManager
public void layoutDecorated(@NonNull View child, int left, int top, int right, int bottom) {
    final Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
    child.layout(left + insets.left, top + insets.top, right - insets.right,
            bottom - insets.bottom);
}
```

##### layoutDecoratedWithMargins layout 一个 child，包括其 margin

```java
public void layoutDecoratedWithMargins(@NonNull View child, int left, int top, int right,
        int bottom) {
    final LayoutParams lp = (LayoutParams) child.getLayoutParams();
    final Rect insets = lp.mDecorInsets;
    child.layout(left + insets.left + lp.leftMargin, top + insets.top + lp.topMargin,
            right - insets.right - lp.rightMargin,
            bottom - insets.bottom - lp.bottomMargin);
}
```

### 复用

#### Recycler#getViewForPosition 根据 position 获取 view（从缓存或创建）

- View getViewForPosition(int position)
- View getViewForPosition(int position, boolean dryRun)

```java
// RecyclerView#Recycler
View getViewForPosition(int position, boolean dryRun) {
    return tryGetViewHolderForPositionByDeadline(position, dryRun, FOREVER_NS).itemView;
}
```

从 Recycler 中获取到一个不会为 null 的 View，如果 position 超过 itemCount 或小于 0，就会直接抛出异常。内部代码逻辑就是从不同的缓存 (mAttachedScrap、mCachedViews、mRecyclerPool) 中拿 View，有就直接返回这个 View，没有就用 onCreateViewHolder 创建绑定（onBindViewHolder）并返回。

> 一般在 LayoutManager 中获取子 View 时用到

### 回收

#### detach/attach

##### LayoutManager#detachAndScrapAttachedViews detach 和分离所有子 view

- public void detachAndScrapAttachedViews([@NonNull](/NonNull) Recycler recycler) 临时 detach 和分离所有已经 attached 的 child，view 会分离到 recycler

```java
// LayoutManager
public void detachAndScrapAttachedViews(@NonNull Recycler recycler) {
    final int childCount = getChildCount();
    for (int i = childCount - 1; i >= 0; i--) {
        final View v = getChildAt(i);
        scrapOrRecycleView(recycler, i, v);
    }
}
private void scrapOrRecycleView(Recycler recycler, int index, View view) {
    final ViewHolder viewHolder = getChildViewHolderInt(view);
    if (viewHolder.shouldIgnore()) {
        return;
    }
    if (viewHolder.isInvalid() && !viewHolder.isRemoved()
            && !mRecyclerView.mAdapter.hasStableIds()) { // ViewHolder data处于invalid、未被removed、未设置stableId
        removeViewAt(index); // 从RecyclerView中remove掉child
        recycler.recycleViewHolderInternal(viewHolder); // 回收ViewHolder，先缓存到mCachedViews，mCachedViews存满了移除其第0个ViewHolder，缓存到mRecyclerPool
    } else {
        detachViewAt(index); 
        recycler.scrapView(view);
        mRecyclerView.mViewInfoStore.onViewDetached(viewHolder);
    }
}
```

##### detachAndScrapView detach 和分离回收单个 view

- public void detachAndScrapView(View child, Recycler recycler)

```java
public void detachAndScrapView(@NonNull View child, @NonNull Recycler recycler) {
    int index = mChildHelper.indexOfChild(child);
    scrapOrRecycleView(recycler, index, child);
}
```

- public void detachAndScrapViewAt(int index, Recycler recycler)

```java
public void detachAndScrapViewAt(int index, @NonNull Recycler recycler) {
    final View child = getChildAt(index);
    scrapOrRecycleView(recycler, index, child);
}
```

##### LayoutManager#detachViewAt 从 RecyclerView 中 detach 单个 view

- public void detachViewAt(int index)

```java
// LayoutManager
public void detachViewAt(int index) {
    detachViewInternal(index, getChildAt(index));
}
```

- public void detachView([@NonNull](/NonNull) View child)

```java
// LayoutManager
public void detachView(@NonNull View child) {
    final int ind = mChildHelper.indexOfChild(child);
    if (ind >= 0) {
        detachViewInternal(ind, child);
    }
}
private void detachViewInternal(int index, @NonNull View view) {
    mChildHelper.detachViewFromParent(index);
}
```

- public void removeDetachedView([@NonNull](/NonNull) View child)

```java
public void removeDetachedView(@NonNull View child) {
    mRecyclerView.removeDetachedView(child, false);
}
```

##### LayourManager#attachView attach 单个 view

- public void attachView([@NonNull](/NonNull) View child, int index, LayoutParams lp)

```java
public void attachView(@NonNull View child, int index, LayoutParams lp) {
    ViewHolder vh = getChildViewHolderInt(child);
    if (vh.isRemoved()) {
        mRecyclerView.mViewInfoStore.addToDisappearedInLayout(vh);
    } else {
        mRecyclerView.mViewInfoStore.removeFromDisappearedInLayout(vh);
    }
    mChildHelper.attachViewToParent(child, index, lp, vh.isRemoved());
    if (DISPATCH_TEMP_DETACH)  {
        ViewCompat.dispatchFinishTemporaryDetach(child);
    }
}
```

#### remove

##### LayourManager#removeAndRecycleView/removeAndRecycleViewAt 移除一个 view 并回收

- public void removeAndRecycleView([@NonNull](/NonNull) View child, [@NonNull](/NonNull) Recycler recycler)
- public void removeAndRecycleViewAt(int index, [@NonNull](/NonNull) Recycler recycler)

```java
// LayourManager
public void removeAndRecycleView(View child, Recycler recycler) {
    removeView(child); // 从RecyclerView中移除child
    recycler.recycleView(child);
}

public void removeAndRecycleViewAt(int index, @NonNull Recycler recycler) {
    final View view = getChildAt(index);
    removeViewAt(index); // 从RecyclerView中移除child
    recycler.recycleView(view);
}
```

##### removeAndRecycleAllViews 移除所有的 view 并回收

- public void removeAndRecycleAllViews([@NonNull](/NonNull) Recycler recycler)

```java
// LayourManager
public void removeAndRecycleAllViews(@NonNull Recycler recycler) {
    for (int i = getChildCount() - 1; i >= 0; i--) {
        final View view = getChildAt(i);
        if (!getChildViewHolderInt(view).shouldIgnore()) {
            removeAndRecycleViewAt(i, recycler);
        }
    }
}
```

##### recycleView 回收某个 view

```java
// LayourManager
public void recycleView(@NonNull View view) {
    recycleViewHolderInternal(holder);
}
```

##### LayoutManager#removeView 从 RecyclerView 中 remove view

- public void removeViewAt(int index) 移除某个 index 的 view；应该用 `recycleView(@NonNull View view)` 来回收该 view

```java
// LayoutManager
public void removeViewAt(int index) {
    final View child = getChildAt(index);
    if (child != null) {
        mChildHelper.removeViewAt(index);
    }
}
```

- public void removeView(View child) 移除 child view

```java
// LayoutManager
public void removeView(View child) {
    mChildHelper.removeView(child);
}
```

### 移动子 ViewAPI

#### RecyclerView#offsetChildrenVertical 竖直移动所有子 view

```java
public void offsetChildrenHorizontal(@Px int dx) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetLeftAndRight(dx);
    }
}
```

#### RecyclerView#offsetChildrenHorizontal 水平移动所有子 view

```java
public void offsetChildrenHorizontal(@Px int dx) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetLeftAndRight(dx);
    }
}
```

### 工具 API

#### LayoutManager#getPosition

- public int getPosition(View view) // 获取某个 view 的 layoutPosition

#### getXXX 都没有考虑 margin 的存在

- 获取 child left/right/top/bottom 边距离 RecyclerView 的间距，包括了 Decoration 尺寸

```java
public int getDecoratedLeft(@NonNull View child) { // 获取child的left边距离RecyclerView的边距 - child left边的decoration width
    return child.getLeft() - getLeftDecorationWidth(child);
}
public int getDecoratedRight(@NonNull View child) { // 获取child的right边距离RecyclerView的边距 + child right边的decoration width
    return child.getRight() + getRightDecorationWidth(child);
}
public int getDecoratedTop(@NonNull View child) { // 获取child的top边距离RecyclerView的边距 - child top边的decoration height
    return child.getTop() - getTopDecorationHeight(child);
}
public int getDecoratedBottom(@NonNull View child) { // 获取child的botom边距离RecyclerView的边距 + child botto边的decoration height
    return child.getBottom() + getBottomDecorationHeight(child);
}
```

- 获取 child 在各个 left/right/top/bottom 的 decoration 的 width 尺寸

```
public int getTopDecorationHeight(@NonNull View child) { // 获取child top方向decoration的height
    return ((LayoutParams) child.getLayoutParams()).mDecorInsets.top; 
}
public int getBottomDecorationHeight(@NonNull View child) { // 获取child bottom方向decoration的height
    return ((LayoutParams) child.getLayoutParams()).mDecorInsets.bottom;
}
public int getLeftDecorationWidth(@NonNull View child) { // 获取child left方向decoration的width
    return ((LayoutParams) child.getLayoutParams()).mDecorInsets.left;
}
public int getRightDecorationWidth(@NonNull View child) { // 获取child right方向decoration的width
    return ((LayoutParams) child.getLayoutParams()).mDecorInsets.right;
}
```

#### getDecoratedMeasurementHorizontal/getDecoratedMeasurementVertical 包括 margin

```
/**
 * 获取某个childView在水平方向所占的空间
 */
public int getDecoratedMeasurementHorizontal(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams)view.getLayoutParams();
    return getDecoratedMeasuredWidth(view) + params.leftMargin + params.rightMargin;
}

/**
 * 获取某个childView在竖直方向所占的空间
 */
public int getDecoratedMeasurementVertical(View view) {
    final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) view.getLayoutParams();
    return getDecoratedMeasuredHeight(view) + params.topMargin + params.bottomMargin;
}
```

---

## 自定义 LayoutManager 步骤

### 实现 generateDefaultLayoutParams 给有子 view 默认的 LayoutParams

- generateDefaultLayoutParams 是个模板代码，一般情况用这个就 ok

```java
// 全部返回wrap_content
@Override
public RecyclerView.LayoutParams generateDefaultLayoutParams() {
    return new RecyclerView.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
}

// 按照具体方向来返回
override fun generateDefaultLayoutParams(): RecyclerView.LayoutParams {
    return if (orientation == HORIZONTAL) {
        RecyclerView.LayoutParams(
            RecyclerView.LayoutParams.WRAP_CONTENT,
            RecyclerView.LayoutParams.MATCH_PARENT
        )
    } else {
        RecyclerView.LayoutParams(
            RecyclerView.LayoutParams.MATCH_PARENT,
            RecyclerView.LayoutParams.WRAP_CONTENT
        )
    }
}
```

generateDefaultLayoutParams 在 `recycler.getViewForPosition(position)` 时调用到，返回一个你想要默认应用给所有从 Recycler 中获得的子视图做参数的 RecyclerView.LayoutParams 实例：

```java
// Recycler Android29
public View getViewForPosition(int position) {
    return getViewForPosition(position, false);
}
View getViewForPosition(int position, boolean dryRun) {
    return tryGetViewHolderForPositionByDeadline(position, dryRun, FOREVER_NS).itemView;
}
ViewHolder tryGetViewHolderForPositionByDeadline(int position, boolean dryRun, long deadlineNs) {
    // ... 从缓存复用ViewHolder、创建ViewHolder、绑定ViewHolder
    final ViewGroup.LayoutParams lp = holder.itemView.getLayoutParams();
    final LayoutParams rvLayoutParams;
    if (lp == null) {
        // lp为null，会调用mLayout.generateDefaultLayoutParams()为每个ItemView设置LayoutParams
        rvLayoutParams = (LayoutParams) generateDefaultLayoutParams();
        holder.itemView.setLayoutParams(rvLayoutParams);
    } else if (!checkLayoutParams(lp)) {
        rvLayoutParams = (LayoutParams) generateLayoutParams(lp);
        holder.itemView.setLayoutParams(rvLayoutParams);
    } else {
        rvLayoutParams = (LayoutParams) lp;
    }
    rvLayoutParams.mViewHolder = holder;
    rvLayoutParams.mPendingInvalidate = fromScrapOrHiddenOrCache && bound;
    return holder;
}
```

**注意：** 如果需要存储一些额外的东西在 LayoutParams 里，这里返回你自定义的 LayoutParams 即可。自定义的 LayoutParams 需要继承自 `RecyclerView.LayoutParams`。

### 使用 OrientationHelper【可选】

OrientationHelper 是一个屏蔽水平和垂直方向的类，让自定义 LayoutManager 更方便，开发者无需关注方向

在 LayoutManager 构造方法中初始化

```java
class MyLinearLayoutManager : RecyclerView.LayoutManager() {
    private var mOrientation: Int
    private var mOrientationHelper: OrientationHelper
    init {
        mOrientation = RecyclerView.HORIZONTAL
        mOrientationHelper = OrientationHelper.createOrientationHelper(this, RecyclerView.VERTICAL)
    }
    fun setOrientation(@RecyclerView.Orientation orientation: Int) {
        require(!(orientation != RecyclerView.HORIZONTAL && orientation != RecyclerView.VERTICAL)) { "invalid orientation:$orientation" }
        if (orientation != mOrientation) {
            mOrientationHelper = OrientationHelper.createOrientationHelper(this, orientation)
            mOrientation = orientation
            requestLayout()
        }
    }
    // ...
}
```

### 按需，重写 onMeasure() 或 isAutoMeasureEnabled() 方法

LayoutManger 的 onMeasure() 有默认实现，并且 isAutoMeasureEnabled() 默认返回的 false，默认的只能适配 RecyclerView 为 `MATCH_PARENT` 或具体的尺寸值。

isAutoMeasureEnabled() 是自测量模式，给 RecyclerView 的 wrap_content 的用的，如果你的 LayoutManager 要支持 wrap_content 那就必须重写。

### 实现 onLayoutChildren 进行测量布局

#### onLayoutChildren 调用时机

1. 在 RecyclerView 初始化时，会被调用两次。
2. 在调用 adapter.notifyDataSetChanged() 时，会被调用。
3. 在调用 setAdapter 替换 Adapter 时,会被调用。
4. 在 RecyclerView 执行动画时，它也会被调用。

> 即 RecyclerView 初始化、数据源改变时都会被调用

#### 暂时分离到 scrap

进行布局之前，我们需要调用 `detachAndScrapAttachedViews` 方法把屏幕中的 Items 都分离出来暂存到 scrap 缓存中去，内部调整好位置和数据后，再把它添加回去，

> onLayoutChildren 可能会调用 2 次

#### layout 当前屏幕可见的所有子 View

1. 通过 `Recycler#getViewForPosition(position)` 从缓存中获取 view（可以从 detachAndScrapAttachedViews 保存的 scrap 缓存中取出来）
2. 一般定义个一个 fill 方法，大神称为 fill 机制（在 onLayoutChildren 和实现 scrollXXXBy 调用）
3. addView 添加到 RecyclerView 中去
4. 获取到 Item 并重新添加了之后，我们还需要对它进行测量，这时候可以调用 `measureChild` 或 `measureChildWithMargins` 方法
5. 布局，用 layoutDecorated 或 layoutDecoratedWithMargins

##### fill 机制

1. 找到第一个可见的 position
2. 找到边距
3. scrap 所有 view
4. 布局所有可见的 position

> 只测量布局当前屏幕可见的 itemView，不要所有的 view 都测量、layout 出来

### ViewHolder 回收

不再屏幕上的 view，通过 `Recycler#removeAndRecycleView(child, recycler)` 将其从屏幕上移除，并缓存到 mCahcedViews 或 RecycledViewPool 中去

### 滑动

#### 实现 canScrollHorizontally() 和 canScrollVertically() 决定是否能滑动及滑动的方向

```kotlin
override fun canScrollVertically(): Boolean {
    return mOrientation == RecyclerView.VERTICAL
}

override fun canScrollHorizontally(): Boolean {
    return mOrientation == RecyclerView.HORIZONTAL
}
```

#### 实现 scrollHorizontallyBy() 和 scrollVerticallyBy() 进行滑动处理

参数：

```java
1. dx>0就是手指从右滑向左，dy>0就是手指从下滑向上，同理dx<0,dy<0则反
2. 返回值就是让RecyclerView知道LayoutManager真实的滑动距离，return 0时RecyclerView就会展示overScorll状态以及NestedScrolling的后续处理
```

一个合格的 LayoutManager 至少 3 个流程顺序是：`填充View`-`移动View`-`回收View`，并且顺序最好如上面代码一样先填充 - 再移动 - 最后回收，当然复杂的情况的 LayoutManager 可以多加一些条件检测和特殊处理，例如 LinearLayoutManager 就是先回收 - 再填充 - 再回收 - 最后移动。

1. 填充：调用 fill 方法获取下一个 itemView
2. 移动：offsetChildrenVertical/offsetChildrenHorizontal 移动所有的 itemView
3. 回收：removeAndRecycleView 回收 child

### scrollToPosition() 和 smoothScrollToPosition() 支持

给 LayoutManager 添加滚动到特定位置的功能。 可以带有有动画效 (和 smoothScrollToPosition) 果，也可以没有 ()scrollToPosition。

#### scrollToPosition

增加 mPendingScrollPosition 变量，在 scrollToPosition() 方法中对其赋值，调用 requestLayout() 方法，然后 onLayoutChildren() 方法会再次回调，这时对锚点 position 重新赋值，记住一定做好 position 的合法校验。

```java
private var mPendingPosition = RecyclerView.NO_POSITION

override fun onLayoutChildren(recycler: RecyclerView.Recycler, state: RecyclerView.State) {
	...省略代码

    var currentPosition = 0
    if (mPendingPosition != RecyclerView.NO_POSITION){
        currentPosition = mPendingPosition
    }
    ...省略代码
}

override fun scrollToPosition(position: Int) {
    if (position < 0 || position >= itemCount) return
    mPendingPosition = position
    requestLayout()
}
```

> 适配 scrollToPosition 就是更新一下新的起始点

#### smoothScrollToPosition

在带有动画的情况下，我们需要使用一些稍微不同的方法。 在这方法里我们需要创建一个 RecyclerView.SmoothScroller 实例， 然后在方法返回前请求 startSmoothScroll() 启动动画。

RecyclerView.SmoothScroller 是提供 API 的抽象类，含有四个方法：

```java
onStart()：当滑动动画开始时被触发。
onStop()：当滑动动画停止时被触发。
onSeekTargetStep(int dx,int dy,State state,Action action)：当 scroller 搜索目标 view 时被重复调用，这个方法负责读取提供的 dx/dy，然后更新应该在这两个方向移动的距离。 这个方法有一个RecyclerView.SmoothScroller.Action实例做参数。 通过向 action 的 update()方法传递新的 dx, dy, duration 和 Interpolator ， 告诉 view 在下一个阶段应该执行怎样的动画。如果动画耗时过长，框架会对你发出警告， 应该调整动画的步骤，尽量和框架标准的动画耗时相同。
onTargetFound()：只在目标视图被 attach 后调用一次。 这是将目标视图要通过动画移动到准确位置最后的场所。在内部，当 view 被 attach 时使用 LayoutManager 的 findViewByPosition() 方法 查找对象。如果你的 LayoutManager 可以有效匹配 view 和 position ， 可以覆写这个方法来优化性能。默认提供的实现是通过每次遍历所有子视图查找。
```

你可以自己实现一个 scroller 达到你想要的效果。不过这里我们只使用系统提供的 LinearSmoothScroller 就好了。只需实现一个方法 computeScrollVectorForPosition()， 然后告诉 scroller 初始方向还有从当前位置滚动到目标位置的大概距离。

```java
@Override
public void smoothScrollToPosition(RecyclerView recyclerView, RecyclerView.State state, final int position) {
    if (position >= getItemCount()) {
        Log.e(TAG, "Cannot scroll to "+position+", item count is "+getItemCount());
        return;
    }

    /*
     * LinearSmoothScroller's default behavior is to scroll the contents until
     * the child is fully visible. It will snap to the top-left or bottom-right
     * of the parent depending on whether the direction of travel was positive
     * or negative.
     */
    LinearSmoothScroller scroller = new LinearSmoothScroller(recyclerView.getContext()) {
        /*
         * LinearSmoothScroller, at a minimum, just need to know the vector
         * (x/y distance) to travel in order to get from the current positioning
         * to the target.
         */
        @Override
        public PointF computeScrollVectorForPosition(int targetPosition) {
            final int rowOffset = getGlobalRowOfPosition(targetPosition)
                    - getGlobalRowOfPosition(mFirstVisiblePosition);
            final int columnOffset = getGlobalColumnOfPosition(targetPosition)
                    - getGlobalColumnOfPosition(mFirstVisiblePosition);

            return new PointF(columnOffset * mDecoratedChildWidth, rowOffset * mDecoratedChildHeight);
        }
    };
    scroller.setTargetPosition(position);
    startSmoothScroll(scroller);
}
```

### Predictive Item Animations 期望的 item 动画

onLayoutChildren() 通常只会 在父控件 RecyclerView 初始化布局 或者 数据集的大小 (比如 item 的数量) 改变时调用一次。 Predictive Item Animations 这个特性允许我们给 view (基于数据改变产生) 的过渡动画 提供更多有用的信息。想要使用这个特性，就要告诉 框架我们的 LayoutManager 提供了这个附加数据：

```java
@Override
public boolean supportsPredictiveItemAnimations() {
    return true;
}
```

有了这个改动，onLayoutChildren() 会在每次数据集改变后被调用两次， 一次是 " 预布局 "(pre-layout) 阶段，一次是真实布局 (real layout)

### preLayout

### 解决软键盘弹出或收起导致 onLayoutChildren() 方法被重新调用的问题

在滚动一段距离后，让软键盘弹出，发现 LayoutManager 自动回到 position=0 那里，再滚动一段距离，软键盘收起，LayoutManager 又自动回到 position=0 那里。

分析原因可以知道是 onLayoutChildren 方法被重新调用导致，因为 onLayoutChildren 方法中我们的 currentPosition=0，所以导致了 LayoutManager 从 0 开始重新布局。下面我们开始修正 position 为真实滚动后的值。

```kotlin
override fun onLayoutChildren(recycler: RecyclerView.Recycler, state: RecyclerView.State) {

    var totalSpace = width - paddingRight

    var currentPosition = 0
    var fixOffset = 0

    //当childCount != 0时，证明是已经填充过View的，因为有回收
    //所以直接赋值为第一个child的position就可以
    if (childCount != 0) {
        currentPosition = getPosition(getChildAt(0)!!)
        fixOffset = getDecoratedLeft(getChildAt(0)!!)
    }
			//...省略代码
    offsetChildrenHorizontal(fixOffset)
}
```

### 数据集改变 notifyDataSetChanged

当使用 notifyDataSetChanged() 触发 RecyclerView.Adapter 的更新操作时， LayoutManager 负责更新布局中的视图，这时 onLayoutChildren() 会被再次调用，需要分数据集变大，变小，清空来处理各种情况

```java
@Override
public void onLayoutChildren(RecyclerView.Recycler recycler, RecyclerView.State state) {
    //We have nothing to show for an empty data set but clear any existing views
    if (getItemCount() == 0) {
        detachAndScrapAttachedViews(recycler);
        return;
    }

    //...on empty layout, update child size measurements
    if (getChildCount() == 0) {
        //Scrap measure one child
        View scrap = recycler.getViewForPosition(0);
        addView(scrap);
        measureChildWithMargins(scrap, 0, 0);

        /*
         * We make some assumptions in this code based on every child
         * view being the same size (i.e. a uniform grid). This allows
         * us to compute the following values up front because they
         * won't change.
         */
        mDecoratedChildWidth = getDecoratedMeasuredWidth(scrap);
        mDecoratedChildHeight = getDecoratedMeasuredHeight(scrap);

        detachAndScrapView(scrap, recycler);
    }

    updateWindowSizing();

    int childLeft;
    int childTop;
    if (getChildCount() == 0) { //First or empty layout
        /*
         * Reset the visible and scroll positions
         */
        mFirstVisiblePosition = 0;
        childLeft = childTop = 0;
    } else if (getVisibleChildCount() > getItemCount()) {
        //Data set is too small to scroll fully, just reset position
        mFirstVisiblePosition = 0;
        childLeft = childTop = 0;
    } else { //Adapter data set changes
        /*
         * Keep the existing initial position, and save off
         * the current scrolled offset.
         */
        final View topChild = getChildAt(0);
        if (mForceClearOffsets) {
            childLeft = childTop = 0;
            mForceClearOffsets = false;
        } else {
            childLeft = getDecoratedLeft(topChild);
            childTop = getDecoratedTop(topChild);
        }

        /*
         * Adjust the visible position if out of bounds in the
         * new layout. This occurs when the new item count in an adapter
         * is much smaller than it was before, and you are scrolled to
         * a location where no items would exist.
         */
        int lastVisiblePosition = positionOfIndex(getVisibleChildCount() - 1);
        if (lastVisiblePosition >= getItemCount()) {
            lastVisiblePosition = (getItemCount() - 1);
            int lastColumn = mVisibleColumnCount - 1;
            int lastRow = mVisibleRowCount - 1;

            //Adjust to align the last position in the bottom-right
            mFirstVisiblePosition = Math.max(
                    lastVisiblePosition - lastColumn - (lastRow * getTotalColumnCount()), 0);

            childLeft = getHorizontalSpace() - (mDecoratedChildWidth * mVisibleColumnCount);
            childTop = getVerticalSpace() - (mDecoratedChildHeight * mVisibleRowCount);

            //Correct cases where shifting to the bottom-right overscrolls the top-left
            // This happens on data sets too small to scroll in a direction.
            if (getFirstVisibleRow() == 0) {
                childTop = Math.min(childTop, 0);
            }
            if (getFirstVisibleColumn() == 0) {
                childLeft = Math.min(childLeft, 0);
            }
        }
    }

    //Clear all attached views into the recycle bin
    detachAndScrapAttachedViews(recycler);

    //Fill the grid for the initial layout of views
    fillGrid(DIRECTION_NONE, childLeft, childTop, recycler);
}
```

### onAdapterChanged()

设置新的 adapter 会触发这个事件（`setAdapter()`），这个阶段你可以安全的返回一个与之前 adapter 完全不同的视图。

```java
@Override
public void onAdapterChanged(RecyclerView.Adapter oldAdapter, RecyclerView.Adapter newAdapter) {
    //Completely scrap the existing layout
    removeAllViews(); // 完全移除，并没有回收
}
```

设置了一个 adapter，数据集都可能不一样，直接全部移除调用，不需要回收。

### onLayoutCompleted

onLayoutCompleted 会在 LayoutManager 调用完 onLayoutChildren() 后调用，可以用来做很多收尾的工作。例如：重置 mPendingScrollPosition 的值

```java
// LinearLayoutManager
public void onLayoutCompleted(RecyclerView.State state) {
    super.onLayoutCompleted(state);
    mPendingSavedState = null; // we don't need this anymore
    mPendingScrollPosition = RecyclerView.NO_POSITION;
    mPendingScrollPositionOffset = INVALID_OFFSET;
    mAnchorInfo.reset();
}
```

### 自定义 LayoutManager 注意点

#### 1、自定义 LayoutManager，不要 layout 出所有的子 View

与自定义 LayoutManager 相比，自定义 ViewGroup 是一种静态的 layout 子 View 的过程，因为 ViewGroup 内部不支持滑动，所以只需要无脑 layout 出所有的 View，便不用再操心剩下的事。<br />而自定义 LayoutManager 与之不同，在第一步 layout 时，千万不要 layout 出所有的子 View

在第一步就 layout 出了所有的 childView，这会导致一个很严重的问题：你的自定义 LayoutManager = 自定义 ViewGroup。即他们没有 View 复用机制，一次性就会执行所有的 onCreateViewHolder/onBindViewHolder

类似下面的代码就是一次性 add 所有的 itemView，会一次性将所有的 view 添加上来

```java
for (int i = 0; i < getItemCount(); i++) {
    View view = recycler.getViewForPosition(i);
    addView(view);
    ......
      记录一些item的宽高，位置等信息
    .....
    recyler.recycleView(view)
}
```

#### 2、自定义一个 LayoutManager 就自动复用 ItemView 了吗？用 RecyclerView 就等于 ItemView 复用？

> 都不是

需要自定义 LayoutManager 手动回收和复用 ViewHolder；RecyclerView 是交给 LayoutManager 来进行测量布局回收和复用 ViewHodler 的

#### 3、detach 和 recycle 的时机

1. 一个 view 只是暂时的被清除掉，稍后立刻就要用到，使用 detach，它会被缓存进 scrapCache 区域；在 onLayoutChildren 回收 View 使用 detachAndScrap 的系列方法，因为 onLayoutChildren 方法会连续多次调用，detachAndScrap 系列的方法就是用在这时候。
2. 一个 view 不再显示在屏幕上，需要被清理掉，并且下次再显示的时机目前未知，使用 remove，它会被以 viewType 分组，缓存进 RecyclerViewPool 里；在滚动发生后要回收超出屏幕不可见的 View 时用 removeAndRecycle 的系列方法

**注意：** 一个 View 只被 detach，没有被 recycle 的话，不会放进 RecyclerViewPool 里，会一直存在 recycler 的 scrap 中。这种情况，View 也没有被复用，有多少 ItemCount，就会 new 出多少个 ViewHolder。

#### 4、初始化时，onLayoutChildren() 为什么会执行两次

参看 RecyclerView 源码，onLayoutChildren 会执行两次，一次 RecyclerView 的 onMeasure() 一次 onLayout()。

即使是在写 onLayoutChildren() 方法时，也要考虑将屏幕上的 View（如果有），detach 掉，否则屏幕初始化时，同一个 position 的 ViewHolder，也会 onCreateViewHolder 两次。因此 childCount 也会翻倍。

#### 5、一个合格的 LayoutManager，childCount 数量不应大于屏幕上显示的 Item 数量，而 scrapCache 缓存区域的 Item 数量应该是 0

## Ref

### Building a RecyclerView LayoutManager (3 篇)

- [x] Building a RecyclerView LayoutManager – Part 1 <https://wiresareobsolete.com/2014/09/building-a-recyclerview-layoutmanager-part-1/>

译文：

- [ ] Building a RecyclerView LayoutManager – Part 1 [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-9/创建-RecyclerView-LayoutManager-Part-1.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-9/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-1.md)
- [ ] 创建 RecyclerView LayoutManager – Part 2<br />[https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Part-2.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-2.md)
- [ ] 创建 RecyclerView LayoutManager – Part 3 [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Part-3.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-3.md)
- [ ] 创建 -RecyclerView-LayoutManager-Redux [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Redux.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Redux.md)

---

- [x] Android 自定义 LayoutManager 第十一式之飞龙在天 <https://blog.csdn.net/u011387817/article/details/81875021>
- [ ] 你可能误会了！原来自定义 LayoutManager 可以这么简单<br /><https://www.jianshu.com/p/715b59c46b74>
- [ ] 掌握自定义 LayoutManager(一) 系列开篇 常见误区、问题、注意事项，常用 API。<br /><https://juejin.im/entry/581324a267f3560058523526>
- [ ] Android 自定义控件进阶篇，自定义 LayoutManager<br /><https://juejin.im/post/5d15d32cf265da1baf7d0009>
- [ ] 看完这篇文章你还不会自定义 LayoutManager，我吃 X！<br /><https://juejin.cn/post/6870770285247725581>
- [ ] Android 自定义 LayoutManager 第十一式之飞龙在天<br /><https://blog.csdn.net/u011387817/article/details/81875021>
- [ ] Android 仿豆瓣书影音频道推荐表单堆叠列表 RecyclerView-LayoutManager <https://blog.csdn.net/ccy0122/article/details/90515386>

## 自定义 LayoutManager 总结

### 布局复用缓存自带支持的？

### notifyItemChanged/DiffUtil 是如何支持的？
