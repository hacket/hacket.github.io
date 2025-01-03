---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# 圆形揭露动画(Circular Reveal)

<https://developer.android.com/training/animation/reveal-or-hide-view?hl=zh-cn#Reveal>

在 Android 5.0 及更高的版本中，加入了一种全新的视觉动画效果，就是揭露动画。揭露动画在系统中很常见，就是类似波纹的效果， 从某一个点向四周展开或者从四周向某一点聚合起来，可以用在 Activity 里面的 View 动画效果， 也可以使用在 Activity 跳转过渡动画中。

## Circular Reveal

使用揭露动画非常简单，Android Sdk 中已经帮我们提供了一个工具类 ViewAnimationUtils 来创建揭露动画。ViewAnimationUtils 里面只有一个静态方法 createCircularReveal(View view, int centerX, int centerY, float startRadius, float endRadius)， 返回一个 Animator 动画对象。

方法原型：

```java
public final class ViewAnimationUtils {
    private ViewAnimationUtils() {}
    /**
     * ......
     * @param view The View will be clipped to the animating circle.
     * @param centerX The x coordinate of the center of the animating circle, relative to
     *                <code>view</code>.
     * @param centerY The y coordinate of the center of the animating circle, relative to
     *                <code>view</code>.
     * @param startRadius The starting radius of the animating circle.
     * @param endRadius The ending radius of the animating circle.
     */
    public static Animator createCircularReveal(View view,
            int centerX,  int centerY, float startRadius, float endRadius) {
        return new RevealAnimator(view, centerX, centerY, startRadius, endRadius);
    }
}
```

ViewAnimationUtils.createCircularReveal() 方法能够为裁剪区域添加动画以揭露或隐藏视图。我们主要使用 createCircularReveal 方法， 该方法有四个参数:

1. view 第一个参数是执行揭露动画的 View 视图
2. centerX 第二个参数是相对于视图 View 的坐标系，动画圆的中心的x坐标
3. centerY 第三个参数是相对于视图 View 的坐标系，动画圆的中心的y坐标
4. startRadius 第四个参数是动画圆的起始半径。如果为0表示隐藏
5. endRadius 第五个参数动画圆的结束半径。如果太小，就会揭露动画就是显示不全；如果太大，就会一闪而过

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688211608896-3ecb9285-c80e-44dc-a550-ec9a5980ee57.png#averageHue=%23eadbac&clientId=u5b64d56f-58a9-4&from=paste&height=337&id=ue9356f8c&originHeight=673&originWidth=765&originalType=binary&ratio=2&rotation=0&showTitle=false&size=180315&status=done&style=none&taskId=u27cb360e-b479-476e-a8a5-8b06a5b7f9f&title=&width=382.5)<br />![](http://note.youdao.com/yws/res/39077/9C712334C05F4432BFB9DE41C2EF1A88#id=mzApS&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

揭露动画有两种效果，一种是显示一组UI元素，另一种是隐藏一组UI元素：

1. 以中心点为轴点，当开始半径小于结束半径时，从开始半径处向外扩大到结束半径处显示View
2. 以中心点为轴点，当开始半径大于结束半径时，从开始半径处向内缩小到结束半径处隐藏View

> 重要特性
>
> 1. 揭露动画是一个异步动画，它的回调方法都不能保证在准确的时间里调用，但误差不会很大。
> 2. 揭露对象要先于动画开始前显示（View.VISIBLE），因为如果动画开始时，要揭露的对象处于隐藏状态，那么动画就不会有效果，因为隐藏状态是看不到效果的。所以是不能 在动画结束的回调里才设置 View VISIBLE，这时动画已经结束了不会看到任何效果了。(揭露动画时View需要visible)
> 3. 注意：揭露动画对象只能使用一次，不能被重新使用，也就是说每次使用揭露动画都要调用 ViewAnimationUtils.createCircularReveal()返回一个揭露动画对象使用，同时一旦开始了动画就不能暂停或重新开始。揭露动画是一种异步动画，可以自动运行在 UI 线程上。 当揭露动画结束后，如果设置了 Animator.AnimatorListener 监听器，那么监听器的 onAnimationEnd(Animator) 方法会被调用， 但可能会被延迟调用，这取决于线程的响应能力。

### View上应用

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688211678478-5abe32be-f9f0-4506-a3f8-1eefa4434f35.png#averageHue=%23d5fef6&clientId=u5b64d56f-58a9-4&from=paste&height=228&id=u72e960db&originHeight=455&originWidth=474&originalType=binary&ratio=2&rotation=0&showTitle=false&size=195595&status=done&style=none&taskId=u9de48921-dca2-46cc-86e4-b9071c97313&title=&width=237)

```java
fab.setOnClickListener(... {
        launchRevealAnimation();
});

private void launchRevealAnimation() {
    //求出第2个和第3个参数
    int[] vLocation = new int[2];
    fab.getLocationInWindow(vLocation);
    int centerX = vLocation[0] + fab.getWidth() / 2;
    int centerY = vLocation[1] + fab.getHeight() / 2;

    //求出要揭露 View 的对角线，来作为扩散圆的最大半径
    int hypotenuse = (int) Math.hypot(mPuppet.getWidth(), mPuppet.getHeight());

    if (flag) {//隐藏 揭露对象
        Animator circularReveal = ViewAnimationUtils.createCircularReveal(mPuppet, centerX, centerY, hypotenuse, 0);
        circularReveal.setDuration(2000);
        circularReveal.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {}

            @Override
            public void onAnimationEnd(Animator animation) {
                mPuppet.setVisibility(View.GONE);
            }

            @Override
            public void onAnimationCancel(Animator animation) {}

            @Override
            public void onAnimationRepeat(Animator animation) {}
        });
        circularReveal.start();
        flag = false;
    } else {//显示 揭露对象
        Animator circularReveal = ViewAnimationUtils.createCircularReveal(mPuppet, centerX, centerY, 0, hypotenuse);
        circularReveal.setDuration(2000);
        //注意：这里显示 mPuppet 调用并没有在监听方法里，并且是在动画开始前调用。
        mPuppet.setVisibility(View.VISIBLE);
        circularReveal.start();
        flag = true;
    }
}
```

### Activity跳转使用揭露动画

待补充

## Ref

<https://github.com/hacket/Android-Animation-Set/tree/master/reveal-animation>

# Animate View State Changes / 视图状态动画

## 视图状态动画

所谓视图状态动画，就是 View 在状态改变时执行的动画效果。和之前我们通过 selector 选择器给 Button 设置不同状态下的背景效果是一样一样的。

因为视图状态动画是在 View 不同的状态下产生的动画效果，所以我们先来看一下 View 都有哪些状态：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688211762789-d5846842-10fb-4c38-9cf1-3f9aa0b667e4.png#averageHue=%23eeeff0&clientId=u5b64d56f-58a9-4&from=paste&height=693&id=ua7263102&originHeight=1386&originWidth=2076&originalType=binary&ratio=2&rotation=0&showTitle=false&size=343886&status=done&style=none&taskId=u3b7e47ef-1a86-41f0-92da-b508d4503d1&title=&width=1038)<br />![](http://note.youdao.com/yws/res/39206/6B2AF578CC1E435BA3269050DDC0C48E#id=Oa3gN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />View 状态改变的动画主要是两个类：

1. StateListAnimator 是个动画, 在 res/anim (或者 res/animator)中（官方文档是放在res/xml中）
2. AnimatedStateListDrawable 是个 Drawable, 在 res/drawable 中。

## StateListAnimator

- [x] 使用 StateListAnimator 为视图状态更改添加动画效果

<https://developer.android.com/guide/topics/graphics/prop-animation#ViewState>

通过 StateListAnimator 类，您可以定义在视图状态更改时运行的 Animator。此对象充当 Animator 对象的封装容器，只要指定的视图状态（例如“按下”或“聚焦”）发生更改，就会调用该动画。

可使用根  元素和子  元素在 XML 资源中定义 StateListAnimator，每个元素都指定一个由 StateListAnimator 类定义的不同视图状态。每个  都包含一个属性动画集的定义。

### 创建了一个状态列表 Animator，可在按下后更改视图的 x 和 y 比例：

res/xml/animate_scale.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- the pressed state; increase x and y size to 150% -->
    <item android:state_pressed="true">
        <set>
            <objectAnimator android:propertyName="scaleX"
                android:duration="@android:integer/config_shortAnimTime"
                android:valueTo="1.5"
                android:valueType="floatType"/>
            <objectAnimator android:propertyName="scaleY"
                android:duration="@android:integer/config_shortAnimTime"
                android:valueTo="1.5"
                android:valueType="floatType"/>
        </set>
    </item>
    <!-- the default, non-pressed state; set x and y size to 100% -->
    <item android:state_pressed="false">
        <set>
            <objectAnimator android:propertyName="scaleX"
                android:duration="@android:integer/config_shortAnimTime"
                android:valueTo="1"
                android:valueType="floatType"/>
            <objectAnimator android:propertyName="scaleY"
                android:duration="@android:integer/config_shortAnimTime"
                android:valueTo="1"
                android:valueType="floatType"/>
        </set>
    </item>
</selector>
```

要将状态列表 Animator 附加到视图，请添加 android:stateListAnimator 属性，如下所示：

```xml
<Button android:stateListAnimator="@xml/animate_scale"
        ... />
```

或者使用代码：

```kotlin
val animator = AnimatorInflater.loadStateListAnimator(this, R.animator.animate_scale)
tv_animate_scale.stateListAnimator = animator
```

### 按下z轴变化

```xml
<?xml version="1.0" encoding="utf-8"?><!-- animate the translationZ property of a view when pressed -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true">
        <set>
            <objectAnimator
                android:duration="@android:integer/config_shortAnimTime"
                android:propertyName="translationZ"
                android:valueTo="50dp"
                android:valueType="floatType" />
            <!-- you could have other objectAnimator elements
                 here for "x" and "y", or other properties -->
        </set>
    </item>

    <item
        android:state_enabled="true"
        android:state_pressed="false">
        <set>
            <objectAnimator
                android:duration="100"
                android:propertyName="translationZ"
                android:valueTo="0"
                android:valueType="floatType" />
        </set>
    </item>
</selector>
```

> 如果是TextView要先设置background才有效果

## AnimatedStateListDrawable

您还可以使用 AnimatedStateListDrawable 在状态更改间播放可绘制动画，而不是为视图的属性添加动画效果。Android 5.0 中的一些系统微件默认会使用这些动画。以下示例展示了如何将 AnimatedStateListDrawable 定义为 XML 资源：

```xml
<!-- res/drawable/myanimstatedrawable.xml -->
<animated-selector
    xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- provide a different drawable for each state-->
    <item android:id="@+id/pressed" android:drawable="@drawable/drawableP"
        android:state_pressed="true"/>
    <item android:id="@+id/focused" android:drawable="@drawable/drawableF"
        android:state_focused="true"/>
    <item android:id="@id/default"
        android:drawable="@drawable/drawableD"/>

    <!-- specify a transition -->
    <transition android:fromId="@+id/default" android:toId="@+id/pressed">
        <animation-list>
            <item android:duration="15" android:drawable="@drawable/dt1"/>
            <item android:duration="15" android:drawable="@drawable/dt2"/>
            ...
        </animation-list>
    </transition>
    ...
</animated-selector>
```

# Touch feedback

在Android L 5.0中加入了触摸反馈动画。其中最明显，最具代表性的就是波纹动画，比如当点击按钮或条目时会从点击的位置产生类似于波纹的扩散效果。

## Material Design

Button 在 MD 中默认就有一个反馈动画，使用的是 RippleDrawable 类，这个类很有意思，它根据手指与 UI 交互的不同状态(例如，长按，短按，抬起)转化为不同的波纹效果(Ripple Effect)。

并不是所有的控件都有默认的触摸反馈的波纹效果，例如 TextView

可以使用系统提供的两个属性来在 XML 中给 View 设置背景，也就是 `android:background`：

- android:background="?android:attr/selectableItemBackground" 波纹有边界
- android:background="android:attr/selectableItemBackgroundBorderless" 波纹超出边界

> `selectableItemBackgroundBorderless` 在 API 21 才可用。

设置颜色:

> android:colorControlHighlight：设置波纹颜色，涟漪

使用效果如下：

1. B1是不设任何背景的按钮
2. B2设置了?android:attr/selectableItemBackground
3. B3设置了?android:attr/selectableItemBackgroundBorderless

![](http://note.youdao.com/yws/public/resource/28bccb89f64179cdd3eb7500a4dc8c01/C0E8E337AC3F4551A0D2A4B89CDF7C9A#height=538&id=Y56E2&originHeight=866&originWidth=491&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=305)

### 自定义RippleDrawable（继承LayerDrawable）

#### 简单ripple

无边界限制

```xml
<?xml version="1.0" encoding="utf-8"?>
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
        android:color="@color/colorPrimary">
</ripple>
```

![](http://note.youdao.com/yws/public/resource/a8ff1e0edcb2dfee5d6c71c9560b5dc2/WEBRESOURCE5b32e5fef43ab101171a8ab3038e61c4?ynotemdtimestamp=1688211925165#height=503&id=nrwqj&originHeight=846&originWidth=427&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=254)<br />![](http://note.youdao.com/yws/res/39138/WEBRESOURCE5b32e5fef43ab101171a8ab3038e61c4#id=Ixd8f&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 添加layer

RippleDrawable 是继承自 LayerDrawable，所以可以加一层 layer，来限制波纹的大小

```xml
<?xml version="1.0" encoding="utf-8"?>
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
        android:color="@color/colorPrimary">  <!--按下颜色-->
    <item android:drawable="@android:color/white"/> <!--填充颜色-->
</ripple>
```

![](http://note.youdao.com/yws/res/39146/WEBRESOURCEbcee90d058770eec7a47ba4d6a20af91#id=G4Bef&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](http://note.youdao.com/yws/public/resource/a8ff1e0edcb2dfee5d6c71c9560b5dc2/WEBRESOURCEbcee90d058770eec7a47ba4d6a20af91?ynotemdtimestamp=1688211925165#id=bTL78&originHeight=846&originWidth=427&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> 带边框的波纹

#### 添加mask

其实 RippleDrawable 还有一个很有意思的事情，它又一个遮罩层，id固定为`android.R.id.mask`，既然叫做遮罩层，那就是限制波纹的范围了。

```xml
<?xml version="1.0" encoding="utf-8"?>
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
        android:color="@color/colorPrimary">

    <item android:drawable="@android:color/white"/>

    <item
        android:id="@android:id/mask"
        android:drawable="@drawable/ripple_mask"/>
</ripple>
```

res/ripple_mask.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
       android:shape="oval">
    <solid android:color="@android:color/holo_red_light"/>
</shape>
```

![](http://note.youdao.com/yws/res/39161/WEBRESOURCE84bea8f37ef1962549650491c01672b9#id=OZFk8&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](http://note.youdao.com/yws/public/resource/a8ff1e0edcb2dfee5d6c71c9560b5dc2/WEBRESOURCE84bea8f37ef1962549650491c01672b9?ynotemdtimestamp=1688211925165#id=was9m&originHeight=846&originWidth=427&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### mask设置为GradientDrawable

res/ripple_mask.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
       android:shape="oval">
    <stroke
        android:width="10dp"
        android:color="@android:color/black"/>
</shape>
```

![](http://note.youdao.com/yws/public/resource/a8ff1e0edcb2dfee5d6c71c9560b5dc2/WEBRESOURCEea822624bb9a7fd7ba83302d39aae2cc?ynotemdtimestamp=1688211925165#id=W3Enb&originHeight=846&originWidth=427&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# VectorDrawable、Animated Vector Drawable

见`SVG`章节

# Curved motion（曲线运动）

见`属性动画PathInterpolator`
