---
date_created: Friday, February 23rd 2021, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 12:13:35 am
title: SVGAPlayer优化
author: hacket
categories:
  - 性能优化
category: 内存优化
tags: [内存优化, 性能优化]
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
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
aliases: [SVGAPlayer]
linter-yaml-title-alias: SVGAPlayer
---

# SVGAPlayer

## 什么是 SVGA？

SVGA 是一种跨平台的开源动画格式，同时兼容 iOS / Android / Web。SVGA 除了使用简单，性能卓越，同时让动画开发分工明确，各自专注各自的领域，大大减少动画交互的沟通成本，提升开发效率。动画设计师专注动画设计，通过工具输出 svga 动画文件，提供给开发工程师在集成 svga player 之后直接使用。<br />![63e08](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/63e08.png)

## SVGA 原理

### SVGA 使用

1. 通过 SVGAParser 从 asset/file/http 等解析 svga 文件，解析完后得到一个 SVGAVideoEntity
2. new 一个 SVGADrawable，将 SVGAVideoEntity 传入
3. 将 SVGADrawable 设置给 SVGAImageView
4. 最后 SVGAImageView 调用 startAnimation 开启动画

### SVGA 格式

svga 格式用的是 protobuffer 封装的，

- SVGAParser 会把 SVGA 文件解析成 MovieEntity，解析完 onComplete 回调后会封装成 SVGAVideoEntity 给业务调用方
- 业务调用方的 SVGAImageView 会设置一个 SVGADrawable，在 SVGADrawable 中会持有 SVGAVideoEntity
- SVGADrawble 交给 SVGACanvasDrawer 去绘制
- SVGAImageView 中 startAnimation，通过属性动画，不停的绘制对应的帧

### SVGA 帧播放

**SVGA 是如何按照既定的帧率去播放的？**<br />ValueAnimator

## Ref

<https://jfson.github.io/2018/06/21/49-svga/><br /><https://svga.io/article.html><br /><https://www.yuque.com/u1451991/izlc0x/tu4rph?#nxn60>

## SVGAPlayer 缺陷（基于 v2.5.3 版本）

### 线程相关问题

#### 多余的线程解析

**问题：**<br />在 SVGAImageView 中配置了 `source` 属性，会直接新建一个 Thread 来进行 parse，parse 完后会进行动画播放

```java
val parser = SVGAParser(context)
Thread {
    parser.parse(it, callback)
}.start()
```

**解决：**去掉了 SVGAImageView 每次解析资源都会开启的 Thread：SVGAParser 内部本身就有线程池了，没必要在外部开启（分析后仅发现 open asset 可能会耗时，已经放到了 SVGAParser 内部线程池中执行

```kotlin
private fun parserSource(source: String) {
    val refImgView = WeakReference<SVGAImageView>(this)
    val parser = SVGAParser(context)
    if (source.startsWith("http://") || source.startsWith("https://")) {
        parser.decodeFromURL(URL(source), createParseCompletion(refImgView))
    } else {
        parser.decodeFromAssets(source, createParseCompletion(refImgView))
    }
}
```

#### SVGAParser 线程池设计

```kotlin
// v2.5.3
threadPoolExecutor = Executors.newCachedThreadPool()

// v2.6.1改进
private val threadNum = AtomicInteger(0)
internal var threadPoolExecutor = Executors.newCachedThreadPool { r ->
    Thread(r, "SVGAParser-Thread-${threadNum.getAndIncrement()}")
}

```

**SVGAParser 现有线程池配置：**算是合理的<br />SVGAParser 设计用的是 `newCachedThreadPool`，newCachedThreadPool 是应对快速解析资源的，任何解析的任务都会立即得到响应，如果采用固定线程数的配置肯定是要有缓冲队列，让任务排队等待处理得不到及时响应。在这种角度看 newCachedThreadPool 是合理的。<br />`newCachedThreadPool` 这种配置只有超密集的创建成百上千的线程时，才会有 OOM 的可能性，但是这对于 App 来说这是极其少见且不正常的。<br />对此我认为：不用担心 newCachedThreadPool 潜在问题，这在 SVGA 这种场景下几乎不可能发生，而且最终创建的线程可能就那几个，不会太大规模。如果你的场景对实时性要求不高或者有着自己的考虑，可以自行通过 SVGAParser.setThreadPoolExecutor() 实现自己的线程池。<br />**改进：**<br />给线程池中的每个线程命名

### 存在的内存泄漏问题

#### `ParseCompletion` 造成的泄漏

- SVGAImageView#loadAttrs 中使用的匿名内部类 `SVGAParser.ParseCompletion` 会导致持有 SVGAImageView 的强引用，造成内存泄漏。

**解决**：WeakReference 引用 SVGAImageView

```kotlin
private fun createParseCompletion(ref: WeakReference<SVGAImageView>): SVGAParser.ParseCompletion {
    return object : SVGAParser.ParseCompletion {
        override fun onComplete(videoItem: SVGAVideoEntity) {
            ref.get()?.startAnimation(videoItem)
        }
        override fun onError() {}
    }
}
```

#### ValueAnimator 的 AnimatorListener 造成的泄漏

- [x] [issue251 修复 SVGAImageView、SVGAParser 内存泄漏问题](https://github.com/svga/SVGAPlayer-Android/pull/251)

1. 在 SVGAImageView 中配置了 `source` 的 xml 属性会自动解析 svga 播放，而其中的 Listener 是一个匿名内部类，持有了 SVGAImageView，导致了泄漏

```kotlin
private fun loadAttrs(attrs: AttributeSet) {
    val typedArray = context.theme.obtainStyledAttributes(attrs, R.styleable.SVGAImageView, 0, 0)
    // ...
    typedArray.getString(R.styleable.SVGAImageView_source)?.let {
        val parser = SVGAParser(context)
        Thread {
            val callback: SVGAParser.ParseCompletion = object : SVGAParser.ParseCompletion {
                override fun onComplete(videoItem: SVGAVideoEntity) {
                    this@SVGAImageView.post {
                        videoItem.antiAlias = antiAlias
                        setVideoItem(videoItem)
                        (drawable as? SVGADrawable)?.scaleType = scaleType
                        if (autoPlay) {
                            startAnimation()
                        }
                    }
                }
                override fun onError() {}
            }
            if(it.startsWith("http://") || it.startsWith("https://")) {
                parser.parse(URL(it), callback)
            } else {
                parser.parse(it, callback)
            }
        }.start()
    }
    typedArray.recycle()
}
```

2. 手动调用 SVGAImageView#startAnimation(SVGARange?, Boolean) 内的 AnimatorListener 也会有内存泄露

```kotlin
fun startAnimation(range: SVGARange?, reverse: Boolean = false) {
    animator.addUpdateListener { // 匿名内部类
        // ...
    }
    animator.addListener(object : Animator.AnimatorListener { // 匿名内部类
        // ...
        override fun onAnimationEnd(animation: Animator?) {
            // ...
        }
        // ...
    })
}
override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    clearAudio()
    animator?.cancel()
    animator?.removeAllListeners()
    animator?.removeAllUpdateListeners()
}
```

**原因：** onDetachedFromWindow 方法不一定每次都会执行（[Android泄漏模式：View中的订阅](https://www.jianshu.com/p/73f347c028e4)）故 onDetachedFromWindow 中的解绑逻辑失效（还未 attach 的 View 不会执行 detach 操作）<br />匿名内部类 AnimatorListener/AnimatorUpdateListener 会持有外部类 SVGAImageView 造成内存泄漏<br />![agdax](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/agdax.png)<br />
**解决：** AnimatorListener/AnimatorUpdateListener 中引用的 SVGAImageView 用一个 WeakReference 包裹

```kotlin
private class AnimatorListener(view: SVGAImageView) : Animator.AnimatorListener {
    private val weakReference = WeakReference<SVGAImageView>(view)
    override fun onAnimationRepeat(animation: Animator?) {
        weakReference.get()?.callback?.onRepeat()
    }
    override fun onAnimationEnd(animation: Animator?) {
        weakReference.get()?.onAnimationEnd(animation)
    }
    override fun onAnimationCancel(animation: Animator?) {
        weakReference.get()?.isAnimating = false
    }
    override fun onAnimationStart(animation: Animator?) {
        weakReference.get()?.isAnimating = true
    }
}
private class AnimatorUpdateListener(view: SVGAImageView) : ValueAnimator.AnimatorUpdateListener {
    private val weakReference = WeakReference<SVGAImageView>(view)
    override fun onAnimationUpdate(animation: ValueAnimator?) {
        weakReference.get()?.onAnimatorUpdate(animation)
    }
}
```

#### SVGAParser context 泄漏

```kotlin
class SVGAParser(private var mContext: Context?) {
     companion object {
        private var mShareParser = SVGAParser(null)
        fun shareParser(): SVGAParser {
            return mShareParser
        }
    }
    fun init(context: Context) {
        mContext = context
    }
}
```

**原因：**<br />SVGAParser 是个静态实例，持有了一个 context，如果传入的是一个 Activity，可能导致内存泄漏<br />![uimym](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/uimym.png)<br />**解决：**
用 context.applicationContext

```kotlin
class SVGAParser(context: Context?) {
    private var mContext = context?.applicationContext
}
```

### 内存设计缺陷问题

#### bitmap 未 recycle？

Bitmap 没有做 recycle，只是简单的把缓存 list 清理掉

#### bitmap 未及时释放

App 对内存的消耗很大经常 OOM。最终定位到 SVGAVideoEntity<br />

![j3fue](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/j3fue.png)<br />

![emz93](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/emz93.png)<br />**原因：**<br />

在 SVGA 播放播放完成后，SVGAImageView 永远会持有最后一个 SVGADrawable 的引用，而这个 SVGADrawable 持有包含大量 Bitmap 集合的 SVGAVideoEntity ，这样一来就导致了一块很大的内存空间不会被 GC ，在 App 内存紧张或者多个 SVGAImageView 同时播放动画的时候很容易 OOM。<br />**SVGAImageView 引用关系：**<br />SVGAImageView 里面持有 SVGADrawable，SVGADrawable 持有了 SVGAVideoEntity

```kotlin
open class SVGAImageView : ImageView {
    private var mVideoItem: SVGAVideoEntity? = null
    private var animator: ValueAnimator? = null
    fun setVideoItem(videoItem: SVGAVideoEntity?, dynamicItem: SVGADynamicEntity?) {
        // ...
        val drawable = SVGADrawable(videoItem, dynamicItem ?: SVGADynamicEntity())
        drawable.cleared = clearsAfterStop
        setImageDrawable(drawable)
        this.mVideoItem = videoItem
    }
}
```

SVGAVideoEntity 中有个 HashMap 保存了大量 Bitmap

```kotlin
class SVGAVideoEntity {
    internal var images = HashMap<String, Bitmap>()
}
```

**解决：**<br />Bitmap 等资源的清理工作：在 SVGA 播放播放完成后，onDetachedFromWindow 时，清理 Drawable、Bitmap 的强引用，达到可 GC 的目的，这一步效果很明显。<br />具体 v2.6.1 的源码：

```kotlin
override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    stopAnimation(clearsAfterDetached)
    if (clearsAfterDetached) {
        clear()
    }
}
fun clear() {
    getSVGADrawable()?.cleared = true
    getSVGADrawable()?.clear()
    // 清除对 drawable 的引用
    setImageDrawable(null)
}

// SVGADrawable
fun clear() {
    videoItem.audioList.forEach { audio ->
        audio.playID?.let {
            if (SVGASoundManager.isInit()){
                SVGASoundManager.stop(it)
            }else{
                videoItem.soundPool?.stop(it)
            }
        }
        audio.playID = null
    }
    videoItem.clear()
}
// SVGAVideoEntity
internal var imageMap = HashMap<String, Bitmap>()
fun clear() {
    if (SVGASoundManager.isInit()) {
        this.audioList.forEach {
            it.soundID?.let { id -> SVGASoundManager.unload(id) }
        }
        soundCallback = null
    }
    soundPool?.release()
    soundPool = null
    audioList = emptyList()
    spriteList = emptyList()
    imageMap.clear()
}
```

#### bitmap 的采样问题

1. 创建 Btimap 时根据 View Size 计算采样率，减少内存消耗。

#### 在 finalize 中清理资源

**去掉 finalize() 方法**<br />去掉了 SVGAVideoEntity 对于 finalize 的实现，finalize 特不稳定，已经改为 clear() 方法，在合适时机手动清理。

```kotlin
protected fun finalize() {
    this.soundPool?.release()
    this.soundPool = null
    this.images.clear()
}
// v2.6.1改成
fun clear() {
    if (SVGASoundManager.isInit()) {
        this.audioList.forEach {
            it.soundID?.let { id -> SVGASoundManager.unload(id) }
        }
        soundCallback = null
    }
    soundPool?.release()
    soundPool = null
    audioList = emptyList()
    spriteList = emptyList()
    imageMap.clear()
}
```

**为什么不用 finalize() 方法？**

#### 其他

- [ ] [关于内存部分的设计缺陷](https://github.com/svga/SVGAPlayer-Android/issues/175)
- [ ] [解决内存释放问题](https://github.com/svga/SVGAPlayer-Android/pull/263)

### 其他

#### 验证后的数据

用了一个比较容易出现问题的低端测试机，抓了一下内存情况：<br />可以看到在一个大 SVGA 动画播放完毕后，内存是可以被回收的。<br />![vhiy1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/vhiy1.png)

> 锯齿一样的内存情况不要慌，没有办法 App 里面播放的动效太多了，这也是低端机正常 GC 的表现

最终效果，在 SVGA 播放文件后，内存可有效被 GC。<br />![728qr](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/728qr.png)

[内存泄漏与修复方式，最高降低85%](https://github.com/svga/SVGAPlayer-Android/issues/370)

#### Glide 支持 SVGA

<https://github.com/YvesCheung/SVGAGlidePlugin>
