---
date created: 2024-06-06 00:24
date updated: 2024-12-24 00:27
dg-publish: true
---

# Choreographer编舞者

## Choreographer小结

- 使用Choreographer必须是在Looper线程
- Choreographer是线程唯一的实例，保存在ThreadLocal
- Choreographer通过postCallbackXXX提交任务，postCallback提交Runnable，postFrameCallback提交FrameCallback
- Choreographer定义了5种类型的任务（Input/ANIMATION/INSETS_ANIMATION/TRAVERSAL/COMMIT ），按顺序执行
- Choreographer中所有的Handler消息都是异步消息，不受同步屏障影响
- Choreographer整套流程

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

### 什么地方用到了Choreographer

#### UI变更（最终都调用ViewRootImpl#scheduleTraversals()）

所有UI的变化都是走到`ViewRootImpl#scheduleTraversals()`方法

##### Activty#makeVisible  Activity页面可交互

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

看看scheduleTraversals()

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

1. 首先使用mTraversalScheduled字段保证同时间多次更改只会刷新一次，例如TextView连续两次setText()，也只会走一次绘制流程。
2. 把当前线程的消息队列Queue添加了同步屏障，这样就屏蔽了正常的同步消息（异步消息不会屏蔽，编舞者里都是异步消息），保证VSync到来后立即执行绘制，而不是要等前面的同步消息。
3. 调用了mChoreographer.postCallback()方法，发送一个会在下一帧执行的回调，即在下一个VSync到来时会执行TraversalRunnable-->doTraversal()--->performTraversals()-->绘制流程。

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

### Choreographer是什么？

Google在Android 4.1提出的`Project Butter`黄油计划对Android Display系统进行了优化：在收到VSync pulse后，将马上开始下一帧的渲染。即`一旦收到VSync通知，CPU和GPU就立刻开始计算然后把数据写入buffer。`

文档说，Choreographer是协调动画时间脉冲(timing pulse，例如vsync)，输入事件和绘制。

```
Coordinates the timing of animations, input and drawing.
public class Choreographer{
}
```

#### Choreographer创建

Choreographer，线程单例，每个Looper线程都能持有一个Choreographer

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

Choreographer和Looper一样是线程单例的。且当前线程要有looper，Choreographer实例需要传入。接着看看Choreographer构造方法：

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

创建了一个mHandler、VSync事件接收器mDisplayEventReceiver、任务链表数组mCallbackQueues。FrameHandler、FrameDisplayEventReceiver、CallbackQueue。

1. 在ViewRootImpl的构造方法内使用Choreographer.getInstance()创建

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

每当收到 VSYNC 信号时，Choreographer 将首先处理`INPUT`类型的任务、然后是 `ANIMATION/CALLBACK_INSETS_ANIMATION` 类型的任务、然后`TRAVERSAL`类型的任务、最后`COMMIT`类型的任务。

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

FrameHandler有3个作用，都是发的异步消息

1. 有延迟的任务发延迟消息，对应MSG_DO_SCHEDULE_CALLBACK
2. 不在原线程的发到原线程，对应MSG_DO_SCHEDULE_VSYNC
3. 没开启VSYNC的直接走 doFrame 方法取执行绘制，对应MSG_DO_FRAME

#### Choreographer#postCallbackXXX 提交任务

Choreographer创建了，现在看提交任务postCallbackXXX

##### postCallback/postCallbackDelayed  提交Runnable

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

##### postFrameCallback/postFrameCallbackDelayed  提交FrameCallback

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

postCallback/postCallbackDelayed和postFrameCallback/postFrameCallbackDelayed最后都是走的postCallbackDelayedInternal：

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

首先取对应类型的CallbackQueue添加任务，action就是mTraversalRunnable，token是null。CallbackQueue的addCallbackLocked()就是把 dueTime、action、token组装成CallbackRecord后 存入CallbackQueue的下一个节点

不管是有没有延迟，最会走`scheduleFrameLocked`：

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

1. 如果系统未开启 VSYNC 机制，此时直接发送 `MSG_DO_FRAME` 消息到 FrameHandler，最终走到doFrame
2. Android 4.1 之后系统默认开启 VSYNC，在 Choreographer 的构造方法会创建一个 FrameDisplayEventReceiver，scheduleVsyncLocked 方法将会通过它申请 VSYNC 信号，最终走到doFrame
3. isRunningOnLooperThreadLocked 方法，其内部根据 Looper 判断是否在原线程，否则发送消息到 FrameHandler。最终还是会调用 scheduleVsyncLocked 方法申请 VSYNC 信号。

> 1. Android4.1 黄油计划引入Vsync，doFrame第2个参数是mFrame的是根据vsync 16.67ms调用doFrame

2. Vsync不可用，用FrameHandler，延迟最低sFrameDelay（10ms）发送消息实现调用doFrame

#### 请求和接收VSync

##### DisplayEventReceiver#scheduleVsync() 请求vsync

现在看`Choreographer#scheduleVsyncLocked` 方法是如何申请Vsync信号的

```java
// Choreographer Androdi29
private void scheduleVsyncLocked() {
    mDisplayEventReceiver.scheduleVsync();
}
```

mDisplayEventReceiver是在Choregrapher创建的，是FrameDisplayEventReceiver的实例，FrameDisplayEventReceiver是DisplayEventReceiver的子类

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

在DisplayEventReceiver的构造方法会通过JNI创建一个`IDisplayEventConnection`的VSYNC的监听者。

scheduleVsync()就是使用native方法nativeScheduleVsync()去申请VSync信号，VSync信号到了后，回调`dispatchVsync`，然后调用onVsync()，DisplayEventReceiver#onVsync是空实现

onVsync()具体实现是在FrameDisplayEventReceiver

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

onVsync()中，将FrameDisplayEventReceiver本身（是个Runnable）封装成Message传入异步消息msg，并使用FrameHandler发送，然后执行FrameDisplayEventReceiver#run，最终执行的就是`FrameDisplayEventReceiver#doFrame()`方法了。

> onVsync()方法中只是使用mHandler发送消息到MessageQueue中，标记成了异步方法，在`ViewRootImpl#scheduleTraversals`，添加了同步屏障标记，在这里还是存在的，所以这个Message会被很快处理，具体时间看前面的任务的执行情况，如果前面有耗时同步消息在执行，这个执行情况就会很慢，然后在`ViewRootImpl#TraversalRunnable#run`会移除掉同步屏障

##### doFrame 接收处理vsync

接收处理vsync，出现跳帧，重新调整frameTimeNanos

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

###### Choreographer处理跳帧情况 TODO

###### doCallbacks 执行具体类型的callback(Runnable#run，FrameCallback#doFrame)

具体执行doCallbacks 方法：

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

主要内容就是取对应任务类型的队列，遍历队列执行所有任务，执行任务是 CallbackRecord的 run

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

1. `token!=FRAME_CALLBACK_TOKEN`或`token==null`<br />action是Runnable，执行run()。ViewRootImpl#scheduleTraversals中token为null，的action就是mTraversalRunnable了

```java
// ViewRootImpl#scheduleTraversals Android29
mChoreographer.postCallback(Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
```

2. `token==FRAME_CALLBACK_TOKEN`，执行FrameCallback#doFrame<br />Choreographer的postFrameCallbackXXX()

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

> 可以看到postFrameCallback()传入的是FrameCallback实例，接口FrameCallback只有一个doFrame()方法。并且也是走到postCallbackDelayedInternal，FrameCallback实例作为action传入，token则是FRAME_CALLBACK_TOKEN，并且任务是CALLBACK_ANIMATION类型。

到这里VSync就处理完毕了。

##### Android中用到的Choreographer

现在看看属性动画和UI变更是如何用了Choreographer

###### 1. UI变更

UI更改我们都知道会走`ViewRootImpl#scheduleTraversals`，在这里通过编舞者`mChoreographer.postCallback( Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);`postCallback一个类型为`Choreographer.CALLBACK_TRAVERSAL`，token=null的Runnable（TraversalRunnable），由上面分析可知，最后会调用TraversalRunnable#run方法，然后执行`ViewRootImpl#doTraversal`，最后走到`performTraversals`执行measure/layout/draw等操作

###### 2. 属性动画

属性动画ValueAnimator#start后，在AnimationHandler#addAnimationFrameCallback添加一个回调，然后通过MyFrameCallbackProvider（这里面实例化了一个Choreographer）的postFrameCallback，前面我们知道，这是一个token为`FRAME_CALLBACK_TOKEN`，类型为`CALLBACK_ANIMATION`的FrameCallback，由上面分析可知，最后会走到FrameCallback#doFrame方法，然后走AnimationHander#doAnimationFrame，在这里将前面addAnimationFrameCallback添加的所有回调遍历执行一遍，然后ValueAnimator根据这个回调处理值的更新

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

CallbackRecord用来存在action，token，dueTime(延迟后的SystemClock#uptimeMillis时间)；是一个单链表；

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

CallbackQueue用来存储postCallbackXXX的数据，每个CallbackQueue都有一个CallbackRecord，是一个单链表。

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

## Choreographer用途

### Choreographer的postFrameCallback()计算丢帧情况

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
