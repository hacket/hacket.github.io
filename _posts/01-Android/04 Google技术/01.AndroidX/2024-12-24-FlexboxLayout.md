---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# FlexboxLayout

<https://github.com/google/flexbox-layout>

## FlexboxLayout介绍

FlexboxLayout是去年 Google I/O 上开源的一个布局控件，使得 Android 里的 CSS Flexible Layout模块也能拥有同样强大的功能。

FlexboxLayout可以理解成一个高级版的LinearLayout，因为两个布局都把子view按顺序排列。两者之间最大的差别在于FlexboxLayout具有换行的特性。

![](https://raw.githubusercontent.com/google/flexbox-layout/master/assets/flexbox-visual.png#id=rSsOX&originHeight=583&originWidth=1151&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

- flex item<br />FlexBoxLayout的的child view
- main axis 主轴<br />主要的axis，新元素排列方向为主轴，一般是left到right摆放item，从左到右：main start→main end
- cross axix .副轴<br />次要的axis，与主轴垂直方向为副轴，从上到下：cross start→cross end

### FlexboxLayout和FlexboxLayoutManager

两种方式对比，FlexboxLayoutManager部分属性不支持：<br /><https://github.com/google/flexbox-layout#supported-attributesfeatures-comparison>

## FlexboxLayout自身属性

### app:flexDirecition 主轴排列方向

> 子元素在主轴的排列方向

1. row 默认值，主轴为水平方向，起点在左，从左到右
2. row_reverse 和row属性相反，主轴为水平方向，从右到左，起点在右端
3. column 主轴为竖直方向，起点在上端，从上到下
4. column_reverse 和column相反，主轴为竖直方向，起点在下方从下到上

### app:flexWrap 换行方式

> 控制flexbox是否是单行还是多行；控制cross axis的方向。

1. nowrap 不换行。（如果位置不足会压缩子元素）  (default for FlexboxLayout)
2. wrap 按正常方向换行，cross axis从上到下。(default for FlexboxLayoutManager)
3. wrap_reverse 按反方向换行，cross axis从下到上。(not supported by FlexboxLayoutManager)

### app:justifyContent 主轴对齐模式

> 控制主轴上元素的对齐方式

1. flex_start （默认值）左对齐。
2. flex_end 右对齐。
3. center 居中对齐
4. space_between 两端对齐，相邻两元素间隔相等（首尾Item紧贴边界，Item平分内部空隙）
5. space_around 相邻item两侧间隔相等，两侧item元素和边框的间隔是两个item间隔的一半（item之间的间隔=2倍item到边框的间隔）
6. space_evenly 同space_around，只是item直接的间隔和item到边框的间隔是一样的

### alignItems 副轴对齐模式

> 控制子元素在副轴的排列方向（副轴垂直主轴的方向为副轴），主轴水平方向、副轴竖直方向

1. stretch stretch 默认值，如果子元素未设置高度或设为auto，将占满整个父容器的高度
2. flex_start 副轴的起点对齐。
3. flex_end 副轴的终点对齐。
4. center 副轴的中点对齐。
5. baseline  Item的第一行文字的基线对齐。（注意:如果有的Item没有文本基线，那么它的基线默认是左上角。）

> alignItems从v2.0开始，默认值改为flex_start

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691228051757-ad65d23f-d806-45c6-864d-011cea00c80f.png#averageHue=%23badfbf&clientId=u5473d4c7-4f82-4&from=paste&height=440&id=ud53cc273&originHeight=880&originWidth=1166&originalType=binary&ratio=2&rotation=0&showTitle=false&size=311960&status=done&style=stroke&taskId=uaa9cbd7f-fc9e-4d21-b193-ab298522279&title=&width=583)

### alignContent 多根轴对齐模式

> 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

1. flex_start 与交叉轴的起点对齐
2. flex_end 与交叉轴的终点对齐
3. center：与交叉轴的中点对齐
4. space_between：与交叉轴两端对齐，轴线之间的间隔平均分布。
5. space_around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
6. stretch 默认值，充满副轴的高度，只有副轴排列app:alignItems=”stretch”时，app:alignContent=”stretch”才会生效，<br />即app:alignItems=”stretch”且app:alignContent=”stretch”；貌似height要设置成match_parent才有效

> alignContent从v2.0开始，默认值改为flex_start

alignContent和justifyContent其实里面的属性值都是一样的，一个是设置主轴的对齐方式，一个是设置多个轴的对齐方式，通俗的讲可以理解为比如是项目是水平换行，alignContent就是设置垂直方向的对齐方式，justifyContent就是设置水平方向的对齐方式。现在我们想让每个项目距离上右下左的距离是一样的，需要把alignContent和justifyContent都设置为space_around就可以了：

```xml
app:alignContent="space_around"
app:justifyContent="space_around"
```

### 其他属性

#### showDividerHorizontal

两端对齐，轴线之间的间隔相等

控制显示水平方向的分割线，值为none | beginning | middle | end其中的一个或者多个

#### dividerDrawableHorizontal

设置Flex轴线之间水平方向的分割线。或flexDirection设置为`column`或`column_rebase`

#### showDividerVertical

控制显示垂直方向的分割线，值为none | beginning | middle | end其中的一个或者多个。

#### dividerDrawableVertical

设置子元素垂直方向的分割线。或flexDirection设置为`column`或`column_rebase`

#### showDivider

控制显示水平和垂直方向的分割线，值为none | beginning | middle | end其中的一个或者多个。

#### dividerDrawable

设置水平和垂直方向的分割线，但是注意,如果同时和其他属性使用，比如为Flex轴、子元素设置了`justifyContent=”space_around”` 、`alignContent=”space_between”`等等。可能会看到意料不到的空间，因此应该避免和这些值同时使用。

Example of putting both vertical and horizontal dividers.

- res/drawable/divider.xml:

```xml
<shape xmlns:android="http://schemas.android.com/apk/res/android">
  <size
      android:width="8dp"
      android:height="12dp" />
  <solid android:color="#44A444" />
</shape>
```

- res/layout/content_main.xml:

```xml
<com.google.android.flexbox.FlexboxLayout xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:alignContent="flex_start"
  app:alignItems="flex_start"
  app:flexWrap="wrap"
  app:showDivider="beginning|middle"
  app:dividerDrawable="@drawable/divider" >

  <TextView
      style="@style/FlexItem"
      android:layout_width="220dp"
      android:layout_height="80dp"
      android:text="1" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="120dp"
      android:layout_height="80dp"
      android:text="2" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="160dp"
      android:layout_height="80dp"
      android:text="3" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="80dp"
      android:layout_height="80dp"
      android:text="4" />
  <TextView
      style="@style/FlexItem"
      android:layout_width="100dp"
      android:layout_height="80dp"
      android:text="5" />
```

- 效果:<br />![](https://note.youdao.com/yws/res/85585/EEED5B848C724A8AB5384C5AB9D08C7B#id=aIRnp&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691228106347-f6e9bd35-688b-4ed4-b7e2-fed79ca4850d.png#averageHue=%234ca34c&clientId=u5473d4c7-4f82-4&from=paste&height=256&id=u40b184b7&originHeight=512&originWidth=288&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20903&status=done&style=stroke&taskId=ua9106591-28a5-4228-a7f5-70004d6c817&title=&width=144)

## FlexboxLayout子元素属性

### layout_order 自身排列权重

子元素默认是按照元素的位置先后排列的，但是`layout_order`的值可以控制元素的排列顺序，按照数字的大小排列；给子元素加上该属性后，FlexboxLayout将按负值在前，正值在后，按照从小到大的顺序依次排列子元素。

> 从小到大依次排序，负数在前，正数在后。

### layout_flexGrow 子元素瓜分剩余空间比重

元素放大比例，默认为0，类似于 LinearLayout 中的layout_weight属性，根据比例等分，如果有一个子元素的 layout_flexGrow 是一个正值，那么会将全部剩余空间分配给这个Item,如果有多个Item这个属性都为正值，那么剩余空间的分配按照layout_flexGrow定义的比例等分。

> 属性值越大，表示瓜分剩余空间比重越大。

### layout_flexShrink 空间不足时子元素缩小比重

子元素缩小比例，默认为1，当子元素多行时无效，

如果所有子元素的layout_flexShrink值为1，空间不足时，都等比缩小，如果有一个为0，其他为1，空间不足时，为0的不缩小，负值无效。

### layout_alignSelf 自身对齐方式

子元素的对齐方式， 允许单个子元素有与其他子元素不一样的对齐方式，可覆盖alignItems属性。默认值为auto，表示继承父元素的 alignItems 属性，如果没有父元素，则等同于stretch。

1. auto (default) 继承父元素alignItems 属性，父元素alignItems 属性不存在则默认stretch
2. flex_start 同alignItems 的flex_start属性
3. flex_end 同alignItems 的flex_end属性
4. center 同alignItems 的cente属性
5. baseline 同alignItems 的baseline属性
6. stretch 同alignItems 的stretch属性

### layout_flexBasisPercent 自身占主轴空间百分比

子元素占父容器长度的百分比，覆盖了子元素自身的layout_width或layout_height，前提是父容器的长度或者宽度设置了值，否则无效

> 属性值填”80%”之类的。

### layout_minWidth / layout_minHeight

强制限定子元素的最小宽度或者最小高度，即使layout_flexShrink缩小比例，也会保证不小于子元素宽度或者高度的最小值

### layout_maxWidth / layout_maxHeight

强制限定子元素的最大宽度或者最大高度，即使layout_flexGrow放大比例，也会保证不大于子元素宽度或者高度的最大值

### layout_wrapBefore

强制换行，即使父容器设置了flex_wrap=nowrap,依然将当前元素换到下一行的第一个元素显示。

## Flexbox存在的问题

### RV中嵌套RV FlexboxLayoutManager，最后一个item显示不出来

```kotlin
private fun generateLabelLayoutManager(): RecyclerView.LayoutManager? {
    val layoutManager = FlexboxLayoutManager(context)
    layoutManager.flexDirection = FlexDirection.ROW
    layoutManager.flexWrap = FlexWrap.WRAP
    layoutManager.alignItems = AlignItems.FLEX_START
    layoutManager.justifyContent = JustifyContent.FLEX_START
    return layoutManager
}
```

## Ref

- [ ] 关于Google新的适配方式---FlexboxLayout

<https://blog.csdn.net/dazhaodai/article/details/72126813>
