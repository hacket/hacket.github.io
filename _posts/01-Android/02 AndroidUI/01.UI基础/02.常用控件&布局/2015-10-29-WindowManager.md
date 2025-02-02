---
date_created: Tuesday, October 29th 2015, 12:08:52 am
date_updated: Monday, January 27th 2025, 1:08:30 am
title: WindowManager
author: hacket
categories:
  - AndroidUI
category: 系统控件
tags: []
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:13 晚上
image-auto-upload: true
feed: show
format: list
aliases: [WindowManager Flag]
linter-yaml-title-alias: WindowManager Flag
---

# WindowManager Flag

## TYPE_SYSTEM_OVERLAY/ TYPE_APPLICATION_OVERLAY

- TYPE_SYSTEM_OVERLAY<br />过时，不会有输入事件，API26(Android8.0) 及以上用 `TYPE_APPLICATION_OVERLAY` 替代
- TYPE_APPLICATION_OVERLAY<br />在所有 Activity 之上，在 `FIRST_APPLICATION_WINDOW` 和 `LAST_APPLICATION_WINDOW` 之间，在 system window 之下（如 statusbar、IME）；需要 `SYSTEM_ALERT_WINDOW` 权限；会调整进程的优先级避免低内存被杀死。

出错错误：

```
Unable to add window android.view.ViewRootImpl$W@b6c20ff -- permission denied for this window type
```

### Anroid6.0 以下

在清单文件配置：

```
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
```

### Android6.0 及以上

Android6.0 及以上还是报错，Android6.0 及以上需要特殊处理，需要调研 `Settings.canDrawOverlays()` 判断。`canDrawOverlays` 方法就是用来判断一个 App 是否能够在其它 App 之上显示视图。正常来讲一个 App 是不能在其它 App 之上显示视图的，除非在 AndroidManifest.xml 文件中声明了 `SYSTEM_ALERT_WINDOW权限`；6.0 之后添加了动态权限申请机制，因此如果是在 6.0 之后的版本上还需要用户主动的允许权限申请。而为了让系统弹出提示用户允许权限申请操作的界面，需要程序员在代码中发送 `ACTION_MANAGE_OVERLAY_PERMISSION`。<br />![4mvi0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270108798.png)<br />or

<br />![y02j5](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270108799.png)<br />

具体代码：

```java
if (Build.VERSION.SDK_INT >= 23) {
    if (!Settings.canDrawOverlays(this)) {
        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivityForResult(intent, 1);
    } else {
        // TODO do something you need
    }
}
```

### Android8.0 及以上

```java
 WindowManager.LayoutParams params = new WindowManager.LayoutParams();
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
} else {
    params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
}
params.format = PixelFormat.TRANSLUCENT;
WindowManager wm = (WindowManager) getSystemService(WINDOW_SERVICE);
wm.addView(mGalgoLogView, params);
```

# WindowManager 动画坑

## 1.直接对 View 设置传统动画

view 的动画无法生效。原因是动画执行的条件是不能直接添加到最顶层的 Window，而是需要一个容器。<br />如果添加一个容器，则只能对容器内的 view 进行动画设置，还是无法对容器进行动画设置。

```java
ScaleAnimation animation = new ScaleAnimation(0.0f, 1f, 0.0f, 1f, Animation.ABSOLUTE, 100, Animation.ABSOLUTE, 100);
animation.setDuration(100);
view.setAnimation(animation);
animation.start();
mWindowManager.addView(defaultSplashLayout, lp);
```

> 如果是位移动画，可以通过 updateWindow 来实现

## 2.对 WindowManager.LayoutParams 的 windowAnimations 设置动画

```java
 WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
 lp.type = WindowManager.LayoutParams.TYPE_STATUS_BAR_PANEL;
 lp.flags = WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED;
 lp.format = PixelFormat.RGB_888;
 lp.screenOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
 lp.windowAnimations = R.style.default_style;
```

- xml

```xml
<style name="default_style">
    <item name="@android:windowEnterAnimation">@anim/window_enter</item>
    <item name="@android:windowExitAnimation">@anim/window_exit</item>
</style>
```

> 只能设置 window 的进场出场动画

## 3.对 View 设置属性动画

```java
view.setPivotX(100);
view.setPivotY(100);
ValueAnimator valueAnimator = ValueAnimator.ofFloat(0, 1);
valueAnimator.setDuration(200).start();
valueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
       @Override
       public void onAnimationUpdate(ValueAnimator animation) {
              Float value = (Float) animation.getAnimatedValue();
              view.setScaleX(value);
              view.setScaleY(value);
       }
});
mWindowManager.addView(defaultSplashLayout, lp)
```

## Ref

- [ ] 对 WindowManager 中的 View 设置动画<br /><https://www.jianshu.com/p/a31daec4a6aa>
