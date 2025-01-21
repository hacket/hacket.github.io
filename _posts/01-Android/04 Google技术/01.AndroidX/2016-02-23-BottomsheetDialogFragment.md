---
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Tuesday, January 21st 2025, 11:39:42 pm
title: BottomsheetDialogFragment
author: hacket
categories:
  - Android
category: Google
tags: [AndroidX, Google]
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [BottomsheetDialogFragment 底部弹出框]
linter-yaml-title-alias: BottomsheetDialogFragment 底部弹出框
---

# BottomsheetDialogFragment 底部弹出框

`BottomSheetDialogFragment` 继承自 AppCompatDialogFragment，官方解释为模态底部表，是 DialogFragment 的一个版本，它使用的是 `BottomSheetDialog`，而不是浮动对话框。BottomSheetDialogFragment 相对于其它对话框有着以下的优势：

```
1、拥有自己的生命周期；
2、可对整个页面进行折叠、展开和销毁；
3、可灵活使用自定义样式。
```

## BottomSheet 有两种类型

1. Persistent bottom sheet

> 通常用于显示主界面之外的额外信息，它是主界面的一部分，只不过<br />默认被隐藏了，其深度（elevation）跟主界面处于同一级别；还有一个重要特点是在 Persistent<br />bottom sheet 打开的时候，主界面仍然是可以操作的，其实 Persistent bottom sheet 不能算是一<br />个控件，因为它只是一个普通的布局在 CoordinatorLayout 这个布局之下所表现出来的特殊行为。<br />所以其使用方式跟普通的控件也很不一样，它必须在 CoordinatorLayout 中，并且是<br />CoordinatorLayout 的直接子 view

```
app:layout_behavior="@string/bottom_sheet_behavior"，定义了这个属性就相当于告
诉了CoordinatorLayout这个布局是一个bottom sheet，它的显示和交互都和普通的view
不同。@string/bottom_sheet_behavior是一个定义在支持库中的字符串，等效于
android.support.design.widget.BottomSheetBehavior
```

2. 模态 bottom sheet

> 顾名思义，模态的 bottom sheet 在打开的时候会阻止和主界面的交互，并且在视觉上会在 bottom sheet 背后加一层半透明的阴影，使得看上去深度（elevation）更深

## Bottom Sheets 具有五种状态

- STATE_COLLAPSED： Bottom Sheets 是可见的，但只显示可视（部分）高度。此状态通常是底部工作表的 " 静止位置 "。可视高度由开发人员选择，应足以表明有额外的内容，允许用户触发某个动<br />作或扩展 Bottom Sheets；
- STATE_EXPANDED： Bottom Sheets 是可见的并且它的最大高度并且不是拖拽或沉降；
- STATE_DRAGGING：用户主动向上或向下拖动 Bottom Sheets；
- STATE_SETTLING： 拖动/轻扫手势后，Bottom Sheets 将调整到特定高度。这将是可视高度，展<br />开高度或 0，以防用户操作导致底部表单隐藏；
- STATE_HIDDEN： Bottom Sheets 隐藏

## 使用

1. 添加为 CoordinatorLayout 的直接子视图
2. 通过添加以下 xml 属性来应用该行为 `app:layout_behavior="com.google.android.material.bottomsheet.BottomSheetBehavior"`
3. 设置所需的行为标志

```
app:behavior_hideable：是否可以通过拖拽隐藏底部表单。
app:behavior_peekHeight：折叠状态的窥视高度。
app:behavior_skipCollapsed：如果底部表单可隐藏，并且设置为true，则表单不会处于折
叠状态
```
