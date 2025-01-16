---
date created: 2024-03-07 21:45
date updated: 2024-12-26 00:18
dg-publish: true
---

# Gradle 自定义插件总结

## Gradle plugin `build.gradle[.kts]` 配置

### src 下对应的 java 目录没有被 AS 识别出来

问题：AGP8.1.3，AS(2024.3最新版本)
`build.gradle.kts`文件上方提示: standalone script under build root isn't highlighted as standalone
![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/obsidianobsidianobsidian202403020108681.png)
![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/obsidian202403020108681.png)
`src/main/java`在AS中也没有变颜色
![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/obsidian202403020036540.png)
问题分析：如果是手动创建文件夹，然后创建build.gradle.kts，AS识别不了，可能是AS的bug？
解决：通过`File→New→New Module`来创建module，这样就可以解决了

### publish的jar包没有包括classes

- 用对应语言写插件，就放到对应sourceSets文件夹下去（与jar包中是否有classes没关系）
  - java编写的就放`main/java
  - groovy编写的就放`main/groovy`
  - kotlin编写的就是`main/kotlin`

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302141225.png)

- 解决
  - 在`build.gradle(.kts)`中需要添加groovy插件: `apply plugin: 'groovy'`，即使放在java目录也是可以的
  - 如果在java目录写kotlin代码，需要引入`id("org.jetbrains.kotlin.jvm")` 否则发布的jar包没有kotlin类的，放在kotlin目录也是可以的

### 使用`java-gradle-plugin`插件

参考：[[04.Gradle三方插件#java-gradle-plugin]]

## extension 相关

### extension定义相关

#### extension 类需要可继承的

- 如果是kotlin class，需要open修饰
- 一般用 abstract  class

#### extension定义需要create后再使用

否则会报错：

> `Could not find method dingPgyerConfig() for arguments [build_6l85nymtuc9s9srndt732is8y$_run_closure1@29e705c9] on project ':Google' of type org.gradle.api.Project.`

#### 自定义的 extension 定义获取不到值，在 afterEvaluate 后获取

create之后立即使用，这个时候bean里面是默认值，也就是说build.gradle中的信息还没有加载进去，需要在整个gradle配置完成之后bean中才会填充上相应的值。
需要在`project.afterEvaluate{}`中获取

```groovy
final DemoExtension extension = project.getExtensions().create("demoConfig", DemoExtension.class);
System.out.println(TAG + "extension: " + extension); // 这里获取不到值
project.afterEvaluate(new Action<Project>() {
    @Override
    public void execute(Project project) {
        System.out.println(TAG + "extension afterEvaluate: " + extension); // 这里可以获取
    }
});
```

#### 获取已创建的 `extention`

##### findByName

```groovy
DingTalkExtension dingTalkExtension = target.getExtensions().findByName("dingPgyerConfig")
```

##### findByType

```groovy
DingTalkExtension config = project.getExtensions().findByType(DingTalkExtension.class)

subprojects {  
	afterEvaluate {  
		extensions.findByType<KotlinProjectExtension>()?.apply {  
			jvmToolchain(11)  
		}  
	}  
}
```

#### `extention`嵌套

extension嵌套，其实就是嵌套个内部类

```kotlin
open class MyPluginExtension(project: Project) {  
    var title: String? = null  
    var chapter: Int? = 0  
    var subExtension: SubExtension? = null  
  
    init {  
        subExtension = project.extensions.create("sub", SubExtension::class.java)  
    }  
  
    fun string(): String {  
        return "title: $title, chapter: $chapter, author: ${subExtension?.author}"  
    }  
}  
  
open class SubExtension {  
    var author: String? = null  
}
```

使用：

```kotlin
myPluginExtension {
    title = "Hello from myPluginExtension"
    chapter = 2
    sub {
        author = "Hacket"
    }
}
```

#### 获取App和Lib的`extention`

```groovy
// 获取app的Extention
static AppExtension getConfig(Project project) {
    AppExtension config = project.getExtensions().findByType(AppExtension.class)
    return config
}

// 获取lib的Extention
static LibraryExtension getConfig(Project project) {
    LibraryExtension config = project.getExtensions().findByType(LibraryExtension.class)
    return config
}
```

#### 闭包类型是否应用插件

```groovy
class DingTalkExtension {
    public Closure<Boolean> groovyEnableByVariant
    boolean isEnable(String variantName) {
        if (groovyEnableByVariant == null) return true
        return groovyEnableByVariant.call(variantName)
    }
}
```

使用:

```groovy
apply plugin: 'dingPgyerPlugin'
dingPgyerConfig {
    pgyerApiKey = "[google]70885395bcdfd5ebdb72a5856c95596c"
    groovyEnableByVariant = { variantName ->
        variantName.toLowerCase().contains("release") // release才开启
    }
}
```

### 判断是否有某个插件

判断是否应用了`com.android.application`插件，代码来自walle

```groovy
class GradlePlugin implements org.gradle.api.Plugin<Project> {
    public static final String sPluginExtensionName = "walle";
    @Override
    void apply(Project project) {
        // 旧的写法
//        if (!project.plugins.hasPlugin("com.android.application")) {
//            throw new ProjectConfigurationException("Plugin requires the 'com.android.application' plugin to be configured.", null)
//        }
        if (!Project.getPluginManager().hasPlugin("com.android.application")) {
            throw new ProjectConfigurationException("Plugin requires the 'com.android.application' plugin to be configured.", null)
	}
}
```

## Task 相关

### Configuration Task 和 task 的输入输出

- 方式 1：`register(xx, configuration)`

```kotlin
val pgyerTaskName = Constants.TASK_UPLOAD_PGYER + variantName  
val uploadPgyerTaskProvider = target.tasks.register(  
	Constants.TASK_UPLOAD_PGYER + variantName,  
	PgyUploadApkTask::class.java  
) {  
	// Configuration会执行  

	// 输入  
	// PgyUploadApkTask依赖于variant.outputs中的第一个  
	it.apkFileProperty.set(variant.outputs.first().outputFile)  
	// 输出  
	it.outputFilProperty.set(target.layout.buildDirectory.file("output.txt"))  
}
```

- 方式 2：`configure { }`

```kotlin
val dingTalkTaskProvider = target.tasks.register(  
    dingTalkTaskName,  
    SendBuildResultToDingTalkTask::class.java  
)  
// 配置  
dingTalkTaskProvider.configure {  
    it.apkFileProperty.set(variant.outputs.first().outputFile)  
}
```

### 插件中的http请求时老是timeout

通过OkHttp请求，老是timeout

- 原因：网络问题
- 解决：把全局代理关掉；抓包软件关掉

### Gradle插件中的task要用子线程

#### 子线程配合CountDownLatch

- 可以开子线程，在Task中可以用CountDownLatch等待子线程执行完毕，不然你的task可能就执行完毕了

#### Retrofit+RxJava做网络请求

如做一个上传蒲公英的插件，上传蒲公英需要3个接口才能完成上传：

1. key 上传文件存储标识唯一 key 通过该接口，开发者可以获取预上传 url 和相关的签名参数 POST <https://www.pgyer.com/apiv2/app/getCOSToken>
2. 上传文件到第上一步获取的 URL POST 在这一步中上传 App 成功后，App 会自动进入服务器后台队列继续后续的发布流程。所以，在这一步中 App 上传完成后，并不代表 App 已经完成发布。一般来说，一般1分钟以内就能完成发布。要检查是否发布完成，请调用下一步中的 API。
3. 检测应用是否发布完成，并获取发布应用的信息 GET <https://www.pgyer.com/apiv2/app/buildInfo>

如果在创建Retrofit时的CallAdapterFactory是create()：

```groovy
.addCallAdapterFactory(RxJava3CallAdapterFactory.create())
```

会出现task执行完毕了，上传APK并没有完成<br>原因是`RxJava3CallAdapterFactory.create()`是异步，导致task执行完毕了<br>解决：用`RxJava3CallAdapterFactory.createSynchronous()`同步的即可。

### 封装第三方插件

#### 封装maven-publish三方插件

见`maven-publish.md`

## 根据Variant(productFlavor+buildType)引用Gradle插件（按需加载插件）

背景：只想在某一些buildType或者flavor中应用这个插件。<br>分析：这个问题的根本原因在于 Variant（buildType + flavor) 不是一个 Gradle 概念，而是源于 Android Gralde Plugin（AGP）的多渠道配置。所以从Gradle平台的角度很难向上提供便捷的支持：一个工程内的插件引入是全局的、平台性的，不以某一个插件的意志（AGP）而改变下层平台的机制。

案例：<br>mashi的preview包，配置了混淆，配置了Firebase插件，估计Firebase插件是根据是否设置了混淆来自动执行uploadCrashlyticsMappingFileDevPreview，但preview是测试包，并不需要上传mapping到Firebase，测试包我们用的bugly。所以就出现了打preview包的时候也执行了该task，而打包这台机器又404了，所以就上传超时了，gg了。

```
Execution failed for task ':app:uploadCrashlyticsMappingFileDevPreview'.
11:55:07 > org.apache.http.conn.HttpHostConnectException: Connect to firebasecrashlyticssymbols.googleapis.com:443 [firebasecrashlyticssymbols.googleapis.com/142.251.43.10] failed: Operation timed out (Connection timed out)
```

### 根据Variant去apply插件 --无效

```groovy
flavorDimensions += "server"
productFlavors {
    // ...
    create("production") {
        dimension = "server"
        applicationIdSuffix = ".production"
        versionNameSuffix = "-production"
        versionCode = 2
        apply("xxx") // 无效
    }
}
```

- `create("..."){}` 的闭包上下文是 `this:ApplicationProductFlavor`
- apply(...) 则为挂载于PluginAware的一个扩展方法（以build.gradle.kts），作用于整个、Project，这样一来你的插件还是会被全局引入。

同样的经典误区1：

```groovy
create("production") {
    dimension = "server"
    applicationIdSuffix = ".production"
    versionNameSuffix = "-production"
    versionCode = 2
    packagingOptions {
        jniLibs {
            excludes.add("...")
        }
    }
}
```

- packageingOptions是CommonExtension 接口的一个方法，并不属于 ApplicationProductFlavor，也即它是为整个 Android Gradle Plugin 进行设置，而不是单一 flavor，如果你在每个 flavor 中都进行不同的设置，最后一次的设置会覆盖前面所有的

同样的经典误区2：自定义插件根据variant去apply第三方插件

```kotlin
class ThirdManagerPlugin : Plugin<Project> {
    companion object {
        private const val EXTENSION_NAME = "thirdConfig"
        private const val ANDROID_EXTENSION_NAME = "android"
    }
    override fun apply(target: Project) {
        val container = target.extensions
        container.create(EXTENSION_NAME, ThridManagerExtension::class.java)
        target.afterEvaluate {
            val extension = container.findByName(EXTENSION_NAME)
            val androidExtension = container.findByName(ANDROID_EXTENSION_NAME) as? AppExtension
                ?: return@afterEvaluate
            val variants = androidExtension.applicationVariants
            variants.all { variant ->
                val variantName = variant.baseName.capitalize()
                when {
                    variantName.toLowerCase().contains("debug") -> {
                    }
                    variantName.toLowerCase().contains("release") -> {
                        val map = mapOf("plugin" to "me-hacket-helloworld")
                        target.apply(map) // 无效，config后，release的variant也调用了apply，也就全局apply了，插件就生效了
                    }
                }
            }
        }
    }
}
```

### 根据命令去apply插件 -- 部分有效

```
if (gradle.startParameter.taskRequests.toString().contains("production")) {
    apply(...)
}

// 在root build.gradle下设置ext，其他module可以直接使用
ext {
    // 命名为develop而不是debug, 规避ext可能存在重命名的风险
    develop = gradle.startParameter.taskNames.any { it.toLowerCase().contains('debug') }
    test = gradle.startParameter.taskNames.any { it.toLowerCase().contains('debug') || it.toLowerCase().contains('preview') }
    println("develop=$develop , test=${test}")
}
```

输入：

```
./gradlew clean assembleDebug
```

输出：

```
taskNames=[clean, assembleDebug]
taskRequests=[DefaultTaskExecutionRequest{args=[clean, assembleDebug],projectPath='null'}]
```

- 如果是`./gradlew clean assembleD`那就不行了

### 禁用对应 Variant 的插件 Task --有效 （总是引用插件，但禁用掉不需要的Task）

`whenTaskAdded{...}` 是 Gradle 平台的 API，它才不管你上层注册的Task分不分Variant，它只管把所有注册后且确定会添加进运行图（是个有向无环图DAG）的Task在这里提供一个回调的时机给开发者。与此同时，几乎所有的 Android 生态协同插件都会基于 Variant 的名字去给自己 Task 命名（如果它需要是一个 VariantAware Task的话），例如“UploadArchiveWithLogForProductionRelease”。这个不成文的规则给了我们字符串匹配的机会，也即你看到的下面代码:

```groovy
plugins { id("com.example.ua") }
// or apply("com.example.ua")
// ...
tasks.whenTaskAdded {
    if (name.contains("production", true)
            && name.contains("release", true)
            && name.contains("UploadArchive", true)) {
        enabled = false
    }
}
```

- mashi案例：开发包||测试包开启bugly，release包开启Firebase Crashlytics

```groovy
tasks.whenTaskAdded { task ->
    def taskName = task.name
    if (taskName.contains('SymtabFile')) {
        // release包不开启bugly，开发||测试包开启
        if (task.name.contains('uploadDevPreviewSymtabFile')) {
            task.enabled = true
            println("tasks.whenTaskAdded task(${task.name}) enabled=${task.enabled}")
        } else {
            task.enabled = false
            println("tasks.whenTaskAdded task(${task.name}) enabled=${task.enabled}")
        }
    }
    if (taskName.contains('CrashlyticsMappingFile')) {
        // release包开启Firebase，开发||测试包不开启
        if (task.name.contains('uploadCrashlyticsMappingFileProductRelease')
                || task.name.contains('injectCrashlyticsMappingFileIdProductRelease')
        ) {
            task.enabled = true
            println("tasks.whenTaskAdded task(${task.name}) enabled=${task.enabled}")
        } else {
            task.enabled = false
            println("tasks.whenTaskAdded task(${task.name}) enabled=${task.enabled}")
        }
    }
}
```

### 在 Task 注册时拦截 --可以，高效

配置Extension：

```groovy
class DingTalkExtension { 
    public String pgyerApiKey
    public Closure<Boolean> groovyEnableByVariant
    // For Gradle Groovy DSL
    void enableByVariant(Closure<Boolean> selector) {
        groovyEnableByVariant = selector.dehydrate()
    }
    boolean isEnable(String variantName) {
        if (groovyEnableByVariant == null) return true
        return groovyEnableByVariant.call(variantName)
    }
    // ...
}
```

插件不生成对应的task：

```groovy
class SendApkToDingTalkPlugin implements Plugin<Project> { 
    @Override
    void apply(Project target) {
        target.afterEvaluate {
            DingTalkExtension dingTalkExtension2 = target.getExtensions().findByName("dingPgyerConfig")

            ExtensionContainer container = target.getExtensions()
            AppExtension androidExtension = container.findByName(Constants.ANDROID_EXTENSION_NAME)
            DomainObjectSet<ApplicationVariant> variants = androidExtension.getApplicationVariants()
            variants.all { ApplicationVariant variant ->
                String variantName = variant.baseName.capitalize()

                boolean isEnable = dingTalkExtension2.isEnable(variantName)
                if (!isEnable) {
                    return
                }

                // 创建蒲公英上传task
                def pgyerTask = target.tasks.create("${Constants.TASK_UPLOAD_PGYER}$variantName", PgyerUploadTask.class)
                pgyerTask.init(variant, target)

                // 创建发送钉钉消息task
                def dingTalkTask = target.tasks.create("${Constants.TASK_SEND_DINGTALK}$variantName", SendMsgToDingTalkTask.class)
                dingTalkTask.init(variant, target)

                def provider = variant.getAssembleProvider()
                provider.get().dependsOn(target.getTasks().findByName("clean"))
                pgyerTask.dependsOn(provider.get())
                dingTalkTask.dependsOn(pgyerTask)
            }
        }
    }
}
```

使用：

```groovy
apply plugin: 'ding-pgyer'
dingPgyerConfig {
    pgyerApiKey = "[google]70885395bcdfd5ebdb72a5856c95596c"
    apiToken = "[google]632474cbdf7cce9a68cd8ece8d8aecc27eead23d888874aca73f435bd0014c83"
    atMobiles = ["[google]13510590884","[google]13168757017"]
    groovyEnableByVariant = { String variant ->
        variant.name.toLowerCase().contains("release") // release才开启
    }
}
```

### Ref

- [ ] <https://github.com/easilycoder/EasyDependency>
- [x] Android使用自己封装的maven-publish插件(maven 和 maven-publish),发布到自己或者公司的私有仓库流程<br><https://blog.csdn.net/intbird/article/details/105969242>

# 遇到的问题

## 如何查看Gradle源码？

### 查看`build.gradle[.kts]`源码

#### groovy集成

在`build.gradle`按`Ctrl + 鼠标左键`查看`dependencies`，出现的`Project.class`看不到源码

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240304155809.png)
解决：
将`distributionUrl`中的`xxx-bin.zip`改成包含源码的`xxx.all.zip`，再点击进去就能看到源码了

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-all.zip
```

#### `kts`集成

点击Index就可以查看Gradle源码了
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240304160703.png)

### 如何查看插件源码？

#### groovy

1. 编译后，在`External Libraries`查看

```groovy
compile gradleApi()
compile 'com.android.tools.build:gradle:8.1.3'
```

2. 手动Ctrl+左键点击api进去还是查看的是class文件，定位到该class，然后手动打开该文件就是源码了

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240304205858.png)

#### `kts`方式

在`External Libraries`下可以看到有很多Script，里面就是源码
![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240304160912.png)

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240304210003.png)

## 适配plugins方式

### 未发布到gradle plugin portal仓库的三方插件适配

plugins的方式引入：因为插件并没有发布到gradle plugin portal仓库中，所以需要自己修改插件的解析规则：

```groovy
pluginManagement {
    resolutionStrategy {
        // 定义id和插件库映射关系
        def modules = [
                'android-aspectjx'       : 'io.github.wurensen:gradle-android-plugin-aspectjx:2.1.0-SNAPSHOT',
        ]
        eachPlugin {
            println "id=" + requested.id.id
            def module = modules.get(requested.id.id)
            if (module != null) {
                useModule(module)
            }
        }
    }
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}
```

### maven-publish适配plugins

只使用了`maven-publish`插件，未使用`java-gradle-plugin`插件

先看看插件module的配置：

- `build.gradle.kts`

```kotlin
plugins {  
    id("java")  
    id("org.jetbrains.kotlin.jvm") //支持kotlin编写插件，不加上这个发布的jar包没有kotlin的类  
    id("maven-publish") //maven发布插件  
}  
  
// GAV  
val myGroup = "me.hacket.plugin"  
val myArtifactsId = "myArtifactsId"  
val myVersion = "1.0.0"  
  
val pluginId = "me.hacket.myPluginId"  
  
publishing {  
    publications {  
        create<MavenPublication>("myMaven") {  
            // 这个name随意，到时是出现在publishing group作为task的名字一部分  
            // MavenPublication是一个类型，这里是创建一个MavenPublication类型的对象  
  
            groupId = myGroup  
//            artifactId = myArtifactsId  
            version = myVersion  
  
            from(components["java"])  
        }  
    }    repositories {  
        maven {  
            url = uri("$rootDir/custom_plugin_repo")  
        }  
    }}  
  
dependencies {  
    compileOnly(gradleApi()) //gradleApi()是一个函数，返回一个对象，不加上会找不到gradle相关Api  
    compileOnly("com.android.tools.build:gradle:8.1.2")  
}
```

- 发布后

![image.png|250](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302153604.png)

再看看使用插件的项目配置

- 根目录的`build.gradle.kts`

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.  
plugins {  
    id("com.android.application") version "8.2.0" apply false  
    id("org.jetbrains.kotlin.android") version "1.8.10" apply false  
    id("org.jetbrains.kotlin.jvm") version "1.8.10" apply false  
    id("com.android.library") version "8.2.0" apply false  
  
    // 先声明插件, 后面才能使用，否则resolution eachPlugin Strategy找不到version  
    id("me.hacket.myPluginId") version "1.0.0" apply false  
```

- app `build.gradle.kts`

```kotlin
plugins {  
    id("com.android.application")  
    id("org.jetbrains.kotlin.android")  
  
    id("me.hacket.myPluginId")  
}
```

构建后报错
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302151000.png)

问题分析：
这是由于plugins方式引入插件，通过id和version没找到可实现的依赖，找不到就报错了

**解决1（只修改插件使用方）：**
app `build.gradle.kts`不使用全局的plugins方式引入，改成`classpath`方式，其他地方不用变

```kotlin
buildscript {  
    dependencies{  
        classpath("me.hacket.plugin:myGradlePlugin:1.0.1")  
    }  
}  
// Top-level build file where you can add configuration options common to all sub-projects/modules.  
plugins {  
    id("com.android.application") version "8.2.0" apply false  
    id("org.jetbrains.kotlin.android") version "1.8.10" apply false  
    id("org.jetbrains.kotlin.jvm") version "1.8.10" apply false  
    id("com.android.library") version "8.2.0" apply false 
}
```

解决2：plugins方式
去除app `build.gradle.kts`中的配置，还是使用plugins方式，但是需要手动将plugins方式通过id和version手动查找插件的依赖，在`setting.gradle.kts`配置

```kotlin
pluginManagement {  
    repositories {  
        google()  
        mavenCentral()  
        gradlePluginPortal()  
        maven {  
            url = uri("$rootDir/custom_plugin_repo")  
        }  
    }
    resolutionStrategy {  
        eachPlugin {  
            if (requested.id.name == "myPluginId") {  
                val module = "me.hacket.plugin:myGradlePlugin:${requested.version}"
                useModule(module)  
            }  
        }  
    }  
}  
dependencyResolutionManagement {  
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)  
    repositories {  
        google()  
        mavenCentral()  
    }  
}  
include(":app")  
include(":myGradlePlugin")  
//...
```

小结：

- 只通过`maven-publish`插件发布，未和`java-gradle-plugin`插件配合，需要引入`java`或`java-library`插件
- 需要手动添加依赖`compileOnly(gradleApi())`，否则找不动Gradle相关API
- `maven-publish`插件不会生成[Plugin Marker Artifacts](https://docs.gradle.org/nightly/userguide/plugins.html#sec:plugin_markers)，要使用plugins方式需要手动映射；手动映射通过pluginManagement resolutionStrategy来添加

### `maven-publish`配合`java-gradle-plugin`插件适配plugins

插件module `build.gradle.kts`配置：

```kotlin
plugins {  
    id("java-gradle-plugin") //会自动引入java-library、gradleApi()  
    id("org.jetbrains.kotlin.jvm") //支持kotlin编写插件，不加上这个发布的jar包没有kotlin的类  
    id("maven-publish") //maven发布插件  
}  
// GAV  
val myGroup = "me.hacket.plugin"  
val myArtifactsId = "myArtifactsId"  
val myVersion = "1.0.1"  
  
val pluginId = "me.hacket.myPluginId"  
  
gradlePlugin {  
    plugins {  
        create("myJavaGradlePluginName") { // 这个name随意  
            group = myGroup  
            version = myVersion  
            id = pluginId  
            implementationClass = "me.hacket.mygradleplugin.GreetingPlugin"  
        }  
    }}  
publishing {  
    publications {  
  
        create<MavenPublication>("maven") {  
            // 这个name随意，到时是出现在publishing group作为task的名字一部分  
            // MavenPublication是一个类型，这里是创建一个MavenPublication类型的对象  
  
            groupId = myGroup  
//            artifactId = myArtifactsId  
            version = myVersion  
  
            from(components["java"])  
        }  
    }    repositories {  
        maven {  
            url = uri("$rootDir/custom_plugin_repo")  
        }  
    }}  
dependencies {  
    compileOnly("com.android.tools.build:gradle:8.1.2")  
}
```

生成的publish相关task
![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302160425.png)
publish生成的jar包：
![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302160524.png)
`me.hacket.myPluginId.gradle.plugin-1.0.1.pom`文件的dependency就是插件实际的GAV，符合`plugin.id:plugin.id.gradle.plugin:plugin.version`格式的

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">  
  <modelVersion>4.0.0</modelVersion>  
  <groupId>me.hacket.myPluginId</groupId>  
  <artifactId>me.hacket.myPluginId.gradle.plugin</artifactId>  
  <version>1.0.1</version>  
  <packaging>pom</packaging>  
  <dependencies>  
    <dependency>  
      <groupId>me.hacket.plugin</groupId>  
      <artifactId>myGradlePlugin</artifactId>  
      <version>1.0.1</version>  
    </dependency>  
  </dependencies>  
</project>
```

## 通过plugins如何找到已有仓库的gav
