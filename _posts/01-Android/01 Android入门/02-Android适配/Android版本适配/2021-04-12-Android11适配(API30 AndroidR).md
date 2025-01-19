---
date_created: Friday, April 12th 2021, 10:41:00 pm
date_updated: Monday, January 20th 2025, 1:16:40 am
title: Android11适配(API30 AndroidR)
author: hacket
categories:
  - Android
category: Android适配
tags: [系统版本适配, Android适配, query接口查找出来对应文件的Uri]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date created: Friday, November 1st 2024, 9:47:00 am
date updated: Wednesday, January 8th 2025, 12:00:19 am
image-auto-upload: true
feed: show
format: list
aliases: [Android 11 适配]
linter-yaml-title-alias: Android 11 适配
---

# Android 11 适配

## 适配 `targetSdkVersion` 30（修改的内容只针对 `targetSdkVersion` 30 或者以上才生效）

### 分区存储强制执行 (Android 11 强制执行，Android 10 可选执行)

`targetSdkVersion`>=30，强制执行分区存储<br>见 `分区存储`

#### 媒体文件访问权限

> 为了在保证用户隐私的同时可以更轻松地访问媒体，Android 11 增加了以下功能。执行批量操作和使用直接文件路径和原生库访问文件。

##### 执行批量操作

Android 11 向 MediaStore API 中添加了多种方法，用于简化特定媒体文件更改流程（例如在原位置编辑照片），分别是：

1. createWriteRequest() 用户向应用授予对指定媒体文件组的写入访问权限的请求
2. createFavoriteRequest() 用户将设备上指定的媒体文件标记为 " 收藏 " 的请求。对该文件具有读取访问权限的任何应用都可以看到用户已将该文件标记为 " 收藏 "。
3. createTrashRequest() 用户将指定的媒体文件放入设备垃圾箱的请求。垃圾箱中的内容会在系统定义的时间段后被永久删除。
4. createDeleteRequest() 用户立即永久删除指定的媒体文件（而不是先将其放入垃圾箱）的请求。

例子：

```kotlin
val urisToModify = listOf(uri,uri,...)
val editPendingIntent = MediaStore.createWriteRequest(contentResolver, urisToModify)

// Launch a system prompt requesting user permission for the operation.
startIntentSenderForResult(editPendingIntent.intentSender, EDIT_REQUEST_CODE, null, 0, 0, 0)


override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    when (requestCode) {
        EDIT_REQUEST_CODE ->
            if (resultCode == Activity.RESULT_OK) {
                /* Edit request granted; proceed. */
            } else {
                /* Edit request not granted; explain to the user. */
            }
    }
}
```

> 传入 uri 的集合，获取用户的同意后，就可以进行操作了。

##### 直接文件路径和原生库访问文件

Android 11 又恢复了使用直接文件路径访问访问媒体文件，也可以用 MediaStore API

1. MediaStore API
2. File API
3. 原生库，例如 fopen ()。

> Android 10 只能用 MediaStrore，或者开兼容模式 requestLegacyExternalStorage=true

##### 所有文件访问权限

```
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

val intent = Intent()
intent.action= Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION
startActivity(intent)

//判断是否获取MANAGE_EXTERNAL_STORAGE权限：
val isHasStoragePermission= Environment.isExternalStorageManager()
```

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687784928699-4036e7c5-d77d-4b7d-9866-bb79e7047a77.png)

### TelecomManager 部分 API 需要 READ_PHONE_NUMBERS 权限，READ_PHONE_STATE 不管用

1. TelecomManager 类中的 `getLine1Number()` 方法
2. TelecomManager 类中的 `getMsisdn()` 方法

当用到这两个 API 的时候，原来的 `READ_PHONE_STATE` 权限不管用了，需要 `READ_PHONE_NUMBERS` 权限才行

```kotlin
ActivityCompat.requestPermissions(this,
    arrayOf(Manifest.permission.READ_PHONE_STATE), 100)

btn2.setOnClickListener {
    val tm = this.applicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    val phoneNumber = tm.line1Number
    showToast(phoneNumber)
}
```

崩溃了：

```
java.lang.SecurityException: getLine1NumberForDisplay: Neither user 10151 nor current process has android.permission.READ_PHONE_STATE, android.permission.READ_SMS, or android.permission.READ_PHONE_NUMBERS
```

解决：清单文件注册，动态申请 READ_PHONE_NUMBERS 权限

```kotlin
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />

ActivityCompat.requestPermissions(this,  arrayOf(Manifest.permission.READ_PHONE_STATE,Manifest.permission.READ_PHONE_NUMBERS), 100)
```

> 如果你只需要获取手机号码这一个功能，也可以只申请 READ_PHONE_NUMBERS

### TelephonyManager getNetworkType 未给 READ_PHONE_STATE 部分手机崩溃

一加 Android 11 手机未给 `READ_PHONE_STATE` 权限，调用了 `TelephonyManager#getNetworkType` 会崩溃，日志如下：

```java
FATAL EXCEPTION: main
Process: qsbk.app.remix, PID: 17718
java.lang.SecurityException: getDataNetworkTypeForSubscriber
	at android.os.Parcel.createExceptionOrNull(Parcel.java:2373)
	at android.os.Parcel.createException(Parcel.java:2357)
	at android.os.Parcel.readException(Parcel.java:2340)
	at android.os.Parcel.readException(Parcel.java:2282)
	at com.android.internal.telephony.ITelephony$Stub$Proxy.getNetworkTypeForSubscriber(ITelephony.java:8803)
	at android.telephony.TelephonyManager.getNetworkType(TelephonyManager.java:3070)
	at android.telephony.TelephonyManager.getNetworkType(TelephonyManager.java:3034)
	at qsbk.app.core.utils.NetworkUtils.isConnection2G(NetworkUtils.java:116)
	at qsbk.app.core.utils.NetworkUtils.getNetworkType(NetworkUtils.java:56)
	at qsbk.app.core.net.NetRequest.addDefaultParams(NetRequest.java:372)
	at qsbk.app.core.net.NetRequest.convertParams(NetRequest.java:303)
	at qsbk.app.core.net.NetRequest.handleRequestUrl(NetRequest.java:245)
	at qsbk.app.core.net.NetRequest$1.handleRequestUrl(NetRequest.java:60)
	at qsbk.app.core.net.NetcoreRequest.execute(NetcoreRequest.java:310)
	at qsbk.app.core.net.NetcoreRequest.executeAsync(NetcoreRequest.java:170)
	at qsbk.app.core.net.NetRequest.executeAsync(NetRequest.java:176)
	at qsbk.app.core.net.NetRequest.get(NetRequest.java:133)
	at qsbk.app.core.net.NetRequest.get(NetRequest.java:129)
	at qsbk.app.core.utils.ReviewUtils.checkReviewStateIfNeed(ReviewUtils.java:91)
	at qsbk.app.remix.ui.SplashActivity.initConfig(SplashActivity.java:385)
	at qsbk.app.remix.ui.SplashActivity.init(SplashActivity.java:240)
	at qsbk.app.remix.ui.SplashActivity.access$400(SplashActivity.java:75)
	at qsbk.app.remix.ui.SplashActivity$5.onNegativeActionClicked(SplashActivity.java:470)
	at qsbk.app.core.widget.dialog.DialogFragment$1.onClick(DialogFragment.java:66)
	at qsbk.app.core.widget.dialog.SimpleDialog.lambda$setNegativeListener$1$SimpleDialog(SimpleDialog.java:124)
	at qsbk.app.core.widget.dialog.-$$Lambda$SimpleDialog$Ut_zAfByJ7vITCWCIS1aa6aNXNI.onClick(Unknown Source:4)
```

解决：在调用 `TelephonyManager#getNetworkType` 代码加上 try{}catch{}

### 自定义 Toast 后台弹出被屏蔽，普通 Toast 后台弹出不影响

> 从 Android 11 开始，已弃用自定义 Toast。如果您的应用以 Android 11 为目标平台，包含自定义 Toast 在从后台弹出时会被屏蔽

```kotlin
Toast toast = new Toast(context);
toast.setDuration(show_length);
toast.setView(view);
toast.show();
```

后台弹出自定义 Toast：

```kotlin
Handler().postDelayed({
      IToast.show("你好，我是自定义toast")
 }, 3000)
```

报错：

```
/NotificationService: Blocking custom toast from package me.hacket.assistant due to package not in the foreground at time the toast was posted
```

根据 Context 的可见性来判断的，自定义 Toast 传递的是 ApplicationContext 就会报错

```
java.lang.IllegalAccessException: Tried to access visual service WindowManager from a non-visual Context
```

### APK 签名方案 v2

TargetSdkVersion>=30，那么你就必须要加上 v 2 签名才行。否则无法安装和更新。

### Compressed resource files (Android R+ 不在允许 app 压缩 resource. Asrc)

无法在 android 11 的设备上安装成功，一直提示安装错误

```
Failure [-124: Failed parse during installPackageLI: Targeting R+ 
(version 30 and above) requires the resources.arsc of installed APKs 
to be stored uncompressed and aligned on a 4-byte boundary]
```

1. 使用 v2 签名
2. `zipalign4` 字节对齐

#### `Zipalign`

见 `zipalin.md`

### 媒体 intent 操作需要系统默认相机

从 Android 11 开始，只有预装的系统相机应用可以响应以下 intent 操作：

```kotlin
android.media.action.VIDEO_CAPTURE
android.media.action.IMAGE_CAPTURE
android.media.action.IMAGE_CAPTURE_SECURE
```

> 也就是说，如果我调用 intent 唤起照相机，使用 VIDEO_CAPTURE 的 action，只有系统的相机能够响应，而第三方的相机应用不会响应了。

```
val intent=Intent()
intent.action=android.provider.MediaStore.ACTION_IMAGE_CAPTURE
startActivity(intent)

// 无法唤起第三方相机了，只能唤起系统相机
```

### 5 G

Android 11 也是支持了 5 G 相关的一些功能，包括：

1. 检测是否连接到了 5 G 网络
2. 检查按流量计费性

#### 检测是否连接到 5 G 网络

```kotlin
private fun getNetworkType(){
    val tManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    tManager.listen(object : PhoneStateListener() {

        @RequiresApi(Build.VERSION_CODES.R)
        override fun onDisplayInfoChanged(telephonyDisplayInfo: TelephonyDisplayInfo) {
            if (ActivityCompat.checkSelfPermission(this@Android11Test2Activity, android.Manifest.permission.READ_PHONE_STATE) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                return
            }
            super.onDisplayInfoChanged(telephonyDisplayInfo)

            when(telephonyDisplayInfo.networkType) {
                TelephonyDisplayInfo.OVERRIDE_NETWORK_TYPE_LTE_ADVANCED_PRO -> showToast("高级专业版 LTE (5Ge)")
                TelephonyDisplayInfo.OVERRIDE_NETWORK_TYPE_NR_NSA -> showToast("NR (5G) - 5G Sub-6 网络")
                TelephonyDisplayInfo.OVERRIDE_NETWORK_TYPE_NR_NSA_MMWAVE -> showToast("5G+/5G UW - 5G mmWave 网络")
                else -> showToast("other")
            }
        }

    }, PhoneStateListener.LISTEN_DISPLAY_INFO_CHANGED)
}
```

#### 判断是不是按流量计费的

```kotlin
val manager = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
 manager.registerDefaultNetworkCallback(object : ConnectivityManager.NetworkCallback() {
    override fun onCapabilitiesChanged(network: Network, networkCapabilities: NetworkCapabilities) {
      super.onCapabilitiesChanged(network, networkCapabilities)

        //true 代表连接不按流量计费
        val isNotFlowPay=networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_METERED) ||
                        networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_TEMPORARILY_NOT_METERED)
      }
})
```

### 后台位置信息访问权限加强（相比较 Android 10）

> Android 11 的设备上，当应用中的某项功能请求在后台访问位置信息时，用户看到的系统对话框不再包含用于启用后台位置信息访问权限的按钮。如需启用后台位置信息访问权限，用户必须在设置页面上针对应用的位置权限设置一律允许选项。

1. 从 Android 10 系统的设备开始，就需要请求**后台位置**权限 (`ACCESS_BACKGROUND_LOCATION`)，并选择 `Allow all the time （始终允许）` 才能获得后台位置权限。Android 11 设备上再次加强对**后台位置**权限的管理，主要表现在系统对话框上，对话框不再提示始终允许字样，而是提供了**后台位置**权限的设置入口，需要在设置页面选择始终允许才能获得后台位置权限。
2. 在 Android 11 系统的设备上，targetVersion 小于 30 的时候，可以前台后台位置权限一起申请，并且对话框提供了文字说明，表示需要随时获取用户位置信息，进入设置选择始终允许即可。但 targetVersion>=30 的时候，你必须单独申请后台位置权限，而且要在获取前台权限之后，顺序不能乱。并且无任何提示，需要开发者自己设计提示样式。

#### Android 10 设备，申请前台 (ACCESS_COARSE_LOCATION) 和后台位置 (ACCESS_BACKGROUND_LOCATION) 权限同时申请（任意 `targetSdkVersion`）（弹窗上有始终允许按钮）

```kotlin
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687784950029-39011949-167e-4e75-b27e-5d79584792d4.png)

#### Android 11 设备，targetSdkVersion 小于等于 29 (Android 10), 申请前台和后台位置权限同时申请（弹窗无无始终允许按钮，提供到设置页设置始终允许）

```kotlin
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687784958032-9c4d49b7-3c99-4940-8a8c-369afd3ece27.png)

#### Android 11 设备，targetSdkVersion 大于等于 30 (Android 11), 申请前台和后台位置权限同时申请（无反应）

```kotlin
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), 100)
```

执行无反应

#### Android 11 设备，targetSdkVersion=30 (Android 11), 先申请前台位置权限，后申请后台位置权限（先前台再后台权限）

1. 先申请前台位置权限

```kotlin
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), 100)
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687784979838-9e23b1e2-e24e-45e2-a17e-752646637e63.png)<br>2. 后申请后台位置权限，执行效果 (直接跳转到设置页面，无任何说明)：

```kotlin
requestPermissions(arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687784989744-1f180c97-766b-4f51-a2f7-c8da70ee12c7.png)

#### 如何适配？

1. TargetSdkVersion<30 情况下，如果你之前就有判断过前台和后台位置权限，那就无需担心，没有什么需要适配。
2. TargetSdkVersion>30 情况下，需要分开申请前后台位置权限，并且对后台位置权限申请做好说明和引导，当然也是为了更好的服务用户。

```kotlin
val permissionAccessCoarseLocationApproved = ActivityCompat
    .checkSelfPermission(this, permission.ACCESS_COARSE_LOCATION) ==
    PackageManager.PERMISSION_GRANTED

if (permissionAccessCoarseLocationApproved) {
   val backgroundLocationPermissionApproved = ActivityCompat
       .checkSelfPermission(this, permission.ACCESS_BACKGROUND_LOCATION) ==
       PackageManager.PERMISSION_GRANTED

   if (backgroundLocationPermissionApproved) {
        //前后台位置权限都有
   } else {
        //申请后台权限
        if (applicationInfo.targetSdkVersion < Build.VERSION_CODES.R){
            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                    200)
        }else{
            AlertDialog.Builder(this).setMessage("需要提供后台位置权限，请在设置页面选择始终允许")
                    .setPositiveButton("确定", DialogInterface.OnClickListener { dialog, which ->
                        ActivityCompat.requestPermissions(this,
                                arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                                200)
                    }).create().show()
        }

   }
} else {
    if (applicationInfo.targetSdkVersion < Build.VERSION_CODES.R){
        //申请前台和后台位置权限
        ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                100)
    }else{
        //申请前台位置权限
        ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION),
                100)
    }
}
```

- [x] 百度定位 Android 11.0 开发须知<br><https://lbsyun.baidu.com/index.php?title=android-locsdk/guide/addition-func/android11-notice>

### 软件包可见性

> Android 11 更改了应用查询用户已在设备上安装的其他应用以及与之交互的方式。使用新的元素，应用可以定义一组自身可访问的其他应用。通过告知系统应向您的应用显示哪些其他应用，此元素有助于鼓励最小权限原则。此外，此元素还可帮助 Google Play 等应用商店评估应用为用户提供的隐私权和安全性。

Android 11 中，如果你想去获取其他应用的信息，比如包名，名称等等，不能直接获取了，必须在清单文件中添加 `<queries>` 元素，告知系统你要获取哪些应用信息或者哪一类应用。

```kotlin
val pm = this.packageManager
val listAppcations: List<ApplicationInfo> = pm
        .getInstalledApplications(PackageManager.GET_META_DATA)
for (app in listAppcations) {
    Log.e("lz",app.packageName)
}
```

> 在 Android 11 版本，只能查询到自己应用和系统应用的信息，查不到其他应用的信息了。调用 `getInstalledApplications()`、`resolveActivity()`、`queryIntentActivities()` 或 `getInstalledPackages()` 的可能没有返回此包名。两种方式解决：

- [x] intent. ResolveActivity returns null in API 30<br><https://stackoverflow.com/questions/62535856/intent-resolveactivity-returns-null-in-api-30>

#### 1. Queries 元素中加入具体包名

```xml
<manifest package="com.example.game">
    <queries>
        <package android:name="com.example.store" />
        <package android:name="com.example.services" />
    </queries>
    ...
</manifest>
```

#### 2. Queries 元素中加入固定过滤的 intent

```xml
<manifest package="com.example.game">
    <queries>
        <intent>
            <action android:name="android.intent.action.SEND" />
            <data android:mimeType="image/jpeg" />
        </intent>
    </queries>
</manifest>
```

Remix 适配：

```xml
<queries>
    <!--录视频-->
    <intent>
        <action android:name="android.media.action.VIDEO_CAPTUR" />
    </intent>
    <!--拍照-->
    <intent>
        <action android:name="android.media.action.IMAGE_CAPTURE" />
    </intent>
    <!--auto start-->
    <package android:name="com.miui.securitycenter" />
    <package android:name="com.samsung.android.sm_cn" />
    <package android:name="com.huawei.systemmanager" />
    <package android:name="com.vivo.permissionmanager" />
    <package android:name="com.meizu.safe" />
    <package android:name="com.oppo.safe" />
    <package android:name="com.yulong.android.coolsafe" />
    <package android:name="com.meitu.mobile.security.autorun" />
    <intent>
        <action android:name="com.letv.android.permissionautoboot" />
    </intent>
    <intent>
        <action android:name="android.settings.APPLICATION_DETAILS_SETTINGS" />
    </intent>
    <!--overlay-->
    <intent>
        <action android:name="miui.intent.action.APP_PERM_EDITOR" />
    </intent>
    <intent>
        <action android:name="com.meizu.safe.security.SHOW_APPSEC" />
    </intent>
    <package android:name="com.qihoo360.mobilesafe" />
    <package android:name="com.coloros.safecenter" />
</queries>
```

#### 查询所有 App 信息

应用如果是浏览器或者设备管理器咋办呢？我就要获取所有包名啊？

添加 `QUERY_ALL_PACKAGES` 权限，清单文件中加入即可。Google Play 它为需要 `QUERY_ALL_PACKAGES` 权限的应用会提供相关指南。

### 文档访问 SAF（Storage Access Framework）限制

可以通过 SAF (存储访问框架 --Storage Access Framework) 来访问公共目录，但 Android 11 部分目录和文件不能访问了

#### 无法再使用 `ACTION_OPEN_DOCUMENT_TREE` intent 操作请求访问以下目录

1. 内部存储卷的根目录
2. 设备制造商认为可靠的各个 SD 卡卷的根目录，无论该卡是模拟卡还是可移除的卡。可靠的卷是指应用在大多数情况下可以成功访问的卷
3. Download 目录

#### 无法再使用 `ACTION_OPEN_DOCUMENT_TREE` 或 `ACTION_OPEN_DOCUMENT intent` 操作请求用户从以下目录中选择单独的文件

1. Android/data/ 目录及其所有子目录
2. Android/obb/ 目录及其所有子目录

### 限制对 APN 数据库的读取访问

APN 是啥？

> 指一种网络接入技术，是通过手机上网时必须配置的一个参数，APN 配置参数包括名字，运营商编号，APN 接入点等等。

没有 `Manifest.permission.WRITE_APN_SETTINGS` 权限就不能读取 APN 数据库了，这是个系统权限？

### 在元数据文件中声明 " 无障碍 " 按钮使用情况

AccessibilityServiceInfo 要设置 flag 为 `FLAG_REQUEST_ACCESSIBILITY_BUTTON`，getAccessibilityButtonController 方法获取辅助功能按钮控制器，并且可用于查询辅助功能按钮的状态并注册监听器以进行交互和辅助功能按钮的状态更改。

但是，Android 11 开始，这样写不能获取辅助按钮回调事件了，得换成另外一种写法。在元数据文件（通常为 `res/raw/accessibilityservice.xml`）中使用 `flagRequestAccessibilityButton` 标记声明您的无障碍服务与 " 无障碍 " 按钮的关联。

### 不能停用设备到设备文件传输，可停用云端的备份和恢复

- Android: allowBackup 属性

> 代表是否允许应用参与备份和恢复基础架构。如果将此属性设为 false，则永远不会为该应用执行备份或恢复，即使是采用全系统备份方法也不例外（这种备份方法通常会通过 adb 保存所有应用数据）。此属性的默认值为 true。

如果您的应用以 Android 11 为目标平台，您将无法再使用 allowBackup=false 属性停用应用文件的 `设备到设备迁移`。系统会自动启用此功能。不过，即使您的应用以 Android 11 为目标平台，您也可以通过将 allowBackup 属性设置为 false 来停用 `应用文件的云端备份和恢复`。

### 自动重置权限

如果应用以 Android 11 为目标平台并且数月未使用，系统会通过自动重置用户已授予应用的运行时敏感权限来保护用户数据。此操作与用户在系统设置中查看权限并将应用的访问权限级别更改为拒绝的做法效果一样。如果应用已遵循有关在运行时请求权限的最佳做法，那么您不必对应用进行任何更改。这是因为，当用户与应用中的功能互动时，您应该会验证相关功能是否具有所需权限。

- 关闭自动重置权限

> 如果需要关闭这个功能，只有引导用户去设置页面关闭了，可以调用包含 `Settings.ACTION_APPLICATION_DETAILS_SETTINGS` action 的 Intent 将用户定向到系统设置中应用的页面。

- 检查应用是否停用自动重置功能

> `PackageManager的isAutoRevokeWhitelisted()` 方法。如果此方法返回 true，代表系统不会自动重置应用的权限。

### 增强前台服务类型

从 Android 9 开始，应用仅限于在前台访问摄像头和麦克风。为了进一步保护用户，Android 11 更改了前台服务访问摄像头和麦克风相关数据的方式。如果您的应用以 Android 11 为目标平台并且在某项前台服务中访问这些类型的数据，您需要在该前台服务的声明的 `foregroundServiceType` 属性中添加新的 `camera` 和 `microphone` 类型。

在 Android 10 的时候，对于前台定位服务就必须加上 `android:foregroundServiceType="location"`，现在 Android 11 上又增加了两个权限限制，一个是摄像头一个是麦克风。

应用某项前台服务需要访问位置信息、摄像头和麦克风，那么就要在清单文件中这样添加：

```xml
<manifest>
    <service ...
        android:foregroundServiceType="location|camera|microphone" />
</manifest>
```

> 有的朋友可能测试发现，不加 foregroundServiceType 的前提下，让 Activity 启动了一个前台服务，并在服务里去获取定位，竟然可以获取到定位信息，难道官方说错了？<br>其实这是因为你并没有让前台服务单独运行，你可以试着在 Activity 启动 Service 后，进入 Home 界面，然后过几秒再请求位置，就请求不到了。但是不会崩溃，因为这个被系统设置的权限类别为 MODE_IGNORED，也就是静默失败模式。<br>所以为了保险起见，只要前台服务涉及到了这三个功能，就在清单文件加上 android:foregroundServiceType

适配 Android 11 手机（此模块的修改内容针对所有项目在 Android 11 手机上存在的改动，与 targetSdkVersion 无关）

## 适配 Android 11 手机（此模块的修改内容针对所有项目在 Android 11 手机上存在的改动，与 targetSdkVersion 无关）

### 数据访问审核 AppOpsManager. OnOpNotedCallback

### 单次授权

在 Android 11 中，每当应用请求与 `位置信息`、`麦克风` 或 `摄像头` 相关的权限时，面向用户的权限对话框会包含仅限这一次选项。如果用户在对话框中选择此选项，系统会自动提供一个单次授权的选项，只供这一次权限获取。然后用户下次打开 app 的时候，系统会再次提示用户授予权限。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785025149-7d90084c-3408-4e9c-8687-1d60b7b78594.png)

# Android 11 (targetSdkVersion=30) 常见适配要点（非所有）

下面要点 targetSdkVersion>=30 且手机为 Android 11 才生效，不是 Android 11 的手机就会生效。

## 分区存储

在 targetSdkVersion=29 (Android 10) 以前，只要程序获得了 `READ_EXTERNAL_STORAGE` 和 `WRITE_EXTERNAL_STORAGE` 权限，就可以随意在读取和写入外部存储的公有目录上新建文件夹或文件。在 Android 10 中为了让用户更好地控制自己的文件，并限制文件混乱情况，Android 10 更改了 App 访问设备存储空间的方式，提出了作用域存储模型，或者叫分区存储模型，有的也叫沙箱模型。

Android 11 强制执行分区存储模型，需要 `targetSdkVersion=30` 才强制执行，`targetSdkVersion<30` 还是可以以旧存储模型运行。

### RequestLegacyExternalStorage 和 preserveLegacyExternalStorage

RequestLegacyExternalStorage 是 Android 10 引入的，preserveLegacyExternalStorage 是 Android 11 引入的；两者为 false 时以分区存储模型运行，这里讨论为 true 的情况。

1. RequestLegacyExternalStorage=true，让 targetSdkVersion 是 29（适配了 Android 10）的 App 无论是新安装还是覆盖安装，在 Android 10 系统上也继续访问旧的存储模型，requestLegacyExternalStorage 在 Android 11 上的手机失效。
2. PreserveLegacyExternalStorage=true，应用从非分区存储覆盖安装，Environment.IsExternalStorageLegacy () 为 true，以旧存储模型运行；应用卸载重新安装 (全新安装) 或者从分区存储覆盖安装，结果 Environment.IsExternalStorageLegacy () 为 flase，以分区存储模型运行。
3. App targetSDKVersion=30，在 Android 11 的系统上首次安装，App 只能以分区存储模型运行。

### 权限

1. 开启了分区模式，WRITE_EXTERNAL_STORAGE 权限没用了
2. 写外部公共目录不需要 WRITE_EXTERNAL_STORAGE 权限
3. 新的权限 `MANAGE_EXTERNAL_STORAGE` 管理外部存储

#### 不需要适配的情况

1. 内部存储不需要适配，可以继续使用 File API
2. 私有目录 (external/internal) 不需要适配，可以继续使用 File API

#### 外部存储公共目录适配

1. 兼容模式 (`Environment.isExternalStorageLegacy()=true`)，还是继续用 File API 旧存储模型
2. 分区存储模式，Android 10，只能用 MediaStore API
3. 分区存储模式，Android 11，可以用 MediaStore API
4. 分区存储模式，Android 11，可以用 File API 且不需要 WRITE_EXTERNAL_STORAGE 权限；如果没有 MANAGE_EXTERNAL_STORAGE 权限，用 File 只能访问 Environment 定义的那些目录 (`Pictures`、`Audios`、`Videos`、`Downloads` 等)；有 `MANAGE_EXTERNAL_STORAGE`，可以在任意目录用 File 访问

> 分区存储模型中，Android 10 只能用 MediaStore API；Android 11 可以用 File 和 MediaStore 两种方式访问公共目录，但 MediaStore 比 File 的性能要好点，推荐用 MediaStore。

### 适配原则

`Download、Documents、Pictures 、DCIM、Movies、Music、Ringtones、Alarms、Podcasts`

1. 能存应用私有目录 (external/internal)，尽可能存私有目录
2. 图片放 Pictures/、DCIM/
3. 视频放 Movies/
4. 音频放 Music/
5. 铃声放 Ringtones/
6. 文档放 Documents/
7. 其他类型文件放 Download/

### 可能需要适配的场景

1. 下载模块
2. 头像/封面的上传
3. File 加载的本地图片
4. File 加载的视频
5. 文件的上传
6. 其他使用 File 方式加载外部存储的情况

### 适配代码

具体见 remix 工程 [ScopedStorage.kt](https://git.moumentei.com/android/remix/blob/dev/QsbkCore/src/qsbk/app/core/scopestorage/ScopedStorage.kt)

## READ_PHONE_STATE 权限相关

### TelecomManager 部分 API 需要 READ_PHONE_NUMBERS 权限，READ_PHONE_STATE 不管用

1. TelecomManager 类中的 getLine 1 Number () 方法
2. TelecomManager 类中的 getMsisdn () 方法

当用到这两个 API 的时候，原来的 `READ_PHONE_STATE` 权限不管用了，需要 `READ_PHONE_NUMBERS` 权限才行

```kotlin
ActivityCompat.requestPermissions(this,
    arrayOf(Manifest.permission.READ_PHONE_STATE), 100)

btn2.setOnClickListener {
    val tm = this.applicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    val phoneNumber = tm.line1Number
    showToast(phoneNumber)
}
```

崩溃了：

```
java.lang.SecurityException: getLine1NumberForDisplay: Neither user 10151 nor current process has android.permission.READ_PHONE_STATE, android.permission.READ_SMS, or android.permission.READ_PHONE_NUMBERS
```

解决：清单文件注册，动态申请 `READ_PHONE_NUMBERS` 权限

```kotlin
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />

ActivityCompat.requestPermissions(this,  arrayOf(Manifest.permission.READ_PHONE_STATE,Manifest.permission.READ_PHONE_NUMBERS), 100)
```

> 如果你只需要获取手机号码这一个功能，也可以只申请 READ_PHONE_NUMBERS

### TelephonyManager getNetworkType 未给 READ_PHONE_STATE 部分手机崩溃

一加 Android 11 手机未给 `READ_PHONE_STATE` 权限，调用了 `TelephonyManager#getNetworkType` 会崩溃，日志如下：

```java
FATAL EXCEPTION: main
Process: qsbk.app.remix, PID: 17718
java.lang.SecurityException: getDataNetworkTypeForSubscriber
	at android.os.Parcel.createExceptionOrNull(Parcel.java:2373)
	at android.os.Parcel.createException(Parcel.java:2357)
	at android.os.Parcel.readException(Parcel.java:2340)
	at android.os.Parcel.readException(Parcel.java:2282)
	at com.android.internal.telephony.ITelephony$Stub$Proxy.getNetworkTypeForSubscriber(ITelephony.java:8803)
	at android.telephony.TelephonyManager.getNetworkType(TelephonyManager.java:3070)
	at android.telephony.TelephonyManager.getNetworkType(TelephonyManager.java:3034)
	at qsbk.app.core.utils.NetworkUtils.isConnection2G(NetworkUtils.java:116)
	at qsbk.app.core.utils.NetworkUtils.getNetworkType(NetworkUtils.java:56)
	at qsbk.app.core.net.NetRequest.addDefaultParams(NetRequest.java:372)
	at qsbk.app.core.net.NetRequest.convertParams(NetRequest.java:303)
	at qsbk.app.core.net.NetRequest.handleRequestUrl(NetRequest.java:245)
	at qsbk.app.core.net.NetRequest$1.handleRequestUrl(NetRequest.java:60)
	at qsbk.app.core.net.NetcoreRequest.execute(NetcoreRequest.java:310)
	at qsbk.app.core.net.NetcoreRequest.executeAsync(NetcoreRequest.java:170)
	at qsbk.app.core.net.NetRequest.executeAsync(NetRequest.java:176)
	at qsbk.app.core.net.NetRequest.get(NetRequest.java:133)
	at qsbk.app.core.net.NetRequest.get(NetRequest.java:129)
	at qsbk.app.core.utils.ReviewUtils.checkReviewStateIfNeed(ReviewUtils.java:91)
	at qsbk.app.remix.ui.SplashActivity.initConfig(SplashActivity.java:385)
	at qsbk.app.remix.ui.SplashActivity.init(SplashActivity.java:240)
	at qsbk.app.remix.ui.SplashActivity.access$400(SplashActivity.java:75)
	at qsbk.app.remix.ui.SplashActivity$5.onNegativeActionClicked(SplashActivity.java:470)
	at qsbk.app.core.widget.dialog.DialogFragment$1.onClick(DialogFragment.java:66)
	at qsbk.app.core.widget.dialog.SimpleDialog.lambda$setNegativeListener$1$SimpleDialog(SimpleDialog.java:124)
	at qsbk.app.core.widget.dialog.-$$Lambda$SimpleDialog$Ut_zAfByJ7vITCWCIS1aa6aNXNI.onClick(Unknown Source:4)
```

原因：原生手机和大部分国内手机都没问题，只是一加 Android 11 的手机才有问题；具体原因未知，猜测是一加的权限系统做了修改未给 `READ_PHONE_STATE` 权限就崩溃

解决：在调用 `TelephonyManager#getNetworkType` 代码加上 `try{}catch{}`；需要加上权限 `READ_PHONE_STATE` 或者 `READ_BASIC_PHONE_STAT`

## 自定义 Toast 后台弹出被屏蔽，普通 Toast 后台弹出不影响

> 从 Android 11 开始，已弃用自定义 Toast。如果您的应用以 Android 11 为目标平台，包含自定义 Toast 在从后台弹出时会被屏蔽

```kotlin
Toast toast = new Toast(context);
toast.setDuration(show_length);
toast.setView(view);
toast.show();
```

后台弹出自定义 Toast：

```kotlin
Handler().postDelayed({
      IToast.show("你好，我是自定义toast")
 }, 3000)
```

报错：

```
/NotificationService: Blocking custom toast from package me.hacket.assistant due to package not in the foreground at time the toast was posted
```

## 媒体 intent 操作需要系统默认相机

从 Android 11 开始，只有预装的系统相机应用可以响应以下 intent 操作：

```kotlin
android.media.action.VIDEO_CAPTURE
android.media.action.IMAGE_CAPTURE
android.media.action.IMAGE_CAPTURE_SECURE
```

> 也就是说，如果我调用 intent 唤起照相机，使用 VIDEO_CAPTURE 的 action，只有系统的相机能够响应，而第三方的相机应用不会响应了。

```
val intent=Intent()
intent.action=android.provider.MediaStore.ACTION_IMAGE_CAPTURE
startActivity(intent)

// 无法唤起第三方相机了，只能唤起系统相机
```

## 软件包可见性

> Android 11 更改了应用查询用户已在设备上安装的其他应用以及与之交互的方式。使用新的元素，应用可以定义一组自身可访问的其他应用。通过告知系统应向您的应用显示哪些其他应用，此元素有助于鼓励最小权限原则。此外，此元素还可帮助 Google Play 等应用商店评估应用为用户提供的隐私权和安全性。

Android 11 中，如果你想去获取其他应用的信息，比如包名，名称等等，不能直接获取了，必须在清单文件中添加 `<queries>` 元素，告知系统你要获取哪些应用信息或者哪一类应用。

```kotlin
val pm = this.packageManager
val listAppcations: List<ApplicationInfo> = pm
        .getInstalledApplications(PackageManager.GET_META_DATA)
for (app in listAppcations) {
    Log.e("lz",app.packageName)
}
```

> 在 Android 11 版本，只能查询到自己应用和系统应用的信息，查不到其他应用的信息了。调用 `getInstalledApplications()`、`resolveActivity()`、`getPackageInfo()`、`queryIntentActivities()` 或 `getInstalledPackages()` 的可能没有返回此包名。两种方式解决：

- [x] intent. ResolveActivity returns null in API 30<br><https://stackoverflow.com/questions/62535856/intent-resolveactivity-returns-null-in-api-30>

### 增加 queries 适配

在 AndroidMainifest. Xml 中定义需要访问的应用信息

#### Queries 元素中加入具体包名 (需要访问某个应用信息，直接指定应用包名)

```xml
<manifest package="com.example.game">
    <queries>
        <package android:name="com.example.store" />
        <package android:name="com.example.services" />
    </queries>
    ...
</manifest>
```

#### Queries 元素中加入固定过滤的 intent (需要访问具有某些 intent 的外部组件，指定需要访问的 intent)

```xml
<manifest package="com.example.game">
    <queries>
        <intent>
            <action android:name="android.intent.action.SEND" />
            <data android:mimeType="image/jpeg" />
        </intent>
    </queries>
</manifest>
```

#### 需要访问某些外部 content provider，指定 authoritites

```xml
<queries>
    <provider android:authorities="com.example.settings.files" />
</queries>
```

### Remix 的适配

```xml
<queries>
    <!--录视频-->
    <intent>
        <action android:name="android.media.action.VIDEO_CAPTUR" />
    </intent>
    <!--拍照-->
    <intent>
        <action android:name="android.media.action.IMAGE_CAPTURE" />
    </intent>
    <!--auto start-->
    <package android:name="com.miui.securitycenter" />
    <package android:name="com.samsung.android.sm_cn" />
    <package android:name="com.huawei.systemmanager" />
    <package android:name="com.vivo.permissionmanager" />
    <package android:name="com.meizu.safe" />
    <package android:name="com.oppo.safe" />
    <package android:name="com.yulong.android.coolsafe" />
    <package android:name="com.meitu.mobile.security.autorun" />
    <intent>
        <action android:name="com.letv.android.permissionautoboot" />
    </intent>
    <intent>
        <action android:name="android.settings.APPLICATION_DETAILS_SETTINGS" />
    </intent>
    <!--overlay-->
    <intent>
        <action android:name="miui.intent.action.APP_PERM_EDITOR" />
    </intent>
    <intent>
        <action android:name="com.meizu.safe.security.SHOW_APPSEC" />
    </intent>
    <package android:name="com.qihoo360.mobilesafe" />
    <package android:name="com.coloros.safecenter" />
</queries>
```

### 查询所有 App 信息

应用如果是浏览器或者设备管理器咋办呢？我就要获取所有包名啊？

在 AndroidManifest. Xml 中加入权限 `<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />`，这个需要谨慎使用，因为应用市场上线检查可能会需要提供使用的必要性说明，例如 Google Play 政策：`https://support.google.com/googleplay/android-developer/answer/10158779`

## 后台位置信息访问权限加强（相比较 Android 10）

> Android 11 的设备上，当应用中的某项功能请求在后台访问位置信息时，用户看到的系统对话框不再包含用于启用后台位置信息访问权限的按钮。如需启用后台位置信息访问权限，用户必须在设置页面上针对应用的位置权限设置一律允许选项。

1. 从 Android 10 系统的设备开始，就需要请求**后台位置**权限 (`ACCESS_BACKGROUND_LOCATION`)，并选择 `Allow all the time （始终允许）` 才能获得后台位置权限。Android 11 设备上再次加强对**后台位置**权限的管理，主要表现在系统对话框上，对话框不再提示始终允许字样，而是提供了**后台位置**权限的设置入口，需要在设置页面选择始终允许才能获得后台位置权限。
2. 在 Android 11 系统的设备上，targetVersion 小于 30 的时候，可以前台后台位置权限一起申请，并且对话框提供了文字说明，表示需要随时获取用户位置信息，进入设置选择始终允许即可。但 targetVersion>=30 的时候，你必须单独申请后台位置权限，而且要在获取前台权限之后，顺序不能乱。并且无任何提示，需要开发者自己设计提示样式。

## 增强前台服务类型

从 Android 9 开始，应用仅限于在前台访问摄像头和麦克风。为了进一步保护用户，Android 11 更改了前台服务访问摄像头和麦克风相关数据的方式。如果您的应用以 Android 11 为目标平台并且在某项前台服务中访问这些类型的数据，您需要在该前台服务的声明的 `foregroundServiceType` 属性中添加新的 `camera` 和 `microphone` 类型。

在 Android 10 的时候，对于前台定位服务就必须加上 `android:foregroundServiceType="location"`，现在 Android 11 上又增加了两个权限限制，一个是摄像头一个是麦克风。

应用某项前台服务需要访问位置信息、摄像头和麦克风，那么就要在清单文件中这样添加：

```xml
<manifest>
    <service ...
        android:foregroundServiceType="location|camera|microphone" />
</manifest>
```

## Webview 访问文件报错（setAllowFileAccess）

- 问题描述：

在 target 到 Android 11 及以上的时候，默认 `setAllowFileAccess` 从 true 改成了 false，无法访问到 context.GetDir () 里面的文件，参考：<https://developer.android.com/reference/android/webkit/WebSettings#setAllowFileAccess(boolean)>

- 运行时问题：

加载 file://data 目录底下数据时 webview 报错：网页无法加载，net:ERR_ACCESS_DENIED

- 解决：

手动调用一下 `webSettings.setAllowFileAccess(true)`

## 其他

### Ijkplayer

- 问题描述：<br>在 target 到 Android 11 并且在 64 位的安卓系统版本 11 及以上的手机，使用 ijkplayer 会产生崩溃。这里的原因是 Android 11 对于 64 位的处理器中，每个指针的第一个字节将被用作标记位，用于 ARM 的内存标记扩展（MTE）支持。在释放内存的时候如果修改这个标记位程序就会崩溃。 <br>那么 ijkplayer 在哪里会导致第一个字节被修改了呢，查看这个 issues <https://github.com/bilibili/ijkplayer/issues/5206> 以及提交记录 <https://github.com/bilibili/ijkplayer/commit/e99d640e5fe94c65132379307f92d7180bcde8e7> 可以看出，主要的原因是之前将指针转换成了 int 64_t 类型导致了精度丢失，修改的地方是将指针转成 String 或者无符号整形，避免精度丢失导致的首位字节丢失。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785366304-173b2301-636a-4a70-bbf6-672759293a3b.png)

> 在上面的图中，访问 0 x 8000 的内存是可行的，因为用于进行访问的指针具有与被访问的内存相同的标签 (用颜色表示)。但是，对 0 x 9000 的访问将会失败，因为指针对内存有不同的标记。

- 运行时崩溃：<br>运行时的 native 崩溃
- 解决办法：<br>解决办法有两个，一个是拉一下 ijkplayer 最新的代码重新 build 一个依赖库更新一下，因为 ijkplayer 已经修改了这个错误。第二个办法是通过设置 `<application android:allowNativeHeapPointerTagging="false">` 暂时禁用 `Pointer Tagging` 功能。

### 微博 SDK

# Android 11 分区存储（沙箱，Scoped Storage）

- [x] Android 11 中的存储机制更新<br><https://developer.android.google.cn/about/versions/11/privacy/storage>

<https://github.com/android/storage-samples>

## 分区存储 (Android 11 强制执行，Android 10 可选执行)

### 概述

在 Android 10 以前，只要程序获得了 `READ_EXTERNAL_STORAGE` 和 `WRITE_EXTERNAL_STORAGE` 权限，就可以随意在读取和写入外部存储的公有目录上新建文件夹或文件。在 Android 10 中为了让用户更好地控制自己的文件，并限制文件混乱情况，Android Q 更改了 App 访问设备存储空间的方式，提出了分区存储。

- Android Q 之前存储<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785472602-d8ce5e95-83f9-4950-a96e-af9431a54eda.png)
- Android Q 及以上<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785488606-b0baf80d-df82-4191-9b91-071625034a48.png)

> 分区存储对 `内部存储私有目录` 和 `外部存储私有目录` 都没有影响，只对外部存储公共目录有影响

- 受影响的接口：<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785502174-834f7df1-f9db-4fc3-96fc-0bb3e719ec14.png)
- 不需要适配
  1. 私有目录（外部和内部存储）
  2. 内部存储

### 权限问题

| -                 | AndroidQ                 | AndroidQ 以下       |
| ----------------- | ------------------------ | ----------------- |
| 外部存储私有目录          | 无需权限，可用 File 访问          | 无需权限，可用 File 访问   |
| 外部存储公共目录自己创建      | 无需权限，MediaStore/SAF 访问   | 需要存储权限，可用 File 访问 |
| 外部存储公共目录其他 App 创建 | 需要存储权限，MediaStore/SAF 访问 | 需要存储权限，可用 File 访问 |

> 当您使用直接文件路径 File 依序读取媒体文件时，其性能与 MediaStore API 相当。但是，当您使用直接文件路径随机读取和写入媒体文件时，进程的速度可能最多会慢一倍。在此类情况下，我们建议您改为使用 MediaStore API。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785550822-99e439e7-98d3-4c48-8af7-0db1dde73d1b.png)<br>开启了分区存储后，使用 File 访问外部公共目录会报下面异常

```
Caused by: java.io.FileNotFoundException: /storage/emulated/0/test3.txt: open failed: EACCES (Permission denied)
    at libcore.io.IoBridge.open(IoBridge.java:492)
    at java.io.FileOutputStream.<init>(FileOutputStream.java:236)
    at java.io.FileOutputStream.<init>(FileOutputStream.java:125)
    at java.io.FileWriter.<init>(FileWriter.java:63)
```

- 所有文件访问权<br>系统应用可以申请 `android.permission.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION` 系统权限，同样拥有完整存储空间权限，可以访问所有文件。<br>参考 [Manage all files on a storage device](https://developer.android.google.cn/training/data-storage/manage-all-files)

判断是否有所有文件的访问权限

```
Environment.isExternalStorageManager() // Android11才有
```

### 存储空间模式（Legacy View、Filtered View）

Android Q 规定了 App 有两种存储空间模式视图：`Legacy View`、`Filtered View`

#### Filtered View（沙箱模式）

App 只能直接访问 App-specific 目录文件，没有权限访问 App-specific 外的文件。访问其他目录，只能通过 MediaStore、SAF、或者其他 App 提供 ContentProvider 访问。

Scoped Storage 将存储空间分为两部分：

##### 公共目录：Downloads、Documents、Pictures 、DCIM、Movies、Music、Ringtones

```
- 公共目录的文件在App卸载后，不会删除
- 可以通过SAF、MediaStore接口访问
```

##### App-specific 目录

- 对于 Filtered View App，App-specific 目录只能自己直接访问
- App 卸载，数据会清除
- 获取 App-specific 目录

```java
获取Media接口：getExternalMediaDirs
获取Cache接口：getExternalCacheDirs
获取Data接口：getExternalFilesDirs
获取Obb接口：getObbDirs // 数据大的App用的，比如游戏
```

- App-specific 目录内部多媒体文件
  1. 默认情况下 MediaScanner 不会扫描 App-specific 里面的多媒体文件，如果需要扫描需要通过 MediaScannerConnection. ScanFile 添加到 MediaProvider 数据库中，供其他 App 访问，访问方式跟读写公共目录一样。
  2. App 通过 ContentProvider 共享出去

#### Legacy View（兼容模式）

兼容模式下应用申请存储权限，即可拥有外部存储完整目录访问权限，通过 Android 10 之前文件访问方式运行，以下两种方法设置应用以兼容模式运行。

1. AndroidManifest 中申明<br>tagretSDK 大于等于 Android 10（API level 29），在 manifest 中设置 requestLegacyExternalStorage 属性为 true。

```xml
<manifest ...>
...
<application android:requestLegacyExternalStorage="true" ... >
...
</manifest>
```

2. 判断兼容模式接口

```java
//返回值
//true : 应用以兼容模式运行
//false：应用以分区存储特性运行
Environment.isExternalStorageLegacy();
```

> 备注：应用已完成存储适配工作且已打开分区存储开关，如果当前应用以兼容模式运行，覆盖安装后应用仍然会以兼容模式运行，卸载重新安装应用才会以分区存储模式运行

3. 确定 App 运行模式

```
// AndroidR手机分区存储运行测试
targetSdkVersion>=30的，忽略android:requestLegacyExternalStorage="true/false"的配置，都以分区存储模式运行，不可使用File
targetSdkVersion=29的，未配置android:requestLegacyExternalStorage="true"或配置为false，以分区存储模式运行，不可使用File
targetSdkVersion=29的，配置了android:requestLegacyExternalStorage="true"，以兼容模式运行，可以使用File
targetSdkVersion<29的，以兼容模式运行
```

> Android 11，自己创建的媒体文件可以通过 Java File Api 的方式访问媒体库文件（检查？）；非媒体库的肯定不行

### 如何适配

1. Google 官方推荐我们使用 `MediaStore` 提供的 API 访问**图片**、**视频**、**音频**资源
2. 使用 SAF（存储访问框架）访问其它任意类型的资源。它会调用系统内置的文件浏览器供用户自主选择文件

注意：

1. 不同的资源要放到对应的目录，不能将文件放到 `PICTURES` 目录下
2. 打开，创建文件都只能用 uri，不能用 File
3. Environment. GetExterXXX 过时
4. 各大 rom 厂商都有自己的适配文档
5. DCMI 不能创建文件夹
6. 非媒体文件只能放 DOWNLAODS 和 DOCUMENTS 目录
7. 共享目录下不能能创建隐藏文件. 会报错.
8. 共享目录下的不同类型媒体文件，只能存放到特定的一级公共目录, 这个限制是由媒体库来控制的.

#### Uri 和一级目录

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785571952-44e1b63a-ba53-4466-9e98-dba1b3f980c9.png)

#### 通过 MediaStore 定义的 Uri

MediaStore 提供了下列几种类型的访问 Uri，通过查找对应 Uri 数据，达到访问的目的。

下列每种类型又分为三种 Uri：Internal、External、可移动存储

##### Audio (MIME 为 `audio/*`)

1. Internal `MediaStore.Audio.Media.INTERNAL_CONTENT_URI`

> Content://media/internal/audio/media

2. External `MediaStore.Audio.Media.EXTERNAL_CONTENT_URI`

> Content://media/external/audio/media

3. 可移动存储 `MediaStore.Audio.Media.getContentUri(String volumeName)`

> Content://media//audio/media

```
MediaStore.Audio.Media.INTERNAL_CONTENT_URI = MediaStore.Audio.Media.getContentUri("internal")
MediaStore.Audio.Media.EXTERNAL_CONTENT_URI = MediaStore.Audio.Media.getContentUri("external")
```

##### Video (MIME 为 `video/*`)

1. Internal `MediaStore.Video.Media.INTERNAL_CONTENT_URI`

> Content://media/internal/video/media

2. External `MediaStore.Video.Media.EXTERNAL_CONTENT_URI`

> Content://media/external/video/media

3. 可移动存储 `MediaStore.Video.Media.getContentUri(String volumeName)`

> Content://media//video/media

##### Images (MIME 为 `image/*`)

1. Internal `MediaStore.Images.Media.INTERNAL_CONTENT_URI`

> Content://media/internal/images/media

2. External `MediaStore.Images.Media.EXTERNAL_CONTENT_URI`

> Content://media/external/images/media

3. 可移动存储 `MediaStore.Images.Media.getContentUri(String volumeName)`

> Content://media//images/media

##### Files (非媒体文件，text, HTML, PDF 等)

1. MediaStore.Files.Media.GetContentUri (String volumeName)

> Content://media//file

##### Downloads

1. Internal: `MediaStore.Downloads.INTERNAL_CONTENT_URI`

> Content://media/internal/downloads

2. External: `MediaStore.Downloads.EXTERNAL_CONTENT_URI`

> Content://media/external/downloads

3. 可移动存储: `MediaStore.Downloads.getContentUri(String volumeName)`

> Content://media//downloads

##### 获取所有的 Volume getExternalVolumeNames

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785589518-4381e186-760f-4c80-a7fd-b61322a9f148.png)

```java
public static @NonNull Set<String> getExternalVolumeNames(@NonNull Context context) {
    final StorageManager sm = context.getSystemService(StorageManager.class);
    final Set<String> volumeNames = new ArraySet<>();
    for (VolumeInfo vi : sm.getVolumes()) {
        if (vi.isVisibleForUser(UserHandle.myUserId()) && vi.isMountedReadable()) {
            if (vi.isPrimary()) {
                volumeNames.add(VOLUME_EXTERNAL_PRIMARY);
            } else {
                volumeNames.add(vi.getNormalizedFsUuid());
            }
        }
    }
    return volumeNames;
}
```

#### MediaStore

##### 查询文件

通过 ContentResolver，根据不同的 Uri 查询不同的内容：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785606238-645d5fb9-e798-4062-832c-88985a8fb41f.png) ![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785861291-41ccadcd-a521-4b7a-8c9b-8731601255ac.png)

> MediaStore. Files 进行 Query 时候，只会显示图片、视频跟音频文件

##### 读取文件

通过 `ContentResolver#query` 接口，查找出来文件后如何读取，可以通过下面的方式：

###### OpenFileDescriptor

通过 `ContentResolver#openFileDescriptor` 接口，选择对应的打开方式，例如 "r" 表示读，"w" 表示写，返回 ParcelFileDescriptor 类型 FD。

###### LoadThumbnail

访问 Thumbnail，通过 `ContentResolver#loadThumbnail` 接口<br>通过传递大小，MediaProvider 返回指定大小的 Thumbnail。

###### Native 代码访问文件

如果 Native 代码需要访问文件，可以参考下面方式：

1. 通过 openFileDescriptor 返回 ParcelFileDescriptor
2. 通过 ParcelFileDescriptor.DetachFd () 读取 FD
3. 将 FD 传递给 Native 层代码
4. App 需要负责通过 close 接口关闭 FD<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785881600-b1c8bfad-63d0-4f0a-b827-7b544b3ccc74.png)

##### 新建文件

如果需要新建文件存放到公共目录，需要通过 `ContentResolver#insert` 接口，使用不同的 Uri，选择存储到不同的目录。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785893274-c92cc408-8da7-4248-9436-732fa871c2fc.png)

##### 修改文件

如果需要修改多媒体文件，需要通过 ContentResolver #query接口查找出来对应文件的Uri 。如果不是自己 App 新建的文件需要申请 `WRITE_EXTERNAL_STORAGE` 权限或者 catch RecoverableSecurityException，弹框给用户选择。<br>![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687785957551-015a44e1-179e-4096-aa7a-b2adad6d42e0.png) <br>通过下列接口，获取需要修改文件的 FD 或者 OutputStream：

1. `Context#getContentResolver().openOutputStream(contentUri)`<br>获取对应文件的 OutputStream。
2. `Context#getContentResolver().openFile` 或者 `Context#getContentResolver().openFileDescriptor`<br>通过 openFile 或者 openFileDescriptor 打开文件，需要选择 Mode 为 "w"，表示写权限。这些接口返回一个 ParcelFileDescriptor。

```java
getContentResolver().openFileDescriptor(contentUri,"w");
getContentResolver().openFile(contentUri,"w",null);
```

##### 删除文件

通过 ContentResolver 接口删除文件，Uri 为 query 出来的 Uri：<br>`getContentResolver().delete(contentUri,null,null);`

##### MediaStore `_data` 字段

MediaStore 中，DATA 即（_data）字段，在 Android Q 中开始废弃。读写文件需要通过 openFileDescriptor。

##### MediaStore 文件 Pending 状态

Android Q 上，MediaStore 中添加了一个 IS_PENDING Flag，用于标记当前文件时 Pending 状态。其他 App 通过 MediaStore 查询文件，如果没有设置 setIncludePending 接口，查询不到设置为 Pending 状态的文件，这就给 App 专享访问此文件。在一些情况下使用，例如在下载的时候：下载中，文件是 Pending 状态下载完成，文件 Pending 状态置为 0。

##### MediaColumns. RELATIVE_PATH 设置次级存储路径

Android Q 上，通过 MediaStore 存储到公共目录的文件，可以通过 MediaColumns. RELATIVE_PATH 来指定存储的次级目录，这个目录可以使多级，具体代码如下：

```java
ContentResolver insert方法
通过values.put(Media.RELATIVE_PATH,"Pictures/album/family ")指定存储目录。其中，Pictures是一级目录，album/family是子目录。
ContentResolver update方法
通过values.put(Media.RELATIVE_PATH,"Pictures/album/family ")指定存储目录。通过update方法，可以移动存储地方。
```

##### 访问图片 Exif Metadata

Android Q 上， App 如果需要访问图片上的 Exif Metadata，需要做下列事情：

1. 申请 `ACCESS_MEDIA_LOCATION` 权限
2. 通过 `MediaStore.setRequireOriginal` 返回新 Uri<br>

#### SAF

SAF，即 `Storage Access Framework`，通过选择不同的 DocumentsProvider，提供给用户打开、浏览文件。<br><https://developer.android.com/guide/topics/providers/document-provider>

##### 默认 Provider

Android 默认提供了下列 DocumentsProvider：<br>`MediaDocumentsProvider`、`ExternalStorageProvider`、`DownloadStorageProvider`。

|    | MediaDocumentsProvider | ExternalStorageProvider | DownloadStorageProvider |
| -- | ---------------------- | ----------------------- | ----------------------- |
| 读  | 只能读取视频、音频、图片           | 全部内置、外置存储               | 读取 Download 目录          |
| 删除 | 可以删除                   | 可以删除                    | 可以删除                    |
| 修改 | 无法修改                   | 可以修改                    | 可以修改                    |

这个图片上，有三个区域，分别是：

- MediaDocumentsProvider
- DownloadStorageProvider
- ExternalStorageProvider

##### 使用

###### 选择单个文件

###### 选择目录

> 文件管理程序，清理程序，可以通过这个方法获取对应目录以及子目录的全部管理权限。

###### 新建文件

###### 删除

```java
DocumentsContract.deleteDocument(getContentResolver(),uri);
```

###### 修改

1. 获取 OutputStream

```java
getContentResolver().openOutputStream(uri);
```

2. 获取可写 ParcelFileDescriptor

```java
getContentResolver().openFileDescriptor(contentUri,"w");
getContentResolver().openFile (contentUri,"w",null);
```

> 具体 Demo 参考：<https://github.com/android/storage>

#### 应用卸载

如果 App 在 AndroidManifest. Xml 中声明：`android:hasFragileUserData="true"`<br>卸载应用会有提示是否保留 App 数据：

#### 旧数据迁移

- 怎么进行数据迁移最好呢？

> TargetSDKVersion 28 的时候，先大规模的升级一次，此 app 就包含数据迁移功能，同时共享媒体的方式也按照分区存储模型的规范来，这样不论什么版本系统的用户，都能完成数据迁移，同时进行共享媒体的方式也正确。

- 在 8.0 及以上的系统，采用 Files. Move 进行数据迁移，8.0 以下的系统采用 File. Rename 进行数据迁移。 Files 的 move 方法既可以作用于文件也可以作用于文件夹。

```java
private boolean moveData(File source, File target) {
    long start = System.currentTimeMillis();
    // 只有目标文件夹不存在的时候，move文件夹才能成功
    if (target.exists() && target.isDirectory() && (target.list() == null || target.list().length == 0)) {
        target.delete();
    }
    boolean isSuccess;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Path sourceP = source.toPath();
        Path targetP = target.toPath();

        if (target.exists()) {
            isSuccess = copyDir(source, target);
            LogUtils.i(TAG, "moveData copyDir");
        } else {
            try {
                Files.move(sourceP, targetP);
                isSuccess = true;
                LogUtils.i(TAG, "moveData Files.move");
            } catch (IOException e) {
                e.printStackTrace();
                LogUtils.i(TAG, Log.getStackTraceString(e));
                //在Android11上，move ATOMIC_MOVE会报AtomicMoveNotSupportedException异常
                //在Android11上，move REPLACE_EXISTING会报DirectoryNotEmptyException异常
                isSuccess = copyDir(source, target);
                LogUtils.i(TAG, "moveData move fail, use copyDir");
            }
        }
    } else {
        if (target.exists()) {
            isSuccess = copyDir(source, target);
            LogUtils.i(TAG, "moveData copyDir");
        } else {
            isSuccess = source.renameTo(target);
            LogUtils.i(TAG, "moveData renameTo result " + isSuccess);
        }
    }
    long end = System.currentTimeMillis();
    long val = end - start;
    LogUtils.i(TAG, "moveData migrate data take time " + val +" from " + source.getAbsolutePath() + " to " + target.getAbsolutePath());

    return isSuccess;
}
```

> File. Move 文件夹的时候，如果目标文件夹存在，那么会报 java. Nio. File. FileAlreadyExistsException 异常

#### RequestLegacyExternalStorage 和 preserveLegacyExternalStorage 的理解

RequestLegacyExternalStorage 是 Android 10 引入的，preserveLegacyExternalStorage 是 Android 11 引入的。

1. RequestLegacyExternalStorage=true 让 targetSdkVersion 是 29（适配了 Android 10）的 app 无论是新安装还是覆盖安装在 Android 10 系统上也继续访问旧的存储模型，requestLegacyExternalStorage 在 Android11 上的手机失效。

> TargetSDKVersion<29 时，requestLegacyExternalStorage 默认是 true 的，也就是说这些 app 是采用旧的存储模型运行的，targetSDKVersion 升级到 29 后，requestLegacyExternalStorage 默认是 false 的，但是覆盖安装的，还是采用旧的存储模式运行。重新安装的，由于 requestLegacyExternalStorage 是 false，就采用分区存储模式运行了，除非 requestLegacyExternalStorage 显示设置成 true。

2. PreserveLegacyExternalStorage 只是让覆盖安装的 app 能继续使用旧的存储模型，如果之前是旧的存储模型的话。如果您使用 preserveLegacyExternalStorage，旧版存储模型只在用户卸载您的应用之前保持有效。如果用户在搭载 Android 11 的设备上安装或重新安装您的应用，那么无论 preserveLegacyExternalStorage 的值是什么，您的应用都无法停用分区存储模型。
3. App targetSDKVersion 适配到 30，在 Android 11 的系统上首次安装，是没有任何机会，让 app 能继续使用旧存储模型的。

## 分区存储适配小结

### 权限

1. 开启了分区模式，`WRITE_EXTERNAL_STORAGE` 没用了
2. 写外部公共目录不需要权限
3. `MANAGE_EXTERNAL_STORAGE` 管理外部存储

### 不需要适配的情况

1. 内部存储不需要适配，可以继续使用 File API
2. 私有目录 (external/internal) 不需要适配，可以继续使用 File API

### 外部存储公共目录适配

1. 兼容模式，还是继续用 File API
2. 分区存储模式，Android 10，只能用 MediaStore API
3. 分区存储模式，Android 11，可以用 MediaStore API
4. 分区存储模式，Android 11，可以用 File API 且不需要 `WRITE_EXTERNAL_STORAGE` 权限；如果没有 `MANAGE_EXTERNAL_STORAGE` 权限，用 File 只能访问定义的那些目录；有 `MANAGE_EXTERNAL_STORAGE`，可以在任意目录用 File 访问

## Ref

- [ ] Android 10 适配要点，作用域存储 <https://guolin.blog.csdn.net/article/details/105419420>
- [ ] Android 10 分区存储介绍及百度 APP 适配实践<br><https://juejin.cn/post/6844904063432130568>
- [ ] 写给所有人的 Android 文件访问行为变更<br><https://blog.stfw.info/articles/android-storage-behavior-change/>
- [ ] Android 10、11 存储完全适配 (上）<br><https://www.jianshu.com/p/d0c77b9dc527>
- [ ] Android 10 (Q)/11 (R) 分区存储适配<br><https://juejin.cn/post/6862633674089693197>
- [ ] Android 10 应用分区存储适配实践<br><https://www.jianshu.com/p/af9903069ebe>
- [ ] AndroidQ (10) 分区存储完美适配<br><https://www.jianshu.com/p/271bbd13bfcf>
- [x] 拖不得了，Android 11 真的要来了，最全适配实践指南奉上<br><https://juejin.cn/post/6860370635664261128>
