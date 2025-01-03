---
date created: 2024-12-27 23:40
date updated: 2024-12-27 23:40
dg-publish: true
tags:
  - '#countDown}'
  - '#await}'
---

# AQS

## 什么是AQS？

AQS(AbstractQueuedSynchronizer)，这可谓是Doug Lea老爷子的大作之一。AQS即是抽象队列同步器，是用来构建Lock锁和同步组件的基础框架，很多我们熟知的锁和同步组件都是基于AQS构建，它使用了一个int成员变量表示同步状态，通过内置的FIFO队列来完成资源获取线程的排队工作，比如ReentrantLock、ReentrantReadWriteLock、CountDownLatch、Semaphore。并发包的大师（Doug Lea）期望它能够成为实现大部分同步需求的基础。

## 锁的分类

![](https://cdn.nlark.com/yuque/0/2022/jpeg/694278/1670778149038-8762051f-51bf-417f-8cf9-1aa48dd659de.jpeg#averageHue=%23fefefe&clientId=u608e3f6d-c2b3-4&from=paste&height=539&id=uc202e73f&originHeight=949&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uef13370a-52df-4c97-b944-9be0948095f&title=&width=613)

### 公平锁和非公平锁

**公平锁：**<br>公平锁是指多个线程按照申请锁的顺序来获取锁，线程直接进入队列中排队，队列中的第一个线程才能获得锁。公平锁的优点是**等待锁的线程不会饿死**。缺点是_**整体吞吐效率相对非公平锁要低，等待队列中除第一个线程以外的所有线程都会阻塞，CPU唤醒阻塞线程的开销比非公平锁大**_。<br>**非公平锁：**<br>非公平锁是多个线程加锁时直接尝试获取锁，获取不到才会到等待队列的队尾等待。但如果此时锁刚好可用，那么这个线程可以无需阻塞直接获取到锁，所以非公平锁有可能出现后申请锁的线程先获取锁的场景。非公平锁的优点是**可以减少唤起线程的开销，整体的吞吐效率高**，因为线程有几率不阻塞直接获得锁，CPU不必唤醒所有线程。缺点是处于_**等待队列中的线程可能会饿死，或者等很久才会获得锁**_。<br>ReentrantLock代码示例：<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1670815238150-25fa258e-2f66-48af-89e9-4ef6a92eddfa.png#averageHue=%23f9f9f9&clientId=u608e3f6d-c2b3-4&from=paste&height=420&id=u7c251bc3&originHeight=630&originWidth=1449&originalType=binary&ratio=1&rotation=0&showTitle=false&size=512647&status=done&style=none&taskId=u0de5af1a-43f5-4932-a14c-a3a407c78ce&title=&width=966)

### 可重入锁和不可重入锁

可不可以重入看对state的操作，可重入锁state会一直累加，不可重入锁只有1<br>**可重入锁：**<br>可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，再进入该线程的内层方法会自动获取锁（前提锁对象得是同一个对象或者class），不会因为之前已经获取过还没释放而阻塞。Java中ReentrantLock和synchronized都是可重入锁，可重入锁的一个优点是可一定程度避免死锁。<br>**不可重入锁：**<br>同一个线程对同一把锁在释放之前不能获取多次，否则会出现死锁的情况。<br>示例ReentrantLock和NonReentrantLock<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1670815273504-e69418a0-9718-44db-919a-5b40bfcc74c1.png#averageHue=%23f9f9f9&clientId=u608e3f6d-c2b3-4&from=paste&height=637&id=ue73698be&originHeight=956&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=760444&status=done&style=none&taskId=u9ab2789f-1050-4a35-ac35-629f3891223&title=&width=960)

### 独占锁(排他锁)和共享锁

**排他锁：**<br>独享锁也叫排他锁，是指该锁一次只能被一个线程所持有。如果线程T对数据A加上排它锁后，则其他线程不能再对A加任何类型的锁。获得排它锁的线程即能读数据又能修改数据。JDK中的synchronized和JUC中Lock的实现类就是互斥锁。<br>**共享锁：**<br>共享锁是指该锁可被多个线程所持有。如果线程T对数据A加上共享锁后，则其他线程只能对A再加共享锁，不能加排它锁。获得共享锁的线程只能读数据，不能修改数据。<br>ReentrantReadWriteLock是共享锁

## AQS的原理？

AQS核心思想是，如果被请求的共享资源空闲，那么就将当前请求的线程设置为有效的工作线程，将共享资源设置为锁定状态；如果共享资源被占用，就需要一定的阻塞等待唤醒机制来保证锁分配；这个机制主要用的是CLH队列的变体实现的，将暂时获取不到锁的线程加入到队列中。<br>**主要原理图：**<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1670815375024-4943fdcf-b870-4d57-b568-4ead1287b192.png#averageHue=%23fbfbfb&clientId=u608e3f6d-c2b3-4&from=paste&height=200&id=uac65ba23&originHeight=300&originWidth=1126&originalType=binary&ratio=1&rotation=0&showTitle=false&size=51603&status=done&style=none&taskId=u1eb4a259-6eb6-494d-9fd1-d4c025097fb&title=&width=750.6666666666666)<br>**state：**<br>AQS使用一个volatile的int类型的成员变量(state)来表示同步状态，通过内置的FIFO队列(CLH)来完成资源获取的排队工作，通过CAS完成对state值的修改<br>**AQS有两种模式**<br>分别是独占模式和共享模式。自定义同步器实现的相关方法也只是为了通过修改state字段值来实现多线程的独占模式和共享模式。<br>一般来说，自定义同步器要么是独占模式，要么是共享模式，它们只需要实现`tryAcquire()-tryRelease()`、`tryAcquireShared()-tryReleaseShared()`中的一种即可。

# AQS应用：基于AQS的实现？

## ReentrantLock 独占锁(排他锁)，可重入锁

ReentrantLock是基于AQS实现的独占锁、可重入锁

### ReentrantLock使用

从Java 5开始，引入了一个高级的处理并发的java.util.concurrent包，它提供了大量更高级的并发功能，能大大简化多线程程序的编写。<br>我们知道Java语言直接提供了synchronized关键字用于加锁，但这种锁一是`很重`，二`是获取时必须一直等待，没有额外的尝试机制`。

1. ReentrantLock是可重入、排他锁，它和synchronized一样，一个线程可以多次获取同一个锁
2. synchronized是Java语言层面提供的语法，所以我们不需要考虑异常，而ReentrantLock是Java代码实现的锁，我们就必须先获取锁，然后在finally中正确释放锁
3. 使用ReentrantLock.tryLock()尝试获取锁，线程在tryLock()失败的时候不会导致死锁

使用synchronized示例：

```java
public class Counter {
    private int count;

    public void add(int n) {
        synchronized(this) {
            count += n;
        }
    }
}
```

如果用ReentrantLock替代，可以把代码改造为：

```java
public class Counter {
    private final Lock lock = new ReentrantLock();
    private int count;

    public void add(int n) {
        lock.lock();
        try {
            count += n;
        } finally {
            lock.unlock();
        }
    }
}
```

尝试获取锁：

```java
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        ...
    } finally {
        lock.unlock();
    }
}
```

> 上述代码在尝试获取锁的时候，最多等待1秒。如果1秒后仍未获取到锁，tryLock()返回false，程序就可以做一些额外处理，而不是无限等待下去。

示例：

```java
public class TestReentrantLock {
    final Lock lock = new ReentrantLock(false);
    class Worker extends Thread {
        public void run() {
            lock.lock();
            System.out.println(Thread.currentThread().getName() + "-" + Utils.format());
            try {
                Utils.second(1);
            } finally {
                lock.unlock();
            }
        }
    }
    public void test() {
        // 启动10个子线程
        for (int i = 0; i < 100; i++) {
            Worker w = new Worker();
            //w.setDaemon(true);
            w.start();
        }
        // 主线程每隔1秒换行
        for (int i = 0; i < 10; i++) {
            Utils.second(1);
            //System.out.println();
        }
    }
    public static void main(String[] args) {
        TestReentrantLock testMyLock = new TestReentrantLock();
        testMyLock.test();
    }
}
```

### ReentrantLock原理

以非公平锁的来看ReentrantLock实现原理。<br>使用ReentrantLock前，需要new一个实例出来：

```java
ReentrantLock lock = new ReentrantLock(false);
```

其中构造参数fair：true代表是公平锁，false代表的是非公平锁，默认是非公平锁，来看看源码：

```java
public ReentrantLock() {
    sync = new NonfairSync();
}
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

现在来看下`NonfairSync`和`FairSync`，两个都继承`Sync`，先看看Sync。<br>Sync是继承自`AbstractQueuedSynchronizer`，

```java
// ReentrantLock
abstract static class Sync extends AbstractQueuedSynchronizer {
    abstract void lock(); // 获取锁，子类重写 
    final boolean nonfairTryAcquire(int acquires) {
        final Thread current = Thread.currentThread(); // 获取当前线程实例
        int c = getState(); // 获取state
        if (c == 0) { // c等于0，表示没有线程获取到锁
            if (compareAndSetState(0, acquires)) { // 尝试获取锁，并设置state为acquires
                setExclusiveOwnerThread(current); // 设置当前线程
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) { // 已经有线程获取到锁了，那么检查下是不是当前线程，如果是，进来
            int nextc = c + acquires;  // 再次state状态+acquires
            if (nextc < 0) // overflow
                throw new Error("Maximum lock count exceeded");
            setState(nextc); // 更新state为新的状态
            return true;
        }
        return false;
    }
    protected final boolean tryRelease(int releases) {
        int c = getState() - releases;
        if (Thread.currentThread() != getExclusiveOwnerThread())
            throw new IllegalMonitorStateException();
        boolean free = false;
        if (c == 0) {
            free = true;
            setExclusiveOwnerThread(null);
        }
        setState(c);
        return free;
    }
    protected final boolean isHeldExclusively() {
        return getExclusiveOwnerThread() == Thread.currentThread();
    }
    final ConditionObject newCondition() {
        return new ConditionObject();
    }
    final Thread getOwner() {
        return getState() == 0 ? null : getExclusiveOwnerThread();
    }
    final int getHoldCount() {
        return isHeldExclusively() ? getState() : 0;
    }
    final boolean isLocked() {
        return getState() != 0;
    }
}
```

#### lock 获取锁

```java
// ReentrantLock#Sync
abstract static class Sync extends AbstractQueuedSynchronizer {
    final boolean nonfairTryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0) // overflow
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}

// 非公平锁ReentrantLock#NonfairSync.java
static final class NonfairSync extends Sync {
    private static final long serialVersionUID = 7316153563782823691L;
    final void lock() {
        if (compareAndSetState(0, 1)) // 1
            setExclusiveOwnerThread(Thread.currentThread()); // 2
        else
            acquire(1); // 3
    }
    protected final boolean tryAcquire(int acquires) { // 4
        return nonfairTryAcquire(acquires);
    }
}
// 公平锁ReentrantLock#NonfairSync.java
static final class FairSync extends Sync {
    private static final long serialVersionUID = -3000897897090466540L;

    final void lock() {
        acquire(1);
    }
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}

// AbstractQueuedSynchronizer.java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

1. 我们通过ReentrantLock调用lock()来尝试获取锁，非公平锁是通过CAS将state从0改成1，如果成功就进入到2；
2. 调用setExclusiveOwnerThread设置锁为独占模式，保留当前线程
3. 非公平锁中如果state从0改为1失败后，就会调用acquire()，acquire()又会调用tryAcquire()方法；公平锁是直接调用`acquire(1)`
4. 非公平锁NonfairSync的tryAcquire调用的是nonfairTryAcquire()；公平锁是调用`FairSync#tryAcquire()`，两者的一个区别就是公平锁多了`!hasQueuedPredecessors()`判断逻辑

##### 线程加入等待队列

**加入队列时机**<br>当执行Acquire(1)时，会通过tryAcquire获取锁。在这种情况下，如果获取锁失败，就会调用addWaiter加入到等待队列中去。

**如何加入队列**<br>获取锁失败(即`tryAcquire()`返回了false)后，会执行`addWaiter(Node.EXCLUSIVE)`加入等待队列，具体实现方法如下：

```java
// java.util.concurrent.locks.AbstractQueuedSynchronizer
private Node addWaiter(Node mode) {
    Node node = new Node(mode);

    for (;;) {
        Node oldTail = tail;
        if (oldTail != null) {
            U.putObject(node, Node.PREV, oldTail);
            if (compareAndSetTail(oldTail, node)) {
                oldTail.next = node;
                return node;
            }
        } else {
            initializeSyncQueue();
        }
    }
}
private final boolean compareAndSetTail(Node expect, Node update) {
    return U.compareAndSwapObject(this, TAIL, expect, update);
}
```

新来的线程会排到队列后面

**等待队列中线程出队列时机**<br>addWaiter方法，这个方法其实就是把对应的线程以Node的数据结构形式加入到双端队列里，返回的是一个包含该线程的Node。而这个Node会作为参数，进入到acquireQueued方法中。acquireQueued方法可以对排队中的线程进行“获锁”操作。

一个线程获取锁失败了，被放入等待队列，acquireQueued会把放入队列中的线程不断去获取锁，直到获取成功或者不再需要获取（中断）。

```java
// // java.util.concurrent.locks.AbstractQueuedSynchronizer
final boolean acquireQueued(final Node node, int arg) {
    try {
        // 标记等待过程中是否中断过
        boolean interrupted = false;
        for (;;) { // 开始自旋，要么获取锁，要么中断
            // 获取当前节点的前驱节点
            final Node p = node.predecessor(); 
            // 如果p是头结点，说明当前节点在真实数据队列的首部，就尝试获取锁（别忘了头结点是虚节点）
            if (p == head && tryAcquire(arg)) {
                // 获取锁成功，头指针移动到当前node
                setHead(node);
                p.next = null; // help GC
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } catch (Throwable t) {
        cancelAcquire(node);
        throw t;
    }
}
```

- shouldParkAfterFailedAcquire
- parkAndCheckInterrupt主要用于挂起当前线程，阻塞调用栈，返回当前线程的中断状态。

#### 释放锁

```
// java.util.concurrent.locks.ReentrantLock
public void unlock() {
	sync.release(1);
}
```

#### ReentrantLock公平锁和非公平锁核心源码

**公平锁**

```java
static final class FairSync extends Sync {
    private static final long serialVersionUID = -3000897897090466540L;
    final void lock() {
        acquire(1);
    }
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}
```

**非公平锁**

```java
static final class NonfairSync extends Sync {
    private static final long serialVersionUID = 7316153563782823691L;
    final void lock() {
        if (compareAndSetState(0, 1))
            setExclusiveOwnerThread(Thread.currentThread());
        else
            acquire(1);
    }
    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires);
    }
}
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

## ReentrantReadWriteLock 共享锁

synchronized和ReentrantLock都是独占锁，这些锁在同一时刻只允许一个线程进行访问，而读写锁在同一时刻可以允许多个读线程访问，但在写线程访问时，所有的读线程和其他写线程均被阻塞。<br>ReentrantReadWriteLock维护了一对锁，一个读锁和一个写锁，通过分离读锁和写锁，使得并发性相比一般的独占锁有了很大提升。<br>一棒情况下，读写锁的性能都会比独占锁好，因为大多数场景读是对于写的，在读多余写的情况下，读写锁能够提供比独占锁更好的并发性和吞吐量。

## CountDownLatch 让一个线程等待多个线程同时运行完成后

### CountDownLatch介绍

CountDownLatch是一个同步工具类，用来协调多个线程之间的同步，或者说起到线程之间的通信（而不是用作互斥的作用）。<br>CountDownLatch能够使一个线程在等待另外一些线程完成各自工作之后，再继续执行。使用一个计数器进行实现。计数器初始值为线程的数量。当每一个线程完成自己任务后，计数器的值就会减一。当计数器的值为0时，表示所有的线程都已经完成一些任务，然后在CountDownLatch上等待的线程就可以恢复执行接下来的任务。

> CountDownLatch在多线程并发编程中充当⼀个计时器的功能，它维护了⼀个count的变量，并且其操作都是原⼦操作，该类主要通过countDown()和await()两个⽅法来实现功能的：⾸先通过建⽴CountDownLatch对象，传⼊的参数即为count初始值。如果⼀个线程调⽤了await()⽅法，那么这个线程便进⼊阻塞状态并同时进⼊阻塞队列。如果⼀个线程调⽤了countDown()⽅法，则会使count-1，当count的值为0时，这时候阻塞队列中调⽤await()⽅法的线程便会逐个被唤醒并出队，从⽽进⼊后续的操作。

### CountDownLatch使用

#### 方法

##### countDown

- public void countDown()

递减锁存器的计数，如果计数到达零，则释放所有等待的线程。如果当前计数大于零，则将计数减少

##### wait

```java
public boolean await(long timeout,TimeUnit unit) throws InterruptedException
参数：timeout-要等待的最长时间 unit-timeout 参数的时间单位
返回值：如果计数到达零，则返回true；如果在计数到达零之前超过了等待时间，则返回false
抛出：InterruptedException-如果当前线程在等待时被中断
```

使当前线程在锁存器倒计数至零之前一直等待，除非线程被中断或超出了指定的等待时间。如果当前计数为零，则此方法立刻返回true值。如果当前计数大于零，则出于线程调度目的，将禁用当前线程，且在发生以下三种情况之一前，该线程将一直出于休眠状态：<br>1. 由于调用countDown()方法，计数到达零，则该方法返回true值。<br>2. 如果当前线程，在进入此方法时已经设置了该线程的中断状态；或者在等待时被中断，则抛出InterruptedException，并且清除当前线程的已中断状态。<br>3. 如果超出了指定的等待时间，则返回值为false。如果该时间小于等于零，则该方法根本不会等待

#### 使用场景

1. 某一线程在开始运行前等待n个线程执行完毕。将CountDownLatch的计数器初始化为new CountDownLatch(n)，每当一个任务线程执行完毕，就将计数器减1 countdownLatch.countDown()，当计数器的值变为0时，在CountDownLatch上await()的线程就会被唤醒。一个典型应用场景就是启动一个服务时，主线程需要等待多个组件加载完毕，之后再继续执行。
2. 实现多个线程开始执行任务的最大并行性。注意是并行性，不是并发，强调的是多个线程在某一时刻同时开始执行。类似于赛跑，将多个线程放到起点，等待发令枪响，然后同时开跑。做法是初始化一个共享的CountDownLatch(1)，将其计算器初始化为1，多个线程在开始执行任务前首先countdownlatch.await()，当主线程调用countDown()时，计数器变为0，多个线程同时被唤醒。

#### 案例

1. 主线程等待子线程执行完成在执行

```java
/**
 * 主线程等待子线程执行完成再执行
 */
public class CountdownLatchTest1 {
    public static void main(String[] args) {
        final CountDownLatch latch = new CountDownLatch(3);
        ExecutorService service = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 3; i++) {
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    try {
                        System.out.println("--->>>子线程" + Thread.currentThread().getName() + "开始执行");
                        Thread.sleep((long) (Math.random() * 10000));
                        System.out.println("--->>>子线程" + Thread.currentThread().getName() + "执行完成");
                        latch.countDown();//当前线程调用此方法，则计数减一
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            };
            service.execute(runnable);
        }
        try {
            System.out.println("主线程" + Thread.currentThread().getName() + "等待子线程执行完成...");
            latch.await();//阻塞当前线程，直到计数器的值为0
            System.out.println("主线程" + Thread.currentThread().getName() + "开始执行...");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

输出：

```
--->>>子线程pool-1-thread-2开始执行
主线程main等待子线程执行完成...
--->>>子线程pool-1-thread-1开始执行
--->>>子线程pool-1-thread-3开始执行
--->>>子线程pool-1-thread-2执行完成
--->>>子线程pool-1-thread-1执行完成
--->>>子线程pool-1-thread-3执行完成
主线程main开始执行...
```

1. 百米赛跑，4名运动员选手到达场地等待裁判口令，裁判一声口令，选手听到后同时起跑，当所有选手到达终点，裁判进行汇总排名

```java
/**
 * 百米赛跑，4名运动员选手到达场地等待裁判口令，裁判一声口令，选手听到后同时起跑，当所有选手到达终点，裁判进行汇总排名 <br/>
 */
public class CountdownLatchTest2 {

    public static void main(String[] args) {
        ExecutorService service = Executors.newCachedThreadPool();
        final CountDownLatch cdOrder = new CountDownLatch(1);
        final CountDownLatch cdAnswer = new CountDownLatch(4);
        for (int i = 0; i < 4; i++) {
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    try {
                        System.out.println("-->>选手" + Thread.currentThread().getName() + "正在等待裁判发布口令");
                        cdOrder.await();
                        System.out.println("-->>选手" + Thread.currentThread().getName() + "已接受裁判口令");
                        Thread.sleep((long) (Math.random() * 10000));
                        System.out.println("-->>选手" + Thread.currentThread().getName() + "到达终点");
                        cdAnswer.countDown();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            };
            service.execute(runnable);
        }
        try {
            Thread.sleep((long) (Math.random() * 10000));
            System.out.println("裁判" + Thread.currentThread().getName() + "即将发布口令");
            cdOrder.countDown();
            System.out.println("裁判" + Thread.currentThread().getName() + "已发送口令，正在等待所有选手到达终点");
            cdAnswer.await();
            System.out.println("所有选手都到达终点");
            System.out.println("裁判" + Thread.currentThread().getName() + "汇总成绩排名");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        service.shutdown();
    }
}
```

输出：

```
-->>选手pool-1-thread-3正在等待裁判发布口令
-->>选手pool-1-thread-1正在等待裁判发布口令
-->>选手pool-1-thread-4正在等待裁判发布口令
-->>选手pool-1-thread-2正在等待裁判发布口令
裁判main即将发布口令
裁判main已发送口令，正在等待所有选手到达终点
-->>选手pool-1-thread-3已接受裁判口令
-->>选手pool-1-thread-1已接受裁判口令
-->>选手pool-1-thread-2已接受裁判口令
-->>选手pool-1-thread-4已接受裁判口令
-->>选手pool-1-thread-2到达终点
-->>选手pool-1-thread-4到达终点
-->>选手pool-1-thread-3到达终点
-->>选手pool-1-thread-1到达终点
所有选手都到达终点
裁判main汇总成绩排名
```

### CancelableCountDownLatch -- from ARouter

```java
public class CancelableCountDownLatch extends CountDownLatch {
    /**
     * Constructs a {@code CountDownLatch} initialized with the given count.
     *
     * @param count the number of times {@link #countDown} must be invoked
     *              before threads can pass through {@link #await}
     * @throws IllegalArgumentException if {@code count} is negative
     */
    public CancelableCountDownLatch(int count) {
        super(count);
    }

    public void cancel() {
        while (getCount() > 0) {
            countDown();
        }
    }
}
```

## Condition

### 什么是Condition?

Condition是在java 1.5中才出现的，它用来替代传统的Object的wait()、notify()实现线程间的协作，相比使用Object的wait()、notify()，使用Condition的await()、signal()这种方式实现线程间协作更加安全和高效。因此通常来说比较推荐使用Condition，阻塞队列实际上是使用了Condition来模拟线程间协作。

- Condition是个接口，基本的方法就是await()和signal()方法；
- Condition依赖于Lock接口，生成一个Condition的基本代码是lock.newCondition()
- 调用Condition的await()和signal()方法，都必须在lock保护之内，就是说必须在lock.lock()和lock.unlock之间才可以使用Conditon中的await()对应Object的wait()（同Object Monitor Methods的wait()和notify()、notifyAll()方法必须在synchronized{}代码块中调用一样）；
- Condition中的signal()对应Object的notify()；
- Condition中的signalAll()对应Object的notifyAll()。

### 和Object Monitor Methods对比

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687451775544-4ac7f6c8-00bb-4b64-b120-2b44f524e89d.png#averageHue=%23ebebeb&clientId=u276ecb22-f8b1-4&from=paste&height=328&id=u5d048b7c&originHeight=238&originWidth=500&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud9a8a358-b547-469e-8737-ffe69340123&title=&width=690)

### Condition使用

#### 常用方法

1. await()

造成当前线程在接到信号或被中断之前一直处于等待状态
2.  await(long time, TimeUnit unit)

造成当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态
3.  awaitNanos(long nanosTimeout)

造成当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态。返回值表示剩余时间，如果在nanosTimesout之前唤醒，那么返回值 = nanosTimeout - 消耗时间，如果返回值 <= 0 ,则可以认定它已经超时了。
4.  awaitUninterruptibly()

造成当前线程在接到信号之前一直处于等待状态。【注意：该方法对中断不敏感】。
5.  awaitUntil(Date deadline)

造成当前线程在接到信号、被中断或到达指定最后期限之前一直处于等待状态。如果没有到指定时间就被通知，则返回true，否则表示到了指定时间，返回返回false。
6.  signal()

同notify()；唤醒一个等待线程。该线程从等待方法返回前必须获得与Condition相关的锁
7.  signalAll()

同notifyAll()；唤醒所有等待线程。能够从等待方法返回的线程必须获得与Condition相关的锁

#### 案例

```java
public class ConditionUseCase {

    public Lock lock = new ReentrantLock();
    public Condition condition = lock.newCondition();

    public static void main(String[] args)  {
        ConditionUseCase useCase = new ConditionUseCase();
        ExecutorService executorService = Executors.newFixedThreadPool (2);
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                useCase.conditionWait();
            }
        });
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                useCase.conditionSignal();
            }
        });
    }

    public void conditionWait()  {
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + "拿到锁了");
            System.out.println(Thread.currentThread().getName() + "等待信号");
            condition.await();
            System.out.println(Thread.currentThread().getName() + "拿到信号");
        } catch (Exception e){

        } finally {
            lock.unlock();
        }
    }
    public void conditionSignal() {
        lock.lock();
        try {
            Thread.sleep(5000);
            System.out.println(Thread.currentThread().getName() + "拿到锁了");
            condition.signal();
            System.out.println(Thread.currentThread().getName() + "发出信号");
        } catch (Exception e){

        } finally {
            lock.unlock();
        }
    }
}
```

### Condition原理分析

#### 等待队列

Condition是AQS的内部类。等待队列是一个FIFO的队列，在队列中的每个节点都包含了一个线程引用，该线程就是在Condition对象上等待的线程，如果一个线程调用了Condition.await()方法，那么该线程将会释放锁、构造成节点加入等待队列并进入等待状态<br>一个Condition包含一个等待队列，Condition拥有首节点（firstWaiter）和尾节点（lastWaiter）。当前线程调用Condition.await()方法，将会以当前线程构造节点，并将节点从尾部加入等待队列，等待队列的基本结构如下图所示：<br>![](https://note.youdao.com/yws/res/104777/6B3558B28D054D1B9E63AE12E8615EDE#id=LqGd8&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687451825687-8bb62c76-6b0a-4f17-90fa-160bbc4427a5.png#averageHue=%23fdfbf8&clientId=u276ecb22-f8b1-4&from=paste&id=u821747bb&originHeight=255&originWidth=732&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua0820c45-ae66-47f7-a87f-86e4f799a04&title=)<br>如图所示，Condition拥有首尾节点的引用，而新增节点只需要将原有的尾节点nextWaiter指向它，并且更新尾节点即可。上述节点引用更新的过程并没有使用CAS保证，原因在于调用await()方法的线程必定是获取了锁的线程，也就是说该过程是由锁来保证线程安全的。在Object的监视器模型上，一个对象拥有一个同步队列和等待队列，而并发包中的Lock（更确切地说是同步器）拥有一个同步队列和多个等待队列，其对应关系如下图所示：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687451837327-a7df8877-a248-4eac-bf5f-524bf3ffe323.png#averageHue=%23fefefc&clientId=u276ecb22-f8b1-4&from=paste&id=ud28a8738&originHeight=427&originWidth=732&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6e92af3f-c8d8-4e0f-81fc-0086c037e67&title=)

#### 等待

调用Condition的await()方法（或者以await开头的方法），会使当前线程进入等待队列并释放锁，同时线程状态变为等待状态。当从await()方法返回时，当前线程一定获取了Condition相关联的锁。如果从队列（同步队列和等待队列）的角度看await()方法，当调用await()方法时，相当于同步队列的首节点（获取了锁的节点）移动到Condition的等待队列中

```java
public final void await() throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    // 当前线程加入等待队列
    Node node = addConditionWaiter();
    // 释放同步状态，也就是释放锁
    int savedState = fullyRelease(node);
    int interruptMode = 0;
    while (!isOnSyncQueue(node)) {
        LockSupport.park(this);
        if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
            break;
    }
    if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
        interruptMode = REINTERRUPT;
    if (node.nextWaiter != null)
        unlinkCancelledWaiters();
    if (interruptMode != 0)
        reportInterruptAfterWait(interruptMode);
}
```

调用该方法的线程成功获取了锁的线程，也就是同步队列中的首节点，该方法会将当前线程构造成节点并加入等待队列中，然后释放同步状态，唤醒同步队列中的后继节点，然后当前线程会进入等待状态。当等待队列中的节点被唤醒，则唤醒节点的线程开始尝试获取同步状态。如果不是通过其他线程调用Condition.signal()方法唤醒，而是对等待线程进行中断，则会抛出InterruptedException

#### 通知

调用Condition的signal()方法，将会唤醒在等待队列中等待时间最长的节点（首节点），在唤醒节点之前，会将节点移到同步队列中：

```java
public final void signal() {
    if (!isHeldExclusively())
        throw new IllegalMonitorStateException();
    Node first = firstWaiter;
    if (first != null)
        doSignal(first);
}
```

调用该方法的前置条件是当前线程必须获取了锁，可以看到signal()方法进行了isHeldExclusively()检查，也就是当前线程必须是获取了锁的线程。接着获取等待队列的首节点，将其移动到同步队列并使用LockSupport唤醒节点中的线程<br>节点从等待队列移动到同步队列的过程如下图所示:<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687451856751-1cbd61a9-0ab9-4e6c-a62e-3f01e9dc22d5.png#averageHue=%23f6ccab&clientId=u276ecb22-f8b1-4&from=paste&id=u9a3b6944&originHeight=299&originWidth=732&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue6c87404-e1d9-4b05-94a2-1f61be74a54&title=)<br>通过调用同步器的enq(Node node)方法，等待队列中的头节点线程安全地移动到同步队列。当节点移动到同步队列后，当前线程再使用LockSupport唤醒该节点的线程。被唤醒后的线程，将从await()方法中的while循环中退出（isOnSyncQueue(Node node)方法返回true，节点已经在同步队列中），进而调用同步器的acquireQueued()方法加入到获取同步状态的竞争中。成功获取同步状态（或者说锁）之后，被唤醒的线程将从先前调用的await()方法返回，此时该线程已经成功地获取了锁。<br>Condition的signalAll()方法，相当于对等待队列中的每个节点均执行一次signal()方法（注意是这个Condition对应的等待队列），效果就是将等待队列中所有节点全部移动到同步队列中，并唤醒每个节点的线程。

## ThreadPoolExecutor#Worker

是一把不可重入的锁

## 如何用AQS实现可重入锁？

ReentrantLock的可重入性是AQS很好的应用之一，分公平锁和非公平锁<br>**公平锁**

```java
// java.util.concurrent.locks.ReentrantLock.FairSync#tryAcquire
if (c == 0) {
	if (!hasQueuedPredecessors() && compareAndSetState(0, acquires)) {
		setExclusiveOwnerThread(current);
		return true;
	}
}
else if (current == getExclusiveOwnerThread()) {
	int nextc = c + acquires;
	if (nextc < 0)
		throw new Error("Maximum lock count exceeded");
	setState(nextc);
	return true;
}
```

**非公平锁**

```java
// java.util.concurrent.locks.ReentrantLock.Sync#nonfairTryAcquire
if (c == 0) {
	if (compareAndSetState(0, acquires)){
		setExclusiveOwnerThread(current);
		return true;
	}
}
else if (current == getExclusiveOwnerThread()) {
	int nextc = c + acquires;
	if (nextc < 0) // overflow
		throw new Error("Maximum lock count exceeded");
	setState(nextc);
	return true;
}
```

通过同步状态state来控制整体可重入的情况，state是volatile修饰的，保证了可见性和有序性。

- state初始化的时候为0，表示没有任何线程持有锁
- 当有线程持有锁时，state=state+1，通过一个线程多次获得锁会多加次1，这就是可重入的概念
- 解锁也是对这个字段-1，一直减到0，此线程对锁释放

## 如何用AQS实现不可重入锁？

JDK已有：线程池的Worker就是一个AQS，实现了一个不可重入锁，state只能为1和0，1表示获得锁，0表示未获得锁

```java
private final class Worker extends AbstractQueuedSynchronizer implements Runnable {	
    protected boolean isHeldExclusively() {
        return getState() != 0;
    }
    protected boolean tryAcquire(int unused) {
        if (compareAndSetState(0, 1)) {
            setExclusiveOwnerThread(Thread.currentThread());
            return true;
        }
        return false;
    }
    protected boolean tryRelease(int unused) {
        setExclusiveOwnerThread(null);
        setState(0);
        return true;
    }
    public void lock()        { acquire(1); }
    public boolean tryLock()  { return tryAcquire(1); }
    public void unlock()      { release(1); }
    public boolean isLocked() { return isHeldExclusively(); }
}
```

自定义同步器实现不可重入锁：state只能为0或1

```java
@Override
protected boolean tryAcquire(int arg) {
    if (compareAndSetState(0, 1)) {
        setExclusiveOwnerThread(Thread.currentThread());
        return true;
    }
    return false;
}

/*释放锁*/
@Override
protected boolean tryRelease(int arg) {
    if (getState() == 0) {
        throw new IllegalMonitorStateException();
    }
    setExclusiveOwnerThread(null);
    setState(0);
    return true;
}
```

# AQS面试题

## 某个线程获取锁失败的后续流程是什么呢？

存在某种排队等候机制，线程继续等待，仍然保留获取锁的可能，获取锁流程仍在继续。<br>某种排队等候机制，**是CLH变体的FIFO双端队列**。在AQS中是acquire()方法，失败后加入到CLH队列中去，并自旋获取锁

## **如果处于排队等候机制中的线程一直无法获取锁，需要一直等待么？还是有别的策略来解决这一问题？**

线程所在节点的状态会变成取消状态，取消状态的节点会从队列中释放
