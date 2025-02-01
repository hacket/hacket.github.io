---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 27th 2025, 1:33:07 am
title: View scroll&fling&drag&click
author: hacket
categories:
  - AndroidUI
category: 事件
tags: [事件]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:19 晚上
image-auto-upload: true
feed: show
format: list
aliases: [View scroll（View 滚动）]
linter-yaml-title-alias: View scroll（View 滚动）
---

# View scroll（View 滚动）

## View.canScrollVertically/ canScrollHorizontally

1. direcation 为负数时，是检查对应 View 是否能够向下滑动，能，返回为 true；反之返回 false
2. direcation 为正数时，是检查对应 View 是否能够向上滑动，能，返回为 true,反之返回 false。

```java
/**
 * Check if this view can be scrolled vertically in a certain direction. 检测能否在垂直方向滚动
 *
 * @param direction Negative to check scrolling up, positive to check scrolling down. 负数表示是否能向下(手指从上往下)滚动，检查是否到顶；正数表示是否能向上(手指从下往上)滚动，检查是否到底  和注释似乎是反的
 * @return true if this view can be scrolled in the specified direction, false otherwise.
 */
public boolean canScrollVertically(int direction) {
    final int offset = computeVerticalScrollOffset(); // 计算控件垂直方向的偏移值
    final int range = computeVerticalScrollRange() - computeVerticalScrollExtent();
    if (range == 0) return false;
    if (direction < 0) {
        return offset > 0;
    } else {
        return offset < range - 1;
    }
}
```

- 对于 RecyclerView
  1. recyclerView.canScrollVertically(1) 检查是否能向上（手指从下往上）滚动， 判断是否滑动到底部; 返回 false 表示不能往上滑动，即代表到底部了；
  2. recyclerView.canScrollVertically(-1) 检查是否能向下（手指从从往下）滚动，判断是否滑动到顶部，返回 false 表示不能往下滑动，即代表到顶部了；

## 改变 view 自身的 left/right/top/bottom

### setTop/setBottom/setLeft/setRight

改变 view 在其父容器的 left/right/top/bottom 值（view 距离其父容器的边距），requestLayout 后会恢复原样；该方法不要单独调用，由 layout system 调用

> getLeft：view 左边距离父容器左边的距离；getRight：view 的右边距离父容器左边的距离；getTop：view 上边距离父容器上边的距离；getBottom：view 下边距离父容器上边的距离。

### offsetTopAndBottom/offsetLeftAndRight

改变 view 在其父容器的 left/right/top/bottom 值（view 距离其父容器的边距），requestLayout 后会恢复原样

1. void offsetTopAndBottom(int offset)

整个 view 上下移动，`offset>0` 向下移动，`offset<0` 向上移动

2. void offsetLeftAndRight(int offset)

整个 view 左右移动，`offset>0` 向右移动，`offset<0` 向左移动

### layout() 布局

在 ACTION_MOVE 中通过获取 x、y 的偏移量动态布局 view，view 消费事件：

```java
@Override
public boolean onTouchEvent(MotionEvent event) {

    int x = (int) event.getX();
    int y = (int) event.getY();

    switch (event.getAction()) {
        case MotionEvent.ACTION_DOWN:
            mLastX = x;
            mLastY = y;
            break;

        case MotionEvent.ACTION_MOVE:
            int offsetX = x - mLastX;
            int offsetY = y - mLastY;
            layout(
                    getLeft() + offsetX,
                    getTop() + offsetY,
                    getRight() + offsetX,
                    getBottom() + offsetY
            );
            break;
    }
    return true;
}
```

### margin 外边距

实现方法和 layout 相似，动态设置布局参数，缺点是如果 view 参数有 rules，会导致无法滑动:

```java
case MotionEvent.ACTION_MOVE:
    int offsetX = x - mLastX;
    int offsetY = y - mLastY;

    ViewGroup.MarginLayoutParams params
            = (ViewGroup.MarginLayoutParams) getLayoutParams();

    params.leftMargin = getLeft() + offsetX;
    params.topMargin = getTop() + offsetY;

    setLayoutParams(params);
    break;
```

## translation

### setTranslationY/setTranslationX

requestLayout 不会复位

1. setTranslationX 改变相对于 view 的 getLeft 的水平坐标
2. setTranslationY 改变相对于 view 的 getTop 的垂直坐标

### setX/setY xy 坐标位置

view 左上角的相对于父控件的坐标，同 setTranslationX/setTranslationY；requestLayout 不会复位

```java
public void setX(float x) {
    setTranslationX(x - mLeft);
}
public float getX() {
    return mLeft + getTranslationX();
}
public void setY(float y) {
    setTranslationY(y - mTop);
}
public float getY() {
    return mTop + getTranslationY();
}
```

### TranslateAnimation 平移动画

## scrollTo/scrollBy 滚动 View 的内容

scrollTo、scrollBy 滑动的是**View 中的内容**（而且还是整体滑动），而不是 View 本身；对于 TextView，移动的就是其文字移动<br />scrollTo 滑动速度很快，都是瞬间的

```java
/**
 * The offset, in pixels, by which the content of this view is scrolled horizontally.
 */
protected int mScrollX; // View的内容相当于View起始坐标的偏移量， X轴方向；通过getScrollX()方法获得
/**
 * The offset, in pixels, by which the content of this view is scrolled vertically.
 */
protected int mScrollY; // View的内容相当于View起始坐标的偏移量， Y轴方向；通过getScrollY()方法获得

// 累加便宜
public void scrollBy(int x, int y) {
    scrollTo(mScrollX + x, mScrollY + y);
}
// 将view的内容偏移x和y
public void scrollTo(int x, int y) {
    if (mScrollX != x || mScrollY != y) {
        int oldX = mScrollX;
        int oldY = mScrollY;
        mScrollX = x;
        mScrollY = y;
        invalidateParentCaches();
        onScrollChanged(mScrollX, mScrollY, oldX, oldY);
        if (!awakenScrollBars()) {
            postInvalidateOnAnimation();
        }
    }
}
```

1. getScrollX()、getScrollY() <br />getScrollX()、getScrollY() 得到的是偏移量，是相对自己初始位置的滑动偏移距离，只有当有 scroll 事件发生时，这两个方法才能有值，否则 getScrollX()、getScrollY() 都是初始时的值。mScrollX 为正代表着当前内容相对于初始位置向左偏移了 mScrollX 的距离，mScrollX 为负表示当前内容相对于初始位置向右偏移了 mScrollX 的距离
2. **移动的方向**  

> 在处理偏移、滑动问题时坐标系和平常认知的坐标系是相反的。x 大于 0，向左移动，小于 0，向右移动；y 大于 0，向上移动，y 小于 0，向下移动

说明：图中**黄色矩形区域**表示的是一个可滑动的 View 控件，**绿色虚线矩形**为滑动控件中的滑动内容。注意这里的坐标是相反的。

调用 scrollTo(100,0) 表示将 View 中的内容移动到距离内容初始显示位置的 x=100，y=0 的地方，效果如下图：<br />

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270119353.png)

<br />调用 scrollTo(0,100) 效果如下图：<br />

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270128212.png)

调用 scrollTo(100,100) 效果如下图：<br />

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270119354.png)

- Ref

- [x] Android scrollTo() scrollBy() Scroller 讲解及应用<br /><https://blog.csdn.net/wangjinyu501/article/details/32339379>

## scroll 总结

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270119355.png)

> scrollBy 有误，点击事件区域随着 scrollBy 后变

### setTranslationX/Y

1. getX getY 会变
2. getTranslationX/Y 会变
3. 点击事件的位置也变了但是不会超过父布局
4. 会超过边界到同级 View 的区域去（被覆盖或者覆盖别人）
5. 这个方法的底层实现主要是通过 metrix 矩阵变换来的，坐标位置没有改变（跟 offset 不同，它是通过坐标位置改变）
6. 调用 requestLayout 也不会让 View 发生任何改变。

### scrollTo/scrollBy

1. getScrollX/Y 会变
2. 点击事件在 scrollTo 后的位置，但 getX/Y 不会变
3. 内容区域变了（如果超出自己的区域就显示不出来）
4. 只是内容区域的移动，本身 view 是不移动的
5. scrollBy 的 x y 是相对移动的值
6. scrollTo 的 x y 是绝对移动的值

### offsetTopAndBottom/offsetLeftAndRight

1. 上下左右坐标会变（主要是通过坐标位置的改变产生移动效果）
2. getXY 会变
3. 点击事件的位置也变了
4. 会超过边界到别人的区域去（被覆盖或者覆盖别人）
5. 它的 offY 是相对移动的值
6. 会让 View 在父容器里面上下移动，原理是改变了 View 的 mTop 的值，但是一旦调用 requestLayout，OffsetTopAndBottom 发生的改变就会被清除，View 又会回到最开始的位置，因为 mTop 被重新赋值了

### 平移补间动画

1. 点击事件还是在原位置
2. 如果 setFillAfter 位置保留但是其他任何坐标位置没有改变 再次点击从原位置重新开始移动

# fling

## 如何获取 velocityX、velocityY 值？

1. 使用 `android.view.GestureDetector` 在 OnGestureListener 中有 onFling 方法， 可以得到速度值：

```java
public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY)
```

2. 使用 VelocityTracker

```java
mVelocityTracker = VelocityTracker.obtain(); // 初始化

mVelocityTracker.addMovement(ev);       // 将 onTouchEvent 中的每一个事件加入

mVelocityTracker.recycle();           // 在 ACTION_UP 和 ACTION_CANCEL 中 销毁

// 在 ACTION_UP 事件中计算 velocityX 和 velocityY
velocityTracker.computeCurrentVelocity(1000, mMaximumVelocity);  // 第一个参数是单位，1表示 "像素/ms"  1000表示 "像素/s"  第二个参数是最大值。耗时较大，需要时才调用.   
int initialVelocity = (int) velocityTracker.getYVelocity(mActivePointerId);  // 获取速度

if (Math.abs(initialVelocity) > mMinimumVelocity) {
     // 和系统预设的最小值比较
     fling(-initialVelocity);
}
```

## VelocityTracker 速度检测器

### VelocityTracker 使用

VelocityTracker 用于追踪手指滑动过程中的瞬时速度<br />使用方法如下：

```java
VelocityTracker velocityTracker = VelocityTracker.obtain();
// 想要追踪当前速度，将事件加入追踪器
velocityTracker.addMovement(event);

// 调用计算速度代码, 这个必须要调用
velocityTracker.computeCurrentVelocity(1000);

// 分别获取x轴和y轴方向的1s时间内的平均速度
int xVelocity = (int) velocityTracker.getXVelocity();
int yVelocity = (int) velocityTracker.getYVelocity();
// 释放追踪器
velocityTracker.recycle();
// 重置并回收内存
velocityTracker.clear();
```

使用步骤：

```java
// 1. 得到一个VelocityTracker
VelocityTracker velocityTracker = VelocityTracker.obtain();

// 2. 在onTouchEvent将事件加入到追踪器中
velocityTracker.addMovement(event);

// 3. 计算速度，在getX/YVelocity()前调用
velocityTracker.computeCurrentVelocity(1000); // 参数units：1000表示单位每秒

// 4. 获取x或y方向的速度
velocityTracker.getXVelocity()/getYVelocity(); 

// 5. 释放VelocityTracker，放到sPool池中去
velocityTracker.recycle();
```

### VelocityTracker 缓存

涉及的方法：

```java
static public VelocityTracker obtain()
public void recycle()
```

缓存：

```java
// 设置VelocityTracker缓存池大小为2
private static final SynchronizedPool<VelocityTracker> sPool =
            new SynchronizedPool<VelocityTracker>(2);

static public VelocityTracker obtain() {
      //从缓存池中获取VelocityTracker对象
       VelocityTracker instance = sPool.acquire();
       return (instance != null) ? instance : new VelocityTracker(null);
}
/**
  * 释放VelocityTracker归还缓存池中
  */
public void recycle() {
    if (mStrategy == null) {
        clear();
        sPool.release(this);
    }
}
```

### VelocityTracker 案例

```java
public class XView extends View {

    private VelocityTracker mVelocityTracker = null;

    public XView(Context context) {
        super(context);
        init();
    }

    public XView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public XView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = event.getAction();
        switch (action) {
            case MotionEvent.ACTION_DOWN:
                if (mVelocityTracker == null ) {
                    // Retrieve a new VelocityTracker object to watch the velocity of a motion.
                    mVelocityTracker = VelocityTracker.obtain();
                } else {
                    // Reset the velocity tracker back to its initial state.
                    mVelocityTracker.clear();
                }
                // Add a user's movement to the tracker
                mVelocityTracker.addMovement(event);
                break;
            case MotionEvent.ACTION_MOVE:
                mVelocityTracker.addMovement(event);
                // When you want to determine the velocity, call
                // computeCurrentVelocity(). Then call getXVelocity()
                // and getYVelocity() to retrieve the velocity for each pointer ID.
                mVelocityTracker.computeCurrentVelocity(1000);
                // Log velocity of pixels per second
                // Best practice to use VelocityTrackerCompat where possible.
                LogUtil.e("hacket", "X velocity: " + mVelocityTracker.getXVelocity());
                LogUtil.e("hacket", "Y velocity: " + mVelocityTracker.getYVelocity());
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                // Return a VelocityTracker object back to be re-used by others.
//                mVelocityTracker.recycle();
                break;
        }
        return true;
    }

}
```

# Scroller/OverScroller 实现平滑移动

View 的 scrollTo()、scrollBy() 是瞬间完成的，当我们的手指在屏幕上移动时，内容会跟着手指滑动，但是当我们手指一抬起时，滑动就会停止，如果我们想要有一种惯性的滚动过程效果和回弹效果，此时就需要使用 Scroller 辅助类。<br />**Scroller 本身不会去移动 View，它只是一个移动计算辅助类，用于跟踪控件滑动的轨迹，只相当于一个滚动轨迹记录工具，最终还是通过 View 的 scrollTo、scrollBy 方法完成 View 的移动的。**

## 常用方法

### 构造方法

- Scroller(Context context, Interpolator interpolator, boolean flywheel)
  - 第一个参数 context： 上下文；
  - 第二个参数 interpolator： 插值器，用于在 computeScrollOffset 方法中，并且是在 SCROLL_MODE 模式下，根据时间的推移计算位置。为 null 时，使用默认 ViscousFluidInterpolator 插值器。
  - 第三个参数 flywheel： 支持渐进式行为，该参数只作用于 FLING_MODE 模式下。

### startScroll

```java
public void startScroll(int startX, int startY, int dx, int dy, int duration)
```

开始一个动画控制，由 (startX , startY) 在 duration 时间内前进 (dx,dy) 个单位，即到达偏移坐标为 (startX+dx , startY+dy) 处。

```java
// Scroller
public class Scroller {
    private int mMode; // 滑动模式
    private int mStartX; // 水平方向，滑动时的起点偏移坐标
    private int mStartY; // 垂直方向，滑动时的起点偏移坐标
    private int mFinalX; // 滑动完成后的偏移坐标，水平方向
    private int mFinalY; // 滑动完成后的偏移坐标，垂直方向
    
    private int mCurrX; // 滑动过程中，根据消耗的时间计算出的当前的滑动偏移距离，水平方向
    private int mCurrY; // 滑动过程中，根据消耗的时间计算出的当前的滑动偏移距离，垂直方向
    private int mDuration; // 本次滑动的动画时间
    private float mDeltaX; // 滑动过程中，在达到mFinalX前还需要滑动的距离，水平方向
    private float mDeltaY; // 滑动过程中，在达到mFinalX前还需要滑动的距离，垂直方向
    
    // 开始一个动画控制，由(startX,startY)在duration时间内前进(dx,dy)个单位，即到达偏移坐标为(startX+dx , startY+dy)处
    public void startScroll(int startX, int startY, int dx, int dy, int duration) {
        mMode = SCROLL_MODE; 
        mFinished = false;
        mDuration = duration;
        mStartTime = AnimationUtils.currentAnimationTimeMillis();
        mStartX = startX;
        mStartY = startY;
        mFinalX = startX + dx;
        mFinalY = startY + dy;
        mDeltaX = dx;
        mDeltaY = dy;
        mDurationReciprocal = 1.0f / (float) mDuration; // mDuration倒数
    }
}
```

### computeScrollOffset

滑动过程中，根据当前已经消逝的时间计算当前偏移的坐标点，保存在 mCurrX 和 mCurrY 值中；返回 true 表示动画还未完成，false 表示动画完成了

```java
// Scroller
// 滑动过程中，根据当前已经消逝的时间计算当前偏移的坐标点，保存在mCurrX和mCurrY值中
public boolean computeScrollOffset() {
    if (mFinished) { // 已经完成了本次动画控制，直接返回为false
        return false;
    }
    // 消逝的时间
    int timePassed = (int)(AnimationUtils.currentAnimationTimeMillis() - mStartTime);
    if (timePassed < mDuration) { // 消逝的时间小于duration
        switch (mMode) {
        case SCROLL_MODE: // 滚动模式
            // mInterpolator插入器生成一个插入值
            final float x = mInterpolator.getInterpolation(timePassed * mDurationReciprocal);
            // 更新mCurrX和mCurrY
            mCurrX = mStartX + Math.round(x * mDeltaX);
            mCurrY = mStartY + Math.round(x * mDeltaY);
            break;
        case FLING_MODE:
            // ...
        }
    } else {  // 消逝的时间大于duration，表示完成了
        mCurrX = mFinalX;
        mCurrY = mFinalY;
        mFinished = true;
    }
    return true;
}
```

### fling

```java
public void fling(int startX, int startY, int velocityX, int velocityY,
                      int minX, int maxX, int minY, int maxY)
```

用于带速度的滑动，行进的距离将取决于投掷的初始速度。可以用于实现类似 RecycleView 的滑动效果。

- 第一个参数 startX： 开始滑动点的 x 坐标
- 第二个参数 startY： 开始滑动点的 y 坐标
- 第三个参数 velocityX： 水平方向的初始速度，单位为每秒多少像素（px/s）
- 第四个参数 velocityY： 垂直方向的初始速度，单位为每秒多少像素（px/s）
- 第五个参数 minX： x 坐标最小的值，最后的结果不会低于这个值；
- 第六个参数 maxX： x 坐标最大的值，最后的结果不会超过这个值；
- 第七个参数 minY： y 坐标最小的值，最后的结果不会低于这个值；
- 第八个参数 maxY： y 坐标最大的值，最后的结果不会超过这个值；

> minX <= 终止值的 x 坐标 <= maxX; minY <= 终止值的 y 坐标 <= maxY

### 其他

1. setFriction(float friction)  用于设置在 FLING_MODE 模式下的摩擦系数

- 第一个参数 friction： 摩擦系数

2. boolean isFinished() 滚动是否已结束，用于判断 Scroller 在滚动过程的状态，我们可以做一些终止或继续运行的逻辑分支。
3. forceFinished(boolean finished) 强制的让滚动状态置为我们所设置的参数值 finished 。
4. getDuration() 返回 Scroller 将持续的时间（以毫秒为单位）。
5. int getCurrX() 返回滚动中的当前 X 相对于原点的偏移量，即当前坐标的 X 坐标。
6. int getCurrY() 返回滚动中的当前 Y 相对于原点的偏移量，即当前坐标的 Y 坐标。
7. float getCurrVelocity() 获取当前速度。
8. abortAnimation() 停止动画，值得注意的是，此时如果调用 getCurrX() 和 getCurrY() 移动到的是最终的坐标，这一点和通过 forceFinished 直接将动画停止是不相同的。

## Scroller 原理

Scroller 类中最重要的两个方法就是 `startScroll()` 和 `computeScrollOffset()`，但是 Scroller 类只是一个滑动计算辅助类，它的 startScroll() 和 computeScrollOffset() 方法中也只是对一些轨迹参数进行设置和计算，真正需要进行滑动还是得通过 View 的 scrollTo()、scrollBy() 方法。为此，View 中提供了 `computeScroll()` 方法来控制这个滑动流程。computeScroll() 方法会在绘制子视图的时候进行调用。其源码如下：

```java
// View
// 由父视图调用用来请求子视图根据偏移值 mScrollX,mScrollY重新绘制
public void computeScroll() {
    // 空方法，自定义滑动功能的View必须实现方法体  
}
```

computeScroll 在 `View#draw(Canvas,ViewGroup,long)` 中调用

```java
// View
boolean draw(Canvas canvas, ViewGroup parent, long drawingTime) {
    boolean drawingWithRenderNode = mAttachInfo != null
        && mAttachInfo.mHardwareAccelerated
        && hardwareAcceleratedCanvas;
    // ...
    if (drawingWithRenderNode) { // 硬件加速
        // Delay getting the display list until animation-driven alpha values are
        // set up and possibly passed on to the view
        renderNode = updateDisplayListIfDirty();
        if (!renderNode.hasDisplayList()) {
            // Uncommon, but possible. If a view is removed from the hierarchy during the call
            // to getDisplayList(), the display list will be marked invalid and we should not
            // try to use it again.
            renderNode = null;
            drawingWithRenderNode = false;
        }
    }
    int sx = 0;
    int sy = 0;
    if (!drawingWithRenderNode) { // 非硬件加速
        computeScroll();
        sx = mScrollX;
        sy = mScrollY;
    }
    // ...
}
public RenderNode updateDisplayListIfDirty() {
    try {
        if (layerType == LAYER_TYPE_SOFTWARE) {
            buildDrawingCache(true);
            Bitmap cache = getDrawingCache(true);
            if (cache != null) {
                canvas.drawBitmap(cache, 0, 0, mLayerPaint);
            }
        } else {
            computeScroll();
            // ...
        }
    } finally {
        renderNode.endRecording();
        setDisplayListProperties(renderNode);
    }
}
```

而 `View#draw(Canvas,ViewGroup,long)` 又被 ViewGroup 中的 `dispatchDraw` 调用。

所以 `View#computeScroll` 最终是被其父容器的 ViewGroup 调用

## Scroller 基本使用流程

### scroll 使用流程

1. 首先通过 Scroller 类的 startScroll() 开始一个滑动动画控制，里面进行了一些轨迹参数的设置和计算
2. 再调用 startScroll() 的后面调用 invalidate()；引起视图的重绘操作，从而触发 ViewGroup 中的 computeScroll() 被调用
3. 在 computeScroll() 方法中，先调用 Scroller 类中的 computeScrollOffset() 方法判断是否完成了滑动，返回 false 表示完成了滑动；返回 true 表示滑动未完成，再根据当前消耗时间进行轨迹坐标的计算，然后取得计算出的当前滑动的偏移坐标，调用 View 的 scrollTo() 方法进行滑动控制。最后也需要调用 invalidate()，进行重绘

### fling

当用户手指快速划过屏幕，然后快速立刻屏幕时，系统会判定用户执行了一个 Fling 手势。视图会快速滚动，并且在手指立刻屏幕之后也会滚动一段时间。Drag 表示手指滑动多少距离，界面跟着显示多少距离，而 fling 是根据你的滑动方向与轻重，还会自动滑动一段距离。

在检测 Fling 时，你需要检测手指在屏幕上滑动的速度，这是你就需要 VelocityTracker 和 Scroller 这两个类啦。

1. 我们首先使用 VelocityTracker.obtain() 这个方法获得其实例，然后每次处理触摸时间时，我们将触摸事件通过 addMovement 方法传递给它
2. 最后在处理 ACTION_UP 事件时，我们通过 computeCurrentVelocity 方法获得滑动速度;
3. 我们判断滑动速度是否大于一定数值 (MinFlingSpeed),如果大于，那么我们调用 Scroller 的 fling 方法。然后调用 invalidate() 函数。
4. 我们需要重载 View#computeScroll 方法，在这个方法内，我们调用 Scroller 的 computeScrollOffset() 方法啦计算当前的偏移量，然后获得偏移量，并调用 scrollTo 函数,最后调用 postInvalidate() 函数。
5. 除了上述的操作外，我们需要在处理 ACTION_DOWN 事件时，对屏幕当前状态进行判断，如果屏幕现在正在滚动 (用户刚进行了 Fling 手势)，我们需要停止屏幕滚动。

```java
@Override
public boolean onTouchEvent(MotionEvent event) {
    // .....
    if (mVelocityTracker == null) {
        //检查速度测量器，如果为null，获得一个
        mVelocityTracker = VelocityTracker.obtain();
    }
    int action = MotionEventCompat.getActionMasked(event);
    int index = -1;
    switch (action) {
        case MotionEvent.ACTION_DOWN:
            // ......
            if (!mScroller.isFinished()) { //fling
                mScroller.abortAnimation();
            }
            // .....
            break;
        case MotionEvent.ACTION_MOVE:
            ......
            break;
        case MotionEvent.ACTION_CANCEL:
            endDrag();
            break;
        case MotionEvent.ACTION_UP:
            if (mIsBeingDragged) {
            //当手指立刻屏幕时，获得速度，作为fling的初始速度     mVelocityTracker.computeCurrentVelocity(1000,mMaxFlingSpeed);
                int initialVelocity = (int)mVelocityTracker.getYVelocity(mActivePointerId);
                if (Math.abs(initialVelocity) > mMinFlingSpeed) {
                    // 由于坐标轴正方向问题，要加负号。
                    doFling(-initialVelocity);
                }
                endDrag();
            }
            break;
        default:
    }
    //每次onTouchEvent处理Event时，都将event交给时间
    //测量器
    if (mVelocityTracker != null) {
        mVelocityTracker.addMovement(event);
    }
    return true;
}
private void doFling(int speed) {
    if (mScroller == null) {
        return;
    }
    mScroller.fling(0,getScrollY(),0,speed,0,0,-500,10000);
    invalidate();
}
@Override
public void computeScroll() {
    if (mScroller.computeScrollOffset()) {
        scrollTo(mScroller.getCurrX(),mScroller.getCurrY());
        postInvalidate();
    }
}
```

## OverScroller

Scroller 出现的比较早，在 API1 就有了，OverScroller 是在 API9 才添加上的，出现的比较晚，所以功能比较完善，Over 的意思就是超出，即 OverScroller 提供了对超出滑动边界的情况的处理，这两个类 80% 的 API 是一致的，OverScroller 比 Scroller 添加了下面几个方法:

1. isOverScrolled()
2. springBack(int startX, int startY, int minX, int maxX, int minY, int maxY)
3. notifyHorizontalEdgeReached(int startX, int finalX, int overX)
4. notifyVerticalEdgeReached(int startY, int finalY, int overY)<br />5.overScroll.fling(int startX, int startY, int velocityX, int velocityY,int minX, int maxX, int minY, int maxY, int overX, int overY)<br />滑动 fling 时触发调用，参数：

```
startX:       fling的起始X位标
startY:       fling的起始Y位标
velocityX:    X轴的滑动速度
velocityY:    Y轴的滑动速度
minX:    fling的最小的X坐标，也就是left的临界点：画布向左滑动，dexIndex的值是正的，向右滑动dexIndex的值是负的。所以如果你画布一进去就是从最右边开始绘制，也就是需要向右滑动查看其余的数据，那么这个值就是你总需要滑动的x的负数
maxX    :    fling的最大的X坐标，也就是right的临界点，如果你一开始就在最右边，也就是画布没移动的时候，最初位置的时候，那么max就是0
minY    :    同minX一样
maxY    :    同maxX一样
overX    :    就是滑动到X临界点后可以回弹的距离，也可以理解为缓冲区
overY    ：    就是滑动到Y临界点后可以回弹的距离，也可以理解为缓冲区
```

### OverScroll 使用

1. onTouchEvent 的 ACTION_UP 事件中，调用 `View#overScrollBy`
2. 然后回调 `View#onOverScrolled`，在这里判断是否需要处理 overScroll，需要处理调用 `OverScroller#springBack`；不需要调用 `View#scrollTo` 内容滚动
3. 在 `View#computeScroll()` 获取到当前值处理，按情况调用 `View#overScrollBy`

#### overScroll.boolean springBack(int startX, int startY, int minX, int maxX, int minY, int maxY)

结合 fling（）使用，是做一些回滚操作，也就是回滚到设置的正确临界点，一般是讲 fling 的 overX 的距离回滚到正确的临界点

```
startX:        回滚的起点X,一般是getScrollX()
startY：    回滚的起点Y,一般是getScrollY()
minX  :        这个就是正确的最小的临界点坐标X,
maxX  :        这个就是正确的最大的临界点坐标X    ----》正常startX是大于maxX或者是小于minX,才会有回滚效果
minY  :     同上
maxY  :        同上
```

前两个是开始位置，是绝对坐标，minX 和 maxX 是用来设定滚动范围的，也是绝对坐标范围，如果 startX 不在这个范围里面，比如大于 maxX，就会触发 computeScroll()，我们可以移动距离，最终回弹到 maxX 所在的位置，并返回 true，从而完成后续的滚动效果，比 minX 小的话，就会回弹到 minX，一样的道理。所以我们可以像上面代码里面一样，判断是否在范围内，在的话，就 invalidate() 一下，触发滚动动画，所以名字叫 spingBack()，即回弹

#### View#overScrollBy

- boolean overScrollBy(int deltaX, int deltaY, int scrollX, int scrollY, int scrollRangeX, int scrollRangeY, int maxOverScrollX, int maxOverScrollY, boolean isTouchEvent)<br />参数：

1. deltaX/deltaY  在 x/y 轴滑动的距离
2. scrollX/scrollY  deltaX/deltaY 应用前的 scrollX/scrollY，一般直接调用 getScrollX()/getScrollY() 即可
3. scrollRangeX/scrollRangeY  x/y 轴最大的内容滚动范围
4. maxOverScrollX/maxOverScrollY  x/y 最大的 overScroll 像素
5. isTouchEvent 是否是 touch 事件

返回值：true 执行 overScroll；false 不执行

```java
protected boolean overScrollBy(int deltaX, int deltaY,
        int scrollX, int scrollY,
        int scrollRangeX, int scrollRangeY,
        int maxOverScrollX, int maxOverScrollY,
        boolean isTouchEvent) {
    // overScroll mode，OVER_SCROLL_ALWAYS/OVER_SCROLL_IF_CONTENT_SCROLLS/OVER_SCROLL_NEVER
    final int overScrollMode = mOverScrollMode;
    
    // 默认2个都是getWidth为false
    final boolean canScrollHorizontal =
            computeHorizontalScrollRange() > computeHorizontalScrollExtent();
    final boolean canScrollVertical =
            computeVerticalScrollRange() > computeVerticalScrollExtent();
    
    // 默认为false，如果overScrollMode设置了OVER_SCROLL_ALWAYS为true
    final boolean overScrollHorizontal = overScrollMode == OVER_SCROLL_ALWAYS ||
            (overScrollMode == OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollHorizontal);
    final boolean overScrollVertical = overScrollMode == OVER_SCROLL_ALWAYS ||
            (overScrollMode == OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollVertical);

    // 新的scrollX = 旧的scrollX + 即将要滚动的deltaX
    int newScrollX = scrollX + deltaX;
    if (!overScrollHorizontal) { // 水平方向不能overScroll，maxOverScrollX=0
        maxOverScrollX = 0;
    }
    // 新的scrollY = 旧的scrollY + 即将要滚动的deltaY
    int newScrollY = scrollY + deltaY;
    if (!overScrollVertical) { // // 竖直方向不能overScroll，maxOverScrollY=0
        maxOverScrollY = 0;
    }

    // Clamp values if at the limits and record
    // 定义一个overScroll的left/right/top/bottom边界
    final int left = -maxOverScrollX;
    final int right = maxOverScrollX + scrollRangeX;
    final int top = -maxOverScrollY;
    final int bottom = maxOverScrollY + scrollRangeY;

    // 新的newScrollX小于left或大于right，即超出了边界，需要overScroll
    boolean clampedX = false;
    if (newScrollX > right) {
        newScrollX = right;
        clampedX = true;
    } else if (newScrollX < left) {
        newScrollX = left;
        clampedX = true;
    }

    boolean clampedY = false;
    if (newScrollY > bottom) {
        newScrollY = bottom;
        clampedY = true;
    } else if (newScrollY < top) {
        newScrollY = top;
        clampedY = true;
    }

    // 回调onOverScrolled
    onOverScrolled(newScrollX, newScrollY, clampedX, clampedY);

    // x或y其中一个方向需要overScroll，返回true
    return clampedX || clampedY;
}

// 水平滚动条宽度
protected int computeHorizontalScrollRange() {
    return getWidth();
}
// 水平滚动块的范围
protected int computeHorizontalScrollExtent() {
    return getWidth();
}
```

#### View.onOverScrolled

- void onOverScrolled(int scrollX, int scrollY, boolean clampedX, boolean clampedY)<br />参数：
- scrollX/scrollY 滚动后的 scrollX/scrollY
- clampedX/clampedY scrollX/scrollY 需要 overScroll

View 的 onOverScrolled 默认为空实现

```
protected void onOverScrolled(int scrollX, int scrollY,
    boolean clampedX, boolean clampedY) {
// Intentionally empty.
}
```

## 案例

### Scroller 实现类 ViewPager 滑动效果

```kotlin
class ScrollerViewPagerV2 @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : ViewGroup(context, attrs, defStyleAttr) {

    private val mScroller by lazy(LazyThreadSafetyMode.NONE) { Scroller(getContext()) }
    private var mVelocityTracker: VelocityTracker? = null
    private val mTouchSlop by lazy { ViewConfiguration.get(context).scaledPagingTouchSlop }
    private val mMaxVelocity by lazy { ViewConfiguration.get(context).scaledMinimumFlingVelocity }

    private var mLastX = 0F

    /** 当前显示的是第几个屏幕
     */
    private var mCurrentPage = 0

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        for (i in 0 until childCount) {
            getChildAt(i).measure(widthMeasureSpec, heightMeasureSpec)
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        for (i in 0 until childCount) {
            val child = getChildAt(i)
            child.layout(i * width, t, (i + 1) * width, b)
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        initVelocityTracker()
        mVelocityTracker?.addMovement(event)
        when (event?.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                mLastX = event.x
                if (!mScroller.isFinished) {
                    LogUtils.w("ACTION_DOWN mScroller未Finish，abortAnimation。")
                    mScroller.abortAnimation()
                }
            }
            MotionEvent.ACTION_MOVE -> {
                val dx = mLastX - event.x
                scrollBy(dx.toInt(), 0)
                mLastX = event.x
            }
            MotionEvent.ACTION_UP -> {
                // dx>0:手指从右往左滑动;dy<0:手指从左往右滑动
                val dx = mLastX - event.x

                mVelocityTracker!!.computeCurrentVelocity(1000)
                val initVelocity = mVelocityTracker!!.xVelocity

                if (initVelocity > mMaxVelocity && mCurrentPage > 0) { // 如果是快速的向右滑，则需要显示上一个屏幕
                    LogUtils.d("快速的从左向右滑 initVelocity=$initVelocity，mMaxVelocity=$mMaxVelocity，scrollX=$scrollX，dx=$dx, mLastX=$mLastX")
                    scrollToPage(mCurrentPage - 1)
                } else if (initVelocity < -mMaxVelocity && mCurrentPage < childCount - 1) {
                    LogUtils.i("快速的从右向左滑 initVelocity=$initVelocity，mMaxVelocity=$mMaxVelocity，scrollX=$scrollX，dx=$dx, mLastX=$mLastX")
                    scrollToPage(mCurrentPage + 1)
                } else {
                    slowScrollToPage()
                    LogUtils.d("慢慢的滑动 initVelocity=$initVelocity，mMaxVelocity=$mMaxVelocity，scrollX=$scrollX，dx=$dx, mLastX=$mLastX")
                }
                recycleVelocityTracker()
            }
        }
        return true
    }

    private fun getStayPage(): Int {
        return (scrollX + width / 2) / width
    }

    /**
     * 缓慢滑动抬起手指的情形，需要判断是停留在本Page还是往前、往后滑动
     */
    private fun slowScrollToPage() {
        scrollToPage(getStayPage())
    }

    private fun scrollToPage(page: Int) {
        mCurrentPage = page
        if (mCurrentPage > childCount - 1) {
            mCurrentPage = childCount - 1
        }
        if (mCurrentPage <= 0) {
            mCurrentPage = 0
        }

        // 计算滑动到指定Page还需要滑动的距离
        val dx = mCurrentPage * width - scrollX
        // 动画时间设置为Math.abs(dx) * 2 m
        val duration = abs(dx) * 2
        mScroller.startScroll(scrollX, 0, dx, 0, duration)

        // 记住，使用Scroller类需要手动invalidate
        invalidate()
    }
    override fun computeScroll() {
        if (mScroller.computeScrollOffset()) {
            val currX = mScroller.currX
            val currY = mScroller.currY
            LogUtils.v("computeScroll() currX=$currX, currY=$currY")
            scrollTo(currX, currY)
            invalidate()
        }
    }
    private fun recycleVelocityTracker() {
        if (mVelocityTracker != null) {
            mVelocityTracker?.recycle()
            mVelocityTracker = null
        }
    }
    private fun initVelocityTracker() {
        if (mVelocityTracker == null) {
            mVelocityTracker = VelocityTracker.obtain()
        }
    }
}
```

### 上下拉切换直播间/左右清屏操作

remix 的实现是 scrollTo+ 属性动画

```kotlin
class BounceRelativeLayout @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : RelativeLayout(context, attrs, defStyleAttr) {

    private var mLastX = 0F
    private var mLastY = 0F
    private val mScroller by lazy(LazyThreadSafetyMode.NONE) { Scroller(getContext()) }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        when (event?.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                mLastX = event.x
                mLastY = event.y
            }
            MotionEvent.ACTION_MOVE -> {
                val dy = mLastY - event.y
                val dx = mLastX - event.x
                if (kotlin.math.abs(dy) >= kotlin.math.abs(dx)) {
                    scrollBy(0, dy.toInt())
                } else {
                    scrollBy(dx.toInt(), 0)
                }
                mLastX = event.x
                mLastY = event.y
            }
            MotionEvent.ACTION_UP -> {
                reset()
            }
        }
        return true
    }

    override fun computeScroll() {
        if (mScroller.computeScrollOffset()) {
            LogUtils.i("computeScroll currX=${mScroller.currX}, currY=${mScroller.currY}")
            scrollTo(mScroller.currX, mScroller.currY)
            invalidate()
        }
    }

    private fun reset() {
        beginScroll(-scrollX, -scrollY)
    }

    private fun beginScroll(dx: Int, dy: Int) {
        mScroller.startScroll(scrollX, scrollY, dx, dy)
        invalidate()
    }
}
```

### OverScroller 应用场景

1. 滑动边缘的反馈
2. 视差效果

## Scroller Ref

- [x] 自定义阻尼下拉回弹布局<br /><https://www.cnblogs.com/chyl411/p/3847930.html>
- [x] Android Scroll 详解 (二)：OverScroller 实战<br /><https://segmentfault.com/a/1190000004890728>

# GestureDetector

## GestureDetector

## ScaleGestureDetector

# ViewDragHelper 拖拽辅助

## ViewDragHelper 介绍

ViewDragHelper 提供的功能：

1. 子 View 去跟随我们手指移动
2. 边界检测、加速度检测 (eg：DrawerLayout 边界触发拉出)
3. 回调 Drag Release（eg：DrawerLayout 部分，手指抬起，自动展开/收缩）
4. 移动到某个指定的位置 (eg: 点击 Button，展开/关闭 Drawerlayout)

## ViewDragHelper 小结

1. 拖动是通过 offsetLeftAndRight/offsetTopAndBottom 来实现的，requestLayout 会恢复原位置
2. 定位用到的是 OverScroller

## ViewDragHelper 中的方法

### 构造方法

- ViewDragHelper create([@NonNull](/NonNull) ViewGroup forParent, float sensitivity,  [@NonNull](/NonNull) Callback cb) <br />参数：

参数 1：forParent 当前的 ViewGroup<br />参数 2：sensitivity 主要用于设置 touchSlop，可见传入越大，mTouchSlop 的值就会越小

```java
helper.mTouchSlop = (int) (helper.mTouchSlop * (1 / sensitivity));
```

参数 3：cb Callback，在用户的触摸过程中会回调相关方法

### MotionEvent 相关

#### shouldInterceptTouchEvent

拦截事件调用，在 viewgroup 的 onInterceptTouchEvent 中调用

#### processTouchEvent

若 ViewDragHelper 接受并处理父控件传递过来的触摸事件，则该方法内部会分析 MotionEvent 事件，并根据需要，触发监听回调事件。

需要强调的是：父控件的 onTouchEvent 实现方法需要调用 processTouchEvent 方法，才能将事件传递给 ViewDragHelper 让其分析处理。

### 滑动相关

#### smoothSlideViewTo/continueSettling 平滑滚动到指定位置，滚动速度为 0

- boolean smoothSlideViewTo([@NonNull](/NonNull) View child, int finalLeft, int finalTop) 该方法用于平顺地滑动控件到指定位置。child 代表子控件对象, finalLeft 代表滑动结束时子控件左边所处的位置， finalTop 代表子控件顶部的位置。 <br />如果此方法返回 true，则我们应该调用 continueSettling 方法让它继续滑动，直到返回 false，这次滑动才算完成。

smoothSlideViewTo 就做了一件事，通过 Scroller 开启滚动

```java
public boolean smoothSlideViewTo(@NonNull View child, int finalLeft, int finalTop) {
    mCapturedView = child;
    mActivePointerId = INVALID_POINTER;

    boolean continueSliding = forceSettleCapturedViewAt(finalLeft, finalTop, 0, 0);
    if (!continueSliding && mDragState == STATE_IDLE && mCapturedView != null) {
        // If we're in an IDLE state to begin with and aren't moving anywhere, we
        // end up having a non-null capturedView with an IDLE dragState
        mCapturedView = null;
    }

    return continueSliding;
}
```

里面调用了 `forceSettleCapturedViewAt方法`，xvel 和 yvel 为 0，是滚动不是 fling：

```java
private boolean forceSettleCapturedViewAt(int finalLeft, int finalTop, int xvel, int yvel) {
    final int startLeft = mCapturedView.getLeft();
    final int startTop = mCapturedView.getTop();
    final int dx = finalLeft - startLeft;
    final int dy = finalTop - startTop;

    if (dx == 0 && dy == 0) { // 位置没有变化，Scroller结束
        // Nothing to do. Send callbacks, be done.
        mScroller.abortAnimation();
        setDragState(STATE_IDLE);
        return false;
    }

    // 计算settle的时间(滑动的时长)
    final int duration = computeSettleDuration(mCapturedView, dx, dy, xvel, yvel);
    // 通过OverScroller开始滚动
    mScroller.startScroll(startLeft, startTop, dx, dy, duration);

    // 更新状态为STATE_SETTLING
    setDragState(STATE_SETTLING);
    return true;
}
```

- boolean continueSettling(boolean deferCallbacks) 当前时间移动 view

```java
public boolean continueSettling(boolean deferCallbacks) {
    if (mDragState == STATE_SETTLING) {
        boolean keepGoing = mScroller.computeScrollOffset();
        final int x = mScroller.getCurrX();
        final int y = mScroller.getCurrY();
        final int dx = x - mCapturedView.getLeft();
        final int dy = y - mCapturedView.getTop();

        if (dx != 0) {
            ViewCompat.offsetLeftAndRight(mCapturedView, dx);
        }
        if (dy != 0) {
            ViewCompat.offsetTopAndBottom(mCapturedView, dy);
        }

        if (dx != 0 || dy != 0) {
            mCallback.onViewPositionChanged(mCapturedView, x, y, dx, dy);
        }

        if (keepGoing && x == mScroller.getFinalX() && y == mScroller.getFinalY()) {
            // Close enough. The interpolator/scroller might think we're still moving
            // but the user sure doesn't.
            mScroller.abortAnimation();
            keepGoing = false;
        }

        if (!keepGoing) {
            if (deferCallbacks) {
                mParentView.post(mSetIdleRunnable);
            } else {
                setDragState(STATE_IDLE);
            }
        }
    }

    return mDragState == STATE_SETTLING;
}
```

#### settleCapturedViewAt

- boolean settleCapturedViewAt(int finalLeft, int finalTop) 松手前的滑动速度为初值，让捕获到的子 View 自动滑动到指定位置，它只能在 `Callback#onViewReleased()` 中使用，若 mReleaseInProgress 不为 True，则会抛出 IllegalStateException 异常；返回 true 时需要调用 `continueSettling(boolean)`；和 `smoothSlideViewTo` 不同的是，xy 方向的速率为手指释放前的速率。

传递的两个参数分别是结束时子控件的位置，其内部最终调用的是 forceSettleCapturedViewAt 方法。

```java
public boolean settleCapturedViewAt(int finalLeft, int finalTop) {
    if (!mReleaseInProgress) {
        throw new IllegalStateException("Cannot settleCapturedViewAt outside of a call to "
                + "Callback#onViewReleased");
    }

    return forceSettleCapturedViewAt(finalLeft, finalTop,
            (int) mVelocityTracker.getXVelocity(mActivePointerId),
            (int) mVelocityTracker.getYVelocity(mActivePointerId));
}
```

### ViewDragHelper.Callback 方法

#### boolean tryCaptureView(View child, int pointerId) 是否允许 child 捕获

```
是否捕获被拖拽的子View，child 为被触摸的子控件, 返回 true则表示允许拖拽，返回false则表示禁止。
```

#### void onViewDragStateChanged(int state) drag state 变化了

```
当View的拖拽状态改变时，回调该方法。state有三种状态：
    STATE_IDLE = 0    当前处于闲置状态
    STATE_DRAGGING = 1   正在被拖拽的状态
    STATE_SETTLING = 2   拖拽后被安放到一个位置中的状态
```

#### void onViewPositionChanged(View changedView, int left, int top, @Px int dx, @Px int dy) drag 或 settle view 的位置变化

```java
View被拖拽，位置发生改变时回调
    changedView ：被拖拽的View
    left : 被拖拽后 View的 left 坐标
    top :  被拖拽后 View的 top 坐标
    dx :   拖动的x偏移量
    dy :   拖动的y偏移量
```

#### void onViewCaptured(View capturedChild, int activePointerId) childView 被 drag 或 settle 捕获

```java
当子控件被捕获到准备开始拖动时回调
    capturedChild : 捕获的View
    activePointerId : 对应的PointerId
```

#### clampViewPositionVertical/clampViewPositionHorizontal 拖拽 view 左上角坐标限制

- int clampViewPositionHorizontal([@NonNull](/NonNull) View child, int left, int dx) 限制 child 在 x 轴方向的运动；返回值表示 child 左上角 left 在 x 轴的坐标
- int clampViewPositionVertical([@NonNull](/NonNull) View child, int top, int dy) 限制 child 在 y 轴方向的运动；返回值表示 child 左上角 top 在 y 轴的坐标

在 clampViewPositionVertical 和 clampViewPositionHorizontal 方法中对它的可滑动边界进行控制。left , top 分别为即将移动到的位置

```java
/**
 * 子控件水平方向位置改变时触发
 */
@Override
public int clampViewPositionHorizontal(View child, int left, int dx) {
    //屏蔽掉水平方向
    return 0;
}
/**
 * 子控件竖直方向位置改变时触发
 */
@Override
public int clampViewPositionVertical(View child, int top, int dy) {
    //不能滑出顶部
    return Math.max(top, 0);
}
```

#### onViewReleased view 拖拽释放时调用

- onViewReleased([@NonNull](/NonNull) View releasedChild, float xvel, float yvel) View

```
当被捕获拖拽的View被释放时回调，releasedChildView可能并没有停止滑动
   releasedChild : 被释放的View
   xvel : 释放View的x方向上的加速度，单位是px/s。
   yvel : 释放View的y方向上的加速度，单位是px/s。
```

可用来实现微信语音通话方形的悬浮框靠边停留

> 仅仅调用 settleCapturedViewAt 是不能达到目的的，还需要重写一下 ViewGroup 的 computeScroll 方法。因为用到了 Scroller

#### int getOrderedChildIndex(int index) 设置 view 的 z-order

```java
在寻找当前触摸点下的子View时会调用此方法，寻找到的View会提供给tryCaptureViewForDrag()来尝试捕获。如果需要改变子View的遍历查询顺序可改写此方法，例如让下层的View优先于上层的View被选中。
```

#### onEdgeXXX

这三个方法都与边缘相关，常见的侧滑菜单和滑动返回都可以利用这几个方法实现

##### onEdgeTouched(int edgeFlags, int pointerId)

在 `ViewDragHelper#processTouchEvent` 的 down 事件时，触摸时在 edge 时会回调

```java
如果parentView订阅了边缘触摸,则如果有边缘触摸就回调的接口
    edgeFlags : 当前触摸的flag 有: EDGE_LEFT,EDGE_TOP,EDGE_RIGHT,EDGE_BOTTOM
    pointerId : 用来描述边缘触摸操作的id
```

##### onEdgeDragStarted(int edgeFlags, int pointerId)

```java
边缘触摸开始时回调
    edgeFlags : 当前触摸的flag 有: EDGE_LEFT,EDGE_TOP,EDGE_RIGHT,EDGE_BOTTOM
    pointerId : 用来描述边缘触摸操作的id
```

##### onEdgeLock(int edgeFlags)

返回 true 会锁住当前的边界

> 是否锁定该边缘的触摸,默认返回 false,返回 true 表示锁定

#### getViewHorizontalDragRange(View child) 和 getViewVerticalDragRange(View child)

分别返回子 View 在水平和竖直方向可以被拖拽的范围，返回 0 表示无法被水平拖拽；返回值的单位是 px。

假设在前面的方块（即 TextView） 设置 android:clickable="true"，则再运行程序，会发现方块拖不动了，为什么呢？因为触摸事件被 TextView 消耗掉了。

在 ViewDragHelper 的 shouldInterceptTouchEvent 的源码中

```java
public boolean shouldInterceptTouchEvent(MotionEvent ev) {
    final int action = MotionEventCompat.getActionMasked(ev);
    switch (action) {
        case MotionEvent.ACTION_MOVE: {          
            final int pointerCount = ev.getPointerCount();
            for (int i = 0; i < pointerCount; i++) {           
                final int horizontalDragRange = mCallback.getViewHorizontalDragRange(
                            toCapture);
                final int verticalDragRange = mCallback.getViewVerticalDragRange(toCapture);
                // 如果getViewHorizontalDragRange和getViewVerticalDragRange的返回值都为0，则break
                if (horizontalDragRange == 0 && verticalDragRange == 0) {
                    break;
                }
                
                // tryCaptureViewForDrag方法中会设置mDragState=STATE_DRAGGING
                if (pastSlop && tryCaptureViewForDrag(toCapture, pointerId)) {
                    break;
                }
            }
            break;
        }
    }
    return mDragState == STATE_DRAGGING;
}
```

shouldInterceptTouchEvent 返回 true 的条件是 `mDragState == STATE_DRAGGING`，然而 mDragState 是在 tryCaptureViewForDrag 方法中被设置为 STATE_DRAGGING 的，此时 shouldInterceptTouchEvent 返回值就是 true，即 mParentView 会拦截事件，调用其 onTouchEvent，然后调用 ViewDragHelper 的 processTouchEvent。

所以，如果 horizontalDragRange == 0 && verticalDragRange == 0 这个条件一直为 true 的话，tryCaptureViewForDrag 方法就得不到调用了，mParentView 就不会拦截事件，也就不会调用了 processTouchEvent，也就滚动不了了。

而 horizontalDragRange 和 verticalDragRange 分别是 Callback 的 getViewHorizontalDragRange 和 getViewVerticalDragRange 方法返回的值，这两个方法默认情况下都返回 0。

重写这两个方法：

```java
@Override
public int getViewHorizontalDragRange(View child) {
    Log.d(TAG, "getViewHorizontalDragRange");
    return getMeasuredWidth() - child.getMeasuredWidth();
}
@Override
public int getViewVerticalDragRange(View child) {
    Log.d(TAG, "getViewVerticalDragRange");
    return getMeasuredHeight() - child.getMeasuredHeight();
}
```

方块（即 TextView） 就能拖拽并且能响应点击事件了。

### 方法的大致的回调顺序

```java
shouldInterceptTouchEvent：
    
    DOWN:
        getOrderedChildIndex(findTopChildUnder)
        ->onEdgeTouched
    
    MOVE:
        getOrderedChildIndex(findTopChildUnder)
        ->getViewHorizontalDragRange & 
          getViewVerticalDragRange(checkTouchSlop)(MOVE中可能不止一次)
        ->clampViewPositionHorizontal&
          clampViewPositionVertical
        ->onEdgeDragStarted
        ->tryCaptureView
        ->onViewCaptured
        ->onViewDragStateChanged

processTouchEvent:

    DOWN:
        getOrderedChildIndex(findTopChildUnder)
        ->tryCaptureView
        ->onViewCaptured
        ->onViewDragStateChanged
        ->onEdgeTouched
    MOVE:
        ->STATE==DRAGGING:dragTo
        ->STATE!=DRAGGING:
            onEdgeDragStarted
            ->getOrderedChildIndex(findTopChildUnder)
            ->getViewHorizontalDragRange&
              getViewVerticalDragRange(checkTouchSlop)
            ->tryCaptureView
            ->onViewCaptured
            ->onViewDragStateChanged
    UP:
        onViewReleased(mCapturedView)
        -> STATE=STATE_IDLE
```

## ViewDragHelper 原理

### 创建 ViewDragHelper 实例

ViewDragHelper 的第一步就是通过他提供的静态工厂方法 create 获取实例

```java
public class ViewDragHelper {
    public static ViewDragHelper create(ViewGroup forParent, float sensitivity, Callback cb) {
        final ViewDragHelper helper = create(forParent, cb);
        helper.mTouchSlop = (int) (helper.mTouchSlop * (1 / sensitivity)); // sensitivity值越大滑动越灵敏
        return helper;
    }
    public static ViewDragHelper create(ViewGroup forParent, Callback cb) {
        return new ViewDragHelper(forParent.getContext(), forParent, cb);
    }
}
```

三个参数的 create 方法实质调运的还是两个参数的 create。其中 `forParent` 一般是我们自定义的 ViewGroup，`cb` 是控制子 View 相关状态的回调抽象类实现对象，`sensitivity` 是用来调节 mTouchSlop 的，sensitivity 值越大滑动越灵敏。接着可以发现两个参数的 create 实质是调运了 ViewDragHelper 的构造函数：

```java
private ViewDragHelper(Context context, ViewGroup forParent, Callback cb) {
    // ...
    mParentView = forParent;
    mCallback = cb;
    
    final ViewConfiguration vc = ViewConfiguration.get(context);
    final float density = context.getResources().getDisplayMetrics().density;
    mEdgeSize = (int) (EDGE_SIZE * density + 0.5f); // EDGE_SIZE为20dp

    mTouchSlop = vc.getScaledTouchSlop(); // 通过ViewConfiguration获取TouchSlop，默认为8dp
    mMaxVelocity = vc.getScaledMaximumFlingVelocity(); // 获得允许执行一个fling手势动作的最大速度值
    mMinVelocity = vc.getScaledMinimumFlingVelocity(); // 获得允许执行一个fling手势动作的最小速度值
    mScroller = new OverScroller(context, sInterpolator); // 实例化OverScroller，动画插值器为sInterpolator
}
private static final Interpolator sInterpolator = new Interpolator() {
    @Override
    public float getInterpolation(float t) {
        t -= 1.0f;
        return t * t * t * t * t + 1.0f;
    }
};
```

### 事件 shouldInterceptTouchEvent、processTouchEvent

ViewDragHelper 实例之后我们接着重写了 ViewGroup 的 onInterceptTouchEvent 和 onTouchEvent 方法，在其中触发了 ViewDragHelper 的 shouldInterceptTouchEvent 和 processTouchEvent 方法。

#### 事件 shouldInterceptTouchEvent、processTouchEvent 执行情况

shouldInterceptTouchEvent 中 down 事件，任何时刻都会走进来；move/up 事件只有在子控件有能力消费事件时才会走<br />processTouchEvent 只有在未找到能消费事件的子 view 时执行，由父控件自己的 onTouchEvent 处理事件

1. 触摸 mParentView，未触摸到子 view

```
D: onInterceptTouchEvent down(0)(action:0,index:0)
I: onTouchEvent down(0)(action:0,index:0)
I: onTouchEvent move(2)(action:10,index:0)
I: onTouchEvent move(2)(action:10,index:0)
I: onTouchEvent up(1)(action:1,index:0)
```

> 可以看到只触摸了父控件，shouldInterceptTouchEvent 会走 down 事件，后续的 move 不会走进来；down 事件及后续的 move/up 事件都是走的父控件的 processTouchEvent

2. 触摸到了子 view，且子 view 消费了事件

```
D: onInterceptTouchEvent down(0)(action:0,index:0)
D: onInterceptTouchEvent move(2)(action:10,index:0)
D: onInterceptTouchEvent move(2)(action:10,index:0)
D: onInterceptTouchEvent move(2)(action:10,index:0)
D: onInterceptTouchEvent move(2)(action:10,index:0)
D: onInterceptTouchEvent up(1)(action:1,index:0)
```

> 触摸到了可消费事件的子 view，down/move/up 都会走 shouldInterceptTouchEvent，processTouchEvent 不会走

3. 触摸到了子 view，且子 view 未消费事件

```java
D: onInterceptTouchEvent down(0)(action:0,index:0)
I: onTouchEvent down(0)(action:0,index:0)
I: onTouchEvent move(2)(action:10,index:0)
I: onTouchEvent move(2)(action:10,index:0)
I: onTouchEvent up(1)(action:1,index:0)
```

> 触摸到了不不未消费事件的子 view，shouldInterceptTouchEvent 会走 down 事件，后续的 move 不会走进来；down 事件及后续的 move/up 事件都是走的父控件的 processTouchEvent

#### shouldInterceptTouchEvent（首次 ACTION_DOWN 事件）

首先我们看下 shouldInterceptTouchEvent 方法：

```java
// ，我们先来看下ACTION_DOWN事件
public boolean shouldInterceptTouchEvent(MotionEvent ev) {
    final int action = ev.getActionMasked();
    final int actionIndex = ev.getActionIndex();
    
    if (action == MotionEvent.ACTION_DOWN) {
        // 每次ACTION_DOWN都会调用cancel()，该方法中mVelocityTracker被清空，故mVelocityTracker记录的是本次ACTION_DOWN到ACTION_UP的触摸信息
        cancel();
    }
    // 获取VelocityTracker实例，记录下各个触摸点信息用来计算本次滑动速率等
    if (mVelocityTracker == null) {
        mVelocityTracker = VelocityTracker.obtain();
    }
    mVelocityTracker.addMovement(ev);

    switch (action) {
        case MotionEvent.ACTION_DOWN: {
        final float x = ev.getX();
        final float y = ev.getY();
        final int pointerId = ev.getPointerId(0);
        // Step 1
        saveInitialMotion(x, y, pointerId);
        // Step 2
        final View toCapture = findTopChildUnder((int) x, (int) y);

        // Step 3
        if (toCapture == mCapturedView && mDragState == STATE_SETTLING) {
            tryCaptureViewForDrag(toCapture, pointerId);
        }
        // Step 4
        final int edgesTouched = mInitialEdgesTouched[pointerId];
        if ((edgesTouched & mTrackingEdges) != 0) {
            mCallback.onEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
        }
        break;
        }
        // 暂时忽略 ......
    }
    // Step 5
    return mDragState == STATE_DRAGGING;
}
```

- Step1 saveInitialMotion(x, y, pointerId) 保存了事件的初始信息

```java
private void saveInitialMotion(float x, float y, int pointerId) {
    ensureMotionHistorySizeForId(pointerId); // mInitialMotionX、mInitialMotionY、mInitialEdgesTouched等的初始化
    mInitialMotionX[pointerId] = mLastMotionX[pointerId] = x;
    mInitialMotionY[pointerId] = mLastMotionY[pointerId] = y;
    // getEdgesTouched就是通过mEdgeSize去判断触摸边沿方向是否OK
    mInitialEdgesTouched[pointerId] = getEdgesTouched((int) x, (int) y);
    mPointersDown |= 1 << pointerId;
}
```

- Step2 通过 findTopChildUnder() 方法来获取当前触摸点下最顶层的子 View

```java
public View findTopChildUnder(int x, int y) {
    final int childCount = mParentView.getChildCount(); // 获取mParentView中子View个数
    for (int i = childCount - 1; i >= 0; i--) { // 倒序遍历整个子View，因为最上面的子View最后插入
        final View child = mParentView.getChildAt(mCallback.getOrderedChildIndex(i)); // 遍历拿到最靠上且获得触摸焦点的那个子View
        if (x >= child.getLeft() && x < child.getRight()
                && y >= child.getTop() && y < child.getBottom()) { // 判断当前DOWN的触摸点是否在该子View范围，也就是说是不是摸上了该子View
            return child;
        }
    }
    return null;
}
```

如果在 mParentView 的同一个位置有多个子 View 是重叠的，此时又想让重叠的 View 中下面指定的那个被选中（默认 for 循环是倒序额）时 getOrderedChildIndex() 方法的默认实现就搞不定了，所以就需要我们自己去实现 Callback 里的 `getOrderedChildIndex()` 方法来改变查找子 View 的顺序

```java
public int getOrderedChildIndex(int index) {
    // 实现重叠View时让下面的View获得选中
    int topIndex = mParentView.indexOfChild(your_top_view);
    int BottomSelectedIndex = mParentView.indexOfChild(blow_your_top_view_selected);
    return ((index == topIndex) ? indexBottom : index);
}
```

- Step3 这里有一个判断，因为第一次触摸屏幕 mCapturedView 默认为 null，所以一开始不会执行这个判断里的代码，同时因为 mDragState 第一次也不处于 `STATE_SETTLING` 状态，所以不执行
- Step4 首先拿了 saveInitialMotion 方法赋值的结果，然后判断设置的边沿方向进行 `Callback#onEdgeTouched()` 方法回调
- Step5 直接 return 了 `mDragState == STATE_DRAGGING;`，因为上面说了，在 `ACTION_DOWN` 时 mDragState 还是 STATE_IDLE 状态，返回 false。这里返回 false 就表示 mParentView 没有拦截这次事件

#### processTouchEvent（首次 ACTION_DOWN，未找到有子类消费事件）

首次 ACTION_DOWN 事件，父控件未找到能消费事件的子 view，那么会调用自身的 onTouchEvent 从而调用 ViewDragHelper 的 processTouchEvent。这时 onTouchEvent() 方法需要返回 true（只用在 ACTION_DOWN 时返回 true，否则 onTouchEvent() 方法无法接收接下来的 ACTION_MOVE 等事件），当 onTouchEvent() 返回 true 以后 ACTION_MOVE、ACTION_UP 等事件再来时就不会再执行 mParentView 的 onInterceptTouchEvent() 了。

```java
public void processTouchEvent(MotionEvent ev) {
    // 签名部分和shouldInterceptTouchEvent相似，省略   
    // ......

    switch (action) {
        case MotionEvent.ACTION_DOWN: {
            // 和shouldInterceptTouchEvent相似
            final float x = ev.getX();
            final float y = ev.getY();
            final int pointerId = MotionEventCompat.getPointerId(ev, 0);
            final View toCapture = findTopChildUnder((int) x, (int) y);
    
            saveInitialMotion(x, y, pointerId);
    
            // Step 1 重点
            // 如果父控件直接处理该事件
            tryCaptureViewForDrag(toCapture, pointerId);
    
            // 和shouldInterceptTouchEvent相似
            final int edgesTouched = mInitialEdgesTouched[pointerId];
            if ((edgesTouched & mTrackingEdges) != 0) {
                mCallback.onEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
            }
            break;
        }
         // 省略其他ACTION ......
    }
}
```

现在看 `tryCaptureViewForDrag`：

```java
boolean tryCaptureViewForDrag(View toCapture, int pointerId) {
    if (toCapture == mCapturedView && mActivePointerId == pointerId) {
        // Already done!
        return true;
    }
    // 调用了Callback的tryCaptureView()方法，传递触摸到的View和触摸点编号，是否可以挪动该View，返回true即找到触摸的子View
    if (toCapture != null && mCallback.tryCaptureView(toCapture, pointerId)) {
        mActivePointerId = pointerId;
        captureChildView(toCapture, pointerId);
        return true;
    }
    return false;
}
```

通过 Callback 的 tryCaptureView() 重写设置是否可以挪动该 View，若可以挪动（返回 true）则又调运了 `captureChildView()` 方法，继续看下 captureChildView() 方法源码

```java
public void captureChildView(@NonNull View childView, int activePointerId) {
 
    // 暂存被捕获的这个View的相关信息及触摸信息
    mCapturedView = childView;
    mActivePointerId = activePointerId;
    // 通过Callback的onViewCaptured()方法回调当前View被捕获了
    mCallback.onViewCaptured(childView, activePointerId);
    // 设置当前被捕获的子View状态为STATE_DRAGGING；里面会通过mCallback.onViewDragStateChanged(state)回调告知状态
    setDragState(STATE_DRAGGING); // 设置为拖拽状态STATE_DRAGGING
}
```

#### processTouchEvent（ACTION_MOVE）

到此 mParentView 自己调用 processTouchEvent 处理消费事件，子 View 无拦截 ACTION_DOWN 的事件处理就彻底结束了。接着就是主流程的 ACTION_MOVE 事件了，这玩意由于 mParentView 的 onTouchEvent 消费了事件且没进行拦截 ACTION_DOWN，所以一旦触发时就直接走进了 processTouchEvent() 方法里。

```java
public void processTouchEvent(MotionEvent ev) {
    // ......
    switch (action) {
        // ......
        case MotionEvent.ACTION_MOVE: {
        //分两种情况，依赖上一个ACTION_DOWN事件
        if (mDragState == STATE_DRAGGING) {
            //ACTION_DOWN时CallBack的tryCaptureView()返回true时对mDragState赋值了STATE_DRAGGING，故此流程
            final int index = MotionEventCompat.findPointerIndex(ev, mActivePointerId);
            final float x = MotionEventCompat.getX(ev, index);
            final float y = MotionEventCompat.getY(ev, index);
            final int idx = (int) (x - mLastMotionX[mActivePointerId]);
            final int idy = (int) (y - mLastMotionY[mActivePointerId]);
            // Step 1 重点
            dragTo(mCapturedView.getLeft() + idx, mCapturedView.getTop() + idy, idx, idy);
            // Step 2 重点
            saveLastMotion(ev);
        } else {
            //ACTION_DOWN时CallBack的tryCaptureView()返回false时对mDragState没进行赋值，故此流程
            // Check to see if any pointer is now over a draggable view.
            final int pointerCount = MotionEventCompat.getPointerCount(ev);
            for (int i = 0; i < pointerCount; i++) {
                final int pointerId = MotionEventCompat.getPointerId(ev, i);
                final float x = MotionEventCompat.getX(ev, i);
                final float y = MotionEventCompat.getY(ev, i);
                final float dx = x - mInitialMotionX[pointerId];
                final float dy = y - mInitialMotionY[pointerId];
                //Step 3 重点！！！！！！
                reportNewEdgeDrags(dx, dy, pointerId);
                if (mDragState == STATE_DRAGGING) {
                    // Callback might have started an edge drag.
                    break;
                }

                final View toCapture = findTopChildUnder((int) x, (int) y);
                //Step 4 重点
                if (checkTouchSlop(toCapture, dx, dy) && // 检查下滑动的距离是否达到touchSlop的要求
                        tryCaptureViewForDrag(toCapture, pointerId)) {
                    break;
                }
            }
            saveLastMotion(ev);
        }
        break;
        }
        //  ......
    }
}
```

可以看见，当 ACTION_MOVE 事件多次触发时该段代码会依据我们重写 CallBack 的代码分为可以托拽当前 View 和不能托拽两种情况。

先来看下不能托拽的情况：

```java
// 在托拽时该方法会被多次调运
private void reportNewEdgeDrags(float dx, float dy, int pointerId) {
    int dragsStarted = 0;
    ......//四个方向，省略三个
    if (checkNewEdgeDrag(dy, dx, pointerId, EDGE_BOTTOM)) {
        dragsStarted |= EDGE_BOTTOM;
    }

    if (dragsStarted != 0) { // 在边缘
        mEdgeDragsInProgress[pointerId] |= dragsStarted;
        // 该方法只会被调运一次，checkNewEdgeDrag方法中有处理
        mCallback.onEdgeDragStarted(dragsStarted, pointerId);
    }
}
```

能拖拽的情况，当我们正常捕获到 View 时 ACTION_MOVE 就不停的调用 dragTo() 对 mCaptureView 进行拖动：

```java
//left、top为mCapturedView.getLeft()+dx、mCapturedView.getTop()+dy，即期望目标坐标
//dx、dy为前后两次ACTION_MOVE移动的距离
private void dragTo(int left, int top, int dx, int dy) {
    int clampedX = left;
    int clampedY = top;
    final int oldLeft = mCapturedView.getLeft();
    final int oldTop = mCapturedView.getTop();
    if (dx != 0) {
        //重写固定横坐标移动到的位置
        clampedX = mCallback.clampViewPositionHorizontal(mCapturedView, left, dx);
        //这是View中定义的方法，实质是改变View的mLeft、mRight、mTop、mBottom达到移动View的效果，类似layout()方法的效果
        //clampedX为新位置，oldLeft为旧位置，若想不动保证插值为0即可！！！！
        mCapturedView.offsetLeftAndRight(clampedX - oldLeft);
    }
    if (dy != 0) {
        //重写固定纵坐标移动到的位置
        clampedY = mCallback.clampViewPositionVertical(mCapturedView, top, dy);
        //这是View中定义的方法，实质是改变View的mLeft、mRight、mTop、mBottom达到移动View的效果，类似layout()方法的效果
        mCapturedView.offsetTopAndBottom(clampedY - oldTop);
    }

    if (dx != 0 || dy != 0) {
        final int clampedDx = clampedX - oldLeft;
        final int clampedDy = clampedY - oldTop;
        //当位置有变化时回调Callback的onViewPositionChanged方法实时通知
        mCallback.onViewPositionChanged(mCapturedView, clampedX, clampedY,
            clampedDx, clampedDy);
    }
}
```

到此可以发现 ACTION_MOVE 时如果可以托拽则会实时挪动 View 的位置，同时回调很多方法。具体移动到哪和范围由 Callback 的 clampViewPositionHorizontal() 和 clampViewPositionVertical() 来决定。到此一次 ACTION_MOVE 事件的触发处理也就分析完毕了。

下面就该是松手时 `ACTION_UP` 或者 `ACTION_MOVE` 被 mParentView 的上级 View 拦截触发的 ACTION_CANCEL 事件了，他们与 ACTION_MOVE 类似，直接触发 processTouchEvent() 的 ACTION_UP 或者 ACTION_CANCEL，

#### processTouchEvent（ACTION_UP/ACTION_CANCEL）

```java
public void processTouchEvent(MotionEvent ev) {
    // ......
    switch (action) {
        // ......
        case MotionEvent.ACTION_UP: {
            if (mDragState == STATE_DRAGGING) {
                releaseViewForPointerUp();
            }
            //重置所有的状态记录
            cancel();
            break;
        }

        case MotionEvent.ACTION_CANCEL: {
            if (mDragState == STATE_DRAGGING) {
                dispatchViewReleased(0, 0);
            }
            //重置所有的状态记录
            cancel();
            break;
        }
    }
}
```

ACTION_UP 和 ACTION_CANCEL 的实质都是重置资源和通知 View 触摸被释放，一个调用了 releaseViewForPointerUp 方法，另一个调运了 dispatchViewReleased 方法而已。

先看看 releaseViewForPointerUp：

```java
private void releaseViewForPointerUp() {
    // 获得相关速率
    mVelocityTracker.computeCurrentVelocity(1000, mMaxVelocity);
    final float xvel = clampMag(
            mVelocityTracker.getXVelocity(mActivePointerId),
            mMinVelocity, mMaxVelocity);
    final float yvel = clampMag(
            mVelocityTracker.getYVelocity(mActivePointerId),
            mMinVelocity, mMaxVelocity);
    // 传入速率
    dispatchViewReleased(xvel, yvel);
}
// ACTION_CANCEL也调用了这个，只是速率都是为0
private void dispatchViewReleased(float xvel, float yvel) {
    mReleaseInProgress = true;
    // 通知外部View被释放了
    mCallback.onViewReleased(mCapturedView, xvel, yvel);
    mReleaseInProgress = false;
    
    // 如果之前是STATE_DRAGGING状态，则复位状态为STATE_IDLE
    if (mDragState == STATE_DRAGGING) {
        // onViewReleased didn't call a method that would have changed this. Go idle.
        setDragState(STATE_IDLE);
    }
}
```

dispatchViewReleased() 方法主要就是通过 CallBack 通知手指松开了，同时将状态置位为 STATE_IDLE。

现在看下 mReleaseInProgress 变量：

mReleaseInProgress 变量与 settleCapturedViewAt() 和 flingCapturedView() 方法有关

默认 mReleaseInProgress 是 false，在 dispatchViewReleased() 中 CallBack 回调 onViewReleased() 方法前把他置位了 true，onViewReleased() 后置位了 false。这就是为啥注释里说唯一可以调用 ViewDragHelper 的 `settleCapturedViewAt(`) 和 `flingCapturedView()` 的地方就是在 Callback 的 onViewReleased() 里，这下你指定就明白了，因为别的地方会抛出异常哇。

先看 settleCapturedViewAt() 方法：

```java
// 限制最终惯性滚动到的终极位置及滚动过去
public boolean settleCapturedViewAt(int finalLeft, int finalTop) {
    //表明只能在CallBack回调onViewReleased()中使用
    if (!mReleaseInProgress) {
        throw new IllegalStateException("Cannot settleCapturedViewAt outside of a call to " +
            "Callback#onViewReleased");
    }

    return forceSettleCapturedViewAt(finalLeft, finalTop,
        (int) VelocityTrackerCompat.getXVelocity(mVelocityTracker, mActivePointerId),
        (int) VelocityTrackerCompat.getYVelocity(mVelocityTracker, mActivePointerId));
}

private boolean forceSettleCapturedViewAt(int finalLeft, int finalTop, int xvel, int yvel) {
    ......
    if (dx == 0 && dy == 0) {
        // Nothing to do. Send callbacks, be done.
        mScroller.abortAnimation();
        setDragState(STATE_IDLE);
        return false;
    }
    //直接用过Scroller滚动到指定位置
    final int duration = computeSettleDuration(mCapturedView, dx, dy, xvel, yvel);
    mScroller.startScroll(startLeft, startTop, dx, dy, duration);
    //滚动时设置状态为STATE_SETTLING
    setDragState(STATE_SETTLING);
    return true;
}
```

再看下 flingCapturedView() 方法：

```java
//不限制终点，由松手时加速度决定惯性滚动过去，fling效果
public void flingCapturedView(int minLeft, int minTop, int maxLeft, int maxTop) {
    if (!mReleaseInProgress) {
        throw new IllegalStateException("Cannot flingCapturedView outside of a call to " +
            "Callback#onViewReleased");
    }
    //直接用过Scroller滚动
    mScroller.fling(mCapturedView.getLeft(), mCapturedView.getTop(),
        (int) VelocityTrackerCompat.getXVelocity(mVelocityTracker, mActivePointerId),
        (int) VelocityTrackerCompat.getYVelocity(mVelocityTracker, mActivePointerId),
        minLeft, maxLeft, minTop, maxTop);
    //滚动时设置状态为STATE_SETTLING
    setDragState(STATE_SETTLING);
}
```

### ViewDragHelper 源码注释

```java
//常用核心API归纳总结
public class ViewDragHelper {
    //当前View处于空闲状态，静止
    public static final int STATE_IDLE = 0;
    //当前View处于托动状态中
    public static final int STATE_DRAGGING = 1;
    //当前View处于滚动惯性到settling坐标间的状态
    public static final int STATE_SETTLING = 2;
    //可托拽边缘方向常量
    public static final int EDGE_LEFT = 1 << 0;
    public static final int EDGE_RIGHT = 1 << 1;
    public static final int EDGE_TOP = 1 << 2;
    public static final int EDGE_BOTTOM = 1 << 3;
    public static final int EDGE_ALL = EDGE_LEFT | EDGE_TOP | EDGE_RIGHT | EDGE_BOTTOM;

    ...

    //公有静态内部抽象回调类，当ViewDragHelper控制的ViewGroup中View变化时会被回调
    public static abstract class Callback {
        //当托拽状态变化时回调，譬如动画结束后回调为STATE_IDLE等
        //state有三种状态，均以STATE_XXXX模式
        public void onViewDragStateChanged(int state) {}
        //当前被触摸的View位置变化时回调
        //changedView为位置变化的View，left/top变化时新的x左/y顶坐标，dx/dy为从旧到新的偏移量
        public void onViewPositionChanged(View changedView, int left, int top, int dx, int dy) {}
        //tryCaptureViewForDrag()成功捕获到子View时或者手动调用captureChildView()时回调
        public void onViewCaptured(View capturedChild, int activePointerId) {}
        //当子View被松手或者ACTION_CANCEL时时回调，xvel/yvel为离开屏幕时各方向每秒运动的速率，为px
        public void onViewReleased(View releasedChild, float xvel, float yvel) {}
        //当触摸ACTION_DOWN或ACTION_POINTER_DOWN边沿时回调
        public void onEdgeTouched(int edgeFlags, int pointerId) {}
        //返回true锁定edgeFlags对应的边缘，锁定后的边缘就不会回调onEdgeDragStarted()
        public boolean onEdgeLock(int edgeFlags) {
            return false;
        }
        //ACTION_MOVE且没有锁定边缘时触发
        //可在此手动调用captureChildView()触发从边缘拖动子View，有点类似略过tryCaptureView返回false响应重定向其他View的效果
        public void onEdgeDragStarted(int edgeFlags, int pointerId) {}
        //寻找当前触摸点View时回调此方法
        //如果需要改变子View的倒序遍历查询顺序则可改写此方法，譬如让重叠的下层View先于上层View被捕获
        public int getOrderedChildIndex(int index) {
            return index;
        }
        //返回给定子View在相应方向上可以被拖动的最远距离，默认为0，一般是可被挪动View时指定为指定View的大小等
        public int getViewHorizontalDragRange(View child) {
            return 0;
        }
        public int getViewVerticalDragRange(View child) {
            return 0;
        }
        //传递当前触摸上的子View，如果需要当前触摸的子View进行拖拽移动就返回true，否则返回false
        public abstract boolean tryCaptureView(View child, int pointerId);
        //决定要拖拽的子View在所属方向上应该移动到的位置
        //child为拖拽的子View，left为期望值，dx为挪动差值
        public int clampViewPositionHorizontal(View child, int left, int dx) {
            return 0;
        }
        public int clampViewPositionVertical(View child, int top, int dy) {
            return 0;
        }
    }

    ...

    //构造工厂方法，sensitivity用来调节mTouchSlop的值，默认一般传递1即可
    //sensitivity越大，mTouchSlop越小，对滑动的检测就越敏感，譬如手指move多少才算滑动，否则忽略
    public static ViewDragHelper create(ViewGroup forParent, float sensitivity, Callback cb) {...}
    //设置允许父View的某个边缘可以用来响应托拽
    //相当于控制了CallBack对象的onEdgeTouched()和onEdgeDragStarted()方法是否被回调
    public void setEdgeTrackingEnabled(int edgeFlags) {...}
    //两个传递MotionEvent的方法
    public boolean shouldInterceptTouchEvent(MotionEvent ev) {...}
    public void processTouchEvent(MotionEvent ev) {...}
    //主动在父View内捕获指定的子view用于拖曳，会回调tryCaptureView()
    public void captureChildView(View childView, int activePointerId) {...}
    //指定某个View自动滚动到指定的位置，初速度为0，可在任何地方调用
    //如果这个方法返回true，那么在接下来动画移动的每一帧中都会回调continueSettling(boolean)方法，直到结束
    public boolean smoothSlideViewTo(View child, int finalLeft, int finalTop) {...}
    //以松手前的滑动速度为初值，让捕获到的子View自动滚动到指定位置，只能在Callback的onViewReleased()中使用
    //如果这个方法返回true，那么在接下来动画移动的每一帧中都会回调continueSettling(boolean)方法，直到结束
    public boolean settleCapturedViewAt(int finalLeft, int finalTop) {...}
    //以松手前的滑动速度为初值，让捕获到的子View在指定范围内fling惯性运动，只能在Callback的onViewReleased()中使用
    //如果这个方法返回true，那么在接下来动画移动的每一帧中都会回调continueSettling(boolean)方法，直到结束
    public void flingCapturedView(int minLeft, int minTop, int maxLeft, int maxTop) {...}
    /**
     * 在整个settle状态中,这个方法会返回true，deferCallbacks决定滑动是否Runnable推迟，一般推迟
     * 在调用settleCapturedViewAt()、flingCapturedView()和smoothSlideViewTo()时，
     * 需要实现mParentView的computeScroll()方法，如下：
     * @Override
     * public void computeScroll() {
     *     if (mDragHelper.continueSettling(true)) {
     *         ViewCompat.postInvalidateOnAnimation(this);
     *     }
     * }
     */
    public boolean continueSettling(boolean deferCallbacks) {...}

    ...

    //设置与获取最小速率，一般保持默认
    public void setMinVelocity(float minVel) {...}
    public float getMinVelocity() {...}
    //获取当前子View所处状态
    public int getViewDragState() {...}
    //返回可触摸反馈区域边缘大小，单位为px
    public int getEdgeSize() {...}
    //返回当前捕获的子View，如果没有则为null
    public View getCapturedView() {...}
    //获取当前拖曳的View的Pointer ID
    public int getActivePointerId() {...}
    //获取最小触发拖曳动作的灵敏度差值，单位为px
    public int getTouchSlop() {...}
    //类似ACTION_CANCEL事件的触发调运
    public void cancel() {...}
    //终止手势，结束动画滚动等，恢复初始STATE_IDLE状态
    public void abort() {...}
    ...
}
```

## ViewDragHelper 应用场景

### 微信语音通话方形的悬浮框靠边停留

```kotlin
class WechatVoiceDragLayout @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {
    private val mViewDragCallback by lazy {
        object : ViewDragHelper.Callback() {
            override fun tryCaptureView(child: View, pointerId: Int): Boolean {
                return true
            }

            override fun clampViewPositionHorizontal(child: View, left: Int, dx: Int): Int {
                var newX = left
                if (left < paddingStart) {
                    newX = paddingStart
                } else if (left > width - paddingEnd - child.width) {
                    newX = width - paddingEnd - child.width
                }
//                final int leftBound = getPaddingLeft();
//                final int rightBound = getWidth() - mDragView.getWidth() - leftBound;
//                final int newLeft = Math.min(Math.max(left, leftBound), rightBound);
                return newX
            }

            override fun clampViewPositionVertical(child: View, top: Int, dy: Int): Int {
                var newY = top
                if (newY < paddingTop) {
                    newY = paddingTop
                } else if (newY > height - paddingBottom - child.height) {
                    newY = height - paddingBottom - child.height
                }
                return newY
            }

            // 手指释放的时候回调
            override fun onViewReleased(releasedChild: View, xvel: Float, yvel: Float) {
                releasedChild=${releasedChild.tag}，xvel=$xvel，yvel=${yvel}")
                val childMiddle = releasedChild.left + releasedChild.width / 2
                val top = releasedChild.top
                if (childMiddle < right / 2) { // 对齐到左边
                    mViewDragHelper.settleCapturedViewAt(paddingLeft, top)
                } else { // 对齐到右边
                    mViewDragHelper.settleCapturedViewAt(width - paddingRight - releasedChild.width, top)
                }
                invalidate()
            }
        }
    }

    private val mViewDragHelper: ViewDragHelper = ViewDragHelper.create(this, mViewDragCallback)

    override fun computeScroll() {
        if (mViewDragHelper.continueSettling(true)) {
            invalidate()
        }
    }

    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        return mViewDragHelper.shouldInterceptTouchEvent(ev!!)
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        mViewDragHelper.processTouchEvent(event!!)
        return true
    }
}
```

### 打造仿陌陌视频播放页（深入篇）

<https://blog.csdn.net/qq_22393017/article/details/78472492>

## ViewDragHelper Ref

- [x] Android ViewDragHelper 完全解析 自定义 ViewGroup 神器<br /><https://blog.csdn.net/lmj623565791/article/details/46858663>
- [ ] Android 应用 ViewDragHelper 详解及部分源码浅析<br /><https://yanbober.blog.csdn.net/article/details/50419059>
- [ ] <https://github.com/xiaosong520/ViewDragHelperDemo>

# Android- 防止用户快速点击和多点触控、重复点击

## 防止快速多次点击（防抖动，防重复点击）

### 自定义 View.OnClickListener（旧项目友好）

### RxBinding+throttleFirst

缺点：比如使用两个手指同时点击两个不同的按钮，按钮的功能都是新开页面，那么有可能会新开两个页面。因为 Rxjava 这种方式是针对单个控件实现防止重复点击，不是多个控件。

### View 添加 tag

### View 添加 tag（添加到 DecorView，点击多个 view，指定时间内只有一个 View 响应点击事件）

在时间范围内只响应一次点击，通过将上次单击时间保存到 Activity Window 中的 decorView 里，实现一个 Activity 中所有的 View 共用一个上次单击时间

![](undefined)

- 参数 isShareSingleClick 的默认值为 true，表示该控件和同一个 Activity 中其他控件共用一个上次单击时间，也可以手动改成 false，表示该控件自己独享一个上次单击时间

### View.isEnable 封装

### Flow throttleFirst

### ClickUtils.applySingleDebouncing

### aspect hook

<https://github.com/liys666666/DoubleClick>

---

### 代码

```kotlin
@file:JvmName("DebouncingClick")

// 默认过滤重复点击时间时长
const val DEBOUNCING_CLICK_DURATION: Long = 1000

// <editor-fold defaultstate="collapsed"desc="过滤重复点击 RxJava3">

///**
// * 过滤view重复点击，默认1000ms
// *  @param skipDuration Long 延迟时间，默认1000毫秒
// */
//@JvmOverloads
//fun <T : View> T.clickDebouncingObservable(skipDuration: Long = DEBOUNCING_CLICK_DURATION): Observable<Any> {
//    return RxView.clicks(this)
//        .compose(debouncingClicksTransformer(skipDuration))
//}

/**
 * 过滤重复点击事件：默认1s
 *
 * @param <T> T
 * @return ObservableTransformer
</T> */
private fun <T> debouncingClicksTransformer(skipDuration: Long = DEBOUNCING_CLICK_DURATION): ObservableTransformer<T, T> {
    return ObservableTransformer { upstream ->
        upstream.throttleFirst(
            skipDuration,
            TimeUnit.MILLISECONDS
        )
    }
}
// </editor-fold>


// <editor-fold defaultstate="collapsed"desc="过滤重复点击 扩展View属性 tag">
private const val TRIGGER_DELAY_TAG = -1000
private const val TRIGGER_LAST_TIME_TAG = -1001

/**
 * 点击透明
 * @param block: (T) -> Unit 函数
 * @return Unit
 */
@Suppress("UNCHECKED_CAST")
inline fun <T : View> T?.clickAlpha(
    pressedAlpha: Float = -1F,
    crossinline block: (T) -> Unit
) {
    this?.setOnClickListener {
        if (pressedAlpha != -1F) {
            ClickUtils.applyPressedViewAlpha(this, pressedAlpha)
        }
        block(it as T)
    }
}

/**
 * 过滤重复点击事件
 * @param skipDuration Long 延迟时间，默认1000毫秒
 * @pressedAlpha Float 点击后按钮背景透明度变化
 * @param block: (T) -> Unit 函数
 * @return Unit
 */
@Suppress("UNCHECKED_CAST")
@JvmOverloads
inline fun <T : View> T.clickDebouncingTag(
    skipDuration: Long = DEBOUNCING_CLICK_DURATION,
//    pressedAlpha: Float = -1F,
    crossinline block: (T) -> Unit
) {
//    if (pressedAlpha != -1F) {
//        ClickUtils.applyPressedViewAlpha(this, 0.6f)
//    }
    triggerDelay = skipDuration
    setOnClickListener {
        var flag = false
        val currentClickTime = SystemClock.elapsedRealtime()
        if (currentClickTime - triggerLastTime >= triggerDelay) {
            flag = true
            triggerLastTime = currentClickTime
        }
        if (flag) {
            block(it as T)
        }
    }
}

var <T : View> T.triggerLastTime: Long
    get() = (getTag(TRIGGER_LAST_TIME_TAG) as? Long) ?: 0L
    set(value) {
        setTag(TRIGGER_LAST_TIME_TAG, value)
    }

var <T : View> T.triggerDelay: Long
    get() = (getTag(TRIGGER_DELAY_TAG) as? Long) ?: 0L
    set(value) {
        setTag(TRIGGER_DELAY_TAG, value)
    }

// </editor-fold>


// <editor-fold defaultstate="collapsed"desc="过滤重复点击 占用isEnable属性">
/**
 * 过滤重复点击 ，占用了isEnable属性
 * @param skipDuration  延迟时间，默认1000毫秒
 */
@JvmOverloads
inline fun <T : View> T?.clickDebouncingEnable(
    skipDuration: Long = DEBOUNCING_CLICK_DURATION,
    crossinline action: () -> Unit
) {
    this?.setOnClickListener {
        isEnabled = false
        action()
        postDelayed({ isEnabled = true }, skipDuration)
    }
}
// </editor-fold>


// <editor-fold defaultstate="collapsed"desc="过滤重复点击 自定义OnViewDebounceClickListener，对旧项目友好">
abstract class OnViewDebouncingClickListener : View.OnClickListener {
    companion object {
        private const val MIN_CLICK_DELAY_TIME = 1000
    }

    private var lastClickTime: Long = 0
    override fun onClick(view: View?) {
        if (view == null) return
        val currentTime = SystemClock.elapsedRealtime()
        if (currentTime - lastClickTime > MIN_CLICK_DELAY_TIME) {
            lastClickTime = currentTime
            onDebounceClick(view)
        }
    }

    abstract fun onDebounceClick(view: View)
}

/**
 * 兼容如Activity实现OnClickListener接口写法，用这种写法改动较小，把setOnClickListener替换成clickDebouncing即可
 */
fun <T : View> T?.clickDebouncing(listener: View.OnClickListener) {
    this?.setOnClickListener(object : OnViewDebouncingClickListener() {
        override fun onDebounceClick(view: View) {
            listener.onClick(view)
        }
    })
}

// </editor-fold>

// <editor-fold defaultstate="collapsed"desc="过滤重复点击 Flow">
private fun <T> Flow<T>.throttleFirst(thresholdMillis: Long): Flow<T> = flow {
    var lastTime = 0L // 上次发射数据的时间
    // 收集数据
    collect { upstream ->
        // 当前时间
        val currentTime = System.currentTimeMillis()
        // 时间差超过阈值则发送数据并记录时间
        if (currentTime - lastTime > thresholdMillis) {
            lastTime = currentTime
            emit(upstream)
        }
    }
}

private fun <T : View> T.clickFlow() = callbackFlow {
    setOnClickListener { this.trySend(Unit).isSuccess }
    awaitClose {
        setOnClickListener(null)
    }
}

fun <T : View> T.clickDebouncingFlow(block: (View) -> Unit) = clickFlow()
    .throttleFirst(300)
    .onEach { block.invoke(this) }

// </editor-fold>


// <editor-fold defaultstate="collapsed"desc="过滤重复点击 ClickUtils.applySingleDebouncing，对旧项目友好">

// </editor-fold>
```

示例代码：

```java
public class 过滤重复点击事件 extends BaseActivity implements View.OnClickListener {

    TextView tvStatus;

    @Override
    public int getLayoutResId() {
        return R.layout.activity_filter_multi_click_event;
    }

    @SuppressLint("CheckResult")
    @Override
    public void initViews(@Nullable Bundle savedInstanceState) {

        tvStatus = findViewById(R.id.tv_status);

        findViewById(R.id.btn_click).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DebugLogKt.print("未过滤重复点击");
                tvStatus.append(DebugLogKt.log("未过滤重复点击"));
            }
        });

        View viewRxjava = findViewById(R.id.btn_click_rxjava);
        DebouncingClick.clickDebouncingObservable(viewRxjava)
                .subscribe(o -> {
                    DebugLogKt.print("过滤重复点击RxJava版本");
                    tvStatus.append(DebugLogKt.log("过滤重复点击RxJava版本"));
                });

        View viewTag = findViewById(R.id.btn_click_tag);
        DebouncingClick.clickDebouncingTag(viewTag, view -> {
            DebugLogKt.print("过滤重复点击tag版本");
            tvStatus.append(DebugLogKt.log("过滤重复点击tag版本"));
            return null;
        });


        View viewIsEnable = findViewById(R.id.btn_click_isenable);
        DebouncingClick.clickDebouncingEnable(viewIsEnable, () -> {
            DebugLogKt.print("过滤重复点击isEnable版本");
            tvStatus.append(DebugLogKt.log("过滤重复点击isEnable版本"));
            return null;
        });

        View viewDebounce = findViewById(R.id.btn_click_debounce_listener);
        viewDebounce.setOnClickListener(new OnViewDebouncingClickListener() {
            @Override
            public void onDebounceClick(@NonNull View view) {
                DebugLogKt.print("过滤重复点击OnViewDebounceClickListener");
                tvStatus.append(DebugLogKt.log("过滤重复点击OnViewDebounceClickListener"));
            }
        });

        View viewDebounce2 = findViewById(R.id.btn_click_debounce_listener2);
//        DebouncingClick.clickDebouncing(viewDebounce2, new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                DebugLogKt.print("过滤重复点击clickDebouncing");
//                tvStatus.append(DebugLogKt.log("过滤重复点击clickDebouncing"));
//            }
//        });
        DebouncingClick.clickDebouncing(viewDebounce2, this);

        View viewClickUtils = findViewById(R.id.btn_click_utils);
        ClickUtils.applySingleDebouncing(viewClickUtils, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DebugLogKt.print("过滤重复点击ClickUtils.applySingleDebouncing");
                tvStatus.append(DebugLogKt.log("过滤重复点击ClickUtils.applySingleDebouncing"));
            }
        });
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_click_debounce_listener2:
                DebugLogKt.print("过滤重复点击clickDebouncing");
                tvStatus.append(DebugLogKt.log("过滤重复点击clickDebouncing"));
                break;
        }
    }
}
```

## 防止多点触控

在默认情况下，Android 是支持多点触控的

在多个 Button 的父布局添加：

```xml
android:splitMotionEvents="false" //不支持多点触控事件
```

或者：

```xml
<style name="MyStyle">
    <item name="android:windowEnableSplitTouch">false</item>
    <item name="android:splitMotionEvents>false</item>
</style>
```
