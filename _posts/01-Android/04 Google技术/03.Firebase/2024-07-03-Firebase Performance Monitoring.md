---
date_created: Wednesday, July 3rd 2024, 10:58:42 pm
date_updated: Wednesday, January 22nd 2025, 12:02:32 am
title: Firebase Performance Monitoring
author: hacket
categories:
  - Android
category: Firebase
tags: [Firebase]
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
date created: 2024-07-03 20:01
date updated: 2024-12-24 00:33
aliases: [Firebase Performance Monitoring]
linter-yaml-title-alias: Firebase Performance Monitoring
---

# Firebase Performance Monitoring

## 集成

- [Get started with Performance Monitoring for Android  |  Firebase Performance Monitoring](https://firebase.google.cn/docs/perf-mon/get-started-android?hl=en)

## screen rendering performance data

`Performance Monitoring` 使用 `traces` 来收集有关应用程序中受监控进程的数据。`trace` 是包含应用程序中两个时间点之间捕获的数据的报告。

对于 Apple 和 Android 应用程序，`Performance Monitoring` 会自动测量应用程序中不同屏幕的渲染性能。`Performance Monitoring` 为应用程序中的每个屏幕创建 **screen rendering trace** 。这些跟踪收集并测量以下指标：

- [Slow rendering frames](https://firebase.google.cn/docs/perf-mon/screen-traces?hl=en&platform=android#slow-rendering-frames) 缓慢渲染帧 — 测量渲染时间超过 16ms 的屏幕实例的百分比。
- [Frozen frames](https://firebase.google.cn/docs/perf-mon/screen-traces?hl=en&platform=android#frozen-frames) 冻结帧 — 测量渲染时间超过 700 毫秒的屏幕实例的百分比。

应用程序中的缓慢或冻结帧可能会导致设备性能不佳，也称为 jank(卡顿) 或 lag(滞后)。

捕获冻结和缓慢的渲染帧指标可以帮助您识别性能不佳的屏幕，使您能够提高应用程序的渲染性能。

- [Learn about screen rendering performance data (Apple & Android apps)  |  Firebase Performance Monitoring](https://firebase.google.cn/docs/perf-mon/screen-traces?hl=en&platform=android)

# Ref

- [ ] [Firebase Performance Monitoring](https://firebase.google.cn/docs/perf-mon)
