---
date created: 星期三, 三月 13日 2024, 8:38:00 晚上
date updated: 星期四, 一月 2日 2025, 9:02:26 晚上
title: Android5.0适配(API21)
dg-publish: true
image-auto-upload: true
feed: show
format: list
tags: []
aliases: [Android5（API21）]
linter-yaml-title-alias: Android5（API21）
---

# Android5（API21）

## ViewOutlineProvider

### 什么是 ViewOutlineProvider？

ViewOutlineProvider 可以用它来把 View 裁剪成一些特定 (圆形、矩形、圆角矩形) 的形状。

ViewOutlineProvider(轮廓提供者的使用步骤)

1. 自定义轮廓提供者，并重写 getOutline 方法来提取轮廓；
2. 通过 view.setClipToOutline(true) 方法来开启组件的裁剪功能；
3. 通过 view.setOutlineProvider(new MyViewOutlineProvider() 方法设置自定义的轮廓提供者来完成裁剪。

### ViewOutlineProvider 功能

#### setOval 圆形

```kotlin
/**
 * 轮廓提供者的使用步骤
 * 1. 自定义轮廓提供者，并且重写getOutline方法来提取轮廓
 * 2. 通过view.setClipToOutline(true)方法开启组建的裁剪功能
 * 3. 通过.setOutlineProvider(new MyViewOutlineProvider())方法设置自定义的轮廓提供者完成裁剪
 */
@RequiresApi(Build.VERSION_CODES.LOLLIPOP)
fun setOvalClick(view: View) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        val viewOutlineProvider =
            @RequiresApi(Build.VERSION_CODES.LOLLIPOP) object : ViewOutlineProvider() {
                override fun getOutline(view: View?, outline: Outline?) {
                    //裁剪成一个圆形
                    outline?.setOval(0, 0, view!!.width, view.height)
                }
            }
        imageview.outlineProvider = viewOutlineProvider
    }
    imageview.clipToOutline = !imageview.clipToOutline
}
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687708028120-e5669f59-584a-4e28-9575-39e32217dfe2.png)

#### setRoundRect 圆角

```java
view.setOutlineProvider(new ViewOutlineProvider() {
    @Override
    public void getOutline(View view, Outline outline) {
        outline.setRoundRect(0, 0, view.getWidth(), view.getHeight(), 30);
    }
});
view.setClipToOutline(true);
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687708037445-bd79fa50-5111-4f2c-87af-b156426f3d5f.png)

#### setRect 裁剪

```kotlin
private var mViewRect: Rect? = null
fun setRectClick(view: View) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        val viewOutlineProvider =
            @RequiresApi(Build.VERSION_CODES.LOLLIPOP) object : ViewOutlineProvider() {
                override fun getOutline(view: View?, outline: Outline?) {
                    if (mViewRect != null) {
                        outline?.setRect(mViewRect!!)
                    }
                }
            }
        imageview.outlineProvider = viewOutlineProvider
        imageview.clipToOutline = !imageview.clipToOutline

        mViewRect = Rect(
            imageview.width / 6,
            imageview.height / 8,
            imageview.width * 5 / 6,
            imageview.height * 7 / 8
        )
        imageview.invalidateOutline() // API21
    }
}
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687708047914-5aa39fec-d4a7-4a5d-ba1a-cb568be803e4.png)

#### setPath 设置投影

```java
view.setElevation(5);
view.setOutlineProvider(new ViewOutlineProvider() {
    @Override
    public void getOutline(View view, Outline outline) {
      	//你可以用 Path 指定任何的形状，前提是凸多边形
        //这里设置投影的位置从右下角开始，投影形状是矩形
        Path path = new Path();
        path.moveTo(view.getWidth(), view.getHeight());
        path.lineTo(view.getWidth(), view.getHeight() * 2);
        path.lineTo(view.getWidth() * 2, view.getHeight() * 2);
        path.lineTo(view.getWidth() * 2, view.getHeight());
        path.close();
        outline.setConvexPath(path); // Android30过期了，用setPath
    }
});
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1687708059208-d956f75e-61db-493c-a66c-49a9321d0f56.png)

#### 封装

```kotlin
class RoundedCornersOutlineProvider(  
    val radius: Float? = null,  
    private val topLeft: Float? = null,  
    private val topRight: Float? = null,  
    private val bottomLeft: Float? = null,  
    private val bottomRight: Float? = null,  
) : ViewOutlineProvider() {  
  
    private val topCorners = topLeft != null && topLeft == topRight  
    private val rightCorners = topRight != null && topRight == bottomRight  
    private val bottomCorners = bottomLeft != null && bottomLeft == bottomRight  
    private val leftCorners = topLeft != null && topLeft == bottomLeft  
    private val topLeftCorner = topLeft != null  
    private val topRightCorner = topRight != null  
    private val bottomRightCorner = bottomRight != null  
    private val bottomLeftCorner = bottomLeft != null  
  
    override fun getOutline(view: View, outline: Outline) {  
        val left = 0  
        val top = 0  
        val right = view.width  
        val bottom = view.height  
  
        if (radius != null) {  
            val cornerRadius = radius //.typedValue(resources).toFloat()  
            outline.setRoundRect(left, top, right, bottom, cornerRadius)  
        } else {  
            val cornerRadius = topLeft ?: topRight ?: bottomLeft ?: bottomRight ?: 0F  
  
            when {  
                topCorners -> outline.setRoundRect(left, top, right, bottom + cornerRadius.toInt(), cornerRadius)  
                bottomCorners -> outline.setRoundRect(left, top - cornerRadius.toInt(), right, bottom, cornerRadius)  
                leftCorners -> outline.setRoundRect(left, top, right + cornerRadius.toInt(), bottom, cornerRadius)  
                rightCorners -> outline.setRoundRect(left - cornerRadius.toInt(), top, right, bottom, cornerRadius)  
                topLeftCorner -> outline.setRoundRect(  
                    left, top, right + cornerRadius.toInt(), bottom + cornerRadius.toInt(), cornerRadius  
                )  
                bottomLeftCorner -> outline.setRoundRect(  
                    left, top - cornerRadius.toInt(), right + cornerRadius.toInt(), bottom, cornerRadius  
                )  
                topRightCorner -> outline.setRoundRect(  
                    left - cornerRadius.toInt(), top, right, bottom + cornerRadius.toInt(), cornerRadius  
                )  
                bottomRightCorner -> outline.setRoundRect(  
                    left - cornerRadius.toInt(), top - cornerRadius.toInt(), right, bottom, cornerRadius  
                )  
            }  
        }  
    }  
}
```

使用：

```kotlin
cardView.outlineProvider = if (DirectionHelper.isRtl()) {  
    RoundedCornersOutlineProvider(  
        corner,  
        rightTopCorner,  
        leftTopCorner,  
        rightBottomCorner,  
        leftBottomCorner  
    )  
} else {  
    RoundedCornersOutlineProvider(  
        corner,  
        leftTopCorner,  
        rightTopCorner,  
        leftBottomCorner,  
        rightBottomCorner  
    )  
}
```

## Android5.1 及以下 onVisibilityChanged 访问成员变量空指针

### 问题描述

问题现象：Android5.1 会出现 npe，高版本不会

问题代码：

```java
public class GiftBox extends FrameLayout implements ViewLifecycleOwner {
    private ViewLifecycleOwnerDelegate mViewLifecycleOwnerDelegate = new ViewLifecycleOwnerDelegate(this);
    @Override
    protected void onVisibilityChanged(View changedView, int visibility) {
        super.onVisibilityChanged(changedView, visibility);
        mViewLifecycleOwnerDelegate.onVisibilityChanged(visibility);
    }
}
```

问题堆栈:

```
java.lang.RuntimeException:Unable to start activity ComponentInfo{qsbk.app.remix/qsbk.app.live.ui.LivePushActivity}: android.view.InflateException: Binary XML file line #33: Error inflating class qsbk.app.live.widget.gift.LiveGiftBox
2 android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2675)
3 ......
4 Caused by:
5 java.lang.NullPointerException:Attempt to invoke virtual method 'void qsbk.app.core.ui.ViewLifecycleOwnerDelegate.onVisibilityChanged(int)' on a null object reference
6 qsbk.app.live.widget.gift.GiftBox.onVisibilityChanged(GiftBox.java:418)
7 android.view.View.dispatchVisibilityChanged(View.java:8895)
8 android.view.ViewGroup.dispatchVisibilityChanged(ViewGroup.java:1178)
9 android.view.View.setFlags(View.java:9990)
10 android.view.View.<init>(View.java:4231)
11 android.view.ViewGroup.<init>(ViewGroup.java:529)
12 android.widget.FrameLayout.<init>(FrameLayout.java:133)
13 android.widget.FrameLayout.<init>(FrameLayout.java:129)
14 qsbk.app.live.widget.gift.GiftBox.<init>(GiftBox.java:110)
15 qsbk.app.live.widget.gift.GiftBox.<init>(GiftBox.java:106)
16 qsbk.app.live.widget.gift.LiveGiftBox.<init>(LiveGiftBox.java:89)
17 java.lang.reflect.Constructor.newInstance(Native Method)
18 java.lang.reflect.Constructor.newInstance(Constructor.java:288)
19 android.view.LayoutInflater.createView(LayoutInflater.java:607)
20 android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:743)
21 android.view.LayoutInflater.rInflate(LayoutInflater.java:806)
22 android.view.LayoutInflater.rInflate(LayoutInflater.java:809)
23 android.view.LayoutInflater.inflate(LayoutInflater.java:504)
24 android.view.LayoutInflater.inflate(LayoutInflater.java:414)
25 android.view.LayoutInflater.inflate(LayoutInflater.java:365)
26 com.android.internal.policy.impl.PhoneWindow.setContentView(PhoneWindow.java:435)
27 android.app.Activity.setContentView(Activity.java:2203)
28 qsbk.app.core.ui.base.BaseActivity.onCreate(BaseActivity.java:59)
29 qsbk.app.live.ui.StreamMediaActivity.onCreate(StreamMediaActivity.java:35)
30 qsbk.app.live.ui.LiveBaseActivity.onCreate(LiveBaseActivity.java:433)
31 qsbk.app.live.ui.LivePushActivity.onCreate(LivePushActivity.java:167)
32 android.app.Activity.performCreate(Activity.java:6251)
33 android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1112)
34 android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2622)
35 android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2766)
36 android.app.ActivityThread.access$1000(ActivityThread.java:197)
37 android.app.ActivityThread$H.handleMessage(ActivityThread.java:1611)
38 android.os.Handler.dispatchMessage(Handler.java:111)
39 android.os.Looper.loop(Looper.java:224)
40 android.app.ActivityThread.main(ActivityThread.java:5958)
41 java.lang.reflect.Method.invoke(Native Method)
42 java.lang.reflect.Method.invoke(Method.java:372)
43 com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1113)
44 com.android.internal.os.ZygoteInit.main(ZygoteInit.java:879)
```

### 问题复现

1. 一个对象实例化过程为：初始化成员变量 ->调用 init 函数 ->调用构造函数
2. 一个子类对象实例化过程为：父类初始化成员变量 ->父类 init 函数 ->父类构造函数→子类初始化成员变量 ->子类调用 init 函数 ->子类调用构造函数

现在复现问题：

```kotlin
abstract class Parent {
    var field: String = getField22()
    init {
        println("Parent init---")
    }
    constructor() {
        println("Parent constructor---")
        method1()
    }
    private fun getField22(): String {
        println("Parent field init---")
        return "hacket-Parent"
    }
    abstract fun method1()
}

class Child : Parent {
    private var str = "nihao hacket."
    var field2: String = getField232()
    init {
        println("--->>> Child init---")
    }
    constructor() {
        println("--->>> Child constructor---")
    }
    private fun getField232(): String {
        println("--->>> Child field init---")
        return "hacket-Child"
    }
    override fun method1() {
        println("--->>> Child method1 str=$str")
        str.toUpperCase()
    }
}

fun main() {
    Child()
}
```

结果：

```
Parent field init---
Parent init---
Parent constructor---
--->>> Child method1 str=null
Exception in thread "main" kotlin.TypeCastException: null cannot be cast to non-null type java.lang.String
	at me.hacket.hello.Child.method1(Test2.kt:43)
	at me.hacket.hello.Parent.<init>(Test2.kt:12)
	at me.hacket.hello.Child.<init>(Test2.kt:33)
	at me.hacket.hello.Test2Kt.main(Test2.kt:48)
	at me.hacket.hello.Test2Kt.main(Test2.kt)
```

原因：父类构造方法调用了子类需要重写的方法，子类在这方法调用了成员变量，而此时子类还没有成员变量初始化，就会 NPE<br>结论：避免在父类的成员变量、构造方法、init 方法中调用子类需要重写的方法；如果不可避免，需要避免子类在该重写的方法中调用成员变量，因为此时子类的成员变量还未初始化，可能导致不可预测的结果

### onVisibilityChanged 源码追溯

看 Android5.1.1

```java
// View Android5.1.1_r38 https://cs.android.com/android/platform/superproject/+/android-5.1.1_r38:frameworks/base/core/java/android/view/View.java;bpv=0;bpt=1
public View(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
    this(context);
    // ...
    if (viewFlagMasks != 0) {
        setFlags(viewFlagValues, viewFlagMasks);
    }
    // ...
}
void setFlags(int flags, int mask) {
    if ((changed & VISIBILITY_MASK) != 0) {
        // ...
        dispatchVisibilityChanged(this, newVisibility);
        // ...
    }
}
protected void dispatchVisibilityChanged(@NonNull View changedView,
        @Visibility int visibility) {
    onVisibilityChanged(changedView, visibility);
}
```

在构造方法中，调用 setFlags，然后在 setFlags 调用 dispatchVisibilityChanged，所以就会出现上诉问题。

现在看 Android6.0.1

```java
// View Android6.0.1_r67 https://cs.android.com/android/platform/superproject/+/android-6.0.1_r67:frameworks/base/core/java/android/view/View.java;l=10646;bpv=0;bpt=0
void setFlags(int flags, int mask) {
    if ((changed & VISIBILITY_MASK) != 0) {
        // ...
        if (mAttachInfo != null) {
            dispatchVisibilityChanged(this, newVisibility);
            notifySubtreeAccessibilityStateChangedIfNeeded();
        }
    }
}
void dispatchAttachedToWindow(AttachInfo info, int visibility) {
    // Send onVisibilityChanged directly instead of dispatchVisibilityChanged.
    // As all views in the subtree will already receive dispatchAttachedToWindow
    // traversing the subtree again here is not desired.
    onVisibilityChanged(this, visibility);
}
```

在 setFlags 回调 onVisibilityChanged 之前会判断 mAttachInfo 是否为空，而 mAttachInfo 赋值的时机是该 View 被添加到窗口，即绘制第一帧时，且赋值后会回调 onAttachedToWindow，在 dispatchAttachedToWindow 才会回调 onVisibilityChanged。

可见在 6.0，谷歌官方已经修复了这个可能导致开发者使用时崩溃的设计不合理的问题：不应该在构造方法中调用一个可被重写的方法。

### 问题解决

1. 未 attach 的不执行逻辑

```kotlin
override fun onVisibilityChanged(changedView: View, visibility: Int) {
    super.onVisibilityChanged(changedView, visibility)
    if (!isAttachedToWindow) {
        return
    }
    ...
}
```

2. 判空处理

```java
public class GiftBox extends FrameLayout implements ViewLifecycleOwner {
    private ViewLifecycleOwnerDelegate mViewLifecycleOwnerDelegate;
    private ViewLifecycleOwnerDelegate getViewLifecycleOwnerDelegate() {
        if (mViewLifecycleOwnerDelegate == null) {
            mViewLifecycleOwnerDelegate = new ViewLifecycleOwnerDelegate(this);
        }
        return mViewLifecycleOwnerDelegate;
    }
    @Override
    protected void onVisibilityChanged(View changedView, int visibility) {
        super.onVisibilityChanged(changedView, visibility);
        getViewLifecycleOwnerDelegate().onVisibilityChanged(visibility);
    }
}
```
