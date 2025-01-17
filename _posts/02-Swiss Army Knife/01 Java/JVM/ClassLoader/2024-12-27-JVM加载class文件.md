---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
dg-publish: true
---

# 类加载机制

JVM如何加载class文件？Class文件中的信息进入到虚拟机后会发生什么变化？<br>虚拟机把描述类的数据从Class文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的Java类型，这就是虚拟机的_类加载机制_。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558418078-33584c6f-fcf0-4ec7-af36-cd7e0796e9dd.png#averageHue=%23f6f6f5&clientId=u135e0cf0-7c1c-4&from=paste&id=u2fe5a798&originHeight=249&originWidth=766&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=udb6e8223-2704-4f7e-923b-ca2aae3c36f&title=)

# 何时加载class?

1. 遇到`new`、`getstatic`、`putstatic`或`invokestatic`这4条字节码指令时，如果类没有进行过初始化，则需要先触发初始化

> 场景：new 实例化对象时候、读取或设置一个类的静态字段的时候，以及调用一个类的静态方法的时候。

2. 使用`java.lang.reflect`包的方法对类进行反射调用的时候，如果类没有进行过初始化，则需要先触发期初始化
3. 当初始化一个类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化
4. 当虚拟机启动时，用户需要指定一个要执行的主类（包含main()方法的那个类），虚拟机会先初始化这个主类。
5. 当使用JDK1.7的动态语言支持的，如果一个`java.lang.invoke.MethodHandle`实例最后的解析结果`REF_getStatic`、`REF_putStatic`、`REF_invokeStatic`的方法句柄，并且这个方法句柄所对应的类没有进行初始化，则需要先触发其初始化。

# 类加载过程

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558434589-8c2583ad-c374-48cb-ba88-e23d88b4f7d3.png#averageHue=%23fefefd&clientId=u135e0cf0-7c1c-4&from=paste&id=u471b4c9d&originHeight=477&originWidth=925&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9f7919f1-1302-4ed7-b0b1-5906c7b13a1&title=)

- Loading<br>类的信息从文件中获取并且载入到JVM的内存里
- Verifying<br>检测读入的结构是否符合JVM规范的描述
- Preparing<br>分配一个结构用来存储类信息
- Resolving<br>把这个类的常量池中的所有的符号引用改变成直接引用
- Initializing<br>执行静态初始化程序，把静态变量初始化成指定的值

## Loading 加载

在该阶段，虚拟机需要完成以下3件事情：

1. 通过一个类的全限定名来获取定义此类的二进制字节流
2. 将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构
3. 在内存中生成一个代表这个类的java.lang.Class对象，作为方法区这个类的各种数据的访问入口

获取类的二进制字节流是开发人员可控性最强的，开发人员可以定义自己的类加载器去控制字节流的获取方式（重写loadClass()方法）。

数组类加载：

1. 如果数组的组件类型是引用类型，则递归加载这个组件类型，数组将在加载该组件类型的类加载器的类名称空间上被标识
2. 如果数组的组件类型不是引用类型(如int[]数组)，Java虚拟机将会把数组标记与引导类加载器关联
3. 数组类的可见性与它的组件类型的可见性一致，如果组件类型不是引用类型，那数组类的可见性将默认为public。

## Verifying 验证

验证是连接阶段的第一步，这阶段的目的是为了确保Class文件的字节流中包含的信息符合当前虚拟机的要求，并且不会危害虚拟机自身的安全。

1. 文件格式验证
2. 元数据验证
3. 字节码验证
4. 符号引用验证

## Preparing 准备

准备阶段是正式为类变量**分配内存**并**设置类变量初始值**的阶段，这些变量所使用的内存都将在**方法区**中进行分配。<br>![](https://note.youdao.com/yws/res/71330/793B082A1D4D41038992D35165617702#id=rmov1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693558464424-6c380c44-dfd5-4f2f-a8c5-946df82340da.png#averageHue=%23fafaf9&clientId=u135e0cf0-7c1c-4&from=paste&id=u481b3ed6&originHeight=390&originWidth=631&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud2e507c0-7cb9-46f5-9e00-6b1ea708552&title=)

## Resolving 解析

解析阶段是虚拟机将常量池内的**符号引用**替换为**直接引用**的过程。

1. **符号引用**:以一组符号来描述所引用的目标，符号可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可。
2. **直接引用**:可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。
   - 类或接口的解析
   - 字段解析
   - 类方法解析
   - 接口方法解析

## Initializing 初始化

初始化阶段是执行类构造器`<clinit>()`方法的过程
