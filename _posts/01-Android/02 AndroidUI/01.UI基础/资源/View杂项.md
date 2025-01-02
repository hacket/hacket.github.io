---
date created: 2024-10-30 11:44
tags:
  - '#FF4336'
  - '#9727BO'
  - '#673AB7'
date updated: 2024-12-24 00:29
dg-publish: true
---

# AttachInfo

## AttachInfo是什么？

当View attach到window时，给view的一些信息，都封装在AttachInfo；这个信息是用来在窗口处理中用的，Android的窗口系统就是用过AttachInfo来判断View的所属窗口的

View.AttachInfo 里面的信息，就是View和Window之间的信息。每一个被添加到窗口上的View我们都会看到有一个AttachInfo；同一个ViewRootImpl下的View的AttachInfo都是同一个实例，在ViewRootImpl会进行分发，在measure/layout前

## AttachInfo源码

```
// View.AttachInfo Android29
/**
 * A set of information given to a view when it is attached to its parent
 * window.
 */
final static class AttachInfo {
    interface Callbacks {
        void playSoundEffect(int effectId);
        boolean performHapticFeedback(int effectId, boolean always);
    }
    final IWindowSession mSession;

    final IWindow mWindow;

    final IBinder mWindowToken;

    Display mDisplay;

    final Callbacks mRootCallbacks;
    
    /**
     * The top view of the hierarchy.
     */
    View mRootView;
    
    boolean mHardwareAccelerated;
    boolean mHardwareAccelerationRequested;
    ThreadedRenderer mThreadedRenderer;
    List<RenderNode> mPendingAnimatingRenderNodes;
    
    final ViewTreeObserver mTreeObserver;
    
    Canvas mCanvas;

    /**
     * The view root impl.
     */
    final ViewRootImpl mViewRootImpl;
    
    final Handler mHandler;
    
    final Matrix mTmpMatrix = new Matrix();
    // ...
    AttachInfo(IWindowSession session, IWindow window, Display display,
            ViewRootImpl viewRootImpl, Handler handler, Callbacks effectPlayer,
            Context context) {
        mSession = session;
        mWindow = window;
        mWindowToken = window.asBinder();
        mDisplay = display;
        mViewRootImpl = viewRootImpl;
        mHandler = handler;
        mRootCallbacks = effectPlayer;
        mTreeObserver = new ViewTreeObserver(context);
    }
}
```

### AttachInfo成员变量

- mRootCallbacks AttachInfo.Callback
- mRootView View树最顶层的View，一般是DecorView
- mHardwareAccelerated 是否开启硬件加速
- mHandler ViewRootHandler
- mViewRootImpl ViewRootImpl
- ThreadedRenderer mThreadedRenderer;

#### ThreadedRenderer mThreadedRenderer

硬件加速的render thread，在ViewRootImpl#enableHardwareAcceleration创建

```java
private void enableHardwareAcceleration(WindowManager.LayoutParams attrs) {
    if (hardwareAccelerated) {
        mAttachInfo.mThreadedRenderer = ThreadedRenderer.create(mContext, translucent, attrs.getTitle().toString());
        // ...
    }
    // ...
}
```

### CallBack

- void playSoundEffect(int effectId) 这个用于播放按键声音，参数是这个点击事件的类型；如果想改成不同的声音，在自定义的View上，重写View#playSoundEffect方法
- boolean performHapticFeedback(int effectId, boolean always) 触感反馈，需要用户在系统打开触感反馈选项，参数可以看HapticFeedbackConstants这个类

> 把参数`HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING`就可以忽略全局设置；参数`HapticFeedbackConstants.FLAG_IGNORE_VIEW_SETTING`就可以忽略我们在View里面设置的`android:hapticFeedbackEnabled`

### InvalidateInfo

InvalidateInfo用于刷新UI，当我们刷新UI的时候，会生成一个新的 InvalidateInfo对象，然后根据这个来刷新UI

### AttachInfo何时创建？

在ViewRootImpl创建时，就创建了

```java
// ViewRootImpl Android29
public class ViewRootImpl {
    final IWindowSession mWindowSession;
    final W mWindow;
    final ViewRootHandler mHandler = new ViewRootHandler();
    
    final View.AttachInfo mAttachInfo;
    public ViewRootImpl(Context context, Display display) {
        mWindowSession = WindowManagerGlobal.getWindowSession();
        mWindow = new W(this);
        mAttachInfo = new View.AttachInfo(mWindowSession, mWindow, display, this, mHandler, this,
                    context);
    }
}
```

### 何时分发给view？

在第一次ViewRootImpl#performTraversals时，分发给view

```java
// ViewRootImpl Android29
public class ViewRootImpl {
    private void performTraversals() {
        final View host = mView;
        if (mFirst) {
            host.dispatchAttachedToWindow(mAttachInfo, 0);
            mAttachInfo.mTreeObserver.dispatchOnWindowAttachedChange(true);
            dispatchApplyInsets(host);
        }
    }
}
```

这里的mView是DecorView，DecorView是个FrameLayout，最终走的是ViewGroup的dispatchAttachedToWindow

```java
// ViewGroup Android29
void dispatchAttachedToWindow(AttachInfo info, int visibility) {
    mGroupFlags |= FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;
    super.dispatchAttachedToWindow(info, visibility);
    mGroupFlags &= ~FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW;

    final int count = mChildrenCount;
    final View[] children = mChildren;
    for (int i = 0; i < count; i++) {
        final View child = children[i];
        child.dispatchAttachedToWindow(info,
                combineVisibility(visibility, child.getVisibility()));
    }
    final int transientCount = mTransientIndices == null ? 0 : mTransientIndices.size();
    for (int i = 0; i < transientCount; ++i) {
        View view = mTransientViews.get(i);
        view.dispatchAttachedToWindow(info,
                combineVisibility(visibility, view.getVisibility()));
    }
}
```

在ViewGroup#dispatchAttachedToWindow，先调用的View#dispatchAttachedToWindow，然后遍历所有子view#dispatchAttachedToWindow，现在我们看看看View#dispatchAttachedToWindow：

```java
// ViewGroup Android29
void dispatchAttachedToWindow(AttachInfo info, int visibility) {
    mAttachInfo = info; // 保存AttachInfo
    mWindowAttachCount++;
    // ...
    onAttachedToWindow();
    // ...
    onVisibilityChanged(this, visibility);
}
```

View#dispatchAttachedToWindow，保存AttachInfo；view依赖window的数量加1；调用onAttachedToWindow；调用onVisibilityChanged

### AttachInfo赋值

- mRootView赋值，在ViewRootImpl#setView，实际调用是WindowManagerGlobal#addView

```java
// ViewRootImpl Android29
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
    if (mView == null) {
       mView = view;
       mAttachInfo.mRootView = view;
    }
}
```

- 硬件加速

```java
// ViewRootImpl Android29
private void enableHardwareAcceleration(WindowManager.LayoutParams attrs) {
    mAttachInfo.mHardwareAccelerated = false;
    mAttachInfo.mHardwareAccelerationRequested = false;
    // Don't enable hardware acceleration when the application is in compatibility mode
    if (mTranslator != null) return;
    
    final boolean hardwareAccelerated = (attrs.flags & WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED) != 0;
    if (hardwareAccelerated) {
        if (!ThreadedRenderer.isAvailable()) {
            return;
        }
        final boolean fakeHwAccelerated = (attrs.privateFlags &
                WindowManager.LayoutParams.PRIVATE_FLAG_FAKE_HARDWARE_ACCELERATED) != 0;
        final boolean forceHwAccelerated = (attrs.privateFlags &
                WindowManager.LayoutParams.PRIVATE_FLAG_FORCE_HARDWARE_ACCELERATED) != 0;
        if (fakeHwAccelerated) {
            mAttachInfo.mHardwareAccelerationRequested = true;
        } else if (!ThreadedRenderer.sRendererDisabled
                || (ThreadedRenderer.sSystemRendererDisabled && forceHwAccelerated)) {
            if (mAttachInfo.mThreadedRenderer != null) {
                mAttachInfo.mThreadedRenderer.destroy();
            }

            final Rect insets = attrs.surfaceInsets;
            final boolean hasSurfaceInsets = insets.left != 0 || insets.right != 0
                    || insets.top != 0 || insets.bottom != 0;
            final boolean translucent = attrs.format != PixelFormat.OPAQUE || hasSurfaceInsets;
            final boolean wideGamut =
                    mContext.getResources().getConfiguration().isScreenWideColorGamut()
                    && attrs.getColorMode() == ActivityInfo.COLOR_MODE_WIDE_COLOR_GAMUT;

            mAttachInfo.mThreadedRenderer = ThreadedRenderer.create(mContext, translucent,
                    attrs.getTitle().toString());
            mAttachInfo.mThreadedRenderer.setWideGamut(wideGamut);
            updateForceDarkMode();
            if (mAttachInfo.mThreadedRenderer != null) {
                mAttachInfo.mHardwareAccelerated =
                        mAttachInfo.mHardwareAccelerationRequested = true;
            }
        }
    }   
}
```

> 读取WindowManager.LayoutParams.flags，看是否包含`WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED`判断是否开启硬件加速；硬件加速的flags（FLAG_HARDWARE_ACCELERATED）默认根据清单文件的application和activity节点的hardwareAccelerated；硬件加速的flags也可通过Window#setFlags来赋值

- mHandler ViewRootHandler，在ViewRootImpl构造方法赋值
- mViewRootImpl ViewRootImpl，在ViewRootImpl构造方法赋值

### View中的AttachInfo

- View是否attach到Window了

```java
// View Android29
public boolean isAttachedToWindow() {
    return mAttachInfo != null;
}
```

- 判断是否开启了硬件加速

```java
// View Android29
public boolean isHardwareAccelerated() {
    return mAttachInfo != null && mAttachInfo.mHardwareAccelerated;
}
```

- 获取Handler， 如果attach了View#post也是通过该Handler#post

```java
// View Android29
public Handler getHandler() {
    final AttachInfo attachInfo = mAttachInfo;
    if (attachInfo != null) {
        return attachInfo.mHandler;
    }
    return null;
}
```

- 获取ViewRootImpl

```java
// View Android29
public ViewRootImpl getViewRootImpl() {
    if (mAttachInfo != null) {
        return mAttachInfo.mViewRootImpl;
    }
    return null;
}
```

- 获取ThreadedRenderer hide

```java
// View Android29
// @hide
public ThreadedRenderer getThreadedRenderer() {
    return mAttachInfo != null ? mAttachInfo.mThreadedRenderer : null;
}
```

- 获取Window

```java
// View Android29
protected IWindow getWindow() {
    return mAttachInfo != null ? mAttachInfo.mWindow : null;
}
```

# Matrix

Matrix是一个矩阵，主要功能是坐标映射，数值转换。

## Matrix基本原理

Matrix 是一个矩阵，最根本的作用就是坐标转换，下面我们就看看几种常见变换的原理:

> 我们所用到的变换均属于仿射变换，仿射变换是 线性变换(缩放，旋转，错切) 和 平移变换(平移) 的复合

基本变换有4种: 平移(translate)、缩放(scale)、旋转(rotate) 和 错切(skew)。<br />四种变换都是由哪些参数控制的。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688142158175-698165c1-3978-4ef9-9ff6-81f840e337fa.png#averageHue=%23f4edc5&clientId=ue43ba475-2713-4&from=paste&height=314&id=uc1e6edb9&originHeight=471&originWidth=670&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=124227&status=done&style=none&taskId=u82690862-80f8-449a-8178-d6428c2c9a6&title=&width=446.6666666666667)<br />![](http://note.youdao.com/yws/res/51045/AC0946C1969841F89F24E4B35E83EB6E#id=PPpNm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688142163760-ce4a2d73-702d-49c5-bb0a-689894d6cd24.png#averageHue=%23f0ede8&clientId=ue43ba475-2713-4&from=paste&height=226&id=u0e753cff&originHeight=339&originWidth=623&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=108214&status=done&style=none&taskId=ucdfeb32d-fa59-4881-8fdb-55b2b38bb02&title=&width=415.3333333333333)<br />可以看到最后三个参数是控制透视的，这三个参数主要在3D效果中运用，通常为(0, 0, 1)<br />Matrix源码定义：

```java
public class Matrix {

    public static final int MSCALE_X = 0;  
    public static final int MSKEW_X  = 1; 
    public static final int MTRANS_X = 2; 
    public static final int MSKEW_Y  = 3; 
    public static final int MSCALE_Y = 4; 
    public static final int MTRANS_Y = 5; 
    public static final int MPERSP_0 = 6; 
    public static final int MPERSP_1 = 7; 
    public static final int MPERSP_2 = 8; 
}
```

## Ref

- [ ] 安卓自定义View进阶-Matrix原理<br /><https://www.gcssloop.com/customview/Matrix_Basic>

<https://blog.51cto.com/zensheno/513652>

# 自定义ViewGroup中child绘制顺序

1. 重写isChildrenDrawingOrderEnabled方法返回true，表示开启自定义绘制顺序
2. .重写getChildDrawingOrder方法，根据自己实际需求返回View的顺序。由于新添加的View先绘制，所以我们需要倒序返回

```kotlin
class CustomOrderDrawChildFrameLayout @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : FrameLayout(context, attrs) {

    override fun isChildrenDrawingOrderEnabled(): Boolean {
        return true
    }

    override fun getChildDrawingOrder(childCount: Int, i: Int): Int {
        return childCount - i - 1 // 倒序
    }
}
```

## Ref

- [x] 自定义ViewGroup中child绘制顺序<br /><https://blog.csdn.net/ZYJWR/article/details/108164788>

# getDimension()，getDimensionPixelOffset()，getDimensionPixelSize()的区别

- float getDimension(int id)  --真实的尺寸

是基于当前DisplayMetrics进行转换，获取指定资源id对应的尺寸

- int getDimensionPixelOffset(int id) --取整

与getDimension()功能类似，不同的是将结果转换为int，并且偏移转换是直接截断小数位，即取整（其实就是把float强制转化为int，注意不是四舍五入哦）

- int getDimensionPixelSize(int id)  --四舍五入

与getDimension()功能类似，不同的是将结果转换为int，并且小数部分四舍五入。

简单粗暴的解释就是：<br />这三个函数返回的都是绝对尺寸，而不是相对尺寸（dp\sp等）。<br />如果getDimension()返回结果是20.5f，<br />getDimensionPixelOffset()返回结果取整就是20<br />getDimensionPixelSize()返回结果四舍五入就是21。

# View 类的四个构造函数

```
public View(Context context) {}
public View(Context context, AttributeSet attrs) {}
public View(Context context, AttributeSet attrs, int defStyleAttr) {}
public View(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
```

## 4个构造函数

### 构造方法 View(Context context)  代码new对象

在代码中创建一个 View 的时候使用

### 构造方法 View(Context context,[@Nullable ](/Nullable) AttributeSet attrs) xml创建对象

> 第二个参数AttributeSet attrs就代表了在XML中为TextView声明的属性集，我们可以利用它解析出声明的属性值，例如android:text和android:textSize。

在 xml 中定义了 View 然后在代码中使用这个 View 的时候，这个 View 就是利用这个构造方法生成的。View 的属性值来自 AttributeSet 的值

### 构造方法 View(Context context,[@Nullable ](/Nullable) AttributeSet attrs,int defStyleAttr) 全局Theme

这个构造方法就是提供了默认的 defStyleAttr用于指定基本的属性。也就是允许 View 有自己基础的风格<br />例如Button会默认提供`com.android.internal.R.attr.buttonStyle`

```java
public Button(Context context, AttributeSet attrs) {
    this(context, attrs, com.android.internal.R.attr.buttonStyle);
}
```

可以通过Theme全局控制控件的样式，其中的原理就是使用三个参数的构造函数

三个参数构造函数的使用方式有点特别，一般是二个参数的构造函数中传入一个Theme中的属性

```java
public TextView(Context context, @Nullable AttributeSet attrs) {
    this(context, attrs, com.android.internal.R.attr.textViewStyle);
}

public TextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    this(context, attrs, defStyleAttr, 0);
}
```

可以看到，TextView两个参数的构造函数调用了三个参数的构造函数，而第三个参数使用的值就是Theme中的`com.android.internal.R.attr.textViewStyle`属性值。

如果我们想覆盖Theme中的com.android.internal.R.attr.textViewStyle，就需要自定义这个属性的值，代码如下：

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
    <!--定义TextView使用的属性-->
    <item name="android:textViewStyle">@style/MyTextViewStyle</item>
</style>

<!--自定义TextView的颜色-->
<style name="MyTextViewStyle" parent="Widget.AppCompat.TextView">
    <item name="android:textColor">@color/colorAccent</item>
</style>
```

### 构造方法 View(Context context ,[@Nullable ](/Nullable) AttributeSet attrs,int defStyleAttr,int defStyleRes)  自定义style

Theme是全局控制样式的，但是时候我们只想为某几个TextView单独定义样式，那就得使用四个参数的构造函数。

四个参数构造函数的使用方式，一般是在三个参数的构造函数中调用，并传入自定义Style。

首先，在styles.xml中声明一个TextView使用的Style

```xml
<style name="CustomTextViewStyle" parent="Widget.AppCompat.TextView" >
    <item name="android:textColor">@color/colorPrimaryDark</item>
</style>
```

## 属性值的覆盖规则

既然有这么多地方能控制属性值，那么就有个有限顺序。其实可以从四个参数的`View#obtainStyledAttributes()`方法中看到这个规则

```
第一个参数AttributeSet set指的是XML中声明的属性集。

第三个参数int defStyleAttr指的是Theme中的控制控件的属性。

第四个参数int defStyleRes指的是自定义的Style。
```

> 获取的优先规则就是第一个参数，第三个参数，第四个参数。

如果在XML给控件使用style属性呢？它的优先级是介于第一个参数和第三个参数之间。

```
1. XML中属性
2. XML中style属性
3. Theme中属性
4. 构造函数自定义Style
```

# Android布局中的tools属性

<https://developer.android.com/studio/write/tool-attributes><br />tools可以覆盖android的所有标准属性，将android:换成tools:即可。<br />在运行的时候tools:本身是被忽略的，不会被带进apk中，不用我们手动删除。

## tool属性使用

添加名称空间

```xml

xmlns:tools="http://schemas.android.com/tools"
```

## 常见属性

### Error handling attributes

#### 0、tools:parentTag

android studio2.2新加了这个属性可以指定`<merge>`标签的布局类型，用于预览merge的布局，在自定义组合布局中非常实用。

```xml

<?xml version="1.0" encoding="utf-8"?>

<merge

        xmlns:android="http://schemas.android.com/apk/res/android"

        xmlns:tools="http://schemas.android.com/tools"

        tools:parentTag="me.hacket.assistant.samples.ui.声波view.SoundRecordView"

        android:layout_width="match_parent"

        android:layout_height="wrap_content">

</merge>
```

#### 1、tools:ignore

用于lint。

压制lint警告，通过逗号区分，写lint id；或者all压制所有

```xml

<string name="show_all_apps" tools:ignore="MissingTranslation">All</string>
```

#### 2、tools:targetApi

用于lint。

指定该View显示的目标api，功能同`@TargetApi`注解。

```xml

<GridLayout xmlns:android="http://schemas.android.com/apk/res/android"

    xmlns:tools="http://schemas.android.com/tools"

    tools:targetApi="14" >
```

#### 3、tools:locale

用于resource。

用于指定resource的locale语言。

```xml

<resources xmlns:tools="http://schemas.android.com/tools"

    tools:locale="es">
```

### Design-time view attributes

#### 1、tools: instead of android

用于view上。

如：`tools:text`，`tools:visibility`

#### 2、tools:context

用于布局root标签上。

指定该布局所关联的Activity，通过该属性，可以快速的创建如onClick方法对应的Activity。

#### 3、RecyclerView/ListView相关

- tools:itemCount 指定RecyclerView预览的item条目数量

```xml

<android.support.v7.widget.RecyclerView

    android:id="@+id/recyclerView"

    android:layout_width="match_parent"

    android:layout_height="match_parent"

    tools:itemCount="3"/>
```

- tools:listitem item布局预览
- tools:listheader item header预览
- tools:listfooter item footer预览

```xml

<com.qiushibaike.inews.widget.RecyclerListView

        android:layout_width="match_parent"

        android:layout_height="match_parent"

        tools:listheader="@layout/item_footer"

        tools:listfooter="@layout/item_footer"

        tools:listitem="@layout/item_article_one_image"

        tools:itemCount="2"

        android:id="@+id/rv_recyclerView_category_list"/>
```

#### 4、tools:layout

作用于`<fragment>`标签，预览fragment布局

```xml

<fragment android:name="com.example.master.ItemListFragment"

    tools:layout="@layout/list_content" />
```

#### 5、tools:showIn

作用于布局root标签，添加父布局预览。用于将该布局作为`<include>`时，在父布局的预览

```xml

<TextView xmlns:android="http://schemas.android.com/apk/res/android"

    xmlns:tools="http://schemas.android.com/tools"

    android:text="@string/hello_world"

    android:layout_width="wrap_content"

    android:layout_height="wrap_content"

    tools:showIn="@layout/activity_main" />
```

#### 6、tools:openDrawer

作用于DrawerLayout，让DrawerLayout打开一个方向。

可以传递start,end,left,right

#### 7、"@tools:sample/*"资源

具体参考：<https://developer.android.com/studio/write/tool-attributes#toolssample_resources>

Attribute value	Description of placeholder data<br />@tools:sample/full_names	Full names that are randomly generated from the combination of@tools:sample/first_names and @tools:sample/last_names.<br />@tools:sample/first_names	Common first names.<br />@tools:sample/last_names	Common last names.<br />@tools:sample/cities	Names of cities from across the world.<br />@tools:sample/us_zipcodes	Randomly generated US zipcodes.<br />@tools:sample/us_phones	Randomly generated phone numbers with the following format: (800) 555-xxxx.<br />@tools:sample/lorem	Placeholder text that is derived from Latin.<br />@tools:sample/date/day_of_week	Randomized dates and times for the specified format.<br />@tools:sample/date/ddmmyy<br />@tools:sample/date/mmddyy<br />@tools:sample/date/hhmm<br />@tools:sample/date/hhmmss<br />@tools:sample/avatars	Vector drawables that you can use as profile avatars.<br />@tools:sample/backgrounds/scenic	Images that you can use as backgrounds.

### Resource shrinking attributes

#### 1、tools:shrinkMode

适用对象：。

指定构建的时候是使用safe mode还是strict mode。safe mode保留所有直接引用的资源和可能动态使用的资源，比如Resources.getIdentifier()方式调用的资源。strict mode只保留直接引用的资源。默认的安全模式是shrinkMode="safe"。

建立一个`res/raw/keep.xml`文件，在 tools:keep 属性中指定每个要保留的资源，在tools:discard属性中指定每个要舍弃的资源。这两个属性都接受逗号分隔的资源名称列表。您可以使用星号字符作为通配符

```xml

<?xml version="1.0" encoding="utf-8"?>

<resources xmlns:tools="http://schemas.android.com/tools"

    tools:keep="@layout/used_1,@layout/used_2,@layout/*_3" />
```

#### 2、tools:keep

适用对象：标签。这个属性能够保留特定的资源，比如Resources.getIdentifier())动态使用的资源。用法是可以创建res/raw/keep.xml文件，内容如下：

```xml

<?xml version="1.0" encoding="utf-8"?>

<resources xmlns:tools="http://schemas.android.com/tools"    

    tools:keep="@layout/used_1,@layout/used_2,@layout/*_3" />
```

#### 3、tools:discard

适用对象：标签。有些资源可能被引用但是又对app没有影响，不能直接删除这些资源，那么这个属性可以移除这些资源；或者Gradle插件错误地推断这些资源是被引用的，那么也可以使用这个属性。用法如下：

```xml

<?xml version="1.0" encoding="utf-8"?>

<resources xmlns:tools="http://schemas.android.com/tools"

    tools:discard="@layout/unused_1" />
```

## sample data

需求：不想要在资源目录中加上很多的预览资源, 如图片, 文本等, 他们仅仅在预览的时候有用, 打包时我并不需要将它们也打包进 APK，这时候就要用到`sample data`。

从 Android Studio 3.0 开始, 我们就能够使用 Android Studio 提供的预定义数据, 或者自行创建一个 `Sample data`的目录, 然后放入一些假的数据以供预览使用.

### 预定义数据

Android Studio 3.0 开始提供了一系列的预定义数据, 我们可以在 tools:text 属性使用 `@tools/data/`:

```xml
tools:text="@tools:sample/last_names"
```

除了 text 类型的, 预定义数据还包括:

| 属性值                                | 占位数据描述                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `@tools:sample/full_names`         | 随机生成的 `@tools:sample/first_names`<br /> and `@tools:sample/last_names`<br /> 的组合名称 |
| `@tools:sample/first_names`        | 常用的名                                                                               |
| `@tools:sample/last_names`         | 常用的姓                                                                               |
| `@tools:sample/cities`             | 世界范围内城市的名字                                                                         |
| `@tools:sample/us_zipcodes`        | 随机生成的🇺🇸邮政编码                                                                      |
| `@tools:sample/us_phones`          | 随机生成的🇺🇸☎️号码, 符合下面的格式: (800) 555-xxxx                                             |
| `@tools:sample/lore`               | 起源于拉丁文的占位文字                                                                        |
| `@tools:sample/date/day_of_week`   | 随机的特定格式的日期和时间                                                                      |
| `@tools:sample/date/ddmmyy`        |                                                                                    |
| `@tools:sample/date/mmddyy`        |                                                                                    |
| `@tools:sample/date/hhmm`          | `@tools:sample/date/hhmmss`                                                        |
| `@tools:sample/avatars`            | 可以用于人物头像的 vector drawables                                                         |
| `@tools:sample/backgrounds/scenic` | 可以用于背景的图片                                                                          |

案例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".samples.ui.杂项.sampledata.SampleDataDemo">


    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/last_names" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/first_names" />


    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/full_names" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/cities" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/us_zipcodes" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/us_phones" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/lorem" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="TextView"
        tools:text="@tools:sample/date/mmddyy" />

    <ImageView
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:text="TextView"
        tools:src="@tools:sample/avatars" />

    <ImageView
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:text="TextView"
        tools:src="@tools:sample/backgrounds/scenic" />
    
</LinearLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688399709252-8df654ca-6ebe-40b5-85e7-187fc1189843.png#averageHue=%23dcdbda&clientId=ubb8c424d-ae2e-4&from=paste&id=uba5077ce&originHeight=766&originWidth=518&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7842223a-4985-4763-88e3-dc1abcbc6d1&title=)<br />![](http://note.youdao.com/yws/res/29205/C964A50E8AA84C1D867BE75349942E15#id=OseLF&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 自定义 sample data

在 app (module) 文件夹右键, 选择 `new -> Sample Data directory` 创建存放假数据的`sample data`文件夹。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688399763341-7bce7bc2-64ce-48e0-a381-87ef95695dad.png#averageHue=%2342464d&clientId=ubb8c424d-ae2e-4&from=paste&id=u2cfd29f6&originHeight=641&originWidth=1280&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub556f4f5-f537-4030-93e1-74fc0f09e9b&title=)<br />![](http://note.youdao.com/yws/res/29209/5EB14233A3B84FB886B28F478E6AC676#id=n3vcB&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)在这个文件夹下, 我们创建文本文件如 txt 文件, 添加一些原始数据如 `#ff33aa` (是的, 可以放置颜色) 或者就是简单的文字, 需要主要每添加一条数据后需要换行, 换言之每行数据占一行. 然后再布局文件中我们就可以通过 tools:text 属性引用 @sample/存放数据的文件的名称 .

#### 1. 普通文本

```
你猜我是谁 。1\n
我管
1
2
```

#### 2. 可以创建 JSON 文件来展示复杂的数据.

```json
{
  "github_users": [
    {
      "name": "Nick Butcher",
      "github": "https://github.com/nickbutcher"
    },
    {
      "name": "Chris Banes",
      "github": "https://github.com/chrisbanes"
    },
    {
      "name": "Jake Wharton",
      "github": "https://github.com/JakeWharton"
    },
    {
      "name": "Romain Guy",
      "github": "https://github.com/romainguy"
    }
  ]
}
```

> 需要注意的是, 这里要求 JSON 文件开头不能是 JsonArray, 只能是 JsonObject. 创建完成后,需要重新编译一下才能引用到最新的数据.

#### 3. 颜色

```
#FF4336
#9727BO
#673AB7
```

引用：

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        tools:text="@sample/test.txt" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        tools:text="@sample/github_user.json/github_users/name" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_avatar"
        tools:tint="@sample/test_color" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_avatar"
        tools:tint="@sample/test_color" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_avatar"
        tools:tint="@sample/test_color" />
</LinearLayout>
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688399772735-078d4f13-5cbb-45e3-a9ba-b18dd9c18cf9.png#averageHue=%23d7b0a8&clientId=ubb8c424d-ae2e-4&from=paste&height=487&id=u90ee41fe&originHeight=910&originWidth=510&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u85979ded-81ef-4d65-a2ba-b79167a2cea&title=&width=273)<br />![](http://note.youdao.com/yws/res/29223/84E2489C7FA646CBB219B7F4FFD0A505#id=ogYM5&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# foreground应用

foreground 也就是前景色，需要注意，foreground的支持是在 Android 6.0（也就是 API 23）才加入的；之前其实也有，不过只支持 FrameLayout，而直到 6.0 才把这个支持放进了 View 类里。

Android在所有布局的基类 View 类中 就定义了 Foreground 这个属性，因为API 版本没有23的话，只有FrameLayout布局上设置该属性才会生效。观察View的代码发现这样一段。它只针对是FrameLayout的实例做获取该styleable的操作。

```java
case R.styleable.View_foreground:
    if (targetSdkVersion >= VERSION_CODES.M || this instanceof FrameLayout) {
         setForeground(a.getDrawable(attr));
    }
    break;
case R.styleable.View_foregroundGravity:
    if (targetSdkVersion >= VERSION_CODES.M || this instanceof FrameLayout) {
    setForegroundGravity(a.getInt(attr, Gravity.NO_GRAVITY));
    }
    break;
```

## foreground应用

### 整个控件容器的遮罩

foreground是盖在整个控件最上层，可以作为遮罩层

### 实现一种点击查看的效果

> 比如那种点击查看谜底的功能就可以简单用这种方法实现

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

    <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="世界上最帅的程序员是谁？点击下方查看谜底答案" />

    <FrameLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:clickable="true"
            android:foreground="@drawable/forceground_drawable">

        <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="vertical">

            <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="世界上最帅的程序员是青蛙要fly，世界上最好用的语言是PHP" />

        </LinearLayout>
    </FrameLayout>
</LinearLayout>
```

selector

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:drawable="@color/colorAccent1"/>
    <item android:drawable="@color/colorAccent2" />
</selector>
```

color

```xml
<color name="colorAccent1">#00ffffff</color>
<color name="colorAccent2">#ffc0c0c0</color>
```

### 使用一行代码就实现了水波纹效果

```xml
android:foreground="?selectableItemBackground"
```

> 如果无效的话，检查是否clickable是否为true.

- 水波纹改色，这个需要在主题中进行配置 ，配置代码如下

```
<item name="colorControlHighlight">@color/accent_material_light</item>
```

# 透明度对应16进制值（十六进制）

## 计算方法

`255 * 不透明度 -> 转换成16进制数`

```java
//java代码生成的对应表
for (int i = 100; i>=0; i--) {
   double j = (i / 100.0d);
   int alpha = (int) Math.round(255-j * 255);
   String hex = Integer.toHexString(alpha).toUpperCase();
   if (hex.length() == 1) hex = "0" + hex;
   int percent = (int) (j*100);
   System.out.println(String.format("%d%% — %s", percent, hex));
}
```

## 不透明度16进制值、十六进制颜色

```
100% — FF（完全不透明）
99% — FC
98% — FA
97% — F7
96% — F5
95% — F2
94% — F0
93% — ED
92% — EB
91% — E8
90% — E6
89% — E3
88% — E0
87% — DE
86% — DB
85% — D9
84% — D6
83% — D4
82% — D1
81% — CF
80% — CC
79% — C9
78% — C7
77% — C4
76% — C2
75% — BF
74% — BD
73% — BA
72% — B8
71% — B5
70% — B3
69% — B0
68% — AD
67% — AB
66% — A8
65% — A6
64% — A3
63% — A1
62% — 9E
61% — 9C
60% — 99
59% — 96
58% — 94
57% — 91
56% — 8F
55% — 8C
54% — 8A
53% — 87
52% — 85
51% — 82
50% — 80
49% — 7D
48% — 7A
47% — 78
46% — 75
45% — 73
44% — 70
43% — 6E
42% — 6B
41% — 69
40% — 66
39% — 63
38% — 61
37% — 5E
36% — 5C
35% — 59
34% — 57
33% — 54
32% — 52
31% — 4F
30% — 4D
29% — 4A
28% — 47
27% — 45
26% — 42
25% — 40
24% — 3D
23% — 3B
22% — 38
21% — 36
20% — 33
19% — 30
18% — 2E
17% — 2B
16% — 29
15% — 26
14% — 24
13% — 21
12% — 1F
11% — 1C
10% — 1A
9% — 17
8% — 14
7% — 12
6% — 0F
5% — 0D
4% — 0A
3% — 08
2% — 05
1% — 03
0% — 00（全透明）
```
