---
date_created: Tuesday, October 29th 2016, 12:08:52 am
date_updated: Monday, January 20th 2025, 11:17:26 pm
title: SurfaceView
author: hacket
categories:
  - AndroidUI
category: 系统控件
tags: []
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
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
aliases: [SurfaceView 调用 setZOrderOnTop(true) 遮挡其他控件]
linter-yaml-title-alias: SurfaceView 调用 setZOrderOnTop(true) 遮挡其他控件
---

# SurfaceView 调用 setZOrderOnTop(true) 遮挡其他控件

[TOC]

## setZOrderOnTop

> setZOrderOnTop，控制这个 surfaceView 是否被放在窗口顶层。通常,为了使它与绘图树整合,它被放在窗口之后。通过这个函数，你可以使 SurfaceView 被放在窗口顶层。这意味着它所在的窗口的其他内容都不可见。（注: 可以设置 surfaceView 透明来使其他内容可见）

这个函数必须在窗口被添加到窗口管理器之前设置。<br />要实现 SurfaceView 透明，需要设置 `setZOrderOnTop(true)`，就是说必须把 SurfaceView 置于 Activity 显示窗口的最顶层才能正常显示，然后调用了 SurfaceView.setZOrderOnTop(true) 又导致了自定义的其他控件比如播放、快进等按钮被遮挡。

### setZOrderMediaOverlay

### 疑问

1. 如果设置 setZOrderOnTop，可以透明，但会把其他挡住
2. 设置 setZOrderMediaOverlay，背景黑屏

## SurfaceView 堆叠

## 存在问题

- [ ] GlSurfaceView Transparent Background Without Using GlSurfaceView.setZOrderOnTop(true);<br /><https://stackoverflow.com/questions/59498966/glsurfaceview-transparent-background-without-using-glsurfaceview-setzorderontop>

# 面试题

## SurfaceView, TextureView 及 View 的区别。SurfaceView 怎么控制它处于的层级？

## TextureView 是在主线程渲染吗？
