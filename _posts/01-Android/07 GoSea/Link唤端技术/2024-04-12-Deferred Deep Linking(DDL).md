---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, January 22nd 2025, 12:46:40 am
title: Deferred Deep Linking(DDL)
author: hacket
categories:
  - Android进阶
category: 出海
tags: [出海, DDL, LInk]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-04-08 13:51
date updated: 2024-12-24 00:35
aliases: [Deferred Deep Linking 介绍]
linter-yaml-title-alias: Deferred Deep Linking 介绍
---

# Deferred Deep Linking 介绍

Deferred Deep Linking 介绍，延迟深度链接 (解决未安装 APP)<br>相比 DeepLink，它增加了判断 APP 是否被安装，用户匹配的 2 个功能；

- 当用户点击链接的时候判断 APP 是否安装，如果用户没有安装时，引导用户跳转到应用商店下载应用。
- 用户匹配功能，当用户点击链接时和用户启动 APP 时，分别将这两次用户 Device Fingerprint（设备指纹信息）传到服务器进行模糊匹配，使用户下载且启动 APP 时，直接打开相应的指定页面。

通过上面的 2 个技术方案，不仅：

- 可以让被分享者更快更便捷的回到 APP，且回到指定的活动页面，而且：
- 可以引导未安装 APP 的用户下载 APP、
- 分享者和被分享者的关系链会通过设备指纹信息记录下来，在业务场景中给出相应的奖励。

Deferred Deeplink 可以先判断用户是否已经安装了 App 应用，如果没有则先引导至 App 应用商店中下载 App，在用户安装 App 后跳转到指定 App 页面 Deeplink 中。<br>![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684763358491-0b76e570-a910-480f-a097-c9e07d5e4a9a.png#averageHue=%23eae6e6&clientId=u099551e9-a7d7-4&from=paste&height=826&id=u0f58a79a&originHeight=960&originWidth=480&originalType=binary&ratio=2&rotation=0&showTitle=false&size=242431&status=done&style=shadow&taskId=ufd0ca628-754e-496a-b894-04f07f76c8e&title=&width=413)<br>Deferred Deeplink 在未安装 App 应用人群定向推广中效果更佳突出。另外国外的 App 运营在社交推广中广泛使用 Deferred Deeplink 技术，比如一个购物 App 中用户分享了一个自己喜欢的产品到社交账户中，如果没有使用 Deferred Deeplink。其好友看到分享，点击下载安装打开 App 应用后，很可能找不到其好友分享的产品，导致较高的用户流失率。

# 三方 Deep Link/App Link/DDL 技术

## `Onelink`

自研 ddl 技术

## Google Play Install Referrer

[[Google Play Install Referrer]]

## Facebook AD Deeplink

### Facebook Deferred Deep Linking（FB DDL）

- [x] [Facebook的deeplink官方文档地址](https://developers.facebook.com/docs/app-ads/deep-linking#step-by-step)

facebook 通过 deferred deeplink 实现获取投放时候 campaign，adset，ad 信息。<br><https://developers.facebook.com/docs/android/deep-linking>

#### 什么是 Deferred Deep Linking

Deferred deep linking allows you to send people to a custom view after they install your app through the app store.<br>DDL 只用于未安装 App 的情况，如果已经安装了，就不需要用 DDL 了

#### Facebook DDL 接入

```kotlin
AppLinkData.fetchDeferredAppLinkData(context, appLinkCallBack)
```

#### 官方工具测试 Facebook DDL

1. [打开这个应用广告帮手页面](https://developers.facebook.com/tools/app-ads-helper/?id=145288758558252)
2. 点击选择应用，选中你的应用，然后确认，再往下滑动网页会看到下面界面：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686308876992-a20d0dec-a65e-4f0b-9926-b483cd87c65d.png#averageHue=%23fefcfc&clientId=u0cf66c93-ec48-4&from=paste&height=184&id=IIuZ2&originHeight=560&originWidth=1512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=144580&status=done&style=shadow&taskId=u9a8db5e8-39ed-4283-887e-4c1ab14fcbe&title=&width=498)

3. 点击测试深度链接按钮，在弹出的窗口中填写相应参数信息，发送测试链接：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686308895937-75a31851-ad58-4787-ac0d-f85be746f0fa.png#averageHue=%23c4c0be&clientId=u0cf66c93-ec48-4&from=paste&height=214&id=W6qNO&originHeight=822&originWidth=1614&originalType=binary&ratio=2&rotation=0&showTitle=false&size=399440&status=done&style=shadow&taskId=u3e87922e-dd94-4eb3-abda-abc2e31b346&title=&width=420)

4. 从手机端点击进入测试效果：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686308999532-b385795d-3e35-452c-92ae-a0f9e8e6d534.png#averageHue=%23dbdcdc&clientId=u0cf66c93-ec48-4&from=paste&height=129&id=oPmfS&originHeight=258&originWidth=886&originalType=binary&ratio=2&rotation=0&showTitle=false&size=154256&status=done&style=shadow&taskId=ub602beb9-8f71-45f2-8a87-47eb17eee08&title=&width=443)

5. 为安装后接收深度链接，你的应用需要在启动时调用 Facebook SDK 方式中的

```kotlin
// 模拟Facebook DDL https://developers.facebook.com/tools/app-ads-helper/?id=145288758558252
AppLinkData.fetchDeferredAppLinkData(this) {
    // Process app link data
    Log.d(TAG, "onDeferredAppLinkDataFetched ${it.string()}")
}
```

#### 测试阶段测试 Facebook

##### 测试方法

1. 在 facebook app 中分享链接并打开<https://fb.me/2Oz4dhMesRwhy6R>，然后会提示开启动态广告，开启后，打开 facebook app，跳转到个人中的动态，等待广告数据加载出来
2. 预览到广告之后，先不点击链接下载，先卸载本机已有 shein app
3. 然后点击链接下载，跳转到 Google paly 商店
4. 再安装调试的 APP，就能获取到 facebook ddl 信息了
5. 启动 app 时，抓包看接口 `graph.facebook.com/xxx/appid/activities`：

有 `applink_url` 的才算有数据<br>![企业微信截图_16999552824987.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699955308832-2d3d3307-f5e3-433c-8a80-0dccc5efa63e.png#averageHue=%23f7f7f6&clientId=ub0c8f99a-6196-4&from=paste&height=503&id=hk0iH&originHeight=1006&originWidth=1920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=676998&status=done&style=shadow&taskId=u66772395-e4fc-4870-89db-c9e52c17f0e&title=&width=960)

##### 测试的链接

1. shein 新客 onelink

<https://fb.me/bfS9ofDGL0kZdR>

2. shein 老客 deeplink

<https://fb.me/2Oz4dhMesRwhy6R>

3. romwe deeplink

<https://fb.me/1EYdPIavwb85PsD>

4. romwe onelink

<https://fb.me/1MNRW42z8QoGGum>

返回下面这个就是失败的<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699955049965-c527d44c-52f6-48bc-b817-5eb7d9ff3e81.png#averageHue=%23e0e0e0&clientId=ub0c8f99a-6196-4&from=paste&height=393&id=ud1bb446a&originHeight=786&originWidth=2380&originalType=binary&ratio=2&rotation=0&showTitle=false&size=349753&status=done&style=shadow&taskId=u2b6bdce6-1c36-4e4c-9862-2d6328299dd&title=&width=1190)

### [Facebook applinks](https://developers.facebook.com/docs/applinks)

#### Facebook App links 原理

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686309296488-b17eeb88-1caa-483f-9a5c-0a19c34a30c0.png#averageHue=%23fbf9f8&clientId=u0cf66c93-ec48-4&from=paste&height=303&id=nPpQt&originHeight=846&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=229606&status=done&style=shadow&taskId=u9d2ebba9-609c-4a61-8e22-81701d9435d&title=&width=537)

#### 实现了 App Links protocol 的库

- [Bolts for Android](https://github.com/BoltsFramework/Bolts-Android?fbclid=IwAR378rxruDr6HCxzOIjCEcQ6ExvMknA_3LdjAMl_1hZGxCBbj-gXiBcUWt0) - Open-source reference implementation for Android apps

## Google AD DDL (Deferred Deep Link)

Google 广告的延迟 deep link

### [Google DDL Enable deferred deep linking in your measurement SDK](https://support.google.com/google-ads/answer/12373942?hl=en#zippy=%2Csteps-to-activate-ddl-in-the-gaf-sdk)

Google DDL 的接入和测试官方文档

1. [引入 firebase-analytics](Configure your app to use Google Analytics for Firebase)

```groovy
dependencies {
    // ...
    implementation 'com.google.firebase:firebase-analytics:21.0.0'
    // ...
}
```

2. 开启 google ddl 支持

```xml
<!-- Value to be added to enable deferred deep links -->
<meta-data android:name="google_analytics_deferred_deep_link_enabled" android:value="true"/>
```

3. 配置好了，GA4F 会在 App 启动的时候拉取配置

在 APP 首次启动的时候会请求接口：<https://www.googleadservices.com/pagead/conversion/app/deeplink?id_type=adid&sdk_version=v79009.232216&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&bundleid=com.zzkko&retry=0&ddl_test=1><br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686994042352-328f5ef4-0e84-4ef7-86b2-751166f771ba.png#averageHue=%23f1f0ef&clientId=uf5df239a-88ad-4&from=paste&height=180&id=yU2tK&originHeight=620&originWidth=1164&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89983&status=done&style=none&taskId=ufdef8d3e-149d-471d-8a01-710e24b3e39&title=&width=337)

### Google DDL 获取配置代码

官方监听 SP：

```java
/**
* The main launch activity of the app.
*/
public class MainActivity extends AppCompatActivity {

    private SharedPreferences preferences;
    private SharedPreferences.OnSharedPreferenceChangeListener deepLinkListener;

    @Override
    protected void onStart() {
        super.onStart();
        preferences.registerOnSharedPreferenceChangeListener(deepLinkListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        preferences.unregisterOnSharedPreferenceChangeListener(deepLinkListener);
        deepLinkListener = null;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        preferences =
        getSharedPreferences("google.analytics.deferred.deeplink.prefs", MODE_PRIVATE);

        deepLinkListener = (sharedPreferences, key) -> {
            Log.d("DEEPLINK_LISTENER", "Deep link changed");
            if ("deeplink".equals(key)) {
                String deeplink = sharedPreferences.getString(key, null);
                Double cTime = Double.longBitsToDouble(sharedPreferences.getLong("timestamp", 0));
                Log.d("DEEPLINK_LISTENER", "Deep link retrieved: " + deeplink);
                showDeepLinkResult(deeplink);
            }
        };
    }

    public void showDeepLinkResult(String result) {
        String toastText = result;
        if (toastText == null) {
            toastText = "The deep link retrieval failed";
        } else if (toastText.isEmpty()) {
            toastText = "Deep link empty";
        }
        Toast.makeText(MainActivity.this, toastText, Toast.LENGTH_LONG).show();
        Log.d("DEEPLINK", toastText);
    }
}
```

注意：获取到的时间是微秒，需要用 [Double.longBitsToDouble(...)](https://developer.android.com/reference/java/lang/Double#longBitsToDouble(long)) 来转换<br>官方的是监听 SP 的变化，我们也可以用 RX 每 100ml 轮询 sp 的值

```kotlin
fun requestGoogleDDLObservable(
    timeout: Long = Long.MAX_VALUE
): Observable<DDLInfo> {
    val s1 = SystemClock.elapsedRealtime()
    val sp = AppContext.application.getSharedPreferences(
            "google.analytics.deferred.deeplink.prefs",
            Context.MODE_PRIVATE
    )
    return Observable
            .interval(100L, TimeUnit.MILLISECONDS, Schedulers.io())
//                     .doOnNext { Logger.d(TAG, "AppOneLinker->requestGoogleDDLObservable doOnNext $it.${Thread.currentThread().name}") }
            .map {
                val deeplink: String = sp.getString("deeplink", "") ?: ""
                val timestamp =
                    java.lang.Double.longBitsToDouble(sp.getLong("timestamp", 0L))
                        .toSafeLong()
                DDLInfo(deeplink, timestamp, cost = SystemClock.elapsedRealtime() - s1)
            }
            .takeUntil { ddlInfo ->
//                         Logger.d(TAG, "AppOneLinker->requestGoogleDDLObservable takeUntil ddlInfo=$ddlInfo.${Thread.currentThread().name}")
                ddlInfo.isValid()
            }
            .filter { ddlInfo ->
//                         Logger.d(TAG, "AppOneLinker->requestGoogleDDLObservable filter ddlInfo=$ddlInfo.(${Thread.currentThread().name})")
                ddlInfo.isValid()
            }
            .timeout(timeout, TimeUnit.MILLISECONDS)
            .onErrorResumeNext { throwable: Throwable ->
                if (throwable is TimeoutException) {
                    Observable.just(DDLInfo.timeoutDDLInfo())
                } else {
                    Observable.just(
                        DDLInfo.errorDDLInfo(
                            throwable.message ?: ""
                        )
                    )
            	}
        	}
}
fun Any?.toSafeLong(): Long {
    var value = 0L
    try {
        value = when (this) {
            is Int -> this.toLong()
            is String -> {
                if (isEmpty()) {
                    0L
                } else {
                    java.lang.Long.valueOf(this)
                }
            }
            is Double -> this.toLong()
            is Long -> this
            else -> 0L
        }
    } catch (e: Exception) {
        Logger.printException(e)
    } finally {
        return value
    }
}
```

### Google DDL 模拟测试

#### Shein Google DDL 测试

1. 设置你的设备应该接收到的 DDL，24h 有效（修改 rdid 为 google ad id，bundleid 为 applicationId，deeplink 为要带的数据）gaid(google ad id) 在不同 APP 的值是一样的

```shell
 curl "www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=<<your device adid>>&id_type=adid&bundleid=<<your application package>>&deeplink=<<deeplink you want to receive>>&ddl_test=1"
```

> 示例：
> curl "[www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.zzkko&deeplink=sheinlink://applink/sheinGals�&ddl_test=1](http://www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.zzkko&deeplink=sheinlink://applink/sheinGals�&ddl_test=1)"

2. 验证 deeplink 设置的对不对，你从 Google 获取的 deeplink 对不对

> curl "[www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.zzkko&ddl_test=1](http://www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.zzkko&ddl_test=1)"

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687183031177-4c0d1985-7228-4c07-8edc-277bed169522.png#averageHue=%23172e38&clientId=ub07af543-ad80-4&from=paste&height=66&id=Qtcpt&originHeight=132&originWidth=1134&originalType=binary&ratio=2&rotation=0&showTitle=false&size=79926&status=done&style=shadow&taskId=ufbdd347d-c3f2-4c94-b8cd-91e783a8ca0&title=&width=567)

3. 为你的应用开启 ddl 的 test mode

> adb shell setprop debug.deferred.deeplink com.zzkko

4. 你的设备开启 test mode: 在 Android 设备上启用 Analytics 调试模式

> adb shell setprop debug.firebase.analytics.app com.zzkko
> // 调试模式将保持启用状态，直至您通过执行以下命令明确将其停用
> adb shell setprop debug.firebase.analytics.app .none.

#### Romwe Google DDL 模拟测试

1. 生成可测试的 ddl

> curl "[www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.romwe&deeplink=romwelink://applink/category/751&ddl_test=1](http://www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.romwe&deeplink=romwelink://applink/category/751&ddl_test=1)"

2. 测试生成的 ddl

> curl "[www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.romwe&ddl_test=1](http://www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=d6f32803-fecd-4226-b7a7-18fffbcfd52a&id_type=adid&bundleid=com.romwe&ddl_test=1)"

3. 为你的应用开启 ddl 的 test mode

> adb shell setprop debug.deferred.deeplink com.romwe

#### Google DDL 测试完整的 shell 脚本

```shell
## 模拟测试google ddl流程：shein
function adb:gooddl:shein() {
    rdid=c6f320e6-4aec-4245-8a69-52296591f9b8
    applicationId=$MAIN_APP_ID
    deeplink=sheinlink://applink/cart
    find_apk_regex=$1
    APK_BUILD_PATH=$WORKSPACE_MAIN/shein_android/shein/build/outputs/apk
    adb:gooddl $rdid $applicationId $deeplink $APK_BUILD_PATH $find_apk_regex
    
}
function adb:gooddl:romwe() {
    # rdid为google ad id
    rdid=c6f320e6-4aec-4245-8a69-52296591f9b8
    applicationId=$SECOND_APP_ID
    deeplink=sheinlink://applink/cart
    find_apk_regex=$1
    APK_BUILD_PATH=$WORKSPACE_MAIN/shein_android/shein/build/outputs/apk
    adb:gooddl $rdid $applicationId $deeplink $APK_BUILD_PATH $find_apk_regex
    
}
function adb:gooddl() {
    echo 'Google DDL模拟测试, 参数：' $@
    rdid=$1
    if [[ -z "${rdid}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的rdid(Google Ad Id)： \033[0m"
      return 0
    fi
    applicationId=$2
    if [[ -z "${applicationId}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的applicationId： \033[0m"
      return 0
    fi
    deeplink=$3
    if [[ -z "${deeplink}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的deeplink： \033[0m"
      return 0
    fi
    apk_build_path=$4
    if [[ -z "${apk_build_path}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的apk_build_path： \033[0m"
      return 0
    else 
      # 这里的-d参数判断目录是否存在
      if [ ! -d "${apk_build_path}" ]; then
        echo -e "\033[31mFATAL: $apk_build_path 目录不存在 \033[0m"
        return 0
      fi
    fi
    find_regex=$5

    # 去掉代理
    echo '0. 清除手机Charles等抓包代理'
    proxy:off

    echo "1. 设置你的设备应该接收到的Google DDL，24h有效"
    curl "www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=$rdid&id_type=adid&bundleid=$applicationId&deeplink=$deeplink&ddl_test=1"
    
    echo "2. 验证deeplink设置的对不对，获取你将从Google DDL获取的deeplink"
    curl "www.googleadservices.com/pagead/conversion/app/deeplink?&rdid=$rdid&id_type=adid&bundleid=$applicationId&ddl_test=1"
    
    echo "3-1. 为你的应用开启Google DDL的test mode"
    adb shell setprop debug.deferred.deeplink $applicationId

    echo "3-2. 在 Android 设备上启用 Analytics 调试模式"
    adb shell setprop debug.firebase.analytics.app $applicationId
    
    echo '4. cd ' $apk_build_path
    cd $apk_build_path > /dev/null
    
    if [[ -z "${find_regex}" ]] ; then 
      final_apk_path=$(find $apk_build_path -name  "*.apk")
    else
      final_apk_path=$(find $apk_build_path -name  "*${find_regex}*.apk")
    fi
    echo "4. find apk: [$final_apk_path]"

    # 卸载App
    echo "5. 卸载$applicationId"
    adb uninstall $applicationId > /dev/null


    echo "6. 安装测试包：$final_apk_path"
    # 安装要测试的App
    adb install -r -t "$final_apk_path"

    echo "7. 开启手机Charles抓包代理"
    # 开启代理
    proxy:on

    echo "8. 重新打开 $applicationId，开始测试Google DDL吧"
    echo "  |-- 即将启动shein"
    if [ "$applicationId" = "$MAIN_APP_ID" ]; then
      adb shell am start -n $MAIN_APP_SPLASH
    elif [ "$applicationId" = "$SECOND_APP_ID" ]; then
      adb shell am start -n $SECOND_APP_SPLASH
    fi

    echo "9. 在APP首次启动的时候会请求接口：https://www.googleadservices.com/pagead/conversion/app/deeplink?id_type=adid&sdk_version=v79009.232216&rdid=$rdid&bundleid=$applicationId&retry=0&ddl_test=1"
    sleep 5
    curl "https://www.googleadservices.com/pagead/conversion/app/deeplink?id_type=adid&sdk_version=v79009.232216&rdid=$rdid&bundleid=$applicationId&retry=0&ddl_test=1"
}
```

## Tiktok Deferred Deeplinks

## 其他

### [Appsflyer-onelink](https://support.appsflyer.com/hc/zh-cn/sections/6551203111057)

### Branch

### Google Play Installer Referer

见上面的 `Google Play Installer Referer`

### [openinstall](https://www.openinstall.io/)

- app 跳转 deeplink
- app 免邀请码安装（Deferred deeplink）
