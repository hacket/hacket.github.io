---
date_created: Tuesday, August 13th 2024, 1:01:13 am
date_updated: Sunday, January 19th 2025, 10:20:31 am
title: LocalBroadcastManager
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
tags: [broadcastreceiver]
image-auto-upload: true
feed: show
format: list
categories:
  - Android
aliases: [LocalBroadcastManager]
linter-yaml-title-alias: LocalBroadcastManager
---

# LocalBroadcastManager

## 引入缘由

BroadcastReceiver 存在安全性问题

1. 当应用程序发送某个广播时系统会将发送的 Intent 与系统中所有注册的 `BroadcastReceiver` 的 IntentFilter 进行匹配，若匹配成功则执行相应的 onReceive 函数。可以通过类似 `sendBroadcast(Intent, String)` 的接口在发送广播时指定接收者必须具备的 `permission`。或通过 `Intent.setPackage` 设置广播仅对某个程序有效。
2. 当应用程序注册了某个广播时，即便设置了 IntentFilter 还是会接收到来自其他应用程序的广播进行匹配判断。对于动态注册的广播可以通过类似 `registerReceiver(BroadcastReceiver, IntentFilter, String, android.os.Handler)` 的接口指定发送者必须具备的 `permission`，对于静态注册的广播可以通过 `android:exported="false"` 属性表示接收者对外部应用程序不可用，即不接受来自外部的广播。

上面两个问题其实都可以通过 `LocalBroadcastManager` 来解决，Android v 4 兼容包提供 `android.support.v4.content.LocalBroadcastManager` 工具类，帮助大家在自己的进程内进行局部广播发送与注册，使用它比直接通过 `sendBroadcast(Intent)` 发送系统全局广播有以下几点好处:

- 因广播数据在本应用范围内传播，不用担心隐私数据泄露问题
- 不能跨进程
- 不用担心别的应用伪造广播，造成安全隐患
- 相比系统内发送全局广播，它更高效

## 使用

```java
// 注册广播
LocalBroadcastManager.getInstance(context).registerReceiver(localReceiver, new IntentFilter("me.hacket.action.Test"));
// 发送广播
LocalBroadcastManager.getInstance(context).sendBroadcast(new Intent("me.hacket.action.Test"));

// 取消注册广播
LocalBroadcastManager.getInstance(context).unregisterReceiver(localReceiver);
```

## 原理

`LocalBroadcastManager` 底层是通过 `Handler` 机制实现的：

```java
private LocalBroadcastManager(Context context) {
	mAppContext = context;
	mHandler = new Handler(context.getMainLooper()) {

		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
				case MSG_EXEC_PENDING_BROADCASTS:
		// 创建运行在主线程的Handler   
				  executePendingBroadcasts();
					break;
				default:
					super.handleMessage(msg);
			}
		}
	};
}
```

注册方式只支持代码注册, 也不用和 **system_server** 交互, 即可完成广播的全过程, 如果不需要跨进程传递数据，可以使用本地广播，效率会更高
