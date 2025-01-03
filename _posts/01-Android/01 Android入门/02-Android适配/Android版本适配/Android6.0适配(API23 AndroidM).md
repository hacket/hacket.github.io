---
date created: 星期四, 四月 11日 2024, 9:51:00 晚上
date updated: 星期四, 一月 2日 2025, 9:03:27 晚上
title: Android6.0适配(API23 AndroidM)
dg-publish: true
image-auto-upload: true
feed: show
format: list
aliases: [Google app links]
linter-yaml-title-alias: Google app links
---

# Google app links

Android 6.0 (API level 23) 及以后加入了 App Links , 当用户点击对应的 URI 时，会直接启动对应的 APP，不会再有对话框出现。

具体见 [[DeepLink]] 、[[AppLinks]]

## Doze 和 App Standby

[针对低电耗模式和应用待机模式进行优化  |  App quality  |  Android Developers](https://developer.android.com/training/monitoring-device-state/doze-standby)

Android 具有两项省电功能，可通过管理应用程序在设备未连接电源时的行为来延长用户的电池寿命：`Doze` 和 `App StandBy`。当设备长时间不使用时，`Doze` 功能会推迟应用程序的后台 CPU 和网络活动，从而减少电池消耗。`App Standb` 会推迟最近没有用户活动的应用程序的后台网络活动。

在 Android 6.0 及以上手机生效，无论是否升级到了 `targetSdkVersion=23`

### Doze 打瞌睡

如果用户在屏幕关闭的情况下将设备拔下电源并静止一段时间，设备就会进入 `Doze` 模式。在 Doze 模式下，系统尝试通过限制应用程序访问网络和 CPU 密集型服务来节省电池。

它还阻止 `App` 访问网络并 `defers their jobs`, `syncs`, and `standard alarms`。

系统会定期退出 `Doze` 状态一段时间，以便应用程序完成其推迟的活动。在此维护时段期间，系统运行所有待处理的同步 (`pending sync`)、作业 (`jobs`) 和警报 (`standard alarm`)，并允许应用程序访问网络。

Doze 为应用程序提供了一个定期维护窗口，以使用网络并处理待处理的活动：

![|1200](https://developer.android.com/static/images/training/doze.png)

当维护窗口结束时，系统再次进入打瞌睡状态，暂停网络访问并推迟作业、同步和警报。随着时间的推移，系统安排维护时段的频率会降低，从而有助于在设备不充电时长时间不活动的情况下减少电池消耗。

当用户通过移动设备、打开屏幕或连接充电器来唤醒设备时，系统将退出 Doze，所有应用程序将恢复正常活动。

#### Doze restrictions 瞌睡限制

系统在打瞌睡时对您的应用程序应用以下限制：

- 暂停网络访问。
- 忽略唤醒锁 ([PowerManager.WakeLock](https://developer.android.com/reference/android/os/PowerManager.WakeLock))
- 将标准 [AlarmManager](https://developer.android.com/reference/android/app/AlarmManager) 警报（包括 setExact () 和 setWindow () ）推迟到下一个维护时段。
  - 如果您需要设置在打瞌睡时触发的警报，请使用 `setAndAllowWhileIdle()` 或 `setExactAndAllowWhileIdle()` 。
  - 用 `setAlarmClock()` 设置的警报继续正常触发。系统在警报触发前不久退出瞌睡状态。
- 不执行 Wi-Fi 扫描。
- 不允许同步适配器运行。
- 不让 [JobScheduler](https://developer.android.com/reference/android/app/job/JobScheduler) 运行。
- [WorkManager](https://developer.android.com/reference/androidx/work/WorkManager) 在内部使用 `JobScheduler` ，因此 `WorkManager` 任务不会运行。

#### Doze checklist

- 如果可能，请使用 `Firebase Cloud Messaging (FCM)` 进行下游消息传递。
- 如果您的用户必须立即看到通知，请使用 FCM 高优先级消息。仅对导致通知的消息使用高优先级。有关更多指导，请参阅 FCM 有关 Android 消息优先级的文档。 [FCM's documentation on message priority for Android](https://firebase.google.com/docs/cloud-messaging/android/message-priority)
- 在初始消息有效负载中提供足够的信息，因此不需要后续的网络访问。
- 使用 `setAndAllowWhileIdle()` 和 `setExactAndAllowWhileIdle()` 设置关键警报。
- [Test your app in Doze](https://developer.android.com/training/monitoring-device-state/doze-standby#testing_doze).

#### Adapt your app to Doze 适配 Doze

`Doze` 会对应用程序产生不同的影响，具体取决于应用程序提供的功能和使用的服务。许多应用程序无需修改即可在 `Doze cycles` 中正常运行。在某些情况下，您必须优化应用程序管理网络 (`network`)、警报 (`alarms`)、作业 (`jobs`) 和同步的方式 (`syncs`)。

应用程序必须能够在每个维护窗口期间 (`maintenance window`) 有效地管理活动。

为了帮助安排警报，您可以使用两种 `AlarmManager` 方法： `setAndAllowWhileIdle()` 和 `setExactAndAllowWhileIdle()` 。通过这些方法，您可以设置即使设备处于打瞌睡状态也会触发的警报。

> 注意：对于每个应用， `setAndAllowWhileIdle()` 和 `setExactAndAllowWhileIdle()` 最多只能每 9 分钟触发一次警报。

对网络访问的打瞌睡限制也可能会影响您的应用程序，尤其是当应用程序依赖于实时消息（例如即时通信中用来提醒收件人有待查阅消息的信号或通知）时。如果您的应用需要与网络保持持续连接才能接收消息，请尽可能使用 Firebase Cloud Messaging (FCM)。

要确认您的应用程序在 Doze 模式下的行为符合预期，您可以使用 `adb` 命令强制系统进入和退出 Doze 模式并观察应用程序的行为。有关详细信息，请参阅使用 Doze 和应用程序待机进行测试。[Test with Doze and App Standby](https://developer.android.com/training/monitoring-device-state/doze-standby#testing_doze_and_app_standby)

### App Standby 待机

`App Standby` 可让系统在用户未主动使用某个应用程序时确定该应用程序处于空闲状态。当用户在一段时间内没有触摸应用程序并且以下条件都不适用时，系统会做出此决定：

- 用户明确启动该应用程序。
- 该应用程序当前有一个进程位于前台，或者作为活动或前台服务，或者由另一个活动或前台服务使用。

> 注意：仅将 `foreground service` 用于用户希望系统立即执行或不间断执行的任务。此类情况包括将照片上传到社交媒体，或者即使音乐播放器应用程序不在前台也播放音乐。
> 不要仅仅为了阻止系统确定您的应用程序处于空闲状态而启动 [foreground service](https://developer.android.com/guide/components/services#Foreground)。

- APP 生成了一条通知，用户可以在锁定屏幕或通知托盘中看到该通知。

当用户将设备插入电源时，系统会将应用程序从待机状态释放，让它们自由访问网络并执行任何挂起的作业和同步。

如果设备长时间闲置，系统大约每天允许闲置应用程序访问一次网络。

#### App Standby Buckets

[[Android9.0适配(API28 AndroidP)#App Standby Buckets]]

### Use FCM to interact with your app while the device is idle

[针对低电耗模式和应用待机模式进行优化  |  App quality  |  Android Developers](https://developer.android.com/training/monitoring-device-state/doze-standby#using_fcm)

### Support for other use cases

[针对低电耗模式和应用待机模式进行优化  |  App quality  |  Android Developers](https://developer.android.com/training/monitoring-device-state/doze-standby#support_for_other_use_cases)

### Test with Doze and App Standby

[针对低电耗模式和应用待机模式进行优化  |  App quality  |  Android Developers](https://developer.android.com/training/monitoring-device-state/doze-standby#testing_doze_and_app_standby)

### Acceptable use cases for exemption

[针对低电耗模式和应用待机模式进行优化  |  App quality  |  Android Developers](https://developer.android.com/training/monitoring-device-state/doze-standby#exemption-cases)

# Android 运行时动态权限 (Runtime Permissions) 介绍

![|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/workflow-overview.svg)

## Android6.0+ 运行时权限

<http://git.oschina.net/hacket520/PermissionsDemo>

### 基本使用

- 1、在 AndroidManifest 文件中添加需要的权限
- 2、检查用户是否有权限

`ContextCompat.checkSelfPermission()` 主要用于检测某个权限是否已经被授予，方法返回值为 `PackageManager.PERMISSION_DENIED` 或者 `PackageManager.PERMISSION_GRANTED`。当返回 DENIED 就需要进行申请授权了。

```java
if (ContextCompat.checkSelfPermission(thisActivity,
                Manifest.permission.READ_CONTACTS)
        != PackageManager.PERMISSION_GRANTED) {
}else{
    //
}
```

- 3、申请授权

`ActivityCompat.requestPermissions(Activity activity,String[] permissions, int requestCode)` 支持一次性申请多个权限的，系统会通过对话框逐一询问用户是否授权

参数 1：Context

参数 2：是需要申请的权限的字符串数组

参数 3：requestCode，主要用于回调的时候检测

```java
ActivityCompat.requestPermissions(thisActivity,
                new String[]{Manifest.permission.READ_CONTACTS},
                MY_PERMISSIONS_REQUEST_READ_CONTACTS);
```

- 4、处理权限申请回调

在 Activity 或者 Fragment 中处理回调

```java
@Override
public void onRequestPermissionsResult(int requestCode,
        String permissions[], int[] grantResults) {
    switch (requestCode) {
        case MY_PERMISSIONS_REQUEST_READ_CONTACTS: {
            // If request is cancelled, the result arrays are empty.
            if (grantResults.length %3E 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                // permission was granted, yay! Do the
                // contacts-related task you need to do.

            } else {

                // permission denied, boo! Disable the
                // functionality that depends on this permission.
            }
            return;
        }
    }
}
```

参数 1：requestCode 定位你的申请

参数 2：`permissions[]` 对应申请权限时 `requestPermissions()` 的权限数组

参数 3：`grantResults[]` 你申请 2 个权限，数组大小就为 2，分别记录你两个权限的申请结果；结果只为 `PERMISSION_GRANTED` 和 `PERMISSION_DENIED`

- 5、shouldShowRequestPermissionRationale()

用于给用户一个申请权限的解释，该方法只有在用户在上一次已经拒绝过你的这个权限申请。也就是说，用户已经拒绝一次了，你又弹个授权框，你需要给用户一个解释，为什么要授权，则使用该方法。

```java
// Should we show an explanation?
if (ActivityCompat.shouldShowRequestPermissionRationale(thisActivity,
        Manifest.permission.READ_CONTACTS))
    // Show an expanation to the user *asynchronously* -- don't block
    // this thread waiting for the user's response! After the user
    // sees the explanation, try again to request the permission.
}
```

- 6、完整

```java
// Here, thisActivity is the current activity
if (ContextCompat.checkSelfPermission(thisActivity,
                Manifest.permission.READ_CONTACTS)
        != PackageManager.PERMISSION_GRANTED) {

    // Should we show an explanation?
    if (ActivityCompat.shouldShowRequestPermissionRationale(thisActivity,
            Manifest.permission.READ_CONTACTS)) {

        // Show an expanation to the user *asynchronously* -- don't block
        // this thread waiting for the user's response! After the user
        // sees the explanation, try again to request the permission.

    } else {

        // No explanation needed, we can request the permission.

        ActivityCompat.requestPermissions(thisActivity,
                new String[]{Manifest.permission.READ_CONTACTS},
                MY_PERMISSIONS_REQUEST_READ_CONTACTS);

        // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
        // app-defined int constant. The callback method gets the
        // result of the request.
    }
}
```

### 权限分类

一类是 [Normal Permissions](https://developer.android.com/guide/topics/security/normal-permissions.html?hl=zh-cn "https://developer.android.com/guide/topics/security/normal-permissions.html?hl=zh-cn")，这类权限一般不涉及用户隐私，是不需要用户进行授权的，比如手机震动、访问网络等；另一类是 Dangerous Permission，一般是涉及到用户隐私的，需要用户进行授权，比如读取 sdcard、访问通讯录等。

#### 普通权限

[Normal Permissions](https://developer.android.com/guide/topics/security/normal-permissions.html?hl=zh-cn "https://developer.android.com/guide/topics/security/normal-permissions.html?hl=zh-cn")

在应用安装时授权就可以了，应用运行时不再需要动态授权。

```java
ACCESS_LOCATION_EXTRA_COMMANDS
ACCESS_NETWORK_STATE
ACCESS_NOTIFICATION_POLICY
ACCESS_WIFI_STATE
BLUETOOTH
BLUETOOTH_ADMIN
BROADCAST_STICKY
CHANGE_NETWORK_STATE
CHANGE_WIFI_MULTICAST_STATE
CHANGE_WIFI_STATE
DISABLE_KEYGUARD
EXPAND_STATUS_BAR
GET_PACKAGE_SIZE
INSTALL_SHORTCUT
INTERNET
KILL_BACKGROUND_PROCESSES
MODIFY_AUDIO_SETTINGS
NFC
READ_SYNC_SETTINGS
READ_SYNC_STATS
RECEIVE_BOOT_COMPLETED
REORDER_TASKS
REQUEST_INSTALL_PACKAGES
SET_ALARM
SET_TIME_ZONE
SET_WALLPAPER
SET_WALLPAPER_HINTS
TRANSMIT_IR
UNINSTALL_SHORTCUT
USE_FINGERPRINT
VIBRATE
WAKE_LOCK
WRITE_SYNC_SETTINGS
```

#### 危险权限

[Dangerous Permissions](https://developer.android.com/guide/topics/security/permissions.html?hl=zh-cn#normal-dangerous "https://developer.android.com/guide/topics/security/permissions.html?hl=zh-cn#normal-dangerous")

在应用安装时有授权列表提示，在应用运行时权限动态获取也需要授权;

危险权限都是一组一组的;

如果你申请某个危险的权限，假设你的 app 早已被用户授权了同一组的某个危险权限，那么系统会立即授权，而不需要用户去点击授权。比如你的 app 对 `READ_CONTACTS` 已经授权了，当你的 app 申请 `WRITE_CONTACTS` 时，系统会直接授权通过。此外，对于申请时弹出的 dialog 上面的文本说明也是对整个权限组的说明，而不是单个权限（ps: 这个 dialog 是不能进行定制的）。

不过需要注意的是，不要对权限组过多的依赖，尽可能对每个危险权限都进行正常流程的申请，因为在后期的版本中这个权限组可能会产生变化。

可通过 `adb shell pm list permissions -d -g` 查看

```java
// 联系人
group:android.permission-group.CONTACTS
  permission:android.permission.WRITE_CONTACTS
  permission:android.permission.GET_ACCOUNTS
  permission:android.permission.READ_CONTACTS

group:android.permission-group.PHONE
  permission:android.permission.READ_CALL_LOG
  permission:android.permission.READ_PHONE_STATE
  permission:android.permission.CALL_PHONE
  permission:android.permission.WRITE_CALL_LOG
  permission:android.permission.USE_SIP
  permission:android.permission.PROCESS_OUTGOING_CALLS
  permission:com.android.voicemail.permission.ADD_VOICEMAIL

group:android.permission-group.CALENDAR
  permission:android.permission.READ_CALENDAR
  permission:android.permission.WRITE_CALENDAR

group:android.permission-group.CAMERA
  permission:android.permission.CAMERA

group:android.permission-group.SENSORS
  permission:android.permission.BODY_SENSORS

group:android.permission-group.LOCATION
  permission:android.permission.ACCESS_FINE_LOCATION
  permission:android.permission.ACCESS_COARSE_LOCATION

group:android.permission-group.STORAGE
  permission:android.permission.READ_EXTERNAL_STORAGE
  permission:android.permission.WRITE_EXTERNAL_STORAGE

group:android.permission-group.MICROPHONE
  permission:android.permission.RECORD_AUDIO

group:android.permission-group.SMS
  permission:android.permission.READ_SMS
  permission:android.permission.RECEIVE_WAP_PUSH
  permission:android.permission.RECEIVE_MMS
  permission:android.permission.RECEIVE_SMS
  permission:android.permission.SEND_SMS
  permission:android.permission.READ_CELL_BROADCASTS
```

#### 特殊权限 (Special Permissions)

不能自动授权，也不能运行时请求授权。只能通过打开 Intent 来让用户设置。目前只有 `WRITE_SETTINGS` 和 `SYSTEM_ALERT_WINDOW` 两个权限。

##### 修改系统设置

[WRITE_SETTINGS](https://developer.android.com/reference/android/Manifest.permission.html?hl=zh-cn#WRITE_SETTINGS) 修改系统设置

Android 6.0+ 如果没有设置 `WRITE_SETTINGS` 权限，报错

```
me.hacket.assistant E/AndroidRuntime: FATAL EXCEPTION: main
Process: me.hacket.assistant, PID: 26357
java.lang.SecurityException: me.hacket.assistant was not granted  this permission: android.permission.WRITE_SETTINGS.
    at android.os.Parcel.readException(Parcel.java:2013)
    at android.database.DatabaseUtils.readExceptionFromParcel(DatabaseUtils.java:183)
    at android.database.DatabaseUtils.readExceptionFromParcel(DatabaseUtils.java:135)
    at android.content.ContentProviderProxy.call(ContentProviderNative.java:651)
    at android.provider.Settings$NameValueCache.putStringForUser(Settings.java:1878)
    at android.provider.Settings$System.putStringForUser(Settings.java:2313)
    at android.provider.Settings$System.putIntForUser(Settings.java:2418)
    at android.provider.Settings$System.putInt(Settings.java:2412)
    at me.hacket.assistant.samples.learning.动态权限.SettingsSystemPermissionActivity.onProgressChanged(SettingsSystemPermissionActivity.kt:29)
```

在清单文件中会提示 `Permission is only granted to system app`

解决：

```java
File -> Settings -> Editor -> Inspections

在Android Lint下, （通过搜索）找到Using system app permission. 取消选中复选框或选择低于Error的Severity。
```

###### 场景

> 在 Android 中，许多的系统属性都在 settings 应用当中进行设置的，比如 wifi、蓝牙状态，当前本机语言，屏幕亮度等等一些相关的系统属性值。这些数据主要是存储在数据库中，对应的 URI 为：content：//settings/system 和 content://settings/secure，这两个是主要的，目前也只是涉及到这两个数据库表的使用。

1. 调整屏幕亮度
2. Wifi 状态
3. 蓝牙状态
4. 当前本机语言

###### 适配

1. 清单文件中声明 `WRITE_SETTINGS` 权限

`android.permission.WRITE_SETTINGS`

2. 代码开启 Intent 去设置

```java
class SettingsSystemPermissionActivity : AppCompatActivity(), SeekBar.OnSeekBarChangeListener {

    override fun onStartTrackingTouch(seekBar: SeekBar?) {
        // 1、开始拖拽，参数：seekbar表示当前在开始拖拽的SeekBar
    }

    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        // 2、拖拽过程中，参数1：当前正在拖拽的SeekBar，参数2：当前进度值，参数3：值变化是否通知

        // 设置系统亮度
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.System.canWrite(this)) {
                var intent = Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS)
                intent.data = Uri.parse("package:" + this.packageName)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                this.startActivityForResult(intent, 0)
                tv_lamp_brightness.text = "没有Settings Write权限，去设置"
            } else {
                //有了权限，具体的动作
                Settings.System.putInt(contentResolver, Settings.System.SCREEN_BRIGHTNESS, progress)
                tv_lamp_brightness.text = "当前亮度：$progress"
            }
        }
    }

    override fun onStopTrackingTouch(seekBar: SeekBar?) {
        // 3、停止拖拽，参数：seekbar表示当前在停止拖拽的SeekBar
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings_system_permission)
        seekbar.setOnSeekBarChangeListener(this)

        Manifest.permission.WRITE_SETTINGS;
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == 0) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.System.canWrite(this)) {
                    seekbar.progress = 0
                } else {
                    tv_lamp_brightness.text = "获取到了Settings Write权限"
                }
            }
        }

    }
}
```

##### 悬浮窗

[SYSTEM_ALERT_WINDOW](https://developer.android.com/reference/android/Manifest.permission.html?hl=zh-cn#SYSTEM_ALERT_WINDOW) 设置悬浮窗，进行一些黑科技

```java
private static final int REQUEST_CODE_OVERLAY_PERMISSION = 1;

private void requestAlertWindowPermission() {
    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
    intent.setData(Uri.parse("package:" + getPackageName()));
    startActivityForResult(intent, REQUEST_CODE_OVERLAY_PERMISSION);
}

// 调用
void system_alert_window() {
    if (Settings.canDrawOverlays(this)) {
        Toast.makeText(this, USEUS_TAG + "can draw overlays", Toast.LENGTH_SHORT).show();
    } else {
        requestAlertWindowPermission();
    }
}
```

回调 `onActivityResult()`

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    switch (requestCode) {
        case REQUEST_CODE_OVERLAY_PERMISSION:
            if (Settings.canDrawOverlays(this)) {
                SnackbarManager.indefiniteMake(mLayout, USEUS_TAG + "OVERLAY_PERMISSION permission is granted!");
            } else {
                SnackbarManager.indefiniteMake(mLayout, USEUS_TAG + "OVERLAY_PERMISSION permission is denied!");
            }
            break;
        case REQUEST_CODE_WRITE_SETTINGS:
            if (Settings.System.canWrite(this)) {
                SnackbarManager.indefiniteMake(mLayout, USEUS_TAG + "WRITE_SETTINGS permission is granted!");
            } else {
	            SnackbarManager.indefiniteMake(mLayout, USEUS_TAG + "WRITE_SETTINGS permission is denied!");
            }
            break;
        default:
            break;
    }
}
```

> 属于特殊权限，不能运行时动态获取，只能引导用户去设置页面设置

桌面悬浮框在 6.0 上会因为 `SYSTEM_ALERT_WINDOW` 权限的问题，无法在最上层显示。

## Gradle 查找三方包中引入的权限

### Gradle task hook 方式

hook 掉 `process${variant.name.capitalize()}Manifest`，在打包时删除 sdk 不需要的权限

- [x] [权限删除与收口](https://mp.weixin.qq.com/s?__biz=MjM5OTE4ODgzMw==&mid=2247483810&idx=1&sn=a937a392a7eb273014119434a7d2d2f4&chksm=a73e01ac904988bae0883190b44b00b13a737793b463ef842792b5c542ce96234bc693138b82&scene=21#wechat_redirect)

### Tools:node="remove" 方式

这个标签指定了 manifest 中冲突属性的合并规则或删除不必要的元素和属性，很明显，对于三方中的权限，我们是要进行删除的

```xml
<uses-permission
    android:name="android.permission.READ_PHONE_STATE"
    tools:node="remove" /> 
```

**注意：** 在使用上述 tools:node="remove" 方式移除危险权限时，一定要保证 sdk 无此权限也能正常运行且不影响功能，否则的话，还需在应用中申请此权限。

- [x] [tools:node="remove"](https://mp.weixin.qq.com/s?__biz=MjM5OTE4ODgzMw==&mid=2247483818&idx=1&sn=d343689f83cb3eadd89be7d66d18ac0d&chksm=a73e01a4904988b2c254d5244f2ef46182539f2c9ff27a58525b969f692f349d43492a9b3db2&mpshare=1&scene=23&srcid=%23rd)

## Ref

- [GitHub - googlearchive/android-RuntimePermissions: This sample has been deprecated/archived. Check this repo for related samples:](https://github.com/googlesamples/android-RuntimePermissions)
- [洞见 | CODING - 一站式软件研发管理平台 | CODING DevOps - 一站式软件研发管理平台-腾讯云](https://blog.coding.net/blog/understanding-marshmallow-runtime-permission)
- [Android 6.0 Permission权限与安全机制 - Coder25 - 博客园](http://www.cnblogs.com/284628487a/archive/2016/03/14/5274767.html)
- [jijiaxin89.com/2015/08/30/Android-s-Runtime-Permission/](http://jijiaxin89.com/2015/08/30/Android-s-Runtime-Permission/)
