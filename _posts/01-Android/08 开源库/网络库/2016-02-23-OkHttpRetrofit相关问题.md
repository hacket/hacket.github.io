---
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Wednesday, January 22nd 2025, 12:55:23 am
title: OkHttpRetrofit相关问题
author: hacket
categories:
  - Android
category: 开源库
tags: [开源库, 网络库, OkHttp, Retrofit]
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
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
aliases: [OKHttp]
linter-yaml-title-alias: OKHttp
---

# OKHttp

[面试官：听说你熟悉OkHttp原理？](https://juejin.cn/post/6844904087788453896)

## OkHttp 基本实现原理？

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676444222326-710a64ad-7209-4784-9f64-91c45e8f9f5c.webp#averageHue=%23f5f5f5&clientId=u3a49ed1d-0216-4&from=paste&id=uad524b72&originHeight=813&originWidth=461&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ucfde9d34-c5b9-4902-a2f0-8a1281c5bfc&title=)

- **RetryAndFollowUpInterceptor：负责重定向 **构建一个 StreamAllocation 对象，然后调用下一个拦截器获取结果，从返回结果中获取重定向的 request，如果重定向的 request 不为空的话，并且不超过重定向最大次数的话就进行重定向，否则返回结果。
- **BridgeInterceptor **负责将原始 Requset 转换给发送给服务端的 Request 以及将 Response 转化成对调用方友好的 Response。
- <br />

OkHttp 的内部实现通过一个责任链模式完成，将网络请求的各个阶段封装到各个链条中，实现了各层的解耦。所以核心的代码逻辑是通过 OkHttpClient 的 newCall 方法创建了一个 Call 对象，并调用其 execute 方法；Call 代表一个网络请求的接口，实现类只有一个 RealCall。execute 表示同步发起网络请求，与之对应还有一个 enqueue 方法，表示发起一个异步请求，因此同时需要传入 callback。

```java
//  RealCall 
override fun execute(): Response {     
    // ...     
    // 开始计时超时、发请求开始回调     
    transmitter.timeoutEnter()     
    transmitter.callStart()    
    try {      
        client.dispatcher.executed(this) // 第1步       
        return getResponseWithInterceptorChain() // 第2步    
    } finally {      
        client.dispatcher.finished(this) // 第3步     
    }	
} 
```

## OkHttp 线程池配置？

**okhttp 线程池配置源码：**

```java
@get:Synchronized
@get:JvmName("executorService") val executorService: ExecutorService
get() {
  if (executorServiceOrNull == null) {
    executorServiceOrNull = ThreadPoolExecutor(0, Int.MAX_VALUE, 60, TimeUnit.SECONDS,
        SynchronousQueue(), threadFactory("$okHttpName Dispatcher", false))
  }
  return executorServiceOrNull!!
}
```

1. corePoolSize 为 0，maxiumPoolSize 无上限
2. keepAliveTime 线程 idle 时存活时间 60 秒
3. 队列是 SynchronousQueue

> OkHttp 使用 SynchronousQueue，当前线程没有核心线程，先来先执行，线程空闲时不会保留，适用于短时间的任务操作

SynchronousQueue 每个插入操作必须等待另一个线程的移除操作，同样任何一个移除操作都等待另一个线程的插入操作。队列内部其实没有任何一个元素（容量为 0），严格来说并不是一种容器，由于队列没有容量，因此不能调用 peek 操作，因此只有移除元素才有新增的元素，显然这是一种快速传递元素的方式，也就是说在这种情况下元素总是以最快的方式从插入者 (生产者) 传递给移除者 (消费者)，这在多任务队列中是最快的处理任务方式，对于高频请求场景，无疑是最合适的。<br />在 OkHttp 中，创建了一个 maxmiumPoolSize 为 Integer.MAX_VALUE 的线程池，它不保留任何最小线程，随时创建更多的线程，而且如果线程空闲后，只能活 60 秒。（如果收到 20 个并发请求，线程池会创建 20 个线程，当完成后的 60 秒后会自动关闭所有 20 个线程）这样设计成线程数量不设上限的，以保证 IO 任务中高阻塞低占用的过程，不会长时间卡在阻塞上

#### OkHttp 的线程池数量没有上限，会出现 OOM 吗

不会，因为 OkHttp 对异步请求最大数的配置有要求的：

```java
class Dispatcher constructor() {
	var maxRequests = 64
	var maxRequestsPerHost = 5
}
```

1. 每个 host 最多请求 5 个
2. 所有请求最多 64 个

**为啥 corePoolSize 为 0**<br />不保留最小线程，每次运行完线程会消亡，这样可以保证任务及时被处理掉

## Okhttp 缓存怎么做的？

## okhttp 拦截器有哪些？分别做了什么事？

## 对 okhttp 的了解？

## Okhttp 连接泄露

<https://mp.weixin.qq.com/s/zNLhUQeeiRYqfpP82tOxsQ>

# 面试题

## OkHttp

### OkHttpClient 每次网络请求都需要创建一个吗？

不，绝大多数情况下都可以使用单例模式。

### cancel 做了什么事？

## Retrofit

### Retrofit 每次网络请求也需要创建一个吗？

不。因为 Retrofit 每次加载新方法，都会缓存起来。如果每次都创建一个新的，那么缓存机制毫无作用

# Ref

[OkHttp源码深度解析 (oppo)](https://juejin.cn/post/6844904102669844493)
