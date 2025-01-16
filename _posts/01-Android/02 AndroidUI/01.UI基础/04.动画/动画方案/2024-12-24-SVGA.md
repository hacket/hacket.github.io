---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:24 晚上
title: SVGA
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [SVGAPlayer-Android]
linter-yaml-title-alias: SVGAPlayer-Android
---

# SVGAPlayer-Android

<https://github.com/yyued/SVGAPlayer-Android><br />SVGA 预览：<http://svga.io/svga-preview.html>

## 支持的特性

### assets 加载

```java
private void loadAnimation() {
    SVGAParser parser = new SVGAParser(this);
    String heartbeat_choice_success = "svga/heartbeat_choice_success.svga";
    parser.parse(heartbeat_choice_success, new SVGAParser.ParseCompletion() {
        @Override
        public void onComplete(@NotNull SVGAVideoEntity videoItem) {
            animationView.setVideoItem(videoItem);
            animationView.startAnimation();
        }

        @Override
        public void onError() {

        }
    });
}
```

### 网络下载

```java
private void loadAnimation() {
    try {
        File cacheDir = new File(this.getCacheDir(), "http");
        HttpResponseCache.install(cacheDir, 1024 * 1024 * 128);
    } catch (IOException e) {
        e.printStackTrace();
    }

    SVGAParser parser = new SVGAParser(this);
    try { // new URL needs try catch.
        parser.parse(new URL("https://github.com/yyued/SVGA-Samples/blob/master/posche.svga?raw=true"), new SVGAParser.ParseCompletion() {
            @Override
            public void onComplete(@NotNull SVGAVideoEntity videoItem) {
                animationView.setVideoItem(videoItem);
                animationView.startAnimation();
            }

            @Override
            public void onError() {

            }
        });
    } catch (MalformedURLException e) {
        e.printStackTrace();
    }
}
```

### Layout 支持

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <com.opensource.svgaplayer.SVGAImageView
        android:layout_height="match_parent"
        android:layout_width="match_parent"
        android:scaleType="fitCenter"
        app:source="svga/angel.svga"
        app:antiAlias="true"/>

</RelativeLayout>
```

### 动态图像或文本

```java
private void loadAnimation() {
    SVGAParser parser = new SVGAParser(this);
    try { // new URL needs try catch.
        String heartbeat_choice_success = "svga/heartbeat_choice_success.svga";
        String url = heartbeat_choice_success;
        URL url2 = new URL("https://github.com/yyued/SVGA-Samples/blob/master/kingset.svga?raw=true");
        parser.parse(url, new SVGAParser.ParseCompletion() {
            @Override
            public void onComplete(@NotNull SVGAVideoEntity videoItem) {

                SVGADynamicEntity dynamicEntity = new SVGADynamicEntity();

                Bitmap avatarBm = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
//                    Bitmap avatarBm2 = BitmapFactory.decodeResource(getResources(), R.drawable.svga_replace_avatar);
                
                dynamicEntity.setDynamicImage("https://github.com/PonyCui/resources/blob/master/svga_replace_avatar.png?raw=true", "avatar2"); // Here is the KEY implementation.
//                    dynamicEntity.setDynamicImage(avatarBm2, "avatar1"); // Here is the KEY implementation.

                dynamicEntity.setDynamicImage(avatarBm, "avatar1"); // Here is the KEY implementation.

                TextPaint textPaint = new TextPaint();
                textPaint.setColor(Color.WHITE);
                textPaint.setTextSize(30);
                dynamicEntity.setDynamicText("大圣哥", textPaint, "name1");

                TextPaint textPaint2 = new TextPaint();
                textPaint2.setColor(Color.WHITE);
                textPaint2.setTextSize(30);
                dynamicEntity.setDynamicText("哈哈姐", textPaint2, "name2");

//                    SVGADrawable drawable = new SVGADrawable(videoItem, dynamicEntity);
                animationView.setVideoItem(videoItem, dynamicEntity);

                animationView.startAnimation();

                LogUtil.i(TAG, "onComplete,SVGAVideoEntity3:" + videoItem.toString());
            }

            @Override
            public void onError() {
                LogUtil.e(TAG, "onError3");
            }
        });
    } catch (MalformedURLException e) {
        e.printStackTrace();
        LogUtil.e(TAG, e.getMessage());
    }
}
```

#### 使用位图替换指定元素

<https://github.com/yyued/SVGAPlayer-Android/wiki/Dynamic-Image>

```java
try {
    parser.parse(new URL("https://github.com/yyued/SVGA-Samples/blob/master/kingset.svga?raw=true"), 
        new SVGAParser.ParseCompletion() {
            @Override
            public void onComplete(@NotNull SVGAVideoEntity videoItem) {
                SVGADynamicEntity dynamicEntity = new SVGADynamicEntity();
                String imageKey = "99";
                dynamicEntity.setDynamicImage("https://github.com/PonyCui/resources/blob/master/svga_replace_avatar.png?raw=true", imageKey); // Here is the KEY implementation.
                SVGADrawable drawable = new SVGADrawable(videoItem, dynamicEntity);
                testView.setImageDrawable(drawable);
                testView.startAnimation();
            }
            @Override
            public void onError() {

            }
        }
    );
} catch (Exception e) {
    System.out.print(true);
}
```

效果：<br />![](https://github.com/PonyCui/resources/raw/master/svga_replace_bitmap.gif?raw=true#id=eGpQR&originHeight=524&originWidth=517&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 在指定元素上绘制文本

> 设计大佬那里是一张透明的图片，客户端在上面绘制文本<br /><https://github.com/yyued/SVGAPlayer-Android/wiki/Dynamic-Text>

![](https://github.com/PonyCui/resources/raw/master/svga_replace_text.gif?raw=true#id=NUym9&originHeight=231&originWidth=320&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 在指定元素上绘制富文本

<https://github.com/yyued/SVGAPlayer-Android/wiki/Dynamic-Text-Layout>

#### 隐藏指定元素

<https://github.com/yyued/SVGAPlayer-Android/wiki/Dynamic-Hidden>

#### 在指定元素上自由绘制

<https://github.com/yyued/SVGAPlayer-Android/wiki/Dynamic-Drawer>

## 注意

### SVGA 不支持的情况

1. AE 插件不支持，粒子效果<br /><https://github.com/yyued/SVGAPlayer-Android/issues/45>
2. 对 AE 动画支持有限的效果和类型
3. TEXT 不支持
4. 复杂动画转换较慢
5. 不适合交互的场景

### cache

SVGAParser 不会管理缓存，需要自己管理，否则会出现警告：

```
SVGAParser can not handle cache before install HttpResponseCache. see https://github.com/yyued/SVGAPlayer-Android#cache
```

Setup HttpResponseCache

```kotlin
val cacheDir = File(context.applicationContext.cacheDir, "http")
HttpResponseCache.install(cacheDir, 1024 * 1024 * 128)
```

### svga path shape 动画导致内存持续增长

> 在某些手机，svga 中有使用 Path 路径绘制的 shape 动画的，svga 会在绘制动画的过程中，动态的生成各种 path 来绘制 shape 动画，60 帧的动画，可能最后会生成几千个参数不同的 path 对象,数量有可能更多，由于硬件加速的实现问题，path 的参数稍有不同，某些手机会为每一个不同 path 绘制分配一块新的内存绘制，从而导致动画一直进行的话，分配的内存会一直持续增长，在 le max 2 这个手机上实验，demo 里面加载会增长到 300M，我们现在是让设计不使用 shape 动画来解决的

> 希望尽量少用 shape，因为 shape 的绘制确实太耗性能了。

解决：用 png 图片替换

> <https://github.com/yyued/SVGAPlayer-Android/issues/146>

- SVGA 资源文章<br /><http://svga.io/article.html>

### SVGA 不能全屏播放，控制动画的宽高？

1. 设置 SVGAImageView 的 width 和 height
2. 设置 SVGAImageView 的 scaleType

```xml
<com.opensource.svgaplayer.SVGAImageView
        android:id="@+id/iv_svga"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@color/transparent"
        android:scaleType="centerCrop" />
```

如何控制动画的宽高？我有个动画展示的场景是在半屏下播放的<br /><https://github.com/yyued/SVGAPlayer-Android/issues/165>

3. 根据宽等比例缩放高来适配

```xml
<android.support.constraint.ConstraintLayout>
    <com.opensource.svgaplayer.SVGAImageView
        android:id="@+id/iv_svga_top"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        android:visibility="gone"
        app:layout_constraintDimensionRatio="640:1138"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"/>
</android.support.constraint.ConstraintLayout>
```

### SVGAImageView 在 recyclerciew 中使用有问题

> 上下滑动，导致有些播放不了动画了<br /><https://github.com/yyued/SVGAPlayer-Android/issues/167>

#### 方案 1：在 RecyclerView 的 onViewAttachedToWindow() 重新 startAnimation()

我们在项目里也遇到了这个问题，在 RecyclerView 滑回已经展示过的部分 item 时没有重新走入 onBindViewHolder 方法，所以尝试在 onViewAttachedToWindow 中解析和重新播放动画，基本能解决问题。<br />需要注意的是，复用问题，会导致混乱

```kotlin
abstract class BaseQuickAdapterSVGA<T, K : BaseViewHolder> @JvmOverloads constructor(@LayoutRes layoutId: Int = 0, data: MutableList<T>?) : BaseQuickAdapter<T, K>(layoutId, data) {

    companion object {
        private const val TAG = "svga"
    }

    override fun onViewAttachedToWindow(holder: K) {
        super.onViewAttachedToWindow(holder)
        val views = getSVGAViews(holder)
        val position = holder.adapterPosition
        val item = getItem(position)
        for (index in views.indices) {
            val view = views[index]
            if (view != null && item != null) {
                val tag = view.tag as? String
                if (svgaTag(position, item, view) == tag) {
                        view.startAnimation()
                    }
                } else {
            }
        }
    }

    abstract fun svgaTag(position: Int, item: T, view: SVGAImageView): String?

    abstract fun getSVGAViews(holder: K): List<SVGAImageView?>
}
```

#### 方案 2：重写 SVGAImageView 在 onAttachedToWindow 时 startAnimation

```kotlin
open class CommonSVGAView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : SVGAImageView(context, attrs, defStyleAttr) {

    private var parseCallback: ParseCallback? = null
    private val lifecycleOwner: LifecycleOwner
    private var url: String = ""

    companion object {
        const val TAG = "hacket"
    }

    init {
        setLoop(1)
        if (context !is LifecycleOwner) {
            throw AssertionError("context must be implements LifecycleOwner!")
        }
        lifecycleOwner = context
    }

    fun loop(): CommonSVGAView {
        setLoop(0)
        return this
    }

    fun setLoop(loop: Int): CommonSVGAView {
        loops = loop
        return this
    }

    fun setCallback(callback: ParseCallback?): CommonSVGAView {
        this.parseCallback = callback
        return this
    }

    fun clearCallback() {
        this.parseCallback = null
    }

    fun show(url: String): CommonSVGAView {
        this.url = url
        lifecycleOwner.lifecycleScope.launch {
            logd("parse", "url=$url")
            parseSVGA(url)
        }
        return this
    }

    fun showAsset(assetPath: String): CommonSVGAView {
        this.url = assetPath
        lifecycleOwner.lifecycleScope.launch {
            // logd("parse", "url=$url")
            parseSVGA(assetPath, true)
        }
        return this
    }

    fun stop(): CommonSVGAView {
        if (isAnimating) {
            stopAnimation(true)
        }
        return this
    }


    private suspend fun parseSVGA(url: String, isAssets: Boolean = false) {
        try {
            val s = SystemClock.uptimeMillis()
            val parser = SVGAParser(context.applicationContext)
            val listener = object : SVGAParser.ParseCompletion {

                override fun onError() {
                    logw("onError", "parseSVGA onError，isAssets=$isAssets，url=$url")
                    parseCallback?.onError()
                }

                override fun onComplete(videoItem: SVGAVideoEntity) {
                    logd("onComplete", "parseSVGA onComplete，isAssets=$isAssets，url=$url，cost:"
                            + (SystemClock.uptimeMillis() - s) + "ms")
                    val drawable = SVGADrawable(videoItem,
                            parseCallback?.onPreComplete(videoItem) ?: SVGADynamicEntity())
                    parseCallback?.onComplete(videoItem)
                    setImageDrawable(drawable)
                    tag = url
                    startAnimation()
                    callback = object : SVGACallback {
                        override fun onPause() {}

                        override fun onFinished() {
                            logd("onFinished", "parseSVGA onFinished，isAssets=$isAssets，url=$url")
                            parseCallback?.onFinished()
                        }

                        override fun onRepeat() {}

                        override fun onStep(frame: Int, percentage: Double) {}
                    }
                }
            }
            withContext(Dispatchers.IO) {
                if (isAssets) {
                    logw("parse", "parseSVGA 从Assets加载SVGA，url=$url")
                    parser.decodeFromAssets(url, listener)
                } else {
                    if (url.startsWith("http")) {
                        logw("parse", "parseSVGA 从网络加载SVGA，url=$url")
                        parser.decodeFromURL(URL(url), listener)
                    } else {
                        logd("parse", "parseSVGA 从本地缓存加载SVGA，url=$url")
                        val inputStream = FileInputStream(url)
                        parser.decodeFromInputStream(inputStream, url, listener, true)
                    }
                }
            }
        } catch (e: Exception) {
            logw("parse", "parseSVGA Exception:${e.message}，从网络加载url=$url")
            parseCallback?.onError()
            e.printStackTrace()
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        val t = tag as? String
        if (t == this.url) {
            if (drawable != null && !isAnimating) {
                logd("onAttachedToWindow", "startAnimation t=$t，url=$url，view=${this}")
                startAnimation()
            } else {
                logw("onAttachedToWindow", "drawable为null或正在isAnimating，isAnimating=$isAnimating，drawable=$drawable，t=$t，url=$url")
            }
        } else {
            logw("onAttachedToWindow", "tag和url不匹配，t=$t，url=$url")
        }
    }


    private fun logd(anchor: String, msg: String) {
        LogUtils.d(TAG, "${anchor(anchor)}$msg")
    }

    private fun logw(anchor: String, msg: String) {
        LogUtils.w(TAG, "${anchor(anchor)}$msg")
    }

    interface ParseCallback {
        fun onError()
        fun onComplete(videoItem: SVGAVideoEntity) {}
        fun onPreComplete(videoItem: SVGAVideoEntity): SVGADynamicEntity = SVGADynamicEntity()
        fun onFinished() {}
    }

    // 水平镜像
    fun onMirrorHorizontally() {
        scaleY = 1f
        scaleX = -1f
        requestLayout()
    }

}
```

### SVGA 设计规范

<https://github.com/yyued/SVGAPlayer-Android/issues/109>

<https://github.com/yyued/SVGAPlayer-Android/issues/71>

> 我估计是你的设计师偷懒使用序列帧导出给你了，这是绝对禁止的。

### SVGA OOM

1. 用 DialogFragment 做这种全屏礼物动画时，容易 OOM，改为 addView 方式
2. SVGAImageView 需要动态添加，每次用完就 removeView 掉不然容易 OOM
