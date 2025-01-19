---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Sunday, January 19th 2025, 2:23:53 pm
title: Android14适配(API34 AndroidU)
author: hacket
categories: [Android]
category: 
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
tags: []
date created: Invalid date
date updated: Tuesday, January 7th 2025, 11:28:11 pm
image-auto-upload: true
feed: show
format: list
aliases: ["`Android14` 所有 app 行为，无论 `targetSdkVersion` 是否为 34"]
linter-yaml-title-alias: "`Android14` 所有 app 行为，无论 `targetSdkVersion` 是否为 34"
---

[功能和 API 概览  |  Android Developers](https://developer.android.com/about/versions/14/features?hl=zh-cn)

# `Android14` 所有 app 行为，无论 `targetSdkVersion` 是否为 34

## 字体放大最高达 200%

当用户增大或减小字体设置时，应用程序的布局和界面需要能够适当地调整，以保持用户界面的清晰和可用性

如果代码种已使用放大像素 (sp) 单位来定义文本大小，这项系统变更可能不会对应用产生太大影响

> 在启用最大字体大小 (200%) 的情况下执行界面测试，以确保应用正确应用字体大小，并检查是否存在文本溢出或布局错乱等显示问题 [使用非线性字体放大测试应用](https://developer.android.com/about/versions/14/features?hl=zh-cn#test-scaling)

## SCHEDULE_EXACT_ALARM 权限默认关闭

```java
setExact()  
setExactAndAllowWhileIdle()  
setAlarmClock()

// 使用AlarmManager的以上方法需要SCHEDULE_EXACT_ALARM 权限，否则系统会抛出 SecurityException
```

## 应用只能终止自己的后台进程

在 Android 14 的设备上，`killBackgroundProcesses` 方法只能终止自己 App 的后台进程，传入其他 App 的包名时对其后台进程没有影响

## 新增对照片和视频的部分访问权限

新增 `READ_MEDIA_VISUAL_USER_SELECTED` 权限，使用户拥有更多的选择，可以将相册中所有的图片和视频授予给第三方应用，也可以将部分的图片和视频给第三方应用

官方建议使用 `PhotoPicker` 来实现媒体文件的读写，可以省去权限的处理 ([Photo picker  |  Android Developers](https://developer.android.com/training/data-storage/shared/photopicker))

**适配：**

- 清单声明权限：

```xml
<uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />
```

- 检查是否获取照片或/视频访问权限：判断是否有对应访问权限，以 `READ_MEDIA_IMAGES` 或 `READ_MEDIA_VIDEO` 授权状态为准
- 动态申请照片/视频权限时：检查 `android.permission.READ_MEDIA_VISUAL_USER_SELECTED` 权限状态：
  - 如果已授权：
	则申请  `READ_MEDIA_IMAGES` 或 `READ_MEDIA_VIDEO`
  - 如果未授权：
	      则申请 `READ_MEDIA_IMAGES + READ_MEDIA_VISUAL_USER_SELECTED`  或 `READ_MEDIA_VIDEO + READ_MEDIA_VISUAL_USER_SELECTED`

- 选择 " 部分照片和视频 "，会唤起系统媒体文件选择器，选择部分媒体文件后，会回调如下授权结果：

```java
android.permission.READ_MEDIA_VISUAL_USER_SELECTED --> 0
android.permission.READ_MEDIA_IMAGES  -->  -1
```

这种选择下应该判定为已授权，直接唤起项目中图片选择器展示即可

![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240322095546.png)

选择 " 全部允许 ", 会回调如下授权结果：

```java
android.permission.READ_MEDIA_VISUAL_USER_SELECTED --> 0
android.permission.READ_MEDIA_IMAGES  -->  0
```

这种选择下判定为已授权，直接唤起项目中图片选择器展示即可

[GitHub - LuckSiege/PictureSelector: Picture Selector Library for Android or 图片选择器](https://github.com/LuckSiege/PictureSelector)

## 关于不可关闭通知用户体验方式的变更

对于通过 `Notification.Builder.setOngoing(true)`，`NotificationCompat.Builder.setOngoing(true)`\
和设置 `Notification.FLAG_ONGOING_EVENT` 标识来创建的不可关闭的前台通知，用户在 Android14 上可以关闭此类通知

## Live Activity

### 概述

Live Activities 是 Android 14 中新增的功能，允许应用通过动态更新通知展示实时信息。与传统的静态通知不同，Live Activities 使得通知内容可以在实时变化的同时提供更丰富的交互体验。用户无需打开应用，即可在通知栏和锁屏界面查看实时数据，这为应用提供了一个更加流畅和实时的用户体验。

是否存在？

# 以下行为变更仅影响以 Android 14（API 级别 34）或更高版本为目标平台的应用

## 必须提供前台服务类型

必须为应用中的每个前台服务指定至少一个前台服务类型：([前台服务类型是必需的  |  Android Developers](https://developer.android.com/about/versions/14/changes/fgs-types-required?hl=zh-cn))

1.根据前台服务的具体用途配置 `foregroundServiceType`

2.Manifest 文件增加前台服务类型对应的必须声明权限

3.启动前台服务时务必检查运行时权限是否授权

## 蓝牙 API 权限调整

API 调整：

`BluetoothAdapter.getProfileConnectionState()` 方法需要 `BLUETOOTH_CONNECT` 权限

适配：

1.Manifest 文件增加 BLUETOOTH_CONNECT 权限声明

2.在执行 BluetoothAdapter.getProfileConnectionState() 方法前检测用户是否授予了 BLUETOOTH_CONNECT 权限

## JobScheduler 行为变更

行为变更：

- JobServices 的 onStartJob 或 onStopJob 方法在主线程允许的执行时间内没有结束，系统会触发 ANR
- 如果没有在 AndroidManifest 中声明 `ACCESS_NETWORK_STATE` 权限，使用 `JobInfo.Builder.setRequiredNetworkType` 或 `JobInfo.Builder.setRequiredNetwork` 配置可执行任务的网状况的约束条件时，系统会抛出 `SecurityException`

适配：

1. 检查 JobServices 的 onStartJob 或 onStopJob 中是否存在主线程耗时操作（如果存在，可考虑迁移到 WorkManager）
2. 检查 JobServices 是否调用设置网络状况约束条件相关 API，如果存在，添加权限声明

## 非 SDK 接口更新

Android 14 更新了受限制非 SDK 接口列表 ([Android 14 的所有非 SDK 接口的完整列表](https://developer.android.com/about/versions/14/changes/non-sdk-14?hl=zh-cn)

1. 根据最新非 SDK API 列表，使用 lint 或其他工具排查项目中的调用，评估影响并进行 API **替换**
2. 排查业务代码执行中，logcat 是否有受限 api 调用的日志提醒，评估影响并进行 API 替换

`VeriDex-Tool` 扫描结果进一步分析：[针对非 SDK 接口的限制  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/app-compatibility/restrictions-non-sdk-interfaces#test-veridex-tool)

## OpenJDK 17 更新

Android14 更新 Android 的核心库，使其与最新的 OpenJDK LTS 版本的特性、功能保持一致，包括对库的更新以及对应用和平台开发人员的 Java17 语言的支持 ([OpenJDK更新](https://developer.android.com/about/versions/14/behavior-changes-14?hl=zh-cn#core-libraries))

适配：

1. 确认项目中是否存在以下方面兼容性问题：
2. 检查正则表达式使用是否存在对无效组的引用：`  java.util.regex.Matcher  ` 类对于无效的组引用会抛出 `IllegalArgumentException`
3. 检查 UUID.fromString() 方法是否会抛出异常, 传入字符串长度大于 36，抛出 IllegalArgumentException("UUID string too large")

## 对隐式 intent 和 pending intent 增加限制

限制：

1. 通过隐式 Intent 或隐式 Intent 创建的 PendingIntent 只能打开设置了 `android:exported="true"` 的组件，如果 android: exported 属性值为 false，系统会抛出异常
2. 设置了 mutable 标识的 pending intent，没有指定待跳转组件名称或包名的情况，系统会抛出异常

(可变 PendingIntent 允许接收者（和任何能够接收到这个 PendingIntent 的应用）修改它包含的 Intent 的细节。在许多情况下，保持 PendingIntent 为不可变是一个更安全的选择，因为它限制了潜在的恶意修改)

适配：

1. 排查项目中 `android:exported="false"` 的组件，检查是否有隐式 intent 跳转到该组件的情况，对 export 标识或隐式 intent 做修改
2. 确认项目中是否有设置了 mutable 标识的 pending intent，并且是通过隐式 intent 创建的，做相应适配

**示例：**

```xml
<activity
    android:name=".AppActivity"
    android:exported="false">
    <intent-filter>
        <action android:name="com.example.action.APP_ACTION" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

如果我们使用下面的方式，通过隐式意图打开 `activity` 将会抛出异常。

```kotlin
// Throws an exception when targeting Android 14.
context.startActivity(Intent("com.example.action.APP_ACTION"))
```

如果要启动 exported = false 的组件，应该使用显示意图。

```kotlin
// This makes the intent explicit.
val explicitIntent = Intent("com.example.action.APP_ACTION")
explicitIntent.apply {
    package = context.packageName
}
context.startActivity(explicitIntent)
```

## 在运行时注册的广播接收器必须指定导出行为

变更：

1. 通过 Context 注册接收自定义广播的广播接收者时必须设置是否导出
2. 通过 Context 注册只接收系统广播的广播接收者时不用设置是否导出

适配：

在 Android 14 上，运行时通过 `Context#registerReceiver()` 动态注册广播接收器，需要设置标记 `RECEIVER_EXPORTED` 或 `RECEIVER_NOT_EXPORTED` ，标识是否导出该广播，避免应用程序出现安全漏洞，如果注册的是系统广播，则不需要指定标记。

## 动态加载代码增加限制

限制：

应用中动态加载代码时，动态加载的文件（Jar、Dex、Apk 格式）需要设置成只读

适配：

排查项目使用动态加载代码的逻辑，设置文件只读：调用 `File#setReadOnly()`

## 新增从后台启动 activity 的限制

限制：

1. 使用 PendingIntent 从后台打开 Activity 时，创建 PendingIntent 时需要传 activityOptions，同时 activityOptions 必须调用以下方法设置模式 setPendingIntentBackgroundActivityStartMode(MODE_BACKGROUND_ACTIVITY_START_ALLOWED)
2. 一个可见应用使用 bindService() 绑定另一个应用在后台运行的服务时，如果想要将后台启动 Activity 的权限授予被绑定服务，需要在 bindService() 方法中传入 BIND_ALLOW_ACTIVITY_STARTS

bindService(serviceIntent, serviceConnection, Context.BIND_ALLOW_ACTIVITY_STARTS)

适配：

1. 排查从后台启动我们应用中组件的场景是否能够正常启动
2. 排查项目中代码在 `bindService` 的时候是否有必要传 `BIND_ALLOW_ACTIVITY_STARTS` 标识

## Zip 文件路径遍历漏洞

为防止 Zip 文件路径遍历的漏洞，使用 `ZipFile(String)` 或 `ZipInputStream.getNextEntry()` 时，如果 Zip 文件条目名称以 "`/`" 开头或者包含 "`..`"，系统会抛出 ZipException

如需关闭以上验证，需要调用 `ZipPathValidator#clearCallback()`，暂时没有一个官方提供的方法来重新启用这个验证

适配：

排查项目中 ZipFile 使用场景，是否存在条目命名问题

## MediaProjection 行为变更

行为变更：

使用 MediaProjection 进行屏幕捕获或录制时，下列情况会导致系统抛出异常。

1. 调用 MediaProjection.createVirtualDisplay() 前不注册 MediaProjection.Callback 回调
2. 使用同一个 MediaProjection 对象多次调用 createVirtualDisplay 方法

适配：

- 针对抛出异常的场景进行适配
