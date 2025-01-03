---
date created: 2024-12-27 23:43
date updated: 2024-12-27 23:43
dg-publish: true
tags:
  - '#35'
---

# JVM指令

## 指令简介

计算机指令就是指挥机器工作的指示和命令，程序就是一系列按一定顺序排列的指令，执行程序的过程就是计算机的工作过程。<br>通常一条指令包括两方面的内容：**操作码**和**操作数**，操作码决定要完成的操作，操作数指参加运算的数据及其所在的单元地址。

### JVM指令简介

Java 虚拟机的指令由一个字节长度的、代表着某种特定操作含义的数字（称为操作码，Opcode）以及跟随其后的零至多个代表此操作所需参数（称为操作数，Operands）而构成。

> 大多数的指令都不包含操作数，只有一个操作码。

1. JVM 指令码

用于指示 JVM 执行的动作，例如加操作/减操作/new 对象。其长度为 1 个字节，所以 JVM 指令码的个数不会超过255个（0xFF）。
2.  JVM 指令码后的零至多个操作数

操作数可以存储在 code 数组中，也可以存储在操作数栈（Operand stack）中。

#### 栈帧

JVM 是基于栈而非寄存器的计算模型，基于栈的实现能够带来很好的跨平台特性，因为寄存器指令往往和硬件挂钩。

栈帧（Stack Frame）是用于支持虚拟机进行方法调用和方法执行的数据结构，它是虚拟 机运行时数据区中的虚拟机栈（Virtual Machine Stack）的栈元素。

栈帧中存储了方法的 **局部变量表**、**操作数栈**、**动态连接**和**方法返回地址**、**帧数据区** 等信息。每一个方法从调用开始至执行完成的过程，都对应着一个栈帧在虚拟机栈里面从入栈到出栈的过程。

一个线程中的方法调用链可能会很长，很多方法都同时处于执行状态。<br>对于 JVM 的执行引擎来 说，在活动线程中，只有位于栈顶的栈帧才是有效的，称为**当前栈帧（Current Stack Frame）**，与这个栈帧相关联的方法称为当前方法（Current Method）。执行引擎运行的所有 字节码指令都只针对当前栈帧进行操作。栈帧的结构 如下图所示：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584043668-9db37306-0e32-4914-8908-6a84ce880d23.png#averageHue=%2385dfc7&clientId=uc57a83a2-02b4-4&from=paste&id=ue7b088ca&originHeight=703&originWidth=826&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u773b795a-95fc-4b1d-b467-1b1f0d112dc&title=)

**通常来说，程序需要将局部变量区的元素加载到操作数栈中，计算完成之后，然后再存储回局部变量区。**

##### 操作数栈

操作数栈是为了存放计算的操作数和返回结果。在执行每一条指令前，JVM要求该指令的操作数已经被压入到操作数栈中，并且，在执行指令时，JVM 会将指令所需的操作数弹出，并将计算结果压入操作数栈中。

对于操作数栈相关的操作指令有如下 三类：

###### 直接作用于操作数据栈的指令

1. dup：复制栈顶元素，常用于复制 new 指令所生成的未初始化的引用
2. pop：舍弃栈顶元素，常用于舍弃调用指令的返回结果。
3. wap：交换栈顶的两个元素的值。

> 需要注意的是，当值为 long 或 double 类型时，需要占用两个栈单元，此时需要使用 dup2/pop2 指令替代 dup/pop 指令。

###### 直接将常量加载到操作数栈的指令

对于 int（boolean、byte、char、short） 类型来说，有如下三类常用指令：

1. iconst：用于加载 [-1 ,5] 的 int 值。
2. biconst：用于加载一个字节（byte）所能代表的 int 值即 [-128-127]。
3. sipush：用于加载两个字节（short）所能代表的 int 值即 [-32768-32767]。

> 而对于 long、float、double、reference 类型来说，各个类型都仅有一类，其实就是类似于 iconst 指令，即 lconst、fconst、dconst、aconst。

###### 加载常量池中的常量值的指令

1. ldc：用于加载常量池中的常量值，如 int、long、float、double、String、Class 类型的常量。例如 ldc #35 将加载常量池中的第 35 项常量值。

> 正常情况下，操作数栈的压入弹出都是一条条指令完成。唯一的例外是在抛异常时，JVM 会清除操作数栈的所有内容，然后将异常实例压入操作数栈中。

##### 局部变量表

局部变量区一般用来 **缓存计算的结果**。实际上，JVM 会把局部变量区当成一个 数组，里面会依次缓存 this指针（非静态方法）、参数、局部变量。

需要注意的是，同操作数栈一样，long 和 double 类型的值将占据两个单元，而其它的类型仅仅占据一个单元。

而对于局部变量区来说，它常用的操作指令有 三种

###### 将局部变量区的值加载到操作数栈中

1. int（boolean、byte、char、short）：iload
2. long：lload
3. float：fload
4. double：dload
5. reference：aload

###### 将操作数栈中的计算结果存储在局部变量区中

1. int（boolean、byte、char、short）：istore
2. long：lstore
3. float：fstore
4. double：dstore
5. reference：astore

> 这里需要注意的是，局部变量的加载与存储指令都需要指明所加载单元的下标，例如：iload_0 就是加载普通方法局部变量区中的 this 指针。

###### 增值指令之 iinc

上面两种类型的指令操作都需要操作局部变量区和操作数栈，那么，有没有 **仅仅只作用在局部变量区的指令**呢？

它就是`iinc M N（M为负整数，N为整数）`，它会将局部变量数组中的第 M 个单元中的 int 值增加 N，常用于 for 循环中自增量的更新，如 i++/i--。

## JVM指令

### 基本类型

对于基本类型  指令在设计的时候都用一个字母缩写来指代(boolean除外)

| byte | short | int | long | float | double | char | reference | boolean |
| ---- | ----- | --- | ---- | ----- | ------ | ---- | --------- | ------- |
| b    | s     | i   | l    | f     | d      | c    | a         | 无       |

### 加载存储指令 load/store/const

加载和存储指令用于 **将数据在栈帧中的**`局部变量表`**和**`操作数栈`**之间来回传输**。

#### 将一个`局部变量`加载到`操作数栈`

`iload`、`iload_<N>`、`lload`、`lload_<N>`、`fload`、`fload_<N>`<br>、`dload`、`dload_<N>`、`aload`、`aload_<N>`

| 指令          | 作用                          |
| ----------- | --------------------------- |
| iload       | 将指定的int型本地变量推送至栈顶           |
| lload       | 将指定的long型本地变量推送至栈顶          |
| fload       | 将指定的float型本地变量推送至栈顶         |
| dload       | 将指定的double型本地变量推送至栈顶        |
| iload_[0-3] | 将第0-3个int型本地变量推送至栈顶         |
| lload_[0-3] | 将第0-3个long型本地变量推送至栈顶        |
| fload_[0-3] | 将第0-3个float型本地变量推送至栈顶       |
| dload_[0-3] | 将第0-3个double型本地变量推送至栈顶      |
| aload_[0-3] | 将第0-3个引用类型本地变量推送至栈顶         |
| iaload      | 将int型数组指定索引的值推送至栈顶          |
| laload      | 将long型数组指定索引的值推送至栈顶         |
| faload      | 将float型数组指定索引的值推送至栈顶        |
| daload      | 将double型数组指定索引的值推送至栈顶       |
| aaload      | 将引用型数组指定索引的值推送至栈顶           |
| baload      | 将boolean或byte型数组指定索引的值推送至栈顶 |
| caload      | 将char型数组指定索引的值推送至栈顶         |
| saload      | 将short型数组指定索引的值推送至栈顶        |

#### 将一个数值从`操作数栈`存储到`局部变量表`

`istore`、`istore_<N>`、`lstore`、`lstore_<N>`、<br>`fstore`、`fstore_<N>`、`dstore`、`dstore_<N>`、`astore`、`astore_<N>`

| 指令           | 作用                              |
| ------------ | ------------------------------- |
| istore       | 将栈顶int型数值存入指定本地变量               |
| lstore       | 将栈顶long型数值存入指定本地变量              |
| fstore       | 将栈顶float型数值存入指定本地变量             |
| dstore       | 将栈顶double型数值存入指定本地变量            |
| astore       | 将栈顶引用型数值存入指定本地变量                |
| istore_[0-3] | 将栈顶int型数值存入第[0-3]个本地变量          |
| lstore_[0-3] | 将栈顶long型数值存入第[0-3]个本地变量         |
| fstore_[0-3] | 将栈顶float型数值存入第[0-3]个本地变量        |
| dstore_[0-3] | 将栈顶double型数值存入第[0-3]个本地变量       |
| astore_[0-3] | 将栈顶引用类型数值存入第[0-3]个本地变量          |
| iastore      | 将栈顶int型数值存入指定数组的指定索引位置          |
| lastore      | 将栈顶long型数值存入指定数组的指定索引位置         |
| fastore      | 将栈顶float型数值存入指定数组的指定索引位置        |
| dastore      | 将栈顶double型数值存入指定数组的指定索引位置       |
| aastore      | 将栈顶引用型数值存入指定数组的指定索引位置           |
| bastore      | 将栈顶boolean或byte型数值存入指定数组的指定索引位置 |
| castore      | 将栈顶char型数值存入指定数组的指定索引位置         |
| sastore      | 将栈顶short型数值存入指定数组的指定索引位置        |

#### 将一个常量加载到`操作数栈`

`bipush`、`sipush`、`ldc`、`ldc_w`、`ldc2_w`、`aconst_null`、<br>`iconst_m1`、`iconst_<N>`、`lconst_<N>`、`fconst_<N>`、`dconst_<N>`

| 指令              | 作用                                    |
| --------------- | ------------------------------------- |
| aconst_null     | 将null推送至操作数栈顶(下面统一为栈)                 |
| iconst_m1       | 将int型-1推送至栈顶                          |
| iconst/iconst_0 | 将int型0推送至栈顶                           |
| iconst_1        | 将int型1推送至栈顶                           |
| iconst_2        | 将int型2推送至栈顶                           |
| iconst_3        | 将int型3推送至栈顶                           |
| iconst_4        | 将int型4推送至栈顶                           |
| iconst_5        | 将int型5推送至栈顶                           |
| lconst_0        | 将long型0推送至栈顶                          |
| lconst_1        | 将long型1推送至栈顶                          |
| fconst_0        | 将float型0推送至栈顶                         |
| fconst_1        | 将float型1推送至栈顶                         |
| fconst_2        | 将float型2推送至栈顶                         |
| dconst_0        | 将double型0推送至栈顶                        |
| dconst_1        | 将double型1推送至栈顶                        |
| bipush          | 将单字节的常量值(-128~127)推送至栈顶               |
| sipush          | 将一个短整型常量值(-32768~32767)推送至栈顶          |
| ldc             | 将int, float或String型常量值从常量池中推送至栈顶      |
| ldc_w           | 将int, float或String型常量值从常量池中推送至栈顶（宽索引） |
| ldc2_w          | 将long或double型常量值从常量池中推送至栈顶（宽索引）       |

#### 扩充局部变量表的访问索引的指令

`wide`

> 类似于 iload_，它代表了 iload_0、iload_1、iload_2 和 iload_3这几条指令。这几组指令都是某个带有一个操作数的通用指令（例如iload，iload_0 的语义与操作数为0时的iload指令语义完全一致）

### 算术指令/运算指令

运算或算术指令用于 **对两个操作数栈上的值进行某种特定运算，并把结果重新存入到**`操作数栈顶`。

大体上算术指令可以分为 两种：对整型数据进行运算的指令和对浮点型数据进行运算的指令。

#### 1. 加法指令

`iadd`、`ladd`、`fadd`、`dadd`

#### 2. 减法指令

isub、lsub、fsub、dsub

#### 3. 乘法指令

imul、lmul、fmul、dmul

#### 4. 除法指令

idiv、ldiv、fdiv、ddiv

#### 5. 求余指令

irem、lrem、frem、drem

#### 6. 取反指令

ineg、lneg、fneg、dneg

#### 7. 位移指令

ishl、ishr、iushr、lshl、lshr、lushr

#### 8. 按位或指令

ior、lor

#### 9. 按位与指令

iand、land

#### 10. 按位异或指令

ixor、lxor

#### 11. 局部变量自增指令

iinc

#### 12. 比较指令

dcmpg、dcmpl、fcmpg、fcmpl、lcmp

### 类型转换指令

类型转换指令可以 **将两种不同的数值类型进行相互转换**。

> 例如我们可以将小范围类型向大范围类型的安全转换

i2b、i2c、i2s

l2i

f2i、f2l

d2i、d2l、d2f

### 对象创建与访问指令

#### 1. 创建类实例的指令

new

#### 2. 创建数组的指令

newarray、anewarray、multianewarray

#### 3. 访问类字段（static字段，或者称为类变量）和实例字段（非 static 字段，或者称为实例变量）的指令

getfield、putfield、getstatic、putstatic

#### 4. 把一个数组元素加载到操作数栈的指令

baload、caload、saload、iaload、laload、faload、daload、aaload

#### 5. 将一个操作数栈的值存储到数组元素中的指令

bastore、castore、sastore、iastore、 fastore、dastore、aastore

#### 6. 取数组长度的指令

arraylength

#### 7. 检查类实例类型的指令

instanceof、checkcast

### 操作数栈管理指令

用于 **直接操作操作数栈** 的指令

#### 1. 将操作数栈的栈顶一个或两个元素出栈

`pop`、`pop2`（用于操作 Long、Double）

#### 2. 复制栈顶一个或两个数值并将复制值或双份的复制值重新压入栈顶

`dup`、`dup2`、`dup_x1`、`dup2_x1`、`dup_x2`、`dup2_x2`

#### 3. 将栈最顶端的两个数值互换

`swap`

| 指令      | 作用                                       |
| ------- | ---------------------------------------- |
| pop     | 将栈顶数值弹出 (数值不能是long或double类型的)            |
| pop2    | 将栈顶的一个（long或double类型的)或两个数值弹出（其它）        |
| dup     | 复制栈顶数值并将复制值压入栈顶                          |
| dup_x1  | 复制栈顶数值并将两个复制值压入栈顶                        |
| dup_x2  | 复制栈顶数值并将三个（或两个）复制值压入栈顶                   |
| dup2    | 复制栈顶一个（long或double类型的)或两个（其它）数值并将复制值压入栈顶 |
| dup2_x1 | <待补充>                                    |
| dup2_x2 | <待补充>                                    |
| swap    | 将栈最顶端的两个数值互换(数值不能是long或double类型的)        |

### 控制转移指令

控制转移指令就是 **在有条件或无条件地修改PC寄存器的值**。

#### 1. 条件分支

`ifeq`、`iflt`、`ifle`、`ifne`、`ifgt`、`ifge`、`ifnull`、`ifnonnull`、`if_icmpeq`、`if_icmpne`、 `if_icmplt`、`if_icmpgt`、`if_icmple`、`if_icmpge`、`if_acmpeq` 和 `if_acmpne`

#### 2. 复合条件分支

1. `tableswitch` 条件跳转指令，针对密集的 case
2. `lookupswitch` 条件跳转指令，针对稀疏的 case

#### 3. 无条件分支

`goto`、`goto_w`、`jsr`、`jsr_w`、`ret`

> Java 虚拟机提供的 int 类型的条件分支指令是最为丰富和强大的

### 方法调用指令

#### 1. invokevirtual

用于调用对象的实例方法，根据对象的实际类型进行分派（虚方法分派），这也是 Java 语言中最常见的方法分派方式

#### 2. invokeinterface

用于调用接口方法，它会在运行时搜索一个实现了这个接口方法的对象，找出适合的方法进行调用

#### 3. invokespecial

用于调用一些需要特殊处理的实例方法，包括实例初始化方法、私有方法和父类方法。

invokespecial 指令，它用于 调用构造器与方法，当调用方法时，会将返回值仍然压入操作数栈中，如果当前方法没有返回值则需要使用 pop 指令弹出

#### 4. invokestatic

用于调用类方法（static方法）

#### 5. invokedynamic

用于在运行时动态解析出调用点限定符所引用的方法，并执行该方法，前面 4 条调用指令的分派逻辑都固化在 Java 虚拟机内部，而 invokedynamic 指令的分派逻辑是由用户所设定的引导方法决定的。

### 方法返回指令

返回指令是区分类型的，如下所示，为不同返回类型对应的返回指令：

1. void：return
2. int（boolean、byte、char、short）：ireturn
3. long：lreturn
4. float：freturn
5. double：dreturn
6. reference：areturn

方法调用指令与数据类型无关，而 **方法返回指令是根据返回值的类型区分的**，包括 ireturn（当返回值是boolean、byte、char、short 和 int 类型时使用）、lreturn、freturn、dreturn 和 areturn，另外还有一条 return 指令供声明为 void 的方法、实例初始化方法以及类和接口的类初始化方法使用

### 异常处理指令

在 Java 程序中显式抛出异常的操作（throw语句）都由 `athrow` 指令来实现，在Java虚拟机中，处理异常是采用异常表来完成的。

### 同步指令

Java 虚拟机可以 支持方法级的同步和方法内部一段指令序列的同步，这两种同步结构都是使用**管程（Monitor）**来支持的

#### 同步方法

方法级的同步是隐式的，即无须通过字节码指令来控制，它实现在方法调用和返回操作之中。虚拟机可以从方法常量池的方法表结构中的`ACC_SYNCHRONIZED`访问标志得知一个方法是否声明为同步方法。

当方法调用时，调用指令将会检查方法的ACC_SYNCHRONIZED访问标志是否被设置，如果设置了，执行线程就要求先成功持有管程，然后才能执行方法，最后当方法完成（无论是正常完成还是非正常完成）时会释放管程。

#### 同步代码块

同步一段指令集序列 通常是由 Java 语言中的 `synchronized` 语句块 来表示的，Java 虚拟机的指令集中有`monitorenter` 和 `monitorexit` 两条指令来支持 synchronized 关键字的语义，而正确实现 synchronized 关键字需要 Javac 编译器与 Java 虚拟机两者共同协作支持

编译器必须确保无论方法通过何种方式完成，方法中调用过的每条 monitorenter 指令都必须执行其对应的 monitorexit 指令，而无论这个方法是正常结束还是异常结束。并且，它会自动产生一个异常处理器，这个异常处理器被声明可处理所有的异常，它的目的就是用来执行 monitorexit 指令。

### JDK8.0操作码助记符汇总

```java
指令码 助记符    说明
0x00 nop        无操作
0x01 aconst_null 将null推送至栈顶
0x02 iconst_m1    将int型-1推送至栈顶
0x03 iconst_0    将int型0推送至栈顶
0x04 iconst_1    将int型1推送至栈顶
0x05 iconst_2    将int型2推送至栈顶
0x06 iconst_3    将int型3推送至栈顶
0x07 iconst_4    将int型4推送至栈顶
0x08 iconst_5    将int型5推送至栈顶
0x09 lconst_0    将long型0推送至栈顶
0x0a lconst_1    将long型1推送至栈顶
0x0b fconst_0    将float型0推送至栈顶
0x0c fconst_1    将float型1推送至栈顶
0x0d fconst_2    将float型2推送至栈顶
0x0e dconst_0    将double型0推送至栈顶
0x0f dconst_1    将double型1推送至栈顶
0x10 bipush    将单字节的常量值(-128~127)推送至栈顶
0x11 sipush    将一个短整型常量值(-32768~32767)推送至栈顶
0x12 ldc    将int, float或String型常量值从常量池中推送至栈顶
0x13 ldc_w    将int, float或String型常量值从常量池中推送至栈顶（宽索引）
0x14 ldc2_w    将long或double型常量值从常量池中推送至栈顶（宽索引）
0x15 iload    将指定的int型本地变量推送至栈顶
0x16 lload    将指定的long型本地变量推送至栈顶
0x17 fload    将指定的float型本地变量推送至栈顶
0x18 dload    将指定的double型本地变量推送至栈顶
0x19 aload    将指定的引用类型本地变量推送至栈顶
0x1a iload_0    将第一个int型本地变量推送至栈顶
0x1b iload_1    将第二个int型本地变量推送至栈顶
0x1c iload_2    将第三个int型本地变量推送至栈顶
0x1d iload_3    将第四个int型本地变量推送至栈顶
0x1e lload_0    将第一个long型本地变量推送至栈顶
0x1f lload_1    将第二个long型本地变量推送至栈顶
0x20 lload_2    将第三个long型本地变量推送至栈顶
0x21 lload_3    将第四个long型本地变量推送至栈顶
0x22 fload_0    将第一个float型本地变量推送至栈顶
0x23 fload_1    将第二个float型本地变量推送至栈顶
0x24 fload_2    将第三个float型本地变量推送至栈顶
0x25 fload_3    将第四个float型本地变量推送至栈顶
0x26 dload_0    将第一个double型本地变量推送至栈顶
0x27 dload_1    将第二个double型本地变量推送至栈顶
0x28 dload_2    将第三个double型本地变量推送至栈顶
0x29 dload_3    将第四个double型本地变量推送至栈顶
0x2a aload_0    将第一个引用类型本地变量推送至栈顶
0x2b aload_1    将第二个引用类型本地变量推送至栈顶
0x2c aload_2    将第三个引用类型本地变量推送至栈顶
0x2d aload_3    将第四个引用类型本地变量推送至栈顶
0x2e iaload    将int型数组指定索引的值推送至栈顶
0x2f laload    将long型数组指定索引的值推送至栈顶
0x30 faload    将float型数组指定索引的值推送至栈顶
0x31 daload    将double型数组指定索引的值推送至栈顶
0x32 aaload    将引用型数组指定索引的值推送至栈顶
0x33 baload    将boolean或byte型数组指定索引的值推送至栈顶
0x34 caload    将char型数组指定索引的值推送至栈顶
0x35 saload    将short型数组指定索引的值推送至栈顶
0x36 istore    将栈顶int型数值存入指定本地变量
0x37 lstore    将栈顶long型数值存入指定本地变量
0x38 fstore    将栈顶float型数值存入指定本地变量
0x39 dstore    将栈顶double型数值存入指定本地变量
0x3a astore    将栈顶引用型数值存入指定本地变量
0x3b istore_0    将栈顶int型数值存入第一个本地变量
0x3c istore_1    将栈顶int型数值存入第二个本地变量
0x3d istore_2    将栈顶int型数值存入第三个本地变量
0x3e istore_3    将栈顶int型数值存入第四个本地变量
0x3f lstore_0    将栈顶long型数值存入第一个本地变量
0x40 lstore_1    将栈顶long型数值存入第二个本地变量
0x41 lstore_2    将栈顶long型数值存入第三个本地变量
0x42 lstore_3    将栈顶long型数值存入第四个本地变量
0x43 fstore_0    将栈顶float型数值存入第一个本地变量
0x44 fstore_1    将栈顶float型数值存入第二个本地变量
0x45 fstore_2    将栈顶float型数值存入第三个本地变量
0x46 fstore_3    将栈顶float型数值存入第四个本地变量
0x47 dstore_0    将栈顶double型数值存入第一个本地变量
0x48 dstore_1    将栈顶double型数值存入第二个本地变量
0x49 dstore_2    将栈顶double型数值存入第三个本地变量
0x4a dstore_3    将栈顶double型数值存入第四个本地变量
0x4b astore_0    将栈顶引用型数值存入第一个本地变量
0x4c astore_1    将栈顶引用型数值存入第二个本地变量
0x4d astore_2    将栈顶引用型数值存入第三个本地变量
0x4e astore_3    将栈顶引用型数值存入第四个本地变量
0x4f iastore    将栈顶int型数值存入指定数组的指定索引位置
0x50 lastore    将栈顶long型数值存入指定数组的指定索引位置
0x51 fastore    将栈顶float型数值存入指定数组的指定索引位置
0x52 dastore    将栈顶double型数值存入指定数组的指定索引位置
0x53 aastore    将栈顶引用型数值存入指定数组的指定索引位置
0x54 bastore    将栈顶boolean或byte型数值存入指定数组的指定索引位置
0x55 castore    将栈顶char型数值存入指定数组的指定索引位置
0x56 sastore    将栈顶short型数值存入指定数组的指定索引位置
0x57 pop     将栈顶数值弹出 (数值不能是long或double类型的)
0x58 pop2    将栈顶的一个（long或double类型的)或两个数值弹出（其它）
0x59 dup     复制栈顶数值并将复制值压入栈顶
0x5a dup_x1    复制栈顶数值并将两个复制值压入栈顶
0x5b dup_x2    复制栈顶数值并将三个（或两个）复制值压入栈顶
0x5c dup2    复制栈顶一个（long或double类型的)或两个（其它）数值并将复制值压入栈顶
0x5d dup2_x1    复制栈顶的一个或两个值，将其插入栈顶那两个或三个值的下面
0x5e dup2_x2    复制栈顶的一个或两个值，将其插入栈顶那两个、三个或四个值的下面
0x5f swap    将栈最顶端的两个数值互换(数值不能是long或double类型的)
0x60 iadd    将栈顶两int型数值相加并将结果压入栈顶
0x61 ladd    将栈顶两long型数值相加并将结果压入栈顶
0x62 fadd    将栈顶两float型数值相加并将结果压入栈顶
0x63 dadd    将栈顶两double型数值相加并将结果压入栈顶
0x64 isub    将栈顶两int型数值相减并将结果压入栈顶
0x65 lsub    将栈顶两long型数值相减并将结果压入栈顶
0x66 fsub    将栈顶两float型数值相减并将结果压入栈顶
0x67 dsub    将栈顶两double型数值相减并将结果压入栈顶
0x68 imul    将栈顶两int型数值相乘并将结果压入栈顶
0x69 lmul    将栈顶两long型数值相乘并将结果压入栈顶
0x6a fmul    将栈顶两float型数值相乘并将结果压入栈顶
0x6b dmul    将栈顶两double型数值相乘并将结果压入栈顶
0x6c idiv    将栈顶两int型数值相除并将结果压入栈顶
0x6d ldiv    将栈顶两long型数值相除并将结果压入栈顶
0x6e fdiv    将栈顶两float型数值相除并将结果压入栈顶
0x6f ddiv    将栈顶两double型数值相除并将结果压入栈顶
0x70 irem    将栈顶两int型数值作取模运算并将结果压入栈顶
0x71 lrem    将栈顶两long型数值作取模运算并将结果压入栈顶
0x72 frem    将栈顶两float型数值作取模运算并将结果压入栈顶
0x73 drem    将栈顶两double型数值作取模运算并将结果压入栈顶
0x74 ineg    将栈顶int型数值取负并将结果压入栈顶
0x75 lneg    将栈顶long型数值取负并将结果压入栈顶
0x76 fneg    将栈顶float型数值取负并将结果压入栈顶
0x77 dneg    将栈顶double型数值取负并将结果压入栈顶
0x78 ishl    将int型数值左移位指定位数并将结果压入栈顶
0x79 lshl    将long型数值左移位指定位数并将结果压入栈顶
0x7a ishr    将int型数值右（符号）移位指定位数并将结果压入栈顶
0x7b lshr    将long型数值右（符号）移位指定位数并将结果压入栈顶
0x7c iushr    将int型数值右（无符号）移位指定位数并将结果压入栈顶
0x7d lushr    将long型数值右（无符号）移位指定位数并将结果压入栈顶
0x7e iand    将栈顶两int型数值作“按位与”并将结果压入栈顶
0x7f land    将栈顶两long型数值作“按位与”并将结果压入栈顶
0x80 ior     将栈顶两int型数值作“按位或”并将结果压入栈顶
0x81 lor     将栈顶两long型数值作“按位或”并将结果压入栈顶
0x82 ixor    将栈顶两int型数值作“按位异或”并将结果压入栈顶
0x83 lxor    将栈顶两long型数值作“按位异或”并将结果压入栈顶
0x84 iinc    将指定int型变量增加指定值（i++, i--, i+=2）
0x85 i2l     将栈顶int型数值强制转换成long型数值并将结果压入栈顶
0x86 i2f     将栈顶int型数值强制转换成float型数值并将结果压入栈顶
0x87 i2d     将栈顶int型数值强制转换成double型数值并将结果压入栈顶
0x88 l2i     将栈顶long型数值强制转换成int型数值并将结果压入栈顶
0x89 l2f     将栈顶long型数值强制转换成float型数值并将结果压入栈顶
0x8a l2d     将栈顶long型数值强制转换成double型数值并将结果压入栈顶
0x8b f2i     将栈顶float型数值强制转换成int型数值并将结果压入栈顶
0x8c f2l     将栈顶float型数值强制转换成long型数值并将结果压入栈顶
0x8d f2d     将栈顶float型数值强制转换成double型数值并将结果压入栈顶
0x8e d2i     将栈顶double型数值强制转换成int型数值并将结果压入栈顶
0x8f d2l     将栈顶double型数值强制转换成long型数值并将结果压入栈顶
0x90 d2f     将栈顶double型数值强制转换成float型数值并将结果压入栈顶
0x91 i2b     将栈顶int型数值强制转换成byte型数值并将结果压入栈顶
0x92 i2c     将栈顶int型数值强制转换成char型数值并将结果压入栈顶
0x93 i2s     将栈顶int型数值强制转换成short型数值并将结果压入栈顶
0x94 lcmp    比较栈顶两long型数值大小，并将结果（1，0，-1）压入栈顶
0x95 fcmpl    比较栈顶两float型数值大小，并将结果（1，0，-1）压入栈顶；当其中一个数值为NaN时，将-1压入栈顶
0x96 fcmpg    比较栈顶两float型数值大小，并将结果（1，0，-1）压入栈顶；当其中一个数值为NaN时，将1压入栈顶
0x97 dcmpl    比较栈顶两double型数值大小，并将结果（1，0，-1）压入栈顶；当其中一个数值为NaN时，将-1压入栈顶
0x98 dcmpg    比较栈顶两double型数值大小，并将结果（1，0，-1）压入栈顶；当其中一个数值为NaN时，将1压入栈顶
0x99 ifeq    当栈顶int型数值等于0时跳转
0x9a ifne    当栈顶int型数值不等于0时跳转
0x9b iflt    当栈顶int型数值小于0时跳转
0x9c ifge    当栈顶int型数值大于等于0时跳转
0x9d ifgt    当栈顶int型数值大于0时跳转
0x9e ifle    当栈顶int型数值小于等于0时跳转
0x9f if_icmpeq    比较栈顶两int型数值大小，当结果等于0时跳转
0xa0 if_icmpne    比较栈顶两int型数值大小，当结果不等于0时跳转
0xa1 if_icmplt    比较栈顶两int型数值大小，当结果小于0时跳转
0xa2 if_icmpge    比较栈顶两int型数值大小，当结果大于等于0时跳转
0xa3 if_icmpgt    比较栈顶两int型数值大小，当结果大于0时跳转
0xa4 if_icmple    比较栈顶两int型数值大小，当结果小于等于0时跳转
0xa5 if_acmpeq    比较栈顶两引用型数值，当结果相等时跳转
0xa6 if_acmpne    比较栈顶两引用型数值，当结果不相等时跳转
0xa7 goto    无条件跳转
0xa8 jsr     跳转至指定16位offset位置，并将jsr下一条指令地址压入栈顶
0xa9 ret     返回至本地变量指定的index的指令位置（一般与jsr, jsr_w联合使用）
0xaa tableswitch    用于switch条件跳转，case值连续（可变长度指令）
0xab lookupswitch    用于switch条件跳转，case值不连续（可变长度指令）
0xac ireturn    从当前方法返回int
0xad lreturn    从当前方法返回long
0xae freturn    从当前方法返回float
0xaf dreturn    从当前方法返回double
0xb0 areturn    从当前方法返回对象引用
0xb1 return    从当前方法返回void
0xb2 getstatic    获取指定类的静态域，并将其值压入栈顶
0xb3 putstatic    为指定的类的静态域赋值
0xb4 getfield    获取指定类的实例域，并将其值压入栈顶
0xb5 putfield    为指定的类的实例域赋值
0xb6 invokevirtual    调用实例方法
0xb7 invokespecial    调用超类构造方法，实例初始化方法，私有方法
0xb8 invokestatic    调用静态方法
0xb9 invokeinterface 调用接口方法
0xba invokedynamic  调用动态链接方法
0xbb new     创建一个对象，并将其引用值压入栈顶
0xbc newarray    创建一个指定原始类型（如int, float, char…）的数组，并将其引用值压入栈顶
0xbd anewarray    创建一个引用型（如类，接口，数组）的数组，并将其引用值压入栈顶
0xbe arraylength 获得数组的长度值并压入栈顶
0xbf athrow    将栈顶的异常抛出
0xc0 checkcast    检验类型转换，检验未通过将抛出ClassCastException
0xc1 instanceof 检验对象是否是指定的类的实例，如果是将1压入栈顶，否则将0压入栈顶
0xc2 monitorenter    获得对象的锁，用于同步方法或同步块
0xc3 monitorexit    释放对象的锁，用于同步方法或同步块
0xc4 wide    扩大本地变量索引的宽度
0xc5 multianewarray 创建指定类型和指定维度的多维数组（执行该指令时，操作栈中必须包含各维度的长度值），并将其引用值压入栈顶
0xc6 ifnull    为null时跳转
0xc7 ifnonnull    不为null时跳转
0xc8 goto_w    无条件跳转
0xc9 jsr_w    跳转至指定32位offset位置，并将jsr_w下一条指令地址压入栈顶
============================================
0xca breakpoint  调试时的断点标记
0xfe impdep1    为特定软件而预留的语言后门
0xff impdep2    为特定硬件而预留的语言后门
最后三个为保留指令
```

### 案例

#### 案例1

```java
public void sample1() {
    int num = 5;
}
```

字节码：

```java
public sample1()V
   L0
    LINENUMBER 8 L0 // 行数
    ICONST_5 // 将int型5推送至操作数栈顶
    ISTORE 1 // 将栈顶int型数值存入第1个局部变量
   L1
    LINENUMBER 9 L1
    RETURN // 从当前方法返回void
   L2
    LOCALVARIABLE this Lcom/example/jvm/TestSample; L0 L2 0
    LOCALVARIABLE num I L1 L2 1
    MAXSTACK = 1
    MAXLOCALS = 2
```

#### 案例2

```java
public class TestSample2 {
    public int sample2(int a, int b) {
        return a + b;
    }
}
```

字节码：

```
// access flags 0x1
public sample2(II)I
   L0
    LINENUMBER 8 L0
    ILOAD 1 // 将第1个int型局部变量推送至操作数栈顶 a
    ILOAD 2 // 将第2个int型局部变量推送至操作数栈顶 b
    IADD // 将栈顶两int型数值相加并将结果压入操作数栈顶
    IRETURN // 从当前方法返回int
   L1
    LOCALVARIABLE this Lcom/example/jvm/TestSample2; L0 L1 0
    LOCALVARIABLE a I L0 L1 1
    LOCALVARIABLE b I L0 L1 2
    MAXSTACK = 2
    MAXLOCALS = 3
```

#### 案例3

```java
public class TestSample3 {
    public static int bar(int i) {
        return ((i + 1) - 2) * 3 / 4;
    }
}
```

字节码：

```
// access flags 0x9
public static bar(I)I
   L0
    LINENUMBER 8 L0  
    ILOAD 0 // 将第0个int型本地变量推送至操作数栈顶
    ICONST_1 // 将int型数1压入到操作数栈顶
    IADD // 将操作符栈顶2个数相加压入到操作符栈顶
    ICONST_2 // 将int型数2压入到操作数栈顶
    ISUB // 将操作数栈顶2个数相减压入操作符栈顶
    ICONST_3 // 将int型数3压入到操作数栈顶
    IMUL // 将栈顶2个数相乘压入操作符栈顶
    ICONST_4 // 将int型数4压入到操作数栈顶
    IDIV // 将栈顶2个数相除压入到操作数栈顶
    IRETURN // 返回栈顶int型数
   L1
    LOCALVARIABLE i I L0 L1 0
    MAXSTACK = 2 // 表示该方法需要的操作数栈空间为 2
    MAXLOCALS = 1 // 表示该方法需要的局部变量区空间为 1
```

执行：

```
bar(5)
```

每条指令执行前后局部变量区和操作数栈的变化情况：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584129783-bf5aa323-368c-4981-ad20-cb0b45efe81f.png#averageHue=%23a5d47f&clientId=uc57a83a2-02b4-4&from=paste&height=757&id=ua07491cc&originHeight=1420&originWidth=668&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7bd86e75-14d5-41fa-88a1-4a181abc451&title=&width=356)

#### 案例4

```java
public class TestJvm1 {
    public void testAdd(int b, int c) {
        int a = b + c;
    }
}
```

字节码：

```
public testAdd(II)V
   L0
    LINENUMBER 9 L0
    ILOAD 1
    ILOAD 2
    IADD
    ISTORE 3
   L1
    LINENUMBER 10 L1
    RETURN
   L2
    LOCALVARIABLE this Lcom/example/jvm/TestJvm1; L0 L2 0 // 局部变量表第0个位置，this，类型为Lcom/example/jvm/TestJvm1
    LOCALVARIABLE b I L0 L2 1 // 局部变量表弟1个位置，b，int类型
    LOCALVARIABLE c I L0 L2 2 // 局部变量表弟2个位置，c，int类型
    LOCALVARIABLE a I L1 L2 3 // 局部变量表弟3个位置，a，int类型
    MAXSTACK = 2 
    MAXLOCALS = 4 // 最大局部变量数为4
```

a = b + c 的字节码执行过程中操作数栈以及局部变量表的变化如下图所示<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584164183-1056ca6f-c921-4039-85ca-84a81f63d19a.png#averageHue=%23ebd5c3&clientId=uc57a83a2-02b4-4&from=paste&id=ued3faa52&originHeight=331&originWidth=861&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uaf88d054-ad3e-4ead-bc23-440c72c1789&title=)<br>![](https://note.youdao.com/yws/res/75200/C97DF3E429214A4E880DD75BA1DD4B7B#id=tToNx&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584171110-0505e70f-1765-4c2f-8bc1-aeb8ad17db0d.png#averageHue=%23e6d1c0&clientId=uc57a83a2-02b4-4&from=paste&id=u6524237e&originHeight=332&originWidth=1069&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u68292785-28d6-4d64-ba17-983ef802425&title=)

- testAdd方法执行时，testAdd创建一个栈帧，入虚拟机栈，方法的局部变量都存入局部变量中（this,b,c,a）
- ILOAD 1/ ILOAD 2 将int类型的数字1和2入操作数栈顶
- IADD 将操作数栈顶的2个数相加存到操作数栈顶
- ISTORE 3 将操作数栈顶的值存到局部变量表第3个位置，即a

## 注意

### Java Lambda处理

注意处理Lambda运行时生成的中间类，<br>见`Java Lambda.md`

## Ref

- [x] 深入探索编译插桩技术（三、解密 JVM 字节码）-- jsonchao<br><https://juejin.cn/post/6844904116603486222>
- [ ] [三] java虚拟机 JVM字节码 指令集 bytecode 操作码 指令分类用法 助记符 <https://www.cnblogs.com/noteless/p/9556928.html>
