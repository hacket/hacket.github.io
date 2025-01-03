---
date created: 2024-04-17 16:46
date updated: 2024-12-26 20:00
dg-publish: true
---

# App Links

- [x] [Handling Android App Links](https://developer.android.google.cn/training/app-links)
- [x] [app-link-indexing](https://developer.android.google.cn/studio/write/app-link-indexing)

## 什么是App Links？

App Links 是一种特殊类型的 Deep Links，可以看作是 Deep Links 的升级版本（Android 6.0 引入）。二者主要区别在于：当用户点击 App Links 时将直接跳转到应用内容，而 Deep Links 则会弹出应用选择对话框（如果用户设备上有多个应用可以处理相同的 intent）。举例来说：在电子邮件中点击银行发送的 HTTP 网址，如果是 Deep Link 系统可能会显示一个对话框，询问用户是使用浏览器还是银行自己的应用打开此链接，而 App Link 则直接跳转到应用。

## Android App links介绍

1. Android App Links在Android6.0及以上才能用
2. 用http/https协议，包含`autoVerify`属性，该属性允许你把自己APP作为该links的默认处理者，点击链接就可以直达APP，而不需要像DeepLink有个选择的弹窗来选择哪个应用来处理（解决deeplink二次模糊的弹窗）

## Android App links集成

若要添加对 Android App Links 的支持，请执行以下操作：

1. manifest文件中添加`intent-filters`，需要添加`android:autoVerify="true"`，否则不会通过host的校验，app links会不生效
2. Launcher的Activity添加处理到来的Links
3. 使用 `Digital Asset Links`将应用与网站相关联，配置`assetlinks.json`

### 使用 AS 自带App Links Assistant 工具添加 App links 支持

- [Add Android App Links  |  Android Studio  |  Android Developers](https://developer.android.google.cn/studio/write/app-link-indexing?hl=zh-cn)

#### 添加Intent Filters

1. 依次选择 **Tools > App Links Assistant**。
2. 点击 **Open URL Mapping Editor**，然后点击 **URL Mapping** 列表底部的 **Add** <br> ![|30](https://cdn.nlark.com/yuque/0/2023/png/694278/1684760535507-177e2cea-06f3-4695-b5ee-47bab04b5f28.png#averageHue=%23d5d5d5&clientId=u099551e9-a7d7-4&from=paste&id=u9fa1cc42&originHeight=32&originWidth=32&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=shadow&taskId=ubc65c4b3-b995-40db-9177-3cb12c71778&title=)
3. 以添加新的网址映射。

![添加有关您网站的链接结构的基本详情，以将网址映射到应用中的 activity。|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684760578991-dd447691-3e7d-45c0-8950-149cc9fe896f.png#averageHue=%23eaeaea&clientId=u099551e9-a7d7-4&from=paste&height=257&id=u335cd177&originHeight=702&originWidth=1346&originalType=binary&ratio=2&rotation=0&showTitle=true&size=104663&status=done&style=shadow&taskId=u38be863a-6122-4b79-90e9-c8cd43a8933&title=%E6%B7%BB%E5%8A%A0%E6%9C%89%E5%85%B3%E6%82%A8%E7%BD%91%E7%AB%99%E7%9A%84%E9%93%BE%E6%8E%A5%E7%BB%93%E6%9E%84%E7%9A%84%E5%9F%BA%E6%9C%AC%E8%AF%A6%E6%83%85%EF%BC%8C%E4%BB%A5%E5%B0%86%E7%BD%91%E5%9D%80%E6%98%A0%E5%B0%84%E5%88%B0%E5%BA%94%E7%94%A8%E4%B8%AD%E7%9A%84%20activity%E3%80%82&width=493 "添加有关您网站的链接结构的基本详情，以将网址映射到应用中的 activity。")

- ① 在 Host 字段中输入您网站的网址。
- ② 为您要映射的网址添加 [path、pathPrefix或pathPattern](https://developer.android.google.cn/guide/topics/manifest/data-element?hl=zh-cn#path)。（例如，如果您有一个食谱分享应用，所有食谱都在同一个 activity 中，并且对应网站的食谱都在同一个`/recipe`目录中，请使用 pathPrefix 并输入“/recipe”。这样，网址 <http://www.recipe-app.com/recipe/grilled-potato-salad> 就会映射到您在下一步中选择的 activity。）
- ③ 选择网址应将用户转至的 Activity。
- ④ 点击 OK。此时会显示 `URL Mapping Editor`（网址映射编辑器）窗口。App Links Assistant 会根据您映射到 AndroidManifest.xml 文件的网址添加 intent 过滤器，并在 Preview 字段中突出显示更改。如果您要进行任何更改，请点击 Open AndroidManifest.xml 以修改 intent 过滤器。

![URL Mapping Editor|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684760569073-d3e0f2c0-3ec5-4559-aadc-448525e16088.png#averageHue=%233e4147&clientId=u099551e9-a7d7-4&from=paste&height=366&id=u3c615725&originHeight=1382&originWidth=2296&originalType=binary&ratio=2&rotation=0&showTitle=true&size=299230&status=done&style=shadow&taskId=u943c6f21-cc37-48b2-9b13-cc069da9512&title=URL%20Mapping%20Editor&width=608 "URL Mapping Editor")

- 如需验证网址映射是否正常运行，请在 **Check URL Mapping** 字段中输入网址，然后点击 **Check Mapping**。如果网址映射正常运行，成功消息会显示您输入的网址映射到您选择的 activity。

**注意：** path、 pathPrefix、 pathPattern 之间的区别

- path 用来匹配完整的路径，这里将 path 设置为 `/assistant/download.html` 才能够进行匹配；
- pathPrefix 用来匹配路径的开头部分，拿上面的 Uri 来说，这里将 pathPrefix 设置为 `/assistant` 就能进行匹配了；
- pathPattern 用表达式来匹配整个路径，这里需要说下匹配符号与转义。

**Intent-Filters代码：**

```xml
<activity
  android:name=".samples.basic.杂七杂八.链接打开App.urlscheme.URLSchemeActivity"
  android:exported="true"
  tools:ignore="AppLinkUrlError">

  <!-- for deep-link -->

  <!-- URI Scheme -->
  <intent-filter>
    <data
      android:host="hacket.me"
      android:scheme="hacket" />

    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
  </intent-filter>

  <!-- App Links -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="http" />
    <data android:host="hacket.me" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="http" />
    <data android:host="hacket.me" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https" />
    <data android:host="hacket.me" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https" />
    <data android:host="hacket.me" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="http" />
    <data android:host="lbo0d.test-app.link" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https" />
    <data android:host="lbo0d.test-app.link" />
  </intent-filter>
</activity>
```

- path完全匹配 /recipe，/recipe/xxx就会匹配不了
- pathPrefix前缀就可以匹配的上，带path的一般都用pathPrefix就行了
- 一个Intent-Filter标签中，所有的data标签的，host/scheme/path都是互相组合的，只要配置了一个pathPrefix，其他host也是能匹配的
- host能不能写通配符，如`*`，匹配不上的，得验证一下

```kotlin
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:host="*.onelink.shein.com"
        android:scheme="https" />

</intent-filter>
```

#### Add logic to handle the intent 添加处理逻辑

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684761096044-26935198-a9f9-4e85-ad70-f60620dd1ea9.png#averageHue=%235f7e62&clientId=u099551e9-a7d7-4&from=paste&height=461&id=u9d930e2d&originHeight=1444&originWidth=1792&originalType=binary&ratio=2&rotation=0&showTitle=false&size=499842&status=done&style=shadow&taskId=u7978799c-ff81-40ee-97c6-4756d403676&title=&width=572)<br>添加如下代码：

```kotlin
class URLSchemeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
        handleIntent(intent)
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }
    private fun handleIntent(intent: Intent) {
        val appLinkAction = intent.action
        val appLinkData: Uri? = intent.data
        if (Intent.ACTION_VIEW == appLinkAction) {
        	appLinkData?.lastPathSegment?.also { recipeId ->
            	Uri.parse("content://com.recipe_app/recipe/")
                    .buildUpon()
                    .appendPath(recipeId)
                    .build().also { appData ->
                        showRecipe(appData)
                }
        }
    }
}
```

#### 添加`assetlinks.json`文件：[Associate website](https://developer.android.google.cn/studio/write/app-link-indexing?hl=zh-cn#associatesite) 将应用与网站相关联

添加 `assetlinks.json` 文件，声明你的网址和应用之间的关系<br>点击 App Links Assistant 中的 **Open Digital Asset Links File Generator**<br>![输入有关您的网站和应用的详细信息，以生成 Digital Asset Links 文件|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684761610778-25860348-f663-48b2-a8a2-0bebc6c7955a.png#averageHue=%23eae9e9&clientId=u099551e9-a7d7-4&from=paste&height=601&id=u869089c8&originHeight=2264&originWidth=2148&originalType=binary&ratio=2&rotation=0&showTitle=true&size=1714225&status=done&style=shadow&taskId=u9694b0fe-01ad-45ae-8416-afdcacc1f2d&title=%E8%BE%93%E5%85%A5%E6%9C%89%E5%85%B3%E6%82%A8%E7%9A%84%E7%BD%91%E7%AB%99%E5%92%8C%E5%BA%94%E7%94%A8%E7%9A%84%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%EF%BC%8C%E4%BB%A5%E7%94%9F%E6%88%90%20Digital%20Asset%20Links%20%E6%96%87%E4%BB%B6&width=570 "输入有关您的网站和应用的详细信息，以生成 Digital Asset Links 文件")

1. 输入您的 **Site domain** 和 [Application ID](https://developer.android.google.cn/studio/build/configure-app-module?hl=zh-cn#set-application-id)
2. 如需在 Digital Asset Links 文件中添加对[一键登录](https://developers.google.cn/identity/one-tap/android/overview?hl=zh-cn)的支持，请选择 **Support sharing credentials between the app and the website**，输入网站的登录网址。此操作会将以下字符串添加到 Digital Asset Links 文件中，声明应用和网站共享登录凭据：`delegate_permission/common.get_login_creds`。
3. 指定[签名配置](https://developer.android.google.cn/studio/publish/app-signing?hl=zh-cn#sign-auto)或选择[密钥库文件](https://developer.android.google.cn/studio/publish/app-signing?hl=zh-cn#certificates-keystores)。
4. 点击 **Generate Digital Asset Links file**。
5. Android Studio 生成文件后，点击 **Save file** 进行下载。
6. 将 `assetlinks.json` 文件上传到您的网站并允许所有人读取，网址为 `https://yoursite/.well-known/assetlinks.json`；**yoursite** 就是你在 intent-filter 配置的 host。

> 系统会通过加密的 HTTPS 协议验证 Digital Asset Links 文件。请确保无论应用的 intent 过滤器是否包括 https，均可通过 HTTPS 连接访问 `assetlinks.json` 文件。

7. 点击 Link and Verify 以确认您已将正确的 Digital Asset Links 文件上传到适当的位置

### intent-filter配置

#### intent-filter 错误配置

同一个 intent filter 内所有的 `<data>` 元素会合并在一起，以解释他们所有组合属性的变量。

**错误案例：** 要配置 `app.xxx.xxx` 和 `api-.xxx.xxx.com/h5/sharejump/appjump` 两种域名的 `Applinks` 错误配置

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:host="app.xxx.com"
        android:scheme="https"/>
    <data
        android:host="app.xxx.tw"
        android:scheme="https"/>
    <data
        android:host="app.xxx.se"
        android:scheme="https"/>
  	<data
        android:host="api-xxx.xxx.com"
        android:pathPrefix="/h5/sharejump/appjump"
        android:scheme="https" />
    <data
        android:host="api-xxx.xxx.com"
        android:pathPrefix="/h5/sharejump/appjump"
        android:scheme="http" />
</intent-filter>
```

> 同一个 intent-filter 中，**host**、**scheme**、**path** 、**pathPrefix**、**pathPattern** 如果配置了多个，他们之间会互相组合的，就会导致原本的 `https://app.xxx.tw` 这种 `Applinks` 失效，必须加上 pathPrefix 才行：`https://app.xxx.tw//h5/sharejump/appjump`

**解决：** app.xxx.xxx 和 api-.xxx.xxx.com/h5/sharejump/appjump 要分开在不同的 intent-filter 中配置

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
    android:host="app.xxx.com"
    android:scheme="https"/>
  <data
    android:host="app.xxx.tw"
    android:scheme="https"/>
  <data
    android:host="app.xxx.se"
    android:scheme="https"/>
</intent-filter>
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https"/>
    <data android:host="api-shein.shein.com"/>
    <data android:pathPrefix="/h5/sharejump/appjump"/>
    <data android:scheme="http"/>
    <data android:host="api-shein.shein.com"/>
    <data android:pathPrefix="/h5/sharejump/appjump"/>
</intent-filter>
```

#### 支持不同的子域名

数字资产链接协议把你intent filter里的子域名看做唯一的、独立的域名。因此，如果你的intent filter列出一个域名及其多个子域名，你需要在每个子域名上发布一个有效的assetlinks.json文件。

> 例如：下面的intent filter包含了www.example.com和mobile.example.com作为期望处理的intent的URL的主机名。因此，有效的`assetlinks.json`必须同时发布在<https://www.example.com/.well-known/assetlinks.json和https://mobile.example.com/.well-known/assetlinks.json。>

```xml
<application>
  <activity android:name=”MainActivity”>
    <intent-filter android:autoVerify="true">
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="https" android:host="www.example.com" />
      <data android:scheme="https" android:host="mobile.example.com" />
    </intent-filter>
  </activity>
</application>
```

或者，如果你用**通配符**定义了你要处理的主机名(如*.example.com)，那么你需要把你的assetlinks.json文件发布在根主机名(根域名)下(example.com)。

> 比如，一个以定义了如下intent filter的应用，如果assetlinks.json发布在<https://example.com/.well-> known/assetlinks.json，它的任一子域名(如foo.example.com)将会通过验证。

```xml
<application>
  <activity android:name=”MainActivity”>
    <intent-filter android:autoVerify="true">
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="https" android:host="*.example.com" />
    </intent-filter>
  </activity>
</application>
```

### `assetlinks.json` 文件

配置路径：`https://yoursite/.well-known/assetlinks.json`

#### 单一网站和单一应用之间的关系

数字资产证明文件必须发布在你的网站上，以证明你的应用是和网站关联在一起的，并且用于验证应用内的URL链接模式。这个JSON文件用下面几个字段来标识关联的应用：

- **`package_name`**：在`build.gradle`里定义的application id
- **`sha256_cert_fingerprints`**：应用签名的SHA256指纹信息。你可以用下面的命令，通过`Java keytool`来生成指纹信息：`keytool -list -v -keystore my-release-key.keystore`

> 这个字段支持多个指纹信息，可以用来支持不同的应用版本，如开发版本和发布版本

下面这个示例assetlinks.json授予链接打开权限给com.example应用

```json
[{  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example",
    "sha256_cert_fingerprints":
    ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
  }
}]
```

#### 让同一网站和不同应用关联起来

网站可以在同一个assetlinks.json文件里声明和不同的app的关系。下面这个文件列出了两个声明，这两个声明声明了网站和两个应用之间的关联，这个文件位于<https://www.example.com/.well-known/assetlinks.json：>

```json
[{  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.puppies.app",
    "sha256_cert_fingerprints":
    ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
  }
},
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.monkeys.app",
      "sha256_cert_fingerprints":
      ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
    }
  }]
```

不同应用或许会处理同一个域名下的不同资源链接。比如：app1声明一个intent filter用于处理<https://example.com/articles，app2声明一个intent> filter用于处理<https://example.com/videos。>

> 注意：关联同一个域名的不同应用可能会使用相同或不同的签名文件。

#### 关联一个应用到不同网站

不同的网站可以在它们的assetlinks.json文件里声明关联同一个应用。

- 第一个文件展示了关联app1到example.com

```json
[{  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.mycompany.app1",
    "sha256_cert_fingerprints":
    ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
  }
}]
```

- 关联app1到example.net

```json
[{  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.mycompany.app1",
    "sha256_cert_fingerprints":
    ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"]
  }
}]
```

#### 发布JSON验证文件

- `assetlinks.json`文件的content-type必须为`application/json`
- 不管你的应用的intent filter是否定义https作为data的scheme，`assetlinks.json`必须能通过HTTPS链接访问
- `assetlinks.json`必须能不经过任何重定向被访问到(即没有301、302跳转)，同时可以被爬虫访问到(`你的robot.txt必须允许抓取/.well-known/assetlinks.json`)
- 如果你的应用支持多种域名，你需要把assetlinks.json发布在这几个域名的服务器上
- 不要在你的AndroidManifest文件里发布无法公开访问的开发/测试URL(比如那些只能通过VPN进行访问的URL)。一种可行的做法是配置构建类型，来为开发构建生成不同的清单。

[[Android applinks assetlinks.json配置指南]]

## Android App Links验证

[验证 Android 应用链接  |  Android 开发者  |  Android Developers](https://developer.android.com/training/app-links/verify-android-applinks)

#### AppLinks生效条件

- AndroidM 及以上支持；不需要 APP，`targetSdkVersion=M`，只需要 AndroidM 手机即可
- AppLinks本质上是一种特殊的DeepLinks，也就是说，在不支持的系统上，它会跟DeepLinks一样，作为一个可处理某一类请求的处理器，显示在系统的弹出列表里。

#### App links系统验证的过程

你的app links的intent-filter配置：

```xml
<activity ...>
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="http" android:host="www.example.com" />
    <data android:scheme="https" />
  </intent-filter>
</activity>
```

当`android:autoVerify="true"`出现在你任意一个intent filter里，在Android 6.0及以上的系统上安装应用的时候，会触发系统对APP里和URL有关的每一个域名的验证。验证过程设计以下步骤：

1. 系统会检查所有包含以下特征的intent filter：Action为`android.intent.action.VIEW`、Category为`android.intent.category.BROWSABLE`和`android.intent.category.DEFAULT`、Data scheme为`http或https`
2. 对于在上述intent filter里找到的每一个唯一的域名，Android系统会到对应的域名下查找数字资产文件，地址是：`https://域名/.well-known/assetlinks.json`

只有当系统为 AndroidManifest 里找到的每一个域名找到对应的数字资产文件，系统才会把你的应用设置为特定链接的**默认处理器**。<br>在你安装 APP 后，会请求这个来验证，抓包看<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687140390411-e5f337bc-7ed7-4b03-8fb2-81c407d2f901.png#averageHue=%23b5caea&clientId=u0de4016a-5899-4&from=paste&height=73&id=u4e3a5ddb&originHeight=146&originWidth=692&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24537&status=done&style=shadow&taskId=u49a2a6e7-4339-414c-9f24-b61e8229181&title=&width=346)

#### 方式一：请求`googleapis`来验证：

><https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourhost&relation=delegate_permission/common.handle_all_urls>

如：<https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://app.shein.com&relation=delegate_permission/common.handle_all_urls><br>出现类似：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685518585212-c526f399-b2be-4bb5-b981-5bf0ca754e7f.png#averageHue=%23fdfdfd&clientId=ub864e1c1-1786-4&from=paste&height=406&id=u5848f56f&originHeight=812&originWidth=2244&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138429&status=done&style=shadow&taskId=u2ac5d382-990f-443e-9489-036d5b5eda0&title=&width=1122)

#### 方式二：[Statement List Generator and Tester](https://developers.google.com/digital-asset-links/tools/generator)工具

##### Test statement

当实现 APP Links 特性时，你需要测试链接功能是否可用，以保证系统能够将你的 APP 和网站关联起来，并如预期地处理 URL 请求。

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1685435831187-88e4a613-2db2-4463-939a-5a2cdcb4f46a.png#averageHue=%23f4f6f7&clientId=u6afdf09b-312e-4&from=paste&height=298&id=u253b86ad&originHeight=1202&originWidth=2812&originalType=binary&ratio=2&rotation=0&showTitle=false&size=245981&status=done&style=shadow&taskId=u54bff29e-9e33-4aab-92ef-4bb023d3514&title=&width=698)<br>**说明：**

- **Hosting site domain** 域名，不要带 path
- **App package name** applicationId
- **App package fingerprint (SHA256)** 签名

##### Generate statement

**Generate statement**：帮我们生成 `assetlinks.json` 文件

**Test statement：** 测试是否配置成功
![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1685435992843-042a2e0a-0fe7-4113-8217-e00234cffcd6.png#averageHue=%23fefefe&clientId=u6afdf09b-312e-4&from=paste&height=226&id=u35b14f09&originHeight=704&originWidth=1566&originalType=binary&ratio=2&rotation=0&showTitle=false&size=98668&status=done&style=shadow&taskId=u2c2eaf7a-de68-43e9-8a98-5f5ab86bf4b&title=&width=503)

我们可以按 F12打开开发者工具，来查看具体的错误信息：<br>![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1685436520449-6f3fda34-76e3-4d84-8b26-220dabb3214f.png#averageHue=%23fdfbfb&clientId=u6afdf09b-312e-4&from=paste&height=616&id=u267a9254&originHeight=1232&originWidth=2980&originalType=binary&ratio=2&rotation=0&showTitle=false&size=351385&status=done&style=shadow&taskId=ubbbefa0a-853a-4e84-b614-f259c4e350e&title=&width=1490)

#### 方式三：直接访问配置了asstlinks.json的域名

如：<https://app.shein.tw/.well-known/assetlinks.json><br>但有的是在浏览器中访问不了的，这种就可以用前面的方式来验证<br><https://app.shein.com/.well-known/assetlinks.json>

如何出现这种，就是运维把证书配置错了：
![企业微信截图_9e1aeb34-bcdf-4857-a409-25ce817979c6.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/企业微信截图_9e1aeb34-bcdf-4857-a409-25ce817979c6.png)

#### 方式四：安装到设备看log

将应用安装到设备上，等待20秒左右，进行验证

> 在应用安装后，等待至少20秒的时间，以便系统验证完毕。但是，上文只告诉我们如何获得应用是否是特定域名的默认处理器的配置信息，系统的这个验证过程是否发起，是否执行完毕，验证结果如何，我们是无从得知的。

验证成功会有类似日志信息：

```java
2020-09-27 11:57:48.216 10414-27720/? I/IntentFilterIntentOp: Verifying IntentFilter. verificationId:32 scheme:"https" hosts:"mashi-alternate.test-app.link mashi.test-app.link" package:"club.jinmei.mgvoice". [CONTEXT service_id=244 ]
2020-09-27 11:58:20.534 10414-27720/? I/IntentFilterIntentOp: Verification 32 complete. Success:false. Failed hosts:mashi-alternate.test-app.link,mashi.test-app.link. [CONTEXT service_id=244 ]
```

> 这种方式不一样好使

#### 方式五：获取设备上所有应用的链接处理策略命令

**输出当前手机所有app links的包名**

```shell
adb shell dumpsys package domain-preferred-apps
```

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1685439061072-7347bfb4-ab54-41a9-a78d-00184b135fde.png#averageHue=%23213a43&clientId=u6afdf09b-312e-4&from=paste&height=714&id=u9eb2d6a7&originHeight=1428&originWidth=1432&originalType=binary&ratio=2&rotation=0&showTitle=false&size=558584&status=done&style=shadow&taskId=udc5fd2b3-0ffc-40be-a1b8-93d262db626&title=&width=716)<br>后面跟 verified 说明验证通过了。

```shell
adb shell dumpsys package d
```

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1685524050172-c0c843f2-1993-46a4-89ed-19d6333c4038.png#averageHue=%23243d47&clientId=ub864e1c1-1786-4&from=paste&height=368&id=uf4204c98&originHeight=1400&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=557496&status=done&style=shadow&taskId=uf6b9c15c-8529-433a-abde-584d5b34dd5&title=&width=421)

#### 方式六：Android12及以上命令验证(推荐)

从Android12开始，可以手动调用app links域名验证，不管你的APP的`targetSdkVersion`是否是Android12了。

1. **设置支持app links域名校验**
   - 如果你的应用的`targetSdkVersion`已经是Android12，那么自动开启验证
   - 如果你的应用的targetSdkVersion小于Android12，需要手动开启：`adb shell am compat enable 175408749 PACKAGE_NAME`
2. **重置设备上App Links的状态**

> adb shell pm set-app-links --package PACKAGE_NAME 0 all
> 如：
> adb shell pm set-app-links --package com.zzkko 0 all

3. **调用app links域名校验**

> adb shell pm verify-app-links --re-verify PACKAGE_NAME
> 如：adb shell pm verify-app-links --re-verify com.zzkko

4. **查看校验结果**

> adb shell pm get-app-links PACKAGE_NAME
> 如：adb shell pm get-app-links com.zzkko

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685523981166-bf8e2c06-069f-4579-b739-b06dedbecc9b.png#averageHue=%232c454e&clientId=ub864e1c1-1786-4&from=paste&height=370&id=u08d846d4&originHeight=740&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=280678&status=done&style=shadow&taskId=uefb55b66-7f8f-4b87-a672-f542e109be0&title=&width=810)<br>[状态码结果查验](https://developer.android.com/training/app-links/verify-android-applinks#add-intent-filters)<br>未成功状态：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687349423190-1f0de46c-b481-4229-bbbf-263b42dcf085.png#averageHue=%232f4751&clientId=u79517d96-3ca9-4&from=paste&height=297&id=ufa5c6922&originHeight=594&originWidth=1132&originalType=binary&ratio=2&rotation=0&showTitle=false&size=244858&status=done&style=shadow&taskId=ucacc92c5-45ca-4b0d-97a9-65c1761e050&title=&width=566)

#### 用浏览器/备忘录/Pushbullet测试

**浏览器：**

- 浏览器唤起时，只有在chrome或者基于chrome的浏览器才可以，市面上大部分都不支持，例如小米自带的浏览器，qq浏览器，百度浏览器，三星浏览器等都不支持。
- 总的来说在国内意义不大，像微信内置浏览器拦截了系统的deeplink和applink，自己维护了一套([https://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD](https://links.jianshu.com/go?to=https%3A%2F%2Fwiki.open.qq.com%2Findex.php%3Ftitle%3Dmobile%2F%25E5%25BA%2594%25E7%2594%25A8%25E5%25AE%259D%25E5%25BE%25AE%25E4%25B8%258B%25E8%25BD%25BD))，需要申请白名单才行。

**备忘录：**

- 需要放到备忘录来测试，有的浏览器是不支持直接跳转的，还会弹个窗二次确认。<https://shein.tw/onelink>

如果未验证成功或者集成不对，还是弹窗来选择了<br>![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1685436049671-cb93385f-1182-4996-9918-a4bee4077293.png?x-oss-process=image/format,png#averageHue=%23e0dcd0&clientId=u6afdf09b-312e-4&from=paste&height=282&id=u95f8bb13&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=10368850&status=done&style=shadow&taskId=u286834c5-6998-4207-8b6d-e26cf034dce&title=&width=127)<br>**Pushbullet**

- 利用pushbullet在电脑和手机端传输链接，点击其中的applinks也是可以跳转的

#### adb+URL Intent测试

```shell
adb shell am start -a android.intent.action.VIEW \
    -c android.intent.category.BROWSABLE \
    -d "http://你的域名:可选的端口"
# 如
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "https://app.shein.com"
```

> 在Android手机上的Chrome浏览器、猎豹浏览器、UC浏览器里直接输入网址来验证，均无法触发系统的AppLinks特性。推测浏览器内发起的跳转，会被浏览器直接拦截处理了，因此无法进入系统的分发处理Intent流程，故没触发AppLinks特性。

#### 对 ink 域名不太友善

在测试中发现，国内各大厂商对 .ink 域名不太友善，很多的是被支持了 .com 域名，但是不支持 .ink 域名。<br>机

| 机型   | 版本                                     | 是否识别ink    | 是否识别com    |
| ---- | -------------------------------------- | ---------- | ---------- |
| 小米   | MI6 Android 8.0 MIUI 9.5               | 否          | 是          |
| 小米   | MI5 Android 7.0 MIUI 9.5               | 否          | 是          |
| 魅族   | PRO 7 Android 7.0 Flyme 6.1.3.1A       | 否          | 是          |
| 三星   | S8 Android 7.0                         | 是，弹框       | 是          |
| 华为   | HonorV10 Android 8.0 EMUI 8.0          | 是          | 是          |
| oppo | R11s Android 7.1.1 ColorOS 3.2         | 是          | 是          |
| oppo | A59s Android 5.1 ColorOS 3.0           | 是,不能跳转到app | 是,不能跳转到app |
| vivo | X6Plus A Android 5.0.2 Funtouch OS_2.5 | 否          | 是          |
| vivo | 767 Android 6.0 Funtouch OS_2.6        | 是,不能跳转到app | 是,不能跳转到app |
| vivo | X9 Android 7.1.1 Funtouch OS_3.1       | 是,不能跳转到app | 是,不能跳转到app |

> 数据来源网络，未验证真实

## Android app link 不生效问题排查思路

### 1、检查 intent-filter 是否配置对了？

- 是否配置了 `android:autoVerify="true"` 属性
- scheme/host/path 是否都配置对了，如只配置了 https，那么 http 就会不支持
- host 和 path 混合配置，如果有的只需要配置 host，有的是 host/path，这种就需要分开 2 个 intent-filter 配置

### 2、检查 `assetlinks.json` 配置是否正常（配置不对找运维）

1. 直接访问看是否正常，如 [assetlinks.json](https://app.shein.com/.well-known/assetlinks.json)
2. [Statement List Generator and Tester](https://developers.google.com/digital-asset-links/tools/generator) 工具（需要包名、证书和域名）
3. 直接访问 GoogleApi，如 [digitalassetlinks.googleapis.com/](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://app.shein.com&relation=delegate_permission/common.handle_all_urls) 传入自己的包名（app 首次安装时会访问该接口去校验）

### 3、查看 APP 是否校验成功（APP 首次安装会去校验）

1. ADB命令校验：`adb shell pm get-app-links com.zzkko`，出现 verified 就是校验成功，1024 或 none 就是未成功
2. 如果未校验成功，1024 一般是代理问题，看安装包是是否开启了抓包工具的代理，需要关闭代理，如 Charles
3. 要校验成功需要科学上网

### 4、直接注入 url 和点击 url 跳转

如果是直接输入 URL 访问，也是拉不起 APP 的

#### 浏览器中 "输入 URL 访问" 和 "点击链接访问" 的区别

这两种互动方式的主要区别在于用户行为的触发方式，也会影响 `applinks` 的处理逻辑。具体如下：

##### 1. 输入 URL 访问

- **行为**： 用户直接在浏览器地址栏中手动输入一个 `applinks` 支持的链接（如 `https://example.com/path`），再按下回车键访问。
- **实现逻辑**：
  - 浏览器会将这个操作视为普通的 HTTP/HTTPS 请求，并试图加载该 URL 对应的网页。
  - 如果目标 URL 支持 **Universal Links**（iOS）或 **App Links**（Android），操作系统可能会尝试将这一请求重定向到支持该链接的 App。
  - 但在某些情况下，系统可能默认优先加载网页版本，而非直接跳转到 App。
- **常见结果**：
  - **iOS**：不一定触发 Universal Links，可能直接访问网页，特别是低版本操作系统或未正确配置时。
  - **Android**：如果 App Links 正常配置，并且用户未禁用相关选项，可能会直接跳转到 App。
- **特殊行为**： 某些浏览器（如 Safari）对直接输入链接的唤起行为限制较多，Universal Links 的触发条件可能不会完全生效。

##### 2. 点击链接访问

- **行为**： 用户从网页、电子邮件、短信、社交软件、文档等内容中点击一个带有 `applinks` 的链接。

- **实现逻辑**：

  - 系统会分析点击的链接所属的域名是否启用了 Universal Links 或 App Links，并检查该链接是否绑定到一个特定的应用。
  - 如果配置正确，系统会判断是否直接跳转到该链接对应的 App 页面，或提示用户选择打开路径。
  - **默认行为**：
    - 如果 App 支持 `applinks` 并且已安装，链接会直接打开 App 中的对应页面。
    - 如果 App 未安装或链接未正确配置，会在默认浏览器中加载网页版本。

- **常见结果**：

  - **iOS**：系统会通过 `apple-app-site-association` 文件判断是否要触发 App 的 Universal Link 功能，通常点击链接会更容易触发跳转。
  - **Android**：类似，系统会检查 `assetlinks.json` 文件并判断 App Links 是否已匹配。

#### 具体行为上的技术区别

| **行为触发方式**      | **请求对象**                      | **是否直接跳转到 App**                               |
| --------------- | ----------------------------- | --------------------------------------------- |
| **手动输入 URL 访问** | 直接发送 HTTP/HTTPS 请求，访问网页为主     | 通常不会直接跳转到 App，系统默认优先网页加载。                     |
| **点击链接访问**      | 浏览器会递交该 URL，由 OS 或目标 App 进行处理 | 如果支持 Universal Links 或 App Links，支持直接跳转到 App。 |

这两者的技术差异归因于以下几个关键因素：

##### 1. 操作系统对链接的处理优先级

- **iOS**：
  - Universal Links 的触发较为依赖点击行为。手动输入 URL 时，系统很少触发 App 的识别机制，多数情况下会直接加载网页。
  - 当点击链接时，系统先检查当前链接是否被声明为 Universal Link，如果是，则优先将用户导向 App。
- **Android**：
  - Android 的处理机制对于点击操作更友好。当点击链接时，系统会查询 `assetlinks.json` 的配置，并优先提示用户选择打开 App。如果是手动输入，则通常直接加载网页。

##### 2. 浏览器的处理逻辑

不同的浏览器对直接输入 URL 和点击链接的处理方式也可能不同：

- **Safari**（iOS 默认浏览器）：
  - 对直接输入的链接，主要作为纯 HTTP 访问请求，常常绕过 App 注册的 Universal Links。
  - 对点击的 Universal Links，优先判断是否触发 App 的跳转逻辑。
- **Chrome**：
  - 更倾向于直接读取 `assetlinks.json` 或 `apple-app-site-association` 文件，点击和输入触发机制基本一致，只要匹配成功就会提示跳转。
  - 但在匿名用户模式下，跳转行为可能受到限制。

### WebView 对 `applinks` 跳转的影响

- Chrome 浏览器，`Google Applinks` 可以正常跳转
- 三方 APP 自定义的 WebView ，取决于三方 APP 放不放行该链接，如果放行是可以通过 applinks 唤起 APP 的

```kotlin
class CustomWebViewActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 初始化 WebView
        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true // 启用 JavaScript
        webView.settings.domStorageEnabled = true // 启用 DOM 存储

        // 自定义 WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()

                // 检查是否是 App Links
                if (isAppLink(url)) {
                    // 跳转到相关 App
                    openAppLinkIntent(url)
                    return true // 已处理，不再加载 URL
                }

                // 默认行为：继续加载 URL
                return false
            }
        }

        // 加载初始网页
        webView.loadUrl("https://example.com")
    }

    /**
     * 判断 URL 是否为 App Links（匹配规则可以定制）
     */
    private fun isAppLink(url: String): Boolean {
        return url.contains("example.com/deeplink") // 检查链接是否符合 App Links 定义规则
    }

    /**
     * 使用 Intent 打开 App Links
     */
    private fun openAppLinkIntent(url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent) // 调用目标 App
        } catch (e: Exception) {
            e.printStackTrace()
            // 处理未安装目标 App 的情况（例如引导用户下载）
        }
    }
}

```
## Android App Links核心原理

应用安装的时候根据`activity`标签中的`data`的内容到这个网页下面去获取对应域名下的`assetlinks.json`进行校验，如果符合条件则把 这个 url 保存在本地，当点击 webview 或者短信里面的 url的时候，系统会自动与本地库中的域名相匹配， 如果匹配失败则会被自动认为是 deeplink 的连接。

## DeepLinks和AppLinks区别？

1. Deep Links 是一种允许用户进入应用某个特定Activity的intent filter。点击这类链接时，系统可能会弹出一个选择列表，让用户在一堆能够处理这类链接的应用里(包括你的)选择一个来处理该链接。

> 例如：用户点击了一个地图相关的链接，系统弹出一个选择列表，让用户选择是要使用地图应用来处理，还是使用Chrome浏览器来处理。

2. App Links 是一种基于你的网站地址且验证通过的Deep Links。因此，点击一个这样的链接会直接打开你的应用(如果已经安装)，系统将不会弹出选择列表。当然，后续用户可以更改配好设置，来指定由哪个应用程序处理这类链接。

下面这个列表描述更多差异：

| <br>              | Deep Links                | App Links                                                               |
| ----------------- | ------------------------- | ----------------------------------------------------------------------- |
| Intent URL Scheme | https, http，或者自定义         | 需为http或https                                                            |
| Intent Action     | 任意Action                  | 需为`android.intent.action.VIEW`                                          |
| Intent Category   | 任意Category                | 需为`android.intent.category.BROWSABLE`和`android.intent.category.DEFAULT` |
| 链接验证              | 不需要                       | 需要在网站上放置一个数字资产链接，并能够通过HTTPS访问                                           |
| 用户体验              | 可能会弹出一个选择列表给用户选择用哪个应用处理连接 | 没有弹框，系统直接打开你的应用处理网站连接                                                   |
| 兼容性               | 所有Android版本               | Android 6.0及以上                                                          |

## 其他App Links技术

### Universal Link

Universal Link 是 Apple 在 iOS 9 推出的一种能够方便的通过传统 HTTPS 链接来启动 APP 的功能。可以无缝重定向到对应的 APP，且不需要通过 Safari 浏览器。如果你的应用不支持的话，则会在 Safari 中打开该链接。
