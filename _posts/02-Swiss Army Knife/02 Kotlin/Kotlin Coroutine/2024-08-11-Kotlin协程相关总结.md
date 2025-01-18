---
date created: 2024-08-11 21:58
date updated: 2024-12-27 23:45
dg-publish: true
---

# Kotlin协程

## 协程是什么？kotlinx.coroutines是什么？

协程(Coroutines) 是一个新的概念，但是协程这个术语早在1958年就被提出并用于构建汇编程序，协程是一种编程思想，并不局限于特定的语言，就像Rx也是一种思想，并不局限于使用Java实现的RxJava。不同语言实现的协程库可能名称或者使用上有所不同，但它们的设计思想是有相似之处的。<br>kotlinx.coroutines是由JetBrains开发的kotlin协程库，可以把它简单的理解为一个线程框架 。<br>协程并不是从操作系统层面创立的新的运行方式，代码是运行在线程中的，线程又是运行在进程中的，协程也是运行在线程中的，所以才说它是基于线程封装的库。<br>Kotlin协程解决了异步编程时过多回调的问题，用写同步代码的方式来写异步代码，简化了异步编程。

## 进程、线程和协程之间的关系

1. **协程和线程提出的时间**

协程是1963年正式提出，1966年才有了线程的概念。

2. **进程、线程和协程包含关系**

同一时刻，同一个CPU的某个核心上，只有一个进程的一个线程的一个协程(如果有)在运行。<br>一个进程包含至少一个线程（主线程），一个线程里有0或多个协程，一个协程是以线程为宿主进行的计算活动。协程一旦确定宿主线程，一般不会再更改。<br>![](https://cdn.nlark.com/yuque/0/2022/jpeg/694278/1671676419378-58bfb6db-68a4-41f3-b14d-508128a116c7.jpeg#averageHue=%23dfebdc&clientId=u0d921ed4-03de-4&from=paste&id=SojHI&originHeight=376&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=ub2c280eb-73c5-4201-802d-d57a153809b&title=)

3. **资源分配**

进程是资源分配的基本单位，进程间的内存空间是隔离的，线程是CPU调度的基本单位，协程对于OS来说是透明的；协程被认为是用户态的线程，协程的调度由用户完成。进程向自己所属线程开放内存空间，线程有自己的堆栈、程序计数器和寄存器。

4. **资源消耗**

一个线程消耗的内存一般在MB级别，而协程占用内存一般在几十到几百KB，Goroutine经过层层优化后占用2KB内存。Java为了解决多线程内存分配锁竞争的性能问题，每个线程还会在自己的内存空间中额外申请默认64MB内存作为堆内存（TLAB），使得操作系统的内存无法支撑几万个线程的并发，但是对协程来说却不是个问题。

5. **上下文切换成本**

线程切换需要到内核态，线程上下文切换的成本在几十纳秒到几微秒间，当线程繁忙且数量众多时，这些切换会消耗绝大部分的CPU运算能力。<br>![](https://cdn.nlark.com/yuque/0/2022/png/694278/1671676353546-449c4a2c-8f31-4562-9dd5-1e7fe35b48e9.png#averageHue=%23c7b7a4&clientId=u0d921ed4-03de-4&from=paste&height=116&id=VopR4&originHeight=177&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=u9f28f68a-c447-464d-a769-20b5a773bcf&title=&width=706)

# Kotlin协程原理

## 什么是suspend？suspend原理？

### 什么是suspend？

- suspend 修饰函数时，表明这个函数可能会被挂起，挂起函数不一定会挂起协程，如果相关调用的结果已经可用，库可以决定继续进行而不挂起。
- 挂起函数使用 CPS style 的代码来挂起协程，保证挂起点后面的代码只能在挂起函数执行完后才能执行，所以挂起函数保证了协程内的顺序执行顺序
- 每个挂起函数的最后一个参数是一个Continuation类型

### suspend原理

suspend函数反编译后都会由编译器增加一个Continuation类型参数在最后（Retrofit就是根据这个参数来判断是普通函数还是suspend函数的）<br>启动一个协程一般需要传递一个`suspend ()->T`suspend lambda，launch最后一个参数`block`<br>**suspend lambda又是个什么东西？**<br>反编译后它其实就是个`SuspendLambda`并实现了`Function1`接口的类，而`SuspendLambda→ContinuationImpl→BaseContinuationImpl→Continuation`<br>里面的`create()`方法和`invokeSuspend()`都是实现了Continuation接口的方法。

## 协程的原理

### 协程的创建

以launch为例，调用链：

- CoroutineScope.launch
- AbstractCoroutine.start
- CoroutineStart.invoke
- (suspend (R) -> T).startCoroutineCancellable 创建Continuation
  - (suspend (R) -> T).createCoroutineUnintercepted

### 协程的启动

- SuspendLambda→ContinuationImpl→BaseContinuationImpl→Continuation
- 入口 resumeWith

> 协程的的启动入口是在`BaseContinuationImpl#resumeWith`里面有个死循环，里面调用了invokeSuspend()，最终会调用到suspend lambda的invokeSuspend，里面是个状态机，各种case。

- invokeSuspend(xxx) 最终调用的是你写的`suspend()->T`的代码，判断结果是否是`COROUTINE_SUSPEND`，如果是那么就return了，while循环退出，也就是挂起了；每次挂起都是执行一次invokeSuspend函数
- 如果不是`COROUTINE_SUSPEND`，最终会调用resumeWith进行协程的恢复

```kotlin
internal abstract class BaseContinuationImpl(
    public val completion: Continuation<Any?>?): Continuation<Any?> {
    public final override fun resumeWith(result: Result<Any?>) {
        var current = this
        while (true) {
            with(current) {
				val completion = completion!!
                val outcome: Result<Any?> =
                    try {
                        val outcome = invokeSuspend(param)
                        if (outcome === COROUTINE_SUSPENDED) return
                        Result.success(outcome)
                    } catch (exception: Throwable) {
                        Result.failure(exception)
                    }
                releaseIntercepted() // this state machine instance is terminating
                if (completion is BaseContinuationImpl) {
                    // unrolling recursion via loop
                    current = completion
                    param = outcome
                } else {
                    // top-level completion reached -- invoke and return
                    completion.resumeWith(outcome)
                    return
                }
            }
        }
    }
}
```

## 协程的结构化并发

## 协程如何切换线程的？

### launch如何切换线程的？

1. 线程上下文ContinuationInterceptor就是一个CoroutineContext，在launch时可以传递进去
2. 有个intercepted()进行分发

- CoroutineScope.launch()
- AbstractCoroutine.start(start, coroutine, block)
- (suspend (R) -> T).startCoroutineCancellable  SuspendLambda
  - SuspendLambda.createCoroutineUnintercepted()
  - Continuation.intercepted() 这里会传递CoroutineDispatcher(通过CoroutineContext获取)和Continuation给DispatchedContinuation构造
  - DispatchedContinuation.interceptContinuation()
  - DispatchedContinuation.resumeCancellableWith() 如果需要就调用Dispatcher.dispatch()到指定线程运行任务
- main线程是通过HandlerContext，最终通过Handler来实现的

### withContext是怎样切换线程的？

withContext其实就是一层Api封装，最后调用到了`startCoroutineCancellable`,这就跟launch后面的流程一样了

- suspendCoroutineUninterceptedOrReturn(CoroutineContext, SuspendLambda)
- DispatchedCoroutine.afterResume
- Continuation.intercepted() 后面流程同launch了

## 协程异常如何传递的？

**协程异常**

- 协程中抛出CancellationException异常会被忽略掉
- 抛出未捕获的非CancellationException异常会取消子协程和自己，也会取消父协程，一直取消root协程，异常也会由root协程处理
- 如果使用了SupervisorJob或supervisorScope，子协程抛出未捕获的非CancellationException异常不会取消父协程，异常也会由子协程自己处理

**如何实现子协程异常了，父协程cancel的？**<br>通过Job链，<br>**SupervisorJob作用和原理**<br>作用：默认情况下，子协程发生异常后，会取消父协程、兄弟协程的执行；SupervisorJob中子协程发生异常，不会取消父协程和兄弟协程。<br>原理：当需要取消父Job 时，势必会调用到：job.childCancelled(cause) 而SupervisorJob 重写了该函数：直接返回false

## 协程并发访问？

# Flow

## 热流和冷流

Flow是冷流，ChannelFlow是热流

- 热流：无论有没有Collector(RxJava中是Subscriber)订阅，事件始终都会发生；多个订阅者是一对多的关系，多个订阅者共享信息
- 冷流：只有Collector订阅时，才开始执行发射数据流的代码；Flow和Collector是一对一关系，多个不同的订阅者，消息是重新完整发送的

# 协程面试题

## Retrofit使用协程，需要切换线程吗？

Retrofit使用协程时，不需要withContext来切换线程了，因为用的是OkHttp的enqueue异步方法，Retrofit只是包装成一个suspend方法，具体看源码：

```kotlin
suspend fun <T : Any> Call<T>.awaitResponse(): Response<T> {
    return suspendCancellableCoroutine { continuation ->
        continuation.invokeOnCancellation {
            cancel()
        }
        enqueue(object : Callback<T> {
            override fun onResponse(call: Call<T>, response: Response<T>) {
                continuation.resume(response)
            }
            
            override fun onFailure(call: Call<T>, t: Throwable) {
                continuation.resumeWithException(t)
            }
        })
    }
}
```

> 将Call#enqueue封装成suspend方法，调用的是异步的enqueue，也就是说在协程中用Retrofit+suspend是不需要切换线程的。

## 聊聊Job和SupervisorJob的区别？

### Job和SupervisorJob的区别

- Job的子协程发生异常被取消会同时取消Job的其它子协程，而SupervisorJob不会。

> Job启动了3个子协程job1、job2、job3。job1 delay 100毫秒后发生异常，协程被取消了，job2和job3也同样被取消了；SupervisorJob启动了3个子协程job1、job2、job3。job1 delay 100毫秒后发生异常，协程被取消了，job2和job3并不受影响。

### Job和SupervisorJob原理

```kotlin
public fun Job(parent: Job? = null): CompletableJob = JobImpl(parent)

public fun SupervisorJob(parent: Job? = null) : CompletableJob = SupervisorJobImpl(parent)

internal open class JobImpl(parent: Job?) : JobSupport(true), CompletableJob {
    // ...
}
private class SupervisorJobImpl(parent: Job?) : JobImpl(parent) {
    override fun childCancelled(cause: Throwable): Boolean = false
}
```

Job()返回的是JobImpl对象，SupervisorJob()返回的SupervisorJobImpl对象。而SupervisorJobImpl是JobImpl的子类，并且重写了childCancelled方法，返回值为false。JobImpl继承自JobSupport，它的childCancelled方法源码如下：

```kotlin
public open class JobSupport constructor(active: Boolean) {
    public open fun childCancelled(cause: Throwable): Boolean {
        if (cause is CancellationException) return true
        return cancelImpl(cause) && handlesException
    }
}
```

# Ref

[协程简史，一文讲清楚协程的起源、发展和实现](https://mp.weixin.qq.com/s/2q1dxT4QxsuxP3wmrUa4Ag)
