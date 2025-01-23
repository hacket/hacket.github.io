---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:22:06 pm
title: ConstrainLayout基础
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, ConstraintLayout]
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [ConstraintLayout 和 AS 工具介绍]
linter-yaml-title-alias: ConstraintLayout 和 AS 工具介绍
---

# ConstraintLayout 和 AS 工具介绍

<https://developer.android.com/reference/android/support/constraint/ConstraintLayout>

## ConstraintLayout 特性

1. Relative positioning
2. Margins
3. Centering positioning
4. Circular positioning
5. Visibility behavior
6. Dimension constraints
7. Chains
8. Virtual Helpers objects
9. Optimizer

ConstraintLayout 基本操作：

- ConstraintLayout 中的控件，不添加约束，默认在界面的左上角。
- 想要在 ConstraintLayout 中定义一个 View 的位置，至少需要添加两个约束：一个水平方向、一个垂直方向；<br />如果没有指定某个方向上的约束，那么 View 将会在坐标 `(0,0)` 水平垂直都没有约束或 `(x,0)` 水平有垂直没有或 `(0,y)` 处显示，取决于哪个方向没有约束
- 每个控件的约束都分为垂直和水平两类：
  - 垂直就是上下的圈
  - 水平就是左右的圈
- 删除约束
  - 第一种用于删除一个单独的约束，将鼠标悬浮在某个约束的圆圈上，然后该圆圈会变成红色，这个时候单击一下就能删除了
  - 第二种用于删除某一个控件的所有约束，选中一个控件，然后它的左下角会出现一个删除约束的图标，点击该图标就能删除当前控件的所有约束了
  - 第三种用于删除当前界面中的所有约束，点击工具栏中的删除约束图标即可

## Inspector

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688517992039-533a80ff-e12a-40e2-9c54-1e9d96eaaa81.png#averageHue=%23324c5f&clientId=ucd6c232c-036c-4&from=paste&id=ua59ab897&originHeight=389&originWidth=462&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5e6c8059-2c56-4cdf-ba0d-6ec31b97e2a&title=)<br />

下面这部分称为 Inspector：<br />

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518032569-8398c81f-6237-4558-9d26-6be6c52a35dc.png#averageHue=%233f4244&clientId=ucd6c232c-036c-4&from=paste&id=u42f35120&originHeight=282&originWidth=423&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u52d7ca7f-2359-46d9-b6b1-c583974c177&title=)

### 左和下的轴

可以看到，在 Inspector 中有一个纵向的轴和一个横向的轴，这两个轴也是用于确定控件的位置的。<br />由于给 Button 的上下左右各添加了一个约束，然后 Button 就能居中显示了，其实就是因为这里纵横轴的值都是 50。如果调整了纵横轴的比例，那么 Button 的位置也会随之改变。

- layout_constraintVertical_bias 取值范围 0~1.0，0 靠最上边，1.0 靠最下边
- layout_constraintHorizontal_bias 取值范围 0~1.0，0 靠最左边，1.0 靠最右边

### 中间的白色正方形方框

它是用来控制控件大小的。一共有三种模式可选，每种模式都使用了一种不同的符号表示，点击符号即可进行切换：

- 箭头 `>>>` wrap_content
![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518091891-98481b1f-90d8-40dc-8f4d-fd6c9d1e8049.png#averageHue=%23464b4f&clientId=ucd6c232c-036c-4&from=paste&height=53&id=ud99c4d6d&originHeight=21&originWidth=42&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u96dd552d-b2f8-42fd-90d3-b60db4b556c&title=&width=106) 表示 wrap_content。
- `|——|` Fixed
![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518102925-6d25d643-3fcf-496c-9f70-1901129621e7.png#averageHue=%23464b50&clientId=ucd6c232c-036c-4&from=paste&height=59&id=u57f49b2f&originHeight=22&originWidth=40&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u98b6716d-f19f-4342-936a-3e52c43a644&title=&width=108) 表示固定值，也就是给控件指定了一个固定的长度或宽度值。
- `波浪` Match Constraints
![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518112118-0eaf9db5-294e-4e13-b0c5-45af1cf24490.png#averageHue=%23464e55&clientId=ucd6c232c-036c-4&from=paste&height=56&id=u14edef28&originHeight=20&originWidth=37&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc94b51f1-08bb-4069-82d8-f0bce43111e&title=&width=103) 表示 any size，有点类似于 match_parent，但和 match_parent 不一样，它是属于 ConstraintLayout 中特有的一种大小控制方式。
而 any size 就是用于在 ConstraintLayout 中顶替 match parent 的，怎样使用 any size 实现和 match parent 同样的效果？只要将 width 和 height 设置为 0dp 即可。

> 首先需要说明，在 ConstraintLayout 中是有 match parent 的，只不过用的比较少，因为 ConstraintLayout 的一大特点就是为了解决布局嵌套，既然没有了布局嵌套，那么 match parent 也就没有多大意义了。<br />match_parent 和 any size 区别？<br />match_parent 是用于填充满当前控件的父布局，而 any size 是用于填充满当前控件的约束规则。也就是说有个控件宽度如果设置为 any size，那么它的宽度会和约束的控件的宽度一致。

## Guidelines

需求：如果我们想让两个按钮共同居中对齐该怎么实现呢？其实这个需求很常见，比如说在应用的登录界面，都会有一个登录按钮和一个注册按钮，不管它们是水平居中也好还是垂直居中也好，但肯定都是两个按钮共同居中的。<br />解决：我们希望让这两个按钮在水平方向上居中显示，在垂直方向上都距离底部 64dp，那么就需要先添加一个垂直方向上的 Guideline。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518161454-6c5750aa-9ad3-4981-a33c-63b51338b0ce.png#averageHue=%23a9aeb0&clientId=ucd6c232c-036c-4&from=paste&id=u841ea0b1&originHeight=524&originWidth=646&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8cc6dfee-3c0f-4ea6-8a01-1530ec78ce1&title=)<br />

首先点击通知栏中的 Guidelines 图标可以添加一个垂直或水平方向上的 Guideline，这里我们需要的是垂直方向上的。而 Guideline 默认是使用的 dp 尺，我们需要选中 Guideline，并点击一下最上面的箭头图标将它改成百分比尺，然后将垂直方向上的 Guideline 调整到 50% 的位置，这样就将准备工作做好了。<br />

接下来我们开始实现让两个按钮在水平方向上居中显示，并距离底部 200dp 的功能。可以无缝重定向到对应的

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518175763-40f491e3-802a-40bc-9360-06a0ec81a285.png#averageHue=%232a5172&clientId=ucd6c232c-036c-4&from=paste&id=ub1be39cf&originHeight=451&originWidth=568&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud604c4db-ab3d-4c34-b601-fffd68b4d7d&title=)

这样就实现了让两个按钮在水平方向上居中显示，在垂直方向上都距离底部 64dp 的功能了。

## 自动添加约束

如果界面中的内容变得复杂起来，给每个控件一个个地添加约束也是一件很繁琐的事情。为此，ConstraintLayout 中支持自动添加约束的功能，可以极大程度上简化那些繁琐的操作。<br />

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518197497-2d69794e-77ff-4090-83fa-8b1d7dcd94fa.png#averageHue=%234b4e50&clientId=ucd6c232c-036c-4&from=paste&id=uc2dde605&originHeight=37&originWidth=109&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0837c9b1-1ed0-47ac-a4d8-98d638f7ffc&title=)<br />

分别是：

- `Hide Constraints`
- `Turn on/off Autoconnect` (默认情况下 Autoconnect 是不启用的) 开关闭自动添加约束
- `Clear all Constraints` 清除所有已经添加的约束
- `Infer Constraints` 为所有添加约束

> AutoConnect 只能给当前操作的控件自动添加约束，而 Inference 会给当前界面中的所有元素自动添加约束。因而 Inference 比较适合用来实现复杂度比较高的界面，它可以一键自动生成所有的约束。

## chain

## Ref

- [x] [Android新特性介绍，ConstraintLayout完全解析](http://blog.csdn.net/guolin_blog/article/details/53122387)

# 基本用法

## layout_constraintXXX_toXXXOf 基本方向约束

`app:layout_constraintXXX_toXXXOf`

### 左右 Left/Start Right/End

- app:layout_constraintLeft_toLeftOf<br />表示此控件的左边框与某个控件的左边框对齐或者在其右边
- app:layout_constraintLeft_toRightOf<br />表示此控件的左边框与某个控件的右边框对齐或在其右边
- app:layout_constraintRight_toLeftOf<br />表示此控件的右边框与某个控件的左边框对齐或在其左边
- app:layout_constraintRight_toRightOf<br />表示此控件的右边框与某个控件的右边框对齐或在其左边

> Start 和 Left，Right 和 End，只是 Start 和 End 适配了 RTL

### 上下 constraintTop_toTopOf/constraintTop_toBottomOf

- app:layout_constraintTop_toTopOf<br />表示此控件的顶部边框与某个控件的顶部边框水平对齐或在其下边
- app:layout_constraintTop_toBottomOf<br />表示此控件的顶部边框与某个控件的底部边框水平对齐或在其下边
- app:layout_constraintBottom_toTopOf
- app:layout_constraintBottom_toBottomOf

### 基线 constraintBaseline_toBaselineOf

> 这个控件的基线与谁的基线对齐，两个文本是基线对齐

案例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/tv1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="20"
        android:textColor="@color/black"
        android:textSize="50sp"
        android:textStyle="bold"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="¥"
        android:textColor="@color/black"
        android:textSize="20sp"
        app:layout_constraintBaseline_toBaselineOf="@id/tv1"
        app:layout_constraintStart_toEndOf="@id/tv1" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518347831-4e2c3bbb-2414-4da9-9186-e9668a92e326.png#averageHue=%23cee7f0&clientId=ucd6c232c-036c-4&from=paste&id=uee680c2c&originHeight=165&originWidth=299&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1382f611-da7c-4488-894f-04615dfc604&title=)

## constraintCircleXXX ConstraintLayout 方位角

> 需要一个控件在某个控件的某个角度的位置

```xml
app:layout_constraintCircle=""         目标控件id
app:layout_constraintCircleAngle=""    对于目标的角度(0-360)
app:layout_constraintCircleRadius=""   到目标中心的距离
```

案例：

```java
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <ImageView
        android:id="@+id/android"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:src="@drawable/android"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <ImageView
        android:id="@+id/jetpack"
        android:layout_width="60dp"
        android:layout_height="60dp"
        android:src="@drawable/jetpack"
        app:layout_constraintCircle="@+id/android"
        app:layout_constraintCircleAngle="45"
        app:layout_constraintCircleRadius="70dp" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

> jetpack 图标在 android 图标的 45 度方向，距离为 60dp

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518360444-e2df600a-df6f-4417-b3cf-38f8ee0eeb94.png#averageHue=%23c4eeed&clientId=ucd6c232c-036c-4&from=paste&id=uad1c5d7a&originHeight=332&originWidth=414&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubb290871-62d4-420c-adc3-bf1466fabe1&title=)

## constraintHorizontal_bias/constraintVertical_bias 百分比偏移，约束强度

> 让控件在父布局的水平方向或垂直方向的百分之多少的位置

**注意：** 在使用百分比偏移时，需要指定对应位置的约束条件

```
app:layout_constraintHorizontal_bias=""   水平偏移 默认是0.5，取值范围是0-1的小数 (0最左边 1最右边)
app:layout_constraintVertical_bias=""     垂直偏移 默认是0.5，取值范围是0-1的小数 (0最上边 1 最底边)
```

案例：控件 A 在父布局水平方向偏移 0.3（30%），垂直方向偏移 0.8（80%）

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:layout_width="100dp"
        android:layout_height="60dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.3"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.8" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518427300-01d0c579-377b-49f7-8d49-708071d79adf.png#averageHue=%23d8f0fc&clientId=ucd6c232c-036c-4&from=paste&height=437&id=u812ec928&originHeight=640&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4577fbd0-474e-4ad2-93ce-325d5936540&title=&width=246)

## 控件内边距/外边距、GONE Margin

### 控件内边距、外边距

ConstraintLayout 的内边距和外边距的使用方式其实是和其他布局一致的

```xml
<!--  外边距  -->
android:layout_margin="0dp"
android:layout_marginStart="0dp"
android:layout_marginLeft="0dp"
android:layout_marginTop="0dp"
android:layout_marginEnd="0dp"
android:layout_marginRight="0dp"
android:layout_marginBottom="0dp"

<!--  内边距  -->
android:padding="0dp"
android:paddingStart="0dp"
android:paddingLeft="0dp"
android:paddingTop="0dp"
android:paddingEnd="0dp"
android:paddingRight="0dp"
android:paddingBottom="0dp"
```

### GONE Margin 依赖的控件不可见的 margin

> 当依赖的目标 view 隐藏时会生效的属性；例如 B 被 A 依赖约束，当 B 隐藏时 B 会缩成一个点，A 自身的 margin 效果失效，A 设置的 GONE Margin 就会生效

```
<!--  GONE Margin  -->
app:layout_goneMarginBottom="0dp"
app:layout_goneMarginEnd="0dp"
app:layout_goneMarginLeft="0dp"
app:layout_goneMarginRight="0dp"
app:layout_goneMarginStart="0dp"
app:layout_goneMarginTop="0dp"
```

案例：B 依赖于 A 的位置

- A 未 GONE

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/v1_A"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_marginLeft="50dp"
        android:layout_marginTop="50dp"
        android:background="@color/colorPrimary"
        android:gravity="center"
        android:text="A"
        android:visibility="visible"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/v2_B"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_marginLeft="10dp"
        android:background="@color/blue_500"
        android:gravity="center"
        android:text="B"
        app:layout_constraintLeft_toRightOf="@id/v1_A"
        app:layout_constraintTop_toTopOf="@id/v1_A"
        app:layout_goneMarginLeft="5dp" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518540164-30e0474d-cc3e-47ed-a444-0d5646b23478.png#averageHue=%23adc7cc&clientId=ucd6c232c-036c-4&from=paste&height=165&id=uf135cb8f&originHeight=216&originWidth=352&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uf6e3f256-876a-4d48-b0ea-89ab51dbe82&title=&width=269)

- A GONE 了，自身的 margin 都失效了

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518547682-15c803fe-b2be-4549-a354-26ab23dce57d.png#averageHue=%2393b7e1&clientId=ucd6c232c-036c-4&from=paste&height=97&id=u36121b6a&originHeight=152&originWidth=200&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4f4f9dd5-f28c-48c7-9b83-5e8460ee473&title=&width=128)

### 负数 margin

ConstraintLayout 不支持负数 margin

#### 解决 1：translationX/translationY

可用 `android:translationY="-50dp"` 替代：

```xml
android:translationY="-50dp"
```

<https://stackoverflow.com/questions/42984909/how-to-achieve-overlap-negative-margin-on-constraint-layout>

#### 解决 2：Space

#### 解决 3：用 Guideline 辅助定位

## 控件尺寸

### 尺寸限制 (min/maxWidth, min/maxHeight)

在 ConstraintLayout 中提供了一些尺寸限制的属性，可以用来限制最大、最小宽高度，这些属性只有在给出的宽度或高度为 `wrap_content` 时才会生效，比如想给宽度设置最小或最大值，那宽度就必须设置为 wrap_content，这个比较简单就不放示例代码了，具体的属性如下：

```xml
android:minWidth=""   设置view的最小宽度
android:minHeight=""  设置view的最小高度
android:maxWidth=""   设置view的最大宽度
android:maxHeight=""  设置view的最大高度
```

### 尺寸约束 (0dp/MATCH_CONSTRAINT)

控件的宽高有三种方式为其设置：

- 确定尺寸
- WRAP_CONTENT 为包裹的内容的宽度，默认会不受约束限制，可超出 margin（margin 等）
- 0dp(MATCH_CONSTRAINT) `MATCH_PARENT` 不再持了，通过 MATCH_CONSTRAINT 替代

> 并且 0dp 的作用会根据设置的类型而产生不同的作用，进行设置类型的属性是 layout_constraintWidth_default 和 layout_constraintHeight_default，取值可为 spread、percent、wrap，spread 为默认值。

- spread：铺满可用空间
- percent：自身 view 的尺寸是父布局尺寸的一定比例，配合 layout_constraintWidth_percent 使用（配置了 layout_constraintWidth_percent 后，layout_constraintWidth_default=percent 可以省略）
- wrap 匹配内容大小但不超过约束限制

> spead/percent/wrap 都是针对 0dp 才有效，配置了具体的值或者 wrap_content，这三个配置就失效了

案例：

1. layout_constraintWidth_default="spread"，layout_width=0dp，宽度会铺满

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/A"
        android:layout_width="0dp"
        android:layout_height="60dp"
        android:layout_marginStart="50dp"
        android:layout_marginTop="50dp"
        android:layout_marginEnd="50dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_default="spread" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518602348-dfc043d4-a1a5-4071-98e8-58bd2059f996.png#averageHue=%23cde9f5&clientId=ucd6c232c-036c-4&from=paste&id=uaef06fcd&originHeight=266&originWidth=898&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3bfb141b-cffa-48e7-b23a-56c9ce91873&title=)<br />![](http://note.youdao.com/yws/res/58931/28CB0A5052F44282B3FE8953C3A901A6#id=VTdeR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

2. layout_constraintWidth_default="percent"，自身宽度按照父布局的百分比设置

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/A"
        android:layout_width="0dp"
        android:layout_height="60dp"
        android:layout_marginTop="50dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_default="percent"
        app:layout_constraintWidth_percent="0.5" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518608748-37a224b8-27ce-47cd-accf-0b832a23d25f.png#averageHue=%23d2ecf9&clientId=ucd6c232c-036c-4&from=paste&id=u0a814ff2&originHeight=258&originWidth=894&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6021e5a3-fe6e-4090-a457-6930c221ba5&title=)

> percent 模式的意思是自身 view 的尺寸是父布局尺寸的一定比例，上图所展示的是宽度是父布局宽度的 0.5（50%，取值是 0-1 的小数），该模式需要配合 layout_constraintWidth_percent 使用，但是写了 layout_constraintWidth_percent 后，layout_constraintWidth_default="percent" 其实就可以省略掉了

3. layout_constraintWidth_default="wrap"

```xml
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <!--  宽度设置为wrap_content  -->
    <TextView
        android:id="@+id/A"
        android:layout_width="wrap_content"
        android:layout_height="60dp"
        android:layout_marginStart="100dp"
        android:layout_marginTop="50dp"
        android:layout_marginEnd="100dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="AAAAAAAAAAAAAAAAAA"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_default="spread" />

    <!--  宽度设置为0dp wrap模式  -->
    <TextView
        android:id="@+id/B"
        android:layout_width="0dp"
        android:layout_height="60dp"
        android:layout_marginStart="100dp"
        android:layout_marginTop="150dp"
        android:layout_marginEnd="100dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="BBBBBBBBBBBBBBBBBBBBBBB"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_default="wrap" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518614760-bb829c37-926f-4a62-a8b4-be75c13b9bb0.png#averageHue=%2377a2b1&clientId=ucd6c232c-036c-4&from=paste&id=ub3fe683a&originHeight=299&originWidth=800&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc3f488b1-6cc0-4bd5-9f0e-2706a5881fa&title=)

> 控件 A 宽度设置为 wrap_content，宽度适应内容大小，并且设置了 margin，但是显然宽度已经超过 margin 的设置值了，而控件 B 宽度设置为 0dp wrap 模式，宽度适应内容大小，并且不会超过 margin 的设置值，也就是不会超过约束限制，这就是这两者的区别

### wrap_content 强制约束 (layout_constrainedWidth/layout_constrainedHeight)

如果一个控件的宽设置为 `WRAP_CONTENT`（包裹内容时，如果实际宽度超过了约束的最大宽度，那么约束 margin 会失效（高同理），为了防止约束失效，增加了以下属性（这样可能会变慢，一般情况下不要用）：

```xml
<!--  当一个view的宽或高,设置成wrap_content时  -->
app:layout_constrainedWidth="true|false"
app:layout_constrainedHeight="true|false"
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/A"
        android:layout_width="wrap_content"
        android:layout_height="60dp"
        android:layout_marginStart="100dp"
        android:layout_marginTop="50dp"
        android:layout_marginEnd="100dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="AAAAAAAAAAAAAAAAAA"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constrainedWidth="true"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_default="spread" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518625892-ba50551e-7250-4ea9-9b2f-9d566308a429.png#averageHue=%23cbe7f4&clientId=ucd6c232c-036c-4&from=paste&id=u3583bae1&originHeight=196&originWidth=448&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc14eb97d-19e5-4c2a-b886-9c30c86e9ed&title=)

### min/max (0dp 下 width/height 的最小/最大值)

```
app:layout_constraintWidth_min=""   0dp下，宽度的最小值
app:layout_constraintHeight_min=""  0dp下，高度的最小值
app:layout_constraintWidth_max=""   0dp下，宽度的最大值
app:layout_constraintHeight_max=""  0dp下，高度的最大值
```

### 宽高比 (layout_constraintDimensionRatio)

> ConstraintLayout 中可以对宽高设置比例，前提是至少有一个约束维度设置为 0dp，这样比例才会生效

比例值有两种取值：

- 浮点值，表示宽度和高度之间的比率
- 宽度: 高度，表示宽度和高度之间形式的比率

ratio = 宽/高<br />要使用 layout_constraintDimensionRatio 属性，需要至少设置宽度或者高度为 0dp，宽高的尺寸比例可以通过 `float值` 或者 `宽度：高度` 的形式来设置<br />如果宽度和高度都是 0dp ，系统会使用满足所有约束条件和宽高比率值的最大尺寸如果要根据其中一个尺寸来约束另外一个尺寸，则可以在比率值的前面添加 W 或者 H 来指明约束宽度或者高度

```xml
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <TextView
            android:id="@+id/tv1"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:background="#f5ec7e"
            android:gravity="center"
            android:text="Hello World!"
            app:layout_constraintDimensionRatio="h,2:1"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"/>
    <TextView
            android:id="@+id/tv2"
            android:layout_width="100dp"
            android:layout_height="0dp"
            android:background="#5476fd"
            android:gravity="center"
            android:text="Hello World!"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintDimensionRatio="W,15:25"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@+id/tv1"/>
</android.support.constraint.ConstraintLayout>
```

## 设置控件之间的权重（layout_constraintHorizontal_weight）

ConstraintLayout 也可以像 LinearLayout 一样为子控件设置 layout_weight 属性，从而控件子控件之间的宽高占比。

通过 `layout_constraintHorizontal_weight` 设置，weight 越大，占用空间越大

1. 如果设置的是 wrap_content，那么这个属性失效，尺寸为 wrap_content 答谢
2. 如果设置的是 match_parent，也失效
3. 只有设置为 0dp 才有效

```xml
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <TextView
            android:id="@+id/tv1"
            android:layout_width="0dp"
            android:layout_height="50dp"
            android:background="#f5ec7e"
            android:gravity="center"
            android:text="Hello World!"
            app:layout_constraintHorizontal_chainStyle="spread_inside"
            app:layout_constraintHorizontal_weight="1.5"
            app:layout_constraintRight_toLeftOf="@+id/tv2"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintTop_toTopOf="parent"/>
    <TextView
            android:id="@+id/tv2"
            android:layout_width="0dp"
            android:layout_height="50dp"
            android:background="#55e4f4"
            android:gravity="center"
            android:text="Hello World!"
            app:layout_constraintHorizontal_chainStyle="spread_inside"
            app:layout_constraintHorizontal_weight="1"
            app:layout_constraintLeft_toRightOf="@+id/tv1"
            app:layout_constraintRight_toLeftOf="@+id/tv3"
            app:layout_constraintTop_toTopOf="parent"/>
    <TextView
            android:id="@+id/tv3"
            android:layout_width="0dp"
            android:layout_height="50dp"
            android:background="#f186ad"
            android:gravity="center"
            android:text="Hello World!"
            app:layout_constraintHorizontal_chainStyle="spread_inside"
            app:layout_constraintHorizontal_weight="1"
            app:layout_constraintLeft_toRightOf="@+id/tv2"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"/>
</android.support.constraint.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518640246-b1ab6670-08f2-4f2a-862d-1505db8a1cc5.png#averageHue=%23486b78&clientId=ucd6c232c-036c-4&from=paste&id=u7c15f121&originHeight=92&originWidth=1114&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue9470f04-2409-4b16-953d-2a0faacdf23&title=)

## Chains (链)

Chains(链) 也是一个非常好用的特性，它是将许多个控件在水平或者垂直方向，形成一条链，用于平衡这些控件的位置，那么如何形成一条链呢？形成一条链要求链中的控件在水平或者垂直方向，首尾互相约束，这样就可以形成一条链，水平方向互相约束形成的就是一条水平链，反之则是垂直链。

### Chains 概念

Chain 链比较难描述，它是一种特殊的约束，可以为多个通过 chain 链连接的 View 来分发剩余空间位置，类似于 LinearLayout 中的权重比 weight 属性，但 Chains 链要强大得多

1. 链条：一组小控件通过双向连接，其为链条；我中有你，你中有我建立双向链接
2. 链条头：链条由在链的第一个元素（链的 " 头 "）上设置的属性控制；头是水平链最左边的 View，或垂直链最顶端的 View
3. 链的 margin：如果在连接上指定了边距，则将被考虑在内
4. 链条样式：当在链的第一个元素上设置属性 `layout_constraintHorizontal_chainStyle` 或 `layout_constraintVertical_chainStyle` 时，链的行为将根据指定的样式（默认为 CHAIN_SPREAD）而更改，属性值有以下三种：

- spread：元素将被展开（默认样式）；加权链， 在 spread 模式下，设置为 0dp，均分剩余空间，和 LinearLayout 的 weight 一样。
- spread_inside：类似，但链的端点将不会扩展；两侧空间贴近两两边，剩余控件均分剩余空间
- packed：链的元素将被打包在一起。 孩子的水平或垂直偏差属性将影响包装元素的定位

### Chains 例子

以 layout_constraintHorizontal_chainStyle 为例，该属性不是写在 ConstraintLayout 上，是写在第一个元素上

#### spread

1. 当参数值为 spread 以及控件宽度非 0 时，所有链条都会被展开 ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575265514-64d8d21a-d7e6-4a1d-9f6d-f4fb723c6525.png#averageHue=%234f6989&clientId=ucd6c232c-036c-4&from=paste&id=u4df88e50&originHeight=174&originWidth=700&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u30157227-d93f-4fe4-a295-75fdd82fbdf&title=)
2. 当参数值为 spread 以及控件宽度为 0dp（即 MATCH_CONSTRAINT 时，和 LinearLayout 的 weight 效果类似 ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575288042-618a6be7-c70b-4565-9570-7d2d674adf98.png#averageHue=%23486487&clientId=ucd6c232c-036c-4&from=paste&id=u87d4f901&originHeight=174&originWidth=700&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u492d931b-0c0d-46de-af00-67a4d1fcaab&title=)

#### packed

当参数值为 packed 以及控件宽度非 0 时，链条上的点聚集到一起![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575293776-0e68ff65-bcf0-4c72-a07f-285b7a9c37db.png#averageHue=%23516b8c&clientId=ucd6c232c-036c-4&from=paste&id=ub6a2f2df&originHeight=181&originWidth=700&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3f3d060d-df29-4a32-bb97-ab27f0cf006&title=)

> 如果控件的宽度为 0dp 时，那就和 spread 一样了

#### spread_inside

当参数值为 spread_inside 以及控件宽度非 0 时，两端点不展开，中间的点展开![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575312648-2f824168-31a6-4191-b332-d55ee21910a7.png#averageHue=%23506a8c&clientId=ucd6c232c-036c-4&from=paste&id=u5e1fe7e4&originHeight=174&originWidth=700&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u77557585-21a2-4155-8e87-e2776402e42&title=)

> 如何控件宽度为 0dp，match_constraint 时，那么和 spread 效果一样。

#### 加权链（Weighted chains，layout_constraintHorizontal_weight 和 layout_constraintVertical_weight）

同 LinearLayout 的 weight 类似。

链的默认行为是在可用空间中平均分配元素。如果一个或多个元素使用 0dp(MATCH_CONSTRAINT)，它们将使用剩余的空白空间（在它们之间相等）。如果其中有某个元素没有使用 0dp，而是使用 wrap_content，那么优先摆放 wrap_content 的元素，然后再按照 weight 来摆放剩余的元素。

属性 `layout_constraintHorizontal_weight` 和 `layout_constraintVertical_weight` 将决定这些都设置了 MATCH_CONSTRAINT 的 View 如何分配空间。

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/A"
        android:layout_width="0dp"
        android:layout_height="80dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toStartOf="@id/B"
        app:layout_constraintHorizontal_weight="2"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/B"
        android:layout_width="0dp"
        android:layout_height="80dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="B"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toStartOf="@id/C"
        app:layout_constraintHorizontal_weight="1"
        app:layout_constraintStart_toEndOf="@id/A"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/C"
        android:layout_width="0dp"
        android:layout_height="80dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="C"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_weight="3"
        app:layout_constraintStart_toEndOf="@id/B"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575362434-f7d63d06-d217-47db-8299-62c6dd04d26d.png#averageHue=%23c7ecf8&clientId=ucd6c232c-036c-4&from=paste&id=u1ab12d68&originHeight=147&originWidth=651&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufbcbd923-c80a-4ba9-aa6e-e809ab3c095&title=)

#### chain 不生效

1. 如果 layout constrainthorizontal chainstyle packed not working 不工作，可能是加错位置了，默认是 spread，只需要在链头添加

```xml
app:layout_constraintVertical_chainStyle="packed"
```

## Guideline（参考线 v1.0）

Guideline 只能用于 ConstraintLayout 中，是一个工具类，不会被显示，仅仅用于辅助布局。(GuideLine 只是为了帮助其他 View 定位而存在，实际上并不会出现在实际界面中)

```
android:orientation="horizontal|vertical"  辅助线的对齐方式
app:layout_constraintGuide_percent="0-1"   百分比方式：距离父级宽度或高度的百分比(小数形式)
app:layout_constraintGuide_begin=""        dp方式：距离父级起始位置的距离(左侧或顶部)
app:layout_constraintGuide_end=""          dp方式：距离父级结束位置的距离(右侧或底部)
```

> 在布局编辑器工具栏添加 Guideline，分为水平和竖直方向，可以为 dp 和百分比，默认为 dp

案例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/Guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.5" />

    <TextView
        android:id="@+id/A"
        android:layout_width="120dp"
        android:layout_height="80dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@id/Guideline" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518720114-4e5dc6c1-14b5-407a-abb2-357d8ca4a433.png#averageHue=%23d1f2fe&clientId=ucd6c232c-036c-4&from=paste&height=355&id=u1bf65f7d&originHeight=1032&originWidth=675&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=49724&status=done&style=none&taskId=ucd5f6090-d980-49d8-bd4d-7b1c66c6514&title=&width=232)

## Barrier（屏障 v1.1）

Barrier，直译为障碍、屏障。在约束布局中，可以使用属性 `constraint_referenced_ids` 属性来引用多个带约束的组件，从而将它们看作一个整体。

1. `app:barrierDirection="top|bottom|left|right|start|end"` 指定方向 用于控制 Barrier 相对于给定的 View 的位置
2. `app:constraint_referenced_ids="id1,id2"` 取值是要依赖的控件的 id，Barrier 将会使用 ids 中最大的一个的宽/高作为自己的位置（多个 id 以逗号隔开）
3. `app:barrierAllowsGoneWidgets` 定义在引用形成 Barrier 的视图 gone 时是否仍然有效

### 什么是 Barrier？

Barrier 是一个看不见的视图，如果其引用形成 Barrier 的视图的大小或位置发生变化，则 Barrier 将其大小调整为所引用视图的最大高度或宽度。就像一个屏障一样，阻止一个或者多个控件越过自己，当某个控件要越过自己的时候，Barrier 会自动移动，避免自己被覆盖。Barrier 可以是垂直或水平的，并且可以创建到引用视图的顶部、底部、左侧或右侧。以下示例可以看出，当调整控件 flow1 和 flow2 的大小或位置时，左侧 Barrier（竖线阴影）调整其位置。这里的控件 see 约束在一左一右两个 Barrier 的正中，为了更好地体现 Barrier 的位置变化

### 案例

#### 案例 1: 姓名和联系方式

姓名和我的联系方式组成一个 Barrier，随着这两个当中某个控件的变化

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/tv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="姓名："
        app:layout_constraintBottom_toBottomOf="@+id/et_name"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/et_name" />

    <TextView
        android:id="@+id/tv_contact"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:text="我的联系方式："
        app:layout_constraintBottom_toBottomOf="@+id/et_contact"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/et_contact" />

    <EditText
        android:id="@+id/et_name"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:hint="请输入姓名"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/barrier"
        app:layout_constraintTop_toTopOf="parent" />

    <EditText
        android:id="@+id/et_contact"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:hint="请输入联系方式"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/barrier"
        app:layout_constraintTop_toBottomOf="@+id/et_name" />

    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/barrier"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:barrierDirection="right"
        app:constraint_referenced_ids="tv_name,tv_contact" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

其中 `constraint_referenced_ids` 指定限定源 id,多个 id 用逗号隔开<br />`barrierDirection` 指定限制的方向,有 left, right, top, bottom, start, end, 6 种上面代表的是 barrier 以 tv_name 和 tv_contact 两者最右侧为基准线来作为自己的定位<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688574198368-9d1f02de-d0a5-4aed-9f65-4f3fd86e607c.png#averageHue=%23dfdfdf&clientId=ucd6c232c-036c-4&from=paste&height=635&id=u74e0841e&originHeight=2960&originWidth=1440&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u25511011-2375-4680-a8bc-7b549cf7982&title=&width=309)

#### 案例 2： 糗百注册登录

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:background="@color/common_white"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <com.qiushibaike.common.widget.CommonHeadView
            android:id="@+id/chv_head_view"
            app:head_centertitleVisible="true"
            app:head_centertitle="绑定手机号"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            android:layout_width="match_parent"
            android:layout_height="@dimen/button_default_height">
    </com.qiushibaike.common.widget.CommonHeadView>
    <View
            android:id="@+id/divider0"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@+id/chv_head_view"
            style="@style/Divider.Horizontal"/>
    <!--绑定手机号-->
    <com.qiushibaike.common.widget.InewsTextView
            android:id="@+id/tv_bind_phone_label"
            style="@style/CommonText.Large.Black"
            app:layout_constraintHorizontal_chainStyle="spread_inside"
            android:text="绑定手机"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            app:layout_constraintLeft_toLeftOf="@+id/divider1"
            app:layout_constraintTop_toBottomOf="@+id/divider0"
            app:layout_constraintBottom_toTopOf="@+id/divider1"/>
    <!--输入手机号-->
    <com.qiushibaike.common.widget.clearedittext.ClearEditText
            android:id="@+id/et_bind_phone_verifycode"
            style="@style/LoginEdittxt"
            android:inputType="number"
            android:layout_width="0dp"
            app:showDelete="false"
            android:layout_marginLeft="@dimen/common_margin_horizontal"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            app:layout_constraintBaseline_toBaselineOf="@id/tv_bind_phone_label"
            app:layout_constraintLeft_toLeftOf="@+id/barrier_bind_phone"
            app:layout_constraintRight_toLeftOf="@+id/tv_bind_phone_get_verify_code"
            app:layout_constraintTop_toTopOf="@+id/tv_bind_phone_label"
            app:layout_constraintBottom_toBottomOf="@+id/tv_bind_phone_label"
            android:hint="@string/register_enter_phone_number"/>
    <!--获取验证码-->
    <com.qiushibaike.common.widget.TimerTextView
            android:id="@+id/tv_bind_phone_get_verify_code"
            style="@style/CommonText.Medium"
            android:layout_height="34dp"
            android:background="@drawable/shape_withdraw_circle_selected_v2"
            android:padding="@dimen/margin_small"
            app:seconds="60"
            android:paddingLeft="8dp"
            android:paddingRight="8dp"
            app:layout_constraintLeft_toRightOf="@id/et_bind_phone_verifycode"
            app:layout_constraintRight_toRightOf="@+id/divider1"
            app:layout_constraintTop_toBottomOf="@+id/divider0"
            app:layout_constraintBottom_toTopOf="@+id/divider1"
            app:befor_text_color="@color/main_text_color3"
            app:after_text_color="@color/main_text_color5"
            android:text="@string/register_get_verifycode"/>
    <View
            android:id="@+id/divider1"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            android:layout_marginLeft="@dimen/common_margin_horizontal"
            android:layout_marginTop="60dp"
            app:layout_constraintTop_toBottomOf="@id/divider0"
            style="@style/Divider.Horizontal"/>
    <!--验证码-->
    <com.qiushibaike.common.widget.InewsTextView
            android:id="@+id/tv_bind_verify_code_label"
            style="@style/CommonText.Large.Black"
            app:layout_constraintHorizontal_chainStyle="spread_inside"
            android:text="验证码"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            app:layout_constraintLeft_toLeftOf="@+id/divider1"
            app:layout_constraintTop_toBottomOf="@+id/divider1"
            app:layout_constraintBottom_toTopOf="@+id/divider2"/>
    <!--输入手机号-->
    <com.qiushibaike.common.widget.clearedittext.ClearEditText
            android:id="@+id/et_enter_verifycode"
            style="@style/LoginEdittxt"
            android:inputType="number"
            android:layout_width="0dp"
            app:showDelete="false"
            android:layout_marginLeft="@dimen/common_margin_horizontal"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            app:layout_constraintBaseline_toBaselineOf="@+id/tv_bind_verify_code_label"
            app:layout_constraintLeft_toLeftOf="@+id/barrier_bind_phone"
            app:layout_constraintRight_toRightOf="parent"
            android:hint="@string/register_enter_verifycode"/>
    <View
            android:id="@+id/divider2"
            app:layout_constraintLeft_toLeftOf="@+id/divider1"
            app:layout_constraintRight_toRightOf="@+id/divider1"
            app:layout_constraintTop_toBottomOf="@+id/divider1"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            android:layout_marginLeft="@dimen/common_margin_horizontal"
            android:layout_marginTop="60dp"
            style="@style/Divider.Horizontal"/>
    <android.support.constraint.Barrier
            android:id="@+id/barrier_bind_phone"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            app:barrierDirection="right"
            app:constraint_referenced_ids="tv_bind_phone_label,tv_bind_verify_code_label"/>
    <com.qiushibaike.common.widget.InewsButton
            android:id="@+id/btn_bind_go"
            style="@style/CommonButton"
            android:layout_height="45dp"
            android:layout_marginTop="30dp"
            android:layout_width="0dp"
            android:layout_marginRight="@dimen/common_margin_horizontal"
            android:layout_marginLeft="@dimen/common_margin_horizontal"
            android:background="@drawable/selector_withdraw_hint_btn_bg"
            app:layout_constraintLeft_toLeftOf="@+id/divider2"
            app:layout_constraintRight_toRightOf="@+id/divider2"
            app:layout_constraintTop_toBottomOf="@+id/divider2"
            android:text="提交"/>
</android.support.constraint.ConstraintLayout>
```

#### 案例 3：国际化

这里有三个文本视图：左边的 textView1 和 textView2；右边的 textView3。textView3 被限制在 textView1 的末尾，这工作得很好——它完全根据我们需要来定位和大小 textView3。

然而，如果我们需要支持多种语言，事情会变得更加复杂。如果我们添加德语翻译，那么我们就会遇到一个问题，因为在英文版本中，textView1 中的文本比 textView2 中的文本长，而在德语中，textView2 中的文本比 textView1 长

这里的问题在于 textView3 仍然是相对于 textView1 的，所以 textView2 直接插入了 textView3 中。在设计视图里看起来更明显（白色背景的那个）。比较直接的解决办法是使用 TableLayout，或者把 textView1 & textView2 包裹在一个垂直的，android:layout_width="wrap_content" 的 LinearLayout 中。然后让 textView3 约束在这个 LinearLayout 的后面。但是我们有更好的办法：Barriers。

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/textView1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="16dp"
        android:layout_marginTop="16dp"
        android:text="@string/warehouse"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/textView2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="16dp"
        android:layout_marginTop="8dp"
        android:text="@string/hospital"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView1" />

    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/barrier7"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:barrierDirection="end"
        app:constraint_referenced_ids="textView2,textView1" />

    <TextView
        android:id="@+id/textView3"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="8dp"
        android:text="@string/lorem_ipsum"
        app:layout_constraintStart_toEndOf="@+id/barrier7"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575007470-06a7b195-fef5-410c-abc2-0d711f65823a.png#averageHue=%23394b61&clientId=ucd6c232c-036c-4&from=paste&id=ua0d8fe0f&originHeight=681&originWidth=793&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u94d2c848-3a09-45be-a9ce-b0a789221a3&title=)

## Group (组 v1.1)

> 多个控件同时隐藏或者显示的场景

```
app:constraint_referenced_ids="id,id"  加入组的控件id
```

案例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:context=".MainActivity"
    tools:ignore="HardcodedText">

    <TextView
        android:id="@+id/A"
        android:layout_width="100dp"
        android:layout_height="60dp"
        android:layout_marginTop="56dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="A"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.115"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/B"
        android:layout_width="100dp"
        android:layout_height="60dp"
        android:layout_marginTop="280dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="B"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.758"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/C"
        android:layout_width="100dp"
        android:layout_height="60dp"
        android:layout_marginTop="164dp"
        android:background="@drawable/tv_bg"
        android:gravity="center"
        android:text="C"
        android:textColor="@color/black"
        android:textSize="25sp"
        android:textStyle="bold"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.437"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.constraintlayout.widget.Group
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:visibility="visible"
        app:constraint_referenced_ids="A,B,C" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518664160-c1a7a08e-fc38-424d-ab25-819c45179904.png#averageHue=%23d5f0fb&clientId=ucd6c232c-036c-4&from=paste&height=362&id=u98a9ad92&originHeight=540&originWidth=449&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4b6958f2-deee-4f38-865f-1e569776a96&title=&width=301)

### Group 注意

1、使用多个 Group 时，尽量不要将某个 View 重复的放在 多个 Group 中，实测可能会导致隐藏失效<br />2、当 一个 View 被放到 Group 控制显隐状态时，若 Group 的状态是显示，则是没法在代码中隐藏这个 View 的（设置了 GONE 后能立即 get 到 GONE，但下次 get 到的仍是 VISIBLE，猜测是 ConstraintLayout 在 onDraw 中强制用 Group 设置了 View 的显隐）

## Placeholder（占位符）

Placeholder （占位符）用于和一个视图关联起来，通过 `setContentId()` 方法将占位符转换为指定的视图，即视图将在占位符所在位置上显示，如果此时布局中已包含该视图，则视图将从原有位置消失

### 案例 1：占位替换

```xml
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <Button
            android:id="@+id/btn_setContentId"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:onClick="setContentId"
            android:text="setContentId"
            android:textAllCaps="false"/>

    <ImageView
            android:id="@+id/iv_target"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            app:srcCompat="@drawable/ic_launcher_background"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/btn_setContentId"/>

    <android.support.constraint.Placeholder
            android:id="@+id/placeholder"
            android:background="#aa000000"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:padding="10dp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"/>

</android.support.constraint.ConstraintLayout>
```

代码替换

```java
btn_setContentId.setOnClickListener {
    val placeholder = findViewById<Placeholder>(R.id.placeholder)
    placeholder.setContentId(R.id.iv_target)
}
```

### 案例 2： PlaceHolder 模板，配合 TransitionManager

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/root">

    <ImageView
            android:id="@+id/top_image"
            android:scaleType="fitXY"
            android:src="@drawable/place_holder_demo"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

    <include layout="@layout/holder_template"/>

    <ImageView
            android:id="@+id/save"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:layout_constraintBottom_toBottomOf="parent"
            android:src="@drawable/edit_job_checkbox_checked"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintHorizontal_bias="0.5"
            app:layout_constraintEnd_toStartOf="@+id/edit"/>

    <ImageView
            android:id="@+id/edit"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:layout_constraintBottom_toBottomOf="parent"
            android:src="@drawable/empty_about_comment"
            app:layout_constraintStart_toEndOf="@+id/save"
            app:layout_constraintHorizontal_bias="0.5"
            app:layout_constraintEnd_toStartOf="@+id/cancel"/>

    <ImageView
            android:id="@+id/cancel"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:layout_constraintBottom_toBottomOf="parent"
            android:src="@drawable/emoji_tuotuo_selected"
            app:layout_constraintStart_toEndOf="@+id/edit"
            app:layout_constraintHorizontal_bias="0.5"
            app:layout_constraintEnd_toStartOf="@+id/delete"/>

    <ImageView
            android:id="@+id/delete"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:layout_constraintBottom_toBottomOf="parent"
            android:src="@drawable/duobao_start"
            app:layout_constraintStart_toEndOf="@+id/cancel"
            app:layout_constraintHorizontal_bias="0.5"
            app:layout_constraintEnd_toEndOf="parent"/>

</android.support.constraint.ConstraintLayout>

<!--PlaceHolder-->
<?xml version="1.0" encoding="utf-8"?>
<merge xmlns:android="http://schemas.android.com/apk/res/android"
       xmlns:app="http://schemas.android.com/apk/res-auto"
       xmlns:tools="http://schemas.android.com/tools"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       tools:parentTag="android.support.constraint.ConstraintLayout">

    <android.support.constraint.Placeholder
            android:id="@+id/template_main_image"
            android:layout_width="0dp"
            android:layout_height="0dp"
            android:layout_marginTop="16dp"
            app:content="@+id/top_image"
            app:layout_constraintDimensionRatio="16:9"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"/>

    <android.support.constraint.Placeholder
            android:id="@+id/template_action"
            android:layout_width="48dp"
            android:layout_height="48dp"
            app:content="@+id/save"
            app:layout_constraintBottom_toBottomOf="@id/template_main_image"
            app:layout_constraintHorizontal_bias="0.80"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@id/template_main_image"/>

</merge>
```

Java 代码

```java
public void initViews(@Nullable Bundle savedInstanceState) {
    mainAction = (Placeholder) findViewById(R.id.template_action);
    constraintLayout = (ConstraintLayout) findViewById(R.id.root);
    save = findViewById(R.id.save);
    delete = findViewById(R.id.delete);
    cancel = findViewById(R.id.cancel);
    edit = findViewById(R.id.edit);
    save.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            TransitionManager.beginDelayedTransition(constraintLayout);
            mainAction.setContentId(view.getId());
        }
    });
    cancel.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            TransitionManager.beginDelayedTransition(constraintLayout);
            mainAction.setContentId(view.getId());
        }
    });
    edit.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            TransitionManager.beginDelayedTransition(constraintLayout);
            mainAction.setContentId(view.getId());
        }
    });
    delete.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            TransitionManager.beginDelayedTransition(constraintLayout);
            mainAction.setContentId(view.getId());
        }
    });
}
```

## Space/负数 margin

> ConstraintLayout 低版本不支持负数 margin，高版本好像支持

`Space` 是一个轻量级的 View 子类，可用于在通用布局中创建组件之间的间隙。

- 应用场景

两个布局部分重叠在一起了，不能采用 margin 负数，可采用 Space 来处理

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ImageView
        android:id="@+id/iv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="100dp"
        android:contentDescription="@null"
        android:src="@mipmap/ic_launcher"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <android.widget.Space
        android:id="@+id/space"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_marginBottom="20dp"
        android:layout_marginEnd="20dp"
        android:background="@android:color/holo_blue_bright"
        app:layout_constraintBottom_toBottomOf="@+id/iv"
        app:layout_constraintEnd_toEndOf="@+id/iv" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="48dp"
        android:background="@android:color/holo_blue_bright"
        android:gravity="center"
        android:text="Hello World!"
        android:textColor="@android:color/white"
        app:layout_constraintStart_toEndOf="@+id/space"
        app:layout_constraintTop_toBottomOf="@+id/space" />
</android.support.constraint.ConstraintLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518754136-01df6584-cf24-4f85-ad55-8c5f100c14e2.png#averageHue=%235ce4fb&clientId=ucd6c232c-036c-4&from=paste&height=316&id=u54ef04b3&originHeight=753&originWidth=921&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=127339&status=done&style=none&taskId=uf9d8503d-fe97-408b-a990-a12c2bc32fe&title=&width=386)

## ConstraintHelper

## Layer（v2.0+）

### Layer 介绍

Layer 可以看作是它引用的 view 的边界（可以理解为包含这些 view 的一个 ViewGroup，但是 Layer 并不是 ViewGroup，Layer 并不会增加 view 的层级）。另外 Layer 支持对里面的 view 一起做变换。<br />Layer 继承自 ConstraintHelper，是一个约束助手，相对于 Flow 来说，Layer 的使用较为简单，常用来增加背景，或者共同动画，图层 (Layer) 在布局期间会调整大小，其大小会根据其引用的所有视图进行调整，代码的先后顺序也会决定着它的位置，如果代码在所有引用 view 的最后面，那么它就会在所有 view 的最上面，反之则是最下面，在最上面的时候如果添加背景，就会把引用的 view 覆盖掉。

### 案例

#### 案例 1：增加背景

考虑这么一个场景，如果一个页面里面有部分 view 需要加个背景，使用 Layer 引用这几个 view，然后给 Layer 设置背景就可以了。如果不用 Layer，只能另外加个 ViewGroup 包住这几个 View 了，这样会增加 view 的层级，不利于性能。

```xml
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:background="@color/black_opacity_30"
    tools:ignore="MissingDefaultResource"
    tools:layout_height="@dimen/qb_px_200"
    tools:layout_width="@dimen/qb_px_200">

    <androidx.constraintlayout.helper.widget.Layer
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:background="@drawable/shape_yellow"
        app:constraint_referenced_ids="tv_sign_title,fl_sign_status"
        app:layout_constraintEnd_toEndOf="parent"
        android:padding="20dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


    <TextView
        android:id="@+id/tv_sign_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textColor="#FF8B25"
        android:textSize="20sp"
        app:layout_constraintBottom_toTopOf="@+id/fl_sign_status"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed"
        tools:text="1" />

    <FrameLayout
        android:id="@+id/fl_sign_status"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="@dimen/qb_px_8"
        app:layout_constraintBottom_toTopOf="@+id/tv_sign_desc"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/tv_sign_title">

        <ImageView
            android:layout_width="@dimen/qb_px_50"
            android:layout_height="@dimen/qb_px_50"
            android:layout_gravity="center"
            android:src="@drawable/ic_add_gold_bean" />
    </FrameLayout>

    <TextView
        android:id="@+id/tv_sign_desc"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="@dimen/qb_px_5"
        android:textColor="@color/gray"
        android:textSize="20sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/fl_sign_status"
        tools:text="5days" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688575952854-f7777c91-4e78-4aca-a587-40f0e61ba073.png#averageHue=%23e0dfd9&clientId=ucd6c232c-036c-4&from=paste&height=777&id=u4a78bf2f&originHeight=2960&originWidth=1440&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3584706c-6656-4e80-9583-5a2d72cb652&title=&width=378)

#### 案例 2：做变换

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">


    <Button
        android:id="@+id/button8"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="8dp"
        android:layout_marginEnd="8dp"
        android:layout_marginBottom="64dp"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <androidx.constraintlayout.helper.widget.Layer
        android:id="@+id/layer"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:background="@drawable/shape_yellow"
        android:padding="32dp"
        app:constraint_referenced_ids="button4,button5,button7,button6,button3,button2"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <Button
        android:id="@+id/button2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="Button"
        app:layout_constraintBottom_toTopOf="@+id/button4"
        app:layout_constraintEnd_toEndOf="@+id/button4"
        app:layout_constraintStart_toStartOf="@+id/button4"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <Button
        android:id="@+id/button3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="Button"
        app:layout_constraintBottom_toTopOf="@+id/button5"
        app:layout_constraintEnd_toEndOf="@+id/button5"
        app:layout_constraintStart_toStartOf="@+id/button5"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <Button
        android:id="@+id/button4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="Button"
        app:layout_constraintBottom_toTopOf="@+id/button6"
        app:layout_constraintEnd_toStartOf="@+id/button5"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/button2" />

    <Button
        android:id="@+id/button5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="Button"
        app:layout_constraintBottom_toTopOf="@+id/button7"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toEndOf="@+id/button4"
        app:layout_constraintTop_toBottomOf="@+id/button3" />

    <Button
        android:id="@+id/button6"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="@+id/button4"
        app:layout_constraintStart_toStartOf="@+id/button4"
        app:layout_constraintTop_toBottomOf="@+id/button4" />

    <Button
        android:id="@+id/button7"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="@+id/button5"
        app:layout_constraintStart_toStartOf="@+id/button5"
        app:layout_constraintTop_toBottomOf="@+id/button5" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

代码：

```kotlin
button8.setOnClickListener {
    val anim = ValueAnimator.ofFloat(0f, 360f)
    anim.duration = 300
    anim.addUpdateListener { animation ->
        val angle = animation.animatedValue as Float
        layer.rotation = angle
        layer.scaleX = 1 + (180 - Math.abs(angle - 180)) / 20f
        layer.scaleY = 1 + (180 - Math.abs(angle - 180)) / 20f


        var shift_x = 500 * Math.sin(Math.toRadians((angle * 5).toDouble())).toFloat()
        var shift_y = 500 * Math.sin(Math.toRadians((angle * 7).toDouble())).toFloat()
        layer.translationX = shift_x
        layer.translationY = shift_y
    }
    anim.duration = 4000
    anim.start()
}
```

## MockView

使用 MockView 来充当原型图

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DAF3FE"
    tools:ignore="HardcodedText">

    <androidx.constraintlayout.utils.widget.MockView
        android:id="@+id/Avatar11"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:layout_marginStart="80dp"
        android:layout_marginTop="100dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.constraintlayout.utils.widget.MockView
        android:id="@+id/Name"
        android:layout_width="100dp"
        android:layout_height="30dp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toEndOf="@id/Avatar11"
        app:layout_constraintTop_toTopOf="@id/Avatar11" />

    <androidx.constraintlayout.utils.widget.MockView
        android:id="@+id/Age"
        android:layout_width="100dp"
        android:layout_height="30dp"
        app:layout_constraintBottom_toBottomOf="@id/Avatar11"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toEndOf="@id/Avatar11" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688518677072-79a7e473-9af1-4c4e-8882-6cda0ca60f76.png#averageHue=%23d7effc&clientId=ucd6c232c-036c-4&from=paste&id=ua9b379e8&originHeight=355&originWidth=468&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u89ec00c6-cd63-44d6-be03-d2aa46e8845&title=)

## Flow (流式虚拟布局 v2.0+)

见 [[ConstraintLayout进阶#Flow 介绍]]
