---
date created: 2024-12-26 00:24
date updated: 2024-12-26 00:24
dg-publish: true
---

# Flutter包和插件

## Package Dart包

当你需要开发一个纯Dart组件（比如一个自定义的Weidget）的时候使用的形式，内部没有Native平台的代码。

## [Plugin 插件包](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#plugin)

插件包（Plugin packages）是当你需要暴露Native API给别人的时候使用的形式，内部需要使用Platform Channels并包含Androiod/iOS原生逻辑

### defaultTargetPlatform 获取平台信息

- defaultTargetPlatform 获取当前应用的平台信息
- debugDefaultTargetPlatformOverride 全局变量的值来指定应用平台

```dart
debugDefaultTargetPlatformOverride=TargetPlatform.iOS;
print(defaultTargetPlatform); // 会输出TargetPlatform.iOS
```

> 上面代码即使在Android中运行后，Flutter APP也会认为是当前系统是iOS，Material组件库中所有组件交互方式都会和iOS平台对齐，defaultTargetPlatform的值也会变为TargetPlatform.iOS。

### 插件开发

实现一个获取电池电量的Flutter插件

### 创建Flutter plugin

1. 命令方式

> flutter create --org com.example --template=plugin pluginName
>
> # 默认情况下，iOS代码使用swift语言编写，Android代码使用Kotlin语言编写。但是你可以通过 -i 指定iOS的语言；-a指定Android的开发语言。
>
> flutter create --template=plugin -i objc -a java pluginName

2. AS

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692034249115-3e72b8fb-a07a-4e66-b5d8-14828795edcb.png#averageHue=%233d4144&clientId=u61abb010-438b-4&from=paste&height=375&id=u4910e7d7&originHeight=1137&originWidth=1200&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=146007&status=done&style=stroke&taskId=u116dcf12-04bf-46de-88b1-452aaf821fb&title=&width=396)

3. 目录结构

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692034386664-8873df4d-08f7-4a67-9683-461a82c370d4.png#averageHue=%23504c41&clientId=u61abb010-438b-4&from=paste&height=368&id=u7fadc6ef&originHeight=840&originWidth=1026&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=125774&status=done&style=stroke&taskId=u970fb56d-87c1-4d2b-a7b6-1c9e178f58d&title=&width=450)

### 配置pubspec.yaml

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

### 添加Flutter层代码实现

在lib下新增`batteryLevel.dart`

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

Android工程报错：

1. 用单独的as窗口打开Android目录
2. 在Android目录下的build.gradle添加依赖

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

#### iOS平台的实现

### 添加文档

建议将下列文档添加到所有 package 中：

1. README.md 文件用来对 package 进行介绍
2. CHANGELOG.md 文件用来记录每个版本的更改
3. [LICENSE](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#adding-licenses-to-the-license-file) 文件用来阐述 package 的许可条款
4. [API 文档包含所有的公共 API](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#api-documentation)

### [发布插件](https://flutter.cn/docs/development/packages-and-plugins/developing-packages#publish)

#### 发布的pub.dev

- 自定义插件开发完成后，您可以将自定义插件发布到 [pub.dev](https://link.juejin.cn?target=https%3A%2F%2Fpub.dev%2F)  ，方便其他开发者使用。但是，在发布之前，请检查 pubspec.yaml、  README.md、 CHANGELOG.md和 LICENSE 文件以确保内容完整和正确。
- 接下来在模式下运行publish命令， dry-run 看看是否都通过了分析：

$ flutter pub publish --dry-run

- 下一步是发布到 pub.dev，但请确保您已准备就绪，因为发布是无法恢复的最后一步：

$ flutter pub 发布

错误：

- The name of "lib\batteryLevel.dart", "batteryLevel", should match the name of the package, "flutter_plugin_demo".

> 将yaml中的name改成lib下的batteryLevel.dart的batteryLevel
