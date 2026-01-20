---
banner: 
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Monday, March 3rd 2025, 11:38:20 pm
title: Kotlin for Android
author: hacket
categories:
  - Java&Kotlin
category: Kotlin基础
tags: [Kotlin基础]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
aliases: [kotlin 使用 Parcelize 注解简化 Parcelable 的书写]
linter-yaml-title-alias: kotlin 使用 Parcelize 注解简化 Parcelable 的书写
---

# kotlin 使用 Parcelize 注解简化 Parcelable 的书写

kotlin 在 1.1.4 版本增加了对 parcelable 的支持

Android 扩展插件现在包含一个实现了 Parcelable 的自动生成器。在主构造函数中声明序列化的属性并添加一个 `@Parcelize` 注解，生成器就会自动创建 `writeToParcel()/createFromParcel()` 方法

```kotlin
@Parcelize
data class Student(val id: String, val name: String, val grade: String) : Parcelable
```

查看：

```java
Tools→Kotlin→Show Kotlin Bytecode
```

# Kotlin 发布 Release 包前优化 Java 字节码

## 利用 `assumenosideeffects` 移除 Kotlin 生成的校验的 java 代码

```java
https://juejin.im/post/5e1c6163f265da3e4736b37f// proguard.pro
-assumenosideeffects class kotlin.jvm.internal.Intrinsics {
    public static void checkExpressionValueIsNotNull(...);
    public static void checkNotNullExpressionValue(...);
    public static void checkReturnedValueIsNotNull(...);
    public static void checkFieldIsNotNull(...);
    public static void checkParameterIsNotNull(...);
}
```

## 添加 Kotlin 编译参数

通过 kotlin 编译参数配置可以删除一些 assert。

```java
-Xno-call-assertions：不对 platform types 的参数生成空检查
-Xno-receiver-assertions：不对 platform types 的接收参数生成空检查
-Xno-param-assertions：不对 Java 方法参数生成非空检查
```

```groovy
// build.gradle
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile)
    .all {
        kotlinOptions {
            freeCompilerArgs += [
                    '-Xno-call-assertions',
                    '-Xno-receiver-assertions',
                    '-Xno-param-assertions'
            ]
        }
    }
```

- [x] [Kotlin: 发布 Release 包前优化 Java 字节码](https://juejin.im/post/5e1c6163f265da3e4736b37f)

# Kotlin-Android-Extensions

## synthetic（和 findViewById 说再见）

> 我们不需要使用 findViewById 来获取控件，只需要使用控件的 id 就可以操作控件的相关方法。

原理：<br>在第一次使用控件的时候，在缓存集合中进行查找，有就直接使用，没有就通过 findViewById 进行查找，并添加到缓存集合中。其还提供了 `_$_clearFindViewByIdCache()` 方法用于清除缓存，在我们想要彻底替换界面控件时可以使用到。

### Activity

Activity 在 onDestroy 时不会调用 `_$_clearFindViewByIdCache()`，导致在 onDestoy 后控件也还是可以引用，如果需要清理需要手动调用 `clearFindViewByIdCache`

### Fragment

和 Activity 的唯一区别就是在 `onDestroyView()` 方法中调用了 `_$_clearFindViewByIdCache()`，来清楚缓存，所以我们不用担心在 View 销毁的时候，缓存不能及时释放的问题。

### ViewHolder 中如何使用 Extansions

kotlin`1.1.4` 版本的 kotlin-android-extensions 增强功能，需要在 build.gradle 中开启实验性标志：

```
androidExtensions {
    experimental = true
}
```

接下来我们就可以试着去编写 ViewHolder 了，只需要实现 LayoutContainer 接口，该接口只提供了一个 containerView，用于存储视图

ViewHolder 初始化的时候，将传进来的 view 存储在 containerView 变量中，和 Activity 的 _$_findCachedViewById 一样，ViewHolder 中的使用的是 containerView.findViewById，即通过传进来的 View 进行 View.findViewById，从而获取控件。

### 使用 ContainerOptions 修改 View 的缓存类型

默认 View 的缓存是是使用的 HashMap 来做的，官方提供了注解的方式来进行修改：

```kotlin
@ContainerOptions(CacheImplementation.SPARSE_ARRAY)
class TestActivity : AppCompatActivity() {
    // ...
}
```

CacheImplementation 提供了三种方式：

```java
public enum class CacheImplementation {
    SPARSE_ARRAY,
    HASH_MAP,
    NO_CACHE;

    public val hasCache: Boolean
        get() = this != NO_CACHE

    companion object {
        val DEFAULT = HASH_MAP
    }
}
```

当然某些时候你只在 Activity 加载的时候，使用一次控件，那么就可以选择 `NO_CACHE`。

# 好用的官方扩展

## View 相关

### View.doOnPreDraw

在下一次绘制前调用

```kotlin
public inline fun View.doOnPreDraw(
    crossinline action: (view: View) -> Unit
): OneShotPreDrawListener = OneShotPreDrawListener.add(this) { action(this) }
```

### View.doOnAttach

作用：在 View attachedToWindow 时回调

```kotlin
public inline fun View.doOnAttach(crossinline action: (view: View) -> Unit) {
    if (ViewCompat.isAttachedToWindow(this)) {
        action(this)
    } else {
        addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(view: View) {
                removeOnAttachStateChangeListener(this)
                action(view)
            }

            override fun onViewDetachedFromWindow(view: View) {}
        })
    }
}
```

### View.doOnDetach

作用：

- View 已经 detach，立即执行
- View 未 detach，等 detach 后执行

```kotlin
public inline fun View.doOnDetach(crossinline action: (view: View) -> Unit) {
    if (!ViewCompat.isAttachedToWindow(this)) {
        action(this)
    } else {
        addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(view: View) {}

            override fun onViewDetachedFromWindow(view: View) {
                removeOnAttachStateChangeListener(this)
                action(view)
            }
        })
    }
}
```

### TextView 相关

1. doBeforeTextChanged
2. doOnTextChanged
3. doAfterTextChanged
4. addTextChangedListener
