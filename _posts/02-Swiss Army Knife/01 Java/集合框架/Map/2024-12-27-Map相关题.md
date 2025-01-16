---
date created: 2024-12-27 23:40
date updated: 2024-12-27 23:40
dg-publish: true
---

# Map

## 哈希表 HashMap和HashTable

[HashMap夺命14问，你能坚持到第几问](https://juejin.cn/post/7077363148281348126)

### HashMap和HashTable区别

### HashMap如何计算数组下标？

<https://blog.csdn.net/duihsa156165/article/details/106860412>

## ArrayMap、SparseMap和HashMap

**HashMap(空间换时间)**

1. HashMap占用空间大，每次存数据都需要存个Entry
2. HashMap在存储数据时将要不断地扩容，且不断地做hash运算，对内存空间造成很大消耗和浪费

**ArrayMap(时间换空间)**

1. 基于两个数组实现，一个存放hash:mHashes，一个存放key/value键值对:m<Array

> mHashes[index] = hash
> mArray[index<<1]=key
> mArray[(index<<1)+1]=value

2. 存放hash的数组是有序的(升序?)，查找时使用二分查找
3. 插入数据时，根据key的hashCode()得到hash值，计算在mArray的index位置，然后利用二分查找找到对应的位置进行插入，当出现哈希冲突时，会在index的相邻位置插入
4. 扩容时不像HashMap直接double，也不需要重建哈希表，只需要调用System.arraycopy进行数组拷贝
5. 适合数据类1000内，数据量大的时候二分查找比红黑树会慢很多
6. ArrayMap的小数组复用池

> Android用的Map都很小，所以就把4和8大小的数组缓存起来，以备使用，减少GC

**SparseArray(时间换空间)**

1. SparseArray⽐HashMap更省内存，在某些条件下性能更好，主要是因为它避免了对key的⾃动装箱（int转为Integer类型），它内部则是通过两个数组来进⾏数据存储的，⼀个存储key，另外⼀个存储value，为了优化性能，它内部对数据还采取了压缩的⽅式，从⽽节约内存空间，我们从源码中可以看到key和value分别是⽤数组表示：<br />private int[] mKeys;<br />private Object[] mValues;
2. SparseArray存储和读取数据，使用的是二分查找法；SparseArray是按key从小到大排序的，可以用二分查找元素位置，获取速度非常快，比HashMap快很多

**如何抉择**

1. 数据类1000以内且增删不频繁的情况
   1. 如果key的类型确定为int类型，用SparseArray，避免自动装箱过程；key为long类型用LongSparseArray
   2. 如果key为其他类型，用ArrayMap，基本类型ArrayMap存在自动装箱
2. 数据类1000以上或增删频繁用HashMap<br />

## 谈谈LinkedHashMap和HashMap的区别？

## ConcurrentHashMap

见`并发工具类`→ `ConcurrentHashMap面试题`

## HashMap面试题

### HashMap是线程安全的吗？如何实现线程安全的HashMap？

HashMap不是线程安全的。<br />**为什么HashMap是线程不安全的？**

1. put()方法不是同步的
2. resize()方法也不是同步的，扩容过程，会重新生成一个新的容量的数组，然后对原数组的所有键值对重新进行计算和写入到新的数组，之后指向新生成的数组

**如何线程安全的使用HashMap？**

1. HashTable

方法级别的synchronized

2. Collections.synchronizedMap(Map)

底层用的是Collections内部的SynchronizedMap类，它是对传入的Map的一个包装，synchronized代码块的方式

3. ConcurrentHashMap

JDK7采用的是Segment分段锁实现的，而JDK8采用的是CAS算法实现的。

### HashMap中的Hash冲突解决和扩容机制（扩容机制常考）

冲突解决：链地址法，出现了hash冲突用链表链起来（JDK8.0出现了红黑树）

扩容机制：到size大于等于threshold时，扩容为原有的2倍大小

### 为什么HashMap的remove和clear没有缩容的操作？

缩容的意义在哪呢，如果这个map很快就释放了。那何必多此一举。如果map还继续用很可能还会有同样的数据量。也没必要在多此二举（还得扩回来）。而且这东西线程本就不安全。操作还是简单点好。提高remove复杂度是得不偿失的
