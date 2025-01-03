---
date created: 2024-09-14 00:15
date updated: 2024-12-24 00:35
dg-publish: true
---

# Line

- [ ] 官方文档：[LINE SDK for Android overview](https://developers.line.biz/en/docs/line-login-sdks/android-sdk/overview/)

## Line login

### 注册账号

<shengfanzeng@gmail.com>/zxxx/_#Z_**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694762378673-4f56ef1f-5e7a-4b55-bdd4-c70512eb924c.png#averageHue=%23eceded&clientId=u033a90f7-f85d-4&from=paste&height=56&id=ua66a0dc1&originHeight=112&originWidth=686&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13882&status=done&style=none&taskId=ubc8b2691-2cbf-47d0-8503-b548c3f2429&title=&width=343)

### Trying the sample app

<https://developers.line.biz/en/docs/line-login-sdks/android-sdk/try-line-login/>

### 准备工作

1. 手机科学上网
2. 下载line apk并注册登录(可能需要下载apk的方式安装，除非你有google play)
3. 下载官方demo体验，官方demo提供了测试的channelId，可以进行测试：[Trying the sample app](https://developers.line.biz/en/docs/line-login-sdks/android-sdk/try-line-login/)

### 接入工作

#### 创建应用（Channel）

##### 创建Provider

到line开发者平台<https://developers.line.biz/console/>，注册账号，并添加provider，provider类似组织或公司，一般以公司表示创建，然后在此provider下创建一个新的channel<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694760094179-e23d6997-5f1b-43a0-9681-ce89d0e76f9a.png#averageHue=%23a5a5a5&clientId=u033a90f7-f85d-4&from=paste&height=275&id=u6299d232&originHeight=1000&originWidth=1872&originalType=binary&ratio=2&rotation=0&showTitle=false&size=159423&status=done&style=none&taskId=uf24de166-25ec-4bdf-8e7a-efb1d094033&title=&width=514)

##### 创建Channel

channel可以类比国内其他平台创建的应用，最终会得到一个Channel ID即appID)，通过此channelID与应用关联。创建时选择类型：LINE Login ，根据提示逐个填入相关资料，这些资料都会在后面app调起的授权页面显示，可先尝试填充，后面更改。重点关注Package names和App types两个选项，App types选择web和App两个，即支持跳转app登录和跳转网页登录；<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694760130557-6a243475-2121-4b9a-8719-b7a4048efea0.png#averageHue=%23fdfdfd&clientId=u033a90f7-f85d-4&from=paste&height=383&id=NQSJM&originHeight=1140&originWidth=646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42732&status=done&style=none&taskId=u55ee61d8-56a7-49e3-9427-c6e44baa395&title=&width=217)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694760145022-27552c7f-3cbe-4e3b-af27-f74891e7ff36.png#averageHue=%23fbfafa&clientId=u033a90f7-f85d-4&from=paste&height=214&id=jsowW&originHeight=842&originWidth=1636&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109115&status=done&style=none&taskId=u9eb8c2c7-1840-45ef-8980-3d1dd8bd316&title=&width=416)

- 记住Channel ID
- Android Package names 必填。应用程序的软件包名称，用于启动Google Play商店
- Package signatures 可选。您可以通过在新行中输入每个签名来设置多个签名
  - gradlew signingReport
  - jadx-gui查看APK Signature

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694760415978-a66e364d-5afc-4b7b-bd82-9ea9f0d1263e.png#averageHue=%23eae8e8&clientId=u033a90f7-f85d-4&from=paste&height=555&id=uf3189b9c&originHeight=1110&originWidth=2284&originalType=binary&ratio=2&rotation=0&showTitle=false&size=293360&status=done&style=none&taskId=uac8f3fef-cc20-4512-a10f-b259ef409e8&title=&width=1142)

- apk查看
  - 将apk修改后缀为 .rar文件后解压
  - 进入解压后的META-INF目录，该目录下会存在文件CERT.RSA
  - 在该目录下打开cmd，输入命令 ：keytool -printcert -file CERT.RSA这里将会显示出MD5和SHA1签名
- Android URL scheme 可选。用于启动您的应用程序的自定义URL方案

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694761098941-533c9b5f-a7c5-49d2-84eb-8b1f2cdc56a1.png#averageHue=%23fdfdfd&clientId=u033a90f7-f85d-4&from=paste&height=436&id=u8bd7dd83&originHeight=1074&originWidth=1234&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104283&status=done&style=none&taskId=u0c7a4137-8d1b-4db8-bb0c-2baa6610c31&title=&width=501)

- 最后记得publish

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694760739019-fd1127ca-cd5b-47e7-bcae-8ab49b3a83b8.png#averageHue=%23a4a4a4&clientId=u033a90f7-f85d-4&from=paste&height=192&id=u2a227f9d&originHeight=674&originWidth=1772&originalType=binary&ratio=2&rotation=0&showTitle=false&size=110633&status=done&style=none&taskId=ucd3d2d72-6f97-4731-9f5b-0e8af56e98b&title=&width=506)

#### [添加依赖](https://developers.line.biz/en/docs/line-login-sdks/android-sdk/integrate-line-login/#add-line-sdk-dependency)

```groovy
repositories {
    ...
    mavenCentral()
}

dependencies {
    ...
    implementation 'com.linecorp.linesdk:linesdk:latest.release'
    ...
}
```

#### 跳转登录

接入登录官方提供了两种方式，内建登录按钮和自定义登录按钮。

##### 内建登录按钮

##### 官方提供的一个控件，视觉上应该是按照line的官方要求定义的，直接封装了登录相关的逻辑，com.linecorp.linesdk.widget.LoginButton，官方文档地址：<https://developers.line.biz/en/docs/android-sdk/integrate-line-login/#adding-line-login-button>。具体代码如下：

```java
// A delegate for delegating the login result to the internal login handler.
 private LoginDelegate loginDelegate = LoginDelegate.Factory.create();
 
 LoginButton loginButton = rootView.findViewById(R.id.line_login_btn);
 
 // if the button is inside a Fragment, this function should be called.
 loginButton.setFragment(this);
 
 loginButton.setChannelId(channelIdEditText.getText().toString());
 
 // configure whether login process should be done by Line App, or inside WebView.
 loginButton.enableLineAppAuthentication(true);
 
 // set up required scopes and nonce.
 loginButton.setAuthenticationParams(new LineAuthenticationParams.Builder()
         .scopes(Arrays.asList(Scope.PROFILE))
         // .nonce("<a randomly-generated string>") // nonce can be used to improve security
         .build()
 );
 loginButton.setLoginDelegate(loginDelegate);
 loginButton.addLoginListener(new LoginListener() {
     @Override
     public void onLoginSuccess(@NonNull LineLoginResult result) {
         Toast.makeText(getContext(), "Login success", Toast.LENGTH_SHORT).show();
     }
 
     @Override
     public void onLoginFailure(@Nullable LineLoginResult result) {
         Toast.makeText(getContext(), "Login failure", Toast.LENGTH_SHORT).show();
     }
 });
```

##### 自定义

基本都会根据自己的视觉UI添加按钮，官方也提供的文档入口：<https://developers.line.biz/en/docs/android-sdk/integrate-line-login/#starting-login-activity> 直接添加如下事件即可：

```kotlin
try {
    val loginIntent: Intent = LineLoginApi.getLoginIntent(
        this,
        CHANNEL_ID_JP,
        LineAuthenticationParams.Builder()
            .scopes(listOf(Scope.PROFILE))
//                        .botPrompt(LineAuthenticationParams.BotPrompt.normal)
            .botPrompt(LineAuthenticationParams.BotPrompt.aggressive)
            .build()
    )
    startActivityForResult(loginIntent, REQUEST_CODE)
} catch (e: Exception) {
    e.printStackTrace()
    Log.e("hacket", e.toString())
}
```

#### 接收回调

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode != REQUEST_CODE) {
        Log.e("hacket", "onActivityResult Unsupported Request");
        return
    }
    val result = LineLoginApi.getLoginResultFromIntent(data)

    when (result.responseCode) {
        LineApiResponseCode.SUCCESS -> {
            // Login successful
            val accessToken = result.lineCredential!!.accessToken.tokenString

            val friendshipStatusChanged = result.friendshipStatusChanged

            tv_line_login_status.text = "Login Successful\n"
            tv_line_login_status.append("${result.lineProfile}\n")
            tv_line_login_status.append("${result.lineCredential}\n")
            tv_line_login_status.append("${accessToken}\n")
            tv_line_login_status.append("friendshipStatusChanged=${friendshipStatusChanged}\n")

            Toast.makeText(
                this,
                "Login Successful：${result.lineProfile?.displayName}",
                Toast.LENGTH_SHORT
            ).show()
// 			
//                val transitionIntent = Intent(
//                    this,
//                    LoginPostLoginActivity::class.java
//                )
//                transitionIntent.putExtra("line_profile", result.lineProfile)
//                transitionIntent.putExtra("line_credential", result.lineCredential)
//                transitionIntent.putExtra("token", accessToken)
//                startActivity(transitionIntent)
        }

        LineApiResponseCode.CANCEL -> {              // Login canceled by user
            Log.e("hacket", "LINE Login Canceled by user.")
            tv_line_login_status.text = "LINE Login Canceled by user.\n"
        }

        else -> {
            // Login canceled due to other error
            tv_line_login_status.text = "Login FAILED! ${result.errorData.toString()}\n"
            Log.e("hacket", "Login FAILED!")
            Log.e("hacket", result.errorData.toString())
        }
    }
}
```

### 添加bot为好友

- [x] [Enabling the add friend option with the SDK](https://developers.line.biz/en/docs/line-login-sdks/android-sdk/link-a-bot/)

发送代码：

```kotlin
val loginIntent: Intent = LineLoginApi.getLoginIntent(
    this,
    CHANNEL_ID_JP,
    LineAuthenticationParams.Builder()
        .scopes(listOf(Scope.PROFILE))
//      .botPrompt(LineAuthenticationParams.BotPrompt.normal)
        .botPrompt(LineAuthenticationParams.BotPrompt.aggressive)
        .build()
)
startActivityForResult(loginIntent, REQUEST_CODE)
```

- onActivityResult

```java
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    // ...
    LineLoginResult result = LineLoginApi.getLoginResultFromIntent(data);
    // 获取和公共号的关系，为true表示添加为好友了
    boolean friendshipStatusChanged = result.getFriendshipStatusChanged();
    // ...
}
```

- 在好友列表可以看到

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694872385048-f7ee3c46-2a03-46f6-8509-75be7daf6d92.png#averageHue=%23fafafa&clientId=ue968084a-874f-4&from=paste&height=362&id=u7d072283&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=199409&status=done&style=none&taskId=uba0e9070-f1d9-4b4b-a7cd-f8c1d2ef523&title=&width=163)

- normal和aggressive区别
  - normal：当前页增加一个item添加好友

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694692032816-05b5eeff-c279-4eb1-b36d-77b2a97fd755.png#averageHue=%23171717&clientId=ue122a660-d196-4&from=paste&height=467&id=ubef1cb0d&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=230181&status=done&style=none&taskId=u5db16213-01bf-42f5-9f8a-de224d27286&title=&width=210)

- aggressive：在新的页面添加好友

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694693399055-2dba1999-7b2d-4cc7-8ca1-a5d41e4280a7.png#averageHue=%23e9e8e8&clientId=ue122a660-d196-4&from=paste&height=369&id=u4e1432cb&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=274976&status=done&style=none&taskId=u8c922a5f-e6dc-4d9d-9e6c-3475a7c11f9&title=&width=166)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694692588300-560f2e3c-0c95-4a82-a6e0-6c333b2ff3fc.png#averageHue=%23151414&clientId=ue122a660-d196-4&from=paste&height=371&id=SKpLI&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=114958&status=done&style=none&taskId=ue69932fb-85e4-481d-a3f5-4de31a5d030&title=&width=167)

## 遇到的问题

### 注意

1. 授权页面点击“取消”或返回时返回的信息中的code值是AUTHENTICATION_AGENT_ERROR，而不是error，引入在官方代码示例上可以添加此case用于判断，为什么不进CANCEL，目前还没搞明白；
2. 包名务必保证正确；
3. 目前官方提供的其他如刷新token接口官方建议不手动去调用，只要后面有在调用接口，token会不断刷新续期；

### 提示：错误，无法正常处理

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694757620379-0edc8dcf-9aec-4d1a-82f0-5fc75e97f0d9.png#averageHue=%232c2b2b&clientId=u033a90f7-f85d-4&from=paste&height=536&id=uac31ece5&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=125734&status=done&style=none&taskId=u7c7b9442-97c2-4af5-a5a7-5feca0bf353&title=&width=241)

- 解决1：检查line后台配置，重点看包名是否正确
- 解决2：检查你的Channel有没有publish

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694757933814-417f828b-f3bb-41e2-a1fa-4adb978504a6.png#averageHue=%23a4a4a4&clientId=u033a90f7-f85d-4&from=paste&height=184&id=udb158588&originHeight=674&originWidth=1772&originalType=binary&ratio=2&rotation=0&showTitle=false&size=124361&status=done&style=none&taskId=u18d18486-c815-4626-8833-b1573b8a82e&title=&width=484)

### Line中国区注册不了账号

1. 挂科学上网
2. 用indonesia可以不用手机号注册，邮箱就可以注册
