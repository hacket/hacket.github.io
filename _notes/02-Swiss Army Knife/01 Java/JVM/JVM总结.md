---
date created: 2024-12-27 23:44
date updated: 2024-12-27 23:44
dg-publish: true
---

# JVM地位？

JVM是Java的核心，是Java可以一次编译到处运行的本质所在。<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1659284561458-ef754fc8-42c1-4b3c-8b68-f4e6232ea328.png#averageHue=%23fcfbfa&clientId=u13fb6bc4-6222-4&from=paste&height=422&id=uc39d4023&originHeight=633&originWidth=1485&originalType=binary&ratio=1&rotation=0&showTitle=false&size=172074&status=done&style=shadow&taskId=ude8e1b06-5ba1-4d29-8a2b-7cb6b31af59&title=&width=990)

- .java文件通过javac编译成.class字节码文件
- 字节码通过类加载器加载解析类
- JVM运行在各个平台，屏蔽了平台的差异性，让Java一次编译到处运行

# JVM的组成

JVM由四大部分组成：**ClassLoader**，**Runtime Data Area**，**Execution Engine**，**Native interface**。<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671120793877-af702702-1887-41c6-9ed2-4355e727fb38.png#averageHue=%23dddfac&clientId=uaa2f35ea-f679-4&from=paste&height=365&id=uc1cfd46a&originHeight=548&originWidth=927&originalType=binary&ratio=1&rotation=0&showTitle=false&size=192363&status=done&style=shadow&taskId=ucfdf64c8-46db-408a-a719-d21760d3cbb&title=&width=618)

## ClassLoader 类加载器

ClassLoader是负责加载class文件。class文件在文件开头有特定的文件标示，并且ClassLoader只负责class文件的加载，至于它是否可以运行，则由Execution Engine决定。

### JVM加载class的过程？

## Runtime Data Area 运行时数据区

见`JVM Runtime Data Area.md`

## Native Interface 本地接口

Native Interface是负责调用本地接口的。它的作用是调用不同语言的接口给Java用，它会在Native Method Stack中记录对应的本地方法，然后调用该方法时就通过Execution Engine加载对应的本地lib。原本多于用一些专业领域，如JAVA驱动，地图制作引擎等，现在关于这种本地方法接口的调用已经被类似于Socket通信，WebService等方式取代。

## Execution Engine 执行引擎

Execution Engine是执行引擎，也叫Interpreter。class文件被加载后，会把指令和数据信息放入内存中，Execution Engine则负责把这些命令解释给操作系统。

# Java对象

## 对象内存分配策略？

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671202791672-1bf24970-3d58-44cd-af1e-4ea3d5c815a5.png#averageHue=%23e9d2ba&clientId=u67abfe37-c678-4&from=paste&height=228&id=u471ee4c9&originHeight=648&originWidth=1548&originalType=binary&ratio=1&rotation=0&showTitle=false&size=177585&status=done&style=shadow&taskId=u2b5f2e8d-8540-47a5-bcfe-b0146a0221e&title=&width=545)<br>**对象内存分配流程**：

1. 栈上分配？
2. TLAB
   1. 是，Eden TLAB区分配
   2. 否，是否大对象？
      1. 是，老年代
      2. 否，Eden

### 栈上分配

Java对象几乎都是在堆上分配内存的，如果对象数量较多，会给GC带来较大压力；为减少临时对象在堆内分配的数量，JVM通过逃逸分析确定该对象不会被外部访问，就将该对象在栈上分配内存，这样该对象所占用的内存空间可以随着栈帧出栈而销毁，减少GC压力。<br>**怎么确定是否能在栈上分配？**<br>确定一个对象不会逃逸出线程之外，那么让对象在栈上分配内存可以提高JVM的效率。

### 堆上分配

1. **对象优先在Eden Space分配**

> 大多数情况下，对象在新生代Eden区分配，当Eden分区没有足够空间分配时，JVM会发起一次Minor GC

2. **大对象直接进入Old Space**

> 最典型的大对象是那种很长的字符串以及数组。这样做的目的：1.避免大量内存复制,2.避免提前进行垃圾回收，明明内存有空间进行分配

3. **长期存活的对象进入Old Space**

> 如果对象在Eden出生并经过第一次Minor GC后仍然存活，并且能被Survivor容纳的话，将被移动到Survivor空间中，并将对象年龄设为1，对象在Survivor区中每熬过一次 Minor GC，年龄就增加1，当它的年龄增加到一定程度(并发的垃圾回收器默认为15),CMS是6时，就会被晋升到老年代中。

### 对象年龄动态判定

为了能更好地适应不同程序的内存状况，虚拟机并不是永远地要求对象的年龄必须达到了MaxTenuringThreshold才能晋升老年代，如果在Survivor空间中相同年龄所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄的对象就可以直接进入老年代，无须等到MaxTenuringThreshold中要求的年龄<br>**总结：**Survivor相同年龄对象大小总和大于Survivor空间的一半，大于等于该年龄的直接进入老年代

### 老年代空间分配担保

在发生Minor GC之前，虚拟机会先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果这个条件成立，那么MinorGC可以确保是安全的。如果不成立，则虚拟机会查看HandlePromotionFailure设置值是否允许担保失败。如果允许，那么会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次Minor GC，尽管这次Minor GC是有风险的，如果担保失败则会进行一次Full GC；如果小于，或者HandlePromotionFailure设置不允许冒险，那这时也要改为进行一次Full GC。

### 本地线程分配缓冲(TLAB)

一个Java对象在堆上分配的时候，主要是在Eden区上，如果启动了TLAB的话会优先在TLAB上分配，少数情况下也可能会直接分配在老年代中，分配规则并不是百分之百固定的，这取决于当前使用的是哪一种垃圾收集器，还有虚拟机中与内存有关的参数的设置。

### 什么是TLAB？

**TLAB**的全称是Thread Local Allocation Buffer，即线程本地分配缓存区，是线程在堆上专用的内存分配区域；在线程初始化时申请一块指定大小的内存，只给当前线程使用，这样每个线程都单独拥有一个空间，如果需要分配内存，就在自己的空间上分配，这样就不存在竞争的情况，可以大大提升分配效率。<br>**目的：**尽量避免从堆上直接分配内存从而避免频繁的锁争用。<br>**TLAB大小：**TLAB空间的内存非常小，缺省情况下仅占有整个Eden空间的1%。<br>**TLAB分配大对象**<br>遇到TLAB中无法分配的大对象，对象还是可能在eden区或者老年代等区域进⾏分配的，但是这种分配就需要进⾏同步控制（即采⽤CAS配上失败重试的方式），这也是为什么我们经常说：小的对象比大的对象分配起来更加高效。

## Java对象创建流程

1. **类加载检查**

> 虚拟机遇到一条new指令时，首先将去检查这个指令的参数是否能在常量池中定位到一个类的符号引用，并且检查这个符号引用代表的类是否已被加载、解析和初始化过。如果没有，那必须先执行相应的类加载过程。

2. **为新生对象分配内存**

> 对象所需大小在类加载完成后便可完全确定，分配内存的两个问题：
>
> - **如何划分内存**
>   - 指针碰撞，默认，堆内存规整，已使用内存在一边，未使用内存在另一边，中间分界为指示器
>   - 空闲列表，堆内存不规整，维护者一个记录可以内存块的列表，分配时优先从空闲列表找到合适的空间分配对象，并更新列表上的记录
> - **分配内存线程安全**
>   - 同步处理内存分配行为：CAS
>   - TLAB，本地线程分配缓冲

3. **将内存空间初始化为零**

> 内存分配完成后，虚拟机需要将分配到的内存空间初始化为零（不包括对象头）

4. **设置对象头**

> 初始化零值之后，虚拟机要对对象进行必要的设置，例如这个对象是哪个类的实例、如何才能找到类的元数据信息、对象的哈希码、对象的GC分代年龄等信息。这些信息存放在对象的对象头Object Header之中。

5. **执行**`**<init>**`**方法**

**Java对象组成**<br>Java的对象头由以下三部分组成：

1. Mark Word 标记字段

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671643252286-40d6cdca-8174-4d54-8256-b2d5aafddb74.png#averageHue=%23ebebeb&clientId=u4b89e3a8-f2ad-4&from=paste&height=375&id=u544059fa&originHeight=563&originWidth=1494&originalType=binary&ratio=1&rotation=0&showTitle=false&size=89797&status=done&style=shadow&taskId=ue13f309f-ebe6-479f-af6a-f9fb289b01b&title=&width=996)

2. Klass Point 指向类的指针
3. 数组长度（只有数组对象才有）

# Android VM

## JVM和DVM(DalvikVM)区别？

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671641437507-30d7a27c-8630-4d17-947a-046440040ddf.png#averageHue=%23f4f4f4&clientId=ubd20c5f7-d890-4&from=paste&height=449&id=uee49cba8&originHeight=1237&originWidth=1090&originalType=binary&ratio=1&rotation=0&showTitle=false&size=158314&status=done&style=shadow&taskId=ua67f1762-c0f9-4250-8e92-8490e11e940&title=&width=395.66668701171875)

1. **执行的文件格式不同**

> JVM运行的是class字节码文件，而DVM运行自己定义的dex文件格式

2. **是否可以同时存在多个虚拟机**

> JVM只能同时存在一个实例；DVM可同时存在多个实例（好处是，其他DVM实例挂了，不会影响其他应用，保证了系统稳定性）

3. **JVM是以基于栈的虚拟机(Stack-based)；而Dalvik是基于寄存器的虚拟机(Register-based)**

> JVM设计成基于栈架构：
>
> 1. 基于栈架构的指令集更容易生成
> 2. 节省资源。其零地址指令比其他指令更加紧凑
> 3. 可移植性。

DVM为什么基于寄存器

> 1. Android手机制造商的处理器绝大部分都是基于寄存器架构的
> 2. 栈架构中有更多的指令分派和访问内存，这些比较耗时。所有相对来认为DVM的执行效率更高一些
> 3. DVM就是为Android运行而设计的，无需考虑其他平台的通用

4. **类加载的系统与JVM区别较大**

> - Android类加载器和Java的类加载器工作机制是类似的，使用双亲委托机制
> - 类的继承体系不同
> - BootClassLoader和Java的BootStrapClassLoader区别

## Dalvik VM与ART区别

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671642200204-27b06ed6-6f73-4c22-86bf-abc3485e3e70.png#averageHue=%23f8f6f5&clientId=u4b89e3a8-f2ad-4&from=paste&height=472&id=uce6e6f3f&originHeight=1171&originWidth=1365&originalType=binary&ratio=1&rotation=0&showTitle=false&size=121005&status=done&style=shadow&taskId=u400c7548-b151-448b-814a-3c437c75a7e&title=&width=550)

### Dalvik使用JIT，ART使用AOT

Dalvik 使⽤ JIT(Just-In-Time)即时编译，而ART使用AOT(Ahead-OfTime)预先编译。AOT 和 JIT 的不同之处在于，JIT 是在运行时进行编译，是动态编译，并且每次运行程序的时候都需要对 odex 重新进行编译；而AOT 是静态编译，应用在安装的时候会启动 dex2oat 过程把 dex预编译成oat文件，每次运行程序的时候不用重新编译<br>ART相比Dalvik，内存分配的效率提⾼了10倍，GC的效率提高了2-3倍

### ART GC性能的提升

**Dalvik中GC的问题**

1. GC时挂起所有线程
2. 大而连续的空间资源紧张
3. 内存碎片化严重

**ART GC**

1. 在ART中标记不需要挂起所有程序的线程：ART中GC会要求程序在分配空间时标记自身的堆栈，这个过程非常短，不需要挂起所有程序的线程，这种标记时机的变更使得中断和阻塞的时间更短
2. 提供LOS（Large Object Space）：专供Bitmap使用，解决大对象的内存分配和存储问题，从而提高了GC的管理效率和整体性能
3. ART有moving collector实例来压缩活动对象，使得内存空间更加紧凑，从而达到GC整体性能的巨大提升

### ART不足

AOT 解决了应⽤启动和运⾏速度问题的同时也带来了另外两个问题

- 应⽤安装和系统升级之后的应⽤安装时间⽐较⻓
- 优化后的⽂件会占⽤额外的存储空间（⼤致增加10%-20%）

在 Android 7 之后，JIT 回归，形成了 AOT/JIT 混合编译模式，以获得安装时间、内存占⽤、电池消耗和性能之间的最佳折衷。这种混合编译模式的特点是：应⽤在安装的时候 dex 不会被编译，应⽤在运⾏时 dex ⽂件先通过解释器执⾏，热点代码会被识别并被 JIT 编译后存储在 Code cache 中⽣成 profile ⽂件，在⼿机进⼊ IDLE（空闲）或者 Charging（充电）状态的时候，系统会扫描 App ⽬录下的 profile ⽂件并执⾏ AOT 过程进⾏编译。这样⼀说，其实是和 HotSpot 有点内味。

### DexOpt与DexAot

- DexOpt：对 dex ⽂件进⾏验证和优化为odex(Optimized dex)⽂件，例如某个⽅法的调⽤指令，会把虚拟的调⽤转换为使⽤具体的index，这样在执⾏的时候就不⽤再查找了
- DexAot：在安装时对 dex ⽂件执⾏DexOpt优化之后再将odex进⾏AOT 提前编译操作，编译为OAT（Optimized Android file Type）可执⾏⽂件（机器码）

# 虚拟机优化技术

# JVM面试题

## 对象一定分配在堆上分配内存吗？

否，也可能在栈上分配。通过逃逸分析，将不会逃出方法内的对象分配在栈上。

## 如何保证分配内存线程安全？

1. CAS + 失败重试的方式
2. 把内存分配行为 按照线程 划分在不同的内存空间进行

> 每个线程在Java堆中预先分配一小块内存，称为TLAB(Thread Local Allocation Buffer)本地线程分配缓冲，哪个线程要分配内存就在哪个线程的TLAB上分配内存，只有线程专有的TLAB用完并分配新的TLAB时才需要同步锁

## JVM如何实现反射的？

## JVM如何实现泛型的？

## JVM如何实现异常的？

# Ref

## JVM 一网打尽！（口水话系列第一弹）

最近花了一周左右，把 JVM 从头到尾彻底整理了一下。不夸张的说，应该是史上最全了。有以下三个特点：<br>1. 语言精练，这个我是准备自己面试时遇到相关问题该怎么回答的，所以偏向于总结，语言也相对于平和和精练。<br>2. 全面，关于 JVM 我也看了几本书以及几个专栏，基本上涵盖了你所能想到的所有知识点。<br>3. 权威且无误，JVM 相关知识大多都是理论，我也是从自己所看所学进行总结的，写完之后，自己也读了几遍，当然，如果有误，可以向我反馈 :)<br>[链接](https://github.com/Omooo/Android-Notes/blob/master/blogs/Java/%E5%8F%A3%E6%B0%B4%E8%AF%9D/JVM%20%E7%9B%B8%E5%85%B3%E5%8F%A3%E6%B0%B4%E8%AF%9D.md)

## <https://github.com/doocs/jvm> （详细）

> JVM 底层原理最全知识总结
