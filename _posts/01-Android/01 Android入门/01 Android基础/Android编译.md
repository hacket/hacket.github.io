---
date created: Wednesday, June 26th 2024, 8:07:00 pm
date updated: Saturday, January 4th 2025, 12:29:34 am
title: Android编译
dg-publish: true
image-auto-upload: true
feed: show
format: list
layout: post
categories: [Android]
aliases: [Android 编译]
linter-yaml-title-alias: Android 编译
---

# Android 编译

## 简易编译流程

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687880845501-1410c349-ca53-4de3-b728-20f71cb92c8a.png#averageHue=%23f7f7f7&clientId=ub5c543ad-b8e9-4&from=paste&id=u789fba26&originHeight=882&originWidth=536&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6f6d2857-bec2-400b-b92c-8892c33f289&title=)

## 完整编译流程

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687880857410-a5499703-5139-4691-8470-2f3028409aa9.png#averageHue=%23f2ece4&clientId=ub5c543ad-b8e9-4&from=paste&id=u9f7b4c45&originHeight=1083&originWidth=993&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0d7c1a5c-e21d-42a4-81ca-804414155d5&title=)

# D8 和 R8

## 早期 Android 生成 apk 过程

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1678115007880-4ab6ff29-d347-4f40-9de8-b1a4daf3ae2e.webp#averageHue=%23f7eae6&clientId=u9baf7878-93c1-4&from=paste&height=127&id=u3771b567&originHeight=347&originWidth=1710&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=udd376641-4f88-433b-9ce0-e8d6981a186&title=&width=626.3333740234375)

- javac：将.java 文件编译成.class 文件
- desugar：用于将 Java8 的特性在 Android 平台上适配
- Proguard：用于剔除无用的 Java 代码并做一些优化
- dx：将所有的 Java 代码转换为 dex 格式

## D8 和 R8 引入

Android Studio 3.x 后，引入了 D8 Dex 编译器和 R8 混淆压缩工具。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678114844277-e782e7f5-c7dc-40f7-8ad5-781a16f86cb3.png#averageHue=%23fafaf9&clientId=u9baf7878-93c1-4&from=paste&height=213&id=u164f8e69&originHeight=319&originWidth=740&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=17905&status=done&style=none&taskId=u60b4b457-31e6-4e53-bb19-cdc1b05dcc3&title=&width=493.3333333333333)

### D8

D8 编译器特点：

- 编译更快、时间更短
- DEX 编译时占用内容更小
- .dex 文件大小更小
- D8 编译的.dex 文件拥有相同或是更好的运行时性能

### R8

AS3.2 引入 R8 替换 Proguard，用于代码压缩 (shringking) 和混淆 (obfuscation)。

### AS3.4 D8 和 R8 合并

在 Android Studio 3.4 版本中，R8 把 desugaring、shrinking、obfuscating、optimizing 和 dexing 都合并到一步进行执行。在 Android Studio 3.4 以前的版本编译流程如下：<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1678115067018-ed684d1c-6969-4f80-be0e-2b73339ec90f.webp#averageHue=%23f7eae6&clientId=u9baf7878-93c1-4&from=paste&height=123&id=ufe5b679a&originHeight=347&originWidth=1710&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u85318f44-a241-4a9d-8f03-e1ebf5d9da9&title=&width=607.3333740234375)<br />合并之后编译流程如下：<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1678115046431-c8cfafbe-353a-491d-ab51-048a94e54c90.webp#averageHue=%23f7ede9&clientId=u9baf7878-93c1-4&from=paste&height=141&id=u329b1cae&originHeight=448&originWidth=1712&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6bfcc00b-6db3-453b-a9ea-85ef56b09c3&title=&width=540)

### 脱糖

脱糖用于在 Android 中支持 Java8 部分特性
