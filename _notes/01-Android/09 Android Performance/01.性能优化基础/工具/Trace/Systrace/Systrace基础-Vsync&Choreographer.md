---
date created: 2024-06-19 08:09
date updated: 2024-12-24 00:37
tags:
  - '#0'
dg-publish: true
---

# Choreographer

## 演进

引入 Vsync 之前的 Android 版本，渲染一帧相关的 Message ，中间是没有间隔的，上一帧绘制完，下一帧的 Message 紧接着就开始被处理。这样的问题就是，**帧率不稳定**，可能高也可能低，不稳定，如下图
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200035095.png)

可以看到这时候的瓶颈是在 `dequeueBuffer`, 因为屏幕是有刷新周期的, FB 消耗 Front Buffer 的速度是一定的, 所以 SF 消耗 App Buffer 的速度也是一定的, 所以 App 会卡在 dequeueBuffer 这里,这就会导致 App Buffer 获取不稳定, 很容易就会出现卡顿掉帧的情况.

对于用户来说，稳定的帧率才是好的体验，比如你玩王者荣耀，相比 fps 在 60 和 40 之间频繁变化，用户感觉更好的是稳定在 50 fps 的情况.

所以 Android 的演进中，引入了 **Vsync + TripleBuffer + Choreographer** 的机制，其主要目的就是提供一个稳定的帧率输出机制，让软件层和硬件层可以以共同的频率一起工作。

## Choreographer 概述

`Choreographer` 的引入，主要是配合 `Vsync` ，给上层 App 的渲染提供一个稳定的 Message 处理的时机，也就是 Vsync 到来的时候，系统通过对 Vsync 信号周期的调整，来控制每一帧绘制操作的时机. 目前大部分手机都是 60Hz 的刷新率，也就是 16.6ms 刷新一次，系统为了配合屏幕的刷新频率，将 Vsync 的周期也设置为 16.6 ms，每个 16.6 ms ， Vsync 信号唤醒 Choreographer 来做 App 的绘制操作，这就是引入 Choreographer 的主要作用. 了解 Choreographer 还可以帮助 App 开发者知道程序每一帧运行的基本原理，也可以加深对 Message、Handler、Looper、MessageQueue、Measure、Layout、Draw 的理解。
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200041707.png)

当然目前使用 90Hz 刷新率屏幕的手机越来越多，Vsync 周期从 16.6ms 到了 11.1ms，上图中的操作要在更短的时间内完成，对性能的要求也越来越高，具体可以看[新的流畅体验，90Hz 漫谈](https://www.androidperformance.com/2019/05/15/90hz-on-android/) 这篇文章。

## Choreographer 简介

Choreographer 扮演 Android 渲染链路中承上启下的角色

1. **承上**：负责接收和处理 App 的各种更新消息和回调，等到 Vsync 到来的时候统一处理。比如集中处理 `Input`(主要是 Input 事件的处理) 、`Animation`(动画相关)、`Traversal`(包括 measure、layout、draw 等操作) ，判断卡顿掉帧情况，记录 CallBack 耗时等
2. **启下**：负责请求和接收 Vsync 信号。接收 `Vsync` 事件回调(通过 `FrameDisplayEventReceiver.onVsync` )；请求 `Vsync(FrameDisplayEventReceiver.scheduleVsync)`

从上面可以看出来， Choreographer 担任的是一个工具人的角色，他之所以重要，是因为通过 **Choreographer + SurfaceFlinger + Vsync + TripleBuffer** 这一套从上到下的机制，保证了 Android App 可以以一个稳定的帧率运行(20fps、90fps 或者 60fps)，减少帧率波动带来的不适感。

了解 Choreographer 还可以帮助 App 开发者知道程序每一帧运行的基本原理，也可以加深对 **Message、Handler、Looper、MessageQueue、Input、Animation、Measure、Layout、Draw** 的理解 , 很多 **APM** 工具也用到了 **Choreographer( 利用 FrameCallback + FrameInfo )** + **MessageQueue ( 利用 IdleHandler )** + **Looper ( 设置自定义 MessageLogging)** 这些组合拳，深入了解了这些之后，再去做优化，脑子里的思路会更清晰。

## 从 Systrace 的角度来看 Choreogrepher 的工作流程

下图以滑动桌面为例子，我们先看一下从左到右滑动桌面的一个完整的预览图（App 进程），可以看到 Systrace 中从左到右，每一个绿色的帧都表示一帧，表示最终我们可以手机上看到的画面

1. 图中每一个灰色的条和白色的条宽度是一个 Vsync 的时间，也就是 16.6ms
2. 每一帧处理的流程：`接收到 Vsync 信号回调`-> `UI Thread` –> `RenderThread` –> `SurfaceFlinger`(图中未显示)
3. `UI Thread` 和 `RenderThread` 就可以完成 App 一帧的渲染，渲染完的 Buffer 抛给 SurfaceFlinger 去合成，然后我们就可以在屏幕上看到这一帧了
4. 可以看到桌面滑动的每一帧耗时都很短（Ui Thread 耗时 + RenderThread 耗时），但是由于 Vsync 的存在，每一帧都会等到 Vsync 才会去做处理

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200053537.png)

有了上面这个整体的概念，我们将 `UI Thread` 的每一帧放大来看，看看 `Choreogrepher` 的位置以及 `Choreogrepher` 是怎么组织每一帧的
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200053078.png)

## Choreographer 的工作流程

1. `Choreographer` 初始化
2. 初始化 `FrameHandler` ，绑定 `Looper`
3. 初始化 `FrameDisplayEventReceiver` ，与 `SurfaceFlinger` 建立通信用于接收和请求 Vsync
4. 初始化 `CallBackQueues`
5. `SurfaceFlinger` 的 `appEventThread` 唤醒发送 Vsync ，`Choreographer` 回调 `FrameDisplayEventReceiver.onVsync` , 进入 `Choreographer` 的主处理函数 `doFrame`
6. `Choreographer.doFrame` 计算掉帧逻辑
7. `Choreographer.doFrame` 处理 Choreographer 的第一个 `callback ： input`
8. `Choreographer.doFrame` 处理 Choreographer 的第二个 `callback ： animation`
9. `Choreographer.doFrame` 处理 Choreographer 的第三个 ` callback ：insets animation  `
10. `Choreographer.doFrame` 处理 Choreographer 的第四个 `callback ： traversal`
11. `traversal-draw` 中 UIThread 与 RenderThread 同步数据
12. `Choreographer.doFrame` 处理 Choreographer 的第五个 `callback ： commit` ?
13. RenderThread 处理绘制命令，将处理好的绘制命令发给 GPU 处理
14. 调用 `swapBuffer` 提交给 `SurfaceFlinger` 进行合成（此时 Buffer 并没有真正完成，需要等 CPU 完成后 SurfaceFlinger 才能真正使用，新版本的 Systrace 中有 gpu 的 fence 来标识这个时间）

**第一步初始化完成后，后续就会在步骤 2-9 之间循环**

这一帧所对应的 MethodTrace：
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200058925.png)

## Choreographer 源码

见 [[Choreographer编舞者]]

doFrame 时序图：

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200100302.png)

以 Systrace 的掉帧的实际情况来看掉帧的计算逻辑
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200101661.png)

这里需要注意的是，这种方法计算的掉帧，是前一帧的掉帧情况，而不是这一帧的掉帧情况，这个计算方法是有缺陷的，会导致有的掉帧没有被计算到

## APM 与 Choreographer

由于 Choreographer 的位置，许多性能监控的手段都是利用 Choreographer 来做的，除了自带的掉帧计算，Choreographer 提供的 FrameCallback 和 FrameInfo 都给 App 暴露了接口，让 App 开发者可以通过这些方法监控自身 App 的性能，其中常用的方法如下：

1. 利用 FrameCallback 的 doFrame 回调
2. 利用 FrameInfo 进行监控
   - 使用 ：adb shell dumpsys gfxinfo framestats
   - 示例 ：adb shell dumpsys gfxinfo com.meizu.flyme.launcher framestats
3. 利用 SurfaceFlinger 进行监控
   - 使用 ：adb shell dumpsys SurfaceFlinger –latency
   - 示例 ：adb shell dumpsys SurfaceFlinger –latency com.meizu.flyme.launcher/com.meizu.flyme.launcher.Launcher #0
4. 利用 SurfaceFlinger PageFlip 机制进行监控
   - 使用 ： adb service call SurfaceFlinger 1013
   - 备注：需要系统权限
5. Choreographer 自身的掉帧计算逻辑
6. BlockCanary 基于 Looper 的性能监控

### 利用 FrameCallback 的 doFrame 回调

TinyDancer 就是使用了这个方法来计算 FPS (<https://github.com/friendlyrobotnyc/TinyDancer>)

### 利用 FrameInfo 进行监控

### 利用 SurfaceFlinger 进行监控

```shell
# 使用 ：
adb shell dumpsys SurfaceFlinger –latency
# 示例 ：
adb shell dumpsys SurfaceFlinger –latency com.meizu.flyme.launcher/com.meizu.flyme.launcher.Launcher #0
```

命令解释：

1. 数据的单位是纳秒，时间是以开机时间为起始点
2. 每一次的命令都会得到128行的帧相关的数据

数据：

1. 第一行数据，表示刷新的时间间隔refresh_period
2. 第1列：这一部分的数据表示应用程序绘制图像的时间点
3. 第2列：在SF(软件)将帧提交给H/W(硬件)绘制之前的垂直同步时间，也就是每帧绘制完提交到硬件的时间戳，该列就是垂直同步的时间戳
4. 第3列：在SF将帧提交给H/W的时间点，算是H/W接受完SF发来数据的时间点，绘制完成的时间点。

**掉帧 jank 计算**

每一行都可以通过下面的公式得到一个值，该值是一个标准，我们称为`jankflag`，如果当前行的jankflag与上一行的jankflag发生改变，那么就叫掉帧

```shell
ceil((C - A) / refresh-period)
```

### 利用 SurfaceFlinger PageFlip 机制进行监控

```java
Parcel data = Parcel.obtain();
Parcel reply = Parcel.obtain();
                data.writeInterfaceToken("android.ui.ISurfaceComposer");
mFlinger.transact(1013, data, reply, 0);
final int pageFlipCount = reply.readInt();

final long now = System.nanoTime();
final int frames = pageFlipCount - mLastPageFlipCount;
final long duration = now - mLastUpdateTime;
mFps = (float) (frames * 1e9 / duration);
mLastPageFlipCount = pageFlipCount;
mLastUpdateTime = now;
reply.recycle();
data.recycle();
```

### Choreographer 自身的掉帧计算逻辑

`SKIPPED_FRAME_WARNING_LIMIT` 默认为30 , 由 `debug.choreographer.skipwarning` 这个属性控制

```java
if (jitterNanos >= mFrameIntervalNanos) {
    final long skippedFrames = jitterNanos / mFrameIntervalNanos;
    if (skippedFrames >= SKIPPED_FRAME_WARNING_LIMIT) {
        Log.i(TAG, "Skipped " + skippedFrames + " frames!  "
                + "The application may be doing too much work on its main thread.");
    }
}
```

### BlockCanary

Blockcanary 做性能监控使用的是 Looper 的消息机制，通过对 MessageQueue 中每一个 Message 的前后进行记录，打到监控性能的目的

## 厂商优化

系统厂商由于可以直接修改源码，也利用这方面的便利，做一些功能和优化，不过由于保密的问题

- [Android 基于 Choreographer 的渲染机制详解 · Android Performance](https://androidperformance.com/2019/10/22/Android-Choreographer/#/%E5%8E%82%E5%95%86%E4%BC%98%E5%8C%96)

# Vsync

## Vsync 概述

`Vsync` 信号可以由硬件产生，也可以用软件模拟，不过现在基本上都是硬件产生，负责产生硬件 Vsync 的是 `HWC`,HWC 可生成 VSYNC 事件并通过回调将事件发送到 `SurfaceFlinger` , `DispSync` 将 `Vsync` 生成由 `Choreographer` 和 `SurfaceFlinger` 使用的 `VSYNC_APP` 和 `VSYNC_SF` 信号。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406192331430.png)

> 在 [Android 基于 Choreographer 的渲染机制详解](https://www.androidperformance.com/2019/10/22/Android-Choreographer/) 这篇文章里面，我们有提到 ：Choreographer 的引入，主要是配合 Vsync，给上层 App 的渲染提供一个稳定的 Message 处理的时机，也就是 Vsync 到来的时候，系统通过对 Vsync 信号周期的调整，来控制每一帧绘制操作的时机. 目前大部分手机都是 60Hz 的刷新率，也就是 16.6ms 刷新一次，系统为了配合屏幕的刷新频率，将 Vsync 的周期也设置为 16.6 ms，每个 16.6 ms，Vsync 信号唤醒 Choreographer 来做 App 的绘制操作，这就是引入 Choreographer 的主要作用。

渲染层(App)与 Vsync 打交道的是 `Choreographer`，而合成层与 Vsync 打交道的，则是 `SurfaceFlinger`。`SurfaceFlinger` 也会在 Vsync 到来的时候，将所有已经准备好的 Surface 进行合成操作。

下图显示在 `Systrace` 中，`SurfaceFlinger` 进程中的 `VSYNC_APP` 和 `VSYNC_SF` 的情况
![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406192340938.png)

## Android 图形数据流向

App 绘制到屏幕显示，分为下面几个阶段：

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406192341898.png)

1. 第一阶段：App 在收到`  Vsync-App ` 的时候，在主线程进行 `measure`、`layout`、`draw`(构建 `DisplayList` , 里面包含 OpenGL 渲染需要的命令及数据) 。这里对应的 Systrace 中的主线程 **doFrame** 操作
2. 第二阶段：CPU 将数据上传（共享或者拷贝）给 GPU,　这里 ARM 设备 内存一般是 GPU 和 CPU 共享内存。这里对应的 Systrace 中的渲染线程的 **flush drawing commands** 操作
3. 第三阶段：通知 GPU 渲染，真机一般不会阻塞等待 GPU 渲染结束，CPU 通知结束后就返回继续执行其他任务，使用 Fence 机制辅助 GPU CPU 进行同步操作
4. 第四 阶段：`swapBuffers`，并通知 `SurfaceFlinger` 图层合成。这里对应的 Systrace 中的渲染线程的 **eglSwapBuffersWithDamageKHR** 操作
5. 第五阶段：SurfaceFlinger 开始合成图层，如果之前提交的 GPU 渲染任务没结束，则等待 GPU 渲染完成，再合成（Fence 机制），合成依然是依赖 GPU，不过这就是下一个任务了.这里对应的 Systrace 中的 SurfaceFlinger 主线程的 onMessageReceived 操作（包括 handleTransaction、handleMessageInvalidate、handleMessageRefresh）SurfaceFlinger 在合成的时候，会将一些合成工作委托给 Hardware Composer,从而降低来自 OpenGL 和 GPU 的负载，只有 Hardware Composer 无法处理的图层，或者指定用 OpenGL 处理的图层，其他的 图层偶会使用 Hardware Composer 进行合成
6. 第六阶段 ：最终合成好的数据放到屏幕对应的 Frame Buffer 中，固定刷新的时候就可以看到了

下面这张图也是官方的一张图，结合上面的阶段，从左到右看，可以看到一帧的数据是如何在各个进程之间流动的
![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406192345623.png)

## Systrace 中的图像数据流

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406192345098.png)
上图中主要包含 `SurfaceFlinger`、`App` 和 `hwc` 三个进程，下面就来结合图中的标号，来进一步说明数据的流向

1. 第一个 `Vsync` 信号到来, `SurfaceFlinger` 和 `App` 同时收到 Vsync 信号
2. `SurfaceFlinger` 收到 `Vsync-sf` 信号，开始进行 `App` 上一帧的 Buffer 的合成
3. `App` 收到 `Vsycn-app` 信号，开始进行这一帧的 `Buffer` 的渲染(对应上面的第一、二、三、四阶段)
4. 第二个 Vsync 信号到来 ，`SurfaceFlinger` 和 `App` 同时收到 Vsync 信号，`SurfaceFlinger` 获取 App 在第二步里面渲染的 `Buffer`，开始合成（对应上面的第五阶段），`App` 收到 `Vsycn-app` 信号，开始新一帧的 `Buffer` 的渲染(对应上面的第一、二、三、四阶段)

## Vsync Offset

`Vsync` 信号可以由硬件产生，也可以用软件模拟，不过现在基本上都是硬件产生，负责产生硬件 `Vsync` 的是 `HWC`, `HWC` 可生成 `VSYNC` 事件并通过回调将事件发送到 `SurfaceFlinger` , `DispSync` 将 Vsync 生成由 `Choreographer` 和 `SurfaceFlinger` 使用的 `VSYNC_APP` 和 `VSYNC_SF` 信号.

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200011530.png)
其中 `app` 和 `sf` 相对 `hw_vsync_0` 都有一个偏移,即 `phase-app` 和 `phase-sf`，如下图
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200012400.png)
**Vsync Offset 我们指的是 VSYNC_APP 和 VSYNC_SF 之间有一个 Offset，即上图中 phase-sf - phase-app 的值**，这个 `Offset` 是厂商可以配置的。如果 `Offset` 不为 0，那么意味着 **App 和 SurfaceFlinger 主进程不是同时收到 Vsync 信号，而是间隔 Offset (通常在 0 - 16.6ms 之间)**

目前大部分厂商都没有配置这个 `Offset`，所以 `App` 和 `SurfaceFlinger` 是同时收到 `Vsync` 信号的.

可以通过 Dumpsys SurfaceFlinger 来查看对应的值：

**Offset 为 0**：（`sf phase - app phase = 0`)

```shell
Sync configuration: [using: EGL_ANDROID_native_fence_sync EGL_KHR_wait_sync]
DispSync configuration: 
          app phase 1000000 ns,              sf phase 1000000 ns 
    early app phase 1000000 ns,        early sf phase 1000000 ns 
 early app gl phase 1000000 ns,     early sf gl phase 1000000 ns 
     present offset 0 ns
```

**Offset 不为 0** (`sf phase - app phase = 4 ms`)

```shell
Sync configuration: [using: EGL_ANDROID_native_fence_sync EGL_KHR_wait_sync]

VSYNC configuration:
         app phase:   2000000 ns	         SF phase:   6000000 ns
   early app phase:   2000000 ns	   early SF phase:   6000000 ns
GL early app phase:   2000000 ns	GL early SF phase:   6000000 ns
    present offset:         0 ns	     VSYNC period:  16666666 ns
```

Offset 在 Systrace 中的表现

### Offset 为 0

Offset 为 0 的情况， 此时 App 和 SurfaceFlinger 是同时收到 Vsync 信号 ， 其对应的 Systrace 图如下：
![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200016235.png)

App 渲染好的 Buffer，要等到下一个 `Vsync-SF` 来的时候才会被 `SurfaceFlinger` 拿去做合成，这个时间大概在 16.6 ms。这时候大家可能会想，**如果 App 的 Buffer 渲染结束，Swap 到 BufferQueue 中 ，就触发 SurfaceFlinger 去做合成，那岂不是省了一些时间(0-16.6ms )**?

答案是可行的，这也就引入了 Offset 机制，在这种情况下，App 先收到 Vsync 信号，进行一帧的渲染工作，然后过了 Offset 时间后，SurfaceFlinger 才收到 Vsync 信号开始合成，这时候如果 App 的 Buffer 已经 Ready 了，那么 SurfaceFlinger 这一次合成就可以包含 App 这一帧，用户也会早一点看到。

### Offset 不为 0

一个Offset 为 4ms 的案例，App 收到 Vsync 4 ms 之后，`SurfaceFlinger` 才收到 Vsync 信号

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200018878.png)

### Offset 的优缺点

Offset 的一个比较难以确定的点就在于 Offset 的时间该如何设置，这也是众多厂商默认都不进行配置 Offset 的一个原因，其优缺点是动态的，与机型的性能和使用场景有很大的关系

1. 如果 Offset 配置过短，那么可能 `App` 收到 `Vsync-App` 后还没有渲染完成，`SurfaceFlinger` 就收到 `Vsync-SF` 开始合成，那么此时如果 App 的 BufferQueue 中没有之前累积的 Buffer，那么 `SurfaceFlinger` 这次合成就不会有 App 的东西在里面，需要等到下一个 `Vsync-SF` 才能合成这次 App 的内容，时间相当于变成了 Vsync 周期+Offset，而不是我们期待的 Offset
2. 如果 Offset 配置过长，就起不到作用了

## HW_Vsync

不是每次申请 `Vsync` 都会由硬件产生 `Vsync`，只有此次请求 `vsync` 的时间距离上次合成时间大于 500ms，才会通知 hwc，请求 `HW_VSYNC`。

以桌面滑动为例，看 `SurfaceFlinger` 的进程 Trace 可以看到 `HW_VSYNC` 的状态：
![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200025599.png)

后续 App 申请 Vsync 时候，会有两种情况，一种是有 HW_VSYNC 的情况，一种是没有有 HW_VSYNC 的情况

### 不使用HW_VSYNC

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200026055.png)

### 使用 HW_VSYNC

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406200026236.png)
HW_VSYNC 主要是利用最近的硬件 VSYNC 来做预测,最少要 3 个,最多是 32 个,实际上要用几个则不一定, DispSync 拿到 6 个 VSYNC 后就会计算出 SW_VSYNC,只要收到的 Present Fence 没有超过误差,硬件 VSYNC 就会关掉,不然会继续接收硬件 VSYNC 计算 SW_VSYNC 的值,直到误差小于 threshold.关于这一块的计算具体过程，可以参考这篇文章：[深入研究源码：DispSync详解 - 掘金](https://juejin.cn/post/6844903986194022414#heading-20)，关于这一块的流程大家也可以参考这篇文章，里面有更细节的内容，这里摘录了他的结论

> SurfaceFlinger 通过实现了 HWC2::ComposerCallback 接口，当 HW-VSYNC 到来的时候，SurfaceFlinger 将会收到回调并且发给 DispSync。DispSync 将会把这些 HW-VSYNC 的时间戳记录下来，当累计了足够的 HW-VSYNC 以后（目前是大于等于 6 个），就开始计算 SW-VSYNC 的偏移 mPeriod。计算出来的 mPeriod 将会用于 DispSyncThread 用来模拟 HW-VSYNC 的周期性起来并且通知对 VSYNC 感兴趣的 Listener，这些 Listener 包括 SurfaceFlinger 和所有需要渲染画面的 app。这些 Listener 通过 EventThread 以 Connection 的抽象形式注册到 EventThread。DispSyncThread 与 EventThread 通过 DispSyncSource 作为中间人进行连接。EventThread 在收到 SW-VSYNC 以后将会把通知所有感兴趣的 Connection，然后 SurfaceFlinger 开始合成，app 开始画帧。在收到足够多的 HW-VSYNC 并且在误差允许的范围内，将会关闭通过 EventControlThread 关闭 HW-VSYNC。

# Ref

- [Android Systrace 基础知识 - Vsync 解读 · Android Performance](https://www.androidperformance.com/2019/12/01/Android-Systrace-Vsync/)
- [Android 基于 Choreographer 的渲染机制详解 · Android Performance](https://androidperformance.com/2019/10/22/Android-Choreographer/)
