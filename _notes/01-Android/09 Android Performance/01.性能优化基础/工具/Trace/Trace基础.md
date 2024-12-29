---
date created: 2024-06-07 00:31
date updated: 2024-12-24 00:38
dg-publish: true
---

# Trace 基础

## 什么是 Trace？

在软件开发和性能调优过程中，追踪（`Trace`）工具被广泛用于收集程序运行时的详细信息。这些信息可以帮助开发者理解应用的行为、找到性能瓶颈，从而进行优化。以下是对追踪工具的概述，包括`  Chrome Trace Viewer ` 和 `Android` 中的追踪工具。

追踪（`Tracing`）是一种监控和记录计算机程序在运行时的各种活动的技术。这些活动可以包括`函数调用`、`系统调用`、`线程的创建与销毁`、`CPU 利用率`等。通过分析这些追踪数据，开发者可以深入理解程序的运行情况，诊断性能问题、线程竞争、死锁等问题。

## Trace 工具

### Chrome Trace Viewer

`Chrome Trace Viewer` 是一个用于查看追踪数据的工具，内置于 Chrome 浏览器中，可以通过 <chrome://tracing> 访问。它不仅适用于前端开发者分析网页性能，也适用于分析来自其他平台和应用的追踪数据。

主要特点：

- `支持多种数据源`：Chrome Trace Viewer 能处理来自 `Chrome`、`Android` 系统等多种数据源的追踪文件。
- `图形化界面`：提供了一个直观的图形化界面，通过时间轴表示事件，方便分析。
- `灵活性`：支持按时间、线程、进程等维度过滤和查看追踪数据。

> chrome://tracing 在 2022 年过时了，现在推荐用 perfetto ui，

## Trace 采集

Perfetto收集App的Trace是通过Android系统的atrace收集，需要自己手动添加Trace收集代码，添加Trace采集方式如下：

- **Java/Kotlin**：提供了`android.os.Trace`类，通过在方法开始和结束点成对添加`Trace.beginSection`和`Trace.endSection`；
- **NDK**：通过引入`<trace.h>`，通过`ATrace\_beginSection()` / `Atrace\_endSection()`添加Trace；
- **Android系统进程**：提供了`ATRACE`宏添加Trace，定义在`libcutils/trace.h`；

在 Android Framework 和虚拟机内部会默认添加一些关键 Trace，APP 层需要手动添加，监控 APP 启动流程，有海量的方法，手动添加耗时耗力。APP 大部分逻辑都是 Java/Kotlin 编写，Java/Kotlin 代码会编译成字节码，在编译期间，可通过 gradle transform 修改字节码，我们需要开发一套自动插桩的 gradle 插件，在编译时自动添加 APP 层 Trace 收集代码，实现监控 APP 层所有方法。

# Android Trace

Android 中提供了两种 trace 分析工具：

- `method trace` 是抓取线程中代码的执行栈和耗时；
- `systrace` 是抓取 app 使用过程中 cpu、线程和锁阻塞等信息。

## method trace

通过`method trace` 抓取线程中执行的方法栈和方法耗时。如图，通过分析主线程的方法调用，解决主线程耗时逻辑。
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406070042868.png)

### method trace 采集

- 本地开发快速分析问题通过`Debug.startMethodTracingSampling`方式，调试效率高。
- 针对非常细节深度的分析采用 `systrace + 函数插桩` 的方式（可参考：[Gradle插件给代码加入Trace Tag](https://github.com/AndroidAdvanceWithGeektime/Chapter07)）。

#### Android Studio 的 Profiler

##### 非启动阶段，手动 Record/Stop

通过 Android Studio 的 Profiler，CPU

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406070044113.png)

##### 启动阶段

对于启动阶段的method trace需要通过配置才能开启。
![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406070046456.png)

**这种方式优缺点**

- 优点: 不用写代码耦合。
- 缺点: trace 文件抓取需要通过 `Profile` 模式，`Profile` 模式必须在 debug 模式下才能进行，而 debug 和 release 模式在性能上差异较大，会让问题分析有较大误差。

**profile 两种模式：**

- `profile app with low overhead`
- `profile app with complete data`

#### 通过代码抓取

Android 系统在 Java 层提供了两种开发者可直接使用的 Method Trace 的 API，一是 `android.os.Debug` 类中的 `startMethodTracing` 相关 API，第二个是 `android.os.Trace` 类中的 `beginSection` 相关 AP。这两者的区别是 Debug 类只能监控 Java 函数调用，而 Trace 类底层是使用 [atrace](https://perfetto.dev/docs/data-sources/atrace) 实现，其追踪的函数会包含了应用及系统的 Java 和 Native 函数，并且底层基于 `ftrace` 还可以追踪 cpu 的详细活动信息。

**Debug 类：**
在app启动的时候`startMethodTracingSampling`，首页加载完成后`stopMethodTracing`，然后会生成trace文件，将手机中的trace文件导出到电脑上，通过profile窗口打开

```java
// 方式1
Debug.startMethodTracing() // 默认路径：/sdcar/Android/data/包名/files/dmtrace.trace
Debug.stopMethodTracing()

// 方式2
Debug.startMethodTracingSampling(traceName, 0, sampleInterval);
Debug.stopMethodTracing();
```

**这种方式优缺点**

- 优点: trace文件debug和release模式都可以抓取，release模式抓取的文件分析耗时更加准确。
- 缺点:需要在工程中添加代码，但是代码量较少。

> 通过代码模式下的relase模式method trace其实对性能影响还好，低端机下开启method trace后整体启动耗时仅增长300ms。

**Trace 类**

```kotlin
binding.btnNativeThreadUpdateUi.setOnClickListener {
	try {
		Trace.beginSection("btnNativeThreadUpdateUi")
		val nativeThreadTest = NativeThreadTest(this)
		SystemClock.sleep(2453L)
//            nativeThreadTest.createNativeThread()
	} finally {
		Trace.endSection()
	}
}
```

#### method trace 应用

- 查看线程、方法函数耗时
- 查看方法调用时序

##### 具体案例

在APM系统中 当我们监测到 APP慢启动、慢消息处理、页面慢启动、ANR 时，很多情况下只能拿到最后时刻的一些信息，或者是一些简单的流程耗时，没法感知具体主线程在这阶段函数执行的情况， 通过补齐methodTrace 信息，将上述性能问题发生时间段的 堆栈样本一起上报，之后，在APM平台上，分析具体问题时，我们提供了展示性能问题发生时间段的火焰图。 这里以应用启动监控功能为例，对于慢启动的日志样本，可以展示出对于的火焰图信息

##### 卡顿监控案例分享

在线下场景中，以卡顿为例，我们可能更希望发生卡顿之后，能够立即受到通知，点击通知时，能够在手机上以火焰图的形式 直接展示卡顿时间段的堆栈。

- [GitHub - Knight-ZXW/BlockCanaryX: 🔥基于堆栈采样，使用函数火焰图的形式展示Android Main Looper的慢消息处理过程，定位阻塞原因](https://github.com/Knight-ZXW/BlockCanaryX)

基于Thread.getStackTrace 的实现方案性能影响较大， 字节跳动分享了一个通过 调用[StackVisitor](https://blog.csdn.net/ByteDanceTech/article/details/119621240)来实现函数采样的方案

##### 网络数据解析耗时

通过method trace排查启动过程中相关的耗时任务，这里展示一个比较典型的场景，网络数据请求返回后主线程解析数据。这里我们可以直接放到异步中执行。
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406270038752.png)

##### 布局解析耗时

通过启动预加载，异步创建首页布局。
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406270043303.png)

#### 系统 method trace 实现原理

- [Android 平台下的 Method Trace实现解析 及 卡顿监测实践](https://blog.csdn.net/zhuoxiuwu/article/details/125451794)

## `Systrace`

## Perfetto

# Trace 分析

## Android Studio Profiler Trace 分析

[[Android Studio Profiler入门#Android Studio Profiler 分析 method trace]]

## 自动化分析

**Perfetto提供了强大的Trace分析模块**：`Trace Processor`，把多种类型的日志文件（`Android systrace`、`Perfetto`、`linux ftrace`）通过解析、提取其中的数据，结构化为SQLite数据库，并且提供基于SQL查询的python API，可通过python实现自动化分析。

为提高效率，需基于`Trace Processor`的python API，开发一套Trace自动分析工具集，实现快速高效分析版本启动劣化问题。
