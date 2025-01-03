---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# RecyclerView之Prefetch

官方：<https://medium.com/google-developers/recyclerview-prefetch-c2f269075710#.w7p8xngl6>

## 什么是Prefetch？

RecyclerView25+和API21以上可以开启prefetch；在UI线程空闲的时候，去获取item，避免下次需要用的时候再去获取，避免了卡顿。<br />在Android21，在UI线程post了一frame给RenderThread和到下一个vsync pulse到来时，RecyclerView这段时间是空闲的，在这段时间我们安排prefetch工作<br />RecyclerView自带的系统优化，默认自动开启。

## 怎么使用Prefetch？

1. 升级RecyclerView版本到25以上的版本且API大于等于21，系统提供的LayoutManager自动开启了recyclerview prefetch功能
2. 调用setItemPrefetchEnabled(boolean enabled)来开关prefetch
3. 嵌套的RecyclerViews，在内部LayoutManagers上调用LinearLayoutManager的新`setInitialItemPrefetchCount()`方法（在v25.1中可用）以获得最佳性能。例如，如果垂直列表中的行至少显示三个项目，请调用setInitialItemPrefetchCount（4）。
4. 自定义LayoutManager，则需要覆盖`LayoutManager.collectAdjacentPrefetchPositions`，这在启用预取时由RecyclerView调用（LayoutManager中的默认实现不执行任何操作）。其次，如果您希望在其RecyclerView嵌套在另一个中时从LayoutManager中进行预取，则还应实现`LayoutManager.collectInitialPrefetchPositions()`。

> 没有嵌套用collectAdjacentPrefetchPositions；嵌套用collectInitialPrefetchPositions

## Prefetch源码分析

### 是否开启prefetch

调用`LinearLayoutManager#setItemPrefetchEnabled`来设置是否开启prefetch，默认为true

```java
// LinearLayoutManager Android29
private boolean mItemPrefetchEnabled = true; // 默认为true
public final void setItemPrefetchEnabled(boolean enabled) {
    if (enabled != mItemPrefetchEnabled) {
        mItemPrefetchEnabled = enabled;
        mPrefetchMaxCountObserved = 0;
        if (mRecyclerView != null) {
            mRecyclerView.mRecycler.updateViewCacheSize();
        }
    }
}
```

接着调用RecyclerView#Recycler#updateViewCacheSize()，设置mViewCacheMax大小（即mCachedViews最多保存多少，默认为2）

```java
// RecyclerView#Recycler Android29
void updateViewCacheSize() {
    
    int extraCache = mLayout != null ? mLayout.mPrefetchMaxCountObserved : 0;
    mViewCacheMax = mRequestedCacheMax + extraCache;

    // 如果更新后的mViewCacheMax大小比目前保持的数量多，那么就从后往前调用recycleCachedViewAt将其加入到RecycledViewPool中去，并从mCachedViews移除掉。
    // first, try the views that can be recycled
    for (int i = mCachedViews.size() - 1;
            i >= 0 && mCachedViews.size() > mViewCacheMax; i--) {
        recycleCachedViewAt(i);
    }
}
```

从上面可以看到，mViewCacheMax的大小由我们自己设置mRequestedCacheMax和extraCache相加而得，extraCache由`mLayout.mPrefetchMaxCountObserved`得到，现在看mLayout.mPrefetchMaxCountObserved

### GapWorker

```java
final class GapWorker implements Runnable {
    // 主线程中所有的RecyclerView都将保持在这里，主线程共享
    static final ThreadLocal<GapWorker> sGapWorker = new ThreadLocal<>();
    
    // mRecyclerViews中包含的是已经绑定到Window上的所有RecyclerView，不止是当前处在前台的activity；只要activity中含有RecyclerView，并且没有被销毁，那么这个RecyclerView就会被添加到mRecyclerViews中
    ArrayList<RecyclerView> mRecyclerViews = new ArrayList<>();
    
}
```

### prefetch流程

1. 初始化<br />GapWorker初始化在RecyclerViwe#onAttachedToWindow调用，如果API大于等于21，初始化GapWorker

```java
// RecyclerView 1.1.0
static final boolean ALLOW_THREAD_GAP_WORK = Build.VERSION.SDK_INT >= 21;
GapWorker mGapWorker;
GapWorker.LayoutPrefetchRegistryImpl mPrefetchRegistry = ALLOW_THREAD_GAP_WORK ? new GapWorker.LayoutPrefetchRegistryImpl() : null;
protected void onAttachedToWindow() {
    if (ALLOW_THREAD_GAP_WORK) {
        // Register with gap worker
        // 这里利用的是ThreadLocal的特性，这也说明主线程中就一个GapWorker实例对象 
        mGapWorker = GapWorker.sGapWorker.get();
        if (mGapWorker == null) {
            mGapWorker = new GapWorker();

            // break 60 fps assumption if data from display appears valid
            // NOTE: we only do this query once, statically, because it's very expensive (> 1ms)
            Display display = ViewCompat.getDisplay(this);
            float refreshRate = 60.0f;
            if (!isInEditMode() && display != null) {
                float displayRefreshRate = display.getRefreshRate();
                if (displayRefreshRate >= 30.0f) {
                    refreshRate = displayRefreshRate;
                }
            }
            //  计算绘制一帧所需时间，单位是ns
            mGapWorker.mFrameIntervalNs = (long) (1000000000 / refreshRate);
            // 将RecyclerView添加到RecyclerView中
            GapWorker.sGapWorker.set(mGapWorker);
        }
        mGapWorker.add(this);
    }
}
```

就是初始化一个GapWorker并保存到ThreadLocal中

2. 预取机制主要是在滑动的时候，那就去RecyclerView的onTouchEvent中MOVE事件中查找

```java
// RecyclerView
public boolean onTouchEvent(MotionEvent e) {
    switch (action) {
        case MotionEvent.ACTION_MOVE: {
            if (mScrollState == SCROLL_STATE_DRAGGING) {
                if (mGapWorker != null && (dx != 0 || dy != 0)) {
                    mGapWorker.postFromTraversal(this, dx, dy);
                }
            }
        }
    }
}
```

在RecyclerView的move事件中，调用GapWorker的postFromTraversal

3. GapWorker#postFromTraversal

```java
// GapWorker
void postFromTraversal(RecyclerView recyclerView, int prefetchDx, int prefetchDy) {
    if (recyclerView.isAttachedToWindow()) {
        if (mPostTimeNs == 0) {
            mPostTimeNs = recyclerView.getNanoTime();
            // prefetch的逻辑是通过这里处理的，GapWorker实现了Runnable接口
            recyclerView.post(this);
        }
    }
    // 赋值而已
    recyclerView.mPrefetchRegistry.setPrefetchVector(prefetchDx, prefetchDy);
}
```

这段代码是在请求绘制界面之后调用的，也就说，在请求绘制当前帧的时候，会提前缓存下一帧的view

4. 现在看run

```java
// GapWorker
long mFrameIntervalNs; // 一帧的事件
public void run() {
    final int size = mRecyclerViews.size();
    long latestFrameVsyncMs = 0;
    for (int i = 0; i < size; i++) { // 遍历所有保存的RecyclerView，找个当前处于可见状态的view并获取上一帧的时间
        RecyclerView view = mRecyclerViews.get(i);
        if (view.getWindowVisibility() == View.VISIBLE) {
            latestFrameVsyncMs = Math.max(view.getDrawingTime(), latestFrameVsyncMs);
        }
    }
    // 计算下一帧到来的时间，在这个时间内没有预取到那么就会预取失败，预取的本意就是为了滑动更流畅，如果预取在下一帧到来时还没取到，还去取的话那么就会影响到绘制，得不偿失，
    long nextFrameNs = TimeUnit.MILLISECONDS.toNanos(latestFrameVsyncMs) + mFrameIntervalNs;
    // 预取
    prefetch(nextFrameNs);
}
```

5. 现在看预取prefetch

```java
// GapWorker
void prefetch(long deadlineNs) {
    buildTaskList();
    flushTasksWithDeadline(deadlineNs);
}
```

```
- buildTaskList做了计算需要预取的位置；新建需要预取的task，里面包含了需要预取的相关信息；
```

6. flushTasksWithDeadline

```java
// GapWorker
private void flushTaskWithDeadline(Task task, long deadlineNs) {
    long taskDeadlineNs = task.immediate ? RecyclerView.FOREVER_NS : deadlineNs;
    RecyclerView.ViewHolder holder = prefetchPositionWithDeadline(task.view,
            task.position, taskDeadlineNs);
    if (holder != null
            && holder.mNestedRecyclerView != null
            && holder.isBound()
            && !holder.isInvalid()) {
        prefetchInnerRecyclerViewWithDeadline(holder.mNestedRecyclerView.get(), deadlineNs);
    }
}
```

接着调用prefetchPositionWithDeadline，从缓存获取ViewHolder或创建ViewHolder

```java
// GapWorker
private RecyclerView.ViewHolder prefetchPositionWithDeadline(RecyclerView view,
            int position, long deadlineNs) {
    if (isPrefetchPositionAttached(view, position)) {
        // don't attempt to prefetch attached views
        return null;
    }

    RecyclerView.Recycler recycler = view.mRecycler;
    RecyclerView.ViewHolder holder;
    try {
        view.onEnterLayoutOrScroll();
        // 去缓存中获取或是新创建一个，分析Recycler可知，这里就是通过各级缓存获取ViewHolder，获取不到就onCreateViewHolder，并onBindViewHolder
        holder = recycler.tryGetViewHolderForPositionByDeadline(
                position, false, deadlineNs);

        if (holder != null) {
            if (holder.isBound() && !holder.isInvalid()) {
                // Only give the view a chance to go into the cache if binding succeeded
                // Note that we must use public method, since item may need cleanup
                // 一般会执行到这里，这里是将获取的view添加到第二级缓存mCachedViews中
                recycler.recycleView(holder.itemView);
            } else {
                // Didn't bind, so we can't cache the view, but it will stay in the pool until
                // next prefetch/traversal. If a View fails to bind, it means we didn't have
                // enough time prior to the deadline (and won't for other instances of this
                // type, during this GapWorker prefetch pass).
                // 将holder添加到第四级缓存mRecyclerPool中
                recycler.addViewHolderToRecycledViewPool(holder, false);
            }
        }
    } finally {
        view.onExitLayoutOrScroll(false);
    }
    return holder;
}
```

- [x] RecyclerView（一）：预取机制<br /><https://blog.csdn.net/tangedegushi/article/details/88790754>

# RecyclerView原理之缓存

## RecyclerView和ListView

### RecyclerView和ListView比较

1. RecyclerView强制使用ViewHolder
2. ListView不强制使用ViewHolder，每次都findViewById（DSF深度优化搜索算法，耗性能）

> ListView使用ViewHolder的好处就在于可以避免每次getView都进行findViewById()操作，因为findViewById()利用的是`DFS算法`（深度优化搜索），是非常耗性能的。

3. RecyclerView强制原因：避免多次findViewById；一个ViewHolder对应一个ItemView，拿到了ViewHolder基本就拿到了ItemView的所有信息，而ViewHolder使用起来相比itemView更加方便；RecyclerView缓存机制缓存的就是ViewHolder（ListView缓存的是ItemView）

### ListView缓存机制

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688490451293-c0213ba0-d3a5-43f9-9d0b-fcc29ff3faf2.png#averageHue=%2328540c&clientId=u52936e03-dc53-4&from=paste&height=492&id=u7c2c6b96&originHeight=848&originWidth=876&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ue32477c9-25c6-4e91-a371-9ca4d2548bc&title=&width=508)<br />ListView的缓存有两级，在ListView里面有一个内部类`RecycleBin`，RecycleBin有两个对象`Active View`和`Scrap View`来管理缓存，Active View是第一级，Scrap View是第二级。

- **Active View**：是缓存在屏幕内的ItemView，当列表数据发生变化时，屏幕内的数据可以直接拿来复用，无须进行数据绑定。
- **Scrap view**：缓存屏幕外的ItemView，这里所有的缓存的数据都是"脏的"，也就是数据需要重新绑定，也就是说屏幕外的所有数据在进入屏幕的时候都要走一遍getView（）方法。<br />再来一张图，看看ListView的缓存流程

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688490465585-c2b013e8-8c78-4a34-8431-ecadc29199c9.png#averageHue=%2333f934&clientId=u52936e03-dc53-4&from=paste&height=853&id=u58ba0564&originHeight=1205&originWidth=619&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u023ae02a-1622-4c33-b4d3-b909c7cceca&title=&width=438)<br />ListView的缓存机制相对比较好理解，它只有两级缓存，一级缓存Active View是负责屏幕内的ItemView快速复用，而Scrap View是缓存屏幕外的数据，当该数据从屏幕外滑动到屏幕内的时候需要走一遍getView()方法。当Active View和Scrap View中都没有缓存的时候就会直接create view。

## RecyclerView的缓存机制

### 缓存入口

#### onTouchEvent

从RecyclerView的滑动开始分析，RecyclerView处理事件在onTouchEvent，在move事件会调用`scrollByInternal(int x, int y, MotionEvent ev)`来进行滚动，

```java
// Rv Androidx1.0.0
boolean scrollByInternal(int x, int y, MotionEvent ev) {
    if (mAdapter != null) {
        scrollStep(x, y, mReusableIntPair);
    }
    if (!mItemDecorations.isEmpty()) { // 如果有ItemDecoration，那么invalidate绘制自身
        invalidate();
    }
    // ...
}
```

接着调用`scrollStep`

```java
// Rv Androidx1.0.0
void scrollStep(int dx, int dy, @Nullable int[] consumed) {
    int consumedX = 0;
    int consumedY = 0;
    if (dx != 0) {
        consumedX = mLayout.scrollHorizontallyBy(dx, mRecycler, mState);
    }
    if (dy != 0) {
        consumedY = mLayout.scrollVerticallyBy(dy, mRecycler, mState);
    }
    // ...
}
```

再根据dx和dy分别调用LayoutManager的`scrollHorizontallyBy`或`scrollVerticallyBy`；我们以LinearLayoutManager垂直滚动来分析，现在看`LinearLayoutManager#scrollVerticallyBy`

```java
// LinearLayoutManager#scrollVerticallyBy Androidx1.0.0
public int scrollVerticallyBy(int dy, RecyclerView.Recycler recycler, RecyclerView.State state) {
    if (mOrientation == HORIZONTAL) {
        return 0;
    }
    return scrollBy(dy, recycler, state);
}
int scrollBy(int delta, RecyclerView.Recycler recycler, RecyclerView.State state) {
    if (getChildCount() == 0 || delta == 0) {
        return 0;
    }
    final int consumed = mLayoutState.mScrollingOffset + fill(recycler, mLayoutState, state, false);
    // ...
}
```

在scrollVerticallyBy调用了scrollBy，scrollBy又调用了fill，layoutChunk

```java
// LinearLayoutManager
int fill(RecyclerView.Recycler recycler, LayoutState layoutState, RecyclerView.State state, boolean stopOnFocusable) {
    // ...
    // Recyclerview 剩余空间
    int remainingSpace = layoutState.mAvailable + layoutState.mExtraFillSpace;
    LayoutChunkResult layoutChunkResult = mLayoutChunkResult;
    // 循环遍历，不断填充，直到空间消耗完毕
    while ((layoutState.mInfinite || remainingSpace > 0) && layoutState.hasMore(state)) {
        // 填充一个表项
        layoutChunk(recycler, state, layoutState, layoutChunkResult);
        // ...
    }
    // ...
}
void layoutChunk(RecyclerView.Recycler recycler, RecyclerView.State state,
            LayoutState layoutState, LayoutChunkResult result) {
    // 获得下一个表项
    View view = layoutState.next(recycler);
    if (view == null) {
        if (DEBUG && layoutState.mScrapList == null) {
            throw new RuntimeException("received null view when unexpected");
        }
        // if we are laying out views in scrap, this may return null which means there is
        // no more items to layout.
        result.mFinished = true;
        return;
    }
    RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) view.getLayoutParams();
    if (layoutState.mScrapList == null) {
        // 将表项插入到列表中
        if (mShouldReverseLayout == (layoutState.mLayoutDirection == LayoutState.LAYOUT_START)) {
            addView(view);
        } else {
            addView(view, 0);
        }
    } 
    // ...
    measureChildWithMargins(view, 0, 0);
    // ...
    layoutDecoratedWithMargins(view, left, top, right, bottom);
    // ...
}
// LayoutState
View next(RecyclerView.Recycler recycler) { // 获得下一个元素的视图用于布局
    if (mScrapList != null) {
        return nextViewFromScrapList();
    }
    // 调用了Recycler.getViewForPosition()
    final View view = recycler.getViewForPosition(mCurrentPosition);
    mCurrentPosition += mItemDirection;
    return view;
}
private View nextViewFromScrapList() {
    final int size = mScrapList.size();
    for (int i = 0; i < size; i++) {
        final View view = mScrapList.get(i).itemView;
        final RecyclerView.LayoutParams lp = (RecyclerView.LayoutParams) view.getLayoutParams();
        if (lp.isItemRemoved()) {
            continue;
        }
        if (mCurrentPosition == lp.getViewLayoutPosition()) {
            assignPositionFromScrapList(view);
            return view;
        }
    }
    return null;
}
```

继续调用LayoutState#next获取view，LayoutManager.addView，ChildHelper.addView

#### layout/ onLayoutChildren

```
RecyclerView.dispatchLayout() →
RecyclerView.dispatchLayoutStep1()/dispatchLayoutStep2() → 
LayoutManager.onLayoutChildren(RecyclerView.Recycler, RecyclerView.State) // 布局所有给定adapter中相关孩子视图
LinearyLayoutManager.fill(RecyclerView.Recycler, LayoutState, RecyclerView.State, boolean)
```

以LinearLayoutManager为准，最后都是走的fill，然后layoutChunk，LayoutManager.addView，ChildHelper.addView，RecyclerView.addView，最后也是调用ViewGroup.addView将每个itemView添加到rv中

### 缓存相关类

#### RecyclerView.Recycler

从注释可值，RecyclerView.Recycler用来管理`scrapped`或`detached`的itemView回收利用的。

```java
// RecyclerView.Recycler Android29
public final class Recycler {
    // 已经attached的但被标记为removal或reused的ViewHolder
    final ArrayList<ViewHolder> mAttachedScrap = new ArrayList<>();
    ArrayList<ViewHolder> mChangedScrap = null;

    // 官方说是一级缓存
    final ArrayList<ViewHolder> mCachedViews = new ArrayList<ViewHolder>();

    private final List<ViewHolder>
            mUnmodifiableAttachedScrap = Collections.unmodifiableList(mAttachedScrap);

    private int mRequestedCacheMax = DEFAULT_CACHE_SIZE;
    int mViewCacheMax = DEFAULT_CACHE_SIZE;

    RecycledViewPool mRecyclerPool;

    private ViewCacheExtension mViewCacheExtension;

    static final int DEFAULT_CACHE_SIZE = 2;

    // 更新mCachedViews最大缓存数量，默认为2
    void updateViewCacheSize() {
        int extraCache = mLayout != null ? mLayout.mPrefetchMaxCountObserved : 0;
        mViewCacheMax = mRequestedCacheMax + extraCache;

        // first, try the views that can be recycled
        for (int i = mCachedViews.size() - 1;
                i >= 0 && mCachedViews.size() > mViewCacheMax; i--) {
            recycleCachedViewAt(i);
        }
    }
}
```

> 在调RecyclerView#onAttachedToWindow()方法的时候会进行版本判断，如果是5.0以及以上的系统（即大于等于21），GapWorker会把RecyclerView自己加入到GapWorker。在RenderThread线程执行预取操作的时候会mPrefetchMaxCountObserved =1，这就会导致你使用5.0以及以上系统的手机打印缓存数量mViewCacheMax的时候会比你预想的多一个

##### scrap

什么是`scrapped`View？

> 已经attached其父RecyclerView但是被标记了移除可回收(`removal or reuse`)

scrap 缓存列表（`mChangedScrap`、`mAttachedScrap`），mChangedScrap 和 mAttachedScrap 只在**布局阶段**使用。其他时候它们是空的。布局完成之后，这两个缓存中的 viewHolder，会移到 mCacheViews 或者 RecyclerViewPool 中。

###### mChangedScrap

ViewHolder 只有在满足下面情况才会被添加到 mChangedScrap：当它关联的 item 发生了变化（notifyItemChanged 或者 notifyItemRangeChanged 被调用），并且 ItemAnimator 调用 ViewHolder#canReuseUpdatedViewHolder 方法时，返回了 false。否则，ViewHolder 会被添加到AttachedScrap 中。

> canReuseUpdatedViewHolder 返回 “false” 表示我们要执行用一个 view 替换另一个 view 的动画，例如淡入淡出动画。 “true”表示动画在 view 内部发生。

###### mAttachedScrap

mAttachedScrap 在 整个布局过程中都能使用，但是 changed scrap — 只能在预布局阶段使用。

在布局阶段可用，布局结束就不可用了。

##### mCachedViews 官方说的一级缓存

##### mViewCacheExtension 二级缓存，开发者自定义

##### mRecyclerPool 三级缓存，RecyclerViewPool

#### RecyclerViewPool

```java
// RecycledViewPool可以在多个RV中共享；如果你没提供该实例，RV会自动创建一个RecycledViewPool实例
public static class RecycledViewPool {
    private static final int DEFAULT_MAX_SCRAP = 5;
    static class ScrapData {
        final ArrayList<ViewHolder> mScrapHeap = new ArrayList<>(); // 存储 ViewHolder 实例的列表
        int mMaxScrap = DEFAULT_MAX_SCRAP; // 每种类型的 ViewHolder 默认最多存 5 个
        long mCreateRunningAverageNs = 0;
        long mBindRunningAverageNs = 0;
    }
    // 键值对:以 viewType 为键，ScrapData 为值，用以存储不同类型的 ViewHolder 列表
    SparseArray<ScrapData> mScrap = new SparseArray<>();
    
    // 设置某个viewType缓存的最大值，默认是5
    public void setMaxRecycledViews(int viewType, int max) {
        ScrapData scrapData = getScrapDataForType(viewType);
        scrapData.mMaxScrap = max;
        final ArrayList<ViewHolder> scrapHeap = scrapData.mScrapHeap;
        while (scrapHeap.size() > max) {
            scrapHeap.remove(scrapHeap.size() - 1);
        }
    }
    // ViewHolder 入池 按 viewType 分类入池，相同的 ViewType 存放在同一个列表中
    public void putRecycledView(ViewHolder scrap) {
        final int viewType = scrap.getItemViewType();
        final ArrayList<ViewHolder> scrapHeap = getScrapDataForType(viewType).mScrapHeap;
        if (mScrap.get(viewType).mMaxScrap <= scrapHeap.size()) { // 如果超限了，则放弃入池
            return;
        }
        // 入回收池之前重置 ViewHolder
        scrap.resetInternal();
        // 最终 ViewHolder 入池
        scrapHeap.add(scrap);
    }
}

public final class Recycler {
    // RecycledViewPool实例
    RecycledViewPool mRecyclerPool;
    // 将viewHolder存入RecycledViewPool
    void addViewHolderToRecycledViewPool(ViewHolder holder, boolean dispatchRecycled) {
        // ...
        getRecycledViewPool().putRecycledView(holder);
    }
    // 获取 RecycledViewPool 实例
    RecycledViewPool getRecycledViewPool() {
        if (mRecyclerPool == null) {
            mRecyclerPool = new RecycledViewPool();
        }
        return mRecyclerPool;
    }
}
```

RecyclerViewPool可能导致的内存泄漏，一个RecyclerViewPool对应一个Activity，ViewHolder中会持有Context

### ViewHolder的复用

ViewHolder的复用，在`Recycler#getViewForPosition`入口；在创建 ViewHolder 之前，RecyclerView 会先从缓存中尝试获取是否有符合要求的 ViewHolder，详见 `Recycler#tryGetViewHolderForPositionByDeadline` 方法。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688490502207-02cb0abd-5e84-4465-a342-d18c654d5b2c.png#averageHue=%23eeeeee&clientId=u52936e03-dc53-4&from=paste&id=u8730460e&originHeight=630&originWidth=1280&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u48eae987-5030-4c47-83c8-9d5d0b91297&title=)

- 第一次，尝试从 `mChangedScrap` 中获取。
  - 只有在 `mState.isPreLayout()` 为 true 时，也就是预布局阶段，才会做这次尝试
- 第二次，`getScrapOrHiddenOrCachedHolderForPosition(position)` 获得 ViewHolder
  - **根据position**尝试从1.`mAttachedScrap` 2.`mHiddenViews` 3.`mCachedViews` 中查找ViewHolder
    - 其中 mAttachedScrap 和 mCachedViews 都是 Recycler 的成员变量
    - 如果成功获得 ViewHolder 则检验其有效性。若检验失败则将其回收到 RecyclerViewPool中；检验成功可以直接使用
- 第三次，如果给 Adapter 设置了 `stableId`，调用 `getScrapOrCachedViewForId(id,type)` 尝试获取 ViewHolder。
  - 跟第二次的区别在于，之前是根据 position 查找，现在是根据 id 查找
- 第四次，`mViewCacheExtension` 不为空的话，则调用`ViewCacheExtension#getViewForPositionAndType` 方法尝试获取 View
  - ViewCacheExtension 是由开发者设置的，默认情况下为空，一般我们也不会设置。这层缓存大部分情况下可以忽略
- 第五次，尝试从 `RecyclerViewPool` 中获取，相比较于 mCachedViews，从 mRecyclerPool 中成功获取 ViewHolder 对象后并没有做合法性和 item 位置校验，只检验 viewType 是否一致
  - 从 RecyclerViewPool 中取出来的 ViewHolder 需要重新执行 onBindViewHolder 才能使用
- 如果上面五次尝试都失败了，调用 `RecyclerView.Adapter#onCreateViewHolder` 创建一个新的 ViewHolder；最后根据 ViewHolder 的状态，确定是否需要调用 `onBindViewHolder` 进行数据绑定

#### getViewForPosition

```java
// RecyclerView.Recycler Android29
@NonNull
public View getViewForPosition(int position) {
    return getViewForPosition(position, false);
}
View getViewForPosition(int position, boolean dryRun) {
    return tryGetViewHolderForPositionByDeadline(position, dryRun, FOREVER_NS).itemView;
}
// 尝试获得指定位置的ViewHolder，要么从scrap，cache，RecycledViewPool中获取，要么直接创建
ViewHolder tryGetViewHolderForPositionByDeadline(int position, boolean dryRun, long deadlineNs) {
   ViewHolder holder = null;
    // 0. If there is a changed scrap, try to find from there
    if (mState.isPreLayout()) {
        holder = getChangedScrapViewForPosition(position);
        fromScrapOrHiddenOrCache = holder != null;
    }
    // 1. 通过position从attach scrap或一级回收缓存中获取ViewHolder
    if (holder == null) {
        holder = getScrapOrHiddenOrCachedHolderForPosition(position, dryRun);
        // ...
    }
    if (holder == null) {
        final int type = mAdapter.getItemViewType(offsetPosition);
        
        // 设置了stableIds，通过position和type在attach scrap集合和一级回收缓存中查找viewHolder
        // 2. Find from scrap/cache via stable ids, if exists
        if (mAdapter.hasStableIds()) {
            holder = getScrapOrCachedViewForId(mAdapter.getItemId(offsetPosition), type, dryRun);
            // ...
        }
        // 3. 从自定义缓存中(mViewCacheExtension)获取ViewHolder
        if (holder == null && mViewCacheExtension != null) {
            final View view = mViewCacheExtension.getViewForPositionAndType(this, position, type);
            if (view != null) {
                holder = getChildViewHolder(view);
                if (holder == null) {
                    throw new IllegalArgumentException()
                } else if (holder.shouldIgnore()) {
                    throw new IllegalArgumentException();
                }
            }
        }
        // 4. 从RecyclerViewPool缓存池中拿ViewHolder
        if (holder == null) { // fallback to pool
            holder = getRecycledViewPool().getRecycledView(type);
            // ...
        }
        // 5. 所有缓存都没有命中，RecyclerView.Adapter.createViewHolder创建ViewHolder
        if (holder == null) {
            long start = getNanoTime();
            holder = mAdapter.createViewHolder(RecyclerView.this, type);
            // ...
        }
    }
    // ...
    boolean bound = false;
    if (mState.isPreLayout() && holder.isBound()) {
        // do not update unless we absolutely have to.
        holder.mPreLayoutPosition = position;
    } else if (!holder.isBound() || holder.needsUpdate() || holder.isInvalid()) { // 只有未bound 或invalid的viewHolder才能绑定视图数据
        // ...
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        // 获得ViewHolder后，绑定视图数据
        bound = tryBindViewHolderByDeadline(holder, offsetPosition, position, deadlineNs);
    }
    
    // 设置LayoutParams，赋值ViewHolder给RecyclerView.LayoutParams
    final ViewGroup.LayoutParams lp = holder.itemView.getLayoutParams();
    final LayoutParams rvLayoutParams;
    if (lp == null) {
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

##### 0. 从mChangedScrap （mState.isPreLayout()为true）

```java
ViewHolder tryGetViewHolderForPositionByDeadline(int position, boolean dryRun, long deadlineNs) {
    boolean fromScrapOrHiddenOrCache = false;
    ViewHolder holder = null;
    // 0) If there is a changed scrap, try to find from there
    if (mState.isPreLayout()) {
        holder = getChangedScrapViewForPosition(position);
        fromScrapOrHiddenOrCache = holder != null;
    }  
    // ...
}
```

##### 1. 从mAttachedScrap、mCacheViews  根据position

依次从三个地方搜索ViewHolder，找到立即返回ViewHolder：

1. `Recycler.mAttachedScrap`
2. `ChildHelper.mHiddenViews`（隐藏表项）
3. `Recycler.mCachedViews`

> 当成功从mCachedViews中获取ViewHolder对象后，还需要对其索引进行判断，这就意味着mCachedViews中缓存的ViewHolder只能复用于指定位置。例如，手指向上滑动，列表向下滚动，第2个表项移出屏幕，第4个表项移入屏幕，此时再滑回去，第2个表项再次出现，这个过程中第4个表项不能复用被回收的第2个表项的ViewHolder，因为他们的位置不同，而再次进入屏幕的第2个表项就可以成功复用。

```java
// RecyclerView.Recycler Android29
// 1) Find by position from scrap/hidden list/cache
if (holder == null) {
    holder = getScrapOrHiddenOrCachedHolderForPosition(position, dryRun);
    if (holder != null) {
        // 检验ViewHolder有效性: isRemoved/position/viewType(preLayout不校验)/itemId(如果mHasStableIds=true)
        if (!validateViewHolderForOffsetPosition(holder)) {
            // recycle holder (and unscrap if relevant) since it can't be used
            if (!dryRun) { // dryRun为false，将ViewHolder
                // we would like to recycle this but need to make sure it is not used by
                // animation logic etc.
                holder.addFlags(ViewHolder.FLAG_INVALID);
                if (holder.isScrap()) {
                    removeDetachedView(holder.itemView, false);
                    holder.unScrap();
                } else if (holder.wasReturnedFromScrap()) {
                    holder.clearReturnedFromScrapFlag();
                }
                recycleViewHolderInternal(holder);
            }
            holder = null;
        } else { // 校验通过
            fromScrapOrHiddenOrCache = true;
        }
    }
}
// 从attach scrap，hidden children或cache中获得指定位置上的一个ViewHolder
ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position, boolean dryRun) {
    final int scrapCount = mAttachedScrap.size();

    // 1.在attached scrap(mAttachedScrap)中搜索ViewHolder
    // Try first for an exact, non-invalid match from scrap.
    for (int i = 0; i < scrapCount; i++) {
        final ViewHolder holder = mAttachedScrap.get(i);
        // ViewHolder的position相同；ViewHolder valid的；ViewHolder没有标记为removed
        if (!holder.wasReturnedFromScrap() && holder.getLayoutPosition() == position
                && !holder.isInvalid() && (mState.mInPreLayout || !holder.isRemoved())) {
            holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
            return holder;
        }
    }

    // 2. 移除屏幕的视图中搜索ViewHolder，找到了之后将他存入scrap回收集合中
    if (!dryRun) {
        View view = mChildHelper.findHiddenNonRemovedView(position);
        if (view != null) {
            // This View is good to be used. We just need to unhide, detach and move to the
            // scrap list.
            final ViewHolder vh = getChildViewHolderInt(view);
            mChildHelper.unhide(view);
            int layoutIndex = mChildHelper.indexOfChild(view);
            if (layoutIndex == RecyclerView.NO_POSITION) {
                throw new IllegalStateException("layout index should not be -1 after "
                        + "unhiding a view:" + vh + exceptionLabel());
            }
            mChildHelper.detachViewFromParent(layoutIndex);
            scrapView(view); // 添加到mAttachedScrap
            vh.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP
                    | ViewHolder.FLAG_BOUNCED_FROM_HIDDEN_LIST);
            return vh;
        }
    }

    // 3. 在一级缓存(mCachedViews)中搜索ViewHolder
    // Search in our first-level recycled view cache.
    final int cacheSize = mCachedViews.size();
    for (int i = 0; i < cacheSize; i++) {
        final ViewHolder holder = mCachedViews.get(i);
        // invalid view holders may be in cache if adapter has stable ids as they can be
        // retrieved via getScrapOrCachedViewForId
        // 若找到ViewHolder，还需要对ViewHolder的索引进行匹配判断：1.viewholder是valid 2.postion一致 
        if (!holder.isInvalid() && holder.getLayoutPosition() == position
                && !holder.isAttachedToTransitionOverlay()) {
            if (!dryRun) {
                mCachedViews.remove(i);
            }
            if (DEBUG) {
                Log.d(TAG, "getScrapOrHiddenOrCachedHolderForPosition(" + position
                        + ") found match in cache: " + holder);
            }
            return holder;
        }
    }
    return null;
}
```

###### 1.1 mHasStableIds 根据id/type

`getScrapOrHiddenOrCachedHolderForPosition(position, dryRun)`是通过position表项位置，这一次是通过itemId表项id和viewType。内部实现也几乎一样，判断的依据从表项位置变成表项id。为表项设置id属于特殊情况

```java
if (holder == null) {
    final int offsetPosition = mAdapterHelper.findPositionOffset(position);
    if (offsetPosition < 0 || offsetPosition >= mAdapter.getItemCount()) {
        throw new IndexOutOfBoundsException("Inconsistency detected. Invalid item "
                + "position " + position + "(offset:" + offsetPosition + ")."
                + "state:" + mState.getItemCount() + exceptionLabel());
    }
    final int type = mAdapter.getItemViewType(offsetPosition);
    // 2) Find from scrap/cache via stable ids, if exists
    if (mAdapter.hasStableIds()) {
        holder = getScrapOrCachedViewForId(mAdapter.getItemId(offsetPosition), type, dryRun);
        if (holder != null) {
            // update position
            holder.mPosition = offsetPosition;
            fromScrapOrHiddenOrCache = true;
        }
    }
}
ViewHolder getScrapOrCachedViewForId(long id, int type, boolean dryRun) {
    // Look in our attached views first
    final int count = mAttachedScrap.size();
    for (int i = count - 1; i >= 0; i--) {
        final ViewHolder holder = mAttachedScrap.get(i);
        if (holder.getItemId() == id && !holder.wasReturnedFromScrap()) {
            if (type == holder.getItemViewType()) {
                holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
                if (holder.isRemoved()) {
                    // this might be valid in two cases:
                    // > item is removed but we are in pre-layout pass
                    // >> do nothing. return as is. make sure we don't rebind
                    // > item is removed then added to another position and we are in
                    // post layout.
                    // >> remove removed and invalid flags, add update flag to rebind
                    // because item was invisible to us and we don't know what happened in
                    // between.
                    if (!mState.isPreLayout()) {
                        holder.setFlags(ViewHolder.FLAG_UPDATE, ViewHolder.FLAG_UPDATE
                                | ViewHolder.FLAG_INVALID | ViewHolder.FLAG_REMOVED);
                    }
                }
                return holder;
            } else if (!dryRun) {
                // if we are running animations, it is actually better to keep it in scrap
                // but this would force layout manager to lay it out which would be bad.
                // Recycle this scrap. Type mismatch.
                mAttachedScrap.remove(i);
                removeDetachedView(holder.itemView, false);
                quickRecycleScrapView(holder.itemView);
            }
        }
    }

    // Search the first-level cache
    final int cacheSize = mCachedViews.size();
    for (int i = cacheSize - 1; i >= 0; i--) {
        final ViewHolder holder = mCachedViews.get(i);
        if (holder.getItemId() == id && !holder.isAttachedToTransitionOverlay()) {
            if (type == holder.getItemViewType()) {
                if (!dryRun) {
                    mCachedViews.remove(i);
                }
                return holder;
            } else if (!dryRun) {
                recycleCachedViewAt(i);
                return null;
            }
        }
    }
    return null;
}
```

##### 2. 从mViewCacheExtension

```java
// Recycler Android29
ViewHolder tryGetViewHolderForPositionByDeadline(int position, boolean dryRun, long deadlineNs) {
    // ...
    if (holder == null && mViewCacheExtension != null) {
       // We are NOT sending the offsetPosition because LayoutManager does not
       // know it.
      final View view = mViewCacheExtension.getViewForPositionAndType(this, position, type);
       if (view != null) {
            // 获得view对应的ViewHolder
            holder = getChildViewHolder(view);
            if (holder == null) {
                throw new IllegalArgumentException("getViewForPositionAndType returned"
                                + " a view which does not have a ViewHolder"
                                + exceptionLabel());
            } else if (holder.shouldIgnore()) {
               throw new IllegalArgumentException("getViewForPositionAndType returned"
                                + " a view that is ignored. You must call stopIgnoring before"
                                + " returning this view." + exceptionLabel());
            }
        }
    }
    // ...
}
```

经过从mAttachedScrap和mCachedViews获取ViewHolder未果后，继续尝试通过ViewCacheExtension 获取：

```java
// ViewCacheExtension提供了额外的表项缓存层，用户帮助开发者自己控制表项缓存
// 当Recycler从attached scrap和first level cache中未能找到匹配的表项时，它会在去RecycledViewPool中查找之前，先尝试从自定义缓存中查找
public abstract static class ViewCacheExtension {
    public abstract View getViewForPositionAndType(Recycler recycler, int position, int type);
}
```

ViewCacheExtension用于开发者自定义表项缓存，且这层缓存的访问顺序位于mAttachedScrap和mCachedViews之后，RecycledViewPool 之前。

##### 3. 从mRecyclerPool  RecycledViewPool

```java
ViewHolder tryGetViewHolderForPositionByDeadline(int position, boolean dryRun, long deadlineNs) {
    // ...
    if (holder == null) { 
      // ...
      // 从回收池中获取ViewHolder对象
      holder = getRecycledViewPool().getRecycledView(type);
      if (holder != null) { // 这里没有校验ViewHolder
           holder.resetInternal();
           if (FORCE_INVALIDATE_DISPLAY_LIST) {
                invalidateDisplayListInt(holder);
           }
      }
    }
    // ...
}
```

RecycledViewPool：

```java
public static class RecycledViewPool {
    // 同类ViewHolder缓存个数上限
    private static final int DEFAULT_MAX_SCRAP = 5;

    /**
     * Tracks both pooled holders, as well as create/bind timing metadata for the given type.
     * 回收池中存放单个类型ViewHolder的容器
     */
    static class ScrapData {
        // 同类ViewHolder存储在ArrayList中
        ArrayList<ViewHolder> mScrapHeap = new ArrayList<>();
        // 每种类型的ViewHolder最多存5个
        int mMaxScrap = DEFAULT_MAX_SCRAP;
    }
    // 回收池中存放所有类型ViewHolder的容器
    SparseArray<ScrapData> mScrap = new SparseArray<>();
    // ...
    // ViewHolder入池 按viewType分类入池，一个类型的ViewType存放在一个ScrapData中
    public void putRecycledView(ViewHolder scrap) {
        final int viewType = scrap.getItemViewType();
        final ArrayList<ViewHolder> scrapHeap = getScrapDataForType(viewType).mScrapHeap;
        // 如果超限了，则放弃入池
        if (mScrap.get(viewType).mMaxScrap <= scrapHeap.size()) {
            return;
        }
        scrap.resetInternal();
        // 回收时，ViewHolder从列表尾部插入
        scrapHeap.add(scrap);
    }
    // 从回收池中获取ViewHolder对象
    public ViewHolder getRecycledView(int viewType) {
          final ScrapData scrapData = mScrap.get(viewType);
          if (scrapData != null && !scrapData.mScrapHeap.isEmpty()) {
              final ArrayList<ViewHolder> scrapHeap = scrapData.mScrapHeap;
              // 复用时，从列表尾部获取ViewHolder（优先复用刚入池的ViewHoler）
              return scrapHeap.remove(scrapHeap.size() - 1);
          }
          return null;
    }
}
```

RecycledViewPool中的ViewHolder存储在SparseArray中，并且按viewType分类存储（即是Adapter.getItemViewType()的返回值），同一类型的ViewHolder存放在ArrayList 中，且默认最多存储5个。

相比较于mAttachedScrap/mCachedViews，从mRecyclerPool中成功获取ViewHolder对象后并没有做合法性和表项位置校验，只检验viewType是否一致。所以从mRecyclerPool中取出的ViewHolder只能复用于相同viewType的表项。

##### 4. createViewHolder

```java
ViewHolder tryGetViewHolderForPositionByDeadline(int position,boolean dryRun, long deadlineNs) {
    // ...
    // 所有缓存都没有命中，只能创建ViewHolder
    if (holder == null) {
        // ...
        holder = mAdapter.createViewHolder(RecyclerView.this, type);
        // ...
    }
    // ...
    boolean bound = false;
    if (mState.isPreLayout() && holder.isBound()) {
        // do not update unless we absolutely have to.
        holder.mPreLayoutPosition = position;
    }
    // 如果holder没有绑定过数据 或 表项需要更新 或 表项无效 且表项没有被移除时绑定表项数据
    else if (!holder.isBound() || holder.needsUpdate() || holder.isInvalid()) {
        // ... 
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        // 为表项绑定数据
        bound = tryBindViewHolderByDeadline(holder, offsetPosition, position, deadlineNs);
    }
}
```

### ViewHolder的回收

#### mCacheViews/RecycledPoolView

滚动列表时移出屏幕的item需要被回收，滚动是由MotionEvent.ACTION_MOVE事件触发的，就以RecyclerView.onTouchEvent()为切入点寻觅“回收表项”的时机：

```java
public class RecyclerView extends ViewGroup implements ScrollingView, NestedScrollingChild2 {
    @Override
    public boolean onTouchEvent(MotionEvent e) {
        // ...
        case MotionEvent.ACTION_MOVE: {
                // ...
                // 内部滚动
                if (scrollByInternal(
                        canScrollHorizontally ? dx : 0,
                        canScrollVertically ? dy : 0, vtev)) {
                    getParent().requestDisallowInterceptTouchEvent(true);
                }
                // ...
            }
        } break;
        // ...
    }
}
```

然后调用scrollByInternal

```java
public class RecyclerView extends ViewGroup implements ScrollingView, NestedScrollingChild2 {
   // ...
   LayoutManager mLayout;// 处理滚动的LayoutManager
   // ...
   boolean scrollByInternal(int x, int y, MotionEvent ev) {
        // ...
        if (mAdapter != null) {
            mReusableIntPair[0] = 0;
            mReusableIntPair[1] = 0;
            scrollStep(x, y, mReusableIntPair);
            // ...
        }
        // ...
    }
    void scrollStep(int dx, int dy, @Nullable int[] consumed) {
        int consumedX = 0;
        int consumedY = 0;
        if (dx != 0) {
            consumedX = mLayout.scrollHorizontallyBy(dx, mRecycler, mState);
        }
        if (dy != 0) {
            consumedY = mLayout.scrollVerticallyBy(dy, mRecycler, mState);
        }
        // ...
    }
}
```

RecyclerView把滚动委托给LayoutManager来处理，以LinearLayoutManager为例：

```java
public class LinearLayoutManager extends RecyclerView.LayoutManager implements ItemTouchHelper.ViewDropHandler, RecyclerView.SmoothScroller.ScrollVectorProvider {

    @Override
    public int scrollVerticallyBy(int dy, RecyclerView.Recycler recycler,
            RecyclerView.State state) {
        if (mOrientation == HORIZONTAL) {
            return 0;
        }
        return scrollBy(dy, recycler, state);
    }

    int scrollBy(int dy, RecyclerView.Recycler recycler, RecyclerView.State state) {
    	...
        //更新LayoutState（这个函数对于“回收哪些表项”来说很关键，待会会提到）
        updateLayoutState(layoutDirection, absDy, true, state);
        //滚动时向列表中填充新的表项
        final int consumed = mLayoutState.mScrollingOffset + fill(recycler, mLayoutState, state, false);
		...
        return scrolled;
    }
    int fill(RecyclerView.Recycler recycler, LayoutState layoutState, RecyclerView.State state, boolean stopOnFocusable) {
        ...
        int remainingSpace = layoutState.mAvailable + layoutState.mExtra;
        LayoutChunkResult layoutChunkResult = mLayoutChunkResult;
        //不断循环获取新的表项用于填充，直到没有填充空间
        while ((layoutState.mInfinite || remainingSpace > 0) && layoutState.hasMore(state)) {
            ...
            //填充新的表项
            layoutChunk(recycler, state, layoutState, layoutChunkResult);
			...
            if (layoutState.mScrollingOffset != LayoutState.SCROLLING_OFFSET_NaN) {
                //在当前滚动偏移量基础上追加因新表项插入增加的像素（这句话对于“回收哪些表项”来说很关键）
                layoutState.mScrollingOffset += layoutChunkResult.mConsumed;
                ...
                //回收表项
                recycleByLayoutState(recycler, layoutState);
            }
            ...
        }
        ...
        return start - layoutState.mAvailable;
    }
}
```

然后调用recycleByLayoutState回收item：

```java
public class LinearLayoutManager extends RecyclerView.LayoutManager {
    ...
    private void recycleByLayoutState(RecyclerView.Recycler recycler, LayoutState layoutState) {
        if (!layoutState.mRecycle || layoutState.mInfinite) {
            return;
        }
        if (layoutState.mLayoutDirection == LayoutState.LAYOUT_START) {
            // 从列表尾回收，RV手指向下滑动
            recycleViewsFromEnd(recycler, layoutState.mScrollingOffset);
        } else {
            // 从列表头回收，RV手指向上滑动
            recycleViewsFromStart(recycler, layoutState.mScrollingOffset);
        }
    }
    ...
}
```

然后调用recycleViewsFromStart/recycleViewsFromEnd回收item

```java
/**
 * 当向列表尾部滚动时回收滚出屏幕的表项，手指向上 
 * @param dt（该参数被用于检测滚出屏幕的表项）
 */
private void recycleViewsFromStart(RecyclerView.Recycler recycler, int scrollingOffset,int noRecycleSpace) {
    final int limit = scrollingOffset - noRecycleSpace;
    //从头开始遍历 LinearLayoutManager，以找出应该会回收的表项
    final int childCount = getChildCount();
    for (int i = 0; i < childCount; i++) {
        View child = getChildAt(i);
        // 如果表项的下边界 > limit 这个阈值（当某表项底部位于 limit 隐形线之后时，回收它以上的所有表项）
        if (mOrientationHelper.getDecoratedEnd(child) > limit
                || mOrientationHelper.getTransformedEndWithDecoration(child) > limit) {
            //回收索引为 0 到 i-1 的表项
            recycleChildren(recycler, 0, i);
            return;
        }
    }
}
// ...
```

现在看看`LinearLayoutManager#recycleChildren`

```java
// LinearLayoutManager
private void recycleChildren(RecyclerView.Recycler recycler, int startIndex, int endIndex) {
    if (startIndex == endIndex) {
        return;
    }
    if (endIndex > startIndex) {
        for (int i = endIndex - 1; i >= startIndex; i--) {
            removeAndRecycleViewAt(i, recycler);
        }
    } else {
        for (int i = startIndex; i > endIndex; i--) {
            removeAndRecycleViewAt(i, recycler);
        }
    }
}
```

走到`LinearLayoutManager#removeAndRecycleViewAt`

```java
public void removeAndRecycleViewAt(int index, @NonNull Recycler recycler) {
    final View view = getChildAt(index);
    removeViewAt(index);
    recycler.recycleView(view);
}
```

然后调用`Recycler#recycleView`，最后调用`Recycler#recycleViewHolderInternal`

```java
public void recycleView(@NonNull View view) {
    ViewHolder holder = getChildViewHolderInt(view);
    recycleViewHolderInternal(holder);
}
void recycleViewHolderInternal(ViewHolder holder) {
    boolean cached = false;
    boolean recycled = false;
    if (forceRecycle || holder.isRecyclable()) {
        // 先存在mCachedViews里面
        if (mViewCacheMax > 0
                && !holder.hasAnyOfTheFlags(ViewHolder.FLAG_INVALID
                | ViewHolder.FLAG_REMOVED
                | ViewHolder.FLAG_UPDATE
                | ViewHolder.FLAG_ADAPTER_POSITION_UNKNOWN)) {
            // Retire oldest cached view
            int cachedViewSize = mCachedViews.size();
            // 如果mCachedViews大小超限了，添加到RecyclerViewPool中去，然后删掉最老的被缓存的ViewHolder
            if (cachedViewSize >= mViewCacheMax && cachedViewSize > 0) {
                recycleCachedViewAt(0);
                cachedViewSize--;
            }

            int targetCacheIndex = cachedViewSize;
            if (ALLOW_THREAD_GAP_WORK
                    && cachedViewSize > 0
                    && !mPrefetchRegistry.lastPrefetchIncludedPosition(holder.mPosition)) {
                // when adding the view, skip past most recently prefetched views
                int cacheIndex = cachedViewSize - 1;
                while (cacheIndex >= 0) {
                    int cachedPos = mCachedViews.get(cacheIndex).mPosition;
                    if (!mPrefetchRegistry.lastPrefetchIncludedPosition(cachedPos)) {
                        break;
                    }
                    cacheIndex--;
                }
                targetCacheIndex = cacheIndex + 1;
            }
            // 添加到mCacheViews中
            mCachedViews.add(targetCacheIndex, holder);
            cached = true;
        }
        if (!cached) {
            // 添加到RecyclerViewPool中去
            addViewHolderToRecycledViewPool(holder, true);
            recycled = true;
        }
    }
}
```

在`Recycler#recycleViewHolderInternal`中，ViewHolder 最终的落脚点有两个：

1. mCachedViews 有大小限制，默认只能存2个ViewHolder，当第三个ViewHolder存入时会把第一个移除掉，并添加的RecycledViewPool中去<br />`Recycler#recycleCachedViewAt`，先将这个ViewHolder添加到RecyclerPool中去，然后删掉mCachedViews最老的被缓存的ViewHolder（即第0个）

```java
void recycleCachedViewAt(int cachedViewIndex) {
    ViewHolder viewHolder = mCachedViews.get(cachedViewIndex);
    addViewHolderToRecycledViewPool(viewHolder, true);
    mCachedViews.remove(cachedViewIndex);
}
```

> 从mCachedViews移除掉的ViewHolder会加入到回收池中。 mCachedViews有点像“回收池预备队列”，即总是先回收到mCachedViews，当它放不下的时候，按照先进先出原则将最先进入的ViewHolder存入回收池。

2. RecycledViewPool<br />ViewHolder会按viewType分类存入RecycledViewPool（回收池），最终存储在ScrapData 的ArrayList中

#### mAttachedScrap/mChangedScrap

- 什么是`scrapped view`？

> 一个View当前处于attached RV但是被标记成了removal或reuse。

- mAttachedScrap/mChangedScrap何时被添加？

`Recycler#mAttachedScrap`和`Recycler#mChangedScrap`只有在`Recycler#scrapView`中被添加

```java
// Recycler#scrapView Android29
// 回收 ViewHolder 到 scrap 集合（mAttachedScrap或mChangedScrap）
void scrapView(View view) {
    final ViewHolder holder = getChildViewHolderInt(view);
    // 一个ViewHolder标记为了removal，invalid 或 ViewHolder未更新 
    if (holder.hasAnyOfTheFlags(ViewHolder.FLAG_REMOVED | ViewHolder.FLAG_INVALID)
            || !holder.isUpdated() || canReuseUpdatedViewHolder(holder)) {
        holder.setScrapContainer(this, false);
        // 添加到 mAttachedScrap 集合中
        mAttachedScrap.add(holder);
    } else {
        if (mChangedScrap == null) {
            mChangedScrap = new ArrayList<ViewHolder>();
        }
        holder.setScrapContainer(this, true);
        // 添加到 mChangedScrap 集合中
        mChangedScrap.add(holder);
    }
}
```

- 何时调用scrapView？

调用链往上找到`RecyclerView#LayoutManager#scrapOrRecycleView`

```java
// RecyclerView#LayoutManager Android29
private void scrapOrRecycleView(Recycler recycler, int index, View view) {
    final ViewHolder viewHolder = getChildViewHolderInt(view);
    if (viewHolder.shouldIgnore()) {
        return;
    }
    if (viewHolder.isInvalid() && !viewHolder.isRemoved()
            && !mRecyclerView.mAdapter.hasStableIds()) { // 删除表项并入mCacheViews或RecycledPoolView
        removeViewAt(index);
        recycler.recycleViewHolderInternal(viewHolder);
    } else { // detach 表项并入 scrapped 集合
        detachViewAt(index);
        recycler.scrapView(view);
        mRecyclerView.mViewInfoStore.onViewDetached(viewHolder);
    }
}
```

沿着调用链继续向上：

```java
// RecyclerView#LayoutManager Android29
// 暂时detach(分离)和scrap(回收)所有attached的view
public void detachAndScrapAttachedViews(@NonNull Recycler recycler) {
    final int childCount = getChildCount();
    for (int i = childCount - 1; i >= 0; i--) { // 遍历所有attached表项并回收他们
        final View v = getChildAt(i);
        scrapOrRecycleView(recycler, i, v);
    }
}
// detach单个View，并添加到scrap集合中
public void detachAndScrapView(@NonNull View child, @NonNull Recycler recycler) {
    int index = mChildHelper.indexOfChild(child);
    scrapOrRecycleView(recycler, index, child);
}
// detach单个View，并添加到scrap集合中
public void detachAndScrapViewAt(int index, @NonNull Recycler recycler) {
    final View child = getChildAt(index);
    scrapOrRecycleView(recycler, index, child);
}
```

然后在LinearLayoutManager#onLayoutChildren调用：

```java
// LinearLayoutManager#onLayoutChildren调用 Android29
// 布局所有子表项
public void onLayoutChildren(Recycler recycler, State state) {
    // ...
    // 在填充表项之前回收所有表项
    detachAndScrapAttachedViews(recycler);
    // ...
    // 填充表项
    fill(recycler, mLayoutState, state, false);
    // ...
}
```

最后在RecyclerView#dispatchLayoutStep2调用

```java
// RecyclerView Android29
public class RecyclerView extends ViewGroup implements ScrollingView, NestedScrollingChild2 {
    // RecyclerView布局的第二步
    private void dispatchLayoutStep2() {
        // ...
        mLayout.onLayoutChildren(mRecycler, mState);
        // ...
    }
}
```

- mAttachedScrap何时清空？

mAttachedScrap被访问的地方，其中只有一处调用了`Recycler.clearScrap()`

```java
// RecyclerView#Recycler Android29
public class RecyclerView {
    public final class Recycler {
        // 清空 scrap 结构
        void clearScrap() {
            mAttachedScrap.clear();
            if (mChangedScrap != null) {
                mChangedScrap.clear();
            }
        }
    }
}
```

在LayoutManager.removeAndRecycleScrapInt()中被调用

```java
public abstract static class LayoutManager {
     // 回收所有 scrapped view
    void removeAndRecycleScrapInt(Recycler recycler) {
        final int scrapCount = recycler.getScrapCount();
        // Loop backward, recycler might be changed by removeDetachedView()
        // 遍历搜有 scrap view 重置 ViewHolder 状态，并将其回收到缓存池
        for (int i = scrapCount - 1; i >= 0; i--) {
            final View scrap = recycler.getScrapViewAt(i);
            final ViewHolder vh = getChildViewHolderInt(scrap);
            if (vh.shouldIgnore()) {
                continue;
            }
            vh.setIsRecyclable(false);
            if (vh.isTmpDetached()) {
                mRecyclerView.removeDetachedView(scrap, false);
            }
            if (mRecyclerView.mItemAnimator != null) {
                mRecyclerView.mItemAnimator.endAnimation(vh);
            }
            vh.setIsRecyclable(true);
            recycler.quickRecycleScrapView(scrap);
        }
        // 清空 scrap view 集合
        recycler.clearScrap();
        if (scrapCount > 0) {
            mRecyclerView.invalidate();
        }
    }
}
```

沿着调用链向上：

```java
public class RecyclerView extends ViewGroup implements ScrollingView, NestedScrollingChild2 {
    // RecyclerView布局的最后一步
    private void dispatchLayoutStep3() {
        // ...
        mLayout.removeAndRecycleScrapInt(mRecycler);
        // ...
    }
}
```

> mAttachedScrap生命周期起始于RecyclerView布局开始，终止于RecyclerView布局结束。

- 小结
  1. 在将item一个个填充到列表之前会先将其先回收到mAttachedScrap中，回收数据的来源是LayoutManager的孩子，而LayoutManager的孩子都是屏幕上可见的或即将可见的item
  2. 注释中“暂时将当当前可见表项进行分离并回收”，既然是“暂时回收”，那待会必然会发生“复用”。在`Recycler#getViewForPosition`
  3. mAttachedScrap用于屏幕中可见item的回收和复用
  4. mAttachedScrap生命周期起始于RecyclerView布局开始，终止于RecyclerView布局结束

### RecyclerView缓存总结

#### RecyclerView缓存优先级（优先级从高到低）

1. 从mAttachedScrap获取
2. 从mCachedViews获取

> mAttachedScrap和mCachedViews不需要onBindViewHolder

3. 从ViewCacheExtension 开发者自定义，很少用
4. 从mRecyclerPool获取

> 复用的ViewHolder需要重新绑定数据走onBindViewHolder

| 缓存类型                         | 缓存结构                                                                                                           | 重新创建onCreateViewHolder | 重新绑定onBindViewHolder | 缓存容量                                                                                                                                  | 缓存用途                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| mAttachedScrap/mChangedScrap | `ArrayList<ViewHolder>`                                                                                        | false                  | false                | 没有大小限制，但最多包含屏幕可见item数量                                                                                                                | 用于布局过程中屏幕可见表项的回收和复用，起于dispatchLayoutStep2，终止dispatchLayoutStep3                                                  |
| mCachedViews                 | `ArrayList<ViewHolder>`                                                                                        | false                  | false                | 默认大小限制为2(Android21起prefect开启会多1个为3)，放不下时，按照先进先出原则将最先进入的ViewHolder存入RecycledViewPool以腾出空间；通过`RV#setItemViewCacheSize`<br />更改默认大小      | 用于移出屏幕表项的回收和复用，且只能用于指定位置的表项，有点像“回收池预备队列”，即总是先回收到mCachedViews，当它放不下的时候，按照先进先出原则将最先进入的ViewHolder存入RecycledViewPool |
| mRecyclerPool                | RecycledViewPool，对ViewHolder按viewType分类存储在`SparseArray<ScrapData>`<br />中，同类ViewHolder存储在ScrapData中的ArrayList中 | false                  | true                 | 对ViewHolder按viewType分类存储（通过SparseArray），同类ViewHolder存储在默认大小为5的ArrayList；通过`RV#setMaxRecycledViews(int viewType, int max)`<br />更改默认大小 | 用于移出屏幕表项的回收和复用，且只能用于指定viewType的表项                                                                                |
| mViewCacheExtension          | ViewCacheExtension                                                                                             | -                      | -                    | -                                                                                                                                     | 开发者自定义，很少用                                                                                                       |

#### 小结

1. RecyclerView不是每次都会调用onCreateViewHolder创建ViewHolder对象，也不是每次都会走onBindViewHolder重新绑定数据
2. RecyclerView的缓存用一个Recycler对象保存着；Recycler有4个层次用于缓存 ViewHolder 对象，优先级从高到底依次为ArrayList mAttachedScrap、ArrayList mCachedViews、ViewCacheExtension mViewCacheExtension、RecycledViewPool mRecyclerPool。缓存命中的不需要走onCreateViewHolder来创建，如果四层缓存都未命中，则重新创建并绑定 ViewHolder 对象。
3. RecycledViewPool对 ViewHolder 按viewType分类存储（通过SparseArray），同类 ViewHolder 存储在默认最大大小为5的ArrayList中。
4. RecycledViewPool复用的ViewHolder需要重新走onBindViewHolder绑定数据，RecycledViewPool根据viewType来复用ViewHolder
5. mAttachedScrap或者mCachedViews根据position复用ViewHolder的，不需要走onCreateViewHolder，也不需要走onBindViewHolder绑定数据；mCachedViews默认最大大小是2(Android21起prefect开启会多1个为3)

> mCachedViews用于缓存指定位置的 ViewHolder ，只有“列表回滚”这一种场景（刚滚出屏幕的表项再次进入屏幕），才有可能命中该缓存

## 相关问题

### RecyclerView回收复用的是什么？View？ViewHolder?

RecyclerView回收机制中，回收复用的对象是ViewHolder，且以ArrayList为结构存储在Recycler对象中

### RecycledViewPool保存了什么？默认最多一个viewType保存多少个？

不同viewType的ViewHolder，某种viewType默认最多保存5个

### 既然有了mAttachedScrap，为什么还需要mCachedViews呢？mAttachedScrap是无限大的，完全可以将mCachedViews的数据放到mAttachedScrap里面

mAttachedScrap保存的是刚刚滑出屏幕的部分，所以他和mChangedScrap才会在if，else里去分条件添加，而mCachedViews保存的是滑出屏幕中position失效的部分

### RecycledViewPool和mAttachedScrap，mCachedViews缓存区别是什么？分别缓存了什么？

### 滚动时item是如何被填充或回收的？

### Recycler是什么？

## Ref

-  [ ] RecyclerView缓存原理，有图有真相<br /><https://juejin.cn/post/6844903661726859271>
-  [x] RecyclerView 缓存机制 | 如何复用表项？<br /><https://juejin.cn/post/6844903778303344647>
