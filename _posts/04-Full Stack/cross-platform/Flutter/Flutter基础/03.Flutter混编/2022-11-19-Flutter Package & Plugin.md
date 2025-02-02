---
date_created: Tuesday, November 19th 2022, 11:27:19 pm
date_updated: Saturday, February 1st 2025, 12:48:53 am
title: Flutter Package & Plugin
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
aliases: [Flutter 包和插件]
linter-yaml-title-alias: Flutter 包和插件
---

# Flutter 包和插件

## Package Dart 包

当你需要开发一个纯 Dart 组件（比如一个自定义的 Weidget）的时候使用的形式，内部没有 Native 平台的代码。

## [Plugin 插件包](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#plugin)

插件包（Plugin packages）是当你需要暴露 Native API 给别人的时候使用的形式，内部需要使用 Platform Channels 并包含 Androiod/iOS 原生逻辑

### defaultTargetPlatform 获取平台信息

- defaultTargetPlatform 获取当前应用的平台信息
- debugDefaultTargetPlatformOverride 全局变量的值来指定应用平台

```dart
debugDefaultTargetPlatformOverride=TargetPlatform.iOS;
print(defaultTargetPlatform); // 会输出TargetPlatform.iOS
```

> 上面代码即使在 Android 中运行后，Flutter APP 也会认为是当前系统是 iOS，Material 组件库中所有组件交互方式都会和 iOS 平台对齐，defaultTargetPlatform 的值也会变为 TargetPlatform.iOS。

### 插件开发

实现一个获取电池电量的 Flutter 插件

### 创建 Flutter plugin

1. 命令方式

> flutter create --org com.example --template=plugin pluginName
>
> # 默认情况下，iOS 代码使用 swift 语言编写，Android 代码使用 Kotlin 语言编写。但是你可以通过 -i 指定 iOS 的语言；-a 指定 Android 的开发语言。
>
> flutter create --template=plugin -i objc -a java pluginName

2. AS

![v89de](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/v89de.png)

3. 目录结构

![mv3kr](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/mv3kr.png)

### 配置 pubspec.yaml

```yaml
flutter:
# This section identifies this Flutter project as a plugin project.
# The 'pluginClass' specifies the class (in Java, Kotlin, Swift, Objective-C, etc.)
# which should be registered in the plugin registry. This is required for
# using method channels.
# The Android 'package' specifies package in which the registered class is.
# This is required for using method channels on Android.
# The 'ffiPlugin' specifies that native code should be built and bundled.
# This is required for using `dart:ffi`.
# All these are used by the tooling to maintain consistency when
# adding or updating assets for this project.
	plugin:
  	platforms:
      android:
        package: me.hacket.flutter_plugin_demo
        pluginClass: FlutterPluginDemoPlugin
      ios:
    	  pluginClass: FlutterPluginDemoPlugin
```

### 添加 Flutter 层代码实现

在 lib 下新增 `batteryLevel.dart`

```dart
class BatteryLevel {
  static const MethodChannel _channel = MethodChannel(
    'me.hacket/battery');

  static Future<String> getBatteryLevel() async {
    String batteryLevel;
    try {
      final int result = await _channel.invokeMethod('getBatteryLevel');
      batteryLevel = 'Battery level: $result%.';
    } on PlatformException {
      batteryLevel = 'Failed to get battery level.';
    }
    return batteryLevel;
  }
}

```

### 添加不同平台的实现

#### Android 平台的实现

```dart
class FlutterPluginDemoPlugin : FlutterPlugin, MethodChannel.MethodCallHandler {
    private val CHANNEL = "me.hacket/battery"
    private lateinit var channel: MethodChannel
    private lateinit var context: Context

    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(flutterPluginBinding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)
        context = flutterPluginBinding.applicationContext
    }
    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        if (call.method == "getBatteryLevel") {
            val batteryLevel = getBatteryLevel()

            if (batteryLevel != -1) {
                result.success(batteryLevel)
            } else {
                result.error("UNAVAILABLE", "Battery level not available.", null)
            }
        } else {
            result.notImplemented()
        }
    }
    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }
    private fun getBatteryLevel(): Int {
        val batteryLevel: Int
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } else {
            val intent = ContextWrapper(context).registerReceiver(
                null,
                IntentFilter(
                    Intent.ACTION_BATTERY_CHANGED
                )
            )
            batteryLevel =
                intent!!.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) * 100 / intent.getIntExtra(
                BatteryManager.EXTRA_SCALE,
                -1
            )
        }

        return batteryLevel
    }
}
```

Android 工程报错：

1. 用单独的 as 窗口打开 Android 目录
2. 在 Android 目录下的 build.gradle 添加依赖

```groovy
def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}
//获取flutter的sdk路径
def flutterRoot = localProperties.getProperty('flutter.sdk')
if (flutterRoot == null) {
    println "Flutter SDK not found. Define location with flutter.sdk in the local.properties file."
}
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    compileOnly files("$flutterRoot/bin/cache/artifacts/engine/android-arm/flutter.jar")
}
```

#### iOS 平台的实现

### 添加文档

建议将下列文档添加到所有 package 中：

1. README.md 文件用来对 package 进行介绍
2. CHANGELOG.md 文件用来记录每个版本的更改
3. [LICENSE](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#adding-licenses-to-the-license-file) 文件用来阐述 package 的许可条款
4. [API 文档包含所有的公共 API](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#api-documentation)

### [发布插件](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#publish)

#### 发布的 pub.dev

- 自定义插件开发完成后，您可以将自定义插件发布到 [pub.dev](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2F) ，方便其他开发者使用。但是，在发布之前，请检查 pubspec.yaml、 README.md、 CHANGELOG.md 和 LICENSE 文件以确保内容完整和正确。
- 接下来在模式下运行 publish 命令， dry-run 看看是否都通过了分析：

$ flutter pub publish --dry-run

- 下一步是发布到 pub.dev，但请确保您已准备就绪，因为发布是无法恢复的最后一步：

$ flutter pub 发布

错误：

- The name of "lib\batteryLevel.dart", "batteryLevel", should match the name of the package, "flutter_plugin_demo".

> 将 yaml 中的 name 改成 lib 下的 batteryLevel.dart 的 batteryLevel
