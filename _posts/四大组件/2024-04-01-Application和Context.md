---
date_created: Monday, April 1st 2024, 1:27:34 am
date_updated: Sunday, January 19th 2025, 2:13:47 pm
title: Application和Context
author: hacket
categories:
  - Android
category: 
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
tags: []
image-auto-upload: true
feed: show
format: list
aliases: [Application 的方法详解]
linter-yaml-title-alias: Application 的方法详解
---

# Application 的方法详解

## Application

### Application 介绍

Application 是 Android 中的一个系统组件。Android App 运行时，会自动创建 Application 并实例化 Application 对象，且只有一个，Application 是单例模式。

### Application 中的方法

##### 1、onCreate()

Application 实例创建时调用，默认空实现。

- 特点

1. 可以用来初始化应用级别的资源（如全局对象、环境配置变量、图片资源初始化、推送服务注册等）

> 不要在这里执行耗时操作，否则会拖慢应用程序的启动速度。

2. 数据共享、数据缓存<br>设置全局共享数据，如全局共享变量、方法等

> 这些共享数据只在应用程序的生命周期内有效，当该应用程序被杀死，这些数据也会被清空，所以只能存储一些具备临时性的共享数据

##### 2、registerComponentCallbacks(ComponentCallbacks callback) & unregisterComponentCallbacks(ComponentCallbacks callback)

注册和注销 ComponentCallbacks(ComponentCallbacks2 是其子接口)

> 复写 ComponentCallbacks2 回调接口里的方法可以实现更多的操作

##### 3、void onTrimMemory(int level)

通过应用程序当前内存使用情况（以内存级别进行识别），在 Android4.0+ 才能使用

| 内存使用情况（级别越高越严重）                  | 含义                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| TRIM_MEMORY_RUNNING_MODERATE(5)  | 应用处于前台运行； 应用正常运行，不会被杀掉，但当前内存有点低，系统开始杀死其他后台进程应用                                           |
| TRIM_MEMORY_RUNNING_LOW(10)      | 应用处于前台运行；应用正常运行，不会被杀死，但当前内存已经非常低了，释放掉自身不必要的内存，否则会影响应用的性能（如响应速度）                          |
| TRIM_MEMORY_RUNNING_CRITICAL(15) | 应用处于前台运行；应用正常运行，但大部分其他后台程序已被杀死，释放自身不必要的内存，否则自身也会被系统杀死                                    |
| TRIM_MEMORY_UI_HIDDEN(20)        | 应用处于前台运行；系统内存已经非常低了，并将该应用从前台切换到后台，即回收 UI 资源                                                |
| TRIM_MEMORY_BACKGROUND(40)       | 应用处于后台缓存；系统内存较低了，该应用处于 LRU 缓存列表的最近位置，但不会被清理掉，此时释放掉一些较容易恢复的资源让手机的内存变得充足，从而让我们的应用更长时间的保留在缓存中 |
| TRIM_MEMORY_MODERATE(60)         | 应用处于后台缓存；系统内存已经非常低了，该应用处于 LRU 缓存列表的中间位置，若手机内存得不到释放，应用有被杀死的风险                               |
| TRIM_MEMORY_COMPLETE(80)         | 应用处于后台缓存；内存严重不足，该应用已处于 LRU 缓存列表的最边缘位置，应用随时都有可能被回收的风险，此时应该把一切可以释放的资源都释放从而避免被杀死              |

根据当前内存使用情况进行自身的内存资源的不同程序释放，以避免被系统直接杀掉，优化应用的性能体验

> 1. 系统在不足时会按照 LRU Cache 中从低到高杀死进程；优先杀死占用内存较高的应用

2. 若应用内存占用较少，被杀死几率降低，从而快速启动
3. 可回收的资源包括：缓存（文件缓存、图片缓存），动态生成和添加的 View

- onTrimMemory() 中的 TRIM_MEMORY_UI_HIDDEN 和 onStop() 关系

> 1. onTrimMemory() 中的 TRIM_MEMORY_UI_HIDDEN 的回调时刻：当应用的所有 UI 组件全部不可见时

2. Activity 的 onStop() 回调时刻：当一个 Activity 完全不可见的时候
3. 在 onStop() 中释放与 Activity 相关的资源（如取消网络连接、注销广播接收者）；在 onTrimMemory() 中的 TRIM_MEMORY_UI_HIDDEN 中释放与 UI 相关的资源，从而保证用户在使用应用过程中，UI 相关的资源不需要重新加载，从而提升响应速度。（onTrimMemory() 的 ui_hidden 是在 onStop() 方法之前调用的）

##### 4、onLowMemory()

监听 Android 系统整体内存较低的时刻，在 Android4.0 前检测内存使用情况，从而避免被系统杀掉。

onTrimMemory() 和 onLowMemory()

> 1. onTrimMemory() 是 onLowMemory() 在 Android4.0 后的替代 api

2. onLowMemory() 等同于 onTrimMemory() 中的 TRIM_MEMORY_UI_HIDDEN 级别
3. 若想兼容 Android4.0 之前，用 onLowMemory()；否则用 onTrimMemory()

##### 5、onConfigurationChanged(Configuration newConfig)

监听应用配置信息的改变（如屏幕旋转），在应用配置信息改变时调用。<br>配置信息是指：AndroidManifest.xml 文件下的 Activity 标签属性 `android:configChanges` 的值

```xml
<activity
    android:configChanges="keyboardHidden|orientation|screenSize"
    android:name="me.hacket.demo.ItemActivity">
</activity>
<!-- 该配置表明Activity在配置改变时不重启，只执行onConfigurationChanged()方法，换种说法就是Activity在屏幕旋转时不重启 -->
```

所有的值如下：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010100993.png)![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010100994.png)

##### 6、registerActivityLifecycleCallbacks() & unregisterActivityLifecycleCallbacks()

注册 / 注销对 应用程序内 所有 Activity 的生命周期监听；当应用程序内 Activity 生命周期发生变化时就会调用

> 实际上是调用 registerActivityLifecycleCallbacks（）里 ActivityLifecycleCallbacks 接口里的方法

##### 7、onTerminate()

应用程序结束时调用

> 但该方法只用于 Android 仿真机测试，在 Android 产品机是不会调用的

### Application 总结

Application 类的应用场景有：

1. 初始化 应用程序级别 的资源，如全局对象、环境配置变量等<br>在 onCreate() 里面
2. 数据共享、数据缓存，如设置全局共享变量、方法等<br>在 onCreate() 里面
3. 获取应用程序当前的内存使用情况，及时释放资源，从而避免被系统杀死<br>在 onLowMemory() 或 onTrimMemory(int level) 里
4. 监听 应用程序 配置信息的改变，如屏幕旋转等<br>在 onConfigurationChanged() 里
5. 监听应用程序内 所有 Activity 的生命周期<br>registerActivityLifecycleCallbacks() 和 unregisterActivityLifecycleCallbacks()

# Context

## Context 继承关系

![image.png|500](undefined)

- TintContextWrapper 是 ContextWrapper 的直接子类

## View 获取 Context

### View 获取 Activity（非 DecorView）

1. 获取 FragmentActivity

```kotlin
fun View.getFragmentActivity(): FragmentActivity? {
    var context: Context? = context
    while (context is ContextWrapper) { // AppCompat的View
        if (context is FragmentActivity) {
            return context
        } else if (context is Activity) {
            LogUtils.w(
                "getActivity",
                "this Activity need be a FragmentActivity ${context.javaClass.simpleName}"
            )
        }
        context = context.baseContext
    }

    /**
     * addView(View(context.applicationContext))
     * 上述情况添加的 View 的 Context 并不是一个 Activity 或者 Activity 的 wrapper，在这种情况下
     * 通过父布局去寻找对应的 Activity
     */
    return (parent as? View)?.getFragmentActivity()
}
```

2. 获取 Activity

```kotlin
fun View.getActivityFromView(): Activity? {
    var context: Context? = context
    while (context is ContextWrapper) { // AppCompat的View
        if (context is Activity) {
            return context
        }
        context = context.baseContext
    }
    /**
     * addView(View(context.applicationContext))
     * 上述情况添加的 View 的 Context 并不是一个 Activity 或者 Activity 的 wrapper，在这种情况下
     * 通过父布局去寻找对应的 Activity
     */
    return (parent as? View)?.getActivityFromView()
}
```

### DecorView 获取 Activity

> In Android 7 (Nougat) Android introduced the multi-window feature, enabling you to open 2 activities at once on the screen (whether it's your activities or 2 different ones). To do that they introduced a new class called DecorContext to be used by the DecorView. The DecorContext is (quote) "Context for decor views which can be seeded with pure application context and not depend on the activity, but still provide some of the facilities that Activity has, e.g. themes, activity-based resources, etc.". This means that the DecorView no longer knows to which Activity it's related to, only to which Application. Hence going forward from Nougat, one cannot get the Activity from the DecorView alone.

DecorView 通过下面方式获取 Activity：

```kotlin
Activity a = (Activity) decorView.findViewById(android.R.id.content).getContext();
```

- [x] How to get activity of a DecorVIew? .getContext() on DecorView getting a DecorContext<br><https://stackoverflow.com/questions/39257362/how-to-get-activity-of-a-decorview-getcontext-on-decorview-getting-a-decorco>

### View.getContext() 遇到的大坑

#### View.getContext() 一定会返回 Activity 对象么？

不一定，可能返回 TintContextWrapper，也可能返回 ContextThemeWrapper

#### ContextThemeWrapper

#### `TintContextWrapper`

Android4.x `view.getContext()` 不是 Activity 是 `TintContextWrapper`，而 Android5.x 后没问题。<br>如果用的是 AppCompatActivity，所有 AppCompat 的 Activity，创建 View 的时候，都会对基本 View 做一个风格的包装，也就是说 ImageView 会变成 AppCompatImageView。

```java
public AppCompatImageView(Context context, AttributeSet attrs, int defStyleAttr) {
    super(TintContextWrapper.wrap(context), attrs, defStyleAttr);

    mBackgroundTintHelper = new AppCompatBackgroundHelper(this);
    mBackgroundTintHelper.loadFromAttributes(attrs, defStyleAttr);

    mImageHelper = new AppCompatImageHelper(this);
    mImageHelper.loadFromAttributes(attrs, defStyleAttr);
}
```

而 AppCompatImageView 的构造将 context 包装了；

```java
// TintContextWrapper.java
private static final Object CACHE_LOCK = new Object();
private static ArrayList<WeakReference<TintContextWrapper>> sCache;

public static Context wrap(@NonNull final Context context) {
    if (shouldWrap(context)) {
        synchronized (CACHE_LOCK) {
            if (sCache == null) {
                sCache = new ArrayList<>();
            } else {
                // This is a convenient place to prune any dead reference entries
                for (int i = sCache.size() - 1; i >= 0; i--) {
                    final WeakReference<TintContextWrapper> ref = sCache.get(i);
                    if (ref == null || ref.get() == null) {
                        sCache.remove(i);
                    }
                }
                // Now check our instance cache
                for (int i = sCache.size() - 1; i >= 0; i--) {
                    final WeakReference<TintContextWrapper> ref = sCache.get(i);
                    final TintContextWrapper wrapper = ref != null ? ref.get() : null;
                    if (wrapper != null && wrapper.getBaseContext() == context) {
                        return wrapper;
                    }
                }
            }
            // If we reach here then the cache didn't have a hit, so create a new instance
            // and add it to the cache
            final TintContextWrapper wrapper = new TintContextWrapper(context);
            sCache.add(new WeakReference<>(wrapper));
            return wrapper;
        }
    }
    return context;
}

private static boolean shouldWrap(@NonNull final Context context) {
    if (context instanceof TintContextWrapper
            || context.getResources() instanceof TintResources
            || context.getResources() instanceof VectorEnabledTintResources) {
        // If the Context already has a TintResources[Experimental] impl, no need to wrap again
        // If the Context is already a TintContextWrapper, no need to wrap again
        return false;
    }
    return Build.VERSION.SDK_INT < 21 || VectorEnabledTintResources.shouldBeUsed();
}
```

v7 包为了能加载到一些特殊资源，给包裹成了 `TintContextWrapper`。<br>在 `AppCompatActivity` 里面的 `layout.xml` 文件里面使用原生控件，比如 TextView、ImageView 等等，当在 LayoutInflater 中把 XML 解析成 View 的时候，最终会经过 `AppCompatViewInflater` 的 createView() 方法，这个方法会把这些原生的控件都变成 `AppCompatXXX` 一类，主要包括：

- RatingBar
- CheckedTextView
- MultiAutoCompleteTextView
- TextView
- ImageButton
- SeekBar
- Spinner
- RadioButton
- ImageView
- AutoCompleteTextView
- CheckBox
- EditText
- Button

**小结：**

- 直接继承 Activity 的 Activity 构造出来的 View.getContext() 返回的是当前 Activity。但是：当 View 的 Activity 是继承自 `AppCompatActivity`，并且在 5.0 以下版本的手机上，View.getContext() 得到的并非是 Activity，而是 TintContextWrapper。
- View.getContext() 和 inflate 这个 View 的 LayoutInflater 息息相关，比如 Activity 的 setContentView() 里面的 LayoutInflater 就是它本身
- Dialog 的构造函数用 ContextThemeWrapper 包裹了 Context

## Dialog & Window 的 getContext() 的返回值

- Dialog#getContext() 返回 ContextThemeWrapper；
- 在 Activity 中，Window#getContext() 返回 Activity；在 Dialog 中，Window#getContext() 返回 ContextThemeWrapper；

## Fragment#getContext() 的返回值

- Fragment#getContext() 返回 Activity；

## Ref

- [ ] [记一次View.getContext()遇到的大坑](https://www.open-open.com/lib/view/open1496707886115.html)
- [ ] [View & Fragment & Window 的 getContext() 一定返回 Activity 吗？_fragment getcontext()-CSDN博客](https://blog.csdn.net/jdsjlzx/article/details/110389126)
