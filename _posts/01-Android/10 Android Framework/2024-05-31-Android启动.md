---
date created: 2024-05-31 15:37
date updated: 2024-12-24 00:40
dg-publish: true
---

# Android架构

![image.png|500](https://cdn.nlark.com/yuque/0/2022/png/694278/1655392017128-c47148fd-ae16-4e10-ba8c-c1fe09f2f0f6.png#averageHue=%236da43d&clientId=u41c0985a-0594-4&from=paste&height=1001&id=Z86MF&originHeight=2038&originWidth=1384&originalType=url&ratio=1&rotation=0&showTitle=false&size=240856&status=done&style=none&taskId=udfc743f7-0f49-49f3-81c2-a8f9633049f&title=&width=680)

# Android启动

Android系统启动流程分4部分：

- Android系统启动流程之init进程启动
- Android系统启动流程之Zygote进程启动
- Android系统启动流之SystemServer进程启动
- Android系统启动流程之Launcher进程启动

![Android系统启动的大概流程](https://cdn.nlark.com/yuque/0/2023/png/694278/1673965762993-1d42e9d6-bafe-4901-a989-5e00103026f8.png#averageHue=%23dad9e6&clientId=uce35c36f-2dcc-4&from=paste&height=544&id=ueb7a021b&originHeight=1331&originWidth=1343&originalType=binary&ratio=1&rotation=0&showTitle=true&size=272019&status=done&style=none&taskId=u21e4d074-983c-4237-a455-13381a3e995&title=Android%E7%B3%BB%E7%BB%9F%E5%90%AF%E5%8A%A8%E7%9A%84%E5%A4%A7%E6%A6%82%E6%B5%81%E7%A8%8B&width=549 "Android系统启动的大概流程")

## init进程启动

1. 启动电源，加载引导程序到RAM，开始执行
2. 执行引导程序bootloader

> bootloader是Android系统开始运行前的一个小程序，主要是将OS拉起来，它不是AndroidOS的一部分。

3. Kernel启动

> 当Kernel完成系统设置时，它首先在系统文件中寻找init.rc文件，并启动init进程

4. init进程启动

> init进程主要是用来初始化和启动属性服务，并启动Zygote进程。
> init进程是用户进程，是所有用户进程的鼻祖，pid=1。

## Zygote进程启动

### Zygote理解？

Zygote，译为受精卵，是Android启动过程中第一个Java进程的名称。

### Zygote进程作用

Zygote进程是init进程启动创建的，又称孵化器，它的作用：

- fork 创建SystemServer进程（继承Zygote的资源）
  - 常用类
  - JNI函数
  - 主题资源
  - 共享库
- 孵化应用进程

> Zygote进程在启动的时候会创建虚拟机(Dalvik或ART)，因此通过其fork而创建的应用程序或SystemServer进程可以在内部获取一个虚拟机实例的副本。

Zygote进程会启动虚拟机，加载一些系统资源，这些都是system_server进程和应用进程所需要的，Zygote是这两者的一个抽象。<br />**所有应用程序在启动时共性操作？**<br />共性操作可以放到zygote中去提前处理，最大的共性便是启动运行时。其中会预先加载一些boot class，这些类使用频繁，因此在Zygote中提前加载好，可以极大地提升后续应用的启动速度

### Zygote进程启动流程

> init.rc→init进程→fork+execve系统调用→Zygote

init进程会根据rc文件执行一系列启动操作，其中有一项就是启动Zygote进程，init会fork出一个子进程，然后再通过exec加载`/system/bin/app_process`可执行文件

- 启动运行时：其实就是Dalvik字节码可以被正确理解并运行的环境，它存在于进程之中。这种环境由两部分组成：一部分负责对象的创建和回收（如类加载器、垃圾回收器等），另一部分负责程序逻辑的运行（如即时编译系统、解释器等）
- fork出system_server进程

然后，zygote便会将自身挂起，等待来自于system_server进程启动的请求。

#### Zygote Native世界

1. 启动Android虚拟机
2. 注册Android的JNI函数
3. 进入到Java世界：创建Android虚拟机实例，并调用ZygoteInit的main方法(JNI调用)

> 从这里开始从Native进入到Java层，可以认为Zygote开创了Java Framework。

#### Zygote Java世界

1. 通过ZygoteServer socket监听AMS请求Zygote来创建新的应用程序进程
2. 通过forkSystemServer() fork出SystemServer进程

#### 注意

1. Zygote fork要单线程
2. Zygote多线程fork可能会死锁，Zygote为了避免这个问题，在fork的时候把其它线程都给停掉了
3. Zygote的IPC没有采用Binder，而是采用的LocalSocket

## SystemServer进程启动

### SystemServer进程作用？

SystemServer进程是Zygote进程fork的第一个Java进程。<br />SystemServer进程主要是用来创建系统服务的。

- 引导服务bootstrap services：AMS，ATMS，PM，...
- 核心服务core services：BatteryService、GPUService，...
- 其他服务other services：WMS，IMMS，BLE，...

### SystemServer启动

- 启动各类系统服务（分级）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1673971520092-2f052515-727b-47bd-95e9-9752f6916637.png#averageHue=%23eff0f5&clientId=ud6db9b49-480d-4&from=paste&height=548&id=uab0c6049&originHeight=841&originWidth=1137&originalType=binary&ratio=1&rotation=0&showTitle=false&size=259121&status=done&style=none&taskId=ub9e12c96-9c72-4c8b-a10a-aaed29607a9&title=&width=741)

## Launcher的启动

## Activity的冷启动流程

见`AMS→点击一个APP到View呈现中间发生了什么？`

# 面试题

## 应用是如何启动Binder机制的？

应用天生就支持binder机制，在进程创建的时候会创建binder线程池，

## 孵化应用进程为什么不交给SystemServer来做，而是专门设计一个Zygote？

- SystemServer启动了一堆系统服务，这些服务应用程序是不需要继承的
- Zygote进程会启动虚拟机，加载各类系统资源，是非常耗时的，由其fork出应用程序，就可以直接共享了，效率非常高
- Zygote进程是SystemServer进程和应用进程通用资源的抽取

> 应用启动时候需要做很多准备工作，包括启动虚拟机、加载各类系统资源，是非常耗时的。
> 应用进程在启动时候，内存空间除了必要的资源外，最好是干干净净的，不要继承一堆乱七八糟的东西。
> 所以给SystemServer进程和应用进程都要用到的资源抽出来单独放在一个进程里，这就是Zygote进程，再由Zygote进程分别fork出SystemServer进程和应用进程，孵化后它们就可以各干各的事了。

## Zygote的IPC通信机制为什么不采用Binder？采用Binder会有什么问题？

- **Binder需要多线程，可能死锁 **服务端的Binder必须运行在线程池中，而客户端在连接服务端时会导致本线程挂起，如果服务端Binder意外死亡，会导致客户端本线程死锁。主要是因为fork不允许存在多线程，而Binder通信就是多线程
- **繁琐 **Zygote要启用Binder机制，需要打开Binder驱动，获得一个描述符，再通过mmap进行内存映射，还要注册Binder，还要创建一个Binder对象注册到ServiceManager中去，另外AMS要向Zygote发起创建应用进程请求的话，要先从ServiceManager查询Zygote的Binder对象代理，然后再发起Binder调用，来来回回非常繁琐
- 轻量级的IPC，用普通的管道或Socket就可以了
