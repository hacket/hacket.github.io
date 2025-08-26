---
banner: 
date_created: Tuesday, October 29th 2015, 12:08:52 am
date_updated: Saturday, February 22nd 2025, 4:42:14 pm
title: ViewAnimator
author: hacket
categories:
  - AndroidUI
category: 系统控件
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
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
aliases: [ViewSwitcher]
linter-yaml-title-alias: ViewSwitcher
---

# ViewSwitcher

# ViewFlipper

可用于控件的滚动

## 基本使用

1. 在 xml 布局中的方法介绍

```xml
android:autoStart： 设置自动加载下一个View
android:flipInterval：设置View之间切换的时间间隔
android:inAnimation： 设置切换View的进入动画
android:outAnimation：设置切换View的退出动画
```

2. 代码

```java
isFlipping： 判断View切换是否正在进行
setFilpInterval：设置View之间切换的时间间隔
startFlipping： 开始View的切换，而且会循环进行
stopFlipping： 停止View的切换
setOutAnimation：设置切换View的退出动画
setInAnimation： 设置切换View的进入动画
showNext： 显示ViewFlipper里的下一个View
showPrevious： 显示ViewFlipper里的上一个View
```

## 案例

### 1、从左到右转动

```xml
<ViewFlipper
        android:id="@+id/viewflipper"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:autoStart="false"
        android:flipInterval="2000"
        android:inAnimation="@anim/anim_come_in"
        android:outAnimation="@anim/anim_come_out">

</ViewFlipper>

// anim_come_out
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
            android:duration="3000"
            android:fromXDelta="0%p"
            android:toXDelta="-100%p" />
</set>

// anim_come_in
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
            android:duration="3000"
            android:fromXDelta="100%p"
            android:toXDelta="0%p" />
</set>
```

```java
viewflipper.showNext();
```

### 2、垂直滚动广告条 ViewFLipper

Zane_Sam
