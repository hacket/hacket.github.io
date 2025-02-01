---
date_created: Monday, July 1st 2020, 10:42:58 pm
date_updated: Thursday, January 30th 2025, 12:09:37 am
title: Systrace基础-MainThread和RenderThread
author: hacket
categories:
  - 性能优化
category: 性能优化工具
tags: [Systrace, 性能优化, 性能优化工具]
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
date created: 2024-06-20 08:24
date updated: 2024-12-24 00:37
aliases: [主线程和渲染线程]
linter-yaml-title-alias: 主线程和渲染线程
---

# 主线程和渲染线程

截取主线程和渲染线程**一帧**的工作流程 (每一帧都会遵循这个流程，不过有的帧需要处理的事情多，有的帧需要处理的事情少) ，重点看 "UI Thread " 和 RenderThread 这两行。

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200822044.png)

**这张图对应的工作流程如下**

1. 主线程处于 Sleep 状态，等待 `Vsync` 信号
2. Vsync 信号到来，主线程被唤醒，Choreographer 回调 `FrameDisplayEventReceiver.onVsync` 开始一帧的绘制
3. 处理 App 这一帧的 `Input` 事件 (如果有的话)
4. 处理 App 这一帧的 `Animation` 事件 (如果有的话)
5. 处理 App 这一帧的 `Traversal` 事件 (如果有的话)
6. 主线程与渲染线程同步渲染数据，同步结束后，主线程结束一帧的绘制，可以继续处理下一个 Message(如果有的话，`IdleHandler` 如果不为空，这时候也会触发处理)，或者进入 Sleep 状态等待下一个 Vsync
7. 渲染线程首先需要从 BufferQueue 里面取一个 Buffer(`dequeueBuffer`) , 进行数据处理之后，调用 OpenGL 相关的函数，真正地进行渲染操作，然后将这个渲染好的 Buffer 还给 `BufferQueue` (queueBuffer) , SurfaceFlinger 在 Vsync-SF 到了之后，将所有准备好的 Buffer 取出进行合成 (这个流程在讲 SurfaceFlinger 的时候会提到)

## 主线程的创建

Android App 的进程是基于 Linux 的，其管理也是基于 Linux 的进程管理机制，所以其创建也是调用了 fork 函数

`frameworks/base/core/jni/com_android_internal_os_Zygote.cpp`

```cpp
pid_t pid = fork();
```

Fork 出来的进程，我们这里可以把他看做主线程，但是这个线程还没有和 Android 进行连接，所以无法处理 Android App 的 Message ；由于 Android App 线程运行**基于消息机制** ，那么这个 Fork 出来的主线程需要和 Android 的 Message 消息绑定，才能处理 Android App 的各种 Message

这里就引入了 **ActivityThread** ，确切的说，ActivityThread 应该起名叫 ProcessThread 更贴切一些。ActivityThread 连接了 Fork 出来的进程和 App 的 Message ，他们的通力配合组成了我们熟知的 Android App 主线程。所以说 ActivityThread 其实并不是一个 Thread，而是他初始化了 Message 机制所需要的 MessageQueue、Looper、Handler ，而且其 Handler 负责处理大部分 Message 消息，所以我们习惯上觉得 ActivityThread 是主线程，其实他只是主线程的一个逻辑处理单元。\

### ActivityThread 的创建

App 进程 fork 出来之后，回到 App 进程，查找 ActivityThread 的 Main 函数

```java
// com/android/internal/os/ZygoteInit.java
static final Runnable childZygoteInit(
        int targetSdkVersion, String[] argv, ClassLoader classLoader) {
    RuntimeInit.Arguments args = new RuntimeInit.Arguments(argv);
    return RuntimeInit.findStaticMain(args.startClass, args.startArgs, classLoader);
}
```

这里的 startClass 就是 ActivityThread，找到之后调用，逻辑就到了 ActivityThread 的 main 函数

```java
// android/app/ActivityThread.java
public static void main(String[] args) {
    //1. 初始化 Looper、MessageQueue
    Looper.prepareMainLooper();
    // 2. 初始化 ActivityThread
    ActivityThread thread = new ActivityThread();
    // 3. 主要是调用 AMS.attachApplicationLocked，同步进程信息，做一些初始化工作
    thread.attach(false, startSeq);
    // 4. 获取主线程的 Handler，这里是 H ，基本上 App 的 Message 都会在这个 Handler 里面进行处理 
    if (sMainThreadHandler == null) {
        sMainThreadHandler = thread.getHandler();
    }
    // 5. 初始化完成，Looper 开始工作
    Looper.loop();
}
```

main 函数处理完成之后，主线程就算是正式上线开始工作，其 Systrace 流程如下：

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200836861.png)

### ActivityThread 的功能

进程创建、Activity 启动、Service 的管理、Receiver 的管理、Provider 的管理这些都会在这里处理，然后进到具体的 handleXXX

## 渲染线程的创建和发展

最初的 Android 版本里面是没有渲染线程的，渲染工作都是在主线程完成，使用的也都是 CPU ，调用的是 `libSkia` 这个库，`RenderThread` 是在 Android Lollipop 中新加入的组件，负责承担一部分之前主线程的渲染工作，减轻主线程的负担。

### 软件绘制

我们一般提到的硬件加速，指的就是 GPU 加速，这里可以理解为用 RenderThread 调用 GPU 来进行渲染加速 。 硬件加速在目前的 Android 中是默认开启的， 所以如果我们什么都不设置，那么我们的进程默认都会有主线程和渲染线程 (有可见的内容)。我们如果在 App 的 AndroidManifest 里面，在 Application 标签里面加一个

```xml
android:hardwareAccelerated="false"
```

系统检测到你这个 App 关闭了硬件加速，就不会初始化 RenderThread ，直接 cpu 调用 `libSkia` 来进行渲染。其 Systrace 的表现如下：

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200840723.png)

可以看到主线程由于要进行渲染工作，所以执行的时间变长了，也更容易出现卡顿，同时帧与帧直接的空闲间隔也变短了，使得其他 Message 的执行时间被压缩

### 硬件加速绘制

正常情况下，硬件加速是开启的，主线程的 draw 函数并没有真正的执行 drawCall ，而是把要 draw 的内容记录到 DIsplayList 里面，同步到 RenderThread 中，一旦同步完成，主线程就可以被释放出来做其他的事情，RenderThread 则继续进行渲染工作。

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200841583.png)

### 渲染线程初始化

渲染线程初始化在真正需要 draw 内容的时候，一般我们启动一个 Activity ，在第一个 draw 执行的时候，会去检测渲染线程是否初始化，如果没有则去进行初始化

```java
// android/view/ViewRootImpl.java
mAttachInfo.mThreadedRenderer.initializeIfNeeded(
        mWidth, mHeight, mAttachInfo, mSurface, surfaceInsets);
```

后续直接调用 draw

```java
// android/graphics/HardwareRenderer.java
mAttachInfo.mThreadedRenderer.draw(mView, mAttachInfo, this);  
void draw(View view, AttachInfo attachInfo, DrawCallbacks callbacks) {  
    final Choreographer choreographer = attachInfo.mViewRootImpl.mChoreographer;  
    choreographer.mFrameInfo.markDrawStart();  
  
    updateRootDisplayList(view, callbacks);  
  
    if (attachInfo.mPendingAnimatingRenderNodes != null) {  
        final int count = attachInfo.mPendingAnimatingRenderNodes.size();  
        for (int i = 0; i < count; i++) {  
            registerAnimatingRenderNode(  
                    attachInfo.mPendingAnimatingRenderNodes.get(i));  
        }  
        attachInfo.mPendingAnimatingRenderNodes.clear();  
        attachInfo.mPendingAnimatingRenderNodes = null;  
    }  
  
    int syncResult = syncAndDrawFrame(choreographer.mFrameInfo);  
    if ((syncResult & SYNC_LOST_SURFACE_REWARD_IF_FOUND) != 0) {  
        setEnabled(false);  
        attachInfo.mViewRootImpl.mSurface.release();  
        attachInfo.mViewRootImpl.invalidate();  
    }  
    if ((syncResult & SYNC_REDRAW_REQUESTED) != 0) {  
        attachInfo.mViewRootImpl.invalidate();  
    }  
}
```

上面的 draw 只是更新 `DIsplayList` ，更新结束后，调用 syncAndDrawFrame ，通知渲染线程开始工作，主线程释放。渲染线程的核心实现在 libhwui 库里面，其代码位于 `frameworks/base/libs/hwui`：

`frameworks/base/libs/hwui/renderthread/RenderProxy.cpp`

```cpp
int RenderProxy::syncAndDrawFrame() {
    return mDrawFrameTask.drawFrame();
}
```

hwui 其核心流程在 Systrace 上的表现如下:

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200843680.png)

### 主线程和渲染线程的分工

主线程负责处理进程 `Message`、处理 `Input` 事件、处理 `Animation` 逻辑、处理 `Measure`、`Layout`、`Draw` ，更新 `DisplayList` ，但是不涉及 `SurfaceFlinger` 打交道；渲染线程负责渲染渲染相关的工作，一部分工作也是 CPU 来完成的，一部分操作是调用 OpenGL 函数来完成的

当启动硬件加速后，在 Measure、Layout、Draw 的 Draw 这个环节，Android 使用 DisplayList 进行绘制而非直接使用 CPU 绘制每一帧。DisplayList 是一系列绘制操作的记录，抽象为 `RenderNode` 类，这样间接的进行绘制操作的优点如下

1. DisplayList 可以按需多次绘制而无须同业务逻辑交互
2. 特定的绘制操作（如 translation， scale 等）可以作用于整个 DisplayList 而无须重新分发绘制操作
3. 当知晓了所有绘制操作后，可以针对其进行优化：例如，所有的文本可以一起进行绘制一次
4. 可以将对 DisplayList 的处理转移至另一个线程（也就是 RenderThread）
5. 主线程在 sync 结束后可以处理其他的 Message，而不用等待 RenderThread 结束

RenderThread 的具体流程大家可以看这篇文章 ： <http://www.cocoachina.com/articles/35302>

# Ref

- [Android Systrace 基础知识 - MainThread 和 RenderThread 解读 · Android Performance](https://www.androidperformance.com/2019/11/06/Android-Systrace-MainThread-And-RenderThread/)
