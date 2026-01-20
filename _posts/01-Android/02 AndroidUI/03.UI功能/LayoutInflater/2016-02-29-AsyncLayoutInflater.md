---
banner: 
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Wednesday, May 14th 2025, 12:50:55 am
title: AsyncLayoutInflater
author: hacket
categories:
  - AndroidUI
category: UI基础
tags: [UI基础]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:30:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:55:13 晚上
image-auto-upload: true
feed: show
format: list
aliases: [AsyncLayoutInflater]
linter-yaml-title-alias: AsyncLayoutInflater
---

# AsyncLayoutInflater

AsyncLayoutInflater 用于异步布局加载

## 介绍

Android 在 View 的使用中，过多的布局文件 inflate 影响性能，尤其在一些滚动列表、样式种类很丰富的场景下，inflate 次数相对较多，整体 inflate 耗时就会增加，导致滚动过程卡顿。

所以，需要 View 的异步 inflate，甚至 View 的全局缓存，通过这些方式，去减少 UI 线程 inflate 的耗时及次数，以便减少卡顿，提升性能。

## AsyncLayoutInflater 使用

```kotlin
class AsyncLayoutInflaterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val pb = ProgressBar(this)
        setContentView(pb)

        val s = System.currentTimeMillis()
        thread {
            LogUtils.logi("inflate", "thread.sleep", "模拟耗时的inflate。。。")
            SystemClock.sleep(2000)
            runOnUiThread {
                // AsyncLayoutInflater不能直接在非UI线程使用
                AsyncLayoutInflater(this@AsyncLayoutInflaterActivity)
                        .inflate(R.layout.activity_async_inflater_demo, null) { view, resid, parent ->

                            setContentView(view)
                            LogUtils.logi("inflate", "onInflateFinished", "耗时${System.currentTimeMillis() - s}ms")
                        }
            }
        }
    }
}
```

## AndroidX AsyncLayoutInflater 的限制

- 单一的线程
- 如果超过 10 个 items，主线程会 delay
- 不支持设置一个 `LayoutInflater.Factory` 和 `LayoutInflater.Factory2`
- 没有方式取消正在进行的 inflate 操作

## 官方 AsyncLayoutInflater 不足

### 布局属性限制

- **不支持父容器属性**
异步转换出来的 View 并没有被加到 parent 中，必须手动添加，AsyncLayoutInflater 是调用了 `LayoutInflater.inflate(int, ViewGroup, false)`；`parent` 参数仅用于计算 `LayoutParams`，实际添加到父容器需手动操作，可能导致布局属性失效（如 `merge` 标签）。

```java
public void runInner() {
	InflateRequest request;
	try {
		request = (InflateRequest)this.mQueue.take();
	} catch (InterruptedException var4) {
		Log.w("AsyncLayoutInflater", var4);
		return;
	}

	try {
		request.view = request.inflater.mInflater.inflate(request.resid, request.parent, false);
	} catch (RuntimeException var3) {
		Log.w("AsyncLayoutInflater", "Failed to inflate resource in the background! Retrying on the UI thread", var3);
	}

	Message.obtain(request.inflater.mHandler, 0, request).sendToTarget();
}
```

解决：异步转换出来的 View 自动将其添加到 parent 中

### 线程模型简单

- **单线程瓶颈**：
使用单线程来做全部的 inflate 工作，如果一个界面中 layout 很多不一定能满足需求；高并发场景下可能排队。
解决：引入线程池，减少单线程等待

- **无优先级控制**
无法优先处理紧急布局请求。

- **不是 Looper 线程**
所构建的 View 中不能直接使用 Handler 或者调用 Looper.myLooper()，因为异步线程默认没有调用 Looper.prepare()；
是在一个 `InflateThread` 线程中调用的，该线程不是 Looper 线程

- **非主线程不能使用 AsyncLayoutInflater**
不能在非主线程中调用 AsyncLayoutInflater，因为异步线程默认没有调用 Looper.prepare()；AsyncLayoutInflater 初始化的时候 new 了 Handler，如果该线程不是 Looper 线程，会报错

```java
public AsyncLayoutInflater(Context context) {
	this.mInflater = new BasicInflater(context);
	this.mHandler = new Handler(this.mHandlerCallback);
	this.mInflateThread = AsyncLayoutInflater.InflateThread.getInstance();
}
```

- **异常处理缺失**：
后台线程的异常（如无效布局 ID）未捕获，直接导致应用崩溃。

### 其他

- AsyncLayoutInflater 不支持设置 LayoutInflater.Factory 或者 LayoutInflater.Factory2；
- 不能取消进行的任务，对生命周期无感知
- 缓存队列默认 10 的大小限制如果超过了 10 个则会导致主线程的等待
- 如果在异步加载 view 还没有添加到 parent 时，做一些 View 操作或者依赖 context 的操作，容易出问题，mashi 项目就出现大量这样的问题
- 不支持 fragment
- layoutinflater 布局的时候，可以统计该 view 加载时的耗时

### AsyncLayoutInflater 改造

#### LZWAsyncLayoutInflater

<https://github.com/AweiLoveAndroid/LZWAsyncLayoutInflater>

#### OkLayoutInflater

<https://medium.com/okcredit/oklayoutinflater-3c5cd93c6ebc>

## Ref

- [ ] Android AsyncLayoutInflater 限制及改进<https://www.jianshu.com/p/f0c0eda06ae4>
