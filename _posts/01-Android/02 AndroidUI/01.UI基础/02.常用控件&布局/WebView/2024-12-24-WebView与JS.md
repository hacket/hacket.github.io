---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:03 晚上
title: WebView与JS
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Webview 中 js 和 java 交互方式]
linter-yaml-title-alias: Webview 中 js 和 java 交互方式
---

# Webview 中 js 和 java 交互方式

## 传统通信

### 1、Java 调用 JS

- loadUrl<br />Java 调用 JS，只有一种 `WebView.loadUrl("javascript:function()")`，
- evaluateJavascript

> Android8.0+，onAlert 只回调一次？

#### loadUrl

- Html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carson_Ho</title>

    // JS代码
    <script>
    // Android需要调用的方法
   function callJS() {
      alert("Android调用了JS的callJS方法");
   }
    </script>
</head>
</html>
```

- Java

```kotlin
class Java调用Js代码 : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_java_call_js)

        var webSettings = webview.settings
        // 设置与Js交互的权限
        webSettings.setJavaScriptEnabled(true)
        // 设置允许JS弹窗
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true)

        webview.webChromeClient = object : WebChromeClient() {
            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                ToastUtils.showShort(message)
                LogUtil.i("url:$url,message:$message")
                return true
            }
        }

        webview.loadUrl("file:///android_asset/js/javacalljs.html")

        btn_loadurl.setOnClickListener {
            webview.post {
                LogUtil.i("javascript:callJS()")
                webview.loadUrl("javascript:callJS()")
            }
        }
    }
}
```

#### evaluateJavascript

该方法比第一种方法效率更高、使用更简洁。

> - 因为该方法的执行不会使页面刷新，而第一种方法（loadUrl ）的执行则会。
> - Android 4.4 后才可使用

```kotlin
// 其他代码同loadUrl
btn_evaluateJavascript.setOnClickListener {
    webview.post {
        webview.evaluateJavascript("javascript:callJS()") {
            LogUtil.i("evaluateJavascript ,value:$it")
        }
    }
}
```

#### 参数返回值

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carson_Ho</title>

    // JS代码
    <script>
    // Android需要调用的方法
    function callJS() {
      alert("Android调用了JS的callJS方法");
    }
    function readyToGo() {
        alert("WebView调用JavaScript无参无返回值函数")
    }
    function alertMessage(message) {
        alert(message)
    }
    function getYourCar(){
        return "Car";
    }
    </script>
</head>
</html>
```

- Kotlin

```kotlin
btn_no_param_no_return.setOnClickListener {
    webview.loadUrl("javascript:readyToGo()")
}
btn_has_param_no_return.setOnClickListener {
    val call = "javascript:alertMessage(\"" + "WebView调用JavScript有参无返回值函数" + "\")"
    webview.loadUrl(call)
}
btn_has_param_has_return.setOnClickListener {
    evaluateJavaScript(webview)
}
```

#### 对比

两种方法混合使用，即 Android 4.4 以下使用方法 1，Android 4.4 以上方法 2：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688181584032-927b78aa-4b29-45a8-824f-41c076d37767.png#averageHue=%23f6f6f6&clientId=uc6cb6bbb-57e5-4&from=paste&height=259&id=uf8c2b5e3&originHeight=518&originWidth=1560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83478&status=done&style=none&taskId=u25a71296-9a3a-4bd6-8d54-ae89edd8ba6&title=&width=780)

```java
// Android版本变量
final int version = Build.VERSION.SDK_INT;
// 因为该方法在 Android 4.4 版本才可使用，所以使用时需进行版本判断
if (version < 19) {
    mWebView.loadUrl("javascript:callJS()");
} else {
    mWebView.evaluateJavascript（"javascript:callJS()", new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String value) {
            //此处为 js 返回的结果
        }
    });
}
```

### 2、JS 调用 Java

- 通过 WebView 的 addJavascriptInterface() 进行对象映射<br />Android4.2 及以上版本添加 [@JavascriptInterface](/JavascriptInterface)
- WebViewClient 的 shouldOverrideUrlLoading() 方法回调拦截 url
- onConsoleMessage
- 通过 WebChromeClient 的 onJsAlert()、onJsConfirm()、onJsPrompt() 方法回调拦截 JS 对话框 alert()、confirm()、prompt() 消息
  - onJsAlert

> alert()，使用频率高

- onJsConfirm

> 确认框，使用频率一般

- onJsPrompt

> 提示输入框，使用频率很少

可用 jsPrompt 用来 JS 和 Java 通信的桥梁通道

#### 通过 WebView 的 addJavascriptInterface() 进行对象映射

- html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carson</title>
    <script>
         function callAndroid(){
        // 由于对象映射，所以调用test对象等于调用Android映射的对象
            test.hello("js调用了android中的hello方法");
         }
    </script>
</head>
<body>
点击按钮则调用callAndroid函数<br/>
<button type="button" id="button1" onclick="callAndroid()">点我通过js调用java</button>
</body>
</html>
```

- java

```kotlin
class js调用Java代码 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_js_call_java)

        var webSettings = webview.settings;

        // 设置与Js交互的权限
        webSettings.javaScriptEnabled = true;

        // 通过addJavascriptInterface()将Java对象映射到JS对象
        //参数1：Javascript对象名
        //参数2：Java对象名
        webview.addJavascriptInterface(AndroidtoJs(), "test") //AndroidtoJS类对象映射到js的test对象

        // 加载JS代码
        // 格式规定为:file:///android_asset/文件名.html
        webview.loadUrl("file:///android_asset/js/jscalljava.html")
    }
}
```

在页面的 window 对象里注入了 `test` 对象。在 js 里可以直接调用

- 优点

> 使用简单，仅将 Android 对象和 JS 对象映射即可

- 缺点<br />存在严重的漏洞问题，具体请看文章：[你不知道的 Android WebView 使用漏洞](https://www.jianshu.com/p/3a345d27cd42)

#### 在 Android 通过 WebViewClient 复写 `shouldOverrideUrlLoading()`

- html

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Carson_Ho</title>

    <script>
         function callAndroid(){
            /*约定的url协议为：js://webview?arg1=111&arg2=222*/
            document.location = "js://webview?arg1=111&arg2=222";
         }
    </script>
</head>

<!-- 点击按钮则调用callAndroid（）方法  -->
<body>
<button type="button" id="button1" onclick="callAndroid()">点击调用Android代码_shouldOverrideUrlLoading
</button>
</body>
</html>
```

- Kotlin

```kotlin
class js调用Java代码_shouldOverrideUrlLoading : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_js_call_java_should_override_url_loading)

        var webSettings = webview.settings

        // 设置与Js交互的权限
        webSettings.javaScriptEnabled = true
        // 设置允许JS弹窗
        webSettings.javaScriptCanOpenWindowsAutomatically = true
        webview.webViewClient = object : WebViewClient() {

            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return super.shouldOverrideUrlLoading(view, url)
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {

                // 步骤2：根据协议的参数，判断是否是所需要的url
                // 一般根据scheme（协议格式） & authority（协议名）判断（前两个参数）
                //假定传入进来的 url = "js://webview?arg1=111&arg2=222"（同时也是约定好的需要拦截的）

                // 如果url的协议 = 预先约定的 js 协议
                // 就解析往下解析参数
                var uri: Uri? = request?.url ?: return super.shouldOverrideUrlLoading(view, request)

                if (uri?.scheme.equals("js")) {

                    // 如果 authority  = 预先约定协议里的 webview，即代表都符合约定的协议
                    // 所以拦截url,下面JS开始调用Android需要的方法
                    if (uri?.authority.equals("webview")) {
                        //  步骤3：
                        // 执行JS所需要调用的逻辑
                        LogUtil.i("js调用了Android的方法")
                        // 可以在协议上带有参数并传递到Android上
                        var params = HashMap<String, String>()
                        var queryParameterNames = uri?.queryParameterNames
                        queryParameterNames?.forEach {
                            var name = it
                            var value = uri?.getQueryParameter(it)
                            LogUtil.i("name:$name,value:$value")
                        }
                    }
                    return true
                }

                return super.shouldOverrideUrlLoading(view, request)
            }
        }

        // 步骤1：加载JS代码
        // 格式规定为:file:///android_asset/文件名.html
        webview.loadUrl("file:///android_asset/js/jscalljava_shouldoverrideurlloading.html")
    }
}
```

- 优点

> 不存在方式 1WebView 的 addJavascriptInterface 的漏洞

- 缺点

> 如果 JS 想要得到 Android 方法的返回值，只能通过 WebView 的 loadUrl() 去执行 JS 方法把返回值传递回去，相关的代码如下：

```
// Android：MainActivity.java
mWebView.loadUrl("javascript:returnResult(" + result + ")");

// JS：javascript.html
function returnResult(result){
    alert("result is" + result);
}
```

#### 通过 WebChromeClient 的 onJsAlert()、onJsConfirm()、onJsPrompt() 方法回调拦截 JS 对话框 alert()、confirm()、prompt() 消息

在 JS 中，有三个常用的对话框方法：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688182336771-4e74220c-5e59-41a2-8bb6-887dc4dc558c.png#averageHue=%23f5f5f5&clientId=u59e3cb1e-bfa7-4&from=paste&height=293&id=u61f34019&originHeight=586&originWidth=1580&originalType=binary&ratio=2&rotation=0&showTitle=false&size=111892&status=done&style=none&taskId=ua8a953c0-11d7-40f6-bed5-51fa5bf78a9&title=&width=790)

- html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Carson_Ho</title>

    <script>

    function clickprompt(){
    // 调用prompt（）
    var result=prompt("js://demo?arg1=111&arg2=222");
    alert("demo " + result);
}
    </script>
</head>
<!-- 点击按钮则调用clickprompt()  -->
<body>
    <button type="button" id="button1" onclick="clickprompt()">点击调用Android代码通过onJsPrompt()</button>
</body>
</html>
```

- Kotlin

```kotlin
class js调用Java代码_onJsPrompt : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_js_call_java_onjsprompt)

        var webSettings = webview.settings

        // 设置与Js交互的权限
        webSettings.javaScriptEnabled = true
        // 设置允许JS弹窗
        webSettings.javaScriptCanOpenWindowsAutomatically = true

        webview.webChromeClient = object : WebChromeClient() {

            // 拦截输入框(原理同方式2)
            // 参数message:代表promt（）的内容（不是url）
            // 参数result:代表输入框的返回值
            override fun onJsPrompt(view: WebView?, url: String?, message: String?,
                                    defaultValue: String?, result: JsPromptResult?): Boolean {
                // 根据协议的参数，判断是否是所需要的url(原理同方式2)
                // 一般根据scheme（协议格式） & authority（协议名）判断（前两个参数）
                //假定传入进来的 url = "js://demo?arg1=111&arg2=222"（同时也是约定好的需要拦截的）
                // 如果url的协议 = 预先约定的 js 协议
                // 就解析往下解析参数
                var uri: Uri? = Uri.parse(message)
                LogUtil.w("uri:${uri.toString()}")
                if (uri?.scheme.equals("js")) {
                    // 如果 authority  = 预先约定协议里的 webview，即代表都符合约定的协议
                    // 所以拦截url,下面JS开始调用Android需要的方法
                    if (uri?.authority.equals("demo")) {
                        //  步骤3：
                        // 执行JS所需要调用的逻辑
                        LogUtil.i("js调用了Android的方法前，睡眠4000ms")
                        SystemClock.sleep(4000)
                        // 可以在协议上带有参数并传递到Android上
                        var params = HashMap<String, String>()
                        var queryParameterNames = uri?.queryParameterNames
                        queryParameterNames?.forEach {
                            var name = it
                            var value = uri?.getQueryParameter(it)
                            LogUtil.i("name:$name,value:$value")
                        }
                        LogUtil.i("js调用了Android的方法后")

                        //参数result:代表消息框的返回值(输入值)
                        result?.confirm("js调用了Android的方法成功啦")
                    }
                    return true
                }

                return super.onJsPrompt(view, url, message, defaultValue, result)
            }

            // 通过alert()和confirm()拦截的原理相同，此处不作过多讲述
            // 拦截JS的警告框
            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                return super.onJsAlert(view, url, message, result)
            }

            // 拦截JS的确认框
            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                return super.onJsConfirm(view, url, message, result)
            }
        }
        // 步骤1：加载JS代码
        // 格式规定为:file:///android_asset/文件名.html
        webview.loadUrl("file:///android_asset/js/jscalljava_onjsprompt.html")
    }
}
```

#### 三种方式对比

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688182359901-1b0028c4-352a-4315-a82b-23bd6b3082b7.png#averageHue=%23f4f4f4&clientId=u59e3cb1e-bfa7-4&from=paste&height=223&id=ueb2d5346&originHeight=704&originWidth=1842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=182207&status=done&style=none&taskId=ufc4b155e-9944-4956-b05c-60bf7c0471d&title=&width=583)

## JSBridge

- js 向 native 的通信协议

定制 js 调用 native 的 jsbridge 协议：

```java
// jsbridge://className:port/methodName?jsonObj


1. className：类名
2. port：port用来干嘛，其实js层调用native层方法后，native需要将执行结果返回给js层，WebChromeClient的onJsPrompt只能是同步的，异步的返回就不行了。这时候port就发挥了它应有的作用，我们在js中调用native方法的时候，在js中注册一个callback，然后将该callback在指定的位置上缓存起来，然后native层执行完毕对应方法后通过WebView.loadUrl调用js中的方法，回调对应的callback。那么js怎么知道调用哪个callback呢？于是我们需要将callback的一个存储位置传递过去，那么就需要native层调用js中的方法的时候将存储位置回传给js，js再调用对应存储位置上的callback，进行回调。于是，完整的协议定义如下：
jsbridge://className:callbackAddress/methodName?jsonObj

3. methodName：方法名

4. jsonObj：方法要用的参数
```

例如：

```java
jsbridge://Logger:callbackAddress/log?{"msg":"native log"}
```

## jsbrige 原理

1. 通过 onJsPromt，js 通过 prompt，Java 层拦截该 onJsPrompt
2. js 和 Java 层定义好协议如 `JSBridge://obj:port/method?params`
3. Java 层处理完毕，通过 js 中缓存的 callback 回调过去

- Android JSBridge 的原理与实现<br /><https://blog.csdn.net/sbsujjbcy/article/details/50752595>
- JSBridge 的原理<br /><https://juejin.im/post/5abca877f265da238155b6bc>

## jsbridge 库

- <https://github.com/wendux/DSBridge-Android>

> 三端易用的现代跨平台 Javascript bridge， 通过它，你可以在 Javascript 和原生之间同步或异步的调用彼此的函数.

- <https://github.com/lzyzsd/JsBridge>
- <https://github.com/hjhrq1991/JsBridge>

> 基于 github.com/lzyzsd/JsBridge 优化改进而来的 JsBridge  1.基于系统的 JsBridge； 2.基于 Tbs X5 内核的 JsBridge；

- WebViewJavascriptBridge

> <https://github.com/marcuswestin/WebViewJavascriptBridge>，只有 iOS 平台>

## Android 通过 WebView 与 JS 的交互方式总结

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688181201626-5cb67d0a-0053-4e88-9e37-20d27abe9aa3.png#averageHue=%23f5f5f5&clientId=uc6cb6bbb-57e5-4&from=paste&height=347&id=u1fe3cc9a&originHeight=694&originWidth=1952&originalType=binary&ratio=2&rotation=0&showTitle=false&size=237621&status=done&style=none&taskId=u1ebdc666-2cec-4ae2-8664-56c238bff31&title=&width=976)

## Android 和 H5 交互有大图

1. SVGA 时，需要加个头：`data:application/octet-stream;base64,base64字符串`
2. 出现 `uncaught SyntaxError: Unexpected token`
   - 图片过大，对图片进行压缩再 base64
   - Base64.DEFAULT 修改为 NO_WRAP

```kotlin
// JsCallCommontMethodForSalam
@CommonMethodForjs
fun bundleFile(map: HashMap<String, Any>, webView: WeakReference<WebView>) {
    try {
        // val s = SystemClock.uptimeMillis()
        GlobalScope.launch(Dispatchers.Main) {
            val name = map["name"]
            val data = withContext(Dispatchers.IO) {
                val input = GlobalContext.getAppContext().assets.open("web/$name")
                val bytes = StreamTool.read(input)
                Base64.encodeToString(bytes, Base64.NO_WRAP)
            }
            val base64SVGA = "\"data:application/octet-stream;base64,$data\""
            callJsMethod(webView, base64SVGA, map)
            // val cost = SystemClock.uptimeMillis() - s
            LogUtils.i(TAG, "bundleFile cost=ms，name=$name，base64SVGA=$base64SVGA，map=$map")
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

## Ref

- Android：你要的 WebView 与 JS 交互方式 都在这里了<br /><https://blog.csdn.net/carson_ho/article/details/64904691>
- 库<br /><https://github.com/lzyzsd/JsBridge>
- js 和 java 交互方案参考<br />0. <https://jiandanxinli.github.io/2016-08-31.html>
  1. <https://www.jianshu.com/p/b9164500d3fb>
  2. <https://www.jianshu.com/p/93cea79a2443>

# 自己实现的简单的 JSBridge 支持异步

## 确认通过 onJsPrompt 来实现

```java
public class MyJSBridgeWebChromeClient extends WebChromeClient {
    @Override
    public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        result.confirm(MyJSBridge.callJava(view, message));
        return true;
    }
}
```

## 定义 MyJSBridge

> 存储暴露给 js 的 native 方法；拦截 onJsPrompt 给 WebChromeClient，实现调用本地 native 方法

```java

public interface IBridge {

}


public final class MyJSBridge {

    private static final String JSBREIDGE_NAME = "JSBridge";

    /**
     * key：暴露的对象名，提供给js调用的对象
     *
     * 
<pre>
     * value: { HashMap<String, Method>
     *
     *      name: 方法名
     *      value: Method
     * }
     *
     * </pre>
*/
    private static Map<String, HashMap<String, Method>> exposedMethods = new HashMap<>();

    /**
     * 注册IBridge，将该Bridge中的所有方法注册保存
     */
    public static void register(String exposedName, Class<? extends IBridge> clazz) {
        if (!exposedMethods.containsKey(exposedName)) {
            try {
                exposedMethods.put(exposedName, getAllMethod(clazz));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 获取IBridge中的所有方法
     */
    private static HashMap<String, Method> getAllMethod(Class injectedCls) throws Exception {
        HashMap<String, Method> mMethodsMap = new HashMap<>();
        Method[] methods = injectedCls.getDeclaredMethods();
        for (Method method : methods) {
            String name;
            if (method.getModifiers() != (Modifier.PUBLIC | Modifier.STATIC) || (name = method.getName()) == null) {
                continue;
            }
            Class[] parameters = method.getParameterTypes();
            if (null != parameters && parameters.length == 3) {
                if (parameters[0] == WebView.class  // 参数1为webview
                        && parameters[1] == JSONObject.class  // 参数2为：JSONObject
                        && parameters[2] == JsCallback.class)   // 参数3为：JsCallback
                {
                    mMethodsMap.put(name, method);
                }
            }
        }
        return mMethodsMap;
    }

    /**
     * 将js传来的uri进行解析，然后根据调用的类名别名从刚刚的map中查找是不是存在，存在的话拿到该类所有方法的methodMap，然后根据方法名从methodMap拿到方法，反射调用，并将参数传进去，参数就是前文说的满足条件的三个参数，即WebView，JSONObject，Callback

     * @param webView webview
     * @param uriString uri
     * @return
     */
    public static String callJava(WebView webView, String uriString) {
        String methodName = "";
        String className = "";
        String param = "{}";
        String port = "";
        if (!TextUtils.isEmpty(uriString) && uriString.startsWith(JSBREIDGE_NAME)) {
            Uri uri = Uri.parse(uriString);
            className = uri.getHost();
            param = uri.getQuery();
            port = uri.getPort() + "";
            String path = uri.getPath();
            if (!TextUtils.isEmpty(path)) {
                methodName = path.replace("/", "");
            }
        }

        if (exposedMethods.containsKey(className)) {
            HashMap<String, Method> methodHashMap = exposedMethods.get(className);

            if (methodHashMap != null && methodHashMap.size() != 0 && methodHashMap.containsKey(methodName)) {
                Method method = methodHashMap.get(methodName);
                if (method != null) {
                    try {
                        method.invoke(null, webView, new JSONObject(param), new JsCallback(webView, port));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return null;
    }
}
```

## 定义 JsCallback

> JsCallback 用于 js 调用 native 后，native 可以异步执行后然后告知 js 完成了操作

```java
public class JsCallback {

    private static Handler mHandler = new Handler(Looper.getMainLooper());

    /**
     * js中定义的callback格式
     */
    private static final String CALLBACK_JS_FORMAT = "javascript:JSBridge.onFinish('%s', %s);";

    /**
     * js中随机生成的port，js中有个保存callback的数组callbacks，port就是callbacks的位置，理解为数组的位置
     */
    private String mPort;

    /**
     * 虚引用保存webview，用于java回调js方法时用，webview.loadUrl("javascript:xxx");
     */
    private WeakReference<WebView> mWebViewRef;

    public JsCallback(WebView view, String port) {
        mWebViewRef = new WeakReference<>(view);
        mPort = port;
    }

    public void apply(JSONObject jsonObject) {
        final String execJs = String.format(CALLBACK_JS_FORMAT, mPort, String.valueOf(jsonObject));
        if (mWebViewRef != null && mWebViewRef.get() != null) {
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    mWebViewRef.get().loadUrl(execJs);
                }
            });

        }
    }
}
```

## 编写 jsbridge.js

> 实现传递给 native 的协议定制；callback 的保存

```javascript
(function (win) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var JSBridge = win.JSBridge || (win.JSBridge = {});
    var JSBRIDGE_PROTOCOL = 'JSBridge';

    // 直接使用{}定义属性和值的键值对方式。键值键通过:连接，键与键之间用逗号隔开。
    var Inner = {
        callbacks: {},
        call: function (obj, method, params, callback) {
            console.log(obj + " " + method + " " + params + " " + callback);
            var port = Util.getPort();
            console.log(port);
            this.callbacks[port] = callback;
            var uri = Util.getUri(obj, method, params, port);
            console.log(uri);
            window.prompt(uri, "");
        },
        onFinish: function (port, jsonObj) {
            var callback = this.callbacks[port];
            callback && callback(jsonObj);
            delete this.callbacks[port];
        },
    };
    var Util = {
        getPort: function () {
            return Math.floor(Math.random() * (1 << 30));
        },
        getUri: function (obj, method, params, port) {
            params = this.getParam(params);
            var uri = JSBRIDGE_PROTOCOL + '://' + obj + ':' + port + '/' + method + '?' + params;
            return uri; // JSBridge://obj:port/method?params
        },
        getParam: function (obj) {
            if (obj && typeof obj === 'object') {
                return JSON.stringify(obj);
            } else {
                return obj || '';
            }
        }
    };
    for (var key in Inner) {
        if (!hasOwnProperty.call(JSBridge, key)) {
            JSBridge[key] = Inner[key];
        }
    }
})(window);
```

## 测试

- html

```html
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSBridge</title>
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1, user-scalable=no"/>
    <script src="file:///android_asset/js/MyJSBridge.js" type="text/javascript"></script>
    <script type="text/javascript">
      function rquestSuccess(res) {
        alert(JSON.stringify(res))
      }
    </script>
    <style>

    </style>
  </head>

  <body>
    <div>
      <h3>MyJSBridge 测试</h3>
    </div>
    <ul class="list">
      <li>
        <div>
          <button onclick="JSBridge.call('bridge','showToast',{'msg':'Hello JSBridge'},function(res){alert(JSON.stringify(res))})">
            测试showToast
          </button>
        </div>

        <div>
          <button onclick="JSBridge.call('bridge','requestNet',{'url':'https://blog.csdn.net/sbsujjbcy/article/details/50752595'},rquestSuccess)">
            网络请求
          </button>
        </div>
      </li>
      <br/>
    </ul>
  </body>
</html>
```

- 实现 IBridge，定制自己的功能

```java
public final class MyBridgeImpl implements IBridge {

    /**
     * 定义一个展示toast的native方法给js，参数定死，具体参考的定义 {@link me.hacket.assistant.samples.ui.webview.jsbridge.myjsbridge.lib.MyJSBridge#callJava(WebView, String)}
     *
     * @param webView  webview
     * @param param    js传递过来的json格式的参数
     * @param callback js传递过来的callback,可以用于异步回调，java完成后回调给js
     */
    public static void showToast(WebView webView, JSONObject param, final JsCallback callback) {
        String message = param.optString("msg");
        Toast.makeText(webView.getContext(), message, Toast.LENGTH_SHORT).show();
        if (null != callback) {
            try {
                JSONObject object = new JSONObject();
                object.put("key", "value");
                object.put("key1", "value1");
                callback.apply(getJSONObject(0, "ok", object));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static void requestNet(WebView webView, JSONObject param, final JsCallback callback) {
        String url = param.optString("url");
        LogUtil.i("获取到了js传递过来的url，模拟网络请求，睡眠5000ms:" + url);
        SystemClock.sleep(5000);
        LogUtil.i("模拟网络请求结束");
        try {
            if (callback != null) {
                JSONObject object = new JSONObject();
                object.put("name", "hacket");
                object.put("age", 26);
                callback.apply(getJSONObject(200, "获取网络数据成功", object));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private static JSONObject getJSONObject(int code, String msg, JSONObject result) {
        JSONObject object = new JSONObject();
        try {
            object.put("code", code);
            object.put("msg", msg);
            object.putOpt("result", result);
            return object;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

- 测试

```kotlin
class MyJSBridgeTestAct : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        var webview = WebView(this)
        setContentView(webview)

        var webSettings = webview.settings
        // 设置与Js交互的权限
        webSettings.javaScriptEnabled = true
        // 设置允许JS弹窗
        webSettings.javaScriptCanOpenWindowsAutomatically = true

        MyJSBridge.register("bridge", MyBridgeImpl::class.java)

        webview.webChromeClient = TestMyJSBridgeWebChromeClient()


        webview.loadUrl("file:///android_asset/js/MyJSBridge_test.html")
    }

    inner class TestMyJSBridgeWebChromeClient : MyJSBridgeWebChromeClient()

}
```

## Ref

- [ ] Android JSBridge 的原理与实现 <https://blog.csdn.net/sbsujjbcy/article/details/50752595>
