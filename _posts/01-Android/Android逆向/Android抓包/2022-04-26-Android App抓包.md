---
date_created: Friday, April 26th 2022, 10:59:03 pm
date_updated: Wednesday, January 22nd 2025, 12:28:35 am
title: Android App抓包
author: hacket
categories:
  - Android进阶
category: 抓包
tags: [安全, 逆向, 抓包]
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
date created: 2024-04-26 19:35
date updated: 2024-12-24 00:45
aliases: [抓包概述]
linter-yaml-title-alias: 抓包概述
---

# 抓包概述

## 协议及工具选择

1. 应用层协议； `Http`/`Https`/`WebSocket` 协议等，一般使用中间人攻击方式进行抓包，常见软件 `Charles`, `ProxyMan`, `Whistle`, `Fiddler`, `Burp Suite`
2. 所有层协议； `Wireshark`，全平台。缺点，使用不太友好，需要 TCP 基础

## 不同 Android 版本抓包方案

1. Http 协议，
2. 低版本安卓 (<7.0)+Fiddler/Charles ；
3. 高版本安卓需要 Root+Magisk+LSPosed ；

高版本安卓还需要解决用户证书不信任问题，将用户证书移动至系统证书目录或者安装 hook 系统强制信任用户证书的模块。

如果 app 做了 ssl pinning ，需要使用 JustTrustMe/TrustMeAlready 之类模块 hook ssl 模块.

如果 app 做了双向证书校验,那就需要逆向 app 拿证书安装到 fiddler.

如果 app 有代理检测之类的，换用 vpn 抓包的工具。

如果 app 有加固、sign 校验之类的，建议你放弃。

## `Shizuku + LSPatch`

## HttpCanary + 平行空间

[HTTPCanary+平行空间工具——针对Android7.0+抓包问题的解决 - spellbound - 博客园](https://www.cnblogs.com/nimantou/p/14251888.html)

# Ref

- [ ] [记一次APP SSL pinnig 抓包](https://ben29.xyz/coding/app-ssl-pinning-bypassing-70.html)
- [ ] [Android HTTPS认证的N种方式和对抗方法总结](https://ch3nye.top/Android-HTTPS%E8%AE%A4%E8%AF%81%E7%9A%84N%E7%A7%8D%E6%96%B9%E5%BC%8F%E5%92%8C%E5%AF%B9%E6%8A%97%E6%96%B9%E6%B3%95%E6%80%BB%E7%BB%93/#0x9-webview-ssl-pinning)
- [ ] [工作记录 | 跨越Android 11监听https数据包的三道难关——从Https加密、PKI体系到知产及反法侵权线索的分析](https://legalwyy.com/archives/318)
- [ ] [Android Burpsuite无障碍抓包](https://www.incert.cn/posts/197d74f6.html)
- [ ] [Android 7~12 使用HttpCanary抓取HTTPS](https://www.zqh.plus/2022/03/19/Android-Capture/)
