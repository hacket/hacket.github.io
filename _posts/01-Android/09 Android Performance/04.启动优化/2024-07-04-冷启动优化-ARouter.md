---
date created: 2024-07-04 08:23
date updated: 2024-12-24 00:38
dg-publish: true
---

# 路由表注册提前到编译时

ARouter 启动初始化运行时扫描 dex 注册路由表，可通过 `transform+ASM` 字节码插桩，在编译器就将路由表注册好，避免主线程扫描 dex 浪费启动时间

> **扩展：** 其他需要注册的都可以采用这种字节码插桩技术，可优化 1 秒左右的启动时间

# RouteMeta 完善锁粒度减小

## **背景**

ARouter 框架提供了路由注册跳转及 SPI 能力。为了优化冷启动速度，对于某些服务实例可以在启动阶段进行预加载生成对应的实例对象。
ARouter 的注册信息是在预编译阶段 (基于 APT) 生成的，在编译阶段又通过 ASM 生成对应映射关系的注入代码。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040820957.png)

而在运行时以获取 Service 实例为例，当调用 navigation 函数获取实例最终会调用到 `completion` 函数。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040820233.png)
当首次调用时，其对应的 RouteMeta 实例尚未生成，会继续调用 `addRouteGroupDynamic()` 函数进行注册。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040821116.png)
`addRouteGroupDynamic()` 会创建对应预编译阶段生成的服务注册类并调用 loadInto 函数进行注册。而某些业务模块如何服务注册信息比较多，这里的 **loadInto()** 就会比较耗时。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040822135.png)

整体来看，对于获取 Service 实例的流程， completion 的整个流程涉及到 loadInto 信息注册、Service 实例反射生成、及 init 函数的调用。而 completion 函数是 synchronized 的，因此无法利用多线程进行注册来缩短启动耗时。

## 优化方案

这里的优化其实和Retroift Service 的注册机制类似，不同的Service注册时，其对应的元信息类(IRouteGroup)其实是不同的，因此只需要对对应的`IRouteGroup`加锁即可。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040828343.png)
在completion的后半部分流程中，针对Provider实例生产的流程也需要进行单独加锁，避免多次调用init函数。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407040828645.png)

## 收益

根据线下收集的数据 配置了20+预加载的Service Method, 预期收益 10~20ms (中端机) 。
