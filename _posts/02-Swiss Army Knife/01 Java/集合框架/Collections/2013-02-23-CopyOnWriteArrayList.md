---
date_created: Friday, February 23rd 2013, 10:10:45 pm
date_updated: Thursday, January 23rd 2025, 12:21:32 am
title: CopyOnWriteArrayList
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
date created: 2024-12-27 23:38
date updated: 2024-12-27 23:38
aliases: [CopyOnWriteArrayList 基础]
linter-yaml-title-alias: CopyOnWriteArrayList 基础
---

# CopyOnWriteArrayList 基础

# CopyOnWriteArrayList 原理

## Copy-On-Write 写时复制

`Copy-On-Write` 简称 COW，是一种用于程序设计中的优化策略。其基本思路是，从一开始大家都在共享同一个内容，当某个人想要修改这个内容的时候，才会真正把内容 Copy 出去形成一个新的内容然后再改，这是一种延时懒惰策略。从 JDK1.5 开始 Java 并发包里提供了两个使用 CopyOnWrite 机制实现的并发容器,它们是 `CopyOnWriteArrayList` 和 `CopyOnWriteArraySet`。CopyOnWrite 容器非常有用，可以在非常多的并发场景中使用到。

## 什么是 CopyOnWrite 容器？

CopyOnWrite 容器即写时复制的容器。通俗的理解是当我们往一个容器添加元素的时候，不直接往当前容器添加，而是先将当前容器进行 Copy，复制出一个新的容器，然后新的容器里添加元素，添加完元素之后，再将原容器的引用指向新的容器。这样做的好处是我们可以对 CopyOnWrite 容器进行并发的读，而不需要加锁，因为当前容器不会添加任何元素。所以 CopyOnWrite 容器也是一种读写分离的思想，读和写不同的容器。

## CopyOnWriteArrayList 特点

- 底层也是用的数组
- 并发优化的 ArrayList
- 适合读多写少场景（比如缓存）<br />在修改时，先复制一个快照来修改，修改完后再让内部指针指向新的数组。因为对快照的修改对读操作来说不可见，所以只有写锁没有读锁，加上复制的昂贵成本，典型的适合读多写少的场景。如果更新频率较高，或数组较大时，还是 `Collections.synchronizedList(list)`，对所有操作用同一把锁来保证线程安全更好。

Java 的 list 在遍历时，若中途有别的线程对 list 容器进行修改，则会抛出 ConcurrentModificationException 异常。而 CopyOnWriteArrayList 由于其 " 读写分离 " 的思想，遍历和修改操作分别作用在不同的 list 容器，所以在使用迭代器进行遍历时候，也就不会抛出 ConcurrentModificationException 异常了。

- 缺点

1. 内存占用问题<br />每次执行写操作都要将原容器拷贝一份，数据量大时，对内存压力较大，可能会引起频繁 GC。
2. 无法保证实时性<br />Vector 对于读写操作均加锁同步，可以保证读和写的强一致性。而 CopyOnWriteArrayList 由于其实现策略的原因，写和读分别作用在新老不同容器上，在写操作执行过程中，读不会阻塞但读取到的却是老容器的数据。

## CopyOnWriteArrayList 原理

### add(E) 添加元素

```java
// 这个数组是核心的，因为用volatile修饰了，要把最新的数组对他赋值，其他线程立马可以看到最新的数组
private transient volatile Object[] array;
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray(); // 获取到存数据的数组
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1); // 创建一个大小为老数组大小+1的新数组
        newElements[len] = e; // 将要添加的元素添加到新的数组的后面
        setArray(newElements); // 将新的数组替换到旧的数组
        return true;
    } finally {
        lock.unlock();
    }
}
```

同步不是采用的 synchronized 方法，而是采用的 jdk5 中的 `ReentrantLock`。

> 高版本采用的是 `synchronized`

1. 写操作有锁，写时复制；写之前拷贝一个数组，在拷贝后的数组操作，不影响读
2. 数组 array 用了 volatile 修饰，保证写操作的线程写操作后，读线程能读取到最新值；即同一时间只能一个线程写，可以有多个线程读

### get() E

```java
private E get(Object[] a, int index) {
    return (E) a[index];
}
```

读操作就是非常简单的对那个数组进行读而已，不涉及任何的锁。而且只要他更新完毕对 volatile 修饰的变量赋值，那么读线程立马可以看到最新修改后的数组，这是 volatile 保证的。

## 总结

1. CopyOnWriteList 适用于读多写少的场景（只有写写锁，没有读写锁；如果有读写锁的话，会导致写锁阻塞大量读操作，影响并发性能）
2. 没有 ConcurrentModificationException 并发修改异常，读写分离的
3. 内存占用高，CopyOnWriteArrayList 就是用空间换时间，更新的时候基于副本更新，避免锁，然后最后用 volatile 变量来赋值保证可见性，更新的时候对读线程没有任何的影响；
4. 无法保证实时性<br />写的过程中，读取的数据是老的

## Ref

- [ ] JAVA 中的 COPYONWRITE 容器<br /><http://coolshell.cn/articles/11175.html>
