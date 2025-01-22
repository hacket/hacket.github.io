---
date_created: Friday, February 23rd 2013, 10:10:45 pm
date_updated: Thursday, January 23rd 2025, 12:31:24 am
title: Java String
author: hacket
categories:
  - Java&Kotlin
category: Java基础
tags: [Java基础, String]
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
date created: 2024-12-27 23:44
date updated: 2024-12-27 23:44
aliases: [String 基础]
linter-yaml-title-alias: String 基础
---

# String 基础

## String 实现原理？

### 低版本

final 的 char 数组

### 高版本 Java8？

final 的 byte 数组<br>为何用 byte 数组？

## Java 中需要转义的字符

不管是 String.split()，还是正则表达式，有一些特殊字符需要转义，这些字符是：

```
(    [     {    /    ^    -    $     ¦    }    ]    )    ?    *    +
```

转义方法为字符前面加上 `\\`，这样在 `split`、`replaceAll` 时就不会报错了；<br>不过要注意，`String.contains()` 方法不需要转义。

## 字符串常量池和 intern 方法

Java 中有字符串常量池，用来存储字符串字面量！ 由于 JDK 版本的不同，常量池的位置也不同：

1. jdk1.6 及以下版本字符串常量池是在永久区（Permanent Generation）中
2. jdk1.7、1.8 下字符串常量池已经转移到堆中了。（JDK1.8 已经去掉永久区）

String 类型的常量池比较特殊。它的主要使用方法有两种：

1. 直接使用双引号声明出来的 String 对象会直接存储在常量池中
2. 如果不是用双引号声明的 String 对象，可以使用 String 提供的 intern 方法。不同版本的 intern 表现不一样

> 直接使用 new String() 创建出的 String 对象会直接存储在堆上

```java
String str1 = "aflyun";
String str2 = new String("aflyun");
System.out.println(str1 == str2);

String str3 = str2.intern();

System.out.println(str1 ==str3);
```

使用 JDK1.8 版本运行输出的结果： false 和 true 。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455293527-91e98763-bb2c-40a6-8623-d0173959d692.png#averageHue=%23d8e2df&clientId=u9aec8a87-7761-4&from=paste&height=262&id=u49a8dbf1&originHeight=393&originWidth=1032&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=119160&status=done&style=none&taskId=u20c6c489-0a4d-4395-9627-756d0ae1ee9&title=&width=688)<br>str1 直接创建在字符串常量池中，str2 使用 new 关键字，对象创建在堆上。所以 str1 == str2 为 false。<br>str3 是 str2.intern()，在 jdk1.8 首先在常量池中判断字符串 aflyun 是否存在，如果存在的话，直接返回常量池中字符串的引用，也就是 str1 的引用。所以 str1 ==str3 为 true。

1. 直接定义字符串变量的时候赋值，如果表达式右边只有字符串常量，那么就是把变量存放在常量池里。
2. new 出来的字符串是存放在堆里面
3. 对字符串进行拼接操作，也就是做 "+" 运算的时候，分 2 中情况
   - 表达式右边是纯字符串常量，那么存放在字符串常量池里面
   - 表达式右边如果存在字符串引用，也就是字符串对象的句柄，那么就存放在堆里面

## 一些案例

### 案例 1：字符串 + 号及 final 修饰

```java
String str1 = "hello";
String str2 = "world";
//常量池中的对象
String str3 = "hello" + "world";
//在堆上创建的新的对象
String str4 = str1 + str2; 
//常量池中的对象
String str5 = "helloworld";
System.out.println(str3 == str4);//false
System.out.println(str3 == str5);//true
System.out.println(str4 == str5);//false
```

输出：

```
false
true
false
```

str1 和 str2 加了 final 修饰符后

```java
private static void test1() {
    // 常量池中的对象
    final String str1 = "hello";
    final String str2 = "world";
    String str3 = "hello" + "world";

    // 在堆上创建的新的对象
    final String str4 = str1 + str2;

    // 常量池中的对象
    String str5 = "helloworld";

    System.out.println(str3 == str4); // false
    System.out.println(str3 == str5); // true
    System.out.println(str4 == str5); // false
}
```

输出：

```
true
true
true
```

> 编译器内联了

### 案例 2：+ new String

```java
private static void test2() {
    // 同时生成堆中的对象以及常量池中hello的对象，此时str1是指向堆中的对象的
    String str1 = new String("hello");
    // 常量池中的已经存在hello
    str1.intern();
    // 常量池中的对象,此时str2是指向常量池中的对象的
    String str2 = "hello";
    System.out.println(str1 == str2); // false，str1.intern之前已经存在字符串池，返回的是之前new的引用

    // 此时生成了四个对象 常量池中的"world" + 2个堆中的"world" +s3指向的堆中的对象（注此时常量池不会生成"worldworld"）
    String str3 = new String("world") + new String("world");
    // 常量池没有“worldworld”，会直接将str3的地址存储在常量池内
    str3.intern();
    // 创建str4的时候，发现字符串常量池已经存在一个指向堆中该字面量的引用，则返回这个引用，而这个引用就是str3
    String str4 = "worldworld";
    System.out.println(str3 == str4); // true
}
```

输出：

```
false
true
```

### 案例 3 final 对 String 影响

```java
private static void test3() {
    // str1指的是字符串常量池中的 java6
    String str1 = "java6";
    // str2是 final 修饰的，编译时候就已经确定了它的确定值，编译期常量
    final String str2 = "java";
    // str3是指向常量池中 java
    String str3 = "java";

    // str2编译的时候已经知道是常量，"6"也是常量，所以计算str4的时候，直接相当于使用 str2 的原始值（java）来进行计算.
    // 则str4 生成的也是一个常量，。str1和str4都对应 常量池中只生成唯一的一个 java6 字符串。
    String str4 = str2 + "6";

    // 计算 str5 的时候,str3不是final修饰，不会提前知道 str3的值是什么，只有在运行通过链接来访问，这种计算会在堆上生成 java6
    String str5 = str3 + "6";
    System.out.println((str1 == str4)); // true
    System.out.println((str1 == str5)); // false
}
```

输出：

```
true
false
```

# String 相关问题

## String 是 Java 中的基本数据类型吗？是可变的吗？是线程安全的吗？

1. String 不是基本数据类型，Java 中的基本数据类型是：byte, short, int, long, char, float, double, boolean
2. String 是不可变的。
3. String 是不可变类，⼀旦创建了 String 对象，我们就⽆法改变它的值，因此，它是线程安全的，可以安全地⽤于多线程环境中。

## 为什么要设计成不可变的呢？如果 String 是不可变的，那我们平时赋值是改的什么呢？

1. 安全

由于 String 广泛用于 Java 类中的参数，安全是非常重要的，如网络 URL，数据库 URL、打开文件等。

> 如果 String 是可变的，将导致严重的安全威胁，有人可以访问他有权授权的任何文件，然后可以故意更改文件名来获得该文件的访问权限。

2. 效率

String 会缓存其哈希码 (就是 `hash` 字段)，由于 String 的不可变性，不会在每次调用 String 的 hashcode 方法时重新计算，这使得它在 Java 中的 HashMap 中使用的 HashMap 键非常快。

3. 空间

不同的字符串变量可以引用字符串池中相同的字符串，可以节省大量的 Java 堆空间；如果字符串可变的话，任何一个变量值的改变都会让反馈到其他变量，字符串池就没有任何意义了

平时使⽤双引号⽅式赋值的时候其实是返回的字符串引⽤，并不是改变了这个字符串对象，

```java
String a = "aaa";
a = "axx"; // 只是将a的引用更改了，引用到了"axx"字符串对象；"aaa"和"axx"都是字符串池中的对象
```

## String、StringBuilder 和 StringBuffer 及原理？

**区别**

1. String 是不可变类，每当我们对 String 进⾏操作的时候，总是会创建新的字符串。操作 String 很耗资源，所以 Java 提供了两个⼯具类来操作 String：StringBuffer 和 StringBuilder。
2. StringBuffer 和 StringBuilder 是可变类, 字符串缓冲区，可以提高字符串的效率，StringBuffer 是线程安全的，StringBuilder 则不是线程安全的。所以在多线程对同⼀个字符串操作的时候，我们应该选择⽤ StringBuffer。由于不需要处理多线程的情况，StringBuilder 的效率⽐ StringBuffer ⾼。

**原理**

1. String 的底层是一个 fianl char 数组，不可变；JDK9 之后改成 byte 数组了，节省内存？
2. StringBuilder 底层也是一个 char 数组，可变，默认容量 16，会自动扩容，线程不安全
3. StringBuffer 底层同 StringBuilder，在操作字符串的方式上加了同步锁 synchronized，如 append

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1663807108973-37662f99-bc08-4823-adff-c52e7126de7c.png#averageHue=%23fafcfa&clientId=u1774aafe-8223-4&from=paste&id=u44b2b54f&originHeight=602&originWidth=1737&originalType=url&ratio=1&rotation=0&showTitle=false&size=511514&status=done&style=none&taskId=u0fcae61e-05dd-42df-8529-a2e5cca8130&title=)<br>**使用总结**

1. 如果要操作少量的数据用 String
2. 单线程操作字符串缓冲区下操作⼤量数据⽤ StringBuilder
3. 多线程操作字符串缓冲区下操作⼤量数据⽤ StringBuffer

## 1 个字符的 String.length() 是多少？一定是为 1 吗？

1 个字符的 length() 不一定都为 1。<br>**String.length() 代表的意思？**<br>返回字符串的长度，这一长度等于字符串中的 Unicode 代码单元的数目<br>**统计字符串有几个字符怎么统计？**<br>用 String.codePointCount(int beginIndex, int endIndex)

```java
public static void main(String[] args) {
    String B = "𝄞"; // 这个就是那个音符字符，只不过由于当前的网页没支持这种编码，所以没显示。
    String C = "\uD834\uDD1E"; // 这个就是音符字符的UTF-16编码
    System.out.println(C);
    System.out.println(B.length()); // 2
    System.out.println(B.codePointCount(0, B.length())); // 1
}
```

## 字符串常量池中存放的是对象？还是对象的引用？

JDK 版本不同，字符串常量池的位置不一样，里面存放的内容也不同。JDK1.6 及之前的版本，常量池是在 Perm 区的，则字符串字面量的对象是直接存放在常量池中的；而 JDK1.7 及之后的版本，常量池中存放的是对象的引用（避免对象多次创建）。<br>[深入解析String#intern](https://tech.meituan.com/2014/03/06/in-depth-understanding-string-intern.html)

## Java String 可以有多长？

**Java String 字⾯量形式**

1. 字节码中**CONSTANT_Utf8_info**的限制，最多 65535 个字节
2. Javac 源码逻辑的限制 <=65535
3. ⽅法区⼤⼩的限制（如果运⾏时⽅法区设置较⼩，也会受到⽅法区⼤⼩的限制 ）

**Java String 运⾏时创建在堆上的形式**

1. Java 虚拟机指令 newarray 的限制
2. Java 虚拟机堆内存⼤⼩的限制 <br>

## 字符串对象创建相关题

### String 两种创建方式

#### 字面量形式

当一个.java 文件被编译成.class 文件时，和所有其他常量一样，每个字符串字面量都通过一种特殊的方式被记录下来。当一个.class 文件被加载时，JVM 在.class 文件中寻找字符串字面量。当找到一个时，JVM 会检查是否有相等的字符串在常量池中存放了堆中引用。如果找不到，就会在**堆中**创建一个对象，然后将它的**引用**存放在常量池中的一个常量表中。一旦一个字符串对象的引用在常量池中被创建，这个字符串在程序中的所有字面量引用都会被常量池中已经存在的那个引用代替。

```java
String s = "zzc";
String s2 = "zzc";
System.out.println(s == s2);  // true
```

1. JVM 检测这个字面量 "zzc"，这里我们认为没有内容为 "zzc" 的对象存在。JVM 通过字符串常量池查找不到内容为 "zzc" 的字符串对象，那么就会在堆中创建这个字符串对象，然后将刚创建的对象的引用放入到字符串常量池中,并且将引用返回给变量 s。
2. 同样 JVM 还是要检测这个字面量，JVM 通过查找字符串常量池，发现内容为 "zzc" 字符串对象存在，于是将已经存在的字符串对象的引用返回给变量 s2。注意，这里并不会重新创建新的字符串对象。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1664211012041-61159342-5123-457f-820f-200fc7d0d667.png#averageHue=%23fafafa&clientId=ua4f44bae-7dab-4&from=paste&height=224&id=uca22ed3b&originHeight=615&originWidth=1203&originalType=binary&ratio=1&rotation=0&showTitle=false&size=45013&status=done&style=none&taskId=u9a4975df-34bd-4827-a035-903064094ad&title=&width=438)

#### new 形式

new 关键字创建时，前面的操作和字面量创建一样，只不过最后在运行时会创建一个新对象，变量所引用的都是这个新对象的地址。

```java
String s = "zzc";
String s2 = new String("zzc");
System.out.println(s == s2);  // false
```

两个字符串字面量仍然被放进了常量池的常量表中，但是当使用 "new" 时，JVM 就会在运行时创建一个新对象，而不是使用常量表中的引用

> 要记住引用到常量池的字符串对象是在类加载的时候创建的，而另一个对象是在运行时，当 "new String" 语句被执行时。

#### intern()

调用 intern() 后，首先检查字符串常量池中是否有该对象的引用，如果存在，则将这个引用返回给变量，否则将引用加入字符串池并返回给变量。

### String s1 = new String("hello"); 这句话创建了几个字符串对象？

1 个或 2 个<br>**情况 1：hello 字符串未存在于字符串常量池中**

```java
String s1 = new String("hello");// 堆内存的地址值
String s2 = "hello";
System.out.println(s1 == s2);// 输出false,因为一个是堆内存，一个是常量池的内存，故两者是不同的。
System.out.println(s1.equals(s2));// 输出true

System.out.printf("s1: %d | %d\n", identityHashCode(s1), identityHashCode(s1.intern()));
System.out.printf("s2: %d | %d\n", identityHashCode(s2), identityHashCode(s2.intern()));

// 输出
// false
// true
// s1: 2018699554 | 1311053135
// s2: 1311053135 | 1311053135
```

这种情况总共创建 2 个字符串对象：

1. 常量池 "hello" 对象 1311053135
2. new String 对象 2018699554

**情况 2：hello 字符串已经存在于字符串常量池中**

```java
String s2 = "hello";
String s1 = new String("hello");// 堆内存的地址值
System.out.println(s1 == s2);// 输出false,因为一个是堆内存，一个是常量池的内存，故两者是不同的。
System.out.println(s1.equals(s2));// 输出true

System.out.printf("s1: %d | %d\n", identityHashCode(s1), identityHashCode(s1.intern()));
System.out.printf("s2: %d | %d\n", identityHashCode(s2), identityHashCode(s2.intern()));
// 输出
// false
// true
// s1: 2133927002 | 1311053135
// s2: 1311053135 | 1311053135
```

这种情况就只创建一个对象 new String，因为 s2 指向的 hello 字符串已经在常量池了

### String str ="abc"+"def"; 创建几个对象？假设字符串常量池中都不存在对应的字符串 abc 和 def

1 个。<br>在编译时已经被合并成 "abcdef" 字符串，因此，只会创建 1 个对象。并没有创建临时字符串对象 abc 和 def，这样减轻了垃圾收集器的压力。

> 字符串常量重载 "+" 的问题，当一个字符串由多个字符串常量拼接成一个字符串时，它自己也肯定是字符串常量。字符串常量的 "+" 号连接 Java 虚拟机会在程序编译期将其优化为连接后的值。

### String str ="abc"+newString("def"); 创建几个对象？

> 4+1 = 5 个对象

- 4 个对象：常量池中分别有 "abc" 和 "def"，堆中对象 new String("def") 和 "abcdef"
- 1 个 StringBuilder 对象

上述的代码 Java 虚拟机在编译的时候同样会优化，会创建一个 StringBuilder 来进行字符串的拼接，实际效果类似：

```java
String s = new String("def");
new StringBuilder().append("abc").append(s).toString();
```

### final 对 String 的影响

```java
String str1 = "hello";
String str2 = "world";
//常量池中的对象
String str3 = "hello" + "world";
//在堆上创建的新的对象
String str4 = str1 + str2; 
//常量池中的对象
String str5 = "helloworld";
System.out.println(str3 == str4); // false
System.out.println(str3 == str5); // true
System.out.println(str4 == str5); // false
```

```java
// 常量池中的对象
final String str1 = "hello";
final String str2 = "world";
String str3 = "hello" + "world";

// 在堆上创建的新的对象
final String str4 = str1 + str2;

// 常量池中的对象
String str5 = "helloworld";

System.out.println(str3 == str4); // true
System.out.println(str3 == str5); // true
System.out.println(str4 == str5); // true
```

> 未加 final 前，str4 计算 str1 和 str2 时，会在堆上生成新的对象；加了 final 后，就知道都是常量了，引用的就是常量池的了

### String 测试

```java
// String ==和equals测试
String str1 = "hacket";
String str2 = new String("hacket");
System.out.println(str1 == str2); // false
System.out.println(str1.equals(str2)); // true

// String intern测试
String str2 = new String("hacket");
String str3 = str2.intern();
System.out.println(str1 == str3); // true

String s1 = new String("a") + new String("bc");
s1.intern();
String s2 = "abc";
System.out.println(s1 == s2);  // true

// final对String的影响
private static void test1() {
    // 常量池中的对象
    final String str1 = "hello";
    final String str2 = "world";
    String str3 = "hello" + "world";

    // 在堆上创建的新的对象
    String str4 = str1 + str2;

    // 常量池中的对象
    String str5 = "helloworld";

    System.out.println(str3 == str4); // true
    System.out.println(str3 == str5); // true
    System.out.println(str4 == str5); // true
}
private static void test1() {
    // 常量池中的对象
    String str1 = "hello";
    String str2 = "world";
    String str3 = "hello" + "world";

    // 在堆上创建的新的对象
    String str4 = str1 + str2;

    // 常量池中的对象
    String str5 = "helloworld";

    System.out.println(str3 == str4); // false
    System.out.println(str3 == str5); // true
    System.out.println(str4 == str5); // false
}
private static void test3() {
    // str1指的是字符串常量池中的 java6
    String str1 = "java6";
    // str2是 final 修饰的，编译时候就已经确定了它的确定值，编译期常量
    final String str2 = "java";
    // str3是指向常量池中 java
    String str3 = "java";

    // str2编译的时候已经知道是常量，"6"也是常量，所以计算str4的时候，直接相当于使用 str2 的原始值（java）来进行计算.
    // 则str4 生成的也是一个常量，。str1和str4都对应 常量池中只生成唯一的一个 java6 字符串。
    String str4 = str2 + "6";

    // 计算 str5 的时候,str3不是final修饰，不会提前知道 str3的值是什么，只有在运行通过链接来访问，这种计算会在堆上生成 java6
    String str5 = str3 + "6";
    System.out.println((str1 == str4)); // true
    System.out.println((str1 == str5)); // false
}

// intern测试
private static void test2() {
    // 同时生成堆中的对象以及常量池中hello的对象，此时str1是指向堆中的对象的
    String str1 = new String("hello");
    // 常量池中的已经存在hello
    str1.intern();
    // 常量池中的对象,此时str2是指向常量池中的对象的
    String str2 = "hello";
    System.out.println(str1 == str2); // false，str1.intern之前已经存在字符串池，返回的是之前new的引用

    // 此时生成了四个对象 常量池中的"world" + 2个堆中的"world" +s3指向的堆中的对象（注此时常量池不会生成"worldworld"）
    String str3 = new String("world") + new String("world");
    // 常量池没有“worldworld”，会直接将str3的地址存储在常量池内
    str3.intern();
    // 创建str4的时候，发现字符串常量池已经存在一个指向堆中该字面量的引用，则返回这个引用，而这个引用就是str3
    String str4 = "worldworld";
    System.out.println(str3 == str4); // true
}

```

### String 的 hashcode 为什么乘以 31？
