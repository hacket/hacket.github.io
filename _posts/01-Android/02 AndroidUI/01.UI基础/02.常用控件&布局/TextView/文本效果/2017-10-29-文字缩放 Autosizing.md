---
banner: 
date_created: Tuesday, October 29th 2017, 12:08:52 am
date_updated: Friday, March 28th 2025, 11:11:07 am
title: 文字缩放 Autosizing
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
aliases: [TextView 文字缩放]
linter-yaml-title-alias: TextView 文字缩放
---

# TextView 文字缩放

## Autosizing（TextView 文本大小自动适配）

### Autosizing 方式

官方推出的 TextView 的 Autosizing 方式，在宽度固定的情况下，可以设置最大文本 Size 和最小文本 Size 和每次缩放粒度。

#### Autosizing 使用

##### xml

**XML 方式：**

```xml
app:autoSizeTextType="uniform"
app:autoSizeMaxTextSize="13sp"
app:autoSizeMinTextSize="5sp"
app:autoSizeStepGranularity="1sp"
```

示例：

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
- **autoSizeMinTextSize**：最小文字大小，例如设置为 10 sp，表示文字最多只能缩小到 10 sp。
- **autoSizeMaxTextSize**：最大文字大小，例如设置为 18 sp，表示文字最多只能放大到 18 sp。
- **autoSizeStepGranularity**：缩放粒度，即每次文字大小变化的数值，例如设置为 1 sp，表示每次缩小或放大的值为 1 sp。

##### 代码

**代码中使用：**

```java
TextView tvText = findViewById(R.id.tv_text);
TextViewCompat.setAutoSizeTextTypeWithDefaults(tvText,TextViewCompat.AUTO_SIZE_TEXT_TYPE_UNIFORM);
TextViewCompat.setAutoSizeTextTypeUniformWithConfiguration(tvText,10,18,1, TypedValue.COMPLEX_UNIT_SP);
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261930036.png)

#### Autosizing 不生效

##### 原因

Autosizing 在不同的宽高 wrap_content，是否多行，都生效，前提是已经摆放不下了<br>**原因**：设置了 `android:singleLine="true"`

##### 解决 1：存在 ellipsize=middle

去掉 `singleLine=true`，改成 maxLines=1 即可，但如果用到了 `ellipsize=middle`，就不行了，需要用代码实现

```kotlin
private fun autoSizeWithSingleLine(  
    textView: TextView,  
    text: CharSequence,  
    fontSizes: List<Float> = listOf(13F, 12F, 11F, 10F),  
) {  
    val availableWidth = textView.width - textView.paddingLeft - textView.paddingRight  
    if (availableWidth <= 0) return  
    val paint = textView.paint  
    for (textSizeSp in fontSizes.sortedDescending()) {  
        val textSizePx = SUIUtils.sp2px(textView.context, textSizeSp)  
        paint.textSize = textSizePx.toFloat()  
        if (paint.measureText(text.toString()) <= availableWidth) {  
            textView.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSizeSp)  
            break  
        }  
    }  
    textView.text = text  
}
```

##### 解决 2

- 不要在 `layout_width` 和 `layout_height` 使用 `wrap_content`
- 不要用 `android:singleLine`，而是用 `android:maxLines=1`；注意 `ellipsize=middle` 只能使用 singleLine
- 用 `app:autosizexxx` 替代 `android:autosizexxx` 以支持旧版本
- Autosize 支持 `AppCompatTextView` and `TextView`

Ref: [Autosizing of TextView doesn't work (Android O) - Stack Overflow](https://stackoverflow.com/questions/44118002/autosizing-of-textview-doesnt-work-android-o)

### 自定义 View 的方式（固定宽度）

其核心思想和上面的 Autosizing 的方式类似，一般是测量 TextView 字体所占的宽度与 TextView 控件的宽度对比，动态改变 TextView 的字体大小。<br>类似：[AutoSizeTextView](https://github.com/iglaweb/AutoSizeTextView/blob/master/library/src/main/java/ru/igla/widget/AutoSizeTextView.java)

### 使用工具类自行计算（非控件固定宽度）

自定义 View 计算宽度的方法抽取出来：

1. 基于当前 textSize 来获取宽度
2. 如果获取的宽度小于等于可用的宽度，就设置该文字大小，否则一直循环重复 1~2 步骤

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

可以看到 2 个都是 wrap content，那么如何实现这种适应宽度 + 多布局的变长宽度效果呢。其实就是需要我们调用方法手动的计算金额 TextView 的宽度

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

效果：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501261931408.png)

### 1 行展示不下，先缩放字体到最小大小 10 sp，还展示不下，设置展示 2 行

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

## 工具类

### 根据文本长度动态调整字体大小

- 先设置为 1 行
- 根据提供的字体大小 List，一个个去试
	- 如果有 ellipsis，说明一行摆放不下，继续尝试下一个字体大小
	- 如果没有 ellipsis，说明一行摆的下
- 最终都会设置 maxLine 为传入的
- 根据行数设置 padding

```kotlin
/**  
 * 根据文本长度动态调整字体大小  
 */  
fun TextView.setTextWithSuitableSize(  
    msg: String?,  
    textWidth: Int,  
    atLeastSize: Float = 12f,  
    paddingTopBottom: Int = DensityUtil.dp2px(2f),  
    textSizeList: ArrayList<Float> = arrayListOf(12f, 11f, 10f, 9f, 8f),  
    maxLine: Int = 2  
) {  
    maxLines = 1  
    val sizeQueue = LinkedBlockingQueue(textSizeList)  
    text = msg  
    if (msg.isNullOrEmpty()) {  
        textSize = atLeastSize  
        return  
    }  
  
    var ellipseCount = 1  
    while (ellipseCount > 0 && sizeQueue.isNotEmpty()) {  
        val fixSize = sizeQueue.poll() ?: atLeastSize  
        if (fixSize > atLeastSize) continue  
        textSize = fixSize  
        measure(  
            View.MeasureSpec.makeMeasureSpec(textWidth, View.MeasureSpec.EXACTLY),  
            View.MeasureSpec.UNSPECIFIED  
        )  
        ellipseCount = layout?.getEllipsisCount(lineCount - 1) ?: 0  
    }  
    maxLines = maxLine  
    if (lineCount == 1) {  
        setPadding(paddingStart, 0, paddingEnd, 0)  
    } else if (lineCount == 2) {  
        setPadding(paddingStart, paddingTopBottom, paddingEnd, paddingTopBottom)  
    }  
}
```

# 应用

## TextView 1 行展示不下，先缩放字体，还展示不下，设置展示 2 行

```kotlin
val textPaintClone = TextPaint()  

private fun adjustTvTextSize(  
	tv: TextView,  
	maxWidth: Int,  
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
	}        val availWidth = maxWidth - tv.paddingStart - tv.paddingEnd - 6F.dp()  
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
	tv.textSize = tryTextSizeSp  
	Log.w("hacket", "final tryTextSizeSp=${tryTextSizeSp}, avail=$avail")  
}
```
