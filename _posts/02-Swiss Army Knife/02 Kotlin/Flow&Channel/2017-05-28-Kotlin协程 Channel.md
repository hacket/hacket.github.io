---
date_created: Tuesday, May 28th 2017, 12:02:31 am
date_updated: Thursday, January 23rd 2025, 12:12:58 am
title: Kotlin协程 Channel
author: hacket
categories:
  - Java&Kotlin
category: Kotlin协程
tags: [Channel, Flow, Kotlin协程]
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
date created: 2024-03-29 00:04
date updated: 2024-12-27 23:44
aliases: [协程之 Channel]
linter-yaml-title-alias: 协程之 Channel
---

# 协程之 Channel

`Deferred` 提供了单个值在不同协程之间传输；`Channels` 提供了一连串值在不同协程之间传输。

## 什么是 Channel？

`Channel` 翻译过来为通道或者管道，实际上就是个**队列**, 是一个面向多协程之间数据传输的 `BlockQueue`，用于协程间通信。`Channel` 允许我们在不同的协程间传递数据。形象点说就是不同的协程可以往同一个管道里面写入数据或者读取数据。它是一个和 `BlockingQueue` 非常相似的概念。

区别在于：`BlockingQueue` 使用 `put` 和 `take` 往队列里面写入和读取数据，这两个方法是阻塞的。而 `Channel` 使用 `send` 和 `receive` 两个方法往管道里面写入和读取数据。这两个方法是非阻塞的挂起函数，鉴于此，`Channel` 的 `send` 和 `receive` 方法也只能在协程中使用。

`Channel` 是 `communication primitives` 允许两个不同的 coroutine 之间通信。一个协程发送数据到 Channel，另一个协程从 Channel 取数据。<br>![](https://play.kotlinlang.org/resources/hands-on/Introduction%20to%20Coroutines%20and%20Channels/assets/8-channels/UsingChannel.png#id=Yqwou&originHeight=238&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

发送数据的协程叫生产者，接收数据的协程叫消费者；多个生产者可以往同一个 Channel 发送数据，多个消费者可以从同一个 Channel 取数据。

![](https://play.kotlinlang.org/resources/hands-on/Introduction%20to%20Coroutines%20and%20Channels/assets/8-channels/UsingChannelManyCoroutines.png#id=OmxFf&originHeight=463&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

多个协程从 Channel 接收数据，每个元素只能被一个消费者消费；消费者消费后从 Channel 将该数据移除了。

生产者可以关闭 Channel。

### Channel 特性

1. **数据传输**：Channel 提供了一种协程间数据流动的方式。你可以把它想象成一条管道，其中一端的协程可以发送数据，而另一端的协程可以接收数据。
2. **挂起函数**：不同于 BlockingQueue 使用锁和阻塞操作来实现同步，Channel 使用挂起函数如 `send` 和 `receive` 来发送和接收数据，消除了线程阻塞的需要。
3. **安全性**：Channel 为协程间传递数据提供了线程安全的方式。不用担心并发环境下的数据竞态问题。
4. **缓冲**：Channel 可以有一个缓冲区来存储已发送但尚未接收的数据。根据定义不同的 Channel 类型（如 RendezvousChannel、BufferedChannel 等），这个缓冲区的行为会有所不同。
5. **关闭操作**：Channel 可以关闭，表明没有更多的元素会被发送。这对结束数据传输非常有用。
6. **Flow 互操作性**：Channel 可以与 Flow 协同工作，Flow 基于 Channel 提供了冷流（cold stream）的抽象，供反应式编程使用。

## Channel 基本使用

- 创建 Channel 指定类型和 buffer 大小，默认创建 `Rendezvous Channel`

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

### Channel 的简单使用

```kotlin
@Test
fun `test know channel`() = runBlocking%3CUnit%3E {
	val channel = Channel<Int>()
	//生产者
	val producer = GlobalScope.launch {
		var i = 0
		while (true) {
			delay(1000)
			channel.send(++i)
			println("send $i")
		}
	}

	//消费者
	val consumer = GlobalScope.launch {
		while (true) {
			val element = channel.receive()
			println("receive $element")
		}
	}
	joinAll(producer, consumer)
}
```

输出：

```
receive 1
send 1
send 2
receive 2
....略
send 999
receive 999
```

### Channel 的创建和使用

**创建 Channel 的 2 种方式：**

- 一种是使用顶层函数：`Channel()`，它接受一个可选的参数 capacity，表示 Channel 的容量，默认是 0，表示无缓冲的 Channel
- 另一种是使用协程构建器 `produce{}`，它返回一个 `ReceiveChannel`，表示只能从中接收数据的 Channel，使用 `produce{}` 可以方便地创建一个生产者协程，它可以在代码块中使用 `send()` 函数向 Channel 发送数据

**使用 Channel 的 2 种方式：**

- 一种是使用 `send()` 和 `receive()` 函数，它们分别用于向 Channel 发送数据和从 Channel 接收数据
- 另一种是使用 `for循环` 或者 `consumeEach{}` 函数，它们分别用于遍历 Channel 中的数据，使用 `for循环` 或 `consumeEach{}` 可以方便地创建一个消费者协程，它可以在代码块中处理 Channel 中的数据

#### `Channel()` 函数

**示例：**

```kotlin
fun test() {
    val channel = Channel<Int>()
    runBlocking {
        launch {
//            for (x in 1..5) channel.send(x)
//            channel.close() // Exception in thread "main" kotlinx.coroutines.channels.ClosedReceiveChannelException: Channel was closed
            if (!channel.isClosedForSend) {
                for (x in 1..5) channel.send(x)
                channel.close() //channel关闭后就不能send
            }
        }
        launch {
            delay(1000)
            if (!channel.isClosedForSend) {
                // close后进不来
                channel.send(6666)
                channel.send(9999)
            }
        }
        while (!channel.isClosedForReceive) {
            println("receive :${channel.receive()}")
            channel.receiveCatching().getOrNull()
        }
        println("done")
    }
}
```

输出：

```
receive :1
receive :3
receive :5
done
```

#### `receive` 和 `receiveCatching`

1. receive:
   - `receive()` 用于从 Channel 中接收一个元素。如果 Channel 为空，调用者将会被挂起直到 Channel 中有可用的数据。
   - 如果 Channel 被关闭并且没有更多的元素可以接收，`receive()` 将会抛出一个 `ClosedReceiveChannelException` 异常。

2. receiveCatching:
   - `receiveCatching()` 与 `receive()` 类似，它也用于接收 Channel 中的元素，但在处理关闭的 Channel 和异常情况时更加灵活。
   - 调用后返回一个 `ChannelResult` 对象，这是一个封装了接收操作结果（成功或异常）的密封类。
   - 使用 `receiveCatching()`，你可以通过检查 `ChannelResult` 类型来确定接收操作是正常接收到值，还是 Channel 已经关闭等情况，而无需捕获异常。

**示例：**

```kotlin
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val channel = Channel<Int>()

    launch {
        val value = try {
            channel.receive() // 可能会抛出异常
        } catch (e: ClosedReceiveChannelException) {
            // 处理关闭通道异常
            -1
        }
        println("Received: $value")
    }

    launch {
        val result = channel.receiveCatching() // 不抛出异常，返回 ChannelResult
        result.onSuccess { value ->
            println("Received: $value")
        }.onClosed { cause ->
            // 处理通道关闭情况，cause 可能为关闭通道的原因
            println("Channel was closed")
        }
    }
    channel.send(1)
    channel.close() // 关闭通道
}
```

#### `produce` 和 `actor`

在协程外部定义 Channel，多个协程同时访问 Channel, 就可以实现生产者消费者模式。

`produce` 和 `actor` 与 `launch` 一样都被称作 " 协程启动器 "。通过这两个协程的启动器启动的协程也自然的与返回的 Channel 绑定到了一起，因此 Channel 的关闭也会在协程结束时自动完成，以 produce 为例，它构造出了一个 ProducerCoroutine 的对象

##### `produce` 构造生产者协程

使用 produce 可以更便捷地构造生产者

通过 `produce` 协程构建器来启动一个生产者协程，返回 ReceiveChannel，其他协程可以用这个 Channel 来接收数据

```kotlin
@Test
fun `test fast producer channel`() = runBlocking<Unit> {
    val receiveChannel: ReceiveChannel<Int> = GlobalScope.produce<Int> {
        repeat(100) {
            delay(1000)
            send(it)
        }
    }
    val consumer = GlobalScope.launch {
        for (i in receiveChannel) {
            println("received: $i")
        }
    }
    consumer.join()
}
```

输出：

```
received: 0
received: 1
received: 2
received: 3
received: 4
received: 5
received: 6
received: 7
received: 8
received: 9
...
```

> 每隔一秒发射一个数据

##### ~~`actor`~~ 构建消费者协程，过时

`actor` 可以用来构建一个消费者协程

```kotlin
@Test
fun `test fast consumer channel`() = runBlocking<Unit> {
    val sendChannel: SendChannel<Int> = actor<Int> {
        while (true) {
            val element = receive()
            println(element)
        }
    }
    val producer = GlobalScope.launch {
        for (i in 0..3) {
            sendChannel.send(i)
        }
    }
    producer.join()
}
```

输出：

```
0
1
2
3
```

> 输出 0123 后，就挂起了

通过 `GlobalScope.actor` 产生了对应的消费者 `sendChannel`，在对应的生产者里面通过 `sendChannel.send(i)` 向对应的消费者发送数据。

#### Receiver channels `pipeline`

`Receiver channels` 可用于实现管道。管道是一组通过通道连接的阶段，它们协同工作将输入数据转换为输出数据。

管道中的每个阶段都是一个协程，它消耗来自输入通道的数据，对数据执行一些计算，然后将转换后的数据发送到输出通道，该输出通道由管道中的下一个阶段使用。

管道中各阶段之间的输入和输出通道充当缓冲区，允许每个阶段异步且独立地处理数据。

这使得管道能够有效地处理大量数据并跨多个核心或线程并行计算。

管道在需要分阶段处理数据（每个阶段对数据执行特定计算）的场景中非常有用。

**示例 1：**
下面是一个管道示例，它通过过滤掉偶数、对剩余奇数进行平方，然后将它们相加来处理整数流：

```kotlin
fun main() = runBlocking {  
    streamingNumbers(this)  
  
    joinAll()  
}  
  
/**  
 * 它通过过滤掉偶数、对剩余奇数进行平方，然后将它们相加来处理整数流：  
 */  
fun streamingNumbers(scope: CoroutineScope) {  
    scope.launch {  
        val numbers = produceNumbers(5) // 1 3 5 = 1^2 + 3^2 + 5^2 = 35  
        val result = pipeline(numbers)  
        println(result.receive().toString())  
    }  
}  
  
// Producing numbers, each number being sent to the pipeline  
fun CoroutineScope.produceNumbers(count: Int): ReceiveChannel<Int> = produce {  
    for (i in 1..count) send(i)  
}  
  
// Pipeline which process the numbers  
fun CoroutineScope.pipeline(  
    numbers: ReceiveChannel<Int>  
): ReceiveChannel<Int> = produce {  
    // Filtering out even numbers  
    val filtered = filter(numbers) { it % 2 != 0 }  
  
    // Squaring the remaining odd numbers  
    val squared = map(filtered) { it * it }  
  
    // Summing them up  
    val sum = reduce(squared) { acc, x -> acc + x }  
  
    send(sum)  
}  
  
fun CoroutineScope.filter(  
    numbers: ReceiveChannel<Int>,  
    predicate: (Int) -> Boolean  
): ReceiveChannel<Int> = produce {  
    numbers.consumeEach { number ->  
        if (predicate(number)) send(number)  
    }  
}  
  
fun CoroutineScope.map(  
    numbers: ReceiveChannel<Int>,  
    mapper: (Int) -> Int  
): ReceiveChannel<Int> = produce {  
    numbers.consumeEach { number ->  
        send(mapper(number))  
    }  
}  
  
suspend fun reduce(  
    numbers: ReceiveChannel<Int>,  
    accumulator: (Int, Int) -> Int  
): Int {  
    var result = 0  
    for (number in numbers) {  
        result = accumulator(result, number)  
    }  
    return result  
}
```

> 在此示例中， `pipeline` 函数通过将三个阶段链接在一起创建一个新管道： `filter` 、 `map` 和 `reduce` 。 `filter` 阶段过滤掉偶数， `map` 阶段对剩余奇数进行平方， `reduce` 阶段对奇数平方求和。每个阶段都实现为一个单独的协程，它使用 `filter` 、 `map` 和 `reduce` 函数使用来自输入通道的数据并生成数据到输出通道。 `pipeline` 函数返回一个新的 `ReceiveChannel` ，表示管道的输出通道。

**示例 2：图像处理**
下面是一个通过调整图像大小、压缩和存储来处理图像流的管道示例：

```kotlin
fun processImages(
    coroutineScope: CoroutineScope
) {
    coroutineScope.launch {
        val images = produceImages(listOf(
            "https://via.placeholder.com/300x300.png",
            "https://via.placeholder.com/500x500.png",
            "https://via.placeholder.com/800x800.png"
        ))
        val resized = resizeImages(images, 400)
        val compressed = compressImages(resized, 80)
        storeImages(compressed, Paths.get("output/"))
    }
}

fun CoroutineScope.produceImages(urls: List<String>): ReceiveChannel<ByteArray> = produce {
    for (url in urls) {
        val bytes = URL(url).readBytes()
        send(bytes)
    }
}

fun CoroutineScope.resizeImages(
    images: ReceiveChannel<ByteArray>, size: Int
): ReceiveChannel<ByteArray> = produce {
    images.consumeEach { image ->
        // ImageResizer can a util class to resize the image
        val resizedImage = ImageResizer.resize(image, size)
        send(resizedImage)
    }
}

fun CoroutineScope.compressImages(
    images: ReceiveChannel<ByteArray>, quality: Int
): ReceiveChannel<ByteArray> = produce {
    images.consumeEach { image ->
        // ImageCompressor can a util class to compress the image
        val compressedImage = ImageCompressor.compress(image, quality)
        send(compressedImage)
    }
}

suspend fun storeImages(images: ReceiveChannel<ByteArray>, directory: Path) {
    Files.createDirectories(directory)
    var index = 1
    for (image in images) {
        val file = directory.resolve("image${index++}.jpg")
        FileOutputStream(file.toFile()).use { output ->
            output.write(image)
        }
    }
}
```

> 在此示例中， `processImages` 函数创建一个 `ReceiveChannel` ，它使用 `produceImages` 函数从 URL 列表生成图像数据流。然后将此通道传递给 `resizeImages` 函数，该函数将图像大小调整为指定大小，然后将输出通道传递给 `compressImages` 函数，该函数将图像压缩为指定质量等级。最后， `compressImages` 函数的输出通道被传递给 `storeImages` 函数，该函数将压缩图像存储到磁盘。

### Channel 参数

```kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    onUndeliveredElement: ((E) -> Unit)? = null
)
```

#### `capacity`

capacity 表示 Channel 的容量，也就是说，它可以缓存多少个元素。capacity 有几种可选的值，分别是：

- `RENDEZVOUS`：表示无缓冲的 Channel，容量为 0，每次发送或接收数据都需要挂起协程，直到另一端准备好
- `UNLIMITED`：表示无限容量的 Channel，可以缓存任意数量的元素，不会挂起发送方协程，但可能会导致内存溢出。
- `CONFLATED`：表示容量为 1 的 Channel，但是新的元素会替换旧的元素，不会挂起发送方协程，但可能会丢失数据。
- `BUFFERED`：表示有限缓冲的 Channel，可以指定一个正整数作为容量，当缓冲区满了时，会挂起发送方协程，直到有空间可用。

具体见：[[#Channel 类型]]

#### `onBufferOverflow`

这个参数用于指定当 `Channel` 的缓冲区满了时，发送方应该采取什么策略。它有三个可选的值：

- `BufferOverflow.SUSPEND`：这是默认值，表示发送方会挂起，直到缓冲区有空间。
- `BufferOverflow.DROP_OLDEST`：表示发送方会丢弃缓冲区中最旧的元素，然后再发送新的元素。
- `BufferOverflow.DROP_LATEST`：表示发送方会丢弃新的元素，保留缓冲区中已有的元素。

#### `onUndeliveredElement`

这个参数用于指定当 Channel 被关闭时，如果还有未传递的元素，应该调用什么回调函数。它接受一个函数类型的参数：

### Channel 可迭代

如果要取出 Channel 中所有的数据，可以使用迭代。

```kotlin
fun main() = runBlocking {
    val channel = Channel<Int>()
    launch {
        for (x in 1..5) {
            channel.send(x * x)
        }
    }

    val iterator = channel.iterator()
    while (iterator.hasNext()) {
        val next = iterator.next()
        println(next)
    }
    println("Done!")
}
// 或
val channel = Channel<Int>()
launch {
    // 这里可能是消耗大量 CPU 运算的异步逻辑，我们将仅仅做 5 次整数的平方并发送
    for (x in 1..5) channel.send(x * x)
}
for (y in channel) {
    println(y)
}
println("Done!")
```

输出：

```
1
4
9
16
25
```

> 最后一行 Done! 没有打印出来，并且程序没有结束。此时，我们发现，这种方式，实际上是我们一直在等待读取 Channel 中的数据，只要有数据到了，就会被读取到。

### Channel 容量

Channel 实际上就是一个队列，队列中一定存在缓存区，缓存区的大小就是 Channel 的容量，最多能容纳多少数据。

### 关闭 Channel

- `produce` 和 `actor` 返回的 `Channel` 都会随着对应的协程执行完毕而关闭，也正是这样，**Channel 才被称为热数据流**；
- 对于一个 `Channel`，如果我们调用了它的 close 方法，它会立即停止接收新元素，也就是说这时它的 `isClosedForSend` 会立即返回 true；而由于 Channel 缓冲区的存在，这时候可能还有一些元素没有被处理完，因此要等所有的元素都被读取之后 `isClosedForReceive` 才会返回 true；
- Channel 的生命周期最好由主导方来维护，建议**由主导的一方实现关闭**；因为可能会存在一个生产者对应多个消费者，就好比如，一个老师讲课，有多个学生听课，是否上下课的信号由老师来负责，而不是学生！

使用 `close()` 方法关闭 Channel，来表明没有更多的元素将会进入通道。

```kotlin
val channel = Channel<Int>()
launch {
    for (x in 1..5) channel.send(x * x)
    channel.close() // 我们结束发送
}
// 这里我们使用 `for` 循环来打印所有被接收到的元素（直到通道被关闭）
for (y in channel) println(y)
println("Done!")
```

输出：

```
1
4
9
16
25
Done!
```

从概念上来讲，调用 `close` 方法就像向通道发送了一个特殊的关闭指令，这个迭代停止，说明关闭指令已经被接收了。所以这里能够保证所有先前发送出去的原色都能在通道关闭前被接收到。

对于一个 `Channel`，如果我们调用了它的 `close`，它会立即停止接受新元素，也就是说这时候它的 `isClosedForSend` 会立即返回 true，而由于 Channel 缓冲区的存在，这时候可能还有一些元素没有被处理完，所以要等所有的元素都被读取之后 `isClosedForReceive` 才会返回 true。

关闭后再次 send 就会报错，可通过 `Channel.isClosedForSend` 和 `isClosedForReceive` 判断：

```kotlin
@Test
fun `test close channel`() = runBlocking<Unit> {
    val channel = Channel<Int>(3)
    // 生产者
    val producer = GlobalScope.launch {
        List(3) {
            channel.send(it)
            println("send $it")
        }

        channel.close()
        println(
            """close channel. 
            |  - ClosedForSend: ${channel.isClosedForSend}
            |  - ClosedForReceive: ${channel.isClosedForReceive}
            """.trimMargin()
        )
    }

    // 消费者
    val consumer = GlobalScope.launch {
        for (element in channel) {
            println("receive $element")
            delay(1000)
        }
        println(
            """After Consuming. 
            |   - ClosedForSend: ${channel.isClosedForSend} 
            |   - ClosedForReceive: ${channel.isClosedForReceive}
            """.trimMargin()
        )
    }

    joinAll(producer, consumer)
}
```

输出：

```
send 0
send 1
send 2
receive 0
close channel. 
  - ClosedForSend: true
  - ClosedForReceive: false
receive 1
receive 2
After Consuming. 
   - ClosedForSend: true 
   - ClosedForReceive: true
```

## Channel 类型

### SendChannel 和 ReceiveChannel

`Channel` 继承自 `SendChannel` 和 `ReceiveChannel` 接口。

```kotlin
interface SendChannel<in E> {
    suspend fun send(element: E)
    fun close(): Boolean
}

interface ReceiveChannel<out E> {
    suspend fun receive(): E
}    

interface Channel<E> : SendChannel<E>, ReceiveChannel<E>
```

#### SendChannel 提供了发射数据的功能

1. `send`<br>一个挂起函数，将指定的元素发送到此通道，在该通道的缓冲区已满或不存在时挂起调用者。如果通道已经关闭，调用发送时会抛出异常。
2. `trySend`<br>如果不违反其容量限制，则立即将指定元素添加到此通道，并返回成功结果。否则，返回失败或关闭的结果。
3. `close`<br>关闭通道。
4. `isClosedForSend` 这个属性用于判断 Channel 是否已经关闭了发送端。如果是，那么向 Channel 中 send 数据会导致运行时异常

#### ReceiveChannel 提供了接收数据的功能

kotlin 协程中 `ReceiveChannel` 和常规 `Channel` 之间的主要区别在于 `ReceiveChannel` 只能用于消费来自 Channel 的数据，而常规 `Channel` 可用于发送和接收数据。

1. `receive`<br>如果此通道不为空，则从中检索并删除元素；如果通道为空，则挂起调用者；如果通道为接收而关闭，则引发 ClosedReceiveChannel 异常。
2. `tryReceive`<br>如果此通道不为空，则从中检索并删除元素，返回成功结果；如果通道为空，则返回失败结果；如果通道关闭，则返回关闭结果。
3. `receiveCatching`<br>如果此通道不为空，则从中检索并删除元素，返回成功结果；如果通道为空，则返回失败结果；如果通道关闭，则返回关闭的原因。
4. `isEmpty`<br>判断通道是否为空
5. `cancel` (cause: CancellationException? = null)<br>以可选原因取消接收此频道的剩余元素。此函数用于关闭通道并从中删除所有缓冲发送的元素。
6. `iterator()`<br>返回通道的迭代器
7. `isClosedForReceive` 这个属性用于判断 Channel 是否已经关闭了接收端。如果是，那么从 Channel 中接收数据会立即返回零值，并且 ok 值为 false。如果关闭，调用 receive 会引发异常。

### Channel 类型

Kotlin 协程库中定义了多个 Channel 类型，所有 channel 类型的 receive 方法都是同样的行为: 如果 channel 不为空, 接收一个元素, 否则 suspend。它们的主要区别在于：

1. Channel 内部可以存储元素的数量
2. Send 是否可以被挂起

Channel 的不同类型：

- Rendezvous channel: 0 尺寸 buffer (默认类型).
- Unlimited channel: 无限元素, send 不被挂起.
- Buffered channel: 指定大小, 满了之后 send 挂起.
- Conflated channel: 新元素会覆盖旧元素, receiver 只会得到最新元素, send 永不挂起.

```kotlin
val rendezvousChannel = Channel<String>(0)  
val bufferedChannel = Channel<String>(10)  
val conflatedChannel = Channel<String>(CONFLATED)  
val unlimitedChannel = Channel<String>(UNLIMITED)
```

`Channel()` 函数：

```kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    onUndeliveredElement: ((E) -> Unit)? = null
): Channel<E> =
    when (capacity) {
        RENDEZVOUS -> {
            if (onBufferOverflow == BufferOverflow.SUSPEND)
                RendezvousChannel(onUndeliveredElement) // an efficient implementation of rendezvous channel
            else
                ArrayChannel(1, onBufferOverflow, onUndeliveredElement) // support buffer overflow with buffered channel
        }
        CONFLATED -> {
            require(onBufferOverflow == BufferOverflow.SUSPEND) {
                "CONFLATED capacity cannot be used with non-default onBufferOverflow"
            }
            ConflatedChannel(onUndeliveredElement)
        }
        UNLIMITED -> LinkedListChannel(onUndeliveredElement) // ignores onBufferOverflow: it has buffer, but it never overflows
        BUFFERED -> ArrayChannel( // uses default capacity with SUSPEND
            if (onBufferOverflow == BufferOverflow.SUSPEND) CHANNEL_DEFAULT_CAPACITY else 1,
            onBufferOverflow, onUndeliveredElement
        )
        else -> {
            if (capacity == 1 && onBufferOverflow == BufferOverflow.DROP_OLDEST)
                ConflatedChannel(onUndeliveredElement) // conflated implementation is more efficient but appears to work in the same way
            else
                ArrayChannel(capacity, onBufferOverflow, onUndeliveredElement)
        }
    }
```

#### Rendezvous channel（默认，无 Buffer）

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*z2iT3cbryHDTmU2m.png)

没有 buffer 的 Channel，等同于创建一个 0 大小的 Buffered channel。`send` 或 `receive` 方法总是 suspend 直到另外一个调用。

默认是 `Rendezvous`，`BufferOverflow` 是 `SUSPEND` 的：即容量为 0，如果 send 超出容量，send 会挂起

**示例：**

```kotlin
val rendezvousChannel = Channel<String>(0)
```

想象一下，您有两个人想要互相交换消息。他们同意在特定地点会面以交换信息。然而，只有当他们都在该位置时，他们才能交换消息。这类似于 `Rendezvous Channel` 的工作原理。

`Rendezvous Channel` 是一种特定类型的通道，要求发送方和接收方都做好准备并等待才能交换消息。这确保双方同步并准备好交换数据。例如，假设一个协程想要使用 `Rendezvous Channel` 向另一个协程发送消息。发送协程将被挂起（暂停），直到接收协程准备好接收消息。同样，接收协程将被挂起，直到发送协程准备好发送消息。这确保两个协程同步并准备好交换数据，类似于上一个示例中的两个人必须出现在会议地点才能交换消息。

![|600](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*npOGhmIKppYkVxtXLYvPgA.png)

Rendezvous 通道的工作原理如下：

**对于 producer：**

1. 生产者协程调用 `Rendezvous Channel` 上的 `send()` 函数并发送一个值。
2. 如果没有协程等待接收值，则 `send()` 函数将挂起，直到协程在 `Rendezvous Channel` 调用 `receive()` 为止。
3. 如果有一个协程正在等待从 `Channel` 接收值，则该值会立即传递给正在等待的协程，并且两个协程都会继续执行。

**对于 consumer：**

1. 消费者协程调用 `Rendezvous Channel` 上的 `receive()` 函数以从通道中检索值。
2. 如果没有协程等待发送值，则 `receive()` 函数将挂起，直到协程在 `Rendezvous Channel` 上调用 `send()` 为止。
3. 如果有一个协程正在等待向通道发送值，则立即从通道中检索该值并将其传递给等待的协程，并且两个协程都继续执行。

由于该通道是一个容量为零的 `Rendezvous Channel`，因此发送方和接收方将在该通道 `rendezvous`，确保双方在交换发生之前准备好交换数据。

**示例：**

```kotlin
fun main() = runBlocking {  
    rendezvousChannel(this)  
}  
  
fun rendezvousChannel(  
    coroutineScope: CoroutineScope  
) {  
    // create a rendezvous channel with capacity 0  
    val channel = Channel<Int>()  
  
    // get the starting time to display the time difference in the logs  
    val startTime = System.currentTimeMillis()  
  
    // launch the producer coroutine  
    coroutineScope.launch {  
        for (i in 1..5) {  
            log("Producer -> Sending $i", startTime)  
            channel.send(i) // send data to the channel  
            delay(20) // wait for a short time before sending the next value  
            log("Producer -> Sent $i", startTime)  
        }  
        channel.close() // close the channel after sending all data  
    }  
  
    // launch the consumer coroutine  
    coroutineScope.launch {  
        // iterate over the channel until it's closed  
        for (value in channel) {  
            log("Consumer Received $value", startTime)  
        }  
    }  
}  
  
// To log the message and time  
fun log(message: String, startTime: Long) {  
    val currentTime = System.currentTimeMillis()  
    val diffTime = String.format("%.3f", (currentTime - startTime).toDouble() / 1000)  
    println("[$diffTime] $message")  
}
```

输出：

```
[0.025] Producer -> Sending 1
[0.046] Consumer Received 1
[0.070] Producer -> Sent 1
[0.070] Producer -> Sending 2
[0.073] Consumer Received 2
[0.096] Producer -> Sent 2
[0.096] Producer -> Sending 3
[0.096] Consumer Received 3
[0.118] Producer -> Sent 3
[0.119] Producer -> Sending 4
[0.119] Consumer Received 4
[0.143] Producer -> Sent 4
[0.144] Producer -> Sending 5
[0.144] Consumer Received 5
[0.180] Producer -> Sent 5
```

#### Unlimited channel （无限容量，send 不会被挂起）

![](https://play.kotlinlang.org/resources/hands-on/Introduction%20to%20Coroutines%20and%20Channels/assets/8-channels/UnlimitedChannel.png#id=jNBZQ&originHeight=169&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

`Unlimited channel` 最接近于 Queue，和 Queue 不同的是，消费者试图取数据时，如果 Channel 是空的会 suspend 直到 Channel 里有数据；Channel 容量没有限制，消费者可以一直往里面发送数据，`send` 永远不会 suspend；如果内存不足，可能会 OOM。

**示例：** 后台任务的任务队列

```kotlin
val taskChannel = Channel<() -> Unit>(Channel.UNLIMITED)  
  
suspend fun taskProducer(taskChannel: Channel<() -> Unit>) {  
// Generate a task and send it to the channel  
val task = { println("Executing task") }  
taskChannel.send(task)  
}  
  
// receives tasks from the producer and executes them  
suspend fun taskWorker(taskChannel: Channel<() -> Unit>) {  
taskChannel.consumeEach { task ->  
// Execute the task  
task()  
}  
}  
  
fun main() = runBlocking {  
repeat(5) { launch { taskProducer(taskChannel) } }  
launch { taskWorker(taskChannel) }  
}
```

---

#### Buffered channel （指定容量，满之后 send 挂起）

![](https://play.kotlinlang.org/resources/hands-on/Introduction%20to%20Coroutines%20and%20Channels/assets/8-channels/BufferedChannel.png#id=EMm62&originHeight=196&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

`Buffered channel` 指的是 Channel 容量被限制在一个指定的大小。

当您通过缓冲通道发送消息时，如果有可用空间，该消息就会添加到缓冲区中。如果缓冲区已满，发送方将被阻止（或暂停），直到有可用空间来添加消息。

同样，当您从缓冲通道接收消息时，如果有任何可用消息，则该消息将从缓冲区中删除。如果缓冲区为空，则接收方将被阻塞（或暂停），直到消息可用为止。

因此，缓冲通道在发送者和接收者之间存在延迟的情况下非常有用，因为它允许发送者继续发送消息，即使接收者接收消息的速度较慢。

**示例：**

```kotlin
fun main() = runBlocking {  
    bufferedChannel(this)  
}  
  
@OptIn(ExperimentalCoroutinesApi::class)  
fun bufferedChannel(  
    coroutineScope: CoroutineScope  
) {  
    // create a buffered channel with capacity of 2  
    val channel = Channel<Int>(capacity = 2)  
  
    // get the starting time to display the time difference in the logs  
    val startTime = System.currentTimeMillis()  
  
    coroutineScope.launch {  
        for (message in 1..5) {  
            // send the message through the channel and log the message  
            channel.send(message)  
            log("Producer Sent -> $message", startTime)  
        }  
        log("All Sent!", startTime)  
        // close the channel when all messages are sent  
        channel.close()  
    }  
  
    // launch a coroutine to consume messages from the channel  
    coroutineScope.launch {  
        // consume messages from the channel until it is closed  
        channel.consumeEach { message ->  
            log("Consumer Received $message", startTime)  
            // if channel is not closed then add a delay of 2 seconds to simulate some processing time  
            if (!channel.isClosedForReceive) {  
                delay(2000)  
            }  
        }  
        log("Receiving Done!", startTime)  
    }  
}  
  
// To log the message and time  
fun log(message: String, startTime: Long) {  
    val currentTime = System.currentTimeMillis()  
    val diffTime = String.format("%.3f", (currentTime - startTime).toDouble() / 1000)  
    println("[$diffTime] $message")  
}
```

输出：

```
[0.005] Producer Sent -> 1
[0.016] Producer Sent -> 2
[0.018] Consumer Received 1
[0.019] Producer Sent -> 3
[2.024] Consumer Received 2
[2.025] Producer Sent -> 4
[4.030] Consumer Received 3
[4.031] Producer Sent -> 5
[4.031] All Sent!
[6.036] Consumer Received 4
[8.042] Consumer Received 5
[8.044] Receiving Done!
```

#### Conflated channel （新元素覆盖旧元素，send 不挂起，receive 收最新元素）

![](https://play.kotlinlang.org/resources/hands-on/Introduction%20to%20Coroutines%20and%20Channels/assets/8-channels/ConflatedChannel.gif#id=uuMUi&originHeight=152&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

` Conflated Channel  ` 是一种一次只能容纳一个元素的通道，如果在前一个元素被消耗之前发送了一个新元素，则通道将用新元素覆盖前一个元素，从而有效地 " 合并 " 或合并二。

在某些情况下，最近的值比以前的值更重要，此行为可能很有用。例如，在显示实时股票价格的应用程序中，最近的价格通常是最相关的，并且可以丢弃以前的价格。

需要注意的是，由于合并通道只能容纳一个元素，因此在前一个元素被消耗之前发送新元素将导致前一个元素丢失。因此，混合通道不适合每个元素都必须处理的场景。

## 协程间通过 Channel 实现通信

### 多个协程访问同一个 Channel

在协程外部定义 Channel, 就可以多个协程可以访问同一个 channel，达到协程间通信的目的。

```kotlin
fun main() {
    val channel = Channel<Int>()
    runBlocking<Unit> {
        launch {
            for (x in 1..5) channel.send(x)
        }
        launch {
            delay(10)
            for (y in channel) {
                println("receive: 1 --> $y")
            }
        }
        launch {
            delay(20)
            for (y in channel) {
                println("receive: 2 --> $y")
            }
        }
        launch {
            delay(30)
            for (x in 90..100) channel.send(x)
            channel.close()
        }
    }
}
```

输出：

```
receive: 1 --> 1
receive: 1 --> 2
receive: 1 --> 3
receive: 1 --> 4
receive: 1 --> 5
receive: 1 --> 90
receive: 1 --> 92
receive: 2 --> 91
receive: 1 --> 93
receive: 1 --> 95
receive: 2 --> 94
receive: 1 --> 96
receive: 1 --> 98
receive: 2 --> 97
receive: 1 --> 99
receive: 2 --> 100
```

> Channel 是线程安全的；每个元素只会被一个消费者消费，消费后会被删除。

### 扇入扇出

**扇出**：多个协程可能会从同一个 channel 中接收值，这种情况称为 `Fan-out`。
**扇入**：多个协程可能会向同一个 channel 发射值，这种情况称为 `Fan-in`。

### ~~BroadcastChannel~~

Channel 一对多的情况下，存在多个接收者，每个元素只会被一个接收者处理然后删除，存在互斥；是点对点

而 BroadcastChannel 存在多个接收者时，可以同时接收同一个元素，不存在互斥；是一个广播

#### 创建 BroadcastChannel

1. 创建 BroadcastChannel 需要指定缓冲区大小

```kotlin
val broadcastChannel = broadcastChannel<Int>(5)
```

#### 订阅 broadcastChannel

```kotlin
val receiveChannel = broadcastChannel.openSubscription()
```

> 这样我们就得到了一个 ReceiveChannel，获取订阅的消息，只需要调用它的 receive。

#### Channel 转换为 BroadcastChannel

使用 Channel 的拓展函数 `broadcast()`，也可以将一个 Channel 转换成 BroadcastChannel, 需要指定缓冲区大小。

```kotlin
val channel = Channel<Int>()
val broadcast = channel.broadcast(3)
```

> 这样发射给原 channel 的数据会被读取后发射给转换后的 broadcastChannel。如果还有其他协程也在读这个原始的 Channel，那么会与 BroadcastChannel 产生互斥关系。

#### 过时 API（since 1.5.0 用 `SharedFlow` 替代）

BroadcastChannel 对于广播式的任务来说有点太复杂了。使用通道进行状态管理时会出现一些逻辑上的不一致。例如，可以关闭或取消通道。但由于无法取消状态，因此在状态管理中无法正常使用。

从 1.5.0 版本开始 BroadcastChannel 被标记为过时了，在 kotlin 1.6.0 版本中使用将显示警告，在 1.7.0 版本中将显示错误。请使用 `SharedFlow` 替代它。

#### 示例

```kotlin
@Test
fun `test broadcast`() = runBlocking<Unit> {
    // val broadcastChannel = BroadcastChannel<Int>(Channel.BUFFERED)
    val channel = Channel<Int>()
    val broadcastChannel = channel.broadcast(3)
    val producer = GlobalScope.launch {
        List(3) {
            delay(100)
            broadcastChannel.send(it)
        }
        broadcastChannel.close()
    }

    List(3) { index ->
        GlobalScope.launch {
            val receiveChannel = broadcastChannel.openSubscription()
            for (i in receiveChannel) {
                println("[#$index] received: $i")
            }
        }
    }.joinAll()
}
```

输出：

```
[#1] received: 0
[#0] received: 0
[#2] received: 0
[#0] received: 1
[#1] received: 1
[#2] received: 1
[#0] received: 2
[#1] received: 2
[#2] received: 2
```

> 可以看到每个元素 send 出去，每个消费者都收到了更新的元素

## Channel 使用场景

Channel 是一种协程间通信的工具，它可以实现不同协程之间的数据传递和同步。Channel 有多种模式和策略，可以根据不同的业务需求来选择合适的方式。下面我们介绍一些常见的 Channel 的使用场景：

### 实现 `生产者-消费者模式`

Channel 可以用来实现生产者 - 消费者模式，即一个协程负责生产数据，另一个协程负责消费数据。

这种模式可以有效地解耦数据的生产和消费，提高并发性能和可扩展性。我们可以使用 `produce{}` 函数来创建一个生产者协程，它会返回一个 Channel 对象，然后我们可以在另一个协程中使用 `consumeEach{}` 函数或者 for 循环来消费这个 Channel 中的数据。当生产者协程结束时，它会自动关闭 Channel，消费者协程也会相应地停止。

#### 基于 kotlin Channel 的优先级异步任务队列

适合于排队执行的任务实现，比如直播间动画排队播放。

[GitHub - EspoirX/OptimusAsyncTask: 基于 kotlin Channel 的优先级异步任务队列](https://github.com/EspoirX/OptimusAsyncTask)

### 实现 `管道模式`

Channel 也可以用来实现管道模式，即多个协程之间形成一个数据处理的流水线。每个协程都从上一个协程的 Channel 中接收数据，然后进行一些处理，再将结果发送到下一个协程的 Channel 中。这种模式可以将复杂的数据处理逻辑分解为多个简单的步骤，提高代码的可读性和可维护性。我们可以使用扩展函数 `pipeTo()` 来将一个 Channel 连接到另一个 Channel，形成一个管道。

### 实现 `广播` 模式

Channel 还可以用来实现广播模式，即一个协程向多个协程发送相同的数据。

这种模式可以用来实现事件驱动或者发布 - 订阅的机制，让多个协程能够响应同一个事件或者消息。我们可以使用 `BroadcastChannel` 类来创建一个广播通道，它允许多个协程订阅它，并且接收它发送的数据。我们还可以使用 `openSubscription()` 函数来打开一个订阅通道，它会返回一个 `ReceiveChannel` 对象，然后我们可以在不同的协程中使用这个对象来接收广播通道发送的数据。

## Channel 和 Flow

### Channel 和 Flow 区别

Channels 是 hot，Flows 是 cold。

Channels 通常是 Hot 的，因为它们是有状态的对象，Channel 是一种通信机制，可让你从其他计算接收值；作为消费者，你与 Channel 的交互不需要控制计算的开始和停止时间。

可以把 Channel 想象成地铁上的移动自动扶梯。它在您开始使用之前就开始运行，并且很可能在您离开后继续运行。

Flows 称为冷流，是因为它们不保存状态；当你在 kotlin 代码中传递 Flow 时，flow 不会保存或生成任何数据，这是因为 Flow 对象不是数据流的活动实例，相反，每次调用 `collect` 时，你都会创建一个新的、短暂的流计算实例，该实例仅存在于该函数调用中。

如果说 Channel 像地铁站的自动扶梯，那么 Flow 则更像是电梯，它仅在你开始与其交互时才开始运行，并在你离开后立即停止。

![|500](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*TMteR-O1Zgrmpbie)

- Flow 是一种控制结构。它包含可执行代码，就像 `suspend` 函数一样。当您从 flow 中收集值时，您将调用 flow 内的代码，就像通过调用函数来执行函数的代码一样。
- Channel 是一种通信机制。它处理消息或值，并允许您将它们从一个地方传递到另一个地方。它不包含任何代码。当您从某个 Channel 接收消息时，您只是在收集其他代码留下的消息。

Kotlin 中 **Flow** 和 **Channel** 之间的区别就像**函数**和**对象**之间的基本区别一样。你也可以将物体描述为热的，而将功能描述为冷的。

对象具有有状态的存在，即使您不与它交互，它也会持续存在。同时，函数仅在调用该函数时保持状态。当您调用它时它会被实例化，并在您完成后再次消失。

#### SharedFlow

SharedFlow 就像 Channel 的更好封装版本。他们可能有一个活跃的生产者协程，其寿命比消费者长，但他们向消费者隐藏了所有错误、资源和取消。

### Channel 和 Flow 抉择

不要将 Channel 和 Flow 视为做同一件事的两种不同方式，而应将它们视为用于两种不同工作的两种完全不同的工具。Channel 是为了沟通；Flow 用于封装和代码重用。

- 当您想要将值从一个协程传递到另一个协程时，请使用 Channel 。
- 当您想要封装产生价值的代码以便消费者不必担心它何时启动、停止或失败时，请使用 Flow。

这两个工具也可以而且应该一起使用。

可以混合搭配：从 Channel 中读取一些值，然后将其包装在 Flow 中，以将剩余的值和清理过程委托给其他代码。

通过将 Channel 包装在 Flow 中，您可以使应用程序更安全、更可预测。您可以决定当 Flow 退出时会发生什么（如果有的话）。

当多个协程同时消费或生产时，Channel 是它们用来分配和协调工作的通信工具。

但是，通过正确使用 Flow 和结构化并发，Channel 及其所有协程仍然可以被包装和封装，以便应用程序的其余部分不必担心它们。

### Ref

- [The Big Difference Between Flows and Channels in Kotlin | by Sam Cooper | Better Programming](https://betterprogramming.pub/stop-calling-kotlin-flows-hot-and-cold-48e87708d863)

## Ref

- [x] Channels （官方文档）<br><https://kotlinlang.org/docs/channels.html>
- [x] Kotlin 协程二 —— 通道 Channel<br><https://www.cnblogs.com/joy99/p/15805928.html>

- [Mastering Kotlin Channels: From Beginner to Pro - Part 1 | by Morty | Medium](https://medium.com/@mortitech/mastering-kotlin-channels-from-beginner-to-pro-part-1-7368060d1391)
- [Mastering Kotlin Channels: From Beginner to Pro - Part 2 | by Morty | Medium](https://medium.com/@mortitech/mastering-kotlin-channels-from-beginner-to-pro-part-2-3477255aee15)
