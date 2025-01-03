---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
tags:
  - '#7:'
---

# Fresco之DataSource

<https://www.fresco-cn.org/docs/datasources-datasubscribers.html>

## 静态图DataSource

```java
public static void getShareBitmapFromDataSource(Context context, final String url, final ShareFrescoListener listener) {
 
        ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(url))
                .setProgressiveRenderingEnabled(true)
                .build();

        DataSource<CloseableReference<CloseableImage>> dataSource = Fresco
                .getImagePipeline()
                .fetchDecodedImage(imageRequest, context);

        dataSource.subscribe(new BaseBitmapDataSubscriber() {
            @Override
            public void onNewResultImpl(@Nullable final Bitmap bitmap) {
                // ...
            }

            @Override
            public void onFailureImpl(DataSource dataSource) {
                // 保存失败处理
                if (listener != null) {
                    String msg = Log.getStackTraceString(dataSource.getFailureCause());
                    LogUtil.w(TAG, "getShareBitmapFromDataSource onFailureImpl ：" + msg);
                    listener.onFail(msg);
                }
            }
        }, CallerThreadExecutor.getInstance());
    }
```

## 动图DataSource

通过操作InputStream

```java
public abstract static class BaseGifDataSubscriber extends BaseDataSubscriber<CloseableReference<PooledByteBuffer>> {
    @Override
    protected final void onNewResultImpl(DataSource<CloseableReference<PooledByteBuffer>> dataSource) {
        if (!dataSource.isFinished()) {
            float progress = dataSource.getProgress();
            onFailed(progress, "dataSource is not finished!");
            return;
        }

        boolean hasResult = dataSource.hasResult();
        if (!hasResult) {
            float progress = dataSource.getProgress();
            onFailed(progress, "dataSource has not result!");
            return;
        }

        CloseableReference<PooledByteBuffer> bufferCloseableReference = dataSource.getResult();

        if (bufferCloseableReference == null) {
            float progress = dataSource.getProgress();
            onFailed(progress, "PooledByteBuffer CloseableReference is null!");
            return;
        }
        final PooledByteBuffer pooledByteBuffer = bufferCloseableReference.get();
        try {
            onGifResult(new PooledByteBufferInputStream(pooledByteBuffer));
        } finally {
            CloseableReference.closeSafely(bufferCloseableReference);
        }
    }

    @Override
    protected final void onFailureImpl(DataSource<CloseableReference<PooledByteBuffer>> dataSource) {
        String msg = Log.getStackTraceString(dataSource.getFailureCause());
        onFailed(dataSource.getProgress(), msg);
    }

    protected abstract void onGifResult(@NonNull InputStream pooledByteBufferInputStream);

    protected abstract void onFailed(float progress, @NonNull String msg);

}
```

# Resizing&Scale

## Resize

Resize 并不改变原始图片，它只在解码前修改内存中的图片大小。<br />如果要 resize，创建ImageRequest时，提供一个 ResizeOptions :

Resize 有以下几个限制：

1. 目前，只有 JPEG 图片可以修改尺寸。
2. 对于产生的图片的尺寸，只能粗略地控制。图片不能修改为确定的尺寸，只能通过支持的修改选项来变化。这意味着即使是修改后的图片，也需要在展示前进行 scale 操作。
3. 只支持以下的修改选项： N / 8，1 <= N <= 8
4. Resize 是由软件执行的，相比硬件加速的 scale 操作较慢。
5. the actual resize is carried out to the nearest 1/8 of the original size
6. it cannot make your image bigger, only smaller (not a real limitation though)

### ResizeOptions

Fresco的加载图片，是将整个图片记载到内存中的。对于大图片官网建议Resize，Fresco的三级缓存机制，第三级是文件缓存，第二级是Fresco偷android系统的缓存存放原始图片，从第二级解码得到显示图片的一级内存，就是视觉上看到的ImageView图片都在一级内存。<br />在解码到一级内存中时，我们对图片Resize：

```java
/**
 * 解码前修改内存中的图片大小
 * @param uri        文件的uri
 * @param draweeView 显示的imageview
 */
public  void showThumbNail(Uri uri, SimpleDraweeView draweeView){

    int width = ScreenUtils.dp2px(context,119);
    int height = ScreenUtils.dp2px(context,119);

    LogUtils.e("http",width+"_"+height);
    //图片请求
    ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
    .setResizeOptions(new ResizeOptions(width, height)).build();
   //图片请求设置显示控制器
    DraweeController controller = Fresco.newDraweeControllerBuilder()
            .setImageRequest(request)
            .setOldController(draweeView.getController())
            .setControllerListener(new BaseControllerListener<ImageInfo>())
            .build();
    draweeView.setController(controller);
}
```

新问题出现：图片显示不全（具体表现为显示为纯白色，或纯黑色）

![](https://upload-images.jianshu.io/upload_images/9984264-e534dacb075de5c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/710/format/webp#id=l57Oy&originHeight=379&originWidth=710&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

**图片的Resize操作只适合对jpeg图片有效**<br />官网提供了第二种下采样的方法：

### 向下采样(Downsampling)

如果开启该选项，pipeline 会向下采样你的图片，代替 resize 操作。你仍然需要像上面那样在每个图片请求中调用 setResizeOptions 。<br />向下采样在大部分情况下比 resize 更快。除了支持 JPEG 图片，它还支持 PNG 和 WebP(除动画外) 图片。<br />但是目前还有一个问题是它在 Android 4.4 上会在解码时造成更多的内存开销（相比于Resizing）。这在同时解码许多大图时会非常显著，我们希望在将来的版本中能够解决它并默认开启此选项。

```java
.setDownsampleEnabled(true)
```

![](https://upload-images.jianshu.io/upload_images/9984264-cc46e575350ddda5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/726/format/webp#id=h6WNR&originHeight=415&originWidth=726&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

此处记得，不是`setDownsampleEnabled(true)`就可以了，还得调用之前的Resize方法，人家文档也说的很明白了，在初始化得时候，进行下采样就能支持png,webp:

```java
//下采样
ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)     
     .setDownsampleEnabled(true)        
      .build();
//初始化
Fresco.initialize(this, config);
```

## Ref

- [ ] 下采样+Resize能解决Fesco加载大量图片的滑动卡顿和内存溢出问题.

<https://github.com/facebook/fresco/issues/1343>

# Fresco之Postprocessor

<https://www.fresco-cn.org/docs/modifying-image.html><br />有时，我们想对从服务器下载，或者本地获取的图片做些修改，比如在某个坐标统一加个网格什么的。你可以使用 `Postprocessor`，最好的方式是继承 `BasePostprocessor`。

## 高斯模糊

IterativeBoxBlurPostProcessor

```java
/**
 * 以高斯模糊显示。
 *
 * @param draweeView View。
 * @param url        url.
 * @param iterations 迭代次数，越大越魔化。
 * @param blurRadius 模糊图半径，必须大于0，越大越模糊。
 */
public static void loadImage(String url, SimpleDraweeView draweeView, int iterations, int blurRadius) {
    try {
        Uri uri = Uri.parse(url);
        ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
                .setPostprocessor(new IterativeBoxBlurPostProcessor(iterations, blurRadius))// iterations, blurRadius
                .build();
        AbstractDraweeController controller = Fresco.newDraweeControllerBuilder()
                .setOldController(draweeView.getController())
                .setImageRequest(request)
                .build();
        draweeView.setController(controller);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

# 使用Fresco注意

## 1、不支持wrap_content

Drawee必须声明 android:layout_width 和 android:layout_height。如果没有在XML中声明这两个属性，将无法正确加载图像。<br />Drawees 不支持 wrap_content 属性。

> 所下载的图像可能和占位图尺寸不一致，如果设置出错图或者重试图的话，这些图的尺寸也可能和所下载的图尺寸不一致。<br />如果大小不一致，假设使用的是 wrap_content，图像下载完之后，View将会重新layout，改变大小和位置。这将会导致界面跳跃。<br />只有希望显示固定的宽高比时，可以使用wrap_content。

## 2、Fresco初始化要在Activity的setContentView()之前

```java
Fresco.initialize(Context);
```

不然会报错：

```
android.view.InflateException: Binary XML file line #7: Error inflating class com.facebook.drawee.view.SimpleDraweeView
```

## 3、Fresco的ControllerListener回调

如果DraweeView不显示，完成不会回调？

## 4、使用Fresco OOM问题

如果加载的高清图，不进行缩放，有可能OOM。<br />Fresco默认并不支持根据View的尺寸去缩放图片，需要手动去缩放，用ResizeOptions。

### 图片缩放-ResizeOptions

<http://frescolib.org/docs/resizing.html><br />解决：根据View的尺寸缩放图片 (ResizeOptions)

```java
private DraweeController getDraweeController(DraweeView targetView, String url) {
    Uri uri = Uri.parse(url);
    int width = targetView.getWidth();
    int height = targetView.getHeight();
    if (width <= 0) {
        width = ScreenUtil.getScreenWidth(getActivity());
    }
    if (height <= 0) {
        height = ScreenUtil.getScreenHeight(getActivity());
    }

    ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
            //根据View的尺寸放缩图片
            .setResizeOptions(new ResizeOptions(width, height))
            .build();

    DraweeController controller = Fresco.newDraweeControllerBuilder()
            .setOldController(targetView.getController())
            .setImageRequest(request)
            .setControllerListener(new ImageLoadingDetailListener())
            .setAutoPlayAnimations(true)
            .build();

    return controller;
}
```

其他相关：<br />缩放和旋转图片<br /><https://www.fresco-cn.org/docs/resizing-rotating.html>

### 使用ResizeOptions后仍然会OOM

有时你会发现当即使用了ResizeOptions后，特别是加载本地多图时仍然会发生OOM，或加载页面会异常的卡顿忙，或者有的图片加载不出来，黑屏。是ResizeOptions的bug吗？答案肯定不是，造成的原因就在于你的使用姿势不正确！

- ResizeOptions的参数设置有问题<br />设置的裁剪宽高值仍然太大了，并没有很好的适应的你需求
- ResizeOptions默认只支持JPEG格式的图片<br />通过设置`etDownsampleEnabled(true)`支持png和webp图片格式处理

```java
ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
        .setDownsampleEnabled(true)
        .build();
Fresco.initialize(this, config);
```

- 在开启AndroidManifest.xml中开启`android:largeHeap="true"`

### 最终处理Fresco OOM

短时间内处理大量图片，

- 初始化，一般在Application中

```java
private void initFresco() {
    // 默认支持jpg，添加支持png、webp
    ActivityManager activityManager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
    ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
            .setDownsampleEnabled(true)
            .setBitmapMemoryCacheParamsSupplier(new FrescoCacheParams(activityManager))
            .build();
    Fresco.initialize(this, config);
}
```

FrescoCacheParams定义：

```java
public class FrescoCacheParams implements Supplier<MemoryCacheParams> {
    private ActivityManager activityManager;
    public FrescoCacheParams(ActivityManager activityManager) {
        this.activityManager = activityManager;
    }
    @Override
    public MemoryCacheParams get() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            int cacheSize = getMaxCacheSize();
            LogUtil.i("fresco", "fresco cache size = " + cacheSize);
            return new MemoryCacheParams(cacheSize, 1, 1, 1, 1);
        } else {
            return new MemoryCacheParams(
                    getMaxCacheSize(),
                    256,
                    Integer.MAX_VALUE,
                    Integer.MAX_VALUE,
                    Integer.MAX_VALUE);
        }
    }
    private int getMaxCacheSize() {
        final int maxMemory = Math.min(activityManager.getMemoryClass()
                * ByteConstants.MB, Integer.MAX_VALUE);
        if (maxMemory < 32 * ByteConstants.MB) {
            return 4 * ByteConstants.MB;
        } else if (maxMemory < 64 * ByteConstants.MB) {
            return 6 * ByteConstants.MB;
        } else {

            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.GINGERBREAD) {
                return 8 * ByteConstants.MB;
            } else {
                return maxMemory / 6;
            }
        }
    }
}
```

- 缩放图片，通过ResizeOptions

```java
ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
        .setResizeOptions(new ResizeOptions(width, height))
        .build();
DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setOldController(getController())
        .setImageRequest(request)
        .build();
setController(controller);
```

- Drawee移出屏幕时，就释放

```java
// calling on each Drawee, once it moves out of visible area
if (getController() != null) {
    getController().onDetach();
}
// once a image moves out of display area, we are evicting it out of pipeline as well.
ImagePipeline imagePipeline = Fresco.getImagePipeline();
Uri uri = Uri.parse(url);
imagePipeline.evictFromMemoryCache(uri);
```

### Fresco OOM Ref

- [ ] 图片框架使用问题之二: Fresco框架导致的OOM<br /><http://www.jianshu.com/p/160c79d61c21>

其他总结：

- [ ] Fresco最强图片加载框架详解及使用--使用方法很详细<br /><http://blog.csdn.net/android_yyf/article/details/73549538>
- [ ] 你所不知道的fresco使用集锦<br /><http://www.jianshu.com/p/8ff81be83101>
- [ ] Fresco之强大之余的痛楚 -- 源码解析<br /><http://www.jianshu.com/p/5364957dcf49>
- [ ] 一种使用 Fresco 非侵入式加载图片的方式-自定义fresco加载实现图片选择<br />[https://fucknmb.com/2017/07/27/一种使用Fresco非侵入式加载图片的方式/](https://fucknmb.com/2017/07/27/%E4%B8%80%E7%A7%8D%E4%BD%BF%E7%94%A8Fresco%E9%9D%9E%E4%BE%B5%E5%85%A5%E5%BC%8F%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87%E7%9A%84%E6%96%B9%E5%BC%8F/)

## 用Fresco的DataSource分享长图模糊

- 问题：<br />用Fresco的DataSource加载长图模糊
- 分析<br />由于Fresco的DataSource加载图片，会将图片解码、压缩，导致分享出去的图片很模糊，<br />通过ResizeOptions将图片设置大一点就可以了
- 解决：

```java
public static void getShareBitmapFromDataSource(Context context, final String url) {
    ResizeOptions resizeOptions = new ResizeOptions(2048, 2048, 1024*1024);
    ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(url))
            .setProgressiveRenderingEnabled(true)
            .setResizeOptions(resizeOptions)
            .build();

    DataSource<CloseableReference<CloseableImage>> dataSource = Fresco
            .getImagePipeline()
            .fetchDecodedImage(imageRequest, context);

    dataSource.subscribe(new BaseBitmapDataSubscriber() {
        @Override
        public void onNewResultImpl(@Nullable final Bitmap bitmap) {
         
        }

        @Override
        public void onFailureImpl(DataSource dataSource) {
         
        }
    }, CallerThreadExecutor.getInstance());
}
```

## Fresco的圆角与GIF不能兼得的解决方案

<https://www.jianshu.com/p/fac1d303f10b>

## 关于Fresco加载图片报PoolSizeViolationException异常的问题

```
com.facebook.imagepipeline.memory.BasePool$PoolSizeViolationException: Pool hard cap violation? Hard cap = 402653184 Used size = 402493656 Free size = 0 Request size = 2856600
```

我是在RecyclerView的item里面处理SimpleDraweeView，不过在RecyclerView的外面包了一层NestedScrollView。如果把NestedScrollView去掉不会报上名的错误。<br />这个错误的原因是没有释放图像，导致它们填满整个池，直到图像过多而引发异常。

<https://github.com/facebook/fresco/issues/1600>

> RecyclerView does not recycle its items when its height is wrap_content and it is a child of NestedScrollView

## java.lang.UnsatisfiedLinkError

<https://github.com/facebook/fresco/issues/1552><br /><https://github.com/facebook/fresco/issues/2049>

### Ref

- 【ReactNative】关于32位和64位SO库混合引入Crash解决方案

> <https://blog.csdn.net/u013531824/article/details/53931307>

- java.lang.UnsatisfiedLinkError 的解决办法

> <https://blog.zzzmode.com/2016/10/22/android-unsatisfiedlinkerror-fix/><br />用ReLinker

- 系统应用集成过程中的一些坑<br /><https://www.jianshu.com/p/d290442a0135>
