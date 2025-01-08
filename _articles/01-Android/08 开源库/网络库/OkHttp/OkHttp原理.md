---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# OkHttp3原理

## OkHttp中的API

#### 1、OkHttpClient

设置OkHttp中通用的参数，是一个Builder模式，外观模式（门面模式，Facade）

#### 2、Request

一个HTTP请求，包含HttpUrl、method、headers、body以及一个请求tag。

#### 3、Call

Call是一个准备要执行的request，可以被取消。代表了一对request/response，不能被执行两次。

##### 4、RealCall

实际的Call对象，通过execute()和enqueue()方法来实现同步异步请求处理，并通过getResponseWithInterceptorChain()方法来执行Interceptor链条实现各种功能

#### 5、Dispatcher

封装了线程池，异步执行请求；同步的Call也会队列保存

#### 6、Interceptor

拦截器，分层实现缓存、透明压缩、网络IO等功能

##### Chain

拦截器链条

#### 7、Response

响应

## OkHttp原理

### 1、创建OkHttpClient对象

简单的创建OKHttpClient方式：

```java
OkHttpClient client = new OkHttpClient();
```

其实是封装了一个默认的Builder：

```java
// OkHttpClient
public OkHttpClient() {
    this(new Builder());
}
```

当然也可以自己通过Builder来设置参数：

```java
OkHttpClient okhttpClient = new OkHttpClient.Builder()
        .addInterceptor(new CommonParamsInterceptor(false, null))
        .build();
```

### 2、发起HTTP请求

```java
public void synchronous_get() throws Exception {
    OkHttpClient client = new OkHttpClient();

    Request request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

    Response response = client.newCall(request).execute();
    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
    String result = response.body().string();
}
```

OkHttpClient实现了`Call.Factory`接口，负责根据request创建新的Call。

```java
interface Factory {
    Call newCall(Request request);
}
```

OkHttpClient创建Call，实际上是new了一个`RealCall`。

```java
// OkHttpClient
@Override
public Call newCall(Request request) {
    return new RealCall(this, request, false /* for web socket */);
}
```

### 3.1、同步网络请求

就是`RealCall#execute()`，同步网络请求：

```java
// RealCall
@Override
public Response execute() throws IOException {
    synchronized (this) {
      if (executed) throw new IllegalStateException("Already Executed");
      executed = true;
    }
    captureCallStackTrace();
    try {
      client.dispatcher().executed(this);
      Response result = getResponseWithInterceptorChain();
      if (result == null) throw new IOException("Canceled");
      return result;
    } finally {
      client.dispatcher().finished(this);
    }
}
```

1. 检查这个call是否已经被执行了，每个call只能被执行一次，如果想要一个完全一样的call，可以利用`call#clone()`方法进行克隆
2. 利用`client.dispatcher().executed(this)`来进行实际执行，dispatcher就是`Dispatcher`类
3. 调用`getResponseWithInterceptorChain()`获取HTTP返回结果，这个会进行一系列拦截操作
4. 最后通知dispatcher自己已经执行完毕

真正发出网络请求，解析返回结果的，是`getResponseWithInterceptorChain()`：

```java
// RealCall
Response getResponseWithInterceptorChain() throws IOException {
    // Build a full stack of interceptors.
    List<Interceptor> interceptors = new ArrayList<>();
    interceptors.addAll(client.interceptors());
    interceptors.add(retryAndFollowUpInterceptor);
    interceptors.add(new BridgeInterceptor(client.cookieJar()));
    interceptors.add(new CacheInterceptor(client.internalCache()));
    interceptors.add(new ConnectInterceptor(client));
    if (!forWebSocket) {
      interceptors.addAll(client.networkInterceptors());
    }
    interceptors.add(new CallServerInterceptor(forWebSocket));

    Interceptor.Chain chain = new RealInterceptorChain(
        interceptors, null, null, null, 0, originalRequest);
    return chain.proceed(originalRequest);
}
```

可以发现`Interceptor`是OkHttp最核心的一个东西，不只是负责拦截请求进行一些额外的处理（如cookie）,**实际上它把网络请求、缓存、透明压缩等功能都统一了起来**，每一个功能都是一个Interceptor，它们连接成一个`Interceptor.Chain`，环环相扣，最终完成一次网络请求。<br />Interceptor分布:

1. interceptors<br />配置OkHttpClient配置的`interceptors`
2. RetryAndFollowUpInterceptor<br />负责失败重试以及重定向的
3. BridgeInterceptor<br />负责把用户构造的请求转换为发送到服务器的请求、把服务器返回的响应转换为用户友好的响应
4. CacheInterceptor<br />负责读取缓存直接返回、更新缓存
5. ConnectInterceptor<br />负责和服务器建立连接
6. networkInterceptors<br />配置OkHttpClient设置的`networkInterceptors`
7. CallServerInterceptor<br />负责向服务器发送请求数据、从服务读取响应数据

`责任链模式`在这个Interceptor链中得到了很好的实践。遵循链条每个Interceptor自行决定能否完成任务以及怎么完成任务（交给下一个Interceptor）。这样一来，完成网络请求这件事就彻底从RealCall类中剥离出来了。

下面看Chain的具体实现`RealInterceptorChain`：

```java
public Response proceed(Request request, StreamAllocation streamAllocation, HttpCodec httpCodec,
      RealConnection connection) throws IOException {
    if (index >= interceptors.size()) throw new AssertionError();

    calls++;

    // ...

    // 调用在这条链上的下一个Interceptor
    RealInterceptorChain next = new RealInterceptorChain(
        interceptors, streamAllocation, httpCodec, connection, index + 1, request);
    Interceptor interceptor = interceptors.get(index);
    Response response = interceptor.intercept(next); // 调用Interceptor的intercept()方法

   // ...

    return response;
}
```

首先会取第一个Interceptor执行其intercept()方法，并把该链上的下一个Interceptor封装成`Chain`带给了intercept(chain)的参数，第一个Interceptor对request进行处理，看是否处理，处理了的话就会返回一个response；如果没有处理的话，会通过chain参数，调用该链上的下一个Interceptor来执行，依次类推，直到有一个Interceptor对其进行了处理。

我们看看`ConnectInterceptor`和`CallServerInterceptor`怎么和服务器进行实际通信的。

##### ConnectInterceptor 建立连接

```java
// ConnectInterceptor
@Override
public Response intercept(Chain chain) throws IOException {
    RealInterceptorChain realChain = (RealInterceptorChain) chain;
    Request request = realChain.request();
    StreamAllocation streamAllocation = realChain.streamAllocation();

    // We need the network to satisfy this request. Possibly for validating a conditional GET.
    boolean doExtensiveHealthChecks = !request.method().equals("GET");
    HttpCodec httpCodec = streamAllocation.newStream(client, doExtensiveHealthChecks);
    RealConnection connection = streamAllocation.connection();

    return realChain.proceed(request, streamAllocation, httpCodec, connection);
}
```

实际上建立连接就是创建了一个`HttpCodec`对象，它是对HTTP协议操作的抽象，有两个实现：`Http1Codec`和`Http2Codec`，顾名思义，它们分别对应HTTP/1.1和HTTP2版本的实现。

在Http1Codec中，它利用Okio对Socket的读写操作进行封装。

而创建HttpCodec对象的过程涉及到`StreamAllocation`、`RealConnection`，概括说就是找到一个可用的RealConnection，再利用RealConnection的输入输出（BufferedSource和BufferedSink）创建HttpCodec对象。

##### CallServerInterceptor 发送和接收数据

```java
// CallServerInterceptor
@Override 
public Response intercept(Chain chain) throws IOException {
    // 一堆获取操作
    RealInterceptorChain realChain = (RealInterceptorChain) chain;
    HttpCodec httpCodec = realChain.httpStream();
    StreamAllocation streamAllocation = realChain.streamAllocation();
    RealConnection connection = (RealConnection) realChain.connection();
    Request request = realChain.request();

    long sentRequestMillis = System.currentTimeMillis();
    httpCodec.writeRequestHeaders(request);

    Response.Builder responseBuilder = null;
    if (HttpMethod.permitsRequestBody(request.method()) && request.body() != null) {
      // If there's a "Expect: 100-continue" header on the request, wait for a "HTTP/1.1 100
      // Continue" response before transmitting the request body. If we don't get that, return what
      // we did get (such as a 4xx response) without ever transmitting the request body.
      if ("100-continue".equalsIgnoreCase(request.header("Expect"))) {
        httpCodec.flushRequest();
        responseBuilder = httpCodec.readResponseHeaders(true);
      }

      if (responseBuilder == null) {
        // Write the request body if the "Expect: 100-continue" expectation was met.
        Sink requestBodyOut = httpCodec.createRequestBody(request, request.body().contentLength());
        BufferedSink bufferedRequestBody = Okio.buffer(requestBodyOut);
        request.body().writeTo(bufferedRequestBody);
        bufferedRequestBody.close();
      } else if (!connection.isMultiplexed()) {
        // If the "Expect: 100-continue" expectation wasn't met, prevent the HTTP/1 connection from
        // being reused. Otherwise we're still obligated to transmit the request body to leave the
        // connection in a consistent state.
        streamAllocation.noNewStreams();
      }
    }

    httpCodec.finishRequest();

    if (responseBuilder == null) {
      responseBuilder = httpCodec.readResponseHeaders(false);
    }

    Response response = responseBuilder
        .request(request)
        .handshake(streamAllocation.connection().handshake())
        .sentRequestAtMillis(sentRequestMillis)
        .receivedResponseAtMillis(System.currentTimeMillis())
        .build();

    int code = response.code();
    if (forWebSocket && code == 101) {
      // Connection is upgrading, but we need to ensure interceptors see a non-null response body.
      response = response.newBuilder()
          .body(Util.EMPTY_RESPONSE)
          .build();
    } else {
      response = response.newBuilder()
          .body(httpCodec.openResponseBody(response))
          .build();
    }

    if ("close".equalsIgnoreCase(response.request().header("Connection"))
        || "close".equalsIgnoreCase(response.header("Connection"))) {
      streamAllocation.noNewStreams();
    }

    if ((code == 204 || code == 205) && response.body().contentLength() > 0) {
      throw new ProtocolException(
          "HTTP " + code + " had non-zero Content-Length: " + response.body().contentLength());
    }

    return response;
}
```

1. 向服务器发送request header
2. 如果有request body，向服务器发送
3. 读取response header，构造一个Response对象
4. 如果有response body，就在3基础上加上body构造一个新的response

可以看到，核心工作都是由HttpCodec对象完成，而HttpCodec实际上利用的是Okio，而Okio实际上还是用的Socket。

### 3.2 异步网络请求

```java
client.newCall(request).enqueue(new Callback() {
        @Override
        public void onFailure(Call call, IOException e) {
        }
        @Override
        public void onResponse(Call call, Response response) throws IOException {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            String result = response.body().string();
        }
    });
```

异步网络请求调用的是`RealCall#enqueue(callback)`，

```java
// RealCall
Override
public void enqueue(Callback responseCallback) {
    synchronized (this) {
      if (executed) throw new IllegalStateException("Already Executed");
      executed = true;
    }
    captureCallStackTrace();
    client.dispatcher().enqueue(new AsyncCall(responseCallback));
}
```

调用的是Dispatcher的enqueue()方法，

```java
// Dispatcher
private int maxRequests = 64;
private int maxRequestsPerHost = 5;

/** Ready async calls in the order they'll be run. */
private final Deque<AsyncCall> readyAsyncCalls = new ArrayDeque<>();
/** Running asynchronous calls. Includes canceled calls that haven't finished yet. */
private final Deque<AsyncCall> runningAsyncCalls = new ArrayDeque<>();

synchronized void enqueue(AsyncCall call) {
    if (runningAsyncCalls.size() < maxRequests && runningCallsForHost(call) < maxRequestsPerHost) {
      runningAsyncCalls.add(call);
      executorService().execute(call);
    } else {
      readyAsyncCalls.add(call);
    }
}
```

如果异步调用请求总数超过了`maxRequests`（默认为64），并且同一个host的请求总数超过了`maxRequestsPerHost`（默认为5），就会添加到即将被执行的队列中去；<br />如果符合条件，就会通过线程池`ExecutorService`来execute()，

```java
// Dispatcher
executorService = new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60, TimeUnit.SECONDS,new SynchronousQueue<Runnable>(), Util.threadFactory("OkHttp Dispatcher", false));
```

可以发现AsyncCall是一个Runnable。

```java
// AsyncCall
final class AsyncCall extends NamedRunnable {
    private final Callback responseCallback;

    // ...
    
    @Override protected void execute() {
      boolean signalledCallback = false;
      try {
        Response response = getResponseWithInterceptorChain();
        if (retryAndFollowUpInterceptor.isCanceled()) {
          signalledCallback = true;
          responseCallback.onFailure(RealCall.this, new IOException("Canceled"));
        } else {
          signalledCallback = true;
          responseCallback.onResponse(RealCall.this, response);
        }
      } catch (IOException e) {
        if (signalledCallback) {
          // Do not signal the callback twice!
          Platform.get().log(INFO, "Callback failure for " + toLoggableString(), e);
        } else {
          responseCallback.onFailure(RealCall.this, e);
        }
      } finally {
        client.dispatcher().finished(this);
      }
    }
}

// NamedRunnable
public abstract class NamedRunnable implements Runnable {
  // ...
  @Override public final void run() {
    String oldName = Thread.currentThread().getName();
    Thread.currentThread().setName(name);
    try {
      execute();
    } finally {
      Thread.currentThread().setName(oldName);
    }
  }

  protected abstract void execute();
}
```

这里的`AsyncCall`是一个Runnable，其里面了也调用了`getResponseWithInterceptorChain()`方法，并把结果通过responseCallback传给给了上层。

所以同步和异步的请求原理一样，都是在`getResponseWithInterceptorChain()`方法中通过Interceptor的链条来实现的网络请求逻辑，而异步通过ExecutorService实现。

### 4、返回数据的获取

同步在`Call#execute()`执行后，异步在`Callback#onResponse()`回调中的Response对象中获取到响应数据了。<br />响应体被封装到了`ResponseBody`类中，注意：

1. 每个body只能被消费一次，多次消费会抛出异常
2. body必须被关闭，否则会发生资源泄露

> Response中的body特殊，服务器返回的数据可能非常大，所以必须通过数据流的方式来进行访问。

在`CallServerInterceptor`看到body生成代码：

```java
// CallServerInterceptor
int code = response.code();
if (forWebSocket && code == 101) {
  // Connection is upgrading, but we need to ensure interceptors see a non-null response body.
  response = response.newBuilder()
      .body(Util.EMPTY_RESPONSE)
      .build();
} else {
  response = response.newBuilder()
      .body(httpCodec.openResponseBody(response))
      .build();
}
```

由`HttpCodec#openResponseBody(reponse)`提供具体的HTTP协议版本的响应body，而HttpCodec则是利用Okio实现具体的数据IO操作。
