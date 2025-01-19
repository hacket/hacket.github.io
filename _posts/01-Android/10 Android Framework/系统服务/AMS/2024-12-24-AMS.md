---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# AMS基础

## AMS是什么？

ActivityManagerService是Android系统中一个特别重要的系统服务，也是我们上层APP打交道最多的系统服务之一。ActivityManagerService（以下简称AMS） 主要负责四大组件的**启动**、**切换**、**调度**以及**应用进程的管理**和**调度**工作。所有的APP应用都需要与AMS打交道。

## AMS的启动？

AMS 的启动是在 SystemServer 进程中启动的

- Zygote进程fork出system_server进程
- 在SystemServer.main调用startBootstrapServices()
- startBootstrapServices()中初始化ActivityTaskManagerService(ATMS)和ActivityManagerService(AMS)

## Activity任务栈管理

![Activity 任务栈模型|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1675261697496-a2d19151-72f1-4123-8ff6-67a4f660344e.png#averageHue=%23f0f0f0&clientId=uc28ac36b-2b97-4&from=paste&height=284&id=uf7c8f751&originHeight=703&originWidth=705&originalType=binary&ratio=1&rotation=0&showTitle=true&size=172634&status=done&style=none&taskId=u7ac9403e-fa0f-4529-b33f-d17e9831d01&title=Activity%E4%BB%BB%E5%8A%A1%E6%A0%88%E6%A8%A1%E5%9E%8B&width=285 "Activity 任务栈模型")

- **ActivityRecord **存储了Activity的所有信息，包括AMS引用、Manifest节点信息、Activity状态、Activity资源信息和Activity进程相关信息；还含有该ActivityRecord所在的TaskRecord。
- **TaskRecord **描述的是一个Activity任务栈，存储了任务栈的所有信息，包括任务栈的唯一标识符、任务栈的倾向性、任务栈中的Activity记录和AMS引用等；还含有ActivityStack，也就是当前Activity任务栈所归属的ActivityStack。
- **ActivityStack ** 管理系统所有 Activity，维护了 Activity 的所有状态

> ActivityRecord用来记录一个Activity的所有信息，TaskRecord中包含一个或多个ActivityRecord，TaskRecord用来表示Activity任务栈，用来管理栈中的ActivityRecord；而ActivityStack又包含了一个或多个TaskRecord，它是TaskRecord的管理者，ActivityStack包含一个或多个TaskRecord。

## 点击一个APP到View呈现中间发生了什么？

## ![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1653789472233-e5816808-dc7b-4c05-9282-59e8cfc81662.png#averageHue=%23e2e7c6&clientId=ud99087df-b2c8-4&from=paste&height=641&id=ub2907756&originHeight=961&originWidth=1427&originalType=binary&ratio=1&rotation=0&showTitle=false&size=565409&status=done&style=none&taskId=u105e394f-139e-485f-8a42-72e2fa54635&title=&width=951.3333333333334)

### 1、Launcher进程start目标Activity

Launcher进程通过ATMS(ATMSsystem_server进程)启动目标Activity，这个过程涉及了IPC，通过binder机制。<br>具体通过Activity/Instrumentatation/ATMS/ActivityStarter/RootWindowContainer等一串调用链条。

- Instrumentation：监控应用与系统相关的交互行为
- AMS：组件管理调度中心，四大组件的生命周期
- ActivityStarter：Activity启动的控制器，处理Intent与Flag对Activity启动的影响
- ActivityStackSupervisior：用来管理多个任务栈，高版本才有。用来管理多个ActivityStack，
- ActivityStack：用来管理任务栈里的Activity
- ActivityThread：Activity、Service、BroadcastReceiver的启动、切换、调度和各种操作都在这个类完成

**system_server进程如何启动的？**

> system_server进程是Zygote进程孵化的第一个Java进程，主要用来启动系统的服务，几十个

**ATMS和AMS的拆分，ATMS的作用？**

> Android10及以上，AMS拆分了，将Activity相关的转移到了ATMS中处理

**servicemanager是如何管理系统服务的(binder大总管)？如何启动的（init.rc启动的）？，管理所有binder server服务**

### 2、ATMS处理：ATMS处理请求及通过socket让Zygote进程fork一个App进程，可选

ATMS收到启动请求后，交付ActivityStarter处理Intent和Flag等信息，然后交给ActivityStackSupervisor/ActivityStack处理Activity进栈相关流程；同时以Socket方式请求Zygote进程fork出应用进程。<br>如果目标Activity的进程未启动，ATMS会请求Zygote进程启动需要的应用程序进程。

### 3、Zygote fork应用进程(如何需要的话)

Zygote进程fork出App进程，在新进程里反射创建ActivityThread对象调用main，这个就是应用的主线程，在主线程里开启Looper消息循环，开始处理创建Activity。

- 创建application,  这里又通过Binder，attachApplication到ATMS，把ApplicationThread传递给了AMS(App进程的BinderProxy)

> 匿名Binder，利用AMS，在attachApplication将ApplicationThread带给了AMS，这样AMS就可以和App进程通信了

- ActivityThread利用ClassLoader去加载Activity，创建Activity实例，并回调Activity的onCreate()

**Zygote进程如何启动？作用？**<br>Zygote进程是init进程fork启动的，Zygote进程会启动Android虚拟机，加载一些系统资源，fork出system_server进程和应用进程。<br>**为什么通过Zygote创建进程的IPC不是用Binder而是Socket？**

> 1. binder是多线程，fork不允许多线程，容易出现死锁
> 2. 繁琐，要打开binder驱动，注册到ServiceManager中，AMS再从ServiceManager拿Zygote的binder代理对象

- Zygote Java进程启动后，会创建一个ZygoteServer端的Socket，这个Socket会等待AMS请求Zygote来创建新的进程
- Zygote进程fork出应用进程，应用进程就会获得Zygote进程在启动时创建的虚拟机实例，还会创建Binder线程池和消息循环，这样运行在应用进程中的应用程序就可以方便地使用Binder进行进程间通信及消息处理了，

### 4、AMS通过ApplicationThreadProxy调用App进程的Activity.onCreate

### 5、交给WMS处理

![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1654103136436-bb5b3843-811d-41af-a56d-923392a08b0f.webp?x-oss-process=image%2Fresize%2Cw_1125%2Climit_0#averageHue=%23f7f4e4&from=url&id=EzRWV&originHeight=305&originWidth=1125&originalType=binary&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&title=)

# AMS相关面试题

## 1、从Activity创建到View呈现中间发生了什么？

<https://mp.weixin.qq.com/s?__biz=MzU4NDc1MjI4Mw==&mid=2247483864&idx=1&sn=ca212f527ed4d29e1910d689f2f69b0e&chksm=fd944c2ccae3c53a36432164917d8c1d7d447204e036dd08ffb3d7fea43526ecdc8df87d0668&token=917258391&lang=zh_CN&scene=21#wechat_redirect>

## 2、Activity onStop延迟10秒？

## 3、ANR弹框的原理是什么？
