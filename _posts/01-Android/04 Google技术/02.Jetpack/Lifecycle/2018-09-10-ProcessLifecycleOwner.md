---
date_created: Tuesday, September 10th 2018, 1:17:18 am
date_updated: Thursday, January 23rd 2025, 1:24:08 am
title: ProcessLifecycleOwner
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
date created: 2024-09-09 17:23
date updated: 2024-12-24 00:32
aliases: [ProcessLifecycleOwner 监听前后台切换]
linter-yaml-title-alias: ProcessLifecycleOwner 监听前后台切换
---

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240914215412.png)

# ProcessLifecycleOwner 监听前后台切换

## 引入依赖

需要引入

```groovy
androidx.lifecycle:lifecycle-process:<*>

def version = "2.2.0"  
implementation "androidx.lifecycle:lifecycle-extensions:$version"
```

## Events

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240914215431.png)

## 使用

```java
interface AppLifecycleObserver : LifecycleObserver {
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun onAppForeground() {
    }
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun onAppBackground() {
    }
}
// 开启监听
ProcessLifecycleOwner.get().lifecycle.addObserver(AppLifecycleObserver)

// 或者实现DefaultLifecycleObserver
class BackgroundForegroundListener : DefaultLifecycleObserver {  
  
	private val TAG = "DefaultLifecycleObserver"  
	  
	override fun onCreate(owner: LifecycleOwner) {  
	super.onCreate(owner)  
	Log.i(TAG, "onCreate ")  
	}  
	  
	override fun onStart(owner: LifecycleOwner) {  
	super.onStart(owner)  
	Log.i(TAG, "onStart ")  
	}  
	  
	override fun onStop(owner: LifecycleOwner) {  
	super.onStop(owner)  
	Log.i(TAG, "onStop ")  
	}  
	  
	override fun onResume(owner: LifecycleOwner) {  
	super.onResume(owner)  
	Log.i(TAG, "onResume ")  
	}  
	  
	override fun onDestroy(owner: LifecycleOwner) {  
	super.onDestroy(owner)  
	Log.i(TAG, "onDestroy ")  
	}  
	  
	override fun onPause(owner: LifecycleOwner) {  
	super.onPause(owner)  
	Log.i(TAG, "onPause ")  
	}  
}
```

或

```kotlin
object MyAppLife : AppLifecycleObserver {
    private var isAppForeground = false
    fun init() {
        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
    }
    override fun onAppForeground() {
        isAppForeground = true
        LogUtils.i("onAppForeground isAppForeground=$isAppForeground")
    }
    override fun onAppBackground() {
        isAppForeground = false
        LogUtils.w("onAppBackground isAppForeground=$isAppForeground")
    }
    fun isAppForeground(): Boolean {
        return isAppForeground
    }
}
// 开启
MyAppLife.init()
```

## 源码分析

ProcessLifecycleOwner 在 `ProcessLifecycleOwnerInitializer` 初始化的。

### LifecycleDispatcher

`LifecycleDispatcher#init`，在 `ProcessLifecycleOwnerInitializer#onCreate()` 这个 ContentProvider 初始化时加载

```java
public class ProcessLifecycleOwnerInitializer extends ContentProvider {
    @Override
    public boolean onCreate() {
        LifecycleDispatcher.init(getContext());
        ProcessLifecycleOwner.init(getContext());
        return true;
    }
}
```

再看看 LifecycleDispatcher：

```java
class LifecycleDispatcher {

    private static AtomicBoolean sInitialized = new AtomicBoolean(false);

    static void init(Context context) {
        if (sInitialized.getAndSet(true)) {
            return;
        }
        ((Application) context.getApplicationContext())
                .registerActivityLifecycleCallbacks(new DispatcherActivityCallback());
    }

    @SuppressWarnings("WeakerAccess")
    @VisibleForTesting
    static class DispatcherActivityCallback extends EmptyActivityLifecycleCallbacks {

        @Override
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
            ReportFragment.injectIfNeededIn(activity);
        }

        @Override
        public void onActivityStopped(Activity activity) {
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
        }
    }

    private LifecycleDispatcher() {
    }
}
```

- Init 方法通过 registerActivityLifecycleCallbacks 注册了 DispatcherActivityCallback
- 在每个 `Activity#onCreate` 时，`ReportFragment.injectIfNeededIn(activity)`，这里 inject 的目的是统计每个 Activity start/resume。通过 `ReportFragment.setProcessListener`

```java
// ReportFragment
public class ReportFragment extends Fragment {
    
    public static void injectIfNeededIn(Activity activity) {
        if (Build.VERSION.SDK_INT >= 29) {
            // On API 29+, we can register for the correct Lifecycle callbacks directly
            LifecycleCallbacks.registerIn(activity);
        }
        // Prior to API 29 and to maintain compatibility with older versions of
        // ProcessLifecycleOwner (which may not be updated when lifecycle-runtime is updated and
        // need to support activities that don't extend from FragmentActivity from support lib),
        // use a framework fragment to get the correct timing of Lifecycle events
        android.app.FragmentManager manager = activity.getFragmentManager();
        if (manager.findFragmentByTag(REPORT_FRAGMENT_TAG) == null) {
            manager.beginTransaction().add(new ReportFragment(), REPORT_FRAGMENT_TAG).commit();
            // Hopefully, we are the first to make a transaction.
            manager.executePendingTransactions();
        }
    }
    
    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        dispatchCreate(mProcessListener);
        dispatch(Lifecycle.Event.ON_CREATE);
    }

    @Override
    public void onStart() {
        super.onStart();
        dispatchStart(mProcessListener);
        dispatch(Lifecycle.Event.ON_START);
    }

    @Override
    public void onResume() {
        super.onResume();
        dispatchResume(mProcessListener);
        dispatch(Lifecycle.Event.ON_RESUME);
    }
    
    void setProcessListener(ActivityInitializationListener processListener) {
        mProcessListener = processListener;
    }
}
```

- 在 onCreate/onResume/onStart 之后 dispatch event 及 onPause/onStop/onDestroy 之前 dispatch event
- API 29 之前通过 ReportFragment；API 29 及以上通过新的 ActivityLifecycleCallbacks 接口

### ProcessLifecycleOwner

在 `ProcessLifecycleOwnerInitializer#onCreate()` 中调用了 `ProcessLifecycleOwner#init()`，然后调用 ProcessLifecycleOwner 的 attach ()，注册了一个 EmptyActivityLifecycleCallbacks

```java
// ProcessLifecycleOwner
static void init(Context context) {
    sInstance.attach(context);
}
void attach(Context context) {
    Application app = (Application) context.getApplicationContext();
    app.registerActivityLifecycleCallbacks(new EmptyActivityLifecycleCallbacks() {
        @Override
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
            // Only use ReportFragment pre API 29 - after that, we can use the
            // onActivityPostStarted and onActivityPostResumed callbacks registered in
            // onActivityPreCreated()
            if (Build.VERSION.SDK_INT < 29) {
                ReportFragment.get(activity).setProcessListener(mInitializationListener);
            }
        }
    }
}
ActivityInitializationListener mInitializationListener =
    new ActivityInitializationListener() {
        @Override
        public void onCreate() {
        }

        @Override
        public void onStart() {
            activityStarted();
        }

        @Override
        public void onResume() {
            activityResumed();
        }
    };
```

- API 大于等于 29，用的 onActivityCreated
- API 小于 29，用的 `ReportFragment.setProcessListener` 监听

现在看是怎么回调的。

```java
private Runnable mDelayedPauseRunnable = new Runnable() {
    @Override
    public void run() {
        dispatchPauseIfNeeded();
        dispatchStopIfNeeded();
    }
};
void activityResumed() {
    mResumedCounter++;
    if (mResumedCounter == 1) {
        if (mPauseSent) {
            mRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
            mPauseSent = false;
        } else {
            mHandler.removeCallbacks(mDelayedPauseRunnable);
        }
    }
}
void activityPaused() {
    mResumedCounter--;
    if (mResumedCounter == 0) {
        mHandler.postDelayed(mDelayedPauseRunnable, TIMEOUT_MS);
    }
}
void dispatchPauseIfNeeded() {
    if (mResumedCounter == 0) {
        mPauseSent = true;
        mRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE);
    }
}

void dispatchStopIfNeeded() {
    if (mStartedCounter == 0 && mPauseSent) {
        mRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP);
        mStopSent = true;
    }
}
```

- ActivityPaused ()，当 resume 的 Activity 为 0 时，发送了一个延迟 700 ms 的 mDelayedPauseRunnable
- MDelayedPauseRunnable 发送了 ON_PAUSE/ON_STOP 事件
- 当 resume 的 Activity 为 1 时，在 activityResumed 会发送一个 ON_RESUME 事件，同时移除 mDelayedPauseRunnable

我们就可以用来监听 App 处于前台和后台，监听 `ON_START` 和 `ON_STOP` 事件即可实现

## ProcessLifecycleOwner 总结

0. 只适用于单进程
1. `LifecycleDispatcher` 只是一个事件的分发器，具体通过 ReportFragment 来实现，对外提供 `ActivityInitializationListener` 接口让外界监听
2. `ProcessLifecycleOwner` `Lifecycle.Event.ON_CREATE` 事件只会分发一次，而 `Lifecycle.Event.ON_DESTROY` 永远不被分发
3. `ProcessLifecycleOwner` 通过监听 `ON_START` 和 `ON_STOP` 事件可以实现 APP 的前台和后台切换监听
4. 切换到后台有个 700 ms 的延迟，这个延时足够长以确保 `ProcessLifecycleOwner` 不会在 Activity 由于配置变更而销毁重建期间发送任何事件。
5. `ProcessLifecycleOwner` 非常适用于对 app 前后台状态切换时进行响应、且对生命周期不要求毫秒级准确性的场景。

> 延迟 700 发送 ON_STOP 事件，是为了防止那种旋转屏幕导致的 onPause，当你剩下最后一个 Activity，如果出现旋转的话，如果没有 700 ms 的延迟，会立即回调到 ON_STOP 认为在后台了，然后迅速又切换到前台

## ProcessLifecycleOwner 问题

### ProcessLifecycleOwner 未生效

**原因：** `InitializationProvider` 被移除掉了，或者移动到了子进程中去了

```xml
<provider
	android:name="androidx.startup.InitializationProvider"
	android:authorities="${applicationId}.androidx-startup"
	tools:node="remove" />
```

**解决：** `InitializationProvider` 不要覆盖掉

**参考：**

- [android - ProcessLifecycleOwner not working after updating app compat to 1.4.1 - Stack Overflow](https://stackoverflow.com/questions/71493022/processlifecycleowner-not-working-after-updating-app-compat-to-1-4-1)
