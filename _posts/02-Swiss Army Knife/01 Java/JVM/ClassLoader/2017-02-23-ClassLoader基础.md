---
banner: 
date_created: Friday, February 23rd 2017, 10:10:44 pm
date_updated: Saturday, February 15th 2025, 11:47:02 am
title: ClassLoader基础
author: hacket
categories:
  - Java&Kotlin
category: JVM
tags: [class, ClassLoader, JVM]
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
date created: 2024-07-04 00:10
date updated: 2024-12-27 23:41
aliases: [ClassLoader 类加载器机制]
linter-yaml-title-alias: ClassLoader 类加载器机制
---

# ClassLoader 类加载器机制

## 1、什么是 ClassLoader？

虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行链接（验证、准备、解析）和初始化，最终形成可以被虚拟机直接使用的 Jav 对象，这就是虚拟机的类加载机制。<br>程序在启动的时候，并不会一次性加载程序所要用的所有 class 文件，而是根据程序的需要，通过 ClassLoader 来动态加载某个 class 文件到内存中去，从而只有 class 文件被载入到了内存之后，才能被其他 class 所引用。

## 2、Java 默认提供了三个 ClassLoader

![79r21](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/79r21.png)

### Bootstrap ClassLoader 启动类加载器

**启动类加载器，它负责加载 Java 的核心类**。加载 JRE/lib/rt.jar，resources.jar，charsets.jar。这个加载器的是非常特殊的，没有父类加载器，它实际上不是 java.lang.ClassLoader 的子类，而是由 JVM 自身实现的，由 C++ 编写而成。因为 JVM 在启动的时候就自动加载它们，所以不需要在系统属性 CLASSPATH 中指定这些类库。

### Extension ClassLoader 扩展类加载器

**扩展类加载器，它负责加载 JRE 的扩展目录**（JAVA_HOME/jre/lib/ext 或者由 java.ext.dirs 系统属性指定的）中的 JAR 包。这为引入除 Java 核心类以外的新功能提供了一个标准机制。因为默认的扩展目录对所有从同一个 JRE 中启动的 JVM 都是通用的，所以放入这个目录的 JAR 类包对所有的 JVM 和 system classloader 都是可见的。

### Application ClassLoader 系统类加载器

**系统类加载器**，它负责在 JVM 被启动时，加载来自在命令 java 中的 -classpath 或者 java.class.path 系统属性或者 CLASSPATH 操作系统属性所指定的 JAR 类包和类路径。<br>可以通过静态方法 `ClassLoader.getSystemClassLoader()` 找到该类加载器。如果没有特别指定，则用户自定义的任何类加载器都将该类加载器作为它的父加载器。

## 3、ClassLoader 的全盘负责和双亲委托机制

### 全盘负责 (当前类加载器负责机制)

**全盘负责**是指当一个 ClassLoader 装载一个类时，除非显示地使用另一个 ClassLoader，则该类所依赖及引用的其他类也由这个 ClassLoader 载入。" 全盘负责 " 机制也可称为当前类加载器负责机制。

### 双亲委派

**双亲委派**是指子类加载器如果没有加载过该目标类，就先委托父类加载器加载该目标类，只有在父类加载器找不到字节码文件的情况下才从自己的类路径中查找并装载目标类。<br>**" 双亲委派 " 机制加载 Class 具体流程：**

1. 源 ClassLoader 先判断该 Class 是否已经加载，如果已加载，则返回 Class 对象；如果没有加载，则委托给父类加载器
2. 父类加载器判断是否加载过该 Class，如果已经加载，则返回 Class 对象；如果没有则委托给祖父类加载。
3. 以此类推，直到始祖类加载器（引用类加载器，是 BootStrap ClassLoader）
4. 始祖类加载器判断是否加载过该 Class，如果已加载，则返回 Class 对象；如果没有则尝试从其对应的类路径下寻找 class 字节码文件并载入，如果载入成功，则返回 Class 对象；如果载入失败，则委托给始祖类加载器的子类加载器。
5. 始祖类加载器的子类加载器尝试从其对应的类路径下寻找 class 字节码文件并载入，如果载入成功，则返回 Class 对象；如果载入失败，则委托给始祖类加载器的孙类加载器。
6. 以此类推，直到源 ClassLoader。
7. 源 ClassLoader 尝试从其对应的类路径下寻找 class 字节码文件并载入，如果载入成功，则返回 Class 对象；如果载入失败，源 ClassLoader 不会再委托其子类加载器，而是抛异常 ClassNotFoundException。

### 如何打破双亲委派机制

" 双亲委派 " 机制只是 Java 推荐的机制，并不是强制的机制。我们可以继承 java.lang.ClassLoader 类，实现自己的类加载器。如果想保持双亲委派模型，就应该重写 `findClass(name)` 方法；如果想破坏双亲委派模型，可以重写 `loadClass(name)` 方法。

### 为什么要使用双亲委托这种机制？

1. **避免重复加载类**

当父加载器已经加载了该类，子 ClassLoader 就没有必要再加载一次了

2. **安全性**

如果不使用这种双亲委托机制，那我们就可以随时使用自定义的 String 来动态替代 Java 核心 API 中定义的 String 类，这样会存在非常大的安全隐患，而双亲委托机制，就可以避免这种情况，因为 String 类以及在启动时就被引导类加载器（Bootstrap ClassLoader）加载了，所以用户自定义的 ClassLoader 永远也无法加载一个自己写的 String 类，除非你改变了 JDK 中 ClassLoader 搜索类的默认算法。

## ClassLoader cache 机制

类加载还采用了 cache 机制：如果 cache 中保存了这个 Class 就直接返回它，如果没有才从文件中读取和转换成 Class，并存入 cache，这就是为什么修改了 Class 但是必须重新启动 JVM 才能生效,并且类只加载一次的原因

## 类加载加载 class 触发时机？

1. new 关键字
2. getstatic
3. putstatic
4. invokestatic

**类加载场景**：

- new 关键字实例化对象
- 调用类的静态字段，调用类的静态方法；使用 java.lang.reflect 中的方法对类进行反射调用
- 初始化一个类时，发现其父类还未初始化
- 初始化主类 (包含 main 方法的类)

## JVM 之 class 加载过程

![bazse](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/bazse.png)

- **Loading**<br>类的信息从文件中获取并且载入到 JVM 的内存里
- **Verifying**<br>检测读入的结构是否符合 JVM 规范的描述
- **Preparing**<br>分配一个结构用来存储类信息
- **Resolving**<br>把这个类的常量池中的所有的符号引用改变成直接引用
- **Initializing**<br>执行静态初始化程序，把静态变量初始化成指定的值

详情见 [[JVM加载class文件]]

# 类加载器相关面试题

## ClassLoader 题目怎么答？

1. 什么是 ClassLoader?
2. Java 中的 ClassLoader
3. Android 中的 ClassLoader
4. ClassLoader 的触发时机
5. ClassLoader 双亲委派机制
6. 如何打破双亲委派机制

重写 loadClass() 方法，保留双亲委派机制重写 findClass() 方法

## 如何判断两个 class 是相同的？

JVM 判断两个 class 是否相同，不仅要判断两个类名是否相同，而且要判断是否由同一个类加载器实例加载的，只有两者同时满足的情况下，JVM 才认为这两个 class 是相同的。就算两个 Class 是同一份 class 字节码，如果被两个不同的 ClassLoader 实例所加载，JVM 也会认为它们是两个不同的 Class 对象。

1. 全路径类名相同
2. 相同的 ClassLoader 加载

## 类的加载过程，Person person = new Person() 为例进行说明

1. 因为 new 用到了 Person.class，所以会先找到 Person.clas 文件，并加载到内存中
2. 执行该类中的 static 代码块，如果有的话，给 Person.class 类进行初始化
3. 在堆内存中开辟空间，分配内存地址
4. 在堆内存中建立对象的特有属性，并进行默认初始化
5. 对属性进行显示初始化
6. 对对象进行构造代码块初始化
7. 对对象进行与之对应的构造函数初始化
8. 将内存地址赋值给栈内存中的 person 变量<br>
