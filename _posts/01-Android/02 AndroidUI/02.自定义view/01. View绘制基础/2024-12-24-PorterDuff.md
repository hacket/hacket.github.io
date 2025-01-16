---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# PorterDuff

## PorterDuff.Mode

### PorterDuff的由来

ProterDuff是两个人名的组合: `Tomas Proter`和 `Tom Duff`. 他们是最早在SIGGRAPH上提出**图形混合**概念。

利用_ProterBuff.Mode_我们可以完成任意2D图像测操作， 比如涂鸦画板应用中的橡皮擦效果，绘制各种自定义的进度,等等很强大的效果：

### PorterDuff.Mode是什么

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

`setXfermode`用于设置图像的过渡模式，所谓过渡是指图像的饱和度、颜色值等参数的计算结果的图像表现。

在SDK中Xfermode有三个子类：~~AvoidXfermode~~, ~~PixelXorXfermode~~和**PorterDuffXfermode**，前两个类在API 16被遗弃了。

### PorterDuff在Android绘图应用

PorterDuff.Mode 在 Paint 一共有三处 API ，它们的工作原理都一样，只是用途不同：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234097231-1467816d-02e7-4e50-9ef0-afc0ed8bd126.png#averageHue=%23f6f6f6&clientId=ud47e8a49-c890-4&from=paste&id=u7adb629c&originHeight=174&originWidth=568&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub427a9ee-263d-410b-af7d-9656d0b8406&title=)

## PorterDuff.Mode 使用注意事项

自定义View使用到PorterDuff.Mode时，往往不是预期效果，需注意以下4点:

1. 仅支持canvas.drawBitmap，其他drawCircle,drawRect等，SRC_IN,DST_IN等效果不确定；如果需要drawCircle,drawRect,可采用以下方式

```java

dstBmp = Bitmap.createBitmap(300,300, Bitmap.Config.ARGB_8888);
Canvas dstCanvas=new Canvas(dstBmp);
mPaint.setColor(Color.RED);
dstCanvas.drawRect(100,0,300,200,mPaint);
// ....
canvas.drawBitmap(dstBmp , null, dstRect, mPaint);
```

2. 需要关闭硬件加速`setLayerType(LAYER_TYPE_SOFTWARE,mPaint);`
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

4. 离屏缓冲的区域offScreenRect,src的绘制区域srcRect及dst的绘制区域dstRect，最好大小一致，位置重合，否则有些Mode的效果不是预期
5. 先绘制的在下层，为DST；后绘制的在上层，为SRC

## PorterDuff的Mode枚举类型定义

PorterDuff.Mode 一共有 17 个，可以分为两类：

### Alpha 合成 (Alpha Compositing)

第一类，Alpha 合成，其实就是 「PorterDuff」 这个词所指代的算法。 「PorterDuff」 并不是一个具有实际意义的词组，而是两个人的名字（准确讲是姓）。这两个人当年共同发表了一篇论文，描述了 12 种将两个图像共同绘制的操作（即算法）。而这篇论文所论述的操作，都是关于 Alpha通道（也就是我们通俗理解的「透明度」）的计算的，后来人们就把这类计算称为Alpha 合成 ( Alpha Compositing ) 。

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

上面代码中每种模式的注释都说明了该模式的_alpha通道_和**颜色值**的计算方式，要理解各个模式的计算方式需要先弄明白公式中各个元素的具体含义：

```
Sa：全称为Source alpha，表示源图的Alpha通道；
Sc：全称为Source color，表示源图的颜色；
Da：全称为Destination alpha，表示目标图的Alpha通道；
Dc：全称为Destination color，表示目标图的颜色.
```

> 当Alpha通道的值为1时，图像完全可见；当Alpha通道值为0时，图像完全不可见；当Alpha通道的值介于0和1之间时，图像只有一部分可见。Alpha通道描述的是图像的形状，而不是透明度。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234135258-ec395c2b-2e73-4108-8de2-9fd5f843d552.png#averageHue=%23eed276&clientId=ud47e8a49-c890-4&from=paste&id=u090af4ed&originHeight=391&originWidth=312&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub016c4bf-ac9f-43ec-866a-a7579e95d17&title=)

### SRC和DST区分（先DST后SRC，下DST上SRC）

先绘制的是目标图DST，源图SRC后绘制；目标图DST在下面，源图SRC在上面

## drawBitmap和Canvas draw区别

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234144717-b20399e2-d1ee-4340-9faf-79d79ad3593f.png#averageHue=%23f2c852&clientId=ud47e8a49-c890-4&from=paste&id=u34760ee0&originHeight=407&originWidth=694&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u06b63ddf-0877-4866-934f-35256e3bef1&title=)<br />CLEAR效果两个方式得到的都一样。不一样的是：SRC、SRC_IN、DST_IN、SRC_OUT、DST_ATOP、MULTIPLY这六个

## drawBitmap - PorterDuff示例

### PorterDuff.Mode.CLEAR(`[0, 0]`) 所绘制不会提交到画布上

> 清除模式，即图像中所有像素点的alpha和颜色值均为0

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234165768-74ee807a-5131-4621-9383-4a4346f8521f.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u84d08611&originHeight=636&originWidth=636&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u62b96ddc-8401-45a5-b402-74bb655189a&title=)

### PorterDuff.Mode.SRC(`Sa, Sc]`) 显示上层（源图）绘制图片

> [Sa, Sc]，只保留源图像的 alpha 和 color，所以绘制出来只有源图

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234179687-fb7c21ea-2b84-4948-b278-c620e7e0cbf5.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u457357d7&originHeight=632&originWidth=636&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u63ca88cd-abde-49c9-ba0c-f0f0a954f37&title=)

### PorterDuff.Mode.DST(`[Da, Dc]`) 显示下层(目标图)绘制图片

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234186935-c32a4e08-378b-41f3-b35b-bb190246c84f.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u5aee3896&originHeight=636&originWidth=646&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u69e17a9b-2ef5-4d44-b366-7c916ebaa19&title=)

> [Da, Dc]，只保留了目标图像的alpha和color值，所以绘制出来的只有目标图

### PorterDuff.Mode.SRC_OVER([Sa + (1 - Sa)_Da, Rc = Sc + (1 - Sa)_Dc]) 上下层都显示。上层(源图)居上显示

> [Sa + (1 - Sa)_Da, Rc = Sc + (1 - Sa)_Dc]，在目标图像上层绘制源图像

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234200757-4b154464-5ff3-4a69-b213-7df75a4fe4c0.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=ue600a2f2&originHeight=636&originWidth=638&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc2edad1a-4e44-455b-b805-ee06c6d7d3f&title=)

### PorterDuff.Mode.DST_OVER(`[Sa + (1 - Sa)*Da, Rc = Dc + (1 - Da)*Sc]`) 上下层都显示。下层居上显示。

> [Sa + (1 - Sa)_Da, Rc = Dc + (1 - Da)_Sc]，与SRC_OVER相反，此模式是目标图像被绘制在源图像的上方

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234212421-b04e8b9d-2644-48dc-87d2-02aa15b2243f.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u08e00bf0&originHeight=634&originWidth=644&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5b01a419-dce0-44c1-accf-5c3f906629c&title=)

### PorterDuff.Mode.SRC_IN 取两层绘制交集。显示上层(源图)。

> [Sa _ Da, Sc _ Da]，在两者相交的地方绘制源图像，并且绘制的效果会受到目标图像对应地方透明度的影响

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234221659-ccb436d4-85a9-4e11-b2b4-066a03dff9dd.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u53f179ed&originHeight=638&originWidth=632&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3d7add74-990c-492c-9dcb-b758cb5155c&title=)

### PorterDuff.Mode.DST_IN 取两层绘制交集。显示下层(目标图)。

> [Sa _ Da, Sa _ Dc]，可以和SRC_IN 进行类比，在两者相交的地方绘制目标图像，并且绘制的效果会受到源图像对应地方透明度的影响

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234228865-b68b943b-dd67-47ab-a06c-f557fac5ffa8.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u2f6c2113&originHeight=636&originWidth=646&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ueb5e23a3-d1f1-4040-8a0d-99d69f4e63e&title=)

### PorterDuff.Mode.SRC_OUT 取上层绘制非交集部分。

> [Sa _ (1 - Da), Sc _ (1 - Da)]，从字面上可以理解为在不相交的地方绘制源图像，相交的地方颜色透明(1-目标图alpha)。那么我们来看看效果是不是这样，如下图。实际上color 是 Sc * ( 1 - Da ) ，表示如果相交处的目标色的alpha是完全不透明的，这时候源图像会完全被过滤掉，否则会受到相交处目标色 alpha 影响，呈现出对应色值。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234242463-03c28471-e87d-4cc7-84b4-b3138a80b292.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u75f8582e&originHeight=638&originWidth=636&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua83ca845-0216-4c00-bf12-3eaa979d564&title=)

### PorterDuff.Mode.DST_OUT 取下层绘制非交集部分。

> [Da _ (1 - Sa), Dc _ (1 - Sa)]，可以类比SRC_OUT , 在不相交的地方绘制目标图像，相交处根据源图像alpha进行过滤，完全不透明处则完全过滤，完全透明则不过滤

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234263103-42c5effa-62b2-4570-8f59-69197397689e.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u83cd1fcf&originHeight=638&originWidth=636&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0dea788d-d9d2-4e7e-82ef-b4a231ec33f&title=)<br />![](http://note.youdao.com/yws/res/43939/C24FB81705554F57BA29F9FAA9FED59E#id=bPiCi&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### PorterDuff.Mode.SRC_ATOP 取下层非交集部分与上层交集部分

> [Da, Sc _ Da + (1 - Sa) _ Dc]，源图像和目标图像相交处绘制源图像，不相交的地方绘制目标图像，并且相交处的效果会受到源图像和目标图像alpha的影响

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234268681-c345a817-6e20-4a1d-bc21-148b4d930dec.png#averageHue=%23f3b44b&clientId=ud47e8a49-c890-4&from=paste&id=u17ff03ef&originHeight=630&originWidth=638&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud7cb6358-9c14-44d4-ab4a-8686c3f35c0&title=)

1. 相交处绘制源图，并且相交处alpha等于源图alpha
2. 不相交处绘制目标图

### PorterDuff.Mode.DST_ATOP 取上层非交集部分与下层交集部分

> [Sa, Sa _ Dc + Sc _ (1 - Da)]，源图像和目标图像相交处绘制目标图像，不相交的地方绘制源图像，并且相交处的效果会受到源图像和目标图像alpha的影响

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234278825-032615ca-ced0-437a-af5d-80226055a212.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u52e667f7&originHeight=634&originWidth=644&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u923f98c1-6b81-4b55-b53b-9804d7a3eed&title=)

### PorterDuff.Mode.XOR 异或：去除两图层交集部分

> [Sa + Da - 2 _ Sa _ Da, Sc _ (1 - Da) + (1 - Sa) _ Dc]，在不相交的地方按原样绘制源图像和目标图像，相交的地方受到对应alpha和颜色值影响，按公式进行计算，如果都完全不透明则相交处完全不绘制

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234292301-0013e5f8-bb7c-4317-8959-7c2b3451812d.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=uaaa3dfaf&originHeight=640&originWidth=650&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u63f2fbcb-5591-4247-8c1b-ac3f31cb3fa&title=)<br />![](http://note.youdao.com/yws/res/43955/4B713EE2638443369BC7EB743FBA58D8#id=R43Ge&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### PorterDuff.Mode.DARKEN 取两图层全部区域，交集部分颜色加深

> [Sa + Da - Sa_Da, Sc_(1 - Da) + Dc*(1 - Sa) + min(Sc, Dc)]，该模式处理过后，会感觉效果变暗，即进行对应像素的比较，取较暗值，如果色值相同则进行混合；<br />从算法上看，alpha值变大，色值上如果都不透明则取较暗值，非完全不透明情况下使用上面算法进行计算，受到源图和目标图对应色值和alpha值影响。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234300152-8b33da0c-0d9e-43e4-9764-c082b88c94ec.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=ua5220bbb&originHeight=636&originWidth=636&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u89124375-868a-4c23-8c15-67d5d8b38ff&title=)<br />![](http://note.youdao.com/yws/res/43957/E3B909E9B6334EFD82E524CDDCFA8A78#id=CUTXT&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### PorterDuff.Mode.LIGHTEN 取两图层全部，点亮交集部分颜色

> [Sa + Da - Sa_Da, Sc_(1 - Da) + Dc*(1 - Sa) + max(Sc, Dc)]，可以和 DARKEN 对比起来看，DARKEN 的目的是变暗，LIGHTEN 的目的则是变亮，如果在均完全不透明的情况下，色值取源色值和目标色值中的较大值，否则按上面算法进行计算。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234305586-384c22ff-cbf5-445d-9d6f-f6c4caa07bf8.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=uf81adb40&originHeight=634&originWidth=620&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5347a88c-5e4a-4802-a456-a29cd385697&title=)<br />![](http://note.youdao.com/yws/res/43962/25EFE2A54C25480A926B8D2FF1AF4AE1#id=eEEaj&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### PorterDuff.Mode.MULTIPLY 取两图层交集部分叠加后颜色

> [Sa _ Da, Sc _ Dc]，正片叠底，即查看每个通道中的颜色信息，并将基色与混合色复合。结果色总是较暗的颜色，任何颜色与黑色复合产生黑色，任何颜色与白色复合保持不变，当用黑色或白色以外的颜色绘画时，绘画工具绘制的连续描边产生逐渐变暗的颜色。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234312343-252578a5-5c81-4648-9364-a11cbee516d9.png#averageHue=%23f2b44b&clientId=ud47e8a49-c890-4&from=paste&id=u89d21695&originHeight=638&originWidth=622&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue4e27cc3-7803-476f-b1dd-a39b24fcf7c&title=)<br />![](http://note.youdao.com/yws/res/43966/C041A8DEF10E4D73825A25657B959A4E#id=RPoRb&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### PorterDuff.Mode.SCREEN 取两图层全部区域，交集部分变为透明色

> [Sa + Da - Sa _ Da, Sc + Dc - Sc _ Dc]，滤色，滤色模式与我们所用的显示屏原理相同，所以也有版本把它翻译成屏幕；简单的说就是保留两个图层中较白的部分，较暗的部分被遮盖；当一层使用了滤色（屏幕）模式时，图层中纯黑的部分变成完全透明，纯白部分完全不透明，其他的颜色根据颜色级别产生半透明的效果。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234317878-5f5c9a99-64b5-4cfe-9a3c-87601b437d16.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u2329756e&originHeight=636&originWidth=628&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u900509a8-3ef4-44e0-819d-246f91efddd&title=)

### PorterDuff.Mode.ADD

> Saturate(S + D)，饱和度叠加

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234323119-2e599fc2-694e-4e38-8ebe-40913ceca84f.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=uc7d02c15&originHeight=632&originWidth=628&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1eace842-7b7e-42ad-b716-6f25c9449f6&title=)

### PorterDuff.Mode.OVERLAY

> 像素是进行 Multiply （正片叠底）混合还是 Screen （屏幕）混合，取决于底层颜色，但底层颜色的高光与阴影部分的亮度细节会被保留

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234336899-f03b65a5-51a2-4e04-a02e-2d1a18cd085c.png#averageHue=%23f2b44a&clientId=ud47e8a49-c890-4&from=paste&id=u1ad4b848&originHeight=704&originWidth=638&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud8874301-a0ec-4a39-b5e5-bb1ce1d86bf&title=)

## Canvas（非Bitmap） - PorterDuff示例(效果似乎不是预期)

<https://blog.csdn.net/qq_37077360/article/details/80346257>

## PorterDuff应用

### src_in  和dstIn可以实现遮罩效果

例如圆角图片 圆形图片都用了这种模式。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234378155-3383809e-068c-4a1c-b983-2975d7963010.png#clientId=ud47e8a49-c890-4&from=paste&id=u0bb38e56&originHeight=704&originWidth=638&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7bb77bdf-010e-4a61-9d3d-ab2363d4007&title=)

### Clear实现镂空，挖洞，新手指引

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

![](https://note.youdao.com/yws/res/65901/7CDFBF62E00F4ACB8D0D021525748338#id=Fl4ZF&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234468114-b0ea3b62-cc23-4ba3-8eb3-82cb19b84d67.png#averageHue=%23808080&clientId=ud47e8a49-c890-4&from=paste&height=246&id=uf7e90428&originHeight=481&originWidth=955&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=13560&status=done&style=none&taskId=u5e1b17e3-d478-4c71-a191-b98ffeaedc5&title=&width=487.66668701171875)

## Ref

- [x] 各个击破搞明白PorterDuff.Mode

> 非常详细 <https://www.jianshu.com/p/d11892bbe055>

- [ ] 自定义View之基础篇——PorterDuff

> Bitmap和DrawXXX区别 <https://blog.csdn.net/qq_37077360/article/details/80346257>

- [ ] <https://blog.csdn.net/aigestudio/article/details/41316141>

# PorterDuff坑

## xfermode注意

### 1. 使用离屏缓冲（Off-screen Buffer）

要想使用 setXfermode() 正常绘制，必须使用离屏缓存 (Off-screen Buffer) 把内容绘制在额外的层上，再把绘制好的内容贴回 View 中。<br />![](https://image.rengwuxian.com//2021/%7Bmon%7D/06/006tNc79ly1fig72kvygag30eg0b4npd.gif#id=MKYeJ&originHeight=400&originWidth=520&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />通过使用离屏缓冲，把要绘制的内容单独绘制在缓冲层， Xfermode 的使用就不会出现奇怪的结果了。使用离屏缓冲有两种方式：

1. `Canvas.saveLayer()` saveLayer() 可以做短时的离屏缓冲。使用方法很简单，在绘制代码的前后各加一行代码，在绘制之前保存，绘制之后恢复：

```java
int saved = canvas.saveLayer(null, null, Canvas.ALL_SAVE_FLAG);

canvas.drawBitmap(rectBitmap, 0, 0, paint); // 画方
paint.setXfermode(xfermode); // 设置 Xfermode
canvas.drawBitmap(circleBitmap, 0, 0, paint); // 画圆
paint.setXfermode(null); // 用完及时清除 Xfermode

canvas.restoreToCount(saved);
```

2. `View.setLayerType()` View.setLayerType() 是直接把整个 View 都绘制在离屏缓冲中。 setLayerType(LAYER_TYPE_HARDWARE) 是使用 GPU 来缓冲， `setLayerType(LAYER_TYPE_SOFTWARE)`是直接直接用一个 Bitmap 来缓冲。

### 2. 控制好透明区域

使用 Xfermode 来绘制的内容，除了注意使用离屏缓冲，还应该注意控制它的透明区域不要太小，要让它足够覆盖到要和它结合绘制的内容，否则得到的结果很可能不是你想要的。我用图片来具体说明一下：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234551137-59f02600-4e5a-4959-824b-37722240a8e2.png#averageHue=%23f3f3f3&clientId=ud47e8a49-c890-4&from=paste&height=525&id=u9339d9c9&originHeight=1191&originWidth=1027&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u15a44549-e5f5-44b8-afc3-f977bcfb7bc&title=&width=453)

> 由于透明区域过小而覆盖不到的地方，将不会受到 Xfermode 的影响。

## PorterDuffXferMode不能按照效果图预期的效果执行

- 官方效果图

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234565943-9e2c9310-6fc9-4d85-b826-b009ee05b1cc.png#averageHue=%23edd16c&clientId=ud47e8a49-c890-4&from=paste&id=u541245ff&originHeight=391&originWidth=312&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u14b13548-7f6c-439b-b708-6c61aad32c5&title=)

### 硬件加速导致XOR不正常

1、直接在canvas上面绘制图形

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

![](http://note.youdao.com/yws/res/44266/32F44418AA144E029F549C05DB87E705#id=hWraH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234578601-d756bf24-8652-4332-ba6e-2a25fa2b7cc6.png#averageHue=%23fcee89&clientId=ud47e8a49-c890-4&from=paste&id=u5df9eadf&originHeight=192&originWidth=286&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubebb0517-cfa1-4242-a1e4-864c8eddb36&title=)

加一个mode上来，XOR效果：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234583406-86a8bfa8-5dce-49ce-9701-4a194e6f5f8a.png#averageHue=%238f8c75&clientId=ud47e8a49-c890-4&from=paste&id=uab198a7a&originHeight=192&originWidth=200&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3321172b-e3b9-4c74-9a48-7b0e27f2c62&title=)<br />![](http://note.youdao.com/yws/res/44270/8A69B1E3C3F146F2BDEDB91A032BFD55#id=OBE7b&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

XOR期望效果是相交部分消失

解决：关闭硬件加速

```kotlin
setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```

正常：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234588421-cd93de06-84fc-44d8-9173-15cb8d6d27de.png#averageHue=%23fbed8a&clientId=ud47e8a49-c890-4&from=paste&id=u7fd4b4c7&originHeight=194&originWidth=224&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u034d6921-0ea1-459c-9de7-a70648c12a1&title=)<br />![](http://note.youdao.com/yws/res/44278/7E46834786A64F32AF91F255C5D022E6#id=sR1Hk&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 截取圆形头像

#### 1. 如果我们先画一个circle（非bitmap），然后setXfermode 为Src_In，再画一个bitmap(图片的)。成功，完美 。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234594680-da5010c6-aac9-4437-aedc-59550d206afc.png#averageHue=%233a5c50&clientId=ud47e8a49-c890-4&from=paste&id=u18b1bc9d&originHeight=426&originWidth=630&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4c97f974-fccd-4b17-9cd2-7f7800c838a&title=)<br />![](http://note.youdao.com/yws/res/44700/895AA01CAAAD4E659DCD27B46A08454C#id=G0k9z&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

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

#### 2. 如果我们先画一个bitmap(图片的)，然后setXfermode 为Dst_In,再画circle。粗略学习了网上那张图之后，理论上应该也是成功的，但是却出现了问题。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688234604802-49d2db7c-23ea-4bdd-a3c6-a610cc54e896.png#averageHue=%23cde4ca&clientId=ud47e8a49-c890-4&from=paste&id=ubfb716a9&originHeight=434&originWidth=628&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uf6addd6f-f76b-4606-8660-e07027d3be2&title=)

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

**原因：**<br />Xfermode 叠合裁剪，都是建立在不同的层级上，重新画一个bitmap会新开一层

1. 第一种：先画circle 在canvas那层，再画Bitmap，新开了一层，中间镶嵌Xfermode，成功。
2. 第二种: 先画bitmap，新开了一层，再画circle，还是在bitmap那层，中间镶嵌 Xfermode,不成功。

**解决：**<br />第二种的drawCircle转换成drawBitmap

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

### 1. 画布及View背景要透明，否则效果不是预期; Canvas不透明的效果可能也不是预期效果

### 2. 需要关闭硬件加速（开启硬件离屏缓存）

```kotlin
setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```

1. 解决xfermode黑色问题。
2. 效率比关闭硬件加速高3倍以上

### 3. 只有两个bitmap的时候，才可以生效；如果是将canvas.drawCircle转换为Bitmap，setXfermode放在srcBitmap绘制成后设置

```

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

### 4. 两个bitmap大小尽量一样。

### 5. 如果两个bitmap位置不完全一样，可能也是预期效果，只不过你看到的效果和你自己脑补的预期效果不一致。

## Ref

-  [ ] PorterDuffXferMode不正确的真正原因PorterDuffXferMode深入试验)<br /><https://blog.csdn.net/wingichoy/article/details/50534175>
-  [x] android PorterDuffXferMode真正的效果测试集合（对比官方demo）<br /><https://www.jianshu.com/p/3feaa8b347f2>

> 对比drawBitmap和drawCircle的区别，及Xfermode为何不不生效
