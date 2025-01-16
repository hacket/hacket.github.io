---
date created: 2024-05-23 12:10
date updated: 2024-12-27 23:45
dg-publish: true
---

# select 表达式

## 多路复用

数据通信系统或计算机网络系统中，传输媒体的宽带或容量往往会大于传输单一信号的需求，为了有效的利用通信线路，希望**一个信道同时传输多路信息**，这就是所谓的多路复用技术(`Multiplexing`)

## 什么是 select？

select 表达式可以同时等待多个挂起函数，并选择第一个可用的。这样就可以实现这样一种功能，同时执行不同的处理，哪种返回了就处理哪种。

## Select

### OnAwait 复用多个await

示例：两个API分别从**网络**和**本地缓存**获取数据，期望哪个先返回就先用哪个做展示：

```kotlin
fun CoroutineScope.getUserFromApi(id: String) = async(Dispatchers.IO) {
    delay(3000L)
    User("hacket from net $id")
}

fun CoroutineScope.getUserFromLocal(id: String) = async(Dispatchers.IO) {
    delay(1000L)
    User("hacket from local $id.")
}

data class User(val name: String)

fun main() = runBlocking {
    val id = "123"
    val localDeferred = getUserFromLocal(id)
    val remoteDeferred = getUserFromApi(id)

    val user = select<User?> {
        localDeferred.onAwait { it }
        remoteDeferred.onAwait { it }
    }
    println("user: $user")
}
```

### OnReceive/onReceiveOrNull 复用多个 Channel

复用多个 `Channel`，跟 `await` 类似，会接收到最快的那个 `Channel` 消息。

#### OnReceive

**示例1：**

```kotlin
@Test
fun `test select channel`() = runBlocking<Unit> {
	val channels = listOf(Channel<Int>(), Channel<Int>())
	GlobalScope.launch {
		delay(100)
		channels[0].send(200)
	}

	GlobalScope.launch {
		delay(50)
		channels[1].send(100)
	}

	val result = select<Int?> {
		channels.forEach { channel ->
			channel.onReceive { it }
		}
	}
	println(result)
}
```

输出：100

> 通过`listOf`将对应通道整合成一个list集合，然后分别开了两个协程，在对应协程里分别挂起的不同的时间。最后我们看到接收了执行了耗时较短的通道信息！

**示例2：**

```kotlin
// 300 600 900 1200 1500 1800 2100 2400 2700 3000
fun CoroutineScope.fizz() = produce {
    while (true) { // 每 300 毫秒发送一个 "Fizz"
        delay(300)
        send("Fizz")
    }
}

// 500 1000 1500 2000 2500 3000 3500 4000 4500 5000
fun CoroutineScope.buzz() = produce {
    while (true) { // 每 500 毫秒发送一个"Buzz!"
        delay(500)
        send("Buzz!")
    }
}

suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> 意味着该 select 表达式不返回任何结果
        fizz.onReceive { value -> // 这是第一个 select 子句
            println("fizz -> '$value'")
        }
        buzz.onReceive { value -> // 这是第二个 select 子句
            println("buzz -> '$value'")
        }
    }
}

fun main() = runBlocking {
    val fizz = fizz()
    val buzz = buzz()
    repeat(7) {
        selectFizzBuzz(fizz, buzz)
    }
    coroutineContext.cancelChildren() // cancel fizz & buzz coroutines
}
```

输出：

```
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
buzz -> 'Buzz!'
```

#### onReceiveOrNull

select 中的 `onReceive` 子句在已经关闭的通道执行会发生失败，并导致相应的 select 抛出异常。我们可以使用 `onReceiveOrNull` 子句在关闭通道时执行特定操作。

```kotlin
suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =
    select<String> {
        a.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "a -> '$value'"
            } else {
                "Channel 'a' is closed"
            }
        }
        b.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "b -> '$value'"
            } else {
                "Channel 'b' is closed"
            }
        }
    }

fun main() = runBlocking<Unit> {
    val a = produce<String> {
        repeat(4) { send("Hello $it") }
    }
    val b = produce<String> {
        repeat(4) { send("World $it") }
    }
    repeat(8) { // print first eight results
        println(selectAorB(a, b))
    }
    coroutineContext.cancelChildren()
}
```

输出：

```
a -> 'Hello 0'
a -> 'Hello 1'
b -> 'World 0'
a -> 'Hello 2'
a -> 'Hello 3'
b -> 'World 1'
Channel 'a' is closed
Channel 'a' is closed
```

> 首先，select 偏向于第一个子句，当可以同时选到多个子句时，第一个子句将被选中。在这里，两个通道都在不断地生成字符串，因此 a 通道作为 select 中的第一个子句获胜。然而因为我们使用的是无缓冲通道，所以 a 在其调用 send 时会不时地被挂起，进而 b 也有机会发送。

### OnSend

## SelectClause

所有能够被 select 的事件都是 `SelectClauseN` 类型。

我们怎么知道哪些事件可以被 `select` 呢？其实所有能够被 `select` 的事件都是 `SelectClauseN` 类型，包括：

- **SelectClause0**：对应事件没有返回值，例如join没有返回值，那么onJoin就是SelectClauseN类型。使用时，onJoin的参数是一个无参函数。
- **SelectClause1**：对应事件有返回值，上面的onAwait和onReceive都是此类情况（下面就不举该例）
- **SelectClause2**：对应事件有返回值，此外还需要一个额外的参数，例如Channel.onSend有两个参数，第一个是Channel数据类型的值，表示即将发送的值；第二个是发送成功时的回调函数。

### SelectClause0

对应事件没有返回值，例如 join 没有返回值，对应的 `onJoin` 就是这个类型，使用时 onJoin 的参数是一个无参函数

**示例：**

```kotlin
@Test
fun `test SelectClause0`() = runBlocking<Unit> {
	val job1 = GlobalScope.launch {
		delay(100)
		println("job 1")
	}

	val job2 = GlobalScope.launch {
		delay(10)
		println("job 2")
	}

	select<Unit> {
		job1.onJoin { println("job 1 onJoin") }
		job2.onJoin { println("job 2 onJoin") }
	}

	delay(1000)
}
```

输出：

```
job 2
job 2 onJoin
job 1
```

> 这是一个非常标准的协程，对应事件没有任何返回值的，这个就是上面所说的`SelectClause0`类型。

### SelectClause1

对应事件有返回值， `onAwait` 和 `onReceive` 都是此类情况。

### SelectClause2

对应事件有返回值，此外还需要额外的一个参数，例如 `Channel.onSend` 有两个参数，第一个就是一个 Channel 数据类型的值，表示即将发送的值，第二个是发送成功时的回调

```kotlin
List(100) { element ->
    select<Unit> {
        channels.forEach { channel ->
            channel.onSend(element) { sentChannel -> log("sent on $sentChannel") }
        }
    }
}
```

在消费者的消费效率较低时，数据能发给哪个就发给哪个进行处理，onSend 的第二个参数的参数是数据成功发送到的 Channel 对象。

**示例：**

```kotlin
@Test
fun `test SelectClause2`() = runBlocking<Unit> {
	val channels = listOf(Channel<Int>(), Channel<Int>())
	println(channels)
	launch(Dispatchers.IO) {
		 select<Unit?> {
			launch {
				delay(10)
				channels[1].onSend(200) { sentChannel ->
					println("sent 1 on $sentChannel")
				}
			}
			launch {
				delay(100)
				channels[0].onSend(100) { sentChannel ->
					println("sent 0 on $sentChannel")
				}
			}
		}
	}
	GlobalScope.launch {
		println(channels[0].receive())
	}
	GlobalScope.launch {
		println(channels[1].receive())
	}
	delay(1000)
}
```

输出：

```
[RendezvousChannel@2a084b4c{EmptyQueue}, RendezvousChannel@42b93f6b{EmptyQueue}]
200
sent 1 on RendezvousChannel@42b93f6b{EmptyQueue} //回调成功执行业务逻辑——打印
```

> 使用了`channels.onSend`方式，上面所说，第一个参数为对应类型，第二个参数就会回调函数，也就是说，后面大括号里面的内容就会回调成功的业务逻辑处理。

## 使用 Flow 实现多路复用

多数情况下，我们可以通过构造合适的Flow来实现多路复用的效果。

**示例：**

```kotlin
private val cachePath = "E://coroutine.cache" //该文件里面内容为：{"name":"hacket","address":"shenzhen"}
private val gson = Gson()

data class Response<T>(val value: T, val isLocal: Boolean)

// 通过本地获取用户信息
fun CoroutineScope.getUserFromLocal(name: String) = async(Dispatchers.IO) {
//    delay(10000) //故意的延迟
    File(cachePath).readText().let { gson.fromJson(it, User::class.java) }
}

// 通过网络获取用户信息
fun CoroutineScope.getUserFromRemote(name: String) = async(Dispatchers.IO) {
    userServiceApi.getUser(name)
}

class CoroutineTest02 {
    @Test
    fun `test select flow`() = runBlocking<Unit> {
        // 函数 -> 协程 -> Flow -> Flow合并
        val name = "guest"
        coroutineScope {
        	// 通过作用域，将对应方法调用添加至list集合里
            listOf(::getUserFromLocal, ::getUserFromRemote)
            	// 遍历集合每个方法，function 就为对应的某个方法
                .map { function ->
                    function.call(name) // 这里调用对应方法后，将返回的结果传至下个map里
                }.map { deferred -> // 这里对应deferred 表示对应方法返回的结果
                    flow { emit(deferred.await()) } // 这里表示，得到谁，就通过flow 发射值
                }.merge() // 流 合并
                .collect { user -> println(user) } // 这里只管接收flow对应发射值

        }
    }
}
```

输出：

```kotlin
User(name=hacket, address=shenzhen)
User(name=hacket, address=California)
```

> 这里我们看到，本地和网络都成功的收到了
