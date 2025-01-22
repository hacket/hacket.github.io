---
date_created: Tuesday, November 19th 2022, 11:27:19 pm
date_updated: Wednesday, January 22nd 2025, 11:05:22 pm
title: Flutter Channel
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
aliases: [Flutter Channel 平台通道]
linter-yaml-title-alias: Flutter Channel 平台通道
---

# Flutter Channel 平台通道

## Platform Channel 介绍

Platform Channel 是一个异步消息通道，消息在发送之前会编码成二进制消息，接收到的二进制消息会解码成 Dart 值，其传递的消息类型只能是对应的解编码器支持的值，所有的解编码器都支持空消息，其 Native 与 Flutter 通信架构如下图所示：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691549109898-9e23125b-7cf8-40d0-a12e-e80dadd1388e.png#averageHue=%23f6f5f2&clientId=u640ab7c4-2f16-4&from=paste&height=516&id=u4fd4cf4b&originHeight=647&originWidth=580&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=94060&status=done&style=stroke&taskId=u59090d7b-27cd-4496-bea5-eee67656cbe&title=&width=463)<br>消息和响应以异步的形式进行传递，以确保用户界面能够保持响应。<br>Flutter 中定义了三种不同类型的 PlatformChannel：

1. BasicMessageChannel 用于数据传递
2. MethodChannel 用于传递方法调用
3. EventChannel 用于传递事件

其构造方法都需指定一个通道标识、解编码器以及 `BinaryMessenger`，BinaryMessenger 是一个 Flutter 与平台的通信工具，用来传递二进制数据、设置对应的消息处理器等。

解编码器有两种分别是 `MethodCodec` 和 `MessageCodec`，MethodCodec 对应方法 MessageCodec 对应消息，BasicMessageChannel 使用的是 MessageCodec，MethodChannel 和 EventChannel 使用的是 MethodCodec。

## [Platform Channel 数据类型及编解码器](https://flutter.cn/docs/development/platform-integration/platform-channels?tab=type-mappings-java-tab#codec)

Platform Channel 提供不同的消息解码机制，StandardMessageCodec 提供基本数据类型的解编码，JSONMessageCodec 支持 JSON 的解编码，在平台之间通信时都会自动转换：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691549217760-59e9f329-dcfc-449e-982b-2a5a13b28e0d.png#averageHue=%23f9f9f9&clientId=u640ab7c4-2f16-4&from=paste&height=450&id=u755b541f&originHeight=675&originWidth=596&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=81598&status=done&style=stroke&taskId=u4a89bbb2-4b6e-44a2-a840-09cd273a2e8&title=&width=397.3333333333333)

## BasicMessageChannel

BasicMessageChannel 主要是用来数据传递，包括二进制数据。BasicMessageChannel 可以实现 MethodChannel 和 EventChannel 的功能。<br>用 BasicMessageChannel 实现 Android 项目使用 Flutter 资源文件的案例：

1. Flutter 端获得图片资源对应的二进制数据，这里用 BinaryCodec，数据格式为 ByteData
2. 使用 BasicMessageChannel 发送图片对应的数据
3. 在 Android 端使用 ByteBuffer 接收，并将其转换成 ByteArray，然后解析成 Bitmap 显示出来

Flutter 端关键代码：

```dart
// 创建BasicMessageChannel 
_basicMessageChannel = BasicMessageChannel<ByteData>("com.manu.image", BinaryCodec());

// 获取assets中的图片对应的ByteData数据
rootBundle.load('images/miao.jpg').then((value) => {
  _sendStringMessage(value)
  });

// 发送图片数据
_sendStringMessage(ByteData byteData) async {
  await _basicMessageChannel.send(byteData);
}
```

Android 端关键代码：

```kotlin
override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    Log.i(tag, "configureFlutterEngine")
    // 设置消息处理器
    BasicMessageChannel<ByteBuffer>(
        flutterEngine.dartExecutor, "com.manu.image", BinaryCodec.INSTANCE
    ).setMessageHandler { message, reply ->
        Log.i(tag, "configureFlutterEngine > message:$message")
        // 数据转换：ByteBuffer->ByteArray
        val byteBuffer = message as ByteBuffer
        imageByteArray = ByteArray(byteBuffer.capacity())
        byteBuffer.get(imageByteArray)
    }

    // 用于设置Flutter跳转Android的方法处理器
    MethodChannel(flutterEngine.dartExecutor, channel).setMethodCallHandler { call, result ->
        Log.i(tag, "configureFlutterEngine > method:${call.method}")
        if ("startBasicMessageChannelActivity" == call.method) {
            // 携带图片数据
            BasicMessageChannelActivity.startBasicMessageChannelActivity(this,imageByteArray)
        }
    }
}

// 显示来自Flutter assets中的图片
val imageByteArray = intent.getByteArrayExtra("key_image")
val bitmap = BitmapFactory.decodeByteArray(imageByteArray,0,imageByteArray.size)
imageView.setImageBitmap(bitmap)
```

BasicMessageChannel 结合 BinaryCodec 是支持大内存数据块的传递的

## MethodChannel

MethodChannel 主要是用来方法的传递，可以传递 Native 方法和 Dart 方法，可以在 Flutter 中调用 Android 原生方法，也可以在 Android 中调用 Dart 方法，互相调用都是通过 MethodChannel 的 invokeMethod 方法实现的，通信时必须使用相同的通道标识符。

### Flutter 调用 Android 方法

实现功能：从 Flutter 跳转到 Android 原生界面

- Android 端

```kotlin
val tag = AgentActivity::class.java.simpleName;

class AgentActivity : FlutterActivity() {
    val tag = AgentActivity::class.java.simpleName;
    private val channel = "com.manu.startMainActivity"
    private var platform: MethodChannel? = null;

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        Log.d(tag,"configureFlutterEngine")
        platform = MethodChannel(flutterEngine.dartExecutor, channel)
        // 设置方法处理器
        platform!!.setMethodCallHandler(StartMethodCallHandler(this@AgentActivity))
    }

    companion object{
        /**
* 重新创建NewEngineIntentBuilder才能保证生效
*/
        fun withNewEngine(): MNewEngineIntentBuilder? {
            return MNewEngineIntentBuilder(AgentActivity::class.java)
        }
    }

    /**
* 自定义NewEngineIntentBuilder
*/
    class MNewEngineIntentBuilder(activityClass: Class<out FlutterActivity?>?) :
    NewEngineIntentBuilder(activityClass!!)

    /**
* 实现MethodCallHandler
*/
    class StartMethodCallHandler(activity:Activity) : MethodChannel.MethodCallHandler{
        private val context:Activity = activity
        override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
            if ("startMainActivity" == call.method) {
                Log.i(tag,"arguments:"+call.arguments)
                startMainActivity(context)
                // 向Flutter回调执行结果
                result.success("success")
            } else {
                result.notImplemented()
            }
        }
    }
}
```

- Flutter 端

```dart
/// State
class _PageState extends State<PageWidget> {
  MethodChannel platform;
  @override
  void initState() {
    super.initState();
    platform = new MethodChannel('com.manu.startMainActivity');
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.fromLTRB(8, 8, 8, 0),
      child: RaisedButton(
        onPressed: () {
          _startMainActivity();
        },
        child: Text("Flutter to Android"),
      ),
    );
  }
  /// 跳转到原生Activity
  void _startMainActivity() {
    platform.invokeMethod('startMainActivity', 'flutter message').then((value) {
      // 接收返回的数据
      print("value:$value");
    }).catchError((e) {
      print(e.message);
    });
  }
}
```

### Android 调用 Dart 方法

实现调用 Flutter 中的 Dart 方法 getName。

- Android 端代码

```kotlin
class MainActivity : FlutterActivity() {
    private val tag = MainActivity::class.java.simpleName;
    private val channel = "com.manu.startMainActivity"
    private var methodChannel: MethodChannel? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnGetDart.setOnClickListener {
            getDartMethod()
        }
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        Log.i(tag,"configureFlutterEngine")
        methodChannel = MethodChannel(flutterEngine.dartExecutor,channel)
    }

    private fun getDartMethod(){
        methodChannel?.invokeMethod("getName",null, object :MethodChannel.Result{
            override fun success(result: Any?) {
                Log.i(tag,"success: "+result.toString())
                Toast.makeText(this@MainActivity,result.toString(),Toast.LENGTH_LONG).show()
            }

            override fun error(errorCode: String,errorMessage: String?,errorDetails: Any?) {
                Log.i(tag,"error")
            }

            override fun notImplemented() {
                Log.i(tag,"notImplemented")
            }
        })
    }

    companion object{
        fun startMainActivity(context: Context) {
            val intent = Intent(context, MainActivity::class.java)
            context.startActivity(intent)
        }
    }
}
```

- Flutter 端

```dart
/// State
class _PageState extends State<PageWidget> {
  MethodChannel platform;

  @override
  void initState() {
    super.initState();
    platform = new MethodChannel('com.manu.startMainActivity');

    // 监听Android调用Flutter方法
    platform.setMethodCallHandler(platformCallHandler);
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
  /// FLutter Method
  Future<dynamic> platformCallHandler(MethodCall call) async{
    switch(call.method){
      case "getName":
        return "name from flutter";
        break;
    }
  }
}

```

### [示例：获取电量](https://flutter.cn/docs/development/platform-integration/platform-channels?tab=type-mappings-kotlin-tab#example)

代码演示了如何调用平台相关 API 来检索并显示当前的电池电量。它通过平台消息 getBatteryLevel() 来调用 Android 的 BatteryManager API、 iOS 的 device.batteryLevel API、以及 Windows 上的 GetSystemPowerStatus。

#### 命令行创建 flutter 项目

```shell
flutter create batterylevel

# 默认情况下，我们的模板使用 Kotlin 编写 Android 或使用 Swift 编写 iOS 代码。要使用 Java 或 Objective-C，请使用 -i 和/或 -a 标志：
flutter create -i objc -a java batterylevel
```

#### Flutter 层

构建通道。在返回电池电量的单一平台方法中使用 MethodChannel。<br>通道的客户端和宿主端通过传递给通道构造函数的通道名称进行连接。一个应用中所使用的所有通道名称必须是唯一的；使用唯一的 域前缀 为通道名称添加前缀，比如：samples.flutter.dev/battery。

```dart
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  static const platform = MethodChannel('samples.flutter.dev/battery');

  // Get battery level.
  String _batteryLevel = 'Unknown battery level.';

  Future<void> _getBatteryLevel() async {
    String batteryLevel;
    try {
      final int result = await platform.invokeMethod('getBatteryLevel');
      batteryLevel = 'Battery level at $result % .';
    } on PlatformException catch (e) {
      batteryLevel = "Failed to get battery level: '${e.message}'.";
    }

    setState(() {
      _batteryLevel = batteryLevel;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              onPressed: _getBatteryLevel,
              child: const Text('Get Battery Level'),
            ),
            Text(_batteryLevel),
          ],
        ),
      ),
    );
  }
}
```

#### Android 层

1. 在 `configureFlutterEngine()` 方法中创建一个 MethodChannel 并调用 `setMethodCallHandler()`。确保使用的通道名称与 Flutter 客户端使用的一致。
2. 添加检索 Android 电量代码
3. 完整代码

```kotlin
class MainActivity : FlutterActivity() {
    private val CHANNEL = "samples.flutter.dev/battery"
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler {
                // This method is invoked on the main thread.
                call, result ->
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
    }

    private fun getBatteryLevel(): Int {
        val batteryLevel: Int
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } else {
            val intent = ContextWrapper(applicationContext).registerReceiver(
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

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691549789621-b13ef584-3eae-4e57-b94f-6df4c506caa1.png#averageHue=%23fcf7fc&clientId=u640ab7c4-2f16-4&from=paste&height=551&id=u436e3b7b&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=49998&status=done&style=stroke&taskId=ua3a75a7d-a2ed-4f5c-93aa-cf77b97b62c&title=&width=248)

## EventChannel

EventChannel 主要用于 Flutter 到原生之间的单向调用，类似 Android 中的广播，原生负责 Event 的发送，Flutter 端注册监听即可。

- Android 端代码

```kotlin
/// Android
class MFlutterFragment : FlutterFragment() {
    // 这里用Fragment，Activity也一样
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        Log.d(tag,"configureFlutterEngine")
        EventChannel(flutterEngine.dartExecutor,"com.manu.event").setStreamHandler(object:
            EventChannel.StreamHandler{
            override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
                Log.i(tag,"configureFlutterEngine > onListen")
                // EventSink发送事件通知
                events?.success("event message")
            }

            override fun onCancel(arguments: Any?) {
                Log.i(tag,"configureFlutterEngine > onCancel")
            }
        })
    }
    companion object{
        fun withNewEngine(): NewEngineFragmentBuilder? {
            return MNewEngineIntentBuilder(
                MFlutterFragment::class.java
            )
        }
    }
    class MNewEngineIntentBuilder(activityClass: Class<out FlutterFragment?>?) :
        NewEngineFragmentBuilder(activityClass!!)
}
```

- Flutter 端

```dart
/// State
class EventState extends State<EventChannelPage> {
  EventChannel _eventChannel;
  String _stringMessage;
  StreamSubscription _streamSubscription;

  @override
  void initState() {
    super.initState();
    _eventChannel = EventChannel("com.manu.event");
    // 监听Event事件
    _streamSubscription =
      _eventChannel.receiveBroadcastStream().listen((event) {
      setState(() {
        _stringMessage = event;
      });
    }, onError: (error) {
      print("event error$error");
    });
  }

  @override
  void dispose() {
    super.dispose();
    if (_streamSubscription != null) {
      _streamSubscription.cancel();
      _streamSubscription = null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text("EventChannel"),
          centerTitle: true,
        ),
      body: Center(
          child: Text(_stringMessage == null ? "default" : _stringMessage),
        ));
  }
}
```
