---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, January 22nd 2025, 12:02:17 am
title: Firebase Crashlytics
author: hacket
categories:
  - Android
category: Firebase
tags: [Firebase]
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
date created: 2024-12-24 00:33
date updated: 2024-12-24 00:33
aliases: [Firebase Crashlytics]
linter-yaml-title-alias: Firebase Crashlytics
---

# Firebase Crashlytics

## Firebase 集成

### Firebase 集成步骤

1. 注册 Firebase 账号
2. 添加 Android 项目
3. 添加包名，获取证书签名 SHA-1

> keytool -list -v -alias hacket.alias -keystore hacket.keystore

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1679630094371-2d07527a-00c8-4e00-93b8-0494b1f8995a.png#averageHue=%23f8f7f7&clientId=u9b27e629-1e79-4&from=paste&height=446&id=u087f006a&originHeight=789&originWidth=881&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56113&status=done&style=none&taskId=u99c53aa7-87a7-43f1-835e-bc834da80d9&title=&width=498)

4. 下载 `google-services.json` 放到 app/根目录
5. 添加 Firebase SDK
   - root build.gradle <project>/build.gradle)

```groovy
buildscript {
  repositories {
    // Make sure that you have the following two repositories
    google()  // Google's Maven repository
    mavenCentral()  // Maven Central repository
  }
  dependencies {
    // Add the dependency for the Google services Gradle plugin
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
allprojects {
  repositories {
    // Make sure that you have the following two repositories
    google()  // Google's Maven repository
    mavenCentral()  // Maven Central repository
  }
}
```

- app build.gradle <project>/<app-module>/build.gradle

```groovy
plugins {
  id 'com.android.application'
  // Add the Google services Gradle plugin
  id 'com.google.gms.google-services'
}
dependencies {
  // Import the Firebase BoM
  implementation platform('com.google.firebase:firebase-bom:31.2.3')
  // TODO: Add the dependencies for Firebase products you want to use
  // When using the BoM, don't specify versions in Firebase dependencies
  implementation 'com.google.firebase:firebase-analytics-ktx'
  // Add the dependencies for any other desired Firebase products
  // https://firebase.google.com/docs/android/setup#available-libraries
}
```

6. 集成其他 Firebase 服务

## Firebase Crashlytics

## Firebase Performance Monitoring

<https://firebase.google.com/docs/perf-mon?authuser=0&hl=zh>

## 遇到的问题

### The Crashlytics build ID is missing

> Caused by: java.lang.IllegalStateException: The Crashlytics build ID is missing. This occurs when Crashlytics tooling is absent from your app's build configuration. Please review Crashlytics onboarding instructions and ensure you have a valid Crashlytics account.

检查一下 `google-service.json` 是否生成对了，是否用对了签名文件生成的

### Caused by: javax.net.ssl.SSLProtocolException: Connection reset by peer: socket write error

网络问题

```groovy
':Google:uploadCrashlyticsMappingFileRelease'.
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.lambda$executeIfValid$1(ExecuteActionsTaskExecuter.java:187)
	at org.gradle.internal.Try$Failure.ifSuccessfulOrElse(Try.java:268)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeIfValid(ExecuteActionsTaskExecuter.java:185)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:173)
	//...
    at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.run(DefaultPlanExecutor.java:124)
	at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
	at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:48)
	at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:56)
Caused by: org.gradle.api.UncheckedIOException: javax.net.ssl.SSLProtocolException: Connection reset

```

### 找不到符号

由于是 debug 包添加 bugly，release 包添加 Firebase<br />原因：debug 包的 getInstance() 没有添加 `@JvmStatic` 注解导致

```groovy
E:\Workspace\allo-android\allo_client\src\main\java\com\live\allo\XChatApplication.java:486: 错误: 找不到符号
        CrashPlatform.getInstance().init(this);
                     ^
  符号:   方法 getInstance()
  位置: 类 CrashPlatform
```

解决：debug 和 release 包的代码包名都必须一致。
