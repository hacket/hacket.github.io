---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# 65535问题（64K问题）

出现这个问题的根本原因是在 DVM 源码中的 MemberIdsSection.java 类中，有如下一段代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1194086/1654667711312-d5dbee50-1a29-4a18-9814-63306d142a71.png#averageHue=%232c2f32&clientId=u26c407f9-00a0-4&from=paste&id=u87853f1e&originHeight=414&originWidth=1236&originalType=url&ratio=1&rotation=0&showTitle=false&size=79668&status=done&style=none&taskId=uce3e35e7-618e-4732-8d4d-9ce2399e94b&title=)<br />如果 items 个数超过 DexFormat.MAX_MEMBER_IDX 则会报错，DexFormat.MAX_MEMBER_IDX 的值为 65535，items 代表 dex 文件中的方法个数、属性个数、以及类的个数。也就是说理论上不止方法数，我们在 java 文件中声明的变量，或者创建的类个数如果也超过 65535 个，同样会编译失败，Android 提供了 MultiDex 来解决这个问题。很多网上的文章说 65535 问题是因为解析 dex 文件到数据结构 DexFile 时，使用了 short 来存储方法的个数，其实这种说法是错误的！<br />解决：MultiDex

# Multidex分包技术

## 1、分包的原因？

64K的问题，dex的items超过了DexFormat.MAX_MEMBER_IDX即65535限制（items代表有方法个数、属性个数、类的个数等）

## 2、解决

用multidex

## 3、MultiDex实现原理

1. MultiDex工作流程分为2个部分，一个部分是打包构建apk的时候，将dex文件拆分若干个小的dex文件
2. 另外一个部分是在启动apk的时候，同时加载多个dex文件（具体是加载Dex文件优化后的odex文件，不过文件名还是.dex），这一部分工作从Android5.0开始系统已经帮我们做了，但是Android5.0之前还是需要通过MultiDex库来支持。

## 4、Multidex的局限性

1. Application Not Responding 如果第二个（或其他个）dex文件很大的话，安装.dex文件到data分区时可能会导致ANR（应用程序无响应）,此时应该使用ProGuard减小DEX文件的大小
2. 由于Dalvik linearAlloc的bug的关系，使用了multidex的应用可能无法在Android 4.0 (API level 14)或之前版本的设备上运行

## 如何手动分包？

#

# 插件化和热修复

## 热修复

## 热修复原理

### 1、ARTMethod

AndFix

## 2、dex替换

Nuwa，Tinker

## 3、**InstantRun**

代表就是美团的Robust

## Tinker原理

1. 使用DexClassLoader加载补丁包的dex文件
2. 通过反射获取DexClassLoader类的pathList(DexPathList)，再次通过反射获得dexElements数组。
3. 获取加载应用类的PathClassLoader，同样通过反射获取它的dexElements数组。
4. 合并两个dexElements数组，且将补丁包的dex文件放在前面。

> 根据类加载机制，一个类只会被加载一次，DexPathList.findClass方法中是顺序遍历数组，所以将补丁的dex文件放在前面，这样bug修复类会被优先加载，而原来的bug类不会被加载，达到了替换bug类的功能（补丁包中的修复类名、包名要和bug类相同）

5. 再次通过反射将合并后的dexElements数组赋值给PathClassLoader.dexElements属性。

## 插件化

### 1、占坑式原理

1. 占坑Activity
2. hook Instrumention
3. 替换占坑Activity

## 插件化和热修复对比

插件化和热修复的原理，都是动态加载 dex／apk 中的类／资源，两者的目的不同。插件化目标在于加载 activity 等组件，达到动态下发组件的功能，热修复目标在修复已有的问题。目标不同，也就导致其实现方式上的差别。由于目标是动态加载组件，所以插件化重在解决组件的生命周期，以及资源的问题。而热修复重在解决替换已有的有问题的类／方法／资源等。
