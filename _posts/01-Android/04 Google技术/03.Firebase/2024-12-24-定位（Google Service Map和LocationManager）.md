---
date created: 2024-12-24 00:33
date updated: 2024-12-24 00:33
dg-publish: true
---

定位有2种，Android可以使用SDK提供的LocationManager实现；也可以借助google service map实现(需要安装google service)

## LocationManager

借助GPS（高精度）和网络（低精度）实现定位；GPS定位依赖手机系统的GPS设置开关，网络是依靠连接的基站实现的

需要权限（高精度）`<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />`，这个权限包含了（低精度）`<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`

### Android8.0+位置权限变更

<https://developer.android.com/training/location/retrieve-current>

明确说明在8.0以后，后台对获取位置的时间做了限制，一个小时内只能获取几次，所有需要在后台使用服务需要注意

## Google Service Map

用play service中的api获取（也是官方推荐的方式），但有个缺点要安装google 服务，翻墙，但这样很多国产手机都不行，华为，三星都试过，google的pixel手机可以的

## 地理反编码

在进行到定位后，我们需要把地理编码经纬度换成生活中人们使用的地址，这时候就需要用到地理反编码了。

## 可用库

- Android-ReactiveLocation（2.1k star）<br />Small library that wraps Google Play Service API in brilliant RxJava Observables reducing boilerplate to minimum.<br /><https://github.com/mcharmas/Android-ReactiveLocation>
