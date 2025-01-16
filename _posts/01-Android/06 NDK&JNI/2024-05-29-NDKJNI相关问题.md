---
date created: 2024-05-29 00:43
date updated: 2024-12-24 00:34
dg-publish: true
---

# JNI基础

## JNI流程

## JNI中如何调用Java代码？

JNI调用Java中的代码过程有点类似Java中的反射

1. 获取jclass对象，为了能够在C/C++中调用Java中的类，jni.h的头文件专门定义了jclass类型表示Java中Class类
2. 获取属性方法
3. 构造一个对象

## Cmake

在Android Studio 2.2及以上，构建原生库的默认工具是CMake。

CMake是跨平台的构建工具，可以用简单的语句来描述所有平台的编译过程。能够输出各种各样的makefile或者project文件。CMake不直接构建出最终的软件，而是产生其他工具的脚本（如makefile），然后再依据这个工具的构建方式使用。

CMake是一个比make更高级的编译配置工具，它可以根据不同的平台、不同的编译器，生成相应的makefile或vcproj项目，从而达到跨平台的目的。Android Studio利用CMake生成的是ninja。ninja是一个小型的关注速度的构建系统。我们不需要关心ninja的脚本，知道怎么配置CMake就可以了。

CMake其实是一个跨平台的支持产出各种不同的构建脚本的一个工具。

# 面试题

## JNI

### JNI多线程问题？内存泄漏问题？

Native 多线程中，需要用全局引用，用完调用 `DeleteGlobalRef` 删除引用，否则会内存泄漏。
