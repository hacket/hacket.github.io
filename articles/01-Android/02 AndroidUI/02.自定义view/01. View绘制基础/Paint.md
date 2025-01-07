---
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:59 晚上
title: Paint
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Paint]
linter-yaml-title-alias: Paint
---

# Paint

## Paint 基础

Paint 即画笔，在绘图过程中起到了极其重要的作用，画笔主要保存了颜色、样式等绘制信息，指定了如何绘制文本和图形，画笔对象有很多设置方法，<br />大体上可以分为两类，一类与**图形绘制**相关，一类与**文本绘制**相关。

### Paint 的内部类

#### Paint.Cap Cap 指定了描边线和路径 (Path) 的开始和结束显示效果（线帽、笔触风格）

笔触风格 ，比如：ROUND，表示是圆角的笔触。那么什么叫笔触呢，其实很简单，就像我们现实世界中的笔，如果你用圆珠笔在纸上戳一点，那么这个点一定是个圆，即便很小，它代表了笔的笔触形状，如果我们把一支铅笔笔尖削成方形的，那么画出来的线条会是一条弯曲的 " 矩形 "，这就是笔触的意思。

1. Paint.Cap.BUTT  无线帽，也是默认类型。
2. Paint.Cap.SQUARE 以线条宽度为大小，在开头和结尾分别添加半个正方形。
3. Paint.Cap.ROUND 以线条宽度为直径，在开头和结尾分别添加一个半圆。

```java
// 画笔初始设置
Paint paint = new Paint();
paint.setStyle(Paint.Style.STROKE);
paint.setAntiAlias(true);
paint.setStrokeWidth(80);
float pointX = 200;
float lineStartX = 320;
float lineStopX = 800;
float y;

// 默认
y = 200;
canvas.drawPoint(pointX, y, paint);
canvas.drawLine(lineStartX, y, lineStopX, y, paint);

// 无线帽(BUTT)
y = 400;
paint.setStrokeCap(Paint.Cap.BUTT);
canvas.drawPoint(pointX, y, paint);
canvas.drawLine(lineStartX, y, lineStopX, y, paint);

// 方形线帽(SQUARE)
y = 600;
paint.setStrokeCap(Paint.Cap.SQUARE);
canvas.drawPoint(pointX, y, paint);
canvas.drawLine(lineStartX, y, lineStopX, y, paint);

// 圆形线帽(ROUND)
y = 800;
paint.setStrokeCap(Paint.Cap.ROUND);
canvas.drawPoint(pointX, y, paint);
canvas.drawLine(lineStartX, y, lineStopX, y, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217153116-7abe2557-028d-422c-b96f-eade70d1c89d.png#averageHue=%23dcdcdc&clientId=u690cbdb2-009e-4&from=paste&height=327&id=ua9301fc6&originHeight=654&originWidth=1508&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158689&status=done&style=stroke&taskId=uc3b6e9a1-5ab4-4f89-9131-aaae9b3fd4d&title=&width=754)<br />**注意：**

1. 画笔默认是无线帽的，即 BUTT。
2. Cap 也会影响到点的绘制，在 Round 的状态下绘制的点是圆的。
3. 在绘制线条时，线帽时在线段外的，如上图红色部分所显示的内容就是线帽。
4. 上图中红色的线帽是用特殊方式展示出来的，直接绘制的情况下，线帽颜色和线段颜色相同。

#### Paint.Join Join 指定线条和曲线段在描边路径上连接的处理。 线段连接方式 (拐角类型)

画笔的连接方式 (Paint.Join) 是指两条连接起来的线段拐角显示方式。

```java
// 通过下面方式设置连接类型
paint.setStrokeJoin(Paint.Join.ROUND);
```

1. BEVEL 尖角 (默认模式)
2. MITER 平角
3. ROUND 圆角

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217182897-f67d59e6-b828-4d01-a7cd-4381d43b231a.png#averageHue=%23e1e1e1&clientId=u690cbdb2-009e-4&from=paste&height=424&id=uce3aefec&originHeight=848&originWidth=1520&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161768&status=done&style=stroke&taskId=u23d571b6-02c2-4ee1-8753-cb48833ff8b&title=&width=760)

##### 斜接模式长度限制

> Android 中线段连接方式默认是 MITER，即在拐角处延长外边缘，直到相交位置。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217205960-e713f1cb-7698-492b-9d69-2516929a6e24.png#averageHue=%23eaeaea&clientId=u690cbdb2-009e-4&from=paste&height=335&id=uddb589da&originHeight=670&originWidth=1434&originalType=binary&ratio=2&rotation=0&showTitle=false&size=175199&status=done&style=stroke&taskId=uf6a3aec2-7a6d-405c-b26d-edbad5aab9e&title=&width=717)<br />![](http://note.youdao.com/yws/res/49642/1235F21DA46E43AD91D67FB766D90DA3#id=nAtlN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)根据数学原理我们可知，如果夹角足够小，接近于零，那么交点位置就会在延长线上无限远的位置。 为了避免这种情况：**如果连接模式为 MITER(尖角)，当连接角度小于一定程度时会自动将连接模式转换为 BEVEL(平角)。**

那么多大的角度算是比较小呢？根据资料显示，这个角度大约是 `28.96°`，即 MITER(尖角) 模式下小于该角度的线段连接方式会自动转换为 BEVEL(平角) 模式。

我们可以通过下面的方法来更改默认限制：

```java
// 设置 Miter Limit，参数并不是角度
paint.setStrokeMiter(10);
```

> 参数 miter 就是对长度的限制，它可以通过这个公式计算：miter = 1 / sin ( angle / 2 ) ， angel 是两条线的形成的夹角。<br />其中 miter 的数值应该 >= 0，小于 0 的数值无效，其默认数值是 4，下表是 miter 和角度的一些对应关系。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217236330-c8ecf817-e27b-40c8-97c2-a68035429511.png#averageHue=%23fcfbfa&clientId=u690cbdb2-009e-4&from=paste&height=404&id=u07ffa4b1&originHeight=808&originWidth=1584&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47261&status=done&style=stroke&taskId=u50a99918-7647-4a75-8865-0bb87355908&title=&width=792)<br />![](http://note.youdao.com/yws/res/49653/E2BDD89C40274B88AEF3D2BFAD9C5CAD#id=f9dkT&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)关于这部分内容可以在 `SkPaint_Reference` 查看到。

#### Paint.Style 画笔模式 -Style 指定绘制的图元是否被填充，描边或两者均有 (以相同的颜色)

这里的画笔模式 (Paint.Style) 就是指绘制一个图形时，是绘制边缘轮廓，绘制内容区域还是两者都绘制，它有三种模式。

1. FILL 填充内容，也是画笔的默认模式。
2. STROKE 描边，只绘制图形轮廓。
3. 3.FILL_OR_STROKE 描边 + 填充，同时绘制轮廓和填充内容；和 FILL 的区别是，FILL_OR_STROKE 填充会大一点，多了 strokeWidth/2 的宽度

```java
// 画笔初始设置
Paint paint = new Paint();
paint.setAntiAlias(true);
paint.setStrokeWidth(50);
paint.setColor(0xFF7FC2D8);

// 填充，默认
paint.setStyle(Paint.Style.FILL);
canvas.drawCircle(500, 200, 100, paint);

// 描边
paint.setStyle(Paint.Style.STROKE);
canvas.drawCircle(500, 500, 100, paint);

// 描边 + 填充
paint.setStyle(Paint.Style.FILL_AND_STROKE);
canvas.drawCircle(500, 800, 100, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217249207-ef159a18-3f22-4dab-9b6d-3dfe3c65c62e.png#averageHue=%23f8f8f8&clientId=u690cbdb2-009e-4&from=paste&height=363&id=u5ddd2eed&originHeight=726&originWidth=1530&originalType=binary&ratio=2&rotation=0&showTitle=false&size=220370&status=done&style=stroke&taskId=u664d4d9f-10d4-465a-a080-dc8813e3dde&title=&width=765)

### Paint 类的几个最常用的方法

#### 画笔基本设置 flag

##### 1. void setAntiAlias(boolean aa) 设置抗锯齿开关

也可以设置 FLAG `ANTI_ALIAS_FLAG`  开启抗锯齿功能的标记。

##### 2. int getFlags() 获取画笔相关的一些设置 (标志)

##### 3. void setFlags(int flags) 设置画笔的标志位。并不建议使用 setFlags 方法，这是因为 setFlags 方法会覆盖之前设置的内容；如果想要调整 flag 个人建议还是使用 paint 提供的一些封装方法，如：setDither(true)，而不要自己手动去直接操作 flag

##### 4. void set(Paint src) 复制 src 的画笔设置。使用 set(Paint src) 可以复制一个画笔，但需要注意的是，如果调用了这个方法，当前画笔的所有设置都会被覆盖掉，而替换为所选画笔的设置

##### 5. void reset() 将画笔恢复为默认设置

#### 画笔颜色 setColor/setShader

除了基本颜色的设置（ setColor/ARGB(), setShader() ）以及基于原始颜色的过滤（ setColorFilter() ）之外，Paint 最后一层处理颜色的方法是 setXfermode(Xfermode xfermode) ，它处理的是「当颜色遇上 View」的问题。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217287628-7f057f42-0e2f-4bed-9a56-379f6950b0a7.png#averageHue=%23e6e6e6&clientId=u690cbdb2-009e-4&from=paste&height=179&id=ucd2a4e52&originHeight=358&originWidth=693&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79878&status=done&style=stroke&taskId=u7efbf2aa-84f2-4d54-a73a-e9445ef9cdc&title=&width=346.5)

##### 1. void setAlpha(int a) 设置透明度

##### 2. int getAlpha() 只返回颜色的 alpha 值

##### 3. int getColor() 返回画笔的颜色

##### 4. void setColor(int color) 设置颜色

##### 5. void setARGB(int a, int r, int g, int b) 设置带透明通道的颜色

##### 6. void setColorFilter(ColorFilter colorfilter) 设置颜色过滤器，可以在绘制颜色时实现不用颜色的变换效果

见 `Paint之ColorFilter` 章节

##### 7. void setShader(Shader shader) 设置图像效果，使用 Shader 可以绘制出各种渐变效果

`Shader` 这个英文单词很多人没有见过，它的中文叫做「着色器」，也是用于设置绘制颜色的。「着色器」不是 Android 独有的，它是图形领域里一个通用的概念，它和直接设置颜色的区别是，着色器设置的是一个颜色方案，或者说是一套着色规则。当设置了 Shader 之后，Paint 在绘制图形和文字时就不使用 setColor/ARGB() 设置的颜色了，而是使用 Shader 的方案中的颜色。

见 `Paint之Shader` 章节

##### 8. void setXfermode(Xfermode xfermode) 设置图形重叠时的处理方式，如合并，取交集或并集，经常用来制

作橡皮的擦除效果

#### 画笔宽度 StrokeWidth

> 画笔宽度，就是画笔的粗细

##### void setStyle(Style style) 设置绘制模式 Style

##### Paint.Style getStyle() 返回 paint 的样式，用于控制如何解释几何元素（除了 drawBitmap，它总是假定为 FILL_STYLE）

##### void setStrokeWidth(float width) 当画笔样式为 STROKE 或 FILL_OR_STROKE 时，设置笔刷的粗细度

##### float getStrokeWidth() 返回描边的宽度

```java
// 将画笔设置为描边
paint.setStyle(Paint.Style.STROKE);
// 设置线条宽度
paint.setStrokeWidth(120);
```

注意： 这条线的宽度是同时向两边进行扩展的，例如绘制一个圆时，将其宽度设置为 120 则会向外扩展 60 ，向内缩进 60，如下图所示：<br />![](http://note.youdao.com/yws/res/49558/1E3CEB263C6148628A48A431D434A475#id=Tnj3N&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217303329-b6bcde0d-8c94-4f6a-b7bb-f76522af2701.png#averageHue=%23ededec&clientId=u690cbdb2-009e-4&from=paste&height=357&id=ua81ec9a7&originHeight=714&originWidth=1386&originalType=binary&ratio=2&rotation=0&showTitle=false&size=254599&status=done&style=stroke&taskId=u8e0d1398-891c-43ea-b33e-c6de91e2c7c&title=&width=693)

> 因此如果绘制的内容比较靠近视图边缘，使用了比较粗的描边的情况下，一定要注意和边缘保持一定距离 (边距>StrokeWidth/2) 以保证内容不会被剪裁掉。

如下面这种情况，直接绘制一个矩形，如果不考虑画笔宽度，则绘制的内容就可能不正常。

> 在一个 1000x1000 大小的画布上绘制与个大小为 500x500 ，宽度为 100 的矩形。灰色部分为画布大小。红色为分割线，将画笔分为均等的四份。蓝色为矩形。

```java
paint.setStrokeWidth(100);
paint.setColor(0xFF7FC2D8);
Rect rect = new Rect(0, 0, 500, 500);
canvas.drawRect(rect, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217312115-af8dc21d-33f3-43c7-b048-82ad420be210.png#averageHue=%23c9c9c9&clientId=u690cbdb2-009e-4&from=paste&height=388&id=u23b671cd&originHeight=776&originWidth=1524&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105455&status=done&style=stroke&taskId=u8e0c30e9-c429-494c-8c6c-3365358f844&title=&width=762)<br />![](http://note.youdao.com/yws/res/49573/58F15E5F58454A5381D2400277CCE7F3#id=GaWvC&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)如果考虑到画笔宽度，需要绘制一个大小刚好填充满左上角区域的矩形，那么实际绘制的矩形就要小一些，(如果只是绘制一个矩形的话，可以将矩形向内缩小画笔宽度的一半) 这样绘制出来就是符合预期的。

```java
paint.setStrokeWidth(100);
paint.setColor(0xFF7FC2D8);
Rect rect = new Rect(0, 0, 500, 500);
rect.inset(50, 50);     // 注意这里，向内缩小半个宽度，或者rect减/加strokeWidth/2
canvas.drawRect(rect, paint)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217324615-853b61bd-5807-4aaf-96fa-e061a787f999.png#averageHue=%23c8c8c8&clientId=u690cbdb2-009e-4&from=paste&height=387&id=u6db890ed&originHeight=774&originWidth=1522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108452&status=done&style=stroke&taskId=ue0c15bdf-3fdd-4925-b07b-249fcb77b4d&title=&width=761)

> 这里只是用矩形作为例子说明，事实上，绘制任何图形，只要有描边的，就要考虑描边宽度占用的空间，需要适当的缩小图形，以保证其可以完整的显示出来。<br />注意：在实际的自定义 View 中也不要忽略 padding 占用的空间哦。

##### **hairline mode (发际线模式)**

在画笔宽度为 0 的情况下，使用 drawLine 或者使用描边模式 (STROKE) 也可以绘制出内容。只是绘制出的内容始终是 1 像素，不受画布缩放的影响。该模式被称为 `hairline mode` (发际线模式)。

> 如果你设置了画笔宽度为 1 像素，那么如果画布放大到 2 倍，1 像素会变成 2 像素。但如果是 0 像素，那么不论画布如何缩放，绘制出来的宽度依旧为 1 像素。

#### 绘制文本相关

##### void setTextSize(float textSize) 设置文字大小

#### 色彩优化

Paint 的色彩优化有两个方法： `setDither(boolean dither)` 和 `setFilterBitmap(boolean filter)` 。它们的作用都是让画面颜色变得更加「顺眼」，但原理和使用场景是不同的。<br />对应的 FLAG:

- DITHER_FLAG 在绘制时启用抖动的标志。
- FILTER_BITMAP_FLAG 绘制标志，在缩放的位图上启用双线性采样。

##### 1. void setDither(boolean dither) 设置抖动来优化色彩深度降低时的绘制效果

抖动的原理和这个类似。所谓抖动（注意，它就叫抖动，不是防抖动，也不是去抖动，有些人在翻译的时候自作主张地加了一个「防」字或者「去」字，这是不对的），是指把图像从较高色彩深度（即可用的颜色数）向较低色彩深度的区域绘制时，在图像中有意地插入噪点，通过有规律地扰乱图像来让图像对于肉眼更加真实的做法。<br />抖动可不只可以用在纯色的绘制。在实际的应用场景中，抖动更多的作用是在图像降低色彩深度绘制时，避免出现大片的色带与色块<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217365297-2c915f07-fd82-4cd3-8b60-895b4f1efdb8.png#averageHue=%23726d62&clientId=u690cbdb2-009e-4&from=paste&height=192&id=u45be7f9a&originHeight=281&originWidth=771&originalType=binary&ratio=2&rotation=0&showTitle=false&size=250411&status=done&style=stroke&taskId=u53e6db36-8073-43da-8cc5-ff91d6daef5&title=&width=525.5)

> setDither(dither) 已经没有当年那么实用了，因为现在的 Android 版本的绘制，默认的色彩深度已经是 32 位的 ARGB_8888 ，效果已经足够清晰了。只有当你向自建的 Bitmap 中绘制，并且选择 16 位色的 ARGB_4444 或者 RGB_565 的时候，开启它才会有比较明显的效果。

##### 2. setFilterBitmap(boolean filter) 设置是否使用双线性过滤来绘制 Bitmap (设置双线性过滤来优化 Bitmap 放大绘制的效果)

图像在放大绘制的时候，默认使用的是最近邻插值过滤，这种算法简单，但会出现马赛克现象；而如果开启了双线性过滤，就可以让结果图像显得更加平滑。<br />![](http://note.youdao.com/yws/res/50661/F459E12153654D709153CE9C7B72AD37#id=vyHur&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217383264-b7eb669b-6cdb-4c51-a11a-430b3ba53b3e.png#averageHue=%236d5a34&clientId=u690cbdb2-009e-4&from=paste&height=239&id=ufc6e7678&originHeight=360&originWidth=695&originalType=binary&ratio=2&rotation=0&showTitle=false&size=206598&status=done&style=stroke&taskId=u03c85315-0fde-49ea-bf57-6eb0e34e1b5&title=&width=460.5)

#### 阴影 setShadowLayer

- 构造方法<br />setShadowLayer(float radius, float dx, float dy, int shadowColor)
- 参数<br />radius 是阴影的模糊范围； dx dy 是阴影的 x 和 y 轴的偏移量； shadowColor 是阴影的颜色。

如果要清除阴影层，使用 `clearShadowLayer()` 。

```java
paint.setShadowLayer(10, 0, 0, Color.RED);
// ...
canvas.drawText(text, 80, 300, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217400021-f373ce8f-7af1-4a82-91d0-cd43800d6c12.png#averageHue=%23f8faf9&clientId=u690cbdb2-009e-4&from=paste&height=85&id=u6c2048ff&originHeight=106&originWidth=463&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50354&status=done&style=stroke&taskId=u340b762d-940f-4f4a-a7b8-9a4dbc761f6&title=&width=370.5)

- 注意：
  1. 在硬件加速开启的情况下， setShadowLayer() 只支持文字的绘制，文字之外的绘制必须关闭硬件加速才能正常绘制阴影。
  2. 如果 shadowColor 是半透明的，阴影的透明度就使用 shadowColor 自己的透明度；而如果 shadowColor 是不透明的，阴影的透明度就使用 paint 的透明度。

#### MaskFilter

- void setMaskFilter(MaskFilter maskfilter) 设置 MaskFilter，可以用不同的 MaskFilter 实现滤镜的效果，如滤化，立体等

见 `Paint之MaskFilter` 章节

#### PathEffect setPathEffect

- PathEffect getPathEffect() 获取画笔的 patheffect 对象。
- void setPathEffect(PathEffect effect) 设置 Path 效果。

见 `Paint之PathEffect` 章节

#### 线条连接

- Paint.Cap getStrokeCap() 返回 paint 的 Cap，控制如何处理描边线和路径的开始和结束。
- void setStrokeCap(Paint.Cap cap) 当画笔样式为 STROKE 或 FILL_OR_STROKE 时，设置笔刷的图形样式，如圆形样式 Cap.ROUND,或方形样式 Cap.SQUARE
- Paint.Join getStrokeJoin() 返回画笔的笔触连接类型。
- void setStrokeJoin(Paint.Join join) 设置绘制时各图形的结合方式，如平滑效果等<br />这个方法用于设置接合处的形态，就像你用代码画了一条线，但是这条线其实是由无数条小线拼接成的，拼接处的形状就由该方法指定。可选参数是：BEVEL，MITER，ROUND。
- float getStrokeMiter() 返回画笔的笔触斜接值。用于在连接角度锐利时控制斜接连接的行为。
- void setStrokeMiter(float miter) 这个方法是对于 setStrokeJoin() 的一个补充，它用于设置 MITER 型拐角的延长线的最大值。所谓「延长线的最大值」

#### 获取绘制的 Path

这组方法做的事是，根据 paint 的设置，计算出绘制 Path 或文字时的**实际 Path**。

> 所谓实际 Path ，指的就是 drawPath() 的绘制内容的轮廓，要算上 `线条宽度` 和设置的 `PathEffect`。

##### 1. boolean getFillPath(Path src, Path dst) 获取这个实际 Path。方法的参数里，src 是原 Path ，而 dst 就是实际 Path 的保存位置。 getFillPath(src, dst) 会计算出实际 Path，然后把结果保存在 dst 里

默认情况下（线条宽度为 0、没有 PathEffect），原 Path 和实际 Path 是一样的；而在线条宽度不为 0 （并且模式为 STROKE 模式或 FLL_AND_STROKE ），或者设置了 PathEffect 的时候，实际 Path 就和原 Path 不一样了：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217436747-62091421-7e55-45c5-88f6-71cf19fc28e2.png#averageHue=%23e6e6e6&clientId=u690cbdb2-009e-4&from=paste&height=403&id=uca218d8f&originHeight=806&originWidth=1004&originalType=binary&ratio=2&rotation=0&showTitle=false&size=213307&status=done&style=stroke&taskId=u92783a1c-9e0c-417d-a41a-1d8b5686226&title=&width=502)

##### 2. getTextPath(String text, int start, int end, float x, float y, Path path) / getTextPath(char[] text, int index, int count, float x, float y, Path path)

「文字的 Path」。文字的绘制，虽然是使用 Canvas.drawText() 方法，但其实在下层，文字信息全是被转化成图形，对图形进行绘制的。 getTextPath() 方法，获取的就是目标文字所对应的 Path 。这个就是所谓「文字的 Path」。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217448972-0f0ee48c-a3ec-4431-9c10-50bd836d0684.png#averageHue=%23dfdfdf&clientId=u690cbdb2-009e-4&from=paste&height=101&id=u0609f422&originHeight=202&originWidth=648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51239&status=done&style=stroke&taskId=ue5c0a184-75fd-46d5-9d5c-09f9c5ba266&title=&width=324)<br />它们主要是用于图形和文字的装饰效果的位置计算，比如自定义的下划线效果

#### 初始化

##### 1. reset()

重置 Paint 的所有属性为默认值。相当于重新 new 一个，不过性能当然高一些啦。

##### 2. set(Paint src)

把 src 的所有属性全部复制过来。相当于调用 src 所有的 get 方法，然后调用这个 Paint 的对应的 set 方法来设置它们。

##### 3.setFlags(int flags)

批量设置 flags。相当于依次调用它们的 set 方法

```java
paint.setFlags(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG);
// 等价
paint.setAntiAlias(true);
paint.setDither(true);
```

#### 其他设置

- void setHinting(int mode) 设置画笔的隐藏模式。可以是 `HINTING_OFF` or `HINTING_ON` 之一。
- void setSubpixelText (boolean  subpixelText )  设置自像素。如果该项为 true，将有助于文本在 LCD 屏幕上的显示效果。

## Paint 之 MaskFilter

为之后的绘制设置 MaskFilter 。setShadowLayer() 是设置的在绘制层下方的附加效果；而这个 MaskFilter 和它相反，设置的是在绘制层上方的附加效果。<br />到现在已经有两个 setXxxFilter(filter) 了。setColorFilter(filter) 是对每个像素的颜色进行过滤；而这里的 setMaskFilter(filter) 则是基于整个画面来进行过滤。<br />MaskFilter 有两种： `BlurMaskFilter` 和 `EmbossMaskFilter`。

### BlurMashFilter

- 构造方法

```
BlurMaskFilter(float radius, Blur style)
```

- 参数
  1. radius 参数是模糊的范围
  2. style 是模糊的类型。一共有四种

#### BlurMaskFilter.Blur

1. NORMAL: 内外都模糊绘制
2. SOLID: 内部正常绘制，外部模糊
3. INNER: 内部模糊，外部不绘制
4. OUTER: 内部不绘制，外部模糊

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217678129-edfe7b48-ad9f-4345-9fdd-6349eeed1229.png#averageHue=%23b5b5b1&clientId=u690cbdb2-009e-4&from=paste&height=402&id=u8cd18854&originHeight=803&originWidth=776&originalType=binary&ratio=2&rotation=0&showTitle=false&size=353284&status=done&style=stroke&taskId=u0eb78a5a-2a09-42b4-883e-f458ed0be0b&title=&width=388)

### EmbossMaskFilter

浮雕效果的 MaskFilter。

- 构造函数

```
EmbossMaskFilter(float[] direction, float ambient, float specular, float blurRadius)
```

- 参数

```
irection 是一个 3 个元素的数组，指定了光源的方向； 
ambient 是环境光的强度，数值范围是 0 到 1； 
specular 是炫光的系数； 
blurRadius 是应用光线的范围。
```

```java
paint.setMaskFilter(new EmbossMaskFilter(new float[]{0, 1, 1}, 0.2f, 8, 10));
// ...
canvas.drawBitmap(bitmap, 100, 100, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217701178-cf4284fe-06d3-4218-9968-b3d364dc2ab9.png#averageHue=%238b8882&clientId=u690cbdb2-009e-4&from=paste&height=170&id=u2801e0d3&originHeight=340&originWidth=745&originalType=binary&ratio=2&rotation=0&showTitle=false&size=180684&status=done&style=stroke&taskId=uc7a3b271-08e9-4835-9429-0e2ef61732d&title=&width=372.5)

## Paint 之 PathEffect

PathEffect 在绘制之前修改几何路径，它可以实现划线，自定义填充效果和自定义笔触效果。PathEffect 虽然名字看起来是和 Path 相关的，但实际上它的效果可以作用于 Canvas 的各种绘制，例如 `drawLine`， `drawRect`，`drawPath` 等。

> 绘制路径时，pathPaint.setStyle(Paint.Style.STROKE) 画笔的风格要空心，否则，后果画出的不是线，而是一个不规则的区域

使用 PathEffect 来给图形的轮廓设置效果。对 Canvas 所有的图形绘制有效，也就是 drawLine() drawCircle() drawPath() 这些方法

**注意：** PathEffect 在部分情况下不支持硬件加速，需要关闭硬件加速才能正常使用：

> Canvas.drawLine() 和 Canvas.drawLines() 方法画直线时，setPathEffect() 是不支持硬件加速的；<br />PathDashPathEffect 对硬件加速的支持也有问题，所以当使用 PathDashPathEffect 的时候，最好也把硬件加速关了

在 Android 中有 6 种 PathEffect，4 种基础效果，2 种叠加效果。

| PathEffect         | 简介                                     |
| ------------------ | -------------------------------------- |
| CornerPathEffect   | 圆角效果，将尖角替换为圆角。（STROKE 和 FILL）            |
| DashPathEffect     | 虚线效果，用于各种虚线效果。（STROKE 和 FILL_AND_STROKE） |
| PathDashPathEffect | Path 虚线效果，虚线中的间隔使用 Path 代替。            |
| DiscretePathEffect | 让路径分段随机偏移。                             |
| SumPathEffect      | 两个 PathEffect 效果组合，同时绘制两种效果。           |
| ComposePathEffect  | 两个 PathEffect 效果叠加，先使用效果 1，之后使用效果 2。     |

> 通过 setPathEffect 来设置效果 paint.setPathEffect(effect);

### CornerPathEffect 把所有拐角变成圆角。（STROKE 和 FILL）

CornerPathEffect 可以将线段之间的任何锐角替换为指定半径的圆角 (适用于 STROKE 或 FILL 样式)。

```java
// radius 为圆角半径大小，半径越大，path 越平滑。
CornerPathEffect(radius);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217828482-42cc0997-76ce-418f-8128-1ada14902cb0.png#averageHue=%23f9f9f9&clientId=u690cbdb2-009e-4&from=paste&height=263&id=ubfa4399e&originHeight=526&originWidth=1376&originalType=binary&ratio=2&rotation=0&showTitle=false&size=132648&status=done&style=stroke&taskId=u657bdb1f-ea3a-4139-8fc8-2f330e2e142&title=&width=688)

1. 使用 CornerPathEffect，可以实现圆角矩形效果

```java
RectF rect = new RectF(0, 0, 600, 600);
float corner = 300;

// 使用 CornerPathEffect 实现类圆角效果
canvas.translate((1080 - 600) / 2, (1920 / 2 - 600) / 2);
paint.setPathEffect(new CornerPathEffect(corner));
canvas.drawRect(rect, paint);

// 直接绘制圆角矩形
canvas.translate(0, 1920 / 2);
paint.setPathEffect(null);
canvas.drawRoundRect(rect, corner, corner, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217849469-3a3b7f1c-1008-474d-98a9-5f48eb7a33d7.png#averageHue=%23f7f7f7&clientId=u690cbdb2-009e-4&from=paste&height=356&id=ubc4e0f32&originHeight=712&originWidth=1352&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112254&status=done&style=stroke&taskId=uc9ec5693-2c95-4761-9e1c-a8b70e0da22&title=&width=676)

> 左侧是使用 CornerPathEffect 将矩形的边角变圆润的效果，右侧则是直接绘制圆角矩形的效果。我们知道，在绘制圆角矩形时，如果圆角足够大时，那么绘制出来就会是圆或者椭圆。但是使用 CornerPathEffect 时，不论圆角有多大，它也不会变成圆形或者椭圆。

2. CornerPathEffect 也可以让手绘效果更加圆润

> 一些简单的绘图场景或者签名场景中，一般使用 Path 来保存用户的手指轨迹，通过连续的 lineTo 来记录用户手指划过的路径，但是直接的 LineTo 会让转角看起来非常生硬，而使用 CornerPathEffect 效果则可以快速的让轨迹圆润起来。

![](https://www.gcssloop.com/assets/customview/paint/paint-corcer-effect-2.gif#id=YXCvi&originHeight=480&originWidth=847&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

```java
public class CornerPathEffectTestView extends View {
    Paint mPaint = new Paint();
    PathEffect mPathEffect = new CornerPathEffect(200);
    Path mPath = new Path();

    public CornerPathEffectTestView(Context context) {
        this(context, null);
    }

    public CornerPathEffectTestView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        mPaint.setStrokeWidth(20);
        mPaint.setStyle(Paint.Style.STROKE);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                mPath.reset();
                mPath.moveTo(event.getX(), event.getY());
                break;
            case MotionEvent.ACTION_MOVE:
                mPath.lineTo(event.getX(), event.getY());
                break;
            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP:
                break;
        }
        postInvalidate();
        return true;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 绘制原始路径
        canvas.save();
        mPaint.setColor(Color.BLACK);
        mPaint.setPathEffect(null);
        canvas.drawPath(mPath, mPaint);
        canvas.restore();

        // 绘制带有效果的路径
        canvas.save();
        canvas.translate(0, canvas.getHeight() / 2);
        mPaint.setColor(Color.RED);
        mPaint.setPathEffect(mPathEffect);
        canvas.drawPath(mPath, mPaint);
        canvas.restore();
    }
}
```

### DashPathEffect 虚线（STROKE 和 FILL_AND_STROKE）

DashPathEffect 用于实现虚线效果 (适用于 STROKE 或 FILL_AND_STROKE 样式)

```
public DashPathEffect(float[] intervals, float phase)
```

- intervals 是一个 float 数组，且其长度必须是偶数且>=2，控制实线和实线之后空白线的宽度
- phase 参数指定了绘制的虚线相对了起始地址（Path 起点）的取余偏移（对路径总长度）。将 View 向 " 左 " 偏移 phase

```
new DashPathEffect(new float[] { 8, 10, 8, 10}, 0);  // 指定了绘制8px的实线,再绘制10px的透明,再绘制8px的实线,再绘制10px的透明,依次重复来绘制达到path对象的长度。

new DashPathEffect(new float[] { 8, 10, 8, 10}, 0); // 这时偏移为0，先绘制实线，再绘制透明。

new DashPathEffect(new float[] { 8, 10, 8, 10}, 8); // 这时偏移为8，先绘制了透明，再绘制了实线.(实线被偏移过去了)
```

```java
DashPathEffect dashPathEffect1 = new DashPathEffect(new float[]{60, 60}, 0);
DashPathEffect dashPathEffect2 = new DashPathEffect(new float[]{60, 60}, 20);
DashPathEffect dashPathEffect3 = new DashPathEffect(new float[]{60, 60}, 40);
DashPathEffect dashPathEffect4 = new DashPathEffect(new float[]{60, 60}, 60);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217929252-8664560e-5a31-4044-beaa-22c459e7e3d4.png#averageHue=%23fbfbfb&clientId=u690cbdb2-009e-4&from=paste&height=381&id=u681902b8&originHeight=762&originWidth=1404&originalType=binary&ratio=2&rotation=0&showTitle=false&size=149136&status=done&style=stroke&taskId=uaa7269ba-8f40-460b-bde2-b54fba52f02&title=&width=702)

### PathDashPathEffect （STROKE 或 FILL_AND_STROKE 样式)）

这个也是实现类似虚线效果，只不过这个虚线中显示的部分可以指定为一个 Path(适用于 STROKE 或 FILL_AND_STROKE 样式)。

```
// shape: Path 图形，参数中的 shape 只能是 FILL 模式，即便画笔是 STROKE 样式，shape 也只会是 FILL。
// advance: 图形占据长度
// phase: 相位差
// style: 转角样式
PathDashPathEffect(Path shape, float advance, float phase, PathDashPathEffect.Style style);
```

示例：

```java
// 画笔初始设置
Paint paint = new Paint();
paint.setStyle(Paint.Style.STROKE);
paint.setAntiAlias(true);

RectF rectF = new RectF(0, 0, 50, 50);

// 方形
Path rectPath = new Path();
rectPath.addRect(rectF, Path.Direction.CW);

// 圆形 椭圆
Path ovalPath = new Path();
ovalPath.addOval(rectF, Path.Direction.CW);

// 子弹形状
Path bulletPath = new Path();
bulletPath.lineTo(rectF.centerX(), rectF.top);
bulletPath.addArc(rectF, -90, 180);
bulletPath.lineTo(rectF.left, rectF.bottom);
bulletPath.lineTo(rectF.left, rectF.top);

// 星星形状
PathMeasure pathMeasure = new PathMeasure(ovalPath, false);
float length = pathMeasure.getLength();
float split = length / 5;
float[] starPos = new float[10];
float[] pos = new float[2];
float[] tan = new float[2];
for (int i = 0; i < 5; i++) {
    pathMeasure.getPosTan(split * i, pos, tan);
    starPos[i * 2 + 0] = pos[0];
    starPos[i * 2 + 1] = pos[1];
}
Path starPath = new Path();
starPath.moveTo(starPos[0], starPos[1]);
starPath.lineTo(starPos[4], starPos[5]);
starPath.lineTo(starPos[8], starPos[9]);
starPath.lineTo(starPos[2], starPos[3]);
starPath.lineTo(starPos[6], starPos[7]);
starPath.lineTo(starPos[0], starPos[1]);
Matrix matrix = new Matrix();
matrix.postRotate(-90, rectF.centerX(), rectF.centerY());
starPath.transform(matrix);


canvas.translate(360, 100);
// 绘制分割线 - 方形
canvas.translate(0, 100);
paint.setPathEffect(new PathDashPathEffect(rectPath, rectF.width() * 1.5f, 0, PathDashPathEffect.Style.TRANSLATE));
canvas.drawLine(0, 0, 1200, 0, paint);

// 绘制分割线 - 圆形
canvas.translate(0, 100);
paint.setPathEffect(new PathDashPathEffect(ovalPath, rectF.width() * 1.5f, 0, PathDashPathEffect.Style.TRANSLATE));
canvas.drawLine(0, 0, 1200, 0, paint);

// 绘制分割线 - 子弹型
canvas.translate(0, 100);
paint.setPathEffect(new PathDashPathEffect(bulletPath, rectF.width() * 1.5f, 0, PathDashPathEffect.Style.TRANSLATE));
canvas.drawLine(0, 0, 1200, 0, paint);

// 绘制分割线 - 星型
canvas.translate(0, 100);
paint.setPathEffect(new PathDashPathEffect(starPath, rectF.width() * 1.5f, 0, PathDashPathEffect.Style.TRANSLATE));
canvas.drawLine(0, 0, 1200, 0, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217963558-71d9c107-6f60-4200-bfe7-fb56f883edaa.png#averageHue=%23e8e8e8&clientId=u690cbdb2-009e-4&from=paste&height=393&id=u79e8a4c4&originHeight=786&originWidth=1476&originalType=binary&ratio=2&rotation=0&showTitle=false&size=169348&status=done&style=stroke&taskId=ufe033b22-b751-4ff4-b895-9baee5ab478&title=&width=738)<br />![](http://note.youdao.com/yws/res/49854/46EE26DE45FD40CFBC8E6C15E5D689B3#id=rKogi&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

- PathDashPathEffect.Style，这个参数用于处理 Path 图形在转角处的样式。

1. TRANSLATE 在转角处对图形平移
2. ROTATE 在转角处对图形旋转。
3. MORPH 在转角处对图形变形。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217968573-19cb12cd-37c1-4742-9946-72589bd70d37.png#averageHue=%23e8e8e8&clientId=u690cbdb2-009e-4&from=paste&height=387&id=uc1658513&originHeight=774&originWidth=1378&originalType=binary&ratio=2&rotation=0&showTitle=false&size=160668&status=done&style=stroke&taskId=u061e6cda-a816-45c1-be6b-a39ef157491&title=&width=689)<br />![](http://note.youdao.com/yws/res/49868/62C878FF4E234FC9BC14B113671035D0#id=cGJM1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### DiscretePathEffect 把线条进行随机的偏离，让轮廓变得乱七八糟。乱七八糟的方式和程度由参数决定

```
// segmentLength: 分段长度
// deviation: 偏移距离
DiscretePathEffect(float segmentLength, float deviation);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217977848-e1038149-19a9-41f9-854c-9e4c826868bd.png#averageHue=%23f7f7f7&clientId=u690cbdb2-009e-4&from=paste&height=354&id=u448bb1a5&originHeight=708&originWidth=1540&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127212&status=done&style=stroke&taskId=udf7cd970-15ff-4ca5-8da3-0d26ebcfcfc&title=&width=770)<br />![](http://note.youdao.com/yws/res/49875/CF40DA35C6B1441480F5EEA69A670B56#id=fBCLn&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

DiscretePathEffect 具体的做法是，把绘制改为使用定长的线段来拼接，并且在拼接的时候对路径进行随机偏离。它的构造方法 DiscretePathEffect(float segmentLength, float deviation) 的两个参数中， segmentLength 是用来拼接的每个线段的长度， deviation 是偏离量。这两个值设置得不一样，显示效果也会不一样

### SumPathEffect

SumPathEffect 用于合并两种效果，它相当于两种效果都绘制一遍。

```java
// 两种效果相加
SumPathEffect(PathEffect first, PathEffect second);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217984754-502386d3-5334-4a5e-8550-ac04ffc648b8.png#averageHue=%23f7f7f7&clientId=u690cbdb2-009e-4&from=paste&height=248&id=u45815ca5&originHeight=704&originWidth=1370&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75796&status=done&style=stroke&taskId=ua4e87d0c-2edb-4018-ae4a-21614ff79e1&title=&width=482)

### ComposePathEffect

ComposePathEffect 也是合并两种效果，只不过先应用一种效果后，再次叠加另一种效果，因此交换参数最终得到的效果是不同的。

```java
// 构造一个 PathEffect, 其效果是首先应用 innerpe 再应用 outerpe (如: outer(inner(path)))。
ComposePathEffect(PathEffect outerpe, PathEffect innerpe);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688217991443-885062e7-85b8-457b-bf52-799c5ac8c63e.png#averageHue=%23f9f9f9&clientId=u690cbdb2-009e-4&from=paste&height=314&id=u890771ef&originHeight=758&originWidth=1418&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78427&status=done&style=stroke&taskId=u9f73b9f8-bb37-4ac8-afe8-bb381e21c95&title=&width=587)

## Paint 之 ColorFilter

ColorFilter 这个类，它的名字已经足够解释它的作用：为绘制设置颜色过滤。颜色过滤的意思，就是为绘制的内容设置一个统一的过滤策略，然后 Canvas.drawXXX() 方法会对每个像素都进行过滤后再绘制出来。

### ColorFilter

#### ColorMatrix

在 Android 中图片是以 RGBA 像素点的形式加载到内存中的，修改这些像素信息需要一个叫做 `ColorMatrix` 类的支持，其定义了一个 `4x5` 的 float[] 类型的矩阵：

```java
ColorMatrix colorMatrix = new ColorMatrix(new float[]{
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
});
```

其中，第一行表示的 R（红色）的向量，第二行表示的 G（绿色）的向量，第三行表示的 B（蓝色）的向量，最后一行表示 A（透明度）的向量，这一顺序必须要正确不能混淆

这个矩阵不同的位置表示的 RGBA 值，其范围在 0.0F 至 2.0F 之间，1 为保持原图的 RGB 值。

每一行的第五列数字表示偏移值，何为偏移值？顾名思义当我们想让颜色更倾向于红色的时候就增大 R 向量中的偏移值，想让颜色更倾向于蓝色的时候就增大 B 向量中的偏移值，这是最最朴素的理解，但是事实上色彩偏移的概念是基于白平衡来理解的，什么是白平衡呢？说得简单点就是白色是什么颜色！如果大家是个单反爱好者或者会些 PS 就会很容易理解这个概念，在单反的设置参数中有个色彩偏移，其定义的就是白平衡的色彩偏移值，就是当你去拍一张照片的时候白色是什么颜色的，在正常情况下白色是（255, 255, 255, 255）但是现实世界中我们是无法找到这样的纯白物体的，所以在我们用单反拍照之前就会拿一个我们认为是白色的物体让相机记录这个物体的颜色作为白色，然后拍摄时整张照片的颜色都会依据这个定义的白色来偏移！而这个我们定义的 " 白色 "（比如：255, 253, 251, 247）和纯白（255, 255, 255, 255）之间的偏移值（0, 2, 4, 8）我们称之为白平衡的色彩偏移。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218156624-757ad169-5811-427c-8aee-1d0a25324b66.png#averageHue=%23faf7f4&clientId=u690cbdb2-009e-4&from=paste&height=148&id=u5c428b5b&originHeight=173&originWidth=436&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61602&status=done&style=stroke&taskId=uce6cda64-da88-4ec4-a308-3147b5d18e7&title=&width=374)<br />矩阵 ColorMatrix 的一行乘以矩阵 MyColor 的一列作为矩阵 Result 的一行，这里 MyColor 的 RGBA 值我们需要转换为 [0, 1]。那么我们依据此公式来计算下我们得到的 RGBA 值是否跟我们计算得出来的圆的 RGBA 值一样：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218189086-9796aa76-af5a-4024-812e-38def76360fc.png#averageHue=%23faf7f4&clientId=u690cbdb2-009e-4&from=paste&height=126&id=u57561d38&originHeight=173&originWidth=522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63483&status=done&style=stroke&taskId=u04c8ff6e-bea3-4edc-a41f-b74668ae8ee&title=&width=380)![](http://note.youdao.com/yws/res/50581/66809C04677647ECBCAD8AC39F08AD6F#id=mmTOd&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### 系统自带的 ColorFilter

在 Paint 里设置 ColorFilter ，使用的是 `Paint.setColorFilter(ColorFilter filter)` 方法。 ColorFilter 并不直接使用，而是使用它的子类。它共有 4 个子类：`LightingColorFilter` `PorterDuffColorFilter` `ColorMatrixColorFilter` 和 `BlendModeColorFilter`。

#### LightingColorFilter

LightingColorFilter 是用来模拟简单的光照效果的。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218239891-bd8c87bd-5209-4a73-8d2d-00cbdeb2ed99.png#averageHue=%23efefef&clientId=u690cbdb2-009e-4&from=paste&height=287&id=uabbcbf8d&originHeight=574&originWidth=940&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29424&status=done&style=stroke&taskId=u246d0d5e-6028-4026-8cc8-15396777b3a&title=&width=470)

构造方法：

```java
LightingColorFilter(@ColorInt int mul, @ColorInt int add)
```

参数里的 mul 和 add 都是和颜色值格式相同的 int 值，其中 mul 用来和目标像素相乘，add 用来和目标像素相加：

```
R' = R * mul.R / 0xFF  + add.R
G' = G * mul.G / 0xFF + add.G
B' = B * mul.B / 0xFF + add.B
```

保持原样的 `LightingColorFilter`，mul 为 0xffffff，add 为 0x000000（也就是 0），那么对于一个像素，它的计算过程就是：

```
R' = R * 0xff / 0xff + 0x0 = R // R' = R
G' = G * 0xff / 0xff + 0x0 = G // G' = G
B' = B * 0xff / 0xff + 0x0 = B // B' = B
```

如果你想去掉原像素中的红色，可以把它的 mul 改为 0x00ffff （红色部分为 0 ） ，那么它的计算过程就是：

```
R' = R * 0x0 / 0xff + 0x0 = 0 // 红色被移除
G' = G * 0xff / 0xff + 0x0 = G
B' = B * 0xff / 0xff + 0x0 = B
```

具体效果是这样的：

```java
ColorFilter lightingColorFilter = new LightingColorFilter(0x00ffff, 0x000000);
paint.setColorFilter(lightingColorFilter);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218269080-f45ebf6c-8564-4790-b229-9cb63f8cfd53.png#averageHue=%23d7d9d6&clientId=u690cbdb2-009e-4&from=paste&height=90&id=u58d5f727&originHeight=159&originWidth=325&originalType=binary&ratio=2&rotation=0&showTitle=false&size=40630&status=done&style=stroke&taskId=u9fa45262-040a-40e2-a583-ed079509e8e&title=&width=183.5)<br />![](http://note.youdao.com/yws/res/50599/049CFE0D594340A384ECAF8BF0918DD0#id=Zo7xR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)你想让它的绿色更亮一些，就可以把它的 add 改为 0x003000 （绿色部分为 0x30 ），那么它的计算过程就是：

```
R' = R * 0xff / 0xff + 0x0 = R
G' = G * 0xff / 0xff + 0x30 = G + 0x30 // 绿色被加强
B' = B * 0xff / 0xff + 0x0 = B
```

效果是这样：

```java
ColorFilter lightingColorFilter = new LightingColorFilter(0xffffff, 0x003000);
paint.setColorFilter(lightingColorFilter);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218274116-52e2eef1-7c24-442a-abee-2c1b9b58646c.png#averageHue=%23c1cd94&clientId=u690cbdb2-009e-4&from=paste&height=109&id=u2dd4208e&originHeight=157&originWidth=339&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41412&status=done&style=stroke&taskId=u3f12be4d-0b1a-4a0c-b150-0742d3e55f9&title=&width=234.5)

#### PorterDuffColorFilter

`PorterDuffColorFilter` 的作用是使用一个指定的颜色和一种指定的 `PorterDuff.Mode` 来与绘制对象进行合成。有一个 mode 为 `SRC_ATOP` 的子类 `SimpleColorFilter`。

构造函数

```java
PorterDuffColorFilter(@ColorInt int color, PorterDuff.Mode mode)
```

color 参数是指定的颜色， mode 参数是指定的 Mode

#### ColorMatrixColorFilter

ColorMatrixColorFilter 使用一个 ColorMatrix 来对颜色进行处理。 ColorMatrix 这个类，内部是一个 4x5 的矩阵：

```
[ a, b, c, d, e,
  f, g, h, i, j,
  k, l, m, n, o,
  p, q, r, s, t ]
```

通过计算， ColorMatrix 可以把要绘制的像素进行转换。对于颜色 [R, G, B, A] ，转换算法是这样的：

```
R’ = a*R + b*G + c*B + d*A + e;
G’ = f*R + g*G + h*B + i*A + j;
B’ = k*R + l*G + m*B + n*A + o;
A’ = p*R + q*G + r*B + s*A + t;
```

ColorMatrix 有一些自带的方法可以做简单的转换，例如可以使用 setSaturation(float sat) 来设置饱和度；

#### BlendModeColorFilter

## Paint 之 Shader

在 Android 的绘制里使用 Shader ，并不直接用 Shader 这个类，而是用它的几个子类。具体来讲有 `LinearGradient` `RadialGradient` `SweepGradient` `BitmapShader` `ComposeShader` 这么几个

### Tile.Mode

TileMode 边缘填充模式<br />如果 shader 的大小小于 view 的大小时如何绘制其他没有被 shader 覆盖的区域？用 TileMode

#### CLAMP 边缘拉伸，利用边缘的颜色，填充剩余部分

#### REPEAT 在水平和垂直两个方向上重复，相邻图像没有间隙，重复 shader

#### MIRROR 以镜像的方式在水平和垂直两个方向上重复，相邻图像有间隙，镜面 shader

### LinearGradient 线性渐变

- LinearGradient(float x0, float y0, float x1, float y1, int color0, int color1, TileMode tile) 指定两个颜色之间的渐变
- LinearGradient(float x0, float y0, float x1, float y1, int colors[], float positions[], TileMode tile) 指定多个颜色之间的渐变
- <br />

> 设置了 Shader 之后，绘制出了渐变颜色的圆。（其他形状以及文字都可以这样设置颜色。）<br />注意：在设置了 Shader 的情况下， Paint.setColor/ARGB() 所设置的颜色就不再起作用。

1. 参数：

```
(x0,y0): 渐变起始点坐标
(x1,y1): 渐变结束点坐标
color0: 渐变开始点颜色，16进制的颜色表示，必须要带有透明度
color1: 渐变结束颜色

colors: 渐变数组
positions: 位置数组，position的取值范围[0,1], 作用是指定某个位置的颜色值，如果传null，渐变就线性变化。
tile: TileMode 边缘填充模式。用于指定控件区域大于指定的渐变区域时，空白区域的颜色填充方法。
```

CLAMP:<br />![](http://note.youdao.com/yws/res/50429/D9C3347FB64E4F20A7BAF218A18431E0#id=q7MA8&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218432490-c2482a75-c839-456f-88dd-b742931e75ef.png#averageHue=%2325dc03&clientId=u690cbdb2-009e-4&from=paste&height=75&id=u4d498684&originHeight=150&originWidth=389&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21013&status=done&style=stroke&taskId=uea2f4d52-befd-42b1-97b5-01461fc86d6&title=&width=194.5)<br />REPEAT:<br />![](http://note.youdao.com/yws/res/50432/2C99AF71396242D6ACAB57399F8FAF47#id=cEzl7&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218436433-2026e3a1-2e6a-439d-9d4b-cd99ce4c10a3.png#averageHue=%23808002&clientId=u690cbdb2-009e-4&from=paste&height=65&id=u44b54f8f&originHeight=129&originWidth=400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32068&status=done&style=stroke&taskId=u947ad269-e79f-4243-8ec5-7059494b210&title=&width=200)<br />MIRROR:

2. 线性渐变方向：
3. 要实现 `从上到下` 需要设置 shader 开始结束点坐标为左上角到左下角或右上角到右下角坐标
4. 要实现 `从下到上` 需要设置 shader 开始结束点坐标为左下角到左上角或右下角到右上角
5. 要实现 `从左到右` 需要设置 shader 开始结束点坐标为左上角到右上角或者左下角到右下角
6. 要实现 `从右到左` 需要设置 shader 开始结束坐标为右上角到左上角或者右下角到左下角
7. 要实现对角 shader，需要设置开始结束点坐标 `左上角到右下角`
8. 多颜色填充 colors，positions 数组参数讲解<br />positions 为 null 时，线性填充，和没有 positions 数组的构造函数效果一样。positions 数组中值为 0-1,0 表示开始绘制点，1 表示结束点，0.5 对应中间点等等。数组中位置信息对应颜色数组中的颜色。

```
int [] colors = {Color.RED,Color.GREEN, Color.BLUE};
float[] position = {0f, 0.3f, 1.0f};
// 上面position[0]对应数组中的第一个RED，0.3f的位置对应颜色中的GREEN，1.0f的位置对应颜色中的BLUE，所以从0-0.3的位置是从RED到GREEN的渐变，从0.3到1.0的位置的颜色渐变是GREEN到BLUE。
```

```java
int [] colors = {Color.RED,Color.GREEN, Color.BLUE};
float[] position = {0f, 0.3f, 1.0f};
LinearGradient linearGradient = new LinearGradient(0,0,getMeasuredWidth(),0,colors,position, Shader.TileMode.CLAMP);

mPaint.setShader(linearGradient);
canvas.drawRect(0,0,getMeasuredWidth(),getMeasuredHeight(),mPaint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218460497-6e5e643d-8248-428c-bb53-ff57275fbbf7.png#averageHue=%230bc336&clientId=u690cbdb2-009e-4&from=paste&height=55&id=u9be62d66&originHeight=109&originWidth=378&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15394&status=done&style=stroke&taskId=u2d990244-f43f-42fb-85e0-55dcd66dfa5&title=&width=189)<br />![](http://note.youdao.com/yws/res/50407/A9A4868488C5483586E35DDEBDEEF816#id=iTbV1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)如果把 0.3 改成 0.7:<br />![](http://note.youdao.com/yws/res/50410/237CA30BE8ED4B80843AAA936C345BD5#id=znhr4&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218468245-8a3801df-ce25-47f0-8d82-eb66ece14e2e.png#averageHue=%2344bb05&clientId=u690cbdb2-009e-4&from=paste&height=59&id=u851ec022&originHeight=118&originWidth=376&originalType=binary&ratio=2&rotation=0&showTitle=false&size=14619&status=done&style=stroke&taskId=ub32dcc26-a7b7-4ec3-917b-196d5e10c9e&title=&width=188)

4. 案例：

```java
Shader shader = new LinearGradient(100, 100, 500, 500, Color.parseColor("#E91E63"),
        Color.parseColor("#2196F3"), Shader.TileMode.CLAMP);
paint.setShader(shader);
canvas.drawCircle(300, 300, 200, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218474219-38550edb-e017-4edd-b31c-821a914373a4.png#averageHue=%23e6f0f3&clientId=u690cbdb2-009e-4&from=paste&height=112&id=u916edf15&originHeight=224&originWidth=237&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48058&status=done&style=stroke&taskId=u860be2e8-3b16-48f8-b886-29c3440fd8f&title=&width=118.5)<br />![](http://note.youdao.com/yws/res/50393/FE907C65030047B1929F0B66BC058B5D#id=eJWPG&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### RadialGradient 辐射渐变

从中心向周围辐射状的渐变

- RadialGradient(float centerX, float centerY, float radius, int centerColor, int edgeColor, TileMode tileMode)<br />参数

```
centerX centerY：辐射中心的坐标
radius：辐射半径
centerColor：辐射中心的颜色
edgeColor：辐射边缘的颜色
tileMode：辐射范围之外的着色模式
```

```java
Shader shader = new RadialGradient(300, 300, 200, Color.parseColor("#E91E63"),
        Color.parseColor("#2196F3"), Shader.TileMode.CLAMP);
paint.setShader(shader);
// ...
canvas.drawCircle(300, 300, 200, paint);
```

![](https://note.youdao.com/src/B55F1475A6AA4F29A7B3B9474DE70792#id=xDY9q&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

- CLAMP:<br />![](https://note.youdao.com/src/B63738CE5A424FD4A5C46960D4CF1A5C#id=wP6ZN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)
- MIRROR:<br />![](https://note.youdao.com/src/4F3FCE4B75AA4904B29213C40224A53A#id=YfvfS&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)
- REPEAT<br />![](https://note.youdao.com/src/0B6EDA84BFF34F9DA013BCFCAFDADE0E#id=tPRXK&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### SweepGradient 扫描渐变

- SweepGradient(float cx, float cy, int color0, int color1)<br />参数：

```
cx cy ：扫描的中心
color0：扫描的起始颜色
color1：扫描的终止颜色
```

案例:

```kotlin
private fun drawSweepGradient(canvas: Canvas) {
    var shader = SweepGradient(150F, 150F, Color.RED, Color.BLUE)
    paint.shader = shader
    canvas.drawCircle(150F, 150F, 100F, paint)
    canvas.drawDot(150F, 150F)

    canvas.save()
    canvas.translate(350F, 0F)
    paint.style = Paint.Style.FILL
    canvas.drawCircle(150F, 150F, 100F, paint)
    canvas.drawDot(150F, 150F)
    canvas.restore()

    canvas.save()
    canvas.translate(0F, 350F)
    shader = SweepGradient(150F, 150F, Color.RED, Color.BLUE)
    paint.shader = shader
    canvas.drawCircle(200F, 200F, 200F, paint)
    canvas.drawDot(200F, 200F)

    canvas.translate(600F, 0F)
    shader = SweepGradient(150F, 150F, Color.RED, Color.BLUE)
    paint.shader = shader
    canvas.drawCircle(150F, 150F, 200F, paint)
    canvas.drawDot(150F, 150F)
    canvas.restore()
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218575799-58c75874-44ea-406a-b397-ab77b3da02cc.png#averageHue=%23b996b8&clientId=u690cbdb2-009e-4&from=paste&height=230&id=ufd8c96cb&originHeight=460&originWidth=638&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88515&status=done&style=stroke&taskId=u5adafe29-6a50-4aa4-9f63-c5fb9449882&title=&width=319)<br />![](http://note.youdao.com/yws/res/50466/DA156A8118834771955E19C731376B70#id=M0feY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### BitmapShader Bitmap 着色器

构造方法：

```
BitmapShader(Bitmap bitmap, Shader.TileMode tileX, Shader.TileMode tileY)
```

参数：

```
bitmap：用来做模板的 Bitmap 对象
tileX：横向的 TileMode
tileY：纵向的 TileMode。
```

```java
Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.batman);
Shader shader = new BitmapShader(bitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
paint.setShader(shader);
// ...
canvas.drawCircle(300, 300, 200, paint);
```

![](https://note.youdao.com/src/EB6D6FB67D444F02A81FE71A2B5973E2#id=VO7QZ&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

> 嗯，看着跟 Canvas.drawBitmap() 好像啊？事实上也是一样的效果。如果你想绘制圆形的 Bitmap，就别用 drawBitmap() 了，改用 drawCircle() + BitmapShader 就可以了（其他形状同理）。

CLAMP:<br />![](http://note.youdao.com/yws/res/50472/8C8F7B8129CB4AE69DC90411171E5794#id=BbqKV&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218579013-20ee6087-b6b7-4550-bb4a-748a90941c4e.png#averageHue=%232d2d2b&clientId=u690cbdb2-009e-4&from=paste&height=225&id=u922255dd&originHeight=449&originWidth=748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=76156&status=done&style=stroke&taskId=u77d6e47d-f8b2-42f4-8c9a-13dd3036e8c&title=&width=374)

MIRROR:<br />![](https://note.youdao.com/src/382F30398BAE4A53AD59491A3A330C50#id=qbWGk&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

REPEAT:<br />![](https://note.youdao.com/src/153461FA2C5649A7ADDAECA2465BD317#id=EZXBM&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### ComposeShader 混合着色器

把两个 Shader 一起使用。<br />构造方法：

```
ComposeShader(Shader shaderA, Shader shaderB, PorterDuff.Mode mode)
```

参数：

```
shaderA, shaderB：两个相继使用的 Shader
mode: PorterDuff.Mode 两个 Shader 的叠加模式，即 shaderA 和 shaderB 应该怎样共同绘制。它的类型是 PorterDuff.Mode 。具体见PorterDuff.Mode章节
```

> ComposeShader() 在硬件加速下是不支持两个相同类型的 Shader 的

```java
// 第一个 Shader：头像的 Bitmap
Bitmap bitmap1 = BitmapFactory.decodeResource(getResources(), R.drawable.batman);
Shader shader1 = new BitmapShader(bitmap1, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);

// 第二个 Shader：从上到下的线性渐变（由透明到黑色）
Bitmap bitmap2 = BitmapFactory.decodeResource(getResources(), R.drawable.batman_logo);
Shader shader2 = new BitmapShader(bitmap2, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);

// ComposeShader：结合两个 Shader
Shader shader = new ComposeShader(shader1, shader2, PorterDuff.Mode.SRC_OVER);
paint.setShader(shader);
// ...
canvas.drawCircle(300, 300, 300, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218588532-7f81913b-ba87-4dce-8d3a-c67daee46a68.png#averageHue=%23e8e8e4&clientId=u690cbdb2-009e-4&from=paste&height=167&id=u62b3f9a7&originHeight=334&originWidth=957&originalType=binary&ratio=2&rotation=0&showTitle=false&size=201127&status=done&style=stroke&taskId=u30117c20-f6ac-44ab-9851-45936129ff1&title=&width=478.5)<br />![](https://note.youdao.com/src/11BE745B5407462D87E90AB06E9985AF#id=mo52V&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688218588187-3ee8c7ed-2f5c-40d1-b166-636b514be897.png#averageHue=%23eae9e6&clientId=u690cbdb2-009e-4&from=paste&height=175&id=u431f3993&originHeight=349&originWidth=967&originalType=binary&ratio=2&rotation=0&showTitle=false&size=186358&status=done&style=stroke&taskId=ucf03e9b5-af8a-460e-8a5d-756eeb622b3&title=&width=483.5)

# 文字绘制

## TextPaint

Paint 有一个唯一的子类 `TextPaint` 就是专门为文本绘制量身定做的 " 笔 "，而这支笔就如 API 所描述的那样能够在绘制时为文本添加一些额外的信息, 这些信息包括：baselineShift,bgColor,density,drawableState,linkColor。

1. 绘制文本时能够实现换行绘制，在正常情况下 Android 绘制文本是不能识别换行符之类的标识符的，这时候如果我们想实现换行绘制就得另辟途径使用 StaticLayout 结合 TextPaint 实现换行

### 常用 API

#### float ascent() 返回 ascent

#### float descent() 返回 descent

#### FontMetrics getFontMetrics() 返回 FontMetrics

#### float getFontMetrics(FontMetrics metrics)

这个和我们之前用到的 getFontMetrics() 相比多了个参数，getFontMetrics() 返回的是 FontMetrics 对象而 getFontMetrics(Paint.FontMetrics metrics) 返回的是文本的行间距，如果 metrics 的值不为空则返回 FontMetrics 对象的值；如果为 null 返回的是合适的 paint 属性值

#### FontMetricsInt getFontMetricsInt()

该方法返回了一个 FontMetricsInt 对象，FontMetricsInt 和 FontMetrics 是一样的，只不过 FontMetricsInt 返回的是 int 而 FontMetrics 返回的是 float

#### FontMetricsInt getFontMetricsInt(Paint.FontMetricsInt fmi)

同 `getFontMetrics(FontMetrics metrics)`，只是返回值为 int

#### float getFontSpacing() 返回字符行间距

#### setUnderlineText(boolean underlineText) 设置下划线

#### setTypeface(Typeface typeface) 设置字体类型 Android 中字体有四种样式：`BOLD`（加粗）,`BOLD_ITALIC`（加粗并倾斜）,`ITALIC`（倾斜）,`NORMAL`（正常）；而其为我们提供的字体有五种：`DEFAULT`,`DEFAULT_BOLD`,`MONOSPACE`,`SANS_SERIF` 和 `SERIF`

#### int breakText(CharSequence text, int start, int end,  boolean measureForwards, float maxWidth, float[] measuredWidth) 这个方法让我们设置一个最大宽度在不超过这个宽度的范围内返回实际测量值否则停止测量

```
text: 表示我们的字符串
start表示从第几个字符串开始测量
end表示从测量到第几个字符串为止
measureForwards表示向前还是向后测量
maxWidth表示一个给定的最大宽度在这个宽度内能测量出几个字符
measuredWidth为一个可选项，可以为空，不为空时返回真实的测量值。
```

同样的方法还有 `breakText (String text, boolean measureForwards, float maxWidth, float[] measuredWidth)` 和 `breakText (char[] text, int index, int count, float maxWidth, float[] measuredWidth)`。

> 这些方法在一些结合文本处理的应用里比较常用，比如文本阅读器的翻页效果，我们需要在翻页的时候动态折断或生成一行字符串

#### Paint.void setTextSkewX(float skewX) 这个方法可以设置文本在水平方向上的倾斜，效果类似下图

```java
// 设置画笔文本倾斜
textPaint.setTextSkewX(-0.25F);
```

> 这个倾斜值没有具体的范围，但是官方推崇的值为 -0.25 可以得到比较好的倾斜文本效果，值为负右倾值为正左倾，默认值为 0

#### Paint.setTextSize (float textSize)  文字大小

要注意该值必需大于零

#### Paint.setTextScaleX (float scaleX) 将文本沿 X 轴水平缩放，默认值为 1，当值大于 1 会沿 X 轴水平放大文本，当值小于 1 会沿 X 轴水平缩放文本

```java
textPaint.setTextScaleX(0.5F);
```

> setTextScaleX 不仅放大了文本宽度同时还拉伸了字符！这是亮点~~

#### Paint.setTextLocale (Locale locale) 设置 Locale，国际化用到

#### Paint.setTextAlign (Paint.Align align) 文本对齐方式

设置文本的对其方式，可供选的方式有三种：CENTER,LEFT 和 RIGHT

> 文本的绘制是从 baseline 开始没错，但是是从哪边开始绘制的呢？左端还是右端呢？而这个 Align 就是为我们定义在 baseline 绘制文本究竟该从何处开始

1. Align.LEFT 则从文本的左端开始往右绘制，drawText 的时候起点 x = 0
2. Align.RIGHT 则从文本的右端开始往左绘制，drawText 的时候起点 x = canvas.getWidth()
3. Align.CENTER 从文本的中间往两边绘制，drawText 的时候起点 x = canvas.getWidth() / 2

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219402573-344516a1-9e09-4f30-b689-28bb5188f757.png#averageHue=%23f2f1f1&clientId=u690cbdb2-009e-4&from=paste&height=120&id=u26b55e2e&originHeight=139&originWidth=324&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26614&status=done&style=stroke&taskId=uac4f8b0a-d3e5-44b9-9934-3d7ae246e66&title=&width=280)<br />两种居中绘制方式

```
// Align.LEFT居中绘制
baseX = (int) (canvas.getWidth() / 2 - textPaint.measureText(TEXT) / 2);

// Align.CENTER居中绘制
canvas.drawText(TEXT, canvas.getWidth() / 2, baseY, textPaint);
```

#### Paint.setSubpixelText (boolean subpixelText) 设置 SUBPIXEL_TEXT_FLAG

设置是否打开文本的亚像素显示，什么叫亚像素显示呢？你可以理解为对文本显示的一种优化技术，如果大家用的是 Win7+ 系统可以在控制面板中找到一个叫 ClearType 的设置，该设置可以让你的文本更好地显示在屏幕上就是基于亚像素显示技术。

#### Paint.setStrikeThruText (boolean strikeThruText) 文本删除线

#### Paint.setLinearText (boolean linearText)

设置是否打开线性文本标识，这玩意对大多数人来说都很奇怪不知道这玩意什么意思。想要明白这东西你要先知道文本在 Android 中是如何进行存储和计算的。在 Android 中文本的绘制需要使用一个 bitmap 作为单个字符的缓存，既然是缓存必定要使用一定的空间，我们可以通过 setLinearText (true) 告诉 Android 我们不需要这样的文本缓存。

#### setFakeBoldText (boolean fakeBoldText) 设置文本仿粗体

#### measureText (String text), measureText (CharSequence text, int start, int end), measureText (String text, int start, int end), measureText (char[] text, int index, int count) 测量文本宽度

> API 21 中还新增了两个方法

#### setLetterSpacing(float letterSpacing) 设置行间距，默认是 0

## FontMetrics/FontMetricsInt

FontMetrics 意为字体测量。y 轴向下增长。FontMetrics 其实是 Paint 的一个内部类，而它里面呢就定义了 `top`,`ascent`,`descent`,`bottom`,`leading` 五个成员变量其他什么也没有。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219418920-01188593-cf03-4e4c-bcd9-954793869953.png#averageHue=%23213818&clientId=u690cbdb2-009e-4&from=paste&height=59&id=u09f04e1e&originHeight=79&originWidth=458&originalType=binary&ratio=2&rotation=0&showTitle=false&size=36434&status=done&style=stroke&taskId=u89c860d8-08cb-4203-9acd-b0a7f670f72&title=&width=343)

```java
public static class FontMetrics {
    /**
     * The maximum distance above the baseline for the tallest glyph in
     * the font at a given text size.
     */
    public float   top;
    /**
     * The recommended distance above the baseline for singled spaced text.
     */
    public float   ascent;
    /**
     * The recommended distance below the baseline for singled spaced text.
     */
    public float   descent;
    /**
     * The maximum distance below the baseline for the lowest glyph in
     * the font at a given text size.
     */
    public float   bottom;
    /**
     * The recommended additional space to add between lines of text.
     */
    public float   leading;
}
```

在 Android 中，文字的绘制都是从 Baseline 处开始。

#### ascent

ascent，Baseline 往上至字符最高处的距离我们称之为 ascent（上坡度），负数

#### descent

Baseline 往下至字符最底处的距离我们称之为 descent（下坡度），负数

#### leading

leading（行间距）则表示上一行字符的 descent 到该行字符的<br />ascent 之间的距离

#### top

top 除了 Baseline 到字符顶端 ascent 的距离外还应该包含这些符号的高度，比 ascent 高一些，正数

#### bottom

bottom 出了 Baseline 到字符底端 descent 的距离外还包含这些符号的高度，比 descent 低一些，正数

> 一般情况下我们极少使用到类似的符号所以往往会忽略掉这些符号的存在，但是 Android 依然会在绘制文本的时候在文本外层留出一定的边距，这就是为什么 top 和 bottom 总会比 ascent 和 descent 大一点的原因。而在 TextView 中我们可以通过 xml 设置其属性 android:includeFontPadding="false" 去掉一定的边距值但是不能完全去掉

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219444459-31f3cb6b-1275-40fc-a628-60333f307f48.png#averageHue=%23ededed&clientId=u690cbdb2-009e-4&from=paste&height=208&id=u684f1557&originHeight=200&originWidth=300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=9807&status=done&style=stroke&taskId=ua45dccfe-204d-41bc-9dd7-3365c804ae6&title=&width=312)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219448630-7b147007-da45-4398-b1a0-2b5102d97158.png#averageHue=%23edebeb&clientId=u690cbdb2-009e-4&from=paste&height=141&id=u4d037daa&originHeight=153&originWidth=534&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19046&status=done&style=stroke&taskId=u74a9527b-874e-4383-ba1b-ba2a62dfda4&title=&width=491)

#### 中线计算公式

中线 = canvas.height/2 - descent + (descent-ascent)/2 = canvas.height/2 - (descent+ascent)/2

> 需要将 Baseline 往下移 descent

#### 获取 ascent/descent

1. paint.getFontMetrics().ascent/descent/top/bottom/leading
2. paint.descent()/ascent()

## Typeface

### static Typeface defaultFromStyle([@Style](/Style) int style) 将 Android 中字体有四种样式：BOLD（加粗）,BOLD_ITALIC（加粗并倾斜）,ITALIC（倾斜）,NORMAL（正常）；封装成 Typeface

### create(String familyName, int style) 和 create(Typeface family, int style) 创建 Typeface

两者大概意思都一样，比如

```java
textPaint.setTypeface(Typeface.create("SERIF", Typeface.NORMAL));
textPaint.setTypeface(Typeface.create(Typeface.SERIF, Typeface.NORMAL));
```

`createFromAsset(AssetManager mgr, String path)`、`createFromFile(String path)`、`createFromFile(File path)`<br />这三者也是一样的，它们都允许我们使用自己的字体比如我们从 asset 目录读取一个字体文件：

```java
// 获取字体并设置画笔字体
Typeface typeface = Typeface.createFromAsset(context.getAssets(), "kt.ttf");
textPaint.setTypeface(typeface);
```

## 文字测量

### measureText 测量文字的宽度并返回

### getTextBounds(String text, int start, int end, Rect bounds)

获取文字的显示范围。

- 参数<br />参数里，text 是要测量的文字，start 和 end 分别是文字的起始和结束位置，bounds 是存储文字显示范围的对象，方法在测算完成之后会把结果写进 bounds。
- bounds（相对于 baseline）<br />查看它的属性值 top、bottom 会发现 top 是一个负数；bottom 有时候是 0，有时候是正数。

> baseline 坐标看成原点（0,0），那么相对位置 top 在它上面就是负数，bottom 跟它重合就为 0，在它下面就为正数。像小写字母 j g y 等，它们的 bounds bottom 都是正数，因为它们都有降部（在西文字体排印学中，降部指的是一个字体中，字母向下延伸超过基线的笔画部分）。

### measureText 和 getTextBounds 区别

measureText() 测出来的宽度总是比 getTextBounds() 大一点点。这是因为这两个方法其实测量的是两个不一样的东西。

1. getTextBounds: 它测量的是文字的显示范围（关键词：显示）。形象点来说，你这段文字外放置一个可变的矩形，然后把矩形尽可能地缩小，一直小到这个矩形恰好紧紧包裹住文字，那么这个矩形的范围，就是这段文字的 bounds。
2. measureText(): 它测量的是文字绘制时所占用的宽度（关键词：占用）。前面已经讲过，一个文字在界面中，往往需要占用比他的实际显示宽度更多一点的宽度，以此来让文字和文字之间保留一些间距，不会显得过于拥挤。

## 文字绘制的方式

见 `文字绘制方式` 章节

## 其他

### Bitmap 上绘制文字

见 `Bitmap上绘制东西（文字、图形等）` 章节

# 文字绘制方式

Canvas 绘制文字的方式有三个：`drawText()`、`drawTextRun()` 和 `drawTextOnPath()`。

## Canvas.drawTextXXX 单行

### drawText

- drawText([@NonNull](/NonNull) String text, float x, float y, [@NonNull](/NonNull) Paint paint)

```
参数x: x坐标
参数y: 是文字基线（baseline）的y坐标。向上上负数，向下正数
```

> 这个坐标并不是文字的左上角，在绘制文字的时候把坐标填成 (0, 0)，文字并不会显示在 View 的左上角，而是会几乎完全显示在 View 的上方，到了 View 外部看不到的位置。y 指的是文字的基线（ baseline ） 的位置。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219644837-80cd86e7-560d-45c1-8c35-176f70f2f513.png#averageHue=%23e0e0e0&clientId=u690cbdb2-009e-4&from=paste&height=79&id=uddde4288&originHeight=157&originWidth=524&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26235&status=done&style=none&taskId=u5c71cb5b-c429-4d6b-b6d3-178c1ddbb38&title=&width=262)

#### 特点

1. 不能在 View 的边缘自动折行
2. 不能在换行符 `\n` 处换行，在换行符 \n 的位置并没有换行，而只是加了个空格

### drawTextRun  API 23 一个增加了「上下文」和「文字方向 RTL」支持的增强版本的 drawText()

- drawTextRun([@NonNull](/NonNull) CharSequence text, int start, int end, int contextStart, int contextEnd, float x, float y, boolean isRtl, [@NonNull](/NonNull) Paint paint)

```
text：要绘制的文字
start：从那个字开始绘制
end：绘制到哪个字结束
contextStart：上下文的起始位置。contextStart 需要小于等于 start
contextEnd：上下文的结束位置。contextEnd 需要大于等于 end
x：文字左边的坐标
y：文字的基线坐标
isRtl：是否是 RTL（Right-To-Left，从右向左）
```

### drawTextOnPath 沿着一条 Path 来绘制文字

- drawTextOnPath([@NonNull](/NonNull) String text, [@NonNull](/NonNull) Path path, float hOffset, float vOffset, [@NonNull](/NonNull) Paint paint)

```
text：要绘制的文字
path：路径
hOffset 和 vOffset：它们是文字相对于Path的水平偏移量和竖直偏移量，利用它们可以调整文字的位置。例如你设置 hOffset 为 5， vOffset 为 10，文字就会右移 5 像素和下移 10 像素。
```

> drawTextOnPath() 使用的 Path ，拐弯处全用圆角，别用尖角。

示例：

```java
Path path = new Path();
path.addOval(50, 50, 300, 200, Path.Direction.CW);
canvas.drawPath(path, mRedPaint);
canvas.drawTextOnPath("This is a text", path, 0, 0, mBluePaint);

path.reset();
path.addOval(400, 50, 650, 200, Path.Direction.CCW);
canvas.drawPath(path, mRedPaint);
canvas.drawTextOnPath("This is a text", path, 0, 0, mBluePaint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688219660070-224d9712-95f5-4201-9e36-279b58c913a1.png#averageHue=%23eee7e7&clientId=u690cbdb2-009e-4&from=paste&height=79&id=u21079b7d&originHeight=90&originWidth=300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11485&status=done&style=none&taskId=u6fdd9ed7-5e69-4a6e-853f-dc6c1ce304e&title=&width=264)![](http://note.youdao.com/yws/res/49198/E8EA4569B48D494DB4AA0B2B02F9A728#id=AJ8sY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## Layout

### BoringLayout 单行

主要负责显示单行文本，并提供了 isBoring 方法来判断是否满足单行文本的条件。

### StaticLayout 多行，静态文本

StaticLayout 并不是一个 View 或者 ViewGroup ，而是 android.text.Layout 的子类，它是纯粹用来绘制文字的。StaticLayout 支持换行，它既可以为文字设置宽度上限来让文字自动换行，也会在 \n 处主动换行。<br />当文本为非单行文本，且非 Spannable 的时候，就会使用 StaticLayout，内部并不会监听 span 的变化，因此效率上会比 DynamicLayout 高，只需一次布局的创建即可，但其实内部也能显示 SpannableString，只是不能在 span 变化之后重新进行布局而已。<br />构造方法：

```
public StaticLayout(CharSequence source, TextPaint paint,
                    int width,
                    Alignment align, float spacingmult, float spacingadd,
                    boolean includepad) {
    this(source, 0, source.length(), paint, width, align,
         spacingmult, spacingadd, includepad);
}
public StaticLayout(CharSequence source, int bufstart, int bufend,
                    TextPaint paint, int outerwidth,
                    Alignment align,
                    float spacingmult, float spacingadd,
                    boolean includepad) {
    this(source, bufstart, bufend, paint, outerwidth, align,
         spacingmult, spacingadd, includepad, null, 0);
}
public StaticLayout(CharSequence source, int bufstart, int bufend,
        TextPaint paint, int outerwidth,
        Alignment align,
        float spacingmult, float spacingadd,
        boolean includepad,
        TextUtils.TruncateAt ellipsize, int ellipsizedWidth) {
    this(source, bufstart, bufend, paint, outerwidth, align,
            TextDirectionHeuristics.FIRSTSTRONG_LTR,
            spacingmult, spacingadd, includepad, ellipsize, ellipsizedWidth, Integer.MAX_VALUE);
}
public StaticLayout(CharSequence source, int bufstart, int bufend,
    TextPaint paint, int outerwidth,
    Alignment align, TextDirectionHeuristic textDir,
    float spacingmult, float spacingadd,
    boolean includepad,
    TextUtils.TruncateAt ellipsize, int ellipsizedWidth, int maxLines) {
    // ...
}
```

参数说明：

```
CharSequence source 需要分行的字符串
int bufstart 需要分行的字符串从第几的位置开始
int bufend 需要分行的字符串到哪里结束
TextPaint paint 画笔对象
int outerwidth 是文字区域的宽度，文字到达这个宽度后就会自动换行；
Alignment align  是文字的对齐方向；有ALIGN_CENTER， ALIGN_NORMAL， ALIGN_OPPOSITE 三种
float spacingmult 是行间距的倍数，通常情况下填 1 就好；（相对行间距，相对字体大小，1.5f表示行间距为1.5倍的字体高度。）
float spacingadd 是行间距的额外增加值，通常情况下填 0 就好；（在基础行距上添加多少）
boolean includepad 是指是否在文字上下添加额外的空间，来避免某些过高的字符的绘制出现越界。
TextUtils.TruncateAt ellipsize 从什么位置开始省略
int ellipsizedWidth 超过多少开始省略
int maxLines 最大行数
```

案例：

```java
@Override
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    mStaticLayout = new StaticLayout(TEXT, textPaint, canvas.getWidth(), Layout.Alignment.ALIGN_NORMAL, 1.0F, 0.0F, false);
    mStaticLayout.draw(canvas);
}
```

### DynamicLayout 多行，动态文本

当文本为 Spannable 的时候，TextView 就会使用它来负责文本的显示，在内部设置了 SpanWatcher，当检测到 span 改变的时候，会进行 reflow，重新计算布局。

### StaticLayout 的用途

1. 文中高频度大量 textview 刷新优化。
2. 一个 textview 显示大量的文本，比如一些阅读 app
3. 在控件上画文本，比如一个 ImageView 中心画文本。
4. 一些排版效果,比如多行文本文字居中对齐等。

#### 仿小红书实现的文本展开/收起的功能（文本折叠展开效果）

<https://github.com/MrTrying/ExpandableText-Example/tree/master>

> <https://zhuanlan.zhihu.com/p/87509956>

# Ref

- [ ] StaticLayout 源码分析<br /><https://jaeger.itscoder.com/android/2016/08/05/staticlayout-source-analyse.html>
- [ ] TextView 性能瓶颈，渲染优化，以及 StaticLayout 的一些用处<br /><https://www.jianshu.com/p/9f7f9213bff8>
- [ ] <https://www.gcssloop.com/customview/paint-base>
