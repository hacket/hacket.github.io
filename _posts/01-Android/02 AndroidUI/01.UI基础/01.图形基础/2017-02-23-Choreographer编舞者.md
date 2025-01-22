---
date_created: Thursday, February 29th 2017, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:09:29 pm
title: Choreographer编舞者
author: hacket
categories:
  - AndroidUI
category: UI基础
tags: [UI基础]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date created: Saturday, June 1st 2024, 12:24:00 pm
date updated: Wednesday, January 8th 2025, 12:07:54 am
image-auto-upload: true
feed: show
format: list
aliases: [Choreographer 编舞者]
linter-yaml-title-alias: Choreographer 编舞者
---

# Choreographer 编舞者

## Choreographer 小结

- 使用 Choreographer 必须是在 Looper 线程
- Choreographer 是线程唯一的实例，保存在 ThreadLocal
- Choreographer 通过 postCallbackXXX 提交任务，postCallback 提交 Runnable，postFrameCallback 提交 FrameCallback
- Choreographer 定义了 5 种类型的任务（Input/ANIMATION/INSETS_ANIMATION/TRAVERSAL/COMMIT ），按顺序执行
- Choreographer 中所有的 Handler 消息都是异步消息，不受同步屏障影响
- Choreographer 整套流程

```java
Choreographer#postCallbackXXX →
Choreographer#postCallbackDelayedInternal(callbackType,action,token,delayMillis)（mCallbackQueues根据callbackType生成队列，最多5个类型） →
Choreographer#scheduleFrameLocked(long now) →
Choreographer#scheduleVsyncLocked() →
FrameDisplayEventReceiver#scheduleVsync() → 
DisplayEventReceiver#scheduleVsync() →
DisplayEventReceiver#nativeScheduleVsync()（通过native方法请求vsync） →
DisplayEventReceiver#dispatchVsync()（native回调） →
DisplayEventReceiver#onVsync(long timestampNanos, long physicalDisplayId, int frame) →
FrameDisplayEventReceiver#onVsync(long timestampNanos, long physicalDisplayId, int frame) →
FrameDisplayEventReceiver#run()（FrameHandler send异步msg） →
Choreographer#doFrame(long frameTimeNanos, int frame) →
Choreographer#doCallbacks(int callbackType, long frameTimeNanos) →
CallbackRecord#run() →
Runnable#run/FrameCallback#doFrame()
```

## Choreographer

### 什么地方用到了 Choreographer

#### UI 变更（最终都调用 ViewRootImpl#scheduleTraversals()）

所有 UI 的变化都是走到 `ViewRootImpl#scheduleTraversals()` 方法

##### Activity#makeVisible  Activity 页面可交互

```java
ActivityThread#handleResumeActivity → 
Activity#onResume →
Activity#makeVisible → 
WindowManager#addView →
WindowManagerImpl#addView →
WindowManagerGlobal#addView(创建ViewRootImpl) →
ViewRootImpl#setView →
ViewRootImpl#requestLayout → 
ViewRootImpl#checkThread()/scheduleTraversals()（mLayoutRequested = true）→
Choreographer#postCallback(Choreographer.CALLBACK_TRAVERSAL)
```

##### View#requestLayout  重新布局

```java
View#requestLayout → 
ViewRootImpl#requestLayout → 
ViewRootImpl#checkThread()/scheduleTraversals()（mLayoutRequested = true）→
ViewRootImpl#checkThread()/scheduleTraversals()（mLayoutRequested = true）→
```

##### View#invalidate 重绘

1. 硬件加速

```java
View#invalidate(true) →
View#invalidateInternal() → 
ViewGroup#invalidateChild() →
ViewGroup#onDescendantInvalidated() → 
ViewRootImpl#onDescendantInvalidated()（没有调用checkThread()） → 
ViewRootImpl#invalidate() → 
View#scheduleTraversals()
```

2. 软件绘制

```java
View#invalidate(true) →
View#invalidateInternal() → 
ViewGroup#invalidateChild() →
ViewGroup#invalidateChildInParent() → 
ViewRootImpl#invalidateChildInParent() → 
ViewRootImpl#checkThread()/invalidateRectOnScreen() → 
ViewRootImpl#scheduleTraversals()
```

##### ViewRootImpl#scheduleTraversals()

看看 scheduleTraversals()

```java
// ViewRootImpl.java Android29
void scheduleTraversals() {
    if (!mTraversalScheduled) {
    	// 此字段保证同时间多次更改只会刷新一次，例如TextView连续两次setText(),也只会走一次绘制流程
        mTraversalScheduled = true;
        // 添加同步屏障，屏蔽同步消息，保证VSync到来立即执行绘制
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        // mTraversalRunnable是TraversalRunnable实例，最终走到run()，也即doTraversal();
        mChoreographer.postCallback(
                Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        if (!mUnbufferedInputDispatch) {
            scheduleConsumeBatchedInput();
        }
        notifyRendererOfFramePending();
        pokeDrawLockIfNeeded();
    }
}
final class TraversalRunnable implements Runnable {
    @Override
    public void run() {
        doTraversal();
    }
}
final TraversalRunnable mTraversalRunnable = new TraversalRunnable();

void doTraversal() {
    if (mTraversalScheduled) {
        mTraversalScheduled = false;
        // 移除同步屏障
        mHandler.getLooper().getQueue().removeSyncBarrier(mTraversalBarrier);
        // ...
        performTraversals();
        // ...
    }
}
```

1. 首先使用 mTraversalScheduled 字段保证同时间多次更改只会刷新一次，例如 TextView 连续两次 setText()，也只会走一次绘制流程。
2. 把当前线程的消息队列 Queue 添加了同步屏障，这样就屏蔽了正常的同步消息（异步消息不会屏蔽，编舞者里都是异步消息），保证 VSync 到来后立即执行绘制，而不是要等前面的同步消息。
3. 调用了 mChoreographer.postCallback() 方法，发送一个会在下一帧执行的回调，即在下一个 VSync 到来时会执行 TraversalRunnable-->doTraversal()--->performTraversals()-->绘制流程。

##### ViewRootImpl#performTraversals()

```java
// ViewRootImpl Android29
void performTraversals() {
    performMeasure();
    performLayout();
    performDraw();
}
```

#### ValueAnimator#start 动画

```java
ValueAnimator#start() →
ValueAnimator#addAnimationCallback() → 
AnimationHandler#addAnimationFrameCallback(AnimationFrameCallback) → 
AnimationFrameCallbackProvider#postFrameCallback(Choreographer.FrameCallback) →
Choreographer→postFrameCallback(Choreographer.FrameCallback) →
Choreographer.FrameCallback#doFrame(frameTimeNanos) →
AnimationHandler#doAnimationFrame(frameTime) → 
AnimationFrameCallback#doAnimationFrame(frameTime) → 
ValueAnimator#doAnimationFrame() → 
ValueAnimator#animateValue() → 
AnimatorUpdateListener#onAnimationUpdate(ValueAnimator)
```

### Choreographer 是什么？

Google 在 Android 4.1 提出的 `Project Butter` 黄油计划对 Android Display 系统进行了优化：在收到 VSync pulse 后，将马上开始下一帧的渲染。即 `一旦收到VSync通知，CPU和GPU就立刻开始计算然后把数据写入buffer。`

文档说，Choreographer 是协调动画时间脉冲 (timing pulse，例如 vsync)，输入事件和绘制。

```
Coordinates the timing of animations, input and drawing.
public class Choreographer{
}
```

#### Choreographer 创建

Choreographer，线程单例，每个 Looper 线程都能持有一个 Choreographer

```java
private static final ThreadLocal<Choreographer> sThreadInstance =
        new ThreadLocal<Choreographer>() {
    @Override
    protected Choreographer initialValue() {
        Looper looper = Looper.myLooper();
        if (looper == null) {
            throw new IllegalStateException("The current thread must have a looper!");
        }
        Choreographer choreographer = new Choreographer(looper, VSYNC_SOURCE_APP);
        if (looper == Looper.getMainLooper()) {
            mMainInstance = choreographer;
        }
        return choreographer;
    }
};
```

Choreographer 和 Looper 一样是线程单例的。且当前线程要有 looper，Choreographer 实例需要传入。接着看看 Choreographer 构造方法：

```java
private Choreographer(Looper looper, int vsyncSource) {
    mLooper = looper;
    // 使用当前线程looper创建 mHandler
    mHandler = new FrameHandler(looper);
    // USE_VSYNC 4.1以上默认是true，表示 具备接受VSync的能力，这个接受能力就是FrameDisplayEventReceiver
    mDisplayEventReceiver = USE_VSYNC ? new FrameDisplayEventReceiver(looper, vsyncSource) : null;
    mLastFrameTimeNanos = Long.MIN_VALUE;

	// 计算一帧的时间，Android手机屏幕是60Hz的刷新频率，就是16ms
    mFrameIntervalNanos = (long)(1000000000 / getRefreshRate());

	// 创建一个链表类型CallbackQueue的数组，大小为5，
	//也就是数组中有五个链表，每个链表存相同类型的任务：输入、动画、遍历绘制等任务（CALLBACK_INPUT、CALLBACK_ANIMATION、CALLBACK_TRAVERSAL）
    mCallbackQueues = new CallbackQueue[CALLBACK_LAST + 1];
    for (int i = 0; i <= CALLBACK_LAST; i++) {
        mCallbackQueues[i] = new CallbackQueue();
    }
    // b/68769804: For low FPS experiments.
    setFPSDivisor(SystemProperties.getInt(ThreadedRenderer.DEBUG_FPS_DIVISOR, 1));
}
```

创建了一个 mHandler、VSync 事件接收器 mDisplayEventReceiver、任务链表数组 mCallbackQueues。FrameHandler、FrameDisplayEventReceiver、CallbackQueue。

1. 在 ViewRootImpl 的构造方法内使用 Choreographer.getInstance() 创建

```java
// ViewRootImpl Android29
Choreographer mChoreographer;
// ViewRootImpl实例是在添加window时创建
public ViewRootImpl(Context context, Display display) {
	// ...
	mChoreographer = Choreographer.getInstance();
	// ...
}
```

2. AnimationHandler，所有属性动画共用

```java
// ViewRootImpl Android29
public class AnimationHandler {
    private class MyFrameCallbackProvider implements AnimationFrameCallbackProvider {
         final Choreographer mChoreographer = Choreographer.getInstance();
    }
}
```

3. callbackType

```java
// 输入事件，首先执行
public static final int CALLBACK_INPUT = 0;
// 动画，第二执行
public static final int CALLBACK_ANIMATION = 1;
// 插入更新的动画，第三执行
public static final int CALLBACK_INSETS_ANIMATION = 2;
// 绘制，第四执行
public static final int CALLBACK_TRAVERSAL = 3;
// 提交，最后执行，
public static final int CALLBACK_COMMIT = 4;
```

每当收到 VSYNC 信号时，Choreographer 将首先处理 `INPUT` 类型的任务、然后是 `ANIMATION/CALLBACK_INSETS_ANIMATION` 类型的任务、然后 `TRAVERSAL` 类型的任务、最后 `COMMIT` 类型的任务。

#### Choreographer#FrameHandler

```java
private static final int MSG_DO_FRAME = 0; // 不支持USE_VSYNC的用这个默认延迟10ms发送消息
private static final int MSG_DO_SCHEDULE_VSYNC = 1; //  不是同一个Looper线程时，postCallback提交的Runnable用到，将这个callback在Choreographer的Looper线程运行
private static final int MSG_DO_SCHEDULE_CALLBACK = 2; // postCallbackXXX()，延迟callback用到
private final class FrameHandler extends Handler {
    public FrameHandler(Looper looper) {
        super(looper);
    }
    @Override
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case MSG_DO_FRAME:
            	// 执行doFrame,即绘制过程
                doFrame(System.nanoTime(), 0);
                break;
            case MSG_DO_SCHEDULE_VSYNC:
            	// 申请VSYNC信号，例如当前需要绘制任务时
                doScheduleVsync();
                break;
            case MSG_DO_SCHEDULE_CALLBACK:
            	// 需要延迟的任务，最终还是执行上述两个事件
                doScheduleCallback(msg.arg1);
                break;
        }
    }
}
```

FrameHandler 有 3 个作用，都是发的异步消息

1. 有延迟的任务发延迟消息，对应 MSG_DO_SCHEDULE_CALLBACK
2. 不在原线程的发到原线程，对应 MSG_DO_SCHEDULE_VSYNC
3. 没开启 VSYNC 的直接走 doFrame 方法取执行绘制，对应 MSG_DO_FRAME

#### Choreographer#postCallbackXXX 提交任务

Choreographer 创建了，现在看提交任务 postCallbackXXX

##### postCallback/postCallbackDelayed  提交 Runnable

```java
// Choreographer Android29
public void postCallback(int callbackType, Runnable action, Object token) {
    postCallbackDelayed(callbackType, action, token, 0);
}
public void postCallbackDelayed(int callbackType,
        Runnable action, Object token, long delayMillis) {
    // ...
    postCallbackDelayedInternal(callbackType, action, token, delayMillis);
}
```

##### postFrameCallback/postFrameCallbackDelayed  提交 FrameCallback

```java
// Choreographer Android29
public void postFrameCallback(FrameCallback callback) {
    postFrameCallbackDelayed(callback, 0);
}
public void postFrameCallbackDelayed(FrameCallback callback, long delayMillis) {
    if (callback == null) {
        throw new IllegalArgumentException("callback must not be null");
    }
    postCallbackDelayedInternal(CALLBACK_ANIMATION,
            callback, FRAME_CALLBACK_TOKEN, delayMillis);
}
```

##### postCallbackDelayedInternal

postCallback/postCallbackDelayed 和 postFrameCallback/postFrameCallbackDelayed 最后都是走的 postCallbackDelayedInternal：

```java
// Choreographer Android29
private void postCallbackDelayedInternal(int callbackType,
        Object action, Object token, long delayMillis) {
    // ...
    synchronized (mLock) {
        // 当前CPU时间
        final long now = SystemClock.uptimeMillis();
        final long dueTime = now + delayMillis;
        // 取对应类型的CallbackQueue添加任务
        mCallbackQueues[callbackType].addCallbackLocked(dueTime, action, token);

        if (dueTime <= now) { // 没有延迟，立即执行
            scheduleFrameLocked(now);
        } else {
            // 延迟运行，最终也会走到scheduleFrameLocked()
            Message msg = mHandler.obtainMessage(MSG_DO_SCHEDULE_CALLBACK, action);
            msg.arg1 = callbackType;
            msg.setAsynchronous(true); // 消息设置成异步
            mHandler.sendMessageAtTime(msg, dueTime); // 最终也是走的scheduleFrameLocked
        } 
    }
}
```

首先取对应类型的 CallbackQueue 添加任务，action 就是 mTraversalRunnable，token 是 null。CallbackQueue 的 addCallbackLocked() 就是把 dueTime、action、token 组装成 CallbackRecord 后 存入 CallbackQueue 的下一个节点

不管是有没有延迟，最会走 `scheduleFrameLocked`：

```java
// ViewRootImpl Android29
private void scheduleFrameLocked(long now) {
    if (!mFrameScheduled) {
        mFrameScheduled = true;
        if (USE_VSYNC) { // 开启了VSYNC
            // ...
            if (isRunningOnLooperThreadLocked()) { // 当前执行的线程，是否是mLooper所在线程
                scheduleVsyncLocked(); // 申请 VSYNC 信号
            } else {
                // 若不在，就用mHandler发送消息到原线程，最后还是调用scheduleVsyncLocked方法
                Message msg = mHandler.obtainMessage(MSG_DO_SCHEDULE_VSYNC);
                msg.setAsynchronous(true); // 异步消息
                mHandler.sendMessageAtFrontOfQueue(msg); // 插入到MessageQueue队头
            }
        } else {
             // 如果未开启VSYNC则直接doFrame方法（4.1后默认开启）
            final long nextFrameTime = Math.max(mLastFrameTimeNanos / TimeUtils.NANOS_PER_MS + sFrameDelay, now);
            // ...
            Message msg = mHandler.obtainMessage(MSG_DO_FRAME);
            msg.setAsynchronous(true); // 异步消息
            mHandler.sendMessageAtTime(msg, nextFrameTime);
        }
    }
}
```

1. 如果系统未开启 VSYNC 机制，此时直接发送 `MSG_DO_FRAME` 消息到 FrameHandler，最终走到 doFrame
2. Android 4.1 之后系统默认开启 VSYNC，在 Choreographer 的构造方法会创建一个 FrameDisplayEventReceiver，scheduleVsyncLocked 方法将会通过它申请 VSYNC 信号，最终走到 doFrame
3. isRunningOnLooperThreadLocked 方法，其内部根据 Looper 判断是否在原线程，否则发送消息到 FrameHandler。最终还是会调用 scheduleVsyncLocked 方法申请 VSYNC 信号。

> 1. Android4.1 黄油计划引入 Vsync，doFrame 第 2 个参数是 mFrame 的是根据 vsync 16.67ms 调用 doFrame

2. Vsync 不可用，用 FrameHandler，延迟最低 sFrameDelay（10ms）发送消息实现调用 doFrame

#### 请求和接收 VSync

##### DisplayEventReceiver#scheduleVsync() 请求 vsync

现在看 `Choreographer#scheduleVsyncLocked` 方法是如何申请 Vsync 信号的

```java
// Choreographer Androdi29
private void scheduleVsyncLocked() {
    mDisplayEventReceiver.scheduleVsync();
}
```

mDisplayEventReceiver 是在 Choregrapher 创建的，是 FrameDisplayEventReceiver 的实例，FrameDisplayEventReceiver 是 DisplayEventReceiver 的子类

```java
public class DisplayEventReceiver {
    public DisplayEventReceiver(Looper looper, int vsyncSource) {
        if (looper == null) {
            throw new IllegalArgumentException("looper must not be null");
        }
        mMessageQueue = looper.getQueue();
        // 注册VSYNC信号监听者
        mReceiverPtr = nativeInit(new WeakReference<DisplayEventReceiver>(this), mMessageQueue,  vsyncSource);
    }
    public void scheduleVsync() { // 预定一个VSync信号
        if (mReceiverPtr == 0) {
            Log.w(TAG, "Attempted to schedule a vertical sync pulse but the display event "
                    + "receiver has already been disposed.");
        } else {
            // 申请VSYNC中断信号，会回调onVsync方法
            nativeScheduleVsync(mReceiverPtr);
        }
    }
    private static native void nativeScheduleVsync(long receiverPtr);
    
    private void dispatchVsync(long timestampNanos, long physicalDisplayId, int frame) {
        onVsync(timestampNanos, physicalDisplayId, frame);
    }
    
    /**
     * 接收到VSync脉冲时 回调onVsync
     * @param timestampNanos VSync脉冲的时间戳
     * @param physicalDisplayId Stable display ID that uniquely describes a (display, port) pair.
     * @param frame 帧号码，自增
     */
    public void onVsync(long timestampNanos, long physicalDisplayId, int frame) {
    }
}
```

在 DisplayEventReceiver 的构造方法会通过 JNI 创建一个 `IDisplayEventConnection` 的 VSYNC 的监听者。

scheduleVsync() 就是使用 native 方法 nativeScheduleVsync() 去申请 VSync 信号，VSync 信号到了后，回调 `dispatchVsync`，然后调用 onVsync()，DisplayEventReceiver#onVsync 是空实现

onVsync() 具体实现是在 FrameDisplayEventReceiver

```java
// ViewRootImpl.FrameDisplayEventReceiver Androdi29
private final class FrameDisplayEventReceiver extends DisplayEventReceiver implements Runnable {
    private boolean mHavePendingVsync;
    private long mTimestampNanos;
    private int mFrame;

    public FrameDisplayEventReceiver(Looper looper, int vsyncSource) {
        super(looper, vsyncSource);
    }
    @Override
    public void onVsync(long timestampNanos, long physicalDisplayId, int frame) {
        long now = System.nanoTime();
        if (timestampNanos > now) {
            timestampNanos = now;
        }
        if (mHavePendingVsync) {
        } else {
            mHavePendingVsync = true;
        }
        mTimestampNanos = timestampNanos;
        mFrame = frame;
        // 将本身作为runnable传入msg， 发消息后 会走run()，即doFrame()，也是异步消息
        Message msg = Message.obtain(mHandler, this);
        msg.setAsynchronous(true); // 异步消息
        mHandler.sendMessageAtTime(msg, timestampNanos / TimeUtils.NANOS_PER_MS);
    }
    @Override
    public void run() {
        mHavePendingVsync = false;
        doFrame(mTimestampNanos, mFrame);
    }
}
```

onVsync() 中，将 FrameDisplayEventReceiver 本身（是个 Runnable）封装成 Message 传入异步消息 msg，并使用 FrameHandler 发送，然后执行 FrameDisplayEventReceiver#run，最终执行的就是 `FrameDisplayEventReceiver#doFrame()` 方法了。

> onVsync() 方法中只是使用 mHandler 发送消息到 MessageQueue 中，标记成了异步方法，在 `ViewRootImpl#scheduleTraversals`，添加了同步屏障标记，在这里还是存在的，所以这个 Message 会被很快处理，具体时间看前面的任务的执行情况，如果前面有耗时同步消息在执行，这个执行情况就会很慢，然后在 `ViewRootImpl#TraversalRunnable#run` 会移除掉同步屏障

##### doFrame 接收处理 vsync

接收处理 vsync，出现跳帧，重新调整 frameTimeNanos

```java
// Choreographer Androdi29
void doFrame(long frameTimeNanos, int frame) {
    final long startNanos;
    synchronized (mLock) {
        if (!mFrameScheduled) { // 在scheduleFrameLocked中mFrameScheduled置为true，
            return; // no work to do
        }
        // 预期的执行时间
        long intendedFrameTimeNanos = frameTimeNanos;
        // 获取当前时间
        startNanos = System.nanoTime();
        // jitterNanos超时时间是否超过一帧的时间（这是因为MessageQueue虽然添加了同步屏障，但可能还是有正在执行的同步任务，导致doFrame延迟执行了）
        final long jitterNanos = startNanos - frameTimeNanos;
        if (jitterNanos >= mFrameIntervalNanos) { // mFrameIntervalNanos为一帧时间，16ms
        	// 计算掉帧数
            final long skippedFrames = jitterNanos / mFrameIntervalNanos;
            if (skippedFrames >= SKIPPED_FRAME_WARNING_LIMIT) { // 掉帧超过30帧打印Log提示
                Log.i(TAG, "Skipped " + skippedFrames + " frames!  "
                        + "The application may be doing too much work on its main thread.");
            }
            // 如掉帧34ms，lastFrameOffset=4ms，frameTimeNanos赋值当前时间减去lastFrameOffset
            final long lastFrameOffset = jitterNanos % mFrameIntervalNanos; 
            // ...
            frameTimeNanos = startNanos - lastFrameOffset; 
        }
        if (frameTimeNanos < mLastFrameTimeNanos) { // 当前frameTimeNanos时间小于之前保存的时间，由于跳帧可能造成了当前展现的是之前的帧，等下一个vsync
            if (DEBUG_JANK) {
                Log.d(TAG, "Frame time appears to be going backwards.  May be due to a "
                        + "previously skipped frame.  Waiting for next vsync.");
            }
            scheduleVsyncLocked();
            return;
        }
        if (mFPSDivisor > 1) { // mFPSDivisor降低FPS，默认1 full fps，2 half full fps
            long timeSinceVsync = frameTimeNanos - mLastFrameTimeNanos;
            // 当前frameTimeNanos和上次mLastFrameTimeNanos差值要大于2*16ms才走下面，否则等下一个vsync
            if (timeSinceVsync < (mFrameIntervalNanos * mFPSDivisor) && timeSinceVsync > 0) {
                scheduleVsyncLocked();
                return;
            }
        }

        mFrameInfo.setVsync(intendedFrameTimeNanos, frameTimeNanos);
        // mFrameScheduled标志位恢复
        mFrameScheduled = false;
        // 记录最后一帧时间
        mLastFrameTimeNanos = frameTimeNanos;
    }
    try {
        // 按类型顺序 执行任务
        AnimationUtils.lockAnimationClock(frameTimeNanos / TimeUtils.NANOS_PER_MS);

        mFrameInfo.markInputHandlingStart();
        doCallbacks(Choreographer.CALLBACK_INPUT, frameTimeNanos);

        mFrameInfo.markAnimationsStart();
        doCallbacks(Choreographer.CALLBACK_ANIMATION, frameTimeNanos);
        doCallbacks(Choreographer.CALLBACK_INSETS_ANIMATION, frameTimeNanos);

        mFrameInfo.markPerformTraversalsStart();
        doCallbacks(Choreographer.CALLBACK_TRAVERSAL, frameTimeNanos);

        doCallbacks(Choreographer.CALLBACK_COMMIT, frameTimeNanos);
    } finally {
        AnimationUtils.unlockAnimationClock();
    }
}
```

###### Choreographer 处理跳帧情况 TODO

###### doCallbacks 执行具体类型的 callback(Runnable#run，FrameCallback#doFrame)

具体执行 doCallbacks 方法：

```java
// Choreographer Androdi29
void doCallbacks(int callbackType, long frameTimeNanos) {
    CallbackRecord callbacks;
    synchronized (mLock) {
        final long now = System.nanoTime();
        // 根据指定的类型CallbackkQueue中查找到达执行时间的CallbackRecord
        callbacks = mCallbackQueues[callbackType].extractDueCallbacksLocked(now / TimeUtils.NANOS_PER_MS);
        if (callbacks == null) {
            return;
        }
        mCallbacksRunning = true;
        //提交任务类型
        if (callbackType == Choreographer.CALLBACK_COMMIT) {
            final long jitterNanos = now - frameTimeNanos;
            if (jitterNanos >= 2 * mFrameIntervalNanos) { // jank 2帧，2*16ms
                final long lastFrameOffset = jitterNanos % mFrameIntervalNanos + mFrameIntervalNanos;
                frameTimeNanos = now - lastFrameOffset;
                mLastFrameTimeNanos = frameTimeNanos;
            }
        }
    }
    try {
        // 迭代执行队列所有任务
        for (CallbackRecord c = callbacks; c != null; c = c.next) {
            // 回调CallbackRecord的run，其内部回调Callback的run
            c.run(frameTimeNanos);
        }
    } finally {
        synchronized (mLock) {
            mCallbacksRunning = false;
            do {
                final CallbackRecord next = callbacks.next;
                // 回收CallbackRecord
                recycleCallbackLocked(callbacks);
                callbacks = next;
            } while (callbacks != null);
        }
    }
}
```

主要内容就是取对应任务类型的队列，遍历队列执行所有任务，执行任务是 CallbackRecord 的 run

```java
// Choreographer.CallbackRecord Androdi29
private static final class CallbackRecord {
    public CallbackRecord next;
    public long dueTime;
    public Object action; // Runnable or FrameCallback
    public Object token;

    public void run(long frameTimeNanos) {
        if (token == FRAME_CALLBACK_TOKEN) {
            // 通过postFrameCallback 或 postFrameCallbackDelayed，会执行这里
            ((FrameCallback)action).doFrame(frameTimeNanos);
        } else {
            // 取出Runnable执行run()
            ((Runnable)action).run();
        }
    }
}
```

1. `token!=FRAME_CALLBACK_TOKEN` 或 `token==null`<br />action 是 Runnable，执行 run()。ViewRootImpl#scheduleTraversals 中 token 为 null，的 action 就是 mTraversalRunnable 了

```java
// ViewRootImpl#scheduleTraversals Android29
mChoreographer.postCallback(Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
```

2. `token==FRAME_CALLBACK_TOKEN`，执行 FrameCallback#doFrame<br />Choreographer 的 postFrameCallbackXXX()

```java
// Choreographer Android29
public void postFrameCallback(FrameCallback callback) {
    postFrameCallbackDelayed(callback, 0);
}
public void postFrameCallbackDelayed(FrameCallback callback, long delayMillis) {
    if (callback == null) {
        throw new IllegalArgumentException("callback must not be null");
    }
	//也是走到是postCallbackDelayedInternal，并且注意是CALLBACK_ANIMATION类型，
	//token是FRAME_CALLBACK_TOKEN，action就是FrameCallback
    postCallbackDelayedInternal(CALLBACK_ANIMATION,
            callback, FRAME_CALLBACK_TOKEN, delayMillis);
}
public interface FrameCallback {
    public void doFrame(long frameTimeNanos);
}
```

> 可以看到 postFrameCallback() 传入的是 FrameCallback 实例，接口 FrameCallback 只有一个 doFrame() 方法。并且也是走到 postCallbackDelayedInternal，FrameCallback 实例作为 action 传入，token 则是 FRAME_CALLBACK_TOKEN，并且任务是 CALLBACK_ANIMATION 类型。

到这里 VSync 就处理完毕了。

##### Android 中用到的 Choreographer

现在看看属性动画和 UI 变更是如何用了 Choreographer

###### 1. UI 变更

UI 更改我们都知道会走 `ViewRootImpl#scheduleTraversals`，在这里通过编舞者 `mChoreographer.postCallback( Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);`postCallback 一个类型为 `Choreographer.CALLBACK_TRAVERSAL`，token=null 的 Runnable（TraversalRunnable），由上面分析可知，最后会调用 TraversalRunnable#run 方法，然后执行 `ViewRootImpl#doTraversal`，最后走到 `performTraversals` 执行 measure/layout/draw 等操作

###### 2. 属性动画

属性动画 ValueAnimator#start 后，在 AnimationHandler#addAnimationFrameCallback 添加一个回调，然后通过 MyFrameCallbackProvider（这里面实例化了一个 Choreographer）的 postFrameCallback，前面我们知道，这是一个 token 为 `FRAME_CALLBACK_TOKEN`，类型为 `CALLBACK_ANIMATION` 的 FrameCallback，由上面分析可知，最后会走到 FrameCallback#doFrame 方法，然后走 AnimationHander#doAnimationFrame，在这里将前面 addAnimationFrameCallback 添加的所有回调遍历执行一遍，然后 ValueAnimator 根据这个回调处理值的更新

### CallbackQueue/CallbackRecord

```java
// Choreographer Android29
private CallbackRecord mCallbackPool;
private final CallbackQueue[] mCallbackQueues;
private static final int CALLBACK_LAST = CALLBACK_COMMIT // 4
private Choreographer(Looper looper, int vsyncSource) {
    mCallbackQueues = new CallbackQueue[CALLBACK_LAST + 1]; // 初始化容量5，对应5种类型，每种类型都有一个CallbackQueue
    for (int i = 0; i <= CALLBACK_LAST; i++) {
        mCallbackQueues[i] = new CallbackQueue(); 
    }
}
```

#### CallbackRecord

CallbackRecord 用来存在 action，token，dueTime(延迟后的 SystemClock#uptimeMillis 时间)；是一个单链表；

```java
private static final class CallbackRecord {
    public CallbackRecord next;
    public long dueTime;
    public Object action; // Runnable or FrameCallback
    public Object token;

    @UnsupportedAppUsage
    public void run(long frameTimeNanos) {
        if (token == FRAME_CALLBACK_TOKEN) {
            ((FrameCallback)action).doFrame(frameTimeNanos);
        } else {
            ((Runnable)action).run();
        }
    }
}
```

#### CallbackQueue

CallbackQueue 用来存储 postCallbackXXX 的数据，每个 CallbackQueue 都有一个 CallbackRecord，是一个单链表。

```java
// ViewRootImpl Androdi29
private void postCallbackDelayedInternal(int callbackType,  Object action, Object token, long delayMillis) {
    final long now = SystemClock.uptimeMillis();
    final long dueTime = now + delayMillis;
    mCallbackQueues[callbackType].addCallbackLocked(dueTime, action, token);
}
private CallbackRecord obtainCallbackLocked(long dueTime, Object action, Object token) {
    CallbackRecord callback = mCallbackPool;
    if (callback == null) {
        callback = new CallbackRecord();
    } else {
        mCallbackPool = callback.next;
        callback.next = null;
    }
    callback.dueTime = dueTime;
    callback.action = action;
    callback.token = token;
    return callback;
}

private void recycleCallbackLocked(CallbackRecord callback) {
    callback.action = null;
    callback.token = null;
    callback.next = mCallbackPool;
    mCallbackPool = callback;
}

// ViewRootImpl.CallbackQueue Androdi29
private final class CallbackQueue {
    private CallbackRecord mHead;

    public boolean hasDueCallbacksLocked(long now) {
        return mHead != null && mHead.dueTime <= now;
    }

    public CallbackRecord extractDueCallbacksLocked(long now) {
        CallbackRecord callbacks = mHead;
        if (callbacks == null || callbacks.dueTime > now) {
            return null;
        }

        CallbackRecord last = callbacks;
        CallbackRecord next = last.next;
        while (next != null) {
            if (next.dueTime > now) {
                last.next = null;
                break;
            }
            last = next;
            next = next.next;
        }
        mHead = next;
        return callbacks;
    }

    // 按时间排序，时间早的排在前面
    public void addCallbackLocked(long dueTime, Object action, Object token) {
        CallbackRecord callback = obtainCallbackLocked(dueTime, action, token);
        CallbackRecord entry = mHead;
        if (entry == null) {
            mHead = callback;
            return;
        }
        if (dueTime < entry.dueTime) {
            callback.next = entry;
            mHead = callback;
            return;
        }
        while (entry.next != null) {
            if (dueTime < entry.next.dueTime) {
                callback.next = entry.next;
                break;
            }
            entry = entry.next;
        }
        entry.next = callback;
    }

    public void removeCallbacksLocked(Object action, Object token) {
        CallbackRecord predecessor = null;
        for (CallbackRecord callback = mHead; callback != null;) {
            final CallbackRecord next = callback.next;
            if ((action == null || callback.action == action)
                    && (token == null || callback.token == token)) {
                if (predecessor != null) {
                    predecessor.next = next;
                } else {
                    mHead = next;
                }
                recycleCallbackLocked(callback);
            } else {
                predecessor = callback;
            }
            callback = next;
        }
    }
}
```

## Choreographer 用途

### Choreographer 的 postFrameCallback() 计算丢帧情况

```java
// Application.java
public void onCreate() {
    super.onCreate();
    //在Application中使用postFrameCallback
    Choreographer.getInstance().postFrameCallback(new FPSFrameCallback(System.nanoTime()));
}


public class FPSFrameCallback implements Choreographer.FrameCallback {

  private static final String TAG = "FPS_TEST";
  private long mLastFrameTimeNanos = 0;
  private long mFrameIntervalNanos;

  public FPSFrameCallback(long lastFrameTimeNanos) {
      mLastFrameTimeNanos = lastFrameTimeNanos;
      mFrameIntervalNanos = (long)(1000000000 / 60.0);
  }

  @Override
  public void doFrame(long frameTimeNanos) {

      //初始化时间
      if (mLastFrameTimeNanos == 0) {
          mLastFrameTimeNanos = frameTimeNanos;
      }
      final long jitterNanos = frameTimeNanos - mLastFrameTimeNanos;
      if (jitterNanos >= mFrameIntervalNanos) {
          final long skippedFrames = jitterNanos / mFrameIntervalNanos;
          if(skippedFrames>30){
          	//丢帧30以上打印日志
              Log.i(TAG, "Skipped " + skippedFrames + " frames!  "
                      + "The application may be doing too much work on its main thread.");
          }
      }
      mLastFrameTimeNanos=frameTimeNanos;
      //注册下一帧回调
      Choreographer.getInstance().postFrameCallback(this);
  }
}
```
