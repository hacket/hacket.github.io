---
date created: 2024-07-02 23:58
date updated: 2024-12-24 00:38
dg-publish: true
---

# class 的加载

一个类的完整加载流程至少包括 **加载**、**链接**、**初始化**，而类的加载在一个进程中只会触发一次，因此对于冷启动场景，我们可以异步加载原本在启动阶段会在主线程触发类加载过程的类，这样当原流程在主线程访问到该类时就不会触发类加载流程。

ClassLoader 基础：[[ClassLoader基础]]

## 获取启动阶段需要预加载的 class

### Hook ClassLoader

在Android系统中，类的加载都是通过`PathClassLoader`实现的，基于类加载的父类委托机制，我们可以通过`Hook PathClassLoader` 修改其默认的`parent` 来实现。

- 创建一个 `MonitorClassLoader` 继承自 `PathClassLoader`，并在其内部记录类加载及其耗时的情况

```kotlin
class MonitorClassLoader(
    dexPath: String?,
    parent: ClassLoader?,
    private val onlyMainThread: Boolean = false,
) :
    PathClassLoader(dexPath, parent) {
    private val TAG = "hacket.MonitorClassLoader"

    companion object {
        var classLoadCost = 0L
    }
    @SuppressLint("LongLogTag")
    override fun loadClass(name: String?, resolve: Boolean): Class<*> {
        val begin = SystemClock.elapsedRealtimeNanos()
        if (onlyMainThread && Looper.getMainLooper().thread != Thread.currentThread()) {
            return super.loadClass(name, resolve)
        }
        val clazz = super.loadClass(name, resolve)
        val end = SystemClock.elapsedRealtimeNanos()
        val cost = end - begin
        classLoadCost += cost
        if (cost > 1000_000L) {
            Log.e(
                TAG,
                "加载 $clazz 耗时 ${(end - begin) / 1000L} 微秒 ,线程ID ${Thread.currentThread().id}(${Thread.currentThread().name})，总耗时=${classLoadCost / 1000L} 微秒"
            )
        } else {
            Log.d(
                TAG,
                "加载 $clazz 耗时 ${(end - begin) / 1000L} 微秒 ,线程ID ${Thread.currentThread().id}(${Thread.currentThread().name})，总耗时=${classLoadCost / 1000L} 微秒(${classLoadCost / 1000L/1000F} 豪秒)"
            )
        }
        return clazz;
    }
}
```

- 在 `Application attachBaseContext` 阶段反射替换 application 实例的 classLoader 对应的 parent 指向

```kotlin
object HookClassLoader {
    @JvmStatic
    fun hook(application: Application, onlyMainThread: Boolean = true) {
        val pathClassLoader = application.classLoader
        try {
            val monitorClassLoader = MonitorClassLoader("", pathClassLoader.parent, onlyMainThread)
            val pathListField = BaseDexClassLoader::class.java.getDeclaredField("pathList")
            pathListField.isAccessible = true
            val pathList = pathListField.get(pathClassLoader)
            pathListField.set(monitorClassLoader, pathList)

//            val parentField = BaseDexClassLoader::class.java.getDeclaredField("parent")
            val parentField =
                ClassLoader::class.java.getDeclaredField("parent") // BaseDexClassLoader的父类是ClassLoader
            parentField.isAccessible = true
            parentField.set(pathClassLoader, monitorClassLoader)
        } catch (throwable: Throwable) {
            Log.e("hook", throwable.stackTraceToString())
        }
    }
}
```

改之前：PathClassLoader.parent → BootClassLoader
Hook 之后：

- PathClassLoader.parent → MonitorClassLoader.parent → BootClassLoader
- MonitorClassLoader.pathList = PathClassLoader.pathList

这样就能获取到启动阶段的加载类和耗时情况

### 基于JVMTI 实现

#### 什么是 JVMTI？

`JVMTI` 全称 `JVM Tool Interface`，它是 Java 虚拟机定义的一个开发和监控 JVM 使用的程序接口(programing interface),通过该接口可以探查 JVM 内部的一些运行状态，甚至控制 JVM 应用程序的执行。需要注意的是，并非所有的 JVM 实现都支持 `JVMTI`。

`JVMTI`是双通道接口(two-way interface)。`JVMTI`的客户端，或称为代理(agent)，agent可以通过注册监听感兴趣的事件，另外，`JVMTI`提供了很多操作函数可以直接用来控制应用程序。

`JVMTI`代理与目标JVM运行在**同一个进程中**，通过JVMTI进行通信，**最大化控制能力，最小化通信成本**

#### Ref

- [ ] [基于JVMTI 实现性能监控 - 掘金](https://juejin.cn/post/6942782366993612813)

## class 预加载实现

### 简单实现

将每个类的全路径，用 `Class.forName` 加载进来

```kotlin
object PreVerifyUtils {
    fun verify() {
        try {
            Class.forName(XXX::class.java.name)
            Class.forName(XXX1::class.java.name)
            Class.forName(XXX2::class.java.name)
            // ...
        }
    }
}
```

### 封装

目前应用通常都是多模块的，因此我们可以设计一个抽象接口，不同的业务模块可以继承该抽象接口，定义不同业务模块需要进行预加载的类。

```java
/**
 * 资源预加载接口
 */
public interface PreloadDemander {
    /**
     * 配置所有需要预加载的类
     * @return
     */
    Class[] getPreloadClasses();
}
```

之后在启动阶段收集所有的类加载实例，并触发预加载

```kotlin
/**
 * 类预加载执行器
 */
object ClassPreloadExecutor {
    private val demanders = mutableListOf<PreloadDemander>()
    fun addDemander(classPreloadDemander: PreloadDemander) {
        demanders.add(classPreloadDemander)
    }
    /**
     * this method shouldn't run on main thread
     */
    @WorkerThread fun doPreload() {
	for (demander in localDemanders) {
		val classes = demander.preloadClasses
		classes.forEach {
			val classLoader = ClassPreloadExecutor::class.java.classLoader
			Class.forName(it.name, true, classLoader)
			}
		}
    }
}
```

### 收益

- 配置了大概90个类，在终端机型测试数据显示 这些类的加载需要消耗**30ms**左右的cpu时间，不同类加载的消耗时间差异主要来自于类的复杂度 比如继承体系、字段属性数量等， 以及类初始化阶段的耗时，比如静态成员变量的立即初始化、静态代码块的执行等。

### 优化

目前的方案 配置的具体类列表来源于手动配置，这种方案的弊端在于，类的列表需要开发维护，在版本快速迭代变更的情况下 维护成本较大， 并且对于一些大型App，存在着非常多的AB实验条件，这也可能导致不同的用户在类加载上是会有区别的。

使用自定义的 ClassLoader 可以手动收集启动阶段主线程的类列表，那么我们是否可以在端上每次启动时自动收集加载的类，如果发现这个类不在现有的名单中则加入到名单，在下次启动时进行预加载。当然具体的策略还需要做详细设计，比如`控制预加载名单的列表大小`，`被加入预加载名单的类最低耗时阈值`，`淘汰策略`等等。

# Ref

- [ ] [Android启动优化-类预加载](https://juejin.cn/post/7071120586965008398)
- [ ] [Android 冷启动优化的3个小案例-CSDN博客](https://blog.csdn.net/zhuoxiuwu/article/details/131431605)
