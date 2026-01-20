---
banner: 
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Wednesday, June 18th 2025, 12:15:09 am
title: 02 Binder基础 -大管家 ServiceManager
author: hacket
categories:
  - Android Framework
category: Framework基础
tags: [Binder, Framework基础]
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
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
aliases: [Binder 基础 - ServiceManager]
linter-yaml-title-alias: Binder 基础 - ServiceManager
---

# Binder 基础 - ServiceManager

## ServiceManager

### SeriveManager 介绍

**疑问：** 使用 Binder 框架的既包括系统服务，也包括第三方应用。因此，在同一时刻，系统中会有大量的 Server 同时存在。那么，Client 在请求 Server 的时候，是如果确定请求发送给哪一个 Server 的呢？

解决的方法就是：每个目标对象都需要一个唯一的**标识**。并且，需要有一个组织来管理这个唯一的标识。

而 Binder 框架中负责管理这个标识的就是**ServiceManager**。ServiceManager 对于 `Binder Server的管理` 就好比车管所对于车牌号码的的管理，派出所对于身份证号码的管理：每个公开对外提供服务的 Server 都需要注册到 ServiceManager 中（通过 addService），注册的时候需要指定一个唯一的 id（这个 id 其实就是一个字符串）。

Client 要对 Server 发出请求，就必须知道服务端的 id。Client 需要先根据 Server 的 id 通过 ServerManager 拿到 Server 的标示（通过 getService），然后通过这个标示与 Server 进行通信。

整个过程如下图所示：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250616011857089.png)

### servicemanager 启动流程

![5czg2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/5czg2.png)当 Kernel 启动加载完驱动之后，会启动 Android 的 init 程序，init 进程加载了 servicemanager 的 rc 可执行程序之后加载了 servicemanager 的入口函数启动了 servicemanager 进程。

servicemanager 启动分为三步：

1. 首先打开 Binder 驱动创建全局链表 `binder_procs`
2. 将自己当前进程信息保存到 `binder_procs` 链表
3. 开启 `binder_loop` 不断地处理共享内存中的数据，并处理 `BR_xxx` 命令

### servicemanager 作用？

- binder 机制的守护进程，Binder 上下文管理者（其他调用者通过**预留的 0 号引用**获取 servicemanager 的 binder）；
- 注册服务（针对 Server）
- 查询服务（针对 Client）

#### ServiceManager 注册服务

![wsacc](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/wsacc.png)

- 通过 ServiceManager 的 addService() 方法来注册服务
- ServiceManager 向 Binder 驱动发送 `BC_TRANSACTION` 命令 (ioctl 的命令，BC 可以理解为 Binder Client 发过来的请求命令) 携带 `ADD_SERVICE_TRANSACTION` 命令，同时注册服务的线程进入等待状态 `waitForResponse()`
- Binder 驱动收到请求命令向 ServiceManager 的 todo 队列里面添加一条注册服务的事务，事务的任务就是创建服务端进程 binder_node 信息并插入到 binder_procs 链表中
- 事务处理完之后发送 `BT_TRANSACTION` 命令，ServiceManager 收到命令后向 `svcinfo` 列表中添加已经注册的服务，最后发送 `BR_REPLY` 命令唤醒等待的线程，通知注册成功

#### ServiceManager 获取服务

![72q8w](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/72q8w.png)

- 通过 ServiceManager 的 getService() 方法来注册服务
- ServiceManager 向 binder 驱动发送 `BC_TRANSACTION` 命令携带 `CHECK_SERVICE_TRANSACTION` 命令，同时获取服务的线程进入等待状态 `waitForResponse()`
- Binder 驱动收到请求命令向 ServiceManager 发送 `BC_TRANSACTION` 查询已注册的服务，查询到直接响应 `BR_REPLY` 唤醒等待的线程；若查询不到将与 binder_procs 链表中的服务进行一次通讯再响应

## servicemanager 一些疑问？

#### Client 和 Server 怎么获取 servicemanager 的 binder 对象？

通过 `getStrongProxyForHandle(0)` 方法获取，因为 servicemanager 默认就是 0 号引用，便于其它系统服务查询使用，它内部会根据句柄创建对应的 BpBinder 对象
