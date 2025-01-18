---
date created: 星期四, 四月 11日 2024, 9:50:00 晚上
date updated: 星期四, 一月 2日 2025, 9:04:46 晚上
title: Android9.0适配(API28 AndroidP)
dg-publish: true
image-auto-upload: true
feed: show
format: list
aliases: [Android 9（API 28-AndroidPie）]
linter-yaml-title-alias: Android 9（API 28-AndroidPie）
---

# Android 9（API 28-AndroidPie）

## 明文 HTTP 限制 CLEARTEXT communication to host not permitted by network

**问题：** 由于 Android P 限制了明文流量的网络请求，非加密的流量请求都会被系统禁止掉。

> 如果当前应用的请求是 htttp 请求，而非 https ,这样就会导系统禁止当前应用进行该请求，如果 WebView 的 url 用 http 协议，同样会出现加载失败，https 不受影响。

为此，OkHttp 3 做了检查，所以如果使用了明文流量，默认情况下，在 Android P 版本 OkHttp 3 就抛出异常: `CLEARTEXT communication to " + host + " not permitted by network security policy`

```java
if (!Platform.get().isCleartextTrafficPermitted(host)) {
      throw new RouteException(new UnknownServiceException(
          "CLEARTEXT communication to " + host + " not permitted by network security policy"));
}
```

**解决 1：**<br>在 res 下新建一个 xml 目录，然后创建一个名为：`network_security_config.xml` 文件，该文件内容如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!--release只依赖system证书-->
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
    <!--指定域名-->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">d1.music.126.net</domain>
        <domain includeSubdomains="true">dldir1.qq.com</domain>
        <domain includeSubdomains="true">imgsrc.baidu.com</domain>
    </domain-config>
    <!--debug依赖system和user证书-->
    <debug-overrides>
        <trust-anchors>
            <certificates src="system"/>
            <certificates src="user"/>
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

然后在 `AndroidManifest.xml` application 标签内应用上面的 xml 配置：

```xml
 <application
        android:name=".App"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:networkSecurityConfig="@xml/network_security_config"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"></application>
```

**解决 2：**<br>服务器和本地应用都改用 https (推荐)<br>**解决 3：**<br>`targetSdkVersion` 降级回到 27

## 私有 API 反射

### 绕过私有 API 使用限制的库

- Epic
- [GitHub - ChickenHook/RestrictionBypass: Android API restriction bypass for all Android Versions](https://github.com/ChickenHook/RestrictionBypass)

## App Standby Buckets 应用待机桶

[应用待机分桶  |  App quality  |  Android Developers](https://developer.android.com/topic/performance/appstandby)

Android 9 及更高版本支持应用待机桶（`App Standby Buckets`），根据使用模式对应用资源进行优先级排序。有五个优先级桶：**活跃（Active）**、**工作集（Working set）**、**频繁（Frequent）**、**罕见（Rare）** 和**受限制（Restricted）**。每个桶对应用的作业、闹钟和互联网访问有不同的限制。系统根据使用历史或机器学习预测将应用分配到不同的桶中。Android 12 中新增了**受限制（Restricted）** 桶，具有最高的限制。某些应用程序不会进入受限制桶。

- **应用待机桶**：Android 9 及更高版本使用应用待机桶来根据使用模式对应用资源进行优先级排序。
- **优先级桶**：有五个优先级桶：活跃（Active）、工作集（Working set）、频繁（Frequent）、罕见（Rare）和受限制（Restricted）。每个桶对应用资源有不同的限制。
- **应用分配**：应用根据使用历史或机器学习预测被分配到不同的桶中。系统可能依赖预加载的应用程序来确定应用的使用可能性。
- **受限制桶**：Android 12 中新增的受限制桶具有最高的限制，根据应用行为和用户交互进行分配。某些应用程序不会进入受限制桶。

### App Standby 和 App Standby Buckets

App Standby 和 App Standby Buckets 是 Android 系统中与应用资源管理相关的两个概念。

**App Standby（应用待机）** 是指在设备处于空闲状态时，Android 系统会自动将一些不常用的应用进入待机状态，以降低其对系统资源和电池的消耗。待机应用在待机状态下会限制其后台活动，如网络访问、定位更新等，以节省电量。一旦用户重新启动该应用或者主动与其互动，应用将恢复正常状态。

**App Standby Buckets（应用待机桶）** 是从 Android 9 开始引入的一种管理应用资源的方式。它将应用分为不同的优先级桶，包括 " 活跃 "、" 工作集 "、" 频繁 "、" 罕见 " 和 " 受限制 " 五个桶。每个桶都有不同的限制和优先级。系统根据应用的使用模式、用户互动以及系统预测等因素将应用分配到相应的桶中。桶的分配决定了应用对资源的访问权限和后台活动的限制程度。

`App Standby` 是一种应用资源管理策略，而 `App Standby Buckets` 是一种具体的实现方式。App Standby Buckets 通过将应用分配到不同的优先级桶中，更加细致地管理应用的资源使用和后台活动，以提供更好的用户体验和节省系统资源。
