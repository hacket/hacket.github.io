---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# Path

## 注意

- Canvas.drawPath无效， paint没有设置paint.setStyle(Style.STROKE)

## Path介绍

Path封装了由直线和曲线(二次，三次贝塞尔曲线)构成的几何路径。你能用Canvas中的drawPath来把这条路径画出来(同样支持Paint的不同绘制模式)，也可以用于剪裁画布和根据路径绘制文字。我们有时会用Path来描述一个图像的轮廓，所以也会称为轮廓线(轮廓线仅是Path的一种使用方法，两者并不等价)

### 常用方法

| 作用                            | 相关方法                                                               | 备注                                                      |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 移动起点                          | moveTo                                                             | 移动下一次操作的起点位置                                            |
| 设置终点                          | setLastPoint                                                       | 重置当前path中最后一个点位置，如果在绘制之前调用，效果和moveTo相同                  |
| 连接直线                          | lineTo                                                             | 添加上一个点到当前点之间的直线到Path，如果没有调用moveTo，默认点为原点                |
| 闭合路径                          | close                                                              | 连接第一个点连接到最后一个点，形成一个闭合区域                                 |
| 添加内容                          | addRect, addRoundRect, addOval, addCircle, addPath, addArc, arcTo  | 添加(矩形， 圆角矩形， 椭圆， 圆， 路径， 圆弧) 到当前Path (注意addArc和arcTo的区别) |
| 是否为空                          | isEmpty                                                            | 判断Path是否为空                                              |
| 是否为矩形                         | isRect                                                             | 判断path是否是一个矩形                                           |
| 替换路径                          | set                                                                | 用新的路径替换到当前路径所有内容                                        |
| 偏移路径                          | offset                                                             | 对当前路径之前的操作进行偏移(不会影响之后的操作)                               |
| 贝塞尔曲线                         | quadTo, cubicTo                                                    | 分别为二次和三次贝塞尔曲线的方法                                        |
| rXxx方法                        | rMoveTo, rLineTo, rQuadTo, rCubicTo                                | 不带r的方法是基于原点的坐标系(偏移量)， rXxx方法是基于当前点坐标系(偏移量)              |
| 填充模式                          | setFillType, getFillType, isInverseFillType, toggleInverseFillType | 设置,获取,判断和切换填充模式                                         |
| 提示方法                          | incReserve                                                         | 提示Path还有多少个点等待加入`(这个方法貌似会让Path优化存储结构)`                  |
| 布尔操作(API19)                   | op                                                                 | 对两个Path进行布尔运算(即取交集、并集等操作)                               |
| 计算边界                          | computeBounds                                                      | 计算Path的边界                                               |
| 重置路径                          | reset, rewind                                                      | 清除Path中的内容                                              |
| reset不保留内部数据结构，但会保留FillType.  | -                                                                  | -                                                       |
| rewind会保留内部的数据结构，但不保留FillType | -                                                                  | -                                                       |
| 矩阵操作                          | transform                                                          | 矩阵变换 |                                                  |

### contour概念

「**子图形**」：官方文档里叫做 contour。但由于在这个场景下我找不到这个词合适的中文翻译（直译的话叫做「轮廓」），所以我换了个便于中国人理解的词：「子图形」。

- 第一组addXXX方法是「添加子图形」，所谓「子图形」，指的就是一次不间断的连线。一个 Path 可以包含多个子图形。当使用第一组方法，即 addCircle() addRect() 等方法的时候，每一次方法调用都是新增了一个独立的子图形；
- 而如果使用第二组方法，即 lineTo() arcTo()addArc()等方法的时候，则是每一次断线（即每一次「抬笔」），都标志着一个子图形的结束，以及一个新的子图形的开始。

另外，不是所有的子图形都需要使用 close() 来封闭。当需要填充图形时（即 Paint.Style 为 FILL 或 FILL_AND_STROKE），Path 会自动封闭子图形。

## 用法

### lineTo未闭合

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心(宽高数据在onSizeChanged中获取)
Path path = new Path();                     // 创建Path
path.lineTo(200, 200);                      // lineTo
path.lineTo(200,0);
canvas.drawPath(path, mPaint);              // 绘制Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233215501-25d5fd91-f1e4-4b4c-b6ec-b94503b3f9aa.png#averageHue=%23f8f5f5&clientId=u91b44b1e-4da2-4&from=paste&id=uc38d605c&originHeight=366&originWidth=538&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9f9339f0-40c1-4849-902d-0cd896b7471&title=)

### moveTo 和 setLastPoint

| 方法名          | 简介             | 是否影响之前的操作 | 是否影响之后操作 |
| ------------ | -------------- | --------- | -------- |
| moveTo       | 移动下一次操作的起点位置   | 否         | 是        |
| setLastPoint | 设置之前操作的最后一个点位置 | 是         | 是        |

- moveTo

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
Path path = new Path();                     // 创建Path
path.lineTo(200, 200);                      // lineTo
path.moveTo(200,100);                       // moveTo
path.lineTo(200,0);                         // lineTo
canvas.drawPath(path, mPaint);              // 绘制Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233234445-c1278222-1136-4c91-a324-5860bd82482f.png#averageHue=%23f8f4f4&clientId=u91b44b1e-4da2-4&from=paste&id=u622bf1ae&originHeight=294&originWidth=556&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u8259b378-1360-4871-9885-deec98d69e4&title=)

> moveTo只改变下次操作的起点，在执行完第一次LineTo的时候，本来的默认点位置是A(200,200),但是moveTo将其改变成为了C(200,100),所以在第二次调用lineTo的时候就是连接C(200,100) 到 B(200,0) 之间的直线(用蓝色圈2标注)。

- setLastPoint

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
Path path = new Path();                     // 创建Path
path.lineTo(200, 200);                      // lineTo
path.setLastPoint(200, 100);                 // setLastPoint
path.lineTo(200, 0);                         // lineTo
canvas.drawPath(path, mPaint);              // 绘制Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233249358-1adda67c-1ab5-4868-bcd6-70325008f991.png#averageHue=%23f8f4f4&clientId=u91b44b1e-4da2-4&from=paste&id=uca6168a5&originHeight=304&originWidth=542&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u016fe587-817f-473b-ad93-9b51295a7ad&title=)

> setLastPoint是重置上一次操作的最后一个点，在执行完第一次的lineTo的时候，最后一个点是A(200,200),而setLastPoint更改最后一个点为C(200,100),所以在实际执行的时候，第一次的lineTo就不是从原点O到A(200,200)的连线了，而变成了从原点O到C(200,100)之间的连线了。在执行完第一次lineTo和setLastPoint后，最后一个点的位置是C(200,100),所以在第二次调用lineTo的时候就是C(200,100) 到 B(200,0) 之间的连线(用蓝色圈2标注)。

### close 闭合

close方法用于连接当前最后一个点和最初的一个点(如果两个点不重合的话)，最终形成一个封闭的图形。

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
Path path = new Path();                     // 创建Path
path.lineTo(200, 200);                      // lineTo
path.lineTo(200, 0);                         // lineTo
path.close();                               // close
canvas.drawPath(path, mPaint);              // 绘制Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233263769-561d9fa5-cd80-4e1b-9779-c7f268cb14c4.png#averageHue=%23f7f4f3&clientId=u91b44b1e-4da2-4&from=paste&id=u21b9e894&originHeight=292&originWidth=548&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ud1167074-d173-44f3-874e-876e5a133ad&title=)

> 注意：close的作用是封闭路径，与连接当前最后一个点和第一个点并不等价。如果连接了最后一个点和第一个点仍然无法形成封闭图形，则close什么 也不做

### Path添加图形和路径

#### addXXX 添加子图形

```java
// 第一类(基本形状)
// 圆形
public void addCircle (float x, float y, float radius, Path.Direction dir)
// 椭圆
public void addOval (RectF oval, Path.Direction dir)
// 矩形
public void addRect (float left, float top, float right, float bottom, Path.Direction dir)
public void addRect (RectF rect, Path.Direction dir)
// 圆角矩形
public void addRoundRect (RectF rect, float[] radii, Path.Direction dir)
public void addRoundRect (RectF rect, float rx, float ry, Path.Direction dir)
```

> 第一类的方法，无一例外，在最后都有一个`Path.Direction`。CW(clockwise)顺时针；CCW(counter-clockwise)逆时针

##### addRect 绘制矩形

```java
// dir是方向，CW是顺时针，CCW是逆时针
addRect(RectF rect, Direction dir)
addRect(float left, float top, float right, float bottom, Direction dir)

// rx是横向，ry是纵向，radii是4对(x,y)
addRoundRect(RectF rect, float rx, float ry, Direction dir)
addRoundRect(float left, float top, float right, float bottom, float rx, float ry, Direction dir)
addRoundRect(RectF rect, float[] radii, Direction dir)
addRoundRect(float left, float top, float right, float bottom, float[] radii, Direction dir)
```

- CW，顺时针

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
Path path = new Path();
path.addRect(-200,-200,200,200, Path.Direction.CW);
path.setLastPoint(-300,300);                // <-- 重置最后一个点的位置
canvas.drawPath(path,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233292260-8c4a0767-a700-49d0-9f76-c8ea6898a89a.png#averageHue=%23f4f1f1&clientId=u91b44b1e-4da2-4&from=paste&id=u496f3f41&originHeight=442&originWidth=542&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uc1bdaf87-3b37-4576-aed2-0a1cca1a05f&title=)

- CCW，逆时针

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
Path path = new Path();
path.addRect(-200,-200,200,200, Path.Direction.CCW);
path.setLastPoint(-300,300);                // <-- 重置最后一个点的位置
canvas.drawPath(path,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233305524-df0df232-affa-4e7c-96b7-04dc0d49225a.png#averageHue=%23f4f0f0&clientId=u91b44b1e-4da2-4&from=paste&id=ub9b6e13e&originHeight=420&originWidth=534&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u58378710-9769-4ffb-926f-a29246f5565&title=)<br />对于上面这个矩形来说，我们采用的是顺时针(CW)，所以记录的点的顺序就是 `A -> B -> C -> D`。最后一个点就是D，我们这里使用setLastPoint改变最后一个点的位置实际上是改变了D的位置。

我们将顺时针改为逆时针(CCW)，则记录点的顺序应该就是 `A -> D -> C -> B`, 再使用setLastPoint则改变的是B的位置

> 参数中点的顺序很重要。尝试交换两个坐标点，或者指定另外两个点来作为参数，虽然指定的是同一个矩形，但实际绘制出来是不同

##### addOval椭圆、addCircle圆

```java
addOval(RectF oval, Direction dir)
addOval(float left, float top, float right, float bottom, Direction dir)
addCircle(float x, float y, float radius, Direction dir)
```

##### Direction类

Direction类主要用于绘制文字时的方向

- CW是顺时针
- CCW是逆时针

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

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233316168-ebac9d78-0184-4392-8c3a-2e989d70daee.png#averageHue=%23eee7e7&clientId=u91b44b1e-4da2-4&from=paste&id=u327c26f7&originHeight=90&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ue98f31f9-b071-45e6-aaff-63723cfb681&title=)<br />![](http://note.youdao.com/yws/res/49205/BAAEE9FCDEF2405991983A114D9DB4DF#id=oiAIU&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### addPath 画线（直线或曲线）

```java
// path
public void addPath (Path src) // 将两个Path合并成为一个
public void addPath (Path src, float dx, float dy) // 第二个方法比第一个方法多出来的两个参数是将src进行了位移之后再添加进当前path中
public void addPath (Path src, Matrix matrix) // 将src添加到当前path之前先使用Matrix进行变换
```

> 将两个Path合并成为一个。

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
canvas.scale(1,-1);                         // <-- 注意 翻转y坐标轴
Path path = new Path();
Path src = new Path();
path.addRect(-200,-200,200,200, Path.Direction.CW);
src.addCircle(0,0,100, Path.Direction.CW);
path.addPath(src,0,200);
mPaint.setColor(Color.BLACK);           // 绘制合并后的路径
canvas.drawPath(path,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233328278-e035c867-cd16-4953-9ac6-e763afa678ea.png#averageHue=%23f3f1f1&clientId=u91b44b1e-4da2-4&from=paste&id=u28ecc1f3&originHeight=544&originWidth=482&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u65d23a36-9616-4d93-81e4-f39ed6b93e4&title=)<br />![](http://note.youdao.com/yws/res/49003/3E97841E96AA478BB948E2E47E55DCF3#id=VTYig&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### addArc与arcTo 绘制圆弧 （0°是在矩形的右边的中点）

```java
startAngle是圆弧开始角度，sweepAngle是圆弧经过的角度
addArc(RectF oval, float startAngle, float sweepAngle)
addArc(float left, float top, float right, float bottom, float startAngle,
        float sweepAngle)

// forceMoveTo是否强制将path最后一个点移动到圆弧起点
// arcTo会推断要绘制圆弧的起点与之前最后的点是否是同一个点，假设不是同一个点的话，就会连接两个点
arcTo(RectF oval, float startAngle, float sweepAngle, boolean forceMoveTo)
arcTo(RectF oval, float startAngle, float sweepAngle)
arcTo(float left, float top, float right, float bottom, float startAngle, float sweepAngle, boolean forceMoveTo)
```

1. startAngle 是代表开始的角度，那么Android中矩形的0°是从哪里开始呢？其实矩形的0°是在矩形的右边的中点，按顺时针方向逐渐增大。<br />Android中矩形的0°是从哪里开始呢？其实矩形的0°是在矩形的右边的中点，按顺时针方向逐渐增大。<br />![](http://note.youdao.com/yws/res/49898/CE4942BBBCAE48729865D71B34438139#id=yVAH6&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233337488-3c7f9a1a-3c09-4ee2-ad8f-b3a064af3a14.png#averageHue=%23bfbfbf&clientId=u91b44b1e-4da2-4&from=paste&height=388&id=u081aaa71&originHeight=702&originWidth=918&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9370cb21-34b7-48d4-9da0-162465d49f3&title=&width=508)
2. sweepAngle 扫过的角度就是从起点角度开始扫过的角度，并不是指终点的角度。例如如果你的startAngle是90°，sweepAngle是180°。那么这个圆弧的终点应该在270°，而不是在180°。
3. forceMoveTo forceMoveTo 参数的意思是，绘制是要「抬一下笔移动过去」，还是「直接拖着笔过去」，区别在于是否留下移动的痕迹。<br />`forceMoveTo`意思为“是否强制使用moveTo”，也就是说，是否使用moveTo将变量移动到圆弧的起点位移，也就意味着：

| forceMoveTo | 含义                    | 等价方法                                                                |
| ----------- | --------------------- | ------------------------------------------------------------------- |
| true        | 新开一个轮廓，即不连接最后一个点与圆弧起点 | public void addArc (RectF oval, float startAngle, float sweepAngle) |
| false       | 不移动，而是连接最后一个点与圆弧起点    | public void arcTo (RectF oval, float startAngle, float sweepAngle)  |

##### addArc 直接添加一段圆弧（0°是在矩形的右边的中点）

可以看到addArc有1个方法(实际上是两个的，但另一个重载方法是API21添加的),

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
canvas.scale(1,-1);                         // <-- 注意 翻转y坐标轴
Path path = new Path();
path.lineTo(100,100);
RectF oval = new RectF(0,0,300,300);
path.addArc(oval,0,270);
// path.arcTo(oval,0,270,true);             // <-- 和上面一句作用等价
canvas.drawPath(path,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233360455-200c6bd5-652d-4306-9545-dbc7506ae2e9.png#averageHue=%23f6f4f4&clientId=u91b44b1e-4da2-4&from=paste&height=291&id=u5cb5bbd4&originHeight=462&originWidth=422&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u0ac57d4c-8bf4-4934-bbbd-8039a8e9776&title=&width=266)

##### arcTo  添加一段圆弧，如果圆弧的起点与上一次Path操作的终点不一样的话，就会在这两个点连成一条直线 （0°是在矩形的右边的中点）

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
canvas.scale(1,-1);                         // <-- 注意 翻转y坐标轴
Path path = new Path();
path.lineTo(100,100);
RectF oval = new RectF(0,0,300,300);
path.arcTo(oval,0,270);
// path.arcTo(oval,0,270,false);             // <-- 和上面一句作用等价
canvas.drawPath(path,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233376780-07bf62dd-da9f-4bdc-b032-b72a1d40084f.png#averageHue=%23f6f4f3&clientId=u91b44b1e-4da2-4&from=paste&id=u0448fecb&originHeight=476&originWidth=406&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u3e97f036-21a2-41b5-bb29-ce3409110cd&title=)

> 如果你不想这两个点连线的话，arcTo在一个方法中有forceMoveTo的参数，这个参数如果设为true就说明将上一次操作的点设为圆弧的起点，也就是说不会将圆弧的起点与上一次操作的点连接起来。如果设为false就会连接。

1. arc案例 forceMoveTo=true 强制移动到弧形起点（无痕迹）

```java
paint.setStyle(Style.STROKE);
path.lineTo(100, 100);
path.arcTo(100, 100, 300, 300, -90, 90, true); // 强制移动到弧形起点（无痕迹）
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233390379-dc9c3fb3-07e4-4d31-a791-2c177df491c9.png#averageHue=%23f0f0f0&clientId=u91b44b1e-4da2-4&from=paste&id=u59f3fd51&originHeight=271&originWidth=377&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u6ff9af8b-57d9-4267-9f1b-0eecc7ce45d&title=)

2. arc案例 forceMoveTo=false 直接连线连到弧形起点（有痕迹）

```java
paint.setStyle(Style.STROKE);
path.lineTo(100, 100);
path.arcTo(100, 100, 300, 300, -90, 90, false); // 直接连线连到弧形起点（有痕迹）
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233419624-c5198e6b-e893-49f1-99bd-5d40ce40a186.png#averageHue=%23efefef&clientId=u91b44b1e-4da2-4&from=paste&id=u0b436c1d&originHeight=249&originWidth=341&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u979536b5-7ecf-4c21-af0a-244ffdccc35&title=)<br />![](http://note.youdao.com/yws/res/50296/D8D07087EB4449A2863160136D891B56#id=knY1E&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### rMoveTo/rLineTo

rXxx方法的坐标使用的是相对位置(基于当前点的位移)，而moveTo/liveTo的坐标是绝对位置(基于当前坐标系的坐标)。

```java
Path path = new Path();

path.moveTo(100,100);
path.rLineTo(100,200);

canvas.drawPath(path,mDeafultPaint);
```

### 辅助的设置或计算

#### Path.op方法 布尔操作(API19)

```
boolean op(Path path, Op op)
boolean op(Path path1, Path path2, Op op)
```

布尔操作是两个Path之间的运算，主要作用是用一些简单的图形通过一些规则合成一些相对比较复杂，或难以直接得到的图形。

原始：<br />![](http://note.youdao.com/yws/res/49241/4F21AAC9C01C4F6D901A80258B87491F#id=ZdWEF&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233427123-89eb7e12-397a-428c-9dc4-015947d3d6b6.png#averageHue=%23f55d62&clientId=u91b44b1e-4da2-4&from=paste&id=uc3f41719&originHeight=260&originWidth=418&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u094693f5-5b80-446d-9375-7504bc4630e&title=)

##### DIFFERENCE path1减去path1和path2相交部分

```kotlin
private fun DIFFERENCE(canvas: Canvas) {
    path1.reset()
    path2.reset()
    path1.addCircle(150F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path2.addCircle(250F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path1.op(path2, Path.Op.DIFFERENCE)
    canvas.drawPath(path1, mRedPaint)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233432348-2afc5688-2f1f-45ed-91c4-6773244d1990.png#averageHue=%23ecbbb5&clientId=u91b44b1e-4da2-4&from=paste&id=u5a2ed404&originHeight=338&originWidth=370&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u28a42577-b684-40ac-9df2-b1b1e772e36&title=)

##### INTERSECT 取path1和path2相交部分

```kotlin
// path1和path2相交部分
private fun INTERSECT(canvas: Canvas) {
    path1.reset()
    path2.reset()
    path1.addCircle(150F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path2.addCircle(250F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path1.op(path2, Path.Op.INTERSECT)
    canvas.drawPath(path1, mRedPaint)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233438752-9da32446-b65f-47c1-8c04-acde060c555f.png#averageHue=%23e8f4e8&clientId=u91b44b1e-4da2-4&from=paste&id=u02460786&originHeight=262&originWidth=308&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u22e5cb4d-75d6-466e-8e75-379f6778ee2&title=)

##### UNION path1和path2并集（逻辑或）

```kotlin
private fun UNION(canvas: Canvas) {
    path1.reset()
    path2.reset()
    path1.addCircle(150F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path2.addCircle(250F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path1.op(path2, Path.Op.UNION)
    canvas.drawPath(path1, mRedPaint)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233456083-0861f718-bc4c-409e-bd83-d5db452a212c.png#averageHue=%23f46267&clientId=u91b44b1e-4da2-4&from=paste&id=udc3d8a13&originHeight=270&originWidth=418&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uc5949ec9-e59e-400c-bc8f-19a1c2c7cd8&title=)<br />![](http://note.youdao.com/yws/res/49245/9EC631E179854B0395320A9908968E98#id=nQTMR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

##### XOR 与INTERSECT刚好相反, path1和path2非交集（逻辑xor）

```kotlin
private fun XOR(canvas: Canvas) {
    path1.reset()
    path2.reset()
    path1.addCircle(150F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path2.addCircle(250F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path1.op(path2, Path.Op.XOR)
    canvas.drawPath(path1, mRedPaint)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233462923-d29d7df9-d105-4f72-bd23-798f7445ae4a.png#averageHue=%23f36f72&clientId=u91b44b1e-4da2-4&from=paste&id=uaf80c63b&originHeight=274&originWidth=396&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ubf895152-341f-4a91-bf77-b0a5c4e19e5&title=)

##### REVERSE_DIFFERENCE 与DIFFERENCE刚好相反, path2减去path1和path2相交部分

```kotlin
private fun REVERSE_DIFFERENCE(canvas: Canvas) {
    path1.reset()
    path2.reset()
    path1.addCircle(150F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path2.addCircle(250F.dp(), 150F.dp(), 75F.dp(), Path.Direction.CW)
    path1.op(path2, Path.Op.REVERSE_DIFFERENCE)
    canvas.drawPath(path1, mRedPaint)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233470231-3b71837c-b7db-40f4-9ef3-b6439a33d2dc.png#averageHue=%23edb1ad&clientId=u91b44b1e-4da2-4&from=paste&id=u5880a9ce&originHeight=290&originWidth=370&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf96c6a34-72a4-4353-8220-78cd561ac97&title=)

#### Path.FillType 填充模式(只对Paint为FILL或FILL_STROKE有效)

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233482504-0b8ab4e8-35b2-4746-b35a-bfc8f0fde6d9.png#averageHue=%231c2127&clientId=u91b44b1e-4da2-4&from=paste&id=u8bedbe5d&originHeight=462&originWidth=900&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9e38d147-04b3-492f-b153-e8ce3b1f086&title=)<br />[https://github.com/GcsSloop/AndroidNote/blob/master/CustomView/Advance/[07]Path_Over.md#填充模式](https://github.com/GcsSloop/AndroidNote/blob/master/CustomView/Advance/%5B07%5DPath_Over.md#%E5%A1%AB%E5%85%85%E6%A8%A1%E5%BC%8F)

### isEmpty、 isRect、isConvex、 set 和 offset

#### public boolean isEmpty ()

```
Returns true if the path is empty (contains no lines or curves)
```

#### public boolean isRect (RectF rect)

判断path是否是一个矩形，如果是一个矩形的话，会将矩形的信息存放进参数rect中。

#### public void set (Path src)

将新的path赋值到现有path。

#### offset

```
public void offset (float dx, float dy)
public void offset (float dx, float dy, Path dst) // dst不为空，将当前path平移后的状态存入dst中，不会影响当前path；dst为空(null)，平移将作用于当前path，相当于第一种方法
```

对path进行一段平移，它和Canvas中的translate作用很像，但Canvas作用于整个画布，而path的offset只作用于当前path。

```java
canvas.translate(mWidth / 2, mHeight / 2);  // 移动坐标系到屏幕中心
canvas.scale(1,-1);                         // <-- 注意 翻转y坐标轴
Path path = new Path();                     // path中添加一个圆形(圆心在坐标原点)
path.addCircle(0,0,100, Path.Direction.CW);
Path dst = new Path();                      // dst中添加一个矩形
dst.addRect(-200,-200,200,200, Path.Direction.CW);
path.offset(300,0,dst);                     // 平移
canvas.drawPath(path,mPaint);               // 绘制path
mPaint.setColor(Color.BLUE);                // 更改画笔颜色
canvas.drawPath(dst,mPaint);                // 绘制dst
```

![](http://note.youdao.com/yws/res/49077/CD6CBB2664344494A3DB6F1D4F30A9EC#id=LDERr&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233501056-26fa63a8-3935-4ffe-a880-562e94af21b7.png#averageHue=%23f4f1f1&clientId=u91b44b1e-4da2-4&from=paste&id=u8ea524b0&originHeight=182&originWidth=438&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u695238c3-7948-42f0-a4ef-ca009ba4f05&title=)

> 虽然我们在dst中添加了一个矩形，但是并没有表现出来，所以，当dst中存在内容时，dst中原有的内容会被清空，而存放平移后的path。

### reset/rewind重置路径

重置Path有两个方法，分别是`reset`和`rewind`，两者区别主要有以下两点：

| 方法     | 是否保留FillType设置 | 是否保留原有数据结构 |
| ------ | -------------- | ---------- |
| reset  | 是              | 否          |
| rewind | 否              | 是          |

> 选择权重: FillType > 数据结构；因为“FillType”影响的是显示效果，而“数据结构”影响的是重建速度。

### getFillPath

```java
// 根据原始Path(src)获取预处理后的Path(dst)
paint.getFillPath(Path src, Path dst);
```

在 PathEffect 一开始有这样一句介绍：“PathEffect 在绘制之前修改几何路径… ” 这句话表示的意思是，我们在绘制内容时，会在绘制之前对这些内容进行处理，最终进行绘制的内容实际上是经过处理的，而不是原始的。

### PathEffect 路径效果

见Paint的`PathEffect`

### quardTo/cubicTo贝塞尔曲线

见：`贝塞尔曲线Bezier`

## Path坑

### addRect一大一小同方向只显示一个

```java
canvas.translate(mViewWidth/2, mViewHeight/2);
Path path = new Path();
path.addRect(-100, -100, 100, 100, Path.Direction.CW);
path.addRect(-200, -200, 200, 200, Path.Direction.CW);
canvas.drawPath(path, paint);
```

将 画布移动到中心点 ，绘制两个矩形 一大一小 ，但是运行结果是 只显示大的那个矩形<br />目前问题原因没有找到：涉及到 native  ，猜想是 NDK 给 抹掉了<br />解决方案 ：

```
 将 其中一个 绘画改为逆时针   Path.Direction.CCW   （保证两个矩形绘制顺序不一样）
```

## Path Ref

-  [x] Android开发之Path详解<br /><https://blog.csdn.net/xiangzhihong8/article/details/78278931/>
-  [ ] Android雷达图(蜘蛛网图)绘制<br /><https://blog.csdn.net/crazy__chen/article/details/50163693>

> Path训练

- [ ] Path 从懵逼到精通——基本操作<br /><https://juejin.cn/post/6844903469359317005>

> 详细

# PathMeasure

## 什么是PathMeasure？

PathMeasure是用来对Path进行测量的，一般PathMeasure是和Path配合使用的，通过PathMeasure，我们可以知道Path路径上某个点的坐标、Path的长度等等。

## PathMeasure API

### 构造方法

PathMeasure有两个构造函数：

```java
// 构建一个空的PathMeasure
PathMeasure() 
// 构建一个PathMeasure并关联一个指定的创建好的Path
PathMeasure(Path path, boolean forceClosed)
```

1. 无参构造函数<br />用这个构造函数可创建一个空的 PathMeasure，但是使用之前需要先调用 setPath 方法来与 Path 进行关联。被关联的 Path 必须是已经创建好的，如果关联之后 Path 内容进行了更改，则需要使用 setPath 方法重新关联。
2. 有参构造函数<br />创建一个 PathMeasure 并关联一个 Path， 其实和创建一个空的 PathMeasure 后调用 setPath 进行关联效果是一样的，同样，被关联的 Path 也必须是已经创建好的，如果关联之后 Path 内容进行了更改，则需要使用 setPath 方法重新关联。

> Path 与 PathMeasure进行关联并不会影响 Path 状态。

### setPath(Path path, boolean forceClosed)   关联一个Path

1. 第一个参数自然就是被关联的 Path 了。
2. 第二个参数是用来确保 Path 闭合，如果设置为 true， 则不论之前Path是否闭合，都会自动闭合该 Path(如果Path可以闭合的话，不能闭合的就闭合不了)。并且关联的Path未闭合时，测量的Path长度可能会比Path的实际长度长一点，因为测量的是Path闭合的长度，但关联的Path不会有任何变化。

> 1. 不论 forceClosed 设置为何种状态(true 或者 false)， 都不会影响原有Path的状态，即 Path 与 PathMeasure 关联之后，之前的的 Path 不会有任何改变。
> 2. forceClosed 的设置状态可能会影响测量结果，如果 Path 未闭合但在与 PathMeasure 关联的时候设置 forceClosed 为 true 时，测量结果可能会比 Path 实际长度稍长一点，获取到到是该 Path 闭合时的状态。(forceClosed 为 false 测量的是当前 Path 状态的长度， forceClosed 为 true，则不论Path是否闭合测量的都是 Path 的闭合长度。)

```java
canvas.translate(mViewWidth/2,mViewHeight/2);

Path path = new Path();

path.lineTo(0,200);
path.lineTo(200,200);
path.lineTo(200,0);

PathMeasure measure1 = new PathMeasure(path,false);
PathMeasure measure2 = new PathMeasure(path,true);

Log.e("TAG", "forceClosed=false---->"+measure1.getLength());
Log.e("TAG", "forceClosed=true----->"+measure2.getLength());

canvas.drawPath(path,mDeafultPaint);
```

log如下:

```
com.gcssloop.canvas E/TAG: forceClosed=false---->600.0
com.gcssloop.canvas E/TAG: forceClosed=true----->800.0
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233613309-137874aa-b793-440d-b2b6-849178bb4036.png#averageHue=%23f8f7f7&clientId=u91b44b1e-4da2-4&from=paste&id=u3b9ed479&originHeight=468&originWidth=590&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u649e94bb-0e49-4790-9e39-43249a3f756&title=)<br />![](http://note.youdao.com/yws/res/56225/BE648C3B44034DB0BF745F9F9166DEE9#id=oi0Ay&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### float getLength() 获取Path的长度

返回已关联Path的总长度，若setPath()时设置的forceClosed为true，则返回值可能会比实际长度长。

### boolean isClosed()  是否闭合

用于判断 Path 是否闭合，但是如果你在关联 Path 的时候设置 forceClosed 为 true 的话，这个方法的返回值则一定为true。

### boolean nextContour() 跳转到下一个轮廓

Path 可以由多条曲线构成，但不论是 getLength , getSegment 或者是其它方法，都只会在其中第一条线段上运行。nextContour 就是用于跳转到下一条曲线到方法，如果跳转成功，则返回 true， 如果跳转失败，则返回 false。

```java
canvas.translate(mViewWidth / 2, mViewHeight / 2);      // 平移坐标系

Path path = new Path();
path.addRect(-100, -100, 100, 100, Path.Direction.CW);  // 添加小矩形，改成CCW可以同时显示，不然只能显示一个
path.addRect(-200, -200, 200, 200, Path.Direction.CW);  // 添加大矩形
canvas.drawPath(path,mDeafultPaint);                    // 绘制 Path

PathMeasure measure = new PathMeasure(path, false);     // 将Path与PathMeasure关联

float len1 = measure.getLength();                       // 获得第一条路径的长度

measure.nextContour();                                  // 跳转到下一条路径

float len2 = measure.getLength();                       // 获得第二条路径的长度
Log.i("LEN","len1="+len1);                              // 输出两条路径的长度
Log.i("LEN","len2="+len2);
```

> 同方向的addRect，只能显示一个，原因未知；改成一个CW，一个CCW就可以都显示

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233623083-f5333c65-d90e-4d4f-bf67-30f5cd3f14b9.png#averageHue=%23f5f5f5&clientId=u91b44b1e-4da2-4&from=paste&id=u576c94cf&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uafb790da-22a1-4b08-8094-cd73f9a2e01&title=)<br />![](http://note.youdao.com/yws/res/56288/1E257367E9864C9C8CD4180BE555273D#id=NT4PN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

1. 曲线的顺序与 Path 中添加的顺序有关。
2. getLength 获取到到是当前一条曲线分长度，而不是整个 Path 的长度。
3. getLength 等方法是针对当前的曲线

### boolean getSegment(float startD, float stopD, Path dst, boolean startWithMoveTo)  截取片段

截取关联Path的一段(startD-stopD)存到dst，如果截取成功，返回true；反之返回false。(起始点为path第一个点)

| 参数              | 作用                   | 备注                                                                                                                                               |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 返回值(boolean)    | 判断截取是否成功             | true 表示截取成功，结果添加到dst中（不是替换），false 截取失败，不会改变dst中内容。如果截取的Path的长度为0，则返回false，大于0则返回true；startD、stopD必须为合法值(0,getLength())，如果startD>=stopD,则返回false； |
| startD          | 开始截取位置距离 Path 起点的长度  | 取值范围: 0 <= startD < stopD <= Path总长度                                                                                                             |
| stopD           | 结束截取位置距离 Path 起点的长度  | 取值范围: 0 <= startD < stopD <= Path总长度                                                                                                             |
| dst             | 截取的 Path 将会添加到 dst 中 | 注意: 是添加，而不是替换                                                                                                                                    |
| startWithMoveTo | 起始点是否使用 moveTo       | startWithMoveTo为true时，起始点保持不变，被截取的path片段会保持原状；startWithMoveTo为false时，会将截取的path片段的起始点移动到dstPath的终点以保持dstPath的连续性                                  |

> 在4.4或之前的版本，在开启硬件加速时，绘制可能会不显示，请关闭硬件加速或者给 dst 添加一个简单操作，如: dst.rLineTo(0, 0)

- 案例1：dst没有内容时，startWithMoveTo为true

```java
canvas.translate(mViewWidth / 2, mViewHeight / 2);          // 平移坐标系
Path path = new Path();                                     // 创建Path并添加了一个矩形
path.addRect(-200, -200, 200, 200, Path.Direction.CW);
Path dst = new Path();                                      // 创建用于存储截取后内容的 Path
PathMeasure measure = new PathMeasure(path, false);         // 将 Path 与 PathMeasure 关联
// 截取一部分存入dst中，并使用 moveTo 保持截取得到的 Path 第一个点的位置不变
measure.getSegment(200, 600, dst, true);                    
canvas.drawPath(dst, mDeafultPaint);                        // 绘制 dst
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233638471-ec43265d-3b47-468b-b84a-c4bbe5ab0fa3.png#averageHue=%23f8f8f8&clientId=u91b44b1e-4da2-4&from=paste&id=ue0f82191&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u673b0683-e667-4fa5-b500-ab4069917c1&title=)<br />![](http://note.youdao.com/yws/res/56256/EAC65E3498694823A4909D1E48D8D820#id=UmF3m&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

- 案例2：dst中有内容时，startWithMoveTo为true

```java
canvas.translate(mViewWidth / 2, mViewHeight / 2);          // 平移坐标系
Path path = new Path();                                     // 创建Path并添加了一个矩形
path.addRect(-200, -200, 200, 200, Path.Direction.CW);
Path dst = new Path();                                      // 创建用于存储截取后内容的 Path
dst.lineTo(-300, -300);                                     // <--- 在 dst 中添加一条线段
PathMeasure measure = new PathMeasure(path, false);         // 将 Path 与 PathMeasure 关联
measure.getSegment(200, 600, dst, true);                   // 截取一部分 并使用 moveTo 保持截取得到的 Path 第一个点的位置不变
canvas.drawPath(dst, mDeafultPaint);                        // 绘制 Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233643985-309d19ba-d02a-4245-91d8-66e8abf4407b.png#averageHue=%23f7f7f7&clientId=u91b44b1e-4da2-4&from=paste&id=u3c40eb43&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u4e7f9ac9-d313-4425-a86a-9d0ab0397b4&title=)

> 被截取的 Path 片段会添加到 dst 中，而不是替换 dst 中到内容。

- 案例3：dst有内容，且startWithMoveTo为false

```java
canvas.translate(mViewWidth / 2, mViewHeight / 2);          // 平移坐标系
Path path = new Path();                                     // 创建Path并添加了一个矩形
path.addRect(-200, -200, 200, 200, Path.Direction.CW);
Path dst = new Path();                                      // 创建用于存储截取后内容的 Path
dst.lineTo(-300, -300);                                     // 在 dst 中添加一条线段
PathMeasure measure = new PathMeasure(path, false);         // 将 Path 与 PathMeasure 关联
measure.getSegment(200, 600, dst, false);                   // <--- 截取一部分 不使用 startMoveTo, 保持 dst 的连续性
canvas.drawPath(dst, mDeafultPaint);                        // 绘制 Path
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233661551-c7a44d51-0ae1-44f2-a044-36ecfc990b1e.png#averageHue=%23f7f7f7&clientId=u91b44b1e-4da2-4&from=paste&id=u4dd5d42f&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u64e504d1-91a3-4440-9bf5-eb4d5ee9cfa&title=)

> 如果 startWithMoveTo 为 true, 则被截取出来到Path片段保持原状，如果 startWithMoveTo 为 false，则会将截取出来的 Path 片段的起始点移动到 dst 的最后一个点，以保证 dst 的连续性。

### boolean getPosTan(float distance, float pos[], float tan[])  获取指定长度的位置坐标及该点切线值

| 参数           | 作用            | 备注                                                                                                                                               |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 返回值(boolean) | 判断获取是否成功      | true表示成功，数据会存入 pos 和 tan 中，false 表示失败，pos 和 tan 不会改变                                                                                             |
| distance     | 距离 Path 起点的长度 | 取值范围: 0 <= distance <= getLength                                                                                                                 |
| pos          | 该点的坐标值        | 当前点在画布上的位置，有两个数值，分别为x，y坐标。                                                                                                                       |
| tan          | 该点的正切值        | 当前点在曲线上的方向，使用 Math.atan2(tan[1], tan[0]) 获取到正切角的弧度值。tan[0]对应角度的cos值，对应X坐标。tan[1] 对应角度的sin值，对应Y坐标。当前点的切线与 x 轴夹角的tan 值，我们通常结合 Math.atan2方法来计算旋转角度。 |

其他2个参数好理解，主要看tan这个参数：

#### tan

tan 在数学中被称为正切，在直角三角形中，一个锐角的正切定义为它的对边(Opposite side)与邻边(Adjacent side)的比值(来自维基百科)：<br />![](http://note.youdao.com/yws/res/56324/88E15620031C4D0799C764B709FB64A6#id=tYIzf&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

`tan 来描述 Path 上某一点的切线方向，主要用了两个数值 tan[0] 和 tan[1] 来描述这个切线的方向(切线方向与x轴夹角)`，看上面公式可知 tan 既可以用 对边／邻边 来表述，也可以用 sin／cos 来表述，此处用两种理解方式均可以(注意下面等价关系):

> tan[0] = cos = 邻边(单位圆x坐标) <br />tan[1] = sin = 对边(单位圆y坐标)

> Math.atan2方法，是根据传入的x,y坐标，计算与原点之间的夹角弧度。即：弧度 A = Math.atan2(P.y,P.x)，使用 Math.atan2(tan[1], tan[0]) 将 tan转化为角(单位为弧度)的时候要注意参数顺序。

#### getPosTan tan参数

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233676437-8f41757d-4bdc-4105-a092-d19aebc1bbfe.png#averageHue=%23f8f8f8&clientId=u91b44b1e-4da2-4&from=paste&height=370&id=uddc91e9f&originHeight=822&originWidth=1192&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u3ff5882b-8eb4-4f5e-8084-1cddf1e0195&title=&width=536)

```
说明：
角 A 的正切值 tanA = P.y/P.x
P 点坐标为（P.x,P.y）
P 点的横坐标 P.x = cosA * 斜边
P 点的纵坐标 P.y = sinA * 斜边
所以最后我们的 tanA 的值为tanA=sinA/cosA
所以我们 tan[]数组中存放的分别是 tan[0]=cosA和 tan[1]=sinA的值。
```

对于 tan[]数组，描述的是当前点的切线与 x 轴夹角的tan 值，我们通常结合 Math.atan2方法来计算旋转角度。<br />![](http://note.youdao.com/yws/res/56340/94A577AB1C4A4714B9CABF696BD6944A#id=lfEYR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233701612-dbdc7f8a-1c73-4980-9a90-1404ed15f767.png#averageHue=%23f9f5f5&clientId=u91b44b1e-4da2-4&from=paste&height=371&id=u3d363387&originHeight=1536&originWidth=2048&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u89b7df50-ae4e-4e97-a845-6dd850e4ad9&title=&width=495)

```
下图说明：绿色箭头表示切线，当处于点（2，0）时，切线于水平方向夹角为90°，tan[0]=cos90=0,tan[1]=sin90=1。
所以，getPosTan 方法中 返回的tan[]数组描述的是当前点的切线与水平线夹角的 tan 值。tan[0]为角 A的cos值 , tan[1]为角 A 的 sin 值。
对于 Math.atan2方法，是根据传入的x,y 坐标，计算与原点之间的夹角弧度。
即：弧度 A = Math.atan2(P.y,P.x)，
P.x 和 P.y 又可以分别用 cosA 和 sinA 来表示。结合 getPosTan 方法我们就可以改成：弧度 A = Math.atan2(tan[1],tan[0])
角度 A = 弧度 A*180/Math.PI
```

#### 案例1：箭头在path圆转圈圈

```java
private float currentValue = 0;     // 用于纪录当前的位置,取值范围[0,1]映射Path的整个长度

private float[] pos;                // 当前点的实际位置
private float[] tan;                // 当前点的tangent值,用于计算图片所需旋转的角度
private Bitmap mBitmap;             // 箭头图片
private Matrix mMatrix;             // 矩阵,用于对图片进行一些操作

private void init(Context context) {
    pos = new float[2];
    tan = new float[2];
    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inSampleSize = 2;       // 缩放图片
    mBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.arrow, options);
    mMatrix = new Matrix();
}

canvas.translate(mViewWidth / 2, mViewHeight / 2);      // 平移坐标系

Path path = new Path();                                 // 创建 Path

path.addCircle(0, 0, 200, Path.Direction.CW);           // 添加一个圆形

PathMeasure measure = new PathMeasure(path, false);     // 创建 PathMeasure

currentValue += 0.005;                                  // 计算当前的位置在总长度上的比例[0,1]
if (currentValue >= 1) {
  currentValue = 0;
}

measure.getPosTan(measure.getLength() * currentValue, pos, tan);        // 获取当前位置的坐标以及趋势

mMatrix.reset();                                                        // 重置Matrix
float degrees = (float) (Math.atan2(tan[1], tan[0]) * 180.0 / Math.PI); // 计算图片旋转角度

mMatrix.postRotate(degrees, mBitmap.getWidth() / 2, mBitmap.getHeight() / 2);   // 旋转图片
mMatrix.postTranslate(pos[0] - mBitmap.getWidth() / 2, pos[1] - mBitmap.getHeight() / 2);   // 将图片绘制中心调整到与当前点重合

canvas.drawPath(path, mDeafultPaint);                                   // 绘制 Path
canvas.drawBitmap(mBitmap, mMatrix, mDeafultPaint);                     // 绘制箭头

invalidate();
```

![](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071808.gif?gcssloop#id=xfC3r&originHeight=533&originWidth=300&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### 案例2：模拟一个圆上的点和点的运动趋势

```java
public class PathTan extends View implements View.OnClickListener {

    private Path mPath;
    private float[] pos;
    private float[] tan;
    private Paint mPaint;
    float currentValue = 0;
    private PathMeasure mMeasure;

    public PathTan(Context context) {
        super(context);
    }

    public PathTan(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPath = new Path();
        mPaint = new Paint();
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(4);
        mMeasure = new PathMeasure();
        mPath.addCircle(0, 0, 200, Path.Direction.CW);
        mMeasure.setPath(mPath, false);
        pos = new float[2];
        tan = new float[2];
        setOnClickListener(this);
    }

    public PathTan(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        mMeasure.getPosTan(mMeasure.getLength() * currentValue, pos, tan);
        float degrees = (float) (Math.atan2(tan[1], tan[0]) * 180.0 / Math.PI);

        canvas.save();
        canvas.translate(400, 400);
        canvas.drawPath(mPath, mPaint);
        canvas.drawCircle(pos[0], pos[1], 10, mPaint);
        canvas.rotate(degrees);
        canvas.drawLine(0, -200, 300, -200, mPaint);
        canvas.restore();
    }

    @Override
    public void onClick(View view) {
        ValueAnimator animator = ValueAnimator.ofFloat(0, 1);
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                currentValue = (float) valueAnimator.getAnimatedValue();
                invalidate();
            }
        });
        animator.setDuration(3000);
        animator.setRepeatCount(ValueAnimator.INFINITE);
        animator.start();
    }
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233734047-e66481fa-bfca-478b-b0cd-124b68e84e3e.png#averageHue=%23f9f6f9&clientId=u91b44b1e-4da2-4&from=paste&height=297&id=uad3d475a&originHeight=482&originWidth=480&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ucba7db51-9222-432e-85b4-3981bc82b74&title=&width=296)

### boolean getMatrix(float distance, Matrix matrix, int flags) 获取指定长度的位置坐标及该点Matrix，相当于对getPosTan的一个矩阵封装

这个方法是用于得到路径上某一长度的位置以及该位置的正切值的矩阵：

| 参数           | 作用                  | 备注                                                           |
| ------------ | ------------------- | ------------------------------------------------------------ |
| 返回值(boolean) | 判断获取是否成功            | true表示成功，数据会存入matrix中，false 失败，matrix内容不会改变                  |
| distance     | 距离 Path 起点的长度       | 取值范围: 0 <= distance <= getLength                             |
| matrix       | 根据 falgs 封装好的matrix | 会根据 flags 的设置而存入不同的内容                                        |
| flags        | 规定哪些内容会存入到matrix中   | 可选择 `POSITION_MATRIX_FLAG(位置)`<br />`ANGENT_MATRIX_FLAG(正切)` |

flags 选项可以选择 位置 或者 正切，两个选项都想选择，可以将两个选项之间用 `|` 连接起来

```java
measure.getMatrix(distance, matrix, PathMeasure.TANGENT_MATRIX_FLAG | PathMeasure.POSITION_MATRIX_FLAG);
```

> 其实这个方法就相当于我们getPosTan例子中封装 matrix 的过程由 getMatrix 替我们做了，我们可以直接得到一个封装好到 matrix

```java
Path path = new Path();                                 // 创建 Path

path.addCircle(0, 0, 200, Path.Direction.CW);           // 添加一个圆形

PathMeasure measure = new PathMeasure(path, false);     // 创建 PathMeasure

currentValue += 0.005;                                  // 计算当前的位置在总长度上的比例[0,1]
if (currentValue >= 1) {
    currentValue = 0;
}

// 获取当前位置的坐标以及趋势的矩阵
measure.getMatrix(measure.getLength() * currentValue, mMatrix, PathMeasure.TANGENT_MATRIX_FLAG | PathMeasure.POSITION_MATRIX_FLAG);

mMatrix.preTranslate(-mBitmap.getWidth() / 2, -mBitmap.getHeight() / 2);   // <-- 默认为图片的左上角，将图片绘制中心调整到与当前点重合(注意:此处是前乘pre)

canvas.drawPath(path, mDeafultPaint);                                   // 绘制 Path
canvas.drawBitmap(mBitmap, mMatrix, mDeafultPaint);                     // 绘制箭头

invalidate();
```

![](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071808.gif?gcssloop#id=b3zMK&originHeight=533&originWidth=300&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

1. 对 matrix 的操作必须要在 getMatrix 之后进行，否则会被 getMatrix 重置而导致无效。
2. 矩阵对旋转角度默认为图片的左上角，我们此处需要使用 preTranslate 调整为图片中心。
3. pre(矩阵前乘) 与 post(矩阵后乘) 的区别

## PathMeasure Ref

- [x] Path之玩出花样(PathMeasure)

> GcsSloop [https://github.com/GcsSloop/AndroidNote/blob/master/CustomView/Advance/[08]Path_Play.md](https://github.com/GcsSloop/AndroidNote/blob/master/CustomView/Advance/%5B08%5DPath_Play.md)

# 贝塞尔曲线Bezier

## 了解Bezier曲线

如何表示一条曲线，能够精确地控制曲线的路径，一直以来是一个很困难的问题。Bezier曲线就是利用数学公式，能够精确描述一条我们想要的曲线。主要是由起始点、终止点和控制点三个部分组成，其中控制点是控制曲线的关键。

贝塞尔曲线是用一系列点来控制曲线状态的，我将这些点简单分为两类：

1. 数据点: 确定曲线的起始和结束位置
2. 控制点: 确定曲线的弯曲程度

### 一阶Bezier曲线

![](http://note.youdao.com/yws/public/resource/73b3ad146341d0d7bd46f108753035a7/WEBRESOURCE322e9ca6508a2b64688f0081e39ecf81?ynotemdtimestamp=1688233825511#id=DdxzN&originHeight=150&originWidth=384&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

> 一阶Bezier曲线，没有控制点的，仅有两个数据点(A 和 B)，是一条直线。

### 二阶Bezier曲线

- 二阶贝塞尔曲线原理：<br />![](https://note.youdao.com/src/76C5D301053F4FD0AEE2253F517ED65B#id=p0EjW&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

> 连接AB BC，并在AB上取点D，BC上取点E，使其满足条件，连接DE，取点F，使得：<br />![](https://note.youdao.com/src/EB877553E5DA49368B26C8D69B82B726#id=ChgIq&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

这样获取到的点F就是贝塞尔曲线上的一个点

- 二阶贝塞尔曲线动图：

![](https://note.youdao.com/src/WEBRESOURCE53303608c6fe6c8cd78304d1d1f93d7d#id=BCc72&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

> 其中的p0和p2分别是起始点和终止点，p1即是控制点。在三个点形成的两条线段上，选取各自的起始位置然后向各自的终点位置移动，并且将两个点连接成一条辅助线，在这条辅助线上同样有一个点从起始位置移动到重点位置，这个点与p0点的连线就是一条二阶Bezier曲线。

### 三阶Bezier曲线

- 三阶贝塞尔曲线原理：<br />三阶曲线由两个数据点(A 和 D)，两个控制点(B 和 C)来描述曲线状态，如下:<br />![](http://note.youdao.com/yws/res/49385/2563A721DC8C4F7F85CD9CB5ADC1371B#id=BfMih&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688233947458-369f5fdf-233b-4f5b-bbd9-46446b69b275.png#averageHue=%23fdfdfd&clientId=u91b44b1e-4da2-4&from=paste&id=ub58c4bf4&originHeight=378&originWidth=614&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9ddc52d9-f0ee-4987-9f8e-eb08e1270b9&title=)

三阶曲线计算过程与二阶类似，<br />![](http://note.youdao.com/yws/public/resource/73b3ad146341d0d7bd46f108753035a7/WEBRESOURCEd99fea38fbf50f6bae68c25f7fe2ac05?ynotemdtimestamp=1688233825511#id=EQ7r3&originHeight=118&originWidth=263&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> 可以看出与二阶Bezier曲线类似，只不过是控制点变成了2个，形成的三条线段构成了两条辅助线，在这两条辅助线上又构造了一条辅助线，并且其运动的点与p0的连线构成一条三阶Bezier曲线。

## Android中的Bezier

### 二阶 quardTo/rQuardTo

```
// 让Path恢复，养成良好的习惯
mPath.reset();
// 将Path移动到初始位置点
mPath.moveTo(mStartPointX, mStartPointY);
// quadTo即二阶Bezier曲线的Android API方法，前两个参数是控制点坐标，后两个参数是终止点坐标
mPath.quadTo(mFlagPointX, mFlagPointY, mEndPointX, mEndPointY);
```

### 三阶 cubicTo/rCubicTo

```java
mPath.reset();
mPath.moveTo(mStartPointX, mStartPointY);
// 三阶Bezier曲线的API是cubicTo，同样地前四个参数对应两个控制点的坐标，后两个参数对应终止点坐标
mPath.cubicTo(mFlagPointOneX, mFlagPointOneY, mFlagPointTwoX, mFlagPointTwoY, mEndPointX, mEndPointY);
```

## 贝塞尔曲线使用实例

### 事先不知道曲线状态，需要实时计算时

天气预报气温变化的平滑折线图

### 显示状态会根据用户操作改变时

QQ小红点，仿真翻书效果

### 一些比较复杂的运动状态(配合PathMeasure使用)

复杂运动状态的动画效果

## 贝塞尔工具

- 贝塞尔在线模拟工具<br /><http://wx.karlew.com/canvas/bezier/>
- 贝塞尔曲线各种工具<br /><https://pomax.github.io/BezierInfo-2/>

## Ref

<https://blog.csdn.net/xiangzhihong8/article/details/78278931/>
