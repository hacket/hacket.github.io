---
date created: 2024-05-28 08:23
tags:
  - '#include'
  - '#define'
  - '#ifdef'
  - '#endif'
date updated: 2024-12-24 00:34
dg-publish: true
---

# 卸载反馈linux层-feedback

- fork一个进程
- 监听自身应用的/data/data/package/目录是否存在
- 通过linux中的文件监听，inotify监听linux中的文件状态
- 注意覆盖升级的问题
- 调用am命令跳转到网页

Java层的FileObserver中的就是inotify机制

分析AM.java

# 静默安装

# SO签名校验防被逆向盗用

- valid.cpp

```c
#include <stdio.h>
#include <stdlib.h>
#include <jni.h>
#include <android/log.h>

#define TAG  "qsbk.jni"
#define LOGD(...)  ((void)__android_log_print(ANDROID_LOG_DEBUG, TAG, __VA_ARGS__))
#define LOGI(...)  ((void)__android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__))
#define LOGE(...) ((void)__android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__))

// 内置自己APP的签名信息
const char *app_sha1 = "6DAA48C22BEA90A5928CCA3096D0E21967E74CB6";
const char hexcode[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

// 反射获取应用的签名
char *getSha1FromSo(JNIEnv *env, jobject context_object) {
    //上下文对象
    jclass context_class = env->GetObjectClass(context_object);

    //反射获取PackageManager
    jmethodID methodId = env->GetMethodID(context_class, "getPackageManager", "()Landroid/content/pm/PackageManager;");
    jobject package_manager = env->CallObjectMethod(context_object, methodId);
    if (package_manager == NULL) {
        LOGD("[getSha1FromSo] package_manager is NULL!!!");
        return NULL;
    }

    //反射获取包名
    methodId = env->GetMethodID(context_class, "getPackageName", "()Ljava/lang/String;");
    jstring package_name = (jstring) env->CallObjectMethod(context_object, methodId);
    if (package_name == NULL) {
        LOGD("[getSha1FromSo] package_name is NULL!!!");
        return NULL;
    }
    env->DeleteLocalRef(context_class);

    //获取PackageInfo对象
    jclass pack_manager_class = env->GetObjectClass(package_manager);
    methodId = env->GetMethodID(pack_manager_class, "getPackageInfo",
                                "(Ljava/lang/String;I)Landroid/content/pm/PackageInfo;");
    env->DeleteLocalRef(pack_manager_class);
    jobject package_info = env->CallObjectMethod(package_manager, methodId, package_name, 0x40);
    if (package_info == NULL) {
        LOGD("[getSha1FromSo] getPackageInfo() is NULL!!!");
        return NULL;
    }
    env->DeleteLocalRef(package_manager);

    //获取签名信息
    jclass package_info_class = env->GetObjectClass(package_info);
    jfieldID fieldId = env->GetFieldID(package_info_class, "signatures", "[Landroid/content/pm/Signature;");
    env->DeleteLocalRef(package_info_class);
    jobjectArray signature_object_array = (jobjectArray) env->GetObjectField(package_info, fieldId);
    if (signature_object_array == NULL) {
        LOGD("[getSha1FromSo] signature is NULL!!!");
        return NULL;
    }
    jobject signature_object = env->GetObjectArrayElement(signature_object_array, 0);
    env->DeleteLocalRef(package_info);

    //签名信息转换成sha1值
    jclass signature_class = env->GetObjectClass(signature_object);
    methodId = env->GetMethodID(signature_class, "toByteArray", "()[B");
    env->DeleteLocalRef(signature_class);
    jbyteArray signature_byte = (jbyteArray) env->CallObjectMethod(signature_object, methodId);
    jclass byte_array_input_class = env->FindClass("java/io/ByteArrayInputStream");
    methodId = env->GetMethodID(byte_array_input_class, "<init>", "([B)V");
    jobject byte_array_input = env->NewObject(byte_array_input_class, methodId, signature_byte);
    jclass certificate_factory_class = env->FindClass("java/security/cert/CertificateFactory");
    methodId = env->GetStaticMethodID(certificate_factory_class, "getInstance",
                                      "(Ljava/lang/String;)Ljava/security/cert/CertificateFactory;");
    jstring x_509_jstring = env->NewStringUTF("X.509");
    jobject cert_factory = env->CallStaticObjectMethod(certificate_factory_class, methodId, x_509_jstring);
    methodId = env->GetMethodID(certificate_factory_class, "generateCertificate",
                                ("(Ljava/io/InputStream;)Ljava/security/cert/Certificate;"));
    jobject x509_cert = env->CallObjectMethod(cert_factory, methodId, byte_array_input);
    env->DeleteLocalRef(certificate_factory_class);
    jclass x509_cert_class = env->GetObjectClass(x509_cert);
    methodId = env->GetMethodID(x509_cert_class, "getEncoded", "()[B");
    jbyteArray cert_byte = (jbyteArray) env->CallObjectMethod(x509_cert, methodId);
    env->DeleteLocalRef(x509_cert_class);
    jclass message_digest_class = env->FindClass("java/security/MessageDigest");
    methodId = env->GetStaticMethodID(message_digest_class, "getInstance",
                                      "(Ljava/lang/String;)Ljava/security/MessageDigest;");
    jstring sha1_jstring = env->NewStringUTF("SHA1");
    jobject sha1_digest = env->CallStaticObjectMethod(message_digest_class, methodId, sha1_jstring);
    methodId = env->GetMethodID(message_digest_class, "digest", "([B)[B");
    jbyteArray sha1_byte = (jbyteArray) env->CallObjectMethod(sha1_digest, methodId, cert_byte);
    env->DeleteLocalRef(message_digest_class);

    //转换成char
    jsize array_size = env->GetArrayLength(sha1_byte);
    jbyte *sha1 = env->GetByteArrayElements(sha1_byte, NULL);
    char *hex_sha = new char[array_size * 2 + 1];
    for (int i = 0; i < array_size; ++i) {
        hex_sha[2 * i] = hexcode[((unsigned char) sha1[i]) / 16];
        hex_sha[2 * i + 1] = hexcode[((unsigned char) sha1[i]) % 16];
    }
    hex_sha[array_size * 2] = '\0';

    LOGD("[getSha1FromSo]获取当前APP的签名SHA1：%s ", hex_sha);
    return hex_sha;
}

// 比较签名是否一致
jint checkAppSignatureValidity(JNIEnv *env, char *sha1) {
    //比较签名
    if (strcmp(sha1, app_sha1) == JNI_OK) {
        LOGD("[checkAppSignatureValidity]SO签名验证成功");
        return JNI_OK;
    }
    LOGE("[checkAppSignatureValidity]SO签名验证失败");
    return JNI_ERR;
}

// 反射获取Application
static jobject getApplication(JNIEnv *env) {
    jobject application = NULL;
    jclass activity_thread_clz = env->FindClass("android/app/ActivityThread");
    if (activity_thread_clz != NULL) {
        jmethodID currentApplication = env->GetStaticMethodID(
                activity_thread_clz, "currentApplication", "()Landroid/app/Application;");
        if (currentApplication != NULL) {
            application = env->CallStaticObjectMethod(activity_thread_clz, currentApplication);
        } else {
            LOGE("Cannot find method: currentApplication() in ActivityThread.");
        }
        env->DeleteLocalRef(activity_thread_clz);
    } else {
        LOGE("Cannot find class: android.app.ActivityThread");
    }

    return application;
}

// 在so加载时，进行签名的校验
jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    JNIEnv *env = NULL;
    if (vm->GetEnv((void **) &env, JNI_VERSION_1_4) != JNI_OK) {
        LOGE("[JNI_OnLoad] JNI_VERSION_1_4 Not OK!!!");
        return JNI_ERR;
    }
    if (checkAppSignatureValidity(env, getSha1FromSo(env, getApplication(env))) == JNI_OK) {
        LOGI("[JNI_OnLoad] JNI SO签名校验成功");
        return JNI_VERSION_1_4;
    }
    LOGE("[JNI_OnLoad] 签名不一致 JNI_ERR!");
    return JNI_ERR;
}
```

- qbvoicechatsecurity.cpp

```c
#include <jni.h>
#include <string>
#include "valid.cpp"

extern "C"
JNIEXPORT jstring JNICALL
Java_qsbk_app_voice_common_net_SecurityUtils_getSignaturesSha1(
        JNIEnv *env,
        jclass type/*,
        jobject contextObject*/) {
    char *signature = getSha1FromSo(env, getApplication(env));
    return env->NewStringUTF(signature);
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_qsbk_app_voice_common_net_SecurityUtils_checkSha1(
        JNIEnv *env,
        jclass type
        /*,jobject contextObject*/) {

    char *sha1 = getSha1FromSo(env, getApplication(env));

    jboolean result = checkAppSignatureValidity(env, sha1);

    return result;
}
```

- Java代码

```java
public final class SecurityUtils {
    /**
     * A native method that is implemented by the 'security' native library,
     * which is packaged with this application.
     */
    public static native String getSignaturesSha1();
    public static native boolean checkSha1();
}
```

- CMakeLists.txt

```cmake
# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

add_library( # Sets the name of the library.
        qbvoicechatsecurity-lib

        # Sets the library as a shared library.
        SHARED

        # Provides a relative path to your source file(s).
        src/main/cpp/qbvoicechatsecurity.cpp)

# Searches for a specified prebuilt library and stores the path as a
# variable. Because CMake includes system libraries in the search path by
# default, you only need to specify the name of the public NDK library
# you want to add. CMake verifies that the library exists before
# completing its build.

find_library( # Sets the name of the path variable.
        log-lib

        # Specifies the name of the NDK library that
        # you want CMake to locate.
        log)


# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.

target_link_libraries( # Specifies the target library.
        qbvoicechatsecurity-lib

        # Links the target library to the log library
        # included in the NDK.
        ${log-lib})


set_target_properties(qbvoicechatsecurity-lib PROPERTIES OUTPUT_NAME "qbsec")
```

- [ ] Android 使用jni校验应用签名sha1值，防止so文件逆向盗用<br /><https://blog.csdn.net/liyi0930/article/details/77413525><br /><https://github.com/aizuzi/SignatureVerificationDemo>

# 密钥保存

`CMake simple highlighter`插件

## Gradle配置cmake

```groovy
android {
    // ...
    externalNativeBuild {
        cmake {
            path "CMakeLists.txt"
        }
    }
}
```

## Java层定义native方法

```java
// me.hacket.assistant.samples.apps.inews.utils.SecurityUtils
public static native String getSecretKey();
```

## 编写cpp

```
// src/main/cpp/qbvoicechatsecurity.cpp
#include <string>
#include <jni.h>

using namespace std;

#define LOGINFO(...) ((void)__android_log_print(ANDROID_LOG_INFO, "security", __VA_ARGS__))
#define LOGERROR(...) ((void)__android_log_print(ANDROID_LOG_ERROR, "security", __VA_ARGS__))


#ifdef __cplusplus
extern "C" // C++中以C的方式编译
{

JNIEXPORT jstring
JNICALL Java_me_hacket_assistant_samples_apps_inews_utils_SecurityUtils_getSecretKey
        (JNIEnv *env,
         jclass type) {
    std::string hello = "1234567890";
    return env->NewStringUTF(hello.c_str());
}

}
#endif
```

## 编写CMakeLists.txt

```
# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

add_library( # Sets the name of the library.
        qbvoicechatsecurity

        # Sets the library as a shared library.
        SHARED

        # Provides a relative path to your source file(s).
        src/main/cpp/qbvoicechatsecurity.cpp)

# Searches for a specified prebuilt library and stores the path as a
# variable. Because CMake includes system libraries in the search path by
# default, you only need to specify the name of the public NDK library
# you want to add. CMake verifies that the library exists before
# completing its build.

find_library( # Sets the name of the path variable.
        log-lib

        # Specifies the name of the NDK library that
        # you want CMake to locate.
        log)


# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.

target_link_libraries( # Specifies the target library.
        qbvoicechatsecurity

        # Links the target library to the log library
        # included in the NDK.
        ${log-lib})
```

## Java层加载

```
public final class SecurityUtils {
    // ...
    static {
        System.loadLibrary("qbvoicechatsecurity");
    }
    // ...
}
```

# 增量更新

## 增量更新解决方案及其Kotlin实现

### 增量更新和普通更新

- 普通更新：有新版本发布，将完整的包放到服务器里面，供客户端下载完整下载
- 增量更新<br />服务器在新版本apk，在服务器和老版本生成一个差分包（apk.patch），供客户端下载；客户端下载后，在客户端本地和旧版本合成新版本的apk，然后安装<br />多了个服务器一个差分，客户端合并操作

### 增量更新apk分析

- 手机淘宝<br />libBSPatch.so 57K
- QQ空间
- 爱奇艺<br />libbspatch.so  157K

### BsPatch/BsDiff

<http://www.daemonology.net/bsdiff/>

bsdiff：<br />bspatch：<br />bzip2：/usr/bin一般有这个工具

### 客户端合并过程

- 写一个带有native的类，并生产c头文件
- 引入bspatch的c文件
- 配置CmakeLists.txt
- 在bspatch.c文件中实现合成操作<br />bspatch.c的main()函数参数，第一个固定为4，第二个参数为长度为4的数组（第1个为log输出，第2个为oldpath，第3个为newPath，第4个为patchPath）
- 解决多个main函数问题

### 技术点

- bspatch、bsdiff
- apk安装到手机的一个过程
- 差分包一般小于10M?
- 哈夫曼算法
- CmakeLists.txt文件<br />编译器用的llvm，Android.mk用的是gcc

tencent插件化：tws framework

- HFS简易网络服务器
- 用了混淆加密有啥影响<br />没影响，文件级的文件；算法基于文件的，差分合并后和你要升级的新apk的md5值一样

windows生成文件的md5值<br />certutil -hashfile file MD5

## 增量更新解决方案

<https://github.com/cundong/SmartAppUpdates>

bsdiff bspatch

<https://github.com/ha-excited/BigNews>

> Android增量更新框架差分包升级

## 差分

### BSDiff

<http://www.daemonology.net/bsdiff/>

### DexDiff

dexDiff是微信结合Dex文件格式设计的一个专门针对Dex的差分算法。根据Dex的文件格式，对两个Dex中每一项<br />数据进行差分记录。
