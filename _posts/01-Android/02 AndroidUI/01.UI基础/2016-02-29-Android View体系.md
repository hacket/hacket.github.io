---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:36:59 pm
title: Android View体系
author: hacket
categories:
  - AndroidUI
category: UI杂项
tags: [UI基础, UI杂项]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:50 晚上
image-auto-upload: true
feed: show
format: list
aliases: [Android View 体系]
linter-yaml-title-alias: Android View 体系
---

# Android View 体系

## 自定义 View

1. 按需重写 onMeasure，适配 wrap_content 场景
2. 重写 onDraw 绘制自己的东西

## 自定义 ViewGroup

1. 按需重写 onMeasure，适配 wrap_content 场景
2. 必须重写 onLayout 摆放子 view
3. 按需重写 onDraw，需要设置 setWillNotDraw(false)

## MeasureSpec

### MeasureSpec 是什么

MeasureSpec 是一个 32bit 的 int 值，其中高 2 位为测量模式 SpecMode，低 30 位为测量的大小 SpecSize<br />分为 EXACTLY，AT_MOST 和 UNSPECIFIED

### MeasureSpec 怎么计算出来的

1. MeasureSpec 最顶层的的值是根据 Window 的 MATCH_PARENT 和 WRAP_CONTENT 来配置的，具体代码在 ViewRootImpl 的 getRootMeasureSpec() 里，而 PhoneWindow 默认都是 MATCH_PARENT
2. 其他 view 的 onMeasure 的 widthMeasureSpec 和 heightMeasureSpec 的计算

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654531731878-14228daa-3e85-4146-9079-e38794dcd162.png#averageHue=%23fdfcf7&clientId=uc9ede57a-475a-4&from=paste&height=643&id=uf066344e&originHeight=965&originWidth=1328&originalType=binary&ratio=1&rotation=0&showTitle=false&size=616711&status=done&style=none&taskId=uf2109ddd-58dd-43b0-ae4a-4b40a7b5c0f&title=&width=885.3333333333334)

## measure

### FrameLayout 什么情况下子 view 会 measure 两次？

1. FrameLayout 自身的 MeasureSpec.Mode 不等于 MeasureSpec.EXACTLY。
2. 有两个或以上子 view 设置了 match_parent

## 硬件加速和软件绘制

# 界面刷新流程？

# 绘制流程？

# Android View 体系

## Android View 体系？SurfaceFlinger

## SurfaceView & View 的区别

1. View 适用于主动更新的情况，而 SurfaceView 则适用于被动更新的情况，比如频繁刷新界面。
2. View 在主线程中对页面进行刷新，而 SurfaceView 则开启一个子线程来对页面进行刷新。
3. View 在绘图时没有实现双缓冲机制，SurfaceView 在底层机制中就实现了双缓冲机制。

> 双缓冲技术是游戏开发中的一个重要的技术。当一个动画争先显示时，程序又在改变它，前面还没有显示完，程序又请求重新绘制，这样屏幕就会不停地闪烁。而双缓冲技术是把要处理的图片在内存中处理好之后，再将其显示在屏幕上。双缓冲主要是为了解决 反复局部刷屏带来的闪烁。把要画的东西先画到一个内存区域里，然后整体的一次性画出来。

为什么使用 SurfaceView 主要有两点：

1. 如果屏幕刷新频繁，onDraw 方法会被频繁的调用，onDraw 方法执行的时间过长，会导致掉帧，出现页面卡顿。而 SurfaceView 采用了双缓冲技术，提高了绘制的速度，可以缓解这一现象。
2. view 的 onDraw 方法是运行在主线程中的，会轻微阻塞主线程，对于需要频繁刷新页面的场景，而且 onDraw 方法中执行的操作比较耗时，会导致主线程阻塞，用户事件的响应受到影响，也就是响应速度下降，影响了用户的体验。而 SurfaceView 可以在自线程中更新 UI，不会阻塞主线程，提高了响应速度。

GLSurfaceView：GLSurfaceView 继承 SurfaceView，除了拥有 SurfaceView 所有特性外，还加入了 EGL（EGL 是 OpenGL ES 和原生窗口系统之间的桥梁） 的管理，并自带了一个单独的渲染线程。

## TextureView 和 SurfaceView

TextureView 是 Android 4.0（API 14）引入，它必须使用在开启了硬件加速的窗体中。除了拥有 SurfaceView 的特性外，它还可以进行像常规视图（View）那样进行平移、缩放等动画。<br />SurfaceView 是独立于视图层次（View Hierarchy），拥有自己的绘图层（Surface）

## 如何扩大某个 view 的点击响应区域？

1. padding
2. 套成 view
3. TouchDelegate

- <https://mp.weixin.qq.com/s/glkmajbaUMN_4ZAKMpxvGg>

# 动画

## 1、AnimationDrawable 帧动画

AnimationDrawable，通过 Choreographer，监听 vsync 刷新屏幕信号，最后调用到 AnimationDrawable 的 run 方法，设置下一帧的动画

## 2、Tweened Animation 补间动画

1. View.startAnimation() 时动画并没有马上就执行，而是通过 invalidate() 层层通知到 ViewRootImpl 发起一次遍历 View 树的请求，而这次请求会等到接收到最近一帧到了的信号时才去发起遍历 View 树绘制操作。
2. 动画是在每一帧的绘制流程里被执行，所以动画并不是单独执行的，也就是说，如果这一帧里有一些 View 需要重绘，那么这些工作同样是在这一帧里的这次遍历 View 树的过程中完成的。每一帧只会发起一次 perfromTraversals() 操作。
3. 补间动画的绘制实际上是父布局不停地改变自己的 Canvas 坐标，而子 view 虽然位置没有变化，但是画布所在 Canvas 的坐标发生了变化视觉效果也就发生了变化，其实并没有修改任何属性，所以只能在原位置才能处理触摸事件。

## 3、PropertyAnimation 属性动画

1. ObjectAnimator 和 ValueAnimator 及区别
2. AnimationHandler.addAnimationFrameCallback 向 Choreographer 注册 Choreographer.FrameCallback 回调，通过该回调获得渲染时间脉冲的回调；通过系统的 vsync 垂直同步信号来协调 cpu,gpu 和渲染的时序；Choreographer 获得 vsync 信号后 根据 当前帧的纳秒来查找哪些 Choreographer.FrameCallback 会被执行。
3. 执行 AnimationHandler.doAnimationFrame() 方法，开始真正的动画逻辑
4. ValueAnimator.animateBasedOnTime(time) 执行，通过 TimeInterpolator 计算最终的 时间流逝比 fraction,然后调用 PropertyValuesHolder.calculateValue(fraction) 计算属性的值，并回调 AnimatorUpdateListener.onAnimationUpdate() 方法。
5. PropertyValuesHolder 调用 Keyframes.getIntValue(fraction),这中间又使用到估值器 TypeEvaluator 和 Keyframe 最终结算处我们需要的属性值。
6. 然后 ObjectAnimator 调用 PropertyValuesHolder.setAnimatedValue(target) 来更新 target 的属性值。
