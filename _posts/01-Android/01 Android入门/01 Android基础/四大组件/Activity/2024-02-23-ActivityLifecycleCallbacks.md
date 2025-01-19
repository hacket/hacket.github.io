---
date_created: Friday, February 23rd 2024, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:24:47 am
title: ActivityLifecycleCallbacks
author: hacket
categories:
  - Android
category: Android基础
tags: [四大组件, activity]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期一, 九月 2日 2024, 5:29:00 下午
date updated: 星期一, 一月 6日 2025, 9:46:31 晚上
image-auto-upload: true
feed: show
format: list
aliases: [ActivityLifecycleCallbacks]
linter-yaml-title-alias: ActivityLifecycleCallbacks
---

# ActivityLifecycleCallbacks

## ActivityLifecycleCallbacks 基础

### ActivityLifecycleCallbacks 接口介绍

API 14 之后，在 Application 类中，提供了一个应用生命周期回调的注册方法，用来对应用的生命周期进行集中管理，这个接口叫 `registerActivityLifecycleCallbacks`，可以通过它注册自己的 ActivityLifeCycleCallback，每一个 Activity 的生命周期都会回调到这里的对应方法。

### [ActivityLifecycleCallbacks方法](https://developer.android.com/reference/android/app/Application.ActivityLifecycleCallbacks)

Activity 的生命周期图：

![image.png|600](https://cdn.nlark.com/yuque/0/2024/png/694278/1707289071544-6e13f4d4-8169-4cb6-ac99-c719ce118a2f.png#averageHue=%232e2b29&clientId=u26cf5ea0-d17e-4&from=paste&height=483&id=u398e4f24&originHeight=663&originWidth=513&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79379&status=done&style=none&taskId=u7abfa970-2e1a-4b57-af61-140a624e339&title=&width=374)

**API29 之前：**

```java
public interface ActivityLifecycleCallbacks {
    void onActivityCreated(Activity activity, Bundle savedInstanceState);
    void onActivityStarted(Activity activity);
    void onActivityResumed(Activity activity);
    void onActivityPaused(Activity activity);
    void onActivityStopped(Activity activity);
    void onActivitySaveInstanceState(Activity activity, Bundle outState);
    void onActivityDestroyed(Activity activity);
}
```

**API29 及以上：** 引入了 onXXXPreXXX 和 onXXXPostXXX

### 注意

#### onActivityCreated 和 onCreate 调用顺序

**结论：** onCreate 方法里 super 之前的代码先执行，其次执行 onActivityCreated 的代码，最后执行 onCreate 方法里 super 之后的代码。

**源码分析：**

```java
class Activity {
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        // ...
        mFragments.dispatchCreate();
        dispatchActivityCreated(savedInstanceState);
    }
    private void dispatchActivityCreated(@Nullable Bundle savedInstanceState) {
        getApplication().dispatchActivityCreated(this, savedInstanceState);
        Object[] callbacks = collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (int i = 0; i < callbacks.length; i++) {
                ((Application.ActivityLifecycleCallbacks) callbacks[i]).onActivityCreated(this,
                        savedInstanceState);
            }
        }
    }
}
```

在 onCreate 里面，调用了 dispatchActivityCreated 分发 onActivityCreated 回调，所以在你的 Activity 的 onCreate() 方法中 super.onCreate() 之前的代码会先执行，然后执行回调 onActivityCreated，再执行 onCreate() 方法中 super.onCreate() 后的代码。

**注意：**不要在 onActivityCreated() 访问需要在目标 Activity 的 onCreate 中初始化的一些变量，如果初始化操作在 super.onCreate() 后，将导致在 onActivityCreated() 访问到未初始化的变量，可能导致 NPE 等资源用尽的异常。

**解决：** 如何保证在目标 Activity 的 onCreate() 后执行？

1. 在 onActivityCreated 中 post
2. `onActivityPostCreated`，注意 API29 才有的 API

```kotlin
application.registerActivityLifecycleCallbacks(object :
    Application.ActivityLifecycleCallbacks {
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        if (isFirstInstallDialogShow) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                if (mHandler == null) {
                    mHandler = Handler(Looper.getMainLooper())
                }
                mHandler?.post {
                    kotlin.runCatching {
                        exposeActivityPostCreated(activity)
                    }
                }
            } else {
                // 用onActivityPostCreated
            }
        }
    }

    override fun onActivityPostCreated(activity: Activity, savedInstanceState: Bundle?) {
        exposeActivityPostCreated(activity)
    }

    private fun exposeActivityPostCreated(activity: Activity) {
        // ...
    }
})
```

## 原理

### onCreate

#### onActivityCreated 执行顺序在 super.onCreate 调用后执行

```java
class Activity {
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        // ...
        mFragments.dispatchCreate();
        dispatchActivityCreated(savedInstanceState);
    }
    private void dispatchActivityCreated(@Nullable Bundle savedInstanceState) {
        getApplication().dispatchActivityCreated(this, savedInstanceState);
        Object[] callbacks = collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (int i = 0; i < callbacks.length; i++) {
                ((Application.ActivityLifecycleCallbacks) callbacks[i]).onActivityCreated(this,
                        savedInstanceState);
            }
        }
    }
}
```

#### onActivityPreCreated 如何保证在 onCreate 之前？onActivityPreCreated 如何保证在 onCreate 之后？

从 Activity 源码来分析：

```java
final void performCreate(Bundle icicle, PersistableBundle persistentState) {
    dispatchActivityPreCreated(icicle);
    // ...
    if (persistentState != null) {
        onCreate(icicle, persistentState);
    } else {
        onCreate(icicle);
    }
    // ...
    if (persistentState != null) {
        onCreate(icicle, persistentState);
    } else {
        onCreate(icicle);
    }
    // ...
    private void dispatchActivityPreCreated(@Nullable Bundle savedInstanceState) {
        getApplication().dispatchActivityPreCreated(this, savedInstanceState);
        Object[] callbacks = collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (int i = 0; i < callbacks.length; i++) {
                ((Application.ActivityLifecycleCallbacks) callbacks[i]).onActivityPreCreated(this,
                        savedInstanceState);
            }
        }
    }
    // ...
    private void dispatchActivityPostCreated(@Nullable Bundle savedInstanceState) {
        Object[] callbacks = collectActivityLifecycleCallbacks();
        if (callbacks != null) {
            for (int i = 0; i < callbacks.length; i++) {
                ((Application.ActivityLifecycleCallbacks) callbacks[i]).onActivityPostCreated(this,
                        savedInstanceState);
            }
        }
        getApplication().dispatchActivityPostCreated(this, savedInstanceState);
    }
}
```

调用链：<br />ActivityThread.handleLaunchActivity()<br />ActivityThread.performLaunchActivity()<br /> -> mInstrumentation.callActivityOnCreate(Instrumentation)<br />-> activity.performCreate<br />-> activity.dispatchActivityPreCreated()<br />-> actiivty.onCreate<br />-> activity.dispatchActivityPostCreated()

## 封装

### Closure

```kotlin
inline fun Application.registerActivityLifecycleCallbacksClosure(
    crossinline onActivityCreated: (Activity, Bundle?) -> Unit = { _, _ -> },
    crossinline onActivityStarted: (Activity) -> Unit = {},
    crossinline onActivityResumed: (Activity) -> Unit = {},
    crossinline onActivityPaused: (Activity) -> Unit = {},
    crossinline onActivityStopped: (Activity) -> Unit = {},
    crossinline onActivitySaveInstanceState: (Activity, Bundle) -> Unit = { _, _ -> },
    crossinline onActivityDestroyed: (Activity) -> Unit = {}
) {
    registerActivityLifecycleCallbacks(object : Application.ActivityLifecycleCallbacks {
        override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
            onActivityCreated.invoke(activity, savedInstanceState)
        }

        override fun onActivityStarted(activity: Activity) {
            onActivityStarted.invoke(activity)
        }

        override fun onActivityResumed(activity: Activity) {
            onActivityResumed.invoke(activity)
        }

        override fun onActivityPaused(activity: Activity) {
            onActivityPaused.invoke(activity)
        }

        override fun onActivityStopped(activity: Activity) {
            onActivityStopped.invoke(activity)
        }

        override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
            onActivitySaveInstanceState.invoke(activity, outState)
        }

        override fun onActivityDestroyed(activity: Activity) {
            onActivityDestroyed.invoke(activity)
        }
    })
}
```

### DSL 方式

```kotlin
inline fun Application.registerActivityLifecycleCallbacksDSL(
    crossinline init: ActivityLifecycleCallbacksInit.() -> Unit
) {
    val myActivityLifecycleCallbacks = ActivityLifecycleCallbacksInit()
    init(myActivityLifecycleCallbacks)
    registerActivityLifecycleCallbacks(myActivityLifecycleCallbacks)
}

open class ActivityLifecycleCallbacksInit : Application.ActivityLifecycleCallbacks {

    private var onActivityCreated: ((Activity, Bundle?) -> Unit)? = null
    private var onActivityStarted: ((Activity) -> Unit)? = null
    private var onActivityResumed: ((Activity) -> Unit)? = null
    private var onActivityPaused: ((Activity) -> Unit)? = null
    private var onActivityStopped: ((Activity) -> Unit)? = null
    private var onActivitySaveInstanceState: ((Activity, Bundle) -> Unit)? = null
    private var onActivityDestroyed: ((Activity) -> Unit)? = null

    fun onActivityCreated(block: ((Activity, Bundle?) -> Unit)? = null) {
        this.onActivityCreated = block
    }

    fun onActivityStarted(block: ((Activity) -> Unit)? = null) {
        this.onActivityStarted = block
    }

    fun onActivityResumed(block: ((Activity) -> Unit)? = null) {
        this.onActivityResumed = block
    }

    fun onActivityPaused(block: ((Activity) -> Unit)? = null) {
        this.onActivityPaused = block
    }

    fun onActivityStopped(block: ((Activity) -> Unit)? = null) {
        this.onActivityStopped = block
    }

    fun onActivitySaveInstanceState(block: ((Activity, Bundle) -> Unit)? = null) {
        this.onActivitySaveInstanceState = block
    }

    fun onActivityDestroyed(block: ((Activity) -> Unit)? = null) {
        this.onActivityDestroyed = block
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        onActivityCreated?.invoke(activity, savedInstanceState)
    }

    override fun onActivityStarted(activity: Activity) {
        onActivityStarted?.invoke(activity)
    }

    override fun onActivityResumed(activity: Activity) {
        onActivityResumed?.invoke(activity)
    }

    override fun onActivityPaused(activity: Activity) {
        onActivityPaused?.invoke(activity)
    }

    override fun onActivityStopped(activity: Activity) {
        onActivityStopped?.invoke(activity)
    }

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
        onActivitySaveInstanceState?.invoke(activity, outState)
    }

    override fun onActivityDestroyed(activity: Activity) {
        onActivityDestroyed?.invoke(activity)
    }
}
```

## ActivityLifecycleCallbacks 应用

### ActivityLifecycleCallbacks 管理 Activity 堆栈

可以用 `ActivityLifecycleCallbacks` 和 `LinkedList` 来管理所有的 Activity，可以实现完全退出一个应用。需要 android4.0+。<br />在 Application 的 onCreate() 方法中，注册

```java
private void initActLifeCallbacks() {
    mActivityLifecycleCallbacksImpl = new ActivityLifecycleCallbacksImpl();
    registerActivityLifecycleCallbacks(mActivityLifecycleCallbacksImpl);
}

private LinkedList<ActivityInfo> mActivityInfos = new LinkedList<>();

class ActivityInfo {
    public final static int STATE_NONE = 0;
    public final static int STATE_CREATE = 1;
    private Activity mActivity;
    private int mState = STATE_NONE;

    public ActivityInfo() {
    }

    public ActivityInfo(Activity activity, int state) {
        mActivity = activity;
        mState = state;
    }

    public Activity getActivity() {
        return mActivity;
    }

    public int getState() {
        return mState;
    }
}

private ActivityInfo findActivityInfoByActivity(@NonNull Activity activity) {
    if (activity == null) {
        return null;
    }
    for (ActivityInfo activityInfo : mActivityInfos) {
        if (activity.equals(activityInfo.getActivity())) {
            return activityInfo;
        }
    }
    return null;
}

public void exitAllActivity() {
    unregisterActivityLifecycleCallbacks(mActivityLifecycleCallbacksImpl);
    for (ActivityInfo activityInfo : mActivityInfos) {
        try {
            activityInfo.getActivity().finish();
        } catch (Exception e) {
            LogUtils.printStackTrace(e);
        }
    }
    mActivityInfos.clear();
}

private class ActivityLifecycleCallbacksImpl implements Application.ActivityLifecycleCallbacks {
    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        if (activity != null) {
            mActivityInfos.offerFirst(new ActivityInfo(activity, ActivityInfo.STATE_CREATE));
        }
        LogUtils.i(TAG, "onActivityCreated:" + activity.getClass().getSimpleName() + ",size:" + mActivityInfos.size());
    }

    @Override
    public void onActivityStarted(Activity activity) {
        LogUtils.i(TAG, "onActivityStarted:" + activity.getClass().getSimpleName());
    }

    @Override
    public void onActivityResumed(Activity activity) {
        LogUtils.i(TAG, "onActivityResumed:" + activity.getClass().getSimpleName());
    }

    @Override
    public void onActivityPaused(Activity activity) {
        LogUtils.i(TAG, "onActivityPaused:" + activity.getClass().getSimpleName());
    }

    @Override
    public void onActivityStopped(Activity activity) {
        LogUtils.i(TAG, "onActivityStopped:" + activity.getClass().getSimpleName());
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
        LogUtils.i(TAG, "onActivitySaveInstanceState:" + activity.getClass().getSimpleName());
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        if (activity != null) {
            ActivityInfo activityInfo = findActivityInfoByActivity(activity);
            mActivityInfos.remove(activityInfo);
        }
        LogUtils.i(TAG, "onActivityDestroyed:" + activity.getClass().getSimpleName() + ",size:" + mActivityInfos.size());
    }
}
```

<br />参考：<br />Activitylifecyclecallbacks 使用<br />[http://souly.cn/技术博文/2015/11/25/ActivityLifecycleCallbacks使用/](http://souly.cn/%E6%8A%80%E6%9C%AF%E5%8D%9A%E6%96%87/2015/11/25/ActivityLifecycleCallbacks%E4%BD%BF%E7%94%A8/)

### 监听应用是否在前台

#### 代码 1

```java
public class ForegroundCallbacks implements Application.ActivityLifecycleCallbacks {

    private static final String TAG = BaseApplication.TAG;

    private static ForegroundCallbacks instance;
    private List<Listener> mListeners;

    /**
     * 是否在前台
     */
    private boolean isForeground;
    private int mActivityActivePageCount;

    public static ForegroundCallbacks init(@NonNull Application application) {
        if (instance == null) {
            instance = new ForegroundCallbacks();
        }
        application.registerActivityLifecycleCallbacks(instance);
        return instance;
    }

    private ForegroundCallbacks() {

    }

    public static ForegroundCallbacks get() {
        if (instance == null) {
            throw new IllegalStateException(
                    "Foreground is not initialised - invoke " +
                            "at least once with parameterised init/get");
        }
        return instance;
    }

    public void addListener(Listener listener) {
        if (listener == null) {
            return;
        }
        if (mListeners == null) {
            mListeners = new ArrayList<>();
        }
        mListeners.add(listener);
    }

    public void removeListener(Listener listener) {
        if (listener == null) {
            return;
        }
        mListeners.remove(listener);
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

    }

    @Override
    public void onActivityStarted(Activity activity) {
        mActivityActivePageCount++;

        LogUtils.i(TAG, "onActivityStarted，" + activity.getClass().getSimpleName() + "，" + mActivityActivePageCount);

        if (mActivityActivePageCount < 1) {
            LogUtils.i(TAG, "当前没有可见页面：" + mActivityActivePageCount);
            return;
        }

        if (isForeground) {
            LogUtils.i(TAG, "当前处于前台状态：" + mActivityActivePageCount);
            return;
        }

        for (Listener listener : mListeners) {
            listener.onForeground(mActivityActivePageCount);
        }

        isForeground = true;
    }

    @Override
    public void onActivityResumed(Activity activity) {
    }

    @Override
    public void onActivityPaused(Activity activity) {
    }

    @Override
    public void onActivityStopped(Activity activity) {
        mActivityActivePageCount--;

        LogUtils.i(TAG, "onActivityStopped，" + activity.getClass().getSimpleName() + "，" + mActivityActivePageCount);

        if (mActivityActivePageCount <= 0) {
            for (Listener listener : mListeners) {
                listener.onBackground();
            }
            mActivityActivePageCount = 0;
            isForeground = false;
        }
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onActivityDestroyed(Activity activity) {

    }

    public interface Listener {
        void onForeground(int count);

        void onBackground();
    }

}
```

- [ ] 手持 ActivityLifecycleCallbacks，监听前后台状态如此舒服<br /><http://www.jianshu.com/p/e7f64e6bc2cc>
- [ ] <https://github.com/wenmingvs/AndroidProcess>

#### 代码 2

1. 监听 App 处于前台/后台
2. 获取当前显示的 Activity

> 前后台监听时，页面切换有 bug，由于 Activity 的 onPause 和 onResume 有一定的间隔，加上 CHECK_DELAY 就行了

```java
public final class ForegroundCallbacks implements Application.ActivityLifecycleCallbacks {

    private static final String TAG = ForegroundCallbacks.class.getName();
    private static final long CHECK_DELAY = 200;

    private static ForegroundCallbacks instance;
    private Handler handler = new Handler();
    private List<Listener> listeners = new CopyOnWriteArrayList<>();
    private boolean foreground = false, paused = true;
    private Runnable check;

    WeakReference<Activity> mRef;

    public static ForegroundCallbacks init(Application application) {
        if (instance == null) {
            instance = new ForegroundCallbacks();
            application.registerActivityLifecycleCallbacks(instance);
        }
        return instance;
    }

    public static ForegroundCallbacks get(Application application) {
        if (instance == null) {
            init(application);
        }
        return instance;
    }

    public static ForegroundCallbacks get(Context ctx) {
        if (instance == null) {
            Context appCtx = ctx.getApplicationContext();
            if (appCtx instanceof Application) {
                init((Application) appCtx);
            }
            throw new IllegalStateException(
                    "Foreground is not initialised and " +
                            "cannot obtain the Application object");
        }
        return instance;
    }

    public static ForegroundCallbacks get() {
        if (instance == null) {
            throw new IllegalStateException(
                    "Foreground is not initialised - invoke " +
                            "at least once with parameterised init/get");
        }
        return instance;
    }

    public boolean isForeground() {
        return foreground;
    }

    public boolean isBackground() {
        return !foreground;
    }

    public void addListener(Listener listener) {
        listeners.add(listener);
    }

    public void removeListener(Listener listener) {
        listeners.remove(listener);
    }

    public Activity currentActivity() {
        if (mRef != null) {
            return mRef.get();
        }
        return null;
    }

    @Override
    public void onActivityResumed(Activity activity) {
        mRef = new WeakReference<>(activity);
        paused = false;
        boolean wasBackground = !foreground;
        foreground = true;
        if (check != null) {
            handler.removeCallbacks(check);
        }
        if (wasBackground) {
            log("went foreground");
            for (Listener l : listeners) {
                try {
                    l.onAppForeground(activity);
                } catch (Exception exc) {
                    log("Listener threw exception!:" + exc.toString());
                }
            }
        } else {
            log("still foreground");
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        paused = true;
        if (check != null) {
            handler.removeCallbacks(check);
        }
        handler.postDelayed(check = () -> {
            if (foreground && paused) {
                foreground = false;
                log("went background");
                for (Listener l : listeners) {
                    try {
                        l.onAppBackground(activity);
                    } catch (Exception exc) {
                        log("Listener threw exception!:" + exc.toString());
                    }
                }
            } else {
                log("still foreground");
            }
        }, CHECK_DELAY);
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
    }

    @Override
    public void onActivityStarted(Activity activity) {
    }

    @Override
    public void onActivityStopped(Activity activity) {
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
    }

    public interface Listener {
        void onAppForeground(Activity activity);

        void onAppBackground(Activity activity);
    }

    private void log(String msg) {
        LogUtils.d(TAG, msg);
    }
}
```

- [ ] 手持 ActivityLifecycleCallbacks，监听前后台状态如此舒服 <https://www.jianshu.com/p/e7f64e6bc2cc>

### ActivityLifecycleCallbacks 实现 App 压后台过久回来到 Splash 页

- InewsActivityLifecycleCallbacks

```java
public class InewsActivityLifecycleCallbacks extends Observable<ActivityInfo> implements Application.ActivityLifecycleCallbacks, ActivityState {

    private Observer<? super ActivityInfo> observer;

    private LinkedList<Activity> createActivityLinkedList = new LinkedList<>();
    private LinkedList<Activity> resumeActivityLinkedList = new LinkedList<>();

    /**
     * app是否在前台
     */
    private boolean isAppOnForeground;

    public static InewsActivityLifecycleCallbacks newInstance() {
        InewsActivityLifecycleCallbacks lifecycleCallbacks = new InewsActivityLifecycleCallbacks();
        return lifecycleCallbacks;
    }

    /**
     * 移除全部（用于整个应用退出）
     */
    public void removeAll() {
        for (Activity activity : createActivityLinkedList) {
            if (activity != null && !activity.isFinishing()) {
                activity.finish();
            }
        }
        createActivityLinkedList.clear();
    }

    @Override
    public boolean isFront() {
        return resumeActivityLinkedList.size() > 0 && isAppOnForeground;
    }

    @Override
    public Activity current() {
        return createActivityLinkedList.size() > 0 ? createActivityLinkedList.peek() : null;
    }

    @Override
    public int activityCount() {
        return createActivityLinkedList.size();
    }

    @Override
    protected void subscribeActual(Observer<? super ActivityInfo> observer) {
        this.observer = observer;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        createActivityLinkedList.offer(activity);
    }

    @Override
    public void onActivityStarted(Activity activity) {
    }

    @Override
    public void onActivityResumed(Activity activity) {
        if (!resumeActivityLinkedList.contains(activity)) {
            resumeActivityLinkedList.offer(activity);

            if (!resumeActivityLinkedList.isEmpty() && !isAppOnForeground) {
                ActivityInfo activityInfo = new ActivityInfo(activity, true);
                observer.onNext(activityInfo);
                isAppOnForeground = true;
            }
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
    }

    @Override
    public void onActivityStopped(Activity activity) {
        resumeActivityLinkedList.remove(activity);
        if (resumeActivityLinkedList.isEmpty()) {
            isAppOnForeground = false;
            ActivityInfo activityInfo = new ActivityInfo(activity, false);
            observer.onNext(activityInfo);
        }
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        createActivityLinkedList.remove(activity);
    }

}
```

- ActivityState

```java
public interface ActivityState {
    /**
     * 得到当前Activity
     */
    Activity current();
    /**
     * 任务栈中Activity的总数
     */
    int activityCount();
    /**
     * 判断应用是否处于前台，即是否可见
     */
    boolean isFront();
}
```

- ActivityInfo

```java
public class ActivityInfo {

    public static final long DEFAULT_BACK2FONT_INTERVAL_MILLIS = 20 * 1000;

    /**
     * 不需要跳转的Activity配置
     */
    static List<String> mNoSplashClassNames = new ArrayList<>();

    WeakReference<Activity> activityRef;
    String activityClassName;
    boolean isNeedShowSplash;
    boolean isFont;

    static {
        mNoSplashClassNames.add(SplashActivity.class.getSimpleName());
    }

    public ActivityInfo(@NonNull Activity activity) {
        this(activity, false);
    }

    public ActivityInfo(@NonNull Activity activity, boolean isFont) {
        WeakReference<Activity> reference = new WeakReference<>(activity);
        this.activityClassName = activity.getClass().getSimpleName();
        this.activityRef = reference;
        this.isFont = isFont;
        isNeedShowSplash = handleIsNeedSplash(reference);
    }

    private boolean handleIsNeedSplash(@NonNull WeakReference<Activity> reference) {
        Activity activity = reference.get();
        if (activity == null) {
            return false;
        }
        if (mNoSplashClassNames.contains(activity.getClass().getSimpleName())) {
            return false;
        }
        return true;
    }

    public Activity getActivity() {
        if (activityRef != null && activityRef.get() != null) {
            return activityRef.get();
        }
        return null;
    }

    public boolean isFont() {
        return isFont;
    }

    public boolean isNeedShowSplash() {
        return isNeedShowSplash;
    }

    public String getActivityClassName() {
        return activityClassName;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Activity:" + (activityRef.get() != null ? activityRef.get() : "null") + "\n");
        sb.append("isFont：" + isFont + "\n");
        sb.append("isNeedShowSplash：" + isNeedShowSplash + "\n");
        return sb.toString();
    }
}
```
