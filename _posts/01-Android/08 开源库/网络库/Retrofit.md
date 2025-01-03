---
date created: 2024-03-28 14:22
tags:
  - '#17'
date updated: 2024-12-24 00:36
dg-publish: true
---

# Retrofit基本用法

## Retrofit是什么？

是一个不错的REST网络请求库，官方介绍：`A type-safe REST client for Android and Java`

## Retrofit API使用

### Retrofit异步请求

Call的enqueue(callback)

```java
public interface ApiGithubUser {
    @GET("users/{user}")
    Call<GithubUser> getGithubUser(@NonNull @Path("user") String user);
}

Retrofit retrofit = new Retrofit.Builder()
        .baseUrl(BaseUrl.GITHUB_USER_INFO)
        .addConverterFactory(GsonConverterFactory.create())
        .build();

ApiGithubUser apiGithubUser = retrofit.create(ApiGithubUser.class);
Call<GithubUser> githubUserCall = apiGithubUser.getGithubUser("hacket");
githubUserCall.enqueue(new Callback<GithubUser>() {
    @Override
    public void onResponse(Call<GithubUser> call, Response<GithubUser> response) {
        GithubUser body = response.body(); 
        mTvResult.setText(body.toString());
    }

    @Override
    public void onFailure(Call<GithubUser> call, Throwable t) {
        t.printStackTrace();
        mTvResult.setText(t.getMessage());
    }
});
```

### Retrofit同步请求

Call的execute()

```java
public interface ApiGithubUser {
    @GET("users/{user}")
    Call<GithubUser> getGithubUser(@NonNull @Path("user") String user);
}

Retrofit retrofit = new Retrofit.Builder()
        .baseUrl(baseUrl)
        .addConverterFactory(GsonConverterFactory.create())
        .build();

ApiGithubUser apiGithubUser = retrofit.create(ApiGithubUser.class);
Call<GithubUser> githubUserCall = apiGithubUser.getGithubUser("hacket");
try {
    Response<GithubUser> githubUserResponse = githubUserCall.execute();
    if (githubUserResponse.isSuccessful()) {
        return githubUserResponse.body();
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### GET

```java
public interface ZhihuService {
    // 获取启动页大图 1080*1776
    @GET("api/{api}/start-image/{size}")
    Call<StartImageBean> getStartImage(@NonNull @Path("api") String api, @NonNull @Path("size") String size);
}

final Retrofit retrofit = new Retrofit.Builder()
        .baseUrl(BaseUrl.ZHIHU_NEWS)
        .addConverterFactory(GsonConverterFactory.create())
        .build();
ZhihuService zhihuService = retrofit.create(ZhihuService.class);
final Call<StartImageBean> startImage = zhihuService.getStartImage("4", "1080*1776");
startImage.enqueue(new Callback<StartImageBean>() {
    @Override
    public void onResponse(Call<StartImageBean> call, Response<StartImageBean> response) {
        URL url = call.request().url().url();
        LogUtil.i(TAG, "onResponse: url:" + url);
        boolean successful = response.isSuccessful();
        LogUtil.i(TAG, "successful:" + successful);
        if (successful) {
            StartImageBean startImageBean = response.body();
            mTvResult.setText(startImageBean.text);
            Glide.with(RetrofitDemoActivity.this).load(startImageBean.img).into(iv_result);
        }
    }
    @Override
    public void onFailure(Call<StartImageBean> call, Throwable t) {
        URL url = call.request().url().url();
        LogUtil.i(TAG, "onResponse: url:" + url);
        mTvResult.setText(t.getMessage());
    }
});
}
```

### Post

和GET差不多；区别是用`@Body`包装请求体

### CallAdapter

<https://github.com/square/retrofit/wiki/Call-Adapters>

适配`Call`的返回类型`R`转换成`T`，通过`CallAdapter.Factory`创建，通过`addCallAdapterFactory`添加

Retrofit2提供了三个CallAdapter：

- [RxJava ](https://github.com/ReactiveX/RxJava/)`[Observable](https://github.com/ReactiveX/RxJava/)`[ & ](https://github.com/ReactiveX/RxJava/)`[Single](https://github.com/ReactiveX/RxJava/)` - `com.squareup.retrofit2:adapter-rxjava`
- [Guava ](https://github.com/google/guava/)`[ListenableFuture](https://github.com/google/guava/)` - `com.squareup.retrofit2:adapter-guava`
- [Java 8 ](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)`[CompleteableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)` - `com.squareup.retrofit2:adapter-java8`

还有一些第三方的库Adapter：

- [Bolts](https://github.com/zeng1990java/retrofit-bolts-call-adapter)
- [Agera](https://github.com/drakeet/retrofit-agera-call-adapter)

### CallAdapter.Factory

### Converter & Converter.Factory

<https://github.com/square/retrofit/wiki/Converters>

Retrofit允许以插件的形式来不同的序列化将Java Type转换成HTTP的描述；反序列化解析HTTP返回结果

#### Converter

#### Converter.Factory

创建Converter的工厂

- [Gson](https://github.com/google/gson) - `com.squareup.retrofit2:converter-gson`
- [Jackson](http://wiki.fasterxml.com/JacksonHome) - `com.squareup.retrofit2:converter-jackson`
- [Moshi](https://github.com/square/moshi) - `com.squareup.retrofit2:converter-moshi`
- [Protobuf](https://developers.google.com/protocol-buffers/) - `com.squareup.retrofit2:converter-protobuf`
- [Wire](https://github.com/square/wire) - `com.squareup.retrofit2:converter-wire`
- [Simple Framework](http://simple.sourceforge.net/) - `com.squareup.retrofit2:converter-simpleframework`
- Scalars - `com.squareup.retrofit2:converter-scalars`<br />还有一些第三方的converters：
- [LoganSquare](https://github.com/aurae/retrofit-logansquare) - `com.github.aurae.retrofit2:converter-logansquare`
- [FastJson](https://github.com/ligboy/retrofit-converter-fastjson) - `org.ligboy.retrofit2:converter-fastjson` or`org.ligboy.retrofit2:converter-fastjson-android`

### 大文件下载

文件下载我们需要使用`@Url`和`@Streaming`，@Url动态Url正好非常适合我们的场景，而使用@Streaming注解可以让我们下载非常大的文件时，避免Retrofit将整个文件读进内存，否则可能造成OOM现象。<br />声明接口：

```java
public interface BigDownloadService {
    @Streaming
    @GET
    Call<ResponseBody> downloadFileByDynamicUrlAsync(@Url String downloadUrl);
}
```

调用：

```java
@OnClick(R.id.btn_retrofit_down_big_file)
public void btn_retrofit_down_big_file() {
    final Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(BaseUrl.ZHIHU_NEWS)
            .addConverterFactory(GsonConverterFactory.create())
            .build();

    String url = "http://img-download.pchome.net/download/1k0/ur/4q/oc3l47-189v.jpg";

    Observable.just(url)
            .map(new Func1<String, String>() {
                @Override
                public String call(String url) {
                    BigDownloadService bigDownloadService = retrofit.create(BigDownloadService.class);
                    Call<ResponseBody> responseBodyCall = bigDownloadService.downloadFileByDynamicUrlAsync(url);
                    try {
                        Response<ResponseBody> bodyResponse = responseBodyCall.execute();
                        String imgUrl = writeResponseBodyToDisk(bodyResponse.body());
                        LogUtil.d(TAG, "下载文件 " + imgUrl);
                        return imgUrl;
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return "";
                }
            })
            .compose(RxUtils.<String>applySchedulers())
            .subscribe(new Action1<String>() {
                @Override
                public void call(String url) {
                    mTvResult.setText("url:" + url);
                    Glide.with(RetrofitDemoActivity.this).load(url).into(iv_result);
                }
            })
    ;
}

/**
 * 写入到磁盘根目录
 */
private String writeResponseBodyToDisk(ResponseBody body) {
    try {
        File futureStudioIconFile = new File(Environment.getExternalStorageDirectory() + File.separator + "atom.jpg");
        InputStream inputStream = null;
        OutputStream outputStream = null;
        try {
            byte[] fileReader = new byte[4096];
            final long fileSize = body.contentLength();
            long fileSizeDownloaded = 0;
            inputStream = body.byteStream();
            outputStream = new FileOutputStream(futureStudioIconFile);
            while (true) {
                int read = inputStream.read(fileReader);
                if (read == -1) {
                    break;
                }
                outputStream.write(fileReader, 0, read);
                fileSizeDownloaded += read;
                LogUtil.d(TAG, "file download: " + fileSizeDownloaded + " of " + fileSize);
                final long finalFileSizeDownloaded = fileSizeDownloaded;
                LogUtil.i(TAG, "file download: " + finalFileSizeDownloaded + " of " + fileSize);
            }
            outputStream.flush();
            return futureStudioIconFile.getAbsolutePath();
        } catch (IOException e) {
            return "";
        } finally {
            if (inputStream != null) {
                inputStream.close();
            }
            if (outputStream != null) {
                outputStream.close();
            }
        }
    } catch (IOException e) {
        return "";
    }
}
```

### Retrofit2.x Proguard

```
# Platform calls Class.forName on types which do not exist on Android to determine platform.
-dontnote retrofit2.Platform
# Platform used when running on RoboVM on iOS. Will not be used at runtime.
-dontnote retrofit2.Platform$IOS$MainThreadExecutor
# Platform used when running on Java 8 VMs. Will not be used at runtime.
-dontwarn retrofit2.Platform$Java8
# Retain generic type information for use by reflection by converters and adapters.
-keepattributes Signature
# Retain declared checked exceptions for use by a Proxy instance.
-keepattributes Exceptions
```

### 表单上传（application/x-www-form-urlencoded）

#### 表单上传，参数很少

```java
@FormUrlEncoded
@POST("upload")
Call<ResponseBody> uploadParams(@Field("username")String username,@Field("token")String token);
```

#### 表单上传，参数很多

```kotlin
@FormUrlEncoded
@POST("apiv2/app/getCOSToken")
Observable<COSTokenResponse1> getCOSToken(@FieldMap Map<String, String> formMap);
```

### 文件上传

#### 单个文件上传 `@Multipart`

文件上传我们需要使用`@MultiPart`和`@Part` ，MultiPart意思就是允许多个@Part多部分上传，需要在**@Part**指定file和filename的值，避免一些不必要的麻烦。

```java
@Multipart
@POST
Observable<UploadResponse2> doUpload(@Url String url, @Part List<MultipartBody.Part> parts);

static Observable<UploadResponse2> uploadApkToCosObservable(String endpointUrl, UploadRequest2 req2) {
    
    RequestBody body = RequestBody.create(MediaType.parse("multipart/form-data"), req2.file);
    MultipartBody multipartBody = new MultipartBody.Builder()
            .addFormDataPart("key", req2.key)
            .addFormDataPart("signature", req2.signature)
            .addFormDataPart("x-cos-security-token", req2.token)
            .addFormDataPart("file", req2.filename, body)
            .setType(MultipartBody.FORM)
            .build();

    return NetManager.createRetrofit().create(PgyerService.class)
            .doUpload(endpointUrl, multipartBody.parts());
}
```

#### 多文件上传 `@PartMap`

1. 使用@PartMap实现

```java
@Multipart
@POST("upload")
Call<ResponseBody> uploadFiles(@PartMap Map<String, RequestBody> map);

RequestBody fb = RequestBody.create(MediaType.parse("text/plain"), "hello,retrofit");
RequestBody fileTwo = RequestBody.create(MediaType.parse("image/*"), new File(Environment.getExternalStorageDirectory()
                + file.separator + "original.png"));
Map<String, RequestBody> map = new HashMap<>();
//这里的key必须这么写，否则服务端无法识别
map.put("file\"; filename=\""+ file.getName(), fileRQ);
map.put("file\"; filename=\""+ "2.png", fileTwo);

Call<ResponseBody> uploadCall = downloadService.uploadFiles(map);
```

2. 使用@Part实现

```java
@Multipart
@POST("upload")
Call<ResponseBody> uploadFiles(@Part List<MultipartBody.Part> parts);
RequestBody fileRQ = RequestBody.create(MediaType.parse("image/*"), file);

MultipartBody.Part part = MultipartBody.Part.createFormData("picture", file.getName(), fileRQ);

RequestBody fb = RequestBody.create(MediaType.parse("text/plain"), "hello,retrofit");
RequestBody fileTwo = RequestBody.create(MediaType.parse("image/*"), new File(Environment.getExternalStorageDirectory()
                + file.separator + "original.png"));
MultipartBody.Part two=MultipartBody.Part.createFormData("one","one.png",fileTwo);
List<MultipartBody.Part> parts=new ArrayList<>();
parts.add(part);
parts.add(two);

Call<ResponseBody> uploadCall = downloadService.uploadFiles(parts);
```

### 文件和参数混合上传

```java
@Multipart
@POST("upload")
Call<ResponseBody> uploadFile(@Part("body") RequestBody body, @Part MultipartBody.Part file);

MultipartBody.Part part = MultipartBody.Part.createFormData("picture", file.getName(), fileRQ);
RequestBody fb =RequestBody.create(MediaType.parse("text/plain"), "hello,retrofit");
Call<ResponseBody> uploadCall = downloadService.uploadFile(fb,part);
```

### 通用上传方式

```java
@POST("upload")
Call<ResponseBody> uploadFile(@Body RequestBody body);

String name = etFileName.getText().toString().trim();
name = TextUtils.isEmpty(name) ? "1.png" : name;
String path = Environment.getExternalStorageDirectory() + File.separator + name;
File file = new File(path);
RequestBody fileRQ = RequestBody.create(MediaType.parse("multipart/form-data"), file);
MultipartBody.Part part = MultipartBody.Part.createFormData("picture", file.getName(), fileRQ);

RequestBody body=new MultipartBody.Builder()
        .addFormDataPart("userName","lange")
        .addFormDataPart("token","dxjdkdjkj9203kdckje0")
        .addFormDataPart("header",file.getName(),fileRQ)
        .build();
Call<ResponseBody> uploadCall = downloadService.uploadFile(body);
uploadCall.enqueue(new Callback<ResponseBody>() {
    @Override
    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
        Log.i("upload", response.isSuccessful() + "");
    }

    @Override
    public void onFailure(Call<ResponseBody> call, Throwable t) {
    }
});
```

# Retrofit2之注解详解

## 1、REQUEST METHOD (请求方法)

需要先定义一个接口，然后将请求方法注解在方法上，每个方法都需要一个请求方法注解和一个url；有5种内置的请求方法注解

### [@GET ](/GET)

一个简单的Get请求

```java
@GET("users/list")
```

也可以指定请求参数在url中

```java
@GET("users/list?sort=desc")
```

### [@POST ](/POST)

### [@PUT ](/PUT)

### [@HEAD ](/HEAD)

### [@DELETE ](/DELETE)

### [@PATCH ](/PATCH)

### [@Options ](/Options)

### [@HTTP ](/HTTP)

自定义一个Http Method

## 2、URL MANIPULATION （请求Path）

可以通过`{xxx}`来动态替换掉里面的内容，通过`@Path`<br />@Path注解。

### [@Path ](/Path)

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId);
```

也可以添加`Query parameters`:

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId, @Query("sort") String sort);
```

复杂的`Query parameter combinations`通过Map:

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId, @QueryMap Map<String, String> options);
```

## 3、Query Params (请求参数)

### [@Query ](/Query)

```java
@GET("test/sayHello")
Call<String> sayHello(@Query("username") String username, @Query("age") String age);
```

### [@QueryMap ](/QueryMap)

这两个和@Filed、@FiledMap功能是一致的，区别在于参数形式体现在URL上。

## 4、REQUEST BODY (请求体)

通过`@Body`注解，可以指定Object为HTTP的请求体

### [@Body ](/Body)

```java
@POST("users/new")
Call<User> createUser(@Body User user);
```

这个对象会被转换，如果没有添加转换器，默认`RequestBody`。

或者使用HashMap

```kotlin
@POST(ROOM_GREET_TXT_UPDATE)
    suspend fun updateRoomGreetText(@Path("roomId") roomId: String, @Body params: Map<String, String>): RoomGreetTextBean.RoomGreetTxt
```

## 5、FORM ENCODED AND MULTIPART

接口里的方法可以声明发送表单编码(form-encoded)和`multipart`data。

### [@FormUrlEncoded ](/FormUrlEncoded) [@Field ](/Field) [@FieldMap ](/FieldMap)

表单编码(form-encoded)通过`@FormUrlEncoded`注解在方法上，每对key-value通过`@Field`指定name和要提供的value

```java
@FormUrlEncoded
@POST("user/edit")
Call<User> updateUser(@Field("first_name") String first, @Field("last_name") String last);
```

- [@Field ](/Field) [@FieldMap ](/FieldMap) <br />这两个需要和@FormUrlEncoded配合使用，参数形式体现在请求体上

### [@Multipart ](/Multipart) [@Part ](/Part) 文件上传（表单）

Multipart parts用`@Multipart`注解在方法上，每一个Part用`@Part`注解声明。

```java
@Multipart
@PUT("user/photo")
Call<User> updateUser(@Part("photo") RequestBody photo, @Part("description") RequestBody description);
```

- [@Multipart ](/Multipart) [@Part ](/Part) <br />这两个用于上传文件，与`@MultiPart`注解结合使用

## 6、HEADER MANIPULATION (请求头)

### [@Headers ](/Headers)

用于在方法添加请求头；指定静态的Header，通过`@Headers`注解在接口的方法上

```java
@Headers("Cache-Control: max-age=640000")
@GET("widget/list")
Call<List<Widget>> widgetList();
```

```java
@Headers({
    "Accept: application/vnd.github.v3.full+json",
    "User-Agent: Retrofit-Sample-App"
})
@GET("users/{username}")
Call<User> getUser(@Path("username") String username);
```

_Note:_ 这些Header不会相互覆盖，所有的Header（即使具有相同的name）会被添加到request中

### [@Header ](/Header)

用于在方法参数里动态添加请求头；动态添加Header通过`@Header`注解，如果值为null，这个Header会被忽略掉，否则调用`toString()`。

```java
@GET("user")
Call<User> getUser(@Header("Authorization") String authorization)
```

如果需要添加到每一个request中去，用[OkHttp interceptor](https://github.com/square/okhttp/wiki/Interceptors).

## 7、大文件下载

@Url动态Url正好非常适合我们的场景，而使用@Streaming注解可以让我们下载非常大的文件时，避免Retrofit将整个文件读进内存，否则可能造成OOM现象。

### [@Url ](/Url)

使用动态的请求的网址，会复写之前的baseUrl，值得注意的是@Url需要在所有参数之前

### [@Streaming ](/Streaming)

如果正在下载一个大文件，Retrofit2将尝试将整个文件移动到内存中。为了避免这种，我们必须向请求声明中添加一个特殊的注解[@Streaming ](/Streaming)

# Retrofit封装

## Retrofit2 BaseResponse封装处理

### 自定义GsonResponseBodyConverter

1. 自定义一个GsonResponseBodyConverter

```java
final class GsonResponseBodyConverter<T> implements Converter<ResponseBody, T> {
    private final Gson gson;
    private final TypeAdapter<T> adapter;
    private Type mType;

    GsonResponseBodyConverter(Gson gson, TypeAdapter<T> adapter, Type type) {
        this.gson = gson;
        this.adapter = adapter;
        this.mType = type;
    }

    private BaseResponse<T> parseJson(JSONObject rootJsonObj) {
        int err = rootJsonObj.optInt("err");
        String errInfo = rootJsonObj.optString("err_msg");
        int dataLength = rootJsonObj.optInt("data_length");
        String dataInfo = rootJsonObj.optString("data_info");
        Builder<T> builder = new Builder();
        builder.setErr(err);
        builder.setErrInfo(errInfo);
        builder.setDataLength(dataLength);
        builder.setDataInfo(dataInfo);
        JSONObject responseJsonObj = rootJsonObj.optJSONObject("data");
        if (null != responseJsonObj) {
            T data = this.gson.fromJson(responseJsonObj.toString(), this.mType);
            builder.setData(data);
        } else {
            JSONArray responseJsonArray = rootJsonObj.optJSONArray("data");
            if (null != responseJsonArray) {
                T data = this.gson.fromJson(responseJsonArray.toString(), this.mType);
                builder.setData(data);
            }
        }

        return builder.build();
    }

    public T convert(ResponseBody value) throws IOException {
        try {
            String responseJson = value.string();
            JSONObject jsonObject = new JSONObject(responseJson);
            BaseResponse<T> response = this.parseJson(jsonObject);
            if (response == null) {
                throw new ServerException("response is null", -1);
            }

            boolean successful = response.isSuccessful();
            if (!successful) {
                throw new ServerException(response.errInfo, response.err);
            }

            Object var6 = response.getData();
            return var6;
        } catch (JSONException var10) {
            var10.printStackTrace();
        } finally {
            value.close();
        }
        return null;
    }
}
```

2. 自定义MyGsonConverterFactory

```java
/**
 * 支持支持BaseResponse<T>的Converter.Factory
 *
 * A {@linkplain Converter.Factory converter} which uses Gson for JSON.
 * <p>
 * Because Gson is so flexible in the types it supports, this converter assumes that it can handle
 * all types. If you are mixing JSON serialization with something else (such as protocol buffers),
 * you must {@linkplain Retrofit.Builder#addConverterFactory(Converter.Factory) add this instance}
 * last to allow the other converters a chance to see their types.
 */
public final class MyGsonConverterFactory extends Converter.Factory {
    /**
     * Create an instance using a default {@link Gson} instance for conversion. Encoding to JSON and
     * decoding from JSON (when no charset is specified by a header) will use UTF-8.
     */
    public static GsonConverterFactory create() {
        return create(new Gson());
    }

    /**
     * Create an instance using {@code gson} for conversion. Encoding to JSON and
     * decoding from JSON (when no charset is specified by a header) will use UTF-8.
     */
    @SuppressWarnings("ConstantConditions") // Guarding public API nullability.
    public static GsonConverterFactory create(Gson gson) {
        if (gson == null) throw new NullPointerException("gson == null");
        return new GsonConverterFactory(gson);
    }

    private final Gson gson;

    private GsonConverterFactory(Gson gson) {
        this.gson = gson;
    }

    @Override
    public Converter<ResponseBody, ?> responseBodyConverter(Type type, Annotation[] annotations,
                                                            Retrofit retrofit) {
        TypeAdapter<?> adapter = gson.getAdapter(TypeToken.get(type));
        return new GsonResponseBodyConverter<>(gson, adapter, type);
    }

    @Override
    public Converter<?, RequestBody> requestBodyConverter(Type type,
                                                          Annotation[] parameterAnnotations, Annotation[] methodAnnotations, Retrofit retrofit) {
        TypeAdapter<?> adapter = gson.getAdapter(TypeToken.get(type));
        return new GsonRequestBodyConverter<>(gson, adapter);
    }
}
```

3. 使用

```java
.addConverterFactory(MyGsonConverterFactory.create())
```

### 注解方式处理

- [x] 使用 Retrofit 如何丢弃烦人的 BaseResponse<br /><https://paradisehell.org/2021/06/05/get-rid-of-base-response-using-retrofit/>
- [ ] <https://github.com/ParadiseHell/convex>

## Retrofi2t+RxJava2异常处理

### 通过onErrorResumeNext操作符

Retrofit处理后端自己返回的错误码，正常流程那么会走入到onNext中去，如何让其走到onError中去。

> 整个流程都是在RxJava的工作流中，所以RxJava对于Retrofit的适配器(也就是工厂)并不用做什么改变，因为只要在流程中抛出异常，便会执行onError方法，这是永恒不变的。我们最终的目的，就是解析服务器返回的json，判断请求是否成功，如果不成功，那么抛出异常，因为在RxJava的工作流中，只要抛出异常，便会执行subscribe的onError事件。所以，我们必须要自定义一个gson的工厂。这个工厂能在内部先解析服务器返回的数据，根据数据的成功与否来判断是否需要抛出异常或者进行object转换。

```java
.onErrorResumeNext(new Func1<Throwable, Observable<? extends InitUserInfo>>() {
    @Override
    public Observable<? extends InitUserInfo> call(Throwable throwable) {
        return Observable.error(ExceptionEngine.handleException(throwable));
    }
})
```

### 通过`CallAdapter.Factory`

```kotlin
/**
 * inspired by
 * @see <a href="https://gist.github.com/julianfalcionelli/a585d2cb2fbaca2e123ae7df3e36fa39"></a>
 */
class RxErrorHandleCallAdapterFactory(private val context: Context, private val originFactory: CallAdapter.Factory) : CallAdapter.Factory() {

    companion object {

        @JvmStatic
        fun create(context: Context) : RxErrorHandleCallAdapterFactory{
            return RxErrorHandleCallAdapterFactory(context, RxJava2CallAdapterFactory.create())
        }
    }

    override fun get(returnType: Type, annotations: Array<Annotation>, retrofit: Retrofit): CallAdapter<*, *>? {
        val callAdapter = originFactory.get(returnType, annotations, retrofit)
        callAdapter?.let {
            return RxErrorHandleCallAdapter(context, callAdapter)
        }
        return null
    }



    class RxErrorHandleCallAdapter(val context: Context, originAdapter: CallAdapter<*, *>) : CallAdapter<Any, Any> {

        private val originAdapter : CallAdapter<Any, *> = originAdapter as CallAdapter<Any, *>

        override fun adapt(call: Call<Any>): Any {
            val adaptedCall = originAdapter.adapt(call)

            if (adaptedCall is Observable<*>) {
                return adaptedCall.onErrorResumeNext {t: Throwable ->  Observable.error(asRetrofitException(t))}
            }

            if (adaptedCall is Flowable<*>) {
                return adaptedCall.onErrorResumeNext{t: Throwable -> Flowable.error(asRetrofitException(t)) }
            }

            if (adaptedCall is Single<*>) {
                return (adaptedCall ).onErrorResumeNext { throwable -> Single.error(asRetrofitException(throwable)) }
            }

            if (adaptedCall is Maybe<*>) {
                return adaptedCall.onErrorResumeNext { t: Throwable -> Maybe.error(asRetrofitException(t)) }
            }

            if (adaptedCall is Completable) {
                return adaptedCall.onErrorResumeNext { throwable -> Completable.error(asRetrofitException(throwable)) }
            }

            //todo (s1rius) return default or throw exception
            return adaptedCall
        }

        override fun responseType(): Type {
            return originAdapter.responseType()
        }

        private fun asRetrofitException(throwable: Throwable): CustomHttpException {
            return when (throwable) {
                // We had non-200 http error
                is HttpException -> {
                    val response = throwable.response()
                    ServerException.httpError(context, response)
                }
                // A network error happened
                is IOException -> ServerException.networkError(context, throwable)
                is CustomHttpException -> throwable
                else -> // We don't know what happened. We need to simply convert to an unknown error
                    ServerException.unexpectedError(context, throwable)
            }
        }
    }
}

class ServerException(msg: String, code: Int) : CustomHttpException(msg, code) {
    companion object {
        private const val UNUSE_HTTP_ERROR_CODE = Int.MIN_VALUE

        fun httpError(context: Context, response: Response<*>?): ServerException {
            try {
                val errorJson = JSONObject(response?.errorBody()?.string())
                val errCode = errorJson.optInt("err")
                val errorMsg = errorJson.optString("err_msg")
                if (errCode != 0 && !TextUtils.isEmpty(errorMsg)) {
                    return ServerException(errorMsg, errCode)
                }
            } catch (e: JSONException) {
                e.printStackTrace()
            } catch (e: IOException) {
                e.printStackTrace()
            } catch (e: Exception) {
                e.printStackTrace()
            }

            return ServerException(context.getString(R.string.server_error_unknow), response?.code()?: UNUSE_HTTP_ERROR_CODE)
        }

        fun networkError(context: Context, exception: IOException): ServerException {
            return if (exception is SocketTimeoutException) {
                //TODO 这里理论上应该用 timeout 的，但是对用户而言可能没啥意义，后期完善
                ServerException(context.getString(R.string.server_error_unknow), UNUSE_HTTP_ERROR_CODE)
            } else ServerException(context.getString(R.string.notice_network_unavailable), UNUSE_HTTP_ERROR_CODE)
        }

        fun unexpectedError(context: Context, exception: Throwable): ServerException {
            var msg = exception.message
            val defaultMsg = context.getString(R.string.server_error_unknow)
            if (msg.isNullOrEmpty()) {
                msg = defaultMsg
            }
            return ServerException(msg ?: "" , UNUSE_HTTP_ERROR_CODE)
        }
    }
}
```

# Retrofit2协程

## Retrofit2协程的支持

需要Retrofit2.6.0+<br />可以直接在主线程启动协程去请求网络，不需要在子线程中

```kotlin
/**
 * 期望使用接口返回的数据时使用
 */
suspend fun <T> withHttpContext(block: suspend () -> T): T? {
    if (!isNetworkConnected()) {
        return null
    }
    var result: T? = null
    try {
        result = block.invoke()
        LogUtils.logi("hacket", "withHttpContext", "block invoke.")
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return result
}

lifecycleScope.launchWhenCreated {
    withHttpContext {
        val result = Api.getRetrofit().create(Api::class.java).getChapters()
        val data = result.data
        LogUtils.logi("hacket", "withHttpContext", "end data = ${data.log()}")
    }

}
```

## Retrofit对协程支持原理

这是一个使用suspend的例子：

```kotlin
interface Api {
    @GET("/wxarticle/chapters/json")
    suspend fun getChapters(): ListBeanResponse<Chapter>
}
```

使用：

```java
Api.getRetrofit().create(Api::class.java).getChapters()
```

那么从create方法开始，看看Retrofit的执行流程：

```java
Retrofit. <T> T create(final Class<T> service) → 
Proxy.newProxyInstance.loadServiceMethod(method) → 
ServiceMethod.parseAnnotations(Retrofit, Method) →
RequestFactory.parseAnnotations() →
RequestFactory.Builder.build() → // 1
HttpServiceMethod.parseAnnotations() → 
ServiceMethod.invoke() → 
HttpServiceMethod.adapt() → // 2
SuspendForBody/SuspendForResponse/CallAdapted/.adapt()
```

在1处，

### suspend 方法

```kotlin
// 非 suspend 方法
fun test(){}

// suspend 方法
suspend fun testSuspend(){}

// 带参数的 suspend 方法
suspend fun testSuspend(text : String){}
```

反编译字节码看看：

```
Compiled from "SuspendTest.kt"
public final class SuspendTestKt {
  public static final void test();
    Code:
       0: return

  public static final java.lang.Object testSuspend(kotlin.coroutines.Continuation<? super kotlin.Unit>);
    Code:
       0: getstatic     #17                 // Field kotlin/Unit.INSTANCE:Lkotlin/Unit;
       3: areturn

  public static final java.lang.Object testSuspend(java.lang.String, kotlin.coroutines.Continuation<? super kotlin.Unit>);
    Code:
       0: getstatic     #17                 // Field kotlin/Unit.INSTANCE:Lkotlin/Unit;
       3: areturn
}
```

从反编译的结果看可知，suspend 方法比非 suspend 方法多一个参数， 并且这个参数在参数列表的最后一个，参数类型是 `Continuation`。

### 如何判断方法是suspend方法

```java
// RequestFactory
RequestFactory build() {
    // ...
    int parameterCount = parameterAnnotationsArray.length; // 参数注解个数
    parameterHandlers = new ParameterHandler<?>[parameterCount];
    for (int p = 0, lastParameter = parameterCount - 1; p < parameterCount; p++) {
    parameterHandlers[p] =
        // 参数4：是否是最后一个参数，suspend函数最后一个参数为Continuation
        parseParameter(p, parameterTypes[p], parameterAnnotationsArray[p], p == lastParameter);
    }
    // ...
}
private @Nullable ParameterHandler<?> parseParameter(int p, Type parameterType, @Nullable Annotation[] annotations, boolean allowContinuation) {
    ParameterHandler<?> result = null;
    if (annotations != null) {
        for (Annotation annotation : annotations) {
          ParameterHandler<?> annotationAction =
              parseParameterAnnotation(p, parameterType, annotations, annotation);
        
          if (annotationAction == null) {
            continue;
          }
        
          if (result != null) {
            throw parameterError(method, p,
                "Multiple Retrofit annotations found, only one allowed.");
          }
          result = annotationAction;
        }
    }
    if (result == null) {
        if (allowContinuation) { // 如果是最后一个参数
          try {
            if (Utils.getRawType(parameterType) == Continuation.class) { // 看是否是Continuation类型，是的话isKotlinSuspendFunction赋值为true
              isKotlinSuspendFunction = true;
              return null;
            }
          } catch (NoClassDefFoundError ignored) {
          }
        }
        throw parameterError(method, p, "No Retrofit annotation found.");
    }
    return result;
}
```

通过解析接口方法，Retrofit 创建了一个 RequestFactory 用于之后创建 OKhttp 的 Request, 而这个 RequestFactory 类多了一个 `isKotlinSuspendFunction` 的属性， 用于标记该方法是否为 suspend 方法，

### 如何判断方法的返回值

除了需要判断方法是否为 suspend 方法之外，还需要判断方法的返回类型是什么，要不然 Retrofit 就无法创建相应的 `CallAdapter`。

suspend方法的返回值其实就是Continuation的泛型的具体类型，所以只要获取Continuation的泛型的具体类型，我们就可以知道 suspend 方法 的返回类型，Retrofit 也是这么做的：

在2处，

```java
static <ResponseT, ReturnT> HttpServiceMethod<ResponseT, ReturnT> parseAnnotations(
      Retrofit retrofit, Method method, RequestFactory requestFactory) {
    boolean isKotlinSuspendFunction = requestFactory.isKotlinSuspendFunction;
    boolean continuationWantsResponse = false;
    boolean continuationBodyNullable = false;

    Annotation[] annotations = method.getAnnotations();
    Type adapterType;
    if (isKotlinSuspendFunction) { // 判断该方法是否为kotlin的suspend方法
        // 获取参数列表的泛型
        Type[] parameterTypes = method.getGenericParameterTypes();
        // 获取最后一个参数的第一个泛型类型，其实 Continuation 就一个泛型，这里 responseType 就是 suspend 方法的返回类型
        Type responseType = Utils.getParameterLowerBound(0, (ParameterizedType)parameterTypes[parameterTypes.length - 1]);
        // 判断返回类型是否为 Response, 这里这么判断是为了方便开发者
        if (getRawType(responseType) == Response.class && responseType instanceof ParameterizedType) {
            // Unwrap the actual body type from Response<T>. 
            // 类似这种：suspend getUserResponse : Response<User>
            responseType = Utils.getParameterUpperBound(0, (ParameterizedType) responseType);
            continuationWantsResponse = true;
        } else {
            // TODO figure out if type is nullable or not
            // Metadata metadata = method.getDeclaringClass().getAnnotation(Metadata.class)
            // Find the entry for method
            // Determine if return type is nullable or not
        }
        // 为 suspend 方法创建 CallAdapter 的类型，我们知道 Retrofit 默认情况只支持 Call 类型，比如下面的例子：
        // Call<User> getUser();
        // Retrofit 非常聪明地将 suspend 方法的 CallAdapter 类型转化成了 Call 类型，这里 ParameterizedTypeImpl 就是一个自定的 Call 类型。
        adapterType = new Utils.ParameterizedTypeImpl(null, Call.class, responseType); // 构建一个Call<responseType>的参数化类型
        annotations = SkipCallbackExecutorImpl.ensurePresent(annotations);
    } else {
        // 获取方法返回值的参数化类型，为ParameterizedTypeImpl，如Call<User>
        adapterType = method.getGenericReturnType();
    }
    
    // 通过 adapterType 创建该方法的 CallAdapter, 这里 supsend 方法的adapterType为Call类型
    CallAdapter<ResponseT, ReturnT> callAdapter = createCallAdapter(retrofit, method, adapterType, annotations);
    Type responseType = callAdapter.responseType();
    
    // ...
}
```

获取方法参数的最后一个参数，如果是Continuation类型，获取其泛型类型，构造一个`Call<responseType>`的参数化类型来获取对应的的CallAdapter

### 如何处理 suspend 方法的返回值

Retrofit 支持两种类型返回值的 suspend 方法，一种是返回值 类型为 Response 类型，另一种是具体数据类型

- Response 类型返回值的方法 Retrofit 返回了一个 `SuspendForResponse` 的 HttpServiceMethod
- 具体数据类型返回值的方法 Retrofit 返回了一个 `SuspendForBody` 的 HttpServiceMethod

```java
static <ResponseT, ReturnT> HttpServiceMethod<ResponseT, ReturnT> parseAnnotations() {
    
    // ... 前面就是获取responseType和callAdapter，上面讲解了
    
    Converter<ResponseBody, ResponseT> responseConverter = createResponseConverter(retrofit, method, responseType);
    okhttp3.Call.Factory callFactory = retrofit.callFactory;
    if (!isKotlinSuspendFunction) {
        return new CallAdapted<>(requestFactory, callFactory, responseConverter, callAdapter);
    } else if (continuationWantsResponse) {
        // noinspection unchecked Kotlin compiler guarantees ReturnT to be Object.
        // 如果 suspend 的返回类型为 Response 返回 SuspendForResponse
        return (HttpServiceMethod<ResponseT, ReturnT>) new SuspendForResponse<>(requestFactory,
          callFactory, responseConverter, (CallAdapter<ResponseT, Call<ResponseT>>) callAdapter);
    } else {
        // noinspection unchecked Kotlin compiler guarantees ReturnT to be Object.
        // 如果 suspend 的返回类型为具体数据类型返回 SuspendForBody
        return (HttpServiceMethod<ResponseT, ReturnT>) new SuspendForBody<>(requestFactory,
          callFactory, responseConverter, (CallAdapter<ResponseT, Call<ResponseT>>) callAdapter, continuationBodyNullable);
    }
}
```

#### 处理返回值为 Response 的 suspend 方法

```java
static final class SuspendForResponse<ResponseT> extends HttpServiceMethod<ResponseT, Object> {
    private final CallAdapter<ResponseT, Call<ResponseT>> callAdapter;

    SuspendForResponse(RequestFactory requestFactory, okhttp3.Call.Factory callFactory,
        Converter<ResponseBody, ResponseT> responseConverter, CallAdapter<ResponseT, Call<ResponseT>> callAdapter) {
        super(requestFactory, callFactory, responseConverter);
        this.callAdapter = callAdapter;
    }

    @Override protected Object adapt(Call<ResponseT> call, Object[] args) {
        // 参数里的 call 为 OkHttpCall
        call = callAdapter.adapt(call);
        
        //noinspection unchecked Checked by reflection inside RequestFactory.
        // 获取最后一个参数 Continuation, 用于接收返回结果
        Continuation<Response<ResponseT>> continuation = (Continuation<Response<ResponseT>>) args[args.length - 1];
        // 等待 Response 的返回
        return KotlinExtensions.awaitResponse(call, continuation);
    }
}
```

现在看下`awaitReponse()`，这个是kotlin代码：

```kotlin
suspend fun <T : Any> Call<T>.awaitResponse(): Response<T> {
  return suspendCancellableCoroutine { continuation ->
    continuation.invokeOnCancellation {
      cancel()
    }
    enqueue(object : Callback<T> {
      override fun onResponse(call: Call<T>, response: Response<T>) {
        continuation.resume(response)
      }

      override fun onFailure(call: Call<T>, t: Throwable) {
        continuation.resumeWithException(t)
      }
    })
  }
}
```

将`Call#enqueue`封装成suspend方法，调用的是异步的enqueue，也就是说在协程中用Retrofit+suspend是不需要切换线程的。

#### 处理返回值为具体数据类型的 suspend 方法

```java
static final class SuspendForBody<ResponseT> extends HttpServiceMethod<ResponseT, Object> {
    private final CallAdapter<ResponseT, Call<ResponseT>> callAdapter;
    private final boolean isNullable;

    SuspendForBody(RequestFactory requestFactory, okhttp3.Call.Factory callFactory,
        Converter<ResponseBody, ResponseT> responseConverter, CallAdapter<ResponseT, Call<ResponseT>> callAdapter, boolean isNullable) {
        super(requestFactory, callFactory, responseConverter);
        this.callAdapter = callAdapter;
        this.isNullable = isNullable;
    }

    @Override protected Object adapt(Call<ResponseT> call, Object[] args) {
        // 参数里的 call 为 OkHttpCall
        call = callAdapter.adapt(call);
            
        //noinspection unchecked Checked by reflection inside RequestFactory.
        // 获取最后一个参数 Continuation, 用于接收返回结果
        Continuation<ResponseT> continuation = (Continuation<ResponseT>) args[args.length - 1];
        
        // Calls to OkHttp Call.enqueue() like those inside await and awaitNullable can sometimes
        // invoke the supplied callback with an exception before the invoking stack frame can return.
        // Coroutines will intercept the subsequent invocation of the Continuation and throw the
        // exception synchronously. A Java Proxy cannot throw checked exceptions without them being
        // declared on the interface method. To avoid the synchronous checked exception being wrapped
        // in an UndeclaredThrowableException, it is intercepted and supplied to a helper which will
        // force suspension to occur so that it can be instead delivered to the continuation to
        // bypass this restriction.
        try {
            // 这里不用纠结 isNullable, Retrofit 就没有实现如何判断方法返回结果是否可空，所以我们直接看 await 方法就行。
            return isNullable
                ? KotlinExtensions.awaitNullable(call, continuation)
                : KotlinExtensions.await(call, continuation);
        } catch (Exception e) {
            return KotlinExtensions.yieldAndThrow(e, continuation);
        }
    }
}
```

接着看await方法，这也是个kotlin方法：

```kotlin
suspend fun <T : Any> Call<T>.await(): T {
  return suspendCancellableCoroutine { continuation ->
    continuation.invokeOnCancellation {
      cancel()
    }
    enqueue(object : Callback<T> {
      override fun onResponse(call: Call<T>, response: Response<T>) {
        if (response.isSuccessful) { // 判断请求是否成功
          val body = response.body()
          if (body == null) { // 如果具体数据类型为 null 也表示失败，直接返回异常
            val invocation = call.request().tag(Invocation::class.java)!!
            val method = invocation.method()
            val e = KotlinNullPointerException("Response from " +
                method.declaringClass.name + '.' + method.name +
                " was null but response body type was declared as non-null")
            continuation.resumeWithException(e) // 所以执行 suspend 方法的时候我们需要 try catch 去捕获异常。
          } else {
            continuation.resume(body) // 返回具体数据类型
          }
        } else {
          // 请求失败，返回异常。所以执行 suspend 方法的时候我们需要 try catch 去捕获异常。
          continuation.resumeWithException(HttpException(response))
        }
      }

      override fun onFailure(call: Call<T>, t: Throwable) {
        // 请求失败，返回异常。所以执行 suspend 方法的时候我们需要 try catch 去捕获异常。
        continuation.resumeWithException(t)
      }
    })
  }
}
```

## Retrofit协程小结

- Retrofit 对协程的支持其实就增加了不到 200 行代码，尤其是创建 suspend 方法的 CallAdapter 简直惊艳到我了，创建了一个自定义的 Call 类 型就完美地复用之前的代码。
- Retrofit使用协程时，不需要withContext来切换线程了，因为用的是OkHttp的enqueue异步方法，Retrofit只是包装成一个suspend方法

## 异常

### java.lang.IllegalArgumentException: Unable to create call adapter

```java
W: java.lang.IllegalArgumentException: Unable to create call adapter for me.hacket.assistant.samples.kotlin.协程.retrofit.ListBeanResponse<me.hacket.assistant.samples.kotlin.协程.retrofit.Chapter>
W:     for method Api.getChapters
W:     at retrofit2.Utils.methodError(Utils.java:52)
W:     at retrofit2.HttpServiceMethod.createCallAdapter(HttpServiceMethod.java:105)
W:     at retrofit2.HttpServiceMethod.parseAnnotations(HttpServiceMethod.java:66)
W:     at retrofit2.ServiceMethod.parseAnnotations(ServiceMethod.java:37)
W:     at retrofit2.Retrofit.loadServiceMethod(Retrofit.java:170)
W:     at retrofit2.Retrofit$1.invoke(Retrofit.java:149)
W:     at java.lang.reflect.Proxy.invoke(Proxy.java:1006)
W:     at $Proxy2.getChapters(Unknown Source)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1$1.invokeSuspend(RetrofitCoroutine.kt:22)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1$1.invoke(Unknown Source:10)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.BaseSuspendApiKt.withHttpContext(BaseSuspendApi.kt:43)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1.invokeSuspend(RetrofitCoroutine.kt:20)
W:     at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
W:     at kotlinx.coroutines.DispatchedTask.run(Dispatched.kt:241)
W:     at androidx.lifecycle.DispatchQueue.drainQueue(DispatchQueue.kt:76)
W:     at androidx.lifecycle.DispatchQueue.enqueue(DispatchQueue.kt:106)
W:     at androidx.lifecycle.DispatchQueue.runOrEnqueue(DispatchQueue.kt:96)
W:     at androidx.lifecycle.PausingDispatcher.dispatch(PausingDispatcher.kt:184)
W:     at kotlinx.coroutines.DispatchedKt.resumeCancellable(Dispatched.kt:423)
W:     at kotlinx.coroutines.intrinsics.CancellableKt.startCoroutineCancellable(Cancellable.kt:26)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.withContext(Builders.common.kt:162)
W:     at kotlinx.coroutines.BuildersKt.withContext(Unknown Source:1)
W:     at androidx.lifecycle.PausingDispatcherKt$whenStateAtLeast$2.invokeSuspend(PausingDispatcher.kt:163)
W:     at androidx.lifecycle.PausingDispatcherKt$whenStateAtLeast$2.invoke(Unknown Source:10)
W:     at kotlinx.coroutines.intrinsics.UndispatchedKt.startUndispatchedOrReturn(Undispatched.kt:91)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.withContext(Builders.common.kt:156)
W:     at kotlinx.coroutines.BuildersKt.withContext(Unknown Source:1)
W:     at androidx.lifecycle.PausingDispatcherKt.whenStateAtLeast(PausingDispatcher.kt:157)
W:     at androidx.lifecycle.PausingDispatcherKt.whenCreated(PausingDispatcher.kt:43)
W:     at androidx.lifecycle.LifecycleCoroutineScope$launchWhenCreated$1.invokeSuspend(Lifecycle.kt:74)
W:     at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
W:     at kotlinx.coroutines.DispatchedKt.resumeCancellable(Dispatched.kt:457)
W:     at kotlinx.coroutines.intrinsics.CancellableKt.startCoroutineCancellable(Cancellable.kt:26)
W:     at kotlinx.coroutines.CoroutineStart.invoke(CoroutineStart.kt:109)
W:     at kotlinx.coroutines.AbstractCoroutine.start(AbstractCoroutine.kt:154)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.launch(Builders.common.kt:54)
W:     at kotlinx.coroutines.BuildersKt.launch(Unknown Source:1)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.launch$default(Builders.common.kt:47)
W:     at kotlinx.coroutines.BuildersKt.launch$default(Unknown Source:1)
W:     at androidx.lifecycle.LifecycleCoroutineScope.launchWhenCreated(Lifecycle.kt:73)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1.onClick(RetrofitCoroutine.kt:18)
W:     at android.view.View.performClick(View.java:7140)
W:     at android.view.View.performClickInternal(View.java:7117)
W:     at android.view.View.access$3500(View.java:801)
W:     at android.view.View$PerformClick.run(View.java:27351)
W:     at android.os.Handler.handleCallback(Handler.java:883)
W:     at android.os.Handler.dispatchMessage(Handler.java:100)
W:     at android.os.Looper.loop(Looper.java:214)
W:     at android.app.ActivityThread.main(ActivityThread.java:7356)
W:     at java.lang.reflect.Method.invoke(Native Method)
W:     at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:492)
W:     at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:930)
W: Caused by: java.lang.IllegalArgumentException: Could not locate call adapter for me.hacket.assistant.samples.kotlin.协程.retrofit.ListBeanResponse<me.hacket.assistant.samples.kotlin.协程.retrofit.Chapter>.
W:   Tried:
W:    * retrofit2.CompletableFutureCallAdapterFactory
W:    * retrofit2.DefaultCallAdapterFactory
W:     at retrofit2.Retrofit.nextCallAdapter(Retrofit.java:241)
W:     at retrofit2.Retrofit.callAdapter(Retrofit.java:205)
W:     at retrofit2.HttpServiceMethod.createCallAdapter(HttpServiceMethod.java:103)
W: 	... 50 more
W: timeout expired while flushing socket, closing
E: No valid NAT64 prefix (100, <unspecified>/0)
W: java.lang.IllegalArgumentException: Unable to create call adapter for me.hacket.assistant.samples.kotlin.协程.retrofit.ListBeanResponse<me.hacket.assistant.samples.kotlin.协程.retrofit.Chapter>
W:     for method Api.getChapters
W:     at retrofit2.Utils.methodError(Utils.java:52)
W:     at retrofit2.HttpServiceMethod.createCallAdapter(HttpServiceMethod.java:105)
W:     at retrofit2.HttpServiceMethod.parseAnnotations(HttpServiceMethod.java:66)
W:     at retrofit2.ServiceMethod.parseAnnotations(ServiceMethod.java:37)
W:     at retrofit2.Retrofit.loadServiceMethod(Retrofit.java:170)
W:     at retrofit2.Retrofit$1.invoke(Retrofit.java:149)
W:     at java.lang.reflect.Proxy.invoke(Proxy.java:1006)
W:     at $Proxy2.getChapters(Unknown Source)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1$1.invokeSuspend(RetrofitCoroutine.kt:22)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1$1.invoke(Unknown Source:10)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.BaseSuspendApiKt.withHttpContext(BaseSuspendApi.kt:43)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1$1.invokeSuspend(RetrofitCoroutine.kt:20)
W:     at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
W:     at kotlinx.coroutines.DispatchedTask.run(Dispatched.kt:241)
W:     at androidx.lifecycle.DispatchQueue.drainQueue(DispatchQueue.kt:76)
W:     at androidx.lifecycle.DispatchQueue.enqueue(DispatchQueue.kt:106)
W:     at androidx.lifecycle.DispatchQueue.runOrEnqueue(DispatchQueue.kt:96)
W:     at androidx.lifecycle.PausingDispatcher.dispatch(PausingDispatcher.kt:184)
W:     at kotlinx.coroutines.DispatchedKt.resumeCancellable(Dispatched.kt:423)
W:     at kotlinx.coroutines.intrinsics.CancellableKt.startCoroutineCancellable(Cancellable.kt:26)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.withContext(Builders.common.kt:162)
W:     at kotlinx.coroutines.BuildersKt.withContext(Unknown Source:1)
W:     at androidx.lifecycle.PausingDispatcherKt$whenStateAtLeast$2.invokeSuspend(PausingDispatcher.kt:163)
W:     at androidx.lifecycle.PausingDispatcherKt$whenStateAtLeast$2.invoke(Unknown Source:10)
W:     at kotlinx.coroutines.intrinsics.UndispatchedKt.startUndispatchedOrReturn(Undispatched.kt:91)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.withContext(Builders.common.kt:156)
W:     at kotlinx.coroutines.BuildersKt.withContext(Unknown Source:1)
W:     at androidx.lifecycle.PausingDispatcherKt.whenStateAtLeast(PausingDispatcher.kt:157)
W:     at androidx.lifecycle.PausingDispatcherKt.whenCreated(PausingDispatcher.kt:43)
W:     at androidx.lifecycle.LifecycleCoroutineScope$launchWhenCreated$1.invokeSuspend(Lifecycle.kt:74)
W:     at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
W:     at kotlinx.coroutines.DispatchedKt.resumeCancellable(Dispatched.kt:457)
W:     at kotlinx.coroutines.intrinsics.CancellableKt.startCoroutineCancellable(Cancellable.kt:26)
W:     at kotlinx.coroutines.CoroutineStart.invoke(CoroutineStart.kt:109)
W:     at kotlinx.coroutines.AbstractCoroutine.start(AbstractCoroutine.kt:154)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.launch(Builders.common.kt:54)
W:     at kotlinx.coroutines.BuildersKt.launch(Unknown Source:1)
W:     at kotlinx.coroutines.BuildersKt__Builders_commonKt.launch$default(Builders.common.kt:47)
W:     at kotlinx.coroutines.BuildersKt.launch$default(Unknown Source:1)
W:     at androidx.lifecycle.LifecycleCoroutineScope.launchWhenCreated(Lifecycle.kt:73)
W:     at me.hacket.assistant.samples.kotlin.协程.retrofit.RetrofitCoroutine$onCreate$1.onClick(RetrofitCoroutine.kt:18)
W:     at android.view.View.performClick(View.java:7140)
W:     at android.view.View.performClickInternal(View.java:7117)
W:     at android.view.View.access$3500(View.java:801)
W:     at android.view.View$PerformClick.run(View.java:27351)
W:     at android.os.Handler.handleCallback(Handler.java:883)
W:     at android.os.Handler.dispatchMessage(Handler.java:100)
W:     at android.os.Looper.loop(Looper.java:214)
W:     at android.app.ActivityThread.main(ActivityThread.java:7356)
W:     at java.lang.reflect.Method.invoke(Native Method)
W:     at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:492)
W:     at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:930)
W: Caused by: java.lang.IllegalArgumentException: Could not locate call adapter for me.hacket.assistant.samples.kotlin.协程.retrofit.ListBeanResponse<me.hacket.assistant.samples.kotlin.协程.retrofit.Chapter>.
W:   Tried:
W:    * retrofit2.CompletableFutureCallAdapterFactory
W:    * retrofit2.DefaultCallAdapterFactory
W:     at retrofit2.Retrofit.nextCallAdapter(Retrofit.java:241)
W:     at retrofit2.Retrofit.callAdapter(Retrofit.java:205)
W:     at retrofit2.HttpServiceMethod.createCallAdapter(HttpServiceMethod.java:103)
W: 	... 50 more
```

原因:

```kotlin
@GET("/wxarticle/chapters/json")
fun getChapters(): ListBeanResponse<Chapter>
```

没有带上`suspend`关键字

```kotlin
@GET("/wxarticle/chapters/json")
suspend fun getChapters(): ListBeanResponse<Chapter>
```

## Ref

- [x] Retrofit 如何处理协程<br /><https://paradisehell.org/2021/01/30/how-do-retorfit-handle-coroutines/>

# Retrofit遇到的问题？

## 接口实例不支持T

用retrofit执行网络请求的service接口，必须是具体的类型，而不能是T泛型

```java
@GET("api/customer/")
Call<DataModelResponse<T>> getList(@Query("take") int page, @Query("skip") int step);
```

> 官方issue说明：<https://github.com/square/retrofit/issues/2012>

## java.lang.IllegalArgumentException: A [@Path ](/Path) parameter must not come after a [@Query. ](/Query.)

错误代码：

```kotlin
@GET(LEVEL_USER_INFO)
suspend fun levelUserInfo(
        @Query("with_level_progress") with_level_progress: Int = 1,
        @Path("uid") uid: Int

): UserLevelUserInfoModel
```

解决：

```kotlin
@GET(LEVEL_USER_INFO)
suspend fun levelUserInfo(
        @Path("uid") uid: Int,
        @Query("with_level_progress") with_level_progress: Int = 1

): UserLevelUserInfoModel
```

## Retrofit Call

Call实例可以直接在同步或者异步，但只能用一次，调用`clone()`可以再次用

## `/`写在哪？

`baseUrl`结尾以`/`结尾，而接口方法的path就不以`/`开头

```java
Retrofit retrofit = new Retrofit.Builder()
    //设置baseUrl,注意baseUrl 应该以/ 结尾。
    .baseUrl("http://news-at.zhihu.com/api/4/")
```

## Retrofit有多个BaseUrl怎么处理？

1. 通过`@Headers`将baseUrl添加进去

```java
@Headers("urlname:test1") 
@GET("地址1") 
Observable<BaseResponse<List<Bean>>> getHData(@QueryMap Map<String, String> map);
 
@Headers("urlname:test2") 
@GET("地址2") 
Observable<BaseResponse<List<Bean>>> getJData(@QueryMap Map<String, String> map);
```

2. 添加拦截器，拦截baseUrl进行替换

```java
public class BaseUrlInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        //获取request
        Request request = chain.request();
        //从request中获取原有的HttpUrl实例oldHttpUrl
        HttpUrl oldHttpUrl = request.url();
        //获取request的创建者builder
        Request.Builder builder = request.newBuilder();
        //从request中获取headers，通过给定的键url_name
        List<String> headerValues = request.headers("urlname");
        if (headerValues != null && headerValues.size() > 0) {
            //如果有这个header，先将配置的header删除，因此header仅用作app和okhttp之间使用
            builder.removeHeader("urlname");
            //匹配获得新的BaseUrl
            String headerValue = headerValues.get(0);
            HttpUrl newBaseUrl = null;
            if ("test1".equals(headerValue)) {
                newBaseUrl = HttpUrl.parse(BASE_URL1);
            }else if ("test2".equals(headerValue)) {
                newBaseUrl = HttpUrl.parse(BASE_URL2);
            }else{
                newBaseUrl = oldHttpUrl;
            }
            //重建新的HttpUrl，修改需要修改的url部分
            HttpUrl newFullUrl = oldHttpUrl
                    .newBuilder()
                    .scheme("https")//更换网络协议
                    .host(newBaseUrl.host())//更换主机名
                    .port(newBaseUrl.port())//更换端口
                    .removePathSegment(0)//移除第一个参数
                    .build();
            //重建这个request，通过builder.url(newFullUrl).build()；
            // 然后返回一个response至此结束修改
            Log.e("Url", "intercept: "+newFullUrl.toString());
            return chain.proceed(builder.url(newFullUrl).build());
        }
        return chain.proceed(request);
    }
}
```

3. 配置OkHttpClient

```java
// 创建一个OkHttpClient并设置超时时间
OkHttpClient client = new OkHttpClient.Builder()
    .readTimeout(READ_TIME_OUT, TimeUnit.MILLISECONDS)
    .connectTimeout(CONNECT_TIME_OUT, TimeUnit.MILLISECONDS)
    .addInterceptor(mRewriteCacheControlInterceptor)//没网的情况下
    .addNetworkInterceptor(mRewriteCacheControlInterceptor)//有网的情况下
    .addInterceptor(new BaseUrlInterceptor())
    .addInterceptor(logInterceptor)
    .cache(cache)
    .build();
```

## Retrofit2 handling HTTP 204 (No Content response ) situation with RxJava's Observable concepts

- 背景：使用 `Pgyer Http v2` 上传 APK 接口，上传成功后，返回 204，not content

- 问题：正常写，由于 body 未返回，会当成失败来处理

```kotlin
@GET("/user/{topic}")
fun getAllUserFor(@Path(value="topic",encoded=true) topic:String) :Observable<List<User>>
```

- 解决：

```kotlin
@GET("/user/{topic}")
fun getAllUserFor(@Path(value="topic",encoded=true) topic:String) :Observable<Result<List<User>>>

// 调用
api.getAllUserFor(topic)
	.observeOn(AndroidSchedulers.mainThread())
	.subscribeOn(Schedulers.io())
	.subscribe{ result ->
	   if(result.isError)
		   //Network Error
	   result.response()?.also {
		   if(result.isSuccessful)
			   //Success
		   else{
			   //api error
		   }
	}
}
```

- Ref：

[android - Retrofit2 handling HTTP 204 (No Content response ) situation with RxJava's Observable concepts - Stack Overflow](https://stackoverflow.com/questions/50386909/retrofit2-handling-http-204-no-content-response-situation-with-rxjavas-obser)

# Retrofit2原理

## Retrofit2原理

### Retrofit2注意细节

- Retrofit的接口类不能继承其他的接口
- Retrofit.create() 返回的是一个代理类，用的是动态代理，为什么是个代理类？<br />因为我要监听该接口所有的方法
- 动态代理，遇到Object类，那么跳过代理直接执行方法；如果是JDK8的default方法，那么也是跳过代理直接执行方法
- 为什么用到了运行时，而不是编译时？<br />如果接口中方法过多，如果是编译时，那么在运行时会全部加载该接口所有方法，消耗内存；但现在是利用动态代理，在运行时，需要哪个方法就动态的加载，然后缓存该方法。
- Retrofit中对方法上注解的解析，需要对反射注解加强
- Retrofit使用动态代理，invoke返回值，需要对动态代理加强

### 1、创建Retrofit对象

通过Retrofit.Builder对Retrofit做一些配置

```java
Retrofit retrofit = new Retrofit.Builder()
                        .baseUrl(BaseUrl.GITHUB_USER_INFO)
                        .addConverterFactory(GsonConverterFactory.create())
                        .build();
```

用到了Builder模式、外观模式（Facade，门面模式）。

### 2、定义API并获取实例

定义API接口：

```java
public interface ApiGithubUser {
    @GET("users/{user}")
    Call<GithubUser> getGithubUser(@NonNull @Path("user") String user);
}
```

获取实例:

```java
ApiGithubUser apiGithubUser = retrofit.create(ApiGithubUser.class);
```

create(service)方法怎么实现的？

```java
public <T> T create(final Class<T> service) {
    Utils.validateServiceInterface(service); // 接口校验，不能继承其他接口
    if (validateEagerly) { // 是否早点load method并缓存起来，默认false
      eagerlyValidateMethods(service);
    }
    return (T) Proxy.newProxyInstance(service.getClassLoader(), new Class<?>[] { service },
        new InvocationHandler() {
          private final Platform platform = Platform.get();

          @Override public Object invoke(Object proxy, Method method, Object... args)
              throws Throwable {
            // If the method is a method from Object then defer to normal invocation.
            if (method.getDeclaringClass() == Object.class) {
              return method.invoke(this, args);
            }
            if (platform.isDefaultMethod(method)) {
              return platform.invokeDefaultMethod(method, service, proxy, args);
            }
            ServiceMethod serviceMethod = loadServiceMethod(method);
            OkHttpCall okHttpCall = new OkHttpCall<>(serviceMethod, args);
            return serviceMethod.callAdapter.adapt(okHttpCall);
          }
        }); // 动态代理
}
```

- 第2行，validateServiceInterface()进行了接口的校验<br />validateServiceInterface()方法进行了service接口的校验，service必须是一个接口，而且不能继承其他接口

```java
static <T> void validateServiceInterface(Class<T> service) {
    if (!service.isInterface()) {
      throw new IllegalArgumentException("API declarations must be interfaces.");
    }
    if (service.getInterfaces().length > 0) {
      throw new IllegalArgumentException("API interfaces must not extend other interfaces.");
    }
}
```

- 第3行，急切的验证方法，通过在`Retrofit.Builder.validateEagerly(boolean)`设置，最后调用`loadServiceMethod(Method)`来将`Method`包装成`ServiceMethod`缓存起来，后面详细讲解
- 第6行，用了动态代理来来返回了一个代理类，为什么需要返回是一个代理类呢？因为需要监听该接口中所有的方法调用
- 第13行，如果该方法是Object对象中的，那么就默认调用，如（equals()、toString()）；如果是default方法（jdk8引入），就调用default方法
- 第19行，最后3行是重点

```java
ServiceMethod serviceMethod = loadServiceMethod(method);
OkHttpCall okHttpCall = new OkHttpCall<>(serviceMethod, args);
return serviceMethod.callAdapter.adapt(okHttpCall);
```

#### 2.1 ServiceMethod

首先看ServiceMethod。注释：把对接口方法的调用转为一次HTTP调用。

```java
// Retrofit#create()
ServiceMethod serviceMethod = loadServiceMethod(method);
```

一个ServiceMethod对象对应于API Interface的一个方法，`loadServiceMethod(Method method)`负责加载ServiceMethod，并实现了缓存逻辑，同一个API的同一个方法只会创建一次。

```java
// Retrofit#loadServiceMethod()
private final Map<Method, ServiceMethod> serviceMethodCache = new LinkedHashMap<>();
ServiceMethod loadServiceMethod(Method method) {
    ServiceMethod result;
    synchronized (serviceMethodCache) {
      result = serviceMethodCache.get(method);
      if (result == null) {
        result = new ServiceMethod.Builder(this, method).build();
        serviceMethodCache.put(method, result);
      }
    }
    return result;
}
```

里面有一个serviceMethodCache是一个Map，以Method为key，ServiceMethod为value的Map；然后包装成ServiceMethod返回，并将其缓存到serviceMethodCache，并且做了线程同步。

ServiceMethod的构造方法：

```java
// ServiceMethod
ServiceMethod(Builder<T> builder) {
    this.callFactory = builder.retrofit.callFactory();
    this.callAdapter = builder.callAdapter;
    this.baseUrl = builder.retrofit.baseUrl();
    this.responseConverter = builder.responseConverter;
    this.httpMethod = builder.httpMethod;
    this.relativeUrl = builder.relativeUrl;
    this.headers = builder.headers;
    this.contentType = builder.contentType;
    this.hasBody = builder.hasBody;
    this.isFormEncoded = builder.isFormEncoded;
    this.isMultipart = builder.isMultipart;
    this.parameterHandlers = builder.parameterHandlers;
 }
```

成员变量很多，重点关注四个成员：`callFactroy`、`callAdapter`、`responseConverter`、`parameterHandlers`。

##### 2.1.1 callFactory

负责创建HTTP请求，HTTP请求被抽象为了okhttp3.Call类，它表示一个已经准备好，可以随时执行的HTTP请求。callFactory默认实现是一个OKHttpClient。<br />callFactory在ServiceMethod中的初始化：

```java
// ServiceMethod#ServiceMethod(Builder)
this.callFactory = builder.retrofit.callFactory();
```

ServiceMethod中的callFactory实际上是由Retrofit类提供的，

```java
// Retrofit
public okhttp3.Call.Factory callFactory() {
    return callFactory;
}
```

如果没有指定，设置为一个默认的值，为OkHttp3中的OkhttpClient

```java
// Retrofit.Builder#build()
okhttp3.Call.Factory callFactory = this.callFactory;
if (callFactory == null) {
    callFactory = new OkHttpClient();
}
```

##### 2.1.2 callAdapter

callAdapter把`retrofit2.Call<T>`转换为`T`，这个过程会发送一个HTTP请求，拿到服务器返回的数据(通过Okhttp3.Call实现)，把数据转换成（由`Converter<F,T>`实现）声明的T类型对象。<br />在ServiceMethod中初始化：

```java
// ServiceMethod#ServiceMethod(Builder)
this.callAdapter = builder.callAdapter;
// ServiceMethod.Builder
static final class Builder<T> {
    CallAdapter<?> callAdapter;
    public ServiceMethod build() {
        callAdapter = createCallAdapter();
    }
}
```

并在build()方法中调用`createCallAdapter()`构建CallAdapter：

```java
// ServiceMethod.Builder#createCallAdapter()
private CallAdapter<?> createCallAdapter() {
    Type returnType = method.getGenericReturnType();
    if (Utils.hasUnresolvableType(returnType)) {
    throw methodError(
        "Method return type must not include a type variable or wildcard: %s", returnType);
    }
    if (returnType == void.class) {
    throw methodError("Service methods cannot return void.");
    }
    Annotation[] annotations = method.getAnnotations();
    try {
    return retrofit.callAdapter(returnType, annotations);
    } catch (RuntimeException e) { // Wide exception range because factories are user code.
    throw methodError(e, "Unable to create call adapter for %s", returnType);
    }
}
```

callAdapter的创建，最终还是由Retrofit类提供，：

```java
// Retrofit#callAdapter()
public CallAdapter<?> callAdapter(Type returnType, Annotation[] annotations) {
    return nextCallAdapter(null, returnType, annotations);
}
// Retrofit#nextCallAdapter()
public CallAdapter<?> nextCallAdapter(CallAdapter.Factory skipPast, Type returnType,Annotation[] annotations) {
    checkNotNull(returnType, "returnType == null");
    checkNotNull(annotations, "annotations == null");

    int start = adapterFactories.indexOf(skipPast) + 1;
    for (int i = start, count = adapterFactories.size(); i < count; i++) {
        CallAdapter<?> adapter = adapterFactories.get(i).get(returnType, annotations, this);
        if (adapter != null) {
            return adapter;
    }
}
```

发现，就是通过循环遍历`adapterFactories`来得到CallAdapter，而adapterFactories从哪里来，从Retrofit.Builder中的`addCallAdapterFactory()`方法设置：

```java
// Retrofit
private final List<CallAdapter.Factory> adapterFactories;

// Retrofit.Builder
public static final class Builder {
    List<CallAdapter.Factory> adapterFactories = new ArrayList<>(this.adapterFactories);
    // 添加一个CallAdapter.Factory
    public Builder addCallAdapterFactory(CallAdapter.Factory factory) {
        adapterFactories.add(checkNotNull(factory, "factory == null"));
        return this;
    }
    public Retrofit build() {
        // 默认添加的CallAdapter.Factory
        List<CallAdapter.Factory> adapterFactories = new ArrayList<>(this.adapterFactories);
        adapterFactories.add(platform.defaultCallAdapterFactory(callbackExecutor));
    }
}
// Paltform#defaultCallAdapterFactory()
// 默认添加的CallAdapter.Factory
CallAdapter.Factory defaultCallAdapterFactory(Executor callbackExecutor) {
    if (callbackExecutor != null) {
      return new ExecutorCallAdapterFactory(callbackExecutor);
    }
    return DefaultCallAdapterFactory.INSTANCE;
}
```

可以发现，Retrofit默认有一个CallAdapter.Factory是`ExecutorCallAdapterFactory`

##### 2.1.3 responseConverter

responseConverter是`Converter<ResponseBody,T>`类型，负责把服务器返回的数据（JOSN、XML、二进制或其他格式，由ResponseBody封装）转为T类型的对象。

responseConverter在ServiceMethod中初始化：

```java
// ServiceMethod#ServiceMethod(Builder)
this.responseConverter = builder.responseConverter;
```

ServiceMethod.Builder并没有提供添加responseConverter方法，而是`createResponseConverter()`方法来创建：

```java
// ServiceMethod.Builder#build()
responseConverter = createResponseConverter();
// ServiceMethod.Builder
responseConverter = createResponseConverter();
private Converter<ResponseBody, T> createResponseConverter() {
    Annotation[] annotations = method.getAnnotations();
    try {
    return retrofit.responseBodyConverter(responseType, annotations);
    } catch (RuntimeException e) { // Wide exception range because factories are user code.
    throw methodError(e, "Unable to create converter for %s", responseType);
    }
}
```

同样，responseConverter也是由Retrofit类提供，通过`Retrofit.Builder#addConverterFactory()`方法添加一个Converter.Factory，默认添加了一个`BuiltInConverters`

```java
// Retrofit
private final List<Converter.Factory> converterFactories;
// Retrofit.Builder
public static final class Builder {
    private List<Converter.Factory> converterFactories = new ArrayList<>();
    
    public Builder addConverterFactory(Converter.Factory factory) {
      converterFactories.add(checkNotNull(factory, "factory == null"));
      return this;
    }
    
    Builder(Platform platform) {
      this.platform = platform;
      converterFactories.add(new BuiltInConverters());
    }
    
    public Retrofit build() {
        List<Converter.Factory> converterFactories = new ArrayList<>(this.converterFactories);
    }
}
```

##### 2.1.4 parameterHandlers

parameterHandlers负责解析API定义时每个方法的参数，并在构造HTTP请求时设置参数。

在ServiceMethod构造方法中初始化，

```java
// ServiceMethod
private final ParameterHandler<?>[] parameterHandlers;
ServiceMethod(Builder<T> builder) {
    this.parameterHandlers = builder.parameterHandlers;
}
// ServiceMethod.Builder
static final class Builder<T> {
    ParameterHandler<?>[] parameterHandlers;
    public ServiceMethod build() {
        int parameterCount = parameterAnnotationsArray.length;
        parameterHandlers = new ParameterHandler<?>[parameterCount];
        for (int p = 0; p < parameterCount; p++) {
            Type parameterType = parameterTypes[p];
            if (Utils.hasUnresolvableType(parameterType)) {
              throw parameterError(p, "Parameter type must not include a type variable or wildcard: %s",
                  parameterType);
            }

            Annotation[] parameterAnnotations = parameterAnnotationsArray[p];
            if (parameterAnnotations == null) {
              throw parameterError(p, "No Retrofit annotation found.");
            }

            parameterHandlers[p] = parseParameter(p, parameterType, parameterAnnotations);
        }
    }
}
```

每个参数都会有一个ParameterHandler，由ServiceMethod#parseParameter()方法负责创建，其主要内容是解析每个参数使用的注解类型（如@Path、@Query、@Field），对每种类型进行单独的处理。构造HTTP请求时，我们传递的参数都是字符串，那么Retrofit如何把我们传递的各种参数都转化为String，由Retrofit类提供的converter。

Converter.Factory除了提供responseBodyConverter，还提供requestBodyConverter和stringConverter，API方法中除了@Body和@Part类型的参数，都利用stringConverter进行转换，而@Body和@Part类型的参数则利用requestBodyConverter进行转换。<br />除了上面四种成员，ServiceMethod还包含了api方法中的url解析、众多关于泛型和反射相关代码。

#### 2.2 OkHttpCall

```java
// Retrofit#create()
OkHttpCall okHttpCall = new OkHttpCall<>(serviceMethod, args);
```

OkHttpCall实现了`retrofit2.Call`，我们会使用它的`execute()`，`enqueue(callback)`接口，来执行同步、异步请求。

##### 2.2.1 execute() 同步请求

```java
@Override
public Response<T> execute() throws IOException {
    okhttp3.Call call;

    synchronized (this) {
      // ...

      call = rawCall;
      if (call == null) {
        try {
          call = rawCall = createRawCall();
        } catch (IOException | RuntimeException e) {
          creationFailure = e;
          throw e;
        }
      }
    }

    if (canceled) {
      call.cancel();
    }

    return parseResponse(call.execute());
}
```

- 通过createRawCall()创建`okhttp3.Call`，包括其构造参数okhttp3.Request
- 执行网络请求call.execute()
- 解析网络请求返回的数据parseResponse(okhttp3.Response)

##### 2.2.1 enqueue() 异步请求

异步交给了okhttp3.Call#enqueue(responseCallback)实现，并在responseCallback调用`parseResponse()`解析响应数据，并转发给传入的callback。

#### 2.3 serviceMethod.callAdapter.adapt

```java
// Retrofit#create()
return serviceMethod.callAdapter.adapt(okHttpCall);
```

### 3、CallAdapter

`CallAdapter<T>#adapt(retrofit2.Call<R> call)`函数负责把`retrofit2.Call<R>`转为T。<br />DefaultCallAdapterFactory就是把T转为`retrofit2.Call<R>`，也就是直接返回参数。<br />ExecutorCallAdapterFactory<br />RxJava2CallAdapterFactory

### retrofit-adapters模块

retrofit模块内置了`DefaultCallAdapterFactory`和`ExecutorCallAdapterFactory`，它们都适用于API方法得到的类型是retrofit2.Call情形，DefaultCallAdapterFactory生产的adapter啥也不做，直接把参数返回，ExecutorCallAdapterFactory生产的adapter则会在异步调用时在指定的Executor上执行回调。

retrofit-adapters的各个子模块则实现了更多的工厂：<br />`GuavaCallAdapterFactory`<br />`Java8CallAdapterFactory`<br />`RxJavaCallAdapterFactory`

#### RxJavaCallAdapterFactory

// 待续

### retrofit-converters模块

retrofit模块内置了`BuiltInConverters`，只能处理`ResponseBody`，`RequestBody`和`String`类型的转换。而retrofit-converters中的子模块则提供了JSON、XML、ProtoBuf等类型数据的转换功能，而且还有多种转换方式可以选择。

### Reference

拆轮子系列：拆Retrofit（Piasy）<br />Retrofit分析-漂亮的解耦套路（stay）
