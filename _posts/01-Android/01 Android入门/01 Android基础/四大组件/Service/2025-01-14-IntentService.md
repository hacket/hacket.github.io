---
date created: Tuesday, January 14th 2025, 12:00:04 am
date updated: Tuesday, January 14th 2025, 12:02:07 am
title: IntentService
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
image-auto-upload: true
feed: show
format: list
categories: 
aliases: [IntentService]
linter-yaml-title-alias: IntentService
---

# IntentService

在 onHandleIntent 中处理耗时操作，多个耗时任务会依次执行，执行完毕⾃动结束。

## IntentService 简介

IntentService 是继承于 Service 并处理异步请求的一个类，在 IntentService 内有一个工作线程来处理耗时操作，启动 IntentService 的方式和启动传统 Service 一样，同时，当任务执行完后，IntentService 会自动停止，而不需要我们去手动控制。%3Cbr /%3E 可以启动 IntentService 多次，而每一个耗时操作会以工作队列的方式在 IntentService 的 onHandleIntent 回调方法中执行，并且，每次只会执行一个工作线程，执行完第一个再执行第二个，以此类推。

### 特点

1. 省去在 Service 手动开启子线程，每启动一次 Service 就会自动一个 Thread
2. 操作完成后，不用手动停止 Service（MessageQueue 队列中所有 Message 处理完毕才会关闭 Service）

### 缺点

1. 如果需要考虑并发，那么可能需要自己去扩展创建管理线程池

### 注意

1. 需要一个默认的构造器以及需要在清单文件中配置
2. 多次启动 service，IntentService 实例只有一个，但会开启两个线程。
3. 不要重写 IntentService 的 onStartCommand() 方法，而是重写 onHandleIntent 方法

## 源码分析

- 在 onCreate() 初始化了一个 HandlerThread 并启动及初始化了一个 Handler

```java
@Override
public void onCreate() {
    // TODO: It would be nice to have an option to hold a partial wakelock
    // during processing, and to have a static startService(Context, Intent)
    // method that would launch the service & hand off a wakelock.

    super.onCreate();
    HandlerThread thread = new HandlerThread("IntentService[" + mName + "]");
    thread.start();

    mServiceLooper = thread.getLooper();
    mServiceHandler = new ServiceHandler(mServiceLooper);
}
```

- 在每次调用 onStartCommand 时候，通过 mServiceHandler 发送一个消息，消息中包含我们的 intent。然后在该 mServiceHandler 的 handleMessage 中去回调 onHandleIntent(intent); 就可以了。

```java
@Override
public void onStart(Intent intent, int startId) {
    Message msg = mServiceHandler.obtainMessage();
    msg.arg1 = startId;
    msg.obj = intent;
    mServiceHandler.sendMessage(msg);
}

/**
 * You should not override this method for your IntentService. Instead,
 * override {@link #onHandleIntent}, which the system calls when the IntentService
 * receives a start request.
 * @see android.app.Service#onStartCommand
 */
@Override
public int onStartCommand(Intent intent, int flags, int startId) {
    onStart(intent, startId);
    return mRedelivery ? START_REDELIVER_INTENT : START_NOT_STICKY;
}
```

ServiceHandler 源码：

```java
private final class ServiceHandler extends Handler {
        public ServiceHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            onHandleIntent((Intent)msg.obj);
            stopSelf(msg.arg1);
        }
    }
```

回调完成后回调 handleMessage() 用 `stopSelf(msg.arg1)`，注意这个 msg.arg1 是个 int 值，相当于一个请求的唯一标识。每发送一个请求，会生成一个唯一的标识，然后将请求放入队列，当全部执行完成 (最后一个请求也就相当于 getLastStartId == startId)，或者当前发送的标识是最近发出的那一个（getLastStartId == startId），则会销毁我们的 Service。如果传入的是 -1 则直接销毁。

- 当任务完成销毁 Service 回调 onDestory，可以看到在 onDestroy 中释放了我们的 `Looper:mServiceLooper.quit()`。

```java
@Override
public void onDestroy() {
    mServiceLooper.quit();
}
```

## 参考

Android IntentService 完全解析 当 Service 遇到 Handler<br /><http://blog.csdn.net/lmj623565791/article/details/47143563>

# HandlerThread

- 一个带有 Looper 的线程类
- 不能同时进行多任务处理，要等待串行进行处理，处理效率低>)
