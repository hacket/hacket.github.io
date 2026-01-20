---
banner: 
date_created: Tuesday, October 29th 2017, 12:08:52 am
date_updated: Thursday, June 26th 2025, 11:21:44 pm
title: 自定义ellipsize
author: hacket
categories:
  - AndroidUI
category: TextView
tags: [TextView]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 六月 4日 2024, 4:20:00 下午
date updated: 星期一, 一月 6日 2025, 9:54:00 晚上
image-auto-upload: true
feed: show
format: list
aliases: [TextView 效果]
linter-yaml-title-alias: TextView 效果
---

# TextView 效果

## ellipsize

### 什么是 ellipsize ？

TextView 中可以设置一个 ellipsize 属性,作用是当文字长度超过 textview 宽度时的显示方式：

例如，字符串 "abcedfghijklmn" 的各种现实效果：

- android:ellipsize="start"—–省略号显示在开头 "…lmn"
- android:ellipsize="end"——省略号显示在结尾 "abcdec…"
- android:ellipsize="middle"—- 省略号显示在中间 "ab…lmn"
- android:ellipsize="marquee"–跑马灯效果 (需要额外处理)

#### ellipsize 示例

1. `android:ellipsize="end"` 或 `mTextView.setEllipsize(TextUtils.TruncateAt.END);`
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261928311.png)

2. `android:ellipsize="start" 或 mTextView.setEllipsize(TextUtils.TruncateAt.START)`
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261928085.png)

3. `android:ellipsize="middle" 或 mTextView.setEllipsize(TextUtils.TruncateAt.MIDDLE);`
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261928109.png)

### ellipsize 常见问题

#### 多行文本 ellipsize

使用 TextView 显示过长的文字时往往需要省略部分内容，但是 TextView 控件在 `maxline>=2` 时（即多行显示），ellipsize 属性只有设置为 end 和 marquee 才有效，start\middle 则无效

#### ellipise 无效，设置了 end

1. 设置 ellipsize 属性后没有效果加上 singleLine="true" 就有效果，但是不能写 lines="1" 和 maxLine="1" ,这样会导致崩溃。
2. Textview.append (" "); ellipsize 也会失效，记得加上 singleLine=true

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

**问题：** 在泰语显示两行时，第二行底部的文本显示不全，被裁剪了一部分<br>
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261929534.png)

<br>**分析：** 可能原因是配置了 maxLines 和 ellipise，又在 RecyclerView 中，导致显示不全，具体原因未知。<br>**解决：** 去掉 ellipsize="end" 即可<br>
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261930049.png)

#### Android TextView 关于 ellipsize=end 的一个 bug

`textView的文本内容中包含\n字符或者其它html字符比如\<.*?>`<br>解决方案也很简单，直接在 setText 之前调用：

```java
myText.replaceAll("\\<.*?>","");
```

- [x] Android TextView 关于 android:ellipsize=end 的一个 bug<br><https://blog.csdn.net/mq2553299/article/details/78438363>

#### 设置 lineSpacingMultiplier 或者是 lineSpacingExtra，ellipsize 失效？

- [踩坑之路:TextView Ellipsize属性无效问题 - 简书](https://www.jianshu.com/p/cb3909953f80)

### 自定义 ellipsize 方案

#### 判断某行是否有 ellipsize？

- 使用 `Layout.getEllipsisCount(line)` 获取某行
在 `TextView` 完成布局后，通过其内部的 `Layout` 对象检查指定行的截断情况。

```kotlin
// 添加布局监听，确保在布局完成后判断
textView.getViewTreeObserver().addOnGlobalLayoutListener(
    new ViewTreeObserver.OnGlobalLayoutListener() {
        @Override
        public void onGlobalLayout() {
            textView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            Layout layout = textView.getLayout();
            if (layout != null) {
                // 检查第 line 行（单行文本）是否被截断；从0开始
                int ellipsisCount = layout.getEllipsisCount(layout.lineCount - 1);
                boolean isEllipsized = ellipsisCount > 0;
                Log.d("Ellipsize", "是否被截断: " + isEllipsized);
            }
        }
    }
);
```

#### TextUtils.ellipsize 方案

ellipsize() 方法签名：

CharSequence ellipsize(CharSequence text, TextPaint p, float avail, TruncateAt where)

如果字符串超长，则返回按规则截断并添加省略号的字符串

- **text** 参数就是我们要进行操作截取的字符串。
- **p** 是我们所要显示这个这些字符的控件画笔。
- **avail** 是文字要显示的长度，我们一般都是控件的长度。
- **where** 是截段的位置。最后返回的内容就是我们可以看到的最终显示内容。

示例：str 给定宽度，如果超出，最后缩略；没有超过返回原串

```java
tv_info.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    tv_info.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                }
                String name = (String) TextUtils.ellipsize(str,tv_info.getPaint(),tv_info.getWidth(),TextUtils.TruncateAt.END);
            }
        });

```

##### 单行自定义 ellipsize

```kotlin
/**
 * A custom [AppCompatTextView] that allows custom ellipsis and ellipsisColor.
 */
class CustomEllipsizeTextView2 @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : AppCompatTextView(context, attrs, defStyleAttr) {
    var ellipsis = getDefaultEllipsis().toString()
    var ellipsisColor = getDefaultEllipsisColor()

    private val ellipsisSpannable: SpannableString
    private val spannableStringBuilder = SpannableStringBuilder()

    init {
        if (attrs != null) {
            val typedArray = context.theme.obtainStyledAttributes(
                attrs,
                R.styleable.CustomEllipsizeTextView2,
                0,
                0
            )
            typedArray.let {
                ellipsis = typedArray.getString(R.styleable.CustomEllipsizeTextView2_ellipsis)
                    ?: getDefaultEllipsis().toString()
                ellipsisColor = typedArray.getColor(
                    R.styleable.CustomEllipsizeTextView2_ellipsisColor,
                    getDefaultEllipsisColor()
                )
                typedArray.recycle()
            }
        }

        ellipsisSpannable = SpannableString(ellipsis)
        ellipsisSpannable.setSpan(
            ForegroundColorSpan(ellipsisColor),
            0,
            ellipsis.length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
    }

    @SuppressLint("LongLogTag")
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        customEllipsizeText()
    }

    @SuppressLint("LongLogTag")
    private fun customEllipsizeText() {
        val availableOneLineScreenWidth =
            width - compoundPaddingLeft.toFloat() - compoundPaddingRight.toFloat()
        var availableTextMultiLineWidth = availableOneLineScreenWidth * maxLines
        var ellipsizedText =
            TextUtils.ellipsize(text, paint, availableTextMultiLineWidth, ellipsize)

        Log.v(
            "CustomEllipsizeTextView2",
            "ellipsize=$ellipsize, maxLines=$maxLines, width=$width(${
                pxToDp(
                    width
                )
            }dp), paddingLeft=${compoundPaddingLeft}(${pxToDp(compoundPaddingLeft)}dp), paddingRight=${compoundPaddingRight}(${
                pxToDp(
                    compoundPaddingRight
                )
            }dp), availableOneLineScreenWidth屏幕宽度=$availableOneLineScreenWidth(${
                pxToDp(
                    availableOneLineScreenWidth.toInt()
                )
            }dp), \navailableTextMultiLineWidth最多可用多行: $availableTextMultiLineWidth(${
                pxToDp(
                    availableTextMultiLineWidth.toInt()
                )
            }dp)\nellipsizedText: $ellipsizedText\ntext: $text"
        )
        if (ellipsizedText.toString() != text.toString()) {
            // If the ellipsizedText is different than the original text, this means that it didn't fit and got indeed ellipsized.
            // Calculate the new availableTextMultiLineWidth by taking into consideration the size of the custom ellipsis, too.
//            availableTextMultiLineWidth = (availableOneLineScreenWidth - paint.measureText(ellipsis)) * maxLines
            availableTextMultiLineWidth =
                availableOneLineScreenWidth * maxLines - paint.measureText(ellipsis) - paint.measureText(
                    getDefaultEllipsis().toString()
                )
            ellipsizedText =
                TextUtils.ellipsize(text, paint, availableTextMultiLineWidth, ellipsize)
            val defaultEllipsisStart = ellipsizedText.indexOf(getDefaultEllipsis())
            val defaultEllipsisEnd = defaultEllipsisStart + 1

            if (defaultEllipsisStart < 0) {
                Log.w(
                    "CustomEllipsizeTextView2",
                    "defaultEllipsisStart=$defaultEllipsisStart, defaultEllipsisEnd=$defaultEllipsisEnd"
                )
                return
            }

            spannableStringBuilder.clear()

            Log.d(
                "CustomEllipsizeTextView2",
                "availableOneLineScreenWidth控件宽度可用=$availableOneLineScreenWidth, availableTextMultiLineWidth(最多可用宽度多行)=$availableTextMultiLineWidth(${
                    pxToDp(
                        availableTextMultiLineWidth.toInt()
                    )
                }dp),ellipsis.width=${paint.measureText(ellipsis)}, ${getDefaultEllipsis()}.width = ${
                    paint.measureText(
                        getDefaultEllipsis().toString()
                    )
                }, defaultEllipsisStart: $defaultEllipsisStart, defaultEllipsisEnd: $defaultEllipsisEnd\nellipsizedText: $ellipsizedText\ntext=$text"
            )

            // Update the text with the ellipsized version and replace the default ellipsis with the custom one.
            text = spannableStringBuilder.append(ellipsizedText)
//                .replace(defaultEllipsisStart, defaultEllipsisEnd, ellipsisSpannable)
                .replace(defaultEllipsisStart, defaultEllipsisEnd, ellipsis)
        }
    }

    private fun getDefaultEllipsis(): Char {
        return Typography.ellipsis
    }

    private fun getDefaultEllipsisColor(): Int {
        return textColors.defaultColor
    }
}


fun pxToDp(px: Int): Float {
    val density = Resources.getSystem().displayMetrics.density
    return px / density
}
```

##### 问题

- TextUtils.ellipsize() 多行
不要尝试通过 `TextUtils.ellipsize()` 直接处理多行文本，其设计目标仅为单行截断。不会考虑换行，\n 等问题

- TextUtils.ellipsize() 处理带 span 的文字，带字重的
- TextView 使用 maxLines 限制；设置了 LinkMovementMethod 时使用 layout.lineCount 会超过 maxLines，并在其内部可滑动，如果用了这个 API 进行截取的要注意判断，超过 maxLines 时要手动截取

#### 多行自定义 ellipsize End 方案

先用文本算出带 `…`，再将自定义的 ellipsize 文本的长度计算出来，然后用自定义的 ellipsize 将默认的 `…` 替换掉

参考： [EllipsizedTextView](https://github.com/TheCodeYard/EllipsizedTextView/blob/master/ellipsizedtextview/src/main/java/com/thecodeyard/ellipsizedtextview/EllipsizedTextView.kt)

# 自定义 ellipsize 应用

## 文本折叠

- 多行折叠和展开
- 设置折叠和展开的文本
- 普通文本和富文本的多行折叠展开支持
- 支持 html 标签

```kotlin
/**
 *
 * 注意：支持富文本
 *
 * 超过指定行数后的字符串显示"...See More"或者"...See Less"
 * 用法：1.XML：<MoreLessRichTextView></>
 *      2.调用MoreLessRichTextView实例对象的showText(text)
 *      说明：如果仅仅在xml中或对象创建了一个MoreLessRichTextView，相当于AppCompatTextView使用，必须调用showText(text)函数see more 和 see less才生效
 */
@Suppress("DEPRECATION")
@SuppressLint("WrongConstant")
class MoreLessRichTextView @JvmOverloads constructor(
    val mContext: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.textViewStyle
) : AppCompatTextView(mContext, attrs, defStyleAttr) {

    // 显示的行数，超过即隐藏，see more替代
    private var maxShowLine = -1
    private var actualLine = -1
    private var tripleDot: String = "..."
    private var seeMoreText: String = "See More"
    private var seeLessText: String = "See Less"
    private var seeMoreTextSize by Delegates.notNull<Float>()
    private var seeLessTextSize by Delegates.notNull<Float>()
    private var seeMoreTextColor: Int? = null
    private var seeLessTextColor: Int? = null
    private var shouldAutoExpand: Boolean = true

    private var originContentText: CharSequence? = null
    private var showState: ShowState = ShowState.EXPAND

    private var seeMoreEnable = true
    private var seeLessEnable = true

    private var moreSpanClickEnable = true
    private var lessSpanClickEnable = true

    private var setTripleDotShowEnable: ((maxShowLine: Int) -> Boolean) = { true }

    private var needFold = false

    private var onSpanClickListener: ((state: ShowState) -> Unit)? = null
    private var onTextClickListener: OnClickListener? = null
    private val showingText = SpannableStringBuilder()

    init {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            breakStrategy = Layout.BREAK_STRATEGY_SIMPLE
        }
        highlightColor = Color.TRANSPARENT
    }

    override fun onFinishInflate() {
        super.onFinishInflate()
        seeMoreTextColor = currentTextColor
        seeLessTextColor = currentTextColor

        seeMoreTextSize = textSize
        seeLessTextSize = textSize
    }

    private var firstDraw = true

    private fun getOriginContentText(): CharSequence {
        return originContentText ?: ""
    }

    private fun getTripleDotTxt(): String {
        return if (setTripleDotShowEnable.invoke(maxShowLine)) {
            tripleDot
        } else {
            ""
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        if (!seeMoreEnable && !seeLessEnable) {
            return
        }
        try {
            if (firstDraw && maxShowLine >= 0) {
                val realLines = if (actualLine >= 0) {
                    actualLine
                } else {
                    lineCount
                }
                if (maxShowLine >= realLines) {
                    needFold = false
                    return
                }
                needFold = true
                var start = 0
                var end: Int
                showingText.clear()
                for (i in 0 until maxShowLine) {
                    end = layout.getLineEnd(i)
                    if (end < 0) {
                        end = start
                    }
                    if (end > getOriginContentText().length) {
                        end = getOriginContentText().length
                    }
                    if (i == maxShowLine - 1) {
                        val subSequence = getOriginContentText().subSequence(start, end)
                        val optSeeMoreLineSequence = optSeeMoreLine(subSequence)
                        showingText.append(optSeeMoreLineSequence)
//                        if (optSeeMoreLineSequence is Spanned) {
//                            // Copy existing spans to the new SpannableString
//                            val spans =
//                                optSeeMoreLineSequence.getSpans(
//                                    0,
//                                    subSequence.length,
//                                    Any::class.java
//                                )
//                            for (span in spans) {
//                                val start1 = optSeeMoreLineSequence.getSpanStart(span)
//                                val end1 = optSeeMoreLineSequence.getSpanEnd(span)
//                                val flags = optSeeMoreLineSequence.getSpanFlags(span)
//                                showingText.setSpan(span, start + start1, start + end1, flags)
//                            }
//                        }
                    } else {
                        val subSequence = getOriginContentText().subSequence(start, end)
                        showingText.append(subSequence)
                    }
                    start = end
                }
                // 处理下富文本跨行显示异常，将原文本的富文本同步到showingText
                val originalText = getOriginContentText()
                if (originalText.isNotEmpty() && originalText is Spanned) {
                    // Copy existing spans to the new SpannableString
                    val spans = originalText.getSpans(0, originalText.length, Any::class.java)
                    for (span in spans) {
                        val s = originalText.getSpanStart(span)
                        var e = originalText.getSpanEnd(span)
                        val flags = originalText.getSpanFlags(span)
                        if (s >= showingText.length) {
                            continue
                        }
                        if (e > showingText.length) {
                            e = showingText.length
                        }
                        showingText.setSpan(span, s, e, flags)
                    }
                }
                if (showingText.endsWith("\n")) {
                    try {
                        showingText.delete(showingText.length - 1, showingText.length)
                    } catch (e: Exception) {
                        //不需要处理，继续使用原字符串即可
                    }
                }
                showingText.append("${getTripleDotTxt()} $seeMoreText")
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (!seeMoreEnable && !seeLessEnable) {
            return
        }
        try {
            if (firstDraw) {
                firstDraw = false
                if (needFold && showingText.isNotEmpty()) {
                    setSeeMoreSpan(showingText)
                } else {
                    text = getOriginContentText()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

    }

    //处理最后一行文字的
    private fun optSeeMoreLine(rawContent: CharSequence): CharSequence {
        //总宽度
        val rawWidth = this.measuredWidth
        //点点点的宽度
        val dotWidth = this.paint.measureText("${getTripleDotTxt()} ")
        val rawTextSize = this.paint.textSize
        this.paint.textSize = seeMoreTextSize
        //see more的宽度
        val seeMoreWidth = this.paint.measureText(seeMoreText)
        this.paint.textSize = rawTextSize
        val rawContextWidth = getTextWidthOrWithReplaceSpanSize(rawContent)
        val leftWidth =
            rawWidth - rawContextWidth - dotWidth - seeMoreWidth
//        Log.d(
//            "hacket",
//            "rawWidth=$rawWidth, rawContextWidth: $rawContextWidth, leftWidth: $leftWidth, rawContent=$rawContent"
//        )
        if (leftWidth >= 0) {
            return rawContent
        }

        var tempContent: CharSequence
        val expectWidth = rawWidth - dotWidth - seeMoreWidth
        for (i in rawContent.indices) {
            tempContent = rawContent.subSequence(0, rawContent.length - i)
            val tempContentSize = getTextWidthOrWithReplaceSpanSize(tempContent)
            if (tempContentSize <= expectWidth) {
//                Log.i(
//                    "hacket",
//                    "paintWidth: $paintWidth, tempContentSize=$tempContentSize, expectWidth: $expectWidth, tempContent=$tempContent"
//                )
                return tempContent
            }
        }
        return rawContent
    }

    /**
     * 获取文本宽度，如果文本中包含ReplacementSpan，则需要遍历计算
     *
     * @param text 文本 CharSequence
     */
    private fun getTextWidthOrWithReplaceSpanSize(text: CharSequence?): Float {
        if (text == null) {
            return 0f
        }

        val textPaint = paint
        var totalWidth = 0f
        if (text !is Spanned) { // 普通文本
            return textPaint.measureText(text.toString())
        }

        // 获取所有ReplacementSpan

        val spans = text.getSpans(0, text.length, ReplacementSpan::class.java)
        var lastSpanEnd = 0
        // 遍历所有ReplacementSpan以及普通文本
        spans.forEach { span ->
            val start = text.getSpanStart(span)
            val end = text.getSpanEnd(span)

            // 将span前的普通文本宽度添加至totalWidth
            if (start > lastSpanEnd) {
                val normalTextWidth = textPaint.measureText(text, lastSpanEnd, start)
                totalWidth += normalTextWidth
            }

            // 将ReplacementSpan的宽度添加至totalWidth
            val spanWidth = span.getSize(textPaint, text, start, end, null)
            totalWidth += spanWidth
            lastSpanEnd = end
        }
        // 将最后一个ReplacementSpan后的普通文本宽度添加至totalWidth
        if (lastSpanEnd < text.length) {
            val remainingTextWidth = textPaint.measureText(text, lastSpanEnd, text.length)
            totalWidth += remainingTextWidth
        }
        return totalWidth
    }

    @SuppressLint("ResourceType")
    private fun setSeeMoreSpan(newText: CharSequence) {
        val spannableString = SpannableString(newText)

        // 处理spanned的url点击事件
        if (newText is Spanned) {
            // Copy existing spans to the new SpannableString
            val spans = newText.getSpans(0, newText.length, Any::class.java)
            for (span in spans) {
                val start = newText.getSpanStart(span)
                val end = newText.getSpanEnd(span)
                val flags = newText.getSpanFlags(span)
                spannableString.setSpan(span, start, end, flags)
            }
        }

        val start = newText.length - seeMoreText.length
        val end = newText.length
        val flag = Spannable.SPAN_EXCLUSIVE_EXCLUSIVE

        //设置颜色
        val colorSpan = ForegroundColorSpan(seeMoreTextColor!!)
        spannableString.setSpan(colorSpan, start, end, flag)

        //设置字体大小
        val sizeSpan = AbsoluteSizeSpan(floor(seeMoreTextSize).toInt())
        spannableString.setSpan(sizeSpan, start, end, flag)

        if (moreSpanClickEnable) {
            spannableString.setSpan(object : ClickableSpan() {
                override fun updateDrawState(ds: TextPaint) {
                    ds.isUnderlineText = false
                }

                override fun onClick(widget: View) {
                    onTextClickListener?.onClick(widget)
                }
            }, 0, start - 1, flag)
            //设置 More Text 点击
            spannableString.setSpan(object : ClickableSpan() {
                override fun updateDrawState(ds: TextPaint) {
                    ds.isUnderlineText = false
                }

                override fun onClick(widget: View) {
                    onSpanClickListener?.invoke(showState)
                    if (shouldAutoExpand) {
                        maxLines = Int.MAX_VALUE
                        text = getOriginContentText()
                        showState = ShowState.EXPAND
                        seeLess()
                    }
                }
            }, start, end - 1, flag)
            movementMethod = LinkMovementMethod.getInstance()
        }

        setText(spannableString, BufferType.SPANNABLE)
    }

    fun setTextClickListener(onClickListener: OnClickListener) {
        onTextClickListener = onClickListener
    }

    @SuppressLint("ResourceType")
    private fun seeLess() {
        if (seeLessEnable) {
            val start = getOriginContentText().length + 1
            val end = getOriginContentText().length + seeLessText.length + 1
            val flag = Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            val text = SpannableStringBuilder(getOriginContentText()).append(" $seeLessText")
            val spannableString = SpannableString(text)

            //设置字体大小
            val sizeSpan = AbsoluteSizeSpan(floor(seeLessTextSize).toInt())
            spannableString.setSpan(sizeSpan, start, end, flag)

            if (lessSpanClickEnable) {
                //设置点击
                spannableString.setSpan(object : ClickableSpan() {
                    override fun updateDrawState(ds: TextPaint) {
                        ds.isUnderlineText = false
                    }

                    override fun onClick(widget: View) {
                        maxLines = maxShowLine
                        firstDraw = true
                        setText(getOriginContentText())
                        showState = ShowState.SHRINK
                        onSpanClickListener?.invoke(showState)
                    }
                }, start, end - 1, flag)
                //设置字体颜色
                val colorSpan = ForegroundColorSpan(seeLessTextColor!!)
                spannableString.setSpan(colorSpan, start, end, flag)
                movementMethod = LinkMovementMethod.getInstance()
            }
            setText(spannableString, BufferType.SPANNABLE)
        }
    }

    /**
     * 当调用了show函数才生效，不调用和TextView相同
     */
    fun showText(text: CharSequence, urlClickBlock: ((url: String) -> Unit)? = null) {
        this.originContentText = text

        // 处理spanned的url点击事件
        if (text is Spanned) {

            // Create a new SpannableString from the Spanned object
            val spannableString = SpannableStringBuilder(text)

            // Copy existing spans to the new SpannableString
            val spans = text.getSpans(0, text.length, Any::class.java)
            for (span in spans) {
                val start = text.getSpanStart(span)
                val end = text.getSpanEnd(span)
                val flags = text.getSpanFlags(span)
                spannableString.setSpan(span, start, end, flags)
            }

            // Find any existing URLSpan objects
            val urlSpans = spannableString.getSpans(0, spannableString.length, URLSpan::class.java)
            if (urlSpans.isNotEmpty() && urlClickBlock != null) {
                movementMethod = LinkMovementMethod.getInstance()
            }
            // Replace each URLSpan with our custom ClickableSpan
            urlSpans.forEach { oldSpan ->
                val start = spannableString.getSpanStart(oldSpan)
                val end = spannableString.getSpanEnd(oldSpan)

                // Remove the existing URLSpan
                spannableString.removeSpan(oldSpan)

                // Create a new custom ClickableSpan
                val clickable = object : ClickableSpan() {
                    override fun onClick(view: View) {
                        // Pass the URL to the provided onUrlClick function
                        urlClickBlock?.invoke(oldSpan.url)
                    }

                    override fun updateDrawState(textPaint: TextPaint) {
                        super.updateDrawState(textPaint)
                        // Apply the custom link color and remove the underline
                        textPaint.color =
                            ContextCompat.getColor(context, android.R.color.holo_blue_dark)
                        textPaint.isUnderlineText = false
                    }
                }

                // Apply the new ClickableSpan to the SpannableString
                spannableString.setSpan(clickable, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            }
            this.originContentText = spannableString
        }
        maxLines = maxShowLine
        firstDraw = true
        needFold = false
        setText(getOriginContentText())
    }

    fun setAutoExpandSeeMore(auto: Boolean): MoreLessRichTextView {
        this.shouldAutoExpand = auto
        return this
    }

    /**
     * 设置是否显示see more
     */
    fun setSeeMoreEnable(enable: Boolean): MoreLessRichTextView {
        this.seeMoreEnable = enable
        return this
    }

    /**
     * 设置是否显示see less
     */
    fun setSeeLessEnable(enable: Boolean): MoreLessRichTextView {
        this.seeLessEnable = enable
        return this
    }

    /**
     * 设置see more字体颜色
     */
    fun setSeeMoreTextColor(@ColorRes color: Int): MoreLessRichTextView {
        this.seeMoreTextColor = resources.getColor(color)
        return this
    }

    /**
     * 设置see more字体颜色
     */
    fun setSeeLessTextColor(@ColorRes color: Int): MoreLessRichTextView {
        this.seeLessTextColor = resources.getColor(color)
        return this
    }

    /**
     * 设置see More字号（SP）
     */
    @JvmName("setSeeMoreTextSize1")
    fun setSeeMoreTextSize(sp: Float): MoreLessRichTextView {
        this.seeMoreTextSize = sp.dp
        return this
    }

    /**
     * 设置see More字号（SP）
     */
    @JvmName("setSeeLessTextSize1")
    fun setSeeLessTextSize(sp: Float): MoreLessRichTextView {
        this.seeLessTextSize = sp.dp
        return this
    }

    /**
     * 设置see more提示语
     */
    fun setSeeMoreText(seeMoreText: String): MoreLessRichTextView {
        this.seeMoreText = seeMoreText
        return this
    }

    /**
     * 设置see more提示语
     */
    fun setSeeLessText(seeMoreText: String): MoreLessRichTextView {
        this.seeLessText = seeMoreText
        return this
    }

    /**
     * 设置最大显示行数，超过该行数折叠
     */
    fun setMaxShowLine(maxLine: Int): MoreLessRichTextView {
        this.maxShowLine = maxLine
        return this
    }

    /**
     * 设置当前显示状态：SHRINK(缩进) or EXPAND（展开）, 默认SEE MORE
     */
    fun setShowState(showState: ShowState): MoreLessRichTextView {
        this.showState = showState
        return this
    }

    /**
     * 设置more span是否可点击
     */
    fun setMoreSpanClickEnable(enable: Boolean): MoreLessRichTextView {
        this.moreSpanClickEnable = enable
        return this
    }

    /**
     * 设置less span是否可点击
     */
    fun setLessSpanClickEnable(enable: Boolean): MoreLessRichTextView {
        this.lessSpanClickEnable = enable
        return this
    }

    fun setTripleDotShow(enable: (maxShowLine: Int) -> Boolean): MoreLessRichTextView {
        this.setTripleDotShowEnable = enable
        return this
    }

    /**
     * 获取当前显示状态：SHRINK(缩进) or EXPAND（展开）, 默认SEE MORE
     */
    fun getShowState(): ShowState {
        return showState
    }

    @Keep
    enum class ShowState {
        SHRINK,
        EXPAND
    }
}
```

使用：

```kotlin
class TextViewFollowActivity : AppCompatActivity(), OnClickableSpanListener {  
    override fun onCreate(savedInstanceState: Bundle?) {  
        super.onCreate(savedInstanceState)  
        enableEdgeToEdge()  
        setContentView(R.layout.activity_text_view_follow)  
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->  
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())  
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)  
            insets  
        }  
  
        val tvNormal = findViewById<TextView>(R.id.tv_normal)  
        val span = getSpanText(tvNormal, this)  
        tvNormal.text = span  
  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less0).apply {  
            setMaxShowLine(2)  
            setSeeMoreEnable(true)  
            setSeeLessEnable(true)  
            setSeeMoreText("展示")  
            setSeeLessText("收起")  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setSeeLessTextColor(android.R.color.holo_blue_dark)  
  
            val text =  
                "1这是没有富文本的测试的，2这是没有富文本的测试的，3这是没有富文本的测试的，4这是没有富文本的测试的，5这是没有富文本的测试的，6这是没有富文本的测试的，7这是没有富文本的测试的，8这是没有富文本的测试的，9这是没有富文本的测试的，10这是没有富文本的测试的，11这是没有富文本的测试的。"  
            showText(text)  
        }  
  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less).apply {  
            setSeeMoreEnable(true)  
            setMaxShowLine(1)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setSeeLessTextColor(android.R.color.holo_blue_dark)  
            setSeeMoreText("展示")  
            setSeeLessText("收起")  
  
            val text = getSpanText(this, this@TextViewFollowActivity)  
            showText(text)  
  
        }  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less1).apply {  
            setSeeMoreEnable(true)  
            setMaxShowLine(2)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setSeeLessTextColor(android.R.color.holo_blue_dark)  
            setSeeMoreText("展示")  
            setSeeLessText("收起")  
  
            val text = getSpanText(this, this@TextViewFollowActivity)  
            text.append("这是2行的，这是2行的，这是2行的，这是2行的，这是2行的end")  
            showText(text)  
        }  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less2).apply {  
            setSeeMoreEnable(true)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setMaxShowLine(3)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setSeeLessTextColor(android.R.color.holo_blue_dark)  
            setSeeMoreText("展示")  
            setSeeLessText("收起")  
  
            val text = getSpanText(this, this@TextViewFollowActivity)  
            text.append("这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的end")  
            showText(text)  
        }  
  
        findViewById<MoreLessRichTextView>(R.id.tv_html).apply {  
            val longHtmlText =  
                "html这是3行的，<fon color=#FF00FF>这是3行的</font>，<font color=#A86104>哈哈哈哈</font>这是3行的，这是3行的，这是3行的，<strong>加重文本</strong> <em>强调文本</em>这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的，这是3行的end<strong>加重文本</strong> <em>强调文本</em> "  
            setSeeMoreEnable(true)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setMaxShowLine(3)  
            setSeeMoreTextColor(android.R.color.holo_red_dark)  
            setSeeLessTextColor(android.R.color.holo_blue_dark)  
            setSeeMoreText("展示")  
            setSeeLessText("收起")  
            showText(Html.fromHtml(longHtmlText))  
        }  
  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less_info).apply {  
            setMaxShowLine(1)  
            setSeeMoreEnable(true)  
            setSeeLessEnable(false)  
            setMoreSpanClickEnable(false)  
            setLessSpanClickEnable(false)  
            setSeeMoreText(">")  
            setTripleDotShow { maxShowLine ->  
                maxShowLine >= 3  
            }  
  
            val text = getSpanText2(this, this@TextViewFollowActivity)  
            showText(text)  
        }  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less_info2).apply {  
            setMaxShowLine(2)  
            setSeeMoreEnable(true)  
            setSeeLessEnable(false)  
            setMoreSpanClickEnable(false)  
            setLessSpanClickEnable(false)  
            setSeeMoreText(">")  
            setTripleDotShow { maxShowLine ->  
                maxShowLine >= 3  
            }  
  
            val text = getSpanText2(this, this@TextViewFollowActivity)  
            showText(text)  
        }  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less_info3).apply {  
            setMaxShowLine(3)  
            setSeeMoreEnable(true)  
            setSeeLessEnable(false)  
            setMoreSpanClickEnable(false)  
            setLessSpanClickEnable(false)  
            setSeeMoreText(">")  
            setTripleDotShow { maxShowLine ->  
                maxShowLine >= 3  
            }  
  
            val text = getSpanText2(this, this@TextViewFollowActivity)  
            showText(text)  
        }  
        findViewById<MoreLessRichTextView>(R.id.tv_more_less_info4).apply {  
            setMaxShowLine(5)  
            setSeeMoreEnable(true)  
            setSeeLessEnable(false)  
            setMoreSpanClickEnable(false)  
            setLessSpanClickEnable(false)  
            setSeeMoreText(">")  
            setTripleDotShow { maxShowLine ->  
                maxShowLine >= 5  
            }  
  
            val text = getSpanText2(this, this@TextViewFollowActivity)  
            showText(text)  
        }  
    }  
  
    private fun getSpanText2(  
        textview: TextView,  
        listener: OnClickableSpanListener  
    ): SpannableStringBuilder {  
        val spanBuild = SimplifySpanBuild()  
        spanBuild  
            .append(  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.live_avatar_default)  
                )  
                    .setGravity(SpecialGravity.CENTER)  
  
            )  
            .append("Hurry up!")  
            .append(  
                SpecialTextUnit("Cheaper than added").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(Color.BLUE)  
                ).setTextColor(  
                    Color.parseColor("#FA6338")  
                )  
            )  
            .append(  
                SpecialTextUnit("[括号内这是用来测试跨行的富文本显示的，颜色为红色]").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(Color.BLUE)  
                ).setTextColor(Color.RED)  
            )  
            .append(  
                SpecialTextUnit("[括号内这是用来测试最后一行富文本的显示，哈哈哈哈哈哈哈，颜色为蓝色]").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(Color.BLUE)  
                ).setTextColor(Color.BLUE)  
            )  
            .append(",up to \$10！up to \$1 up to \$10！up to \$10tup to o \$10up to \$10！up to \$1 up to \$10！up to \$10tup to o \$10up to \$10！up to \$1 up to \$10！up to \$10tup to o \$10up to \$10！up to \$1 up to \$10！up to \$10t up to o \$10！up to o \$10！ up to o \$10！ up to o \$10！ up to o \$10！ up to o \$10！")  
        return spanBuild.build()  
    }  
  
    private fun getSpanText(  
        textview: TextView,  
        listener: OnClickableSpanListener  
    ): SpannableStringBuilder {  
        val linkNorTextColor = -0xb7c275  
        val linkPressBgColor = -0x783106  
  
        val spanBuild = SimplifySpanBuild()  
        spanBuild.append("无默认背景11]")  
            .append(  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.level)  
                )  
                    .setGravity(SpecialGravity.CENTER)  
  
            )  
            .append(  
                SpecialTextUnit("[点我点我000").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(-0xb000)  
                ).setTextColor(  
                    Color.BLUE  
                )  
            )  
            .appendMultiClickable(  
                SpecialClickableUnit(textview, listener).setNormalTextColor(linkNorTextColor)  
                    .setPressBgColor(linkPressBgColor),  
                " ",  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.level),  
                    80,  
                    50  
                )  
                    .setGravity(SpecialGravity.CENTER),  
                SpecialTextUnit(" 用户名 ")  
            )  
            .append(  
                SpecialTextUnit("[点我点我1").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(-0xb000)  
                ).setTextColor(  
                    Color.BLUE  
                )  
            )  
            .append("哈哈哈")  
            .append(  
                SpecialTextUnit("[括号内测试富文本跨行显示，颜色红色]").setClickableUnit(  
                    SpecialClickableUnit(  
                        textview,  
                        listener  
                    ).setTag("1").setPressBgColor(-0xb000)  
                ).setTextColor(Color.RED)  
            )  
            .append("无默认背景显示下划线")  
            .append(  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.level)  
                )  
                    .setGravity(SpecialGravity.CENTER)  
  
            )  
            .append(  
                SpecialTextUnit("点我点我2").setClickableUnit(  
                    SpecialClickableUnit(textview, listener).setTag("2").showUnderline()  
                        .setPressBgColor(-0xb000).setPressTextColor(  
                            Color.WHITE  
                        )  
                ).setTextColor(-0xb000)  
            )  
            .append("有默认背景")  
            .append(  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.level),  
                    120,  
                    120  
                )  
                    .setGravity(SpecialGravity.CENTER)  
  
            )  
            .append(  
                SpecialTextUnit("点我点我3").setClickableUnit(  
                    SpecialClickableUnit(textview, listener).setTag("3").setPressBgColor(  
                        Color.BLUE  
                    ).setPressTextColor(Color.WHITE)  
                ).setTextColor(-0xb000).setTextBackgroundColor(-0x783115)  
            )  
            .append(  
                SpecialImageUnit(  
                    applicationContext,  
                    BitmapFactory.decodeResource(resources, R.drawable.level),  
                    180,  
                    180  
                )  
                    .setGravity(SpecialGravity.CENTER)  
  
            )  
            .append("我只是个结尾")  
        return spanBuild.build()  
    }  
  
    override fun onClick(tv: TextView?, clickableSpan: CustomClickableSpan?) {  
        Log.d("hacket", "onClick, tv=$tv, clickableSpan=$clickableSpan")  
        toast("onClick, tv=$tv, clickableSpan=$clickableSpan")  
    }  
}
```

效果：

![20240604162019.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261036692.png)

## … 全文

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fa7cb05cfaa41d8bfcc79272ecd0041~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

- [Android TextView限制最大行数且在最后显示...全文一、场景 我们知道通常在列表页面会有很多内容，而且每条 - 掘金](https://juejin.cn/post/7037416456782348295)

## Android TextView 头尾展示标签图片，并且尾部标签不被挤出

- [Android TextView头尾展示标签图片，并且尾部标签不被挤出](https://iwyatt.cc/2016/08/03/wt-center-image-span/)

## 自定义 ellipsize 策略

- [A TextView that ellipsizes more intelligently. This class supports ellipsizing multiline text through setting android:ellipsize and android:maxLines. · GitHub](https://gist.github.com/shayousefi/5b4709f8b2024dea735f)
- [Android TextView not support ellipsize if your text fills more than i line. This implementation solved this problem and allow you to use Instagram style end of line mark "\[...\]" · GitHub](https://gist.github.com/stepango/a874cae5eab6fd03473e)
