---
date created: 2024-09-26 15:07
date updated: 2024-12-24 00:28
dg-publish: true
---

# 常用属性

## 设置透明

如果 ImageView 控件使用的【src】属性设置图片，则用【setImageAlpha】设置透明度，如果使用的【background】属性设置图片，则用【getBackground().setAlpha】设置透明度

## adjustViewBounds

当为true时，文档中说是调整ImageView的界限来保持纵横比不变，但这并不意味ImageView的纵横比就一定和图像的纵横比相同

- 如果设置的layout_width与layout_height都是固定值，那么设置adjustViewBounds是没有作用的，ImageView就一直是设定宽和高
- 如果设置的layout_width与layout_height都是wrap_content属性,那么设置adjustViewBounds也没啥用，因为ImageView将始终与图片拥有相同的宽高比（但是并不是相同的宽高值，通常都会放大一些）
- 如果两者中有一个是固定值，一个是wrap_content，比如`layout_width="666px"`,`layout_height="wrap_content"`时，ImageView的宽将始终是666px，而高就有所变化了：
  - 当图片的宽小于666px时，layout_height将与图片的高相同，即图片不会缩放，完整显示在ImageView控件中，ImageView高度与图片实际高度相同。图片没有占满ImageView，ImageView中有空白。
  - 当图片的宽大于等于666px时，此时ImageView将与图片拥有相同的宽高比，因此ImageView的layout_height值为：666除以图片的宽高比。比如图片是500X500的，那么layout_height是666。图片将保持宽高比缩放，完整显示在ImageView中，并且完全占满ImageView。

案例：

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <TextView
        style="@style/LabelText"
        android:text="图片500x312" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 固定尺寸" />

    <ImageView
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽高都wrap_content" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽wrap_content，高固定" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="100dp"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

    <TextView
        style="@style/LabelTextSmall"
        android:text="adjustViewBounds 宽和高都match_parent" />

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:adjustViewBounds="true"
        android:background="@color/gray_500"
        android:src="@drawable/iv_0" />

</LinearLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1698844245502-36efb82f-7f3d-4ca9-971e-1d9968b25277.png#averageHue=%23c7bd8c&clientId=u00f3fd36-98db-4&from=paste&height=649&id=u3d88efbc&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1538219&status=done&style=none&taskId=uc5e7d322-e2ef-4376-b557-d36cc839eb9&title=&width=292)

# ShapeableImageView (API21)

## 什么是ShapeableImageView？

是ImageView的一个子类、通过提供的Shape绘制bitmap

## ShapeableImageView属性

- strokeWidth 描边宽度
- strokeColor 描边颜色
- shapeAppearance ShapeableImageView的形状外观覆盖样式
- shapeAppearanceOverlay 同上，叠加层

# ImageFilterView、ImageFilterButton

## ImageFilterView、ImageFilterButton属性

> 带有圆角、简单滤镜的ImageView和ImageButton(saturation、contrast、warmth、warmth)

支持的滤镜或效果如下：

|              | 介绍                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| altSrc       | Provide and alternative image to the src image to allow cross fading (altSrc提供的资源将会和src提供的资源通过crossfade属性形成交叉淡化效果，默认crossfade=0及altSrc引用的资源不可见，取值0-1)                      |
| round        | 圆角具体值                                                                                                                                                                      |
| roundPercent | 数组类型0-1的小数，根据数值的大小会使图片在方形和圆形之间按比例过度                                                                                                                                        |
| warmth       | This adjust the apparent color temperature of the image.1=neutral, 2=warm, .5=cold 调节色温                                                                                    |
| brightness   | Sets the brightness of the image. 0 = black, 1 = original, 2 = twice as bright 调节亮度                                                                                        |
| saturation   | Sets the saturation of the image. 0 = grayscale, 1 = original, 2 = hyper saturated 调节饱和度                                                                                   |
| contrast     | This sets the contrast. 1 = unchanged, 0 = gray, 2 = high contrast 调节对比度                                                                                                   |
| crossfade    | Set the current mix between the two images. 0=src 1= altSrc image                                                                                                          |
| overlay      | Defines whether the alt image will be faded in on top of the original image or if it will be crossfaded with it. Default is true. Set to false for semitransparent objects |

```xml
<androidx.constraintlayout.utils.widget.ImageFilterView
    android:id="@+id/imageFilterView"
    ...
    android:background="@color/imageBg"
    android:src="@drawable/th"
    app:saturation="2"
    app:brightness="2"
    app:warmth="3"
    app:contrast="2"
    app:crossfade="2"
    app:roundPercent="1"
    app:overlay="true"
/>

<androidx.constraintlayout.utils.widget.ImageFilterButton
    android:id="@+id/imageFilterButton"
    ...
    app:srcCompat="@drawable/th"
    android:background="@color/imageBg"
    app:saturation="0"
    app:brightness="0"
    app:warmth="5"
    app:contrast="1"
    app:crossfade="1"
    app:roundPercent="0.3"
    app:round="16dp"
    app:overlay="true"
/>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688183246982-7561d230-2bdf-4dd5-8a09-fa1ba08e7af7.png#averageHue=%23dbcec4&clientId=udabf1f09-c389-4&from=paste&height=624&id=ub9b4160e&originHeight=2340&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=403149&status=done&style=none&taskId=u7b05dddb-d46a-4199-8e6c-c936b4ae8f7&title=&width=288)
