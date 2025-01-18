---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# SurfaceView调用setZOrderOnTop(true)遮挡其他控件

[TOC]

## setZOrderOnTop

> setZOrderOnTop，控制这个surfaceView是否被放在窗口顶层。通常,为了使它与绘图树整合,它被放在窗口之后。通过这个函数，你可以使SurfaceView被放在窗口顶层。这意味着它所在的窗口的其他内容都不可见。（注:可以设置surfaceView透明来使其他内容可见）

这个函数必须在窗口被添加到窗口管理器之前设置。<br />要实现SurfaceView透明，需要设置`setZOrderOnTop(true)`，就是说必须把SurfaceView置于Activity显示窗口的最顶层才能正常显示，然后调用了SurfaceView.setZOrderOnTop(true)又导致了自定义的其他控件比如播放、快进等按钮被遮挡。

### setZOrderMediaOverlay

### 疑问

1. 如果设置setZOrderOnTop，可以透明，但会把其他挡住
2. 设置setZOrderMediaOverlay，背景黑屏

## SurfaceView堆叠

## 存在问题

- [ ] GlSurfaceView Transparent Background Without Using GlSurfaceView.setZOrderOnTop(true);<br /><https://stackoverflow.com/questions/59498966/glsurfaceview-transparent-background-without-using-glsurfaceview-setzorderontop>

# 面试题

## SurfaceView, TextureView及View的区别。SurfaceView怎么控制它处于的层级？

## TextureView是在主线程渲染吗？
