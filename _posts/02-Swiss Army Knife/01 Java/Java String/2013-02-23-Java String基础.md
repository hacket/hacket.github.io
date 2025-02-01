---
date_created: Friday, February 23rd 2013, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 8:06:53 pm
title: Java String基础
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

使用 JDK1.8 版本运行输出的结果： false 和 true 。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455293527-91e98763-bb2c-40a6-8623-d0173959d692.png#averageHue=%23d8e2df&clientId=u9aec8a87-7761-4&from=paste&height=262&id=u49a8dbf1&originHeight=393&originWidth=1032&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=119160&status=done&style=none&taskId=u20c6c489-0a4d-4395-9627-756d0ae1ee9&title=&width=688)<br>str1 直接创建在字符串常量池中，str2 使用 new 关键字，对象创建在堆上。所以 str1 == str2 为 false。<br>str3 是 str2.intern()，在 jdk1.8 首先在常量池中判断字符串 aflyun 是否存在，如果存在的话，直接返回常量池中字符串的引用，也就是 str1 的引用。所以 `str1==str3` 为 true。

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
