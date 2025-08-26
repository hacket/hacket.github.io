---
banner: 
date_created: Thursday, March 27th 2025, 1:00:29 am
date_updated: Thursday, March 27th 2025, 1:15:57 am
title: LinearLayout
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
aliases: [LinearLayout]
linter-yaml-title-alias: LinearLayout
---

# LinearLayout

## 效果

### LinearLayout 中显示分割线

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:divider="@drawable/shape_divider"
    android:orientation="vertical"
    android:showDividers="middle">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="50dp"
        android:gravity="center_vertical"
        android:text="textview1" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="50dp"
        android:gravity="center_vertical"
        android:text="textview2" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="50dp"
        android:gravity="center_vertical"
        android:text="textview3" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="50dp"
        android:gravity="center_vertical"
        android:text="textview4" />

</LinearLayout>
```

![Uploading file...sp6j3]()
