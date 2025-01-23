---
date_created: Monday, July 1st 2020, 10:42:58 pm
date_updated: Wednesday, January 22nd 2025, 1:19:03 am
title: Systrace基础-SurfaceFlinger
author: hacket
categories:
  - 性能优化
category: 性能优化工具
tags: [性能优化, 性能优化工具, Systrace]
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
date created: 2024-06-19 00:01
date updated: 2024-12-24 00:37
aliases: [SurfaceFlinger]
linter-yaml-title-alias: SurfaceFlinger
---

# SurfaceFlinger

SurfaceFlinger 最主要的功能:**SurfaceFlinger 接受来自多个来源的数据缓冲区，对它们进行合成，然后发送到显示设备。**

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406190000856.png)

那么 Systrace 中，我们关注的重点就是上面这幅图对应的部分：

1. App 部分
2. BufferQueue 部分
3. SurfaceFlinger 部分
4. HWComposer 部分

这四部分，在 Systrace 中都有可以对应的地方，以时间发生的顺序排序就是 1、2、3、4

## App 部分

关于 App 部分，其实在 [Systrace 基础知识 - MainThread 和 RenderThread 解读](https://www.androidperformance.com/2019/11/06/Android-Systrace-MainThread-And-RenderThread/) 这篇文章里面已经说得比较清楚了

主要的流程如下图：

![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406190004148.png)

从 `SurfaceFlinger` 的角度来看，App 部分主要负责生产 `SurfaceFlinger` 合成所需要的 `Surface`。

App 与 `SurfaceFlinger` 的交互主要集中在三点

1. `Vsync` 信号的接收和处理
2. `RenderThread` 的 `dequeueBuffer`
3. `RenderThread` 的 `queueBuffer`

### Vsync 信号的接收和处理

关于这部分内容可以查看 [Android 基于 Choreographer 的渲染机制详解](https://www.androidperformance.com/2019/10/22/Android-Choreographer/) 这篇文章。

App 和 SurfaceFlinger 的第一个交互点就是 Vsync 信号的请求和接收，`Vsync-App` 信号到达，就是指的是 `SurfaceFlinger` 的 `Vsync-App` 信号。应用收到这个信号后，开始一帧的渲染准备。

#### RenderThread 的 dequeueBuffer

# Ref

- [Android Systrace 基础知识 - SurfaceFlinger 解读 · Android Performance](https://www.androidperformance.com/2020/02/14/Android-Systrace-SurfaceFlinger/)
