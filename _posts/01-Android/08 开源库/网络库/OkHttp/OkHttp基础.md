---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# OkHttp基本用法

## 基本的GET&POST使用

```java
public class MainActivity extends AppCompatActivity {

    private static final String TAG = "tag";
    private TextView tv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tv = (TextView) findViewById(R.id.tv);

        //        get();
        //        get1();

        //        post();
        String json = "";
        post1(json);

    }

    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    /**
     * POST提交Json数据
     */
    private void post1(String json) {
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .readTimeout(5, TimeUnit.SECONDS)
                .connectTimeout(5, TimeUnit.SECONDS)
                .build();

        String url = "";

        RequestBody requestBody = RequestBody.create(JSON, json);

        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();

        Call call = okHttpClient.newCall(request);
        try {
            Response response = call.execute();
            if (response.isSuccessful()) {
                String body = response.body().string();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * POST提交键值对
     * <p/>
     * 通过POST方式把键值对数据传送到服务器
     */
    private void post() {
        String url = "http://172.18.188.37:8080/Demo/newsDetailPageBottomData";

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .readTimeout(5, TimeUnit.SECONDS)
                .connectTimeout(5, TimeUnit.SECONDS)
                .build();

        RequestBody requestBody = new FormBody.Builder()
                .add("username", "hacket")
                .add("password", "123456")
                .build();

        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                        //  .addHeader() 添加
                        //  .header() 设置
                .build();

        final Call call = okHttpClient.newCall(request);

        new Thread() {
            @Override
            public void run() {
                try {
                    Response response = call.execute();
                    if (response.isSuccessful()) {
                        ResponseBody responseBody = response.body();
                        final String body = responseBody.string();
                        Log.d(TAG, "body:" + body);

                        // 回调在工作线程
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                tv.setText(body);
                            }
                        });
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    private void get1() {
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .connectTimeout(5, TimeUnit.SECONDS)
                .readTimeout(5, TimeUnit.SECONDS)
                .build();
        Request request = new Request.Builder()
                .url("http://www.csdn.net/")
                .build();
        final Call call = okHttpClient.newCall(request);
        new Thread() {
            @Override
            public void run() {
                try {
                    Response response = call.execute();
                    if (response.isSuccessful()) {
                        ResponseBody responseBody = response.body();
                        final String body = responseBody.string();
                        Log.d(TAG, "body:" + body);

                        // 回调在工作线程
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                tv.setText(body);
                            }
                        });
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    /**
     * HTTP GET
     */
    private void get() {
        String url = "http://gold.xitu.io/entry/56cb3259d342d3005457d151";

        // 默认构造
        // OkHttpClient client = new OkHttpClient();

        // 配置构造
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(30, TimeUnit.SECONDS)
                .connectTimeout(30, TimeUnit.SECONDS)
                .build();

        //        Request
        Request request = new Request.Builder()
                .url(url)
                .build();

        Call call = client.newCall(request);

        //        取消请求，已经完成的请求不能被取消
        //        call.cancel();

        // enqueue()为OkHttp提供的异步方法
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: " + call.toString() + "---" + e.getMessage());
            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                // 回调在子线程

                final ResponseBody body = response.body();

                final String str = body.string();

                // 回调在工作线程
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        tv.setText(str);
                    }
                });

            }
        });

    }

}
```

## 同步GET/异步GET

```java
/***
 * 同步/异步get
 */
public void syncGet() {

    final OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .readTimeout(5, TimeUnit.SECONDS)
            .connectTimeout(5, TimeUnit.SECONDS)
            .build();

    final Request request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

    new Thread() {
        @Override
        public void run() {

            try {
                Response response = okHttpClient.newCall(request).execute();
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response);
                }

                Headers responseHeaders = response.headers();
                for (int i = 0; i < responseHeaders.size(); i++) {

                    Log.d(TAG, "syncGet: " + responseHeaders.name(i) + ": " + responseHeaders.value(i));
                }

                Log.d(TAG, "syncGet: " + response.body().string());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }.start();

    // 异步get
    // okHttpClient.newCall(request).enqueue(callback);
}
```

## 提取响应头

典型的HTTP头 像是一个 `Map<String, String>` :每个字段都有一个或没有值。但是一些头允许多个值，像Guava的[Multimap](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/Multimap.html)。例如：HTTP响应里面提供的`Vary`响应头，就是多值的。OkHttp的api试图让这些情况都适用。<br />当写请求头的时候，使用`header(name, value)`可以设置唯一的name、value。如果已经有值，旧的将被移除，然后添加新的。使用`addHeader(name, value)`可以添加多值（添加，不移除已有的）。<br />当读取响应头时，使用`header(name)`返回最后出现的name、value。通常情况这也是唯一的name、value。如果没有值，那么`header(name)`将返回null。如果想读取字段对应的所有值，使用`headers(name)`会返回一个list。<br />为了获取所有的Header，Headers类支持按index访问。

```java
private final OkHttpClient client = new OkHttpClient();
 
public void run() throws Exception {
    Request request = new Request.Builder()
        .url("https://api.github.com/repos/square/okhttp/issues")
        .header("User-Agent", "OkHttp Headers.java")
        .addHeader("Accept", "application/json; q=0.5")
        .addHeader("Accept", "application/vnd.github.v3+json")
        .build();
 
    Response response = client.newCall(request).execute();
    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
 
    System.out.println("Server: " + response.header("Server"));
    System.out.println("Date: " + response.header("Date"));
    System.out.println("Vary: " + response.headers("Vary"));
}
```

## Post方式提交String

使用HTTP POST提交请求到服务。这个例子提交了一个markdown文档到web服务，以HTML方式渲染markdown。因为整个请求体都在内存中，因此避免使用此api提交大文档（大于1MB）。

```java
public static final MediaType MEDIA_TYPE_MARKDOWN
        = MediaType.parse("text/x-markdown; charset=utf-8");

private void postString() {
    final OkHttpClient client = new OkHttpClient();
    String postBody = ""
            + "Releases\n"
            + "--------\n"
            + "\n"
            + " * _1.0_ May 6, 2013\n"
            + " * _1.1_ June 15, 2013\n"
            + " * _1.2_ August 11, 2013\n";

    final Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(RequestBody.create(MEDIA_TYPE_MARKDOWN, postBody))
            .build();

    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    Log.e(TAG, response.body().string());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## Post方式提交流

以流的方式POST提交请求体。请求体的内容由流写入产生。这个例子是流直接写入[Okio](https://github.com/square/okio)的BufferedSink。你的程序可能会使用`OutputStream`，你可以使用`BufferedSink.outputStream()`来获取。

```java
public static final MediaType MEDIA_TYPE_MARKDOWN
        = MediaType.parse("text/x-markdown; charset=utf-8");

private void postStream() {
    final OkHttpClient client = new OkHttpClient();
    RequestBody requestBody = new RequestBody() {

        @Override
        public MediaType contentType() {
            return MEDIA_TYPE_MARKDOWN;
        }

        @Override
        public void writeTo(BufferedSink sink) throws IOException {
            sink.writeUtf8("Numbers\n");
            sink.writeUtf8("-------\n");
            for (int i = 2; i <= 997; i++) {
                sink.writeUtf8(String.format(" * %s = %s\n", i, factor(i)));
            }
        }

        private String factor(int n) {
            for (int i = 2; i < n; i++) {
                int x = n / i;
                if (x * i == n) {
                    return factor(x) + " × " + i;
                }
            }
            return Integer.toString(n);
        }
    };
     final Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(requestBody)
            .build();

    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    Log.e(TAG, response.body().string());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## Post方式提交文件

以文件作为请求体是十分简单的。

```java
public static final MediaType MEDIA_TYPE_MARKDOWN
        = MediaType.parse("text/x-markdown; charset=utf-8");

/**
 * Post方式提交文件
 */
private void postFile() {
    final OkHttpClient client = new OkHttpClient();

    File file = new File(Environment.getExternalStorageDirectory(), "note.md");

    RequestBody requestBody = RequestBody.create(MEDIA_TYPE_MARKDOWN, file);

    final Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(requestBody)
            .build();

    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    final String body = response.body().string();
                    Log.e(TAG, body);
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            tv.setText(body);
                        }
                    });
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## Post方式提交表单

使用`FormBody`来构建和HTML`<form>`标签相同效果的请求体。键值对将使用一种HTML兼容形式的URL编码来进行编码。

```java
private void postForm() {
    final OkHttpClient client = new OkHttpClient();

    RequestBody formBody = new FormBody.Builder()
            .add("search", "Jurassic Park")
            .build();

    final Request request = new Request.Builder()
            .url("https://en.wikipedia.org/w/index.php")
            .post(formBody)
            .build();

    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    final String body = response.body().string();
                    Log.e(TAG, body);
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            tv.setText(body);
                        }
                    });
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## Post方式提交分块请求

`MultipartBody`

```java
private static final String IMGUR_CLIENT_ID = "...";
private static final MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");

private void postPart() {
    final OkHttpClient client = new OkHttpClient();

    MultipartBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addPart(
                    Headers.of("Content-Disposition", "form-data; name=\"title\""),
                    RequestBody.create(null, "Square Logo"))
            .addPart(
                    Headers.of("Content-Disposition", "form-data; name=\"image\""),
                    RequestBody.create(MEDIA_TYPE_PNG, new File("website/static/logo-square.png")))
            .build();

    final Request request = new Request.Builder()
            .header("Authorization", "Client-ID " + IMGUR_CLIENT_ID)
            .url("https://api.imgur.com/3/image")
            .post(requestBody)
            .build();
    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    final String body = response.body().string();
                    Log.e(TAG, body);
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            tv.setText(body);
                        }
                    });
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## 使用Gson来解析JSON响应

```java
private void postGson() {
    final OkHttpClient client = new OkHttpClient();
    final Gson gson = new Gson();
    final Request request = new Request.Builder()
            .url("https://api.github.com/gists/c2a7c39532239ff261be")
            .build();
    new Thread() {
        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    Gist gist = gson.fromJson(response.body().charStream(), Gist.class);
                    for (Map.Entry<String, GistFile> entry : gist.files.entrySet()) {
                        System.out.println(entry.getKey());
                        System.out.println(entry.getValue().content);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}

static class Gist {
    Map<String, GistFile> files;
}

static class GistFile {
    String content;
}
```

## 响应缓存

为了缓存响应，你需要一个你可以读写的缓存目录，和缓存大小的限制。这个缓存目录应该是私有的，不信任的程序应不能读取缓存内容。<br />一个缓存目录同时拥有多个缓存访问是错误的。大多数程序只需要调用一次`new OkHttpClient()`，在第一次调用时配置好缓存，然后其他地方只需要调用这个实例就可以了。否则两个缓存示例互相干扰，破坏响应缓存，而且有可能会导致程序崩溃。<br />响应缓存使用HTTP头作为配置。你可以在请求头中添加`Cache-Control: max-stale=3600` ,OkHttp缓存会支持。你的服务通过响应头确定响应缓存多长时间，例如使用`Cache-Control: max-age=9600`。

```java
private void cache() {

    File cacheDir = new File(getCacheDir(), "bb");
    long cacheSize = 10 * 1024 * 1024; // 10M
    Cache cache = new Cache(cacheDir, cacheSize);
    final OkHttpClient client = new OkHttpClient.Builder()
            .cache(cache)
            .build();

    final Request request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

    new Thread() {

        @Override
        public void run() {
            try {
                Response response = client.newCall(request).execute();
                String string1 = "";
                if (response.isSuccessful()) {
                    string1 = response.body().string();
                    Log.d(TAG, "response string:" + string1);
                    Log.d(TAG, "response:" + response);
                    Log.d(TAG, "response cacheResponse:" + response.cacheResponse());
                    Log.d(TAG, "response networkResponse:" + response.networkResponse());
                }

                Response response2 = client.newCall(request).execute();
                String string2 = "  ";
                if (response2.isSuccessful()) {
                    string2 = response2.body().string();
                    Log.d(TAG, "response2 string:" + string2);
                    Log.d(TAG, "response2:" + response2);
                    Log.d(TAG, "response2 cacheResponse:" + response2.cacheResponse());
                    Log.d(TAG, "response2 networkResponse:" + response2.networkResponse());
                }

                Log.d(TAG, "Response 2 equals Response?" + string2.equals(string2));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }.start();
}
```

## 取消一个Call

使用`Call.cancel()`可以立即停止掉一个正在执行的call。如果一个线程正在写请求或者读响应，将会引发`IOException`。当call没有必要的时候，使用这个api可以节约网络资源。例如当用户离开一个应用时。不管同步还是异步的call都可以取消。你可以通过tags来同时取消多个请求。当你构建一请求时，使用`Request.Builder.tag(tag)`来分配一个标签。之后你就可以用`OkHttpClient.cancel(tag)`来取消所有带有这个tag的call。okHttp3用 `runningCalls()` and`queuedCalls()`取代。

```java
private void cacelCall() {
    ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
    final OkHttpClient client = new OkHttpClient();

    final Request request = new Request.Builder()
            .url("http://httpbin.org/delay/2") // This URL is served with a 2 second delay.
            .tag("hacket")
            .build();

    final long startTimeMillis = System.currentTimeMillis();
    final Call call = client.newCall(request);

    executorService.schedule(new Runnable() {
        @Override
        public void run() {
            Log.d(TAG, "【Canceling call】" + (System.currentTimeMillis() - startTimeMillis));
            call.cancel();
            Log.d(TAG, "【 Canceled call】" + (System.currentTimeMillis() - startTimeMillis));
        }
    }, 1, TimeUnit.SECONDS);

    Executors.newSingleThreadExecutor().execute(new Runnable() {
        @Override
        public void run() {
            try {
                Log.d(TAG, "【Executing call】" + (System.currentTimeMillis() - startTimeMillis));
                Response response = call.execute();
                Log.d(TAG, "【Call was expected to fail, but completed】" + (System.currentTimeMillis() -
                                                                                   startTimeMillis) + ":"
                        + response);
            } catch (IOException e) {
                Log.d(TAG, "【Call failed as expected】" + (System.currentTimeMillis() - startTimeMillis) + ":" + e);
            }
        }
    });

}
```

## 超时

没有响应时使用超时结束call。没有响应的原因可能是客户点链接问题、服务器可用性问题或者这之间的其他东西。OkHttp支持连接，读取和写入超时。

```java
private final OkHttpClient client;
 
public ConfigureTimeouts() throws Exception {
    client = new OkHttpClient();
    client.setConnectTimeout(10, TimeUnit.SECONDS);
    client.setWriteTimeout(10, TimeUnit.SECONDS);
    client.setReadTimeout(30, TimeUnit.SECONDS);
}
 
public void run() throws Exception {
    Request request = new Request.Builder()
        .url("http://httpbin.org/delay/2") // This URL is served with a 2 second delay.
        .build();
    Response response = client.newCall(request).execute();
    System.out.println("Response completed: " + response);
}
```

## 每个call的配置

使用`OkHttpClient`，所有的HTTP Client配置包括代理设置、超时设置、缓存设置。当你需要为单个call改变配置的时候，clone 一个`OkHttpClient`。这个api将会返回一个浅拷贝（shallow copy），你可以用来单独自定义。下面的例子中，我们让一个请求是500ms的超时、另一个是3000ms的超时。

```java
private final OkHttpClient client = new OkHttpClient();
 
public void run() throws Exception {
    Request request = new Request.Builder()
        .url("http://httpbin.org/delay/1") // This URL is served with a 1 second delay.
        .build();
 
    try {
      Response response = client.clone() // Clone to make a customized OkHttp for this request.
          .setReadTimeout(500, TimeUnit.MILLISECONDS)
          .newCall(request)
          .execute();
      System.out.println("Response 1 succeeded: " + response);
    } catch (IOException e) {
      System.out.println("Response 1 failed: " + e);
    }
 
    try {
      Response response = client.clone() // Clone to make a customized OkHttp for this request.
          .setReadTimeout(3000, TimeUnit.MILLISECONDS)
          .newCall(request)
          .execute();
      System.out.println("Response 2 succeeded: " + response);
    } catch (IOException e) {
      System.out.println("Response 2 failed: " + e);
    }
}
```

## OkHttp Proxy

### OkHttp中配置Proxy

```java
OkHttpClient.Builder builder = new OkHttpClient.Builder();

// 设置代理地址
SocketAddress sa = new InetSocketAddress("代理服地址", 代理端口);
builder.proxy(new Proxy(Proxy.Type.HTTP, sa));

OkHttpClient client = builder.build();
Request.Builder requestBuilder = new Request.Builder();
requestBuilder.url("目标服务器地址");
client.newCall(requestBuilder.build());
```

### Proxy基本原理

#### 正向代理（forward proxy）

正向代理是一个位于客户端和目标服务器之间的服务器(代理服务器)，为了从目标服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理服务器向目标服务器转交请求并将获得的内容返回给客户端。

![](https://note.youdao.com/src/1012B82782A94579811E5D3D5F1BAA06#id=EPl1L&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

正向代理有个明显的特点：代理服务器是在客户端设置的

案例：Shadowsocks和Astrill

#### 反向代理（reverse proxy）

反向代理是指"服务器端"主动部署"代理服务器"来接受互联网上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给客户端，此时代理服务器对外就表现为一个反向代理服务器。

![](https://note.youdao.com/src/DCA56A684F7E449EB7C15F88486D0E83#id=kfBoz&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

反向代理有个明显的特点：代理服务器是部署在服务器端的

#### 总结

用一句话总结正向代理和反向代理的区别就是：正向代理隐藏真实客户端，反向代理隐藏真实服务端。

## OkHttp3缓存

### 使用缓存

使用缓存可以让我们的app不用长时间地显示令人厌烦的加载框，提高了用户体验，而且节省了流量。在数据更新不是很频繁的地方使用缓存就非常有必要了。OkHttp已经内置了缓存，默认是不使用的，需要我们手动开启

#### Android中的Http缓存

OkHttp只对Get请求进行缓存，并不会对Post请求缓存，因为Post请求多是数据交互，没有多少缓存的意义。

##### 服务器支持缓存，配置OkHttp缓存目录和大小

```java
public void btn_okhttp_cache() {
    OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .cache(provideCache())
            .build();
}
private Cache provideCache() {
    return new Cache(mContext.getCacheDir(), 10 * 1024 * 1024);
}
```

##### 服务器不支持缓存，用interceptor

```java
public class ResponseCacheInterceptor implements Interceptor {

    private static final String RESPONSE_HEADER_PRAGMA = "Pragma";
    private static final String RESPONSE_HEADER_CACHE_CONTROL = "Cache-Control";

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();
        Response response = chain.proceed(request);
        Response newResponse = response.newBuilder()
                .removeHeader(RESPONSE_HEADER_PRAGMA)
                .removeHeader(RESPONSE_HEADER_CACHE_CONTROL)
                .header(RESPONSE_HEADER_CACHE_CONTROL, "max-age=" + 30 * 24 * 3600) // cache for 30 days
                .build();
        return newResponse;
    }

}

OkHttpClient okHttpClient = new OkHttpClient.Builder()
        .addNetworkInterceptor(new ResponseCacheInterceptor())
        .build();
```

#### Reference

- [ ] <http://www.jianshu.com/p/9c3b4ea108a7>
- [ ] web缓存相关<br />[你应该了解的 一些web缓存相关的概念.](http://www.cnblogs.com/_franky/archive/2011/11/23/2260109.html)

服务器禁用客户端缓存,添加响应头

```
Expires: -1
Cache-Control: no-cache
Pragma: no-cache
```

---

### OkHttp缓存原理

#### 缓存拦截器CacheInterceptor

在Interceptor的链中，在建立连接、和服务器通讯之前，就是`CacheInterceptor`，检查响应是否已经被缓存、缓存是否可用，如果是则直接返回缓存的数据，否则就进行后面的流程，并在返回之前，把网络的数据写入缓存。

> CacheInterceptor功能就是服务request从缓存中取数据和获取到服务器response写入到缓存中去。

OkHttp如何添加缓存的？<br />在RealCall的getResponseWithInterceptorChain()构建了很多系统的Interceptor，其中就有CacheInterceptor：

```java
// Real#getResponseWithInterceptorChain()
interceptors.add(new CacheInterceptor(client.internalCache()));
```

而OKHttpClient设置cache的：

```java
final @Nullable Cache cache;
final @Nullable InternalCache internalCache
public Cache cache() {
    return cache;
}
InternalCache internalCache() {
    return cache != null ? cache.internalCache : internalCache;
}
```

如果有Cache，就取Cache的internalCache；如果没有，就取internalCache值。

具体的缓存逻辑OkHttp内置封装了一个Cache类，它利用DiskLruCache，用磁盘的有限大小空间进行缓存，根据LRU算法进行缓存淘汰。

对OkHttp内置的Cache类不满意，我们可以自行实现InternalCache接口，这样就可以在OKHttpClient设置自定义的缓存策略了。

> Cache类主要封装了HTTP协议缓存细节的实现

## OkHttp注意

### OkHttp encode注意

post参数，如果已经decode了，包含\n特殊字符的话，会被过滤掉，导致比如聊天室公告，需要换行，

```java
FormBody.Builder.addEncoded（）
```

具体看下面代码：

```java
static void canonicalize(Buffer out, String input, int pos, int limit, String encodeSet,
      boolean alreadyEncoded, boolean strict, boolean plusIsSpace, boolean asciiOnly,
      Charset charset) {
Buffer encodedCharBuffer = null; // Lazily allocated.
int codePoint;
for (int i = pos; i < limit; i += Character.charCount(codePoint)) {
  codePoint = input.codePointAt(i);
  if (alreadyEncoded
      && (codePoint == '\t' || codePoint == '\n' || codePoint == '\f' || codePoint == '\r')) {
    // Skip this character.
  } else if (codePoint == '+' && plusIsSpace) {
    // Encode '+' as '%2B' since we permit ' ' to be encoded as either '+' or '%20'.
    out.writeUtf8(alreadyEncoded ? "+" : "%2B");
  } else if (codePoint < 0x20
      || codePoint == 0x7f
      || codePoint >= 0x80 && asciiOnly
      || encodeSet.indexOf(codePoint) != -1
      || codePoint == '%' && (!alreadyEncoded || strict && !percentEncoded(input, i, limit))) {
    // Percent encode this character.
    if (encodedCharBuffer == null) {
      encodedCharBuffer = new Buffer();
    }

    if (charset == null || charset.equals(Util.UTF_8)) {
      encodedCharBuffer.writeUtf8CodePoint(codePoint);
    } else {
      encodedCharBuffer.writeString(input, i, i + Character.charCount(codePoint), charset);
    }

    while (!encodedCharBuffer.exhausted()) {
      int b = encodedCharBuffer.readByte() & 0xff;
      out.writeByte('%');
      out.writeByte(HEX_DIGITS[(b >> 4) & 0xf]);
      out.writeByte(HEX_DIGITS[b & 0xf]);
    }
  } else {
    // This character doesn't need encoding. Just copy it over.
    out.writeUtf8CodePoint(codePoint);
  }
}
}
```

解决：

```java
FormBody.Builder.add()
```

### Header不允许特殊字符

OkHttp不的header的name和value默认是不允许有特殊字符（非ASCII码字符），否则会抛异常，看源码：

```
// Headers.Builder
class Builder {
    public Builder add(String name, String value) {
      checkName(name);
      checkValue(value, name);
      return addLenient(name, value);
    }
}
static void checkName(String name) {
    if (name == null) throw new NullPointerException("name == null");
    if (name.isEmpty()) throw new IllegalArgumentException("name is empty");
    for (int i = 0, length = name.length(); i < length; i++) {
      char c = name.charAt(i);
      if (c <= '\u0020' || c >= '\u007f') {
        throw new IllegalArgumentException(Util.format(
            "Unexpected char %#04x at %d in header name: %s", (int) c, i, name));
      }
    }
}

static void checkValue(String value, String name) {
    if (value == null) throw new NullPointerException("value for name " + name + " == null");
    for (int i = 0, length = value.length(); i < length; i++) {
      char c = value.charAt(i);
      if ((c <= '\u001f' && c != '\t') || c >= '\u007f') {
        throw new IllegalArgumentException(Util.format(
            "Unexpected char %#04x at %d in %s value: %s", (int) c, i, name, value));
      }
    }
}
```

如果允许非ASCII码的值作为value，调用`addUnsafeNonAscii(name, value)`

```java
/**
 * Add a header with the specified name and value. Does validation of header names, allowing
 * non-ASCII values.
 */
public Builder addUnsafeNonAscii(String name, String value) {
  checkName(name);
  return addLenient(name, value);
}
```

### 重定向

#### followRedirects

> 默认开启，设置是否禁止OkHttp的重定向操作，我们自己处理重定向

```java
public Builder followRedirects(boolean followRedirects) {
    
}
```

#### followSslRedirects

> 默认开启，设置是否https的重定向也自己处理

```java
public Builder followSslRedirects(boolean followProtocolRedirects) {
    
}
```
