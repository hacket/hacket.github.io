---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Thursday, January 23rd 2025, 12:15:15 am
title: Kotlin KCP、KSP及KAPT
author: hacket
categories:
  - Java&Kotlin
category: Kotlin进阶
tags: [KCP]
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
date created: 2024-12-27 23:45
date updated: 2024-12-27 23:45
aliases: [KCP、KSP 及 KAPT]
linter-yaml-title-alias: KCP、KSP 及 KAPT
---

# KCP、KSP 及 KAPT

## KCP 和 KSP？

### 什么是 KCP？

**Kotlin Compiler Plugin(KCP)** 在 kotlinc 过程中提供 hook 时机，可以再次期间解析 AST、修改字节码产物等，Kotlin 的不少语法糖都是 KCP 实现的，例如 `data class`、`@Parcelize`、`kotlin-android-extension` 等, 如今火爆的 Compose 其编译期工作也是借助 KCP 完成的。<br>![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1668954749036-ff12122c-b65b-4a9e-9d37-e77aadc4adea.webp#averageHue=%23353535&clientId=u190f6f70-2d28-4&from=paste&height=370&id=u0b34fabd&originHeight=855&originWidth=1252&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4653f45f-2304-4174-b453-01134b1f2c8&title=&width=541.3333740234375)

### KAPT、KSP 和 KCP 区别？

**KAPT**<br>默认情况下 kotlin 使用 kapt 处理注解，kapt 没有专门的注解处理器，需要借助 apt 来实现，因此需要先生成 apt 可解析的 stub（Java 代码），这就拖慢了 kotlin 的整体编译速度<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1668956926677-247c5da8-7a34-4592-8231-dee7c5d610ca.png#averageHue=%23f3f2ea&clientId=u190f6f70-2d28-4&from=paste&height=417&id=c9pfY&originHeight=625&originWidth=2412&originalType=binary&ratio=1&rotation=0&showTitle=false&size=376018&status=done&style=none&taskId=u8e3f4603-d38d-4dca-b5a3-3edba046bac&title=&width=1608)

> 从上面这张图其实就可以看出原因了，KAPT 处理注解的原理是将代码首先生成 Java Stubs，再将 Java Stubs 交给 APT 处理的，这样天然多了一步，自然就耗时了
> 同时在项目中可以发现，往往生成 Java Stubs 的时间比 APT 真正处理注解的时间要长，因此使用 KSP 有时可以得到 100% 以上的速度提升
> 同时由于 KAPT 不能直接解析 Kotlin 的特有的一些符号，比如 data class，当我们要处理这些符号的时候就比较麻烦，而 KSP 则可以直接识别 Kotlin 符号

**KSP**

- KSP 用来替换 KAPT 的，去掉生成 JavaStubs 过程，只能生成代码，不能修改已有代码
- KSP 是对 KCP 的轻量封装，降低 KCP 的使用成本
- KSP 编译速度比 KAPT 快 2 倍

**KCP**

1. KCP 功能强大，不仅可以生成代码，还可以通过修改 IR 或者修改字节码等方式修改已有的代码逻辑；比如 `kotlin-android-extention` 插件就是一个编译器插件，通过控件 id 获取对应的 view
2. KCP 具有优秀的 IDE 支持
3. KCP 的能力是 KSP 的超集，可以替代 KSP/KAPT
4. KCP 的开发成本太高，涉及 Gradle Plugin、Kotlin Plugin 等， API 涉及一些编译器知识
