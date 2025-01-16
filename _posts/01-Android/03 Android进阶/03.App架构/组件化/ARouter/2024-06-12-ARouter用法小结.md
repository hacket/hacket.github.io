---
date created: 2024-06-12 15:27
date updated: 2024-12-24 00:30
dg-publish: true
---

# ARouter用法小结

## 背景

ARouter是阿里巴巴开源的Android平台中对页面、服务提供路由功能的中间件，提倡的是简单且够用。
Google提供的原声路由主要是通过intent，可以分成显示和隐式两种。

- 显示的方案会导致类之间的直接依赖问题，耦合严重；
- 隐式intent需要的配置清单中统一声明，首先有个暴露的问题，另外在多模块开发中协作也比较困难。只要调用startActivity后面的环节我们就无法控制了，在出现错误时无能为力，而ARouter可以在跳转过程中进行拦截，出现错误时可以实现降级策略

![|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999460349-0683d584-fc30-42ec-982c-0c3472376960.png#averageHue=%23f6cd39&clientId=u7fa04686-552f-4&from=paste&id=ue7632c4c&originHeight=331&originWidth=656&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u935390cc-bd0a-4e2b-83a5-a24d164b6e0&title=)

## 功能介绍(v1.5.0)

```
1、支持直接解析标准URL进行跳转，并自动注入参数到目标页面中
2、支持多模块工程使用
3、支持添加多个拦截器，自定义拦截顺序
4、支持依赖注入，可单独作为依赖注入框架使用
5、支持InstantRun
6、支持MultiDex(Google方案)
7、映射关系按组分类、多级管理，按需初始化
8、支持用户指定全局降级与局部降级策略
9、页面、拦截器、服务等组件均自动注册到框架
10、支持多种方式配置转场动画
11、支持获取Fragment
12、完全支持Kotlin以及混编(配置见文末 其他#5)
13、支持第三方 App 加固(使用 arouter-register 实现自动注册)
14、支持生成路由文档
15、提供 IDE 插件便捷的关联路径和目标类
```

## 典型应用场景

```
1、从外部URL映射到内部页面，以及参数传递与解析
2、跨模块页面跳转，模块间解耦
3、拦截跳转过程，处理登陆、埋点等逻辑
4、跨模块API调用，通过控制反转来做组件解耦
```

## 集成/初始化

### 配置依赖/路由文档

- Java语言

```groovy
android {
    defaultConfig {
        // ...
        javaCompileOptions {
            annotationProcessorOptions {
                // 生成路由表
                // 更新 build.gradle, 添加参数 AROUTER_GENERATE_DOC = enable
                // 生成的文档路径 : build/generated/source/apt/(debug or release)/com/alibaba/android/arouter/docs/arouter-map-of-${moduleName}.json
                arguments = [AROUTER_MODULE_NAME: project.getName(), AROUTER_GENERATE_DOC: "enable"]
            }
        }
    }
}

dependencies {
    // 替换成最新版本, 需要注意的是api
    // 要与compiler匹配使用，均使用最新版可以保证兼容
    compile 'com.alibaba:arouter-api:x.x.x'
    annotationProcessor 'com.alibaba:arouter-compiler:x.x.x' // Kotlin项目用kapt
    // ...
}
```

- Kotlin的项目集成：

```groovy
kapt {
    arguments {
        arg("AROUTER_MODULE_NAME", project.getName())
        arg("AROUTER_GENERATE_DOC", "enable")
    }
}
```

### 初始化

```kotlin
override fun onCreate() {
    super.onCreate()

    if (mIsDebug) {           // 这两行必须写在init之前，否则这些配置在init过程中将无效
        ARouter.openLog()     // 打印日志
        ARouter.openDebug()   // 开启调试模式(如果在InstantRun模式下运行，必须开启调试模式！线上版本需要关闭,否则有安全风险)
        ARouter.printStackTrace() // 打印日志的时候打印线程堆栈
    }
    ARouter.init(mApplication) // 尽可能早，推荐在Application中初始化
}
```

### Proguard规则

```
-keep public class com.alibaba.android.arouter.routes.**{*;}
-keep public class com.alibaba.android.arouter.facade.**{*;}
-keep class * implements com.alibaba.android.arouter.facade.template.ISyringe{*;}

# 如果使用了 byType 的方式获取 Service，需添加下面规则，保护接口
-keep interface * implements com.alibaba.android.arouter.facade.template.IProvider

# 如果使用了 单类注入，即不定义接口实现 IProvider，需添加下面规则，保护实现
# -keep class * implements com.alibaba.android.arouter.facade.template.IProvide
```

### 路由自动注册

> 使用 Gradle 插件实现路由表的自动加载。通过 ARouter 提供的注册插件进行路由表的自动加载(power by `AutoRegister`)， 默认通过扫描 dex 的方式 进行加载。通过 gradle 插件进行自动注册可以缩短初始化时间解决应用加固导致无法直接访问 dex 文件，初始化失败的问题，需要注意的是，该插件必须搭配 api 1.3.0 以上版本使用！

```groovy
apply plugin: 'com.alibaba.arouter'

buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath "com.alibaba:arouter-register:?"
    }
}
```

### ARouter插件

ARouter Helper

> 使用 IDE 插件导航到目标类

## 基本用法

### 页面跳转navigation

> [@Route ](/Route) 路径需要注意的是至少需要有两级，/group/path，其中group为组名

#### 简单的应用内跳转(Java)

> 不带参数跳转

```java
ARouter.getInstance()
        .build("/test/activity2")
        .navigation();
        
// 目标页
@Route(path = "/test/activity2")
public class Test2Activity extends AppCompatActivity
```

#### 跳转到Kotlin页

> 带参数跳转到Kotlin，Kotlin目标页用到@Autowired需要加上@JvmField注解才能注入

```kotlin
ARouter.getInstance()
        .build("/kotlin/test")
        .withString("name", "老王")
        .withInt("age", 23)
        .navigation();

// 目标页
@Route(path = "/kotlin/test")
class KotlinTestActivity : Activity() {

    @Autowired
    @JvmField var name: String? = null
    @Autowired
    @JvmField var age: Int? = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        ARouter.getInstance().inject(this)  // Start auto inject.

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_kotlin_test)

        content.text = "name = $name, age = $age"
    }
}
```

#### 跳转应用内携带参数

```java
ARouter.getInstance()
         .build("/test/activity2")
         .withString("key1", "value1")
         .navigation();
         
// 目标页
@Route(path = "/test/activity2")
public class Test2Activity extends AppCompatActivity {
    @Autowired(name = "key1")
    String key;
    
    // 自动注入，ARouter.getInstance().inject(this);
}
```

#### 跳转ActivityForResult

```java
ARouter.getInstance()
        .build("/test/activity2")
        .withString("key1", "test2 key")
        .navigation(this, 666);

// 目标页
@Route(path = "/test/activity2")
public class Test2Activity extends AppCompatActivity {

    @Autowired(name = "key1")
    String key;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test2);
        ARouter.getInstance().inject(this);
        
        TextView tv_result = findViewById(R.id.tv_result);
        tv_result.setText("获取到了key1：" + key);

        Intent data = new Intent();
        data.putExtra("result", "哈哈哈");
        setResult(999, data);
    }
}

// 接收页
@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    switch (requestCode) {
        case 666:
            String result = data.getStringExtra("result");
            Log.e("activityResult", String.valueOf(resultCode));
            ToastUtils.showShort("onActivityResult获取到了：" + resultCode + "，" + result);
            break;
        default:
            break;
    }
}
```

#### URI跳转

```java
// 新建一个Activity用于监听Schame事件,之后直接把url传递给ARouter即可
public class SchameFilterActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Uri uri = getIntent().getData();
    ARouter.getInstance().build(uri).navigation();
    finish();
    }
}
```

AndroidManifest.xml

```xml
<activity android:name=".activity.SchameFilterActivity">
    <!-- Schame -->
    <intent-filter>
        <data
        android:host="m.aliyun.com"
        android:scheme="arouter"/>

        <action android:name="android.intent.action.VIEW"/>

        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
    </intent-filter>
</activity>
```

跳转

```java
Uri testUriMix = Uri.parse("arouter://m.aliyun.com/test/activity2");
ARouter.getInstance().build(testUriMix)
        .withString("key1", "value1")
        .navigation();
```

目标页

```java
@Route(path = "/test/activity2")
public class Test2Activity extends AppCompatActivity {

    @Autowired(name = "key1")
    String key;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test2);

        ARouter.getInstance().inject(this);

//        String value = getIntent().getStringExtra("key1");
//        if (!TextUtils.isEmpty(value)) {
//            Toast.makeText(this, "exist param :" + value, Toast.LENGTH_LONG).show();
//
//        }

        TextView tv_result = findViewById(R.id.tv_result);
        tv_result.setText("获取到了key1：" + key);
    }
}
```

### 获取Fragment实例

```java
Fragment fragment = (Fragment) ARouter.getInstance()
                        .build("/test/fragment")
                        .navigation();
// 目标页
@Route(path = "/test/fragment")
public class BlankFragment extends Fragment {
    public BlankFragment() {
        // Required empty public constructor
        ToastUtils.showShort("BlankFragment初始化了：/test/fragment");
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        TextView textView = new TextView(getActivity());
        return textView;
    }
}
```

### Broadcast/ContentProvider/Service

```java
private Object _navigation(final Context context, final Postcard postcard, final int requestCode, final NavigationCallback callback) {
        final Context currentContext = null == context ? mContext : context;

        switch (postcard.getType()) {
            case ACTIVITY:
                // Build intent
                final Intent intent = new Intent(currentContext, postcard.getDestination());
                intent.putExtras(postcard.getExtras());

                // Set flags.
                int flags = postcard.getFlags();
                if (-1 != flags) {
                    intent.setFlags(flags);
                } else if (!(currentContext instanceof Activity)) {    // Non activity, need less one flag.
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                }

                // Set Actions
                String action = postcard.getAction();
                if (!TextUtils.isEmpty(action)) {
                    intent.setAction(action);
                }

                // Navigation in main looper.
                runInMainThread(new Runnable() {
                    @Override
                    public void run() {
                        startActivity(requestCode, currentContext, intent, postcard, callback);
                    }
                });

                break;
            case PROVIDER:
                return postcard.getProvider();
            case BOARDCAST:
            case CONTENT_PROVIDER:
            case FRAGMENT:
                Class fragmentMeta = postcard.getDestination();
                try {
                    Object instance = fragmentMeta.getConstructor().newInstance();
                    if (instance instanceof Fragment) {
                        ((Fragment) instance).setArguments(postcard.getExtras());
                    } else if (instance instanceof android.support.v4.app.Fragment) {
                        ((android.support.v4.app.Fragment) instance).setArguments(postcard.getExtras());
                    }

                    return instance;
                } catch (Exception ex) {
                    logger.error(Consts.TAG, "Fetch fragment instance error, " + TextUtils.formatStackTrace(ex.getStackTrace()));
                }
            case METHOD:
            case SERVICE:
            default:
                return null;
        }

        return null;
    }
```

对于Fragment/Broadcast/Content Provider，都是通过反射new出对象；而Service/Method则不支持，直接返回null。

### 旧版本转场动画

```java
ARouter.getInstance()
        .build("/test/activity2")
        .withTransition(R.anim.slide_in_bottom, R.anim.slide_out_bottom)
        .navigation(this);
```

动画slide_in_bottom.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
        android:duration="2000"
        android:fromYDelta="100%p"
        android:toYDelta="0"/>
    <alpha
        android:duration="2000"
        android:fromAlpha="0.0"
        android:toAlpha="1.0"/>
</set>
```

动画slide_out_bottom.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
        android:duration="2000"
        android:fromYDelta="0%p"
        android:toYDelta="100%p"/>
    <alpha
        android:duration="2000"
        android:fromAlpha="1.0"
        android:toAlpha="0.0"/>
</set>
```

### 新版本转场动画（API16及以上）

```java
if (Build.VERSION.SDK_INT >= 16) {
    ActivityOptionsCompat compat = ActivityOptionsCompat.
            makeScaleUpAnimation(v, v.getWidth() / 2, v.getHeight() / 2, 0, 0);

    ARouter.getInstance()
            .build("/test/activity2")
            .withOptionsCompat(compat)
            .navigation();
} else {
    Toast.makeText(this, "API < 16,不支持新版本动画", Toast.LENGTH_SHORT).show();
}
```

### 处理跳转结果 NavigationCallback

> 单独降级，如果没有配置`NavigationCallback`，那么会走到全局降级处理，后面有说

```java
// 使用两个参数的navigation方法，可以获取单次跳转的结果
ARouter.getInstance().build("/xxx/xxx").navigation(this, new NavCallback() {
        @Override
        public void onFound(Postcard postcard) {
            Log.d("ARouter", "找到了");
        }

        @Override
        public void onLost(Postcard postcard) {
            Log.d("ARouter", "找不到了");
        }

        @Override
        public void onArrival(Postcard postcard) {
            Log.d("ARouter", "跳转完了");
        }

        @Override
        public void onInterrupt(Postcard postcard) {
            Log.d("ARouter", "被拦截了");
        }
    });
```

### 为目标页面声明更多信息（extras）

```java
// 我们经常需要在目标页面中配置一些属性，比方说"是否需要登陆"之类的
// 可以通过 Route 注解中的 extras 属性进行扩展，这个属性是一个 int值，换句话说，单个int有4字节，也就是32位，可以配置32个开关
// 剩下的可以自行发挥，通过字节操作可以标识32个开关，通过开关标记目标页面的一些属性，在拦截器中可以拿到这个标记进行业务逻辑判断
@Route(path = "/test/activity", extras = Consts.XXXX)
```

> 具体可查看salam项目的`ARouterExtra`

### 重写跳转URL PathReplaceService

> 在ARouter.getInstance().build(path/uri)，build时就会替换了，没有到navigation()阶段；如果是path，调用的是`forString(path)`替换，如果是uri调用的是`fromUri(uri)`替换。

```java
// 实现PathReplaceService接口，并加上一个Path内容任意的注解即可
@Route(path = "/xxx/xxx") // 必须标明注解
public class PathReplaceServiceImpl implements PathReplaceService {
    /**
    * For normal path.
    *
    * @param path raw path
    */
    String forString(String path) {
        return path;    // 按照一定的规则处理之后返回处理后的结果
    }

    /**
    * For uri type.
    *
    * @param uri raw uri
    */
    Uri forUri(Uri uri) {
        return url;    // 按照一定的规则处理之后返回处理后的结果
    }
}
```

Mashi中使用了用来兼容处理部分不规则的url scheme，尽量减少配置人员的低级失误导致呼唤不起App，需要注意的是，需要用`ARouter.getInstance().build(Uri)`来调用

```kotlin
@Route(path = ARouterConstants.AROUTER_PATH_SERVICE)
class ARouterPathReplaceService : PathReplaceService {

    companion object {
        private const val TAG = ARouterConstants.TAG
        private const val DEEPLINK_SCHEME = ARouterConstants.DEEPLINK_SCHEME
    }

    override fun init(context: Context?) {
        LogUtils.i(TAG, "${anchor("init")}.")
    }

    override fun forString(path: String?): String? {
        if (path != "/arouter/service/autowired" && path != "/arouter/service/interceptor") {
            LogUtils.d(TAG, "${anchor("forString")}不处理，path=$path")
        }
        return path
    }

    override fun forUri(uri: Uri?): Uri? {
        LogUtils.d(TAG, "${anchor("forUri")}uri=${uri?.toString()}")
        val newPath = handlePath(uri?.toString())
        if (newPath.isNullOrBlank()) {
            LogUtils.w(TAG, "${anchor("forUri")}newPath blank. oldPath=${uri?.toString()}，newPath=$newPath")
            return uri
        }
        return Uri.parse(newPath)
    }


    /***
     * 定的协议不符合ARouter的，在这里兼容处理
     *
     *
     * 1. msalam:/room/room?room_id=40101和msalam:///room/room?room_id=40101 支持
     * 2. msalam://room/room?room_id=40101，做了兼容支持
     * 3. msalam:room/room?room_id=40101，做了兼容支持
     * 4. room/room?room_id=40101，做了兼容支持
     */
    private fun handlePath(path: String?): String? {
        val url = path.toString()
        return when {
            url.startsWith("${DEEPLINK_SCHEME}:///") -> path
            url.startsWith("${DEEPLINK_SCHEME}://") -> {
                // 尝试添加符合ARouter协议
                val newPath = url.replaceFirst("${DEEPLINK_SCHEME}://",
                        "${DEEPLINK_SCHEME}:///", true)
                LogUtils.w(TAG, "${anchor("handlePath")}，不符合规范的协议，" +
                        "newPath=$newPath, oldPath=$url")
                newPath
            }
            url.startsWith("${DEEPLINK_SCHEME}:/") -> path
            url.startsWith("${DEEPLINK_SCHEME}:") -> {
                val newPath = url.replaceFirst("${DEEPLINK_SCHEME}:",
                        "${DEEPLINK_SCHEME}:///", true)
                LogUtils.w(TAG, "${anchor("handlePath")}，不符合规范的协议，" +
                        "newPath=$newPath, oldPath=$url")
                newPath
            }
            else -> {
                val newPath = "${DEEPLINK_SCHEME}://$url"
                LogUtils.w(TAG, "${anchor("handlePath")}，不符合规范的协议，" +
                        "添加scheme头，newPath=$newPath, oldPath=$url")
                newPath
            }
        }
    }
}
```

### 详细的API说明

```java
// 初始化
ARouter.openLog(); // 开启日志，debug开启
ARouter.openDebug(); // ，debug开启 使用InstantRun的时候，需要打开该开关，上线之后关闭，否则有安全风险
ARouter.printStackTrace(); // 打印日志的时候打印线程堆栈，debug开启
ARouter.init(application)

// 构建标准的路由请求
ARouter.getInstance().build("/home/main").navigation();

// 构建标准的路由请求，并指定分组
ARouter.getInstance().build("/home/main", "ap").navigation();

// 构建标准的路由请求，通过Uri直接解析
Uri uri;
ARouter.getInstance().build(uri).navigation();

// 构建标准的路由请求，startActivityForResult
// navigation的第一个参数必须是Activity，第二个参数则是RequestCode
ARouter.getInstance().build("/home/main", "ap").navigation(this, 5);

// 直接传递Bundle
Bundle params = new Bundle();
ARouter.getInstance()
    .build("/home/main")
    .with(params)
    .navigation();

// 指定Flag
ARouter.getInstance()
    .build("/home/main")
    .withFlags();
    .navigation();

// 获取Fragment
Fragment fragment = (Fragment) ARouter.getInstance().build("/test/fragment").navigation();
                    
// 对象传递
ARouter.getInstance()
    .withObject("key", new TestObj("Jack", "Rose"))
    .navigation();

// 觉得接口不够多，可以直接拿出Bundle赋值
ARouter.getInstance()
        .build("/home/main")
        .getExtra();

// 转场动画(常规方式)
ARouter.getInstance()
    .build("/test/activity2")
    .withTransition(R.anim.slide_in_bottom, R.anim.slide_out_bottom)
    .navigation(this);

// 转场动画(API16+)
ActivityOptionsCompat compat = ActivityOptionsCompat.
    makeScaleUpAnimation(v, v.getWidth() / 2, v.getHeight() / 2, 0, 0);

// ps. makeSceneTransitionAnimation 使用共享元素的时候，需要在navigation方法中传入当前Activity

ARouter.getInstance()
    .build("/test/activity2")
    .withOptionsCompat(compat)
    .navigation();
        
// 使用绿色通道(跳过所有的拦截器)
ARouter.getInstance().build("/home/main").greenChannel().navigation();

// 使用自己的日志工具打印日志
ARouter.setLogger();

// 使用自己提供的线程池
ARouter.setExecutor();

// 获取原始的URI
String uriStr = getIntent().getStringExtra(ARouter.RAW_URI);
```

## 进阶用法

### URL跳转（DeepLink/AppLinks）

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title></title>
</head>
<body>
<h2>跳转测试</h2>
<h2>自定义Scheme[通常来说都是这样的]</h2>
<p><a href="arouter://m.aliyun.com/test/activity1">arouter://m.aliyun.com/test/activity1</a></p>
<p><a href="arouter://m.aliyun.com/test/activity1?url=https%3a%2f%2fm.abc.com%3fa%3db%26c%3dd">测试URL Encode情况</a></p>
<p><a href="arouter://m.aliyun.com/test/activity1?name=alex&age=18&boy=true&high=180&obj=%7b%22name%22%3a%22jack%22%2c%22id%22%3a666%7d">arouter://m.aliyun.com/test/activity1?name=alex&age=18&boy=true&high=180&obj={"name":"jack","id":"666"}</a></p>
<p><a href="arouter://m.aliyun.com/test/activity2">arouter://m.aliyun.com/test/activity2</a></p>
<p><a href="arouter://m.aliyun.com/test/activity2?key1=value1">arouter://m.aliyun.com/test/activity2?key1=value1</a></p>
<p><a href="arouter://m.aliyun.com/test/activity3?name=alex&age=18&boy=true&high=180">arouter://m.aliyun.com/test/activity3?name=alex&age=18&boy=true&high=180</a></p>

<h2>App Links[防止被App屏蔽]</h2>
<p><a href="http://m.aliyun.com/test/activity1">http://m.aliyun.com/test/activity1</a></p>
<p><a href="http://m.aliyun.com/test/activity2">http://m.aliyun.com/test/activity2</a></p>
</body>
</html>
```

> 1. 支持URL Encode
> 2. 自定义对象的格式为json格式

AndroidManifest.xml配置：

```xml
<activity android:name=".samples.third.arouter.ARouterDemos.SchemeFilterActivity">
    <!-- Schame -->
    <intent-filter>
        <data
            android:host="m.aliyun.com"
            android:scheme="arouter"/>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
    </intent-filter>
    <!-- App Links -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data
            android:host="m.aliyun.com"
            android:scheme="http"/>
        <data
            android:host="m.aliyun.com"
            android:scheme="https"/>
    </intent-filter>
</activity>
```

### 依赖注入

支持的类型：

1. 基本数据类型
2. String
3. Serializable
4. Parcelable
5. 普通Object
6. List
7. Map

特性：

1. 字段用`@Autowired`注解修饰，其中name属性可以指定一个别名
2. 支持解析自定义对象，URL中使用json传递
3. 使用`withObject`传递List和Map的实现了Serializable 接口的实现类(ArrayList/HashMap)的时候，接收该对象的地方不能标注具体的实现类类型应仅标注为 List 或 Map，否则会影响序列化中类型的判断, 其他类似情况需要同样处理(要用List替代ArrayList/HashMap替代Map)
4. Serivce Kotlin中`@Autowired`注解，需要增加`@JvmField`字段，否则生成的Java字段为private
5. Serivce依赖注入的字段和所在的类要为public，否则找不到
6. Serivce内部类的注入出现包名存在的问题，可以单独新建的类来依赖注入Service

```java
TestSerializable testSerializable = new TestSerializable("Titanic", 555);
TestParcelable testParcelable = new TestParcelable("jack", 666);
TestObj testObj = new TestObj("Rose", 777);
List<TestObj> objList = new ArrayList<>();
objList.add(testObj);

Map<String, List<TestObj>> map = new HashMap<>();
map.put("testMap", objList);

ARouter.getInstance().build("/test/activity1")
        .withString("name", "老王") // 传递String
        .withInt("age", 18) // 传递int
        .withBoolean("boy", true) // 传递boolean
        .withLong("high", 180) // 传递Long
        .withString("url", "https://a.b.c")
        .withSerializable("ser", testSerializable) // 传递Serializable
        .withParcelable("pac", testParcelable) // 传递Parcelable
        .withObject("obj", testObj) // 传递普通对象
        .withObject("objList", objList) // 传递普通对象的List
        .withObject("map", map) // 传递普通对象的Map
        .navigation();
        
// 目标页
// 为每一个参数声明一个字段，并使用 @Autowired 标注
// URL中不能传递Parcelable类型数据，通过ARouter api可以传递Parcelable对象
@Route(path = "/test/activity1", name = "测试用 Activity")
public class Test1Activity extends AppCompatActivity {

    @Autowired(desc = "姓名")
    String name = "jack";

    @Autowired
    int age = 10;

    @Autowired
    int height = 175;

    // 通过name来映射URL中的不同参数
    @Autowired(name = "boy", required = true)
    boolean girl;

    @Autowired
    char ch = 'A';

    @Autowired
    float fl = 12.00f;

    @Autowired
    double dou = 12.01d;

    @Autowired
    TestSerializable ser;

    @Autowired
    TestParcelable pac;

    // 支持解析自定义对象，URL中使用json传递
    @Autowired
    TestObj obj;

    // 使用 withObject 传递 List 和 Map 的实现了
    // Serializable 接口的实现类(ArrayList/HashMap)
    // 的时候，接收该对象的地方不能标注具体的实现类类型
    // 应仅标注为 List 或 Map，否则会影响序列化中类型
    // 的判断, 其他类似情况需要同样处理   
    @Autowired
    List<TestObj> objList;

    @Autowired
    Map<String, List<TestObj>> map;

    private long high;

    @Autowired
    String url;

    @Autowired
    HelloService helloService;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test1);
        // ARouter会自动对字段进行赋值，无需主动获取
        ARouter.getInstance().inject(this);
    }
}
```

### 依赖注入自定义对象 SerializationService

可以使用withObject传递对象了

```java
// 如果需要传递自定义对象，新建一个类（并非自定义对象类），然后实现 SerializationService,并使用@Route注解标注(方便用户自行选择序列化方式)，例如：
@Route(path = "/yourservicegroupname/json")
public class JsonServiceImpl implements SerializationService {
    @Override
    public void init(Context context) {

    }

    @Override
    public <T> T json2Object(String text, Class<T> clazz) {
        return JSON.parseObject(text, clazz);
    }

    @Override
    public String object2Json(Object instance) {
        return JSON.toJSONString(instance);
    }
}
```

### 拦截器Interceptor

1. 拦截器会在跳转之间执行，多个拦截器会按优先级顺序依次执行（priority数小的先初始化/执行）
2. 比较经典的应用就是在跳转过程中处理登陆事件，这样就不需要在目标页重复做登陆检查
3. InterceptorCallback的onInterrupt/onContinue两种至少需要调用其中一种，否则不会继续路由，onContinue不拦截，交给下一个拦截器
4. 拦截器是SDK初始化时，就初始化了，只初始化一次
5. 拦截器是每次路由都会调用
6. 使用绿色通道(跳过所有的拦截器)`ARouter.getInstance().build("/home/main").greenChannel().navigation();`，在完善Postcard时(`LogisticsCenter.completion`)，Fragment和IProvider会添加上绿色通道即不拦截。

```java
@Interceptor(priority = 7)
public class Test1Interceptor implements IInterceptor {
    Context mContext;
    @Override
    public void process(final Postcard postcard, final InterceptorCallback callback) {

        LogUtil.i("interceptor process:" + postcard.getPath());

        if ("/test/activity4".equals(postcard.getPath())) {
            final AlertDialog.Builder ab = new AlertDialog.Builder(getThis());
            ab.setCancelable(false);
            ab.setTitle("温馨提醒");
            ab.setMessage("想要跳转到Test4Activity么？(触发了\"/inter/test1\"拦截器，拦截了本次跳转)");
            ab.setNegativeButton("继续", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    callback.onContinue(postcard);
                }
            });
            ab.setNeutralButton("算了", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    callback.onInterrupt(null);
                }
            });
            ab.setPositiveButton("加点料", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    postcard.withString("extra", "我是在拦截器中附加的参数");
                    callback.onContinue(postcard);  // onInterrupt/onContinue两种至少需要调用其中一种，否则不会继续路由
                }
            });

            MainLooper.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ab.create().show();
                }
            });
        } else {
            callback.onContinue(postcard);
        }
    }

    /**
     * Do your init work in this method, it well be call when processor has been load.
     *
     * @param context ctx
     */
    // 拦截器的初始化，会在sdk初始化的时候调用该方法，仅会调用一次
    @Override
    public void init(Context context) {
        mContext = context;
        Log.e("testService", Test1Interceptor.class.getName() + " has init.");
    }
}
```

#### 拦截器在聊天室中的应用，拦截登录

通过@Route的extra标记，来确定目标页面是否需要拦截，如果需要就拦截，不需要就放行；通过用int的最后一位bit来控制是否需要登录；如果需要其他的可以用除最后位bit来标记。

```kotlin
@Interceptor(priority = ARouterConstants.Interceptor.ROUTER_INTERCEPTOR_PRIORITY)
class ARouterLoginInterceptor : IInterceptor {

    private val tag = ARouterConstants.TAG

    private var mContext: Context? = null

    companion object {
        const val LOGIN_REQUEST_CODE = 1000
    }

    override fun process(postcard: Postcard, callback: InterceptorCallback) {

        val extra = postcard.extra
        val path = postcard.path

        val routerExtraFlag = ARouterExtra.init(extra)
        LogUtils.w(tag, "${this.javaClass.simpleName} process，extra：$extra($routerExtraFlag)"
                + "，path：$path")

        val isLogin = UserCenterProvider.of().isLogin()
        if (routerExtraFlag.needLogin() && !isLogin) {
            T.logAndToast(tag, "${this.javaClass.simpleName} process 需要登录且未登录，去登录。，path：$path")
            login(postcard, callback)
        } else {
            LogUtils.w(tag, "${this.javaClass.simpleName}process 不需要登录，onContinue。，path：$path")
            callback.onContinue(postcard)
        }
    }

    private fun login(postcard: Postcard, callback: InterceptorCallback) {
        val path = postcard.path
        val currentActivity = ForegroundCallbacks.get().currentActivity()
        if (currentActivity != null) {
            LogUtils.i(ARouterConstants.TAG, "${this.javaClass.simpleName} 开始拦截，跳转到登录页，onActivityResult：$path")
            ARouter.getInstance()
                    .build(ARouterConstants.ROUTER_TO_LOGIN_ACTIVITY)
                    .navigation(currentActivity, LOGIN_REQUEST_CODE, object : NavCallback() {
                        override fun onArrival(postcard: Postcard?) {
                            LogUtils.i(ARouterConstants.TAG, "${this.javaClass.simpleName} 跳转登录页成功[onArrival]：$path")
                        }

                        override fun onLost(postcard: Postcard?) {
                            LogUtils.w(ARouterConstants.TAG, "${this.javaClass.simpleName} 跳转登录页失败[onLost]：$path")
                        }
                    })
        } else {
            LogUtils.w(ARouterConstants.TAG, "${this.javaClass.simpleName} 开始拦截，跳转到登录页，" +
                    "没有onActivityResult，currentActivity为null：$path")
            ARouter.getInstance()
                    .build(ARouterConstants.ROUTER_TO_LOGIN_ACTIVITY)
                    .navigation()
        }
    }
    override fun init(context: Context) {
        this.mContext = context
    }
}
```

需要登录的目标页面，通过配置`extras = ARouterExtra.AROUTER_EXTRA_FLAG_LOGIN`来标记目标页面是否需要登录，未登录就拦截跳转到登录页面进行登录

```kotlin
@Route(path = ARouterConstants.ROUTER_TO_RECHARGE_ACTIVITY,
        extras = ARouterExtra.AROUTER_EXTRA_FLAG_LOGIN // | xxx_flag，需要其他的flag，逻辑或加上
)
class RechargeActivity : BaseActivity() {
    override fun getContentViewId(): Int {
        return R.layout.activity_recharge
    }
    override fun init(savedInstanceState: Bundle?) {
    }
}
```

### 服务Service（不是Android中的Service，是IProvider）

> 这里说到的服务不是Android四大组件中的Service，这里的服务是服务端开发的概念，就是将一部分功能和组件封装起来成为接口，以接口的形式对外提供能力，所以在这部分就可以将每个功能作为一个服务，而服务的实现就是具体的业务功能。服务每次调用都会初始化，只有调用的时候才会执行。

#### 暴露服务

> 通过实现IProvider接口，来实现服务的暴露

```java
// 声明接口,其他组件通过接口来调用服务，一般该接口要下沉到baselibs
public interface HelloService extends IProvider {
    String sayHello(String name);
}

// 服务的具体实现，具体的业务实现
@Route(path = "/yourservicegroupname/hello", name = "测试服务")
public class HelloServiceImpl implements HelloService {

    @Override
    public String sayHello(String name) {
    return "hello, " + name;
    }

    @Override
    public void init(Context context) {

    }
}
```

#### 发现服务

ARouter发现服务主要有两种方式，ByName和ByType。ByName就是需要传递path路径来进行发现，ByType就是通过服务class来进行查找。

```java
case R.id.navByName:
    ((HelloService) ARouter.getInstance().build("/service/hello").navigation()).sayHello("mike");
    break;
case R.id.navByType:
    ARouter.getInstance().navigation(HelloService.class).sayHello("mike");
    break;
```

那么为什么需要区分两种类型？因为在Java中接口是可以有多个实现的，通过ByType的方式可能难以拿到想要的多种实现，这时候就可以通过ByName的方式获取真实想要的服务。所以其实大多数情况是通过ByType的，如果有多实现的时候就需要使用ByName。

##### 发现服务（byName）

> 通过path，用于接口的多个实现；使用依赖注入时，如果`@Autowired没有使用name属性，使用的是byName，定义的name就是使用的byType。`

```java
// 通过依赖注入解耦:服务管理 发现服务
public class Test {

    // 依赖注入找到服务具体实现
    @Autowired
    HelloService helloService;

    @Autowired(name = "/yourservicegroupname/hello")
    HelloService helloService2;

    HelloService helloService3;

    HelloService helloService4;

    public Test() {
    ARouter.getInstance().inject(this);
    }

    public void testService() {
    // 1. (推荐)使用依赖注入的方式发现服务,通过注解标注字段,即可使用，无需主动获取
    // Autowired注解中标注name之后，将会使用byName的方式注入对应的字段，不设置name属性，会默认使用byType的方式发现服务(当同一接口有多个实现的时候，必须使用byName的方式发现服务)
    helloService.sayHello("Vergil");
    helloService2.sayHello("Vergil");

    // 2. 使用依赖查找的方式发现服务，主动去发现服务并使用，下面两种方式分别是byName和byType
    helloService3 = ARouter.getInstance().navigation(HelloService.class);
    helloService4 = (HelloService) ARouter.getInstance().build("/yourservicegroupname/hello").navigation();
    helloService3.sayHello("Vergil");
    helloService4.sayHello("Vergil");
    }
}
```

##### 发现服务（byType）

```java
helloService3 = ARouter.getInstance().navigation(HelloService.class);
```

#### 调用单类

```java
@Route(path = "/service/single")
public class SingleService implements IProvider {

    Context mContext;

    public void sayHello(String name) {
        Toast.makeText(mContext, "Hello " + name, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void init(Context context) {
        mContext = context;
    }
}

// 调用
ARouter.getInstance().navigation(SingleService.class).sayHello("Mike");
```

#### 服务在聊天室中的应用（IProvider）

其他模块需要用到m_login登录模块的操作和数据，其他模块又不能直接引用m_login模块，否则就强耦合了，那么就可以通过ARouter IProvider来提供服务进行解耦合。

将提供登录用户信息的服务下沉公共模块`lib_common`，这个模块是所有业务模块都能访问的到的，如果需要Model也可以下沉到该模块：

```java
public interface UserCenterRouterService extends IProvider {
    String getToken();
    long getUserId();
    String getUserAvatar();
    String getUserGender();
    // User
    User getUser();
    long getUserOrigin();
    /**
     * 是否登录
     * @return
     */
    boolean isLogin();
    /**
     * 登录
     */
    void loginIn(@NonNull LifecycleOwner owner, String qbtoken, Callback<User> callback);
    /**
     * 退出登录
     */
    void loginOut();
    /**
     * 在线登录
     * @param user User
     */
    void loginInOnline(User user);
    /**
     * 添加订阅
     *
     * @return Observable
     */
    Observable<User> addSubscriber();
}
```

`m_login`提供具体的服务实现，包括登录、退出、获取token，用户等信息：

```java
@Route(path = RouterConstant.Login.PROVIDER_LOGIN)
public class UserCenterRouterServiceImpl implements UserCenterRouterService {

    @Override
    public String getToken() {
        return UserCenter.getInstance().getToken();
    }

    @Override
    public long getUserId() {
        return UserCenter.getInstance().getUserId();
    }

    @Override
    public String getUserAvatar() {
        return UserCenter.getInstance().getUserAvatar();
    }

    @Override
    public String getUserGender() {
        return UserCenter.getInstance().getUserGender();
    }

    @Override
    public User getUser() {
        return UserCenter.getInstance().getUser();
    }

    @Override
    public long getUserOrigin() {
        return UserCenter.getInstance().getUserOrigin();
    }

    @Override
    public boolean isLogin() {
        return UserCenter.getInstance().isLogin();
    }

    @Override
    public void loginIn(@NonNull LifecycleOwner owner, String qbtoken, Callback<User> callback) {
        owner.getLifecycle().addObserver(new QiubaiUserCheckInVoiceChat(qbtoken, callback));
    }

    @Override
    public void loginOut() {
        UserCenter.getInstance().loginOut();
    }

    @Override
    public void loginInOnline(User user) {
        UserCenter.getInstance().loginInOnline(user);
    }

    @Override
    public Observable<User> addSubscriber() {
        return UserCenter.getInstance().addSubscriber();
    }

    @Override
    public void init(Context context) {
        
    }
}
```

在需要用的其他模块，比如`app`模块，依赖注入到要用的地方，比如这里用`UserCenterProvider`进行了二次包装，也可以直接使用`UserCenterRouterService`：

```java
public final class UserCenterProvider {

    @Autowired
    UserCenterRouterService userCenterRouterProvider;

    public static UserCenterProvider of() {
        return new UserCenterProvider();
    }

    private UserCenterProvider() {
        ARouter.getInstance().inject(this);
    }

    public String getToken() {
        if (userCenterRouterProvider == null) {
            return "";
        }
        return userCenterRouterProvider.getToken();
    }


    public long getUserId() {
        if (userCenterRouterProvider == null) {
            return 0L;
        }
        return userCenterRouterProvider.getUserId();
    }


    public String getUserAvatar() {
        if (userCenterRouterProvider == null) {
            return "";
        }
        return userCenterRouterProvider.getUserAvatar();
    }


    public String getUserGender() {
        if (userCenterRouterProvider == null) {
            return "";
        }
        return userCenterRouterProvider.getUserGender();
    }

    // User
    public User getUser() {
        if (userCenterRouterProvider == null) {
            return null;
        }
        return userCenterRouterProvider.getUser();
    }

    public long getUserOrigin() {
        if (userCenterRouterProvider == null) {
            return 0L;
        }
        return userCenterRouterProvider.getUserOrigin();
    }

    public void loginIn(@NonNull LifecycleOwner owner, String qbtoken, Callback<User> callback) {
        if (userCenterRouterProvider == null) {
            return;
        }
        userCenterRouterProvider.loginIn(owner, qbtoken, callback);
    }

    public void loginOut() {
        if (userCenterRouterProvider != null) {
            userCenterRouterProvider.loginOut();
        }
    }

    public boolean isLogin() {
        if (userCenterRouterProvider != null) {
            return userCenterRouterProvider.isLogin();
        }
        return false;
    }

    public void loginInOnline(User user) {
        if (userCenterRouterProvider != null) {
            userCenterRouterProvider.loginInOnline(user);
        }
    }

    public Observable<User> addSubscriber() {
        if (userCenterRouterProvider == null) {
            return Observable.<User>error(new RuntimeException("userCenterRouterProvider为空了！"));
        }
        return userCenterRouterProvider.addSubscriber();
    }
}
```

其他地方要用的话，直接调用，如获取token：

```java
UserCenterProvider.of().getToken();
```

### 预处理服务 PretreatmentService

> 在navigation()之前会触发该服务，判断该path是否需要navigation。

```java
// 实现 PretreatmentService 接口，并加上一个Path内容任意的注解即可
@Route(path = "/xxx/xxx")
public class PretreatmentServiceImpl implements PretreatmentService {
    @Override
    public boolean onPretreatment(Context context, Postcard postcard) {
        // 跳转前预处理，如果需要自行处理跳转，该方法返回 false 即可
    }

    @Override
    public void init(Context context) {

    }
}
```

### ARouter降级策略（NavigationCallback/DegradeService）

> 路由找不到时的策略。降级策略主要是这两种实现方式，比较简单，各有千秋，可以结合自己的需求进行使用，不过需要注意一点，不能两种同时使用，单独降级的方式优先于全局降级，也就是如果同时使用两种方式，调用完单独降级策略后就不会再调用全局降级。

#### 1. 单独降级，回调NavigationCallback

在跳转失败的时候会回调NavigationCallback接口的`onLost`方法。

```java
ARouter.getInstance().build("/xxx/xxx").navigation(this, new NavigationCallback() {
     @Override
     public void onFound(Postcard postcard) {
          Log.d("ARouter", "找到了");
     }

     @Override
     public void onLost(Postcard postcard) {
          Log.d("ARouter", "找不到了");
     }

     @Override
     public void onArrival(Postcard postcard) {
          Log.d("ARouter", "跳转完了");
     }

     @Override
      public void onInterrupt(Postcard postcard) {
           Log.d("ARouter", "被拦截了");
      }
});
```

#### 2. 全局降级策略，实现DegradeService

```java
// 实现DegradeService接口，并加上一个Path内容任意的注解即可
@Route(path = "/sdk/service/degrade")
public class MyDegradeService implements DegradeService {
    @Override
    public void onLost(Context context, Postcard postcard) {
        LogUtil.e("MyDegradeService onLost :" + postcard.getPath());
    }

    @Override
    public void init(Context context) {
        LogUtil.e("MyDegradeService init: " + context);
    }
}

// 错误path调用
ARouter.getInstance().build("/xxx/xxx").navigation();
```

##### 全局降级在聊天室中的应用

> 路由失败时，且没有设置单独降级，那么可以全局降级，如跳转失败了，回到应用主页；聊天室用了ARouter来进行deeplink路由跳转，如果外部链接配置错了，或者配置了应用处理不了的，那么就可以走全局降级，回退到应用主页。

```kotlin
@Route(path = ARouterConstants.Service.ROUTER_SERVICE_DEGRADE)
class ARouterDegradeService : DegradeService {
    override fun init(context: Context?) {
        LogUtils.w(ARouterConstants.TAG, "${this.javaClass.simpleName} init()")
    }
    override fun onLost(context: Context?, postcard: Postcard?) {
        val path = postcard?.path
        T.logAndToast(ARouterConstants.TAG, "${this.javaClass.simpleName} onLost:$path，" +
                "跳转到主页(${ARouterConstants.ROUTER_TO_MAIN})")
        ARouter.getInstance()
                .build(ARouterConstants.ROUTER_TO_MAIN)
                .navigation()
    }
}
```

## 疑惑

### 路由中的分组概念

- SDK中针对所有的路径(/test/1 /test/2)进行分组，分组只有在分组中的某一个路径第一次被访问的时候，该分组才会被初始化，具体逻辑在`LogisticsCenter.completion()`中
- 可以通过 [@Route ](/Route) 注解主动指定分组，否则使用路径中第一段字符串(/*/)作为分组（一般不要指定分组，用默认就行。）
- 注意：一旦主动指定分组之后，应用内路由需要使用 ARouter.getInstance().build(path, group) 进行跳转，手动指定分组，否则无法找到

### 拦截器和服务的异同

- 拦截器和服务所需要实现的接口不同，但是结构类似，都存在 init(Context context) 方法，但是两者的调用时机不同
- 拦截器因为其特殊性，会被任何一次路由所触发，拦截器会在ARouter初始化的时候异步初始化，如果第一次路由的时候拦截器还没有初始化结束，路由会等待，直到初始化完成。
- 服务没有该限制，某一服务可能在App整个生命周期中都不会用到，所以服务只有被调用的时候才会触发初始化操作

#### 常见服务

| **常见服务（IProvider）**  | 功能                                     | 触发条件                                                   |
| -------------------- | -------------------------------------- | ------------------------------------------------------ |
| PathReplaceService   | 路径path/uri替换                           | ARouter.getInstance().build(path/uri)触发，未到navigation() |
| PretreatmentService  | 预处理服务，跳转前预处理，如果需要自行处理跳转，该方法返回 false 即可 | 在navigation()之前会触发该服务                                  |
| DegradeService       | 全局降级服务                                 | 在没有配置单独降级，path找不到onLost时触发                             |
| SerializationService | 参数需要传递自定义对象                            | Postcard.withObject()自定义对象时                            |
| AutowiredService     | 依赖注入用到                                 | ARouter.getInstance().inject()用到                       |

### Q&A

见[Q&A](https://github.com/alibaba/ARouter/blob/master/README_CN.md#%E4%B8%83qa)

## ARouter遇到的问题

### 拦截器未终止（未调用onContinue或onInterrupt）引起路由跳转不了

线上的一个Bug: 反复8次进入support或wallet页面又退出（Flutter调用的），app的全部页面的按钮无法点击，然后过了几分钟，又全部路由过去了<br />分析：点击8次路由都成功能跳转后，第9次点击路由跳转失效，等过个5分钟左右，之前点击的跳转又会跳转成功过去目标页<br />猜测：可能和路由框架的线程池有关系<br />Read the fucking code：<br />路由时会经过InterceptorServiceImpl，处理拦截器逻辑

```java
@Route(path = "/arouter/service/interceptor")
public class InterceptorServiceImpl implements InterceptorService {
    public void doInterceptions(final Postcard postcard, final InterceptorCallback callback) {
        LogisticsCenter.executor.execute(new Runnable() {
                @Override
                public void run() {
                    CancelableCountDownLatch interceptorCounter = new CancelableCountDownLatch(Warehouse.interceptors.size());
                    try {
                        _excute(0, interceptorCounter, postcard);
                        interceptorCounter.await(postcard.getTimeout(), TimeUnit.SECONDS);
                        if (interceptorCounter.getCount() > 0) {    // Cancel the navigation this time, if it hasn't return anythings.
                            callback.onInterrupt(new HandlerException("The interceptor processing timed out."));
                        } else if (null != postcard.getTag()) {    // Maybe some exception in the tag.
                            callback.onInterrupt(new HandlerException(postcard.getTag().toString()));
                        } else {
                            callback.onContinue(postcard);
                        }
                    } catch (Exception e) {
                        callback.onInterrupt(e);
                    }
                }
            });
    }
}
```

- 通过线程池DefaultPoolExecutor来处理拦截器的逻辑
- 通过一个CountDownLatch来阻塞线程，直到所有的interceptor都procss完毕
- CountDownLatch的超时时间，默认5min
- 如果interceptor中没有调用onInterrupt或者没有调用onContinue，就好一直在那await，导致线程一直在等待，默认是5min

接下来看DefaultPoolExecutor：

```java
public class DefaultPoolExecutor extends ThreadPoolExecutor {
    //    Thread args
    private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
    private static final int INIT_THREAD_COUNT = CPU_COUNT + 1;
    private static final int MAX_THREAD_COUNT = INIT_THREAD_COUNT;
    private static final long SURPLUS_THREAD_LIFE = 30L;

    private static volatile DefaultPoolExecutor instance;

    public static DefaultPoolExecutor getInstance() {
        if (null == instance) {
            synchronized (DefaultPoolExecutor.class) {
                if (null == instance) {
                    instance = new DefaultPoolExecutor(
                            INIT_THREAD_COUNT,
                            MAX_THREAD_COUNT,
                            SURPLUS_THREAD_LIFE,
                            TimeUnit.SECONDS,
                            new ArrayBlockingQueue<Runnable>(64),
                            new DefaultThreadFactory());
                }
            }
        }
        return instance;
    }
}
```

在三星A51上，CPU_COUNT=8，即corePoolSize和maximumPoolSize为9，线程池中最多9个线程；也就出现了前面如果线程await了，就会一直在等待5min超时，后面新来的路由就丢到了ArrayBlockingQueue等到<br />解决：

1. 在写Interceptor时，要记得onContinue和onInterrupt写一个终止当前路由，否则会一直阻塞着当前线程
2. 给Postcard设置一个timeout时间，比如5秒，就不会阻塞当前线程了

### Kotlin与Java混编模式下，使用Arouter及ButterKnife问题

#### 1. kt和Java混编时，报错：无法找到匹配路径（no match path）

**问题：**<br />项目进行混合编程（java、kotlin），当*.kt 后缀的Activity上使用@Route（path =xxxxx）时候遇到No match path；<br />**原因：**<br />*.kt 上的注解需要使用 kotlin方式的注解解释器才可以识别。<br />检查module的 build.gradle 文件 ，引入Arouter方式是否是 apt

- java 方式

```groovy
defaultConfig {
    //...
    javaCompileOptions {
        annotationProcessorOptions {
            arguments = [moduleName: project.getName()]
        }
    }
}
dependencies {
      annotationProcessor 'com.alibaba:arouter-annotation:1.0.4'
}
```

- kotlin 方式

```groovy
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'
apply plugin: 'kotlin-kapt'
kapt {
    arguments {
        arg("AROUTER_MODULE_NAME", project.getName())
        arg("AROUTER_GENERATE_DOC", "enable")
    }
    generateStubs = true
}
dependencies {
    kapt 'com.alibaba:arouter-annotation:1.0.4'
}
```

**解决：**<br />如果纯java的module，使用`annotationProcesso/apt`；如果是java+kotlin 或者 纯kotlin的module，用`kapt`。

#### 2. 用的annotationProcessor，用kt写SerializationService时未生成路由，导致withObject失效

解决1：自义的SerializationService用Java代码写<br />解决2：annotationProcessor改为kapt

### 不同module中存在相同group(ARouter不允许多个module用同一个group)

#### 多个module定义了多个路由，用的同一个group --编译报错

多个module，@Route中的path，group相同<br />**路由定义情况：**

```kotlin
// AndroidDemos /my_route/android_demos  application
@Route(path = Routes.AndroidDemos)
class AndroidDemos : BaseListActivity

// Google /my_route/google module
@Route(path = Routes.Google)
public class Google extends BaseListActivity 

// OpenSourceDemos /my_route/open_source_demos
@Route(path = Routes.OpenSourceDemos)
public class OpenSourcesDemos
```

**kapt代码生成情况：**

- AndroidDemos Application

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694019126791-12b2754e-a3d4-4bf5-9170-e335dab982a4.png#averageHue=%23544d42&clientId=ua17b1057-5990-4&from=paste&height=187&id=u2efdf453&originHeight=800&originWidth=2252&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=219322&status=done&style=none&taskId=u97e3692a-66ed-47ce-8d0f-8beb71fb839&title=&width=527.3333740234375)

- Google Module

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694019188754-87911bbe-cd8b-4f6b-b778-2081e5c530cb.png#averageHue=%23554e42&clientId=ua17b1057-5990-4&from=paste&height=176&id=u8bc3e3e4&originHeight=786&originWidth=2363&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=232892&status=done&style=none&taskId=u295fb768-cbd8-485c-b19d-0f25fd11a7f&title=&width=528.3333740234375)

- OpenSourceDemos

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694019228465-f574ad92-939d-4d24-bb78-5f95ce7b3c9a.png#averageHue=%23544e42&clientId=ua17b1057-5990-4&from=paste&height=201&id=ua98421f8&originHeight=870&originWidth=2298&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=274900&status=done&style=none&taskId=ua4609a2e-5ac2-4617-9eec-f3af558a0fe&title=&width=530.3333740234375)<br />**错误堆栈：**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694018937081-22651c4b-b948-4871-a5b7-2aa6287767bb.png#averageHue=%23342d2c&clientId=ua17b1057-5990-4&from=paste&height=141&id=u4c421681&originHeight=419&originWidth=1587&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=303521&status=done&style=none&taskId=u2a9f545e-2391-49e9-a76b-1bf4d0faf35&title=&width=533.3333740234375)<br />类`com.alibaba.android.arouter.routes.ARouter$$Group$$my_route`定义了多次<br />**问题分析：**<br />kapt对每个module的`@Route`解析生成`com.alibaba.android.arouter.routes.ARouter$$Group$$group`类，如果多个module中定义了相同的group，那么就会出现不同的module中生成的类是一样，就会报type define multi times的编译错误<br />**解决方案：**<br />不同的module用不同的group

```kotlin
const val AndroidDemos = "/android_demos/main"
const val Google = "/google/main"
const val OpenSourceDemos = "/open_source_demos/main"
```

#### 一个module中的同一个路由，被不同的module中使用

```
com.android.dex.DexException: Multiple dex files define Lcom/alibaba/android/arouter/routes/ARouter$$Group$$module
```

1. ARouter允许一个module中存在多个分组，但是不允许多个module中存在相同的分组，会导致映射文件冲突

```
TransformException:java.util.zip.ZipException: duplicate entry ....
```

2. 不要在不同module中用同一个group，要不然就会出现

```
/**
 *
 * 不要在不同module中用同一个group(第一个/)，如/me/xxx 不要同时存在于m_core和m_me module
 *
 * 原因：ARouter的懒加载路由表时，当在不同的module定义相同的group的时候，会因为生成的IRouteGroup的路径和class名一致，导致只能加载第一个module的RouteMeta，后面的加载不上
 *
 * ARouter一个module可以有多个group；但一个group只能存在于一个module，不能存在于多个module。
 *
 * https://github.com/alibaba/ARouter/issues/348
 *
 */

Program type already present: com.alibaba.android.arouter.routes.ARouter$$Providers$$*
```

3. 案例<br />ModuleA中，存在message group的Provider

```json
"message":[
	{
		"group":"message",
		"path":"/message/user_level_upgrade",
		"prototype":"null, club.jinmei.mgvoice.core.arouter.provider.userlevel.IUserLevelUpgradeProvider",
		"className":"club.jinmei.mgvoice.m_userhome.level.UserLevelUpgradeProvider",
		"type":"provider",
		"mark":-2147483648
	}
]
```

最后生成

```java
/**
* DO NOT EDIT THIS FILE!!! IT WAS GENERATED BY AROUTER. */
public class ARouter$$Group$$message implements IRouteGroup {
@Override
public void loadInto(Map<String, RouteMeta> atlas) {
    atlas.put("/message/user_level_upgrade", RouteMeta.build(RouteType.PROVIDER, UserLevelUpgradeProvider.class, "/message/user_level_upgrade", "message", null, -1, -2147483648));
    }
}
```

ModuleB中，存在存在message group

```json
{
	"message":[
		{
			"group":"message",
			"path":"/message/chat_to_single_person",
			"className":"club.jinmei.mgvoice.m_message.ui.message.ChatDetailActivity",
			"type":"activity",
			"mark":-2147483648,
			"params":[
				{
					"key":"userId",
					"type":"string",
					"required":false
				},
				{
					"key":"userCanInput",
					"type":"boolean",
					"required":false
				}
			]
		},
		{
			"group":"message",
			"path":"/message/provider/im",
			"prototype":"null, club.jinmei.mgvoice.core.arouter.provider.im.IMDataProvider",
			"className":"club.jinmei.mgvoice.m_message.data.IMDataProviderImpl",
			"type":"provider",
			"mark":-2147483648
		},
		{
			"group":"message",
			"path":"/message/tab",
			"className":"club.jinmei.mgvoice.m_message.ui.message.TabMessageFragment",
			"type":"fragment",
			"mark":-2147483648
		}
	]
}
```

最后生成：

```java
public class ARouter$$Group$$message implements IRouteGroup {
  @Override
  public void loadInto(Map<String, RouteMeta> atlas) {
    atlas.put("/message/chat_to_single_person", RouteMeta.build(RouteType.ACTIVITY, ChatDetailActivity.class, "/message/chat_to_single_person", "message", new java.util.HashMap<String, Integer>(){{put("userId", 8); put("userCanInput", 0); }}, -1, -2147483648));
    atlas.put("/message/provider/im", RouteMeta.build(RouteType.PROVIDER, IMDataProviderImpl.class, "/message/provider/im", "message", null, -1, -2147483648));
    atlas.put("/message/tab", RouteMeta.build(RouteType.FRAGMENT, TabMessageFragment.class, "/message/tab", "message", null, -1, -2147483648));
  }
}
```

**原因：**<br />一个module可以有多个group；但一个group只能存在于一个module，不能存在于多个module，否则ARouter的懒加载路由表，首次加载该group时装载路由，存在多个module时，只有首次加载的module能装载进去，其他module的路由就加载不上了<br />**解决：**把ModuleA的path改为该Provider所在module的group中，

```
/me/user_level_upgrade
```

### ARouter找不到路径

#### build的path填错

错误：

> W/ARouter::: ARouter::There is no route match the path [/activity/about], in group [activity][ ]

原因：

- navigation时的path填错了，填成了不存在路由表中的情况

解决：一般是由于配置错误了path，填对即可

#### kapt配置不对

1. 检查kapt插件应用了没有

```groovy
apply plugin: 'kotlin-kapt'
kapt {
    arguments {
        arg("AROUTER_MODULE_NAME", project.getName())
        arg("AROUTER_GENERATE_DOC", "enable")
    }
}
```

2. kapt了arouter-compiler没有

```groovy
kapt 'com.alibaba:arouter-compiler:1.2.2'
```

3. 检查路由表生有没有生成

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694018496256-cbb40249-f293-4bb7-8d1b-7d18c0ce7037.png#averageHue=%23554e42&clientId=u7e21635c-8f4e-4&from=paste&height=228&id=u404c050f&originHeight=894&originWidth=2199&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=234354&status=done&style=none&taskId=u97b78b67-5549-4d54-8726-4c6ce5e8701&title=&width=560.3333740234375)

### ARouter init logistics center exception

<https://github.com/alibaba/ARouter/issues/618><br />一般是由于覆盖安装，路由表缓存的不对了

```
Process: qsbk.app, PID: 14987
java.lang.RuntimeException: Unable to create application qsbk.app.QsbkApp: com.a.a.a.c.a: ARouter::ARouter init logistics center exception! [com.alibaba.android.arouter.routes.ARouter$$Root$$lib_common]
    at android.app.ActivityThread.handleBindApplication(ActivityThread.java:5950)
    at android.app.ActivityThread.access$1200(ActivityThread.java:200)
    at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1673)
    at android.os.Handler.dispatchMessage(Handler.java:106)
    at android.os.Looper.loop(Looper.java:193)
    at android.app.ActivityThread.main(ActivityThread.java:6814)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:547)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:873)
Caused by: com.a.a.a.c.a: ARouter::ARouter init logistics center exception! [com.alibaba.android.arouter.routes.ARouter$$Root$$lib_common]
    at com.a.a.a.b.a.a(LogisticsCenter.java:208)
    at com.a.a.a.e.b.a(_ARouter.java:62)
    at com.a.a.a.e.a.a(ARouter.java:41)
    at qsbk.app.voice.CommonAppInit.b(CommonAppInit.java:68)
    at com.sankuai.erp.component.appinit.api.b.h(AppInitDispatcher.java:63)
    at com.sankuai.erp.component.appinit.api.b.lambda$5gtpIXykA4U6B_02T7ru1-cnJ9c(Unknown Source:0)
    at com.sankuai.erp.component.appinit.api.-$$Lambda$b$5gtpIXykA4U6B_02T7ru1-cnJ9c.run(Unknown Source:2)
    at com.sankuai.erp.component.appinit.a.b.a(AppInitCommonUtils.java:161)
    at com.sankuai.erp.component.appinit.a.b.a(AppInitCommonUtils.java:169)
    at com.sankuai.erp.component.appinit.api.b.g(AppInitDispatcher.java:63)
    at com.sankuai.erp.component.appinit.api.b.lambda$500f2XWkwePC3EO5VA7aMA2SK-k(Unknown Source:0)
    at com.sankuai.erp.component.appinit.api.-$$Lambda$b$500f2XWkwePC3EO5VA7aMA2SK-k.dispatch(Unknown Source:2)
    at com.sankuai.erp.component.appinit.api.b.a(AppInitDispatcher.java:147)
    at com.sankuai.erp.component.appinit.api.b.a(AppInitDispatcher.java:62)
    at com.sankuai.erp.component.appinit.api.c.f(AppInitManager.java:112)
    at com.sankuai.erp.component.appinit.api.c.lambda$Hb2289eoVdwfpGzivu4Gly-1WaI(Unknown Source:0)
    at com.sankuai.erp.component.appinit.api.-$$Lambda$c$Hb2289eoVdwfpGzivu4Gly-1WaI.run(Unknown Source:2)
    at com.sankuai.erp.component.appinit.a.b.a(AppInitCommonUtils.java:161)
    at com.sankuai.erp.component.appinit.a.b.b(AppInitCommonUtils.java:178)
    at com.sankuai.erp.component.appinit.api.c.a(AppInitManager.java:1112)
    at qsbk.app.voice.base.app.a.b(DefaultAppInitImpl.kt:84)
    at qsbk.app.voice.base.app.a.a(DefaultAppInitImpl.kt:41)
    at qsbk.app.QsbkApp.onCreate(QsbkApp.java:489)
    at android.app.Instrumentation.callApplicationOnCreate(Instrumentation.java:1155)
    at android.app.ActivityThread.handleBindApplication(ActivityThread.java:5945)
    at android.app.ActivityThread.access$1200(ActivityThread.java:200) 
    at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1673) 
    at android.os.Handler.dispatchMessage(Handler.java:106) 
    at android.os.Looper.loop(Looper.java:193) 
    at android.app.ActivityThread.main(ActivityThread.java:6814) 
    at java.lang.reflect.Method.invoke(Native Method) 
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:547) 
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:873)
```

### ARouter在红米Note7 Miui10.3.4版本上，Splash也跳转2次有一次闪退

```kotlin
ARouter.getInstance()
    .build(ARouterConstants.Home.ROUTER_PATH_ACTIVITY_MAIN)
    .navigation()
finish()
```

问题分析：<br />闪退问题是由于Splash ARouter跳转到登录或主页，紧跟着就finish了，而ARouter跳转是异步的，可能由于context出问题了，就跳转不过去了，改成这样就ok了<br />改为就ok了：

```kotlin
ARouter.getInstance()
    .build(ARouterConstants.Home.ROUTER_PATH_ACTIVITY_MAIN)
    .navigation(this, object : NavCallback() {
        override fun onArrival(postcard: Postcard?) {
            finish()
        }
    })
```

> 这诡异bug什么log都没有；我有一台和你一样的，手机型号都一样，miui10.2都没有，只在MIUI10.3.4上出现。

#### 使用ARouter跳转singleTop失效

我们使用ARouter来处理URL Scheme时，会定义个SchemeFilterActivity

1. xml中定义scheme

```xml
<activity
    android:name=".deeplink.SchemeFilterActivity"
    android:launchMode="singleTop"
    android:noHistory="true"
    android:screenOrientation="portrait"
    android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
    android:theme="@style/AppTheme.Base.TRANSPARENT">
    <intent-filter>
        <data android:scheme="msalam" />

        <action android:name="android.intent.action.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
    </intent-filter>
</activity>
```

2. 代码处理

```kotlin
/**
 * 不要startActivity到这，会导致目标页的singleTop失效
 */
class SchemeFilterActivity : AppCompatActivity(), INoShowFloatingView {

    companion object {
        const val TAG = ARouterConstants.TAG
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(getIntent())
    }

    private fun handleIntent(intent: Intent?) {
        if (intent == null) {
            logAndToast(TAG, "handleIntent intent is null")
            handleIncompatibleUri()
            return
        }
        val uri = intent.data
        if (uri == null) {
            LogUtils.w(TAG, "handleIntent uri is null", true)
            handleIncompatibleUri()
            return
        }
        if (uri.path == null) {
            LogUtils.w(TAG, "handleIntent path为null，检测下uri是否配置正确，需要二级path，uri=${uri.toString()}", true)
            handleIncompatibleUri()
            return
        }

        // 收到来自web页面的deepLink，上报Adjust做再归因
        if (uri.toString().contains(DEEP_LINK_FROM_WEB)) {
            Adjust.appWillOpenUrl(uri, applicationContext)
        }

        val isNeedBackHome = intent.getBooleanExtra(Constants.IntentKey.NEED_BACK_HOME, false)

        LogUtils.d(TAG, "${anchor("handleIntent")}原始uri，isNeedBackHome=$isNeedBackHome，" +
                "scheme=${uri.scheme}，path=${uri.path}，host=${uri.host}，uri=$uri")

        ARouter.getInstance()
                .build(uri)
                .withBoolean(Constants.IntentKey.NEED_BACK_HOME, isNeedBackHome)
                .navigation(this, object : NavCallback() {
                    override fun onArrival(postcard: Postcard?) {
                        finish()
                    }

                    override fun onLost(postcard: Postcard?) {
                        super.onLost(postcard)
                        handleIncompatibleUri()
                    }
                })
    }

    private fun handleIncompatibleUri() {
        ARouter.getInstance()
                .build(ARouterConstants.Home.ROUTER_PATH_ACTIVITY_MAIN)
                .navigation(this, object : NavCallback() {
                    override fun onArrival(postcard: Postcard?) {
                        finish()
                    }

                    override fun onLost(postcard: Postcard?) {
                        super.onLost(postcard)
                        finish()
                    }
                })
    }
}
```

一般在App中会存在各种banner及和h5的各种交互，我们都是通过定义一套和URL Scheme一样的协议来处理，此时如果通过startActivity SchemeFilterActivity来跳转的话，就会导致如果目标Activity设置了`singleTop`的launchMode会失效，因为中间多了一层SchemeFilterActivity；直接用ARouter跳转即可。

### ARouter [@autowired ](/autowired) 相关问题

#### ARouter Activity onNewIntent [@Autowired ](/Autowired) 不生效

<https://github.com/alibaba/ARouter/issues/497>

当Activity 的launchMode 设置为 singleTask，在activity再次被启动时，autowired 不会生效，<br />intent里可以取到数据，希望可以在onNewIntent的时候也能自动处理一下intent的数据

解决：

```
onCreate 里面也要你自己调用 ARouter.inject(this) 的，同理 onNewIntent 里面你也要自己调用一下这个
```

#### ARouter kotlin [@Autowired ](/Autowired)

需要加上`@JvmField`字段。

#### ARouter [@Autowired ](/Autowired) 注解会覆盖默认值(只有String/Parcelable/Parcelable[]/ArrayList/Serializable的才有，其他基础类型不会)

```
@Autowired()
String name="Andy";
通过Scheme跳转当Uri中没有没有name参数时，name的默认值会被覆盖掉变成null.

版本：
arouter-compiler:1.2.2
arouter-api:1.5.0
```

> <https://github.com/alibaba/ARouter/issues/729>

案例：

```kotlin
@JvmField
@Autowired
var name: String = ""  // 缺失无默认值

@JvmField
@Autowired
var age: Int = -1 // 缺失有默认值

@JvmField
@Autowired
var male: Boolean = false // 缺失有默认值

@JvmField
@Autowired
var mm: String = "MM" // 缺失无默认值
@JvmField
@Autowired
var hh: String? = "呵呵"  // 缺失无默认值
//
@JvmField
@Autowired
var user: UserNpe = UserNpe()  // 缺失无默认值
```

反编译后代码：

```
public void inject(Object target) {
    serializationService = ARouter.getInstance().navigation(SerializationService.class);
    ARouter注入空问题 substitute = (ARouter注入空问题)target;
    substitute.name = substitute.getIntent().getStringExtra("name");
    substitute.age = substitute.getIntent().getIntExtra("age", substitute.age);
    substitute.male = substitute.getIntent().getBooleanExtra("male", substitute.male);
    substitute.mm = substitute.getIntent().getStringExtra("mm");
    substitute.hh = substitute.getIntent().getStringExtra("hh");
    substitute.user = substitute.getIntent().getParcelableExtra("user");
}
```

具体有没有默认值，具体看生成的intent.getXXXExtra()有没有默认值。

#### ARouter [@Autowired ](/Autowired) 注解的属性为null的问题

`@Autowired` 修饰的属性一定要为小写，`withLong`对应long ,`withBoolean`对应boolean。如果写成了Long或Boolean就不行。

> <https://github.com/alibaba/ARouter/issues/689>

#### 在父类使用属性注入，创建子类不会执行注入属性

<https://github.com/alibaba/ARouter/issues/227>

```java
public class APresenter {
    @Autowired
    protected LoginService mLoginServiceA;
    public APresenter() {
        ARouter.getInstance().inject(this);
    }
}

public class BPresenter extends APresenter {
    @Autowired
    LoginService mLoginServiceB;
//    @Autowired
//    LoginService mLoginServiceA;
    public BPresenter() {
        super();
        ARouter.getInstance().inject(this);
    }
}
```

这种，APresenter就获取不到BPresenter的mLoginServiceB实例。

#### `@Autowired` 注解的属性/方法所在的类需要 `@Keep`

否则可能会找不到类导致初始化失败。具体原因见代码 `com.alibaba.android.arouter.core.AutowiredServiceImpl#autowire`

1. 在对应使用了Autowired的类中加上[@Keep ](/Keep)

```kotlin
@Keep
object UserCenterManager {
}
```

2. 添加keep规则

```kotlin
-keep class com.alibaba.android.arouter.facade.annotation.Autowired
-keepclasseswithmembers class * {@com.alibaba.android.arouter.facade.annotation.Autowired <fields>;}
```

> 参考<https://github.com/alibaba/ARouter/issues/140，issue中的keep规则错误，编译不过>

#### Provider 所在的类需要有默认的构造器，kt中的object类就不行

使用:

```
@Route(path = "debug/flipper_provider")
object DebugHelper : IDebugProvider {
}
```

原因：ARouter会通过反射创建Provider实例，如果没有提供默认构造器会编译失败；kt中的object是私有的构造器，反射会失败

```java
class LogisticsCenter {
    public synchronized static void completion(Postcard postcard) {
        // ...
        switch (routeMeta.getType()) {
                case PROVIDER:  // if the route is provider, should find its instance
                    // Its provider, so it must implement IProvider
                    Class<? extends IProvider> providerMeta = (Class<? extends IProvider>) routeMeta.getDestination();
                    IProvider instance = Warehouse.providers.get(providerMeta);
                    if (null == instance) { // There's no instance of this provider
                        IProvider provider;
                        try {
                            provider = providerMeta.getConstructor().newInstance();
                            provider.init(mContext);
                            Warehouse.providers.put(providerMeta, provider);
                            instance = provider;
                        } catch (Exception e) {
                            throw new HandlerException("Init provider failed! " + e.getMessage());
                        }
                    }
                    postcard.setProvider(instance);
                    postcard.greenChannel();    // Provider should skip all of interceptors
                    break;
                case FRAGMENT:
                    postcard.greenChannel();    // Fragment needn't interceptors
                default:
                    break;
            }
        }
         // ...
    }
}
```
