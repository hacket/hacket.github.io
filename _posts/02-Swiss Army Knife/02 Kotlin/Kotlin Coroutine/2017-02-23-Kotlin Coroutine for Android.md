---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Thursday, January 23rd 2025, 12:14:29 am
title: Kotlin Coroutine for Android
author: hacket
categories:
  - Java&Kotlin
category: Kotlin协程
tags: [Kotlin协程]
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
date created: 2024-05-21 12:59
date updated: 2024-12-27 23:45
aliases: [Android 中协程]
linter-yaml-title-alias: Android 中协程
---

# Android 中协程

## MainScope

1. 作用域内协程都调度在主线程，除非明确声明了调度器
2. 异常传播是自上而下的，出现异常，不会整个 scope 都异常了，其他的协程体可以继续执行

```kotlin
public fun MainScope(): CoroutineScope = ContextScope(SupervisorJob() + Dispatchers.Main)
```

`MainScope` 有 `SupervisorJob` 和 `Dispatchers.Main` 两个协程上下文。如果你想要增加额外的，可以用 `+` 操作符来增加：

```kotlin
val scope = MainScope() + CoroutineName("MyActivity")
```

就是 `SupervisorJob` 整合了 `Dispatchers.Main` 而已，它的异常传播是自上而下的，这一点与 `supervisorScope` 的行为一致，此外，作用域内的调度是基于 Android 主线程的调度器的，因此作用域内除非明确声明调度器，协程体都调度在**主线程执行**。

案例：

```kotlin
class MainScopeDemo : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_scope)

        val mainScope = MainScope()
        btn_click.setOnClickListener {
            mainScope.launch {
                "1".print()
                tv_result.text = async(Dispatchers.IO) {
                    "2".print()
                    kotlinx.coroutines.delay(2000)
                    "3".print()
                    "hellow mainscope"
                }.await()
                "4".print()
            }
        }
    }
}
```

结果：

```
2019-09-23 23:55:44.481 I: [1] main 2019-09-23 23:55:44 
2019-09-23 23:55:44.489 I: [2] DefaultDispatcher-worker-2 2019-09-23 23:55:44 
2019-09-23 23:55:46.508 I: [3] DefaultDispatcher-worker-2 2019-09-23 23:55:46 
2019-09-23 23:55:46.525 I: [4] main 2019-09-23 23:55:46
```

如果我们在触发前面的操作之后立即在其他位置触发作用域的取消，那么该作用域内的协程将不再继续执行：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main_scope)

    val mainScope = MainScope()
    btn_click.setOnClickListener {
        mainScope.launch {
            "1".print()
            tv_result.text = async(Dispatchers.IO) {
                "2".print()
                kotlinx.coroutines.delay(2000)
                "3".print()
                kotlinx.coroutines.delay(3000)
                "hellow mainscope"
            }.await()
            "4".print()
        }
        mainScope.launch(Dispatchers.IO) {
            "其他的协程运行".print()
            kotlinx.coroutines.delay(4000)
            "其他协程运行完毕".print()
        }
    }
    btn_click_cancel.setOnClickListener {
        mainScope.cancel("取消了协程。故意的，哈哈")
    }
}
```

结果：

```
2019-09-24 00:06:59.500 I: [其他的协程运行] DefaultDispatcher-worker-4 2019-09-24 00:06:59 
2019-09-24 00:06:59.504 I: [1] main 2019-09-24 00:06:59 
2019-09-24 00:06:59.512 I: [2] DefaultDispatcher-worker-9 2019-09-24 00:06:59
```

## 带有作用域的抽象 Activity

```kotlin
open class ScopedActivity : AppCompatActivity(), CoroutineScope by MainScope() {
    override fun onDestroy() {
        // 这样在 Activity 退出的时候，对应的作用域就会被取消，所有在该 Activity 中发起的请求都会被取消掉
        cancel()
        super.onDestroy()
    }
}
```

使用

```kotlin
class MainScopeDemo : ScopedActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_scope)
        btn_click_test.setOnClickListener {
            try {
                launch {
                    // 直接调用 ScopedActivity 也就是 MainScope 的方法
                    anotherOps()

                    "1".print()
                    tv_result.text = async(Dispatchers.IO) {
                        "2".print()
                        kotlinx.coroutines.delay(2000)
                        "3".print()
                        kotlinx.coroutines.delay(3000)
                        "hello 哈哈结束了"
                    }.await()
                    "over".print()
                }
            } catch (e: Exception) {
                "异常了".print()
                e.printStackTrace()
                LogUtil.e(e.message)
            }
        }
    }

    suspend fun anotherOps() = coroutineScope {
        // 继承自父scope也就是MainScope
        "其他suspend方法定义".print()
    }
}
```

结果：

```
2019-09-24 00:32:11.573 I: [其他suspend方法定义] main 2019-09-24 00:32:11 
2019-09-24 00:32:11.574 I: [1] main 2019-09-24 00:32:11 
2019-09-24 00:32:11.585 I: [2] DefaultDispatcher-worker-1 2019-09-24 00:32:11 
2019-09-24 00:32:13.603 I: [3] DefaultDispatcher-worker-1 2019-09-24 00:32:13 
2019-09-24 00:32:16.640 I: [over] main 2019-09-24 00:32:16
```

### coroutineScope

会继承父 scope 的上下文，具体解释可以看官方文档有例子说明

### 提供给外部 Presenter

将这个 Scope 实例传递给其他需要的模块，例如 Presenter 通常也需要与 Activity 保持同样的生命周期，因此必要时也可以将该作用域传递过去。

多数情况下，Presenter 的方法也会被 Activity 直接调用，因此也可以将 Presenter 的方法生命成 `suspend` 方法，然后用 `coroutineScope` 嵌套作用域，这样 MainScope 被取消后，嵌套的子作用域一样也会被取消，进而达到取消全部子协程的目的：

```kotlin
class MyPresenter(private val scope: CoroutineScope) : CoroutineScope by scope {
    fun getUserData() {
        launch {

        }
    }
    suspend fun getData() = coroutineScope {
        launch {

        }
    }
}
```

## launchWhenX（LifecycleCoroutineScope）

### launch

launch(block: suspend CoroutineScope.() -> Unit) Job<br>立即执行 block，在 onDestroy 取消 Job

### ~~launchWhenCreated~~

`launchWhenCreated(block: suspend CoroutineScope.() -> Unit) Job`

运行 block 至少是 `Lifecycle.State.CREATED` 状态，在 onDestroy 取消 Job；未来版本会删除，用 `repeatOnLifecycle` 替代

```kotlin
btn_launch_when_created_request_fake.setOnClickListener {
    lifecycleScope.launchWhenCreated {
        Log.i("hacket", "start launchWhenCreated") // 1
        withContext(Dispatchers.IO) {
            Log.i("hacket", "launchWhenCreated delay 7000.")
            delay(7000)
            Log.i("hacket", "launchWhenCreated delay 7000. end")
        }
        Log.d("hacket", "launchWhenCreated delay5000L")
        delay(5000L)
        Log.d("hacket", "launchWhenCreated delay2000L")
        delay(2000L)
        Log.i("hacket", "end launchWhenCreated")
    }
}
```

我在这 1 步按了 home 键，过个 1 秒，再切回来，后续 log 怎么输出？

```
I/hacket: start launchWhenCreated
I/hacket: launchWhenCreated delay 7000.
D/hacket.lifecycle: ActivityLifecycleScope：onPause()
I/hacket: launchWhenCreated delay 7000. end
D/hacket: launchWhenCreated delay5000L
D/hacket: launchWhenCreated delay2000L
I/hacket: end launchWhenCreated
```

> 按下 Home 键后，还是会在后台执行，log 会输出

### ~~launchWhenStarted~~

`launchWhenStarted(block: suspend CoroutineScope.() -> Unit) Job`

运行 block 至少是 `Lifecycle.State.STARTED` 状态，在 onDestroy 取消 Job；在 onStop 中恢复，恢复从挂起点恢复；未来版本会删除，用 `repeatOnLifecycle` 替代

```kotlin
// 方式1
lifecycleScope.launchWhenStarted {
    repeat(100000) {
        delay(100)
        tvText.text = "$it"
    }
}
// 方式2
lifecycleScope.launch {
    whenStarted { 
        repeat(100000) {
            delay(100)
            tvText.text = "$it"
        }
    }
}
```

> 不管是直接调用 `launchWhenStarted` 还是在 launch 中调用 `whenStarted` 都能达到同样的效果。

恢复案例：

```kotlin
btn_launch_when_started_request_fake.setOnClickListener {
    lifecycleScope.launchWhenStarted {
        Log.i("hacket", "start launchWhenStarted") // 1
        withContext(Dispatchers.IO) { // 这个执行后，按下home键，但没执行完毕，还是在执行；即使按下home键，过了7秒log也会输出
            Log.i("hacket", "launchWhenStarted delay 7000.")
            delay(7000)
            Log.i("hacket", "launchWhenStarted delay 7000. end")
        }
        Log.d("hacket", "launchWhenStarted delay5000L")
        delay(5000L) // 2
        Log.d("hacket", "launchWhenStarted delay2000L")
        delay(2000L)
        Log.i("hacket", "end launchWhenStarted")
    }
}
```

我在这 1 步按了 home 键，过个 1 秒，再切回来，后续 log 怎么输出？

```
// 按下按钮
I/hacket: start launchWhenStarted
I/hacket: launchWhenStarted delay 7000.
// 切换到后台
D/hacket.lifecycle: ActivityLifecycleScope：onPause()
// 过1秒再切回来，过了7秒输出
I/hacket: launchWhenStarted delay 7000. end
D/hacket: launchWhenStarted delay5000L
D/hacket: launchWhenStarted delay2000L
I/hacket: end launchWhenStarted
```

过了 10 秒再切回来，log 怎么输出？

```
// 按下按钮
I/hacket: start launchWhenStarted
I/hacket: launchWhenStarted delay 7000.
// 切换到后台
D/hacket.lifecycle: ActivityLifecycleScope：onPause()
I/hacket: launchWhenStarted delay 7000. end
// 过了10秒再切回来
D/hacket: launchWhenStarted delay5000L
D/hacket.lifecycle: ActivityLifecycleScope：onResume()，identityHashCode=81006667
D/hacket.lifecycle: ActivityLifecycleScope：onWindowFocusChanged(): true，identityHashCode=81006667
```

### ~~launchWhenResumed~~

`launchWhenResumed(block: suspend CoroutineScope.() -> Unit) Job`

运行 block 至少是 `Lifecycle.State.RESUMED` 状态，在 onDestroy 取消 Job；在 onPause 中恢复，恢复从挂起点恢复；未来版本会删除，用 `repeatOnLifecycle` 替代

### 案例

```kotlin
fun onCreate() {
    LogUtils.e("hacket", "start onCreate, currentState=${lifecycle.currentState}")
    lifecycleScope.launch {
        LogUtils.e("hacket", "launch, currentState=${lifecycle.currentState}")
    }

    lifecycleScope.launchWhenCreated {
        LogUtils.d("hacket", "launchWhenCreated, currentState=${lifecycle.currentState}")
    }

    lifecycleScope.launchWhenStarted {
        LogUtils.d("hacket", "launchWhenStarted, currentState=${lifecycle.currentState}")
    }

    lifecycleScope.launchWhenResumed {
        LogUtils.d("hacket", "launchWhenResumed, currentState=${lifecycle.currentState}")
    }
    LogUtils.e("hacket", "end onCreate, currentState=${lifecycle.currentState}")
}
```

输出：

```
E: start onCreate, currentState=INITIALIZED
E: launch, currentState=INITIALIZED
E: end onCreate, currentState=INITIALIZED
D: launchWhenCreated, currentState=CREATED
I: ActivityLifecycleScope：onStart()，identityHashCode=121418303
D: launchWhenStarted, currentState=STARTED
D: ActivityLifecycleScope：onResume()，identityHashCode=121418303
D: launchWhenResumed, currentState=RESUMED
D: ActivityLifecycleScope：onWindowFocusChanged(): true，identityHashCode=121418303
```

可以看到，当前处于 Activity 的 `INITIALIZED` 状态，launch 是立马执行，而其他 3 个都是在到达对应的状态后才执行。

## repeatOnLifecycle

### repeatOnLifecycle

`lifecycle-runtime-ktx` 自 `2.4.0-alpha01` 起，提供了一个新的协程构造器 `lifecyle.repeatOnLifecycle`， 它在离开 X 状态时销毁协程，再进入 X 状态时再启动协程。从其命名上也可以直观地认识这一点，即**围绕某生命周期的进出反复启动新协程**。

- 定义

```kotlin
public suspend fun Lifecycle.repeatOnLifecycle(
    state: Lifecycle.State,
    block: suspend CoroutineScope.() -> Unit
)
```

> 当当前的 `Lifecycle.State` 至少达到 state，在新的协程中中执行 block；repeatOnLifecycle 一直 suspend 直到 `Lifecycle.State.DESTROYED`

```kotlin
class MyActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        /* ... */
        // Runs the block of code in a coroutine when the lifecycle is at least STARTED.
        // The coroutine will be cancelled when the ON_STOP event happens and will
        // restart executing if the lifecycle receives the ON_START event again.
        lifecycleScope.launch {
            lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
                uiStateFlow.collect { uiState ->
                    updateUi(uiState)
                }
            }
        }
    }
}
```

> 当 lifecycle 达到 STARTED 时执行 block；在 ON_STOP 时取消该协程；然后在 ON_START 时重新执行该 block

- 有什么用：repeatOnLifecycle 可以防止你浪费资源并且防止 app 崩溃 (因为在不合适的 lifecycle 的状态下收到了数据更新的时候)
- 注意：

```
1. Lifecycle.State.INITIALIZED不支持，否则会报IllegalArgumentException异常`repeatOnLifecycle cannot start work with the INITIALIZED lifecycle state`
2. Lifecycle.State.DESTROYED也没用，直接return
3. repeatOnLifecycle会一直阻塞直到DESTROY或取消协程，所以不要在其后面再写代码
```

- 案例：

```kotlin
private fun test_btn_repeatonlifecycle() {
    btn_repeatonlifecycle.setOnClickListener {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                Log.i("hacket", "start launchWhenStarted") // 1
                withContext(Dispatchers.IO) {
                    Log.i("hacket", "launchWhenStarted delay 7000.")
                    delay(7000)
                    Log.i("hacket", "launchWhenStarted delay 7000. end")
                }
                Log.d("hacket", "launchWhenStarted delay5000L")
                delay(5000L)
                Log.d("hacket", "launchWhenStarted delay2000L")
                delay(2000L)
                Log.i("hacket", "end launchWhenStarted")
            }
        }
    }
}
```

我在这 1 步按了 home 键，过个 1 秒，再切回来，后续 log 怎么输出？

```
// 按下home键
I/hacket: start launchWhenStarted
I/hacket: launchWhenStarted delay 7000.
// App退到后台
D/hacket.lifecycle: ActivityLifecycleScope：onPause()，identityHashCode=205903620
// 只要App没被回收，不管过了多少秒，再切回来，协程体又是从头开始
I/hacket: start launchWhenStarted
I/hacket: launchWhenStarted delay 7000.
D/hacket.lifecycle: ActivityLifecycleScope：onResume()，identityHashCode=205903620
I/hacket: launchWhenStarted delay 7000. end
D/hacket: launchWhenStarted delay5000L
D/hacket: launchWhenStarted delay2000L
I/hacket: end launchWhenStarted
```

### repeatOnLifecycle 和 launchWhenX 区别

- `LaunchWhenX` 会在 `LifecycleOwner` 进入 X 状态之前一直等待，又在离开 X 状态时挂起协程 (协程只是挂起协程而非销毁)；如果用这个协程来订阅 `Flow`，就意味着虽然 `Flow` 的收集暂停了，但是上游的处理仍在继续，资源浪费的问题解决地不够彻底
- `repeatOnLifecycle`：离开 X 状态时，取消协程，进入 X 状态，协程体从头开始执行；如果是需要显示一个**一次性** SnackBar，或者打开一个**一次性** window，和 LiveData 一样，具有粘性，会弹出多次

#### launch 和 repeatOnLifecycle

![|700](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fmQRBPMPpnO7NAO2bg0GKw.png)

#### launch、launchWhenX 和 repeatOnLifecycle

![|700](https://devrel.andfun.cn/devrel/posts/2021/06/ODVDeh.png)

都是在 `DESTROY` 销毁协程

- **launch**：stop 后 launch 中的协程还是运行的
- **launchWhenStarted**：stop 后 launchWhenStarted 中的协程挂起了，等 started 后，恢复协程体执行；浪费资源
- **repeatOnLifecycle**：stop 后 repeatOnLifecycle 中的协程 cancel 了，等 started 后，重新执行协程

#### 示例

**示例 1：**

```kotlin
lifecycleScope.launchWhenStarted {  
    Log.d("hacket", "start launchWhenStarted delay 5000 test")  
    delay(5000)  
    Log.d("hacket", "end launchWhenStarted delay 5000 test")  
}  
lifecycleScope.launch {  
    repeatOnLifecycle(Lifecycle.State.STARTED) {  
        Log.d("hacket", "start repeatOnLifecycle(STARTED) delay 5000 test")  
        delay(5000)  
        Log.d("hacket", "end repeatOnLifecycle(STARTED) delay 5000 test")  
    }  
}
```

进入到 started 状态，输出：

> start launchWhenStarted delay 5000 test
> start repeatOnLifecycle (STARTED) delay 5000 test

如果被 `repeatOnLifecycle(Lifecycle.State.STARTED)` 包裹起来，等 1s 后返回主界面，该挂起函数会立即**取消**，因为取消了，所以你再等 4s，也不会有任何反应。等 5 后，start log 信息会出现在控制台中，因为重新执行了

如果被 `launchWhenStarted` 包裹起来，等 1s 后返回主界面，该挂起函数会立即**挂起**，因为挂起了，所以你再等 4s，也不会有任何反应，但是它还是一直在后台进行着 delay 的。当你过了 4 s 多再打开程序后，log 信息会立即出现在控制台中，因为挂起恢复了。

下面是等 5 秒后让 App 恢复到前台，输出：

> end launchWhenStarted delay 5000 test
> start repeatOnLifecycle(STARTED) delay 5000 test

**示例 2：**

```kotlin
fun getLocationUpdates(context: Context): Flow<Location> = callbackFlow {  
    val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager  
    val locationListener = object : LocationListener {  
        override fun onLocationChanged(location: Location) {  
            // 当位置发生变化时，通过流发送新的位置信息  
            trySend(location).isSuccess  
        }  

        override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}  
        override fun onProviderEnabled(provider: String) {}  
        override fun onProviderDisabled(provider: String) {}  
    }  
    // 请求位置更新，注意考虑权限请求和根据实际情况调整最小更新时间和地点变化距离间隔  
    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 100L, 0F, locationListener)  
  
    // 注册一个等待关闭事件，在 Flow 收集被取消时，注销位置监听器  
    awaitClose {  
        Log.w("hacket", "===>>> awaitClose")  
        locationManager.removeUpdates(locationListener)  
    }  
}
lifecycleScope.launchWhenResumed {  
    getLocationUpdates(applicationContext).collect {  
        // ...
    }  
}
lifecycleScope.launch {
	repeatOnLifecycle(Lifecycle.State.RESUMED) {
		// ...
	}
}
```

当 `Activity` 进入 `pause` 时， `lifecycleScope.launchWhenResumed` 挂起，停止接受 Flow 的数据，UI 也随之停止更新。但是 `callbackFlow` 中的 `requestLocationUpdates` 仍然还在持续，造成资源的浪费。

因此，**即使在 launchWhenX 中订阅 Flow 仍然是不够的，无法完全避免资源的浪费**

`repeatOnLifecycle` 在进入到 `pause`，会取消协程，调用 `awaitClose{}`

## Flow.flowWithLifecycle

当我们只有一个 Flow 需要收集时，可以使用 `flowWithLifecycle` 这样一个 Flow 操作符的形式来简化代码

```kotlin
lifecycleScope.launch {
	viewMode.stateFlow
	  .flowWithLifecycle(this, Lifecycle.State.STARTED)
	  .collect { ... }
}
```

当然，其本质还是对 `repeatOnLifecycle` 的封装：

```kotlin
public fun <T> Flow<T>.flowWithLifecycle(
    lifecycle: Lifecycle,
    minActiveState: Lifecycle.State = Lifecycle.State.STARTED
): Flow<T> = callbackFlow {
    lifecycle.repeatOnLifecycle(minActiveState) {
        this@flowWithLifecycle.collect {
            send(it)
        }
    }
    close()
}
```

## viewModelScope

Google 为我们创造了 ViewModelScope，它通过向 ViewModel 类添加扩展属性来方便我们使用协程，而且在 ViewModel 被销毁时会自动取消其子协程。

```kotlin
class JetpackCoroutineViewModel : ViewModel() {
    fun launchData() {
        viewModelScope.launch {
            //在后台执行
            val result = getNetData()
            //修改UI
            log(result)
        }
    }
    //将耗时任务切到IO线程去执行
    private suspend fun getNetData() = withContext(Dispatchers.IO) {
        //模拟网络耗时
        delay(1000)
        //模拟返回结果
        "{}"
    }
}
```

### viewModelScope 的底层实现

```kotlin
private const val JOB_KEY = "androidx.lifecycle.ViewModelCoroutineScope.JOB_KEY"

/**
 * [CoroutineScope] tied to this [ViewModel].
 * This scope will be canceled when ViewModel will be cleared, i.e [ViewModel.onCleared] is called
 *
 * This scope is bound to
 * [Dispatchers.Main.immediate][kotlinx.coroutines.MainCoroutineDispatcher.immediate]
 */
public val ViewModel.viewModelScope: CoroutineScope
    get() {
        val scope: CoroutineScope? = this.getTag(JOB_KEY)
        if (scope != null) {
            return scope
        }
        return setTagIfAbsent(
            JOB_KEY,
            CloseableCoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
        )
    }

internal class CloseableCoroutineScope(context: CoroutineContext) : Closeable, CoroutineScope {
    override val coroutineContext: CoroutineContext = context

    override fun close() {
        coroutineContext.cancel()
    }
}
```

- 给 ViewModel 添加了 `viewModelScope` 属性，返回的是一个 CloseableCoroutineScope
- CloseableCoroutineScope 是一个可以取消的协程，它实现了 Closeable 并在 close 方法中进行了取消。
- 每次在使用 viewModelScope 的时候，会先从缓存中取，如果没有才去新建一个 CloseableCoroutineScope。需要注意的是，CloseableCoroutineScope 的执行是在主线程中执行的。

接着看 ViewModel：

```kotlin
public abstract class ViewModel {
    // Can't use ConcurrentHashMap, because it can lose values on old apis (see b/37042460)
    @Nullable
    private final Map<String, Object> mBagOfTags = new HashMap<>();
    private volatile boolean mCleared = false;

    <T> T setTagIfAbsent(String key, T newValue) {
        T previous;
        synchronized (mBagOfTags) {
            previous = (T) mBagOfTags.get(key);
            if (previous == null) {
                mBagOfTags.put(key, newValue);
            }
        }
        T result = previous == null ? newValue : previous;
        if (mCleared) {
            // It is possible that we'll call close() multiple times on the same object, but
            // Closeable interface requires close method to be idempotent:
            // "if the stream is already closed then invoking this method has no effect." (c)
            closeWithRuntimeException(result);
        }
        return result;
    }
    <T> T getTag(String key) {
        if (mBagOfTags == null) {
            return null;
        }
        synchronized (mBagOfTags) {
            return (T) mBagOfTags.get(key);
        }
    }
    private static void closeWithRuntimeException(Object obj) {
        if (obj instanceof Closeable) {
            try {
                ((Closeable) obj).close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
    
    @MainThread
    final void clear() {
        mCleared = true;
        // Since clear() is final, this method is still called on mock objects
        // and in those cases, mBagOfTags is null. It'll always be empty though
        // because setTagIfAbsent and getTag are not final so we can skip
        // clearing it
        if (mBagOfTags != null) {
            synchronized (mBagOfTags) {
                for (Object value : mBagOfTags.values()) {
                    // see comment for the similar call in setTagIfAbsent
                    closeWithRuntimeException(value);
                }
            }
        }
        onCleared();
    }
}
```

- ViewModel 的 mBagOfTags 中，它是一个 HashMap，保存的是 CloseableCoroutineScope
- setTagIfAbsent 方法是缓存 CloseableCoroutineScope 实例到 ViewModel
- clear 方法，将 mBagOfTags 遍历一遍，然后将所有 value 是 Closeable 的全部 close，CloseableCoroutineScope 的 close 就是 cancel 掉该协程（也就是在 ViewModel close 时会将其保存的 viewModelScope 给 cancel 掉）

> 上面这种 ViewModel 提供 mBagOfTags，配合 Closeable，来实现无侵入式关联 ViewModel 生命周期，在 clear 时，将回调 Closeable 的 close() 方法，从而让其和 ViewModel 实现联动

## Android 中使用协程案例

```
如何将Kotlin Coroutine(协程)和Retrofit结合使用
如何在Kotlin Coroutine(协程)切换协程所在线程
如何在Kotlin Coroutine(协程)中将两个请求结果进行合并
Kotlin Coroutine(协程)中如何实现并发请求
MVP开发模式中如何在Presenter生命周期结束时优雅的取消协程
如何将一个普通异步操作改造为协程中的挂起函数
```

### 如何将一个普通异步操作 (callback) 改造为协程中的挂起函数

通过两个挂起函数 `suspendCoroutine{}` 或 `suspendCancellableCoroutine{}`，将 OkHttp 的网络请求转换为 suspend 挂起函数。

```kotlin
suspend fun Call.await(): String = suspendCoroutine {
    this.enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    val string = body.string()
                    it.resume(string)
//                       等同于： it.resumeWith(Result.success(data))
                } else {
                    "response error body is null".print()
                    it.resumeWithException(RuntimeException("body为null!"))
                }
            } else {
                it.resumeWithException(RuntimeException("出错了,code=${response.code()}"))
            }
        }

        override fun onFailure(call: Call, e: IOException) {
            it.resumeWithException(RuntimeException("出错了,e=${e.message}"))
        }
    })
}
```

使用：

```kotlin
btn_call_coroutine.setOnClickListener {=
    tv_info.text = "click去请求".log()
    launch {
        val client = OkHttpClient()
        val request = Request.Builder()
                .url("http://www.wanandroid.com/friend/json")
                .build()
        val call = client.newCall(request)
        tv_info.append("请求前：${request.url()}".log())
        val data = call.await()
        tv_info.append("请求后：data=$data".log())
    }
}
```

## Ref

- [ ] Coroutines on Android（二）起步<br><https://www.chenhe.cc/p/218>

# lifecycleScope 详解及原理

## lifecycleScope

### lifecycleScope 原理

`lifecycleScope` 是 `LifecycleOwner` 的一个扩展属性，返回的是 `LifecycleCoroutineScope`：

```kotlin
// androidx.lifecycle:lifecycle-runtime-ktx  androidx.lifecycle.Lifecycle.kt
public val LifecycleOwner.lifecycleScope: LifecycleCoroutineScope
    get() = lifecycle.coroutineScope

public val Lifecycle.coroutineScope: LifecycleCoroutineScope
    get() {
        while (true) {
            val existing = mInternalScopeRef.get() as LifecycleCoroutineScopeImpl? 
            if (existing != null) { // 从Lifecycle的mInternalScopeRef缓存拿LifecycleCoroutineScopeImpl，有的话返回
                return existing
            }
            // mInternalScopeRef缓存没有就new一个LifecycleCoroutineScopeImpl。
            // SupervisorJob()和Dispatchers.Main
            val newScope = LifecycleCoroutineScopeImpl(this, SupervisorJob() + Dispatchers.Main.immediate)
            if (mInternalScopeRef.compareAndSet(null, newScope)) { // 存到mInternalScopeRef
                newScope.register() // 调用LifecycleCoroutineScopeImpl#register()注册下
                return newScope
            }
        }
    }

// androidx.lifecycle.Lifecycle
public abstract class Lifecycle {
    // Lifecycle存CoroutineScope的
    @RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
    @NonNull
    AtomicReference<Object> mInternalScopeRef = new AtomicReference<>();
}
```

- `lifecycleScope` 是一个 `lifecycle.coroutineScope` ，它是 `Lifecycle` 的一个扩展属性
- coroutineScope 内部是个死循环
  - 从 Lifecycle 的 `mInternalScopeRef` 获取，如果存在则返回；没有继续走
  - 创建一个 `LifecycleCoroutineScope`，其是 `SupervisorJob()` 和 `Dispatchers.Main`
  - 调用 `register()`，监听 LifecycleOwner 的状态变化

现在看看 `LifecycleCoroutineScopeImpl`，`LifecycleCoroutineScopeImpl` 继承自 `LifecycleCoroutineScope`，它是一个抽象类，先看看 `LifecycleCoroutineScope`：

```kotlin
// androidx.lifecycle:lifecycle-runtime-ktx  androidx.lifecycle.Lifecycle.kt
// 1. 该CoroutineScope关联了Lifecycle和Dispatchers.Main.immediate；
// 2. 该CoroutineScope在Lifecycle destroyed时，会cancel协程体
// 3. 该CoroutineScope提供了特殊的launch：launchWhenCreated, launchWhenStarted, launchWhenResumed
public abstract class LifecycleCoroutineScope internal constructor() : CoroutineScope {
    internal abstract val lifecycle: Lifecycle
    
    // 至少 Lifecycle.State.CREATED 才调用block
    public fun launchWhenCreated(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenCreated(block)
    }
    // 至少 Lifecycle.State.STARTED 才调用block
    public fun launchWhenStarted(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenStarted(block)
    }
    // 至少 Lifecycle.State.RESUMED 才调用block
    public fun launchWhenResumed(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenResumed(block)
    }
}
```

接着看 `LifecycleCoroutineScope` 的实现类 `LifecycleCoroutineScopeImpl`：

```kotlin
// androidx.lifecycle:lifecycle-runtime-ktx  androidx.lifecycle.Lifecycle.kt
internal class LifecycleCoroutineScopeImpl(
    override val lifecycle: Lifecycle,
    override val coroutineContext: CoroutineContext
) : LifecycleCoroutineScope(), LifecycleEventObserver { // 集成LifecycleCoroutineScope，并实现了LifecycleEventObserver，能感知lifecycle event的变化
    init {
        // in case we are initialized on a non-main thread, make a best effort check before
        // we return the scope. This is not sync but if developer is launching on a non-main
        // dispatcher, they cannot be 100% sure anyways.
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) { // DESTROYED取消协程体
            coroutineContext.cancel()
        }
    }

    fun register() { // 在前面lifecycle.coroutineScope，如果是新new的LifecycleCoroutineScopeImpl，会调用register
        launch(Dispatchers.Main.immediate) { // 在Main thread
            if (lifecycle.currentState >= Lifecycle.State.INITIALIZED) { // 当前state，大于INITIALIZED
                lifecycle.addObserver(this@LifecycleCoroutineScopeImpl) // 即在主线程，大于INITIALIZED才能注册（CREATED、STARTED、RESUMED三种状态下才能注册）
            } else {
                coroutineContext.cancel() // 否则直接cancel协程体（INITIALIZED或DESTROYED状态）
            }
        }
    }

    override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        // Lifecycle的事件变化
        if (lifecycle.currentState <= Lifecycle.State.DESTROYED) { // DESTROYED是State第一个值，即处于DESTROYED状态时，移除掉LifecycleEventObserver并取消协程体
            lifecycle.removeObserver(this) // 移除LifecycleEventObserver
            coroutineContext.cancel() // 取消携程体
        }
    }
}

public enum State {
    DESTROYED,INITIALIZED,CREATED,STARTED,RESUMED
}
```

- 构造方法有 2 个参数，lifecycle，coroutineContext。
  - lifecycle 一般为 Activity 或 Fragment（通过 `getLifecycle()` 获取到 `Lifecyle`）
  - coroutineContext 协程体，上面传递的是 `SupervisorJob() + Dispatchers.Main.immediate`
- 初始化时检测当前状态如果是 `Lifecycle.State.DESTROYED`，那么会将 coroutineContext cancel 掉
- `register` 方法中只有在在当前 Lifecycle 合适的状态才能 register 一个 LifecycleEventObserver 到 Lifecycle
- 当 `DESTROYED` 事件到来时，移除 `LifecycleEventObserver` 并取消协程体

### launchWhenX 原理

以 `launchWhenCreated为例：`

```kotlin
public abstract class LifecycleCoroutineScope internal constructor() : CoroutineScope {
	public fun launchWhenCreated(block: suspend CoroutineScope.() -> Unit): Job = launch {  
	    lifecycle.whenCreated(block)  
	}
}

public suspend fun <T> Lifecycle.whenCreated(block: suspend CoroutineScope.() -> T): T {  
    return whenStateAtLeast(Lifecycle.State.CREATED, block)  
}
public suspend fun <T> Lifecycle.whenStateAtLeast(  
    minState: Lifecycle.State,  
    block: suspend CoroutineScope.() -> T  
): T = withContext(Dispatchers.Main.immediate) {  
    val job = coroutineContext[Job] ?: error("when[State] methods should have a parent job")  
    val dispatcher = PausingDispatcher()  
    val controller =  
        LifecycleController(this@whenStateAtLeast, minState, dispatcher.dispatchQueue, job)  
    try {  
        withContext(dispatcher, block)  
    } finally {  
        controller.finish()  
    }  
}
```

最终的逻辑在 `LifecycleController`：

```kotlin
internal class LifecycleController(  
    private val lifecycle: Lifecycle,  
    private val minState: Lifecycle.State,  
    private val dispatchQueue: DispatchQueue,  
    parentJob: Job  
) {  
    private val observer = LifecycleEventObserver { source, _ ->  
        if (source.lifecycle.currentState == Lifecycle.State.DESTROYED) {  
            // cancel job before resuming remaining coroutines so that they run in cancelled  
            // state            
            handleDestroy(parentJob)  
        } else if (source.lifecycle.currentState < minState) {  
            dispatchQueue.pause()  
        } else {  
            dispatchQueue.resume()  
        }  
    }  
  
    init {  
        // If Lifecycle is already destroyed (e.g. developer leaked the lifecycle), we won't get  
        // an event callback so we need to check for it before registering        // see: b/128749497 for details.        
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) {  
            handleDestroy(parentJob)  
        } else {  
            lifecycle.addObserver(observer)  
        }  
    }  
  
    @Suppress("NOTHING_TO_INLINE") // avoid unnecessary method  
    private inline fun handleDestroy(parentJob: Job) {  
        parentJob.cancel()  
        finish()  
    }  
  
    /**  
     * Removes the observer and also marks the [DispatchQueue] as finished so that any remaining     * runnables can be executed.     */    
    @MainThread  
    fun finish() {  
        lifecycle.removeObserver(observer)  
        dispatchQueue.finish()  
    }  
}
```

- 状态大于 minState，执行 DispatchQueue 的 resume；否则执行 pause
- `DESTROYED` 时，job 取消

看看 `PausingDispatcher`

```kotlin
internal class PausingDispatcher : CoroutineDispatcher() {
	@JvmField  
	internal val dispatchQueue = DispatchQueue()
	override fun isDispatchNeeded(context: CoroutineContext): Boolean {  
	    if (Dispatchers.Main.immediate.isDispatchNeeded(context)) {  
	        return true  
	    }  
	    return !dispatchQueue.canRun()
	}
	override fun dispatch(context: CoroutineContext, block: Runnable) {  
	    dispatchQueue.dispatchAndEnqueue(context, block)  
	}
}

internal class DispatchQueue {
	// handler thread  
	private var paused: Boolean = true
	// handler thread  
	private var finished: Boolean = false
	fun pause() {  
	    paused = true  // 标记paused=true
	}
	fun resume() {  
	    if (!paused) {  
	        return  
	    }  
	    check(!finished) {  
	        "Cannot resume a finished dispatcher"  
	    }  
	    paused = false  // 标记paused=false
	    drainQueue()  
	}
	@MainThread  
	fun canRun() = finished || !paused
	fun dispatchAndEnqueue(context: CoroutineContext, runnable: Runnable) {
		if (isDispatchNeeded(context) || canRun()) {  
		    dispatch(context, Runnable { enqueue(runnable) })  
		} else {  
		    enqueue(runnable)  
		}
	}
}
```

### **lifecycleScope 原理小结：**

1. 具备 LifecycleOwner 的组件，可通过其扩展属性 `lifecycleScope` 获取一个 CoroutineScope 协程体，实现类是 `LifecycleCoroutineScopeImpl`
2. `LifecycleCoroutineScopeImpl` 一个是 `SupervisorJob() + Dispatchers.Main.immediate`
3. 其提供的特殊 launch 方法，`launchWhenCreated`(CREATED 状态后)、`launchWhenStarted`(STARTED 状态后)`和launchWhenResumed`(RESUMED 状态后) 需要在对应的 State 后才会执行其 block
   1. 通过 `ArrayDeque` 来实现的，状态未达到入队，状态到了执行 Runnable
   2. 状态不对时，不会取消协程，只是放入队列中
4. 在 `LifecyleOwner` 发出 DESTROYED 事件时，会自动取消协程

### LifecycleScope 异常处理

- `try catch`

## lifecycleScope 可自定义 CoroutineExceptionHandler

```kotlin
/**
 * lifecycleScope 处理异常，默认吞没异常
 */
fun LifecycleCoroutineScope.launch2(
    exceptionHandler: (Throwable.() -> Unit)? = null,
    block: suspend CoroutineScope.() -> Unit
) {
    launch(CustomCoroutineExceptionHandler(exceptionHandler)) {
        block.invoke(this)
    }
}


class CustomCoroutineExceptionHandler(
    private val block: (Throwable.() -> Unit)? = null
) : CoroutineExceptionHandler {
    override val key: CoroutineContext.Key<*> get() = CoroutineExceptionHandler

    override fun handleException(context: CoroutineContext, exception: Throwable) {
        exception.printStackTrace()
        block?.invoke(exception)
    }
}

val LifecycleOwner.lifecycleScope2: LifecycleCoroutineScope2
    get() = lifecycle.getCoroutineScope2(null)

fun LifecycleOwner.getLifecycleScope2(exceptionHandler: (Throwable.() -> Unit)? = null): LifecycleCoroutineScope2 {
    return lifecycle.getCoroutineScope2(exceptionHandler)
}

fun Lifecycle.getCoroutineScope2(exceptionHandler: (Throwable.() -> Unit)? = null): LifecycleCoroutineScope2 {
    var coroutineContext = SupervisorJob() + Dispatchers.Main.immediate

    if (exceptionHandler != null) {
        coroutineContext += CustomCoroutineExceptionHandler(exceptionHandler)
    }
    val newScope = LifecycleCoroutineScopeImpl2(this, coroutineContext)
    newScope.register()
    return newScope
}

abstract class LifecycleCoroutineScope2 internal constructor() : CoroutineScope {
    internal abstract val lifecycle: Lifecycle

    /**
     * Launches and runs the given block when the [Lifecycle] controlling this
     * [LifecycleCoroutineScope] is at least in [Lifecycle.State.CREATED] state.
     *
     * The returned [Job] will be cancelled when the [Lifecycle] is destroyed.
     * @see Lifecycle.whenCreated
     * @see Lifecycle.coroutineScope
     */
    fun launchWhenCreated(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenCreated(block)
    }

    /**
     * Launches and runs the given block when the [Lifecycle] controlling this
     * [LifecycleCoroutineScope] is at least in [Lifecycle.State.STARTED] state.
     *
     * The returned [Job] will be cancelled when the [Lifecycle] is destroyed.
     * @see Lifecycle.whenStarted
     * @see Lifecycle.coroutineScope
     */

    fun launchWhenStarted(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenStarted(block)
    }

    /**
     * Launches and runs the given block when the [Lifecycle] controlling this
     * [LifecycleCoroutineScope] is at least in [Lifecycle.State.RESUMED] state.
     *
     * The returned [Job] will be cancelled when the [Lifecycle] is destroyed.
     * @see Lifecycle.whenResumed
     * @see Lifecycle.coroutineScope
     */
    fun launchWhenResumed(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenResumed(block)
    }
}

class LifecycleCoroutineScopeImpl2(
    override val lifecycle: Lifecycle,
    override val coroutineContext: CoroutineContext
) : LifecycleCoroutineScope2(), LifecycleEventObserver {
    init {
        // in case we are initialized on a non-main thread, make a best effort check before
        // we return the scope. This is not sync but if developer is launching on a non-main
        // dispatcher, they cannot be 100% sure anyways.
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) {
            coroutineContext.cancel()
        }
    }

    fun register() {
        launch(Dispatchers.Main.immediate) {
            if (lifecycle.currentState >= Lifecycle.State.INITIALIZED) {
                lifecycle.addObserver(this@LifecycleCoroutineScopeImpl2)
            } else {
                coroutineContext.cancel()
            }
        }
    }

    override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        if (lifecycle.currentState <= Lifecycle.State.DESTROYED) {
            lifecycle.removeObserver(this)
            coroutineContext.cancel()
        }
    }
}
```

使用：

```kotlin
getLifecycleScope2 {
    toast("" + this.message)
}.launchWhenResumed {
    throw RuntimeException("LifecycleScope2异常了")
}
```
