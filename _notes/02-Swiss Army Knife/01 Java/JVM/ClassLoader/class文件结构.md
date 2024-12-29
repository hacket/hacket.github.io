---
date created: 2024-12-27 23:41
date updated: 2024-12-27 23:41
dg-publish: true
tags:
  - '#1'
  - '#6.#20'
  - '#2'
  - '#21.#22'
  - '#3'
  - '#23'
  - '#4'
  - '#24.#25'
  - '#5'
  - '#26'
  - '#6'
  - '#27'
  - '#7'
  - '#8'
  - '#9'
  - '#10'
  - '#11'
  - '#12'
  - '#13'
  - '#14'
  - '#15'
  - '#16'
  - '#17'
  - '#18'
  - '#19'
  - '#20'
  - '#7:#8'
  - '#21'
  - '#28'
  - '#22'
  - '#29:#30'
  - '#23'
  - '#24'
  - '#31'
  - '#25'
  - '#32:#33'
  - '#26'
  - '#27'
  - '#28'
  - '#29'
  - '#30'
  - '#31'
  - '#32'
  - '#33'
  - '#1'
  - '#2'
  - '#3'
  - '#4'
  - '#1'
  - '#5.#20'
  - '#2'
  - '#4.#21'
  - '#3'
  - '#4.#22'
  - '#4'
  - '#23'
  - '#5'
  - '#24'
  - '#6'
  - '#7'
  - '#8'
  - '#9'
  - '#10'
  - '#11'
  - '#12'
  - '#13'
  - '#14'
  - '#15'
  - '#16'
  - '#17'
  - '#18'
  - '#19'
  - '#20'
  - '#9:#10'
  - '#21'
  - '#6:#7'
  - '#22'
  - '#8:#7'
  - '#23'
  - '#24'
---

# [class文件结构](http://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4)

## class文件介绍

### 什么是class文件？

能够被JVM识别，加载并执行的文件格式；很多语言可以生成class文件（Java、Scala、Python、Groovy、Kotlin）。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558529255-011a529b-e30a-48ae-8d54-f2eacf0c6109.png#averageHue=%23fdfefb&clientId=u39dd456b-378d-4&from=paste&height=327&id=uc1b78bba&originHeight=402&originWidth=666&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6e4cf6ff-3bf4-4e1d-913a-cba4179b85c&title=&width=541)<br>Java之所以能够跨平台运行，是因为Java虚拟机可以载入和执行同一种平台无关的字节码。也就是说，实现语言平台无关性的基础是虚拟机和字节码存储格式，虚拟机并不关心Class的来源是什么语言，只要它符合Class文件应有的结构就可以在Java虚拟机中运行。

字节码文件由`十六进制`值组成，而JVM以两个十六进制值为一组，即以字节为单位进行读取。

### 如何生成一个class文件

- ide自动生成
- javac手动生成

### class文件的作用

记录一个类文件的所有信息，如名称，方法，变量等。

### class文件弊端

- 内存占用大，不适合移动端
- class文件是堆栈的加载模式，加载速度慢
- 文件IO操作多，类查找慢

### 查看class二进制和字节码格式

源码：

```java
package com.example.asm;
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

#### 查看class字节码

1. javap，执行命令`javap -verbose HelloWorld`

```java
Classfile /Users/zengfansheng/Hacket/Workspace/king-assist/JavaTestCases/build/classes/java/main/com/example/asm/HelloWorld.class
  Last modified 2021-8-26; size 566 bytes
  MD5 checksum 8e2a168f70b6e4aeff39b67251df7750
  Compiled from "HelloWorld.java"
public class com.example.asm.HelloWorld
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #6.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #21.#22        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #23            // Hello World!
   #4 = Methodref          #24.#25        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #26            // com/example/asm/HelloWorld
   #6 = Class              #27            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lcom/example/asm/HelloWorld;
  #14 = Utf8               main
  #15 = Utf8               ([Ljava/lang/String;)V
  #16 = Utf8               args
  #17 = Utf8               [Ljava/lang/String;
  #18 = Utf8               SourceFile
  #19 = Utf8               HelloWorld.java
  #20 = NameAndType        #7:#8          // "<init>":()V
  #21 = Class              #28            // java/lang/System
  #22 = NameAndType        #29:#30        // out:Ljava/io/PrintStream;
  #23 = Utf8               Hello World!
  #24 = Class              #31            // java/io/PrintStream
  #25 = NameAndType        #32:#33        // println:(Ljava/lang/String;)V
  #26 = Utf8               com/example/asm/HelloWorld
  #27 = Utf8               java/lang/Object
  #28 = Utf8               java/lang/System
  #29 = Utf8               out
  #30 = Utf8               Ljava/io/PrintStream;
  #31 = Utf8               java/io/PrintStream
  #32 = Utf8               println
  #33 = Utf8               (Ljava/lang/String;)V
{
  public com.example.asm.HelloWorld();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/example/asm/HelloWorld;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String Hello World!
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 6: 0
        line 7: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  args   [Ljava/lang/String;
```

2. AS插件：`ASM Bytecode Viewer`

```java
// class version 52.0 (52)
// access flags 0x21
public class com/example/asm/HelloWorld {

  // compiled from: HelloWorld.java

  // access flags 0x1
  public <init>()V
   L0
    LINENUMBER 3 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this Lcom/example/asm/HelloWorld; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x9
  public static main([Ljava/lang/String;)V
   L0
    LINENUMBER 6 L0
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    LDC "Hello World!"
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
   L1
    LINENUMBER 7 L1
    RETURN
   L2
    LOCALVARIABLE args [Ljava/lang/String; L0 L2 0
    MAXSTACK = 2
    MAXLOCALS = 1
}
```

3. jclasslib bytecode viewer 查看字节码

#### 查看class二进制工具

可以通过`010editor`查看class文件<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558837615-80658a13-24a9-433c-84d6-c026d0c22990.png#averageHue=%233a3935&clientId=u39dd456b-378d-4&from=paste&id=ud17c84c7&originHeight=1502&originWidth=1720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8dbd6810-eb60-4f95-8934-6f55498a237&title=)

## class文件格式详解

class 文件是一组以 8位字节为基础单位的二进制流，各个数据项目严格按照顺序紧凑地排列在class文件之中，中间没有添加任何分隔符，这使得整个 Class 文件中存储的内容几乎全部是程序运行的必要数据，没有空隙存在。

> 当遇到需要占用 8 位字节以上空间的数据项 时，则会按照高位在前的方式分割成若干个 8 位字节进行存储。（高位在前指 ”Big-Endian"，即指最高位字节在地址最低位，最低位字节在地址最高位的顺序来存储数据，而 X86 等处理器则是使用了相反的 “Little-Endian” 顺序来存储数据）

JVM规范要求每一个字节码文件都要由十部分按照固定的顺序组成，整体结构如图：<br>![](https://note.youdao.com/yws/res/75242/D4FBE1F924A24B0EBBEC1F43B4D93784#id=Hpmes&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558862228-f894bcc3-3724-4b1f-944b-c012e67faadb.png#averageHue=%23f1efed&clientId=u39dd456b-378d-4&from=paste&id=ue61852ef&originHeight=422&originWidth=820&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u18d7a33a-1504-4a47-a9f4-07912f790df&title=)

### class文件格式数据类型

Class 文件格式采用了一种类似于C语言结构体的伪结构来存储数据，而这种伪结构中有且只有两种数据类型：无符号数和表。

示例源码，下面的都是基于该源码：

```java
//Math.java
package com.example.asm.clazz;

public class Math {
    private int a = 1;
    private int b = 2;

    public int add() {
        return a + b;
    }
}
```

#### 1. 无符号数

无符号数属于基本的数据类型，以 **u1、u2、u4、u8 来分别代表 1 个字节、2 个字节、4 个字节和 8 个字节的无符号数**，无符号数可以用来 **描述数字**、**索引引用**、**数量值**或者按照**UTF-8 码构成字符串值**。

#### 2. 表

表是 **由多个无符号数或者其他表作为数据项构成的复合数据类型**，所有表都习惯性地以 “_info” 结尾。表用于 描述有层次关系的复合结构的数据，而整个 Class 文件其本质上就是一张表。

一个class文件包含以下数据项：

| 描述                                     | 类型                         | 解释                 |
| -------------------------------------- | -------------------------- | ------------------ |
| magic                                  | u4                         | 魔数，固定：0x CAFE BABE |
| minor_version                          | u2                         | java次版本号           |
| major_version                          | u2                         | java主版本号           |
| constant_pool_count                    | u2                         | 常量池大小              |
| constant_pool[1-constant_pool_count-1] | struct cp_info（常量表）        | 字符串池               |
| access_flags                           | u2                         | 访问标志               |
| this_class                             | u2                         | 类索引                |
| super_class                            | u2                         | 父类索引               |
| interfaces_count                       | u2                         | 接口计数器              |
| interfaces                             | u2                         | 接口索引集合             |
| fields_count                           | u2                         | 字段个数               |
| fields                                 | struct field_info（字段表）     | 字段集合               |
| methods_count                          | u2                         | 方法计数器              |
| methods                                | struct method_info（方法表）    | 方法集合               |
| attributes_count                       | u2                         | 属性计数器              |
| attributes                             | struct attribute_info（属性表） | 属性集合               |

1. magic：魔数 4个字节，唯一作用是确定这个文件是否为一个能被虚拟机所接受的 Class 文件
2. minor_version： 2 个字节长，表示当前 Class 文件的次版号
3. major_version：2 个字节长，表示当前 Class 文件的主版本号。
4. constant_pool_count：常量池数组元素个数。
5. constant_pool：常量池，是一个存储了 cp_info 信息的数组
6. access_flags：表示当前类的访问权限，例如：public、private。
7. this_class 和 super_class：存储了指向常量池数组元素的索引，this_class 中索引指向的内容为当前类名，而 super_class 中索引则指向其父类类名
8. interfaces_count 和 interfaces：同上，它们存储的也只是指向常量池数组元素的索引。其内容分别表示当前类实现了多少个接口和对应的接口类类名。
9. fields_count 和 fields：：表示成员变量的数量和其信息，信息由 field_info 结构体表示。
10. methods_count 和 methods：表示成员函数的数量和它们的信息，信息由 method_info 结构体表示。
11. attributes_count 和 attributes：表示当前类的属性信息，每一个属性都有一个与之对应的 attribute_info 结构。

### 1、magic 魔数

每个class文件的头**4个字节**称为魔数（`Magic Number`），类型为u4，它的唯一作用是**用于确定这个文件是否为一个能被虚拟机接受的Class文件**。

> 很多文件存储标准中都使用魔数来进行身份识别， 譬如图片格式，如 gif 或者 jpeg等在文件头中都存有魔数。使用魔数而不是扩展名来进行识别主要是基于安全方面的考虑，因为文件扩展名可以随意地改动。并且，Class 文件的魔数获得很有“浪漫气息”，值为：0xCAFEBABE（咖啡宝贝）。class文件魔数的值为0xCAFEBABE。如果一个文件不是以0xCAFEBABE开头，那它就肯定不是Java class文件。<br>![](https://note.youdao.com/yws/res/73458/E3178319B788466BB476C1F2C0717513#id=M4Zti&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558891600-6eaba2ba-f002-4b64-bf8f-c96dc571d609.png#averageHue=%23393835&clientId=u39dd456b-378d-4&from=paste&id=u4b296b05&originHeight=246&originWidth=1286&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7992aa81-adee-4646-8419-6360b00d027&title=)

### 2、minor_version、major_version  class文件的主次版本号

紧接着魔数的**4个字节**存储的是Class文件的版本号：第5和第6是**次版本号（Minior Version）**，第7个和第8个字节是**主版本号(Major Version)**。Java的版本号是人45开始的，JDK1.1之后的每个JDK大版本发布主版本号向上加1，高版本的JDK能向下兼容以前版本的Class文件，但不能运行以后版本的Class文件，即使文件格式并未发生变化。JDK1.1能支持版本号为45.045.65535的Class文件，JDK1.2则能支持45.046.65535的Class文件。JDK1.7可生成的Class文件主版本号的最大值为51.0。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558898120-9096d433-5597-4d47-a860-243cc17bf5c7.png#averageHue=%23cbd6e4&clientId=u39dd456b-378d-4&from=paste&id=u084ac6ba&originHeight=265&originWidth=604&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5fa897de-0ef1-44ec-92ad-29d8e23bc08&title=)

> 需要注意的是，虚拟机会拒绝执行超过其版本号的 Class 文件。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558907030-6351cf2d-5155-478d-9bb8-691879e1a875.png#averageHue=%233b3a36&clientId=u39dd456b-378d-4&from=paste&id=u2cc9dc27&originHeight=338&originWidth=1048&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5dfcbfa8-3403-424b-9bfe-27f7cdba484&title=)

### 3、constant_pool_count、constant_pool (常量池数量、常量池)

常量池可以理解为 Class 文件之中的资源仓库，其它的几种结构或多或少都会最终指向到这个资源仓库之中。<br>此外，常量池是 Class 文件结构中与其他项 关联最多 的数据类型，也是 占用 Class 文件空间最大的数据项之一，同时它还是 在 Class 文件中第一个出现的表类型数据项。

1. constant_pool_count 常量池数量
2. constant_pool 常量池，从1开始，0做特殊用；存放了对这个类的信息描述，例如类名、字段名、方法名、常量值、字符串等

由于常量池中常量的数量是不固定的，所以在常量池的入口需要放置一项u2类型的数据，代表常量池容量计数值(`constant_pool_count`)。Constant pool是从1开始，它将第0项的常量空出来了。而这个第0项常量它具备着特殊的使命，就是当其他数据项引用第0项常量的时候，就代表着这个数据项不需要任何常量引用的意思。但尽管`constant_pool`列表中没有索引值为0的入口，缺失的这一入口也被`constant_pool_count`计数在内（当`constant_pool`中有14项，`constant_poo_count`的值为15）。

> class文件结构中只有常量池的容量计数是从1开始的，对于其他集合类型，包括接口索引集合、字段表集合、方法表集合等的容量计数都是从0开始的。

- 一个class文件的常量池（通过010Editor查看）<br>![](https://note.youdao.com/yws/res/73504/B5296105904140E993FD55B075C06084#id=ANK59&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558917772-4a5bc2ef-2081-40b6-89aa-4e3ec7974c36.png#averageHue=%23464541&clientId=u39dd456b-378d-4&from=paste&id=ufd254e7e&originHeight=982&originWidth=1616&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uf093ba94-54d5-444e-9eea-6e32c6e57d4&title=)
- Constant pool(javap查看)

```
Constant pool:
   #1 = Methodref          #5.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #4.#21         // com/example/asm/clazz/Math.a:I
   #3 = Fieldref           #4.#22         // com/example/asm/clazz/Math.b:I
   #4 = Class              #23            // com/example/asm/clazz/Math
   #5 = Class              #24            // java/lang/Object
   #6 = Utf8               a
   #7 = Utf8               I
   #8 = Utf8               b
   #9 = Utf8               <init>
  #10 = Utf8               ()V
  #11 = Utf8               Code
  #12 = Utf8               LineNumberTable
  #13 = Utf8               LocalVariableTable
  #14 = Utf8               this
  #15 = Utf8               Lcom/example/asm/clazz/Math;
  #16 = Utf8               add
  #17 = Utf8               ()I
  #18 = Utf8               SourceFile
  #19 = Utf8               Math.java
  #20 = NameAndType        #9:#10         // "<init>":()V
  #21 = NameAndType        #6:#7          // a:I
  #22 = NameAndType        #8:#7          // b:I
  #23 = Utf8               com/example/asm/clazz/Math
  #24 = Utf8               java/lang/Object
```

举个例子，这个是class的十六进制：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558943542-32bfb7cb-fe11-4cf7-bf97-e20702aa93d2.png#averageHue=%233c3a37&clientId=u39dd456b-378d-4&from=paste&id=u88160273&originHeight=71&originWidth=398&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u58ea546b-97bf-4766-9c67-a51b46e70ca&title=)<br>![](https://note.youdao.com/yws/res/71427/90B3C877FF704F9BA49C05FD5803EB89#id=GD6vI&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

第9位代表的是constant_pool_count值为001D，十进制就是29，表示常量池有29-1=28个；第11位为0A代表的是常量tag值，十进制为11，查询上表可知，代表的是`CONSTANT_Methodref`常量类型，下面的几位代表的是`class_index`和`name_and_type_index`。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558949268-3e45337d-b8b9-4891-b521-5ad7bcc89a5b.png#averageHue=%233e3c39&clientId=u39dd456b-378d-4&from=paste&id=u6c72f0db&originHeight=133&originWidth=632&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufd05c3e1-dd5d-41a2-8464-afcc04e928e&title=)<br>如上所述，**虚拟机加载Class文件的时候，就是这样从常量池中得到相对应的数值。**

cp_info（常量表）<br>connstant_pool 中存储了一个一个的 cp_info 信息，并且每一个 cp_info 的第一个字节（即一个 u1 类型的标志位，tag，取值为1至12，缺少标志为2的数据类型）标识了当前常量项的类型，其后才是具体的常量项内容

cp_info主要存放**字面量（Literal）**和**符号引用（Symbolic References）**。

#### 字面量（Literal）

字面量比较接近于 Java 语言层面的常量概念，如文本字符串、声明为 final 的常量值等

#### 符号引用（Symbolic References）

而 符号引用 则属于编译原理方面的概念，包括了 三类常量，如下所示：

1. 类和接口的全限定名（Fully Qualified Name）
2. 字段的名称和描述符（Descriptor)）
3. 方法的名称和描述符

在虚拟机加载 Class 文件的时候会进行动态链接，因为其字段、方法的符号引用不经过运行期转换的话就无法得到真正的内存入口地址，也就无法直接被虚拟机使用。当虚拟机运行时，需要从常量池获得对应的符号引用，再在类创建或运行时进行解析，并翻译到具体的内存地址之中

##### 常量项（tag常量项对应的类型）

tag常量项的类型，它主要包含以下14种类型：

| 类型                               | 标志 | 描述          |
| -------------------------------- | -- | ----------- |
| CONSTANT_utf8_info               | 1  | UTF-8编码的字符串 |
| CONSTANT_Integer_info            | 3  | 整形字面量       |
| CONSTANT_Float_info              | 4  | 浮点型字面量      |
| CONSTANT_Long_info               | 5  | 长整型字面量      |
| CONSTANT_Double_info             | 6  | 双精度浮点型字面量   |
| CONSTANT_Class_info              | 7  | 类或接口的符号引用   |
| CONSTANT_String_info             | 8  | 字符串类型字面量    |
| CONSTANT_Fieldref_info           | 9  | 字段的符号引用     |
| CONSTANT_Methodref_info          | 10 | 类中方法的符号引用   |
| CONSTANT_InterfaceMethodref_info | 11 | 接口中方法的符号引用  |
| CONSTANT_NameAndType_info        | 12 | 字段或方法的符号引用  |
| CONSTANT_MethodHandle_info       | 15 | 表示方法句柄      |
| CONSTANT_MothodType_info         | 16 | 标志方法类型      |
| CONSTANT_InvokeDynamic_info      | 18 | 表示一个动态方法调用点 |

##### 常量项数据结构

其中每个类型的结构又不尽相同，大家可以查看下面这个表格：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558982106-3b1a3216-881f-430d-8882-67bc7a76f419.png#averageHue=%23ededed&clientId=u39dd456b-378d-4&from=paste&id=u4863fff2&originHeight=1000&originWidth=873&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u175f2d0b-be72-4991-8971-82590c85808&title=)<br>![](https://note.youdao.com/yws/res/73551/69905C306B4546A49CCE35EFB6FA6F17#id=vawZC&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

###### CONSTANT_String 和 CONSTANT_Utf8 的区别

1. `CONSTANT_Utf8` 真正存储了字符串的内容，其对应的数据结构中有一个字节数组，字符串便酝酿其中。
2. `CONSTANT_String` 本身不包含字符串的内容，但其具有一个指向 `CONSTANT_Utf8` 常量项的索引。

> 在所有常见的常量项之中，只要是需要表示字符串的地方其实际都会包含有一个指向 CONSTANT_Utf8_info 元素的索引。而一个字符串最大长度即 u2 所能代表的最大值为 65536，但是需要使用 2 个字节来保存 null 值，所以一个字符串的最大长度为 65534

###### 常量项 Utf8

```
CONSTANT_Utf8_info {
    u1 tag; 
    u2 length; 
    u1 bytes[length]; 
}
```

1. tag：值为 1，表示是 CONSTANT_Utf8_info 类型表
2. length：length 表示 bytes 的长度，比如 length = 10，则表示接下来的数据是 10 个连续的 u1 类型数据。
3. bytes：u1 类型数组，保存有真正的常量数据

###### 常量项 Class、Filed、Method、Interface、String

```
// Class
CONSATNT_Class_info {
    u1 tag;
    u2 name_index; 
}
// Field
CONSTANT_Fieldref_info {
    u1 tag;
    u2 class_index;
    u2 name_and_type_index;
}
// Method
CONSTANT_MethodType_info {
    u1 tag;
    u2 descriptor_index;
}
// Interface
CONSTANT_InterfaceMethodref_info {
    u1 tag;
    u2 class_index;
    u2 name_and_type_index;
}
// String
CONSTANT_String_info {
    u1 tag;
    u2 string_index;
}
CONSATNT_NameAndType_info {
    u1 tag;
    u2 name_index;
    u2 descriptor_index
}
```

1. name_index 指向常量池中索引为 name_index 的常量表。比如 name_index = 6，表明它指向常量池中第 6 个常量。
2. class_index：指向当前方法、字段等的所属类的引用。
3. name_and_type_index：指向当前方法、字段等的名字和类型的引用。
4. descriptor_index：指向某字段或方法等的类型字符串的引用。

###### 常量项 Integer、Long、Float、Double

```
CONSATNT_Integer_info {
    u1 tag;
    u4 bytes;
}
CONSTANT_Long_info {
    u1 tag;
    u4 high_bytes;
    u4 low_bytes;
}
CONSTANT_Float_info {
    u1 tag;
    u4 bytes;
}
CONSTANT_Double_info {
    u1 tag;
    u4 high_bytes;
    u4 low_bytes;
}
```

> 在每一个非基本类型的常量项之中，除了其 tag 之外，最终包含的内容都是字符串。正是因为这种互相引用的模式，才能有效地节省 Class 文件的空间。（ps：利用索引来减少空间占用是一种行之有效的方式）

##### 案例分析：一个class二进制

如何查看一个class二进制？以一个案例来分析：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559059827-f8dc95e9-0abb-4634-a2ec-938873bfd844.png#averageHue=%233b3a36&clientId=u39dd456b-378d-4&from=paste&id=u151a0a52&originHeight=570&originWidth=1720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc6b9b09c-c88e-48dc-83a1-8f075627b1b&title=)<br>这是常量池第一个元素，分析其中的元素 (就是Math类的默认构造方法)

1. tag，类型u1，占用一个字节，为十六进制的10（对应十进制15），查看表格得知，这是一个`CONSTANT_Methodref`的结构
2. class_index 声明方法的class的类型描述符`CONSTANT_Class_info`，可以看到为5（对应常量池的索引4）<br>![](https://note.youdao.com/yws/res/73742/4158DC1CB6E64D72A722E3559322CA6D#id=YQd2Q&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559078659-099542f7-1b18-4038-b114-91d8dabfe31d.png#averageHue=%233c3b37&clientId=u39dd456b-378d-4&from=paste&id=ud558acb7&originHeight=128&originWidth=1752&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue5a33b55-ef9a-466e-881c-172da04ef3b&title=)
   - 可以看到常量池索引为4的是一个`CONSTANT_Class_info`类型(tag=7查表可知其为类或接口的符号引用)，name_index为指向全限定名常量索引，指向24 <br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559084204-846fbedc-8e3c-432f-a1c4-e5f50d79c114.png#averageHue=%2340403c&clientId=u39dd456b-378d-4&from=paste&id=u5451f172&originHeight=164&originWidth=1646&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1e3b5e93-9fbe-4f8d-9d7d-db8613ee86b&title=)<br>![](https://note.youdao.com/yws/res/73752/454345FD51DE4AB8BFC006E441379832#id=nLV8l&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) <br>可以看到这是一个tag=即类似为`CONSTANT_Utf8`，length=16，bytes为其存储的数据(`�java/lang/Object`)
   - ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559101843-4e4c5572-1169-48f6-9434-39bcced8fda1.png#averageHue=%232e2d29&clientId=u39dd456b-378d-4&from=paste&id=udba0d769&originHeight=84&originWidth=330&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8df28a5c-f70b-4606-a7c0-b1659a128a1&title=)
3. u2 name_and_type_index 指向名称和类型描述符CONSTANT_NameAndType的索引值, 索引为20

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559139836-a344378e-10d7-4706-9a9d-0a58d83c93b0.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=ufbdc1f7b&originHeight=182&originWidth=1752&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u120ef032-6649-4340-9405-5f3c5540691&title=)

- u2 name_index

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559176179-8ee48d71-f372-4df4-9f06-63618ed16b84.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=ua6e7c9bb&originHeight=158&originWidth=1692&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ubc39467c-a7d2-4c55-b727-a48ef4e686d&title=)

- bytes 为
- u2 descriptor_index

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559204641-b8357372-7aef-4a40-b104-7cd0c9358aa4.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=u2dca5aad&originHeight=158&originWidth=1622&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8932047e-23de-4383-a08a-4279a34f42a&title=)

- bytes 为()V

### 4、access_flags 访问标记class 是否为抽象类、静态类

紧接常量池后的2个字节称为`access_flags`，它展示了文件中定义的类或接口的几段信息。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559286632-04f25718-f6c0-4e3a-8db9-da2187e9581d.png#averageHue=%23c9d1de&clientId=u39dd456b-378d-4&from=paste&id=uc09090a0&originHeight=267&originWidth=552&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufd39b4d2-56ce-488a-8c84-3edda13e9d4&title=)<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559297653-5be5c9b2-5d39-4e7b-a0ec-4659a344e0c0.png#averageHue=%23f0f5f5&clientId=u39dd456b-378d-4&from=paste&id=u43c8a822&originHeight=54&originWidth=1690&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u687240a6-8607-44f6-ae2b-8ae1f672bd3&title=)

#### Class 的 access_flags 取值类型

| 标志名称           | 十六进制标志值 | 含义                  |
| -------------- | ------- | ------------------- |
| ACC_PUBLIC     | 0x0001  | public类型            |
| ACC_FINAL      | 0x0010  | final类型             |
| ACC_SUPER      | 0x0020  | 使用新的invokespecial语义 |
| ACC_INTERFACE  | 0x0200  | 接口类型                |
| ACC_ABSTRACT   | 0x0400  | 抽象类型                |
| ACC_SYNTHETIC  | 0x1000  | 该类不由用户代码生成          |
| ACC_ANNOTATION | 0x2000  | 注解类型                |
| ACC_ENUM       | 0x4000  | 枚举类型                |

#### Field 的 access_flag 取值类型

| 标志名称          | 十六进制标志值 | 含义                  |
| ------------- | ------- | ------------------- |
| ACC_PUBLIC    | 0x0001  | public类型            |
| ACC_PRIVATE   | 0x0002  | private             |
| ACC_PROTECTED | 0x0004  | protected           |
| ACC_STATIC    | 0x0008  | static              |
| ACC_FINAL     | 0x0010  | final类型             |
| ACC_VOLATILE  | 0x0040  | volatile            |
| ACC_TRANSIENT | 0x0080  | transient，不能被序列化    |
| ACC_SYNTHETIC | 0x1000  | 该类不由用户代码生成，由编译器自动生成 |
| ACC_ENUM      | 0x4000  | enum，字段为枚举类型        |

#### Method 的 access_flag 取值

| 标志名称             | 十六进制标志值 | 含义                  |
| ---------------- | ------- | ------------------- |
| ACC_PUBLIC       | 0x0001  | public类型            |
| ACC_PRIVATE      | 0x0002  | private             |
| ACC_PROTECTED    | 0x0004  | protected           |
| ACC_STATIC       | 0x0008  | static              |
| ACC_FINAL        | 0x0010  | final类型             |
| ACC_SYNCHRONIZED | 0x0020  | synchronized        |
| ACC_BRIDGE       | 0x0040  | bridge，方法由编译器产生     |
| ACC_VARARGS      | 0x0080  | 该方法带有变长参数           |
| ACC_NATIVE       | 0x0100  | native              |
| ACC_ABSTRACT     | 0x0400  | abstract            |
| ACC_STRICT       | 0x0800  | strictfp            |
| ACC_SYNTHETIC    | 0x1000  | 该类不由用户代码生成，由编译器自动生成 |

> 当 Method 的 access_flags 的取值为 ACC_SYNTHETIC 时，该 Method 通常被称之为合成函数。此外，当内部类访问外部类的私有成员时，在 Class 文件中也会生成一个 ACC_SYNTHETIC 修饰的函数。

### 5、this_class 当前类的名称

访问标志后面接下来的两个字节是类索引`this_class`，它是一个对常量池的索引。

> 在this_class位置的常量池入口必须为CONSTANT_Class_info表。该表由两个部分组成——tag和name_index。tag部分是代表其的标志位，name_index位置的常量池入口为一个包含了类或接口全限定名的CONSTANT_Utf8_info表。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559323905-fe35dd52-8dd1-404a-98ae-da6521d8f126.png#averageHue=%23ecf1f1&clientId=u39dd456b-378d-4&from=paste&id=u05a3f521&originHeight=50&originWidth=1772&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud55c064f-958f-4a45-bcf3-3aadab02518&title=)<br>指向： <br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559333761-8b5b0c52-edd7-4376-8f31-7fb3f377ec96.png#averageHue=%233c3b37&clientId=u39dd456b-378d-4&from=paste&id=ue69c2da5&originHeight=130&originWidth=1702&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u41d1e5a2-eb0c-4ff6-8d45-c3c87484adf&title=)<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559337995-7f1ab1b4-6b1f-4207-94e5-0d205fdb887a.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=u2c489d0b&originHeight=170&originWidth=1776&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u352a9c88-c3f3-455c-b6cb-d033be09a40&title=)<br>其中bytes的值为`�com/example/asm/clazz/Math`

### 6、super_class 父类的名称

在class文件中，紧接在this_class之后是`super_class`项，它是一个两个字节的常量池索引。

> 在super_class位置的常量池入口是一个指向该类超类全限定名的CONSTANT_Class_info入口。因为Java程序中所有对象的基类都是java.lang.Object类，除了Object类以外，常量池索引super_class对于所有的类均有效。对于Object类，super_class的值为0。对于接口，在常量池入口super_class位置的项为java.lang.Object

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559429831-df623641-95f3-4d6a-8017-3e5aa246d6ec.png#averageHue=%23b1d3f8&clientId=u39dd456b-378d-4&from=paste&id=u172f32b5&originHeight=40&originWidth=1642&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u83438e4a-de1c-41cc-9458-9d9c41a1d9b&title=)

### 7、interfaces_count和interfaces 该类的所有接口（只计算直接父接口）

紧接着super_class的是`interfaces_count`，此项的含义为：在文件中出该类直接实现或者由接口所扩展的父接口的数量。<br>在这个计数的后面，是名为interfaces的数组，它包含了对每个由该类或者接口直接实现的父接口的常量池索引。

> 每个父接口都使用一个常量池中的CONSTANT_Class_info入口来描述，该CONSTANT_Class_info入口指向接口的全限定名。这个数组只容纳那些直接出现在类声明的implements子句或者接口声明的extends子句中的父接口。超类按照在implements子句和extends子句中出现的顺序在这个数组中显现。

### 8、fields_count和fields 该类的所有字段

在class文件中，紧接在interfaces后面的是对在该类或者接口中所声明的**字段**的描述。

只有在文件中由类或者接口声明了的字段才能在fields列表中列出。在fields列表中，**不列出从超类或者父接口继承而来的字段**。另一方面，fields列表可能会包含在对应的Java源文件中没有叙述的字段，这是因为Java编译器可以会在编译时向类或者接口添加字段。

- fields_count的计数，它是类变量和实例变量的字段的数量总和。
- field_info表的序列(fields_count指出了序列中有多少个field_info表)。

#### field_info

字段表（field_info）用于描述接口或者类中声明的变量。字段（field）包括类级变量以及实例级变量，但`不包括在方法内部声明的局部变量`。<br>field_info数据结构：

```
field_info {
    u2              access_flags;
    u2              name
    u2              descriptor_index
    u2              attributes_count
    attribute_info  attributes[attributes_count]
}
```

1. access_flags 访问标志
2. name 名字引用
3. descriptor_index 描述信息引用
4. attributes_count 属性数量
5. attributes attribute_info数组

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559496671-ce87327e-2ce0-49c6-bbe8-7343906f8536.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=u34b4d2b6&originHeight=452&originWidth=1596&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufccb8172-5d8d-416f-90b4-ee8dc7a34d7&title=)<br>我们看第0个field：

- name_index (bytes为a)<br>![](https://note.youdao.com/yws/res/74129/B32A53261DBC41EBA9E6AA5C5E5FEF66#id=Xd937&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559521070-52fc96ae-6ecb-4b19-b95a-a9549a2c1532.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=uf1ee6648&originHeight=212&originWidth=1616&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u195b885d-7865-44a6-a4b0-546510398c9&title=)
- descriptor_index (bytes为I)<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559525197-244dca72-ff1c-4190-bb78-f1cc3920ec98.png#averageHue=%233d3c38&clientId=u39dd456b-378d-4&from=paste&id=ua89aa734&originHeight=166&originWidth=1654&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uffd81698-361b-4db8-9924-37a2ea80d43&title=)

### 9、method_count和methods 该类的所有方法

紧接着field后面的是对在该类或者接口中所声明的方法的描述。其结构与fields一样，不一样的是访问标志。

```
method_info {
    u2              access_flags;
    u2              name
    u2              descriptor_index
    u2              attributes_count
    attribute_info  attributes[attributes_count]
}
```

1. access_flags 访问标志
2. name 名字引用
3. descriptor_index 描述信息引用
4. attributes_count 属性数量
5. attributes attribute_info数组

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559540045-1add16ff-2a18-4292-baee-eedd94029a0a.png#averageHue=%2341413d&clientId=u39dd456b-378d-4&from=paste&id=uabdb3d96&originHeight=328&originWidth=1632&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u27387378-b0c4-4cc0-8b75-3c31d2adc3c&title=)

> 类构造器为 `< clinit >`方法，而实例构造器为 `< init >` 方法；类构造器指的是class对象的构造器虚拟机调用；实例指的我们平时调用的构造器

### 10、attributes_count和该类的所有属性（例如源文件名称，等等）

class文件中最后的部分是属性，它给出了在该文件类或者接口所定义的属性的基本信息。属性部分由attributes_count开始，attributes_count是指出现在后续attributes列表的attribute_info表的数量总和。每个attribute_info的第一项是指向常量池中CONSTANT_Utf8_info表的引引，该表给出了属性的名称。<br>属性有许多种。Java虚拟机规范定义了几种属性，但任何人都可以创建他们自己的属性种类，并且把它们置于class文件中，Java虚拟机实现必须忽略任何不能识别的属性。<br>Java虚拟机预设的9项虚拟机应当能识别的属性如下表所示。<br>![](https://note.youdao.com/yws/res/71457/0BC8E508740E41CE88F44E7EE5CABFF7#id=BZLdS&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693559552448-ca682e4c-9f9f-4d89-996f-3d9c15fe418c.png#averageHue=%23c9dde2&clientId=u39dd456b-378d-4&from=paste&id=u370d2e2d&originHeight=434&originWidth=528&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uac77303c-6ae5-4154-8031-0cba1365d3c&title=)<br>attribute_info attributes数据结构

```
attribute_info {  
    u2 attribute_name_index;
    u4 attribute_length;
    u1 info[attribute_length];
}
```

1. attribute_name_index 为 CONSTANT_Utf8 类型常量项的索引，表示属性的名称。
2. attribute_length：属性的长度
3. info：属性具体的内容

#### attribute_name_index

attribute_name_index 所指向的 Utf8 字符串即为属性的名称，而 属性的名称是被用来区分属性的。所有的属性名称如下所示（其中下面👇 加*的为重要属性）：

```
1）、*ConstantValue：仅出现在 filed_info 中，描述常量成员域的值，通知虚拟机自动为静态变量赋值。对于非 static 类型的变量（也就是实例变量）的赋值是在实例构造器方法中进行的;而对 于类变量，则有两种方式可以选择：在类构造器方法中或者使用 ConstantValue 属性。如果变量没有被 final 修饰，或者并非基本类型及字 符串，则将会选择在方法中进行初始化。
2）、*Code：仅出现 method_info 中，描述函数内容，即该函数内容编译后得到的虚拟机指令，try/catch 语句对应的异常处理表等等。
3）、*StackMapTable：在 JDK 1.6 发布后增加到了 Class 文件规范中，它是一个复杂的变长属性。这个属性会在虚拟机类加载的字节码验证阶段被新类型检查验证器（Type Checker）使用，目的在于代替以前比较消耗性能的基于数据流 分析的类型推导验证器。它省略了在运行期通过数据流分析去确认字节码的行为逻辑合法性的步骤，而是在编译阶 段将一系列的验证类型（Verification Types）直接记录在 Class 文件之中，通过检查这些验证类型代替了类型推导过程，从而大幅提升了字节码验证的性能。这个验证器在 JDK 1.6 中首次提供，并在 JDK 1.7 中强制代替原本基于类型推断的字节码验证器。StackMapTable 属性中包含零至多个栈映射帧（Stack Map Frames），其中的类型检查验证器会通过检查目标方法的局部变量和操作数栈所需要的类型来确定一段字节码指令是否符合逻辑约束。
4）、*Exceptions：当函数抛出异常或错误时，method_info 将会保存此属性。
5）、InnerClasses：用于记录内部类与宿主类之间的关联。
6）、EnclosingMethod
7）、Synthetic：标识方法或字段为编译器自动生成的。
8）、*Signature：JDK 1.5 中新增的属性，用于支持泛型情况下的方法签名，由于 Java 的泛型采用擦除法实现，在为了避免类型信息被擦除后导致签名混乱，需要这个属性记录泛型中的相关信息。
9）、*SourceFile：包含一个指向 Utf8 常量项的索引，即 Class 对应的源码文件名。
10）、SourceDebugExtension：用于存储额外的调试信息。
11）、*LineNumberTable：Java 源码的行号与字节码指令的对应关系。
12）、*LocalVariableTable：局部变量数组/本地变量表，用于保存变量名，变量定义所在行。
13）、*LocalVariableTypeTable：JDK 1.5 中新增的属性，它使用特征签名代替描述符，是为了引入泛型语法之后能描述泛型参数化类型而添加。
14）、Deprecated
15）、RuntimeVisibleAnnotations
16）、RuntimeInvisibleAnnotations
17）、RuntimeVisibleParameterAnnotations
18）、RuntimeInvisibleParameterAnnotations
19）、AnnotationDefault
20）、BootstrapMethods：JDK 1.7中新增的属性，用于保存 invokedynamic 指令引用的引导方法限定符。切记，类文件的属性表中最多也只能有一个 BootstrapMethods 属性。
```

#### Code_attribute

要注意 并非所有的方法表都必须存在这个属性，例如接口或者抽象类中的方法就不存在 Code 属性。

Code_attribute 的数据结构：

```
Code_attribute {  
    u2 attribute_name_index; 
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length; 
    { 
        u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

Code_attribute 中的各个元素的含义如下所示：

```
attribute_name_index、attribute_length：attribute_length 的值为整个 Code 属性减去 attribute_name_index 和 attribute_length 的长度。
max_stack：为当前方法执行时的最大栈深度，所以 JVM 在执行方法时，线程栈的栈帧（操作数栈，operand satck）大小是可以提前知道的。每一个函数执行的时候都会分配一个操作数栈和局部变量数组，而 Code_attribure 需要包含它们，以便 JVM 在执行函数前就可以分配相应的空间。
max_locals：**为当前方法分配的局部变量个数，包括调用方式时传递的参数。long 和 double 类型计数为 2，其他为 1。max_locals 的单位是 Slot,Slot 是虚拟机为局部变量分配内存所使用的最小单位。局部变量表中的 Slot 可以重用，当代码执行超出一个局部变量的作用域时，这个局部变量 所占的 Slot 可以被其他局部变量所使用，Javac 编译器会根据变量的作用域来分配 Slot 给各个 变量使用，然后计算出 max_locals 的大小**。

code_length：为方法编译后的字节码的长度。
code：用于存储字节码指令的一系列字节流。既然叫字节码指令，那么每个指令就是一个 u1 类型的单字节。一个 u1 数据类型的取值范围为 0x000xFF，对应十进制的 0255，也就是一共可以表达 256 条指令。
exception_table_length：表示 exception_table 的长度。
exception_table：每个成员为一个 ExceptionHandler，并且一个函数可以包含多个 try/catch 语句，一个 try/catch 语句对应 exception_table 数组中的一项。
start_pc、end_pc：为异常处理字节码在 code[] 的索引值。当程序计数器在 [start_pc, end_pc) 内时，表示异常会被该 ExceptionHandler 捕获。
handler_pc：表示 ExceptionHandler 的起点，为 code[] 的索引值。
catch_type：为 CONSTANT_Class 类型常量项的索引，表示处理的异常类型。如果该值为 0，则该 ExceptionHandler 会在所有异常抛出时会被执行，可以用来实现 finally 代码。当 catch_type 的值为 0 时，代表任意异常情况都需要转向到 handler_pc 处进行处理。此外，编译器使用异常表而不是简单的跳转命令来实现 Java 异常及 finally 处理机制。
attributes_count 和 attributes：表示该 exception_table 拥有的 attribute 数量与数据。
```

在 Code_attribute 携带的属性中，"LineNumberTable" 与 "LocalVariableTable" 对我们 Android 开发者来说比较重要

##### LineNumberTable 属性

LineNumberTable 属性 用于 Java 的调试，可指明某条指令对应于源码哪一行。LineNumberTable 属性的结构如下所示：

```
LineNumberTable_attribute {  
    u2 attribute_name_index;
    u4 attribute_length;
    u2 line_number_table_length;
    {   u2 start_pc;
        u2 line_number;    
    } line_number_table[line_number_table_length];
}
```

其中最重要的是 `line_number_table` 数组，该数组元素包含如下 两个成员变量：

- start_pc：为 code[] 数组元素的索引，用于指向 Code_attribute 中 code 数组某处指令。
- line_number：为 start_pc 对应源文件代码的行号。需要注意的是，多个 line_number_table 元素可以指向同一行代码，因为一行 Java 代码很可能被编译成多条指令。

##### LocalVariableTable 属性

LocalVariableTable 属性用于 描述栈帧中局部变量表中的变量与 Java 源码中定义的变量之间的关系，它也不是运行时必需的属性，但默认会生成到 Class 文件之中。<br>LocalVariableTable 的数据结构:

```
LocalVariableTable_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 local_variable_table_length;
    {
        u2 start_pc;
        u2 length;
        u2 name_index;
        u2 descriptor_index;
        u2 index;
    } local_variable_table[local_variable_table_length];
}
```

其中最重要的元素是 local_variable_table 数组，其中的 start_pc 与 length 这两个参数 决定了一个局部变量在 code 数组中的有效范围。

> 每个非 static 函数都会自动创建一个叫做 this 的本地变量，代表当前是在哪个对象上调用此函数。并且，this 对象是位于局部变量数组第1个位置（即 Slot = 0），它的作用范围是贯穿整个函数的。

在 JDK 1.5 引入泛型之后，LocalVariableTable 属性增加了一个 “姐妹属性”: LocalVariableTypeTable，这个新增的属性结构与 LocalVariableTable 非常相似，仅仅是把记录 的字段描述符的 descriptor_index 替换成了字段的特征签名（Signature），对于非泛型类型来 说，描述符和特征签名能描述的信息是基本一致的，但是泛型引入之后，由于描述符中泛型的参数化类型被擦除掉，描述符就不能准确地描述泛型类型了，因此出现了 LocalVariableTypeTable。

### 信息描述规则

对于 JVM 来说，其采用了字符串的形式来描述**数据类型**、**成员变量**及**成员函数**这三类，我们需要了解下 JVM 中的信息描述规则。<br>描述符的作用是用来描述**字段的数据类型**、**方法的参数列表**（包括数量、类型以及顺序）和**返回值**

#### 数据类型

数据类型通常包含有 **原始数据类型**、**引用类型（数组）**，它们的描述规则分别如下所示：

##### 原始数据类型

| 标志符 | 含义                      |
| --- | ----------------------- |
| B   | 基本数据类型byte              |
| C   | 基本数据类型char              |
| D   | 基本数据类型double            |
| F   | 基本数据类型float             |
| I   | 基本数据类型int               |
| J   | 基本数据类型long              |
| S   | 基本数据类型short             |
| Z   | 基本数据类型boolean           |
| V   | 基本数据类型void              |
| L   | 对象类型,如Ljava/lang/Object |

##### 引用数据类型

```
L + 全路径类名（其中的 "." 替换为 "/"，最后加分号）
```

> 例如 String => `Ljava/lang/String;`

##### 数组（引用类型）

```
[该类型对应的描述名
```

> 例如 int 数组 => "[I"，String 数组 => "[Ljava/lang/Sting;"，二维 int 数组 => "[[I"。

#### 成员变量

在 JVM 规范之中，成员变量即 `Field Descriptor` 的描述规则如下所示：

```
FiledDescriptor成员变量描述：FieldType
# 1、仅包含 FieldType 一种信息

    FiledType：BaseType | ObjectType | ArrayType
    # 2、FiledType 的可选类型

        BaseType：B | C | D | F | I | J | S | Z

        ObjectType：L + 全路径ClassName；

        ArrayType：[ComponentType：
            # 3、与 FiledType 的可选类型一样
            ComponentType：FiledType
```

> 在注释1处，FiledDescriptor 仅仅包含了 FieldType 一种信息；注释2处，可以看到，FiledType 的可选类型为3中：BaseType、ObjectType、ArrayType，对于每一个类型的规则描述，我们在 数据类型 这一小节已详细分析过了。而在注释3处，这里 ComponentType 是一种 JVM 规范中新定义的类型，不过它是 由 FiledType 构成，其可选类型也包含 BaseType、ObjectType、ArrayType 这三种。此外，对于字节码来讲，如果两个字段的描述符不一致， 那字段重名就是合法的。

#### 成员函数描述规则

在 JVM 规范之中，成员函数即 Method Descriptor 的描述规则如下所示：

```
MethodDescriptor方法描述: ( ParameterDescriptor* ) ReturnDescriptor
# 1、括号内的是参数的数据类型描述，* 表示有 0 至多个 ParameterDescriptor，最后是返回值类型描述
    ParameterDescriptor:
    FieldType
    
    ReturnDescriptor:
    FieldType | VoidDescriptor
        VoidDescriptor:
        // 2、void 的描述规则为 "V"
        V
```

MethodDescriptor 由两个部分组成，括号内的是参数的数据类型描述，表示有 0 至多个ParameterDescriptor，最后是返回值类型描述<br>案例1：void hello(String str)

```
(Ljava/lang/String;)V
```

案例2：public void add(int a, int b)

```
(II)V
```

案例3：public String getContent(int type)

```
(I)Ljava/lang/Object
```

## Reference

- [x] 字节码增强技术探索 <https://tech.meituan.com/2019/09/05/java-bytecode-enhancement.html>

> 美团，介绍的很好，用图表示

-  [ ] 谈谈Java虚拟机——Class文件结构<br><http://www.cnblogs.com/xiaoruoen/archive/2011/11/30/2267309.html>
-  [ ] The class File Format<br><http://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.2>
-  [ ] Java Class 文件格式及其简单 Hack<br><http://www.stay-stupid.com/?p=401>
-  [x] <https://juejin.cn/post/6844904116603486222>
