---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Friday, January 31st 2025, 6:23:31 pm
title: 04Kotlin协程挂起suspend
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
date created: 2024-03-09 17:21
date updated: 2024-12-27 23:45
aliases: [协程挂起]
linter-yaml-title-alias: 协程挂起
---

# 协程挂起

## 什么是 suspend 挂起函数？

函数前面有 `suspend` 修饰符标记，这表示函数都是**挂起函数**。

### suspend 函数特点

#### 挂起函数可能会挂起协程

挂起函数使用 CPS style 的代码来挂起协程，保证挂起点后面的代码只能在挂起函数执行完后才能执行，所以挂起函数保证了协程内的顺序执行顺序。

```kotlin
fun postItem(item: Item) {
    GlobalScope.launch {
        // async { requestToken() } 新建一个协程，可能在另一个线程运行
        // 但是 await() 是挂起函数，当前协程执行逻辑卡在第一个分支，第一种状态，当 async 的协程执行完后恢复当前协程，才会切换到下一个分支
        val token = async { requestToken() }.await()
        // 在第二个分支状态中，又新建一个协程，使用 await 挂起函数将之后代码作为 Continuation 放倒下一个分支状态，直到 async 协程执行完
        val post = aync { createPost(token, item) }.await()
        // 最后一个分支状态，直接在当前协程处理
        processPost(post)
    }
}
```

注意挂起函数不一定会挂起协程，如果相关调用的结果已经可用，库可以决定继续进行而不挂起，例如 async { requestToken() }的返回值 Deferred 的结果已经可用时，await() 挂起函数可以直接返回结果，不用再挂起协程。

#### 挂起函数不会阻塞线程

挂起函数挂起协程时，不会阻塞协程所在的线程。挂起函数执行完成后会恢复协程，后面的代码才会继续执行。

```kotlin
fun main(args: Array<String>) {
    // 创建一个单线程的协程调度器，下面两个协程都运行在这同一线程上
    val coroutineDispatcher = newSingleThreadContext("ctx")
    // 启动协程 1
    GlobalScope.launch(coroutineDispatcher) {
        println("the first coroutine")
        delay(200)
        println("the first coroutine")
    }
    // 启动协程 2
    GlobalScope.launch(coroutineDispatcher) {
        println("the second coroutine")
        delay(100)
        println("the second coroutine")
    }
    // 保证 main 线程存活，确保上面两个协程运行完成
    Thread.sleep(500)
}
```

输出：

> the first coroutine
> the second coroutine
> the second coroutine
> the first coroutine

从上面结果可以看出，当协程 1 暂停 200 ms 时，线程并没有阻塞，而是执行协程 2 的代码，然后在 200ms 时间到后，继续执行协程 1 的逻辑。所以挂起函数并不会阻塞线程，这样可以节省线程资源，协程挂起时，线程可以继续执行其他逻辑。

#### 挂起函数恢复协程后运行在哪个线程

协程的所属的线程调度主要是由协程的 `CoroutineDispatcher` 控制，CoroutineDispatcher 可以指定协程运行在某一特定线程上、运作在线程池中或者不指定所运行的线程。所以协程调度器可以分为 `Confined dispatcher` 和 `Unconfined dispatcher`。`Dispatchers.Default`、`Dispatchers.IO` 和 `Dispatchers.Main` 属于**Confined dispatcher**，都指定了协程所运行的线程或线程池，挂起函数恢复后协程也是运行在指定的线程或线程池上的 l；而 `Dispatchers.Unconfined` 属于**Unconfined dispatcher**，协程启动并运行在 Caller Thread 上，但是只是在第一个挂起点之前是这样的，挂起恢复后运行在哪个线程完全由所调用的挂起函数决定。

```kotlin
fun main(args: Array<String>) = runBlocking<Unit> {
    launch {
        // 默认继承 parent coroutine 的 CoroutineDispatcher，指定运行在 main 线程
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(100)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) {
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(100)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
}
结果：
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

上面第三行输出，经过 delay 挂起函数后，使用 Dispatchers.Unconfined 的协程挂起恢复后依然在 delay 函数使用的 DefaultExecutor 上。

### suspend 原理

```kotlin
fun main() {
    GlobalScope.launch {
        val token = requestToken()
        val post = createPost(token, 29)
        processPost(post)
    }
}
suspend fun requestToken(): String {
    return "hacket"
}   // 挂起函数
suspend fun createPost(token: String, item: Int): Boolean {
    return true
}  // 挂起函数
fun processPost(post: Boolean) {
}
```

编译后：

```java
BuildersKt.launch$default((CoroutineScope)GlobalScope.INSTANCE, (CoroutineContext)null, (CoroutineStart)null, (Function2)(new Function2((Continuation)null) {
    public final Object invokeSuspend(@NotNull Object $result) {
        Object var5 = IntrinsicsKt.getCOROUTINE_SUSPENDED();
        Object var10000;
        switch(this.label) {
            case 0:
                var10000 = HelloKt.requestToken(this);
                if (var10000 == var5) {
                 return var5;
                }
                break;
            case 1:
                // ...
                break;
            case 2:
                // ...
                break;
        }
        token = (String)var10000;
        var10000 = HelloKt.createPost(token, 29, this);
        if (var10000 == var5) {
          return var5;
        }
        
        boolean post = (Boolean)var10000;
        HelloKt.processPost(post);
        return Unit.INSTANCE;
    }
});
public static final Object requestToken(@NotNull Continuation $completion) {
  return "hacket";
}
public static final Object createPost(@NotNull String token, int item, @NotNull Continuation $completion) {
  return Boxing.boxBoolean(true);
}
public static final void processPost(boolean post) {
}
```

- 协程的内部实现使用了 Kotlin 编译器的一些编译技术，挂起函数或挂起 lambda 表达式调用时，都有一个隐式的参数额外传入，这个参数是 Continuation 类型，封装了协程恢复后的执行的代码逻辑
- 协程内部实现不是使用普通回调的形式，而是使用状态机来处理不同的挂起点，CPS(Continuation Passing Style) 代码
- 每一个挂起点和初始挂起点对应的 Continuation 都会转化为一种状态，协程恢复只是跳转到下一种状态中。挂起函数将执行过程分为多个 Continuation 片段，并且利用状态机的方式保证各个片段是顺序执行的。
- 每个 suspend 方法，编译后最后一个参数为 Continuation

#### Continuation

```kotlin
public interface Continuation<in T> {
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```

## callback 转换成 suspend 函数

![wqcql](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/wqcql.png)

### suspendCoroutine 和 suspendCancellableCoroutine 异同点

相同点：

1. 可以用来将回调封装成挂起函数
   - 正常流程恢复调用 `resume(T)`
   - 异常流程用 `resumeWithException(Throwable)`，他们都是调用的 `resumeWith(Result<T>)`
   - `kotlin v1.2.0`，`resume(value: T, onCancellation: (cause: Throwable) -> Unit)` resume 增加了 onCancellation，用于 resume 出现问题时的回调。

不同点：

1. suspendCoroutine 不能取消；suspendCoroutine 封装的 callback 要注意内存泄漏
2. suspendCancellableCoroutine 可以通过 `Job.cancel()` 来取消（会抛出 CancellationException）;
   - suspendCancellableCoroutine 可以设置 `invokeOnCancellation`，在被取消时会被回调可以用来做资源释放/callback 置空操作
   - 调用 cancel() 后协程不再往下执行，抛出 CancellationException 异常，但是程序不会崩溃。而 suspendCoroutine 没有该方法，因此只能傻等…直到被通知 resume 或 resumeWithException。
3. 尽可能使用 suspendCancellableCoroutine 而不是 suspendCoroutine ，因为协程的取消是可控的

> 举个例子：使用网络请求数据时，如果请求时间过长，用户可以手动取消掉协程的执行。这时会抛出一个 CancellationException 异常，但是将该异常 try{}catch{}捕获后就不会影响后续代码的执行。而使用 suspendCoroutine 只能干等着被 resume 或者 resumeWithException ，因为它没有该功能。

实现原理：

```kotlin
public suspend inline fun <T> suspendCoroutine(crossinline block: (Continuation<T>) -> Unit): T =
    suspendCoroutineUninterceptedOrReturn { c: Continuation<T> ->
        val safe = SafeContinuation(c.intercepted())
        block(safe)
        safe.getOrThrow()
}
public suspend inline fun <T> suspendCancellableCoroutine(
    crossinline block: (CancellableContinuation<T>) -> Unit
): T =
    suspendCoroutineUninterceptedOrReturn { uCont ->
        val cancellable = CancellableContinuationImpl(uCont.intercepted(), resumeMode = MODE_CANCELLABLE)
        // 和 suspendCoroutine 的区别就在这里，如果协程已经被取消或者已完成，就会抛出 CancellationException 异常
        cancellable.initCancellability()
        block(cancellable)
        cancellable.getResult()
}
```

它们的关键实现都是调用 `suspendCoroutineUninterceptedOrReturn()` 函数，它的作用是获取当前协程的实例，并且挂起当前协程或者不挂起直接返回结果。<br>协程中还有两个常见的挂起函数使用到了 `suspendCoroutineUninterceptedOrReturn()` 函数，分别是 `delay()` 和 `yield()`。

示例 1：suspendCancellableCoroutine 将网络请求 callback 转为 suspend

```kotlin
suspend fun <T> NetworkRequestBuilder.requestCoroutine(key: String = "", clazz: Class<T>): T {
    return suspendCancellableCoroutine { continuation ->
        continuation.invokeOnCancellation { cancel() }
			.onSuccess(object : NetworkRequestBuilder.OnSuccess {
				override fun call(data: JSONObject?) {
					if (data == null) {
						continuation.resumeWithException(RemixNetRequestException(ERR_CODE_JSON_DATA_NULL, "data is null"))
						return
					}
					val json = if (key.isBlank()) {
						data.toString()
					} else {
						data.optJSONObject(key)?.toString()
					} ?: ""
					val response = GsonUtils.fromJson(json, clazz)
					if (response == null) {
						continuation.resumeWithException(RemixNetRequestException(ERR_CODE_RESPONSE_NULL, "response is null"))
						return
					}
					continuation.resume(response, {
						cancel()
					})
				}
			})
			.onFailed { code: Int, msg: String? ->
				continuation.resumeWithException(RemixNetRequestException(code, msg))
			}
			.onFinished {
			}
			.request()
    }
}
```

示例 2：Retrofit 对 suspend 的适配 [`KotlinExtensions.kt`](https://github.com/square/retrofit/blob/trunk/retrofit/src/main/java/retrofit2/KotlinExtensions.kt)

```kotlin
suspend fun <T : Any> Call<T>.await(): T {
  return suspendCancellableCoroutine { continuation ->
    continuation.invokeOnCancellation {
      cancel()
    }
    enqueue(object : Callback<T> {
      override fun onResponse(call: Call<T>, response: Response<T>) {
        if (response.isSuccessful) {
          val body = response.body()
          if (body == null) {
            val invocation = call.request().tag(Invocation::class.java)!!
            val service = invocation.service()
            val method = invocation.method()
            val e = KotlinNullPointerException(
              "Response from ${service.name}.${method.name}" +
                " was null but response body type was declared as non-null",
            )
            continuation.resumeWithException(e)
          } else {
            continuation.resume(body)
          }
        } else {
          continuation.resumeWithException(HttpException(response))
        }
      }

      override fun onFailure(call: Call<T>, t: Throwable) {
        continuation.resumeWithException(t)
      }
    })
  }
}
```

### callbackFlow

将 callback 转换成 Flow，底层通过 Channel 实现

```kotlin
// create a location listener
val locationListener = object : LocationListener {

    override fun onLocationUpdate(location: Location) {
        // do something with the updated location
    }

}

// register for location updates
LocationManager.registerForLocation(locationListener)

// unregister in onDestroy()
LocationManager.unregisterForLocation(locationListener)

fun getLocationUpdates(): Flow<Location> {
    return callbackFlow {
        val locationListener = object : LocationListener {

            override fun onLocationUpdate(location: Location) {
                trySend(location)
            }
        }
        LocationManager.registerForLocation(locationListener)
        awaitClose {
            LocationManager.unregisterForLocation(locationListener)
        }
    }
```

调用：

```kotlin
// Collect Location Updates
launch {
    getLocationFlow()
    .collect { location ->
        // Update UI with location
    }
}
```

### RxJava 的订阅回调转换成挂起函数

为了方便将 RxJava 的调用转为协程的挂起函数形式，jetbrains 官方专门给出了实现，即使用 `kotlinx-coroutines-rx2`：

```
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-rx2:1.3.2"
```

![bkcgu](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/bkcgu.png)

### 其他

#### delay 的实现

delay 方法定义：

```kotlin
public suspend fun delay(timeMillis: Long) {
    if (timeMillis <= 0) return // don't delay
    return suspendCancellableCoroutine sc@ { cont: CancellableContinuation<Unit> ->
        cont.context.delay.scheduleResumeAfterDelay(timeMillis, cont)
    }
}
```

延迟当前协程，不会阻塞线程，timeMillis 过后恢复协程，这期间可能执行其他协程。如果在 delay 期间，协程取消了，会立即抛出 `CancellationException` 异常。<br>delay 使用 `suspendCancellableCoroutine` 挂起协程

#### yield 的实现（让出执行机会）

yield() 的作用是挂起当前协程，然后将协程分发到 Dispatcher 的队列，这样可以让该协程所在线程或线程池可以运行其他协程逻辑，然后在 Dispatcher 空闲的时候继续执行原来协程。简单的来说就是让出自己的执行权，给其他协程使用，当其他协程执行完成或也让出执行权时，一开始的协程可以恢复继续运行。

> 如果当前协程已经 cancel 或者 complete，在这个 suspend function 执行或者 wait 时，会 resume 抛出异常 `CancellationException`。

示例：

```kotlin
runBlocking {
    launch {
        repeat(3) {
            println("job1 repeat $it times")
            yield()
        }
    }
    launch {
        repeat(3) {
            println("job2 repeat $it times")
            yield()
        }
    }
}
```

通过 yield() 实现 job1 和 job2 两个协程交替运行，输出如下：

```
job1 repeat 0 times
job2 repeat 0 times
job1 repeat 1 times
job2 repeat 1 times
job1 repeat 2 times
job2 repeat 2 times
```

源码：

```kotlin
public suspend fun yield(): Unit = suspendCoroutineUninterceptedOrReturn sc@ { uCont ->
    val context = uCont.context
    // 检测协程是否已经取消或者完成，如果是的话抛出 CancellationException
    context.checkCompletion()
    // 如果协程没有线程调度器，或者像 Dispatchers.Unconfined 一样没有进行调度，则直接返回
    val cont = uCont.intercepted() as? DispatchedContinuation<Unit> ?: return@sc Unit
    if (!cont.dispatcher.isDispatchNeeded(context)) return@sc Unit
    // dispatchYield(Unit) 最终会调用到 dispatcher.dispatch(context, block) 将协程分发到调度器队列中，这样线程可以执行其他协程
    cont.dispatchYield(Unit)
    COROUTINE_SUSPENDED
}
```

yield() 需要依赖协程的线程调度器，而调度器再次执行该协程时，过会调用 resume 来恢复协程运行。

## 协程之间的关系

官方文档中有提到协程之间可能存在父子关系，取消父协程时，也会取消所有子协程。<br>协程间父子关系有三种影响：

1. 父协程手动调用 `cancel` 或者异常结束，会立即取消它的所有子协程
2. 父协程必须等待所有子协程完成（处于完成或者取消状态）才能完成
3. 子协程抛出未捕获的异常时，默认情况下会取消其父协程

### launch 和 async

launch 和 async 新建协程时，首先都是 `newCoroutineContext(context)` 新建协程的 CoroutineContext 上下文：

```kotlin
public actual fun CoroutineScope.newCoroutineContext(context: CoroutineContext): CoroutineContext {
    // 新协程继承了原来 CoroutineScope 的 coroutineContext 
    val combined = coroutineContext + context
    val debug = if (DEBUG) combined + CoroutineId(COROUTINE_ID.incrementAndGet()) else combined
    // 当新协程没有指定线程调度器时，会默认使用 Dispatchers.Default
    return if (combined !== Dispatchers.Default && combined[ContinuationInterceptor] == null)
        debug + Dispatchers.Default else debug
}
```

所以新的协程的 CoroutineContext 都继承了原来 CoroutineScope 的 coroutineContex。<br>然后 launch 和 async 新建协程最后都会调用 `start(start: CoroutineStart, receiver: R, block: suspend R.() -> T)`，里面第一行是 `initParentJob()`，通过注释可以知道就是这个函数建立父子关系的，下面看其实现细节：

```kotlin
// AbstractCoroutine.kt
internal fun initParentJob() {
    initParentJobInternal(parentContext[Job])
}
// JobSupport.kt
internal fun initParentJobInternal(parent: Job?) {
    check(parentHandle == null)
    if (parent == null) {
        parentHandle = NonDisposableHandle
        return
    }
    parent.start() // make sure the parent is started
    @Suppress("DEPRECATION")
    // 关键在于 parent.attachChild(this)
    val handle = parent.attachChild(this)
    parentHandle = handle
    // now check our state _after_ registering (see tryFinalizeSimpleState order of actions)
    if (isCompleted) {
        handle.dispose()
        parentHandle = NonDisposableHandle // release it just in case, to aid GC
    }
}
```

这里需要注意的是 `GlobalScope` 和 `普通协程的CoroutineScope` 的区别，GlobalScope 的 Job 是为空的，GlobalScope.launch{}和 GlobalScope.async{}新建的协程是没有父协程的

### 父协程手动调用 cancel() 或者异常结束，会立即取消它的所有子协程

### 父协程必须等待所有子协程完成（处于完成或者取消状态）才能完成

### 子协程抛出未捕获的异常时，默认情况下会取消其父协程

## 协程的取消

协程的取消只是状态的变化，并不会取消协程的实际运算逻辑

```kotlin
fun main(args: Array<String>) = runBlocking {
    val job1 = launch(Dispatchers.Default) {
        repeat(5) {
            "job1 sleep ${it + 1} times".print()
            delay(500)
        }
    }
    delay(700)
    job1.cancel()
    "job1 cancel".print()
    val job2 = launch(Dispatchers.Default) {
        var nextPrintTime = 0L
        var i = 1
        while (i <= 3) {
            val currentTime = System.currentTimeMillis()
            if (currentTime >= nextPrintTime) {
                "job2 sleep ${i++} ...".print()
                nextPrintTime = currentTime + 500L
            }
        }
    }
    delay(700)
    job2.cancel()
    "job2 cancel".print()
}
```

结果：

```kotlin
[job1 sleep 1 times] DefaultDispatcher-worker-1 2019-09-22 21:39:35 
[job1 sleep 2 times] DefaultDispatcher-worker-1 2019-09-22 21:39:35 
[job1 cancel] main 2019-09-22 21:39:35 
[job2 sleep 1 ...] DefaultDispatcher-worker-3 2019-09-22 21:39:35 
[job2 sleep 2 ...] DefaultDispatcher-worker-3 2019-09-22 21:39:36 
[job2 cancel] main 2019-09-22 21:39:36 
[job2 sleep 3 ...] DefaultDispatcher-worker-3 2019-09-22 21:39:36
```

上面代码中 job1 取消后，delay() 会检测协程是否已取消，所以 job1 之后的运算就结束了；而 job2 取消后，没有检测协程状态的逻辑，都是计算逻辑，所以 job2 的运算逻辑还是会继续运行。<br>所以为了可以及时取消协程的运算逻辑，可以检测协程的状态，使用 `isActive` 来判断，上面示例中可以将 while(i <= 3) 替换为 while(isActive)。

```kotlin
fun main(args: Array<String>) = runBlocking {
    val job1 = launch(Dispatchers.Default) {
        repeat(5) {
            "job1 sleep ${it + 1} times".print()
            delay(500)
        }
    }
    delay(700)
    job1.cancel()
    "job1 cancel".print()
    val job2 = launch(Dispatchers.Default) { // job2代码块，不能cancel，没有检测cancel状态
        var nextPrintTime = 0L
        var i = 1
        while (isActive && i <= 3) {
            val currentTime = System.currentTimeMillis()
            if (currentTime >= nextPrintTime) {
                "job2 sleep ${i++} ...".print()
                nextPrintTime = currentTime + 500L
            }
        }
    }
    delay(700)
    job2.cancel()
    "job2 cancel".print()
}
// 结果：
[job1 sleep 1 times] DefaultDispatcher-worker-1 2019-09-22 21:39:35 
[job1 sleep 2 times] DefaultDispatcher-worker-1 2019-09-22 21:39:35 
[job1 cancel] main 2019-09-22 21:39:35 
[job2 sleep 1 ...] DefaultDispatcher-worker-3 2019-09-22 21:39:35 
[job2 sleep 2 ...] DefaultDispatcher-worker-3 2019-09-22 21:39:36 
[job2 cancel] main 2019-09-22 21:39:36
```

### 运行不能取消的代码块

当手动取消协程后，像 delay() 这样的可取消挂起函数会在检测到已取消状态时，抛出 CancellationException 异常，然后退出协程。此时可以使用 `try { … }finally { … }` 表达式或 `<T : Closeable?, R> T.use {}` 函数执行终结动作或关闭资源。

但是如果在 finally 块中调用自定义的或系统的可取消挂起函数，都会再次抛出 CancellationException 异常。通常我们在 finally 块中关闭一个文件，取消一个任务或者关闭一个通信通道都是**非阻塞，并且不会调用任何挂起函数**。当需要挂起一个被取消的协程时，可以将代码包装在 `withContext(NonCancellable) { … }` 中。

### 超时取消 withTimeout/withTimeoutOrNull

实际上大多数时候取消一个协程的理由是因为超时。协程库中已经提供来 `withTimeout() { … }` 挂起函数来实现在超时后自动取消协程。它会在超时后抛出 `TimeoutCancellationException`，它是 CancellationException 的子类，它是协程结束的正常原因，不会打印堆栈跟踪信息。

如果在取消后需要执行一些关闭资源的操作可以使用前面提到的 `try { … } finally { … }` 表达式。

```kotlin
fun main(args: Array<String>) = runBlocking {
    try {
        withTimeout(3000L) {
            repeat(1000) {
                "I'm sleep $it 秒".print()
                kotlinx.coroutines.delay(1000)
            }
        }
    } finally {
        "finally".print()
    }
}
```

结果：

```
[I'm sleep 0 秒] main 2019-09-22 21:50:13 
[I'm sleep 1 秒] main 2019-09-22 21:50:14 
[I'm sleep 2 秒] main 2019-09-22 21:50:15 
[finally] main 2019-09-22 21:50:16 
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 3000 ms
	at kotlinx.coroutines.TimeoutKt.TimeoutCancellationException(Timeout.kt:126)
	at kotlinx.coroutines.TimeoutCoroutine.run(Timeout.kt:92)
	at kotlinx.coroutines.EventLoopImplBase$DelayedRunnableTask.run(EventLoop.common.kt:491)
	at kotlinx.coroutines.EventLoopImplBase.processNextEvent(EventLoop.common.kt:270)
	at kotlinx.coroutines.DefaultExecutor.run(DefaultExecutor.kt:68)
	at java.lang.Thread.run(Thread.java:748)
```

还有一个 `withTimeoutOrNull() { … }` 挂起函数在超时后返回 null，而不是抛出一个异常：

```kotlin
try {
    val t: Int? = withTimeoutOrNull(3000L) {
        repeat(5000) {
            "I'm sleep $it 秒".print()
            kotlinx.coroutines.delay(1000)
        }
        return@withTimeoutOrNull 1
    }
   "值：$t".print()
} finally {
    "finally".print()
}
```

结果：

```
[I'm sleep 0 秒] main 2019-09-22 21:56:27 
[I'm sleep 1 秒] main 2019-09-22 21:56:28 
[I'm sleep 2 秒] main 2019-09-22 21:56:29 
[值：null] main 2019-09-22 21:56:30 
[finally] main 2019-09-22 21:56:30
```

## 小结

1. 封装异步代码为 suspend，用 `suspendCoroutine{}` 或 `suspendCancellableCoroutine{}`，异步逻辑完成用 `resume()` 或 `resumeWithException()` 来恢复协程。
2. 新建协程时需要协程间关系，`GlobalScope.launch{}` 和 `GlobalScope.async{}` 新建的协程时没有父协程的，而在协程中使用 `launch{}` 和 `async{}` 一般都是子协程。
3. 父子协程的三种关系
   - 父协程手动调用 cancel 或异常结束，会立即取消它的所有子协程
   - 父协程必须等待所有子协程完成（处于完成或者取消状态）才能完成
   - 子协程抛出未捕获的异常时，默认情况下会取消其父协程
4. 协程的取消，cancel 只是将协程的状态修改为已取消状态，并不能取消协程的运算逻辑，协程库中的很多 suspend 函数都会检测协程状态，如果想及时取消协程的运行，最好使用 `isAlive` 判断协程状态。
5. `withContext(NonCancellable){}` 可以执行不会被取消的代码，而 `withTimeout(){}` 和 `withTimeoutOrNull(){}可以简化超时逻辑处理`

## Ref

- Kotlin Coroutines(协程) 完全解析（三），封装异步回调、协程间关系及协程的取消<br><https://johnnyshieh.me/posts/kotlin-coroutine-integration-and-cancel/>
