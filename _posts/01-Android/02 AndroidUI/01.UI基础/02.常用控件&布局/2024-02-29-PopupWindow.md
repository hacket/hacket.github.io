---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:09 晚上
title: PopupWindow
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [PopupWindow]
linter-yaml-title-alias: PopupWindow
---

# PopupWindow

## 注意

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

1. 设置 PopupWindow 的背景

```java
mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
```

2. 设置 PopupWindow 是否能响应外部点击事件

```java
mPopupWindow.setOutsideTouchable(true);
```

3. pop 显示时， 不让外部 view 响应点击事件

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

### API

#### PopupWindow 与 AlertDialog 的区别

1. AlertDialog 不能指定显示位置，只能默认显示在屏幕最中间（当然也可以通过设置 WindowManager 参数来改变位置）。
2. PopupWindow 是可以指定显示位置的，随便哪个位置都可以，更加灵活。

#### 构造函数

```
//方法一：
public PopupWindow (Context context)
//方法二：
public PopupWindow(View contentView)
//方法三：
public PopupWindow(View contentView, int width, int height)
//方法四：  
public PopupWindow(View contentView, int width, int height, boolean focusable)
```

> 参数 1：contentView，PopupWindow 没有默认布局，需要强制指定

参数 2：width，宽度，必须

参数 3：height，高度，必须

参数 4：focusable，可选

#### setFocusable(boolean focusable)

- public void setFocusable(boolean focusable) PopupWindow 是否具有获取焦点的能力，默认为 False。一般来讲是没有用的，因为普通的控件是不需要获取焦点的，而对于 EditText 则不同，如果不能获取焦点，那么 EditText 将是无法编辑的。

#### setTouchable(boolean touchable)

- public void setTouchable(boolean touchable) 设置 PopupWindow 是否响应 touch 事件，默认是 true，如果设置为 false，即会是下面这个结果：(所有 touch 事件无响应，包括点击事件)

#### setOutsideTouchable(boolean touchable)

PopupWindow 以外的区域是否可点击，即如果点击 PopupWindow 以外的区域，PopupWindow 是否会消失。需要设置 setBackgroundDrawable()

#### setBackgroundDrawable(Drawable background)

不只是设置背景；设置后，setOutsideTouchable() 才会生效；PopupWindow 才会对手机的返回按钮有响应：即，点击手机返回按钮，可以关闭 PopupWindow，如果不加 setBackgroundDrawable() 将关闭的 PopupWindow 所在的 Activity。

#### showAsDropDown(View anchor, int xoff, int yoff, int gravity) 显示在某个指定控件的下方

> 参数 1：anchor 相对某个控件;

参数 2：xoff 表示 x 轴的偏移，正值表示向左，负值表示向右；

参数 3：yoff 表示相对 y 轴的偏移，正值是向下，负值是向上；

参数 4：gravity 相对于 anchor 的对齐方式  

1. showAsDropDown(View anchor)  相对某个控件的位置（正左下方），无偏移

#### showAtLocation(View parent, int gravity, int x, int y) 显示在 parent 的指定位置

相对于父控件的位置（例如正中央 Gravity.CENTER，下方 Gravity.BOTTOM 等），可以设置偏移或无偏移；parent 指父控件，x,y 可以设置偏移

### 示例

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

### PopupWindow 遮住底部 Navigation Bar

```java
popupWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
```

修复 Android 中 Navigation Bar 遮挡 PopupWindow 的问题<br /><http://droidyue.com/blog/2016/01/10/android-navigation-bar-popupwindow-issue/index.html>

### PopupWindow 自己控制事件 setTouchInterceptor

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

### 为什么可以点击外面让 PopupWindow 窗口消失，主要是有一个这样的 flag

```
PopupWindow
|--createPopupLayout()
    |--computeFlags()
WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH，可以监听到outside的触摸，但只会监听到down事件，其他move、up事件监听不到
```

## Ref

- [x] PopupWindow 最全使用说明<br /><https://juejin.im/post/6844903473666850824>
