---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# Glide用法

## Glide加载本地图片资源&网络图片

### 网络图

```java
ImageView imageView = findViewById(R.id.image_view);
String url = "https://www.niwoxuexi.com/statics/images/nougat_bg.png";
Glide.with(context)
        .load(url)
        .into(imageView);
```

### 本地图

#### 加载SD卡资源图片

```java
// 加载SD卡根目录的test.jpg 图片 
String path = "file://"+ Environment.getExternalStorageDirectory().getPath()+"/test.jpg";
Glide.with(context)
        .load(path)
        .into(imageView);
或者
ImageView imageView = findViewById(R.id.image_view);
// 加载SD卡根目录的test.jpg 图片  ，通过Flie文件读取
File file = new File(Environment.getExternalStorageDirectory(), "test.jpg");
Glide.with(context)
        .load(file)
        .into(imageView);
```

#### 加载drawable资源图片

```java
ImageView imageView = findViewById(R.id.image_view);
// 加载资源文件 drawable 下的图片 image_test.png
Glide.with(this)
        .load(R.drawable.iamge_test)
        .into(imageView);
```

#### 加载assets 资源文件

```java
ImageView imageView = findViewById(R.id.image_view);
// 加载资源文件 assets 下的图片 image_test.png
String path =  "file:///android_asset/image_test.png";
Glide.with(this)
        .load(path)
        .into(imageView);
```

#### 加载raw资源图片

方法：load("android.resource://包名/raw/raw_1") 或  load("android.resource://包名/raw/"+R.raw.raw_1)

### Glide还可以加载的类型

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687661346485-a5119c8d-68b5-425c-b29c-a8fd6fb7a871.png#averageHue=%23fafafa&clientId=u9c2cdd82-8e3f-4&from=paste&height=235&id=uc9c10da5&originHeight=353&originWidth=1486&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=70556&status=done&style=none&taskId=u62abf97e-a323-4633-9adb-d03ca60db09&title=&width=990.6666666666666)

## Glide Transformation转换

> glide wiki: <https://github.com/bumptech/glide/wiki/Transformations>

### 介绍

glide包括2种默认的`transformations`，`fitCenter`和`centerCrop`，其他类型的可参考[glide-transformations](https://github.com/wasabeef/glide-transformations)

- FitCenter<br />缩放图片会保持图片原有的宽高比，能完整填充给定的宽和高；采用最小的scale(缩放倍数大的)来缩放图片，所以一边是完整匹配给定的宽高，一边是小于或者等于给定的宽高。（即缩放的图片会完整的显示到给定控件的宽高，有一边是等于或者小于另外一边控件的宽高）<br />等同于Android系统ImageView的ScaleType.FIT_CENTER
- CenterCrop<br />等同于Android的ImageView中的`ScaleType.CENTER_CROP`

#### [自定义](https://github.com/bumptech/glide/wiki/Transformations#custom-transformations)`[transformations](https://github.com/bumptech/glide/wiki/Transformations#custom-transformations)`

- 简单的方式是直接继承`BitmapTransformation`

#### [Sizing](https://github.com/bumptech/glide/wiki/Transformations#sizing)

Glide会自动根据传递进来的View的`layout_wight`，`match_parent`或者具体的宽高值来确定图片的大小。<br />如果你想指定一个自定义的尺寸，用`.override(int,int)`方法。或者你想在自定义View上加载图片，使用自定义的[Custom Targets](https://github.com/bumptech/glide/wiki/Custom-targets)。

#### [Bitmap re-use](https://github.com/bumptech/glide/wiki/Transformations#bitmap-re-use)

为了减少GC操作，用`BitmapPool`来释放和重复利用已经存在的Bitmap。遵守以下几点：

- 在`transform()`方法中不要回收Bitmap，glide会自动帮我们做这些。
- 如果你拿超过一个Bitmap或者不再使用一个Bitmap从`Bitmap`拿到的，返回额外的给`BitmapPool`
- 如果你的`transformaions`没有替换原始的bitmap，返回这个Bitmap在`transform()`方法。

### 使用

- `.transform()`<br />使用任何转换，无论它是图像还是gif
- `.bitmapTransformation()`<br />它只能用于bitmap转换
- 多种转换<br />如何同时调用了`.transform()` 或 `.bitmapTransform()`，之前的配置就会被覆盖掉的。如果你还是可以运用多种转换的，通过传递多个转换对象作为参数传给 `.transform()` 或 `.bitmapTransform()`。

```java
Glide
    .with( context )
    .load( eatFoodyImages[1] )
    .transform( new GreyscaleTransformation( context ), new BlurTransformation( context ) )
    .into( imageView2 );
```

**提示：** 当你用了转换后你就不能使用 `.centerCrop()` 或 `.fitCenter()` 了。_

### 开源库[glide-transformations](https://github.com/wasabeef/glide-transformations)

这个库有两个不同的版本。扩展版本包含了更多的转换，它是通过设备的 GPU 来计算处理的。这个版本需要有额外的依赖，所以这两个版本的设置有一点不同。你应该看看所拥有的转换方法的列表，再去决定你需要使用哪个版本。

### Reference

Glide - 自定义转换

> Glide Transformation简洁和glide-transformations库推荐<br /><http://mrfu.me/2016/02/28/Glide_Custom_Transformations/>

How to Blur Images Efficiently with Android's RenderScript

> 使用RenderScripe来模糊图片<br /><https://futurestud.io/tutorials/how-to-blur-images-efficiently-with-androids-renderscript>

## Glide缓存策略

> 注意的是：Glide默认是开启内存缓存和磁盘缓存的

### 内存缓存

- 跳过内存缓存`.skipMemoryCache(true)`<br />这样跳过了Glide的内存缓存，但Glide 将会仍然利用磁盘缓存来避免重复的网络请求。

```java
Glide.with(this)
        .load(ImageUtils.getImgs()[0])
        .skipMemoryCache(true)
        .into(mImageView);
```

**提示：** 注意一个事实，对于相同的 URL ，如果你的初始请求没调用 .skipMemoryCache(true) 方法，你后来又调用了 `.skipMemoryCache(true)` 这个方法，这个资源将会在内存中获取缓存。当你想要去调整缓存行为时，确保对同一个资源调用的一致性。

### 磁盘缓存

- 跳过磁盘缓存`.diskCacheStrategy(DiskCacheStrategy.NONE)`<br />内存缓存还有用

```java
Glide.with(this)
        .load(ImageUtils.getImgs()[0])
        .diskCacheStrategy(DiskCacheStrategy.NONE)
        .into(mImageView);
```

#### 自定义磁盘缓存行为

- [Picasso](https://futurestud.io/blog/tag/picasso/) 仅仅缓存了全尺寸的图像。
- Glide 缓存了原始图像，全分辨率图像和另外小版本的图像。<br />比如，如果你请求的一个图像是 1000x1000 像素的，但你的ImageView是 500x500 像素的，Glide 将会把这两个尺寸都进行缓存。
- `.diskCacheStrategy()` 方法来说不同的枚举参数的意义
- `DiskCacheStrategy.NONE` 什么都不缓存，用于跳过磁盘缓存
- `DiskCacheStrategy.SOURCE` 仅仅只缓存原来的全分辨率的图像。在我们上面的例子中，将会只有一个 1000x1000 像素的图片
- `DiskCacheStrategy.RESULT` 仅仅缓存最终的图像，即，降低分辨率后的（或者是转换后的）
- `DiskCacheStrategy.ALL` 缓存所有版本的图像（**默认行为**，3.6.1以及最新的3.7.0 .diskCacheStrategy()默认都是`DiskCacheStrategy.RESULT`?）

#### 跳过内存缓存又跳过磁盘缓存

```java
Glide.with(this)
        .load(ImageUtils.getImgs()[0])
        .skipMemoryCache(true)
        .diskCacheStrategy(DiskCacheStrategy.NONE)
        .into(mImageView);
```

### Reference

- [ ] Glide - 缓存基础<br /><http://mrfu.me/2016/02/27/Glide_Caching_Basics/>

## 自定义GlideModule

### applyOptions

### GlideBuilder

主要有：

- `.setMemoryCache(MemoryCache memoryCache)`
- `.setBitmapPool(BitmapPool bitmapPool)`
- `.setDiskCache(DiskCache.Factory diskCacheFactory)`
- `.setDiskCacheService(ExecutorService service)`
- `.setResizeService(ExecutorService service)`
- `.setDecodeFormat(DecodeFormat decodeFormat)`

### 增加Glide图片质量

在Android的主要两个解码配置：`Bitmap.Config.RGB_565`和`Bitmap.Config.ARGB_8888`。其中`ARGB_8888`存储每个像素需要4个字节，而`RGB_565`只使用两个字节。`ARGB_8888`优势在于图像质量更高以及能存储一个alpha通道。Glide默认采用的是低质量的RGB_565，Picasso使用的是ARGB_8888。

```java
builder.setDecodeFormat(DecodeFormat.PREFER_ARGB_8888);
```

### 自定义内存缓存和Bitmap缓存池大小

- 默认采用`LruResourceCache`作为内存缓存，LRU缓存策略；大于等于3.0采用`LruBitmapPool`作为Bitmap缓存池算法，小于3.0的BitmapPool实现为空。

```java
MemorySizeCalculator calculator = new MemorySizeCalculator(context);
if (bitmapPool == null) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
        int size = calculator.getBitmapPoolSize();
        bitmapPool = new LruBitmapPool(size);
    } else {
        bitmapPool = new BitmapPoolAdapter();
    }
}

if (memoryCache == null) {
    memoryCache = new LruResourceCache(calculator.getMemoryCacheSize());
}
```

- MemorySizeCalculator<br />Glide用来计算`memoryCacheSize`内存缓存大小和`bitmapPoolSize`Bitmap缓存池大小<br />最大缓存内存计算，低内存设备单个应用可用最大内存的0.33；不是低内存设备的0.44

```java
static final float MAX_SIZE_MULTIPLIER = 0.4f;
static final float LOW_MEMORY_MAX_SIZE_MULTIPLIER = 0.33f;

private static int getMaxSize(ActivityManager activityManager) {
    final int memoryClassBytes = activityManager.getMemoryClass() * 1024 * 1024;
    final boolean isLowMemoryDevice = isLowMemoryDevice(activityManager);
    return Math.round(memoryClassBytes
            * (isLowMemoryDevice ? LOW_MEMORY_MAX_SIZE_MULTIPLIER : MAX_SIZE_MULTIPLIER));
}
```

- 内存缓存大小和Bitmap缓存池大小<br />最终的内存缓存大小和Bitmap池缓存大小和屏幕像素密度有关<br />默认<br />bitmapPoolSize（Bitmap缓存池大小） = 屏幕像素密度 _ 4B(ARGB_8888占用内存字节数) _ 4(默认缓存4屏)<br />memoryCacheSize（内存缓存大小） = 屏幕像素密度 _ 4B(ARGB_8888占用内存字节数) _ 4(默认缓存2屏)

如果bitmapPoolSize + memoryCacheSize <= maxSize 就是默认值<br />如果大于了maxSize，会设置为当前接近maxSize和值。

```java
MemorySizeCalculator(Context context, ActivityManager activityManager, ScreenDimensions screenDimensions) {
    this.context = context;
    final int maxSize = getMaxSize(activityManager);

    final int screenSize = screenDimensions.getWidthPixels() * screenDimensions.getHeightPixels()
            * BYTES_PER_ARGB_8888_PIXEL;

    int targetPoolSize = screenSize * BITMAP_POOL_TARGET_SCREENS;
    int targetMemoryCacheSize = screenSize * MEMORY_CACHE_TARGET_SCREENS;

    if (targetMemoryCacheSize + targetPoolSize <= maxSize) {
        memoryCacheSize = targetMemoryCacheSize;
        bitmapPoolSize = targetPoolSize;
    } else {
        int part = Math.round((float) maxSize / (BITMAP_POOL_TARGET_SCREENS + MEMORY_CACHE_TARGET_SCREENS));
        memoryCacheSize = part * MEMORY_CACHE_TARGET_SCREENS;
        bitmapPoolSize = part * BITMAP_POOL_TARGET_SCREENS;
    }

    if (Log.isLoggable(TAG, Log.DEBUG)) {
        Log.d(TAG, "Calculated memory cache size: " + toMb(memoryCacheSize) + " pool size: " + toMb(bitmapPoolSize)
                + " memory class limited? " + (targetMemoryCacheSize + targetPoolSize > maxSize) + " max size: "
                + toMb(maxSize) + " memoryClass: " + activityManager.getMemoryClass() + " isLowMemoryDevice: "
                + isLowMemoryDevice(activityManager));
    }
}
```

### 自定义磁盘缓存

Glide3.7.x默认的磁盘缓存策略是`DiskCacheStrategy.RESULT`，默认的缓存位置为内部存储:（可以自定义先外部缓存再内部缓存空间）

```java
if (diskCacheFactory == null) {
    diskCacheFactory = new InternalCacheDiskCacheFactory(context);
}
```

- 提供了DiskLruCacheFactory的两个实现，`InternalCacheDiskCacheFactory`和`ExternalCacheDiskCacheFactory`
- InternalCacheDiskCacheFactory<br />应用内部缓存存储空间`context.getCacheDir()`，默认是250M缓存空间；默认内部缓存二级目录`image_manager_disk_cache`
- ExternalCacheDiskCacheFactory<br />应用外部缓存存储空间`context.getExternalCacheDir()`，默认250M空间；默认外部缓存二级目录`image_manager_disk_cache`

### registerComponents

参考：<br />Glide - Module 实例：接受自签名证书的 HTTPS<br /><http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/>

Glide - Module 实例：自定义缓存<br /><http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/>

## Glide animated webp(webp动画)

### GlideWebpSupport

- <https://github.com/roths/GlideWebpSupport>

> GlideWebpSupport借助了 fresco-webp 库 的解析 来 扩展 glide的 解码器， 实现 glide 加载 webp

- 问题

1. 可以加载webp静态图
2. 对于webp动态图，有的机器可以，[How to use Glid load webp and animated webp?](https://github.com/bumptech/glide/issues/2765)

### GlideWebpDecoder

- <https://github.com/zjupure/GlideWebpDecoder>

> 基于[libwebp](https://github.com/webmproject/libwebp)，参考Fresco和GlideWebpSupport的一些实现

- 可能存在的问题（需要测试确认？）

1. 掉帧？

- 用`BitmapTransformation`或库`glide-transformations`需要加上

```
Transformation<Bitmap> circleCrop = new CircleCrop();
GlideApp.with(mContext)
        .load(url)
        .optionalTransform(circleCrop)
        .optionalTransform(WebpDrawable.class, new WebpDrawableTransformation(circleCrop))
        .into(imageView);
```
