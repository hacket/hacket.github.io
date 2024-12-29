---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# SVG介绍

<http://www.w3school.com.cn/svg/index.asp>

SVG的全称是Scalable Vector Graphics，叫可缩放矢量图形。它和位图（Bitmap）相对，SVG不会像位图一样因为缩放而让图片质量下降。它的优点在于节约空间，使用方便。

## SVG特点

```
SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
SVG 用来定义用于网络的基于矢量的图形
SVG 使用 XML 格式定义图形
SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失
SVG 是万维网联盟的标准
SVG 与诸如 DOM和 XSL 之类的W3C标准是一个整体
```

## SVG和Vector

Vector只实现了SVG语法的Path标签（为了提高解析效率），在Android中使用。

Vector的语法通过字母和数字的组合来描述一个路径，不同字母则代表不同含义，例如：

```
M = moveto(M X,Y): 将画笔移动到指定的坐标位置
L = lineto(L X,Y): 画直线到指定的坐标位置
Z = closepath(): 关闭路径
```

Vector还提供了一些封装好的方法：

```
H = horizontal lineto(H X): 画水平线到指定的X坐标位置
V = vertical lineto(V Y): 画垂直线到指定的Y坐标位置
```

例如下面这个 Vector Asset 代表一个黑色的正方形：

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24.0"
    android:viewportHeight="24.0">
    <path
        android:name="square"
        android:fillColor="#FF000000"
        android:pathData="M10,10 L20,10 L20,20 L10,20 z"/>
</vector>
```

解释：

- 1）如上是依次以 M10,10 -> L20,10 -> L20,20 -> L10,20 -> z 进行绘制；
- 2）width/height 代表vector的大小；viewportWidth/viewportHeight 则代表把vector均匀分为24整份，pathData就按照这里的标准来绘制。

## 矢量图属性与绘制

### 尺量图属性

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="200dp"
    android:height="200dp"
    android:viewportWidth="500"
    android:viewportHeight="500">
    <group
        android:scaleX="5.0"
        android:scaleY="5.0">
        <path
            android:name="start"
            android:pathData="M 50.0,90.0 L 82.9193546357,27.2774101308 L 12.5993502926,35.8158045183 L 59.5726265715,88.837672697 L 76.5249063296,20.0595700732 L 10.2916450361,45.1785327898 L 68.5889268818,85.4182410261 L 68.5889268818,14.5817589739 L 10.2916450361,54.8214672102 L 76.5249063296,79.9404299268 L 59.5726265715,11.162327303 L 12.5993502926,64.1841954817 L 82.9193546357,72.7225898692 L 50.0,10.0 L 17.0806453643,72.7225898692 L 87.4006497074,64.1841954817 L 40.4273734285,11.162327303 L 23.4750936704,79.9404299268 L 89.7083549639,54.8214672102 L 31.4110731182,14.5817589739 L 31.4110731182,85.4182410261 L 89.7083549639,45.1785327898 L 23.4750936704,20.0595700732 L 40.4273734285,88.837672697 L 87.4006497074,35.8158045183 L 17.0806453643,27.2774101308 L 50.0,90.0Z"
            android:strokeWidth="2"
            android:strokeColor="#000000" />
    </group>
</vector>
```

效果<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212308388-4f4b33c1-8445-473a-8234-fd41fde9fc93.png#averageHue=%230a0b0b&clientId=u5b64d56f-58a9-4&from=paste&height=476&id=u69af6369&originHeight=952&originWidth=888&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200825&status=done&style=none&taskId=u732f35f2-b6c5-485f-88fe-ad7949cab5a&title=&width=444)

#### `<vector>`

根标签，表示一个矢量动画<br />支持的属性：

1. android:name：定义矢量图形的名称
2. android:width：定义Drawable的宽度，支持所有dimension单位，一般使用dp。drawable的宽度不一定是最终绘制宽度，比如给ImageView设置backgroud则Drawable绘制宽度等于ImageView的宽度，给ImageView设置src则在ImageView大于Drawable宽度时，Drawable绘制宽度等于自己定义的宽度。
3. android:height：定义Drawable的宽度，支持所有dimension单位，一般是dp。其它同上。
4. android:viewportWidth：定义矢量图形的视图(viewport)空间的宽度，viewport是一个虚拟的canvas，后面所有的path都在该坐标系上绘制。坐标系左上方为(0,0)，横轴从左向右，纵轴从上到下。横轴可视区域就是0~viewportWidth。
5. android:viewportHeight：定义矢量图形的可视区域的高度。其它见上。[0,0]~[viewportWidth,viewportHeight]定义了虚拟canvas的可视区域。
6. android:tint：作为染色(tint)的色彩应用到drawable上。默认不应用tint。
7. android:tintMode：tint颜色的Porter-Duff混合模式，默认是src_in。
8. android:autoMirrored：如果drawable布局方向是RTL(right-to-left)时，drawable绘制是否需要镜像化（镜像化就是绕自身x轴中线旋转180度）。
9. android:alpha：drawble的透明度，取值0～1

#### `<group>`

定义一组路径和子group，另外还定义了转换信息(transformation information)。转换信息定义在vector指定的视图区域内（与viewport坐标系相同）。定义的应用转换的顺序是缩放-->旋转-->平移，所以同时定义的这些属性最先应用scaleX/scaleY属性，最后应用translateX/translateY属性。

支持的属性：

1. android:name：定义group的名称
2. android:rotation：group对应矢量图形的旋转角度，取值是360度制。
3. android:pivotX：Group旋转和缩放时的中心点的X轴坐标。取值基于viewport视图的坐标系，不能使用百分比。
4. android:pivotY：Group旋转和缩放时的中心点的Y轴坐标。取值基于viewport视图的坐标系，不能使用百分比。
5. android:scaleX：Group在X轴上的缩放比例，最先应用到图形上。
6. android:scaleY：Group在Y轴上的缩放比例，最先应用到图形上。
7. android:translateX：Group在X轴的平移距离，取值基于viewport视图的坐标系。最后应用到图形上。
8. android:translateY：Group在Y轴的平移距离，取值基于viewport视图的坐标系。最后应用到图形上。

#### `<path>`

定义一个路径，一个路径即可以表示一块填充区域或一根线条。<br />支持的属性：

1. android:name：定义路径的名称
2. android:pathData：定义路径的数据，路径由多条命令组成，格式与SVG标准的path data的d属性完全相同，路径命令的参数定义在viewport视图的坐标系。
3. android:fillColor：指定填充路径的颜色，一般是一个颜色值，在SDK24及以上，可以指定一个颜色状态列表或者一个渐变的颜色。如果在此属性上做渐变动画，新的属性值会覆盖此值。如果不指定，则path不被填充。
4. android:strokeColor：指定路径线条的颜色，一般是一个颜色值，在SDK24及以上，可以指定一个颜色状态列表或者一个渐变的颜色。如果在此属性上做渐变动画，新的属性值会覆盖此值。如果不指定，则path的线条不会绘制出来。
5. android:strokeWidth：指定路径线条的宽度，基于viewport视图的坐标系（不要dp/px之类的结尾）。
6. android:strokeAlpha：指定路径线条的透明度。
7. android:fillAlpha：指定填充区域的透明度。
8. android:trimPathStart：取值从0到1，表示路径从哪里开始绘制。0~trimPathStart区间的路径不会被绘制出来。
9. android:trimPathEnd：取值从0到1，表示路径绘制到哪里。trimPathEnd~1区间的路径不会被绘制出来。
10. android:trimPathOffset：平移可绘制区域，取值从0到1，线条从(trimPathOffset+trimPathStart绘制到trimPathOffset+trimPathEnd)，注意：trimPathOffset+trimPathEnd如果超过1，其实也是绘制的的，绘制的是0～trimPathOffset+trimPathEnd-1的位置。
11. android:strokeLineCap：设置线条首尾的外观，三个值：butt（默认，向线条的每个末端添加平直的边缘）, round（向线条的每个末端添加圆形线帽）, square（向线条的每个末端添加正方形线帽。）。
12. android:strokeLineJoin：设置当两条线条交汇时，创建什么样的边角（线段连接类型）：三个值：miter（默认，创建尖角）,round（创建圆角）,bevel（创建斜角） 。
13. android:strokeMiterLimit：设置设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

#### SVG语法

```
M = moveto(M X,Y) ：将画笔移动到指定的坐标位置，相当于 android Path 里的moveTo()
L = lineto(L X,Y) ：画直线到指定的坐标位置，相当于 android Path 里的lineTo()
H = horizontal lineto(H X)：画水平线到指定的X坐标位置
V = vertical lineto(V Y)：画垂直线到指定的Y坐标位置
C = curveto(C X1,Y1,X2,Y2,ENDX,ENDY)：三次贝赛曲线
S = smooth curveto(S X2,Y2,ENDX,ENDY) 同样三次贝塞尔曲线，更平滑
Q = quadratic Belzier curve(Q X,Y,ENDX,ENDY)：二次贝赛曲线
T = smooth quadratic Belzier curveto(T ENDX,ENDY)：映射 同样二次贝塞尔曲线，更平滑
A = elliptical Arc(A RX,RY,XROTATION,FLAG1,FLAG2,X,Y)：弧线 ，相当于arcTo()
Z = closepath()：关闭路径（会自动绘制链接起点和终点）
```

> 以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。

## SVG资源：

| 资源                 | 地址                                                                | 备注 |
| ------------------ | ----------------------------------------------------------------- | -- |
| Android实现炫酷SVG动画效果 | <http://blog.csdn.net/crazy__chen/article/details/47728241#reply> |    |

<https://www.jianshu.com/p/4707a4738a51>

### 1、获取尺量图

1. 海量在线矢量图(阿里出品)<br /><http://iconfont.cn/>
2. Android Studio的Material Icon入口<br />鼠标选中drawable文件夹，右键， New， Vector Asset
3. 用软件或工具导出<br />美工帮忙做<br />在线制作<https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html><br />Vector Magic制作

### 2、转换

1. svgtoandroid<br /><https://github.com/misakuo/svgtoandroid>

> svgtoandroid插件不好用，有透明度的svg被转换成不透明的了

### 3、预览

<https://shapeshifter.design/>

2. 在线工具<br /><http://inloop.github.io/svg2android/>

> 将svg转换成vector xml格式

3. AS - new Vector Asset

## SVG相关库

### android-pathview

<https://github.com/geftimov/android-pathview><br />使用Android自带的绘图类和函数，复杂的曲线路径，我们可以使用`Path`这个类来制定<br />那会不会SVG里面的path，其实也是这样，那么我们就可以将SVG中的path，对应到android，然后绘制出来就好了。<br />SVG里面还有各种标签：<br />包括line直线，circle圆，rect矩形，eliipse椭圆，polygon多边形，等等<br />这些只要我们又一个SVG文件，都可以将其转换成java代码<br />作为一个程序员，我们当然不能手动去做这个工作，那就涉及两个问题，一个是SVG的解析，一个是解析后的绘制<br />幸运的是，已经有人完成了这个工作，并且在Github上开源 <https://github.com/geftimov/android-pathview>

### Lottie

### SVGAPlayer-Android（YY）

<https://github.com/yyued/SVGAPlayer-Android>

### VectAlign

<https://github.com/bonnyfone/vectalign>

# VectorDrawable（静态SVG）

[toc]

## VectorDrawable

VectorDrawable是Google从Android 5.0开始引入的一个新的Drawable子类，能够加载矢量图。到现在通过support-library已经至少能适配到Android 4.0了（通过AppBrain统计的Android版本分布来看，Android 4.1以下（api<15）几乎可以不考虑了）。Android中的VectorDrawable只支持SVG的部分属性，相当于阉割版。

在Android中，我们不能直接使用原始的`.svg`格式图片，而是需要将其转化为 VectorDrawable，可以理解为一个XML格式的svg文件，即矢量图形在android中的原始资源

它虽然是个类，但是一般通过配置xml再设置到要使用的控件上。在Android工程中，在资源文件夹`res/drawable/`的目录下（没有则需新建），通过`<vector></vector>`标签描述，例如svg_ic_arrow_right.xml：

### 引入

添加gradle配置：

```groovy
android {
  defaultConfig {
    vectorDrawables.useSupportLibrary = true
   }
}

dependencies {
  compile "com.android.support:appcompat-v7:21+" // 至少Api21
}
```

项目的Activity中都包含（通用做法是在BaseActivity中加）：

```java
static {
  AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
}
```

### vector命令

#### 直线命令

##### 例子1 画一个方向图标（直线命令）

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--android:width="50dp"  android:height="50dp" 画布的宽度与高度-->
<!--android:viewportWidth="50.0" android:viewportHeight="50.0" 视图的宽度和高度-->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="50dp"
    android:height="50dp"
    android:viewportWidth="50.0"
    android:viewportHeight="50.0">
    <!--strokeColor=  笔画颜色 线条的颜色-->
    <!--fillColor=  填充颜色  注意2个颜色 有明显区分，填充颜色只是在图形闭合后颜色-->
    <!--strokeWidth=  线宽-->
    <path
        android:pathData="M10,10
        L26.7,26.9
        M25,25
        L10,40"
        android:strokeWidth="5"
        android:strokeColor="@color/colorPrimaryDark" />
    <!--这里使用的都是大写字母，所以坐标值都是绝对坐标-->
    <!--M10,10 = 首先将画笔移动到X10,Y10的地方-->
    <!--L26.7,26.9 = 然后画一条直线到X26.7,Y26.9 -->
    <!--M25,25 = 在将画笔移动到 X25.7,Y25 -->
    <!--L10,40 = 画一条直线到 X10.7,Y40 -->
</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212696100-eb3f160c-231a-46c6-a122-fe12f09c5803.png#averageHue=%23f4f4f4&clientId=u060555a7-645e-4&from=paste&height=131&id=u8b6f6eec&originHeight=262&originWidth=249&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8123&status=done&style=none&taskId=u4eef7a90-8864-4438-8cf7-ce120acd624&title=&width=124.5)

##### 例子2  画一个矩形（直线命令）

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="100dp"
    android:height="100dp"
    android:viewportWidth="100.0"
    android:viewportHeight="100.0">
    <path
        android:name="stars"
        android:pathData="M10,10 L90,10 L90,90 L10,90 Z"
        android:strokeWidth="2"
        android:strokeColor="@color/colorPrimaryDark" />
</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212703966-3d84bad0-597e-4ce9-a674-7b137d07f2d7.png#averageHue=%23f5f5f5&clientId=u060555a7-645e-4&from=paste&height=123&id=ue5611f22&originHeight=245&originWidth=255&originalType=binary&ratio=2&rotation=0&showTitle=false&size=5042&status=done&style=none&taskId=u9b2c4f4d-7729-4d67-addb-df68e975d97&title=&width=127.5)<br />![](http://note.youdao.com/yws/res/39982/A8BABFE43FE34D6597B7ED7F29570DF8#id=LJ06D&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1. 我们的画布是100*100的,首先在X10,Y10的坐标上向右画直线,然后在下线画直线,在向左画直线,最后使用Z闭合图形。注意！需要闭合图形需要在一个图形里一直保持线段的连贯,如果在中间使用M移动画笔，那么Z闭合只与最后一次M移动的点闭合图形。这点与自定义View里的path画法类似。
2. 另外，如果你需要一个填充全部颜色的矩形，只需要修改android:strokeColor="@color/colorPrimaryDark"  为android:fillColor="@color/colorPrimaryDark" 这样，图形中间就会被全部填充。但是建议初学者在画的时候设置strokeColor和strokeWidth 在来绘制图形，否则图形如果不设置线条颜色和线宽，图形在闭合之前是不会显示图形的。

#### 曲线命令

绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分.<br />在path元素里，只存在两种贝塞尔曲线：三次贝塞尔曲线`C`，和二次贝塞尔曲线`Q`

##### 三次贝塞尔曲线C

三次贝塞尔曲线C，三次贝塞尔曲线需要定义一个点和两个控制点，所以用C命令创建三次贝塞尔曲线，需要设置三组坐标参数：<br />`C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)`

> 这里的最后一个坐标(x,y)表示的是曲线的终点，另外两个坐标是控制点，(x1,y1)是起点的控制点，(x2,y2)是终点的控制点

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="400dp"
    android:height="400dp"
    android:viewportWidth="400"
    android:viewportHeight="400">

    <path
        android:name="rect_vector"
        android:fillColor="#04f91d"
        android:pathData="M 100 100 C 200 0 300 0 400 100 "
        android:strokeWidth="5"
        android:strokeColor="#f76f07" />

</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212722057-e9861688-76d3-46a4-ac37-926b6a863911.png#averageHue=%23eeeceb&clientId=u060555a7-645e-4&from=paste&height=160&id=u98af175f&originHeight=320&originWidth=426&originalType=binary&ratio=2&rotation=0&showTitle=false&size=17213&status=done&style=none&taskId=u1c22cd68-3cd5-4f56-9296-1cf479cd67f&title=&width=213)<br />![](http://note.youdao.com/yws/res/39999/F17ECEDF575941E9B0F156AA6D338EA2#id=u2qoZ&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```
M 定义起点为(100,100)
C 定义终点为(400,100)
其中两个控制点 (200,0)(300,0)
```

##### 连接贝塞尔曲线 S

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="800dp"
    android:height="800dp"
    android:viewportWidth="800"
    android:viewportHeight="800">

    <path
        android:name="rect_vector"
        android:fillColor="#04f91d"
        android:pathData="M 100 100 C 200 0 300 0 400 100 S 600 200 700 100"
        android:strokeWidth="5"
        android:strokeColor="#f76f07" />

</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212730697-cdc86e0f-5b3d-46a5-934e-f00b58fd7c68.png#averageHue=%23f4f3f2&clientId=u060555a7-645e-4&from=paste&height=126&id=u928c5e3c&originHeight=251&originWidth=325&originalType=binary&ratio=2&rotation=0&showTitle=false&size=9360&status=done&style=none&taskId=ucd1a1b49-0f89-442a-a6d6-ab59dd9cbc1&title=&width=162.5)<br />![](http://note.youdao.com/yws/res/40006/0F72D92B29714EB7A21E97C92F0F3CE7#id=dOssM&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

##### 二次贝塞尔曲线Q

它比三次贝塞尔曲线简单，只需要一个控制点，用来确定起点和终点的曲线斜率。因此它需要两组参数，控制点和终点坐标<br />`Q x1 y1, x y (or q dx1 dy1, dx dy)`

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="400dp"
    android:height="400dp"
    android:viewportHeight="800"
    android:viewportWidth="800">

    <path
        android:name="rect_vector"
        android:fillColor="#04f91d"
        android:pathData="M 100 100 Q 200 0 400 100"
        android:strokeColor="#f76f07"
        android:strokeWidth="5" />

</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212737895-d18f1e81-ebbf-452b-a0f6-a0ebc3d15512.png#averageHue=%23f4f3f2&clientId=u060555a7-645e-4&from=paste&height=92&id=ufee365e2&originHeight=183&originWidth=207&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6062&status=done&style=none&taskId=udd4d3644-31b8-40ca-bb05-91259e26647&title=&width=103.5)![](http://note.youdao.com/yws/res/40013/DA0AA46EEB544D60A6CE75E4D3D149C9#id=CPVvx&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

##### 连接贝塞尔曲线 T

就像三次贝塞尔曲线有一个S命令，二次贝塞尔曲线有一个差不多的T命令，可以通过更简短的参数，延长二次贝塞尔曲线。

`T x y (or t dx dy)`

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="800dp"
    android:height="800dp"
    android:viewportWidth="800"
    android:viewportHeight="800">

    <path
        android:name="rect_vector"
        android:fillColor="#04f91d"
        android:pathData="M 100 100 Q 200 0 300 100 T 500 100"
        android:strokeWidth="5"
        android:strokeColor="#f76f07" />

</vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212774166-de512ba2-3fbd-4ddf-ab65-572286a12fca.png#averageHue=%23f4f3f2&clientId=u060555a7-645e-4&from=paste&height=100&id=ue5d8a11a&originHeight=199&originWidth=231&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7359&status=done&style=none&taskId=u1e636232-803b-413c-91d6-864c1f55535&title=&width=115.5)<br />![](http://note.youdao.com/yws/res/40019/D9765D298AF448D6A9A23FB209C751A7#id=iiqz4&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 弧形

弧形命令`A`是另一个创建SVG曲线的命令。基本上，弧形可以视为圆形或椭圆形的一部分。假设，已知椭圆形的长轴半径和短轴半径，另外已知两个点（它们的距离在圆的半径范围内），这时我们会发现，有两个路径可以连接这两个点。每种情况都可以生成出四种弧形。所以，为了保证创建的弧形唯一，A命令需要用到比较多的参数:

```
A rx ry x-axis-rotation large-arc-flag sweep-flag x y

a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
```

1. 弧形命令A的前两个参数分别是x轴半径和y轴半径
2. 参数 x-axis-rotation （第三个）表示弧形的旋转情况
3. 参数 large-arc-flag （第四个）决定弧线是大于还是小于180度，0表示小角度弧，1表示大角度弧。
4. 参数 sweep-flag（第五个）表示弧线的方向，0表示从起点到终点沿逆时针画弧，1表示从起点到终点沿顺时针画弧。
5. 最后的参数x y 是弧线的终点

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="800dp"
    android:height="800dp"
    android:viewportHeight="800"
    android:viewportWidth="800">

    <path
        android:name="rect_vector"
        android:fillColor="#04f91d"
        android:pathData="
        M 100 400
        A 100 120 0 0 1 400 400 Z"
        android:strokeColor="#f76f07"
        android:strokeWidth="5" />

</vector>
```

![](http://note.youdao.com/yws/res/40028/D3731BBAF01F482C8A51C540E4498A6A#id=qlP1Y&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212781840-458e030f-3402-40bd-a95c-e3cf894633f3.png#averageHue=%23f4f2f0&clientId=u060555a7-645e-4&from=paste&height=114&id=uce4b73e3&originHeight=228&originWidth=211&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7811&status=done&style=none&taskId=u424d80ef-c719-458f-a76a-f1566c43175&title=&width=105.5)

这里 起点坐标是 (100,400) 弧线的半径 rx =100 ry=120 旋转角度为 0度，第四个参数 0 代表取的是小角方向的弧度，这里正好两而相等<br />终点坐标是 (400,400) 最后 Z 闭合曲线

### 兼容

#### 1.ImageView

将android:src属性，换成app:srcCompat即可

> 可以发现，这里我们使用的都是普通的ImageView，好像并不是AppcomatImageView，这是因为使用了Appcomat后，系统会自动把ImageView转换为AppcomatImageView。

#### 2. 在非src属性的地方使用矢量图时，需要将矢量图用drawable容器(如StateListDrawable, InsetDrawable, LayerDrawable, LevelListDrawable, 和RotateDrawable)包裹起来使用。否则会在低版本的情况下报错。

> 如通过selector

#### 3. Button和TextView等

android.support.v7.widget.AppCompatTextView<br />drawableLeft等不支持，需要设置才能支持

```java

static {

    AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);

}
```

RadioButton的button属性

需要设置这个flag的原因：

> First up, this functionality was originally released in 23.2.0, but then we found some memory usage and Configuration updating issues so we it removed in 23.3.0. In 23.4.0 (technically a fix release) we’ve re-added the same functionality but behind a flag which you need to manually enable.

开启这个flag后，你就可以正常使用Selector这样的DrawableContainers了。同时，你还开启了类似android:drawableLeft这样的compound drawable的使用权限，以及RadioButton的使用权限，以及ImageView’s src属性。

#### 4.将 VectorDrawable 用于 View 背景时，需要通过以下代码设定：

```java

Resources resources = context.getResources(Resources, int, Theme);

Theme theme = context.getTheme();

Drawable drawable = VectorDrawableCompat.create(resources, R.drawable.vector_drawable, theme);

view.setBackground(drawable);
```

代码中需要进行Drawable的实现类型转换时，可使用以下代码段执行：

```java

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

   VectorDrawable vectorDrawable = (VectorDrawable) drawable;

} else {

   BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;

}
```

### 5.0以下使用VectorDrawable是不是有问题

> 请问5.0以下使用VectorDrawable是不是有问题？我在gradle中将vectorDrawables.useSupportLibrary设置为true，还是报资源找不到的错，我用的是另一个library的控件，然后控件设置了vectorDrawable，一直报错

解决：

```
解决方法：Gradle 2.0 以上，在模块的 gradle 文件中添加 vectorDrawables.useSupportLibrary = true，Activity 的 static 代码块中添加 
AppCompatDelegate.setCompatVectorFromSourcesEnabled(true)，这段代码我放在了 BaseActivity，假设使用的是 ImageView 的 android:src 属性，AS 还会提示改用 app:srcCompat，这个属性查了一下，说是会将 View 转换为对应的 AppCompat 类型。还有一点就是，如果有使用 drawableLeft 等这些属性的话，还是会出问题，还是会报资源找不到的异常，解决方法是将 vector 用 selector 包一层就好了
```

# AnimatedVectorDrawable（动图SVG）

# AnimatedVectorDrawable

动态vector，对VectorDrawable定义动画通过ObjectAnimator或AnimatrorSet

动态的Vector需要通过`animated-vector`标签来进行实现，它就像一个粘合剂，将控件与Vector图像粘合在了一起

通过`<animated-vector>`标签，drawable定义一个vector，animation定义

```xml
<animated-vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/XXXXX1">
    <target
        android:name="left"
        android:animation="@animator/XXXXX2"/>
</animated-vector>
```

1. XXXXX1是目标Vector图像，也就是静态的Vector图像
2. XXXXX2实际上就是模板要实现的动画，动画效果实际上就是基础的属性动画

```java
ImageView imageView = (ImageView) findViewById(R.id.iv);
AnimatedVectorDrawableCompat animatedVectorDrawableCompat = AnimatedVectorDrawableCompat.create(
        this, R.drawable.square_anim
);
imageView.setImageDrawable(animatedVectorDrawableCompat);
((Animatable) imageView.getDrawable()).start();
```

## 案例

### 案例1：加载小球动画

1. 静态vector资源vector_ball_vector.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24.0"
    android:viewportHeight="24.0">

    <group android:name="left">
        <path
            android:fillColor="#FF000000"
            android:pathData="M6,10c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2z" />
    </group>

    <group android:name="right">
        <path
            android:fillColor="#FF000000"
            android:pathData="M18,10c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2z" />
    </group>
</vector>
```

2. 动画资源left

```xml
<?xml version="1.0" encoding="utf-8"?>
<objectAnimator xmlns:androd="http://schemas.android.com/apk/res/android"
    androd:duration="500"
    androd:interpolator="@android:interpolator/overshoot"
    androd:propertyName="translateX"
    androd:repeatCount="infinite"
    androd:repeatMode="reverse"
    androd:valueFrom="0"
    androd:valueTo="10"
    androd:valueType="floatType"/>
    <!--
        duration="1000"          持续时间/毫秒
        interpolator             修饰动画效果,定义动画的变化率(加速,减速,重复,弹跳)
        propertyName="translateX"属性名（还有前面回顾属性动画提到的属性，另外还有颜色渐变fillColor/轨迹绘制trimPathStart）
        repeatCount="infinite"   无限次
        repeatMode="reverse"     重复模式:循环使用
        valueFrom="0"            起始值
        valueTo="10"             结束值
        valueType="floatType"    变化值的类型:浮点型变化
     -->
```

3. 动画资源right

```xml
<?xml version="1.0" encoding="utf-8"?>
<objectAnimator xmlns:androd="http://schemas.android.com/apk/res/android"
    androd:duration="500"
    androd:interpolator="@android:interpolator/overshoot"
    androd:propertyName="translateX"
    androd:repeatCount="infinite"
    androd:repeatMode="reverse"
    androd:valueFrom="0"
    androd:valueTo="-10"
    androd:valueType="floatType" />
```

4. 动画粘合剂 animated-vector（vector_ball_vector_animated.xml），让属性动画作用于VectorDrawable：

```xml
<?xml version="1.0" encoding="utf-8"?>
<animated-vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/vector_ball_vector">
    <target
        android:name="left"
        android:animation="@animator/vector_ball_anim_left" />
    <target
        android:name="right"
        android:animation="@animator/vector_ball_anim_right" />
</animated-vector>
```

5. ImageView用`android:srcCompat`

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ImageView
        android:layout_width="match_parent"
        android:layout_height="45dp"
        app:srcCompat="@drawable/arrow_anim"
        android:onClick="anim"/>
</RelativeLayout>
```

6. 在Activity中添加点击事件anim：

```xml
public void anim(View view) {
    ImageView imageView = (ImageView) view;
    Drawable drawable = imageView.getDrawable();
    if (drawable instanceof Animatable) {
        ((Animatable) drawable).start();
    }
}
```

![](http://note.youdao.com/yws/res/40106/81B45965069B4D749A01C1768F48A1CA#id=pbQqH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### VectorDrawable实现轨迹动画

轨迹动画关键的配置就是 objectAnimator 中 `androd:propertyName=”trimPathStart”` 属性。

1. path.xml

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="200dp"
    android:height="200dp"
    android:viewportHeight="500"
    android:viewportWidth="500">
    <group
        android:scaleX="5.0"
        android:scaleY="5.0">
        <path
            android:name="start"
            android:pathData="M 50.0,90.0 L 82.9193546357,27.2774101308 L 12.5993502926,35.8158045183 L 59.5726265715,88.837672697 L 76.5249063296,20.0595700732 L 10.2916450361,45.1785327898 L 68.5889268818,85.4182410261 L 68.5889268818,14.5817589739 L 10.2916450361,54.8214672102 L 76.5249063296,79.9404299268 L 59.5726265715,11.162327303 L 12.5993502926,64.1841954817 L 82.9193546357,72.7225898692 L 50.0,10.0 L 17.0806453643,72.7225898692 L 87.4006497074,64.1841954817 L 40.4273734285,11.162327303 L 23.4750936704,79.9404299268 L 89.7083549639,54.8214672102 L 31.4110731182,14.5817589739 L 31.4110731182,85.4182410261 L 89.7083549639,45.1785327898 L 23.4750936704,20.0595700732 L 40.4273734285,88.837672697 L 87.4006497074,35.8158045183 L 17.0806453643,27.2774101308 L 50.0,90.0Z"
            android:strokeColor="#000000"
            android:strokeWidth="2"/>
    </group>
</vector>
```

2. anim_path.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:androd="http://schemas.android.com/apk/res/android">
    <objectAnimator
        androd:duration="10000"
        androd:propertyName="trimPathStart"
        androd:repeatCount="infinite"
        androd:repeatMode="reverse"
        androd:valueFrom="1"
        androd:valueTo="0"
        androd:valueType="floatType">
    </objectAnimator>
    <objectAnimator
        androd:duration="10000"
        androd:propertyName="strokeColor"
        androd:repeatCount="infinite"
        androd:repeatMode="reverse"
        androd:valueFrom="@android:color/holo_red_dark"
        androd:valueTo="@android:color/holo_blue_dark"
        androd:valueType="colorType">
    </objectAnimator>
</set>
```

3. 配置动画粘合剂 animated-vector（path_anim.xml），让属性动画作用于VectorDrawable：

```xml
<?xml version="1.0" encoding="utf-8"?>
<animated-vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/path">
    <target
        android:animation="@animator/anim_path"
        android:name="start"/>
</animated-vector>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688212928692-1a0297b0-31a1-4566-bd0a-72da394af467.png#averageHue=%23f6f9f4&clientId=u060555a7-645e-4&from=paste&height=157&id=u4e57d1a6&originHeight=314&originWidth=592&originalType=binary&ratio=2&rotation=0&showTitle=false&size=73556&status=done&style=none&taskId=u48e831de-8643-492a-a0f1-12d2e1a8c5e&title=&width=296)<br />![](http://note.youdao.com/yws/res/40114/22BF50A0994347A2B78B0574F6D489B1#id=R0p3a&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### VectorDrawable实现路径变换动画

轨迹动画关键的配置就是 objectAnimator 中 `androd:propertyName=”pathData”` 和 `androd:valueType=”pathType”`属性。这里我们实现五角星向五边形的变换动画。

1. 创建五角星VectorDrawable文件 fivestar.xml

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="120dp"
    android:height="120dp"
    android:viewportHeight="64"
    android:viewportWidth="64">
    <group>
        <path
            android:name="star"
            android:fillColor="#22e171"
            android:pathData="M 48,54 L 31,42 15,54 21,35 6,23 25,23 32,4 40,23 58,23 42,35 z"
            android:strokeColor="#000000"
            android:strokeWidth="1"/>
    </group>
</vector>
```

2. 为VectorDrawable创建属性动画：

```xml
<?xml version="1.0" encoding="utf-8"?>
<objectAnimator
    xmlns:androd="http://schemas.android.com/apk/res/android"
    androd:duration="3000"
    androd:propertyName="pathData"
    androd:valueFrom="M 48,54 L 31,42 15,54 21,35 6,23 25,23 32,4 40,23 58,23 42,35 z"
    androd:valueTo="M 48,54 L 31,54 15,54 10,35 6,23 25,10 32,4 40,10 58,23 54,35 z"
    androd:valueType="pathType">
</objectAnimator>
```

3. 配置动画粘合剂 animated-vector（fivestar_anim.xml），让属性动画作用于VectorDrawable：

```xml
<?xml version="1.0" encoding="utf-8"?>
<animated-vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/fivestar">
    <target
        android:animation="@animator/anim_fivestar"
        android:name="star"/>
</animated-vector>
```

4. 使用

```java
/**
  * 指该方法适用Android版本大于等于Android L
  * @param view
  */
@TargetApi(Build.VERSION_CODES.LOLLIPOP)
public void animL(View view) {
    ImageView imageView = (ImageView) view;
    AnimatedVectorDrawable drawable = (AnimatedVectorDrawable) getDrawable(R.drawable.fivestar_anim);
    imageView.setImageDrawable(drawable);
    if (drawable != null) {
        drawable.start();
    }
}
```

> 需要考虑到VectorDrawable实现路径变换动画的兼容性问题，故路径变换动画目前存在兼容性问题。不能在4.X版本运行，这一点格外注意。不过我们同样希望Google可以在后续版本中优化路径变换动画，提高兼容性。

## 兼容性

### 静态的vector通过support兼容很好，

### 向下兼容问题

1. Path Morphing，即路径变换动画，在Android pre-L版本下是无法使用的，例如将圆形变换成三角形的动画。
2. Path Interpolation，即路径插值器，在Android pre-L版本只能使用系统的插值器，不能自定义。
3. Path Animation，即路径动画，这个一般使用贝塞尔曲线来代替，所以没有太大影响。

### 向上兼容问题

1. 路径变换动画（Path Morphing）<br />在Android L版本以上需要使用代码配置。

### 抽取string兼容问题

`<PathData>`不支持从String.xml中读取

### Android6.0以下不支持渐变

会崩溃

## 进阶

### 用好ObjectAnimator

所谓Vector动画进阶，实际上就是在利用ObjectAnimator的一些属性，特别是trimPathStart、trimPathEnd这两个针对Vector的属性（要注意pathData属性不兼容pre-L）

### Path Morph

Path Morph动画是Vector动画的一个高级使用，说到底，也就是两个PathData的转换，但是这种转换并不是随心所欲的，对于两个PathData，它们能进行Path Morph的前提是，它们具有相同个数的关键点，即两个路径的变换，只是关键点的坐标变化，掌握了这一个基本原理，实现Path Morph就非常容易了。

## Ref

- [x] Android 5.0+ 高级动画开发系列 矢量图动画 <https://juejin.im/entry/6844903465601204231>

# SVG资源

- [ ] 阿里巴巴iconfont<br /><http://www.iconfont.cn/>
- [ ] Android矢量图相关库：

1. <https://github.com/mikepenz/Android-Iconics>
2. <https://github.com/JoanZapata/android-iconify>

- [ ] [Android微信上的SVG](https://mp.weixin.qq.com/s?__biz=MzAwNDY1ODY2OQ==&mid=207863967&idx=1&sn=3d7b07d528f38e9f812e8df7df1e3322)
- [ ] <https://github.com/bonnyfone/vectalign>
