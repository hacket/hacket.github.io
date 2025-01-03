---
date created: 2024-05-28 08:23
date updated: 2024-12-24 00:34
dg-publish: true
---

# NDK 基础

# NDK介绍

<https://developer.android.com/ndk/guides/>

## 什么是NDK？

NDK，Native Development Kit，本地开发工具包。<br>就是提供了一系列的工具，帮助我们快速开发C/C++动态库，并可以将so库和Java应用一起打包成apk。

原生开发套件 (NDK) 是一套工具，使您能够在 Android 应用中使用 C 和 C++ 代码，并提供众多平台库。我们可以在 `sdk/ndk-bundle` 中查看 ndk 的目录结构，下面列举出三个重要的成员：

- `ndk-build`: 该 Shell 脚本是 Android NDK 构建系统的起始点，一般在项目中仅仅执行这一个命令就可以编译出对应的动态链接库了。
- `platforms`: 该目录包含支持不同 Android 目标版本的头文件和库文件， NDK 构建系统会根据具体的配置来引用指定平台下的头文件和库文件。
- `toolchains`: 该目录包含目前 NDK 所支持的不同平台下的交叉编译器 - `ARM` 、`X86`、`MIPS` ，目前比较常用的是 ARM。 `//` todo ndk-depends.cmd

ndk 为什么要提供多平台呢？ 不同的 Android 设备使用不同的 CPU，而不同的 CPU 支持不同的指令集。更具体的内容参考[Android ABI](https://developer.android.com/ndk/guides/abis)

### 使用NDK好处

1. 硬件和性能<br>如加载gif图片
2. 更安全
3. 便于移植到IOS平台
4. C/C++有很多开源库

### 使用 NDK 手动编译动态库

在 ndk 目录下的 `toolchains` 下有多个平台的编译工具：

MacOS：比如在 `/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin` 下可以找到 `arm-linux-androideabi-gcc` 执行文件，利用 ndk ` ` 的这个 `gcc` 可以编译出在 android（arm 架构） 上运行的动态库：

```shell
arm-linux-androideabi-gcc -fPIC -shared test.c -o libtest.so
```

参数含义 `-fPIC`： 产生与位置无关代码 `-shared`：编译动态库，如果去掉代表静态库 `test.c`：需要编译的 c 文件 `-o`：输出 libtest.so：库文件名

独立工具链 版本比较新的 ndk 下已经找不到 gcc 了，如果想用的话需要参考[将 NDK 与其他构建系统配合使用  |  Android NDK  |  Android Developers](https://developer.android.com/ndk/guides/other_build_systems)。 比如执行 `$NDK/build/tools/make_standalone_toolchain.py --arch arm --api 21 --install-dir/$yourDir` 可以产生 arm 的独立工具链
`$NDK` 代表 ndk 的绝对路径， `$yourDir` 代表输出文件路径

当源文件很多的时候，手动编译既麻烦又容易出错，此时出现了 makefile 编译。

Windows: `ndk\26.1.10909125\toolchains\llvm\prebuilt\windows-x86_64\bin`
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405280841461.png)

## 什么是JNI？

JNI，Java Native Interface，Java本地开发接口。<br>就是Java调用C/C++规范。

## ndk-build和CMake

### makefile

`Makefile`是一种用于构建和管理软件项目的文件，它包含了编译、链接和构建规则的描述。Makefile文件通常使用GNU Make工具来解析和执行，它根据Makefile中定义的规则和依赖关系来自动化构建过程。
Makefile中的规则定义了如何从源代码文件生成目标文件，以及如何将目标文件链接成可执行文件或库。规则通常包括目标（target）、依赖关系（dependencies）和命令（commands）。目标是构建的目标文件，依赖关系是目标文件所依赖的其他文件，命令是执行构建操作的命令。

### ndk-build

`NDK-Build`是`Android NDK（Native Development Kit）`提供的一个构建工具，用于构建使用C/C++编写的Android应用程序。在使用NDK-Build构建Android应用程序时，可以使用Makefile来定义构建规则和依赖关系。NDK-Build会解析Makefile文件，并根据其中的规则来编译、链接和构建Android应用程序的本地代码。

在使用NDK-Build构建Android应用程序时，通常会使用两个重要的Makefile文件：`Android.mk`和`Application.mk`。

1. **Android.mk**：Android.mk是一个Makefile文件，用于定义构建Android应用程序的本地代码的编译规则和依赖关系。在Android.mk中，你可以指定要编译的源代码文件、库文件、编译选项、链接选项等。你可以使用模块的方式组织代码，定义多个模块，并为每个模块指定相应的源文件、编译选项和链接选项。Android.mk还支持使用预定义的变量和函数来简化构建过程。

2. **Application.mk**：Application.mk是另一个Makefile文件，用于定义构建Android应用程序的本地代码的全局编译选项。在Application.mk中，你可以指定编译器的选项、编译器的版本、编译目标平台、编译目标架构等。这些全局编译选项将应用于整个项目的本地代码编译过程。

Android.mk和Application.mk文件通常与NDK-Build一起使用，它们提供了灵活的方式来定义和管理Android应用程序的本地代码的编译规则和选项。通过使用这些Makefile文件，你可以自定义构建过程，控制编译和链接的细节，并优化应用程序的性能和可移植性。

需要注意的是，随着Android Gradle插件的不断发展和NDK-Build的逐渐退出舞台，使用CMake来构建Android应用程序的趋势越来越明显。CMake提供了更强大、灵活和易用的构建系统，可以更好地支持Android应用程序的本地代码构建。

Android 使用 Android.mk 文件来配置 makefile，下面是一个最简单的 Android.mk：

```makefile
# 源文件在的位置。宏函数 my-dir 返回当前目录（包含 Android.mk 文件本身的目录）的路径。
LOCAL_PATH := $(call my-dir)

# 引入其他makefile文件。CLEAR_VARS 变量指向特殊 GNU Makefile，可为您清除许多 LOCAL_XXX 变量
# 不会清理 LOCAL_PATH 变量
include $(CLEAR_VARS)

# 指定库名称，如果模块名称的开头已是 lib，则构建系统不会附加额外的前缀 lib；而是按原样采用模块名称，并添加 .so 扩展名。
LOCAL_MODULE := hello
# 包含要构建到模块中的 C 和/或 C++ 源文件列表 以空格分开
LOCAL_SRC_FILES := hello.c
# 构建动态库
include $(BUILD_SHARED_LIBRARY)
```

### CMake

`CMake`是一个跨平台的构建工具，可以用简单的语句来描述所有平台的安装(编译过程)。能够输出各种各样的`makefile`或者`project`文件。Cmake 并不直接建构出最终的软件，而是产生其他工具的脚本（如Makefile ），然后再依这个工具的构建方式使用。
Android Studio利用CMake生成的是`ninja`，ninja是一个小型的关注速度的构建系统。我们不需要关心ninja的脚本，知道怎么配置cmake就可以了。

见：[[CMake]]

### LLDB/LLVM

`LLVM`（Low Level Virtual Machine）和`LLDB`（LLVM Debugger）是两个与编程语言相关的工具，它们有以下区别：

1. 功能：LLVM是一个编译器基础设施，提供了一系列工具和库，用于编译、优化和生成可执行文件。它包括了编译器前端（如`Clang`）、中间表示（`LLVM IR`）、优化器和后端。而LLDB是一个调试器，用于调试和分析程序的执行过程，提供了断点设置、变量查看、堆栈跟踪等调试功能。
2. 用途：LLVM广泛用于编程语言的编译器开发，它支持多种编程语言，包括C、C++、Rust等，并且能够生成高质量的机器码。LLDB主要用于调试和分析C、C++等编程语言的程序，它可以与LLVM配合使用，提供强大的调试功能。
3. 架构：LLVM是一个模块化的编译器基础设施，它的架构设计使得各个组件可以独立使用和扩展。LLDB则是建立在LLVM之上的调试器，利用LLVM提供的中间表示和优化器来分析和调试程序。
4. 语言支持：LLVM支持多种编程语言，而LLDB主要用于C、C++等编程语言的调试。LLDB还可以与其他调试器接口（如GDB）进行交互，以支持更多的调试功能。

总之，LLVM是一个编译器基础设施，用于编译、优化和生成可执行文件，而LLDB是一个调试器，用于调试和分析程序的执行过程。它们在功能、用途和架构上有所不同，但可以相互配合使用以提供完整的编译和调试体验。

## 交叉编译

在一个平台上编译出另一个平台上可以执行的二级制文件的过程叫做**交叉编译**。比如在 MacOS 上编译出 Android 上可用的库文件。如果想要编译出可以在 Android 平台上运行的库文件就需要使用 NDK。

### 两种库文件

Linux 平台上的库文件分为两种：

- **静态库：** 编译链接时，把库文件的代码全部加入到可执行文件中，因此生成的文件比较大，但在运行时也就不再需要库文件了，Linux 中后缀名为 `.a`。
- **动态库：** 在编译链接时并没有把库文件的代码加入到可执行文件中，而是在程序执行时由运行时链接文件加载库。Linux 中后缀名为 `.so`，`GCC` 在编译时默认使用动态库。

## 配置 NDK 步骤

- 新建工程

- 配置 AS 中的 NDK 路径

`File→Project Structure→SDK Location→Android NDK  location` 或者 `local.properties` 配置

```properties
sdk.dir=D\:\\android\\SDK
```

- 编译生成. Class 文件

Build→Make Project，目的是通过 AS 命令动态生成头文件 (xxx. C 文件)

- 在 Kotlin 层定义本地 (native)方法

报错

```java
class DynamicRegister {  
    companion object {  
        init {  
            System.loadLibrary("jni")  
        }  
    }  
    // 动态注册  
    external fun dynamicJavaFunc1()  
    external fun dynamicJavaFunc2(i: Int): Int  
    // 动态注册 end}
}
```

- 在 AS 中生成 JNI 目录以及对应的. H 文件

- 命令行

```shell
cd app/src/main/java
javad -d ../jni me.hacket.demo.ItemActivity
```

然后会在 main 目录中生成一个 jni 目录，并生成 me_hacket_demo_ItemActicity. H 文件

> 其中 ItemActivity 是带有 native 方法的 Java 文件

- AS 工具直接生成

- 在 app/build. Gradle

在 `android{}` 中配置 ndk 配置

```kotlin
android {
	defaultConfig {
		externalNativeBuild {  
		    cmake {  
		        cppFlags += "-std=c++11"  
		    }  
		}
	}
	externalNativeBuild {  
	    cmake {  
	        path = file("src/main/cpp/CMakeLists.txt")  
	        version = "3.22.1"  
	    }  
	}
}
```

- 指定项目中的 NDK 的路径（一般情况下是工具自动配置）

```properties
// local.properties
ndk.dir=G\:\\android-ndk-r9b
sdk.dir=D\:\\Android_sdk\\sdk
```

- 配置 NDK 支持低版本（不配置编译不通过）

在 `gradle.properties` 文件中配置

```properties
// gradle.properties
android.useDeprecatedNdk=true
```

- 实现头文件，写 C++ 代码

```cpp
void dynamicNativeFunc1() {
    LOGE("调用了 dynamicJavaFunc1");
}

// 如果方法带有参数, 前面要加上 JNIEnv *env, jobject thisz
jint dynamicNativeFunc2(JNIEnv *env, jobject thiz, jint i) {
    LOGE("调用了 dynamicTest2，参数是:%d", i);
    return 66;
}

// 需要动态注册的方法，需要放在这个数组中，否则会找不到方法
static const JNINativeMethod methods[] = {
        {
                // Java中的方法名, Java中的方法签名, 对应的C++方法
                "dynamicJavaFunc1", "()V", (void *) dynamicNativeFunc1
        },
        {
                // Java中的方法名, Java中的方法签名, 对应的C++方法
                "dynamicJavaFunc2", "(I)I", (int *) dynamicNativeFunc2
        }
};
// 需要动态注册native方法的类名，用/分隔包名和类名，这里是me/hacket/jni/DynamicRegister，对应的是DynamicRegister.java
static const char *className = "me/hacket/jni/DynamicRegister";

jint JNI_OnLoad2(JavaVM *vm, void *reserved) {
    LOGD("JNI_OnLoad dynamic_register.cpp");
    // 定义JNI环境对象
    JNIEnv *env = NULL;
    // 获取JNI环境对象，这里是获取当前线程的JNI环境对象，如果是子线程，需要先Attach到VM上，使用完后再Detach；
//    int result = vm->GetEnv((void **) &env, JNI_VERSION_1_6);
    int result = vm->GetEnv(reinterpret_cast<void **>(&env), JNI_VERSION_1_6);
    // 如果获取失败，返回错误码
    if (result != JNI_OK) {
        LOGE("获取JNI环境对象失败");
        return -1;
    }
    // 获取类对象
    jclass clazz = env->FindClass(className);
    if (clazz == NULL) {
        LOGE("找不到类：%s", className);
        return -1;
    }
    // 注册方法
    // 获取methods数组的大小，即需要注册的方法数量，然后注册方法
    jint size = sizeof(methods) / sizeof(JNINativeMethod);
    LOGI("size = %d", size);
    // 注册方法，返回值是注册成功的方法数量，如果不等于size，说明注册失败，返回错误码
    result = env->RegisterNatives(clazz, methods, size);
    if (result != JNI_OK) {
        LOGE("注册方法失败");
        return JNI_VERSION_1_4;
    }
    LOGI("JNI动态注册方法成功");
    return JNI_VERSION_1_6;
}
```

- 配置 `CMakeLists.txt`

```txt
cmake_minimum_required(VERSION 3.22.1)

project("jni")

add_library(${CMAKE_PROJECT_NAME} SHARED native_thread.cpp)

target_link_libraries(${CMAKE_PROJECT_NAME}
        android
        log)
```

- 加载 so 文件

```kotlin
class DynamicRegister {  
    companion object {  
        init {  
            System.loadLibrary("jni")  
        }  
    }  
}
```

## Ref

- [NDK 使用入门  |  Android NDK  |  Android Developers](https://developer.android.com/ndk/guides)
