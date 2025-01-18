---
date created: 2024-06-06 08:20
date updated: 2024-12-24 00:37
dg-publish: true
---

# Systrace入门

## 什么是 Systrace？

`Systrace` 是 `Android4.1及以上版本` 中新增的性能数据采样和分析工具。它可帮助开发者收集 Android 关键子系统（如 `SurfaceFlinger`/`SystemServer`/`Kernel`/`Input`/`Display` 等`  Framework部分关键模块、服务 `，`View 系统`等）的运行信息，从而帮助开发者更直观的分析系统瓶颈，改进性能。

`Systrace` 的功能包括跟踪`系统的I/O操作`、`内核工作队列`、`CPU 负载`以及 `Android 各个子系统的运行状况`等。在 Android 平台中，它主要由3部分组成：

- **内核部分**：`Systrace` 利用了 `Linux Kernel` 中的 `ftrace` 功能。所以，如果要使用 `Systrace` 的话，必须开启 kernel 中和 `ftrace` 相关的模块。
- **数据采集部分**：Android 定义了一个 `Trace` 类。应用程序可利用该类把统计信息输出给`ftrace`。同时，Android 还有一个 `atrace` 程序，它可以从 `ftrace` 中读取统计信息然后交给数据分析工具来处理。
- **数据分析工具**：Android 提供一个 `systrace.py`（ python 脚本文件，位于 `Android SDK目录/platform-tools/systrace` 中，其内部将调用 `atrace` 程序）用来配置数据采集的方式（如采集数据的标签、输出文件名等）和收集 `ftrace` 统计数据并生成一个结果网页文件供用户查看。 从本质上说，`Systrace` 是对 Linux Kernel中 `ftrace` 的封装。应用进程需要利用 Android 提供的 `Trace` 类来使用 `Systrace`

> 新版本（Android 33.0.0 以上?） platform-tools 移除了 Systrance，推荐用 Perfetto

## Systrace 设计思路

在**系统的一些关键操作**（比如 Touch 操作、Power 按钮、滑动操作等）、**系统机制**（input 分发、View 绘制、进程间通信、进程管理机制等）、**软硬件信息**（CPU 频率信息、CPU 调度信息、磁盘信息、内存信息等）的关键流程上，插入类似 Log 的信息，我们称之为 `TracePoint`（本质是 `Ftrace` 信息），通过这些 `TracePoint` 来展示一个核心操作过程的执行时间、某些变量的值等信息。然后 Android 系统把这些散布在各个进程中的 `TracePoint` 收集起来，写入到一个文件中。导出这个文件后，Systrace 通过解析这些 `TracePoint` 的信息，得到一段时间内整个系统的运行信息。
![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406120826431.png)
Android 系统中，一些重要的模块都已经默认插入了一些 TracePoint，通过 TraceTag 来分类，其中信息来源如下

1. Framework Java 层的 TracePoint 通过 `android.os.Trace` 类完成
2. Framework Native 层的 `TracePoint` 通过 ATrace 宏完成
3. App 开发者可以通过 `android.os.Trace` 类自定义 Trace

这样 Systrace 就可以把 Android 上下层的所有信息都收集起来并集中展示，对于 Android 开发者来说，Systrace 最大的作用就是把整个 Android 系统的运行状态，从黑盒变成了白盒。全局性和可视化使得 Systrace 成为 Android 开发者在分析复杂的性能问题的时候的首选。

## Systrace 实践情况

解析后的 `Systrace` 由于有大量的系统信息，天然适合分析 Android App 和 Android 系统的性能问题， Android 的 App 开发者、系统开发者、Kernel 开发者都可以使用 `Systrace` 来分析性能问题。

1. 从技术角度来说，`Systrace` 可覆盖性能涉及到的 **响应速度** 、**卡顿丢帧**、 **ANR** 这几个大类。
2. 从用户角度来说，Syst `race 可以分析用户遇到的性能问题，包括但不限于:
   1. 应用启动速度问题，包括冷启动、热启动、温启动
   2. 界面跳转速度慢、跳转动画卡顿
   3. 其他非跳转的点击操作慢（开关、弹窗、长按、选择等）
   4. 亮灭屏速度慢、开关机慢、解锁慢、人脸识别慢等
   5. 列表滑动卡顿
   6. 窗口动画卡顿
   7. 界面加载卡顿
   8. 整机卡顿
   9. App 点击无响应、卡死闪退

在遇到上述问题后，可以使用多种方式抓取 Systrace ，将解析后的文件在 Chrome 打开，然后就可以进行分析

## 使用 Systrace

### 流程

使用 Systrace 前，要先了解一下 Systrace 在各个平台上的使用方法，不过不管是什么工具，流程是一样的：

- 手机准备好你要进行抓取的界面
- 点击开始抓取(命令行的话就是开始执行命令)
- 手机上开始操作(不要太长时间)
- 设定好的时间到了之后，会将生成 `Trace.html` 文件，使用 **Chrome** 将这个文件打开进行分析

一般抓到的 Systrace 文件如下
![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406120830863.png)

### 命令行工具抓取 Systrace

命令行形式比较灵活，速度也比较快，一次性配置好之后，以后再使用的时候就会很快就出结果（**强烈推荐**）。

Systrace 工具在 `Android-SDK` 目录下的 `platform-tools` 里面（**最新版本的 platform-tools 里面已经移除了 systrace 工具，需要下载老版本的 platform-tools ，33 之前的版本**）,下面是简单的使用方法

```shell
cd android-sdk/platform-tools/systrace
python systrace.py
```

可以在 `bash/zsh` 中配置好对应的路径和 alias，使用起来还是很快速的。另外 User 版本所抓的 Systrce 文件所包含的信息是比 eng 版本或者 Userdebug 版本要少的，建议使用 Userdebug 版本的机器来进行 debug，这样既保证了性能，又能有比较详细的输出结果。

抓取结束后，会生成对应的 `Trace.html`文件，注意这个文件只能被 `Chrome` 打开。

### 命令行工具语法

要为应用生成HTML报告，我们需要使用以下语法从命令行运行`systrace`：

```shell
python systrace.py [options] [categories]
```

#### 参数

**[命令和命令选项](https://developer.android.com/topic/performance/tracing/command-line#command_options)：**

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062321821.png)

```shell
-a appname      enable app-level tracing for a comma separated list of cmdlines; * is a wildcard matching any process
-b N            use a trace buffer size of N KB
-c              trace into a circular buffer
-f filename     use the categories written in a file as space-separated
			   values in a line
-k fname,...    trace the listed kernel functions
-n              ignore signals
-s N            sleep for N seconds before tracing [default 0]
-t N            trace for N seconds [default 5]
-z              compress the trace dump
--async_start   start circular trace and return immediately
--async_dump    dump the current contents of circular trace buffer
--async_stop    stop tracing and dump the current contents of circular
			   trace buffer
--stream        stream trace to stdout as it enters the trace buffer
			   Note: this can take significant CPU time, and is best
			   used for measuring things that are not affected by
			   CPU performance, like pagecache usage.
--list_categories
			 list the available tracing categories
-o filename      write the trace to the specified file instead
			   of stdout.
```

上面的参数虽然比较多，但使用工具的时候不需考虑这么多，在对应的项目前打钩即可，命令行的时候才会去手动加参数，我们一般会把这个命令配置成 alias，比如（下面列出的 `am`，`binder_driver` 这些，不同的手机、root 和非 root，会有一些不同，使用 `adb shell atrace –list_categories` 来查看你的手机支持的 tag）：

```shell
alias st-start='python ~/Library/Android/sdk/platform-tools/systrace/systrace.py'
alias st-start-full='python ~/Library/Android/sdk/platform-tools/systrace/systrace.py -t 8 am,binder_driver,camera,dalvik,freq,gfx,hal,idle,input,memory,memreclaim,res,sched,sync,view,webview,wm,workq,binder'
```

一般来说比较常用的是

1. **-o** : 指示输出文件的路径和名字
2. **-t** : 抓取时间(最新版本可以不用指定, 按 Enter 即可结束)
3. **-b** : 指定 buffer 大小 (一般情况下,默认的 Buffer 是够用的,如果你要抓很长的 Trae , 那么建议调大 Buffer )
4. **-a** : 指定 app 包名 (如果要 Debug 自定义的 Trace 点, 记得要加这个)

#### 示例

**示例1：**

```shell
python ./systrace.py -t 5 -o mynewtrace.html
# mynewtrace.html是最终的生成产物
# 5代表捕获5s的数据
```

**示例2：**

```shell
python systrace.py -o mynewtrace.html sched freq idle am wm gfx view \
        binder_driver hal dalvik camera input res
# mynewtrace.html之后的参数，表示类别列表
## 提示：如果要在跟踪输出中查看任务名称，必须在命令参数中添加 sched 类别。 
```

**查看已连接设备支持的类别列表**: Systrace 默认支持的 TAG，可以通过下面的命令来进行抓取，不同厂商的机器可能有不同的配置，在使用的时候可以根据自己的需求来进行选择和配置，TAG 选的少的话，Trace 文件的体积也会相应的变小，但是抓取的内容也会相应变少。Trace 文件大小会影响其在 Chrome 中打开后的操作性能，所以这个需要自己取舍。

```shell
python systrace.py --list-categories
```

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062332999.png)

> 左边是 tag 名，右边是解释

### 步骤

**使用 Systrace 指令开始收集追踪数据：**

```shell
cd path_to_android_sdk/platform-tools/systrace
python systrace.py --time=10 -o mytrace.html sched gfx view wm
# 使用了 Systrace 脚本收集了 10 秒的系统追踪数据，包括调度（sched）、图形（gfx）、视图系统（view）和窗口管理器（wm）的类别。追踪结果会输出到 mytrace.html 文件中，然后可以在浏览器中打开查看。
```

需要使用 `Python 2.x`

**打开生成的 HTML 文件查看追踪结果：**
在你的电脑上通过浏览器打开 `mytrace.html` 文件即可查看追踪报告的图形化界面。
Systrace 支持多个不同的追踪类别，具体可追踪哪些类别，可以通过先运行 `python systrace.py --list-categories` 命令来查看。

- [在命令行上捕获系统跟踪记录  |  App quality  |  Android Developers](https://developer.android.com/topic/performance/tracing/command-line)

高版本推荐使用 `Android Studio Profiler` 和 `Perfetto` 工具

#### Windows 报错

**No module named win 32 con**
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406130034590.png)
在 pywin32的 [Github官网](https://github.com/mhammond/pywin32/releases)下载 pywin32的 exe 安装包，需要注意下载正确的 python 版本的安装包。

**ImportError: No module named six**

- `pip install six` python2.7 版本过期了，安装不了
- 去 [Release 1.16.0 · benjaminp/six · GitHub](https://github.com/benjaminp/six/releases/tag/1.16.0) 下载，解压
- `python setup.py install` 即可

#### Mac 版本报错

只报 six module 缺少的错误，和 Windows 的一样解决就行

### 打开 trace 报告

通过以上操作，会生成一个HTML文件，我们可以使用chrome浏览器，地址栏输入`chrome://tracing/` 来查看报告。

界面如下（点击Load按钮加载HTML文件即可）：

![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062334943.png)

### 查看报告元素

`Systrace` 会生成包含多个部分的输出 `HTML` 文件。该报告列出了每个进程的线程。如果给定线程会渲染界面帧，该报告还会沿时间轴指明所渲染的帧。当您在报告中从左向右移动时，时间会向前推移。

报告从上到下包含以下几个部分。

#### 用户互动

第一部分包含表示应用或游戏中的具体用户互动（例如点按设备屏幕）的条形图。这些互动可用作有用的时间标记。

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062337593.png)

#### CPU trace

下一部分显示了表示每个 CPU 中的线程活动的条形图。这些条形会显示所有应用（包括你的应用或游戏）中的 CPU 活动。

CPU 活动部分可以展开，展开后您就可以查看每个 CPU 的`时钟频率`。

##### CPU UI 介绍

图 1 展示了一个收起后的 CPU 活动部分示例，

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062338286.png)
图 2 展示了显示时钟频率的展开后版本：

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406210001222.png)

如上图所示，`Systrace` 中 `CPU Trace`一般在最上面显示，展示`Kernel`中的 `CPU Info` 区域信息，一般包含如下信息：

- **CPU usage** 标识当前总体 CPU 使用率
- **CPU xxx** CPU的组成架构，包含多少颗CPU运行核心，以及编号信息
- **C-State** 标识 CPU 核心的运行状态，当前是否进入休眠断电等状态
- **Clock Frequency** 每颗CPU核心的实时运行频率信息
- **Clock Frequency Limit** 每颗CPU核心当前支持的运行频率的最高与最低的门限值

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406210009548.png)

- **每颗CPU核心上运行的线程任务信息与统计，按时间轴排开**

![image.png|2500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406210019378.png)

##### 范围观察 CPU

按住数字 `1` 进入 selection 模式，鼠标左键选择要查看的 CPU 线程。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406210036673.png)

总的来说，`Systrace` 中的`CPU Trace` 这里一般是看任务调度信息，**查看是否是`CPU`频率或者是`CPU`调度逻辑导致当前任务出现性能问题**，举例如下：

- 某个场景的任务执行比较慢，我们就可以查看是不是这个任务被 CPU 调度器安排到了小核上运行？
- 某个场景的任务执行比较慢，当前执行这个任务的 CPU 运行频率是不是不够？是否因为门限值的设置不合理导致 CPU 被限频了？
- 我的任务对性能要求比较高，比如指纹解锁，能不能把我这个任务持续放到 CPU 超大核去运行？
- 我的前台应用任务线程长时间处于 Runnable 状态无法执行而卡顿，当前到底是什么任务在抢占了 CPU 资源在运行？

#### 系统事件

此部分中的直方图会显示特定的系统级事件，例如特定对象的纹理计数和总大小。

值得仔细检查的直方图是标记为 SurfaceView 的直方图。计数表示已传递到显示管道并等待显示在设备屏幕上的组合帧缓冲区的数量。由于大多数设备都会进行双重或三重缓冲，因此该计数几乎总为 0、1 或 2。

描绘 `Surface Flinger` 进程（包括 `VSync` 事件和界面线程交换工作）的其他直方图，如图所示：

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062340790.png)

#### 显示帧

描绘了一条多色线条，后面是成堆的条形。这些形状表示已创建的特定线程的状态和帧堆栈。堆栈的每个层级代表对 `beginSection()` 的一次调用，或您为应用或游戏定义的自定义跟踪事件的开头。
![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062341735.png)

每个条形堆上方的多色线条表示特定线程随时间变化的一组状态。每段线条可以包含以下颜色之一：

- 绿色：正在运行\
  线程正在完成与某个进程相关的工作或正在响应中断。
- 蓝色：可运行\
  线程可以运行但目前未进行调度。
- 白色：休眠\
  线程没有可执行的任务，可能是因为线程在遇到斥锁定时被阻止。
- 橙色：不可中断的休眠\
  线程在遇到 I/O 操作时被阻止或正在等待磁盘操作完成。
- 紫色：可中断的休眠\
  线程在遇到另一项内核操作（通常是内存管理）时被阻止。

**注意：** 在 Systrace 报告中，你可以点击该线条以确定该线程在给定时间由哪个 CPU 控制。

### 键盘快捷键

查看 `Systrace` 报告时可以使用的键盘快捷键：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062343681.png)
常用的快捷键：

- **W** : 放大 Systrace , 放大可以更好地看清局部细节
- **S** : 缩小 Systrace, 缩小以查看整体
- **A** : 左移
- **D** : 右移
- **M** : 高亮选中当前鼠标点击的段(这个比较常用,可以快速标识出这个方法的左右边界和执行时间,方便上下查看)

鼠标模式快捷切换 : 主要是针对鼠标的工作模式进行切换 , 默认是 1 ,也就是选择模式,查看 Systrace 的时候,需要经常在各个模式之间切换 , 所以点击切换模式效率比较低,直接用快捷键切换效率要高很多

- **数字键1** : 切换到 **Selection 模式** , 这个模式下鼠标可以点击某一个段查看其详细信息, 一般打开 Systrace 默认就是这个模式 , 也是最常用的一个模式 , 配合 M 和 ASDW 可以做基本的操作
- **数字键2** : 切换到 **Pan 模式** , 这个模式下长按鼠标可以左右拖动, 有时候会用到
- **数字键3** : 切换到 **Zoom 模式** , 这个模式下长按鼠标可以放大和缩小, 有时候会用到
- **数字键4** : 切换到 **Timing 模式** , 这个模式下主要是用来衡量时间的,比如选择一个起点, 选择一个终点, 查看起点和终点这中间的操作所花费的时间 ![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617001429.png)

上面的模式依次和下面图标的模式一样：
![image.png|100](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617001144.png)

### 使用工具帮助定位性能问题

浏览 Systrace 报告时，您可以通过执行以下一项或多项操作来更轻松地识别性能问题：

- 通过在时间间隔周围绘制一个矩形来选择所需的时间间隔。
- 使用标尺工具标记或突出显示问题区域。
- 依次点击 `View Options > Highlight VSync`，以显示每项显示屏刷新操作。
- 如果觉得页面中的信息太多了，想要筛选，可以点击 Processes 菜单，在弹出列表中进行筛选，选择要查看的进程。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062345097.png)

- 选择一个区域，按住 `M` 可以高亮该选中块

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406180819413.png)

### 检查界面帧和提醒

如图所示，Systrace 报告列出了渲染界面帧的每个进程，并指明了沿时间轴渲染的每个帧。在 16.6 毫秒内渲染的必须保持每秒 60 帧稳定帧速率的帧会以绿色圆圈表示。渲染时间超过 16.6 毫秒的帧会以黄色或红色帧圆圈表示。

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062346119.png)

点击某个帧圆圈可将其突出显示，并提供有关系统为渲染该帧所做工作的其他信息，包括提醒。此报告还会显示系统在渲染该帧时执行的方法。您可以调查这些方法以确定界面卡顿的可能原因。

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062347658.png)
如果所示，选择有问题的帧后，跟踪报告下方会显示一条提醒，用于指明问题所在。

选择运行速度慢的帧后，您可能会在报告的底部窗格中看到一条提醒。

点击窗口最右侧的 `Alerts` 标签页可以查看此工具在你的跟踪记录中发现的每条提醒以及设备触发每条提醒的次数，如下图所示。`Alerts` 面板可帮助你了解跟踪记录中出现的问题以及这些问题导致出现卡顿的频率。我们也可以将此面板视为要修正的错误列表。通常情况下，只需对一个区域进行细微改动或改进即可移除整组提醒。

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406062348691.png)

### Systrace的扩展使用

Systrace（系统跟踪）仅在系统级别显示进程的相关信息，这样导致有时很难知道 APP 的哪些方法是在给定时间针对系统事件执行的。

例如，我们在解决卡顿问题，当查看系统跟踪信息输出后，你可能会怀疑应用中的某些方法是导致卡顿的因素。例如，如果时间轴显示某个帧的呈现速度较慢是因为 RecyclerView 花费很长时间导致的，这时我们需要更多的信息来进行判断。

我们可以在相关代码中添加跟踪标记（定义自定义事件），然后重新运行 systrace 以获取更多信息。在新的系统跟踪信息中，时间轴会显示应用中的方法的调用时间和执行时长。

#### 定义自定义事件

Android 平台提供了一个跟踪 API，可用于为特定的代码段添加标签。如果您捕获应用的“调试”版本的新系统跟踪并添加 `-a` 选项（如以下代码段所示），这些自定义事件便会显示在 `Systrace` 报告中：

```shell
python systrace.py -a com.example.myapp -b 16384 \
  -o my_systrace_report.html sched freq idle am wm gfx view binder_driver hal \
  dalvik camera input res
```

必须提供 `-a` 选项才能跟踪应用；如果没有此选项，应用的方法将不会显示在 `Systrace` 报告中。

注意：该方法与使用 `Debug` 类不同，后者可帮助您通过生成 `.trace` 文件来检查应用 `CPU` 的详细使用情况。

#### 代码中添加

在 `Android 4.3`（API 级别 18）及更高版本中，我们可以在代码中使用 `Trace` 类来定义随后会出现在 `Perfetto` 和 `Systrace` 报告中的自定义事件，如以下代码段所示。

```java
public class MyAdapter extends RecyclerView.Adapter<MyViewHolder> {
	@Override
	public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
		Trace.beginSection("MyAdapter.onCreateViewHolder");
		MyViewHolder myViewHolder;
		try {
			myViewHolder = MyViewHolder.newInstance(parent);
		} finally {
			// In try and catch statements, always call "endSection()" in a
			// "finally" block. That way, the method is invoked even when an
			// exception occurs.
			Trace.endSection();
		}
		return myViewHolder;
	}
   @Override
	public void onBindViewHolder(MyViewHolder holder, int position) {
		Trace.beginSection("MyAdapter.onBindViewHolder");
		try {
			try {
				Trace.beginSection("MyAdapter.queryDatabase");
				RowItem rowItem = queryDatabase(position);
				dataset.add(rowItem);
			} finally {
				Trace.endSection();
			}
			holder.bind(dataset.get(position));
		} finally {
			Trace.endSection();
		}
	}
}
```

注意：如果多次调用 `beginSection()`，调用 `endSection()` 只会结束最后调用的 `beginSection()` 方法。因此，对于嵌套调用（如以下代码段中所示），请务必将每次对 `beginSection()` 的调用与一次对 `endSection()` 的调用正确匹配。

此外，我们不能在一个线程上调用 `beginSection()`，而在另一个线程上结束它；而是必须在同一个线程上调用这两个方法。

### `Systrace` 下载

谷歌官方在22年3月发布的`33.0.1`版本的platform-tools包中移除了`systrace`

需要使用 `systrace` 需要比`33.0.1`更低的 sdk 包
下载SDK历史版本的方法：

```
https://dl.google.com/android/repository/platform-tools_r[版本]-[系统].zip
```

**示例：** 下载33.0.0的SDK包：

- <https://dl.google.com/android/repository/platform-tools_r33.0.0-linux.zip>
- <https://dl.google.com/android/repository/platform-tools_r33.0.0-windows.zip>
- <https://dl.google.com/android/repository/platform-tools_r33.0.0-darwin.zip>

`systrace.py` 需要用 Python 2.7 版本：
[Python Release Python 2.7.18 | Python.org](https://www.python.org/downloads/release/python-2718/)

## Ref

- [Overview of system tracing --官方](https://developer.android.com/topic/performance/tracing)

- [Systrace入门_systrace使用-CSDN博客](https://blog.csdn.net/qq_23452385/article/details/131566907)

- Systrace 系列 - 高爷

| 文章链接                                                                                                                          | 备注                    |
| :---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [Android 性能优化的术、道、器 · Android Performance](https://www.androidperformance.com/2022/01/07/The-Performace-1-Performance-Tools/) | 性能优化工具介绍              |
| [Android Systrace 基础知识 -- Systrace 简介](https://www.androidperformance.com/2019/05/28/Android-Systrace-About/)                 | `Systrace` 介绍和命令行工具使用 |
|                                                                                                                               |                       |
|                                                                                                                               |                       |
|                                                                                                                               |                       |
|                                                                                                                               |                       |
