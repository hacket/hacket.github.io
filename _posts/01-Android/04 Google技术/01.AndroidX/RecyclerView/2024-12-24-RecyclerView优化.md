---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
tags:
  - '#areItemsTheSame(int,'
  - '#areItemsTheSame(int,'
  - '#areContentsTheSame(int,'
  - '#areItemsTheSame(int,'
  - '#areContentsTheSame(int,'
---

# RecyclerView性能优化汇总

## RecyclerView定向刷新

### notifyItemXXX

### payloads

### DiffUtil

- SortedList
- AsyncListUtil

## setHasStableIds()／getItemId()

它只会在调用 notifyDataSetChanged 方法之后，影响 RecyclerView 的行为。

setHasStableIds用来标识每一个itemView是否需要一个唯一标识，当stableId设置为true的时候，每一个itemView数据就有一个唯一标识。getItemId()返回代表这个ViewHolder的唯一标识，如果没有设置stableId唯一性，返回NO_ID=-1。通过setHasStableIds可以使itemView的焦点固定，从而解决RecyclerView的notify方法使得图片加载时闪烁问题。

- setHasStableIds()必须在 setAdapter() 方法之前调用，否则会抛异常。因为RecyclerView.setAdapter后就设置了观察者，设置了观察者stateIds就不能变了。
- 在 Adapter 类中重写`getItemId()`方法来给每个 Item 一个唯一的ID。

### 注意String.hashCode作为stable id的冲突

如果使用的是String作为stable id，String的hashCode很容易发生冲突，如`Aa`和`BB`的hashCode是一样的，

```kotlin
fun main() {
    val aa = "Aa"
    val bb = "BB"
    println("Aa.hashCode=${aa.hashCode()},BB.hashCode=${bb.hashCode()}, Aa==BB:(${aa.hashCode() == bb.hashCode()})") 
    // Aa.hashCode=2112,BB.hashCode=2112, Aa==BB:(true)
    
    println("Aa.hashCode=${System.identityHashCode(aa)},BB.hashCode=${System.identityHashCode(bb)}, Aa==BB:(${System.identityHashCode(aa) == System.identityHashCode(bb)})")
    // Aa.hashCode=723074861,BB.hashCode=895328852, Aa==BB:(false)
}
```

## setHasFixedSize(true) 设置为true，adapter content改变不会改变RecyclerView的size

当Item的高度如是固定的，设置这个属性为true可以提高性能，尤其是当RecyclerView有条目插入、删除时性能提升更明显。RecyclerView在条目数量改变，会重新测量、布局各个item，如果设置了setHasFixedSize(true)，由于item的宽高都是固定的，adapter的内容改变时，RecyclerView不会整个布局都重绘。<br />具体可用以下伪代码表示：

```java
void onItemsInsertedOrRemoved() {
   if (hasFixedSize) layoutChildren();
   else requestLayout();
}
```

- 如果item的宽高固定，设置为true，避免adapter的content的变化时导致RecyclerView的整个重新布局
- 确定Item的改变不会影响RecyclerView的宽高的时候可以设置setHasFixedSize(true)，并通过Adapter的增删改插方法去刷新RecyclerView，而不是通过notifyDataSetChanged()

> 其实可以直接设置为true，当需要改变宽高的时候就用notifyDataSetChanged()去整体刷新一下

- 瀑布流布局设置为false

## 数据处理和视图加载分离 （数据拉取和处理都放异步）

远端**拉取数据**肯定是要放在异步的，在我们拉取下来数据之后可能就匆匆把数据丢给了 VH处理，其实，**数据的处理逻辑**我们也应该放在异步处理，这样 Adapter 在 notify change 后，ViewHolder就可以简单无压力地做数据与视图的绑定逻辑

```java
mTextView.setText(Html.fromHtml(data).toString());
```

这里的`Html.fromHtml(data)`方法可能就是比较耗时的，存在多个 TextView 的话耗时会更为严重，这样便会引发掉帧、卡顿，而如果把这一步与网络异步线程放在一起，站在用户角度，最多就是网络刷新时间稍长一点。

## 数据优化 (分页-缓存-DiffUtils)

分页拉取远端数据，对拉取下来的远端数据进行缓存，提升二次加载速度；对于新增或者删除数据通过 DiffUtil 来进行局部刷新数据，而不是一味地全局刷新数据。

## 布局优化

- 设计 ItemType 时，对多 ViewType 能够共用的部分尽量设计成自定义 View，减少 View 的构造和嵌套。
- 对 TextView 使用 String.toUpperCase 来替代 android:textAllCaps="true"。
- 对 ItemView 设置监听器，不要对每个 Item 都调用 addXxListener，应该大家公用一个 XxListener，根据 ID 来进行不同的操作，优化了对象的频繁创建带来的资源消耗。

## RecyclerView 数据预取

升级Recycle版本到25以上的版本，使用recyclerview prefetch功能

## RecyclerView缓存

### setItemViewCacheSize(int)

RecyclerView可以设置自己所需要的ViewHolder缓存数量，默认大小是2。cacheViews中的缓存只能position相同才可得用，且不会重新bindView，CacheViews满了后移除到RecyclerPool中，并重置ViewHolder，如果对于可能来回滑动的RecyclerView，把CacheViews的缓存数量设置大一些，可以减少bindView的时间，加快布局显示。

> 注：此方法是拿空间换时间，要充分考虑应用内存问题，根据应用实际使用情况设置大小。

网上大部分设置CacheView大小时都会带上：`setDrawingCacheEnabled(true)`和`setDrawingCacheQuality(View.DRAWING_CACHE_QUALITY_HIGH)`

setDrawingCacheEnabled这个是View本身的方法，意途是开启缓存。通过setDrawingCacheEnabled把cache打开，再调用getDrawingCache就可以获得view的cache图片，如果cache没有建立，系统会自动调用buildDrawingCache方法来生成cache。一般截图会用到，这里的设置drawingcache，可能是在重绘时不需要重新计算bitmap的宽高等，能加快dispatchDraw的速度，但开启drawingcache，肯定也会耗应用的内存，所以也慎用。

### 复用RecycledViewPool

在TabLayout+ViewPager+RecyclerView的场景中，当多个RecyclerView有相同的item布局结构时，多个RecyclerView共用一个RecycledViewPool可以避免创建ViewHolder的开销，避免GC。RecycledViewPool对象可通过RecyclerView对象获取，也可以自己实现。

#### 1、复用之前RV的RecyclerViewPool

```java
RecycledViewPool mPool = mRecyclerView1.getRecycledViewPool();
// 下一个RecyclerView可直接进行setRecycledViewPool

mRecyclerView2.setRecycledViewPool(mPool);

mRecyclerView3.setRecycledViewPool(mPool);
```

#### 2、自己写RecyclerViewPool，参考（vlayout-InnerRecycledViewPool提供了detach回调）

注意：

1. RecycledViewPool是依据ItemViewType来索引ViewHolder的，必须确保共享的RecyclerView的Adapter是同一个，或view type 是不会冲突的。
2. RecycledViewPool可以自主控制需要缓存的ViewHolder数量，每种type的默认容量是5，可通过setMaxRecycledViews来设置大小。   `mPool.setMaxRecycledViews(itemViewType, number);` 但这会增大应用内存开销，所以也需要根据应用具体情况来使用。
3. 利用此特性一般建议设置`layout.setRecycleChildrenOnDetach(true);`此属性是用来告诉LayoutManager从RecyclerView分离时，是否要回收所有的item，如果项目中复用RecycledViewPool时，开启该功能会更好的实现复用。其他RecyclerView可以复用这些回收的item。

什么时候LayoutManager会从RecyclerView上分离呢，有两种情况：1）重新setLayoutManager()时，比如淘宝页面查看商品列表，可以线性查看，也可以表格形式查看，2）还有一种是RecyclerView从视图树上被remove时。但第一种情况，RecyclerView内部做了回收工作，设不设置影响不大，设置此属性作用主要针对第二种情况。

## 其他优化点

### 设置 `RecyclerView.addOnScrollListener(listener);` 来对滑动过程中停止加载的操作

### 如果不要求动画，可以通过 `((SimpleItemAnimator) rv.getItemAnimator()).setSupportsChangeAnimations(false);` 把默认动画关闭来提升效率。

### 通过重写 RecyclerView.Adapter.onViewRecycled(holder) 来回收资源。

### 通过 RecycleView.setItemViewCacheSize(size); 来加大 RecyclerView 的缓存，用空间换时间来提高滚动的流畅性。默认2个

### 如果多个 RecycledView 的 Adapter 是一样的，比如嵌套的 RecyclerView 中存在一样的 Adapter，可以通过设置 RecyclerView.setRecycledViewPool(pool); 来共用一个 RecycledViewPool。

### 通过 getExtraLayoutSpace 来增加 RecyclerView 预留的额外空间（显示范围之外，应该额外缓存的空间）

在RecyclerView的元素比较高，一屏只能显示一个元素的时候，第一次滑动到第二个元素会卡顿。

RecyclerView (以及其他基于adapter的view，比如ListView、GridView等)使用了缓存机制重用子 view（即系统只将屏幕可见范围之内的元素保存在内存中，在滚动的时候不断的重用这些内存中已经存在的view，而不是新建view）。

这个机制会导致一个问题，启动应用之后，在屏幕可见范围内，如果只有一张卡片可见，当滚动的时 候，RecyclerView找不到可以重用的view了，它将创建一个新的，因此在滑动到第二个feed的时候就会有一定的延时，但是第二个feed之 后的滚动是流畅的，因为这个时候RecyclerView已经有能重用的view了。

如何解决这个问题呢，其实只需重写getExtraLayoutSpace()方法。根据官方文档的描述 getExtraLayoutSpace将返回LayoutManager应该预留的额外空间（显示范围之外，应该额外缓存的空间）。

```java
LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this) {
    @Override
    protected int getExtraLayoutSpace(RecyclerView.State state) {
        return 300;
    }
};
```

### 不要在onBindViewHolder的时候设置onClickListener

#### 不要在onBindViewHolder的时候设置onClickListener

当为RecyclerView中的ItemView中的设置点击事件或者其他事件的时候，往往我们的写法总是在onBindViewHolder中给ItemView去设置点击事件。

```java
@Override
public void onBindViewHolder(ViewHolder holder, int position) {
    holder.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            //do something
        }
    });
}
```

- 问题<br />RecyclerView经常来回滑动，onBindViewHolder会调用的很频繁，每次调用都会重新new一个OnClickListener对象

#### 不要做逻辑判断和计算

- 问题<br />每次滑入后我们都必须做完这些逻辑判断和计算，页面才能绘制出来

常见的一些逻辑判断：

1. TextView.setText(Html.fromHtml(str);
2. 计算UI的宽高比，margin，padding，每次都用DensityUtils.dp2px()转换。
3. 每次都new一些可以复用都对象:adapter,viewparam

- 优化
  1. 可以考虑尽可能都逻辑前移
  2. onBindViewHolder中的对象考虑懒加载或者变成私有变量

### 对于大量图片的RecyclerView考虑重写onScroll事件，滑动暂停后再加载

## Ref

- [x] RecyclerView性能优化及高级使用<br /><https://blog.csdn.net/smileiam/article/details/88396546>

# RecyclerView定向刷新之payload

## item刷新

### notifyItemChanged(int position) item全局刷新

等同于`notifyItemChanged(position, null);`，回调`void onBindViewHolder(@NonNull VH holder, int position)`

#### 存在的问题

1. item闪烁，图片闪烁

> item的全局刷新导致，需要用`notifyItemChanged(int position, @Nullable Object payload)`局部刷新

### void notifyItemChanged(int position, [@Nullable ](/Nullable) Object payload) item局部刷新

回调`void onBindViewHolder(@NonNull VH holder, int position, @NonNull List<Object> payloads)`

#### payload

参数3：payload，传null为item的全部刷新；否则局部更新；多个payload，会合并List作为onBindViewHolder第三个参数回调。并且一次绘制的时间内，多次notifyItemChanged()会合并成一个payloads，只有第一次notifyItemChanged()会重新绘制。

```kotlin
override fun onItemClick(adapter: BaseQuickAdapter<*, *>?, view: View?, position: Int) {
    val data = adapter?.data
    val item = data?.get(position) as? Item
    item?.praise = item?.praise?.plus(1L) ?: 0L
    item?.comment = item?.comment?.plus(10L) ?: 0L
    adapter?.notifyItemChanged(position, Item.PAYLOAD_PRAISE) // 这2个合并一个List
//        adapter?.notifyItemChanged(position, Item.PAYLOAD_COMMENT) // 这2个合并一个List

    thread {
        SystemClock.sleep(5000) // 增加延时后，就不会合并成一个payload了
        rv_items.post {
            adapter?.notifyItemChanged(position, Item.PAYLOAD_COMMENT)
        }
    }
}
```

核心源码：

```java
//RecyclerViewDataObserver
@Override
public void onItemRangeChanged(int positionStart, int itemCount, Object payload) {
    assertNotInLayoutOrScroll(null);
    if (mAdapterHelper.onItemRangeChanged(positionStart, itemCount, payload)) {
        triggerUpdateProcessor();
    }
}

/**
 * @return True if updates should be processed.
 */
boolean onItemRangeChanged(int positionStart, int itemCount, Object payload) {
    if (itemCount < 1) {
        return false;
    }
    mPendingUpdates.add(obtainUpdateOp(UpdateOp.UPDATE, positionStart, itemCount, payload));
    mExistingUpdateTypes |= UpdateOp.UPDATE;
    return mPendingUpdates.size() == 1;
}
// 参考 https://juejin.im/post/5caee76a6fb9a06891739c9b
```

#### 案例

```java
class RecyclerView_notifyItemChanged : AppCompatActivity(), BaseQuickAdapter.OnItemClickListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_recycler_view_notify_item_changed)


        val items = ItemData.get()
        rv_items.layoutManager = LinearLayoutManager(applicationContext)

        val itemAdapter = ItemAdapter(items.toMutableList())
        itemAdapter.onItemClickListener = this
        rv_items.adapter = itemAdapter

    }

    override fun onItemClick(adapter: BaseQuickAdapter<*, *>?, view: View?, position: Int) {
        val data = adapter?.data
        val item = data?.get(position) as? Item
        item?.praise = item?.praise?.plus(1L) ?: 0L
        item?.comment = item?.comment?.plus(10L) ?: 0L
        adapter?.notifyItemChanged(position, Item.PAYLOAD_PRAISE) // 这2个合并一个List
        adapter?.notifyItemChanged(position, Item.PAYLOAD_COMMENT) // 这2个合并一个List
    }
}
```

```java
class ItemAdapter(data: MutableList<Item>?) : BaseQuickAdapter<Item, BaseViewHolder>(R.layout.item_layout_notify_demo, data) {

    override fun convert(helper: BaseViewHolder?, item: Item?) {
        helper?.setText(R.id.tv_title, item?.title)
        helper?.setText(R.id.tv_label, item?.label)
        val praiseStr = StringUtils.format("赞 %d", item?.praise)
        helper?.setText(R.id.tv_praise, praiseStr)
        val commentStr = StringUtils.format("评论 %s", item?.comment)
        helper?.setText(R.id.tv_comment, commentStr)
        val dateStr = DateUtils.formatDateToString(item?.date ?: 0L)
        helper?.setText(R.id.tv_date, dateStr)

        val iv = helper?.getView<ImageView>(R.id.iv_img)
        Glide.with(iv!!).load(item?.img).into(iv)
    }


    override fun onBindViewHolder(holder: BaseViewHolder, position: Int, payloads: MutableList<Any>) {
        val item = getItem(position - headerLayoutCount)
        val praiseStr = StringUtils.format("赞 %d", item?.praise)
        val commentStr = StringUtils.format("评论 %d", item?.comment)
        if (payloads.isNullOrEmpty()) {
            LogUtils.i("onBindViewHolder position=$position，normal payloads is empty. praise=$praiseStr，comment=$commentStr")
            super.onBindViewHolder(holder, position, payloads)
        } else {
            LogUtils.w("onBindViewHolder position=$position，praise=$praiseStr，comment=$commentStr,payloads(${payloads.size}) : $payloads")
            when {
                payloads.contains(Item.PAYLOAD_PRAISE) or payloads.contains(Item.PAYLOAD_COMMENT) -> {
                    onBindViewPraisePlus(holder, position)
                }
            }
        }
    }

    private fun onBindViewPraisePlus(holder: BaseViewHolder, position: Int) {
        val item = getItem(position - headerLayoutCount)
        val praise = item?.praise
        val comment = item?.comment
        val praiseStr = StringUtils.format("赞 %d", praise)
        holder.setText(R.id.tv_praise, praiseStr)
        val commentStr = StringUtils.format("评论 %d", comment)
        holder.setText(R.id.tv_comment, commentStr)
        LogUtils.i("onBindViewPraisePlus  praise=$praiseStr，comment=$commentStr")
    }

}
```

## Ref

- [x] 再说Android RecyclerView局部刷新那个坑<br /><https://blog.csdn.net/jdsjlzx/article/details/52893469>

# RecyclerView定向刷新DiffUtil

## DiffUtil注意

### 在onBindViewHolder绑定了点击事件，引用的数据对象不对

### 数据浅拷贝无效，data class copy为浅拷贝

DiffUtil需要一个新，旧List数据集，然后两个数据集去做差异性，根据差异性来刷新adapter内容；很多做法是把之前adapter的数据重新创建一个List添加进去然后丢给DiffUtil去做数据差异，但是这样的拷贝是浅拷贝，当元素进行`areItemsTheSame`不就还是自己和自己比较吗，所以只能说浅拷贝的情况下也不能完美的使用DiffUtil。

### 深拷贝方案

#### 1. 基于Parcelable的深拷贝 <https://github.com/Leifzhang/DiffUtils>

#### 2. 反射/apt深拷贝 <https://github.com/enbandari/KotlinDeepCopy>

## DiffUtil介绍

DiffUtil是`support-v7:24.2.0`中的新工具类，它用来比较两个数据集，寻找出`旧数据集 vs 新数据集`的最小变化量。<br />最大的用处就是在RecyclerView刷新时，不再无脑mAdapter.notifyDataSetChanged()。

- Adapter.notifyDataSetChanged()有两个缺点：
  1. 不会触发RecyclerView的动画（删除、新增、位移、change动画）;DiffUtil是伴有item动画的；notifyItemChanged()导致Item白光一闪的动画
  2. 性能较低。每次数据变化都全量刷新整个列表是很奢侈的，不仅整个列表会闪烁一下，而且所有可见表项都会重新执行一遍onBindViewHolder()并重绘列表（即便它并不需要刷新）。若表项视图复杂，会显著影响列表性能。
- DiffUtil过程：
  1. DiffUtil比较的是两个List结构，首先比较两个List中的size，然后逐个比较元素是不是同一个条目，也就是同一个Item，如果是同一个Item之后则比较同一个Item内的元素是不是也相同，之后生成一份DiffResult结果，开发根据这个结果进行后序的增删改等操作。
  2. 其中比较元素相同的方法是`areContentsTheSame`，正常情况下我们会通过模型内部定义的Id来作为模型的唯一标识符，通过这个标识符去判断这个元素是不是相同。
  3. 比较同一个元素的内容是不是相同的方法是`areItemsTheSame`，我直接使用的Object内的equals方法进行内容相同的判断。
  4. 最后通过`Object getChangePayload(int oldItemPosition, int newItemPosition)`返回值，返回null为full update，不为null为payloads刷新。
- DiffUtil模版代码

```java
val oldList = ... // 老列表
val newList = ... // 新列表
val adapter：RecyclerView.Adapter = ...

// 1.定义比对方法
val callback = object : DiffUtil.Callback() {
    override fun getOldListSize(): Int = oldList.size
    override fun getNewListSize(): Int = newList.size
    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
    	// 分别获取新老列表中对应位置的元素
        val oldItem = oldList[oldItemPosition]
        val newItem = newList[newItemPosition]
        return ... // 定义什么情况下新老元素是同一个对象（通常是业务id）
    }
    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldItem = oldList[oldItemPosition]
        val newItem = newList[newItemPosition]
        return ... // 定义什么情况下同一对象内容是否相同 (由业务逻辑决定)
    }
    override fun getChangePayload(oldItemPosition: Int, newItemPosition: Int): Any? {
        val oldItem = oldList[oldItemPosition]
        val newItem = newList[newItemPosition]
        return ... // 具体定义同一对象内容是如何地不同 (返回值会作为payloads传入onBindViewHoder())
    }
}
// 2.进行比对并输出结果
val diffResult = DiffUtil.calculateDiff(callback)
// 3. 将比对结果应用到 adapter
diffResult.dispatchUpdatesTo(adapter)
```

## DiffUtil基本用法

使用DiffUtil后，替换掉adapter.notifyItemChanged()如下代码：

```java
// 利用DiffUtil.calculateDiff()方法，传入一个规则DiffUtil.Callback对象，和是否检测移动item的 boolean变量，得到DiffUtil.DiffResult 的对象
DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(new DiffCallBack(mDatas, newDatas), true);

// 利用DiffUtil.DiffResult对象的dispatchUpdatesTo()方法，传入RecyclerView的Adapter，轻松成为文艺青年

diffResult.dispatchUpdatesTo(mAdapter);

//别忘了将新数据给Adapter
mDatas = newDatas;
mAdapter.setDatas(mDatas);
```

它会自动计算新老数据集的差异，并根据差异情况，自动调用以下四个方法

```java
adapter.notifyItemRangeInserted(position, count);
adapter.notifyItemRangeRemoved(position, count);
adapter.notifyItemMoved(fromPosition, toPosition);
adapter.notifyItemRangeChanged(position, count, payload);
```

> 这个四个方法在执行时都是伴有RecyclerView的动画的，且都是定向刷新方法，效率大大提升

- 注意：如果需要更新的话，如点击RecyclerView的某一个item进行更新操作，一定要进行item的clone操作（或该位置的新旧item的hashcode要不一样），要不然还是原来的item，那就diffutil没效果了；此时adapter.notifyItemRangeChanged()会有Item白光一闪的更新动画

### DiffUtil.Callback

```java
public abstract static class Callback {
    //老数据集size
    public abstract int getOldListSize();
    //新数据集size
    public abstract int getNewListSize();
    
    /**
     * Called by the DiffUtil to decide whether two object represent the same Item.
     * 被DiffUtil调用，用来判断 两个对象是否是相同的Item。
     * For example, if your items have unique ids, this method should check their id equality.
     * 例如，如果你的Item有唯一的id字段，这个方法就 判断id是否相等。
     * 本例判断name字段是否一致
     *
     * @param oldItemPosition The position of the item in the old list
     * @param newItemPosition The position of the item in the new list
     * @return True if the two items represent the same object or false if they are different.
     */
    public abstract boolean areItemsTheSame(int oldItemPosition, int newItemPosition);//新老数据集在同一个postion的Item是否是一个对象？（可能内容不同，如果这里返回true，会调用areContentsTheSame()方法）

    /**
     * Called by the DiffUtil when it wants to check whether two items have the same data.
     * 被DiffUtil调用，用来检查 两个item是否含有相同的数据
     * DiffUtil uses this information to detect if the contents of an item has changed.
     * DiffUtil用返回的信息（true false）来检测当前item的内容是否发生了变化
     * DiffUtil uses this method to check equality instead of {@link Object#equals(Object)}
     * DiffUtil 用这个方法替代equals方法去检查是否相等。
     * so that you can change its behavior depending on your UI.
     * 所以你可以根据你的UI去改变它的返回值
     * For example, if you are using DiffUtil with a
     * {@link android.support.v7.widget.RecyclerView.Adapter RecyclerView.Adapter}, you should
     * return whether the items' visual representations are the same.
     * 例如，如果你用RecyclerView.Adapter 配合DiffUtil使用，你需要返回Item的视觉表现是否相同。
     * This method is called only if {@link #areItemsTheSame(int, int)} returns
     * {@code true} for these items.
     * 这个方法仅仅在areItemsTheSame()返回true时，才调用。
     * @param oldItemPosition The position of the item in the old list
     * @param newItemPosition The position of the item in the new list which replaces the
     *                        oldItem
     * @return True if the contents of the items are the same or false if they are different.
     */
    public abstract boolean areContentsTheSame(int oldItemPosition, int newItemPosition);

    
    @Nullable
    public Object getChangePayload(int oldItemPosition, int newItemPosition) {
        return null;
    }
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688516614417-c438af58-3f05-4cc2-a657-86d0bd74b26d.png#averageHue=%23f7f7f7&clientId=u67093510-60d4-4&from=paste&height=506&id=u58887c71&originHeight=1264&originWidth=1440&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uda41e0d1-85e0-4b21-9fa9-ff958e50b2d&title=&width=576)

### DiffUtil.calculateDiff()

DiffResult calculateDiff([@NonNull ](/NonNull) Callback cb, boolean detectMoves)方法定义如下：

1. 第一个参数是DiffUtil.Callback对象，
2. 第二个参数代表是否检测Item的移动，改为false算法效率更高，按需设置，我们这里是true。

### DiffResult

利用DiffUtil.DiffResult对象的`dispatchUpdatesTo()`方法，传入RecyclerView的Adapter，替代mAdapter.notifyDataSetChanged()方法。<br />根据情况调用了adapter的四大定向刷新方法。

如果注册了`RecyclerView.AdapterDataObserver`并且同步处理事件，需要用`dispatchUpdatesTo(ListUpdateCallback)}`

- void dispatchUpdatesTo(RecyclerView.Adapter adapter)

```java
public void dispatchUpdatesTo(@NonNull final RecyclerView.Adapter adapter) {
    dispatchUpdatesTo(new AdapterListUpdateCallback(adapter));
}
```

默认是`AdapterListUpdateCallback`

- void dispatchUpdatesTo(ListUpdateCallback updateCallback)

使用：

```java
List oldList = mAdapter.getData();
DiffResult result = DiffUtil.calculateDiff(new MyCallback(oldList, newList));
mAdapter.setData(newList);
result.dispatchUpdatesTo(mAdapter);
```

### ListUpdateCallback

DiffUtil不仅仅只能和RecyclerView配合，我们也可以自己实现ListUpdateCallback接口的四个方法去做一些事情

## DiffUtil进阶

### DiffUtil getChangePayload

- public Object getChangePayload(int oldItemPosition, int newItemPosition)<br />返回的Object就是表示Item改变了哪些内容，null表示full update，不为null表示partial update。

```java
/**
 * When {@link #areItemsTheSame(int, int)} returns {@code true} for two items and
 * {@link #areContentsTheSame(int, int)} returns false for them, DiffUtil
 * calls this method to get a payload about the change.
 * <p>
 * 当{@link #areItemsTheSame(int, int)} 返回true，且{@link #areContentsTheSame(int, int)} 返回false时，DiffUtils会回调此方法，去得到这个Item（有哪些）改变的payload。
 * <p>
 * For example, if you are using DiffUtil with {@link RecyclerView}, you can return the
 * particular field that changed in the item and your
 * {@link RecyclerView.ItemAnimator ItemAnimator} can use that
 * information to run the correct animation.
 * <p>
 * 例如，如果你用RecyclerView配合DiffUtils，你可以返回  这个Item改变的那些字段，
 * {@link RecyclerView.ItemAnimator ItemAnimator} 可以用那些信息去执行正确的动画
 * <p>
 * Default implementation returns {@code null}.\
 * 默认的实现是返回null
 *
 * @param oldItemPosition The position of the item in the old list
 * @param newItemPosition The position of the item in the new list
 * @return A payload object that represents the change between the two items.
 * 返回 一个 代表着新老item的改变内容的 payload对象，
 */
@Nullable
@Override
public Object getChangePayload(int oldItemPosition, int newItemPosition)
```

如果item有多个需要更新

1. 返回Bundle

```java
@Nullable
@Override
public Object getChangePayload(int oldItemPosition, int newItemPosition) {
    //实现这个方法 就能成为文艺青年中的文艺青年
    // 定向刷新中的部分更新
    // 效率最高
    //只是没有了ItemChange的白光一闪动画，（反正我也觉得不太重要）
    TestBean oldBean = mOldDatas.get(oldItemPosition);
    TestBean newBean = mNewDatas.get(newItemPosition);

    //这里就不用比较核心字段了,一定相等
    Bundle payload = new Bundle();
    if (!oldBean.getDesc().equals(newBean.getDesc())) {
        payload.putString("KEY_DESC", newBean.getDesc());
    }
    if (oldBean.getPic() != newBean.getPic()) {
        payload.putInt("KEY_PIC", newBean.getPic());
    }

    if (payload.size() == 0)//如果没有变化 就传空
        return null;
    return payload;//
}
```

在Adapter判断：

```kotlin
override fun convert(helper: GiftBoxViewHolder, item: GiftResBean, position: Int, payloads: Bundle?) {
    if (payloads == null) {
        bind(helper, item, position)
    } else {
        checkGiftResStatus(helper, item, position)
        if (payloads.containsKey(GiftConstants.GiftBoxPayloads.PAYLOADS_STATUS)) {
            helper.getView<GiftBoxItemView>(R.id.gift_box_item_view).bind(position, item)
        }
        if (payloads.containsKey(GiftConstants.GiftBoxPayloads.PAYLOADS_COUNT)) {
            helper.getView<GiftBoxItemView>(R.id.gift_box_item_view).onUpdateCount(position, item)
        }
        if (payloads.containsKey(GiftConstants.GiftBoxPayloads.PAYLOADS_CHECKED)) {
            helper.getView<GiftBoxItemView>(R.id.gift_box_item_view).onChecked(position, item)
        }
        if (payloads.containsKey(GiftConstants.GiftBoxPayloads.PAYLOADS_FREE_GIFT)) {
            helper.getView<GiftBoxItemView>(R.id.gift_box_item_view).onCountDown(position, item)
        }
    }
}
```

2. 返回一个list

```kotlin
override fun getChangePayload(oldItemPosition: Int, newItemPosition: Int): Any? {
    val oldItem = oldList[oldItemPosition]
    val newItem = newList[newItemPosition]

    var payload: MutableList<Int>? = null
    if (oldItem.isFree != newItem.isFree || oldItem.isOwn != newItem.isOwn) {
        if (payload == null) {
            payload = mutableListOf()
        }
        payload.add(StoreGoodsListAdapter.PAYLOADS_OWNED)
    }
    if (oldItem.isSelected != newItem.isSelected) {
        if (payload == null) {
            payload = mutableListOf()
        }
        payload.add(StoreGoodsListAdapter.PAYLOADS_SELECTED)
    }
    if (oldItem.expireTo != newItem.expireTo) {
        if (payload == null) {
            payload = mutableListOf()
        }
        payload.add(StoreGoodsListAdapter.PAYLOADS_BUYED_EXPIRED)
    }
    if (oldItem.isOwnForeverNoExpiredGoods() != newItem.isOwnForeverNoExpiredGoods()) {
        if (payload == null) {
            payload = mutableListOf()
        }
        payload.add(StoreGoodsListAdapter.PAYLOADS_BUYED_FOREVER)
    }
    return payload
}
```

### 异步计算DiffUtil

在DiffUtil的源码头部注释中介绍了DiffUtil的相关信息，DiffUtil内部采用的`Eugene W. Myers’s difference`算法，但该算法不能检测移动的item，所以Google在其基础上改进支持检测移动项目，但是检测移动项目，会更耗性能。

在有1000项数据，200处改动时，这个算法的耗时：<br />打开了移动检测时：平均值：27.07ms，中位数：26.92ms。<br />关闭了移动检测时：平均值：13.54ms，中位数：13.36ms。

1. 如果我们的list过大，这个计算出DiffResult的时间还是蛮久的，所以我们应该将获取DiffResult的过程放到子线程中，并在主线程中更新RecyclerView。
2. Due to implementation constraints, the max size of the list can be 2^26.

### Myers 差分算法 (Myers Difference Algorithm)

- [ ] [Myers 差分算法 (Myers Difference Algorithm) —— DiffUtils 之核心算法（一）](https://mp.weixin.qq.com/s?__biz=MzIxNDE1NjQ2Mw==&mid=2649872403&idx=1&sn=4aa65e0479a435bba72eadf2c35192fd&chksm=8faeadd3b8d924c5f65dec994768a17a6642cddf0c7645695b27aa325841d0a41b4534423da6&scene=21#wechat_redirect)

### AsyncListUtil

AsyncListUtil 在 support-v7:23就存在了。它是异步加载数据的工具，它一般用于加载数据库数据，我们无需在UI线程上查询游标，同时它可以保持UI和缓存同步，并且始终只在内存中保留有限数量的数据。使用它可以获得更好的用户体验。<br />注意，这个类使用**单个线程**来加载数据，因此它适合从磁盘、数据库加载数据，不适用于从网络加载数据。

## AsyncListDiffer

### 背景

虽然SortedList、AsyncListUtil很方便了，但是大多数的列表都无需我们排序和加载本地数据，大多是获取网络数据展示。这个时候就可以使用DiffUtil了。DiffUtil是support-v7:24.2.0中的新工具类，它用来比较新旧两个数据集，寻找最小变化量，定向刷新列表。

不过DiffUtil的问题在于计算数据差异DiffUtil.calculateDiff(mDiffCallback)时是一个耗时操作，需要我们放到子线程去处理，最后在主线程刷新。为了方便这一操作，在support-v7:27.1.0又新增了一个DiffUtil的封装类，那就是AsyncListDiffer。

### AsyncListDiffer使用

#### 继承自RecyclerView.Adapter

1. 首先实现DiffUtil.ItemCallback
2. <br />

- MyDiffUtilItemCallback

```java
public class MyDiffUtilItemCallback extends DiffUtil.ItemCallback<TestBean> {
    @Override
    public boolean areItemsTheSame(@NonNull TestBean oldItem, @NonNull TestBean newItem) {
        return oldItem.getId() == newItem.getId();
    }
    @Override
    public boolean areContentsTheSame(@NonNull TestBean oldItem, @NonNull TestBean newItem) {
        return oldItem.getName().equals(newItem.getName());
    }
    @Nullable
    @Override
    public Object getChangePayload(@NonNull TestBean oldItem, @NonNull TestBean newItem) {
        // 这里就不用比较核心字段了,一定相等
        Bundle payload = new Bundle();

        if (!oldItem.getName().equals(newItem.getName())) {
            payload.putString("KEY_NAME", newItem.getName());
        }

        if (payload.size() == 0) {
            //如果没有变化 就传空
            return null;
        }
        return payload;
    }
}
```

- AsyncListDifferAdapter

```java
public class AsyncListDifferAdapter extends RecyclerView.Adapter<AsyncListDifferAdapter.ViewHolder> {

    private LayoutInflater mInflater;
    private AsyncListDiffer<TestBean> mDiffer;

    public AsyncListDifferAdapter(Context mContext) {
        mDiffer = new AsyncListDiffer<>(this, new MyDiffUtilItemCallback());
        mInflater = LayoutInflater.from(mContext);
    }

    public void setData(TestBean mData) {
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mDiffer.getCurrentList());
        mList.add(mData);
        mDiffer.submitList(mList);
    }

    public void setData(List<TestBean> mData) {
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mData);
        mDiffer.submitList(mList);
    }

    public void removeData(int index) {
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mDiffer.getCurrentList());
        mList.remove(index);
        mDiffer.submitList(mList);
    }

    public void clear() {
        mDiffer.submitList(null);
    }

    @Override
    @NonNull
    public AsyncListDifferAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(mInflater.inflate(R.layout.item_test, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position, @NonNull List<Object> payloads) {
        if (payloads.isEmpty()) {
            onBindViewHolder(holder, position);
        } else {
            Bundle bundle = (Bundle) payloads.get(0);
            holder.mTvName.setText(bundle.getString("KEY_NAME"));
        }
    }

    @Override
    public void onBindViewHolder(@NonNull AsyncListDifferAdapter.ViewHolder holder, final int position) {
        TestBean bean = mDiffer.getCurrentList().get(position);
        holder.mTvName.setText(bean.getName());
    }

    @Override
    public int getItemCount() {
        return mDiffer.getCurrentList().size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {

        TextView mTvName;

        ViewHolder(View itemView) {
            super(itemView);
            mTvName = itemView.findViewById(R.id.tv_name);
        }
    }
}
```

### 继承ListAdapter

另一种Adapter写法可以实现ListAdapter，它的内部帮我们实现了getItemCount()、getItem()和AsyncListDiffer的初始化。

```java
public class MyListAdapter extends ListAdapter<TestBean, MyListAdapter.ViewHolder> {
   
    private LayoutInflater mInflater;
    // 自己维护的集合
    private List<TestBean> mData = new ArrayList<>();
    
    public MyListAdapter(Context mContext) {
        super(new MyDiffUtilItemCallback());
        mInflater = LayoutInflater.from(mContext);
    }

    public void setData(TestBean testBean){
        mData.add(testBean);
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mData);
        // 提交新的数据集
        submitList(mList);
    }

    public void setData(List<TestBean> list){
        mData.clear();
        mData.addAll(list);
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mData);
        submitList(mList);
    }

    public void removeData(int index){
        mData.remove(index);
        List<TestBean> mList = new ArrayList<>();
        mList.addAll(mData);
        submitList(mList);
    }

    public void clear(){
        mData.clear();
        submitList(null);
    }
    
    @Override
    @NonNull
    public MyListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(mInflater.inflate(R.layout.item_test, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position, @NonNull List<Object> payloads) {
        if (payloads.isEmpty()) {
            onBindViewHolder(holder, position);
        } else {
            Bundle bundle = (Bundle) payloads.get(0);
            holder.mTvName.setText(bundle.getString("KEY_NAME"));
        }
    }

    @Override
    public void onBindViewHolder(@NonNull MyListAdapter.ViewHolder holder, final int position) {
        TestBean bean = getItem(position);
        holder.mTvName.setText(bean.getName());
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
		// ......
    }
}
```

## Ref

- [ ] 使用 AsyncListUtil 优化 RecyclerView<br /><https://zhuanlan.zhihu.com/p/29491805>
- [x] RecyclerView的好伴侣：详解DiffUtil<br /><https://blog.csdn.net/zxt0601/article/details/52562770>
- [x] 更高效地刷新 RecyclerView | DiffUtil二次封装<br /><https://juejin.cn/post/6882531923537707015>

## RecyclerView之SortedList

### SortedList介绍

**搭配RecyclerView使用，去重，有序，自动定向刷新**；并且SortedList会帮助你比较数据的差异，定向刷新数据(DiffUtil)。而不是简单粗暴的notifyDataSetChanged()。

它适用于**列表有序且不重复**的场景

### SortedListAdapterCallback

```java
public class SortedListCallback extends SortedListAdapterCallback<TestSortBean> {
    /**
     * Creates a {@link SortedList.Callback} that will forward data change events to the provided
     * Adapter.
     *
     * @param adapter The Adapter instance which should receive events from the SortedList.
     */
    public SortedListCallback(RecyclerView.Adapter adapter) {
        super(adapter);
    }

    /**
     * 和Comparator#compare类似,排序用的
     */
    @Override
    public int compare(TestSortBean o1, TestSortBean o2) {
        return o1.getId() - o2.getId();
    }

    /**
     * 和DiffUtil方法一致，不再赘述
     */
    @Override
    public boolean areItemsTheSame(TestSortBean item1, TestSortBean item2) {
        return item1.getId() == item2.getId();
    }
    /**
     * 和DiffUtil方法一致，不再赘述
     */
    @Override
    public boolean areContentsTheSame(TestSortBean oldItem, TestSortBean newItem) {
        //默认相同 有一个不同就是不同
        if (oldItem.getId() != newItem.getId()) {
            return false;
        }
        if (oldItem.getName().equals(newItem.getName())) {
            return false;
        }
        if (oldItem.getIcon() != newItem.getIcon()) {
            return false;
        }
        return true;
    }
}
```

### 应用场景

#### 在选择城市页面，都需要根据拼音首字母来排序

- SortedListAdapterCallback

```java
public class SortedListCallback extends SortedListAdapterCallback<City> {

    public SortedListCallback(RecyclerView.Adapter adapter) {
        super(adapter);
    }

    /**
     * 排序条件
     */
    @Override
    public int compare(City o1, City o2) {
        return o1.getFirstLetter().compareTo(o2.getFirstLetter());
    }

    /**
     * 用来判断两个对象是否是相同的Item。
     */
    @Override
    public boolean areItemsTheSame(City item1, City item2) {
        return item1.getId() == item2.getId();
    }

    /**
     * 用来判断两个对象是否是内容的Item。
     */
    @Override
    public boolean areContentsTheSame(City oldItem, City newItem) {
        if (oldItem.getId() != newItem.getId()) {
            return false;
        }
        return oldItem.getCityName().equals(newItem.getCityName());
    }
}
```

- RecyclerView.Adapter

```java
public class SortedAdapter extends RecyclerView.Adapter<SortedAdapter.ViewHolder> {

    // 数据源使用SortedList
    private SortedList<City> mSortedList;
    private LayoutInflater mInflater;

    public SortedAdapter(Context mContext) {
        mInflater = LayoutInflater.from(mContext);
    }

    public void setSortedList(SortedList<City> mSortedList) {
        this.mSortedList = mSortedList;
    }

    /**
     * 批量更新操作，例如：如果在循环中添加多个项，并且它们被放置到连续的索引中.
     * 
<pre>
     *     mSortedList.beginBatchedUpdates();
     *     try {
     *         mSortedList.add(item1)
     *         mSortedList.add(item2)
     *         mSortedList.remove(item3)
     *         ...
     *     } finally {
     *         mSortedList.endBatchedUpdates();
     *     }
     * </pre>
*/
    public void setData(City mData) {
        mSortedList.beginBatchedUpdates();
        mSortedList.addAll(mData);
        mSortedList.endBatchedUpdates();
    }

    public void setData(List<City> mData) {
        mSortedList.beginBatchedUpdates();
        mSortedList.addAll(mData);
        mSortedList.endBatchedUpdates();
    }

    public void removeData(int index) {
        mSortedList.removeItemAt(index);
    }

    public void clear() {
        mSortedList.clear();
    }

    @Override
    @NonNull
    public SortedAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(mInflater.inflate(R.layout.item_test, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull SortedAdapter.ViewHolder holder, final int position) {
        City bean = mSortedList.get(position);
        holder.mTvName.setText(bean.getCityName() + "(" + bean.getFirstLetter() + ")");
    }

    @Override
    public int getItemCount() {
        return mSortedList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {

        TextView mTvName;

        ViewHolder(View itemView) {
            super(itemView);
            mTvName = itemView.findViewById(R.id.tv_name);
        }
    }
}
```
