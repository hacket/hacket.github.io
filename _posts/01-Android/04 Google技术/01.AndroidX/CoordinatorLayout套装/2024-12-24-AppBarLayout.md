---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# AppbarLayout

## AppbarLayout介绍、用途

AppBarLayout，顾名知意，就是用来给AppBar布局的容器，是LinearLayout的子类。而AppBar就包含我们通常所知道的ActionBar，Toolbar。

AppBarLayout继承自LinearLayout，布局方向为垂直方向。所以你可以把它当成垂直布局的LinearLayout来使用。AppBarLayout是在LinearLayou上加了一些材料设计的概念，它可以让你定制当**_某个可滚动View_**的滚动手势发生变化时，其内部的子View实现何种动作。

**请注意**：上面提到的**_某个可滚动View_**，可以理解为某个ScrollView。怎么理解上面的话呢？就是说，当某个ScrollView发生滚动时，你可以定制你的"顶部栏"应该执行哪些动作（如跟着一起滚动、保持不动等等）。

Material App bar:<br /><https://material.google.com/layout/structure.html#structure-app-bar>

## 使用

### 步骤

1. `AppBarLayout`需要作为`CoordinatorLayout`的直接子View。如果在其他的ViewGroup中，大部分功能失效。<br />内部的子View通过在布局中加`app:layout_scrollFlags`设置执行的动作，或者代码`AppBarLayout.LayoutParams.setScrollFlags(int)`

```xml
app:layout_scrollFlags
```

2. `AppBarLayout`需要一个可滚动的兄弟View用来告知什么时候滚动。已经存在一个Behavior:`AppBarLayout.ScrollingViewBehavior`

### 属性

- scroll 所有想滚动出屏幕的view都需要设置这个flag，没有设置这个flag的view将被固定在屏幕顶部。
- enterAlways 实现quick return效果，当向下移动时，立即显示View(如Toolbar)
- exitUntilCollapsed 向上滚动时收缩View，当可以固定Toolbar一直在上面
- enterAlwaysCollapsed 当你的View已经设置minHeight属性又使用此标志时，你的View只能以最小的高度进入，只有当滚动视图到达顶部时才扩大的完整高度

> enterXXX表示进入，指向下滑动（手指从上往下滑动）；exitXXX表示退出，指向上滑动（手指从下往上滑动）

#### scroll

View会跟随滚动事件一起发生移动。就是当指定的ScrollView发生滚动时，该View也跟随一起滚动，就好像这个View也属于这个ScrollView一样；向上滑动过程中停下来会保持那个状态；当已经完全滚动上去时，再向下滚动ScrollView需要ScrollView滚动到最上面时该View才会跟随ScrollView滚动<br />![](http://upload-images.jianshu.io/upload_images/2154124-3be36f546d6f5bbd?imageMogr2/auto-orient/strip#id=Dgkl2&originHeight=579&originWidth=346&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />**scroll小结**<br />往上跟着滑动退出，往下到顶时进入

#### enterAlways

当ScrollView往下滚动时，该View会直接往下滚动。而不用考虑ScrollView是否在滚动。和scroll的区别是，scroll需要ScrollView滚动到顶再往下滚动，该View才会滚动下来，而enterAlways是只要ScrollView你往下滚动，而不关心ScrollView是否到顶了该View都会滚动。需要配合scroll使用，要不然该View滚动不上去。<br />![](http://upload-images.jianshu.io/upload_images/2154124-0c127a011cd0706e?imageMogr2/auto-orient/strip#id=II8et&originHeight=579&originWidth=346&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />**enterAlways小结**<br />往上给scroll，只要往下就进入

#### exitUntilCollapsed

设置为`exitUntilCollapsed`的View，当这个View要往上逐渐`消逝`时，会一直往上滑动，直到剩下的高度达到它的最小高度后，再响应ScrollView的内部滑动事件，直到ScrollView向上滑动到底，该View一直都只出现最小高度。其实就是在ScrollView往上滑动时，首先是View把滑动事件夺走，由View去执行滑动，直到滑动最小高度后，再把这个事件还回去，让ScrollView内部去上滑。需要配合scroll使用，要不然该View滚动不上去。<br />![](http://upload-images.jianshu.io/upload_images/2154124-a17793a6ffcca05e?imageMogr2/auto-orient/strip#id=BJti1&originHeight=579&originWidth=347&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />**exitUntilCollapsed小结**<br />往上先自己，到最小高度给他人，后保持最小高度；往下`scroll`到顶再进入

#### enterAlwaysCollapsed

`enterAlwaysCollapsed`是`enterAlways`的附加选项，一般跟`enterAlways`一起使用，它是指，在View往下出现时，首先是`enterAlways`效果，当View的高度达到最小高度时，View就暂停不去往下滑动，直到ScrollView滑动到顶部时，View再继续往下滑动，直到滑到View的顶部结束。需要配合scroll使用，要不然该View滚动不上去。<br />![](http://upload-images.jianshu.io/upload_images/2154124-97ea2548a54a6e7b?imageMogr2/auto-orient/strip#id=ToMzg&originHeight=576&originWidth=347&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

**enterAlwaysCollapsed小结**<br />往上给scroll，往下先`enterAlwasy`自己，然后他人，然后再自己进入。

#### snap

当滚动结束时，如果View只有部分可见，它将会自动滑动到最近的边界（完全可见或完全隐藏）

### AppbarLayout去掉阴影

用`app:elevation="0dp"`而不是`android:elevation="0dp"`

### 将AppBarLayout与ScrollView关联起来

AppBarLayout与ScrollView之间动作“相互依赖”。把ScrollView和AppBarLayout作为CoordinateLayout的子View，然后编写一个Behavior，在这个Behavior里面判断当前的操作是应该让ScrollView时刻保持在AppBarLayout之下（即只要改变AppBarLayout的位置就可以一起滑动），还是应该让ScrollView内部滚动而不让AppBarLayout位置发生变化等等这些需求，都是可以在Behavior里面处理的。你可以去针对你的ScrollView编写Behavior。然而，我们的AppBarLayout事先的功能比较复杂，如果我们自己去定义这样的效果，代码非常复杂，还要考虑很多方面，好在Android帮我们写好啦，我们直接用就是了，这个ScrollView就是NestedScrollView，请注意，它并没有继承ScrollView，它继承的是FrameLayout，但是它实现的效果把它可以看成是ScrollView。<br />把NestedScrollView放入到我们的layout文件里面就可以啦，`app:layout_behavior="@string/appbar_scrolling_view_behavior"`，它就是指定Behavior的，`appbar_scrolling_view_behavior`对应的类的名称是：`android.support.design.widget.AppBarLayout$ScrollingViewBehavior`。

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <!-- AppBarLayout，作为CoordinatorLayout的子类 -->
    <android.support.design.widget.AppBarLayout
            android:id="@+id/activity_appbar_layout"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

        <android.support.v7.widget.Toolbar
                app:layout_scrollFlags="scroll|enterAlways|enterAlwaysCollapsed"
                android:id="@+id/toolbar"
                android:title="AppbarLayout Demo"
                android:background="?attr/colorPrimary"
                android:layout_width="match_parent"
                android:minHeight="?attr/actionBarSize"
                android:layout_height="200dp">

        </android.support.v7.widget.Toolbar>

        <TextView
                android:text="This is a test for appbarlayout"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>

        <EditText
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="请输入密码"
                android:ems="10"/>
    </android.support.design.widget.AppBarLayout>

    <android.support.v4.widget.NestedScrollView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:layout_behavior="@string/appbar_scrolling_view_behavior">
        <!-- Your scrolling content -->

        <TextView
                android:id="@+id/tv_content"
                android:textSize="16sp"
                android:textColor="@android:color/holo_blue_dark"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>
    </android.support.v4.widget.NestedScrollView>

</android.support.design.widget.CoordinatorLayout>
```

### AppBarLayout.OnOffsetChangedListener

`fitsSystemWindows`对AppBarLayout滚动的影响，如果设置了`fitsSystemWindows`为true，那么AppBarLayout会把statusBar状态栏给忽略掉；设置为false那么AppbarLayout会考虑statusBar的高度。

## 注意

### CoordinatorLayout配合AppBarLayout，AppBarLayout不显示

CoordinatorLayout配合AppBarLayout，AppBarLayout不显示。<br />`app:layout_behavior`属性作用位置不对，作用于AppBarLayout下的内容直接布局容器上

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <LinearLayout
            android:orientation="vertical"
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <View android:id="@+id/fake_statusbar_view"
              android:layout_width="match_parent"
              android:layout_height="@dimen/statusbar_view_height"
              android:background="@color/colorPrimary"/>

        <android.support.design.widget.CoordinatorLayout
                android:id="@+id/home_content"
                android:layout_below="@id/fake_statusbar_view"
                android:layout_width="match_parent"
                android:layout_height="match_parent">

            <android.support.design.widget.AppBarLayout
                    app:elevation="0dp"
                    android:id="@+id/abl_app_bar"
                    android:orientation="vertical"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content">

                <com.qiushibaike.inews.widget.CommonToolbar
                        app:layout_scrollFlags="scroll|enterAlways|snap"
                        android:id="@+id/common_toolbar"
                        app:toolbar_mode="center_image"
                        android:background="@color/colorPrimary"
                        app:center_titleIcon="@drawable/ic_home_title_logo"
                        android:layout_width="match_parent"
                        android:layout_height="35dp">
                </com.qiushibaike.inews.widget.CommonToolbar>

            </android.support.design.widget.AppBarLayout>

            <LinearLayout
                    android:id="@+id/fl_home_realtabcontent"
                    app:layout_behavior="@string/appbar_scrolling_view_behavior"
                    android:orientation="vertical"
                    android:layout_width="match_parent"
                    android:layout_height="match_parent">

                <com.qiushibaike.inews.widget.PagerSlidingTabStrip
                        android:layout_width="match_parent"
                        android:layout_height="35dp"
                        android:layout_below="@id/fake_statusbar_view"
                        android:id="@+id/psts_category_tab_indicator"/>

                <View android:id="@+id/divider"
                      style="@style/Divider.Horizontal.Blue"
                      android:layout_below="@id/psts_category_tab_indicator"/>

                <!--放app:layout_behavior="@string/appbar_scrolling_view_behavior"这里AppBarLayout不显示-->
                <com.qiushibaike.inews.widget.CustomViewPager
                        android:layout_below="@+id/divider"
                        android:layout_width="match_parent"
                        android:layout_height="match_parent"
                        android:id="@+id/vp_category_tab_content"/>
            </LinearLayout>

        </android.support.design.widget.CoordinatorLayout>
    </LinearLayout>

    <com.qiushibaike.common.widget.InewsImageView
            android:id="@+id/iv_new_user_float_img"
            android:src="@drawable/ic_new_user_red_packet_float_window"
            android:visibility="gone"
            android:layout_alignParentRight="true"
            android:layout_alignParentBottom="true"
            android:layout_marginBottom="58dp"
            android:layout_marginRight="@dimen/margin_small"
            android:layout_width="42.5dp"
            android:layout_height="45dp"/>

</RelativeLayout>
```

## Reference

- [ ] 玩转AppBarLayout，更酷炫的顶部栏<br /><http://www.jianshu.com/p/d159f0176576>
