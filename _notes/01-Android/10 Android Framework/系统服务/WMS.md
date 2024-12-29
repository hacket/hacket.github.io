---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# WMS基础

## Window

### Window是什么？

Window是一个窗口的概念，是所有View的直接管理者，任何视图都通过Window呈现(如Activity和Dialog都是PhoneWindow)，点击事件由Window→DecorView→View。

### Window机制

- Window机制就是为了管理屏幕上的view的显示以及触摸事件的传递问题
- Window是一个抽象类，唯一实现类PhoneWindow
- 一个Window对应着一个ViewRootImpl，Window和View是通过ViewRootImpl建立联系的
- Window并不是实际存在的，而是以View的形式存在；View是视图的呈现方式，不能单独存在，必须依附在Window这个抽象的概念上
- 实际使用中无法直接访问Window，必须通过WindowManager，WindowManager的实现是WindowManagerImpl，最终是通过WMS交互（IPC）

### Window、WindowManager和WMS关系

- Window是一个抽象类，并不是真实存在， 唯一实现是PhoneWindow，它对View进行管理；
- WindowManager是一个接口类，用来管理Window的，实现类是WindowManagerImpl，用来对Window进行添加、更新很删除；
- WindowManager会将具体的工作交由WMS来处理，WindowManager和WMS通过Binder来进行IPC通信，WMS作为系统服务还有很多API不会暴露给WindowManager的。

**Window、WindowManager和WMS关系图：**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675263887236-2f71a4c3-3979-4e4f-9efd-99358cc96f32.png#averageHue=%23f9f9f9&clientId=u89ca6a91-04e9-4&from=paste&height=266&id=u26ee65fb&originHeight=531&originWidth=727&originalType=binary&ratio=1&rotation=0&showTitle=false&size=107252&status=done&style=none&taskId=u45378a06-daca-4d5f-8310-554d4b6bbd1&title=&width=363.66668701171875)

### Activity、Window、DecorView和View之间的关系

每个Activity包含了一个Window对象，这个对象是由PhoneWindow实现的。而 PhoneWindow 将DecorView作为了一个应用窗口的根View，这个DecorView又把屏幕划分为了两个区域：一个是TitleView，也就是ActionBar或者TitleBar，一个是 ContentView，而我们平时在 Xml 文件中写的布局正好是展示在 ContentView 中的。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675266001870-3552e1ef-ba39-44b3-a53e-6ecb51481553.png#averageHue=%233f41cd&clientId=u89ca6a91-04e9-4&from=paste&height=633&id=u0d59e4b3&originHeight=950&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=65762&status=done&style=none&taskId=ucdf4fcbb-9baa-41a2-b743-43d1177ccc8&title=&width=426.6666666666667)

## WMS职责？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675264021455-99236ff0-9278-4e2c-848d-66bbdc9bab7b.png#averageHue=%23f9f9f9&clientId=u89ca6a91-04e9-4&from=paste&height=376&id=u225844e1&originHeight=564&originWidth=1161&originalType=binary&ratio=1&rotation=0&showTitle=false&size=155603&status=done&style=none&taskId=uf5b46921-e652-4bde-a2a2-fc1f18321d7&title=&width=774)

### 1、窗口管理

WMS是窗口的管理者，它负责窗口的启动、添加和删除，另外窗口的大小和层级也是由WMS进行管理的；窗口管理的核心成员有DisplayContent、WindowToken和WindowState。

### 2、窗口动画

窗口动画由WMS的动画子系统来负责，动画子系统的管理者为WindowAnimator。

### 3、输入系统的中转站

InputManagerService会对触摸事件进行处理，它会寻找一个最合适的窗口来处理触摸反馈信息，WMS是窗口的管理者，它作为输入系统的中转站再合适不过了

### 4、Surface管理

窗口并不具备绘制的功能，因此每个窗口都需要有一块Surface来供自己绘制，为每个窗口分配Surface是由WMS来完成的。而SurfaceFlinger会将WMS维护的Surface按一定次序混合后显示到屏幕上。

## WMS启动流程

SystemServer.startOtherServices() →<br />WindowManagerService.main → <br />通过runWithScissors()方法在android.display线程初始化WMS<br />**如何理解 system_server、android.display 和 android.ui 三个线程之间的关系？** <br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675264661392-1b5cd7d9-9b2c-47ca-aad2-a051e34d00fc.png#averageHue=%23f7f7f7&clientId=u89ca6a91-04e9-4&from=paste&height=463&id=u17616399&originHeight=821&originWidth=887&originalType=binary&ratio=1&rotation=0&showTitle=false&size=178981&status=done&style=none&taskId=u3f44e802-b08c-4610-98f7-e56964dae00&title=&width=500.3333740234375)

## ViewRootImpl

### 什么是ViewRootImpl？

ViewRootImpl是View和WindowManager的纽带。

### ViewRootImpl作用

ViewRootImpl作为连接WindowManager和DecorView的纽带，同时实现了ViewParent接口，ViewRootImp作为整个控件树的根部，它是View树正常运作的动力所在，控件的测量、布局、绘制以及输入事件的分发都由ViewRootImpl控制。

- 一个Window对应一颗View数，对应一个ViewRootImpl实例
- ViewRootImpl控制View的measure、layout和draw
- ViewRootImpl控制输入事件分发

### ViewRootImpl何时被创建？

WindowManagerGlobal.addView的时候

> ActivityThread#handleLaunchActivity() →<br />ActivityThread#performLaunchActivity() →<br />ActivityThread#handleResumeActivity() →<br />ActivityThread#performResumeActivity() →<br />Activity#onResume()/makeVisible() →<br />WindowManager#addView(View view/_DecorView_/, ViewGroup.LayoutParams params) →<br />WindowManagerImpl#addView() →<br />WindowManagerGlobal#addView() （new ViewRootImpl）→<br />ViewRootImpl#setView(View view, WindowManager.LayoutParams attrs, View panelParentView) →

# WMS相关问题

## 从Activity创建到View呈现中间发生了什么？

- [x] [从Activity创建到View呈现中间发生了什么？](https://mp.weixin.qq.com/s?__biz=MzU4NDc1MjI4Mw==&mid=2247483864&idx=1&sn=ca212f527ed4d29e1910d689f2f69b0e&chksm=fd944c2ccae3c53a36432164917d8c1d7d447204e036dd08ffb3d7fea43526ecdc8df87d0668&token=917258391&lang=zh_CN&scene=21#wechat_redirect)

### Activity、Window、WindowManager、DecorView、ViewRootImpl作用：

- **Activity** Activity像是一个指挥官，它不处理具体的事务，只在适当的时候指挥Window/WindowManager工作。例如：在attach时创建Window对象、onResume后通知WindowManager添加view。
- **Window **Window是一个窗口，它是View的容器。Android中的视图以View树的形式组织在一起，而View树必须依附在Window上才能工作。一个Window对应着一个View树。启动Activity时会创建一个Window，显示Dialog时也会创建一Window。因此Activity内部可以有多个Window。由于View的测量、布局、绘制只是在View树内进行的，因此一个Window内View的改动不会影响到另一个Window。Window是一个抽象类，它只有一个实现类PhoneWindow。
- **WindowManager** WindowManager是Window的管理类。它不直接操作Window，而是操作Window内的DecorView。WindowManager是一个接口。它的具体实现类是WindowManagerImpl。
- **DecorView**是View树的顶级View，它是FrameLayout的子类。根据Activity设置的Theme，DecorView会有不同布局。但无论布局怎么变，DecorView都有一个Id为R.id.content的FrameLayout。Activity.setContentView()方法就是在这个FrameLayout中添加子View。
- **ViewRootImpl**是连接WindowManager和DecorView的纽带，View的三大流程均是通过ViewRootImpl来完成的。

### 从Activity创建到View呈现中间发生了什么？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675266700185-adaf00ad-e74b-468f-9e39-19433bd4f51c.png#averageHue=%23d7f2d6&clientId=u89ca6a91-04e9-4&from=paste&height=558&id=gGZBX&originHeight=1085&originWidth=1873&originalType=binary&ratio=1&rotation=0&showTitle=false&size=555603&status=done&style=none&taskId=ua1706fd0-fcab-44de-aa86-7d87f731e5a&title=&width=963)<br />**Activity创建 -- **ActivityThread.handleLaunchActivity<br />我们通过startActivity时，如果目标Activity的进程未创建，AMS会通过Socket通知Zygote进程fork出应用进程；然后一堆调用链，最终会调用到ActivityThread的`handleLaunchActivity()`方法

```java
private void handleLaunchActivity(ActivityClientRecord r, Intent customIntent) {
    // ...
    // performLaunchActivity
    Activity a = performLaunchActivity(r, customIntent);
    if (a != null) {
        r.createdConfig = new Configuration(mConfiguration);
        Bundle oldState = r.state;       
        // handleResumeActivity
        handleResumeActivity(r.token, false, r.isForward,!r.activity.mFinished && !r.startsNotResumed);
        // ...
    }
}
```

handleLaunchActivity()主要调用了两个方法：performLaunchActivity()和handleResumeActivity()

- performLaunchActivity：完成Activity的创建，以及调用Activity的onCreate()和onStart()方法。
  - 创建Activity，通过反射
  - 创建Context
  - 调用Activity.attach()，创建PhoneWindow；关联WindowManager
  - 调用Activity.onCreate()
  - 调用Activity.onStart()
- handleResumeActivity：调用Activity的onResume()方法，处理View的呈现

**PhoneWindow.setContentView 创建DecorView**<br />在Activity.onCreate会调用setContentView方法，它是调用的PhoneWindow的setContentView方法，主要是根据不同的Activity Theme初始化DecorView，加载不同的布局。<br />**handleResumeActivity 创建Activity**

- 通过performResumeActivity()处理Activity的onRestart onResume的生命周期。
- 将DecorView设置为InVisible
- 通过WindowManager.addView()将DecorView绘制完成
- 将DecorView设置为Visiable
- IPC通知AMS Activity启动完成

**WindowManager.addView**

- WindowManagerImpl.addView会调用WindowManagerGlobal.addView()
- 先创建ViewRootImpl，随后把View、ViewRootImpl、LayoutParams都保存在各自的List中，以供将来更新UI使用；调用ViewRootImpl.setView()方法
- ViewRootImpl.setView()会调用requestLayout()方法；requestLayout()方法首先会检查当前执行的线程是不是UI线程，随后调用scheduleTraversals()。scheduleTraversals会把本次请求封装成一个TraversalRunnable对象，这个对象最后会交给Handler去处理。最后ViewRootImpl.performTraversals()被调用；performTraversals()主要是处理View树的measure、layout、draw等流程

**ViewRootImpl.scheduleTraversals**

- ViewRootImpl.scheduleTraversals方法中会发送一个同步屏障，目的是执行异步消息，阻塞同步消息，直到同步屏障被移除，让TraversalRunnable更快地被执行
- 然后通过Choreographer postCallback会通过Handler发一个异步消息，action是TraversalRunnable
- 而TraversalRunnable里面的逻辑就是View的measure/layout/draw等逻辑

## 为什么要有设计Window？

1. 假如没有Window，那Window管理View树的代码必然会放到Activity中。这样Activity就变得十分庞大，这与我们前面说的Activity指挥官的角色相违背。
2. 把View树的管理工作封装到Window后，在调用Dialog.show()、Dialog.hide()等Window切换时，Activity只需要负责Window的显示和隐藏即可。
3. View的测量、布局、绘制只是在View树内进行的，把一个View树封装在一个Window中方便视图管理。

## Window、View和ViewRootImpl

每个Window对应一个ViewTree，其根节点是ViewRootImpl，ViewRootImpl自上而下地控制着ViewTree的一切（绘制、事件和UI更新）

## 子线程真的不能更新UI吗？

- [ ] [Android 子线程 UI 操作真的不可以？](https://segmentfault.com/a/1190000041870945)

### 主线程、UI线程和子线程概念？

**UI线程：**创建ViewRootImpl的线程，最终执行View的measure/layout/draw等UI操作的线程；且需是Looper线程<br />**主线程：**创建ActivityThread的线程；主线程也是UI线程；也是Looper线程<br />**子线程：**非UI线程和主线程的子线程，可能是Looper线程

### 子线程能requestLayout？

- 在 ViewRootImpl 还没创建出来之前子线程可以更新UI
  - UI 修改的操作没有线程限制(Activity.onCreate、onStart和onResume)。
- 在 ViewRootImpl 创建完成之后
  1. 保证「**创建 ViewRootImpl 的操作（WindowManager.addView的操作）**」和「**执行修改 UI 的操作**」在同一个线程即可。

> 对应的线程需要创建Looper并且调用Looper#loop方法，开启消息循环。

2. 创建ViewRootImpl和执行UI更新的线程不在同一个线程，会抛异常

### 子线程能不能invalidate？

看情况。子线程能更新ui的情况：

1. **ViewRootImpl未创建，可以更新**

在ViewRootImpl创建之前invalidate不受线程限制，Activity的onResume后，ViewRootImpl创建了

2. **ViewRootImpl已创建**

- Android8.0及以上得分情况
  - 硬件加速可用，子线程可以更新UI
  - 硬件加速不可用，走软件绘制逻辑，子线程不能更新UI
- Android8.0以下，不能子线程更新UI

### 为什么Google设计成创建ViewRootImpl和执行UI更新的线程需要在同一个线程？

1. 如果在不同的线程去操纵一个控件，由于网络延迟或大量耗时操作，会使UI绘制混乱，出了问题也很难去排查是哪个线程出了问题
2. UI线程非安全线程，如果要保证安全就需要加锁，锁的阻塞会导致其他线程对View的访问效率低下

### ViewRootImpl的线程？CalledFromWrongThreadException哪里来？checkThread时机？ViewRootImpl创建时机？

```java
class ViewRootImpl {
    final Thread mThread;
    public ViewRootImpl() {
        mThread = Thread.currentThread();
    }
    void checkThread() {
        if (mThread != Thread.currentThread()) {
            throw new CalledFromWrongThreadException(
                    "Only the original thread that created a view hierarchy can touch its views.");
        }
    }
}
```

- mThread表示的是创建ViewRootImpl实例的线程
- checkThread检测当前线程和创建ViewRootImpl的线程是否一致

**checkThread()的时机？**

- requestLayout() 重点关注，重绘
- requestFitSystemWindows()
- invalidateChildInParent()

**ViewRootImpl何时被创建？**<br />在WindowManagerGlobal.addView的时候

### View已经被attach到Window后，为什么非UI线程不能更新UI？

当更新UI时，ViewRootImpl 会调用 checkThread 方法去检查当前访问 UI 的线程是否为创建 UI 的那个线程，如果不是。则会抛出异常。

### 在Activity的onCreate/onStart/onResume是可以在子线程更新UI

onResume生命周期回调前，ViewRootImpl 还没创建，requestLayout未调用，那么checkThread()也就调用不到。

### 使用子线程更新 UI 有实际应用场景吗？

**拥有窗口（Window）展示的View，其UI线程可以独立于App主线程，如Dialog、DialogFragment、PopupWindow、Toast、SnackBar及自定义通过WindowManager添加的等**

- **SurfaceView 和 TextureView**

> 这两个 View 是根红苗正用来子线程更新 View 的，SurfaceView 使用自带 Surface 去做画面渲染，TextureView 同样可以通过 TextureView#lockCanvas() 使用临时的 Surface，所以都不会触发 View#requestLayout()。

- **Dialog**

> 将弹窗（dialog的实例化、inflate）与App其他业务相对独立的场景移到子线程运行（条件是创建ViewRootImpl的线程和更新UI的线程是一致的）

**不适用多UI线程场景：**

- WebView WebView的所有方法调用必须在主线程，代码强制了主线程校验
- Activity的使用必须在主线程

## Activity的onCreate方法为什么无法获取View的宽和高？

这个问题和子线程不能更新UI的问题很像，也是方法执行时机的一个问题。View的measure、layout、draw 发生在Activity.onResume()之后，因此在onResume()之前都是无法获取View的宽、高等信息的。
