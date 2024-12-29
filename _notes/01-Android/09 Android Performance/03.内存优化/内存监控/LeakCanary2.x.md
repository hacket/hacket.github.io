---
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
dg-publish: true
---

# LeakCanary

## LeakCanary2.x介绍

LeakCanary2.x自动检测的对象：

- destroyed Activity instances
- destroyed Fragment instances
- destroyed fragment View instances
- cleared ViewModel instances
- destroyed Service instance

LeakCanary2.0+采用了新的hprof分析工具shark替换了原来的haha，主要做了**hprof文件裁剪**和**实时监控**。<br />**hprof文件裁剪**<br />LeakCanary2.x用shark组件来实现裁剪hprof文件功能，通过将所有基本类型数组替换为空数组（大小不变）<br />**实时监控**<br />在 Activity 或者 Fragment 的 destory 生命周期后，可以检测 Activity 和 Fragment 是否被回收，来判断它们是否存在泄露的情况。

## LeakCanary2.x使用

### 如何初始化？

**自动在主进程初始化**

> debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.2'

会自动通过`MainProcessAppWatcherInstaller`进行注册<br />**手动在主进程初始化**

- 配置`<bool name="leak_canary_watcher_auto_install">false</bool>`
- 手动调用`AppWatcher.manualInstall()`注册

**如何判断注册成功？**<br />在Logcat中过滤tag为LeakCanary输出如下log：

> LeakCanary is running and ready to detect memory leaks.

## LeakCanary2.x原理（v2.10）

### AppWatcher

通过`MainProcessAppWatcherInstaller`主动注册或者手动注册，最终都是走到`AppWatcher.manualInstall(application)`，往下走：

```kotlin
fun manualInstall(
    application: Application,
    retainedDelayMillis: Long = TimeUnit.SECONDS.toMillis(5),
    watchersToInstall: List<InstallableWatcher> = appDefaultWatchers(application)
) {
    // ... 一些条件校验
    installCause = RuntimeException("manualInstall() first called here")
    this.retainedDelayMillis = retainedDelayMillis
    // ...
    // Requires AppWatcher.objectWatcher to be set
    LeakCanaryDelegate.loadLeakCanary(application)
    // 遍历install开始监测对象
    watchersToInstall.forEach {
      it.install()
    }
}
```

> 参数2：retainedDelayMillis 默认5秒
> 参数3：watchersToInstall 需要观察的对象，在appDefaultWatchers中有定义；可定义增加或删除观察的对象

看看`appDefaultWatchers()`：

```kotlin
val objectWatcher = ObjectWatcher(
    clock = { SystemClock.uptimeMillis() },
    checkRetainedExecutor = {
      check(isInstalled) {
        "AppWatcher not installed"
      }
      mainHandler.postDelayed(it, retainedDelayMillis)
    },
    isEnabled = { true }
)
fun appDefaultWatchers(
    application: Application,
    reachabilityWatcher: ReachabilityWatcher = objectWatcher
): List<InstallableWatcher> {
    return listOf(
        ActivityWatcher(application, reachabilityWatcher),
        FragmentAndViewModelWatcher(application, reachabilityWatcher),
        RootViewWatcher(reachabilityWatcher),
        ServiceWatcher(reachabilityWatcher)
    )
}
```

默认观察了4种对象：

- Activity对象
- Fragment对象
- View对象
- Service对象

接着看下`LeakCanaryDelegate.loadLeakCanary(application)`：

```kotlin
internal object LeakCanaryDelegate {
    val loadLeakCanary by lazy {
        try {
          val leakCanaryListener = Class.forName("leakcanary.internal.InternalLeakCanary")
          leakCanaryListener.getDeclaredField("INSTANCE")
            .get(null) as (Application) -> Unit
        } catch (ignored: Throwable) {
          NoLeakCanary
        }
    }
  // ...
}
```

反射获取了`InternalLeakCanary`的`INSTANCE`字段，返回一个InternalLeakCanary对象（InternalLeakCanary是一个`(Application)->Unit`的方法对象）

> InternalLeakCanary类定义：internal object InternalLeakCanary : (Application) -> Unit, OnObjectRetainedListener

其实最终调用的是InternalLeakCanary的invoke方法：

```kotlin
override fun invoke(application: Application) {
    _application = application
	// 1
    checkRunningInDebuggableBuild()
	// 2
    AppWatcher.objectWatcher.addOnObjectRetainedListener(this)
	// 3
    val gcTrigger = GcTrigger.Default

    val configProvider = { LeakCanary.config }

    val handlerThread = HandlerThread(LEAK_CANARY_THREAD_NAME)
    handlerThread.start()
    val backgroundHandler = Handler(handlerThread.looper)

    // 4
    heapDumpTrigger = HeapDumpTrigger(
      application, backgroundHandler, AppWatcher.objectWatcher, gcTrigger,
      configProvider
    )
    application.registerVisibilityListener { applicationVisible ->
      this.applicationVisible = applicationVisible
      heapDumpTrigger.onApplicationVisibilityChanged(applicationVisible)
    }
    registerResumedActivityListener(application)
    addDynamicShortcut(application)

    // We post so that the log happens after Application.onCreate()
    mainHandler.post {
      // https://github.com/square/leakcanary/issues/1981
      // We post to a background handler because HeapDumpControl.iCanHasHeap() checks a shared pref
      // which blocks until loaded and that creates a StrictMode violation.
      backgroundHandler.post {
        SharkLog.d {
          when (val iCanHasHeap = HeapDumpControl.iCanHasHeap()) {
            is Yup -> application.getString(R.string.leak_canary_heap_dump_enabled_text)
            is Nope -> application.getString(
              R.string.leak_canary_heap_dump_disabled_text, iCanHasHeap.reason()
            )
          }
        }
      }
    }
}
```

1. **checkRunningInDebuggableBuild()** 校验是否在debuggable的包运行LeakCanary，不在debuggable的包默认是不行；如果需要在非debuggable上运行，需要配置`<bool name="leak_canary_allow_in_non_debuggable_build">false</bool>`为true
2. **addOnObjectRetainedListener()**方法，这里会给单例的`AppWatcher.objectWatcher`对象注册一个 OnObjectRetainedListener监听，当默认的那些AppWatcher对象retain了就会回调到这里来
3. **GcTrigger** 通过调用 Runtime.getRuntime().gc() 方法触发虚拟机进行 GC 操作
4. **HeapDumpTrigger** 管理触发 Heap Dump 的逻辑，有两个地方会触发 dumpHeap()：
   - retain的对象超过阈值（5，应用可见的情况下），可以通过 Config 配置：

> val retainedVisibleThreshold: Int = 5  // LeakCanary.Config

- 当 HeapDumpTrigger 回调 `onDumpHeapReceived()` 方法时，会执行dumpHeap()；比如通知栏收到了Notification点击了

### appDefaultWatchers() 4种默认对象的泄漏检测

接着回到LeakCanary默认定义的几个Watcher，我们以`ActivityWatcher`为例进行讲解。

```kotlin
class ActivityWatcher(
    private val application: Application,
    private val reachabilityWatcher: ReachabilityWatcher // 1
) : InstallableWatcher {
  private val lifecycleCallbacks =
    object : Application.ActivityLifecycleCallbacks by noOpDelegate() {
      override fun onActivityDestroyed(activity: Activity) {
        reachabilityWatcher.expectWeaklyReachable( // 3
          activity, "${activity::class.java.name} received Activity#onDestroy() callback"
        )
      }
    }
  override fun install() { // 2
    application.registerActivityLifecycleCallbacks(lifecycleCallbacks)
  }
  override fun uninstall() { // 2
    application.unregisterActivityLifecycleCallbacks(lifecycleCallbacks)
  }
}
// AppWatcher.kt
val objectWatcher = ObjectWatcher(
    clock = { SystemClock.uptimeMillis() },
    checkRetainedExecutor = {
      check(isInstalled) {
        "AppWatcher not installed"
      }
      mainHandler.postDelayed(it, retainedDelayMillis)
    },
    isEnabled = { true }
  )
```

1. **reachabilityWatcher** 就是单例AppWatcher变量objectWatcher，用于探测retained的对象
2. **install()/uninstall()**，注册收集要监测的Activity对象，通过registerActivityLifecycleCallbacks来收集，在Activity的onActivityDestroyed中开始探测Activity是否泄漏
3. **objectWatcher.expectWeaklyReachable **观测Activity对象是否泄漏
   1. objectWatcher中第二个参数checkRetainedExecutor其实是`(Runnable)->Unit`类型

接着来看看：

```kotlin
class ObjectWatcher {
    // 1
	private val watchedObjects = mutableMapOf<String, KeyedWeakReference>()
    // 2
	private val queue = ReferenceQueue<Any>()

    @Synchronized override fun expectWeaklyReachable(
        watchedObject: Any,
        description: String
    ) {
        if (!isEnabled()) {
        	return
        }
        // 3
        removeWeaklyReachableObjects()
        val key = UUID.randomUUID().toString()
        val watchUptimeMillis = clock.uptimeMillis()
        val reference =
          KeyedWeakReference(watchedObject, key, description, watchUptimeMillis, queue)
        // 4
        watchedObjects[key] = reference
        // 5
        checkRetainedExecutor.execute { moveToRetained(key) }
    }
}
// 3
private fun removeWeaklyReachableObjects() {
    // WeakReferences are enqueued as soon as the object to which they point to becomes weakly
    // reachable. This is before finalization or garbage collection has actually happened.
    var ref: KeyedWeakReference?
    do {
      ref = queue.poll() as KeyedWeakReference?
      if (ref != null) {
        watchedObjects.remove(ref.key)
      }
    } while (ref != null)
  }
// 5
@Synchronized private fun moveToRetained(key: String) {
    removeWeaklyReachableObjects()
    val retainedRef = watchedObjects[key]
    if (retainedRef != null) {
      retainedRef.retainedUptimeMillis = clock.uptimeMillis()
      onObjectRetainedListeners.forEach { it.onObjectRetained() }
    }
  }
```

1. watchedObjects 保存了KeyedWeakReference的HashMap，key为随机生成的数；正常回收的对象会被移除，留下来的可能是泄漏的
2. **queue** WeakReference的ReferenceQueue在对象被回收后，会将指向对象的WeakReference放到queue中去。
3. **removeWeaklyReachableObjects() 【将正常回收的对象从watchObjects移除】 **遍历queue，如果找到了ref不为null的（不为null说明对象被回收了），那么从watchObjects中移除掉，因为观测的这个对象已经被回收了，watchObjects中留下来的可能是泄漏的对象retained了
4. 将要观察的对象包装成一个KeyedWeakReference，保存到watchedObjects中去
5. 执行checkRetainedExecutor.execute【延迟5秒看对象回收情况】，checkRetainedExecutor定义是在APPWatcher的objectWatcher，延迟五秒会调用moveToRetained()，也就是说**在Activity回调onDestroy5秒后执行**；在moveToRetained中，首先调用removeWeaklyReachableObjects()将已经回收的对象移除掉，watchedObjects中留下来的对象可能是内存泄漏的对象，回调OnObjectRetainedListener，最终回调到InternalLeakCanary的`onObjectRetained()`方法

> 其他的`AndroidXFragmentDestroyWatcher`和`ViewModelClearedWatcher`都是类似的逻辑

### **HeapDumpTrigger** 触发dump heap的逻辑

接着前面，在5秒后如果还存在于watchedObjects中，就会回调到InternalLeakCanary的`onObjectRetained()`方法，最终会调用到HeapDumpTrigger的scheduleRetainedObjectCheck()方法

```kotlin
class InternalLeakCanary {
    fun scheduleRetainedObjectCheck(delayMillis: Long = 0L) { // 这里的delayMillis为0L
        val checkCurrentlyScheduledAt = checkScheduledAt
        if (checkCurrentlyScheduledAt > 0) {
        	return
        }
        checkScheduledAt = SystemClock.uptimeMillis() + delayMillis
        backgroundHandler.postDelayed({ // 是在子线程中dump
        	checkScheduledAt = 0
        	checkRetainedObjects()
        }, delayMillis)
	}
}
```

接着看checkRetainedObjects()：

```kotlin
private fun checkRetainedObjects() {
    // ...
    // 1. 已经被回收过后的retained对象的总和
    var retainedReferenceCount = objectWatcher.retainedObjectCount

    if (retainedReferenceCount > 0) {
        // 2
        gcTrigger.runGc()
        retainedReferenceCount = objectWatcher.retainedObjectCount
    }
    // 3
    if (checkRetainedCount(retainedReferenceCount, config.retainedVisibleThreshold)) return

    val now = SystemClock.uptimeMillis()
    val elapsedSinceLastDumpMillis = now - lastHeapDumpUptimeMillis
    // 4
    if (elapsedSinceLastDumpMillis < WAIT_BETWEEN_HEAP_DUMPS_MILLIS) {
      onRetainInstanceListener.onEvent(DumpHappenedRecently)
      showRetainedCountNotification(
        objectCount = retainedReferenceCount,
        contentText = application.getString(R.string.leak_canary_notification_retained_dump_wait)
      )
      scheduleRetainedObjectCheck(
        delayMillis = WAIT_BETWEEN_HEAP_DUMPS_MILLIS - elapsedSinceLastDumpMillis
      )
      return
    }

    dismissRetainedCountNotification()
    val visibility = if (applicationVisible) "visible" else "not visible"
    // 5
    dumpHeap(
      retainedReferenceCount = retainedReferenceCount,
      retry = true,
      reason = "$retainedReferenceCount retained objects, app is $visibility"
    )
}
```

1. **retainedReferenceCount **已经被回收过后的retained对象的总和，会调用removeWeaklyReachableObjects先判断下
2. 如果存在一个retained对象，手动触发一下GC；再重新计算下**retainedReferenceCount**
3. 如果retained的对象小于5个（默认），不走下面逻辑了
4. 如果retained的对象大于等于5个；距离上次dump时间小于60秒，只展示通知，delay dump heap
5. retained大于等于5个且距离时间大于等于60秒，就直接dump heap

### LeakCanary如何分析hprof文件？

分析hprof文件的工作主要是在HeapAnalyzerService类中完成的；用Sharp分析hprof来分析

### 原理小结

默认可以监听Activity、Fragment、View和ViewModel的泄漏，以Activity为例：

1. 监听Activity生命周期
2. 在Activity onDestroy的时候，创建一个弱引用KeyedWeakReference到Activity对象并关联一个引用队列queue，key是一个随机数（和当前Activity绑定），将key和KeyedWeakReference保存到watchedObjects里面
3. 然后在延迟默认5秒后，开始检测是否内存泄漏，具体检测步骤：
   - 1、判断queue中是否有该Activity的KeyedWeakReference对象，有则说明Activity被回收了，移除watchedObjects里面对应的key
   - 2、判断watchedObjects里面是否有当前要检测的Activity的key，如果没有，说明Activity对象已经被回收了，没有内存泄漏；如果有，只能说明Activity对象还没有被回收，可能此时已经没有被引用，不一定是内存泄漏
   - 手动触发一次GC
4. dump heap分析hprof文件，构建可能泄漏的对象与GC Root的引用链，如果存在则泄漏了
5. 存储结果并使用Notification提醒用户存在泄漏

> 弱引用和引用队列搭配使用，如果弱引用持有的对象被回收，Java 虚拟机就会把这个弱引用加入到与之关联的引用队列中。也就是说如果KeyedWeakReference 持有的 Activity 对象被回收，该KeyedWeakReference就会加入到引用队列 queue 中。 LeakCanary 就是利用这个原理。

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1683300540418-47a96fe1-be52-4476-bcb2-0173677b2a34.webp#averageHue=%23f4efe7&clientId=u356458d5-e5b3-4&from=paste&height=545&id=uf690e308&originHeight=675&originWidth=862&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7914d220-a513-4fab-9689-c1081b82060&title=&width=696)

## LeakCanary疑问？

### 为什么LeakCancary不能用于线上?

1. 泄漏后生成`.hprof`文件增加手机负担，引起手机卡顿等问题。.hprof文件较大，信息回捞成问题。
2. 多次调用GC，可能会对线上性能产生影响
3. 同样的泄漏问题，会重复生成 .hprof 文件，重复分析并写入磁盘

### LeakCanary为什么卡顿？解决？

自定义 Heap Dump 执行器，默认的是`AndroidDebugHeapDumper`

```kotlin
LeakCanary.config = LeakCanary.config.copy(
    // 自定义 Heap Dump 执行器
    heapDumper = {
        // KOOM
        ForkJvmHeapDumper.getInstance().dump(it.absolutePath)
    }
)
```
