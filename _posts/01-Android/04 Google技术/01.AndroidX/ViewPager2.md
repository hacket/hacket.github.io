---
date created: 2024-06-18 10:26
tags:
  - '#setOffscreenPageLimit(int)'
date updated: 2024-12-24 00:31
dg-publish: true
---

# ViewPager2

1. ViewPager2版本更新说明: <https://developer.android.com/jetpack/androidx/releases/viewpager2>
2. ViewPager2官方demos: <https://github.com/android/views-widgets-samples/tree/master/ViewPager2>
3. 升级到ViewPager2: <https://developer.android.com/training/animation/vp2-migration>

## What?

ViewPager2用来替代ViewPager的。并解决了ViewPager一些痛点：

1. 支持RTL layout，之前的ViewPager的不支持，社区弄的RtlViewPager大多有些bug
2. 支持竖直方向，可以人人开发抖音效果了
3. 可修改的Fragment集合
4. 取消了预加载，默认只有一页

## 和ViewPager相比？

### 解决了ViewPager的痛点

1. 支持RTL layout，之前的ViewPager的不支持，社区弄的RtlViewPager大多有些bug
2. 支持竖直方向，可以人人开发抖音效果了
3. 可修改的Fragment集合
4. 取消了预加载，默认只有一页
5. 支持局部刷新`notifyItemChanged`，ViewPager只能全局刷新`notifyDataSetChanged`

### 可复用

原理是RecyclerView，可以View复用

### DiffUtil

### Support nested scrollable elements

<https://developer.android.com/training/animation/vp2-migration#nested-scrollables>

### API changes

1. `FragmentStateAdapter` 替代 `FragmentStatePagerAdapter`；Override `getItemCount()` instead of `getCount()`；Override `createFragment()` instead of `getItem()` in fragment-based adapter classes
2. `RecyclerView.Adapter` 替代 `PagerAdapter`
3. `registerOnPageChangeCallback()` 替代 `addPageChangeListener()`

### 注意点

1. DiffUtil通过id找item，用ViewPager2需要重写`getItemId()`和`containsItem()`
2. ViewPager2不支持`getPageWidth()`，如果在ViewPager用到了getPageWidth()，需要用ViewPager2的`clipToPadding`替代。
3. TabLayout和ViewPager2解耦了，如果需要用到TabLayout，需要用`TabLayoutMediator`

## How？

### 基本用法

#### 设置adapter

使用同RecyclerView.Adapter一样

1. 如果page是view的话，用`RecyclerView.Adapter`
2. 如果page是Fragment的话，用`androidx.viewpager2.adapter.FragmentStateAdapter`

#### 设置方向 setOrientation

Java代码`setOrientation`，xml设置`android:orientation`

#### 跳转 setCurrentItem

```kotlin
val smoothScroll = smoothScrollCheckBox.isChecked
viewPager.setCurrentItem(card, smoothScroll) // 参数smoothScroll表示平滑scroll
```

#### Disable user input

disable user input后：

1. touch input（scroll、fling手势及无障碍输入）
2. disable keyboard input暂不支持
3. 通过`setCurrentItem(int, boolean)`还可以用
4. 默认scroll可用

```java
setUserInputEnabled(boolean enabled)
```

#### Right-to-left support

```xml
<androidx.viewpager2.widget.ViewPager2
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/pager"
    android:layoutDirection="rtl" />
```

#### PageTransformer

```java
public interface PageTransformer {
    /**
     * Apply a property transformation to the given page.
     *
     * @param page Apply the transformation to this page
     * @param position Position of page relative to the current front-and-center
     *                 position of the pager. 0 is front and center. 1 is one full
     *                 page position to the right, and -2 is two pages to the left.
     *                 Minimum / maximum observed values depend on how many pages we keep
     *                 attached, which depends on offscreenPageLimit.
     *
     * @see #setOffscreenPageLimit(int)
     */
    void transformPage(@NonNull View page, float position);
}
```

- position <br />位置相对于front-and-center，0表示的是front and center，1表示右侧的full page位置。如果有2页的话，-2就是最左边的page。position的值最终取决于`setOffscreenPageLimit`

##### MarginPageTransformer

内部定义的margin，

1. 依赖`setTranslationX`和`setTranslationY`
2. translations不会重置，当切换到了另一个transformer或者orientation

##### CompositePageTransformer

连接多个PageTransformer

- 案例

```java
// 设置PageTransformer
viewPager.setPageTransformer(mAnimator)
// 设置了PageTransformer后调用
viewPager.requestTransform()

private val mAnimator = ViewPager2.PageTransformer { page, position ->
    val absPos = Math.abs(position)
    LogUtils.i("PageTransformer, position=$position")
    page.apply {
        rotation = if (rotateCheckBox.isChecked) position * 360 else 0f
        translationY = if (translateY) absPos * 500f else 0f
        translationX = if (translateX) absPos * 350f else 0f
        if (scaleCheckBox.isChecked) {
            val scale = if (absPos > 1) 0F else 1 - absPos
            scaleX = scale
            scaleY = scale
        } else {
            scaleX = 1f
            scaleY = 1f
        }
    }
}
```

- 设置margin的PageTransformer

```kotlin
class PageTransformerController(private val viewPager: ViewPager2, private val spinner: Spinner) {
    fun setUp() {
        val transformers = listOf(
            "None" to ViewPager2.PageTransformer { _, _ -> /* no op */ },
            "Margin 50px" to MarginPageTransformer(50),
            "Margin 32dp" to MarginPageTransformer(32.dpToPx)
        )

        val cancelTranslationsTransformer = ViewPager2.PageTransformer { page, _ ->
            page.translationX = 0f
            page.translationY = 0f
        }

        spinner.adapter = ArrayAdapter(
            spinner.context, android.R.layout.simple_spinner_item,
            transformers.map { it.first }.toList()
        ).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        }

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View?,
                position: Int,
                id: Long
            ) {
                val selected = transformers.first { it.first == parent.selectedItem }.second
                viewPager.setPageTransformer(CompositePageTransformer().also {
                    it.addTransformer(cancelTranslationsTransformer)
                    it.addTransformer(selected)
                })
            }

            override fun onNothingSelected(adapterView: AdapterView<*>) {}
        }
    }

    private val (Int).dpToPx: Int
        get() = TypedValue.applyDimension(
            COMPLEX_UNIT_DIP,
            this.toFloat(),
            viewPager.resources.displayMetrics
        ).toInt()
}
```

##### Zoom-out page transformer

This page transformer shrinks and fades pages when scrolling between adjacent pages. As a page gets closer to the center, it grows back to its normal size and fades in.

<https://developer.android.com/training/animation/screen-slide-2#zoom-out>

效果演示地址：<br /><https://developer.android.com/training/animation/anim_page_transformer_zoomout.webm>

```kotlin
private const val MIN_SCALE = 0.85f
private const val MIN_ALPHA = 0.5f

class ZoomOutPageTransformer : ViewPager2.PageTransformer {

    override fun transformPage(view: View, position: Float) {
        view.apply {
            val pageWidth = width
            val pageHeight = height
            when {
                position < -1 -> { // [-Infinity,-1)
                    // This page is way off-screen to the left.
                    alpha = 0f
                }
                position <= 1 -> { // [-1,1]
                    // Modify the default slide transition to shrink the page as well
                    val scaleFactor = Math.max(MIN_SCALE, 1 - Math.abs(position))
                    val vertMargin = pageHeight * (1 - scaleFactor) / 2
                    val horzMargin = pageWidth * (1 - scaleFactor) / 2
                    translationX = if (position < 0) {
                        horzMargin - vertMargin / 2
                    } else {
                        horzMargin + vertMargin / 2
                    }

                    // Scale the page down (between MIN_SCALE and 1)
                    scaleX = scaleFactor
                    scaleY = scaleFactor

                    // Fade the page relative to its size.
                    alpha = (MIN_ALPHA +
                            (((scaleFactor - MIN_SCALE) / (1 - MIN_SCALE)) * (1 - MIN_ALPHA)))
                }
                else -> { // (1,+Infinity]
                    // This page is way off-screen to the right.
                    alpha = 0f
                }
            }
        }
    }
}
```

##### Depth page transformer

This page transformer uses the default slide animation for sliding pages to the left, while using a "depth" animation for sliding pages to the right. This depth animation fades the page out, and scales it down linearly.

<https://developer.android.com/training/animation/screen-slide-2#depth-page>

效果演示地址：<br /><https://developer.android.com/training/animation/anim_page_transformer_depth.webm>

```kotlin
private const val MIN_SCALE = 0.75f

@RequiresApi(21)
class DepthPageTransformer : ViewPager2.PageTransformer {

    override fun transformPage(view: View, position: Float) {
        view.apply {
            val pageWidth = width
            when {
                position < -1 -> { // [-Infinity,-1)
                    // This page is way off-screen to the left.
                    alpha = 0f
                }
                position <= 0 -> { // [-1,0]
                    // Use the default slide transition when moving to the left page
                    alpha = 1f
                    translationX = 0f
                    translationZ = 0f
                    scaleX = 1f
                    scaleY = 1f
                }
                position <= 1 -> { // (0,1]
                    // Fade the page out.
                    alpha = 1 - position

                    // Counteract the default slide transition
                    translationX = pageWidth * -position
                    // Move it behind the left page
                    translationZ = -1f

                    // Scale the page down (between MIN_SCALE and 1)
                    val scaleFactor = (MIN_SCALE + (1 - MIN_SCALE) * (1 - Math.abs(position)))
                    scaleX = scaleFactor
                    scaleY = scaleFactor
                }
                else -> { // (1,+Infinity]
                    // This page is way off-screen to the right.
                    alpha = 0f
                }
            }
        }
    }
}
```

#### 保留页面，setOffscreenPageLimit

和ViewPager不同，ViewPager2取消了默认加载，默认只有一页。

- setOffscreenPageLimit(int)<br />默认值是-1，也就是只有一页

### ViewPager2 with Fragments

用`androidx.viewpager2.adapter.FragmentStateAdapter`

```kotlin
class CardFragmentActivity : BaseCardActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewPager.adapter = object : FragmentStateAdapter(this) {
            override fun createFragment(position: Int): Fragment {
                return CardFragment.create(Card.DECK[position])
            }
            override fun getItemCount(): Int {
                return Card.DECK.size
            }
        }
    }

    class CardFragment : Fragment() {
        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View? {
            val cardView = CardView(layoutInflater, container)
            cardView.bind(Card.fromBundle(arguments!!))
            return cardView.view
        }
        companion object {

            /** Creates a Fragment for a given [Card]  */
            fun create(card: Card): CardFragment {
                val fragment = CardFragment()
                fragment.arguments = card.toBundle()
                return fragment
            }
        }
    }
}
```

### ViewPager2动态添加删除page

```
viewPager.adapter?.notifyDataSetChanged()
```

### ViewPager2 with TabLayout（TabLayoutMediator）

> TabLayoutMediator是新增的

```kotlin
tabLayout = findViewById(R.id.tabs)
TabLayoutMediator(tabLayout, viewPager) { tab, position ->
    tab.text = Card.DECK[position].toString()
}.attach()
```

### ViewPager2 with Fake Dragging

1. beginFakeDrag()
2. fakeDragBy()
3. endFakeDrag()

```kotlin
class FakeDragActivity : FragmentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_fakedrag)
        // ...
        findViewById<View>(R.id.touchpad).setOnTouchListener { _, event ->
            handleOnTouchEvent(event)
        }
    }

    private fun mirrorInRtl(f: Float): Float {
        return if (isRtl) -f else f
    }

    private fun getValue(event: MotionEvent): Float {
        return if (landscape) event.y else mirrorInRtl(event.x)
    }

    private fun handleOnTouchEvent(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                lastValue = getValue(event)
                viewPager.beginFakeDrag()
            }

            MotionEvent.ACTION_MOVE -> {
                val value = getValue(event)
                val delta = value - lastValue
                viewPager.fakeDragBy(if (viewPager.isHorizontal) mirrorInRtl(delta) else delta)
                lastValue = value
            }

            MotionEvent.ACTION_CANCEL, MotionEvent.ACTION_UP -> {
                viewPager.endFakeDrag()
            }
        }
        return true
    }
}
```

### ViewPager2 with a Preview of Next/Prev Page

1. clipToPadding = false

```kotlin
class PreviewPagesActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_viewpager2)
        findViewById<ViewPager2>(R.id.view_pager).apply {
            // Set offscreen page limit to at least 1, so adjacent pages are always laid out
            offscreenPageLimit = 1
            val recyclerView = getChildAt(0) as RecyclerView
            recyclerView.apply {
                val padding = resources.getDimensionPixelOffset(R.dimen.halfPageMargin) +
                        resources.getDimensionPixelOffset(R.dimen.peekOffset)
                // setting padding on inner RecyclerView puts overscroll effect in the right place
                // TODO: expose in later versions not to rely on getChildAt(0) which might break
                setPadding(padding, 0, padding, 0)
                clipToPadding = false
            }
            adapter = Adapter()
        }
    }

    class ViewHolder(parent: ViewGroup) : RecyclerView.ViewHolder(
        LayoutInflater.from(parent.context).inflate(R.layout.item_preview_pages, parent, false)
    )

    class Adapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
        override fun getItemCount(): Int {
            return 10
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
            return ViewHolder(parent)
        }

        override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
            holder.itemView.tag = position
        }
    }
}
```

### ViewPager2 with Nested RecyclerViews(上下/左右)

```kotlin
/**
 * Layout to wrap a scrollable component inside a ViewPager2. Provided as a solution to the problem
 * where pages of ViewPager2 have nested scrollable elements that scroll in the same direction as
 * ViewPager2. The scrollable element needs to be the immediate and only child of this host layout.
 *
 * This solution has limitations when using multiple levels of nested scrollable elements
 * (e.g. a horizontal RecyclerView in a vertical RecyclerView in a horizontal ViewPager2).
 */
class NestedScrollableHost : FrameLayout {
    constructor(context: Context) : super(context)
    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs)

    private var touchSlop = 0
    private var initialX = 0f
    private var initialY = 0f
    private val parentViewPager: ViewPager2?
        get() {
            var v: View? = parent as? View
            while (v != null && v !is ViewPager2) {
                v = v.parent as? View
            }
            return v as? ViewPager2
        }

    private val child: View? get() = if (childCount > 0) getChildAt(0) else null

    init {
        touchSlop = ViewConfiguration.get(context).scaledTouchSlop
    }

    private fun canChildScroll(orientation: Int, delta: Float): Boolean {
        val direction = -delta.sign.toInt()
        return when (orientation) {
            0 -> child?.canScrollHorizontally(direction) ?: false
            1 -> child?.canScrollVertically(direction) ?: false
            else -> throw IllegalArgumentException()
        }
    }

    override fun onInterceptTouchEvent(e: MotionEvent): Boolean {
        handleInterceptTouchEvent(e)
        return super.onInterceptTouchEvent(e)
    }

    private fun handleInterceptTouchEvent(e: MotionEvent) {
        val orientation = parentViewPager?.orientation ?: return

        // Early return if child can't scroll in same direction as parent
        if (!canChildScroll(orientation, -1f) && !canChildScroll(orientation, 1f)) {
            return
        }

        if (e.action == MotionEvent.ACTION_DOWN) {
            initialX = e.x
            initialY = e.y
            parent.requestDisallowInterceptTouchEvent(true)
        } else if (e.action == MotionEvent.ACTION_MOVE) {
            val dx = e.x - initialX
            val dy = e.y - initialY
            val isVpHorizontal = orientation == ORIENTATION_HORIZONTAL

            // assuming ViewPager2 touch-slop is 2x touch-slop of child
            val scaledDx = dx.absoluteValue * if (isVpHorizontal) .5f else 1f
            val scaledDy = dy.absoluteValue * if (isVpHorizontal) 1f else .5f

            if (scaledDx > touchSlop || scaledDy > touchSlop) {
                if (isVpHorizontal == (scaledDy > scaledDx)) {
                    // Gesture is perpendicular, allow all parents to intercept
                    parent.requestDisallowInterceptTouchEvent(false)
                } else {
                    // Gesture is parallel, query child if movement in that direction is possible
                    if (canChildScroll(orientation, if (isVpHorizontal) dx else dy)) {
                        // Child can scroll, disallow all parents to intercept
                        parent.requestDisallowInterceptTouchEvent(true)
                    } else {
                        // Child cannot scroll, allow all parents to intercept
                        parent.requestDisallowInterceptTouchEvent(false)
                    }
                }
            }
        }
    }
}
```

- xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

    <TextView
            android:id="@+id/page_title"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginLeft="@dimen/spacer_large"
            android:layout_marginTop="@dimen/spacer_large"
            android:layout_marginRight="@dimen/spacer_large"
            android:gravity="center"
            android:textAppearance="@style/TextAppearance.AppCompat.Headline"
            tools:text="Page 1" />

    <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginLeft="20dp"
            android:layout_marginTop="32dp"
            android:layout_marginRight="20dp"
            android:text="@string/first_rv"
            android:textStyle="bold" />

    <me.hacket.assistant.samples.google.viewpager2.NestedScrollableHost
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp">

        <androidx.recyclerview.widget.RecyclerView
                android:id="@+id/first_rv"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:background="#FFFFFF" />
    </me.hacket.assistant.samples.google.viewpager2.NestedScrollableHost>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginLeft="20dp"
            android:layout_marginTop="32dp"
            android:layout_marginRight="20dp"
            android:text="@string/second_rv"
            android:textStyle="bold" />

    <me.hacket.assistant.samples.google.viewpager2.NestedScrollableHost
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_marginLeft="20dp"
            android:layout_marginTop="8dp"
            android:layout_marginRight="20dp"
            android:layout_weight="1">

        <androidx.recyclerview.widget.RecyclerView
                android:id="@+id/second_rv"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:background="#FFFFFF" />
    </me.hacket.assistant.samples.google.viewpager2.NestedScrollableHost>
</LinearLayout>
```

### ViewPager2支持DiffUtil

1. 需要重写`getItemId()`
2. 通过`supportFragmentManager.findFragmentByTag(tag)`找到Fragment，tag固定格式为`f$itemId`

```kotlin
class GiftPanelFragmentAdapter(private val fragAct: FragmentActivity,
                               private var data: List<GiftVP2PanelCategoryItem>) : FragmentStateAdapter(fragAct) {

    companion object {
        const val PAYLOADS_INFO = 0X11 // 更新标题等信息
        const val PAYLOADS_GIFT_DATA = 0X12 // 更新面板礼物
    }

    fun getData(): List<GiftVP2PanelCategoryItem> {
        return data
    }

    fun setData(data: List<GiftVP2PanelCategoryItem>) {
        this.data = data
    }

    override fun getItemId(position: Int): Long {
        return data[position].item.categoryId.toLong()
    }

    override fun containsItem(itemId: Long): Boolean {
        return data.any { it.item.categoryId.toLong() == itemId }
    }

    override fun createFragment(position: Int): Fragment {
        return data[position % data.size].fragment
    }

    override fun getItemCount(): Int {
        return data.size
    }

    private fun getFragmentTag(itemId: Long): String {
        return "f$itemId" // FragmentStateAdapter#339 line
    }

    override fun onBindViewHolder(holder: FragmentViewHolder, position: Int, payloads: MutableList<Any>) {
        LogUtils.i("hacket", "onBindViewHolder position=$position，payloads=${payloads}")
        if (payloads.isEmpty()) {
            super.onBindViewHolder(holder, position, payloads)
            return
        }
        val tag = getFragmentTag(holder.itemId)
        val fragment = fragAct.supportFragmentManager.findFragmentByTag(tag)
        if (fragment == null) {
            super.onBindViewHolder(holder, position, payloads)
            return
        }
        (payloads[0] as? MutableList<*>)?.apply {
            when {
                contains(PAYLOADS_INFO) -> {
                    (fragment as IGiftPanelCategoryUpdate).updateCategoryInfo(data[position].item)
                }
                contains(PAYLOADS_GIFT_DATA) -> {
                    (fragment as IGiftPanelCategoryUpdate).updateGift(data[position].item)
                }
            }
        }
    }
}
```

# ViewPager2坑

## ViewPager2中的页面的ViewGroup设置了animateLayoutChanges导致的崩溃

viewpager2中，Fragment是具体页面时，<br />如果framgent的页面有设置LayoutTransition，比如<br />ViewGroup设置了`animateLayoutChanges="true"`。<br />在创建view后必须调用`getLayoutTransition().setAnimateParentHierarchy(false)`，否则可能会引发崩溃问题。<br />示例：

```java
View view = layoutInflater.inflate(R.layout.page, parent, false);
ViewGroup viewGroup = view.findViewById(R.id.animated_viewgroup);
viewGroup.getLayoutTransition().setAnimateParentHierarchy(false);
```

If you're planning to use Fragments as pages, implement FragmentStateAdapter. If your pages are Views, implement RecyclerView.Adapter as usual.

If your pages contain LayoutTransitions, then those LayoutTransitions must have animateParentHierarchy set to false. Note that if you have a ViewGroup with `animateLayoutChanges="true"` in your layout xml file, a LayoutTransition is added automatically to that ViewGroup. You will need to manually call `getLayoutTransition().setAnimateParentHierarchy(false)` on that ViewGroup after you inflated the xml layout, like this:

```java
View view = layoutInflater.inflate(R.layout.page, parent, false);
ViewGroup viewGroup = view.findViewById(R.id.animated_viewgroup);
viewGroup.getLayoutTransition().setAnimateParentHierarchy(false);
```

## ViewPager2嵌套垂直RecyclerView滑动问题

## ViewPager2 + Fragment

### Diffutils坑 Fragment isAdd为false

一般Fragment是通过构造方法传给ViewPager2的FragmentStateAdapter，在ViewPager2进行diffUtils更新时，会更新里面的Fragment值，导致Fragment状态被重置了，导致一些UI问题

### ViewPager2动态删除Fragment 显示问题

Viewpage2 动态删除fragment时，显示的效果为删除的是Fragment列表的最后一个，不管怎么调用notifyItemRemoved或者删除fragments数据源中指定下标的数据，依旧不行。哪怕打印每个数据源的hashcode，都显示删除操作正常，数据源也正常，但是显示效果依旧为删除最后一个fragment

需要重写下面两个方法解决：<br />准备数据源mFragments时 初始化一下mFragmentHashCodes数据源

```java
private List<Fragment> mFragments;//数据源
private List<Integer> mFragmentHashCodes;//数据源中fragment的hashcode 一对一 增删时注意保持一致
```

而后重写FragmetnStateAdapter中的

```java
@Override
public long getItemId(int position) {
    return mFragments.get(position).hashCode();
}

@Override
public boolean containsItem(long itemId) {
    return mFragmentHashCodes.contains(itemId);
}
```

## java.lang.IllegalStateException: Pages must fill the whole ViewPager2 (use match_parent)

在RecyclerView中的item用到了ViewPager2，此时需要设置为match_parent

遇到这种异常无非是以下两种情况造成的:

1. Item的XML布局的外层用了`"wrap_content"`，应改为了`"match_parent"`
2. 在onCreateViewHolder方法里实例化View时遇到inflate方法时第二个参数不要传null而是传parent

### 为啥？

为啥adapter里的view都必须是match，看下代码<br />attache child的时候会判断layoutparams的，不是match就直接exception了

```java
private RecyclerView.OnChildAttachStateChangeListener enforceChildFillListener() {
    return new RecyclerView.OnChildAttachStateChangeListener() {
        @Override
        public void onChildViewAttachedToWindow(@NonNull View view) {
            RecyclerView.LayoutParams layoutParams =
                    (RecyclerView.LayoutParams) view.getLayoutParams();
            if (layoutParams.width != LayoutParams.MATCH_PARENT
                    || layoutParams.height != LayoutParams.MATCH_PARENT) {
                throw new IllegalStateException(
                        "Pages must fill the whole ViewPager2 (use match_parent)");
            }
        }

        @Override
        public void onChildViewDetachedFromWindow(@NonNull View view) {
            // nothing
        }
    };
}
```

## ViewPager2+Fragment 瞬间暴增数个Fragment

- [ ] 【ViewPager2避坑系列】瞬间暴增数个Fragment<br /><https://juejin.cn/post/6844903846972489742>
