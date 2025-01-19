---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Monday, January 20th 2025, 12:18:30 am
title: Android13适配(API33 AndroidT)
author: hacket
categories:
  - Android
category: Android适配
tags: [系统版本适配, Android适配]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期六, 八月 3日 2024, 10:21:00 晚上
date updated: 星期四, 一月 2日 2025, 9:17:48 晚上
image-auto-upload: true
feed: show
format: list
aliases: [针对所有 `Android13` 上运行的 APP]
linter-yaml-title-alias: 针对所有 `Android13` 上运行的 APP
---

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697855868350-4b2558d3-1aa8-4e01-851e-18429271eba0.png)

- [x] [Android13新特性](https://developer.android.google.cn/about/versions/13/features)
- [x] [所有APP：针对运行在Android13手机上的所有APP的行为变更（忽略targetSdkVersion）](https://developer.android.google.cn/about/versions/13/behavior-changes-all)
- [x] [只针对targetSdkVersion=33且运行在Android13手机上的APP的变更](https://developer.android.google.cn/about/versions/13/behavior-changes-13)
- [x] [oppo Android 13 应用兼容性适配指导](https://open.oppomobile.com/new/developmentDoc/info?id=11311)

# 针对所有 `Android13` 上运行的 APP

针对运行在 Android13 手机上的所有 APP 的行为变更（忽略 `targetSdkVersion`）

## 前台服务 (FGS) 任务管理器

Android13 还新增了前台服务（FGS）任务管理器功能。<br>如下图，用户可以在下拉的通知栏中直接关闭前台服务和应用程序：![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/fgs-manager.svg)<br>此外，如果系统检测到应用长时间运行某项前台服务（在 24 小时的时间段内至少运行 20 小时），便会向用户发送提醒通知，通知内容如下：

> APP is running in the background for a long time. Tap to review.

值得注意的是，满足以下任一条件的情况下，系统均将不会显示该通知：

- 已经发送过前台服务相关的通知，也就是说，用户未关闭之前的提醒通知
- 前台服务的类型为 `FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK` 或 `FOREGROUND_SERVICE_TYPE_LOCATION`

**注意：**如果系统针对某应用已经显示过此通知，那至少在 30 天后系统才会再次显示该通知。另外，系统级应用、安全应用（比如具有 android.app.role.EMERGENCY 角色的应用）等运行的前台服务，将不会显示在 FGS 任务管理器中。

## intent 过滤器会屏蔽不匹配的 intent

当您的应用向以 Android 13 或更高版本为目标平台的其他应用的导出组件发送 intent 时，仅当该 intent 与接收应用中的 `<intent-filter>` 元素匹配时，系统才会传送该 intent。换言之，系统会屏蔽所有不匹配的 intent，但以下情况除外：

- 目标组件未声明任何 `<intent-filter>`
- 同一应用内发送的 intent
- 由系统发送的 intent
- 具有 ROOT 权限的进程发送的 intent

如果接收方应用升级到 Android 13 或更高版本，仅当 intent 与其声明的 元素匹配时，源自外部应用的所有 intent 才会传送到导出组件，而不考虑发送应用的目标 SDK 版本。<br>所以我们需要检查应用内是否有通过 Intent 方式启动其他 App 或发送广播，同时检查 action、data 等信息是否准确

## [通知适配变更为动态权限](https://developer.android.google.cn/guide/topics/ui/notifiers/notification-permission?hl=zh-cn)

### 对新安装的应用的影响

在 Android13 的设备的 APP，通知权限默认关闭；除非你动态申请通知权限且授权后才能发送通知

- `targetSdkVersion>=33`，需要动态申请通知权限
- `targetSdkVersion<33`，在创建第一个 `通知渠道` 时，系统会显示弹出通知权限对话框。这通常是在应用启动时

> media sessions 的 notification 和 self-manage phone calls 的 APP 不受这个变更的影响

#### `targetSdkVersion 小于33`

通知权限默认关闭，自动弹出授权弹窗

1. 当 App 使用通知栏功能时，系统将自动弹出授权弹窗

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697808288272-17d4ee94-ff79-47cd-8408-6b1baddd8021.png)<br>用户点击 " 允许 "，App 可正常给用户推送消息

> 除了 " 允许 " 和 " 不允许 " 两种选择外，用户还可以划走权限申请对话框（User swipes away from dialog），即用户未选择授权（也未选择不授权）。那么下次 App 进行通知栏消息推送时，系统将再次弹出用户授权弹窗。

#### `targetSdkVersion 大于等于33`

1. 开发者需要在 AndroidManifest.xml 中声明 `POST_NOTIFICATIONS` 权限

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.gt.demo.mubai.push">
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
</manifest>
```

2. 还需要在使用通知栏推送功能时在代码中动态申请运行时权限：

```kotlin
// 动态申请POST_NOTIFICATIONS权限 >= android 13
if (VERSION.SDK_INT >= VERSION_CODES.TIRAMISU) {
    val checkPermission = ContextCompat.checkSelfPermission(this@MainTabsActivity, Manifest.permission.POST_NOTIFICATIONS)
    if (checkPermission != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(this@MainTabsActivity, arrayOf<String>(
            Manifest.permission.POST_NOTIFICATIONS), REQUEST_PUSH_PERMISSIONS)
    }
}

// 通知权限判断
fun isNotificationEnabled(context: Context): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        try {
            // 所有通道都关闭检测为通知关闭，只要有一个通道开启，就默认为开启了通知
            if (NotificationManagerCompat.from(context).areNotificationsEnabled()) {
                val channels =
                    (context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).notificationChannels
                if (channels.isEmpty()) {
                    return true
                }
                channels.forEach {
                    if (it.importance != NotificationManager.IMPORTANCE_NONE) {
                        return true
                    }
                }
            }
            false
        } catch (e: Exception) {
            try {
                NotificationManagerCompat.from(context).areNotificationsEnabled()
            } catch (ignore: Exception) {
                true
            }
        }
    } else {
        try {
            NotificationManagerCompat.from(context).areNotificationsEnabled()
        } catch (ignore: Exception) {
            true
        }
    }
}
```

3. 授权弹窗一旦被用户拒绝授权，下次系统将不会再出现权限申请的弹窗
4. 如果 App 仍然要推送重要消息（比如重大版本更新）给用户，则需要引导用户前往设置界面打开通知权限。代码如下：

```java
private void jumpNotificationSetting() {
    final ApplicationInfo applicationInfo = getApplicationInfo()
    try {
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
        intent.putExtra("app_package", applicationInfo.packageName);
        intent.putExtra("android.provider.extra.APP_PACKAGE", applicationInfo.packageName);
        intent.putExtra("app_uid", applicationInfo.uid);
        startActivity(intent);
    } catch (Throwable t) {
        t.printStackTrace();
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
        intent.setData(Uri.fromParts("package", applicationInfo.packageName, null));
        startActivity(intent);
    }
}
```

实测发现，在 Android13 的手机（Pixel 6），targetSdkVersion>=33 的 APP，不动态申请通知权限，也是会弹出这个弹窗

##### 关闭通知权限 App 进程杀死？

Android13 的手机，在设置页，通知权限从开到关闭，App 进程会重启<br>问题现象：ROMWE APP 开启通知后关闭通知，返回 romwe 时出现几秒页面空白<br>分析：<br>跳转到通知权限的设置页面，通知权限从打开到关闭，App 进程重启了

- Android 13 系统去 setting 页关闭通知，会导致 app 进程重启，出现了这个白屏
- Android 12 进程不会重启，功能正常

### 对现有应用更新的影响

升级到 Android13 的设备，之前有通知权限的 APP，自动授予通知权限，而不用动态去申请通知权限

# targetSdkVersion=33

只针对 targetSdkVersion=33 且运行在 Android13 手机上的 APP 的变更

## 可空变成了非可控

> Android 13 上这里的代码多了一个@NonNull 的注解

如果适配过程中有类似问题，不要盲目删除 "?"。需要注意一下低版本的运行情况。注意 checkNotNullParameter 的校验。

### AnimatorListener

Animator.AnimatorListener 变动，变成了非空<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688125963363-a0870d72-0b4d-46fd-874d-eebdf06f7007.png)

### onViewDetachedFromWindow

override fun onViewDetachedFromWindow(v: View?) ，v 也是非空的了

### GestureDetector

GestureDetector.OnGestureListener 接口报错<br>onScroll 方法的 MotionEvent 参数不会为空。原因是 Android 13 上这里的代码多了一个 `@NonNull` 的注解。<br>本以为删除可空的 "?" 就正常了，但发现在低版本手机上会报错：

> Fatal Exception: java.lang.NullPointerException:
> Parameter specified as non-null is null: method android.view.GestureDetector.onTouchEvent, parameter e1

因为低版本手机上，这里拿到的 MotionEvent 为空。但是在 kotlin 中，变量不可空时，它会使用 `checkNotNullParameter` 方法校验，如果为 null 就会发生上面的异常。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697857454059-f55d00e5-fd6c-4011-b5f6-730ca84dd229.png)<br>所以如果你是用 Java 实现的，不会存在这个问题。那么解决方法之一就是改用 java 实现。或者可以加上 `@Suppress("NOTHING_TO_OVERRIDE", "ACCIDENTAL_OVERRIDE")` 这样就不会生成 checkNotNullParameter 校验代码。

GestureDetector.SimpleOnGestureListener 的 MotionEvent�变成了非空<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1689765778159-3e7e1ddb-2df9-4eae-97ee-59fba06164d5.png)

### View.AccessibilityDelegate�

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1689765843225-f0000bef-7aad-44eb-b9a7-a4f35056f863.png)

### Parcelable�

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1689766197495-9ceca236-16f4-4ad0-b5ad-79f507b0ff8c.png)

## 更细分的媒体权限

- Android13 将 `READ_EXTERNAL_STORAGE` 和 `WRITE_EXTERNAL_STORAGE` 权限细分为：`READ_MEDIA_IMAGES`、 `READ_MEDIA_VIDEO` 和 `READ_MEDIA_AUDIO`， targetSdk>=33 此项必须适配。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688125986511-52b09c09-6b27-4fc0-bf40-8ee5d101405d.png)<br>当应用升级到 targetSdk>=33 时：<br>已授权 READ_EXTERNAL_STORAGE 权限的应用：系统将自动赋予对应的细化权限。<br>未授权仍请求 READ_EXTERNAL_STORAGE 权限：亲测系统将不会授予任何权限。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688125995936-6980e9cf-bb4d-491e-bd9f-aed00fcc3d2c.png)
- Android13 之后需要删除对 WRITE_EXTERNAL_STORAGE 的权限申请<br>此权限 API29 之后已经没有实际用处，在 API33 中请求该权限的返回结果恒为 false，因此需去除该权限申请
- 单独请求 READ_MEDIA_IMAGES、单独请求 READ_MEDIA_VIDEO 和同时请求 READ_MEDIA_IMAGES& READ_MEDIA_VIDEO，系统均将只显示一个授权弹窗。![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697809700789-d0b05e90-e793-4414-a982-d35d8f2b57d1.png)
- 如果 App（targetSdk == 33）已经申请了读的权限，那 App 同时也就有了写的权限，无需再额外声明 WRITE_EXTERNAL_STORAGE 权限

```xml
<manifest>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
  
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
			android:maxSdkVersion="32" />
</manifest>
```

代码部分可以做个判断，例如：

```kotlin
String requestPermission;
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    requestPermission = Manifest.permission.READ_MEDIA_IMAGES;
} else {
    requestPermission = Manifest.permission.READ_EXTERNAL_STORAGE;
}
```

另外文档建议，如果你的应用只需要访问图片、照片和视频，可以考虑使用 [照片选择器](https://developer.android.google.cn/training/data-storage/shared/photopicker?hl=zh-cn)，而不是声明 `READ_MEDIA_IMAGES` 和 `READ_MEDIA_VIDEO` 权限。

## WiFi 权限变更

在以往版本的 Android 系统下，如果 App 要使用 WiFi 相关功能，需要申请 `ACCESS_FINE_LOCATION`，即位置权限，如下图：<br>![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697809446186-20f9122d-ebb9-4146-a44d-81e6000c6178.png)<br>为了避免 App 过度索权，更好地保护终端用户隐私，Android13 将 WiFi 权限从位置权限中分离了出来，引入了新的运行时权限：`NEARBY_WIFI_DEVICES`。<br>如果 App 仅需要使用 WiFi 相关的 API，并不需要使用 getScanResults()、startScan() 等与位置相关的 API，那么建议 App 开发者切换到新的 NEARBY_WIFI_DEVICES 权限。<br>新的 WiFi 权限运行机制：<br>![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697809478720-64e85b40-3014-4bd8-a57e-1b3d8a3958aa.png)<br>如果你的应用不会通过 Wi-Fi API 推导物理位置，请将 usesPermissionFlags 属性设为 neverForLocation。同时将 ACCESS_FINE_LOCATION 权限的最高 SDK 版本设置为 32<br>如果你使用了 WifiManager 的 getScanResults() 或 startScan()，在 Android 13 还是需要 ACCESS_FINE_LOCATION 权限，所以去除 `android:maxSdkVersion="32"`。

```xml
<manifest ...>
  <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES"       
			android:usesPermissionFlags="neverForLocation"/>
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"
			android:maxSdkVersion="32" />
</manifest>
```

需要 `NEARBY_WIFI_DEVICES` 权限的 API 方法：

- `WifiManager`：startLocalOnlyHotspot()
- `WifiAwareManager`：attach()
- `WifiAwareSession`：publish()、subscribe()
- `WifiP2pManager`：addLocalService()、connect()、createGroup()、discoverPeers()、discoverServices()、requestDeviceInfo()、requestGroupInfo()、requestPeers()
- `WifiRttManager`：startRanging()

## 系统 API 变更�

### API 删除

- PackageManager 中的 getPackageInfo、getApplicationInfo、resolveActivity 等方法。

```java
 public static PackageInfo getPackageInfoCompat(PackageManager packageManager, String packageName, int flag)
        throws PackageManager.NameNotFoundException {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return packageManager.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(flag));
    } else {
        return packageManager.getPackageInfo(packageName, flag);
    }
}
```

- Intent 中的 `getSerializableExtra`、`getParcelableExtra` 和 Bundle 中的 `getSerializable`、`getParcelable` 等方法。

```java
public static <T extends Parcelable> T getParcelableExtraCompat(Intent intent, String name, Class<T> clazz) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return intent.getParcelableExtra(name, clazz);
    } else {
        return intent.getParcelableExtra(name);
    }
}
```

- WebSettings 中的 setAppCacheEnabled、setAppCacheMaxSize、setAppCachePath 方法被移除。
  - setAppCacheEnabled(false) 可以用 setCacheMode(WebSettings.LOAD_NO_CACHE) 替代。
  - setAppCacheEnabled(true) 可以用 setCacheMode(WebSettings.LOAD_DEFAULT) 替代。
- 对于以 Android 13（API 级别 33）或更高版本为目标平台的应用，WebSettings 中的 `setForceDark` 方法已废弃，调用该方法无效。

> WebView 现在始终会根据应用的主题属性 isLightTheme 来设置媒体查询 prefers-color-scheme。换句话说，如果 isLightTheme 为 true 或未指定，则 prefers-color-scheme 为 light；否则为 dark。此行为意味着，系统会自动应用 Web 内容的浅色或深色样式（如果相应内容支持应用主题）。
> 对于大多数应用，新行为应自动应用适当的应用样式，不过，您应测试应用以检查是否存在可能已手动控制深色模式设置的情况。
> 如果您仍需要自定义应用的颜色主题行为，请改用 setAlgorithmicDarkeningAllowed() 方法。为了向后兼容以前的 Android 版本，我们建议使用 AndroidX 中的等效 setAlgorithmicDarkeningAllowed() 方法。

### 广播和 intent 更新相关

- BroadcastReceiver<br>以往的 Android 系统下，应用动态注册的 BroadcastReceiver 广播接收器会接收到任何应用发送的广播（除非该接收器使用了应用签名权限保护），这会使动态注册的广播接收器存在安全风险。<br>Android13 要求，应用动态注册的广播接收器必须以显著的方式指出是否允许其他应用访问，即其他应用是否可以向其发送广播。**否则，在动态注册时系统将抛出安全异常（SecurityException）**。<br>目前该增强措施并非默认生效，**开发者需启用 DYNAMIC_RECEIVER_EXPLICIT_EXPORT_REQUIRED 兼容性框架**，并在动态注册广播时指定是否接受其他应用的广播：
  - context.registerReceiver(receiver, intentFilter, RECEIVER_EXPORTED)
  - context.registerReceiver(receiver, intentFilter, RECEIVER_NOT_EXPORTED)
- IntentFilter 在之前版本的 Android 系统中，只需将 android:exported 设为 true 就可以跨应用显式启动 Activity 和 Service，即使 intent-filter 中的 action 或者 type 不匹配，也能够启动。<br>为避免上述漏洞，Android 13 增强了 intent-filter 的匹配过滤逻辑。在接收方的 targetSdk == 33 的情况下，如果 intent-filter 匹配命中，无论发送方的 targetSdk 版本如何，intent 都将生效。<br>温馨提示：<br>以下几种情况不需要遵循 intent-filter 的匹配过滤逻辑：
  - 组件没有声明
  - 同一个 App 里的 intent
  - 系统或 Root 进程发出的 intent

**系统广播不受 RECEIVER_NOT_EXPORTED 影响。**

## 精确的闹钟权限

为了节省系统资源，Android12 引入了 `SCHEDULE_EXACT_ALARM` 权限进行 " 闹钟和提醒 " 功能的授权管理。Android13 则又引入了新的闹钟权限 `USE_EXACT_ALARM`。<br>和 Android12 的 SCHEDULE_EXACT_ALARM 权限不同，如果 App 已经申请使用了 USE_EXACT_ALARM 新权限，那么用户是不能在设置页面里关闭授权的。<br>对于日程管理、时间管理等类型的 App 来讲，Android13 引入的 USE_EXACT_ALARM 权限能够带来一定便利。相比 Android12 的 SCHEDULE_EXACT_ALARM 权限，使用新权限的应用将不再需要频繁打扰用户进行授权，能够更高效地为用户提供闹钟、日程提醒等服务。<br>不过，为了防止新权限被滥用，GooglePlay 设置了严格的上架审核机制。开发者要注意，一旦使用了 USE_EXACT_ALARM 权限，App 在上架 GooglePlay 时将会被平台严格审查。除非 App 属于闹钟、计时器、日历等类型的应用或者在已被列入到应用市场的白名单里，否则 GooglePlay 将不会允许使用该权限的应用上架。

## 后台的传感器权限

App 在后台运行时，如果需要获取心率、体温、血氧饱和度等传感器信息，将不仅需要向用户申请现有的 `BODY_SENSORS` 权限，还必须声明新的 `BODY_SENSORS_BACKGROUND` 权限。

## [Google 广告 ID需求权限](https://developer.android.google.cn/about/versions/13/behavior-changes-13#ad-id)

使用 Google Play 服务广告 ID 且以 Android 13（API 级别 33）及更高版本为目标平台的应用必须在其清单文件中声明常规 AD_ID 权限，如下所示：

```xml
<manifest ...>
    <uses-permission android:name="com.google.android.gms.permission.AD_ID"/>

    <application ...>
        ...
    </application>
</manifest>
```

如果您的应用以 Android 13 或更高版本为目标平台且未声明此权限，系统会自动移除广告 ID 并将其替换为一串零。

# Android13 新特性

## [剪切板预览](https://developer.android.google.cn/about/versions/13/features#copy-paste)

一直以来，剪切板功能存在这样一个隐患，即剪切板复制的内容中可能存在敏感信息。为了更好地保障剪切板中的隐私内容（比如手机号码、邮箱、账号密码等）不被泄露，Android13 对剪切板功能进行了更新。<br>Android13 剪切板功能的使用分 2 步：

1. 确认内容已成功复制
2. 提供所复制内容的预览。

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/new-copy-paste-UI.gif)<br>Android13 还提供了**脱敏功能**，使用户能够对剪切板中的敏感信息进行隐藏，实现了便利性和安全性兼得。

## [更安全地导出上下文注册的接收器](https://developer.android.google.cn/about/versions/13/features#runtime-receivers)

Android 13 允许您指定您应用中的特定广播接收器是否应 exported 以及是否对设备上的其他应用可见。如果导出广播接收器，其他应用将可以向您的应用发送不受保护的广播。此导出配置在以 Android 13 或更高版本为目标平台的应用中可用，有助于防止一个主要的应用漏洞来源。在以前的 Android 版本中，设备上的任何应用都可以向动态注册的接收器发送不受保护的广播，除非该接收器受签名权限的保护。<br>以 Android 13 或更高版本为目标平台的应用，必须为每个广播接收器指定 `RECEIVER_EXPORTED` 或 `RECEIVER_NOT_EXPORTED`。否则，当您尝试注册广播接收器时，系统会抛出 SecurityException。

> Caused by: java.lang.SecurityException: com.xxx.xxx: One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED should be specified when a receiver isn't being registered exclusively for system broadcasts

当然这个目前不是强制适配的，需要在开发者选项 -> 应用兼容变更中开启 `DYNAMIC_RECEIVER_EXPLICIT_EXPORT_REQUIRED`。这个安全增强措施默认是关闭的，所以暂时无影响。<br>适配：

```java
// 这个广播接收器能够接收来自其他应用程序的广播。
context.registerReceiver(sharedBroadcastReceiver, intentFilter,
                    RECEIVER_EXPORTED);
// 这个私有广播接收器不能够接收来自其他应用的广播。
context.registerReceiver(privateBroadcastReceiver, intentFilter,
                    RECEIVER_NOT_EXPORTED);
```

将普通广播替换为了本地广播（LocalBroadcastManager），不受影响

## [预测性返回手势](https://developer.android.google.cn/about/versions/13/features#predictive-back-nav)

Android 13（API 级别 33）针对手机、大屏设备和可折叠设备等 Android 设备引入了预测性返回手势。该功能的发布历程跨度将达多年；完全实现后，该功能可让用户在完全完成某个返回手势之前就能预览此手势完成后的目的地或其他结果，以便用户能够决定是继续完成手势还是留在当前视图中。<br>![bbe6cd03580444ccb08c6314b298648d.gif|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697858789436-3005f4b9-fa17-4476-8897-3fc03c281af1.gif)<br>参照文档 [添加对预测性返回手势的支持](https://developer.android.google.cn/guide/navigation/predictive-back-gesture?hl=zh-cn#migrate-existing) 以及运行官方 Codelab 发现在 Vivo、OPPO、小米上都不起作用，可能被阉割了。。。使用模拟器正常。目前此功能在开发者选项中供测试使用。官方计划在未来的 Android 版本中向用户提供此界面。

## [各应用语言偏好设定](https://developer.android.google.cn/guide/topics/resources/app-languages?hl=zh-cn#api-implementation)

在许多情况下，多语言用户会将其系统语言设置为某一种语言（例如英语），但又想为特定应用选择其他语言（例如荷兰语、中文或印地语）。为了帮助应用为这些用户提供更好的体验，Android 13 针对支持多种语言的应用引入了以下功能：

1. 系统设置：用户可以在这个集中位置为每个应用选择首选语言

> 您的应用必须在应用的清单中声明 android:localeConfig 属性，以告知系统它支持多种语言。

2. 其他 API：借助这些公共 API（例如 LocaleManager 中的 setApplicationLocales() 和 getApplicationLocales() 方法），应用可以在运行时设置不同于系统语言的其他语言。

> 这些 API 会自动与系统设置同步；因此，使用这些 API 创建自定义应用内语言选择器的应用将确保用户获得一致的用户体验，无论他们在何处选择语言偏好设置。公共 API 还有助于减少样板代码量、支持拆分 APK，并且支持应用自动备份，以存储应用级的用户语言设置。

几部国产手机此功能都被阉割<br>![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697859320987-36297810-5e72-432f-9e97-34f3b8ca9203.png)

## 更快断字

断字让分行的文本更易于阅读，并且有助于使界面更具自适应性。从 Android 13 开始，断字性能提升了高达 200%，因此您可以在 TextView 中启用更快断字功能，而几乎不会影响渲染性能。如需启用更快断字功能，请在 `setHyphenationFrequency()` 中使用 fullFast 或 normalFast 频率。

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    // 适用于聊天消息
    textView.setHyphenationFrequency(Layout.HYPHENATION_FREQUENCY_NORMAL_FAST);
    // 标准连词符
    textView.setHyphenationFrequency(Layout.HYPHENATION_FREQUENCY_FULL_FAST)
}
```

用 fullFast 属性前后对比：<br>![使用前|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697858970422-d7010976-3003-4e34-851b-0e3d3f9ca273.png)<br>![使用后|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697858983255-afa81ff9-4923-4fb1-a229-76b9fbb050e5.png)

## 带主题的应用图标

从 Android 13 开始，您可以选择启用带主题的应用图标。借助此功能，用户可以调节受支持的 Android 应用图标色调，以继承所选壁纸和其他主题的配色。<br>如需支持此功能，您的应用必须提供 [自适应图标](https://developer.android.google.cn/guide/practices/ui_guidelines/icon_design_adaptive?hl=zh-cn) 和单色应用图标，并通过清单中的 `<adaptive-icon>` 元素指向该单色应用图标。如果用户启用了带主题的应用图标（换句话说，在系统设置中开启了带主题的图标切换开关），而启动器支持此功能，则系统将使用用户选择的壁纸和主题来确定色调颜色，然后该颜色将应用于单色应用图标。<br>![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/themed-app-icons.gif)<br>适配方法很简单，只需要额外添加 `<monochrome/>` 单色应用图标配置就可以支持这个功能：

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

测试了几个部手机都不支持此功能，所以只能使用模拟器测试效果。模拟器效果图：<br>![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1697859404780-854d1f05-ecbc-44f8-93e2-24d1ce6a7840.png)

## [APK Signature Scheme v3.1](https://developer.android.google.cn/about/versions/13/features#apk-signature-scheme)

# 其他

## kt 升级相关（升级 1.8，涉及 kotlin-android-extensions 插件删除导致大量语法错误，可后续二期升级）

### 语法相关

- 空类型判断更加严格，途中 warning 处 `?` 需去除
  - ![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126059589-2dd05bad-89d8-455c-bac4-10410d04d2b7.png) ---》 ![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126067124-10cc3894-ee46-48aa-9d63-b45f4b8975c0.png)
  - ![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126075053-33a5da4a-6ec2-4300-a4a6-64e7215b60c3.png)
- when 语句需要 default 分支
  - ![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126084648-530b86ee-7360-46a4-937c-db62d2b0310a.png) ---》 ![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126091513-2885e78c-5ec0-4602-8523-4adff28649e3.png)

### kae 插件删除

- kt1.8 以后该组件被彻底删除，apply plugin "kotlin-android-extensions" 语句会导致直接报错，删除后涉及几个修改
  - ![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126103907-74489434-1f93-490f-b61f-61187fd98017.png)Cicd 组件仓库，需将 kotlin-android-extensions 插件更换 kotlin-parcelize 插件，因为项目中使用@Parcelize 注解
  - 大量 kotlinx.android.synthetic 类编译错误需要手动修改

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126131937-85ae253f-53c6-4f3c-adf8-652ad4818849.png)<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126121615-139b72ae-0add-4a3f-a41f-7aeade7364ff.png)

```
        - 可使用viewbinding替换kotlinx.android.synthetic，一些提效手段参考[升级kotlin1.8快速切换Synthetic到Viewbinding相关方案调研](https://wiki.dotfashion.cn/pages/viewpage.action?pageId=1145126559)
  - falcon相关插件需要做适配（有编译问题，目前关闭isEnableFalconPlugin开关绕过，待后续完善）
```

## AndroidX 组件升级 (待补充)

- 可直接升级组件
  - androidx.fragment，androidx.browser，`androidx.exifinterface`
- 依赖 kt 组件
  - 依赖 1.7：`androidx.sqlite:sqlite，androidx.browser:browser，androidx.room:*，androidx.appcompat:appcompat，androidx.constraintlayout:constraintlayout，androidx.work:work-runtime`
  - 依赖 1.8：`androidx.core:core-ktx，androidx.lifecycle.*，androidx.annotation:annotation，androidx.activity:activity-ktx`

## OkHttp 升级（待补充）

- 对第三方库的影响：`io.github.didi.dokit:dokitx` 目前支持 `okhttp4+`
- 升级 4.+ 后 ![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1688126174617-b109b7bc-b57d-431a-832f-32d1e11cbc72.png) okhttp4 换成了 kt 实现，接口写法有所变动，很多取值方法变成了直接取属性本身

## Firebase 升级（待补充）

- 依赖 `kt1.7+` 升级，升级 `firebase-bom:32.1.1` 后有 crash 待解决
