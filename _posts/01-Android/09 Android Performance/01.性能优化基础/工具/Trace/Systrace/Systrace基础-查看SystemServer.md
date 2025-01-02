---
date created: 2024-06-18 08:31
date updated: 2024-12-24 00:37
dg-publish: true
---

Systrace 中的 `SystemServer` 一个比较重要的地方就是窗口动画，由于窗口归 SystemServer 来管，那么窗口动画也就是由 SystemServer 来进行统一的处理，其中涉及到两个比较重要的线程，`Android.Anim` 和 `Android.Anim.if` 这两个线程。

以**应用启动**为例，查看窗口时如何在两个线程之间进行切换(Android P 里面，应用的启动动画由 Launcher 和应用自己的第一帧组成，之前是在 SystemServer 里面的，现在多任务的动画为了性能部分移到了 Launcher 去实现)

首先我们点击图标启动应用的时候，由于 App 还在启动，Launcher 首先启动一个 StartingWindow，等 App 的第一帧绘制好了之后，再切换到 App 的窗口动画

## 窗口动画

## ActivityManagerService

`AMS` 和 `WMS` 算是 SystemServer 中最繁忙的两个 Service 了，与 AMS 相关的 Trace 一般会用 `TRACE_TAG_ACTIVITY_MANAGER` 这个 TAG，在 Systrace 中的名字是 `ActivityManager`。

下面是启动一个新的进程的时候，AMS 的输出

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180834360.png)

在进程和四大组件的各种场景一般都会有对应的 Trace 点来记录，比如大家熟悉的 ActivityStart、ActivityResume、activityStop 等，这些 Trace 点有一些在应用进程，有一些在 SystemServer 进程，所以大家在看 Activity 相关的代码逻辑的时候，需要不断在这两个进程之间进行切换，这样才能从一个整体的角度来看应用的状态变化和 SystemServer 在其中起到的作用。

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180834768.png)

## WindowManagerService

与 WMS 相关的 Trace 一般会用 `TRACE_TAG_WINDOW_MANAGER` 这个 TAG，在 Systrace 中 WindowManagerService 在 SystemServer 中多在对应的 Binder 中出现，比如下面应用启动的时候，`relayoutWindow` 的 Trace 输出

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180835136.png)

在 Window 的各种场景一般都会有对应的 Trace 点来记录，比如大家熟悉的 `relayoutWIndow`、`performLayout`、`prepareToDisplay` 等

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180836416.png)

## Input

Input 是 SystemServer 线程里面非常重要的一部分，主要是由 InputReader 和 InputDispatcher 这两个 Native 线程组成，关于这一部分在 [Systrace 基础知识 - Input 解读](https://www.androidperformance.com/2019/11/04/Android-Systrace-Input/) 里面已经详细讲过，这里就不再详细讲了

## Binder

SystemServer 由于提供大量的基础服务，所以进程间的通信非常繁忙，且大部分通信都是通过 Binder ，所以 Binder 在 SystemServer 中的作用非常关键，很多时候当后台有大量的 App 存在的时候，SystemServer 就会由于 Binder 通信和锁竞争，导致系统或者 App 卡顿。关于这一部分在 [Binder 和锁竞争解读](https://www.androidperformance.com/2019/12/06/Android-Systrace-Binder/) 里面已经详细讲过，这里就不再详细讲了

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180838893.png)

## HandlerThread

### BackgroundThread

```java
private BackgroundThread() {
	super("android.bg", android.os.Process.THREAD_PRIORITY_BACKGROUND);
}
```

Systrace 中的 `BackgroundThread`
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180840118.png)

BackgroundThread 在系统中使用比较多，许多对性能没有要求的任务，一般都会放到 BackgroundThread 中去执行

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180840631.png)

## ServiceThread

`ServiceThread` 继承自 `HandlerThread` ，下面介绍的几个工作线程都是继承自 `ServiceThread` ，分别实现不同的功能，根据线程功能不同，其线程优先级也不同：`UiThread`、`IoThread`、`DisplayThread`、`AnimationThread`、`FgThread`、`SurfaceAnimationThread`

每个 Thread 都有自己的 `Looper` 、`Thread` 和 `MessageQueue`，互相不会影响。Android 系统根据功能，会使用不同的 Thread 来完成。

### UiThread

```java
private UiThread() {
    super("android.ui", Process.THREAD_PRIORITY_FOREGROUND, false /*allowIo*/);
}
```

Systrace 中的 UiThread：

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406182331876.png)

### IoThread

```java
private IoThread() {
    super("android.io", android.os.Process.THREAD_PRIORITY_DEFAULT, true /*allowIo*/);
}
```

### DisplayThread

```java
private DisplayThread() {
    // DisplayThread runs important stuff, but these are not as important as things running in
    // AnimationThread. Thus, set the priority to one lower.
    super("android.display", Process.THREAD_PRIORITY_DISPLAY + 1, false /*allowIo*/);
}
```

Systrace 中的 DisplayThread

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406182332569.png)

### AnimationThread

```java
private AnimationThread() {
    super("android.anim", THREAD_PRIORITY_DISPLAY, false /*allowIo*/);
}
```

Systrace 中的 AnimationThread：

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406182333508.png)

`WindowAnimator` 的动画执行也是在 `AnimationThread` 线程中的，Android P 增加了一个 `SurfaceAnimationThread` 来分担 `AnimationThread` 的部分工作，来提高 `WindowAnimation` 的动画性能。

### FgThread

```java
private FgThread() {
    super("android.fg", android.os.Process.THREAD_PRIORITY_DEFAULT, true /*allowIo*/);
}
```

Systrace 中的 FgThread：

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406182334455.png)

### SurfaceAnimationThread

```java
// com/android/server/wm/SurfaceAnimationThread.java
private SurfaceAnimationThread() {
    super("android.anim.lf", THREAD_PRIORITY_DISPLAY, false /*allowIo*/);
}
```

Systrace 中的 SurfaceAnimationThread：
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406182334601.png)

`SurfaceAnimationThread` 的名字叫 `android.anim.lf` ， 与 `android.anim` 有区别，这个 Thread 主要是执行窗口动画，用于分担 android.anim 线程的一部分动画工作，减少由于锁导致的窗口动画卡顿问题，具体的内容可以看这篇文章：[Android P——LockFreeAnimation](https://zhuanlan.zhihu.com/p/44864987)

```java
SurfaceAnimationRunner(@Nullable AnimationFrameCallbackProvider callbackProvider,
        AnimatorFactory animatorFactory, Transaction frameTransaction,
        PowerManagerInternal powerManagerInternal) {
    SurfaceAnimationThread.getHandler().runWithScissors(() -> mChoreographer = getSfInstance(),
            0 /* timeout */);
    mFrameTransaction = frameTransaction;
    mAnimationHandler = new AnimationHandler();
    mAnimationHandler.setProvider(callbackProvider != null
            ? callbackProvider
            : new SfVsyncFrameCallbackProvider(mChoreographer));
    mAnimatorFactory = animatorFactory != null
            ? animatorFactory
            : SfValueAnimator::new;
    mPowerManagerInternal = powerManagerInternal;
}
```
