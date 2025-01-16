---
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:36 晚上
title: Transition Framework(LayoutTransition animations)
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Activity 转场动画 -Content&Shared Element Transition]
linter-yaml-title-alias: Activity 转场动画 -Content&Shared Element Transition
---

# Activity 转场动画 -Content&Shared Element Transition

官方文档：<https://developer.android.com/training/transitions/start-activity#custom-trans>

<https://developer.android.com/training/transitions/start-activity#start-transition>

## Activity 转场动画

### overridePendingTransition（Android5.0 以下）

#### 代码添加转场动画

Android 提供了动画效果，在开发应用时，适当地加入一些过渡动画，会有更好的用户体验。

通常，对 Activity 切换时加入过渡动画的方法是：<br />在 startActivity() 或 finish() ，加入以下这个方法

```java
overridePendingTransition(enterAnim, exitAnim);
```

**overridePendingTransition 没有共享元素的切换效果**

#### style 方式

这样的做法，确实可行，只是在进行统一设置的时候，会比较麻烦，需要在每次 Activity 启动或销毁时调用 overridePendingTransition(),代码量不是一般的多，而且，还会出现漏写的情况！为了解决上面的问题，需要用到 style 和 theme 来解决这个问题。<br />就是覆盖了系统默认的动画。

```xml
<resources>
    <style name="AppBaseTheme" parent="android:Theme.Light"></style>
    <!-- Application theme. -->
    <style name="AppTheme" parent="AppBaseTheme">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowAnimationStyle">@style/ActivitySwitchAnimation</item>
    </style>
    <!-- Activity切换动画统一 -->
    <style name="ActivitySwitchAnimation">
        <item name="@android:activityOpenEnterAnimation">@anim/activity_in</item>
        <item name="@android:activityOpenExitAnimation">@anim/activity_out</item>
        <item name="@android:activityCloseEnterAnimation">@anim/activity_in</item>
        <item name="@android:activityCloseExitAnimation">@anim/activity_out</item>
    </style>
</resources>
```

#### Activity 切换无转场动画

- 1、去掉进入时的动画

```java
public static void launchActivity(Context context) {
    Intent intent = new Intent(context, SearchActivity.class);
    if (!(context instanceof Activity)) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
    context.startActivity(intent);
}
```

- 2、去掉退出时的动画

> 在要退出的 Activity 的 finish() 加上：

```java
@Override
public void finish() {
    super.finish();
    overridePendingTransition(0,0);
}
```

### Content Transition（Activity 进退场动画, Android5.0 及以上）

```
// explode(分解)
从场景中心移入或移出视图

// slide(滑动)
从场景边缘移入或移出视图

// fade(淡出)
通过调整透明度在场景中增添或移除视图
```

### Shared Element Transition（Activity 共享元素动画，Android5.0 及以上）

还支持 4 种**共享元素**（也就是 transitionName 相同的 View [ 不同的 Activity ]）过渡动画：

```
// changeBounds
改变目标视图的布局边界

// changeClipBounds
裁剪目标视图边界

// changeTransform
改变目标视图的缩放比例和旋转角度

// changeImageTransform
改变目标图片的大小和缩放比例
```

<https://github.com/googlesamples/android-ActivitySceneTransitionBasic>

## 使用

### 通过 xml 设置

```xml
<style name="BaseAppTheme" parent="android:Theme.Material">
  <!-- enable window content transitions 开启window content transitions -->
  <item name="android:windowActivityTransitions">true</item>

  <!-- specify enter and exit transitions 指定源进场和出场transitions -->
  <item name="android:windowEnterTransition">@transition/explode</item>
  <item name="android:windowExitTransition">@transition/explode</item>

  <!-- specify shared element transitions 指定共享元素transitions -->
  <item name="android:windowSharedElementEnterTransition">
    @transition/change_image_transform</item>
  <item name="android:windowSharedElementExitTransition">
    @transition/change_image_transform</item>
</style>
```

将要启动的 SecondActivity，那我们就定义 SecondActivity 主题时，设置 SecondActivity 进出场动画：

```xml
<style name="SecondActivityTheme" parent="AppTheme.Base">
    <item name="android:windowContentTransitions">true</item>
    <!-- 进场（Activity进入时）动画 -->
    <item name="android:windowEnterTransition">@transition/transition_explode</item>
    <!-- 出场（Activity退出时）动画 -->
    <item name="android:windowReturnTransition">@transition/transition_fade</item>
</style>
```

在 res 文件夹下新建 transition 文件夹，然后在 res/transition 文件夹下新建 xml 文件：

```xml
// transition_explode.xml
<?xml version="1.0" encoding="utf-8"?>
<transitionSet xmlns:android="http://schemas.android.com/apk/res/android">
    <explode android:duration="1000" android:interpolator="@android:interpolator/accelerate_decelerate" />
</transitionSet>

// transition_fade.xml
<?xml version="1.0" encoding="utf-8"?>
<transitionSet xmlns:android="http://schemas.android.com/apk/res/android">
    <fade android:duration="1000" android:interpolator="@android:interpolator/accelerate_decelerate" />
</transitionSet>
```

转场

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    // 我们这里没有用ActivityCompat转场
    startActivity(new Intent(this, SecondActivity.class), ActivityOptions.makeSceneTransitionAnimation(this).toBundle());
}
```

### 代码设置

通过代码设置，就不一定要定义 xml，因为代码中也有方法支持，如果定义了 xml，可以用下面方式转换

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    Transition transition = TransitionInflater.from(this).inflateTransition(R.transition.transition_explode);
    getWindow().setEnterTransition(transition);
}
```

可以利用 TransitionInflater 获取到我们定义的 Transition 动画。

如果没有定义 transition xml，可以这么设置：

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    getWindow().setEnterTransition(new Explode());
}
```

new Explode() 为 Android 提供的方法，还有其他的

## 进出场动画解释

```
// 目标Activity的进入转场动画
// setEnterTransition() 
// android:windowEnterTransition  
当A start B时，使B中的View进入场景的transition   在B中设置

// 源Activity的退出转场动画
// setExitTransition()  
// android:windowExitTransition  
当A start B时，使A中的View退出场景的transition   在A中设置

// 目标Activity的退出转场动画
// setReturnTransition() 
// android:windowReturnTransition 
当B 返回 A时，使B中的View退出场景的transition   在B中设置

// 源Activity的进入转场动画
// setReenterTransition() 
// android:windowReenterTransition
当B 返回 A时，使A中的View进入场景的transition   在A中设置
```

## Activity 转场动画——ActivityOptions

google 在 Android5.0 中给我们提供了另外一种 Activity 的过度动画——`ActivityOptions`。并且提供了兼容包——`ActivityOptionsCompat`

在使用前，需要声明允许使用 ActivityOptions。<br />在 styles.xml 文件，设置 App 主题时，添加 android:windowContentTransitions 的属性，属性值为 true(好像不设置也可以的)：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light">
        <item name="android:windowContentTransitions">true</item>
    </style>
</resources>
```

主要有：

```java
makeCustomAnimation(Context context, int enterResId, int exitResId)

makeScaleUpAnimation(View source, int startX, int startY, int startWidth, int startHeight)

makeThumbnailScaleUpAnimation(View source, Bitmap thumbnail, int startX, int startY)

makeClipRevealAnimation(View source, int startX, int startY, int width, int height)

makeSceneTransitionAnimation(Activity activity, View sharedElement, String sharedElementName)

makeSceneTransitionAnimation(Activity activity, Pair<View, String>… sharedElements)
```

### makeCustomAnimation（自定义动画布局）

这个和 `overridePendingTransition` 非常类似，确实，在实现效果上和 `overridePendingTransition` 也是相同的。

- ActivityOptionsCompat makeCustomAnimation([@NonNull](/NonNull) Context context,int enterResId, int exitResId) <br />makeCustomAnimation 方法需要 3 个参数（结合例子）：
  1. context：Context 类型，也就是 Activity。
  2. enterResId：int 类型，新 Activity 显示动画。
  3. exitResId：int 类型，当前 Activity 退出动画。

```kotlin
private fun makeCustomAnimationClick() {
    var compat = android.support.v4.app.ActivityOptionsCompat.makeCustomAnimation(this, R.anim.slide_in_bottom, R.anim.slide_out_bottom)
    var intent = Intent(this, Actvitiy转场动画测试::class.java)
    android.support.v4.app.ActivityCompat.startActivity(this, intent, compat.toBundle())
}
```

在退出的时候调用 `ActivityCompat.finishAfterTransition(this)` 进行退出动画。

### makeScaleUpAnimation（缩放）

新 Activity 会以某个点为中心，从某个大小开始逐渐放大到最大。

- ActivityOptionsCompat makeScaleUpAnimation([@NonNull](/NonNull) View source, int startX, int startY, int startWidth, int startHeight)

> makeScaleUpAnimation 需要 5 个参数
>
> 1. view：View 类型，指定从哪个 View 的坐标开始放大。
> 2. view.getWidth() / 2：int 类型，指定以 View 的 X 坐标为放大中心的 X 坐标。
> 3. view.getHeight() / 2：int 类型，指定以 View 的 Y 坐标为放大中心的 Y 坐标。
> 4. 0：int 类型，指定放大前新 Activity 是多宽。
> 5. 0：int 类型，指定放大前新 Activity 是多高。

```kotlin
private fun makeScaleUpAnimationClick(view: View) {
    var compat = android.support.v4.app.ActivityOptionsCompat.makeScaleUpAnimation(view, view.getWidth() / 2, view.getHeight() / 2, 0, 0)
    var intent = Intent(this, Actvitiy转场动画测试::class.java)
    android.support.v4.app.ActivityCompat.startActivity(this, intent, compat.toBundle())
}
```

### makeThumbnailScaleUpAnimation（自定义一张图来缩放过渡）

放大一个图片，最后过度到一个新 activity（我测试的时候，效果不明显）

- ActivityOptionsCompat makeThumbnailScaleUpAnimation([@NonNull](/NonNull) View source, [@NonNull](/NonNull) Bitmap thumbnail, int startX, int startY)

> makeThumbnailScaleUpAnimation 需要 4 个参数（结合例子）：
>
> 1. view：View 类型，要放大的图片从哪个 View 的左上角的坐标作为中心点放大。
> 2. BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher)：Bitmap 类型，指定要放大的图片。
> 3. 0：放大前图片的初始宽度。
> 4. 0：放大前图片的初始高度。

### makeClipRevealAnimation（reveal 动画效果）

与 makeScaleUpAnimation 效果差不多，reveal 动画效果

- ActivityOptionsCompat makeClipRevealAnimation([@NonNull](/NonNull) View source, int startX, int startY, int width, int height) <br />参数同 makeScaleUpAnimation

### makeSceneTransitionAnimation（单个 View，两个 Activity 中 View 完成转场）

两个 Activity 的两个 View 协同完成转场，也就是原 Activity 的 View 过度到新 Activity 的 View，原新两个 Activity 的 View 的 transitionName 相同。

- ActivityOptionsCompat makeSceneTransitionAnimation([@NonNull](/NonNull) Activity activity, [@NonNull](/NonNull) View sharedElement, [@NonNull](/NonNull) String sharedElementName)

> makeSceneTransitionAnimation 方法需要 3 个参数（结合例子）：<br />activity：Context 类型，指定 Activity。<br />sharedElement：View 类型，指定从哪里开始过渡。例子中是 ImgView1 过渡到 ImgView2，所以是 ImgView1。<br />sharedElementName：String 类型，指定 `android:transitionName` 的值，过渡 View 的标志。

```kotlin
private fun makeSceneTransitionAnimationClick(view: View) {
    var intent = Intent(this, ActvitiymakeSceneTransitionAnimation转场动画测试::class.java)
    var compat = android.support.v4.app.ActivityOptionsCompat.makeSceneTransitionAnimation(this, imgView1,
            getString(R.string.transition_name_1))
    ActivityCompat.startActivity(this, intent, compat.toBundle())
}

// Activity1.xml
<LinearLayout>
    <ImageView
            android:id="@+id/imgView1"
            android:layout_width="160dp"
            android:layout_height="90dp"
            android:layout_marginTop="10dp"
            android:src="@drawable/evaluate_face_done"
            android:transitionName="@string/transition_name_1"/>

</LinearLayout>

// ActvitiymakeSceneTransitionAnimation转场动画测试.xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <ImageView
            android:id="@+id/ImgView2"
            android:layout_width="500dp"
            android:layout_height="500dp"
            android:layout_marginTop="10dp"
            android:src="@drawable/evaluate_face_done"
            android:layout_alignParentBottom="true"
            android:transitionName="@string/transition_name_1"/>

</RelativeLayout>

// strings.xml
<string name="transition_name_1">transition_name_1</string>
```

转场前的 Activity 和转场后的 Activity 的 View，要有配置同一个 `android:transitionName` 值。

### makeSceneTransitionAnimation（多个 View）

makeSceneTransitionAnimation 是单个 View 协作，makeSceneTransitionAnimation 允许多个 View 协作，效果和 makeSceneTransitionAnimation 像相似。

- ActivityOptionsCompat makeSceneTransitionAnimation([@NonNull](/NonNull) Activity activity, Pair<View, String>… sharedElements)

**transitionName 值一定要一一对应哦=**

## 自定义 Transitions

<https://developer.android.com/training/transitions/custom-transitions>

# LayoutTransition(布局动画)

## LayoutTransition 介绍

给添加 view，删除 view，显示 view，隐藏 view 时给相应 view 和受影响的其他 view 添加动画。布局动画 `LayoutTransition` 就可以很好地完成这个功能。

LayoutTransition 和属性动画一起在 API 11 时添加它使用的是属性动画，主要负责容器内 item 添加删除时候的效果。

LayoutTransition 字面翻译是布局的过渡也就是布局动画，这个类可以实现 ViewGroup 的布局改变时自动执行动画，LayoutTransition 从 api11 开始提供。给 ViewGroup 设置动画很简单，只需要生成一个 LayoutTransition 实例，然后调用 ViewGroup 的 `setLayoutTransition（LayoutTransition）` 函数就可以了。当设置了布局动画的 ViewGroup 添加或者删除内部 view 时就会触发动画。如果要设置定制的动画，需要调用 `setAnimator()` 方法。

> 布局动画由两种状态的改变导致执行四种不同的动画，两种状态的改变分别是 view 被添加到 ViewGroup（或者变得可见 VISIBILITY），view 被移除 ViewGroup（或者不可见），所以设置 View 可见或者不可见也将触发布局动画添加和删除动画的逻辑（ GONE and VISIBLE）。

四种不同的动画分别是（API11 中添加，API16 添加了 CHANGE 动画）：

1. APPEARING：view 被添加（可见）到 ViewGroup 会触发的动画。
2. DISAPPEARING ：view 被移除（不可见）ViewGroup 会触发的动画。
3. CHANGE_APPEARING ：view 被添加（可见）到 ViewGroup，会影响其他 View，此时其它 View 会触发的动画。
4. CHANGE_DISAPPEARING：view 被移除（不可见）ViewGroup，会影响其他 View，此时其它 View 会触发的动画。
5. API16 添加了 CHANGING 类型 View 在 ViewGroup 中位置改变时的过渡动画，不涉及删除或者添加操作

四种类型的动画都有默认的动画效果，当只为 ViewGroup 设置了 `animateLayoutChanges=true` 后，触发 ViewGroup 中 view 的添加和删除就会触发默认动画。默认情况下 DISAPPEARING 和 CHANGE_APPEARING 类型动画会立即执行，其他类型动画则会有个延迟。会导致如下效果：当一个 View 被添加到布局中，其他受影响的 View 会首先移动，接着当 view 添加到布局时运行 appearing animation。当一个 view 被从布局中移除时，首先运行移除动画，接着运行其他受影响的 view 的动画。可以利用 setDuration 和 setStartDelay 修改延迟时间。

> 如果在 `DISAPPEARING` 动画完成之前运行了 `APPEARING` 动画，则 DISAPPEARING 动画将停止，并且会恢复 DISAPPEARING 动画的效果。如果您在 APPEARING 动画完成之前启动 DISAPPEARING 动画，则会对 APPEARING 动画发生类似作用。

布局动画存在的一些问题：

为布局动画指定的动画，默认的或者用户自定义的，都仅仅是一些模板，简单说就是你指定了动画的值，但是布局动画最终不一定按照你指定的值运行。设置的这些动画有自己的属性值（duration，properties，start delay），但真正运行时动画的开始结束值是进程运行时从 view 的真实情况自动获取，自动设置的。

> ViewGroup 在 xml 文件中设置了 `animateLayoutChanges=true` 会有默认的布局动画，但如果在一个多层嵌套的布局中，由于布局处于多个层级的关系这个布局动画很可能不会工作。有时 CHANGE_APPEARING 和 CHANGE_DISAPPEARING 动画在一个滚动的布局中，可能导致布局动画无法匹配 view 的实际位置导致动画看着不连贯（或者无法到准确位置），这时可以通过禁用 CHANGE_APPEARING 和 CHANGE_DISAPPEARING 动画解决。

## LayoutTransition 默认动画效果

ViewGroup 在 xml 文件中设置了 `animateLayoutChanges=true` 会有默认的布局动画效果。

> 动画执行先后 <br /> 默认情况 `下DISAPPEARING` 和 `CHANGE_APPEARING` 类型动画会立即执行，其他类型动画则会有个延迟。也就是说如果删除 view，被删除的 view 将先执行动画消失，经过一些延迟受影响的 view 会进行动画补上位置，如果添加 view，受影响的 view 将会先给添加的 view 腾位置执行 CHANGE_APPEARING 动画，经过一些时间的延迟才会执行 APPEARING 动画。

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ll_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:animateLayoutChanges="true"
    tools:context=".Main8Activity">

    <Button
        android:id="@+id/btnadd"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="添加view"/>
    <Button
        android:id="@+id/btndel"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="删除view"/>
</LinearLayout>
```

```java
public class Main8Activity extends AppCompatActivity {

    private LinearLayout mContainer;
    private Button mBtnAdd;
    private Button mBtnDel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main8);
        mContainer = findViewById(R.id.ll_container);
        mBtnAdd = findViewById(R.id.btnadd);
        mBtnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Button button = new Button(Main8Activity.this);
                button.setPadding(20,20,20,20);
                button.setText("tempBtn");
                mContainer.addView(button,2);
            }
        });

        mBtnDel = findViewById(R.id.btndel);
        mBtnDel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int count = mContainer.getChildCount();
                if (count >= 3){
                    mContainer.removeViewAt(2 );
                }

            }
        });
    }
}
```

![](https://img-blog.csdnimg.cn/20190103161330159.gif#id=hfgMY&originHeight=536&originWidth=360&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 自定义布局动画

五种不同的动画分别是（api11 中添加，最后 api16 添加）：

1. APPEARING：view 被添加（可见）到 ViewGroup 会触发的动画。
2. DISAPPEARING ：view 被移除（不可见）ViewGroup 会触发的动画。
3. CHANGE_APPEARING ：view 被添加（可见）到 ViewGroup，会影响其他 View，此时其它 View 会触发的动画。
4. CHANGE_DISAPPEARING：view 被移除（不可见）ViewGroup，会影响其他 View，此时其它 View 会触发的动画。
5. API16 添加了 CHANGING 类型，View 在 ViewGroup 中位置改变时的过渡动画，不涉及删除或者添加操作。

**如何给 ViewGroup 添加布局动画：**

1. 生成 LayoutTransition 实例 LayoutTransition layoutTransition = new LayoutTransition();
2. 为 LayoutTransition 各个类型动画设置用户自定义动画，`setAnimator()` 函数
3. 通过 ViewGroup 的 `setLayoutTransition(layoutTransition )` 可以添加布局动画。

setAnimator(int transitionType, Animator animator)<br />参数说明：

```
transitionType：动画类型，分为五种，分别是CHANGE_APPEARING，CHANGE_DISAPPEARING，CHANGING，APPEARING，DISAPPEARING。
animator：相应的动画。

setAnimator方法为每种布局动画设置具体的动画，可以设置ObjectAnimator或者包含属性动画的AnimatorSet。
setStagger() 可以设置每个子view动画的时间间隔。
setDuration() 设置动画时长，默认300ms
```

### APPEARING 和 DISAPPEARING 动画

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/ll_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:animateLayoutChanges="true"
    tools:context=".Main8Activity">

    <Button
        android:id="@+id/btnadd"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="添加view"/>
    <Button
        android:id="@+id/btndel"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="5dp"
        android:text="删除view"/>
</LinearLayout>
```

```java
public class Main8Activity extends AppCompatActivity {
    private LinearLayout mContainer;
    private Button mBtnAdd;
    private Button mBtnDel;
    private LayoutTransition layoutTransition;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main8);
        mContainer = findViewById(R.id.ll_container);

        layoutTransition = new LayoutTransition();
        addCustomTransition();
        mContainer.setLayoutTransition(layoutTransition);

        mBtnAdd = findViewById(R.id.btnadd);
        mBtnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Button button = new Button(Main8Activity.this);
                button.setPadding(20,20,20,20);
                button.setText("tempBtn");
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT);
                mContainer.addView(button,2,params);
            }
        });

        mBtnDel = findViewById(R.id.btndel);
        mBtnDel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int count = mContainer.getChildCount();
                if (count >= 3){
                    mContainer.removeViewAt(2 );
                }

            }
        });
    }

    private void addCustomTransition() {

        /**
         * 移除View时view的DISAPPEARING动画
         */
        ObjectAnimator addAnimator = ObjectAnimator.ofFloat(null, "translationX", 0, 50,0).
                setDuration(1500);
        layoutTransition.setAnimator(LayoutTransition.DISAPPEARING, addAnimator);

        /**
         * 添加view是view的APPEARING动画
         */
        ObjectAnimator removeAnimator = ObjectAnimator.ofFloat(null, "scaleX", 0.5f, 1).
                setDuration(1500);
        layoutTransition.setAnimator(LayoutTransition.APPEARING, removeAnimator);
    }
}
```

添加的动画效果为每次添加 view 时 X 轴从 0.5 缩放到 1.0，删除 view 是 view 向右移动 50px 后回到原点，然后消失。<br />效果图：

![](https://img-blog.csdnimg.cn/20190103161516789.gif#id=SRPYk&originHeight=537&originWidth=360&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### CHANGE_APPEARING 和 CHANGE_DISAPPEARING

1. CHANGE_APPEARING ：view 被添加（可见）到 ViewGroup，会影响其他 View，此时其它 View 会触发的动画。
2. CHANGE_DISAPPEARING：view 被移除（不可见）ViewGroup，会影响其他 View，此时其它 View 会触发的动画。

设置布局动画时需要注意一下几点总结：

```
1. CHANGE_APPEARING和CHANGE_DISAPPEARING布局动画设置必须使用PropertyValuesHolder所构造的动画才会有效果，否则不起作用。

2. PropertyValuesHolder生成动画时，”left”、”top”属性必须有，如果没有则没有动画效果。如果不需要改变这两个值，可以写成写为：
PropertyValuesHolder left = PropertyValuesHolder.ofInt(“left”,0,0);
PropertyValuesHolder top = PropertyValuesHolder.ofInt(“top”,0,0);

3. PropertyValuesHolder中所使用的ofInt,ofFloat中的参数值，第一个值和最后一个值必须相同，不然此属性所对应的的动画将被放弃，在此属性值上将不会有效果；同时不能所有的属性值都相同，否则也将无效（不能写成100,100,100）。
PropertyValuesHolder pvhTop = PropertyValuesHolder.ofInt(“top”, 0, 100,0);

4. 设置动画duration等没有效果
```

```java
//为了防止动画没有效果，把left，right，top，bottom的设置都加上

PropertyValuesHolder changeLeft =
        PropertyValuesHolder.ofInt("left", 0, 0);
PropertyValuesHolder changeTop =
        PropertyValuesHolder.ofInt("top", 0, 0);
PropertyValuesHolder changeRight =
        PropertyValuesHolder.ofInt("right", 0, 0);
PropertyValuesHolder changeBottom =
        PropertyValuesHolder.ofInt("bottom", 0, 0);

/**
 * 添加view时，其他受影响view动画效果
 */
PropertyValuesHolder aniChanApp = PropertyValuesHolder.ofFloat("rotation", 0, 50, 0);
ObjectAnimator changeApp = ObjectAnimator.ofPropertyValuesHolder(this,  changeLeft,changeTop,aniChanApp);

layoutTransition.setAnimator(LayoutTransition.CHANGE_APPEARING, changeApp);

/**
 * 删除view时其他受影响view动画效果
 */
PropertyValuesHolder aniChangeDis = PropertyValuesHolder.ofFloat("rotation", 0, 50, 0);
ObjectAnimator changeDis = ObjectAnimator.ofPropertyValuesHolder(this,changeLeft,changeTop,aniChangeDis);

layoutTransition.setAnimator(LayoutTransition.CHANGE_DISAPPEARING, changeDis);
```

![](https://img-blog.csdnimg.cn/20190103161557530.gif#id=yoyZQ&originHeight=537&originWidth=360&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# Transition Framework 介绍

## Scene

通俗的解释就是这个类存储着一个根 view 下的各种 view 的属性，一般通过 api 获取：

```java
getSceneForLayout (ViewGroup sceneRoot,int layoutId,Context context)
// sceneRoot scene发生改变和动画执行的位置
// layoutId 根View的layoutId
```

## Transition

- ChangeBounds<br />检测 view 的位置边界创建移动和缩放动画；分析比较两个 scene 中 view 的位置边界创建移动和缩放动画
- ChangeTransform<br />检测 view 的 scale 和 rotation 创建缩放和旋转动画
- ChangeClipBounds<br />检测 view 的剪切区域的位置边界，和 ChangeBounds 类似。不过 ChangeBounds 针对的是 view 而 ChangeClipBounds 针对的是 view 的剪切区域 (setClipBound(Rect rect) 中的 rect)。如果没有设置则没有动画效果
- ChangeImageTransform<br />检测 ImageView（这里是专指 ImageView）的尺寸，位置以及 ScaleType，并创建相应动画。主要用于改变 ImageView 的 scaleType 属性时
- Fade,Slide,Explode<br />这三个都是根据 view 的 visibility 的不同分别创建渐入，滑动，爆炸动画。
- AutoTransition(主要用于 width 和 height 的变化时的过渡动画效果)，如果不指定 beginDelayedTransition 的第二个参数，默认的转场效果就是 AutoTransition 。

TransitionSet：用来驱动其他的 Transition .类似于 AnimationSet,能够让一组 Transition 有序，或者同时执行

## 应用 Transition

Transition Framework 核心就是根据 Scene(场景) 的不同帮助开发者们自动生成动画。通常主要是通过以下几个方法开启动画：

```
TransitionManager.go()
TransitionManager.beginDelayedTransition()
setEnterTransition()/setSharedElementEnterTransition()
```

## Scene 和 Transition 关系

Scene 保存了布局的状态，包括所有的控件和控件的属性。布局可以是一个简单的视图控件或者复杂的视图树和子布局。保存了这个布局状态到 Scene 后，我们就可以从另一个场景变化到该场景。从一个场景到另一个场景的变换中会有动画效果，这些动画信息就保存在 Transition 对象中。要运行动画，我们要使用 TransitionManager 实例来应用 Transition。

# TransitionManager

TransitionManager 类用来管理一系列 transition 当 `Scene` 变化时，

## 获取 TransitionManager

## 主要方法

#### 1、go()

go([@NonNull](/NonNull) Scene scene, [@Nullable](/Nullable) Transition transition)

- 第 1 个参数，要切换的场景
- 第 2 个参数，切换时的 Transition，也可以通过代码设置

获取场景，Scene 会缓存在这个 sceneRoot 组件中：

```kotlin
var sceneForLayout1 = Scene.getSceneForLayout(root_transition, R.layout.activity_transition_manager_simple_demo_layout1, this)
```

Transition 也可以通过 xml 定义：

```
<?xml version="1.0" encoding="utf-8"?>
<transitionSet xmlns:tools="http://schemas.android.com/tools"
               xmlns:android="http://schemas.android.com/apk/res/android">
    <slide
            android:slideEdge="top"
            android:duration="2000"
            android:interpolator="@android:interpolator/fast_out_slow_in"
            tools:targetApi="lollipop"/>
</transitionSet>


var transition = TransitionInflater.from(this).inflateTransition(R.transition.demo_transition)
```

#### 2、beginDelayedTransition([@NonNull](/NonNull) final ViewGroup sceneRoot, [@Nullable](/Nullable) Transition transition)

#### 3、endTransitions(final ViewGroup sceneRoot)

#### 4、beginDelayedTransition([@NonNull](/NonNull) final ViewGroup sceneRoot, [@Nullable](/Nullable) Transition transition)

# Ref

- [ ] 安卓过渡动画入门介绍<br /><https://www.jianshu.com/p/10cf22e4703e>
- [ ] Activity 和 Fragment Transition 介绍<br /><http://jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0113/2310.html>

> 系列好文

- [ ] [Android Transition Framework详解---超炫的动画框架](https://www.jianshu.com/p/6ca4e6adadf7)
- [ ] [Android Activity 切换动画及5.0以后的转场动画](https://note.youdao.com/)
- [ ] 轻松实现 Android ShareElement 动画<br /><https://github.com/yellowcath/YcShareElement>
