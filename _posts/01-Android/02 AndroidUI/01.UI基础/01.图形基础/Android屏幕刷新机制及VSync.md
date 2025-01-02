---
date created: 2024-06-06 00:24
date updated: 2024-12-24 00:27
dg-publish: true
---

# Android屏幕刷新机制

## VSync

Android在“黄油计划”中引入的一个重要机制就是：vsync，为了增强界面流畅度。引入vsync本质上是要协调app生成UI数据和SurfaceFlinger合成图像，App是数据的生产者，surfaceflinger是数据的消费者，vsync引入避免Tearing现象。<br />vsync信号有两个消费者，一个是app，一个是surfaceflinger，这两个消费者并不是同时接收vsync，而是他们之间有个offset。

### Vsync简介

一个典型的显示器有两个重要特性，**行频**和**场频**。`行频(Horizontal ScanningFrequency)`又称为“水平扫描频率”，是屏幕每秒钟从左至右扫描的次数; `场频(Vertical Scanning Frequency)`也称为“垂直扫描频率”，是每秒钟整个屏幕刷新的次数。由此也可以得出它们的关系：`行频=场频*纵坐标分辨率`。

屏幕的刷新过程是每一行从左到右（行刷新，水平刷新，Horizontal Scanning），从上到下（屏幕刷新，垂直刷新，Vertical Scanning）。当整个屏幕刷新完毕，即一个垂直刷新周期完成。当扫描完一个屏幕后，设备需要重新回到第一行以进入下一次的循环，此时有一段时间空隙，称为`Vertical Blanking Interval(VBI)`。

#### VSync引入的目的

为了解决何时交换Frame Buffer和Back Buffer缓冲区这个问题，这里就引入了VSync，每当系统发出一个VYsnc信号时，就立马交换两个缓冲区。VYsnc的信号间隔是 1秒/FPS, FPS(Frames per Seconds)即频率。大部分Android设备的刷新频率都是60Hz，这也就意味着没一帧最多留给系统16ms（1000/60）的准备时间。

VSync(垂直同步)是`Vertical Synchronization`的简写，它利用VBI时期出现的vertical syncpulse（垂直同步脉冲）来保证双缓冲在最佳时间点才进行交换。另外，交换是指各自的内存地址，可以认为该操作是瞬间完成。

所以说V-sync这个概念并不是Google首创的，它在早些年前的PC机领域就已经出现了。不过Android 4.1给它赋予了新的功用。

在Android 4.1(JB)中已经开始引入VSync机制，用来同步渲染，让AppUI和SurfaceFlinger可以按硬件产生的Vsync节奏进行工作。

#### HWComposwer

以前的Android系统中SurfaceFlinger是在`System_Server`进程中的，但是自从Android4.x开始SurfaceFlinger已经开始作为一个独立的进程存在，具体的进程入口在`Main_surfaceflinger.cpp`文件的main函数中

- HWComposwer 负责系统HWC硬件的启动，以及最原始的VSync信号的捕获；
- DispSync、DispSyncThread<br />SF将捕获到的信号封装在DispSync里面（VSync信号源），DispSync通过内置的线程进行分发；
- DispSyncSource、EventThread、Connection SF创建的分支信号源(Android创建了两个分支EventThread线程)，都是从DispSync（VSync信号源）里面分流出来的（DispSync将同步信号分发给DispSyncSource，DispSyncSource转发给EventThread，总体认为是一次分发），EventThread收到同步信号后分别负责将同步信号进行二次分发；

#### vsync相关线程

1. EventControlThread: 控制硬件vsync的开关
2. DispSyncThread: 软件产生vsync的线程，接收HWComposer HAL的VSYNC信号，并分发给EventThread
3. SF EventThread: 该线程用于SurfaceFlinger接收vsync信号用于渲染
4. App EventThread: 该线程用于接收vsync信号并且上报给App进程，App开始画图

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141268396-bb7c7d2e-11df-4ea2-a312-4fb7276961f2.png#averageHue=%23d3decc&clientId=u61790920-d3fa-4&from=paste&id=ud8db1ee0&originHeight=239&originWidth=582&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u892957f3-af2d-4706-ba88-c54acb9addc&title=)<br />![](https://note.youdao.com/yws/res/105224/92D3E3377D894B4D8F80D628FBA37847#id=bEaUF&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> HW vsync, 真实由硬件产生的vsync信号；
>
> SW vsync, 由DispSync产生的vsync信号；
>
> vsync-sf, SF接收到的vsync信号；
>
> vsync-app, App接收到的vsync信号

#### VSync是如何产生的？

Vsync信号的产生有两种来源，一种是硬件，一种是软件模拟，因为目前基本都是硬件产生的。硬件源就是HWComposer，它属于HAL，硬件抽象层的类，主要就是把硬件Vsync信号传递到上层来。

HWComposer HAL通过callback函数，把VSYNC信号传给DispSyncThread，DispSyncThread传给EventThread

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141303446-271ab223-9465-4a5d-9025-90d36aecf3d5.png#averageHue=%23f6f7f1&clientId=u61790920-d3fa-4&from=paste&id=ua0adf9ed&originHeight=1080&originWidth=1920&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=202980&status=done&style=none&taskId=ua10f7348-80d5-41c3-b961-7a16df61add&title=)

#### vsync-offset引入原因

上面提到hw vsync信号在目前的Android系统中有两个receiver，App + SurfaceFlinger。

hw(hardware) sync会转化为sw(software) sync分别分发给app和sf，分别称为vsync-app和vsync-sf。<br />app和sf接收vsync会有一个offset，引入这个机制的原因是提升“跟手性”，也就是降低输入响应延。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141316866-aafb1d57-8a0a-4247-8c69-79ad28ac4ddf.png#averageHue=%23e8e8e8&clientId=u61790920-d3fa-4&from=paste&id=u7c530772&originHeight=41&originWidth=321&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u337bca01-f7b3-4139-9e48-9c764ef5955&title=)<br />![](https://note.youdao.com/yws/res/100189/63E1CAA7BFD945FBADC874F553BEFB2A#id=NNKXb&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />如果app和sf同时接收hw sync，从上面可以看到需要经过vsync * 2的时间画面才能显示到屏幕，如果合理的规划app和sf接收vsync的时机，想像一下，如果vsync-sf比vsync-app延迟一定时间，如果这个时间安排合理达到如下效果就能降低延迟：<br />![](https://note.youdao.com/yws/res/100188/F132DBAC754944CDB129B4284C81F076#id=lRD9y&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141323890-3b6162fd-29d3-429e-bb28-7f31aa5d8bba.png#averageHue=%23f7f7f7&clientId=u61790920-d3fa-4&from=paste&id=u0cefea57&originHeight=272&originWidth=251&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ucade00a3-f449-4269-bd33-bbaf3676853&title=)

#### Vsync接收

SurfaceFlinger进程收到Vsync信号后，转发给请求过的应用，应用的socket接收到Vsync，调用

```
DisplayEventReceiver#dispatchVsync->
FrameDisplayEventReceiver#onVsync->run->
Choreographer#doFrame->doCallbacks(Choreographer.CALLBACK_TRAVERSAL, frameTimeNanos)->这里各种time
```

#### VSync请求

Vsync信号原则就是App和SurfaceFlinger按需请求，按请求分发

SurfaceFlinger进程收到Vsync，转发到有画图请求的客户App,所以说对一个app来说，Vsync并不是16.67ms来一次的，得有需求才会来。如果一个应用没有请求VSyn事件，Aurfaceflinger不会给这个应用发VSync事件，那么应用的画图代码永远也不会调用。所以应用必须向Surfaceflinger请求VSync。

App的注册和回调都是通过`Choreographer`，它主要负责inpSt 、animation和traversals。

### 屏幕刷新演变

#### 4.1之前 Double Buffer Drawing without VSync （未根据vsync来写到buffer）

4.1之前Android绘制图形的一个case，使用了双缓冲<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141334174-59277a68-5e63-463f-a48f-50abfae77d5f.png#averageHue=%23f8f6ef&clientId=u61790920-d3fa-4&from=paste&id=u8e51f1c8&originHeight=1274&originWidth=2278&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u82343ae6-3df7-41e9-a827-6e1aac720d0&title=)

> 说明：Display理解为屏幕，以固定的频率16.6ms发出 VSync 信号，Display 黄色的这一行里有一些数字：0, 1, 2, 3, 4理解成一帧；CPU蓝色代表App绘制当前View树的时间，CPU里的数字和Display的数字对应的，如0帧，CPU计算的是第一帧的数据，也就是说，在当前帧内，CPU 是在计算下一帧的屏幕画面数据，当屏幕刷新信号到的时候，屏幕就去将 CPU 计算的屏幕画面数据显示出来；同时 CPU 也接收到屏幕刷新信号，所以也开始去计算下一帧的屏幕画面数据；

以时间的顺序来看下将会发生的异常：

1. Display显示第0帧数据，此时CPU和GPU渲染第1帧画面，且在Display显示下一帧前完成
2. 因为渲染及时，Display在第0帧显示完成后，也就是第1个VSync后，缓存进行交换，然后正常显示第1帧
3. 接着第2帧开始处理，是直到第2个VSync快来前才开始处理的。
4. 第2个VSync来时，由于第2帧数据还没有准备就绪，缓存没有交换，显示的还是第1帧。这种情况被Android开发组命名为“Jank”，即发生了丢帧。
5. 当第2帧数据准备完成后，它并不会马上被显示，而是要等待下一个VSync 进行缓存交换再显示。

双缓存的交换 是在Vsyn到来时进行，交换后屏幕会取Frame buffer内的新数据，而实际 此时的Back buffer 就可以供GPU准备下一帧数据了。 如果 Vsyn到来时  CPU/GPU就开始操作的话，是有完整的16.6ms的，这样应该会基本避免jank的出现了（除非CPU/GPU计算超过了16.6ms）。

> 所以总的来说，就是屏幕平白无故地多显示了一次第1帧。原因大家应该都看到了，就是CPU没有及时地开始着手处理第2帧的渲染工作，以致“延误军机”。 Android在4.1之前一直存在这个问题。

#### 4.1后 Double Buffer Drawing with VSync CPU/GPU根据VSYNC信号同步处理数据

为了优化显示性能，Android 4.1版本对Android Display系统进行了重构，实现了`Project Butter`，引入了三个核心元素，即`VSYNC`、`Triple Buffer`和`Choreographer`。

为了优化显示性能，Google在Android 4.1系统中对Android Display系统进行了重构，实现了`Project Butter`（黄油工程）：系统在收到VSync pulse后，将马上开始下一帧的渲染。即一旦收到VSync通知（16ms触发一次），CPU和GPU 才立刻开始计算然后把数据写入buffer。在Android4.1之前，CPU和GPU的写buffer时机是比较随意的。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141351481-57b0174b-23ba-4a12-898c-f1d2306f7a9f.png#averageHue=%23f5f2e8&clientId=u61790920-d3fa-4&from=paste&id=u31003f36&originHeight=626&originWidth=1343&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud18495cf-f5b9-48fe-b57c-1f236839c07&title=)<br />CPU/GPU根据VSYNC信号同步处理数据，可以让CPU/GPU有完整的16ms时间来处理数据，减少了jank。假如CPU/GPU的FPS(FramesPer Second)高于这个值，那么这个方案是完美的，显示效果将很好。

> VSync同步使得CPU/GPU充分利用了16.6ms时间，减少jank。

- 问题又来了，如果界面比较复杂，CPU/GPU的处理时间较长 超过了16.6ms呢？如下图：

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141358326-b018d387-56f9-48d4-b419-f75d1f0a31c6.png#averageHue=%23f7f5ec&clientId=u61790920-d3fa-4&from=paste&id=u13ea93b6&originHeight=1278&originWidth=2284&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue71537f3-2c31-4ea1-820f-3d41fd14a06&title=)

```
1 在第二个时间段内，但却因 GPU 还在处理 B 帧，缓存没能交换，导致 A 帧被重复显示。
2 而B完成后，又因为缺乏VSync pulse信号，它只能等待下一个signal的来临。于是在这一过程中，有一大段时间是被浪费的。
3. 当下一个VSync出现时，CPU/GPU马上执行操作（A帧），且缓存交换，相应的显示屏对应的就是B。这时看起来就是正常的。只不过由于执行时间仍然超过16ms，导致下一次应该执行的缓冲区交换又被推迟了——如此循环反复，便出现了越来越多的“Jank”。
```

- 为什么 CPU 不能在第二个 16ms 处理绘制工作呢？<br />原因是只有两个 buffer，Back buffer正在被GPU用来处理B帧的数据， Frame buffer的内容用于Display的显示，这样两个buffer都被占用，CPU 则无法准备下一帧的数据。 那么，如果再提供一个buffer，CPU、GPU 和显示设备都能使用各自的buffer工作，互不影响。

#### 三级缓存 Triple Buffer

三缓存就是在双缓冲机制基础上增加了一个 `Graphic Buffer` 缓冲区，这样可以最大限度的利用空闲时间，带来的坏处是多使用的一个 Graphic Buffer 所占用的内存。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141376064-5f9b913b-90d4-4f47-bc5c-e94f0fae94ea.png#averageHue=%23f6f3ec&clientId=u61790920-d3fa-4&from=paste&id=uf733066a&originHeight=1274&originWidth=2278&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u37eba1a0-5e09-4ed6-a030-44c15b66a41&title=)

1. 第一个Jank，是不可避免的。但是在第二个 16ms 时间段，CPU/GPU 使用 第三个 Buffer 完成C帧的计算，虽然还是会多显示一次 A 帧，但后续显示就比较顺畅了，有效避免 Jank 的进一步加剧。
2. 注意在第3段中，A帧的计算已完成，但是在第4个vsync来的时候才显示，如果是双缓冲，那在第三个VSync就可以显示了。

**三缓冲作用：**<br />简单的说在2个缓存区被GPU和display占据的时候，开辟一个缓冲区给CPU用，一般来说都是用双缓冲，需要的时候会开启3缓冲，三缓冲的好处就是使得动画更为流程，但是会导致lag，从用户体验来说，就是点击下去到呈现效果会有延迟。所以默认不开三缓冲，只有在需要的时候自动开启

> 三缓冲有效利用了等待VSync的时间，减少了jank，但是带来了lag延迟

## Choreographer 编舞者

见`Choreographer编舞者`章节

## 屏幕刷新机制

在一个典型的显示系统中，一般包括CPU、GPU、display三个部分， CPU负责计算数据，把计算好数据交给GPU,GPU会对图形数据进行渲染，渲染好后放到buffer里存起来，然后display（有的文章也叫屏幕或者显示器）负责把buffer里的数据呈现到屏幕上。

显示过程，简单的说就是CPU/GPU准备好数据，存入buffer，display每隔一段时间去buffer里取数据，然后显示出来。display读取的频率是固定的，比如每个16ms读一次，但是CPU/GPU写数据是完全无规律的。

> 屏幕的刷新包括三个步骤：CPU 计算屏幕数据、GPU 进一步处理和缓存、最后 display 再将缓存中（buffer）的屏幕数据显示出来。

CPU 计算屏幕数据： View 树的绘制过程，也就是 Activity 对应的视图树从根布局 DecorView 开始层层遍历每个 View，分别执行测量、布局、绘制三个操作的过程。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688141384378-eae610e7-f277-4d41-aed9-efcc615a2079.png#averageHue=%23f9f5e9&clientId=u61790920-d3fa-4&from=paste&id=uee266164&originHeight=382&originWidth=1197&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub5eef38d-a1b1-4464-96f0-c976771cdf7&title=)

- 第0VSync，CPU/GPU计算第1帧的数据存到Back/Frame Buffer，Display展示第0帧数据
- 第1VSync，CPU/GPU计算第2帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第1帧数据展示
- 第2VSync，CPU/GPU计算第3帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第2帧数据展示
- 第3VSync，CPU/GPU计算第4帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第3帧数据展示
- 第4VSync，Display从Frame Buffer取出第4帧数据展示，App不需要刷新界面了，App不会再接收到VSync信号，也就不会再让CPU去绘制视图树来计算下一帧画面了
- 第5及+VSync，Display一直展示第4帧的数据，VSync还是会继续发出，只是我们的App不再请求接收了

## Ref

- [x] 史上最全Android渲染机制讲解（长文源码深度剖析）

> 天猫精灵技术 <https://mp.weixin.qq.com/s/0OOSmrzSkjG3cSOFxWYWuQ>

- [ ] SurfaceFlinger(2/3) 处理Vsync信号 <https://zhuanlan.zhihu.com/p/123968421>
