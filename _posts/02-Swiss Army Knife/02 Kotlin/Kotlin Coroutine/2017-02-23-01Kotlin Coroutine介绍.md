---
banner:
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Wednesday, November 19th 2025, 8:37:58 am
title: 01Kotlin Coroutine介绍
author: hacket
categories:
  - Java&Kotlin
category: Kotlin协程
tags: [Kotlin协程]
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
date created: 2024-08-11 21:58
date updated: 2024-12-27 23:45
aliases: [协程 coroutines 入门]
linter-yaml-title-alias: 协程 coroutines 入门
---

# 协程 coroutines 入门

- [ ] <https://developer.android.com/kotlin/coroutines>
- [ ] <https://github.com/dmytrodanylyk/coroutine-recipes>

## 协程简介

### 协程是什么？

官方描述：

> 协程通过将复杂性放入库来简化异步编程。程序的逻辑可以在协程中顺序地表达，而底层库会为我们解决其异步性。该库可以将用户代码的相关部分包装为回调、订阅相关事件、在不同线程（甚至不同机器）上调度执行，而代码则保持如同顺序执行一样简单。

**协程就像非常轻量级的线程**。线程是由系统调度的，线程切换或线程阻塞的开销都比较大。而协程依赖于线程，但是协程挂起时不需要阻塞线程，几乎是无代价的，协程是由开发者控制的。所以协程也像用户态的线程，非常轻量级，一个线程中可以创建任意个协程

总而言之：协程可以简化异步编程，可以顺序地表达程序，协程也提供了一种避免阻塞线程并用更廉价、更可控的操作替代线程阻塞的方法 – 协程挂起。

### 协程、线程&进程

### 协程引入

```groovy
dependencies {
    // Kotlin
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.4.32"
    // 协程核心库
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.4.3"
    // 协程Android支持库
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.4.3"
}
```

### 结构化并发

当某个协程任务丢失，无法追踪，会导致内存、CPU 和磁盘等资源浪费，甚至发送一个无用的网络请求，这种情况称为任务泄漏。为了能够避免协程泄漏，Kotlin 协程引入了**结构化并发机制**。

使用结构化并发可以做到：

1. 取消任务：当某项任务不再需要时取消它
2. 追踪任务：当任务正在执行时，追踪它
3. 发出错误信号：当协程失败时，发出错误信号表明有错误发生

引入了 CoroutineScope，可以跟踪所有由它启动的协程，也可以取消由它启动的所有协程

## kotlinx.coroutines 官方库

Coroutines = Co + Routines<br>Here, Co means cooperation and Routines means functions. It means that function when functions co-operated with each other, we name them as coroutines.

<https://github.com/Kotlin/kotlinx.coroutines>

> kotlinx.coroutines 是由 JetBrains 开发的功能丰富的协程库。它包含本指南中涵盖的很多启用高级协程的原语，包括 launch、 async 等等。

协程中文文档<br><https://www.kotlincn.net/docs/reference/coroutines/coroutines-guide.html>

## 协程基础

### 协程启动：CoroutineContext(上下文)、CoroutineStart(启动模式)、CoroutineScope(作用域)

见 `协程启动.md`

### 挂起函数 suspend

见 `协程挂起.md`

### 协程取消和超时

见 `协程取消和超时.md`

### 协程并发安全

见 `协程并发安全.md`

## Flow

见 `Flow`

## Channel

## 多路复用

# 协程注意

## 将协程设为可取消

```kotlin
someScope.launch {
    for(file in files) {
        ensureActive() // Check for cancellation 
        readFile(file)
    }
}
```

## 避免使用 GlobalScope

GlobalScope 在非受控的作用域内执行的，您将无法控制其执行。

## 使用 Room 或 Retrofit 不需要切换线程

> 不需要，库维护者给维护好了。

<https://www.lukaslechner.com/do-i-need-to-call-suspend-functions-of-retrofit-and-room-on-a-background-thread/>

- [ ] 关于 Kotlin Coroutines， 你可能会犯的 7 个错误<br><https://juejin.cn/post/6922625944830083079?utm_source=gold_browser_extension#heading-2>

## Ref

- [ ] Kotlin Coroutines - Use Cases on Android<br><https://github.com/LukasLechnerDev/Kotlin-Coroutine-Use-Cases-on-Android>
