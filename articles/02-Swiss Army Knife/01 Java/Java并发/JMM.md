---
date created: 2024-12-27 23:41
date updated: 2024-12-27 23:41
dg-publish: true
---

# JMM(Java线程内存模型)

## 内存模型背景？

### 计算机的存储结构

冯诺依曼结构<br>存储结构：速度从快到慢的排序是：寄存器 -> 高速缓存 -> 内存 -> 外部存储器

### 高速缓存

**现代的CPU速度是远大于主内存的速度的，为了解决这种速度不匹配的问题，引入了缓存**。现代CPU一般有L0、L1、L2和L3三级缓存，L0是寄存器缓存，L1和L2是多核CPU每个核心都有的高速缓存，L3是多个CPU核心共享的高速缓存，每个缓存是对上一级缓存的缓存。这就引入了缓存不一致的问题。<br>每个处理器都有自己的高速缓存，而它们又共享同一主内存，如果多个处理器正在处理同一块主内存区域，那么同步到主内存时以谁的缓存数据为准呢？<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654313693218-238e64af-a794-41f2-8bca-21ca71dfd68a.png#averageHue=%23f5f8f5&clientId=ue716f6ce-db74-4&from=paste&height=265&id=BTKho&originHeight=397&originWidth=893&originalType=binary&ratio=1&rotation=0&showTitle=false&size=181274&status=done&style=none&taskId=ue6ef1e5c-85b4-43ce-818e-819bc1922a2&title=&width=595.3333333333334)

#### 缓存一致性问题 Cache Coherence

为了解决“缓存一致性”问题，就需要各个处理器访问缓存时遵循一套协议，在读写时根据协议来进行操作。JMM就可以理解为对特定的内存或高速缓存进行读写访问的过程抽象。

### 乱序

为了使得处理器内部的运算单元尽量被充分利用，提高运算效率，处理器可能会对输入的代码进行乱序执行（Out-Of-Order Execution）优化。<br>处理器会在计算之后将乱序执行的结果重组，乱序优化可以保证在单线程下该执行结果与顺序执行的结果是一致的，但不保证程序中各个语句计算的先后顺序与输入代码中的顺序一致。

#### 指令重排序问题

在多核环境下， 如果存在一个核的计算任务依赖另一个核计算任务的中间结果。而且对相关数据读写没做任何防护措施，那么其顺序性并不能靠代码的先后顺序来保证，处理器最终得出的结果和我们逻辑得到的结果可能会大不相同。

## 什么是Java内存模型？

首先Java内存模型不是“JVM 的内存模型”；<br>**Java虚拟机规范中定义了Java内存模型（Java Memory Model，JMM），用于屏蔽掉各种硬件和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的并发效果**，JMM规范了Java虚拟机与计算机内存是如何协同工作的：规定了一个线程如何和何时可以看到由其他线程修改过后的共享变量的值，以及在必须时如何同步的访问共享变量。<br>每个线程都有自己的工作内存，线程对变量的所有操作都必须在工作内存中进行，而不能直接对主内存进行操作。并且每个线程不能访问其他线程的工作内存。Java 内存模型具有一些先天的“有序性”，即不需要通过任何手段就能够得到保证的有序性，这个通常也称为** happens-before** 原则。如果两个操作的执行次序无法从 happens-before 原则推导出来，那么它们就不能保证它们的有序性，虚拟机可以随意地对它们进行重排序。

## JMM中的三大特性？怎么保证这三大特性？

**原子性，可见性，有序性 **

### 可见性

当一个线程修改了共享变量的值，其他线程能够立即得知这个修改。<br>可见性的问题就是由CPU的缓存导致的，而使用volatile修饰的变量，会引发写内存，使其他CPU缓存失效，所以volatile修饰的共享变量保证了线程间的可见性<br>**如何实现可见性？**

> JMM定义了线程在变量修改后将新值同步到主内存，其他线程在变量读取前从主内存刷新变量最新值到工作内存来实现可见性

**如何保证可见性**？

- final，通过进行重排序来实现的，

> final保证可见性的前提是未发生this引用逃逸。用final修饰数据，将数据从线程A的虚拟机栈中复制到方法区里，这样线程2就能从方法区里访问该数据

- volatile
- synchronized和锁(如Lock)，锁释放时会强制将缓存刷新到主内存

### 有序性

程序执行的顺序按照代码的先后顺序执行<br>**如何保证有序性？**

- volatile
- 加锁（synchronized和Lock等）

> Java 语言提供了 volatile 和 synchronized 两个关键字来保证线程之间操作的有序性，volatile 关键字本身就包含了禁止指令重排序的语义，而synchronized则是由“一个变量在同一个时刻 只允许一条线程对其进行lock操作”这条规则获得的，这条规则决定了持有同一个锁的两个同步块只能串行地进入。

### 原子性

即一个操作或者多个操作要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。即使在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程所干扰。<br>**如何保证原子性？**

- 加锁
- CAS
- AtomicXXX工作类

## JMM中的主内存和工作内存？它们之间如何交互的？

**主内存**：Java 内存模型规定了所有变量都存储在主内存（Main Memory）中，包括实例变量，静态变量，但是不包括局部变量和方法参数。<br>**工作内存**：包括了缓存，寄存器，编译器优化及硬件等，工作内存是一个笼统的抽象的概念，实际上并不存在。每个线程都有自己的工作内存，线程的工作内存保存了该线程用到的变量和主内存的副本拷贝，线程对变量的操作都在工作内存中进行。线程不能直接读写主内存中的变量。<br>**内存交互操作有8种：**![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1659233415723-e69644e3-803c-453a-9d43-92510284c5b9.png#averageHue=%23f5efea&clientId=u40a3f4bf-cf01-4&from=paste&id=ue6ecdc91&originHeight=420&originWidth=712&originalType=url&ratio=1&rotation=0&showTitle=false&size=50635&status=done&style=none&taskId=ua34004f4-896e-4771-8d6d-d7b85247a2d&title=)

## JMM线程工作内存有大小限制吗？

## Happens-Before规则

Happens-Before并不是说前面一个操作发生在后续操作的前面，它真正要表达的是：前面一个操作的结果对后续操作是可见的。所以比较正式的说法就是：Happens-Before约束了编译器的优化行为，虽允许编译器优化，但是要求编译器优化后一定遵循Happens-Before规则。<br>Happens-Before 的语义本质上是一种可见性，A Happens-Before B，意味着 A事件 对B事件可见。<br>**Happens-Before规则：**

1. 程序顺序性规则：这条规则是指在一个线程中，按照程序顺序，前面的操作 Happens-Before于后续的任意操作。
2. 监视器锁规则：对一个锁的解锁，happens-before于随后对这个锁的加锁。
3. volatile变量规则：对一个volatile域的写，Happens-Before于任意后续对这个volatile域的读。
4. 传递性规则：如果A Happens-Before B，且 B Happens-Before C，那么 A happens-before C。
5. start()规则：如果线程A执行操作 ThreadB.start()(启动线程B)，那么A线程的ThreadB.start() 操作Happens-Before 于线程B中的人员操作。
6. join()规则：如果线程A执行操作 ThreadB.join() 并成功返回，那么线程B中的任意操作 happens-before于线程A从ThreadB.join()操作成功返回。
7. 线程中断规则：读线程interrupt()方法的调用happens-before 于被中断线程的代码检测到中断事件的发生，
8. 对象终结规则：一个对象的初始化完成(构造函数执行结束) happens-before 于它的 finalize()方法的开始。

# JMM面试题

## **为什么Java的内存模型规范要这样定义导致出现线程本地内存和主存的值不同步呢？为啥线程要有自己的本地内存？**

利用**缓存**和**改变执行代码顺序**达到程序执行效率优化。

```java
int a1 = x;
int a2 = y;
int a3 = x;

// 可能会被转化为：
int a2 = y;
int a1 = x;
int a3 = x;
// 或者是：
int a1 = x;
int a2 = y;
int a3 = a1;
// 这样和最初的代码相比，少读x一次。
```

## volatile一定能保证线程安全吗？为什么volatile不能保证线程安全？

volatile不能一定能保证线程安全。

```java
public class VolatileTest extends Thread {

    private static volatile int count = 0;

    public static void main(String[] args) throws Exception {
        Vector<Thread> threads = new Vector<>();
        for (int i = 0; i < 100; i++) {
            VolatileTest thread = new VolatileTest();
            threads.add(thread);
            thread.start();
        }
        // 等待子线程全部完成
        for (Thread thread : threads) {
            thread.join();
        }
        // 输出结果，正确结果应该是1000，实际却是984
        System.out.println(count); // 984
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                //休眠500毫秒
                Thread.sleep(500);
            } catch (Exception e) {
                e.printStackTrace();
            }
            count++; // Non-atomic operation on volatile field 'count' 
        }
    }
}
```

可见性不能保证操作的原子性。count++不是原子性操作，会当做三步，先读取count的值，然后+1，最后赋值回去count变量。需要保证线程安全的话，需要使用synchronized关键字或者lock锁，给count++这段代码上锁：

```java
private static synchronized void add() {
    count++;
}
```
