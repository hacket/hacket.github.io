---
date created: 2024-04-23 15:58
date updated: 2024-12-24 00:44
dg-publish: true
---

# Shizuku

## Shizuku 介绍

`Shizuku` 可以帮助普通应用借助一个由 `app_process` 启动的 Java 进程直接以 `adb` 或 `root` 特权使用系统 API。

Shizuku 工作过程简单来说就是，在电脑给 Shiziku 这个服务进程授予了 ADB 权限之后，Shiziku 就可以成为一个**ADB**权限管理器（类似于 Magisk Manager ），通过这个管理器，它可以给一些需要ADB权限才能实现某些功能的应用进行授权（省去了命令行的麻烦以及不同的应用激活需要多次授权的麻烦）。ADB 权限比我们常用的完整 ROOT 权限要低一些，ADB 权限能做的事，Shiziku 基本也能做，ADB 权限做不到的事，Shiziku 也做不到。

## Shizuku 能做什么？

- 免 Root软件卸载，冻结
- 免 Root 激活小黑屋、冰箱等 APP

## 启动 `Shizuku`

Shizuku 支持通过以下三种方式启动。

1. 已经Root
2. 通过无线调试
3. 通过ADB

### 通过 root 启动

如果您的设备已经 root，直接启动即可

### 通过无线调试启动

通过无线调试启动适用于 Android 11 或以上版本。这种启动方式无需连接电脑。由于系统限制，每次重新启动后都需要再次进行启动步骤。

参考：[Shizuku 通过无线调试启动](https://shizuku.rikka.app/zh-hans/guide/setup/#%E9%80%9A%E8%BF%87%E6%97%A0%E7%BA%BF%E8%B0%83%E8%AF%95%E5%90%AF%E5%8A%A8)

### 通过电脑adb

该启动方式适用于未 root 设备。很不幸，该启动方式需要连接电脑。由于系统限制，每次重新启动后都需要再次进行启动步骤。

命令：

```shell
adb shell sh /sdcard/Android/data/moe.shizuku.privileged.api/start.sh
```

## `Shizuku` 使用注意事项

- 华为鸿蒙系统可用，推荐使用电脑 ADB 激活- 关闭开发者选项、手机系统重启之后，SHizuku 权限就会丢失，需要重新激活

- 如果你通过 Shizuku 已经对系统或者软件进行了修改，在卸载 Shizuku 之前，请务必先将其恢复为系统或者默认状态。- 建议将 Shizuku 软件保持后台运行，忽略电池优化，避免 Shizuku 权限丢失

- Shizuku 工作过程中，需要让系统的开发者选项以及USB调试保持开启，这样的系统状态可能会存在一些风险。尤其是手机在接入一些可能有恶意行为的 USB 设备上，可能会有数据安全风险

- 避免给一些来历不明的软件授予 Shizuku 权限

# 支持`Shizuku` 的 app

受限于 ADB 的权限等级，即使 `Shiziku` 激活的情况下，上述某些应用也不能提供完整的功能，有条件的还是建议使用 `Magisk ROOT`。

## LSPatch  (推荐)

免 Root 使用 LSPosed 框架
见：[[LSPatch]]

## `SHizukuRunner`  (推荐)

`SHizukuRunner`：`Shizuku`自定义命令运行工具。通过运行各种命令，可以对系统进行一些修改，比如调整动画速度、修改DPI、开启原生墓碑后台机制等

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240424095802.png)

需要自己编译 APK：
[GitHub - WuDi-ZhanShen/ShizukuRunner: 以shizuku身份执行命令的安卓小工具。A 50KB android app to run any commands via Shizuku.](https://github.com/WuDi-ZhanShen/ShizukuRunner)

![[ShizukuRunnerV13.apk]]

## 应用管理相关

### 黑域

黑域：限制应用后台运行权限，优化电量，降低内存占用

官方发布地址：<https://www.coolapk.com/apk/me.piebridge.brevent>

### 小黑屋

小黑屋：冻结应用，优化电量，降低内存占用

- [小黑屋 | 无 root 冻结应用程序](https://stopapp.https.gs/)

### 冰箱

冻结应用

### 绿色守护？

## 应用安装器

### Package Manager

- APK 的安装，卸载等
- 查看 APK 包的信息
- 安装APKS

![|300](https://play-lh.googleusercontent.com/3sSRYHygpVRc3feT0lKV11OltB7bdG8U5wZSGwI3FcMlVuRiDldDyeQY8hy1m4cOHw=w5120-h2880-rw)

![|300](https://play-lh.googleusercontent.com/7UxNm-tqErYcGLTkkWTFFFHvjImdeN1Eb8IWisrUxEy_peUsHPxfui_ehYQS8CrmNZI=w1052-h592-rw)

- Google Play: [Package Manager - Apps on Google Play](https://play.google.com/store/apps/details?id=com.smartpack.packagemanager)
- [GitHub - SmartPack/PackageManager](https://github.com/SmartPack/PackageManager)

### InstallerX（不维护了）

InstallerX：接管系统应用安装管理程序，不会提示应用风险。

- 支持应用卸载/安装、应用降级安装
- 安装方式支持对话框、通知栏，静默安装
- 自动删除包

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240427193951.png)

参考：

- [InstallerX](https://github.com/iamr0s/InstallerX)
- [InstallerX替换你手机的软件安装器 - 知乎](https://zhuanlan.zhihu.com/p/635430270)

## 应用权限相关

### App Ops  (推荐)

### 权限狗

管理/限制应用权限

## `MT管理器` (推荐)

最强的安卓第三方文件管理器

[MT管理器](https://mt2.cn/)

## SystemUI Tuner (推荐)

- 下载：[SystemUI Tuner - Apps on Google Play](https://play.google.com/store/apps/details?id=com.zacharee1.systemuituner)
- GitHub:  [GitHub - zacharee/Tweaker](https://github.com/zacharee/Tweaker)

## 其他

### `ShizuTools`

提供一些简单的工具

- 卸载系统应用
- 破解收费主题
- 允许降级安装
- 多个 APP 同时播放媒体音
- 执行 adb shell 命令
- Intent shell：允许其他 APP 执行 adb 命令

[GitHub - legendsayantan/ShizuTools: Tools to modify android system via shizuku.](https://github.com/legendsayantan/ShizuTools)

### 自动跳过

跳过软件开屏启动页的广告

### 爱玩机工具箱

综合性的玩机工具箱

### `Scene`

第三方调度管理器、手机性能调试工具

[Download Scene latest 7.0.0 Android APK](https://apkpure.com/scene/com.omarea.vtools/download)

### 更多

`awesome-shizuku`

可以在 `awesome-shizuku` 项目中查看支持 Shizuku 特性的应用，数量十分可观。

## TODO?

### 构建支持线上 Shein App 的设置页面

- 开启log
- 开启debug
- 开启抓包

### 支持 aab 安装的 Package Manager

1. 将 aab 转换成 apks
2. 自定义 package manager，能识别 apks 格式
3. 利用 shizuku，免 root 接管系统的 PM

Aab 转 apks:[GitHub - shapun963/Apk-AAB-Converter](https://github.com/shapun963/Apk-AAB-Converter)

Apks 安装器：[GitHub - SmartPack/PackageManager: Source code of Package Manager, an Application to Manage your Apps.](https://github.com/SmartPack/PackageManager)

# Ref

- [Shizuku](https://shizuku.rikka.app/zh-hans/)

- [awesome-shizuku](https://github.com/timschneeb/awesome-shizuku)
