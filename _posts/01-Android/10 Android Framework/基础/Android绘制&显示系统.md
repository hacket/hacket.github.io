---
date created: 2024-06-06 00:16
date updated: 2024-12-24 00:39
dg-publish: true
---

# Android显示基础

## Tearing 屏幕撕裂

同一时刻显示2个帧不同的画面，双缓冲可以解决该问题。

## Jank 一帧显示2次

一帧数据在屏幕上连续出现2次<br>减少jank出现解决：

1. vsync
2. 三缓存

## Double Buffer 双缓存？

双缓存技术，两块buffer，一块back buffer用于CPU/GPU后台绘制，另外一块frame buffer用于显示；back buffer准备就绪后，它们进行交换。双缓冲很大程度上降低了screening tearing了(屏幕撕裂，同一时刻显示了2个帧不同的画面)

## 什么是Vsync？

如果双缓存的交换实际是在是在back buffer准备完成后进行，当back buffer准备完毕后双缓存交换，此时屏幕还没有完整显示出上一帧的内容，就会有jank问题(掉帧)<br>垂直同步，解决双缓存何时交换buffer的问题。<br>VSync是硬件每隔 `1/屏幕刷新频率`，一般是60HZ = 1/60 = 16.67ms

# Android屏幕刷新机制

## 屏幕刷新机制历史

### 1、Android4.1之前

Double Buffer Drawing without VSync 双缓存drawing未用vsync，CPU和GPU计算时机不定，如果在一个vsync快结束才开始计算工作，等到下一个vsync到来时，计算还未完成，显示的还是上一次的结果，很容易出现jank(一帧显示了2+次)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675827144946-6543602b-3e03-4e67-9a8b-4f886d8019cb.png#averageHue=%23f5f2e7&clientId=ucc4eee86-256f-4&from=paste&height=258&id=u7c0d9ddc&originHeight=603&originWidth=1337&originalType=binary&ratio=1&rotation=0&showTitle=false&size=176467&status=done&style=none&taskId=ucd359c3c-f09b-4560-9c1b-01d8a4317e5&title=&width=573)

### 2、Android4.1及以后

Project Butter黄油计划，引入了VSync、Tripple Buffer和Choreographer。在收到VSync信号时，CPU和GPU就开始工作准备下一帧的渲染，这样CPU和GPU就有完整的16.67ms来处理数据，减少了大量的jank。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675827200133-0596a897-8d83-4ea0-9a06-092325bb3bbf.png#averageHue=%23f4f2e5&clientId=ucc4eee86-256f-4&from=paste&height=243&id=ua2812bf1&originHeight=616&originWidth=1424&originalType=binary&ratio=1&rotation=0&showTitle=false&size=146607&status=done&style=none&taskId=u0dc51ca2-6440-4e7f-98b7-49e46deebd2&title=&width=561)

### 3、三级缓存 Triple Buffer

三缓存就是在双缓冲机制基础上增加了一个 Graphic Buffer 缓冲区，这样可以最大限度的利用空闲时间，带来的坏处是多使用的一个 Graphic Buffer 所占用的内存。

> 三缓存作用，2个缓存区被GPU和display占据的时候，开辟一个缓冲区给CPU用，一般来说都是用双缓冲，需要的时候会开启3缓冲，三缓冲的好处就是使得动画更为流程，但是会导致lag，从用户体验来说，就是点击下去到呈现效果会有延迟。所以默认不开三缓冲，只有在需要的时候自动开启

## 屏幕刷新机制

一个典型的显示系统中，一般包括CPU、GPU和display三部分：

- CPU负责计算数据（View的measure/layout/draw），把计算好的数据交给GPU
- GPU会对图形数据进行渲染，渲染好后放到buffer里存起来
- display负责把buffer里的数据呈现到屏幕上

显示过程简单的说就是：CPU/GPU准备好数据，存入buffer，display每隔一段时间去buffer里取数据，然后显示出来，display读取的频率是固定的，比如每隔16ms（60HZ)读一次，但CPU/GPU写数据是完全无规律的，这样容易出现jank（一帧显示2+次）。<br>Android4.1后的黄油计划，让CPU/GPU在vsync信号到来时就工作，降低出现jank的情况。<br>Android中用Choreographer来协调vsync信号<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675823417879-689cc9e8-3531-4114-8edd-4421831730a2.png#averageHue=%23f9f6e9&clientId=u660ab245-998b-4&from=paste&height=307&id=u2e5aa22f&originHeight=460&originWidth=1419&originalType=binary&ratio=1&rotation=0&showTitle=false&size=96198&status=done&style=none&taskId=u681a1cab-35b2-464e-9532-a3c1b12228c&title=&width=946)

- 第0VSync，CPU/GPU计算第1帧的数据存到Back/Frame Buffer，Display展示第0帧数据
- 第1VSync，CPU/GPU计算第2帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第1帧数据展示
- 第2VSync，CPU/GPU计算第3帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第2帧数据展示
- 第3VSync，CPU/GPU计算第4帧的数据存到Back/Frame Buffer，Display从Frame Buffer取出第3帧数据展示
- 第4VSync，Display从Frame Buffer取出第4帧数据展示，App不需要刷新界面了，App不会再接收到VSync信号，也就不会再让CPU去绘制视图树来计算下一帧画面了
- 第5及+VSync，Display一直展示第4帧的数据，VSync还是会继续发出，只是我们的App不再请求接收了

## VSync

### Vsync分发

Vsync 信号可以由硬件产生，也可以用软件模拟，不过现在基本上都是硬件产生，负责产生硬件 Vsync 的是 HWC（HWComposer）。<br>HWC HAL通过callback函数，把VSYNC信号传给DispSyncThread，DispSyncThread传给EventThread。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675833918497-d40aaf3c-2c2c-4897-b8a1-d709395148ad.png#averageHue=%23f6f7f1&clientId=ucc4eee86-256f-4&from=paste&id=u6e2fd6de&originHeight=1080&originWidth=1920&originalType=url&ratio=1&rotation=0&showTitle=false&size=211338&status=done&style=none&taskId=u4c0f0052-7eb6-4b11-96cd-21145128e34&title=)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675833963374-f13c124a-0181-4af5-83bc-38c62a29c511.png#averageHue=%23fcf6f5&clientId=ucc4eee86-256f-4&from=paste&height=300&id=u25a15369&originHeight=450&originWidth=639&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49884&status=done&style=none&taskId=u1591afb4-a037-4a78-8e4b-fce05d1a521&title=&width=426)

> HWComposer：硬件生成vsync；VsyncThread：软件模拟生成vsync

渲染层(App)与 Vsync 打交道的是 Choreographer，而合成层与 Vsync 打交道的，则是 SurfaceFlinger。SurfaceFlinger 也会在 Vsync 到来的时候，将所有已经准备好的 Surface 进行合成操作

## Choreographer  编舞者

### Choreographer是什么？

Google在Android 4.1提出的Project Butter黄油计划对Android Display系统进行了优化：在收到VSync pulse后，将马上开始下一帧的渲染。即一旦收到VSync通知，CPU和GPU就立刻开始计算然后把数据写入buffer。<br>文档说，Choreographer是**协调动画时间脉冲**(timing pulse，例如vsync)，输入事件和绘制。

> 译为“舞蹈指导”，用于接收显示系统的 VSync 信号，在下⼀帧渲染时控制执行一些操作。Choreographer 的 postCallback方法用于发起添加回调，这个添加的回调将在下⼀帧被渲染时执行。

### Choreographer作用？

Choreographer 的引入，主要是配合 Vsync，给上层 App 的渲染提供一个稳定的 Message 处理的时机，也就是 Vsync 到来的时候 ，系统通过对 Vsync 信号周期的调整，来控制每一帧绘制操作的时机. 目前大部分手机都是 60Hz 的刷新率，也就是 16.6ms 刷新一次，系统为了配合屏幕的刷新频率，将 Vsync 的周期也设置为 16.6 ms，每个 16.6 ms，Vsync 信号唤醒 Choreographer 来做 App 的绘制操作 ，这就是引入 Choreographer 的主要作用。<br>Choreographer应用：

1. View变更（View的measure\layout\draw）

> View一个小小改动需要重绘，都是通过ViewRootImpl，来添加同步屏障，Choreographer协调vsync信号来进行requestLayout()
> 注意：一次vsync周期内，requestLayout只会触发一次

2. 属性动画

### Choreographer原理 Choreographer.postCallback

1. Choreographer会post一个Runnable，这个runnable会根据时间顺序插入到mCallbackQueues这个单链表中，接着调用scheduleFrameLocked，它的作用是：
   - 如果当前线程是Choregrapher线程的话，直接调用scheduleVsyncLocked()方法
   - 否则就发送一个异步消息到消息队列里取，这个异步消息不受同步屏障影响，而且这个消息还要插入到消息队列的头部（屏幕刷新的消息是非常紧急的）
2. 在scheduleVsyncLocked中调用DisplayEventReceiver的scheduleVsync，最终会调用native的nativeScheduleVsync方法请求下一个vsync，其内部通过scoketpair(AF_UNIX, SOCK_SEQPACKET, 0, sockets)创建两个描述符mSendFd、mReceiverFd以实现类似生产者消费者的管道机制，然后回调到Java层的dispatchVsync()方法，里面会回调onVsync()方法，内部最终会调用doFrame()方法，最终执行前面postCallbak的Runnable的run()方法。

### Choreographer小结

- 使用Choreographer必须是在Looper线程
- Choreographer是线程唯一的实例，保存在ThreadLocal
- Choreographer通过postCallbackXXX提交任务，postCallback提交Runnable，postFrameCallback提交FrameCallback
- Choreographer定义了5种类型的任务（Input/ANIMATION/INSETS_ANIMATION/TRAVERSAL/COMMIT ），按顺序执行
- Choreographer中所有的Handler消息都是异步消息，不受同步屏障影响

### Choreographer用途

#### Choreographer的postFrameCallback()计算丢帧情况

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

# Android图形系统

## Surface

### 什么是Surface？

Surface是一个包含需要渲染到屏幕上的像素对象。屏幕上的每一个窗口都有自己的Surface，而SurfaceFlinger会按照正确的Z轴顺序，将它们合成在屏幕上。<br>一个Surface会有多个缓冲区来进行双缓冲渲染，显示在屏幕上称为前端缓冲区，还没有显示在屏幕上的称为后端缓冲区，这样应用程序可以先在后端缓冲区绘制下一帧的内容，每隔一段时间交换两块缓冲区，这样就不需要等待所有内容都绘制完毕，屏幕上就可以显示出内容。

> 一个Activity有一个Window，对应一个Surface。

### Surface创建？

Java层的Surface是ViewRootImpl的成员变量，public final Surface mSurface = new Surface();

### SurfaceView

SurfaceView就是一个嵌入了独立Surface的特殊View，Surface中有一个独立的画布Canvas用于绘制内容，SurfaceView本质上是这个Surface的容器，用于控制Surface的格式、尺寸等基础信息。<br>SurfaceView显示内容时，会在Window上挖一个洞，SurfaceView绘制的内容显示在这个洞里，其他的View继续显示在Window上。<br>SurfaceView是一种特殊View，SurfaceView持有一个独立的Surface，专门用于一些特殊且耗时的绘制。

#### SurfaceView的背景

默认情况下SurfaceView渲染时会显示黑色的背景，如果当我们需要显示透明的背景可以使用如下的代码。弊端是SurfaceView会显示在Window的顶层，遮住其他的View。

```java
surfaceHolder.setFormat(PixelFormat.TRANSPARENT)
setZOrderOnTop(true)
```

#### SurfaceView的画布获取时为何要加锁？

因为SurfaceView是可以在子线程中执行绘制的，如果不对画布加锁，那么多个子线程同时更新画布就会产生无法预期的情况，所以需要加锁。

## Android图形显示流程

无论开发者使用什么渲染 API，一切内容都会渲染到 **Surface** 上。Surface 表示缓冲区队列中的生产方，而缓冲区队列通常会被 SurfaceFlinger 消耗。在 Android 平台上创建的每个窗口都由 Surface 提供支持。所有被渲染的可见 Surface 都被 SurfaceFlinger 合成到屏幕。<br>![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1675835539840-b284376c-f97b-4bab-935b-87b73fd8afb2.png#averageHue=%23f5f6f2&clientId=ucc4eee86-256f-4&from=paste&height=561&id=u38cbb36e&originHeight=842&originWidth=899&originalType=binary&ratio=1&rotation=0&showTitle=false&size=134100&status=done&style=none&taskId=uf56f2048-7fe8-447c-82b2-cca4df3966a&title=&width=599.3333333333334)

![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1654103136436-bb5b3843-811d-41af-a56d-923392a08b0f.webp#averageHue=%23f7f4e4&clientId=u0cd3cd33-3ab5-4&from=paste&height=233&id=u8d31dcdb&originHeight=354&originWidth=1304&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue9dd2d35-ed5a-4fe3-96b9-24d07e1b6af&title=&width=857)

![mmexport1661163919932.jpg|600](https://cdn.nlark.com/yuque/0/2022/jpeg/694278/1661163980080-71eae63f-6396-41b8-95cf-1bfa970c7708.jpeg#averageHue=%23f4c97c&from=url&id=auPMI&originHeight=262&originWidth=537&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74852&status=done&style=none&title=)

# 面试题

## 屏幕刷新相关题

### 丢帧(掉帧)，是说这一帧延迟显示还是丢弃不再显示？

延迟显示，因为缓存交换的时机只能等下一个VSync了。

### 布局层级较多/主线程耗时是如何造成丢帧的呢？

布局层级较多/主线程耗时 会影响CPU/GPU的执行时间，大于16.6ms时只能等下一个VSync了

### 避免丢帧的方法之一是保证每次绘制界面的操作要在16.6ms内完成，如果某次用户点击屏幕导致的界面刷新操作是在某一个 16.6ms 帧快结束的时候，那么即使这次绘制操作小于 16.6 ms，按道理不也会造成丢帧么？

代码里调用了某个 View 发起的刷新请求invalidate，这个重绘工作并不会马上就开始，而是需要等到下一个VSync来的时候CPU/GPU才开始计算数据存到Buffer，下下一帧数据屏幕才从Buffer拿到数据展示。<br>也就是说**一个绘制操作后，至少需要等2个vsync，在第3个vsync信号到来才会真正展示**

- 当前vsync：发起重绘
- 下一个vsync：CPU/GPU开始工作，将数据存到buffer
- 下下一个vysnc: display从buffer取数据显示

### Android 每隔 16.6 ms 刷新一次屏幕到底指的是什么意思？是指每隔 16.6ms 调用 onDraw() 绘制一次么？

Android 每隔 16.6 ms 刷新一次屏幕其实是指底层会以这个固定频率来切换每一帧的画面，而这个每一帧的画面数据就是我们 App 在接收到屏幕刷新信号之后去执行遍历绘制 View 树工作所计算出来的屏幕数据。<br>而 app 并不是每隔 16.6ms 的屏幕刷新信号都可以接收到，只有当 app 向底层注册监听下一个屏幕刷新信号之后，才能接收到下一个屏幕刷新信号到来的通知。而只有当某个 View 发起了刷新请求时，App 才会去向底层注册监听下一个屏幕刷新信号。

> 小结：现在主流屏幕都是60HZ，即16.67ms刷新一次屏幕，App只有在需要重绘的时候发起刷新请求，App才会注册下一个vsync信号来处理，并不是每隔16.67ms就会绘制一次。

### 如果界面没有重绘，还会每隔16ms刷新屏幕么？

界面没有重绘，就不会收到 vsync 信号，但是屏幕还是会以每秒60帧的数据刷新的，这个画面数据用的是旧的，所以看起来没有什么变化。

### measure/layout/draw 走完，界面就立刻刷新了吗?

不是。measure/layout/draw走完后，只是CPU计算数据完成，会在下一个VSync到来时进行缓存交换，屏幕才能显示出来。

### 如果在屏幕快要刷新的时候才去绘制会丢帧么？

代码里面发起的重绘不会马上执行，它都是等到下次 vsync 信号来的时候才开始，所以什么时候发起都没太大关系。

- 当前vsync：发起重绘
- 下一个vsync：CPU/GPU开始工作，将数据存到buffer
- 下下一个vysnc: display从buffer取数据显示

### 屏幕刷新使用 双缓存、三缓存，这又是啥意思呢？

双缓存是Back buffer、Frame buffer，用于解决screen tearing画面撕裂（屏幕上下显示了不同的帧）<br>三缓存增加一个Back buffer，用于减少Jank（一帧显示了2+次）。

### 有了同步屏障消息的控制就能保证每次一接收到屏幕刷新信号就第一时间处理遍历绘制 View 树的工作么？

只能说，同步屏障是尽可能去做到，但并不能保证一定可以第一时间处理。因为，同步屏障是在 scheduleTraversals() 被调用时才发送到消息队列里的，也就是说，只有当某个 View 发起了刷新请求时，在这个时刻后面的同步消息才会被拦截掉。如果在 scheduleTraversals() 之前就发送到消息队列里的工作仍然会按顺序依次被取出来执行。
