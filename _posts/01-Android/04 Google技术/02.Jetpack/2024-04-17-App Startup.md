---
date created: 2024-04-17 20:40
date updated: 2024-12-24 00:32
dg-publish: true
---

# App Startup

## App Startup使用

### 引入

```groovy
dependencies {
    implementation "androidx.startup:startup-runtime:1.1.1"
}
```

### 自动初始化

1. 自定义实现`Initializer`类

```kotlin
// Initializes WorkManager.
class WorkManagerInitializer : Initializer<WorkManager> {
    override fun create(context: Context): WorkManager {
        val configuration = Configuration.Builder().build()
        WorkManager.initialize(context, configuration)
        return WorkManager.getInstance(context)
    }
    override fun dependencies(): List<Class<out Initializer<*>>> {
        // No dependencies on other libraries.
        return emptyList()
    }
}
```

- T create([@NonNull ](/NonNull) Context context) 初始化一个组件，返回给 Application
- dependencies() 如果需要依赖其他的 `Initializer`，重写 dependencies 方法，返回即可。如下面的 `ExampleLoggerInitializer` 依赖于 `WorkManagerInitializer`

2. 定义`ExampleLoggerInitializer`类

```kotlin
// Initializes ExampleLogger.
class ExampleLoggerInitializer : Initializer<ExampleLogger> {
    override fun create(context: Context): ExampleLogger {
        // WorkManager.getInstance() is non-null only after
        // WorkManager is initialized.
        return ExampleLogger(WorkManager.getInstance(context))
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        // Defines a dependency on WorkManagerInitializer so it can be
        // initialized after WorkManager is initialized.
        return listOf(WorkManagerInitializer::class.java)
    }
}

class  ExampleLogger(val workManager: WorkManager){

}
```

3. 在 AndroidManifest 里面配置自定义的 `InitializationProvider`

```kotlin
<provider
    android:name="androidx.startup.InitializationProvider"
    android:authorities="${applicationId}.androidx-startup"
    android:exported="false"
    tools:node="merge">
    <!-- This entry makes ExampleLoggerInitializer discoverable. -->
    <meta-data  android:name="com.xj.anchortask.appstartup.ExampleLoggerInitializer"
        android:value="androidx.startup" />
</provider>
```

它是有固定格式的，配置者只需要配置 `meta-data` 中的 `name` 即可，这里的 name 是我们自定义的 Initializer 全路径。

### 手动初始化

1. AndroidManifest移除`InitializationProvider`或设置为`tools:node=remove`

```xml
<provider
    android:name="androidx.startup.InitializationProvider"
    android:authorities="${applicationId}.androidx-startup"
    android:exported="false"
    tools:node="merge">
    <meta-data
        android:name="me.hacket.assistant.samples.google.architecture.appstartup.ExampleLoggerInitializer"
        android:value="androidx.startup"
        tools:node="remove" />
</provider>
```

2. 代码调用

```kotlin
AppInitializer.getInstance(context).initializeComponent(ExampleLoggerInitializer::class.java)
```

## App Startup 源码分析

[Android 启动优化（七） - JetPack App Startup 使用及源码浅析 - 掘金](https://juejin.cn/post/6952659008733839390)

## App Startup 小结

1. App Startup，我觉得他的设计初衷应该是为了收拢 ContentProvider，实际上对启动优化的帮助不是很大。
2. 如果你的项目都是同步初始化的话，并且使用到了多个ContentProvider，App Startup可能有一定的优化空间，毕竟统一到了一个ContentProvider中，同时支持了简单的顺序依赖。
3. 实际项目中启动优化，大多数啊都会使用多线程异步加载，这时候 App StartUp 就显得很鸡肋了

## Ref

- [x] App Startup：[应用启动  |  Android 开发者  |  Android Developers](https://developer.android.com/topic/libraries/app-startup)
