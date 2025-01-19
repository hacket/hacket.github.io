---
date_created: Tuesday, August 13th 2024, 1:19:06 am
date_updated: Monday, January 20th 2025, 12:07:37 am
title: BroadcastReceiver版本适配
author: hacket
categories:
  - Android
category: 四大组件
tags: [四大组件, broadcastreceiver]
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
aliases: [Android 7.0 广播限制]
linter-yaml-title-alias: Android 7.0 广播限制
---

# Android 7.0 广播限制

## 广播限制

在 Android 7.0（Nougat）中引入了一些变化，这些变化对广播（Broadcasts）进行了限制，主要是为了提高设备的性能和电池寿命。以下是一些主要的限制：

1. **后台服务限制**：
   为了减少后台服务的影响，Android 7.0 引入了对后台服务的新限制。特别是当应用在后台运行时，限制其使用 `startService()` 方法启动后台服务。这是为了减少后台服务的运行时间，优化内存使用并延长电池寿命。开发者需要使用 `JobScheduler` 来安排这些后台任务。

2. 网络连接变化广播的限制：
   在之前的 Android 版本中，应用可以通过监听 `CONNECTIVITY_ACTION` 广播来知道网络连接何时发生变化。从 Android 7.0 开始，`CONNECTIVITY_ACTION` 广播不再会通知那些在后台运行的应用；在清单文件中注册也收不到。仅当应用在前台时，才能接收该广播。这意味着，应用需要寻找其他方式来监听网络变化，例如使用 `NetworkCallback`。

3. **隐式广播限制**：
   为了减少对系统性能的影响，Android 7.0 对隐式广播进行了限制。这些限制主要影响了那些在清单文件中静态注册 BroadcastReceiver 的行为。这意味着一些广播只能通过动态注册（即在应用的执行过程中注册）来接收。

4. Doze 模式和 App Standby 的增强：
   虽然这些特性在 Android 6.0（Marshmallow）中引入，但在 Android 7.0（Nougat）中进行了增强。在 Doze 模式和 App Standby 模式下，系统会限制应用的网络访问和对广播的响应，以节省电量和 CPU。

开发者需要采取相应的适应措施，比如使用 WorkManager 来安排异步任务，注册网络状态变化的 BroadcastReceiver 来适时启动或终止服务，以及动态注册（而不是在 AndroidManifest 中注册）广播接收器，以符合 Android 7.0 的行为变化。

### CONNECTIVITY_ACTION 广播

- [x] [Restrictions on receiving network activity broadcasts](https://developer.android.com/topic/performance/background-optimization#connectivity-action)

面向 Android 7.0（API 级别 24）的应用程序不会收到 [CONNECTIVITY_ACTION](https://developer.android.com/reference/android/net/ConnectivityManager#CONNECTIVITY_ACTION) 广播如果他们 注册以在其清单中接收它们，以及依赖于此的进程 广播将不会开始。

这可能会给想要的应用程序带来问题 侦听网络变化或执行批量网络活动 设备连接到不按流量计费的网络。

如果解决？

#### 动态注册广播

注册于 [Context.registerReceiver()](https://developer.android.com/reference/android/content/Context#registerReceiver(android.content.BroadcastReceiver,%20android.content.IntentFilter)) 在应用程序运行时继续接收这些广播。

#### 在 unmetered connections 安排 jobs（使用 JobScheduler 或 WorkManager）

当使用 `JobInfo.Builder` 类来构建你的 `JobInfo` 对象，应用 `setRequiredNetworkType()` 方法和通过 `JobInfo.NETWORK_TYPE_UNMETERED` 作为作业参数。以下代码示例安排在设备连接到不按流量计费的网络并充电时运行的服务：

```kotlin
const val MY_BACKGROUND_JOB = 0
// ...
fun scheduleJob(context: Context) {
    val jobScheduler = context.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
    val job = JobInfo.Builder(
		MY_BACKGROUND_JOB,
		ComponentName(context, MyJobService::class.java)
	)
		.setRequiredNetworkType(JobInfo.NETWORK_TYPE_UNMETERED)
		.setRequiresCharging(true)
		.build()
    jobScheduler.schedule(job)
}
```

当满足您的作业条件时，您的应用程序会收到回调以运行 `MyJobService` 中的 `onStartJob()`。

JobScheduler 的新替代方案是 WorkManager。

#### 在应用程序运行时监控网络连接

正在运行的应用程序仍然可以监听 `CONNECTIVITY_CHANGE` 与注册的 `BroadcastReceiver` 。然而， `ConnectivityManager` API 提供了一种更稳健的方法，仅在满足指定的网络条件时请求回调。

`NetworkRequest` 对象定义网络回调的参数 `NetworkCapabilities` 。你创造 `NetworkRequest` 对象与 `NetworkRequest.Builder` class。 `registerNetworkCallback()` 然后通过 `NetworkRequest` 对系统提出异议。当网络条件满足时，应用程序会收到回调来执行 `onAvailable()` 其中定义的方法 `ConnectivityManager.NetworkCallback` class。

应用程序继续接收回调，直到应用程序退出或调用 `unregisterNetworkCallback()` 。

### image and video broadcasts 限制

在 Android 7.0（API 级别 24）中，应用程序无法发送或接收 `ACTION_NEW_PICTURE` 或者 `ACTION_NEW_VIDEO` 广播。当必须唤醒多个应用程序才能处理新图像或视频时，此限制有助于减轻性能和用户体验影响。 Android 7.0（API 级别 24）扩展 `JobInfo` 和 `JobParameters` 提供替代解决方案。

#### Trigger jobs on content URI changes

为了在内容 URI 更改时触发作业，Android 7.0（API 级别 24）扩展了 `JobInfo` API 有以下方法：

- `JobInfo.TriggerContentUri()` 封装在内容 URI 更改时触发作业所需的参数。
- `JobInfo.Builder.addTriggerContentUri()`

以下示例代码安排一个作业在系统报告内容 URI 发生更改时触发， `MEDIA_URI` :

```kotlin
const val MY_BACKGROUND_JOB = 0
// ...
fun scheduleJob(context: Context) {
    val jobScheduler = context.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
    val job = JobInfo.Builder(
            MY_BACKGROUND_JOB,
            ComponentName(context, MediaContentJob::class.java)
    )
		.addTriggerContentUri(
				JobInfo.TriggerContentUri(
						MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
						JobInfo.TriggerContentUri.FLAG_NOTIFY_FOR_DESCENDANTS
				)
		)
		.build()
    jobScheduler.schedule(job)
}
```

当系统报告指定内容 URI 发生更改时，您的应用程序会收到回调和 `JobParameters` 对象被传递给 `onStartJob()` 中的方法 `MediaContentJob.class` 。

#### Determine which content authorities triggered a job

- [ ] [Determine which content authorities triggered a job](https://developer.android.com/topic/performance/background-optimization#new-jobparam)

Android 7.0（API 级别 24）还扩展了 `JobParameters` 允许您的应用程序接收有关哪些内容权限和 URI 触发了作业的有用信息：

### background processes adb 调试

- [ ] [Further optimize your app](https://developer.android.com/topic/performance/background-optimization#further-optimization)

- 要模拟隐式广播和后台服务不可用的情况，请输入以下命令：

```shell
adb shell cmd appops set <package_name> RUN_IN_BACKGROUND ignore
```

- 要重新启用隐式广播和后台服务，请输入以下命令：

```shell
adb shell cmd appops set <package_name> RUN_IN_BACKGROUND allow
```

- 您可以模拟用户将您的应用程序置于 "`restricted`" 状态以进行后台电池使用。此设置会阻止您的应用程序在后台运行。为此，请在终端窗口中运行以下命令：

```shell
adb shell cmd appops set <PACKAGE_NAME> RUN_ANY_IN_BACKGROUND deny
```

# Android 8.0

## Android 8.0 广播限制

- [x] [Broadcast Limitations](https://developer.android.com/about/versions/oreo/background#broadcasts)

每次发送广播时，应用的接收器都会消耗资源。如果多个应用注册了接收基于系统事件的广播，这会引发问题；触发广播的系统事件会导致所有应用快速地连续消耗资源，从而降低用户体验。为了缓解这一问题，Android 7.0（API 级别 25）对广播施加了一些限制（[Background Optimization](https://developer.android.com/topic/performance/background-optimization)），而 Android 8.0 让这些限制更为严格。

主要是针对为所有 APP 的 `manifest-registered`

- APP 无法在清单文件注册隐式广播 (静态注册不了隐式广播)

> 面向 Android 8.0 或更高版本的应用程序无法再在其清单中注册 `implicit` 广播的广播接收器，除非广播专门限于该应用程序。隐式广播是不针对应用程序内特定组件的广播。例如， `ACTION_PACKAGE_REPLACED` 会发送到所有应用程序中的所有已注册侦听器，让他们知道设备上的某些包已被替换。由于广播是隐式的，因此它不会传递到面向 Android 8.0 或更高版本的应用程序中的清单注册接收器。 `ACTION_MY_PACKAGE_REPLACED` 也是隐式广播，但由于它仅发送到其包被替换的应用程序，因此将被传递到 `manifest-registere` 的接收器。

- 应用可以继续在它们的清单中注册 `explicit` 显示广播
- 应用可以在运行时使用 `context.registerReceiver()` 注册任意广播（不管是隐式还是显式广播）
- 需要签名权限 ([signature permission](https://developer.android.com/guide/topics/manifest/permission-element#plevel)) 的广播不受此限制所限，因为这些广播只会发送到使用相同证书签名的应用，而不是发送到设备上的所有应用

在许多情况下，之前注册隐式广播的应用可以通过使用 JobScheduler 作业获得类似的功能。

> 例如，社交照片应用程序可能需要不时地对其数据进行清理，并且更喜欢在设备连接到充电器时执行此操作。以前，应用程序在其清单中注册了 `ACTION_POWER_CONNECTED` 的接收器；当应用程序收到该广播时，它会检查是否有必要进行清理。要迁移到 Android 8.0 或更高版本，应用程序会从其清单中删除该接收器。相反，应用程序会安排在设备空闲和充电时运行的清理作业。

### 隐式广播限制解除

无法接收隐式广播，那么就发送显式广播，例如可以在发送广播的时候指定接收者的包名

```java
Intent intent = new Intent("some_action");
// 指定接收者的包名发送显式广播
intent.setPackage("receiver_package");
sendBroadcast(intent);
```

如果你是系统开发人员，还可以通过添加一个 flag 突破这个限制

```java
Intent intent = new Intent("some_action");
// 这个flag表示清单注册的广播接收器也能接收到隐式广播
intent.addFlags(Intent.FLAG_RECEIVER_INCLUDE_BACKGROUND);
sendBroadcast(intent);
```

`Intent.FLAG_RECEIVER_INCLUDE_BACKGROUND` 对第三方应用不开放，然而有意思的是，第三方应用可以直接把这个 flag 替换为对应的值，也可以突破这个限制

```java
Intent intent = new Intent("some_action");
// 第三方应用直接指定值
intent.addFlags(0x01000000);
sendBroadcast(intent);
```

## Android 8.0 静态广播豁免

注意，还有很多隐式广播当前不受此限制所限。应用可以继续在其清单中为这些广播注册接收器，不管应用针对哪个 API 级别。有关已豁免广播的列表请参阅隐式广播例外。

- [x] [Implicit broadcast exceptions](https://developer.android.com/develop/background-work/background-tasks/broadcasts/broadcast-exceptions)

# Android 14

在 Android 14 上，运行时通过 `Context#registerReceiver()` 动态注册广播接收器，需要设置标记 `RECEIVER_EXPORTED` 或 `RECEIVER_NOT_EXPORTED` ，标识是否导出该广播，避免应用程序出现安全漏洞，如果注册的是系统广播，则不需要指定标记。

# Ref

## 各个版本广播的变动

- [[Android7.0适配(API24 AndroidN)#广播限制]]
- [[Android8.0适配(API26 AndroidO)#广播限制]]
