---
date_created: Tuesday, June 11th 2022, 10:55:10 pm
date_updated: Wednesday, January 22nd 2025, 12:08:36 am
title: Privacy & Security
author: hacket
categories:
  - Android
category: Google
tags: [Google]
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
date created: 2024-06-11 20:15
date updated: 2024-12-24 00:33
aliases: [Direct Boot mode]
linter-yaml-title-alias: Direct Boot mode
---

# Direct Boot mode

Android 7.0 引入了 Direct Boot 模式，用于在设备启动但用户尚未解锁时运行应用程序。系统提供了几种存储位置来支持 Direct Boot 模式，包括凭据加密存储和设备加密存储。应用可以通过注册为加密感知（encryption aware）来在 Direct Boot 模式下运行，并在需要时访问设备加密存储。此外，Android 还提供了 API 和工具，用于管理数据迁移和测试加密感知应用。

## Ref

- [支持“直接启动”模式  |  App quality  |  Android Developers](https://developer.android.com/privacy-and-security/direct-boot)
- [android 11 的directboot mode这个机制 android:directbootaware](https://blog.51cto.com/u_16099277/8536840)
