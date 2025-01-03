---
date created: 2024-03-13 08:07
tags:
  - '#开启并行编译，仅仅适用于模块化项目（存在多个'
  - '#开启kotlin的增量和并行编译'
  - '#开启并行编译，Gradle默认一次只执行一个Task，即串行，那我们就可以通过配置让Gradle并行来执行Task，从而提升构建效率，缩短构建时间。'
date updated: 2024-12-24 00:39
dg-publish: true
---

# 构建优化思路

Gradle 执行分为 `Initialization` -> `Configuration` -> `Execution` 三个阶段. 通常来说 `Initialization` 都很少, 我们主要来看看其它两个阶段的优化。
不管执行哪个 task, configuration 阶段都会执行. 因此 Configuration 阶段的优化十分必要

# 构建优化

## 常规优化手段

### 增加 Android Studio 运行内存

调整 AS 内存的配置文件在 `AS > Contents > bin > studio.vmoptions` 文件中（或者 `Help→Edit Custom VM Options`）：

```
-Xms256m
-Xmx1280m
-XX:ReservedCodeCacheSize=512m
-XX:+UseG1GC
-XX:SoftRefLRUPolicyMSPerMB=50
-XX:CICompilerCount=2
-XX:+HeapDumpOnOutOfMemoryError
.....
```

这里主要有两个参数需要关注：

- -Xms256m：初始堆内存大小；
- -Xmx1280m：最大堆内存大小；

Android Studio 的运行内存占比可以在 AS 底部的工具栏上右键，把 `Memory Indicator` 勾选上，然后在右下角就可以显示出来了：
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240325140229.png)

### 升级版本

- 升级 Gradle

> `Gradle`作为一个构建工具，提升构建性能可以说是基础操作，基本每个大版本都会带来各种各样的性能提升，比如Gradle 6.6以后对配置阶段的提升，7.0以后对Kotlin编译的提升，8.0以后对增量编译的进一步提升等等，这些都是构建工具之外无法做到的，所以，如果你的Gradle还不是最新版本，有条件的话一定要试试。
>
> 虽然升级 Gradle 有一定的适配成本，但是如果不升，长此以往，技术负债只会越来越多。

高版本的 Gradle 可以看到 Download Info 信息

- 升级 Java

> Gradle是运行在Java虚拟机上的，即JVM，Java性能的提升也会有利于Gradle。

- 升级 Plugin

> 同Gradle，一般也都是跟随着Gradle升一波。

### Gradle 配置

#### Configuration 优化：避免使用动态(Dynamic) 或者快照(SNAPSHOT) 版本

使用某个版本的依赖时, 推荐写死一个固定的版本, 例如 `'3.1.0'`. 这种方式下 Gradle 会从相关的 repo 下载依赖并缓存在 `  $GRADLE_USER_HOME/caches/modules-2/files-2.1/[包名] ` 中. 后续再有引用该依赖的地方都可以从缓存读取, 避免缓慢的网络下载。
除了上述 _固定版本_ 以外, Gradle 还支持两种版本格式: _动态版本(Dynamic Version)_ 和 _快照版本(Snapshot Version)_.

动态版本是类似于 '3.1.+' 这种以加号代替具体版本的声明方式. 快照版本是类似 '3.1.0-SNAPSHOT' 这种以 SNAPSHOT 结尾的版本. 这两种版本引用会迫使 Gradle 链接远程仓库检查是否有更新的依赖可用, 如果有则下载后缓存到本地. 默认情况下,这种缓存有效期为 24 小时. 可以通过以下方式调整缓存有效期:

```kotlin
configurations.all {
    resolutionStrategy.cacheDynamicVersionsFor(10, "minutes")     // 动态版本缓存时效
    resolutionStrategy.cacheChangingModulesFor(4, "hours")        // 快照版本缓存时效
}
```

动态版本和快照版本会影响编译速度, 尤其在网络状况不佳的情况下以及该依赖仅仅出现在内部 repo 的情况下. 因为 Gradle 会 **串行** 查询所有 repo, 直到找到该依赖才会下载并缓存. 然而这两种依赖方式失效后就需要重新查询和下载。
对于快照版本, 建议是禁止使用. 理由如下:

1. 在 release 模式下, 快照版本等价于无法追溯, 出了问题无从调查
2. 快照版本实际上会缓存一定时间, 时间太短则严重影响编译速度, 太长则起不到作用

在开发阶段, 可以使用四位版本号来代替 SNAPSHOT, 例如 `'3.1.0-SNAPSHOT' -> '3.1.0.1'`, 最有一位 build 号可以按需增长

#### Configuration 优化：repository 顺序

调整 repo 顺序并过滤 aar 请求。Gradle 在查找远程依赖的时候, 会串行查询所有 repo 中的 maven 地址, 直到找到可用的 aar 后下载. 因此把最快和最高命中率的仓库放在前面, 会有效减少 configuration 阶段所需的时间.

除了顺序以外, 并不是所有的仓库都提供所有的依赖, 尤其是有些公司会将业务 aar 放在内部搭建的仓库上. 这种情况下如果盲目增加 repository 会让 Configuration 时间变得难以接受. 我们通常需要将内部仓库放在最前, 同时明确指定哪些依赖可以去这里下载:

```kotlin
repositories {
    maven {
        url = uri("http://repo.mycompany.com/maven2")
        content {
            includeGroup("com.xxx")
        }
    }

    google()
    mavenCentral()
    // ...
}
```

除了 `includeGroup` 以外, 还有 `includeGroupByRegex` 正则匹配, `includeModule` 匹配某个模块等方法. 也可以通过 `excludeXxxx` 排除某些项目. Gradle 的规则永远都是:

- 不指定则默认包含所有
- 指定了 `include` 则只包含 `include` 的内容
- 指定了 `exclude` 则包含除了 `exclude` 的其它全部内容
- 同时制定 `include/exclude` 则先应用 `include`, 然后应用 `exclude`

#### Configuration 优化：减少不必要的 plugin

应用到项目中的每个插件和脚本都会增加 configuration 阶段的执行时间，减少不必要的 plugin

#### `gradle properties` 配置优化

##### 并行编译、~~AGP 构建缓存 (AGP 7.0 过时)~~、守护线程、虚拟机参数 (大小、GC 类型)等)

```properties
#开启并行编译，Gradle默认一次只执行一个Task，即串行，那我们就可以通过配置让Gradle并行来执行Task，从而提升构建效率，缩短构建时间。
org.gradle.parallel=true  

# AGP 构建缓存已在 AGP 4.1 中移除。AGP 构建缓存之前在 AGP 2.3 中引入；cleanBuildCache 任务以及 android.enableBuildCache 和 android.buildCacheDir 属性已被废弃，将在 AGP 7.0 中移除。 https://developer.android.com/studio/releases/gradle-plugin?buildsystem=ndk-build#4.1-build-cache-removed
android.enableBuildCache=true

# 开启构建缓存，Gradle 3.5新的缓存机制，可以缓存所有任务的输出，    
# 不同于buildCache仅仅缓存dex的外部libs，它可以复用任何时候的构建缓存，设置包括其它分支的构建缓存    
# 同一个Task的输入不变的情况下，Gradle直接去检索缓存中检索输出，就不用再次执行该Task了。
org.gradle.caching=true

# 构建初始化需要执行许多任务，例如java虚拟机的启动，加载虚拟机环境，加载class文件等等，
# 配置此项可以开启线程守护，并且仅仅第一次编译时会开启线程（Gradle 3.0版本以后默认支持）    
# 保证jvm编译命令在守护进程中编译apk，daemon可以大大减少加载jvm和classes的时间
org.gradle.daemon=true          

# 最大的优势在于帮助多 Moudle 的工程提速，在编译多个 Module 相互依赖的项目时，
# Gradle 会按需选择进行编译，即仅仅编译相关的 Module    
org.gradle.configureondemand=true           

# 配置编译时的虚拟机大小，加大编译时AndroidStudio使用的内存空间
## -Xmx2048m：指定 JVM 最大允许分配的堆内存为 2048MB，它会采用按需分配的方式。
## -XX:MaxPermSize=512m：指定 JVM 最大允许分配的非堆内存为 512MB，同上堆内存一样也是按需分配的。
## -XX:+UseParallelGC 如果用JDK9+，使用ParallelGC并行垃圾回收器更快
org.gradle.jvmargs=-Xmx3072m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseParallelGC
```

##### 开启 kotlin 的增量和并行编译

```properties
#开启kotlin的增量和并行编译
kotlin.incremental=true
kotlin.incremental.java=true
kotlin.incremental.js=true
kotlin.caching.enabled=true
kotlin.parallel.tasks.in.project=true 
```

##### **Enable configuration caching ** (截止 AGP 7. X 还是实验阶段)

Gradle 生命周期分为 Initialization、Configuration 和 Execution Phase；大型的项目的 configuration 阶段可能要耗时 1~2 min。Task Execution 已经有缓存了，但 Configuration 阶段还没有缓存，通过下面配置就可以启动 Configuration cache：

```properties
# configuration cache
org.gradle.unsafe.configuration-cache=true
org.gradle.unsafe.configuration-cache-problems=warn
```

> 需要 task 适配 Configuration Cache

配置缓存是Gradle 6.6以后提供的能力。
当没有构建配置发生变化的时候，比如构建脚本，Gradle 会直接跳过配置阶段，从而带来性能的提升。
构建配置主要是scripts和properties，一般业务开发也不会动这个，所以还是非常有用的。

##### **Enable file-system watching (可存储最后一次 task 构建信息)**

**什么是**[**file system watching**](https://blog.gradle.org/introducing-file-system-watching)**？**<br >为了知道 Gradle 是否需要执行一个 task，需要检查其最后一次 build 输入和输出文件是否变化。Daemon 存储这些构建信息在内存中，称为 vfs (_virtual file system_)。<br >如果没有 file system watching，daemon 不知道 build 信息，它会丢弃掉最后一次编译信息；当 file system watching 可用时，daemon 就知道了最后一次编译的信息，就可以 re-use 这些信息通过 `vfs`，避免了不必要的 IO 操作<br >**如何开启 file system watching?**

1. `Gradle7.x` 默认自动开启；
2. `Gradle6.7+` 可以在 `gradle.properties` 中开启，或者添加 `--wathch-fs` 命令行参数：

```properties
org.gradle.vfs.watch=true
```

3. Grade 6.5 和 6.6 有实现功能，开启：

```properties
org.gradle.unsafe.watch-fs=true
```

#### Gradle 离线模式

`gradle --offline

#### Task 增量编译

Gradle 4.10及以上默认开启，如果是4.10以下的版本，可以加上如下代码手动开启。

```groovy
tasks.withType(JavaCompile).configureEach {
    options.incremental = true
}
```

[[Gradle Task进阶#Gradle Task Incremental 增量更新]]

#### Configuration avoidance

[Task Configuration Avoidance](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)

##### task 创建用 register 替代 create

```kotlin
task("mySlowTask") {  
    val s = System.currentTimeMillis()  
    println("======== config start create.mySlowTask. This task will add 5 seconds to your configuration phase every time you run any task")  
    Thread.sleep(5000L)  
    doLast {  
        println("======== execute.mySlowTask. This task will add 5 seconds to your configuration phase every time you run any task")  
    }  
    println("======== config end create.mySlowTask(${System.currentTimeMillis() - s}). This task will add 5 seconds to your configuration phase every time you run any task")  
}  
tasks.register("mySlowTask2") {  
    val s = System.currentTimeMillis()  
    println("--------- config start create.mySlowTask2. This task will add 5 seconds to your configuration phase every time you run any task")  
    Thread.sleep(5000L)  
    doLast {  
        println("--------- register mySlowTask2. This task won't add much time to your build unless you specifically execute it or any tasks that depend on it")  
    }  
    println("--------- config end create.mySlowTask2(${System.currentTimeMillis() - s}). This task will add 5 seconds to your configuration phase every time you run any task")  
}
```

- MySlowTask task 每次 configuration 都会执行，每次都耗时 5 秒；每次 execute 也会 configuration
- MySlowTask 2 task 只有执行 task（或者被依赖）执行才会 configuration，execute

Sync 1 次，mySlowTask configuration 了，mySlowTask 2 没有 configuration
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240304215229.png)

##### 查找 task 用 Named ()替代 findByPath

### 常见 AGP 配置

#### 开发阶段关闭 APK split

对于日常开发调试而言, 我们通常不需要构建多架构或者多尺寸的 apk, 因此可以使用某个标记来区别调试构建和正式构建.

- 首先在 Android Studio 中增加一个标记(-PdevBuild), 区别调试构建和正式构建.

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403140016565.png)

- 构建脚本中对带有 devBuild 的构建关闭 multiple apk

```kotlin
android {
    if (project.hasProperty("devBuild")) {
        splits.abi.isEnable = false;
        splits.density.isEnable = false;
    }
}
```

如果是命令行构建, 也可以通过传入 `-PdevBuild` 参数来加速构建: ` ./gradlew -PdevBuild assembleDebug  `

#### 避免 AndroidManifest 改动

我们可以看到有些应用的 versionName 中带有 CI 的 build 号, 例如 "6.3.0.1523421". 最后的 1523421 就是 CI 构建的 build 号. 一般这种应用的构建脚本如下:

```kotlin
android {
    defaultConfig {
        versionName = "6.3.0.$buildId"
    }
}
```

由于 versionName 等最终都会反映到清单文件中(AndroidManifest.xml), 因此每次构建该文件都会发生变化. 这会严重影响增量构建的速度. 以下是官方给出的测试结果:
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403140015910.png)
因此我们要避免在构建脚本中对影响 AndroidManifest.xml 的字段进行 "动态化" 设置.

#### 关闭 aapt 自带的 png 压缩

在 android 编译过程中, aapt 默认会对 png 图片进行压缩

```groovy
android {
    buildTypes {
        release {
            // Disables PNG crunching for the release build type.
            crunchPngs false
        }
    }
}
// If you're using an older version of the plugin, use the following:
android {
    // ...
    if (project.hasProperty("devBuild")) {
        // ....
        aaptOptions.cruncherEnabled = false
    }
}
```

或者图片转为 webp，减少图片文件大小可以加快构建速度(无需在构建时进行压缩)

#### 其他

- 避免编译不必要的资源，`resConfigs`

```groovy
android {
    // ...
    productFlavors {
        dev {
            // ...
            resConfigs "en", "xxhdpi"
        }
        ...
    }
}
```

### 去掉开发过程中不用的插件，并打开即时运行

walle、蒲公英上传、firebase等插件，只在release包才打开

- 禁用无用 task，需要时再手动打开

```groovy
tasks.whenTaskAdded { task ->
    println("whenTaskAdded task=${task.name}, test=$test")
    if (task.name.contains("lint") // 如果instant run不生效，把clean这行干掉
//            || task.name.equals("clean") // 项目中有用到aidl则不可以舍弃这个任务
		|| task.name.contains("Aidl") // 用不到测试的时候就可以先关闭
		|| task.name.contains("mockableAndroidJar")
		|| task.name.contains("UnitTest")
		|| task.name.contains("AndroidTest") // 用不到NDK和JNI的也关闭掉
		|| task.name.contains("Ndk")
		|| task.name.contains("Jni")
    ) {
        task.enabled = false
    }
}
```

- debug 包禁用插件

debug包下禁用`Firebase Performance Monitoring plugin`插件

```groovy
android {
	//…
    buildTypes {
        debug {
            FirebasePerformance {
                instrumentationEnabled false
            }
        }
    }
}
```

### buildCache 构建缓存

[Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
类似增量编译, Gradle Cache 可以把之前构建过的 task 结果缓存起来, 一旦后面需要执行该 task 的时候直接使用缓存结果. 与增量编译不同的是, cache 是全局的, 对所有构建都生效. 此外, cache 即可以保存在本地(`$GRADLE_USER_HOME/caches`), 又可以使用 `网络路径`.
在 `settings.gradle` 中加入:

```groovy
// settings.gradle.kts
buildCache {
    local<DirectoryBuildCache> {
        directory = File(rootDir, "build-cache")

        // 编译结果是否同步到本地缓存. local cache 默认 true
        push = true

        // 无用缓存清理时间
        removeUnusedEntriesAfterDays = 30
    }

    remote<HttpBuildCache> {
        url = uri("https://example.com:8123/cache/")

        // 编译结果是否同步到远程缓存服务器. remote cache 默认 false
        push = false

        credentials {
            username = "build-cache-user"
            password = "some-complicated-password"
        }

        // 如果遇到 https 不授信问题, 可以关闭校验. 默认 false
        isAllowUntrustedServer = true
    }
} 
```

通常我们在 CI 编译脚本中 `push = true`, 而开发人员的机器上 `push = false` 避免缓存被污染.

cache 的设置还可以写在 init script 中, 这样对所有的构建使用相同的缓存. 例如在 `$GRADLE_USER_HOME/init.gradle.kts`:

```kotlin
// init.gradle.kts
gradle.settingsEvaluated {
    buildCache {
        remote<HttpBuildCache> {
            url = uri("https://example.com:8123/cache/")
        }
    }
}
```

并不是所有的 task 都会被缓存, 只有 _cacheable task_ 才会被 cache 缓存. cacheable task 会将 task input, output, implementation 等信息计算出一个 key 作为该 task 的 _build cache key_, 在开启 cache 的时候使用该值作为 task cache 命中条件. 因此, 保证 build cache key 的一致性是提高 cache 命中率的根本条件，build cache key 的具体定义参考官网

Gradle 基于 JVM, 大部分的 java 程序都会使用 system encoding, 而 build cache key 并没有把 encoding 作为其中一个因素, 这通常发生在多台机器共享缓存时, 使用了其他机器缓存的结果, 但是由于本地系统字符集差异导致异常. 通常在共享缓存时要明确设定文件系统的字符集来避免类似问题。

#### 配置缓存服务器

官方提供了两种方式搭建缓存服务器: Docker 镜像和 jar 包。以 Docker 方式举例(无需 Docker 基础), 这种方式对环境依赖小, 可以快速构建, 迁移或者废弃.

```shell
docker run -d -v /opt/build-cache-node:/data -p 8123:5071 gradle/build-cache-node:latest
```

> 缓存服务器使用了容器内部的 /data 作为缓存文件存储的目录, 同时使用 5071 端口对外提供服务. 不过我们启动的缓存服务器是一个 docker 容器, -v 参数指定了宿主机地址 /opt/build-cache-node 映射到容器内地址 /data. -p 参数指定了宿主机 8123 端口映射到容器内 5071 端口. 这样我们就可以访问宿主机的 /opt/build-cache-node 来查看缓存文件, 同时宿主机的 8123 作为端口, 暴露给其它机器提供缓存服务.

假设宿主机 ip 为 192.168.1.100, 则其他人可以配置如下：

```kotlin
// settings.gradle.kts
buildCache {
    remote<HttpBuildCache> {
        url = uri("http://192.168.1.100:8123/cache/")
        // url 中的 path(例子中的 /cache/) 是固定不能变的.
    }
}
```

默认情况下 cache 最大存储空间为 10G, 超过容量则最老的缓存被唤出. 单个缓存最大为 100MB, 超过大小的将不被缓存. 我们可以通过 Web 页面对其进行设置. 访问: [http://192.168.1.100:8123](https://link.juejin.cn/?target=http%3A%2F%2F192.168.1.100%3A8123 "http://192.168.1.100:8123") 打开缓存服务器配置页面, 私有服务器通常只需关注 Build cache 区域即可:
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403140006056.png)

这些配置都保存在服务器的 /data/conf/config.yaml 中. 本例中, 可以通过宿主机 `/opt/build-cache-node/conf/config.yaml` 查看.

需要注意的是, gradle 配置中的 `credentials` 实际上是通过 `Basic Authentication` 进行认证, 因此如果是 http 协议, 则会有密码泄露的风险:
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403140007333.png)

#### cache 失效

- 如果多个 task 输出到同一个目录, 也会导致 cache 失效:

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403140007322.png)
_Non-cacheable Tasks_ 指无需缓存的 task. 例如拷贝本地文件, 直接执行比从缓存下载更加高效, 这种 task 就是 Non-cachable task.
_Non-repeatable Tasks_ 指的是相同的输入无法得到相同的输出. 例如输出带了 timestamp.apple.com

- Crashlytics 导致的 cache 失效

`Crashlytics` 会把每次编译都生成一个新的 ID, 导致 Incremental Build 或 Caching 完全失效. 最佳实践是在 Debug 下将其禁用.

## KAPT优化

### KAPT原理

整个kapt处理过程分为了两步骤：生成Stub文件和调用apt处理注解，底层依然是调用java apt来完成整个任务。

1. 生成Stub文件

这个过程由`kaptGenerateStubs${variant}kotlin`承担，生成的Java文件只要保证能找到对应的方法和字段的描述符即可，无需处理方法体的实现内容

2. 调用java 的apt处理注解

### 使用增量注解处理器kapt

AGP3.3.0 及更高版本改进了对增量注解处理的支持。因此，如需提高增量构建速度，您应更新 AGP 并尽可能仅使用增量注解处理器。<br >很多库现在都支持了增量注解处理器

### KAPT 缓存

如果使用 Kotlin 的注解处理器(kapt), 默认情况下是不被缓存的(issue 在 [Gradle Cache: Make android instrumentation tests cacheable [115873051] - Issue Tracker](https://issuetracker.google.com/issues/115873051))
需要手动开启, 在 root gradle 中加入:

```kotlin
subprojects {
    pluginManager.withPlugin("kotlin-kapt") {
        configure<KaptExtension> {
            useBuildCache = true
        }
    }
}
```

### KAPT替换

#### KSP替换KAPT

**KAPT: **注解处理器，KAPT是拖慢编译速度的常见原因：从下图可知，KAPT首先需要将kt代码编译成JavaStubs，这些JavaStubs中保留了Java注解处理器关注的信息，这意味着编译器必须多次解析程序中的所有符号 (一次生成JavaStubs，另一次完成实际编译)，但是生成JavaStubs的过程是非常耗时的，往往生成Java Stubs的时间比APT真正处理注解的时间要长<br >**KAPT为什么慢？**<br >![](https://cdn.nlark.com/yuque/0/2022/png/694278/1668956926677-247c5da8-7a34-4592-8231-dee7c5d610ca.png?x-oss-process=image%2Fresize%2Cw_1125%2Climit_0#averageHue=%23f3f2ea&from=url&id=mM67c&originHeight=292&originWidth=1125&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> 从上面这张图其实就可以看出原因了，KAPT处理注解的原理是将代码首先生成Java Stubs，再将Java Stubs交给APT处理的，这样天然多了一步，自然就耗时了
> 同时在项目中可以发现，往往生成Java Stubs的时间比APT真正处理注解的时间要长，因此使用KSP有时可以得到100%以上的速度提升
> 同时由于KAPT不能直接解析Kotlin的特有的一些符号，比如data class，当我们要处理这些符号的时候就比较麻烦，而KSP则可以直接识别Kotlin符号

**KSP(Kotlin Symbol Processing)：**而KSP不需要生成JavaStubs，而是作为**Kotlin编译器插件**运行。它可以直接处理Kotlin符号，而不需要依赖Java注解处理基础架构。因为KSP相比KAPT少了生成JavaStubs的过程，因此通常可以得到100%以上的速度提升。<br >![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1668617483679-23d12e9c-cc45-4022-8e10-1e4ebe9b153c.png#averageHue=%23eef2f5&clientId=u870c561f-e0b3-4&from=paste&height=231&id=aBfUQ&originHeight=781&originWidth=1597&originalType=binary&ratio=1&rotation=0&showTitle=false&size=253499&status=done&style=none&taskId=uae887937-a1fa-4a96-9d28-ead9aee261c&title=&width=473)

#### 无法迁移KAPT的，用NAPT

移除kapt生成JavaStubs，具体见[NAPT]()

#### kapt耗时监控/优化

具体看 [今日头条 Android '秒' 级编译速度优化](https://mp.weixin.qq.com/s/e1L6gB_s5H38unSfhf4c6A)

### K2

在`kotlin 1.9.20`中K2已经处于beta版本了，会有进一步的性能提升。

尝鲜可以在`gradle.properties`中加上以下配置：

```properties
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

更多可查看：[What's new in Kotlin 1.9.20 | Kotlin Documentation](https://kotlinlang.org/docs/whatsnew1920.html#how-to-enable-the-kotlin-k2-compiler)

## Transform 优化

### Transform 并行

- Transfrom 增量，用 ByteX/booster 替换原始的 Transform 编写(AGP7.0以下)

## Gradle Sync 优化

- [ ] Sync 做了什么？
- [ ] Sync 耗时统计
- [ ] Sync 优化

## 升级AGP版本到7.0+

> AGP7.0+很多特性对构建速度有提升

### Transform迁移到AsmClassVisitorFactory（减少多个Transform的IO操作）

AGP7.0中Transform已经被标记为废弃了，并且将在AGP8.0中移除，在AGP7.0之后，可以使用AsmClassVisitorFactory来做插桩，根据官方的说法，AsmClassVisitoFactory会带来约**18%**的性能提升，同时可以减少约**5倍**代码。<br >AsmClassVisitorFactory之所以比Transform在性能上有优势，主要在于节省了IO的时间。<br >![transform工作流程](https://cdn.nlark.com/yuque/0/2022/webp/694278/1668616814137-5792e032-2d4f-4937-baf0-ac4f132c5fe6.webp#averageHue=%23e9f0f4&clientId=u870c561f-e0b3-4&from=paste&id=uc81125ad&originHeight=230&originWidth=1214&originalType=url&ratio=1&rotation=0&showTitle=true&status=done&style=none&taskId=udc219b01-9d18-4653-9ceb-84cab389224&title=transform%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B "transform工作流程")

> 多个Transform相互独立，都需要通过IO读取输入，修改字节码后将结果通过IO输出，供下一个Transform使用，如果每个Transform操作IO耗时+10s的话，各个Transform叠在一起，编译耗时就会呈线性增长。

![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1668616875180-b8b015d2-d394-48c8-9328-a4f41717a1be.webp#averageHue=%23dbe1db&clientId=u870c561f-e0b3-4&from=paste&id=uca9b201c&originHeight=260&originWidth=1202&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue8635066-b008-43e3-97a8-be58f9c232c&title=)<br >AsmClassVisitorFactory则不需要我们手动进行IO操作，这是因为AsmInstrumentationManager中已经做了统一处理，只需要进行一次IO操作，然后交给ClassVisitor列表处理，完成后统一输出；通过这种方式，可以有效地减少IO操作，减少耗时。其实国内之前滴滴开源的**Booster**与字节开源的**Bytex**，都是通过这种思路来优化Transform性能的

### `Disable Jetifier` 移除`Jetifier`

**`Jetifier` 作用：** `Jetifier` 是将 support 迁移到 androidX 的工具，当启动了 `Jetifier` 时，Gradle 插件会在构建时将三方 support 转换为 AndroidX，会对 configuration 阶段增加大量时间。
`Jetifier` 也会对 `sync` 耗时产生较大影响<br >**检测是否可以移除 Jetifier：**

1. AGP7.1.0+,  通过 `checkJetifier task` 来检测该 module 是否可以移除 `Jetifier`

```groovy
task checkJetifierAll(group: "verification") {}
subprojects { project ->
    project.tasks.whenTaskAdded { task ->
        if (task.name == "checkJetifier") {
            checkJetifierAll.dependsOn(task)
        }
    }
}
```

2. AGP7.1.0以下版本，通过[can-i-drop-jetifier](https://github.com/plnice/can-i-drop-jetifier)三方库来检测
3. 参考[Disabling Jetifier](https://adambennett.dev/2020/08/disabling-jetifier/)是否可以移除

**移除Jetifier方案**

1. 库已经有新版本适配AndroidX了，直接升级最新版即可
2. 库未适配，但有源码，添加`android.useAndroidX=true`，迁移到androidX，发个新版本
3. 库未适配且没有源码，通过[jetifier-standalone](https://developer.android.com/studio/command-line/jetifier)工具转换为支持androidX的aar/jar

**后续防劣化保证**

```groovy
allprojects {
    configurations.all { Configuration c ->
        if (c.state == Configuration.State.UNRESOLVED) {
            exclude group: 'com.android.support'
            exclude group: 'android.arch.core'
            exclude group: 'android.arch.lifecycle'
            exclude group: 'android.arch.persistence.room'
            exclude group: 'android.arch.persistence'
            exclude group: 'com.squareup.leakcanary', module: "leakcanary-object-watcher-android-support-fragments"
        }
    }
}
```

### **Enable non-transitive R classes （**禁用R文件传递，可以最低版本AGP4.2.0+）

之前旧版本的AGP，R文件都是依赖传递的，导致app中会有所有其依赖module的R（app可以引用module中的R，只需要使用app的包名而不需要module的包名，因为R会被合并到app的R中），导致的问题：

1. 编译速度慢
2. app中R文件过大

**适配：**<br >在`gradle.properties`中添加`android.nonTransitiveRClass=true`

### 开启Kotlin跨模块增量编译

**背景**<br >在组件化模块化的过程中，当我们修改底层模块(:util)时，所有依赖于这个模块的上层模块都需要重新编译，Kotlin的增量编译在这种情况往往是不生效的，这时候编译是很耗时的。<br >Kotlin1.7.0开始，Kotlin编译器对跨模块增量编译做了支持，并且和Gradle构建缓存兼容，对编译避免的支持也得到了改进，这些改进减少了模块和文件重新编译的次数，让整体编译更加迅速。<br >**如何开启Kotlin跨模块增量编译？**<br >在 gradle.properties 文件中设置以下选项即可使用新方式进行增量编译：

```groovy
kotlin.incremental.useClasspathSnapshot=true // 开启跨模块增量编译
kotlin.build.report.output=file // 可选，启用构建报告
```

## 模块aar化

将module发布到本地repo maven

## 差分编译

# 其他

## 去掉 buildSrc，用 composingBuilds 替代

### 什么是 buildSrc？

当运行 Gradle 时会检查项目中是否存在一个名为 buildSrc 的目录。然后 Gradle 会自动编译并测试这段代码，并将其放入构建脚本的类路径中, 对于多项目构建，只能有一个 buildSrc 目录，该目录必须位于根项目目录中。BuildSrc 可用来实现自定义插件、gradle task 和一些公共的配置 (如 dependencies、版本号等配置)

#### BuildSrc 的缺点

在 buildSrc 中的任何改变都会使构建缓存失效。在你使用远程构建缓存的情况下，它也会使其失效。

### 什么是 Composing builds？

复合构建只是包含其他构建的构建. 在许多方面，复合构建类似于 Gradle 多项目构建，不同之处在于，它包括完整的 builds ，而不是包含单个 projects

- 组合通常独立开发的构建，例如，在应用程序使用的库中尝试错误修复时
- 将大型的多项目构建分解为更小，更孤立的块，可以根据需要独立或一起工作

### BuildSrc vs Composing builds

- 很多项目用了 buildSrc 来统一管理依赖库和版本信息，支持 AS 的自动补全和单击跳转
- 项目中如果用了 buildSrc 来统一管理依赖，会让 build cache 失效，buildSrc 中有依赖更新将重新构建整个项目
- 用 composite builds 来统一管理依赖，有依赖更新时，不需要重新构建整个项目
- [ ] [再见吧 buildSrc, 拥抱 Composing builds 提升 Android 编译速度](https://juejin.cn/post/6844904176250519565)
- [ ] [How to use Composite builds as a replacement of buildSrc in Gradle](https://medium.com/bumble-tech/how-to-use-composite-builds-as-a-replacement-of-buildsrc-in-gradle-64ff99344b58)
- [ ] [Composite builds demos](https://github.com/badoo/Reaktive/tree/master/includedBuild)
- [ ] [复合构建demo（gradle-tips）](https://github.com/hacket/gradle-tips/blob/master/includedBuild/src/main/java/me/hacket/deps/DependenciesPlugin.kt)

## 三方仓库的依赖同步到内网Maven

- 修改代码和插件 Maven 仓库地址为内网地址

将仓库和插件的 maven 仓库改成内网的 Maven，内网 maven 代理到了 maven 跟 google 的中央仓库，新增了第三方依赖如果不存在，会自动从 google、mavenCentral 下载到内网 Maven，这样完全减少了 APP 的构建对外网的依赖

减少拉取Maven的时间

- 修改 `gradle-wrapper.properties` 的 `distributionUrl` 为内网地址，不存在下载

## 远端编译（分布式编译）

本地写代码，同步到远程设备，在远程设备上进行编译，最将编译的结果同步到本地。<br >[SyncKit](https://github.com/hi-dhl/SyncKit)<br >[mainframer](https://github.com/buildfoundation/mainframer)

## AGP版本，Gradle，IDE等工具升级到最新版

新的工具链往往有新的特性，优化，对速度也会有一定提升

## 升级打包机器的配置（截止到2022年11月17日）

1. CPU升级到M1，构建速度有1倍的提升
2. 大内存，Gradle的守护进程占用内存很大
3. 大SSD，Gradle的build cache还是很占空间的

## 其他

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654492234763-8c4828df-c4f1-486b-b5c8-e0ff4e8546e8.png#averageHue=%23f4f4f3&clientId=u0a16cb8f-42e9-4&from=paste&id=xsMTp&originHeight=620&originWidth=1240&originalType=url&ratio=1&rotation=0&showTitle=false&size=348227&status=done&style=none&taskId=u1636c6ca-faa3-4b9c-b26b-4b3ddafdfba&title=)

# Ref

- [ ] [Improve the Performance of Gradle Builds（Gradle官方）](https://docs.gradle.org/current/userguide/performance.html#use_compile_avoidance)
- [x] [优化构建速度（Android官方）](https://developer.android.com/studio/build/optimize-your-build.html)
- [x] [2022年编译加速的8个实用技巧](https://juejin.cn/post/7153250843905654798)
- [ ] [哔哩哔哩 Android 同步优化•Jetifier](https://mp.weixin.qq.com/s/EExWHagW8f1s2hDIjYmjKg)
- [x] [How we reduced our Gradle build times by over 80%](https://proandroiddev.com/how-we-reduced-our-gradle-build-times-by-over-80-51f2b6d6b05b)
- [x] [简单几招提速 Kotlin Kapt编译](https://droidyue.com/blog/2019/08/18/faster-kapt/)
