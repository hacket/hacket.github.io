---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:28:56 pm
title: RecyclerView基础
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, Google, RecyclerView]
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
date created: 2024-03-19 11:04
date updated: 2024-12-24 00:31
aliases: [RecyclerView 基本使用]
linter-yaml-title-alias: RecyclerView 基本使用
---

# RecyclerView 基本使用

## RecyclerView 类的分工

- RecyclerView.Adapter 处理数据集合并负责绑定视图
- ViewHolder 持有所有的用于绑定数或者需要操作的 View
- LayoutManager 负责摆放视图等相关操作
- ItemDecoration 负责绘制 Item 分割线
- ItemAnimator 为 Item 操作添加动画效果

## 核心类

### RecyclerView.LayoutManager 负责 Item 视图的布局的显示管理

### RecyclerView.ViewHolder 承载 Item 视图的子布局

每个 ViewHolder 的内部是一个 View，并且 ViewHolder 必须继承自 RecyclerView.ViewHolder 类。 这主要是因为 RecyclerView 内部的缓存结构并不是像 ListView 那样去缓存一个 View，而是直接缓存一个 ViewHolder ，在 ViewHolder 的内部又持有了一个 View。既然是缓存一个 ViewHolder，那么当然就必须所有的 ViewHolder 都继承同一个类才能做到了。

### RecyclerView.Adapter 为每一项 Item 创建视图

### RecyclerView.ItemDecoration 给每一项 Item 视图添加子 View,例如可以进行画分隔线之类

ItemDecoration 是为了显示每个 item 之间分隔样式的。它的本质实际上就是一个 Drawable。当 RecyclerView 执行到 onDraw() 方法的时候，就会调用到他的 onDraw()，这时，如果你重写了这个方法，就相当于是直接在 RecyclerView 上画了一个 Drawable 表现的东西。 而最后，在他的内部还有一个叫 getItemOffsets() 的方法，从字面就可以理解，他是用来偏移每个 item 视图的。当我们在每个 item 视图之间强行插入绘画了一段 Drawable，那么如果再照着原本的逻辑去绘 item 视图，就会覆盖掉 Decoration 了，所以需要 `getItemOffsets()` 这个方法，让每个 item 往后面偏移一点，不要覆盖到之前画上的分隔样式了。

### RecyclerView.ItemAnimator 负责处理数据添加或者删除时候的动画效果

每一个 item 在特定情况下都会执行的动画。说是特定情况，其实就是在视图发生改变，我们手动调用 `notifyxxxx()` 的时候。通常这个时候我们会要传一个下标，那么从这个标记开始一直到结束，所有 item 视图都会被执行一次这个动画。

### Recycler

ViewHolder 的回收，获取

## RecyclerView 基本设置

### 布局管理器 LayoutManager

LinearLayoutManager  相当于 ListView<br>GridLayoutManager 相当于 GridView<br>StaggeredGridLayoutManager 瀑布流

```java
//设置布局管理器
mRecyclerView.setLayoutManager(layout);
```

### 设置 Adapter RecyclerView.Adapter

RecyclerView.Adapter

```java
//设置adapter
mRecyclerView.setAdapter(adapter)
```

### 添加间隔 ItemDecoration

RecyclerView.addItemDecoration(ItemDecoration decor)<br><http://blog.piasy.com/2016/03/26/Insight-Android-RecyclerView-ItemDecoration/#section-1><br>见下面的 `ItemDecoration`

### 添加 Item 事件

见 `RecyclerView添加item事件.md`

### 添加多 type

1. 重写 getItemViewType 返回不同 type
2. onCreateViewHolder 根据 viewtype 不同返回不同的 ViewHolder
3. onBindViewHolder 根据不同 viewtype 绑定数据

```java
 public class ButtonHolder extends RecyclerView.ViewHolder {
    public Button button;

    public ButtonHolder(View textview) {
      super(textview);
      this.button = (Button) textview.findViewById(R.id.mybutton);
    }
  }

  @Override
  public int getItemCount() {
    return beans.size();
  }

  /**
   * 获取消息的类型
   */
  @Override
  public int getItemViewType(int position) {
    return beans.get(position).getType();
  }

  /**
   * 创建VIewHolder
   */
  @Override
  public ViewHolder onCreateViewHolder(ViewGroup parent, int viewtype) {
    View v = null;
    ViewHolder holer = null;
    switch (viewtype) {
    case Bean.X_TYPE:
      v = LayoutInflater.from(parent.getContext()).inflate(
          R.layout.recylce_item_x, null);
      holer = new TextHoler(v);
      break;
    case Bean.Y_TYPE:
      v = LayoutInflater.from(parent.getContext()).inflate(
          R.layout.recylce_item_y, null);
      holer = new ButtonHolder(v);
      break;
    case Bean.Z_TYPE:
      v = LayoutInflater.from(parent.getContext()).inflate(
          R.layout.recylce_item_z, null);
      holer = new ImageHoler(v);
      break;
    }

    return holer;
  }

  /**
   * 绑定viewholder
   */
  @Override
  public void onBindViewHolder(ViewHolder holder, int position) {
    switch (getItemViewType(position)) {
    case Bean.X_TYPE:
      TextHoler textholer = (TextHoler) holder;
      textholer.textView.setText(beans.get(position).getText());
      break;
    case Bean.Y_TYPE:
      ButtonHolder buttonHolder = (ButtonHolder) holder;
      buttonHolder.button.setText(beans.get(position).getText());
      break;
    case Bean.Z_TYPE:
      ImageHoler imageHoler = (ImageHoler) holder;
      // imageHoler.Imageview.setImageResource(android.R.drawable.checkbox_on_background);
      break;
    }
  }
}
```

### item change animation ItemAnimator

RecyclerView.setItemAnimator(ItemAnimator animator) |

### RecyclerView 刷新动画屏蔽

RecyclerView 的 notifyItemChanged，notifyItemAdd，notifyItemRemoved 方法会有默认动画。

```
recyclerView.getItemAnimator().setAddDuration(0);
recyclerView.getItemAnimator().setChangeDuration(0);
recyclerView.getItemAnimator().setMoveDuration(0);
recyclerView.getItemAnimator().setRemoveDuration(100);
// recyclerView.getItemAnimator().setSupportsChangeAnimations(false);
```

### GridLayoutManager spanCount/spanSize

- spanCount：在创建 GridLayoutManager 对象的时候构造方法需要传入这个参数，也就是设置每行排列 item 个数。
- spanSize：在 `setSpanSizeLookup()` 方法中，这个方法返回的是当前位置的 item 跨度大小。
- 案例

```java
recyclerView = (RecyclerView) findViewById(R.id.my_rv);
GridLayoutManager manager = new GridLayoutManager(this, 6);
manager.setSpanSizeLookup(new GridLayoutManager.SpanSizeLookup() {
    @Override
    public int getSpanSize(int position) {
        if (position < 7 || position > 14) {
            return 3;
        }
        return 2;
    }
});
recyclerView.setLayoutManager(manager);
adapter = new MyAdapter(this);
recyclerView.setAdapter(adapter);
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688488188990-f9d4d242-6d30-4e6f-84c7-8ee04e48d62e.png#averageHue=%23e3e2ed&clientId=u1a8cb8ea-a7d1-4&from=paste&height=550&id=u0253a157&originHeight=1129&originWidth=1000&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8270bfbd-e7e7-49a9-b18b-299b639f936&title=&width=487)

### RecyclerView 中 scroll 相关 滚动条（垂直和水平）

1. android:scrollbars="vertical" 是否显示滚动条，它的取值可以是 vertical，horizontal 或 none。
2. android:fadeScrollbars="true" 需要 scrollbars 存在的情况下。（默认参数）是在滑块不滚动时，隐藏；在滑块不滚动时，不隐藏
3. android:scrollbarThumbVertical="@drawable/ic_launcher" 自定义滑块的背景图
4. android:scrollbarStyle="insideOverlay"
   - insideOverlay：默认值，表示在 padding 区域内并且覆盖在 view 上
   - insideInset：表示在 padding 区域内并且插入在 view 后面
   - outsideOverlay：表示在 padding 区域外并且覆盖在 view 上
   - outsideInset：表示在 padding 区域外并且插入在 view 后面

### 去掉拖拽反馈 (边缘效应) overScroll

`setOverScrollMode(OVER_SCROLL_NEVER);` 或 xml 设置 `android:overScrollMode="never"`

### RecyclerView fadeEdge 相关

1. android:fadingEdge

> Formats: flags Values: horizontal, none, vertical  This attribute is ignored in API level 14 ({[@link](/link) android.os.Build.VERSION_CODES#ICE_CREAM_SANDWICH}) and higher. Using fading edges may introduce noticeable performance degradations and should be used only when required by the application's visual design. To request fading edges with API level 14 and above, use the `android:requiresFadingEdge` attribute instead.

2. android:requiresFadingEdge<br>拉滚动条时 ，边框渐变的放向,none（边框颜色不变），horizontal（水平方向颜色变淡），vertical（垂直方向颜色变淡）

> 代码设置：setHorizontalFadingEdgeEnabled(boolean); setVerticalFadingEdgeEnabled(boolean)

3. fadingEdgeLength: 设置边框渐变的长度

> 代码设置：setFadingEdgeLength(int)

**效果：**

竖直：<br>![](https://note.youdao.com/yws/res/42532/460FDF5DCCF2413BAD423DEA57AB2EF2#id=yAHdj&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688488221575-41d78cca-1f92-428a-899d-c63133f40484.png#averageHue=%23f8f8f8&clientId=u1a8cb8ea-a7d1-4&from=paste&id=u1aaa9cb2&originHeight=391&originWidth=233&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufeb7ba32-30cb-498f-b3bc-bd480e6485c&title=)

水平：<br>![](https://note.youdao.com/yws/res/42536/8BFF51D75E534A93AE1E02E46A7A216E#id=VA1NV&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688488230244-317c7453-7499-42cb-84ab-114c53cbb917.png#averageHue=%237dc999&clientId=u1a8cb8ea-a7d1-4&from=paste&id=u468b66b1&originHeight=368&originWidth=714&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uce6d0eeb-1cc5-4d02-a545-ace51cf30e2&title=)

#### Fade Edge 注意

1. RecyclerView 没有提供取消顶部或者底部的 fadeEdge 接口。要么都不用，要么都要。
2. 屏蔽阴影，view 提供了上下左右四端的接口（`0.0 (no fade) and 1.0 (full fade)`），设置为 0 就屏蔽了

```kotlin
class CustomFadingEdgeRecyclerView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : RecyclerView(context, attrs, defStyleAttr) {
    private var fadingEdgeGravity = Gravity.NO_GRAVITY // 默认不屏蔽
    fun setFadingEdgeGravity(gravity: Int) {
        fadingEdgeGravity = gravity
    }
    override fun getLeftFadingEdgeStrength(): Float {
        return if (fadingEdgeGravity == Gravity.START) {
            0F
        } else super.getLeftFadingEdgeStrength()
    }
    override fun getRightFadingEdgeStrength(): Float {
        return if (fadingEdgeGravity == Gravity.END) {
            0F
        } else super.getRightFadingEdgeStrength()
    }
    override fun getTopFadingEdgeStrength(): Float {
        return if (fadingEdgeGravity == Gravity.TOP) {
            0F
        } else super.getTopFadingEdgeStrength()
    }
    override fun getBottomFadingEdgeStrength(): Float {
        return if (fadingEdgeGravity == Gravity.BOTTOM) {
            0F
        } else super.getBottomFadingEdgeStrength()
    }
}
```

#### Fade Edge 应用

1. 直播间在线列表边缘<br>![](https://note.youdao.com/yws/res/53186/5E8EEEFDAE12404181ED23DF993932D0#id=cpSVc&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688488238443-a1f66e98-b77b-4045-a9e0-defe9f5f820e.png#averageHue=%232a2a3c&clientId=u1a8cb8ea-a7d1-4&from=paste&id=u95258c6f&originHeight=196&originWidth=1406&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u70331d4f-49c8-4ae5-aa49-4125259c5ae&title=)

### RecyclerView 的 ItemView 需要超出父容器 clipToPadding/clipChildren

```xml
<!--可绘制到padding-->
android:clipToPadding="false"
<!--子View可绘制超出父容器的限制-->
android:clipChildren="false"
```

#### 应用 1：头像框

#### 应用 2：麦位说话波纹

### ViewHolder：position, getLayoutPosition 和 getAdapterPosition

#### onBindViewHolder 中的 position

- onBindViewHolder([@NonNull](/NonNull) final ViewHolder holder, final int position)

1. 这个 position 可以在 onBindViewHolder 方法中用来获取数据，但不要超出该方法<br>![](https://note.youdao.com/yws/res/59481/C73E9E0F16CB4E2FAE38D90806D20FA7#id=EJKDq&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
2. 不要在 OnClickListener 调用<br>![](https://note.youdao.com/yws/res/59487/6AC4731FB71842B4AEE5CEF1BD9ADED2#id=TAZbw&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> 这是因为 RecyclerView 不会像 ListView 一样在 item 的 position 变化时调用 onBindViewHolder，导致 position 是个旧值，不会更新；所以不要在一些 later 操作中使用 position（如 click），用 `getAdapterPosition()` 替代。

notifyItemInserted(position) 只会调用 position 的 onBindViewHolder，其他 item 项不会调用，onBindViewHolder 参数的 position 就会是旧的值，有问题；notifyDataSetChanged 可见的 item 都会调用 onBindViewHolder，不会有问题

```
Why? because if you deleted/added/changed any item in the data set and notified the RecyclerView Using notifyItem*(), RecyclerView will not call onBindViewHolder method and update all item’s positions, It will only update the position of the new ones for the new calls of onBindViewHolder and this will cause inconsistency between displayed items and position value.

Imagine that we have a RecyclerView that will display 10 items so it will create 10 items and call onBindView for those 10 items and pass the positions from 0 to 9, so if you fixed the position by using it to handle user clicks and later you added an item at position 0 and notified the data set that you inserted a new item by notifyItemInserted() the RecyclerView will create a new item with position 0 and pass it to the layout but the pre created ones still have the old positions and if you logged those positions you will have 00123…9 which is not true it should be 0123…10. Here come the power of holder.getAdapterPosition().

notice that i used getAdapterPosition to bind data and used getLayoutPosition to tell the user the position of the pressed item.
```

#### ViewHolder.getLayoutPosition()

同之前的 `getPosition()`，返回布局中最新的计算位置，和用户所见到的位置一致，当做用户输入（例如点击事件）的时候考虑使用

#### ViewHolder.getAdapterPosition()

返回数据在 Adapter 中的位置（也许位置的变化还未来得及刷新到布局中），当使用 Adapter 的时候（例如调用 Adapter 的 notify 相关方法时）考虑使用；可能返回 -1(如果调用的是 notifyDataSetChanged()，因为要重新绘制所有 Item，所以在绘制完成之前 RecyclerView 是不知道 adapterPosition 的，这时会返回 -1（NO_POSITION）)

**getAdapterPosition() 返回 -1 导致的数组越界问题**

```kotlin
override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TestVH {
    val vh = TestVH(mInflater.inflate(R.layout.item_test_common_recyclerview, parent, false))
    vh.itemView.setOnClickListener {
        notifyDataSetChanged(); //增加这行代码
        val pos = vh.getAdapterPosition() // 返回-1
        val item = this.data!!.get(pos)
        Log.d("hacket", "PositionTestAdapter itemView click pos =$pos item =$item")
    }
    return vh
}
```

#### 应用场景区分

> getLayoutPosition 和 getAdapterPosition 具体区别就是 adapter 和 layout 的位置会有时间差 (<16ms), 如果你改变了 Adapter 的数据然后刷新视图, layout 需要过一段时间才会更新视图, 在这段时间里面, 这两个方法返回的 position 会不一样。getAdapterPosition() 是提供数据在刷新的时候提供一个 -1 的返回值，来告知视图其实正在重新绘制；getLayoutPosition() 更加简单暴力，你点击不会告诉你数据是否正在刷新，始终会返回一个位置值。这个位置值有可能是之前的视图 item 位置，也有可能是刷新视图后的 item 位置。

1. position 用在 onBindViewHolder 方法内，不要用在 Listener 中；notifyItemXXX 有问题，notifyDataSetChanged 没问题
2. getLayoutPosition 更适合在短时间内数据变动少，View 刷新不频繁的情况下使用，或者是固定列表数据，一切简单化没这么复杂。应用 swipe/dismiss 做 item 动画用
3. getAdapterPosition 更适合在频繁变动数据的情况下使用，指那种数据刷新极快而且是连续刷新的情况下使用，-1 的无位置的返回值告诉你视图正在变化，你需要判断是否执行这次点击；notifyDataSetChanged 未完成时返回的是 -1

- [x] [Difference between position getAdapterPosition(), and getLayoutPosition() in RecyclerView.](https://proandroiddev.com/difference-between-position-getadapterposition-and-getlayoutposition-in-recyclerview-80279a2711d1)

### 吸顶

#### RecyclerViewExtensions

<https://github.com/Doist/RecyclerViewExtensions>

#### 自定义 ItemDecoration

## ItemDecoration

### DividerItemDecoration

#### DividerItemDecoration 系统提供默认

1. 只用于 LinearLayoutManager 的 divider
2. 如果需要全局修改 divider，在 theme 定义 `android:listDivider` 属性

```xml
<style name="AppTheme.Base.ListDivider">
<item name="android:listDivider">@drawable/inset_recyclerview_divider</item>
</style>
```

3. DividerItemDecoration 默认的 drawable 是个 width/height 为 4 的 GradientDrawable

#### DividerItemDecoration 案例

1. 默认

```
rv_content_list.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489360685-91428fdb-aa18-4737-b401-ee244f7e8e9c.png#averageHue=%235bcf94&clientId=u836cc140-b75b-4&from=paste&height=347&id=uae12a7d3&originHeight=1242&originWidth=1471&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=283292&status=done&style=none&taskId=uf0adf819-2c94-485d-a344-ffdb4df1b26&title=&width=411)

2. 默认设置 them: android:listDivider

```xml
<item name="android:listDivider">@drawable/inset_recyclerview_divider</item>
rv_content_list.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
```

3. 渐变

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

![](https://note.youdao.com/src/D1A128C70EE24A8CBEA10D520316BAF6#id=Gu33l&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

4. 代码设置

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

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489398080-678c75f7-0e66-4e6c-a79c-177ab1af742f.png#averageHue=%2356ca8b&clientId=u836cc140-b75b-4&from=paste&height=580&id=u47488201&originHeight=1059&originWidth=496&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=119411&status=done&style=none&taskId=uc25829cf-e744-4564-8f18-8ee4445dfb3&title=&width=271.66668701171875)

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

- outRect 当前 itemView 距离上下左右的边距<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489502716-c6ea5529-bacc-4a9b-912b-bfc179858ec0.png#averageHue=%23dfdfdb&clientId=u836cc140-b75b-4&from=paste&id=u68f7d390&originHeight=1136&originWidth=2108&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub148a905-c14f-46d3-befc-f2acac02a0d&title=)
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

效果：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688489540198-8f302a66-df58-4d0a-b342-aed8bb5b86ff.png#averageHue=%232fd047&clientId=u836cc140-b75b-4&from=paste&height=913&id=u08addbe7&originHeight=2400&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u165da14b-c01a-4f23-9066-ae3dc02c175&title=&width=411)

## ItemTouchHelper 处理 item 拖拽，事件相关的

托管:<br><https://github.com/hacket/DragRecyclerView>

### RecyclerView 事件处理

#### onInterceptTouchEvent 拦截事件

```java
// RecyclerView androidx1.0.0
@Override
public boolean onInterceptTouchEvent(MotionEvent e) {

    if (dispatchOnItemTouchIntercept(e)) {  // 当前item是否拦截事件
        cancelTouch();
        return true;
    }

    if (mLayout == null) { // LayoutManager为null，不拦截事件
        return false;
    }

    final boolean canScrollHorizontally = mLayout.canScrollHorizontally(); // LayoutManager是否能横向滑动，默认false
    final boolean canScrollVertically = mLayout.canScrollVertically(); // LayoutManager是否能纵向滑动，默认false
    
    final int action = e.getActionMasked();
    final int actionIndex = e.getActionIndex();
    switch (action) {
        case MotionEvent.ACTION_DOWN:
            // DOWN事件，记录x和y坐标
            mInitialTouchX = mLastTouchX = (int) (e.getX() + 0.5f);
            mInitialTouchY = mLastTouchY = (int) (e.getY() + 0.5f);

            if (mScrollState == SCROLL_STATE_SETTLING) {
                getParent().requestDisallowInterceptTouchEvent(true); 
                setScrollState(SCROLL_STATE_DRAGGING);
            }   
            // ...
            break;
        case MotionEvent.ACTION_POINTER_DOWN:
            mScrollPointerId = e.getPointerId(actionIndex);
            mInitialTouchX = mLastTouchX = (int) (e.getX(actionIndex) + 0.5f);
            mInitialTouchY = mLastTouchY = (int) (e.getY(actionIndex) + 0.5f);
            break;
        case MotionEvent.ACTION_MOVE: {   
            final int x = (int) (e.getX(index) + 0.5f);
            final int y = (int) (e.getY(index) + 0.5f);
            if (mScrollState != SCROLL_STATE_DRAGGING) { // 没有drag
                final int dx = x - mInitialTouchX;
                final int dy = y - mInitialTouchY;
                boolean startScroll = false; // 开始滑动标记
                if (canScrollHorizontally && Math.abs(dx) > mTouchSlop) { // 能x轴滑动且x轴滑动值大于mTouchSlop
                    mLastTouchX = x;
                    startScroll = true;
                }
                if (canScrollVertically && Math.abs(dy) > mTouchSlop) { // 能y轴滑动且y轴滑动值大于mTouchSlop
                    mLastTouchY = y;
                    startScroll = true;
                }
                if (startScroll) { // 如果已经开始滑动了，设置滚动状态为SCROLL_STATE_DRAGGING
                    setScrollState(SCROLL_STATE_DRAGGING);
                }
            }
            break;
        } 
        // ...
    return mScrollState == SCROLL_STATE_DRAGGING; // 如果滚动状态为SCROLL_STATE_DRAGGING，那么拦截事件
}

private boolean dispatchOnItemTouchIntercept(MotionEvent e) {
    final int action = e.getAction();
    if (action == MotionEvent.ACTION_CANCEL || action == MotionEvent.ACTION_DOWN) {
        mActiveOnItemTouchListener = null;
    }

    final int listenerCount = mOnItemTouchListeners.size();
    for (int i = 0; i < listenerCount; i++) {
        final OnItemTouchListener listener = mOnItemTouchListeners.get(i);
        if (listener.onInterceptTouchEvent(this, e) && action != MotionEvent.ACTION_CANCEL) {
            mActiveOnItemTouchListener = listener;
            return true; // OnItemTouchListener#onInterceptTouchEvent返回了true
        }
    }
    return false;
}
```

1. 首先交给 OnItemTouchListener 来处理，通过 addOnItemTouchListener 来添加 OnItemTouchListener；如果 onInterceptTouchEvent 返回了 true 表示当前 item 拦截了事件处理，直接 return
2. down 记录坐标，move 时，判断在对应方向能否滑动且滑动值大于 mTouchSlop，那么拦截事件
3. 可以看到 RecyclerView 没有对 x 和 y 轴做方向角的判断，如果垂直 rv 嵌套了一个水平 rv，在水平 rv 斜着滑动时，当 dy 大于 mTouchSlop 时，外侧垂直 rv 会拦截了事件，导致内侧水平 rv 滑动不了，出现了事件冲突了

#### onTouchEvent 处理事件

```java
@Override
public boolean onTouchEvent(MotionEvent e) {
    if (dispatchOnItemTouch(e)) { // Item拦截了事件，交给item处理
        cancelTouch();
        return true;
    }
    case MotionEvent.ACTION_MOVE: {
        if (mScrollState == SCROLL_STATE_DRAGGING) {
            mLastTouchX = x - mScrollOffset[0];
            mLastTouchY = y - mScrollOffset[1];

            if (scrollByInternal(
                    canScrollHorizontally ? dx : 0,
                    canScrollVertically ? dy : 0,
                    vtev)) { // 开始滑动
                getParent().requestDisallowInterceptTouchEvent(true); // 请求父类不要拦截事件
            }
            if (mGapWorker != null && (dx != 0 || dy != 0)) {
                mGapWorker.postFromTraversal(this, dx, dy);
            }
        }
    }
}
```

1. 如果 Item 拦截了事件，那么交给 Itme 来处理事件
2. 调用 scrollByInternal 开始滑动

### 1、`ItemTouchHelper`

ItemTouchHelper 是一个强大的工具，它处理好了关于在 RecyclerView 上添加拖动排序与滑动删除的所有事情。它是 [RecyclerView.ItemDecoration](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.ItemDecoration.html) 的子类，也就是说它可以轻易的添加到几乎所有的 LayoutManager 和 Adapter 中。它还可以和现有的 item 动画一起工作，提供受类型限制的拖放动画等等。(add swipe to dismiss and drag & drop support to RecyclerView)

1. ItemTouchHelper(ItemTouchHelper.Callback callback)
2. void attachToRecyclerView(RecyclerView recyclerView) 依附 RecyclerView
3. startDrag(ViewHolder viewHolder)  开始一个拖动
4. startSwipe(ViewHolder viewHolder)  开始滑动操作

### 2、`ItemTouchHelper.Callback`

监听 "move" 与 "swipe" 事件。这里还是控制 view 被选中的状态以及重写默认动画的地方。如果你只是想要一个基本的实现，有一个帮助类可以使用：[SimpleCallback](https://developer.android.com/reference/android/support/v7/widget/helper/ItemTouchHelper.SimpleCallback.html),但是为了了解其工作机制，我们还是自己实现。

1. int getMovementFlags(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder)<br>ItemTouchHelper 可以让你轻易得到一个事件的方向。你需要重写 getMovementFlags() 方法来指定可以支持的拖放和滑动的方向；使用 helperItemTouchHelper.makeMovementFlags(int, int) 来构造返回的 flag。这里我们启用了上下左右两种方向。注：上下为拖动（drag），左右为滑动（swipe）。

```java
@Override
public int getMovementFlags(RecyclerView recyclerView, 
       RecyclerView.ViewHolder viewHolder) {
   int dragFlags = ItemTouchHelper.UP | ItemTouchHelper.DOWN;
   int swipeFlags = ItemTouchHelper.START | ItemTouchHelper.END;
   return makeMovementFlags(dragFlags, swipeFlags);
}
```

2. boolean onMove(RecyclerView recyclerView, RecyclerView.ViewHolder srcViewHolder,RecyclerView.ViewHolder targetViewHolder)  拖拽 drap 和 drop 调用，返回 true/false 来控制是否拖拽
3. void onSwiped(RecyclerView.ViewHolder viewHolder, int direction)  滑动 swipe 调用，同 onMove()
4. boolean isLongPressDragEnabled()<br>支持长按 RecyclerView item 进入拖动操作，你必须在 isLongPressDragEnabled() 方法中返回 true
5. boolean isItemViewSwipeEnabled()<br>在 view 任意位置触摸事件发生时启用滑动操作，则直接在 sItemViewSwipeEnabled() 中返回 true
6. void onSelectedChanged(RecyclerView.ViewHolder viewHolder, int actionState) 在每次 View Holder 的状态变成拖拽 (ACTION_STATE_DRAG) 或者 滑动 (ACTION_STATE_SWIPE) 的时候被调用。这是把你的 item view 变成激活状态的最佳地点
7. void clearView(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder) 在一个 view 被拖拽然后被放开的时候被调用，同时也会在滑动被取消或者完成 ACTION_STATE_IDLE) 的时候被调用。这里是恢复 item view idle 状态的典型地方。

### 3、在 ItemTouchHelperCallBack 回调 Adapter 实现在 onMoved() 和 onSwiped() 实现界面更新

ItemTouchHelper.Callback 调用<br>RecyclerView.Adapter 实现

```java
// 拖拽的时候回调
@Override
public boolean onMove(RecyclerView recyclerView, RecyclerView.ViewHolder srcViewHolder,
                      RecyclerView.ViewHolder targetViewHolder) {
    // 类型不一样不能交换
    if (srcViewHolder.getItemViewType() != targetViewHolder.getItemViewType()) {
        return false;
    }

    if (mOnItemTouchHelperAdapterCallback != null) {
        mOnItemTouchHelperAdapterCallback
                .onItemMove(srcViewHolder.getAdapterPosition(), targetViewHolder.getAdapterPosition());
    }

    return true;
}

@Override
public void onSwiped(RecyclerView.ViewHolder viewHolder, int direction) {
    if (mOnItemTouchHelperAdapterCallback != null) {
        // 回调适配器里面的方法，让其刷新数据及界面
        mOnItemTouchHelperAdapterCallback.onItemDismiss(viewHolder.getAdapterPosition());
    }
}
```

### 4、拖拽时，不同的类型不能交换，达到一种固定的效果

```java
@Override
public boolean onMove(RecyclerView recyclerView, RecyclerView.ViewHolder srcViewHolder,
                      RecyclerView.ViewHolder targetViewHolder) {
    // 类型不一样不能交换
    if (srcViewHolder.getItemViewType() != targetViewHolder.getItemViewType()) {
        return false;
    }
   // ...
    return true;
}
```

### 5、提示被选中的 View

ItemTouchHelper.Callback 回调<br>RecyclerView.ViewHolder 实现

```java
@Override
public void clearView(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder) {
    super.clearView(recyclerView, viewHolder);
}

@Override
public void onChildDraw(Canvas c, RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, float dX, float dY,
                        int actionState, boolean isCurrentlyActive) {
    super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
}
```

### 6、自定义滑动动画

void onChildDraw(Canvas c, RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, float dX, float dY,<br>int actionState, boolean isCurrentlyActive)

dX 与 dY 参数代表目前被选择 view 的移动距离

```java
@Override
public void onChildDraw(Canvas c, RecyclerView recyclerView, 
        ViewHolder viewHolder, float dX, float dY, 
        int actionState, boolean isCurrentlyActive) {
 
    if (actionState == ItemTouchHelper.ACTION_STATE_SWIPE) {
        float width = (float) viewHolder.itemView.getWidth();
        float alpha = 1.0f - Math.abs(dX) / width;
        viewHolder.itemView.setAlpha(alpha);
        viewHolder.itemView.setTranslationX(dX);    
    } else {
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, 
                actionState, isCurrentlyActive);
    }
}
```

- [ ] [RecyclerView的拖动和滑动 第二部分 ：拖块，Grid以及自定义动画](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0724/3219.html)

## RecyclerView 添加 item 事件

### Adapter#onCreateViewHolder 添加

### Adapter#onBindViewHolder 添加

在 RecyclerView.Adapter 的 onBindViewHolder(RecyclerViewHolder holder, int position) 获取 ViewHoler.itemView 添加 Listener

1. 简单易懂，但缺点是点击事件的接口经过多方传递
2. 内存中会多出 N 个 OnClickListener 对象（N 为一屏的表项个数）。虽然这也不是一个很大的开销。而且 onBindViewHolder() 会在列表滚动时多次触发，导致会为同一个表项无谓地多次设置点击监听器。
3. 在 onBindViewHolder() 中设置点击监听器还会导致 bug，因为 " 快照机制 "，作为参数传入 onItemClick() 的索引值是在调用 onBindViewHolder() 那一刻生成的快照，如果数据发生增删，但因为各种原因没有及时刷新对应位置的视图（onBindViewHolder() 没有被再次调用），此时发生的点击事件拿到的索引就是错的。

#### 方式 1 RecyclerView.Adapter 持有 Listener

```java
public class SearchSugAdapter extends RecyclerView.Adapter<BaseSugHolder> {

    private Context mContext;
    private List<Sug> mSugs;

    private OnItemLongClickListener mOnItemLongClickListener;
    private OnItemClickListener mOnItemClickListener;
    private OnItemTouchListener mOnItemTouchListener;

    public SearchSugAdapter(@NonNull Context context, List<Sug> sugs) {
        this.mContext = context;
        this.mSugs = sugs;

        if (sugs == null) {
            mSugs = new ArrayList<>();
        }
    }

    @Override
    public int getItemViewType(int position) {
        return mSugs.get(position).sugType;
    }

    @Override
    public int getItemCount() {
        return mSugs.size();
    }

    @Override
    public BaseSugHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        BaseSugHolder viewHolder = null;
        switch (viewType) {
            case Sug.ITEM_SUG_TYPE_SITE:
            case Sug.ITEM_SUG_TYPE_WORD:
                viewHolder = new SugNormalHolder(
                        LayoutInflater.from(mContext).inflate(R.layout.list_item_search_sug_normal, parent, false));
                break;
            case Sug.ITEM_SUG_TYPE_FOOTER:
                viewHolder = new SugFooterHolder(
                        LayoutInflater.from(mContext)
                                .inflate(R.layout.list_item_search_sug_footer_clear, parent, false));
                break;
            default:
                break;
        }
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(final BaseSugHolder viewHolder, int position) {
        Sug sug = mSugs.get(position);
        if (sug != null) {
            viewHolder.bindData(mContext, sug);
            bindViewHolderListener(viewHolder, sug);
        }
    }

    private void bindViewHolderListener(final BaseSugHolder holder, final Sug sug) {
        if (mOnItemTouchListener != null) {
            holder.itemView.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    return mOnItemTouchListener.onItemTouch(holder, event);
                }
            });
        }
        if (mOnItemClickListener != null) {
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mOnItemClickListener.onItemClick(holder, sug);
                }
            });
        }
        if (mOnItemLongClickListener != null) {
            holder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    return mOnItemLongClickListener.onItemLongClick(holder, sug);
                }
            });
        }
    }

    public interface OnItemTouchListener {
        boolean onItemTouch(RecyclerView.ViewHolder viewHolder, MotionEvent event);
    }

    public interface OnItemClickListener {
        void onItemClick(RecyclerView.ViewHolder viewHolder, Sug sug);
    }

    public interface OnItemLongClickListener {
        boolean onItemLongClick(RecyclerView.ViewHolder viewHolder,  Sug sug);
    }

    public void setOnItemTouchListener(OnItemTouchListener onItemTouchListener) {
        this.mOnItemTouchListener = onItemTouchListener;
    }

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.mOnItemClickListener = onItemClickListener;
    }

    public void setOnItemLongClickListener(OnItemLongClickListener onItemClickLongListener) {
        this.mOnItemLongClickListener = onItemClickLongListener;
    }

}
```

#### 方式 2：ViewHolder 持有 Listener

```java

@Override
public void onBindViewHolder(RecyclerViewHolder holder, int position) {
    //...
    bindViewHolderListener(holder, position);

    //...
}

 private void bindViewHolderListener(final RecyclerViewHolder holder, int position) {
    Log.d("hacket", "bindViewHolderListener: " + holder.getAdapterPosition());

    holder.itemView.setTag(mSiteModels.get(position));

    if (mOnItemTouchListener != null) {
        holder.itemView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                return mOnItemTouchListener.onItemTouch(holder, event);
            }
        });
    }

    if (mOnItemClickListener != null) {
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mOnItemClickListener.onItemClick(holder, holder.itemView.getTag());
            }
        });
    }

    if (mOnItemLongClickListener != null) {
        holder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                return mOnItemLongClickListener.onItemLongClick(holder, holder.itemView.getTag());
            }
        });
    }
}

public interface OnItemTouchListener {
    boolean onItemTouch(RecyclerView.ViewHolder viewHolder, MotionEvent event);
}

public interface OnItemClickListener {
    void onItemClick(RecyclerView.ViewHolder viewHolder, Object obj);
}

public interface OnItemLongClickListener {
    boolean onItemLongClick(/*RecyclerView recyclerView, */RecyclerView.ViewHolder viewHolder, Object obj);
}

public void setOnItemTouchListener(OnItemTouchListener onItemTouchListener) {
    this.mOnItemTouchListener = onItemTouchListener;
}

public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
    this.mOnItemClickListener = onItemClickListener;
}

public void setOnItemLongClickListener(OnItemLongClickListener onItemClickLongListener) {
    this.mOnItemLongClickListener = onItemClickLongListener;
}
```

### RecyclerView 上设置 Listener(类似 ListView)

```kotlin
fun RecyclerView.setOnItemClickListener(listener: (View, Int) -> Unit) {

    addOnItemTouchListener(object : RecyclerView.OnItemTouchListener {

        // '构造手势探测器，用于解析单击事件'
        val gestureDetector = GestureDetector(context, object : GestureDetector.OnGestureListener {
            override fun onShowPress(e: MotionEvent?) {
            }

            override fun onSingleTapUp(e: MotionEvent?): Boolean {
                //'当单击事件发生时，寻找单击坐标下的子控件，并回调监听器'
                e?.let {
                    findChildViewUnder(it.x, it.y)?.let { child ->
                        listener(child, getChildAdapterPosition(child))
                    }
                }
                return false
            }

            override fun onDown(e: MotionEvent?): Boolean {
                return false
            }

            override fun onFling(e1: MotionEvent?, e2: MotionEvent?, velocityX: Float, velocityY: Float): Boolean {
                return false
            }

            override fun onScroll(e1: MotionEvent?, e2: MotionEvent?, distanceX: Float, distanceY: Float): Boolean {
                return false
            }

            override fun onLongPress(e: MotionEvent?) {
            }
        })

        override fun onTouchEvent(rv: RecyclerView, e: MotionEvent) {

        }

        //'在拦截触摸事件时，解析触摸事件'
        override fun onInterceptTouchEvent(rv: RecyclerView, e: MotionEvent): Boolean {
            gestureDetector.onTouchEvent(e)
            return false
        }

        override fun onRequestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
        }

    })
}
```

## 有用的方法

### scrollToPosition 和 smoothScrollToPosition 区别

1. scrollToPosition 直接滚动到指定 position，smoothScrollToPosition 平滑滚动到指定位置
2. 超过 adapter 的 position，scrollToPosition 没有反应，smoothScrollToPosition 滚动到最后
3. scrollToPosition 对 SnapHelper 无效？<https://stackoverflow.com/questions/41280176/recyclerview-with-snaphelper-item-is-not-snapped-after-scrolltoposition>

> SnapHelper rely on RecyclerView.OnFlingListener#onFling() or RecyclerView.OnScrollListener#onScrollStateChanged(recyclerView, RecyclerView.SCROLL_STATE_IDLE) to trigger snap action.<br>But scrollToPosition() will not trigger above callback. You can invoke smoothScrollBy(1, 0) after scrollToPosition() to trigger SnapHelper to scroll.

### View findChildViewUnder(float x, float y)

- public View findChildViewUnder(float x, float y) 根据坐标获取 RV 中对应的 View

### int getChildAdapterPosition([@NonNull](/NonNull) View child)

- int getChildAdapterPosition([@NonNull](/NonNull) View child) 获取 adapter position 根据 view

### RecyclerView#Adapter.registerAdapterDataObserver([@NonNull](/NonNull) AdapterDataObserver) 监听 item 的各种操作情况

## RecyclerView 实现瀑布流

### RecyclerView 瀑布流位置变化和顶部留白

- 位置发生变化 (item 乱跳问题、StaggeredGridLayoutManager 设置空隙处理方式为 不处理。)

```
layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
```

- 顶部留白（滑动空白的问题）<br>设置了 StaggeredGridLayoutManager 不处理空白之后，发现反复滑动列表时，顶部 item 上边会出现空白

```
mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
  @Override
  public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
    super.onScrollStateChanged(recyclerView, newState);
    //防止第一行到顶部有空白区域
    layoutManager.invalidateSpanAssignments();
  }
});
```

这个方法会重绘视图，在 scroll 中调用会显得非常频繁，然后引起界面卡顿，滑动不流畅等问题。

### RecyclerView 设置 item 间隔问题

- 刷新后 item 会不整齐

```
recyclerView.setItemAnimator(null); // item左右动
// 设置item是否固定，不会被adapter中item内容所影响。
recyclerView.setHasFixedSize(true);
```

- 用开源库 BaseRecyclerViewAdapterHelper，下拉刷新时，会出现第一个 item 下沉了一部分，刷新后又可以了，<br>解决：<br>SpaceItemDecoration 设置顶部，如果不设置顶部，会出现这个问题

- [ ] RecyclerView 实现瀑布流的各种坑<br><https://www.jianshu.com/p/b0f80b1c29d0>

# RecyclerView 滑动滚动 (onScroll、onFling)

## RecyclerView 滚动相关方法

### LayoutManager#canScrollVertically/LayoutManager#canScrollHorizontally

- boolean canScrollVertically() 是否能纵向滑动
- boolean canScrollHorizontally() 是否能横向滑动

### LayoutManager#offsetChildrenVertical/LayoutManager#offsetChildrenHorizontal

#### void offsetChildrenVertical(@Px int dy) 上下滚动所有子 view

```java
// RecyclerView androidx1.1.0
public void offsetChildrenVertical(@Px int dy) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetTopAndBottom(dy);
    }
}
```

#### void offsetChildrenHorizontal(@Px int dx) 左右滚动所有子 view

```java
// RecyclerView androidx1.1.0
public void offsetChildrenHorizontal(@Px int dx) {
    final int childCount = mChildHelper.getChildCount();
    for (int i = 0; i < childCount; i++) {
        mChildHelper.getChildAt(i).offsetLeftAndRight(dx);
    }
}
```

### scrollVerticallyBy/scrollHorizontallyBy

#### dx/dy 怎么来的？

```java
// RecyclerView
private int mInitialTouchX;
private int mInitialTouchY;
private int mLastTouchX;
private int mLastTouchY;
public boolean onTouchEvent(MotionEvent e) {
    switch (action) {
        case MotionEvent.ACTION_DOWN: {
            mInitialTouchX = mLastTouchX = (int) (e.getX() + 0.5f);
            mInitialTouchY = mLastTouchY = (int) (e.getY() + 0.5f);  
        }
        case MotionEvent.ACTION_MOVE: {
            final int x = (int) (e.getX(index) + 0.5f);
            final int y = (int) (e.getY(index) + 0.5f);
            int dx = mLastTouchX - x;
            int dy = mLastTouchY - y;
        }
    }
}
```

可以看到，dx 和 dy 代表的是起始触摸点减去移动的触摸点：

1. dy 手指从上往下滑动 dy 为负数；从下往上 dy 为正数
2. dx 手指从左到右滑动 dx 为负数；从右往左 dy 为正数
3. 如果需要配合 offsetChildrenVertical 或 offsetChildrenHorizontal，需要传递 -dx 或 -dy

```java
// 平移容器内的item，向上滑动，dy>0，减去偏移值；向下滑动，dy<0，加上偏移值
offsetChildrenVertical(-travel)
```

#### scrollVerticallyBy 和 scrollHorizontallyBy

##### 触摸路径

```
// RecyclerView
onTouchEvent#MOVE → 
boolean scrollByInternal(int x, int y, MotionEvent ev) → 
void scrollStep(int dx, int dy, @Nullable int[] consumed) → 
LayoutManager#int scrollHorizontallyBy(int dx, Recycler recycler, State state)/scrollVerticallyBy
```

##### int scrollVerticallyBy(int dy, Recycler recycler, State state) 竖直方向滚动距离

##### int scrollHorizontallyBy(int dx, Recycler recycler, State state) 水平方向滚动距离

## 滑动

### RecyclerView.OnScrollListener

1. onScrollStateChanged(recyclerView: RecyclerView, newState: Int)<br>RecyclerVier 一共有三种描述滚动的状态：`SCROLL_STATE_IDLE`、`SCROLL_STATE_DRAGGING`、`SCROLL_STATE_SETTLING`
   - SCROLL_STATE_IDLE 滚动闲置状态，此时并没有手指滑动或者动画执行
   - SCROLL_STATE_DRAGGING 滚动拖拽状态，由于用户触摸屏幕产生
   - SCROLL_STATE_SETTLING 自动滚动状态，此时没有手指触摸，一般是由动画执行滚动到最终位置，包括 smoothScrollTo 等方法的调用

> 想监听状态的改变，调用 addOnScrollListener 方法，重写 OnScrollListener 的回调方法即可，注意 OnScrollListener 提供的回调数据并不如 ViewPager 那样详细，甚至是一种缺陷，这在 ViewPager2 中 ScrollEventAdapter 类有详细的适配方法

2. onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int)<br>已经滚动

> This callback will also be called if visible item range changes after a layout calculation. In that case, dx and dy will be 0.

```kotlin
rv_content_list.addOnScrollListener(object : RecyclerView.OnScrollListener() {
        override fun onScrollStateChanged(recyclerView: RecyclerView, newState: Int) {
            super.onScrollStateChanged(recyclerView, newState)
        }

        override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
            super.onScrolled(recyclerView, dx, dy)
        }
    })
```

### OnFlingListener(fling 行为监听)

设置 OnFlingListener，替换默认 fling 行为。<br>自然滚动行为底层的要点是处理 fling 行为，fling 是 Android View 中惯性滚动的代言词，分析代码如下：

```java
public boolean fling(int velocityX, int velocityY) {
    if (mLayout == null) {
        Log.e(TAG, "Cannot fling without a LayoutManager set. " +
                "Call setLayoutManager with a non-null argument.");
        return false;
    }
    if (mLayoutFrozen) {
        return false;
    }
    final boolean canScrollHorizontal = mLayout.canScrollHorizontally();
    final boolean canScrollVertical = mLayout.canScrollVertically();
    if (!canScrollHorizontal || Math.abs(velocityX) < mMinFlingVelocity) {
        velocityX = 0;
    }
    if (!canScrollVertical || Math.abs(velocityY) < mMinFlingVelocity) {
        velocityY = 0;
    }
    if (velocityX == 0 && velocityY == 0) {
        // If we don't have any velocity, return false
        return false;
    }
    //处理嵌套滚动PreFling
    if (!dispatchNestedPreFling(velocityX, velocityY)) {
        final boolean canScroll = canScrollHorizontal || canScrollVertical;
        //处理嵌套滚动Fling
        dispatchNestedFling(velocityX, velocityY, canScroll);
        //优先判断mOnFlingListener的逻辑
        if (mOnFlingListener != null && mOnFlingListener.onFling(velocityX, velocityY)) {
            return true;
        }

        if (canScroll) {
            velocityX = Math.max(-mMaxFlingVelocity, Math.min(velocityX, mMaxFlingVelocity));
            velocityY = Math.max(-mMaxFlingVelocity, Math.min(velocityY, mMaxFlingVelocity));
            //默认的Fling操作
            mViewFlinger.fling(velocityX, velocityY);
            return true;
        }
    }
    return false;
}
```

在 RecyclerView 中 fling 行为流程图如下：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688488719955-53e8ee8e-03ec-425b-8848-585971ab38b3.png#averageHue=%23f7f7f7&clientId=u1a8cb8ea-a7d1-4&from=paste&height=441&id=uc0d3830e&originHeight=661&originWidth=718&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=57661&status=done&style=none&taskId=uee0953e4-8f44-41ec-a5ea-c79125029fb&title=&width=478.6666666666667)

# ![](http://note.youdao.com/yws/res/41063/0F40B18CA63D469C90FACA572527857C#id=CoMia&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)AndroidFastScroll

<https://github.com/zhanghai/AndroidFastScroll>

# RecyclerView 坑集锦

## 滑动相关

### 横向 ViewPager 与内嵌横向 RecyclerView 之间的滑动冲突 (取消内嵌 RecyclerView 到边滑动到 ViewPager)

**场景：** 很多页面使用 ViewPager+ TabLayout（如首页、详情页、搜索结果页等），而对应页面很多时候会嵌套一个横向 RecycleView，用来展现更多的信息

- 默认是作为 ViewPager 子 View 的 RecyclerView 在滑到最后一个或第一个 ItemView 到导致 ViewPager 滑动

**分析：**<br>作为子 View 的 RecyclerView 在滑到最后一个或第一个 ItemView 到导致 ViewPager 滑动，这一定是 ViewPager 在此刻对滑动事件进行了拦截，解决的最简单办法就是不让 ViewPager 拦截横向 RecyclerView 的滑动事件（即 ViewPager::onInterceptTouchEvent 方法返回 false），ViewPager::onInterceptTouchEvent 中的 Move 事件如下：<br>![](http://note.youdao.com/yws/res/45262/0AE2164432DE4188BCDA1A8CE4B8AE3D#id=yjRP1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688490805264-c81d4996-65d2-4284-9cd9-087ce3fd4a44.png#averageHue=%232a2a25&clientId=u327fc544-fac9-4&from=paste&id=u78586096&originHeight=408&originWidth=684&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u799a1eae-508f-460e-9d36-80b530bd2ec&title=)<br>**解决：** RecyclerView 在滑到最后一个或第一个 ItemView 到不让 ViewPager 滑动<br>目前，有以下两种方式使 ViewPager 不去拦截横向 RecyclerView 滑动事件:

1. 在 RecyclerView 对应滑动事件分发中调用 `getParent().requestDisallowInterceptTouchEvent(true);` 阻止 ViewPager 对其 MOVE 或者 UP 事件进行拦截，但是考虑的因素比较多，而且效果不是太好，故放弃这种方式。
2. 修改某些方法，进入到上图 if 判断中 : 在滑动横向 RecyclerView 到两端时，dx != 0 && !isGutterDrag(mLastMotionX, dx) 肯定满足条件，那说明 canScroll() （用来判断一个 View 以及它的子 View 是否可以滑动）一定返回了 false， 复写 canScroll() 方法，打 log，发现返回果然为 false，验证了自己的判断。

解决办法：复写 canScroll，当 View 是横向 RecyclerView（LinearLayoutManager 包含 GridLayoutManager）时，直接返回 true 即可解决问题，解决代码如下：

```kotlin
/**
 * 解决ViewPager嵌套横向RecyclerView滑到到RV第一个或最后一个后能滑动到ViewPager
 */
class NotScrollBorderViewPager @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : ViewPager(context, attrs) {

    override fun canScroll(v: View?, checkV: Boolean, dx: Int, x: Int, y: Int): Boolean {
         if (v?.isVisible != true) return false

         if (v is RecyclerView) {
              return (v.layoutManager as? LinearLayoutManager)?.orientation == RecyclerView.HORIZONTAL
         }
         return super.canScroll(v, checkV, dx, x, y)
    }
}
```

### 垂直 RecyclerView 嵌套水平 RecyclerView 水平滑动易滑动垂直 RecyclerView 问题，ViewPager2 也类似 (水平 RecyclerView 容易滑动到垂直 RecyclerView)

垂直 Recyclerview 嵌套水平 Recyclerview 的时候，有时候水平滑动的事件会被垂直的 View 消费掉，这时候横划就会比较困难 <br>** 原因 **<br>外层纵向滑动的 RecyclerView 对 横向滑动的 RecyclerView 的滑动事件进行了拦截，源码：<br>![](http://note.youdao.com/yws/res/45276/99095FCE5BDF4E299E9D36634EF9B2AB#id=qxIWF&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688490841807-a6c7a2a5-2b0a-4092-b53e-e8f24fa23ef1.png#averageHue=%232c2c25&clientId=u327fc544-fac9-4&from=paste&id=u2d8e4fb0&originHeight=493&originWidth=566&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u799308a0-5515-49f7-a5d2-bf3523df4c9&title=)

> canScrollVertically 此刻为 true，因此这里仅仅只判断了 Math.abs(dy)>mTouchSlop(可以认为是一个滑动阀值，是一个定值 8dp) ，并未判断方向或角度，从而决定是否拦截。

**解决**<br>既然 RecyclerView::onInterceptTouchEvent 内部没有判断滑动角度或方向，那我们就人为去判断，在上面判读的基础上继续判断 Math.abs(dy) 和 Math.abs(dx) 的大小，从而决定是否拦截

解决 1：重新内测垂直 RecyclerView，通过 getParent().requestDisallowInterceptTouchEvent(true); 让父 RecyclerView 不去拦截横向滑动<br><https://www.jianshu.com/p/4c87e0b6d16c>

解决 2：重写外侧水平 RecyclerView#onInterceptTouchEvent（不推荐）

```java
public class BetterRecyclerView extends RecyclerView{
  private static final int INVALID_POINTER = -1;
  private int mScrollPointerId = INVALID_POINTER;
  private int mInitialTouchX, mInitialTouchY;
  private int mTouchSlop;
  public BetterRecyclerView(Contextcontext) {
    this(context, null);
  }
 
  public BetterRecyclerView(Contextcontext, @Nullable AttributeSetattrs) {
    this(context, attrs, 0);
  }
 
  public BetterRecyclerView(Contextcontext, @Nullable AttributeSetattrs, int defStyle) {
    super(context, attrs, defStyle);
    final ViewConfigurationvc = ViewConfiguration.get(getContext());
    mTouchSlop = vc.getScaledTouchSlop();
  }
 
  @Override
  public void setScrollingTouchSlop(int slopConstant) {
    super.setScrollingTouchSlop(slopConstant);
    final ViewConfigurationvc = ViewConfiguration.get(getContext());
    switch (slopConstant) {
      case TOUCH_SLOP_DEFAULT:
        mTouchSlop = vc.getScaledTouchSlop();
        break;
      case TOUCH_SLOP_PAGING:
        mTouchSlop = ViewConfigurationCompat.getScaledPagingTouchSlop(vc);
        break;
      default:
        break;
    }
  }
 
  @Override
  public boolean onInterceptTouchEvent(MotionEvent e) {
    final int action = MotionEventCompat.getActionMasked(e);
    final int actionIndex = MotionEventCompat.getActionIndex(e);
 
    switch (action) {
      case MotionEvent.ACTION_DOWN:
        mScrollPointerId = MotionEventCompat.getPointerId(e, 0);
        mInitialTouchX = (int) (e.getX() + 0.5f);
        mInitialTouchY = (int) (e.getY() + 0.5f);
        return super.onInterceptTouchEvent(e);
 
      case MotionEventCompat.ACTION_POINTER_DOWN:
        mScrollPointerId = MotionEventCompat.getPointerId(e, actionIndex);
        mInitialTouchX = (int) (MotionEventCompat.getX(e, actionIndex) + 0.5f);
        mInitialTouchY = (int) (MotionEventCompat.getY(e, actionIndex) + 0.5f);
        return super.onInterceptTouchEvent(e);
 
      case MotionEvent.ACTION_MOVE: {
        final int index = MotionEventCompat.findPointerIndex(e, mScrollPointerId);
        if (index < 0) {
          return false;
        }
 
        final int x = (int) (MotionEventCompat.getX(e, index) + 0.5f);
        final int y = (int) (MotionEventCompat.getY(e, index) + 0.5f);
        if (getScrollState() != SCROLL_STATE_DRAGGING) {
          final int dx = x - mInitialTouchX;
          final int dy = y - mInitialTouchY;
          final boolean canScrollHorizontally = getLayoutManager().canScrollHorizontally();
          final boolean canScrollVertically = getLayoutManager().canScrollVertically();
          boolean startScroll = false;
          if (canScrollHorizontally && Math.abs(dx) > mTouchSlop && (Math.abs(dx) >= Math.abs(dy) || canScrollVertically)) {
            startScroll = true;
          }
          if (canScrollVertically && Math.abs(dy) > mTouchSlop && (Math.abs(dy) >= Math.abs(dx) || canScrollHorizontally)) {
            startScroll = true;
          }
          return startScroll && super.onInterceptTouchEvent(e);
        }
        return super.onInterceptTouchEvent(e);
      }
 
      default:
        return super.onInterceptTouchEvent(e);
    }
  }
}
```

解决 3：通过调整 TouchSlop 值的大小

> RecyclerView 的默认 TouchSlop 值是 8dp，如果要先保证进入 1 判断条件，必须调大 TouchSlop 值（反射获取），经过调整 TouchSlop (按倍数调整比较简单，可以先知道一个大致范围) 验证，当 TouchSlop 扩大 1 倍时就能满足条件。

解决 4：enforceSingleScrollDirection()，屏蔽掉 RV 双向滑动，改为单向滑动（推荐）<br><https://gist.github.com/cbeyls/e5e16bde73bb10486dfd1fc101b1b11a>

- [x] Fixing RecyclerView nested scrolling in opposite direction<br><https://bladecoder.medium.com/fixing-recyclerview-nested-scrolling-in-opposite-direction-f587be5c1a04>

解决 5：RecyclerView 官方解决，只能等

### 横向 ViewPager2 嵌套 纵向 RecyclerView，斜着滑容易滑动到另外一个 VP2 的 tab 去

**原因：** ViewPager2 的实现是 RecyclerView，斜着滑纵向和横向都大于 touchSlop(8px) 时，ViewPager2 就拦截了事件，表现出了斜着滑就滑到了另外一个 ViewPager2 的 Tab 去了

**期望：** 斜着滑一定角度内，才滑动到 VP2，其他情况都有纵向 RecyclerView 处理

**解决：** 同纵向 RecycleView/ListView 与 横向 RecycleView 之间的滑动冲突 (滑动不灵敏)

### 横向 ViewPager2 与内嵌横向 RecyclerView 之间的滑动冲突 (NestedScrollableHost) (内嵌水平 RecyclerView 划不动)

### 横向 RecyclerView  ItemView 滑动不停留在中间态 (LinearSnapHelper)

RecyclerView  ItemView 滑动多少就停在那里，这种效果不是我们想要的，我们想要的是滑到左边就显示第一个榜单，滑到右边就显示第二个榜单。

解决：设置 LinearSnapHelper

### 记录、恢复 RecyclerView 滚动偏移位置

## RecyclerView 内存泄漏

### 共享 RecycledViewPool 复用 View 导致的内存泄露问题及其解决

- 内存泄漏原因

onCreateViewHolder 里 inflate 一个新的 item View 的时候，这个 View 将会持有 LayoutInflater 的 context 所指的 Activity 实例。当这个 View 所在的 Activity 销毁时候，View 会被回收到 RecycledViewPool 并在将来被复用，但 Activity 会因被 View 的 context 所引用而一直不能被 GC 回收从而导致内存泄露。

1. 解决方式 1

一个 Activity 用一个 RecyclerViewPool。<br>[Does RecycledViewPool works fine when I set it into different RecyclerView in different Activity?](https://stackoverflow.com/questions/52984393/does-recycledviewpool-works-fine-when-i-set-it-into-different-recyclerview-in-di)

2. 解决方式 2

通过 Application Context 来创建 LayoutInflater，然后 inflate 得到的 View 的 context 就是 Application Context，这样 View 就不会持有 Activity 实例了。<br>会在运行时抛出一个类似这样的异常：

```
Caused by: java.lang.IllegalArgumentException: The style on this component requires your app theme to be Theme.MaterialComponents (or a descendant).
```

在 Application onCreate 的时候给它设置主题：

```java
setTheme(R.style.Theme_ZhanKuKotlin)
```

### RecyclerView 关联的 GapWorker 导致内存泄漏

<https://blog.csdn.net/c16882599/article/details/60140312>

## 嵌套在 ScrollView 中 RecyclerView 自动滚动

### RecyclerView 抢焦点自动滚动，嵌套在 ScrollView 中 RecyclerView 自动滚动

1. RecyclerView 嵌套了 ConstraintLayout，constraintstart/constraintEnd，constraintTop/constraintBottom 未成对出现
2. 在 RecyclerView 的父布局上增加 " android:focusable="true" android:focusableInTouchMode="true"" 这 2 个配置。

```xml
<RelativeLayout  
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:focusable="true"
    android:focusableInTouchMode="true"
    >
    <android.support.v7.widget.RecyclerView
        android:id="@+id/recyclerview"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        >
    </android.support.v7.widget.RecyclerView>
</RelativeLayout>
```

3. 嵌套在 ScrollView 中 RecyclerView 自动滚动

- [x] ScrollView（RecyclerView 等）为什么会自动滚动原理分析，还有阻止自动滑动的解决方案<br><https://juejin.im/post/6844903520089423879>

### RecyclerView 抢焦点自动滚动，嵌套在 SwipeRefreshLayout 中 RecyclerView 自动滚动

问题：<br>LenovoP2c72(Android6.0.1)RecyclerView 嵌套在 SwipeRefreshLayout 里面每次刷新到顶部自动回弹，挡住了第一个 item 的一半

解决：加上这 2 个属性

```
android:focusable="true"
android:focusableInTouchMode="true"
```

代码：

```xml
<club.jinmei.lib_ui.list_widget.WrapHasViewPagerSwipeRefreshLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ovo_refresh_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:focusable="true"
    android:focusableInTouchMode="true">
    ......
    <club.jinmei.lib_ui.list_widget.RefreshRecyclerView
        android:id="@+id/recyclerview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:background="@color/blue_1" />
</club.jinmei.lib_ui.list_widget.WrapHasViewPagerSwipeRefreshLayout>
```

- [x] RecyclerView 抢焦点自动滚动<br><https://www.jianshu.com/p/8fd07940dc34>

## RecyclerView 局部刷新无效

### RecyclerView 局部刷新

- notifyItemChanged(int position) 默认 payload 为 null 也即会进行整个 itemd 的全部刷新，可能会造成图片闪烁
- notifyItemChanged(int position, [@Nullable](/Nullable) Object payload) 局部 item 可选刷新

> payloads 是一个从 `notifyItemChanged(int, Object)` 中第二个参数和 `notifyItemRangeChanged(int, int, Object)` 中第三个参数传进来的一个参数。如果 payloads 不为空并且 viewHolder 已经绑定了旧数据了，那么 adapter 会使用 payloads 参数进行布局刷新。如果 payloads 为空，adapter 就会重新绑定数据，也就是刷新整个 item。但是 adapter 不能保证 payload 通过 nofityItemChanged 方法会被 onBindViewHolder 接收，例如当 view 没有绑定到 screen 时，payloads 就会失效被丢弃。

案例使用：

```kotlin
class RoomMicAdapter(layoutIdRes: Int, list: MutableList<RoomMicViewModel>) : BaseQuickAdapter<RoomMicViewModel, BaseViewHolder>(layoutIdRes, list) {

    companion object {
        const val PAYLOADS_RIPPLE = 0x21
        const val PAYLOADS_EXPRESSION = 0x22
        const val PAYLOADS_MIC_INFO = 0x23
    }

    override fun convert(helper: BaseViewHolder, model: RoomMicViewModel) {
        // 全部内容更新
        updateMicInfo(helper, model)
        (recyclerView as? CoroutineScope)?.let {
            helper.getView<CommonSVGAView>(R.id.room_mic_expression).setScope(it)
        }
    }

    override fun onBindViewHolder(holder: BaseViewHolder, position: Int, payloads: MutableList<Any>) {
        LogUtils.d(LogUtils.tag, anchor("onBindViewHolder") + " ----> ${payloads.toString()} + size: ${payloads.size}  ")
        when {
            payloads.isEmpty() -> {
                onBindViewHolder(holder, position)
                return
            }
            payloads.contains(PAYLOADS_RIPPLE) -> {
                // 只更新声波
                val item = getItem(position - headerLayoutCount)
                item?.let {
                    updateMicRipple(holder, it)
                }
            }
            payloads.contains(PAYLOADS_EXPRESSION) -> {
                // 更新表情
                val item = getItem(position - headerLayoutCount)
                item?.let {
                    updateMicExpression(holder, it)
                }
            }
            payloads.contains(PAYLOADS_MIC_INFO) -> {
                val item = getItem(position - headerLayoutCount)
                item?.let {
                    updateMicInfo(holder, it)
                }
            }
        }
    }
}
```

### RecyclerView 局部刷新无效

1. adapter 不是同一个，可通过 `System.identityHashCode(newData)` 打印内存地址确认
2. 数据源不是同一份

- [ ] 安卓易学，爬坑不易——腾讯老司机的 RecyclerView 局部刷新爬坑之路<br><http://wetest.qq.com/lab/view/176.html?from=content_zhihuzhuanlan>
- [ ] RecyclerView 中 notifyItemRangeChanged 无效的 BUG _<br><https://wangzhumo.com/2018/07/13/RecyclerView-unuseful-notifyItemRangeChanged/>

## RecyclerView 闪烁 blink

1. setSupportsChangeAnimations 为 false

```
((SimpleItemAnimator) mRoomRecyclerView.getItemAnimator()).setSupportsChangeAnimations(false);

// or

recyclerView.getItemAnimator().setChangeDuration(0)；
```

2. 设置 setHasStableIds 为 true，重写 getItemId
3. 全局刷新改为局部刷新
4. item 刷新闪烁

> 配合 diffutil，payload 刷新

## RecyclerView item 宽度没有填充屏幕

> match_parent width does not work in RecyclerView ?

> RecyclerView item width layout_width="match_parent" does not match parent ?

使用下面代码 match_parent 不生效

```java
View.inflate(mContext, R.layout.list_item_search_sug_footer_clear, null)
```

改成就可以了

```java
LayoutInflater.from(mContext).inflate(R.layout.list_item_search_sug_footer_clear, parent, false)
```

<http://stackoverflow.com/questions/30691150/match-parent-width-does-not-work-in-recyclerview>

## ConstraintLayout 中 RecyclerView 数据显示不全

### ConstraintLayout 嵌套 RecyclerView

RecyclerView 未设置 `constraintBottom_xxx` 和 `constraintTop`，`constraintStart` 和 `constraintEnd` 成对存在，只设置了一个。

### 问题

1. 导致最后的几条数据显示不全；
2. RecyclerView 中的数据会自动滚动一段距离

```xml
<ConstraintLayout>
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rv_gift_panel_receiver"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:layout_marginStart="@dimen/qb_px_5"
        android:orientation="horizontal"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintHorizontal_bias="0"
        app:layout_constraintStart_toEndOf="@id/iv_gift_panel_receiver_anchor"
        app:layout_constraintTop_toTopOf="parent" />
</ConstraintLayout>
```

如下图，后面几条数据显示不出来了；点击取消/选择 item 会滚动距离<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688517393764-a2fed14d-890d-4aca-8e2a-e10bf5b4dd99.png#averageHue=%2314232c&clientId=ue88291d7-7932-4&from=paste&height=657&id=u06440443&originHeight=985&originWidth=945&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=716939&status=done&style=none&taskId=u47419d55-5d85-42ba-af75-fc64a24c8f1&title=&width=630)

### ![](http://note.youdao.com/yws/res/43813/92F8D69C8CA8485B9FA14264DC0B8046#id=uRGBH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)解决

设置 `app:layout_constraintEnd_toEndOf="parent"`

```xml
<ConstraintLayout>
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rv_gift_panel_receiver"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:layout_marginStart="@dimen/qb_px_5"
        android:orientation="horizontal"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0"
        app:layout_constraintStart_toEndOf="@id/iv_gift_panel_receiver_anchor"
        app:layout_constraintTop_toTopOf="parent" />
</ConstraintLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688517414975-d92fceb0-1471-4dc4-9a76-5272a838ca8b.png#averageHue=%2314232d&clientId=ue88291d7-7932-4&from=paste&height=317&id=u3c8b4562&originHeight=906&originWidth=967&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=648559&status=done&style=none&taskId=ud9b226b7-6e71-4e15-a717-1b0bb80b910&title=&width=338.66668701171875)

### 小结

1. RecyclerView 嵌套在 ConstraintLayout 中，`constraintBottom_xxx` 和 `constraintTop`，`constraintStart` 和 `constraintEnd` 要成对存在，不然可能会显示不全

## RecyclerView 中 Edittext,Checkbox 问题

<http://blog.csdn.net/fan7983377/article/details/51516155>

## IllegalStateException: Cannot call this method while RecyclerView is computing a layout or scrolling

```
java.lang.IllegalStateException: Cannot call this method while RecyclerView is computing a layout or scrolling
```

### 出现场景

- recyclerview 界面有一个 Checkbox 的点击，点击之后是需要刷新界面的相关数据的逻辑的，但是在刷新的时候报了状态异常
- RecyclerView 的 item 中有个 EditText，编辑里面内容调用 notifyDataSetChanged() 会触发

### 分析

RecyclerView.Adapter 正在更新 RecyclerView，也就是调用 `onBindViewHolder()` 的时候，我们又调用了 `notifyDataSetChanged()` 方法，这个方法也是刷新界面，最终肯定也是调用 OnBindViewHolder,同时调用自然会抛出这个异常。

### 解决

**解决方法 1**：使用 handler 类排队，等待 recyclerview 更新结束之后再刷新。

```java
private void specialUpdate() {
    Handler handler = new Handler();
    final Runnable r = new Runnable() {
        public void run() {
            notifyItemChanged(getItemCount() - 1);
        }
    };
    handler.post(r);
}
```

<http://blog.devwiki.net/index.php/2016/07/19/recycler-view-problem-note.html><br>**解决方法 2：kt 扩展函数**

```kotlin
fun RecyclerView?.runAfterLayoutCompute(lifecycleOwner: LifecycleOwner, task: () -> Unit) {
    if (this == null) {
        return
    }
    if (lifecycleOwner.lifecycle.currentState == Lifecycle.State.DESTROYED) {
        return
    }
    try {
        lifecycleOwner.lifecycle.addObserver(object : DefaultLifecycleObserver {
            override fun onDestroy(owner: LifecycleOwner) {
                this@runAfterLayoutCompute.removeCallbacks(task)
            }
        })
        if (!isComputingLayout) {
            task.invoke()
        } else {
            this.post {
                task.invoke()
            }
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

## IndexOutOfBoundsException — Inconsistency detected

```
Fatal Exception: java.lang.IndexOutOfBoundsException
Inconsistency detected. Invalid view holder adapter positionBaseViewHolder{f7d9fa9 position=1 id=-1, oldPos=-1, pLpos:-1 no parent} club.jinmei.lib_ui.widget.recyclerview.MashiRecyclerView{cee8c94 VFE...... ......ID 0,43-350,416 #7f0a04a0 app:id/rv_gift_box_receipt}, adapter:club.jinmei.mgvoice.m_room.gift.widget.panel.box.GiftBoxGiftReceiptPop$GiftReceiptAdapter@bb02b4e, layout:androidx.recyclerview.widget.LinearLayoutManager@388646f, context:club.jinmei.mgvoice.m_room.room.RoomActivity@852f13c
```

修改前：

```kotlin
private var mData: MutableList<GiftReceiverItem> = mutableListOf()
private fun setAdapter(users: MutableList<User>?, onMicUserCount: Int) {
    mData.clear()
    mData.add(GiftReceiverItem.AllInOnLineItem(count = users?.size ?: 0))
    mData.add(GiftReceiverItem.AllInSeatsItem(count = onMicUserCount))
    if (users != null && users.isEmpty().not()) {
        for (user in users) {
            val item = GiftReceiverItem.SingleGiftReceiverItem(user)
            mData.add(item)
        }
    } else {
        // 非房主本人才增加房主选项
        if (UserCenterManager.getId() != roomManager?.getRoomOwner()?.id) {
            roomManager?.getRoomOwner()?.let {
                it.name = ResUtils.getStr(R.string.room_owner)
                mData.add(GiftReceiverItem.SingleGiftReceiverItem(it))
            }
        }
    }
    mAdapterGift.setNewData(mData)
}
```

修改后：

```kotlin
private fun setAdapter(users: MutableList<User>?, onMicUserCount: Int) {
    val temp = mutableListOf<GiftReceiverItem>()
    temp.add(GiftReceiverItem.AllInOnLineItem(count = users?.size ?: 0))
    temp.add(GiftReceiverItem.AllInSeatsItem(count = onMicUserCount))
    if (users != null && users.isEmpty().not()) {
        for (user in users) {
            val item = GiftReceiverItem.SingleGiftReceiverItem(user)
            temp.add(item)
        }
    } else {
        // 非房主本人才增加房主选项
        if (UserCenterManager.getId() != roomManager?.getRoomOwner()?.id) {
            roomManager?.getRoomOwner()?.let {
                it.name = ResUtils.getStr(R.string.room_owner)
                temp.add(GiftReceiverItem.SingleGiftReceiverItem(it))
            }
        }
    }
    mData = temp
    mAdapterGift.setNewData(mData)
}
```

```kotlin
val dataList : MutableList<Person> = listOf() // --> used by your recyclerview for showing the list
..
..
val personData = getPersons()
..
..
dataList.addAll(personData())
dataList.add(Person(name="Parithi"))
..
..
recyclerView.adapter?.notifyDataSetChanged()
```

**分析**：用户在滚动 RecyclerView 时，Adapter 引用的数据集变化了而未通知 adapter 刷新<br>**解决**：如果在对 list 操作 `.add()` , `addAll()` , `remove()` , `removeAll()` 同步进行；或者创建临时变量

```
val dataList : MutableList<Person> = listOf() // --> used by your recyclerview for showing the list
..
..
// create a temporary list
val temporaryList : MutableList<Person> = listOf() 
val personData = getPersons()
..
..
temporaryList.addAll(personData())
temporaryList.add(Person(name="Parithi"))
..
..
dataList = temporaryList // set it to the main list
recyclerView.adapter?.notifyDataSetChanged()
```

- [x] Solution for RecyclerView — IndexOutOfBoundsException — Inconsistency detected<br><https://medium.com/helloparithi/recyclerview-indexoutofboundsexception-inconsistency-detected-1fc71a5834f2>

## Ref

- [ ] RecyclerView 体验优化及入坑总结<br><https://www.jianshu.com/p/90c31e97cc55>
- [x] Fixing RecyclerView nested scrolling in opposite direction<br><https://bladecoder.medium.com/fixing-recyclerview-nested-scrolling-in-opposite-direction-f587be5c1a04>
