---
banner: 
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Thursday, March 27th 2025, 1:18:57 am
title: RecyclerView总结
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [RecyclerView]
linter-yaml-title-alias: RecyclerView
---

# RecyclerView

## RecyclerView 四级缓存作用

RecyclerView 有四级缓存，分别是 mAttachedScrap(屏幕内)，mCacheViews(屏幕外)，mViewCacheExtension(自定义缓存)，mRecyclerPool(缓存池)

### scrap（屏幕内）

scrap 是用来保存被 rv 移除掉但最近又马上要使用的缓存。用于屏幕内 ViewHolder 的快速重用，**使用 position 查找，不需要重新 createView 和 bindView。**<br />可以使用 detachAndScrapView() 进行回收操作。

> 比如 rv 自带 item 的动画效果，本质上就是计算 item 的偏移量然后执行属性动画的过程，这中间可能就涉及到需要将动画之前的 item 保存下位置信息，动画后的 item 再保存下位置信息，然后利用这些位置数据生成相应的属性动画，就用 scrap 保存）

scrap 缓存有两个成员**mChangedScrap**和**mAttachedScrap**

- mChangedScrap 存放可见范围内有更新的 Item，一般调用 adapter 的 notifyItemRangeChanged 被移除的 ViewHolder 会保存到 mChangedScrap
- mAttachedScrap 其他 notify 系列方法（不包括 notifyDataSetChanged）移除的 ViewHolder 会被保存到 mAttachedScrap 中；使用场景：RecyclerView 滚动时和在可见范围内删除 Item 后用 notifyItemRemoved 方法通知更新时

### cached （屏幕外）

**保存最近移出屏幕的 ViewHolder，包含数据和 position 信息，复用时必须是相同位置的 ViewHolder 才能复用，不需要 createViiew 和 bindView。**

> 对 LinearLayoutManager 来说 cached 缓存默认大小为 2。

**应用场景**：那些需要来回滑动的列表，当往回滑动时，能直接复用 ViewHolder 数据。

### extension（自定义缓存）

自定义缓存，你可以决定缓存的保存逻辑，一般没有具体的使用场景。

### pool（缓存池）

当 mCacheViews 满了后或者 adapter 被更换，将 mCacheViews 中移出的 ViewHolder 放到 mRecyclerPool 中，放入之前会把 ViewHolder 数据清除掉，复用时需要重新 bindView，并且复用时需要更过 viewType 来找缓存<br />可以使用 removeAndRecycleView 进行 mRecyclerPool 回收操作<br />默认大小为 5。<br />**应用场景：**缓存 Item 的最终站，用于保存那些 Removed、Changed 以及 mCacheViews 满了之后更旧的 item。

### RecyclerView 缓存流程

RecyclerView 四级缓存按照顺序依次读取。

#### 保存缓存流程

- 插入或删除 itemView 时，先把屏幕内的 viewHolder 保存 mAttachedScrap 中
- 滑动屏幕时，先消失的 itemView 会保存到 mCacheViews，默认大小 2，超过数量按 FIFO 移出头部的 ItemView 也就是最旧的 ItemView 保存到 RecyclerPool 缓存池，RecyclerPool 缓存池会按照 ItemView 的 itemType 进行保存，每个 itemType 缓存个数为 5，超过就会被回收。

#### 获取缓存流程 Recycler.getViewForPosition(pos)

- 先从 mAttachScrap 中获取，通过 pos 匹配 ViewHolder
- 如果 mAttachScrap 获取失败，则从 mCacheViews 中获取，也是通过 pos 获取 ViewHolder 缓存
- 如果 mCacheViews 获取失败，则从自定义缓存中获取缓存
- 如果自定义缓存获取失败，就从 mRecyclerPool 中获取；如果获取到需要重新 bindViewHolder
- 如果从 mRecyclerPool 获取失败，只能 createViewHolder 和 bindViewHolder 了

![mtlz3](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/mtlz3.png)

## Prefetch 预取下一个

### 什么是 Prefetch？

在 RV v25+ 和 API21+，RV 自带的优化功能，默认开启。<br />在 CPU 空闲的时候预取接下来要显示的 item，提前缓存 ViewHolder 以供下次使用，让 RV 使用体验更流畅

### Prefetch 原理

Android 是通过 16ms 刷新一次页面来保证 UI 的流畅程度的，现在 Android 系统中通过 CPU 产生数据，然后交给 GPU 渲染的形式来完成的。当 CPU 完成数据处理交给 GPU 后就一直处于空闲状态，需要等待下一帧才会进行数据处理，而这空闲时间就被白白浪费了，如何才能压榨 CPU 的性能，让它一直处于忙碌状态，这就是 prefetch 要做的事情，RV 会预取接下来可能要显示的 item，在下一帧到来之前提前处理完数据，然后将得到的 ViewHolder 缓存起来，等待真正要使用的时候直接从缓存中取出来即可。

## RecyclerView 性能优化项

见： [[RecyclerView优化]]
