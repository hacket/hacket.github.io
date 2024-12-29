---
date created: 2024-09-05 02:23
date updated: 2024-12-24 00:28
dg-publish: true
---

# WebView的内核

## WebView内核加载逻辑

```java
private static final String CHROMIUM_WEBVIEW_NATIVE_RELRO_32 =
    "/data/misc/shared_relro/libwebviewchromium32.relro";
private static final String CHROMIUM_WEBVIEW_NATIVE_RELRO_64 =
    "/data/misc/shared_relro/libwebviewchromium64.relro";
/**
  * Load WebView's native library into the current process.
  *
  * <p class="note"><b>Note:</b> Assumes that we have waited for relro creation.
  *
  * @param clazzLoader class loader used to find the linker namespace to load the library into.
  * @param libraryFileName the filename of the library to load.
  */
public static int loadNativeLibrary(ClassLoader clazzLoader, String libraryFileName) {
    if (!sAddressSpaceReserved) {
        Log.e(LOGTAG, "can't load with relro file; address space not reserved");
        return WebViewFactory.LIBLOAD_ADDRESS_SPACE_NOT_RESERVED;
    }

    String relroPath = VMRuntime.getRuntime().is64Bit() ? CHROMIUM_WEBVIEW_NATIVE_RELRO_64 :
    CHROMIUM_WEBVIEW_NATIVE_RELRO_32;
    int result = nativeLoadWithRelroFile(libraryFileName, relroPath, clazzLoader);
    if (result != WebViewFactory.LIBLOAD_SUCCESS) {
        Log.w(LOGTAG, "failed to load with relro file, proceeding without");
    } else if (DEBUG) {
        Log.v(LOGTAG, "loaded with relro file");
    }
    return result;
}
```

## Android免安装升级WebView内核

- [GitHub - JonaNorman/WebViewUpgrade: upgrade webview directly does not require install WebView Apk In Android. Android免安装升级WebView内核](https://github.com/JonaNorman/WebViewUpgrade?tab=readme-ov-file)

# WebView存在什么问题？及怎么解决？

## WebView崩溃？

# WebView的优化

## WebView预加载

### WebView多进程

## WebView资源存本地

通用拦截-缓存共享、请求并行 直出解决了文字展现的速度问题，但是图片加载渲染速度还不理想。 借由内核的shouldInterceptRequest回调，拦截落地页图片请求，由客户端调用图片下载框架进行下载，并以管道方式填充到内核的WebResourceResponse中。就是说在shouldInterceptRequest拦截所有URL，之后只针对后缀是.PNG/.JPG等图片资源，使用第三方图片下载工具类似于Fresco进行下载并返回一个InputStream。

## WebView秒开（WebView白屏）

网页加载缓慢，白屏，使用卡顿。

### 为何有这种问题？

1. 调用loadUrl()方法的时候，才会开始网页加载流程
2. js臃肿问题
3. 加载图片太多
4. webview本身问题

### 白屏问题如何监控？

#### 什么时候会出现白屏？

1. **资源加载错误**：尤其是JS资源加载异常时
2. **页面逻辑问题**

- 读取undefined null的属性，`null.a;`
- 对普通对象进行函数调用，`const o = {}; o();`
- 将null undefined传递给Objects.keys，`Object.keys(null);`
- JSON反序列化接受到非法值，`JSON.parse({});`

3. **接口异常导致的白屏**：页面数据依赖网络接口，且页面没有默认的初始数据，导致在网络不好的情况下，接口数据没有获取到，从而导致页面列表数据空白等问题。

#### 如何判断是否白屏？

判断屏幕元素是否为白屏元素

### Webiew是怎么加载网页的呢？

Webview初始化→DOM下载→DOM解析→CSS请求/下载→CSS解析→渲染→绘制→合成

### 优化方向

#### 1、提前内核初始化

```java
public class App extends Application {
    private WebView mWebView ;
    @Override
    public void onCreate() {
        super.onCreate();
        mWebView = new WebView(new MutableContextWrapper(this));
    }
}
```

#### 2、Webview复用池

```java
public class WebPools {
    private final Queue<WebView> mWebViews;
    private Object lock = new Object();
    private static WebPools mWebPools = null;
    private static final AtomicReference<WebPools> mAtomicReference = new AtomicReference<>();
    private static final String TAG=WebPools.class.getSimpleName();

    private WebPools() {
        mWebViews = new LinkedBlockingQueue<>();
    }
    public static WebPools getInstance() {
        for (; ; ) {
            if (mWebPools != null)
                return mWebPools;
            if (mAtomicReference.compareAndSet(null, new WebPools()))
                return mWebPools=mAtomicReference.get();
        }
    }
    public void recycle(WebView webView) {
        recycleInternal(webView);
    }
    public WebView acquireWebView(Activity activity) {
        return acquireWebViewInternal(activity);
    }
    private WebView acquireWebViewInternal(Activity activity) {
        WebView mWebView = mWebViews.poll();
        LogUtils.i(TAG,"acquireWebViewInternal  webview:"+mWebView);
        if (mWebView == null) {
            synchronized (lock) {
                return new WebView(new MutableContextWrapper(activity));
            }
        } else {
            MutableContextWrapper mMutableContextWrapper = (MutableContextWrapper) mWebView.getContext();
            mMutableContextWrapper.setBaseContext(activity);
            return mWebView;
        }
    }
    private void recycleInternal(WebView webView) {
        try {
            if (webView.getContext() instanceof MutableContextWrapper) {
                MutableContextWrapper mContext = (MutableContextWrapper) webView.getContext();
             mContext.setBaseContext(mContext.getApplicationContext());
                LogUtils.i(TAG,"enqueue  webview:"+webView);
                mWebViews.offer(webView);
            }
            if(webView.getContext() instanceof  Activity){
                //throw new RuntimeException("leaked");
                LogUtils.i(TAG,"Abandon this webview  ， It will cause leak if enqueue !");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

带来的问题：内存泄漏

#### 3、独立进程，进程预加载

启动webview页面前，先启动PreWebService把[web]进程创建了，当启动WebActivity时，系统发发现[web]进程已经存在了，就不需要花费时间Fork出新的[web]进程了。

#### 4、使用x5内核，替换原生的浏览器内核

#### 5、app内置资源

app内置css、js文件并控制版本

#### 6、三方框架和大厂方案

**1. VasSonic**<br />VasSonic的核心思想： **并行**，充分利用webview初始化的时间进行一些数据的处理。在包含webview的activity启动时会一边进行webview的初始化逻辑，一边并行的执行sonic的逻辑。这个sonic逻辑就是网页的预加载

2. **百度app方案**

3. **今日头条方案**
