---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# PopupWindow

## 注意

1. 设置PopupWindow背景(setBackgroundDrawable)，且要在showAtLocation()显示之前设置，否则动画播放不了
2. 退出时，要将PopupWindow给dismiss()掉，否则会leak
3. 需要顺利让PopUpWindow dimiss（即点击PopuWindow之外的地方此或者back键PopuWindow会消失）；PopUpWindow的背景不能为空。必须在popuWindow.showAsDropDown(v);或者其它的显示PopuWindow方法之前设置它的背景不为空
4. 为啥一定需要设置width和height，而不能从布局中获取？

> 没有设置width和height，那mWidth和mHeight将会取默认值0，并不是我们的窗体没有弹出来，而是因为他们的width和height都是0了；因为通过LayoutInflater.from(MainActivity.this).inflate(R.layout.popuplayout, null);得到contentView的，而这个是没有parent的，所以我们需要手动设置width和height

1. 默认情况下popupWindow.setTouchable(true);setOutsideTouchable(true)这里设置显示PopuWindow之后在外面点击是否有效。如果为false的话，那么点击PopuWindow外面并不会关闭PopuWindow。当然这里很明显只能在Touchable下才能使用。
2. 当有mPop.setFocusable(false);的时候，说明PopuWindow不能获得焦点，即使设置设置了背景不为空也不能点击外面消失，只能由dismiss()消失。
3. 使用showAtLocation如果不能定位到具体位置，看看width是否设置成了MATCH_PARENT

## PopupWindow基本用法

### 基本设置

1. 设置PopupWindow的背景

```java
mPopupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
```

2. 设置PopupWindow是否能响应外部点击事件

```java
mPopupWindow.setOutsideTouchable(true);
```

3. pop 显示时， 不让外部 view 响应点击事件

```java
mPopupWindow.setFocusable(true);
```

4. 按键Back dismiss

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

#### PopupWindow与AlertDialog的区别

1. AlertDialog不能指定显示位置，只能默认显示在屏幕最中间（当然也可以通过设置WindowManager参数来改变位置）。
2. PopupWindow是可以指定显示位置的，随便哪个位置都可以，更加灵活。

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

> 参数1：contentView，PopupWindow没有默认布局，需要强制指定

参数2：width，宽度，必须

参数3：height，高度，必须

参数4：focusable，可选

#### setFocusable(boolean focusable)

- public void setFocusable(boolean focusable) PopupWindow是否具有获取焦点的能力，默认为False。一般来讲是没有用的，因为普通的控件是不需要获取焦点的，而对于EditText则不同，如果不能获取焦点，那么EditText将是无法编辑的。

#### setTouchable(boolean touchable)

- public void setTouchable(boolean touchable) 设置PopupWindow是否响应touch事件，默认是true，如果设置为false，即会是下面这个结果：(所有touch事件无响应，包括点击事件)

#### setOutsideTouchable(boolean touchable)

PopupWindow以外的区域是否可点击，即如果点击PopupWindow以外的区域，PopupWindow是否会消失。需要设置setBackgroundDrawable()

#### setBackgroundDrawable(Drawable background)

不只是设置背景；设置后，setOutsideTouchable()才会生效；PopupWindow才会对手机的返回按钮有响应：即，点击手机返回按钮，可以关闭PopupWindow，如果不加setBackgroundDrawable()将关闭的PopupWindow所在的Activity。

#### showAsDropDown(View anchor, int xoff, int yoff, int gravity) 显示在某个指定控件的下方

> 参数1：anchor 相对某个控件;

参数2：xoff表示x轴的偏移，正值表示向左，负值表示向右；

参数3：yoff表示相对y轴的偏移，正值是向下，负值是向上；

参数4：gravity相对于anchor的对齐方式  

1. showAsDropDown(View anchor)  相对某个控件的位置（正左下方），无偏移

#### showAtLocation(View parent, int gravity, int x, int y) 显示在parent的指定位置

相对于父控件的位置（例如正中央Gravity.CENTER，下方Gravity.BOTTOM等），可以设置偏移或无偏移；parent指父控件，x,y可以设置偏移

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

### Popupwindow半透明背景

不是在PopupWindow的contentview设置半透明，那么的话，在做动画时，这个半透明背景也会动；而获取这个activity的window的背景设置不会。

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

对窗体设置了透明度之后一定要记得在PopupWindow消失的时候将透明度设置回来：

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

### PopupWindow遮住底部Navigation Bar

```java
popupWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
```

修复Android中Navigation Bar遮挡PopupWindow的问题<br /><http://droidyue.com/blog/2016/01/10/android-navigation-bar-popupwindow-issue/index.html>

### PopupWindow自己控制事件 setTouchInterceptor

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

### 为什么可以点击外面让PopupWindow窗口消失，主要是有一个这样的flag

```
PopupWindow
|--createPopupLayout()
    |--computeFlags()
WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH，可以监听到outside的触摸，但只会监听到down事件，其他move、up事件监听不到
```

## Ref

- [x] PopupWindow最全使用说明<br /><https://juejin.im/post/6844903473666850824>
