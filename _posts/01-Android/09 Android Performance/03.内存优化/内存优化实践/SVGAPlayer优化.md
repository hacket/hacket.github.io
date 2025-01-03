---
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
dg-publish: true
---

# SVGAPlayer

## 什么是SVGA？

SVGA 是一种跨平台的开源动画格式，同时兼容 iOS / Android / Web。SVGA 除了使用简单，性能卓越，同时让动画开发分工明确，各自专注各自的领域，大大减少动画交互的沟通成本，提升开发效率。动画设计师专注动画设计，通过工具输出 svga 动画文件，提供给开发工程师在集成 svga player 之后直接使用。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678033589331-d6ba0d62-f524-4576-8ca2-712d68ed60f3.png#averageHue=%23aedfef&clientId=u1c04e2f9-6743-4&from=paste&height=165&id=u2c92a399&originHeight=235&originWidth=1036&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=159552&status=done&style=none&taskId=u2ba5bc1c-1e2d-4efe-b230-928151a26a9&title=&width=725.6666870117188)

## SVGA原理

### SVGA使用

1. 通过SVGAParser从asset/file/http等解析svga文件，解析完后得到一个SVGAVideoEntity
2. new一个SVGADrawable，将SVGAVideoEntity传入
3. 将SVGADrawable设置给SVGAImageView
4. 最后SVGAImageView调用startAnimation开启动画

### SVGA格式

svga格式用的是protobuffer封装的，

- SVGAParser会把SVGA文件解析成MovieEntity，解析完onComplete回调后会封装成SVGAVideoEntity给业务调用方
- 业务调用方的SVGAImageView会设置一个SVGADrawable，在SVGADrawable中会持有SVGAVideoEntity
- SVGADrawble交给SVGACanvasDrawer去绘制
- SVGAImageView中startAnimation，通过属性动画，不停的绘制对应的帧

### SVGA帧播放

**SVGA是如何按照既定的帧率去播放的？**<br />ValueAnimator

## Ref

<https://jfson.github.io/2018/06/21/49-svga/><br /><https://svga.io/article.html><br /><https://www.yuque.com/u1451991/izlc0x/tu4rph?#nxn60>

## SVGAPlayer缺陷（基于v2.5.3版本）

### 线程相关问题

#### 多余的线程解析

**问题：**<br />在SVGAImageView中配置了`source`属性，会直接新建一个Thread来进行parse，parse完后会进行动画播放

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

#### SVGAParser线程池设计

```kotlin
// v2.5.3
threadPoolExecutor = Executors.newCachedThreadPool()

// v2.6.1改进
private val threadNum = AtomicInteger(0)
internal var threadPoolExecutor = Executors.newCachedThreadPool { r ->
    Thread(r, "SVGAParser-Thread-${threadNum.getAndIncrement()}")
}

```

**SVGAParser现有线程池配置：**算是合理的<br />SVGAParser设计用的是`newCachedThreadPool`，newCachedThreadPool是应对快速解析资源的，任何解析的任务都会立即得到响应，如果采用固定线程数的配置肯定是要有缓冲队列，让任务排队等待处理得不到及时响应。在这种角度看 newCachedThreadPool 是合理的。<br />`newCachedThreadPool`这种配置只有超密集的创建成百上千的线程时，才会有OOM的可能性，但是这对于App来说这是极其少见且不正常的。<br />对此我认为：不用担心 newCachedThreadPool 潜在问题，这在 SVGA 这种场景下几乎不可能发生，而且最终创建的线程可能就那几个，不会太大规模。如果你的场景对实时性要求不高或者有着自己的考虑，可以自行通过 SVGAParser.setThreadPoolExecutor() 实现自己的线程池。<br />**改进：**<br />给线程池中的每个线程命名

### 存在的内存泄漏问题

#### `ParseCompletion` 造成的泄漏

- SVGAImageView#loadAttrs 中使用的匿名内部类 `SVGAParser.ParseCompletion` 会导致持有 SVGAImageView 的强引用，造成内存泄漏。

**解决**：WeakReference引用SVGAImageView

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

#### ValueAnimator的AnimatorListener造成的泄漏

- [x] [issue251 修复 SVGAImageView、SVGAParser 内存泄漏问题 ](https://github.com/svga/SVGAPlayer-Android/pull/251)

1. 在SVGAImageView中配置了`source`的xml属性会自动解析svga播放，而其中的Listener是一个匿名内部类，持有了SVGAImageView，导致了泄漏

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

2. 手动调用SVGAImageView#startAnimation(SVGARange?, Boolean) 内的 AnimatorListener 也会有内存泄露

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

**原因：**onDetachedFromWindow 方法不一定每次都会执行（[Android泄漏模式：View中的订阅](https://www.jianshu.com/p/73f347c028e4)）故onDetachedFromWindow中的解绑逻辑失效（还未attach的View不会执行detach操作）<br />匿名内部类AnimatorListener/AnimatorUpdateListener会持有外部类SVGAImageView造成内存泄漏<br />![ValueAnimator造成的内存泄漏](https://cdn.nlark.com/yuque/0/2023/png/694278/1679246237237-8d917d96-13d4-48f8-8df9-9ed91062179f.png#averageHue=%232a2727&clientId=u202d78e5-7861-4&from=paste&id=Ckdmg&originHeight=373&originWidth=1363&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=312603&status=done&style=none&taskId=ude541f39-a75a-4767-aef7-5f83ebe8639&title=ValueAnimator%E9%80%A0%E6%88%90%E7%9A%84%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F "ValueAnimator造成的内存泄漏")<br />**解决：**AnimatorListener/AnimatorUpdateListener中引用的SVGAImageView用一个WeakReference包裹

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

#### SVGAParser context泄漏

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

**原因：**<br />SVGAParser是个静态实例，持有了一个context，如果传入的是一个Activity，可能导致内存泄漏<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679247189958-ccec6655-d5b8-4097-b9ae-b18feecb18a8.png#averageHue=%232a2727&clientId=u202d78e5-7861-4&from=paste&id=u520b0db2&originHeight=658&originWidth=1106&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=489666&status=done&style=none&taskId=uc800b01d-bc7f-403c-91bb-78d97ffbd9f&title=)<br />**解决：**用context.applicationContext

```kotlin
class SVGAParser(context: Context?) {
    private var mContext = context?.applicationContext
}
```

### 内存设计缺陷问题

#### bitmap未recycle？

Bitmap没有做recycle，只是简单的把缓存list清理掉

#### bitmap未及时释放

App 对内存的消耗很大经常 OOM。最终定位到 SVGAVideoEntity<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679416937631-07da8ff9-13a8-4f20-af8f-2bd40ee5137e.png#averageHue=%23e8e8e8&clientId=u4577afc4-92db-4&from=paste&id=ub3e073d3&originHeight=210&originWidth=999&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=173730&status=done&style=none&taskId=u48086a80-e539-46f9-8559-954ab25bd44&title=)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679416949992-e31a99d2-47d4-4e0d-9d6d-804b3fa72e3e.png#averageHue=%23e7e7e6&clientId=u4577afc4-92db-4&from=paste&id=ue7d6fb21&originHeight=428&originWidth=874&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=301785&status=done&style=none&taskId=ucb99bd9c-c748-48c1-8e15-3827d685412&title=)<br />**原因：**<br />在 SVGA 播放播放完成后，SVGAImageView 永远会持有最后一个 SVGADrawable 的引用，而这个 SVGADrawable 持有包含大量 Bitmap 集合的 SVGAVideoEntity ，这样一来就导致了一块很大的内存空间不会被 GC ，在 App 内存紧张或者多个 SVGAImageView 同时播放动画的时候很容易 OOM。<br />**SVGAImageView引用关系：**<br />SVGAImageView里面持有SVGADrawable，SVGADrawable持有了SVGAVideoEntity

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

SVGAVideoEntity中有个HashMap保存了大量Bitmap

```kotlin
class SVGAVideoEntity {
    internal var images = HashMap<String, Bitmap>()
}
```

**解决：**<br />Bitmap 等资源的清理工作：在 SVGA 播放播放完成后，onDetachedFromWindow时，清理 Drawable、Bitmap 的强引用，达到可GC的目的，这一步效果很明显。<br />具体v2.6.1的源码：

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

#### bitmap的采样问题

1. 创建 Btimap 时根据 View Size 计算采样率，减少内存消耗。

#### 在finalize中清理资源

**去掉finalize()方法**<br />去掉了 SVGAVideoEntity 对于 finalize 的实现，finalize 特不稳定，已经改为 clear() 方法，在合适时机手动清理。

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

**为什么不用finalize()方法？**

#### 其他

- [ ] [关于内存部分的设计缺陷](https://github.com/svga/SVGAPlayer-Android/issues/175)
- [ ] [解决内存释放问题](https://github.com/svga/SVGAPlayer-Android/pull/263)

### 其他

#### 验证后的数据：

用了一个比较容易出现问题的低端测试机，抓了一下内存情况：<br />可以看到在一个大 SVGA 动画播放完毕后，内存是可以被回收的。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679418905345-b9f0d53b-0245-441f-b4bb-9ffc0c7f9417.png#averageHue=%2391dae6&clientId=u4577afc4-92db-4&from=paste&id=ucf4beeff&originHeight=1048&originWidth=2151&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=803111&status=done&style=none&taskId=ud9e6c605-7d2e-4acc-99d9-53eb5435afa&title=)

> 锯齿一样的内存情况不要慌，没有办法 App 里面播放的动效太多了，这也是低端机正常 GC 的表现

最终效果，在 SVGA 播放文件后，内存可有效被GC。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679418965278-4fdffeb0-e6cb-4d05-9d50-812b0f57e0fc.png#averageHue=%23a4dfeb&clientId=u4577afc4-92db-4&from=paste&id=u290d3586&originHeight=1142&originWidth=2191&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=626755&status=done&style=none&taskId=uc6bb5ac1-6423-4539-84df-2f9fdaecd42&title=)

[内存泄漏与修复方式，最高降低85%](https://github.com/svga/SVGAPlayer-Android/issues/370)

#### Glide支持SVGA

<https://github.com/YvesCheung/SVGAGlidePlugin>
