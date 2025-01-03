---
date created: 星期四, 四月 11日 2024, 9:51:00 晚上
date updated: 星期四, 一月 2日 2025, 9:04:21 晚上
title: Android8.0适配(API26 AndroidO)
dg-publish: true
image-auto-upload: true
feed: show
format: list
aliases: [Android 8（`API 26~27`AndroidO）]
linter-yaml-title-alias: Android 8（`API 26~27`AndroidO）
---

# Android 8（`API 26~27`AndroidO）

[Android 8.0 功能和 API  |  Android 开发者  |  Android Developers](https://developer.android.com/about/versions/oreo/android-8.0)

## 自适应启动图标 Adaptive icons

### 7.1 roundIcon

Android 7.1 的时候谷歌开始推广圆形图标，在原来 `android:icon` 的基础上又添加了 `android:roundIcon` 属性来让你的 app 支持圆形图标

### 8.0 adaptive icons

Android 8.0 多了一个 `mipmap-anydpi-v26` Adaptive icons

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>

<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportHeight="108"
    android:viewportWidth="108">
    ............................
</vector>
```

8.0 通过定义背景和前景这 2 层视图来自适应启动器图标的外观。这个功劳归属于 `<adaptive-icon>` 元素。我们可以使用该元素为图标定义前景层和背景层的绘图，其中的 `<foreground>和<background>` 内部属性都支持 android: drawable 属性

注意图标图层的大小，两层的尺寸必须为 108 x 108 dp，前景图层中间的 72*72 dp 图层就是在手机界面上展示的应用图标范围。这样系统在四面各留出 18 dp 以产生有趣的视觉效果，如视差或脉冲（动画视觉效果由受支持的启动器生成，视觉效果可能因发射器而异）

### 可用 Resource Manager 一张大图生成所有的 ic_launcher

- 设计规范参考<br><https://developer.android.com/distribute/google-play/resources/icon-design-specifications#download_design_templates_resources>
- 使用参考<br><https://developer.android.com/studio/write/image-asset-studio>

## 一组权限

> 在 Android 8.0 之前，如果应用在运行时请求某个权限并且被授予，系统会错误地将属于同一权限组并且在清单中注册的其他权限也一并授予该应用。对于 Android 8.0 的应用，此行为已被纠正。系统只会授予应用明确请求的权限。然而，一旦用户为应用授予某个权限，则所有后续对该权限组中权限的请求都将被自动批准，而不会提示用户。

最简单的例子来解释一下：8.0 之前你申请读外部存储的权限 `READ_EXTERNAL_STORAGE`，你会自动被赋予写外部存储的权限 `WRITE_EXTERNAL_STORAGE`，因为他们属于同一组 (`android.permission-group.STORAGE`) 权限，但是现在 8.0 不一样了，读就是读，写就是写，不能混为一谈。不过你授予了读之后，虽然下次还是要申请写，但是在申请的时候，申请会直接通过，不会让用户再授权一次了

1. 授权一组权限，授权了某一个，不会自动授权组其他权限
2. 组其他权限还需要代码申请权限，只是不会有授权 dialog 提示给用户了

## Notification Channel 通知渠道

见 [[Android Notification#notification channels概述]]

## 后台位置限制

它限制后台应用每小时只接收几次位置更新。

当然，解决的办法是一样的，依然是建立前台服务

## 广播限制

见：[[BroadcastReceiver版本适配]]

## 安装未知来源 apk

Android 8.0 去除 " 允许未知来源 " 选项，需手动确认。如果我们的 App 具备安装 App 的功能，那么 AndroidManifest 文件需要包含 `REQUEST_INSTALL_PACKAGES` 权限，未声明此权限的应用将无法安装其他应用。我们可以选择使用 `Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES` 这个 action 将用户引导至安装未知应用权限界面，同时也可以使用 `packageManager.canRequestPackageInstalls()` 查询此权限的状态<br>不过一般最简单的办法就是直接在 AndroidManifest 中配置一下就行了，这样会在 App 调用安装界面的同时，系统会自动询问用户完成授权，我觉得这个流程还是蛮好的

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687709904662-86ada0a5-d40d-47c1-9f38-78dddebb529b.png)

## 提醒窗口

- [Android通知栏微技巧，8.0系统中通知栏的适配_通知显示不全 targetsdk-CSDN博客](https://blog.csdn.net/guolin_blog/article/details/79854070)
- [抱歉，你访问的页面不存在。 - 简书](https://www.jianshu.com/p/d9f5b0801c6b)

## Only fullscreen activities can request orientation

当我们把 `targetSdkVersion` 升级到 27，buildToolsVersion 和相关的 support library 升级到 27.0.1 后，在 Android 8.0（API level 26）上，部分 Activity 出现了一个莫名其妙的 crash，异常信息如下：

```java
java.lang.RuntimeException: Unable to start activity ComponentInfo{com.linkedin.android.XXXX.XXXX/com.linkedin.android.XXXX.XXXX.activity.LoginActivity}: java.lang.IllegalStateException: Only fullscreen activities can request orientation
```

解释：

在 Android 8.0 及以上出现，API 26： `fullscreen`" false 的 activity 是不能锁定 orientation 的，否则抛出异常

`fullscreen 的定义`（如果一个 Activity 的 Style 符合下面三个条件之一，认为不是 "fullscreen"）：

```java
1. “windowIsTranslucent”为true；
2. “windowIsTranslucent”为false，但“windowSwipeToDismiss”为true；
3. “windowIsFloating“为true；
```

### 解决

1. `windowIsTranslucent` 设置为 false<br>一般的，在 Splash 经常配置为透明，只要在 style 配置 `android:windowIsTranslucent` 属性为 false 即可：

```xml
<item name="android:windowIsTranslucent">false</item>
```

2. 用其他方式来实现透明 Activity

- Only fullscreen activities can request orientation？一个搞笑的坑！<br><https://zhuanlan.zhihu.com/p/32190223>

## Android 8.0 后台启动 Service

### 后台服务限制

在后台中运行的服务会消耗设备资源，这可能降低用户体验。为了缓解这一问题，系统对这些服务施加了一些限制。系统可以区分前台和后台应用。（用于服务限制目的的后台定义与内存管理使用的定义不同；一个应用按照内存管理的定义可能处于后台，但按照能够启动服务的定义又处于前台。）如果满足以下任意条件，应用将被视为处于前台：

- 具有可见 Activity（不管该 Activity 已启动还是已暂停）。
- 具有前台服务。
- 另一个前台应用已关联到该应用（不管是通过绑定到其中一个服务，还是通过使用其中一个内容提供程序）

```
例如，如果另一个应用绑定到该应用的服务，那么该应用处于前台：
1. IME
2. 壁纸服务
3. 通知侦听器
4. 语音或文本服务
```

处于前台时，应用可以自由创建和运行前台服务与后台服务。进入后台时，在一个持续数分钟的时间窗内，应用仍可以创建和使用服务。在该时间窗结束后，应用将被视为处于空闲状态。此时，系统将停止应用的后台服务，就像应用已经调用服务的 `Service.stopSelf()` 方法。

> 小米，vivo 都是 51 秒左右就会自动把后台 Service 杀死

在这些情况下，后台应用将被置于一个临时白名单中并持续数分钟。位于白名单中时，应用可以无限制地启动服务，并且其后台服务也可以运行。

处理对用户可见的任务时，应用将被置于白名单中，例如：

```jav
处理一条高优先级 Firebase 云消息传递 (FCM) 消息。
接收广播，例如短信/彩信消息。
从通知执行 PendingIntent。
```

`绑定服务bindService` 不受影响这些规则不会对绑定服务产生任何影响。如果您的应用定义了绑定服务，则不管应用是否处于前台，其他组件都可以绑定到该服务。

### 解决

#### JobScheduler

在很多情况下，您的应用都可以使用 JobScheduler 作业替换后台服务。例如，CoolPhotoApp

需要检查用户是否已经从朋友那里收到共享的照片，即使该应用未在前台运行。

#### StartForegroundService

Android 8.0 引入了一种全新的方法，即 Context.StartForegroundService ()，以在前台启动新服务。在系统创建服务后，应用有五秒的时间来调用该服务的 `startForeground()` 方法以显示新服务的用户可见通知。如果应用在此时间限制内未调用 startForeground ()，则系统将停止服务并声明此应用为 ANR。

```java
// 没有调用startForeground()出现的ANR

2019-03-08 17:23:34.803 2005-2037/? W/ActivityManager: Bringing down service while still waiting for start foreground: ServiceRecord{2604201 u0 me.hacket.assistant/.samples.learning.android8_x.后台启动service.TestBackService}
2019-03-08 17:23:34.919 1207-1207/? E/wificond: vivo add tx_good 318110 tx_bad 32 rx_good 1611968 tx_retry 42900

ANR in me.hacket.assistant
PID: 12540
Reason: Context.startForegroundService() did not then call Service.startForeground()
```

- 代码

```java
Intent service = new Intent(TheApplication.getInstance().getApplicationContext(), MyBackgroundService.class);
service.putExtra("startType", 1);
if (Build.VERSION.SDK_INT >= 26) {
    TheApplication.getInstance().startForegroundService(service);
} else {
    TheApplication.getInstance().startService(service);
}
// 获取使用
ContextCompat.startForegroundService(后台启动Service@this, Intent(后台启动Service@this, TestBackService::class.java))

// 启动完前台service, 一定记得在5s以内要执行如下代码, 否则程序会报ANR问题
if (Build.VERSION.SDK_INT >= 26) {
  startForeground(1, new Notification());
}
```

`ContextCompat.startForegroundService` 就是对上面第一种的封装：

```java
public static void startForegroundService(@NonNull Context context, @NonNull Intent intent) {
    if (Build.VERSION.SDK_INT >= 26) {
        context.startForegroundService(intent);
    } else {
        // Pre-O behavior.
        context.startService(intent);
    }
}
```

需要权限：

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

### Bad notification for startForeground: java. Lang. RuntimeException: invalid channel for service notification

在 android 8.0 后需要给 notification 设置一个 channelid

## Android: 8.0 中未知来源安装权限变更

Android 8.0 中对于未知来源 APK 的安装做了如下调整：

1. 将 `设置--安全` 中的允许安装未知来源应用取消了（由于国内手机系统的高度定制，该选择项的位置有差异）

> 1. 小米设置→更多设置→系统安全→安装未知应用

2. 在安装 APK 文件时新增未知来源安装权限，即 `android.permission.REQUEST_INSTALL_PACKAGES`。

> 在 Android 8.0 (即 Android O) 之前，设置中的允许安装未知来源是针对所有 APP 的，只要开启了，那么所有的未知来源 APP 都可以安装。但是，8.0 之后，将这个权限挪到了每一个 APP 内部，这样提高了手机的安全性，降低了流氓软件的安装概率。

### 适配

- 1、AndroidMainfest. Xml 增加权限 `REQUEST_INSTALL_PACKAGES`，该权限需在 Android 8.0 有效

```xml
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
```

> 如果没有该权限，不会报错，也不会退出，只是安装不成功而已。

- 2、判断是否有安装未知应用的权限，跳转到设置权限页面<br>![](undefined)
- 安装未知来源 apk 完整代码

```java
private void installApk() {
	new RxPermissions(this)
	.request(Manifest.permission.READ_EXTERNAL_STORAGE)
	.subscribe(new Consumer<Boolean>() {
		@Override
		public void accept(Boolean aBoolean) throws Exception {
			if (!aBoolean) {
				ToastUtils.showShort("请先授权sd权限");
				return;
			}

			File file = new File(Environment.getExternalStorageDirectory(), "inews.apk");
			if (!file.exists()) {
				ToastUtils.showShort("所安装的apk不存在：" + file.getPath());
				return;
			}

			// Android8.0+
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
				// 判断是否具备安装未知应用的权限
				if (!FileProviderDemo.this.getPackageManager().canRequestPackageInstalls()) { // 没有弹窗提示
					AlertDialog tipsDialog = new AlertDialog.Builder(FileProviderDemo.this)
							.setCancelable(false)
							.setTitle("[温馨提示]")
							.setMessage("安装应用需要打开未知来源权限，请去设置中开启权限")
							.setPositiveButton("去设置", new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog, int which) {
									dialog.dismiss();
									if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
										startManageUnknownAppInstallSettingPage(); // 跳转到设置安装未知应用的权限
									}
								}
							})
							.setNegativeButton("取消", new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog, int which) {
									dialog.dismiss();
								}
							})
							.show();
				} else {
					installExternalApk(file);
				}
			} else {
				// 低于Android8.0直接安装
				installExternalApk(file);
			}
		}
	});

}

private void installExternalApk(File file) {
    Intent intent = installIntent(this, file.getPath());
    startActivity(intent);
}

/**
 * 跳转到未知应用安装权限设置页面
 */
@RequiresApi(api = Build.VERSION_CODES.O)
private void startManageUnknownAppInstallSettingPage() {
    // 注意这个是8.0新API
    Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
    startActivityForResult(intent, 0);
}

private Intent installIntent(Context context, String filePath) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    File file = new File(filePath);
    intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
        intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
    } else {
        Uri uri = FileProviderUtils.getUriForFile(context, file);
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    return intent;
}
```

### 错误

- 没有适配 FileProvider，安装应用报错

> java. Lang. Throwable: file:///storage/emulated/0/netease_newsreader_android.apk exposed beyond app through Intent.GetData ()

```java
2019-03-07 18:43:32.547 4560-4560/me.hacket.assistant E/StrictMode: null
java.lang.Throwable: file:///storage/emulated/0/netease_newsreader_android.apk exposed beyond app through Intent.getData()
    at android.os.StrictMode.onFileUriExposed(StrictMode.java:1960)
    at android.net.Uri.checkFileUriExposed(Uri.java:2348)
    at android.content.Intent.prepareToLeaveProcess(Intent.java:9766)
    at android.content.Intent.prepareToLeaveProcess(Intent.java:9720)
    at android.app.Instrumentation.execStartActivity(Instrumentation.java:1609)
    at android.app.Activity.startActivityForResult(Activity.java:4472)
    at androidx.fragment.app.FragmentActivity.startActivityForResult(FragmentActivity.java:767)
    at android.app.Activity.startActivityForResult(Activity.java:4430)
    at androidx.fragment.app.FragmentActivity.startActivityForResult(FragmentActivity.java:754)
    at android.app.Activity.startActivity(Activity.java:4791)
    at android.app.Activity.startActivity(Activity.java:4759)
    at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo.installExternalApk(FileProviderDemo.java:179)
    at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo.installApk(FileProviderDemo.java:168)
    at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo.onViewClicked(FileProviderDemo.java:131)
    at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo_ViewBinding$4.doClick(FileProviderDemo_ViewBinding.java:69)
    at butterknife.internal.DebouncingOnClickListener.onClick(DebouncingOnClickListener.java:22)
    at android.view.View.performClick(View.java:6256)
    at android.view.View$PerformClick.run(View.java:24697)
    at android.os.Handler.handleCallback(Handler.java:789)
    at android.os.Handler.dispatchMessage(Handler.java:98)
    at android.os.Looper.loop(Looper.java:164)
    at android.app.ActivityThread.main(ActivityThread.java:6541)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.Zygote$MethodAndArgsCaller.run(Zygote.java:240)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:767)
```

安装应用时如果没有添加 `FLAG_GRANT_READ_URI_PERMISSION`，报错：

```java
2019-03-07 19:13:14.664 3370-3383/? E/AudioStreamOutSink: Error while writing data to HAL: -32
2019-03-07 19:13:15.940 5806-5806/me.hacket.assistant E/StrictMode: null
    java.lang.Throwable: content://me.hacket.assistant.FileProvider/root/storage/emulated/0/inews.apk exposed beyond app through Intent.getData() without permission grant flags; did you forget FLAG_GRANT_READ_URI_PERMISSION?
        at android.os.StrictMode.onContentUriWithoutPermission(StrictMode.java:1971)
        at android.net.Uri.checkContentUriWithoutPermission(Uri.java:2360)
        at android.content.Intent.prepareToLeaveProcess(Intent.java:9777)
        at android.content.Intent.prepareToLeaveProcess(Intent.java:9720)
        at android.app.Instrumentation.execStartActivity(Instrumentation.java:1609)
        at android.app.Activity.startActivityForResult(Activity.java:4472)
        at androidx.fragment.app.FragmentActivity.startActivityForResult(FragmentActivity.java:767)
        at android.app.Activity.startActivityForResult(Activity.java:4430)
        at androidx.fragment.app.FragmentActivity.startActivityForResult(FragmentActivity.java:754)
        at android.app.Activity.startActivity(Activity.java:4791)
        at android.app.Activity.startActivity(Activity.java:4759)
        at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo.installExternalApk(FileProviderDemo.java:196)
        at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo.access$100(FileProviderDemo.java:36)
        at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo$1.accept(FileProviderDemo.java:183)
        at me.hacket.assistant.samples.learning.android7_x.fileprovider.FileProviderDemo$1.accept(FileProviderDemo.java:144)
```

## 画中画

## Do not disturb (DND)-Zenmode

## 其他手机厂商

### Oppo Android 8.1 适配规范及常见问题处理方式

<https://open.oppomobile.com/service/message/detail?id=15195>

# Ref

- [ ] [Android 8.0 功能和 API  |  Android Developers](https://developer.android.google.cn/about/versions/oreo/android-8.0?hl=zh-cn)
