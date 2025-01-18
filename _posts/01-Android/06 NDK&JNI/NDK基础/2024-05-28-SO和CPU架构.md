---
date created: 2024-05-28 08:23
date updated: 2024-12-24 00:34
dg-publish: true
---

# .so文件,ABI和CPU架构

## CPU架构

- ARMv5<br>早期
- ARMv7<br>2010年起
- X86<br>2011年起
- MIPS<br>2012年起
- ARMv8<br>2014年起
- MIPS64<br>2014年起
- X86_64<br>2014年起

在Android系统，每一个CPU架构对应一个ABI，都定义了一种ABI，ABI 决定了二进制文件如何与系统进行交互：<br>armeabi，armeabi-v7a，x86，mips，arm64-v8a，mips64，x86_64。

## [ABI(Application Binary Interface)](https://developer.android.com/ndk/guides/abis.html)

应用程序二进制接口ABI,定义了二进制文件(尤其是.so文件)如何运行在相应的系统平台上，从使用的指令集，内存对齐到可用的系统函数库。

### ABI和CPU架构关系

- 很多设备都支持多余一种ABI
- 当一个应用安装在设备上，只有该设备支持的CPU架构对应的.so文件会被安装

最好是针对特定平台提供相应平台的二进制包，这种情况下运行时就少了一个模拟层（例如x86设备上模拟arm的虚拟层），从而得到更好的性能（归功于最近的架构更新，例如硬件fpu，更多的寄存器，更好的向量化等）。<br>我们可以通过`Build.SUPPORTED_ABIS`得到根据偏好排序的设备支持的ABI列表。但你不应该从你的应用程序中读取它，因为Android包管理器安装APK时，会自动选择APK包中为对应系统ABI预编译好的.so文件，如果在对应的`src/main/jniLibs`目录中存在.so文件的话。

| CPU架构支持的（纵向）ABI（横向） | armeabi | armeabi-v7a | arm64-v8a | mips | mips64 | x86 | x86_64 |
| ------------------- | ------- | ----------- | --------- | ---- | ------ | --- | ------ |
| ARMv5               | 支持      |             |           |      |        |     |        |
| ARMv7               | 支持      | 支持          |           |      |        |     |        |
| ARMv8               | 支持      | 支持          | 支持        |      |        |     |        |
| MIPS                |         |             |           | 支持   |        |     |        |
| MIPS64              |         |             |           | 支持   | 支持     |     |        |
| x86                 | 支持      | 支持          |           |      |        | 支持  |        |
| x86_64              | 支持      |             |           |      |        | 支持  | 支持     |

**解析：**

- x86设备上，libs/x86目录中如果存在.so文件的话，会被安装，如果不存在，则会选择armeabi-v7a中的.so文件，如果也不存在，则选择armeabi目录中的.so文件。
- x86设备能够很好的运行ARM类型函数库，但并不保证100%不发生crash，特别是对旧设备。
- 64位设备（arm64-v8a, x86_64, mips64）能够运行32位的函数库，但是以32位模式运行，在64位平台上运行32位版本的ART和Android组件，将丢失专为64位优化过的性能（ART，webview，media等等）。
- armeabi的SO文件基本上可以说是万金油，它能运行在除了mips和mips64的设备上，但在非armeabi设备上运行性能还是有所损耗；
- 64位的CPU架构总能向下兼容其对应的32位指令集，如：x86_64兼容X86，arm64-v8a兼容armeabi-v7a，mips64兼容mips；

## 参考

关于Android的.so文件你所需要知道的<br><http://www.jianshu.com/p/cb05698a1968><br>与 .so 有关的一个长年大坑<br><https://zhuanlan.zhihu.com/p/21359984>

## so的问题

百度地图,三星s7加载so库失败log:

```
09-26 15:40:15.184 21661-21661/com.useus.cs E/NativeLoader: loadException
java.lang.UnsatisfiedLinkError: dlopen failed: "/data/data/com.useus.cs/files/libs/libBaiduMapSDK_base_v4_0_0.so" is 32-bit instead of 64-bit
    at java.lang.Runtime.load(Runtime.java:332)
    at java.lang.System.load(System.java:1069)
    at com.baidu.platform.comapi.NativeLoader.f(Unknown Source)
    at com.baidu.platform.comapi.NativeLoader.a(Unknown Source)
    at com.baidu.platform.comapi.NativeLoader.c(Unknown Source)
    at com.baidu.platform.comapi.NativeLoader.loadCustomizeNativeLibrary(Unknown Source)
    at com.baidu.platform.comapi.NativeLoader.loadLibrary(Unknown Source)
    at com.baidu.platform.comapi.a.<clinit>(Unknown Source)
    at com.baidu.platform.comapi.c.a(Unknown Source)
    at com.baidu.mapapi.SDKInitializer.initialize(Unknown Source)
    at com.baidu.mapapi.SDKInitializer.initialize(Unknown Source)
    at com.useus.cs.base.BaseApplication.initBaiduMap(BaseApplication.java:129)
    at com.useus.cs.base.BaseApplication.init(BaseApplication.java:69)
    at com.useus.cs.base.BaseApplication.onCreate(BaseApplication.java:53)
    at android.app.Instrumentation.callApplicationOnCreate(Instrumentation.java:1036)
    at android.app.ActivityThread.handleBindApplication(ActivityThread.java:6324)
    at android.app.ActivityThread.access$1800(ActivityThread.java:221)
    at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1860)
    at android.os.Handler.dispatchMessage(Handler.java:102)
    at android.os.Looper.loop(Looper.java:158)
    at android.app.ActivityThread.main(ActivityThread.java:7232)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1230)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1120)
09-26 15:40:15.184 21661-21661/com.useus.cs E/NativeLoader: BaiduMapSDK_base_v4_0_0 Failed to load.
09-26 15:40:15.184 21661-21661/com.useus.cs E/art: No implementation found for int com.baidu.platform.comjni.engine.JNIEngine.initClass(java.lang.Object, int) (tried Java_com_baidu_platform_comjni_engine_JNIEngine_initClass and Java_com_baidu_platform_comjni_engine_JNIEngine_initClass__Ljava_lang_Object_2I)
```

### 分析

ABI兼容的选择。因为如果全部都适配的话，包很大，这样兼容那些用户数极少的cpu就很不划算，所以我只适配了`armeabi`，`armeabi-v7a`以及`x86`。但是在三星S7(ARMv8架构CPU)应该会向下兼容的，但是提示缺报错。由于引入了阿里百川的兼容包`feedbackSdk.aar`，里面有各个平台的.so文件，也就是阿里百川做了各个平台的兼容，所以它创建了各个兼容的平台目录，因为只要出现了这个目录，系统就只会在这个目录里找.so文件而不会遍历其他的目录，所以就出现了之前找不到.so文件的情况（因为其他目录没有我的.so文件）。

### 解决

- 在`app/build.gradle`文件中进行abi的过滤

```groovy
android {
    // ...
    defaultConfig {
        // 过滤支持的abis
        ndk {
            abiFilters 'armeabi', 'armeabi-v7a', 'x86'
        }
    }
    // ...
}
```

- 编译时会报错，在`gradle.properties`添加下面代码

```
android.useDeprecatedNdk=true
```

错误见：

```
Error:(36, 1) A problem occurred evaluating project ':app'.
> Error: NDK integration is deprecated in the current plugin.  Consider trying the new experimental plugin.  For details, see http://tools.android.com/tech-docs/new-build-system/gradle-experimental.  Set "android.useDeprecatedNdk=true" in gradle.properties to continue using the current NDK integration.
```

### 参考

- [ ] [UnsatisfiedLinkError X.so is 64-bit instead of 32-bit之Android 64 bit SO加载机制](http://blog.csdn.net/canney_chen/article/details/50633982)
- [ ] [关于abiFilters的使用](http://blog.csdn.net/wove55678/article/details/52313208)
