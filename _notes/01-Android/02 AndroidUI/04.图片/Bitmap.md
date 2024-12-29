---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# Android之Bitmap

## Bitmap介绍

Bitmap代表一张位图，位图文件图像效果好（高质量图片格式），但是非压缩格式的，需要占用较大存储空间，不利于网络上传送。而JPEG格式就弥补了位图文件这个缺点。<br />在Android中，Bitmap是图像处理最重要的类之一，用它可以获取图像文件信息，进行图像剪切、旋转、缩放等操作，并可以指定格式保存图像文件。

## Bitmap获取

通过BitmapFactory获取

- 通过资源id  decodeResource()
- 通过文件路径
- 通过字节数组
- 通过数据流  decodeStream()

## BitmapFactory.Options

- inJustDecodeBounds<br />设置为true后，不会真正分配Bitmap所占用的内存空间，仅仅获取一些属性
- inSampleSize<br />缩放图片采用的比率值
- inPreferredConfig = Bitmap.Config.ARGB_8888<br />设置图片的色彩模式，默认ARGB_8888。可选见Bitmap.Config：ALPHA_8、RGB_565、ARGB_4444(过时)、默认ARGB_8888。

## Bitmap图片处理

通过Bitmap对图片的操作，都是通过jni来实现，调用skia这个库（具体可以操作bugly的bitmap占用内存那篇文件）。

- 剪切<br />Bitmap.createBitmap()
- 缩放<br />Matrix.postScale()
- 旋转<br />Matrix.postRotate()
- 平移<br />Matrix.postTranslate()
- 保存<br />compress()

## 图片到底储存在哪里？

8.0Bitmap的像素数据存储在Native，为什么又改为Native存储呢？

> 因为8.0共享了整个系统的内存，测试8.0手机如果一直创建Bitmap，如果手机内存有1G，那么你的应用加载1G也不会oom。

## Bitmap分块加载（加载巨图之图片）

加载清明上河图，要求我们既不能压缩图片，又不能发生oom怎么办？

### 图片分块加载

图片的分块加载，在地图绘制的情况上最为明显，当想要获取一张尺寸很大的图片的某一小块区域时，就可以用到了图片的分块加载。<br />如显示：世界地图、清明上河图、微博长图等。

### BitmapRegionDecoder

BitmapRegionDecoder用来解码图片中的一块矩形区域，典型用法是加载一张大图的小部分。

```java
//支持传入图片的路径，流和图片修饰符等
BitmapRegionDecoder mDecoder = BitmapRegionDecoder.newInstance(path, false);
//需要显示的区域就有由rect控制，options来控制图片的属性
Bitmap bitmap = mDecoder.decodeRegion(mRect, options);
```

由于要显示一部分区域，所以要有手势的控制，方便上下的滑动，需要自定义控件，而自定义控件的思路也很简单 1 提供图片的入口 2 重写onTouchEvent， 根据手势的移动更新显示区域的参数 3 更新区域参数后，刷新控件重新绘制。

```java
public class BigImageView extends View {

    private BitmapRegionDecoder mDecoder;
    private int mImageWidth;
    private int mImageHeight;
    //图片绘制的区域
    private Rect mRect = new Rect();
    private static final BitmapFactory.Options options = new BitmapFactory.Options();

    static {
        options.inPreferredConfig = Bitmap.Config.RGB_565;
    }

    public BigImageView(Context context) {
        super(context);
        init();
    }

    public BigImageView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public BigImageView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {

    }

    /**
     * 自定义view的入口，设置图片流
     *
     * @param path 图片路径
     */
    public void setFilePath(String path) {
        try {
            //初始化BitmapRegionDecoder
            mDecoder = BitmapRegionDecoder.newInstance(path, false);
            BitmapFactory.Options options = new BitmapFactory.Options();
            //便是只加载图片属性，不加载bitmap进入内存
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(path, options);
            //图片的宽高
            mImageWidth = options.outWidth;
            mImageHeight = options.outHeight;
            Log.d("mmm", "图片宽=" + mImageWidth + "图片高=" + mImageHeight);

            requestLayout();
            invalidate();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        //获取本view的宽高
        int measuredHeight = getMeasuredHeight();
        int measuredWidth = getMeasuredWidth();


        //默认显示图片左上方
        mRect.left = 0;
        mRect.top = 0;
        mRect.right = mRect.left + measuredWidth;
        mRect.bottom = mRect.top + measuredHeight;
    }

    //第一次按下的位置
    private float mDownX;
    private float mDownY;

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mDownX = event.getX();
                mDownY = event.getY();
                break;
            case MotionEvent.ACTION_MOVE:
                float moveX = event.getX();
                float moveY = event.getY();
                //移动的距离
                int xDistance = (int) (moveX - mDownX);
                int yDistance = (int) (moveY - mDownY);
                Log.d("mmm", "mDownX=" + mDownX + "mDownY=" + mDownY);
                Log.d("mmm", "movex=" + moveX + "movey=" + moveY);
                Log.d("mmm", "xDistance=" + xDistance + "yDistance=" + yDistance);
                Log.d("mmm", "mImageWidth=" + mImageWidth + "mImageHeight=" + mImageHeight);
                Log.d("mmm", "getWidth=" + getWidth() + "getHeight=" + getHeight());
                if (mImageWidth > getWidth()) {
                    mRect.offset(-xDistance, 0);
                    checkWidth();
                    //刷新页面
                    invalidate();
                    Log.d("mmm", "刷新宽度");
                }
                if (mImageHeight > getHeight()) {
                    mRect.offset(0, -yDistance);
                    checkHeight();
                    invalidate();
                    Log.d("mmm", "刷新高度");
                }
                break;
            case MotionEvent.ACTION_UP:
                break;
            default:
        }
        return true;
    }


    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        Bitmap bitmap = mDecoder.decodeRegion(mRect, options);
        canvas.drawBitmap(bitmap, 0, 0, null);
    }

    /**
     * 确保图不划出屏幕
     */
    private void checkWidth() {


        Rect rect = mRect;
        int imageWidth = mImageWidth;
        int imageHeight = mImageHeight;

        if (rect.right > imageWidth) {
            rect.right = imageWidth;
            rect.left = imageWidth - getWidth();
        }

        if (rect.left < 0) {
            rect.left = 0;
            rect.right = getWidth();
        }
    }

    /**
     * 确保图不划出屏幕
     */
    private void checkHeight() {

        Rect rect = mRect;
        int imageWidth = mImageWidth;
        int imageHeight = mImageHeight;

        if (rect.bottom > imageHeight) {
            rect.bottom = imageHeight;
            rect.top = imageHeight - getHeight();
        }

        if (rect.top < 0) {
            rect.top = 0;
            rect.bottom = getHeight();
        }
    }
}
```

### Reference

- [ ] Android高清加载巨图方案 拒绝压缩图片(zhanghongyang)

# Bitmap内存

## Bitmap内存如何计算？

> 占用内存 = (图片宽度/inSampleSize X inTargetDensity/inDensity) X (图片高度/inSampleSize X inTargetDensity/inDensity) X 每个像素所占的内存

通俗点讲就是：`内存占用 = 宽 X高 X 每个像素所占的内存`

### inSampleSize

`inSampleSize`表示采样率，为2的整数次幂。<br />设置了inSampleSize图片的宽高对应的缩小inSampleSize的倍数，如inSampleSize=2，缩小4倍

### dpi

### Bitmap.Config

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679531375983-08b0cc7c-1fbe-4941-af86-060173ed2595.png#averageHue=%23fbfbfa&clientId=u791155b0-bd7c-4&from=paste&height=263&id=uad15c23c&originHeight=395&originWidth=627&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=12295&status=done&style=none&taskId=u2d10c90e-4bec-436c-a4a5-6252913b926&title=&width=418)

## Bitmap到底占多大内存

### 本地磁盘/网络加载图片

从本地加载或者从网络加载可以用下面的公式计算：

```
图片的长度 * 图片的宽度 * 一个像素点占用的字节数
```

### 一张图片在不同ImageView宽高内存占用？

一样

### 本地drawable资源文件加载图片

如果从本地资源文件夹加载

```
Bitmap内存占用 ≈ 像素数据总大小 = 图片宽 × 图片高× (当前设备密度dpi/图片所在文件夹对应的密度dpi）^2 × 每个像素的字节大小
```

同一张图片放进不同的文件夹，图片会被压缩。看下源码：

```cpp
if (env->GetBooleanField(options, gOptions_scaledFieldID)) {
    const int density = env->GetIntField(options, gOptions_densityFieldID);
    const int targetDensity = env->GetIntField(options, gOptions_targetDensityFieldID);
    const int screenDensity = env->GetIntField(options, gOptions_screenDensityFieldID);
    if (density != 0 && targetDensity != 0 && density != screenDensity) {
        scale = (float) targetDensity / density;
    }
}
// ...
int scaledWidth = decoded->width();
int scaledHeight = decoded->height();

if (willScale && mode != SkImageDecoder::kDecodeBounds_Mode) {
    scaledWidth = int(scaledWidth * scale + 0.5f);
    scaledHeight = int(scaledHeight * scale + 0.5f);
}
// ...
if (willScale) {
    const float sx = scaledWidth / float(decoded->width());
    const float sy = scaledHeight / float(decoded->height());
    bitmap->setConfig(decoded->getConfig(), scaledWidth, scaledHeight);
    bitmap->allocPixels(&javaAllocator, NULL);
    bitmap->eraseColor(0);
    SkPaint paint;
    paint.setFilterBitmap(true);
    SkCanvas canvas(*bitmap);
    canvas.scale(sx, sy);
    canvas.drawBitmap(*decoded, 0.0f, 0.0f, &paint);
}
```

压缩比例是由下面的公式得出:

```
scale = (float) targetDensity / density;
```

1. targetDensity：设备屏幕像素密度 dpi
2. density：图片对应的文件夹的像素密度dpi，其中density和Bitmap存放的资源目录有关，不同的资源目录有不同的值<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688142836510-f268ab56-c47c-493e-befd-19f35c310fd1.png#averageHue=%23f4f5f6&clientId=u7dbcf6b0-c087-4&from=paste&height=176&id=udcd38047&originHeight=264&originWidth=1414&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=50424&status=done&style=none&taskId=ud5ba3327-5ba7-4a42-b963-4a8f2351425&title=&width=942.6666666666666)

可以得出以下结论：

- 同一张图片放在不同的资源目录下，其分辨率会有变化。
- Bitmap的分辨率越高，其解析后的宽高越小，甚至小于原有的图片（及缩放），从而内存也响应的减少。
- 图片不放置任何资源目录时，其使用默认分辨率mdpi：160。
- 资源目录分辨率和屏幕分辨率一致时，图片尺寸不会缩放。

## Bitmap内存优化

Bitmap内存优化从下面四个方面进行优化：

1. 编码
2. 采样
3. 复用
4. 匿名共享区

### 编码 （优化单位像素占用内存）

Android 中提供以下几种编码：

1. ALPHA_8 表示8位Alpha位图,即A=8,一个像素点占用1个字节,它没有颜色,只有透明度。
2. ARGB_4444 表示16位ARGB位图，即A=4,R=4,G=4,B=4,一个像素点占4+4+4+4=16位，2个字节。
3. ARGB_8888 表示32位ARGB位图，即A=8,R=8,G=8,B=8,一个像素点占8+8+8+8=32位，4个字节。
4. RGB_565 表示16位RGB位图,即R=5,G=6,B=5,它没有透明度,一个像素点占5+6+5=16位，2个字节。

> A代表透明度；R代表红色；G代表绿色；B代表蓝色。

可以通过改变图片格式，来改变每个像素占用字节数，来改变占用的内存，看下面代码：

```java
BitmapFactory.Options options = new BitmapFactory.Options();
//不获取图片，不加载到内存中，只返回图片属性
options.inJustDecodeBounds = true;
BitmapFactory.decodeFile(photoPath, options);
//图片的宽高
int outHeight = options.outHeight;
int outWidth = options.outWidth;
Log.d("mmm", "图片宽=" + outWidth + "图片高=" + outHeight);
//图片格式压缩
options.inPreferredConfig = Bitmap.Config.RGB_565;
options.inJustDecodeBounds = false;
Bitmap bitmap = BitmapFactory.decodeFile(photoPath, options);
float bitmapsize = getBitmapsize(bitmap);
Log.d("mmm","压缩后：图片占内存大小" + bitmapsize + "MB / 宽度=" + bitmap.getWidth() + "高度=" + bitmap.getHeight());
```

输出:

```
D/mmm: 原图：图片占内存大小=45.776367MB / 宽度=4000高度=3000
D/mmm: 图片宽=4000图片高=3000
D/mmm: 压缩后：图片占内存大小22.887695MB / 宽度=4000高度=3000
```

宽高没变，我们改变了图片的格式，从`ARGB_8888` 变成了`RGB_565`，像素占用字节数减少了一般，根据log 内存也减少了一半，这种方式可行

### 采样`inSampleSize` （优化Bitmap的加载时的宽高）

通过采样，不加载bitmap真实的宽高，通过`inSampleSize`只采样实际控件需要用到的宽高

> 注意：inSampleSize=2，缩放1/4，长和宽各缩放1/2

```java
BitmapFactory.Options options = new BitmapFactory.Options();
//不获取图片，不加载到内存中，只返回图片属性
options.inJustDecodeBounds = true;
BitmapFactory.decodeFile(photoPath, options);
//图片的宽高
int outHeight = options.outHeight;
int outWidth = options.outWidth;
Log.d("mmm", "图片宽=" + outWidth + "图片高=" + outHeight);
//计算采样率
int i = utils.computeSampleSize(options, -1, 1000 * 1000);
//设置采样率，不能小于1 假如是2 则宽为之前的1/2，高为之前的1/2，一共缩小1/4 一次类推
options.inSampleSize = i;
Log.d("mmm", "采样率为=" + i);
//图片格式压缩
//options.inPreferredConfig = Bitmap.Config.RGB_565;
options.inJustDecodeBounds = false;
Bitmap bitmap = BitmapFactory.decodeFile(photoPath, options);
float bitmapsize = getBitmapsize(bitmap);
Log.d("mmm","压缩后：图片占内存大小" + bitmapsize + "MB / 宽度=" + bitmap.getWidth() + "高度=" + bitmap.getHeight());
```

输出：

```
D/mmm: 原图：图片占内存大小=45.776367MB / 宽度=4000高度=3000
D/mmm: 图片宽=4000图片高=3000
D/mmm: 采样率为=4
D/mmm: 压缩后：图片占内存大小1.4296875MB / 宽度=1000高度=750
```

这种我们根据BitmapFactory 的采样率进行压缩 设置采样率，不能小于1 假如是2 则宽为之前的1/2，高为之前的1/2，一共缩小1/4 一次类推，我们看到log ，确实起到了压缩的目的

### 复用`inBitmap`

图片复用指的是`inBitmap`这个属性。

1. 不使用inBitmap

不使用这个属性，你加载三张图片，系统会给你分配三份内存空间，用于分别储存这三张图片；如果用了inBitmap这个属性，加载三张图片，这三张图片会指向同一块内存，而不用开辟三块内存空间。
2.  inBitmap的限制

- 3.0-4.3 复用的图片大小必须相同；编码必须相同
- 4.4以上  复用的空间大于等于即可； 编码不必相同
- 不支持WebP
- 图片复用，这个属性必须设置为true；options.inMutable = true;

### 匿名共享区（Ashmem）

Android 系统为了进程间共享数据开辟的一块内存区域，由于这块区域不受应用的Head的大小限制，相当于可以绕开oom，FaceBook的Fresco首次应用到实际中。<br />限制：5.0以后就限制了匿名共享内存的使用。

## Bitmap优化手段

### LRU管理Bitmap

利用LRU开管理Bitmap，给他设置内存最大值，及时回收

### Bitmap Pool

Bitmap对象池

### 图片的压缩

1. 采样压缩，节省内存
2. 质量压缩，节省空间，不会改变图片在内存中的大

```java
bitmap.compress(Bitmap.CompressFormat.JPEG, 20, 
new FileOutputStream("sdcard/result.jpg"));
```
