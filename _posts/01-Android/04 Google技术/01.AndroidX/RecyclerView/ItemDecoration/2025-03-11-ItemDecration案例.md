---
banner: 
date_created: Tuesday, March 11th 2025, 12:18:32 am
date_updated: Tuesday, March 25th 2025, 12:46:32 am
title: ItemDecration案例
author: hacket
categories:
  - Android
category: Google
tags: [RecyclerView]
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
aliases: [ItemDecration 案例]
linter-yaml-title-alias: ItemDecration 案例
---

# ItemDecration 案例

## LinearLayoutManager

### 水平，上下左右，Item 都是 6dp

- RecyclerView 无 padding

```kotlin
class CartBagFilterAddOnNoPaddingItemDecoration(val style: String) : RecyclerView.ItemDecoration() {

    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        if (position == RecyclerView.NO_POSITION) return
        val itemCount = parent.adapter?.itemCount ?: 0
        if (itemCount == 0) return
        val isRvRtl = (view.parent as? RecyclerView)?.layoutDirection == View.LAYOUT_DIRECTION_RTL

        when (style) {
            "a" -> setItemOffsetsStyleA(isRvRtl, outRect, view, position, itemCount)
        }
    }

    private fun setItemOffsetsStyleA(
        isRvRtl: Boolean,
        outRect: Rect,
        view: View,
        position: Int,
        itemCount: Int
    ) {
        outRect.top = SUIUtils.dp2px(view.context, 6F)
        outRect.bottom = SUIUtils.dp2px(view.context, 6F)

        if (isRvRtl) {
            outRect.right = SUIUtils.dp2px(view.context, 6F)
            if (position != itemCount - 1) {
                outRect.left = SUIUtils.dp2px(view.context, 0F)
            } else {
                outRect.left = SUIUtils.dp2px(view.context, 6F)
            }
        } else {
            outRect.left = SUIUtils.dp2px(view.context, 6F)
            if (position != itemCount - 1) {
                outRect.right = SUIUtils.dp2px(view.context, 0F)
            } else {
                outRect.right = SUIUtils.dp2px(view.context, 6F)
            }
        }
    }
}
```

- 效果
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503250002215.png)

### DividerItemDecoration 案例

1. 默认

```kotlin
rv_content_list.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
```

![dp1pc](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/dp1pc.png)

1. 默认设置 them: android:listDivider

```xml
<item name="android:listDivider">@drawable/inset_recyclerview_divider</item>
rv_content_list.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
```

1. 渐变

```xml
<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
android:insetLeft="10dp">
<!--android:insetLeft="10dp" 分割线距离左侧10dp-->
<shape>
    <!--分割线的高度，横向的RecyclerView,这里设置宽度即可-->
    <size android:height="10dp" />
    <gradient
        android:endColor="@color/green_200"
        android:startColor="@color/red_900" />
    <corners android:radius="20dp" />
</shape>
</inset>
```

代码

```kotlin
val divider = DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
getDrawable(R.drawable.inset_recyclerview_divider_gradient)?.let {
divider.setDrawable(it)
}
rv_content_list.addItemDecoration(divider)
```

1. 代码设置

```kotlin
class SimpleItemDecoration(context: Context?,
                       orientation: Int,
                       dividerSize: Int,
                       @ColorInt
                       startColor: Int = Color.TRANSPARENT,
                       @ColorInt
                       endColor: Int = Color.TRANSPARENT) :
    DividerItemDecoration(context, orientation) {

init {
    val drawable = if (orientation == HORIZONTAL) {

        GradientDrawable(
                GradientDrawable.Orientation.TOP_BOTTOM,
                intArrayOf(startColor, endColor)
        ).apply {
            setSize(dividerSize, 0)
        }
    } else {
        GradientDrawable(
                GradientDrawable.Orientation.LEFT_RIGHT,
                intArrayOf(startColor, endColor)
        ).apply {
            setSize(0, dividerSize)
        }
    }
    setDrawable(drawable)
}
}
```

使用

```kotlin
val simpleItemDecoration = SimpleItemDecoration(this, DividerItemDecoration.VERTICAL, 15.dp(), Color.GREEN, Color.BLUE)
rv_content_list.addItemDecoration(simpleItemDecoration)
```

![gril1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/gril1.png)

### 倒数第 2 个后，圆角

用于最后一个是 view more，倒数第 2 个需要圆角

**示例：** 倒数第 2 个，左下右下有白色的 12dp 的圆角

```kotlin
class SpecialBottomDecoration(
    private val cornerRadius: Float = 12F.dp(),
    private val bgColor: Int = Color.WHITE
) : RecyclerView.ItemDecoration() {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = bgColor
        style = Paint.Style.FILL
    }

    private val rectF = RectF()

    override fun getItemOffsets(outRect: Rect, view: View, parent: RecyclerView, state: RecyclerView.State) {
        if (isSecondLastItem(parent, view)) {
            outRect.bottom = cornerRadius.toInt()
        }
    }

    override fun onDraw(c: Canvas, parent: RecyclerView, state: RecyclerView.State) {
        super.onDraw(c, parent, state)
        parent.forEachVisibleChild { view, position ->
            if (isSecondLastItem(parent, view)) {
                drawBottomCorners(c, view)
            }
        }
    }

    private fun drawBottomCorners(canvas: Canvas, view: View) {
        rectF.set(
            view.left.toFloat(),
            view.bottom - cornerRadius,
            view.right.toFloat(),
            view.bottom.toFloat() + cornerRadius
        )

        // 直接绘制圆角矩形（硬件加速友好）
        canvas.drawRoundRect(
            rectF,
            cornerRadius,
            cornerRadius,
            paint
        )

        // 覆盖顶部直角部分
        canvas.drawRect(
            view.left.toFloat(),
            view.top.toFloat(),
            view.right.toFloat(),
            view.bottom.toFloat(),
            paint
        )
    }

    private fun isSecondLastItem(parent: RecyclerView, view: View): Boolean {
        val adapter = parent.adapter ?: return false
        val position = parent.getChildAdapterPosition(view)
        return position == adapter.itemCount - 2
    }

    private inline fun RecyclerView.forEachVisibleChild(action: (View, Int) -> Unit) {
        for (i in 0 until childCount) {
            val child = getChildAt(i)
            action(child, getChildAdapterPosition(child))
        }
    }
}
```

**示例 2：** 前面的示例会在当前 item 增加一个 12dp 的高度，现在需要实现一个不增加高度的方案

```kotlin
class CartLureAddOnItemsViewMoresDecoration(  
    private val cornerRadius: Float = SUIUtils.dp2px(AppContext.application, 12f).toFloat(),  
) : RecyclerView.ItemDecoration() {  
  
    private val mRoundCornerViewOutlineProvider by simpleLazy {  
        object : ViewOutlineProvider() {  
            override fun getOutline(view: View, outline: Outline) {  
                outline.setRoundRect(  
                    0,  
                    -cornerRadius.toInt(),  
                    view.width,  
                    view.height,  
                    cornerRadius  
                )  
            }  
        }  
    }  
    private val mRectViewOutlineProvider by simpleLazy {  
        object : ViewOutlineProvider() {  
            override fun getOutline(view: View, outline: Outline) {  
                outline.setRect(0, 0, view.width, view.height)  
            }  
        }  
    }  
  
    override fun onDraw(c: Canvas, parent: RecyclerView, state: RecyclerView.State) {  
        super.onDraw(c, parent, state)  
        parent.forEachVisibleChild { view, _ ->  
            view.clipToOutline = true  
            if (isSecondLastItem(parent, view)) {  
                view.outlineProvider = mRoundCornerViewOutlineProvider  
            } else {  
                view.outlineProvider = mRectViewOutlineProvider  
            }  
        }  
    }  
  
    private fun isSecondLastItem(parent: RecyclerView, view: View): Boolean {  
        val adapter = parent.adapter as? CommonTypDelegateAdapterWithStickyHeader ?: return false  
        val position = parent.getChildAdapterPosition(view)  
        val isSecondLast = position == adapter.itemCount - 2  
        val nextItem = adapter.items.getOrNull(position + 1)  
        return isSecondLast && nextItem is LureViewMoreBean  
    }  
  
    private inline fun RecyclerView.forEachVisibleChild(action: (View, Int) -> Unit) {  
        for (i in 0 until childCount) {  
            val child = getChildAt(i)  
            action(child, getChildAdapterPosition(child))  
        }  
    }  
}
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503130058111.png)

## GridLayoutManager

### 上下左右 6dp 间距，item 左右 24 dp，item 上下 12dp

- RecyclerView：水平 padding 6dp，上下无 padding

```java
<androidx.recyclerview.widget.RecyclerView
	android:id="@+id/rv_cart_bag_filter_add_on_style_b"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:background="@color/green_100"
	android:minHeight="140dp"
	android:paddingHorizontal="@dimen/sui_space_6" />
```

- ItemDecoration

```kotlin
class CartBagFilterAddOnWithHorizontalPaddingItemDecoration() :
    RecyclerView.ItemDecoration() {
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        if (position == RecyclerView.NO_POSITION) return
        val itemCount = parent.adapter?.itemCount ?: 0
        if (itemCount == 0) return
        val isRvRtl = (view.parent as? RecyclerView)?.layoutDirection == View.LAYOUT_DIRECTION_RTL
		setItemOffsetsStyleB(isRvRtl, outRect, view, position, itemCount)
    }

    private fun setItemOffsetsStyleB(
        isRvRtl: Boolean,
        outRect: Rect,
        view: View,
        position: Int,
        itemCount: Int
    ) {
        val rv = (view.parent as? RecyclerView) ?: return
        val layoutManager = rv.layoutManager as? GridLayoutManager
        val spanCount = layoutManager?.spanCount ?: 2
        val column = (position % spanCount)

        outRect.top = SUIUtils.dp2px(view.context, 6F)
        outRect.bottom = SUIUtils.dp2px(view.context, 6F)

        if (isRvRtl) {
            if (position != itemCount - 1 && position != itemCount - 2) {
                outRect.left = SUIUtils.dp2px(view.context, 24F)
            } else {
                outRect.left = SUIUtils.dp2px(view.context, 0F)
            }
        } else {
            if (position != itemCount - 1 && position != itemCount - 2) {
                outRect.right = SUIUtils.dp2px(view.context, 24F)
            } else {
                outRect.right = SUIUtils.dp2px(view.context, 0F)
            }
        }
    }
}
```

由于是 wrap_content 需要做好高度适配，top 和 bottom 最好是设置为一样，能更好的适配

- 效果（支持 RTL）
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503242355641.png)

### 问题

#### RecyclerView 的高度未固定，为 wrap_content

##### 问题分析

**问题：**
RecyclerView 的高度未固定，为 wrap_content，padding 为 6 dp，水平方向的 GridLayoutManager，spanCount=2；期望上下间距 6 dp，第 1 行和第 2 行间距 12 dp，item 左右间距 24 dp，第 2 行距离底部 6 dp

```xml
<androidx.recyclerview.widget.RecyclerView
	android:id="@+id/rv_cart_bag_filter_add_on_style_b"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:background="@color/green_100"
	android:minHeight="@dimen/dp_140"
	android:padding="@dimen/sui_space_6" />
```

ItemDecoration，top 为 0，bottom 是第 1 行为 12 dp，第 2 行为 0 dp

```kotlin
// getItemOffsets()
val rv = (view.parent as? RecyclerView) ?: return
val layoutManager = rv.layoutManager as? GridLayoutManager
val spanCount = layoutManager?.spanCount ?: 2
val column = (position % spanCount)
if (column == 0) {
	outRect.bottom = SUIUtils.dp2px(view.context, 12F)
} else {
	outRect.bottom = SUIUtils.dp2px(view.context, 0F)
}

if (isRvRtl) {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.left = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.left = SUIUtils.dp2px(view.context, 0F)
	}
} else {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.right = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.right = SUIUtils.dp2px(view.context, 0F)
	}
}
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240059447.png)

与期望的不一致，设计稿高度为 140 dp，而实际为 160 dp，导致 outRect 的 top 和 bottom 看起来未生效，这是因为 rv 超过 140 dp，itemView 只有 58 dp，摆完之后还是摆不下，高度就均分了。

**尝试解决：** 写死，pass
固定 RecyclerView 的高度为 140 dp，写死后会被截断
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240119348.png)

##### 解决 1：rv 的高度为 wrap_content, 有 padding；top 和 bottom 按需设置

- xml

```xml
<androidx.recyclerview.widget.RecyclerView
	android:id="@+id/rv_cart_bag_filter_add_on_style_b"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:background="@color/green_100"
	android:minHeight="@dimen/dp_140"
	android:padding="@dimen/sui_space_6" />
```

- ItemDecoration

```kotlin
val rv = (view.parent as? RecyclerView) ?: return
val layoutManager = rv.layoutManager as? GridLayoutManager
val spanCount = layoutManager?.spanCount ?: 2
val column = (position % spanCount)

if (column == 0) {
	outRect.top = SUIUtils.dp2px(rv.context, 0F)
	outRect.bottom = SUIUtils.dp2px(rv.context, 6F)
} else {
	outRect.top = SUIUtils.dp2px(view.context, 6F)
	outRect.bottom = SUIUtils.dp2px(view.context, 0F)
}

if (isRvRtl) {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.left = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.left = SUIUtils.dp2px(view.context, 0F)
	}
} else {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.right = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.right = SUIUtils.dp2px(view.context, 0F)
	}
}
```

- 效果（符合预期）
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240148856.png)

**问题：** 高度超过 140dp，如 160 dp，就不行了
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240151071.png)

##### 解决 2：rv 的高度为 wrap_content，paddingHorizontal=6 dp；top 和 bottom 为 6 dp

- xml

```xml
<androidx.recyclerview.widget.RecyclerView
	android:id="@+id/rv_cart_bag_filter_add_on_style_b"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:background="@color/green_100"
	android:minHeight="140dp"
	android:paddingHorizontal="@dimen/sui_space_6" />
```

- itemView 的布局高度写死 58dp 或者 match_parent 都可以

```xml
<?xml version="1.0" encoding="utf-8"?>  
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"  
    xmlns:app="http://schemas.android.com/apk/res-auto"  
    xmlns:tools="http://schemas.android.com/tools"  
    android:layout_width="226dp"  
    android:layout_height="58dp"  
    android:layoutDirection="locale"  
    android:orientation="horizontal"  
    tools:background="@color/sui_color_white"  
    tools:layout_width="226dp">
</LinearLayout>
```

- ItemDecoration

```kotlin
val rv = (view.parent as? RecyclerView) ?: return
val layoutManager = rv.layoutManager as? GridLayoutManager
val spanCount = layoutManager?.spanCount ?: 2
val column = (position % spanCount)

outRect.top = SUIUtils.dp2px(view.context, 6F)
outRect.bottom = SUIUtils.dp2px(view.context, 6F)

if (isRvRtl) {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.left = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.left = SUIUtils.dp2px(view.context, 0F)
	}
} else {
	if (position != itemCount - 1 && position != itemCount - 2) {
		outRect.right = SUIUtils.dp2px(view.context, 24F)
	} else {
		outRect.right = SUIUtils.dp2px(view.context, 0F)
	}
}
```

- 效果：上下间隔为 6dp，中间为 12dp，符合预期；rv 滑动左右有 6dp
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240140965.png)

**问题：** 高度超过 140dp，如 160 dp，就不行了
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240151071.png)

##### 解决 3：rv 的高度为 wrap_content，无 padding，交给 itemDecoration 处理；滑动没有 padding 了

- xml

```xml
<androidx.recyclerview.widget.RecyclerView
	android:id="@+id/rv_cart_bag_filter_add_on_style_b"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:background="@color/green_100"
	android:minHeight="140dp"
	android:paddingHorizontal="@dimen/sui_space_0" />
```

- ItemDecoration

```kotlin
private fun setItemOffsetsStyleB(
	isRvRtl: Boolean,
	outRect: Rect,
	view: View,
	position: Int,
	itemCount: Int
) {
	val layoutManager = (view.parent as? RecyclerView)?.layoutManager as? GridLayoutManager
	val spanCount = layoutManager?.spanCount ?: 2

	outRect.top = SUIUtils.dp2px(view.context, 6F)
	outRect.bottom = SUIUtils.dp2px(view.context, 6F)

	if (isRvRtl) {
		outRect.right = SUIUtils.dp2px(view.context, 6F)
		if (position >= itemCount - spanCount) {
			outRect.left = SUIUtils.dp2px(view.context, 6F)
		} else {
			outRect.left = SUIUtils.dp2px(view.context, 12F)
		}
	} else {
		outRect.left = SUIUtils.dp2px(view.context, 6F)
		if (position >= itemCount - spanCount) {
			outRect.right = SUIUtils.dp2px(view.context, 6F)
		} else {
			outRect.right = SUIUtils.dp2px(view.context, 12F)
		}
	}
}
```

- 效果
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503240159512.png)

- 问题
	- rv 滑动，没有 padding 了
	- 问题：高度超过 140dp，如 160 dp，就不行了

##### **小结**

- 对于 RecyclerView 高度不固定的，GridLayoutManager 的 ItemDecoration 的 top 和 bottom 需要设置为一样的，这样间隔才能均分；不用 top 和 bottom 不一致

## ItemDecoration 开源

### RecyclerView-FlexibleDivider

<https://github.com/yqritc/RecyclerView-FlexibleDivider>

![](https://github.com/yqritc/RecyclerView-FlexibleDivider/raw/master/sample/sample2.gif)
