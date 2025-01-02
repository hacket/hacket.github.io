---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# 什么是LayoutManager？

LayoutManager是RecyclerView中Item的布局管理器，LayoutManager是RecyclerView的内部类，RecyclerView把它的测量和布局工作都转交给了LayoutManager。可以控制Item的位置，回收，显示，大小和滚动等。

# 系统提供的LayoutManager

## LinearLayoutManager

![vertical未reverse](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936168937-0b9dc4dc-b772-4b34-bba4-e1a0a7d17dc8.gif#averageHue=%23bbd0b3&clientId=uf83f1ffe-ae0a-4&from=paste&height=370&id=u0c2dc91a&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=uae989ca2-eb19-443a-969a-1c4f09abd9a&title=vertical%E6%9C%AAreverse&width=211 "vertical未reverse")![vertical且reverse](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936270993-4f84f20b-4610-42fa-8fae-b2a95187ea20.gif#averageHue=%23bbd0b3&clientId=uf83f1ffe-ae0a-4&from=paste&height=372&id=u5f17c8f4&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=uf1f60bf7-7118-4852-a089-727018479f7&title=vertical%E4%B8%94reverse&width=212 "vertical且reverse")![horizontal](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936190076-6024aab2-dfe7-4303-8f2f-24db71df4e97.gif#averageHue=%23dac1a1&clientId=uf83f1ffe-ae0a-4&from=paste&height=370&id=u8de4b690&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u1fe084e2-24d5-458a-9d60-47e9d82b9e6&title=horizontal&width=211 "horizontal")

> 图一是VERTICAL未reverse；图二是VERTICAL且reverse了；图三是HORIZONTAL

### 提供的常见方法

1. int findFirstVisibleItemPosition() 找到最前显示item的位置
2. int findFirstCompletelyVisibleItemPosition() 找到最前完全显示item的位置
3. int findLastCompletelyVisibleItemPosition() 找到最后完全显示item的位置
4. int findLastVisibleItemPosition() 找到最后显示item的位置

## GridLayoutManager

提供了与GridView类似的功能，网格展示。<br />![vertical未reverse](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936381057-47a389cf-2294-4fda-b040-d3cabec8e58d.png#averageHue=%23dbcfac&clientId=uf83f1ffe-ae0a-4&from=paste&height=426&id=uac1f28c8&originHeight=1885&originWidth=1079&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=494308&status=done&style=none&taskId=u686be5f5-5156-4e51-af2d-646a5a46ff8&title=vertical%E6%9C%AAreverse&width=244 "vertical未reverse")![vertical且reverse](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936496260-d801591a-b686-4115-99e6-8741b922cbbb.png#averageHue=%23dbcfac&clientId=uf83f1ffe-ae0a-4&from=paste&height=449&id=uccbd7df4&originHeight=1887&originWidth=1079&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=492671&status=done&style=none&taskId=u98174c9c-0cd6-4c53-88c7-e97933291da&title=vertical%E4%B8%94reverse&width=257 "vertical且reverse")![horizontal](https://cdn.nlark.com/yuque/0/2023/gif/694278/1679936556550-61ffa4ea-79fd-47b5-90e5-12c44e65f0d0.gif#averageHue=%23bfd1b2&clientId=uf83f1ffe-ae0a-4&from=paste&height=349&id=u8efe440b&originHeight=631&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u18e85e76-52bf-43be-b34e-e43cbfe7cdf&title=horizontal&width=199 "horizontal")<br />GridLayoutManager的Vertical排列：

> 1  2  3
> 4  5  6
> 7  8  9

GridLayoutManager的Horizontal排列：

> 1  3  5  7
> 2  4  6  8

### GridLayoutManager wrap_content无效

## StaggeredGridLayoutManager

StaggeredGridLayoutManager交错的网格布局，如果子View宽高一致，那效果就和GridLayoutManager一样，如果子View宽高不一致，就可以实现瀑布流效果。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936757812-ea0ac68b-fee2-408b-805c-6fc8e584c14d.png#averageHue=%23bbc8ac&clientId=uf83f1ffe-ae0a-4&from=paste&height=592&id=u9b611355&originHeight=1920&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=1656356&status=done&style=none&taskId=u32f7946c-5cb4-4d46-88ab-83aaa5b42dc&title=&width=333)

## FlexboxLayoutManager

[flexbox-layout](https://github.com/google/flexbox-layout) 流式布局<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679936822631-2a7108bb-6225-4917-acd3-acec007f24af.png#averageHue=%23e8dfd3&clientId=uf83f1ffe-ae0a-4&from=paste&height=622&id=u27151a33&originHeight=1920&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=96724&status=done&style=none&taskId=uf4611c31-deb9-45c5-b933-5dd55b1c777&title=&width=350)

# 自定义LayoutManager

## 自定义LayoutManager常见API

### 添加View

#### LayoutManager#addView 添加一个view到RecyclerView

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

LayoutManager#addView，通过ChildHelper#addView，最后是调用的RecyclerView#addView，将itemView添加到RecyclerView中去。

#### addDisappearingView

```
addDisappearingView(View child)
addDisappearingView(View child, int index)
```

addDisappearingView方法主要用于支持预测动画，例如：notifyItemRemoved时的删除动画

### 测量布局API

#### LayoutManager#measureChildXXX 测量

- boolean shouldMeasureChild(View child, int widthSpec, int heightSpec, LayoutParams lp) 是否需要测量child（child从未被测量）
- boolean shouldReMeasureChild(View child, int widthSpec, int heightSpec, LayoutParams lp) 是否需要重新测量child（child已经测量过一次了）
- public static int getChildMeasureSpec(int parentSize, int parentMode, int padding, int childDimension, boolean canScroll)
- public void measureChild(View child, int widthUsed, int heightUsed) 测量child，不包括margin
- public void measureChildWithMargins(View child, int widthUsed, int heightUsed) 测量child，包括margin
- public int getDecoratedMeasuredWidth([@NonNull ](/NonNull) View child)  获取child测量后的宽度+docorration的宽度
- public int getDecoratedMeasuredHeight([@NonNull ](/NonNull) View child) 获取child测量后的长度+docorration的长度

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

1. parentSize RecyclerView提供给子View的大小
2. parentMode RecyclerView的mode
3. padding RecyclerView的padding
4. childDimension child期望的具体尺寸或`MATCH_PARENT/WRAP_CONTENT`，一般通过child的LayoutParams获取
5. canScroll RecyclerView是否能滚动

##### LayoutManager#measureChild 测量子view，不包括子view的margin

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

##### LayoutManager#measureChildWithMargins 测量子view，包括子view的margin

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

和`measureChild`不同的是，measureChildWithMargins包括了child的margin

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

##### layoutDecorated layout一个child，不包括其margin

```java
// LayoutManager
public void layoutDecorated(@NonNull View child, int left, int top, int right, int bottom) {
    final Rect insets = ((LayoutParams) child.getLayoutParams()).mDecorInsets;
    child.layout(left + insets.left, top + insets.top, right - insets.right,
            bottom - insets.bottom);
}
```

##### layoutDecoratedWithMargins layout一个child，包括其margin

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

#### Recycler#getViewForPosition 根据position获取view（从缓存或创建）

- View getViewForPosition(int position)
- View getViewForPosition(int position, boolean dryRun)

```java
// RecyclerView#Recycler
View getViewForPosition(int position, boolean dryRun) {
    return tryGetViewHolderForPositionByDeadline(position, dryRun, FOREVER_NS).itemView;
}
```

从Recycler中获取到一个不会为null的View，如果position超过itemCount或小于0，就会直接抛出异常。内部代码逻辑就是从不同的缓存(mAttachedScrap、mCachedViews、mRecyclerPool)中拿View，有就直接返回这个View，没有就用onCreateViewHolder创建绑定（onBindViewHolder）并返回。

> 一般在LayoutManager中获取子View时用到

### 回收

#### detach/attach

##### LayoutManager#detachAndScrapAttachedViews detach和分离所有子view

- public void detachAndScrapAttachedViews([@NonNull ](/NonNull) Recycler recycler) 临时detach和分离所有已经attached的child，view会分离到recycler

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

##### detachAndScrapView detach和分离回收单个view

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

##### LayoutManager#detachViewAt 从RecyclerView中detach单个view

- public void detachViewAt(int index)

```java
// LayoutManager
public void detachViewAt(int index) {
    detachViewInternal(index, getChildAt(index));
}
```

- public void detachView([@NonNull ](/NonNull) View child)

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

- public void removeDetachedView([@NonNull ](/NonNull) View child)

```java
public void removeDetachedView(@NonNull View child) {
    mRecyclerView.removeDetachedView(child, false);
}
```

##### LayourManager#attachView attach单个view

- public void attachView([@NonNull ](/NonNull) View child, int index, LayoutParams lp)

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

##### LayourManager#removeAndRecycleView/removeAndRecycleViewAt 移除一个view并回收

- public void removeAndRecycleView([@NonNull ](/NonNull) View child, [@NonNull ](/NonNull) Recycler recycler)
- public void removeAndRecycleViewAt(int index, [@NonNull ](/NonNull) Recycler recycler)

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

##### removeAndRecycleAllViews 移除所有的view并回收

- public void removeAndRecycleAllViews([@NonNull ](/NonNull) Recycler recycler)

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

##### recycleView 回收某个view

```java
// LayourManager
public void recycleView(@NonNull View view) {
    recycleViewHolderInternal(holder);
}
```

##### LayoutManager#removeView 从RecyclerView中remove view

- public void removeViewAt(int index) 移除某个index的view；应该用`recycleView(@NonNull View view)`来回收该view

```java
// LayoutManager
public void removeViewAt(int index) {
    final View child = getChildAt(index);
    if (child != null) {
        mChildHelper.removeViewAt(index);
    }
}
```

- public void removeView(View child) 移除child view

```java
// LayoutManager
public void removeView(View child) {
    mChildHelper.removeView(child);
}
```

### 移动子ViewAPI

#### RecyclerView#offsetChildrenVertical 竖直移动所有子view

```java
public void offsetChildrenHorizontal(@Px int dx) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetLeftAndRight(dx);
    }
}
```

#### RecyclerView#offsetChildrenHorizontal 水平移动所有子view

```java
public void offsetChildrenHorizontal(@Px int dx) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetLeftAndRight(dx);
    }
}
```

### 工具API

#### LayoutManager#getPosition

- public int getPosition(View view) // 获取某个view 的 layoutPosition

#### getXXX 都没有考虑margin的存在

- 获取child left/right/top/bottom边距离RecyclerView的间距，包括了Decoration尺寸

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

- 获取child在各个left/right/top/bottom的decoration的width尺寸

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

#### getDecoratedMeasurementHorizontal/getDecoratedMeasurementVertical 包括margin

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

## 自定义LayoutManager步骤

### 实现generateDefaultLayoutParams 给有子view默认的LayoutParams

- generateDefaultLayoutParams是个模板代码，一般情况用这个就ok

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

generateDefaultLayoutParams在`recycler.getViewForPosition(position)`时调用到，返回一个你想要默认应用给所有从 Recycler 中获得的子视图做参数的 RecyclerView.LayoutParams实例：

```
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

**注意：** 如果需要存储一些额外的东西在LayoutParams里，这里返回你自定义的LayoutParams即可。自定义的LayoutParams需要继承自`RecyclerView.LayoutParams`。

### 使用OrientationHelper【可选】

OrientationHelper是一个屏蔽水平和垂直方向的类，让自定义LayoutManager更方便，开发者无需关注方向

在LayoutManager构造方法中初始化

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

### 按需，重写onMeasure()或isAutoMeasureEnabled()方法

LayoutManger的onMeasure()有默认实现，并且isAutoMeasureEnabled()默认返回的false，默认的只能适配RecyclerView为`MATCH_PARENT`或具体的尺寸值。

isAutoMeasureEnabled()是自测量模式，给RecyclerView的wrap_content的用的，如果你的LayoutManager要支持wrap_content那就必须重写。

### 实现onLayoutChildren进行测量布局

#### onLayoutChildren调用时机

1. 在RecyclerView初始化时，会被调用两次。
2. 在调用adapter.notifyDataSetChanged()时，会被调用。
3. 在调用setAdapter替换Adapter时,会被调用。
4. 在RecyclerView执行动画时，它也会被调用。

> 即RecyclerView初始化、数据源改变时都会被调用

#### 暂时分离到scrap

进行布局之前，我们需要调用`detachAndScrapAttachedViews`方法把屏幕中的Items都分离出来暂存到scrap缓存中去，内部调整好位置和数据后，再把它添加回去，

> onLayoutChildren可能会调用2次

#### layout当前屏幕可见的所有子View

1. 通过`Recycler#getViewForPosition(position)`从缓存中获取view（可以从detachAndScrapAttachedViews保存的scrap缓存中取出来）
2. 一般定义个一个fill方法，大神称为fill机制（在onLayoutChildren和实现scrollXXXBy调用）
3. addView添加到RecyclerView中去
4. 获取到Item并重新添加了之后，我们还需要对它进行测量，这时候可以调用`measureChild`或`measureChildWithMargins`方法
5. 布局，用layoutDecorated或layoutDecoratedWithMargins

##### fill机制

1. 找到第一个可见的position
2. 找到边距
3. scrap所有view
4. 布局所有可见的position

> 只测量布局当前屏幕可见的itemView，不要所有的view都测量、layout出来

### ViewHolder回收

不再屏幕上的view，通过`Recycler#removeAndRecycleView(child, recycler)`将其从屏幕上移除，并缓存到mCahcedViews或RecycledViewPool中去

### 滑动

#### 实现canScrollHorizontally()和canScrollVertically()决定是否能滑动及滑动的方向

```kotlin
override fun canScrollVertically(): Boolean {
    return mOrientation == RecyclerView.VERTICAL
}

override fun canScrollHorizontally(): Boolean {
    return mOrientation == RecyclerView.HORIZONTAL
}
```

#### 实现scrollHorizontallyBy()和scrollVerticallyBy()进行滑动处理

参数：

```
1. dx>0就是手指从右滑向左，dy>0就是手指从下滑向上，同理dx<0,dy<0则反
2. 返回值就是让RecyclerView知道LayoutManager真实的滑动距离，return 0时RecyclerView就会展示overScorll状态以及NestedScrolling的后续处理
```

一个合格的LayoutManager至少3个流程顺序是：`填充View`-`移动View`-`回收View`，并且顺序最好如上面代码一样先填充-再移动-最后回收，当然复杂的情况的LayoutManager可以多加一些条件检测和特殊处理，例如LinearLayoutManager就是先回收-再填充-再回收-最后移动。

1. 填充：调用fill方法获取下一个itemView
2. 移动：offsetChildrenVertical/offsetChildrenHorizontal移动所有的itemView
3. 回收：removeAndRecycleView回收child

### scrollToPosition()和smoothScrollToPosition()支持

给 LayoutManager 添加滚动到特定位置的功能。 可以带有有动画效(和smoothScrollToPosition)果，也可以没有()scrollToPosition。

#### scrollToPosition

增加mPendingScrollPosition变量，在scrollToPosition()方法中对其赋值，调用requestLayout()方法，然后onLayoutChildren()方法会再次回调，这时对锚点position重新赋值，记住一定做好position的合法校验。

```
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

> 适配scrollToPosition就是更新一下新的起始点

#### smoothScrollToPosition

在带有动画的情况下，我们需要使用一些稍微不同的方法。 在这方法里我们需要创建一个 RecyclerView.SmoothScroller实例， 然后在方法返回前请求startSmoothScroll()启动动画。

RecyclerView.SmoothScroller 是提供 API 的抽象类，含有四个方法：

```
onStart()：当滑动动画开始时被触发。
onStop()：当滑动动画停止时被触发。
onSeekTargetStep(int dx,int dy,State state,Action action)：当 scroller 搜索目标 view 时被重复调用，这个方法负责读取提供的 dx/dy，然后更新应该在这两个方向移动的距离。 这个方法有一个RecyclerView.SmoothScroller.Action实例做参数。 通过向 action 的 update()方法传递新的 dx, dy, duration 和 Interpolator ， 告诉 view 在下一个阶段应该执行怎样的动画。如果动画耗时过长，框架会对你发出警告， 应该调整动画的步骤，尽量和框架标准的动画耗时相同。
onTargetFound()：只在目标视图被 attach 后调用一次。 这是将目标视图要通过动画移动到准确位置最后的场所。在内部，当 view 被 attach 时使用 LayoutManager 的 findViewByPosition() 方法 查找对象。如果你的 LayoutManager 可以有效匹配 view 和 position ， 可以覆写这个方法来优化性能。默认提供的实现是通过每次遍历所有子视图查找。
```

你可以自己实现一个 scroller 达到你想要的效果。不过这里我们只使用系统提供的 LinearSmoothScroller 就好了。只需实现一个方法computeScrollVectorForPosition()， 然后告诉 scroller 初始方向还有从当前位置滚动到目标位置的大概距离。

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

### Predictive Item Animations 期望的item动画

onLayoutChildren() 通常只会 在父控件 RecyclerView 初始化布局 或者 数据集的大小(比如 item 的数量)改变时调用一次。 Predictive Item Animations 这个特性允许我们给 view (基于数据改变产生)的过渡动画 提供更多有用的信息。想要使用这个特性，就要告诉 框架我们的 LayoutManager 提供了这个附加数据：

```java
@Override
public boolean supportsPredictiveItemAnimations() {
    return true;
}
```

有了这个改动，onLayoutChildren() 会在每次数据集改变后被调用两次， 一次是"预布局"(pre-layout)阶段，一次是真实布局(real layout)

### preLayout

### 解决软键盘弹出或收起导致onLayoutChildren()方法被重新调用的问题

在滚动一段距离后，让软键盘弹出，发现LayoutManager自动回到position=0那里，再滚动一段距离，软键盘收起，LayoutManager又自动回到position=0那里。

分析原因可以知道是onLayoutChildren方法被重新调用导致，因为onLayoutChildren方法中我们的currentPosition=0，所以导致了LayoutManager从0开始重新布局。下面我们开始修正position为真实滚动后的值。

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

### 数据集改变notifyDataSetChanged

当使用 notifyDataSetChanged()触发 RecyclerView.Adapter 的更新操作时， LayoutManager 负责更新布局中的视图，这时onLayoutChildren()会被再次调用，需要分数据集变大，变小，清空来处理各种情况

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

设置了一个adapter，数据集都可能不一样，直接全部移除调用，不需要回收。

### onLayoutCompleted

onLayoutCompleted会在LayoutManager调用完onLayoutChildren()后调用，可以用来做很多收尾的工作。例如：重置mPendingScrollPosition的值

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

### 自定义LayoutManager注意点

#### 1、自定义LayoutManager，不要layout出所有的子View

与自定义LayoutManager相比，自定义ViewGroup是一种静态的layout 子View的过程，因为ViewGroup内部不支持滑动，所以只需要无脑layout出所有的View，便不用再操心剩下的事。<br />而自定义LayoutManager与之不同，在第一步layout时，千万不要layout出所有的子View

在第一步就layout出了所有的childView，这会导致一个很严重的问题：你的自定义LayoutManager = 自定义ViewGroup。即他们没有View复用机制，一次性就会执行所有的onCreateViewHolder/onBindViewHolder

类似下面的代码就是一次性add所有的itemView，会一次性将所有的view添加上来

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

#### 2、自定义一个LayoutManager就自动复用ItemView了吗？用RecyclerView就等于ItemView复用？

> 都不是

需要自定义LayoutManager手动回收和复用ViewHolder；RecyclerView是交给LayoutManager来进行测量布局回收和复用ViewHodler的

#### 3、detach 和recycle的时机

1. 一个view只是暂时的被清除掉，稍后立刻就要用到，使用detach，它会被缓存进scrapCache区域；在onLayoutChildren回收View使用detachAndScrap的系列方法，因为onLayoutChildren方法会连续多次调用，detachAndScrap系列的方法就是用在这时候。
2. 一个view不再显示在屏幕上，需要被清理掉，并且下次再显示的时机目前未知，使用remove，它会被以viewType分组，缓存进RecyclerViewPool里；在滚动发生后要回收超出屏幕不可见的View时用removeAndRecycle的系列方法

**注意：** 一个View只被detach，没有被recycle的话，不会放进RecyclerViewPool里，会一直存在recycler的scrap 中。这种情况，View也没有被复用，有多少ItemCount，就会new出多少个ViewHolder。

#### 4、初始化时，onLayoutChildren()为什么会执行两次

参看RecyclerView源码，onLayoutChildren会执行两次，一次RecyclerView的onMeasure() 一次onLayout()。

即使是在写onLayoutChildren()方法时，也要考虑将屏幕上的View（如果有），detach掉，否则屏幕初始化时，同一个position的ViewHolder，也会onCreateViewHolder两次。因此childCount也会翻倍。

#### 5、一个合格的LayoutManager，childCount数量不应大于屏幕上显示的Item数量，而scrapCache缓存区域的Item数量应该是0

## Ref

### Building a RecyclerView LayoutManager (3篇)

- [x] Building a RecyclerView LayoutManager – Part 1 <https://wiresareobsolete.com/2014/09/building-a-recyclerview-layoutmanager-part-1/>

译文：

- [ ] Building a RecyclerView LayoutManager – Part 1 [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-9/创建-RecyclerView-LayoutManager-Part-1.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-9/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-1.md)
- [ ] 创建 RecyclerView LayoutManager – Part 2<br />[https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Part-2.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-2.md)
- [ ] 创建 RecyclerView LayoutManager – Part 3 [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Part-3.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Part-3.md)
- [ ] 创建-RecyclerView-LayoutManager-Redux [https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/创建-RecyclerView-LayoutManager-Redux.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-13/%E5%88%9B%E5%BB%BA-RecyclerView-LayoutManager-Redux.md)

---

-  [x] Android自定义LayoutManager第十一式之飞龙在天 <https://blog.csdn.net/u011387817/article/details/81875021>
-  [ ] 你可能误会了！原来自定义LayoutManager可以这么简单<br /><https://www.jianshu.com/p/715b59c46b74>
-  [ ] 掌握自定义 LayoutManager(一) 系列开篇 常见误区、问题、注意事项，常用 API。<br /><https://juejin.im/entry/581324a267f3560058523526>
-  [ ] Android自定义控件进阶篇，自定义LayoutManager<br /><https://juejin.im/post/5d15d32cf265da1baf7d0009>
-  [ ] 看完这篇文章你还不会自定义LayoutManager，我吃X！<br /><https://juejin.cn/post/6870770285247725581>
-  [ ] Android自定义LayoutManager第十一式之飞龙在天<br /><https://blog.csdn.net/u011387817/article/details/81875021>
-  [ ] Android仿豆瓣书影音频道推荐表单堆叠列表RecyclerView-LayoutManager <https://blog.csdn.net/ccy0122/article/details/90515386>

## 自定义LayoutManager总结

### 布局复用缓存自带支持的？

### notifyItemChanged/DiffUtil是如何支持的？
