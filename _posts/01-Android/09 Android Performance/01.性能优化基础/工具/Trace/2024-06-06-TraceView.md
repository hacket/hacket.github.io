---
date created: 2024-06-06 08:17
date updated: 2024-12-24 00:38
dg-publish: true
---

# TraceView

## 什么是 TraceView？

`TraceView` 是 Android SDK 自带的工具，用来分析函数调用过程，可以对 Android 的应用程序及 Framework 层的代码进行性能分析。

`TraceView` 提供了一个图形化界面，用于查看应用程序的执行日志。它可以帮助开发者调试应用程序并分析其性能，通过执行日志中的时间戳揭示程序执行期间的方法调用和执行时间。`TraceView` 工具能呈现程序运行时的方法调用栈以及每个方法的执行时间，这对于找到性能瓶颈和优化代码非常有用。

## 使用方式

### 获取 trace 文件

#### DDMS

1. DDMS，点击 `Start Method Profiling` 开始，`Stop Method Profiling` 结束
2. 结束自动跳转到 TraceView 视图

使用方便，监控范围不够精确

#### 代码加入调试语句

1. 开始监控地方调用：`Debug.startMethodTracing()`
2. 结束的地方调用：`Debug.stopMethodTracing()`
3. 在 sd 卡创建：`<trace-name>.trace` 文件
4. 使用 traceview 打开文件

`。trace` 文件包含了方法名跟踪数据，线程和方法名的映射表

## TraceView 的局限性

- **性能开销**：使用 TraceView 进行跟踪时，会对应用的性能产生一定影响。这是因为跟踪操作会增加额外的处理负担。

- **方法跟踪限制**：TraceView 主要是通过跟踪 Dalvik 字节码的方法调用来工作的。这意味着它对于本地代码（C/C++）或者通过 JNI 层调用的代码分析能力比较有限。

- **用户界面** (UI)：TraceView 的界面相对复杂，可能需要一段时间来熟悉其所有的功能和选项。

- **新的分析工具**：自从引入了 Android Profiler 之后，Google 逐渐减少了对 TraceView 的支持，并推荐使用 Android Profiler 这一新的性能分析工具。

- 不再维护：在旧版本的 Android Studio 中，TraceView 很多时候无法正常工作，且随着 Android Studio 的更新，Google 也越来越少提到 TraceView。
