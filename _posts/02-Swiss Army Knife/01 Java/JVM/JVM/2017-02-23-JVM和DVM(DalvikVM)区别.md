---
date_created: Friday, February 23rd 2017, 10:10:44 pm
date_updated: Thursday, January 30th 2025, 6:38:54 pm
title: JVM和DVM(DalvikVM)区别
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
date updated: 2024-12-27 23:43
aliases: [JVM 和 DVM(DalvikVM) 区别]
linter-yaml-title-alias: JVM 和 DVM(DalvikVM) 区别
---

# JVM 和 DVM(DalvikVM) 区别

## JVM 和 DVM 的区别

![jpq8u](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/jpq8u.png)

### 执行的文件格式不同

JVM 运行的是 class 字节码文件，而 dvm 运行自己定义的 dex 文件格式

### 是否可以同时存在多个虚拟机

JVM 只能同时存在一个实例；dvm 可同时存在多个实例（好处是，其他 dvm 挂了，不会影响其他应用，保证了系统稳定性）

### Java VM 是以基于栈的虚拟机 (Stack-based)；而 Dalvik 是基于寄存器的虚拟机 (Register-based)

- JVM 设计成基于栈架构：
  1. 基于栈架构的指令集更容易生成
  2. 节省资源。其零地址指令比其他指令更加紧凑
  3. 可移植性。
- DVM 为什么基于寄存器
  1. Android 手机制造商的处理器绝大部分都是基于寄存器架构的
  2. 栈架构中有更多的指令分派和访问内存，这些比较耗时。所有相对来认为 dvm 的执行效率更高一些。
  3. DVM 就是为 android 运行而设计的，无需考虑其他平台的通用

### 类加载的系统与 JVM 区别较大

## DVM 设计规则

- 每一个 app 都运行在自己的 dvm 实例中与应用隔离
- 启动一个 app 进程，一个 dvm 就诞生了，该 app 下代码在该 dvm 实例下解释运行
- 有几个 app 进程，就有几个 dvm 实例
- dvm 对对象生命周期 (组件生命周期理解)、堆栈、线程、异常以及垃圾回收进行管理
- 不支持 j2se 和 j2me 的 api，也就不支持 awt 和 swing(现在用的也非常少)

## DVM 与 ART 区别

![a8jmw](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/a8jmw.png)

### JIT 和 AOT 区别

DVM 使用 JIT 来将字节码转换成机器码，效率低；ART 采用了 AOT 预编译技术，执行速度更快。所以 ART 会占用更多的应用安装时间和存储空间

#### JIT

JIT 是 Just-In-Time Compilation 的缩写，中文为即时编译。就是 JAVA 在运行过程中，如果有些动态极度频繁的被执行或者不被执行，就会被自动编译成机器码，跳过其中的部分环节。

1. Java 源码通过编译器转为平台无关的字节码（bytecode）或 Java class 文件。
2. 在启动 Java 应用程序后，JVM 会在运行时加载编译后的类并通过 Java 解释器执行适当的语义计算。
3. 当开启 JIT 时，JVM 会分析 Java 应用程序的函数调用并且（达到内部一些阀值后）编译字节码为本地更高效的机器码。JIT 流程通常为最繁忙的函数调用提供更高的优先级。
4. 一旦函数调用被转为机器码，JVM 会直接执行而不是 " 解释执行 "

流程图：<br>![1g7it](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1g7it.png)

> 其实就是省略了 JVM 加载 class 文件，将 class 文件解释成二进制机器码的一个过程。

#### AOT
