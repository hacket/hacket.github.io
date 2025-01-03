---
date created: 2024-12-24 00:25
date updated: 2025-01-02 08:29
dg-publish: true
feed: show
format: list
image-auto-upload: true
---

# Android中各种System UI和Window flags

## 造成SystemUI Flag被系统自动清除的交互分类

1. 触摸屏幕任何位置
2. 顶部下拉状态栏
3. 底部上拉导航栏
4. Window的变化(如：跳转到其他界面、弹出键盘等)

## Android3.0之前

### ~~WindowManager.LayoutParams.FLAG_FULLSCREEN~~ 全屏（会隐藏StatusBar，长时间，如：游戏）

1. 只能显示和隐藏StatusBar，导航栏不会隐藏；隐藏状态栏(全屏)后，内容会往上顶
2. 忽略`SOFT_INPUT_ADJUST_RESIZE`softInputMode，不会resize(使用此flag,系统会自动忽略输入法的`SOFT_INPUT_ADJUST_RESIZE`的特性)
3. 带有`xxx_Fullscreen}`的主题自带该flag
4. 已过时，用`WindowInsetsController#hide(int) Type#statusBars()`替代
5. 4.0及之前设置全屏，这种全屏方式是无法隐藏 NavigationBar 的（如果有 NavigationBar 的话），因为 NavigationBar 是在 4.0 以后才引入的

注意： A fullscreen window will ignore a value of `SOFT_INPUT_ADJUST_RESIZE` for the window's softInputMode field; the window will stay fullscreen and will not resize.

> 也可以用主题属性 android:windowFullscreen

```kotlin
// 全屏
window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
// 取消全屏
window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
```

效果：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252388.png) <br /><br />

## Android3.0（API11）

1. 加入了`setSystemUiVisibility`，两个属性，`~~View.STATUS_BAR_HIDDEN~~`、`~~View.STATUS_BAR_VISIBLE~~`
2. 可以监听`OnSystemUiVisibilityChangeListener`系统UI的变化。

### ~~View.STATUS_BAR_HIDDEN~~ 状态栏低亮度及隐藏状态栏不重要的图标

过时，由 `~~View.SYSTEM_UI_FLAG_LOW_PROFILE~~` 替代。状态栏低亮度和隐藏一些不重要的图标。

```kotlin
val systemUiVisibility = window.decorView.systemUiVisibility
window.decorView.systemUiVisibility = systemUiVisibility or View.STATUS_BAR_HIDDEN
```

效果：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252389.png)![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252390.png)

### ~~View.STATUS_BAR_VISIBLE~~ 显示状态栏，系统默认

过时，由 `~~View.SYSTEM_UI_FLAG_VISIBLE~~` 替代。系统默认，显示状态栏

## Android4.0（API14）

1. 扩充了针对状态栏操作的功能，`~~View.STATUS_BAR_HIDDEN~~` 换成了 `~~View.SYSTEM_UI_FLAG_LOW_PROFILE~~` ， `~~View.STATUS_BAR_VISIBLE~~` 也换成了 `~~View.SYSTEM_UI_FLAG_VISIBLE~~`
2. 加入了 `~~View.SYSTEM_UI_FLAG_HIDE_NAVIGATION~~`

### ~~View.SYSTEM_UI_FLAG_LOW_PROFILE~~ 状态栏低亮度及隐藏状态栏不重要的图标

设置该flag让状态栏或导航栏上的图标变暗和让一些不重要的图标消失。状态栏一些icon被隐藏了，并且变得有些半透明，导航栏的三个按钮也都被隐藏了。另只要页面有任何交互，该flag会被清除，样式还原。<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252391.png)

> MIUI这个flag似乎无效。

### ~~View.SYSTEM_UI_FLAG_HIDE_NAVIGATION~~ 隐藏导航栏

作用是隐藏系统NavigationBar

但是用户的任何交互，都会导致此Flag被系统清除，进而导航栏自动重新显示，同时View.SYSTEM_UI_FLAG_FULLSCREEN也会被自动清除，因此StatusBar也会同时显示出来。<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252392.png)<br />![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252393.png)

## Android4.1（API16）

> 增加了很多`setSystemUiVisibility`的flag，`~~View.SYSTEM_UI_FLAG_FULLSCREEN~~`、`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`、`View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`、`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`。

### ~~View.SYSTEM_UI_FLAG_FULLSCREEN~~ 全屏（短暂性，如阅读电子书） `>=api16`

1. 进入全屏模式（状态栏会隐藏，用户和App交互了就会退出全屏
2. 和`WindowManager.LayoutParams.FLAG_FULLSCREEN`视觉效果一样，不同的是，前者用于提供长时间的全屏，比如游戏，后者用于短暂性的全屏；如果用了ActionBar，并设置了`Window.FEATURE_ACTION_BAR_OVERLAY`，和window flag不同，这个flag也会把ActionBar隐藏掉
3. 内容会覆盖到状态栏，要注意自己的布局不要被状态栏遮挡住，一般会设置`fitsSystemWindows`属性；切换到其他App或者说离开当前页面、下拉状态栏等，该Flag会被清除。
4. 需要提供一种让用户退出该flag的操作（比如在电子书设置该flag后，tap屏幕后退出该flag）
5. 过时，用`WindowInsetsController.hide(int) with WindowInsets.Type.statusBars()`替代

```kotlin
window.decorView.systemUiVisibility = window.decorView.systemUiVisibility or View.SYSTEM_UI_FLAG_FULLSCREEN
```

效果：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252394.png)<br />![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252395.png)

### ~~View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN~~ 不隐藏StatusBar，布局到StatusBar，内容会被StatusBar遮挡

- 作用：在不隐藏StatusBar的情况下，将View所在window的显示范围扩展到StatusBar下面。同时Activity的部分内容也因此被StatusBar覆盖遮挡。

1. 当使用此Flag时，设置fitSystemWindow=true的view，会被系统自动添加大小为statusBar和ActionBar高度之和相同的paddingTop
2. 当window设置`WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS`时，此Flag会被系统会自动添加

#### View.SYSTEM_UI_FLAG_FULLSCREEN和View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN区别

两个标志位都是设置全屏，SYSTEM_UI_FLAG_FULLSCREEN Activity全屏显示时，状态栏被隐藏覆盖掉；View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN 状态栏不会被隐藏覆盖，状态栏依然可见，Activity顶端布局部分会被状态遮住

### ~~View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION~~ 不隐藏NavigationBar，布局到NavigationBar，内容会被NavigationBar遮挡

作用：在不隐藏导航栏的情况下，将Activity的显示范围扩展到导航栏底部。同时Activity的部分内容也因此被NavigationBar覆盖遮挡。

1. 当使用此Flag时，设置`fitSystemWindow=true`的view，会被系统自动添加大小为NavigationBar高度相同的paddingBottom
2. 当window设置`WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION`时，此Flag会被系统会自动添加。

#### SYSTEM_UI_FLAG_HIDE_NAVIGATION和SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION区别

前者导航栏不显示，布局延伸到导航栏；后者导航栏显示，布局延伸到导航栏

### ~~View.SYSTEM_UI_FLAG_LAYOUT_STABLE~~ 配合其他layout flags，稳定布局

#### 作用

1. 稳定布局，结合其他 `layout flags` 使用，保证状态栏和导航栏占位用的
2. 配合`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`转换到`View.SYSTEM_UI_FLAG_FULLSCREEN`mode
3. 配合`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`和`View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`将转换为`View.SYSTEM_UI_FLAG_FULLSCREEN`和`View.SYSTEM_UI_FLAG_HIDE_NAVIGATION`，避免单独使用`SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`flag
4. 过时，用`WindowInsets.getInsetsIgnoringVisibility(int)`

#### 和其他flag配合使用：

##### View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE

同时设置`SYSTEM_UI_FLAG_FULLSCREEN |SYSTEM_UI_FLAG_LAYOUT_STABLE`时，会同时隐藏Actionbar和StatusBar，但StatusBar所占空间不会隐藏，只会变成空白。同时View所在window的显示范围也不会伸展到StatusBar所占空间。若是加上`SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`，View所在window的显示范围则会伸展到StatusBar所在的空间。同样对NavigationBar如此操作，也会是一样的效果。<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252396.png)<br />![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252397.png)

> 作用显而易见，在设置全屏时，加上这个标志位以后，布局不会占用状态栏的空间

---

1. 当使用`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`或`SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`，同时View设置fitSystemWindow=true时，系统会为此View自动设置padding。此padding的大小由View.fitSystemWindows(Rect)的Rect提供。一般情况下，当StatusBar和NavigationBar显示时，paddingTop的大小为StatusBar的高度。如果设置了getWindow().requestFeature(`Window.FEATURE_ACTION_BAR_OVERLAY`),paddingTop的大小则为StatusBar和ActionBar的高度之和。paddingBottom的大小则为NavigationBar的高度。当StatusBar和NavigationBar被隐藏时，View的padingBottom和paddingTop的大小就变成了0,因此StatusBar和NavigationBar的显示和隐藏造成的padding变化，进而View内容的位置变化，从而造成位置闪动的视觉效果，影响体验。使用`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`的作用便是当StatusBar和NavigationBar的显示和隐藏，系统为View设置的padding都不会变化，因此View内容的位置不会变化，此即为稳定布局。
2. 当你设置了`SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`时，配合此特性，若此时设置或取消`SYSTEM_UI_FLAG_FULLSCREEN`，不会因为StatusBar的显示或隐藏不会造成内容view的不稳定
3. 当你设置了`SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`和`SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`，配合此特性，若此时设置或取消`SYSTEM_UI_FLAG_FULLSCREEN`和`SYSTEM_UI_FLAG_HIDE_NAVIGATION`，不会因为StatusBar和导航栏的显示或隐藏不会造成内容view的不稳定
4. 使用`WindowManager.LayoutParams.FLAG_FULLSCREEN`（而不是使用`SYSTEM_UI_FLAG_FULLSCREEN`）来隐藏StatusBar是一个一直持续隐藏的状态。这时你仍然可以使用`SYSTEM_UI_FLAG_FULLSCREEN | SYSTEM_UI_FLAG_LAYOUT_STABLE`隐藏Actionbar，并且不会因为ActionBar的显示或隐藏而不稳定

## Android4.4（API19）

> 增加了属性`android:windowTranslucentStatus`、`android:windowTranslucentNavigation`，还增加了`SYSTEM_UI_FLAG_IMMERSIVE`、`SYSTEM_UI_FLAG_IMMERSIVE_STICKY`。

### ~~WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS~~  半透明StatusBar

1. 半透明StatusBar，并且不会因用户交互而被清除。
2. 一些系统主题`xxx_TranslucentDecor`会自动设置该值
3. 设置了此flag，系统会自动设置`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`和`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`
4. 除了设置该flag，也可以设置主题`android:windowTranslucentStatus`

- WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS自动添加flag`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`和`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`分析：

设置了`WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS`，会自动设置`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`和`View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`两个flag，下面是源码：

```java
// ViewRootImpl
private int getImpliedSystemUiVisibility(WindowManager.LayoutParams params) {
    int vis = 0;
    // Translucent decor window flags imply stable system ui visibility.
    if ((params.flags & WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS) != 0) {
        vis |= View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
    }
    if ((params.flags & WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION) != 0) {
        vis |= View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
    }
    return vis;
}
```

- WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS无效可能原因：

如果设置了`WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS`不能沉浸到状态栏，那应该是某些主题的配置有问题，如配置了`fitsSystemWindows`，需要去检查下系统提供的主题设置。

- WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS不同版本和不同ROM表现不一致：

1. Android4.4，透明，有些是渐变的，有些厂商也是透明的<br />![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252398.png)
2. Android5.0，半透明的，有些厂商也是透明的<br />![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501012252399.png)

### ~~WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION~~ 半透明NavigationBar （>=api 19）

1. 半透明NavigationBar，并且不会因用户交互而被清除。
2. 设置了此flag，系统会自动设置`View.SYSTEM_UI_FLAG_LAYOUT_STABLE`和`View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION`
3. 除了设置该flag，也可以设置主题`android:windowTranslucentNavigation`

### ~~View.SYSTEM_UI_FLAG_IMMERSIVE~~ 沉浸式模式，触摸等操作会退出

沉浸式，通过触摸状态栏或者导航栏来清除flag；会触发`View.OnSystemUiVisibilityChangeListener`监听

1. 只能配合`View.SYSTEM_UI_FLAG_HIDE_NAVIGATION`flag时有效。
2. 过时，用`WindowInsetsController.BEHAVIOR_SHOW_BARS_BY_SWIPE`替代

### ~~View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY~~ 沉浸式模式，触摸等操作会退出，过几秒又会恢复

沉浸式，和`SYSTEM_UI_FLAG_IMMERSIVE`不同的是，不会清除flag，过几秒又回到沉浸式；不会触发`View.OnSystemUiVisibilityChangeListener`监听

1. 只能配合`View.SYSTEM_UI_FLAG_FULLSCREEN`和`View.SYSTEM_UI_FLAG_HIDE_NAVIGATION`使用
2. 过时，用`WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIP`替代

## Android5.0（API21）

> 增加了主题属性`android:statusBarColor`设置状态栏颜色、`android:navigationBarColor`设置导航栏颜色；增加了`View.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS`的flag

### WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS (>=API21)

1. 用于为StatusBar和NavigationBar设置背景颜色
2. 原理：将StatusBar和NavigationBar设置为透明背景，并且将StatusBar和NavigationBar所在空间设置为Window.getStatusBarColor() 和Window.getNavigationBarColor()方法获得的颜色。

> statusBarColor/navigationBarColor前，需要设置该Flag，不然设置颜色失败

### statusBarColor/navigationBarColor

- statusBarColor/navigationBarColor主题属性

> 设置状态栏颜色，需要设置`LayoutParams#FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS`，没有设置`LayoutParams#FLAG_TRANSLUCENT_STATUS`；如果颜色不是透明的，考虑设置`View#SYSTEM_UI_FLAG_LAYOUT_STABLE`和`SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN`

## Android6.0（API23）

> 增加了`View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR`标签和`android:windowLightStatusBar`属性，可以改变状态栏中的内容颜色。

### ~~WindowManager.LayoutParams.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR~~ 状态栏深色模式，>=Android6.0/AndroidM(API23)

> 默认是状态栏内容为浅色；SYSTEM_UI_FLAG_LIGHT_STATUS_BAR改状态栏内容为深色模式

```kotlin
window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
window.decorView.systemUiVisibility = window.decorView.systemUiVisibility or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
```

SYSTEM_UI_FLAG_LIGHT_STATUS_BAR效果：

> 默认是白色字体，设置该flag后，变成了灰色字体<br />默认效果：<br />

### ~~WindowManager.LayoutParams.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR~~ 导航栏深色模式 >=Android8.0/AndroidO(API26)

```kotlin
window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
window.decorView.systemUiVisibility = window.decorView.systemUiVisibility or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
```

SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR效果：
默认效果：

> MIUI12似乎这个没啥效果。

### MIUI6可以自己设置状态栏的深色模式

<https://dev.mi.com/doc/p=4769/>

## Flags小结

### 控制SystemBar

- View.SYSTEM_UI_FLAG_FULLSCREEN

> 1. 只是隐藏StatusBar，NavigationBar不会隐藏；
> 2. 点击屏幕 StatusBar不会显示出来；
> 3. 从屏幕上边缘往下滑可以让StatusBar 重新显示；
> 4. 离开App后再回来，StatusBar会重新显示出来， StatusBar在显示出来以后不会自动隐藏，因为设置的 FULLSCREEN flag 已经被清除了，如果想重新隐藏，需要重新设置该 flag；
> 5. StatusBar 的显示 / 隐藏会使 ImageView 大小发生了变化

- View.SYSTEM_UI_FLAG_HIDE_NAVIGATION

> 1. 隐藏NavigationBar，屏幕内点击事件会被屏蔽，要等到 SystemBar 显示出来以后再次点击，事件才会传递到我们的布局中
> 2. 隐藏了NavigationBar 以后，点击屏幕的任何位置都会导致设置的所有控制 SystemBar 相关的 flag 被清除，所以 SystemBar 重新显示了出来。
> 3. Google 建议隐藏 NavigationBar 的同时将 StatusBar 一起隐藏
> 4. 与`LAYOUT_FULLSCREEN`类似的是，LAYOUT_HIDE_NAVIGATION 可以让布局内容延伸到NavigationBar的底部。

- View.SYSTEM_UI_FLAG_LOW_PROFILE

> 减少 StatusBar 中的图标并使其变暗，将 NavigationBar 中的按钮减弱成 3 个点。

#### 布局相关

- View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION

> 防止布局大小变化，内容延伸到NavigationBar

- View.SYSTEM_UI_FLAG_LAYOUT_STABLE 防止布局大小变化

> 1. 防止布局大小不会因为 StatusBar 的显示 / 隐藏发生变化
> 2. 布局不会延伸到StatusBar下面，StatusBar会置为不可见

- View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN 防止布局大小变化

> 和SYSTEM_UI_FLAG_LAYOUT_STABLE不同，布局会延伸到StatusBar下面

#### 沉浸式相关 (4.4 引入)

- SYSTEM_UI_FLAG_IMMERSIVE

> 需要配合`View.SYSTEM_UI_FLAG_FULLSCREEN` 和`View.SYSTEM_UI_FLAG_HIDE_NAVIGATION`一起设置；点击屏幕不会让 SystemBar 显示出来。而在呼出 SystemBar 后，控制 SystemBar 相关的 flag 依然会被清除。

```kotlin
window.decorView.systemUiVisibility =
        View.SYSTEM_UI_FLAG_FULLSCREEN or
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_IMMERSIVE
actionBar?.hide()
```

- SYSTEM_UI_FLAG_IMMERSIVE_STICKY

> 跟 IMMERSIVE 不同的是，在该模式下呼出的 SystemBar 会在短暂的显示后自动重新隐藏。在 SystemBar 显示出来的时候点击屏幕中心会立刻让 SystemBar 重新隐藏。所以在模式下不会清除控制 SystemBar 相关的 flag。但是离开App页面时还是会被清除。

```kotlin
window.decorView.systemUiVisibility =
        View.SYSTEM_UI_FLAG_FULLSCREEN or
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
actionBar?.hide()
```
