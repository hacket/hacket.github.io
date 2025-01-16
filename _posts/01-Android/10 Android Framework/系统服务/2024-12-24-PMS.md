---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# Android apk

## apk包编译流程

![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1655785715919-1fb4f7b5-3d1e-4d82-8646-eaeb97151285.webp#averageHue=%23fbfbfb&clientId=u4b8a14ca-98b9-4&from=paste&id=ub8ea8f3d&originHeight=882&originWidth=536&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1514da89-43cc-4436-9ecb-2d249b1ca99&title=)

### 1、Java文件编译成.class文件 javac

#### 打包资源文件，生成R.java文件

**工具：aapt(The Android Asset Packing Tool)**

1. res目录下资源文件(layout/drawable/color等)都会编译，然后生成相应的R.java
2. AndroidManifest.xml会被aapt编译成二进制。
3. aapt工具会对资源文件进行编译，并生成一个resource.arsc文件，resource.arsc文件相当于一个文件索引表，记录了很多跟资源相关的信息。

#### 处理aidl文件，生成相应的Java文件

**工具：aidl（Android Interface Definition Language）**<br />aidl工具解析接口定义文件然后生成相应的Java代码接口供程序调用。

#### 编译项目源代码，生成class文件

**工具：Java编译器（javac）**<br />项目中所有的**Java代码**，包括**R.java**和**.aidl**文件，都会变Java编译器（javac）编译成.class文件，生成的class文件位于工程中的bin/classes目录下。

### 2、转换所有的class文件，生成classes.dex文件 dex工具

**工具：dx（dex）**<br />生成可供Android系统Dalvik虚拟机执行的classes.dex文件<br />任何第三方的libraries和.class文件都会被转换成.dex文件。dx工具的主要工作是将Java字节码转成 Dalvik字节码、压缩常量池、消除冗余信息等。

> Gradle Transform工作在这一阶段

### 3、打包生成APK文件 apkbuilder

**工具：apkbuilder**<br />所有没有编译的资源，如images、assets目录下资源（该类文件是一些原始文件，APP打包时并不会对其进行编译，而是直接打包到APP中，对于这一类资源文件的访问，应用层代码需要通过文件名对其进行访问）；<br />编译过的资源和.dex文件都会被apkbuilder工具打包到最终的.apk文件中。

### 4、对APK文件进行签名 jarsigner

**工具：jarsigner**<br />一旦APK文件生成，它必须被签名才能被安装在设备上。

### 5、对签名后的APK文件进行对齐处理 zipalign

**工具：zipalign**<br />对齐的主要过程是将APK包中所有的资源文件距离文件起始偏移为4字节整数倍，这样通过内存映射mmap访问apk文件时的速度会更快。对齐的作用就是减少运行时内存的使用。

## apk安装流程

安装其实就是把apk文件拷贝到对应的目录。

1. 复制apk到/data/app目录下，解压并扫描安装包
2. 资源管理器解析apk里的资源文件
3. 解析Manifest文件，并在/data/data目录下创建对应的应用数据目录
4. 然后对dex文件进行优化（Dalvik会将dex处理成odex，ART会将dex处理成oat，oat包含dex和安装时编译的机器码），并保存在dalvik-cache目录
5. 将Manifest文件解析出的四大组件信息注册到PMS中
6. 安装完成后，发送广播

# PMS

## 什么是PMS？

PackageManagerService（简称PMS），包管理服务，是Android系统核心服务之一。负责应用程序的安装，卸载，信息查询等工作。<br />**包管理机制**<br />包指的是**Apk**、**jar**和**so文件**等等，它们被加载到Android内存中，由一个包转变成可执行的代码，这就需要一个机制来进行包的加载、解析、管理等操作，这就是**包管理机制**。

## PMS主要功能

1. 解析Manifest文件，解析清单中所有节点信息（主要是包括四大组件）
2. 扫描apk文件，安装系统应用，安装本地应用等
3. 管理本地应用，安装、卸载和应用信息查询等

## PMS初始化流程

初始化分为5个阶段：

1. BOOT_PROGRESS_**PMS_START**阶段
   - 构造Settings类：这个是Android的全局管理者，用于协助PMS保存所有的安装包信息;
   - 保存Installer对象；
   - 初始化SystemConfig，获取系统配置信息，包括全局属性、groupid以及系统权限。初始化一些功能类，包括：PackageDexOptimizer （dex优化工具类） 、 DexManager（dex管理类）、PackageHandler（建立package相关操作的消息循环）等；
   - 创建data下的各种目录，比如data/app, data/app-private等。
2. BOOT_PROGRESS_**PMS_SYSTEM_SCAN_START**阶段
   - 通过scanDirTracedLI扫描系统目录文件，包括：/system/framework 、/system/priv-app 、/system/app 这俩都是放系统app、/vendor/overlay、/vendor/app、oem/app。
3. BOOT_PROGRESS_**PMS_DATA_SCAN_START**阶段
   - 通过scanDirTracedLI扫描/data/app和/data/app-private目录下的文件。
4. BOOT_PROGRESS_**PMS_SCAN_END**阶段
   - 将上述信息写回/data/system/packages.xml。
5. BOOT_PROGRESS_**PMS_READY**阶段
   - 创建服务PackageInstallerService。

# PMS面试题
