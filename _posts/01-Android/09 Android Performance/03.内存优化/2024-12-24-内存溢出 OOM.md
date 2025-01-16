---
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
dg-publish: true
---

# 内存泄漏OOM

## Android的 Java程序为什么容易出现OOM

Android中一个进程对应着一个虚拟机，Android系统对虚拟机的vm heapsize做了限制，当Java进程申请的Java堆空间超过阈值时，就会OOM<br />查看进程headpsize限制：`adb shell getprop`，查看`dalvik.vm.heapsize`值

> [dalvik.vm.heapgrowthlimit]: [256m]
>
> [dalvik.vm.heapmaxfree]: [8m]
>
> [dalvik.vm.heapminfree]: [512k]
>
> [dalvik.vm.heapsize]: [512m]
>
> [dalvik.vm.heapstartsize]: [8m]

1. **heapstartsize**：App启动的初始分配内存
2. **heapgrowthlimit**：APP能够分配到的最大限制
3. **heapsize**：开启largeHeap='true'的最大限制

程序发生OOM并不是物理内存不足，可能是刚好申请的内存超过了`dalvik.vm.heapsize`大小；在物理内存充足的情况下，也是有可能发生OOM的。<br />这样做的目的是为了让Android系统能同时让更多的进程常驻内存，这样程序启动时，不需要每次都冷启动了，能够更快的响应用户。

## Low Memory Killer

## OOM分类

# ![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654480292507-004ca97d-6a99-4837-8b44-b62001c86624.png#averageHue=%23bdd9f5&clientId=u31e45dd9-34aa-4&errorMessage=unknown%20error&from=paste&id=u8baab487&originHeight=682&originWidth=704&originalType=url&ratio=1&rotation=0&showTitle=false&size=53344&status=error&style=none&taskId=ucdb1dd40-d093-4756-b9d9-d29f4e29bfa&title=)

### Java堆内存不足

Android中最常见的OOM就是Java堆内存不足，对于堆内存不足导致的OOM问题，发生Crash时的堆栈信息往往只是“压死骆驼的最后一根稻草”，它并不能有效帮助我们准确地定位到问题。<br />堆内存分配失败，通常说明进程中大部分的内存已经被占用了，且不能被垃圾回收器回收，一般来说此时内存占用都存在一些问题，例如内存泄漏等。要想定位到问题所在，就需要知道进程中的内存都被哪些对象占用，以及这些对象的引用链路。而这些信息都可以在Java内存快照文件中得到，调用`Debug.dumpHprofData(String fileName)`函数就可以得到当前进程的Java内存快照文件（即`HPROF文件`）。所以，关键在于要获得进程的内存快照，由于dump函数比较耗时，在发生OOM之后再去执行dump操作，很可能无法得到完整的内存快照文件。<br />可以参考Probe(美团)对于线上场景做了内存监控，在一个后台线程中每隔1S去获取当前进程的内存占用（通过Runtime.getRuntime.totalMemory()-Runtime.getRuntime.freeMemory()计算得到），当内存占用达到设定的阈值时（阈值根据当前系统分配给应用的最大内存计算），就去执行dump函数，得到内存快照文件。<br /> 在得到内存快照文件之后，我们有两种思路，一种想法是直接将HPROF文件回传到服务器，我们拿到文件后就可以使用分析工具进行分析。另一种想法是在用户手机上直接分析HPROF文件，将分析完得到的分析结果回传给服务器。<br />快手的`KOOM`，美团的`Probe`

### 线程数量超出限制

`/proc/sys/kernel/threads-max`规定了每个进程创建线程数目的上限。在华为的部分机型上，这个上限被修改的很低（大约500），比较容易出现线程数溢出的问题，而大部分手机这个限制都很大（一般为1W多）。在这些手机上创建线程失败大多都是因为虚拟内存空间耗尽导致的，进程所使用的虚拟内存可以查看`/proc/pid/status`的`VmPeak/VmSize`记录。<br /> 当线程超过系统设置的上限，也会导致OOM的发生，报错：`pthread_create (1040KB stack) failed: Out of memory`。通常处理方式如下：

1. 对App内部线程池进行统一，对于随意使用的异步任务统一改为使用线程池或者RxJava
2. 检查App内Timer，HandlerThread类的合理使用
3. 沟通内部其他团队的SDK中增加线程代理，统一使用App端的线程池，避免线程的随意使用
4. 分析合理可以替换的线程或者线程池进行插桩替换处理

> 治理第三方线程的，可能带来任务堆积导致卡顿问题

### **FD数超出限制**

当进程中的FD数量达到最大限制时，再去新建线程，在创建`JNIEnv`时会抛出OOM错误。但是FD数量超出限制除了会导致创建线程抛出OOM以外，还会导致很多其它的异常。<br />在`/proc/pid/limits`描述着Linux系统对对应进程的限制，其中`Max open files`就代表可创建FD的最大数目。进程中创建的FD记录在/proc/pid/fd中，通过遍历/proc/pid/fd，可以得到FD的信息。

### OOM相关问题

#### 如何定位分析OOM问题？

OOM在crash log中的stack trace一般没有实际意义，因为是在分配内存的时候才会抛出OOM异常，而这个时候的stack trace和OOM的原因没有任何关系。所以OOM问题的定位和分析就需要多花费一些功夫。

1. 可以根据堆栈信息的特征来确定这是哪一个类型的OOM，常见的是堆内存不足
2. 工具

- Memory Monitor
- MAT

#### 为什么dump内存数据会冻结APP？

为了保证 dump 过程中内存数据的不变性在执行 hprof.Dump() 之前会通过 `ScopedSuspendAll` （构造函数内调用了 SupendAll）暂停了所有 Java 线程，在 dump 结束后通过 ScopedSusendAll 析构函数中（通过 ResumeAll ）恢复线程

#### 内存优化工具：KOOM 相比较 LeakCanary 和 Matrix有什么区别？

KOOM 相比较 LeakCanary 和 Matrix 有点不同，LeakCanary和Matrix由于dump的整个过程会影响到主进程，所以基本只能用于线下监控。<https://github.com/KwaiAppTeam/KOOM><br />KOOM提出了fork dump，能在dump 分析内存泄漏的时候而不影响到主进程的应用运行，适合使用在线上监控。<br />所有的内存泄漏监控工具都离不开这三点：

1. 监控触发时机
2. dump内存堆栈
3. 分析hprof文件

**1、监控触发时机**<br />LeakCanary和Matrix都是在Activity onDestroy时触发泄漏检测的；KOOM是用阈值检测法来触发的，用一个MonitorThread每隔5秒轮训监控当前是否触发检测<br />**2、Dump内存堆栈**

> Dump hprof是通过虚拟机提供的API`dumpHprofData`来实现的，这个过程会冻结整个应用进程，造成数秒甚至数十秒内用户无法操作，这也是LeakCanary无法线上部署的最主要的原因。

KOOM使用fork dump操作，从当前主进程fork出一个子进程，由于Linux的copy-on-write机制，子进程和父进程共享的是一块内存，那么我们就可以在子进程进行dump堆栈，不影响主进程的运行<br />**3、分析HPROF文件**<br />`HAHA`库<br />KOOM对解析做了优化。

#### OutOfMemoryError 可以被 try catch 吗？

OutOfMemoryError 是可以 try catch 的。捕获OOM没有意义，你无法保证你 catch 的代码就是导致 OOM 的原因，可能它只是压死骆驼的最后一根稻草，甚至你也无法保证你的 catch 代码块中不会再次触发 OOM

### 适配64位

内存oom大幅减少
