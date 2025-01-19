---
date_created: Monday, April 1st 2024, 1:27:34 am
date_updated: Sunday, January 19th 2025, 10:20:10 am
title: BroadcastReceiver
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
aliases: [BroadcastReceiver 基础]
linter-yaml-title-alias: BroadcastReceiver 基础
---

# BroadcastReceiver 基础

## 广播概述

广播接收器是 Android 中的组件之一，它使应用程序能够侦听并响应来自其他应用程序或系统本身的广播消息。将它们视为等待特定事件发生的侦听器。

应用程序可以使用广播接收器响应系统范围的事件，例如 `电池电量变化`、`网络连接` 和 `传入的 SMS 消息`。

广播消息只不过是一个 `Intent` 。此 `Intent` 的 `action` 字符串标识发生的事件（例如， `android.intent.action.AIRPLANE_MODE` 表示 `Airplane mode` 开启了）。Intent 还可以包括捆绑到其额外字段中的附加信息。例如，`the airplane mode intent` 包括指示 `Airplane Mode` 是否打开的额外布尔值。

## 广播分类

### 有序广播

使用 `sendOrderedBroadcast(Intent, String)` 方法发送出去的广播被广播接收者按照先后顺序接收，先接收的广播接收者可以对广播进行截断或修改。

它一次向一个接收器发送广播。假设我们有多个接收者正在监听我们的自定义操作，当我们使用此方法发送广播时，一次只有一个接收者会获得 `onReceive()` 回调，而其他接收者只有在前一个函数完全执行时才会获得。接收器运行的顺序可以通过匹配意图过滤器 `android:priority` 属性来控制；具有相同优先级的接收器将以任意顺序运行。

```kotlin
// Sender App
val intent = Intent("TEST_CUSTOM_ACTION")
intent.putExtra("data", "Some custom data")
sendOrderedBroadcast(intent, null)

// Receiver App
registerReceiver(customReceiver,
    IntentFilter("TEST_CUSTOM_ACTION").apply {
        priority = SYSTEM_HIGH_PRIORITY 
    }, RECEIVER_EXPORTED
)
```

### 无序广播

最常用的广播，发送广播使用方式如下：

```java
Intent intent = new Intent();
intent.setAction("me.hacket.TEST_BROADCAST");
sendBroadcast(intent);
```

### 系统广播

Android 中内置了多个系统广播：只要涉及到手机的基本操作（如开机、网络状态变化、拍照等等），都会发出相应的广播。每个广播都有特定的 `Intent-Filter`（包括具体的 action）。当使用系统广播时，只需要在注册广播接收者时定义相关的 action 即可，并不需要手动发送广播，当系统有相关操作时会自动进行系统广播。

### 粘性广播 (`sendStickBroadcast`)

### 本地广播 (`LocalBroadcastManager`)

见：[[LocalBroadcastManager]]

## Implicit 和 Explicit BroadcastReceiver

在 Android 中，广播（Broadcast）是一种使应用可以发送或接收意图（Intent）的消息传递机制，它包括两种类型：隐式（Implicit）和显式（Explicit）。

### 显式 （Explicit）广播

显式广播是直接指向特定应用组件（如 BroadcastReceiver）的意图。这意味着在发送广播的时候，你已经明确知道要将这条消息发送到哪个特定的接收者。在创建 Intent 的时候，你会通过指定组件的名称来发送显式广播。例如，若你想启动一个已知的服务或者接收者，你会在 Intent 中设置那个组件的类名。

```java
Intent intent = new Intent(this, MyBroadcastReceiver.class);
sendBroadcast(intent);
```

### 隐式（Implicit）广播

与显式广播不同，隐式广播不是发送给某个特定组件，而是发送给所有对某个动作（Action）感兴趣的接收者。你通过设置 Intent 的动作（Action）和/或数据（Data）和/或类别（Category）等属性来定义这类广播。对于隐式广播，系统会将其传递给所有与该意图过滤条件相匹配的接收器。

```java
Intent intent = new Intent("com.example.ACTION_MY_BROADCAST");
sendBroadcast(intent);
```

从 Android 8.0（Oreo）开始，隐式广播的使用受到了限制，因为广泛使用隐式广播会影响系统性能，尤其是当多个应用同时监听同一个广播时。一些常用的系统级隐式广播（如网络状态变化）不再对应用程序广播，除非应用使用显式广播或者通过服务如 JobScheduler 安排相关任务，或者注册特定不受限制的隐式广播。

具体见：[[Android8.0适配(API26 AndroidO)#广播限制]]

## 广播发送、接收

### 广播发送

我们可以通过调用不同的方法发送不同类型的广播

如有序广播（`sendOrderedBroadcast`），无序广播（`sendBroadcast`），本地广播（`LocalBroadcastManager.sendBroadcast`）

如果不需要跨进程传递数据，可以使用本地广播，效率会更高。

### 广播接收

应用程序可以通过两种方式接收广播：清单声明的接收器和上下文注册的接收器。两种方式：

1. 清单文件静态注册
2. 程序中使用动态注册

注册广播接收要注意，在持有广播的类生命周期结束时，要取消广播的注册，否则可能会导致内存泄漏。

#### Manifest-declared receivers (Static Broadcast Receiver) 静态广播接收器

如果我们在清单文件中声明广播接收器，则在发送广播时，如果应用程序尚未运行（应用程序 `onCreate()` 被触发），系统将启动我们的应用程序。

##### 示例

我们有一个应用程序应该知道设备何时收到短信，以实现这一点，创建一个扩展 android `BroadcastReceiver` 类并重写 `onReceive()` 方法的 SmsReceiver 类

```kotlin
//Receiver App
class SmsReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if(intent?.action == "android.provider.Telephony.SMS_RECEIVED") { // it's best practice to verify intent action before performing any operation
            Log.i("ReceiverApp", "SMS Received")
        }
    }
}
```

添加接收短信权限，然后添加接收者：

```xml
<!--Receiver App-->
<uses-permission android:name="android.permission.RECEIVE_SMS"/>
<application>
..
..
  <receiver android:name=".SmsReceiver"
    android:exported="true">
    <intent-filter>
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
  </receiver>
..
..
</application>
```

> 使 receiver 能够从外部 app 接受事件，将 `android:exported` 为 `true` ，如果想在本地接收，则将其设置为 `false` 。

##### 背后原理

安装应用程序时，系统包管理器会注册接收器。然后，接收器成为我们应用程序的单独入口点，这意味着如果应用程序当前未运行，系统可以启动应用程序并传送广播。

##### Android 8.0 静态广播限制

从 Android 8.0（API 级别 26）开始，我们无法使用清单来声明大多数隐式广播（不专门针对我们的应用程序的广播）的接收器。检查可以使用清单声明的接收器的广播 [列表](https://developer.android.com/develop/background-work/background-tasks/broadcasts/broadcast-exceptions)。然而，我们总是可以使用上下文注册的接收器。

- [Implicit broadcast exceptions](https://developer.android.com/develop/background-work/background-tasks/broadcasts/broadcast-exceptions)

#### Context-registered receivers (Dynamic Broadcast Receiver) 动态广播接收器

`Context-registered receivers` 只要上下文注册的接收者的注册上下文有效，它们就会接收广播。例如，如果我们在 activity 上下文中注册，只要 activity 没有被销毁，我们就会收到广播。

如果我们向 application 上下文注册，只要应用程序正在运行，我们就会收到广播。

要实现 `context-registered` 的广播，请从清单文件中删除接收器，然后将其注册到 `activity` 中：

```kotlin
// Receiver App
private val smsReceiver = SmsReceiver()

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    registerReceiver(smsReceiver, 
        IntentFilter("android.provider.Telephony.SMS_RECEIVED")
    )
}

override fun onDestroy() {
    super.onDestroy()
    unregisterReceiver(smsReceiver)
}
```

## 自定义广播

下面将了解如何创建和发送我们自己的自定义广播。

### Sending broadcasts 发送广播

任何应用程序都可以使用 `sendBroadcast(Intent)` 发送广播。

```kotlin
//Sender App
// To send broadcase from any application, specify the custom action to intent and sendBroadcast
val intent = Intent("TEST_CUSTOM_ACTION")
intent.putExtra("data", "Some custom data")
sendBroadcast(intent)
```

这样，所有正在侦听 `TEST_CUSTOM_ACTION` 意图的应用程序都将异步接收广播

我们还可以通过在意图上调用 `setPackage(String)` 来限制对特定应用程序的广播。通过这种方式，广播将仅发送到具有提到的包名称的单个应用程序。

```kotlin
//Sender App
val intent = Intent("TEST_CUSTOM_ACTION")
intent.putExtra("data", "Some custom data")
intent.setPackage("com.example.receiverapp")
sendBroadcast(intent)
```

### Receiving Broadcasts 接收广播

要接收广播，我们需要使用上下文注册的接收器（从 Android 8.0 开始，我们不能使用清单声明的接收器来进行自定义广播，需要指定 package 才行）

```kotlin
// Receiver App
private val customReceiver = CustomReceiver()

override fun onCreate(savedInstanceState: Bundle?) {
	super.onCreate(savedInstanceState)
	Log.i("ReceiverApp", "activity created")
	setContentView(R.layout.activity_main)
	registerReceiver(customReceiver,
		IntentFilter("TEST_CUSTOM_ACTION"), RECEIVER_EXPORTED
	)
}

override fun onDestroy() {
	super.onDestroy()
	Log.i("ReceiverApp", "activity destroyed")
	unregisterReceiver(customReceiver)
}

//Receiver App
class CustomReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if(intent?.action == "TEST_CUSTOM_ACTION") {
            val value = intent.extras?.getString("data")
            Log.i("ReceiverApp", "Custom Received: $value")
        }

    }
}
```

自定义广播需要添加 `RECEIVER_EXPORTED` 标志，它表示其他应用程序可以将广播发送到我们的应用程序。如果我们不添加这个标志，Android 将抛出以下异常：

```shell
java.lang.SecurityException: com.example.receiverapp: One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED should be specified when a receiver isn’t being registered exclusively for system broadcasts
```

## 通过权限限制广播

权限允许我们将广播限制到拥有某些权限的应用程序集。

假设我们想向具有 internet 权限的应用程序发送广播，我们可以指定一个权限参数。

```kotlin
//Sender App
val intent = Intent("TEST_CUSTOM_ACTION")
intent.putExtra("data", "Some custom data")
sendBroadcast(intent, Manifest.permission.INTERNET
```

只有在清单中使用标签请求许可的接收者（如果存在危险，则随后被授予许可）才能接收广播。

要接收广播，请在清单文件中声明权限

```xml
<!--Receiver App-->
<uses-permission android:name="android.permission.INTERNET"/>
```

注册广播：

```kotlin
//Receiver App  
registerReceiver(customReceiver,  
	IntentFilter("TEST_CUSTOM_ACTION"), Manifest.permission.INTERNET, null, RECEIVER_EXPORTED  
)
```

### 自定义广播权限

也可以自定义广播权限。

```xml
<manifest
  xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example.myapp" >
    
    <permission
      android:name="com.example.myapp.permission.DEADLY_ACTIVITY"
      android:label="@string/permlab_deadlyActivity"
      android:description="@string/permdesc_deadlyActivity"
      android:permissionGroup="android.permission-group.COST_MONEY"
      android:protectionLevel="dangerous" />
    ...
</manifest>
```

- [定义自定义应用权限  |  Android Developers](https://developer.android.com/guide/topics/permissions/defining)

## 为广播添加权限

为广播添加权限其实就是限制广播的发送者或者接收者，以达到过滤的目的。

### 限制接收者

假如现在要发送一个广播，我们并不希望所有人都能接收这个广播，我们可以考虑在使用 `Context.sendBroadcast()` 或 `Context.sendOrderedBroadcast()` 发送的时候附带一个权限参数。我们可以使用系统的权限，也可以重新定义一个权限。

假如现在要发送一个带有自定义权限的广播，首先得在 AndroidManifest.xml 定义这个权限

```xml
<permission android:name="me.hacket.sender.receiver_permission"/>
```

然后在发送广播的时候，把这个权限作为参数传入方法

```java
Intent intent = new Intent("some_action");
sendBroadcast(intent, "me.hacket.sender.receiver_permission");
```

`sendBroadcast()` 的第二个参数就是自定义的权限。当然，如果你希望清单注册的广播接收器能接收到这个广播，还得转成隐式来发送广播。

为了接收这个广播，接收的应用必须在 `AndroidManifest.xml` 中申请使用这个权限

```xml
<uses-permission android:name="me.hacket.sender.receiver_permission" />
```

### 限制发送者

假设现在我们已经有一个广播接收器，我们并不希望所有人都能发送广播给这个接收器，我们可以在注册这个广播的接收器的时候添加一个权限。

同样，如果添加的权限是自定义权限，首先得在 `AndroidManifest.xml` 中定义：

```xml
<permission android:name="me.hacket.receiver.sender_permission" />
```

然后在注册的时候使用这个权限。我们知道广播接收器的注册有两个方式，一个是动态注册，一个是静态注册。

如果是静态注册，在 `AndroidManifest.xml` 中的代码如下

```xml
<receiver android:name=".MyReceiver" android:permission="me.hacket.receiver.sender_permission">
	<intent-filter>
		<action android:name="me.hacket.reciever.action" />
	</intent-filter>
</receiver>
```

如果是动态注册，例如在 Activity 中注册，代码如下

```java
IntentFilter filter = new IntentFilter("com.bxll.reciever.action");
registerReceiver(receiver, filter, "me.hacket.reciever.sender_permission", null);
```

那么广播的发送者只要在 `AndroidManifest.xml` 中申请了这个权限，就可以发送广播给这个接收者

```xml
<uses-permission android:name="me.hacket.receiver.sender_permission" />
```

### 小结

无论是在发送广播，还是在注册广播接收器时添加了权限，只需要在另一方的 AndroidManifest.xml 中申请这个权限即可，并不需要做额外处理。

## 广播接收器对宿主进程状态的影响

当一个广播接收器的 `onReceive()` 在执行时候，系统认为这个广播接收器的宿主进程处理前台，并且会保持这个进程继续运行，除非在系统内存极度紧张的状态下才会杀死这个进程。

然而，当广播接收器的 `onReceive()` 方法执行完毕后，并且宿主只有这个一个广播接收器在运行，那么系统认为这个宿主进程处理低优先级状态，并且很可能杀死这个进程来释放资源。

所以，我们不应该在 `onReceive()` 创建一个后台线程用于处理任务 (广播接收器在主线程中执行)，因为宿主进程可能被杀死，后台线程会被终止。如果我们遇到了一定要在后台线程处理任务的情况，可以使用 `JobScheduler` 来计划将来要执行的任务，或者调用 `goSync()` 表明你需要更多时间在后台处理任务，这样系统就会知道进程需要继续执行任务，从而在正常的情况下不会杀死进程。

```java
public class MyBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult pendingResult = goAsync();
        Task asyncTask = new Task(pendingResult);
        asyncTask.execute();
    }

    private static class Task extends AsyncTask<String, Integer, String> {

        private final PendingResult pendingResult;

        private Task(PendingResult pendingResult) {
            this.pendingResult = pendingResult;
        }

        @Override
        protected String doInBackground(String... strings) {
			// 这里执行耗时任务
            return "some_result";
        }

        @Override
        protected void onPostExecute(String s) {
            // 通知系统任务执行完毕
            pendingResult.finish();
        }
    }
}
```

### goSync()

在 `onReceive()` 中调用 `goSync()` 方法通知系统进程需要更多时间处理任务，`goSync()` 会返回一个 `PendingResult` 对象，当任务执行完毕，还需要调用 `PendingResult` 的 `finish()` 通知系统进程的后台任务执行完毕，此时系统会根据情况决定是否杀死进程来释放资源。

**注意：调用 goSync() 之后，也不要在任务执行里面做耗时操作，一样会触发 Broadcast 的 ANR**

`PendingResult.finish()` 的作用是完成当前广播，然后进程才能处理下个广播。因此，即使在 `goAsync()` 后，创建异步线程执行任务，仍然需要在大约 10s 的时间内调用 `PendingResult.finish()`，否则系统会认为 ANR。

`goAsync()` 的作用只是保证 Receiver 处于一段时间的 active 状态，保证进程不会被杀死。并不能简单理解为调用 goAsync() 之后，就能后来处理长时间的任务。

要在 `Reciever` 中处理长时间任务，还是得用 `Service` `或JobScheduler` 或 `JobIntentService`，或者 `WorkManager`。

## 跨进程广播

- 需要在清单文件中注册，且 exposed 要设置为 true
- 发送广播时，要设置 setPackage，否则广播收不到

### 无权限

- xml 配置广播，配置在子进程

```xml
<receiver
	android:name=".receiver.AppBackgroundReceiver"
	android:exported="true"
	android:process=":background">
	<intent-filter>
		<action android:name="me.hacket.app.BACKGROUND" />
	</intent-filter>
</receiver>
```

- 广播代码

```kotlin
class AppBackgroundReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            "me.hacket.app.BACKGROUND" -> {
                // ...
            }
        }
   
```

- 发送广播

```kotlin
// 主进程发送
val intent = Intent("me.hacket.app.BACKGROUND")
intent.setPackage(application.packageName)
sendBroadcast(intent)
```

### 有权限

# 问题

## 广播未生效，未设置 `setPackage`

**现象：** Android8 及以上手机，静态注册的广播不生效：

```kotlin
val intent = Intent("me.hacket.app.BACKGROUND")  
sendBroadcast(intent)

// 清单配置
<receiver  
    android:name=".receiver.AppBackgroundReceiver"  
    android:exported="true">  
	<intent-filter>        
		<action android:name="me.hacket.app.BACKGROUND" />  
	</intent-filter>
</receiver>
```

**原因：** Android 8.0 对清单文件中静态注册的广播做了限制，只有指定了 package 的静态注册的广播才能收到

**解决：**

```kotlin
val intent = Intent("me.hacket.app.BACKGROUND")
intent.setPackage(application.packageName)
sendBroadcast(intent)
```

**Ref:**

- [Context-registered broadcast receiver registered with RECEIVER_NOT_EXPORTED do not receive broadcasts with custom actions from the same app](https://issuetracker.google.com/issues/293487554)
- [broadcastreceiver - Android 14 context registered broadcast receivers not working - Stack Overflow](https://stackoverflow.com/questions/76919130/android-14-context-registered-broadcast-receivers-not-working)
