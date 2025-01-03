---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# Handler基础

## 什么是消息机制？及特点

消息机制是Android基于**单线消息队列模式**的一套线程消息机制。<br />**消息机制特点：**

1. Handler设计策略是典型的生产者消费者模型
2. 高效，使用epoll机制，完成跨线程和超时唤醒，使消息机制在消耗极少的CPU资源情况下准确的完成调度工作

## 消息机制流程

### 消息机制流程（Java层）

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1677201632342-fd5c3d5c-b913-48ac-8ac5-c19622b2cdef.webp#averageHue=%23ebe9de&clientId=u6c1281d2-f543-4&from=paste&id=u1b253d1a&originHeight=720&originWidth=1008&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uf37e5974-4208-4271-8182-5910121b87b&title=)

#### Looper

> 用于轮询消息队列中的消息

普通的线程，可执行代码执行完成后，线程生命周期就终止了，线程就会退出；App主线程如果代码执行完了就自动退出，这是很不合理的。为了防止代码执行完，在代码中插入死循环，代码就不会执行完，线程也就不会退出了。<br />一个线程进行Looper.prepare()和Looper.loop()就变成了Looper线程（无限循环不退出的线程）<br />**Looper特点：**

- 一个线程只有一个Looper，通过ThreadLocal保证
- 主线程就是一个Looper线程，默认是在ActivityThread中初始化的

#### MessageQueue

> 消息队列用于存储消息和管理消息

消息队列，用来保存消息和安排每个消息的处理顺序。每一个Looper线程都有且仅有一个MessageQueue。<br />**MessageQueue特点：**

- 一个Looper关联一个MessageQueue
- 按照时间先后顺序排列

#### Handler

> 作用：发送消息和处理消息

- **发送消息**到MessageQueue
  - 从Handler构造器的looper拿到关联的MessageQueue
  - 默认构造Handler的Looper是当前线程（前提是当前线程是Looper线程）
- **处理消息**(message.target就是Handler)

#### Message

消息实体

- 单链表的结构
- 建议使用Message的`obtain()`方法复用全局消息池中**sPool**的消息，默认最大是50

### 消息机制原理（native）

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1677429998957-074ace9b-0a2e-454f-98f1-5099c5166abd.webp#averageHue=%23293843&clientId=uafed1f85-603e-4&from=paste&id=u56a450c5&originHeight=1420&originWidth=1464&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7625b2fb-8adc-443e-9268-aed2fcc9068&title=)

#### 消息机制初始化过程

消息机制初始化流程就是Handler、Looper和MessageQueue三者的初始化流程。<br />**Handler初始化：**

- 不能在不是Looper线程中初始化
- 构造参数async可设置为异步消息处理器

**Looper初始化：**<br />Looper.prepare()开始：

- new一个Looper实例，并构造出一个MessageQueue
- Looper放到线程私有变量ThreadLocal中

**MessageQueue初始化：**<br />MessageQueue

- 构造方法调用_nativeInit()_初始化Native层的消息队列
- _nativeInit()_会调用Native层的Looper构造函数初始化Native层的Looper
- Native层Looper构造函数中调用_rebuildEpollLocked()_函数，调用_epoll_create1()_系统调用创建一个**epoll实例**，然后再调用_epoll_ctl()_系统调用给epoll实例添加一个唤醒事件文件描述符

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1677432800991-bbf3f658-13db-4394-934e-545ef8343333.webp#averageHue=%23293842&clientId=uafed1f85-603e-4&from=paste&height=346&id=udf0ba52f&originHeight=423&originWidth=881&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u39ae61d6-f5b0-43ca-b169-8a888854931&title=&width=721)

#### 消息轮询过程

- 从Java层Looper.loop()开始，调用MessageQueue.next()获取下一条要处理的消息

```java
// MessageQueue
Message next() {
    // 1.如果nextPollTimeoutMillis=-1，一直阻塞不会超时。
    // 2.如果nextPollTimeoutMillis=0，不会阻塞，立即返回。
    // 3.如果nextPollTimeoutMillis>0，最长阻塞nextPollTimeoutMillis毫秒(超时)
    int nextPollTimeoutMillis = 0; // 如果期间有程序唤醒会立即返回。
    for (;;) {
        if (nextPollTimeoutMillis != 0) {
            Binder.flushPendingCommands();
        }
        nativePollOnce(ptr, nextPollTimeoutMillis);
        synchronized (this) {
            // Try to retrieve the next message.  Return if found.
            // 获取系统开机到现在的时间
            final long now = SystemClock.uptimeMillis();
            Message prevMsg = null;
            Message msg = mMessages; // 消息链表头部
            // 如果当前msg不为null且msg的target为null，即当前为一个同步屏障。
            if (msg != null && msg.target == null) {
                // Stalled by a barrier.  Find the next asynchronous message in the queue.
                do {
                    prevMsg = msg;
                    msg = msg.next;
                } while (msg != null && !msg.isAsynchronous()); // 循环遍历，一直往后找到第一个异步的消息
            }
            if (msg != null) {
                if (now < msg.when) { // 先判断时间有没有到，如果没到的话设置一下阻塞时间，场景如常用的postDelay
                    // Next message is not ready.  Set a timeout to wake up when it is ready.
                    // 计算出离执行时间还有多久赋值给nextPollTimeoutMillis，表示nativePollOnce方法要等待nextPollTimeoutMillis时长后返回
                    nextPollTimeoutMillis = (int) Math.min(msg.when - now, Integer.MAX_VALUE);
                } else { // 取出来的时间不大于当前时间
                    // Got a message.
                    mBlocked = false;
                    // 链表操作，获取msg并且删除该节点 
                    if (prevMsg != null) { // 【有异步消息】 prevMsg只在前面的异步消息赋值，
                        prevMsg.next = msg.next;
                    } else {
                        mMessages = msg.next; // 【同步消息】获取到了消息，链表头执行msg的下一个
                    }
                    msg.next = null; // 当前msg的next置空
                    if (DEBUG) Log.v(TAG, "Returning message: " + msg);
                    msg.markInUse();
                    return msg;
                }
            } else {
                // No more messages.  // 没有消息，nextPollTimeoutMillis复位；一直阻塞不会超时
                nextPollTimeoutMillis = -1;
            }

            // Process the quit message now that all pending messages have been handled.
            if (mQuitting) {
                dispose();
                return null;
            }

            // If first time idle, then get the number of idlers to run.
            // Idle handles only run if the queue is empty or if the first message
            // in the queue (possibly a barrier) is due to be handled in the future.
            if (pendingIdleHandlerCount < 0
                    && (mMessages == null || now < mMessages.when)) {
                pendingIdleHandlerCount = mIdleHandlers.size();
            }
            if (pendingIdleHandlerCount <= 0) {
                // No idle handlers to run.  Loop and wait some more.
                mBlocked = true;
                continue;
            }

            if (mPendingIdleHandlers == null) {
                mPendingIdleHandlers = new IdleHandler[Math.max(pendingIdleHandlerCount, 4)];
            }
            mPendingIdleHandlers = mIdleHandlers.toArray(mPendingIdleHandlers);
        }
    }
}
```

- next()方法通过_**nativePollOnce(ptr, nextPollTimeoutMillis)**_JNI方法检查当前消息队列是否有新的消息要处理
- _nativePollOnce()_会调用_NativeMessageQueue_的_pollOnce()_方法，然后调用Native层Looper的pollOnce()方法，Native层Looper的pollOnce方法会把timeout参数传到_epoll_wait()_系统调用中去，epoll_wait会等待事件的产生
  - 当MessageQueue中没有更多消息时，传到epoll_wait的timeout值为-1，这时线程会一直阻塞，直到新的消息到来（这就是Looper死循环不会导致CPU飙高，因为线程阻塞了
  - nativePollOnce调用后，检查当前消息是不是同步屏障，是的话就找出并返回异步消息给Looper，不是的话则找出下一条到了发送时间的非异步消息

#### 消息发送过程

- 从Handler的sendMessage开始，最后调用MessageQueue的enqueueMessage方法把消息加入到MQ中
- Mesage是单链表，发送的消息按照时间先后顺序排列
- enqueueMessage方法还会判断是否需要唤醒消息轮询线程，通过_nativeWake()_调用NativeMessageQueue的_wake()_方法
- NativeMessageQueue的wake()方法又会调用Native层Looper的_wake()_方法，通过_write()_系统调用写入一个**W**字符到唤醒事件描述符中，这时监听这个唤醒事件文件描述符的消息轮询线程就会被唤醒

#### 消息处理过程

- 从Looper的loopOnce()方法中开始，获取到消息后，调用Message的target即Handler的**dispatchMessage()**方法
  - 判断Message是否有callback，有就执行该callback的run方法
  - 如果Message没有callback，看Handler是否有Callback，有的话交给它处理
  - 如果没有Handler的Callback，那么调用dispatchMessage处理

# Handler进阶

## Handler同步屏障

### 什么是同步屏障？

同步屏障就是阻碍同步消息，只让异步消息通过<br />这个屏障其实就是一个Message，插入在MessageQueue的链表头，且其target=null

### 同步屏障消息处理

1. 当消息队列开启同步屏障的时候（即标识为msg.target==null），消息机制在处理消息的时候，优先处理异步消息。这样，同步屏障就起到了一种过滤和优先级的作用。
2. 同步屏障不会自动移除，需要手动移除，否则造成同步消息无法被处理

### 同步屏障使用场景

1. 界面刷新

```java
// Post消息屏障到消息队列
@UnsupportedAppUsage
void scheduleTraversals() {
    if (!mTraversalScheduled) {
        mTraversalScheduled = true;
        // 设置消息屏障
        // 这里会返回Token ， 删除的时候会以此为依据进行删除
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        mChoreographer.postCallback(
            Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        if (!mUnbufferedInputDispatch) {
            scheduleConsumeBatchedInput();
        }
        notifyRendererOfFramePending();
        pokeDrawLockIfNeeded();
    }
}
```

## IdleHandler

### 什么是IdleHandler？

当MQ为空或目前没有需要执行的Message时会回调的接口对象。

### IdleHandler执行逻辑

- MQ为空了
- MQ不为空，但第一条Message的执行时间是在未来

### IdleHandler应用场景

1. ActivityThread中，系统GC的时机

```java
void scheduleGcIdler() {
    if (!mGcIdlerScheduled) {
        mGcIdlerScheduled = true;
        Looper.myQueue().addIdleHandler(mGcIdler);
    }
    mH.removeMessages(H.GC_WHEN_IDLE);
}
final class GcIdler implements MessageQueue.IdleHandler {
    @Override
    public final boolean queueIdle() {
        doGcIfNeeded();
        return false;
    }
}
```

2. Activity onDestory调用时机

> Activity的onDestroy依赖IdleHandler；即上一个Activity的onDestroy总是会在上一个Activity准备好后再执行

3. 提供一个Android没有的声明周期回调时机
4. 结合HandlerThread实现消息通知
5. IdleHandler-Android 启动优化之延时加载(等主线程空闲下来)

<https://www.jianshu.com/p/545cf65c4f5e>

## HandlerThread

**什么是HandlerThread？**

- 是一个带Looper的线程
- 任务是串行的

**使用场景**

- 后台耗时顺序执行的任务（串行）
- 实现单一子线程消息队列

## IntentService

IntentService是继承于Service并处理异步请求的一个类，在IntentService内有一个工作线程来处理耗时操作，启动IntentService的方式和启动传统Service一样，同时，当任务执行完后，IntentService会自动停止，而不需要我们去手动控制。<br />可以启动IntentService多次，而每一个耗时操作会以工作队列的方式在IntentService的onHandleIntent回调方法中执行，并且，每次只会执行一个工作线程，执行完第一个再执行第二个，以此类推。

## epoll机制?

**select**

1. 单个进程能够监视的文件描述符的数量存在最大限制，通常是1024，当然可以更改数量，但由于select采用轮询的方式扫描文件描述符，文件描述符数量越多，性能越差；(在linux内核头文件中，有这样的定义：#define __FD_SETSIZE 1024)
2. 内核 / 用户空间内存拷贝问题，select需要复制大量的句柄数据结构，产生巨大的开销；
3. select返回的是含有整个句柄的数组，应用程序需要遍历整个数组才能发现哪些句柄发生了事件；
4. select的触发方式是水平触发，应用程序如果没有完成对一个已经就绪的文件描述符进行IO操作，那么之后每次select调用还是会将这些文件描述符通知进程。

**poll**<br />poll使用链表保存文件描述符，因此没有了监视文件数量的限制<br />**epoll**<br />epoll是Linux内核的可扩展I/O事件通知机制。于Linux 2.5.44首度登场，它设计目的旨在取代既有POSIX select与poll系统函数，让需要大量操作文件描述符的程序得以发挥更优异的性能。epoll 实现的功能与 poll 类似，都是监听多个文件描述符上的事件。<br />epoll 通过使用红黑树(RB-tree)搜索被监控的文件描述符(file descriptor)。在 epoll 实例上注册事件时，epoll 会将该事件添加到 epoll 实例的红黑树上并注册一个回调函数，当事件发生时会将事件添加到就绪链表中。<br />epoll实现了高性能的I/O多路复用，还使用mmap加速内核与用户空间的消息传递。

### epoll挂起的原理？

### select、poll和epoll区别？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675962081185-3fc15fe0-8c16-42ed-a026-c74778ba1f9a.png#averageHue=%23f8f7f6&clientId=u9df65f43-8a96-4&from=paste&height=475&id=zBfwa&originHeight=713&originWidth=1251&originalType=binary&ratio=1&rotation=0&showTitle=false&size=216936&status=done&style=none&taskId=u26cb5dea-b9b9-4077-8310-0ac0e75ca80&title=&width=834)

# 面试题

## Handler相关

### handler延时消息是如何实现的？

delay的消息通过`SystemClock.uptimeMillis()+delay`，然后enqueueMessage到MQ中，根据message.when和当前时间计算出一个`nextPollTimeoutMillis`值，这个值用来控制消息延迟的。<br />nextPollTimeoutMillis决定了堵塞与否，以及堵塞的时间，三种情况：

- 等于0，不阻塞立即返回
- 大于0，最长阻塞等待时间，期间有新消息进来，可能会立即执行
- 等于-1，无消息时，会一直阻塞

### Handler是如何能够线程切换？

**Handler创建的时候会采用当前线程的Looper来构造消息循环系统**，Looper在哪个线程创建，就跟哪个线程绑定，并且Handler是在他关联的Looper对应的线程中处理消息的。<br />所以在不同的线程中使用Handler发送消息后，这个消息是在Handler所关联Looper的线程中处理，也就能实现了线程的切换。

### Handler内存泄漏Activity引用链？

> Java虚拟机中使用**可达性分析**的算法来决定对象是否可以被回收。即通过GCRoot对象为起始点，向下搜索走过的路径（引用链），如果发现某个对象或者对象组为不可达状态，则将其进行回收。
> 而内存泄漏指的就是有些对象（短周期对象）没有用了，但是却被其他有用的类（长周期对象）所引用，从而导致无用对象占据了内存空间，形成内存泄漏。

内存泄漏完整的引用链应该是：<br />**主线程 —> threadlocal —> Looper —> MessageQueue —> Message —> Handler —> Activity**

### [Handler的runWithScissors()了解吗？为什么Google不让开发者用？](https://segmentfault.com/a/1190000041634297)

> 如何在子线程，通过 Handler 向主线程发送一个任务，并等主线程处理此任务后，再继续执行？

**什么是runWithScissors()**<br />被标记成了`@hide`；将任务发送到Handler所在的线程执行任务，通过wait实现，任务未完成时wait等待，任务完成后就return了<br />**Framework中哪里使用了？**<br />WMS 启动流程中，分别在 main() 和 initPolicy() 中，通过 runWithScissors() 切换到 "android.display" 和 "android.ui" 线程去做一些初始工作。<br />**runWithScissors()的问题？**

1. 如果超时了，没有取消的逻辑

通过 runWithScissors() 发送 Runnable 时，可以指定超时时间。当超时唤醒时，是直接 false 退出。<br />那么当超时退出时，这个 Runnable 依然还在目标线程的 MessageQueue 中，并没有被移除掉，它最终还是会被 Handler 线程调度并执行。此时的执行，显然并不符合我们的业务预期。

2. 可能造成死锁

使用 runWithScissors() 可能造成调用线程进入阻塞，而得不到唤醒，如果当前持有别的锁，还会造成死锁。<br />我们通过 Handler 发送的 MessageQueue 的消息，一般都会得到执行，而当线程 Looper 通过 quit() 退出时，会清理掉还未执行的任务，此时发送线程，则永远得不到唤醒。

3. 安全使用 runWithScissors() 要满足 2 个条件（二选一）
   - Handler 的 Looper 不允许退出，例如 Android 主线程 Looper 就不允许退出
   - Looper 退出时，使用安全退出 quitSafely() 方式退出；

### Handler发送消息的delay设置是否可靠？

不可靠。<br />当Handler所属的线程（UI线程）要处理的内容非常多，当Looper出现事件积压的时候会使得delay不可靠。如ANR的出现就是一个最极端的代表例子。

## Looper相关

### 消息队列空的话，主线程的 looper 也会结束吗？

不会

### looper 什么时候结束？在后台是怎么被阻塞的？

### Looper为什么要死循环？

对于线程即是一段可执行的代码，当可执行代码执行完成后，线程生命周期便该终止了，线程退出。而对于主线程，我们是绝不希望会被运行一段时间，自己就退出，那么如何保证能一直存活呢？简单做法就是可执行代码是能一直执行下去的，死循环便能保证不会被退出，例如，binder线程也是采用死循环的方法，通过循环方式不同与Binder驱动进行读写操作，当然并非简单地死循环，无消息时会休眠。<br />Android事件驱动的系统，主线程就是死循环，不停地处理各种消息。Android中主线程就是ActivityThread，在其main方法就创建了Looper并调用了loop方法

```java
public class ActivityThread {
    public static void main(String[] args) {
        Looper.prepareMainLooper();
        ActivityThread thread = new ActivityThread();
        thread.attach(false, startSeq);
        Looper.loop();
        throw new RuntimeException("Main thread loop unexpectedly exited");
    }
}
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1655225062175-d36b4a06-e0ef-4f9d-86a4-360ce97e4389.png#averageHue=%235a463e&clientId=u8a1d9553-3267-4&from=paste&id=GraSO&originHeight=961&originWidth=1200&originalType=url&ratio=1&rotation=0&showTitle=false&size=594090&status=done&style=none&taskId=u35f32292-b71e-4ea8-b771-7306b941353&title=)

### Looper的loop死循环为啥不会卡死ANR？

但当没有 Message 的时候，会调用 pollOnce() 并通过 Linux 的 epoll 机制进入等待并释放资源。同时 eventFd 会监听 Message 抵达的写入事件并进行唤醒。

### Looper主线程的死循环一直运行是不是特别消耗CPU资源呢？

其实不然，这里就涉及到Linux pipe/epoll机制，简单说就是在主线程的MessageQueue没有消息时，便阻塞在loop的queue.next()中的nativePollOnce()方法里，此时主线程会释放CPU资源进入休眠状态，直到下个消息到达或者有事务发生，通过往pipe管道写端写入数据来唤醒主线程工作。这里采用的epoll机制，是一种IO多路复用机制，可以同时监控多个描述符，当某个描述符就绪(读或写就绪)，则立刻通知相应程序进行读或写操作，本质同步I/O，即读写是阻塞的。 所以说，主线程大多数时候都是处于休眠状态，并不会消耗大量CPU资源。

> Android应用程序的主线程在进入消息循环过程前，会在内部创建一个Linux管道（Pipe），这个管道的作用是使得Android应用程序主线程在消息队列为空时可以进入空闲等待状态，并且使得当应用程序的消息队列有消息需要处理时唤醒应用程序的主线程。 Android应用程序的主线程进入空闲等待状态的方式实际上就是在管道的读端等待管道中有新的内容可读，具体来说就是是通过Linux系统的Epoll机制中的epoll_wait函数进行的。当往Android应用程序的消息队列中加入新的消息时，会同时往管道中的写端写入内容，通过这种方式就可以唤醒正在等待消息到来的应用程序主线程。
> 主线程Looper从消息队列读取消息，当读完所有消息时，主线程阻塞。子线程往消息队列发送消息，并且往管道文件写数据，主线程即被唤醒，从管道文件读取数据，主线程被唤醒只是为了读取消息，当消息读取完毕，再次睡眠。因此**loop的循环并不会对CPU性能有过多的消耗**。

### Looper.loop死循环不会ANR和Activity中的onCreate方法死循环会ANR？

`Looper.loop()的阻塞`和`UI线程上执行耗时操作卡死`是有区别的：

1. 首先这两之间一点联系都没有，完全两码事。
2. Looper上的阻塞，前提是没有输入事件，MQ可能为空（有可能有延时的Message），Looper空闲状态（当前时间点肯定没有可执行的Message），线程进入阻塞（`nativePollOnce(waitTime)`，进行休眠），释放CPU执行权，等待唤醒
3. UI耗时导致卡死，前提是要有输入事件，MQ不为空，Looper正常轮询，线程没有阻塞，但是该事件执行时间超过5秒，而且与此期间其他的事件（按键按下、屏幕点击）都没办法处理，导致了ANR

### 主线程 Main Looper 和一般 Looper 的异同

- Main Looper 不可 quit；而其他线程的 Looper 则可以也必须手动 quit
- Main Looper 实例还被静态缓存

### Looper 等待的时候线程到底是什么状态？

调用 Linux 的 epoll 机制进入等待，事实上 Java 侧打印该线程的状态，你会发现线程处于 Runnable 状态，只不过 CPU 资源被暂时释放。

### 如何保证MessageQueue并发访问安全？

加锁，在MessageQueue的next方法中的死循环中，加了synchronized，锁是MQ对象实例。

### 怎么拦截三方SDK的某个Handler消息

1. 反射获取到三方SDK的handler
2. 创建Handler实例时，注册一个Callback进去，这样消息就优先分发给Callback处理，然后再分发给dispatchMessage处理

```java
public void dispatchMessage(@NonNull Message msg) {
    if (msg.callback != null) {
        handleCallback(msg);
    } else {
        if (mCallback != null) {
            if (mCallback.handleMessage(msg)) {
                return;
            }
        }
        handleMessage(msg);
    }
}
```

### Handler removeMessage what=0会发生什么？

使用Handler post的Runnable的what值为0，Runnable会被封装成what=0的Message；在移除Message what=0的Message时，并不会判断Runnable的值，只要what值相同就会被移除，所以会把所有的Runnable都移除掉，不管你是post Runnable的还是postDelayed Runnable的。

## IdleHandler

### MessageQueue.next()中，如果没有消息先调用了nativePollOne阻塞了，那还怎么执行IdleHandler？

nativePollOnce(ptr, nextPollTimeoutMillis)是否阻塞得看nextPollTimeoutMillis的值：

- nextPollTimeoutMillis=0 不阻塞，代表马上有消息要处理了
- nextPollTimeoutMillis>0 阻塞等待 timeout nextPollTimeoutMillis时间，代表未来某个时间有消息处理
- nextPollTimeoutMillis=-1 一直阻塞，直到被唤醒nativeWake（采用epoll机制，不占用CPU）

### 为什么Printer无法监控IdleHandler anr的原因

## Message

### Message怎么获取？如何实现？Android系统还有什么代码是这样设计的？

通过`Message.obtain()`从Message的`sPool`静态变量中获取链表头的Message；<br />sPool是Message中一个静态变量，数据结构为单链表，最大容量为50。

系统中的还有哪些类似Message这样设计的：

- MotionEvent的`gRecyclerTop`，最大为10
- TouchTarget的`sRecycleBin`，最大32

## 其他

### 如何监听ActivityThread mH 类的消息

1. 拿到`mH`关联的Looper，在Looper 里面设置一个` private Printer mLogging;  `，当打印的时候就可以知道当前在分发mH 类的任何消息。
2. 反射mH，给mH设置一个Callback；原理：Handler 消息分发的源码，我们可以看到，首先会分发给mCallback，如果我们反射给mH 设置一个我们的callBack，监听到Start Activity 的消息，返回true ，就不会再分发给mH 了

```java
public void dispatchMessage(Message msg) {
    if (msg.callback != null) {
        handleCallback(msg);
    } else {
        if (mCallback != null) {
            if (mCallback.handleMessage(msg)) {
                return;
            }
        }
        handleMessage(msg);
    }
}

```

```java
public static void hookH(){
    try {
        Class<?> activityThread = Class.forName("android.app.ActivityThread");
        Field sCurrentActivityThread = activityThread.getDeclaredField("sCurrentActivityThread");
        sCurrentActivityThread.setAccessible(true);
        Object currentActivityThread = sCurrentActivityThread.get(null);

        Field mH = activityThread.getDeclaredField("mH");
        mH.setAccessible(true);
        Handler handler = (Handler) mH.get(currentActivityThread);

        Field callBack = Handler.class.getDeclaredField("mCallback");
        callBack.setAccessible(true);

        callBack.set(handler,new Handler.Callback(){

            @Override
            public boolean handleMessage(Message msg) {
                Log.d(TAG, "handleMessage: msg " + msg);

                return false;
            }
        });
    } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException e) {
        e.printStackTrace();
    }
}

```

### 主线程的消息循环机制是什么？

对于线程即是一段可执行的代码，当可执行代码执行完成后，线程生命周期便该终止了，线程退出。而对于主线程，我们是绝不希望会被运行一段时间，自己就退出，那么如何保证能一直存活呢？简单做法就是可执行代码是能一直执行下去的，死循环便能保证不会被退出，例如，binder线程也是采用死循环的方法，通过循环方式不同与Binder驱动进行读写操作，当然并非简单地死循环，无消息时会休眠。<br />ActivityThread的main方法主要就是做消息循环，一旦退出消息循环，那么你的程序也就可以退出了。<br />另外，ActivityThread实际上并非线程，不像HandlerThread类，ActivityThread并没有真正继承Thread类。<br />ActivityThread的调用是在Zygote进程fork App进程时，反射调用其main方法的。

```java
// ProcessList
boolean startProcessLocked() {
    final String entryPoint = "android.app.ActivityThread"; // 进程的入口类，创建进程后会反射调用里面的main方法
    return startProcessLocked(hostingRecord, entryPoint, app, uid, gids,
                    runtimeFlags, zygotePolicyFlags, mountExternal, seInfo, requiredAbi,
                    instructionSet, invokeWith, startTime);
}
```

### 有同步屏障，取到了异步消息，但未到时间；有同步屏障未取到异步消息，分别怎么处理？

- 有同步屏障，取到了异步消息，但未到时间

> epoll阻塞剩下的时间

- 有同步屏障未取到异步消息

> epoll无限期阻塞

### View.post到底何时执行？会不会执行？

**结论：**<br />API24(Android7.0)之前，在View没有AttachToWindow是调用在Activity#onCreate子线程中View.post可能不执行；API24后，子线程和主线程View.post都会执行

- View已经attachedToWindow，可正常执行
  - 直接通过AttachInfo的handler post到主线程执行
- Android以下，View没有attachedToWindow，Runnable会缓存到runQueues中（sRunQueues是存放在ThreadLocal）
  - 在主线程中post，存到了主线程的sRunQueues，在performTraversals中执行，从sRunQueues中可以取出来的缓存的Runnable，可以正常执行
  - 在子线程中post，存到了子线程的sRunQueues，从sRunQueues中可以取出来的主线程的为空，**因此不执行**
- Android24及以上，mRunQueue是View的变量，主/子线程post都可以正常执行（在dispatchAttachedToWindow中调用sRunQueue）

**View.post源码：**

```java
// API24及以上
public boolean post(Runnable action) {
    final AttachInfo attachInfo = mAttachInfo;
    if (attachInfo != null) {
        return attachInfo.mHandler.post(action);
    }
    // Postpone the runnable until we know on which thread it needs to run.
    // Assume that the runnable will be successfully placed after attach.
    getRunQueue().post(action);
    return true;
}
private HandlerActionQueue mRunQueue;
private HandlerActionQueue getRunQueue() {
    if (mRunQueue == null) {
        mRunQueue = new HandlerActionQueue();
    }
    return mRunQueue;
}

// API24以下
public boolean post(Runnable action) {
    final AttachInfo attachInfo = mAttachInfo;
    if (attachInfo != null) {
        return attachInfo.mHandler.post(action);
    }
    // Assume that post will succeed later
    ViewRootImpl.getRunQueue().post(action);
    return true;
}
// ViewRootImpl.java
static RunQueue getRunQueue() {
    RunQueue rq = sRunQueues.get();
    if (rq != null) {
        return rq;
    }
    rq = new RunQueue();
    sRunQueues.set(rq);
    return rq;
}
```
