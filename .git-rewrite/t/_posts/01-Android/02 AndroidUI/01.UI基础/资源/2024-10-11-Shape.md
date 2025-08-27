---
date created: 星期三, 九月 25日 2024, 8:55:00 晚上
date updated: 星期一, 一月 6日 2025, 9:54:43 晚上
title: Shape
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [RectShape]
linter-yaml-title-alias: RectShape
---

# RectShape

## RoundRectShape

### RoundRectShape 原型

- public RoundRectShape([@Nullable](/Nullable) float[] outerRadii, [@Nullable](/Nullable) RectF inset, <br />[@Nullable](/Nullable) float[] innerRadii)

1. outerRadii 第一个和第二个都是 8 个数字数组，表示的的矩形的 4 个角的圆形半径；这 8 个数组分别从左上角开始表示各个弧度的半径，比如说左上角左上角有两个边组成，左边和上边，第一个数字表示的左边这条边最上面的半径，第二个表示上边连接处圆形的半径
2. inset 第二个参数表示的内矩形的位置，距离大矩形左，上，右，下的距离
3. innerRadii 第一个参数表示的外边角 第三个参数表示的内边角，也就是大矩形套小矩形

> 如果后面两个参数都为 null 的话就只有一个大矩形

### 案例

```kotlin
class RoundRectShapeDemo : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_round_rect_shape_demo)

        // 外部矩形弧度：左上、右上、右下、左下的圆角半径
        val outerRadii = floatArrayOf(20F, 20F, 20F, 20F, 20F, 20F, 0F, 0F)
        // 内部矩形与外部矩形的距离 左上角x,y距离， 右下角x,y距离
        val inset = RectF(100F, 10F, 50F, 50F)
        // 内部矩形弧度 内矩形 圆角半径
        val innerRadii = floatArrayOf(1F, 20F, 20F, 20F, 20F, 20F, 20F, 1F)

        val rrs = RoundRectShape(outerRadii, inset, innerRadii)
        val drawable = ShapeDrawable(rrs)
        // 指定填充颜色
        drawable.paint.color = Color.RED
        // 指定填充模式
        drawable.paint.style = Paint.Style.FILL
        tv_test.background = drawable
    }
}
```

![|200](https://cdn.nlark.com/yuque/0/2023/png/694278/1688142975004-01a5f6f9-124c-42a1-bbed-99c10c119413.png#averageHue=%23fce9b5&clientId=ub20f5194-e1f0-4&from=paste&height=251&id=u229f764f&originHeight=382&originWidth=480&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3864a258-d4f2-47ed-93ca-1f9a1ef9aa7&title=&width=316)

## ArcShape 绘制圆形或者扇形

- ArcShape(float startAngle, float sweepAngle)

1. 起始弧度，需要跨越的弧度；负数，则逆时针画弧，如果是正数，则顺时针画弧. 如果是 360 度，则是一个圈，圆的半径即大小你的 ImageView 本身来决定
2. 划过的弧度

```kotlin
class ArcShapeDemo : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_arc_shape_demo)

        val arcShape = ArcShape(0F, 60F)
        val drawable = ShapeDrawable(arcShape)
        // 指定填充颜色
        drawable.paint.color = Color.RED
        // 指定填充模式
        drawable.paint.style = Paint.Style.FILL
        tv_test.background = drawable
    }
}
```

![|200](https://cdn.nlark.com/yuque/0/2023/png/694278/1688142993553-38695951-4998-44e6-9bb8-a3407b78cb37.png#averageHue=%23fdeab5&clientId=ub20f5194-e1f0-4&from=paste&height=178&id=u8cdd9548&originHeight=188&originWidth=312&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud270cfe5-2b8f-4b3c-982a-f30df971308&title=&width=295)

## OvalShape 椭圆

```kotlin
class OvalShapeDemo : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_oval_shape_demo)

        val arcShape = OvalShape()
        val drawable = ShapeDrawable(arcShape)
        // 指定填充颜色
        drawable.paint.color = Color.RED
        // 指定填充模式
        drawable.paint.style = Paint.Style.FILL
        tv_test.background = drawable
    }
}
```

![|200](https://cdn.nlark.com/yuque/0/2023/png/694278/1688143008193-f2575073-02f1-4c54-9ed2-c8da6d8f85f4.png#averageHue=%23fb8c73&clientId=ub20f5194-e1f0-4&from=paste&height=340&id=u060b2c49&originHeight=516&originWidth=308&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubd396c46-75ca-43b2-af3c-33925bc60cb&title=&width=203)
