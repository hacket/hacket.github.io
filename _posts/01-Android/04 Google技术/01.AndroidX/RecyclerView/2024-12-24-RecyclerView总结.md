---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# RecyclerView

## RecyclerView四级缓存作用

RecyclerView有四级缓存，分别是mAttachedScrap(屏幕内)，mCacheViews(屏幕外)，mViewCacheExtension(自定义缓存)，mRecyclerPool(缓存池)

### scrap（屏幕内）

scrap是用来保存被rv移除掉但最近又马上要使用的缓存。用于屏幕内ViewHolder的快速重用，**使用position查找，不需要重新createView和bindView。**<br />可以使用detachAndScrapView()进行回收操作。

> 比如rv自带item的动画效果，本质上就是计算item的偏移量然后执行属性动画的过程，这中间可能就涉及到需要将动画之前的item保存下位置信息，动画后的item再保存下位置信息，然后利用这些位置数据生成相应的属性动画，就用scrap保存）

scrap缓存有两个成员**mChangedScrap**和**mAttachedScrap**

- mChangedScrap 存放可见范围内有更新的Item，一般调用adapter的notifyItemRangeChanged被移除的ViewHolder会保存到mChangedScrap
- mAttachedScrap 其他notify系列方法（不包括notifyDataSetChanged）移除的ViewHolder会被保存到mAttachedScrap中；使用场景：RecyclerView滚动时和在可见范围内删除Item后用notifyItemRemoved方法通知更新时

### cached （屏幕外）

**保存最近移出屏幕的ViewHolder，包含数据和position信息，复用时必须是相同位置的ViewHolder才能复用，不需要createViiew和bindView。**

> 对LinearLayoutManager来说cached缓存默认大小为2。

**应用场景**：那些需要来回滑动的列表，当往回滑动时，能直接复用ViewHolder数据。

### extension（自定义缓存）

自定义缓存，你可以决定缓存的保存逻辑，一般没有具体的使用场景。

### pool（缓存池）

当mCacheViews满了后或者adapter被更换，将mCacheViews中移出的ViewHolder放到mRecyclerPool中，放入之前会把ViewHolder数据清除掉，复用时需要重新bindView，并且复用时需要更过viewType来找缓存<br />可以使用removeAndRecycleView进行mRecyclerPool回收操作<br />默认大小为5。<br />**应用场景：**缓存Item的最终站，用于保存那些Removed、Changed以及mCacheViews满了之后更旧的item。

### RecyclerView缓存流程

RecyclerView四级缓存按照顺序依次读取。

#### 保存缓存流程

- 插入或删除itemView时，先把屏幕内的viewHolder保存mAttachedScrap中
- 滑动屏幕时，先消失的itemView会保存到mCacheViews，默认大小2，超过数量按FIFO移出头部的ItemView也就是最旧的ItemView保存到RecyclerPool缓存池，RecyclerPool缓存池会按照ItemView的itemType进行保存，每个itemType缓存个数为5，超过就会被回收。

#### 获取缓存流程 Recycler.getViewForPosition(pos)

- 先从mAttachScrap中获取，通过pos匹配ViewHolder
- 如果mAttachScrap获取失败，则从mCacheViews中获取，也是通过pos获取ViewHolder缓存
- 如果mCacheViews获取失败，则从自定义缓存中获取缓存
- 如果自定义缓存获取失败，就从mRecyclerPool中获取；如果获取到需要重新bindViewHolder
- 如果从mRecyclerPool获取失败，只能createViewHolder和bindViewHolder了

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675788711452-78d08272-27c6-4af2-bbbe-19e1a0ad2a0d.png#averageHue=%23fafaf9&clientId=u92a92831-3e9c-4&from=paste&height=217&id=u4ff182f1&originHeight=362&originWidth=896&originalType=binary&ratio=1&rotation=0&showTitle=false&size=68937&status=done&style=none&taskId=ufc4eca22-126d-4651-9072-d444b86553d&title=&width=538.3333740234375)

## Prefetch 预取下一个

### 什么是Prefetch？

在RV v25+和API21+，RV自带的优化功能，默认开启。<br />在CPU空闲的时候预取接下来要显示的item，提前缓存ViewHolder以供下次使用，让RV使用体验更流畅

### Prefetch原理

Android是通过16ms刷新一次页面来保证UI的流畅程度的，现在Android系统中通过CPU产生数据，然后交给GPU渲染的形式来完成的。当CPU完成数据处理交给GPU后就一直处于空闲状态，需要等待下一帧才会进行数据处理，而这空闲时间就被白白浪费了，如何才能压榨CPU的性能，让它一直处于忙碌状态，这就是prefetch要做的事情，RV会预取接下来可能要显示的item，在下一帧到来之前提前处理完数据，然后将得到的ViewHolder缓存起来，等待真正要使用的时候直接从缓存中取出来即可。

## RecyclerView性能优化项

见`UI优化→RecyclerView优化`
