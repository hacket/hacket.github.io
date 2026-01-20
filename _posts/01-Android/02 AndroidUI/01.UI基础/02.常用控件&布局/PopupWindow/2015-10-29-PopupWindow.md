---
banner: 
date_created: Tuesday, October 29th 2015, 12:08:52 am
date_updated: Friday, March 21st 2025, 12:00:41 am
title: PopupWindow
author: hacket
categories:
  - AndroidUI
category: 系统控件
tags: [PopupWindow]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:09 晚上
image-auto-upload: true
feed: show
format: list
aliases: [PopupWindow 基础]
linter-yaml-title-alias: PopupWindow 基础
---

# PopupWindow 基础

## PopupWindow 总结

1. 设置 PopupWindow 背景 (setBackgroundDrawable)，且要在 showAtLocation() 显示之前设置，否则动画播放不了
2. 退出时，要将 PopupWindow 给 dismiss() 掉，否则会 leak
3. 需要顺利让 PopUpWindow dimiss（即点击 PopuWindow 之外的地方此或者 back 键 PopuWindow 会消失）；PopUpWindow 的背景不能为空。必须在 popuWindow.showAsDropDown(v); 或者其它的显示 PopuWindow 方法之前设置它的背景不为空
4. 为啥一定需要设置 width 和 height，而不能从布局中获取？

> 没有设置 width 和 height，那 mWidth 和 mHeight 将会取默认值 0，并不是我们的窗体没有弹出来，而是因为他们的 width 和 height 都是 0 了；因为通过 LayoutInflater.from(MainActivity.this).inflate(R.layout.popuplayout, null); 得到 contentView 的，而这个是没有 parent 的，所以我们需要手动设置 width 和 height

1. 默认情况下 popupWindow.setTouchable(true);setOutsideTouchable(true) 这里设置显示 PopuWindow 之后在外面点击是否有效。如果为 false 的话，那么点击 PopuWindow 外面并不会关闭 PopuWindow。当然这里很明显只能在 Touchable 下才能使用。
2. 当有 mPop.setFocusable(false); 的时候，说明 PopuWindow 不能获得焦点，即使设置设置了背景不为空也不能点击外面消失，只能由 dismiss() 消失。
3. 使用 showAtLocation 如果不能定位到具体位置，看看 width 是否设置成了 MATCH_PARENT

## PopupWindow 基本用法

### 基本设置

1. 设置 PopupWindow 的背景，不设置背景 `不能响应返回键和点击外部消失` 的

```java
mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
```

2. 设置 PopupWindow 是否能响应外部点击事件

```java
mPopupWindow.setOutsideTouchable(true);
```

1. PopupWindow 显示时，不让外部 view 响应点击事件

```java
mPopupWindow.setFocusable(true);
```

4. 按键 Back dismiss

```java
if (mPopupWindow.getContentView() != null) {
    mPopupWindow.getContentView().setOnKeyListener(new View.OnKeyListener() {
        @Override
        public boolean onKey(View v, int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                hidePopupWindow();
                if (cancelListener != null) {
                    cancelListener.cancel(v);
                }
                return true;
            }
            return false;
        }
    });
}
```

### PopupWindow API

#### PopupWindow 与 AlertDialog 的区别

1. AlertDialog 不能指定显示位置，只能默认显示在屏幕最中间（当然也可以通过设置 WindowManager 参数来改变位置）。
2. PopupWindow 是可以指定显示位置的，随便哪个位置都可以，更加灵活。

#### 构造函数

```java
//方法一：
public PopupWindow (Context context)
//方法二：
public PopupWindow(View contentView)
//方法三：
public PopupWindow(View contentView, int width, int height)
//方法四：  
public PopupWindow(View contentView, int width, int height, boolean focusable)
```

- 参数 1：contentView，PopupWindow 没有默认布局，需要强制指定
- 参数 2：width，宽度，必须
- 参数 3：height，高度，必须
- 参数 4：focusable，可选；默认为 false

#### setFocusable

PopupWindow 是否具有获取焦点的能力，默认为 False。一般来讲是没有用的，因为普通的控件是不需要获取焦点的，而对于 EditText 则不同，如果不能获取焦点，那么 EditText 将是无法编辑的。

内部设置：

```java
if (!mFocusable) {
	curFlags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
	if (mInputMethodMode == INPUT_METHOD_NEEDED) {
		curFlags |= WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;
	}
} else if (mInputMethodMode == INPUT_METHOD_NOT_NEEDED) {
	curFlags |= WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;
}
```

#### setTouchable 是否处理触摸事件

设置 PopupWindow 是否响应 touch 事件，默认是 true

内部添加的 flag:

```java
if (!mTouchable) {
	curFlags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
}
```

- 设置 mTouchable=true ，PopupWindow 内容区域才可以响应点击事件；这时用户操作的所有事件都会被 PopupWindow 所拦截，在 PopupWindow 下面的 View 都是无法响应事件的，如果需要透传事件给遮挡的控件，就需要使用**setTouchInterceptor**
- 如果 mTouchable=false，setTouchInterceptor 也不会响应事件；只会接收到 MotionEvent.ACTION_OUTSIDE=4 的事件，DOWN/MOVE/UP 事件接收不到；如果设置为 false，即会是下面这个结果：(所有 touch 事件无响应，包括点击事件)

#### setOutsideTouchable

setOutsideTouchable(boolean touchable)

PopupWindow 以外的区域是否可点击，即如果点击 PopupWindow 以外的区域，PopupWindow 是否会消失。需要设置 setBackgroundDrawable()

> setOutsideTouchable 设置生效的前提是 setTouchable(true) 和 setFocusable(false)
内部设置的 flag：

```java
if (mOutsideTouchable) {
	curFlags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH;	
}
```

#### setBackgroundDrawable

setBackgroundDrawable(Drawable background)

不只是设置背景；设置后，`setOutsideTouchable()` 才会生效；PopupWindow 才会对手机的返回按钮有响应：即点击手机返回按钮，可以关闭 PopupWindow，如果不加 setBackgroundDrawable() 将关闭的 PopupWindow 所在的 Activity。

> 如果不设置 PopupWindow 的背景，有些版本就会出现一个问题：无论是点击外部区域还是 Back 键都无法 dismiss 弹框

#### showAsDropDown

showAsDropDown(View anchor, int xoff, int yoff, int gravity) 显示在某个指定控件的下方

- 参数 1：anchor 相对某个控件;
- 参数 2：xoff 表示 x 轴的偏移，正值表示向左，负值表示向右；
- 参数 3：yoff 表示相对 y 轴的偏移，正值是向下，负值是向上；
- 参数 4：gravity 相对于 anchor 的对齐方式  

1. showAsDropDown(View anchor)  相对某个控件的位置（正左下方），无偏移

#### showAtLocation

showAtLocation(View parent, int gravity, int x, int y) 显示在 parent 的指定位置

相对于父控件的位置（例如正中央 Gravity.CENTER，下方 Gravity.BOTTOM 等），可以设置偏移或无偏移；parent 指父控件，x,y 可以设置偏移

### PopupWindow 示例

```java
public class MainActivity extends Activity {
    private PopupWindow mPopupWindow;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void click(View view) {
        
        //ImageView iv = (ImageView) findViewById(R.id.iv);
        Button bt = (Button) findViewById(R.id.bt);
        
        //1、创建一个non-focuseable  non-background的PopupWindow
        View contentView = View.inflate(getApplicationContext(), R.layout.popuplayout, null);
        int width = LayoutParams.WRAP_CONTENT;
        int height = LayoutParams.WRAP_CONTENT;
        mPopupWindow = new PopupWindow(contentView, width, height);
        //2、设置背景，要在showAtLocation之前，否则动画播放不了
        mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.RED));
        
        //contentView设置点击事件
        contentView.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "点击了", 0).show();
            }
        });
        
        //contentView中的组件点击事件
        Button btn1 = (Button) contentView.findViewById(R.id.button1);
        Button btn2 = (Button) contentView.findViewById(R.id.button2);
        btn1.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "点击了button1", 0).show();
            }
        });
        btn2.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "点击了button2", 0).show();
            }
        });
        
        //3、播放动画（从无到有，从父亲右下角从小到大）
        //透明动画
        AlphaAnimation aa = new AlphaAnimation(0.0f, 1.0f);
        aa.setDuration(4000);
        //缩放动画
        ScaleAnimation sa = new ScaleAnimation(0.0f, 1.0f, 0.0f, 1.0f, Animation.RELATIVE_TO_PARENT, 1.0f, Animation.RELATIVE_TO_PARENT, 1.0f);
        sa.setDuration(1000);
        
        AnimationSet set = new AnimationSet(true);
        set.addAnimation(aa);
        set.addAnimation(sa);
        contentView.startAnimation(set);
        
        //4、展示出来（如果偏移量超出了屏幕x，y会贴着屏幕边角）
        int gravity = Gravity.CENTER;//Gravity.NO_GRAVITY;效果就是Gravity.LEFT|Gravity.TOP
        int x = -50;
        int y = -100;
        /***
         * parent：相对的父控件
         * gravity：定义圆心
         * x：x轴偏移
         * y：y轴偏移
         */
        //popupWindow.showAtLocation(bt, gravity, x,y);
        
        View anchor =bt ;
        //popupWindow.showAsDropDown(anchor);
        mPopupWindow.showAsDropDown(anchor, 300, 100);
    }
    //Activity销毁时，dismiss该PopupWindow
    @Override
    protected void onDestroy() {
        if (mPopupWindow!=null &&mPopupWindow.isShowing()) {
            mPopupWindow.dismiss();
            mPopupWindow = null;
        }
        super.onDestroy();
    }
}
```

### Popupwindow 半透明背景

不是在 PopupWindow 的 contentview 设置半透明，那么的话，在做动画时，这个半透明背景也会动；而获取这个 activity 的 window 的背景设置不会。

#### 正常手机

```java
/**
 * 设置页面的透明度
 * @param bgAlpha 1表示不透明
 */
public static void setBackgroundAlpha(Activity activity, float bgAlpha) {
	WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
	lp.alpha = bgAlpha;
	activity.getWindow().setAttributes(lp);
}
```

> 此方法在绝大多数手机上都是有效的，但是如果你碰到的是华为手机，那么不好意思，只设置这几行代码是无效的

#### 半透明（华为）

```java
/**
 * 设置页面的透明度
 * @param bgAlpha 1表示不透明
 */
public static void setBackgroundAlpha(Activity activity, float bgAlpha) {
	WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
	lp.alpha = bgAlpha;
	if (bgAlpha == 1) {
		activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);//不移除该Flag的话,在有视频的页面上的视频会出现黑屏的bug
	} else {
		activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);//此行代码主要是解决在华为手机上半透明效果无效的bug
	}
	activity.getWindow().setAttributes(lp);
}
```

对窗体设置了透明度之后一定要记得在 PopupWindow 消失的时候将透明度设置回来：

```java
popupWindow.setOnDismissListener(new PopupWindow.OnDismissListener() {
		@Override
		public void onDismiss() {
			if (activity != null) {
				setBackgroundAlpha(activity, 1f);
			}
		}
	});
```

### PopupWindow 遮住 Status/Navigation Bar

#### setIsClippedToScreen/setClippingEnabled

##### setClippingEnabled

控制 `PopupWindow` 是否允许内容 **超出屏幕物理边界**。

- true 弹窗内容被严格限制在屏幕物理范围内（内容超出屏幕的部分会被裁剪）；默认值
- false 允许弹窗内容超出屏幕边界（可能导致部分内容在屏幕外不可见）

```kotlin
setClippingEnabled(false)
```

##### setIsClippedToScreen

`setIsClippedToScreen(boolean enabled)` 方法控制 `PopupWindow` 的裁剪行为，决定其内容是否限制在屏幕的物理边界内；控制 `PopupWindow` 是否基于 **屏幕坐标系** 而非 **父窗口坐标系** 进行布局。

**为 true 的行为特点：**
- **裁剪到屏幕边界**：`PopupWindow` 的内容不会超出设备的物理屏幕范围。
- **忽略父窗口限制**：即使父 `Activity` 或父视图有内边距（如状态栏、导航栏），弹窗也会基于整个屏幕的坐标系进行布局。
- **系统级适配**：自动处理异形屏（刘海屏、挖孔屏）的适配，确保内容显示在安全区域内。

**为 false 的行为特点**
- **裁剪到父窗口边界**：`PopupWindow` 的内容受父容器（通常是 `DecorView`）的布局限制。
- **依赖父窗口坐标系**：弹窗的位置和尺寸基于父窗口的可见区域计算，可能无法覆盖系统栏。
- **潜在溢出风险**：内容可能被屏幕物理边界截断（如超出屏幕顶部或底部）。
	
**关键差异对比：**

| 特性          | `true`       | `false`    |
| ----------- | ------------ | ---------- |
| **坐标系基准**   | 屏幕物理边界       | 父窗口可见区域    |
| **覆盖系统栏能力** | ✅ 可覆盖状态栏/导航栏 | ❌ 受父窗口边距限制 |
| **异形屏适配**   | 自动处理安全区域     | 依赖父窗口的适配   |
| **内容溢出风险**  | 内容被屏幕边缘裁剪    | 内容被父窗口边界裁剪 |
| **典型应用场景**  | 全屏弹窗、引导页     | 下拉菜单、工具提示  |

需要大于等于 API26

##### 关键差异对比

| 特性           | `setClippingEnabled` | `setIsClippedToScreen` |
| ------------ | -------------------- | ---------------------- |
| **坐标系影响**    | ❌ 不改变布局坐标系           | ✅ 切换坐标系基准（屏幕/父窗口）      |
| **内容可见性**    | 控制内容是否可超出屏幕          | 控制布局是否忽略父窗口边距          |
| **系统 UI 覆盖能力** | 无法覆盖系统栏              | 允许覆盖系统栏                |
| **API 要求**   | 全版本支持                | 仅 API 24+ 可用           |
| **典型应用场景**   | 非全屏弹窗、特殊动画           | 全屏弹窗、沉浸式界面             |

组合使用：

```kotlin
// 创建一个可覆盖状态栏且允许内容超出屏幕的弹窗
val popup = PopupWindow(context).apply {
    // 使用屏幕坐标系（API 24+）
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        setIsClippedToScreen(true)
    }

    // 允许内容超出屏幕边界
    setClippingEnabled(false)

    // 全屏布局
    width = ViewGroup.LayoutParams.MATCH_PARENT
    height = ViewGroup.LayoutParams.MATCH_PARENT
    contentView = layoutInflater.inflate(R.layout.fullscreen_overlay, null)
}

// 显示弹窗（覆盖状态栏）
popup.showAtLocation(
    anchorView,
    Gravity.FILL,
    0,
    0
)
```

##### **适用场景**

###### 场景 1：全屏，在状态栏下？

```kotlin
popup.setIsClippedToScreen(true)
popup.width = ViewGroup.LayoutParams.MATCH_PARENT
popup.showAtLocation(view, Gravity.FILL, 0, 0)
```

###### 场景 2

- 需要与父窗口布局保持一致的局部弹窗
	
- 父窗口已全屏且无需额外处理系统栏覆盖
	
- 弹窗内容需严格限制在父窗口的可见区域内

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
	setIsClippedToScreen(true)
} 
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202502270010101.png)

原理：

```java
// PopupWindow
if (!mClippingEnabled || mClipToScreen) {
	curFlags |= WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
}
```

#### PopupWindow 遮住底部 Navigation Bar

```java
popupWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
```

- 修复 Android 中 Navigation Bar 遮挡 PopupWindow 的问题 <http://droidyue.com/blog/2016/01/10/android-navigation-bar-popupwindow-issue/index.html>

### PopupWindow 做动画

#### 获取不到宽高

**1、View.post**

```kotlin
private inline fun startAnimationSafe(  
    view: View,  
    crossinline onFailed: (tr: Throwable) -> Unit = {},  
    crossinline animAction: () -> Unit,  
) {  
    if (view.width > 0) {  
        kotlin.runCatching {  
            animAction.invoke()  
        }.onFailure {  
            onFailed(it)  
        }  
    } else {  
        view.post {  
            if (!view.isAttachedToWindow) {  
                return@post  
            }  
            kotlin.runCatching {  
                animAction.invoke()  
            }.onFailure {  
                onFailed(it)  
            }  
        }    }  
}
```

**2、onGlobalLayout**

```kotlin
// 延迟执行确保布局完成  
val s = System.currentTimeMillis()  
contentView.viewTreeObserver.addOnGlobalLayoutListener(object :  
    ViewTreeObserver.OnGlobalLayoutListener {  
    override fun onGlobalLayout() {  
        contentView.viewTreeObserver.removeOnGlobalLayoutListener(this)  
        val e = System.currentTimeMillis()  
        Logger.d(TAG, "setupPopupWindow: onGlobalLayout cost=${e - s}ms, setupAnimations()")  
        setupAnimations(couponContainer, targetView)  
    }  
})
```

### PopupWindow 事件

#### isTouchable 和 isFocusable

- 都为 true，点击 popup 弹窗内的按钮可以响应事件；点击 popup 外未遮挡的，dismiss；点击 popup 遮挡的按钮，不会响应事件，popup 自己消费
- isFocusable=true，走到 onTouchEvent，超过 popup 范围，会 dismiss；在范围内，super.onTouchEvent(event);

```java
@Override
public boolean onTouchEvent(MotionEvent event) {
	final int x = (int) event.getX();
	final int y = (int) event.getY();

	if ((event.getAction() == MotionEvent.ACTION_DOWN)
			&& ((x < 0) || (x >= getWidth()) || (y < 0) || (y >= getHeight()))) {
		dismiss();
		return true;
	} else if (event.getAction() == MotionEvent.ACTION_OUTSIDE) {
		dismiss();
		return true;
	} else {
		return super.onTouchEvent(event);
	}
}
```

#### PopupWindow 遮挡和未遮挡按钮事件

1、PopupWindow 默认设置 + `isTouchable=false`

- PopupWindow 上的按钮 `不可以` 响应事件
- `setTouchInterceptor` 有回调，action 为 `MotionEvent.ACTION_OUTSIDE`
- PopupWindow 遮挡住的按钮 `可以` 接收到事件
- PopupWindow 未遮挡住的按钮 `可以` 接收到事件

2、PopupWindow 默认设置，即 `isTouchable=true`

- PopupWindow 上的按钮 `可以` 响应事件
- `setTouchInterceptor` 有回调
- PopupWindow 遮挡住的按钮 `不可以` 接收到事件
- PopupWindow 未遮挡住的按钮 `可以` 接收到事件

**总结：**
- 默认 isTouchable 为 true，表示 PopupWindow 可以处理区域内的事件，其覆盖的按钮接收不到事件
- isTouchable 为 false 后，表示其处理不了事件了，事件都会透传给下面的按钮

#### setOutsideTouchable

setOutsideTouchable 设置生效的前提是 `setTouchable(true)` 和 `setFocusable(false)`

PopupWindow 的默认设置，加上 `setOutsideTouchable=true`，生效

#### 不处理事件

```kotlin
PopupWindow(  
    contentView,  
    ViewGroup.LayoutParams.MATCH_PARENT,  
    ViewGroup.LayoutParams.MATCH_PARENT,  
    false  
)
```

- 第 4 个参数 `focusable` 设置为 false 即可：true 表示 PopupWindow 可以被聚焦，false 则不能

#### 返回键

##### 拦截后退键

- isFocusable=true，按返回键，dismiss PopupWindow

####### 点击外部和返回键 PopupWindow 消失

PopupWindow 默认是退出当前所在的 Activity，即 `mFocusable=false`

如果 PopupWindow 点击外部和返回键消失，设置下面的：

```java
popupWindow.setFocusable(true); // 不退出Activity，dismiss PopupWindow
popupWindow.setOutsideTouchable(true); // 点击外层消失PopupWindow
popupWindow.setBackgroundDrawable(new ColorDrawable());
// 需要注意的是，这些设置需要加载PopupWindow的showXXX方法之前才能起作用，否则不起做用。
```

#### 事件监听

##### setOnKeyListener

```kotlin
// 设置按键监听  
contentView.setOnKeyListener { _, keyCode, event ->  
    if (keyCode == KeyEvent.KEYCODE_BACK && event.repeatCount == 0) { // 按下的如果是BACK，同时没有重复  
        handleBackPressed()  
        true  // 消费返回键事件  
    } else {  
        false  
    }  
}
```

##### 自己控制事件 setTouchInterceptor

前提：mTouchable = true，不设置默认 mTouchable=true

```kotlin
setTouchInterceptor(this)

override fun onTouch(v: View?, event: MotionEvent?): Boolean {
    val x = event?.rawX ?: 0F
    val y = event?.rawY ?: 0F
    if (isTouchPointInView(contentView, x.toInt(), y.toInt())) {// contentView内，交给contentView
        contentView.dispatchTouchEvent(event) 
    } else {
        dismiss() 
        // contentView外dimiss，或者做一些其他操作
        return mOnGiftReceiverPopupOutClickListener?.onOutClick(v, event) ?: true
    }
    return true
}
```

#### PopupWindow 事件透传场景

##### 技术分析

如果让 PopupWindow 响应事件时，通常会设置 `setTouchable(true)`（默认的情况下也是 true），这时用户操作的所有事件都会被 PopupWindow 所拦截。所以在 PopupWindow 下面的 View 都是无法响应事件的，但是我们又希望有一部分的事件是可以进行往下面传递的。这时我们就想到了 PopupWindow 为我们提供的 `setTouchInterceptor`，通过设置方法，我们可以获取用户在 PopupWindow 中所有的事件操作。

```java
/**
 * Set a callback for all touch events being dispatched to the popup
 * window.
 */
public void setTouchInterceptor(OnTouchListener l) {
	mTouchInterceptor = l;
}
```

当我们设置 `mTouchInterceptor` 后，在 dispatchTouchEvent 中所有回调都会优先调用这个类。

```java
@Override
public boolean dispatchTouchEvent(MotionEvent ev) {
	if (mTouchInterceptor != null && mTouchInterceptor.onTouch(this, ev)) {
		return true;
	}
	return super.dispatchTouchEvent(ev);
}
```

我们就可以在这个方法中设置事件透传的区域了。例如：

```java
class HomeGuideStartTurGetCoinsStep extends HomeBaseGuideStep {
    private View mAnchorView;
    private RectF mAnchorRect;

    public HomeGuideStartTurGetCoinsStep(HomeGuidePopWin guidePopWin) {
        super(guidePopWin);
        mAnchorRect = new RectF();
    }

    @Override
    public void showHomeGuide(View anchorView, View... hollowOutView) {
       ...

        if (anchorView != null) {
            int[] location = new int[2];
            anchorView.getLocationOnScreen(location);
            float x = location[0];
            float y = location[1];
            mAnchorRect.set(x, y, x + anchorView.getWidth(), y + anchorView.getHeight());
       ...
    }

    @Override
    public boolean isInterceptTouch(MotionEvent event) {
        //判断如果为执行区域时，则进行事件透传
        if (mAnchorRect != null && mAnchorRect.contains(event.getX(), event.getY())) {
            if (mAnchorView != null) {
                ((Activity) mContext).getWindow().getDecorView().dispatchTouchEvent(event);
            }
            //判断如果为松开状态时，则隐藏当前弹框
            if (event.getAction() == MotionEvent.ACTION_UP) {
                mHomeGuidePopWin.dismiss();
            }
        }
        return true;
    }
}
```

上面的实例代码就是将指定区域的事件给透传给 Activity 的 View 中。以此来达到阻断式引导

##### 场景 1

**需求：**
有时我们弹出一个 PopupWindow 弹窗时，有这么一个需求：

1. 点击弹窗上的控件 (非空白区域) 时，执行控件的点击逻辑；
2. 手指触到弹窗上空白区域时，事件透传到弹窗下的 view，即不影响正常的业务逻辑

**分析：**
需要给弹窗设置一个触摸拦截器，先尝试获取触摸到的子视图，如果有，说明没有触摸到空白区域，弹窗传递并消费事件；否则，说明触摸到了空白区域，先修改事件坐标，再传给 Activity
- 判断当前 view 是不是 ViewGroup：是的话，根据 event 的坐标和 view 的坐标判断 view 是不是被触摸到了；否则对 view 的所有子 view 递归调用 getViewTouchedByEvent()，来获取被触摸事件触摸的最底层的 view。
- 触摸到空白区域时，把触摸事件传给 Activity 前，修改事件坐标的原因：事件坐标是事件在视图中的坐标，而且底层的 Activity 是正常的尺寸，因此需要加上弹窗根视图在屏幕上的坐标偏移量，再传给 Activity。

**参考：**

<https://blog.csdn.net/qq_37475168/article/details/120378731>

##### 场景 2：透传事件给 Activity

**需求：**
- PopupWindow 上的按钮点击响应事件，PopupWindow 外点击不消失
- PopupWindow 遮挡住的按钮，但该区域没有 PopupWindow 内部的能响应事件的控件，遮挡住的能响应事件

**核心代码：**
- isFocusable=true，按回退键，dismiss 当前 PopupWindow；触摸到 outside 会 dismiss
- isTouchable=true，能接收到触摸事件
- setTouchInterceptor 监听触摸事件，处理触摸到 outside 默认 dismiss，交给 Activity window 处理
- 需要注意 outside 的判断

```kotlin
isFocusable = true  
isOutsideTouchable = false  
isTouchable = true  
setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))  

// 添加背景变暗效果  
setOnDismissListener {  
	Logger.d("PopupWindowDemoActivity", "onDismiss")  
	removeBackgroundDim()  
}  


// 有软件键盘时需要设置isFocusable。设置了isFocusable后事件被popup window拦截导致下方的activity窗口没有收到事件，一些埋点之类的逻辑没走到  
// 这里把事件在传给activity  

// 设置了isFocusable后事件被popup window拦截导致下方的activity窗口没有收到事件，下面的按钮点击事件无法响应  
val activity = this@PopupWindowDemoActivity  
isOutsideTouchable = true  
// 设置了isFocusable后事件被popup window拦截导致下方的activity窗口没有收到事件，下面的按钮点击事件无法响应  
setTouchInterceptor { v, event ->  
	val isOutside =  
		((event.x < 0) || ((width > 0 || width == WindowManager.LayoutParams.WRAP_CONTENT || width == WindowManager.LayoutParams.MATCH_PARENT) && event.x >= width)  
				|| (event.y < 0) || (height > 0 || height == WindowManager.LayoutParams.WRAP_CONTENT || height == WindowManager.LayoutParams.MATCH_PARENT) && event.y >= height)  

	if (isFocusable && isOutside) {  
		val x = event.x  
		val y = event.y  
		event.setLocation(event.rawX, event.rawY)  
		val handler = activity.window?.decorView?.dispatchTouchEvent(event)  
		if (handler == true) {  
			
			return@setTouchInterceptor true  
		}
		event.setLocation(x, y)  
	}  
	false  
}
```

- 如点击底部未遮挡的 Checkout 可以响应事件：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503200037244.png)
- 遮挡的 checkout （遮挡处没有其他响应事件的控件）也能响应事件
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202503200037543.png)

##### 代理 PopupWindow 接管事件分发

PopupWindow 没有创建一个新的 Window，它通过 WindowManager 添加一个新的 View，其 Type 为 `TYPE_APPLICATION_PANEL`，因此 PopupWindow 需要 windowToken 来作为依附。

在 PopupWindow 中，我们的 contentView 被包裹进 DecorView，而 DecorView 则是通过 WindowManager 添加到界面中。

由于事件分发是在 DecorView 中，且没有监听器去拦截，**因此我们需要把这个 DecorView 再包多一层我们自定义的控件，然后添加到 Window 中**，这样一来，DecorView 就成了我们的子类，对于事件的分发（甚至是 measure/layout），我们就有了绝对的控制权，BasePopup 正是这样做的。

参考：[Article/亲，还在为PopupWindow烦恼吗.md at master · razerdp/Article · GitHub](https://github.com/razerdp/Article/blob/master/%E4%BA%B2%EF%BC%8C%E8%BF%98%E5%9C%A8%E4%B8%BAPopupWindow%E7%83%A6%E6%81%BC%E5%90%97.md)

## PopupWindow 痛点

### 设置背景的问题

不设置背景就不能响应返回键和点击外部消失的，这个已经有一篇文章进行分析过 [https://cloud.tencent.com/developer/article/1013227](https://cloud.tencent.com/developer/article/1013227?from_column=20421&from=20421)，个人认为就是 api 留下的 bug，有些版本里面修复了这个问题，感兴趣的可以多看看几个版本的源码，还可以看出 Google 是怎么修改的。

### showAsDropDown

showAsDropDown（View anchorView）方法使用也会遇到坑，如果不看 API 注释，会认为 PopupWindow 只能显示在 anchorView 的下面（与 anchorView 左下角对齐显示），但是看了方法注释之后发现此方法是可以让 PopupWindow 显示在 anchorView 的上面的（anchorView 左上角对齐显示）。如果真这样，那实现自适应带箭头的上下文菜单不就很容易了么，事实证明还是会有些瑕疵。

### API 难用

API 设计得不好使，不过这个只能怪自己对 api 理解不够深刻，不过下面几个 api 组合使用还是得介绍一下。

```java
// 如果不设置PopupWindow的背景，有些版本就会出现一个问题：无论是点击外部区域还是Back键都无法dismiss弹框
popupWindow.setBackgroundDrawable(new ColorDrawable());

// setOutsideTouchable设置生效的前提是setTouchable(true)和setFocusable(false)
popupWindow.setOutsideTouchable(true);

// 设置为true之后，PopupWindow内容区域 才可以响应点击事件
popupWindow.setTouchable(true);

// setFocusable=true时，点击返回键先消失 PopupWindow
// 但是设置setFocusable=true时setOutsideTouchable，setTouchable方法就失效了（点击外部不消失，内容区域也不响应事件）
// setFocusable=false时PopupWindow不处理返回键
popupWindow.setFocusable(false);
popupWindow.setTouchInterceptor(new View.OnTouchListener() {
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        return false;   // 这里面拦截不到返回键
    }
});
```

### 事件问题

[Article/亲，还在为PopupWindow烦恼吗.md at master · razerdp/Article · GitHub](https://github.com/razerdp/Article/blob/master/%E4%BA%B2%EF%BC%8C%E8%BF%98%E5%9C%A8%E4%B8%BAPopupWindow%E7%83%A6%E6%81%BC%E5%90%97.md)

## 原理

### 为什么可以点击外面让 PopupWindow 窗口消失，主要是有一个这样的 flag

```java
PopupWindow
|--createPopupLayout()
    |--computeFlags()
WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH，可以监听到outside的触摸，但只会监听到down事件，其他move、up事件监听不到
```

## Ref

- [x] PopupWindow 最全使用说明<br /><https://juejin.im/post/6844903473666850824>
