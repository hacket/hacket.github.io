---
date created: 2024-07-23 01:57
date updated: 2024-12-24 00:34
dg-publish: true
---

# Text

## Text基础

官方文档：<https://developer.android.google.cn/reference/kotlin/androidx/compose/material/package-summary#text>

### 构造函数方法

```kotlin
Text(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontStyle: FontStyle? = null,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textDecoration: TextDecoration? = null,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    onTextLayout: (TextLayoutResult) -> Unit = {},
    style: TextStyle = LocalTextStyle.current
)
fun Text(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontStyle: FontStyle? = null,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textDecoration: TextDecoration? = null,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    inlineContent: Map<String, InlineTextContent> = mapOf(),
    onTextLayout: (TextLayoutResult) -> Unit = {},
    style: TextStyle = LocalTextStyle.current
)
```

这两种方式的区别就在`于text`参数，一个是String类型，一个是AnnotatedString类型；第2个方法多了个`inlineContent`参数<br />参数介绍：

```kotlin
text: String 普通的字符串；
text: AnnotatedString 带有不同属性的字符串，例如可以在一串字符中设置某些字符的颜色、字体、大小等属性；
modifier: Modifier = Modifier 属性Modifier（修饰符）
color: Color = Color.Unspecified 字体的颜色
fontSize: TextUnit = TextUnit.Inherit 绘制文本时使用的字形大小。请参见TextStyle.fontSize。
fontStyle: FontStyle? = null 绘制字母时使用的字体变体（例如，斜体）。请参见TextStyle.fontStyle。
fontWeight: FontWeight? = null 绘制文本时要使用的字体粗细（例如FontWeight.Bold）。
fontFamily: FontFamily? = null 呈现文本时要使用的字体系列。请参见TextStyle.fontFamily。
letterSpacing: TextUnit = TextUnit.Inherit 每个字母之间添加的空间量。请参见TextStyle.letterSpacing。
textDecoration: TextDecoration? = null 要在文字上绘制的装饰（例如下划线）。请参见TextStyle.textDecoration。
textAlign: TextAlign? = null 文本在段落中的对齐方式。请参见TextStyle.textAlign。
lineHeight: TextUnit = TextUnit.Inherit 以TextUnit为单位的段落的行高，例如SP或EM。请参见TextStyle.lineHeight。
overflow: TextOverflow = TextOverflow.Clip 视觉溢出应的处理方式，例如尾部显示…或者中间显示…。
softWrap: Boolean = true 文本是否应在换行符处中断。如果为false，则文本的宽度会在水平方向上无限延伸，且textAlign属性失效，可能会出现异常情况。
maxLines: Int = Int.MAX_VALUE 文本可跨越的可选最大行数，必要时可以换行。如果文本超过给定的行数，则会根据textAlign和softWrap属性截断文本。它的值必须大于零。
onTextLayout: (TextLayoutResult) -> Unit = {} 计算新的文本布局时执行的回调。
style: TextStyle = AmbientTextStyle.current 文本的样式配置，例如颜色，字体，行高等。也就是说上面属性中的color,fontSize等一些属性也可以在这里进行声明。具体包含的属性可以参考TextStyle类。
```

示例：

```kotlin
@Composable
private fun TextDemo(startString: String, endString: String) {
    val annotatedStringBuilder = AnnotatedString.Builder(startString)
    annotatedStringBuilder.pushStyle(
        SpanStyle(
            color = Color.Red,
            fontSize = 24.sp,
            fontStyle = FontStyle.Italic,
        )
    )
    annotatedStringBuilder.append("【可以】")
    annotatedStringBuilder.pop()
    annotatedStringBuilder.append(endString)
    val annotatedString = annotatedStringBuilder.toAnnotatedString()

    Text(
        text = annotatedString,
//            color = Color.Blue,
        fontSize = 16.sp,
        fontWeight = FontWeight.Bold,
        fontStyle = FontStyle.Normal,
        overflow = TextOverflow.Ellipsis,
        textAlign = TextAlign.Center,
        style = TextStyle(
            color = Color.White,
            background = Color.DarkGray
        ),
        modifier = Modifier
            .width(200.dp)
            .height(100.dp)
            .wrapContentSize(align = Alignment.CenterEnd)
//            .drawOpacity(1f)
            .clickable(onClick = {
                Toast
                    .makeText(this, "点击了全文本", Toast.LENGTH_SHORT)
                    .show()
            })
            .background(color = Color.Yellow)
    )
}

@Preview
@Composable
private fun previewTextDemo() {
    TextDemo(startString = "你", endString = "的")
}
```

### 显示文本

- 需要显示资源中的文字则可以使用`stringResource`

```kotlin
Text(text = "hello world")
// 需要显示资源中的文字则可以使用stringResource
Text(stringResource(id = R.string.app_name))
```

### 字体

#### 字体颜色 color

- Color
- TextStyle color

```kotlin
Text(
    text = stringResource(id = R.string.app_name),
    color = Color.Blue
)
// 使用 style 使用定义color
Text(
    text = stringResource(id = R.string.app_name),
    style = TextStyle(
        color = Color.Blue
    )
)
```

- 如果是资源中的颜色 可以使用colorResource
- RGB

```kotlin
color = colorResource(id = R.color.black)
// 还可以是
Color(0xffff0000)
Color(red = 0f, green = 0f, blue = 1f)
```

- String

```kotlin
fun Color.Companion.parse(colorString: String): Color =
    Color(color = android.graphics.Color.parseColor(colorString))
// 使用
Text(
    text = stringResource(id = R.string.app_name),
    color = Color.parse("#FF0000")
)
```

#### 文字大小 fontSize

```kotlin
Text(
    text = stringResource(id = R.string.hello_world),
    fontSize = 40.sp
)
```

#### 字体样式 fontStyle

- FontStyle.Normal 默认
- FontStyle.Italic 斜体

```kotlin
Column {
    Text(
        text = value,
        fontStyle = FontStyle.Normal
    )
    Text(
        text = value,
        fontStyle = FontStyle.Italic
    )
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507426191-d189c3ff-b028-4419-ae8a-b8e37aa4519b.png#averageHue=%23818181&clientId=ubc6f8fe2-642d-4&from=paste&height=91&id=u731d95b1&originHeight=136&originWidth=219&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20159&status=done&style=none&taskId=u520ba936-266c-490c-8918-1ed2b8dcfe6&title=&width=146)<br />具体见下面的`文字样式`

#### 字体加粗 fontWeight

```kotlin
Text(
    text = value,
    fontWeight = FontWeight.W800
)
```

下图中 左右两边等价：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507510297-ff9c08f0-8731-495e-9025-ec284d43b676.png#averageHue=%231f1f21&clientId=ubc6f8fe2-642d-4&from=paste&height=207&id=ucdec1a1e&originHeight=367&originWidth=497&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51149&status=done&style=none&taskId=u36fcd3f9-c2ad-41d6-8680-fcb662920c3&title=&width=281)<br />效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507560477-5e0b6bc2-7a93-4064-9903-3ac0bfd79ae4.png#averageHue=%23e5e5e3&clientId=ubc6f8fe2-642d-4&from=paste&height=279&id=uf01d5678&originHeight=502&originWidth=453&originalType=binary&ratio=2&rotation=0&showTitle=false&size=130769&status=done&style=none&taskId=ue3e6af6d-35d5-4bed-bbff-ccee6f92685&title=&width=252)

#### 字体 fontFamily

```kotlin
Text(
    text = value,
    fontFamily = FontFamily.Default
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507766172-2b1d4e29-9a48-4bd5-90d6-3cd812d12630.png#averageHue=%233e3f46&clientId=ubc6f8fe2-642d-4&from=paste&height=338&id=u3d223d7c&originHeight=671&originWidth=1117&originalType=binary&ratio=2&rotation=0&showTitle=false&size=210429&status=done&style=none&taskId=u41a8411c-fa64-417e-bebe-039b8f30f5a&title=&width=562)<br />可以使用 `fontFamily` 属性来处理 `res/font` 文件夹中定义的自定义字体和字型：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507815799-61921b16-3046-4913-90b6-320e127ba6e6.png#averageHue=%23b6b6b6&clientId=ubc6f8fe2-642d-4&from=paste&height=186&id=u29e2ee43&originHeight=312&originWidth=440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55056&status=done&style=none&taskId=u30e22790-02aa-4c57-91ce-96cd1c1ad2e&title=&width=262)

- 需要注意 引入的字体库名称 必须仅包含小写字母az，0-9或下划线
- 引入完成就以后需要rebuild一下，否则无法找到 font 的
- [字体下载](https://link.juejin.cn/?target=https%3A%2F%2Ffonts.google.com)

```kotlin
val fontFamily = FontFamily(
    Font(resId = R.font.myfont, weight = FontWeight.Normal)
)
Text(
    text = "Demo Text",
    style = TextStyle(
        fontFamily = fontFamily,
    )
)
```

#### 字间隔空 letterSpacing

```kotlin
Text(
    text = value,
    letterSpacing = 2.sp
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507912442-c7cc64a8-0ec2-40f3-ac7a-b914267ed695.png#averageHue=%23505455&clientId=ubc6f8fe2-642d-4&from=paste&height=274&id=u6d0b18c6&originHeight=563&originWidth=1312&originalType=binary&ratio=2&rotation=0&showTitle=false&size=184490&status=done&style=none&taskId=uad3c0f59-4987-4fc0-bdb0-5939af42760&title=&width=638)

#### 文字装饰 textDecoration

```kotlin
Text(
    text = value,
    textDecoration = TextDecoration.None
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703507955776-3a1e9edd-d24a-492e-8f6f-334b0049da95.png#averageHue=%235c676a&clientId=ubc6f8fe2-642d-4&from=paste&height=316&id=u6ae13f02&originHeight=564&originWidth=1144&originalType=binary&ratio=2&rotation=0&showTitle=false&size=225173&status=done&style=none&taskId=u0da354cf-cdfb-4482-814b-4bd5d8d81a6&title=&width=641)

### 对齐方式

相当于TextView的 `android:gravity='left'`<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703510841580-6a1d0f40-4824-473f-b951-bad9d570ad05.png#averageHue=%233d4144&clientId=ubc6f8fe2-642d-4&from=paste&height=474&id=u5b360507&originHeight=936&originWidth=1263&originalType=binary&ratio=2&rotation=0&showTitle=false&size=297545&status=done&style=none&taskId=ufdf66a76-97be-406f-9413-3bd6433df01&title=&width=640)<br />Justify表示两端贴边

#### TextAlign.Center不生效

```kotlin
Text(
    text = "How many cars are in the garage",
    modifier = Modifier
        .size(350.dp, 100.dp)
        .background(Color.Red),
    textAlign = TextAlign.Center
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703511114234-b3381bcf-0cfc-4431-aa1c-c9989d05c18d.png#averageHue=%23e63523&clientId=ubc6f8fe2-642d-4&from=paste&height=90&id=ub38ef1de&originHeight=210&originWidth=818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19234&status=done&style=none&taskId=ub10ba169-e9d1-4f4e-b44e-a69ea1de33d&title=&width=351)<br />解决1：用`.wrapContentHeight()`或`wrapContentSize()`

```kotlin
Text(
    text = "How many cars are in the garage",
//  textAlign = TextAlign.Center, // make text center horizontal
    modifier = Modifier
        .width(350.dp)
        .height(100.dp)
        .background(Color.Cyan)
        .wrapContentSize()
//      .wrapContentHeight() // make text center vertical
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703511587345-adfe609d-0967-47d4-9bc4-0eecc1ba6632.png#averageHue=%2373f8f9&clientId=ubc6f8fe2-642d-4&from=paste&height=103&id=u23b4e40c&originHeight=206&originWidth=826&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19313&status=done&style=none&taskId=u8fb41b29-2885-473d-8b10-258f80080a6&title=&width=413)<br />解决2：在Text外层加上Box后设置Box的属性来实现

```kotlin
Box(
    modifier = Modifier
        .size(250.dp)
        .border(width = 4.dp, color = Gray, shape = RoundedCornerShape(16.dp)),
    contentAlignment = Alignment.Center
) {
    Text(
        text = "Question 1 : How many cars are in the garage?",
        modifier = Modifier
            .padding(16.dp)
            .width(350.dp)
            .height(80.dp)
            .background(Color.Gray),
        textAlign = TextAlign.Center,
    )
}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703512383460-bf79798f-6a2d-41fe-87b5-966cd107d7c8.png#averageHue=%237ecfd0&clientId=ubc6f8fe2-642d-4&from=paste&height=252&id=u8419d588&originHeight=504&originWidth=512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=25267&status=done&style=none&taskId=ued64f099-4264-478f-b440-7d8cacfca20&title=&width=256)<br />解决3：Column wrapContentSize

- [ ] [Jetpack Compose - Centering Text](https://stackoverflow.com/a/63719588/5777306)

```kotlin
Column(
    modifier = Modifier
        .padding(30.dp)
        .fillMaxWidth()
        .wrapContentSize(Alignment.Center)
        .clickable(onClick = { }) /*question = "3 Bananas required"*/
        .clip(shape = RoundedCornerShape(16.dp)),
) {
    Box(
        modifier = Modifier
            .size(250.dp)
            .border(width = 4.dp, color = Gray, shape = RoundedCornerShape(16.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Question 1 : How many cars are in the garage?",
            modifier = Modifier.padding(16.dp),
            textAlign = TextAlign.Center,
        )
        //...
    }
}
```

### 行高 lineHeight

```kotlin
Text(
    text = value,
    lineHeight = 30.sp
)
```

### 最大行数 maxLines

```kotlin
Text("hello ".repeat(50), maxLines = 2)
```

### 文字溢出 overflow

- Clip 将溢出的部分裁剪，默认
- Ellipsis 使用省略号表示溢出部分
- Visible 指定范围内没有足够的空间。也要显示所有文本

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703512718490-22ca3d42-7dd9-4e05-bb24-8bb8a49ca2be.png#averageHue=%232c3033&clientId=ubc6f8fe2-642d-4&from=paste&height=337&id=uf356bf5a&originHeight=648&originWidth=1290&originalType=binary&ratio=2&rotation=0&showTitle=false&size=259652&status=done&style=none&taskId=u79de8109-3805-4041-b4bc-69c42920b14&title=&width=670)<br />最后一个Visible 在[官网](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fkotlin%2Fandroidx%2Fcompose%2Fui%2Ftext%2Fstyle%2FTextOverflow%23ENUM_VALUE%3AVisible)中可以找到示例去演示器效果。笔者这边简化了一下。示例如下。

```kotlin
Box(modifier = Modifier
    .size(300.dp, 150.dp)
    .background(Color.Red)) {
    Text(
        text = "Hello World".repeat(2),
        modifier = Modifier
            .size(200.dp, 70.dp)
            .background(Color.Yellow),
        fontSize = 35.sp,
        overflow = TextOverflow.Visible,
    )
}
```

| 未设置Visible                                                                                                                                                                                                                                                                                                                                                             | 设置了Visible                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1703512792442-f9937032-4407-452d-be92-9f6b011c2a9e.webp#averageHue=%23b03504&clientId=ubc6f8fe2-642d-4&from=paste&height=164&id=ub037dac0&originHeight=174&originWidth=316&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u078f0b8b-0ab6-401b-b1ba-18a0a00b97b&title=&width=297) | ![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1703512792025-eef6bf51-306f-4c95-ade2-db3150074356.webp#averageHue=%23aa3405&clientId=ubc6f8fe2-642d-4&from=paste&height=166&id=ua0570d0f&originHeight=180&originWidth=314&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ucc3db694-ffbf-4cc2-a2f3-9565f8b6052&title=&width=289) |

### 换行处理 softWrap

- false 被定位为有无限的水平空间
- true 默认会有边界

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703513079029-ed0f5580-b045-47df-9e52-cc06d0fcf239.png#averageHue=%2333d3d2&clientId=ubc6f8fe2-642d-4&from=paste&height=312&id=u20cbf8ef&originHeight=575&originWidth=1296&originalType=binary&ratio=2&rotation=0&showTitle=false&size=256328&status=done&style=none&taskId=u4d379650-47d4-405c-b746-ccc56b8695f&title=&width=704)

### 文字样式 fontStyle

#### 背景颜色 background

```kotlin
style = TextStyle(
    background = Color.Red
)
```

#### 基线偏移 baselineShift

```kotlin
Text(
    text = value,
    style = TextStyle(
        baselineShift = BaselineShift.Subscript
    )
)
```

Android Text 的基线baseline：![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703590394326-efa75f53-2521-4b95-b6dc-91aae739b73b.png#averageHue=%23cdcccb&clientId=u7fff917d-e601-4&from=paste&height=337&id=u42df4592&originHeight=800&originWidth=1298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=326624&status=done&style=none&taskId=u05f0442c-4f49-4bfa-83d9-efb4edb9964&title=&width=546)<br />BaselineShift给我们提供了3个默认的选项

- val Superscript = BaselineShift(0.5f)
- val Subscript = BaselineShift(-0.5f)
- val None = BaselineShift(0.0f)

示例：

```kotlin
Text(
    text = "hello world 1f",
    style = TextStyle(
        background = Color.Yellow,
        baselineShift = BaselineShift(1f)
    )
)
Text(
    text = "hello world 0.5f",
    style = TextStyle(
        background = Color.Green,
        baselineShift = BaselineShift.Superscript
    )
)
Text(
    text = "hello world 0f",
    style = TextStyle(
        background = Color.Red,
        baselineShift = BaselineShift.None
    )
)
Text(
    text = "hello world -0.5f",
    style = TextStyle(
        background = Color.Yellow,
        baselineShift = BaselineShift.Subscript
    )
)
Text(
    text = "hello world -1f",
    style = TextStyle(
        background = Color.Cyan,
        baselineShift = BaselineShift(-1f)
    )
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703591262564-15801ef2-42a4-4e2a-88d7-d4197b0dc64a.png#averageHue=%23c4ec4c&clientId=u7fff917d-e601-4&from=paste&height=146&id=u9882df9d&originHeight=292&originWidth=220&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29299&status=done&style=none&taskId=u23608f99-6aa1-4828-aade-b809efb3a32&title=&width=110)

#### 合成字体 fontSynthesis

```kotlin
fontSynthesis = FontSynthesis.All
```

合成字体用于指定当使用的FontFamily不包含粗体或斜体时，系统是否应该伪造粗体或倾斜字形。

- **None** 关闭字体合成。 如果FontFamily中不存在粗体和斜体，则不会合成它们
- **Weight** 如果FontFamily中不提供，则仅合成粗体。 倾斜的字体将不会被合成。
- **Style** 如果FontFamily中不可用，则仅合成倾斜的字体。 粗体字体将不被合成。
- **All** 如果FontFamily中不提供粗体和倾斜字体，则系统会合成粗体和倾斜字体

#### 文字缩进 textIndent

```kotlin
class TextIndent(
    //第一行的缩进
    val firstLine: TextUnit = 0.sp,
    //除了第一行其他行的缩进
    val restLine: TextUnit = 0.sp
) 
```

示例：

```kotlin
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        textIndent = TextIndent(10.sp, 10.sp)
    )
)
```

#### 文字方向 textDirection

一般情况下。我们用到的都是从左往右。也有一些国家的语言是从右往左，例如阿拉伯语

```kotlin
style = TextStyle(
    textDirection = TextDirection.Ltr
)
```

#### 字体阴影

```kotlin
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        shadow = Shadow(
            color = Color.Red,
            offset = Offset.Zero,
            blurRadius = 20.0f
        )
    )
)
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        shadow = Shadow(
            color = Color.Red,
            offset = Offset.Zero,
            blurRadius = 2.0f
        )
    )
)
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        shadow = Shadow(
            color = Color.Red,
            offset = Offset(10F, 10F),
            blurRadius = 2.0f
        )
    )
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703596119022-45d732e5-dedc-43da-9b3e-ef9b28941a3b.png#averageHue=%23ececef&clientId=u7fff917d-e601-4&from=paste&height=69&id=u92510ae0&originHeight=138&originWidth=322&originalType=binary&ratio=2&rotation=0&showTitle=false&size=53876&status=done&style=none&taskId=u06af1b25-3de0-4520-8ff6-e5dd5ee1b1e&title=&width=161)

#### 几何变换

- scaleX 水平缩放 默认是1f 不缩放
- skewX 倾斜 默认是0f 不倾斜

```kotlin
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        textGeometricTransform = TextGeometricTransform(
            scaleX = 1f,
            skewX = 0f
        )
    )
)
Text(
    text = "hello world".repeat(2),
    style = TextStyle(
        textGeometricTransform = TextGeometricTransform(
            scaleX = 1f,
            skewX = 0.5f
        )
    )
)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703596358061-cfa57745-b989-4ddf-8eaf-7920493fb52f.png#averageHue=%23e3e3e6&clientId=u7fff917d-e601-4&from=paste&height=47&id=udf1d7661&originHeight=94&originWidth=316&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20473&status=done&style=none&taskId=uf4027ff8-c752-4aa9-ba8d-2fae6813c09&title=&width=158)

#### 语言环境

```kotlin
style = TextStyle(
    localeList = LocaleList(Locale.current)
)
```

#### 高级排版

```kotlin
Text(
    text = "Hello World",
    style = TextStyle(
        fontFeatureSettings = "smcp"
    )
)
```

用 CSS 的 `font-feature-settings` 的方式来设置文字<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703596487056-51149a72-e2df-4e5b-8072-15afa03d0701.png#averageHue=%23727272&clientId=u7fff917d-e601-4&from=paste&height=68&id=ua0920a0b&originHeight=109&originWidth=336&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19580&status=done&style=none&taskId=uc498cd25-0b8e-425e-8b91-5853344e12f&title=&width=210)
