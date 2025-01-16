---
date created: 2024-07-04 00:10
date updated: 2024-12-27 23:41
dg-publish: true
---

# ClassLoader类加载器机制

## 1、什么是ClassLoader？

虚拟机把描述类的数据从Class文件加载到内存，并对数据进行链接（验证、准备、解析）和初始化，最终形成可以被虚拟机直接使用的Jav 对象，这就是虚拟机的类加载机制。<br>程序在启动的时候，并不会一次性加载程序所要用的所有class文件，而是根据程序的需要，通过ClassLoader来动态加载某个class文件到内存中去，从而只有class文件被载入到了内存之后，才能被其他class所引用。

## 2、Java默认提供了三个ClassLoader

![image.png|1000](https://cdn.nlark.com/yuque/0/2022/png/694278/1654962656762-b9a4bf33-bc7b-4e7f-9d2f-6d2e7d78c8fc.png#averageHue=%23e6f8ce&clientId=ud6ac9a06-311a-4&from=paste&height=506&id=TFGAP&originHeight=759&originWidth=1071&originalType=binary&ratio=1&rotation=0&showTitle=false&size=443379&status=done&style=none&taskId=uf791fa27-dc91-48d5-b74c-ea8f12c42fa&title=&width=714)

### Bootstrap ClassLoader 启动类加载器

**启动类加载器，它负责加载Java的核心类**。加载JRE/lib/rt.jar，resources.jar，charsets.jar。这个加载器的是非常特殊的，没有父类加载器，它实际上不是java.lang.ClassLoader的子类，而是由JVM自身实现的，由C++编写而成。因为JVM在启动的时候就自动加载它们，所以不需要在系统属性CLASSPATH中指定这些类库。

### Extension ClassLoader 扩展类加载器

**扩展类加载器，它负责加载JRE的扩展目录**（JAVA_HOME/jre/lib/ext或者由java.ext.dirs系统属性指定的）中的JAR包。这为引入除Java核心类以外的新功能提供了一个标准机制。因为默认的扩展目录对所有从同一个JRE中启动的JVM都是通用的，所以放入这个目录的JAR类包对所有的JVM和system classloader都是可见的。

### Application ClassLoader 系统类加载器

**系统类加载器**，它负责在JVM被启动时，加载来自在命令java中的-classpath或者java.class.path系统属性或者 CLASSPATH操作系统属性所指定的JAR类包和类路径。<br>可以通过静态方法`ClassLoader.getSystemClassLoader()`找到该类加载器。如果没有特别指定，则用户自定义的任何类加载器都将该类加载器作为它的父加载器。

## 3、ClassLoader的全盘负责和双亲委托机制

### 全盘负责(当前类加载器负责机制)

**全盘负责**是指当一个ClassLoader装载一个类时，除非显示地使用另一个ClassLoader，则该类所依赖及引用的其他类也由这个ClassLoader载入。"全盘负责"机制也可称为当前类加载器负责机制。

### 双亲委派

**双亲委派**是指子类加载器如果没有加载过该目标类，就先委托父类加载器加载该目标类，只有在父类加载器找不到字节码文件的情况下才从自己的类路径中查找并装载目标类。<br>**"双亲委派"机制加载Class具体流程：**

1. 源ClassLoader先判断该Class是否已经加载，如果已加载，则返回Class对象；如果没有加载，则委托给父类加载器
2. 父类加载器判断是否加载过该Class，如果已经加载，则返回Class对象；如果没有则委托给祖父类加载。
3. 以此类推，直到始祖类加载器（引用类加载器，是BootStrap ClassLoader）
4. 始祖类加载器判断是否加载过该Class，如果已加载，则返回Class对象；如果没有则尝试从其对应的类路径下寻找class字节码文件并载入，如果载入成功，则返回Class对象；如果载入失败，则委托给始祖类加载器的子类加载器。
5. 始祖类加载器的子类加载器尝试从其对应的类路径下寻找class字节码文件并载入，如果载入成功，则返回Class对象；如果载入失败，则委托给始祖类加载器的孙类加载器。
6. 以此类推，直到源ClassLoader。
7. 源ClassLoader尝试从其对应的类路径下寻找class字节码文件并载入，如果载入成功，则返回Class对象；如果载入失败，源ClassLoader不会再委托其子类加载器，而是抛异常ClassNotFoundException。

### 如何打破双亲委派机制

"双亲委派"机制只是Java推荐的机制，并不是强制的机制。我们可以继承java.lang.ClassLoader类，实现自己的类加载器。如果想保持双亲委派模型，就应该重写`findClass(name)`方法；如果想破坏双亲委派模型，可以重写`loadClass(name)`方法。

### 为什么要使用双亲委托这种机制？

1. **避免重复加载类**

当父加载器已经加载了该类，子ClassLoader就没有必要再加载一次了

2. **安全性**

如果不使用这种双亲委托机制，那我们就可以随时使用自定义的String来动态替代Java核心API中定义的String类，这样会存在非常大的安全隐患，而双亲委托机制，就可以避免这种情况，因为String类以及在启动时就被引导类加载器（Bootstrap ClassLoader）加载了，所以用户自定义的ClassLoader永远也无法加载一个自己写的String类，除非你改变了JDK中ClassLoader搜索类的默认算法。

## ClassLoader cache机制

类加载还采用了cache机制：如果cache中保存了这个Class就直接返回它，如果没有才从文件中读取和转换成Class，并存入cache，这就是为什么修改了Class但是必须重新启动JVM才能生效,并且类只加载一次的原因

## 类加载加载class触发时机？

1. new关键字
2. getstatic
3. putstatic
4. invokestatic

**类加载场景**：

- new关键字实例化对象
- 调用类的静态字段，调用类的静态方法；使用java.lang.reflect中的方法对类进行反射调用
- 初始化一个类时，发现其父类还未初始化
- 初始化主类(包含main方法的类)

## JVM之class加载过程

![image.png|500](https://cdn.nlark.com/yuque/0/2022/png/694278/1671207947140-35ca041e-6c9a-40f4-8b17-0f961a0b7dec.png#averageHue=%23fefefd&clientId=u0e786c22-4665-4&from=paste&height=290&id=u0d2eb479&originHeight=691&originWidth=1380&originalType=binary&ratio=1&rotation=0&showTitle=false&size=147360&status=done&style=none&taskId=uf787af15-e166-446f-a098-3eee05a71f3&title=&width=580)

- **Loading**<br>类的信息从文件中获取并且载入到JVM的内存里
- **Verifying**<br>检测读入的结构是否符合JVM规范的描述
- **Preparing**<br>分配一个结构用来存储类信息
- **Resolving**<br>把这个类的常量池中的所有的符号引用改变成直接引用
- **Initializing**<br>执行静态初始化程序，把静态变量初始化成指定的值

详情见 [[JVM加载class文件]]

# 类加载器相关面试题

## ClassLoader题目怎么答？

1. 什么是ClassLoader?
2. Java中的ClassLoader
3. Android中的ClassLoader
4. ClassLoader的触发时机
5. ClassLoader双亲委派机制
6. 如何打破双亲委派机制

重写loadClass()方法，保留双亲委派机制重写findClass()方法

## 如何判断两个class是相同的？

JVM判断两个class是否相同，不仅要判断两个类名是否相同，而且要判断是否由同一个类加载器实例加载的，只有两者同时满足的情况下，JVM才认为这两个class是相同的。就算两个Class是同一份class字节码，如果被两个不同的ClassLoader实例所加载，JVM也会认为它们是两个不同的Class对象。

1. 全路径类名相同
2. 相同的ClassLoader加载

## 类的加载过程，Person person = new Person()为例进行说明

1. 因为new用到了Person.class，所以会先找到Person.clas文件，并加载到内存中
2. 执行该类中的static代码块，如果有的话，给Person.class类进行初始化
3. 在堆内存中开辟空间，分配内存地址
4. 在堆内存中建立对象的特有属性，并进行默认初始化
5. 对属性进行显示初始化
6. 对对象进行构造代码块初始化
7. 对对象进行与之对应的构造函数初始化
8. 将内存地址赋值给栈内存中的person变量<br>
