---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
dg-publish: true
---

# Java对象创建流程&对象内存分配策略

## Java对象创建流程

```java
A a = new A();
```

### 1. 类加载检查

虚拟机遇到一条new指令时，首先将去检查这个指令的参数是否能在常量池中定位到一个类的符号引用，并且检查这个符号引用代表的类是否已被加载、解析和初始化过。如果没有，那必须先执行相应的类加载过程。

> Java虚拟机：类加载的5个过程

- Loading 加载
- Verifying 校验JVM规范
- Preparing 准备
- Resolving 解析
- Initializing 初始化

### 2. 为对象分配内存

在类加载检查通过后，接下来虚拟机将为新生对象分配内存。对象所需内存的大小在类加载完成后便可完全确定，为对象分配空间的任务等同于把 一块确定大小的内存从Java堆中划分出来。<br>这个步骤有两个问题：

- 如何划分内存
- 分配内存线程安全：在并发情况下，可能出现正在给对象A分配内存，指针还没来得及修改，对象B又同时使用了原来的指针来分配内存的情况。

#### 如何划分内存

内存分配 根据 Java堆内存是否绝对规整 分为两种方式：`指针碰撞` & `空闲列表`

> Java堆内存规整：已使用的内存在一边，未使用内存在另一边；Java堆内存不规整：已使用的内存和未使用内存相互交错<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582201483-6c2f369c-a225-47b2-a1e3-9679506222ba.png#averageHue=%23e5e5e5&clientId=ube80976d-b7f6-4&from=paste&id=ubd0abb62&originHeight=352&originWidth=1502&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1f42ec18-2217-44a5-83c6-3571e93d726&title=)

##### 方式1：指针碰撞 Bump the Pointer (默认用指针碰撞)

- 假设Java堆内存绝对规整，内存分配将采用指针碰撞；
- 分配形式：已使用内存在一边，未使用内存在另一边，中间放一个作为分界点的指示器

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582223175-38f4148b-1780-430c-9c75-3382d338de6c.png#averageHue=%23f1f1f1&clientId=ube80976d-b7f6-4&from=paste&id=ud3518e30&originHeight=278&originWidth=960&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u73fe7f27-18a5-482c-b7ed-8507e14f81e&title=)<br>分配对象内存 = 把指针向 未使用内存 移动一段 与对象大小相等的距离<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582234601-72719d61-c6a6-441d-9f83-edbedb8034f3.png#averageHue=%23f1f1f1&clientId=ube80976d-b7f6-4&from=paste&id=u5411bec3&originHeight=572&originWidth=1036&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud68669c1-6bd9-4ca3-9cd7-58eb561465c&title=)

##### 方式2：空闲列表 Free List

- 假设Java堆内存不规整，内存分配将采用 空闲列表
- 分配形式：虚拟机维护着一个记录可用内存块的列表，在分配时从列表中找到一块足够大的空间划分给对象实例，并更新列表上的记录

#### 分配内存线程安全

给对象分配内存会存在线程不安全的问题，解决 线程不安全 有两种方案：

1. 同步处理分配内存空间的行为

> 虚拟机采用 CAS + 失败重试的方式 保证更新操作的原子性

2. 把内存分配行为 按照线程 划分在不同的内存空间进行

> 1. 即每个线程在 Java堆中预先分配一小块内存（本地线程分配缓冲（`Thread Local Allocation Buffer ，TLAB`）），哪个线程要分配内存，就在哪个线程的TLAB上分配，只有TLAB用完并分配新的TLAB时才需要同步锁。
> 2. 虚拟机是否使用TLAB，可以通过`-XX:+/-UseTLAB`参数来设定。

#### 小结

1. 分配方式的选择 取决于 Java堆内存是否规整；
2. 而 Java堆是否规整 由所采用的垃圾收集器是否带有`压缩整理功能`决定
   - 使用带 `Compact` 过程的垃圾收集器时，采用指针碰撞；(如Serial、ParNew垃圾收集器)
   - 使用基于 `Mark_sweep`算法的垃圾收集器时，采用空闲列表 如 CMS垃圾收集器
3. 对象创建在虚拟机中是非常频繁的操作，即使仅仅修改一个指针所指向的位置，在并发情况下也会引起线程不安全

> 如：正在给对象A分配内存，指针还没有来得及修改，对象B又同时使用了原来的指针来分配内存

### 3. 将内存空间初始化为零值

内存分配完成后，虚拟机需要将分配到的内存空间初始化为零（不包括对象头）

1. 保证了对象的实例字段在使用时可不赋初始值就直接使用（对应值 = 0）
2. 如使用本地线程分配缓冲（TLAB），这一工作过程也可以提前至TLAB分配时进行。

### 4. 设置对象头（对对象进行必要的设置）

初始化零值之后，虚拟机要对对象进行必要的设置，例如这个对象是哪个类的实例、如何才能找到类的元数据信息、对象的哈希码、对象的GC分代年龄等信息。这些信息存放在对象的`对象头Object Header`之中。

### 5. 执行方法

### 流程图

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582276908-3ede56c6-5a50-4be5-b09a-79fea8a4c889.png#averageHue=%23fdfdfd&clientId=ube80976d-b7f6-4&from=paste&id=u301242b7&originHeight=1180&originWidth=892&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ub931c59c-69c2-4b2d-b1ec-4055da9ed81&title=)

## 对象内存分配策略

### 栈上分配

Java中的对象几乎都是在堆上进行分配，当对象没有被引用的时候，需要依靠GC进行回收内存，如果对象数量较多的时候，会给GC带来较大压力，也间接影响了应用的性能。为了减少临时对象在堆内分配的数量，JVM通过逃逸分析确定该对象不会被外部访问。如果不会逃逸可以将该对象在栈上分配内存，这样该对象所占用的内存空间就可以随栈帧出栈而销毁，就减轻了垃圾回收的压力。

#### 没有逃逸

即方法中的对象没有发生逃逸。

逃逸分析的原理：分析对象动态作用域，当一个对象在方法中定义后，它可能被外部方法所引用，比如：调用参数传递到其他方法中，这种称之为方法逃逸，甚至还有可能被外部线程访问到，例如：赋值给其他线程中访问的变量，这个称之为线程逃逸。

从不逃逸到方法逃逸到线程逃逸，称之为对象由低到高的不同逃逸程度。

如果确定一个对象不会逃逸出线程之外，那么让对象在栈上分配内存可以提高JVM的效率。

#### 逃逸分析

如果是逃逸分析出来的对象可以在栈上分配的话，那么该对象的生命周期就跟随线程了，就不需要垃圾回收，如果是频繁的调用此方法则可以得到很大的性能提高。<br>采用了逃逸分析后，满足逃逸的对象在栈上分配。<br>![](https://note.youdao.com/yws/res/74289/29F145A7EC384D7C83E00811EF678124#id=RrICU&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582337870-9a8c20c8-2d59-4c77-a4b0-3b036e30b208.png#averageHue=%23f9f9f9&clientId=u307c600a-6535-4&from=paste&id=u624235da&originHeight=984&originWidth=1314&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua0505940-1200-48f0-b861-a4a96373464&title=)<br>没有开启逃逸分析，对象都在堆上分配，会频繁触发垃圾回收（垃圾回收会影响系统性能），导致代码运行慢。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582348840-517601ec-2e78-4bf2-91eb-50eac8c4e3d4.png#averageHue=%23f7f7f7&clientId=u307c600a-6535-4&from=paste&id=u8041bf71&originHeight=954&originWidth=1226&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud1218389-e3e0-4764-ab68-bfccced6c50&title=)

> 关闭了逃逸分析，JVM在频繁的进行垃圾回收（GC），正是这一块的操作导致性能有较大的差别。

##### 对象逃逸分析示例

- 逃逸代码分析(开启逃逸分析，未设置`-XX:-DoEscapeAnalysis`)：

```java
/**
 * 逃逸分析-栈上分配 
 */
public class EscapeAnalysisTest {
    public static void main(String[] args) throws Exception {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 50000000; i++) { // 5千万的对象，为什么不会垃圾回收
            allocate();
        }
        System.out.println((System.currentTimeMillis() - start) + " ms");
        Thread.sleep(600000);
    }

    static void allocate() {//满足逃逸分析（不会逃逸出方法）
        MyObject myObject = new MyObject(2020, 2020.6);
    }

    static class MyObject {
        int a;
        double b;

        MyObject(int a, double b) {
            this.a = a;
            this.b = b;
        }
    }
}
```

输出： 6ms

> 这段代码在调用的过程中 myboject这个对象属于全局逃逸，JVM可以做栈上分配

- 逃逸代码分析(不开启逃逸分析，设置`-XX:-DoEscapeAnalysis`) <br>输出：488ms

### 堆上分配

1. 对象优先在Eden区分配

> 大多数情况下，对象在新生代Eden区中分配。当Eden区没有足够空间分配时，虚拟机将发起一次Minor GC

2. 大对象直接进入老年代

> 最典型的大对象是那种很长的字符串以及数组。这样做的目的：1.避免大量内存复制,2.避免提前进行垃圾回收，明明内存有空间进行分配

3. 长期存活对象进入老年区

> 如果对象在Eden出生并经过第一次Minor GC后仍然存活，并且能被Survivor容纳的话，将被移动到Survivor空间中，并将对象年龄设为1，对象在Survivor区中每熬过一次 Minor GC，年龄就增加1，当它的年龄增加到一定程度(并发的垃圾回收器默认为15),CMS是6时，就会被晋升到老年代中。

#### 对象年龄动态判定

为了能更好地适应不同程序的内存状况，虚拟机并不是永远地要求对象的年龄必须达到了`MaxTenuringThreshold`才能晋升老年代，如果在Survivor空间中相同年龄所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄的对象就可以直接进入老年代，无须等到MaxTenuringThreshold中要求的年龄

#### 老年代空间分配担保

在发生Minor GC之前，虚拟机会先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果这个条件成立，那么MinorGC可以确保是安全的。如果不成立，则虚拟机会查看HandlePromotionFailure设置值是否允许担保失败。如果允许，那么会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次Minor GC，尽管这次Minor GC是有风险的，如果担保失败则会进行一次Full GC；如果小于，或者HandlePromotionFailure设置不允许冒险，那这时也要改为进行一次Full GC。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582383878-e6c982f4-c265-4a69-8522-4ac0906b7d5a.png#averageHue=%23f6f6f6&clientId=u307c600a-6535-4&from=paste&id=u6050d62f&originHeight=724&originWidth=1068&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4cba4d94-d8b7-4e8a-aaeb-b93b9fc080f&title=)

#### 本地线程分配缓冲(TLAB)

一个Java对象在堆上分配的时候，主要是在Eden区上，如果启动了TLAB的话会优先在TLAB上分配，少数情况下也可能会直接分配在老年代中，分配规则并不是百分之百固定的，这取决于当前使用的是哪一种垃圾收集器，还有虚拟机中与内存有关的参数的设置。

### 对象内存分配流程图

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582397559-fbe6c70f-cd23-4906-a1a5-377340d0dbbb.png#averageHue=%23faf8f7&clientId=u307c600a-6535-4&from=paste&id=u3fa9e74b&originHeight=866&originWidth=2130&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u21e9b107-5541-4762-953c-676c8ce15fd&title=)<br>![](https://note.youdao.com/yws/res/74453/AB76AD3D5C214B1A9A3DB80B75C50000#id=sbXKi&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582405802-b19738b0-412c-49ff-b9ff-3cd82eb704aa.png#averageHue=%23e8d3bd&clientId=u307c600a-6535-4&from=paste&id=u26d1253a&originHeight=742&originWidth=1866&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u550868e2-a7b1-487a-b6d8-b5507912f0d&title=)

## Ref

- [ ] 求你了，别再说Java对象都是在堆内存上分配空间的了！<br><https://www.cnblogs.com/hollischuang/p/12501950.html>
