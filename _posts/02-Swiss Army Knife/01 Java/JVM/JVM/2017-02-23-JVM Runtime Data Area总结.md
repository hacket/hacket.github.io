---
date_created: Friday, February 23rd 2017, 10:10:44 pm
date_updated: Thursday, January 23rd 2025, 12:30:06 am
title: JVM Runtime Data Area总结
author: hacket
categories:
  - Java&Kotlin
category: JVM
tags: [JVM]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
aliases: [JVM Runtime Data Area]
linter-yaml-title-alias: JVM Runtime Data Area
---

# JVM Runtime Data Area

Runtime Data Area 是存放数据的。分为五部分：Stack、Heap、Method Area、PC Register、Native Method Stack。几乎所有的关于 Java 内存方面的问题，都是集中在这块。

### 运行时数据区介绍

Java 中的运⾏时数据可以划分为两部分，⼀部分是**线程私有的**，包括 _ 虚拟机栈 _、_本地⽅法栈_、_程序计数器_，另⼀部分是**线程共享的**，包括 _ 方法区 _ 和 _ 堆 _。其中线程私有内存区会随线程产生和消亡，因此不需要过多考虑内存回收的问题，并且它在编译时就确定了所需内存的大小。<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671161568441-cec69b1f-40a7-4a3b-bda0-bcb049d3dd37.png#averageHue=%23dfa801&clientId=uaa2f35ea-f679-4&from=paste&height=158&id=u1aeae0fd&originHeight=237&originWidth=684&originalType=binary&ratio=1&rotation=0&showTitle=false&size=43985&status=done&style=none&taskId=u54b21120-d5a5-404e-a01a-458f09bba41&title=&width=456)

#### 线程私有：随着线程消亡而自动回收，不需要 GC 管理

1. **虚拟机栈** VM Stack：方法执行的内存区，每个方法执行时会在虚拟机栈中创建栈帧
2. **程序计数器 **PC Register：记录正在执行的虚拟机字节码地址
3. **本地方法栈 **Native Method Stack：虚拟机 native 方法执行的内存区

#### 线程共享：GC 管理

1. **堆 Heap**：new 出来的对象内存区域
2. **方法区 **Method Area：存放类信息、常量、静态变量、编译器编译后的代码等数据；常量池：存放编译器生成的各种字面量和符号引用，是方法区的一部分

### VM Stack 虚拟机栈

> 线程私有，FILO 数据结构。

虚拟机栈描述的是 Java 方法执行的内存模型，虚拟机栈存储着当前线程运行方法所需的数据，指令、返回地址。虚拟机栈里的每条数据，就是栈帧。<br>在每个 Java 方法被调用的时候，都会创建一个栈帧，并入栈。一旦完成相应的调用，则出栈。所有的栈帧都出栈后，线程也就结束了。<br>**StackFrame**包含主要包含信息：局部变量表、操作数栈、动态连接地址、返回地址。<br>**JVM 的指令集是基于栈而不是寄存器，基于栈可以具备很好的跨平台性。**<br>**栈之 GC**<br>栈是不需要垃圾回收的，栈中的对象如果用垃圾回收的观点来看，他永远是 live 状态，是可以 reachable 的，所以也不需要回收，它占有的空间随着 Thread 的结束而释放。<br>**虚拟机栈执行示例**<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671162054673-54ecf4be-16d9-4f8f-81d7-de3a8524af58.png#averageHue=%23f4f4f4&clientId=uaa2f35ea-f679-4&from=paste&height=763&id=u5bcb8ac0&originHeight=1144&originWidth=1664&originalType=binary&ratio=1&rotation=0&showTitle=false&size=591213&status=done&style=none&taskId=ufbadafef-f56b-4963-9256-6e8acb82282&title=&width=1109.3333333333333)

### PC Register 程序计数器

> 线程私有，不会发生 OOM

程序计数器是一块很小的内存空间，它可以看作是当前线程所执行的字节码的行号指示器；主要用来记录各个线程执行的字节码的地址（例如，分支、循环、跳转、异常、线程恢复等都依赖于计数器）<br>**为什么需要程序计数器？**<br>因为 Java 是多线程的，意味着线程切换。使用程序计数器能确保多线程情况下的程序正常执行。

### Native Method Stack 本地方法栈

> 线程私有。给 native 方法使用的栈，每个线程持有一个 Native Method Stack。

和虚拟机栈所发挥的作⽤是⾮常相似的，只不过本地⽅法栈描述的是 Native ⽅法执⾏的内存模型。这⼀块虚拟机规范是⽆强制规定的，各版本虚拟机⾃由实现，⽽ HotSpot 则直接把本地⽅法栈和虚拟机栈合⼆为⼀了。

### Method Area 方法区

方法区主要是用来存放已被虚拟机**加载的类相关信息，包括类信息、静态变量、常量、运行时常量池、字符串常量池。**JVM 对⽅法区的限制⽐较宽松，除了和 Java 堆⼀样不需要连续的内存和可以选择固定大小或者可扩展外，还可以选择不实现垃圾回收。相对而言，垃圾回收在这个区域是比较少出现的。

- 运行时常量池是方法区的一部分，它用来存储编译期生成的各种字面量和符号引用；运⾏时常量池相⽐ Class 文件常量池的⼀个重要的特点是具备动态性，也就是在运行期间也可能将新的常量放⼊池中，比如 String 的 intern 方法

**方法区是一种规范**，不同的虚拟机不同的版本实现不一样。

- JDK6.0 永久代在非堆区（Hotspot 虚拟机方法区的实现是永久代）
- JDK7.0 永久代的静态变量和运行时常量池被合并到了堆中
- JDK8.0 永久代被元空间取代了

> 很多开发者习惯将方法区称为 `永久代`，其实两者并不是等价的，HotSpot 虚拟机只是使用了永久代来实现方法区，但是在 JDK8.0+ 已经将方法区中实现的永久代去掉了，用元空间替换，元空间的存储位置是本地内存。

**JDK8.0 为什么使用元空间替换永久代？**

- 移除永久代是为了融合 HotSpot VM 和 JRockit VM，因为 JRockit VM 没有永久代；
- 永久代内存经常不够用，容易 OOM，Java7 中，指定的 PermGen 永久代区大小为 8M，由于 PermGen 永久代中类的元数据信息在每次 FullGC 的时候回收率都偏低，而且为 PermGen 永久代分配多大的空间很难确定，因为 PermSize 永久代的大小依赖于很多因素（如 JVM 加载的 class 总数、常量池的大小和方法的大小等）

#### 运行时常量池在不同版本的位置

- JDK6.0 运行时常量池位于永久代中。
- JDK7.0 开始将运行时常量池放置于 Java 堆中。
- JDK8.0 之后删去了方法区这个数据区，使用位于直接内存中的元空间取代了方法区，这时运行时常量池在元空间中，元空间用的是本地内存

### HEAP 堆

所有线程共享，伴随着 JVM 的启动而创建，负责存储所有对象实例和数组的；GC 管理的主要区域。

#### Heap 组成

堆的存储空间和栈一样是不需要连续的。<br>现代收集器基本上都是分代回收，Heap 还可以分为 `Young Generation` 和 `Old Generation` （也叫 Tenured Generation）两大部分。Young Generation 分为 `Eden` 和 `Survivor`，Survivor 又分为 `From Space` 和 `To Space。

- **Young Generation 新生代**
  - **Eden **存放新生的对象，对象优先分配至 Eden 区，当空间不足时，将触发 MinorGC
  - **Survivor **主要用于存储垃圾回收之后的存活对象
	- **From Space**
	- **To Space**
- **Old Generation 老年代 **存放生命周期较长的大对象

**对象的转移 Eden→Survivor→Old Space**<br>Eden 区里存放的是新生的对象；From Space 和 To Space 中存放的是每次垃圾回收后存活下来的对象，所以每次垃圾回收后，Eden 区会被清空；存活下来的对象先是放到 From Space，当 From Space 满了之后移动到 To Space；当 To Space 满了之后移动到 Old Space。Survivor 的两个区是对称的，没先后关系，所以同一个区中可能同时存在从 Eden 复制过来的对象和从前一个 Survivor 复制过来的对象，而复制到 Old Space 区的只有从第一个 Survivor 复制过来的对象。而且，Survivor 区总有一个是空的。同时，根据程序需要，Survivor 可以配置多个（多于 2 个），这样可以增加对象在 Young Generation 中存在的时间，减少被放到 Old Generation 的可能。<br>Old Space 中则存放生命周期比较长的对象，而且有些比较大的新生对象也放在 Old Space 中。

### 小结

- JVM 初始运行的时候都会分配好 Method Area（方法区）和 Heap（堆），而 JVM 每遇到一个线程，就为其分配一个 Program Counter Register（程序计数器）, VM Stack（虚拟机栈）和 Native Method Stack （本地方法栈），当线程终止时，三者（虚拟机栈，本地方法栈和程序计数器）所占用的内存空间也会被释放掉。

> 每当有线程被创建的时候，JVM 就需要为其在内存中分配虚拟机栈和本地方法栈来记录调用方法的内容，分配程序计数器记录指令执行的位置，这样的内存消耗就是创建线程的内存代价。

# 面试题

## 堆内存都是线程共享的吗？

堆内存并不是完完全全的线程共享，其 eden 区域中还是有⼀部分空间是分配给线程独享的。这⾥值得注意的是，我们说 TLAB 是线程独享的，但是只是在 " 分配 " 这个动作上是线程独享的，至于在读取、垃圾回收等动作上都是线程共享的，而且在使用上也没有什么区别。

> TLAB 是虚拟机在堆内存的 eden 划分出来的⼀块专用空间。

## 开线程影响哪块内存？

JVM 启动时会分配和 _Heap_ 和 _Method Area_ 线程共享的内存区域；每当有线程被创建的时候，JVM 就需要为其在内存中分配**虚拟机栈**和**本地方法栈**来记录被调用方法的内容，分配**程序计数器**记录指令执行的位置，这样的内存消耗就是创建线程的内存代价。

## 为什么会出现 StackOverflowError 异常？

每启动一个线程，JVM 都会为其分配一个 Java 虚拟机栈，线程私有的，每调用一个方法，都会被封装成一个栈帧，进行**压栈**操作，当方法执行完成之后，又会执行**弹栈**操作。而每个栈帧中，当前调用的方法的一些局部变量、动态连接，以及返回地址等数据。<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1649846827430-be27e795-ca61-49c1-b076-64f805a775b4.png#averageHue=%234b544b&clientId=u4977f736-bf28-4&from=paste&height=237&id=uca98e969&originHeight=474&originWidth=685&originalType=binary&ratio=1&rotation=0&showTitle=false&size=50838&status=done&style=none&taskId=ube671bb8-639c-491e-b0f7-85f90e09ec5&title=&width=342.5)<br>每次方法的调用，执行压栈的操作，但是每个栈帧，都是要消耗内存的。一旦超过了限制，就会爆掉，抛出 StackOverflowError。<br>虚拟机栈默认大小：<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1649846893448-7919fa58-dc1d-43ed-9b62-e3d0f6f813f7.png#averageHue=%23f6f3ed&clientId=u4977f736-bf28-4&from=paste&height=273&id=uf6b41e9b&originHeight=546&originWidth=1264&originalType=binary&ratio=1&rotation=0&showTitle=false&size=255364&status=done&style=none&taskId=u79f01591-b13f-491f-be38-af6847f5122&title=&width=632)
