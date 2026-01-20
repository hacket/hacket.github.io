---
banner:
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, December 1st 2025, 8:30:33 am
title: 自定义CoordinatorLayout Behavior
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
aliases: [自定义 Behavior]
linter-yaml-title-alias: 自定义 Behavior
---

# 自定义 Behavior

自定义 Behavior 的实现可以分为三个主要部分：**基础结构和构造函数**、**选择交互模式**，以及**实现关键回调方法**。

## 基础结构和实例化要求

这是创建任何自定义 Behavior 都必须遵守的架构规范，尤其是在通过 XML 静态配置时：

1. 继承正确的基类并指定泛型类型

自定义 Behavior 必须继承抽象类 `CoordinatorLayout.Behavior<V>`。

- **泛型 V**：您必须指定该 Behavior 打算控制的精确 **View 类型**。例如，如果您想控制一个 `FloatingActionButton`，则应该继承 `CoordinatorLayout.Behavior<FloatingActionButton>`。这提供了类型安全，并确保逻辑正确地应用于目标组件。

2. 提供公共构造函数（XML 强制要求）

如果您的 Behavior 需要通过 XML 布局文件中的 `app:layout_behavior` 属性进行关联（这是最常见的方法），它**必须**提供带 2 个公共构造函数：

```
public CustomBehavior(Context context, AttributeSet attrs) {
    super(context, attrs);
}
```

- **重要性**：这是 Android XML 膨胀（Inflation）机制的**强制性要求**。如果缺少此构造函数，系统在加载布局时将无法实例化您的 Behavior，从而导致运行时崩溃。

3. 布局和测量生命周期（可选，用于初始化）
在正常视图生命周期中，Behavior 可以在视图被测量和布局时进行干预：

| 方法                 | 职责       | 描述                                                                                      | 来源  |
| ------------------ | -------- | --------------------------------------------------------------------------------------- | --- |
| `onMeasureChild()` | **测量干预** | 允许 Behavior 影响或覆盖子视图的测量尺寸。                                                              |     |
| `onLayoutChild()`  | **初始布局** | 允许 Behavior 影响或覆盖子视图的初始位置。如果 Behavior 会在运行时通过偏移（Offset）操作视图位置，它应实现此方法来**可靠地重建视图的初始位置**。 |     |

## 根据交互模式选择要重写的方法

Behavior 的功能来自三个核心机制。您需要根据希望实现的效果，重写相应的方法：

### 依赖管理（Dependency Management）

**目的：** 实现一个子视图（_Child_）响应其兄弟视图（_Dependency_）的位置或状态变化（例如，FAB 响应 Snackbar 的出现）

| 方法名称                         | 职责 (Responsibility) | 实现要点                                                                                                                                   | 来源  |
| ---------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **layoutDependsOn()**        | **声明依赖关系**          | Behavior 必须判断 `child` 是否依赖于 `dependency`。如果依赖成立，**必须返回** **true**。通常策略是根据 `dependency` 的运行时类型进行精确判断（例如，是否是 `Snackbar.SnackbarLayout`）。 |     |
| **布局顺序保障**                   | **确保时序正确**          | 当 `layoutDependsOn()` 返回 `true` 时，`CoordinatorLayout` 会强制确保 **dependency** **视图总是在** **child** **视图之前完成布局**。                           |     |
| **onDependentViewChanged()** | **执行视图响应**          | 当被依赖的视图 (`dependency`) 的位置、尺寸或状态发生变化时调用。Behavior 在此执行视图转换（例如，位移、缩放）。如果视图被修改，**必须返回** **true**。                                         |     |

### 嵌套滚动（Nested Scrolling）

**目的：** 实现容器和可滚动后代之间的协作滚动，赋予父视图抢先消耗滚动事件的权力（例如，`AppBarLayout` 的折叠/展开）

| 方法名称                      | 职责 (Responsibility) | 实现要点                                                                                                        | 来源  |
| ------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- | --- |
| **onStartNestedScroll()** | **参与滚动握手**          | 当后代视图尝试开始滚动时调用。Behavior 必须返回 **true** 并指定感兴趣的滚动轴 (`nestedScrollAxes`)，否则不会收到后续的滚动事件。                        |     |
| **onNestedPreScroll()**   | **高优先级预消费**         | 在滚动子视图（例如 `RecyclerView`）消耗任何滚动距离**之前**调用。Behavior 在此方法中通过修改 `consumed` 数组来优先消耗滚动像素 (`dy`)，这是实现平滑折叠效果的关键机制。 |     |
| **onNestedScroll()**      | **低优先级后反应**         | 在滚动子视图完成其滚动后调用。Behavior 在此接收子视图**已消耗**和**未消耗**的距离，用于处理剩余距离或边界效果。                                            |     |
| **onNestedPreFling()**    | **惯性预处理**           | 允许 Behavior 在惯性滑动（Fling）发生**之前**介入，决定是否完全消耗 Fling 速度。与滚动不同，Fling 预消费不支持部分消耗。                                |     |
| **onStopNestedScroll()**  | **滚动结束**            | 滚动或 Fling 结束时调用，用于清理状态或触发如 `AppBarLayout` 自动吸附到最终位置的动画.                                                     |     |

### 触控事件拦截（Touch Interception）

**目的：** 完全接管用户手势，实现自定义拖拽或滑动逻辑（例如 `BottomSheetBehavior` 或 `SwipeDismissBehavior`）

| 方法名称                        | 职责 (Responsibility) | 实现要点                                                                                                          | 来源  |
| --------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- | --- |
| **onInterceptTouchEvent()** | **手势接管**            | 在触控事件传递给 `child` 视图之前，Behavior 有机会拦截。如果识别到自定义手势（如拖拽开始）并决定处理，**必须返回** **true**。                                |     |
| **onTouchEvent()**          | **手势处理**            | 一旦 `onInterceptTouchEvent()` 返回 `true`，后续所有 `MotionEvent` 将路由到此方法。Behavior 在此执行视图状态的实际修改（如拖拽移动、计算 alpha 渐变等）。 |     |

## 布局、测量与性能建议

除了核心交互方法，Behavior 还可以控制视图的布局和测量：

1. 布局和测量干预 (Layout and Measure)

Behavior 可以覆盖默认的布局逻辑：

- `onMeasureChild()`：允许 Behavior 在测量阶段干预并修改子视图的尺寸。
- `onLayoutChild()`：允许 Behavior 在布局阶段确定子视图的最终位置和边界。如果 Behavior 会在运行时动态改变视图位置，建议实现此方法以可靠地重建初始位置。

2. 状态保存与恢复 (State Management)

如果 Behavior 内部维护了需要跨配置更改（如旋转）保留的动态状态（例如，`BottomSheetBehavior` 的当前状态或 `AppBarLayout` 的偏移量），则需要实现：

- `onSaveInstanceState()`：用于生成可序列化的内部状态表示。
- `onRestoreInstanceState()`：用于从保存的状态中恢复 Behavior 的内部状态。

3. 性能优化最佳实践

在高频率回调（如滚动或依赖变化）中，性能至关重要：

- **避免** **requestLayout()：** 在 `onDependentViewChanged()` 或 `onNestedPreScroll()` 等方法中，应**避免**调用 `requestLayout()`，因为它会触发昂贵的测量和布局流程，可能导致性能下降。
- **使用转换属性：** 为了优化性能，应优先使用 **View.setTranslationY()** 或 `ViewCompat.offsetTopAndBottom()` 来进行视图位移。这些操作仅影响视图的绘制位置，不会触发布局重算，有助于实现流畅的动画。

## Material Design 组件的 Behavior

| Behavior 类                        | 功能实现方式                       | 关键作用                                                                                         | 来源                                 |
| --------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| **AppBarLayout.Behavior**         | 嵌套滚动 (Nested Scrolling)      | 拦截垂直滚动，并使用 `setTopAndBottomOffset()` 等内部方法来动态折叠或展开 `AppBarLayout`。                           | [[appbar_scrolling_view_behavior]] |
| **FloatingActionButton.Behavior** | 依赖管理 (Dependency Management) | 监听 `Snackbar` 的出现，并自动将 FAB 向上动画平移以避免冲突。                                                      | [[bottom_sheet_behavior]]          |
| **BottomSheetBehavior**           | 触控/手势拦截 (Touch/Gesture)      | 接管触摸事件流，管理 Bottom Sheet 在 `STATE_COLLAPSED`, `STATE_EXPANDED`, `STATE_HIDDEN` 等稳定状态之间的拖拽和转换。 |                                    |
| **SwipeDismissBehavior**          | 触控/手势拦截 (Touch/Gesture)      | 通过拦截触摸事件 (`onInterceptTouchEvent()` 和 `onTouchEvent()`)，允许任何关联的子视图通过水平滑动实现 " 滑动消除 " 手势。      |                                    |
