---
date created: 2024-06-24 16:28
tags:
  - '#Intent;'
date updated: 2024-12-24 00:35
dg-publish: true
---

# 唤端技术背景

在日常开发中，往往需要通过唤端改善用户体验。比如一个常见的场景：用户通过链接分享或其他途径，在端外访问 H5 活动页面，与页面发生交互后，需要实现以下功能：

- 功能 A：对于已安装 APP，唤起 APP，并跳转到对应的活动页
- 功能 B：对于未安装 APP，唤起的应用商店（APP 主页）
- 功能 C：基于功能 B，在下载安装完成，打开 APP 后，跳转到对应的活动页

功能A和B可通过DeepLink或AppLink实现；功能C可通过Deferred DeepLink实现。<br>**有了这项技术我们就可以实现H5唤起APP应用、Facebook App的广告到自己的App了，现阶段的引流方式大都得益于这种技术，比如广告投放、用户拉新等**<br>目前主要有这几种技术：

1. Deeplink用于APP间的跳转，如果是浏览器，可能会有二次弹窗确认；如果有多个组件能处理该deeplink，都会弹窗列举出来供你选择
2. `Applinks`(Universal Link)用于消除Deeplink的二次弹窗选择，直接到达你的APP
3. `Defered DeepLink`延迟的deeplink，首次安装会去拉一个接口返回一些安装来源信息或deeplink；一般用于首次安装确认来源的，`如Google install referer`,`Facebook ad defered deeplink`，`google ad deferer deeplink`, `appsflyer deferer deeplink`

# Deeplink

## URL Scheme，多一次二次弹窗选择

平时说的 Deeplink，在 Android 上就是 URL Scheme。

### 添加Intent-Filter

1. 定义URI Scheme

```xml
<activity
  android:name=".ui.activity.SplashActivity"
  android:exported="true"
  android:screenOrientation="portrait"
  android:theme="@style/NormalSplash">

  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>

  <!--DeepLink h5唤醒app配置-->
  <intent-filter>
    <!--ACTION_VIEW：支持被检索-->
    <action android:name="android.intent.action.VIEW" />
    <!--CATEGORY_DEFAULT：响应隐式Intent-->
    <category android:name="android.intent.category.DEFAULT" />
    <!--CATEGORY_BROWSABLE：可被Web浏览器唤起-->
    <category android:name="android.intent.category.BROWSABLE" />
    <!--data：一个或多个，必须含有scheme标签，决定被唤起的URL格式-->
    <data
      android:host="me.hacket"
      android:scheme="hacket" />
    <!--    
    <data
    android:host="me.hacket"
    android:scheme="hacket" 
    android:pathPrefix="/pxwx"/>
    <data
    android:host="me.hacket"
    android:scheme="hacket" 
    android:path="/pxwx/user"/>
    -->
  </intent-filter>
</activity>
```

- App可以配置多个支持唤起的Activity
- Activity可以支持被多个URL唤起
- 若一个App配置了多个支持唤起的Activity，它们的scheme和host一般一致，然后通过path、pathPrefix等进行定向区分

2. Uri数据的解析可以在你的SlashActivity中通过getIntent().getData()实现

```java
@Override 
public void onCreate(Bundle savesInstanceState){
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_splash);
    
    // 尝试获取WebApp页面上过来的URL
    Uri uri = getIntent().getData();
    if (uri != null) {
        // scheme部分
        String scheme=data.getScheme();
        // host部分
        String host=data.getHost();
        // 访问路径
        String path=data.getPath();
        //参数
        Set<String> paramKeySet=data.getQueryParameterNames();
    }
}
```

3. 在h5页面上，通过如下方式使用：

```html
<!--1.通过a标签打开，点击标签是启动-->
<!-- 注意这里的href格式 -- >
<a href="hacket://app.me.hacket">open android app</a>

<!--2.通过iframe打开，设置iframe.src即会启动-->
<iframe src="hacket://me.hacket"></iframe>

<!--3.直接通过window.location 进行跳转-->
window.location.href= "hacket://me.hacket";
```

4. 在原生App中唤起通过Intent方式

```java
Intent intent = new Intent();
intent.setData(Uri.parse("hacket://me.hacket/"));
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);
```

5. 用户点击了链接后，会弹出一个列举了能处理该链接的Dialog供用户选择（所有能处理该链接的APP）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684758720600-94406a17-ff26-49fb-8692-545fcf167d50.png#averageHue=%23787372&clientId=u099551e9-a7d7-4&from=paste&height=309&id=uec1cc85d&originHeight=1010&originWidth=500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=240868&status=done&style=shadow&taskId=u248cbfdb-eb17-4000-8c2a-ae23bc34d4e&title=&width=153)

### 测试URL Scheme

#### adb命令

> adb shell am start -W -a android.intent.action.VIEW -d "yourdeeplink://example.com/path?id=123"

如：adb shell am start -W -a android.intent.action.VIEW -d "hacket://hacket.me?name=大圣"

#### 代码验证

data为你的测试链接

```java
Intent intent = new Intent();
intent.setData(Uri.parse("hacket://me.hacket/"));
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);
```

#### html

放APP本地或放到web容器(如tomcat)去

```html
<a href='sheinlink://applink/ad_landing_recommend?data={"tsp_id":"60007289","goods_id":"2329783","page_type":"B","mall_code":1}'>B类型：sheinlink://applink/ad_landing_recommend?data={"tsp_id":"60007289","goods_id":"2329783","page_type":"B","mall_code":1}</a>
```

#### 三方APP

如`Via`浏览器，或者添加一个function，添加`.zshrc/.bach_profile`文件中，模拟操作

```shell
#### 启动via app mark.via.gp/mark.via.Shell，然后输入文本，最后按回车键
#### 可用来测试deeplink跳转
function adb:via() {
  echo "stop Via app."
  adb shell am force-stop mark.via.gp
  
  echo "start Via app."
  adb shell am start -n mark.via.gp/mark.via.Shell
  
  sleep 2
  echo "input tap 500 1033"
  # 模拟按2次tab键盘到tab，才能定位到EditText，好像经常找不到焦点
  # adb shell input keyevent KEYCODE_TAB
  # adb shell input keyevent KEYCODE_TAB
  adb shell input tap 500 1033 

  echo "input text $1"
  adb shell input text "$1"

  echo "send keyevent KEYCODE_ENTER"
  adb shell input keyevent KEYCODE_ENTER
}
```

> 可以根据不同的手机将坐标替换下

### URL Scheme兼容性

URL Scheme兼容性高，但却存在许多限制：

- 国内各个厂商浏览器差异很大，当要被唤醒的目标App未安装时，这个链接很容易出错。
- 当注册有多个Scheme相同的时候，目前是没有办法区分的。
- 不支持从其他App中的WebView中跳转到目标App。
- 被部分主流平台禁止，微信、微博、QQ浏览器、手机百度中都已经被禁止使用。

#### 三方APP唤端的限制

在部分 APP 内部去唤起第三方 APP，第一方 APP 出于防止流量流失、安全性等考虑，对上述Deeplink进行了限制，无法直接使用。因此往往是通过第一方 APP 提供的 API 进行唤端，比如微信的 launchApplication、wx-open-launch-app等。其它 APP 的 API 形式唤端亦是如此

## [Web links(scheme是http(s)的Deep Link)](https://developer.android.google.cn/training/app-links#web-links)

Web links are deep links that use the HTTP and HTTPS schemes.

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />

  <data android:scheme="http" />
  <data android:host="myownpersonaldomain.com" />
</intent-filter>
```

1. Android12或以上，点击web links会跳转到浏览器
2. Android12之前，如果手机上的APP能处理该web links，就会像deep links一样弹窗来让用户选择

## [Chrome Intent](https://developer.chrome.com/docs/multidevice/android/intents/)

URL Scheme存在一个问题就是如果没有APP能处理该链接，点击无响应或跳转到一个错误界面；Chrome Intent就可以在链接无法处理时跳转到一个指定的链接

### Chrome Intent介绍

- Chrome Intent 是 Android 设备上 Chrome 浏览器中 URI 方案的深层链接替代品。
- 如果 APP 已安装，则通过配置的 URI SCHEME 打开 APP。
- 如果 APP 未安装，配置了 fallback url 的跳转 fallback url，没有配置的则跳转应用市场。

### [Chrome Intent语法](https://developer.chrome.com/docs/multidevice/android/intents/#syntax)

```xml
intent:  
   HOST/URI-path // Optional host  
   #Intent;  
      package=\[string\];  
      action=\[string\];  
      category=\[string\];  
      component=\[string\];  
      scheme=\[string\];  
   end;
```

示例：sheinlink://applink/sheinGals<br>不带browser_fallback_url：

```html
<a href="intent://applink/sheinGals/#Intent;scheme=sheinlink;package=com.zzkko;end">open Shein App sheinGals</a>
```

> 在Android Chrome 115版本，不带browser_fallback_url，会跳转到Google Play

带browser_fallback_url：

```html
<a href="intent://applink/sheinGals/#Intent;scheme=sheinlink;package=com.zzkko;S.browser_fallback_url=https://www.shein.com;end">open Shein App sheinGals page fallback</a>
```

这样如果没有对应应用，该链接就会跳转到S.browser_fallback_url指定的url上。

### Chrome Intent兼容性

- Google通过chrome浏览器启动的优化方案
- 很多第三方浏览器会拦截掉Chrome Intent启动应用的请求

## 项目中的deeplink/slink

### deeplink/slink定义

deeplink: `sheinlink://applink/{跳转类型}?data={参数字典的字符串并进行urlencode}`

> example:
> sheinlink://applink/selectcategory?data=%7b%27category_id%27%3a%27123%27%2c%27attr_ids%27%3a%27101_725-238_102%27%7d

slink: `[<schema>://<host>]/<group>/<name>[?need_login=true&data=url_encode({json})]`

> example：
> sheinlink://shein.com/goods/flash_sale_list?data={"id":123, "key":456}
> romwelink://romwe.com/goods/flash_sale_list?data={"id":123, "key":456}

- [ ] [deeplink定义](https://wiki.dotfashion.cn/pages/viewpage.action?pageId=19759201)
- [ ] [Shein&&Romwe 营销规则中的Deeplink类型](https://wiki.dotfashion.cn/pages/viewpage.action?pageId=1178844804)
- [ ] [URL协议规范 - Slink](https://wiki.dotfashion.cn/pages/viewpage.action?pageId=654150717)

### onelink

##### 什么是onelink？

简单一句话就是从一条短链通过接口转换成deeplink

- [ ] [营销OneLink](https://wiki.dotfashion.cn/pages/viewpage.action?pageId=691931843)

### 注意

#### slink需要加白名单

slink需要加白名单，否则只能跳转到首页

- app内置在: basic库assets/route_rule.json中
- 接口setting/system，接口的会覆盖app内置的白名单

#### deeplink编码及带data问题

1. onelink(会通过接口返回deeplink)/deeplink跳转的: 只支持1次url encode的，不支持2次url encode的
2. Google play install referer/facebook google ddl带utm_shein_onelink的这种：Android端会在调用link/onelink/uniParser接口后做1次url decode<br>a. 如果返回的deeplink没有&字符，支持后端1次或2次encode的，因为多次url decode也可以<br>b. 如果返回的deeplink有&字符，后端只能2次url encode，如果只进行1次url encode，APP url decode 1次后，再进去获取data后的参数获取不到

#### onelink跳转不到目标页

##### 点击onelink链接，没打开app，跳转到了pwa

onelink的域名是applink

##### 点击onelink链接，打开了app，未打开目标页

## 方案对比

|            | **URL Scheme** | **Universal Link** | **App Link** |
| ---------- | -------------- | ------------------ | ------------ |
| <ios9      | 支持             | 不支持                | 不支持          |
| >=ios9     | 支持             | 支持                 | 不支持          |
| <android6  | 支持             | 不支持                | 不支持          |
| >=android6 | 支持             | 不支持                | 支持           |
| 是否需要HTTPS  | 不需要            | 需要                 | 需要           |
| 是否需要客户端    | 需要             | 需要                 | 需要           |
| 无对应APP时的现象 | 报错/无反应         | 跳到对应的页面            | 跳到对应的页面      |

### URI Scheme

- URI Scheme的兼容性是最高，但使用体验相对较差（需要二次弹窗确认，多个需要选择）
- 当要被唤起的APP没有安装时，这个链接就会出错，页面无反应。
- 当注册有多个scheme相同的时候，没有办法区分。
- 国内三方APP会限制跳转

### Universal Link

- 已经安装APP，直接唤起APP；APP没有安装，就会跳去对应的web link。
- universal Link 是从服务器上查询是哪个APP需要被打开，所以不会存在冲突问题
- universal Link 支持从其他app中的UIWebView中跳转到目标app
- 缺点在于会记住用户的选择：在用户点击了Universal link之后，iOS会去检测用户最近一次是选择了直接打开app还是打开网站。一旦用户点击了这个选项，他就会通过Safiri打开你的网站。并且在之后的操作中，默认一直延续这个选择，除非用户从你的webpage上通过点击Smart App Banner上的OPEN按钮来打开。

### AppLinks

- 优点与 Universal Link 类似
- 缺点在于国内的支持相对较差，在有的浏览器或者手机ROM中并不能链接至APP，而是在浏览器中打开了对应的链接。
- 在询问是否用APP打开对应的链接时，如果选择了“取消”并且“记住选择”被勾上，那么下次你再次想链接至APP时就不会有任何反应

## Ref

- [x] [Handling Android App Links](https://developer.android.google.cn/training/app-links)
- [x] [Facebook 推出 App Links 开发者工具意在解决什么问题？ - 欧阳辰的回答 - 知乎  移动DeepLink的前生今世](https://www.zhihu.com/question/23609812/answer/100450965)

> 对deeplink applink的发展讲的很清晰

- [x] [App深度链接与延迟深度链接](https://www.biaodianfu.com/deep-link-deferred-deeplink.html)
