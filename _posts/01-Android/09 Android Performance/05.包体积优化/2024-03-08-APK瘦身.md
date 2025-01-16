---
date created: 2024-03-08 00:41
date updated: 2024-12-24 00:38
dg-publish: true
---

# APK瘦身预研

## APK瘦身的原因

**1、下载转化率**<br>现在很多大型的 **App** 一般都会有一个 **Lite** 版本的 **App**，这个也是出于下载转化率方面的考虑。<br>**2、应用市场**<br>**Google Play** 应用市场强制要求超过 **100MB** 的应用只能使用 **APK 扩展文件方式** 上传。
`aab` 格式（**Android App Bundles**）<br>**3、渠道合作要求**<br>越大的 App 其单价成本也会越高。百度浏览器包体积严格控制在5M 内，5M 是红线，超过5M 发版要总监审批<br>**4、包过大对 App 性能影响**

1. 安装时间过长
2. 运行时内存占用过大
3. ROM空间占用过大

## APK瘦身目标

1. DuBrowser，明确了包体积要在5M以内，超过5M红线发版本需总监审批
2. Shein，AAB 包不要超过 300M

# APK分析工具

Android Studio 自带的 `Analyze APK` 来做的包体积分析，主要就是做了代码、资源、So 等三个方面的重点优化。

# APK优化思路

## APK的组成

将APK拖到Android Studio中查看APK中的内容了<br>![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1655657868166-b055280b-8037-4442-9210-de09f568ea85.webp#averageHue=%23404347&clientId=ubbec0c0f-062a-4&from=paste&id=z0PHR&originHeight=334&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&taskId=u2b0d6e84-188f-4dd2-a7c9-1f44a00ffe3&title=)

1. lib

> so和aar文件

2. res资源文件

> drawable、layout、color、raw等资源文件夹

3. assets

> 一些资源，礼物动画mp4资源、svga资源等

4. classesX.dex 类

> Java代码编译成的class，通过dex工具处理成的dex文件

5. 其他

根据apk的组成可知，占用apk比较大的主要是`资源(res)`、`代码(classesX.dex)`和`so(lib)`这三方面优化

### APK分析工作

apk压缩包按照资源文件类型分类，主要有：so资源（程序运行依赖的库，如接入UC浏览器内核SDK时，引入的so达到惊人的12M）、图片资源（png、webp、jpg等）、Java代码（dex文件）、xml代码这几类，此外还可横向统计flutter相关资源情况。<br>由于可以拿到单个文件的信息，所以我们开发了工具解析apk包中的内容，从文件类型角度分析包资源占比情况，以及将资源文件按照大小排序展示，并以图表形式直观告诉开发资源情况

## 1、res目录：资源优化

### 图片资源远程下发？

利用Fresco预下载图片接口下载到本地

### 1.1 图片资源优化

1. 只保留一套UI设计的图
2. png压缩，之前用py脚本，发版本前会扫描app内所有大于5k的图片给压缩下
   1. py脚本工具
   2. [TinyPngPlugin Gradle插件](https://github.com/Deemonser/TinyPngPlugin)
3. webp替换png
4. 用小的.9图拉伸，替换大图

### 1.2 无用资源的移除

- lint工具扫描无用的资源
- 指定语言：无用语言资源的移除

> 通过gradle的`resConfig  "zh","ar"`，只保留必须的语言资源

- 移除了项目当中冗余的资源文件，重复资源
- shrinkResources删除无引用资源

### 1.3 资源的混淆

#### apk资源混淆：AndResGuard

AndResGuard微信开源的资源混淆插件，将冗余的资源名称换成简短的名字如abc，资源压缩的效果要比代码瘦身的效果要好的多。

#### aab资源混淆：aabResGuard

### Layout 二进制文件裁剪优化

> si裁剪有有个700K优化空间

- [ ] [包体积：Layout 二进制文件裁剪优化｜得物技术](https://mp.weixin.qq.com/s?__biz=MzkxNTE3ODU0NA==&mid=2247504706&idx=1&sn=3b012ea0bb71873ea12b7802e2366302&chksm=c161861df6160f0bb4ade47688d6b1fdd4d40a605702be75a47fb050ebda24571b8e749ee66f&scene=0&xtrack=1&version=4.1.6.90701&platform=mac#rd)

### Json 文件压缩

原理就是在编译过程中找到 `merged_assets` 这个文件夹：去掉空格和换行

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/企业微信截图_2a8b74e5-b35e-4279-92ed-337287dd8b4e.png)

- 差不多 assets 能减少 600多K

- 最终打包到 apk 也就 40 KB 左右

- <https://github.com/hacket/GradlePluginDemos/tree/master/GradlePlugin8.0-Kotlin-New>

## 2、classesX.dex优化：代码优化

### 一个功能尽量用一个库

比如加载图片库，不要 glide 和 fresco 混用，因为功能是类似的，只是使用的方法不一样，用了多个库来做类似的事情，代码肯定就变多了。

### `Proguard`

- 代码混淆 使用 Proguard 工具进行了混淆，它将程序代码转换为功能相同，但是不容易理解的形式。比如说将一个很长的类转换为字母 a
- 更安全了

#### `proguard` 不保留行号

```shell
# Proguard中keep住源文件及行号
-keepattributes SourceFile,LineNumberTable
```

#### google 相关库  `proguard-rules` 优化

通过对工程中现有keep规则进行优化，以达到包体积优化的效果。

目前分析混淆规则中 `-keep class com.google.** { *; }`，keep 的范围过大

> 在 Shein App，删除以上规则后包体积收益1MB+

| SDK                                           | 混淆规则                                                                                                                                                                                                                                                                                                                     | 备注                                            |
| :-------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| `com.android.installreferrer:installreferrer` | `-keep public class com. Android. Installreferrer.** { *; }`                                                                                                                                                                                                                                                             | Google Play Store 获取安装 App 引荐来源相关信息 SDK       |
| `com.google.firebase:firebase-perf`           | `-keep class com.google.firebase.** { *; }`                                                                                                                                                                                                                                                                              | Firebase 性能监控                                 |
| `com.google.firebase:firebase-crashlytics`    | `-keep class com.google.firebase.** { *; }`                                                                                                                                                                                                                                                                              | 崩溃                                            |
| `com.google.firebase:firebase-messaging`      | `-keep class com.google.firebase.** { *; }`                                                                                                                                                                                                                                                                              | FCM                                           |
| `com.google.android.flexbox:flexbox`          | The FlexboxLayoutManager may be set from a layout xml, in that situation the RecyclerView<br>Tries to instantiate the layout manager using reflection.<br>This is to prevent the layout manager from being obfuscated.<br>`-keepnames public class com. Google. Android. Flexbox. FlexboxLayoutManager`                  | FlexBox 布局组件                                  |
| `com.google.android.play:core`                | \\                                                                                                                                                                                                                                                                                                                       | Google Play Store App 发布，App 更新，App 下载安装、动态下发 |
| `com.google.zxing`                            | ` -keep class com.google.zxing.** {*;}  <br>   -dontwarn com.google.zxing.**  `                                                                                                                                                                                                                                          | 二维码                                           |
| `com.google.code.gson:gson`                   | `-keepclassmembers class com.google.gson.**`  <br>` -keepclassmembers class com. Google. Gson.** { public private protected *; }  ` <br>` -keep @interface com. Google. Gson. Annotations. SerializedName   `<br>`-keepclassmembers class * {  <br>    @com. Google. Gson. Annotations. SerializedName <fields>;  <br>}` | Gson                                          |
| com.google.guava:guava                        |  [UsingProGuardWithGuava · google/guava Wiki (github.com)](https://github.com/google/guava/wiki/UsingProGuardWithGuava)                                                                                                                                                                                                  |                                               |
| com.google.auto: auto-common                  | \\                                                                                                                                                                                                                                                                                                                       | Google 编译时代码生成辅助工具库                           |
| ### R文件内联                                     |                                                                                                                                                                                                                                                                                                                          |                                               |
| 通过把R文件里面的资源内联到代码中，从而减少R文件的大小                  |                                                                                                                                                                                                                                                                                                                          |                                               |

- AGP3.6支持R文件的内联了

#### R文件产生

在Android编译打包的过程中，位于res/目录下的文件，就会通过aapt工具，对里面的资源进行编译压缩，从而生成相应的资源id，且生成R.java文件，用于保存当前的资源信息，同时生成resource.arsc文件，建立id与其对应资源的值

#### R文件结构

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1691917201264-2d3aaa41-7eea-405e-8b82-54189f0f863a.png#averageHue=%235f4631&clientId=u779d6fb1-ad11-4&from=paste&height=251&id=u9264eaf0&originHeight=1686&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=975974&status=done&style=stroke&taskId=uc94842f9-333a-4831-a36f-8be79f890aa&title=&width=223)<br>R.java 内部包含了很多内部类：如 layout、mipmap、drawable、string、id 等等，这些内部类里面只有 2 种数据类型的字段：

- public static final int
- public static final int[]

只有 **styleable** 最为特殊，只有它里面有 public static final int[] 类型的字段定义，其它都只有 int 类型的字段。

#### R 资源id表示

资源id用一个16进制的int数值表示。比如0x7f010000，我们来解释一下具体含义

1. 第一个字节7f：代表着这个资源属于本应用apk的资源，相应的以01代表开头的话（比如0x01010000）就代表这是一个与应用无关的系统资源。0x7f010000，表明abc_fade_in 属于我们应用的一个资源
2. 第二个字节01:是指资源的类型，比如01就代表着这个资源属于anim类型
3. 第三，四个字节0000:指资源的编号，在所属资源类型中，一般从0000开始递增

#### R文件冗余

Android 从 ADT 14 开始为了解决多个 library 中 R 文件中 id 冲突，所以将 Library 中的 R 的改成 static 的非常量属性。不能用switch-case。<br>在 apk 打包的过程中，module 中的 R 文件采用对依赖库的R进行累计叠加的方式生成。如果我们的 app 架构如下：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691916716961-98ab2303-a83d-41b5-9b4f-c159501f2020.png#averageHue=%23f8dfd0&clientId=u779d6fb1-ad11-4&from=paste&height=142&id=ubf01d9b7&originHeight=284&originWidth=440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=65443&status=done&style=stroke&taskId=ub9a971a0-15d0-4fc1-9946-dd42a713ab0&title=&width=220)<br>编译打包时每个模块生成的 R 文件如下：

- R_lib1 = R_lib1;
- R_lib2 = R_lib2;
- R_lib3 = R_lib3;
- R_biz1 = R_lib1 + R_lib2 + R_lib3 + R_biz1(biz1本身的R)
- R_biz2 = R_lib2 + R_lib3 + R_biz2(biz2本身的R)
- R_app = R_lib1 + R_lib2 + R_lib3 + R_biz1 + R_biz2 + R_app(app本身R)

在最终打成 apk 时,除了 R_app（因为 app 中的 R 是常量，在 javac 阶段 R 引用就会被替换成常量，所以打 release 混淆时，app 中的 R 文件会被 shrink 掉），其余module的 R 文件全部都会打进 apk 包中。这就是 apk 中 R 文件冗余的由来。而且如果项目依赖层次越多，上层的业务组件越多，将会导致 apk 中的 R 文件将急剧的膨胀。

> javac本身会对 static final 的基本类型做内联，也就是把代码引用的地方全部替换成常量；可以少了一次内存寻址，还可以删除内联后的R文件

**module R不是常量的原因**<br>避免了不同module之间资源名相同时导致的资源冲突

> 在 Android 中，我们每个资源 id 都是唯一的，因此我们在打包的时候需要保证不会出现重复 id 的资源。如果我们在 library module 就已经指定了资源 id，那我们就和容易和其他 library module 出现资源 id 的冲突。因此 AGP 提供了一种方案，在 library module 编译时，使用资源 id 的地方仍然采用访问域的方式，并记录使用的资源在 R.txt 中。在 application module 编译时，收集所有 library module 的 R.txt，加上 application module R 文件输入给 aapt，aapt 在获得全局的输入后，按序给每个资源生成唯一不重复的资源 id，从而避免这种冲突。但此时，library module 已经编译完成，因此只能生成 R.java 文件，来满足 library module 的运行时资源获取。

#### 不同版本AGP生成R文件的表现

keep R文件混淆规则

```
-keepattributes InnerClasses

-keep class **.R
-keep class **.R$* {
    <fields>;
}
```

##### AGP3.5.2 R文件

![AGP3.5生成的R文件](https://cdn.nlark.com/yuque/0/2023/png/694278/1691674334684-a8449e9b-0f62-4f8f-af41-620ed08ff296.png#averageHue=%23514c43&clientId=uc25a6e54-00e0-4&from=paste&height=445&id=u1b082ed7&originHeight=1354&originWidth=888&originalType=binary&ratio=2&rotation=0&showTitle=true&size=133515&status=done&style=stroke&taskId=u7ed215df-f86d-4f65-9783-23223ff7a63&title=AGP3.5%E7%94%9F%E6%88%90%E7%9A%84R%E6%96%87%E4%BB%B6&width=292 "AGP3.5生成的R文件")<br>AGP3.5先生成R.java，然后再编译成R.class<br>反编译后，也是能看到R文件的<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691674615989-d8b7a8df-de2c-48b0-b291-ceff887e46c9.png#averageHue=%23f4f2f2&clientId=uc25a6e54-00e0-4&from=paste&height=307&id=u293a3725&originHeight=910&originWidth=902&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101663&status=done&style=stroke&taskId=u1b43b660-7056-4f31-ab37-6624f4f405f&title=&width=304)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691757761240-95bb89a3-90b0-49a7-97c1-cf55751dfc70.png#averageHue=%232d2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=317&id=u94938f10&originHeight=634&originWidth=1766&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113543&status=done&style=stroke&taskId=u36e5575a-09b6-431c-a6dc-05132b1289b&title=&width=883)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691757836225-803f8937-f273-4a6b-a84c-16fbd89b2680.png#averageHue=%232c2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=475&id=u88a8ec36&originHeight=950&originWidth=1806&originalType=binary&ratio=2&rotation=0&showTitle=false&size=154323&status=done&style=stroke&taskId=u15b1fdf7-ca12-4899-9d26-0de45cbc654&title=&width=903)

- app的R替换成了常量
- library的R不是常量，未替换

##### AGP3.6 R文件

AGP3.6需要Gradle5.6.4+<br>![app模块的R.jar](https://cdn.nlark.com/yuque/0/2023/png/694278/1691675375936-e51e5650-5828-4717-9d5e-3547018ea1fd.png#averageHue=%23534d43&clientId=uc25a6e54-00e0-4&from=paste&height=251&id=u3186099e&originHeight=698&originWidth=928&originalType=binary&ratio=2&rotation=0&showTitle=true&size=91374&status=done&style=stroke&taskId=ubb216d33-c32c-4a30-bb1a-7bf23533aff&title=app%E6%A8%A1%E5%9D%97%E7%9A%84R.jar&width=334 "app模块的R.jar")<br>![mylibrary1的R.jar](https://cdn.nlark.com/yuque/0/2023/png/694278/1691675170826-b3444aea-ed18-44e7-bc99-94138bce7af4.png#averageHue=%234e4b42&clientId=uc25a6e54-00e0-4&from=paste&height=164&id=ubea880de&originHeight=446&originWidth=966&originalType=binary&ratio=2&rotation=0&showTitle=true&size=49954&status=done&style=stroke&taskId=ud22ecf79-2422-46a2-b7ee-68338cc9d67&title=mylibrary1%E7%9A%84R.jar&width=355 "mylibrary1的R.jar")<br>AGP 3.5.0 到 3.6.0 通过减少 R 生成的中间过程，来提升 R 的生成效率（先生成 R.java 再通过 Javac 生成 R.class 变为直接生成 R.jar）<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691757897019-e1909dac-a73e-46f0-94aa-e63c00f3cb66.png#averageHue=%232e2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=288&id=u98bd3709&originHeight=576&originWidth=1648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90522&status=done&style=stroke&taskId=uab6829e8-c4ca-4d47-b1dc-97e4f7fcdf5&title=&width=824)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691757933606-32d962db-98ec-4662-a0d5-a53126175543.png#averageHue=%232c2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=497&id=u36dfa22e&originHeight=994&originWidth=1788&originalType=binary&ratio=2&rotation=0&showTitle=false&size=163048&status=done&style=stroke&taskId=u168e7472-0e1c-4f1e-913a-a4182df46e4&title=&width=894)

##### AGP4.1 R文件

AGP4.1，需要Gradle6.5+<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691757956245-ac1e0cc9-b5fe-4a2e-a165-2c5c974b54d6.png#averageHue=%232b2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=494&id=u95067b44&originHeight=988&originWidth=1782&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158175&status=done&style=stroke&taskId=u92f14956-ee8e-44c4-8dac-385c0bfae8d&title=&width=891)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691760323144-1ac02a17-92ec-49a7-9997-102aa7729616.png#averageHue=%232c2b2b&clientId=u7c8f1298-a3e7-4&from=paste&height=481&id=ua3e01644&originHeight=962&originWidth=1784&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161699&status=done&style=stroke&taskId=ufe318559-dc44-4aa7-8661-acf8411f9ef&title=&width=892)<br>AGP4.1.0后，app和library的R都会替换成了常量

##### 小结

1. AGP3.5.2/3.6.0/4.1.0 app module中R都是常量，app module都会内联替换成常量
2. AGP3.5.2/AGP3.6.0，App的R替换成了常量，library还是R.xxx.xxx变量，不会替换
3. AGP3.5.2→3.6.0，相比3.5.2不会生成R.java，直接生成R.jar
4. AGP3.5.2和3.6.0，library的R
5. AGP4.1.0 是做了对 R 文件的内联，并且做的很彻底，不仅删除了冗余的 R 文件，并且还把所有对 R 文件的引用都改成了常量

|                                      | AGP3.5.2                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | AGP3.6.0                                                                                                                                                                                                                                                                                                                                                                                                                                                            | AGP4.1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 是否生成R.java                           | 是                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 否                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 否                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 生成R.java路径                           | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691895291795-cae1185b-c0a5-451c-81d0-a0ea9d2ac353.png#averageHue=%23534d43&clientId=uea5debb2-4d46-4&from=paste&height=77&id=uf451b6f9&originHeight=480&originWidth=616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39977&status=done&style=stroke&taskId=u7f5a71b3-2c30-4c24-8f9a-9206ba47e84&title=&width=99)<br>生成R.java                                                                   | 不生成                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 不生成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| app R.class/R.jar?                   | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691906774280-e25a625f-43a3-42c7-859c-93bb94ab4d8c.png#averageHue=%23f1f1f0&clientId=uea5debb2-4d46-4&from=paste&height=443&id=c31Wp&originHeight=886&originWidth=1520&originalType=binary&ratio=2&rotation=0&showTitle=false&size=297423&status=done&style=stroke&taskId=u1b960f42-304e-4540-b11a-602dbb258b8&title=&width=760)<br>app module生成的R.class是常量                                                    | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691896282203-3b9146e4-4447-4809-9ad2-1394c146cf07.png#averageHue=%23f3f3f1&clientId=uea5debb2-4d46-4&from=paste&height=621&id=u5d6ecd51&originHeight=1242&originWidth=1878&originalType=binary&ratio=2&rotation=0&showTitle=false&size=483098&status=done&style=stroke&taskId=u613d7758-3fdd-421f-ab78-e69a284ddde&title=&width=939)app module生成的R.jar是常量                                               | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691911250848-d4db0194-4c1a-46a0-91f9-a1d1419aa8f3.png#averageHue=%23f2f2f0&clientId=u779d6fb1-ad11-4&from=paste&height=428&id=udb2b38d4&originHeight=856&originWidth=1690&originalType=binary&ratio=2&rotation=0&showTitle=false&size=323661&status=done&style=stroke&taskId=uf3c13d80-6531-43f7-830c-2db0be46a8c&title=&width=845)app module生成的R.jar是常量                                                                                                                                                                                                                                                                                                                                                                                                                      |
| library R.class/R.jar                | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691908627832-540233e9-66e7-4420-88da-96c23c0459ac.png#averageHue=%23f2f2f2&clientId=uea5debb2-4d46-4&from=paste&height=601&id=u0a4cba5d&originHeight=1202&originWidth=2092&originalType=binary&ratio=2&rotation=0&showTitle=false&size=521829&status=done&style=stroke&taskId=u21ea105d-ec46-4fca-b0d9-383fa831ddf&title=&width=1046)<br>library module 生成的R.class不是常量                                        | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691896105256-0514c7f2-4756-48b7-9443-b48e5b9631e3.png#averageHue=%23f5f5f4&clientId=uea5debb2-4d46-4&from=paste&height=345&id=u75f0ee10&originHeight=690&originWidth=1692&originalType=binary&ratio=2&rotation=0&showTitle=false&size=203182&status=done&style=stroke&taskId=u887787b9-c723-4cc5-87d1-8c01347bc2a&title=&width=846)<br>library module 生成的R.java的不是常量                                    | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691911289438-d29b8846-5dd7-4e75-acd7-5ca2a7163ede.png#averageHue=%23f4f4f2&clientId=u779d6fb1-ad11-4&from=paste&height=340&id=u373996a3&originHeight=680&originWidth=1654&originalType=binary&ratio=2&rotation=0&showTitle=false&size=210871&status=done&style=stroke&taskId=u93969df6-4029-455b-9fc3-5999b179a57&title=&width=827)<br>library R.jar不是常量                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 生成的R class的路径                        | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691895354649-31982f47-27db-4cbf-b830-c62eabe5d026.png#averageHue=%23534d43&clientId=uea5debb2-4d46-4&from=paste&height=156&id=ud831e915&originHeight=1134&originWidth=632&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99098&status=done&style=stroke&taskId=u9fd33e78-6dac-431a-a172-355fb03e4d8&title=&width=87)<br>`/build/intermediates/javac/debug/classes/me/hacket/qiubaitools/R.class` | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691895732754-6164e00f-4ca1-46db-acc4-b93313d0c1b1.png#averageHue=%23524c43&clientId=uea5debb2-4d46-4&from=paste&height=276&id=u812eb5aa&originHeight=552&originWidth=882&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57068&status=done&style=stroke&taskId=u57fa6e8d-d0b6-4e26-82ed-5ba3ba6211b&title=&width=441)<br>`build/compile_and_runtime_not_namespaced_r_class_jar/debug/R.jar` | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691895732754-6164e00f-4ca1-46db-acc4-b93313d0c1b1.png#averageHue=%23524c43&clientId=uea5debb2-4d46-4&from=paste&height=276&id=Uhuc0&originHeight=552&originWidth=882&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57068&status=done&style=stroke&taskId=u57fa6e8d-d0b6-4e26-82ed-5ba3ba6211b&title=&width=441)<br>`build/compile_and_runtime_not_namespaced_r_class_jar/debug/R.jar`                                                                                                                                                                                                                                                                                                                                                                           |
| app R内联                              | app module的R都内联成了常量                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| library module内联（查看LoginActivity字节码） | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691911626638-fba2fe03-1ab1-4a01-a33f-6ed852be455b.png#averageHue=%232e2b2a&clientId=u779d6fb1-ad11-4&from=paste&height=463&id=u99f276ad&originHeight=926&originWidth=1308&originalType=binary&ratio=2&rotation=0&showTitle=false&size=126844&status=done&style=stroke&taskId=ucf95e976-29c1-4f07-a21d-5604537eb7d&title=&width=654)<br>否                                                                      | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691911663217-f5c5aac9-2eaf-47dd-a600-c57ec395f0f3.png#averageHue=%232e2b2b&clientId=u779d6fb1-ad11-4&from=paste&height=482&id=u8d599a60&originHeight=964&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=136132&status=done&style=stroke&taskId=udf1fe4ad-8d29-475e-a79d-28102de2bd9&title=&width=660)<br>否                                                                | ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691911545730-8948c7c4-98bf-46f5-a789-2174d7505353.png#averageHue=%232d2b2b&clientId=u779d6fb1-ad11-4&from=paste&height=478&id=u05876f44&originHeight=956&originWidth=1316&originalType=binary&ratio=2&rotation=0&showTitle=false&size=119106&status=done&style=stroke&taskId=u9a8116d1-4759-4b19-a099-f51efb2313a&title=&width=658)<br>是，library module的R被替换成了常量，但R文件没有删除<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692020567869-f3ac5a00-6eb3-4c6f-97fb-d1f536ba6e40.png#averageHue=%23f3f1f1&clientId=u8c1e5bd6-e508-4&from=paste&height=496&id=u7cdad5c9&originHeight=992&originWidth=2176&originalType=binary&ratio=2&rotation=0&showTitle=false&size=416976&status=done&style=stroke&taskId=u37753e85-826c-462f-a903-bdf078deaa8&title=&width=1088) |
| #### booster r inline (R.txt)        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

- [ ] booster-transform-r-inline

**R.txt存在哪？**

- 旧版本 build/intermediates/symbols
- 4.x版本  build/intermediates/runtime_symbol_list

**总结：**滴滴booster通过解析R.txt文件效率上要高于扫描class，使用方便，逻辑清晰，library的R资源的Fields会全部删除，并将引用Library包名的int数组会全部修改为应用包名，应用包名的R的styleable资源会全部保留。需要注意的是Library的R class没有被删除，所以应用中即使使用了反射获取资源id时也不会造成应用崩溃，使用反射肯定捕获了异常，但可能会造成页面异常，另外不支持根据资源名配置白名单，只能根据包名进行配置。

#### Bytex-shrink

- [ ] [Bytex shrink-r-plugin](shrink-r-plugin)

字节跳动的ByteX会扫描所有R文件class并将相关信息存储到集合中，支持根据包名和资源名配置白名单，对Styleable class的int数组也做了inline处理，并且将无用R文件class进行了删除，最后还提供了html的报告，里面包含可能使用反射获取R资源的类信息，这可以帮助我们更好地配置白名单，由于R文件class也会被删除，所以如果应用使用反射获取资源可能会直接崩溃。相对于滴滴booster，字节跳动的ByteX将无用R文件class也进行了删除和R资源中的int数组也进行了inline内联处理，处理更彻底。<br>和AGP4.1相比，做了什么？

1. AGP4.1只是内联了R并删除了R中的条目，但并没有删除R.class；androidx库中的R.class中的条目没有删除

![androidx库的R AGP4.1没有删除](https://cdn.nlark.com/yuque/0/2023/png/694278/1692020998887-00a02664-4993-4604-aa68-0fde3b2cd12d.png#averageHue=%23f4f4f3&clientId=u8c1e5bd6-e508-4&from=paste&height=249&id=u07d1d1a9&originHeight=1304&originWidth=2062&originalType=binary&ratio=2&rotation=0&showTitle=true&size=535171&status=done&style=stroke&taskId=ue32a52f6-e580-45f5-b7d2-97871989116&title=androidx%E5%BA%93%E7%9A%84R%20AGP4.1%E6%B2%A1%E6%9C%89%E5%88%A0%E9%99%A4&width=394 "androidx库的R AGP4.1没有删除")<br>![library2中的R没有删除](https://cdn.nlark.com/yuque/0/2023/png/694278/1692021040687-a81abb71-1702-4f4d-b98f-3c2bf61f119c.png#averageHue=%23f7f6f6&clientId=u8c1e5bd6-e508-4&from=paste&height=251&id=ubd439e5c&originHeight=1124&originWidth=1822&originalType=binary&ratio=2&rotation=0&showTitle=true&size=207596&status=done&style=stroke&taskId=uc1e5afe3-9942-494e-9392-c151c9c76f6&title=library2%E4%B8%AD%E7%9A%84R%E6%B2%A1%E6%9C%89%E5%88%A0%E9%99%A4&width=407 "library2中的R没有删除")

2. Bytex shrink-r删除了module中的R.class和androidx库中的R.class

![bytex中的R被完全删除了](https://cdn.nlark.com/yuque/0/2023/png/694278/1692020927222-e41a027a-2a4f-4714-a94d-221ad1f5d430.png#averageHue=%23f2f1f0&clientId=u8c1e5bd6-e508-4&from=paste&height=242&id=u762aba2e&originHeight=1138&originWidth=1974&originalType=binary&ratio=2&rotation=0&showTitle=true&size=431766&status=done&style=stroke&taskId=ua77d1578-51c6-4649-bec3-533736a9440&title=bytex%E4%B8%AD%E7%9A%84R%E8%A2%AB%E5%AE%8C%E5%85%A8%E5%88%A0%E9%99%A4%E4%BA%86&width=420 "bytex中的R被完全删除了")

#### 不需要内联的场景

1. 反射用到R资源的地方

```java
public static int getId(String num){
    try {
        String name = "weather_detail_icon_" + num;
        Field field = R.drawable.class.getField(name);
        return field.getInt(null);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return 0;
}
```

- [ ] [用于扫描class获取可能使用反射获取的资源id集合](https://github.com/yuweiguocn/Scanner)

2. getIdentifier

#### 数据情况

- 58app在使用ByteX将R资源inline后，包大小减少了4.6M，dex数量从16个减到了11个。
- <br>

#### Ref

- [x] [Android agp 对 R 文件内联支持（网易云音乐）](https://juejin.cn/post/6986941144831623199)
- [ ] [浅谈Android中的R文件作用以及将R资源inline减少包大小](https://yuweiguocn.github.io/android-r-inline/)
- [ ] [每日一问 为什么Android app module下的R.java中变量为final，而lib module中R.java中的变量非final呢？](https://www.wanandroid.com/wenda/show/8735)

### 禁用R文件依赖传递(最低AGP4.2.0)

R文件依赖传递，最上层的module拥有其依赖module的R，不仅拖慢了编译速度，还增加了包的体积

```groovy
android.nonTransitiveRClass=true
```

比如Mashi有个lib_string module专门放string资源的，每次都要传递的app R，存在很大的空间浪费

### ByteX插件代码优化

1. [编译器内联常量](https://github.com/bytedance/ByteX/blob/master/const-inline-plugin/README-zh.md)
2. [编译期间优化掉Log调用](https://github.com/bytedance/ByteX/blob/master/method-call-opt-plugin/README-zh.md)

### 裁剪三方库

如support库，只保留有用的部分

## 3、lib优化：so优化

#### 只编译指定平台的 so

一般我们都是给 arm 平台的机器开发，如果没有特殊情况，我们一般只需要考虑 arm 平台的。具体的方法是 app 下的 build.gradle 添加如下代码：只保留`armeabi(前几年)`或者`armeabi-v7a(目前)`

```groovy
android {
    defaultConfig {
        ndk {
            abiFilter "armeabi"
        }
    }
}
```

各个平台的差别如下：

| 平台          | 说明                              |
| ----------- | ------------------------------- |
| armeabi-v7a | arm 第 7 代及以上的处理器，2011 年后的设备基本都是 |
| arm64-v8a   | arm 第 8 代 64 位处理器设备             |
| armeabi     | arm 第 5、6 代处理器，早期的机器都是这个平台      |
| x86         | x86 32 位平台，平板和模拟器用的多            |
| x86_64      | x86 64 位平台                      |
| #### 移除调试符号 |                                 |

1. 自己编译的 so

release 包的 so 中移除调试符号。可以使用 Android NDK 中提供的 `arm-eabi-strip` 工具从原生库中移除不必要的调试符号<br>如果是 cmake 来编译的话，可以再编辑脚本添加如下代码：

```cmake
set(CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE} -s")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -s")
```

2. 别人编译的 so

联系so作者修改，一般很难联系到。

3. 都下沉到armeabi，代码判断使用指定的so

> 对于项目当中使用到的视频模块的 So，它对性能要求非常高，所以我们采用了另外一种方式，我们将所有这个模块下的 So 都放到了 armeabi 这个目录下，然后在代码中做判断，如果是别的 CPU 架构，那我们就加载对应 CPU 架构的 So 文件即可。这样即减少了包体积，同时又达到了性能最佳。最后，通过实践可以看出 So瘦身的效果一般是最好的。

#### so压缩

#### so动态下发

## Android App Bundle(AAB)

Google Play要求2022年8月份起新应用须打包为AAB格式，开发者上传打包文件整合成aab格式，根据不同的处理器/分辨率等下载对应的安装包，减少冗余，所以安装包会减小。<br>Android App Bundle是一种发布格式，其中包含你应用所有经过编译的代码和资源，它将APK生成及签名交由Google Play来完成。<br>Google Play就是基于对aab文件处理，将App Bundle在多个维度进行拆分，在资源维度，ABI维度和Language维度进行了拆分，你只要按需组装你的Apk然后安装即可。如果你的手机是一个x86，xhdpi的手机，你在google play应用市场下载apk时，gogle play会获取手机的信息，然后根据App Bundle会帮你拼装好一个apk，这个apk的资源只有xhdpi的，而且so库只有x86，其他无关的都会剔除。从而减少了apk的大小。

## Dynamic Feature

### Android App Bundle 动态化⽅案 [Qigsaw](https://github.com/iqiyi/Qigsaw)

Qigsaw是一套基于Android App Bundles实现的Android动态组件化方案，它无需应用重新安装即可动态分发插件。

## 其他方案

### 插件化

### 原生功能转H5来做

### Redex

## 数据

- [百度APP](https://juejin.cn/post/7121938110585241630#heading-3)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691932879799-a98a3af0-5e4e-4aa4-9da4-d87e959379ac.png#averageHue=%232f2f2f&clientId=u34a0ee03-2cac-4&from=paste&height=421&id=u17979acb&originHeight=842&originWidth=1358&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113524&status=done&style=stroke&taskId=u29360906-8094-4954-8cff-df69696765e&title=&width=679)

# APK瘦身量化指标

# Apk 瘦身如何实现长效治理（防止劣化）？

## 1、发版之前与上个版本包体积对比，超过阈值则必须优化。

在大型项目中，最好的方式就是 结合 CI，每个开发同学 在往主干合入代码的时候需要经过一次预编译，这个预编译出来的包对比主干打出来的包大小，如果超过阈值则不允许合入，需要提交代码的同学自己去优化去提交的代码

## 2、推进插件化架构改进

针对项目的 架构，我们可以做 插件化的改造，将每一个功能模块都改造成插件，以插件的形式来支持动态下发，这样应用的包体积就可以从根本上变小了。

## 配合CI，监控上个版本的包

### 如何统计apk每个库的大小？

### CI监控每个版本包体积的变化

#### 增量自动分析

通过将包分析能力的工具集成到打包脚本，在每次包构建成功时，也会同步产出基础的包内容信息，再通过进一步的分析后获得包中每个文件/模块的大小情况。当代码改动触发重新打出新包后，文件/模块通过一一对比的方式，找出哪些有新增，哪些被删除，哪些内容发生变动，以及变动产生的大小，并产出对比报告邮件。通过这样的方式让开发对代码增量有一个直观感受。<br>如何让包增量分析工具能在日常开发中持续稳定发挥作用呢？需要增量卡口设计

#### 增量卡口设计

在之前，包大小差异通常都在拉出集成分支，打出版本release包时才发现，经常会震惊于这个版本的包又比上一个版本要大几M，然后再紧急去寻找是什么需求集成导致的巨大增量。但这时发现包大小的问题已经非常滞后了，版本马上就要发布，这个时候即使抓到了剧增的源头，也很难在短时间内进行优化。<br>因此需要增加需求集成卡口，测试通过后在合入主分支之前，经过包增量确认再集成，而不是在集成后打出release包时。现在的做法如下，开发只需要提交代码，即可自动获得包增量分析报告。<br>其中包增量对比邮件内容，会包含与主分支最新构建、当前分支前一次构建，当前分支最初一次构建包的包大小和增量的对比结果。此外为了数据的准确性，需要开发在拉出开发分支后先构建一个基准包，并在提测和集成前合并一把主干，这样报告数据才会更准确。<br>最后是提测部分，开发同学发送提测邮件时需要标注本次提测包增量及图片压缩情况，若需求增量大于100K，根据超出范围情况，需要备注原因和老板确认。bug修复期间不免也会有代码改动，在测试完成后集成前，会再确认一次包增量情况再集成。

### 提交时做图片大小检查

提交的图片大于30K，给个企微提醒

# Ref

- [ ] [这篇文章把Android包体积优化说透了](https://mp.weixin.qq.com/s/p6l_U5nMcpedbJ5NqLYRaA)（很值得好好总结下）
- [ ] [抖音 Android 包体积优化探索：从 Class 字节码入手精简 DEX 体积](https://juejin.cn/post/7052614577216815134)
