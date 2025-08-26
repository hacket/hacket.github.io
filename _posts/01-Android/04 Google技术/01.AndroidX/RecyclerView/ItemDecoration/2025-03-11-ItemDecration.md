---
banner: 
date_created: Tuesday, March 11th 2025, 12:18:32 am
date_updated: Sunday, April 20th 2025, 11:27:30 pm
title: ItemDecration
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
aliases: [ItemDecration]
linter-yaml-title-alias: ItemDecration
---

# ItemDecration

## ItemDecoration 基础

### ItemDecoration 的基本使用

```java
mMainAdapter = new MainAdapter(this, entities);
recyclerView.setLayoutManager(new LinearLayoutManager(this));
recyclerView.addItemDecoration(new StickyItemDecoration.Builder(this).create(entities));
recyclerView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
recyclerView.setAdapter(mMainAdapter);
```

设置 `addItemDecoration` 时候，是可以设置多个 `ItemDecoration.` 的，绘制顺序是从按照插入顺序绘制。

### ItemDecoration 核心方法

```java
public class TestDividerItemDecoration extends RecyclerView.ItemDecoration {

    // 方法1：getItemOffsets（）
    // 作用：设置ItemView的内嵌偏移长度（inset）
    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
    	// ...
  	}

    // 方法2：onDraw（）
    // 作用：在子视图上设置绘制范围，并绘制内容
    // 类似平时自定义View时写onDraw()一样
    // 绘制图层在ItemView以下，所以如果绘制区域与ItemView区域相重叠，会被遮挡
    @Override
    public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state) {
    	// ...
  	}

    // 方法3：onDrawOver（）
    // 作用：同样是绘制内容，但与onDraw（）的区别是：绘制在图层的最上层
    @Override
    public void onDrawOver(Canvas c, RecyclerView parent, RecyclerView.State state) {
    	// ...
    }
}
```

#### getItemOffsets

##### getItemOffsets 介绍

设置 ItemView 的内嵌偏移长度（inset）；其实 `RecyclerView` 中的 ItemView 外面会包裹着一个矩形（`outRect`）；- **内嵌偏移长度** 是指：该矩形（`outRect`）与 `ItemView` 的间隔。

![202503222326810](attachments/202503222326810.png)

- 内嵌偏移长度分为 4 个方向：上、下、左、右，并由 `outRect` 中的 `top、left、right、bottom` 参数 控制
- `top、left、right、bottom` 参数默认 = 0，即矩形和 Item 重叠，所以看起来矩形就消失了
![202503222326025](attachments/202503222326025.png)

##### getItemOffsets 使用

```java
@Override
public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
	// 参数说明：
	// 1. outRect：全为 0 的 Rect（包括着Item）
	// 2. view：RecyclerView 中的 视图Item
	// 3. parent：RecyclerView 本身
	// 4. state：状态

  outRect.set(50, 0, 0, 50);
  // 4个参数分别对应左（Left）、上（Top）、右（Right）、下（Bottom）
  // 上述语句代表：左&下偏移长度=50px，右 & 上 偏移长度 = 0
   ...
}
```

![202503222329000](attachments/202503222329000.png)

##### getItemOffsets 源码分析

- `RecyclerView` 本质上是一个自定义 `ViewGroup`，子视图 `child` = 每个 `ItemView`
- 其通过 `LayoutManager` 测量并布局 `ItemView`

```java
public void measureChild(View child, int widthUsed, int heightUsed) {

// 参数说明：
  // 1. child：要测量的子view(ItemView)
  // 2. widthUsed： 一个ItemView的所有ItemDecoration占用的宽度(px)
  // 3. heightUsed：一个ItemView的所有ItemDecoration占用的高度(px)

    final LayoutParams lp = (LayoutParams) child.getLayoutParams();

    final Rect insets = mRecyclerView.getItemDecorInsetsForChild(child);
    // 累加当前ItemDecoration 4个属性值->>分析1

    widthUsed += insets.left + insets.right;
    // 计算每个ItemView的所有ItemDecoration的宽度
    heightUsed += insets.top + insets.bottom;
    // 计算每个ItemView的所有ItemDecoration的高度

    final int widthSpec = getChildMeasureSpec(getWidth(), getWidthMode(),
            getPaddingLeft() + getPaddingRight() + widthUsed, lp.width,
            canScrollHorizontally());
    // 测量child view（ItemView）的宽度
    // 第三个参数设置 child view 的 padding，即ItemView的Padding
    // 而该参数把 insets 的值算进去，所以insets 值影响了每个 ItemView 的 padding值

    // 高度同上
    final int heightSpec = getChildMeasureSpec(getHeight(), getHeightMode(),
            getPaddingTop() + getPaddingBottom() + heightUsed, lp.height,
            canScrollVertically());
    if (shouldMeasureChild(child, widthSpec, heightSpec, lp)) {
        child.measure(widthSpec, heightSpec);
    }
}

// 分析完毕，请跳出
<-- 分析1：getItemDecorInsetsForChild（）-->
Rect getItemDecorInsetsForChild(View child) {
    final LayoutParams lp = (LayoutParams) child.getLayoutParams();

    insets.set(0, 0, 0, 0);
    for (int i = 0; i < decorCount; i++) {
        mTempRect.set(0, 0, 0, 0);

        // 获取getItemOffsets（） 中设置的值
        mItemDecorations.get(i).getItemOffsets(mTempRect, child, this, mState);
        // 将getItemOffsets（） 中设置的值添加到insets 变量中

        insets.left += mTempRect.left;
        insets.top += mTempRect.top;
        insets.right += mTempRect.right;
        insets.bottom += mTempRect.bottom;
    }
    // 最终返回
    return insets;
}

// insets介绍
  // 1. 作用：
    // a. 把每个ItemView的所有 ItemDecoration 的 getItemOffsets 中设置的值累加起来，（每个ItemView可添加多个ItemDecoration）
    // 即把每个ItemDecoration的left, top, right, bottom 4个属性分别累加
    // b. 记录上述结果
    // c. inset就像padding和margin一样，会影响view的尺寸和位置

  // 2. 使用场景：设置View的边界大小，使得其大小>View的背景大小
  // 如 按钮图标（View的背景）较小，但是我们希望按钮有较大的点击热区（View的边界大小）

// 返回到分析1进来的原处
```

#### onDraw

onDraw 这个方法实际上就是真实的绘制操作了，可以用 canvas 进行绘制，在 `getItemOffsets` 中，对布局撑开处理了之后，就可以在撑开的部分进行绘制。该操作的绘制是和 itemview 在同一层。

先来看看 [官方样例的 DividerItemDecoration](https://android.googlesource.com/platform/development/%2B/master/samples/Support7Demos/src/com/example/android/supportv7/widget/decorator/DividerItemDecoration.java#66) 实现：

```java
public void drawVertical(Canvas c, RecyclerView parent) {
    final int left = parent.getPaddingLeft();
    final int right = parent.getWidth() - parent.getPaddingRight();
    final int childCount = parent.getChildCount();
    for (int i = 0; i < childCount; i++) {
        final View child = parent.getChildAt(i);
        final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
                .getLayoutParams();
        final int top = child.getBottom() + params.bottomMargin +
                Math.round(ViewCompat.getTranslationY(child));
        final int bottom = top + mDivider.getIntrinsicHeight();
        mDivider.setBounds(left, top, right, bottom);
        mDivider.draw(c);
    }
}
```

drawVertical 是为纵向的 RecyclerView 绘制 divider，遍历每个 _child view_  ，把 divider 绘制到 canvas 上，而 `mDivider.setBounds` 则设置了 divider 的绘制范围。其中，left 设置为 parent.getPaddingLeft()，也就是左边是 parent 也就是 RecyclerView 的左边界加上 paddingLeft 之后的位置，而 right 则设置为了 RecyclerView 的右边界减去 paddingRight 之后的位置，那这里左右边界就是 RecyclerView 的 _内容区域_ 了。top 设置为了 child 的 bottom 加上 marginBottom 再加上 translationY，这其实就是 child view 的 _下边界_，bottom 就是 divider 绘制的下边界了，它就是简单地 top 加上 divider 的高度。

- child view，并不是 adapter 的每一个 item，只有可见的 item 才会绘制，才是 RecyclerView 的 child view ↩
- 内容区域：可以类比 CSS 的盒子模型，一个 view 包括 content, padding, margin 三个部分，content 和 padding 加起来就是 view 的尺寸，而 margin 不会增加 view 的尺寸，但是会影响和其他 view 的位置间距，但是安卓的 view 没有 margin 的合并
- 下边界： bottom 就是 content 的下边界加上 paddingBottom，而为了不 " 吃掉 " child view 的底部边距，所以就加上 marginBottom，而 view 还能设置 translation 属性，用于 layout 完成之后的再次偏移，同理，为了不 " 吃掉 " 这个偏移，所以也要加上 translationY

##### 注意

**注意点 1：**
**`Itemdecoration` 的 `onDraw()` 绘制会先于 `ItemView` 的 `onDraw()` 绘制，所以如果在 `Itemdecoration` 的 `onDraw()` 中绘制的内容在 `ItemView` 边界内，就会被 `ItemView` 遮挡住。** 此现象称为 `onDraw()` 的 `OverDraw` 现象

![202503222335248](attachments/202503222335248.png)

**解决方案：** 配合前面的 `getItemOffsets()` 一起使用在 outRect 矩形与 ItemView 的间隔区域绘制内容；即通过 `getItemOffsets()` 设置与 `Item` 的间隔区域，从而获得与 `ItemView` 不重叠的绘制区域。

![202503222337380](attachments/202503222337380.png)

**注意点 2：**
**`getItemOffsets()` 针对是每一个 `ItemView` 的，而 `onDraw()` 针对 `RecyclerView` 本身**

解决方案：在使用 `onDraw（）` 绘制时，需要先遍历 `RecyclerView` 的所有 `ItemView` 分别获取它们的位置信息，然后再绘制内容

1. 此处遍历的 `RecyclerView` 的 `ItemView`（即 `Child view`），并不是 `Adapter` 设置的每一个 `item`，而是可见的 `item`
2. 因为只有可见的 `Item` 才是 `RecyclerView` 的 `Child view`

```java
@Override
public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state) {

	// RecyclerView 的左边界加上 paddingLeft距离 后的坐标位置
	final int left = parent.getPaddingLeft();
	// RecyclerView 的右边界减去 paddingRight 后的坐标位置
	final int right = parent.getWidth() - parent.getPaddingRight();
	// 即左右边界就是 RecyclerView 的 ItemView区域
	
	// 获取RecyclerView的Child view的个数
	final int childCount = parent.getChildCount();
	
	// 设置布局参数
	final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
				.getLayoutParams();
	
	// 遍历每个RecyclerView的Child view
	// 分别获取它们的位置信息，然后再绘制内容
	for (int i = 0; i < childCount; i++) {
		final View child = parent.getChildAt(i);
		int index = parent.getChildAdapterPosition(view);
		// 第一个Item不需要绘制
		if ( index == 0 ) {
			continue;
		}
		// ItemView的下边界：ItemView 的 bottom坐标 + 距离RecyclerView底部距离 +translationY
		final int top = child.getBottom() + params.bottomMargin +
				Math.round(ViewCompat.getTranslationY(child));
		// 绘制分割线的下边界 = ItemView的下边界+分割线的高度
		final int bottom = top + mDivider.getIntrinsicHeight();
		mDivider.setBounds(left, top, right, bottom);
		mDivider.draw(c);
	}
}
```

#### onOverDraw

- 与 `onDraw()` 类似，都是绘制内容
- 但与 `onDraw()` 的区别是：`Itemdecoration` 的 `onDrawOver()` 绘制是后于 `ItemView` 的 `onDraw()` 绘制；会遮挡 itemView 的绘制
- 绘制时机顺序： `Itemdecoration.onDraw()` > `ItemView.onDraw()` > `Itemdecoration.onDrawOver()`

#### 小结

- **getItemOffsets** 中为 outRect 设置的 4 个方向的值，将被计算进所有 decoration 的尺寸中，而这个尺寸，被计入了 RecyclerView 每个 item view 的 padding 中
- 在 **onDraw** 为 divider 设置绘制范围，并绘制到 canvas 上，而这个绘制范围可以超出在 getItemOffsets 中设置的范围，但由于 decoration 是绘制在 child view 的底下，所以并不可见，但是会存在 overdraw
- decoration 的 onDraw，child view 的 onDraw，decoration 的 onDrawOver，这三者是依次发生的
- **onDrawOver** 是绘制在最上层的，所以它的绘制位置并不受限制

## ItemDecoration 对 RTL 的支持

在 RTL（Right-to-Left，从右到左）布局下，`RecyclerView` 的排列方向会反转，因此 `ItemDecoration` 中 `outRect` 的 `left` 和 `right` 需要做对称处理。以下是针对 RTL 布局的优化方案和代码解释：

### RTL 适配

- outRect 的 left 和 right 的逻辑互换

### 注意

- 在 ItemView 获取 layoutDirection 是否为 RTL 失效，需要获取 RecyclerView 的 layoutDirection

```kotlin
// 失效
val isRtl = view.layoutDirection == View.LAYOUT_DIRECTION_RTL
val isRtl2 = ViewCompat.getLayoutDirection(view) == ViewCompat.LAYOUT_DIRECTION_RTL 

// 生效
val rv = (view.parent as? RecyclerView)
val isRvRtl = rv?.layoutDirection == View.LAYOUT_DIRECTION_RTL
```

### DividerItemDecoration

#### DividerItemDecoration 系统提供默认

1. 只用于 LinearLayoutManager 的 divider
2. 如果需要全局修改 divider，在 theme 定义 `android:listDivider` 属性

```xml
<style name="AppTheme.Base.ListDivider">
<item name="android:listDivider">@drawable/inset_recyclerview_divider</item>
</style>
```

1. DividerItemDecoration 默认的 drawable 是个 width/height 为 4 的 GradientDrawable

#### DividerItemDecoration 源码分析

分析下绘制垂直方向分割线的方法

```java
/**
 * 绘制垂直方向的分割线
 * @param canvas
 * @param parent
 */
private void drawVertical(Canvas canvas, RecyclerView parent) {
    canvas.save();
    final int left;
    final int right;
    //对应于布局中的clipToPadding属性，是否允许在padding区域绘制子View,true:不允许在padding区域绘制 false:允许在padding区域绘制子View
    if (parent.getClipToPadding()) {
        //不允许在padding区域绘制子View的left和right
        left = parent.getPaddingLeft();
        right = parent.getWidth() - parent.getPaddingRight();
        //设置画布的显示区域(在布局文件中设置clipToPadding为true的关键在这里体现)
        canvas.clipRect(left, parent.getPaddingTop(), right,
                parent.getHeight() - parent.getPaddingBottom());
    } else {
        left = 0;
        right = parent.getWidth();
    }

    //可见子View的数目
    final int childCount = parent.getChildCount();
    for (int i = 0; i < childCount; i++) {
        final View child = parent.getChildAt(i);
        //获取装饰边界mBounds
        parent.getDecoratedBoundsWithMargins(child, mBounds);
        final int bottom = mBounds.bottom + Math.round(ViewCompat.getTranslationY(child));
        final int top = bottom - mDivider.getIntrinsicHeight();
        mDivider.setBounds(left, top, right, bottom);//设置分割线的位置
        mDivider.draw(canvas);//绘制分割线
    }
    canvas.restore();
}
```

### 自定义 ItemDecoration

#### ItemDecoration

```java
public abstract static class ItemDecoration {
    // 在itemView绘制之前绘制
    public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull State state) {
        onDraw(c, parent);
    }

    /**
     * @deprecated
     * Override {@link #onDraw(Canvas, RecyclerView, RecyclerView.State)}
     */
    @Deprecated
    public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent) {
    }

    // 在itemView绘制之后绘制
    public void onDrawOver(@NonNull Canvas c, @NonNull RecyclerView parent,
            @NonNull State state) {
        onDrawOver(c, parent);
    }

    /**
     * @deprecated
     * Override {@link #onDrawOver(Canvas, RecyclerView, RecyclerView.State)}
     */
    @Deprecated
    public void onDrawOver(@NonNull Canvas c, @NonNull RecyclerView parent) {
    }


    /**
     * @deprecated
     * Use {@link #getItemOffsets(Rect, View, RecyclerView, State)}
     */
    @Deprecated
    public void getItemOffsets(@NonNull Rect outRect, int itemPosition,
            @NonNull RecyclerView parent) {
        outRect.set(0, 0, 0, 0);
    }

    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view,
            @NonNull RecyclerView parent, @NonNull State state) {
        getItemOffsets(outRect, ((LayoutParams) view.getLayoutParams()).getViewLayoutPosition(),
                parent);
    }
}
```

- outRect 当前 itemView 距离上下左右的边距<br>![lxz2l](attachments/lxz2l.png)
- onDraw 中绘制的内容会被 itemView 覆盖；onDrawOver 的内容会覆盖 itemView
- 注意处理 padding/margin
- 注意 RecyclerView clipChildren，可参考 DividerItemDecoration 画布裁剪

```java
// DividerItemDecoration 
private void drawVertical(Canvas canvas, RecyclerView parent) {
    canvas.save();
    final int left;
    final int right;
    //noinspection AndroidLintNewApi - NewApi lint fails to handle overrides.
    if (parent.getClipToPadding()) {
        left = parent.getPaddingLeft();
        right = parent.getWidth() - parent.getPaddingRight();
        canvas.clipRect(left, parent.getPaddingTop(), right,
                parent.getHeight() - parent.getPaddingBottom());
    } else {
        left = 0;
        right = parent.getWidth();
    }

    final int childCount = parent.getChildCount();
    for (int i = 0; i < childCount; i++) {
        final View child = parent.getChildAt(i);
        parent.getDecoratedBoundsWithMargins(child, mBounds);
        final int bottom = mBounds.bottom + Math.round(child.getTranslationY());
        final int top = bottom - mDivider.getIntrinsicHeight();
        mDivider.setBounds(left, top, right, bottom);
        mDivider.draw(canvas);
    }
    canvas.restore();
}
```

#### 吸顶分类 ItemDecoration

```java
public class StarDecoration extends RecyclerView.ItemDecoration {

    private int groupHeaderHeight;
    private int lineHeight;

    private Paint headPaint;
    private Paint textPaint;
    private Paint linePaint;

    private Rect textRect;


    public StarDecoration() {
        groupHeaderHeight = SizeUtils.dp2px(80F);
        lineHeight = SizeUtils.dp2px(10F);

        headPaint = new Paint();
        headPaint.setColor(ResUtils.getColor(R.color.black_30_percent_transparent));

        linePaint = new Paint();
        linePaint.setColor(Color.GREEN);

        textPaint = new Paint();
        textPaint.setTextSize(50);
        textPaint.setColor(Color.WHITE);

        textRect = new Rect();
    }

    @Override
    public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        RecyclerView.Adapter adapter = parent.getAdapter();
        if (adapter instanceof StarAdapter) {
            StarAdapter starAdapter = (StarAdapter) adapter;
            int itemCount = parent.getChildCount(); // 获取的是RecyclerView的子view，不是Adapter.getItemCount，只是当前可见的
            for (int i = 0; i < itemCount; i++) {
                View view = parent.getChildAt(i);

                ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) view.getLayoutParams();
                int left = parent.getPaddingStart() + view.getPaddingStart() + layoutParams.getMarginStart();
                int right = parent.getWidth() - parent.getPaddingEnd() - view.getPaddingEnd() - layoutParams.getMarginEnd();

                int position = parent.getChildAdapterPosition(view);

                // 当前是group，且当前view的top-rv的paddingTop>=0
                if (starAdapter.isGourpHeader(position) && (view.getTop() - parent.getPaddingTop() >= 0)) {
                    c.save();
                    int bottom = view.getTop();
                    int viewTop = view.getTop() - groupHeaderHeight;
                    if (view.getTop() - parent.getPaddingTop() - groupHeaderHeight >= 0) {
                        viewTop = view.getTop() - groupHeaderHeight;
                    } else {
                        c.clipRect(left, parent.getPaddingTop(), right, bottom); // 防止文字绘制到parent的paddingTop
                    }
                    c.drawRect(left, viewTop, right, bottom, headPaint);

                    String groupName = starAdapter.getGroupName(position);
                    textPaint.getTextBounds(groupName, 0, groupName.length(), textRect);
                    int x = left + 20;
                    int y = (view.getTop() - groupHeaderHeight / 2) + textRect.height() / 2;
                    c.drawText(groupName, x, y, textPaint);
                    c.restore();
                } else if (view.getTop() - parent.getPaddingTop() >= 0) {
                    int viewTop;
                    if (view.getTop() - parent.getPaddingTop() - lineHeight >= 0) {
                        viewTop = view.getTop() - lineHeight;
                    } else {
                        viewTop = parent.getPaddingTop();
                    }
                    c.drawRect(left, viewTop, right, view.getTop(), linePaint);
                }
            }
        }
    }

    @Override
    public void onDrawOver(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        RecyclerView.Adapter adapter = parent.getAdapter();
        if (adapter instanceof StarAdapter) {
            StarAdapter starAdapter = (StarAdapter) adapter;
            RecyclerView.LayoutManager layoutManager = parent.getLayoutManager();
            if (layoutManager == null) return;
            // 返回可见区域内的第一个item的position
            int position = ((LinearLayoutManager) layoutManager).findFirstVisibleItemPosition();
            if (position == RecyclerView.NO_POSITION) return;
            RecyclerView.ViewHolder viewHolder = parent.findViewHolderForAdapterPosition(position);
            if (viewHolder == null) return;
            // 获取对应position的View
            View itemView = viewHolder.itemView;
            int left = parent.getPaddingStart();
            int right = parent.getWidth() - parent.getPaddingEnd();
            int top = parent.getPaddingTop();
            boolean isGroupHeader = starAdapter.isGourpHeader(position + 1);
            // 当第二个是组的头部的时候
            if (isGroupHeader) {
                int bottom = Math.min(groupHeaderHeight, itemView.getBottom() - parent.getPaddingTop());
//                int bottom = itemView.getBottom() - parent.getPaddingTop();
                c.drawRect(left, top, right, top + bottom, headPaint);
                String groupName = starAdapter.getGroupName(position);
                textPaint.getTextBounds(groupName, 0, groupName.length(), textRect);
                c.drawText(groupName, left + 20, top + bottom - groupHeaderHeight / 2F + textRect.height() / 2F, textPaint);
            } else {
                c.drawRect(left, top, right, top + groupHeaderHeight, headPaint);
                String groupName = starAdapter.getGroupName(position);
                textPaint.getTextBounds(groupName, 0, groupName.length(), textRect);
                c.drawText(groupName, left + 20, top + groupHeaderHeight / 2F + textRect.height() / 2F, textPaint);
            }
        }
    }


    @Override
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {

        RecyclerView.Adapter adapter = parent.getAdapter();
        if (adapter instanceof StarAdapter) {
            StarAdapter starAdapter = (StarAdapter) adapter;
            int childAdapterPosition = parent.getChildAdapterPosition(view);
            if (starAdapter.isGourpHeader(childAdapterPosition)) { // 分组头，留大一点
                outRect.set(0, groupHeaderHeight, 0, 0);
            } else {
                outRect.set(0, lineHeight, 0, 0);
            }
        }

    }

}
```

效果：<br>![s4dgp](attachments/s4dgp.png)
