---
date created: 2024-12-24 00:35
date updated: 2024-12-24 11:06
dg-publish: true
---

# Android RTL适配

## 适配入门

### 如何切换到阿拉伯语？

1. 语言→添加语言→搜索:阿拉伯（选第一个即可）
2. 选择第一语言为阿拉伯语

> 快速切换到阿语，阿语切换到英语，<https://www.pgyer.com/qiubaitools，密码：111111>

### 方向判断

- 从Locale 判断是否是 RTL 布局

```kotlin
fun Any.isRTL() = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    TextUtilsCompat.getLayoutDirectionFromLocale(getCurrentLocale()) == LayoutDirection.RTL
} else {
    TextUtilsCompat.getLayoutDirectionFromLocale(getCurrentLocale()) == 1
}
```

- 某个布局判断

```kotlin
View.layoutDirection == ViewCompat.LAYOUT_DIRECTION_RTL
```

### AS 一键适配

AS 支持一键适配 RTL，主要是在原来 Layout 中设置 Left 和 Right 属性的补充添加 Start 和 End 属性。<br >Start 属性在 LTR 中对应 Left，在 RTL 中对应 Right，在API 17开始支持，为了兼容低版本，需要同时有 Left 和 Start。从市场来看，Android 4.2 系统以下的手机用户已经不多了，我的建议是可以不兼容，具体还得你们看自家产品在 4.2 系统以下用户数。

> `Refactor > Add RTL Support Where Possible...`

### 开启RTL支持

在 `AndroidManifest.xml` 文件中 `application` 节点添加支持从右到左布局方式代码：

```xml
<application
    ...
    android:supportsRtl="true" >
    ...
</application>
```

## Drawable适配 （一张图，drawable翻转）

某些图标在RTL布局中，需要做反转，比如类似`<--` 的图标在RTL布局中应该显示成`-->`。

### Android API 大于等于19 `autoMirrored=true`

```xml
<ImageView
    src="@drawable/arrow_right"
    autoMirrored="true" />
```

> 需要API等级在19以后才可以。

### Android API 小于19

#### 1、提供多套图

用`drawable-ldrtl`提供多套图

```xml
<ImageView
    src="@drawable/arrow_right" />
```

多个`drawable`目录：

```shell
├── drawable-xxxhdpi
    └── arrow_right.png
├── drawable-xxhdpi
    └── arrow_right.png
├── drawable-xhdpi
    └── arrow_right.png
├── drawable-hdpi
    └── arrow_right.png
├── drawable-mdpi
    └── arrow_right.png
├── drawable-ldrtl-xxxhdpi
    └── arrow_right.png
├── drawable-ldrtl-xxhdpi
    └── arrow_right.png
├── drawable-ldrtl-xhdpi
    └── arrow_right.png
├── drawable-ldrtl-hdpi
    └── arrow_right.png
├── drawable-ldrtl-mdpi
    └── arrow_right.png
```

> 会造成图片资源冗余，增大apk体积

#### 2、翻转

图片镜像翻转`180°`，对于`ImageView`

```xml
android:rotationY="@integer/rotation"
```

示例：

```xml
<ImageView
    src="@drawable/arrow_right"
    android:rotationY="@integer/rotation" />
```

在`values/integer.xml`声明如下

```xml
<resources>
    <integer name="rotation">0</integer>
</resources>
```

最后在`value-ldrtl/integer.xml`声明如下:

```xml
<resources>
    <integer name="rotation">180</integer>
</resources>
```

还有其他的`anim-ldrtl/`、`drawable-ldrtl/`也是一样

## 字符、数字、时间等的适配

### String.format

传递`Locale.getDefault()`，如果是数字的话不需要翻译成阿语的数字用`Locale.US`

> 如时间、数字等阿拉伯数字，无需适配阿拉伯语的话，指定Locale.US即可

#### Android阿拉伯语下占位符问题

> values-ar/strings(阿拉伯文)中若有占位符，若只有一个占位符，%s 需要写成 s%，若有多个占位符，则仍旧是%s，如果不确定是s%还是%s，看看大神们是如何操作的:

This is the crash:

```shell
E/AndroidRuntime( 5739): Caused by: java.util.UnknownFormatConversionException: Conversion: أ
E/AndroidRuntime( 5739):  at java.util.Formatter$FormatToken.unknownFormatConversionException(Formatter.java:1399)
E/AndroidRuntime( 5739):  at java.util.Formatter$FormatToken.checkFlags(Formatter.java:1336)
E/AndroidRuntime( 5739):  at java.util.Formatter.transform(Formatter.java:1442)
E/AndroidRuntime( 5739):  at java.util.Formatter.doFormat(Formatter.java:1081)
E/AndroidRuntime( 5739):  at java.util.Formatter.format(Formatter.java:1042)
E/AndroidRuntime( 5739):  at java.util.Formatter.format(Formatter.java:1011)
E/AndroidRuntime( 5739):  at java.lang.String.format(String.java:1999)
```

Next, I highlighted the format argument (d$ 1%), deleted it, and retyped it (by pressing % 1  $ d). My string now looks like this:

> 阿语是从右到左，输入后感觉是反向输入的

<https://stackoverflow.com/questions/45983711/android-handling-integer-1d-and-string-1s-arguments-for-right-to-left-l?rq=1>

#### String.format保留小数位数

> String.format("%.nf",d);----表示保留N位

```java
String result1 = String.format("%.2f", d);
String result = String.format("%.3f", d);
```

#### `java.util.UnknownFormatConversionException: Conversion = 'د'`

`String.format`阿语报错，报错代码：

```xml
错误
<string name="store_goods_room_vehicle_welcome">مرحبا s% دخواه للغرفة بالسيارة</string>

代码：
StringUtils.format(R.string.store_goods_room_vehicle_welcome, commonInfo?.user?.name?: "")
```

这是由于阿语下`%s`写反了。<br >解决：

```xml
<string name="store_goods_room_vehicle_welcome">مرحبا %s دخواه للغرفة بالسيارة</string>
```

这上面显示有误，在as中显示这样<br >![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687786541770-caa035f7-13e2-46bc-af45-516b3610794b.png#averageHue=%23302f2d&clientId=u1dbe7097-3f41-4&from=paste&height=23&id=u671a848a&originHeight=46&originWidth=1596&originalType=binary&ratio=2&rotation=0&showTitle=false&size=21358&status=done&style=none&taskId=u51672cc9-750d-479b-82e6-4c9aebd7ad8&title=&width=798)<br >报错堆栈：

```shell
2020-04-26 21:08:51.828 E/CrashReport: java.util.UnknownFormatConversionException: Conversion = 'د'
    at java.util.Formatter$FormatSpecifier.conversion(Formatter.java:2782)
    at java.util.Formatter$FormatSpecifier.<init>(Formatter.java:2812)
    at java.util.Formatter$FormatSpecifierParser.<init>(Formatter.java:2625)
    at java.util.Formatter.parse(Formatter.java:2558)
    at java.util.Formatter.format(Formatter.java:2505)
    at java.util.Formatter.format(Formatter.java:2459)
    at java.lang.String.format(String.java:2870)
    at qsbk.app.chat.common.utils.StringUtils.format(StringUtils.java:37)
    at qsbk.app.chat.common.utils.StringUtils.format(StringUtils.java:28)
    at club.jinmei.mgvoice.m_room.model.message.RoomCommonInfoMessage.getVehicleNameCorrectText(RoomCommonInfoMessage.kt:71)
    at club.jinmei.mgvoice.m_room.model.message.RoomCommonInfoMessage.getMessageShowContent(RoomCommonInfoMessage.kt:97)
    at club.jinmei.mgvoice.m_room.room.message_list.MessageAdapter.bindMessage(MessageAdapter.kt:594)
    at club.jinmei.mgvoice.m_room.room.message_list.MessageAdapter.convert(MessageAdapter.kt:163)
    at club.jinmei.mgvoice.m_room.room.message_list.MessageAdapter.convert(MessageAdapter.kt:83)
    at com.chad.library.adapter.base.BaseQuickAdapter.onBindViewHolder(BaseQuickAdapter.java:983)
    ......
```

### DecimalFormat

通过DecimalFormatSymbols

```kotlin
DecimalFormat("###.##", DecimalFormatSymbols.getInstance(Locale.ENGLISH))
```

> 阿语下数字0是一个点`.`

### 双方向字符(bidi字符)方向适配

见`bidi算法-xxx.md`<br >辅助查看加的bidi控制符对不对：

```kotlin
/**
 * 字符串转换unicode
 */
fun String.string2Unicode(): String {
    val unicode = StringBuffer()
    for (i in 0 until length) {
        // 取出每一个字符
        val c = this[i]
        // 转换为unicode
        unicode.append("\\u" + Integer.toHexString(c.toInt()))
    }
    return unicode.toString()
}
```

#### X6金豆反过来

1. LTR中显示 `x 6`
2. RTL显示 `6 X`

### 时间适配

如时间、数字等阿拉伯数字，无需适配阿拉伯语的话，指定Locale.US即可<br >时间格式化代码：

```kotlin
private const val DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss"
private const val DEFAULT_DATE_FORMAT_DAY = "yyyy-MM-dd"

fun Long.format(): CharSequence {
    return _format()
}

fun Long.formatUS(): CharSequence {
    return this._format(locale = Locale.US)
}

fun Long.formatCN(): CharSequence {
    return this._format(locale = Locale.CHINA)
}

fun Long.formatDay(): CharSequence {
    return this._format(DEFAULT_DATE_FORMAT_DAY)
}

fun Long.formatDayUS(): CharSequence {
    return this._format(DEFAULT_DATE_FORMAT_DAY, Locale.US)
}

fun Long.formatDayCN(): CharSequence {
    return this._format(DEFAULT_DATE_FORMAT_DAY, Locale.CHINA)
}

private fun Long._format(
    pattern: String = DEFAULT_DATE_FORMAT,
    locale: Locale = Locale.getDefault()
): CharSequence {
    return SimpleDateFormat(pattern, locale).format(this)
}
```

## 控件适配

### 布局和控件适配

1. padding和margin的适配：start和end替代left和right
2. TextView的适配：layoutDirection(设置组件的布局方向)、textDirection(设置组件文字的方向) 、textAlignment(设置组件文字的对齐)
3. ViewPager的适配，建议用ViewPager2

### 使用全局样式

#### EditText

在 style.xml 样式中全部 EditText 都设置

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
   ...
   <item name="editTextStyle">@style/EditTextStyle.Alignment</item>
   ...
</style>

<style name="EditTextStyle.Alignment" parent="@android:style/Widget.EditText">
    <item name="android:textAlignment">viewStart</item>
    <item name="android:gravity">start</item>
    <item name="android:textDirection">locale</item>
</style>
```

#### TextView

全局给所有 TextView 添加一个 RTL 属性

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
   ...
   <item name="android:textViewStyle">@style/TextViewStyle.TextDirection</item>
   ...
</style>

<style name="TextViewStyle.TextDirection" parent="android:Widget.TextView">
    <item name="android:textDirection">locale</item>
</style>
```

### TextView适配

1. 用setCompoundDrawablesRelative替代setCompoundDrawables
2. [android:layoutDirection](https://developer.android.com/reference/android/util/LayoutDirection) 设置组件的布局方向
   - INHERIT<br >layout direction继承parent
   - LOCALE<br >layout direction由locale中决定
   - LTR<br >layout direction left to right
   - RTL<br >layout direction right to left
3. [android:textDirection](https://developer.android.com/reference/android/view/View#attr_android:textDirection) 设置组件文字的方向

Defines the direction of the text. 必须是一个int值.

- anyRtl 段落的文本方向是RTL如果包含任意一个RTL强字符，如果没有一个RTL字符看是否包括任意一个LTR字符有的话就是LRT；如果两者都不是段落文本的方向由这个view的layout direction决定
- firstStrong 根view默认是这个。段落文本方向取第一个强字符的方向作为文本方向，如果没有强字符，由这个view的layout direction决定
- firstStrongLtr 段落文本方向取第一个强字符的方向作为文本方向，如果没有强字符，该段落的文本方向是LTR
- firstStrongRtl 段落文本方向取第一个强字符的方向作为文本方向，如果没有强字符，该段落的文本方向是RTL
- inherit 默认
- locale 段落文本方向跟随系统Locale
- ltr 段落文本方向是ltr
- rtl 段落文本方向是rtl

4. [android:textAlignment](https://developer.android.com/reference/android/view/View#attr_android:textAlignment) 设置组件文字的对齐

Defines the alignment of the text.

- inherit 默认
- center 居中对齐段落
- gravity root view默认，和每行文字的方向相关
- textEnd 对齐段落end，例如：`ALIGN_OPPOSITE`
- textStart 对齐段落start，例如：`ALIGN_NORMAL`
- viewEnd 对齐view的end，如果layoutDirection是LTR是ALIGN_RIGHT，如果是RLT那么是ALIGN_LEFT
- viewStart 对齐view的start，如果layoutDirection是LTR是ALIGN_LEFT，如果是RLT那么是ALIGN_RIGHT

### ViewPager适配

> Android 官方控件大多支持 RTL，ViewPager 除

<https://github.com/diego-gomez-olvera/RtlViewPager><br ><https://github.com/yotadevices/RtlViewPager>

> 貌似在阿语会出现StackOverflowError，可采用ViewPager2替代

## 切换语言

见[[多语言切换]]

## 多语言切换包

1. 服务器编辑好多语言包
2. 生成对应的语言包res/values/strings.xml，其他语言的strings.xml
3. 客户端定义一个task，下载多语言包
4. 解压覆盖多语言

## 其他

### 对集合进行倒序处理

```java
Collections.reverse(List<?> list);
```

### 代码动态设置控件 setMargins

```java
FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
params.setMargins(10, 0, 10, 0);
params.setMarginEnd(10);
```

### 其他

1. 横向布局 LinearLayout ，可以使用 FrameLayout，控件需要靠左或靠右可以使用 layout_gravity 设置对应属性<br >切换阿拉伯语时，网格布局 item 之间的距离会出现增大问题，处理方法是：网格分割线 ItemDecoration 需要加入语言来判断，调换原来设置左右的边距即可
2. 禁止掉之前的侧滑返回，以免出现冲突
3. 一些方向图标，重新做一个相对方向的放到 mipmap-ldrtl-xxxhdpi 包下；也可以一张图设置翻转
4. 动画翻转, 放在 anim-ldrtl 将对应的动画进行反向处理
5. 布局里如果设置了 paddingLeft、drawableLeft 等等这些属性更改为一个支持 RTL 的属性 paddingStart、drawableStart；但是有些地方可以不加的，例如：购物车上的数量徽章，加了之后感觉怪怪的，所以还是不加了
6. 利用在 AS 右边的预览布局工具中的语言切换工具，切换成阿拉伯语，能实时看到布局的效果图
7. EditText 添加 android:layoutDirection="locale" ，如果外面有 TextInputLayout 的需给它设置 android:textDirection="locale" ，如果输入类型时密码时还需添加一个属性 android:textAlignment="viewStart"
8. TextView 需要加上 android:textAlignment="viewStart 或 viewEnd" 以及 android:textDirection="locale"
9. RecyclerView 网络布局的可以考虑使用 StaggeredGridLayoutManager ，如果数量太多的网格布局，不太建议使用，可能会出现滑动混乱
10. 阿拉伯语目录下的 String.xml 文件, 出现占位符 d% 需要注意改为 %d, 但又并不是所有都改成这样, 目前我发现当代码中使用了 Toast 和 SpannableString 属性的就需要更改为 %d

## Ref

- Android 中东阿拉伯语适配，看这一篇够了<br ><https://www.jianshu.com/p/d8cd294a5c31>
- [ ] [安卓自动化脚本，辅助开发者处理国际化问题](https://github.com/scsfwgy/AndroidScript)
