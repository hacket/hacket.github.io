---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Monday, January 20th 2025, 12:18:13 am
title: Android12适配(API31 AndroidS)
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
dg-content-classes: 
date created: Invalid date
date updated: 星期三, 一月 15日 2025, 4:52:56 下午
image-auto-upload: true
feed: show
format: list
aliases: [Android12 适配]
linter-yaml-title-alias: Android12 适配
---

# Android12 适配

## 影响所有 App 的行为变更

不管 App 的 `targetSdkVersion` 是什么，所有 App 运行在 Android12 都受影响

### SplashScreen

见 `适配SplashScreen.md`

### 麦克风和摄像头切换开关

从 Android 12 开始，用户可以通过状态栏下拉菜单中两个新增的切换开关选项，一键启用/停用摄像头和麦克风使用权限。![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687786124177-aba5fc07-ad77-43bc-9998-3664e2f1cc83.png)

请注意，这里的「使用权限」针对的是设备上的所有 App，是全局的，不要和 Android 6.0 的「运行时权限」混淆。而两者在具体表现上也有所不同，在实际操作中：

1. 当关闭摄像头使用权限后，画面录制将继续进行，但只会收到空白画面；
2. 当关闭麦克风使用权限后，声音录制将继续进行，但只会收到无声视频。

检查设备是否支持麦克风和摄像头切换开关的 API，也就是检查状态栏下拉菜单是否有这两个开关选项：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687786292044-92245242-15d9-46b7-8719-f3ca61073557.png)

SensorPrivacyManager 类倒是有提供检查指定切换开关是否开启的 API，但由于是系统权限，因此即使是通过反射形式也无法调用：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1696658136821-61f5fc1a-4e54-470d-a808-61619126c337.gif)

所幸的是，如果用户主动关闭了摄像头或麦克风的使用权限，那么当下次 App 再需要启动摄像头或麦克风时，系统就会提醒用户，相关硬件的使用权限已关闭，并申请重新开启：

## 影响目标 API 级别为 Android 12 的 App 的行为变更（targetSdkVersion=31）

### Overscroll effect 更改

<https://developer.android.com/about/versions/12/overscroll?hl=zh-tw>

回弹效果低版本是 glow 效果，Android12 开始效果是 bounce back

下列控件默认实现了 EdgeEffect 的回弹效果：

```
RecyclerView
ListView
ScrollView
NestedScrollView
HorizontalScrollView
ViewPager
ViewPager2
```

### android:exported 安全组件输出

#### 什么是 exported？

`android:exported` 它主要是设置 Activity/Service/BroadReceiver 是否可由其他应用的组件启动，"true" 则表示可以，而 "false" 表示不可以。如果使用了 intent-filter，则需要将 `android:exported` 设置为 "true"；如果没有 intent-filter，那就应该把 `android:exported` 设置为 false ，这可能会在安全扫描时被定义为安全漏洞。

1. Activity

true 表示当前 Activity 需要被外部应用调用，例如桌面和应用需要打开当前应用首页，false 表示当前 Activity 只能被当前的应用，或者具有相同 userID 的应用，或者有调用特权的系统 components 调用

2. Service

true 表示可以跟外部应用的 component 进行交互，false 表示只有自己应用内的 component 以及具有相同 userID 的应用的 component 可以启动并绑定这个服务。

3. BroadReceiver

true 表示可以非系统的其他应用的广播，false 表示只能收到系统的、自己应用的、具有相同 userID 应用的广播

#### 报错

在 target 到 Android12 之后，所有设置了 intent filters 的 activity、services、broadcast receivers 都需要设置 android:exported ，否则会导致编译异常。

App 无法编译，错误如下：

```
android:exported needs to be explicitly specified for element <activity#xxxActivity>. Apps targeting Android 12 and higher are required to specify an explicit value for android:exported when the corresponding component has an intent filter defined. See https://developer.android.com/guide/topics/manifest/activity-element#exported for details.
```

或者：

```
Installation failed due to: 'Failed to commit install session 1643906208 with command cmd package install-commit 1643906208. Error: INSTALL_PARSE_FAILED_MANIFEST_MALFORMED: Failed parse during installPackageLI: /data/app/vmdl1643906208.tmp/base.apk (at Binary XML file line #77): me.hacket.assistant.MainActivity: Targeting S+ (version 31 and above) requires that an explicit value for android:exported be defined when intent filters are present'
```

#### 解决

##### 手动添加 exported 属性

对于一些 aar 或者依赖库有里面 component 的报错，有两个解决办法：

1. 尝试升级对应的依赖库版本，并看看是否已经进行了 target android12 适配；
2. 在主工程中 xml 拷贝相关 component 声明，并覆盖 exported 设置，例如：

```xml
<!--方式Android12的Android:exported报错-->
<activity
    android:name="com.github.moduth.blockcanary.ui.DisplayActivity"
     tools:replace="android:exported"
    android:exported="false" />
```

##### Gradle task 添加

- [ ] Android 12 自动适配 exported 深入解析避坑 <http://events.jianshu.io/p/1913b48f2dad>

Gradle 扫描添加 android:exported 属性：

```groovy
// com.android.tools.build:gradle:3.4.3 以下版本
/**
 * 修改 Android 12 因为 exported 的构建问题
 */
android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        output.processResources.doFirst { pm ->
            String manifestPath = output.processResources.manifestFile
            def manifestFile = new File(manifestPath)
            def xml = new XmlParser(false, true).parse(manifestFile)
            def exportedTag = "android:exported"
            ///指定 space
            def androidSpace = new groovy.xml.Namespace('http://schemas.android.com/apk/res/android', 'android')

            def nodes = xml.application[0].'*'.findAll {
                //挑选要修改的节点，没有指定的 exported 的才需要增加
                (it.name() == 'activity' || it.name() == 'receiver' || it.name() == 'service') && it.attribute(androidSpace.exported) == null

            }
            ///添加 exported，默认 false
            nodes.each {
                def isMain = false
                it.each {
                    if (it.name() == "intent-filter") {
                        it.each {
                            if (it.name() == "action") {
                                if (it.attributes().get(androidSpace.name) == "android.intent.action.MAIN") {
                                    isMain = true
                                    println("......................MAIN FOUND......................")
                                }
                            }
                        }
                    }
                }
                it.attributes().put(exportedTag, "${isMain}")
            }

            PrintWriter pw = new PrintWriter(manifestFile)
            pw.write(groovy.xml.XmlUtil.serialize(xml))
            pw.close()
        }
    }
}
// com.android.tools.build:gradle:4.1.0 以上版本
/**
 * 修改 Android 12 因为 exported 的构建问题
 */

android.applicationVariants.all { variant ->
    variant.outputs.each { output ->
        def processManifest = output.getProcessManifestProvider().get()
        processManifest.doLast { task ->
            def outputDir = task.multiApkManifestOutputDirectory
            File outputDirectory
            if (outputDir instanceof File) {
                outputDirectory = outputDir
            } else {
                outputDirectory = outputDir.get().asFile
            }
            File manifestOutFile = file("$outputDirectory/AndroidManifest.xml")
            println("----------- ${manifestOutFile} ----------- ")

            if (manifestOutFile.exists() && manifestOutFile.canRead() && manifestOutFile.canWrite()) {
                def manifestFile = manifestOutFile
                ///这里第二个参数是 false ，所以 namespace 是展开的，所以下面不能用 androidSpace，而是用 nameTag
                def xml = new XmlParser(false, false).parse(manifestFile)
                def exportedTag = "android:exported"
                def nameTag = "android:name"
                ///指定 space
                //def androidSpace = new groovy.xml.Namespace('http://schemas.android.com/apk/res/android', 'android')

                def nodes = xml.application[0].'*'.findAll {
                    //挑选要修改的节点，没有指定的 exported 的才需要增加
                    //如果 exportedTag 拿不到可以尝试 it.attribute(androidSpace.exported)
                    (it.name() == 'activity' || it.name() == 'receiver' || it.name() == 'service') && it.attribute(exportedTag) == null

                }
                ///添加 exported，默认 false
                nodes.each {
                    def isMain = false
                    it.each {
                        if (it.name() == "intent-filter") {
                            it.each {
                                if (it.name() == "action") {
                                    //如果 nameTag 拿不到可以尝试 it.attribute(androidSpace.name)
                                    if (it.attributes().get(nameTag) == "android.intent.action.MAIN") {
                                        isMain = true
                                        println("......................MAIN FOUND......................")
                                    }
                                }
                            }
                        }
                    }
                    it.attributes().put(exportedTag, "${isMain}")
                }

                PrintWriter pw = new PrintWriter(manifestFile)
                pw.write(groovy.xml.XmlUtil.serialize(xml))
                pw.close()

            }

        }
    }
}
```

> 在打包过程中检索所有没有设置 exported 的组件，给他们动态配置上 exported。这里有个特殊需要注意的是，因为启动 Activity 默认就是需要被 Launcher 打开的，所以 "android.intent.action.MAIN" 需要  exported 设置为 true。

- [x] Android 12 自动适配 exported 深入解析避坑<br><https://blog.csdn.net/ZuoYueLiang/article/details/123438734>

### 应用休眠

Android 12 在 Android 11（API 级别 30）中引入的自动重置权限行为的基础上进行了扩展。如果 TargetSDK 为 31 的 App 用户几个月不打开，则系统会自动重置授予的所有权限并将 App 置于休眠状态。

### PendingIntent mutability

- 问题描述

如果您的应用程序以 Android 12 为目标平台，则必须指定应用创建的每个 PendingIntent 对象的可变性。此附加要求可提高应用程序的安全性。(PendingIntent 创建需要指定可变性 `FLAG_IMMUTABLE` 或者 `FLAG_MUTABLE`)

- 编译错误

如果您的应用尝试在未设置任何可变性标志的情况下创建 PendingIntent 对象，则系统将引发 IllegalArgumentException，并且在 Logcat 中显示以下消息：

```
PACKAGE_NAME: Targeting S+ (version 10000 and above) requires that one of \
FLAG_IMMUTABLE or FLAG_MUTABLE be specified when creating a PendingIntent.

Strongly consider using FLAG_IMMUTABLE, only use FLAG_MUTABLE if \
some functionality depends on the PendingIntent being mutable, e.g. if \
it needs to be used with inline replies or bubbles.
```

Android12 机器报错，v2.3.1 的 workmanager 库：

```
java.lang.IllegalArgumentException: me.hacket.assistant.samples: Targeting S+ (version 31 and above) requires that one of FLAG_IMMUTABLE or FLAG_MUTABLE be specified when creating a PendingIntent.
Strongly consider using FLAG_IMMUTABLE, only use FLAG_MUTABLE if some functionality depends on the PendingIntent being mutable, e.g. if it needs to be used with inline replies or bubbles.
    at android.app.PendingIntent.checkFlags(PendingIntent.java:375)
    at android.app.PendingIntent.getBroadcastAsUser(PendingIntent.java:645)
    at android.app.PendingIntent.getBroadcast(PendingIntent.java:632)
    at androidx.work.impl.utils.ForceStopRunnable.getPendingIntent(ForceStopRunnable.java:196)
    at androidx.work.impl.utils.ForceStopRunnable.isForceStopped(ForceStopRunnable.java:128)
    at androidx.work.impl.utils.ForceStopRunnable.run(ForceStopRunnable.java:93)
    at androidx.work.impl.utils.SerialExecutor$Task.run(SerialExecutor.java:91)
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1167)
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:641)
    at java.lang.Thread.run(Thread.java:920)
```

- 解决 1(WorkManager 库问题)：[升级WorkManager的版本](https://developer.android.com/jetpack/androidx/releases/work#declaring_dependencies)

```groovy
// 截止2022年03月30日
dependencies {
    def work_version = "2.7.1"
    // (Java only)
    implementation "androidx.work:work-runtime:$work_version"
    // Kotlin + coroutines
    implementation "androidx.work:work-runtime-ktx:$work_version"
    // optional - RxJava2 support
    implementation "androidx.work:work-rxjava2:$work_version"
    // optional - GCMNetworkManager support
    implementation "androidx.work:work-gcm:$work_version"
    // optional - Test helpers
    androidTestImplementation "androidx.work:work-testing:$work_version"
    // optional - Multiprocess support
    implementation "androidx.work:work-multiprocess:$work_version"
}

// 或者强制版本升级到2.7.1
def work_version = "2.7.1"
allprojects {
    configurations.all {
        resolutionStrategy.force "androidx.work:work-runtime:${Config.work_version}"
        resolutionStrategy.force "androidx.work:work-runtime-ktx:${Config.work_version}"
        resolutionStrategy.force "androidx.work:work-rxjava2:${Config.work_version}"
        resolutionStrategy.force "androidx.work:work-gcm:${Config.work_version}"
        resolutionStrategy.force "androidx.work:work-multiprocess:${Config.work_version}"
    }
}
```

- 解决 2：

大部分情况下如果不希望创建的 PendingIntent 被外部应用修改，那么需要设置成 PendingIntent.FLAG_IMMUTABLE 既可。一些特殊情况可以设置成 FLAG_MUTABLE（参考：<https://developer.android.com/guide/components/intents-filters#DeclareMutabilityPendingIntent>）>

```
PendingIntent.getActivity(context, requestCode, intent, PendingIntent.FLAG_IMMUTABLE);
```

### 传感器刷新频率问题

- 问题描述：

当使用 SensorManager 时，如果监听的频率太快，例如 `sensorManager.registerListener(this,sensor,SensorManager.SENSOR_DELAY_FASTEST);`，且没有定义 `permission HIGH_SAMPLING_RATE_SENSORS` 权限的话会有这个崩溃。

- 运行时报错：

```
java.lang.SecurityException: To use the sampling rate of 0 microseconds, app needs to declare the normal permission HIGH_SAMPLING_RATE_SENSORS.        at android.hardware.SystemSensorManager$BaseEventQueue.enableSensor(SystemSensorManager.java:884)        at android.hardware.SystemSensorManager$BaseEventQueue.addSensor(SystemSensorManager.java:802)        at android.hardware.SystemSensorManager.registerListenerImpl(SystemSensorManager.java:272)        at android.hardware.SensorManager.registerListener(SensorManager.java:835)        at android.hardware.SensorManager.registerListener(SensorManager.java:742)
```

- 解决：

大部分情况下我们并不需要太快的监听频率，可以设置成 `SensorManager.SENSOR_DELAY_UI`。在某些确实需要快速频率监听的话，需要加上 `HIGH_SAMPLING_RATE_SENSORS权限`。

### 后台 APP 启动前台服务限制

[前台服务  |  Background work  |  Android Developers](https://developer.android.com/develop/background-work/services/foreground-services#bg-access-restrictions)

- 问题描述：

应用在 target 到 Android12 之后，如果应用在后台启用前台服务，那么就会报 ` ForegroundServiceStartNotAllowedException  `

- 运行时崩溃：

```
Caused by: android.app.ForegroundServiceStartNotAllowedException: Service.startForeground() not allowed due to mAllowStartForeground false: service XXXXService 16	at android.app.ForegroundServiceStartNotAllowedException$1.createFromParcel(ForegroundServiceStartNotAllowedException.java:54) 17	at android.app.ForegroundServiceStartNotAllowedException$1.createFromParcel(ForegroundServiceStartNotAllowedException.java:50) 18	at android.os.Parcel.readParcelable(Parcel.java:3345) 19	at android.os.Parcel.createExceptionOrNull(Parcel.java:2432) 20	at android.os.Parcel.createException(Parcel.java:2421) 21	at android.os.Parcel.readException(Parcel.java:2404) 22	at android.os.Parcel.readException(Parcel.java:2346) 23	at android.app.IActivityManagerStubProxy.setServiceForeground(IActivityManager.java:8040) 24	at android.app.Service.startForeground(Service.java:733)
```

- 检测<br>检查 App 是否有在后台启动前台服务的行为<br>可在 Terminal 终端执行以下 adb 命令，该命令会监控你的 App 是否有在后台启动前台服务的行为，一旦有此行为，就会在通知栏推送一条提醒，定位到触发此行为的代码处：

```shell
adb shell device_config put activity_manager \ default_fgs_starts_restriction_notification_enabled true
```

- 解决 1（使用 WorkManager 来处理后台任务 - 官方推荐）：<br>从 WorkManager 2.7.0 开始，您的应用可以调用 `setExpedited()` 来声明 Worker 应使用加急作业。这一新 API 在 Android 12 上运行时使用加急作业，该 API 在早期 Android 版本中使用前台服务来提供向后兼容性。

```kotlin
OneTimeWorkRequestBuilder<T>().apply {
    setInputData(inputData)
    setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
}.build()
```

> 由于 CoroutineWorker.setForeground() 和 ListenableWorker.setForegroundAsync() 方法由前台服务提供支持，因此它们受到相同的前台服务启动限制和豁免。您可以适时地使用该 API，但如果系统不允许您的应用启动前台服务，您应准备好处理异常。为了获得更加一致的体验，请使用 setExpedited()。

- 解决 2：避免在后台启动前台服务

```
以下情况下，即使您的应用在后台运行，也可以启动前台服务：
1. 您的应用从用户可见的某种状态（如 activity）过渡。
2. 您的应用可以从后台启动 activity，但该应用在现有任务的返回堆栈中具有 activity 的情况除外
3. 您的应用使用 Firebase Cloud Messaging 接收高优先级消息。
4. 用户对与您的应用相关的界面元素执行操作。例如，他们可能与气泡、通知、微件或 activity 互动
5. 您的应用收到与地理围栏或运动状态识别过渡相关的事件。
6. 设备重新启动并在广播接收器中接收 ACTION_BOOT_COMPLETED、ACTION_LOCKED_BOOT_COMPLETED 或 ACTION_MY_PACKAGE_REPLACED intent 操作之后。
7. 您的应用在广播接收器中接收 ACTION_TIMEZONE_CHANGED、ACTION_TIME_CHANGED 或 ACTION_LOCALE_CHANGED intent 操作。
8. 您的应用接收需要 BLUETOOTH_CONNECT 或 BLUETOOTH_SCAN 权限的蓝牙广播。
9. 应用包含特定系统角色或权限，例如设备所有者和配置文件所有者。您的应用使用配套设备管理器。
10. 为了每当配套设备在附近时都让系统唤醒您的应用，请在 Android 12 中实现配套设备服务。
11. 系统重启“粘性”前台服务。为使前台服务具有粘性，请从 onStartCommand() 返回 START_STICKY 或 START_REDELIVER_INTENT。
12. 用户为您的应用关闭了电池优化。您可以将用户引导至您的应用在系统设置中的应用信息页面，帮助用户找到此选项。为此，请调用包含 ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS intent 操作的 intent。
```

### 蓝牙权限

- 问题描述：

在 target 到 Android12 之后，查找蓝牙设备需要添加 `BLUETOOTH_SCAN` 权限，与匹配的蓝牙设备传输数据需要获取 `BLUETOOTH_CONNECT` 权限

- 运行崩溃：

```
Caused by: java.lang.SecurityException: Need android.permission.BLUETOOTH_CONNECT permission for android.content.AttributionSource@db46d647: enable 37	at android.os.Parcel.createExceptionOrNull(Parcel.java:2425) 38	at android.os.Parcel.createException(Parcel.java:2409) 39	at android.os.Parcel.readException(Parcel.java:2392) 40	at android.os.Parcel.readException(Parcel.java:2334) 41	at android.bluetooth.IBluetoothManagerStubProxy.enable(IBluetoothManager.java:611) 42	at android.bluetooth.BluetoothAdapter.enable(BluetoothAdapter.java:1217)
```

- 解决办法：

在查找和匹配蓝牙设备之前，先动态申请 `BLUETOOTH_SCAN` 权限以及 `BLUETOOTH_CONNECT` 权限。

### 精确的闹钟权限

简单讲，就是以 Android 12 为目标平台的 App，如果使用到了 AlarmManager 来设置定时任务，并且设置的是精准的闹钟 (使用了 setAlarmClock()、setExact()、setExactAndAllowWhileIdle() 这几种方法)，则需要确保 SCHEDULE_EXACT_ALARM 权限声明且打开，否则 App 将崩溃并出现以下警告：<br>

适配：<https://mp.weixin.qq.com/s/rA-1f8aa4PzjFuD6EIA7jw>

### 通知 trampoline 限制

在配置通知 (Notification) 的点按行为时，可能会通过 PendingIntent 来启动一个 Service 或 BrocastReceiver。而以 Android 12 为目标平台的 App，如果尝试在 Service 或 BrocastReceiver 中内调用 startActivity()，系统会阻止该 Activity 启动，并在 Logcat 中显示以下消息：<br>

适配：<https://mp.weixin.qq.com/s/rA-1f8aa4PzjFuD6EIA7jw>

## 体验下降

### 大致位置

Android 12 为目标平台的 App 上，当 App 尝试请求 `ACCESS_FINE_LOCATION` 权限时，系统权限对话框会提供两个选项，即允许 App 获取确切位置，还是仅允许获取大致位置。<br>

给了用户拒绝提供确切位置的权力，一旦用户拒绝，这种情况下 App 就只能获取到大致位置了。

### 应用休眠

以 Android 12 为目标平台的 App，如果用户有长达几个月的时间没有打开过你的 App，那么你之前申请的所有运行时权限都会被重置为未授权状态，即使再次打开也无法恢复，需要重新申请。

### 自定义通知

适配：<https://mp.weixin.qq.com/s/rA-1f8aa4PzjFuD6EIA7jw>

## App Widget 大改

- [x] [[02. App Widget for Android12]]

## Ref

- [x] Android 12 保姆级适配指南来啦！(详细、值得看)<br><https://mp.weixin.qq.com/s/rA-1f8aa4PzjFuD6EIA7jw>
- [x] Android 12 快速适配要点<br><https://mp.weixin.qq.com/s/f9Tiaov4tOKXCeoEbXs0hA>
- [x] 行为变更 | 了解 Android 12 中的 intent-filter <https://mp.weixin.qq.com/s/0qAWV2793WCCWXFosaYiFg>
- [x] Android 12 应用兼容性适配指导<br><https://blog.csdn.net/irizhao/article/details/117705170>

# 适配 SplashScreen

<https://developer.android.com/guide/topics/ui/splash-screen>

## SplashScreen 介绍

Android 12 新增加了 SplashScreen 的 API，它包括启动时的进入应用的动作、显示应用的图标画面，以及展示应用本身的过渡效果。不管你的 TargetSDK 什么版本，当你运行到 Android 12 的手机上时，所有的 App 都会增加 SplashScreen 的功能

它大概由如下 4 个部分组成，这里需要注意：

- 1 最好是矢量的可绘制对象，当然它可以是静态或动画形式。
- 2 是可选的，也就是图标的背景。
- 与自适应图标一样，前景的三分之一被遮盖 (3)。
- 4 就是窗口背景。

启动画面动画机制由进入动画和退出动画组成：

- 进入动画由系统视图到启动画面组成，这由系统控制且不可自定义
- 退出动画由隐藏启动画面的动画运行组成。如果要对其进行自定义，可以通过 SplashScreenView 自定义

## 何时会显示和隐藏 SplashScreen

- 显示<br>SplashScreen 会在 App 冷启动和温启动的时候显示，永远不会在 App 热启动的时候显示。

```
如果App被完全杀死了，这个时候去启动它就是冷启动；
如果App的主Activity被销毁或回收了，这个时候去启动它就是温启动；
如果App只是被挂起到了后台，这个时候去启动它就是热启动。
```

- 隐藏<br>当 App 开始在界面上绘制第一帧的时候，SplashScreen 就会消失。

> MainActivity 的 onCreate() 和 onResume() 方法都是在 App 开始绘制第一帧之前执行的

- 延长显示

```kotlin
class MainActivity : AppCompatActivity() {
    @Volatile
    private var isReady = false
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val contentView: View = findViewById(android.R.id.content)
        contentView.viewTreeObserver.addOnPreDrawListener(object : ViewTreeObserver.OnPreDrawListener {
            override fun onPreDraw(): Boolean {
                if (isReady) {
                    contentView.viewTreeObserver.removeOnPreDrawListener(this)
                }
                return isReady
            }
        })
        thread { 
            // Read data from disk
            ...
            isReady = true
        }
    }
}
```

> 在回调函数 onPreDraw() 中返回了一个 false，也就意味着，我们的 PreDraw 阶段始终没有准备好。既然 PreDraw 都还没准备好，App 肯定是不会开始绘制第一帧的，那么 SplashScreen 自然也就不会消失了；onPreDraw() 函数是以很高的频率在持续刷新的。所以它依然会将主线程阻塞住，导致应用程序无法响应用户的输入事件，直到我们在 onPreDraw() 函数返回 true 才会停止刷新。

## 适配 SplashScreen

### 未适配 SplashScreen 默认行为

在 Android12 的手机上，App 未适配 SplashScreen 默认行为：那 App 的 Launcher 图标会变成 SplashScreen 界面的那个图标，而对应的原主题下 windowBackground 属性指定的颜色，就会成为 SplashScreen 界面的背景颜色。这个启动效果在所有应用的冷启动和温启动期间会出现。

### 使用已有的 Splash，disable SplashScreen

SplashScreen 不可取消的，只能通过透明的背景和透明的图标达到以假乱真的效果

```xml
<!-- My custom theme for splash screen activity -->
<style name="Theme.Splash" parent="Theme.Main">
    <item name="android:windowBackground">@color/background</item>
    <!-- Set a transparent .png as your icon -->
    <item name="android:windowSplashScreenAnimatedIcon">@drawable/transparent_image</item>
</style>
```

<https://stackoverflow.com/a/71501884>

### 适配 SplashScreen

#### Android12 手机适配

- 适配步骤：

1. 升级 compileSdkVersion 31 、 targetSdkVersion 31 & buildToolsVersion '31.0.0'
2. 增加 values-v31 的目录，添加 theme.xml 对应的主题

```
<resources>
    <style name="Theme.SccMall.SplashScreen">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <!-- 启动画面背景颜色 -->
        <item name="android:windowSplashScreenBackground">@color/splash_screen_background</item>
        <!-- 启动画面中间显示的图标，默认使用应用图标 -->
        <item name="android:windowSplashScreenAnimatedIcon">@drawable/iv_splash_animation1</item>
        <!-- 启动画面中间显示的图标的背景，如果图标背景不透明则无效 -->
        <item name="android:windowSplashScreenIconBackgroundColor">@color/splash_screen_icon_background</item>
        <!-- 启动画面启动画面底部的图片。 -->
        <item name="android:windowSplashScreenBrandingImage">@mipmap/iv_splash_screen_brandingimage</item>
        <!-- 启动画面在关闭之前显示的时长。最长时间为 1000 毫秒。 -->
        <item name="android:windowSplashScreenAnimationDuration">1000</item>
    </style>
</resources>
```

3. 给你的启动 Activity 添加这个主题，不同目录下使用不同主题来达到适配效果

- 属性：

```
windowSplashScreenBackground SplashScreen背景颜色
windowSplashScreenAnimatedIcon SplashScreen Icon，会受到厂商mask的影响的，在Pixel3XL上，始终是个圆形的
windowSplashScreenIconBackgroundColor SplashScreen中央Icon 颜色（有透明度的图片，控制图标的背景色）
windowSplashScreenBrandingImage SplashScreen品牌信息Icon，可能会被拉伸，尺寸比例宽高：2.4:1，
```

#### 适配旧手机 SplashScreen

1. 添加 compileSdkVersion 和引入库

```groovy
// build.gradle

android {
   compileSdkVersion 31
   // ...
}
dependencies {
   // ...
   implementation 'androidx.core:core-splashscreen:1.0.0-beta02'
}
```

2. 修改主题文件，主题的名字叫么都可以，但它一定要继承自 `Theme.SplashScreen`，并设置 `postSplashScreenTheme`

```
<style name="Theme.App.Starting" parent="Theme.SplashScreen">
   // Set the splash screen background, animated icon, and animation duration.
   <item name="windowSplashScreenBackground">@color/...</item>

   // Use windowSplashScreenAnimatedIcon to add either a drawable or an
   // animated drawable. One of these is required.
   <item name="windowSplashScreenAnimatedIcon">@drawable/...</item>
   <item name="windowSplashScreenAnimationDuration">200</item>  # Required for
                                                                # animated icons

   // Set the theme of the Activity that directly follows your splash screen.
   <item name="postSplashScreenTheme">@style/Theme.App</item>  # Required.
</style>
```

> 如果你想添加 icon 的背景，用 Theme.SplashScreen.IconBackground 主题，并设置 windowSplashScreenIconBackground 属性；postSplashScreenTheme 将它的值指定成你的 App 原来的主题，当 SplashScreen 结束时，你的主题就能够被复原，从而不会影响到你的 App 的主题外观。

3. 在 application 或 activity 标签应用该主题

```xml
<manifest>
   <application android:theme="@style/Theme.App.Starting">
    <!-- or -->
        <activity android:theme="@style/Theme.App.Starting">
...
```

4. 调用 `installSplashScreen` 在 Activity 的 `super.onCreate()` 之前

```kotlin
class MainActivity : Activity() {

   override fun onCreate(savedInstanceState: Bundle?) {
       // Handle the splash screen transition.
       val splashScreen = installSplashScreen()

       super.onCreate(savedInstanceState)
       setContentView(R.layout.main_activity)
    }
}
```

注意：

- 旧版 Android 系统上中央图标不会被 mask，而在 Android12 上中央图标却会被 mask，从而导致新旧系统的 SplashScreen 界面差别很大，也很难看。

## Android12 适配 Ref

- [x] Android 12 启动画面 -SplashScreen (很详细，用到的时候可以查阅)<br><https://blog.csdn.net/g984160547/article/details/121117959>
