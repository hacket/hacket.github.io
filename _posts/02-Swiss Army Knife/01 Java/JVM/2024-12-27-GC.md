---
date created: 2024-12-27 23:43
date updated: 2024-12-27 23:43
dg-publish: true
---

# GC

## GC基础

### 什么是GC？

GC英文全称为`Garbage Collection`，即垃圾回收。Java中的GC就是及时的把内存中不再使用的对象清除掉。

### GC回收的区域

**堆区和方法区**，这两块区域是线程共享的，随着JVM启动就分配了。程序计数器、虚拟机栈、本地线程栈是线程私有的，随着线程的消亡一起消亡了，栈帧随着方法的进入和退出做入栈和出栈操作，实现了自动的内存清理<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560889112-2195d9f1-0213-4c55-857b-0b2d8aa8d7fe.png#averageHue=%23ebe3dc&clientId=u8c0af9a2-7be5-4&from=paste&height=494&id=udb257812&originHeight=665&originWidth=804&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u26efaf80-d6f4-4b4e-90d3-8a6f3f696af&title=&width=597.3333740234375)

### 什么时候触发GC？

- JVM无法再为新的对象分配内存空间了
- 手动调用System.gc()方法(不推荐)<br>不会立即执行GC；会加大系统的压力
- 低优先级的GC线程，被运行时就会执行GC
- 对象没有被引用
- 作用域发生未捕捉异常
- 程序正常执行完毕
- 程序执行了System.exit()
- 程序发生意外终止

### Finalize方法

即使通过可达性分析判断不可达的对象，也不是“非死不可”，它还会处于“缓刑”阶段，真正要宣告一个对象死亡，需要经过两次标记过程，一次是没有找到与GCRoots的引用链，它将被第一次标记。随后进行一次筛选（如果对象覆盖了finalize），我们可以在finalize中去拯救。<br>示例代码：

```java
/**
 * finalize方法对象的自我拯救
 */
public class FinalizeGC {
    public static FinalizeGC instance = null;

    public void isAlive() {
        System.out.println("I am still alive!");
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
        System.out.println("finalize method executed");
//        FinalizeGC.instance = this; // 去掉这句 System.gc();就死了
    }

    public static void main(String[] args) throws Throwable {
        instance = new FinalizeGC();
        // 对象进行第1次GC
        instance = null;
        System.gc();
        Thread.sleep(1000);//Finalizer方法优先级很低，需要等待
        if (instance != null) {
            instance.isAlive();
            System.out.println("First GC. I am alive.");
        } else {
            System.out.println("First GC. I am dead!");
        }
        // 对象进行第2次GC
        instance = null;
        System.gc();
        Thread.sleep(1000);
        if (instance != null) {
            instance.isAlive();
            System.out.println("Second GC. I am alive.");
        } else {
            System.out.println("Second GC. I am dead！");
        }
    }
}
```

输出：

```
finalize method executed
I am still alive!
First GC. I am alive.
Second GC. I am dead！
:JavaTestCases:FinalizeGC.main() spend 2302ms
      00:02.30   :JavaTestCases:FinalizeGC.main()
      00:00.79   :JavaTestCases:compileJava
```

> 注意：对象可以被拯救一次(finalize执行第一次，但是不会执行第二次)

### Stop The World现象

任何的GC收集器都会进行业务线程的暂停，这个就是STW，Stop The World，所以我们GC调优的目标就是尽可能的减少STW的时间和次数。

## GC Roots

### 什么是GC Roots？

程序中存在一些实例，它们不会被GC回收，称为GC Root，如静态变量、线程等<br>GC管理的主要区域是**Java堆**，一般情况下只针对堆进行垃圾回收。方法区、虚拟机栈和本地方法区不被GC所管理，因此选择这些区域内的对象作为GC Roots，被GC Roots引用的对象不被GC回收。<br>GC会收集那些不是GC roots且没有被GC roots引用的对象。

### 哪些可以作为GC Roots？

一个对象可以属于多个GC Roots，GC Roots有：

- **Class** 由系统类加载器加载的对象，这些类不能够被回收的。如`rt.jar`中的`java.utils.*`

> 通过用户自定义的类加载器加载的类，除非相应的java.lang.Class实例以其它的某种（或多种）方式成为roots，否则它们并不是roots。

- **Stack Local** Java方法的local变量或参数
- **Native Stack** 本地方法的变量
- **Active Java Threads** 所有活着的线程
- **JNI Local/JNI Global** JNI方法的local变量或参数、全局JNI引用
- **Objects used as monitors for synchronization** 用于同步监视器的对象
- **Specific objects** defined by the JVM implementation that are not garbage collected for its purpose 用于JVM特殊目的的由GC保留的对象

> 实际上这个与JVM的实现是有关的。可能已知的一些类型是：系统类加载器、一些JVM知道的重要的异常类、一些用于处理异常的预分配对象以及一些自定义的类加载器等。然而，JVM并没有为这些对象提供其它的信息，因此需要去确定哪些是属于"JVM持有"的了。

```
1.System Class
----------Class loaded by bootstrap/system class loader. For example, everything from the rt.jar like java.util.* .
2.JNI Local
----------Local variable in native code, such as user defined JNI code or JVM internal code.
3.JNI Global
----------Global variable in native code, such as user defined JNI code or JVM internal code.
4.Thread Block
----------Object referred to from a currently active thread block.
Thread
----------A started, but not stopped, thread.
5.Busy Monitor
----------Everything that has called wait() or notify() or that is synchronized. For example, by calling synchronized(Object) or by entering a synchronized method. Static method means class, non-static method means object.
6.Java Local
----------Local variable. For example, input parameters or locally created objects of methods that are still in the stack of a thread.
7.Native Stack
----------In or out parameters in native code, such as user defined JNI code or JVM internal code. This is often the case as many methods have native parts and the objects handled as method parameters become GC roots. For example, parameters used for file/network I/O methods or reflection.
7.Finalizable
----------An object which is in a queue awaiting its finalizer to be run.
8.Unfinalized
----------An object which has a finalize method, but has not been finalized and is not yet on the finalizer queue.
9.Unreachable
----------An object which is unreachable from any other root, but has been marked as a root by MAT to retain objects which otherwise would not be included in the analysis.
10.Java Stack Frame
----------A Java stack frame, holding local variables. Only generated when the dump is parsed with the preference set to treat Java stack frames as objects.
11.Unknown
----------An object of unknown root type. Some dumps, such as IBM Portable Heap Dump files, do not have root information. For these dumps the MAT parser marks objects which are have no inbound references or are unreachable from any other root as roots of this type. This ensures that MAT retains all the objects in the dump.
```

### GC Roots案例

1. Stack Local Java方法的local变量或参数

```java
public class Test {
    public static void main(String[] args) {
    	Test a = new Test(); // a为GC Roots
    	a = null;
    }
}
```

> a 是栈帧中的本地变量，当 a = null 时，由于此时 a 充当了 GC Root 的作用，a 与原来指向的实例 new Test() 断开了连接，所以对象会被回收

2. 方法区中类静态引用

```java
public class Test {
    public static Test s; // s为GC Roots
    public static void main(String[] args) {
    	Test a = new Test(); // a为GC Roots
    	a.s = new Test();
    	a = null;
    }
}
```

> 当栈帧中的本地变量 a = null 时，由于 a 原来指向的对象与 GC Root (变量 a) 断开了连接，所以 a 原来指向的对象会被回收，而由于我们给 s 赋值了变量的引用，s 在此时是类静态属性引用，充当了 GC Root 的作用，它指向的对象依然存活。

3. 方法区中常量引用的对象

```java
public class Test {
	public static final Test s = new Test(); // s为GC Roots
    public static void main(String[] args) {
	    Test a = new Test();
	    a = null;
    }
}
```

> 常量 s 指向的对象并不会因为 a 指向的对象被回收而回收

## 垃圾收集算法（判断什么时候对象需要回收，判断对象是否存活）

在垃圾收集器回收对象时，先要判断对象是否已经不再使⽤了，有**引用计数法**和**可达性分析**两种

### 引用计数法

最早使用的，1.2之前，每个对象有一个引用计数属性，新增一个引用时计数加1，引用释放时计数减1，计数为0时可以回收，Python、Object-C和Swift是这种。<br>**循环引用问题：**引用计数法实现简单，判断效率也很高，JVM并没有采用引用计数法来管理内存，主要原因是它很难解决对象之间的循环引用问题，主流虚拟机都没有使用，需要引入额外的机制来处理循环引用问题。<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671417332130-078ceab0-917f-4f02-9446-23ec6811d823.png#averageHue=%23a3bdbb&clientId=ucc19786b-1eef-4&from=paste&height=95&id=BkdMV&originHeight=211&originWidth=589&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74807&status=done&style=stroke&taskId=u6357bbdb-3092-4d5e-b69a-41adfe733ec&title=&width=265.66668701171875)

> ObjA对象和ObjB相互引用，但ObjA对象和ObjB对象都已经不可达了，但是引用计数算法不能回收这两个对象

### 可达性分析法

通过一系列的称为GC Roots的对象作为起始点，从这些节点开始向下搜索，搜索所走过的路径称为引用链（Reference Chain），当一个对象到GC Roots没有任何引用链相连时，则证明此对象是不可用的。<br>如，从GCRoot出发，ObjD和ObjE对象不可达，会被垃圾回收器回收。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693580993198-a3bd51a5-dc48-4074-b146-cae9578cf140.png#averageHue=%23fae4c4&clientId=u8c0af9a2-7be5-4&from=paste&id=u49a219d7&originHeight=353&originWidth=666&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u20df5530-372a-486f-8355-524852f2741&title=)

## **GC常用回收算法**

JVM中对于被标记为垃圾的对象（通过可达性分析法）进行回收时，常用有三种算法：**标记-清除算法**，**标记-压缩算法**，**复制算法：**<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581085702-082d8c4f-efa0-46c8-862c-97b4507c1518.png#averageHue=%23faf8f8&clientId=u8c0af9a2-7be5-4&from=paste&id=u7c0e6f47&originHeight=1048&originWidth=1996&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u45807155-c5bd-4451-a5a1-565e88e690a&title=)

1. 复制算法 Copying
2. 标记-清除算法（Mark-Sweep）
3. 标记-整理算法（Mark-Compact）

### 标记-清除算法 Mark-Sweep

标记清除是先通过GC Roots标记所存活的对象，然后再统⼀清除未被标记的对象。

> 算法分为“标记”和“清除”两个阶段：首先标记出所有需要回收的对象，在标记完成后统一回收所有被标记的对象。
> 回收效率不稳定，如果大部分对象是朝生夕死，那么回收效率降低，因为需要大量标记对象和回收对象，对比复制回收效率很低。<br>它的主要不足空间问题，标记清除之后会产生大量不连续的内存碎片，空间碎片太多可能会导致以后在程序运行过程中需要分配较大对象时，无法找到足够的连续内存而不得不提前触发另一次垃圾收集动作。<br>回收的时候如果需要回收的对象越多，需要做的标记和清除的工作越多，所以标记清除算法适用于老年代。复制回收算法适用于新生代。
> 该算法是从根集合扫描整个空间，标记存活的对象，然后在扫描整个空间对没有被标记的对象进行回收，这种算法在存活对象较多时比较高效，但会产生内存碎片。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671469982031-27b8bd9a-490c-4928-a110-03ab14996c0c.png#averageHue=%23efc0c0&clientId=ucc19786b-1eef-4&from=paste&height=367&id=c7os3&originHeight=1340&originWidth=1411&originalType=binary&ratio=1&rotation=0&showTitle=false&size=117478&status=done&style=stroke&taskId=u592271ab-e252-4e4e-9926-2d78b6aaa48&title=&width=386)<br>**小结**

1. 先标记出所有需要回收的对象
2. 统一清除标记为可回收的对象

**不足**

- 回收效率不稳定，如果是新生代，大部分对象都是死的，需要大量标记对象和回收对象，对比复制算法效率低下
- 对象位置不移动，可能存在很多内存碎片，无法分配大对象

**适用场景**

1. 老年代：不需要大量标记和回收对象的场景
2. 老年代使用的**CMS收集器**就是基于标记清除算法

### 标记-压缩(整理)算法 Mark-Compact

标记整理算法即是在标记清除之后，把所有存活的对象都向⼀端移动，然后清理掉边界以外的内存区域 。<br>![](https://cdn.nlark.com/yuque/0/2022/png/694278/1655137260158-e61eb6ef-1871-493f-8b95-9b0a1befd175.png#averageHue=%23f0f0f0&clientId=u698ce69c-33d8-4&from=paste&height=215&id=u2c36c3bc&originHeight=273&originWidth=818&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&taskId=u11e91a63-7d84-4a69-bbd1-bff0197ad33&title=&width=644)

> 首先标记出所有需要回收的对象，在标记完成后，后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。
> 标记整理算法虽然没有内存碎片，但是效率偏低。我们看到标记整理与标记清除算法的区别主要在于对象的移动。对象移动不单单会加重系统负担，同时需要全程暂停用户线程才能进行，同时所有引用对象的地方都需要更新。所以看到，老年代采用的标记整理算法与标记清除算法，各有优点，各有缺点。

**小结**

1. 先标记出所有需要回收的对象
2. 将所有活对象移动到一侧（所有用户线程暂停，以便对象移动，同时所有引用对象的地方引用需要更新）
3. 把剩下空间的所有对象全部清除

**特点**

- 和标记清除比，多了对象移动
- 不会产生大量碎片内存空间。

**不足**

- 对象移动时，所有用户线程会暂停，同时所有引用对象的地方都需要更新

### 复制算法 Copying

复制算法是把内存空间划分为两块，每次分配对象只在⼀块内存上进行分配，在这一块内存使用完时，就直接把存活的对象复制到另外一块上，然后把已使⽤的那块空间⼀次清理掉，但是这种算法的代价就是内存的使用量缩小了一半。 <br>**特点**

1. 简单、高效
2. 内存复制，没有内存碎片

**缺点**

1. 内存利用率只有一半

**适用场景**<br>适合**新生代**，新生代的大多数对象都是存活时间短，复制过去的对象比较少。

> 现代虚拟机都采用复制算法回收新生代，不过是把内存划分为了⼀个 Eden 区和两个 Survivor 区，比例是 8:1:1，每次使用Eden和其中⼀块 Survivor 区，也就是只有 10% 的内存会浪费掉。如果Survivor 空间不够用，需要依赖其他内存比如老年代进行分配担保。复制算法在对象存活率比较高时效率是比较低下的，所以老年<br>代⼀般不使用复制算法。

#### Appel式回收

一种更加优化的复制回收分代策略：具体做法是分配一块较大的Eden区和两块较小的Survivor空间（你可以叫做From或者To，也可以叫做Survivor1和Survivor2）。

专门研究表明，新生代中的对象98%是“朝生夕死”的，所以并不需要按照1:1的比例来划分内存空间，而是将内存分为一块较大的Eden空间和两块较小的Survivor空间，每次使用Eden和其中一块Survivor[1]。当回收时，将Eden和Survivor中还存活着的对象一次性地复制到另外一块Survivor空间上，最后清理掉Eden和刚才用过的Survivor空间。<br>HotSpot虚拟机默认Eden和Survivor的大小比例是8:1，也就是每次新生代中可用内存空间为整个新生代容量的90%（80%+10%），只有10%的内存会被“浪费”。当然，98%的对象可回收只是一般场景下的数据，我们没有办法保证每次回收都只有不多于10%的对象存活，当Survivor空间不够用时，需要依赖其他内存（这里指老年代）进行分配担保（Handle Promotion）

### 分代收集算法

不同对象的生命周期(存活情况)是不⼀样的，而不同生命周期的对象位于堆中不同的区域，因此对堆内存不同区域采⽤不同的策略进行回收可以提高JVM的执行效率。当代商用虚拟机使⽤的都是**分代收集算法**：

- 新生代对象存活率低，就采用复制算法；
- 老年代存活率高，就用标记清除算法或者标记整理算法。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1655137605340-8e344e69-52b1-47dd-b5d6-dbc51aa82a79.png#averageHue=%23faf9f9&clientId=u698ce69c-33d8-4&from=paste&height=502&id=u833cb206&originHeight=753&originWidth=1441&originalType=binary&ratio=1&rotation=0&showTitle=false&size=171861&status=done&style=stroke&taskId=u94ab729f-e06e-4b18-9b21-7d9895501a7&title=&width=960.6666666666666)

## GC类型

### 1、MinorGC/Young GC （新生代回收）

MinorGC：新生代GC，指发生在新生代的拉圾收集动作，MinorGC非常频繁，一般回收速度也非常快

### 2、MajorGC/Old GC （老年代回收）

MajorGC/Old GC(老年代GC): 发生在老年代的GC，出现了Old GC，通常伴随至少一次MinorGC，Old GC速度通常比MinorGC慢10倍以上。<br>目前只有CMS垃圾回收器会有这个单独的收集老年代的行为。

### 3、Full GC （整堆收集）

收集整个Java堆和方法区(注意包含方法区)

#### 触发Full GC情况

以下几种情况会触发Full GC：

1. Tenured Space空间不足以创建打的对象或者数组，会执行Full GC，并且当Full GC之后空间如果还不够，那么会OOM:java heap space。
2. Permanet Generation的大小不足，存放了太多的类信息，在非CMS情况下回触发FullGC。如果之后空间还不够，会OOM:PermGen space。
3. CMS GC时出现promotion failed和concurrent mode failure时，也会触发FullGC。promotion failed是在进行Minor GC时，survivor space放不下、对象只能放入旧生代，而此时旧生代也放不下造成的；concurrent mode failure是在执行CMS GC的过程中同时有对象要放入旧生代，而此时旧生代空间不足造成的。
4. 判断MinorGC后，要晋升到TenuredSpace的对象大小大于TenuredSpace的大小，也会触发FullGC。

可以看出，当FullGC频繁发生时，一定是内存出问题了

## 常见垃圾收集器

JVM中，不同的内存区域作用和性质不一样，使用的垃圾回收算法也不一样，所以JVM中又定义了几种不同的垃圾回收器（图中连线代表两个回收器可以同时使用）：<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671631611174-69326c94-f6e9-45e2-8e6d-18d01a500d7e.png#averageHue=%23f0f0f0&clientId=ucc19786b-1eef-4&from=paste&height=316&id=u6ee51e10&originHeight=926&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&size=155829&status=done&style=stroke&taskId=uacb9daa1-5e8d-4c98-846f-766979c5b35&title=&width=423)<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671631764482-76f01533-e4e6-4e3b-800a-fe5ea989da8b.png#averageHue=%23bccfde&clientId=ucc19786b-1eef-4&from=paste&height=759&id=ufb22f821&originHeight=1138&originWidth=1498&originalType=binary&ratio=1&rotation=0&showTitle=false&size=639705&status=done&style=stroke&taskId=u37b7a4e5-6559-4400-a574-526378cb61f&title=&width=998.6666666666666)

- 并行：垃圾收集的多线程的同时进行。
- 并发：垃圾收集的多线程和应用的多线程同时进行。
- 吞吐量=运行用户代码时间/(运行用户代码时间+ 垃圾收集时间)。
- 垃圾收集时间= 垃圾回收频率 * 单次垃圾回收时间

### Gerial GC

串行GC意味着是一种单线程的，所以它要求收集的时候所有的线程暂停。这对于高性能的应用是不合理的，所以串行GC一般用于Client模式的JVM中。<br>设置：

```
-XX:+UseSerialGC 新生代和老年代都用串行收集器
-XX:+UseParNewGC 新生代使用ParNew，老年代使用Serial Old
-XX:+UseParallelGC 新生代使用ParallerGC，老年代使用Serial Old
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581764737-218fbee3-679b-4f49-9edb-1b22427792c9.png#averageHue=%23f3f3f3&clientId=u8c0af9a2-7be5-4&from=paste&id=uaf141076&originHeight=528&originWidth=2020&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf8414e63-249b-4991-9f8c-16d0b51103f&title=)

### ParNew GC

是在SerialGC的基础上，增加了多线程机制。但是如果机器是单CPU的，这种收集器是比SerialGC效率低的。<br>设置：

```
-XX:+UseParNewGC 新生代使用ParNew，老年代使用Serial Old
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581785275-93b3cf1c-4388-4bb5-9931-3632372e1724.png#averageHue=%23f4f4f4&clientId=u8c0af9a2-7be5-4&from=paste&id=u8d8f5bd5&originHeight=558&originWidth=2036&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u0d64415c-d52e-436d-946d-2a80b42c5bd&title=)

### Parallel Scavenge（ParallerGC）/ Parallel Old

这种收集器又叫吞吐量优先收集器，而吞吐量=程序运行时间/(JVM执行回收的时间+程序运行时间),假设程序运行了100分钟，JVM的垃圾回收占用1分钟，那么吞吐量就是99%。Parallel Scavenge GC由于可以提供比较不错的吞吐量，所以被作为了server模式JVM的默认配置。

### Parallel Old

是老生代并行收集器的一种，使用了标记整理算法，是JDK1.6中引进的，在之前老生代只能使用串行回收收集器。

### Serial Old

老生代client模式下的默认收集器，单线程执行，同时也作为CMS收集器失败后的备用收集器。

### Concurrent Mark Sweep （CMS）

收集器是一种以获取最短回收停顿时间为目标的收集器。目前很大一部分的Java应用集中在互联网站或者B/S系统的服务端上，这类应用尤其重视服务的响应速度，希望系统停顿时间最短，以给用户带来较好的体验。CMS收集器就非常符合这类应用的需求。

- **CMS收集过程：**<br>CMS收集器是基于“标记—清除”算法实现的，它的运作过程相对于前面几种收集器来说更复杂一些，整个过程分为4个步骤，包括：

1. **初始标记**-短暂 <br>仅仅只是标记一下GC Roots能直接关联到的对象，速度很快
2. **并发标记** <br>和用户的应用程序同时进行，进行GC Roots追踪的过程，标记从GCRoots开始关联的所有对象开始遍历整个可达分析路径的对象。这个时间比较长，所以采用并发处理（垃圾回收器线程和用户线程同时工作）
3. **重新标记**-短暂 <br>为了修正并发标记期间因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间一般会比初始标记阶段稍长一些，但远比并发标记的时间短。
4. **并发清除** <br>由于整个过程中耗时最长的并发标记和并发清除过程收集器线程都可以与用户线程一起工作，所以，从总体上来说，CMS收集器的内存回收过程是与用户线程一起并发执行的。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581846306-b8182801-55ee-4847-a38b-2376400af1b4.png#averageHue=%23f1f0f0&clientId=u8c0af9a2-7be5-4&from=paste&id=u5995903a&originHeight=676&originWidth=2084&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=udfa121f5-a45b-4854-9daa-71631c84c1a&title=)

- **设置：**

```
-XX:+UseConcMarkSweepGC ，表示新生代使用ParNew，老年代的用CMS
```

- **CMS的缺点：**

1. CPU敏感 <br>CMS对处理器资源敏感，毕竟采用了并发的收集、当处理核心数不足4个时，CMS对用户的影响较大。
2. 浮动垃圾 <br>由于CMS并发清理阶段用户线程还在运行着，伴随程序运行自然就还会有新的垃圾不断产生，这一部分垃圾出现在标记过程之后，CMS无法在当次收集中处理掉它们，只好留待下一次GC时再清理掉。这一部分垃圾就称为“浮动垃圾”。

> 由于浮动垃圾的存在，因此需要预留出一部分内存，意味着 CMS收集不能像其它收集器那样等待老年代快满的时候再回收。在1.6的版本中老年代空间使用率阈值(92%)，如果预留的内存不够存放浮动垃圾，就会出现 Concurrent Mode Failure，这时虚拟机将临时启用 Serial Old 来替代 CMS。

3. 内存碎片 <br>标记 - 清除算法会导致产生不连续的空间碎片，给大对象的分配带来很大的麻烦。为了解决这个问题，CMS提供一个参数：`-XX:+UseCMSCompactAtFullCollection`，一般是开启的，如果分配不了大对象，就进行内存碎片的整理过程。这个地方一般会使用Serial Old ，因为Serial Old是一个单线程，所以如果内存空间很大、且对象较多时，CMS发生这样情况会很卡。

### GarbageFirst(G1)

> G1是在JDK6的某个版本中才引入的，性能比较高，同时注意了吞吐量和响应时间。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581877197-71e61cc1-7184-4ad4-8b47-56d718570d33.png#averageHue=%23ececec&clientId=u8c0af9a2-7be5-4&from=paste&id=u7075ed09&originHeight=482&originWidth=1716&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u61a3701a-b68d-4a7f-87af-12b9426dfd0&title=)

- **G1来源**

Garbage First（G1）收集器是垃圾收集器技术发展历史上的⾥程碑式的成果，它开创了收集器⾯向局部收集的设计思路和基于 Region的内存布局形式。它和 CMS 同样是⼀款主要⾯向服务端应⽤的垃圾收集器，不过在 JDK9 之后，CMS 就被标记为废弃了，⽽ G1 作为了默认的垃圾收集器，并且在 JDK 14 已经正式移除 CMS 了。在 G1 收集器出现之前的所有其他收集器，包括 CMS 在内，垃圾收集的⽬标范围要么是整个新⽣代（Minor GC），要么就是整个⽼年代（Major GC），在要么就是整个Java 堆（Full GC）。⽽ G1 是基于 Region 堆内存布局，虽然 G1 也仍是遵循分代收集理论设计的，但其堆内存的布局与其他收集器有⾮常明显的差异：G1 不再坚持固定⼤⼩以及固定数量的分代区域划分，⽽是把连续的 Java 堆划分为多个⼤⼩相等的独⽴区域（也就是Region），每⼀个Region 都可以根据需要，扮演新⽣代的 Eden 空间、Survivor 空间或者⽼年代，⽽收集器会根据 Region 的不同⻆⾊采⽤不同的策略去处理。G1 会根据⽤户设定允许的收集停顿时间去优先处理回收价值收益最⼤的那些 Region 区，也就是垃圾最多的 Region 区，这就是 Garbage First 名字的由来 。

- **内存布局** <br>在G1之前的其他收集器进行收集的范围都是整个新生代或者老年代，而G1不再是这样。使用G1收集器时，Java堆的内存布局就与其他收集器有很大差别，它将整个Java堆划分为多个大小相等的独立区域（Region），虽然还保留有新生代和老年代的概念，但新生代和老年代不再是物理隔离的了，它们都是一部分Region（不需要连续）的集合。每一个区域可以通过参数 `-XX:G1HeapRegionSize=size`来设置。Region中还有一块特殊区域`Humongous`区域，专门用于存储大对象，一般只要认为一个对象超过了Region容量的一般可认为是大对象，如果对象超级大，那么使用连续的N个Humongous区域来存储。 <br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581890017-18163b37-b7f1-4986-86a0-1ec3986b1d03.png#averageHue=%23c6ba42&clientId=u8c0af9a2-7be5-4&from=paste&id=u24813839&originHeight=436&originWidth=1006&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u23edbc75-ce94-4594-8a71-a85c2277f39&title=)
- **并行与并发** <br>G1能充分利用多CPU、多核环境下的硬件优势，使用多个CPU（CPU或者CPU核心）来缩短Stop-The-World停顿的时间，部分其他收集器原本需要停顿Java线程执行的GC动作，G1收集器仍然可以通过并发的方式让Java程序继续执行。
- **分代收集** <br>与其他收集器一样，分代概念在G1中依然得以保留。虽然G1可以不需要其他收集器配合就能独立管理整个GC堆，但它能够采用不同的方式去处理新创建的对象和已经存活了一段时间、熬过多次GC的旧对象以获取更好的收集效果。
- **空间整合** <br>与CMS的“标记—清理”算法不同，G1从整体来看是基于“标记—整理”算法实现的收集器，从局部（两个Region之间）上来看是基于“复制”算法实现的，但无论如何，这两种算法都意味着G1运作期间不会产生内存空间碎片，收集后能提供规整的可用内存。这种特性有利于程序长时间运行，分配大对象时不会因为无法找到连续内存空间而提前触发下一次GC。
- **追求停顿时间**

```
-XX:MaxGCPauseMillis 指定目标的最大停顿时间，G1尝试调整新生代和老年代的比例，堆大小，晋升年龄来达到这个目标时间。
-XX:ParallerGCThreads：设置GC的工作线程数量。
```

一般在G1和CMS中间选择的话平衡点在6~8G，只有内存比较大G1才能发挥优势。

#### 垃圾回收器参数设置

对于垃圾收集器的组合使用可以通过下表中的参数指定：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693581908276-327598fb-cec6-4740-a6de-8462b562cf88.png#averageHue=%23f0f0ef&clientId=u8c0af9a2-7be5-4&from=paste&id=uc8422add&originHeight=349&originWidth=581&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub37caf9a-2fb9-489d-8b39-742f958436d&title=)<br>默认的GC种类可以通过jvm.cfg或者通过`jmap dump`出heap来查看，一般我们通过`jstat -gcutil [pid] 1000`可以查看每秒gc的大体情况，或者可以在启动参数中加入：`-verbose:gc -XX:+PrintGCTimeStamps -XX:+PrintGCDetails -Xloggc:./gc.log`来记录GC日志。

#### G1特点

- **内存布局不固定划分分代区域，而是独立Region，每个Region可扮演Eden、Survivor和老年代**

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671633843297-70ea0125-659f-48c8-9509-5bdc0ee65ff2.png#averageHue=%23beb42e&clientId=ucc19786b-1eef-4&from=paste&height=190&id=u91cfc2d7&originHeight=516&originWidth=1380&originalType=binary&ratio=1&rotation=0&showTitle=false&size=276116&status=done&style=stroke&taskId=u2888546e-1f20-4379-9aae-cb630ec9316&title=&width=508)

- **停顿时间短**

> G1能充分利用多CPU、多核环境下的硬件优势，使用多个CPU（CPU或者CPU核心）来缩短Stop-The-World停顿的时间，部分其他收集器原本需要停顿Java线程执行的GC动作，G1收集器仍然可以通过并发的方式让Java程序继续执行。

- **还是基于分代收集思想**

#### G1收集过程

1. **初始标记**：仅仅只是标记⼀下 GC Roots 能直接关联到的对象，这个阶段需要停顿线程，但耗时很短。
2. **并发标记**：从 GC Root 开始对堆中对象进行可达性分析，递归扫描整个堆里的对象图，找出要回收的对象，这阶段耗时较长，但是可与用户程序并发执行。
3. **最终标记**：对用户线程做另⼀个短暂的暂停，用于处理在并发标记阶段新产生的对象引用链变化。
4. **筛选回收**：负责更新 Region 的统计数据，对各个 Region 的回收价值和成本进行排序，根据用户所期望的停顿时间来制定回收计划

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1671634142541-2046d4e7-caf9-4f02-9e35-23890676ad66.png#averageHue=%23ebebeb&clientId=ucc19786b-1eef-4&from=paste&height=257&id=u618c3d16&originHeight=385&originWidth=1452&originalType=binary&ratio=1&rotation=0&showTitle=false&size=251187&status=done&style=stroke&taskId=ua7e855d7-9af1-4efd-9a6e-9ed5efdbbc6&title=&width=968)

### ZGC

ZGC在JDK11被引入，作为新⼀代的垃圾回收器，在设计之初就定义了三大目标：⽀持 TB 级内存，停顿时间控制在 10ms 之内，对程序吞吐量影响小于 15%。关键技术有：

- 有色指针（Colored Pointers）
- 加载屏障（Load Barrier）

# 面试题

## 为什么Survivor空间有两块而不是一块？

**因为一个对象的存活周期的需要两块来倒腾。**<br>这⾥涉及到⼀个新⽣代和⽼年代的存活周期问题，⽐如⼀个对象在新⽣代经历 15 次（仅供参考）GC，就可以移到⽼年代了。问题来了，当我们第⼀次 GC 的 时候，我们可以把Eden 区的存活对象放到 Survivor A 空间，但是第⼆次 GC 的时候，Survivor A 空间的存活对象也需要再次⽤ Copying 算法，放到 Survivor B 空间上，⽽把刚刚的 Survivor A 空间和Eden 空间清除。第三次 GC 时，⼜把 Survivor B 空间的存活对象复制到 Survivor A 空间，如此反复。 所以，这⾥就 需要两块 Survivor 空间来回倒腾。

## 为什么 Eden 空间这么大而Survivor 空间要分的少一点？

**新生的对象基本都是需要马上被回收的，需要移动到Survivor的对象比较少。**<br>新创建的对象都是放在 Eden 空间，这是很频繁的，尤其是⼤量的局部变量产⽣的临时对象，这些对象绝⼤部分都应该马上被回收，能存活下来被转移到survivor 空间的往往不多。所以，设置较⼤的 Eden 空间和较小的Survivor 空间是合理的， 这大大提高了内存的使⽤率，缓解了复制算法的缺点。

## 从 Eden 空间往 Survivor 空间转移的时候Survivor 空间不够了怎么办？

直接放到老年代去。 <br>
