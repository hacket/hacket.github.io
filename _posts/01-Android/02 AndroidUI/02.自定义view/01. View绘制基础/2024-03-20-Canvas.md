---
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:52 晚上
title: Canvas
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Canvas(画布)]
linter-yaml-title-alias: Canvas(画布)
---

# Canvas(画布)

Canvas 是画布，我们通过 Canvas 的各种 drawXXX 方法将图形绘制到 Canvas 上面

## Canvas 基础

### 坐标系

Canvas 绘图中牵扯到两种坐标系：**Canvas 坐标系**与**绘图坐标系**

#### Canvas 坐标系/View 坐标系（不变，左上角）

Canvas 坐标系指的是 Canvas 本身的坐标系，Canvas 坐标系有且只有一个，且是唯一不变的，其坐标原点在 View 的左上角，从坐标原点向右为 x 轴的正半轴，从坐标原点向下为 y 轴的正半轴。

#### 绘图坐标系 (变化)

Canvas 的 drawXXX 方法中传入的各种坐标指的都是绘图坐标系中的坐标，而非 Canvas 坐标系中的坐标。默认情况下，绘图坐标系与 Canvas 坐标系完全重合，即初始状况下，绘图坐标系的坐标原点也在 View 的左上角，从原点向右为 x 轴正半轴，从原点向下为 y 轴正半轴。

但不同于 Canvas 坐标系，绘图坐标系并不是一成不变的，可以通过调用 Canvas 的 translate 方法平移坐标系，可以通过 Canvas 的 rotate 方法旋转坐标系，还可以通过 Canvas 的 scale 方法缩放坐标系，而且需要注意的是，`translate`、`rotate`、`scale` 的操作都是基于当前绘图坐标系的，而不是基于 Canvas 坐标系，一旦通过以上方法对坐标系进行了操作之后，当前绘图坐标系就变化了，以后绘图都是基于更新的绘图坐标系了。也就是说，真正对我们绘图有用的是绘图坐标系而非 Canvas 坐标系。

```java
private void drawAxis(Canvas canvas){
    int canvasWidth = canvas.getWidth();
    int canvasHeight = canvas.getHeight();
    paint.setStyle(Paint.Style.STROKE);
    paint.setStrokeCap(Paint.Cap.ROUND);
    paint.setStrokeWidth(6 * density);

    //用绿色画x轴，用蓝色画y轴

    //第一次绘制坐标轴
    paint.setColor(0xff00ff00);//绿色
    canvas.drawLine(0, 0, canvasWidth, 0, paint);//绘制x轴
    paint.setColor(0xff0000ff);//蓝色
    canvas.drawLine(0, 0, 0, canvasHeight, paint);//绘制y轴

    //对坐标系平移后，第二次绘制坐标轴
    canvas.translate(canvasWidth / 4, canvasWidth /4);//把坐标系向右下角平移
    paint.setColor(0xff00ff00);//绿色
    canvas.drawLine(0, 0, canvasWidth, 0, paint);//绘制x轴
    paint.setColor(0xff0000ff);//蓝色
    canvas.drawLine(0, 0, 0, canvasHeight, paint);//绘制y轴

    //再次平移坐标系并在此基础上旋转坐标系，第三次绘制坐标轴
    canvas.translate(canvasWidth / 4, canvasWidth / 4);//在上次平移的基础上再把坐标系向右下角平移
    canvas.rotate(30);//基于当前绘图坐标系的原点旋转坐标系
    paint.setColor(0xff00ff00);//绿色
    canvas.drawLine(0, 0, canvasWidth, 0, paint);//绘制x轴
    paint.setColor(0xff0000ff);//蓝色
    canvas.drawLine(0, 0, 0, canvasHeight, paint);//绘制y轴
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231564689-972a2864-7a17-46fa-881a-96430debec5e.png#averageHue=%23f3f3f3&clientId=ud2b4cc91-e1be-4&from=paste&height=581&id=u965f9cf2&originHeight=872&originWidth=495&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=31038&status=done&style=none&taskId=ud19484bd-4aa1-4dfe-aaa1-88588577ff1&title=&width=330)

> 1. 第一次绘制绘图坐标系时，绘图坐标系默认情况下和 Canvas 坐标系重合，所以绘制出的坐标系紧贴 View 的上侧和左侧；
> 2. 第二次首先将坐标轴向右下角平移了一段距离，然后绘制出的坐标系也就整体向右下角平移了；
> 3. 第三次再次向右下角平移，并旋转了 30 度，图上倾斜的坐标系即最后的绘图坐标系。

## Canvas.drawXXX

### 各种画图形、线、点、Path

#### drawColor([@ColorInt](/ColorInt) int color) / drawRGB 颜色填充

> 在整个绘制区域统一涂上指定的颜色；这类颜色填充方法一般用于在绘制之前设置底色，或者在绘制之后为界面设置半透明蒙版。

```java
drawColor(Color.BLACK);  // 纯黑
drawColor(Color.parse("#88880000"); // 半透明红色
```

类似的方法还有 `drawRGB(int r, int g, int b)` 和 `drawARGB(int a, int r, int g, int b)` ，它们和 drawColor(color) 只是使用方式不同，作用都是一样的。

```java
canvas.drawRGB(100, 200, 100);
canvas.drawARGB(100, 100, 200, 100);
```

#### drawCircle(float centerX, float centerY, float radius, Paint paint) 画圆

参数：

> 1. 前两个参数 centerX centerY 是圆心的坐标
> 2. 第三个参数 radius 是圆的半径，单位都是像素
> 3. 第四个参数 paint 它提供基本信息之外的所有风格信息，例如颜色、线条粗细、阴影等

```java
canvas.drawCircle(300, 300, 200, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231676945-d48a202f-309b-476d-a5fa-5ab922adbfbc.png#averageHue=%23929292&clientId=u05443c9c-f14a-4&from=paste&height=285&id=u278e5546&originHeight=428&originWidth=411&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=22889&status=done&style=none&taskId=u30843072-1d0d-4a6c-a03e-41e1f4893ac&title=&width=274)<br />![](http://note.youdao.com/yws/res/43009/D1A3BC5D469C4ECF8ACA4408D22F0B6A#id=rLY7Z&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### drawRect(float left, float top, float right, float bottom, Paint paint) 画矩形

参数：

> left, top, right, bottom 是矩形四条边的坐标；参数 rect 也是代表的坐标 (left,top) 左上角坐标 (right,bottom) 右下角坐标

```java
paint.setStyle(Style.FILL);
canvas.drawRect(100, 100, 500, 500, paint);
  
paint.setStyle(Style.STROKE);
canvas.drawRect(700, 100, 1100, 500, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231691855-8bf36f02-82c9-49f9-a73c-038c8485c310.png#averageHue=%23c7c7c7&clientId=u05443c9c-f14a-4&from=paste&height=170&id=u181ad61f&originHeight=255&originWidth=518&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=2638&status=done&style=none&taskId=u6d9a367a-355b-43ff-b2dc-c1bba459d78&title=&width=345.3333333333333)

```kotlin
canvas.drawRect(100F, 100F, 50F, 500F, paint)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231703999-07b8d2c4-a080-4984-9981-5ad5de6b6015.png#averageHue=%238ac4b9&clientId=u05443c9c-f14a-4&from=paste&height=485&id=u1a47bc0a&originHeight=727&originWidth=697&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4453&status=done&style=none&taskId=uf23bddfe-1e7a-4603-9c5d-4e7d441770f&title=&width=464.6666666666667)<br />还有两个重载方法 `drawRect(RectF rect, Paint paint)` 和 `drawRect(Rect rect, Paint paint)` ，让你可以直接填写 RectF 或 Rect 对象来绘制矩形。

```kotlin
canvas.drawRect(100F, 100F, 50F, 500F, paint)
canvas.drawRect(RectF(200F, 200F, 300F, 300F), paint)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231721257-41749362-3b8d-48c8-a826-1b5c10e0c5d3.png#averageHue=%2389c3b8&clientId=u05443c9c-f14a-4&from=paste&height=511&id=u984f4dda&originHeight=766&originWidth=614&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5332&status=done&style=none&taskId=u31edef13-6009-4150-a1ea-6d365fd8c11&title=&width=409.3333333333333)

#### drawRoundRect(float left, float top, float right, float bottom, float rx, float ry, Paint paint) 画圆角矩形

参数：

> left, top, right, bottom 是四条边的坐标，rx 和 ry 是圆角的横向半径和纵向半径。

```java
canvas.drawRoundRect(100, 100, 500, 300, 50, 50, paint);
```

![](http://note.youdao.com/yws/res/50264/589E30B7F93049859C610B3144A42AD0#id=LMVqm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231749055-87543652-0cdf-43e0-ad38-aa810de6f8e8.png#averageHue=%23bbbbbb&clientId=u05443c9c-f14a-4&from=paste&height=172&id=u5c684a3d&originHeight=258&originWidth=769&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=14641&status=done&style=none&taskId=u18fc943b-9302-4bdd-8cbe-7a7c5b4bf57&title=&width=512.6666666666666)<br />它还有一个重载方法 `drawRoundRect(RectF rect, float rx, float ry, Paint paint)`，让你可以直接填写 RectF 来绘制圆角矩形

#### drawArc(float left, float top, float right, float bottom, float startAngle, float sweepAngle, boolean useCenter, Paint paint) 绘制弧形或扇形

drawArc() 是使用一个椭圆来描述弧形的

1. left, top, right, bottom 描述的是这个弧形所在的椭圆
2. startAngle 是弧形的起始角度（x 轴的正向，即正右的方向，是 0 度的位置；顺时针为正角度，逆时针为负角度）
3. sweepAngle 是弧形划过的角度
4. useCenter 表示是否连接到圆心，如果不连接到圆心，就是弧形，如果连接到圆心，就是扇形。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231804703-276f7aed-9aa6-4504-8ed5-47ba809226b3.png#averageHue=%23bfbfbf&clientId=u05443c9c-f14a-4&from=paste&height=755&id=ubf8c25a5&originHeight=1132&originWidth=1479&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=69776&status=done&style=none&taskId=u3df9dd34-1eb0-4ac3-830d-35b287fb615&title=&width=986)

> 右边中间为 0° 方向，顺时针为正角度，逆时针负角度

#### drawOval(float left, float top, float right, float bottom, Paint paint) 画椭圆

只能绘制横着的或者竖着的椭圆，不能绘制斜的（斜的倒是也可以，但不是直接使用 drawOval()，而是配合几何变换）。left, top, right, bottom 是这个椭圆的左、上、右、下四个边界点的坐标。

```java
paint.setStyle(Style.FILL);
canvas.drawOval(50, 50, 350, 200, paint);

paint.setStyle(Style.STROKE);
canvas.drawOval(400, 50, 700, 200, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231834524-e3439f6c-69dd-481b-9223-332649cae3ee.png#averageHue=%23bbbbbb&clientId=u05443c9c-f14a-4&from=paste&height=141&id=u08a1ca9a&originHeight=212&originWidth=750&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=31266&status=done&style=none&taskId=u0823dd24-1791-43f8-afb9-e291331491f&title=&width=500)

> 重载方法 `drawOval(RectF rect, Paint paint)`，让你可以直接填写 RectF 来绘制椭圆

#### drawPoint(float x, float y, Paint paint) 画点

```
drawPoint(float x, float y, @NonNull Paint paint)
```

1. x 和 y 是点的坐标。
2. paint 点的大小可以通过 `paint.setStrokeWidth(width)` 来设置；点的形状可以通过 `paint.setStrokeCap(cap)` 来设置：ROUND 画出来是圆形的点，SQUARE 或 BUTT 画出来是方形的点。

```java
paint.setStrokeWidth(20);
paint.setStrokeCap(Paint.Cap.ROUND);
canvas.drawPoint(50, 50, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231869656-932c456d-1c8e-4ec1-a025-54946833ab19.png#averageHue=%23eeeeee&clientId=u05443c9c-f14a-4&from=paste&height=116&id=ua1b872c5&originHeight=174&originWidth=205&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=2946&status=done&style=none&taskId=u3ad1d9a1-42cc-4cfa-a3c3-34f09fca4ff&title=&width=136.66666666666666)

```java
paint.setStrokeWidth(20);
paint.setStrokeCap(Paint.Cap.SQUARE);
canvas.drawPoint(50, 50, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231876396-8576ba8d-fca6-405c-bab9-311e6e2cea55.png#averageHue=%23ededed&clientId=u05443c9c-f14a-4&from=paste&height=115&id=uefa639b7&originHeight=172&originWidth=219&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1183&status=done&style=none&taskId=u207da3b0-6e29-4d80-9ede-d8f0bd5b6de&title=&width=146)

> 有点像 FILL 模式下的 drawCircle() 和 drawRect() ？事实上确实是这样的，它们和 drawPoint() 的绘制效果没有区别

#### drawPoints(float[] pts, int offset, int count, Paint paint) / drawPoints(float[] pts, Paint paint) 画点（批量）

它和 drawPoint() 的区别是可以画多个点。

1. pts 这个数组是点的坐标，每两个成一对；
2. offset 表示跳过数组的前几个数再开始记坐标
3. count 表示一共要绘制几个点。说这么多你可能越读越晕

```java
float points = {0, 0, 50, 50, 50, 100, 100, 50, 100, 100, 150, 50, 150, 100};
// 绘制四个点：(50, 50) (50, 100) (100, 50) (100, 100)
canvas.drawPoints(points, 2 /* 跳过两个数，即前两个 0 */, 8 /* 一共绘制 8 个数（4 个点）*/, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231894150-2e3fbe54-e8c4-4ff2-8e6d-aa679b978554.png#averageHue=%23eaeaea&clientId=u05443c9c-f14a-4&from=paste&height=183&id=u2954e438&originHeight=274&originWidth=303&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=9829&status=done&style=none&taskId=u0f3bb348-f5dd-4f7b-85f6-3e68cd1a0c2&title=&width=202)![](http://note.youdao.com/yws/res/50235/BE8037D3CF6F46AEA69710AEA3F85399#id=P70cr&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### drawLine(float startX, float startY, float stopX, float stopY, Paint paint) 画线

startX, startY, stopX, stopY 分别是线的起点和终点坐标。

```java
canvas.drawLine(200, 200, 800, 500, paint);
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231906929-bd4b19c3-8907-4e26-a67f-86959ddfa5ff.png#averageHue=%23ebebeb&clientId=u05443c9c-f14a-4&from=paste&height=163&id=u39630dd6&originHeight=245&originWidth=332&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=13293&status=done&style=none&taskId=u120c4bc8-aa59-4d65-ab41-cfcc2e62717&title=&width=221.33333333333334)

> 由于直线不是封闭图形，所以 setStyle(style) 对直线没有影响。

#### drawLines(float[] pts, int offset, int count, Paint paint) / drawLines(float[] pts, Paint paint) 画线（批量）

drawLines() 是 drawLine() 的复数版。

```java
val points = floatArrayOf(20F, 20F, 120F, 20F, 70F, 20F, 70F, 120F, 20F, 120F, 120F,
            120F, 150F, 20F, 250F, 20F, 150F, 20F, 150F, 120F, 250F, 20F, 250F, 120F, 150F, 120F, 250F, 120F)
canvas.drawLines(points, paint)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688231926688-99a8c516-3f59-43fc-9902-a8b695a53975.png#averageHue=%23dbdbdb&clientId=u05443c9c-f14a-4&from=paste&height=166&id=u4815602c&originHeight=249&originWidth=485&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5142&status=done&style=none&taskId=u5e9e1eba-cc2a-4cc0-b65e-789ff105329&title=&width=323.3333333333333)

#### drawPath(Path path, Paint paint) 路径

> Canvas.drawPath 无效， paint 没有设置 paint.setStyle(Style.STROKE)

见 `Path` 章节

#### drawText(String text, float x, float y, Paint paint) 绘制文字

见 `绘制文字` 章节

#### drawPicture

#### drawBitmap  画 Bitmap

##### drawBitmap(Bitmap bitmap, float left, float top, Paint paint)

- left 和 top 是要把 bitmap 绘制到的位置坐标

重载方法:

```
drawBitmap(Bitmap bitmap, Rect src, RectF dst, Paint paint)
drawBitmap(Bitmap bitmap, Rect src, Rect dst, Paint paint)
drawBitmap(Bitmap bitmap, Matrix matrix, Paint paint)
```

> drawBitmap 还有一个兄弟方法 drawBitmapMesh()，可以绘制具有网格拉伸效果的 Bitmap。 drawBitmapMesh() 的使用场景较少。

##### drawBitmapMesh(Bitmap bitmap, int meshWidth, int meshHeight, float[] verts, int vertOffset, int[] colors, int colorOffset, Paint paint)

```
bitmap：需要扭曲的原位图
meshWidth/meshHeight：在横/纵向上把原位图划分为多少格
verts：长度为(meshWidth+1)*(meshHeight+2)的数组，他记录了扭曲后的位图各顶点(网格线交点)
位置，虽然他是一个一维数组，但是实际上它记录的数据是形如(x0,y0)，(x1,y1)..(xN,Yn)格式的数据，
这些数组元素控制对bitmap位图的扭曲效果
vertOffset：控制verts数组从第几个数组元素开始对bitmap进行扭曲(忽略verOffset之前数据
的扭曲效果)
```

```java
public class DrawBitmapMeshView extends View {

    //将水平和竖直方向上都划分为20格
    private final int WIDTH = 20;
    private final int HEIGHT = 20;
    private final int COUNT = (WIDTH + 1) * (HEIGHT + 1);  //记录该图片包含21*21个点
    private final float[] verts = new float[COUNT * 2];    //扭曲前21*21个点的坐标
    private final float[] orig = new float[COUNT * 2];    //扭曲后21*21个点的坐标
    private Bitmap mBitmap;
    private float bH, bW;


    public DrawBitmapMeshView(Context context) {
        this(context, null);
    }

    public DrawBitmapMeshView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public DrawBitmapMeshView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private void init() {
        mBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.iv_2);
        bH = mBitmap.getWidth();
        bW = mBitmap.getHeight();
        int index = 0;
        //初始化orig和verts数组。
        for (int y = 0; y <= HEIGHT; y++) {
            float fy = bH * y / HEIGHT;
            for (int x = 0; x <= WIDTH; x++) {
                float fx = bW * x / WIDTH;
                orig[index * 2 + 0] = verts[index * 2 + 0] = fx;
                orig[index * 2 + 1] = verts[index * 2 + 1] = fy;
                index += 1;
            }
        }
        //设置背景色
        setBackgroundColor(Color.WHITE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawBitmapMesh(mBitmap, WIDTH, HEIGHT, verts
                , 0, null, 0, null);
    }

    //工具方法，用于根据触摸事件的位置计算verts数组里各元素的值
    private void warp(float cx, float cy) {
        for (int i = 0; i < COUNT * 2; i += 2) {
            float dx = cx - orig[i + 0];
            float dy = cy - orig[i + 1];
            float dd = dx * dx + dy * dy;
            //计算每个座标点与当前点（cx、cy）之间的距离
            float d = (float) Math.sqrt(dd);
            //计算扭曲度，距离当前点（cx、cy）越远，扭曲度越小
            float pull = 80000 / ((float) (dd * d));
            //对verts数组（保存bitmap上21 * 21个点经过扭曲后的座标）重新赋值
            if (pull >= 1) {
                verts[i + 0] = cx;
                verts[i + 1] = cy;
            } else {
                //控制各顶点向触摸事件发生点偏移
                verts[i + 0] = orig[i + 0] + dx * pull;
                verts[i + 1] = orig[i + 1] + dy * pull;
            }
        }
        //通知View组件重绘
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        //调用warp方法根据触摸屏事件的座标点来扭曲verts数组
        warp(event.getX(), event.getY());
        return true;
    }

}
```

##### drawBitmap(Bitmap bitmap, Matrix matrix, Paint paint) Matrix 绘图

1. 缩放：postScale() <br />![](http://note.youdao.com/yws/res/51108/437B1A43D1194B3585593A271960201E#id=G46ks&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232051570-057f3f5d-4704-4b52-8910-3f3a97860c9d.png#averageHue=%23fcfaf9&clientId=u05443c9c-f14a-4&from=paste&id=u7b4b9a96&originHeight=152&originWidth=554&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua8e2df27-0d56-409b-855f-60222cc5b66&title=)<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232056685-e4cfd7ac-1910-43da-8e38-3ca7f3a0c979.png#averageHue=%23a19e9a&clientId=u05443c9c-f14a-4&from=paste&id=uccfa0c4d&originHeight=501&originWidth=282&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u10b06764-e9c8-4eb0-9ddd-603a4654bc3&title=)<br />![](http://note.youdao.com/yws/res/51110/65B879A6ED89457882F6D6B166C092D1#id=xfpRf&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
2. 平移：postTranslate() <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232062188-1f55e825-ea12-4e82-a1b8-ce811bc47f02.png#averageHue=%23fdfbf9&clientId=u05443c9c-f14a-4&from=paste&id=u811e08bd&originHeight=140&originWidth=670&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u07bbc3ef-d221-4a8a-84c1-b7bbea5b0a2&title=)<br />![](http://note.youdao.com/yws/res/51116/7C787AC267D6475B9E4E3C35D954F193#id=ND9sz&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232065659-d09795f2-1def-40f3-9927-15c8957fb827.png#averageHue=%23a7a5a4&clientId=u05443c9c-f14a-4&from=paste&id=u8dee284f&originHeight=492&originWidth=280&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub5ca3901-6f87-4307-80d7-acd44408649&title=)
3. 旋转：postRotate() <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232074620-3fd5e35d-8669-4bf6-93f8-6c958dd9d952.png#averageHue=%23fcfaf6&clientId=u05443c9c-f14a-4&from=paste&id=uc7e53eba&originHeight=153&originWidth=815&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u19a3915f-70e8-40cc-a9ce-22331a92482&title=)<br />![](http://note.youdao.com/yws/res/51121/53E5C0D5C9DD42F794BC737790BA86BA#id=oZZYh&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232079348-c4a533ef-f471-4bd0-b788-89e932aaa441.png#averageHue=%23b5b3b1&clientId=u05443c9c-f14a-4&from=paste&id=ud7d1f8c4&originHeight=520&originWidth=366&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u45d6686f-7781-4396-a8bf-63d14439eb8&title=)
4. 错切：postSkew() <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232089693-1c9b5d7c-dc8d-4e79-86d2-bf5a5ae26f8f.png#averageHue=%23fcfbf6&clientId=u05443c9c-f14a-4&from=paste&id=u8c531954&originHeight=165&originWidth=607&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5d7112a0-8afa-4b80-a22a-3896bf013d6&title=)<br />![](http://note.youdao.com/yws/res/51127/FB4A6205C1CC4468A7291486FFE31555#id=Uchyl&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232094286-3722ed10-4f25-4ab1-b7bf-496fb1e44750.png#averageHue=%23c2c0bf&clientId=u05443c9c-f14a-4&from=paste&id=u871d6f2e&originHeight=394&originWidth=437&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u79c7de8e-95c5-45d0-8e3a-86a79101155&title=)
5. 关于 x 轴对称：setValuses(values values) <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232099405-fb81e39f-14fc-4a71-b8dd-82c20ee681af.png#averageHue=%23fbf9f4&clientId=u05443c9c-f14a-4&from=paste&id=u6779dc8a&originHeight=180&originWidth=664&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5be273b1-fd92-47d3-ae24-6e3b8c25f26&title=)<br />![](http://note.youdao.com/yws/res/51133/C553A4A6541D4BBE8DB07D821D7E4726#id=coDwV&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232106443-060c049a-5843-458a-b7c2-b69a70808c8c.png#averageHue=%23a8a6a5&clientId=u05443c9c-f14a-4&from=paste&id=ud27aa75b&originHeight=493&originWidth=288&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u87a4347c-c5c2-44d9-b745-ad64eb57caf&title=)
6. 关于 y 轴对称：setValuses(values values) <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232119107-330d4b75-c913-4ddb-ac8a-bc50c60fa58e.png#averageHue=%23fbf9f4&clientId=u05443c9c-f14a-4&from=paste&id=uafc8657e&originHeight=179&originWidth=715&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1c856720-a1c9-4a19-bb93-ed4b2daabc2&title=)<br />![](http://note.youdao.com/yws/res/51139/BEF9911F77394EFF94ED083AFEBA97FC#id=zkUcs&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232125069-c47c0cbe-517a-4d31-a582-9604eb75f9a1.png#averageHue=%23b6b3b1&clientId=u05443c9c-f14a-4&from=paste&id=ub49d27cd&originHeight=557&originWidth=345&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ucaa45ae4-916f-41b3-8672-20b3a25e047&title=)

## 范围裁剪

范围裁切有两个方法： `clipRect()` 和 `clipPath()`。裁切方法之后的绘制代码，都会被限制在裁切范围内。

在 Android 上是对 canvas（画布）上进行 clip 的，要在画图之前对 canvas 进行 clip，如果画图之后再对 canvas 进行 clip 不会影响到已经画好的图形。一定要记住 clip 是针对 canvas 而非图形。

### boolean clipRect(Rect rect)

rect 表示距离左上角的坐标。使用的 OP 参数是 `Region.Op.INTERSECT`

```java
public boolean clipRect(float left, float top, float right, float bottom)
public boolean clipRect(int left, int top, int right, int bottom)
public boolean clipRect(@NonNull Rect rect)
public boolean clipRect(@NonNull RectF rect)
```

```kotlin
private fun clipRect(canvas: Canvas) {
    canvas.save()
    val left = 10F.dp()
    val top = 15F.dp()
    val right = left + 100F.dp()
    val bottom = top + 50F.dp()
    canvas.clipRect(left, top, right, bottom)
    val x = 0f
    val y = 0f
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232147694-c588fbc9-4f3d-46ab-ad34-6827b9f23727.png#averageHue=%23a2aba4&clientId=u05443c9c-f14a-4&from=paste&id=u384ce626&originHeight=834&originWidth=1054&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u34612c44-66a6-41ca-bc3c-22a7e83856d&title=)

> 记得要加上 Canvas.save() 和 Canvas.restore() 来及时恢复绘制范围

##### boolean clipRect(float left, float top, float right, float bottom, Region.Op op) 过时

```java
public enum Op {
    // A: 为我们先裁剪的区域
    // B: 为我们后裁剪的区域

    // A形状中不同于B的部分显示出来
    DIFFERENCE(0),
    // A和B交集的形状
    INTERSECT(1),
    // A和B的全集
    UNION(2),
    // A和B的全集形状，去除交集形状之后的部分
    XOR(3),
    // B形状中不同于A的部分显示出来
    REVERSE_DIFFERENCE(4),
    // 只显示B的形状
    REPLACE(5);
	// ...省略不相关代码
}
```

> AndroidP 后，OP 参数只有 `Region.Op#INTERSECT` 和 `Region.Op#DIFFERENC` 可用

#### boolean clipPath(Path path)

和 clipRect() 用法完全一样，只是把参数换成了 Path ，所以能裁切的形状更多一些；只留下 path 内 的画布区域，而处于 path 范围之外的则不显示。<br />使用的 OP 参数是 `Region.Op.INTERSECT`

```kotlin
private fun clippath(canvas: Canvas) {
    val x = 0f
    val y = 0f

    canvas.save()
    val path1 = Path()
    path1.addCircle(100F, 100F, 50F, Path.Direction.CCW)
    val clipPathB1 = canvas.clipPath(path1)
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()

    canvas.save()
    val path2 = Path()
    path2.moveTo(50F.dp(), 50F.dp())
    path2.lineTo(50F.dp(), 100F.dp())
    path2.lineTo(width.toFloat(), height.toFloat())
    path2.close()
    val clipPathB2 = canvas.clipPath(path2)
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232178640-768034ff-72bf-45d8-93a9-cbb0744a1e95.png#averageHue=%23bbd6ef&clientId=u05443c9c-f14a-4&from=paste&id=ub3e065ec&originHeight=290&originWidth=458&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua2be09e9-652c-42e1-b2e5-e356562beb6&title=)

#### public boolean clipPath([@NonNull](/NonNull) Path path, [@NonNull](/NonNull) Region.Op op) 过时了

同 `clicpRect OP`

### boolean clipOutRect(Rect rect) / clipOutPath  rect 和 path 外显示， AndroidO(API26) 可用

```
public boolean clipOutPath(@NonNull Path path) // 值得注意的是，该方法只能在API26版本以上调用
```

只留下 path 外 的画布区域，而处于 path 范围之内的则不显示。（与 clipPath 的作用范围正好相反）

低版本使用：

```java
clipRect(rect, Region.Op.DIFFERENCE)
clipPath(mPath, Region.Op.DIFFERENCE)
```

```kotlin
private fun clipOutPath(canvas: Canvas) {
    canvas.save()
    val left = 10F.dp()
    val top = 15F.dp()
    val right = left + 100F.dp()
    val bottom = top + 50F.dp()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        canvas.clipOutRect(left, top, right, bottom)
    } else {
        canvas.clipRect(left, top, right, bottom, Region.Op.DIFFERENCE)
    }
    val x = 0f
    val y = 0f
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}
```

### clipRegion 过时

## Canvas Layer Canvas 图层

Canvas 画布的操作是不可逆的，而且很多 Canvas 画布操作会影响后续的步骤，所以会对 Canvas 画布的一些状态进行保存和回滚。

### 画布和图层

画布是由多个图层构成:

![](https://note.youdao.com/src/7DFCD16021A1464B9209CFE9EFBF7C47#id=iNFW2&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

绘制操作和画布操作都是在默认图层上进行的，在通常情况下，使用默认图层就可满足需求，但是如果需要绘制比较复杂的内容，如地图 (地图可以有多个地图层叠加而成，比如：政区层，道路层，兴趣点层) 等，则分图层绘制比较好一些。<br />你可以把这些图层看做是一层一层的玻璃板，你在每层的玻璃板上绘制内容，然后把这些玻璃板叠在一起看就是最终效果。

### SaveFlags

![](https://note.youdao.com/src/4B6743836AA641BBA5439DB018C675D3#id=hnjax&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 相关的 API

| 相关 API          | 介绍                                                                                      |
| -------------- | --------------------------------------------------------------------------------------- |
| save           | 把当前的画布的状态进行保存，然后放入特定的栈中，save() 方法之后的代码，可以调用 Canvas 的平移、放缩、旋转、裁剪等操作；返回值传给 restoreToCount 恢复状态 |
| saveLayerXxx   | 新建一个图层，并放入特定的栈中                                                                         |
| restore        | 把栈中最顶层的画布状态取出来，并按照这个状态恢复当前的画布                                                           |
| restoreToCount | 弹出指定位置及其以上所有的状态，并按照指定位置的状态进行恢复，参数为 save() 的返回值                                            |
| getSaveCount   | 获取栈中内容的数量 (即保存次数)                                                                        |

这个栈可以存储画布状态和图层状态：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232231789-59c552ac-6e87-4534-ba3e-6c66d4de6912.png#averageHue=%23eceaea&clientId=u05443c9c-f14a-4&from=paste&id=u798677d7&originHeight=500&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u64e805d6-9277-4381-a36f-2bf4d03a1cd&title=)<br />![](http://note.youdao.com/yws/res/51184/B6E5CD15BE9A4941833AFC9266AC1A68#id=Dn4ta&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### save

```java
// 保存全部状态
public int save ()

// 根据saveFlags参数保存一部分状态
public int save (int saveFlags)
```

第二种方法比第一种多了一个 saveFlags 参数，使用这个参数可以只保存一部分状态，更加灵活，这个 saveFlags 参数具体可参考上面表格中的内容。

每调用一次 save 方法，都会在栈顶添加一条状态信息。

#### saveLayerXxx

```java
// 无图层alpha(不透明度)通道
public int saveLayer (RectF bounds, Paint paint)
public int saveLayer (RectF bounds, Paint paint, int saveFlags)
public int saveLayer (float left, float top, float right, float bottom, Paint paint)
public int saveLayer (float left, float top, float right, float bottom, Paint paint, int saveFlags)

// 有图层alpha(不透明度)通道
public int saveLayerAlpha (RectF bounds, int alpha)
public int saveLayerAlpha (RectF bounds, int alpha, int saveFlags)
public int saveLayerAlpha (float left, float top, float right, float bottom, int alpha)
public int saveLayerAlpha (float left, float top, float right, float bottom, int alpha, int saveFlags)
```

> saveLayerXxx 方法会让你花费更多的时间去渲染图像 (图层多了相互之间叠加会导致计算量成倍增长)，使用前请谨慎，如果可能，尽量避免使用。

使用 saveLayerXxx 方法，也会将图层状态也放入状态栈中，同样使用 restore 方法进行恢复。

#### restore

状态回滚，就是从栈顶取出一个状态然后根据内容进行恢复。

同样以上面状态栈图片为例，调用一次 restore 方法则将状态栈中第 5 次取出，根据里面保存的状态进行状态恢复。

#### restoreToCount

弹出指定位置以及以上所有状态，并根据指定位置状态进行恢复。

以上面状态栈图片为例，如果调用 restoreToCount(2) 则会弹出 2 3 4 5 的状态，并根据第 2 次保存的状态进行恢复。

#### getSaveCount

获取保存的次数，即状态栈中保存状态的数量，以上面状态栈图片为例，使用该函数的返回值为 5。

不过请注意，该函数的最小返回值为 1，即使弹出了所有的状态，返回值依旧为 1，代表默认状态。

### 常用格式

```java
save();      //保存状态
// ...          //具体操作
restore();   //回滚到之前的状态
```

## Ref

- [x] <https://hencoder.com/ui-1-1/>
- [x] Android 中 Canvas 绘图基础详解<br /><https://blog.csdn.net/iispring/article/details/49770651>

# Canvas 几何变换操作 (二维、三维)

几何变换的使用大概分为三类：

1. 使用 Canvas 来做常见的二维变换；
2. 使用 Matrix 来做常见和不常见的二维变换；
3. 使用 Camera 来做三维变换

> 所有的 Canvas 操作都只影响后续的绘制，对之前已经绘制过的内容没有影响

Canvas 多重变换要倒序？

> 还没试验

## 常见的二维变换

### Canvas.translate(float dx, float dy) 平移

参数里的 dx 和 dy 表示横向和纵向的位移 (正数 x 向右 y 向下，负数 x 向左 y 向上)。位移是基于当前位置移动，而不是每次基于屏幕左上角的 (0,0) 点移动

```java
// 省略了创建画笔的代码

// 在坐标原点绘制一个黑色圆形
mPaint.setColor(Color.BLACK);
canvas.translate(200,200);
canvas.drawCircle(0,0,100,mPaint);

// 在坐标原点绘制一个蓝色圆形
mPaint.setColor(Color.BLUE);
canvas.translate(200,200);
canvas.drawCircle(0,0,100,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232807000-cb044d32-7dab-433a-816c-d297ce56352b.png#averageHue=%23f6f6f6&clientId=u05443c9c-f14a-4&from=paste&id=u74b398fd&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u93e217e7-f326-4f39-8b81-5e613a5bc5f&title=)![](http://note.youdao.com/yws/res/50962/B7C9BC8F7A564D16A1EA4AA1A0D24C19#id=j4fx3&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Canvas.rotate 旋转

- rotate(float degrees) 默认是以原点作为基准点旋转
- rotate(float degrees, float px, float py) 参数里的 degrees 是旋转角度，单位是度（也就是一周有 360° 的那个单位），方向是顺时针为正向； px 和 py 是轴心的位置（以传入的 x,y 作为基准点）。

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,-400,400,0);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.rotate(180);                     // 旋转180度 <-- 默认旋转中心为原点

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232821209-5f9c8a66-7b6b-4627-ab8d-2890d20d20e9.png#averageHue=%23faf9f9&clientId=u05443c9c-f14a-4&from=paste&id=ua414a1ec&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u94944d04-d392-4f3f-9812-2e3ada651a9&title=)

### Canvas.scale 缩放

- scale(float sx, float sy) 缩放控制中心 (0, 0)x 和 y 轴缩放
- scale(float sx, float sy, float px, float py)  缩放控制中心 (px, py)x 和 y 轴缩放

这两个方法中前两个参数是相同的分别为 x 轴和 y 轴的缩放比例。而第二种方法比前一种多了两个参数，用来控制缩放中心位置的。

缩放比例 (sx,sy) 取值范围详解：<br />![](http://note.youdao.com/yws/res/50973/266A80D559864589963C2079CD2D8F89#id=NMmRm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232836517-b05add10-98a0-42cc-90b7-33d56d883ac8.png#averageHue=%23faf9f8&clientId=u05443c9c-f14a-4&from=paste&id=u21073630&originHeight=610&originWidth=1906&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u2bdc4c1c-091d-4a36-9725-7f91841a4fe&title=)

1. n>=1，根据缩放中心放大 n 倍
2. 0<n<1，根据缩放中心缩放 n 倍
3. n=0，不会显示
4. -1<n<0，根据缩放中心缩小 n 倍，再根据中心轴 x 或 y 进行翻转
5. n<=-1，根据缩放中心放大 n 倍，再根据中心轴 x 或 y 进行翻转

> 中心轴，指的是以缩放中心为原点的坐标轴，水平 x 轴，竖直 y 轴

#### scale 案例

1. x 和 y 都缩放 2 倍

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,-400,400,0);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.scale(0.5f,0.5f);                // 画布缩放

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232852048-8191fa03-4510-4ee1-b6cd-1daa15b286c8.png#averageHue=%23f9f9f9&clientId=u05443c9c-f14a-4&from=paste&id=ub1da1852&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u343327fa-8b90-4115-9dd7-7ebfba5c437&title=)<br />![](http://note.youdao.com/yws/res/50989/EAA13C8571B94E83ADF2501B186893A0#id=mJDnH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

2. 让缩放中心位置稍微改变一下

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,-400,400,0);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.scale(0.5f,0.5f,200,0);          // 画布缩放  <-- 缩放中心向右偏移了200个单位

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232858823-40682d16-1b29-422c-a455-b55f6727f106.png#averageHue=%23f9f9f9&clientId=u05443c9c-f14a-4&from=paste&id=u0fc1b776&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u36794ecc-8b8d-4c9e-b593-e6412173447&title=)<br />![](http://note.youdao.com/yws/res/50995/E4E28519BBAB4EDE8CDDDCDADF9B48AE#id=Ts28b&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

3. 当缩放比例为负数的时候会根据缩放中心轴进行翻转

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,-400,400,0);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.scale(-0.5f,-0.5f);          // 画布缩放

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232865281-306d9e67-4267-4935-b335-62d645be4321.png#averageHue=%23f9f8f8&clientId=u05443c9c-f14a-4&from=paste&id=ucdfe2c2c&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5e262a4f-b7e1-40b9-abd2-fc8da22086c&title=)<br />![](http://note.youdao.com/yws/res/50999/7C9A3CCF4F324D35BD1158E922BCCB9B#id=c1qXh&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

4. 坐标点非默认点 (原点 0,0)，缩放再翻转

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,-400,400,0);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.scale(-0.5f,-0.5f,200,0);          // 画布缩放  <-- 缩放中心向右偏移了200个单位

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232870572-30970d6c-00bc-434d-a083-b2dd5e70823f.png#averageHue=%23f3e2da&clientId=u05443c9c-f14a-4&from=paste&id=u64ec450a&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u450a1879-7193-4ff0-95c0-c8588b66a47&title=)<br />![](http://note.youdao.com/yws/res/51004/24E5FCD59B854F1F8F7FB8C9D0105DCC#id=RppEH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Canvas.skew(float sx, float sy) 错切

参数里的 sx 和 sy 是 x 方向和 y 方向的错切系数。

- float sx: 将画布在 x 方向上倾斜相应的角度，sx 为倾斜角度的 tan 值；
- float sy: 将画布在 y 轴方向上倾斜相应的角度，sy 为倾斜角度的 tan 值；<br />变换后:

```
X = x + sx * y
Y = sy * x + y
```

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,0,200,200);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.skew(1,0);                       // 水平错切 <- 45度

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232879355-95f49cd1-1089-482a-897d-d4dc97660096.png#averageHue=%23faf9f9&clientId=u05443c9c-f14a-4&from=paste&id=u602df6bd&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u421a6047-bc61-43a6-ba41-d4c403dca9d&title=)

> 注意，这里全是倾斜角度的 tan 值，比如我们打算在 X 轴方向上倾斜 45 度，tan45=1；

叠加:

```java
// 将坐标系原点移动到画布正中心
canvas.translate(mWidth / 2, mHeight / 2);

RectF rect = new RectF(0,0,200,200);   // 矩形区域

mPaint.setColor(Color.BLACK);           // 绘制黑色矩形
canvas.drawRect(rect,mPaint);

canvas.skew(1,0);                       // 水平错切
canvas.skew(0,1);                       // 垂直错切

mPaint.setColor(Color.BLUE);            // 绘制蓝色矩形
canvas.drawRect(rect,mPaint);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232891629-ddf9cebf-898b-4685-ada8-5006892feaf0.png#averageHue=%23fafafa&clientId=u05443c9c-f14a-4&from=paste&id=u658791c0&originHeight=533&originWidth=300&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9ccee7b2-5ae7-47ba-a83b-4762b41e28b&title=)<br />![](http://note.youdao.com/yws/res/51020/4254482D4360481DB4E94CD127D5820F#id=bQhqH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 使用 Matrix 来做变换

把 Matrix 应用到 Canvas 有两个方法： Canvas.setMatrix(matrix) 和 Canvas.concat(matrix)。

1. Canvas.setMatrix(matrix)：用 Matrix 直接替换 Canvas 当前的变换矩阵，即抛弃 Canvas 当前的变换，改用 Matrix 的变换（注：根据下面评论里以及我在微信公众号中收到的反馈，不同的系统中 setMatrix(matrix) 的行为可能不一致，所以还是尽量用 concat(matrix) 吧）；
2. Canvas.concat(matrix)：用 Canvas 当前的变换矩阵和 Matrix 相乘，即基于 Canvas 当前的变换，叠加上 Matrix 中的变换。

### 使用 Matrix 来做常见变换 postTranslate/postRotate/postScale/postSkew

```kotlin
private fun drawMatrix_postSkew(canvas: Canvas) {
    val dx = dx / width
    val dy = dy / height
    myMatrix.reset()
    myMatrix.postSkew(dx, dy)
    canvas.save()
    canvas.concat(myMatrix)
    val x = width / 2F - bitmap.width / 2F
    val y = height / 2F - bitmap.height / 2F
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}

private fun drawMatrix_postScale(canvas: Canvas) {
    val pivotX = width / 2F
    val pivotY = height / 2F
    myMatrix.reset()
    myMatrix.postScale(dx / width.toFloat(), dy / height.toFloat(), pivotX, pivotY)
    canvas.save()
    canvas.concat(myMatrix)
    val x = width / 2F - bitmap.width / 2F
    val y = height / 2F - bitmap.height / 2F
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}

private fun drawMatrix_postTranslate(canvas: Canvas) {
    myMatrix.reset()
    myMatrix.postTranslate(dx, dy)
    canvas.save()
    canvas.concat(myMatrix)
    val x = width / 2F - bitmap.width / 2F
    val y = height / 2F - bitmap.height / 2F
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}

private fun drawMatrix_postRotate(canvas: Canvas, pivotX: Float = 0F, pivotY: Float = 0F) {
    myMatrix.reset()
    val degrees = dx
    myMatrix.postRotate(degrees, pivotX, pivotY)
    canvas.save()
    canvas.concat(myMatrix)
    val x = width / 2F - bitmap.width / 2F
    val y = height / 2F - bitmap.height / 2F
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()

    canvas.drawDot(pivotX, pivotY)
}
```

### 使用 Matrix 来做自定义变换 setPolyToPoly 各个点的变化，最多 4 个

- boolean setPolyToPoly(float[] src, int srcIndex, float[] dst, int dstIndex, int pointCount)<br />参数：

```
src代表变换前的坐标
dst代表变换后的坐标
从src到dst的变换，可以通过srcIndex和dstIndex来制定第一个变换的点，一般可能都设置位0
pointCount代表支持的转换坐标的点数，最多支持4个（取值范围是: 0到4）。其实也就是你定义的float[] src这个数组除以2的数字。也可以这么理解：
0 相当于reset
1 相当于translate
2 可以进行 缩放、旋转、平移 变换
3 可以进行 缩放、旋转、平移、错切 变换
4 可以进行 缩放、旋转、平移、错切以及任何形变
```

案例：

```java
private fun drawMatrix_setPolyToPoly(canvas: Canvas) {
    val bitmap = BitmapFactory.decodeResource(resources, R.drawable.iv_0)
    val left = width / 2F - bitmap.width / 2F
    val top = height / 2F - bitmap.height / 2F
    val right = left + bitmap.width
    val bottom = top + bitmap.height
    val pointsSrc = floatArrayOf(
            left, top,
            right, top,
            left, bottom,
            right, bottom)
    val pointsDst = floatArrayOf(
            left - 10F.dp(), top + 50F.dp(),
            right + 120F.dp(), top - 90F.dp(),
            left + 20F.dp(), bottom + 30F.dp(),
            right + 20F.dp(), bottom + 60F.dp())

    myMatrix.reset()
    myMatrix.setPolyToPoly(pointsSrc, 0, pointsDst, 0, pointsSrc.size shr 1) // 一般是除以2
    canvas.save()
    canvas.concat(myMatrix)
    val x = width / 2F - bitmap.width / 2F
    val y = height / 2F - bitmap.height / 2F
    canvas.drawBitmap(bitmap, x, y, paint)
    canvas.restore()
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232905225-f13a8581-8aa1-41ce-ae26-4be5b30102c3.png#averageHue=%23c0d9f1&clientId=u05443c9c-f14a-4&from=paste&id=u3c9c45d6&originHeight=490&originWidth=496&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uacf736c9-9e39-4683-b21c-ff9bb96f3ce&title=)<br />![](http://note.youdao.com/yws/res/51060/9CE17EB76573452AA7DAC681298A6A72#id=S2LrP&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### setPolyToPoly 实现折叠效果

- [ ] Android FoldingLayout 折叠布局 原理及实现 <https://blog.csdn.net/lmj623565791/article/details/44278417>

## 使用 Camera 来做三维变换 （还未完全懂，用的时候重新学习）

Camera 的三维变换有三类：旋转、平移、移动相机。

- <https://blog.csdn.net/ITermeng/article/details/78845398>
- <https://juejin.cn/post/6844903619762864142>

### Camera.rotate*() 三维旋转

Camera.rotate*() 一共有四个方法： rotateX(deg) rotateY(deg) rotateZ(deg) rotate(x, y, z)

Camera 和 Canvas 一样也需要保存和恢复状态才能正常绘制，不然在界面刷新之后绘制就会出现问题。

```java
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    canvas.save();
    camera.save();
    camera.rotateX(30);
    camera.applyToCanvas(canvas);
    camera.restore();
    canvas.drawBitmap(bitmap, point1.x, point1.y, paint);
    canvas.restore();

    canvas.save();
    camera.save();
    camera.rotateY(30);
    camera.applyToCanvas(canvas);
    camera.restore();
    canvas.drawBitmap(bitmap, point2.x, point2.y, paint);
    canvas.restore();
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232916411-88dfdf6f-da2f-4410-92e1-478efa3bcfcc.png#averageHue=%23da8350&clientId=u05443c9c-f14a-4&from=paste&id=u2dfd653b&originHeight=462&originWidth=842&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u716c76d3-3738-49e1-bf8a-6371d784d5e&title=)<br />![](http://note.youdao.com/yws/res/51078/325E6C3BA9FE43A48FE7915241868DBD#id=SrBxH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Camera.translate(float x, float y, float z) 移动

```java
canvas.save()

camera.save()
camera.translate(0F.dp(), dy, z) // 旋转 Camera 的三维空间
camera.applyToCanvas(canvas) // 把旋转投影到 Canvas
camera.restore()

val xx = width / 2F - bitmap.width / 2F
val yy = height / 2F - bitmap.height / 2F
canvas.drawBitmap(bitmap, xx, yy, paint)
canvas.restore()
```

### Camera.setLocation(x, y, z) 设置虚拟相机的位置

> 注意！这个方法有点奇葩，它的参数的单位不是像素，而是 inch，英寸。

这种设计源自 Android 底层的图像引擎 Skia 。在 Skia 中，Camera 的位置单位是英寸，英寸和像素的换算单位在 Skia 中被写死为了 72 像素，而 Android 中把这个换算单位照搬了过来。

在 Camera 中，相机的默认位置是 (0, 0, -8)（英寸）。8 x 72 = 576，所以它的默认位置是 (0, 0, -576)（像素）。

如果绘制的内容过大，当它翻转起来的时候，就有可能出现图像投影过大的「糊脸」效果。而且由于换算单位被写死成了 72 像素，而不是和设备 dpi 相关的，所以在像素越大的手机上，这种「糊脸」效果会越明显。

而使用 setLocation() 方法来把相机往后移动，就可以修复这种问题。

```java
camera.setLocation(0, 0, newZ);
```

Camera.setLocation(x, y, z) 的 x 和 y 参数一般不会改变，直接填 0 就好。

### Canvas Camera 实现翻页效果

```java
public class Sample14FlipboardView extends View {
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    Bitmap bitmap;
    Camera camera = new Camera();
    int degree;
    ObjectAnimator animator = ObjectAnimator.ofInt(this, "degree", 0, 180);

    public Sample14FlipboardView(Context context) {
        super(context);
    }

    public Sample14FlipboardView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public Sample14FlipboardView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    {
        bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.maps);

        animator.setDuration(2500);
        animator.setInterpolator(new LinearInterpolator());
        animator.setRepeatCount(ValueAnimator.INFINITE);
        animator.setRepeatMode(ValueAnimator.REVERSE);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        animator.start();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        animator.end();
    }

    @SuppressWarnings("unused")
    public void setDegree(int degree) {
        this.degree = degree;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        int bitmapWidth = bitmap.getWidth();
        int bitmapHeight = bitmap.getHeight();
        int centerX = getWidth() / 2;
        int centerY = getHeight() / 2;
        int x = centerX - bitmapWidth / 2;
        int y = centerY - bitmapHeight / 2;

        // 第一遍绘制：上半部分
        canvas.save();
        canvas.clipRect(0, 0, getWidth(), centerY);
        canvas.drawBitmap(bitmap, x, y, paint);
        canvas.restore();

        // 第二遍绘制：下半部分
        canvas.save();

        if (degree < 90) {
            canvas.clipRect(0, centerY, getWidth(), getHeight());
        } else {
            canvas.clipRect(0, 0, getWidth(), centerY);
        }
        camera.save();
        camera.rotateX(degree);
        canvas.translate(centerX, centerY);
        camera.applyToCanvas(canvas);
        canvas.translate(-centerX, -centerY);
        camera.restore();

        canvas.drawBitmap(bitmap, x, y, paint);
        canvas.restore();
    }
}
```

## Ref

- [x] HenCoder Android 开发进阶：自定义 View 1-4 Canvas 对绘制的辅助 clipXXX() 和 Matrix<br /><https://rengwuxian.com/108.html>
- [x] <https://www.gcssloop.com/customview/Canvas_Convert>

# Bitmap 上绘制东西（文字、图形等）

## Bitmap 上绘制文字

```kotlin
btn_draw_text_on_bitmap.setOnClickListener {
    val paint = Paint()
    paint.isAntiAlias = true
    paint.isDither = true
    paint.textSize = 14F.dp()
    paint.color = Color.RED

    val bitmap = BitmapFactory.decodeResource(resources, R.drawable.iv_0)

    val mutableBitmap = bitmap.copy(bitmap.config, true)
    val canvas = Canvas(mutableBitmap)

    val x = mutableBitmap.width / 2 - paint.measureText(TEXT) / 2
    val y = mutableBitmap.height / 2 - (paint.descent() + paint.ascent()) / 2
    canvas.drawText(TEXT, x, y, paint)

    iv_draw_text_on_bitmap.setImageBitmap(mutableBitmap)
}

btn_static_layout_text_on_bitmap.setOnClickListener {
    val paint = TextPaint()
    paint.isAntiAlias = true
    paint.isDither = true
    paint.textSize = 14F.dp()
    paint.color = Color.RED

    val bitmap = BitmapFactory.decodeResource(resources, R.drawable.iv_0)

    val mutableBitmap = bitmap.copy(bitmap.config, true)
    val canvas = Canvas(mutableBitmap)

    val mStaticLayout = StaticLayout(TEXT, paint, canvas.width, Layout.Alignment.ALIGN_NORMAL, 1.0f, 0.0f, false)
    mStaticLayout.draw(canvas)

    val rectBounds = Rect()
    paint.getTextBounds(TEXT, 0, TEXT.length, rectBounds)

    val rectWidth = rectBounds.width()
    val rectHeight = rectBounds.height()

    val textWidth = mStaticLayout.width
    val textHeight = mStaticLayout.height

    tv_static_layout_text_on_bitmap.text = "StaticLayout文本宽高=(${textWidth},${textHeight})，getTextBounds宽高=(${rectWidth},${rectHeight})，行数=${mStaticLayout.lineCount}，bitmap高度=${mutableBitmap.height}"
    iv_static_layout_text_on_bitmap.setImageBitmap(mutableBitmap)
}

btn_static_layout_center_text_on_bitmap.setOnClickListener {
    val paint = TextPaint()
    paint.isAntiAlias = true
    paint.isDither = true
    paint.textSize = 14F.dp()
    paint.color = Color.RED

    val bitmap = BitmapFactory.decodeResource(resources, R.drawable.iv_0)

    val mutableBitmap = bitmap.copy(bitmap.config, true)

    val canvas = Canvas(mutableBitmap)
    val mStaticLayout = StaticLayout(TEXT, paint, canvas.width, Layout.Alignment.ALIGN_NORMAL, 1.0f, 0.0f, false)

    val dy = mutableBitmap.height / 2 - mStaticLayout.height / 2
    canvas.save()
    canvas.translate(0F, dy.toFloat())
    mStaticLayout.draw(canvas)
    canvas.restore()

    iv_static_layout_tex_centert_on_bitmap.setImageBitmap(mutableBitmap)
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688232969370-a145b82e-9adf-42bc-9b2b-c2d03307d4fc.png#averageHue=%23c6be8a&clientId=u05443c9c-f14a-4&from=paste&height=729&id=u0e08da99&originHeight=2400&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubb186829-9398-4719-be57-1fffef1b25f&title=&width=328)

## 获取 View 的 Bitmap

### 通过 canvas 复制 view 的 bitmap

```kotlin
fun getBitmapByCanvas(view: View): Bitmap {
    var width = view.width
    var height = view.height
    if (width == 0 || height == 0) {
        view.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED))
        width = view.measuredWidth
        height = view.measuredHeight
    }
    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    canvas.translate(-view.scrollX.toFloat(), -view.scrollY.toFloat())//我们在用滑动View获得它的Bitmap时候，获得的是整个View的区域（包括隐藏的），如果想得到当前区域，需要重新定位到当前可显示的区域
//        canvas.scale(0.5F,0.5F)
    view.draw(canvas)
    return bitmap
}
```

### drawingCache 过期

```kotlin
fun getBitmapFromDrawingCache(view: View): Bitmap {
    view.isDrawingCacheEnabled = true
    view.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED))
    val bitmap = Bitmap.createBitmap(view.drawingCache)
    // 如果不调用这个方法，每次生成的bitmap相同
    view.isDrawingCacheEnabled = false;
    return bitmap
}
```

### [QMUIDrawableHelper](https://github.com/Tencent/QMUI_Android/blob/master/qmui/src/main/java/com/qmuiteam/qmui/util/QMUIDrawableHelper.java)

```java
public class QMUIDrawableHelper {

    private static final String TAG = QMUIDrawableHelper.class.getSimpleName();

    // 节省每次创建时产生的开销，但要注意多线程操作synchronized
    private static final Canvas sCanvas = new Canvas();

    /**
     * 从一个view创建Bitmap。 注意点：绘制之前要清掉 View 的焦点，因为焦点可能会改变一个 View 的 UI 状态。
     * 来源：https://github.com/tyrantgit/ExplosionField
     *
     * @param view  传入一个 View，会获取这个 View 的内容创建 Bitmap。
     * @param scale 缩放比例，对创建的 Bitmap 进行缩放，数值支持从 0 到 1。
     */
    public static Bitmap createBitmapFromView(View view, float scale) {
        if (view instanceof ImageView) {
            Drawable drawable = ((ImageView) view).getDrawable();
            if (drawable != null && drawable instanceof BitmapDrawable) {
                return ((BitmapDrawable) drawable).getBitmap();
            }
        }
        view.clearFocus();

        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 || height == 0) {
            view.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
            width = view.getMeasuredWidth();
            height = view.getMeasuredHeight();
        }

        Bitmap bitmap = createBitmapSafely((int) (width * scale),
                (int) (height * scale), Bitmap.Config.ARGB_8888, 1);
        if (bitmap != null) {
            synchronized (sCanvas) {
                Canvas canvas = sCanvas;
                canvas.setBitmap(bitmap);
                canvas.save();
                canvas.drawColor(Color.WHITE); // 防止 View 上面有些区域空白导致最终 Bitmap 上有些区域变黑
                canvas.scale(scale, scale);
                view.draw(canvas);
                canvas.restore();
                canvas.setBitmap(null);
            }
        }
        return bitmap;
    }

    public static Bitmap createBitmapFromView(View view) {
        return createBitmapFromView(view, 1f);
    }

    /**
     * 从一个view创建Bitmap。把view的区域截掉leftCrop/topCrop/rightCrop/bottomCrop
     */
    public static Bitmap createBitmapFromView(View view, int leftCrop, int topCrop, int rightCrop, int bottomCrop) {
        Bitmap originBitmap = QMUIDrawableHelper.createBitmapFromView(view);
        if (originBitmap == null) {
            return null;
        }

        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 || height == 0) {
            view.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
            width = view.getMeasuredWidth();
            height = view.getMeasuredHeight();
        }

        Bitmap cutBitmap = createBitmapSafely(width - rightCrop - leftCrop, height - topCrop - bottomCrop, Bitmap.Config.ARGB_8888, 1);
        if (cutBitmap == null) {
            return null;
        }
        Canvas canvas = new Canvas(cutBitmap);
        Rect src = new Rect(leftCrop, topCrop, width - rightCrop, height - bottomCrop);
        Rect dest = new Rect(0, 0, width - rightCrop - leftCrop, height - topCrop - bottomCrop);
        canvas.drawColor(Color.WHITE); // 防止 View 上面有些区域空白导致最终 Bitmap 上有些区域变黑
        canvas.drawBitmap(originBitmap, src, dest, null);
        originBitmap.recycle();
        return cutBitmap;
    }

    /**
     * 安全的创建bitmap。 如果新建 Bitmap 时产生了 OOM，可以主动进行一次 GC - System.gc()，然后再次尝试创建。
     *
     * @param width      Bitmap 宽度。
     * @param height     Bitmap 高度。
     * @param config     传入一个 Bitmap.Config。
     * @param retryCount 创建 Bitmap 时产生 OOM 后，主动重试的次数。
     * @return 返回创建的 Bitmap。
     */
    public static Bitmap createBitmapSafely(int width, int height, Bitmap.Config config, int retryCount) {
        try {
            return Bitmap.createBitmap(width, height, config);
        } catch (OutOfMemoryError e) {
            e.printStackTrace();
            if (retryCount > 0) {
                System.gc();
                return createBitmapSafely(width, height, config, retryCount - 1);
            }
            return null;
        }
    }
}
```
