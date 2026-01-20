---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Wednesday, January 29th 2025, 7:03:38 pm
title: ConstraintLayout应用场景
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, ConstraintLayout]
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
date created: 2024-09-24 17:47
date updated: 2024-12-24 00:31
aliases: [ConstraintLayout 应用场景]
linter-yaml-title-alias: ConstraintLayout 应用场景
---

# ConstraintLayout 应用场景

## 半透布局，居中对齐

### 1. 要相对 view 的 bottom，xxx_toBottomOf

```xml
app:layout_constraintBottom_toBottomOf="@id/tv1"
app:layout_constraintTop_toBottomOf="@id/tv1"
```

### 2. 要相对于 view 的 top，xxx_toTopOf

```xml
app:layout_constraintBottom_toTopOf="@id/tv3"
app:layout_constraintTop_toTopOf="@id/tv3"
```

经常用于个人主页头像

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <View
            android:id="@+id/tv1"
            android:layout_width="0dp"
            android:layout_height="200dp"
            android:background="#CDCD00"
            android:gravity="center"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

    <TextView
            android:id="@+id/tv2"
            android:layout_width="160dp"
            android:layout_height="80dp"
            android:background="#FF7F24"
            android:gravity="center"
            android:text="一半在兄弟节点中(相对于兄弟Bottom)"
            app:layout_constraintBottom_toBottomOf="@id/tv1"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/tv1" />

    <View
            android:id="@+id/tv3"
            android:layout_width="0dp"
            android:layout_height="200dp"
            android:background="#FF90f8"
            android:gravity="center"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintBottom_toBottomOf="parent" />

    <TextView
            android:id="@+id/tv4"
            android:layout_width="160dp"
            android:layout_height="80dp"
            android:background="#FF7F24"
            android:gravity="center"
            android:text="一半在兄弟节点中(相对于兄弟Top)"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintBottom_toTopOf="@id/tv3"
            app:layout_constraintTop_toTopOf="@id/tv3" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![982au](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/982au.png)

## 半透布局，超出对齐 View 一部分 (不在对齐 View 内了)

> 引入 Space 来做对齐

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="0dp"
    android:layout_height="@dimen/qb_px_62"
    android:layout_marginTop="@dimen/qb_px_10"
    android:background="@drawable/lucky_draw_bottom_user_info_shape"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toBottomOf="@id/cl_lucky_draw_content_container">

  
    <TextView
        android:id="@+id/tv_lucky_draw_recharge"
        android:layout_width="@dimen/qb_px_80"
        android:layout_height="@dimen/qb_px_35"
        android:layout_marginEnd="@dimen/qb_px_15"
        android:background="@drawable/ic_lucky_draw_recharge_btn_bg"
        android:fontFamily="@font/custom_bold_font"
        android:gravity="center"
        android:includeFontPadding="false"
        android:text="@string/recharge"
        android:textColor="#EF582C"
        android:textSize="14sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <Space
        android:id="@+id/space_lucky_draw2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginEnd="@dimen/qb_px_11"
        app:layout_constraintTop_toTopOf="@id/tv_lucky_draw_recharge"
        app:layout_constraintBottom_toTopOf="@id/tv_lucky_draw_recharge"
        app:layout_constraintEnd_toStartOf="@id/tv_lucky_draw_recharge" />

    <!--下一次充值免费标签-->
    <TextView
        android:id="@+id/tv_lucky_draw_next_recharge_free_label"
        android:layout_width="wrap_content"
        android:layout_height="@dimen/qb_px_22"
        android:layout_marginTop="@dimen/qb_px_4"
        android:background="@drawable/lucky_draw_free_label_selector"
        android:enabled="false"
        android:gravity="center"
        android:minWidth="@dimen/qb_px_55"
        android:paddingStart="@dimen/qb_px_4"
        android:paddingEnd="@dimen/qb_px_4"
        android:text="@string/lucky_draw_next_recharge_free_label"
        android:textColor="#681895"
        android:visibility="gone"
        app:layout_constraintBottom_toTopOf="@id/space_lucky_draw2"
        app:layout_constraintStart_toStartOf="@id/space_lucky_draw2"
        app:layout_constraintTop_toTopOf="@id/space_lucky_draw2"
        tools:visibility="visible" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

![y8qck](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/y8qck.png)

## Ref

- [x] 布局优化：9 种让你不得不使用约束布局 Constraintlayout 的场景<br /><https://juejin.im/post/5e7eb53451882573866b7f2d>
