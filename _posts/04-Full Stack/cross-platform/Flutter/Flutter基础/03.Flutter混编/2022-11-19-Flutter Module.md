---
date_created: Tuesday, November 19th 2022, 11:27:19 pm
date_updated: Wednesday, January 22nd 2025, 11:05:27 pm
title: Flutter Module
author: hacket
categories:
  - 跨平台
category: Flutter
tags: [Flutter]
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
date created: 2024-12-26 00:24
date updated: 2024-12-26 00:24
aliases: [Flutter Module]
linter-yaml-title-alias: Flutter Module
---

# Flutter Module

## 命令创建 Flutter module

命令：`flutter create -t module flutter_module`<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1695660373698-9da100cf-5512-4197-968b-1f36dcf8e976.png#averageHue=%23080605&clientId=uce5d150e-d1e2-4&from=paste&height=166&id=ue126db46&originHeight=249&originWidth=880&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=21947&status=done&style=stroke&taskId=u6449da9e-e139-4d54-b19f-c75c696d143&title=&width=586.6666666666666)<br>目录结构：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1695660415602-d88cab71-6c94-4327-b42a-2ade4c2ac54c.png#averageHue=%233e444b&clientId=uce5d150e-d1e2-4&from=paste&height=330&id=u9ea1d66e&originHeight=672&originWidth=640&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=39949&status=done&style=stroke&taskId=u72473e11-efa0-4458-a816-4baef47ba6c&title=&width=314.66668701171875)

- flutter module 也是可以跑到手机上的
- flutter 中的 `.android` 和 `.ios` 是自动生成的，app 的是没有 `.` 的

# [add to android app（添加到已有Android App）](https://docs.flutter.dev/add-to-app)

集成 flutter module 到已有的 Android App 有两种方式：

1. Android AAR 依赖
2. 源码依赖

## [AAR方式引入](https://docs.flutter.dev/add-to-app/android/project-setup#option-a---depend-on-the-android-archive-aar)

1. 执行命令创建 flutter module：`flutter create -t module flutter_module`
2. 进入到 flutter_module 目录
3. 执行命令：`flutter build aar`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1695661545972-92e0fc32-33c6-41b1-b897-db7802ab4fbe.png#averageHue=%23646b6d&clientId=u3aff7655-b2c6-4&from=paste&height=640&id=u92069d82&originHeight=600&originWidth=513&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=249820&status=done&style=stroke&taskId=ucc91e5aa-0ff7-4ef4-952a-124fe536da2&title=&width=547)

4. 构建后的产物

```kotlin
build/host/outputs/repo
└── com
    └── example
        └── flutter_module
            ├── flutter_release
            │   ├── 1.0
            │   │   ├── flutter_release-1.0.aar
            │   │   ├── flutter_release-1.0.aar.md5
            │   │   ├── flutter_release-1.0.aar.sha1
            │   │   ├── flutter_release-1.0.pom
            │   │   ├── flutter_release-1.0.pom.md5
            │   │   └── flutter_release-1.0.pom.sha1
            │   ├── maven-metadata.xml
            │   ├── maven-metadata.xml.md5
            │   └── maven-metadata.xml.sha1
            ├── flutter_profile
            │   ├── ...
            └── flutter_debug
                └── ...
```

5. 集成到 App

flutter_module 是以 submodule 的方式集成到 App 中的

```groovy
// root build.gradle
allprojects {
	repositories {
        // Flutter maven
        String storageUrl = System.env.FLUTTER_STORAGE_BASE_URL ?: "https://storage.googleapis.com"
        maven {
            url "$rootDir/flutter/KingOfFlutter/flutter_module/build/host/outputs/repo"
        }
        maven {
            url "$storageUrl/download.flutter.io"
        }
    }
}

// app build.gradle
android {
    // ...
    buildTypes {
        profile {
        	initWith debug
        }
    }
}
dependencies {
  // ...
  debugImplementation 'com.example.flutter_module:flutter_debug:1.0'
  profileImplementation 'com.example.flutter_module:flutter_profile:1.0'
  releaseImplementation 'com.example.flutter_module:flutter_release:1.0'
}
```

> 注意：Important: If you're located in China, use a mirror site rather than the `storage.googleapis.com` domain. To learn more about mirror sites, check out [Using Flutter in China](https://docs.flutter.dev/community/china) page.

- Android Studio using the Build > Flutter > Build AAR menu.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1695661642811-0bef9441-f591-486e-a4f7-ee6ba2ba84d5.png#averageHue=%238a8f8e&clientId=u3aff7655-b2c6-4&from=paste&id=u3e2eedc3&originHeight=241&originWidth=718&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=149336&status=done&style=stroke&taskId=u92354e13-f97d-4dd0-b221-3580c39def1&title=)

## [依赖模块源码引入](https://docs.flutter.dev/add-to-app/android/project-setup#option-b---depend-on-the-modules-source-code)

### 确定 flutter 模块的位置

首先需要确认 Flutter-Module 依赖库文件夹的位置，简单来说，这里有两种方式：

- 创建在项目的根目录下（内部）；
- 创建和项目文件夹的同一层级（外部），这也是官方推荐的方式。

### 引入步骤

1. 命令：flutter create -t module flutter_module

> AS 创建 Flutter module, flutter_module，会自动添加依赖

2. 在 settings.gradle 中添加

```groovy
// Flutter集成到Android项目中
// 如果flutter_module模块是创建在项目内部
setBinding(new Binding([gradle: this]))
evaluate(new File(settingsDir.path, 'flutter_module/.android/include_flutter.groovy'))
// 如果是项目内部引入flutter模块，还需要引入flutter_module进来
include ':flutter_module'

// 如果flutter_module模块在项目外部，和项目平级
//setBinding(new Binding([gradle: this]))
//evaluate(new File(
//        settingsDir.parentFile,
//        'module_flutter/.android/include_flutter.groovy'
//))
```

3. 如果 Android 项目的主 module 名称不是 app，而是改成了其他的名称:，则还需要在 project 级别的 `gradle.properties` 中添加如下代码:

> flutter.hostAppProjectName = app_module_name

4. 在对应的 Android module 依赖 flutter 模块

在 app 主模块的 build.gradle 的 dependencies 中加入依赖库

> implementation project(':flutter')

## 集成代码

### add a single Flutter screen

#### [Add a normal Flutter screen](https://docs.flutter.dev/add-to-app/android/add-flutter-screen?tab=custom-activity-launch-kotlin-tab#add-a-normal-flutter-screen)

Flutter 提供了 FlutterActivity 用来展示 Flutter 的界面

1. Add `FlutterActivity` to AndroidManifest.xml

```xml
<activity
  android:name="io.flutter.embedding.android.FlutterActivity"
  android:theme="@style/LaunchTheme"
  android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
  android:hardwareAccelerated="true"
  android:windowSoftInputMode="adjustResize"
/>
```

> @style/LaunchTheme 可替换成你想要的

2. Launch FlutterActivity

假定 Dart entrypoint 是 `main()`，initial route 初始化路由是 `/`

```kotlin
myButton.setOnClickListener {
  startActivity(
    FlutterActivity.createDefaultIntent(this)
  )
}
```

如果需要渲染自定义的 initial route 初始化路由：

```kotlin
myButton.setOnClickListener {
  startActivity(
    FlutterActivity
      .withNewEngine()
      .initialRoute("/my_route")
      .build(this)
  )
}
```

Flutter main.dart

```dart
void main() => runApp(const MyApp());

Map<String, WidgetBuilder> routes = {
  "/": (context) => const MyHomePage(title: "Flutter Demo Home Page by /."),
  "/my_route": (context) => const MyHomePage(title: "my_route Flutter Demo Home Page by my_route."),
};

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // home: const MyHomePage(title: 'Flutter Demo Home Page'),
      routes: routes,
      initialRoute: "/", //名为"/"的路由作为应用的home(首页)
    );
  }
}
```

通过 `withNewEngine()` 配置的 FlutterActivity 会创建自己的 FlutterEngine，这意味着启动一个标准的 FlutterActivity 会在界面可见时出现一短暂的延迟，可以选择使用预缓存的 FlutterEngine 来减小其延迟，实际上在内部会先检查是否存在预缓存的 FlutterEngine，如果存在则使用该 FlutterEngine，否则继续使用非预缓存的 FlutterEngine

#### [Use a cached FlutterEngine](https://docs.flutter.dev/add-to-app/android/add-flutter-screen?tab=default-activity-launch-kotlin-tab#step-3-optional-use-a-cached-flutterengine)

- 每个 FlutterActivity 创建自己的 FlutterEngine，创建需要花费不少时间；每创建一个 FlutterActivity 都需要一定的时间才能看到
- 可以预先加载 FlutterEngine，在 Application onCreate 中预热

```kotlin
class MyApplication : Application() {
  lateinit var flutterEngine : FlutterEngine

  override fun onCreate() {
    super.onCreate()

    // Instantiate a FlutterEngine.
    flutterEngine = FlutterEngine(this)

    // Start executing Dart code to pre-warm the FlutterEngine.
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )

    // Cache the FlutterEngine to be used by FlutterActivity.
    FlutterEngineCache
      .getInstance()
      .put("my_engine_id", flutterEngine)
  }
}

myButton.setOnClickListener {
  startActivity(
    FlutterActivity
      .withCachedEngine("my_engine_id")
      .build(this)
  )
}
```

初始化路由带 cache engine

```kotlin
class MyApplication : Application() {
  lateinit var flutterEngine : FlutterEngine
  override fun onCreate() {
    super.onCreate()
    // Instantiate a FlutterEngine.
    flutterEngine = FlutterEngine(this)
    // Configure an initial route.
    flutterEngine.navigationChannel.setInitialRoute("your/route/here");
    // Start executing Dart code to pre-warm the FlutterEngine.
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )
    // Cache the FlutterEngine to be used by FlutterActivity or FlutterFragment.
    FlutterEngineCache
      .getInstance()
      .put("my_engine_id", flutterEngine)
  }
}
```

#### Add a translucent Flutter screen

```xml
<style name="MyTheme" parent="@style/MyParentTheme">
  <item name="android:windowIsTranslucent">true</item>
</style>

<activity
  android:name="io.flutter.embedding.android.FlutterActivity"
  android:theme="@style/MyTheme"
  android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
  android:hardwareAccelerated="true"
  android:windowSoftInputMode="adjustResize"
/>
```

代码：

```kotlin
// Using a new FlutterEngine.
startActivity(
    FlutterActivity
        .withNewEngine()
        .backgroundMode(FlutterActivityLaunchConfigs.BackgroundMode.transparent)
        .build(this)
);

// Using a cached FlutterEngine.
startActivity(
    FlutterActivity
        .withCachedEngine("my_engine_id")
        .backgroundMode(FlutterActivityLaunchConfigs.BackgroundMode.transparent)
        .build(this)
);
```

### [add a Flutter Fragment](https://docs.flutter.dev/add-to-app/android/add-flutter-fragment?tab=add-fragment-kotlin-tab)

#### FlutterFragment

全新的 FlutterEngine

```kotlin
class FlutterFragmentDemoActivity : AppCompatActivity() {

    companion object {
        // Define a tag String to represent the FlutterFragment within this
        // Activity's FragmentManager. This value can be whatever you'd like.
        private const val TAG_FLUTTER_FRAGMENT = "flutter_fragment"
    }

    // Declare a local variable to reference the FlutterFragment so that you
    // can forward calls to it later.
    private var flutterFragment: FlutterFragment? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflate a layout that has a container for your FlutterFragment. For
        // this example, assume that a FrameLayout exists with an ID of
        // R.id.fragment_container.
        setContentView(R.layout.fragment_flutter_demo)

        // Get a reference to the Activity's FragmentManager to add a new
        // FlutterFragment, or find an existing one.
        val fragmentManager: FragmentManager = supportFragmentManager

        // Attempt to find an existing FlutterFragment, in case this is not the
        // first time that onCreate() was run.
        flutterFragment = fragmentManager
            .findFragmentByTag(TAG_FLUTTER_FRAGMENT) as FlutterFragment?

        // Create and attach a FlutterFragment if one does not exist.
        if (flutterFragment == null) {
            val newFlutterFragment = FlutterFragment.createDefault()
            flutterFragment = newFlutterFragment
            fragmentManager
                .beginTransaction()
                .add(
                    R.id.flutter_fragment_container,
                    newFlutterFragment,
                    TAG_FLUTTER_FRAGMENT
                )
                .commit()
        }
    }

    override fun onPostResume() {
        super.onPostResume()
        flutterFragment!!.onPostResume()
    }

    override fun onNewIntent(@NonNull intent: Intent) {
        super.onNewIntent(intent)
        flutterFragment!!.onNewIntent(intent)
    }

    override fun onBackPressed() {
        flutterFragment!!.onBackPressed()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String?>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        flutterFragment!!.onRequestPermissionsResult(
            requestCode,
            permissions,
            grantResults
        )
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(requestCode, resultCode, data)
        flutterFragment!!.onActivityResult(
            requestCode,
            resultCode,
            data
        )
    }

    override fun onUserLeaveHint() {
        flutterFragment!!.onUserLeaveHint()
    }

    override fun onTrimMemory(level: Int) {
        super.onTrimMemory(level)
        flutterFragment!!.onTrimMemory(level)
    }
}
```

#### pre-warmed FlutterEngine

```kotlin
// Somewhere in your app, before your FlutterFragment is needed,
// like in the Application class ...
// Instantiate a FlutterEngine.
val flutterEngine = FlutterEngine(context)

// Start executing Dart code in the FlutterEngine.
flutterEngine.getDartExecutor().executeDartEntrypoint(
    DartEntrypoint.createDefault()
)

// Cache the pre-warmed FlutterEngine to be used later by FlutterFragment.
FlutterEngineCache
  .getInstance()
  .put("my_engine_id", flutterEngine)

FlutterFragment.withCachedEngine("my_engine_id").build()
```

#### Initial route with a cached engine

```kotlin
class MyApplication : Application() {
  lateinit var flutterEngine : FlutterEngine
  override fun onCreate() {
    super.onCreate()
    // Instantiate a FlutterEngine.
    flutterEngine = FlutterEngine(this)
    // Configure an initial route.
    flutterEngine.navigationChannel.setInitialRoute("your/route/here");
    // Start executing Dart code to pre-warm the FlutterEngine.
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )
    // Cache the FlutterEngine to be used by FlutterActivity or FlutterFragment.
    FlutterEngineCache
      .getInstance()
      .put("my_engine_id", flutterEngine)
  }
}
```

#### [Control FlutterFragment’s render mode](https://docs.flutter.dev/add-to-app/android/add-flutter-fragment?tab=cached-engine-with-initial-route-kotlin-tab#control-flutterfragments-render-mode)

#### [Display a FlutterFragment with transparency](https://docs.flutter.dev/add-to-app/android/add-flutter-fragment?tab=cached-engine-with-initial-route-kotlin-tab#display-a-flutterfragment-with-transparency)

### [add a Flutter View](https://docs.flutter.dev/add-to-app/android/add-flutter-view)

### use Flutter engine

## Ref

<https://mp.weixin.qq.com/s/ceoiYiICn1mCOd7yW1CT0g>

# 三方

## flutter_booster
