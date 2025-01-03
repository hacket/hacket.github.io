---
date created: 2024-12-24 00:26
date updated: 2024-12-24 00:26
dg-publish: true
tags:
  - '#-keep'
  - '#-keep'
  - '#}'
  - '#-keepclassmembers'
  - '#}'
  - '#手动启用support'
---

# Proguard混淆详细规则

code托管:<br />`git@git.oschina.net:zengfansheng/ProguardDemo.git`

## Proguard语法

<http://proguard.sourceforge.net/index.html#manual/usage.html><br />或者:<br /><https://stuff.mit.edu/afs/sipb/project/android/sdk/android-sdk-linux/tools/proguard/docs/index.html#manual/usage.html><br />android官网:<br /><https://developer.android.com/studio/build/shrink-code.html><br />demo托管:<br /><http://git.oschina.net/zengfansheng/ProguardDemo>

### Shrinking Options 压缩

默认开启，用以减小应用体积，移除未被使用的类、变量、方法和属性，并且会在优化动作执行之后再次执行（因<br />为优化后可能会再次暴露一些未被使用的类和成员）。

- -dontshrink 指定不压缩输入的类文件，默认开启。被指定 -keep 选项的及其直接或简直依赖的类和类成员外均会被移除。压缩也会发生在优化阶段后，因为优化后可能会使类和类成员存在压缩的可能性。
- printusage [filename] 列出没有被使用的类和类成员，标准输出到指定的文件中。只有开启压缩时可用。
- whyareyoukeeping class_specification 输出指定的类和类成员在压缩步骤被保留的原因。一般情况下，可能会存在多个原因。该选项会输出到目标的最短方法链。如果开启了 -verbose 选项，最短链会包含字段及方法签名。只有开启压缩时可用。

### Optimization Options 优化

默认开启，在字节码级别执行优化，让应用运行的更快。非入口节点类加上private/static/final，没有用到的参数会被删除，一些方法可能会变成内联代码

- -dontoptimize<br />指定不优化输入的类文件，默认开启。所有的方法进行字节码级优化。
- -optimizations optimization_filter<br />开启或关闭更细粒度的优化。只有开启优化时可用。高级选项。
- -optimizationpasses n<br />指定优化次数，默认执行一次优化。多次优化可能会得到更好的结果。如果某次优化后没有变化，优化会自动结束。只有开启优化时可用。
- -assumenosideeffects class_specification<br />假定某些方法可以移除。在优化步骤，如果可以确定返回值没被使用，ProGuard 会移除这些方法。ProGuard 会分析你的代码以查找相关调用。例如：指定 System.currentTimeMillis()，任何返回值没有被使用的调用均会删除。某些情况下，你可以使用该选项删除日志代码。只有开启优化时可用。一般情况下该操作比较危险，可能轻易导致程序崩溃，请明确该操作的影响时使用该选项
- -allowaccessmodification<br />优化时允许扩大类和类成员的访问修饰符。该选项可以改善优化的结果。例如，内联公有 getter 可能需要将字段也改成公有。只有开启优化（并开启了 -repackageclasses）。
- -mergeinterfacesaggressively<br />指定接口可以合并，即使实现类没实现所有的方法。该选项可以通过减少类的总数减少输出文件的大小。只有开启优化时可用。

### Obfuscation Options 混淆

默认开启，增大反编译难度，类和类成员会被随机命名，除非用keep保护。使用短又没有语义的名字重命名非入口类的类名，变量名，方法名。入口类的名字保持不变。

- -dontobfuscate<br />指定不混淆类文件，默认开启。
- -printmapping [filename]<br />输出类和类成员新旧名字之间的映射到指定文件中。只有开启混淆时可用。
- -applymapping filename<br />重用映射，映射文件未列出的类和类成员会使用随机的名称。如果代码结构从根本上发生变化，ProGuard 可能会输出映射会引起冲突警告。你可以通过添加 -useuniqueclassmembernames 选项来降低风险。只能指定一个映射文件。只有开启混淆时可用。
- -obfuscationdictionary filename<br />使用文件中的关键字作为方法及字段混淆后的名称。默认使用 ‘a’，’b’ 等短名称作为混淆后的名称。你可以指定保留关键字或不相关的标识符。文件中的空格、标点符号、重复的单词及注释会被忽略。只有开启混淆时可用。
- -classobfuscationdictionary filename<br />使用文件中的关键字作为类混淆后的名称，类似于 -obfuscationdictionary。只有开启混淆时可用。
- -packageobfuscationdictionary filename<br />使用文件中的关键字作为包混淆后的名称，类似于 -obfuscationdictionary。只有开启混淆时可用。
- -overloadaggressively<br />开启侵入性重载混淆。多个字段及方法允许同名，只要它们的参数及返回值类型不同。该选项可使处理后的代码更小（及更难阅读）。只有开启混淆时可用。<br />注：Dalvik 不能处理重载的静态字段
- -useuniqueclassmembernames<br />方法同名混淆后亦同名，方法不同名混淆后亦不同名。不使用该选项时，类成员可被映射到相同的名称。因此该选项会增加些许输出文件的大小。只有开启混淆时可用。
- -dontusemixedcaseclassnames<br />混淆时不会产生大小写混合的类名。默认混淆后的类名可以包含大写及小写。如果 jar 被解压到非大小写敏感的系统（比如 Windows），解压工具可能会将命名类似的文件覆盖另一个文件。只有开启混淆时可用。
- -keeppackagenames [package_filter]<br />不混淆指定的包名。过滤器是由逗号分隔的包名列表。包名可以包含`?、*、**` 通配符，并且可以在包名前加上 ! 否定符。只有开启混淆时可用。
- -flattenpackagehierarchy [package_name]<br />重新打包所有重命名的包到给定的包中。如果没参数或字符串为空，包移动到根包下。该选项是进一步混淆包名的例子，可以使处理后的代码更小更难阅读。只有开启混淆时可用。
- -repackageclasses [package_name]<br />重新打包所有重命名的类到给定的包中。如果没参数或字符串为空，类的包会被完全移除。该选项覆盖 -flattenpackagehierarchy ，是进一步混淆包名的另一个例子，可以使处理后的代码更小更难阅读。曾用名为 -defaultpackage。只有开启混淆时可用。
- -keepattributes [attribute_filter]<br />保留任何可选属性。过滤器是由逗号分隔的 JVM 及 ProGuard 支持的属性列表。属性名可以包含 `?、*、**`通配符，并且可以在属性名前加上 ! 否定符。例如：处理库文件时应该加上 Exceptions,InnerClasses,Signature 属性。同时保留 SourceFile 及 LineNumberTable 属性使混淆后仍能获取准确的堆栈信息。同时如果你的代码有使用注解你可能会保留 annotations 属性。只有开启混淆时可用。
- -keepparameternames<br />保留已保留方法的参数的名称及类型。只有开启混淆时可用。
- -renamesourcefileattribute [string]<br />指定一个常量字符串作为 SourceFile（和 SourceDir）属性的值。需要被 -keepattributes 选项指定保留。只有开启混淆时可用。
- -adaptclassstrings [class_filter]<br />混淆与完整类名一致的字符串。没指定过滤器时，所有符合现有类的完整类名的字符串常量均会混淆。只有开启混淆时可用。
- -adaptresourcefilenames [file_filter]<br />以混淆后的类文件作为样本重命名指定的源文件。没指定过滤器时，所有源文件都会重命名。只有开启混淆时可用。
- -adaptresourcefilecontents [file_filter]<br />以混淆后的类文件作为样本混淆指定的源文件中与完整类名一致的内容。没指定过滤器时，所有源文件中与完整类名一致的内容均会混淆。只有开启混淆时可用。

### Preverification Options 预校验

预校验代码是否符合Java1.6或者更高的规范(唯一一个与入口类不相关的步骤)

- -dontpreverify<br />指定不对处理后的类文件进行预校验。默认情况下如果类文件的目标平台是 Java Micro Edition 或 Java 6 或更高时会进行预校验。目标平台是 Android 时没必要开启，关闭可减少处理时间。
- -microedition<br />指定处理后的类文件目标平台是 Java Micro Edition。

### 其他

#### General Options

- -verbose<br />指定处理期间打印更多相关信息
- -dontnote [class_filter]<br />指定配置中潜在错误或遗漏时不打印相关信息。类名错误或遗漏选项时这些信息可能会比较有用。class_filter 是一个可选的正则表达式。类名匹配时 ProGuard 不会输出这些类的相关信息。
- -dontwarn [class_filter]<br />指定找不到引用或其他重要问题时不打印警告信息。class_filter 是一个可选的正则表达式。类名匹配时 ProGuard 不会输出这些类的相关信息。<br />注意：如果找不到引用的类或方法在处理过程中是必须的，处理后的代码将会无法正常运行。**请明确该操作的影响时使用该选项。**
- -ignorewarnings<br />打印找不到引用或其他重要问题的警告信息，但继续处理代码。<br />注意：如果找不到引用的类或方法在处理过程中是必须的，处理后的代码将会无法正常运行。**请明确该操作的影响时使用该选项。**
- -printconfiguration [filename]<br />将已解析过的配置标准输出到指定的文件。该选项可用于调试配置。
- -dump [filename]<br />标准输出类文件的内部结构到给定的文件中。例如，你可能要输出一个 jar 文件的内容而不需要进行任何处理。

#### Input/Output Options

- **@**_filename_<br />相当于 `-include filename`
- **-include** _filename_<br />读取指定文件的配置参数
- **-basedirectory** _directoryname_<br />指定当前配置文件中所有相对文件路径的基本目录，基目录
- **-injars** _class_path_<br />指定需要处理的 jar/aar/war/ear/zip/apk/dir。文件(目录)内的类文件会被处理并写入到输出的文件(目录)。默认情况下，非类文件会直接复制而不会被修改。在 _class_path_ 中的内容可以过滤，在 filters 部分会详细说明。为了更好的可读性，建议使用多个 **-injars** 来指定多个 _class_path_
- **-outjars** _class_path_<br />指定处理完后输出的 jar/aar/war/ear/zip/apk/dir 名字。前面指定的 **-injars** 会在处理后写入到该文件(目录)中。可以过滤输出内容，在 filters 部分会详细说明。<br />需要避免输出文件覆盖输入文件。没有 **-outjars** 配置时，不会有输出文件。
- **-libraryjars** _class_path_<br />指定相关必需的 jar/aar/war/ear/zip/apk/dir 类库。这些文件不会包含在输出的文件中。在 _class_path_ 中的内容可以过滤，在 filters 部分会详细说明。为了更好的可读性，建议使用多个 **-libraryjars** 来指定多个 _class_path_

```
-libraryjars libs/gson-2.2.4.jar
```

- **-skipnonpubliclibraryclasses**<br />指定读取类库时跳过非公有类，该操作可以加快处理及减少 ProGuard 的内存使用。默认情况下 ProGuard 会读取非公有类。然而，大多时候非公有类不会与 injars 有关联，如果它不会影响到 injars 的文件，建议使用该选项。如果使用该选项导致找不到类，ProGuard 会输出相应的警告信息。
- **-dontskipnonpubliclibraryclasses**<br />指定不忽略非公有的 library 类。4.5 版后，该选项默认开启。
- **-dontskipnonpubliclibraryclassmembers**<br />指定不忽略包内可见的 library 类的成员(字段及方法)。默认情况下，ProGuard 解析类库时会跳过这些成员，因为 injars 一般不会使用它们。然而有时 injars 与 library 的类同属一个包，并且 jnjars 的类使用了这些包内可见成员。在这种情况下，这些类成员是有用的。
- **-keepdirectories** [_directory_filter_]<br />指定要保留在输出文件内的目录。默认情况下，目录会被移除。这会减少输出文件的大小，但如果你的代码引用到它们时可能会导致程序崩溃（例：`mypackage.MyCalss.class.getResource("")`）。这时就需要指定 `-keepdirectories mypackage`。如果没有指定过滤器，所有目录会被保留。例如，`-keepdirectories mydirectory` 匹配 mydirectory 目录；`-keepdirectories mydirectory/*` 匹配 mydirectory 的直接子目录；`-keepdirectorie mydirectory/**` 匹配所有子目录。
- **-target** _version_<br />指定类文件的版本号。版本号可以是 1.0，1.1，1.2，1.3，1.4，1.5(or 5)，1.6(or 6)，1.7(or 7)，1.8(or 8)。默认情况下，类文件的版本号保持不变。一般不应降低类文件的版本号，因为可能包含部分旧版本不支持的代码。
- **-forceprocessing**<br />指定即使输出是一样的，也强制处理 injars。一致性判断是基于指定的输入，输出和配置文件或配置文件夹的时间戳比较的。

#### Keep Options

- -keep [,modifier,...] class_specification 保留指定的类名或者类名及其类成员，具体看配置;注意modifier,如果是public的话,那么不会public修饰的类就会被混淆

```
# 保留Student的类名
-keep public class com.example.fragmentdemo.Student
```

```
# 保留Student类名及其get和set方法,但settergetter字段名没有保存
-keep public class com.example.fragmentdemo.Student {
    *** get*();
    void set*(***);
}
```

- -keepclassmembers [,modifier,...] class_specification 不混淆类的成员，但类名会被混淆

```
# 不混淆自定义View的构造方法和set方法
-keepclassmembers class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}
```

```
# 不混淆com.baidu.batsdk包下所有类的成员
-keepclassmembers public class com.baidu.batsdk.*
{
    *;
}
```

- -keepclasseswithmembers [,modifier,...] class_specification 保留满足指定条件的类和类成员
- -keepnames class_specification 如果指定的类和类的成员在压缩期没有被移除，则保留它们的名称。只有开启混淆时可用。<br />简单版`-keep,allowshrinking class_sepcification`
- -keepclassmembernames class_specification<br />简短版 `-keepclassmembers,allowshrinking class_specification`<br />如果指定的类的成员在压缩期没被移除，则保留它们的名称。只有开启混淆时可用。
- -keepclasseswithmembernames class_specification<br />简短版 `-keepclasseswithmembers,allowshrinking class_specification`<br />如果满足指定条件的类和类成员在压缩期没被移除，则保留它们的名称。只有开启混淆时可用。
- -printseeds [filename]<br />详尽地列出类和类成员匹配的 -keep 选项清单，标准输出到指定的文件中。该清单可用于验证预期的类和类成员是否真正被找到，特别是使用了通配符的情况下。

#### Keep Option Modifiers

- includedescriptorclasses 指定保留-keep选项保留的方法、字段的类型描述符对应的类。通常用于保留Native方法。
- allowshrinking 允许压缩
- allowoptimization 允许优化
- allowobfuscation 允许混淆

## Proguard基本规则

### `*`和`**`

```java

-keep class cn.hadcn.test.** // keep住该包下及子包下的类名不被混淆

-keep class cn.hadcn.test.* // keep住该包下的类的类名不混淆，但子包下的类的类名会被混淆
```

一颗星表示`只是保持该包下的类名，而子包下的类名还是会被混淆`；两颗星表示把`本包和所含子包下的类名都保持`；

用以上方法保持类后，你会发现类名虽然未混淆，但里面的具体方法和变量命名还是变了，这时如果既想保持类名，又想保持里面的内容不被混淆，我们就需要以下方法了:

```java

-keep class cn.hadcn.test.* {*;} // keep该包下的类的类名和类的属性方法不被混淆，子包下的会被混淆
```

也可以使用Java的基本规则来保护特定类不被混淆，比如我们可以用extend，implement等这些Java规则。如下例子就避免所有继承Activity的类被混淆

```java

# 保留我们使用的四大组件，自定义的Application等等这些类不被混淆 

# 因为这些子类都有可能被外部调用 

-keep public class * extends android.app.Activity 

-keep public class * extends android.app.Appliction 

-keep public class * extends android.app.Service 

-keep public class * extends android.content.BroadcastReceiver 

-keep public class * extends android.content.ContentProvider 

-keep public class * extends android.app.backup.BackupAgentHelper 

-keep public class * extends android.preference.Preference 

-keep public class * extends android.view.View 

-keep public class com.android.vending.licensing.ILicensingService
```

保留一个类中的内部类不被混淆则需要用$符号：

```java

// 保持ScriptFragment内部类JavaScriptInterface中的所有public内容不被混淆。

-keepclassmembers class cc.ninty.chat.ui.fragment.ScriptFragment$JavaScriptInterface { 

 public *; 

}
```

一个类中你不希望保持全部内容不被混淆，而只是希望保护类下的特定内容，就可以使用：

```java

<init>(参数类型); // 匹配所有构造器 

<fields>(); // 匹配所有域 

<methods>(参数类型); // 匹配所有方法方法
```

还可以在`<fields>`或`<methods>`前面加上private 、public、native等来进一步指定不被混淆的内容：

```java

-keep class cn.hadcn.test.One { 

 public <methods>; 

}



// One类下的所有public方法都不会被混淆，当然你还可以加入参数，比如以下表示用JSONObject作为入参的构造函数不会被混淆

-keep class cn.hadcn.test.One { 

 public <init>(org.json.JSONObject); 

}
```

### keep及其他keepxxx

| 保留              | 防止被移除或者被重命名             | 防止被重命名                      |
| --------------- | ----------------------- | --------------------------- |
| 类和类成员           | -keep                   | -keepnames                  |
| 仅类成员            | -keepclassmembers       | -keepclassmembernames       |
| 如果拥有某成员，保留类和类成员 | -keepclasseswithmembers | -keepclasseswithmembernames |

> 移除是指在压缩(Shrinking)时是否会被删除

ProGuard 规则中最常用的是 Keep 选项，所以下面主要讲 Keep 选项的语法，ProGuard 中有 6 组 Keep 选项，以表格的方式显示如下：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687825805658-fd0f4a33-865c-4098-b36b-6b565ac28052.png#averageHue=%23f2f1f1&clientId=u7028fa37-ad92-4&from=paste&id=u52649c1f&originHeight=494&originWidth=1258&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4047c227-3ea4-4bfd-9bbc-1d8dd5071aa&title=)<br />这六组选项看起来很容易搞混，其实只要掌握其中的关键差别就好区分了：

1. 带names后缀的表示只是防止被混淆，还是可被移除，而没有names后缀则表示防止被混淆或移除；
2. classmembers 表示只对类中成员生效，而 classeswithmembers 表示不仅对类中成员生效，还对包含它的类生效；
3. keep 表示对类和类中匹配的成员生效，而 keepclasseswithmembers 表示对匹配的类成员及包含它的类生效，例如`-keep class * { native <methods>; }`表示保留所有的类和类中的 native 方法，`-keepclasseswithmembers class * { native <methods>; }`表示保留所有的 native 方法及包含 native 方法的类。

### 通配符

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687825825009-39e4b0bc-6a6e-413f-91fd-9906daad79b6.png#averageHue=%23f4f4f4&clientId=u7028fa37-ad92-4&from=paste&id=u83af2967&originHeight=790&originWidth=1570&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7e860d66-8bb2-4c5d-a27a-277f4d131da&title=)<br />注意：

- `-keep class * extends android.view.View` 表示保留 View 的子类，方法和字段还是会被混淆的，
- `-keep class _ extends android.view.View { _; }` 才表示保留所有 View 的子类及其成员。

在了解 Keep 选项和通配符后，在回头看默认的 proguard-android.txt 文件就轻松多了。

### Proguard不混淆字段、方法

```
# keep注解
-keep @com.pandaq.appcore.framework.annotation.ProguardKeep class * {*;}
# keep注解修饰的字段
-keep class * {
    @com.pandaq.appcore.framework.annotation.ProguardKeep <fields>; 
}
# keep注解修饰的方法
-keepclassmembers class * {
    @com.pandaq.appcore.framework.annotation.ProguardKeep <methods>;
}
```

### consumerProguardFiles-在library中提供Proguard规则

第三方库的作者们也有义务向您提供必要的混淆规则配置来避免开启 Proguard 导致的构建失败或者应用崩溃。<br />有些项目简单地在他们的文档或者 README 上提及了必要的混淆规则，所以您需要复制粘贴这些规则到您的主 ProGuard 配置文件中。不过有个更好的方法，第三方库的维护者们如果发布的库是 AAR ，那么可以指定规则打包在 AAR 中并会在应用构建时自动暴露给构建系统，通过添加下面几行代码到库模块的 build.gradle 文件中：

```java
release { //or your own build type  
  consumerProguardFiles ‘consumer-proguard.txt’  
}
```

您写入在`consumer-proguard.txt`文件中的规则将会在应用构建时附加到应用主 ProGuard 配置并被使用。

### 混淆规则的叠加

所有module的混淆规则会叠加。<br />如果想查看所有规则 叠加后的混淆规则，可在主目录的 proguard-rules.pro 添加下述配置：

```
# 输出所有规则叠加后的混淆规则
-printconfiguration ./build/outputs/mapping/full-proguard-rules.txt
```

### Android Studio中默认的proguard-android.txt和proguard-android-optimize.txt区别

一般在gradle引入

```groovy
proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
// 获得官方自带的混淆规则文件路径，另一个是与当前 gradle 相同目录下的 proguard-rules.pro 文件路径。
// getDefaultProguardFile获取的是/build/intermediates/proguard-files
```

位于`/sdk/tools/proguard`有下面两个文件

1. proguard-android.txt
2. proguard-android-optimize.txt

差异对比：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687825971920-8949c20a-7fe2-4e7a-9507-7dae5a167950.png#averageHue=%23f4efee&clientId=u7028fa37-ad92-4&from=paste&id=ub08e1bf4&originHeight=1058&originWidth=1928&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8c6a7145-c718-4c45-81e1-79c67b98890&title=)

#### proguard-android.txt

这个文件，在AGP2.2+不再使用了，AGP会在`build/intermediates/proguard-files`生成proguard文件

#### proguard-android-optimize.txt

如果你不想`optimize`，用`proguard-android.txt`。

### Android中不进行Proguard技巧

#### 不被混淆的情况

1. 反射用到的类不混淆(否则反射可能出现问题)
2. 与服务端交互时，使用GSON、fastjson等框架解析服务端数据时，所写的JSON对象类不混淆，否则无法将JSON解析成对应的对象；
3. JNI方法(native方法)，jni方法不可混淆，因为这个方法需要和native方法保持一致；

```java
-keepclasseswithmembernames class * {  
  # 保持native方法不被混淆 
  native <methods>; 
}
```

4. AndroidMainfest中的类不混淆，所以四大组件和Application的子类和Framework层下所有的类默认不会进行混淆。自定义的View默认也不会被混淆；所以像网上贴的很多排除自定义View，或四大组件被混淆的规则在Android Studio中是无需加入的；
5. 有用到WebView的JS调用也需要保证写的接口方法不混淆，原因同jni方法一样；
6. Parcelable的子类和Creator静态成员变量不混淆，否则会产生Android.os.BadParcelableException异常；

```java
# 保持Parcelable不被混淆 
-keep class * implements Android.os.Parcelable { 
 public static final Android.os.Parcelable$Creator *; 
}
```

7. 使用enum类型时需要注意避免以下两个方法混淆，因为enum类的特殊性，以下两个方法会被反射调用，见反射规则

```java
-keepclassmembers enum * { 
 public static **[] values(); 
 public static ** valueOf(java.lang.String); }
```

8. 使用第三方开源库或者引用其他第三方的SDK包时，如果有特别要求，也需要在混淆文件中加入对应的混淆规则

5、Serializable类

##### 不混淆接口INoProguard

定义接口

```java
/**
 * 实现该接口不混淆
 * <p/>
 * Created by zengfansheng on 2016/5/25.
 */
public interface INoProguard {
}
```

混淆配置：

```
-keep public class com.baidu.browser.util.proguard.INoProguard
-keep class * implements com.baidu.browser.util.proguard.INoProguard {
    *;
}
```

缺点：

- 只能应用在类或接口上，不能应用在方法、字段上面
- 实现该接口会保留该类或接口中所有的成员

##### 不混淆注解NoProguard

定义不混淆注解标记

```java
/**
 * 不进行混淆的注解标记位
 *
 *  NotProguard, Means not proguard something, like class, method, field<br/>
 */
@Retention(RetentionPolicy.CLASS)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.CONSTRUCTOR, ElementType.FIELD})
public @interface NoProguard {
}
```

混淆规则：

```
# 注解类NoProguard
-dontskipnonpubliclibraryclassmembers
-printconfiguration
-keep,allowobfuscation @interface com.example.proguard.proguarddemo.noproguard.NoProguard
-keep @com.example.proguard.proguarddemo.noproguard.NoProguard class *
-keepclassmembers class * {
    @com.example.proguard.proguarddemo.noproguard.NoProguard *;
}

#-keep @com.example.proguard.proguarddemo.noproguard.NoProguard class * {*;}
#-keep class * {
#    @com.example.proguard.proguarddemo.noproguard.NoProguard <fields>;
#}
#-keepclassmembers class * {
#    @com.example.proguard.proguarddemo.noproguard.NoProguard <methods>;
#}
```

##### @Keep注解

目前`@Keep`并没有起作用，该混淆的还是混淆了；Gradle还不支持@Keep混淆，Google只是定义好了一个这种注解，并没有实现它，也就是说@Keep目前只是一个空壳。这里我们来手动开启它，让它支持防止混淆，在你的proguard.cfg或proguard-android.txt配置文件里面加入以下代码：

```
#手动启用support keep注解
-dontskipnonpubliclibraryclassmembers
-printconfiguration
-keep,allowobfuscation @interface android.support.annotation.Keep
-keep @android.support.annotation.Keep class *
-keepclassmembers class * {
    @android.support.annotation.Keep *;
}
```

案例：

```java
//防止混淆类
@Keep
public class Person {}

//防止混淆变量
@Keep
public String name;

//防止混淆方法
@Keep
public int getAge(){}
```

> 现在已经默认支持@Keep的混淆规则了？

参考：<br />[http://hanhailong.com/2015/12/28/Android进阶之ProGuard代码混淆/](http://hanhailong.com/2015/12/28/Android%E8%BF%9B%E9%98%B6%E4%B9%8BProGuard%E4%BB%A3%E7%A0%81%E6%B7%B7%E6%B7%86/)

## Android自定义资源保持规则之tools属性

### 指定要忽略的资源文件

用shrinkResources true开启资源压缩后，所有未被使用的资源默认被移除。假如你需要定义哪些资源必须被保留，在 res/raw/ 路径下创建一个 xml 文件，例如 keep.xml。<br />通过一些属性的设置可以实现定义资源保持的需求，可配置的属性有：

```xml

tools:keep 定义哪些资源需要被保留（资源之间用“,”隔开）

tools:discard 定义哪些资源需要被移除（资源之间用“,”隔开）

tools:shrinkMode 资源压缩模式,有两种取值strict和safe,默认为safe
```

safe和strict的优化策略:<br />safe可以简单理解为安全模式，它会尽最大努力检查代码中可能会使用到的资源进行保留，避免运行时错误。

如果你的代码调用Resources.getIdentifier()，这就表示你的代码将根据动态生成的字符串查询资源名称。当你执行这一调用时，默认情况下资源压缩器会采取防御性行为，将所有具有匹配名称格式的资源标记为可能已使用，无法移除。<br />当代码中通过`Resources.getIdentifier()`用动态的字符串来获取并使用资源时，普通的资源引用检查就可能会有问题。例如，如下代码会导致所有以“img_”开头的资源都被标记为已使用。

```java

String name = String.format("img_%1d", angle + 1);

res = getResources().getIdentifier(name, "drawable", getPackageName());
```

### 启用严格的检测

我们可以设置 tools:shrinkMode 为 strict 来开启严格模式，使只有确实被使用的资源被保留。<br />以上就是自定义资源保持规则相关的配置，举个例子：

```xml

<?xml version="1.0" encoding="utf-8"?>

<resources xmlns:tools="http://schemas.android.com/tools"

    tools:keep="@layout/l_used*_c,@layout/l_used_a,@layout/l_used_b*"

    tools:discard="@layout/unused2"

    tools:shrinkMode="strict"/>
```

通常情况下，resource shrinker可以准确地确定资源使用。如果你使用`Resources.getIdentifier()`动态获取指定资源的Id，在默认情况下，这样资源具有匹配名称的格式为潜在的使用，无法去除。<br />例如，下面的代码将导致所有img_前缀的资源都无法去除。

```xml

String name = String.format("img_%1d", angle + 1);

res = getResources().getIdentifier(name, "drawable", getPackageName());
```

resource shrinker 也通过搜索代码中是否包含资源名来判断是否在build的时候删除。

```xml

<?xml version="1.0" encoding="utf-8"?>

<resources xmlns:tools="http://schemas.android.com/tools"tools:shrinkMode="strict" />
```

在 resource 文件中指定 shrinkMode，你可以指定 Gradle 在处理该资源文件时候的方式，默认的值为 safe，你也可以将它指定为 strict（只会保留有明确引用的资源，以及处理被 tools:keep 和 tools:discard 标注的资源）

## Reference

- ProGuard 选项<br />[http://chaosleong.github.io/blog/2015/12/03/译-ProGuard-选项/](http://chaosleong.github.io/blog/2015/12/03/%E8%AF%91-ProGuard-%E9%80%89%E9%A1%B9/)
- Proguard Usage<br /><https://stuff.mit.edu/afs/sipb/project/android/sdk/android-sdk-linux/tools/proguard/docs/index.html#manual/usage.html>

# Proguard进阶用法

## 反混淆Proguard之retrace

Decoding Obfuscated Stack Traces

- 通过`mapping.txt`文件
- `retrace.bat|retrace.sh [-verbose] mapping.txt [<stacktrace_file>]`

```
retrace.bat -verbose mapping.txt obfuscated_trace.txt
```

## 隐藏类名字符串，保留源文件和行号，方便调试crash

### 将.class信息中的类名重新定义为"Proguard"字符串

```java

# 将.class信息中的类名重新定义为"Proguard"字符串，保留源文件名为"Proguard"字符串，而非原始的类名

-renamesourcefileattribute Proguard
```

### 保留源文件和行号，配合renamesourcefileattribute可以将类名隐藏掉

```java

-keepattributes SourceFile,LineNumberTable
```

## 混淆字典

### obfuscationdictionary

`-obfuscationdictionary filename`<br />指定一个文本文件用来生成混淆后的名字。默认情况下，混淆后的名字一般为a,b，c这种。通过使用`-obfuscationdictionary`配置的字典文件，可以使用一些非英文字符做为类名。成员变量名、方法名。字典文件中的空格，标点符号，重复的词，还有以'#'开头的行都会被忽略。需要注意的是添加了字典并不会显著提高混淆的效果，只不过是更不利与人类的阅读。正常的编译器会自动处理他们，并且输出出来的jar包也可以轻易的换个字典再重新混淆一次。最有用的做法一般是选择已经在类文件中存在的字符串做字典，这样可以稍微压缩包的体积。

> 查找了字典文件的格式：一行一个单词，空行忽略，重复忽略，使用java中的关键字作字典，混淆之后的代码更加不利于阅读

```java
# 这里巧妙地使用java中的关键字作字典，混淆之后的代码更加不利于阅读
#
# This obfuscation dictionary contains reserved Java keywords. They can't
# be used in Java source files, but they can be used in compiled class files.
# Note that this hardly improves the obfuscation. Decent decompilers can
# automatically replace reserved keywords, and the effect can fairly simply be
# undone by obfuscating again with simpler names.
# Usage:
# java -jar proguard.jar ..... -obfuscationdictionary keywords.txt
#

do
if
for
int
new
try
byte
case
char
else
goto
long
this
void
break
catch
class
const
final
float
short
super
throw
while
double
import
native
public
return
static
switch
throws
boolean
default
extends
finally
package
private
abstract
continue
strictfp
volatile
interface
protected
transient
implements
instanceof
synchronized
```

### 混淆类名的字典

`-classobfuscationdictionary filename`

### 混淆包名的字典

`-packageobfuscationdictionary filename`

字典配置：

```java
-obfuscationdictionary dictionary-drakeet.txt
-classobfuscationdictionary dictionary-drakeet.txt
-packageobfuscationdictionary dictionary-drakeet.txt
```

<https://github.com/drakeet/proguard-dict><br />超级混淆字典：<br /><https://github.com/Qrilee/AndroidObfuseDictionary>

> 用o0o0这种来作为名字混淆

<https://github.com/hqzxzwb/ProguardDictionaryGenerator>

> 一种生成阅读极其困难的proguard字典的算法

## -repackageclasses

这条规则配置特别强大，它可以把你的代码以及所使用到的各种第三方库代码统统移动到同一个包下，可能有人知道这条配置，但仅仅知道它还不能发挥它最大的作用，默认情况下，你只要在 rules 文件中写上 -repackageclasses 这一行代码就可以了，它会把上述的代码文件都移动到根包目录下，即在 / 包之下，这样当有人反编译了你的 APK，将会在根包之下看到 成千上万 的类文件并列着，除此之外，由于我们有时不得不 keep 一些类文件，于是你应用的包名层次仍然会存在，有一些没被完全混淆的类将继续存留在你的包名之下，这些类文件就相对得不到很好的保护。于是我要介绍一个小技巧，就是 -repackageclasses 后跟上一个你应用的包名，如：

```java
-repackageclasses com.drakeet.purewriter.debug
```

最终 Proguard 会将包括第三方库的所有类文件都移动到你的包名之下，所谓 藏叶于林，这时候那些你未能完全混淆的类也可以藏身在这类文件大海之中，而且这些类文件名都会被混淆成 abcd 字母组合的名字。

需要注意的是，-repackageclasses + 你的包名 这种做法存在混淆 bug，而默认 -repackageclasses 不加包名不会出现 bug，所以初次使用此法需要进行测试，否则请退而求其次，关于这个 bug 的具体内容不多说，很赘述。

## -overloadaggressively

混淆的时候大量使用重载，多个方法名使用同一个混淆名，但是他们的方法签名不同。这可以使包的体积减小一部分，也可以加大理解的难度。仅在混淆阶段有效。<br />注意，这项配置有一定的限制：

```
Sun的JDK1.2上会报异常 
Sun JRE 1.4上重载一些方法之后会导致序列化失败 
Sun JRE 1.5上pack200 tool重载一些类之后会报错 
java.lang.reflect.Proxy类不能处理重载的方法 
Google's Dalvik VM can't handle overloaded static fields(这句我不懂，重载静态变量是什么意思？有看懂的同学可以回复一下)
```

### assumenosideeffects 移除log代码

混淆过程中删除 Log 代码<br />[http://drakeet.me/android-advanced-proguard-and-security/#安全](http://drakeet.me/android-advanced-proguard-and-security/#%E5%AE%89%E5%85%A8)<br />用Proguard的-assumenosideeffects清除log

#### log正确使用姿势

1. 禁用System.out.println

Android应用中，一般通过封装过的Log类来输出日志，方便控制。而System.out.println是标准的Java输出方法，使用不当，可能造成Release模式下输出日志的结果。

2. 禁用e.printStackTrace

禁用理由同上<br />建议通过封装过的Log类来输出异常堆栈信息

3. Debug模式下，通过一个静态变量，控制日志的显示隐藏。

我一般习惯直接使用BuildConfig.DEBUG，当然，你也可以自己定义一个。

#### proguard中移除log代码

在Proguard配置文件中，确保没有添加 --dontoptimize选项 来禁用优化的前提下，

```java

-assumenosideeffects class android.util.Log {   

    public static *** d(...);       

    public static *** e(...);    

    public static *** i(...);    

    public static *** v(...);   

    public static *** println(...);

    public static *** w(...);     

    public static *** wtf(...);

}
```

封装过的Log工具类调用日志使用上面的配置是否也可以被移除？<br />不会的。<br />需要添加自己的LogUtil配置

```java
-assumenosideeffects class com.qiushibaike.common.log.LogUtil {

    public static *** v(...);

    public static *** d(...);

    public static *** i(...);

    public static *** w(...);

    public static *** e(...);

    public static *** wtf(...);

    public static *** json(...);

    public static *** xml(...);

    public static *** printStackTrace(...);
}
```

参考：<br />用Proguard的-assumenosideeffects清除log<br /><https://mp.weixin.qq.com/s/DE4gr8cTRQp2jQq3c6wGHQ>

## Proguard注意

### -libraryjars 和 -keep class冲突

-libraryjars 和 -keep class 在 AndroidStudio 中不可以一起使用，否则用 Gradle 构建会提示 declared twice, 我是去掉 -libraryjars 解决的

**Proguard手册**<br />[ProGuard Manual](http://stuff.mit.edu/afs/sipb/project/android/sdk/android-sdk-linux/tools/proguard/docs/index.html#manual/introduction.html)<br />**Proguard遇到的问题**<br />[Troubleshooting](https://stuff.mit.edu/afs/sipb/project/android/sdk/android-sdk-linux/tools/proguard/docs/index.html#manual/troubleshooting.html)

### 某些导致Proguard所有类名没有被混淆(如icepick)

icepick库导致所有类没有被混淆，去掉该库的混淆规则就可以了

```
-keepnames class * { @icepick.State *;}
```

见issues:<br /><https://github.com/evernote/android-state/issues/15>

## Ref

- [ ] <http://drakeet.me/android-advanced-proguard-and-security/>

# 第三方库Proguard

<https://github.com/krschultz/android-proguard-snippets>

## OkHttp3：

<https://github.com/square/okhttp/issues/2230#issuecomment-212822562>

```
-keepattributes Signature
-keepattributes *Annotation*
# 前面两个可能已经存在
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
```

## Glide:

<https://github.com/bumptech/glide>

```
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
```

## Gson

<https://zybuluo.com/wangwangheng/note/107971#7常用忽略第三方jar包语句>

```
-keepattributes Signature
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.examples.android.model.** { *; }
```

## Volley

```
-keep class com.android.volley.** {*;}
-keep class com.android.volley.toolbox.** {*;}
-keep class com.android.volley.Response$* { *; }
-keep class com.android.volley.Request$* { *; }
-keep class com.android.volley.RequestQueue$* { *; }
-keep class com.android.volley.toolbox.HurlStack$* { *; }
-keep class com.android.volley.toolbox.ImageLoader$* { *; }
```

## DBFlow（待定）

<https://github.com/Raizlabs/DBFlow/issues/248>

```
-keep class com.raizlabs.android.dbflow.config.GeneratedDatabaseHolder
```

## leakcanary

<br /><https://github.com/square/leakcanary/blob/master/leakcanary-android/consumer-proguard-rules.pro>

```
-dontwarn com.squareup.haha.guava.**
-dontwarn com.squareup.haha.perflib.**
-dontwarn com.squareup.haha.trove.**
-dontwarn com.squareup.leakcanary.**
-keep class com.squareup.haha.** { *; }
-keep class com.squareup.leakcanary.** { *; }

# Marshmallow removed Notification.setLatestEventInfo()
-dontwarn android.app.Notification
```

## stetho

<br /><https://github.com/facebook/stetho/tree/master/stetho-js-rhino#proguard><br /><https://github.com/facebook/stetho/wiki/FAQ#general-issues>

```
-keep class com.facebook.stetho.** { *; }
```

## butterknife8

<br /><https://github.com/JakeWharton/butterknife/blob/master/butterknife/proguard-rules.txt>

```
# Retain generated class which implement ViewBinder.
-keep public class * implements butterknife.internal.ViewBinder { public <init>(); }

# Prevent obfuscation of types which use ButterKnife annotations since the simple name
# is used to reflectively look up the generated ViewBinder.
-keep class butterknife.*
-keepclasseswithmembernames class * { @butterknife.* <methods>; }
-keepclasseswithmembernames class * { @butterknife.* <fields>; }
```

## WebView相关

```
# ---------------------------------webview相关------------------------------
# WebView(可选)
-keepclassmembers class * extends android.webkit.WebView {
   public *;
}

# WebView的复杂操作
-keepclassmembers class * extends android.webkit.WebViewClient {
     public void *(android.webkit.WebView,java.lang.String,android.graphics.Bitmap);
     public boolean *(android.webkit.WebView,java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
     public void *(android.webkit.WebView,java.lang.String);
}

# 与JS交互
-keepattributes SetJavaScriptEnabled
-keepattributes JavascriptInterface

# 保留与JS交互接口 , API17+
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
```
