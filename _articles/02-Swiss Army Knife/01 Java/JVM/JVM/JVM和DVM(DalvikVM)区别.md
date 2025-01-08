---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:43
dg-publish: true
---

# JVM和DVM(DalvikVM)区别

## JVM和DVM的区别

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584336251-5efed75b-bfe9-483e-a6b1-fe4748563f53.png#averageHue=%23f7f7f7&clientId=u178b7559-5ba9-4&from=paste&id=u1ef577df&originHeight=889&originWidth=964&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf1a83e0e-2b32-4d95-b6f7-6c6d50a51e4&title=)

### 执行的文件格式不同

JVM运行的是class字节码文件，而dvm运行自己定义的dex文件格式

### 是否可以同时存在多个虚拟机

JVM只能同时存在一个实例；dvm可同时存在多个实例（好处是，其他dvm挂了，不会影响其他应用，保证了系统稳定性）

### Java VM是以基于栈的虚拟机(Stack-based)；而Dalvik是基于寄存器的虚拟机(Register-based)

- JVM设计成基于栈架构：
  1. 基于栈架构的指令集更容易生成
  2. 节省资源。其零地址指令比其他指令更加紧凑
  3. 可移植性。
- DVM为什么基于寄存器
  1. Android手机制造商的处理器绝大部分都是基于寄存器架构的
  2. 栈架构中有更多的指令分派和访问内存，这些比较耗时。所有相对来认为dvm的执行效率更高一些。
  3. DVM就是为android运行而设计的，无需考虑其他平台的通用

### 类加载的系统与JVM区别较大

## DVM设计规则

- 每一个app都运行在自己的dvm实例中与应用隔离
- 启动一个app进程，一个dvm就诞生了，该app下代码在该dvm实例下解释运行
- 有几个app进程，就有几个dvm实例
- dvm对对象生命周期(组件生命周期理解)、堆栈、线程、异常以及垃圾回收进行管理
- 不支持j2se和j2me的api，也就不支持awt和swing(现在用的也非常少)

## DVM与ART区别

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584351246-a90eb6c9-a532-426c-b28c-67f8e8d2c2d6.png#averageHue=%23f8f7f6&clientId=u178b7559-5ba9-4&from=paste&id=u1ef18db6&originHeight=916&originWidth=1040&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u86b19b79-6c05-4286-8aba-64aa4893673&title=)

### JIT和AOT区别

DVM使用JIT来将字节码转换成机器码，效率低；ART采用了AOT预编译技术，执行速度更快。所以ART会占用更多的应用安装时间和存储空间

#### JIT

JIT 是Just-In-Time Compiliation的缩写，中文为即时编译。就是JAVA在运行过程中，如果有些动态极度频繁的被执行或者不被执行，就会被自动编译成机器码，跳过其中的部分环节。

1. Java源码通过编译器转为平台无关的字节码（bytecode）或Java class文件。
2. 在启动Java应用程序后，JVM会在运行时加载编译后的类并通过Java解释器执行适当的语义计算。
3. 当开启JIT时，JVM会分析Java应用程序的函数调用并且（达到内部一些阀值后）编译字节码为本地更高效的机器码。JIT流程通常为最繁忙的函数调用提供更高的优先级。
4. 一旦函数调用被转为机器码，JVM会直接执行而不是“解释执行”

流程图：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693584364010-bc82032a-be41-4e9f-8d2b-d5c23ece6c44.png#averageHue=%23f5f5f5&clientId=u178b7559-5ba9-4&from=paste&id=ud6908e39&originHeight=537&originWidth=330&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u809ac344-9e00-4f71-874e-64485eab938&title=)

> 其实就是省略了JVM加载class文件，将class文件解释成二进制机器码的一个过程。

#### AOT
