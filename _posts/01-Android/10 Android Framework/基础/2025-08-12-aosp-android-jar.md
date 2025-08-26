---
banner:
date_created: Tuesday, August 12th 2025, 11:59:24 pm
date_updated: Wednesday, August 13th 2025, 12:00:21 am
title: aosp-android-jar
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
aliases: [aosp-android-jar]
linter-yaml-title-alias: aosp-android-jar
---

# aosp-android-jar

<https://github.com/Reginer/aosp-android-jar>

替换 ` ${Android Sdk}/platforms/andorid-api/` 下的 `android.jar`，之后 sync 一下。

**使用这种方式有什么好处：**
- 有调用提示，方法列表可以点出来
- 减少适配成本，版本更新之后，不适配的方法会直接以错误的形式体现出来，不会如反射一样直接编译通过而运行时报错
- 无意中会学会更多知识，列出方法列表会更加接近源码，偶尔留下的印象也许会在某天突然融会贯通
