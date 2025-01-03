---
date created: 2024-09-05 02:23
date updated: 2024-12-24 00:27
dg-publish: true
---

# Webview基础

## WebView介绍

WebView是一个基于webkit引擎、展现web页面的控件。

> Android的Webview在低版本和高版本采用了不同的webkit版本内核，4.4后直接使用了Chrome。

WebView作用：

1. 显示和渲染Web页面
2. 直接使用html文件（网络上或本地assets中）作布局
3. 可和JavaScript交互调用

> WebView控件功能强大，除了具有一般View的属性和设置外，还可以对url请求、页面加载、渲染、页面交互进行强大的处理。

## Webview常用方法

### WebView的状态

```java
// 激活WebView为活跃状态，能正常执行网页的响应
webView.onResume() ；

// 当页面被失去焦点被切换到后台不可见状态，需要执行onPause；通过onPause动作通知内核暂停所有的动作，比如DOM的解析、plugin的执行、JavaScript执行。
webView.onPause()；

// 当应用程序(存在webview)被切换到后台时，这个方法不仅仅针对当前的webview而是全局的全应用程序的webview，它会暂停所有webview的layout，parsing，javascripttimer。降低CPU功耗。
webView.pauseTimers()

// 恢复pauseTimers状态
webView.resumeTimers()；//销毁Webview

// 在关闭了Activity时，如果Webview的音乐或视频，还在播放，就必须销毁Webview。但是注意：webview调用destory时,webview仍绑定在Activity上。这是由于自定义webview构建时传入了该Activity的context对象，因此需要先从父容器中移除webview,然后再销毁webview。
rootLayout.removeView(webView); 
webView.destroy();
```

### 关于前进 / 后退网页

```java

// 是否可以后退
Webview.canGoBack() 

// 后退网页
Webview.goBack()

// 是否可以前进                     
Webview.canGoForward()

// 前进网页
Webview.goForward()

// 以当前的index为起始点前进或者后退到历史记录中指定的steps；如果steps为负数则为后退，正数则为前进
Webview.goBackOrForward(intsteps)
```

- Android中按Back键控制网页后退

```java
public boolean onKeyDown(int keyCode, KeyEvent event) {
  if ((keyCode == KEYCODE_BACK) && mWebView.canGoBack()) { 
    mWebView.goBack();
    return true;
  }
  return super.onKeyDown(keyCode, event);
}
```

### 清除缓存数据

```java
// 清除网页访问留下的缓存；由于内核缓存是全局的因此这个方法不仅仅针对webview而是针对整个应用程序.
Webview.clearCache(true);

// 清除当前webview访问的历史记录，只会清除webview访问历史记录里的所有记录除了当前访问记录
Webview.clearHistory()；

// 这个api仅仅清除自动完成填充的表单数据，并不会清除WebView存储到本地的数据
Webview.clearFormData()；
```

### 设置滚动条

```java
WebView.setHorizontalScrollBarEnabled(false);  水平滚动条不可用
WebView.setVerticalScrollBarEnabled(false);  竖直滚动条不可用
WebView.setScrollBarStyle(View.SCROLLBARS_OUTSIDE_OVERLAY);  滚动条在view里面，不占用位置
```

### Webview去掉滑动拖拽反馈(边缘效应)

```java
webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
```

### Webview自适应屏幕

> 这方法可以让你的页面适应手机屏幕的分辨率，完整的显示在屏幕上，可以放大缩小。

```java
WebSettings.setUseWideViewPort(true);  // 如果没有设置为true，那么下面的网页在手机上显示不出来 
// https://i.topeffects.cn/activity/index?id=495&spm=38.214.23.167#
WebSettings.setLoadWithOverviewMode(true);
```

### WebView scrollbarStyle属性

`android:scrollbarStyle`可以定义滚动条的样式和位置，可选值有insideOverlay、insideInset、outsideOverlay、outsideInset四种。<br />其中inside和outside分别表示是否在view的padding区域内，overlay和inset表示覆盖在view上或是插在view后面，所以四种值分别表示：

```java
1. insideOverlay：默认值，表示在padding区域内并且覆盖在view上
2. insideInset：表示在padding区域内并且插入在view后面
3. outsideOverlay：表示在padding区域外并且覆盖在view上，推荐这个
4. outsideInset：表示在padding区域外并且插入在view后面
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688177466920-e14ff99a-965e-4282-b6f8-5f7ba669fe7f.png#averageHue=%2382a22c&clientId=u7fecbf79-0e00-4&from=paste&height=400&id=ub4e63157&originHeight=800&originWidth=480&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62175&status=done&style=none&taskId=u7cf850e8-3caa-460f-bfca-a3aa31d40c8&title=&width=240)

### WebView 设置代理

- [Android 为 WebView 设置代理访问网站 | ZhouZhou Blog](https://zwc365.com/2021/07/12/android%E4%B8%BAwebview%E8%AE%BE%E7%BD%AE%E4%BB%A3%E7%90%86%E8%AE%BF%E9%97%AE%E7%BD%91%E7%AB%99)
- [Android的Webview使用代理访问网站的另一种实现 | ZhouZhou Blog](https://zwc365.com/2020/11/11/android-webview-proxy)
- [GitHub - li520666/WebViewProxy: Class to set Android WebView proxy](https://github.com/li520666/WebViewProxy)

## WebView常用类

### WebSettings 对WebView进行配置和管理

```java
// 声明WebSettings子类
WebSettings webSettings = webView.getSettings();

// 如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
webSettings.setJavaScriptEnabled(true);  

// 支持插件
webSettings.setPluginsEnabled(true); 

// 设置自适应屏幕，两者合用
webSettings.setUseWideViewPort(true); // 将图片调整到适合webview的大小 
webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小

// 缩放操作
webSettings.setSupportZoom(true); // 支持缩放，默认为true。是下面那个的前提。webSettings.setBuiltInZoomControls(true); //设置内置的缩放控件。若为false，则该WebView不可缩放
webSettings.setDisplayZoomControls(false); // 隐藏原生的缩放控件

// 其他细节操作
webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); //关闭webview中缓存 
webSettings.setAllowFileAccess(true); //设置可以访问文件 
webSettings.setJavaScriptCanOpenWindowsAutomatically(true); //支持通过JS打开新窗口 
webSettings.setLoadsImagesAutomatically(true); //支持自动加载图片
webSettings.setDefaultTextEncodingName("utf-8");//设置编码格式
```

#### 设置WebView缓存

当加载 html 页面时，WebView会在/data/data/包名目录下生成 database 与 cache 两个文件夹；请求的 URL记录保存在 WebViewCache.db，而 URL的内容是保存在 WebViewCache 文件夹下。是否启用缓存：

```java
//优先使用缓存: 
WebView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); 
    //缓存模式如下：       
    // LOAD_CACHE_ONLY: 不使用网络，只读取本地缓存数据
    // LOAD_DEFAULT: （默认）根据cache-control决定是否从网络上取数据。      
    // LOAD_NO_CACHE: 不使用缓存，只从网络获取数据.
    // LOAD_CACHE_ELSE_NETWORK，只要本地有，无论是否过期，或者no-cache，都使用缓存中的数据。

WebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
```

案例：离线加载

```java
if (NetStatusUtil.isConnected(getApplicationContext())) {
    webSettings.setCacheMode(WebSettings.LOAD_DEFAULT); // 根据cache-control决定是否从网络上取数据。
} else {
    webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); // 没网，则从本地获取，即离线加载
}

webSettings.setDomStorageEnabled(true); // 开启 DOM storage API 功能
webSettings.setDatabaseEnabled(true);   // 开启 database storage API 功能
webSettings.setAppCacheEnabled(true); / /开启 Application Caches 功能

String cacheDirPath = getFilesDir().getAbsolutePath() + APP_CACAHE_DIRNAME;
webSettings.setAppCachePath(cacheDirPath); // 设置  Application Caches 缓存目录
```

> 注意： 每个 Application 只调用一次 WebSettings.setAppCachePath()，WebSettings.setAppCacheMaxSize()

### WebChromeClient 辅助 WebView 处理 Javascript 的对话框,网站图标,网站标题等等。

WebChromeClient主要处理解析，渲染网页等浏览器做的事情，辅助WebView处理Javascript的对话框，网站图标，网站title，加载进度等

```java
onCloseWindow(关闭WebView)
onCreateWindow()
onJsAlert (WebView上alert是弹不出来东西的，需要定制你的WebChromeClient处理弹出)
onJsPrompt
onJsConfirm
onProgressChanged
onReceivedIcon
onReceivedTitle
```

#### onProgressChanged 获得网页的加载进度并显示

```java
webview.setWebChromeClient(new WebChromeClient(){
    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        if (newProgress < 100) {
          String progress = newProgress + "%";
          progress.setText(progress);
        } else {
            
        }
    }
});
```

#### onReceivedTitle 获取Web页中的标题

```java
webview.setWebChromeClient(new WebChromeClient(){
    @Override
    public void onReceivedTitle(WebView view, String title) {
        titleview.setText(title)；   
    }
}
```

### WebViewClient 处理各种通知 & 请求事件

WebViewClient是帮助WebView处理各种通知、请求事件的，具体来说包括：

```java
shouldOverrideUrlLoading()
onLoadResource
onPageStart
onPageFinish
onReceiveError //这个就是我们想要的方法
onReceivedHttpAuthRequest
```

#### shouldOverrideUrlLoading()

打开网页时不调用系统浏览器， 而是在本WebView中显示；在网页上的所有加载都经过这个方法,这个函数我们可以做很多操作

```java
//步骤1. 定义Webview组件
Webview webview = (WebView) findViewById(R.id.webView1);

//步骤2. 选择加载方式
//方式1. 加载一个网页：webView.loadUrl("http://www.google.com/");

//方式2：加载apk包中的html页面
webView.loadUrl("file:///android_asset/test.html");

//方式3：加载手机本地的html页面
webView.loadUrl("content://com.android.htmlfileprovider/sdcard/test.html");

//步骤3. 复写shouldOverrideUrlLoading()方法，使得打开网页时不调用系统浏览器， 而是在本WebView中显示
webView.setWebViewClient(new WebViewClient(){
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        view.loadUrl(url);
        return true;
    }
});
```

#### onPageStarted()/onPageFinished

1. onPageStarted 开始载入页面调用的，我们可以设定一个loading的页面，告诉用户程序在等待网络响应。
2. onPageFinished 在页面加载结束时调用。我们可以关闭loading 条，切换程序动作。

```java
webView.setWebViewClient(new WebViewClient(){
    @Override
    public void  onPageStarted(WebView view, String url, Bitmap favicon) {
        // 设定加载开始的操作
    }
    @Override
    public void onPageFinished(WebView view, String url) {
        // 设定加载结束的操作
    }
});
```

#### onLoadResource()

在加载页面资源时会调用，每一个资源（比如图片）的加载都会调用一次。

```java
webView.setWebViewClient(new WebViewClient(){
    @Override
    public boolean onLoadResource(WebView view, String url) {
        // 设定加载资源的操作
    }
});
```

#### onReceivedError() 定义404错误

加载页面的服务器出现错误时（如404）调用。

```java
//步骤1：写一个html文件（error_handle.html），用于出错时展示给用户看的提示页面
//步骤2：将该html文件放置到代码根目录的assets文件夹下

//步骤3：复写WebViewClient的onRecievedError方法
//该方法传回了错误码，根据错误类型可以进行不同的错误分类处理
    webView.setWebViewClient(new WebViewClient(){
      @Override
      public void onReceivedError(WebView view, int errorCode, String description, String failingUrl){
switch(errorCode)
                {
                case HttpStatus.SC_NOT_FOUND:
                    view.loadUrl("file:///android_assets/error_handle.html");
                    break;
                }
            }
        });
```

WebView自定义404错误，由于`android.webkit.WebViewClient`中`onReceivedError()`不能回调http code中404的错误，<br />但如果在404的title中有404，可以利用WebChromeClient的onReceivedTitle()来判断title包含404来做处理，<br />不过主流的浏览器，uc,qq等都没有处理404错误页面

- webview定义错误页面（将错误页面放在assets/，在这个回调方法中加载默认错误页面）

```java
public void onReceivedError(WebView view, int errorCode,
       String description, String failingUrl) {
}
```

#### onReceivedSslError() 处理https请求

webView默认是不处理https请求的，页面显示空白，需要进行如下设置：

```java
webView.setWebViewClient(new WebViewClient() {    
    @Override    
    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {    
        handler.proceed();    //表示等待证书响应
        // handler.cancel();      //表示挂起连接，为默认方式
        // handler.handleMessage(null);    //可做其他处理
    }    
});
```

## WebView缓存

- [ ] <https://github.com/yale8848/CacheWebView>
- [ ] Android：手把手教你构建 全面的WebView 缓存机制 & 资源加载方案<br />[https://www.jianshu.com/p/5e7075f4875f#1. 浏览器缓存机制](https://www.jianshu.com/p/5e7075f4875f#1.%20%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6)
- [ ] Android webView 缓存 Cache + HTML5 离线功能<br /><https://juejin.im/entry/5709c96979bc44004c6cd5ca>

## 让WebView支持文件下载

### 设置DownloadListener，自定义下载

让 WebView 支持下载，需要给 WebView 设置下载监听器 setDownloadListener，DownloadListener 里面只有一个方法 onDownloadStart，每当有文件需要下载时，该方法就会被回调，下载的 URL 通过方法参数传递，我们可以在这里处理下载事件

```java

mWebView.setDownloadListener(new DownloadListener() {
    @Override
    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
        // TODO: 2017-5-6 处理下载事件
    }
});
```

优势是我们可以感知下载进度，处理开始、取消、失败、完成等事件，不足之处是对下载的控制不如系统服务，必须自己处理网络带来的问题。

### 使用系统的下载服务DownloaderManager

DownloadManager 是系统提供的用于处理下载的服务，使用者只需提供下载 URI 和存储路径，并进行简单的设置。DownloadManager 会在后台进行下载，并且在下载失败、网络切换以及系统重启后尝试重新下载。

系统在下载完成后会发送一条广播，里面有任务 ID，告诉调用者任务完成，通过 DownloadManager 获取到文件信息就可以进一步处理。

### 重写WebViewClient的shouldOverrideUrlLoading()拦截，通过外置浏览器打开

直接把下载任务抛给浏览器，剩下的就不用我们管了。缺点是无法感知下载完成，当然就没有后续的处理，比如下载 apk 完成后打开安装界面。

```java
private void downloadByBrowser(String url) { 
    Intent intent = new Intent(Intent.ACTION_VIEW); 
    intent.addCategory(Intent.CATEGORY_BROWSABLE); 
    intent.setData(Uri.parse(url)); startActivity(intent); 
}
```

## WebView记录上次阅读位置

```java
// 应用退出时，记录滚动的位置
@Override
protected void onPause() {
    super.onPause();
    int scrollY = webview_scrolling.getScrollY();
    int scrollX = webview_scrolling.getScrollX();
    LogUtil.i(TAG, "当前阅读位置：" + scrollX + "," + scrollY);
    SPUtils.put(KEY_WEBVIEW_READ_POSITION_X, scrollX);
    SPUtils.put(KEY_WEBVIEW_READ_POSITION_Y, scrollY);
}
// 加载url后，滚动到之前记录的位置
mScrolledX = (int) SPUtils.get(KEY_WEBVIEW_READ_POSITION_X, 0);
mScrolledY = (int) SPUtils.get(KEY_WEBVIEW_READ_POSITION_Y, 0);
if (mScrolledY >= 0 || mScrolledX >= 0) {
    LogUtil.i(TAG, "滚动到上次已读位置：" + mScrolledY);
    webview_scrolling.scrollTo(mScrolledX, mScrolledY);
    mTvLastPosition.setText("上次阅读记录位置：" + "(" + mScrolledX + "," + mScrolledY + ")");
}
```

## WebView监听滚动

### WebView监听滚动，网页的滚动

```java
public class ScrollingWebView extends WebView {
    private static final String TAG = "webview";
    private int mScaledTouchSlop = ViewConfiguration.get(getContext()).getScaledTouchSlop();
    private OnScrollChangedCallback mOnScrollChangedCallback;
    public ScrollingWebView(Context context) {
        super(context, null);
    }

    public ScrollingWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ScrollingWebView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    /**
     * onOverScrolled
     *
     * @param scrollX 第一个参数为距离远点的X轴的距离
     * @param scrollY 第二个参数为距离远点的Y轴的距离
     * @param clampedX 第三个参数当ScrollView滑动到左侧边界的时候值为true
     * @param clampedY 第四个参数当ScrollView滑动到下边界的时候值为true
     */
    @Override
    protected void onOverScrolled(int scrollX, int scrollY, boolean clampedX, boolean clampedY) {
        super.onOverScrolled(scrollX, scrollY, clampedX, clampedY);
        LogUtil.d(TAG, "onOverScrolled，scrollX:" + scrollX + "，scrollY:" + scrollY + "，clampedX：" + clampedX + "，clampedY：" + clampedY);
    }

    /***
     * onScrollChanged，
     * @param scrollX 第一个参数为变化后的X轴位置
     * @param scrollY 第二个参数为变化后的Y轴的位置
     * @param oldScrollX 第三个参数为原先的X轴的位置
     * @param oldScrollY 第四个参数为原先的Y轴的位置
     */
    @Override
    protected void onScrollChanged(final int scrollX, final int scrollY, final int oldScrollX, final int oldScrollY) {
        super.onScrollChanged(scrollX, scrollY, oldScrollX, oldScrollY);
        LogUtil.i(TAG, "onScrollChanged，scrollX:" + scrollX + "，scrollY:" + scrollY + "，oldScrollX：" + oldScrollX + "，oldScrollY：" + oldScrollY);
        if (mOnScrollChangedCallback != null) {
            mOnScrollChangedCallback.onScroll(scrollX - oldScrollX, scrollY - oldScrollY);
        }
    }

    public OnScrollChangedCallback getOnScrollChangedCallback() {
        return mOnScrollChangedCallback;
    }

    public void setOnScrollChangedCallback(@Nullable final OnScrollChangedCallback onScrollChangedCallback) {
        mOnScrollChangedCallback = onScrollChangedCallback;
    }

    /**
     * Impliment in the activity/fragment/view that you want to listen to the webview
     */
    public interface OnScrollChangedCallback {
        /**
         * onScroll
         *
         * @param dx x方向变化的距离
         * @param dy y方向变化的距离
         */
        void onScroll(int dx, int dy);
    }

}
```

### WebView监听滚动，监听Webview上的触摸

> 只有一页的网页，网页本身内容不能滚动，只是监听在WebView上的触摸滑动而已

```java
public class TouchWebView extends WebView implements View.OnTouchListener, View.OnClickListener {

    private static final String TAG = "webview";

    private float mDownX;
    private float mDownY;
    private int mScaledTouchSlop;

    private OnWebViewTouchListener mOnWebViewTouchListener;

    public TouchWebView(Context context) {
        this(context, null);
    }

    public TouchWebView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TouchWebView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
        setOnTouchListener(this);
// setOnClickListener(this);
    }

    private void init() {
        ViewConfiguration viewConfiguration = ViewConfiguration.get(getContext());
        mScaledTouchSlop = viewConfiguration.getScaledTouchSlop();
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        int action = event.getAction();
        switch (action) {
            case MotionEvent.ACTION_DOWN:
                mDownX = event.getX();
                mDownY = event.getY();
                logi("TouchWebView ACTION_DOWN：" + mDownX + "," + mDownY);
                break;
            case MotionEvent.ACTION_MOVE:
                break;
            case MotionEvent.ACTION_UP:
                float upX = event.getX();
                float upY = event.getY();
                float dx = upX - mDownX;
                float dy = upY - mDownY;
                logi("TouchWebView ACTION_MOVE：" + dx + "," + dy);

                if (mOnWebViewTouchListener != null) {
                    float distance = dy;
                    if (Math.abs(distance) >= mScaledTouchSlop) {
                        if (distance >= 0) {
                            mOnWebViewTouchListener.onScrolledDown(this, distance);
                        } else {
                            mOnWebViewTouchListener.onScrolledUp(this, distance);
                        }
                    } else {
                        mOnWebViewTouchListener.onWebViewNotScrolled(this, dx, dy);
                    }
                }
                break;
            default:
                break;
        }
        return false;
    }

    public TouchWebView setOnWebViewTouchListener(OnWebViewTouchListener listener) {
        this.mOnWebViewTouchListener = listener;
        return this;
    }

    @Override
    public void onClick(View v) {
// if (mOnWebViewClickListener != null) {
// mOnWebViewClickListener.onClick(this);
// }
    }

    public interface OnWebViewTouchListener {
        void onWebViewNotScrolled(TouchWebView webView, float dx, float dy);

        void onScrolledUp(TouchWebView webView, float distance);

        void onScrolledDown(TouchWebView webView, float distance);
    }

    private void logi(String msg) {
        LogUtil.i(TAG, msg);
    }

}
```

## Android WebView 诊断与排查问题的方法和技巧

### Android WebView调试利器之 Chrome DevTools

必须从您的应用中启用 WebView 调试。要启用 WebView 调试，请在 WebView 类上调用静态方法setWebContentsDebuggingEnabled。

```java

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {

    WebView.setWebContentsDebuggingEnabled(true);

}
```

在 DevTools 中打开 WebView<br />在google浏览器中输入以下地址：`chrome://inspect`页面将显示您的设备上已启用调试的 WebView 列表

- Sources区域

Sources选项选择后在预览页的右边有一个Sources显示区域我这里需要调试的代码都写在test.html里面的，如果你是写在js里面的这个区域同样会显示您的Js文件点击打开后就显示内容区域了。<br />现在我们就可以调试了

- Console区域

可以看到打印的log和当前变量的值和Android一样可以输入一个对象名就可以看到具体的值了如图我输入了一个test出来了对应的标签

- 内容区域

test.html是我的内容区域

可能出现的问题

1.如果上面的调试代码也加了再输入chrome://inspect 还是看不到列表（当然前提是应用要打开到webview页面）有可能第一次需要翻墙因为我的墙一直是开的这个是同事发现的。

2.这里我用的是JsBridge用的时候可能会出现点击没有反应

原因是(应该是二者没同步导致的)JsBridge和Js通讯写在js文件中的需要将代码库的WebViewJavascriptBridge.js文件放在当前项目的assets下面

### 开启DiagnosableWebViewClient日志输出

```kotlin
/**
 * 诊断（错误信息）的WebViewClient,会以日志输出形式输出错误信息，便于发现网页的问题
 */
open class DiagnosableWebViewClient : WebViewClient() {

    override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
        super.onReceivedError(view, errorCode, description, failingUrl)
        debugMessage("onReceivedError", "errorCode", errorCode, "description", description,
            "failingUrl", failingUrl, "webview.info", view?.toSimpleString())
    }

    override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
        super.onReceivedError(view, request, error)
        debugMessage("onReceivedError", "request", request?.toSimpleString(), "error", error?.toSimpleString(),
            "webview.info", view?.toSimpleString())
    }

    override fun onSafeBrowsingHit(view: WebView?, request: WebResourceRequest?, threatType: Int, callback: SafeBrowsingResponse?) {
        super.onSafeBrowsingHit(view, request, threatType, callback)
        debugMessage("onSafeBrowsingHit", "request", request?.toSimpleString(), "threatType", threatType,
            "webview.info", view?.toSimpleString())
    }

    override fun onReceivedHttpError(view: WebView?, request: WebResourceRequest?, errorResponse: WebResourceResponse?) {
        super.onReceivedHttpError(view, request, errorResponse)
        debugMessage("onReceivedHttpError", "request", request, "errorResponse", errorResponse?.toSimpleString(),
            "webview.info", view?.toSimpleString())
    }

    override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
        super.onReceivedSslError(view, handler, error)
        debugMessage("onReceivedSslError", "error", error, "webview.info", view?.toSimpleString())
    }
}
```

### Console日志查看

```kotlin
open class DiagnosableChromeClient: WebChromeClient() {
    override fun onConsoleMessage(message: String?, lineNumber: Int, sourceID: String?) {
        //不需要调用super方法
        debugMessage("onConsoleMessage", "message", message, "lineNumber", lineNumber, "sourceID", sourceID)
    }

    override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
        debugMessage("onConsoleMessage", "message", consoleMessage?.toSimpleString())
        //返回true，不再需要webview内部处理
        return true
    }
}
```

### 开启 WebView 远程调试

1. 一定要限定运行设备大于等于4.4系统
2. 强烈建议限定在Debug编译(或等同条件)包下开启，不建议Release包也启用该功能
3. 配置完成后，启动App，打开Chrome，输入`chrome://inspect`

```kotlin
fun WebView.enableRemoteDebugging() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && BuildConfig.DEBUG) {
        WebView.setWebContentsDebuggingEnabled(true)
    }
}
```

## WebView与JS的交互

见`WebView与JS.md`
