---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# Fresco基础

Fresco 是一个强大的图片加载组件。<br />Fresco 中设计有一个叫做 image pipeline 的模块。它负责从网络，从本地文件系统，本地资源加载图片。为了最大限度节省空间和CPU时间，它含有3级缓存设计（2级内存，1级文件）。<br />Fresco 中设计有一个叫做 Drawees 模块，方便地显示loading图，当图片不再显示在屏幕上时，及时地释放内存和空间占用。<br />Fresco 支持 Android2.3(API level 9) 及其以上系统。

## Fresco特性

### 1、内存管理

解压后的图片，即Android中的Bitmap，占用大量的内存。大的内存占用势必引发更加频繁的GC。<br />在5.0以下，GC将会显著地引发界面卡顿。<br />在5.0以下系统，Fresco将图片放到一个特别的内存区域。当然，在图片不显示的时候，占用的内存会自动被释放。这会使得APP更加流畅，减少因图片内存占用而引发的OOM。<br />Fresco 在低端机器上表现一样出色，你再也不用因图片内存占用而思前想后。

### 2、片的渐进式呈现

渐进式的JPEG图片格式已经流行数年了，渐进式图片格式先呈现大致的图片轮廓，然后随着图片下载的继续，呈现逐渐清晰的图片，这对于移动设备，尤其是慢网络有极大的利好，可带来更好的用户体验。<br />Android 本身的图片库不支持此格式，但是Fresco支持。使用时，和往常一样，仅仅需要提供一个图片的URI即可，剩下的事情，Fresco会处理。

### 3、gif、webp、webp动图格式

支持加载Gif图、WebP、webp动图格式。

### 4、图像的呈现

Fresco 的 Drawees 设计，带来一些有用的特性：

1. 自定义居中焦点（对人脸等图片显示非常有帮助）
2. 圆角图，圆圈也可以
3. 失败后重新下载
4. 自定义占位图，自定义overlay，进度条
5. 用户按压时的overlay

### 5、图像加载

Fresco 的 image pipeline 设计，允许用户在多方面控制图片的加载：

1. 为同一个图片指定不同的远程路径，或者使用已经存在本地缓存中的图片
2. 先显示一个低解析度的图片，等高清图下载完之后再显示高清图
3. 加载完成回调通知
4. 对于本地图，如有EXIF缩略图，在大图加载完成之前，可先显示缩略图
5. 缩放或者旋转图片
6. 处理已下载的图片
7. WebP 支持

## 二、引入fresco

### 1、添加依赖

<https://www.fresco-cn.org/docs/index.html>

```
dependencies {
    compile 'com.facebook.fresco:fresco:0.12.0'
}
```

下面的依赖需要根据需求添加：

```
dependencies {
  // 在 API < 14 上的机器支持 WebP 时，需要添加
  compile 'com.facebook.fresco:animated-base-support:0.12.0'

  // 支持 GIF 动图，需要添加
  compile 'com.facebook.fresco:animated-gif:0.12.0'

  // 支持 WebP （静态图+动图），需要添加
  compile 'com.facebook.fresco:animated-webp:0.12.0'
  compile 'com.facebook.fresco:webpsupport:0.12.0'

  // 仅支持 WebP 静态图，需要添加
  compile 'com.facebook.fresco:webpsupport:0.12.0'
}
```

### 2、编译fresco

**参考:** <http://www.fresco-cn.org/docs/compile-in-android-studio.html#_><br />**note:** 需要配置NDK环境

### 3、简单引入

_在Application中初始化_，在Activity的setContentView()之前初始化，最好就是在Application中初始化

```java
Fresco.initialize(context);
```

#### 导入名称空间

```xml
<!-- 其他元素 -->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:fresco="http://schemas.android.com/apk/res-auto">
```

#### SimpleDraweeView

```xml
<com.facebook.drawee.view.SimpleDraweeView
    android:id="@+id/my_image_view"
    android:layout_width="20dp"
    android:layout_height="20dp"
    fresco:placeholderImage="@drawable/my_drawable"
  />
```

> SimpleDraweeView不支持wrap_content属性

#### 开始加载图片

```java
Uri uri = Uri.parse("https://raw.githubusercontent.com/facebook/fresco/gh-pages/static/fresco-logo.png");
SimpleDraweeView draweeView = (SimpleDraweeView) findViewById(R.id.my_image_view);
draweeView.setImageURI(uri);
```

#### Uri

支持的uri/ UriUtil

| uri类型           | Scheme           | 示例                        |
| --------------- | ---------------- | ------------------------- |
| 远程图片url         | http://、https:// | HttpURLConnection         |
| 本地文件            | file://          | FileInputStream           |
| ContentProvider | content://       | ContentResolver           |
| assets目录下的资源    | asset://         | AssetManager              |
| res目录下的资源       | res://           | Resources.openRawResource |

> res示例：<br />Uri uri = Uri.parse("res://me.hacket.androidtools/"+R.drawable.ic_launcher);

注意：**Fresco不支持相对路径的Uri，所有的Uri都必须是绝对路径，并且带上该Uri的scheme。**

##### res

```java
ivCover.setImageURI(UriUtil.getUriForResourceId(R.drawable.feed_image_picker_video));
```

##### File

```
UriUtil Uri getUriForFile(File file)
```

##### getUriForQualifiedResource

```
UriUtil Uri getUriForQualifiedResource(String packageName, int resourceId)
```

##### 封装

```java
/**
 * 加载本地图片（drawable图片）
 * @param context
 * @param simpleDraweeView
 * @param id
 */
public static void loadResPic(Context context, SimpleDraweeView simpleDraweeView, int id) {
    Uri uri = Uri.parse("res://" +
            context.getPackageName() +
            "/" + id);
    simpleDraweeView.setImageURI(uri);
}

/**
 * 加载本地图片（assets图片）
 * @param context
 * @param simpleDraweeView
 * @param nameWithSuffix 带后缀的名称
 */
public static void loadAssetsPic(Context context, SimpleDraweeView simpleDraweeView, String nameWithSuffix) {
    Uri uri = Uri.parse("asset:///" +
           nameWithSuffix);
    simpleDraweeView.setImageURI(uri);
}
```

### Fresco proguard

> 打包release版本时报UnsatisfiedLinkError异常，debug版本是正常的

需要配置proguard

```
# Fresco https://github.com/facebook/fresco/blob/master/fbcore/proguard-fresco.pro
# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.soloader.DoNotOptimize

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
   @com.facebook.common.internal.DoNotStrip *;
}

# Do not strip any method/class that is annotated with @DoNotOptimize
-keep @com.facebook.soloader.DoNotOptimize class *
-keepclassmembers class * {
   @com.facebook.soloader.DoNotOptimize *;
}

# Keep native methods
-keepclassmembers class * {
   native <methods>;
}

-dontwarn okio.**
-dontwarn com.squareup.okhttp.**
-dontwarn okhttp3.**
-dontwarn javax.annotation.**
-dontwarn com.android.volley.toolbox.**
-dontwarn com.facebook.infer.**


-keep class com.facebook.imagepipeline.gif.** { *; }
-keep class com.facebook.imagepipeline.webp.** { *; }

# Works around a bug in the animated GIF module which will be fixed in 0.12.0
-keep class com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl {
   public AnimatedFactoryImpl(com.facebook.imagepipeline.bitmaps.PlatformBitmapFactory,com.facebook.imagepipeline.core.ExecutorSupplier);
}
```

## Drawee指南

Drawees负责图片的呈现，由三个元素组成，有点像MVC模式。

### DraweeView

继承View，负责图片展示。<br />一般用SimpleDraweeView，可用于Java代码和XML中使用。

### DraweeHierarchy

DraweeHierarchy 用于组织和维护最终绘制和呈现的 Drawable 对象，相当于MVC中的M。

### DrawwwController

DraweeController 负责和 image loader 交互（ Fresco 中默认为 image pipeline, 当然你也可以指定别的），可以创建一个这个类的实例，来实现对所要显示的图片做更多的控制。<br />如果你还需要对Uri加载到的图片做一些额外的处理，那么你会需要这个类的。

- DraweeControllerBuilder<br />DraweeController由DraweeControllerBuilder 采用 Builder 模式创建，创建之后，不可修改。

---

### Drawee之xml

#### 1、在XML中使用Drawees

Drawees 具有极大的可定制性<br />下面的例子给出了可以配置的各种选项

```xml
<com.facebook.drawee.view.SimpleDraweeView
    android:id="@+id/my_image_view" // 属性id
    android:layout_width="20dp" // 设置宽度，不支持wrap_content，可以设置宽高比
    android:layout_height="20dp" // 设置高度，不支持wrap_content
    fresco:viewAspectRatio="1.5f" // 控件纵横比
    fresco:fadeDuration="300"   // 淡入淡出渐变动画时间，单位毫秒
    fresco:actualImageResource="@drawable/hehe" // 实际显示图，相当于ImageView的src
    fresco:actualImageScaleType="focusCrop" // 实际显示图缩放类型scaleType，相当于ImageView的scaleType，通常使用focusCrop，该属性值会通过算法把人头像放在中间
    fresco:placeholderImage="@color/wait_color" // 占位图，默认图，下载成功之前显示的图片
    fresco:placeholderImageScaleType="fitCenter" // 占位图的缩放类型scaleType
    fresco:failureImage="@drawable/error" // 失败图，加载失败时显示的图片
    fresco:failureImageScaleType="centerInside" // 失败时的缩放类型scaleType
    fresco:retryImage="@drawable/retrying" // 重试图，加载失败提示用户点击重新加载的（会覆盖failureImage的图片
    fresco:retryImageScaleType="centerCrop" // 重试图显示的scaleType
    fresco:progressBarImage="@drawable/progress_bar" // 进度图，提示用户正在加载，和加载进度无关
    fresco:progressBarImageScaleType="centerInside" // 进度图的缩放类型scaleType
    fresco:progressBarAutoRotateInterval="1000" // 进度图自动旋转间隔时间，单位毫秒
    fresco:backgroundImage="@color/blue" // 背景图
    fresco:overlayImage="@drawable/watermark"  // 叠加图，覆盖物
    fresco:pressedStateOverlayImage="@color/red" // 按压状态下所显示的叠加图
    fresco:roundAsCircle="false" // 是否是圆圈
    fresco:roundedCornerRadius="1dp" // 圆形角度，180°的时候会变成圆形图片
    fresco:roundTopLeft="true" // 左上角是否圆角
    fresco:roundTopRight="false" // 右上角是否圆角
    fresco:roundBottomLeft="false" // 左下角是否圆角
    fresco:roundBottomRight="true" // 右下角是否圆角
    fresco:roundingBorderWidth="2dp" // 圆形或圆角图边框的宽度
    fresco:roundingBorderColor="@color/border_color" //  圆形或圆角图边框的边框的颜色
    fresco:roundWithOverlayColor="@color/corner_color" //  圆形或圆角图边底下的叠加颜色（只能设置颜色）
  />
```

- 设置了`actualImageResource`属性，如果又设置了`placeholderImage`属性，会先展示placeHolder，再执行`fadeDuration`渐变动画，最终展示actualImage
- 加载gif和动图webp，设置的圆角或圆形边框只是作用于background，加载gif和动图webp，会填充原有的宽高，背景在下面<br />![](https://note.youdao.com/src/B6F5A1E3A61F40B094185804FAD26DCF#id=D3O59&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
- 设置了`placeholderImage`和`progressBarImage`，会同时显示的
- 强制宽高比<br />你必须声明 `android:layout_width` 和 `android:layout_height`。如果没有在XML中声明这两个属性，将无法正确加载图像，且不能是`wrap_content`。<br />Drawees 不支持 `wrap_content` 属性。如果所下载的图像可能和占位图尺寸不一致，如果设置出错图或者重试图的话，这些图的尺寸也可能和所下载的图尺寸不一致。<br />如果大小不一致，假设使用的是 `wrap_content`，图像下载完之后，View将会重新layout，改变大小和位置。这将会导致界面跳跃。
- 固定宽高比<br />只有希望显示固定的宽高比时，可以使用`wrap_content`

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
        xmlns:fresco="http://schemas.android.com/apk/res-auto"
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:background="#99a0ff00"
        android:layout_height="match_parent">

    <com.facebook.drawee.view.SimpleDraweeView
            android:id="@+id/my_image_view"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_centerInParent="true"
            fresco:viewAspectRatio="2"
            fresco:placeholderImage="@mipmap/ic_launcher"/>
</RelativeLayout>
```

代码设置：

```java
mSimpleDraweeView.setAspectRatio(2.0f);
```

比例ratio=w/h，需要设置成比例的那边，不可以设置为0dp和match_parent，只能设置为wrap_content，源码如下：

```java
    /**
    * Sets the desired aspect ratio (w/h).
    */
    public void setAspectRatio(float aspectRatio) {
        if (aspectRatio == mAspectRatio) {
          return;
        }
        mAspectRatio = aspectRatio;
        requestLayout();
    }
```

效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687659498569-c97317bc-4735-4e2e-997e-f9be6d803c56.png#averageHue=%23c5f968&clientId=ud2767009-c021-4&from=paste&height=677&id=u37288e89&originHeight=1016&originWidth=670&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=209903&status=done&style=none&taskId=u911dcf40-2a7a-49ea-8bb0-2976827fe93&title=&width=446.6666666666667)

#### 2、在JAVA代码中使用Drawees

##### 设置或更改要显示的图片.

```java
mSimpleDraweeView.setImageURI(uri);
```

通过`GenericDraweeHierarchyBuilder`来设置xml中可以设置的属性，得到一个`GenericDraweeHierarchy`，然后设置给SimpleDraweeView

##### 自定义显示图

```java
List<Drawable> backgroundsList;
List<Drawable> overlaysList;
GenericDraweeHierarchyBuilder builder =
    new GenericDraweeHierarchyBuilder(getResources());
GenericDraweeHierarchy hierarchy = builder
    .setFadeDuration(300)   // 渐变
    .setPlaceholderImage(new MyCustomDrawable()) // 占位图
    .setBackgrounds(backgroundList) 
    .setOverlays(overlaysList) // 覆盖物
    .build();
mSimpleDraweeView.setHierarchy(hierarchy);
```

对于同一个View，请不要多次调用`setHierarchy`，即使这个View是可回收的。创建 DraweeHierarchy 的较为耗时的一个过程，应该多次利用。<br />如果要改变所要显示的图片可使用`setController` 或者 `setImageURI`

##### 运行时动态改变DraweeHierarchy

```java
protected void onCreate(Bundle savedInstanceState) {

    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    draweeView = (SimpleDraweeView) findViewById(R.id.my_image_view);

    List<Drawable> backgrounds = new ArrayList<Drawable>();
    backgrounds.add(getResources().getDrawable(R.drawable.a));
    backgrounds.add(getResources().getDrawable(R.drawable.b));
    backgrounds.add(getResources().getDrawable(R.drawable.c));

    GenericDraweeHierarchyBuilder builder = new GenericDraweeHierarchyBuilder(getResources());

    builder.setFadeDuration(10000); // 渐变出来
    builder.setPlaceholderImage(getResources().getDrawable(R.drawable.no_content_picture));
//        builder.setBackgrounds(backgrounds);
    builder.setBackground(backgrounds.get(0));
//        builder.setOverlay(getResources().getDrawable(R.drawable.no_content_picture)); // 覆盖物
//        builder.setOverlays();
    GenericDraweeHierarchy hierarchy = builder.build();
    draweeView.setHierarchy(hierarchy);

    // 改变image url
    draweeView.setImageURI(Uri.parse("http://img1.gtimg.com/sports/pics/hv1/62/201/2001/130166342.jpg"));
//        draweeView.setImageURI(Uri.parse("http://img.sootuu.com/vector/2006-4/2006419182424393.jpg"));

    new Handler().postDelayed(new Runnable() {
        @Override
        public void run() {
            // 运行时改变placeHolderImage
            draweeView.getHierarchy().setPlaceholderImage(R.mipmap.ic_launcher);
        }
    }, 1000);

    // 设置缩放类型
    draweeView.getHierarchy().setActualImageScaleType(ScalingUtils.ScaleType.FOCUS_CROP);

    // colorfilter
//        draweeView.getHierarchy().setActualImageColorFilter();

    // 设置圆角
    RoundingParams params = new RoundingParams();
//        params.setCornersRadius(20);
    params.setCornersRadius(50);
    draweeView.getHierarchy().setRoundingParams(params);
//        RoundingParams roundingParams = hierarchy.getRoundingParams();
//        roundingParams.setCornersRadius(20);
//        draweeView.getHierarchy().setRoundingParams(roundingParams);

}
```

##### 圆角

除了圆角显示方式（原来为圆角的不能修改为圆圈，反之亦然），其他圆角相关的呈现参数, 具体参见这里 是可以动态修改的。

```java
// 如:获取DraweeHierarchy的圆角显示参数，修改圆角半径为10。
RoundingParams roundingParams = hierarchy.getRoundingParams();
roundingParams.setCornersRadius(10);
hierarchy.setRoundingParams(roundingParams);
```

## Drawee的各种效果配置

如何设置实现不同的图片呈现效果

- 设置要加载的图片
- 占位图
- 加载失败时的占位图
- 点击重新加载
- 显示一个进度条
- 背景
- 叠加图
- 按压状态下的叠加图
- 圆角
- 渐变式JPEG
- 动画图支持

在Java 代码中也可以指定。如果需要 [通过程序设定](http://www.fresco-cn.org/docs/using-drawees-code.html) 的话会接触到这个类:[GenericDraweeHierarchyBuilder](http://www.fresco-cn.org/javadoc/reference/com/facebook/drawee/generic/GenericDraweeHierarchyBuilder.html)。<br />通过`GenericDraweeHierarchyBuilder`创建完[GenericDraweeHierarchy](http://www.fresco-cn.org/javadoc/reference/com/facebook/drawee/generic/GenericDraweeHierarchy.html)之后，也可以通过该类的相关方法，重新设置一些效果。

### 设置置要加载的图片

除了需要加载的图片是真正必须的，其他的都是可选的。如前所述，图片可以来自多个地方。

所需加载的图片实际是 DraweeController 的一个属性，而不是 DraweeHierarchy 的属性。

可使用`setImageURI`方法或者[通过设置DraweeController](http://www.fresco-cn.org/docs/using-controllerbuilder.html) 来进行设置。

对于要加载的图片，除了可以设置缩放类型外，DraweeHierarchy 还公开出一些其他方法用来控制显示效果:

- focus point (居中焦点, 用于[focusCrop缩放模式](http://www.fresco-cn.org/docs/scaling.html#FocusCrop))
- color filter

默认的缩放类型是: `centerCrop`

通过`setImageURI(uri)`或者`setController(controller)`

```java
DraweeController draweeViewController = Fresco.newDraweeControllerBuilder()
        .setUri(Uri.parse("http://img1.imgtn.bdimg.com/it/u=2282547951,3816622274&fm=21&gp=0.jpg")) // 20M大图
        .setTapToRetryEnabled(true)
        .setControllerListener(new MyListener())
        .build();
draweeView.setController(draweeViewController);
//    draweeView.setImageURI(Uri.parse("http://www.bz55.com/uploads/allimg/150309/139-150309101A0.jpg"));
```

### 占位图Placeholder

在调用`setController` 或者 `setImageURI` 之后，占位图开始显示，直到图片加载完成。

对于渐进式格式的JPEG图片，占位图会显示直到满足已加载的图片解析度到达设定值。

XML 中属性值: `placeholderImage`<br />Hierarchy builder中的方法: `setPlaceholderImage`<br />Hierarchy method: `setPlaceholderImage`<br />默认值: a transparent [ColorDrawable](http://developer.android.com/reference/android/graphics/drawable/ColorDrawable.html)<br />默认缩放类型: `centerInside`

### 设置加载失败占位图

如果URI是无效的，或者下载过程中网络不可用，将会导致加载失败。当加载图片出错时，你可以设置一个出错提示图片。

XML 中属性值: `failureImage`<br />Hierarchy builder中的方法: `setFailureImage`<br />默认值: The placeholder image<br />默认缩放类型: `centerInside`

### 点击重新加载图

在加载失败时，可以设置点击重新加载。这时提供一个图片，加载失败时，会显示这个图片（而不是失败提示图片），提示用户点击重试。

在[ControllerBuilder](http://www.fresco-cn.org/docs/using-controllerbuilder.html) 中如下设置:

```
.setTapToRetryEnabled(true)
```

加载失败时，image pipeline 会重试四次；如果还是加载失败，则显示加载失败提示图片。

XML 中属性值: `retryImage`<br />Hierarchy builder中的方法: `setRetryImage`<br />默认值: The placeholder image<br />默认缩放类型: `centerInside`

### 显示一个进度条

如果设置一个进度条图片，提示用户正在加载。该图片会覆盖在 Drawee 上直到图片加载完成。

如果需要自定义，更详细的情况，请参考 [进度条页面](http://www.fresco-cn.org/docs/progress-bars.html)

XML 中属性值: `progressBarImage`<br />Hierarchy builder中的方法: `setProgressBarImage`<br />默认值: None<br />默认缩放类型: `centerInside`

### 背景

背景图会最先绘制，在XML中只可以指定一个背景图，但是在JAVA代码中，可以指定多个背景图。

当指定一个背景图列表的时候，列表中的第一项会被首先绘制，绘制在最下层，然后依次往上绘制。

背景图片不支持缩放类型，会被强制到`Drawee`尺寸大小。

XML 中属性值: `backgroundImage`<br />Hierarchy builder中的方法: `setBackground,` `setBackgrounds`<br />默认值: None<br />默认缩放类型: N/A

### 设置叠加图Overlay

叠加图会最后被绘制。

和背景图一样，XML中只可以指定一个，如果想指定多个，可以通过JAVA代码实现。

当指定的叠加图是一个列表的时候，列表第一个元素会被先绘制，最后一个元素最后被绘制到最上层。

同样的，不支持各种缩放类型。

XML 中属性值: `overlayImage`<br />Hierarchy builder中的方法: `setOverlay,` `setOverlays`<br />默认值: None<br />默认缩放类型: N/A

### 设置按压状态下的叠加图

同样不支持缩放，用户按压DraweeView时呈现。

XML 中属性值: `pressedStateOverlayImage`<br />Hierarchy builder中的方法: `setPressedStateOverlay`<br />默认值: None<br />默认缩放类型: N/A

### 圆角

```java
// 设置圆角
RoundingParams roundingParams = RoundingParams.asCircle();
roundingParams.setBorder(Color.RED,2); // 边框颜色和宽度
// roundingParams.setRoundAsCircle(true);
builder.setRoundingParams(roundingParams);
```

### 渐变式JPEG

Fresco 支持渐进式的网络JPEG图。在开始加载之后，图会从模糊到清晰渐渐呈现。<br />你可以设置一个清晰度标准，在未达到这个清晰度之前，会一直显示占位图。<br />渐进式JPEG图仅仅支持网络图。

```java
Uri uri = Uri.parse(ImageUtils.getProgressiveJpeg());
ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
        .setProgressiveRenderingEnabled(true)
        .build();
DraweeController controller = Fresco.newDraweeControllerBuilder()
        .setImageRequest(request)
        .setOldController(mSimpleDraweeView.getController())
        .setControllerListener(myControllerListener)
        .build();
mSimpleDraweeView.setController(controller);
```

### 动画图支持

Fresco 支持 GIF 和 WebP 格式的动画图片。对于 WebP 格式的动画图的支持包括扩展的 WebP 格式，即使 Android 2.3及其以后那些没有原生 WebP 支持的系统。

### Drawee其他配置

#### DraweeController

**用途：**如果你需要对`加载显示的图片做更多的控制和定制`，那就需要用到DraweeController。<br />首先，创建一个DraweeController, 然后传递图片加载请求给PipelineDraweeControllerBuilder<br />随后，你可以控制controller的其他选项了。

```java
// DraweeController
DraweeController draweeViewController = Fresco.newDraweeControllerBuilder()
        draweeViewController.setUri(Uri.parse("http://img1.imgtn.bdimg.com/it/u=2282547951,3816622274&fm=21&gp=0.jpg"))
        .setTapToRetryEnabled(true)
        .setControllerListener(new MyListener())
        .setOldController(draweeView.getController())
        .build();
draweeView.setController(draweeViewController);
```

在指定一个新的controller的时候，使用`setOldController`，这可节省不必要的内存分配。

#### ControllerListener

监听下载事件<br />**用途：**你也许想在图片下载完成后执行一些动作，比如使某个别的 `View` 可见，或者显示一些文字。你也许还想在下载失败后做一些事，比如向用户显示一条失败信息。

图片是后台线程异步加载的，所以你需要某一方式来监听 `DraweeController` 传递的事件。我们可以使用一个 `ControllerListener` 实现事件的监听。

_在监听事件回调时，无法修改图片，如果需要修改图片，可使用_[_后处理器(Postprocessor)_](http://www.fresco-cn.org/docs/modifying-image.html)

推荐BaseControllerListener是ControllerListener的空实现。

对所有的图片加载，`onFinalImageSet` 或者 `onFailure` 都会被触发。前者在成功时，后者在失败时。

如果允许呈现[渐进式JPEG](http://www.fresco-cn.org/docs/progressive-jpegs.html)，同时图片也是渐进式图片，`onIntermediateImageSet`会在每个扫描被解码后回调。具体图片的那个扫描会被解码，参见[渐进式JPEG图](http://www.fresco-cn.org/docs/progressive-jpegs.html)。

```java
ControllerListener controllerListener = new BaseControllerListener<ImageInfo>() {
    @Override
    public void onFinalImageSet(
        String id,
        @Nullable ImageInfo imageInfo,
        @Nullable Animatable anim) {
      if (imageInfo == null) {
        return;
      }
      QualityInfo qualityInfo = imageInfo.getQualityInfo();
      FLog.d("Final image received! " + 
          "Size %d x %d",
          "Quality level %d, good enough: %s, full quality: %s",
          imageInfo.getWidth(),
          imageInfo.getHeight(),
          qualityInfo.getQuality(),
          qualityInfo.isOfGoodEnoughQuality(),
          qualityInfo.isOfFullQuality());
    }

    @Override
    public void onIntermediateImageSet(String id, @Nullable ImageInfo imageInfo) {
      FLog.d("Intermediate image received");
    }

    @Override
    public void onFailure(String id, Throwable throwable) {
      FLog.e(getClass(), throwable, "Error loading %s", id)
    }
};

Uri uri;
DraweeController controller = Fresco.newControllerBuilder()
    .setControllerListener(controllerListener)
    .setUri(uri);
    // other setters
    .build();
mSimpleDraweeView.setController(controller);
```

#### Postprocessor

后处理器<br />**用途：**有时，我们想对从服务器下载，或者本地获取的图片做些修改，比如在某个坐标统一加个网格什么的。你可以使用 `Postprocessor`，最好的方式是继承 [BasePostprocessor](http://www.fresco-cn.org/javadoc/reference/com/facebook/imagepipeline/request/BasePostprocessor.html)。<br />如：给图片加了红色网格

```java
Uri uri;
Postprocessor redMeshPostprocessor = new BasePostprocessor() { 
  @Override
  public String getName() {
    return "redMeshPostprocessor";
  }

  @Override
  public void process(Bitmap bitmap) {
    for (int x = 0; x < bitmap.getWidth(); x+=2) {
      for (int y = 0; y < bitmap.getHeight(); y+=2) {
        bitmap.setPixel(x, y, Color.RED);
      }
    }
  }
}

ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
    .setPostprocessor(redMeshPostprocessor)
    .build();

PipelineDraweeController controller = (PipelineDraweeController) 
    Fresco.newDraweeControllerBuilder()
    .setImageRequest(request)
    .setOldController(mSimpleDraweeView.getController())
    // other setters as you need
    .build();
mSimpleDraweeView.setController(controller);
```

##### 注意点

图片在进入后处理器(postprocessor)的图片是原图的一个完整拷贝，原来的图片不受修改的影响。在5.0以前的机器上，拷贝后的图片也在native内存中。

在开始一个图片显示时，即使是反复显示同一个图片，在每次进行显示时，都需要指定后处理器。对于同一个图片，每次显示可以使用不同的后处理器。

后处理器现在不支持`gif动画图片`。

##### 复制 bitmap

###### 复制成不同大小

###### 重复的后处理

###### 透明的图片

见[修改图片](http://www.fresco-cn.org/docs/modifying-image.html#)

#### 自定义图片加载请求

## Fresco之Image Pipeline

Image Pipeline负责完成加载图像，变成Android设备可呈现的形式所要做的每个事情。

### Image Pipeline配置

- 磁盘缓存目录
- 配置磁盘缓存

### 多图请求及图片复用

先显示低分辨率的图，然后是高分辨率的图：假设你要显示一张高分辨率的图，但是这张图下载比较耗时。与其一直显示占位图，你可能想要先下载一个较小的缩略图。这时，你可以设置两个图片的URI，一个是低分辨率的缩略图，一个是高分辨率的图。

```java
Uri lowResUri, highResUri;
DraweeController controller = Fresco.newDraweeControllerBuilder()
    .setLowResImageRequest(ImageRequest.fromUri(lowResUri))
    .setImageRequest(ImageRequest.fromUri(highResUri))
    .setOldController(mSimpleDraweeView.getController())
    .build();
mSimpleDraweeView.setController(controller);
```

### 缩略图预览

本功能仅支持本地URI，并且是JPEG图片格式<br />如果本地JPEG图，有EXIF的缩略图，image pipeline 可以立刻返回它作为一个缩略图。Drawee 会先显示缩略图，完整的清晰大图在 decode 完之后再显示。

```java
Uri uri;
ImageRequest request = ImageRequestBuilder.newBuilderWithSource(uri)
    .setLocalThumbnailPreviewsEnabled(true)
    .build();

DraweeController controller = Fresco.newDraweeControllerBuilder()
    .setImageRequest(request)
    .setOldController(mSimpleDraweeView.getController())
    .build();
mSimpleDraweeView.setController(controller);
```

### 加载最先可用的图片

大部分时候，一张图片只有一个 URI。加载它，然后工作完成～

但是假设同一张图片有多个 URI 的情况。比如，你可能上传过一张拍摄的照片。原始图片太大而不能上传，所以图片首先经过了压缩。在这种情况下，首先尝试获取本地压缩后的图片 URI，如果失败的话，尝试获取本地原始图片 URI，如果还是失败的话，尝试获取上传到网络的图片 URI。直接下载我们本地可能已经有了的图片不是一件光彩的事。

Image pipeline 会首先从内存中搜寻图片，然后是磁盘缓存，再然后是网络或其他来源。对于多张图片，不是一张一张按上面的过程去做，而是 pipeline 先检查所有图片是否在内存。只有没在内存被搜寻到的才会寻找磁盘缓存。还没有被搜寻到的，才会进行一个外部请求。

使用时，创建一个image request 数组，然后传给 ControllerBuilder :

```java
Uri uri1, uri2;
ImageRequest request = ImageRequest.fromUri(uri1);
ImageRequest request2 = ImageRequest.fromUri(uri2);
ImageRequest[] requests = { request1, request2 };

DraweeController controller = Fresco.newDraweeControllerBuilder()
    .setFirstAvailableImageRequests(requests)
    .setOldController(mSimpleDraweeView.getController())
    .build();
mSimpleDraweeView.setController(controller);
```

这些请求中只有一个会被展示。第一个被发现的，无论是在内存，磁盘或者网络，都会是被返回的那个。pipeline 认为数组中请求的顺序即为优先顺序。

### 清除缓存

清除缓存中的一条url

```java
ImagePipeline imagePipeline = Fresco.getImagePipeline();
Uri uri;
imagePipeline.evictFromMemoryCache(uri);
imagePipeline.evictFromDiskCache(uri);

// combines above two lines
imagePipeline.evictFromCache(uri);
```

如同上面一样，evictFromDiskCache(Uri)假定你使用的是默认的CacheKeyFactory。如果你自定义，请使用evictFromDiskCache(ImageRequest)。<br />清除所有缓存

```java
ImagePipeline imagePipeline = Fresco.getImagePipeline();
imagePipeline.clearMemoryCaches();
imagePipeline.clearDiskCaches();

// combines above two lines
imagePipeline.clearCaches();
```
