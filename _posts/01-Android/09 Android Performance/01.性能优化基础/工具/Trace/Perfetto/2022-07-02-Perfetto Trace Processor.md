---
date_created: Tuesday, July 2nd 2022, 12:48:21 am
date_updated: Wednesday, January 22nd 2025, 1:17:56 am
title: Perfetto Trace Processor
author: hacket
categories:
  - 性能优化
category: 性能优化工具
tags: [性能优化, 性能优化工具, Perfetto]
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
date created: 2024-07-02 00:48
date updated: 2024-12-24 00:37
aliases: [Perfetto Trace Processor]
linter-yaml-title-alias: Perfetto Trace Processor
---

# Perfetto Trace Processor

## Trace Processor 实战

自动化 trace 分析主要分析主线程耗时劣化，分析方法是基于一个基准版本（如线上版本 release 分支包）做为参照，与测试版本的每个主线程调用进行对比分析。自动分析支持分析以下几类问题：

**主线程锁**

主要分析 synchronize 关键字导致的锁问题，虚拟机会通过 atrace 添加 Trace 信息，Trace 信息有固定前缀 monitor contention，并且会说明占用锁的线程 ID，直接分析 slice 表 name 字段前缀为 monitor contention。

**方法耗时劣化**

此类问题关注的是主线程的方法耗时劣化，通过对比基准版本和测试版本，耗时劣化是指测试的版本对比基准版本耗时有增加，到了一定阈值（当前阈值 10ms），会认为是耗时劣化问题。

**方法 CPU 耗时劣化**

此类问题劣化问题和方法耗时劣化类似，统计的是方法的 CPU 耗时。

**新增方法耗时**

此类问题关注的是主线程的新增方法耗时，测试版本新增方法的耗时到达一定阈值（目前是 5ms），会认为是新增耗时问题。

# Ref

- [segmentfault.com/a/1190000042485606](https://segmentfault.com/a/1190000042485606)
