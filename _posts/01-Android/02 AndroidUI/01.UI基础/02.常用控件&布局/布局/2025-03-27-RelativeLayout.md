---
banner: 
date_created: Thursday, March 27th 2025, 1:00:29 am
date_updated: Thursday, March 27th 2025, 1:05:18 am
title: RelativeLayout
author: hacket
categories:
  - AndroidUI
category: 布局
tags: [布局]
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
aliases: [RelativeLayout]
linter-yaml-title-alias: RelativeLayout
---

# RelativeLayout

## 效果

### RelativeLayout 左右靠齐,不重叠

#### 示例 1：左边固定，右边依赖

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/tv_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentStart="true"
        android:layout_centerVertical="true"
        android:background="#f00"
        android:text="Left Text"
        android:textColor="#fff"
        android:textSize="16sp" />

    <!--  多嵌套一层LinearLayout, 是为了让右侧TextView宽度自适应，否则是撑满右侧的-->
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentEnd="true"
        android:layout_centerVertical="true"
        android:layout_toEndOf="@id/tv_title"
        android:background="#f0f"
        android:gravity="end">

        <TextView
            android:id="@+id/tv_right"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:background="#00f"
            android:ellipsize="end"
            android:maxLines="1"
            android:text="Right Text Right Text Right Text Right Text Right Text"
            android:textColor="#fff"
            android:textSize="16sp" />
    </LinearLayout>

</RelativeLayout>
```

效果：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503270103777.png)

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503270102040.png)

#### 示例 2：右边固定，左边依赖

```xml
<RelativeLayout
	android:layout_width="match_parent"
	android:layout_height="wrap_content"
	android:layout_marginTop="8dp"
	android:layout_marginBottom="8dp">

	<TextView
		android:id="@+id/tv_risk_source_time"
		android:layout_width="wrap_content"
		android:layout_height="wrap_content"
		android:layout_alignParentEnd="true"
		android:layout_centerVertical="true"
		android:maxLines="1"
		android:paddingTop="1dp"
		android:textColor="#FF8C8C8C"
		android:textSize="12sp"
		tools:text="汇财汇资讯 · 2022-08-08" />

<!--多嵌套一层Layout,是为了子控件宽度自适应-->
	<LinearLayout
		android:layout_width="wrap_content"
		android:layout_height="wrap_content"
		android:layout_alignParentStart="true"
		android:layout_marginEnd="6dp"
		android:layout_toStartOf="@id/tv_risk_source_time">

		<TextView
			android:id="@+id/tv_risk_company"
			android:layout_width="wrap_content"
			android:layout_height="wrap_content"
			android:background="@drawable/shape_bg_r1_fff5f9fd"
			android:ellipsize="end"
			android:maxLines="1"
			android:paddingStart="6dp"
			android:paddingTop="2dp"
			android:paddingEnd="6dp"
			android:paddingBottom="2dp"
			android:textColor="#FF1482F0"
			android:textSize="12sp"
			tools:text="122插上的擦拭成大事的擦飒飒的插上的擦拭超大上档次茶水单擦上档次" />

	</LinearLayout>

</RelativeLayout>
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503270103694.png)
