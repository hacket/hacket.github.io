---
date_created: Friday, April 12th 2020, 10:41:00 pm
date_updated: Monday, January 20th 2025, 1:15:42 am
title: Android10适配(API29 AndroidQ)
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
date created: 星期四, 四月 11日 2024, 9:49:00 晚上
date updated: 星期四, 一月 2日 2025, 9:05:59 晚上
image-auto-upload: true
feed: show
format: list
aliases: [Android 10]
linter-yaml-title-alias: Android 10
---

# Android 10

## 分区存储（可选，非强制）

见 Android 11 的分区存储，Android 11 强制执行

## 不能后台启动 Activity 限制

### 介绍

在 AndroidQ 或例如 Vivo、小米等第三方厂商 ROM 中，都对后台启动 Activity 做了限制，AndroidQ 中并没有设计有权限申请来进行设置，而 Vivo、小米则是在 App 权限设置中加入了后台启动 Activity 的权限。

- vivo

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240412100613.png)

- MIUI 10

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240412100631.png)

> 默认该项权限都是关闭的，并且因为没有 Api 可以调用申请。当 App 第一次在后台情况下跳转 Activity 时，系统会进行拦截，并弹出一条通知告诉用户，后续则不会重复提醒，而原生 AndroidQ 则是不提醒，直接拦截。

### 作用 (只要跑在 Android Q 上的 App，均受限制，不受 targetVersion 影响)

在曾经那么多 Android 版本的适配中，很多新系统的特性，其实是有兼容模式的，只要保持 App 的 `targetVersion` 不升级，就不会触发新系统特性。

Android Q 的禁止后台启动页面这一项上，是不起作用的。此项变动适用于所有在 Android Q 上运行的应用，哪怕你没有升级 targetVersion，哪怕你是在 Android P（9）中安装应用，系统从就版本升级到 Android Q，此项改动都会生效。

### 前台 app 不受影响

只要你的 App 在前台，或者此次启动新页面的动作来自用户主动的操作，那自然是不受影响的。

1. 该应用具有可见窗口。例如前台 Activity 是你的应用。
2. 桌面 Widget 点击启动 Activity。
3. 当前前台任务的 Activity Back Task（回退栈）中，有你应用的 Activity。

> 例如调起微信支付页（Activity Z）时，当前退回栈最顶端的 Activity 其实时微信的页面，但是我们应用页面（Activity Y）依然在回退栈的下面，此时依然具有打开 Activity 的权限。

4. 绑定了某些系统服务，例如：AccessibilityService、AutofillService 等。
5. **已获得用户授权的 SYSTEM_ALERT_WINDOW 权限。**
6. 临时白名单机制，不拦截通过通知拉起的应用。

```
应用通过通知，在 pendingIntent 中启动 Activity。
应用通过通知，在 PendingIntent 中发送广播，接收广播后启动 Activity。
应用通过通知，在 PendingIntent 中启动 Service，在 Service 中启动 Activity。
```

### 什么时候需要后台启动 Activity？

#### 场景一：启动页，展示品牌 Logo 和广告，5 秒后跳转

#### 场景二：电脑版登录，弹出界面确定登录

### 适配

#### 找出厂商后台打开 Activity 的权限开关（不推荐）

和以前权限被关闭，让用户去设置中打开权限类似，例如用获取当前 Activity 应用，找出厂商的打开后台 Activity 的权限页面，其实这种方式工作量是最大的，要适配各大厂商的 ROM，而且 ROM 又有不同的版本（例如 MIUI 9、MIUI 10 等），而且权限申请还有个理由请求获取，这个后台打开 Activity 的权限理由，也不好编，让用户觉得你要获取后台弹出的权限，十有八九都觉得你会干坏事，也自然不会允许了。

#### 在应用在后台时，应该发起一个通知，用户点击后跳转到目前 Activity

谷歌的建议是，在后台时，可以通过创建通知的方式，向用户提供信息。由用户通过点击通知的方式，来启动 Activity，而不是直接启动。如果有必要，还可以通过 `setFullScreenIntent()` 来强调这是一个立即需要处理的通知。

```kotlin
val fullScreenIntent = Intent(this, BackgroundActivity::class.java)
val fullScreenPendingIntent = PendingIntent.getActivity(
  this, 0,
  fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT
)

val notificationBuilder = NotificationCompat.Builder(this, "channelId")
.setSmallIcon(R.mipmap.ic_launcher_round)
.setContentTitle(getString(R.string.app_name))
.setContentText("启动BackgroundActivity")
.setPriority(NotificationCompat.PRIORITY_HIGH)
.setCategory(NotificationCompat.CATEGORY_CALL)

// Use a full-screen intent only for the highest-priority alerts where you
// have an associated activity that you would like to launch after the user
// interacts with the notification. Also, if your app targets Android Q, you
// need to request the USE_FULL_SCREEN_INTENT permission in order for the
// platform to invoke this notification.
.setFullScreenIntent(fullScreenPendingIntent, true)

val incomingCallNotification = notificationBuilder.build()

// The integer ID that you give to startForeground() must not be 0.
startForeground(1, incomingCallNotification)
```

此时通知栏就会收到你给的通知，等待用户来处理。<br>利用通知来提醒用户，其实也有一些优势，例如不会打扰用户当前的行为，锁屏时依然可以提醒用户等等。

### 后台启动 Activity Ref

- [x] Android-Q 对 startActivity() 做了限制，怎么适配？<br> <https://mp.weixin.qq.com/s?__biz=MzIxNjc0ODExMA==&mid=2247486375&idx=1&sn=427f560fd40a2dfc0fcaa89bd79f4a29&chksm=97851286a0f29b907d02029128b3d0f93b7e2dccd3f5b1569552aca5379202fcdc1f7b8beba7&scene=158#rd>
- [x] 适配 AndroidQ，不能后台启动 Activity 限制<br><https://mp.weixin.qq.com/s/swMzgiMg6Ff0p8ySchXhrA>

## 设备 ID

从 Android 10 开始已经无法完全标识一个设备，曾经用 mac 地址、IMEI 等设备信息标识设备的方法，从 Android 10 开始统统失效。而且无论你的 APP 是否适配过 Android 10。

### IMEI 等设备信息

从 Android 10 开始普通应用不再允许请求权限 android. Permission. READ_PHONE_STATE。而且，无论你的 App 是否适配过 Android Q（既 `targetSdkVersion` 是否大于等于 29），均无法再获取到设备 IMEI 等设备信息。

受影响的 API：

```java
Build.getSerial();
TelephonyManager.getImei();
TelephonyManager.getMeid()
TelephonyManager.getDeviceId();
TelephonyManager.getSubscriberId();
TelephonyManager.getSimSerialNumber();
```

1. TargetSdkVersion<29 的应用，其在获取设备 ID 时，会直接返回 null
2. TargetSdkVersion>=29 的应用，其在获取设备 ID 时，会直接抛出异常 SecurityException

如果您的 App 希望在 Android 10 以下的设备中仍然获取设备 IMEI 等信息，可按以下方式进行适配：

```
<uses-permission android:name="android.permission.READ_PHONE_STATE"
    android:maxSdkVersion="28"/>
```

### Mac 地址随机分配

从 Android 10 开始，默认情况下，在搭载 Android 10 或更高版本的设备上，系统会传输随机分配的 MAC 地址。（即从 Android 10 开始，普通应用已经无法获取设备的真正 mac 地址，标识设备已经无法使用 mac 地址）

### 如何标识设备唯一性

#### Google 解决方案：如果您的应用有追踪非登录用户的需求，可用 ANDROID_ID 来标识设备

1. ANDROID_ID 生成规则：签名 + 设备信息 + 设备用户
2. ANDROID_ID 重置规则：设备恢复出厂设置时，ANDROID_ID 将被重置

```
String androidId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);
```

#### 信通院统一 SDK（OAID）

统一标识依据电信终端产业协会 (TAF)、移动安全联盟 (MSA) 联合推出的团体标准《移动智能终端补充设备标识规范》开发，移动智能终端补充设备标识体系统一调用 SDK 集成设备厂商提供的接口，并获得主流设备厂商的授权。

移动安全联盟 (MSA) 组织中国信息通信研究院 (以下简称 " 中国信通院 ") 与终端生产企业、互联网企业共同研究制定了 " 移动智能终端补充设备标识体系 "，定义了移动智能终端补充设备标识体系的体系架构、功能要求、接口要求以及安全要求，使设备生产企业统一开发接口，为移动应用开发者提供统一调用方式，方便移动应用接入，降低维护成本。

1. SDK 获取:

MSA 统一 SDK 下载地址：<br>移动安全联盟官网，<http://www.msa-alliance.cn/>

2. 接入方式
   - 解压 miit_mdid_sdk_v 1.0.13. Rar，
   - 把 miit_mdid_1.0.13. Aar 拷贝到项目中，并设置依赖。
   - 将 supplierconfig. Json 拷贝到项目 assets 目录下，并修改里边对应内容，特别是需要设置 appid 的部分。需要设置 appid 的部分需要去对应的厂商的应用商店里注册自己的 app。

```json
{
  "supplier":{
    "xiaomi":{
      "appid":"***"
    },
    "huawei":{
      "appid":"***"
    }
    ...
  }
}
```

- 在初始化方法中调用 JLibrary. InitEntry

```java
try {
    JLibrary.InitEntry(FoundationContextHolder.getContext());
} catch (Throwable e) {
}
```

- 实例化 MSA SDK

```java
public static void initMSASDK(Context context){
    int code = 0;
    try {
        code =  MdidSdkHelper.InitSdk(context,true,listener);
        if (code == ErrorCode.INIT_ERROR_MANUFACTURER_NOSUPPORT){//1008611,不支持的厂商
        }else if (code == ErrorCode.INIT_ERROR_DEVICE_NOSUPPORT){//1008612,不支持的设备
        }else if (code == ErrorCode.INIT_ERROR_LOAD_CONFIGFILE){//1008613,加载配置文件失败
        }else if (code == ErrorCode.INIT_ERROR_RESULT_DELAY){//1008614,信息将会延迟返回，获取数据可能在异步线程，取决于设备
        }else if (code == ErrorCode.INIT_HELPER_CALL_ERROR){//1008615,反射调用失败
        }
        //code可记录异常供分析
    }catch (Throwable throwable){
}
}

static IIdentifierListener listener = new IIdentifierListener() {
    @Override
    public void OnSupport(boolean support, IdSupplier idSupplier) {
        try{
            isSupport  = support;
            if (null != idSupplier && isSupport){
                //是否支持补充设备标识符获取
                oaid = idSupplier.getOAID();
                aaid = idSupplier.getAAID();
                vaid = idSupplier.getVAID();
            }else {
                ...
            }
        }catch (Exception e){
        }
    }
};
```

- 通过以上方法获取到 OAID 等设备标识之后，即可作为唯一标识使用。

## `Region.Op` 相关异常

Java. Lang. IllegalArgumentException: Invalid Region. Op - only INTERSECT and DIFFERENCE are allowed

当 targetSdkVersion >= Build. VERSION_CODES. P 时调用 canvas.ClipPath (path, Region. Op. XXX); 引起的异常

```java
@Deprecated
public boolean clipPath(@NonNull Path path, @NonNull Region.Op op) {
     checkValidClipOp(op);
     return nClipPath(mNativeCanvasWrapper, path.readOnlyNI(), op.nativeInt);
}

private static void checkValidClipOp(@NonNull Region.Op op) {
     if (sCompatiblityVersion >= Build.VERSION_CODES.P
         && op != Region.Op.INTERSECT && op != Region.Op.DIFFERENCE) {
         throw new IllegalArgumentException(
                    "Invalid Region.Op - only INTERSECT and DIFFERENCE are allowed");
     }
}
```

我们可以看到当目标版本从 Android P 开始，`Canvas.clipPath(@NonNull Path path, @NonNull Region.Op op) ;` 已经被废弃，而且是包含异常风险的废弃 API，只有 `Region.Op.INTERSECT` 和 `Region.Op.DIFFERENCE` 得到兼容，几乎所有的博客解决方案都是如下简单粗暴：

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
    canvas.clipPath(path);
} else {
    canvas.clipPath(path, Region.Op.XOR);// REPLACE、UNION 等
}
```

但我们一定需要一些高级逻辑运算效果怎么办？如小说的仿真翻页阅读效果，解决方案如下，用 Path. Op 代替，先运算 Path，再给 canvas. ClipPath：

```java
if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.P){
    Path mPathXOR = new Path();
    mPathXOR.moveTo(0,0);
    mPathXOR.lineTo(getWidth(),0);
    mPathXOR.lineTo(getWidth(),getHeight());
    mPathXOR.lineTo(0,getHeight());
    mPathXOR.close();
    //以上根据实际的Canvas或View的大小，画出相同大小的Path即可
    mPathXOR.op(mPath0, Path.Op.XOR);
    canvas.clipPath(mPathXOR);
}else {
    canvas.clipPath(mPath0, Region.Op.XOR);
}
```

## 安装 APK Intent 及其它共享文件相关 Intent

```java
/*
* 自Android N开始，是通过FileProvider共享相关文件，但是Android Q对公有目录 File API进行了限制，只能通过Uri来操作，
* 从代码上看，又变得和以前低版本一样了，只是必须加上权限代码Intent.FLAG_GRANT_READ_URI_PERMISSION
*/ 
private void installApk() {
    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q){
        //适配Android Q,注意mFilePath是通过ContentResolver得到的，上述有相关代码
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.parse(mFilePath) ,"application/vnd.android.package-archive");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivity(intent);
        return ;
    }

    File file = new File(saveFileName + "demo.apk");
    if (!file.exists())
        return;
    Intent intent = new Intent(Intent.ACTION_VIEW);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        Uri contentUri = FileProvider.getUriForFile(getApplicationContext(), "net.oschina.app.provider", file);
        intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
    } else {
        intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }
    startActivity(intent);
}
```

## EditText 默认不获取焦点，不自动弹出键盘

该问题出现在 targetSdkVersion >= Build. VERSION_CODES. P 情况下，且设备版本为 Android P 以上版本，解决方法在 onCreate 中加入如下代码，可获得焦点，如需要弹出键盘可延迟一下：

```java
mEditText.post(() -> {
   mEditText.requestFocus();
   mEditText.setFocusable(true);
   mEditText.setFocusableInTouchMode(true);
});
```

## 剪切板兼容

Android Q 中只有当应用处于可交互情况（默认输入法本身就可交互）才能访问剪切板和监听剪切板变化，在 onResume 回调也无法直接访问剪切板，这么做的好处是避免了一些应用后台疯狂监听响应剪切板的内容，疯狂弹窗。<br>因此如果还需要监听剪切板，可以使用应用生命周期回调，监听 APP 后台返回，延迟几毫秒访问剪切板，再保存最后一次访问得到的剪切板内容，每次都比较一下是否有变化，再进行下一步操作。

## Android 10 android:angle="0" 需要适配

Android 10 默认方向变了，导致渐变 shape 方向不对。

默认方向是从左到右，Android 10 有的手机渐变方向变成从上到下了。

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/progress">
        <scale
            android:scaleWidth="100%"
            android:scaleHeight="100%"
            android:scaleGravity="fill_vertical|start">
            <shape>
                <gradient
                    android:angle="0"
                    android:centerColor="#ff33ff"
                    android:endColor="#ff33ff"
                    android:startColor="#ff33ff" />
            </shape>
        </scale>
    </item>
</layer-list>
```

原理：<https://juejin.cn/post/6844904065676115975>

## 后台获取位置权限更改

1. 在 Android 10 的时候，对于前台定位服务就必须加上 `android:foregroundServiceType="location"`
2. 后台访问位置需要加权限 `ACCESS_BACKGROUND_LOCATION`

**后台获取位置的场景：**

- App Widget 中
- App 进程启动，但没有页面的场景，Google Play Cubes

## 暗黑模式

<https://developer.android.com/guide/topics/ui/look-and-feel/darktheme>

在 2019 年，随着 iOS 13 与 Android Q 的推出，Apple 和 Google 同时推出主打功能暗黑模式，分别为 Dark Mode (iOS)/ `Dark Theme` (Android) ，下文我们统称为 Dark Theme。在前期预研中，我们发现 66% 的 iOS 13 用户选择打开 Dark Theme，可见用户对暗黑模式的喜爱和期待。

Dark Theme 能带来哪些好处呢？

1. 更加省电，当代手机大部分都是 OLED 屏（OLED 屏黑色下不发光更省电），配合 Dark Theme 能耗更低；
2. 提供一致性的用户体验，当用户从 Dark Theme 的环境切换到我们的 App，仍然能够享受黑色的宁静，避免亮眼的白色带来的刺激感
3. 提升品牌形象，及时跟进系统新特性，在享受新特性带来美好之外还能获得 Apple Store 和 Google Play 推荐位机会，提升整体品牌形象；
4. 为弱视以及对强光敏感的用户提高可视性，让用户在暗环境中轻松使用 App。

## Ref

- [ ] Android 10 分区存储介绍及百度 APP 适配实践<br><https://juejin.cn/post/6844904063432130568>
