---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, January 22nd 2025, 12:01:08 am
title: 定位（Google Service Map和LocationManager）
author: hacket
categories:
  - Android
category: Firebase
tags: [Firebase]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-12-24 00:33
date updated: 2024-12-24 00:33
aliases: [定位（Google Service Map 和 LocationManager）]
linter-yaml-title-alias: 定位（Google Service Map 和 LocationManager）
---

# 定位（Google Service Map 和 LocationManager）

定位有 2 种，Android 可以使用 SDK 提供的 LocationManager 实现；也可以借助 google service map 实现 (需要安装 google service)

## LocationManager

借助 GPS（高精度）和网络（低精度）实现定位；GPS 定位依赖手机系统的 GPS 设置开关，网络是依靠连接的基站实现的

需要权限（高精度）`<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />`，这个权限包含了（低精度）`<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`

### Android8.0+ 位置权限变更

<https://developer.android.com/training/location/retrieve-current>

明确说明在 8.0 以后，后台对获取位置的时间做了限制，一个小时内只能获取几次，所有需要在后台使用服务需要注意

## Google Service Map

用 play service 中的 api 获取（也是官方推荐的方式），但有个缺点要安装 google 服务，翻墙，但这样很多国产手机都不行，华为，三星都试过，google 的 pixel 手机可以的

## 地理反编码

在进行到定位后，我们需要把地理编码经纬度换成生活中人们使用的地址，这时候就需要用到地理反编码了。

## 可用库

- Android-ReactiveLocation（2.1k star）<br />Small library that wraps Google Play Service API in brilliant RxJava Observables reducing boilerplate to minimum.<br /><https://github.com/mcharmas/Android-ReactiveLocation>
