---
date_created: Tuesday, May 28th 2017, 12:02:31 am
date_updated: Thursday, January 23rd 2025, 12:12:05 am
title: Kotlin Flow操作符
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
date created: 2024-05-23 09:49
date updated: 2024-12-27 23:44
aliases: [协程之 Flow 操作符]
linter-yaml-title-alias: 协程之 Flow 操作符
---

# 协程之 Flow 操作符

## 过渡流操作符 Intermediate Operations

可以使用操作符转换流，就像使用集合与序列一样。过渡操作符应用于上游流，并返回下游流。这些操作符也是冷操作符，就像流一样。这类操作符本身不是挂起函数。它运行的速度很快，返回新的转换流的定义。

### 转换

#### Transform 转换

- 通用的用了转换每一个 item，可忽略或 emit 多次 item (在使用 transform 操作符时，可以任意多次调用 emit ，这是 transform 跟 map 最大的区别)
- 其他的操作符可通过 transform 来实现，如：`skipOddAndDuplicateEven`

```kotlin
suspend fun testTransform() {
    (1..3).asFlow() // 一个请求流
        .transform { request ->
            emit("Making request $request")
            emit(performRequest(request))
        }
        .collect { response -> println(response) }
}

suspend fun performRequest(request: Int): String {
    delay(1000) // 模仿长时间运行的异步任务
    return "response $request"
}
```

输出：

```
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

#### TransformLatest

#### TransformWhile 截断流

TransformWhile 的返回值是一个 bool 类型，用来控制流的截断，如果返回 true，则流继续执行，如果 false，则流截断。

```kotlin
flow {
    for (i in 0..3) {
        emit(i)
    }
}.transformWhile { value ->
    emit(value)
    value == 1
}.collect {
    Log.d("xys", "Result---$it")
}
```

#### Map

同 RxJava 的 map 操作符

```kotlin
suspend fun test_map() {
    flow {
        for (i in 1..3) {
            delay(100) // 假装我们异步等待了 100 毫秒
            emit(i) // 发射下一个值
        }
    }.map {
        "map $it"
    }.collect {
        println(it)
    }
}
```

输出：

```
map 1
map 2
map 3
```

### 过滤

过滤操作符用于过滤流中的数据

#### Filter[XXX] 过滤（false 就过滤掉）

返回 true 才成功

- Filter

```kotlin
(1..5).asFlow()
    .filter {
        println("Filter $it")
        it % 2 == 0              
    }              
    .map { 
        println("Map $it")
        "string $it"
    }.collect { 
        println("Collect $it")
    }
```

输出：

```
Filter 1
Filter 2
Map 2
Collect string 2
Filter 3
Filter 4
Map 4
Collect string 4
Filter 5
```

其他类似：

- FilterInstance
- FilterNot
- FilterNotNull

#### Drop、dropWhile 丢弃前 n 个数据

带 while 后缀的，则表示按条件进行判断。

#### Take、takeWhile 只取前几个 emit 发射的值

限长过渡操作符（例如 `take`）在流触及相应限制的时候会将它的执行取消。协程中的取消操作总是通过抛出异常来执行，这样所有的资源管理函数（如 `try {…} finally {…}` 块）会在取消的情况下正常运行：

```kotlin
suspend fun testTake() {
    numbers().take(2).collect { println(it) }
}

fun numbers(): Flow<Int> = flow {
    try {
        emit(1)
        emit(2)
        println("This line will not execute")
        emit(3)
    } finally {
        println("Finally in numbers")
    }
}
```

输出：

```
1
2
Finally in numbers
```

#### Debounce

Debounce 操作符用于防抖，指定时间内的值只接收最新的一个。

#### Sample

Sample 操作符与 debounce 操作符有点像，但是却限制了一个周期性时间，sample 操作符获取的是一个周期内的最新的数据，可以理解为 debounce 操作符增加了周期的限制。

##### Debounce 和 sample 区别

它们的区别在于倒计时开始的时间点，sample 倒计时开始的点在时间轴上是固定的，比如每一秒的开始，不管这一秒有没有数据产生，倒计时都会进行。Debounce 开始倒计时的点是每一次数据产生的时候，没有数据就没有倒计时。Debounce 发射数据的那一次倒计时中一定只包含要被发射的那一个数据，而对于 sample，倒计时中可能包含多个数据。

#### DistinctUntilChangedBy

去重操作符，可以按照指定类型的参数进行去重。

### 组合

#### Zip 合并（取最短的那个流）

用于组合两个流中的相关值，多余的部分过滤掉，执行合并后新的 flow 的 item 个数 = 较小的 flow 的 item 个数。；如果有 delay，合并过程中也会等待 delay 执行完后再进行合并。

```kotlin
suspend fun test_zip() {
    val nums = (1..3).asFlow().onEach { delay(300) } // 发射数字 1..3，间隔 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 每 400 毫秒发射一次字符串
    val startTime = System.currentTimeMillis() // 记录开始的时间
    nums.zip(strs) { a, b -> "$a -> $b" } // 使用“zip”组合单个字符串
        .collect { value -> // 收集并打印
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
}
```

输出：

```
1 -> one at 443 ms from start
2 -> two at 844 ms from start
3 -> three at 1248 ms from start
```

> 每次 zip，需要等时间久的 400 ms 才更新；800 ms 更新一次；1200 ms 更新一次。

#### Combine （每次更新的 item 都和其他的 item 合并）

组合两个流，那个流的值更新了，都取两个流最新的值（使用 combine 合并时，每次从 flowA 发出新的 item ，会将其与 flowB 的最新的 item 合并）

```kotlin
suspend fun test_combine() {
    val nums = (1..3).asFlow().onEach { delay(300) } // 发射数字 1..3，间隔 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 每 400 毫秒发射一次字符串
    val startTime = System.currentTimeMillis() // 记录开始的时间
    nums.combine(strs) { a, b -> "$a -> $b" } // 使用“combine”组合单个字符串
        .collect { value -> // 收集并打印
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
}
```

输出：

```kotlin
1 -> one at 441 ms from start
2 -> one at 641 ms from start
2 -> two at 845 ms from start
3 -> two at 945 ms from start
3 -> three at 1249 ms from start
```

> 首次 combine 需要等 400 ms，数据准备好 (1 和 one) 才能合并数据；第 2 次 nums 流准备好了 2，但 strs 的最新值还是 one，所以 2 和 one 组合了；后续类似。

##### CombineTransform

#### Merge 合并多个流

Merge 操作符用于将多个流合并。Merge 的输出结果是按照时间顺序，将多个流依次发射出来。

```kotlin
suspend fun test_merge() {
    val nums = (1..4).asFlow().onEach { delay(300) } // 发射数字 1..3，间隔 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 每 400 毫秒发射一次字符串
    val startTime = System.currentTimeMillis() // 记录开始的时间
    listOf(nums, strs).merge()
        .collect { value -> // 收集并打印
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
}
```

输出：

```
1 at 367 ms from start
one at 461 ms from start
2 at 671 ms from start
two at 866 ms from start
3 at 974 ms from start
three at 1270 ms from start
4 at 1278 ms from start
```

> Merge 的输出结果是按照时间顺序，将多个流依次发射出来；根据 delay 的时间来输出。

### 展平流

#### FlatMapConcat

类似于 RxJava 的 concatMap。FlatMapConcat 由 map、flattenConcat 操作符实现

```kotlin
public fun <T, R> Flow<T>.flatMapConcat(transform: suspend (value: T) -> Flow<R>): Flow<R> =
    map(transform).flattenConcat()
```

案例：

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
    val startTime = System.currentTimeMillis() // 记录开始时间
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒发射一个数字 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // 收集并打印
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
}
```

输出：

```
1: First at 121 ms from start
1: Second at 622 ms from start
2: First at 727 ms from start
2: Second at 1227 ms from start
3: First at 1328 ms from start
3: Second at 1829 ms from start
```

#### FlatMapMerge

FlatMapMerge 由 map、flattenMerge 操作符实现。

```kotlin
public fun <T, R> Flow<T>.flatMapMerge(
    concurrency: Int = DEFAULT_CONCURRENCY,
    transform: suspend (value: T) -> Flow<R>
): Flow<R> =
    map(transform).flattenMerge(concurrency)
```

案例：

```kotlin
suspend fun test_flatMapMerge() {
    (1..5).asFlow()
        .onStart { start = currTime() }
        .onEach { delay(100) }
        .flatMapMerge {
            flow {
                emit("$it: First")
                delay(500)
                emit("$it: Second")
            }
        }
        .collect {
            println("$it at ${System.currentTimeMillis() - start} ms from start")
        }
}
```

输出：

```kotlin
1: First at 118 ms from start
2: First at 216 ms from start
3: First at 317 ms from start
4: First at 418 ms from start
5: First at 527 ms from start
1: Second at 623 ms from start
2: Second at 717 ms from start
3: Second at 818 ms from start
4: Second at 923 ms from start
5: Second at 1029 ms from start
```

#### FlatMapLatest

当发射了新值之后，上个 flow 就会被取消。

```kotlin
suspend fun test_flatMapLatest() {
    (1..5).asFlow()
        .onStart { start = currTime() }
        .onEach { delay(100) }
        .flatMapLatest {
            flow {
                emit("$it: First")
                delay(500)
                emit("$it: Second")
            }
        }
        .collect {
            println("$it at ${System.currentTimeMillis() - start} ms from start")
        }
}
```

输出：

```
1: First at 111 ms from start
2: First at 218 ms from start
3: First at 319 ms from start
4: First at 421 ms from start
5: First at 526 ms from start
5: Second at 1029 ms from start
```

#### FlattenConcat

将给定的 Flow 按顺序合并成一个 Flow，不会交错。和 `flattenMerge(concurrency = 1)` 相等

```kotlin
suspend fun test_flattenConcat() {
    val flowA = (1..5).asFlow().onEach { delay(100) } // 5*100=500ms
    val flowB = flowOf("one", "two", "three", "four", "five").onEach { delay(200) } // 5*200=1000ms
    val t = measureTimeMillis {
        flowOf(flowA, flowB)
            .flattenConcat()
            .collect {
                println("${LocalDateTime.now()} $it")
            }
    }
    println("Done cost:$t ms.")
}
```

输出：

```
2021-11-02T15:22:14.489 1
2021-11-02T15:22:14.591 2
2021-11-02T15:22:14.692 3
2021-11-02T15:22:14.793 4
2021-11-02T15:22:14.896 5
2021-11-02T15:22:15.100 one
2021-11-02T15:22:15.304 two
2021-11-02T15:22:15.505 three
2021-11-02T15:22:15.708 four
2021-11-02T15:22:15.911 five
Done cost:1609 ms.
```

#### FlattenMerge

```kotlin
suspend fun test_flattenMerge() {
    val flowA = (1..5).asFlow().onEach { delay(300) } // 5*300=1500ms
    val flowB = flowOf("one", "two", "three", "four", "five").onEach { delay(200) } // 5*200=1000ms
    val t = measureTimeMillis {
        flowOf(flowA, flowB)
            .flattenMerge()
            .collect {
                println("${LocalDateTime.now()} $it")
            }
    }
    println("Done cost:$t ms.")
}
```

输出：

```
2021-11-02T15:29:24.006 one
2021-11-02T15:29:24.027 1
2021-11-02T15:29:24.135 two
2021-11-02T15:29:24.332 2
2021-11-02T15:29:24.336 three
2021-11-02T15:29:24.540 four
2021-11-02T15:29:24.635 3
2021-11-02T15:29:24.744 five
2021-11-02T15:29:24.938 4
2021-11-02T15:29:25.243 5
Done cost:1574 ms.
```

## 末端流操作符 Terminal Operations

末端操作符是在流上用于启动流收集的挂起函数。

Flow 的 Terminal 运算符可以是 suspend 函数，如 `collect`、`single`、`reduce`、`toList` 等；也可以是非 suspend 的 `launchIn` 运算符，用于在指定 CoroutineScope 内使用 flow

```kotlin
@ExperimentalCoroutinesApi // tentatively stable in 1.3.0
public fun <T> Flow<T>.launchIn(scope: CoroutineScope): Job = scope.launch {
    collect() // tail-call
}
```

### Collect[XXX]

#### Collect 收集

#### CollectIndexed

带下标的 collect，下标是 Flow 中的 emit 顺序。

```kotlin
MainScope().launch {
    val time = measureTimeMillis {
        flow {
            for (i in 0..3) {
                Log.d("xys", "emit value---$i")
                emit(i.toString())
            }
        }.collectIndexed { index, value ->
            Log.d("xys", "Result in $index --- $value")
        }
    }
    Log.d("xys", "Time---$time")
}
```

### CollectLatest 用于在 collect 中取消未来得及处理的数据，只保留当前最新的生产数据

当发射器和收集器都很慢的时候，合并是加快处理速度的一种方式。它通过删除发射值来实现。另一种方式是取消缓慢的收集器，并在每次发射新值的时候重新启动它。有一组与 xxx 操作符执行相同基本逻辑的 xxxLatest 操作符，但是在新值产生的时候取消执行其块中的代码：

```kotlin
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假装我们异步等待了 100 毫秒
        emit(i) // 发射下一个值
    }
}
fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 取消并重新发射最后一个值
                println("Collecting $value") 
                delay(300) // 假装我们花费 300 毫秒来处理它
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
}
```

输出：

```
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
```

> 由于 collectLatest 的函数体需要花费 300 毫秒，但是新值每 100 秒发射一次，我们看到该代码块对每个值运行，但是只收集最后一个值

### Reduce 累计通过 operation

类似于 Kotlin 集合中的 reduce 函数，能够对集合进行计算操作。

```kotlin
public suspend fun <S, T : S> Flow<T>.reduce(operation: suspend (accumulator: S, value: T) -> S): S {
    var accumulator: Any? = NULL

    collect { value ->
        accumulator = if (accumulator !== NULL) {
            @Suppress("UNCHECKED_CAST")
            operation(accumulator as S, value)
        } else {
            value
        }
    }

    if (accumulator === NULL) throw UnsupportedOperationException("Empty flow can't be reduced")
    @Suppress("UNCHECKED_CAST")
    return accumulator as S
}
```

对平方数列求和案例：

```kotlin
suspend fun test_reduce() {
    val sum = (1..5).asFlow()
        .map { it * it } // 数字 1 至 5 的平方
        .reduce { a, b -> a + b } // 求和（末端操作符）
    // 1*1+2*2+3*3+4*4+5*5 = 1+4+9+16+25 = 55
    println(sum) // 55
}
```

计算阶乘：

```kotlin
fun main() = runBlocking {
    val sum = (1..5).asFlow().reduce { a, b -> a * b }
    println(sum)
}
```

### Fold

也类似于 Kotlin 集合中的 fold 函数，fold 也需要设置初始值。

```kotlin
public suspend inline fun <T, R> Flow<T>.fold(
    initial: R,
    crossinline operation: suspend (acc: R, value: T) -> R
): R {
    var accumulator = initial
    collect { value ->
        accumulator = operation(accumulator, value)
    }
    return accumulator
}
```

案例：

```kotlin
fun main() = runBlocking {
    val sum = (1..5).asFlow()
        .map { it * it }
        .fold(0) { a, b -> a + b }
    println(sum)
}
// 初始值为0就类似于使用 reduce 函数实现对平方数列求和。
```

计算阶乘：

```kotlin
fun main() = runBlocking {
    val sum = (1..5).asFlow().fold(1) { a, b -> a * b }
    println(sum)
}
```

### LaunchIn 在指定的协程作用域中直接执行 Flow

```kotlin
flow {
    for (i in 0..3) {
        Log.d("xys", "emit value---$i")
        emit(i.toString())
    }
}.launchIn(MainScope())
```

### 其他末端操作符

#### First/single 获取第一个（first）值与确保流发射单个（single）值的操作符

#### ToList/toSet/toCollection 将 Flow 转换为 Collection、Set 和 List

#### Last、lastOrNull、first、firstOrNull

返回 Flow 的最后一个值（第一个值），区别是 last 为空的话，last 会抛出异常，而 lastOrNull 可空

```kotlin
flow {
    for (i in 0..3) {
        emit(i.toString())
    }
}.last()
```

- Count
- Fold 将流规约到单个值
- LaunchIn/produceIn/broadcastIn

## 线程切换操作符 flowOn

- FlowOn 只能控制上游各操作符执行在哪个线程，控制 collect 执行所在线程
- Collect 在哪个线程取决整个 flow 处于哪个线程下

```kotlin
flow {
    for (i in 1..5) {
        delay(100)
        emit(i)
    }
}.map {
    it * it
}.flowOn(Dispatchers.IO)
    .collect {
        println(it)
    }
```

- Flow builder 和 map 操作符都会受到 flowOn
- Collect () 指定哪个线程，则需要看整个 flow 处于哪个 CoroutineScope 下

**注意：** 不要使用 withContext () 来切换 flow 的线程。

```kotlin
@OptIn(InternalCoroutinesApi::class)
suspend fun test2() {
    flow {
        emit(1) // Ok
//        withContext(Dispatchers.IO) {
//            // Flow invariant is violated: Please refer to 'flow' documentation or use 'flowOn' instead
//            emit(2) // Will fail with ISE
//        }
    }.collect(object : FlowCollector<Int> {
        override suspend fun emit(value: Int) {
            println(value)
        }
    })
}
```
