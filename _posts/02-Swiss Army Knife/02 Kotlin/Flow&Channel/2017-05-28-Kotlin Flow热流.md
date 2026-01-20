---
date_created: Tuesday, May 28th 2017, 12:02:31 am
date_updated: Thursday, January 23rd 2025, 12:12:28 am
title: Kotlin Flow热流
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
date created: 2024-05-23 09:50
date updated: 2024-12-27 23:45
aliases: [StateFlow 和 SharedFlow]
linter-yaml-title-alias: StateFlow 和 SharedFlow
---

# StateFlow 和 SharedFlow

`StateFlow` 和 `SharedFlow` 是用来替代 `BroadcastChannel` 的新的 API；热流；用于上游发射数据，能同时被多个订阅者收集数据。

> BroadcastChannel 未来会在 `kotlin 1.6.0` 中弃用，在 `kotlin 1.7.0` 中删除。它的替代者是 StateFlow 和 SharedFlow

1. Shared flow 是热流，它是一种广播式的 emit 数据给其所有 subscriber；而 Flow 是冷流，单个 collector 启动来收集流的
2. Shared flow 用于不会 complete，可以 cancel (一般发生在协程作用域取消了)
3. Shared flow 的收集器叫做 subscriber
4. MutableSharedFlow 可以更新值，类似 MutableLiveData
5. Flow 冷流可通过 shareIn 操作符转换为 shared flow

## StateFlow

### StateFlow 概述

StateFlow 是一种特殊的 Flow，它用于持有状态。它总是有一个初始值，并且只会在状态有变化时发射新的值。它是热流（Hot Flow），意味着当有多个收集器时，它们会共享同一个状态，并且只有最新的状态会被发射。适用于表示 UI 状态，因为 UI 总是需要知道当前的状态是什么。

StateFlow 始终处于活跃状态并存于内存中，而且只有在垃圾回收根中未涉及对它的其他引用时，它才符合垃圾回收条件。

可读的 StateFlow，可读可写的 MutableStateFlow。

### 页面状态用 StateFlow

- **状态保留**

StateFlow 自动保持其最新值的状态。这意味着每当有新的 collector 开始 collect 此流时，它会立即接收到最新状态的最新值。这对于 UI 编程尤其重要，因为你通常希望 UI 组件（Activity、Fragment 和 View）能够立即反映当前的状态，即使它们在状态更新后才开始观察状态。

- **去重**

StateFlow 仅在状态发生变化时通知 collector。如果你向 StateFlow 发射一个与当前值相同的值，这个值将不会被重新发射给 collector。这有助于减少不必要的 UI 更新和性能开销，因为你的 UI 组件不会对相同的状态重复渲染。

- **线程安全**

StateFlow 的操作是线程安全的，确保即使在并发环境中，状态的更新和读取也保持一致性。在复杂的应用程序中，可能有多个协程同时尝试更新状态，StateFlow 保证了这种操作的正确性。

为什么页面状态不能用 `SharedFlow` 和 `冷流Flow`？

- **SharedFlow** 虽然 SharedFlow 可以高度自定义，包含配置重播和缓存策略，但它不保证自动保持和重放最新状态，如果使用它，需要手动管理状态的保留和更新，增加了复杂度
- **冷流 Flow** 普通的 Flow，不保持状态，并且每次有新的收集者时，数据的产生逻辑都会从头开始；这使得它不适合作为表示 UI 状态的机制，我们希望即使在数据生产后也能让后来的收集者立即获得最新的状态

### StateFlow 特点及和 LiveData 对比

#### 和 LiveData 对比

StateFlow 与 LiveData 有一些**相同点**：

1. 提供「可读可写」和「仅可读」两个版本（`StateFlow`，`MutableStateFlow`）
2. 它的值是唯一的
3. 它允许被多个观察者共用 （因此是共享的数据流）
4. 它永远只会把最新的值重现给订阅者，这与活跃观察者的数量是无关的
5. 支持 DataBinding
6. 都存在黏性问题

StateFlow 和 LiveData 的**不同点**：

1. **StateFlow 有默认值：** StateFlow 必须配置初始值，StateFlow 没有发送数据时订阅，首次订阅者会先接收默认值；LiveData 不需要
2. **StateFlow 的 value 是 null 安全的：** StateFlow 不允许发送 null 值，而 LiveData 允许传输 null
3. **防抖：** StateFlow 过滤重复值，而 LiveData 不防抖
4. **丰富的操作符：** 使用 StateFlow 意味着我们可以使用丰富的 flow 操作符，如 `map`、`filter` 等；而 LiveData 几乎没有
5. **生命周期管理** 当 View 变为 STOPPED 状态时，`LiveData.observe()` 会自动取消注册使用方；而从 StateFlow 或任何其他数据流收集数据则不会取消注册使用方，需要手动去处理声明周期问题

#### 提供不可变 StateFlow

如果要屏蔽外部发送污染数据，只对外部提供只读属性的 StateFlow，可用 `asStateFlow()` 进行转化

```kotlin
private val _uiState = MutableStateFlow(LatestNewsUiState.Success(emptyList()))
val uiState: StateFlow<LatestNewsUiState> = _uiState
```

#### StateFlow 必须配置初始值

```kotlin
public fun <T> MutableStateFlow(value: T): MutableStateFlow<T> = StateFlowImpl(value ?: NULL)
```

#### StateFlow 的 `emit` 和 `tryEmit`

StateFlow 的 `emit()` 和 `tryEmit()` 方法内部实现是一样的，都是调用 `setValue()` ：

```kotlin
private class StateFlowImpl<T> {
    public override var value: T
        get() = NULL.unbox(_state.value)
        set(value) { updateState(null, value ?: NULL) }
        
    override fun tryEmit(value: T): Boolean {
        this.value = value
        return true
    }

    override suspend fun emit(value: T) {
        this.value = value
    }
}
```

#### StateFlow 默认防抖

StateFlow 默认是防抖的，在更新数据时，会判断当前值与新值是否相同，如果相同则不更新数据：

```kotlin
 private fun updateState(expectedState: Any?, newState: Any): Boolean {
    var curSequence = 0
    var curSlots: Array<StateFlowSlot?>? = this.slots // benign race, we will not use it
    synchronized(this) {
        val oldState = _state.value
        if (expectedState != null && oldState != expectedState) return false // CAS support
        if (oldState == newState) return true // Don't do anything if value is not changing, but CAS -> true // 防抖
        _state.value = newState
        curSequence = sequence
        if (curSequence and 1 == 0) { // even sequence means quiescent state flow (no ongoing update)
            curSequence++ // make it odd
            sequence = curSequence
        } else {
            // update is already in process, notify it, and return
            sequence = curSequence + 2 // change sequence to notify, keep it odd
            return true // updated
        }
        curSlots = slots // read current reference to collectors under lock
    }
    // ...
}
```

### 示例

#### 错误示例：多个 collect 在同一个协程

多个 collector 在同一个协程中先后 `collect()`，前面的会阻塞后的

```kotlin
lifecycleScope.launch {
	testViewModel.countState.collect { // 1 在协程被取消前会一直挂起，这样后面的代码便不会执行
	}
	testViewModel.countState.collect { // 2
	}
}
```

看 `StateFlowImpl的collect()` 实现：

```kotlin
private class StateFlowImpl<T>(  
    initialState: Any // T | NULL  
) : AbstractSharedFlow<StateFlowSlot>(), MutableStateFlow<T>, CancellableFlow<T>, FusibleFlow<T> {
	// ...
	override suspend fun collect(collector: FlowCollector<T>): Nothing {
		val slot = allocateSlot()  
		try {  
		    if (collector is SubscribedFlowCollector) collector.onSubscription()  
		    val collectorJob = currentCoroutineContext()[Job]  
		    var oldState: Any? = null // previously emitted T!! | NULL (null -- nothing emitted yet)  
		    // The loop is arranged so that it starts delivering current value without waiting first    
		    while (true) {  
		        // Here the coroutine could have waited for a while to be dispatched,  
		        // so we use the most recent state here to ensure the best possible conflation of stale values        
		        val newState = _state.value  
		        // always check for cancellation  
		        collectorJob?.ensureActive()  
		        // Conflate value emissions using equality  
		        if (oldState == null || oldState != newState) {  
		            collector.emit(NULL.unbox(newState))  
		            oldState = newState  
		        }  
		        // Note: if awaitPending is cancelled, then it bails out of this loop and calls freeSlot  
		        if (!slot.takePending()) { // try fast-path without suspending first  
		            slot.awaitPending() // only suspend for new values when needed  
		        }  
		    } 
		} finally {  
		    freeSlot(slot)  
		}
	}
}
```

`collect` 里是一个死循环

#### StateFlow 简单示例

```kotlin
private val _countState = MutableStateFlow(0)

val countState: StateFlow<Int> = _countState

fun incrementCount() {
    _countState.value++
}

fun decrementCount() {
    _countState.value--
}
```

#### StateFlow 多个收集者，对外暴露不可变

**方式 1：对外不可变：多一个变量，返回 StateFlow 包裹下 MutableStateFlow**

```kotlin
class FlowTestViewModel : ViewModel() {
    private val _countState =
        MutableStateFlow(0)
    val countState: StateFlow<Int> = _countState

    fun incrementCount(): Int {
        _countState.value++
        return countState.value
    }
    fun decrementCount() {
        _countState.value--
    }
}
// 使用
// 收集者1
lifecycleScope.launch {
	testViewModel.countState.collect {  
		// ...
	}
}
// 收集者2
lifecycleScope.launch {
	testViewModel.countState.collect {  
		// ...
	}
}
```

**方式 2：StateFlow.asStateFlow()**

```kotlin
private val _countState = MutableStateFlow(0)
_countState.asStateFlow()
```

## SharedFlow

### SharedFlow 概述

SharedFlow 也是一种热流，能够向多个收集器广播事件。它提供了更灵活的配置，比如可以配置重播 (`replay`) 的值的数量，以及在没有收集器的情况下保留值的能力。适用于一次性事件、消息广播等场景。

`StateFlow` 可以通过 `shareIn` 操作符来将冷数据流（`flow{}` 构造器创建的流）转换成热数据流 `SharedFlow`。

### 和 StateFlow 对比

与 SateFlow 一样，SharedFlow 也有两个版本：`SharedFlow` 与 `MutableSharedFlow`。

1. MutableSharedFlow 没有起始值
2. SharedFlow 可以保留历史数据，replay 控制，默认为 0
3. MutableSharedFlow 发射值需要调用 `emit()/tryEmit()` 方法，没有 `setValue()` 方法
4. SateFlow 只保留最新数据；SharedFlow 根据配置可以保留历史数据，默认不保留历史数据
5. 状态（State）用 StateFlow ；事件（Event）用 SharedFlow

### MutableStateFlow 构造方法

```kotlin
public interface MutableSharedFlow<T> : SharedFlow<T>, FlowCollector<T> {
    // 线程安全的挂起函数发送数据
    override suspend fun emit(value: T)
    // 线程安全的尝试发送数据
    public fun tryEmit(value: T): Boolean
    // 共享数据流的订阅者数量
    public val subscriptionCount: StateFlow<Int>
    // 重置历史数据缓存
    public fun resetReplayCache()
}
public fun <T> MutableSharedFlow(
    replay: Int = 0, // 缓存的历史数据容量
    extraBufferCapacity: Int = 0, // 除历史数据外的额外缓冲区容量
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND // 背压策略
)
```

- **replay** 历史元素缓存区容量；历史缓冲区满，则移除最早的元素。新消费者订阅了该数据流，先将历史缓存区元素依次发送给新的消费者，然后才发送新元素。新的订阅者订阅时发送历史数据数量；默认为 0 即不发送，那就不存在黏性问题了；replay=1 那就和 StateFlow 一样了
- **extraBufferCapacity** 除历史缓存区外的额外缓存区容量，用于扩充内部整体缓存容量
- **onBufferOverflow** 缓存区背压策略；默认是 `BufferOverflow.SUSPEND`，当额外缓冲区满后，挂起 emit 函数，暂停发送数据。只有在 replay 和 extraBufferCapacity 某一个不为 0 时才支持其他背压策略。
  1. BufferOverflow. SUSPEND 默认，当 collect 收集不过来时，buffer 满了，会 suspend；对 replay 和 extraBufferCapacity 取值没有要求
  2. BufferOverflow. DROP_OLDEST 从 buffer 中丢弃最老的，不会 suspend; 需 replay>0 或 extraBufferCapacity>0；
  3. BufferOverflow. DROP_LATEST 从 buffer 中丢弃最新的 (未被 collect 时保留一样的缓存)，不会 suspend；需 replay>0 或 extraBufferCapacity>0；

> Buffer overflow 发生的条件是至少有一个订阅者且没有准备好接收处理新的数据；如果没有订阅者，只有最近 replay 数量的值会被存储且 buffer overflow 行为不会生效

MutableStateFlow 不同，MutableSharedFlow 构造器中是不需要默认值的，这意味着 MutableSharedFlow 没有默认值：

```kotlin
val mySharedFlow = MutableSharedFlow<Int>()
val myStateFlow = MutableStateFlow<Int>(0)
// ...
mySharedFlow.emit(1)
myStateFlow.emit(1)
```

SharedFlow 不会有「粘性事件」的问题，MutableSharedFlow 构造函数里有一个 replay 的参数，它代表着可以对新订阅者重新发送多个之前已发出的值，默认值为 0。

SharedFlow 在其 `replayCache` 中保留特定数量的最新值。每个新订阅者首先从 replayCache 中取值，然后获取新发射的值。ReplayCache 的最大容量是在创建 SharedFlow 时通过 replay 参数指定的。ReplayCache 可以使用 `MutableSharedFlow.resetReplayCache` 方法重置。

当 replay 为 0 时，replayCache size 为 0，新的订阅者获取不到之前的数据，因此不存在「粘性事件」的问题。

StateFlow 的 replayCache 始终有当前最新的数据：

```kotlin
private class StateFlowImpl {
    override val replayCache: List<T>
        get() = listOf(value)
}
```

示例 MutableSharedFlow：

```kotlin
fun testFlow() = runBlocking {
    val sharedFlow = MutableSharedFlow<String>(replay = 1)
    launch(Dispatchers.IO) {
        for (i in 0..5) {
            sharedFlow.emit("data$i")
            delay(50)
        }
    }

    // 模拟外部调用
    delay(110)
    val readOnlySharedFlow = sharedFlow.asSharedFlow()
    launch(Dispatchers.IO) {
        readOnlySharedFlow.map {
            "【collect0】$it receiver AAA"
        }.collect {
            println(it)
        }
    }
    delay(50)

    launch(Dispatchers.IO) {
        readOnlySharedFlow.map {
            "【collect1】$it receiver BBB"
        }.collect {
            println(it)
        }
    }
}
```

输出：

```
【collect0】data2 receiver AAA
【collect0】data3 receiver AAA
【collect1】data3 receiver BBB
【collect0】data4 receiver AAA
【collect1】data4 receiver BBB
【collect0】data5 receiver AAA
【collect1】data5 receiver BBB
```

> 可以看到 collect 0 从第 3 个数据开始收集，前面 2 个数据发射时还未 collect，所以就没收集到；collect 1 从第 4 个开始收集。

### 示例

#### SharedFlow 模拟 StateFlow

#### SharedFlow 模拟 Channel

#### MutableSharedFlow overflow 示例

1. MutableSharedFlow `replay=3, extraBufferCapacity=4, onBufferOverflow = BufferOverflow.SUSPEND` 示例：

```kotlin
class SharedFlowTest {
    private val _state = MutableSharedFlow<Int>(
        replay = 3,
        extraBufferCapacity = 4,
        onBufferOverflow = BufferOverflow.SUSPEND
    )
    val state: SharedFlow<Int> get() = _state
    fun getApi(scope: CoroutineScope) {
        scope.launch {
            for (i in 0..100) {
                delay(200)
                _state.emit(i)
                val count = _state.subscriptionCount
                println("send data: $i , subscriptionCount=${count.value}, replayCache=${_state.replayCache}")
            }
        }
    }
}
fun main(): Unit = runBlocking {
    val test = SharedFlowTest()
    test.getApi(this) // 开始获取结果
    launch(Dispatchers.IO) {
        delay(3000)
        test.state.collect {
            delay(3000)
            println("---collect1: $it")
        }
    }
}
```

输出：

```
send data: 0 , subscriptionCount=0, replayCache=[0]
send data: 1 , subscriptionCount=0, replayCache=[0, 1]
send data: 2 , subscriptionCount=0, replayCache=[0, 1, 2]
send data: 3 , subscriptionCount=0, replayCache=[1, 2, 3]
send data: 4 , subscriptionCount=0, replayCache=[2, 3, 4]
send data: 5 , subscriptionCount=0, replayCache=[3, 4, 5]
send data: 6 , subscriptionCount=0, replayCache=[4, 5, 6]
send data: 7 , subscriptionCount=0, replayCache=[5, 6, 7]
send data: 8 , subscriptionCount=0, replayCache=[6, 7, 8]
send data: 9 , subscriptionCount=0, replayCache=[7, 8, 9]
send data: 10 , subscriptionCount=0, replayCache=[8, 9, 10]
send data: 11 , subscriptionCount=0, replayCache=[9, 10, 11]
send data: 12 , subscriptionCount=0, replayCache=[10, 11, 12]
send data: 13 , subscriptionCount=0, replayCache=[11, 12, 13]
send data: 14 , subscriptionCount=1, replayCache=[12, 13, 14]
send data: 15 , subscriptionCount=1, replayCache=[13, 14, 15]
send data: 16 , subscriptionCount=1, replayCache=[14, 15, 16]
send data: 17 , subscriptionCount=1, replayCache=[15, 16, 17]
send data: 18 , subscriptionCount=1, replayCache=[16, 17, 18]
---collect1: 11
send data: 19 , subscriptionCount=1, replayCache=[17, 18, 19]
---collect1: 12
send data: 20 , subscriptionCount=1, replayCache=[18, 19, 20]
---collect1: 13
send data: 21 , subscriptionCount=1, replayCache=[19, 20, 21]
```

> 没有 collector 时，overflow 不生效，所以上游不停发射数据；当有一个 collector 时，触发了 overflow=BufferOverflow. SUSPEND，即挂起了 emit 数据

2. `replay=3, extraBufferCapacity=4, onBufferOverflow = BufferOverflow.DROP_OLDEST`

```kotlin
private val _state = MutableSharedFlow<Int>(
    replay = 3,
    extraBufferCapacity = 4,
    onBufferOverflow = BufferOverflow.DROP_OLDEST
)
```

输出：

```
send data: 0 , subscriptionCount=0, replayCache=[0]
//...
send data: 27 , subscriptionCount=1, replayCache=[25, 26, 27]
send data: 28 , subscriptionCount=1, replayCache=[26, 27, 28]
---collect1: 11
send data: 29 , subscriptionCount=1, replayCache=[27, 28, 29]
send data: 30 , subscriptionCount=1, replayCache=[28, 29, 30]
// ...
send data: 42 , subscriptionCount=1, replayCache=[40, 41, 42]
send data: 43 , subscriptionCount=1, replayCache=[41, 42, 43]
---collect1: 22
send data: 44 , subscriptionCount=1, replayCache=[42, 43, 44]
send data: 45 , subscriptionCount=1, replayCache=[43, 44, 45]
// ...
send data: 57 , subscriptionCount=1, replayCache=[55, 56, 57]
send data: 58 , subscriptionCount=1, replayCache=[56, 57, 58]
---collect1: 37
send data: 59 , subscriptionCount=1, replayCache=[57, 58, 59]
send data: 60 , subscriptionCount=1, replayCache=[58, 59, 60]
// ...
send data: 72 , subscriptionCount=1, replayCache=[70, 71, 72]
send data: 73 , subscriptionCount=1, replayCache=[71, 72, 73]
---collect1: 52
send data: 74 , subscriptionCount=1, replayCache=[72, 73, 74]
send data: 75 , subscriptionCount=1, replayCache=[73, 74, 75]
// ...
send data: 86 , subscriptionCount=1, replayCache=[84, 85, 86]
send data: 87 , subscriptionCount=1, replayCache=[85, 86, 87]
---collect1: 67
send data: 88 , subscriptionCount=1, replayCache=[86, 87, 88]
send data: 89 , subscriptionCount=1, replayCache=[87, 88, 89]
// ...
send data: 99 , subscriptionCount=1, replayCache=[97, 98, 99]
send data: 100 , subscriptionCount=1, replayCache=[98, 99, 100]
---collect1: 81
---collect1: 94
---collect1: 95
---collect1: 96
---collect1: 97
---collect1: 98
---collect1: 99
---collect1: 100
```

> 没有 collector 时，overflow 不生效，所以上游不停发射数据；当有一个 collector 时，触发了 overflow=BufferOverflow. DROP_OLDEST，即丢弃最老的数据，buffer 保存的是最新的 replay+extraBufferCapacity=7 条数据

3. `replay=3, extraBufferCapacity=4, onBufferOverflow = BufferOverflow.DROP_LATEST`

```kotlin
private val _state = MutableSharedFlow<Int>(
    replay = 3,
    extraBufferCapacity = 4,
    onBufferOverflow = BufferOverflow.DROP_LATEST
)
```

输出：

```
send data: 0 , subscriptionCount=0, replayCache=[0]
send data: 1 , subscriptionCount=0, replayCache=[0, 1]
send data: 2 , subscriptionCount=0, replayCache=[0, 1, 2]
send data: 3 , subscriptionCount=0, replayCache=[1, 2, 3]
// ...
send data: 27 , subscriptionCount=1, replayCache=[16, 17, 18]
send data: 28 , subscriptionCount=1, replayCache=[16, 17, 18]
---collect1: 11
send data: 29 , subscriptionCount=1, replayCache=[17, 18, 29]
send data: 30 , subscriptionCount=1, replayCache=[17, 18, 29]
// ...
send data: 42 , subscriptionCount=1, replayCache=[17, 18, 29]
send data: 43 , subscriptionCount=1, replayCache=[17, 18, 29]
---collect1: 12
send data: 44 , subscriptionCount=1, replayCache=[18, 29, 44]
send data: 45 , subscriptionCount=1, replayCache=[18, 29, 44]
// ...
send data: 57 , subscriptionCount=1, replayCache=[18, 29, 44]
send data: 58 , subscriptionCount=1, replayCache=[18, 29, 44]
---collect1: 13
send data: 59 , subscriptionCount=1, replayCache=[29, 44, 59]
send data: 60 , subscriptionCount=1, replayCache=[29, 44, 59]
// ...
send data: 72 , subscriptionCount=1, replayCache=[29, 44, 59]
send data: 73 , subscriptionCount=1, replayCache=[29, 44, 59]
---collect1: 14
send data: 74 , subscriptionCount=1, replayCache=[44, 59, 74]
send data: 75 , subscriptionCount=1, replayCache=[44, 59, 74]
// ...
send data: 86 , subscriptionCount=1, replayCache=[44, 59, 74]
send data: 87 , subscriptionCount=1, replayCache=[44, 59, 74]
---collect1: 15
send data: 88 , subscriptionCount=1, replayCache=[59, 74, 88]
send data: 89 , subscriptionCount=1, replayCache=[59, 74, 88]
// ...
send data: 99 , subscriptionCount=1, replayCache=[59, 74, 88]
send data: 100 , subscriptionCount=1, replayCache=[59, 74, 88]
---collect1: 16
---collect1: 17
---collect1: 18
---collect1: 29
---collect1: 44
---collect1: 59
---collect1: 74
---collect1: 88
```

> 没有 collector 时，overflow 不生效，所以上游不停发射数据；当有一个 collector 时，触发了 overflow=BufferOverflow. DROP_LATEST，即丢弃最新的数据，buffer 保存的是丢弃了最新的 replay+extraBufferCapacity=7 条数据

## StateFlow、SharedFlow 和 Channel

### stateIn 和 shareIn

Flow. ShareIn 与 Flow. StateIn 操作符可以将冷流转换为热流: 它们可以将来自上游冷数据流的信息广播给多个收集者。这两个操作符通常用于提升性能: 在没有收集者时加入缓冲；或者干脆作为一种缓存机制使用。

#### `stateIn()` 转换为 StateFlow，缓存最新值

`stateIn` 能够将普通的流转换为 StateFlow，其必须要设置默认值，且转换的共享数据流只缓存一个最新值。

```kotlin
public suspend fun <T> Flow<T>.stateIn(scope: CoroutineScope): StateFlow<T> {
    val config = configureSharing(1)	//配置共享流只缓存一个值
    val result = CompletableDeferred<StateFlow<T>>() //创建新实例
    scope.launchSharingDeferred(config.context, config.upstream, result)
    return result.await()
}

public fun <T> Flow<T>.stateIn(
    scope: CoroutineScope,
    started: SharingStarted,
    initialValue: T
): StateFlow<T> {
    val config = configureSharing(1)
    val state = MutableStateFlow(initialValue)
    val job = scope.launchSharing(config.context, config.upstream, state, started, initialValue)
    return ReadonlyStateFlow(state, job)
}
```

- Scope 共享开始时所在的协程作用域范围
- Started 控制共享的开始和结束的策略
  1. Lazily 当首个订阅者出现时开始，后续消费者只能收到历史缓存与后续数据。在 scope 指定的作用域被结束时终止。
  2. Eagerly 立即开始发送数据，后续消费者只能收到历史缓存与新数据。在 scope 指定的作用域被结束时终止。
  3. WhileSubscribed 等待第一个消费者订阅后，才开始发送数据源。可配置在最后一个订阅者关闭后，共享数据流上游停止时间与历史缓存清空时间
- InitialValue 状态流初始值

示例：

```kotlin
fun main() {
    runBlocking {
        val flow= flow {
            List(10) {
                emit(it)
            }
        }.stateIn(this)
        launch(Dispatchers.IO) {
            flow.collect {
                println("result $it")
            }
        }
    }
    Thread.sleep(2000)
}
```

输出：最后一个值 9

```
result 9
```

#### `shareIn()` 转换为 SharedFlow，缓存 `replay` 数量的值，默认 0

`普通的flow` 可以使用 `shareIn()` 扩展方法，转化成 `SharedFlow`

```kotlin
public fun <T> Flow<T>.shareIn(
    scope: CoroutineScope,
    started: SharingStarted,
    replay: Int = 0
): SharedFlow<T> {
    // 配置共享流
    val config = configureSharing(replay)
    val shared = MutableSharedFlow<T>(
        replay = replay,
        extraBufferCapacity = config.extraBufferCapacity,
        onBufferOverflow = config.onBufferOverflow
    )
    // 在给定的协程作用域以给定配置启动协程
    @Suppress("UNCHECKED_CAST")
    val job = scope.launchSharing(config.context, config.upstream, shared, started, NO_VALUE as T)
    return ReadonlySharedFlow(shared, job)
}
```

- Scope 协程作用域
- Started 新创建的共享数据流的启动与停止策略
  1. Lazily 当首个订阅者出现时开始，后续消费者只能收到历史缓存与后续数据。在 scope 指定的作用域被结束时终止
  2. Eagerly 立即开始发送数据，后续消费者只能收到历史缓存与新数据。在 scope 指定的作用域被结束时终止。
  3. WhileSubscribed 等待第一个消费者订阅后，才开始发送数据源。可配置在最后一个订阅者关闭后，共享数据流上游停止时间（默认立即停止）与历史缓存清空时间（默认永远保留）

```kotlin
public fun WhileSubscribed(
    stopTimeoutMillis: Long = 0,
    replayExpirationMillis: Long = Long.MAX_VALUE
)
```

- Replay 订阅时发送的历史记录

shareIn 可将消耗一次资源从数据源获取数据的 Flow 数据流，转化为 SharedFlow，实现一对多的事件分发，减少多次调用资源的损耗。<br>使用 shareIn 每次会创建一个新的 SharedFlow 实例，且该实例会一直保留在内存中，直到垃圾回收。故最好减少转换流执行次数。

## Flow 与 RxJava

```kotlin
Flow = (cold) Flowable / Observable / Single

Channel = Subjects

StateFlow = BehaviorSubjects (永远有值)

SharedFlow = PublishSubjects (无初始值)

suspend function = Single / Maybe / Completable
```

## 注意

### Flow 的 collect 方法不能写在同一个 lifecycleScope 中

```kotlin
lifecycleScope.launch {
    viewModel.countState.collect { // 1 在协程被取消前会一直挂起，这样后面的代码便不会执行
    }
    viewModel.countState.collect { // 2
    }
}
```
