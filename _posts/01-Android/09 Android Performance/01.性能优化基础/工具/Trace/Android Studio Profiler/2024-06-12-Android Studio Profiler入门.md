---
date created: 2024-06-12 01:22
date updated: 2024-12-24 00:37
dg-publish: true
---

# Android Studio Profiler 入门

## Profiler 介绍

Android Studio Profiler 已经集成了 4 类性能分析工具： `CPU`、`Memory`、`Network`、`Battery`，其中 CPU 相关性能分析工具为 `CPU Profiler`，它把 CPU 相关的性能分析工具都集成在了一起，开发者可以根据自己需求来选择使用哪一个。

可能很多人都知道，谷歌已经开发了一些独立的 CPU 性能分析工具，如 `Perfetto`、`Simpleperf`、`Java Method Trace` 等，现在又出来一个 CPU Profiler，显然不可能去重复造轮子，CPU Profiler 目前做法就是：从这些已知的工具中获取数据，然后把数据解析成自己想要的样式，通过统一的界面展示出来。

**CPU Profiler** 是集成在 Android Studio 3.2版本之后的 `Android Profiler` 工具当中，实时记录展示 App CPU 消耗，用来替代 `Traceview`。记录应用程序在运行过程中的**各个方法（函数）** 的执行时间以及方法之间的调用关系。

常用于`卡顿优化`、`启动优化`、`内存优化`等。

## Measuring performance 测量性能

[应用性能测量概览  |  App quality  |  Android Developers](https://developer.android.com/topic/performance/measuring-performance)

## `Profileable` applications 可分析的应用

`Profileable` 是 Android Q 中引入的清单配置。它可以指定设备的用户是否可以通过 `Android Studio`、`Simpleperf` 和 `Perfetto` 等工具分析此应用程序。

引入 `Profileable` 是为了让开发人员可以选择允许他们的应用向分析工具公开信息，同时几乎不会产生性能成本。可分析的 APK 本质上是一个发布 APK，在清单文件的 `<application>` 部分中添加了一行 `<profileable android:shell="true"/>` 。

```xml
<application>
	<profileable android:shell="true"/>
</application>
```

### 自动构建并运行 `profileable` 的应用程序

您可以`configure`, `build`, and `run` a `profileable app`。此功能需要运行 API 级别 29 或更高级别并具有`  Google Play ` 的虚拟或物理测试设备。要使用该功能，请单击 **Profile app**应用程序图标 ![|50](https://developer.android.com/static/studio/images/profile-app-icon.png) 旁边的箭头，然后在两个选项之间进行选择：

![|400](https://developer.android.com/static/studio/images/one-click-profileable-build-menu.png)

- **Profile 'app' with low overhead** 会启动 CPU 和内存分析器。在内存分析器中，仅启用[**Record Native Allocations**](https://developer.android.com/studio/profile/memory-profiler#native-memory-profiler)。

![|700](https://developer.android.com/static/studio/images/profiling-with-low-overhead.png)

- **Profile 'app' with complete data** 具有完整数据的分析“应用程序”会启动 CPU、Memory 和 Energy Profiler。

![|700](https://developer.android.com/static/studio/images/profiling-with-complete-data.png)

### 手动构建并运行 `profileable` 的应用程序

要手动构建可分析应用程序，您需要首先构建发布应用程序，然后更新其 manifest 文件，这会将发布应用程序转变为可分析应用程序。配置 `profileable` 应用程序后，启动 `Profiler`并选择要分析的可分析进程。

#### Build a release app

要构建用于分析目的的发布应用程序，请执行以下操作：

- 通过将以下行添加到应用程序的 `build.gradle` 文件，使用调试密钥对您的应用程序进行签名。如果您已经有一个可用的 `release` 版本变体，则可以跳到下一步。

```groovy
buildTypes {
  release {
	signingConfig signingConfigs.debug
  }
}    
```

- 在 Android Studio 中，选择**Build** > **Select Build Variant...**，然后选择发布变体。

### Change release to `profileable`

- 通过打开 `AndroidManifest.xml` 文件并在 `<application>` 中添加以下内容，将上面的 `release` 应用程序转换为 `profileable` 的应用程序。

```xml
<application>
	<profileable android:shell="true"/>
</application>
```

- 根据 SDK 版本，您可能需要将以下行添加到应用程序的 `build.gradle` 文件夹中。 

```groovy
aaptOptions {
	additionalParameters =["--warn-manifest-validation"]
}
```

### 分析 `profileable` 的应用程序

- 启动 App
- 在 AS 中，**View** > **Tool Windows** > **Profiler**
- 应用程序启动后，单击分析器中的 ![Profilers plus button|20](https://developer.android.com/static/studio/images/profile/standalone-profilers-plus.png) 按钮以查看下拉菜单。选择您的设备，然后在其他可分析进程下选择应用程序的条目

![](https://developer.android.com/static/studio/images/profile/profileable_menu_dark.png)

- `Profiler` 应附加到应用程序。仅 `CPU and Memory Profilers` 可用，`Memory Profiler` 的功能有限。

![](https://developer.android.com/static/studio/images/profile/profileable_session_view_dark.png)

![](https://developer.android.com/static/studio/images/profile/profileable_cpu_dark.png)

![](https://developer.android.com/static/studio/images/profile/profileable_memory_dark.png)

### 独立的 Android Studio Profiler

- 确保 Profiler 当前未在 Android Studio 内运行
- 转到安装目录并导航到 `bin` 目录： Windows/Linux `studio-installation-folder/bin`，MacOS 不支持独立运行Profiler
- 根据您的操作系统，运行 `profiler.exe` 或 `profiler.sh` 。将出现 Android Studio 初始屏幕。启动屏幕消失后，将打开一个`Profiler`窗口

### Trace 抓取

有两种方式来抓取相关信息。

### Android Studio

- 依次点击`profiler - cpu` ，然后会跳转到 cpu界面，然后就可以进行录制了。

### 代码

```java
// 开始：
Debug.startMethodTracingSampling(new File("ddd"), 0, 5000);
// 这样的话，我们就开始通过traceview来使用
Debug.startMethodTracing()

// 结束：
Debug.stopMethodTracing();
// 当调用该方法后，就会生产一个文件，
```

## App 启动时抓取trace

如果我们要在应用一启动就记录CPU活动，需要单独配置一下：

- 依次选择 `Run > Edit Configurations`

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624000843.png)

- 2. 选择 `Profiling` - 勾选 `Start this recording on startup` - 选 `Callstack sample`（跟踪 Java 方法）- apply -ok

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624000947.png)

# CPU Profiler

- [Inspect CPU activity with CPU Profiler  |  Android Studio  |  Android Developers](https://developer.android.com/studio/profile/cpu-profiler)

## CPU Profiler 概述

优化应用程序的 CPU usage 有很多优点，如提供更快、更流畅的用户体验及延长设备电池寿命。

你可以在应用程序交互时使用 CPU Profiler 实时检查应用程序的 CPU 使用情况和线程活动，也可以检查 `recorded method trances`、`function traces` 和 `system trarces`。

`CPU Profiler` 记录和显示的详细信息取决于您选择的记录配置：

- **System Trace**：系统 trace
  - 捕获细粒度的应用程序和系统资源的交互详细信息，以便实时检查
- **Method and function traces**: 方法和函数 trace
  - 对于每个进程中的线程，你能了解一段时间执行了哪些方法(Java)或函数(C++) ，以及每个方法或函数在执行过程中消耗的 CPU 资源。
  - 识别调用者和被调用者，调用者是调用另外一个方法 (函数)的方法 (函数)，被调用者是由另一个方法(函数)调用的方法(函数)
  - 也可以使用该信息来确定哪些方法 (函数)导致过于频繁地调用特定资源的密集型任务，并优化 App 的代码以避免不必要的工作
  - 记录 method traces，可以选择 `sampled or instrumented recording`；当记录 `function traces`，你只能用 `sampled recording`

## CPU Profiler overview

![](https://developer.android.com/static/studio/images/profile/cpu_profiler_L2-2X.png)

CPU Profiler 的默认视图包括以下时间线：

1. **Event timeline:** 事件时间线：显示应用程序中在生命周期中不同状态之间转换的活动，并指示用户与设备的交互，包括屏幕旋转事件。有关在运行 Android 7.1（API 级别 25）及更低版本的设备上启用事件时间线的信息，请参阅 [Enable advanced profiling](https://developer.android.com/studio/profile#advanced-profiling)
2. **CPU timeline:** CPU 时间线：显示应用程序的实时 CPU 使用情况（占总可用 CPU 时间的百分比）以及应用程序正在使用的线程总数。时间线还显示其他进程（例如系统进程或其他应用程序）的 CPU 使用情况，因此您可以将其与应用程序的使用情况进行比较。您可以通过沿着时间线的水平轴移动鼠标来检查历史 CPU 使用率数据。
3. **Thread activity timeline:**  线程活动时间线：列出属于您的应用程序进程的每个线程，并使用下面列出的颜色沿着时间线指示其活动。记录跟踪后，您可以从此时间线中选择一个线程，以在跟踪窗格中检查其数据。
   - **绿色**：线程处于活动状态或准备好使用 CPU。也就是说，它处于正在运行或可运行状态。
   - **黄色**：线程处于活动状态，但正在等待 I/O 操作（例如磁盘或网络 I/O），然后才能完成其工作。
   - **灰色**：线程正在休眠，不消耗任何 CPU 时间。当线程需要访问尚不可用的资源时，有时会发生这种情况。线程要么进入自愿睡眠状态，要么内核将线程置于睡眠状态，直到所需的资源可用。

CPU Profiler 还报告 Android Studio 和 Android 平台添加到应用进程的线程的 CPU 使用情况，例如 `JDWP` 、 `Profile Saver` 、 `Studio:VMStats` 、 `Studio:Perfa` 和 `Studio:Heartbeat` （尽管线程活动时间线中显示的确切名称可能有所不同）。 Android Studio 会报告此数据，以便您可以确定线程活动和 CPU 使用率实际上是由应用代码引起的。

## CPU Profiler 提供的功能

`CPU Profiler` 集成了性能分析工具：`Perfetto`、`Simpleperf`、`Java Method Trace`，它自然而然具备了这些工具的全部或部分功能，如下：

1. **System Trace Recording**，它是用 Perfetto 抓取的信息，可用于分析进程函数耗时、调度、渲染等情况，但是它一个精简版，只能显示进程强相关的信息且会过滤掉耗时短的事件，建议将 Trace 导出文件后在 <https://ui.perfetto.dev/> 上进行分析。
2. **Java Method Trace Recording**，它是从虚拟机获取函数调用栈信息，用于分析 Java 函数调用和耗时情况。
3. **C/C++ Function Trace**，它是用 Simpleperf 抓取的信息，Simpleperf 是从 CPU 的性能监控单元 PMU 硬件组件获取数据。 **C/C++ Method Trace** 只具备 Simpleperf 部分功能，用于分析 C/C++ 函数调用和耗时情况。

### CPU Profiler界面 UI

**旧版本：**
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406120125919.png)

**AS Profiler 实践查找问题：** [Android 性能优化的术、道、器 · Android Performance](https://www.androidperformance.com/2022/01/07/The-Performace-1-Performance-Tools/#/2-3-Android-Studio-Profiler-%E5%B7%A5%E5%85%B7)

**新版**：
Android Studio Iguana | 2023.2.1 Patch 1
![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240623000055.png)

#### CPU Recording Configurations

默认有 4 种可以设置，可以新增
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240623002647.png)

#### Wall/Thread time

**==wall clock time : 程序执行时间，包括调用其他方法的时间\
Thread time: CPU 执行时间==**

### Java/Kotlin Method Trace

![](https://developer.android.com/static/studio/images/profile/sample-java-methods.png)

- **1、Selected range:** 选定范围：确定要在跟踪窗格中检查的记录时间部分。当您第一次记录跟踪时，CPU Profiler 会自动选择 CPU 时间线中记录的整个长度。要仅检查记录时间范围的一部分的跟踪数据，请拖动突出显示区域的边缘。
- **2、Interaction section:** 交互部分：沿时间线显示用户交互和应用程序生命周期事件。
- **2、Threads section:** 线程部分：显示时间轴上每个线程的线程状态活动（例如 `running`、`sleeping` 等）和 `Call Chart`（或 `System Trace` 中的跟踪事件图）。
  - 使用[mouse and keyboard shortcuts](https://developer.android.com/studio/profile/record-traces#ui-shortcuts)导航时间线。
  - 双击线程名称或在选择线程时按 `Enter` 键可展开或折叠线程。
  - 选择一个线程以在 **Analysis** 窗格中查看其他信息。按住 `Shift` 或 `Ctrl`（Mac 上的 Command）可选择多个线程。
  - 选择 `method call`（或 `System trace` 中的 trace event）以在**Analysis**窗格中查看其他信息。
- **4、Analysis pane:** 分析窗格：显示您选择的时间范围和线程或方法调用的跟踪数据。在此窗格中，您可以选择如何查看每个堆栈跟踪（使用`Analysis pane tabs`）以及如何测量执行时间（使用 `Time reference menu`）。
- **5、Analysis pane tabs:** 分析窗格选项卡：选择如何显示跟踪详细信息。有关每个选项的详细信息，请参阅 [Inspect traces](https://developer.android.com/studio/profile/inspect-traces#inspect-traces)
- **6、Time reference menu:** 时间参考菜单：选择以下选项之一来确定如何测量每个调用的计时信息（仅在**Sample/Trace Java Methods**)受支持）：
  - **Wall clock time:** 挂钟时间：计时信息代表实际经过的时间。
  - **Thread time:** 线程时间：计时信息表示实际经过的时间减去线程不消耗 CPU 资源时的任何部分。对于任何给定的调用，其线程时间始终小于或等于其 `Wall clock time`。使用线程时间可以让您更好地了解给定方法或函数消耗了多少线程的实际 CPU 使用率。
- **7、Filter:** 过滤器：按函数、方法、类或包名称过滤跟踪数据。例如，如果您想要快速识别与特定调用相关的跟踪数据，请在搜索字段中键入名称。在 **Frame chart** 选项卡中，会强调包含与搜索查询匹配的调用、包或类的调用堆栈。在**Top down**和**Bottom up**选项卡中，这些调用堆栈的优先级高于其他跟踪结果。您还可以通过选中搜索字段旁边的相应框来启用以下选项：
  - **Regex:** 正则表达式：要在搜索中包含正则表达式，请使用此选项。
  - **Match case:** 匹配大小写：如果您的搜索区分大小写，请使用此选项。

#### Android Studio Profiler 分析 method trace

[Inspect traces  |  Android Studio  |  Android Developers](https://developer.android.com/studio/profile/inspect-traces)

- 对于 `method traces` 和 `function traces`，你能直接在 `Threads` 时间线查看 `Call Chart`，在 `Analysis` 面板查看 `Flame Chart` 、`Top Down`、`Bottom Up` 和 `Events` tabs。
- 对于 `callstack frames`，你能查看已执行的部分代码以及调用它的原因
- 对于 `system traces`，你能直接在 `Threads` 时间线中查看 `Trace Events`，在 `Analysis` 面板查看 `Flame Chart` 、`Top Down`、`Bottom Up` 和 `Events` tabs。

##### 快捷键

检查 Threads 时间轴时，您可以使用以下快捷方式：

- 放大：按 **W** 或在按住 Ctrl 键的同时滚动鼠标滚轮（在 Mac 上，按住 Command 键）。
- 缩小：按 **S** 或在按住 Ctrl 键的同时向后滚动鼠标滚轮（在 Mac 上，按住 Command 键）。
- 向左平移：按 **A** 键或在按住空格键的同时向右拖动鼠标。
- 向右平移：按 **D** 键或在按住空格键的同时向左拖动鼠标。
- 展开或收起线程：双击线程名称，或在选中线程时按 Enter 键。

##### 使用 `Call Chart` 表检查跟踪数据

- `Call Chart` 提供了 `method/function trace` 的图形表示，其中调用的周期和时间在水平轴上表示，其被调用者沿垂直轴显式
- 对系统 API 的调用以**橙色**显示，对应用程序自身方法的调用以**绿色**显示，对第三方 API（包括 Java 语言 API）的调用以**蓝色**显示。
- 一个方法的 Total time = Self time + Children time
- 要跳转方法或函数的源代码，请右键单击它并选择 **Jump to Source**，这适用于任何 `Analysis` 窗格选项卡。

举个例子，一个调用图表示例，展示了方法 D 的 `Self` 时间、`Children` 时间和 `Total` 时间。

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624001814.png)
**APP 的启动 Trace 示例：**
测试代码：

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

对应的 Call Chart 图：

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406270029590.png)

> 橙色部分是系统调用，绿色部分是 APP 的代码，蓝色部分是三方库

##### Flame Chart 火焰图

`Flame Chart` 标签页提供了聚合相同调用堆栈的反向调用图，用来汇总完全相同的调用堆栈。将具有相同调用方顺序的完全相同的方法或函数收集起来，并在火焰图中将它们表示为一个较长的横条。这样更方便您查看哪些方法或函数消耗的时间最多。不过，这也意味着，横轴不代表时间轴，而是表示执行每个方法或函数所需的相对时间。

下面的是 Call Chart
![|350](https://developer.android.com/static/studio/images/profile/call_chart_2-2X.png)
对应的 Flame Chart
![|350](https://developer.android.com/static/studio/images/profile/flame_chart-2X.png)

**示例：**
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624002059.png)

**火焰图的展示方式通过为不同耗时函数展示不同的宽度，因此可以更快速的定位到耗时函数，宽度越宽的方法耗时越多**。

- Flame Chart：更侧重直观反映函数耗时严重程度；浅黄色部分其实就是需要重点关注的部分，耗时最多的函数，会最先展示，更加方便定位严重问题，大致定位问题后，就可以用 Top Down 进一步看细节。

##### Top Down / Bottom Up

用于显示方法等调用列表。

###### Top Down

如图所示，在 `Top Down` 标签页中展开方法 A 的节点会显示它的被调用方，即方法 B 和 D（A 调用 B 和 D 方法）。在此之后，展开方法 D 的节点会显示它的被调用方，即方法 B 和 C（D 调用 B 和 C 方法），依此类推。

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624002142.png)

**Top Down** 标签提供一些信息来显示每个调用所花的 CPU 时间：
![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624002256.png)

- **Self**：方法或函数调用在执行自己的代码（而非被调用方的代码）上所花的时间，如图 1 中的方法 D 所示。
- **Children**：方法或函数调用在执行它的被调用方（而非自己的代码）上所花的时间，如图 1 中的方法 D 所示。
- **Total**：方法的 `Self` 时间和 `Children` 时间的总和。这表示应用在执行调用时所用的总时间，如图 1 中的方法 D 所示。

Top Down 搜索效果图: 搜索 sleep 字眼

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406260035271.png)

选中某个方法，可以看到该方法调用链和耗时

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406260042554.png)

- **Top Down： 更侧重自顶向下详细**排查：利用 Top-Down 模式可以更精确观察函数耗时与调用堆栈，更加清晰，如下在 Application 初始化阶段，可以清醒看到函数调用顺序、耗时等，

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407020059019.png)
对于冷启动，重点排查耗时函数，尝试将非核心逻辑从UI线程中移除。同理对于闪屏Activity的onCreate跟onResume阶段所做的处理类似

###### Bottom Up

**Bottom Up** 标签页用于按照占用的 CPU 时间由多到少（或由少到多）的顺序对方法或函数排序。您可以检查每个节点以确定哪些调用方在调用这些方法或函数上所花的 CPU 时间最多。

![|300](https://developer.android.com/static/studio/images/profile/bottom_up_tree-2X.png)

##### Events

**Events**表列出了当前选定线程中的所有调用。您可以通过单击列标题对它们进行排序。通过选择表中的一行，您可以将时间线导航到所选呼叫的开始和结束时间。

![](https://developer.android.com/static/studio/images/profile/system-trace-events-table.png)

### Java/Kotlin Method Sample(legacy)

### `Callstack sample`

`Sample Java/Kotlin and native code using simpleperf`；用 `simpleperf` 采集 Java/Kotlin 和 native 代码。

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240623231306.png)

> 导出的 trace，不能用 Perfetto UI 打开。

`Callstack` 对于了解代码的哪一部分已被执行以及为什么调用它很有用。如果**Callstack Sample Recording**为 `Java/Kotlin` 程序收集，那么 `callstack` 通常不仅包括 `Java/Kotlin` 代码、还包括来自 JNI native 代码、Java 虚拟机（例如 `android::AndroidRuntime::start` ）和系统内核（ `[kernel.kallsyms]+offset` ）。这是因为 Java/Kotlin 程序通常通过 Java 虚拟机执行。需要 `Native` 代码来运行程序本身以及程序与系统和硬件进行通信。

`profiler` 呈现这些 `frames` 是为了精确；但是，根据您的调查，您可能会或可能不会发现这些额外的 `call frames` 有用。
`profiler` 提供了一种折叠您不感兴趣的框架的方法，以便您可以隐藏与您的调查无关的信息。

在下面的示例中，下面的跟踪有许多标记为 `[kernel.kallsyms]+offset` 的帧，这些帧目前对开发没有用处。

![](https://developer.android.com/static/studio/images/profile/simpleperf-example-trace.png)
要将这些框架折叠成一个，您可以从工具栏中选择“折叠框架”按钮，选择要折叠的路径，然后选择“应用”按钮以应用更改。在此示例中，路径为 `[kernel.kallsyms]` 。

![](https://developer.android.com/static/studio/images/profile/simpleperf_menu_dark.png)

这样做会折叠左侧面板和右侧面板上与所选路径相对应的框架，如下所示。

![](https://developer.android.com/static/studio/images/profile/simpleperf_collapsed_dark.png)

### System trace

`Traces Java/Kotlin and native code at the Android platform level`

检查 `system trace` 时，您可以检查 `Threads` 时间线中的 `Trace Events`，以查看每个线程上发生的事件的详细信息。将鼠标指针悬停在事件上可查看事件的名称以及每个状态所花费的时间。单击事件可在**Analysis**窗格中查看更多信息。

#### CPU cores

除了 `CPU scheduling` 数据外，`system traces` 还包括按 `core` 划分的 `CPU frequency`。这显示了每个 `core` 上的活动量，并可以让您了解现代移动处理器中哪些核心是 ["big" or "little" cores](https://en.wikipedia.org/wiki/ARM_big.LITTLE)。

下图展示了：渲染线程的 CPU 活动和跟踪事件。
![](https://developer.android.com/static/studio/images/profile/system-trace-cpu-cores.png)

**CPU cores**面板展示了每个 `core` 上计划的线程活动。将鼠标指针悬停在线程活动上可查看该 `core` 在特定时间在哪个线程上运行。

更多有关检查 `system trace` 的其他信息，请参阅 `systrace` 文档的调查 UI 性能问题部分。 [Investigate UI performance problems](https://developer.android.com/topic/performance/tracing/navigate-report#analysis)

#### Frame rendering timeline

您可以检查应用程序在主线程上渲染每个帧所需的时间，`RenderThread` 调查导致 `UI jank` 和 `low framerates` 的瓶颈。要了解如何使用 `system traces` 来调查并帮助减少 `UI jank`，请参阅 UI 卡顿检测 [UI jank detection](https://developer.android.com/studio/profile/jank-detection)。

#### Process Memory (RSS)

对于部署到运行 Android 9 或更高版本的设备的应用程序，**Process Memory (RSS)** 部分显示应用程序当前使用的物理内存量。
![](https://developer.android.com/static/studio/images/profile/system-trace-process-memory.png)

**Total**

这是您的进程当前使用的物理内存总量。在基于 Unix 的系统上，这称为“`Resident Set Size`驻留集大小”，是匿名分配、文件映射和共享内存分配使用的所有内存的组合。

对于 Windows 开发人员来说，驻留集大小类似于工作集大小。

**Allocated**

该计数器跟踪进程的正常内存分配当前使用了多少物理内存。这些分配是匿名的（不受特定文件支持）和私有的（不共享）。在大多数应用程序中，它们由堆分配（使用 `malloc` 或 `new` ）和堆栈内存组成。从物理内存换出时，这些分配将写入`system swap file`。

**File Mappings**
该计数器跟踪进程用于文件映射的物理内存量，即内存管理器从文件映射到内存区域的内存。

**Shared**
该计数器跟踪有多少物理内存用于在该进程与系统中的其他进程之间共享内存。

## UI jank 检测

- [UI jank detection  |  Android Studio  |  Android Developers](https://developer.android.com/studio/profile/jank-detection)

Android 通过从你的 APP 中生成一个帧并在屏幕上显示它来渲染 UI。如果你的 APP 渲染速度较慢，则系统将被迫 skip frames，发生这种情况时，用户会感觉到屏幕上反复闪烁，这就是 jank。

当 jank 发生时，通常是由于 UI 线程上的某些减速或者 `async call`（在大多数 APP，它是主线程）。你可以用 `system traces` 来确定问题所在。

### Detect jank on Android 12 and higher

对于使用 Android 12（API 级别 31）或更高版本的设备，捕获的 trace 显示在 CPU Profiler **Display** 窗格下的 **Janky frames** 跟踪中。

- 打开 CPU Profiler
- 选择**System Trace**，Record，操作 APP，Stop
- 您应该在 **Display** 下看到 `Janky frames` 跟踪。默认情况下，Profiler 仅显示 `Janky frames` 作为调查的候选帧。在每个卡顿帧中，**红色部分**突出显示该帧超过其渲染截止时间的持续时间。

![](https://developer.android.com/static/studio/images/profile/jank_detection-janky_frames.png)

- 一旦你发现一个 `Janky frames`，点击它；或者，您可以按 **M** 调整变焦以聚焦于所选帧。相关事件在这些线程中突出显示：**主线程**、**RenderThread** 和 **GPU** 完成。

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407020032182.png)

- 您可以通过分别切换**All Frames**和**Lifecycles**复选框来选择查看所有帧或渲染时间的细分。

![](https://developer.android.com/static/studio/images/profile/jank_detection-allframes_lifecycle_checkboxed.png)

## Detect jank on Android 11

- [UI jank detection  |  Android Studio  |  Android Developers](https://developer.android.com/studio/profile/jank-detection#jank-detection-android-11)

## Detect jank on Android 10 and lowerDetect jank on Android 10 and lower \

- [UI jank detection  |  Android Studio  |  Android Developers](https://developer.android.com/studio/profile/jank-detection#jank-detection-android-10-lower)

# Memory Profiler

# Energy profiler
