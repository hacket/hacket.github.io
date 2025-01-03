---
date created: 2024-06-13 08:29
date updated: 2024-12-24 00:37
dg-publish: true
---

# Trace 基础

## 线程状态查看

`Systrace` 会用不同的颜色来标识不同的线程状态, 在每个方法上面都会有对应的线程状态来标识目前线程所处的状态，通过查看线程状态我们可以知道目前的瓶颈是什么, 是 cpu 执行慢还是因为 Binder 调用, 又或是进行 io 操作, 又或是拿不到 cpu 时间片。

线程状态主要有下面几个

### 绿色 : 运行中（running）

只有在该状态的线程才可能在 cpu 上运行。而同一时刻可能有多个线程处于可执行状态，这些线程的 `task_struct` 结构被放入对应 cpu 的可执行队列中（一个线程最多只能出现在一个 cpu 的可执行队列中）。调度器的任务就是从各个 cpu 的可执行队列中分别选择一个线程在该 cpu 上运行。

作用：我们经常会查看 `Running` 状态的线程，查看其运行的时间，与竞品做对比，分析快或者慢的原因：

1. 是否频率不够？
2. 是否跑在了小核上？
3. 是否频繁在 Running 和 Runnable 之间切换？为什么？
4. 是否频繁在 Running 和 Sleep 之间切换？为什么？
5. 是否跑在了不该跑的核上面？比如不重要的线程占用了超大核

旧版本：
![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406130826433.png)

新版：
![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406130827058.png)

### 蓝色 : 可运行（Runnable）

线程可以运行但当前没有安排，在等待 cpu 调度。
**作用：** Runnable 状态的线程状态持续时间越长，则表示 cpu 的调度越忙，没有及时处理到这个任务：

1. 是否后台有太多的任务在跑？
2. 没有及时处理是因为频率太低？
3. 没有及时处理是因为被限制到某个 `cpuset` 里面，但是 cpu 很满？
4. 此时 Running 的任务是什么？为什么？

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406140023481.png)

### 白色 : 休眠中（Sleep）

线程没有工作要做，可能是因为线程在互斥锁上被阻塞。
**作用 ：** 这里一般是在等事件驱动

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406140042330.png)

### 橘色 : 不可中断的睡眠态 （Uninterruptible Sleep - IO Block）

线程在I / O上被阻塞或等待磁盘操作完成，一般底线都会标识出此时的 `callsite` ：`wait_on_page_locked_killable`

**作用：** 这个一般是标示 io 操作慢，如果有大量的橘色不可中断的睡眠态出现，那么一般是由于进入了低内存状态，申请内存的时候触发 `pageFault`, linux 系统的 `page cache` 链表中有时会出现一些还没准备好的 page(即还没把磁盘中的内容完全地读出来) , 而正好此时用户在访问这个 page 时就会出现 `wait_on_page_locked_killable` 阻塞了. 只有系统当 io 操作很繁忙时, 每笔的 io 操作都需要等待排队时, 极其容易出现且阻塞的时间往往会比较长。

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406140045026.png)

### 紫色 : 不可中断的睡眠态（Uninterruptible Sleep）

线程在另一个内核操作（通常是内存管理）上被阻塞。

**作用：** 一般是陷入了内核态，有些情况下是正常的，有些情况下是不正常的，需要按照具体的情况去分析

![image.png|2000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406140045742.png)

## 线程唤醒信息分析

Systrace 会标识出一个非常有用的信息，可以帮助我们进行线程调用等待相关的分析。

一个线程被唤醒的信息往往比较重要，知道他被谁唤醒，那么我们也就知道了他们之间的调用等待关系，如果一个线程出现一段比较长的 sleep 情况，然后被唤醒，那么我们就可以去看是谁唤醒了这个线程，对应的就可以查看唤醒者的信息，看看为什么唤醒者这么晚才唤醒。

- 一个常见的情况是：应用主线程程使用 `Binder` 与 `SystemServer` 的 `AMS` 进行通信，但是恰好 AMS 的这个函数正在等待锁释放（或者这个函数本身执行时间很长），那么应用主线程就需要等待比较长的时间，那么就会出现性能问题，比如响应慢或者卡顿，这就是为什么后台有大量的进程在运行，或者跑完 Monkey 之后，整机性能会下降的一个主要原因
- 另外一个场景的情况是：应用主线程在等待此应用的其他线程执行的结果，这时候线程唤醒信息就可以用来分析主线程到底被哪个线程 Block 住了，比如下面这个场景，这一帧 doFrame 执行了 152ms，有明显的异常，但是大部分时间是在 sleep

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240616235105.png)
这时候放大来看，可以看到是一段一段被唤醒的，这时候点击图中的 runnable ，下面的信息区就会出现唤醒信息，可以顺着看这个线程到底在做什么
![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240616235359.png)
20424 线程是 RenderHeartbeat，这就牵扯到了 App 自身的代码逻辑，需要 App 自己去分析

Systrace 可以标示出这个的一个原因是，一个任务在进入 Running 状态之前，会先进入 Runnable 状态进行等待，而 Systrace 会把这个状态也标示在 Systrace 上（非常短，需要放大进行看）

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240616235743.png)

拉到最上面查看对应的 cpu 上的 taks 信息，会标识这个 task 在被唤醒之前的状态：

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240616235803.png)

**Linux 常见的进程状态：**

1. **D** 无法中断的休眠状态（通常 IO 的进程）；
2. **R** 正在可运行队列中等待被调度的；
3. **S** 处于休眠状态；
4. **T** 停止或被追踪；
5. **W** 进入内存交换 （从内核2.6开始无效）；
6. **X** 死掉的进程 （基本很少見）；
7. **Z** 僵尸进程；
8. **<** 优先级高的进程
9. **N** 优先级较低的进程
10. **L** 有些页被锁进内存
11. **s** 进程的领导者（在它之下有子进程）
12. **l** 多进程的（使用 CLONE_THREAD, 类似 NPTL pthreads）
13. **+** 位于后台的进程组

## 信息区数据解析

### 线程状态信息解析

![image.png|1200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240616235918.png)

### 函数 `Slice` 信息解析

![image.png|1200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617000147.png)

- **Wall Duration**  函数执行时间（包含等待时间）
- **Self Time** 函数执行时间（不包含等待时间）

### Counter Sample 信息解析

![image.png|1200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617000416.png)

### Async Slice 信息解析

![image.png|1200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617000511.png)

### CPU Slice 信息解析

![image.png|1200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240617000600.png)
