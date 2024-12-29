---
date created: 2024-09-25 20:56
date updated: 2024-12-24 00:29
dg-publish: true
---

# tint和backgroundTint

## 什么是Tint

自API21(Android L)开始，Android SDK 引入 tint 着色器，可以随意改变安卓项目中图标或者 View 背景的颜色。

### 优点

1. 一定程度上可以减少同一个样式不同颜色图标的数量，从而起到 Apk 瘦身的作用
2. tint属性还可以用在selector中，达到选择器的效果；注意:在使用tint实现选择器的时候，需要在src中设置相应的selector(虽然实现的drawable是一样的，但是还是需要都写)，还要在tint中使用selector才可达到相应的效果。

### 不足

1. 使用 tint 存在一定的兼容性问题。tint属性在Android5.x以上的版本才可以直接使用，那么在低与5.x版本可以在相关向下兼容的代码中实现。

## 相关属性

### android:tint & android:tintMode (ImageView)

tint: 作用于src属性，给图标着色的属性，值为所要着色的颜色值，没有版本限制；通常用于给透明通道的 png 图标或者点九图着色。<br />tintMode: 图标着色模式，值为枚举类型，共有 六种可选值（`add`、`multiply`、`screen`、`src_over`、`src_in`、`src_atop`），仅可用于 API 21 及更高版本。

1. android:tint效果是叠加，而不是直接覆盖。使用tint可以保留原来的阴影波纹等效果
2. android:tint默认`SRC_ATOP`
3. 只能用color，不能用drawable

```xml
<attr name="tint" format="color" />
```

### android:backgroundTint和android:backgroundTintMode (所有控件)

我们可以通过xml中的属性android:backgroundTint和android:backgroundTintMode来设置，android:backgroundTintMode这个属性传的值就是PorterDuff.Mode中的值。android:backgroundTint的话就是传color的值。

那么android:background和android:backgroundTint有什么区别呢？

- 如果设置了android:background，那么控件的背景颜色就会直接修改。
- 如果设置了android:backgroundTint，那么就会将设置的颜色和原来的背景进行一个叠加的过程，至于如何叠加，就是mode。
- 如果控件没有背景，设置backgroundTint无效

### 简单使用

#### 图标着色

backgroundTint: 作用于background属性

> 图标着色：使用 android:tint属性对src属性指向的图标着色处理；背景着色：使用backgroundTint属性对background属性赋予的背景色着色处理

```xml
<TextView
    style="@style/LabelText"
    android:padding="10dp"
    android:text="普通无着色、着红色、着绿色背景橘黄色" />

<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:padding="20dp">

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/chatting_voice_btn_icon" />

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="10dp"
        android:src="@drawable/chatting_voice_btn_icon"
        android:tint="@color/red_A200" />

    <ImageButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="10dp"
        android:background="@color/pink_800"
        android:backgroundTint="@color/orange_700"
        android:src="@drawable/chatting_voice_btn_icon"
        android:tint="@color/green_600" />
</LinearLayout>
```

效果：<br />![](http://note.youdao.com/yws/res/44747/1C9E3F8ABFB74D74A7CD08ADF4689147#id=NXaQw&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688145665076-91415bed-2068-4350-8921-e668e2a22576.png#averageHue=%236d9849&clientId=ueb5ea3fb-fc20-4&from=paste&id=u45d2534b&originHeight=248&originWidth=910&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9be04ff6-273c-48dc-acd5-47d538bd13e&title=)

#### selector

ImageView的src设置selector tint使用

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true">
        <bitmap android:src="@drawable/ic_success" android:tint="#fac300" android:tintMode="multiply"/>
    </item>
    <item android:drawable="@drawable/ic_success"/>
</selector>
<android.support.v7.widget.AppCompatImageView
        android:id="@+id/iv_tint3"
        android:src="@drawable/selector_tint"
        android:onClick="tintMode3"
        android:layout_width="40dp"
        android:layout_height="40dp"/>
```

Button直接设置background：

```xml
<android.support.v7.widget.AppCompatButton
        android:background="@drawable/selector_tint"
        android:clickable="true"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
```

代码设置tint selector

```java
public void setTintSelector() {
    Drawable drawable = ContextCompat.getDrawable(this, R.mipmap.ic_launcher);
    // 颜色数组
    int colors[] = new int[]{ContextCompat.getColor(this, R.color.colorAccent), ContextCompat.getColor(this, R.color.colorPrimary)};

    // 状态
    int states[][] = new int[2][];

    states[0] = new int[]{android.R.attr.state_pressed};
    states[1] = new int[]{};

    // 颜色状态集
    ColorStateList colorStateList = new ColorStateList(states, colors);

    // 状态选择集
    StateListDrawable stateListDrawable = new StateListDrawable();

    stateListDrawable.addState(states[0], drawable);
    stateListDrawable.addState(states[1], drawable);

    Drawable.ConstantState state = stateListDrawable.getConstantState();
    drawable = DrawableCompat.wrap(state == null ? drawable : state.newDrawable()).mutate();
    DrawableCompat.setTintList(drawable, colorStateList);

    test_iv.setImageDrawable(drawable);
    test_iv.setClickable(true);
}
```

#### Java代码操作

Java代码实现tint变色，2种方式，api高于或等于21的直接用setImageTintList进行着色，api低的用着色好的drawable来加载

- 方式1

```java
private void tint_red(){
    //需要api21
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        LogUtil.d("setImageTintList red >>> ");
        ibt_1.setImageTintList(ColorStateList.valueOf(getResources().getColor(R.color.red)));
    }
    else{
        LogUtil.d("setImageDrawable red >>> ");
        ibt_1.setImageDrawable(tintDrawable(this, R.mipmap.dev_printer, R.color.red));
    }
}

public static Drawable tintDrawable(Context context, int resIcon, int resColor){
    //利用ContextCompat工具类获取drawable图片资源
    Drawable drawable = ContextCompat.getDrawable(context, resIcon);
    return tintDrawable(drawable, ContextCompat.getColor(context,resColor));
}

public static Drawable tintDrawable(Drawable drawable, int colors) {
    final Drawable wrappedDrawable = DrawableCompat.wrap(drawable).mutate();
    DrawableCompat.setTint(wrappedDrawable, colors);
    return wrappedDrawable;
}
```

- 方式2 使用DrawableCompat.setTint,setTintList,setTintMode

```java
Drawable originalDrawable = ContextCompat.getDrawable(this, R.mipmap.ic_launcher);
Drawable tintDrawable = DrawableCompat.wrap(originalDrawable).mutate();
DrawableCompat.setTint(tintDrawable, ContextCompat.getColor(this, R.color.common_status_bg_color));
mIvTint2.setImageDrawable(tintDrawable);
```

#### 工具类

```java
public class SelectorUtils {

    public static SelectorUtils instance;

    public static SelectorUtils newInstance() {
        if (instance == null) {
            synchronized (SelectorUtils.class) {
                if (instance == null) {
                    instance = new SelectorUtils();
                }
            }
        }
        return instance;
    }

    /**
     * 主要针对的是ImageView设置图片，
     * 图片资源为一张，通过tint来修改不同状态时显示的不同背景，
     * 以达到节约资源，减少内存的目的
     *
     * @param activity      当前的Activity或者Fragment
     * @param view          需要修改的View，主要只ImageView
     * @param drawableRes   drawable资源id
     * @param normalColor   正常时的颜色
     * @param selectorColor 选中时的颜色
     */
    public void viewSetSelector(Activity activity, View view, int drawableRes, int normalColor, int selectorColor) {
        Drawable drawable = ContextCompat.getDrawable(activity, drawableRes);
        //获得选中颜色和非选中颜色
        int colors[] = new int[]{ContextCompat.getColor(activity, selectorColor),
                ContextCompat.getColor(activity, normalColor)};
        //点击状态数组
        int states[][] = new int[2][];

        //点击状态
        states[0] = new int[]{android.R.attr.state_pressed};
        //非点击状态
        states[1] = new int[]{};
        //存放状态值和颜色
        ColorStateList colorStateList = new ColorStateList(states, colors);

        //存放相应状态和drawable
        StateListDrawable stateListDrawable = new StateListDrawable();
        stateListDrawable.addState(states[0], drawable);
        stateListDrawable.addState(states[1], drawable);

        Drawable.ConstantState state = stateListDrawable.getConstantState();
        drawable = DrawableCompat.wrap(state == null ? drawable : state.newDrawable()).mutate();

        DrawableCompat.setTintList(drawable, colorStateList);
        view.setClickable(true);
        //改变背景Drawable
        view.setBackgroundDrawable(drawable);
        //如果是ImageView，可以设置src相关
        //view.setImageDrawable(drawable);
    }

    /**
     * 改变View的状态的图示,通过Tint减少资源和内存
     *
     * @param activity    当前Activity或者Fragment
     * @param view        当前需要改变的View
     * @param drawableRes 资源id
     * @param colorRes    color资源
     */
    public void changeViewState(Activity activity, View view, int drawableRes, int colorRes) {
        Drawable drawable = ContextCompat.getDrawable(activity, drawableRes);

        int color = ContextCompat.getColor(activity, colorRes);

        Drawable.ConstantState state = drawable.getConstantState();

        drawable = DrawableCompat.wrap(state == null ? drawable : state.newDrawable()).mutate();

        drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());

        DrawableCompat.setTint(drawable, color);

        view.setBackgroundDrawable(drawable);
        //如果是ImageView，可以设置src相关
        //view.setImageDrawable(drawable);
    }
}
```

## Ref

<https://blog.csdn.net/huangxiaoguo1/article/details/63282956><br /><https://blog.csdn.net/u012238268/article/details/53380242>
