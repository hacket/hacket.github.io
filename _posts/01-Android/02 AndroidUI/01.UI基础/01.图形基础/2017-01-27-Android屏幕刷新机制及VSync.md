---
date_created: Monday, January 27th 2017, 7:36:31 pm
date_updated: Sunday, February 2nd 2025, 12:17:49 am
title: Android屏幕刷新机制及VSync
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
image-auto-upload: true
feed: show
format: list
aliases: [Android 屏幕刷新机制]
linter-yaml-title-alias: Android 屏幕刷新机制
---

# Android 屏幕刷新机制

## VSync

Android 在 " 黄油计划 " 中引入的一个重要机制就是：vsync，为了增强界面流畅度。引入 vsync 本质上是要协调 app 生成 UI 数据和 SurfaceFlinger 合成图像，App 是数据的生产者，surfaceflinger 是数据的消费者，vsync 引入避免 Tearing 现象。<br />vsync 信号有两个消费者，一个是 app，一个是 surfaceflinger，这两个消费者并不是同时接收 vsync，而是他们之间有个 offset。

### Vsync 简介

一个典型的显示器有两个重要特性，**行频**和**场频**。`行频(Horizontal ScanningFrequency)` 又称为 " 水平扫描频率 "，是屏幕每秒钟从左至右扫描的次数; `场频(Vertical Scanning Frequency)` 也称为 " 垂直扫描频率 "，是每秒钟整个屏幕刷新的次数。由此也可以得出它们的关系：`行频=场频*纵坐标分辨率`。

屏幕的刷新过程是每一行从左到右（行刷新，水平刷新，Horizontal Scanning），从上到下（屏幕刷新，垂直刷新，Vertical Scanning）。当整个屏幕刷新完毕，即一个垂直刷新周期完成。当扫描完一个屏幕后，设备需要重新回到第一行以进入下一次的循环，此时有一段时间空隙，称为 `Vertical Blanking Interval(VBI)`。

#### VSync 引入的目的

为了解决何时交换 Frame Buffer 和 Back Buffer 缓冲区这个问题，这里就引入了 VSync，每当系统发出一个 VYsnc 信号时，就立马交换两个缓冲区。VYsnc 的信号间隔是 1 秒/FPS, FPS(Frames per Seconds) 即频率。大部分 Android 设备的刷新频率都是 60Hz，这也就意味着没一帧最多留给系统 16ms（1000/60）的准备时间。

VSync(垂直同步) 是 `Vertical Synchronization` 的简写，它利用 VBI 时期出现的 vertical syncpulse（垂直同步脉冲）来保证双缓冲在最佳时间点才进行交换。另外，交换是指各自的内存地址，可以认为该操作是瞬间完成。

所以说 V-sync 这个概念并不是 Google 首创的，它在早些年前的 PC 机领域就已经出现了。不过 Android 4.1 给它赋予了新的功用。

在 Android 4.1(JB) 中已经开始引入 VSync 机制，用来同步渲染，让 AppUI 和 SurfaceFlinger 可以按硬件产生的 Vsync 节奏进行工作。

#### HWComposwer

以前的 Android 系统中 SurfaceFlinger 是在 `System_Server` 进程中的，但是自从 Android4.x 开始 SurfaceFlinger 已经开始作为一个独立的进程存在，具体的进程入口在 `Main_surfaceflinger.cpp` 文件的 main 函数中

- HWComposwer 负责系统 HWC 硬件的启动，以及最原始的 VSync 信号的捕获；
- DispSync、DispSyncThread<br />SF 将捕获到的信号封装在 DispSync 里面（VSync 信号源），DispSync 通过内置的线程进行分发；
- DispSyncSource、EventThread、Connection SF 创建的分支信号源 (Android 创建了两个分支 EventThread 线程)，都是从 DispSync（VSync 信号源）里面分流出来的（DispSync 将同步信号分发给 DispSyncSource，DispSyncSource 转发给 EventThread，总体认为是一次分发），EventThread 收到同步信号后分别负责将同步信号进行二次分发；

#### vsync 相关线程

1. EventControlThread: 控制硬件 vsync 的开关
2. DispSyncThread: 软件产生 vsync 的线程，接收 HWComposer HAL 的 VSYNC 信号，并分发给 EventThread
3. SF EventThread: 该线程用于 SurfaceFlinger 接收 vsync 信号用于渲染
4. App EventThread: 该线程用于接收 vsync 信号并且上报给 App 进程，App 开始画图

![l1yrk](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025369.png)<br />

> HW vsync, 真实由硬件产生的 vsync 信号；
>
> SW vsync, 由 DispSync 产生的 vsync 信号；
>
> vsync-sf, SF 接收到的 vsync 信号；
>
> vsync-app, App 接收到的 vsync 信号

#### VSync 是如何产生的？

Vsync 信号的产生有两种来源，一种是硬件，一种是软件模拟，因为目前基本都是硬件产生的。硬件源就是 HWComposer，它属于 HAL，硬件抽象层的类，主要就是把硬件 Vsync 信号传递到上层来。

HWComposer HAL 通过 callback 函数，把 VSYNC 信号传给 DispSyncThread，DispSyncThread 传给 EventThread

![iyl6h](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025370.png)

#### vsync-offset 引入原因

上面提到 hw vsync 信号在目前的 Android 系统中有两个 receiver，App + SurfaceFlinger。

hw(hardware) sync 会转化为 sw(software) sync 分别分发给 app 和 sf，分别称为 vsync-app 和 vsync-sf。<br />app 和 sf 接收 vsync 会有一个 offset，引入这个机制的原因是提升 " 跟手性 "，也就是降低输入响应延。<br />![fh3w7](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025371.png)

<br />如果 app 和 sf 同时接收 hw sync，从上面可以看到需要经过 vsync * 2 的时间画面才能显示到屏幕，如果合理的规划 app 和 sf 接收 vsync 的时机，想像一下，如果 vsync-sf 比 vsync-app 延迟一定时间，如果这个时间安排合理达到如下效果就能降低延迟：<br />

![svxsw](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025372.png)

#### Vsync 接收

SurfaceFlinger 进程收到 Vsync 信号后，转发给请求过的应用，应用的 socket 接收到 Vsync，调用

```
DisplayEventReceiver#dispatchVsync->
FrameDisplayEventReceiver#onVsync->run->
Choreographer#doFrame->doCallbacks(Choreographer.CALLBACK_TRAVERSAL, frameTimeNanos)->这里各种time
```

#### VSync 请求

Vsync 信号原则就是 App 和 SurfaceFlinger 按需请求，按请求分发

SurfaceFlinger 进程收到 Vsync，转发到有画图请求的客户 App,所以说对一个 app 来说，Vsync 并不是 16.67ms 来一次的，得有需求才会来。如果一个应用没有请求 VSyn 事件，Aurfaceflinger 不会给这个应用发 VSync 事件，那么应用的画图代码永远也不会调用。所以应用必须向 Surfaceflinger 请求 VSync。

App 的注册和回调都是通过 `Choreographer`，它主要负责 inpSt 、animation 和 traversals。

### 屏幕刷新演变

#### 4.1 之前 Double Buffer Drawing without VSync （未根据 vsync 来写到 buffer）

4.1 之前 Android 绘制图形的一个 case，使用了双缓冲<br />![6xalb](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025373.png)

> 说明：Display 理解为屏幕，以固定的频率 16.6ms 发出 VSync 信号，Display 黄色的这一行里有一些数字：0, 1, 2, 3, 4 理解成一帧；CPU 蓝色代表 App 绘制当前 View 树的时间，CPU 里的数字和 Display 的数字对应的，如 0 帧，CPU 计算的是第一帧的数据，也就是说，在当前帧内，CPU 是在计算下一帧的屏幕画面数据，当屏幕刷新信号到的时候，屏幕就去将 CPU 计算的屏幕画面数据显示出来；同时 CPU 也接收到屏幕刷新信号，所以也开始去计算下一帧的屏幕画面数据；

以时间的顺序来看下将会发生的异常：

1. Display 显示第 0 帧数据，此时 CPU 和 GPU 渲染第 1 帧画面，且在 Display 显示下一帧前完成
2. 因为渲染及时，Display 在第 0 帧显示完成后，也就是第 1 个 VSync 后，缓存进行交换，然后正常显示第 1 帧
3. 接着第 2 帧开始处理，是直到第 2 个 VSync 快来前才开始处理的。
4. 第 2 个 VSync 来时，由于第 2 帧数据还没有准备就绪，缓存没有交换，显示的还是第 1 帧。这种情况被 Android 开发组命名为 "Jank"，即发生了丢帧。
5. 当第 2 帧数据准备完成后，它并不会马上被显示，而是要等待下一个 VSync 进行缓存交换再显示。

双缓存的交换 是在 Vsyn 到来时进行，交换后屏幕会取 Frame buffer 内的新数据，而实际 此时的 Back buffer 就可以供 GPU 准备下一帧数据了。 如果 Vsyn 到来时  CPU/GPU 就开始操作的话，是有完整的 16.6ms 的，这样应该会基本避免 jank 的出现了（除非 CPU/GPU 计算超过了 16.6ms）。

> 所以总的来说，就是屏幕平白无故地多显示了一次第 1 帧。原因大家应该都看到了，就是 CPU 没有及时地开始着手处理第 2 帧的渲染工作，以致 " 延误军机 "。 Android 在 4.1 之前一直存在这个问题。

#### 4.1 后 Double Buffer Drawing with VSync CPU/GPU 根据 VSYNC 信号同步处理数据

为了优化显示性能，Android 4.1 版本对 Android Display 系统进行了重构，实现了 `Project Butter`，引入了三个核心元素，即 `VSYNC`、`Triple Buffer` 和 `Choreographer`。

为了优化显示性能，Google 在 Android 4.1 系统中对 Android Display 系统进行了重构，实现了 `Project Butter`（黄油工程）：系统在收到 VSync pulse 后，将马上开始下一帧的渲染。即一旦收到 VSync 通知（16ms 触发一次），CPU 和 GPU 才立刻开始计算然后把数据写入 buffer。在 Android4.1 之前，CPU 和 GPU 的写 buffer 时机是比较随意的。<br />![vbjnt](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025374.png)<br />CPU/GPU 根据 VSYNC 信号同步处理数据，可以让 CPU/GPU 有完整的 16ms 时间来处理数据，减少了 jank。假如 CPU/GPU 的 FPS(FramesPer Second) 高于这个值，那么这个方案是完美的，显示效果将很好。

> VSync 同步使得 CPU/GPU 充分利用了 16.6ms 时间，减少 jank。

- 问题又来了，如果界面比较复杂，CPU/GPU 的处理时间较长 超过了 16.6ms 呢？如下图：
![3ttjq](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025375.png)

```
1 在第二个时间段内，但却因 GPU 还在处理 B 帧，缓存没能交换，导致 A 帧被重复显示。
2 而B完成后，又因为缺乏VSync pulse信号，它只能等待下一个signal的来临。于是在这一过程中，有一大段时间是被浪费的。
3. 当下一个VSync出现时，CPU/GPU马上执行操作（A帧），且缓存交换，相应的显示屏对应的就是B。这时看起来就是正常的。只不过由于执行时间仍然超过16ms，导致下一次应该执行的缓冲区交换又被推迟了——如此循环反复，便出现了越来越多的“Jank”。
```

- 为什么 CPU 不能在第二个 16ms 处理绘制工作呢？<br />原因是只有两个 buffer，Back buffer 正在被 GPU 用来处理 B 帧的数据， Frame buffer 的内容用于 Display 的显示，这样两个 buffer 都被占用，CPU 则无法准备下一帧的数据。 那么，如果再提供一个 buffer，CPU、GPU 和显示设备都能使用各自的 buffer 工作，互不影响。

#### 三级缓存 Triple Buffer

三缓存就是在双缓冲机制基础上增加了一个 `Graphic Buffer` 缓冲区，这样可以最大限度的利用空闲时间，带来的坏处是多使用的一个 Graphic Buffer 所占用的内存。<br />![20s93](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025376.png)

1. 第一个 Jank，是不可避免的。但是在第二个 16ms 时间段，CPU/GPU 使用 第三个 Buffer 完成 C 帧的计算，虽然还是会多显示一次 A 帧，但后续显示就比较顺畅了，有效避免 Jank 的进一步加剧。
2. 注意在第 3 段中，A 帧的计算已完成，但是在第 4 个 vsync 来的时候才显示，如果是双缓冲，那在第三个 VSync 就可以显示了。

**三缓冲作用：**<br />简单的说在 2 个缓存区被 GPU 和 display 占据的时候，开辟一个缓冲区给 CPU 用，一般来说都是用双缓冲，需要的时候会开启 3 缓冲，三缓冲的好处就是使得动画更为流程，但是会导致 lag，从用户体验来说，就是点击下去到呈现效果会有延迟。所以默认不开三缓冲，只有在需要的时候自动开启

> 三缓冲有效利用了等待 VSync 的时间，减少了 jank，但是带来了 lag 延迟

## Choreographer 编舞者

见 `Choreographer编舞者` 章节

## 屏幕刷新机制

在一个典型的显示系统中，一般包括 CPU、GPU、display 三个部分， CPU 负责计算数据，把计算好数据交给 GPU,GPU 会对图形数据进行渲染，渲染好后放到 buffer 里存起来，然后 display（有的文章也叫屏幕或者显示器）负责把 buffer 里的数据呈现到屏幕上。

显示过程，简单的说就是 CPU/GPU 准备好数据，存入 buffer，display 每隔一段时间去 buffer 里取数据，然后显示出来。display 读取的频率是固定的，比如每个 16ms 读一次，但是 CPU/GPU 写数据是完全无规律的。

> 屏幕的刷新包括三个步骤：CPU 计算屏幕数据、GPU 进一步处理和缓存、最后 display 再将缓存中（buffer）的屏幕数据显示出来。

CPU 计算屏幕数据： View 树的绘制过程，也就是 Activity 对应的视图树从根布局 DecorView 开始层层遍历每个 View，分别执行测量、布局、绘制三个操作的过程。<br />![eqscf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261025377.png)

- 第 0VSync，CPU/GPU 计算第 1 帧的数据存到 Back/Frame Buffer，Display 展示第 0 帧数据
- 第 1VSync，CPU/GPU 计算第 2 帧的数据存到 Back/Frame Buffer，Display 从 Frame Buffer 取出第 1 帧数据展示
- 第 2VSync，CPU/GPU 计算第 3 帧的数据存到 Back/Frame Buffer，Display 从 Frame Buffer 取出第 2 帧数据展示
- 第 3VSync，CPU/GPU 计算第 4 帧的数据存到 Back/Frame Buffer，Display 从 Frame Buffer 取出第 3 帧数据展示
- 第 4VSync，Display 从 Frame Buffer 取出第 4 帧数据展示，App 不需要刷新界面了，App 不会再接收到 VSync 信号，也就不会再让 CPU 去绘制视图树来计算下一帧画面了
- 第 5 及 +VSync，Display 一直展示第 4 帧的数据，VSync 还是会继续发出，只是我们的 App 不再请求接收了

## Ref

- [x] 史上最全 Android 渲染机制讲解（长文源码深度剖析）

> 天猫精灵技术 <https://mp.weixin.qq.com/s/0OOSmrzSkjG3cSOFxWYWuQ>

- [x] SurfaceFlinger(2/3) 处理 Vsync 信号 <https://zhuanlan.zhihu.com/p/123968421>
