---
date created: 2024-08-17 23:27
date updated: 2024-12-24 00:33
dg-publish: true
---

- [ ] [Firebase Remote Config](https://firebase.google.com/docs/remote-config)

## 什么是Remote Config？

Firebase远程配置是指在Firebase后台存储一些键值对，在app中向Firebase请求并使用这些键值对。当我们需要更改这些键值对时，在Firebase后台更改即可。当app下一次向Firebase请求时，获取到的就是我们更改后的值。这样就实现了动态更新app配置。

## 集成Remote Config

### [集成Firebase ](https://firebase.google.com/docs/android/setup)

[**方式1：自动 Add Firebase using the Firebase Assistant**](https://firebase.google.com/docs/android/setup#assistant)<br>Tools > Firebase.<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684500533294-8641e97d-6b05-445a-a777-9c796937fbda.png#averageHue=%233f4144&clientId=ud986f970-0ddb-4&from=paste&height=386&id=u02b671f9&originHeight=1264&originWidth=1766&originalType=binary&ratio=2&rotation=0&showTitle=false&size=235748&status=done&style=none&taskId=u8bb44a59-dff3-4e28-ab12-7427c2450da&title=&width=539)<br>[**方式2：手动 Add Firebase using the Firebase console**](https://firebase.google.com/docs/android/setup#console)

1. 下载`google-services.json`到app根目录
2. root-level (project-level) 添加gms Gradle插件

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

3. module (app-level)引入GMS插件

```groovy
plugins {
    id 'com.android.application'

    // Add the Google services Gradle plugin
    id 'com.google.gms.google-services'
    ...
}
```

4. 添加sdk到module

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

- xml可参考[remote_config_defaults.xml](https://github.com/firebase/quickstart-android/blob/master/config/app/src/main/res/xml/remote_config_defaults.xml)

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

### Firebase后台配置值

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684495568154-9d0e7569-2305-470e-ae32-7a0262def21e.png#averageHue=%23d4d7ea&clientId=u7140af31-cf46-4&from=paste&height=370&id=ub19cb464&originHeight=1116&originWidth=1196&originalType=binary&ratio=2&rotation=0&showTitle=false&size=424451&status=done&style=none&taskId=uf4b502aa-7453-4cbc-97b7-de43e2b3c2b&title=&width=397)

- Parameter name 配置key
- Data Type 配置类型
- Default value配置value
- User in-app default 配置的话，就会从`remote_config_defaults.xml`获取默认值，否则走的是Default value

### Fetch and activate values

Firebase拉取远程配置后，拉取的键值对默认在本地缓存12小时，12小时后才去重新拉取。如果想要修改缓存时间，在fetch中添加时间参数即可，使用firebaseRemoteConfig.fetch(0)，远程配置的值就会实时更新：

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

1. Firebase Remote config中没有配置的key的值，默认值
2. 有key但没取到，也是默认值
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
