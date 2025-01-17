---
date created: 2024-12-26 00:25
date updated: 2024-12-26 00:25
dg-publish: true
---

# FlutterBoost简介

## FlutterBoot是什么？

FlutterBoost 是阿里系闲鱼技术团队开源的 Flutter 插件，它可以轻松为现有原生应用程序提供 Flutter 混合集成方案。其理念是将 Flutter 像 WebView 那样来使用。FlutterBoost 帮开发者处理 Native 与 Flutter 页面的映射和跳转，开发者只需关心页面的名字和参数即可 ( 通常可以是 URL ) 。可以让一个成熟的原生 APP 项目，在不用推翻重做的前提下，方便快捷的开始 Flutter 混合开发，几乎不影响原有的 Native 项目。同时 FlutterBoost 也是在 Flutter 官方提供的混合开发解决方案上探索出来的最优解，并已在闲鱼 APP 线上环境中运用，承受着亿级用户量的检测，稳定性值得肯定。

## FlutterBoost优点

- 官方的集成方案有诸多弊病，eg：日志不能输出到原生端、存在内存泄漏的问题、资源冗余……
- FlutterBoost 的通道的封装使得 Native 调用 Flutter 、Flutter 调用 Native 的开发更加简便
- FlutterBoost 对于页面生命周期的管理，也梳理的比较整齐
- FlutterBoost 为阿里出品，已在闲鱼生产环境中使用，正稳定为亿级用户提供服务

# [Flutter Boost集成](https://github.com/alibaba/flutter_boost/blob/master/docs/install.md)

## dart部分

1. 在flutter_module中添加依赖

```yaml
dependencies:
  flutter_boost:
    git:
      url: 'https://github.com/alibaba/flutter_boost.git'
      ref: '4.4.0'
```

flutter pub get

## Android部分

## 集成问题

### flutter_booster module找不到

1. 是否在pubspec.yaml声明了依赖
2. 是否在错误的位置声明了依赖
