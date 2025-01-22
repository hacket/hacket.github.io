---
date_created: Tuesday, November 19th 2020, 11:27:19 pm
date_updated: Wednesday, January 22nd 2025, 11:20:19 pm
title: Gradle Task基础
author: hacket
categories:
  - Android
category: 构建系统
tags: [Gradle]
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
date created: 2024-03-07 21:36
date updated: 2024-12-26 00:18
aliases: [Gradle Task 基础]
linter-yaml-title-alias: Gradle Task 基础
---

# Gradle Task 基础

## 什么是 Task？

一个 Project 由一个或者多个 Task 组成，它是构建过程中的原子任务，可以使编译 class、上传 jar 包等。只有 Task 才可以在 Gradle 的执行阶段去执行（其实质是执行的 Task 中的一系列 Action）

### 什么是 Task action？

Task 的 Action 就是编译时所需的操作，它不是一个，它是一组，即可以有多个。

1. `@TaskAction` 修饰的是 Task 的 Action
2. `doFirst{}`：表示 task 执行最开始的时候被调用的 Action。
3. `doLast{}`：表示 task 将执行完的时候被调用的 Action。

> doFirst 和 doLast 是可以被执行多次的

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240307213513.png)

Action 执行顺序为 ：

- doFirst：倒序
- Action：正序
- doLast：正序

### Task 分类

#### Actionable tasks

有一些 `action(s)` 的 task ，例如 : `compileJava`

#### Lifecycle tasks

没有 `actions` 的 task，例如：`assemble`, `build`

## Built-in task 内置 Task

Gradle 也自带了很多实用的 task，使用 `type` 属性来直接使用一个已有的 task 类型，比如 Gradle 自带的 `Copy`、`Delete`、`Sync` task 等等

#### 1. Copy task

```groovy
tasks.create<Copy>("myCopy") {
    // 源
    // 单个或多个文件(夹)
    from("build.gradle.kts", "assets/")
    // 
    include("bundle/*.js")
    include("data/**/*.zip")
    // 
    exclude("**/test.*")

    // 目标目录
    into("$buildDir")
}
```

Copy 任务会保留源文件的所有目录结构，除了使用 task, 还可以直接调用 project 对象的 api 来使用 copy：

```groovy
// 通过 api 调用 copy
copy {
    from("src/main/webapp")
    into("$buildDir/explodedWar")
    include("**/*.html")
    include("**/*.jsp")
}
```

```
include/exclude 模式：常见两种模式, `*.pdf` 代表当前目录下所有 pdf 文件,` **/*.pdf`则代表当前目录以及子目录下的所有 pdf 文件。
include/exclude 共存原则：exclude 会覆盖 include 结果, 无论书写顺序.
```

#### 2. Zip/Jar/Tar task

##### Zip

```groovy
tasks.create<Zip>("myPackage") {
    from("$buildDir")
    
    // 输出目录
    destinationDirectory.set(file("$buildDir/dist"))
    // 输出文件名
    archiveFileName.set("my-distribution.zip")
}
```

##### Jar

将 module 打包成 xxx. Jar

```groovy
task clearJar(type: Delete) {
    delete "libs/${project.name}_1.0.2.jar"
}

task makeJar(type: Jar) {
    // 指定生成的jar名
    baseName "${project.name}_1.0.2"
    // 从哪里打包class文件
    from('build/intermediates/javac/release/classes/')
    // 打包到jar后的目录结构
//    into('me.hacket.tts')
    //去掉不需要打包的目录和文件
    exclude('test/', '**/BuildConfig.class', '**R.class', 'com/iflytek/autofly/tts/utils/messagehandler/MessageEntity.class')
}

makeJar.dependsOn(clearJar, build)
```

**如何排除某个类？**

1. 正则：**/BuildConfig. Class
2. 全路径：com/iflytek/autofly/tts/utils/messagehandler/MessageEntity. Class

```
// exclude排除指定的目录：/.gradle、 /.idea 、/.git
exclude "**/.gradle/**"
exclude "**/.idea/**"
exclude "**/.git/**"
```

#### 3. Delete、Copy、Sync

```groovy
// 1、删除根目录下的 build 文件
task clean(type: Delete) {
    delete rootProject.buildDir
}
// 2、将 doc 复制到 build/target 目录下
task copyDocs(type: Copy) {
    from 'src/main/doc'
    into 'build/target/doc'
}
// 3、执行时会复制源文件到目标目录，然后从目标目录删除所有非复制文件
task syncFile(type:Sync) {
    from 'src/main/doc'
    into 'build/target/doc'
}
```

# 自定义 Task

自定义 Task 通过继承 `DefaultTask`，默认的 `DefaultTask` 没有提供 action。

## Define Task (task 创建)

### 过时的写法

#### Project task() 方法

Project 提供了如下创建 Task 的方法：

```groovy
// org.gradle.api.Project.java
Task task(String name) // 创建一个名为name的task，并添加到project去中；等同于调用
Task task(String name, Action<? super Task> configureAction)
Task task(String name, Closure configureClosure)
Task task(Map<String, ?> args, String name) throws InvalidUserDataException
Task task(Map<String, ?> args, String name, Closure configureClosure)
```

task 的一些 args 配置：

| 属性              | 描述                                       | 默认值         |
| --------------- | ---------------------------------------- | ----------- |
| type            | 需要创建的 task Class                          | DefaultTask |
| action          | 当 task 执行的时候，需要执行的闭包 closure 或 行为 Action | null        |
| overwrite       | 替换一个已存在的 task                            | false       |
| dependsOn       | 该 task 所依赖的 task 集合                      | []          |
| group           | 该 task 所属组                               | null        |
| description     | task 的描述信息                               | null        |
| constructorArgs | 传递到 task Class 构造器中的参数, since 4.7        | null        |

示例：

```groovy
// build.gradle
// 1、声明一个名为 myTask2 的 gradle tasktask myTask2  
myTask2 {  
// 2、在 myTask2 task 闭包内输出 hello~，执行在 gradle 生命周期的第二个阶段，即配置阶段。  
    println("hello myTask2~")  
// 3、给 task 附带一些 执行动作（Action），执行在gradle 生命周期的第三个阶段，即执行阶段。  
    doFirst {  
        println("start myTask2")  
    }  
    doLast {  
        println("end myTask2")  
    }  
}  
// 4、除了上述这种将声明与配置、Action分别定义的方式之外，也可以直接将它们结合起来。这里我们又定义了一个 Android task，它依赖于 myTask2 task，也就是说，必须先执行完 myTask2 task，才能去执行 Android task，由此，它们之间便组成了一个有向无环图：myTask2 task => Android task  
task Andorid(dependsOn: "myTask2") {  
    doLast {  
        println("Andorid end?")  
    }  
}  
  
// 指定Task的type  
Task taskA = task taskB(type: CustomTask)  
  
class CustomTask extends DefaultTask {  
    @TaskAction  
    def doSelf() {  
        println "Task执行本身调用：doSelf"  
    }  
}  
  
// 带group和description参数  
task myTask1(group: "MyTask", description: "task1") {  
    println "This is myTask1"  
}  
  
// 带group，description，dependsOn参数  
task myTask2(group: "MyTask2", description: "myTask2 desc", dependsOn: "task2") {  
    println "This is myTask2"  
}  
  
/**  
  
 - 第一种创建任务方式：  
 - 方法原型：Task task(String name) throws InvalidUserDataException;  
  
 *///定义Task变量接收task()方法创建的Task,方法配置创建的Task  
def Task taskA = task(taskA)  
//配置创建的Task  
taskA.doFirst {  
    println "第一种创建任务的方式"  
}  
  
/**task  
 - 第二种创建任务方式：可在Map参数中进行相关配置，如依赖、任务描述、组别等  
 - 方法原型：Task task(Map<String, ?> args, String name) throws InvalidUserDataException;    
 */
def Task taskB = task(group: BasePlugin.BUILD_GROUP, taskB, description: "描述")  
//配置创建的Task  
taskB.doLast {  
    println "第二种创建任务的方式"  
    println "任务taskB分组：${taskB.group}"  
    println "任务taskB描述：${taskB.description}"  
}  
  
/**  
  
 - 第三种创建任务方式：通过闭包的方式创建Task,闭包里的委托对象就是Task,即可在闭包内调用Task  
 - 的一切属性和方法来进行Task的配置  
 - 方法原型：Task task(String name, Closure configureClosure);  
  
 */task taskC {  
    description 'taskC的描述'  
    group BasePlugin.BUILD_GROUP  
    doFirst {  
        println "第三种创建任务的方式"  
        println "任务taskC分组：${group}"  
        println "任务taskC描述：${description}"  
    }  
}  
  
/**  
  
 - 第四种创建任务的方式：可在闭包中灵活配置，也可在Map参数中配置，闭包中中的配置父覆盖Map中相同的配置  
 - 方法原型：Task task(Map<String, ?> args, String name, Closure configureClosure);  
  
 */def Task taskD = task(group: BasePlugin.BUILD_GROUP, taskD, description: "描述") {  
    description 'taskD的描述'  
    group BasePlugin.UPLOAD_GROUP  
    doFirst {  
        println "第四种创建任务的方式"  
        println "任务taskD分组：${group}"  
        println "任务taskD描述：${description}"  
    }  
}
```

#### tasks.create() (TaskContainer)

tasks 是 Project 的属性，其类型是 TaskContainer，所以可以通过 tasks 来创建任务，当然 TaskContainer 创建任务也有创建任务的其他构造方法<br>![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691410270835-82556a94-cf56-4a70-97f7-9b043f62e7a4.png#averageHue=%233c4554&clientId=ub4bccdd5-b16e-4&from=paste&height=194&id=u757ae71b&originHeight=388&originWidth=1316&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109244&status=done&style=none&taskId=u840bf08c-2099-40f3-84bd-ab73547f853&title=&width=658)

示例：

```groovy
// TaskContainer.create()
this.tasks.create(name: "myTask2") {
    setGroup("MyTask")
    setDescription("task2")
    println "This is myTask2"
}

// 通过 name 注册 task
tasks.create("foo") {
    // 配置阶段
    println("configure phase...")

    doLast {
        // 执行阶段
        println("execution phase...")
    }
}

// 还可以通过 Kotlin delegate properties 创建任务
// 这种方式有利于后续引用任务
val bar by tasks.creating {
    // 配置阶段
    println("configure phase...")
    
    doLast {
        // 执行阶段
        println("execution phase...")
    }
}

// 2. 继承 DefaultTask
open class HelloTask : DefaultTask() {
    init {
        // 配置阶段
        println("configure phase...")
    }
    @TaskAction
    fun hello() {
        // 执行阶段
        println("execution phase...")
    }
}
tasks.create<HelloTask>("foo")
```

**Project.task() 和 TaskContainer 创建 Task 的区别：**
Project 中各种通过 task() 方法创建 Task，最后都是通过 TaskContainer 的 create 方法创建 Task

### tasks.register 方式 -- 推荐

用 `register` 可以避免无必要的 `Configuration`

示例 1 :

```kotlin
tasks.register("hello2") {  
    group = "test"  
    doLast {  
        println("Hello world")  
    }  
}  
tasks.named("hello2") {  
    // named需要在register之后调用  
    group = "test2"  
    doLast {  
        println("Hello Jupiter")  
    }  
    doLast {  
        println("Hello hacket")  
    }  
    doLast {  
        println("Hello pig.")  
    }  
}
```

示例 2：带类型的

```kotlin
tasks.register("copy2", Copy::class) {  
    group = "test"  
    from("src")  
    into("build/src2")  
}  
tasks.register<Copy>("copy3") {  
    group = "test"  
    from("src")  
    into("build/src3")  
}
```

示例 3：代理属性注册

```kotlin
val hello3 by tasks.registering {  
    group = "test"  
    doLast {  
        println("hello3")  
    }  
}  
  
val copy4 by tasks.registering(Copy::class) {  
    group = "test"  
    from(file("srcDir"))  
    into(buildDir)  
}
```

### register 和 create 的区别

- 通过 register 创建时，只有在这个 task 被需要时，才会创建和配置；
- 通过 create 创建时，则会立即创建与配置该 Task，并添加到 TaskContainer 中；

直白话就是，register 是按需创建 task 的方式，这样 gradle 执行的性能更好（并不是你项目的性能）。

create 创建 task 的方式官方已经不推荐了，虽然现在还没标@Deprecated，但未来也可能会被废弃掉。

但是需要注意的是，register 属于懒加载，嵌套创建的 Task 在配置阶段无法被初始化，所以并不会被执行到。

> 除了 register 和 create，还有一个 replace 方法，用于替换名称已存在的 Task。

### Configuring a task （配置 task）

```kotlin
// tasks.register<Copy>("myCopy")
tasks.register<Copy>("myCopy")

// Configuring a task
tasks.named<Copy>("myCopy") {
    from("resources")
    into("target")
    include("**/*.txt", "**/*.xml", "**/*.properties")
}

// Retrieve a task reference and use it to configuring the task
// Configure task using Kotlin delegated properties and a lambda
val myCopy by tasks.existing(Copy::class) {
    from("resources")
    into("target")
}
myCopy {
    include("**/*.txt", "**/*.xml", "**/*.properties")
}

// Defining a task with a configuration block
tasks.register<Copy>("copy") {
   from("resources")
   into("target")
   include("**/*.txt", "**/*.xml", "**/*.properties")
}
```

### 参数传递到 Task 构造器

需要添加 ``@javax.inject.Inject 到构造参数中，参数不能为 null

```kotlin
abstract class CustomTask @Inject constructor(
    private val message: String,
    private val number: Int
) : DefaultTask()

tasks.register<CustomTask>("myTask", "hello", 42)
```

### 自定义 Task 属性

参数需要用 `@Internal` 注解或者 `input or output` 注解

```kotlin
abstract class MyTask1 : DefaultTask() {  
  
    @Internal  
    var taskName = "default"  
  
    @TaskAction  
    fun MyAction1() {  
        println("===========>>>> $taskName -- MyAction1")  
    }  
  
    @TaskAction  
    fun MyAction2() {  
        println("===========>>>>  $taskName -- MyAction2")  
    }  
}  
  
tasks.register<MyTask1>("myTask1") {  
    group = "test"  
    taskName = "我是传入的Task Name "  
}
```

否则报错：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240310111046.png)

### Skipping tasks

#### onlyIf

只有闭包的结果返回 True 时，才执行 Task

```kotlin
val hello by tasks.registering {
    doLast {
        println("hello world")
    }
}
hello {
    val skipProvider = providers.gradleProperty("skipHello")
    onlyIf("there is no property skipHello") {
        !skipProvider.isPresent()
    }
}
```

执行：`gradle hello -PskipHello --info`

> Task :app: hello 3 SKIPPED
> Skipping task ':app: hello 3' as task onlyIf 'there is no property skipHello' is false.

#### Using StopExecutionException

一个 task 的 action 抛出异常后，后续的 action 就不会执行了

#### Enabling and disabling tasks

每个 Task 都有一个 enabled 开关，true 开启，false 禁用，禁用之后任何操作都不会被执行。

```kotlin
val disableMe by tasks.registering {
    doLast {
        println("This should not be printed if the task is disabled.")
    }
}
disableMe {
    enabled = false
}
```

#### Task timeouts

Task 提供了 timeout 属性用于限制执行时间。

如果 Task 的运行时间超过指定的时间，则执行该任务的线程将被中断。

默认情况下，任务从不超时。

```kotlin
tasks.register("hangingTask") {
    doLast {
        Thread.sleep(100000)
    }
    timeout = Duration.ofMillis(500)
}
```

- task 执行超时会报错
- 不能响应 interrupt 的 task 不能 timeout
- 所有 built-in task 都能响应 timeout

### 遇到的问题

#### 自定义 plugin，在 task 列表找不到

问题：自定义的 plugin，task 没有出现在 Gradle tasks 列表

分析：执行下：` ./gradlew -q printDepTask  `

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240309194947.png)

解决：task 需要是 open 的

小结：

- Extension 最好是 abstract
- Task 也最好是 abstract，或者是 open 的

## Locating task（访问 Task）

### `Project.属性方式`

创建的任务 (Task) 属于项目 (Project) 的一个属性，其属性名就是任务名，该属性的类型是 Task，如果已知任务名称，那么可以通过任务名直接访问和操纵该任务了，也可以理解访问和操纵该任务所对应的 Task 对象。

- groovy 方式

```groovy
/**
 * 访问任务的第一种方式：Task名称.doLast{}
 */
task taskF {
}
taskF.doLast {
    println "第一种访问任务的方式"
}
```

- kotlin 方式

```kotlin
val hello3 by tasks.registering {  
    group = "test"  
    doLast {  
        println("hello3")  
    }  
}  
hello3.get().doLast {  
    println("hello3 again")  
}
```

### `[]` 运算符

使用 TaskContainer 访问任务都是通过 `TaskContainer#create` 方法创建的，而 TaskContainer 是创建任务的集合，在 Project 中可通过 tasks 属性访问 TaskContainer ,tasks 的类型就是 TaskContainer，所以对于已经创建的任务可通过访问几何元素的方式访问已创建任务的属性和方法。

```groovy
/**
 * 访问任务的第二种方式：使用TaskContainer访问任务
 */
task taskG {
}
tasks['taskG'].doLast {
    println "第二种访问任务的方式"
}
```

> 在 Groovy 中 [] 也是一个操作符，上面 tasks['taskG'] 的真正含义是 tasks.getAt('taskG') , getAt() 方法在 TaskCollection 中的方法，这样可以通过任务名称对相关任务进行访问和操作。

### withType

获取同一 type 的 task 配置

示例：配置所有 Copy 类型的 task, 增加一个 doLast 的 Action

```kotlin
tasks.withType<Copy>().configureEach {  
//    enabled = false  
    doLast {  
        println("=======================copy withType configureEach")  
    }  
}
tasks.register("test") {
    dependsOn(tasks.withType<Copy>())
}
```

### findByPath（路径访问的方式访问任务）

通过路径访问任务有两个关键方法：`findByPath` 和 `getByPath`，区别在于前者找不到指定任务的时候会返回 null，后者找不到任务的时候会抛出 UnknowTaskException 异常

```groovy
/**
 * 访问任务的第三种方式：使用路径访问任务
 */
task taskH{
    println 'taskH'
    //通过路径访问任务，参数可以是路径（没有访问成功，写法如下）
    println tasks.findByPath(':GradleTask:taskG')
    //通过路径访问任务，参数可以是任务名称
    println tasks.findByPath('taskG')
    println tasks.getByPath('taskG')
}
```

> The following shows how to access a task by path. This is not a recommended practice anymore as it breaks [task configuration avoidance](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html#task_configuration_avoidance) and project isolation. Dependencies between projects [should be declared as dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies_between_subprojects.html#declaring_dependencies_between_subprojects).

### 通过任务名称访问

通过任务名称访问，方法主要是 findByName 和 getByName，区别是 findByName 找不到返回 null，getByName 找不到抛出异常

```groovy
/**
 * 访问任务的第四种方式：使用任务名称访问
 */
task taskJ
tasks['taskJ'].doLast{
    println 'taskJ'
    println tasks.findByName('taskJ')
    println tasks.getByName('taskJ')
}
```

## Task 的属性和方法

### Task 属性

不管是哪一种 task 的定义方式，在 create 时 `()` 内我们都可以配置它的一系列属性，目前官方所支持的属性：

| 属性              | 描述                                       | 默认值         |
| --------------- | ---------------------------------------- | ----------- |
| name            | task 名字                                  | 无，必须指定      |
| type            | 需要创建的 task Class                         | DefaultTask |
| action          | 当 task 执行的时候，需要执行的闭包 closure 或 行为 Action | null        |
| overwrite       | 替换一个已存在的 task                            | false       |
| dependsOn       | 该 task 所依赖的 task 集合                      | []          |
| group           | 该 task 所属组                               | null        |
| description     | task 的描述信息                               | null        |
| constructorArgs | 传递到 task Class 构造器中的参数                   | null        |

- 使用 `$` 来引用另一个 task 的属性

```groovy
task Gradle_First() {
}
task Gradle_Last() {
    doLast {
        println "I am not $Gradle_First.name"
    }
}
```

- 使用 ext 给 task 自定义需要的属性（除了使用已有的属性之外，我们也可以使用 ext 给 task 自定义需要的属性）

```groovy
task Gradle_First() {
    ext.good = true
}
task Gradle_Last() {
    doFirst {
        println Gradle_First.good
    }
    doLast {
        println "I am not $Gradle_First.name"
    }
}
```

- 使用 defaultTasks 关键字标识默认执行任务 (使用 defaultTasks 关键字 来将一些任务标识为默认的执行任务)

```groovy
defaultTasks "Gradle_First", "Gradle_Last"
task Gradle_First() {
    ext.good = true
}
task Gradle_Last() {
    doFirst {
        println Gradle_First.goodg
    }
    doLast {
        println "I am not $Gradle_First.name"
    }
}
```

### Task 方法

- enabled 任务的启用和禁用

```
taskA.enabled = true
```

- onlyIf<br>断言是一个条件表达式， Task 对象有一个 onlyIf 方法，该方法可以接收一个闭包作为参数，如果该闭包内参数返回 true，则该任务执行，反之则不执行该任务，这样可以通过任务的断言来控制那些任务需要执行

```groovy
//任务的onlyIf断言
final String BUILD_ALL = 'all'
final String BUILD_FIRST = 'first'
final String BUILD_OTHERS = 'others'

task taskTencentRelease{
    doLast{
        println "打应用宝渠道包"
    }
}

task taskBaiduRelease{
    doLast{
        println "打百度手机助手渠道包"
    }
}

task taskMiuiRelease{
    doLast{
        println "打小米应用商店渠道包"
    }
}

task buildTask{
    group BasePlugin.BUILD_GROUP
    description "打渠道包"
}

//为buildTask添加依赖的具体任务
buildTask.dependsOn taskTencentRelease, taskBaiduRelease, taskMiuiRelease

taskTencentRelease.onlyIf {
    if (project.hasProperty("buildApp")){
        Object buildApp = project.property("buildApp")
        return BUILD_ALL == buildApp || BUILD_FIRST == buildApp
    }else{
        return true
    }
}

taskBaiduRelease.onlyIf {
    if (project.hasProperty("buildApp")){
        Object buildApp = project.property("buildApp")
        return BUILD_ALL == buildApp || BUILD_FIRST == buildApp
    }else{
        return true
    }
}
taskMiuiRelease.onlyIf {
    if (project.hasProperty("buildApp")){
        Object buildApp = project.property("buildApp")
        return BUILD_OTHERS == buildApp || BUILD_ALL == buildApp
    }else{
        return true
    }
}
```

执行：

```shell
# 其中buildApp和=后面的值others是键值对的关系，使用命令执行任务时可使用-P命令简写-P要为当前Project指定K-V的属性键值对，即-PK=V
gradle -PbuildApp=others buildTask
```

## Task 的依赖和执行顺序

指定 Task 的执行顺序有 三种 方式

### dependsOn 强依赖方式

dependsOn  表示一种 tasks 依赖于另一种 tasks，要想执行另一种 tasks，被依赖的要先执行

#### groovy

1. 静态依赖

```groovy
task task1 {
    doLast {
        println "This is task1"
    }
}

task task2 {
    doLast {
        println "This is task2"
    }
}

// Task 静态依赖方式1 (常用）
task task3(dependsOn: [task1, task2]) {
    doLast {
        println "This is task3"
    }
}

// Task 静态依赖方式2
task3.dependsOn(task1, task2)

// Task内部定义dependsOn
tasks.create("foo") {
    doLast {
        println("foo")
    }
}
tasks.create("bar") {
    dependsOn("foo")        // 使用 task 名称声明依赖关系
    doLast {
        println("bar")
    }
}
```

2. 动态依赖

```groovy
// Task 动态依赖方式
task dytask4 {
    dependsOn this.tasks.findAll { task ->
        return task.name.startsWith("task")
    }
    doLast {
        println "This is task4"
    }
}
```

3. 在 McImage 中就利用了 dependsOn 的方式将自身的 task 插入到了 Gradle 的构建流程之中，关键代码如下所示：

```groovy
// inject task
(project.tasks.findByName(chmodTask.name) as Task).dependsOn(mergeResourcesTask.taskDependencies.getDependencies(mergeResourcesTask))

(project.tasks.findByName(mcPicTask.name) as Task).dependsOn(project.tasks.findByName(chmodTask.name) as Task)
mergeResourcesTask.dependsOn(project.tasks.findByName(mcPicTask.name))
```

#### kotlin

```kotlin
// 示例1：跨module dependsOn
tasks.register("taskX") {
    dependsOn(":project-b:taskY")
    doLast {
        println("taskX")
    }
}
tasks.register("taskY") {
    doLast {
        println("taskY")
    }
}

// 示例2：用task provider object
val taskX by tasks.registering {
    doLast {
        println("taskX")
    }
}
val taskY by tasks.registering {
    doLast {
        println("taskY")
    }
}
taskX {
    dependsOn(taskY)
}

// 示例3：用lazy block
val taskX by tasks.registering {
    doLast {
        println("taskX")
    }
}
// Using a Gradle Provider
taskX {
    dependsOn(provider {
        tasks.filter { task -> task.name.startsWith("lib") }
    })
}
tasks.register("lib1") {
    doLast {
        println("lib1")
    }
}
tasks.register("lib2") {
    doLast {
        println("lib2")
    }
}
tasks.register("notALib") {
    doLast {
        println("notALib")
    }
}
```

### `finalizedBy`

`Finalizer` tasks are automatically added to the task graph when the `finalized task` is scheduled to run.

`A.finalizedBy(B)` ： Task A 执行后，立马执行 Task B；如果执行 B，A 不会执行

Kotlin：

```kotlin
tasks.register("eatBreakfask") {
    finalizedBy("brushYourTeeth")
    group = "test"
    doLast {
        println("Om Om now breakfast!")
    }
}
tasks.register("brushYourTeeth") {
    group = "test"
    doLast {
        println("Brushie Brushie Brushie")
    }
}
// tasks["eatBreakfask"].finalizedBy(tasks["brushYourTeeth"])

// 执行eatBreakfask
// > Task :app:eatBreakfask
// Om Om now breakfast!
// > Task :app:brushYourTeeth
// Brushie Brushie Brushie

// 执行brushYourTeeth
> Task :app:brushYourTeeth
Brushie Brushie Brushie
```

需要注意的是 `finalizedBy` 并不是依赖关系，就算 `taskX` 执行失败，`taskY` 也将正常执行：

```kotlin
val taskX by tasks.registering {  
    group = "test"  
    doLast {  
        println("taskX start")  
        throw RuntimeException("taskX exception")  
        println("taskX end")  
    }  
}  
val taskY by tasks.registering {  
    group = "test"  
    doLast {  
        println("taskY")  
    }  
}
taskX { finalizedBy(taskY) }
//> Task :app:taskX FAILED  
//        taskX start  
//  
//> Task :app:taskY  
//taskY  
//  
//FAILURE: Build failed with an exception.  
//  
//* What went wrong:  
//Execution failed for task ':app:taskX'.  
//> taskX exception
```

### 通过 API 指定依赖顺序 Task Ordering (task 顺序)

任务之间除了依赖关系外，还可以指定执行顺序。有两种方式指定执行顺序: `shouldRunAfter` 和 `mustRunAfter`。<br>shouldRunAfter 相对来说约束更宽松, 会在两种情况下失效：

1. A dependsOn B 的情况下, 如果指定 B shouldRunAfter A 则 shouldRunAfter 无效.(B 依然会先于 A 执行)
2. 当 parallel execution 时, 如果某个 task 除了 shouldRunAfter 以外的所有条件都已就绪时, 则无视 shouldRunAfter 立刻执行

mustRunAfter 更严格. 如果条件与依赖冲突, 则会报错。

```groovy
val taskX by tasks.creating {
    doLast {
       println("taskX")
    }
}
val taskY by tasks.creating {
    doLast {
        println("taskY")
    }
}

taskY { mustRunAfter(taskX) }
```

这时无论先执行哪个任务 (gradle taskX taskY 或者 gradle taskY taskX), taskX 都会先于 taskY 执行.<br>在最新的 gradle api 中，mustRunAfter 必须结合 dependsOn 强依赖进行配套使用

```groovy
// 通过 API 指定依赖顺序
task taskX {
    mustRunAfter "taskY"

    doFirst {
        println "this is taskX"
    }
}

task taskY {
    // 使用 mustRunAfter 指定依赖的（一至多个）前置 task
    // 也可以使用 shouldRunAfter 的方式，但是是非强制的依赖
//    shouldRunAfter taskA
    doFirst {
        println "this is taskY"
    }
}

task taskZ(dependsOn: [taskX, taskY]) {
    mustRunAfter "taskY"
    doFirst {
        println "this is taskZ"
    }
}
```

### task 依赖查看

使用使用 [task-tree](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdorongold%2Fgradle-task-tree "https://github.com/dorongold/gradle-task-tree") 插件 查看 task 依赖关系

```kotlin
plugins {
    id "com.dorongold.task-tree" version "2.1.1"
}
```

在 `gradle` 命令中包含 taskTree 任务即可：

```shell
# gradle <task 1>...<task N> taskTree

gradle build lint taskTree
```

## Task 的输入和输出

[[Gradle Task进阶#Task 的输入和输出]]

## Task Incremental 增量更新

[[Gradle Task进阶#Gradle Task 增量更新]]
