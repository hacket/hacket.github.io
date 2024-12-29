---
date created: 2024-12-24 00:25
date updated: 2024-12-24 00:25
dg-publish: true
---

# WindowInsetsController

## WindowInsetsController介绍

WindowInsetsController是Android官方在`API30`之后提供（从API30开始，~~setSystemUIVisibilty~~就不被推荐），用于控制Window的控制类，实现Window控件的简单化。要使用WindowInsetsController，需要先将core版本提高到1.5.0以上，1.5之后可以向低版本兼容。

- 添加依赖：

```
implementation "androidx.core:core-ktx:1.7.0"
```

## WindowInsetsController API

### Type 类型

- WindowInsetsCompat.Type.statusBars() 状态栏
- WindowInsetsCompat.Type.navigationBars() 导航栏
- WindowInsetsCompat.Type.systemBars() 状态栏、导航栏和标题栏
- WindowInsetsCompat.Type.ime() 键盘
- WindowInsetsCompat.Type.captionBar()
- WindowInsetsCompat.Type.systemGestures()
- WindowInsetsCompat.Type.mandatorySystemGestures()
- WindowInsetsCompat.Type.tappableElement()
- WindowInsetsCompat.Type.displayCutout()

### systemBarsBehavior

- WindowInsetsControllerCompat.BEHAVIOR_SHOW_BARS_BY_TOUCH 默认设置

> 默认设置，触摸就会显示sysytemBar，会移除`View.SYSTEM_UI_FLAG_IMMERSIVE`和`View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY`flag

- WindowInsetsControllerCompat.BEHAVIOR_SHOW_BARS_BY_SWIPE 从边缘swipe显示systemBar

> 从边缘swipe会显示systemBar，添加`View.SYSTEM_UI_FLAG_IMMERSIVE`flag

- WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE 短暂显示systemBar，一段时间后又隐藏systemBar

> 从边缘swipe显示systemBar短暂显示systemBar，一段时间后会继续隐藏；添加了`View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY`

### 获取WindowInsetsControllerCompat

1. ViewCompat.getWindowInsetsController(View)

> View不能是DecorView；DecorView的Context是DecorContext

```java
public static WindowInsetsControllerCompat getWindowInsetsController(@NonNull View view) {
    if (Build.VERSION.SDK_INT >= 30) {
        return Api30Impl.getWindowInsetsController(view);
    } else {
        Context context = view.getContext();
        while (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                Window window = ((Activity) context).getWindow();
                return window != null ? WindowCompat.getInsetsController(window, view) : null;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        return null;
    }
}
```

2. WindowCompat.getInsetsController(Window, View)

```java
public static WindowInsetsControllerCompat getInsetsController(@NonNull Window window,
        @NonNull View view) {
    if (Build.VERSION.SDK_INT >= 30) {
        return Impl30.getInsetsController(window);
    } else {
        return new WindowInsetsControllerCompat(window, view);
    }
}
```

### WindowCompat.setDecorFitsSystemWindows 当前window内容是否沉浸到状态栏和导航栏

- 作用：<br />当前window内容是否沉浸到状态栏和导航栏
- 参数解释：<br />setDecorFitsSystemWindows(Window window, final boolean decorFitsSystemWindows)
  - window 要设置的window
  - decorFitsSystemWindows false表示沉浸到状态栏；true不沉浸
- 示例：沉浸到状态栏和导航栏，状态栏和导航栏亮色模式(黑体)、状态栏和导航栏底色透明：：

```kotlin
if (!isDecorFitsSystemWindows) {
    // 设置状态栏和导航栏透明的底色
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        window.navigationBarDividerColor = Color.RED
    }
    // 设置沉浸后状态栏和导航栏字体的颜色
    ViewCompat.getWindowInsetsController(window.decorView)?.apply {
        isAppearanceLightStatusBars = true
        isAppearanceLightNavigationBars = true
    }
}
WindowCompat.setDecorFitsSystemWindows(window, isDecorFitsSystemWindows)

// 控制状态栏字体颜色显示为白色
insetsController.setAppearanceLightStatusBars(false);
// 控制导航栏字体显示为黑色
insetsController.setAppearanceLightStatusBars(true);
// 导航栏颜色显示为白色
insetsController.setAppearanceLightNavigationBars(false);
// 导航栏显示为黑色
insetsController.setAppearanceLightNavigationBars(true);
```

为false的效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688487410180-7efa8223-a483-41e5-9566-9a6adff8ddd1.png#averageHue=%23f8f6f6&clientId=ud4e0bffb-4428-4&from=paste&height=487&id=uf6503195&originHeight=730&originWidth=491&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=19578&status=done&style=none&taskId=u11917533-c6a1-492f-9bf3-d6febec0315&title=&width=327.3333333333333)<br />![](https://note.youdao.com/yws/res/93310/3C741F60103F4CDDB4559FBDDB811831#id=qwZCY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

> 可以看到内容都沉浸到了状态栏和导航栏去了，但导航栏没有透明；在Android10(API29)，需要在theme.xml中添加android:enforceNavigationBarContrast=false才能全透明

- 原理：

```java
// WindowCompat
public static void setDecorFitsSystemWindows(@NonNull Window window, final boolean decorFitsSystemWindows) {
    if (Build.VERSION.SDK_INT >= 30) {
        Impl30.setDecorFitsSystemWindows(window, decorFitsSystemWindows);
    } else if (Build.VERSION.SDK_INT >= 16) {
        Impl16.setDecorFitsSystemWindows(window, decorFitsSystemWindows);
    }
}
private static class Impl30 {
    static void setDecorFitsSystemWindows(@NonNull Window window,
            final boolean decorFitsSystemWindows) {
        window.setDecorFitsSystemWindows(decorFitsSystemWindows);
    }
}
private static class Impl16 {
    static void setDecorFitsSystemWindows(@NonNull Window window,
            final boolean decorFitsSystemWindows) {
        final int decorFitsFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION // 不隐藏导航栏，内容沉浸到导航栏
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN; // 不隐藏状态栏，内容沉浸到状态栏

        final View decorView = window.getDecorView();
        final int sysUiVis = decorView.getSystemUiVisibility();
        decorView.setSystemUiVisibility(decorFitsSystemWindows
                ? sysUiVis & ~decorFitsFlags
                : sysUiVis | decorFitsFlags);
    }
}
```

### show/hide(Type)

- 控制状态栏

```java
// 显示状态栏：
controller?.show(WindowInsetsCompat.Type.statusBars())
// 隐藏状态栏：
controller?.hide(WindowInsetsCompat.Type.statusBars())

// 状态栏文字颜色改为黑色：
controller?.isAppearanceLightStatusBars = true
 
// 状态栏文字颜色改为白色：
controller?.isAppearanceLightStatusBars = false
```

- 控制导航栏

```
// 显示导航栏
controller?.show(WindowInsetsCompat.Type.navigationBars())
// 隐藏导航栏
controller?.hide(WindowInsetsCompat.Type.navigationBars())
 
//导航栏隐藏时手势操作
controller?.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
 
// systemBarsBehavior有三个值：
BEHAVIOR_SHOW_BARS_BY_SWIPE
BEHAVIOR_SHOW_BARS_BY_TOUCH
BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
目前可能跟部分手机手势有冲突
```

### isVisible(typeMask)

### WindowInsetsAnimation.Callback  键盘动画

- [ ] 简单的Android软键盘动画 <https://aprildown.xyz/2021/05/28/android-naive-keyboard-animation/>
- [ ] WindowInsetsAnimation sample <https://github.com/android/user-interface-samples/tree/master/WindowInsetsAnimation>
- [ ] <https://gitee.com/spica27/frame-by-frame-soft-keyboard>

## 开源库

### Insetter 更方便使用WindowInsets

<https://chrisbanes.github.io/insetter/library/>

# 场景

## 内容沉浸到状态栏、导航栏

```kotlin
// 设置状态栏和导航栏透明的底色
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    window.statusBarColor = Color.TRANSPARENT
    window.navigationBarColor = Color.TRANSPARENT
}
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
    // 在Android10(API29)，需要在theme.xml中添加android:enforceNavigationBarContrast=false才能全透明，否则全透明不了
    window.navigationBarDividerColor = Color.RED
}
// 设置沉浸后状态栏和导航栏字体的颜色
WindowCompat.getInsetsController(window, window.decorView)?.apply {
    isAppearanceLightStatusBars = true
    isAppearanceLightNavigationBars = true
}
WindowCompat.setDecorFitsSystemWindows(window, false)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688487445004-ed1af17b-cb2d-4a68-a1d1-b564d3286887.png#averageHue=%23c7e5c8&clientId=ud4e0bffb-4428-4&from=paste&height=487&id=uea3ae959&originHeight=730&originWidth=494&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=30509&status=done&style=none&taskId=u3298b4f4-dc89-43ae-bc8b-0d503869cdf&title=&width=329.3333333333333)

> 需要处理状态栏和导航栏把内容遮挡住了；添加了`View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`和`SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`flag

## 全屏

```kotlin
WindowCompat.setDecorFitsSystemWindows(window, false)
val windowInsetsController = ViewCompat.getWindowInsetsController(view)
windowInsetsController?.let { controller ->
    controller.hide(WindowInsetsCompat.Type.systemBars())
    controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
}
```

Pixel3XL效果： <br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688487466634-7df2f3d1-3bf8-445f-a01b-28e03014c164.png#averageHue=%23c7e4c8&clientId=ud4e0bffb-4428-4&from=paste&height=490&id=uaa6c02bf&originHeight=735&originWidth=490&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=26762&status=done&style=none&taskId=u252a6df1-efe3-4271-88e4-dbb63a7a987&title=&width=326.6666666666667)<br />![](https://note.youdao.com/yws/res/93311/F3569D7A48D348BE9075043EA0713C83#id=jTLXW&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

> 添加了`View.SYSTEM_UI_FLAG_FULLSCREEN`和`View.SYSTEM_UI_FLAG_HIDE_NAVIGATION`flag

- 退出全屏

```kotlin
 WindowCompat.setDecorFitsSystemWindows(window, true)
windowInsetsController?.let { controller ->
    controller.show(WindowInsetsCompat.Type.systemBars())
    controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
}
```

## 状态栏字体和导航栏字体

```

状态栏文字颜色改为黑色：
controller?.isAppearanceLightStatusBars = true
 
状态栏文字颜色改为白色：
controller?.isAppearanceLightStatusBars = false
```

## DialogFragment中设置系统栏颜色和字体

需要满足2个条件：

1. windowIsFloating设置为false

```xml
<style name="LoadingDialog" parent="Theme.AppCompat.Light.Dialog">
    <item name="android:windowIsFloating">false</item>
</style>
```

2. 宽高设置为`MATCH_PARENT`

- DialogFragment扩展方法

```kotlin
val DialogFragment.window: Window? get() = dialog?.window

val DialogFragment.activityDecorView: View? get() = activity?.window?.decorView

fun DialogFragment.getSystemUiVisibility(): Int? = window?.decorView?.systemUiVisibility

fun DialogFragment.addSystemUiVisibility(flag: Int) {
    val view = activityDecorView ?: return
    view.systemUiVisibility = view.systemUiVisibility or flag
}

fun DialogFragment.clearSystemUiVisibility(flag: Int) {
    val view = activityDecorView ?: return
    view.systemUiVisibility = view.systemUiVisibility and flag.inv()
}

fun DialogFragment.setSystemUiVisibility(flags: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        activityDecorView?.systemUiVisibility = flags
    }
}

fun DialogFragment.setStatusBarColor(@ColorRes colorRes: Int) {
    window?.run {
        addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
        val color = ContextCompat.getColor(context, colorRes)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            statusBarColor = color
        }
    }
}

fun DialogFragment.lightBar(isLightBar: Boolean) {
    window?.run {
        // does not work if dim is enabled
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (isLightBar) {
                addSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    addSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR)
                }
            } else {
                clearSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    clearSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR)
                }
            }
        }
    }
}
```

## 键盘显示隐藏（国产ROM有键盘问题）

> 需要界面有EditText并且EditText获取到焦点才能起作用；且国产ROM可能不起作用

```kotlin
// 隐藏键盘
ViewCompat.getWindowInsetsController(it)?.hide(WindowInsetsCompat.Type.ime())

// 显示键盘
ViewCompat.getWindowInsetsController(it)?.hide(WindowInsetsCompat.Type.ime())
```

> MIUI12 getWindowInsetsController的view要传焦点的View，否则弹不出键盘；hide隐藏不了键盘

## Ref

- [x] API 30新特性：WindowInsetsController <https://juejin.cn/post/6940048488071856164>
- [x] Android进阶：非全屏的Window无法设置SYSTEM_UI_FLAG_LIGHT_STATUS_BAR问题分析<br />-<https://www.jianshu.com/p/88e9e889932c>
