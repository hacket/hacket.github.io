---
date created: 2024-04-13 00:03
tags:
  - '#include'
  - '#ifdef'
  - '#endif'
  - '#define'
  - '#if'
date updated: 2024-12-24 00:34
dg-publish: true
---

# JNI 入门

## JNI 概述

### 什么是 JNI?

**JNI**，全名 `Java Native Interface`，是Java本地接口，JNI是Java调用Native 语言的一种特性，通过JNI可以使得Java与C/C++机型交互。简单点说就是JNI是Java中调用C/C++的统称。

### 什么是 NDK？

**NDK（Native Development Kit）** 是一套工具，让你能够在 Android 应用中使用 C 和 C++ 语言编写的代码。NDK 提供了工具链和支持文件，使你能够为不同架构的 Android 设备构建本地代码库，并确保你的代码利用了设备的硬件性能。NDK 也配合 JNI 使用，让你能够把这些更快的代码库嵌入到更大的 Java 应用中。

### JNI 和 NDK 区别？

- JNI：它是 Java 和本机语言之间互操作所用到的接口，是一个概念性的框架，可以不依赖任何特定工具，只要遵循了 Java 的标准即可在任何 Java 应用中使用。
- NDK：是为 Android 应用开发提供的一套完整的设置，使得你可以用 C 和 C++ 编写高性能的组件。相比于 JNI，`NDK 是针对特定平台（Android）的一套工具和构建系统`。

总结来说，JNI 是在 Java 平台中允许 Java 应用调用本机代码和本机代码调用 Java 应用的接口标准，而 NDK 是 Android 平台提供的一套特定的工具和库，它支持 JNI 并提供了更多的功能使得在 Android 应用中集成和使用本机代码变得更加简单。

## JNI 基础

### JNI/NDK 环境配置

1. 下载 NDK
2. 下载 CMake
3. 配置 NDK 路径

### 示例

#### JNI helloworld

- 新建 C++工程

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405100107177.png)

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405100111685.png)

- 目录结构如下：

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405100115806.png)

- kotlin 代码

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        // Example of a call to a native method
        binding.sampleText.text = stringFromJNI()
    }
    /**
     * A native method that is implemented by the 'jni' native library,
     * which is packaged with this application.
     */
    external fun stringFromJNI(): String
    companion object {
        // Used to load the 'jni' library on application startup.
        init {
            System.loadLibrary("jni")
        }
    }
}
```

- cpp 代码

```cpp
#include <jni.h>
#include <string>
extern "C" JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_stringFromJNI(
        JNIEnv* env,
        jobject /* this */) {
    std::string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}
```

- `CMakeLists.txt`

```cpp
# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html.
# For more examples on how to use CMake, see https://github.com/android/ndk-samples.

# Sets the minimum CMake version required for this project.
cmake_minimum_required(VERSION 3.22.1)

# Declares the project name. The project name can be accessed via ${ PROJECT_NAME},
# Since this is the top level CMakeLists.txt, the project name is also accessible
# with ${CMAKE_PROJECT_NAME} (both CMake variables are in-sync within the top level
# build script scope).
project("jni")

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.
#
# In this top level CMakeLists.txt, ${CMAKE_PROJECT_NAME} is used to define
# the target library name; in the sub-module's CMakeLists.txt, ${PROJECT_NAME}
# is preferred for the same purpose.
#
# In order to load a library into your app from Java/Kotlin, you must call
# System.loadLibrary() and pass the name of the library defined here;
# for GameActivity/NativeActivity derived applications, the same library name must be
# used in the AndroidManifest.xml file.
add_library(${CMAKE_PROJECT_NAME} SHARED
        # List C/C++ source files with relative paths to this CMakeLists.txt.
        native-lib.cpp)

# Specifies libraries CMake should link to your target library. You
# can link libraries from various origins, such as libraries defined in this
# build script, prebuilt third-party libraries, or Android system libraries.
target_link_libraries(${CMAKE_PROJECT_NAME}
        # List libraries link to the target library
        android
        log)
```

#### 示例2：Java

- 编写 Java

```java
// 带有native方法的Java文件
public final class JniJava {
    public native String changeNameFromCPlusPlus(int i, String j, float k);
}

// Java调用native方法
public class MainActivity extends AppCompatActivity {
    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Example of a call to a native method
        TextView tv = findViewById(R.id.sample_text);
        tv.append("\n");

        JniJava jniJava = new JniJava();
        tv.append(jniJava.changeNameFromCPlusPlus(110, "hacket", 3.14f));
    }
}
```

- 编写 C++

```c
#include <jni.h> // jni头文件，由JDK提供
#include <stdio.h>
using namespace std;

#ifdef __cplusplus
extern "C" // C++中以C的方式编译
{
/*
 * Class:     me_hacket_jnidemo_JniJava
 * Method:    changeNameFromCPlusPlus
 * Signature: (I)Ljava/lang/String;
 */
/*
 * JNIEnv: 由Jvm传入与线程相关的变量，定义了JNI系统操作、Java交互等方法，C语言用(*env)，C语言定义的是一个二级指针，C++用env->
 * jobject：表示当前调用的对象，即this，如果是静态的native方法，则是jclass；
 * 参数列表：
 */
JNIEXPORT jstring JNICALL Java_me_hacket_jnidemo_JniJava_changeNameFromCPlusPlus (JNIEnv *env, jobject, jint i, jstring j, jfloat k) {
    // 获得C字符串
    const char *str = env->GetStringUTFChars(j, JNI_FALSE); //  参数2 isCopy：提供一个boolean（int）指针，用于接收jvm传给我们的字符串是否是拷贝的；通常，我们不关心这个,一般传个NULL就可以。
    char returnStr[100];
    // 格式化字符串
    sprintf(returnStr, "C++ string:%d,%s,%f",i,str,k);
    // 释放掉内存
    env->ReleaseStringUTFChars(j,str); //
    // 返回java字符串
    return env->NewStringUTF(returnStr);
}

}
#endif
```

- 编写 `CmakeLists.txt`

```c++
cmake_minimum_required(VERSION 3.4.1)
add_library( # Sets the name of the library.
             native-lib
             # Sets the library as a shared library.
             SHARED
             # Provides a relative path to your source file(s).
             src/main/cpp/native-lib.cpp )

find_library( # Sets the name of the path variable.
              log-lib
              # Specifies the name of the NDK library that
              # you want CMake to locate.
              log )

target_link_libraries( # Specifies the target library.
                       native-lib
                       # Links the target library to the log library
                       # included in the NDK.
                       ${log-lib} )
```

- 编译

### `jni.h`

**jni.h** 是 JNI（Java Native Interface）编程接口的头文件，它是在使用 C 或 C++ 语言编写本地方法时需要包含的文件。这个头文件定义了各种函数和宏，它们是在本地代码中与 Java 虚拟机沟通的基础。通过这些函数和宏，你可以在本地代码中创建和操作 Java 对象，调用 Java 方法，捕获和抛出异常，以及执行其他与 JVM 互操作的任务。

jni.h 头文件提供的接口通常与 JNIEnv 指针相关联，它是代表本地代码和 Java 虚拟机之间通信的上下文环境。这个指针提供了大量的操作函数。以下是 jni.h 中定义的一些主要功能：

- 版本控制：检查你的 JNI 版本，确保兼容性。
- 对象操作：创建新的 Java 对象，获取和设置对象的字段。
- 数组操作：创建和操作 Java 数组。
- 字符串操作：创建和操作 Java 字符串。
- 类型转换：在 Java 数据类型和本地数据类型之间转换。
- 调用 Java 方法：从本地代码调用 Java 方法。
- 异常处理：抛出和检查 Java 异常。
- 引用管理：创建和删除对 Java 对象的全局和局部引用。

#### JNI API

参考[官方 API 文档](https://docs.oracle.com/javase/10/docs/specs/jni/index.html) 或者 [JNI 方法大全及使用示例](https://blog.csdn.net/afei__/article/details/81016413)

### JNIEnv 和 JavaVm

#### JNIEnv

`JNIEnv` 表示 `Java` 调用 `native` 语言的环境，是一个封装了几乎全部 `JNI` 方法的指针。JNIEnv 类型实际上代表了 Java 环境，通过这个 `JNIEnv*` 指针，就可以对 Java 端的代码进行操作：

- 调用 Java 函数
- 操作 Java 对象

`JNIEnv` 只在创建它的线程生效，不能跨线程传递，不同线程的 `JNIEnv` 彼此独立。
`native` 环境中创建的线程，如果需要访问 `JNI`，必须要调用 `AttachCurrentThread` 关联，并使用 `DetachCurrentThread` 解除链接。

`JNIEnv` 是一个指向函数指针的结构体，这个结构体提供了许多函数指针，使得本地代码 `（C/C++）` 可以与 `Java` 代码互操作。每个 `JNI` 函数都通过一个 `JNIEnv` 类型的参数来访问 `JVM` 功能。

`JNIEnv` 类中有很多函数可以用，如下所示:

- `NewObject`: 创建 Java 类中的对象。
- `NewString`: 创建 Java 类中的 String 对象。
- `NewArray`: 创建类型为 Type 的数组对象。
- `GetField`: 获取类型为 Type 的字段。
- `SetField`: 设置类型为 Type 的字段的值。
- `GetStaticField`: 获取类型为 Type 的 static 的字段。
- `SetStaticField`: 设置类型为 Type 的 static 的字段的值。
- `CallMethod`: 调用返回类型为 Type 的方法。
- `CallStaticMethod`: 调用返回值类型为 Type 的 static 方法。

**代码风格 (C/C++)：**

```cpp
// C
(*env)->NewStringUTF(env, "Hellow World!");
// C++
env->NewStringUTF("Hellow World!");
```

**JNI 本质：** `JNIEnv` 的本质是一个与线程相关的结构体，里面存放了大量的 JNI 函数指针：

```cpp
struct _JNIEnv {
    /**
    * 定义了很多的函数指针
    **/
    const struct JNINativeInterface* functions;

#if defined(__cplusplus)
    /// 通过类的名称(类的全名，这时候包名不是用.号，而是用/来区分的)来获取jclass    
    jclass FindClass(const char* name)
    { return functions->FindClass(this, name); }
    // ...
}
```

**JNIEnv 的结构图如下：**

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405140008140.png)

#### JavaVm

`JavaVM` 是虚拟机在 `JNI` 层的代表，**一个进程只有一个 JavaVM**，所有的线程共用一个 `JavaVM`。

**JavaVM 结构图：**

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405140009435.png)

### `jobject` 和 `jclass`

在 JNI（Java Native Interface）中，`jobject` 和 `jclass` 是两个基本的数据类型，它们都是指针类型，用于在 JNI 中引用 Java 对象。

#### Jobject

`jobject` 是一个通用的引用类型，代表任何 Java 对象的引用，或者说是一个对 Java 对象的本地句柄。当你从 JNI 调用返回一个对象时，或者当你传递一个 Java 对象到一个本地方法时，你会使用 `jobject` 类型。`jobject` 类型并不指定 Java 中对象的具体类型，它只是提供了一个通用的引用。

**示例：**

```cpp
extern "C" JNIEXPORT jstring JNICALL
Java_com_wangzhen_jnitutorial_MainActivity_stringFromJNI(JNIEnv *env, jobject thiz) {
	// ...
}
// thiz就是MainActivity
```

#### Jclass

`jclass` 是 `jobject` 的一个特殊化，它代表 Java 对象的类本身。简单来说，`jclass` 是指向 Java 类元数据的引用，可以看作是 Java 中的 `Class` 对象在 JNI 的等价物。你会用 `jclass` 来获取类的方法 ID、字段 ID，或者对类进行操作，比如检查成员、调用静态方法、获取静态字段等。

当你需要操作类级别的信息，而不是实例对象时，你就会使用 `jclass`。它通常在你需要访问类的静态成员或者需要创建类的新实例时使用。你可以通过调用 `JNIEnv` 的 `FindClass` 函数来获取一个 `jclass` 引用。

### Extern "C"

**使用 extern C：**
在 JNI（Java Native Interface）代码中使用 `extern "C"` 的原因与 C++ 的名称修饰（name mangling）机制有关。名称修饰是 C++ 用来支持函数重载的特性，它允许多个函数拥有相同的名字，只要它们的参数类型不同。C++ 编译器通过改变函数名（添加额外的字符和信息）来实现这个功能。这意味着同一个函数在 C++ 编译器编译后的二进制文件中可能会有一个不同于其在代码中的名称，因此，使得其在链接阶段难以被精确识别。

由于 JNI 设计为支持多种语言，特别是需要兼容 C 语言，而 C 语言不支持名称修饰。因此，我们需要确保导出到 JNI 的函数名在编译后不会被修饰，以允许 Java 虚拟机能正确无误地识别和链接到这些函数。使用 extern "C" 告诉 C++ 编译器对于这些特定的函数不进行名称修饰，保持它们的名称与源代码中声明的完全一致。

**示例：**

```cpp
extern "C" JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_stringFromJNI(JNIEnv *env, jobject /* this */) {
}
```

> Extern "C" 告诉 C++ 编译器这个函数应该使用 C 的链接约定（linkage），这样就保证了当 Java 代码试图加载这个本地方法时，其名称能够与 C++ 代码库中的相应函数匹配上。

简而言之，使用 extern "C" 是为了确保在 Java 与 C++ 本地代码之间的互操作性中，函数名称的一致性和正确性。这是 JNI 与 C++ 集成时确保函数名不被 C++ 编译器修改的标准做法。

### JNIEXPORT 和 JNICALL

#### JNIEXPORT 导出

`JNIEXPORT` 宏用来在编译原生方法时确保这些函数符号对外可见，即告诉编译器将函数导出，使得它们可以从外部链接。这是因为默认情况下，如果没有特意指定，C++ 编译器可能不导出所有符号。对于 Windows 平台， JNIEXPORT 被定义为 __declspec (dllexport)，这是一个特殊的 Microsoft C/C++ 编译器关键字，它允许将函数导出到 DLL 的符号表中。而在其他操作系统（如 Linux 或 macOS），这个宏可能被定义为空，因为这些系统默认会导出在共享库中定义的所有符号。

> 在类 Unix 中无定义，在 Windows 中定义为：`_stdcall` ，一种函数调用约定；**类 Unix 系统中这两个宏可以省略不加**

`jni.h` 中的定义：

```cpp
#define JNIEXPORT  __attribute__ ((visibility ("default")))
```

GCC 有个 `visibility` 属性, 该属性是说, 启用这个属性:

- 当 `-fvisibility=hidden` 时，动态库中的函数默认是被隐藏的即 `hidden`。
- 当 `-fvisibility=default` 时，动态库中的函数默认是可见的。

#### JNICALL 调用

JNICALL 宏用来指定函数的调用约定。在 JNI 中，JNICALL 通常被定义为 __stdcall，这是一种用于 Windows 平台的标准调用约定，用于改变函数参数在栈上的传递方式。在其他平台上，如 Unix 或 Linux，JNICALL 通常不被需要，或被定义为空。调用约定确保 Java 虚拟机可以正确地调用原生方法。

- 在 Linux/Unix/Mac os/Android 这种类 Unix 系统中，它是个空的宏定义： `#define JNICALL`，所以在 android 上删除它也可以。快捷生成 `.h` 代码

`jni.h` 中的定义：

```cpp
#define JNICALL
```

**总结一下**，`JNICALL` 确保函数使用正确的调用约定，而 `JNIEXPORT` 确保函数在共享库中是可见的。这两个宏对于 `JNI` 函数的正确链接和执行是必要的，无论是在 `Windows` 上的 `DLL` 还是在 `Unix` 类系统上的共享对象（`.so` 文件）中。

### JNI 输出到 Logcat

```c
#include <android/log.h>

#define LOG_TAG "hacket" // 在LogCat上打印出来的TAG
#define LOGV(...) __android_log_print(ANDROID_LOG_VERBOSE, LOG_TAG, __VA_ARGS__)
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGW(...) __android_log_print(ANDROID_LOG_WARN, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)


JNIEXPORT jint JNICALL // Linux中可以不写，Windows平台才需要写
Java_me_hacket_jnidemo_JniJava_testCpp(JNIEnv *env,jobject,jintArray b_, jobjectArray a_) {

    int32_t str_length = env->GetArrayLength(a_);
    LOGE("字符串数组长度：%d", str_length);

    int32_t int_length = env->GetArrayLength(b_);
    LOGE("int数组长度：%d", int_length);
}
```

### 数据类型和类型描述符

Java 中有两种数据类型:

- 基本数据类型: `boolean` 、`char`、`byte`、`int`、`short`、`long`、`float`、`double`。
- 引用数据类型: `String`、`Object[]`、`Class`、`Object` 及其它类。

#### 基本数据类型 `Java和JNI速查`

基本数据类型可以直接与 `C/C++` 的相应基本数据类型映射，如下表所示。JNI 用类型定义使得这种映射对开发人员透明。

| Java 类型 | JNI 类型   | C/C++ 类型                     |
| ------- | -------- | ---------------------------- |
| boolean | jboolean | unsigned char (无符号 8 位整型)    |
| byte    | jbyte    | char (有符号 8 位整型)             |
| char    | jchar    | unsingned short (无符号 16 位整型) |
| short   | jshort   | short (有符号 16 位整型)           |
| int     | jint     | int (有符号 32 位整型)             |
| long    | jlong    | long (有符号 64 位整型)            |
| float   | jfloat   | float (有符号 32 位浮点型)          |
| double  | jdouble  | double (有符号 64 位双精度型)        |

##### `int[]` 数组和 `String[]` 数组在 jni 中的处理

```c++
// C++
JNIEXPORT jint JNICALL // Linux中可以不写，Windows平台才需要写
Java_me_hacket_jnidemo_JniJava_testCpp(JNIEnv *env, jobject, jintArray b_, jobjectArray a_) {

    //获得数组长度
    int32_t str_length = env->GetArrayLength(a_);
    LOGD("字符串数组长度：%d", str_length);

    for (int i=0; i<str_length; i++) {
      //获得字符串数组的数据
      jstring str = static_cast<jstring>(env->GetObjectArrayElement(a_,i));
      const char* c_str = env->GetStringUTFChars(str, 0);
      LOGI("字符串有：%s", c_str);
       //使用完释放
      env->ReleaseStringUTFChars(str,c_str);
    }

    //获得数组长度
    int32_t int_length = env->GetArrayLength(b_);
    LOGV("int数组长度：%d", int_length);
    jint *b = env->GetIntArrayElements(b_, 0); // 对应的有 GetBoolean 、GetFloat等
    for (int i=0; i< int_length ; i++) {
        LOGW("int数组有：%d", b[i]);
    }
    env->ReleaseIntArrayElements(b_, b, 0);
    return 110;
}

// Java
public native int testCpp(int[] i, String[] j);
```

结果：

```
03-03 19:26:35.732 13691-13691/? D/hacket: 字符串数组长度：4
03-03 19:26:35.732 13691-13691/? I/hacket: 字符串有：hack
03-03 19:26:35.732 13691-13691/? I/hacket: 字符串有：et
03-03 19:26:35.732 13691-13691/? I/hacket: 字符串有：haha
03-03 19:26:35.732 13691-13691/? I/hacket: 字符串有：hehe
03-03 19:26:35.732 13691-13691/? V/hacket: int数组长度：5
03-03 19:26:35.732 13691-13691/? W/hacket: int数组有：1
03-03 19:26:35.732 13691-13691/? W/hacket: int数组有：2
03-03 19:26:35.732 13691-13691/? W/hacket: int数组有：54
03-03 19:26:35.732 13691-13691/? W/hacket: int数组有：3
03-03 19:26:35.732 13691-13691/? W/hacket: int数组有：-1
```

#### 引用类型

与基本数据类型不同，引用类型对原生方法时不透明的，引用类型映射如下表所示。它们的内部数据结构并不直接向原生代码公开。

| Java 类型             | 原生类型          |
| ------------------- | ------------- |
| Java.lang.Class     | jclass        |
| Java.lang.Throwable | jthrowable    |
| Java.lang.String    | jstring       |
| Other object        | jobject       |
| Java.lang.Object[]  | jobjectArray  |
| boolean[]           | jbooleanArray |
| byte[]              | jbyteArray    |
| char[]              | jcharArray    |
| short[]             | jshortArray   |
| int[]               | jintArray     |
| long[]              | jlongArray    |
| float[]             | jfloatArray   |
| double[]            | jdoubleArray  |
| Other arrays        | jarray        |

![500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405140013124.png)

#### 数据类型描述符

在 `JVM` 虚拟机中，存储数据类型的名称时，是使用指定的描述符来存储，而不是我们习惯的 `int`，`float` 等。

| Java 类型     | 签名 (描述符)    |
| ----------- | ----------- |
| boolean     | Z           |
| byte        | B           |
| char        | C           |
| short       | S           |
| int         | I           |
| long        | J           |
| float       | F           |
| double      | D           |
| void        | V           |
| 其它引用类型      | L + 全类名 + ； |
| type[]      | `[type`     |
| method type | (参数)返回值     |

- 基本数据类型的比较好理解，不如要获取一个 `int` ，`GetFieldID` 需要传入签名就是 `I`；
- 如果是一个类，比如 `String`，签名就是 `L+全类名;` ：`Ljava.lang.String;`
- 如果是一个 `int arra`y，就要写作 `[I`
- 如果要获取一个方法，那么方法的签名是:`(参数签名)返回值`签名，参数如果是多个，中间不需要加间隔符，比如：

| Java 方法                                | JNI 签名                     |
| -------------------------------------- | -------------------------- |
| `void f (int n);`                      | `(I)V`                     |
| `void f (String s,int n);`             | `(Ljava/lang/String;I)V`   |
| `long f (int n, String s, int[] arr);` | `(ILjava/lang/String;[I)J` |

**示例:**

```cpp
// 表示一个 String
// Java类型: java.lang.String
// JNI 描述符: Ljava/lang/String; (L+类全名+;)

// 表示一个数组
// Java类型: String[] 
// JNI 描述符: [Ljava/lang/String; 

// Java 类型: int [][] 
// JNI 描述符: [[I

// 表示一个方法
// Java 方法: long func(int n, String s, int[] arr);  JNI 描述符: (ILjava/lang/String;[I)J
// Java 方法: void func(); JNI 描述符: ()V
```

#### Java 方法签名

JVM 为我们提供的方法签名实际上是由**方法名**（上下文的例子简单没有写出全类名）、**形参列表**、**返回值**三部分构成，基本形式就是：`全类名.方法名(形参数据类型列表)返回值数据类型`

```java
public void test1(){}      //test1()V
public void test2(String str)      //test2(Ljava/lang/String;)V
public int test3(){}       //test3()I
```

其中，签名中的特殊字符/字母含义：![image.png|700](https://cdn.nlark.com/yuque/0/2023/png/694278/1687972125210-c9db4da7-b8ba-4ad2-82d4-50d54bbb48af.png#averageHue=%23f7f7f7&clientId=u7d92a401-3b02-4&from=paste&height=482&id=ud249879e&originHeight=723&originWidth=1460&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=81409&status=done&style=none&taskId=ud5852258-aa67-4128-a772-95fc46ca388&title=&width=973.3333333333334)

可以使用命令 : `javap -s 全路径` 来获取方法签名

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405110018055.png)

#### Field and Method IDs

JNIEvn 操作 Java 对象时利用 Java 中的反射，操作某个属性都需要 field 和 method 的 id，这些 id 都是指针类型：

```cpp
struct _jfieldID;              /* opaque structure */ 
typedef struct _jfieldID *jfieldID;   /* field IDs */ 
 
struct _jmethodID;              /* opaque structure */ 
typedef struct _jmethodID *jmethodID; /* method IDs */ 
```

### JNI中几种引用的区别？

从JVM创建的对象传递到C/C++代码时会产生引用，由于Java的垃圾回收机制限制，只要对象有引用存在就不会被回收。所以无论在C/C++中还是Java中我们在使用引用的时候需要特别注意。JNI 分为三种引用：

- **全局引用**（Global Reference），类似 Java 中的全局变量
- **局部引用**（Local Reference），类似 Java 中的局部变量
- **弱全局引用**（Weak Global Reference），类似 Java 中的弱引用

#### **全局引用（Global Reference）**

全局引用可以跨多个线程，在多个函数中都有效。全局引用需要通过`NewGlobalRef`方法手动创建，对应的释放全局引用的方法为`DeleteGlobalRef`

JNI 允许程序员从局部引用创建全局引用：

```cpp
static jstring globalStr;
if(globalStr == NULL){
   jstring str = env->NewStringUTF("C++");
   // 从局部变量 str 创建一个全局变量
   globalStr = static_cast<jstring>(env->NewGlobalRef(str));
   
   // 局部可以释放，因为有了一个全局引用使用str，局部str也不会使用了
   env->DeleteLocalRef(str);
}
```

全局引用在显式释放之前保持有效，可以通过 `DeleteGlobalRef` 来手动删除全局引用调用。

**示例：**

```cpp
jclass personClass;
extern "C"  //支持 C 语言
JNIEXPORT void JNICALL //告诉虚拟机，这是jni函数
native_test4(JNIEnv *env, jobject instance) {
    LOGD("测试局部引用")

    if (personClass == NULL) {
        //1. 提升全局解决不能重复使用问题
 		  const char *person_class = "me/hacket/ndk_sample/Person";
        jclass jclass1 = env->FindClass(person_class);
        personClass = static_cast<jclass>(env->NewGlobalRef(jclass1));
        LOGD("personClass == null 执行了。")
    }

    //Java Person 构造方法实例化
    const char *sig = "()V";
    const char *method = "<init>";//Java 构造方法标识
    jmethodID init = env->GetMethodID(personClass, method, sig);
    //创建出来
    env->NewObject(personClass, init);

    //2. 显式释放主动删除全局引用
    env->DeleteGlobalRef(personClass);
    personClass = NULL;
}
```

#### **局部引用（Local Reference）**

局部引用很常见，基本上通过JNI函数获取到的返回引用都算局部引用，局部引用只在单个函数中有效。局部引用会在函数返回时自动释放，当然我们也可以通过`DeleteLocalRef`方法手动释放。

**创建：**
JNI 函数返回的所有 Java 对象都是局部引用，比如在 JNI 方法中调用的 `NewObject/FindClass/NewStringUTF` 等等都是局部引用。全局引用显示释放前一直有效，它们可以被其它原生函数及原生线程使用。

**弱全局引用的有效性检验：**
可以用 `IsSameObject` 函数来检验一个弱全局引用是否仍然指向活动的类实例。

**释放：**

- 自动释放 局部引用在方法调用期间有效，并在方法返回后被 JVM 自动释放。
- 手动释放

**手动释放的场景：**

- `本机方法访问大型Java对象`，从而创建对Java对象的局部引用。然后，本机方法在返回到调用方之前执行附加计算。对大型Java对象的本地引用将防止对该对象进行垃圾收集，即使该对象不再用于计算的其余部分。
- `本机方法创建大量本地引用`，但并非所有本地引用都同时使用。因为 JVM 需要一定的空间来跟踪本地引用，所以创建了太多的本地引用，这可能导致系统内存不足。例如，本机方法循环遍历一个大型对象数组，检索作为本地引用的元素，并在每次迭代时对一个元素进行操作。每次迭代之后，程序员不再需要对数组元素的本地引用。

所以我们应该养成手动释放本地引用的好习惯。

**手动释放的方式：**

- `GetXXX` 就必须调用 `ReleaseXXX`。

> 在调用 `GetStringUTFChars` 函数从 JVM 内部获取一个字符串之后，JVM 内部会分配一块新的内存，用于存储源字符串的拷贝，以便本地代码访问和修改。即然有内存分配，用完之后马上释放是一个编程的好习惯。通过调用`ReleaseStringUTFChars`函数通知 JVM 这块内存已经不使用了。

- 对于手动创建的 `jclass`，`jobject` 等对象使用 `DeleteLocalRef` 方法进行释放

**示例：**

```cpp
jclass personClass;
extern "C"  //支持 C 语言
JNIEXPORT void JNICALL //告诉虚拟机，这是jni函数
native_test4(JNIEnv *env, jobject instance) {
    LOGD("测试局部引用")
    if (personClass == NULL) {
        const char *person_class = "me/hacket/ndk_sample/Person";
        personClass = env->FindClass(person_class);
        LOGD("personClass == null 执行了。")
    }
    //Java Person 构造方法实例化
    const char *sig = "()V";
    const char *method = "<init>";//Java 构造方法标识
    jmethodID init = env->GetMethodID(personClass, method, sig);
    //创建出来
    env->NewObject(personClass, init);
}
```

#### **弱全局引用（Weak Global Reference）**

弱引用也需要自己手动创建，作用和全局引用的作用相似，不同点在于弱引用不会阻止垃圾回收器对引用所指对象的回收。我们可以通过`NewWeakGlobalRef`方法来创建弱引用，也可以通过`DeleteWeakGlobalRef`来释放对应的弱引用。

与全局引用类似，弱引用可以跨方法、线程使用。与全局引用不同的是，弱引用不会阻止 GC 回收它所指向的 VM 内部的对象；所以在使用弱引用时，必须先检查缓存过的弱引用是指向活动的对象，还是指向一个已经被 GC 的对象

```cpp
static jclass globalClazz = NULL;
//对于弱引用 如果引用的对象被回收返回 true，否则为false
//对于局部和全局引用则判断是否引用java的null对象
jboolean isEqual = env->IsSameObject(globalClazz, NULL);
if (globalClazz == NULL || isEqual) {
	jclass clazz = env->GetObjectClass(instance);
	globalClazz = static_cast<jclass>(env->NewWeakGlobalRef(clazz));
	env->DeleteLocalRef(clazz);
}
```

删除使用 `DeleteWeakGlobalRef`

**示例：**

```cpp
jclass personClass;
extern "C"  //支持 C 语言
JNIEXPORT void JNICALL //告诉虚拟机，这是jni函数
native_test4(JNIEnv *env, jobject instance) {
    LOGD("测试局部引用")

    if (personClass == NULL) {
        //1. 提升全局解决不能重复使用问题
        const char *person_class = "me/hacket/ndk_sample/Person";
        jclass jclass1 = env->FindClass(person_class);
        personClass = static_cast<jclass>(env->NewWeakGlobalRef(jclass1));
        LOGD("personClass == null 执行了。")
    }

    //Java Person 构造方法实例化
    const char *sig = "()V";
    const char *method = "<init>";//Java 构造方法标识
    jmethodID init = env->GetMethodID(personClass, method, sig);
    //创建出来
    env->NewObject(personClass, init);

    //2. 显式释放主动删除局部引用
    env->DeleteWeakGlobalRef(personClass);
    personClass = NULL;
}
```

#### 线程相关

局部变量只能在当前线程使用，而全局引用可以跨方法、跨线程使用，直到它被手动释放才会失效。

## JNI 线程操作

作为多线程环境的一部分，虚拟机支持运行的原生代码。在开发构件时要记住 JNI 技术的一些约束:

- 只有再原生方法执行期间及正在执行原生方法的线程环境下局部引用是有效的，局部引用不能再多线程间共享，只有全局可以被多个线程共享。
- 被传递给每个原生方法的 `JNIEnv` 接口指针在与方法调用相关的线程中也是有效的，它不能被其它线程缓存或使用。

### 同步

同步是多线程程序设计最终的特征。与 Java 同步类似， JNI 的监视器允许原生代码利用 Java 对象同步，虚拟机保证存取监视器的线程能够安全执行，而其他线程等待监视器对象变成可用状态。

```cpp
jint MonitorEnter(jobject obj)
```

对 `MonitorEnter` 函数的调用应该与对 `MonitorExit` 的调用相匹配，从而避免代码出现死锁。

**示例**

- Java

```java
public void test4(View view) {
	for (int i = 0; i < 10; i++) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				count();
				nativeCount();
			}
		}).start();
	}
}

private void count() {
	synchronized (this) {
		count++;
		Log.d("Java", "count=" + count);
	}
}

public native void nativeCount();
```

- C++: 未同步前

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_NativeThread_nativeCount(JNIEnv *env, jobject instance) {
    jclass cls = env->GetObjectClass(instance);
    jfieldID fieldID = env->GetFieldID(cls, "count", "I");
    int val = env->GetIntField(instance, fieldID);
    val++;
    LOGI("count=%d", val);
    env->SetIntField(instance, fieldID, val);
}
```

> 通过多线程对 count 字段操作，可以看见已经无法保证 count 的可见性了。这就需要 JNI 本地实现也要同步。

- C++同步后：

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_NativeThread_nativeCount(JNIEnv *env, jobject instance) {
    jclass cls = env->GetObjectClass(instance);
    jfieldID fieldID = env->GetFieldID(cls, "count", "I");

    if (env->MonitorEnter(instance) != JNI_OK) {
        LOGE("%s: MonitorEnter() failed", __FUNCTION__);
    }

    /* synchronized block */
    int val = env->GetIntField(instance, fieldID);
    val++;
    LOGI("count=%d", val);
    env->SetIntField(instance, fieldID, val);

    if (env->ExceptionOccurred()) {
        LOGE("ExceptionOccurred()...");
        if (env->MonitorExit(instance) != JNI_OK) {
            LOGE("%s: MonitorExit() failed", __FUNCTION__);
        }
    }

    if (env->MonitorExit(instance) != JNI_OK) {
        LOGE("%s: MonitorExit() failed", __FUNCTION__);
    }
}
```

> 现在保证了count 的可见性了。

### 原生线程

为了执行特定任务，这些原生构建可以并行使用原生线程。因为虚拟机不知道原生线程，因此它们不能与 Java 构建直接通信。为了与应用的依然活跃部分交互，原生线程应该先附着在虚拟机上。

`JNI` 通过 `JavaVM` 接口指针提供了 `AttachCurrentThread` 函数以便于让原生代码将原生线程附着到虚拟机上，如下代码所示, `JavaVM` 接口指针应该尽早被缓存，否则的话它不能被获取。

```cpp
JavaVM* jvm；
...
JNIEnv* env = NULL；
...
jvm->AttachCurrentThread(&env,0);//把 native 线程附着到 JVM 上
...
jvm->DetachCurrentThread();//解除 附着 到 JVM 的 native 线程
```

对 `AttachCurrentThread` 函数的调用允许应用程序获得对当前线程有效的 `JNIEnv` 接口指针。将一个已经附着的原生线程再次附着不会有任何副作用。当原生线程完成时，可以用 `DetachCurrentThread` 函数将原生线程与虚拟机分离。

**示例：**

- Java

```java
public class NativeThreadTest {
    static {
        System.loadLibrary("jni");
    }
    private AppCompatActivity activity;
    public NativeThreadTest(AppCompatActivity activity) {
        this.activity = activity;
        activity.getLifecycle().addObserver(new DefaultLifecycleObserver() {
            @Override
            public void onResume(@NonNull LifecycleOwner owner) {
                createNativeThread();
            }

            @Override
            public void onDestroy(@NonNull LifecycleOwner owner) {
                unThread();
            }
        });
    }
    // AndroidUI操作，让C++线程里面来调用
    private void updateUI() {
        if (Looper.getMainLooper() == Looper.myLooper()) {
            new AlertDialog.Builder(activity)
                    .setTitle("UI")
                    .setMessage("native 运行在主线程，直接更新 UI ...")
                    .setPositiveButton("确认", null)
                    .show();
        } else {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    new AlertDialog.Builder(activity)
                            .setTitle("UI")
                            .setMessage("native运行在子线程切换为主线程更新 UI ...")
                            .setPositiveButton("确认", null)
                            .show();
                }
            });
        }
    }
    private native void createNativeThread();
    private native void unThread();
}
```

- C++

```cpp
JavaVM *g_jvm = NULL; // 缓存JavaVM*

jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    LOGD("JNI_OnLoad native_thread.cpp");
    // 定义JNI环境对象
    JNIEnv *env = NULL;
    // 获取JNI环境对象，这里是获取当前线程的JNI环境对象，如果是子线程，需要先Attach到VM上，使用完后再Detach；
    int result = vm->GetEnv((void **) &env, JNI_VERSION_1_6);
    // 如果获取失败，返回错误码
    if (result != JNI_OK) {
        LOGE("获取JNI环境对象失败");
        return -1;
    }
    LOGI("获取JNI环境对象成功 %p", env);
    // 保存全局JVM以便在子线程中使用
    LOGI("保存全局JVM以便在子线程中使用 %p", vm);
    g_jvm = vm;
    return JNI_VERSION_1_6;
}

// 原生线程测试
jobject threadTestInstance = NULL;
/**
 * 自定义线程，调用Java方法，更新UI
 * @param pVoid
 * @return  void*
 */
void *customThread(void *pVoid) {
    // 调用的话，一定需要JNIEnv *env
    // JNIEnv *env 无法跨越线程，只有JavaVM才能跨越线程

    JNIEnv *env = NULL; // 全新的env
    int result = g_jvm->AttachCurrentThread(&env, 0); // 把native的线程，附加到JVM
    if (result != 0) {
        return 0;
    }

    // 获取threadTestInstance的class
    jclass threadTestClass = env->GetObjectClass(threadTestInstance);

    // 获取threadTestInstance的updateUI方法
    const char *sig = "()V";
    jmethodID updateUI = env->GetMethodID(threadTestClass, "updateUI", sig);

    // 调用threadTestInstance的updateUI方法
    env->CallVoidMethod(threadTestInstance, updateUI);

    // 解除 附加 到 JVM 的native线程
    g_jvm->DetachCurrentThread();

    return 0;
}

/**
 * 创建原生线程
 */
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_NativeThreadTest_createNativeThread(JNIEnv *env, jobject thiz) {
    // 如果是非全局的，函数一结束，就被释放了
    threadTestInstance = env->NewGlobalRef(thiz); // 全局的，就不会被释放，所以可以在线程里面用
    // 创建线程，执行customThread
    pthread_t pthreadID;
    // 创建线程
    pthread_create(&pthreadID, 0, customThread, thiz);
    // 等待线程结束
    pthread_join(pthreadID, 0);
}


/**
 * 页面退出时，释放全局引用
 */
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_NativeThreadTest_unThread(JNIEnv *env, jobject thiz) {
    if (NULL != threadTestInstance) {
        // 释放全局引用，防止内存泄漏，不然会一直存在，直到应用退出
        env->DeleteGlobalRef(threadTestInstance);
        threadTestInstance = NULL;
    }
}
```

## 如何在C/C++中处理异常？

异常处理是 Java 程序设计语言的重要功能， JNI 中的异常行为与 Java 中的有所不同，在 Java 中，当抛出一个异常时，虚拟机停止执行代码块并进入调用栈反向检查能处理特定类型异常的异常处理程序代码块，这也叫捕获异常。虚拟机清除异常并将控制权交给异常处理程序。相比之下， JNI 要求开发人员在异常发生后显式地实现异常处理流。

异常处理通常我们分为两步，**捕获异常**和**抛出异常**。在C/C++中实现这两步也相当简单。我们先看几个函数：

- `ExceptionCheck`：检测是否有异常，有返回JNI_TRUE,否则返回FALSE。
- `ExceptionOccurred`：判断是否有异常，有返回异常，没有返回 NULL。（查询虚拟机中是否有挂起的异常）
- `ExceptionClear`：清除异常堆栈信息。（显式的清除异常）
- `Throw`：抛出当前异常。
- `ThrowNew`:创建一个新异常，并自定义异常信息。
- `FatalError`：致命错误，并且终止当前VM。

**捕获异常：**
JNI 提供了 `ExceptionOccurred` 函数查询虚拟机中是否有挂起的异常。在使用完之后，异常处理程序需要用 `ExceptionClear` 函数显式的清除异常

**抛出异常：**
JNI 也允许原生代码抛出异常。因为异常是 Java 类，应该先用 `FindClass` 函数找到异常类，用 `ThrowNew` 函数可以使用化且抛出新的异常
因为原生函数的代码执行不受虚拟机的控制，因此抛出异常并不会停止原生函数的执行并把控制权交给异常处理程序。到抛出异常时，原生函数应该释放所有已分配的原生资源，例如内存及合适的返回值等。通过 JNIEvn 接口获得的引用是局部引用且一旦返回原生函数，它们自动地被虚拟机释放。

**示例：**

- Kotlin 代码

```java
external fun testThrowException()  
  
@Throws(NullPointerException::class)  
private fun throwException() {  
    throw NullPointerException("this is an NullPointerException from Kotlin")  
}

// 测试抛出异常  
binding.btnTestThrowException.setOnClickListener {  
    try {  
        testThrowException()  
    } catch (e: Exception) {  
        e.printStackTrace()  
        binding.sampleText.text = e.message  
    }  
}
```

- C++代码

```cpp
extern "C"  
JNIEXPORT void JNICALL  
Java_me_hacket_jni_MainActivity_testThrowException(JNIEnv *env, jobject thiz) {  
    // 获取对象的类: MainActivity  
    jclass jclazz = env->GetObjectClass(thiz);  
    // 获取方法的ID: throwException  
    jmethodID  throwExcMethod = env->GetMethodID(jclazz, "throwException", "()V");  
    if (throwExcMethod == NULL) {  
        LOGE("throwException 方法不存在");  
        return; // 方法不存在，直接返回  
    }  
    // 调用方法，抛出异常  
    env->CallVoidMethod(thiz, throwExcMethod);  
  
    // 检查是否有异常发生，如果有异常发生，打印异常信息  
    jthrowable excOcc = env->ExceptionOccurred();  
    if (excOcc) {  
        env->ExceptionDescribe(); // 打印异常堆栈信息  
        env->ExceptionClear(); // 清除异常  
        // 抛出新的异常  
        jclass newExcClazz = env->FindClass("java/lang/IllegalArgumentException");  
        if (newExcClazz == NULL) return;  
        // 抛出异常, 第二个参数是异常信息  
        env->ThrowNew(newExcClazz, "this is a IllegalArgumentException from C++");  
    }  
}
```

## JNI 静态/动态注册

### JNI 静态注册

**静态注册是在编译时将本地函数与Java代码进行绑定**。在静态注册中，需要手动编写包含本地函数声明的C/C++头文件，并在本地代码中实现这些函数。然后，在Java代码中使用`native`关键字声明与本地函数对应的方法，并在静态代码块中使用`System.loadLibrary("库名")`加载本地库。**在静态注册中，本地函数的名称和参数类型必须与Java代码中的方法一一对应**。

如，静态注册，方法名直接写死在 cpp 了：

```cpp
#include <jni.h>
#include <string>
JNIEXPORT jstring
extern "C" JNICALL
Java_com_example_hellojni_HelloJni_stringFromJNI(JNIEnv *env, jobject /* this */) {
    std::string hello = "Hello from JNI.";
    return env->NewStringUTF(hello.c_str());
}
```

Kotlin 代码：

```kotlin
external fun stringFromJNI(): String?
```

**优点：** Java与jni方法对应清晰

**缺点：**

- 必须按照函数规则，方法名很长
- 运行时查找函数效率低

### JNI 动态注册：`RegisterNatives`

**动态注册是在运行时将本地函数与Java代码进行绑定**。在动态注册中，不需要手动编写C/C++头文件，而是在本地代码中使用JNI提供的函数动态注册本地函数。在Java代码中，仍然使用`native`关键字声明与本地函数对应的方法，但不再需要静态代码块中的`System.loadLibrary("库名")`。相反，Java代码通过JNI函数`System.load("库路径")`或其他方式加载本地库。在动态注册中，本地函数的名称和参数类型可以在本地代码中进行灵活的定义和映射。

总结来说，静态注册是在编译时将本地函数与Java代码进行绑定，需要手动编写头文件并在静态代码块中加载本地库。动态注册是在运行时将本地函数与Java代码进行绑定，不需要手动编写头文件，而是在本地代码中使用JNI函数动态注册本地函数。动态注册提供了更大的灵活性，允许在运行时动态地注册和加载本地函数，但相对而言，静态注册更简单直观，适用于较小的项目或固定的本地函数接口。选择使用哪种注册方式取决于项目的需求和开发人员的偏好。

#### struct JNINativeMethod

```cpp
// jni.h
typedef struct {
    const char* name;
    const char* signature;
    void*       fnPtr;
} JNINativeMethod;
```

`JNINativeMethod`为一个结构体。定义在`jni.h`头文件中。

- `const char* name`：Java 层 native 函数名称，如：`dynamicJavaFunc2`
- `const char* signature`：函数签名描述，如：1个 int 参数及返回值为int，`(I)I`
- `void* fnPtr`：Native 对应的函数指针，如：`(int *) dynamicNativeFunc2`

**动态注册的这个方法 RegisterNatives 调用时机是什么时候？**
在 `JNI_OnLoad` 方法调用的时候，当通过 `System.loadLibrary()` 加载 so 的时候，VM 会立即调用 `JNI_OnLoad` 函数。所以一些初始化的工作可以放到 `JNI_OnLoad` 函数里去完成。所以动态注册就在这个函数里完成 Java native 方法与 so 函数之间的绑定关系。

动态注册在 Framework 层使用的多，而静态注册一般我们平时开发在上层用的较多，也是官方推荐的方式。

#### `RegisterNatives()`

```cpp
// jni.h 
jint RegisterNatives(jclass clazz, const JNINativeMethod* methods, jint nMethods)
{ return functions->RegisterNatives(this, clazz, methods, nMethods); }
```

`RegisterNatives`为函数动态注册的方法

参数：

- `clazz`：Java 类对应的 jclass
- `methods`：`JNINativeMethod`数组
- `nMethods`：函数个数，通过`jint size = sizeof(methods) / sizeof(JNINativeMethod);`

#### 动态注册示例

Kotlin 代码：

```kotlin
package me.hacket.jni
class DynamicRegister {
    companion object {
        init {
            System.loadLibrary("jni")
        }
    }
    external fun dynamicJavaFunc1()
    external fun dynamicJavaFunc2(i: Int): Int
}
```

CPP 代码：

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
  
jint JNI_OnLoad(JavaVM *vm, void *reserved) {  
    LOGD("JNI_OnLoad");  
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

## 加载动态库

在 Android 中有两种方式加载动态库：

- `System.load(String filename)` 绝对路径
- `system library path` 从 system lib 路径下加载

比如下面代码会报错，在 `java.library.path` 下找不到 `hello`

```java
static {
    System.loadLibrary("Hello");
}
// 可以使用下面代码打印出 java.library.path ,并且吧 hello 拷贝到改路径下：
public static void main(String[] args){
    System.out.println(System.getProperty("java.library.path"));
}
```

### `JNI_OnLoad`

调用`System.loadLibrary()`函数时， 内部就会去查找so中的 `JNI_OnLoad` 函数，如果存在此函数则调用。`JNI_OnLoad` 必须返回 `JNI` 的版本，比如 `JNI_VERSION_1_6`、`JNI_VERSION_1_8`。

### native 线程中调用 `JNIEnv*`

`JNIEnv*` 是和线程相关的，那么如果在 C++ 中新建一个线程 A，在线程 A 中可以直接使用 `JNIEnv*` 吗？

答案是否定的，如果想在 `native` 线程中使用 `JNIEnv*` 需要使用 `JVM` 的 `AttachCurrentThread` 方法进行绑定：

```cpp
#include <zconf.h>
#include <jni.h>
#include <string>

JavaVM *g_jvm = NULL;

jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    LOGD("JNI_OnLoad native_thread.cpp");
    // 定义JNI环境对象
    JNIEnv *env = NULL;
    // 获取JNI环境对象，这里是获取当前线程的JNI环境对象，如果是子线程，需要先Attach到VM上，使用完后再Detach；
    int result = vm->GetEnv((void **) &env, JNI_VERSION_1_6);
    // 如果获取失败，返回错误码
    if (result != JNI_OK) {
        LOGE("获取JNI环境对象失败");
        return -1;
    }
    LOGI("获取JNI环境对象成功 %p", env);
    // 保存全局JVM以便在子线程中使用
    LOGI("保存全局JVM以便在子线程中使用 %p", vm);
    g_jvm = vm;
    return JNI_VERSION_1_6;
}

void *threadTask(void *args) {
    JNIEnv *env = NULL;
    // 获取当前线程的JNI环境对象
    jint result = g_jvm->AttachCurrentThread(&env, args);
    // 如果获取失败，返回错误码，这里是获取当前线程的JNI环境对象，如果是子线程，需要先Attach到VM上，使用完后再Detach
    if (result != JNI_OK) {
        LOGE("获取JNI环境对象失败");
        return NULL;
    }
    // 执行耗时操作
    LOGD("执行耗时操作");
    // 休眠3秒
    sleep(3);

    // 释放当前线程的JNI环境对象，线程结束前一定要释放，否则会导致内存泄漏
    LOGE("释放当前线程的JNI环境对象 %p, %p", env, g_jvm);
    // 判空
    result = g_jvm->DetachCurrentThread();
    if (result != JNI_OK) {
        LOGE("释放JNI环境对象失败");
    }
    LOGI("释放JNI环境对象成功");
    return NULL;
}

extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_NativeThread_nativeThreadTest(JNIEnv *env, jobject thiz) {
    LOGD("jni nativeThreadTest");
    // 创建线程
    pthread_t pid;
    int result = pthread_create(&pid, NULL, threadTask, NULL);
    if (result != 0) {
        LOGE("创建线程失败");
        return;
    }
    LOGD("创建线程成功 %d", pid);
}
```

## 交叉编译

见 [[NDK基础#交叉编译]]

## 如何查看 Java 层方法所对应的 native 方法

### `Java全路径包名_类名`

Java方法 → CPP函数(Java包的全路径_方法名，其他`.`替换成`_`)

以MessageQueue.nativePollOnce为例：

```java
public final class MessageQueue {
    private native void nativePollOnce(long ptr, int timeoutMillis); /*non-static for callbacks*/
}
```

> nativePollOnce ==> android_os_MessageQueue_nativePollOnce()

- 转换方法名：`MessageQueue.java` 的全限定名为 `android.os.MessageQueue.java`，方法名：`android.os.MessageQueue.nativePollOnce()`，而相对应的 native 层方法名只是将点号替换为下划线，可得 `android_os_MessageQueue_nativePollOnce()`。
- 找到对应的类：有了 native 方法，那么接下来需要知道该 native 方法所在那个文件。Android 系统启动时就已经注册了大量的 JNI 方法，见 `AndroidRuntime.cpp` 的 `gRegJNI` 数组。这些注册方法命令方式：

```cpp
register_[包名]_[类名]
```

那么`MessageQueue.java`所定义的jni注册方法名应该是`register_android_os_MessageQueue`，的确存在于gRegJNI数组，说明这次JNI注册过程是有开机过程完成的。 该方法在 [**AndroidRuntime.cpp**](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/AndroidRuntime.cpp;l=145;drc=b7b8b7cd34b4824b1f530b6fb51a3cb548c42b1d;bpv=1;bpt=1) 申明为`extern`方法：

```cpp
extern int register_android_os_MessageQueue(JNIEnv* env);
```

这些extern方法绝大多数位于[/framework/base/core/jni/](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/;bpv=0;bpt=0)目录，大多数情况下native文件命名方式：

```cpp
[包名]_[类名].cpp
[包名]_[类名].h
```

> MessageQueue.java ==> android_os_MessageQueue.cpp

打开[android_os_MessageQueue.cpp](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/android_os_MessageQueue.cpp)文件，搜索[android_os_MessageQueue_nativePollOnce](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/android_os_MessageQueue.cpp;l=188;drc=b7b8b7cd34b4824b1f530b6fb51a3cb548c42b1d;bpv=1;bpt=1)方法，这便找到了目标方法：

```cpp
static void android_os_MessageQueue_nativePollOnce(JNIEnv* env, jobject obj,
        jlong ptr, jint timeoutMillis) {
    NativeMessageQueue* nativeMessageQueue = reinterpret_cast<NativeMessageQueue*>(ptr);
    nativeMessageQueue->pollOnce(env, obj, timeoutMillis);
}
```

### 非包名_类名

对于native文件命名方式，有时并非`[包名]_[类名].cpp`，比如`Binder.java`

Binder.java所对应的native文件：[android_util_Binder.cpp](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/android_util_Binder.cpp;bpv=0;bpt=1)

```cpp
static const RegJNIRec gRegJNI[] = {
    // ... ,
    REG_JNI(register_android_os_Binder),
    // ...
}
```

如`getCallingPid()`定义：

```cpp
static jint android_os_Binder_getCallingPid(JNIEnv* env, jobject clazz)
{
    return IPCThreadState::self()->getCallingPid();
}
```

遇到打破常规的文件，在[/framework/base/core/jni/](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/;bpv=0;bpt=0)中搜索，对于`Binder.java`，可以直接搜索Binder关键字，其他也类似。

### 程序自己定义的 jni 方法

前面两种都是在Android系统启动之初，便已经注册过JNI所对应的方法。

那么如果程序自己定义的jni方法，该如何查看jni方法所在位置呢？下面以`MediaPlayer.java`为例，其包名为android.media：

```java
public class MediaPlayer{
    static {
        System.loadLibrary("media_jni");
        native_init();
    }
    private static native final void native_init();
    // ...
}
```

通过 static 静态代码块中 `System.loadLibrary` 方法来加载动态库，库名为 `media_jni`，Android 平台则会自动扩展成所对应的 `libmedia_jni.so` 库。接着通过关键字 `native` 加在 `native_init` 方法之前，便可以在 Java 层直接使用 `native` 层方法。

接下来便要查看`libmedia_jni.so`库定义所在文件，一般都是通过`Android.mk`文件定义`LOCAL_MODULE:= libmedia_jni`，可以采用`grep`或者`mgrep`来搜索包含`libmedia_jni`字段的`Android.mk`所在路径。

搜索可知，libmedia_jni.so位于`/frameworks/base/media/jni/Android.mk`。用前面实例(一)中的知识来查看相应的文件和方法名分别为：

```cpp
// android_media_MediaPlayer.cpp
android_media_MediaPlayer_native_init()
```

再然后，你会发现果然在该`Android.mk`所在目录`/frameworks/base/media/jni/`中找到`android_media_MediaPlayer.cpp`文件，并在文件中存在相应的方法：

```cpp
static void
android_media_MediaPlayer_native_init(JNIEnv *env)
{
    jclass clazz;
    clazz = env->FindClass("android/media/MediaPlayer");
    fields.context = env->GetFieldID(clazz, "mNativeContext", "J");
    ...
}
```

> MediaPlayer.java中的native_init方法所对应的native方法位于/frameworks/base/media/jni/目录下的android_media_MediaPlayer.cpp文件中的android_media_MediaPlayer_native_init方法。

### 杂项

- Windows 和 Linux 动态库区别

> Windows 中的动态链接库是*. Dll，Linux 是.So

- `System.load` 和 `loadLibrary` 区别

> System. Load 参数必须为库文件的绝对路径，可以是任意路径；System. LoadLibrary 参数为库文件名，不包含库文件的扩展名

- 加载动态库的时候要注意系统的位数，32 位的系统不要加载 64 位的动态库
- 可以使用 `javah` 生成头文件，as 中可以直接创建

> ` javah -o [输出文件名]  [全限定名]  `，如：`javah -o ExampleUnitTest.h com.dongnao.jniTest.ExampleUnitTest`

## JNI 基础小结

### 关于对象回收

对象只有一个，即在 Java 层 new 了，就不用在 Native 层再去 new；反之，要在 Native 层返回一个对象，则需要创建；Java 层内存是 JVM 自动管理的，Native 层，C/C++ 编写，需要手动回收。

### 关于引用

基本数据类型，如 int、char 之类的，在 Java 和 Native 层之间是直接拷贝一份，这个跟我们接触的传值、传引用是一样的。任何的 Java 对象都是通过引用传递的。

**局部引用**
在函数返回后会被 JVM 自动释放掉，或者调用 `(*env)->DeleteLocalRef(env, local_ref)` 手动释放（**「不管怎样」**，尽量手动释放，防止`局部引用表溢出`，Android 8.0 上支持无限制的局部引用）

- `NewLocalRef`：返回局部引用
- `FindClass/GetObjectClass`：返回局部引用（这两个函数作用一样，只是传入参数不一样）。
- `NewObject`：如果返回 Java 层继续引用，则局部引用不会被释放，如果是通过参数传递，赋值给参数，函数调用完毕就会释放。
- `GetObjectClass`：返回局部引用
- `NewCharArray`：返回局部应用
- 传递给 Native 方法的每个参数，以及 JNI 函数返回的几乎每个对象都属于局部引用，包括 `jobject` 及其所有子类。
- 局部引用仅在创建它们的线程中有效，不得将局部引用从一个线程传递到另一个线程。
- `jfieldID` 和 `jmethodID` 属于不透明类型，不是对象引用，因此总是可以缓存他们，以提升效率。而对于 `jclass` 就需要注意了，得使用全局引用。

**全局引用**
调用 `NewGlobalRef`，JVM 不会自动释放，基于局部引用创建，可跨方法、线程使用；必须调用 `(*env)->DeleteGlobalRef(env, g_ref);` 手动释放。

**弱全局引用**
调用 `NewWeakGlobalRef` 基于局部引用或全局引用创建，可跨方法、线程使用；在 JVM 认为应该回收它的时候进行回收释放，或调用 `(*env)->DeleteWeakGlobalRef(env, g_ref)` 手动释放；不同上面两种引用，不会阻止 GC 回收它引用的对象；

引用比较：`(*env)->IsSameObject(env, obj1_ref, obj2_ref)`，判断引用对象(不分局部、全局、弱全局)是否相同。

### 关于性能

Native 层查找`方法ID`、`字段ID`、`Class引用`效率是较低的（JVM 原因），因此可以基于这点在 Native 层做缓存优化。

- `FindClass()`
- `GetFieldID()`
- `GetMethodId()`
- `GetStaticMethodID()`
- `GetIntField()`

### 关于缓存

- 静态局部变量缓存，直到程序结束才会释放；不加锁，多线程，存在多次缓存情况。
- 对局部引用进行静态变量缓存，会存在引用内容释放，成为野指针风险
- 全局变量缓存，声明定义 `public static native` 方法，到 `static {}` 中调用，然后到 Native 层实现静态方法初始化相关全局变量，也可以实现缓存
- 返回基本类型的 Native 函数，不能造成全局引用、弱全局引用、局部引用的积累，即记得手动释放，防止造成内存溢出
- 返回引用类型的 Native 函数，除了要返回的引用之外，也不能造成任何的全局引用、弱全局引用、局部引用的积累
- 对于 `jmethodID` 和 `jfieldID` 的缓存，是线程安全的。采用全局变量的方式缓存
- `jclass` 需要结合 `NewGlobalRef` 全局引用来实现缓存。
- `jint JNI_OnLoad(JavaVM* vm, void* reserved){}` 在 `System.loadLibary` 加载本机代码后会自动调用；`void JNI_OnUnload(JavaVM *vm, void *reserved){}` 当 `Classloader` 销毁后会自动调用。
- `JavaVM* vm` 在整个进程中唯一

# Ref

- [Android - JNI 开发你所需要知道的基础 - 掘金](https://juejin.cn/post/6844904192780271630)
- [ ] Android JNI 原理分析 <http://gityuan.com/2016/05/28/android-jni/>
- [ ] [Java Native Interface Specification: Contents](https://docs.oracle.com/en/java/javase/15/docs/specs/jni/index.html)
- [ ] [JNI tips](https://developer.android.com/training/articles/perf-jni)
