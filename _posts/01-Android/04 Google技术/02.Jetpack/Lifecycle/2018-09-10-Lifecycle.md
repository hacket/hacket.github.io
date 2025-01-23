---
date_created: Tuesday, September 10th 2018, 1:17:18 am
date_updated: Tuesday, January 21st 2025, 11:42:27 pm
title: Lifecycle
author: hacket
categories:
  - Android
category: Jetpack
tags: [Jetpack, Lifecyle]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-06-19 13:54
date updated: 2024-12-28 00:23
aliases: [Lifecycle]
linter-yaml-title-alias: Lifecycle
---

# Lifecycle

# Lifecycle 基础

## 背景

用于将系统组件（Activity、Fragment 等等）的生命周期分离到 `Lifecycle` 类，Lifecycle 允许其他类作为观察者，观察 Activity/Fragment 组件生命周期的变化。

如 MVP 中的 Presenter，可以监听到 Activity 或 Fragment 中生命周期变化来做对应的操作。

## 使用

官方示例：<https://github.com/googlecodelabs/android-lifecycles>

### 引入

```groovy
//根目录的 build.gradle
repositories {
    google()
    ...
}

//app的build.gradle
dependencies {
    def lifecycle_version = "2.2.0"
    def arch_version = "2.1.0"

    // ViewModel
    implementation "androidx.lifecycle:lifecycle-viewmodel:$lifecycle_version"
    // LiveData
    implementation "androidx.lifecycle:lifecycle-livedata:$lifecycle_version"
    // 只有Lifecycles (不带 ViewModel or LiveData)
    implementation "androidx.lifecycle:lifecycle-runtime:$lifecycle_version"

    // Saved state module for ViewModel
    implementation "androidx.lifecycle:lifecycle-viewmodel-savedstate:$lifecycle_version"

    // lifecycle注解处理器
    annotationProcessor "androidx.lifecycle:lifecycle-compiler:$lifecycle_version"
    // 替换 - 如果使用Java8,就用这个替换上面的lifecycle-compiler
    implementation "androidx.lifecycle:lifecycle-common-java8:$lifecycle_version"

//以下按需引入
    // 可选 - 帮助实现Service的LifecycleOwner
    implementation "androidx.lifecycle:lifecycle-service:$lifecycle_version"
    // 可选 - ProcessLifecycleOwner给整个 app进程 提供一个lifecycle
    implementation "androidx.lifecycle:lifecycle-process:$lifecycle_version"
    // 可选 - ReactiveStreams support for LiveData
    implementation "androidx.lifecycle:lifecycle-reactivestreams:$lifecycle_version"
    // 可选 - Test helpers for LiveData
    testImplementation "androidx.arch.core:core-testing:$arch_version"
}
```

### 1、定义观察者 LifecycleObserver

1. Java7 及之前用注解 `@OnLifecycleEvent`

```java
public interface IPresenter extends LifecycleObserver {
    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    void onCreate(@NotNull LifecycleOwner owner);
    
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    void onDestroy(@NotNull LifecycleOwner owner);
    
    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    void onLifecycleChanged(@NotNull LifecycleOwner owner, @NotNull Lifecycle.Event event);
}
```

2. Java8 用 `DefaultLifecycleObserver`，用的是接口默认方法，`android.arch.lifecycle:common-java8:<version>`，继承了 `FullLifecycleObserver` 接口，本身也是个接口

> 例如 MVP 中的 Presenter 实现该接口

3. LifecycleEventObserver

### 2、在 Activity/Fragment 容器中添加 Observer

```java
public class MainActivity extends AppCompatActivity {

    private IPresenter mPresenter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mPresenter = new MainPresenter(this);
        getLifecycle().addObserver(mPresenter);//添加LifecycleObserver
    }
}
```

每当 Activity 发生了对应的生命周期改变，Presenter 就会执行对应事件注解的方法

### 3、生命周期变化通知观察者

Activity 或 Fragment 生命周期变化时，就会通知 LifecycleObserver

## Lifecycle 和协程

### lifecycleScope 导致 ANR？

## 注意

### addObserver 后是否需要 removeObserver？

官方回答是不需要，但是在源码中没找到 removeObserver 相关代码。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691228625483-d4ba963f-2884-475c-b98c-a075575b3ed0.png#averageHue=%23171b21&clientId=u7634814b-77b5-4&from=paste&height=371&id=ucb73b86b&originHeight=742&originWidth=1652&originalType=binary&ratio=2&rotation=0&showTitle=false&size=153519&status=done&style=stroke&taskId=u9d439f83-ff33-47f5-8d96-187c4d7fb4e&title=&width=826)

> <https://github.com/googlecodelabs/android-lifecycles/issues/5>

### LifecycleObserver 中的 dialog 内存泄漏

- 泄漏的代码：

```java
class LifecycleDialogManager(private val act: FragmentActivity) : DefaultLifecycleObserver {

    private var dialog: MiniRoomDialog? = null // 泄漏
    private var alertDialog: AlertDialog? = null // 不会泄漏，dismiss时置空了

    init {
        act.lifecycle.addObserver(this)
    }

    fun showDialog() {
        dialog = MiniRoomDialog() // 泄漏
        AppWatcher.objectWatcher.expectWeaklyReachable(dialog!!, "MiniRoomDialog对象泄漏检测")
        dialog?.show(act)
    }

    fun showAlertDialog() {
        val builder = AlertDialog.Builder(act)
        builder.setTitle("提示：")
        builder.setMessage("这是一个普通对话框，")
        builder.setIcon(R.mipmap.ic_launcher)
        builder.setCancelable(true)
        alertDialog = builder.create()
        alertDialog?.setOnDismissListener {
            alertDialog = null // 不会泄漏
        }
        alertDialog?.show()
        AppWatcher.objectWatcher.expectWeaklyReachable(alertDialog!!, "AlertDialog对象泄漏检测")
    }

    override fun onDestroy(owner: LifecycleOwner) {
        if (dialog != null && dialog!!.isVisible) {
            dialog?.dismiss()
            dialog = null
        }
        if (alertDialog != null && alertDialog!!.isShowing) {
            alertDialog?.dismiss()
            alertDialog = null
        }
    }

}
```

> dialog 存在泄漏；alertDialog 不存在泄漏，因为在 dismiss 时，将引用置空了

- 泄漏堆栈:

```
┬───
│ GC Root: System class
│
├─ android.app.ActivityThread class
│    Leaking: NO (Lifecycle引用Dialog内存泄漏测试Activity↓ is not leaking and a class
│    is never leaking)
│    ↓ static ActivityThread.sCurrentActivityThread
├─ android.app.ActivityThread instance
│    Leaking: NO (Lifecycle引用Dialog内存泄漏测试Activity↓ is not leaking)
│    mInitialApplication instance of me.hacket.assistant.debug.DebugApp
│    mSystemContext instance of android.app.ContextImpl
│    mSystemUiContext instance of android.app.ContextImpl
│    ↓ ActivityThread.mActivities
├─ android.util.ArrayMap instance
│    Leaking: NO (Lifecycle引用Dialog内存泄漏测试Activity↓ is not leaking)
│    ↓ ArrayMap.mArray
├─ java.lang.Object[] array
│    Leaking: NO (Lifecycle引用Dialog内存泄漏测试Activity↓ is not leaking)
│    ↓ Object[].[1]
├─ android.app.ActivityThread$ActivityClientRecord instance
│    Leaking: NO (Lifecycle引用Dialog内存泄漏测试Activity↓ is not leaking)
│    activity instance of me.hacket.assistant.samples.google.architecture.
│    lifecycle.dialog.Lifecycle引用Dialog内存泄漏测试Activity with mDestroyed = false
│    ↓ ActivityThread$ActivityClientRecord.activity
├─ me.hacket.assistant.samples.google.architecture.lifecycle.dialog.
│  Lifecycle引用Dialog内存泄漏测试Activity instance
│    Leaking: NO (Activity#mDestroyed is false)
│    mApplication instance of me.hacket.assistant.debug.DebugApp
│    mBase instance of androidx.appcompat.view.ContextThemeWrapper
│    ↓ ComponentActivity.mLifecycleRegistry
│                        ~~~~~~~~~~~~~~~~~~
├─ androidx.lifecycle.LifecycleRegistry instance
│    Leaking: UNKNOWN
│    Retaining 490.3 kB in 1691 objects
│    ↓ LifecycleRegistry.mObserverMap
│                        ~~~~~~~~~~~~
├─ androidx.arch.core.internal.FastSafeIterableMap instance
│    Leaking: UNKNOWN
│    Retaining 490.1 kB in 1686 objects
│    ↓ SafeIterableMap.mEnd
│                      ~~~~
├─ androidx.arch.core.internal.SafeIterableMap$Entry instance
│    Leaking: UNKNOWN
│    Retaining 56 B in 3 objects
│    ↓ SafeIterableMap$Entry.mPrevious
│                            ~~~~~~~~~
├─ androidx.arch.core.internal.SafeIterableMap$Entry instance
│    Leaking: UNKNOWN
│    Retaining 56 B in 3 objects
│    ↓ SafeIterableMap$Entry.mKey
│                            ~~~~
├─ me.hacket.assistant.samples.google.architecture.lifecycle.dialog.
│  LifecycleDialogManager instance
│    Leaking: UNKNOWN
│    Retaining 50.8 kB in 821 objects
│    act instance of me.hacket.assistant.samples.google.architecture.lifecycle.
│    dialog.Lifecycle引用Dialog内存泄漏测试Activity with mDestroyed = false
│    ↓ LifecycleDialogManager.dialog
│                             ~~~~~~
╰→ me.hacket.assistant.samples.ui.动画.直播间动画方案.最小化动画.MiniRoomDialog instance
     Leaking: YES (ObjectWatcher was watching this because me.hacket.assistant.
     samples.ui.动画.直播间动画方案.最小化动画.MiniRoomDialog received Fragment#onDestroy()
     callback and ObjectWatcher was watching this because MiniRoomDialog对象泄漏检测
     and Fragment#mFragmentManager is null)
     Retaining 50.8 kB in 820 objects
     key = c212fc7a-01e9-4671-b7b6-1432e8b90161
     watchDurationMillis = 8714
     retainedDurationMillis = 3713
     key = c337b0b6-0da4-4459-8375-504cac03e86d
     watchDurationMillis = 9376
     retainedDurationMillis = 4326

METADATA

Build.VERSION.SDK_INT: 29
Build.MANUFACTURER: Xiaomi
LeakCanary version: 2.7
App process name: me.hacket.assistant
Stats: LruCache[maxSize=3000,hits=5822,misses=64738,hitRate=8%]
RandomAccess[bytes=3535826,reads=64738,travel=27379915308,range=20594612,size=25
383126]
Heap dump reason: 7 retained objects, app is visible
Analysis duration: 3569 ms
```

- 分析<br>当前 LifecycleOwner 是个 Activity(`Lifecycle引用Dialog内存泄漏测试Activity`)，LifecycleDialogManager 是一个 LifecycleObserver，LifecycleOwner 中有一个 Lifecycle 实例 mLifecycleRegistry(`LifecycleRegistry` 是 Lifecycle 的实现子类)，在我们 addObserver 时，会将 LifecycleObserver 即 LifecycleDialogManager 包装下保存在 `LifecycleRegistry#mObserverMap` 变量中。当我们 show 了一个 dialog 时，首先 new 了一个 dialog，然后将该 dialog 的引用保存在 LifecycleDialogManager，当我们还未退出 Activity 时，将 dialog dismiss 时，由于此时 `LifecycleRegistry#mObserverMap` 保存着 LifecycleObserver 实例，而 LifecycleDialogManager 又持有 dialog 的引用，进而导致 dialog dimiss 时，但由于还被 LifecycleDialogManager 持有着一直不能释放，进而导致该 dialog 内存泄漏了
- 解决<br>在 dialog dismiss 时，将其在 LifecycleObserver 中的引用置为 null 即可。
- 总结

> 在 LifecyleObserver 中不要持有比 LifecycleOwner 生命周期短的变量，如 Dialog；如果要持有，需要 Dialog 在 dismiss 时将 LifecycleObserver 中保存的变量给置空

## 使用场景

### view 中获取 LifecycleOwner

用 androidX 的 `ViewTreeLifecycleOwner` ：ViewTreeLifecycleOwner.get(view)

Fragment/AppCompatActivity/DialogFragment

### MVP 中 Presenter 添加 Lifecycle 感知 -- Presenter 作为 LifecycleObserver

```java
public interface IPresenter extends DefaultLifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    void onCreate(@NonNull LifecycleOwner owner);

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    void onDestroy(@NonNull LifecycleOwner owner);

    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    void onLifecycleChanged(@NonNull LifecycleOwner owner, @NonNull Lifecycle.Event event);
}
```

### 自定义 View 感知事件 -- 自定义 View 作为 LifecycleObserver

```java
public class CustomView extends FrameLayout implements DefaultLifecycleObserver {
    @Override
    public void onCreate(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onCreate");
    }
    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onStart");
    }
    @Override
    public void onResume(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onResume");
    }
    @Override
    public void onPause(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onPause");
    }
    @Override
    public void onStop(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onStop");
    }
    @Override
    public void onDestroy(@NonNull LifecycleOwner owner) {
        Log.d(TAG, "onDestroy");
    }
}
```

组件关联的时候，需要创建 DefaultLifecycleObserver 的实例，实现类 CustomView 就是 LifecycleObserver 的实例，然后将其添加到 Observer 中，就可以进行生命周期的感知了。

```java
CustomView view = findViewById(R.id.custom);
getLifecycle().addObserver(view);
```

### 自动移除 Handler 的消息：LifecycleHandler

```kotlin
class LifecycleHandler(val owner: LifecycleOwner, looper: Looper? = null, callback: Callback? = null) : Handler(looper, callback), DefaultLifecycleObserver {
    fun addObserver(): LifecycleHandler {
        owner.lifecycle.addObserver(this)
        return this
    }

    override fun onDestroy(owner: LifecycleOwner) {
        removeCallbacksAndMessages(null)
        owner.lifecycle.removeObserver(this)
    }
}
```

### 给 ViewHolder 添加 Lifecycle 的能力

有些 App 会有长列表的页面，里面塞了各种不用样式的 Item，通常会用 RecyclerView 来实现，有时候部分 Item 需要获知生命周期事件，比如包含播放器的 Item 需要感知生命周期来实现暂停/重播的功能，借助 Lifecycle 我们可以实现。

<https://github.com/AlanCheen/Flap/blob/master/flap/src/main/java/me/yifeiyuan/flap/FlapAdapter.java>

### 将自己的组件作为 LifecycleOwner  (实现自定义 LifecycleOwner)

支持库 26.1.0 及更高版本中的 Fragment 和 Activity 已实现 LifecycleOwner 接口。如果您有一个自定义类并希望使其成为 LifecycleOwner，您可以使用 LifecycleRegistry 类，但需要将事件转发到该类，如以下代码示例中所示：

1. 生命周期生产者实现 LifecycleOwner，我们称之为被观察者
2. 组合 LifecycleRegistry，处理生命周期的变化
3. 生命周期监听者，称之为观察者，addObserver() 监听生命周期

```kotlin
class MyActivity : Activity(), LifecycleOwner {

    private lateinit var lifecycleRegistry: LifecycleRegistry

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleRegistry = LifecycleRegistry(this)
        lifecycleRegistry.markState(Lifecycle.State.CREATED)
    }

    public override fun onStart() {
        super.onStart()
        lifecycleRegistry.markState(Lifecycle.State.STARTED)
    }

    override fun getLifecycle(): Lifecycle {
        return lifecycleRegistry
    }
}
```

#### ViewLifecycleOwner

1. 让一个 view 具备 lifecycle 能力
2. 在其 visible 时发送 `ON_CREATE` 事件，gone 或 invisible 时，发送 `ON_STOP事件`，onViewDetachedFromWindow 时发送 `ON_DESTROY` 事件

```java
class ViewLifecycleOwnerDelegate(val view: View) : ViewLifecycleOwner,
    View.OnAttachStateChangeListener {

    private val mLifecycleRegistry = LifecycleRegistry(this)

    init {
        view.addOnAttachStateChangeListener(this)
        handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
    }

    // Android5.1及以下onVisibilityChanged在构造方法中调用，子类在onVisibilityChanged访问成员变量会导致空指针；
    // 避免在子类onVisibilityChanged调用初始化的成员变量，注意判空
    fun onVisibilityChanged(visibility: Int) {
        if (mLifecycleRegistry.currentState.isAtLeast(Lifecycle.State.CREATED)) {
            when (visibility) {
                View.VISIBLE -> {
                    handleLifecycleEvent(Lifecycle.Event.ON_START)
                }
                View.GONE -> {
                    handleLifecycleEvent(Lifecycle.Event.ON_STOP)
                }
                View.INVISIBLE -> {
                    handleLifecycleEvent(Lifecycle.Event.ON_STOP)
                }
            }
        }
    }

    private fun handleLifecycleEvent(@NonNull event: Lifecycle.Event) {
        mLifecycleRegistry.handleLifecycleEvent(event)
    }

    override fun getLifecycle(): Lifecycle {
        return mLifecycleRegistry
    }

    override fun onViewAttachedToWindow(v: View?) {
        handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
    }

    override fun onViewDetachedFromWindow(v: View?) {
        if (mLifecycleRegistry.currentState.isAtLeast(Lifecycle.State.CREATED) && mLifecycleRegistry.currentState != Lifecycle.State.DESTROYED) {
            handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
        }
        view.removeOnAttachStateChangeListener(this)
    }

}

interface ViewLifecycleOwner : LifecycleOwner
```

让某个实现 ViewLifecycleOwner 接口：

```kotlin
class KittyGameView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : FrameLayout(context, attrs), ViewLifecycleOwner {

    private val mViewLifecycleOwnerDelegate: ViewLifecycleOwnerDelegate? = null
 
    override fun getLifecycle(): Lifecycle {
        return getViewLifecycleOwnerDelegate().lifecycle
    }

    private fun getViewLifecycleOwnerDelegate(): ViewLifecycleOwnerDelegate {
        var view = mViewLifecycleOwnerDelegate
        if (view == null) {
            view = ViewLifecycleOwnerDelegate(this)
        }
        return view
    }

    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        getViewLifecycleOwnerDelegate().onVisibilityChanged(visibility)
    }
    // ...
}
```

#### RecyclerView.ViewHolder

```kotlin
// from mashi
open class LifecycleViewHolder(view: View?) : BaseViewHolder(view), LifecycleOwner, ViewHolderStateListener {

    companion object {
        private const val TAG = "LifecycleViewHolder"
        private var DEBUG = false
    }


    private var mLifecycleRegistry: LifecycleRegistry = object: LifecycleRegistry(this) {

        override fun addObserver(observer: LifecycleObserver) {
            super.addObserver(observer)
            if (DEBUG) Log.i(TAG,
                    "observer ${this@LifecycleViewHolder.hashCode()} " +
                            "${this.observerCount} addObserver ${observer.hashCode()}")
        }

        override fun removeObserver(observer: LifecycleObserver) {
            super.removeObserver(observer)
            if (DEBUG) Log.i(TAG,
                    "observer ${this@LifecycleViewHolder.hashCode()} " +
                            "${this.observerCount} removeObserver ${observer.hashCode()}")
        }
    }

    override fun getLifecycle(): Lifecycle {
        return mLifecycleRegistry
    }

    @CallSuper
    override fun onViewAttachedToWindow() {
        if (DEBUG) Log.i(TAG, "hash = ${hashCode()} " + " onViewAttachedToWindow")
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START)
    }

    @CallSuper
    override fun onViewDetachedFromWindow() {
        if (DEBUG) Log.i(TAG, "hash = ${hashCode()} " + " onViewDetachedFromWindow")
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP)
    }

    @CallSuper
    override fun onRecyclerViewDetach() {
        if (DEBUG) Log.i(TAG, "hash = ${hashCode()} " + " onRecyclerViewDetach ")
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    }

    @CallSuper
    open fun onDataBound() {
        if (DEBUG) Log.i(TAG, "hash = ${hashCode()} " + " bindData " + "${mLifecycleRegistry.currentState}")

        // 避免将START->STOP的状态重置为ONCREATE
        if (!mLifecycleRegistry.currentState.isAtLeast(Lifecycle.State.CREATED)) {
            mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
        }
    }

    @CallSuper
    open fun onViewRecycled() {
        if (DEBUG) Log.i(TAG, "hash = ${hashCode()} " + " onViewRecycled ")
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    }
}
```

# Lifecycle 总结

Activity/Fragment 是个 LifecycleOwner 是生命周期的拥有者，是一个被观察者；LifecycleEventObserver 是观察者；Lifecycle 是观察者管理类，通过该类管理观察者的注册和反注册

## 1、Activity

Activity 的 Lifecycle 实现原理，就是在 onCreate 里面 `ReportFragment.injectIfNeededIn(this);`，根据 API 是否大于等于 29，如果大于等于 29 的话就用 `Application.ActivityLifecycleCallbacks` 中的声明周期回调，如果小于的话，就用 ReportFragment 的生命周期回调<br>在生命周期回调里，会调用 LifecycleRegistry 的 handleLifecycleEvent 来做状态的移动，最终会调用你注册的 LifecycleEventObserver 的 onStateChanged，从而实现声明周期的感知

## 2、Fragment

Fragment 的实现原理和 Activity 的类似，只是 Fragment 没有 ReportFragment，它只是在自己的生命周期内调用 LifecycleRegistry 的 handleLifecycleEvent 来通知它的 LifecycleEventObserver 生命周期的变更
