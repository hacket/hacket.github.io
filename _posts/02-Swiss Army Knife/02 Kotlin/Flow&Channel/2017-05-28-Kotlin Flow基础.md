---
date_created: Tuesday, May 28th 2017, 12:02:31 am
date_updated: Thursday, January 23rd 2025, 12:12:16 am
title: Kotlin Flow基础
author: hacket
categories:
  - Java&Kotlin
category: Kotlin协程
tags: [Flow, Kotlin协程]
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
date created: 2024-03-09 16:26
date updated: 2024-12-27 23:45
aliases: [Flow]
linter-yaml-title-alias: Flow
---

# Flow

## Flow 基础

### 认识 Flow？

![ ](https://cdn.nlark.com/yuque/0/2023/png/694278/1684769691098-312b266d-c427-4499-956e-cfbd2e16dbb8.png#averageHue=%23f4ede3&clientId=uf58e2420-07b0-4&from=paste&id=uc4590694&originHeight=382&originWidth=1427&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0deb0dc8-58dd-4f4e-b658-8a8c7ff2d2c&title=)

### 冷流 & 热流

- 冷流，即下游无消费行为时，上游不会产生数据，只有下游开始消费，上游才从开始产生数据。
- 热流，即无论下游是否有消费行为，上游都会自己产生数据。

### 流构建器

#### flow {} 冷流构建器

```kotlin
@OptIn(InternalCoroutinesApi::class)
suspend fun test1() {
    flow {
        for (i in 1..5) {
            delay(1000)
            emit(i)
        }
    }.collect { println(it) }
}
```

#### flowOf() 发射固定值集的流

```kotlin
suspend fun test3() {
    flowOf(1, 2, 3, 4, 5)
        .onEach {
            delay(1000)
        }
        .collect {
            println(it)
        }
}
```

#### asFlow() 将集合和序列转换为 Flow

```kotlin
suspend fun test4() {
    listOf(1, 2, 3, 4, 5)
        .asFlow()
        .onEach {
            delay(100)
        }.collect {
            println("[${Thread.currentThread().name}] ${LocalDateTime.now()} $it")
        }
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684769730180-5a975e92-a3f2-4481-9bbf-18c9ccb078b2.png#averageHue=%23fefefb&clientId=uf58e2420-07b0-4&from=paste&id=ud7348369&originHeight=194&originWidth=1018&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u07a56de3-05fa-44de-af68-73458e6d03a&title=)

#### channelFlow()

```kotlin
suspend fun test5() {
    channelFlow {
        for (i in 1..5) {
            delay(100)
            send(i)
        }
    }.collect {
        println("[${Thread.currentThread().name}]${LocalDateTime.now()} $it")
    }
}
```

- flow 是 Cold Stream。在没有切换线程的情况下，生产者和消费者是同步非阻塞的。
- channel 是 Hot Stream。而 `channelFlow` 实现了生产者和消费者异步非阻塞模型。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684769751519-2efb38b1-bc8a-4fec-a28c-a43e93607155.png#averageHue=%23fefefc&clientId=uf58e2420-07b0-4&from=paste&id=u1f6bddbc&originHeight=202&originWidth=988&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u59959450-fc48-4c06-b1be-260d09587a6&title=)

### 流取消

如果 flow 是在一个挂起函数内被挂起了，那么 flow 是可以被取消的，否则不能取消。

```kotlin
fun main() = runBlocking {

    withTimeoutOrNull(2500) {
        flow {
            for (i in 1..5) {
                delay(1000)
                emit(i)
            }
        }.collect {
            println(it)
        }
    }

    println("Done")
}
```

输出：

```
1
2
Done
```

## Flow 操作符

见下面的 [[Kotlin Flow操作符]]

## Flow Backpressure 背压

- 背压解决的问题：发送者生成速度比接收者消费速度快
- RxJava 中的背压

```
Backpressure 是响应式编程的功能之一。RxJava2 Flowable 支持的 Backpressure 策略，包括：
- MISSING：创建的 Flowable 没有指定背压策略，不会对通过 OnNext 发射的数据做缓存或丢弃处理。
- ERROR：如果放入 Flowable 的异步缓存池中的数据超限了，则会抛出 MissingBackpressureException 异常。
- BUFFER：Flowable 的异步缓存池同 Observable 的一样，没有固定大小，可以无限制添加数据，不会抛出 MissingBackpressureException 异常，但会导致 OOM。
- DROP：如果 Flowable 的异步缓存池满了，会丢掉将要放入缓存池中的数据。
- LATEST：如果缓存池满了，会丢掉将要放入缓存池中的数据。这一点跟DROP策略一样，不同的是，不管缓存池的状态如何，LATEST 策略会将最后一条数据强行放入缓存池中。
```

Kotlin 协程支持背压。Kotlin 流程设计中的所有函数都标有 suspend 修饰符：具有在不阻塞线程的情况下挂起调用程序执行的强大功能。因此，当流的收集器不堪重负时，它可以简单地挂起发射器，并在准备好接受更多元素时稍后将其恢复。

- 背压解决<br>解决背压 2 种方式：降低发送者生成速度；提升接收者消费速度

### buffer 为 Flow 添加缓存

buffer 没有固定大小，可以无限制添加数据，不会抛出 `MissingBackpressureException` 异常，但可能会导致 OOM（降低发送速度）

对应 RxJava 中的 `BUFFER` 策略；降低发送者速度，将发送的数据存放缓冲区；

```kotlin
fun main() = runBlocking {
    var start = 0L
    val time = measureTimeMillis {
        (1..5)
                .asFlow()
                .onStart { start = System.currentTimeMillis() }
                .onEach {
                    delay(100)
                    println("Emit $it (${System.currentTimeMillis() - start}ms) ")
                }
                .buffer()
                .flowOn(Dispatchers.IO)
                .collect {
                    println("Collect $it starts (${System.currentTimeMillis() - start}ms) ")
                    delay(500)
                    println("Collect $it ends (${System.currentTimeMillis() - start}ms) ")
                }
    }

    println("Cost $time ms")
}
```

输出：

```
Emit 1 (109ms)
Collect 1 starts (115ms)
Emit 2 (219ms)
Emit 3 (324ms)
Emit 4 (426ms)
Emit 5 (531ms)
Collect 1 ends (618ms)
Collect 2 starts (618ms)
Collect 2 ends (1122ms)
Collect 3 starts (1123ms)
Collect 3 ends (1625ms)
Collect 4 starts (1625ms)
Collect 4 ends (2127ms)
Collect 5 starts (2127ms)
Collect 5 ends (2627ms)
Cost 2683 ms
```

> 不过，如果我们只是单纯地添加缓存，而不是从根本上解决问题就始终会造成数据积压。

### conflate 新数据会覆盖老数据

conflate() 如果缓存池满了，新数据会覆盖老数据（提升消费速度）；对应 RxJava 中的 LATEST 策略；当 collect 处理它们太慢的时候，`conflate` 操作符可以用于跳过中间值。

```kotlin
fun main() = runBlocking {
    var start = 0L
    val time = measureTimeMillis {
        (1..5)
                .asFlow()
                .onStart { start = System.currentTimeMillis() }
                .onEach {
                    delay(100)
                    println("Emit $it (${System.currentTimeMillis() - start}ms) ")
                }
                .conflate()
                .flowOn(Dispatchers.IO)
                .collect {
                    println("Collect $it starts (${System.currentTimeMillis() - start}ms) ")
                    delay(500)
                    println("Collect $it ends (${System.currentTimeMillis() - start}ms) ")
                }
    }

    println("Cost $time ms")
}
```

输出：

```
Emit 1 (114ms)
Collect 1 starts (117ms)
Emit 2 (217ms)
Emit 3 (329ms)
Emit 4 (433ms)
Emit 5 (538ms)
Collect 1 ends (620ms)
Collect 5 starts (620ms)
Collect 5 ends (1124ms)
Cost 1171 ms
```

> 虽然第 1 数字仍在处理中，但第 24 数字已经产生，因此 24 是 conflated ，只有最新的 5 被交付给收集器

### collectLatest() 只收集最新的

只处理最新的数据，这看上去似乎与 conflate 没有区别，其实区别大了：它并不会直接用新数据覆盖老数据，而是每一个都会被处理，只不过如果前一个还没被处理完后一个就来了的话，处理前一个数据的逻辑就会被取消。

```kotlin
flow {
    List(100) {
    emit(it)
    }
}.collectLatest { value ->
    println("Collecting $value")
    delay(100)
    println("$value collected")
}
```

输出：

```
Collecting 0
Collecting 1
...
Collecting 97
Collecting 98
Collecting 99
▶ 100ms later
99 collected
```

### onBackpressurureDrop

RxJava 的 contributor：David Karnok， 他写了一个 kotlin-flow-extensions 库，其中包括：FlowOnBackpressureDrop.kt，这个类支持 DROP 策略。

```kotlin
/**
 * Drops items from the upstream when the downstream is not ready to receive them.
 */
@FlowPreview
fun <T> Flow<T>.onBackpressurureDrop() : Flow<T> = FlowOnBackpressureDrop(this)
```

使用这个库的话，可以通过使用 Flow 的扩展函数 `onBackpressurureDrop()` 来支持 DROP 策略。

## Flow 流异常

当运算符中的发射器或代码抛出异常时，流收集可以带有异常的完成。有几种处理异常的方法。

异常分为上游异常 (`flow{}`) 和下游异常 (`collect{}`)

### `try catch` 捕获上游和下游异常

可以捕获上游发射器 (`sample()`) 和下游收集器中 (`collect`) 的异常。

- 案例：下游收集器异常捕获

```kotlin
fun simpleFlow() = flow<Int> {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

@Test
fun `test flow exception`() = runBlocking {
    try {
        simpleFlow().collect { value ->
            println(value)
            check(value <= 1) { "Collected $value" }
        }
    } catch (e: Throwable) {
        println("Caught $e")
    }
}
```

输出：

```
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

- 案例：上游发射器异常捕获

```kotlin
fun simpleFlow1() = flow {
    for (i in 1..3) {
        if (i == 2) {
            throw ArithmeticException("->Emitting Div 0")
        }
        println("->Emitting $i")
        emit(i)
    }
}
try {
    simpleFlow1().collect { value ->
        println(value)
    }
} catch (e: Throwable) {
    println("Caught $e")
}
```

输出：

```
->Emitting 1
1
Caught java.lang.ArithmeticException: ->Emitting Div 0
```

### catch 操作符捕获上游发射器异常

- catch 过渡操作符遵循异常透明性，仅捕获上游异常；发生在 collect 中的异常捕获不了
- 可以使用 catch 代码块中的 emit 将异常转换为值发射出去
- catch 中可以将异常忽略，或用日志打印，或使用一些其他代码处理它
- catch 捕获了异常后，流也终止了
- 案例：catch 捕获上游发射器的异常

```kotlin
fun simpleFlow1() = flow {
    for (i in 1..3) {
        if (i == 2) {
            throw ArithmeticException("->Emitting Div 0")
        }
        println("->Emitting $i")
        emit(i)
    }
}
simpleFlow1().catch { e: Throwable -> println("Caught $e") }
    .flowOn(Dispatchers.IO)
    .collect { println(it) }
```

输出：

```
->Emitting 1
Caught java.lang.ArithmeticException: ->Emitting Div 0
1
```

- 案例：catch 捕获后 emit 一个默认值

```kotlin
fun simpleFlow1() = flow {
    for (i in 1..3) {
        if (i == 2) {
            throw ArithmeticException("->Emitting Div 0")
        }
        println("->Emitting $i")
        emit(i)
    }
}
@Test
fun test() = runBlocking {
    simpleFlow1()
        .catch { e: Throwable ->
            println("Caught $e")
            emit(-1)
        }
        .flowOn(Dispatchers.IO)
        .collect { println(it) }
}
```

输出：

```
->Emitting 1
Caught java.lang.ArithmeticException: ->Emitting Div 0
1
-1
```

- 案例：catch 捕获不了它下面的操作符的异常

catch 操作符下面的捕获不了（catch 只是中间操作符不能捕获下游的异常，类似 collect 内的异常；对于下游的异常，可以多次使用 catch 操作符来解决。）

```kotlin
fun simpleFlow() = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

@Test
fun test1() = runBlocking {
    simpleFlow()
        .catch { e ->
            println("Caught $e")
            emit(-1)
        } // 发射一个异常
        .map {
            if (it == 2) {
                val j = 1 / 0 // 这里的异常捕获不了
            }
            "map $it"
        }
        .collect { println("collect $it") }
}
```

输出：

```
Emitting 1
collect map 1
Emitting 2

/ by zero
java.lang.ArithmeticException: / by zero
```

- 如果想捕获 collect 中的异常，可以将 `collect` 的逻辑移动到 `onEach` 中去，并将其放在 `catch` 操作符之前，调用无参数的 collect 来触发<br>模板代码：

```kotlin
flow {
   // ......
}
.onEach {
    // ......
}
.catch { ... }
.collect()
```

案例：

```kotlin
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    simple()
        .onEach { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
        .catch { e -> println("Caught $e") }
        .collect()
}
```

输出：

```
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

### retry 重试

返回 true 重试，attempt 重试次数，从 0 开始

```kotlin
suspend fun testRetry() {
    (1..5).asFlow().onEach {
        if (it == 3) throw RuntimeException("Error on $it")
    }.retry(2) {
        if (it is RuntimeException) {
            return@retry true
        }
        false
    }.onEach { println("Emitting $it") }
        .catch { it.printStackTrace() }
        .collect()
}
```

输出：

```
Emitting 1
Emitting 2
Emitting 1
Emitting 2
Emitting 1
Emitting 2
java.lang.RuntimeException: Error on 3
```

### retryWhen

retry 操作符最终调用的是 retryWhen 操作符；返回 true 时才会进行重试，attempt 作为参数表示尝试的次数，该次数是从 0 开始的。

```kotlin
// 同上面retry的输出
fun main() = runBlocking {

    (1..5).asFlow().onEach {
        if (it == 3) throw RuntimeException("Error on $it")
    }.retry(2) {
        if (it is RuntimeException) {
            return@retry true
        }
        false
    }
    .onEach { println("Emitting $it") }
    .catch { it.printStackTrace() }
    .collect()
}
```

## Flow 实现多路复用

```kotlin
fun CoroutineScope.getUserFromApi(id: String) = async(Dispatchers.IO) {
    delay(3000L)
    User("delay 3000L, hacket from net $id")
}
fun CoroutineScope.getUserFromLocal(id: String) = async(Dispatchers.IO) {
    delay(1000L)
    User("delay 1000L, hacket from local $id.")
}
fun main(): Unit = runBlocking {
    coroutineScope {
        val login = "123"
        listOf(::getUserFromApi, ::getUserFromLocal) // ... ①
            .map { function ->
                function.call(login) // ... ②
            }
            .map { deferred ->
                flow { emit(deferred.await()) } // ... ③
            }
            .merge() // ... ④
            .onEach { user ->
                println("Result: $user")
            }.launchIn(this)
    }
}
```

输出：

```
Result: User(name=delay 1000L, hacket from local 123.)
Result: User(name=delay 3000L, hacket from net 123)
```

## Flow 生命周期

Flow 生命周期目前只有 `onStart`、`onCompletion` 来监听 Flow 的创建和结束。

### onStart 在上游生产数据前调用

```kotlin
fun main() = runBlocking {

    (1..5).asFlow().onEach {
        if (it == 3) throw RuntimeException("Error on $it")
    }
    .onStart { println("Starting flow") }
    .onEach { println("On each $it") }
    .catch { println("Exception : ${it.message}") }
    .onCompletion { println("Flow completed") }
    .collect()
}
```

### onEach 在上游每次 emit 前调用

### onEmpty 流中未产生任何数据时调用

### Flow 流完成 在流完成或者取消时调用

当流收集完成时（普通情况或异常情况），它可能需要执行一个动作。有两种方式完成：命令式或声明式。

#### `try{}finally{}` 块 命令式

除了 `try/catch` 之外，收集器还能使用 `finally` 块在 `collect` 完成时执行一个动作

```kotlin
suspend fun testFinally() {
    try {
        simple10().collect { println(it) }
    } finally {
        println("Done")
    }
}
fun simple10(): Flow<Int> = (1..3).asFlow()
```

输出：

```
1
2
3
Done
```

#### onCompletion 声明式处理 (完成/异常)

流拥有 `onCompletion` 过渡操作符，它在流完全收集时调用。

- onCompletion 的主要优点是其 lambda 表达式的可空参数 Throwable 可以用于确定流收集是正常完成还是有异常发生

##### 1. onCompletion 未发生异常，正常结束

没有异常时，onCompletion 的参数为 null

```kotlin
suspend fun test_onCompletion() {
    simple10()
        .onCompletion { println("Done") }
        .collect { value -> println(value) }
}
fun simple10(): Flow<Int> = (1..3).asFlow()
```

输出：

```
1
2
3
Done
```

##### 2. onCompletion 收集发射器异常，不处理异常

发生异常时，onCompletion 的参数为异常 Exception 对象

- 案例：onCompletion 在 catch 前面

```kotlin
fun simpleFlow3() = flow<Int> {
    emit(1)
    throw RuntimeException()
}
simpleFlow3()
    .onCompletion { exception ->
        if (exception != null) println("Flow completed exceptionally")
    }
    .catch { exception -> println("Caught $exception") }
    .collect { println(it) }
```

输出：

```
1
Flow completed exceptionally
Caught java.lang.RuntimeException
```

> 先走 onCompletion 再走 catch 逻辑

- 案例：onCompletion 在 catch 后面

```kotlin
fun simpleFlow3() = flow<Int> {
    emit(1)
    throw RuntimeException()
}
simpleFlow3()
    .catch { exception -> println("Caught $exception") }
    .onCompletion { exception ->
        if (exception != null) println("Flow completed exceptionally")
    }
    .collect { println(it) }
```

输出：

```
1
Caught java.lang.RuntimeException
```

> 只走 catch 逻辑，不走 onCompletion 逻辑

- onCompletion 操作符与 catch 不同，它不处理异常

##### 3. 收集 collect 的异常

```kotlin
fun simple(): Flow<Int> = (1..3).asFlow()
fun main() = runBlocking<Unit> {
    simple()
        .onCompletion { cause -> println("Flow completed with $cause") }
        .collect { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
}
```

输出：

```
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

#### onCompleted （借助扩展函数实现，只有完成没有异常）

```kotlin
fun <T> Flow<T>.onCompleted(action: () -> Unit) = flow {
    collect { value -> emit(value) }
    action()
}
```

示例：

```kotlin
fun main() = runBlocking {
    flow {
        for (i in 1..5) {
            delay(100)
            emit(i)
        }
    }.onCompleted { println("Completed...") }
        .collect{println(it)}
}
```

> 假如 Flow 异常结束时，是不会执行 onCompleted() 函数的。

## Flow 监听局部属性

```kotlin
package me.hacket.lib.common.mvi.core

import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import kotlin.reflect.KProperty1
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import me.hacket.lib.common.kt.StateTuple1
import me.hacket.lib.common.kt.StateTuple2
import me.hacket.lib.common.kt.StateTuple3

/**
 * 订阅T的2个属性，T不能被混淆
 */
inline fun <T, A> StateFlow<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    crossinline action: (A) -> Unit
) {
    lifecycleOwner.lifecycleScope.launch {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            this@observeState.map {
                StateTuple1(prop1.get(it))
            }.distinctUntilChanged().collect { (a) ->
                action.invoke(a)
            }
        }
    }
}

/**
 * 订阅T的2个属性，T不能被混淆
 */
fun <T, A, B> StateFlow<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    prop2: KProperty1<T, B>,
    action: (A, B) -> Unit
) {
    lifecycleOwner.lifecycleScope.launch {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            this@observeState.map {
                StateTuple2(prop1.get(it), prop2.get(it))
            }.distinctUntilChanged().collect { (a, b) ->
                action.invoke(a, b)
            }
        }
    }
}

/**
 * 订阅T的3个属性，T不能被混淆
 */
fun <T, A, B, C> StateFlow<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    prop2: KProperty1<T, B>,
    prop3: KProperty1<T, C>,
    action: (A, B, C) -> Unit
) {
    lifecycleOwner.lifecycleScope.launch {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            this@observeState.map {
                StateTuple3(prop1.get(it), prop2.get(it), prop3.get(it))
            }.distinctUntilChanged().collect { (a, b, c) ->
                action.invoke(a, b, c)
            }
        }
    }
}

fun <T> MutableStateFlow<T>.setState(reducer: T.() -> T) {
    this.value = this.value.reducer()
}

inline fun <T, R> withState(state: StateFlow<T>, block: (T) -> R): R {
    return state.value.let(block)
}

suspend fun <T> SharedFlowEffects<T>.setEffects(vararg values: T) {
    val eventList = values.toList()
    this.emit(eventList)
}

fun <T> SharedFlow<List<T>>.observeEffects(lifecycleOwner: LifecycleOwner, action: (T) -> Unit) {
    lifecycleOwner.lifecycleScope.launchWhenStarted {
        this@observeEffect.collect {
            it.forEach { event ->
                action.invoke(event)
            }
        }
    }
}

typealias SharedFlowEffects<T> = MutableSharedFlow<List<T>>

@Suppress("FunctionName")
fun <T> SharedFlowEffects(): SharedFlowEffects<T> {
    return MutableSharedFlow()
}
```

使用：

```kotlin
// 订阅State
data class LoginState(
    val status: LoginStatus = LoginStatus.NotLogin,
    val result: LoginResponse? = null
) : UiState
viewModel.uiState.observeState(
    this,
    LoginContract.LoginState::status,
    LoginContract.LoginState::result
) { status, result ->
    when (status) {
        LoginContract.LoginStatus.NotLogin -> {
            tv_status.gone()
        }
        LoginContract.LoginStatus.ING -> {
            tv_status.gone()
            progress.visible()
        }
        LoginContract.LoginStatus.Success -> {
            progress.gone()
            tv_status.visible().text = "登录成功, ${result?.name}欢迎回来"
        }
    }
}

// 订阅Effects
viewModel.viewEvents.observeEffects(this) {
    when (it) {
        is LoginViewEvent.ShowToast -> toast(it.message)
        is LoginViewEvent.ShowLoadingDialog -> showLoadingDialog()
        is LoginViewEvent.DismissLoadingDialog -> dismissLoadingDialog()
    }
}
```

## Flow 和 Activity/Fragment 生命周期关联

### Flow.flowWithLifecycle 单个 collect

1. 单个 collect 用 `Flow.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED)`，只在 state 达到 STARTED 才会发数据
2. 多个 collection 用 `LifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED)`

```kotlin
class LocationActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Listen to one flow in a lifecycle-aware manner using flowWithLifecycle
        lifecycleScope.launch {
            locationProvider.locationFlow()
                .flowWithLifecycle(lifecycle, Lifecycle.State.STARTED)
                .collect {
                    // New location! Update the map
                }
        }
        
        // Listen to multiple flows
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                // As collect is a suspend function, if you want to collect
                // multiple flows in parallel, you need to do so in 
                // different coroutines
                launch {
                    flow1.collect { /* Do something */ }   
                }
                
                launch {
                    flow2.collect { /* Do something */ }
                }
            }
        }
    }
}
```

- [ ] [A safer way to collect flows from Android UIs](https://medium.com/androiddevelopers/a-safer-way-to-collect-flows-from-android-uis-23080b1f8bda)

## channelFlow

ChannelFlow 的另一个实现 ChannelFlowBuilder，则提供了将回调 API 转化为 Flow 数据流（冷流）的功能。

```kotlin
public fun <T> channelFlow(@BuilderInference block: suspend ProducerScope<T>.() -> Unit): Flow<T> =
    ChannelFlowBuilder(block)
```

�使用 channelFlow 与 callbackFlow 创建数据流时，允许在生产端的使用 withContext 切换协程上下文，默认使用 collect 收集器所在协程的协程调度器。

## callbackFlow 将基于回调的 API 转换为数据流

`callbackFlow` 是一个数据流构建器，允许你将基于回调的 API 转换为数据流。callbackFlow 属于多次回调可以重复触发

```kotlin
public fun <T> callbackFlow(@BuilderInference block: suspend ProducerScope<T>.() -> Unit): Flow<T> = CallbackFlowBuilder(block)
```

> 实际上 CallbackFlowBuilder 就是 ChannelFlowBuilder 的子类，其唯一的区别就是在协程代码块结束时，强制要求调用 close 或挂起函数 awaitClose，用以处理协程结束时的资源回收操作。
> 关闭 Channel 通道，不允许 Channel 继续发送元素。

准确的说是 callbackFlow 的 lambda 函数体执行完之前，必须确保调用 close，停止 Channel 通道发送元素，否则会抛出异常。<br>而调用 awaitClose 后，会一直挂起，不执行后续逻辑，一直等待 Channel 通道关闭，或者收集器所在协程被关闭。更多用于反注册回调 API，等待注册的回调传递数据，避免内存泄漏，否则抛出异常。<br>**send、trySend 和 trySendBlocking：**

- send 需在协程中调用；普通函数，是无法调用 send 的
- trySend send() 的非挂起函数版本的 API，用在没有协程的普通函数中；容量足够大，channel 永远也不会满，actor 消费足够快，用 trySend 即可
- trySendBlocking 阻塞，它会尽可能发送成功。当 Channel 已满的时候，会阻塞等待，直到管道容量空闲以后再返回成功。 不要在挂起函数或协程中调用该函数，仅推荐在普通回调函数内调用。在线程阻塞时，如果线程被结束会抛出 InterruptedException 异常。

**close 和 awaitClose：**

- close callbackFlow 的 lambda 函数体执行完之前，必须确保调用 close，停止 Channel 通道发送元素，否则会抛出异常。
- awaitClose{} 会一直挂起，不执行后续逻辑，一直等待 Channel 通道关闭，或者收集器 collector 所在协程被关闭。关闭后会执行其 lambda 体

### 案例

#### 以文本框输入监听为例

```kotlin
private fun TextView.textWatcherFlow(): Flow<String> = callbackFlow {
    val textWatcher = object : TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {

        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        }

        override fun afterTextChanged(s: Editable?) {
            Log.d("hacket", "afterTextChanged $s ${Thread.currentThread().name}")
            if (s.toString().contains("0")) {
                close(RuntimeException("send 0 to close."))
            } else if (s.toString().contains("-1")) {
                close()
            } else {
                trySend(s.toString())  // 发送值
            }

        }

    }
    addTextChangedListener(textWatcher)
    awaitClose { removeTextChangedListener(textWatcher) }
} // .buffer(Channel.CONFLATED).debounce(300L)
```

使用：

```kotlin
lifecycleScope.launchWhenStarted {
    et_text.textWatcherFlow()
        .debounce(300) // 防抖处理
        flatMapLatest { keyWord ->  // 只对最新的值进行搜索
            flow {
                <String>query(keyWord)
            }
        }.
        .collect {
            toast(it)
            LogUtils.i(it)
        }
}
```

#### 案例

```kotlin
   interface Listener{
        fun listener()
        fun end()
    }
inner class TouchModel{
        private var listener: Listener ?= null
        fun registerListener(sourceListener: Listener){
            listener = sourceListener
        }
        fun unregisterListener(){
            listener = null
        }

        fun emit(){
            listener?.listener()
        }
        fun end(){
            listener?.end()
        }
    }
   @Test
    fun test(){
        val model = TouchModel()
        runBlocking {

            val flow = flowFrom(model)

            flow.onEach {
                println("YM--->流:$it")
            }.launchIn(this)
            delay(1000)
            model.emit()
            delay(1000)
            model.emit()
            delay(1000)
            model.emit()
            delay(1000)
            println("YM--->流即将结束")
            model.end()
            delay(1000)

        }
    }
    //callbackFlow属于多次回调可以重复触发,由于内容不是使用Channel进行通信，所以可以使用Channel的相关函数
    fun flowFrom(model: TouchModel): Flow<Int> = callbackFlow {
        var count = 0
        val callback = object : Listener{
            override fun listener() {
//  为了避免阻塞，channel可以配置缓冲通道，这个暂时不知道怎么处理
//                trySend(count)//这两种方式都行
                    trySendBlocking(count)
                        .onFailure { throwable ->
                            // Downstream has been cancelled or failed, can log here
                        }
                    count++
            }

            override fun end() {
                //当执行结束后可以使用以下方式关闭channel，或者抛出异常，该参数可选，
//                channel.close(IllegalStateException("这个状态不对"))
//                close(IllegalStateException("这个状态不对"))
//                channel.close() 等同于  close()
                println("YM--->Channel关闭")
                close()
            }
        }
        model.registerListener(callback)
        //因为是冷流，所以需要使用awaitClose进行挂起阻塞
        awaitClose {
            //关闭注册
            println("YM--->解除注册")
            model.unregisterListener()
        }
    }

```

## Flow Ref

- **官方文档**
- [ ] flow<br><https://developer.android.com/kotlin/flow>
- [ ] flow 翻译<br>Flow 翻译：<https://book.kotlincn.net/text/flow.html>
- **Kotlin Coroutines Flow 系列**
- [ ] <https://juejin.cn/post/6844904057530908679>

# Flow 应用场景

## 文件下载

```kotlin
object DownloadManager {

    /**
     * 文件下载
     * @url 下载地址
     * @file 本地保存文件
     */
    fun download(url: String, file: File): Flow<DownloadStatus> {
        return flow {
            val request = Request.Builder().url(url).get().build()
            val response = OkHttpClient.Builder().build().newCall(request).execute()
            if (response.isSuccessful) {
                response.body()!!.let { body ->
                    val total = body.contentLength()
                    // 文件读写
                    file.outputStream().use { output ->
                        val input = body.byteStream()
                        var emittedProgress = 0L
                        // 使用对应的扩展函数 ，因为该函数最后参为内联函数，因此需要在后面实现对应业务逻辑
                        input.copyTo(output) { bytesCopied ->
                            // 获取下载进度百分比
                            val progress = bytesCopied * 100 / total
                            // 每下载进度比上次大于5时，通知UI线程
                            if (progress - emittedProgress > 5) {
                                delay(100)
                                // 使用Flow对应的emit 发送对应下载进度通知
                                emit(DownloadStatus.Progress(progress.toInt()))
                                // 记录当前下载进度
                                emittedProgress = progress
                            }
                        }
                    }
                }
                // 发送下载完成通知
                emit(DownloadStatus.Done(file))
            } else {
                throw IOException(response.toString())
            }
        }.catch {
            // 下载失败，删除该文件，并发送失败通知
            file.delete()
            emit(DownloadStatus.Error(it))
        }.flowOn(Dispatchers.IO) // 因为下载文件是属于异步IO操作，因此这里改变上下文
    }
}

inline fun InputStream.copyTo(
    out: OutputStream,
    bufferSize: Int = DEFAULT_BUFFER_SIZE,
    progress: (Long) -> Unit
): Long {
    var bytesCopied: Long = 0
    val buffer = ByteArray(bufferSize)
    var bytes = read(buffer)
    while (bytes >= 0) {
        out.write(buffer, 0, bytes)
        bytesCopied += bytes
        bytes = read(buffer)
        progress(bytesCopied) // 在最后调用内联函数
    }
    return bytesCopied
}

sealed class DownloadStatus {
    object None : DownloadStatus() // 空状态
    data class Progress(val value: Int) : DownloadStatus() // 下载进度
    data class Error(val throwable: Throwable) : DownloadStatus() // 错误
    data class Done(val file: File) : DownloadStatus() // 完成
}
```

## Flow 与 Room

```kotlin
@Dao
interface UserDao {

	//返回插入行 ID 的Insert DAO 方法永远不会返回 -1，因为即使存在冲突，此策略也将始终插入行
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: User)

    @Query("SELECT * FROM user")
    fun getAll(): Flow<List<User>>

}

class UserViewModel(app: Application) : AndroidViewModel(app) {

    fun insert(uid: String, firstName: String, lastName: String) {
        viewModelScope.launch {
            AppDatabase.getInstance(getApplication())
                .userDao()
                .insert(User(uid.toInt(), firstName, lastName))
            Log.d("hqk", "insert user:$uid")
        }
    }

    fun getAll(): Flow<List<User>> {
        return AppDatabase.getInstance(getApplication())
            .userDao()
            .getAll()
            .catch { e -> e.printStackTrace() }
            .flowOn(Dispatchers.IO) //切换上下文为IO异步
    }
}
```

## 搜索框防抖

场景：在搜索框中输入内容，经过一段等待，自动触发搜索，搜索结果以列表形式展现<br>定义：

```kotlin
fun EditText.textChangeFlow(): Flow<Editable> = callbackFlow {
    val watcher = object : TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        }

        override fun afterTextChanged(s: Editable?) {
            // 在文本变化后向流发射数据
            s?.let { offer(it) }
        }
    }
    addTextChangedListener(watcher) // 设置输入框监听器
    awaitClose { removeTextChangedListener(watcher) }
}
```

使用：

```kotlin
lifecycleScope.launchWhenResumed {
    ed_text.textChangeFlow()
        .filter { it.isNotEmpty() } // 过滤空内容，避免无效网络请求
        .debounce(300) // 300ms防抖
        .flatMapLatest { searchFlow(it) } // 新搜索覆盖旧搜索
        .flowOn(Dispatchers.IO) // 让搜索在异步线程中执行
        .onStart {
            tv_status.text = "[${Thread.currentThread().name}]开始搜索 ${curT()} \n"
        }
        .onCompletion {
            tv_status.append("[${Thread.currentThread().name}]搜索结束 ${curT()} \n")
        }
        .onEach { updateUi(it) } // 获取搜索结果并更新界面
        .launchIn(this) // 在主线程收集搜索结果
}

// 访问网络进行搜索
private fun updateUi(it: String) {
    LogUtils.i("[${Thread.currentThread().name}]更新UI $it ${curT()} \n")
    tv_status.append("[${Thread.currentThread().name}]更新UI $it ${curT()} \n")
}

private fun searchFlow(editable: Editable): Flow<String> {
    return flow {
        LogUtils.d("[${Thread.currentThread().name}]模拟开始搜索，关键词$editable  ${curT()}")
        delay(5000)
        LogUtils.w("[${Thread.currentThread().name}]模拟搜索结束，关键词$editable  ${curT()}")
        emit("[这是搜素结果:$editable]")
    }
}
```

## 点击事件防抖

```kotlin
fun <T> Flow<T>.throttleFirst(thresholdMillis: Long): Flow<T> = flow {
    var lastTime = 0L // 上次发射数据的时间
    // 收集数据
    collect { upstream ->
        // 当前时间
        val currentTime = System.currentTimeMillis()
        // 时间差超过阈值则发送数据并记录时间
        if (currentTime - lastTime > thresholdMillis) {
            lastTime = currentTime
            emit(upstream)
        }
    }
}

fun View.clickFlow() = callbackFlow {
    setOnClickListener { offer(Unit) }
    awaitClose {
        setOnClickListener(null)
        LogUtils.w("awaitClose  setOnClickListener(null) ")
    }
}

fun View.clickThrottleFirstFlow(block: (View) -> Unit) = clickFlow()
    .throttleFirst(300)
    .onEach { block.invoke(this) }
```

## 防过度刷新

```kotlin
// 将回调转换成流
fun userInFlow() = callbackFlow {
    val callback = object : UserCallback() {
        override fun onUserIn(uid: String) { offer(uid) }
    }
    setCallback(callback)
    awaitClose { setCallback(null) }
}

// 观众列表限流
userInFlow()
    .sample(1000)
    .onEach { fetchUser(it) }
    .flowOn(Dispatchers.IO)
    .onEach { updateAudienceList() }
    .launchIn(mainScope)
```

## 倒计时

```kotlin
private fun countDownCoroutines(
    total: Int,
    scope: CoroutineScope,
    onFinish: () -> Unit,
    onTick: (Int) -> Unit,
): Job {
    return flow {
        for (i in total downTo 0) {
            LogUtils.logd("hacket", "emit", "value=$i")
            emit(i)
            delay(1000)
        }
    }.flowOn(Dispatchers.Default)
        .onCompletion { onFinish.invoke() }
        .onEach { onTick.invoke(it) }
        .flowOn(Dispatchers.Main)
        .launchIn(scope)
}
```

## Flow 实现多级缓存

- [ ] [GitHub - Andrew0000/Universal-Cache: Kotlin caching and request sharing via Flow. Main idea: don't load data more times than it's needed.](https://github.com/Andrew0000/Universal-Cache)
