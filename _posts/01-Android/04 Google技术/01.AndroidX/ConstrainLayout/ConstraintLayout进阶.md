---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# ConstraintHelper

# Optimizer(layout_optimizationLevel)

> 当我们使用 MATCH_CONSTRAINT 时，ConstraintLayout 将对控件进行 2 次测量，ConstraintLayout在1.1中可以通过设置 layout_optimizationLevel 进行优化。

版本中添加了几个新的优化点，可加快您的布局速度。这些优化点作为一个单独的通道运行，并尝试减少布局视图所需的约束数量。<br />总的来说，它们是通过在布局中寻找常量并简化它们来运作的。<br />有一个名为`layout_optimizationLevel`的新标签，用于配置优化级别。它可以设置为以下内容：

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

v1.1.3 layout_optimizationLevel属性默认打开，默认standard<br /><https://androidstudio.googleblog.com/2018/08/constraintlayout-113.html>

# Flow (VirtualLayout)

## Flow介绍

<https://developer.android.com/reference/androidx/constraintlayout/helper/widget/Flow><br />Flow 是 VirtualLayout，Flow 可以像 `Chain`那样帮助快速横向/纵向布局`constraint_referenced_ids`里面的元素；是`ContraintHelper`的实现。<br />Flow是用于构建链的新虚拟布局，当链用完时可以缠绕到下一行甚至屏幕的另一部分。当您在一个链中布置多个项目时，这很有用，但是您不确定容器在运行时的大小。您可以使用它来根据应用程序中的动态尺寸（例如旋转时的屏幕宽度）构建布局。Flow是一种虚拟布局。在ConstraintLayout中，虚拟布局(Virtual layouts)作为virtual view group的角色参与约束和布局中，但是它们并不会作为视图添加到视图层级结构中，而是仅仅引用其它视图来辅助它们在布局系统中完成各自的布局功能<br />下面使用动画来展示Flow创建多个链将布局元素充裕地填充一整行：<br />![](https://cdn.nlark.com/yuque/0/2023/gif/694278/1688576209703-ec3e3a95-1800-4b14-b941-8ee6a444b075.gif#averageHue=%23fefefe&clientId=u90401e08-49fb-4&from=paste&id=u67adabc8&originHeight=255&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua312846b-6c02-47a0-81d5-a3147761e92&title=)

## Flow基本用法

### Flow优势

1. 减少布局的嵌套, flow和排序的view是在统一层级view, 不需要嵌套
2. 减少了排列view之间布局的相互位置依赖关系, 可以随意变换位置, 只需要更改app:constraint_referenced_ids中的顺序即可
3. 设置padding, 背景等, 和viewgroup具有相同的属性功能

> 近期发现一个问题, 当元素的宽度不是固定大小时, wrap_content的情况下, 不管是使用哪种方式,元素之间的间隔无法做到相同, 所以感觉这个属性只有在固定宽度时使用较佳

### 常用属性

#### android:orientation 方向

1. horizontal(默认)
2. vertical

#### app:flow_wrapMode 排列方式

> Flow的constraint_referenced_ids关联的控件是没有设置约束的，这一点和普通的链是不一样的，这种排列方式是Flow的默认方式none，我们可以使用app:flow_wrapMode=""属性来设置排列方式

##### 1. none（默认） 所引用的View形成一条链，水平居中，超出屏幕两侧的view不可见

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576247472-fa2d5b83-1e8f-4429-b699-fb58b083f8ad.png#averageHue=%2379a3b0&clientId=u90401e08-49fb-4&from=paste&id=u7098d1f0&originHeight=236&originWidth=651&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u72e78078-bd3f-4bf8-bd0f-bc9a9f36254&title=)<br />下面属性可用：

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

##### 2. chain 所引用的View形成一条链，超出部分会自动换行，同行的view平分宽度

根据空间的大小和元素的大小组成一条或者多条 chain（一行显示不在会显示到第二行，不会对齐） <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576279326-51a6dd41-06f7-4f54-af4e-99271765211b.png#averageHue=%2385b0bf&clientId=u90401e08-49fb-4&from=paste&id=uc9c19d86&originHeight=283&originWidth=660&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua3fdfc1e-50b7-46e8-b202-fdaeef05a54&title=)<br />![](http://note.youdao.com/yws/res/59127/E867B383E8BB40D387C7FC9043577599#id=vPm1p&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)下面属性可用：

```xml
flow_firstHorizontalStyle = "spread|spread_inside|packed"
flow_firstVerticalStyle = "spread|spread_inside|packed"
flow_firstHorizontalBias = "float"
flow_firstVerticalBias = "float"
```

##### 3. aligned 所引用的View形成一条链，但view会在同行同列

wrap chain类似，但是会对齐 <br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576293046-e67707b0-1972-413c-9018-112debeae00b.png#averageHue=%2382afbe&clientId=u90401e08-49fb-4&from=paste&id=ub3e0ed9c&originHeight=256&originWidth=664&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u73ab793e-c8a6-4b8f-94c3-9add2554091&title=)

##### 动画演示flow_wrapMode效果

![](https://cdn.nlark.com/yuque/0/2023/gif/694278/1688576298158-6a506244-21ab-4d82-844b-fe844752b6ca.gif#averageHue=%23fef9f7&clientId=u90401e08-49fb-4&from=paste&id=u7695d2c9&originHeight=336&originWidth=480&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u13094e5c-3226-48f7-bbac-4272629180f&title=)<br />当flow_wrapMode的值是chian或aligned时，我们还可以针对不同的链进行配置Style

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

当`flow_wrapMode`属性为`aligned`和`chian`时，通过`flow_maxElementsWrap`属性控制每行最大的子View数量，例如我们设置为flow_maxElementsWrap=4<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576311568-8acfc922-a69a-49d0-8f1d-cae35e0a7dfa.png#averageHue=%23c6ebf9&clientId=u90401e08-49fb-4&from=paste&id=uf56f7694&originHeight=800&originWidth=450&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u71f745a3-d5df-4694-9aca-88495be4bb9&title=)

#### gap 水平和垂直view之间的间隔

```
flow_horizontalGap = “ float “
flow_verticalGap = " float "
```

> 宽高如果写死了，又配置了minWidth/minHeight时，flow_horizontalGap和flow_verticalGap设置了相同的值，但间隔并不一样的情况

#### align 对齐约束 不同大小view的对齐方式

```
<!--  top:顶对齐、bottom:底对齐、center:中心对齐、baseline:基线对齐  -->
app:flow_verticalAlign="top｜bottom｜center｜baseline"

<!--  start:开始对齐、end:结尾对齐、center:中心对齐  -->
app:flow_horizontalAlign="start|end|center"
```

> 使用flow_verticalAlign时，要求orientation的方向是horizontal，而使用flow_horizontalAlign时，要求orientation的方向是vertical

##### 案例1：app:flow_verticalAlign="top"

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

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576336747-da99590a-0fa8-4e09-8ff2-4edf7b5031d3.png#averageHue=%23cfeef9&clientId=u90401e08-49fb-4&from=paste&height=539&id=u0c73c477&originHeight=803&originWidth=577&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9ebffc32-d99a-4ad3-a0f2-324de5494d2&title=&width=387)

##### 案例2：app:flow_verticalAlign="bottom"

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

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576349241-9375d72d-ef23-41c1-af22-0ff921b99a84.png#averageHue=%23cdeef9&clientId=u90401e08-49fb-4&from=paste&height=443&id=u521a7db9&originHeight=747&originWidth=565&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufd612b24-9af4-4743-930e-f8b8121249b&title=&width=335)

##### 案例3：app:flow_verticalAlign="center"

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

##### 案例4：app:flow_verticalAlign="baseline"

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

> 宽高不能是0dp(match constraint)；同ConstraintLayout的chains style

1. SPREAD  默认，View与View之间，View和父View之间的间隔相等
2. SPREAD_INSIDE 链两端依附在父View上，其他的View同SPREAD，间隔相等
3. PACKED 链的元素将被打包在一起居中。 孩子的水平或垂直偏差属性将影响包装元素的定位

> 应用了packed，bias默认为0.5

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

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688576388383-67456f16-9bc2-4754-8ef0-700f31b9ad34.png#averageHue=%2359ae6c&clientId=u90401e08-49fb-4&from=paste&id=uc1251f7a&originHeight=2960&originWidth=1440&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub7028f1e-b684-49cd-8fcd-235610fd2f9&title=)<br />![](http://note.youdao.com/yws/res/39002/1A27325C6C9E4DDB83E94E90AB8638F2#id=vA02J&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# ConstraintLayout动画

## 利用ConstraintSet实现动画效果

利用ConstraintSet和TransitionManager实现两个布局之间的动画效果

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

`ConstraintSet`能使我们在代码中轻松地改变控件的位置大小，再也不用LayoutParams

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

# ConstraintLayout坑

## 不在RecyclerView用约束布局中的Group

```xml
<!--加载失败后隐藏-->
<androidx.constraintlayout.widget.Group
    android:id="@+id/group_content"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:visibility="invisible"
    app:constraint_referenced_ids="iv_gift_box_gift_image,tv_gift_box_gift_name,fl_gift_price_coin_container,tv_gift_box_time_count_down,ll_gift_box_gift_tabs,ll_gift_box_gift_tabs_left,cnv_gift_box_left_count" />
```

> 容易导致不该显示的显示了，要显示的未显示；需要在多个条件都控制Group的显示隐藏

## ConstraintLayout中的组件的宽或者高都不能设置成 match_parent

```xml
android:layout_width="match_parent"
android:layout_height="match_parent"
```

组件的宽或者高都不能设置成 match_parent，如果设置了，后果就是该组件所有的约束失效。

### ConstraintLayout的某个布局显示不出来分析

我们在在ConstraintLayout中经常使用`layout_width=0dp`和`layout_height=0dp`，可能发现添加的这个子View显示不出来<br />解决：一般是由于设置了0dp，没有设置两边依赖，如设置了layout_width，那么就必须要设置left和right的依赖；设置了layout_height就必须要设置top和bottom依赖。

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

## ConstraintLayout使用chain时，但同时添加了红点如QBadgeView

ConstraintLayout使用chain时，但同时添加了红点如`QBadgeView`，导致chain失败，<br />因为这种红点view，会在当前view添加一层ViewGroup，导致chain链条关系打破，导致显示混乱

1. 去掉红点
2. 不要在链条的view上添加红点view

# MotionLayout

## MotionLayout介绍

### 使用MotionLayout限制

1. MotionLayout 最低支持到 Android 4.3(API 18)
2. MotionLayout只作用于直接子View，不支持嵌套的子View和Activity transitions
3. 必须为 MotionLayout 布局的所有直接子 View 都设置一个 Id（允许不为非直接子 View 设置 Id）

## Ref

-  [ ] 旋转木马<br /><https://github.com/faob-dev/MotionLayoutCarousel>
-  [ ] MotionLayout实现的各种动效<br /><https://github.com/rodrigomartind/MixAnimationsMotionLayout>
