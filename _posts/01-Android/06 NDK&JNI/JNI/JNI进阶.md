---
date created: 2024-05-29 01:16
date updated: 2024-12-24 00:34
dg-publish: true
---

# JNI 进阶

## JNI Native 函数加载执行流程

### 静态注册的函数映射

用 `javah` 风格的代码，则 dvm 调用 `dvmResolveNativeMethod` 进行动态延迟解析，直到需要调用的时候才会解析。

1. DVM 调用 `dvmResolveNativeMethod` 函数

2. `void* func = lookupSharedLibMethod(method)` 去已加载的动态库中查询函数的实现。

3. 查询到然后执行下面函数将 JNI 函数地址保持到 `ClassObject` 中

`dvmUseJNIBridge((Method*) method, func)`
`(*method->nativeFunc)(args, pResult, method, self)`

4. 最后将函数添加到 `ClassObject` 结构体中的 `directMethods` 结构体成员中。

### 动态注册函数映射

### so 加载流程

```java
System.loadLibrary
----Runtime.loadLibrary0
------Runtime.doLoad
--------Runtime.nativeLoad
```

- `System.loadLibrary("jni")`

```java
// System.java
public static void loadLibrary(String libname) {
	Runtime.getRuntime().loadLibrary0(Reflection.getCallerClass(), libname);
}

// Runtime.java
void loadLibrary0(Class<?> fromClass, String libname) {  
    ClassLoader classLoader = ClassLoader.getClassLoader(fromClass);  
    loadLibrary0(classLoader, fromClass, libname);  
}
private synchronized void loadLibrary0(ClassLoader loader, Class<?> callerClass, String libname) {  
    if (libname.indexOf((int)File.separatorChar) != -1) {  
        throw new UnsatisfiedLinkError(  
"Directory separator should not appear in library name: " + libname);  
    }  
    String libraryName = libname;  
    // Android-note: BootClassLoader doesn't implement findLibrary(). http://b/111850480  
    // Android's class.getClassLoader() can return BootClassLoader where the RI would    // have returned null; therefore we treat BootClassLoader the same as null here.    if (loader != null && !(loader instanceof BootClassLoader)) {  
        String filename = loader.findLibrary(libraryName);  
        if (filename == null &&  
                (loader.getClass() == PathClassLoader.class ||  
                 loader.getClass() == DelegateLastClassLoader.class)) {  
            // Don't give up even if we failed to find the library in the native lib paths.  
            // The underlying dynamic linker might be able to find the lib in one of the linker            // namespaces associated with the current linker namespace. In order to give the            // dynamic linker a chance, proceed to load the library with its soname, which            // is the fileName.            // Note that we do this only for PathClassLoader  and DelegateLastClassLoader to            // minimize the scope of this behavioral change as much as possible, which might            // cause problem like b/143649498. These two class loaders are the only            // platform-provided class loaders that can load apps. See the classLoader attribute            // of the application tag in app manifest.            filename = System.mapLibraryName(libraryName);  
        }  
        if (filename == null) {  
            // It's not necessarily true that the ClassLoader used  
            // System.mapLibraryName, but the default setup does, and it's            // misleading to say we didn't find "libMyLibrary.so" when we            // actually searched for "liblibMyLibrary.so.so".            throw new UnsatisfiedLinkError(loader + " couldn't find \"" +  
                                           System.mapLibraryName(libraryName) + "\"");  
        }  
        String error = nativeLoad(filename, loader);  
        if (error != null) {  
            throw new UnsatisfiedLinkError(error);  
        }  
        return;  
    }  
  
    // We know some apps use mLibPaths directly, potentially assuming it's not null.  
    // Initialize it here to make sure apps see a non-null value.    getLibPaths();  
    String filename = System.mapLibraryName(libraryName);  
    String error = nativeLoad(filename, loader, callerClass);  
    if (error != null) {  
        throw new UnsatisfiedLinkError(error);  
    }  
}
```

Java层最后是调用的 native 方法：`nativeLoad()`

## 调试和优化 JNI 代码

掌握如何调试本地代码以及如何优化 JNI 性能

## JNI 安全最佳实践

了解 JNI 编程中的安全考量，如避免内存泄漏和宕机。

### 什么时候需要进行内存释放？

在 `JNI` 函数参数列表中，除了你自己创建的局部引用外，其他的都不需要手动释放。
你只需要释放那些你自己在本地方法内明确创建的局部引用。比如，如果你调用了 `NewObject` 或 `FindClass` 等 JNI 函数，创建了一个新的局部引用，你就需要在用完它后调用 `DeleteLocalRef` 来释放。

至于形参：数组参数 `jintArray` 和 `jbooleanArray`，以及字符串数组参数 `jobjectArray strs`，他们是 JNI 自动创建的局部引用。如果你在函数内创建了上述类型的副本（例如通过调用 `env->Get*ArrayElements` 系列函数），副本需要在用完之后释放。但对于由 JVM 自动传递给本地方法的局部引用，不需要你手动去清理。

**GetObjectClass：**

```cpp
extern "C" JNIEXPORT void JNICALL
Java_me_hacket_jni_MainActivity_testJavaDataToCpp(JNIEnv *env, jobject thiz, ...){
  // 其他代码...

  // 假设你创建了 personClass 的局部引用
  jclass personClass = env->GetObjectClass(person);
  // 在此做一些操作...
  // 然后你需要释放你创建的局部引用
  env->DeleteLocalRef(personClass);
  
  // 本地方法返回时，person 的自动局部引用由 JVM 清理，无需手动删除
}
```

**env->NewStringUTF()：**
使用 `env->NewStringUTF` 创建的 `jstring` 对象确实需要在适当的时候释放内存，以避免内存泄漏。在 `JNI` 中，由于 `NewStringUTF` 创建的是一个新的 `Java` 字符串对象，因此会占用堆内存，且这个对象是由 Java 的垃圾回收器管理的。但是，当你在本地代码中创建局部引用时，这个局部引用需要在不再使用时显式地被释放，特别是在你创建了大量局部引用，而没有及时释放它们的情况下，可能导致 `局部引用表溢出` 的问题。
在 `JNI` 函数执行完毕返回到 Java 层之后，所有的局部引用都会被自动删除。但是，在一些长时间执行的 `JNI` 函数中，或者在 Java 方法调用之间创建了过多的局部引用时，你需要主动调用 `DeleteLocalRef` 来释放这些局部引用。

```cpp
// JNI 本地方法实现
JNIEXPORT jstring JNICALL
Java_SomeActivity_getStringFromNative(JNIEnv *env, jobject obj) {
    jstring str = env->NewStringUTF("Hello from native code!");

    // 做一些复杂操作，可能会创建更多的局部引用

    // 可能在这里释放局部引用
    // env->DeleteLocalRef(str);

    return str; //返回前不要删除 jstring 引用，因为它需要返回给 Java 层
}
// 在上面的例子中，str 作为返回值返回给 Java 层，因此，在返回之前不应该删除这个引用。Java 层会接管这个返回的 jstring 实例，并在适当的时候由垃圾回收器进行处理。如果你在返回之前删除了 str 引用，则会导致 Java 层收到一个不合法的引用。
```

总之，只要 `JNI` 方法返回后，它创建的所有局部引用都会被自动删除。你只需要在一些特定情况下手动删除本地引用，例如如果你在一个方法内部创建并显式完成了对某个局部引用的使用，或者在你创建了大量局部引用而又要长时间在 JNI 层操作时。

- **GetObjectClass()** 不需要：`GetObjectClass` 方法用于获取一个 jobject 所表示的 Java 对象的类。与 FindClass 类似，`GetObjectClass` 也会返回一个局部引用，它指向该对象的类。在 JNI 中，局部引用会在原生方法调用完成返回到 Java 代码之后自动被释放。因此，在大多数情况下，你不需要手动释放通过 GetObjectClass 取得的 jclass 局部引用。

## JNI 原理
