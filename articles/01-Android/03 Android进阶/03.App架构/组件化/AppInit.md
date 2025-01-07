---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# 已有启动框架

## Google App StartUp

Google官方出品，StartUp 提供了简便的依赖任务初始化功能，但是对于一个复杂项目来说，StartUp有以下不足：

1. **不支持异步任务** 如果通过 ContentProvider 启动，所有任务都在主线程执行，如果通过接口启动，所有任务都在同一个线程执行
2. **不支持组件化** 通过 Class 指定依赖任务，需要引用依赖的模块，耦合过高
3. **不支持多进程** 无法单独配置任务需要执行的进程
4. **不支持启动优先级 **虽然可以通过指定依赖来设置优先级，但是过于复杂

App StartUp更多的是收拢ContentProvider，对启动优化没啥意义

# 组件初始化框架演变

## 自定义接口+反射

每个module都有一个自己的Application

1. 接口IAppInit
2. 在app module中的AppInitConfig统一配置所有

```kotlin
object AppInitConfig {

    private val appInitList by lazy {
        listOf(
            "me.hacket.mylibrary1.MyLib1AppInit",
            "me.hacket.mylibrary2.MyLib2AppInit",
            "me.hacket.appinitdemo.MainAppInit"
        )
    }
    private val appInitMap by lazy { mutableMapOf<String, IAppInit>() }

    fun onCreate(application: Application) {
        appInitList.forEach {
            try {
                val clazz = Class.forName(it)
                val obj = clazz.newInstance() as? IAppInit
                obj?.let { appInitObj ->
                    appInitMap[it] = appInitObj
                    obj.onCreate(application)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
```

3. 在app的Application中调用

## 基于SPI

Service Provider Interface，resources配置，反射创建实例。

1. 在app中的`resources/META-INF/services`新建文件me.hacket.core.IAppInit，内容如下：

```kotlin
me.hacket.appinitdemo.MainAppInit
me.hacket.mylibrary1.MyLib1AppInit
me.hacket.mylibrary2.MyLib2AppInit
```

2. SPI查找代码

```kotlin
object AppInitSPI {
    fun find(application: Application) {
        val serviceLoader = ServiceLoader.load(
            IAppInit::class.java
        )
        for (item in serviceLoader) {
            item.onCreate(application)
        }
        application.registerComponentCallbacks(object : ComponentCallbacks2 {
            override fun onConfigurationChanged(configuration: Configuration) {
                for (item in serviceLoader) {
                    item.onConfigurationChanged(configuration)
                }
            }
            override fun onLowMemory() {
                for (item in serviceLoader) {
                    item.onLowMemory()
                }
            }
            override fun onTrimMemory(level: Int) {
                for (item in serviceLoader) {
                    item.onTrimMemory(level)
                }
            }
        })
    }
}
```

3. Application onCreate调用

## [AppInit](https://github.com/hacket/AppInit)(自研)

### 背景

组件化时，由于代码是分了多个module，module_home，module_share, module_utils，各个组件间需要初始化，且各个module之间存在着依赖初始化的关系：module_home的分享共享依赖module_share，module_share依赖module_utils，如果module_share先于module_utils初始化，可能导致module_share用到了module_utils的工具类未初始化导致一些不可预测的的线或crash问题。

### AppInit支持功能

1. 支持Application生命周期分发
2. 支持任务的异步
3. 支持组件化
4. 支持任务依赖
5. 支持任务的优先级
6. 支持指定任意进程初始化
7. 支持[App StartUp](https://developer.android.com/topic/libraries/app-startup)
8. 支持KAPT/KSP生成初始化的Task

> kapt慢的原因：kapt有生成Stub.java和调用java apt两个步骤，生成Stub比apt速度还要慢；推荐使用ksp

### AppInit原理

- kapt收集任务
- ASM字节码插桩收集到的任务到初始化
- 有向无环图任务依赖<br />
