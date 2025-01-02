---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
dg-publish: true
---

# JVM Runtime Data Area（Java内存模式）

注意和JMM（Java内存模型区分开）

## Runtime Data Area 运行时数据区介绍

Runtime Data Area是存放数据的。分为五部分：`Stack`、`Heap`、`Method Area`、`PC Register`、`Native Method Stack`。几乎所有的关于Java内存方面的问题，都是集中在这块。下图是关于Run-time Data Areas的描述：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582779561-35e092c5-88f0-457b-aa4d-bd4935c6d423.png#averageHue=%23f9ecc6&clientId=u27245360-9349-4&from=paste&id=u9574eeed&originHeight=495&originWidth=801&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf5502edf-046d-4b2d-9dfd-327417d4a41&title=)

### 线程私有的数据区，包含程序计数器、虚拟机栈、本地方法栈

1. 程序计数器(PC Register) ，记录正在执行的虚拟机字节码的地址
2. 虚拟机栈(Stack)，方法执行的内存区，每个方法执行时会在虚拟机栈中创建栈帧
3. 本地方法栈(Native Method Stack)，虚拟机的Native方法执行的内存区

### 所有线程共享的数据区，包含Java堆、方法区（有常量池）

1. Java堆(Heap)，对象分配内存的区域
2. 方法区(Method Area)，存放类信息、常量、静态变量、编译器编译后的代码等数据；常量池：存放编译器生成的各种字面量和符号引用，是方法区的一部分。

> 程序计数器、虚拟机栈、本地方法栈这 3 个区域是线程私有的，会随线程消亡而自动回收，所以不需要GC管理；垃圾收集只需要关注堆和方法区，而方法区的回收，往往性价比较低，因为判断可以回收的条件比较苛刻，而垃圾收集回报率高的是堆中内存的回收

详细内存模型：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582804453-506bf2a3-95be-4d59-91cd-064e02639ab3.png#averageHue=%23cbd0cc&clientId=u27245360-9349-4&from=paste&id=u55b6c7ca&originHeight=428&originWidth=799&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ua716fcc3-359e-485d-a8a1-dd8bf16b95f&title=)

## Stack 虚拟机栈  （线程私有）

栈是先进后出(FILO)的数据结构。虚拟机栈在JVM运行过程中存储当前线程运行方法所需的数据，指令、返回地址。Java虚拟机栈是基于线程的，哪怕你只有一个 main() 方法，也是以线程的方式运行的。在线程的生命周期中，参与计算的数据会频繁地入栈和出栈，栈的生命周期是和线程一样的。<br>栈里的每条数据，就是栈帧。在每个 Java方法被调用的时候，都会创建一个栈帧，并入栈。一旦完成相应的调用，则出栈。所有的栈帧都出栈后，线程也就结束了。

> 栈的大小缺省为1M，可用参数`–Xss`调整大小，例如-Xss256k

JVM的指令集是基于栈而不是寄存器，基于栈可以具备很好的跨平台性。在线程中执行一个方法时，我们会创建一个栈帧入栈并执行，如果该方法又调用另一个方法时会再次创建新的栈帧然后入栈，方法返回之际，原栈帧会返回方法的执行结果给之前的栈帧，随后虚拟机将会丢弃此栈帧。

### 栈组成--栈帧

Stack是Java栈内存，它等价于C语言中的栈，**栈的内存地址是不连续的，每个线程都拥有自己的栈。栈里面存储着的是StackFrame**，在《JVM Specification》中文版中被译作java虚拟机框架，也叫做`栈帧`。**StackFrame包含三类信息：局部变量表、操作数栈、动态连接、返回地址。**<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582821181-c9bae1fc-5a8b-4f74-885d-cc4ea62280c1.png#averageHue=%2383b495&clientId=u27245360-9349-4&from=paste&id=u89907ce4&originHeight=870&originWidth=1018&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf4b01737-adf6-477e-b52e-cd16317bc6e&title=)<br>![](https://note.youdao.com/yws/res/73600/A92E27A4DA8D4670AEFBF4BA23232894#id=k6fvC&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### 1. 局部变量表(Local Variable Table)

局部变量表(Local Variable Table)是一组变量值存储空间，用于存放我们的局部变量的。用于存放方法参数和方法内定义的局部变量(基本数据类型，对象的引用)。虚拟机通过索引定位的方法查找相应的局部变量。

```java
public class TestStack {
    public static int NUM1 = 100;
    public int sub(int a, int b) {
        return a-b-NUM1;
    }
}
```

对应字节码:

```
public sub(II)I
   L0
    LINENUMBER 19 L0
    ILOAD 1
    ILOAD 2
    ISUB
    GETSTATIC com/example/jvm/TestStack.NUM1 : I
    ISUB
    IRETURN
   L1
    LOCALVARIABLE this Lcom/example/jvm/TestStack; L0 L1 0  // 局部变量表第0个位置为this
    LOCALVARIABLE a I L0 L1 1 // 局部变量表第1个位置为a
    LOCALVARIABLE b I L0 L1 2 // 局部变量表弟2个位置为b
    MAXSTACK = 2
    MAXLOCALS = 3
```

几个局部变量？

> 答案是3个，除了a和b，还有this；对应实例对象方法编译器都会追加一个this参数。如果该方法为静态方法则为2个了

#### 2. 操作数栈

通过局部变量表我们有了要操作和待更新的数据，我们如果对局部变量这些数据进行操作呢？通过操作数栈。<br>当一个方法刚刚开始执行时，其操作数栈是空的，随着方法执行和字节码指令的执行，会从局部变量表或对象实例的字段中复制常量或变量写入到操作数栈，再随着计算的进行将栈中元素出栈到局部变量表或者返回给方法调用者，也就是出栈/入栈操作。

> 一个完整的方法执行期间往往包含多个这样出栈/入栈的过程。

#### 3. 动态连接

Java语言特性多态（需要类运行时才能确定具体的方法）。

#### 4. 返回地址

正常返回（调用程序计数器中的地址作为返回）、异常的话（通过异常处理器表<非栈帧中的>来确定）

StackFrame在方法被调用时创建，在某个线程中，某个时间点上，只有一个框架是活跃的，该框架被称为Current Frame，而框架中的方法被称为Current Method，其中定义的类为Current Class。局部变量和操作数栈上的操作总是引用当前框架。当Stack Frame中方法被执行完之后，或者调用别的StackFrame中的方法时，则当前栈变为另外一个StackFrame。Stack的大小是由两种类型，固定和动态的，动态类型的栈可以按照线程的需要分配。下面两张图是关于栈之间关系以及栈和非堆内存的关系基本描述（来自<http://www.programering.com/a/MzM3QzNwATA.html> ）<br>![](https://note.youdao.com/src/63DA8DB2300F4839A9C2EDAB62E2DCE5#id=rRx6r&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582858040-581f3b62-1b9f-4741-8756-e58fb48b0076.png#averageHue=%23efefef&clientId=u27245360-9349-4&from=paste&id=u4841fe47&originHeight=472&originWidth=552&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u46510b28-3dde-4167-a083-c2886953b5c&title=)

### 栈的大小

JVM允许栈的大小是固定的或者是动态变化的。在[Oracle的关于参数设置的官方文档中有关于Stack的设置](http://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/jrdocs/refman/optionX.html#wp1024112)是通过`-Xss`来设置其大小。关于Stack的默认大小对于不同机器有不同的大小，并且不同厂商或者版本号的jvm的实现其大小也不同，如下表是HotSpot的默认大小：<br>![](https://note.youdao.com/yws/res/71097/99859277B8704EBC9FE684A3C8EDC0E7#id=ORD0r&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582869397-9f95c06c-a10a-4474-9c27-15aaaab0d1ad.png#averageHue=%23fdfcfb&clientId=u27245360-9349-4&from=paste&id=ub731657d&originHeight=277&originWidth=639&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ua7029552-e91e-44e6-aeba-0b866c528a1&title=)

### 栈之GC

栈是不需要垃圾回收的，尽管说垃圾回收是Java内存管理的一个很热的话题，栈中的对象如果用垃圾回收的观点来看，他永远是live状态，是可以reachable的，所以也不需要回收，它占有的空间随着Thread的结束而释放。

> 另外栈上有一点得注意的是，对于本地代码调用，可能会在栈中申请内存，比如C调用malloc()，而这种情况下，GC是管不着的，需要我们在程序中，手动管理栈内存，使用free()方法释放内存。

### 栈异常

栈一般会发生以下两种异常：

1. 当线程中的计算所需要的栈超过所允许大小时，会抛出`StackOverflowError`。
2. 当Java栈试图扩展时，没有足够的存储器来实现扩展，JVM会报`OutOfMemoryError`。

### 代码优化

我们一般通过减少常量，参数的个数来减少栈的增长，在程序设计时，我们把一些常量定义到一个对象中，然后来引用他们可以体现这一点。另外，少用递归调用也可以减少栈的占用。

## PC Register 程序计数器 (不会发生OOM)  （线程私有）

PC Register是程序计数寄存器，每个Java线程都有一个单独的PC Register，他是一个指针，由Execution Engine读取下一条指令。如果该线程正在执行java方法，则PC Register存储的是正在被执行的指令的地址，如果是本地方法，PC Register的值没有定义。PC寄存器非常小，只占用一个字宽，可以持有一个returnAdress或者特定平台的一个指针。

较小的内存空间，当前线程执行的字节码的行号指示器；各线程之间独立存储，互不影响。<br>程序计数器是一块很小的内存空间，主要用来记录各个线程执行的字节码的地址，例如，分支、循环、跳转、异常、线程恢复等都依赖于计数器。<br>由于 Java 是多线程语言，当执行的线程数量超过 CPU 核数时，线程之间会根据时间片轮询争夺 CPU资源。如果一个线程的时间片用完了，或者是其它原因导致这个线程的CPU资源被提前抢夺，那么这个退出的线程就需要单独的一个程序计数器，来记录下一条运行的指令。

程序计数器也是JVM中唯一不会OOM(OutOfMemory)的内存区域

## Native Method Stack 本地方法栈 (合并到虚拟机栈) （线程私有）

Native Method Stack是供本地方法（非java）使用的栈。每个线程持有一个Native Method Stack。

1. 当一个JVM创建的线程调用native方法后，JVM不再为其在虚拟机栈中创建栈帧，JVM只是简单地动态链接并直接调用native方法
2. 虚拟机规范无强制规定，各版本虚拟机自由实现。HotSpot直接把本地方法栈和虚拟机栈合二为一

---

## Heap 堆 （线程共享）

Heap是用来存放对象信息的，和Stack不同，Stack代表着一种运行时的状态。换句话说，栈是运行时单位，解决程序该如何执行的问题，而堆是存储的单位，解决数据存储的问题。<br>Heap是伴随着JVM的启动而创建，**负责存储所有对象实例和数组的**。

### Heap组成

在JVM初始化的时候，我们可以通过参数来分别指定，堆的大小、以及Young Generation和Old Generation的比值、Eden区和From Space的比值，从而来细粒度的适应不同JAVA应用的内存需求。

![](https://note.youdao.com/src/844063A2AC4C4CD7976EACA673ECC2CA#id=LKM6a&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

---

![](https://note.youdao.com/src/F86235CCB721471EB08E32F4897E9C05#id=H8ue9&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### Heap Space

堆的存储空间和栈一样是不需要连续的，它分为`Young Generation`和`Old Generation`（也叫Tenured Generation）两大部分。`Young Generation`分为`Eden`和`Survivor`，`Survivor`又分为`From Space`和 `ToSpace`。

##### Young Generation 新生代

###### Eden 存放新生的对象，对象优先分配至Eden区，当空间不足时，将触发MinorGC

###### Survivor 主要用于存储垃圾回收之后的存活对象

1. From Space
2. To Space

##### Old Generation(Tenured Generation) 老年代

用于存放生命周期较长的大对象

##### 对象的转移

Eden区里存放的是新生的对象；From Space和To Space中存放的是每次垃圾回收后存活下来的对象，所以每次垃圾回收后，Eden区会被清空；存活下来的对象先是放到From Space，当From Space满了之后移动到To Space；当To Space满了之后移动到Old Space。Survivor的两个区是对称的，没先后关系，所以同一个区中可能同时存在从Eden复制过来的对象和从前一个Survivor复制过来的对象，而复制到Old Space区的只有从第一个Survivor复制过来的对象。而且，Survivor区总有一个是空的。同时，根据程序需要，Survivor可以配置多个（多于2个），这样可以增加对象在Young Generation中存在的时间，减少被放到Old Generation的可能。<br>Old Space中则存放生命周期比较长的对象，而且有些比较大的新生对象也放在Old Space中。

大对象：长期存活的对象，对象每在Survivor经历一次MinorGC，Age增加1，当增长到15时，就直接晋升到老年代；如果在Survivor空间中相同年龄所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄段对象就可以直接进入老年代。

![](https://note.youdao.com/src/98DAB6EE2DF244EBB71D928104AD5090#id=mjr1J&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### MinorGC、MajorGC和FullGC

1. MinorGC 发生在Yong Generation的GC

MinorGC非常频繁，一般回收速度也非常快
2.  MajorGC 发生在Tenured space的GC

发生在老年代的GC，出现了MajorGC，通常伴随至少一次MinorGC，MajorGC速度通常比MinorGC慢10倍以上
3.  FullGC 整个Heap（both Young and Tenured spaces）

### 堆内存大小改变

堆的大小通过`-Xms`和`-Xmx`来指定最小值和最大值。

通过`-Xmn`来指定Young Generation的大小（一些老版本也用-XX:NewSize指定），即Eden加FromSpace和ToSpace的总大小。然后通过-XX:NewRatio来指定Eden区的大小，在Xms和Xmx相等的情况下，该参数不需要设置。通过-XX：SurvivorRatio来设置Eden和一个Survivor区的比值。

### 堆异常

堆异常分为两种，一种是`Out of Memory(OOM)`，一种是`Memory Leak(ML)`。Memory Leak最终将导致OOM。<br>关于异常的处理，确定OOM/ML异常后，一定要注意保护现场，可以dump heap，如果没有现场则开启GCFlag收集垃圾回收日志，然后进行分析，确定问题所在。如果问题不是ML的话，一般通过增加Heap，增加物理内存来解决问题，是的话，就修改程序逻辑。

## Method Area 方法区 (Permanent Space)（线程共享）

方法区主要是用来存放已被虚拟机**加载的类相关信息，包括类信息、静态变量、常量、运行时常量池、字符串常量池。** Method Area在HotSpot JVM的实现中属于非堆区。

方法区是一种规范，不同的虚拟机实现不一样。JDK1.7及之前方法区的实现是永久代；JDK1.8后永久代被移除，取而代之的是元空间。

非堆区包括两部分：Permanent Generation和Code Cache。

1. Method Area属于Permanent Generation的一部分，Permanent Generation用来存储类信息，比如说：class definitions，structures，methods， field， method (data and code) 和 constants。
2. Code Cache用来存储Compiled Code，即编译好的本地代码，在HotSpot JVM中通过JIT(Just In Time) Compiler生成，JIT是即时编译器，他是为了提高指令的执行效率，把字节码文件编译成本地机器代码，如下图：

![](https://note.youdao.com/src/4B314D597B7B4A8784A460F95298994C#id=OLK0y&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

### 方法区线程安全

方法区与堆空间类似，也是一个共享内存区，所以方法区是线程共享的。假如两个线程都试图访问方法区中的同一个类信息，而这个类还没有装入 JVM，那么此时就只允许一个线程去加载它，另一个线程必须等待。在 HotSpot虚拟机、Java7版本中已经将永久代的静态变量和运行时常量池转移到了堆中，其余部分则存储在 JVM 的非堆内存中，而 Java8 版本已经将方法区中实现的永久代去掉了，并用元空间（class metadata）代替了之前的永久代，并且元空间的存储位置是本地JVM外内存

### Permanent Space（永久代）

很多开发者都习惯将方法区称为“永久代”，其实这两者并不是等价的。主要存放的是Java类定义信息，与垃圾收集器要收集的Java对象关系不大。

HotSpot 虚拟机使用永久代来实现方法区，但在其它虚拟机中，例如，Oracle 的 JRockit、IBM 的 J9就不存在永久代一说。因此，方法区只是 JVM 中规范的一部分，可以说，在 HotSpot虚拟机中，设计人员使用了永久代来实现了JVM规范的方法区。

Java7及以前版本的Hotspot中方法区位于永久代中。同时，永久代和堆是相互隔离的，但它们使用的物理内存是连续的。永久代的垃圾收集是和老年代捆绑在一起的，因此无论谁满了，都会触发永久代和老年代的垃圾收集。但在Java7中永久代中存储的部分数据已经开始转移到Java Heap或Native Memory中了。比如，符号引用(Symbols)转移到了Native Memory；字符串常量池(interned strings)转移到了Java Heap；类的静态变量(class statics)转移到了Java Heap。<br>![](https://note.youdao.com/src/6577730AA96A4F59BE1C18A402AA13D0#id=zF54o&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

- 设置永久代空间大小<br>JDK1.7及以前（初始和最大值）：-XX:PermSize；-XX:MaxPermSize；

### Metaspace（元空间）

Java8，HotSpots取消了永久代，元空间(Metaspace)登上舞台，方法区存在于元空间(Metaspace)。同时，元空间不再与堆连续，而且是存在于本地内存（Native memory）。

本地内存（Native memory），也称为C-Heap，是供JVM自身进程使用的。当Java Heap空间不足时会触发GC，但Native memory空间不够却不会触发GC。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582915023-d50a44ec-af14-41eb-91c8-fceb115413f9.png#averageHue=%2372bf62&clientId=u27245360-9349-4&from=paste&height=587&id=ud4e5e4df&originHeight=1310&originWidth=1440&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u20ef96f5-249e-465e-8155-6def759fcda&title=&width=645.3333740234375)

> 元空间存在于本地内存，意味着只要本地内存足够，它不会出现像永久代中“java.lang.OutOfMemoryError: PermGen space”这种错误

#### 元空间大小参数：

```
-XX:MetaspaceSize，class metadata的初始空间配额，以bytes为单位，达到该值就会触发垃圾收集进行类型卸载，同时GC会对该值进行调整：如果释放了大量的空间，就适当的降低该值；如果释放了很少的空间，那么在不超过MaxMetaspaceSize（如果设置了的话），适当的提高该值。
-XX：MaxMetaspaceSize，可以为class metadata分配的最大空间。默认是没有限制的。
-XX：MinMetaspaceFreeRatio,在GC之后，最小的Metaspace剩余空间容量的百分比，减少为class metadata分配空间导致的垃圾收集。
-XX:MaxMetaspaceFreeRatio,在GC之后，最大的Metaspace剩余空间容量的百分比，减少为class metadata释放空间导致的垃圾收集。
```

#### Java8 为什么使用元空间替代永久代，这样做有什么好处呢？

1. 永久带会为GC带来不必要的复杂性，并且回收效率偏低，在永久代中元数据可能会随着每一次赋GC发生而进行移动，而 hotspot虚拟机每种类型的垃圾回收器都要特殊处理永久代中的元数据，分离出来以后可以简化赋GC，以及以后并发隔离元数据等方面进行优化。
2. 移除永久代是为了融合 HotSpot JVM 与 JRockit VM 而做出的努力，因为 JRockit没有永久代，所以不需要配置永久代。永久代内存经常不够用或发生内存溢出，抛出异常 java.lang.OutOfMemoryError: PermGen。这是因为在 JDK1.7 版本中，指定的 PermGen 区大小为 8M，由于 PermGen 中类的元数据信息在每次 FullGC 的时候都可能被收集，回收率都偏低，成绩很难令人满意；还有，为 PermGen 分配多大的空间很难确定，PermSize 的大小依赖于很多因素，比如，JVM 加载的 class 总数、常量池的大小和方法的大小等。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582937168-7d4f4a87-1e1b-49a0-9490-d190124d091b.png#averageHue=%23f6faf8&clientId=u27245360-9349-4&from=paste&id=u94a3421a&originHeight=334&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf27bc0f2-4cd5-4fe9-9988-9efe2457dba&title=)

- [ ] JVM参数参考：<https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html>
- [ ] 从永久代（PermGen）到元空间（Metaspace）<br><http://blog.csdn.net/zhyhang/article/details/17246223>

#### 运行时常量在不同版本的位置

- 在jdk 1.6中，运行时常量池位于方法区中。
- jdk 1.7开始将运行时常量池放置于java堆中。
- jdk 1.8之后删去了方法区这个数据区，使用位于直接内存中的元空间取代了方法区，这时运行时常量池在元空间中

## 从底层深入理解运行时数据区

### 工具HSDB查询内存分配，内存地址

## 其他

### 堆外内存（本地内存）

![](https://note.youdao.com/src/A8B2D67CB56E4838928F39FBA2E6229A#id=e13rP&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

不是虚拟机运行时数据区的一部分，也不是java虚拟机规范中定义的内存区域；

1. 如果使用了NIO，这块区域会被频繁使用，在Java堆内可以用directByteBuffer对象直接引用并操作；
2. 这块内存不受Java堆大小限制，但受本机总内存的限制，可以通过MaxDirectMemorySize来设置（默认与堆内存最大值一样），所以也会出现OOM异常；

### 内存溢出

#### 栈溢出 (StackOverFlowError)

HotSpot版本中栈的大小是固定的，是不支持拓展的。java.lang.StackOverflowError  一般的方法调用是很难出现的，如果出现了可能会是无限递归。<br>虚拟机栈带给我们的启示：方法的执行因为要打包成栈桢，所以天生要比实现同样功能的循环慢，所以树的遍历算法中：递归和非递归(循环来实现)都有存在的意义。递归代码简洁，非递归代码复杂但是速度较快。<br>OutOfMemoryError：不断建立线程，JVM申请栈内存，机器没有足够的内存。（一般演示不出，演示出来机器也死了）

JVM设置栈内存参数：-Xss1m

示例代码：

```java
/**
 * 栈溢出 -Xss1m
 */
public class StackOverFlow {

    public void king(){//一个栈帧--虚拟机栈运行
        king();//无穷的递归
    }
    public static void main(String[] args)throws Throwable {
        StackOverFlow javaStack = new StackOverFlow(); //new一个对象
        javaStack.king();
    }
}
```

输出：

```

Exception in thread "main" java.lang.StackOverflowError
	at com.example.oom.StackOverFlow.king(StackOverFlow.java:10)
	at com.example.oom.StackOverFlow.king(StackOverFlow.java:10)
	// ...
	at com.example.oom.StackOverFlow.king(StackOverFlow.java:10)
```

#### 堆溢出 (OutOfMemoryError)

申请内存空间,超出最大堆内存空间

JVM参数设置堆内存：-Xms，-Xmx参数

示例代码1：

```java
// VM Args：-Xms30m -Xmx30m -XX:+PrintGCDetails 堆内存溢出（直接溢出）
public class HeapOom {
    public static void main(String[] args) {
        String[] strings = new String[35 * 1000 * 1000];  //35m的数组（堆）
        System.out.println("HeapOom demo");
    }
}
```

输出：

```
[GC (Allocation Failure) [PSYoungGen: 843K->480K(9216K)] 843K->488K(29696K), 0.0023969 secs] [Times: user=0.01 sys=0.01, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 480K->384K(9216K)] 488K->392K(29696K), 0.0018090 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
[Full GC (Allocation Failure) [PSYoungGen: 384K->0K(9216K)] [ParOldGen: 8K->298K(20480K)] 392K->298K(29696K), [Metaspace: 2814K->2814K(1056768K)], 0.0053457 secs] [Times: user=0.02 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 0K->0K(9216K)] 298K->298K(29696K), 0.0012725 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC (Allocation Failure) [PSYoungGen: 0K->0K(9216K)] [ParOldGen: 298K->286K(20480K)] 298K->286K(29696K), [Metaspace: 2814K->2814K(1056768K)], 0.0050989 secs] [Times: user=0.02 sys=0.00, real=0.01 secs] 
Heap
 PSYoungGen      total 9216K, used 246K [0x00000007bf600000, 0x00000007c0000000, 0x00000007c0000000)
  eden space 8192K, 3% used [0x00000007bf600000,0x00000007bf63d890,0x00000007bfe00000)
  from space 1024K, 0% used [0x00000007bfe00000,0x00000007bfe00000,0x00000007bff00000)
  to   space 1024K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007c0000000)
 ParOldGen       total 20480K, used 286K [0x00000007be200000, 0x00000007bf600000, 0x00000007bf600000)
  object space 20480K, 1% used [0x00000007be200000,0x00000007be247b28,0x00000007bf600000)
 Metaspace       used 2846K, capacity 4486K, committed 4864K, reserved 1056768K
  class space    used 296K, capacity 386K, committed 512K, reserved 1048576K
:JavaTestCases:HeapOom.main() spend 324ms
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at com.example.oom.HeapOom.main(HeapOom.java:10)
      00:03.97   :JavaTestCases:compileJava
      00:00.32   :JavaTestCases:HeapOom.main()
      00:00.06   :libCommonJava:compileJava
```

示例代码2：

```java
/**
 * VM Args：-Xms30m -Xmx30m -XX:+PrintGC
 * 堆的大小30M 造成一个堆内存溢出(分析下JVM的分代收集)
 * GC调优---生产服务器推荐开启(默认是关闭的) -XX:+HeapDumpOnOutOfMemoryErro
 */
public class HeapOom2 {
    public static void main(String[] args) {
        //GC ROOTS
        List<Object> list = new LinkedList<>(); // list   当前虚拟机栈（局部变量表）中引用的对象  是1，不是走2
        int i = 0;
        while (true) {
            i++;
            if (i % 10000 == 0) System.out.println("i=" + i);
            list.add(new Object());
        }

    }
}
```

输出：

```
Exception in thread "main" java.lang.OutOfMemoryError: GC overhead limit exceeded
	at com.example.oom.HeapOom2.main(HeapOom2.java:20)
      00:05.82   :JavaTestCases:HeapOom2.main()
      00:00.18   :JavaTestCases:compileJava
      00:00.05   :libCommonJava:compileJava
```

#### 方法区溢出

1. 运行时常量池溢出
2. 方法区中保存的Class对象没有被及时回收掉或者Class信息占用的内存超过了我们配置

示例代码：

```java
/**
 * cglib动态生成
 * Enhancer中 setSuperClass和setCallback, 设置好了SuperClass后, 可以使用create制作代理对象了
 * 限制方法区的大小导致的内存溢出
 * VM Args: -XX:MetaspaceSize=10M -XX:MaxMetaspaceSize=10M
 * */
public class MethodAreaOutOfMemory {

    public static void main(String[] args) {
        while (true) {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(TestObject.class);
            enhancer.setUseCache(false);
            enhancer.setCallback(new MethodInterceptor() {
                public Object intercept(Object arg0, Method arg1, Object[] arg2, MethodProxy arg3) throws Throwable {
                    return arg3.invokeSuper(arg0, arg2);
                }
            });
            enhancer.create();
        }
    }

    public static class TestObject {
        private double a = 34.53;
        private Integer b = 9999999;
    }
}
```

**Class要被回收条件：**

1. 该类所有的实例都已经被回收，也就是堆中不存在该类的任何实例
2. 加载该类的ClassLoader已经被回收
3. 该类对应的java.lang.Class对象没有在任何地方被引用，无法在任何地方通过反射访问该类的方法
4. 没有设置`-Xnoclassgc` <br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693582965291-1e2fe425-2592-4991-bed6-46a17bc89e61.png#averageHue=%23f9f8f6&clientId=u27245360-9349-4&from=paste&id=ud694c36e&originHeight=116&originWidth=1396&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u06f3a0cc-4409-4962-8e53-cff270c5637&title=)<br>![](https://note.youdao.com/yws/res/73679/196BD8DA58DB44B6B07667FE3C2DD377#id=Nra8Y&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)

#### 本机直接内存溢出

直接内存的容量可以通过MaxDirectMemorySize来设置（默认与堆内存最大值一样），所以也会出现OOM异常；<br>由直接内存导致的内存溢出，一个比较明显的特征是在HeapDump文件中不会看见有什么明显的异常情况，如果发生了OOM，同时Dump文件很小，可以考虑重点排查下直接内存方面的原因。

示例代码：

```java
// NIO
/**
 * VM Args：-XX:MaxDirectMemorySize=100m 堆外内存（直接内存溢出）
 */
public class DirectOom {
    public static void main(String[] args) {
        //直接分配128M的直接内存(100M)
        ByteBuffer bb = ByteBuffer.allocateDirect(128 * 1024 * 1204);
    }
}
```

输出：

```
Exception in thread "main" java.lang.OutOfMemoryError: Direct buffer memory
	at java.nio.Bits.reserveMemory(Bits.java:694)
	at java.nio.DirectByteBuffer.<init>(DirectByteBuffer.java:123)
	at java.nio.ByteBuffer.allocateDirect(ByteBuffer.java:311)
	at com.example.oom.DirectOom.main(DirectOom.java:11)
```

### 对象的分配策略

见`对象的分配策略.md`
