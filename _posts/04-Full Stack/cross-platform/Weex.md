---
date created: 2024-12-26 00:25
date updated: 2024-12-26 00:25
dg-publish: true
tags:
  - '#41B883;'
  - '#0ff;'
---

# Weex开发环境安装

## 开发环境

```
JDK7.0+
AS
Node.js
npm
weex
webpack
```

**注意：** 如果安装失败，用root运行，前面加`sudo`

### 1、安装nodejs

> 直接<https://nodejs.org/en/download/下载安装>

检测安装成功：

```
node -v
```

### 2、安装npm

> 安装完nodejs就会自带了npm，也可以使用淘宝的cnpm，`npm install -g cnpm --registry=https://registry.npm.taobao.org`，之后就可以用cnpm替代npm了

检测安装成功：

```
npm -v
```

### 3、安装weex-toolkit

安装`weex-toolkit`

```
npm install weex-toolkit -g
```

检测安装成功：

```
weex -v
```

### 4、安装weexpack

```
npm install weexpack -g
```

检测安装成功：

```
weexpack -V // 大写的-V或--version
```

### 5、安装全局webpack

> 使用npm安装webpack,如果你安装很慢，这个是可以使用cnpm来进行安装的

```
npm install webpack -g
sudo npm install webpack-cli -g // 可能需要手动安装webpack-cli
```

检测安装成功：

```
webpack -v
```

## 开发工具

- WebStorm
- VSCode

> 插件vetur

## 创建weex工程

- 新建helloweex(不能大写)

```
weex create helloweex
// 或者
weex w init helloweex
```

- 添加Android应用支持(安装好后可以去项目根目录的platforms下看到android文件夹，说明应用支持添加成功。)

```
weex platform add android
```

- 安装依赖的第三方 js 包

```
npm install
```

- 启动本地 web 服务，浏览器预览渲染效果

```
weex run start
// 或者 npm start
```

- 运行项目和服务器

```
weex run dev 
weex run serve
```

- 运行到Android设备

```
weex run android // 选择设备进行安装
// 或者
npm run android
```

- 打包Android

```
weex run pack:android
```

- clean

```
weex run clean:android
```

---

- 常用的npm命令

```
npm start  // 在本地server，打开浏览器预览

npm run android // 运行android

npm run pack:android // 打个android apk包
```

# Weex环境变量

<https://weex.apache.org/zh/docs/api/weex-variable.html>

每个 Weex 页面的 JS 上下文中都有一个相互独立的 `weex`变量，它可以像全局变量一样使用，不过它在不同页面中是隔离而且只读的。

> 注意： weex 实例变量只在 `Vue` 框架中暴露了，目前还不支持在 Rax 框架中使用。

```
declare type Weex = {
  config: WeexConfigAPI;
  document: WeexDocument;
  requireModule: (name: string) => Object | void;
  supports: (condition: string) => boolean | void;
}
```

## config

## document

## requireModule

## supports

# Weex语法

<https://weex.apache.org/zh/guide/introduction.html>

- weex最外层只能使用`<template>`，且只能有一个子标签
- 在写Css样式时，必须使用类名或者ID进行设置，其他选择器不起作用

# Weex自定义发送事件(native→js)

[https://weex.apache.org/zh/docs/api/android-apis.html#自定义发送事件](https://weex.apache.org/zh/docs/api/android-apis.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%91%E9%80%81%E4%BA%8B%E4%BB%B6)

## fireEvent

向JS环境发送一些事件，比如`click`事件

1. void fireEvent(elementRef,type)
2. void fireEvent(elementRef,type, data)
3. void fireEvent(elementRef,type,data,domChanges)

```
elementRef(String)：产生事件的组件id
type(String): 事件名称，weex默认事件名称格式为"onXXX",比如OnPullDown
data(Map<String, Object>): 需要发送的一些额外数据，比如click时，view大小，点击坐标等等。
domChanges(Map<String, Object>): 目标组件的属性和样式发生的修改内容
```

通过`WXSDKInstace`调用

> 注：在WxComponent可以直接调用fireEvent

## fireGlobalEvent

<https://weex.apache.org/zh/docs/modules/globalEvent.html#globalevent>

# Weex常用命令和热更新

weex中常用的npm命令。这些`npm xxx`的命令，其实都是在`package.json`里设置的

```
"scripts": {
    "start": "npm run serve",
    "build": "webpack --env.NODE_ENV=common",
    "build:prod": "webpack --env.NODE_ENV=production",
    "build:prod:web": "webpack --env.NODE_ENV=release",
    "build:plugin": "webpack --env.NODE_ENV=plugin",
    "clean:web": "rimraf ./release/web",
    "clean:ios": "rimraf ./release/ios",
    "clean:android": "rimraf ./release/android",
    "dev": "webpack --env.NODE_ENV=common --progress --watch",
    "unit": "karma start test/unit/karma.conf.js --single-run",
    "test": "npm run unit",
    "lint": "eslint --ext .js,.vue src  test/unit --fix",
    "serve": "webpack-dev-server --env.NODE_ENV=development --progress",
    "ios": "weex run ios",
    "web": "npm run serve",
    "android": "weex run android",
    "pack:ios": "npm run clean:ios && weex build ios",
    "pack:android": "npm run clean:android && weex build android",
    "pack:web": "npm run clean:web && npm run build:prod:web"
},
```

## npm run dev

给我们进行实时的压缩混淆操作（也叫编译操作），生成dist目录下的`index.js`文件和`index.web.js`文件。<br>命令开启后，我们每次修改`src`下的文件会**自动给我们编译**。所以我们在开发时需要最先开启这个命令。

```
npm run dev
```

## npm run serve

虽然可以用Android Studio进行看效果，但是我们还是需要一个web端来支持我们开发预览的，这时候我们可以启用npm run serve 来解决问题，他会给我们在浏览器中打开我们的vue页面（但是需要注意的是，你现在看到的并不是程序的最终样式和结果）。

```
npm run serve
```

## npm run build

## npm run build:prod

打包

# Weex Adapter

## image

## http

## websocket

# Weex加载图片

## 网络图片

## 本地图片

## drawable图片

## assets图片

## 案例

以Fresco为例：

```java
final class ImageUrlHelper {

    private static final String TAG = "qsbk.weex";
    private static final String PREFIX_ASSETS = "asset://";
    private static final String PREFIX_DRAWALBE = "res://";
    private static final String PREFIX_MIPMAP = "mipmap://";

    static String findUrl(@NonNull String url) {
        String temp = url;
        if (temp.startsWith("//")) {
            temp = "https:" + temp;
            LogUtils.i(TAG, "url以//开头，认为是https图片：" + temp);
        } else if (temp.startsWith(PREFIX_DRAWALBE)) {
            // fresco加载本地drawable格式： res://packagename/resId

            String name = temp.substring(PREFIX_DRAWALBE.length());
            int resId = GlobalContext.getAppContext().getResources().getIdentifier(name, "drawable", AppUtils.getAppPackageName());
            if (resId == 0) {
                LogUtils.w(TAG, "没有找到合适的资源: " + url);
//                throw new IllegalArgumentException("没有找到合适的资源: " + url);
            } else {
                temp = PREFIX_DRAWALBE + AppUtils.getAppPackageName() + "/" + resId;
                LogUtils.i(TAG, "url以res://开头，从drawable加载图片：" + temp);
            }
        } else if (temp.startsWith(PREFIX_ASSETS)) {
//            file:///android_asset/
            String name = temp.substring(PREFIX_ASSETS.length());
            temp = PREFIX_ASSETS + "/" + name;
            LogUtils.i(TAG, "url以asset://开头，从asset加载图片：" + temp);
        }
        return temp;
    }

}
```

```javascript
<image :src="logo" class="localImage" />
<image :src="res1" class="localImage" />
<image :src="res2" class="localImage" />

logo: getPackImage('1.png'),
res1: "res://qb_s_00",
res2: "asset://qb_s_02.png",

// 包内图片必须使用改函数包裹
const getImg=function(name) {
  let platform = weex.config.env.platform
  let path = ''
  if (platform == 'Web') { path = `web/devAssets/${name}` }
  else{ path = `assets/${name}` }
  return path
}
export default getImg
```

# Weex Module

## 结果回调

[https://weex.apache.org/zh/docs/api/android-apis.html#结果回调](https://weex.apache.org/zh/docs/api/android-apis.html#%E7%BB%93%E6%9E%9C%E5%9B%9E%E8%B0%83)

1. void invoke(Object data);

> 只能调用一次，在调用结束后销毁

2. void invokeAndKeepAlive(Object data);

> 可以持续调用，一般用这个

JS调用时，有的场景需要返回一些数，比如以下例子，返回x、y坐标

```
public class WXLocation extends WXModule {
    @JSMethod
    public void getLocation(JSCallback callback){
    //Get the code for the location information .....
    Map<String,String> data=new HashMap<>();
    data.put("x","x");
    data.put("y","y");
    //notify once
    callback.invoke(data);
    //Continuous connection
    callback.invokeAndKeepAlive(data);
    //Invoke method and invokeAndKeepAlive two methods of choice  }
}
```

## 跟随Activity生命周期

> 注册时，不能注册为global的。

```java
public static <T extends WXModule> boolean registerModule(String moduleName, Class<T> moduleClass,boolean global) throws WXException {
    return moduleClass != null && registerModule(moduleName, new TypeModuleFactory<>(moduleClass), global);
  }
```

可以重写的生命周期。

```java

  /** hook the Activity life cycle to Instance module**/
  public void onActivityResult(int requestCode, int resultCode, Intent data){}

  public void onActivityCreate(){}

  public void onActivityStart(){}

  public void onActivityPause(){}

  public void onActivityResume(){}

  public void onActivityStop(){}

  public void onActivityDestroy(){}

  public boolean onActivityBack() {return false;}

  public boolean onCreateOptionsMenu(Menu menu){return false;}
```

## 案例

- PhoneInfoModule

> 获取手机信息Module

```java
public class PhoneInfoModule extends WXModule {
    @JSMethod(uiThread = false)
    public void getPhoneInfo(JSCallback callback) {
        Map<String, String> infos = new HashMap<>();
        infos.put("board", Build.BOARD);
        infos.put("brand", Build.BRAND);
        infos.put("device", Build.DEVICE);
        infos.put("model", Build.MODEL);
        callback.invoke(infos);
    }
    @JSMethod(uiThread = true)
    public void printLog(String msg) {
        Toast.makeText(mWXSDKInstance.getContext(), msg, Toast.LENGTH_SHORT).show();
    }
}
```

- 注册Module

```java
WXSDKEngine.registerModule("phoneInfo", PhoneInfoModule.class);
```

- vue是使用

```
<template>
  <div class="wrapper">
    <image src="https://gtms02.alicdn.com/tps/i2/TB1QHKjMXXXXXadXVXX20ySQVXX-512-512.png">111</image>
      <text style="font-size:24" @click="printLog">这是一个24size的text</text>
      <text style="font-size:24" @click="printLog('调用module的printLog，并传递参数')">调用module的printLog，并传递参数</text>
      <text class="large">text 样式</text>
      <text class="greeting" @click="getPhoneInfo">getPhoneInfo!!!</text>
  </div>
</template>

<script>
 const modal = weex.requireModule('modal');
 const phoneInfo = weex.requireModule('phoneInfo')
 
export default {
 name: 'HelloWorld',
 data() {

 },
 methods:{
    printLog(msg) {
      console.log('print:')
      phoneInfo.printLog("从weex传递过来的");
    },
      // 调用 PhoneInfoModule 中的 getPhoneInfo(),并回调给 weex
    getPhoneInfo() {
      console.log('输出getPhoneInfo:')
      phoneInfo.getPhoneInfo(function (e) {
          modal.alert({
              message: JSON.stringify(e),
              duration: 0.3
          })
      });
    }
 }
}
</script>

<style>
  .wrapper {
        justify-content:flex-start;
        align-items:flex-start;
    }
  .large{
    font-size:30;
  }
  .greeting{
        text-align: center;
        margin-top: 10px;
        font-size: 50px;
        color: #41B883;
    }
</style>
```

# Weex Component

```
public class RichTextComponent extends WXComponent<TextView> {

    public RichTextComponent(WXSDKInstance instance, WXVContainer parent, BasicComponentData basicComponentData) {
        super(instance, parent, basicComponentData);
    }

    public RichTextComponent(WXSDKInstance instance, WXVContainer parent, int type, BasicComponentData basicComponentData) {
        super(instance, parent, type, basicComponentData);
    }

    @Override
    protected TextView initComponentHostView(@NonNull Context context) {
        final TextView textView = new TextView(context);
        textView.setTextSize(20);
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getContext(), "click: " + textView.getText().toString(), Toast.LENGTH_SHORT).show();
            }
        });
        return textView;
    }

    @WXComponentProp(name = "tel")
    public void setTel(String number) {
        SpannableString spannableString = new SpannableString("tel:" + number);
        ImageSpan imageSpan = new ImageSpan(getContext(), R.mipmap.ic_launcher);
        spannableString.setSpan(imageSpan, 0, 4, Spanned.SPAN_INCLUSIVE_INCLUSIVE);
        getHostView().setText(spannableString);
    }

}
```

- 注册Component

```
 WXSDKEngine.registerComponent("richtext", RichTextComponent.class, false);
```

- vue

```
<template>
  <div class="wrapper">
      <richtext tel="10086" style="width:200px;height:200px">111</richtext>
  </div>
</template>


<style>
  .wrapper {
        justify-content:flex-start;
        align-items:flex-start;
    }
</style>
```

## 自定义Component

Weex Vue写法：

```
<template>
  <div class="wrapper">
    <animBucket ref="animBucket" class="animBucket" @click="showAnim">
      <text class="text">本地webp静图</text>
      <qbimg class="qbimg" src="laugh.png1" autoBitmapRecycle="false" placeholder="assets/4.png" />
      <text class="text">本地webp动图</text>
    </animBucket>
  </div>
</template>

<script>
const modal = weex.requireModule("modal");

export default {
  name: "index",
  data() {},
  methods: {
    showAnim() {
      modal.toast({
        message: "弹出动画从weex",
        duration: 1.5
      });
      this.$refs.animBucket.showAnimation(); // $refs表示有个ref
    }
  }
};
</script>

<style scoped>
.wrapper {
  justify-content: center;
  align-items: center;
}
.animBucket {
  width: 400px;
  height: 500px;
  background-color: transparent;
  border-width: 2px;
  border-color: #0ff;
  border-style: solid;
}
</style>
```

# Weex Navigator

# Weex控制Android返回键解决方案

<https://segmentfault.com/a/1190000010035286>

# weex组件之text

## text

text组件是weex内置的组件，他是用来放至文本的容器

### 1.超出显示省略号

text组件提供一个lines的样式，直接把这个样式写在css里就可以生效了，并且带了省略号。这里的坑就是不要写在标签的属性上，而是要写在样式里。

# Weex坑集锦

## GSYGithubAppWeex question

<https://github.com/CarGuo/GSYGithubAppWeex/blob/master/question.md>

## loading-indicator组件

`loading-indicator`在Android上没有动画，官方demo也不行

## richtext组件

富文本阴影，在iOS会显示一行，而不是跟随内容

## navigator问题

1. navigator跳转隐式意图弹个选择框
2. navigator多页面打开失败FileUriExposedException

### Weex navigator多页面打开失败FileUriExposedException

<https://github.com/alibaba/weex/issues/3119><br><https://github.com/apache/incubator-weex/issues/1936>

```
// 在你的Application中添加：
if (Build.VERSION.SDK_INT>=18) {
    StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
    StrictMode.setVmPolicy(builder.build());
    builder.detectFileUriExposure();
}
```

### ActivityNotFoundException问题

```
 <activity
         android:name=".xxxxxx"
         android:label="@string/app_name"
         android:screenOrientation="portrait"
         android:theme="@style/AppTheme.NoActionBar">
     <intent-filter>
         <action android:name="com.taobao.android.intent.action.WEEX"/>

         <category android:name="android.intent.category.DEFAULT"/>
         <category android:name="com.taobao.android.intent.category.WEEX"/>
         <action android:name="android.intent.action.VIEW"/>

         <data android:scheme="http"/>
         <data android:scheme="https"/>
         <data android:scheme="file"/>
         <data android:scheme="wxpage" />
     </intent-filter>
 </activity>
```

### navigator跳转隐式意图弹个选择框

重写navigator module，写死category

参考：<br>Weex之页面跳转以及Android端多应用选择窗口的处理<br><https://www.jianshu.com/p/572199f9b838>

- AndroidManifest.xml

```xml
<activity
                android:name="qsbk.app.voice.weex.navigator.WXPageActivity"
                android:taskAffinity="qsbk.app.voice.voicechatroom"
                android:configChanges="orientation|screenSize|keyboardHidden"
                android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="${applicationId}.intent.action.WEEX"/>

                <action android:name="android.intent.action.VIEW"/>

                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <category android:name="${applicationId}.intent.category.WEEX"/>

                <data android:scheme="http"/>
                <data android:scheme="https"/>
                <data android:scheme="file"/>
                <data android:scheme="wxpage"/>
            </intent-filter>
        </activity>
```

- VoiceRoomWXNavigatorModule

```java
public class VoiceRoomWXNavigatorModule extends BaseWxModule {

    public static final String MODULE_NAME = "navigatorAndroid";

    public static final String MSG_SUCCESS = "WX_SUCCESS";
    public static final String MSG_FAILED = "WX_FAILED";
    public static final String MSG_PARAM_ERR = "WX_PARAM_ERR";

    public static final String CALLBACK_RESULT = "result";
    public static final String CALLBACK_MESSAGE = "message";

    private final static String INSTANCE_ID = "instanceId";
    private final static String TAG = "Navigator";
    private final static String WEEX = "com.taobao.android.intent.category.WEEX";
    private final static String WEEX_ACTION = GlobalContext.getAppContext().getPackageName() + ".intent.action.WEEX";
    private final static String WEEX_CATEGORY = GlobalContext.getAppContext().getPackageName() + ".intent.category.WEEX";
    private final static String URL = "url";

    @JSMethod(uiThread = true)
    public void open(JSONObject options, JSCallback success, JSCallback failure) {
        if (options != null) {
            String url = options.getString(Constants.Value.URL);
            JSCallback callback = success;
            JSONObject result = new JSONObject();
            if (!TextUtils.isEmpty(url)) {
                Uri rawUri = Uri.parse(url);
                String scheme = rawUri.getScheme();
                if (TextUtils.isEmpty(scheme) || Constants.Scheme.HTTP.equalsIgnoreCase(scheme) || Constants.Scheme.HTTPS.equalsIgnoreCase(scheme)) {
                    this.push(options.toJSONString(), success);
                } else {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, rawUri);
                        mWXSDKInstance.getContext().startActivity(intent);
                        result.put(CALLBACK_RESULT, MSG_SUCCESS);
                    } catch (Throwable e) {
                        e.printStackTrace();
                        result.put(CALLBACK_RESULT, MSG_FAILED);
                        result.put(CALLBACK_MESSAGE, "Open page failed.");
                        callback = failure;
                    }
                }
            } else {
                result.put(CALLBACK_RESULT, MSG_PARAM_ERR);
                result.put(CALLBACK_MESSAGE, "The URL parameter is empty.");
                callback = failure;
            }

            if (callback != null) {
                callback.invoke(result);
            }
        }
    }

    @JSMethod(uiThread = true)
    public void close(JSONObject options, JSCallback success, JSCallback failure) {
        JSONObject result = new JSONObject();
        JSCallback callback = null;
        if (mWXSDKInstance.getContext() instanceof Activity) {
            callback = success;
            ((Activity) mWXSDKInstance.getContext()).finish();
        } else {
            result.put(CALLBACK_RESULT, MSG_FAILED);
            result.put(CALLBACK_MESSAGE, "Close page failed.");
            callback = failure;
        }
        if (callback != null) {
            callback.invoke(result);
        }
    }

    @JSMethod()
    public void push(String param, JSCallback callback) {

        if (!TextUtils.isEmpty(param)) {
            if (WXSDKEngine.getActivityNavBarSetter() != null) {
                if (WXSDKEngine.getActivityNavBarSetter().push(param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }

            if (mWXSDKInstance.getContext() instanceof Activity) {
                Activity activity = (Activity) mWXSDKInstance.getContext();

                if (WXSDKEngine.getNavigator() != null
                        && WXSDKEngine.getNavigator().push(activity, param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }

            try {
                JSONObject jsonObject = JSON.parseObject(param);
                String url = jsonObject.getString(URL);
                if (!TextUtils.isEmpty(url)) {
                    Uri rawUri = Uri.parse(url);
                    String scheme = rawUri.getScheme();
                    Uri.Builder builder = rawUri.buildUpon();
                    if (TextUtils.isEmpty(scheme)) {
                        builder.scheme(Constants.Scheme.HTTP);
                    }
                    Intent intent = new Intent(Intent.ACTION_VIEW, builder.build());
                    intent.setAction(WEEX_ACTION);
                    intent.addCategory(WEEX_CATEGORY);
                    intent.putExtra(INSTANCE_ID, mWXSDKInstance.getInstanceId());
                    mWXSDKInstance.getContext().startActivity(intent);
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                }
            } catch (Exception e) {
                WXLogUtils.eTag(TAG, e);
                if (callback != null) {
                    callback.invoke(MSG_FAILED);
                }
            }
        } else if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void pop(String param, JSCallback callback) {

        if (WXSDKEngine.getActivityNavBarSetter() != null) {
            if (WXSDKEngine.getActivityNavBarSetter().pop(param)) {
                if (callback != null) {
                    callback.invoke(MSG_SUCCESS);
                }
                return;
            }
        }

        if (mWXSDKInstance.getContext() instanceof Activity) {
            Activity activity = (Activity) mWXSDKInstance.getContext();
            if (WXSDKEngine.getNavigator() != null) {
                if (WXSDKEngine.getNavigator().pop(activity, param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }

            if (callback != null) {
                callback.invoke(MSG_SUCCESS);
            }
            ((Activity) mWXSDKInstance.getContext()).finish();
        }
    }

    @JSMethod(uiThread = true)
    public void setNavBarRightItem(String param, JSCallback callback) {
        if (!TextUtils.isEmpty(param)) {
            if (WXSDKEngine.getActivityNavBarSetter() != null) {
                if (WXSDKEngine.getActivityNavBarSetter().setNavBarRightItem(param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }
        }

        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void clearNavBarRightItem(String param, JSCallback callback) {
        if (WXSDKEngine.getActivityNavBarSetter() != null) {
            if (WXSDKEngine.getActivityNavBarSetter().clearNavBarRightItem(param)) {
                if (callback != null) {
                    callback.invoke(MSG_SUCCESS);
                }
                return;
            }
        }
        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void setNavBarLeftItem(String param, JSCallback callback) {
        if (!TextUtils.isEmpty(param)) {
            if (WXSDKEngine.getActivityNavBarSetter() != null) {
                if (WXSDKEngine.getActivityNavBarSetter().setNavBarLeftItem(param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }
        }

        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }

    }

    @JSMethod(uiThread = true)
    public void clearNavBarLeftItem(String param, JSCallback callback) {
        if (WXSDKEngine.getActivityNavBarSetter() != null) {
            if (WXSDKEngine.getActivityNavBarSetter().clearNavBarLeftItem(param)) {
                if (callback != null) {
                    callback.invoke(MSG_SUCCESS);
                }
                return;
            }
        }

        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void setNavBarMoreItem(String param, JSCallback callback) {
        if (!TextUtils.isEmpty(param)) {
            if (WXSDKEngine.getActivityNavBarSetter() != null) {
                if (WXSDKEngine.getActivityNavBarSetter().setNavBarMoreItem(param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }
        }

        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void clearNavBarMoreItem(String param, JSCallback callback) {
        if (WXSDKEngine.getActivityNavBarSetter() != null) {
            if (WXSDKEngine.getActivityNavBarSetter().clearNavBarMoreItem(param)) {
                if (callback != null) {
                    callback.invoke(MSG_SUCCESS);
                }
                return;
            }
        }

        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod(uiThread = true)
    public void setNavBarTitle(String param, JSCallback callback) {
        if (!TextUtils.isEmpty(param)) {
            if (WXSDKEngine.getActivityNavBarSetter() != null) {
                if (WXSDKEngine.getActivityNavBarSetter().setNavBarTitle(param)) {
                    if (callback != null) {
                        callback.invoke(MSG_SUCCESS);
                    }
                    return;
                }
            }
        }
        if (callback != null) {
            callback.invoke(MSG_FAILED);
        }
    }

    @JSMethod
    public void setNavBarHidden(String param, final String callback) {
        String message = MSG_FAILED;
        try {
            JSONObject jsObj = JSON.parseObject(param);
            int visibility = jsObj.getInteger(Constants.Name.NAV_BAR_VISIBILITY);
            boolean success = changeVisibilityOfActionBar(mWXSDKInstance.getContext(), visibility);
            if (success) {
                message = MSG_SUCCESS;
            }
        } catch (JSONException e) {
            WXLogUtils.e(TAG, WXLogUtils.getStackTrace(e));
        }
        WXBridgeManager.getInstance().callback(mWXSDKInstance.getInstanceId(), callback, message);
    }

    private boolean changeVisibilityOfActionBar(Context context, int visibility) {
        boolean result = false;
        boolean hasAppCompatActivity = false;
        try {
            Class.forName("android.support.v7.app.AppCompatActivity");
            hasAppCompatActivity = true;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        if (hasAppCompatActivity && mWXSDKInstance.getContext() instanceof AppCompatActivity) {
            android.support.v7.app.ActionBar actionbar = ((AppCompatActivity) mWXSDKInstance.getContext()).getSupportActionBar();
            if (actionbar != null) {
                switch (visibility) {
                    case Constants.Value.NAV_BAR_HIDDEN:
                        actionbar.hide();
                        result = true;
                        break;
                    case Constants.Value.NAV_BAR_SHOWN:
                        actionbar.show();
                        result = true;
                        break;
                }
            }
        } else if (mWXSDKInstance.getContext() instanceof Activity) {
            android.app.ActionBar actionbar = ((Activity) mWXSDKInstance.getContext()).getActionBar();
            if (actionbar != null) {
                switch (visibility) {
                    case Constants.Value.NAV_BAR_HIDDEN:
                        actionbar.hide();
                        result = true;
                        break;
                    case Constants.Value.NAV_BAR_SHOWN:
                        actionbar.show();
                        result = true;
                        break;
                }
            }
        }
        return result;
    }

}
```

## weex Fresco SIGSEGV

> qsbk.app.voice A/libc: Fatal signal 11 (SIGSEGV), code 1, fault addr 0x886b100c in tid 7195 (RenderThread)<br>调用了Fresco，已经关闭的bitmap了<br>见：weex fresco Fatal signal 11 (SIGSEGV), code 1, fault addr 0x886b100c in tid 7.md

vivo X5Pro D<br>Android5.0/Funtouch OS_2.5

### 问题

使用Fresco管线加载图片，加载后不持有图片引用。<br>问题：

1. 会将用户当前不展示的图片也加载到内存中，实际占用内存变多，OOM问题严重。
2. 引用不被持有会导致Bitmap被回收后仍然被使用（3.2 - 3.4版本top crash—SIGSEGV (SEGV_MAPERR)）

优化： 仿照Fresco的DraweeController管理WXImageView的bitmap引用。 显示时加载，隐藏时解除引用等待回收。

- 参考：Weex实战分享|企鹅电竞Weex实践和性能优化<br><https://juejin.im/entry/5c4543f26fb9a049ff4e6f87>

### 解决

```java
public final class FrescoImageAdapterV2 implements WxImgLoaderAdapter.ImageFactory {

    private static final String TAG = "weex";

    public FrescoImageAdapterV2() {
    }

    @Override
    public void loadImage(final String url, final ImageView imageView,
                          WXImageQuality quality, WXImageStrategy strategy) {

        if (imageView == null || imageView.getLayoutParams() == null) {
            LogUtils.w(TAG, "view为null或view.getLayoutParams()为null");
            return;
        }
        if (TextUtils.isEmpty(url)) {
            LogUtils.w(TAG, "url为empty");
            imageView.setImageBitmap(null);
            return;
        }

        if (imageView.getLayoutParams().width <= 0 || imageView.getLayoutParams().height <= 0) {
            LogUtils.w(TAG, "view的width或height不大于0，width: " + imageView.getLayoutParams().width
                    + "，height: " + imageView.getLayoutParams().height);
            return;
        }

        // 目前只有http和file://两种图片
        Context context = imageView.getContext();
        if (ImageUrlHelper.isFromHttp(url)) {
            Phoenix.with(context)
                    .setUrl(url)
                    .setResult(result -> {
                        if (result == null) {
                            LogUtils.w(TAG, "load网络图 error,bitmap is null，"
                                    + "url：" + url);
                            return;
                        }
                        LogUtils.i(TAG, "load网络图 成功，url：" + url);
                        imageView.setImageBitmap(result);
                    })
                    .load();
        } else {
            if (ImageUrlHelper.isFromFile(url)) {
                String path = url.substring(ImageUrlHelper.PREFIX_FILE.length());
                Bitmap bitmap = ImageUtils.getBitmap(path);
                imageView.setImageBitmap(bitmap);
                LogUtils.i(TAG, "load本地图 成功，url：" + url + "，path：" + path);

            }
        }
    }

    @Override
    public String url(Context context, String url) {
        return ImageUrlHelper.findUrl(url);
    }

}
```

## Weex Module不跟随Activity的生命周期

```java
WXSDKEngine.registerModule(StatusModule.MODULE_NAME, StatusModule.class, true);
```

写了true后，是全局的，就监听不到Activity的生命周期了，改为false就可以监听Activity生命周期。

## Weex image组件问题

> 默认image组件，在weex页面按home键到后台去，会将image图片清空，在App到前台时会重新设置图片，通过`autoBitmapRecycle`属性控制，默认是true。

```java
// WXImageView
@Override
protected void onWindowVisibilityChanged(int visibility) {
    super.onWindowVisibilityChanged(visibility);
    if(mOutWindowVisibilityChangedReally){
      if(visibility == View.VISIBLE){
        autoRecoverImage();
      }else{
        autoReleaseImage();
      }
    }
}
public void autoReleaseImage(){
    if(enableBitmapAutoManage) {
      if (!isBitmapReleased) {
        isBitmapReleased = true;
        WXImage image = getComponent();
        if (image != null) {
          image.autoReleaseImage();
        }
      }
    }
}

public void autoRecoverImage(){
    if(enableBitmapAutoManage){
      if(isBitmapReleased){
        WXImage image = getComponent();
        if(image != null){
          image.autoRecoverImage();
        }
        isBitmapReleased = false;
      }
    }
}

// WXImage
public void autoReleaseImage(){
    if(mAutoRecycle){
      if(getHostView() != null){
        if (getInstance().getImgLoaderAdapter() != null) {
          getInstance().getImgLoaderAdapter().setImage(null, mHost, null, null);
        }
      }
    }
}

public void autoRecoverImage() {
    if(mAutoRecycle) {
      setSrc(mSrc);
    }
}
```

- Android WXImage组件在可见状态和隐藏状态会自动刷新<br><https://github.com/apache/incubator-weex/issues/2058>

## Weex踩坑指南 之 weex接入websocketAndroid端设置不上监听事件

官方文档上的写法，在weex0.20死活不行。

> js websocket接收callback写法有要求

```javascript
methods: {
  connect:function() {
    websocket.WebSocket('wss://echo.websocket.org','');
    var self = this;
    self.onopeninfo = 'connecting...'
    websocket.onopen = function(e)
    {
      self.onopeninfo = 'websocket open';
    }
    websocket.onmessage = function(e)
    {
      self.onmessage = e.data;
    }
    websocket.onerror = function(e)
    {
      self.onerrorinfo = e.data;
    }
    websocket.onclose = function(e)
    {
      self.onopeninfo = '';
      self.oncloseinfo = 'closed';
      self.onerrorinfo = e.code;
    }
  },
  send:function(e) {
    var input = this.$refs.input;
    input.blur();
    websocket.send(this.txtInput);
    this.sendinfo = this.txtInput;
  },
  oninput: function(event) {
    this.txtInput = event.value;
  },
  close:function(e) {
    websocket.close();
  },
},
```

websocket.onmessage在Android端没有注册jscallback成功，需要换一种写法，应该是weex0.20版本的bug，用下面这种写法就可以：

```
websocket.onmessage(
    function onmessage(e){ 
      self.onmessage = e.data;
      modal.toast({
        message: e.data,
        duration: 0.5
      })
    }
  );
```

- Weex踩坑指南 之 weex接入websocketAndroid端设置不上监听事件<br><https://blog.csdn.net/qq_21460229/article/details/82861582>

## 通过npm安装weex出现 npm ERR! Error  EACCES permission denied  access

```
1073 warn checkPermissions Missing write access to /usr/local/lib/node_modules
1074 timing stage:rollbackFailedOptional Completed in 1ms
1075 timing stage:runTopLevelLifecycles Completed in 1367ms
1076 verbose stack Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
1077 verbose cwd /Users/hacket
1078 verbose Darwin 17.5.0
1079 verbose argv "/usr/local/bin/node" "/usr/local/bin/npm" "install" "-g" "weex-toolkit@beta"
1080 verbose node v11.11.0
1081 verbose npm  v6.7.0
1082 error path /usr/local/lib/node_modules
1083 error code EACCES
1084 error errno -13
1085 error syscall access
1086 error Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
1086 error  { [Error: EACCES: permission denied, access '/usr/local/lib/node_modules']
1086 error   stack:
1086 error    "Error: EACCES: permission denied, access '/usr/local/lib/node_modules'",
1086 error   errno: -13,
1086 error   code: 'EACCES',
1086 error   syscall: 'access',
1086 error   path: '/usr/local/lib/node_modules' }
1087 error The operation was rejected by your operating system.
1087 error It is likely you do not have the permissions to access this file as the current user
1087 error
1087 error If you believe this might be a permissions issue, please double-check the
1087 error permissions of the file and its containing directories, or try running
1087 error the command again as root/Administrator (though this is not recommended).
1088 verbose exit [ -13, true ]
```

解决：

```
sudo npm install -g weex-toolkit@beta
```

# Weex开源库

## awesome-weex

<https://github.com/joggerplus/awesome-weex>

## Weex-OkHttp-Adapter

<https://github.com/zjutkz/Weex-OkHttp-Adapter>

> 基于OkHttp的Weex Http Adapter

## eros

- <https://bmfe.github.io/eros-docs/#/?id=eros>

> Weex二次封装，对前端友好

<https://github.com/bmfe/eros>

## weex-ui

<https://github.com/alibaba/weex-ui>

> 一个基于 Weex 的富交互、轻量级、高性能的 UI 组件库

# Ref

- 企鹅电竞weex实践——UI开发篇<br><https://juejin.im/post/5bed1477e51d456c57127b30#heading-9>
- 跨越适配&性能那道坎，企鹅电竞Android weex优化<br><https://www.cnblogs.com/wetest/p/10324926.html>
- weex常见问题解析<br><https://juejin.im/post/5cad577c5188251ad27d6c06>
