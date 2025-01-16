---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# OkHttp添加公共参数

[TOC]

## 添加到Header

```java
private Request addParams2Header(Request request, Map<String, Object> mParams) {
    Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
    Request.Builder builder = request.newBuilder();
    for (Map.Entry<String, Object> entry : entrySets) {
        builder.addHeader(entry.getKey(), String.valueOf(entry.getValue()));
    }
    return builder.build();
}
```

## 添加到请求参数

### GET（拼接到url后,queryparam）

```java
private Request addParams2UrlQueryString(Request request, Map<String, Object> mParams) {
    HttpUrl httpUrl = request.url();
    HttpUrl.Builder builder = httpUrl.newBuilder();
    Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
    for (Map.Entry<String, Object> entry : entrySets) {
        builder.addQueryParameter(entry.getKey(), String.valueOf(entry.getValue()));
    }
    return request.newBuilder()
            .url(builder.build())
            .build();
}
```

### POST

#### 表单(FormBody  application/x-www-form-urlencoded)

```java
private Request addParams2FormBody(Request request, Map<String, Object> mParams) {

    RequestBody requestBody = request.body();
    if (requestBody instanceof FormBody) {
        FormBody formBody = (FormBody) requestBody;
        int size = formBody.size();

        TreeMap<String, String> params = new TreeMap<>();
        for (int i = 0; i < size; i++) {
            String name = formBody.encodedName(i);
            String value = formBody.encodedValue(i);
            params.put(name, value);
        }


        // add mParams to params
        Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
        for (Map.Entry<String, Object> entry : entrySets) {
            params.put(entry.getKey(), String.valueOf(entry.getValue()));
        }

        // convert params to new formBody
        FormBody.Builder builder = new FormBody.Builder();

        Set<Map.Entry<String, String>> newEnterySet = params.entrySet();
        for (Map.Entry<String, String> entry : newEnterySet) {
            builder.add(entry.getKey(), entry.getValue());
        }

        // to new request
        switch (request.method().toUpperCase()) {
            case Method.POST:
                return request.newBuilder().post(builder.build()).build();
            case Method.PUT:
                return request.newBuilder().put(builder.build()).build();
            case Method.DELETE:
                return request.newBuilder().delete(builder.build()).build();
            case Method.PATCH:
                return request.newBuilder().patch(builder.build()).build();
            default:
                break;
        }
        return request;
    } else {
        LogUtils.w(TAG, "RequestBody => " + request.body().getClass().getCanonicalName() + " Not Support Yet!");
    }
    return request;
}
```

#### JSON(application/json)

> 先取出原先的参数，再拼接

```java
private fun addParams2FormBody(request: Request, mParams: Map<String, Any>): Request {
    val requestBody = request.body()
    val buffer = Buffer()
    requestBody?.writeTo(buffer)
    var charset = Charset.forName("UTF-8")
    val contentType = requestBody?.contentType()
    if (contentType != null) {
        charset = contentType.charset(charset)
        if (charset != null) {
            // 读取原请求参数内容
            val requestParams = buffer.readString(charset)
            try {
                // 重新拼凑请求体
                val jsonObject = JSONObject(requestParams)
                for (entry in mParams.entries) {
                    jsonObject.put(entry.key, entry.value)
                }
                val newBody = RequestBody.create(requestBody.contentType(), jsonObject.toString())
                return request.newBuilder().post(newBody).build()
            } catch (e: JSONException) {
                e.printStackTrace()
            }
        }
    }
    return request
}
```

## GET/POST(表单)

> 不支持post application/json

```java
/**
 * 添加公共参数 <br/>
 *
 * @author zengfansheng <br/>
 * @time 2018/8/18 17:08 <br/>
 * @since v1.0
 */
public final class HttpCommonParamsInterceptor implements Interceptor {

    private static final String TAG = "inews.netv2";

    private Builder.Type mType;

    private Map<String, Object> mParams;

    private NeedParam mNeedParam;

    private HttpCommonParamsInterceptor() {
    }

    public HttpCommonParamsInterceptor configNeedParam(NeedParam needParam) {
        this.mNeedParam = needParam;
        return this;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {

        Request request = chain.request();

        if (mNeedParam != null) {
            boolean noNeedCommon = mNeedParam.noNeedCommon(request, mParams);
            if (noNeedCommon) {
                return chain.proceed(request);
            }
        }

        switch (mType) {
            case HEADER:
                request = addParams2Header(request, mParams);
                break;
            case QUERY_STRING:
                request = addParams2UrlQueryString(request, mParams);
                break;
            case FORM:
                request = addParams2FormBody(request, mParams);
                break;
            case AUTO: {
                request = autoParams(request, mParams);
            }
            break;
            default:
                throw new IllegalArgumentException("unknown type");
        }
        return chain.proceed(request);
    }

    private Request autoParams(@NonNull Request request, Map<String, Object> parmas) {
        String method = request.method();
        switch (method.toUpperCase()) {
            case Method.GET:
            case Method.HEAD:
            case Method.OPTIONS:
                request = addParams2UrlQueryString(request, parmas);
                break;
            case Method.POST:
            case Method.PUT:
            case Method.DELETE:
            case Method.PATCH:
                request = addParams2FormBody(request, parmas);
                break;
            default:
                break;
        }
        return request;
    }

    private Request addParams2Header(Request request, Map<String, Object> mParams) {
        Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
        Request.Builder builder = request.newBuilder();
        for (Map.Entry<String, Object> entry : entrySets) {
            builder.addHeader(entry.getKey(), String.valueOf(entry.getValue()));
        }
        return builder.build();
    }

    private Request addParams2UrlQueryString(Request request, Map<String, Object> mParams) {
        HttpUrl httpUrl = request.url();
        HttpUrl.Builder builder = httpUrl.newBuilder();
        Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
        for (Map.Entry<String, Object> entry : entrySets) {
            builder.addQueryParameter(entry.getKey(), String.valueOf(entry.getValue()));
        }
        return request.newBuilder()
                .url(builder.build())
                .build();
    }

    private Request addParams2FormBody(Request request, Map<String, Object> mParams) {

        RequestBody requestBody = request.body();
        if (requestBody instanceof FormBody) {
            FormBody formBody = (FormBody) requestBody;
            int size = formBody.size();

            TreeMap<String, String> params = new TreeMap<>();
            for (int i = 0; i < size; i++) {
                String name = formBody.encodedName(i);
                String value = formBody.encodedValue(i);
                params.put(name, value);
            }


            // add mParams to params
            Set<Map.Entry<String, Object>> entrySets = mParams.entrySet();
            for (Map.Entry<String, Object> entry : entrySets) {
                params.put(entry.getKey(), String.valueOf(entry.getValue()));
            }

            // convert params to new formBody
            FormBody.Builder builder = new FormBody.Builder();

            Set<Map.Entry<String, String>> newEnterySet = params.entrySet();
            for (Map.Entry<String, String> entry : newEnterySet) {
                builder.add(entry.getKey(), entry.getValue());
            }

            // to new request
            switch (request.method().toUpperCase()) {
                case Method.POST:
                    return request.newBuilder().post(builder.build()).build();
                case Method.PUT:
                    return request.newBuilder().put(builder.build()).build();
                case Method.DELETE:
                    return request.newBuilder().delete(builder.build()).build();
                case Method.PATCH:
                    return request.newBuilder().patch(builder.build()).build();
                default:
                    break;
            }
            return request;
        } else {
            LogUtils.w(TAG, "RequestBody => " + request.body().getClass().getCanonicalName() + " Not Support Yet!");
        }
        return request;
    }

    public static class Builder {

        private Type mType;

        private Map<String, Object> mParams;

        public enum Type {
            /**
             * add params to header
             */
            HEADER,

            /**
             * add params to query string with urlencoded
             */
            QUERY_STRING,

            /**
             * add params to body according to form type
             */
            FORM,

            /**
             * only works for http GET & POST
             */
            AUTO,
        }

        public Builder() {
            mParams = new TreeMap<>();
        }


        public Builder type(Type type) {
            mType = type;
            return this;
        }

        public Builder params(String key, String value) {
            mParams.put(key, value);
            return this;
        }

        public Builder params(String key, Integer value) {
            mParams.put(key, value);
            return this;
        }

        public Builder params(String key, Double value) {
            mParams.put(key, value);
            return this;
        }

        public Builder params(Map<String, ? extends Object> params) {
            if (params != null) {
                this.mParams.putAll(params);
            }
            return this;
        }

        public HttpCommonParamsInterceptor build() {
            if (mType == null) {
                throw new IllegalArgumentException("must set type");
            }
            HttpCommonParamsInterceptor interceptor = new HttpCommonParamsInterceptor();
            interceptor.mType = mType;
            interceptor.mParams = mParams;
            return interceptor;
        }
    }

    public interface NeedParam {
        /**
         * 该request是否需要公共参数
         *
         * @param request Request
         * @return true表示不需要公共参数，false表示需要公共参数。默认false
         */
        boolean noNeedCommon(@NonNull Request request, Map<String, Object> mParams);
    }

    @StringDef({
            Method.GET,
            Method.HEAD,
            Method.OPTIONS,
            Method.POST,
            Method.PUT,
            Method.DELETE,
            Method.PATCH,
    })
    @Retention(RetentionPolicy.SOURCE)
    @Documented
    @interface Method {
        String GET = "GET";
        String HEAD = "HEAD";
        String OPTIONS = "OPTIONS";
        String POST = "POST";
        String PUT = "PUT";
        String DELETE = "DELETE";
        String PATCH = "PATCH";
    }

}
```

## Retrofit方式

1. okhttp 拦截器
2. Converter

> 可减少json解析，GZIP解压操作

- Retrofit统一添加post请求的默认参数<br /><https://juejin.im/post/5ac068a551882577b45f2775>

# OkHttp拦截器

## OkHttp3拦截器常用功能

- Token拦截器<br />TokenInterceptor
- 日志打印拦截器<br />HttpLoggingInterceptor
- 公共参数拦截器<br />HttpCommonParamsInterceptor
- 数据的加密与解密拦截器<br />AESInterceptor
- 失败重试拦截器，隔几秒重试一次<br />RetryInerceptor，重试多少次，在抓包Charles就会有几次请求记录
- OkHttp 拦截器的一些骚操作<br /><https://juejin.im/post/5afc1706518825426f30f6ec>

### Token拦截器

#### Token过期自动续期

#### Token过期/踢下线

1. response.body().string()只能读取一次问题处理

```java
public class RefreshTokenResponse {
    public static String getResponseBody(ResponseBody responseBody) throws IOException {
        BufferedSource source = responseBody.source();
        // 获取全部body的数据
        source.request(Long.MAX_VALUE);
        Buffer buffer = source.buffer();
        // 在读取缓存去之前clone数据，解决response.body().string()只能读取一次的问题
        String responseBodyString = buffer.clone().readString(Charset.forName("UTF-8"));
        return responseBodyString;
    }
}
```

2. 踢下线时要回到登录页，并把之前的页面都销毁

```kotlin
private fun tokenExpire() {
    UserCenterManager.logout(GlobalContext.getAppContext())
    ARouter.getInstance()
            .build(ARouterConstants.Login.ROUTER_PATH_ACTIVITY_LOGIN)
            .withFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
            .navigation()
}
```

完整代码：

```kotlin
@Deprecated(message = "多了json解析和gzip解压", replaceWith = ReplaceWith("用GsonResponseBodyConverter替代"))
class TokenInterceptor : Interceptor {

    companion object {
        private const val TAG = "net.token"
        private const val ERROR_TOKEN_EXPIRE = -2
        private const val ERROR_LOGIN_OTHER_DEVICE = -4
        private const val ERROR_USER_BANNED = -5
        private val DEFAULT_UTF8 = Charset.forName("UTF-8")
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val response = chain.proceed(request)

        val responseBody = response.body() ?: return response

        val source = responseBody.source()
        source.request(Long.MAX_VALUE) // Buffer the entire body.
        var buffer = source.buffer()
        var charset = DEFAULT_UTF8
        val contentType = responseBody.contentType()
        if (contentType != null) {
            try {
                charset = contentType.charset(DEFAULT_UTF8)
            } catch (e: UnsupportedCharsetException) {
                return response
            }
        }

        if ("gzip".equals(response.headers()["Content-Encoding"], ignoreCase = true)) {
            GzipSource(buffer.clone()).use { gzippedResponseBody ->
                buffer = Buffer()
                buffer.writeAll(gzippedResponseBody)
            }
        }

        if (!isPlaintext(buffer)) {
            return response
        }

        val contentLength = responseBody.contentLength()
        if (contentLength < 0L) {
            return response
        }

        val result = buffer.clone().readString(charset)
        LogUtils.v(TAG, "${anchor("intercept")}response.url()=${response.request().url()}，" +
                "response.body()=$result")
        try {
            val json = JSONObject(result)
            when (json.optInt("err")) {
                ERROR_TOKEN_EXPIRE, ERROR_LOGIN_OTHER_DEVICE, ERROR_USER_BANNED -> {
                    val errMsg = json.optString("err_msg")
                    ToastUtils.showLong(errMsg)
                    gotoLoginPage()
                    LogUtils.e(TAG, "${anchor("intercept")}token过期回到登录页面，" +
                            "errCode=${json.optInt("err")}，errMsg=$errMsg")
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return response
    }

    private fun gotoLoginPage() {
        UserCenterManager.logout(GlobalContext.getAppContext())
        ARouter.getInstance()
                .build(ARouterConstants.Login.ROUTER_PATH_ACTIVITY_LOGIN)
                .withFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
                .navigation()
    }

    @Throws(EOFException::class)
    private fun isPlaintext(buffer: Buffer): Boolean {
        try {
            val prefix = Buffer()
            val byteCount = (if (buffer.size() < 64) buffer.size() else 64).toLong()
            buffer.copyTo(prefix, 0, byteCount)
            for (i in 0..15) {
                if (prefix.exhausted()) {
                    break
                }
                val codePoint = prefix.readUtf8CodePoint()
                if (Character.isISOControl(codePoint) && !Character.isWhitespace(codePoint)) {
                    return false
                }
            }
            return true
        } catch (e: EOFException) {
            return false // Truncated UTF-8 sequence.
        }
    }

}
```

> NOTE: 用Retrofit的Converter做更好，这样可以避免多次json解析和gzip解压

- [ ] Ref<br />OKHTTP系列（十一）---自定义拦截器之登录验证再请求拦截器（刷新token再请求）<br /><https://blog.csdn.net/freak_csh/article/details/95531202>
- [ ] Okhttp拦截器统一异常处理并多次读取response.body().string()<br /><https://blog.csdn.net/a624806998/article/details/73863606>

### LoggingInterceptor

<https://github.com/ihsanbal/LoggingInterceptor>

An OkHttp interceptor which pretty logs request and response data.

# OkHttp cookie

# OkHttp3 Https

## 自签证书

### 创建服务端SSL自签名证书

#### keytool是什么

keytool：`keytool`为Java原生自带，安装java后不需要再进行安装，作为密钥和证书管理工具，方便用户能够管理自己的公钥/私钥及证书，用于认证服务。

keystore：keytool将密钥（key）和证书（certificates）存储在keystore文件中，

keytool相关命令

```
-alias 产生别名
-keystore 指定密钥库的名称(就像数据库一样的证书库，可以有很多个证书，cacerts这个文件是jre自带的，你也可以使用其它文件名字，如果没有这个文件名字，它会创建这样一个)
-storepass 指定密钥库的密码
-keypass 指定别名条目的密码
-list 显示密钥库中的证书信息
-v 显示密钥库中的证书详细信息
-export 将别名指定的证书导出到文件
-file 参数指定导出到文件的文件名
-delete 删除密钥库中某条目
-import 将已签名数字证书导入密钥库
-keypasswd 修改密钥库中指定条目口令
-dname 指定证书拥有者信息
-keyalg 指定密钥的算法
-validity 指定创建的证书有效期多少天
-keysize 指定密钥长度
```

#### 生成秘钥库

1. 生成密钥库

```
keytool -genkey -alias my_server -keyalg RSA -keystore my_server.jks -validity 3600 -storepass 123456
```

![](https://note.youdao.com/yws/res/99759/901BF28629094F11B90B2451CE40033E#id=dmprf&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />参数说明：

```
-genkey： 表示生成密钥对（公钥和私钥）
-keystore：每个 keytool 命令都有一个 -keystore 选项，用于指定 keytool 管理的密钥仓库的永久密钥仓库文件名称及其位置。如果不指定 -keystore 选项，则缺省密钥仓库将是宿主目录中（由系统属性的"user.home"决定）名为 .keystore 的文件。如果该文件并不存在，则它将被创建。
-alias：指定密钥条目的别名，该别名是公开的。
-keyalg：指定密钥的算法，如：RSA、DSA（如果不指定默认采用DSA）)
-validity：指定创建的证书有效期多少天
-storepass 密钥库密码
```

注意最后需要输入密码123456。执行成功之后，就可以在当前目录看到一个新生成的服务端SSL证书：`my_server.jks` 。

2. 查看证书

```
keytool -list -v -keystore my_server.jks -storepass 123456
```

可以查看证书的基本信息、过期时间、指纹等信息

3. 导出证书

```
keytool -export -alias my_server -keystore ./my_server.jks -file ./test.crt -storepass 123456
```

![](https://note.youdao.com/yws/res/99792/D453865DC3C447738E73303B0D37ABDE#id=Ifq7O&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />预览看看test.crt内容：<br />![](https://note.youdao.com/yws/res/99796/3EF48856404B4030B59CB080D77CCB6F#id=XNePb&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### Tomcat配置SSL证书

下载好Tomcat并启动成功之后，接下来就需要配置SSL证书了。进入`Tomcat/conf/`目录，编辑 server.xml 配置文件，在 `<Service>` 标签中添加如下 `<Connector>` 标签：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server>
  <Service>
   ...
    <Connector
    SSLEnabled="true"
    acceptCount="100"
    clientAuth="false"
    disableUploadTimeout="true"
    enableLookups="true"
    keystoreFile="/Users/zengfansheng/Software/apache-tomcat-8.5.27/conf/my_server.jks"
    keystorePass="123456"
    maxSpareThreads="75"
    maxThreads="200"
    minSpareThreads="5"
    port="8181"
    protocol="org.apache.coyote.http11.Http11NioProtocol"
    scheme="https"
    secure="true"
    sslProtocol="TLS" />
  </Service>
</Server>
```

添加以上配置之后，重新在浏览器中输入 `https://localhost:8181/` 就会看到如下warning信息：<br />![](https://note.youdao.com/yws/res/99784/D41EE053BF234F9FBC70ACCCD7913888#id=bYFji&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />看到上述warning信息，就说明服务端的SSL证书配置成功了。

### Android端导入SSL证书

#### 1. 导出Android端SSL证书

使用如下命令，从上面创建的服务端证书server.jks中导出客户端证书：

```
keytool -export -alias my_server -keystore ./my_server.jks -file ./test.crt -storepass 123456
```

上述命令执行成功之后，将生成`test.crt`证书文件，这个就是Android端使用的自签名SSL证书。

#### 2. 将证书导入Android项目

测试代码：

```java
public void getBaidu(View view) {
    Request request = new Request.Builder()
            .url(BAIDU_URL)
            .build();
    mOkHttpClient.newCall(request).enqueue(new Callback() {
        @Override
        public void onFailure(Call call, IOException e) {
            e.printStackTrace();
            String log = "getBaidu onFailure: " + e.getMessage();
            Log.w("hacket", log);
            runOnUiThread(() -> tvResult.setText(log));
        }
        @Override
        public void onResponse(Call call, Response response) throws IOException {
            String log = "getBaidu response: " + response.body().string();
            Log.i("hacket", log);
            runOnUiThread(() -> tvResult.setText(log));
        }
    });
}
public void getTomcat(View view) {
    Request request = new Request.Builder()
            .url(TOMCAT_URL)
            .build();
    mOkHttpClient.newCall(request).enqueue(new Callback() {
        @Override
        public void onFailure(Call call, IOException e) {
            e.printStackTrace();
            String log = "getTomcat onFailure: " + e.getMessage();
            Log.w("hacket", log);
            runOnUiThread(() -> tvResult.setText(log));
        }
        @Override
        public void onResponse(Call call, Response response) throws IOException {
            String log = "getTomcat response: " + response.body().string();
            Log.i("hacket", log);
            runOnUiThread(() -> tvResult.setText(log));
        }
    });
}
```

Baidu可以获取到，Tomcat获取不到

```
getBaidu response: <!DOCTYPE html>
    <!--STATUS OK--><html> 
    ...
    
getTomcat onFailure: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.
```

可以看出getTomcat请求报错，原因是客户端验证服务端SSL证书失败。最简单的办法就是强制客户端让不检查所有的SSL证书

##### 强制客户端让不检查所有的SSL证书

```java
/**
 * 创建信任所有证书的TrustManager
 */
private static X509TrustManager createTrustAllTrustManager() {
    return new X509TrustManager() {
        @Override
        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {

        }

        @Override
        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {

        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    };
}

// 实现信任所有域名的HostnameVerifier接口
private static class TrustAllHostnameVerifier implements HostnameVerifier {
    @Override
    public boolean verify(String hostname, SSLSession session) {
        //域名校验，默认都通过
        return true;
    }
}
private static SSLSocketFactory createSSLSocketFactory(TrustManager trustManager) {
    SSLSocketFactory ssfFactory = null;
    try {
        SSLContext sc = SSLContext.getInstance("TLS");
        sc.init(null, new TrustManager[]{trustManager}, new SecureRandom());
        ssfFactory = sc.getSocketFactory();
    } catch (Exception e) {
        e.printStackTrace();
    }
    return ssfFactory;
}
private static OkHttpClient createSSLClient(X509TrustManager x509TrustManager) {
    OkHttpClient.Builder builder = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .sslSocketFactory(createSSLSocketFactory(x509TrustManager), x509TrustManager)
            .hostnameVerifier(new TrustAllHostnameVerifier());
    return builder.build();
}

// 创建OkHttpClient
OkHttpClient mOkHttpClient = createSSLClient(createTrustAllTrustManager());
```

上面自定义X509TrustManager中的checkClientTreusted和checkServerTrusted都是空实现，也就是不检查客户端和服务端的SSL证书信息。另外在自定义HostnameVerifier中的verify方法返回true，默认信任所有域名，否则返回false在请求时会报如下错误：

```
getTomcat onFailure: Hostname 172.16.1.197 not verified:
        certificate: sha256/ffj+yQYUZyzZ+47GoERUyD1QaoMQIq5sxy86ZNMiZAc=
        DN: CN=x,OU=x,O=x,L=x,ST=x,C=x
        subjectAltNames: []
        
getBaidu onFailure: Hostname www.baidu.com not verified:
        certificate: sha256//Zym5rS1SySuo+9dunLEq90wqQ+PnoI9HWGwyZFK/BM=
        DN: CN=baidu.com,O=Beijing Baidu Netcom Science Technology Co.\, Ltd,OU=service operation department,L=beijing,ST=beijing,C=CN
        subjectAltNames: [baidu.com, click.hm.baidu.com, cm.pos.baidu.com, log.hm.baidu.com, update.pan.baidu.com, wn.pos.baidu.com, *.91.com, *.aipage.cn, *.aipage.com, *.apollo.auto, *.baidu.com, *.baidubce.com, *.baiducontent.com, *.baidupcs.com, *.baidustatic.com, *.baifubao.com, *.bce.baidu.com, *.bcehost.com, *.bdimg.com, *.bdstatic.com, *.bdtjrcv.com, *.bj.baidubce.com, *.chuanke.com, *.cloud.baidu.com, *.dlnel.com, *.dlnel.org, *.dueros.baidu.com, *.eyun.baidu.com, *.fanyi.baidu.com, *.gz.baidubce.com, *.hao123.baidu.com, *.hao123.com, *.hao222.com, *.haokan.com, *.im.baidu.com, *.map.baidu.com, *.mbd.baidu.com, *.mipcdn.com, *.news.baidu.com, *.nuomi.com, *.pae.baidu.com, *.safe.baidu.com, *.smartapps.cn, *.su.baidu.com, *.trustgo.com, *.vd.bdstatic.com, *.xueshu.baidu.com, apollo.auto, baifubao.com, dwz.cn, mct.y.nuomi.com, www.baidu.cn, www.baidu.com.cn]
```

**缺点：**<br />这种方式存在极大的安全漏洞。因为并没有做任何SSL证书的校验，很容易被`MITM(Man In The Middle)攻击`。<br />比较好的优化方式当然是在客户端使用自签名SSL证书，验证服务器的身份合法之后，再进行后续的数据传输操作

##### 只信任自签名证书

1. 将`test.crt`保存在assets文件夹中
2. 保存好后，通过如下方式将证书转换为InputStream格式：

```java
private InputStream getInputStreamFromAsset(){
    InputStream inputStream = null;
    try {
        inputStream = getAssets().open("my_clent.cer");
    } catch (IOException e) {
        e.printStackTrace();
    }
    return inputStream;
}
```

3. 创建只信任自签名证书的X509TrustManager

```java
private static SSLSocketFactory createSSLSocketFactory(TrustManager trustManager) {
    SSLSocketFactory ssfFactory = null;
    try {
        SSLContext sc = SSLContext.getInstance("TLS");
        sc.init(null, new TrustManager[]{trustManager}, new SecureRandom());
        ssfFactory = sc.getSocketFactory();
    } catch (Exception e) {
        e.printStackTrace();
    }
    return ssfFactory;
}
// 实现信任所有域名的HostnameVerifier接口
private static class TrustAllHostnameVerifier implements HostnameVerifier {
    @Override
    public boolean verify(String hostname, SSLSession session) {
        // 域名校验，默认都通过
        return true;
    }
}
private static OkHttpClient createSSLClient(X509TrustManager x509TrustManager) {
    OkHttpClient.Builder builder = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .sslSocketFactory(createSSLSocketFactory(x509TrustManager), x509TrustManager)
            .hostnameVerifier(new TrustAllHostnameVerifier());
    return builder.build();
}
private static InputStream getInputStreamFromAsset(Context context) {
    InputStream inputStream = null;
    try {
        inputStream = context.getAssets().open("test.crt");
    } catch (IOException e) {
        e.printStackTrace();
    }
    return inputStream;
}

// 创建只信任指定证书的TrustManager，将自签名证书保存到Java对象KeyStore中，并最终创建只信任自签名证书的X509TrustManager对象。重新将此对象传给上文中的createSSLClient方法后，就是一个加载自签名SSL证书的OkHttpClient对象了
@Nullable
private static X509TrustManager createTrustCustomTrustManager(InputStream inputStream) {
    try {
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null);

        Certificate certificate = certificateFactory.generateCertificate(inputStream);
        // 将证书放入keystore中
        String certificateAlias = "ca";
        keyStore.setCertificateEntry(certificateAlias, certificate);
        if (inputStream != null) {
            inputStream.close();
        }

        TrustManagerFactory trustManagerFactory = TrustManagerFactory.
                getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(keyStore);
        TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();

        if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
            throw new IllegalStateException("Unexpected default trust managers:"
                    + Arrays.toString(trustManagers));
        }
        return (X509TrustManager) trustManagers[0];
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
public static OkHttpClient getCustomCertOkhttpClient(Context context) {
    return createSSLClient(createTrustCustomTrustManager(getInputStreamFromAsset(context)));
}
```

4. 再次执行getBaidu和getTomcat方法，执行结果如下：

```
getBaidu onFailure: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.

getTomcat response: 

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Apache Tomcat/8.5.72</title>
            <link href="favicon.ico" rel="icon" type="image/x-icon" />
            <link href="tomcat.css" rel="stylesheet" type="text/css" />
        </head>

        <body>
        ...
        </body>
    </html>
```

> 以上结果显示获取baidu数据失败，而获取Tomcat数据成功。log显示结果正好跟最初的默认结果相反，这是因为当前所有的https请求都使用自签名证书去校验服务器身份。因为Tomcat配置了本地证书所以能够成功验明正身；但是baidu并没有配置我们的自签名证书，也就无法正确验明身份了。

**缺点：**<br />只能是自己公司的网站可以用了，其他外部的网站都请求不了

##### 支持自签名证书和系统证书

```java
/**
 * 创建信任系统自带证书的TrustManager
 */
private static X509TrustManager getSystemTrustManager() throws NoSuchAlgorithmException, KeyStoreException {
    TrustManagerFactory tmf = TrustManagerFactory
            .getInstance(TrustManagerFactory.getDefaultAlgorithm());

    tmf.init((KeyStore) null);
    for (TrustManager tm : tmf.getTrustManagers()) {
        if (tm instanceof X509TrustManager) {
            return (X509TrustManager) tm;
        }
    }
    return null;
}

/**
 * 创建既信任自签名证书又信任系统自带证书的TrustManager
 */
private static X509TrustManager createTrustCustomAndDefaultTrustManager(InputStream inputStream) {
    try {
        // 获取信任系统自带证书的TrustManager
        final X509TrustManager systemTrustManager = getSystemTrustManager();
        // 获取信任自签名证书的TrustManager
        final X509TrustManager selfTrustManager = createTrustCustomTrustManager(inputStream);

        return new X509TrustManager() {
            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {
                systemTrustManager.checkClientTrusted(chain, authType);
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {
                try {
                    // 默认使用信任自签名证书的TrustManager验证服务端身份
                    selfTrustManager.checkServerTrusted(chain, authType);
                } catch (java.security.cert.CertificateException e) {
                    // 此处使用系统自带SSL证书验证服务端身份
                    systemTrustManager.checkServerTrusted(chain, authType);
                }
            }

            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return systemTrustManager.getAcceptedIssuers();
            }
        };
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
public static OkHttpClient getCustomCertAndSystemCertOkhttpClient(Context context) {
    return createSSLClient(createTrustCustomAndDefaultTrustManager(getInputStreamFromAsset(context)));
}
```

可以看出在自定义X509TrustManager的checkServerTrusted方法中，先使用信任自签名证书的TrustManager验证服务端，如果没有验证成功，则继续使用系统默认TrustManager来继续验证。<br />通过以上设置之后，getBaidu 和 getTomcat这2个方法都能正确获取数据了。

## 证书链

## okhttp 证书Ref

-  [ ] Android使用SSL自签名证书<br /><https://mp.weixin.qq.com/s/dwazWThYmX9m2rY4A421MA>
-  [x] [Android使用SSL自签名证书](https://mp.weixin.qq.com/s?__biz=MzU3Mjc5NjAzMw==&mid=2247488507&idx=1&sn=b3da93d67e32ac62acba328371ee794b&chksm=fcca2e15cbbda703d9baf93a9ee3fd0069b119799dd5f4cf3402ef13ae526f3cd02d9ca6e2b8&cur_album_id=1644540075281563650&scene=190#rd)

# OkHttp dns & HttpDNS

## HttpDNS

HttpDNS其实也是对DNS解析的另一种实现方式，只是将域名解析的协议由DNS协议换成了Http协议，并不复杂。使用HTTP协议向D+服务器的80端口进行请求，代替传统的DNS协议向DNS服务器的53端口进行请求，绕开了运营商的Local DNS，从而避免了使用运营商Local DNS造成的劫持和跨网问题。

接入HttpDNS也是很简单的，使用普通DNS时，客户端发送网络请求时，就直接发送出去了，有底层网络框架进行域名解析。当接入HttpDNS时，就需要自己发送域名解析的HTTP请求，当客户端拿到域名对应的IP之后，就向直接往此IP发送业务协议请求。

这样，就再也不用再考虑传统DNS解析会带来的那些问题了，因为是使用HTTP协议，所以不用担心域名劫持问题了；而且，如果选择好的DNS服务器提供商，还保证将用户引导的访问速度最快的IDC节点上。

## OkHttp接入HttpDNS

七牛的dns

```
compile 'com.qiniu:happy-dns:0.2.13'
```

## qiubaihttpdns

在阿里云和腾讯DNS随机取一个用

## 公共DNS

### 腾讯公共DNS

腾讯公共DNS，节点很多，DNSPod Public DNS 同时支持 DoH 与 DoT

```
119.29.29.29
```

<https://www.dnspod.cn/Products/Public.DNS>

### 阿里云公共DNS

```
223.5.5.5
223.6.6.6
```

<http://www.alidns.com>

### Google DNS

```
8.8.8.8
8.8.4.4
```

国内不能用，国外推荐用

## 问题

### OkHttp解析dns超时时间无法设置的问题

使用OkHttp，设备切换路由后，访问网络出现长时间无响应，很久以后才抛出UnknownHostException，这明显不是我们想要的，我们设置的connectTimeout属性似乎对dns的解析不起作用

解决：

```
public class XDns implements Dns {
    private long timeout;

    public XDns(long timeout) {
        this.timeout = timeout;
    }

    @Override
    public List<InetAddress> lookup(final String hostname) throws UnknownHostException {
        if (hostname == null) {
            throw new UnknownHostException("hostname == null");
        } else {
            try {
                FutureTask<List<InetAddress>> task = new FutureTask<>(
                        new Callable<List<InetAddress>>() {
                            @Override
                            public List<InetAddress> call() throws Exception {
                                return Arrays.asList(InetAddress.getAllByName(hostname));
                            }
                        });
                new Thread(task).start();
                return task.get(timeout, TimeUnit.MILLISECONDS);
            } catch (Exception var4) {
                UnknownHostException unknownHostException =
                        new UnknownHostException("Broken system behaviour for dns lookup of " + hostname);
                unknownHostException.initCause(var4);
                throw unknownHostException;
            }
        }
    }
}
```

# Android Http压缩之Gzip、zlib、brotli

<br />支持三个压缩方式 gzip,zlib brotli

## GZIP压缩

GZIP是网站压缩加速的一种技术，对于开启后可以加快我们网站的打开速度，原理是经过服务器压缩，客户端浏览器快速解压的原理，可以大大减少了网站的流量。

GZIP最早由Jean-loup Gailly和Mark Adler创建，用于UNIX系统的文件压缩。我们在Linux中经常会用到后缀为.gz的文件，它们就是GZIP格式的。现今已经成为Internet 上使用非常普遍的一种数据压缩格式，或者说一种文件格式。HTTP协议上的GZIP编码是一种用来改进WEB应用程序性能的技术。大流量的WEB站点常常使用GZIP压缩技术来让用户感受更快的速度。这一般是指WWW服务器中安装的一个功能,当有人来访问这个服务器中的网站时,服务器中的这个功能就将网页内容压缩后传输到来访的电脑浏览器中显示出来.一般对纯文本内容可压缩到原大小的40％.这样传输就快了,效果就是你点击网址后会很快的显示出来.当然这也会增加服务器的负载. 一般服务器中都安装有这个功能模块的。

GZIP开启以后会将输出到用户浏览器的数据进行压缩的处理，这样就会减小通过网络传输的数据量，提高浏览的速度。

### 文本

一般对于API请求需带上GZip压缩，因为API返回数据大都是JSon串之类字符串，GZIP压缩后内容大小大幅降低

### 二进制

二进制GZIP压缩效果有限。在mashi中，https接口都是接口加密的，加密后的是一串二进制数据，此时再开启gzip压缩效果不明显，所以改为后端关闭自动gzip，后端先gzip压缩后再加密，客户端需要先解密后收到gzip解压。

## GZIP通信流程

客户端与服务器通信过程中，如果服务器支持，HTTP gzip压缩是如何实现的？<br />![](http://note.youdao.com/yws/res/40719/04B22DBDB18E44179E66B0F8415857A0#id=FYFMv&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687885600851-5044e37c-91cf-47af-bd2a-85dc9cbd1456.png#averageHue=%23fbfbfb&clientId=ue6d458d1-b036-4&from=paste&height=561&id=u76524230&originHeight=841&originWidth=1522&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=152021&status=done&style=none&taskId=u9db687a2-6fd4-4e15-9478-bcf8a9dc424&title=&width=1014.6666666666666)<br />request header中声明`Accept-Encoding:gzip`，告知服务器客户端接受gzip的数据。<br />服务器支持的情况下，返回gzip后的response body，同时加入以下header：

1. `Content-Encoding:gzip`：表明body是gzip过的数据
2. `Content-Length:117`：表示body gzip压缩后的数据大小，便于客户端使用。或 `Transfer-Encoding: chunked`：分块传输编码

## GZIP在Android各网络框架中表现

### OkHttp

看`BridgeInterceptor.java`

```java
// If we add an "Accept-Encoding: gzip" header field we're responsible for also decompressing
// the transfer stream.
boolean transparentGzip = false;
if (userRequest.header("Accept-Encoding") == null && userRequest.header("Range") == null) {
  transparentGzip = true;
  requestBuilder.header("Accept-Encoding", "gzip");
}
```

如果header中没有`Accept-Encoding`，默认自动添加 ，且标记变量`transparentGzip`为true。

```java
if (transparentGzip
    && "gzip".equalsIgnoreCase(networkResponse.header("Content-Encoding"))
    && HttpHeaders.hasBody(networkResponse)) {
  GzipSource responseBody = new GzipSource(networkResponse.body().source());
  Headers strippedHeaders = networkResponse.headers().newBuilder()
      .removeAll("Content-Encoding")
      .removeAll("Content-Length")
      .build();
  responseBuilder.headers(strippedHeaders);
  String contentType = networkResponse.header("Content-Type");
  responseBuilder.body(new RealResponseBody(contentType, -1L, Okio.buffer(responseBody)));
}
```

针对返回结果，如果同时满足以下三个条件：

1. transparentGzip为true，即之前自动添加了Accept-Encoding（没有手动添加`Accept-Encoding`和`Range`请求头）
2. header中标明了Content-Encoding为gzip
3. 有body

移除`Content-Encoding`、`Content-Length`，并对结果进行**解压缩**。

小结：

1. 开发者没有添加Accept-Encoding时，自动添加Accept-Encoding: gzip
2. 自动添加的request，response支持自动解压
3. 手动添加不负责解压缩
4. 自动解压时移除Content-Length，所以上层Java代码想要contentLength时为-1
5. 自动解压时移除 Content-Encoding
6. 自动解压时，如果是分块传输编码，Transfer-Encoding: chunked不受影响。

### HttpUrlConnection

1. 是否自动添加Accept-Encoding: gzip<br />官网有过说明：

```
In Gingerbread, we added transparent response compression. HttpURLConnection will automatically add this header to outgoing requests, and handle the corresponding response:
Accept-Encoding: gzip
Take advantage of this by configuring your Web server to compress responses for clients that can support it. If response compression is problematic, the class documentation shows how to disable it.
```

> 即：2.3后默认是gzip，不加Accept-Encoding会被自动添加上Accept-Encoding: gzip

2. 自动添加的request，response是否支持自动解压

```
By default, this implementation of HttpURLConnection requests that servers use gzip compression and it automatically decompresses the data for callers of getInputStream().
```

> 返回的数据是已经自动解压缩的。

3. 手动添加是否负责解压缩

```
By default, this implementation of HttpURLConnection requests that servers use gzip compression and it automatically decompresses the data for callers of getInputStream(). The Content-Encoding and Content-Length response headers are cleared in this case. Gzip compression can be disabled by setting the acceptable encodings in the request header:
urlConnection.setRequestProperty("Accept-Encoding", "identity");
Setting the Accept-Encoding request header explicitly disables automatic decompression and leaves the response headers intact; callers must handle decompression as needed, according to the Content-Encoding header of the response.
```

> 设置为identity时可以禁止gzip压缩。显式声明会禁止自动解压，同时保留header完整性，需要根据Content-Encoding来自己处理response。

手动添加不会负责解压缩。

4. 自动解压时Content-Length问题

```
Since HTTP’s Content-Length header returns the compressed size, it is an error to use getContentLength() to size buffers for the uncompressed data. Instead, read bytes from the response until InputStream.read() returns -1.
```

> getContentLength() 值为gzip压缩时的数据大小。HttpURLConnection 在Android 4.4以后底层是由OkHttp实现的

```
4.4之后的版本，Content-Length被移除，getContentLength() = -1
2.3- 4.3之间，Content-Length 没有移除，getContentLength() = compressed size
```

5. 自动解压时的Content-Encoding<br />与Content-Length对应：

- 4.4之后的版本，Content-Encoding被移除
- 2.3- 4.3之间，Content-Encoding存在，无变化。

6. 自动解压时的分块编码传输<br />与OkHttp相同，Transfer-Encoding: chunked不受影响。

### HttpClient

> HttpClient默认不带Gzip压缩

Android HttpURLConnection及HttpClient选择<br /><http://www.trinea.cn/android/android-http-api-compare/>

### Volley Gzip

添加支持GZIP的网络请求

```java
public class GZipRequest extends StringRequest {
    public GZipRequest(int method, String url, Response.Listener<String> listener, Response.ErrorListener errorListener) {
        super(method, url, listener, errorListener);
    }
    public GZipRequest(String url, Response.Listener<String> listener, Response.ErrorListener errorListener) {
        super(url, listener, errorListener);
    }
    // parse the gzip response using a GZIPInputStream
    @Override
    protected Response<String> parseNetworkResponse(NetworkResponse response) {
        String output = "";
        try {
            GZIPInputStream gStream = new GZIPInputStream(new ByteArrayInputStream(response.data));
            InputStreamReader reader = new InputStreamReader(gStream);
            BufferedReader in = new BufferedReader(reader);
            String read;
            while ((read = in.readLine()) != null) {
                output += read;
            }
            reader.close();
            in.close();
            gStream.close();
        } catch (IOException e) {
            return Response.error(new ParseError());
        }
        return Response.success(output, HttpHeaderParser.parseCacheHeaders(response));
    }
}
```

- [x] Volley框架的增强二 <https://www.zybuluo.com/flyouting/note/22485>
- [x] <https://github.com/jarlen/VolleyOkHttpGzip>

> <https://github.com/jarlen/VolleyOkHttpGzip/blob/master/src/com/android/volley/okhttp/gzip/GzipUtil.java>

## GZIP需要注意的问题

1. Chrome/Stetho 在 network 调试时会针对 gzip 的头进行自动判断是否解压
2. iOS 的 NSURLConnection 类会针对 gzip 的头进行自动判断是否解压
3. OkHttp 会针对 gzip 的头进行自动判断是否解压
4. 无需手动添加Gzip；手动添加gzip就不能自动解压，就需要手动对返回的数据流进行 gzip 解压缩。

```kotlin
.addHeader("Accept-Encoding", "gzip");
```

5. 如果使用了https加密后为二进制的数据，效果就不明细了，这时后端需要手动GZIP压缩再加密，客户端解密后再GZIP解压

## GZIP解压缩代码

### GZIPInputStream/GZIPOutputStream

> <https://github.com/jarlen/VolleyOkHttpGzip/blob/master/src/com/android/volley/okhttp/gzip/GzipUtil.java>

```java
public class GzipUtil {
    public static final String HEADER_ENCODING = "Content-Encoding";
    public static final String HEADER_ACCEPT_ENCODING = "Accept-Encoding";
    public static final String ENCODING_GZIP = "gzip";

    public static final long HEADER_ENCODING_RANGE = 1024;//1kb

    /**
     * gzip压缩
     */
    public static byte[] compress(String str, String charset) throws IOException {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        GZIPOutputStream gzip = new GZIPOutputStream(out);
        try {
            gzip.write(str.getBytes(charset));
            gzip.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IOException(e);
        } finally {
            if (gzip != null) {
                gzip.close();
            }
            if (out != null) {
                out.close();
            }
        }
    }

    /**
     * gzip压缩
     */
    public static byte[] compress(byte[] buffer) throws IOException {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        GZIPOutputStream gzip = new GZIPOutputStream(out);
        try {
            gzip.write(buffer);
            gzip.close();
            return out.toByteArray();
        } finally {

            if (gzip != null) {
                gzip.close();
            }
            if (out != null) {
                out.close();
            }
        }
    }

    /**
     * 判断是否需要gzip解压
     * @param headers header 参数
     */
    private static boolean isGzipped(Map<String, String> headers) {
        return headers != null
                && !headers.isEmpty()
                && (headers.containsKey(HEADER_ENCODING) && headers.get(
                HEADER_ENCODING).equalsIgnoreCase(ENCODING_GZIP));
    }

    /**
     * gzip解压
     */
    public static byte[] decompressResponse(byte[] compressed)
            throws IOException {
        ByteArrayOutputStream baos = null;
        try {
            int size;
            ByteArrayInputStream memstream = new ByteArrayInputStream(
                    compressed);
            GZIPInputStream gzip = new GZIPInputStream(memstream);
            final int buffSize = 256;
            byte[] tempBuffer = new byte[buffSize];
            baos = new ByteArrayOutputStream();
            while ((size = gzip.read(tempBuffer, 0, buffSize)) != -1) {
                baos.write(tempBuffer, 0, size);
            }
            return baos.toByteArray();
        } finally {
            if (baos != null) {
                baos.close();
            }
        }
    }

}
```

### okio

#### OKHttp压缩request body

```kotlin
public class GzipRequestInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request originalRequest = chain.request();
        if (originalRequest.body() == null || originalRequest.header("Content-Encoding") != null) {
            return chain.proceed(originalRequest);
        }

        Request compressedRequest = originalRequest.newBuilder()
                .header("Content-Encoding", "gzip")
                .method(originalRequest.method(), forceContentLength(gzip(originalRequest.body())))
                .build();
        return chain.proceed(compressedRequest);
    }

    private RequestBody forceContentLength(final RequestBody requestBody) throws IOException {
        final Buffer buffer = new Buffer();
        requestBody.writeTo(buffer);
        return new RequestBody() {
            @Override
            public MediaType contentType() {
                return requestBody.contentType();
            }

            @Override
            public long contentLength() {
                return buffer.size();
            }

            @Override
            public void writeTo(BufferedSink sink) throws IOException {
                sink.write(buffer.snapshot());
            }
        };
    }


    private RequestBody gzip(final RequestBody body) {
        return new RequestBody() {
            @Override
            public MediaType contentType() {
                return body.contentType();
            }

            @Override
            public long contentLength() {
                return -1; // We don't know the compressed length in advance!
            }

            @Override
            public void writeTo(BufferedSink sink) throws IOException {
                BufferedSink gzipSink = Okio.buffer(new GzipSink(sink));
                body.writeTo(gzipSink);
                gzipSink.close();
            }
        };
    }
}
```

#### OkHttp request GZIP压缩数据

1. OkHttp压缩数据

```java
private RequestBody gzip(final RequestBody body) {
        return new RequestBody() {
            @Override
            public MediaType contentType() {
                return body.contentType();
            }
 
            @Override
            public long contentLength() {
                return -1; // We don't know the compressed length in advance!
            }
 
            @Override
            public void writeTo(BufferedSink sink) throws IOException {
                BufferedSink gzipSink = Okio.buffer(new GzipSink(sink));
                body.writeTo(gzipSink);
                gzipSink.close();
            }
        };
    }
    public RequestBody getGzipRequest(String body) {
        RequestBody request = null;
        try {
            request = RequestBody.create(MediaType.parse("application/octet-stream"),compress(body));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return request;
    }
```

2. 拦截器方式

```java
public class GzipRequestInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request originalRequest = chain.request();
        if (originalRequest.body() == null || originalRequest.header("Content-Encoding") != null) {
            return chain.proceed(originalRequest);
        }

        Request compressedRequest = originalRequest.newBuilder()
                .header("Content-Encoding", "gzip")
                .method(originalRequest.method(), gzip(originalRequest.body()))
                .build();
        return chain.proceed(compressedRequest);
    }

    private RequestBody gzip(final RequestBody body) {
        return new RequestBody() {
            @Override
            public MediaType contentType() {
                return body.contentType();
            }

            @Override
            public long contentLength() {
                return -1; // 无法提前知道压缩后的数据大小
            }

            @Override
            public void writeTo(BufferedSink sink) throws IOException {
                BufferedSink gzipSink = Okio.buffer(new GzipSink(sink));
                body.writeTo(gzipSink);
                gzipSink.close();
            }
        };
    }
}
```

源码在：<br />[okhttp/samples/guide/src/main/java/okhttp3/recipes/RequestBodyCompression.java](https://github.com/square/okhttp/blob/7135628c645892faf1a48a8cff464e0ed4ad88cb/samples/guide/src/main/java/okhttp3/recipes/RequestBodyCompression.java)

### okio解压缩GZIP

## 其他压缩方式zlib brotli

- brotli

> // 目前okhttp-brotli最低版本是4.1.0,高于项目使用版本，因此单独作为解压缩的工具<br />implementation("com.squareup.okhttp3:okhttp-brotli:4.8.1",{<br />exclude group: 'com.squareup.okhttp3'<br />})

```kotlin
object DecompressUtils {


    fun deCompressWithGZipToString(
        bytes: ByteArray?,
        encoding: Charset = Charsets.UTF_8
    ): String? {
        if (bytes == null || bytes.isEmpty()) {
            return null
        }
        return deCompressWithGZip(bytes)?.toString(encoding)
    }

    fun deCompressWithGZip(bytes: ByteArray?): ByteArray? {
        if (bytes == null || bytes.isEmpty()) {
            return null
        }
        val out = ByteArrayOutputStream()
        val `in` = ByteArrayInputStream(bytes)
        try {
            val ungzip = GZIPInputStream(`in`)
            val buffer = ByteArray(256)
            var n: Int = 0
            while (ungzip.read(buffer).also { n = it } >= 0) {
                out.write(buffer, 0, n)
            }
            return out.toByteArray()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        return null
    }



    /**
     * 参考文献 https://thiscouldbebetter.wordpress.com/2011/08/26/compressing-and-uncompressing-data-in-java-using-zlib/
     *
     */
    fun deCompressWithZlibToString(bytesToDecompress: ByteArray): String? {
        val bytesDecompressed: ByteArray = decompressWithZlib(bytesToDecompress) ?: return null
        var returnValue: String? = null
        try {
            returnValue = String(
                bytesDecompressed,
                0,
                bytesDecompressed.size,
                Charset.forName("UTF-8")
            )
        } catch (uee: UnsupportedEncodingException) {
            uee.printStackTrace()
        }
        return returnValue
    }

    fun decompressWithZlib(bytesToDecompress: ByteArray): ByteArray? {
        var returnValues: ByteArray? = null
        val inflater = Inflater()
        val numberOfBytesToDecompress = bytesToDecompress.size
        inflater.setInput(
            bytesToDecompress,
            0,
            numberOfBytesToDecompress
        )
        var numberOfBytesDecompressedSoFar = 0
        val bytesDecompressedSoFar: MutableList<Byte> =
            ArrayList()
        try {
            while (inflater.needsInput() === false) {
                val bytesDecompressedBuffer = ByteArray(numberOfBytesToDecompress)
                val numberOfBytesDecompressedThisTime: Int = inflater.inflate(
                    bytesDecompressedBuffer
                )
                numberOfBytesDecompressedSoFar += numberOfBytesDecompressedThisTime
                for (b in 0 until numberOfBytesDecompressedThisTime) {
                    bytesDecompressedSoFar.add(bytesDecompressedBuffer[b])
                }
            }
            returnValues = ByteArray(bytesDecompressedSoFar.size)
            for (b in returnValues.indices) {
                returnValues[b] = bytesDecompressedSoFar[b]
            }
        } catch (dfe: DataFormatException) {
            dfe.printStackTrace()
        }
        inflater.end()
        return returnValues
    }

    /**
     * https://github.com/square/okhttp/tree/master/okhttp-brotli
     */
    fun deCompressWithBrotliToString(bytesToDecompress: ByteString): String? {
        var brotli = BrotliInputStream(bytesToDecompress.toByteArray().inputStream())
//        var  bufferedSource = Okio.buffer(Okio.source(brotli))
//        bufferedSource.readByteString().utf8()
        return ByteString.of(ByteBuffer.wrap(brotli.readBytes())).utf8()
    }
}
```

## Ref

- [x] 聊聊HTTP gzip压缩与常见的Android网络框架 <https://www.cnblogs.com/ct2011/p/5835990.html>

# MockWebServer

## MockWebServer能帮我们做什么

MockWebServer可以mock反馈，验证请求，以下是MockWebServer能帮我们做的事情:

1. 可以设置http response，设置response的header、body、status code等
2. 可以记录接收到的请求，获取请求的body、header、method、path、HTTP version（在单元测试中很有用）
3. 可以模拟网速慢的网络环境
4. 提供Dispatcher，让mockWebServer可以根据不同的请求进行不同的反馈

## 模拟Response(MockResponse)

> MockResponse 可以默认返回http code是200的response，相依可以设置字符串、输入流、字节数组，设置可以设置Header。

```java
public class MockWebServerTest {

    @Test
    public void testLogin() throws Exception {
        // 创建一个 MockWebServer
        MockWebServer mockWebServer = new MockWebServer();

        // 设置响应
        MockResponse mockResponse1 = new MockResponse()
                .addHeader("Content-Type", "application/json;charset=utf-8")
                .setResponseCode(404)
                .setBody("{\"status\":\"success\"}");
        mockWebServer.enqueue(mockResponse1);

        // 启动服务
//        InetAddress address = InetAddress.getByName("chat.qiushibaike.com");
        mockWebServer.start(12309);

        // 设置服务端的URL，客户端请求中使用
        HttpUrl httpUrl = mockWebServer.url("v1/chatroom/list");

        OkHttpClient okHttpClient = new OkHttpClient.
                Builder()
                .build();

        Request request = new Request.Builder()
                .url(httpUrl)
                .build();
        Call call = okHttpClient.newCall(request);

        // 运行你的应用程序代码，进行HTTP请求
        // 响应会按照上面设置中放入队列的顺序被返回
        Response response = call.execute();

        int code = response.code();
        System.out.println(code);
        String string = response.body().string();
        System.out.println(string);

        // 关闭服务，因为不能重用
//        mockWebServer.shutdown();
    }

}
```

## 记录请求（RecordedRequest）

> 校验请求的请求方法、路径、HTTP版本、请求体、请求头。

```java
RecordedRequest request = server.takeRequest();
assertEquals("POST /v1/chat/send HTTP/1.1", request.getRequestLine());
assertEquals("application/json; charset=utf-8", request.getHeader("Content-Type"));
assertEquals("{}", request.getUtf8Body());
```

## 弱网模拟

```java
response.throttleBody(1024, 1, TimeUnit.SECONDS);
```

## 转发器（Dispatcher）

默认情况下 MockWebServer 使用队列来指定响应。另外，可以根据需要使用另外一种响应策略，可以通过转发器来处理器，可以通过请求的路径来选择转发策略。比如，我们可以过滤请求替代 server.enqueue()。

```java
final Dispatcher dispatcher = new Dispatcher() {

    @Override
    public MockResponse dispatch(RecordedRequest request) throws InterruptedException {

        if (request.getPath().equals("/v1/login/auth/")){
            return new MockResponse().setResponseCode(200);
        } else if (request.getPath().equals("v1/check/version/")){
            return new MockResponse().setResponseCode(200).setBody("version=9");
        } else if (request.getPath().equals("/v1/profile/info")) {
            return new MockResponse().setResponseCode(200).setBody("{\\\"info\\\":{\\\"name\":\"Lucas Albuquerque\",\"age\":\"21\",\"gender\":\"male\"}}");
        }
        return new MockResponse().setResponseCode(404);
    }
};
server.setDispatcher(dispatcher);
```
