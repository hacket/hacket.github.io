---
date_created: Friday, February 23rd 2024, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:22:47 am
title: Android中的ID
author: hacket
categories:
  - Android
category: Android基础
tags: []
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期五, 十一月 22日 2024, 10:41:00 上午
date updated: 星期一, 一月 6日 2025, 9:46:34 晚上
image-auto-upload: true
feed: show
format: list
aliases: [Android 设备相关信息]
linter-yaml-title-alias: Android 设备相关信息
---

# Android 设备相关信息

## 1、~~IMEI~~

通过 TelephonyManager 获取，返回 IMEI for GSM 或者 MEID/ESN for CDMA<br />需要权限 `<uses-permission android:name="android.permission.READ_PHONE_STATE"/>`

```java
android.telephony.TelephonyManager tm = (android.telephony.TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE); String deviceId = tm.getDeviceId();
```

特点：

1. 只有 Android 手机才有， IMEI 号是一串 15 位的号码。当设备为手机时，返回设备的唯一 ID。手机制式为 GSM 时，返回手机的 IMEI 。手机制式为 CDMA 时，返回手机的 MEID 或 ESN 。
2. 非电话设备或者 Device ID 不可用时，返回 null
3. 属于比较稳定的设备标识符，恢复出厂设置后还是一致
4. 某些设备上该方法存在 Bug ，返回的结果可能是一串 0 或者一串 * 号。
5. 需要 READ_PHONE_STATE 权限。 (Android 6.0 以上需要用户手动赋予该权限)。

**不足：**

- 需要权限，可能返回空
- 恢复出厂值还是一样
- 高版本获取不到返回 null

## 2、ANDROID_ID

见下面

## 3、WLAN MAC 地址

这也可以得到一个独一无二的 ID 号，返回的是 00:11:22:33:44:55 。但是当没有 wifi 的时候，我们是无法获得数据的。<br />需要权限 `android.permission.ACCESS_WIFI_STATE`

```java

WifiManager wm = (WifiManager)getSystemService(Context.WIFI_SERVICE); 

String m_szWLANMAC = wm.getConnectionInfo().getMacAddress();
```

特点：

1. 没有 WiFi 硬件或者 WiFi 不可用的设备可能返回 null 或空，注意判空.
2. 比较稳定的硬件标识符。
3. 需要 `ACCESS_WIFI_STATE` 权限。
4. Android 6.0 开始，谷歌为保护用户数据，用此方法获取到的 Wi-Fi mac 地址都为 02:00:00:00:00:00，参考：<https://developer.android.com/about/versions/marshmallow/android-6.0-changes.html#behavior-hardware-id>
5. 如果 app 在装有谷歌框架的设备中读取了 mac 地址，会被谷歌检测为有害应用提示用户卸载。这也是为什么像友盟、TalkingData 等数据统计 sdk 提供商专门针对 Google Play 提供特供版的 sdk.

## 4、蓝牙 MAC 地址

市面上大部分的应用不使用蓝牙，如果你的应用根本没用蓝牙，而你却和用户要了蓝牙权限的，那你很可疑。

```java

BluetoothAdapter m_BluetoothAdapter = null; 

m_BluetoothAdapter = BluetoothAdapter.getDefaultAdapter(); 

String m_szBTMAC = m_BluetoothAdapter.getAddress();
```

需要权限 `<uses-permission android:name="android.permission.BLUETOOTH"/>`

## 5、Sim 卡序列号（Sim Serial Number）

```java

android.telephony.TelephonyManager tm = (android.telephony.TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE); String simSerialNum = tm.getSimSerialNumber();
```

特点：

1. 不同 sim 卡的序列号不同
2. Sim 卡序列号，当手机上装有 Sim 卡并且可用时，返回该值。手机未装 Sim 卡或者不可用时，返回 null。
3. 需要 `READ_PHONE_STATE` 权限。 (Android 6.0 以上需要用户手动赋予该权限)

## 6、设备序列号（Serial Number, SN）

从 Android 2.3 开始，可以通过 `android.os.Build.SERIAL` 获取设备的序列号。没有通讯功能的设备也被要求通过该方法返回一个唯一设备 ID。一些手机可能也会这么做。

```java

String serialNum = android.os.Build.SERIAL;
```

比较稳定的设备硬件标识符

## 7、User Email

用户可以更改他们的 email （非常不可靠）

1. API5+ 需要权限

`<uses-permission android:name="android.permission.GET_ACCOUNTS"/>`

2. API14+ 需要权限

`<uses-permission android:name="android.permission.READ_CONTACTS"/>`

## 8、用户手机号

用户可以更改他们的手机号 （非常不可靠）

需要权限 `<uses-permission android:name="android.permission.READ_PHONE_STATE"/>`

## 9、其他设备信息

1. 制造商（Manufacturer）

```java

String manufacturer = android.os.Build.MANUFACTURER;
```

2. 型号（Model）

```java

String model = android.os.Build.MODEL;
```

3. 品牌（Brand）

```java

String brand = android.os.Build.BRAND;
```

4. 设备名（Device）

```java

String device = android.os.Build.DEVICE;
```

## Ref

- 漫谈唯一设备 ID<br /><https://juejin.im/post/5d8ab56df265da5bb252d67c>

# 手机唯一标识

## ~~IMEI~~

- 一般手机有三个 device_id(单卡槽两个)
- imei 分别对应卡槽一，卡槽二，不同卡槽获取的 IMEI 不一致。
- cdma 制式获取的到是 meid
- 不插卡默认取的是卡槽一的 imei

### 唯一性

首先可以确认不唯一。原因在移动设备不一定有 IMEI 和设备的 IMEI 可修改里面已经说明了。

- 很多山寨机厂商并不会办理入网注册，因此就会存在使用的设备没有 IMEI 或者 IMEI 不规范，在出厂时就重复了。
- 由于 IMEI 可修改，因此自然就会有修改自己设备的 IMEI，并且可以改为任何值。
- 恢复出厂值不会变

### 设备都有 IMEI 么？

- 不只手机，所有使用移动网络的设备都应该有 IMEI。
- IMEI 标准用于任何蜂窝网络设备，这意味着，3G/4G 卡，笔记本电脑的 PCMCIA 无线网络卡，和其他移动设备也有 IMEI。

### Android 版本特性

- 需要 READ_PHONE_STATE 权限
- Android6.0 及以上需要动态申请权限
- Android10 及以上，禁止获取手机 IMEI

## ANDROID_ID

### ANDROID_ID 介绍

Android_ID 是设备首次启动时，系统生成的一个唯一串号，长 16 字节 (例：70560687d711af97)，由 com.android.providers.settings 这个系统程序所管理，Android6.0 以下储存在/data/data/com.android.providers.settings/databases/settings.db 中的 secure 表

此 ID 与硬件无关，与 Android 系统有关，所以当系统还原出厂设置，刷机时这个 ID 就会重新生成了

### 代码获取

```kotlin
Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID)
```

### Android8.0 变更

1. Android 8.0 及以上

ANDROID_ID 根据应用签名和用户的不同而不同。ANDROID_ID 的唯一决定于应用签名、用户和设备三者的组合

2. Android 8.0 以前

对于升级到 8.0 之前安装的应用，ANDROID_ID 会保持不变。如果卸载后重新安装/恢复出厂设置的话，ANDROID_ID 将会改变

### ANDROID_ID 变化的场景

1. 刷机、Root、恢复出厂设置等会使得 Android ID 改变
2. 软件修改（一般是模拟器，xposed，root）
3. 手机从 Android8.0 之前升级到 Android8.0 及以上，ANDROID_ID 也会变化

### ANDROID_ID 为 9774d56d682e549c

在 Android 系统中，如果设备没有 Google Play 服务，或者该服务没有被 Google 应用程序访问过，则设备的 Android ID 可能会被设置为固定值 "9774d56d682e549c"。这个值是由于曾经在 Android 2.2 及其以下版本中存在漏洞，导致在某些设备上该值无法正确生成。<br />这个值的出现主要是为了兼容以前的设备，在 Android 2.3 版本中，Google 已经使用另一个更安全的方法来生成设备的 Android ID，并一直使用到现在。因此，在 Android 2.3 及以上版本中，Android ID 不会被设置为 `9774d56d682e549c`。<br />需要注意的是，由于该值是一个常数值，因此不能用作单个设备的唯一标识符，并且也不能保证在所有设备上都是唯一的。因此，在 Android 2.2 及其以下版本的设备上，如果您不确定是否能够通过代码正确生成设备的 Android ID，建议使用其他的设备标识符，例如 IMEI 或 SERAILNUMBER 等。在 Android 2.3 及以上版本中，可以使用更安全的 Android ID 生成方法来生成设备标识符。

#### 如何处理 9774d56d682e549c？

用 UUID 替换：

```java
String id = UUID.randomUUID().toString();
```

- [x] [Android - How are you dealing with 9774d56d682e549c ? Android ID](https://stackoverflow.com/questions/6106681/android-how-are-you-dealing-with-9774d56d682e549c-android-id)

## AAID

AAID 与 IDFA 作用相同——IDFA 是 iOS 平台内的广告跟踪 ID，AAID 则用于 Android 平台。

它们都是一种非永久、可重置的标识符，专门提供给 App 以进行广告行为，用户随时可以重置该类 ID，或通过系统设置关闭个性化广告跟踪。但 AAID 依托于 Google 服务框架，因此如果手机没有内置该框架、或框架不完整、或无法连接到相关服务，这些情况都有可能导致 AAID 不可用。

## OAID：Android 10 之后的替代方案

国内 App 和广告跟踪服务急需一种替代方案以避免广告流量的损失，OAID 顺势而生。<br />Android 开发者文档中对 Android 10 限制设备标识符读取的说明 OAID 的本质其实是一种在国行系统内使用的、应对 Android 10 限制读取 IMEI 的、「拯救」国内移动广告的广告跟踪标识符，其背后是 移动安全联盟（Mobile Security Alliance，简称 MSA）。<br />该联盟由中国信息通信研究院担任理事长和秘书长单位，北京大学、vivo、360、华为担任副理事长单位，并有包括苹果、中兴、OPPO、小米等多家理事和会员单位，OAID 所属的标识符体系也是由该联盟牵头发起的（参见「移动智能终端补充设备标识体系」）<br />主流手机厂商都已经在其开发者平台上提供了 Android 10 适配指引，包括 三星中国开发者网站、华为开发者联盟、OPPO 开放平台、vivo 开放平台 都已针对 Android 10 的相关变化做出了说明和解决方案建议，其中就包括 Google 官方标识符适配建议和 OAID 适配方式。<br />另外 OPPO 和 vivo 也分别在其开放平台提供了「移动智能终端补充设备标识体系」相关文档和 SDK 下载。<br />不难看出，广告平台已经开始接入 OAID 作为国内广告标识符的建议方案，主流设备厂家也已经开始指导开发者采用「移动智能终端补充设备标识体系」，并且考虑到国内主流的应用预置和分发平台（例如手机厂商内建的应用商店）与 Google Play 一样开始对上架 App 的 API 等级做出强制要求，包括 OAID 在内的标识符体系毫无疑问将成为国内第三方 App 的强制执行标准。

OAID 主要用于 SDK<br /><http://www.msa-alliance.cn/col.jsp?id=120>

# Android deviceid（设备 id）生成

## 1、imei、androidid

## 2、通过 uuid

通过获取设备的 imei、androidid 等信息，配合 uuid，生成 deviceid，通过对称密码/md5 保存在本地 sd 卡，

Android 获取设备唯一 ID 的几种方式<br /><https://blog.csdn.net/u014651216/article/details/50767326>
