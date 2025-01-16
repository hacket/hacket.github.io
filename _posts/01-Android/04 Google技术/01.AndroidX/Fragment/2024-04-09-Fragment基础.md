---
date created: 2024-04-09 10:35
tags:
  - '#onDestroy()}'
  - '#onDetach()}'
  - '#onCreate(Bundle)}'
  - '#onAttach(Activity)}'
  - '#onActivityCreated(Bundle)}'
date updated: 2024-12-24 00:31
dg-publish: true
---

# Fragment生命周期

## Fragment生命周期简单版

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688577359984-250361a4-35d8-45da-b306-c7c2831be141.png#averageHue=%23f8f7f5&clientId=u5f836923-a7d7-4&from=paste&id=u81733072&originHeight=847&originWidth=317&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=72272&status=done&style=none&taskId=uc1763c6a-64c6-4987-a0a4-a658697564d&title=)<br />onAttach()：Fragment和Activity相关联时调用。可以通过该方法获取Activity引用，还可以通过getArguments()获取参数。<br />onCreate()：Fragment被创建时调用<br />onActivityCreated()：当Activity完成onCreate()时调用<br />onStart()：当Fragment可见时调用。<br />onResume()：当Fragment可见且可交互时调用<br />onPause()：当Fragment不可交互但可见时调用。<br />onStop()：当Fragment不可见时调用。<br />onDestroyView()：当Fragment的UI从视图结构中移除时调用。<br />onDestroy()：销毁Fragment时调用。<br />onDetach()：当Fragment和Activity解除关联时调用。

Fragment的整个生命周期一直在这6个状态中流转，调用对应的生命周期方法然后进入下一个状态，如下图：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688577536886-768648ec-d830-4b37-a228-cf0e512938f0.png#averageHue=%23f1f1f1&clientId=u5f836923-a7d7-4&from=paste&id=u7b082159&originHeight=545&originWidth=249&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc30097d0-859d-47cd-9cd1-223ee78a2dd&title=)

## Fragment与Activity生命周期

Fragment的生命周期与Activity的生命周期密切相关 Activity管理Fragment生命周期的方式是在Activity的生命周期方法中调用FragmentManager的对应方法，通过FragmentManager将现有的Fragment迁移至下一个状态，同时触发相应的生命周期函数。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688577611467-f4ae74ca-c5df-428a-902d-4327b09e7c49.png#averageHue=%23fbfbfa&clientId=u5f836923-a7d7-4&from=paste&height=661&id=uda74145b&originHeight=991&originWidth=1144&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=64729&status=done&style=none&taskId=u006f0fbb-6936-4c8b-b746-1d2f7bb1ce5&title=&width=762.6666666666666)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688577440947-98f78e0c-56ed-4bd2-9ac7-5ff78c4d2257.png#averageHue=%23212121&clientId=u5f836923-a7d7-4&from=paste&id=u90311736&originHeight=675&originWidth=340&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=68133&status=done&style=none&taskId=ud8458d46-d839-46ab-9470-cf90f9ee21f&title=)

可以看到Fragment比Activity多了几个额外的生命周期回调方法：<br />**onAttach(Activity)**<br />当Fragment与Activity发生关联时调用。<br />**onCreateView(LayoutInflater, ViewGroup,Bundle)**<br />创建该Fragment的视图<br />**onActivityCreated(Bundle)**<br />当Activity的onCreate方法返回时调用<br />**onDestoryView()**<br />与onCreateView想对应，当该Fragment的视图被移除时调用<br />**onDetach()**<br />与onAttach相对应，当Fragment与Activity关联被取消时调用<br />注意：除了onCreateView，其他的所有方法如果你重写了，必须调用父类对于该方法的实现，<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688577263319-5126882e-6ea6-4fa6-a3cb-3d7e8c894ea3.png#averageHue=%23f3f2ec&clientId=u5f836923-a7d7-4&from=paste&id=u689b7c49&originHeight=468&originWidth=851&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud089663c-694e-4086-ad43-f3f57dcb3f9&title=)<br />创建和重建过程: **Activity生命周期优先于Fragment，onCreate/onStart/onResume, Fragment在Activity之后**<br />暂停和销毁过程: **Fragment生命周期优先于Activity，onDestroy/onStop/onPause Fragment在Activity之前**

## 使用add & replace 两种方式的生命周期变化

第一个MyFragment使用 Add 进容器。然后分别使用 Add 和Replace添加My2Fragment。然后观察MyFragment和My2Fragment各自生命周期变化。<br />先看Add transaction.add(R.id.container,fragment_2)方式输出信息：

```
2021-08-07 11:07:13.310 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onAttach
2021-08-07 11:07:13.311 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onCreate
2021-08-07 11:07:13.318 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onViewCreated
2021-08-07 11:07:13.318 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onActivityCreated
2021-08-07 11:07:13.318 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onViewStateRestored
2021-08-07 11:07:13.318 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onStart
2021-08-07 11:07:13.324 7510-7510/com.example.myfirstproject D/MyFragment-TEST: onResume
2021-08-07 11:07:20.033 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onAttach
2021-08-07 11:07:20.034 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onCreate
2021-08-07 11:07:20.053 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onViewCreated
2021-08-07 11:07:20.053 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onActivityCreated
2021-08-07 11:07:20.053 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onViewStateRestored
2021-08-07 11:07:20.053 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onStart
2021-08-07 11:07:20.053 7510-7510/com.example.myfirstproject D/My2Fragment-TEST: onResume
```

可以看出使用Add添加Fragment2,Fragment1和Fragment2互不影响。<br />再看看Relace transaction.replace(R.id.container, fragment_2)方式输出信息：

```
2021-08-07 11:09:09.712 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onAttach
2021-08-07 11:09:09.713 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onCreate
2021-08-07 11:09:09.723 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onViewCreated
2021-08-07 11:09:09.723 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onActivityCreated
2021-08-07 11:09:09.723 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onViewStateRestored
2021-08-07 11:09:09.724 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onStart
2021-08-07 11:09:09.730 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onResume
2021-08-07 11:09:22.321 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onAttach
2021-08-07 11:09:22.321 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onCreate

2021-08-07 11:09:22.324 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onPause
2021-08-07 11:09:22.324 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onStop
2021-08-07 11:09:22.325 7806-7806/com.example.myfirstproject D/MyFragment-TEST: onDestroyView

2021-08-07 11:09:22.346 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onViewCreated
2021-08-07 11:09:22.346 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onActivityCreated
2021-08-07 11:09:22.346 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onViewStateRestored
2021-08-07 11:09:22.346 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onStart
2021-08-07 11:09:22.347 7806-7806/com.example.myfirstproject D/My2Fragment-TEST: onResume
```

上面需要注意的地方我已经用空行分隔开了，注意看使用Replace添加Fragment2,Fragment1走了销毁onDestroyView的生命周期。<br />也就是：**replace相比如add，replace之前的fragment是走的销毁生命周期。**

## Fragment与Activity交互生命周期 网络图

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1688577862769-b3dc12f1-3169-4a3d-8975-da890aeb7b72.webp#averageHue=%23f8f7f7&clientId=u5f836923-a7d7-4&from=paste&id=uc913ab58&originHeight=2552&originWidth=1196&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4343d3b7-19e6-424c-8af7-7d75869bbd5&title=)

## Fragment的add(),remove(),show(),hide(),replace(),attach(),detach()生命周期表现

代码托管：<br /><http://git.oschina.net/zengfansheng/FragmentDemo>

### 1、show() hide() `(保存Fragment实例和View状态)`

`show()` 显示之前隐藏的Fragment<br />`hide()` 隐藏当前的Fragment，仅仅是设置为不可见，并不会销毁；如果之前的Fragment中有EditText，再次show时，数据还在。

> 进行show()和hide(),`Fragment的实例(数据)和View`都在,仅仅是Fragment的view的显示和隐藏,生命周期没有变化

添加Fragment1<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578012235-37452857-25f7-44f6-9748-cc4792819880.png#averageHue=%232c2b2a&clientId=u5f836923-a7d7-4&from=paste&id=u76b2ec99&originHeight=252&originWidth=559&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u158c9b75-de28-4911-8396-290817a3847&title=)<br />添加Fragment2,Fragment1生命周期没有变化,只是Fragment1的View隐藏了<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578020676-793cc50b-c104-451f-9c32-24542044c853.png#averageHue=%232b2b2a&clientId=u5f836923-a7d7-4&from=paste&id=u21c3ec53&originHeight=542&originWidth=629&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u54cca578-6de3-4578-92dd-24d4b55175d&title=)<br />![](http://note.youdao.com/yws/res/32535/3A910833C34A409994EEDE6ACF69B3AD#id=Xuql1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />**note**<br />加上回退栈时,如果回退栈有多个Fragment,那么可能会出现重影,监听回退栈退出情况?

### 2、attach()、detach() `(保存Fragment实例,不保存View状态)`

`attach()`重建UI视图，附件到UI上并显示<br />`detach()`将View从UI中移除，和remove()不同，此时Fragment的状态依然由FragmentManager维护

> detach()不会走生命周期的onDetach()方法；detach()后数据会丢失；此时还是由FragmentManager维护状态

先击Fragment1，输入数据；再点击Fragment2，输入数据<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578034575-18e7c399-4f49-4a10-ad78-2c376fbe599f.png#averageHue=%232a2a2a&clientId=u5f836923-a7d7-4&from=paste&id=ue03b9da0&originHeight=408&originWidth=333&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua46be438-583d-4fb1-9583-8d21ccfef19&title=)<br />再点击Fragment1，Fragment1的数据已经丢失，没有走onDetach()方法<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578044834-44883b0d-d012-4c77-b9ff-01297d6c59c5.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=u32d19244&originHeight=227&originWidth=318&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubb8c8371-4895-4d17-8483-d5f14e30e65&title=)

### 3、add() remove() `(Fragment实例和View状态都不保存)`

`add()` 往Activity中添加一个Fragment<br />`remove()` 从Activity中移除一个Fragment

**note:**<br />如果被移除的Fragment没有添加到回退栈,这个Fragment实例将会被销毁,会走onDetach()方法;如果加入到了回退栈中,那么只会走到onDestroyView()方法,不会走onDetach()方法。

> 进行remove()，`Fragment的实例和View`都不存在，会走onDetach()方法

先击Fragment1，输入数据；再点击Fragment2，输入数据<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578054952-d690d2fd-d592-41f5-9245-5f05cbaac2ef.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=u0c3ef02f&originHeight=440&originWidth=321&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4cd3041d-865a-4855-802b-eb22c35fe45&title=)<br />再点击Fragment1，Fragment1数据已经丢失，且走了onDetach()方法<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578064309-a81e6bc9-74fc-4434-9941-1f41102ec507.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=ue875e01a&originHeight=296&originWidth=322&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud3bedc0e-b1a8-466e-8429-2b13a65645d&title=)

### 4、replace() `(先remove再add)`

> 每次都会new fragment；使用另外一个Fragment替换当前的，实际上就是remove()然后add()的合体

- 1）会销毁Fragment重新走生命周期；但如何加上FramentTransition. addToBackStack()， 不会销毁fragment1，只会onDestroyView，Fragment的实例数据还是会保存的，只会销毁view状态
- 2）创建fragment2; 会造成GC不断回收对象以及创建对象。 还会造成什么问题？fragment销毁和创建会浪费资源---内存、数据清空重新加载了。 推荐不使用replace,使用hide和show

先击Fragment1，输入数据；再点击Fragment2，输入数据<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578072544-4cbe1249-2697-40bd-b26d-4b7a8603ca72.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=u58981053&originHeight=424&originWidth=348&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u58da157e-813c-40fe-ab03-a82db373773&title=)<br />再点击Fragment1，Fragment1数据已经丢失<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578079620-1edc75f2-6282-4021-9ce1-43017b52a25c.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=u291d6d55&originHeight=276&originWidth=321&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u49c1a8a0-1764-45f4-b5e6-9e6bc8c5407&title=)<br />**note**<br />注意加上回退栈,同add/remove

### 5、小结：

1. 既销毁Fragmet实例又销毁Fragment视图

> 会走onDestroyView()和onDetach()方法

- remove()
- replace() 其实就是先remove再add

2. 只销毁Fragment视图

> 只走onDestroyView(),不走onDetach()方法<br />* detach()

3. 既不销毁Fragment实例也不销毁Fragment视图,仅仅只是隐藏Fragment的View

> 生命周期方法不变

```
* hide()
* show()
```

4. 在FragmentA中的EditText填了一些数据，当切换到FragmentB时，如果希望会到A还能看到数据，则适合你的就是hide和show；也就是说，**希望保留用户操作的面板，你可以使用hide和show，当然了不要使劲在那new实例，进行下非null判断**。
5. **我不希望保留用户操作，你可以使用remove()，然后add()；或者使用replace()这个和remove,add是相同的效果**
6. **remove和detach有一点细微的区别，在不考虑回退栈的情况下，remove会销毁整个Fragment实例，而detach则只是销毁其视图结构，实例并不会被销毁。那么二者怎么取舍使用呢？如果你的当前Activity一直存在，那么在不希望保留用户操作的时候，你可以优先使用detach**

**核心代码：**

```java
public void f1(View v) {
    FragmentTransaction fragmentTransaction = manager.beginTransaction();
    Fragment f1 = manager.findFragmentByTag("f1");

    fragmentTransaction.replace(R.id.framelayout, new Fragment1Fg());
    fragmentTransaction.addToBackStack("hacket");
    fragmentTransaction.commit();
    Log.d(TAG, "f1: replace() addToBackStack()");

    //        if (f1 != null) {
    //            fragmentTransaction.show(f1);
    //            Log.d(TAG, "f1: not null,show()");
    //            //            fragmentTransaction.attach(f1);
    //            //            Log.d(TAG, "f1: not null,attach()");
    //        } else {
    //            f1 = new Fragment1Fg();
    //            fragmentTransaction.add(R.id.framelayout, f1, "f1");
    //            Log.d(TAG, "f1: is null,add()");
    //        }
    //
    //        if (manager.findFragmentByTag("f2") != null) {
    //            Fragment f2 = manager.findFragmentByTag("f2");
    //            //            fragmentTransaction.hide(f2);   // hide
    //            fragmentTransaction.remove(f2); // remove
    //            //            fragmentTransaction.detach(f2); // detach
    //            Log.d(TAG, "f1: remove f2");
    //        }
    //
    //        if (manager.findFragmentByTag("f3") != null) {
    //            Fragment f3 = manager.findFragmentByTag("f3");
    //            //            fragmentTransaction.hide(f3);
    //            fragmentTransaction.remove(f3);
    //            //            fragmentTransaction.detach(f3);
    //            Log.d(TAG, "f1: remove f3");
    //        }

    int commit = fragmentTransaction.commit();
    Log.d(TAG, "f1: commit:" + commit);
    //        int i = fragmentTransaction.commitAllowingStateLoss();

}
```

### Ref

- [ ] [Android Fragment 真正的完全解析（上）](http://blog.csdn.net/lmj623565791/article/details/37970961)
- [ ] [Android Fragment 真正的完全解析（下）](http://blog.csdn.net/lmj623565791/article/details/37992017)

# Fragment相关API的理解

## FragmentActivity

宿主Activity

## FragmentManager

> FragmentActivity的FragmentManager是处理FragmentTransaction的而不是处理Fragment,如下面的一个FragmentTransaction既包含add操作又包含replace操作。

- Fragment findFragmentById([@IdRes ](/IdRes) int id) 适用于在静态fragment，不常用
- Fragment findFragmentByTag(String tag) 适用于动态加载的Fragment，常用
- FragmentTransaction beginTransaction() 开启事务
- void popBackStack() 将Fragment从后台堆栈中弹出 (模拟用户按下BACK 命令)

## FragmentTransaction

> 保存Fragment操作的原子性,事务

- BackStack内部的一个Transaction可以包含一个或多个和Fragment相关的操作。

```java
FragmentTransaction ft = getFragmentManager().beginTransaction();
ft.add(restId, fragmentA);
ft.replace(fragmentB);
ft.commit();
```

- FragmentTransitions默认并不会主动加入到backstack中,除非开发者调用了addToBackStack(String tag)方法。参数'tag'将作为本次加入BackStack的Transaction的标志。

```java
FragmentTransaction ft = getFragmentManager().beginTransaction();
ft.add(resId, fragmentA);
ft.replace(resId, fragmentB);
ft.addToBackstack("tag");
ft.commit();
```

- addToBackstack(name) 添加这个fragment transaction到回退栈
- setTransition(int transit) 应用动画
- commit() 调用commit()后，事务并不会马上执行。它会在activity的UI线程（其实就是主线程）中等待直到线程能执行的时候才执行（废话）。如果必要，你可以在UI线程中调用executePendingTransactions()方法来立即执行事务。但一般不需这样做，除非有其它线程在等待事务的执行。
- commitAllowingStateLoss()

警告：你只能在activity处于可保存状态的状态时，比如running中，onPause()方法和onStop()方法中提交事务，否则会引发异常。这是因为fragment的状态会丢失。如果要在可能丢失状态的情况下提交事务，请使用commitAllowingStateLoss()。

### setReorderingAllowed (boolean)

## setRetainInstance(boolean)

在Activity重新创建的时候可以不完全销毁Fragment , 以便Fragment可以恢复。

- 一般在Fragment的onCreate()方法中调用setRetainInstance(boolean)最佳。
- 设置为true后 , Fragment恢复会跳过onAttach()→onCreate()和onDestroy()→onDetach() , 所以不要在onCreate()放初始化逻辑。

关于 Fragment，我们发现 `setRetainInstance` 方法经常被用到，那么这个方法的作用是什么呢？我们看看官方的解释：

```
    /**
     * Control whether a fragment instance is retained across Activity
     * re-creation (such as from a configuration change).  This can only
     * be used with fragments not in the back stack.  If set, the fragment
     * lifecycle will be slightly different when an activity is recreated:
     * <ul>
     * <li> {@link #onDestroy()} will not be called (but {@link #onDetach()} still
     * will be, because the fragment is being detached from its current activity).
     * <li> {@link #onCreate(Bundle)} will not be called since the fragment
     * is not being re-created.
     * <li> {@link #onAttach(Activity)} and {@link #onActivityCreated(Bundle)} <b>will</b>
     * still be called.
     * </ul>
     */
```

结合方法名以及方法的解释，可以知道一旦我们设置 `setRetainInstance(true)`，意味着在 Activity 重绘时，我们的 Fragment 不会被重复绘制，也就是它会被“保留”。为了验证其作用，我们发现在设置为 `true` 状态时，旋转屏幕，Fragment 依然是之前的 Fragment。而如果将它设置为默认的 false，那么旋转屏幕时 Fragment 会被销毁，然后重新创建出另外一个 fragment 实例。并且如官方所说，如果 Fragment 不重复创建，意味着 Fragment 的 `onCreate` 和 `onDestroy` 方法不会被重复调用。所以在旋转屏 Fragment 中，我们经常会设置 `setRetainInstance(true)`，这样旋转时 Fragment 不需要重新创建。

如果你的 App 恰好可以不做转屏，那么你可以很省事的在 Manifest 文件中添加标注，强制所有页面使用竖屏/横屏。如果你的页面不幸的需要支持横竖屏切换，那么你在预估工作量或者给客户报价时一定要考虑到。虽然加入转屏支持不会导致工作量翻倍，但是却有可能引起许多问题。尤其当页面有很多业务逻辑，有状态值的时候。所以我们在项目开发过程中，应该知道什么时候需要考虑状态保存，当状态保存出现问题时，应该怎么解决之。

## Fragment中的onActivityForResult()

### 一层Fragment

不要用getActivity().startActivityForResult()方法将无法获取到相关的返回数据。<br />要使用Fragment自身提供的一个方fragment.startActivityForResult()或者this.startActivityForResult()方法跳转到一个新的Activity，然后在Fragment中调用fragment.onActivityResult()就可以处理返回的相关数据。

### 嵌套Fragment，如ViewPager

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    for (Fragment fragment : getSupportFragmentManager().getFragments()) {
        fragment.onActivityResult(requestCode,resultCode,data);
    }
}
```

### finish()要在setResult后面

# Fragment commit几种方式

## commit()

【异步提交】不会立即执行，commit()后，在主线程中异步调用；不要在activity save state之后保存，否则会出现异常

返回值：如果调用了addToBackStack()，返回entry；否则返回一个负数

## commitAllowingStateLoss()

【异步提交】允许activiy save state之后提交transaction，

## commitNow()

【同步提交】

这种方式比commit后，再调用executePendingTransactions()更好

```
commit() 
executePendingTransactions()
```

这种方式不能被加入到back stack中去，如果之前调用了addToBackStack，会抛出异常`IllegalStateException`

也只能在activity save state之前调用，否则会抛异常

## executePendingTransactions()

只能主线程调用，会将所有pending的操作提交，如果你不加入到back stack，并且只有一个transition，考虑用`commitNow`，可以避免其他pending影响

要保证`postponeEnterTransition()`被调用了

# Fragment onKeyDown处理

## Fragment

```kotlin
interface IKeyDown {
    fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean
}
```

在BaseActivity的onKeyDown或者，分发给Fragment

```java
@Override
public boolean onKeyDown(int keyCode, KeyEvent event) {
    boolean ret = false;
    ret = activityParseOnkey(keyCode);
    if (!ret) {
        ret = mCurFragment.onKeyDown(event);  //这里的mCurFragment是我们前的Fragment
    }
    return ret;
}
```

Fragment实现IKeyDown接口

## DialogFragment

```java
this.getDialog().setOnKeyListener(new OnKeyListener()
    {
       public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event){
       if (keyCode == KeyEvent.KEYCODE_SEARCH)
         return true; // pretend we've processed it
       else
         return false; // pass on to be processed as normal
     }
   });
```

return false和return true是是否允许事件下传，return true是中断事件

# Fragment回退栈

## 介绍

类似与Android系统为Activity维护一个任务栈，我们也可以通过Activity维护一个回退栈来保存每次Fragment事务发生的变化。如果你将Fragment任务添加到回退栈，当用户点击后退按钮时，将看到上一次的保存的Fragment。一旦Fragment完全从后退栈中弹出，用户再次点击后退键，则退出当前Activity。

## 如何添加到回退栈

如何添加一个Fragment事务到回退栈：

```java
FragmentTransaction.addToBackStack(String)
```

核心代码：

```java
FragmentTransaction fragmentTransaction = manager.beginTransaction();
Fragment f1 = manager.findFragmentByTag("f1");

fragmentTransaction.replace(R.id.framelayout, new Fragment1Fg());
fragmentTransaction.addToBackStack("hacket");
fragmentTransaction.commit();
Log.d(TAG, "f1: replace() addToBackStack()");
```

先击Fragment1，输入数据；再点击Fragment2，输入数据<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578247621-68c006c4-77ce-46e9-a1aa-5c404fa6a17f.png#averageHue=%232a2a2a&clientId=u5f836923-a7d7-4&from=paste&id=u1cdccf4c&originHeight=384&originWidth=359&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubc07a98b-f04d-4a59-a571-d06852ac39d&title=)<br />再点击Fragment1，发现使用replace()，不会走onDestroy()和onDetach()，说明实例不会被销毁。<br />![](http://note.youdao.com/yws/res/32505/CE9A608A6B494CA18A6FCAD671FAC8DB#id=r4yZq&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688578252438-5c80fa82-58a5-4b63-9a46-1789b5f76e37.png#averageHue=%232b2b2b&clientId=u5f836923-a7d7-4&from=paste&id=u7ae019a4&originHeight=233&originWidth=340&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1e4c44ab-e4e9-44cb-bc3e-fa5a26db99a&title=)

注意：使用android.app.Fragment添加到回退栈似乎不行，要用support v4里面的Fragment。

# Activity和Fragment通信

1. 接口方式
2. ViewModel方式

- 使用观察者模式解决单 Activity 与多个 Fragment 通信<br /><https://alphagao.com/2017/03/15/using-observer-pattern-deal-event-between-activity-and-fragments/>

# Fragment懒加载

## Fragment常见版本

> 可以弄个上次加载的时间，来处理时间间隔不够时不加载数据

### setUserVisibleHint(ViewPager+Fragment用)

> androidx1.1.0已置为过期。该方法用于告诉系统，这个Fragment的UI是否是可见的；在FragmentPagerAdapter和FragmentStatePagerAdapter中调用，也就是配合ViewPager来使用的

**Note:** 该方法可能在fragment lifecycle外调用，无法保证顺序。

```java
public abstract class BdLazyFragment extends Fragment {
    /**
     * 在这里实现Fragment数据的缓加载.
     * @param isVisibleToUser true表用户可见，false表不可见
     */
    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (isVisibleToUser && getView() != null) {
            lazyLoadData();
        } else if (getView() != null && !isVisibleToUser) {
            onUserInvisible();
        }
    }
    @Override
    public final View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = onCreateFragmentView(inflater, container, savedInstanceState);
        if (view != null && getUserVisibleHint()) {
            lazyLoadData();
        }
        return view;
    }
    /**
     * 懒加载数据，并在此绑定View数据
     */
    protected abstract void lazyLoadData();
    protected void onUserInvisible() {
    }
    protected abstract View onCreateFragmentView(LayoutInflater inflater,     ViewGroup container, Bundle savedInstanceState);
}
```

### onHiddenChanged(add/show/hide用)

- void onHiddenChanged(boolean hidden)<br />当 Fragment 隐藏的状态发生改变时，该函数将会被调用，如果当前 Fragment 隐藏， hidden 的值为 true, 反之为 false。最为重要的是hidden 的值，可以通过调用 isHidden() 函数获取。

通过传入的参数值来判断当前 Fragment 是否对用户可见，只是 onHiddenChanged() 是在 add+show+hide 模式下使用，而 setUserVisibleHint 是在 ViewPager+Fragment 模式下使用。

```kotlin
abstract class LazyFragment:Fragment(){
    private var isLoaded = false //控制是否执行懒加载
    override fun onResume() {
        super.onResume()
        judgeLazyInit()
    }
    override fun onHiddenChanged(hidden: Boolean) {
        super.onHiddenChanged(hidden)
        isVisibleToUser = !hidden
        judgeLazyInit()
    }
    private fun judgeLazyInit() {
        if (!isLoaded && !isHidden) {
            lazyInit()
            isLoaded = true
        }
    }
     override fun onDestroyView() {
        super.onDestroyView()
        isLoaded = false
    }
    //懒加载方法
    abstract fun lazyInit()
}
```

### 复杂 Fragment 嵌套的情况

```kotlin
abstract class LazyFragment : Fragment() {

    /**
     * 是否执行懒加载
     */
    private var isLoaded = false

    /**
     * 当前Fragment是否对用户可见
     */
    private var isVisibleToUser = false

    /**
     * 当使用ViewPager+Fragment形式会调用该方法时，setUserVisibleHint会优先Fragment生命周期函数调用，
     * 所以这个时候就,会导致在setUserVisibleHint方法执行时就执行了懒加载，
     * 而不是在onResume方法实际调用的时候执行懒加载。所以需要这个变量
     */
    private var isCallResume = false

    /**
     * 是否调用了setUserVisibleHint方法。处理show+add+hide模式下，默认可见 Fragment 不调用
     * onHiddenChanged 方法，进而不执行懒加载方法的问题。
     */
    private var isCallUserVisibleHint = false

    override fun onResume() {
        super.onResume()
        isCallResume = true
        if (!isCallUserVisibleHint) isVisibleToUser = !isHidden
        judgeLazyInit()
    }


    private fun judgeLazyInit() {
        if (!isLoaded && isVisibleToUser && isCallResume) {
            lazyInit()
            LogUtils.d("lazyInit:!!!!!!!")
            isLoaded = true
        }
    }

    override fun onHiddenChanged(hidden: Boolean) {
        super.onHiddenChanged(hidden)
        isVisibleToUser = !hidden
        judgeLazyInit()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        isLoaded = false
        isVisibleToUser = false
        isCallUserVisibleHint = false
        isCallResume = false
    }

    override fun setUserVisibleHint(isVisibleToUser: Boolean) {
        super.setUserVisibleHint(isVisibleToUser)
        this.isVisibleToUser = isVisibleToUser
        isCallUserVisibleHint = true
        judgeLazyInit()
    }

    abstract fun lazyInit()
}
```

## AndroidX懒加载

虽然之前的方案就能解决轻松的解决 Fragment 的懒加载，但这套方案有一个最大的弊端，就是不可见的 Fragment 执行了`onResume()`方法。onResume 方法设计的初衷，难道不是当前 Fragment 可以和用户进行交互吗？既不可见，又不能和用户进行交互，你执行 onResume 方法干嘛？<br />基于此问题，Google 在 `Androidx1.1.0` 在 `FragmentTransaction` 中增加了 `setMaxLifecycle` 方法来控制 Fragment 所能调用的最大的生命周期函数

### ViewPager+Fragment 模式下的方案

在 FragmentPagerAdapter 与 FragmentStatePagerAdapter 新增了含有 `behavior` 字段的构造函数，behavior可取值：

1. 如果 behavior 的值为 `BEHAVIOR_SET_USER_VISIBLE_HINT`，那么当 Fragment 对用户的可见状态发生改变时，setUserVisibleHint 方法会被调用。
2. 如果 behavior 的值为 `BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT` ，那么当前选中的 Fragment 在 `Lifecycle.State#RESUMED` 状态 ，其他不可见的 Fragment 会被限制在 `Lifecycle.State#STARTED` 状态。

使用了 `BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT` 后，确实只有当前可见的 Fragment 调用了 onResume 方法。而导致产生这种改变的原因，是因为 FragmentPagerAdapter 在其 `setPrimaryItem` 方法中调用了 setMaxLifecycle 方法

```java
public void setPrimaryItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
    Fragment fragment = (Fragment)object;
    //如果当前的fragment不是当前选中并可见的Fragment,那么就会调用
    // setMaxLifecycle 设置其最大生命周期为 Lifecycle.State.STARTED，即上个可见的Fragment不可见了
    if (fragment != mCurrentPrimaryItem) {
        if (mCurrentPrimaryItem != null) {
            mCurrentPrimaryItem.setMenuVisibility(false);
            if (mBehavior == BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT) {
                if (mCurTransaction == null) {
                    mCurTransaction = mFragmentManager.beginTransaction();
                }
                mCurTransaction.setMaxLifecycle(mCurrentPrimaryItem, Lifecycle.State.STARTED);
            } else {
                mCurrentPrimaryItem.setUserVisibleHint(false);
            }
        }
        //对于当前可见的Fragment，则设置其最大生命周期为Lifecycle.State.RESUMED
        fragment.setMenuVisibility(true);
        if (mBehavior == BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT) {
            if (mCurTransaction == null) {
                mCurTransaction = mFragmentManager.beginTransaction();
            }
            mCurTransaction.setMaxLifecycle(fragment, Lifecycle.State.RESUMED);
        } else {
            fragment.setUserVisibleHint(true);
        }

        mCurrentPrimaryItem = fragment;
    }
}
```

只有实际可见的 Fragment 会调用 onResume 方法， 那是不是为我们提供了 ViewPager 下实现懒加载的新思路呢:

```kotlin
// 在AndroidX1.1.0及以上版本；配合`FragmentPagerAdapter`和`FragmentStatePagerAdapter`使用
abstract class AndroidXLazyFragment : LogFragment() {

    private var isLoaded = false

    override fun onResume() {
        super.onResume()
        if (!isLoaded && !isHidden) {
            lazyInit()
            isLoaded = true
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        isLoaded = false
    }

    abstract fun lazyInit()

}
```

### add+show+hide 模式下的新方案

1. 将需要显示的 Fragment ，在调用 add 或 show 方法后，`setMaxLifecycle(showFragment, Lifecycle.State.RESUMED)`
2. 将需要隐藏的 Fragment ，在调用 hide 方法后，`setMaxLifecycle(fragment, Lifecycle.State.STARTED)`

- LazyFragment

```kotlin
abstract class LazyFragment : Fragment() {

    private var isLoaded = false

    override fun onResume() {
        super.onResume()
        //增加了Fragment是否可见的判断
        if (!isLoaded && !isHidden) {
            lazyInit()
            Log.d(TAG, "lazyInit:!!!!!!!")
            isLoaded = true
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        isLoaded = false
    }

    abstract fun lazyInit()
}
```

- show/hide

```kotlin
/**
 * 使用add+show+hide模式加载fragment
 *
 * 默认显示位置[showPosition]的Fragment，最大Lifecycle为Lifecycle.State.RESUMED
 * 其他隐藏的Fragment，最大Lifecycle为Lifecycle.State.STARTED
 *
 *@param containerViewId 容器id
 *@param showPosition  fragments
 *@param fragmentManager FragmentManager
 *@param fragments  控制显示的Fragments
 */
private fun loadFragmentsTransaction(
    @IdRes containerViewId: Int,
    showPosition: Int,
    fragmentManager: FragmentManager,
    vararg fragments: Fragment
) {
    if (fragments.isNotEmpty()) {
        fragmentManager.beginTransaction().apply {
            for (index in fragments.indices) {
                val fragment = fragments[index]
                add(containerViewId, fragment, fragment.javaClass.name)
                if (showPosition == index) {
                    setMaxLifecycle(fragment, Lifecycle.State.RESUMED)
                } else {
                    hide(fragment)
                    setMaxLifecycle(fragment, Lifecycle.State.STARTED)
                }
            }

        }.commit()
    } else {
        throw IllegalStateException(
            "fragments must not empty"
        )
    }
}

/** 显示需要显示的Fragment[showFragment]，并设置其最大Lifecycle为Lifecycle.State.RESUMED。
 *  同时隐藏其他Fragment,并设置最大Lifecycle为Lifecycle.State.STARTED
 * @param fragmentManager
 * @param showFragment
 */
private fun showHideFragmentTransaction(fragmentManager: FragmentManager, showFragment: Fragment) {
    fragmentManager.beginTransaction().apply {
        show(showFragment)
        setMaxLifecycle(showFragment, Lifecycle.State.RESUMED)

        //获取其中所有的fragment,其他的fragment进行隐藏
        val fragments = fragmentManager.fragments
        for (fragment in fragments) {
            if (fragment != showFragment) {
                hide(fragment)
                setMaxLifecycle(fragment, Lifecycle.State.STARTED)
            }
        }
    }.commit()
}
```

## ViewPager2 懒加载

ViewPager2 本身就支持对实际可见的 Fragment 才调用 onResume 方法。关于 ViewPager2 的内部机制

# 无界面Fragment应用场景

## 无界面Fragment库

### 1、Glide

Glide.with()方法中传入的是Activity、FragmentActivity、v4包下的Fragment、还是app包下的Fragment，最终的流程都是一样的，那就是会向当前的Activity当中添加一个隐藏的Fragment。那么这里为什么要添加一个隐藏的Fragment呢？因为Glide需要知道加载的生命周期。很简单的一个道理，如果你在某个Activity上正在加载着一张图片，结果图片还没加载出来，Activity就被用户关掉了，那么图片还应该继续加载吗？当然不应该。可是Glide并没有办法知道Activity的生命周期，于是Glide就使用了添加隐藏Fragment的这种小技巧，因为Fragment的生命周期和Activity是同步的，如果Activity被销毁了，Fragment是可以监听到的，这样Glide就可以捕获这个事件并停止图片加载了

- RxPermissions<br />RxPermissions也是这样处理的，它内部持有一个Fragment，这个Fragment没有视图，只负责请求权限和返回结果，相当于一个桥梁的作用，我们通过rxPermissions发起request的时候，其实并不是activity去request，而是通过这个Fragment去请求，然后在Fragment的onRequestPermissionsResult中把结果发送出来，如此来避开activity的onRequestPermissionsResult方法。

<https://github.com/yanzhenjie/AndPermission>

### AvoidOnResult

## 系统lifecycle

## 无界面Fragment应用场景

### 1、生命周期联动

- RxBus自动取消订阅
- RxPermissions

### 2、消除Activity中的回调

- onActivityResult
  1. <https://github.com/AnotherJack/AvoidOnResult>
  2. <https://github.com/gengqiquan/QQResult>
  3. <https://github.com/florent37/InlineActivityResult>
- onRequestPermissionsResult
- 界面的动画自动关闭
- [ ] 无界面Fragment绑定数据 <https://juejin.im/entry/5a51e8f2518825734978bd0c>
- [ ] 如何避免使用onActivityResult，以提高代码可读性 <https://juejin.im/post/5a4611786fb9a0451a76b565>

## ActivityNoResult的Callback实现

使用无界面Fragment消除onActivityResult方式，需要注意需要FragmentTransition立即执行，因为commit是异步的

```java
fm.beginTransaction()
    .add(fragment, HolderLifeFragment.FRAGMENT_TAG)
    .commitAllowingStateLoss()
    fm.executePendingTransactions()
```

```kotlin
// HolderLifeFragment
class HolderLifeFragment : Fragment() {
    private val mCallbacks = HashMap<Int, AvoidOnResult.Callback>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        retainInstance = true
    }
    fun startForResult(intent: Intent, requestCode: Int, callback: AvoidOnResult.Callback) {
        mCallbacks.put(requestCode, callback)
        startActivityForResult(intent, requestCode)
    }
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        mCallbacks.remove(requestCode)
                ?.onActivityResult(requestCode, resultCode, data)
    }
    companion object {
        const val FRAGMENT_TAG = "DEFAULT_FRAGMENT_TAG"
        fun of(): HolderLifeFragment {
            return HolderLifeFragment()
        }
    }
}

// AvoidNoResult
class AvoidOnResult private constructor() {
    private var holderLifeFragment: HolderLifeFragment? = null
    private constructor(activity: FragmentActivity) : this() {
        holderLifeFragment = createFragment(activity.supportFragmentManager)
    }
    private constructor (fragment: Fragment) : this() {
        holderLifeFragment = createFragment(fragment.childFragmentManager)
    }
    private fun createFragment(fm: FragmentManager): HolderLifeFragment? {
        var fragment = findFragment(fm, HolderLifeFragment.FRAGMENT_TAG)
        if (fragment == null) {
            fragment = HolderLifeFragment.of()
            fm.beginTransaction()
                    .add(fragment, HolderLifeFragment.FRAGMENT_TAG)
                    .commitAllowingStateLoss()
            fm.executePendingTransactions()
        }
        return fragment
    }
    private fun findFragment(fm: FragmentManager, tag: String): HolderLifeFragment? {
        var holderFragment = fm.findFragmentByTag(tag)
        if (holderFragment is HolderLifeFragment) {
            return holderFragment
        }
        return null
    }
    fun startForResult(intent: Intent, requestCode: Int, callback: Callback) {
        holderLifeFragment?.startForResult(intent, requestCode, callback)
    }
    interface Callback {
        fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?)
    }
    companion object {
        fun of(act: FragmentActivity): AvoidOnResult {
            return AvoidOnResult(act)
        }

        fun of(act: Fragment): AvoidOnResult {
            return AvoidOnResult(act)
        }
    }
}
```

使用：

```kotlin
var intent = Intent(applicationContext, HolderFragmentActivity结果页::class.java)
intent.putExtra("from", "activity")
AvoidOnResult.of(this)
        .startForResult(intent, 110, object : AvoidOnResult.Callback {
            override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
                var result = data?.getStringExtra("data")
                ToastUtils.showLong("$resultCode,$result")
                tv_activity_result.text = "$resultCode,$result"
            }
        })
```

## Ref

- Androidx 下 Fragment 懒加载的新实现<br /><https://juejin.im/post/5e232d01e51d455801624c06>

> <https://github.com/AndyJennifer/AndroidxLazyLoad>
