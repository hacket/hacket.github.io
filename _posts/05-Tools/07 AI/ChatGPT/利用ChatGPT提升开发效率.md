---
date created: 2024-12-23 23:41
date updated: 2024-12-23 23:41
dg-publish: true
---

## 在Android中的实践

### 理解一段代码的意思（需注意代码泄密）

案例，将下面的代码喂给ChatGPT

```groovy
class Config {
    // 注意key定义的时候前后不要有空格
    // 基本配置信息config
    static compileSdkVersion = 31
    static applicationId = "me.hacket.assistant"
    static minSdkVersion = 18
    static targetSdkVersion = 31
    static versionCode = 1
    static versionName = "1.0"
    static appName = "大圣组手"
    static boolean prop(Project project, String name) {
        return !Boolean.parseBoolean(project.properties[name.toLowerCase()])
    }
    static class Maven {
        static groupId = "me.hacket"
    }
    static moduleVersion = [
            netcore  : "1.0.0",
            libcommon: "1.0.6",
            libwidget: "1.0.6",
            core     : "1.0.6"
    ]
    static dependVersion = [
            kotlin_version            : "1.3.41",
            lifecycle_version         : "2.4.1",
            room_version              : "2.4.2", // 支持增量处理器的起始版本 2.3.0-alpha02
            fresco_version            : "2.2.0",
            rxbinding_version         : "3.0.0",
            androidx_core_version     : "1.2.0",
            androidx_compat_version   : "1.1.0",
            androidx_legacy_version   : "1.0.0",
            androidx_fragment         : "1.2.2",
            recyclerview_version      : "1.0.0",
            constraintlayout_version  : "1.1.3",
            multidex_version          : "2.0.1",
            supportLibraryRevision    : "28.0.0",
            "facebook_flipper_version": "0.183.0",
    ]
    static def nav_version = "2.4.1"
    static def paging_version = "3.1.1"
    static def work_version = "2.7.1"
    static def lifecycle_version = "2.4.1"
    static def arch_version = "2.1.0"
    static def compose_version = "1.0.5"
    static def okhttp_version = "4.8.1"
    static core = [
            "okhttp3"                      : "com.squareup.okhttp3:okhttp:${okhttp_version}",
            "okhttp3-urlconnection"        : "com.squareup.okhttp3:okhttp-urlconnection:${okhttp_version}",
            "okhttp3-interceptor"          : "com.squareup.okhttp3:logging-interceptor:${okhttp_version}",
            "okhttputils"                  : 'com.zhy:okhttputils:2.6.2',

            "glide"                        : 'com.github.bumptech.glide:glide:4.9.0',
//            "glide-compiler"               : 'com.github.bumptech.glide:compiler:4.9.0',
//            4.x版本不需要了
//            "glide-volley-integration"     : 'com.github.bumptech.glide:volley-integration:1.4.0@aar',
            "glide-webpdecoder"            : "com.zlc.glide:webpdecoder:1.4.4.9.0",

            "retrofit"                     : 'com.squareup.retrofit2:retrofit:2.6.1',
            "retrofit-gson"                : 'com.squareup.retrofit2:converter-gson:2.6.1',
            "retrofit-rxjava"              : 'com.squareup.retrofit2:adapter-rxjava2:2.4.0',

            "logger"                       : 'com.orhanobut:logger:2.1.1',

            "immersionbar"                 : 'com.gyf.immersionbar:immersionbar:2.3.3',
            "vap"                          : "io.github.tencent:vap:2.0.28",

            "free_reflection"              : 'me.weishu:free_reflection:3.0.1',

            "eventbus"                     : 'org.greenrobot:eventbus:3.1.1',

            "fresco"                       : "com.facebook.fresco:fresco:${dependVersion.fresco_version}",
            "fresco-animated-base"         : "com.facebook.fresco:animated-base:${dependVersion.fresco_version}",
            "fresco-gif"                   : "com.facebook.fresco:animated-gif:${dependVersion.fresco_version}",
            "fresco-webpsupport"           : "com.facebook.fresco:webpsupport:${dependVersion.fresco_version}",
            "fresco-animated-webp"         : "com.facebook.fresco:animated-webp:${dependVersion.fresco_version}",
            "fresco-imagepipeline-okhttp3" : "com.facebook.fresco:imagepipeline-okhttp3:${dependVersion.fresco_version}",

            "BaseRecyclerViewAdapterHelper": 'com.github.CymChad:BaseRecyclerViewAdapterHelper:3.0.1',

            "wechat"                       : 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.7.0',

            "statusbarutil"                : 'com.jaeger.statusbarutil:library:1.5.1',

            // core
            "okdownload"                   : "com.liulishuo.okdownload:okdownload:1.0.7",
            // provide sqlite to store breakpoints
            "okdownload-sqlite"            : "com.liulishuo.okdownload:sqlite:1.0.7",
            // provide okhttp to connect to backend
            // and then please import okhttp dependencies by yourself
            "okdownload-okhttp"            : "com.liulishuo.okdownload:okhttp:1.0.7",
            // provide interface for kotlin extension
            "okdownload-ktx"               : "com.liulishuo.okdownload:ktx:1.0.7",
            // provide interface to match filedownloader
            "okdownload-filedownloader"    : "com.liulishuo.okdownload:filedownloader:1.0.7",

            "androidutilcode"              : 'com.blankj:utilcode:1.30.5',

            "arouter"                      : "com.alibaba:arouter-api:1.5.1",
//            "arouter-compiler"             : "com.alibaba:arouter-compiler:1.2.2",
            "fastjson"                     : 'com.alibaba:fastjson:1.2.9',

            "picasso"                      : 'com.squareup.picasso:picasso:2.4.0',

            "mmkv"                         : 'com.tencent:mmkv:1.0.15',
            "mars-xlog"                    : 'com.tencent.mars:mars-xlog:1.0.6',

            "parceler-api"                 : 'org.parceler:parceler-api:1.1.12',
//            "parceler-compiler"            : 'org.parceler:parceler:1.1.12',

            // 类似推测的emoji，内置很多表情
            "emojicon"                     : "io.github.rockerhieu:emojicon:1.4.2",

            "livedatabus"                  : 'com.jeremyliao:live-event-bus-x:1.7.3',

            "msgpack"                      : "org.msgpack:msgpack-core:0.8.22",

            "bolts"                        : 'com.parse.bolts:bolts-tasks:1.4.0',

            "bugly-crashreport"            : "com.tencent.bugly:crashreport:4.1.9",
            "bugly-nativecrashreport"      : "com.tencent.bugly:nativecrashreport:3.9.2",
	]
}
```

现在问ChatGPT：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683598211827-d6b8f103-158c-49dd-832c-45c989f4e0e7.png#averageHue=%23e5e5e8&clientId=uda363e83-283e-4&from=paste&height=218&id=u0fc31207&originHeight=436&originWidth=1644&originalType=binary&ratio=2&rotation=0&showTitle=false&size=191343&status=done&style=none&taskId=ue7f740c8-3e72-4175-bca7-b5c37d69245&title=&width=822)

### 帮我们添加适配Android12 `android:exported="false"`tag

这是待添加的activity配置代码：

```xml
<activity
  android:name=".samples.third.koom.memoryleak.KoomMemoryLeakDemosActivity">
    <meta-data
        android:name="android.app.lib_name"
        android:value="" />
</activity>
<activity
    android:name=".samples.third.ImageLibraries.glide.glide4.Glide4DemoActivity"/>
<activity
    android:name=".samples.third.NetworkLibraries.NetworkLibrariesActivity"/>
<activity
    android:name=".samples.third.RoutersLibraries.RouterDemosActivity"
    />
<activity
    android:name=".samples.third.koom.demo1.KOOMDemo1Activity"
   />
<activity
    android:name=".samples.third.koom.KOOMActivity" />
<activity
    android:name=".samples.third.AndroidAsync.websocket.AndroidAsyncWebsocketActivity" />
```

现在交给ChatGPT帮我们修改<br />我问：能帮我给每个activity标签添加android:exported="true" 吗？然后输出给我<br />ChatGPT3.5答：当一个Activity设置了 android:exported="true" 标记后，它就可以被其他应用程序或组件访问。在这种情况下，系统允许在没有用户交互的情况下启动该Activity。<br />以下是添加了 android:exported="true" 标记后的清单文件代码：

```xml
<activity
  android:name=".samples.third.koom.memoryleak.KoomMemoryLeakDemosActivity"
  android:exported="true">
    <meta-data
        android:name="android.app.lib_name"
        android:value="" />
</activity>
<activity
    android:name=".samples.third.ImageLibraries.glide.glide4.Glide4DemoActivity"
    android:exported="true"/>
<activity
    android:name=".samples.third.NetworkLibraries.NetworkLibrariesActivity"
    android:exported="true"/>
<activity
    android:name=".samples.third.RoutersLibraries.RouterDemosActivity"
    android:exported="true"/>
<activity
    android:name=".samples.third.koom.demo1.KOOMDemo1Activity"
    android:exported="true"/>
<activity
    android:name=".samples.third.koom.KOOMActivity"
    android:exported="true"/>
<activity
    android:name=".samples.third.AndroidAsync.websocket.AndroidAsyncWebsocketActivity"
    android:exported="true"/>

```

以上清单文件的代码已经添加了 android:exported="true" 标记。你可以将这个代码复制到你的清单文件中，然后进行相应的修改和测试。

### 批量改变量名？

# 其他

## 帮我写正则表达式

<https://chat.openai.com/c/1ebb8264-b1bf-4ebe-915a-0794fb3b1e48>
