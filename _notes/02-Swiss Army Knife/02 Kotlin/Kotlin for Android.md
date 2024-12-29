---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
---

# kotlin使用Parcelize注解简化Parcelable的书写

kotlin在1.1.4版本增加了对parcelable的支持

Android 扩展插件现在包含一个实现了 Parcelable 的自动生成器。在主构造函数中声明序列化的属性并添加一个 `@Parcelize` 注解，生成器就会自动创建 `writeToParcel()/createFromParcel()` 方法

```kotlin
@Parcelize
data class Student(val id: String, val name: String, val grade: String) : Parcelable
```

查看：

```
Tools→Kotlin→Show Kotlin Bytecode
```

# Kotlin 发布 Release 包前优化 Java 字节码

## 利用`assumenosideeffects`移除Kotlin生成的校验的java代码

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

## 添加Kotlin 编译参数

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

## synthetic（和findViewById说再见）

> 我们不需要使用findViewById来获取控件，只需要使用控件的id就可以操作控件的相关方法。

原理：<br>在第一次使用控件的时候，在缓存集合中进行查找，有就直接使用，没有就通过findViewById进行查找，并添加到缓存集合中。其还提供了`_$_clearFindViewByIdCache()`方法用于清除缓存，在我们想要彻底替换界面控件时可以使用到。

### Activity

Activity在onDestroy时不会调用`_$_clearFindViewByIdCache()`，导致在onDestoy后控件也还是可以引用，如果需要清理需要手动调用`clearFindViewByIdCache`

### Fragment

和Activity的唯一区别就是在`onDestroyView()`方法中调用了`_$_clearFindViewByIdCache()`，来清楚缓存，所以我们不用担心在View销毁的时候，缓存不能及时释放的问题。

### ViewHolder中如何使用Extansions

kotlin`1.1.4`版本的kotlin-android-extensions增强功能，需要在build.gradle中开启实验性标志：

```
androidExtensions {
    experimental = true
}
```

接下来我们就可以试着去编写ViewHolder了，只需要实现LayoutContainer接口，该接口只提供了一个containerView，用于存储视图

ViewHolder初始化的时候，将传进来的view存储在containerView变量中，和Activity的_$_findCachedViewById一样，ViewHolder中的使用的是containerView.findViewById，即通过传进来的View进行View.findViewById，从而获取控件。

### 使用ContainerOptions修改View的缓存类型

默认View的缓存是是使用的HashMap来做的，官方提供了注解的方式来进行修改：

```kotlin
@ContainerOptions(CacheImplementation.SPARSE_ARRAY)
class TestActivity : AppCompatActivity() {
    // ...
}
```

CacheImplementation提供了三种方式：

```
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

当然某些时候你只在Activity加载的时候，使用一次控件，那么就可以选择`NO_CACHE`。

# 好用的官方扩展

## View相关

### View.doOnPreDraw

在下一次绘制前调用

```kotlin
public inline fun View.doOnPreDraw(
    crossinline action: (view: View) -> Unit
): OneShotPreDrawListener = OneShotPreDrawListener.add(this) { action(this) }
```

### View.doOnAttach

作用：在View attachedToWindow时回调

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

- View已经detach，立即执行
- View未detach，等detach后执行

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

### TextView相关

1. doBeforeTextChanged
2. doOnTextChanged
3. doAfterTextChanged
4. addTextChangedListener
