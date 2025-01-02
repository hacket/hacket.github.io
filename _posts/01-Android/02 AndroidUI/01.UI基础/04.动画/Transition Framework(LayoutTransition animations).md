---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# Activity转场动画-Content&Shared Element Transition

官方文档：<https://developer.android.com/training/transitions/start-activity#custom-trans>

<https://developer.android.com/training/transitions/start-activity#start-transition>

## Activity转场动画

### overridePendingTransition（Android5.0以下）

#### 代码添加转场动画

Android提供了动画效果，在开发应用时，适当地加入一些过渡动画，会有更好的用户体验。

通常，对Activity切换时加入过渡动画的方法是：<br />在startActivity()或finish() ，加入以下这个方法

```java
overridePendingTransition(enterAnim, exitAnim);
```

**overridePendingTransition没有共享元素的切换效果**

#### style方式

这样的做法，确实可行，只是在进行统一设置的时候，会比较麻烦，需要在每次Activity启动或销毁时调用overridePendingTransition(),代码量不是一般的多，而且，还会出现漏写的情况！为了解决上面的问题，需要用到style和theme来解决这个问题。<br />就是覆盖了系统默认的动画。

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

#### Activity切换无转场动画

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

> 在要退出的Activity的finish()加上：

```java
@Override
public void finish() {
    super.finish();
    overridePendingTransition(0,0);
}
```

### Content Transition（Activity进退场动画, Android5.0及以上）：

```
// explode(分解)
从场景中心移入或移出视图

// slide(滑动)
从场景边缘移入或移出视图

// fade(淡出)
通过调整透明度在场景中增添或移除视图
```

### Shared Element Transition（Activity共享元素动画，Android5.0及以上）

还支持4种**共享元素**（也就是transitionName相同的View [ 不同的Activity ]）过渡动画：

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

### 通过xml设置

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

将要启动的SecondActivity，那我们就定义SecondActivity主题时，设置SecondActivity进出场动画：

```xml
<style name="SecondActivityTheme" parent="AppTheme.Base">
    <item name="android:windowContentTransitions">true</item>
    <!-- 进场（Activity进入时）动画 -->
    <item name="android:windowEnterTransition">@transition/transition_explode</item>
    <!-- 出场（Activity退出时）动画 -->
    <item name="android:windowReturnTransition">@transition/transition_fade</item>
</style>
```

在res文件夹下新建transition文件夹，然后在res/transition文件夹下新建xml文件：

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

通过代码设置，就不一定要定义xml，因为代码中也有方法支持，如果定义了xml，可以用下面方式转换

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    Transition transition = TransitionInflater.from(this).inflateTransition(R.transition.transition_explode);
    getWindow().setEnterTransition(transition);
}
```

可以利用TransitionInflater获取到我们定义的Transition动画。

如果没有定义transition xml，可以这么设置：

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    getWindow().setEnterTransition(new Explode());
}
```

new Explode()为Android提供的方法，还有其他的

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

## Activity转场动画——ActivityOptions

google在Android5.0中给我们提供了另外一种Activity的过度动画——`ActivityOptions`。并且提供了兼容包——`ActivityOptionsCompat`

在使用前，需要声明允许使用ActivityOptions。<br />在styles.xml文件，设置App主题时，添加android:windowContentTransitions的属性，属性值为true(好像不设置也可以的)：

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

这个和`overridePendingTransition`非常类似，确实，在实现效果上和`overridePendingTransition`也是相同的。

- ActivityOptionsCompat makeCustomAnimation([@NonNull ](/NonNull) Context context,int enterResId, int exitResId) <br />makeCustomAnimation方法需要3个参数（结合例子）：
  1. context：Context类型，也就是Activity。
  2. enterResId：int类型，新Activity显示动画。
  3. exitResId：int类型，当前Activity退出动画。

```kotlin
private fun makeCustomAnimationClick() {
    var compat = android.support.v4.app.ActivityOptionsCompat.makeCustomAnimation(this, R.anim.slide_in_bottom, R.anim.slide_out_bottom)
    var intent = Intent(this, Actvitiy转场动画测试::class.java)
    android.support.v4.app.ActivityCompat.startActivity(this, intent, compat.toBundle())
}
```

在退出的时候调用`ActivityCompat.finishAfterTransition(this)`进行退出动画。

### makeScaleUpAnimation（缩放）

新Activity会以某个点为中心，从某个大小开始逐渐放大到最大。

- ActivityOptionsCompat makeScaleUpAnimation([@NonNull ](/NonNull) View source, int startX, int startY, int startWidth, int startHeight)

> makeScaleUpAnimation需要5个参数
>
> 1. view：View类型，指定从哪个View的坐标开始放大。
> 2. view.getWidth() / 2：int类型，指定以View的X坐标为放大中心的X坐标。
> 3. view.getHeight() / 2：int类型，指定以View的Y坐标为放大中心的Y坐标。
> 4. 0：int类型，指定放大前新Activity是多宽。
> 5. 0：int类型，指定放大前新Activity是多高。

```kotlin
private fun makeScaleUpAnimationClick(view: View) {
    var compat = android.support.v4.app.ActivityOptionsCompat.makeScaleUpAnimation(view, view.getWidth() / 2, view.getHeight() / 2, 0, 0)
    var intent = Intent(this, Actvitiy转场动画测试::class.java)
    android.support.v4.app.ActivityCompat.startActivity(this, intent, compat.toBundle())
}
```

### makeThumbnailScaleUpAnimation（自定义一张图来缩放过渡）

放大一个图片，最后过度到一个新activity（我测试的时候，效果不明显）

- ActivityOptionsCompat makeThumbnailScaleUpAnimation([@NonNull ](/NonNull) View source, [@NonNull ](/NonNull) Bitmap thumbnail, int startX, int startY)

> makeThumbnailScaleUpAnimation需要4个参数（结合例子）：
>
> 1. view：View类型，要放大的图片从哪个View的左上角的坐标作为中心点放大。
> 2. BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher)：Bitmap类型，指定要放大的图片。
> 3. 0：放大前图片的初始宽度。
> 4. 0：放大前图片的初始高度。

### makeClipRevealAnimation（reveal动画效果）

与makeScaleUpAnimation效果差不多，reveal动画效果

- ActivityOptionsCompat makeClipRevealAnimation([@NonNull ](/NonNull) View source, int startX, int startY, int width, int height) <br />参数同makeScaleUpAnimation

### makeSceneTransitionAnimation（单个View，两个Activity中View完成转场）

两个Activity的两个View协同完成转场，也就是原Activity的View过度到新Activity的View，原新两个Activity的View的transitionName相同。

- ActivityOptionsCompat makeSceneTransitionAnimation([@NonNull ](/NonNull) Activity activity, [@NonNull ](/NonNull) View sharedElement, [@NonNull ](/NonNull) String sharedElementName)

> makeSceneTransitionAnimation方法需要3个参数（结合例子）：<br />activity：Context类型，指定Activity。<br />sharedElement：View类型，指定从哪里开始过渡。例子中是ImgView1过渡到ImgView2，所以是ImgView1。<br />sharedElementName：String类型，指定`android:transitionName`的值，过渡View的标志。

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

转场前的Activity和转场后的Activity的View，要有配置同一个`android:transitionName`值。

### makeSceneTransitionAnimation（多个View）

makeSceneTransitionAnimation是单个View协作，makeSceneTransitionAnimation允许多个View协作，效果和makeSceneTransitionAnimation像相似。

- ActivityOptionsCompat makeSceneTransitionAnimation([@NonNull ](/NonNull) Activity activity, Pair<View, String>... sharedElements)

**transitionName值一定要一一对应哦=**

## 自定义Transitions

<https://developer.android.com/training/transitions/custom-transitions>

# LayoutTransition(布局动画)

## LayoutTransition介绍

给添加view，删除view，显示view，隐藏view时给相应view和受影响的其他view添加动画。布局动画`LayoutTransition` 就可以很好地完成这个功能。

LayoutTransition和属性动画一起在API 11时添加它使用的是属性动画，主要负责容器内item添加删除时候的效果。

LayoutTransition字面翻译是布局的过渡也就是布局动画，这个类可以实现ViewGroup的布局改变时自动执行动画，LayoutTransition 从api11开始提供。给ViewGroup设置动画很简单，只需要生成一个LayoutTransition实例，然后调用ViewGroup的`setLayoutTransition（LayoutTransition）`函数就可以了。当设置了布局动画的ViewGroup添加或者删除内部view时就会触发动画。如果要设置定制的动画，需要调用`setAnimator()`方法。

> 布局动画由两种状态的改变导致执行四种不同的动画，两种状态的改变分别是view被添加到ViewGroup（或者变得可见VISIBILITY），view被移除ViewGroup（或者不可见），所以设置View可见或者不可见也将触发布局动画添加和删除动画的逻辑（ GONE and VISIBLE）。

四种不同的动画分别是（API11中添加，API16添加了CHANGE动画）：

1. APPEARING：view被添加（可见）到ViewGroup会触发的动画。
2. DISAPPEARING ：view被移除（不可见）ViewGroup会触发的动画。
3. CHANGE_APPEARING ：view被添加（可见）到ViewGroup，会影响其他View，此时其它View会触发的动画。
4. CHANGE_DISAPPEARING：view被移除（不可见）ViewGroup，会影响其他View，此时其它View会触发的动画。
5. API16 添加了CHANGING 类型 View在ViewGroup中位置改变时的过渡动画，不涉及删除或者添加操作

四种类型的动画都有默认的动画效果，当只为ViewGroup设置了`animateLayoutChanges=true`后，触发ViewGroup中view的添加和删除就会触发默认动画。默认情况下DISAPPEARING和CHANGE_APPEARING类型动画会立即执行，其他类型动画则会有个延迟。会导致如下效果：当一个View被添加到布局中，其他受影响的View会首先移动，接着当view添加到布局时运行appearing animation。当一个view被从布局中移除时，首先运行移除动画，接着运行其他受影响的view的动画。可以利用setDuration和setStartDelay修改延迟时间。

> 如果在`DISAPPEARING`动画完成之前运行了`APPEARING`动画，则DISAPPEARING动画将停止，并且会恢复DISAPPEARING动画的效果。如果您在APPEARING动画完成之前启动DISAPPEARING动画，则会对APPEARING动画发生类似作用。

布局动画存在的一些问题：

为布局动画指定的动画，默认的或者用户自定义的，都仅仅是一些模板，简单说就是你指定了动画的值，但是布局动画最终不一定按照你指定的值运行。设置的这些动画有自己的属性值（duration，properties，start delay），但真正运行时动画的开始结束值是进程运行时从view的真实情况自动获取，自动设置的。

> ViewGroup在xml文件中设置了`animateLayoutChanges=true`会有默认的布局动画，但如果在一个多层嵌套的布局中，由于布局处于多个层级的关系这个布局动画很可能不会工作。有时CHANGE_APPEARING 和 CHANGE_DISAPPEARING动画在一个滚动的布局中，可能导致布局动画无法匹配view的实际位置导致动画看着不连贯（或者无法到准确位置），这时可以通过禁用CHANGE_APPEARING 和 CHANGE_DISAPPEARING动画解决。

## LayoutTransition 默认动画效果

ViewGroup在xml文件中设置了`animateLayoutChanges=true`会有默认的布局动画效果。

> 动画执行先后 <br /> 默认情况`下DISAPPEARING`和`CHANGE_APPEARING`类型动画会立即执行，其他类型动画则会有个延迟。也就是说如果删除view，被删除的view将先执行动画消失，经过一些延迟受影响的view会进行动画补上位置，如果添加view，受影响的view将会先给添加的view腾位置执行CHANGE_APPEARING动画，经过一些时间的延迟才会执行APPEARING动画。

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

五种不同的动画分别是（api11中添加，最后api16添加）：

1. APPEARING：view被添加（可见）到ViewGroup会触发的动画。
2. DISAPPEARING ：view被移除（不可见）ViewGroup会触发的动画。
3. CHANGE_APPEARING ：view被添加（可见）到ViewGroup，会影响其他View，此时其它View会触发的动画。
4. CHANGE_DISAPPEARING：view被移除（不可见）ViewGroup，会影响其他View，此时其它View会触发的动画。
5. API16 添加了CHANGING 类型，View在ViewGroup中位置改变时的过渡动画，不涉及删除或者添加操作。

**如何给ViewGroup添加布局动画：**

1. 生成LayoutTransition实例LayoutTransition layoutTransition = new LayoutTransition();
2. 为LayoutTransition 各个类型动画设置用户自定义动画，`setAnimator()`函数
3. 通过ViewGroup的`setLayoutTransition(layoutTransition )`可以添加布局动画。

setAnimator(int transitionType, Animator animator)<br />参数说明：

```
transitionType：动画类型，分为五种，分别是CHANGE_APPEARING，CHANGE_DISAPPEARING，CHANGING，APPEARING，DISAPPEARING。
animator：相应的动画。

setAnimator方法为每种布局动画设置具体的动画，可以设置ObjectAnimator或者包含属性动画的AnimatorSet。
setStagger() 可以设置每个子view动画的时间间隔。
setDuration() 设置动画时长，默认300ms
```

### APPEARING和DISAPPEARING 动画

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

添加的动画效果为每次添加view时X轴从0.5缩放到1.0，删除view是view向右移动50px后回到原点，然后消失。<br />效果图：

![](https://img-blog.csdnimg.cn/20190103161516789.gif#id=SRPYk&originHeight=537&originWidth=360&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### CHANGE_APPEARING 和 CHANGE_DISAPPEARING

1. CHANGE_APPEARING ：view被添加（可见）到ViewGroup，会影响其他View，此时其它View会触发的动画。
2. CHANGE_DISAPPEARING：view被移除（不可见）ViewGroup，会影响其他View，此时其它View会触发的动画。

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

# Transition Framework介绍

## Scene

通俗的解释就是这个类存储着一个根view下的各种view的属性，一般通过api获取：

```java
getSceneForLayout (ViewGroup sceneRoot,int layoutId,Context context)
// sceneRoot scene发生改变和动画执行的位置
// layoutId 根View的layoutId
```

## Transition

- ChangeBounds<br />检测view的位置边界创建移动和缩放动画；分析比较两个scene中view的位置边界创建移动和缩放动画
- ChangeTransform<br />检测view的scale和rotation创建缩放和旋转动画
- ChangeClipBounds<br />检测view的剪切区域的位置边界，和ChangeBounds类似。不过ChangeBounds针对的是view而ChangeClipBounds针对的是view的剪切区域(setClipBound(Rect rect) 中的rect)。如果没有设置则没有动画效果
- ChangeImageTransform<br />检测ImageView（这里是专指ImageView）的尺寸，位置以及ScaleType，并创建相应动画。主要用于改变 ImageView 的 scaleType 属性时
- Fade,Slide,Explode<br />这三个都是根据view的visibility的不同分别创建渐入，滑动，爆炸动画。
- AutoTransition(主要用于width和height的变化时的过渡动画效果)，如果不指定 beginDelayedTransition 的第二个参数，默认的转场效果就是 AutoTransition 。

TransitionSet：用来驱动其他的 Transition .类似于 AnimationSet,能够让一组 Transition 有序，或者同时执行

## 应用Transition

Transition Framework核心就是根据Scene(场景)的不同帮助开发者们自动生成动画。通常主要是通过以下几个方法开启动画：

```
TransitionManager.go()
TransitionManager.beginDelayedTransition()
setEnterTransition()/setSharedElementEnterTransition()
```

## Scene和Transition关系

Scene 保存了布局的状态，包括所有的控件和控件的属性。布局可以是一个简单的视图控件或者复杂的视图树和子布局。保存了这个布局状态到 Scene 后，我们就可以从另一个场景变化到该场景。从一个场景到另一个场景的变换中会有动画效果，这些动画信息就保存在 Transition 对象中。要运行动画，我们要使用 TransitionManager 实例来应用 Transition。

# TransitionManager

TransitionManager类用来管理一系列transition当`Scene`变化时，

## 获取TransitionManager

## 主要方法

#### 1、go()

go([@NonNull ](/NonNull) Scene scene, [@Nullable ](/Nullable) Transition transition)

- 第1个参数，要切换的场景
- 第2个参数，切换时的Transition，也可以通过代码设置

获取场景，Scene会缓存在这个sceneRoot组件中：

```kotlin
var sceneForLayout1 = Scene.getSceneForLayout(root_transition, R.layout.activity_transition_manager_simple_demo_layout1, this)
```

Transition也可以通过xml定义：

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

#### 2、beginDelayedTransition([@NonNull ](/NonNull) final ViewGroup sceneRoot, [@Nullable ](/Nullable) Transition transition)

#### 3、endTransitions(final ViewGroup sceneRoot)

#### 4、beginDelayedTransition([@NonNull ](/NonNull) final ViewGroup sceneRoot, [@Nullable ](/Nullable) Transition transition)

# Ref

- [ ] 安卓过渡动画入门介绍<br /><https://www.jianshu.com/p/10cf22e4703e>
- [ ] Activity和Fragment Transition介绍<br /><http://jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0113/2310.html>

> 系列好文

- [ ] [Android Transition Framework详解---超炫的动画框架](https://www.jianshu.com/p/6ca4e6adadf7)
- [ ] [Android Activity 切换动画及5.0以后的转场动画](https://note.youdao.com/)
- [ ] 轻松实现Android ShareElement动画<br /><https://github.com/yellowcath/YcShareElement>
