---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Wednesday, January 29th 2025, 6:02:20 pm
title: PorterDuff
author: hacket
categories:
  - AndroidUI
category: 自定义View
tags: [View绘制, 自定义View]
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
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
aliases: [PorterDuff]
linter-yaml-title-alias: PorterDuff
---

# PorterDuff

## PorterDuff.Mode

### PorterDuff 的由来

`ProterDuff` 是两个人名的组合: `Tomas Proter` 和 `Tom Duff`. 他们是最早在 SIGGRAPH 上提出**图形混合**概念。

利用 _ProterBuff.Mode_ 我们可以完成任意 2D 图像测操作， 比如涂鸦画板应用中的橡皮擦效果，绘制各种自定义的进度,等等很强大的效果：

### PorterDuff.Mode 是什么

```java
// Paint
public Xfermode setXfermode(Xfermode xfermode) {
    long xfermodeNative = 0;
    if (xfermode != null)
        xfermodeNative = xfermode.native_instance;
    native_setXfermode(mNativePaint, xfermodeNative);
    mXfermode = xfermode;
    return xfermode;
}
```

`setXfermode` 用于设置图像的过渡模式，所谓过渡是指图像的饱和度、颜色值等参数的计算结果的图像表现。

在 SDK 中 Xfermode 有三个子类：~~`AvoidXfermode`~~, ~~`PixelXorXfermode`~~和**PorterDuffXfermode**，前两个类在 API 16 被遗弃了。

### PorterDuff 在 Android 绘图应用

PorterDuff.Mode 在 Paint 一共有三处 API ，它们的工作原理都一样，只是用途不同：<br />![ilerx](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ilerx.png)

## PorterDuff.Mode 使用注意事项

自定义 View 使用到 PorterDuff.Mode 时，往往不是预期效果，需注意以下 4 点:

1. 仅支持 canvas.`drawBitmap`，其他 `drawCircle`,`drawRect` 等，SRC_IN,DST_IN 等效果不确定；如果需要 `drawCircle`,`drawRect`,可采用以下方式

```java

dstBmp = Bitmap.createBitmap(300,300, Bitmap.Config.ARGB_8888);
Canvas dstCanvas=new Canvas(dstBmp);
mPaint.setColor(Color.RED);
dstCanvas.drawRect(100,0,300,200,mPaint);
// ....
canvas.drawBitmap(dstBmp , null, dstRect, mPaint);
```

2. 需要关闭硬件加速 `setLayerType(LAYER_TYPE_SOFTWARE,mPaint);`
3. 使用离屏缓冲

```java
//开始离屏缓冲
int saveCount = canvas.saveLayer(offScreenRect, mPaint, Canvas.ALL_SAVE_FLAG);
//开始绘制
canvas.drawBitmap();
...
//绘制完成，还原画布
canvas.restoreToCount(saveCount);
```

4. 离屏缓冲的区域 offScreenRect,src 的绘制区域 srcRect 及 dst 的绘制区域 dstRect，最好大小一致，位置重合，否则有些 Mode 的效果不是预期
5. 先绘制的在下层，为 DST；后绘制的在上层，为 SRC

## PorterDuff 的 Mode 枚举类型定义

PorterDuff.Mode 一共有 17 个，可以分为两类：

### Alpha 合成 (Alpha Compositing)

第一类，Alpha 合成，其实就是 「PorterDuff」 这个词所指代的算法。 「PorterDuff」 并不是一个具有实际意义的词组，而是两个人的名字（准确讲是姓）。这两个人当年共同发表了一篇论文，描述了 12 种将两个图像共同绘制的操作（即算法）。而这篇论文所论述的操作，都是关于 Alpha 通道（也就是我们通俗理解的「透明度」）的计算的，后来人们就把这类计算称为 Alpha 合成 ( Alpha Compositing ) 。

### 混合 (Blending)

第二类，混合，也就是 Photoshop 等制图软件里都有的那些混合模式（`multiply` `darken` `lighten` `screen` `overlay` 之类的）。这一类操作的是颜色本身而不是 Alpha 通道，并不属于 Alpha 合成，所以和 Porter 与 Duff 这两个人也没什么关系，不过为了使用的方便，它们同样也被 Google 加进了 PorterDuff.Mode 里。

```java
public enum Mode {
    /** [0, 0] */
    CLEAR       (0),
    /** [Sa, Sc] */
    SRC         (1),
    /** [Da, Dc] */
    DST         (2),
    /** [Sa + (1 - Sa)*Da, Rc = Sc + (1 - Sa)*Dc] */
    SRC_OVER    (3),
    /** [Sa + (1 - Sa)*Da, Rc = Dc + (1 - Da)*Sc] */
    DST_OVER    (4),
    /** [Sa * Da, Sc * Da] */
    SRC_IN      (5),
    /** [Sa * Da, Sa * Dc] */
    DST_IN      (6),
    /** [Sa * (1 - Da), Sc * (1 - Da)] */
    SRC_OUT     (7),
    /** [Da * (1 - Sa), Dc * (1 - Sa)] */
    DST_OUT     (8),
    /** [Da, Sc * Da + (1 - Sa) * Dc] */
    SRC_ATOP    (9),
    /** [Sa, Sa * Dc + Sc * (1 - Da)] */
    DST_ATOP    (10),
    /** [Sa + Da - 2 * Sa * Da, Sc * (1 - Da) + (1 - Sa) * Dc] */
    XOR         (11),
    /** [Sa + Da - Sa*Da, Sc*(1 - Da) + Dc*(1 - Sa) + min(Sc, Dc)] */
    DARKEN      (12),
    /** [Sa + Da - Sa*Da, Sc*(1 - Da) + Dc*(1 - Sa) + max(Sc, Dc)] */
    LIGHTEN     (13),
    /** [Sa * Da, Sc * Dc] */
    MULTIPLY    (14),
    /** [Sa + Da - Sa * Da, Sc + Dc - Sc * Dc] */
    SCREEN      (15),
    /** Saturate(S + D) */
    ADD         (16),
    OVERLAY     (17);
    Mode(int nativeInt) {
        this.nativeInt = nativeInt;
    }
    /**
     * @hide
     */
    public final int nativeInt;
}
```

上面代码中每种模式的注释都说明了该模式的 _alpha 通道 _ 和**颜色值**的计算方式，要理解各个模式的计算方式需要先弄明白公式中各个元素的具体含义：

```
Sa：全称为Source alpha，表示源图的Alpha通道；
Sc：全称为Source color，表示源图的颜色；
Da：全称为Destination alpha，表示目标图的Alpha通道；
Dc：全称为Destination color，表示目标图的颜色.
```

> 当 Alpha 通道的值为 1 时，图像完全可见；当 Alpha 通道值为 0 时，图像完全不可见；当 Alpha 通道的值介于 0 和 1 之间时，图像只有一部分可见。Alpha 通道描述的是图像的形状，而不是透明度。

![rsy74](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/rsy74.png)

### SRC 和 DST 区分（先 DST 后 SRC，下 DST 上 SRC）

先绘制的是目标图 DST，源图 SRC 后绘制；目标图 DST 在下面，源图 SRC 在上面

## drawBitmap 和 Canvas draw 区别

![4y2et](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/4y2et.png)<br />

CLEAR 效果两个方式得到的都一样。不一样的是：SRC、SRC_IN、DST_IN、SRC_OUT、DST_ATOP、MULTIPLY 这六个

## drawBitmap - PorterDuff 示例

### PorterDuff.Mode.CLEAR(`[0, 0]`) 所绘制不会提交到画布上

> 清除模式，即图像中所有像素点的 alpha 和颜色值均为 0

![u00is](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/u00is.png)

### PorterDuff.Mode.SRC(`Sa, Sc]`) 显示上层（源图）绘制图片

> `[Sa, Sc]`，只保留源图像的 alpha 和 color，所以绘制出来只有源图

![fujat](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/fujat.png)

### PorterDuff.Mode.DST(`[Da, Dc]`) 显示下层 (目标图) 绘制图片

![46rjp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/46rjp.png)

> [Da, Dc]，只保留了目标图像的 alpha 和 color 值，所以绘制出来的只有目标图

### PorterDuff.Mode.SRC_OVER(`[Sa + (1 - Sa)_Da, Rc = Sc + (1 - Sa)_Dc]`) 上下层都显示。上层 (源图) 居上显示

> `[Sa + (1 - Sa)_Da, Rc = Sc + (1 - Sa)_Dc]`，在目标图像上层绘制源图像

![v9593](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/v9593.png)

### PorterDuff.Mode.DST_OVER(`[Sa + (1 - Sa)*Da, Rc = Dc + (1 - Da)*Sc]`) 上下层都显示。下层居上显示

> `[Sa + (1 - Sa)_Da, Rc = Dc + (1 - Da)_Sc]`，与 SRC_OVER 相反，此模式是目标图像被绘制在源图像的上方

![8zom6](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8zom6.png)

### PorterDuff.Mode.SRC_IN 取两层绘制交集。显示上层 (源图)

> `[Sa _ Da, Sc _ Da]`，在两者相交的地方绘制源图像，并且绘制的效果会受到目标图像对应地方透明度的影响

![i76sw](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/i76sw.png)

### PorterDuff.Mode.DST_IN 取两层绘制交集。显示下层 (目标图)

> `[Sa _ Da, Sa _ Dc]`，可以和 SRC_IN 进行类比，在两者相交的地方绘制目标图像，并且绘制的效果会受到源图像对应地方透明度的影响

![9okgj](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/9okgj.png)

### PorterDuff.Mode.SRC_OUT 取上层绘制非交集部分

> `[Sa _ (1 - Da), Sc _ (1 - Da)]`，从字面上可以理解为在不相交的地方绘制源图像，相交的地方颜色透明 (1- 目标图 alpha)。那么我们来看看效果是不是这样，如下图。实际上 color 是 Sc * ( 1 - Da ) ，表示如果相交处的目标色的 alpha 是完全不透明的，这时候源图像会完全被过滤掉，否则会受到相交处目标色 alpha 影响，呈现出对应色值。

![s59rb](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/s59rb.png)

### PorterDuff.Mode.DST_OUT 取下层绘制非交集部分

> `[Da _ (1 - Sa), Dc _ (1 - Sa)]`，可以类比 SRC_OUT , 在不相交的地方绘制目标图像，相交处根据源图像 alpha 进行过滤，完全不透明处则完全过滤，完全透明则不过滤

![eoa7g](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/eoa7g.png)

### PorterDuff.Mode.SRC_ATOP 取下层非交集部分与上层交集部分

> `[Da, Sc _ Da + (1 - Sa) _ Dc]`，源图像和目标图像相交处绘制源图像，不相交的地方绘制目标图像，并且相交处的效果会受到源图像和目标图像 alpha 的影响

![fdawy](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/fdawy.png)

1. 相交处绘制源图，并且相交处 alpha 等于源图 alpha
2. 不相交处绘制目标图

### PorterDuff.Mode.DST_ATOP 取上层非交集部分与下层交集部分

> `[Sa, Sa _ Dc + Sc _ (1 - Da)]`，源图像和目标图像相交处绘制目标图像，不相交的地方绘制源图像，并且相交处的效果会受到源图像和目标图像 alpha 的影响

![en9l1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/en9l1.png)

### PorterDuff.Mode.XOR 异或：去除两图层交集部分

> `[Sa + Da - 2 _ Sa _ Da, Sc _ (1 - Da) + (1 - Sa) _ Dc]`，在不相交的地方按原样绘制源图像和目标图像，相交的地方受到对应 alpha 和颜色值影响，按公式进行计算，如果都完全不透明则相交处完全不绘制

![d0ngk](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/d0ngk.png)

### PorterDuff.Mode.DARKEN 取两图层全部区域，交集部分颜色加深

> `[Sa + Da - Sa_Da, Sc_(1 - Da) + Dc*(1 - Sa) + min(Sc, Dc)]`，该模式处理过后，会感觉效果变暗，即进行对应像素的比较，取较暗值，如果色值相同则进行混合；<br />从算法上看，alpha 值变大，色值上如果都不透明则取较暗值，非完全不透明情况下使用上面算法进行计算，受到源图和目标图对应色值和 alpha 值影响。

![8btgp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8btgp.png)

### PorterDuff.Mode.LIGHTEN 取两图层全部，点亮交集部分颜色

> `[Sa + Da - Sa_Da, Sc_(1 - Da) + Dc*(1 - Sa) + max(Sc, Dc)]`，可以和 DARKEN 对比起来看，DARKEN 的目的是变暗，LIGHTEN 的目的则是变亮，如果在均完全不透明的情况下，色值取源色值和目标色值中的较大值，否则按上面算法进行计算。

![6t74v](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/6t74v.png)

### PorterDuff.Mode.MULTIPLY 取两图层交集部分叠加后颜色

> `[Sa _ Da, Sc _ Dc]`，正片叠底，即查看每个通道中的颜色信息，并将基色与混合色复合。结果色总是较暗的颜色，任何颜色与黑色复合产生黑色，任何颜色与白色复合保持不变，当用黑色或白色以外的颜色绘画时，绘画工具绘制的连续描边产生逐渐变暗的颜色。

![jiih2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/jiih2.png)

### PorterDuff.Mode.SCREEN 取两图层全部区域，交集部分变为透明色

> `[Sa + Da - Sa _ Da, Sc + Dc - Sc _ Dc]`，滤色，滤色模式与我们所用的显示屏原理相同，所以也有版本把它翻译成屏幕；简单的说就是保留两个图层中较白的部分，较暗的部分被遮盖；当一层使用了滤色（屏幕）模式时，图层中纯黑的部分变成完全透明，纯白部分完全不透明，其他的颜色根据颜色级别产生半透明的效果。

![0os8c](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/0os8c.png)

### PorterDuff.Mode.ADD

> Saturate(S + D)，饱和度叠加

![46ete](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/46ete.png)

### PorterDuff.Mode.OVERLAY

> 像素是进行 Multiply （正片叠底）混合还是 Screen （屏幕）混合，取决于底层颜色，但底层颜色的高光与阴影部分的亮度细节会被保留

![s5g4d](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/s5g4d.png)

## Canvas（非 Bitmap） - PorterDuff 示例 (效果似乎不是预期)

<https://blog.csdn.net/qq_37077360/article/details/80346257>

## PorterDuff 应用

### src_in  和 dstIn 可以实现遮罩效果

例如圆角图片圆形图片都用了这种模式。<br />

![1ladi](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1ladi.png)

### Clear 实现镂空，挖洞，新手指引

```kotlin
class TestView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {


    private var mHollowPoint: PointF = PointF(0f, 0f)
    private var mRectF = RectF()

    private var mPaint: Paint = Paint(Paint.ANTI_ALIAS_FLAG)

    init {
        mPaint.color = Color.WHITE
        mPaint.style = Paint.Style.FILL
    }


    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        canvas?.let {

            val layerId = canvas.saveLayer(0f, 0f, width.toFloat(), height.toFloat(),
                    null, Canvas.ALL_SAVE_FLAG)
            canvas.drawColor(R.color.gray_600.toColor())

            mPaint.xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
//            canvas.drawCircle(mHollowPoint.x, mHollowPoint.y, mHollowRadius, mPaint)

            mPaint.style = Paint.Style.FILL
            mPaint.strokeWidth = 2F.dp
            mPaint.pathEffect = DashPathEffect(floatArrayOf(20f, 20f), 0F)
            mRectF.set(width / 2F - 50.dp, height / 2F - 30.dp, width / 2F + 50.dp, height / 2F + 30.dp)
            canvas.drawRoundRect(mRectF, mRectF.centerX(), mRectF.centerY() / 2, mPaint)

            mPaint.style = Paint.Style.STROKE
            mPaint.color = Color.RED
            mRectF.inset((-5F).dp, (-5F).dp)
            canvas.drawRoundRect(mRectF, mRectF.centerX(), mRectF.centerY() / 2, mPaint)
            mPaint.xfermode = null

            canvas.restoreToCount(layerId)
        }
    }
}
```

![oe2he](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/oe2he.png)

## Ref

- [x] 各个击破搞明白 PorterDuff.Mode

> 非常详细 <https://www.jianshu.com/p/d11892bbe055>

- [ ] 自定义 View 之基础篇——PorterDuff

> Bitmap 和 DrawXXX 区别 <https://blog.csdn.net/qq_37077360/article/details/80346257>

- [ ] <https://blog.csdn.net/aigestudio/article/details/41316141>

# PorterDuff 坑

## xfermode 注意

### 1. 使用离屏缓冲（Off-screen Buffer）

要想使用 setXfermode() 正常绘制，必须使用离屏缓存 (Off-screen Buffer) 把内容绘制在额外的层上，再把绘制好的内容贴回 View 中。<br />![tet7q](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/tet7q.gif)<br />

通过使用离屏缓冲，把要绘制的内容单独绘制在缓冲层， Xfermode 的使用就不会出现奇怪的结果了。使用离屏缓冲有两种方式：

1. `Canvas.saveLayer()` saveLayer() 可以做短时的离屏缓冲。使用方法很简单，在绘制代码的前后各加一行代码，在绘制之前保存，绘制之后恢复：

```java
int saved = canvas.saveLayer(null, null, Canvas.ALL_SAVE_FLAG);

canvas.drawBitmap(rectBitmap, 0, 0, paint); // 画方
paint.setXfermode(xfermode); // 设置 Xfermode
canvas.drawBitmap(circleBitmap, 0, 0, paint); // 画圆
paint.setXfermode(null); // 用完及时清除 Xfermode

canvas.restoreToCount(saved);
```

2. `View.setLayerType()` View.setLayerType() 是直接把整个 View 都绘制在离屏缓冲中。 setLayerType(LAYER_TYPE_HARDWARE) 是使用 GPU 来缓冲， `setLayerType(LAYER_TYPE_SOFTWARE)` 是直接直接用一个 Bitmap 来缓冲。

### 2. 控制好透明区域

使用 Xfermode 来绘制的内容，除了注意使用离屏缓冲，还应该注意控制它的透明区域不要太小，要让它足够覆盖到要和它结合绘制的内容，否则得到的结果很可能不是你想要的。我用图片来具体说明一下：<br />![jud4e](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/jud4e.png)

> 由于透明区域过小而覆盖不到的地方，将不会受到 Xfermode 的影响。

## PorterDuffXferMode 不能按照效果图预期的效果执行

- 官方效果图

![njp41](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/njp41.png)

### 硬件加速导致 XOR 不正常

1、直接在 canvas 上面绘制图形

```kotlin
{
  private void init(Context context) {
        srcPaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        srcPaint.setColor(ContextCompat.getColor(context, R.color.blue_300));
        dstPaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        dstPaint.setColor(ContextCompat.getColor(context, R.color.yellow_300));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 先绘制一个下层DST图像
        canvas.drawCircle(100, 100, 100, dstPaint);

        //绘制上层SRC图像
        srcPaint.setXfermode(mXfermode);
        canvas.drawRect(new Rect(100, 100, 300, 300), srcPaint);
    }
}
```

原图效果是这样的：

![8sp62](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8sp62.png)

加一个 mode 上来，XOR 效果：

<br />

![s2y4a](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/s2y4a.png)

XOR 期望效果是相交部分消失

解决：关闭硬件加速

```kotlin
setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```

正常：<br />

![pwgfn](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/pwgfn.png)

### 截取圆形头像

#### 1. 如果我们先画一个 circle（非 bitmap），然后 setXfermode 为 Src_In，再画一个 bitmap(图片的)。成功，完美

![3nlyj](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/3nlyj.png)

```kotlin
class CircleAvatarView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {


    val paint = Paint()

    init {
        paint.setColor(R.color.green_100.toColor())
    }

    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)

        // 将绘制操作保存到新的图层，因为图像合成是很昂贵的操作，将用到硬件加速，这里将图像合成的处理放到离屏缓存中进行
        val saveCount = canvas!!.saveLayer(0f, 0f, canvas.width.toFloat(), canvas.height.toFloat(), null)

        val halfW = width / 2
        val halfH = height / 2
        val r = min(halfH, halfW)
        // dst
        canvas.drawCircle(halfW.toFloat(), halfH.toFloat(), r.toFloat(), paint)

        // src
        paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN)

        val avatarBm = BitmapFactory.decodeResource(resources, R.drawable.bg)
        canvas.drawBitmap(avatarBm, 0F, 0F, paint)

        canvas.restoreToCount(saveCount)
    }
}
```

#### 2. 如果我们先画一个 bitmap(图片的)，然后 setXfermode 为 Dst_In,再画 circle。粗略学习了网上那张图之后，理论上应该也是成功的，但是却出现了问题

![k97kh](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/k97kh.png)

```kotlin
class CircleAvatarViewV2 @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {
    val paint = Paint()
    init {
        paint.setColor(R.color.green_100.toColor())
    }
    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        // 将绘制操作保存到新的图层，因为图像合成是很昂贵的操作，将用到硬件加速，这里将图像合成的处理放到离屏缓存中进行
        val saveCount = canvas!!.saveLayer(0f, 0f, canvas.width.toFloat(), canvas.height.toFloat(), null)

        // dst
        val avatarBm = BitmapFactory.decodeResource(resources, R.drawable.bg)
        canvas.drawBitmap(avatarBm, 0F, 0F, paint)

        paint.setXfermode(PorterDuffXfermode(PorterDuff.Mode.DST_IN))
        // src
        val halfW = width / 2
        val halfH = height / 2
        val r = min(halfH, halfW)
        canvas.drawCircle(halfW.toFloat(), halfH.toFloat(), r.toFloat(), paint)
        canvas.restoreToCount(saveCount)
    }
}
```

**原因：**<br />Xfermode 叠合裁剪，都是建立在不同的层级上，重新画一个 bitmap 会新开一层

1. 第一种：先画 circle 在 canvas 那层，再画 Bitmap，新开了一层，中间镶嵌 Xfermode，成功。
2. 第二种: 先画 bitmap，新开了一层，再画 circle，还是在 bitmap 那层，中间镶嵌 Xfermode,不成功。

**解决：**<br />第二种的 drawCircle 转换成 drawBitmap

```kotlin
class CircleAvatarViewV2 @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {
    val paint = Paint()
    init {
        paint.setColor(R.color.green_100.toColor())
    }
    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        // 关闭硬件加速
//        setLayerType(LAYER_TYPE_SOFTWARE, null)

        // 将绘制操作保存到新的图层，因为图像合成是很昂贵的操作，将用到硬件加速，这里将图像合成的处理放到离屏缓存中进行
        val saveCount = canvas!!.saveLayer(0f, 0f, canvas.width.toFloat(), canvas.height.toFloat(), null)

        // dst
        val avatarBm = BitmapFactory.decodeResource(resources, R.drawable.bg)
        canvas.drawBitmap(avatarBm, 0F, 0F, paint)

        // paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.DST_IN) // 写这里不行的

        // src 不成功
        val halfW = width / 2
        val halfH = height / 2
        val r = min(halfH, halfW)
//        canvas.drawCircle(halfW.toFloat(), halfH.toFloat(), r.toFloat(), paint)

        val srcBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val srcCanvas = Canvas(srcBitmap)
        srcCanvas.drawCircle(halfW.toFloat(), halfH.toFloat(), r.toFloat(), paint)

        paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.DST_IN)

        canvas.drawBitmap(srcBitmap, 0F, 0F, paint)
        canvas.restoreToCount(saveCount)

    }
}
```

## 小结

### 1. 画布及 View 背景要透明，否则效果不是预期; Canvas 不透明的效果可能也不是预期效果

### 2. 需要关闭硬件加速（开启硬件离屏缓存）

```kotlin
setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```

1. 解决 xfermode 黑色问题。
2. 效率比关闭硬件加速高 3 倍以上

### 3. 只有两个 bitmap 的时候，才可以生效；如果是将 canvas.drawCircle 转换为 Bitmap，setXfermode 放在 srcBitmap 绘制成后设置

```java
Bitmap dstBitmap = Bitmap.createBitmap(200, 200, Bitmap.Config.ARGB_8888);
Canvas dstCanvas = new Canvas(dstBitmap);
// 先绘制一个下层图像
dstCanvas.drawCircle(100, 100, 100, dstPaint);
canvas.drawBitmap(dstBitmap, 0, 0, dstPaint);
//        canvas.drawCircle(100, 100, 100, dstPaint);

// setXfermode放这里无效

Bitmap srcBitmap = Bitmap.createBitmap(200, 200, Bitmap.Config.ARGB_8888);
Canvas srcCanvas = new Canvas(srcBitmap);
srcCanvas.drawRect(0, 0, srcBitmap.getWidth(), srcBitmap.getHeight(), srcPaint);


//绘制上层图像 ，mXfermode要在画srcBitmap后设置
srcPaint.setXfermode(mXfermode);

canvas.drawBitmap(srcBitmap, 100, 100, srcPaint);
```

### 4. 两个 bitmap 大小尽量一样

### 5. 如果两个 bitmap 位置不完全一样，可能也是预期效果，只不过你看到的效果和你自己脑补的预期效果不一致

## Ref

- [ ] PorterDuffXferMode 不正确的真正原因 PorterDuffXferMode 深入试验)<br /><https://blog.csdn.net/wingichoy/article/details/50534175>
- [x] android PorterDuffXferMode 真正的效果测试集合（对比官方 demo）<br /><https://www.jianshu.com/p/3feaa8b347f2>

> 对比 drawBitmap 和 drawCircle 的区别，及 Xfermode 为何不不生效
