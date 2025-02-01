---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Wednesday, January 29th 2025, 7:06:18 pm
title: ConstraintLayout进阶
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
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
aliases: [ConstraintHelper]
linter-yaml-title-alias: ConstraintHelper
---

# ConstraintHelper

# Optimizer(layout_optimizationLevel)

> 当我们使用 MATCH_CONSTRAINT 时，ConstraintLayout 将对控件进行 2 次测量，ConstraintLayout 在 1.1 中可以通过设置 layout_optimizationLevel 进行优化。

版本中添加了几个新的优化点，可加快您的布局速度。这些优化点作为一个单独的通道运行，并尝试减少布局视图所需的约束数量。<br />总的来说，它们是通过在布局中寻找常量并简化它们来运作的。<br />有一个名为 `layout_optimizationLevel` 的新标签，用于配置优化级别。它可以设置为以下内容：

1. barriers：找出屏障所在，并用简单的约束取代它们
2. direct：优化那些直接连接到固定元素的元素，例如屏幕边缘或引导线，并继续优化直接连接到它们的任何元素。
3. standard：这是包含 barriers 和 direct 的默认优化级别。
4. dimensions：目前处于实验阶段，并且可能会在某些布局上出现问题——它会通过计算维度来优化布局传递。
5. chains：目前正在实验阶段，并计算出如何布置固定尺寸的元素链。

启动优化

```xml
<android.support.constraint.ConstraintLayout 
    app:layout_optimizationLevel="standard|dimensions|chains">
```

v1.1.3 layout_optimizationLevel 属性默认打开，默认 standard<br /><https://androidstudio.googleblog.com/2018/08/constraintlayout-113.html>

# Flow (VirtualLayout)

## Flow 介绍

<https://developer.android.com/reference/androidx/constraintlayout/helper/widget/Flow><br />Flow 是 VirtualLayout，Flow 可以像 `Chain` 那样帮助快速横向/纵向布局 `constraint_referenced_ids` 里面的元素；是 `ContraintHelper` 的实现。<br />Flow 是用于构建链的新虚拟布局，当链用完时可以缠绕到下一行甚至屏幕的另一部分。当您在一个链中布置多个项目时，这很有用，但是您不确定容器在运行时的大小。您可以使用它来根据应用程序中的动态尺寸（例如旋转时的屏幕宽度）构建布局。Flow 是一种虚拟布局。在 ConstraintLayout 中，虚拟布局 (Virtual layouts) 作为 virtual view group 的角色参与约束和布局中，但是它们并不会作为视图添加到视图层级结构中，而是仅仅引用其它视图来辅助它们在布局系统中完成各自的布局功能<br />下面使用动画来展示 Flow 创建多个链将布局元素充裕地填充一整行：<br />![4buid](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/4buid.gif)

## Flow 基本用法

### Flow 优势

1. 减少布局的嵌套, flow 和排序的 view 是在统一层级 view, 不需要嵌套
2. 减少了排列 view 之间布局的相互位置依赖关系, 可以随意变换位置, 只需要更改 app:constraint_referenced_ids 中的顺序即可
3. 设置 padding, 背景等, 和 viewgroup 具有相同的属性功能

> 近期发现一个问题, 当元素的宽度不是固定大小时, wrap_content 的情况下, 不管是使用哪种方式,元素之间的间隔无法做到相同, 所以感觉这个属性只有在固定宽度时使用较佳

### 常用属性

#### android:orientation 方向

1. horizontal(默认)
2. vertical

#### app:flow_wrapMode 排列方式

> Flow 的 constraint_referenced_ids 关联的控件是没有设置约束的，这一点和普通的链是不一样的，这种排列方式是 Flow 的默认方式 none，我们可以使用 app:flow_wrapMode="" 属性来设置排列方式

##### 1. none（默认） 所引用的 View 形成一条链，水平居中，超出屏幕两侧的 view 不可见

![2awj7](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2awj7.png)<br />

下面属性可用：

```xml
flow_horizontalStyle = "spread|spread_inside|packed"
flow_verticalStyle = "spread|spread_inside|packed"
flow_horizontalBias = "float"
flow_verticalBias = "float"
flow_horizontalGap = "dimension"
flow_verticalGap = "dimension"
flow_horizontalAlign = "start|end"
flow_verticalAlign = "top|bottom|center|baseline
```

##### 2. chain 所引用的 View 形成一条链，超出部分会自动换行，同行的 view 平分宽度

根据空间的大小和元素的大小组成一条或者多条 chain（一行显示不在会显示到第二行，不会对齐） <br />![jktz1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/jktz1.png)<br />

下面属性可用：

```xml
flow_firstHorizontalStyle = "spread|spread_inside|packed"
flow_firstVerticalStyle = "spread|spread_inside|packed"
flow_firstHorizontalBias = "float"
flow_firstVerticalBias = "float"
```

##### 3. aligned 所引用的 View 形成一条链，但 view 会在同行同列

wrap chain 类似，但是会对齐 <br />

![tcfnh](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/tcfnh.png)

##### 动画演示 flow_wrapMode 效果

![vlscv](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/vlscv.gif)<br />

当 flow_wrapMode 的值是 chian 或 aligned 时，我们还可以针对不同的链进行配置 Style

```
app:flow_horizontalStyle="packed｜spread｜spread_inside"  所有水平链的配置
app:flow_verticalStyle="packed｜spread｜spread_inside"    所有垂直链的配置

app:flow_firstHorizontalStyle="packed｜spread｜spread_inside" 第一条水平链的配置，其他条不生效
app:flow_firstVerticalStyle="packed｜spread｜spread_inside"   第一条垂直链的配置，其他条不生效
app:flow_lastHorizontalStyle="packed｜spread｜spread_inside"  最后一条水平链的配置，其他条不生效 
app:flow_lastVerticalStyle="packed｜spread｜spread_inside"    最后一条垂直链的配置，其他条不生效
```

#### app:flow_maxElementsWrap 数量约束一行摆放最大元素

一行摆放最大元素，摆放不下摆到下一行

当 `flow_wrapMode` 属性为 `aligned` 和 `chian` 时，通过 `flow_maxElementsWrap` 属性控制每行最大的子 View 数量，例如我们设置为 flow_maxElementsWrap=4<br />

![p8r3b](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/p8r3b.png)

#### gap 水平和垂直 view 之间的间隔

```xml
flow_horizontalGap = “ float “
flow_verticalGap = " float "
```

> 宽高如果写死了，又配置了 minWidth/minHeight 时，flow_horizontalGap 和 flow_verticalGap 设置了相同的值，但间隔并不一样的情况

#### align 对齐约束 不同大小 view 的对齐方式

```
<!--  top:顶对齐、bottom:底对齐、center:中心对齐、baseline:基线对齐  -->
app:flow_verticalAlign="top｜bottom｜center｜baseline"

<!--  start:开始对齐、end:结尾对齐、center:中心对齐  -->
app:flow_horizontalAlign="start|end|center"
```

> 使用 flow_verticalAlign 时，要求 orientation 的方向是 horizontal，而使用 flow_horizontalAlign 时，要求 orientation 的方向是 vertical

##### 案例 1：app:flow_verticalAlign="top"

```xml
<androidx.constraintlayout.helper.widget.Flow
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="horizontal"
        app:constraint_referenced_ids="A,B,C,D,E,F,G,H,I,J"
        app:flow_verticalAlign="top"
        app:flow_wrapMode="chain"
        app:layout_constraintTop_toTopOf="parent" />
```

![wz94n](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/wz94n.png)

##### 案例 2：app:flow_verticalAlign="bottom"

```xml
<androidx.constraintlayout.helper.widget.Flow
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="horizontal"
        app:constraint_referenced_ids="A,B,C,D,E,F,G,H,I,J"
        app:flow_verticalAlign="bottom"
        app:flow_wrapMode="chain"
        app:layout_constraintTop_toTopOf="parent" />
```

![lu77p](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/lu77p.png)

##### 案例 3：app:flow_verticalAlign="center"

```xml
<androidx.constraintlayout.helper.widget.Flow
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="horizontal"
        app:constraint_referenced_ids="A,B,C,D,E,F,G,H,I,J"
        app:flow_verticalAlign="center"
        app:flow_wrapMode="chain"
        app:layout_constraintTop_toTopOf="parent" />
```

##### 案例 4：app:flow_verticalAlign="baseline"

```xml
<androidx.constraintlayout.helper.widget.Flow
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="horizontal"
        app:constraint_referenced_ids="A,B,C,D,E,F,G,H,I,J"
        app:flow_verticalAlign="baseline"
        app:flow_wrapMode="chain"
        app:layout_constraintTop_toTopOf="parent" />
```

#### Styles(spread/spread_inside/packed)

> 宽高不能是 0dp(match constraint)；同 ConstraintLayout 的 chains style

1. SPREAD  默认，View 与 View 之间，View 和父 View 之间的间隔相等
2. SPREAD_INSIDE 链两端依附在父 View 上，其他的 View 同 SPREAD，间隔相等
3. PACKED 链的元素将被打包在一起居中。 孩子的水平或垂直偏差属性将影响包装元素的定位

> 应用了 packed，bias 默认为 0.5

1. app:flow_horizontalStyle=""<br />横向元素样式
2. app:flow_verticalStyle=""<br />纵向元素样式
3. app:flow_firstHorizontalStyle=""
4. app:flow_firstVerticalStyle=""
5. app:flow_lastHorizontalStyle=""
6. app:flow_lastVerticalStyle=""

#### Bias

1. flow_horizontalBias = "float"
2. flow_verticalBias = "float"
3. flow_firstHorizontalBias = "float"
4. flow_firstVerticalBias = "float"

## 案例：计算器布局

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/root"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <androidx.constraintlayout.helper.widget.Flow
        android:id="@+id/flow"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:background="#FFC107"
        android:orientation="horizontal"
        app:constraint_referenced_ids="tv_num_7,tv_num_8,tv_num_9,tv_num_4,tv_num_5,tv_num_6,tv_num_1,tv_num_2,tv_num_3,tv_num_0,tv_operator_div,tv_dot,tv_operator_times"
        app:flow_horizontalGap="5dp"
        app:flow_maxElementsWrap="3"
        app:flow_verticalGap="5dp"
        app:flow_wrapMode="chain"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/KR" />

    <TextView
        android:id="@+id/tv_num_7"
        style="@style/text_view_style"
        android:layout_width="0dp"
        android:tag="flow_num_7"
        android:text="7" />

    <TextView
        android:id="@+id/tv_num_8"
        style="@style/text_view_style"
        android:layout_width="0dp"
        android:tag="flow_num_8"
        android:text="8" />

    <TextView
        android:id="@+id/tv_num_9"
        style="@style/text_view_style"
        android:tag="flow_num_9"
        android:text="9" />

    <TextView
        android:id="@+id/tv_num_4"
        style="@style/text_view_style"
        android:tag="flow_num_4"
        android:text="4" />

    <TextView
        android:id="@+id/tv_num_5"
        style="@style/text_view_style"
        android:tag="flow_num_5"
        android:text="5" />

    <TextView
        android:id="@+id/tv_num_6"
        style="@style/text_view_style"
        android:tag="flow_num_6"
        android:text="6" />


    <TextView
        android:id="@+id/tv_num_1"
        style="@style/text_view_style"
        android:tag="flow_num_1"
        android:text="1" />

    <TextView
        android:id="@+id/tv_num_2"
        style="@style/text_view_style"
        android:tag="flow_num_2"
        android:text="2" />

    <TextView
        android:id="@+id/tv_num_3"
        style="@style/text_view_style"
        android:tag="flow_num_3"
        android:text="3" />

    <TextView
        android:id="@+id/tv_num_0"
        style="@style/text_view_style"
        android:tag="flow_num_0"
        android:text="0" />

    <TextView
        android:id="@+id/tv_operator_div"
        style="@style/text_view_style"
        android:tag="flow_num_10"
        android:text="/" />

    <TextView
        android:id="@+id/tv_operator_times"
        style="@style/text_view_style"
        android:tag="flow_num_11"
        android:text="*" />

    <TextView
        android:id="@+id/tv_dot"
        style="@style/text_view_style"
        android:tag="flow_num_12"
        android:text="." />

    <TextView
        android:id="@+id/KE"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:background="#00BCD4"
        android:gravity="center"
        android:text="Compute"
        android:textColor="@android:color/white"
        android:textSize="24sp"
        android:visibility="gone"
        app:layout_constraintBottom_toBottomOf="@+id/tv_operator_times"
        app:layout_constraintEnd_toEndOf="@+id/tv_dot"
        app:layout_constraintHorizontal_bias="1.0"
        app:layout_constraintStart_toStartOf="@+id/tv_operator_div"
        app:layout_constraintTop_toTopOf="@+id/tv_operator_times" />

    <TextView
        android:id="@+id/KR"
        android:layout_width="0dp"
        android:layout_height="100dp"
        android:background="@color/gray"
        android:gravity="end|center_vertical"
        android:paddingEnd="16dp"
        android:text="0"
        android:textColor="@android:color/white"
        android:textSize="58sp"
        app:layout_constraintBottom_toTopOf="@+id/flow"
        app:layout_constraintEnd_toEndOf="@+id/flow"
        app:layout_constraintStart_toStartOf="@+id/flow"
        app:layout_constraintTop_toBottomOf="@id/ll_toolbar" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

代码：

```kotlin
class ConstraintFlowDemo1Activity : AppCompatActivity() {

    //    val CHAIN_SPREAD = 0
    //    val CHAIN_SPREAD_INSIDE = 1
    //    val CHAIN_PACKED = 2
    var horizontalStyle = Flow.CHAIN_SPREAD
    var verticalStyle = Flow.CHAIN_SPREAD
    var first_horizontalStyle = Flow.CHAIN_SPREAD
    var first_verticalStyle = Flow.CHAIN_SPREAD

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_constraint_flow_demo1)

        flow_width_height.setOnClickListener {
            for (index in 0..12) {
                val view = root.findViewWithTag<TextView>("flow_num_$index")
                val params = view.layoutParams
                params.width = 40F.dp2px()
                params.height = 40F.dp2px()
                view.layoutParams = params
            }
        }
        flow_wrap_match_constaint.setOnClickListener {
            for (index in 0..12) {
                val view = root.findViewWithTag<TextView>("flow_num_$index")
                val params = view.layoutParams
                params.width = 0
                params.height = 0
                view.layoutParams = params
            }
        }

        flow_wrap_none.setOnClickListener {
            flow.setWrapMode(Flow.WRAP_NONE)
        }
        flow_wrap_chain.setOnClickListener {
            flow.setWrapMode(Flow.WRAP_CHAIN)
        }
        flow_wrap_aligned.setOnClickListener {
            flow.setWrapMode(Flow.WRAP_ALIGNED)
        }


        flow_horizontalGap.setOnClickListener {
            flow.setHorizontalGap(30.dp2px())
        }
        flow_verticalGap.setOnClickListener {
            flow.setVerticalGap(30.dp2px())
        }
        flow_maxElementsWrap3.setOnClickListener {
            flow.setMaxElementsWrap(3)
        }
        flow_maxElementsWrap4.setOnClickListener {
            flow.setMaxElementsWrap(4)
        }
        flow_maxElementsWrap5.setOnClickListener {
            flow.setMaxElementsWrap(5)
        }

        flow_horizontalStyle.setOnClickListener {
            horizontalStyle++
            when (horizontalStyle % 3) {
                Flow.CHAIN_SPREAD -> {
                    flow.setHorizontalStyle(Flow.CHAIN_SPREAD)
                    toast("setHorizontalStyle为CHAIN_SPREAD")
                }
                Flow.CHAIN_SPREAD_INSIDE -> {
                    flow.setHorizontalStyle(Flow.CHAIN_SPREAD_INSIDE)
                    toast("setHorizontalStyle为CHAIN_SPREAD_INSIDE")
                }
                Flow.CHAIN_PACKED -> {
                    flow.setHorizontalStyle(Flow.CHAIN_PACKED)
                    toast("setHorizontalStyle为CHAIN_PACKED")
                }
            }
        }
        flow_verticalStyle.setOnClickListener {
            verticalStyle++
            when (verticalStyle % 3) {
                Flow.CHAIN_SPREAD -> {
                    flow.setVerticalStyle(Flow.CHAIN_SPREAD)
                    toast("setVerticalStyle为CHAIN_SPREAD")
                }
                Flow.CHAIN_SPREAD_INSIDE -> {
                    flow.setVerticalStyle(Flow.CHAIN_SPREAD_INSIDE)
                    toast("setVerticalStyle为CHAIN_SPREAD_INSIDE")
                }
                Flow.CHAIN_PACKED -> {
                    flow.setVerticalStyle(Flow.CHAIN_PACKED)
                    toast("setVerticalStyle为CHAIN_PACKED")
                }
            }
        }
        flow_firstHorizontalStyle.setOnClickListener {
            first_horizontalStyle++
            when (first_horizontalStyle % 3) {
                Flow.CHAIN_SPREAD -> {
                    flow.setFirstHorizontalStyle(Flow.CHAIN_SPREAD)
                    toast("setFirstHorizontalStyle为CHAIN_SPREAD")
                }
                Flow.CHAIN_SPREAD_INSIDE -> {
                    flow.setFirstHorizontalStyle(Flow.CHAIN_SPREAD_INSIDE)
                    toast("setFirstHorizontalStyle为CHAIN_SPREAD_INSIDE")
                }
                Flow.CHAIN_PACKED -> {
                    flow.setFirstHorizontalStyle(Flow.CHAIN_PACKED)
                    toast("setFirstHorizontalStyle为CHAIN_PACKED")
                }
            }
        }
        flow_firstVerticalStyle.setOnClickListener {
            first_verticalStyle++
            when (first_verticalStyle % 3) {
                Flow.CHAIN_SPREAD -> {
                    flow.setFirstVerticalStyle(Flow.CHAIN_SPREAD)
                    toast("setFirstVerticalStyle为CHAIN_SPREAD")
                }
                Flow.CHAIN_SPREAD_INSIDE -> {
                    flow.setFirstVerticalStyle(Flow.CHAIN_SPREAD_INSIDE)
                    toast("setFirstVerticalStyle为CHAIN_SPREAD_INSIDE")
                }
                Flow.CHAIN_PACKED -> {
                    flow.setFirstVerticalStyle(Flow.CHAIN_PACKED)
                    toast("setFirstVerticalStyle为CHAIN_PACKED")
                }
            }
        }

        var horizontalBias = 0.0F
        flow_horizontalBias.setOnClickListener {
            horizontalBias += 0.1F
            if (horizontalBias > 1.0F) {
                horizontalBias = 0F
            }
            flow.setHorizontalBias(horizontalBias)
            toast("setHorizontalBias $horizontalBias")
        }
        var verticalBias = 0.0F
        flow_verticalBias.setOnClickListener {
            verticalBias += 0.1F
            if (verticalBias > 1.0F) {
                verticalBias = 0F
            }
            flow.setVerticalBias(verticalBias)
            toast("setVerticalBias $verticalBias")
        }
        var first_verticalBias = 0.0F
        flow_firstVerticalBias.setOnClickListener {
            first_verticalBias += 0.1F
            if (first_verticalBias > 1.0F) {
                first_verticalBias = 0F
            }
            flow.setFirstVerticalBias(first_verticalBias)
            toast("setFirstVerticalBias $first_verticalBias")
        }
        var first_horizontalBias = 0.0F
        flow_firstHorizontalBias.setOnClickListener {
            first_horizontalBias += 0.1F
            if (first_horizontalBias > 1.0F) {
                first_horizontalBias = 0F
            }
            flow.setFirstHorizontalBias(first_horizontalBias)
            toast("setFirstHorizontalBias $first_horizontalBias")
        }
    }
}
```

![3th8i](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/3th8i.png)

# ConstraintLayout 动画

## 利用 ConstraintSet 实现动画效果

利用 ConstraintSet 和 TransitionManager 实现两个布局之间的动画效果

```kotlin
class ConstraintSet动画应用 : AppCompatActivity(), View.OnClickListener {
    var mConstraintSet1: ConstraintSet? = null
    var mConstraintSet2: ConstraintSet? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_constraint_set_animation)

        mConstraintSet1 = ConstraintSet()
        mConstraintSet2 = ConstraintSet()
        mConstraintSet1?.clone(constraint_layout)
        mConstraintSet2?.clone(this, R.layout.activity_constraint_set_animation_after)

        btn_apply.setOnClickListener(this)
        btn_reset.setOnClickListener(this)
    }
    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btn_apply -> {
                TransitionManager.beginDelayedTransition(constraint_layout)
                mConstraintSet2?.applyTo(constraint_layout)
            }
            R.id.btn_reset -> {
                TransitionManager.beginDelayedTransition(constraint_layout)
                mConstraintSet1?.applyTo(constraint_layout)
            }
        }
    }
}
```

`ConstraintSet` 能使我们在代码中轻松地改变控件的位置大小，再也不用 LayoutParams

```kotlin
private fun change() {
    // 首先，要声明一下ConstraintSet对象
    var constraintSet = ConstraintSet()
    // 然后clone，会有四个clone方法,可以任选其一
    // constraintSet.clone(ConstraintLayout constraintLayout);
    // constraintSet.clone(ConstraintSet set);
    // constraintSet.clone(Context context, int constraintLayoutId);
    // constraintSet.clone(Constraints constraints);
    constraintSet.clone(constraint_layout)

    // 设置flow1控件的顶边与flow2的底边对齐,且之间margin值是50px:
    constraintSet.connect(flow1.id, ConstraintSet.TOP, flow2.id, ConstraintSet.BOTTOM, 50)
    // 设置flow2水平剧中于parent
    constraintSet.centerVertically(R.id.flow2, ConstraintSet.PARENT_ID)
    // 设置flow1的高度为300px
    constraintSet.constrainHeight(R.id.flow1, 300)
    // 最后,apply一下使设置生效
    constraintSet.applyTo(constraint_layout)
}
```

# ConstraintLayout 坑

## 不在 RecyclerView 用约束布局中的 Group

```xml
<!--加载失败后隐藏-->
<androidx.constraintlayout.widget.Group
    android:id="@+id/group_content"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:visibility="invisible"
    app:constraint_referenced_ids="iv_gift_box_gift_image,tv_gift_box_gift_name,fl_gift_price_coin_container,tv_gift_box_time_count_down,ll_gift_box_gift_tabs,ll_gift_box_gift_tabs_left,cnv_gift_box_left_count" />
```

> 容易导致不该显示的显示了，要显示的未显示；需要在多个条件都控制 Group 的显示隐藏

## ConstraintLayout 中的组件的宽或者高都不能设置成 match_parent

```xml
android:layout_width="match_parent"
android:layout_height="match_parent"
```

组件的宽或者高都不能设置成 match_parent，如果设置了，后果就是该组件所有的约束失效。

### ConstraintLayout 的某个布局显示不出来分析

我们在在 ConstraintLayout 中经常使用 `layout_width=0dp` 和 `layout_height=0dp`，可能发现添加的这个子 View 显示不出来<br />解决：一般是由于设置了 0dp，没有设置两边依赖，如设置了 layout_width，那么就必须要设置 left 和 right 的依赖；设置了 layout_height 就必须要设置 top 和 bottom 依赖。

```xml
<android.support.constraint.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

    <TextView
            android:id="@+id/tv_name"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="姓名："
            app:layout_constraintBottom_toBottomOf="@+id/et_name"
            app:layout_constraintTop_toTopOf="@+id/et_name"/>

    <TextView
            android:id="@+id/tv_contact"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="我的联系方式："
            app:layout_constraintBottom_toBottomOf="@+id/et_contact"
            app:layout_constraintTop_toTopOf="@+id/et_contact"/>

    <EditText
            android:id="@+id/et_name"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:hint="请输入姓名"
            app:layout_constraintLeft_toLeftOf="@+id/barrier"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"/>

    <EditText
            android:id="@+id/et_contact"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:hint="请输入联系方式"
            app:layout_constraintLeft_toLeftOf="@+id/barrier"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@+id/et_name"/>

    <android.support.constraint.Barrier
            android:id="@+id/barrier"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            app:barrierDirection="right"
            app:constraint_referenced_ids="tv_name,tv_contact"/>

    <android.support.constraint.ConstraintLayout
            app:layout_constraintTop_toBottomOf="@id/et_contact"
            app:layout_constraintLeft_toLeftOf="@id/et_contact"
            app:layout_constraintRight_toRightOf="parent"
            android:layout_width="0dp"
            android:layout_height="50dp">

        <EditText
                android:id="@+id/et_contact_info"
                android:layout_width="0dp"
                android:layout_height="0dp"
                android:hint="输入您的备注"
                android:text="这是测试用的"
                android:textColorHint="@color/main_color"
                app:layout_constraintTop_toTopOf="parent"
                app:layout_constraintLeft_toLeftOf="parent"
                app:layout_constraintRight_toRightOf="parent"
                app:layout_constraintBottom_toBottomOf="parent"/>
    </android.support.constraint.ConstraintLayout>

</android.support.constraint.ConstraintLayout>
```

## ConstraintLayout 使用 chain 时，但同时添加了红点如 QBadgeView

ConstraintLayout 使用 chain 时，但同时添加了红点如 `QBadgeView`，导致 chain 失败，<br />

因为这种红点 view，会在当前 view 添加一层 ViewGroup，导致 chain 链条关系打破，导致显示混乱

1. 去掉红点
2. 不要在链条的 view 上添加红点 view

# MotionLayout

## MotionLayout 介绍

### 使用 MotionLayout 限制

1. MotionLayout 最低支持到 Android 4.3(API 18)
2. MotionLayout 只作用于直接子 View，不支持嵌套的子 View 和 Activity transitions
3. 必须为 MotionLayout 布局的所有直接子 View 都设置一个 Id（允许不为非直接子 View 设置 Id）

## Ref

- [x] 旋转木马 <https://github.com/faob-dev/MotionLayoutCarousel>
- [x] MotionLayout 实现的各种动效 <https://github.com/rodrigomartind/MixAnimationsMotionLayout>
