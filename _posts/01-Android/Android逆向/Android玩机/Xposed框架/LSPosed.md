---
date created: 2024-03-14 23:29
date updated: 2024-12-24 00:44
dg-publish: true
---

# [LSPPosed](https://github.com/LSPosed/LSPosed)

LSP 框架(`LSPosed Xposed Framework`)是 XDA 论坛投票结果得分最高的 `Xposed` 框架，LSP 框架基于 `Rirud` 的 ART 挂钩框架(最初为 Android Pie)提供与原版 `Xposed` 相同的 API，利用 YAHFA 挂钩框架，支持 Android 13。

## 安装

1. Install Magisk v24+
2. (For `Riru flavor`) Install [Riru](https://github.com/RikkaApps/Riru/releases/latest) v26.1.7+
3. [Download](https://github.com/LSPosed/LSPosed#download) and install LSPosed in `Magisk` app
4. Reboot
5. Open LSPosed manager from notification
6. [LSPosed 安装教程（LSP框架安装教程）](https://magiskcn.com/lsposed-install)

### Magisk 安装 LSPosed

- 目前最新也是最后的一个版本是 `1.9.2`，后续就不会维护了

- 下载 LSPosed 模块（`Zygisk` 版）：[蓝奏盘](https://mrzzoxo.lanzoue.com/b02pfsr2f)丨 [GitHub](https://github.com/LSPosed/LSPosed/releases/latest)

_部分地区打不开 GitHub，可选 蓝奏盘 下载。_
![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240927101119.png)

- 打开Magisk – 设置 – 开启 `Zygisk`

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240927101200.png)

- 打开面具 – 模块 – 从本地安装

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240927101228.png)

- 重启设备，通知栏点开（如果没显示，可以通过拨号键输入 `*#*#5776733#*#*` 进入LSPosed）

- 进入 LSPosed 1.创建快捷方式 – 2.状态通知关闭

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240927101652.png)

- `LSPosed` 显示“已激活”则成功刷入。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240927101536.png)

## `Zygisk` 和 ~~`Riru`~~

从 Magisk v24.0版本开始，之前的 ~~`Riru`~~ 改成了 `Zygisk`，`Riru` 已经停更，新系统用不了 `Riru`。
`Zygisk`命名非常形象，意思是**注入Zygote后的Magisk**。它能为Magisk模块，提供**更深入、更强悍**的修改能力。它有一个排除列表，可以撤销Magisk做的所有修改。这样你就能手动划定，模块起作用的范围。

注意，**该功能跟 Riru Hide 不同，不能避免 root 被检测到**，没有任何隐藏作用。即使你把某些程序加入排除列表，它们依旧可以发现 Zygisk。如果用户要隐藏 root，只能借助其他方式，比如**添加 Shamiko 模块**。

### Magisk 启用 `Zygisk`

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403170042523.png)

# [模块](https://modules.lsposed.org/)

## [HookVip](https://modules.lsposed.org/module/Hook.JiuWu.Xp#hookvip) 解锁 APP VIP

用于解锁部分App会员以及添加一些拓展功能的Xposed模块
解锁会员
[下载](https://github.com/Xposed-Modules-Repo/Hook.JiuWu.Xp/releases)

## [Inspeckage](https://modules.lsposed.org/module/mobi.acpm.inspeckage#-inspeckage---android-package-inspector) 查看APP包的信息

下载：<https://github.com/ac-pm/Inspeckage/releases>

## JustTrustMe

<https://www.cnblogs.com/gnz48/p/17315710.html><br><https://crifan.github.io/app_capture_package_tool_charles/website/how_capture_app/complex_https/https_ssl_pinning/>

## Youtube

### YouTube 去广告，锁屏播放 | NoAdsBackgroundPlaybackYT

YouTube去广告，锁屏播放 | NoAdsBackgroundPlaybackYT
YouTube去广告，后台播放，息屏播放
介绍:

删除YouTube中几乎所有的广告，包括视频播放过程中的广告，实现全程无广告观看视频
基于特征码定位广告信息，实现自动适配新版本的YouTube，无需担心升级后功能失效
实现后台播放，关闭屏幕播放，极致省电

[下载](https://downloads.suchenqaq.club/xposed_module/YouTube%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E9%94%81%E5%B1%8F%E6%92%AD%E6%94%BE%7CNoAdsBackgroundPlaybackYT%E6%96%B0%E7%89%88%E6%9C%AC%E9%80%82%E9%85%8DYouTube17.14.35%E3%80%81YouTubeMusic5.02.50.apk)

### YouTube AdAway

<https://github.com/wanam/YouTubeAdAway><br><https://modules.lsposed.org/module/ma.wanam.youtubeadaway>

1. 去除广告
2. Youtube后台播放

**注意：** `YouTube AdAway` 版本要和 `YouTube` 版本对应上；把`Google Play` 自动更新关掉

| YouTube 版本                                                                                                                                                                                                                                          | YouTube AdAway 版本                                                                                                                                           |                                                                                                         |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| YouTube 18.49.3 [YouTube 18.49.36 (nodpi) (Android 8.0+)](https://www.apkmirror.com/apk/google-inc/youtube/youtube-18-49-36-release/youtube-18-49-36-android-apk-download/download/?key=07566cc9d866c715ed75eac22c43dd10d492301f&forcebaseapk=true) | [Release 5.1.0 · Xposed-Modules-Repo/ma.wanam.youtubeadaway · GitHub](https://github.com/Xposed-Modules-Repo/ma.wanam.youtubeadaway/releases/tag/510-5.1.0) | [YouTube AdAway - Xposed Module Repository](https://modules.lsposed.org/module/ma.wanam.youtubeadaway/) |

## Bilili

### 哔哩漫游/BiliRoaming

解除 B 站客户端番剧区域限制的 Xposed 模块，并且提供其他小功能，支持的功能：

- 解除 B 站番剧区域限制

- 港澳台 CDN 加速

- 缓存番剧

- 支持国际版和概念版

- 自定义主题色

- 关闭青少年模式弹窗

- 显示评论区楼层

- 概念版添加直播入口

- 不以小程序形式分享

- 自动点赞视频

- 把我的页面移到侧边栏

- 替换音乐状态栏为原生样式

- 提取视频、直播封面

- 自定义屏启动图

[下载](https://downloads.suchenqaq.club/xposed_module/%E5%93%94%E5%93%A9%E6%BC%AB%E6%B8%B8-BiliRoaming1.7.0.apk)

## PlusNE (7.0+)

[PlusNE 7+ - Xposed Module Repository](https://modules.lsposed.org/module/me.plusne/)

支持的功能：

- TikTok(免费使用功能 解除网络限制)

## 锤锤

## 光速虚拟机

[光速虚拟机（完美支持面具的虚拟机） - Magisk中文网](https://magiskcn.com/gsxnj)
