---
banner: 
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, April 2nd 2025, 7:11:08 pm
title: "Android15适配(API35 AndroidV) "
author: hacket
categories:
  - Android
category: Android适配
tags: [Android适配, 系统版本适配]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date created: Invalid date
date updated: Tuesday, January 7th 2025, 11:28:11 pm
image-auto-upload: true
feed: show
format: list
aliases: [Android15 适配]
linter-yaml-title-alias: Android15 适配
---

# Android15 适配

[Android 15  Android Developers](https://developer.android.com/about/versions/15?hl=zh-cn)

## 所有应用（无关 `targetSdkVersion=35`）

> 无论你是否调整你的应用 `targetSdkVersion` 到 Android15，以下是都会在 Android15 手机上生效的改动。

### package stopped state（对包停止状态的更改）

APP 进入 `stopped state` 状态，所有的 pending intents 被取消，app's widgets 将 disable，app widget 将灰化，用户无法操作，直到用户重新启动 APP。

可通过下列 API 查询 APP 是否进入 stopped state 状态：

```kotlin
ApplicationStartInfo.wasForceStopped()
```

**适配方案：**
- 确保你的应用在进入 `stopped state` 时能够正确处理。如果你的应用依赖于 pending intents，那么当应用进入 `stopped state` 时，这些 pending intents 将被取消，你需要确保你的应用在重新启动时能够重新注册这些 pending intents。

### 将最低目标 SDK 版本从 23 增加到 24

在 Android 15 中，无法安装 `targetSdkVersion` 低于 24 的应用。要求应用满足现代 API 级别有助于确保更好的安全性和隐私性。

恶意软件通常以较低的 API 级别为目标，以绕过更高 Android 版本中引入的安全和隐私保护。例如，某些恶意软件应用使用 22 `targetSdkVersion` 来避免受 Android 6.0 Marshmallow（API 级别 23）在 2015 年引入的运行时权限模型的约束。Android 15 的这一变化使恶意软件更难避免安全和隐私改进。

尝试安装面向较低 API 级别的应用会导致安装失败，并在 Logcat 中显示如下消息：

```
INSTALL_FAILED_DEPRECATED_SDK_VERSION: App package must target at least SDK version 24, but found 7
```

在升级到 Android 15 的设备上，所有 `targetSdkVersion` 低于 24 的应用仍会安装。

### 支持 16 KB 页面大小

**适配方案**
- 如果你的应用使用了任何 NDK 库，你需要重新构建你的应用以使其在 16KB 页面大小的设备上运行。如果你不确定你的应用是否使用了 NDK 库，你可以使用 APK Analyzer 来检查是否存在 native code。

## `targetSdkVersion=35`

## 适配点

### 小组件

### Bitmap Config API 变更

Android 15 `android.graphics.Bitmap#getConfig`【方法返回值从@NonNull 变更为@Nullable】，bitmap.copy 方法的调用需要改为如下形式 `bitmap.copy(bitmap.config ?: Bitmap.Config.ARGB_8888, true)`
