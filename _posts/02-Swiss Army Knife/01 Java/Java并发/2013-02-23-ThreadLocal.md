---
banner: 
date_created: Friday, February 23rd 2013, 10:10:45 pm
date_updated: Friday, April 18th 2025, 11:46:05 pm
title: ThreadLocal
author: hacket
categories:
  - Java&Kotlin
category: Java并发
tags: [多线程, Java并发]
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
date created: 2024-12-27 23:40
date updated: 2024-12-27 23:40
aliases: [ThreadLocal]
linter-yaml-title-alias: ThreadLocal
---

# ThreadLocal

## 什么是 ThreadLocal？

ThreadLocal 类用来提供线程内部的局部变量。这些变量在多线程环境下访问 (通过 get 或 set 方法访问) 时能保证各个线程里的变量相对独立于其他线程内的变量，ThreadLocal 实例通常来说都是 private static 类型。<br>总结：**ThreadLocal 不是为了解决多线程访问共享变量安全问题；而是为每个线程创建一个单独的变量副本，提供了保持对象的方法和避免参数传递的复杂性；实现线程之间的数据隔离。**<br> ThreadLocal 的主要应用场景为按线程多实例（每个线程对应一个实例）的对象的访问，并且这个对象很多地方都要用到。例如：同一个网站登录用户，每个用户服务器会为其开一个线程，每个线程中创建一个 ThreadLocal，里面存用户基本信息等，在很多页面跳转时，会显示用户信息或者得到用户的一些信息等频繁操作，这样多线程之间并没有联系而且当前线程也可以及时获取想要的数据。

## ThreadLocal 原理

每个 Thread 内部有一个 `threadLocals` 变量，类型为 `ThreadLocal.ThreadLocalMap`<br>ThreadLocalMap 是一个 Map，保存的 Entry 是个弱引用，value 为对应的数据<br>**set 存数据**<br>拿到当前线程关联的 ThreadLocalMap，以当前 ThreadLocal 为 key 存储到当前线程的 threadLocals 中去<br>**get 取数据**<br>获取当前线程的 ThreadLocalMap threadLocals，以当前 ThreadLocal 实例为 key 去取数据

## ThreadLocal 哪里用到了

- Android 中的 Looper **sThreadLocal**，将 Looper 对象保存到了 sThreadLocal 中，保证每个线程只能有一个 Looper 实例
- Android AnimationHandler，处理时间脉冲的类，提供给所有属性动画 ValueAnimators 使用
- Android Choreographer **sThreadInstance**
- RecyclerView prefetch **sGapWorker** 用来保存 GapWorker

## ThreadLocal 使用小结

- 一个 ThreadLocal 实例可以被多个线程使用，因为每个线程中都有自己的 ThreadLocalMap，key 为 ThreadLocal
- 一个线程可以保存多个 ThreadLocal，保存在 threadLocals 中
- `ThreadLocal` 一般是作为 `private static final` 字段，避免 ThreadLocal 实例被 GC 回收了，导致 key 为 null
- ThreadLocalMap 的 key 用的是 WeakReference，GC 时会被清理掉 key 为 null 的 value，但是还是建议你显示的做好 remove() 移除动作，否则容易造成内存泄漏（key 为 null 时，在下次 set/get/remove 前 value 泄漏了）
- **只能解决非引用的基本数据类型线程安全问题，引用类型解决不了**

## ThreadLocal 注意

### ThreadLocal 不能解决共享变量的线程安全问题

的 ThreadLocal 绑定的是 Immutable 不可变变量，如字符串等，那结论尚能成立，但若绑定的是引用类型的变量那就不行，这是因为保存的是引用，一处修改，其他线程也都跟着修改了<br>**解决传递参数的复杂性，在线程生命周期内传递**<br>提供线程内的局部变量，这种变量在线程的生命周期内起作用，减少同一个线程内多个函数或者组件之间一些公共变量的传递的复杂度。但由于线程独享的特点被用来作为线程安全的一种解决方式，空间换时间。

### ThreadLocal 内存泄漏问题

**ThreadLocal 内存泄漏原因**<br>threadLocalMap 使用 ThreadLocal 的弱引用作为 key，如果一个 ThreadLocal 不存在外部强引用时，Key(ThreadLocal) 势必会被 GC 回收，这样就会导致 ThreadLocalMap 中 key 为 null，而 value 还存在着强引用，只有 thead 线程退出以后,value 的强引用链条才会断掉。但如果当前线程再迟迟不结束的话，在这段时间这些 key 为 null 的 Entry 的 value 就会一直存在一条强引用链：

> Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value

在当前线程未结束这段时间，value 数据的 key 为 null，value 占用的内存就一直泄漏了<br>![ue04e](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ue04e.png)<br>**内存泄漏解决：**

1. 使用 ThreadLocal，建议用 static 修饰 `static ThreadLocal<HttpHeader> headerLocal = new ThreadLocal();`，避免 ThreadLocal 实例没有引用指向了，导致线程中的 threadLocals 的 key 为 null，只有 value
2. 使用完 ThreadLocal 后，执行 remove 操作，避免出现内存溢出情况。

### 为什么 ThreadLocalMap#Entry 的 key 使用弱引用而不是强引用？

1. key 使用强引用<br>当 ThreadLocalMap 的 key 为强引用 ThreadLocal 时，当 ThreadLocalRef 断开时，这时 ThreadLocal 对象理应被 GC 回收。但因为 ThreadLocalMap 还持有 ThreadLocal 的强引用，如果没有手动从 ThreadLocalMap 中删除，ThreadLocal 不会被回收，导致 ThreadLocal 对象及关联的 value 内存泄漏
2. key 使用弱引用<br>当 ThreadLocalMap 的 key 为弱引用回收 ThreadLocal 时，由于 ThreadLocalMap 持有 ThreadLocal 的弱引用，即使没有手动删除，ThreadLocal 也会被回收。当 key 为 null，在下一次 ThreadLocalMap 调用 set(),get()，remove() 方法的时候会被清除 value 值。

### ThreadLocal 在线程池使用的问题

在线程池的线程使用 ThreadLocal 时，一个线程设置的数据可能残留在 ThreadLocal 里面，等下一个线程使用的时候可能直接拿到之前操作残留的数据，导致数据的污染问题。

### ThreadLocal 和同步机制相比

在同步机制中，通过对象的锁机制保证同一时间只有一个线程访问变量。这时该变量是多个线程共享的，使用同步机制要求程序缜密地分析什么时候对变量进行读写，什么时候需要锁定某个对象，什么时候释放对象锁等繁杂的问题。<br>ThreadLocal 从另外一个角度来解决线程的并发访问，ThreadLocal 会为每个线程提供独立的变量副本 (threadLocals，其实就是个 ThreadLocalMap)，从而隔离了多个线程对数据的访问冲突。因为每个线程都拥有自己的变量副本，从而没有必要对该变量进行同步了，**只能解决非引用的基本数据类型线程安全问题**。<br>同步机制采用了时间换空间的方式，而 ThreadLocal 采用了空间换时间的方法；同步机制仅提供一份变量，让不同的线程排队访问，而 ThreadLocal 为每个线程都提供了一份变量，可以同时访问而不互相影响。

### 小结

通过**ThreadLocal**可以解决 `多线程读` 共享数据的问题，因为共享数据会被复制到每个线程，不需要加锁便可同步访问。但**ThreadLocal**解决不了 `多线程写` 共享数据的问题，因为每个线程写的都是自己本线程的局部变量，并没将写数据的结果同步到其他线程。理解了这一点，才能理解所谓的：

- **ThreadLocal**以空间换时间，提升多线程并发的效率。什么意思呢？每个线程都有一个**ThreadLocalMap**映射表，正是利用了这个映射表所占用的空间，使得多个线程都可以访问自己的这片空间，不用担心考虑线程同步问题，效率自然会高。
- **ThreadLocal**并不是为了解决共享数据的**互斥写**问题，而是通过一种编程手段，正好提供了**并行读**的功能。什么意思呢？**ThreadLocal**并不是万能的，它的设计初衷只是提供一个便利性，使得线程可以更为方便地使用局部变量。
- **ThreadLocal**提供了一种线程全域访问功能，什么意思呢？一旦将一个对象添加到**ThreadLocal**中，只要不移除它，那么，在线程的生命周期内的任何地方，都可以通过**ThreadLocal.get()** 方法拿到这个对象。有时候，代码逻辑比较复杂，一个线程的代码可能分散在很多地方，利用**ThreadLocal**这种便利性，就能简化编程逻辑。

# Ref

- [Java ThreadLocal的演化、实现和场景](https://duanqz.github.io/2018-03-15-Java-ThreadLocal#0-tsina-1-27907-397232819ff9a47a7b7e80a40613cfe1?continueFlag=287868b2a6b984b5311edde3fc06ab2c)
