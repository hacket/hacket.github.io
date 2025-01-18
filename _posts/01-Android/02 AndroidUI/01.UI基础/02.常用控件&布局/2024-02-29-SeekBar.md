---
date created: 星期日, 十月 20日 2024, 11:20:00 晚上
date updated: 星期一, 一月 6日 2025, 9:54:12 晚上
title: SeekBar
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [SeekBar 基本用法]
linter-yaml-title-alias: SeekBar 基本用法
---

# SeekBar 基本用法

## seekbar 设置进度条颜色

- xml 设置 seekbar 的进度条颜色<br />`android:progressDrawable="@drawable/bg_adjust_seek_bar"`
- 代码

```
seekBar.getProgressDrawable().setColorFilter(Color.WHITE, Mode.SRC_ATOP);//设置进度条颜色、样式
```

### 同一种颜色的进度条 bg_adjust_seek_bar

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@android:id/background"
        android:paddingBottom="4dp"
        android:paddingTop="4dp">
        <shape>
            <corners android:radius="50dp"/>
            <solid android:color="#efefef"/>
        </shape>
    </item>

    <item
        android:id="@android:id/progress"
        android:paddingBottom="4dp"
        android:paddingTop="4dp">
        <clip>
            <shape>
                <corners android:radius="50dp"/>
                <gradient
                    android:angle="0"
                    android:endColor="#2896F0"
                    android:startColor="#2896F0"/>
            </shape>
        </clip>
    </item>
</layer-list>
```

### 实现颜色渐变的进度条

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@android:id/background"
        android:paddingBottom="4dp"
        android:paddingTop="4dp">
        <shape>
            <corners android:radius="50dp"/>
            <solid android:color="#999999"/>
        </shape>
    </item>

    <item
        android:id="@android:id/progress"
        android:paddingBottom="4dp"
        android:paddingTop="4dp">
        <clip>
            <shape>
                <corners android:radius="50dp"/>
                <gradient
                    android:angle="0"
                    android:endColor="#C166D1"
                    android:startColor="#2896F0"/>
            </shape>
        </clip>
    </item>
</layer-list>
```

### 背景、第二进度、进度

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android"> 
    <item android:id="@android:id/background">
        <shape>
            <corners android:radius="5dip" />
            <gradient
                android:startColor="@color/gray_cc"
                android:centerColor="@color/gray_cc"
                android:centerY="0.75"
                android:endColor="@color/gray_cc"
                android:angle="270"/>
        </shape>
    </item>
    < !-- 我的没有第二背景，故第二背景图没有画 -->
    <item android:id="@android:id/secondaryProgress">
        <clip>
            <shape>
                <corners android:radius="5dip" />
                <gradient
                    android:startColor="#80ffd300"
                    android:centerColor="#80ffb600"
                    android:centerY="0.75"
                    android:endColor="#a0ffcb00"
                    android:angle="270"/>
            </shape>
        </clip>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <corners android:radius="5dip" />
                <gradient
                    android:startColor="@color/gray_cc"
                    android:centerColor="@color/gray_cc"
                    android:centerY="0.75"
                    android:endColor="@color/gray_cc"
                    android:angle="270"/>
            </shape>
        </clip>
    </item>
</layer-list>
```

## seekbar 的滑块按钮图片

- xml<br />`android:thumb="@drawable/bg_seek_bar_thumb2"`
- 代码

```
seekBar.getThumb().setColorFilter(Color.GRAY, Mode.SRC_ATOP);//设置滑块颜色、样式
```

提醒下滑块滑到 0 或者最大可能展示不完，滑块只展示一半；还有有的背景太高；所以这些需要设置一下即可：

```xml
android:maxHeight="5dp"
android:minHeight="5dp"
android:paddingLeft="10dp"
android:paddingRight="10dp"
```

上面 maxHeight 与 minHeight 可以让背景不那么高，更改值可以控制高度。<br />paddingLeft 与 paddingRight 最好是滑块的宽度一半，这样即可展示完全。

## SeekBar 粗细

`minHeight` 和 `maxHeight`   来控制 progress 的粗细

> layout_height   要设置  wrap_content   这样才能显示完成的图标
