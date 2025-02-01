---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, January 29th 2025, 10:44:06 pm
title: Remote Config
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
date created: 2024-08-17 23:27
date updated: 2024-12-24 00:33
aliases: [Remote Config]
linter-yaml-title-alias: Remote Config
---

# Remote Config

- [ ] [Firebase Remote Config](https://firebase.google.com/docs/remote-config)

## 什么是 Remote Config？

Firebase 远程配置是指在 Firebase 后台存储一些键值对，在 app 中向 Firebase 请求并使用这些键值对。当我们需要更改这些键值对时，在 Firebase 后台更改即可。当 app 下一次向 Firebase 请求时，获取到的就是我们更改后的值。这样就实现了动态更新 app 配置。

## 集成 Remote Config

### [集成Firebase](https://firebase.google.com/docs/android/setup)

[**方式1：自动 Add Firebase using the Firebase Assistant**](https://firebase.google.com/docs/android/setup#assistant)<br>Tools > Firebase.<br>![40im8](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/40im8.png)<br>[**方式2：手动 Add Firebase using the Firebase console**](https://firebase.google.com/docs/android/setup#console)

1. 下载 `google-services.json` 到 app 根目录
2. root-level (project-level) 添加 gms Gradle 插件

```groovy
buildscript {

    repositories {
      // Make sure that you have the following two repositories
      google()  // Google's Maven repository
      mavenCentral()  // Maven Central repository
    }

    dependencies {
      ...

      // Add the dependency for the Google services Gradle plugin
      classpath 'com.google.gms:google-services:4.3.15'
    }
}
allprojects {
  ...
  repositories {
    // Make sure that you have the following two repositories
    google()  // Google's Maven repository
    mavenCentral()  // Maven Central repository
  }
}
```

3. module (app-level) 引入 GMS 插件

```groovy
plugins {
    id 'com.android.application'

    // Add the Google services Gradle plugin
    id 'com.google.gms.google-services'
    ...
}
```

4. 添加 sdk 到 module

```groovy
dependencies {
  // ...

  // Import the Firebase BoM
  implementation platform('com.google.firebase:firebase-bom:32.0.0')

  // When using the BoM, you don't specify versions in Firebase library dependencies

  // Add the dependency for the Firebase SDK for Google Analytics
  implementation 'com.google.firebase:firebase-analytics-ktx'

  // TODO: Add the dependencies for any other Firebase products you want to use
  // See https://firebase.google.com/docs/android/setup#available-libraries
  // For example, add the dependencies for Firebase Authentication and Cloud Firestore
  implementation 'com.google.firebase:firebase-auth-ktx'
  implementation 'com.google.firebase:firebase-firestore-ktx'
}
```

### [引入Remote Config SDK](https://firebase.google.com/docs/remote-config/get-started?platform=android#add-firebase)

```groovy
dependencies {
    // Import the BoM for the Firebase platform
    implementation platform('com.google.firebase:firebase-bom:32.0.0')

    // Add the dependencies for the Remote Config and Analytics libraries
    // When using the BoM, you don't specify versions in Firebase library dependencies
    implementation 'com.google.firebase:firebase-config-ktx'
    implementation 'com.google.firebase:firebase-analytics-ktx'
}
```

### [Get the Remote Config singleton object](https://firebase.google.com/docs/remote-config/get-started?platform=android#get-remote-config)

```kotlin
val remoteConfig: FirebaseRemoteConfig = Firebase.remoteConfig
val configSettings = remoteConfigSettings {
    minimumFetchIntervalInSeconds = 3600 // 最小获取间隔时间，默认12h
}
remoteConfig.setConfigSettingsAsync(configSettings)
```

### [Set in-app default parameter values](https://firebase.google.com/docs/remote-config/get-started?platform=android#in-app-parameter-values)

- xml 可参考 [remote_config_defaults.xml](https://github.com/firebase/quickstart-android/blob/master/config/app/src/main/res/xml/remote_config_defaults.xml)

```kotlin
<?xml version="1.0" encoding="utf-8"?>
<defaultsMap>
    <entry>
        <key>key_test_remote_config</key>
        <value>here is client default value</value>
    </entry>
    <entry>
        <key>has_discount</key>
        <value>false</value>
    </entry>
    <entry>
        <key>main_color</key>
        <value>red</value>
    </entry>
</defaultsMap>
```

- 代码配置

```kotlin
remoteConfig.setDefaultsAsync(R.xml.remote_config_defaults)
```

### Get parameter values to use in your app

- [getBoolean()](https://firebase.google.com/docs/reference/android/com/google/firebase/remoteconfig/FirebaseRemoteConfig#getBoolean(java.lang.String))
- [getDouble()](https://firebase.google.com/docs/reference/android/com/google/firebase/remoteconfig/FirebaseRemoteConfig#getDouble(java.lang.String))
- [getLong()](https://firebase.google.com/docs/reference/android/com/google/firebase/remoteconfig/FirebaseRemoteConfig#getLong(java.lang.String))
- [getString()](https://firebase.google.com/docs/reference/android/com/google/firebase/remoteconfig/FirebaseRemoteConfig#getString(java.lang.String))

### Firebase 后台配置值

![n59da](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/n59da.png)

- Parameter name 配置 key
- Data Type 配置类型
- Default value 配置 value
- User in-app default 配置的话，就会从 `remote_config_defaults.xml` 获取默认值，否则走的是 Default value

### Fetch and activate values

Firebase 拉取远程配置后，拉取的键值对默认在本地缓存 12 小时，12 小时后才去重新拉取。如果想要修改缓存时间，在 fetch 中添加时间参数即可，使用 firebaseRemoteConfig.fetch(0)，远程配置的值就会实时更新：

```kotlin
remoteConfig.fetchAndActivate()
    .addOnCompleteListener(this) { task ->
        if (task.isSuccessful) {
            val updated = task.result
            Log.d(TAG, "Config params updated: $updated")
            Toast.makeText(
                this,
                "Fetch and activate succeeded",
                Toast.LENGTH_SHORT,
            ).show()
        } else {
            Toast.makeText(
                this,
                "Fetch failed",
                Toast.LENGTH_SHORT,
            ).show()
        }
        displayWelcomeMessage()
    }
```

### 实时监听更新

```kotlin
remoteConfig.addOnConfigUpdateListener(object : ConfigUpdateListener {
    override fun onUpdate(configUpdate : ConfigUpdate) {
       Log.d(TAG, "Updated keys: " + configUpdate.updatedKeys);

       if (configUpdate.updatedKeys.contains("welcome_message")) {
           remoteConfig.activate().addOnCompleteListener {
               displayWelcomeMessage()
           }
       }
    }

    override fun onError(error : FirebaseRemoteConfigException) {
        Log.w(TAG, "Config update error with code: " + error.code, error)
    }
})
```

下次有新版本的 Remote Config 发布时，运行应用并监听更改的设备便会调用 ConfigUpdateListener。

### 默认值

1. Firebase Remote config 中没有配置的 key 的值，默认值
2. 有 key 但没取到，也是默认值
3. 不同类型的默认值

```java
/** The static default string value for any given key. */
public static final String DEFAULT_VALUE_FOR_STRING = "";
/** The static default long value for any given key. */
public static final long DEFAULT_VALUE_FOR_LONG = 0L;
/** The static default double value for any given key. */
public static final double DEFAULT_VALUE_FOR_DOUBLE = 0D;
/** The static default boolean value for any given key. */
public static final boolean DEFAULT_VALUE_FOR_BOOLEAN = false;
/** The static default byte array value for any given key. */
public static final byte[] DEFAULT_VALUE_FOR_BYTE_ARRAY = new byte[0];
```
