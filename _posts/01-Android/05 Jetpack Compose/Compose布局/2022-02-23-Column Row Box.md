---
date_created: Friday, February 23rd 2022, 10:10:45 pm
date_updated: Wednesday, January 22nd 2025, 12:10:26 am
title: Column Row Box
author: hacket
categories:
  - Android
category: Compose
tags: [Compose]
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
date created: 2024-07-23 01:58
date updated: 2024-12-24 00:34
aliases: [Column]
linter-yaml-title-alias: Column
---

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703596541112-18a720c9-ce7f-47ca-9cdb-157e739c03fe.png#averageHue=%23edaf9d&clientId=u672149a1-e9aa-4&from=paste&height=288&id=u63a983c0&originHeight=576&originWidth=1382&originalType=binary&ratio=2&rotation=0&showTitle=false&size=183542&status=done&style=none&taskId=u9a8fe5cb-a510-42ff-9b62-32266a59847&title=&width=691)<br>Compose 的布局控件 Column、Row、Box

# Column

Column 将多个项水平地放置在屏幕上；类似垂直的 LinearLayout

## 属性

```kotlin
@Composable
inline fun Column(
    modifier: Modifier = Modifier,
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    horizontalAlignment: Alignment.Horizontal = Alignment.Start,
    content: @Composable ColumnScope.() -> Unit
)
```

- modifier：常用属性设定
- verticalArrangement：Column 内组件垂直方向摆放
- horizontalAlignment：Column 内组件水平方向摆放
- content：添加布局内的 View

### Column 内组件对齐方式

Column 垂直方向使用 `Arrangement` 设置，水平方向使用 `Alignment` 设置。

#### verticalArrangement 垂直方向对齐方式

`verticalArrangement` 参数可以设置 Column 垂直排列的方式：

```kotlin
Column(
    modifier = Modifier.fillMaxHeight().fillMaxWidth(),
    verticalArrangement = Arrangement.Center
) {
    Text(text = "千里之行")
    Text(text = "始于足下")
}
```

Arrangement 的值和对应效果如下：

- `Arrangement.EqualWeight` 内容撑满 Column 的高度，每个组件的高度平分 Column 的高度（EqualWeight 在正式版发布后，使用了子 `View.weight()` 方式代替）
- `Arrangement.SpaceBetween` 内容撑满 Column 的高度，最上方和最下方的组件紧靠 Column，组件与组件之间的间距会平分剩余高度
- `Arrangement.SpaceAround` 内容撑满 Column 的高度，最上方和最下方的组件与 Column 的间距是组件与组件直接的间距的一半
- `Arrangement.SpaceEvenly` 内容撑满 Column 的高度，组件与组件之间的间距会平分剩余高度；子 View 平均分配 Column 垂直（高度）
- `Arrangement.Top` 内容对齐到 Column 的最上方
- `Arrangement.Center` 内容居中对齐
- `Arrangement.Bottom` 内容对齐到 Column 的最下方

![](https://cdn.nlark.com/yuque/0/2023/gif/694278/1703599519474-4054c6a7-71e9-4cef-b4a8-6ab599bf6ff2.gif#averageHue=%236891db&clientId=u2d7af5bb-3677-4&height=457&id=AETHn&originHeight=881&originWidth=600&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud4506bbf-3f86-403f-a94e-c517a0f4e04&title=&width=311)

#### horizontalAlignment Column 内组件水平对齐

horizontalAlignment 参数可以设置 Column 的水平对齐方式，horizontalAlignment 的值有三种：

- Alignment.Start 向内容开始的方向对齐，一般为左边
- Alignment.CenterHorizontally 内容居中对齐
- Alignment.End 向内容结束的方向对齐，一般为右边

```kotlin
Column(
    modifier = Modifier.fillMaxHeight().fillMaxWidth(),
    verticalArrangement = Arrangement.Center, // 设置垂直居中对齐
    horizontalAlignment =  Alignment.CenterHorizontally // 设置水平居中对齐
) {
    Text(text = "千里之行")
    Text(text = "始于足下")
}
```

> 将 Column 里面的内容将垂直水平都居中

### 设置尺寸

```kotlin
// 设置了Column的大小为 200dp * 200dp
Column(
    modifier = Modifier
        .height(200.dp)
        .width(200.dp)
) {
    Text(text = "千里之行")
    Text(text = "始于足下")
}
// 使用Modifier.size(width,height)来设置Column的大小
Column(
    modifier = Modifier.size(300.dp, 200.dp)
) {
    Text(text = "千里之行")
    Text(text = "始于足下")
}
// 使用Modifier.fillMaxHeight().fillMaxWidth()来设置Column的大小，
// 此时Column将填充父控件的剩余大小，类似于match_parent 。可以直接使用Modifier.fillMaxSize()来直接设置
Column(
    modifier = Modifier
        .fillMaxHeight()
        .fillMaxWidth()
) {
    Text(text = "千里之行")
    Text(text = "始于足下")
}
```

## 内容高度按比例分配 weight

设置 Weight 属性需要在 Column / Row 的子 View 中调用，使用 Modifie.weight()（与 LinearLayout 子 View 设置 weight 类似）

```kotlin
@Stable
fun Modifier.weight(
    weight: Float,
    fill: Boolean = true
): Modifier
```

- **weight**：设置当前子 View 在 Column / Row 内垂直方向 / 水平方向大小的权重；weight 越大占比越大
- **fill**：是否将分配的权重大小填充满，默认为 true

> 在 LazyColumn 里 weight 会失效？

```kotlin
Column(
    modifier = Modifier.fillMaxSize()
) {
    Text(text = "千里之行",Modifier.weight(1f))
    Text(text = "始于足下",Modifier.weight(1f))
}
```

## Column / Row 添加滚动

添加滚动需要设置 Column / Row 的 `Modifier.verticalScroll` / `Modifier.horizontalScroll`：

```kotlin
fun Modifier.verticalScroll(
    state: ScrollState,
    enabled: Boolean = true,
    flingBehavior: FlingBehavior? = null,
    reverseScrolling: Boolean = false
)
```

- **state**：设置滚动位置和滚动位置监听
- **enabled**：是否开启滚动设置，默认开启（true）
- **flingBehavior**：可自定义滑动速度 延时 等，默认是 DefaultFlingBehavior() 函数，在 androidx.compose.foundation.gestures.scrollable 下，实现了 ScrollScope.perFormFling 方法，可用于参考做自定义滑动属性。
- **reverseScrolling**：反向滑动

示例：

```kotlin
@Composable
fun ColumnScrollView() {
    val scrollLocation = rememberScrollState(0) //设置初始滑动位置
    Log.i("hacket", "====Column Scroll==== Location:${scrollLocation.value}")
    Column(
        modifier = Modifier
            .height(200.dp)
            .fillMaxWidth()
            .background(Color.White)
            .verticalScroll(scrollLocation)
    ) {
        for (i in 0..20) {
            Text(
                text = "竖向排列 $i",
                modifier = Modifier.height(50.dp)
            )
        }
    }
}
```

# Row

Row 将多个项水平地放置在屏幕上；类似水平的 LinearLayout

## Row 属性介绍

```kotlin
inline fun Row(
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    verticalAlignment: Alignment.Vertical = Alignment.Top,
    content: @Composable RowScope.() -> Unit
)
```

Row 水平方向使用 Arrangement 设置，垂直方向使用 Alignment 设置。

- horizontalArrangement（水平方向设定）
  1. .Start：子 View 居于 Row 开始绘制的边界（水平方向左对齐）
  2. .End：子 View 居于 Row 结束绘制的边界（水平方向右对齐）
  3. .Center：子 View 居于 Row 水平方向居中
  4. .SpaceEvenly：子 View 平均分配 Row 水平方向（宽度）
  5. .SpaceAround：子 View 平均分配 Row 水平方向（宽度），但是头部和尾部子 View 基于 Row 水平方向左边和右边的边距是平分水平方向宽距的一半。
  6. .SpaceBetween：子 View 平均分配 Row 水平方向（宽度），头部和底部子 View 贴着 Row 水平方向左侧和右侧，没有边距。
- verticalAlignment（垂直方向设定）
  1. .Top：子 View 居于 Row 垂直方向上方对齐
  2. .Bottom：子 View 居于 Row 垂直方向下方对齐
  3. .CenterVertically：子 View 居于 Row 垂直方向居中

其他基本同 Column

# Box

Box 将一个元素放在另外一个元素上；类似 FrameLayout。

## Box 属性介绍

```kotlin
@Composable
inline fun Box(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    propagateMinConstraints: Boolean = false,
    content: @Composable BoxScope.() -> Unit
) {
    val measurePolicy = rememberBoxMeasurePolicy(contentAlignment, propagateMinConstraints)
    Layout(
        content = { BoxScopeInstance.content() },
        measurePolicy = measurePolicy,
        modifier = modifier
    )
}
```

- modifier：常用属性设定
- contentAlignment：子 View 位置设定
- propagateMinConstraints：Box 没有设置固定尺寸并且设置了最小尺寸，是否将最小尺寸值设置给子 View，默认为 false。
- content：添加布局内的 View

示例：

```kotlin
@Composable
fun BoxView() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Text 1",
            modifier = Modifier
                .size(300.dp)
                .background(Color.Blue)
        )
        Text(
            text = "Text 2",
            modifier = Modifier
                .size(200.dp)
                .background(Color.Red)
        )
        Text(
            text = "Text 3",
            modifier = Modifier
                .size(100.dp)
                .background(Color.DarkGray)
        )
    }
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703601458689-1283fc76-7d0e-4b36-bbb1-528a6b164e7c.png#averageHue=%23454745&clientId=u2d7af5bb-3677-4&from=paste&height=279&id=u4792771e&originHeight=1238&originWidth=1254&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111230&status=done&style=none&taskId=ubb2bac40-ad86-45ce-92e0-b3edcb2cdec&title=&width=283)

## Box 子 View 方向设定 contentAlignment

Box 方向设定使用 Alignment 设定

- .TopStart：子 View 居于 Box 左上边界（左上角）
- .TopCenter：子 View 居于 Box 上边界并且水平居中
- .TopEnd：子 View 居于 Box 右上边界（右上角）
- .BootomStart：子 View 居于 Box 左和底部边界（左下角）
- .BootomCenter：子 View 居于 Box 底部边界并且水平居中
- .BootomEnd：子 View 居于 Box 右和底部边界（右下角）
- .CenterStart：子 View 居于 Box 左侧并且垂直居中
- .Center：子 View 居中
- .CenterEnd：子 View 居于 Box 右侧并且垂直居中

## BoxWithConstraints

子 View 可在 BoxWithConstraints 控件内获取到约束属性

```kotlin
@Composable
fun BoxWithConstraintsView() {
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        this.constraints
        this.maxHeight
        this.minHeight
        this.maxWidth
        this.minWidth

        Text(
            text = "Text 1",
            Modifier
                .width(this.minWidth)
                .height(this.minHeight)
        )
    }
}
```
