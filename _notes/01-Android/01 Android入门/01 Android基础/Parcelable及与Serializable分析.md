---
date created: 2024-12-24 00:25
date updated: 2025-01-01 20:35
dg-publish: true
feed: show
format: list
image-auto-upload: true
---

## Parcelable及Serializable分析

### 序列化和反序列化

##### 1、序列化和反序列化名词

- 对象的序列化<br />把Java对象转换为字节序列并存储至一个存储媒介的过程
- 对象的反序列化<br />把字符序列恢复为Java对象的过程

##### 2、序列化解释

对象的序列化涉及3个关键点：Java对象、字符序列、存储

- Java对象的组成<br />Java对象包含变量与方法。但是序列化与反序列仅处理Java变量而不处理方法，序列与反序列化仅对数据进行处理
- 什么是字符序列<br />字符序列是两个词，字符是在计算机和电信领域中，字符是一个信息单位。数学书，序列是被排成一列的对象（或事件）
- 存储<br />字符序列需要保存到一个地方，可以是硬盘也可以是内存。<br />简单：序列化就是把当前对象信息保存下来。反序列化刚好相反的操作。

表示将一个对象转换成可存储或可传输的状态。序列化后的对象可以在网络上进行传输，也可以存储到本地。

##### 3、Java对象与Java对象序列化的区别

Java对象存在的前提必须在JVM运行期间存在，如果想在**JVM非运行的情况下**或者**其他机器JVM上**获取指定Java对象，在现有Java对象的机制下都不可能完成。<br />Java对象执行序列化操作，因为原理是把Java对象信息保存到存储媒介，所以可以在以上Java对象不可能存在的两种情况下依然可以使用Java对象。

### Android中的Serializable和Parcelable

##### 1、序列化原则

1. 使用内存时候，Parcelable比Serializable性能高，推荐用Parcelable
2. Serializable在序列化的时候会产生大量的临时变量，从而引起频繁的GC
3. Parcelable不能使用在要将数据存储在磁盘上的情况，因为Parcelable不能很好的保证数据的持续性在外界有变化的情况下。尽管Serializable效率低点，此时推荐用Serializable

##### 2、Serializable

Serializable是Java自带，表示将一个对象转换成可存储或可传输的状态。序列化后的对象可以在网络上进行传输，也可以存储到本地。

##### 3、Parcelable

Parcelable也可以实现序列化，不同于将对象进行序列化，Parcelable方式的实现原理是将一个完整的对象进行分解，而分解后的每一部分都是Intent所支持的数据类型，这样也就实现传递对象的功能了。

- Parcelable作用

1. 永久性保存对象，保存对象的字节序列到本地文件中
2. 通过序列化对象在网络中传输对象
3. 通过序列化在进程间传输对象

##### 4、Serializable和Parcelable对比

两者最大的区别在于存储媒介的不同，Serializable使用IO读写存储在硬盘上，而Parcelable是直接在内存中读写，很明显内存的读写速度大于IO的读写。

#### 1、编码上

1. Serializable代码量少，写起来方便
2. Parcelable代码多一些

#### 2、效率上

1. Parcelable的速度比Serializable高十倍以上
2. Serializable只要某个类实现Serializable接口即可。是一种标识接口，无需实现方法，Java会对这个对象进行高效的序列化操作，缺点是使用了反射，序列化过程较慢。这种机制会在序列化的时候创建许多的临时对象，容易触发GC

### 其他方式

#### Parceler

<https://github.com/johncarl81/parceler><br />`Parceler`使用起来非常方便，代码也非常整洁。 需要注意的是，`Parceler`支持绝大部分的数据类型，但是也有些不支持，例如`DateTime`，如果你使用了这写类型，编写代码的时候并不会提醒你，这只会在运行过程中给你报错。

#### Reference

Android中传递对象的三种方法<br /><http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0104/2256.html>

android Activity之间数据传递 Parcelable和Serializable接口的使用<br /><http://blog.csdn.net/js931178805/article/details/8268144>

Android Parcelable和Serializable的区别<br /><http://www.cnblogs.com/trinea/archive/2012/11/09/2763213.html>

android.os.BadParcelableException: ClassNotFoundException when unmarshalling<br /><http://www.trinea.cn/android/android-os-badparcelableexception-classnotfoundexception-unmarshalling/>

Java 序列化的高级认识<br /><http://www.ibm.com/developerworks/cn/java/j-lo-serial/index.html>
