---
date created: 星期一, 十月 28日 2024, 10:42:00 上午
date updated: 星期一, 一月 6日 2025, 9:54:43 晚上
title: Drawable案例
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [案例]
linter-yaml-title-alias: 案例
---

# 案例

## 渐变案例

### 上下渐变，无边框，无圆角

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:shape="rectangle"
    android:useLevel="false"
    tools:ignore="ResourceName">

    <gradient
        android:angle="270"
        android:endColor="#FFFFFF"
        android:startColor="#FFECE4" />
</shape>
```

- angle 角度，默认从 start 到 end，逆时针

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694835685678-924f0692-9002-46d0-b886-5d5432242086.png#averageHue=%23fdf5f2&clientId=u19eb4fa7-57cd-4&from=paste&height=277&id=udfa1c623&originHeight=966&originWidth=970&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24009&status=done&style=none&taskId=u497a0006-bc38-420c-b2d9-ca3c94b1945&title=&width=278)

### 带 border 的 shape layer-list

1. 底部 bottom border

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape>
          	//整个空间的背景颜色
            <solid android:color="#FFE5E5E5" />
        </shape>
    </item>
    <item android:bottom="20dp"> // 这里有四个方向可以选择，这里因为只要显示底部边框，所以就设置bottom
        <shape android:shape="rectangle">

            <gradient
                android:angle="270"
                android:endColor="#FFFFFF"
                android:startColor="#FFECE4" />
        </shape>
    </item>
</layer-list>
```

- 第一层是灰色
- 第二层是渐变，bottom 间距是 20 dp，也就漏出来了第一层灰色

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694846152660-ac70e951-9bd1-484c-8b16-5f0ef13d9798.png#averageHue=%23fcf5f1&clientId=u40aa95b5-f4a1-4&from=paste&height=209&id=uf6b5e10d&originHeight=1002&originWidth=1006&originalType=binary&ratio=2&rotation=0&showTitle=false&size=25279&status=done&style=none&taskId=ufc1dced8-ac24-41b5-b3a9-13a900b2a8e&title=&width=210)

2. Bottom/top border

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape><!--边框的颜色-->
            <!--<solid android:color="@color/gray" />-->
            <solid android:color="#ff9696" />
        </shape>
    </item>

    <item
        android:bottom="10dp"
        android:top="10dp"><!--这里有四个方向可以选择，这里因为只要显示底部边框，所以就设置bottom-->
        <shape>
            <solid android:color="@color/white" />
            <!--整个空间的背景颜色-->
        </shape>
    </item>
</layer-list>
```

- 第一层是 border 的颜色
- 第二层是真正的内容颜色

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694854351269-c8416bf9-56ba-4835-84f8-a5b1a3f13226.png#averageHue=%23fefafa&clientId=u40aa95b5-f4a1-4&from=paste&height=205&id=uce0aa374&originHeight=1042&originWidth=1038&originalType=binary&ratio=2&rotation=0&showTitle=false&size=26549&status=done&style=none&taskId=ub4822c55-bba5-4b02-ab09-27263d1d8e6&title=&width=204)

### 渐变背景，中间颜色渐变

**案例 1：**

```xml
<?xml version="1.0" encoding="utf-8"?>  
<shape xmlns:android="http://schemas.android.com/apk/res/android"  
    xmlns:tools="http://schemas.android.com/tools"  
    android:shape="rectangle"  
    android:useLevel="false"  
    tools:ignore="ResourceName">  
  
    <gradient        android:angle="315"  
        android:centerColor="#000000"  
        android:centerX="0.7"  
        android:centerY="0.7"  
        android:endColor="#FF0000"  
        android:startColor="#00FF00" />  
</shape>
```

中心点在 70% 的位置

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240925210658.png)

**案例 2：**

- UI 设计稿

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240925211230.png)

- 代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:shape="rectangle"
    android:useLevel="false"
    tools:ignore="ResourceName">

    <gradient
        android:angle="315"
        android:centerColor="#FFAC71"
        android:centerX="0.7"
        android:centerY="0.7"
        android:startColor="#EE3098" />
</shape>
```

- 效果 <br> ![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240925211315.png)

### 一个圆角并带有其他效果的 Drawable 为例，展示 GradientDrawable 的简单用法

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
       android:shape="rectangle">

    <!--圆角半径-->
    <corners
            android:topLeftRadius="15dp"
            android:topRightRadius="15dp"
            android:bottomLeftRadius="15dp"
            android:bottomRightRadius="15dp"/>

    <!--内边距-->
    <padding
            android:left="10dp"
            android:top="10dp"
            android:right="10dp"
            android:bottom="10dp" />

    <!--渐变效果-->
    <gradient android:angle="45"
              android:type="linear"
              android:startColor="#ff0000"
              android:centerColor="#00ff00"
              android:endColor="#0000ff" />

    <!--预设大小-->
    <size
        android:width="200dp"
        android:height="100dp" />

    <!--边框样式-->
    <stroke
            android:width="2dp"
            android:color="#000000"
            android:dashWidth="7dp"
            android:dashGap="3dp" />
</shape>
```

![300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144342053-a6eec260-4088-4227-b379-5bded63b88c6.png#averageHue=%23f8f7f6&clientId=u9a8950f1-6bd4-4&from=paste&height=375&id=udd0a93d7&originHeight=675&originWidth=378&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8eff7ddd-118e-4e56-a3f2-70327941b84&title=&width=210)

### 点击态 shape

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools" tools:ignore="ResourceName">
    <item android:drawable="@drawable/room_gift_panel_send_btn_shape" android:state_pressed="false" />
    <item android:drawable="@drawable/room_gift_panel_send_btn_shape_pressed" android:state_pressed="true" />
</selector>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">

    <corners
            android:bottomRightRadius="@dimen/qb_px_16"
            android:topRightRadius="@dimen/qb_px_16" />

    <gradient
            android:endColor="#04ACFF"
            android:startColor="#00EDFF" />
</shape>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">

    <corners
            android:bottomRightRadius="@dimen/qb_px_16"
            android:topRightRadius="@dimen/qb_px_16" />

    <gradient
            android:endColor="#00BECC"
            android:startColor="#038ACC" />
</shape>
```

### 渐变 xml

#### 线性渐变的 xml

```xml
<gradient
    android:centerColor="#00ff00"
    android:endColor="#0000ff"
    android:startColor="#ff0000"
    android:type="linear"/>
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144546142-5569eb3c-916d-4845-b60f-a9eb0e5965e3.png#averageHue=%2336c738&clientId=u9a8950f1-6bd4-4&from=paste&id=uc97d44ff&originHeight=248&originWidth=244&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u38b60d8b-7c76-4a56-b283-c8984420cde&title=)

#### 放射性渐变 xml

```xml
<gradient
    android:centerColor="#00ff00"
    android:endColor="#0000ff"
    android:gradientRadius="100"
    android:startColor="#ff0000"
    android:type="radial"/>
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144557320-c259c6b3-d0e7-4bf3-96c9-a741896fb00e.png#averageHue=%231132ed&clientId=u9a8950f1-6bd4-4&from=paste&id=u857e075d&originHeight=252&originWidth=244&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubde50504-3f14-4d5a-91b2-4e9a6868669&title=)

#### 扫描式渐变 xml

```xml
<gradient
    android:centerColor="#00ff00"
    android:endColor="#0000ff"
    android:startColor="#ff0000"
    android:type="sweep"/>
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144568555-1e8d54ba-5232-4f84-92ab-ac229cdb0ba6.png#averageHue=%2338c638&clientId=u9a8950f1-6bd4-4&from=paste&id=u399930f7&originHeight=244&originWidth=250&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u36dd959c-cf31-42c9-8ec7-65fc557af8e&title=)

### 渐变 Java

#### 线性渐变 Java

```java
int[] colors = new int[]{Color.parseColor("#FF0000"), Color.parseColor("#00FF00"),
                Color.parseColor("#0000FF")};
GradientDrawable linearDrawable = new GradientDrawable();
linearDrawable.setOrientation(GradientDrawable.Orientation.LEFT_RIGHT);
linearDrawable.setColors(colors);
linearDrawable.setGradientType(GradientDrawable.LINEAR_GRADIENT);
mGradient1.setBackground(linearDrawable);
```

#### 放射性渐变 Java

```java
GradientDrawable radialDrawable = new GradientDrawable();
radialDrawable.setColors(colors);
radialDrawable.setShape(GradientDrawable.OVAL);
radialDrawable.setGradientRadius(10f);
radialDrawable.setGradientType(GradientDrawable.RADIAL_GRADIENT);
mGradient2.setBackground(radialDrawable);
```

#### 扫描式渐变 Java

```java
GradientDrawable sweepDrawable = new GradientDrawable();
sweepDrawable.setColors(colors);
sweepDrawable.setGradientType(GradientDrawable.SWEEP_GRADIENT);
mGradient3.setBackground(sweepDrawable);
```

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144579749-c9c1416f-ac2f-4c60-8986-dafbc4c93820.png#averageHue=%2339c63d&clientId=u9a8950f1-6bd4-4&from=paste&height=199&id=u09f7f916&originHeight=392&originWidth=1050&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0079f258-dbb7-42c5-8ec8-c6e89f35ad3&title=&width=534.3333740234375)

### 聊天室小礼物背景

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:shape="rectangle"
        android:useLevel="false"
        tools:ignore="ResourceName">

    <gradient
            android:centerColor="#F200C7E5"
            android:endColor="#0000D0E0"
            android:startColor="#FF0095FF" />
    <corners
            android:bottomLeftRadius="@dimen/qb_px_100"
            android:topLeftRadius="@dimen/qb_px_100" />
</shape>
```

![|100](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144599350-e7b60777-67a9-4b78-bba9-3ce1d6ea8ddb.png#averageHue=%23265f72&clientId=u9a8950f1-6bd4-4&from=paste&height=103&id=u59306aaf&originHeight=174&originWidth=142&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud6a94f82-b7d0-4b19-8a2d-8898db837b5&title=&width=84)

### 后端配置渐变

```kotlin
    private fun startColor(): Int {
        try {
            return Color.parseColor(startColor)
        } catch (e: Exception) {
            LogUtils.printStackTrace(e)
        }
        return Color.parseColor("#00FFEA")
    }

    private fun endColor(): Int {
        try {
            return Color.parseColor(endColor)
        } catch (e: Exception) {
            LogUtils.printStackTrace(e)
        }
        return Color.parseColor("#00DE90")
    }

    private fun colors(): IntArray {
        return intArrayOf(startColor(), endColor())
    }

    fun getGradientDrawable(): GradientDrawable {

        return GradientDrawable().apply {
            gradientType = GradientDrawable.LINEAR_GRADIENT
            orientation = GradientDrawable.Orientation.TOP_BOTTOM
            cornerRadius = ResUtils.getDimen(R.dimen.dp_10).toFloat()
            colors = colors()
        }
    }
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688144608508-182caa87-39c5-4058-b47b-de6aa0fe1145.png#averageHue=%236ceabe&clientId=u9a8950f1-6bd4-4&from=paste&height=330&id=u293e9db2&originHeight=816&originWidth=726&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4aa10bd7-9e3b-4c4a-827d-856766420fc&title=&width=294)

### 渐变边框

**需求：** 边框颜色是渐变的，边框内不渐变

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:startColor="@color/colorStart"
        android:angle="-45"
        android:endColor="@color/colorEnd"/>
    <size
        android:width="@dimen/color_size"
        android:height="@dimen/color_size"/>
    <corners
        android:radius="@dimen/radius"/>
</shape>
```

这种实现内部也都是填充方式的，如果只绘制边框呢？

**解决：** 通过 `layer-list`，第一层是渐变背景，第二层是内部填充颜色并偏移 2dp，实现一个效果是 2 dp 的渐变边框

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape android:shape="rectangle">
            <corners android:radius="4dp"/>
            <gradient
                android:type="linear"
                android:startColor="#ff28efa2"
                android:endColor="#ff0006"
                android:angle="0" />
        </shape>
    </item>
    <item android:left="2dp"
        android:right="2dp"
        android:top="2dp"
        android:bottom="2dp">
        <shape android:shape="rectangle">
            <corners android:radius="4dp"/>
            <solid android:color="#ffffff"/>
            <padding android:top="12dp"
                android:bottom="12dp"/>
        </shape>
    </item>
</layer-list>
```

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241028104648.png)

观察发现中间是白色，如果想让中间是透明色该怎么实现呢，暂时还没有找到可以通过 xml 实现的方式。

但是可以通过代码的方式实现，使用的类是 ShapeDrawable 类，工具方法如下：

```java
public static ShapeDrawable createDrawable(int[] colors, float radius, float strokeWidth) {
    float[] outerR = {radius, radius, radius, radius, radius, radius, radius, radius};
    // 内部矩形与外部矩形的距离
    RectF inset = new RectF(strokeWidth, strokeWidth, strokeWidth, strokeWidth);
    // 内部矩形弧度
    float innerRadius = radius - strokeWidth;
    float[] innerRadii = {innerRadius, innerRadius, innerRadius, innerRadius, innerRadius, innerRadius, innerRadius, innerRadius};
    RoundRectShape rr = new RoundRectShape(outerR, inset, innerRadii);
    ShapeDrawable.ShaderFactory shaderFactory = new ShapeDrawable.ShaderFactory() {
        @Override
        public Shader resize(int width, int height) {
            return new LinearGradient(0f, 0f, width, height, colors, null, Shader.TileMode.CLAMP);
        }
    };
    ShapeDrawable shapeDrawable = new ShapeDrawable(rr);
    shapeDrawable.setShaderFactory(shaderFactory);
    return shapeDrawable;
}
```
