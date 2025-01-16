---
date created: 2024-12-27 23:45
date updated: 2024-12-27 23:45
dg-publish: true
---

## KCP和KSP？

### 什么是KCP？

**Kotlin Compiler Plugin(KCP)** 在 kotlinc 过程中提供 hook 时机，可以再次期间解析 AST、修改字节码产物等，Kotlin 的不少语法糖都是 KCP 实现的，例如`data class`、`@Parcelize`、`kotlin-android-extension` 等, 如今火爆的 Compose 其编译期工作也是借助 KCP 完成的。<br>![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1668954749036-ff12122c-b65b-4a9e-9d37-e77aadc4adea.webp#averageHue=%23353535&clientId=u190f6f70-2d28-4&from=paste&height=370&id=u0b34fabd&originHeight=855&originWidth=1252&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4653f45f-2304-4174-b453-01134b1f2c8&title=&width=541.3333740234375)

### KAPT、KSP和KCP区别？

**KAPT**<br>默认情况下kotlin使用kapt处理注解，kapt没有专门的注解处理器，需要借助apt来实现，因此需要先生成apt可解析的stub（Java代码），这就拖慢了kotlin的整体编译速度<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1668956926677-247c5da8-7a34-4592-8231-dee7c5d610ca.png#averageHue=%23f3f2ea&clientId=u190f6f70-2d28-4&from=paste&height=417&id=c9pfY&originHeight=625&originWidth=2412&originalType=binary&ratio=1&rotation=0&showTitle=false&size=376018&status=done&style=none&taskId=u8e3f4603-d38d-4dca-b5a3-3edba046bac&title=&width=1608)

> 从上面这张图其实就可以看出原因了，KAPT处理注解的原理是将代码首先生成Java Stubs，再将Java Stubs交给APT处理的，这样天然多了一步，自然就耗时了
> 同时在项目中可以发现，往往生成Java Stubs的时间比APT真正处理注解的时间要长，因此使用KSP有时可以得到100%以上的速度提升
> 同时由于KAPT不能直接解析Kotlin的特有的一些符号，比如data class，当我们要处理这些符号的时候就比较麻烦，而KSP则可以直接识别Kotlin符号

**KSP**

- KSP用来替换KAPT的，去掉生成JavaStubs过程，只能生成代码，不能修改已有代码
- KSP是对KCP的轻量封装，降低KCP的使用成本
- KSP编译速度比KAPT快2倍

**KCP**

1. KCP功能强大，不仅可以生成代码，还可以通过修改IR或者修改字节码等方式修改已有的代码逻辑；比如`kotlin-android-extention`插件就是一个编译器插件，通过控件id获取对应的view
2. KCP具有优秀的IDE支持
3. KCP的能力是KSP的超集，可以替代KSP/KAPT
4. KCP的开发成本太高，涉及Gradle Plugin、Kotlin Plugin等， API涉及一些编译器知识
