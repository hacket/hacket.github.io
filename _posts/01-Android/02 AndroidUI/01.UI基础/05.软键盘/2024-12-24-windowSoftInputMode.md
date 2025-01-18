---
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:38 晚上
title: windowSoftInputMode
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Android 中软键盘的显示调整 (windowSoftInputMode)]
linter-yaml-title-alias: Android 中软键盘的显示调整 (windowSoftInputMode)
---

# Android 中软键盘的显示调整 (windowSoftInputMode)

在 Android 中，可以通过给 Activity 设置 `android:windowSoftInputMode` 这个属性来控制软键盘与 Activity 的主窗口的交互方式。

## windowSoftInputMode 小结

Activity 的主窗口与包含屏幕软键盘的窗口的交互方式，该属性的设置影响两个方面：

1. stateXXX，当 Activity 成为用户注意的焦点时软键盘的状态，隐藏还是可见。
2. adjustXXX，对 Activity 主窗口所做的调整，意思是是否将其尺寸调小为软键盘腾出空间，或者当窗口部分被软键盘遮挡时是否平移其内容以使当前焦点可见。
3. 该设置必须是下面所列的值之一，或者是一个 "`stateXXX`" 值加上一个 "`adjustXXX`" 值的组合，在任一组中设置多个值（例如，多个 "`stateXXX`" 值）都会产生未定义结果。各值之间使用垂直条 (`|`) 分隔

```
（1）stateUnspecified：不指定软键盘的状态，系统将选择一个合适的状态或依赖于主题的设置，这是对软键盘行为的默认设置
（2）stateUnchanged：当这个activity出现时，软键盘将一直保持在上一个activity里的状态，无论是隐藏还是显示
（3）stateHidden：用户选择activity时，软键盘总是被隐藏
（4）stateAlwaysHidden：当该Activity主窗口获取焦点时，软键盘也总是被隐藏的
（5）stateVisible：软键盘通常是可见的，用户离开Activity后隐藏了软键盘后再回来，那么软键盘隐藏
（6）stateAlwaysVisible：用户选择activity时，软键盘总是显示的状态；和stateVisible不同，离开后再回来会显示软键盘

（7）adjustUnspecified：主窗口的默认行为，不指定 Activity的主窗口是否调整尺寸以为软键盘腾出空间，或者窗口内容是否进行平移以在屏幕上显露当前焦点。系统会根据窗口的内容是否存在任何可滚动其内容的布局视图来自动选择其中一种模式。如果存在这样的视图，窗口将进行尺寸调整，前提是可通过滚动在较小区域内看到窗口的所有内容。系统自动指定窗口的调整模式，根据不同的情况会选择adjustResize或者adjustPan的一种。
（8）adjustResize：该Activity总是调整屏幕的大小以便留出软键盘的空间；会让布局重新绘制，这种一般适应于带有滑动性质的控制，让其向下滚动，然后适应软键盘的显示。在FullScreen状态下adjustResize flag会被忽略。
（9）adjustPan：不调整 Activity 主窗口的尺寸来为软键盘腾出空间，而是自动平移（translateY）窗口的内容，使当前焦点永远不被键盘遮盖，让用户始终都能看到其输入的内容。这通常不如尺寸调整可取，因为用户可能需要关闭软键盘以到达被遮盖的窗口部分或与这些部分进行交互。
（10）adjustNothing 软键盘弹出时，主窗口Activity不会做出任何响应。
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881480187-8cb19d0c-0852-4a5b-9d94-4702374c206f.png#averageHue=%23faf9f4&clientId=uef9d00b3-90cc-4&from=paste&id=u0f9803bf&originHeight=944&originWidth=1234&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u3b3a762b-728c-4e23-8e53-73e903b3984&title=)<br />![](http://note.youdao.com/yws/res/15238/556F9C0E6383479189F8CF0C71C8F59A#id=Dq2qQ&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 控制软键盘显示还是隐藏 stateXXX

#### stateUnspecified（默认值）

没有设置 `android:windowSoftInputMode` 属性的时候，软件默认采用的就是这种交互方式，系统会根据界面采取相应的软键盘的显示模式。

比如，当界面上只有文本和按钮的时候，软键盘就不会自动弹出，因为没有输入的必要。那么，当界面上出现了获取了焦点的输入框的时候，软键盘会不会自动的弹出呢？这个还真不一定！比如，在下面的这个界面布局中，软键盘并不会自动弹出。

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
      android:layout_width="match_parent"
      android:layout_height="match_parent"
      android:orientation="vertical">
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
</LinearLayout>
```

就是说，默认的，在这种界面情况下，系统并不确定用户是否需要软键盘，因此不会自动弹出。但是，为什么说不一定呢？这是因为，如果我们在这个布局的外面，包裹上一个 ScrollView，软键盘就会自动的弹出来了！如下，在这种布局文件下，软键盘会自动的弹出：

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical">
    <ScrollView
            android:layout_width="match_parent"
            android:layout_height="match_parent">
        <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical">
            <Button
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:onClick="toOther"
                    android:text="跳转"/>
            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>
        </LinearLayout>
    </ScrollView>
</LinearLayout>
```

#### stateUnchanged（取决上一个界面的状态）

中文的意思就是状态不改变的意思。当前界面的软键盘状态，取决于上一个界面的软键盘状态。举个例子，假如当前界面键盘是隐藏的，那么跳转之后的界面，软键盘也是隐藏的；如果当前界面是显示的，那么跳转之后的界面，软键盘也是显示状态。

> 由上一个界面决定软键盘的状态是否显示

#### stateHidden 隐藏键盘

设置了这个属性，那么键盘状态一定是隐藏的，不管上个界面什么状态，也不管当前界面有没有输入的需求，反正就是不显示。因此，我们可以设置这个属性，来控制软键盘不自动的弹出。

当输入框手动点击获取焦点时，会调起软键盘。

#### stateAlwaysHidden 总是隐藏

这个属性也可以让软键盘隐藏，暂时还不知道和 stateHidden 属性的区别

#### stateVisible 显示键盘，离开窗口回来不显示

设置为这个属性，可以将软键盘召唤出来，即使在界面上没有输入框的情况下也可以强制召唤出来。

#### stateAlwaysVisible 总是显示键盘，离开窗口回来后显示

这个属性也是可以将键盘召唤出来，但是与 stateVisible 属性有小小的不同之处。举个例子，当我们设置为 stateVisible 属性，如果当前的界面键盘是显示的，当我们点击按钮跳转到下个界面的时候，软键盘会因为输入框失去焦点而隐藏起来，当我们再次回到当前界面的时候，键盘这个时候是隐藏的。但是如果我们设置为 stateAlwaysVisible，我们跳转到下个界面，软键盘还是隐藏的，但是当我们再次回来的时候，软键盘是会显示出来的。所以，这个 Always 就解释了这个区别，不管什么情况到达当前界面 (正常跳转或者是上一个界面被用户返回)，软键盘都是显示状态。

### 在软键盘弹出时，是否需要 Activity 对此进行调整 adjustXXX

设置软键盘与软件的显示内容之间的显示关系

#### adjustUnspecified（默认值）

默认的模式

1. 如果界面里面有可以滚动的控件，比如 ScrowView，系统会减小可以滚动的界面的大小，从而保证即使软键盘显示出来了，也能够看到所有的内容；有滚动同 adjustResize。
2. 如果布局里面没有滚动的控件，那么软键盘可能就会盖住一些内容；没有滚动，同 adjustPan。

如果我们不设置 "adjustXXX" 的属性，默认值 adjustUnspecified，对于没有滚动控件的布局来说，采用的是 adjustPan 方式，而对于有滚动控件的布局，则是采用的 adjustResize 方式。

#### adjustResize 重绘调整窗口大小（在 FullScreen 状态下 adjustResize flag 会被忽略。）

示 Activity 的主窗口总是会被调整大小，会进行重绘 requestLayout，从而保证软键盘显示空间。

#### adjustPan 平移窗口

Activity 的屏幕大小并不会调整来保证软键盘的空间，而是采取了另外一种策略，系统会通过布局的移动 translationY，来保证用户要进行输入的输入框肯定在用户的视野范围里面，从而让用户可以看到自己输入的内容。对于没有滚动控件的布局来说，这个其实就是默认的设置。

#### adjustNothing 不做操作

软键盘弹出时，主窗口不会做出任何反应。

## 案例

### 一、非滚动布局 xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容1" />
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容2" />
                    ..........<中间包含无数的EditText>
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容12" />
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容13" />

</LinearLayout>
```

#### 1、adjustNothing

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881522642-ebf0261e-6b83-4811-8c10-356f29444067.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=496&id=uf87f4d6c&originHeight=744&originWidth=498&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=82699&status=done&style=none&taskId=u7af6b395-ea90-4dd1-8a24-f3e6d09ccbc&title=&width=332)<br />从上图发现，当点击 EditText12 时，弹出软键盘将主窗口下半部分给遮盖，并且主窗口没有做出任何反应。

#### 2、adjustPan

当设置其属性为 adjustPan 时，当软键盘弹出时，主窗口布局会上移至直到显示 EditText12。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881533788-148387f7-a026-431c-8400-14575623d53d.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=491&id=u5c63c19b&originHeight=737&originWidth=497&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=79962&status=done&style=none&taskId=u402e2223-fa25-4934-a42d-c984203d65c&title=&width=331.3333333333333)

#### 3、adjustResize

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881541577-19a962dc-1846-4a13-82bb-40b365fa9385.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=496&id=u9390e2a8&originHeight=744&originWidth=498&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=82689&status=done&style=none&taskId=ubeaf3cb9-5848-4897-9456-cac38f182ab&title=&width=332)![](http://note.youdao.com/yws/res/15162/3592AE1ABD944FDFB75F2093844CB1A1#id=skdJv&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)<br />设置其属性为 `adjustResize` 时，发现软键盘弹出的状态与 `adjustNoting` 表现一致，当设置 adjustResize 时，布局会为了软键盘弹出而重新绘制给软键盘留出空间，而由于控件无法滑动，所以表现的形式与 adjustNoting 一致。

#### 4、adjustUnspecified

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881562537-d66265c3-2d42-43ec-8173-b36ebf5845bc.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=496&id=u6225785f&originHeight=744&originWidth=502&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=80066&status=done&style=none&taskId=u47aa010f-0a4f-42f1-b1c3-9dd8d5346ff&title=&width=334.6666666666667)<br />当设置其属性为默认属性 `adjustUnspecified` 时，发现当点击 EditText12 时，主窗口上移来保持 EditText12 在软键盘之上，这时 adjustUnspecified 的表现形式与 adjustPan 相同，所以在无滑动的控件上，默认的指定形式为 adjustPan。

### 二、滚动布局 xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <ScrollView   
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <LinearLayout 
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical">
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容1" />
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容2" />
                    ..........<中间包含无数的EditText>
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容12" />
            <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入您要输入的内容13" />
        </LinearLayout>
    </ScrollView>
</LinearLayout>
```

#### 1、adjustNothing

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881588190-ac536b91-10b7-464e-b3b8-edc2c5619a80.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=490&id=udc7fe62b&originHeight=735&originWidth=495&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=80003&status=done&style=none&taskId=u76125e70-952d-42bf-a77c-4eb161dae8c&title=&width=330)<br />![](http://note.youdao.com/yws/res/15196/0E4AA25927A8423EAA8B95F941732B98#id=dXQx6&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

adjustNothing 弹出软键盘将主窗口下半部分给遮盖，并且主窗口没有做出任何反应，和不加 ScrollView 是一样的情况。

#### 2、adjustPan

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881599901-21f0db7b-c43c-4fc2-a4a7-0c60f34d82a7.png#averageHue=%2374845b&clientId=uef9d00b3-90cc-4&from=paste&height=484&id=u1e6f0915&originHeight=726&originWidth=491&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=101587&status=done&style=none&taskId=u35b3b62d-a25d-4fd4-ad09-915185581da&title=&width=327.3333333333333)<br />![](http://note.youdao.com/yws/res/61506/84C3926D46FD40F38D28E9C630EEB42E#id=jcN1E&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

可以发现，在滑动空间下，设置属性 adjustPan 时，依旧会将主窗口上移，来使 EditText13 显示在软键盘之上，可以通过观察 Toolbar 得知

#### 3、adjustResize

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881607787-8adc0f95-114e-45c6-b02b-134a9cce444e.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=491&id=ub5725cfa&originHeight=737&originWidth=497&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=77623&status=done&style=none&taskId=u2f89aab5-7dea-46c0-a3d0-9198bed2edf&title=&width=331.3333333333333)<br />![](http://note.youdao.com/yws/res/15198/FA43246702C146949C757A5ACB555FFC#id=RunMm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

我们可以发现，当设置其属性为 adjustResize 时，当软键盘弹出时，ScrollView 会重新绘制，然后滚动 EditText13 位置，使其显示在软键盘之上。

#### 4、adjustUnspecified

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881618877-062b32db-aaa8-4845-a671-61eb1c7ab2b7.png#averageHue=%23eae8e6&clientId=uef9d00b3-90cc-4&from=paste&height=494&id=u98655a77&originHeight=741&originWidth=493&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=77609&status=done&style=none&taskId=uc57bfdfa-e202-4bec-9524-2a6aa2ba471&title=&width=328.6666666666667)<br />![](http://note.youdao.com/yws/res/15198/FA43246702C146949C757A5ACB555FFC#id=eSX7E&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=320)

当设置其属性为默认属性 adjustUnspecified 时，可以发现在添加了 ScrollView 控件时，布局的窗口并不会上移（这个观察 Toolbar 就可以发现），而通过重绘 ScrollView，让其滚动到最低端，并且给软键盘流出控件，而这个表现即和 adjustResize 完全一致。

## 坑

### Android 全屏状态下弹出输入法 adjustResize 无效的修复方案及踩坑指南

<https://juejin.cn/post/6844903743800999950>

# adjustResize 和 adjustPan 区别

## adjustPan 和 adResize 区别总结

1. adjustPan 不会改变窗口大小，只是平移窗口使软键盘不遮挡住输入框
2. adjustResize 调整窗口的内容区域，DecorView 大小不变。不存在滚动布局时，同 adjustNothing 不会有变化，输入框可能被遮挡；存在滚动布局时，压缩滚动布局的内容，展示输入框，输入框还是有可能被遮挡；用来获取键盘弹出的高度

## adjustPan

Activity 窗口 (DecorView) 大小不变。当获取到焦点的 EditText 位于屏幕下方，软键盘弹出会遮挡到 EditText 时，整个 DecorView 会往上移动，至于上移多少并不确定。<br />一般是上移至使 EditText 刚好不被软键盘遮挡住为止。这个属性用的比较多，常常配合 ScrollView 来使用。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881667546-db5fdbbc-96de-4a0f-8a4e-0104a077df60.png#averageHue=%23faf9f9&clientId=uef9d00b3-90cc-4&from=paste&id=u3a5959ec&originHeight=498&originWidth=521&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7f68672c-33b9-4f8d-911f-75a2a0380fe&title=)

## adjustResize

这种模式会自动调整大小。通过 hierarchy View 观察，decorView 大小本身并不会改变，但是我们的内容区 `contentView (id = android.R.content)` 会相应的缩小，为键盘的显示挪出空间。contentView 的下面为空白区域，软键盘就是覆盖在这个区域。

**注意：** adjustResize 只是调整 contentView 的大小，所以还是有可能覆盖掉 EditText。<br />adjustResize 最有用的是，这种模式可以轻松的获取到软键盘的高度，软键盘弹出后 contentView 高度变化的差值即为软键盘高度。<br />另外：这种模式可能会有个问题，当键盘消失时屏幕会出现一闪感觉有点难受。原因是键盘弹出时，键盘位置显示的是 windowBackground ，如果 windowBackground 为黑色而 Activity 背景为白色，当键盘消失时就会有闪动。解决办法是在 Activity 主题上添加一个 android：windowBackground 属性修改 windows 背景。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881677962-e5fe1626-6491-4d5a-b94c-d39afbbbb779.png#averageHue=%23fefdfa&clientId=uef9d00b3-90cc-4&from=paste&id=ud930221b&originHeight=397&originWidth=599&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8066ac7d-26b5-4793-9b06-3f94cc75635&title=)

### 有滚动控件的 adjustResize

设置了 adjustResize，并且有滚动控件，那么会压缩滚动控件的大小，来显示到 EditText

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:background="@color/red_300"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical">

    <Toolbar
            android:title="这是有滚动控件的adjustResize"
            android:background="@color/black_opacity_50"
            android:layout_width="match_parent"
            android:layout_height="45dp">
    </Toolbar>

    <ScrollView
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:orientation="vertical">

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容1"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容2"/>
            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容3"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容4"/>
            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容5"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容6"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容7"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容8"/>
            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容9"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容10"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容11"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容12"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容13"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容14"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容15"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容16"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容17"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容18"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容19"/>

            <EditText
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="请输入您要输入的内容20"/>

        </LinearLayout>

    </ScrollView>

</LinearLayout>
```

效果：<br /><https://note.youdao.com/src/B97DAAF31F3740268D61D40BB82EF6D5>

![](https://note.youdao.com/src/B97DAAF31F3740268D61D40BB82EF6D5#id=nS6YV&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=400)

---

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".samples.ui.edittext.EditDrawableText.EditDrawableTextActivity">

    <ScrollView android:layout_width="match_parent"
                android:background="@drawable/bg_girl"
                android:layout_weight="1"
                android:layout_height="0dp">

        <LinearLayout
                android:orientation="vertical"
                android:layout_width="match_parent"
                android:layout_height="1000dp">

            <TextView
                    android:text="哈哈哈哈1"
                    android:textColor="@color/black"
                    android:layout_width="match_parent"
                    android:layout_height="200dp"/>

            <TextView
                    android:text="哈哈哈哈2"
                    android:textColor="@color/black"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>

            <TextView
                    android:text="哈哈哈哈3"
                    android:textColor="@color/black"
                    android:layout_width="match_parent"
                    android:layout_height="100dp"/>

            <TextView
                    android:text="哈哈哈哈4"
                    android:textColor="@color/black"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>
            <TextView
                    android:background="@color/black_opacity_20"
                    android:text="哈哈哈哈5"
                    android:textColor="@color/black"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>
            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:layout_height="100dp">

                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>
            </LinearLayout>

            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:layout_height="100dp">
                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>

            </LinearLayout>

            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:layout_height="100dp">

                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>

            </LinearLayout>

            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:gravity="center"
                    android:layout_height="70dp">

                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>

            </LinearLayout>

            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:gravity="center"
                    android:layout_height="70dp">

                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>

            </LinearLayout>

            <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_gravity="bottom"
                    android:gravity="center"
                    android:layout_height="70dp">

                <ImageView
                        android:src="@drawable/bg_girl"
                        android:layout_width="30dp"
                        android:layout_height="30dp"/>

            </LinearLayout>

        </LinearLayout>
    </ScrollView>

    <LinearLayout android:layout_width="match_parent"
                  android:orientation="vertical"
                  android:background="@color/amber_900"
                  android:layout_height="wrap_content">
        <EditText
                android:hint="请输入您的评论"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>
        <LinearLayout
                android:background="@color/blue_100"
                android:layout_width="match_parent"
                android:layout_height="100dp">

        </LinearLayout>
    </LinearLayout>
    
</LinearLayout>
```

效果 - 未弹出键盘图：

![](https://note.youdao.com/src/B7199307C7F74D7FB3A576FC3C2477C1#id=m2e8P&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=400)

效果 - 弹出键盘：

![](https://note.youdao.com/src/AA24067D3C1B48789FFFA72B61913866#id=u3gHi&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=400)

> 可以看到，有滚动控件的会压缩

### 没有滚动控件的 adjustResize

没有滚动控件的 adjustResize，那么表现同 adjustNothing，没有任何变化

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:background="@color/red_300"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
              android:fitsSystemWindows="true"
                android:orientation="vertical">

    <Toolbar
            android:title="这是没有滚动控件的adjustResize"
            android:background="@color/black_opacity_50"
            android:layout_width="match_parent"
            android:layout_height="45dp">
    </Toolbar>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容1"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容2"/>
    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容3"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容4"/>
    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容5"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容6"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容7"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容8"/>

    <EditText
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容1"/>
    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容9"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容10"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容11"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容12"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容13"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容14"/>

    <EditText
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容2"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容15"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容16"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容17"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容18"/>

    <EditText
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容3"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容19"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容20"/>

    <TextView
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容21"/>

    <EditText
            android:layout_width="match_parent"
            android:layout_height="30dp"
            android:hint="请输入您要输入的内容4"/>
</LinearLayout>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687881775799-d85c8978-dea2-494c-8336-658220bf149f.png#averageHue=%23e1a3a3&clientId=uef9d00b3-90cc-4&from=paste&height=823&id=uf4cc57e1&originHeight=1234&originWidth=619&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=189082&status=done&style=none&taskId=ub06dcc71-2381-42ad-84a7-befdc44983c&title=&width=412.6666666666667)<br />![](https://note.youdao.com/yws/res/20919/285D4D1781254B2797CCAE170D1DCA3A#id=C2CSR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=400)
