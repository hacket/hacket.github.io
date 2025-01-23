---
date_created: Friday, February 23rd 2013, 10:10:45 pm
date_updated: Thursday, January 23rd 2025, 12:21:53 am
title: Java ConcurrentHashMap
author: hacket
categories:
  - Java&Kotlin
category: Java数据结构
tags: [Java数据结构]
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
date created: 2024-12-27 23:39
date updated: 2024-12-27 23:39
aliases: [ConcurrentHashMap]
linter-yaml-title-alias: ConcurrentHashMap
---

# ConcurrentHashMap

## 什么是 ConcurrentHashMap？

线程安全的 Map 集合

## ConcurrentHashMap 实现原理？

ConcurrentHashMap 在 JDK1.7 和 JDK1.8 的实现方式是不同的。

### JDK7.0 Segment+HashEntry 分段锁

JDK7.0ConcurrentHashMap 是由 Segment 数组结构和 HashEntry 数组结构组成，即 ConcurrentHashMap 把哈希桶数组切分成小数组 Segment，每个 Segment 小数组中有 n 个 HashEntry 组成。

首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一段数据时，其他段的数据也能被其他线程访问，实现了真正的并发访问。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687481123487-2b60869e-a3ad-40cb-9de8-94023f294b9f.png#averageHue=%23f9efd9&clientId=ua6e16189-a9db-4&from=paste&id=uce7633fb&originHeight=948&originWidth=1589&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u975d580f-67fc-4cb7-bd00-d8b1b04de4e&title=)<br>Segment 继承了 ReentrantLock，Segment 是一种可重入锁；Segment 默认为 16，也就是并发度为 16

### JDK8.0 HashMap 并发版

在数据结构上， JDK8.0 中的 ConcurrentHashMap 选择了与 HashMap 相同的 `Node数组+链表+红黑树` 结构；在锁的实现上，抛弃了原有的 Segment 分段锁，采用 `CAS + synchronized` 实现**更加细粒度的锁**。<br>将锁的级别控制在了更细粒度的哈希桶数组元素级别，也就是说只需要锁住这个链表头节点（红黑树的根节点），就不会影响其他的哈希桶数组元素的读写，大大提高了并发度。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687481132397-7aaa6f71-0e2d-42f0-8291-c9ac137dd55c.png#averageHue=%23fbf4e8&clientId=ua6e16189-a9db-4&from=paste&id=u912266f1&originHeight=1036&originWidth=1461&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uef6f6e6b-61ab-434d-b21e-89a122819b2&title=)

## ConcurrentHashMap put 逻辑

## ConcurrentHashMap get 逻辑

### JDK7.0

根据 key 计算出 hash 值定位到具体的 Segment ，再根据 hash 值获取定位 HashEntry 对象，并对 HashEntry 对象进行链表遍历，找到对应元素。

### JDK8.0

1. 根据 key 计算出 hash 值，判断数组是否为空；
2. 如果是首节点，就直接返回；
3. 如果是红黑树结构，就从红黑树里面查询；
4. 如果是链表结构，循环遍历判断。

## ConcurrentHashMap 不支持 key 或 value 为 null 的原因？

**value 为什么不能为 null？**<br>作者 Doug Lea 本身对这个问题有过回答，在并发编程中，null 值容易引来歧义， 假如先调用 get(key) 返回的结果是 null，那么我们无法确认是因为当时这个 key 对应的 value 本身放的就是 null，还是说这个 key 值根本不存在，这会引起歧义，如果在非并发编程中，可以进一步通过调用 containsKey 方法来进行判断，但是并发编程中无法保证两个方法之间没有其他线程来修改 key 值，所以就直接禁止了 null 值的存在。<br>**总结**：允许 null 值容易引起二义性，是这个 key 不存在还是 key 存在存放的值为 null 呢？这就需要进一步通过 containsKey 确认，如果在单线程环境下没问题，如果是多线程环境下，可能存在 get(key) 后 containsKey() 前有其他的线程 put(key, null)，假设真实是这个 key 不存在，这样实际拿到的结果是 key 存在值为 null，就与我们真实情况不一致了，有了二义性，干脆就禁止了 null 值

> 假设 ConcurrentHashMap 允许存放值为 null 的 value，这时有 A、B 两个线程，线程 A 调用 ConcurrentHashMap.get(key) 方法，返回为 null ，我们不知道这个 null 是 key 没有对应的映射的 null ，还是存的值就是 null 。<br>假设此时，返回为 null 的真实情况是没有找到对应的 key。那么，我们可以用 ConcurrentHashMap.containsKey(key) 来验证我们的假设是否成立，我们期望的结果是返回 false 。<br>但是在我们调用 ConcurrentHashMap.get(key) 方法之后，containsKey 方法之前，线程 B 执行了 ConcurrentHashMap.put(key, null) 的操作。那么我们调用 containsKey 方法返回的就是 true 了，这就与我们的假设的真实情况不符合了，这就有了二义性。

**key 为什么不能为 null？**<br>作者 Doug Lea 本身也认为，假如允许在集合，如 map 和 set 等存在 null 值的话，即使在非并发集合中也有一种公开允许程序中存在错误的意思，这也是 Doug Lea 和 Josh Bloch（HashMap 作者之一） 在设计问题上少数不同意见之一，而 ConcurrentHashMap 是 Doug Lea 一个人开发的，所以就直接禁止了 null 值的存在。总结一句话就是 Doug Lea 不喜欢 null 键。<br>[请问ConcurrentHashMap中的key为什么不能为null？](https://mp.weixin.qq.com/s?__biz=Mzg3NjU3NTkwMQ==&mid=2247505071&idx=1&sn=5b9bbe01a71cbfae4d277dd21afd6714&source=41#wechat_redirect)

## ConcurrentHashMap 的并发度是什么？

并发度可以理解为程序运行时能够同时更新 ConccurentHashMap 且不产生锁竞争的最大线程数。

- JDK7.0<br>在 JDK1.7 中，实际上就是 ConcurrentHashMap 中的分段锁个数，即 Segment[] 的数组长度，默认是 16，这个值可以在构造函数中设置。

> 如果自己设置了并发度，ConcurrentHashMap 会使用大于等于该值的最小的 2 的幂指数作为实际并发度，也就是比如你设置的值是 17，那么实际并发度是 32。<br>如果并发度设置的过小，会带来严重的锁竞争问题；如果并发度设置的过大，原本位于同一个 Segment 内的访问会扩散到不同的 Segment 中，CPU cache 命中率会下降，从而引起程序性能下降。

- JDK8.0<br>在 JDK1.8 中，已经摒弃了 Segment 的概念，选择了 Node 数组 + 链表 + 红黑树结构，并发度大小依赖于数组的大小。

## ConcurrentHashMap 迭代器是强一致性还是弱一致性

与 HashMap 迭代器是强一致性不同，ConcurrentHashMap 迭代器是弱一致性。

ConcurrentHashMap 的迭代器创建后，就会按照哈希表结构遍历每个元素，但在遍历过程中，内部元素可能会发生变化，如果变化发生在已遍历过的部分，迭代器就不会反映出来，而如果变化发生在未遍历过的部分，迭代器就会发现并反映出来，这就是弱一致性。

## ConcurrentHashMap JDK7.0 和 JDK8.0 的区别？

- 数据结构：JDK8.0 取消了 Segment 分段锁的数据结构，取而代之的是数组 + 链表 + 红黑树的结构。
- 保证线程安全机制：JDK7.0 采用 Segment 的分段锁机制实现线程安全，其中 Segment 继承自 ReentrantLock 。JDK8.0 采用 CAS+synchronized 保证线程安全。
- 锁的粒度：JDK7.0 是对需要进行数据操作的 Segment 加锁，默认并发度 16，JDK8.0 调整为对每个数组元素加锁（Node）。
- JDK7.0 链表遍历效率低，JDK8.0 会将链表转化为红黑树：定位节点的 hash 算法简化会带来弊端，hash 冲突加剧，因此在链表节点数量大于 8（且数据总量大于等于 64）时，会将链表转化为红黑树进行存储。
- 查询时间复杂度：从 JDK7.0 的遍历链表 O(n)， JDK8.0 变成遍历红黑树 O(logN)。

## ConcurrentHashMap 和 HashTable 哪个效率高

ConcurrentHashMap 比 HashTable 效率高，锁粒度更细，并发度更高

- HashTable：在方法上锁，并发度为 1，读写锁共用一把锁
- ConcurrentHashMap：锁粒度更低，在 JDK7.0 中采用分段锁实现线程安全，在 JDK8.0 中采用 CAS+synchronized 实现线程安全。

## HashTable 的锁机制

Hashtable 是使用 synchronized 来实现线程安全的，给整个哈希表加了一把大锁，多线程访问时候，只要有一个线程访问或操作该对象，那其他线程只能阻塞等待需要的锁被释放，在竞争激烈的多线程场景中性能就会非常差！<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687481151902-71f7b9d0-f11a-4455-b4cb-d79df5599b77.png#averageHue=%23fcf7ea&clientId=ua6e16189-a9db-4&from=paste&height=397&id=uc3b3b6b7&originHeight=712&originWidth=1003&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6eb76853-cae0-464d-bdd1-6092543381d&title=&width=559)

## 多线程下安全操作 Map 还有其他方式吗？

还可以使用 `Collections.synchronizedMap` 方法，对方法进行加同步锁。

> 如果传入的是 HashMap 对象，其实也是对 HashMap 做的方法做了一层包装，里面使用对象锁来保证多线程场景下，线程安全，本质也是对 HashMap 进行全表锁。在竞争激烈的多线程环境下性能依然也非常差，不推荐使用！

## ConcurrentHashMap 相关问题

### ConcurrentHashMap JDK1.8 中为什么使用内置锁 synchronized 替换 可重入锁 ReentrantLock？

- 在 JDK1.6 中，对 synchronized 锁的实现引入了大量的优化，并且 synchronized 有多种锁状态，会从 `无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁` 一步步转换。
- 减少内存开销 。假设使用可重入锁来获得同步支持，那么每个节点都需要通过继承 AQS 来获得同步支持。但并不是每个节点都需要获得同步支持的，只有链表的头节点（红黑树的根节点）需要同步，这无疑带来了巨大内存浪费。

### ConcurrentHashMap 的 get 方法是否要加锁，为什么？

get 方法不需要加锁。

- JDK8.0 因为 Node 的元素 value 和指针 next 是用 volatile 修饰的，在多线程环境下线程 A 修改节点的 value 或者新增节点的时候是对线程 B 可见的。

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V val; // volatile修饰的，保证可见性
    volatile Node<K,V> next; // volatile修饰的，保证可见性
}
```

- JDK7.0 的 HashEntry 的 value 和 next 也都是 volatile，保证了可见性

这也是它比其他并发集合比如 Hashtable、用 Collections.synchronizedMap() 包装的 HashMap 效率高的原因之一。

#### JDK7.0 get 方法不需要加锁与 volatile 修饰的哈希桶数组有关吗？

没有关系。哈希桶数组 table 用 volatile 修饰主要是保证在数组扩容的时候保证可见性。

```java
static final class Segment<K,V> extends ReentrantLock implements Serializable {
    // 存放数据的桶
    transient volatile HashEntry<K,V>[] table;
}
```

### ConcurrentHashmap、HashTable 和 HashMap 区别

1. HashMap 是非线程安全的，而 HashTable 和 ConcurrentHashmap 都是线程安全的
2. HashMap 的 key 和 value 均可以为 null；而 HashTable 和 ConcurrentHashMap 的 key 和 value 均不可以为 null
3. HashTable 和 ConcurrentHashMap 的区别：保证线程安全的方式不同

- HashTable 是通过给整张散列表加锁的方式来保证线程安全，读写锁共用一把锁，这种方式保证了线程安全，但是并发执行效率低下。
- ConcurrentHashMap 在 JDK1.8 之前,采用分段锁机制来保证线程安全的，这种方式可以在保证线程安全的同时,一定程度上提高并发执行效率 (当多线程并发访问不同的 segment 时，多线程就是完全并发的，并发执行效率会提高)
