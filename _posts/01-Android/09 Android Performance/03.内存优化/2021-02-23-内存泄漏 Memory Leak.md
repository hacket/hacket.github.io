---
date_created: Friday, February 23rd 2021, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 12:16:52 am
title: 内存泄漏 Memory Leak
author: hacket
categories:
  - 性能优化
category: 内存优化
tags: [内存优化, 性能优化]
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
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
aliases: [内存泄漏 Memory Leak]
linter-yaml-title-alias: 内存泄漏 Memory Leak
---

# 内存泄漏 Memory Leak

## 内存泄漏定义

本该被回收的对象，因为某些原因（有对象正在持有该应该回收对象的引用）而不能被回收，从继续停留在堆内存中。<br />本质原因：对象 A（持有引用者）的生命周期 > 被引用者（对象 B）的生命周期，从而导致对象 B 需要在生命周期结束时，而无法正确被回收。

## 检测内存泄漏

检测内存泄漏非常简单，只需要拿到 hprof 文件进行分析就可以知道哪里产生了泄漏。

### 主动检测法

#### Activity 的检测预判

LeakCanary 中对 Activity 的预判是在 onDestroy 生命周期中通过弱引用来持有当前 Activity 对象，如果在主动触发 GC 后，在 ReferenceQueue 中没有，说明可能内存泄漏了，会再次 GC，如何还没有回收会 dump 内存来分析。<br />具体见 `开源库→LeakCanary`

#### Service 的检测预判

LeakCanary 对 Service 的内存泄漏检测时机是 hook 监听 ActivityThread 的 stopService，然后记录这个 binder 的弱引用中，然后代理 AMS 的 serviceDoneExecuting 方法，通过判断 binder 是否在弱引用队列，是否存在泄漏的风险，开始 dump 内存

#### Bitmap 大图的检测预判

Bitmap 不能像 Activity/Service 通过生命周期主动监测当前是否有内存泄漏的可能，一般是在 Activity/Service 发生泄漏 dump 时，顺便检测一下 Bitmap；在 KOOM 中，Bitmap 大图检测是分析 hprof 中是否有超过 Bitmap 设置的阈值 size

### 阈值检测法

代表的框架有 KOOM，抛弃了 LeakCanary 的实时检测，采用定时轮询检测当前内存是否在不断累加，增长达到一定次数阈值时会进行 dump hprof；这种方式牺牲了实时性，可用于线上

### 辅助分析内存泄漏工具

#### MAT(Memory Analysis Tools)

通过分析 Java 进程的内存快照 HPROF 分析，快速计算出在内存中对象占用的大小，查看哪些对象不能被垃圾收集器回收 & 可通过视图直观地查看可能造成这种结果的对象 [MAT使用教程](https://blog.csdn.net/itomge/article/details/48719527)

#### Android Studio Profiler

Android Studio 的 Profiler 工具支持 hprof 的解析，并且很智能的提示当前 leak 了哪些对象，打开方式很简单，将 hprof 文件拖拽至 as<br />具体见 `HPROF文件及工具使用` 章节

#### LeakCanary

具体见 [[LeakCanary2.x]] 章节

#### Haha/Shark

具体见 [[HPROF文件及工具使用]] 章节

## 内存泄露原理

应用程序在使用内存时，由于程序设计问题或者错误，导致无法释放不再使用的内存，最终导致系统中的内存不足，影响系统的稳定性和性能。

### GCRoot

GCRoot 是 GC 机制中的根节点，根节点包括虚拟机栈、本地方法栈、方法区中的类静态属性引用、活动线程等，这些对象被垃圾回收机制视为 " 活着的对象 "，不会被回收。<br />当垃圾回收机制执行时，它会从 GCRoot 出发，遍历所有的对象引用，并标记所有活着的对象，未被标记的对象即为垃圾对象，将会被回收。<br />当存在内存泄漏时，垃圾回收机制无法回收一些已经不再使用的对象，这些对象仍然被引用，形成了一些 GCRoot 到内存泄漏对象的引用链，这些对象将无法被回收，导致内存泄漏。<br />通过查找内存泄漏对象和 GCRoot 之间的引用链，可以定位到内存泄漏的根源，进而解决内存泄漏问题,LeakCancry 就是通过这个机制实现的。 一些常见的 GCRoot 包括：

- 虚拟机栈（Local Variable）中引用的对象。
- 方法区中静态属性（Static Variable）引用的对象。
- JNI 引用的对象。
- Java 线程（Thread）引用的对象。
- Java 中的 synchronized 锁持有的对象。

### 可能导致安卓内存泄漏的常见原因

1. 对象引用未释放

当对象被创建时，如果没有被正确释放，那么这些对象就会一直占用内存，直到应用程序退出。例如，当一个 Activity 被销毁时，如果它还持有其他对象的引用，那么这些对象就无法被垃圾回收器回收，从而导致内存泄漏。

2. 匿名内部类造成的内存泄漏

匿名内部类通常会持有外部类的引用，当外部类被销毁时，内部类并不会自动销毁，因为内部类并不是外部类的成员变量，它们只是在外部类的作用域内创建的对象，所以内部类的销毁时机和外部类的销毁时机是不同的，所以会不会取决与对应对象是否存在被持有的引用）那么就会导致外部类无法被回收，从而导致内存泄漏。

3. 静态变量持有 Activity 或 Context 的引用

如果一个静态变量持有 Activity 或 Context 的引用，那么这些 Activity 或 Context 就无法被垃圾回收器回收，从而导致内存泄漏。

4. 未关闭的 Cursor、Stream 或者 Bitmap 对象

如果程序在使用 Cursor、Stream 或者 Bitmap 对象时没有正确关闭这些对象，那么这些对象就会一直占用内存，从而导致内存泄漏。

5. 资源未释放

如果程序在使用系统资源时没有正确释放这些资源，例如未关闭数据库连接、未释放音频资源等，那么这些资源就会一直占用内存，从而导致内存泄漏。

## 常见的内存泄漏场景

### 静态引用导致的内存泄漏

当一个对象被一个静态变量持有时，即使这个对象已经不再使用，也不会被垃圾回收器回收，这就会导致内存泄漏。

- 单例对象持有 Activity：App 中有一个页面管理会持有 Activity 对象，有一部分页面添加之后没有移除造成了大量内存泄漏的场景
- Static 关键字修饰的成员变量，一般是 static 修饰了 Context，导致 Context 泄漏
  - 解决 1：尽量用 ApplicationContext；用 WeakReference
  - 解决 2：使用静态变量，请注意在不需要时将其设置为 null，以便及时释放内存。

示例：

```java
public class MySingleton {
    private static MySingleton instance;
    private Context context;

    private MySingleton(Context context) {
        this.context = context;
    }

    public static MySingleton getInstance(Context context) {
        if (instance == null) {
            instance = new MySingleton(context);
        }
        return instance;
    }
}
```

> 上面的代码中，MySingleton 持有了一个 Context 对象的引用，而 MySingleton 是一个静态变量，导致即使这个对象已经不再使用，也不会被垃圾回收器回收。

### 匿名内部类导致的内存泄露

匿名内部类会隐式地持有外部类的引用，如果这个匿名内部类被持有了，就会导致外部类无法被垃圾回收。

- Handler，Thread 等匿名内部类隐式持有外部类导致

> **非静态内部类默认持有外部类的引用** 而导致外部类无法释放，最终 造成内存泄露

- 网络请求，异步任务：由于早期网络部分封装的不好，网络请求没有与页面的生命周期绑定，在弱网或者用户关闭页面较快的情况下会出现内存泄漏。
- Context 使用 Application 就可以的时候使用了 Activity：例如，Toast，第三方 SDK

#### Kotlin 匿名内部类和 Java 匿名内部类

**匿名内部类**

- 在 Kotlin 中，匿名内部类如果没有使用到外部类的对象引用时候，是不会持有外部类的对象引用的，此时的匿名内部类其实就是个静态匿名内部类，也就不会发生内存泄漏。
- 在 Kotlin 中，匿名内部类如果使用了对外部类的引用，这时候就会持有外部类的引用了，就会需要考虑内存泄漏的问题。
- Java 的匿名内部类会持有外部类的引用，可能会发生内存泄露

#### 非静态内部类持有外部类引用及原理

常说非静态内部类能访问外部类的成员，是因为内部类默认持有了外部类的引用，为什么？<br />示例代码：

```java
public class InnerClassOutClass {
    private int age = 20;
    private String name = "hacket";

    class InnerUser {
        public void print() {
            System.out.println(age + "-" + name);
        }
    }
}
```

编译成 class 后，会生成 `InnerClassOutClass.class` 和 `InnerClassOutClass$InnerUser.class`<br />定位到 build 编译类的目录：`javap -verbose InnerClassOutClass`

```java
Classfile /Users/10069683/OpenSources/king-assist/JavaKotlinCodeLabs/build/classes/java/main/com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass.class
  Last modified 11 Aug 2023; size 929 bytes
  MD5 checksum 62e78e9634dff689ef62b5c71455903f
  Compiled from "InnerClassOutClass.java"
public class com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass
  minor version: 0
  major version: 52
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #5                          // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
  super_class: #6                         // java/lang/Object
  interfaces: 0, fields: 2, methods: 3, attributes: 2
Constant pool:
   #1 = Fieldref           #5.#28         // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass.name:Ljava/lang/String;
   #2 = Fieldref           #5.#29         // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass.age:I
   #3 = Methodref          #6.#30         // java/lang/Object."<init>":()V
   #4 = String             #31            // hacket
   #5 = Class              #32            // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
   #6 = Class              #33            // java/lang/Object
   #7 = Class              #34            // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser
   // ...
  #19 = Utf8               this
  #20 = Utf8               Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
  #21 = Utf8               access$000
  #22 = Utf8               (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
  #23 = Utf8               x0
  #24 = Utf8               access$100
  #25 = Utf8               (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)Ljava/lang/String;
  // ...
  #32 = Utf8               com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
  #33 = Utf8               java/lang/Object
  #34 = Utf8               com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser
{
  public com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      // ...

  static int access$000(com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass);
    descriptor: (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
    flags: (0x1008) ACC_STATIC, ACC_SYNTHETIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #2                  // Field age:I
         4: ireturn
      LineNumberTable:
        line 6: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0    x0   Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;

  static java.lang.String access$100(com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass);
    descriptor: (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)Ljava/lang/String;
    flags: (0x1008) ACC_STATIC, ACC_SYNTHETIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #1                  // Field name:Ljava/lang/String;
         4: areturn
      LineNumberTable:
        line 6: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0    x0   Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
}
SourceFile: "InnerClassOutClass.java"
InnerClasses:
  #8= #7 of #5;  // InnerUser=class com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser of class com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
```

发现 InnerClassOutClass 多了静态方法 `access$000` 和 `access$100`：

- flags：ACC_SYNTHETIC 表示是编译器生成的；ACC_STATIC 表示是静态的方法，没有 public 修饰，包可见
- 静态方法参数只有 InnerClassOutClass 这一个
- aload_0 表示把局部变量表的第一个变量 (就是 InnerClassOutClass 引用) 加载到操作栈顶

> aload_0 表示将局部变量区第 0 个值加载到操作数栈顶；即将 InnerClassOutClass 引用放到操作数栈顶

- getfield 访问实例字段#1 并将其值压入操作数栈顶（前面的常量池#1 代表的字段是 age）

> getfield 获取指定类 (操作符栈顶 InnerClassOutClass?) 的成员变量 (age)，并将其值压入栈顶；即获取 InnerClassOutClass 的成员变量 age 的值并放到操作数栈顶

- ireturn 返回传参进来的 InnerClassOutClass 的#1 的值 (即返回 InnerClassOutClass 的成员变量 age 的值)

> 返回操作符栈顶的 int 值，即 age

可以得出：在内部类使用了外部类的私有域 outerField，编译器就自动帮我们生成了一个仅包可见的静态方法来返回 outerField 的值。<br />再继续看看 `InnerClassOutClass$InnerUser.class` 字节码

```java
Warning: File ./InnerClassOutClass$InnerUser.class does not contain class InnerClassOutClass$InnerUser
Classfile /Users/10069683/OpenSources/king-assist/JavaKotlinCodeLabs/build/classes/java/main/com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser.class
  Last modified 11 Aug 2023; size 996 bytes
  MD5 checksum aff7cec22b1fce9e8cbf7f482d45b686
  Compiled from "InnerClassOutClass.java"
class com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass$InnerUser
  // ...
  flags: (0x0020) ACC_SUPER
  this_class: #6                          // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser
  super_class: #7                         // java/lang/Object
  interfaces: 0, fields: 1, methods: 2, attributes: 2
Constant pool:
   #1 = Fieldref           #6.#23         // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser.this$0:Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
   #2 = Methodref          #7.#24         // java/lang/Object."<init>":()V
   #3 = Fieldref           #25.#26        // java/lang/System.out:Ljava/io/PrintStream;
   #4 = Methodref          #27.#28        // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass.access$000:(Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
   #5 = Methodref          #29.#30        // java/io/PrintStream.println:(I)V
   #6 = Class              #31            // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser
   #7 = Class              #32            // java/lang/Object
   #8 = Utf8               this$0
   #9 = Utf8               Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
  #10 = Utf8               <init>
  #11 = Utf8               (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)V
  // ...
  #22 = Utf8               InnerClassOutClass.java
  #23 = NameAndType        #8:#9          // this$0:Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
  #24 = NameAndType        #10:#20        // "<init>":()V
  #25 = Class              #33            // java/lang/System
  #26 = NameAndType        #34:#35        // out:Ljava/io/PrintStream;
  #27 = Class              #36            // com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
  #28 = NameAndType        #37:#38        // access$000:(Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
  #29 = Class              #39            // java/io/PrintStream
  #30 = NameAndType        #40:#41        // println:(I)V
  #31 = Utf8               com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser
  #32 = Utf8               java/lang/Object
  #33 = Utf8               java/lang/System
  #34 = Utf8               out
  #35 = Utf8               Ljava/io/PrintStream;
  #36 = Utf8               com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
  #37 = Utf8               access$000
  #38 = Utf8               (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
  #39 = Utf8               java/io/PrintStream
  #40 = Utf8               println
  #41 = Utf8               (I)V
{
  final com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass this$0;
    descriptor: Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
    flags: (0x1010) ACC_FINAL, ACC_SYNTHETIC

  com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass$InnerUser(com.hacket.面向对象.匿名内部类和lambda.InnerClassOutClass);
    descriptor: (Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)V
    flags: (0x0000)
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: aload_1
         2: putfield      #1                  // Field this$0:Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
         5: aload_0
         6: invokespecial #2                  // Method java/lang/Object."<init>":()V
         9: return
      LineNumberTable:
        line 9: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      10     0  this   Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser;
            0      10     1 this$0   Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;

  public void print();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: aload_0
         4: getfield      #1                  // Field this$0:Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;
         7: invokestatic  #4                  // Method com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass.access$000:(Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass;)I
        10: invokevirtual #5                  // Method java/io/PrintStream.println:(I)V
        13: return
      LineNumberTable:
        line 11: 0
        line 12: 13
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      14     0  this   Lcom/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser;
}
SourceFile: "InnerClassOutClass.java"
InnerClasses:
  #16= #6 of #27;                         // InnerUser=class com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass$InnerUser of class com/hacket/面向对象/匿名内部类和lambda/InnerClassOutClass
```

- 构造方法将 InnerClassOutClass 引用赋值给了 `this$0`
- 再看下 print()
  - getfield 获取到 `this$0`，就是 InnerClassOutClass 引用
  - invokestatic 调用了静态方法 `InnerClassOutClass.access$000`

非静态内部类访问外部类方法，等价在 InnerClassOutClass 类新增了 access$000 方法，每个成员变量生成一个方法：

```java
public class InnerClassOutClass {
    static int access$000(InnerClassOutClass innerClassOutClass) {
        return innerClassOutClass.age;
    }
}
```

**总结：**内部类访问外部类的私有成员的原理，是通过编译器分别给外部类自动生成访问私有成员的静态方法 access$000及给内部类自动生成外部类的final引用、外部类初始化的构造函数及修改调用外部类私有成员的代码为调用外部类包可见的access$000 实现的<br />如果内部类访问外部类的成员是 public 的，不会生成 access$000 方法

### Bitmap 对象导致的内存泄漏

当一个 Bitmap 对象被创建时，它会占用大量内存，如果不及时释放，就会导致内存泄漏。

### 资源未关闭导致的内存泄漏

当使用一些系统资源时，例如文件、数据库等，如果不及时关闭，就可能导致内存泄漏。

- 注册的监听器未及时反注册：EventBus，广播

示例代码：

```java
public void readFile(String filePath) throws IOException {
    FileInputStream fis = null;
    try {
        fis = new FileInputStream(filePath);
        // 读取文件...
    } finally {
        if (fis != null) {
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### WebView 内存泄漏

在使用 WebView 时，要及时释放 WebView 对象，可以在 Activity 销毁时调用 WebView 的 destroy 方法，同时也要清除 WebView 的历史记录、缓存等内容，以确保释放所有资源。

```java
public class MyActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);
        mWebView.loadUrl("https://www.example.com");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 释放WebView对象
        if (mWebView != null) {
            mWebView.stopLoading();
            mWebView.clearHistory();
            mWebView.clearCache(true);
            mWebView.loadUrl("about:blank");
            mWebView.onPause();
            mWebView.removeAllViews();
            mWebView.destroy();
            mWebView = null;
        }
    }
}
```
