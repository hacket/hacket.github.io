---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
dg-publish: true
---

# JVM基础

## JVM概念

JVM是java的核心，是Java可以一次编译到处运行的本质所在。<br>JVM与操作系统的关系:<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582582316-34d20597-b901-465f-8b65-5bd6a21ee511.png#averageHue=%23fbf8f7&clientId=u9bbe1740-557f-4&from=paste&id=udf78bd3e&originHeight=890&originWidth=2106&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0055fa1a-09f3-4156-aef0-14db0186c8e&title=)<br>从图中可以看到，有了 JVM 这个抽象层之后，Java 就可以实现跨平台了。JVM 只需要保证能够正确执行 .class 文件，就可以运行在诸如 Linux、Windows、MacOS 等平台上了。

## JVM的组成和运行原理

JVM有多种实现，使用最广泛的是Oracle的HotSpot JVM。

### JVM在JDK中的位置

JDK是java开发的必备工具箱，JDK其中有一部分是JRE，JRE是JAVA运行环境，JVM则是JRE最核心的部分。下图是JDK Standard Edition的组成图：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582600243-7b17f9ae-7a8c-415c-a6fb-1fbb6b0d6e1f.png#averageHue=%23d7a230&clientId=u9bbe1740-557f-4&from=paste&id=u5720356e&originHeight=499&originWidth=690&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub13c8da6-0133-4975-895e-c4502d335dd&title=)<br>HotSpot是Oracle关于JVM的商标，区别于IBM，HP等厂商开发的JVM。`Java HotSpot Client VM`和`Java HotSpot Server VM`是JDK关于JVM的两种不同的实现，前者可以减少启动时间和内存占用，而后者则提供更加优秀的程序运行速度。

### JVM组成

JVM由四大部分组成：ClassLoader，Runtime Data Area，Execution Engine，Native interface。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582614337-4128dd6a-aada-4908-b5e5-f226fa4ed1e1.png#averageHue=%23dfdf9f&clientId=u9bbe1740-557f-4&from=paste&id=u6c362366&originHeight=384&originWidth=606&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6f46f607-dd5b-4571-b1b9-483ceb1fcc0&title=)<br>或者：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582623273-184b8109-ae3c-452f-af14-6a4118c1a571.png#averageHue=%23e1d7c9&clientId=u9bbe1740-557f-4&from=paste&id=ud052a6bf&originHeight=930&originWidth=966&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud2007b81-c545-4c51-9216-d0364ceec12&title=)

#### ClassLoader 类加载器

ClassLoader是负责加载class文件。class文件在文件开头有特定的文件标示，并且ClassLoader只负责class文件的加载，至于它是否可以运行，则由Execution Engine决定。

#### Native Interface 本地接口

Native Interface是负责调用本地接口的。它的作用是调用不同语言的接口给Java用，它会在Native Method Stack中记录对应的本地方法，然后调用该方法时就通过Execution Engine加载对应的本地lib。原本多于用一些专业领域，如JAVA驱动，地图制作引擎等，现在关于这种本地方法接口的调用已经被类似于Socket通信，WebService等方式取代。

#### Execution Engine 执行引擎

Execution Engine是执行引擎，也叫Interpreter。class文件被加载后，会把指令和数据信息放入内存中，Execution Engine则负责把这些命令解释给操作系统。

#### Runtime Data Area 运行时数据区

Runtime Data Area是存放数据的。分为五部分：Stack、Heap、Method Area、PC Register、Native Method Stack。几乎所有的关于Java内存方面的问题，都是集中在这块。<br>具体参考：`JVM Runtime Data Area.md`<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582648948-58410003-241c-4762-9052-9b745531178d.png#averageHue=%23e7f0d7&clientId=u9bbe1740-557f-4&from=paste&id=u854ecaf8&originHeight=419&originWidth=823&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua803274b-1228-4324-a928-5340363b639&title=)

## JVM运行原理简介

Java程序被javac工具编译成.class字节码文件后，我们执行java命令，该class文件便被JVM的ClassLoader加载。可以看出JVM的启动是通过JAVA Path下的java.exe或者java进行的。JVM的初始化、运行到结束大概包括这么几步：<br>调用操作系统API判断系统的CPU架构，根据对应CPU类型寻找位于JRE目录下的/lib/jvm.cfg文件，然后通过该配置文件找到对应的jvm.dll文件（如果我们参数中有-server或者-client，则加载对应参数所指定的jvm.dll，启动指定类型的JVM），初始化jvm.dll并且挂接到JNIENV结构的实例上，之后就可以通过JNIENV实例装载并且处理class文件了。class文件是字节码文件，它按照JVM的规范，定义了变量，方法等的详细信息，JVM管理并且分配对应的内存来执行程序，同时管理垃圾回收。直到程序结束，一种情况是JVM的所有非守护线程停止，一种情况是程序调用System.exit()，JVM的生命周期也结束。

## JVM学习类图

- 「深入理解Java虚拟机:JVM高级特性与最佳实践(第2版)」时记录的笔记<br> ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582663490-e010258a-f867-4ebd-9ee0-802d51c55d9a.png#averageHue=%233b4245&clientId=u9bbe1740-557f-4&from=paste&id=u742a8faa&originHeight=2856&originWidth=3678&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u15c267c0-51ea-42bf-ba42-c3c6a3f33f9&title=)
- 实战JVM虚拟机

![jvm-实战Java虚拟机脑图.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1693584263661-e9bf2606-c21c-4db5-b68d-2338391515fc.jpeg#averageHue=%23eaecee&clientId=ue0fc1c56-db9c-4&from=paste&height=515&id=u18867a90&originHeight=772&originWidth=1201&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=126740&status=done&style=none&taskId=udbdf5e5b-c6f8-4651-83f3-0474d871fc3&title=&width=800.6666666666666)

![JVM详细学习路径脑图.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584283269-75c5a807-ea26-40fe-b25a-2ffceb3820cd.png#averageHue=%233b4245&clientId=ue0fc1c56-db9c-4&from=paste&height=1904&id=u4f68c7c7&originHeight=2856&originWidth=3678&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1211311&status=done&style=none&taskId=uab431151-1c29-4fe6-9815-a2df2b070c1&title=&width=2452)
