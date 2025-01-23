---
date_created: Tuesday, November 19th 2020, 11:27:19 pm
date_updated: Wednesday, January 22nd 2025, 11:16:55 pm
title: Gradle 和 Maven
author: hacket
categories:
  - Android
category: 构建系统
tags: [Gradle, Maven]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: Saturday, September 14th 2024, 12:45:00 am
date updated: Friday, January 17th 2025, 11:06:15 pm
image-auto-upload: true
feed: show
format: list
aliases: [Gradle 插件之 maven-publish]
linter-yaml-title-alias: Gradle 插件之 maven-publish
---

# Gradle 插件之 maven-publish

## maven-publish 介绍

maven-publish 官方文档：[publishing_maven.html](https://docs.gradle.org/current/userguide/publishing_maven.html)<br>`maven` 插件已经过时，官方推荐使用 `maven-publish` 插件来实现将我们的代码发布到 Apache Maven 仓库的功能。

### maven-publish 插件引入

- groovy 脚本引入

```groovy
// build.gradle
plugins {
    id 'maven-publish'
}
```

- kts 脚本引入

```kotlin
// build.gradle.kts
plugins {
    `maven-publish`
}
```

### 基础概念

#### Tasks

所有以下任务都归在名为 publishing 类型为 `PublishingExtension` 的扩展下。

1. generatePomFileFor`PubName`Publication <br> 为名为 `PubName` 的发布创建一个 POM 文件，填充已知元数据，如项目名称、项目版本和依赖项。生成的 POM 文件默认放在 `build/publications/$pubName/pom-default.xml`.
2. publish`PubName`PublicationTo`RepoName`Repository <br> 将名为 `PubName` 的发布发布到名为 `RepoName` 的存储库中。如果您有一个没有显式名称的存储库定义，那么 RepoName 将是 Maven。
3. publish`PubName`PublicationToMavenLocal

将 `PubName` 发布复制到 mavenLocal 缓存—通常是 `$USER_HOME/.m2/repository`——连同发布的 POM 文件和其他元数据一起。

4. publish

依赖：所有 publishPubNamePublicationToRepoNameRepository 任务。将所有已定义的发布发布到所有已定义存储库的聚合任务。它不包括将发布复制到 mavenLocal

5. publishToMavenLocal

依赖：所有 publishPubNamePublicationToMavenLocal 任务。将所有已定义的发布复制 mavenLocal 存，包括它们的元数据 (POM 文件等)。

#### Publications

Maven 发布中的配置主要有四种：

1. A component <br>通过 `MavenPublication.from(org.gradle.api.component.SoftwareComponent)` 配置
2. Custom artifacts <br>通过 `MavenPublication.artifact(java.lang.Object)` 方法配置。查看 MavenArtifact 获取所有可配置选项。
3. Standard metadata <br>标准元数据，例如 artifactId, groupId and version.
4. Other contents of the POM file <br>通过 MavenPublication.pom(org.gradle.api.Action) 配置

groovy:

```groovy
// build.gradle
publishing {
    publications {
        maven(MavenPublication) {
            groupId = 'org.gradle.sample'
            artifactId = 'library'
            version = '1.1'

            from components.java
        }
    }
}
```

kotlin:

```kotlin
// build.gradle.kts
publishing {
    publications {
        create<MavenPublication>("maven") {
            groupId = "org.gradle.sample"
            artifactId = "library"
            version = "1.1"

            from(components["java"])
        }
    }
}
```

#### Repositories

```
publishing {
    repositories {
        maven {
            // 基于版本名称选择不同的仓库地址
            def releasesRepoUrl = "$buildDir/repos/releases"
            def snapshotsRepoUrl = "$buildDir/repos/snapshots"
            // url是必须要配置的
            url = version.endsWith('SNAPSHOT') ? snapshotsRepoUrl : releasesRepoUrl
            // 仓库用户名密码
            credentials {
                username = "root"
                password = "root"
            }
        }
    }
}
```

#### POM

pom 文件定于了一个 maven 项目的 maven 配置，一般 pom 文件的放在项目或者模块的根目录下<br>maven：pom 文件详解<br><https://blog.csdn.net/weixin_38569499/article/details/91456988>

### maven-plugin 插件 pom 文件生成

#### Android Library

Android 插件所创建的组件取决于模块是否使用应用或库插件，如下表所述。

| Android Gradle 插件       | 发布内容工件                           | 组件名称                   |
| ----------------------- | -------------------------------- | ---------------------- |
| com.android.library     | AAR                              | components.variant     |
| com.android.application | APK 和可用的 ProGuard 或 R8 映射文件的 ZIP | components.variant_apk |
| com.android.application | Android App Bundle (AAB)         | components.variant_aab |

```groovy
afterEvaluate {
    publishing {
        publications {
            // Creates a Maven publication called "release".
            release(MavenPublication) {
                // Applies the component for the release build variant.
                from components.release

                // You can then customize attributes of the publication as shown below.
                groupId = 'me.hacket'
                artifactId = 'pagergridlayoutmanager'
                version = '1.0.0'
            }
        }
    }
}
```

或者 pom.withXml

```groovy
private def getArtifactFilePath(Project p) {
    def isJavaPlugin = p.plugins.hasPlugin("java")
    def isAndroidLibPlugin = p.plugins.hasPlugin('com.android.library')
    def artifactFilePath = ""
    if (isAndroidLibPlugin) {
        if (isReleaseBuild()) {
            artifactFilePath = "${p.buildDir}/outputs/aar/${project.name}-release.aar"
        } else {
            artifactFilePath = "${p.buildDir}/outputs/aar/${project.name}-debug.aar"
        }
    } else {
        if (isReleaseBuild()) {
            artifactFilePath = "${p.buildDir}/libs/${project.name}.jar"
        } else {
            artifactFilePath = "${p.buildDir}/libs/${project.name}.jar"
        }
    }
//    println("=========== afterEvaluate ${p.name} isJavaPlugin=$isJavaPlugin, isAndroidLibPlugin=$isAndroidLibPlugin, artifactFilePath=$artifactFilePath")
    return artifactFilePath
}
project.afterEvaluate {
    Project p = it
    publishing {
        publications {
            "${getPublicationName()}"(MavenPublication) {
                groupId Config.groupId // com.company.project
                artifactId p.name // my-component-library
                version Config.versionName // 1.0.0-SNAPSHOT
                artifact getArtifactFilePath(p)

                println("=========== afterEvaluate -> publishing -> publications ${p.name} groupId=${Config.groupId} , artifactId=${p.name}, version=${Config.versionName}, artifact=${getArtifactFilePath(p)}")

//                // To include project dependencies
                try {
//                    pom.withXml {
//                        def dependencies = asNode().appendNode('dependencies')
//                        println("=========== afterEvaluate ${p.name} dependencies=$dependencies")
//                        configurations.getByName("${getPublicationName()}CompileClasspath").getResolvedConfiguration().getFirstLevelModuleDependencies().each {
//                            def dependency = dependencies.appendNode('dependency')
//                            dependency.appendNode('groupId', it.moduleGroup)
//                            dependency.appendNode('artifactId', it.moduleName)
//                            dependency.appendNode('version', it.moduleVersion)
//                        }
//                    }
//                    或者
                    pom.withXml {
                        def dependenciesNode = asNode().appendNode('dependencies')
                        configurations.implementation.allDependencies.each {
                            // 避免出现空节点或 artifactId=unspecified 的节点
                            if (it.group != null && (it.name != null && "unspecified" != it.name) && it.version != null) {
                                println it.toString()
                                def dependencyNode = dependenciesNode.appendNode('dependency')
                                dependencyNode.appendNode('groupId', it.group)
                                dependencyNode.appendNode('artifactId', it.name)
                                dependencyNode.appendNode('version', it.version)
                                dependencyNode.appendNode('scope', 'implementation')
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace()
                    println("=========== afterEvaluate ${p.name} e=$e")
                }
            }
        }
        repositories {
            maven {
                name = "repo"
                url = "${rootDir}/repo"
            }
            maven {
                name = "GitLab"
                url "https://gitlab.com/api/v4/projects/${Config.gitLabProjectId}/packages/maven"
                credentials(HttpHeaderCredentials) {
                    name = "Private-Token"
                    value = Config.gitLabAccessToken
                }
                authentication {
                    header(HttpHeaderAuthentication)
                }
            }
        }
    }
}
```

#### Java 项目

```java
publications {
    Production(MavenPublication) {
        from components.java
        groupId = "me.ele"
        artifactId = "lancet-plugin"
        version = "1.0.0"
    }
}
```

components.java，会自动生成 pom.xml

## 案例

### 简洁版（不支持输出 source）

1. groovy 版本

```groovy
// build.gradle
plugins {
    id "java"
    id "maven-publish"
}
publishing {
    publications {
        release(MavenPublication) {
            from components.java
            groupId = "me.hacket"
            artifactId = "my-java-plugin2"
            version = "0.0.1"
        }
    }
    repositories {
        mavenLocal()
    }
} 
```

2. kts 版本

```groovy
// build.gradle.kts
plugins {
    java
    kotlin("jvm") // version "1.3.50"
    maven-publish
}
publishing {
    publications {
        create<MavenPublication>("release") {
            from(components["java"])
            groupId = "me.hacket"
            artifactId = "my-kt-plugin1"
            version = "0.0.1"
        }
    }
    repositories {
        mavenLocal()
    }
} 
```

### 完整例子

```groovy
apply plugin: 'maven-publish'

// 输出source
task generateSourcesJar(type: Jar) {
    from android.sourceSets.main.java.srcDirs
    getArchiveClassifier().set('sources')
}

def versionName = "2.7.0-SNAPSHOT"

publishing {
    publications {
        Production(MavenPublication) {
            // 使用方引用 implementation 'cn.com.jack:mavendemo:2.7.0-SNAPSHOT'
            groupId = "cn.com.jack"
            artifactId = "mavendemo"
            version = versionName
            // 依赖 bundleReleaseAar 任务，并上传其产出的aar
            afterEvaluate { artifact(tasks.getByName("bundleReleaseAar")) }
            // 也可以指定上传的AAR包，但是需要先手动生成aar
            // artifact("$buildDir/outputs/aar/${project.getName()}-debug.aar")            
            // 上传source，这样使用放可以看到方法注释
            artifact generateSourcesJar
            // pom文件中声明依赖，从而传递到使用方
            pom.withXml {
                def dependenciesNode = asNode().appendNode('dependencies')
                configurations.implementation.allDependencies.each {
                    // 避免出现空节点或 artifactId=unspecified 的节点
                    if (it.group != null && (it.name != null && "unspecified" != it.name) && it.version != null) {
                        println it.toString()
                        def dependencyNode = dependenciesNode.appendNode('dependency')
                        dependencyNode.appendNode('groupId', it.group)
                        dependencyNode.appendNode('artifactId', it.name)
                        dependencyNode.appendNode('version', it.version)
                        dependencyNode.appendNode('scope', 'implementation')
                    }
                }
            }
        }
    }
    repositories {
        // 定义一个 maven 仓库
        maven {
            // 可以有且仅有一个仓库不指定 name 属性，会隐式设置为 Maven
            // 根据 versionName 来判断仓库地址
            url = versionName.endsWith('SNAPSHOT') ? SNAPSHOT_REPOSITORY_URL : RELEASE_REPOSITORY_URL
            // 仓库用户名密码
            credentials {
                username = "shine"
                password = "shine"
            }
        }
        // 定义第二个 maven 仓库，名为 Nexus
        maven {
            // 必须显示指定 name
            name = "nexus"
            url = versionName.endsWith('SNAPSHOT') ? SNAPSHOT_REPOSITORY_URL : RELEASE_REPOSITORY_URL
        }
    }
}
```

案例 2：

```
 打包源码
task generateSourcesJar(type: Jar) {
    from android.sourceSets.main.java.srcDirs
    getArchiveClassifier().set('sources')
//    classifier 'sources'
}
apply plugin: 'maven-publish'
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                from components.release

                // 指定group/artifact/version信息，可以不填。默认使用项目group/name/version作为groupId/artifactId/version
                groupId = Config.Maven.groupId
                artifactId = "${project.name.toLowerCase()}"
                version = Config.moduleVersion[project.name.toLowerCase()]
                // 配置上传源码
                // 上传source，这样使用方可以看到方法注释
                artifact generateSourcesJar
            }
        }
        repositories {
//        mavenLocal()
            maven {
                url = "${rootDir}/repo"
            }
//            credentials {
//                username 'xxx'
//                password 'xxx'
//            }
        }
    }
}
```

### 发布三方 aar 到 maven repo

当 module 作为 sdk 同时又依赖 aar 时，此时接入 sdk 会报错，提示引用不到 aar 中的类

解决 1：直接把 aar 给到业务测，业务测直接依赖<br>解决 2：将三方 aar 也发布到 maven 仓库，当作远端依赖来依赖

1. 去除要发布的 moduleA 的本地 aar 依赖（如 api fileTree(dir: "libs", include: ["_.jar", "_.aar"])），不然执行 gradle task publishShanYanSdkPublicationToMavenRepository 会编译出错
2. 定义 maven-publish 的配置
3. 通过 gradle task publishShanYanSdkPublicationToMavenRepository 就其发布到本地 repo
4. 和 remote 方式一样依赖这个 aar

```groovy
apply plugin: 'maven-publish'

publishing {
    publications {
        // gradlew publishMicroTTSPublicationToMavenRepository
        // implementation 'com.microsoft.cognitiveservices.speech:sdk:1.23.0'
        microTTS(MavenPublication) {
            artifact("./libs/client-sdk-embedded-static-1.23.0-beta.0.29448579.aar") {
                groupId 'com.microsoft.cognitiveservices.speech'
                artifactId 'sdk'
                version '1.23.0'
            }
        }
        // 地平线
        // gradlew publishAntaresManagerPublicationToMavenRepository
        // implementation 'com.horizon.antares:sdk:1.1.0'
        antaresManager(MavenPublication) {
            artifact("./libs/antares_manager.aar") {
                groupId 'com.horizon.antares'
                artifactId 'sdk'
                version '1.0.0'
            }
        }
    }
    repositories {
        maven {
            url "${rootDir}/repo"
        }
    }
}
```

## AGP3.6.0+ 更简便方式获取 components

Android Gradle 插件 3.6.0 及更高版本（说的是这里 `classpath 'com.android.tools.build:gradle:3.6.0'`）支持 Maven Publish Gradle 插件，可让您将构建工件发布到 Apache Maven 代码库。Android Gradle 插件会为应用或库模块中的每个构建变体工件创建一个组件，您可以使用它来自定义要发布到 Maven 代码库的发布内容。<br>Android 插件所创建的组件取决于模块是否使用应用或库插件，如下表所述。

| Android Gradle 插件       | 发布内容工件                           | 组件名称                   |
| ----------------------- | -------------------------------- | ---------------------- |
| com.android.library     | AAR                              | components.variant     |
| com.android.application | APK 和可用的 ProGuard 或 R8 映射文件的 ZIP | components.variant_apk |
| com.android.application | Android App Bundle (AAB)         | components.variant_aab |

1. library，release 就是 `components.release`，debug 就是 `components.debug`
2. application，release 就是 `components.release_apk`，debug 就是 `components.debug_apk`

```java
apply plugin: "maven-publish"
afterEvaluate {
    publishing {
        publications {
            Production(MavenPublication) {
                from components.release_apk 
                groupId = "me.hacket"
                artifactId = "my-android-plugin3"
                version = "1.0.0"
            }
        }
        repositories {
            mavenLocal()
        }
    }
}
```

### 获取 module 中已有的 components

```groovy
task printComponents(group: 'tools', description: project.name) {
    doLast {
        println("Components: " + components*.name)
    }
}
```

执行 `gradlew printComponents`<br>输出：Components: [all, debug, release]

### 多 productFlavor 情况

## 自定义 maven-publish 插件

使用：

```groovy
apply plugin: 'qb-maven-publish'
publishConfig {
    isEnable = true
    groupId = "me.hacket"
    artifactId = "core"
    version = "1.0.0"
}
```

源码：

```groovy
class PublishMavenPlugin implements Plugin<Project> {
    @Override
    void apply(Project project) {
        // 是否有com.android.library插件
        if (!project.plugins.hasPlugin("com.android.library")) {
            throw new RuntimeException("Plugin(qb-maven-publish) requires the 'com.android.library' plugin to be configured.", null)
        }
        project.extensions.create("publishConfig", PublishConfig)
        project.afterEvaluate {
            def myConfig = project.extensions.getByType(PublishConfig)
            println("Plugin(qb-maven-publish) publishConfig extensions: " + myConfig)

            if (!myConfig.isEnable) {
                println("Plugin(qb-maven-publish) isEnable=false!")
                return
            }

            project.plugins.apply MavenPublishPlugin
            PublishingExtension mavenPublishingExt = project.extensions.getByType(PublishingExtension)

            for (SoftwareComponent components : project.components) {
                mavenPublishingExt.publications({ publications ->
                    publications.create(components.name, MavenPublication.class, { MavenPublication pub ->
                        pub.groupId = myConfig.getGroupId()
                        pub.artifactId = myConfig.getArtifactId(project)
                        pub.version = myConfig.version
                        pub.from(components)


                        def generateSourcesJarTask = project.tasks.create("generateSourcesJarMaven${components.name.capitalize()}", GenerateSourcesJarTask)

                        pub.artifact(generateSourcesJarTask)

                        pub.pom {
                            mavenPom -> configPom(mavenPom, myConfig)
                        }
                    })
                })
            }
            mavenPublishingExt.repositories { artifactRepositories ->
                artifactRepositories.maven { mavenArtifactRepository ->

                    mavenArtifactRepository.url = myConfig.getRepoUrl(project)

                    if (myConfig.isNeedLogin()) {
                        mavenArtifactRepository.credentials {
                            credentials ->
                                credentials.username = myConfig.repoName
                                credentials.password = myConfig.repoPassword
                        }
                    }
                }
            }
        }
    }

    private static void configPom(MavenPom mavenPom, PublishConfig config) {
        mavenPom.name = config.pomName
        mavenPom.description = config.pomDescription
        mavenPom.url = config.pomUrl
    }
}
```

具体代码见大圣助手 `maven_publish_qb`module

## 遇到的问题

### 1、找不到插件类

```
What went wrong:
An exception occurred applying plugin request [id: 'appinit-auto-register']
> Could not find implementation class 'me.hacket.appinit.autoregister.AppInitAutoRegisterPlugin' for plugin 'appinit-auto-register' specified in jar:file:/C:/Users/hacket/.gradle/caches/jars-9/a6583eb47811da0aaaa4984b4cc74a47/appinit-1.0.0.jar!/META-INF/gradle-plugins/appinit-auto-register.properties.
```

**现象：** 生成的 jar 中没有 classes<br>![](https://note.youdao.com/yws/res/103922/WEBRESOURCEbba0f95028fd7fe131e4ec8478bcb200#id=oc9Ui&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691503935722-e4fc7315-059a-4598-b814-298bece4e387.png#averageHue=%23f1f1f1&clientId=ub26d7ec9-355f-4&from=paste&height=89&id=u56cd4a91&originHeight=177&originWidth=918&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46036&status=done&style=none&taskId=u9c04cf19-a876-4aca-ac7f-0ba010ed9f5&title=&width=459)<br>**原因：**<br>在 java 的 sourcesets 写了 groovy 代码，导致没有 classes 生成，具体看 build/classes 有没有生成文件<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691503970285-c27a54ef-2296-4da0-a8e3-af6f792325a5.png#averageHue=%2381af91&clientId=ub26d7ec9-355f-4&from=paste&height=374&id=ub43fce17&originHeight=748&originWidth=651&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44804&status=done&style=none&taskId=ue3410a22-74ca-47db-8bab-572d2763c42&title=&width=325.5)<br>**解决：**<br>将 groovy 代码移动到 groovy 的 sourcesets 目录下

### 2、找不到 AppExtension

```
An exception occurred applying plugin request [id: 'appinit-auto-register']
> Failed to apply plugin 'appinit-auto-register'.
   > No such property: AppExtension for class: me.hacket.appinit.autoregister.AppInitAutoRegisterPlugin
```

**原因：**<br>复制过来的代码，没有自动导包 AppExtension

### 3、Could not get unknown property 'release' for SoftwareComponentInternal

```
A problem occurred evaluating project ':Modularization2'.
> Could not get unknown property 'release' for SoftwareComponentInternal set of type org.gradle.api.internal.component.DefaultSoftwareComponentContainer.
```

解决：需要将插件配置写在 `afterEvaluate` 里面：

```groovy
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                from components.release
                groupId = "me.hacket"
                artifactId = "${project.name}"
                version = "1.0.0"
            }
        }
        repositories {
            maven {
                url = "${rootDir}/repo"
            }
        }
    }
}
```

## gradle-maven-publish-plugin：三方 maven-publish 增强插件

<https://github.com/vanniktech/gradle-maven-publish-plugin>

# MavenCentral 发布流程

## 准备 maven 仓库

### 注册 maven 账号

<https://issues.sonatype.org/secure/Dashboard.jspa>

### 创建 Project

如 AppInit<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691504138829-c84faaf8-12e6-48d8-a502-483e1dff824f.png#averageHue=%23fefefe&clientId=ub26d7ec9-355f-4&from=paste&height=614&id=u2ee65cf4&originHeight=1228&originWidth=1190&originalType=binary&ratio=2&rotation=0&showTitle=false&size=135667&status=done&style=none&taskId=u8cd095ef-08fd-4819-a894-e4781e136b6&title=&width=595)<br>过几分钟在 `Projects`→`Community Support - Open Source Project Repository Hosting` 下，选择 Switch filter，Reported by me<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691504157034-c1493021-4e0f-4c15-b1dd-94c53b4d3a9d.png#averageHue=%23fefdfd&clientId=ub26d7ec9-355f-4&from=paste&height=360&id=u2da88247&originHeight=719&originWidth=1262&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140549&status=done&style=none&taskId=u5e445c6d-78e6-4561-a34c-8058685fb45&title=&width=631)<br>[OSSRH-86107 AppInit](https://issues.sonatype.org/projects/OSSRH/issues/OSSRH-86107?filter=reportedbyme)

- 证明自己的域名或者在 github 创建公开的仓库 [OSSRH-86107](https://github.com/hacket/OSSRH-86107)
- 将状态更改为 OPEN
- 过一会状态改为 RESOLVED 就可以用了

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691504174497-da5e05fc-ed99-4f79-a89f-ef7d5c311d27.png#averageHue=%23e8ecf2&clientId=ub26d7ec9-355f-4&from=paste&height=362&id=ub84ad930&originHeight=724&originWidth=1051&originalType=binary&ratio=2&rotation=0&showTitle=false&size=165800&status=done&style=none&taskId=u16e30762-520b-4ce4-bba5-15fe68b84f1&title=&width=525.5)

### 登录 maven

maven 登录地址：<https://s01.oss.sonatype.org/><br>账号密码：hacket/*#Zfs

## 配置 GPG

具体见 `Git ssh key和deploy-keys（GPG）.md`

核心信息：

```
pub   rsa3072 2022-11-13 [SC] [expires: 2024-11-12]
      76EE3442B366C8120B552703890A6B2749FAA5EA
uid   hacket <shengfanzeng@gmail.com>
sub   rsa3072 2022-11-13 [E] [expires: 2024-11-12]
```

配置上传 maven：

```
# maven账号密码
mavenCentralUsername=hacket
mavenCentralPassword=zfs1314520

# GPG keyId、密码和gpg文件
signing.keyId=49FAA5EA
signing.password=zfs1314520
signing.secretKeyRingFile=/Users/hacket/.gnupg/secring.gpg
```

## maven 上传插件 gradle-maven-publish-plugin

<https://github.com/vanniktech/gradle-maven-publish-plugin><br>docs: <https://vanniktech.github.io/gradle-maven-publish-plugin/central/><br>参考用法见：<https://github.com/cashapp/turbine>

### 引入插件

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'org.jetbrains.dokka:dokka-gradle-plugin:1.7.20'
        classpath 'com.vanniktech:gradle-maven-publish-plugin:0.14.2'
    }
}
```

```groovy
plugins {
    // ... 
    id 'org.jetbrains.dokka' // 低版本需要
    id 'com.vanniktech.maven.publish'
}
```

### Secrets（配置 Maven 账号密码和 GPG key 和密码）

在 `~/.gradle/gradle.properties`<br>将 secret.gpg 复制到~/.gradle/gradle.properties 目录下去

```
# GPG
signing.keyId=00581DF6
signing.password=zfs1314520
signing.secretKeyRingFile=secret.gpg

## nexus账号信息，也就是创建issue时的账号和密码
mavenCentralUsername=hacket
mavenCentralPassword=*#Zfs1314520
### 有的是这个？
ossrhUsername=hacket
ossrhPassword=*#Zfs1314520
```

### 配置 group,version 和 artifactId(默认 project.name)

```
SONATYPE_HOST=DEFAULT
## or when publishing to https://s01.oss.sonatype.org
#SONATYPE_HOST=S01

RELEASE_SIGNING_ENABLED=true

POM_NAME=AppInit
POM_DESCRIPTION=A small library for Android startup init task.
POM_INCEPTION_YEAR=2021

POM_URL=https://github.com/hacket/AppInit
POM_SCM_URL=https://github.com/hacket/AppInit
POM_SCM_CONNECTION=scm:git:git://github.com/hacket/AppInit
POM_SCM_DEV_CONNECTION=scm:git:git://github.com/hacket/AppInit

POM_LICENCE_NAME=The Apache Software License, Version 2.0
POM_LICENCE_URL=https://www.apache.org/licenses/LICENSE-2.0.txt
POM_LICENCE_DIST=repo

POM_DEVELOPER_ID=hacket
POM_DEVELOPER_NAME=hacket
POM_DEVELOPER_URL=https://github.com/hacket/
```

在每个单独的 module 配置 group 和 version

```
group = 'io.github.hacket'
version = '1.0.0'
```

### 发布

```
./gradlew publishAllPublicationsToMavenCentral
```

或 publish task

### 发布 library

<https://s01.oss.sonatype.org/>![](https://note.youdao.com/yws/res/104064/WEBRESOURCEe21abe78bb3c0b75b7f96c738e9aa84e#id=EmsAf&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1. 在左侧面板 Staging Repositories
2. 选中要发布的 Repository
3. 点击 Release，会弹窗进行二次 Confirm
4. 确认无误后，发布

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691504249020-b61696a0-9038-45f3-a59f-14274183e911.png#averageHue=%23d3d2d1&clientId=ub26d7ec9-355f-4&from=paste&height=404&id=u182f16e8&originHeight=807&originWidth=1531&originalType=binary&ratio=2&rotation=0&showTitle=false&size=185104&status=done&style=none&taskId=u5589d01d-b71f-4b44-a247-82ebe117924&title=&width=765.5)

### 搜索

搜索你刚刚发布的 library<br><https://s01.oss.sonatype.org/#welcome>

### 遇到的问题

#### Cannot get stagingProfiles for account

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691504645419-42f983f5-fd7b-426d-9e17-9f66519011af.png#averageHue=%23332d2d&clientId=ub26d7ec9-355f-4&from=paste&height=106&id=uca19bed4&originHeight=212&originWidth=1147&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38273&status=done&style=none&taskId=ucb372ae3-d46f-4add-a358-61d76c8fc3a&title=&width=573.5)<br>原因：大概率是账号 hacket 的密码不对

#### secret.gpg 找不到

报错：

```
Execution failed for task ':appInit-api:signMavenPublication'.
> Error while evaluating property 'signatory' of task ':appInit-api:signMavenPublication'
   > Unable to retrieve secret key from key ring file 'F:\Workspace\AppInit\appInit-api\C:Usershacket.gradlesecret.gpg' as it does not exist
```

解决：windows 系统下 secretKeyRingFile 用/而不是\

```
# GPG
signing.keyId=00581DF6
signing.password=zfs1314520
signing.secretKeyRingFile=C:/Users/hacket/.gradle/secret.gpg
```

#### plugins 引入找不到插件

```groovy
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'appinit-auto-register' version '1.0.0' apply false
}
```

报错：

```
* Exception is:
org.gradle.api.plugins.UnknownPluginException: Plugin [id: 'appinit-auto-register', version: '1.0.0', apply: false] was not found in any of the following sources:
```

解决：在根 build.gradle 中

```groovy
buildscript {
    dependencies {
        classpath "io.github.hacket:appinit-auto-register:1.0.0"
    }
}
```

## Ref

- [x] MavenCentral 发布流程<br><https://juejin.cn/post/7023219116534136840>

# GitHub Packages

## 什么是 GitHub Packages？

GitHub Package Registry 是一个包托管服务，类似 npm、gem、docker 之类的，允许开发者在上面托管包和代码，当然可以是私有的或公开的，并将它们用作项目中的依赖<br>GitHub Packages 不支持像 jcenter、jitpack 那样的匿名下载

## 步骤

### 添加项目的 token

个人账号 `Settings`→ `Developer settings`→`Personal access tokens`→后续操作：

1. Note：填写 Token 名字
2. Expiration：选择有效期
3. Select scopes：`repo/write:packages/delete:packages`
4. Generate token

### 将 user 和 token 配置到 gradle.properties

```shell
#------ Github name&ntoken ------
gpr.user=hacket
gpr.key=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
#------ Github name&token ------
```

### 添加 maven-publish 脚本

```groovy
apply plugin: 'maven-publish'
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                from components.release
                groupId = Config.Maven.groupId
                artifactId = "${project.name}"
                version = Config.moduleVersion[project.name]
            }
        }
        repositories {
            maven {
                name = "HacketGitHubPackages"
                url = "https://maven.pkg.github.com/hacket/Maven"
                credentials {
                    username = project.findProperty("gpr.user")
                    password = project.findProperty("gpr.key")
                }
            }
        }
    }
}
```

### 发布脚本

```shell
#!/bin/bash
CUR_DIR=$(cd `dirname $0` && pwd -P)
echo 'relocation to project root dir'

module=('libcommon' 'libwidget' 'core')
echo ${module[@]}
for m in ${module[@]}
do
  sed -i "" "/$m/s/false/true/g" gradle.properties
  sed -n "/^$m.*/p" gradle.properties
  ./gradlew :$m:publishReleasePublicationToHacketGitHubPackagesRepository
  sed -i "" "/$m/s/true/false/g" gradle.properties
  sed -n "/^$m.*/p" gradle.properties
done
```

## Ref

- [ ] Working with the Gradle registry<br><https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-gradle-registry>
- [x] 把 Android Module 的 aar 包发布到 GitHub Packages<br>[https://apqx.me/post/original/2020/12/04/把Android-Module的aar包发布到GitHub-Packages上.html](https://apqx.me/post/original/2020/12/04/%E6%8A%8AAndroid-Module%E7%9A%84aar%E5%8C%85%E5%8F%91%E5%B8%83%E5%88%B0GitHub-Packages%E4%B8%8A.html)
- [x] gradle 发布 jar 到 GitHub Packages<br><https://juejin.cn/post/7007289428158709797>

# GitLab Packages

## 步骤

1. Preference→Access Tokens→Private Access Tokens

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700813875347-09d59415-96af-487d-b8f1-b1b5e783bc9d.png#averageHue=%23f7f6f8&clientId=uc2f9aecd-f07b-4&from=paste&height=290&id=uec9a2e81&originHeight=580&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=124573&status=done&style=none&taskId=u7280094d-cbc5-48c7-a874-eb993cd7c83&title=&width=1280)

2. maven-publish 脚本

```groovy
apply plugin: 'maven-publish'

static def isReleaseBuild() {
    return true
}

// gitlab
class Config {
    static groupId = "me.hacket"
    static versionName = "1.0.0"
    static gitLabAccessToken = "glpat-3sQGymTv9LVwyWE29CrN"
    static gitLabProjectId = "52451437"
}

def getOutputDir() {
    if (isReleaseBuild()) {
        return "${project.buildDir}/releases"
    } else {
        return "${project.buildDir}/snapshots"
    }
}

private def getArtifactFilePath(Project p) {
    def isJavaPlugin = p.plugins.hasPlugin("java")
    def isAndroidLibPlugin = p.plugins.hasPlugin('com.android.library')
    def artifactFilePath = ""
    if (isAndroidLibPlugin) {
        if (isReleaseBuild()) {
            artifactFilePath = "${p.buildDir}/outputs/aar/${project.name}-release.aar"
        } else {
            artifactFilePath = "${p.buildDir}/outputs/aar/${project.name}-debug.aar"
        }
    } else {
        if (isReleaseBuild()) {
            artifactFilePath = "${p.buildDir}/libs/${project.name}.jar"
        } else {
            artifactFilePath = "${p.buildDir}/libs/${project.name}.jar"
        }
    }
//    println("=========== afterEvaluate ${p.name} isJavaPlugin=$isJavaPlugin, isAndroidLibPlugin=$isAndroidLibPlugin, artifactFilePath=$artifactFilePath")
    return artifactFilePath
}

static def getPublicationName() {
    if (isReleaseBuild()) {
        return "release"
    } else {
        return "debug"
    }
}

project.afterEvaluate {
    Project p = it
    publishing {
        publications {
            "${getPublicationName()}"(MavenPublication) {
                groupId Config.groupId // com.company.project
                artifactId p.name // my-component-library
                version Config.versionName // 1.0.0-SNAPSHOT
                artifact getArtifactFilePath(p)

                println("=========== afterEvaluate -> publishing -> publications ${p.name} groupId=${Config.groupId} , artifactId=${p.name}, version=${Config.versionName}, artifact=${getArtifactFilePath(p)}")

//                // To include project dependencies
                try {
//                    pom.withXml {
//                        def dependencies = asNode().appendNode('dependencies')
//                        println("=========== afterEvaluate ${p.name} dependencies=$dependencies")
//                        configurations.getByName("${getPublicationName()}CompileClasspath").getResolvedConfiguration().getFirstLevelModuleDependencies().each {
//                            def dependency = dependencies.appendNode('dependency')
//                            dependency.appendNode('groupId', it.moduleGroup)
//                            dependency.appendNode('artifactId', it.moduleName)
//                            dependency.appendNode('version', it.moduleVersion)
//                        }
//                    }
//                    或者
                    pom.withXml {
                        def dependenciesNode = asNode().appendNode('dependencies')
                        configurations.implementation.allDependencies.each {
                            // 避免出现空节点或 artifactId=unspecified 的节点
                            if (it.group != null && (it.name != null && "unspecified" != it.name) && it.version != null) {
                                println it.toString()
                                def dependencyNode = dependenciesNode.appendNode('dependency')
                                dependencyNode.appendNode('groupId', it.group)
                                dependencyNode.appendNode('artifactId', it.name)
                                dependencyNode.appendNode('version', it.version)
                                dependencyNode.appendNode('scope', 'implementation')
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace()
                    println("=========== afterEvaluate ${p.name} e=$e")
                }
            }
        }
        repositories {
            maven {
                name = "repo"
                url = "${rootDir}/repo"
            }
            maven {
                name = "GitLab"
                url "https://gitlab.com/api/v4/projects/${Config.gitLabProjectId}/packages/maven"
                credentials(HttpHeaderCredentials) {
                    name = "Private-Token"
                    value = Config.gitLabAccessToken
                }
                authentication {
                    header(HttpHeaderAuthentication)
                }
            }
            maven {
                name = "HacketGitHubPackages"
                url = "https://maven.pkg.github.com/hacket/Maven"
                credentials {
                    username = project.findProperty("gpr.user")
                    password = project.findProperty("gpr.key")
                }
            }
        }
    }
}
```

3. gradlew publish
4. 查看 gitlab packages

<https://gitlab.com/hacket/debugtools/-/packages><br><https://github.com/hacket?tab=packages&repo_name=Maven>

## Ref

- [x] [Creating a Private Maven Repository for Android Libraries on GitLab](https://proandroiddev.com/creating-a-private-maven-repository-for-android-libraries-on-gitlab-91137c402777)

# Nexus 搭建私有仓库

## 安装 Nexus

1. 下载免费版<br><https://www.sonatype.com/nexus-repository-oss>
2. 解压<br>用 `tar zxvf nexus-3.13.0-01-mac.tgz` 解压
3. 启动<br>找到 `nexus-xxx/bin` 目录

用 `nexus start` 启动

4. 浏览器打开<br>`http://127.0.0.1:8081/`

## 配置 Nexus

用默认账号登录 admin/admin123<br>然后新增一个用户<br><http://127.0.0.1:8081/repository/AndroidCoreLib/>

## 遇到的问题

如果用的 mac 自带解压工具，可能启动不了，会出现启动报错，用 `nexus run` 查看报错原因：

```
Could not resolve mvn:org.apache.felix/org.apache.felix.framework/5.6.2
```

解决，由于解压方式不对，要用 tar 命令：

```
tar zxvf nexus-3.13.0-01-mac.tgz
```

# 发布到 localMaven

- 定义 `maven_local_publish.gradle`

```groovy
apply plugin: 'maven'
apply from: "$rootDir/config/gradle/config.gradle"
uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: uri(project.POM_REPOSITORY_REPO))
            pom.groupId = project.POM_GROUP_ID
            pom.version = project.POM_VERSION_NAME
        }
    }
}
```

- gradle.properties 定义相关信息

```
#需要发布到localMaven的时候才设置为true，开发false
publishToLocalMaven=false
POM_GROUP_ID=qsbk.app.voice
POM_VERSION_NAME=0.5.0
POM_REPOSITORY_REPO=/Users/zengfansheng/maven/chatroom
```

- 本地 localMaven 引入

```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.1.0'
    }
}

allprojects {
    repositories {
        jcenter()

        maven {
            url 'file:///Users/zengfansheng/maven/chatroom'
        }
    }
}
```

- 发布 Android studio 项目到本地 Maven 仓库<br><https://juejin.im/entry/583edfafa22b9d006c25bfaa>
