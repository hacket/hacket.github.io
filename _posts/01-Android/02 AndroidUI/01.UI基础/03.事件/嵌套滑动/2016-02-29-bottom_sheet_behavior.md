---
banner:
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, December 1st 2025, 8:39:33 am
title: bottom_sheet_behavior
author: hacket
categories:
  - AndroidUI
category: 事件
tags: [嵌套滑动]
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
aliases: ["@string/bottom_sheet_behavior"]
linter-yaml-title-alias: "@string/bottom_sheet_behavior"
---

# @string/bottom_sheet_behavior

**BottomSheetBehavior** 是 Google Material Design 库中提供的一个标准 `CoordinatorLayout.Behavior` 实现，专门用于创建和管理**底部抽屉（Bottom Sheet）** 这一 UI 模式

## BottomSheetBehavior 的作用 (Purpose)

`BottomSheetBehavior` 的核心作用是作为一个**交互行为插件**，附加到 `CoordinatorLayout` 的子视图上，使其具备用户可拖拽、多状态转换的能力。它将复杂的拖拽、滑动、结算（settling）逻辑从视图本身中解耦出来，并将控制权委托给 Behavior。

要使用此 Behavior，目标视图（可以控制任何 `View` 类型，如 `LinearLayout` 或其他容器）必须是 `CoordinatorLayout` 的直接子视图，并通过 XML 属性关联：`app:layout_behavior="@string/bottom_sheet_behavior"`

## BottomSheetBehavior 能实现的效果 (Effects and Capabilities)

`BottomSheetBehavior` 的主要功能是管理底部抽屉在其**多个稳定状态**之间的转换，以及响应用户的拖拽手势

### 多状态转换 (Multi-State Transitions)

`BottomSheetBehavior` 定义并管理视图可以在以下几种稳定状态之间切换：

| 状态常量                    | 状态描述 (State Description)                                                              | 触发机制                                      | 来源  |
| ----------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------- | --- |
| **STATE_EXPANDED**      | **完全展开**：底部抽屉完全张开，通常填充屏幕大部分空间。                                                        | 可通过用户拖拽或调用 `setState(STATE_EXPANDED)` 达到。 |     |
| **STATE_HALF_EXPANDED** | **半展开**：底部抽屉达到半高状态。仅当 `setFitToContents(false)` 时可用。                                  | 高度由 `setHalfExpandedRatio()` 定义的比例决定。     |     |
| **STATE_COLLAPSED**     | **折叠/收起**：底部抽屉仅在屏幕底部显示一个小的 " 窥视 " 高度（Peek Height）。                                    | 窥视高度可通过 `setPeekHeight()` 设置。             |     |
| **STATE_HIDDEN**        | **隐藏**：底部抽屉完全从屏幕上滑出，不再可见。                                                             | 只有当 `setHideable(true)` 允许时才能达到此状态。       |     |
| **动态状态**                | 除了上述稳定状态外，Behavior 还管理 `STATE_DRAGGING`（用户正在拖拽）和 `STATE_SETTLING`（视图正在惯性滑动或动画结算到位）状态。 |                                           |     |

### 手势控制与交互 (Gesture Handling)

`BottomSheetBehavior` 属于手势处理型 Behavior，它利用了 `CoordinatorLayout` 的**触控事件拦截**机制：

- **事件接管：** 它通过重写 `onInterceptTouchEvent()` 方法，在触摸事件到达子视图之前介入，如果识别出拖拽或滑动等手势，它会返回 `true` 来**劫持**事件流。
- **手势处理：** 一旦接管，所有后续的 `MotionEvent` 都会发送给 `onTouchEvent()`，Behavior 在这里执行实际的视图位移操作、速度跟踪和物理逻辑，从而实现多状态之间的平滑拖拽转换。

### 可配置的交互选项 (Configurable Interactions)

开发者可以通过设置 `BottomSheetBehavior` 的属性，定制底部抽屉的行为：

- **拖拽性 (Draggability):** 可以通过 `setDraggable(boolean draggable)` 设置是否允许用户通过拖拽来展开/收缩底部抽屉。
- **内容适配 (Fit to Contents):** `setFitToContents(boolean fitToContents)` 决定了展开状态的高度是完全由内容高度决定，还是分为两个阶段（半展开和全高）。
- **隐藏性 (Hideability):** `setHideable(boolean hideable)` 决定了用户是否可以将抽屉完全向下滑动隐藏。
- **跳过折叠状态 (Skip Collapsed):** `setSkipCollapsed(boolean skipCollapsed)` 允许在从完全展开向隐藏过渡时，跳过折叠状态（`STATE_COLLAPSED`）。
- **回调监听：** 可以通过添加 `BottomSheetBehavior.BottomSheetCallback` 监听器，在底部抽屉状态变化或滑动偏移（slide offset）改变时接收通知。

## 应用类型 (Types of Application)

根据用途，底部抽屉可以分为两种类型：

1. **持久化底部抽屉 (Persistent Bottom Sheets):** 在应用内显示内容，通常通过在 `CoordinatorLayout` 内放置一个设置了 `bottom_sheet_behavior` 的 `NestedScrollView` 或 `RecyclerView` 来创建。
2. **模态底部抽屉 (Modal Sheets):** 用于显示菜单或简单对话框，通常通过继承 `BottomSheetDialogFragment` 来实现。

通过这些配置和底层手势控制，`BottomSheetBehavior` 可以实现复杂的 UI 效果，例如像 Google 地图应用中那样，底部面板在用户滚动时通过多个阶段（例如展开、半展开、折叠）进行平滑过渡和状态管理。
