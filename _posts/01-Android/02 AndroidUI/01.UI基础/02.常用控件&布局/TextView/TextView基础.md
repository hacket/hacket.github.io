---
date created: 2024-06-04 13:41
date updated: 2024-12-24 00:27
dg-publish: true
---

# TextView基本设置

## 基础设置

### TextView设置字体粗细

1. 布局里设置

```xml
android:textStyle="bold"
```

2. 代码设置

```java
//android中为textview动态设置字体为粗体
TextView textView = (TextView)findViewById(R.id.textView);
textView .setTypeface(Typeface.defaultFromStyle(Typeface.BOLD));
//设置不为加粗
textView.setTypeface(Typeface.defaultFromStyle(Typeface.NORMAL));
```

3. strings.xml设置

```xml
<string name="styled_text">Plain, <b>bold</b>, <i>italic</i>, <b><i>bold-italic</i></b></string>
```

### TextView的drawable

#### TextView的drawable xml属性

TextView有一些属性可以在Text的四周设置一个drawable对象，图片,shape等合法的drawable都可以用。

```
drawableStart API 14才有
drawableLeft
drawableTop
drawableBottom
drawableRight
drawableEnd API 14才有
drawablePadding 用以设置drawable与text之间的空间
```

left/top/right/bottom就是在文字的上下左右放置drawable。而drawableStart和drawableEnd则有特殊的意义，虽然它们是API 14加上去的，但是要在API 17后才能真正的生效，它们的作用是当语言方向发生变化时，会换边，LTR语言drawableStart在左边，而drawableEnd在右边；但对于RTL语言来说就会反过来drawableStart在右，drawableEnd在左

#### TextView的drawable的一些注意事项

1. TextView的padding作用在drawable之外
2. TextView的高度或宽度为wrap_content时将是文字和drawable中较大的那一个，再加上padding和margin
3. gravity只对文字起作用，对drawable不起作用
4. drawable会在其所在的维度居中显示，比如drawableLeft是上下垂直居中的，以此类推

#### 代码设置setCompoundDrawables和setCompoundDrawablesWithIntrinsicBounds

```java
public void setCompoundDrawables(Drawable left, Drawable top, Drawable right, Drawable bottom)
// 设置Drawable显示在text的左、上、右、下位置。 要先设置setBounds(x,x,x,x);  The Drawables must already have had Drawable.setBounds called.
```

- `setCompoundDrawables`和`setCompoundDrawablesWithIntrinsicBounds`区别<br>setCompoundDrawables画的drawable的宽高是按drawable.setBound()设置的宽高，所以才有The Drawables must already have had setBounds(Rect) called。使用之前必须使用Drawable.setBounds设置Drawable的长宽。

setCompoundDrawablesWithIntrinsicBounds是画的drawable的宽高是按drawable固定的宽高，所以才有The Drawables' bounds will be set to their intrinsic bounds。即通过getIntrinsicWidth()与getIntrinsicHeight()获得.

#### setCompoundDrawables和setCompoundDrawablesRelative

> 可以在上、下、左、右设置图标，如果不想在某个地方显示，则设置为null。但是Drawable必须已经setBounds(Rect)。意思是你要添加的资源必须已经设置过初始位置、宽和高等信息。

1. 需要设置`setBounds`；就是不按比例，宽高可以打破原有的大小及比例
2. 要适配RTL用setCompoundDrawablesRelative

#### 和setCompoundDrawablesWithIn和setCompoundDrawablesRelativeWithIntrinsicBounds

> 可以在上、下、左、右设置图标，如果不想在某个地方显示，则设置为null。图标的宽高将会设置为固有宽高，既自动通过getIntrinsicWidth和getIntrinsicHeight获取。

1. 不需要设置`setBounds`；按照原有比例大小显示图片
2. 要适配RTL用setCompoundDrawablesRelativeWithIntrinsicBounds

```kotlin
val bitmap = BitmapDrawable(resources, it)
val width = resources.getDimensionPixelSize(R.dimen.qb_px_16)
bitmap.setBounds(0, 0, width, width)
setCompoundDrawablesRelative(null, null, bitmap, null)
```

#### setCompoundDrawables和setCompoundDrawablesWithIn

setCompoundDrawables画的drawable的宽高是按drawable.setBound()设置的宽高，使用之前必须使用Drawable.setBounds设置Drawable的长宽。

setCompoundDrawablesWithIntrinsicBounds是画的drawable的宽高是按drawable固定的宽高，所以才有The Drawables' bounds will be set to their intrinsic bounds。即通过getIntrinsicWidth()与getIntrinsicHeight()获得。

#### setBounds

setBounds(x,y,width,height);

1. x:组件在容器X轴上的起点
2. y:组件在容器Y轴上的起点
3. width:组件的长度
4. height:组件的高度。

```java
Drawable myImage = getResources().getDrawable(R.drawable.home);
myImage.setBounds(1, 1, 100, 100);
button.setCompoundDrawables(null, myImage, null, null);
```

#### 局限性

> 有些时候它也有一些局限性而没有办法用它：

1. 当drawable本身没有高度时（比如shape），这个drawable高度就会依赖于文字，因为padding是加在drawable之外，所以只会依赖于文字的高度。有些时候这不是想要的结果。
2. 当Icon需要与文字分开单独控制时，很显示这要分成二个View。
3. 当需要对Icon进行特殊的个性化时，比如添加背景，特效等。
4. 其他一些造成无法使用的。
5. 除上述情况外，就要考虑使用drawable了。

### TextView阴影效果

#### shadowDx/shadowDy/shadowRadius/shadowColor

**XML 属性：**

- `android:shadowColor`：阴影的颜色
- `android:shadowDx`：阴影的偏移量；水平方向上的偏移量
- `android:shadowDy`：阴影的偏移量；垂直方向上的偏移量
- `android:shadowRadius`：是阴影的的半径大小；控制的主要就是阴影的宽度，它的值也大，阴影越大，而且颜色越淡

**代码：** `setShadowLayer`

```java
setShadowLayer(radius, dx, dy, color);
// 它的四个参数，分别对应上面的四个属性
// 四个属性取值，要么直接写，要么使用getResource进行一步转化才行
```

**代码使用：**

```java
public class MainActivity extends Activity {
    TextView tv;
    Button bt;
    int a;
    float t1;
    float t2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        tv = (TextView) findViewById(R.id.tv);
        bt = (Button) findViewById(R.id.bt);
        a = 0;
        t1 = getResources().getDimension(R.dimen.activity_horizontal_margin);
        t2 = getResources().getDimension(R.dimen.activity_vertical_margin);

        bt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View arg0) {
                if (a == 1) {
                    // R.color没有效果
                    tv.setShadowLayer(t1, t1, t1, R.color.aaa);
                    a = 0;

                } else {
                    tv.setShadowLayer(t2, t2, t2, 0x800000ff);
                    a = 1;
                }
                bt.setText(a + "");
            }
        });

    }   
}
```

#### 各个属性值影响

- 普通效果

```xml
<TextView
	android:layout_width="match_parent"
	android:layout_height="match_parent"
	android:shadowColor="#ff0000"
	android:shadowDx="3"
	android:shadowDy="3"
	android:shadowRadius="1"
	android:text="abcdefg"
	android:textColor="#0000ff"
	android:textSize="100sp" />
```

![|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241028102520.png)

- `android:shadowRadius="0"`，shadowRadius=0，就不会有阴影显示

![|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241028102610.png)

- `android:shadowRadius="20"`，控制的主要就是阴影的宽度，它的值也大，阴影越大，而且颜色越淡

![|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241028102821.png)

- `shadowDx` 和 `shadowDy`

```xml
android:shadowDx="30"
android:shadowDy="30"
```

![|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241028103026.png)

#### 示例

- **案例1：**

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >
    <TextView
        android:id="@+id/deskclock_time"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentTop="true"
        android:layout_centerInParent="true"
        android:includeFontPadding="false"
        android:lineSpacingExtra="0dp"
        android:padding="0dp"
        android:shadowColor="#ff0000"
        android:shadowDx="10"
        android:shadowDy="20"
        android:shadowRadius="50"
        android:text="2015年7月1日"
        android:textColor="#00ff00"
        android:textSize="53sp" />
</RelativeLayout>
```

![image.png|200](https://cdn.nlark.com/yuque/0/2023/png/694278/1688145790719-c45a06b0-3316-4997-8b90-8675f6f72f79.png#averageHue=%2382dd6b&clientId=u104b782c-ab13-4&from=paste&height=101&id=u00df9730&originHeight=152&originWidth=502&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=72587&status=done&style=none&taskId=u73fc044c-e24b-4b50-834a-ad3df317c49&title=&width=334.6666666666667)

### 字体TypeFace

#### Android字体简介

Android系统默认支持三种字体，分别为：`sans`,`serif`,`monospace`。<br>android.graphic.typeface字体类：<br>本类的常量静态定义，首先为字体类型（typeface）名称:

1. Typeface DEFAULT
2. Typeface DEFAULT_BOLD
3. Typeface MONOSPACE
4. Typeface SANS_SERIF
5. Typeface SERIF

字体风格（style）名称:

1. int BOLD
2. int BOLD_ITALIC
3. int ITALIC
4. int NORMAL

设置TextView的字体可以通过TextView中的setTypeface方法来指定一个Typeface对象，因为Android的字体类比较简单，我们列出所有成员方法:

```
staticTypeface create(Typeface family, int style)//静态方法，参数一为字体类型这里是Typeface的静态定义，如宋体，参数二风格，如粗体，斜体
staticTypeface create(String familyName, int style)//静态方法，参数一为字体名的字符串，参数二为风格同上，这里我们推荐使用上面的方法。
staticTypeface createFromAsset(AssetManager mgr, String path)//静态方法，参数一为AssetManager对象，主要用于从APK的assets文件夹中取出字体，参数二为相对于Android工程下的assets文件夹中的外挂字体文件的路径。
staticTypeface createFromFile(File path)//静态方法，从文件系统构造一个字体，这里参数可以是sdcard中的某个字体文件
staticTypeface createFromFile(String path) //静态方法，从指定路径中构造字体
staticTypeface defaultFromStyle(int style) //静态方法，返回默认的字体风格
intgetStyle() //获取当前字体风格
finalboolean isBold() //判断当前是否为粗体
finalboolean isItalic() //判断当前风格是否为斜体
```

#### textFontWeight 字体粗细

textFontWeight生效条件

1. API28及以上
2. 设置了字体
3. 值在`[1, 1000]`之间

XML设置

- android:fontFamily：字体家，里面可以有多个字体，可搭配字体权重，引用的是xml文件，例如【android:fontFamily="@font/myfont"】，文件在【res-font中】。
- android:textFontWeight：设置使用的字体的权重，权重高使用谁，和android:fontFamily一起使用

```xml
<androidx.appcompat.widget.AppCompatTextView
    android:id="@+id/tv_title0"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:fontFamily="sans-serif"
    android:gravity="center"
    android:text="Free Shipping(带bold, fontWeight=900)"
    android:textColor="@color/sui_color_discount_dark"
    android:textFontWeight="900"
    android:textSize="@dimen/sui_text_size_12"
    android:textStyle="bold" />
```

Xml 设置不生效，用代码设置：

```kotlin
private fun TextView?.setTextFontWeight(fontWeight: Int) {  
    if (this == null) return  
    val default = Typeface.DEFAULT  
    val newTypeface = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {  
        Typeface.create(default, fontWeight, false)  
    } else {  
        if (fontWeight >= 700) {  
            Typeface.create(default, Typeface.BOLD)  
        } else {  
            Typeface.DEFAULT  
        }  
    }  
    this.typeface = newTypeface  
}
```

#### 自定义字体

##### TextView xml 设置

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688145806627-e3db8fa4-1b4e-47f6-9c5c-91350c57a5f9.png#averageHue=%23313c44&clientId=u104b782c-ab13-4&from=paste&height=172&id=uc2a8d76a&originHeight=258&originWidth=764&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=29385&status=done&style=none&taskId=udd355a68-0370-4055-a6a9-0059bd41159&title=&width=509.3333333333333)

- custom_bold_font.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<font-family xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <font
        android:font="@font/din_alternate_bold"
        android:fontStyle="normal"
        android:fontWeight="900"
        app:font="@font/din_alternate_bold"
        app:fontStyle="normal"
        app:fontWeight="900" />
</font-family>
```

使用`android:fontFamily="@font/custom_bold_font"`

如果这种方式不生效，检查主题是否设置了 `android:fontFamily` 导致不生效

```xml
<style name="Theme.AppWidgets" parent="Theme.MaterialComponents.DayNight.DarkActionBar">  
    <!--<item name="fontFamily">@font/raleway_regular</item>-->  
    <item name="android:fontFamily">@font/raleway_regular</item>  
    <item name="android:textColorPrimary">@color/white</item>  
    <item name="android:textColorSecondary">@color/white</item>  
    <item name="colorControlNormal">@color/white</item>  
    <item name="gradientStartColor">@color/sky_blue_200</item>  
    <item name="gradientEndColor">@color/sky_blue_500</item>  
</style>
```

##### TextPaint设置

```kotlin
textPaint.typeface = ResourcesCompat.getFont(context, R.font.custom_bold_font)
```

##### Typeface.createFromAsset 从assets中加载

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240923110554.png)

```kotlin
fun TextView.setFont(assetsPath: String) {
    val type = Typeface.createFromAsset(context.assets, assetsPath)
    setTypeface(type)
}
// 使用
binding.btnCrash.setFont("font/AVENGEANCE-HEROIC-AVENGER-2.ttf")
```

![|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240923111222.png)

## TextView文字渐变

### 方法1：自定义TextView设置LinearGradient，渐变是整体的

继承 TextView，重写 onLayout 方法后设置 Shader

```java
public class GradientTextView extends androidx.appcompat.widget.AppCompatTextView {
    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);

        if (changed) {
            int startColor = Color.RED;
            int endColor = Color.BLUE;
            getPaint().setShader(
                    new LinearGradient(0, 0, getWidth(), getHeight(),
                            startColor,
                            endColor,
                            Shader.TileMode.CLAMP));
        }
    }
}
```

创建 LinearGradient 时，传入的起始坐标为 (0,0)，结束坐标为 (getWidth(), getHeight())，所以渐变效果是从左上角向右下角渐变的：<br>改成从上往下渐变的效果：

```java
getPaint().setShader(new LinearGradient(0, 0, 0, getHeight(),
        startColor,
        endColor,
        Shader.TileMode.CLAMP));
```

### 方法2：给TextView设置LinearGradient

直接给TextView设置Shader，无需自定义TextView

```java
Shader shader = new LinearGradient(0, 0, 0, textView.getLineHeight(), Color.RED, Color.BLUE, Shader.TileMode.REPEAT);
textView.getPaint().setShader(shader);
textView.setText("哈喽，benio\n哈喽，benio\n哈喽，benio");
```

多行渐变，效果不错。但是这种做法有一点缺陷，那就是所有文字都变成渐变色了。假设我们只需要部分字符是渐变色的话，这种方式就不太合理了。特别是在一些使用了 Span 的场景下。

### 方法3：自定义Span

参考官方`ForegroundColorSpan`的实现，在`updateDrawState()`方法中改变颜色

```java
class LinearGradientForegroundSpan extends CharacterStyle implements UpdateAppearance {
    private int startColor;
    private int endColor;
    private int lineHeight;

    public LinearGradientForegroundSpan(int startColor, int endColor, int lineHeight) {
        this.startColor = startColor;
        this.endColor = endColor;
        this.lineHeight = lineHeight;
    }

    @Override
    public void updateDrawState(TextPaint tp) {
        tp.setShader(new LinearGradient(0, 0, 0, lineHeight,
                startColor, endColor, Shader.TileMode.REPEAT));
    }
}
```

### 文字渐变小结

1. 法一：渐变效果与 View 的宽或高相关。适用于所有文本整体渐变的场景
2. 法二：渐变效果与行相关，每行的渐变效果一致。适用于每行文本渐变效果一致的场景
3. 法三：用 Span 来实现，适用于局部文本渐变，多行文本渐变的场景

## ellipsize属性

设置当文字过长时,该控件该如何显示。有如下值设置：

- start 省略号显示在开头；
- end 省略号显示在结尾；
- middle 省略号显示在中间；
- marquee 以[跑马灯]的方式显示(动画横向移动)

### ellipise示例

1. android:ellipsize="end"或mTextView.setEllipsize(TextUtils.TruncateAt.END);

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685193797680-e58dc9dc-bc33-444a-9546-b3ae4f25e75a.png#averageHue=%23fbfbfb&clientId=u67755206-07e7-4&from=paste&height=80&id=u2956cf6a&originHeight=160&originWidth=636&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38762&status=done&style=none&taskId=u16abc825-cdf5-4e2b-ac96-845fbd87395&title=&width=318)

2. android:ellipsize="start"或mTextView.setEllipsize(TextUtils.TruncateAt.START)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685193818645-dcd70d74-ad4f-4cc1-9944-731dff204dd2.png#averageHue=%23fafafa&clientId=u67755206-07e7-4&from=paste&height=77&id=u41ffd5d3&originHeight=154&originWidth=636&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41605&status=done&style=none&taskId=uf1dfeb6f-32a3-4707-a638-cab6f4137e2&title=&width=318)

3. android:ellipsize="middle"或mTextView.setEllipsize(TextUtils.TruncateAt.MIDDLE);

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685193827262-0337fa30-5da9-4ec7-beef-201e683fc9c1.png#averageHue=%23fbfbfb&clientId=u67755206-07e7-4&from=paste&height=84&id=ufea0a674&originHeight=168&originWidth=612&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39689&status=done&style=none&taskId=u058104bd-5771-44ae-b41d-e12ea4e788b&title=&width=306)

### ellipise常见问题

#### ellipise无效，设置了end，没有...

1. 设置ellipsize 属性后没有效果 加上singleLine="true"就有效果，但是不能写 lines="1" 和 maxLine="1" ,这样会导致崩溃。
2. Textview.append(" "); ellipsize也会失效，记得加上singleLine=true

#### 显示不出来

```xml
<TextView
  android:id="@+id/me_login_btn"
  android:layout_width="wrap_content"
  android:layout_height="wrap_content"
  android:layout_marginEnd="16dp"
  android:ellipsize="end"
  android:gravity="center_vertical"
  android:maxLines="2"
  android:onClick="@{viewModel::clickLoginBtn}"
  android:text="@{@string/string_key_10+' '+'/'+' '+@string/string_key_11+' '+'>'}"
  android:textColor="@color/sui_color_gray_dark1"
  android:textStyle="bold"
  android:visibility="@{viewModel.showLogin}"
  app:autoSizeMaxTextSize="20sp"
  app:autoSizeMinTextSize="16sp"
  app:autoSizeStepGranularity="1sp"
  app:autoSizeTextType="uniform"
  tools:visibility="visible" />
```

**问题：** 在泰语显示两行时，第二行底部的文本显示不全，被裁剪了一部分<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1685584554311-a509fdee-13c3-4ee0-b976-60f02db1b1a6.png#averageHue=%23343a37&clientId=u638e139d-1816-4&from=paste&height=297&id=u778e8d1d&originHeight=341&originWidth=192&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89390&status=done&style=none&taskId=u6ae4e496-9158-4833-b779-7c362e48879&title=&width=167)<br>**分析：**可能原因是配置了 maxLines 和 ellipise，又在 RecyclerView 中，导致显示不全，具体原因未知。<br>**解决：**去掉 ellipsize="end"即可<br>![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1685584639752-2f6e0a55-8bb5-4ab2-a4fa-9bb321bc140a.png#averageHue=%23dbdbdb&clientId=u638e139d-1816-4&from=paste&height=54&id=ub66b0628&originHeight=108&originWidth=330&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13342&status=done&style=none&taskId=uade159f2-e92e-43f5-8f8b-d43b91bd8f2&title=&width=165)

### Android TextView关于ellipsize=end的一个bug

`textView的文本内容中包含\n字符或者其它html字符比如\<.*?>`<br>解决方案也很简单，直接在setText之前调用：

```java
myText.replaceAll("\\<.*?>","");
```

- [x] Android TextView关于android:ellipsize=end的一个bug<br><https://blog.csdn.net/mq2553299/article/details/78438363>

## Autosizing（TextView文本大小自动适配）

### Autosizing方式

官方推出的TextView的Autosizing方式，在宽度固定的情况下，可以设置最大文本Size和最小文本Size和每次缩放粒度。

#### Autosizing使用

**XML方式：**

```xml
<TextView
  android:layout_width="340dp"
  android:layout_height="50dp"
  android:background="@drawable/shape_bg_008577"
  android:gravity="center_vertical"
  android:maxLines="1"
  android:text="这是标题，该标题的名字比较长，产品要求不换行全部显示出来"
  android:textSize="18sp"
  android:autoSizeTextType="uniform"
  android:autoSizeMaxTextSize="18sp"
  android:autoSizeMinTextSize="10sp"
  android:autoSizeStepGranularity="1sp"/>

```

属性解释：

- **autoSizeTextType**：设置 TextView 是否支持自动改变文本大小，none 表示不支持，uniform 表示支持。
- **autoSizeMinTextSize**：最小文字大小，例如设置为10sp，表示文字最多只能缩小到10sp。
- **autoSizeMaxTextSize**：最大文字大小，例如设置为18sp，表示文字最多只能放大到18sp。
- **autoSizeStepGranularity**：缩放粒度，即每次文字大小变化的数值，例如设置为1sp，表示每次缩小或放大的值为1sp。

**代码中使用：**

```java
TextView tvText = findViewById(R.id.tv_text);
TextViewCompat.setAutoSizeTextTypeWithDefaults(tvText,TextViewCompat.AUTO_SIZE_TEXT_TYPE_UNIFORM);
TextViewCompat.setAutoSizeTextTypeUniformWithConfiguration(tvText,10,18,1, TypedValue.COMPLEX_UNIT_SP);
```

![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1685325813711-9b9888c1-6621-462a-ba58-2bc503944b5b.png#averageHue=%23d7e3e2&clientId=u3ff3e62c-3aaa-4&from=paste&height=134&id=u2c158436&originHeight=306&originWidth=1068&originalType=binary&ratio=2&rotation=0&showTitle=false&size=163387&status=done&style=none&taskId=u68bc2646-bc9f-47f1-b46d-7ddbeae5003&title=&width=467)

#### Autosizing不生效？

Autosizing 在不同的宽高 wrap_content，是否多行，都生效，前提是已经摆放不下了<br>**原因**：设置了 `android:singleLine="true"`<br>**解决：** 去掉即可

### 自定义View的方式（固定宽度）

其核心思想和上面的 Autosizing 的方式类似，一般是测量 TextView 字体所占的宽度与 TextView 控件的宽度对比，动态改变 TextView 的字体大小。<br>类似：[AutoSizeTextView](https://github.com/iglaweb/AutoSizeTextView/blob/master/library/src/main/java/ru/igla/widget/AutoSizeTextView.java)

### 使用工具类自行计算（非控件固定宽度）

自定义View计算宽度的方法抽取出来：

1. 基于当前textSize来获取宽度
2. 如果获取的宽度小于等于可用的宽度，就设置该文字大小，否则一直循环重复1~2步骤

```java
private void adjustTvTextSize(TextView tv, int maxWidth, String text) {
    int avaiWidth = maxWidth - tv.getPaddingLeft() - tv.getPaddingRight();
    if (avaiWidth <= 0) {
        return;
    }
    TextPaint textPaintClone = new TextPaint(tv.getPaint());
    float trySize = textPaintClone.getTextSize();
    while (textPaintClone.measureText(text) > avaiWidth) {
        trySize--;
        textPaintClone.setTextSize(trySize);
    }
    tv.setTextSize(TypedValue.COMPLEX_UNIT_PX, trySize);
}
```

示例：

```xml
<LinearLayout        
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:layout_marginLeft="@dimen/d_15dp"
  android:layout_marginRight="@dimen/d_15dp"
  android:gravity="center"
  android:orientation="horizontal">
  <TextView
    android:id="@+id/tv_job_detail_dollar"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="$"
    android:textColor="@color/black"
    android:textSize="@dimen/job_detail_message_size"/>
  <TextView
    android:id="@+id/text_view_hourly_rate"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginLeft="@dimen/d_2dp"
    android:singleLine="true"
    android:text="-"
    android:textColor="@color/job_detail_black"
    android:textSize="30sp" />
</LinearLayout>
```

可以看到2个都是wrap content，那么如何实现这种适应宽度+多布局的变长宽度效果呢。其实就是需要我们调用方法手动的计算金额TextView的宽度

```java
int mFullNameTVMaxWidth = CommUtils.dip2px(60);

//    mTextViewHourlyRate.setText(totalMoney);
//     while (true) {
//         float measureTextWidth = mTextViewHourlyRate.getPaint().measureText(totalMoney);

//         if (measureTextWidth > mFullNameTVMaxWidth) {
//             int textSize = (int) mTextViewHourlyRate.getTextSize();
//             textSize = textSize - 2;
//             mTextViewHourlyRate.setTextSize(TypedValue.COMPLEX_UNIT_PX, textSize);
//         } else {
//             break;
//         }
//     }
adjustTvTextSize(mTextViewHourlyRate,mFullNameTVMaxWidth,totalMoney)
```

效果：<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1685326427676-9125db13-4291-4711-ab4d-d14a87bdd96d.png#averageHue=%23f6f5f3&clientId=u3ff3e62c-3aaa-4&from=paste&height=81&id=u0444bb81&originHeight=900&originWidth=996&originalType=binary&ratio=2&rotation=0&showTitle=false&size=303009&status=done&style=stroke&taskId=u1f7e255f-76a6-40cb-8b39-707b421b10e&title=&width=90)

### 1行展示不下，先缩放字体到最小大小10sp，还展示不下，设置展示2行

```kotlin
val textPaintClone = TextPaint()

private fun adjustTvTextSize(
    tv: TextView,
    maxLineWidth: Int,
    text: String,
    defaultTextSizeSp: Float = 18F,
    minTextSizeSp: Float = 10F
) {
    val textSizeQueue: ArrayDeque<Float> by lazy {
        ArrayDeque<Float>().apply {
            add(18f)
            add(16f)
            add(14f)
            add(12f)
            add(10f)
        }
    }
    val availWidth = maxLineWidth - tv.paddingStart - tv.paddingEnd - 6F.dp()
    if (availWidth <= 0) {
        return
    }
    tv.maxLines = 1
    tv.textSize = defaultTextSizeSp

    textPaintClone.set(tv.paint)
    textPaintClone.textSize = ScreenUtils.sp2px(this, defaultTextSizeSp).toFloat()
    var tryTextSizeSp = defaultTextSizeSp
    Log.v(
        "hacket",
        "start tryTextSizeSp(sp)=${tryTextSizeSp}, defaultTextSizeSp=$defaultTextSizeSp, minTextSizeSp=$minTextSizeSp, textSizeQueue=$textSizeQueue"
    )
    var i = 1

    while (textSizeQueue.isNotEmpty() && textPaintClone.measureText(text) >= availWidth) {
        val tempTextSize = textSizeQueue.removeFirstOrNull() ?: 0F
        if (tempTextSize <= 0F) {
            continue
        }
        if (tryTextSizeSp <= minTextSizeSp) {
            continue
        }
        textPaintClone.textSize = ScreenUtils.sp2px(this, tempTextSize).toFloat()
        tv.textSize = tempTextSize
//            val isAvail = textPaintClone.measureText(text) > availWidth
//            if (!isAvail) {
//                continue
//            }
        tryTextSizeSp = tempTextSize

        Log.v(
            "hacket", "第${i}次 尝试，measureText=${
                textPaintClone.measureText(
                    text
                )
            }, availWidth=$availWidth, tryTextSizeSp=$tryTextSizeSp(${
                ScreenUtils.sp2px(
                    this, tryTextSizeSp
                ).toFloat()
            }), minTextSizeSp=$minTextSizeSp, textSizeQueue=$textSizeQueue"
        )
        i++
    }
    val avail = textPaintClone.measureText(text) > availWidth
    if (avail) {
        tv.maxLines = 2
    }
    Log.w("hacket", "final tryTextSizeSp=${tryTextSizeSp}, avail=$avail")
}
```

xml:

```xml
<androidx.appcompat.widget.AppCompatTextView
    android:id="@+id/tvCouponVal"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:ellipsize="end"
    android:gravity="center"
    android:maxLines="1"
    android:paddingHorizontal="27dp"
    android:text="MIỄN PHÍ VẬN CHUYỂN"
    android:textColor="@color/sui_color_discount"
    android:textFontWeight="700"
    android:textSize="@dimen/sui_text_size_18"
    android:textStyle="bold"
    app:layout_constrainedWidth="true"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="@id/ivCouponIcon"
    app:layout_constraintStart_toStartOf="@id/ivCouponIcon"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintVertical_bias="0.15" />
```

## TextView跑马灯（显示一行，滚动显示）

TextView不会主动获取焦点，一个布局中只能有一个组件获取焦点<br>获取到焦点时跑马灯。<br>设置成maxLines="1"时跑马灯不工作，要用singleLine="true"

### 系统自带的 xml中进行属性配置

```xml
android:ellipsize="marquee"  
android:focusable="true"
android:focusableInTouchMode="true"
android:singleLine="true"  //只显示一行
```

### 自定义一个滚动的TextView

对button，这种，可以触摸获取焦点的，配置android:ellipsize="marquee" android:singleLine="true"  ，就可以将看不到的文字显示出来，而TextView，天生不能获取焦点，那只能重写里面的方法，isActivated()，让其返回true，那么就可以被获取焦点了。

```java
public class FocusedTextView extends AppCompatTextView {
    public FocusedTextView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    public FocusedTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public FocusedTextView(Context context) {
        super(context);
    }

    @Override
    public boolean isFocused() {
        return true;
    }
}
```

#### 控制跑马灯

```kotlin
btn_start_marquee.setOnClickListener {
    if (tv_marquee.getEllipsize() != null) {
        tv_marquee.setEllipsize(null);
    } else {
        tv_marquee.setEllipsize(TextUtils.TruncateAt.MARQUEE);
    }
}
```

#### 跑马灯控制方向

- 可以控制移动方向的跑马灯<br><https://weiwangqiang.github.io/2019/02/03/controllable-marquee/>

## 安卓字体不随系统字体变化

### 1. 字体单位用dp而不是sp

### 2. 手动设置setTextSize不受影响

> 但如果没有设置用的系统默认字体，无效，TextView读取属性设置字体不是走的这个方法，而是走的setRawTextSize

```java
@Override
public void setTextSize(int unit, float size) {
    if (unit == TypedValue.COMPLEX_UNIT_SP) {
        int dpUnit = TypedValue.COMPLEX_UNIT_DIP;
        super.setTextSize(dpUnit, size);
    }
}
```

### 3. Configuration不受影响

<https://www.jianshu.com/p/059f3bad61b2>

## TextView基线

![](https://img2.mukewang.com/5c58d3030001eb4209260274.jpg#id=Hq9In&originHeight=274&originWidth=926&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br>基线辅助测试<br><https://github.com/suragch/AndroidFontMetrics>

## TextView中的文字长度测量

### TextView.getPaint().measureText(String text)

只是测试传入的text在该TextView的配置下的总长度，并不是计算每一行的长度。

### TextView.getLayout().getLineWidth(int line)

这个方法确实计算得到的是每一行文字的实际长度，注意这里是实际长度，也就是说当设置singleLine属性时，用这个方法测量得到的是一整行文字的长度，包括溢出部分。

### 设置android:maxLines="1"和android:singleLine="true"有什么区别

1. maxLines还是会默认自动进行换行策略，假如一段文字自动换行后有5行，maxLines设置为1，那么就只显示第一行的内容，其他行不显示。
2. singleLine, 那么这段可以有5行的文字将会被强制放在1行里，然后看最多能显示多少字符，剩下的不显示。

> 设置成maxLines="1"时跑马灯不工作

- [ ] <https://www.cnblogs.com/dasusu/p/6602710.html>

## TextView 添加超链接(两种实现方式)

### 方法一：Linkify-设置autolink，让系统自动识别超链接。

```
tv.setAutoLinkMask(Linkify.ALL);
tv.setLinksClickable(true);//设置链接可点击,不设置链接不会变蓝
tv.setMovementMethod(LinkMovementMethod.getInstance());
```

### 方式二：通过HTML格式化你的网址

```
String html = "<a href='http://www.baidu.com'>百度一下</a>";//注意这里必须加上协议号，即http://。 
CharSequence charSequence = Html.fromHtml(html);
tv.setText(charSequence);
tv.setMovementMethod(LinkMovementMethod.getInstance());
```

### 小结

总结一下就是，以html显示超链接，必须写全url。以setAutoLinkMask(Linkify.ALL)可以不用不用写全，就能自动识别出来。

这两种方法，都得设置一下setMovementMethod，才会跳转。<br>另外setAutoLinkMask不仅 识别超链接，包括电话号码之类的。

## MovementMethod

### ScrollingMovementMethod

> 实现带滚动条的TextView，在更新文字时自动滚动到最后一行

```java
textView = (TextView) findViewById( R.id.tv ) ;
textView.setMovementMethod(ScrollingMovementMethod.getInstance());
```

## TextView中的各种padding

### padding相关API

1. getWidth(), getHeight()<br>对应你代码里的`layout_width`和`layout_height`。
2. getPaddingLeft/Right/Top/Bottom()<br>对应代码里的Padding，布局里的`android:padding`。
3. getCompoundDrawablePadding()<br>TextView设置的drawawble和文字之间的padding对应布局里的`android:drawablePadding`。
4. getCompoundPaddingLeft/Right/Top/Bottom()<br>获取混合的Padding, 既然是混合的，那么它的值也就是padding + 图片的大小 + drawablePadding的值（getCompoundPaddingLeft() = getPaddingLeft() + drawable.getIntrinsicWidth() + getCompoundDrawablePadding()）。说得通俗点就是，它是获取文字区域到TextView边界之间的间隔。 drawable和text之间的padding，就是drawablePadding
5. getExtendedPaddingTop()/Bottom<br>当有部分文字没有显示出来时，也就是设置了maxLine时，它的值就等于首行文字到TextView顶端的距离。同理，getExtendedPaddingBottom()就是最后一行文字到TextVeiw底部距离。其他情况下，他的值等于getCompoundPaddingTop/Bottom()的值。
6. getTotalPaddingLeft/Right/Top/Bottom()<br>获取总的Padding值，看了下源码，左右的值直接就是等于compoundPadding的值，上下的值等于ExtendedPadding的值再加上offset的值（跟Gravity的垂直方向的布局有关。说得通俗点就是，不管有没有maxLines，上下的值都分别等于首行到TextView顶端和末行到TextView底部的值。

```java
getTotalPaddingRight() = getCompoundDrawablePadding() + getCompoundDrawables()[2].getBounds().width()
```

- getPaddingRight()  所有的padding
- setPadding setPaddingRelative Android4.0（API 17）之后添加了设置Layout方向的功能（setLayoutDirection([@LayoutDir ](/LayoutDir) int layoutDirection)，从左到右或从右到左），setPadding的话不管方向如何都按照左上右下的顺序来配置Padding，setPaddingRelative的话则会按照配置的LayoutDirection来进行设置（从左到右的话为左上右下，从右到左的话为右上左下的顺序）
- setIncludeFontPadding  设置文本是否包含顶部和底部额外空白,给音标用的<br>去掉TextView上下为音标预留的一些padding值<br>setIncludeFontPadding(false)<br>setCompoundDrawablePadding(drawablePadding);不影响padding的值

### EditText默认padding

EditText没有默认的padding，如果有padding，那么都是来自背景图(.9的图)。<br>需要在xml中配置,：

```xml
android:background="@null"
```

如果用代码写，padding还是存在：

```java
 CompatUtil.setBackground(this, null);
```

如果是EditText的话，如果高度太低，那么会出现EditText的文本可以上下滚动

- [ ] what-is-the-value-of-default-edittext-padding?<br><http://stackoverflow.com/questions/9372159/align-imageview-with-edittext-horizontally/9384340#9384340>

### 动态改变Background后Padding无效的问题

在Layout中指定好background和padding以后，程序里面动态修改background之后padding就失效了，貌似是一个BUG。

解决：在setBackgroundResource之后重新设置一下padding。

```
// 方法一
int bottom = theView.getPaddingBottom();
int top = theView.getPaddingTop();
int right = theView.getPaddingRight();
int left = theView.getPaddingLeft();
theView.setBackgroundResource(R.drawable.entry_bg_with_image);
theView.setPadding(left, top, right, bottom);

// 方法二
int pad = resources.getDimensionPixelSize(R.dimen.linear_layout_padding);
theView.setBackgroundResource(R.drawable.entry_bg_with_image);
theView.setPadding(pad, pad, pad, pad);
```

- [ ] <http://stackoverflow.com/questions/5890379/android-setbackgroundresource-discards-my-xml-layout-attributes>
