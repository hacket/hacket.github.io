---
date_created: Monday, June 3rd 2024, 10:48:25 pm
date_updated: Wednesday, January 22nd 2025, 12:39:35 am
title: ClientTransaction
author: hacket
categories: 
category: 
tags: []
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
date created: 2024-05-31 14:15
date updated: 2024-12-24 00:40
aliases: [ClientTransaction]
linter-yaml-title-alias: ClientTransaction
---

# ClientTransaction

从 Android API28 开始，AMS 向客户端进程有关 Activity 部分的通信封装成一个统一的 Transaction 来操作，不再直接使用客户端进程 `ApplicationThread` 的本地代理了。
