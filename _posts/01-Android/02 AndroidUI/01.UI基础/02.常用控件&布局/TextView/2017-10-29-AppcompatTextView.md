---
banner: 
date_created: Tuesday, October 29th 2017, 12:08:52 am
date_updated: Saturday, March 15th 2025, 8:42:12 pm
title: AppcompatTextView
author: hacket
categories:
  - AndroidUI
category: TextView
tags: [TextView]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:27:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:53:56 晚上
image-auto-upload: true
feed: show
format: list
aliases: [AppcompatTextView 的 Autosizing]
linter-yaml-title-alias: AppcompatTextView 的 Autosizing
---

# AppcompatTextView 的 Autosizing

## 特性

### 1、Autosizing

Android8.0 有效，Android Supportv26 之上，也对 Autosizeing 提供了兼容支持，最低可以支持到 Android Level 14。Autosizeing 允许 TextView 根据其内部文本的显示大小，动态的调整其 TextSize 属性值得大小，通过此设置，开发者可以很轻松的在具有动态内容的情况下，对不同的屏幕中，文本大小进行优化。

触发 Autosizeing 重新计算 TextSize 的时机有两个：

1. TextView 中的文字增多到无法容纳的地步。
2. TextView 本身的尺寸被放大或缩小了。

> Autosizeing 的核心设计思想，就是为了让 文本 尽可能的完全显示在既定大小的 TextView 中，哪怕是修改它的文字大小。

## 使用

1. Android Api Level 26(8.0)<br />直接使用 `android:autoSizeTextType` 属性

```xml
<?xml version="1.0" encoding="utf-8"?>
<TextView
    android:layout_width="match_parent"
    android:layout_height="200dp"
    android:autoSizeTextType="uniform" />
```

2. Support 库<br />support 库用 `app:autoSizeTextType="uniform"`

## 代码设置

### 1、 Autosizeing 开关

```java
TextViewCompat.setAutoSizeTextTypeWithDefaults(mTv2, TextViewCompat.AUTO_SIZE_TEXT_TYPE_NONE); // 关闭
// 开启用这个
public static final int AUTO_SIZE_TEXT_TYPE_UNIFORM = TextView.AUTO_SIZE_TEXT_TYPE_UNIFORM;
```

### 2、Autosizeing 的粒度和范围

默认变化粒度为 1sp。<br />粒度的含义其实就是 Autosizeing 每次变动的最小单位，当然在设置粒度的同时，你还需要为其设置一个缩放的范围，最大值和最小值。这样，在 Autosizeing 生效的时候，它会在这个范围内，按照我们设定的粒度，去动态的调整文字的大小。<br />想要操作这些属性，动态编码的方式你需要调用 TextViewCompat 的 `setAutosizeingTextTypeUniformWithConfiguration()` 方法。

```java
// 参数1：TextView
// 参数2：最小值
// 参数3：变化的最大值
// 参数4：变动的粒度
// 参数5：前面设置的尺寸的单位
TextViewCompat.setAutoSizeTextTypeUniformWithConfiguration(mTv2, 10, 30, 5, TypedValue.COMPLEX_UNIT_SP);
```

xml 中设置：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
  <TextView
      android:layout_width="match_parent"
      android:layout_height="200dp"
      app:autoSizeTextType="uniform"
      app:autoSizeMinTextSize="12sp"
      app:autoSizeMaxTextSize="100sp"
      app:autoSizeStepGranularity="2sp" />
</LinearLayout>
```

### 3、指定预设尺寸范围变化，枚举值

枚举几个精准的变化值

```java
int[] presetSizes = new int[]{10, 15, 18, 20, 35, 40};
TextViewCompat.setAutoSizeTextTypeUniformWithPresetSizes(mTv2, presetSizes, TypedValue.COMPLEX_UNIT_SP);
```

xml 中使用：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
  <TextView
      android:layout_width="match_parent"
      android:layout_height="200dp"
      app:autoSizeTextType="uniform"
      app:autoSizePresetSizes="@array/autosize_text_sizes" />
</LinearLayout>

<resources>
  <array name="autosize_text_sizes">
    <item>10sp</item>
    <item>12sp</item>
    <item>20sp</item>
    <item>40sp</item>
    <item>100sp</item>
  </array>
</resources>
```

## 注意

### 1、TextView 必须限定尺寸

如果你想要使用 Autosizeing，就必须对 TextView 这个控件，限定大小，不能使用 wrap_content 来作为限定符。

用官方文档话来说，使用 wrap_content 可能出现不可预料的效果。其实这也非常好理解，如果 TextView 的尺寸不是固定的，那就不存在 TextView 重新计算尺寸的依据了，同比放大 TextView 就可以达到容纳文字的效果了。

我在实际使用过程中会发现，它会阻止放大效果。例如一个 TextView 中使用了 Autosizeing，一直增加文本内容，是可以正常缩小的，但是当你删除文本的时候，它并不会随之放大文字尺寸。

但是不确定还有没有其它的问题，这里建议按照官方文档的建议来操作，限定 TextView 的尺寸。

### 2、Autosizeing 不能作用在 EditText 中

### 3、和 singleLine 冲突

如果你想在 TextView 中，只显示一行文字，在之前你可以使用 android: singleLine 这个属性，对其标记。而如果你同事使用 Autosizeing，你会发现 AutoSizeing 就不再生效，它会在末尾显示 "…"。

所幸的是，android:singleLine 已经被标记为废弃，所以本身我们就不建议使用它，如果你想让 TextView 只显示单行文字，可以使用 android:maxLines="1" 属性，它是可以正常和 Autosizeing 兼容的
