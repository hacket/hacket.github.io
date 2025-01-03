---
date created: 2024-06-04 11:31
date updated: 2024-12-24 00:27
dg-publish: true
---

# `SpannableString`和`SpannableStringBuilder`

- `SpannableString` immutable 的 String
- `SpannableStringBuilder` 可 mutable 的 String
- setSpan

```java
public void setSpan(Object what, int start, int end, int flags) {
    super.setSpan(what, start, end, flags);
}

// 第一个参数：Object what：这个what就是上面分享的各种Span的类型，大家根据需要自己指定。
// 第二个第三个参数：int start, int end：这两个参数是Span开始跟结束的位置。
// 第四个参数：int flag 参数用4中类型，分别代表的意思为span开始结束的位置包含或者不包含start 、end，flags的取值如下：
//     1. Spannable.SPAN_INCLUSIVE_EXCLUSIVE：前面包括，后面不包括，即在文本前插入新的文本会应用该样式，而在文本后插入新文本不会应用该样式
//     2. Spannable.SPAN_INCLUSIVE_INCLUSIVE：前面包括，后面包括，即在文本前插入新的文本会应用该样式，而在文本后插入新文本也会应用该样式
//     3. Spannable.SPAN_EXCLUSIVE_EXCLUSIVE：前面不包括，后面不包括
//     4. Spannable.SPAN_EXCLUSIVE_INCLUSIVE：前面不包括，后面包括
```

# 各种Span

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146476834-443cdf85-2156-4703-9093-6e199df06c9b.png#averageHue=%234d4b43&clientId=uc827817d-755d-4&from=paste&height=656&id=u5b0c20c8&originHeight=1278&originWidth=386&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub86645a7-ce3e-4ab0-8a70-da00e79e8ea&title=&width=198)

## BackgroundColorSpan ：文本背景色

## ForegroundColorSpan : 文本颜色

### 基本使用

```java
textView = (TextView) findViewById(R.id.textview);
SpannableStringBuilder builder = new SpannableStringBuilder(textView.getText().toString());

//ForegroundColorSpan 为文字前景色，BackgroundColorSpan为文字背景色
ForegroundColorSpan redSpan = new ForegroundColorSpan(Color.RED);
ForegroundColorSpan whiteSpan = new ForegroundColorSpan(Color.WHITE);
ForegroundColorSpan blueSpan = new ForegroundColorSpan(Color.BLUE);
ForegroundColorSpan greenSpan = new ForegroundColorSpan(Color.GREEN);
ForegroundColorSpan yellowSpan = new ForegroundColorSpan(Color.YELLOW);

builder.setSpan(redSpan, 0, 1, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
builder.setSpan(whiteSpan, 1, 2, Spannable.SPAN_INCLUSIVE_INCLUSIVE);
builder.setSpan(blueSpan, 2, 3, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
builder.setSpan(greenSpan, 3, 4, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
builder.setSpan(yellowSpan, 4,5, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

textView.setText(builder);
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146573861-5d22d412-ba26-4a0c-8a70-5fd891bf3e82.png#averageHue=%23585752&clientId=uc827817d-755d-4&from=paste&id=ud37c833e&originHeight=166&originWidth=374&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf2dc7abc-3cf3-46b2-85c5-f13760ab5ee&title=)

### 单个字符串的ForegroundColorSpan

```kotlin
// 单个字符串的ForegroundColorSpan
fun String.toColorSpan(spanText: String, spanColor: Int): SpannableStringBuilder {
    return SpannableStringBuilder(this).apply {
        val colorSpan = ForegroundColorSpan(spanColor)
        val start = this.indexOf(spanText)
        if (start != -1) {
            val end = start + spanText.length
            setSpan(colorSpan, start, end, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
        }
    }
}
```

### 注意

一个span对象只能设置一次，多次设置后面的会覆盖前面的，导致失效。

```kotlin
val s1 = data.level.toString()
val s2 = data.name
val spanText = StringUtils.format(getString(R.string.user_upgrade_desc), s1, s2)

val span = SpannableStringBuilder(spanText).apply {
    val colorSpan = ForegroundColorSpan("#FF258F".toColorInt())
    val start1 = spanText.indexOf(s1)
    if (start1 != -1) {
        val end = start1 + s1.length
        setSpan(colorSpan, start1, end, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
    }
    val start2 = spanText.indexOf(s2)
    if (start2 != -1) {
        val end = start2 + s2.length
        setSpan(colorSpan, start2, end, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
    }
}
vh.setText(R.id.tv_upgrade_desc, span)
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146594430-637989d6-1bc9-4915-a399-58c4ab8f14d1.png#averageHue=%239a846b&clientId=uc827817d-755d-4&from=paste&id=u22a49cec&originHeight=472&originWidth=398&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub3c44286-372f-417b-a9a9-6cb1e43e3e1&title=)

解决：每个span都创建对象

```kotlin
val s1 = data.level.toString()
val s2 = data.name
val spanText = StringUtils.format(getString(R.string.user_upgrade_desc), s1, s2)

val span = SpannableStringBuilder(spanText).apply {
    val colorSpan1 = ForegroundColorSpan("#FF258F".toColorInt())
    val start1 = spanText.indexOf(s1)
    if (start1 != -1) {
        val end = start1 + s1.length
        setSpan(colorSpan1, start1, end, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
    }
    val colorSpan2 = ForegroundColorSpan("#FF258F".toColorInt())
    val start2 = spanText.indexOf(s2)
    if (start2 != -1) {
        val end = start2 + s2.length
        setSpan(colorSpan2, start2, end, Spannable.SPAN_INCLUSIVE_EXCLUSIVE)
    }
}
vh.setText(R.id.tv_upgrade_desc, span)
```

![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146605300-33e04c24-1177-493c-9906-64872521eb73.png#averageHue=%23f5f2ef&clientId=uc827817d-755d-4&from=paste&id=u1c72f398&originHeight=452&originWidth=394&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u1f8eddb8-1384-4f9a-9e44-fecdd650cd7&title=)

## MaskFilterSpan : 修饰效果，如模糊(BlurMaskFilter)浮雕

## RasterizerSpan : 光栅效果

## StrikethroughSpan : 删除线

## SuggestionSpan : 相当于占位符

## UnderlineSpan : 下划线

## AbsoluteSizeSpan : 文本字体（绝对大小）

## DynamicDrawableSpan : 设置图片，基于文本基线或底部对齐。

## ImageSpan : 图片

### 图文混排的方式有哪些？

1. 使用drawableLeft等属性设置，这种方式对应的java方法是 `setCompoundDrawablesWithIntrinsicBounds(leftDrawble,topDrawable,rightDrawable,bottomDrawable);`
2. Html.ImageGetter格式化图片
3. 使用 `SpannableString` ,先将图片转成ImageSpan对象，然后通过setSpan插入到SpannableString 中，最后再将SpannableString通过setText设置给TextView。（SpannableString 继承自CharSquence）

### `ImageSpan+SpannableString`

`SpannbaleString`的setSpan(Object what, int start, int end, int flags)方法中，传入的四个参数分别是:

```
what: ImageSpan对象、
start: 将ImageSpan插入到的起始位置(start)、
end: 将ImageSpan插入到的终点位置(end)、
flags: 是否应用字体样式。

具体将ImageSpan对象插入到哪个位置，由第二个和第三个参数确定，插入的时候会覆盖从 start 位置开始（不包含该位置）到终止位置间的内容（包含该位置）。第四个参数是在你插入文本的时候使用的，用来控制新插入的文本与已有文本内容的字体样式是否一致的如果你插入的是图片，这里就可以随便选择一种模式。
```

ImageSpan不能居中，需要自定义ImageSpan

```kotlin
private fun centerImageSpan() {
    var spannableString = SpannableString("点击 按钮有惊喜[系统ImageSpan]")

    val drawable = getResources().getDrawable(R.mipmap.ic_launcher)
    drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight())
    var imageSpan = BetterImageSpan(drawable, BetterImageSpan.ALIGN_CENTER, 0)

    // setSpan插入内容的时候，起始位置不替换，会替换起始位置到终止位置间的内容，含终止位置。
    // Spanned.SPAN_EXCLUSIVE_EXCLUSIVE模式用来控制是否同步设置新插入的内容与start/end 位置的字体样式，此处没设置具体字体，所以可以随意设置
    spannableString.setSpan(imageSpan, 2, 3, Spanned.SPAN_INCLUSIVE_EXCLUSIVE)
    tv_content2.setText(spannableString)
}

private fun normalImageSpan() {
    var spannableString = SpannableString("点击 按钮有惊喜[系统ImageSpan]")

    var imageSpan = ImageSpan(this, R.mipmap.ic_launcher)

    // setSpan插入内容的时候，起始位置不替换，会替换起始位置到终止位置间的内容，含终止位置。
    // Spanned.SPAN_EXCLUSIVE_EXCLUSIVE模式用来控制是否同步设置新插入的内容与start/end 位置的字体样式，此处没设置具体字体，所以可以随意设置
    spannableString.setSpan(imageSpan, 2, 3, Spanned.SPAN_INCLUSIVE_EXCLUSIVE)
    tv_content.setText(spannableString)
}
```

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146804411-c8b4b740-0d76-4fbf-ac6e-745d473e54cd.png#averageHue=%23f2e1aa&clientId=uf2232fee-0d44-4&from=paste&height=224&id=u2df916bf&originHeight=336&originWidth=727&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=83370&status=done&style=stroke&taskId=ua840db1c-c6d9-454c-851f-659b0040b09&title=&width=484.6666666666667)

### BetterImageSpan(图片居中，fresco)

```java
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package me.hacket.assistant.common.widget;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.text.style.DynamicDrawableSpan;
import android.text.style.ReplacementSpan;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import androidx.annotation.IntDef;

/**
 * A better implementation of image spans that also supports centering images against the text.
 *
 * In order to migrate from ImageSpan, replace {@code new ImageSpan(drawable, alignment)} with
 * {@code new BetterImageSpan(drawable, BetterImageSpan.normalizeAlignment(alignment))}.
 *
 * There are 2 main differences between BetterImageSpan and ImageSpan:
 * 1. Pass in ALIGN_CENTER to center images against the text.
 * 2. ALIGN_BOTTOM no longer unnecessarily increases the size of the text:
 * DynamicDrawableSpan (ImageSpan's parent) adjusts sizes as if alignment was ALIGN_BASELINE which can lead to unnecessary whitespace.
 */
public class BetterImageSpan extends ReplacementSpan {

    private int horizontalPadding;

    @IntDef({ALIGN_BASELINE, ALIGN_BOTTOM, ALIGN_CENTER})
    @Retention(RetentionPolicy.SOURCE)
    public @interface BetterImageSpanAlignment {
    }

    public static final int ALIGN_BOTTOM = 0;
    public static final int ALIGN_BASELINE = 1;
    public static final int ALIGN_CENTER = 2;

    /**
     * A helper function to allow dropping in BetterImageSpan as a replacement to ImageSpan, and
     * allowing for center alignment if passed in.
     */
    public static final @BetterImageSpanAlignment
    int normalizeAlignment(int alignment) {
        switch (alignment) {
            case DynamicDrawableSpan.ALIGN_BOTTOM:
                return ALIGN_BOTTOM;
            case ALIGN_CENTER:
                return ALIGN_CENTER;
            case DynamicDrawableSpan.ALIGN_BASELINE:
            default:
                return ALIGN_BASELINE;
        }
    }

    private int mWidth;
    private int mHeight;
    private Rect mBounds;
    private final int mAlignment;
    private final Paint.FontMetricsInt mFontMetricsInt = new Paint.FontMetricsInt();
    private final Drawable mDrawable;

    public BetterImageSpan(Drawable drawable) {
        this(drawable, ALIGN_BASELINE);
    }

    public BetterImageSpan(Drawable drawable, @BetterImageSpanAlignment int verticalAlignment) {
        mDrawable = drawable;
        mAlignment = verticalAlignment;
        updateBounds();
    }

    public BetterImageSpan(Drawable drawable, @BetterImageSpanAlignment int verticalAlignment, int horizontalPadding) {
        this(drawable, verticalAlignment);
        this.horizontalPadding = horizontalPadding;
        updateBounds();
    }

    public Drawable getDrawable() {
        return mDrawable;
    }

    /**
     * Returns the width of the image span and increases the height if font metrics are available.
     */
    @Override
    public int getSize(
            Paint paint,
            CharSequence text,
            int start,
            int end,
            Paint.FontMetricsInt fontMetrics) {
        updateBounds();
        if (fontMetrics == null) {
            return mWidth;
        }

        int offsetAbove = getOffsetAboveBaseline(fontMetrics);
        int offsetBelow = mHeight + offsetAbove;
        if (offsetAbove < fontMetrics.ascent) {
            fontMetrics.ascent = offsetAbove;
        }

        if (offsetAbove < fontMetrics.top) {
            fontMetrics.top = offsetAbove;
        }

        if (offsetBelow > fontMetrics.descent) {
            fontMetrics.descent = offsetBelow;
        }

        if (offsetBelow > fontMetrics.bottom) {
            fontMetrics.bottom = offsetBelow;
        }

        return mWidth;
    }

    @Override
    public void draw(
            Canvas canvas,
            CharSequence text,
            int start,
            int end,
            float x,
            int top,
            int y,
            int bottom,
            Paint paint) {
        paint.getFontMetricsInt(mFontMetricsInt);
        int iconTop = y + getOffsetAboveBaseline(mFontMetricsInt);
        x += horizontalPadding;
        canvas.translate(x, iconTop);
        mDrawable.draw(canvas);
        canvas.translate(-x, -iconTop);
    }

    public void updateBounds() {
        mBounds = mDrawable.getBounds();

        mWidth = mBounds.width() + horizontalPadding * 2;
        mHeight = mBounds.height();
    }

    private int getOffsetAboveBaseline(Paint.FontMetricsInt fm) {
        switch (mAlignment) {
            case ALIGN_BOTTOM:
                return fm.descent - mHeight;
            case ALIGN_CENTER:
                int textHeight = fm.descent - fm.ascent;
                int offset = (textHeight - mHeight) / 2;
                return fm.ascent + offset;
            case ALIGN_BASELINE:
            default:
                return -mHeight;
        }
    }
}
```

### AlignmentCenterImageSpan（不论是图片大于文字还是文字大于图片，都能实现中间对齐）from si

```kotlin
/**
 * 自定义imageSpan实现图片与文字的居中对齐 
 * 
 * 不论是图片大于文字还是文字大于图片，都能实现中间对齐
 */
class AlignmentCenterImageSpan : ImageSpan {
    public constructor(context: Context, resourceId: Int) : super(
        context,
        resourceId,
        ALIGN_FONTCENTER
    ) {
    }

    private constructor(drawable: Drawable, verticalAlignment: Int) : super(
        drawable,
        verticalAlignment
    ) {
    }

    private constructor(context: Context, resourceId: Int, verticalAlignment: Int) : super(
        context,
        resourceId,
        verticalAlignment
    ) {
    }

    override fun draw(
        canvas: Canvas,
        text: CharSequence?,
        start: Int,
        end: Int,
        x: Float,
        top: Int,
        y: Int,
        bottom: Int,
        paint: Paint
    ) {
        val drawable = drawable ?: return //调用imageSpan中的方法获取drawable对象
        canvas.save()
        //获取画笔的文字绘制时的具体测量数据
        val fm = paint.fontMetricsInt
        //系统原有方法，默认是Bottom模式)
        var transY = bottom - drawable.bounds.bottom
        if (mVerticalAlignment == DynamicDrawableSpan.ALIGN_BASELINE) {
            transY -= fm.descent
        } else if (mVerticalAlignment == ALIGN_FONTCENTER) {    //此处加入判断， 如果是自定义的居中对齐
            //与文字的中间线对齐（这种方式不论是否设置行间距都能保障文字的中间线和图片的中间线是对齐的）
            // y+ascent得到文字内容的顶部坐标，y+descent得到文字的底部坐标，（顶部坐标+底部坐标）/2=文字内容中间线坐标
            transY = (y + fm.descent + (y + fm.ascent)) / 2 - drawable.bounds.bottom / 2
        }
        canvas.translate(x, transY.toFloat())
        drawable.draw(canvas)
        canvas.restore()
    }

    /**
     * 重写getSize方法，只有重写该方法后，才能保证不论是图片大于文字还是文字大于图片，都能实现中间对齐
     */
    override fun getSize(
        paint: Paint,
        text: CharSequence?,
        start: Int,
        end: Int,
        fm: Paint.FontMetricsInt?
    ): Int {
        val d = drawable ?: return 0
        val rect: Rect = d.bounds
        if (fm != null) {
            val fmPaint = paint.fontMetricsInt
            val fontHeight: Int = fmPaint.bottom - fmPaint.top
            val drHeight: Int = rect.bottom - rect.top
            val top = drHeight / 2 - fontHeight / 4
            val bottom = drHeight / 2 + fontHeight / 4
            fm.ascent = -bottom
            fm.top = -bottom
            fm.bottom = top
            fm.descent = top
        }
        return rect.right
    }

    companion object {
        // 自定义对齐方式--与文字中间线对齐
        private const val ALIGN_FONTCENTER = 2
    }
}
```

示例：

```kotlin
val sb3 = SpannableStringBuilder()
    .append(
        "*",
        AlignmentCenterImageSpan(this, R.drawable.ic_launcher),
        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
    )
    .append(" ")
    .append(tv_review_tips3.text.toString())
tv_review_tips3.text = sb3
```

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1695045717938-4d7e70d6-674b-47cb-a6b7-50b88a26683b.png#averageHue=%23efe1b0&clientId=u13b663ab-61e8-4&from=paste&height=196&id=u9dffac1c&originHeight=740&originWidth=1440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=271808&status=done&style=none&taskId=u1c1409ee-4c4f-483b-be39-59c10abfd32&title=&width=381)

## RelativeSizeSpan : 相对大小（文本字体）

### RelativeSizeSpan用途

用途：一个 TextView 不同的字体大小<br>![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146949083-3a5af447-810e-4bac-bd33-4ee294ee67e3.png#averageHue=%23dedada&clientId=uf2232fee-0d44-4&from=paste&height=275&id=ue974fd1b&originHeight=412&originWidth=659&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=32349&status=done&style=stroke&taskId=uf68f617d-394e-49c5-8814-4a00f30625a&title=&width=439.3333333333333)

### [RelativeSizeTextView](https://github.com/xiaojinzi123/widget/blob/master/widget/src/main/java/com/move/widget/RelativeSizeTextView.java)

这个控件用于显示文本前面或者后面有大小不一标志， 比如：显示一个价钱,设计上通常都把钱的符号弄的比较小 比如：送礼数量x9999

源码：

```java
/**
 * 这个控件用于显示文本前面或者后面有大小不一标志， 比如：显示一个价钱,设计上通常都把钱的符号弄的比较小 比如：送礼数量x9999
 */
public class RelativeSizeTextView extends AppCompatTextView {

    public RelativeSizeTextView(Context context) {
        this(context, null);
    }

    public RelativeSizeTextView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public RelativeSizeTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);

        // 开始读取自定义属性
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.RelativeSizeTextView);

        startText = a.getString(R.styleable.RelativeSizeTextView_startText);
        endText = a.getString(R.styleable.RelativeSizeTextView_endText);

        startProportion = a.getFloat(R.styleable.RelativeSizeTextView_proportion, 1f);
        endProportion = a.getFloat(R.styleable.RelativeSizeTextView_proportion, 1f);

        startProportion = a.getFloat(R.styleable.RelativeSizeTextView_start_proportion, startProportion);
        endProportion = a.getFloat(R.styleable.RelativeSizeTextView_end_proportion, endProportion);

        startTextColor = a.getColor(R.styleable.RelativeSizeTextView_start_end_text_color, startTextColor);
        endTextColor = a.getColor(R.styleable.RelativeSizeTextView_start_end_text_color, endTextColor);

        startTextColor = a.getColor(R.styleable.RelativeSizeTextView_start_text_color, startTextColor);
        endTextColor = a.getColor(R.styleable.RelativeSizeTextView_end_text_color, endTextColor);

        a.recycle();

        setTagText(getText());

    }

    /**
     * 开头的文本
     */
    private String startText;

    /**
     * 开始文本的颜色
     */
    private int startTextColor = 0;

    /**
     * 结束的文本
     */
    private String endText;

    /**
     * 结束文本的颜色
     */
    private int endTextColor = 0;

    /**
     * 开始的比例
     */
    private float startProportion;

    /**
     * 结束文本的比例
     */
    private float endProportion;

    /**
     * 原来的文本
     */
    private CharSequence originText;

    /**
     * 设置文本,调用的时候不要调用{@link android.widget.TextView#setText(CharSequence)}方法 而是调用此方法,不然没有效果
     * 比如setTagText("hello") 输出效果为加上前置文本和后置文本:<前置文本>hello<后置文本>
     */
    public void setTagText(CharSequence text) {

        if (text == null) {
            return;
        }

        originText = text;

        if (!TextUtils.isEmpty(startText)) {
            text = startText + text;
        }

        if (!TextUtils.isEmpty(endText)) {
            text = text + endText;
        }

        SpannableString ss = new SpannableString(text);
        RelativeSizeSpan startSpan = new RelativeSizeSpan(startProportion);
        RelativeSizeSpan endSpan = new RelativeSizeSpan(endProportion);

        if (!TextUtils.isEmpty(startText)) {
            ss.setSpan(startSpan, 0, startText.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
            if (startTextColor != 0) {
                ForegroundColorSpan fcs = new ForegroundColorSpan(startTextColor);
                ss.setSpan(fcs, 0, startText.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
            }
        }

        if (!TextUtils.isEmpty(endText)) {
            ss.setSpan(endSpan, text.length() - endText.length(), text.length(),
                    Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
            if (endTextColor != 0) {
                ForegroundColorSpan fcs = new ForegroundColorSpan(endTextColor);
                ss.setSpan(fcs, text.length() - endText.length(), text.length(),
                        Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
            }
        }

        super.setText(ss);
    }

    public void setStartText(String startText) {
        this.startText = startText;
        setTagText(originText);
    }

    public void setStartTextColor(int startTextColor) {
        this.startTextColor = startTextColor;
        setTagText(originText);
    }

    public void setEndText(String endText) {
        this.endText = endText;
        setTagText(originText);
    }

    public void setEndTextColor(int endTextColor) {
        this.endTextColor = endTextColor;
        setTagText(originText);
    }

    public void setStartProportion(float startProportion) {
        this.startProportion = startProportion;
        setTagText(originText);
    }

    public void setEndProportion(float endProportion) {
        this.endProportion = endProportion;
        setTagText(originText);
    }

    public String getStartText() {
        return startText;
    }

    public int getStartTextColor() {
        return startTextColor;
    }

    public String getEndText() {
        return endText;
    }

    public int getEndTextColor() {
        return endTextColor;
    }

    public float getStartProportion() {
        return startProportion;
    }

    public float getEndProportion() {
        return endProportion;
    }

    public CharSequence getOriginText() {
        return originText;
    }
}
```

自定义属性`relative_size_textview.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <declare-styleable name="RelativeSizeTextView">

        <!--开头和结束的文本-->
        <attr name="startText" format="string" />
        <attr name="endText" format="string" />
        <!--统一设置开头和结束的tag的比例-->
        <attr name="proportion" format="float" />
        <!--开头的文本的比例-->
        <attr name="start_proportion" format="float" />
        <!--结束的文本的比例-->
        <attr name="end_proportion" format="float" />
        <!--开始文本和结束文本的颜色-->
        <attr name="start_end_text_color" format="color" />
        <attr name="start_text_color" format="color" />
        <attr name="end_text_color" format="color" />

    </declare-styleable>
</resources>
```

示例：

```xml
<qsbk.app.core.widget.textview.RelativeSizeTextView
    android:id="@+id/tv"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:padding="5dp"
    android:text="我是正常文本20sp"
    android:textSize="20sp"
    app:endText="我是蓝色后置文本为正常大小的150%"
    app:end_proportion="1.5"
    app:end_text_color="#0000FF"
    app:start_proportion="0.8"
    app:startText="我是前置红色文本为正常大小的80%"
    app:start_text_color="#FF0000" />
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146978089-ee4c9577-cd3d-4b13-8fc1-e72248e83f88.png#averageHue=%23f7f5f4&clientId=uf2232fee-0d44-4&from=paste&height=104&id=u5c62a828&originHeight=156&originWidth=1492&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=53330&status=done&style=stroke&taskId=uf84f8cf6-d083-4839-adf5-aaf346f6643&title=&width=994.6666666666666)<br>注意：设置文本,调用的时候不要调用`android.widget.TextView#setText(CharSequence)}`方法 而是调用`setTagText(text)`方法，不然没有效果。比如setTagText("hello") 输出效果为加上前置文本和后置文本：`<前置文本>hello<后置文本>`。

## ScaleXSpan : 基于x轴缩放

## StyleSpan : 字体样式：粗体、斜体等

## SubscriptSpan : 下标（数学公式会用到）

## SuperscriptSpan : 上标（数学公式会用到）

## TextAppearanceSpan : 文本外貌（包括字体、大小、样式和颜色）

## TypefaceSpan : 文本字体

## URLSpan : 文本超链接

## ClickableSpan : 点击事件

继承`ClickableSpan`,一般我们有两个方法需要重写，分别是`updateDrawState`和`onClick`，默认情况下此时TextView会显示默认的主题颜色和有下划线，在onClick方法中对点击事件进行设置。

### 注意

1. 在RecyclerView的item中，TextView设置了ClickableSpan会拦截点击事件，注意处理
2. 需要设置LinkMovementMethod才可以点击`.setMovementMethod(LinkMovementMethod.getInstance());`
3. 设置点击后没有背景`.setHighlightColor(Color.TRANSPARENT); // 设置点击后的颜色为透明`

### 案例

```java
public class NameClickSpan extends ClickableSpan {

    private String mId;//用户ID

    public NameClickSpan(String id) {
        mId = id;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        super.updateDrawState(ds);
        //设置高亮颜色
        ds.setColor(Color.BLUE);
        //不显示下划线
        ds.setUnderlineText(false);
    }

    @Override
    public void onClick(View view) {
        ToastUtils.showShort("去用户详情页：" + mId);
    }
}
```

```kotlin
private fun centerImageSpan() {
    var name = "hacket"
    var str = "点击 $name 按钮有惊喜[BetterImageSpan]"
    var spannableString = SpannableString(str)

    var i = str.indexOf(name)

    val drawable = getResources().getDrawable(R.mipmap.ic_launcher)
    drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight())
    var imageSpan = BetterImageSpan(drawable, BetterImageSpan.ALIGN_CENTER, 20)
    var clickSpan = NameClickSpan(name)

    spannableString.setSpan(imageSpan, 2, 3, Spanned.SPAN_INCLUSIVE_EXCLUSIVE)
    spannableString.setSpan(clickSpan, i, i + name.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE)
    tv_content2.setText(spannableString)
    tv_content2.setMovementMethod(LinkMovementMethod.getInstance())
}
```

![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1688146760147-a4db7908-2611-414b-895d-86f59e50a5f8.png#averageHue=%23badac5&clientId=uf2232fee-0d44-4&from=paste&height=117&id=u85e6b562&originHeight=176&originWidth=852&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=45609&status=done&style=stroke&taskId=ub6fd99e6-a872-4fc6-a55c-89b86a7fb69&title=&width=568)
