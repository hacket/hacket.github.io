---
date created: 2024-09-14 00:15
date updated: 2024-12-24 00:35
dg-publish: true
---

## kakao介绍

Kakao为韩国最大通讯公司

## [Kakao Login Android集成](https://developers.kakao.com/docs/latest/en/android/getting-started#install)

Android集成文档：<br /><https://developers.kakao.com/docs/latest/en/kakaologin/android>

### MyApplication设置

#### App Key获取

<https://developers.kakao.com/console/app><br />`[My Application] > [App Keys] or [My Application] > [Summary]`<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702880346833-2af6cf59-4181-4f36-a138-4ee6f90e80fc.png#averageHue=%23111211&clientId=u9ad79290-392f-4&from=paste&height=328&id=ue2da1b79&originHeight=900&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151357&status=done&style=none&taskId=u101934f7-1894-438f-a910-243f5465f04&title=&width=583)<br />APP关注`Native app key`

#### Platform设置

以Android为例：

- Packagename ：应用的包名，即applicationId，**必选**
- Market URL：应用市场链接，填上包名自动填写
- key hash：应用签名，需要用命令生成：`keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703127745297-c7f68211-2e35-41de-b3f1-25dc44423fb7.png#averageHue=%23e93e2f&clientId=u89b0f4a5-9353-4&from=paste&height=297&id=UHE2f&originHeight=1608&originWidth=2920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=306898&status=done&style=none&taskId=u2858a97d-b916-4d43-8954-792a3cfbf7a&title=&width=539)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703144941771-11495c7f-c4ed-44ce-8c37-2c536d050a26.png#averageHue=%23cbcaca&clientId=u89b0f4a5-9353-4&from=paste&height=360&id=ufe0f603c&originHeight=795&originWidth=1180&originalType=binary&ratio=2&rotation=0&showTitle=false&size=133132&status=done&style=none&taskId=u3617762d-19f6-480d-bcc9-5f7f158853e&title=&width=534)

#### Kakao Login

##### Kakao Login Activation

需要开启Kakao Login Activation，否则获取不到AccessToken<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703224217948-d1e8afb2-c170-4e43-8c33-9380cb41cdba.png#averageHue=%23fffdfc&clientId=ud2319ae7-93e2-4&from=paste&height=285&id=u3aaad4a1&originHeight=569&originWidth=1102&originalType=binary&ratio=2&rotation=0&showTitle=false&size=102748&status=done&style=none&taskId=u9ecf68d6-0af6-49c8-84b8-bf0006cee41&title=&width=551)

##### OpenID Connect Activation

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703211407622-fca8de2c-1e9d-4e16-8d9e-a19d2ca5cb93.png#averageHue=%239d9c9c&clientId=u6203a0fe-0812-4&from=paste&height=286&id=QP0TJ&originHeight=1334&originWidth=2604&originalType=binary&ratio=2&rotation=0&showTitle=false&size=276822&status=done&style=none&taskId=uf0a9ac20-c967-4d4e-b4cc-a8de79077ab&title=&width=559)

##### Consent Items

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703146480585-f35441d8-8e62-4aa4-ac50-e5e817b7f07e.png#averageHue=%23cccccc&clientId=u89b0f4a5-9353-4&from=paste&height=348&id=ua2957248&originHeight=1826&originWidth=2630&originalType=binary&ratio=2&rotation=0&showTitle=false&size=394348&status=done&style=none&taskId=ud3e50c80-bb53-42f9-8463-9f19522a753&title=&width=501)<br />右上角可以preview：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703146490434-7ce451d7-ed47-4ffd-a84f-b0474b85af56.png#averageHue=%23f8f7ed&clientId=u89b0f4a5-9353-4&from=paste&height=352&id=u694beffd&originHeight=1388&originWidth=924&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140373&status=done&style=none&taskId=u1bb9f9a1-1a4c-4e52-b5e1-57032521466&title=&width=234)

### 初始化

```kotlin
class GlobalApplication : Application() {
  override fun onCreate() {
    super.onCreate()
    // Other codes for initialization 

    // Initialize Android SDK 
    KakaoSdk.init(this, "${YOUR_NATIVE_APP_KEY}")
  }
}
```

### [Before you begin login](https://developers.kakao.com/docs/latest/en/kakaologin/android#before-you-begin)

Before using Kakao Login APIs with the Android SDK,

1. [Register the Android platform](https://developers.kakao.com/docs/latest/en/getting-started/app#platform).
2. [Add modules](https://developers.kakao.com/docs/latest/en/kakaologin/android#add-modules).
3. [Set Redirect URI](https://developers.kakao.com/docs/latest/en/kakaologin/android#set-redirect-uri).

#### [Register the Android platform](https://developers.kakao.com/docs/latest/en/getting-started/app#platform)

KaKao注册平台登记后才能使用：`[My Application] > [Platform] > Android/iOS/Web`<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702880717172-8d09a017-3c0f-4f9f-9617-0386544dfe7e.png#averageHue=%23f6f6f9&clientId=u9ad79290-392f-4&from=paste&height=372&id=ubc7b677d&originHeight=1010&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112944&status=done&style=none&taskId=ufe51809b-7d23-430b-a394-0d91d63c205&title=&width=589)

- Package Name 应用的applicationId
- Market URL 自动会生成
- [Key hash](https://developers.kakao.com/docs/latest/en/android/getting-started#before-you-begin-add-key-hash)

> keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64
> 类似：8tG0AIdXBAyX5aN8w83ECrKYMxxx

示例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702880508563-32d95e5d-cc5e-4603-b702-30cb284e924e.png#averageHue=%23cacaca&clientId=u9ad79290-392f-4&from=paste&height=397&id=u851a0995&originHeight=1692&originWidth=2512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=354087&status=done&style=none&taskId=u386677e1-815d-493f-90bb-29dfdaa4df1&title=&width=590)

#### [add modules](https://developers.kakao.com/docs/latest/en/kakaologin/android#add-modules)

##### [Gradle Install](https://developers.kakao.com/docs/latest/en/android/getting-started#install-set-gradle)

```groovy
// app build.gradle
// Allprojects not available in the latest Android Studio
allprojects {    
    repositories {        
        google()        
        jcenter()        
        maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/'}    
    }
}


// settings.gradle
dependencyResolutionManagement {    
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)    
        repositories {        
            google()        
            mavenCentral()        
            maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }    
    }
}

// modules to the build.gradle(module-level) file.
dependencies {
  implementation "com.kakao.sdk:v2-all:2.18.0" // Add all modules (Available in 2.11.0 or higher)

  implementation "com.kakao.sdk:v2-user:2.18.0" // Kakao Login
  implementation "com.kakao.sdk:v2-talk:2.18.0" // Kakao Talk Social, Kakao Talk Messaging
  implementation "com.kakao.sdk:v2-friend:2.18.0" // Friend picker
  implementation "com.kakao.sdk:v2-share:2.18.0" // Kakao Talk Sharing
  implementation "com.kakao.sdk:v2-navi:2.18.0" // Kakao Navi 
  implementation "com.kakao.sdk:v2-cert:2.18.0" // Kakao Certificate
}
```

##### [ProGuard rules](https://developers.kakao.com/docs/latest/en/android/getting-started#project-pro-guard)

```properties
# kakao https://developers.kakao.com/docs/latest/en/android/getting-started#project-pro-guard
-keep class com.kakao.sdk.**.model.* { <fields>; }
-keep class * extends com.google.gson.TypeAdapter

# https://github.com/square/okhttp/pull/6792
-dontwarn org.bouncycastle.jsse.**
-dontwarn org.conscrypt.*
-dontwarn org.openjsse.**
```

#### [Set Redirect URI](https://developers.kakao.com/docs/latest/en/kakaologin/android#set-redirect-uri)

refscheme填`kakao${YOUR_NATIVE_APP_KEY}`

```xml
<activity
    android:name="com.kakao.sdk.auth.AuthCodeHandlerActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!-- Redirect URI: "kakao${YOUR_NATIVE_APP_KEY}://oauth" -->
        <data
            android:host="oauth"
            android:scheme="kakaob70bd3c3f3cdab01ccfe4cdd7f80542b" />
    </intent-filter>
</activity>
```

### [Login](https://developers.kakao.com/docs/latest/en/kakaologin/android#login)

代码：

```kotlin
object KaKaoLoginHelper {

    private const val TAG = "KaKaoLogin"

    // 测试的app key
    private const val APP_KEY = "b70bd3c3f3cdab01ccfe4cdd7f80542b"

    fun init(context: Context) {
        KakaoSdk.init(context, APP_KEY)
    }

    /**
     * Check if KakaoTalk is installed on user's device
     *
     * @return true if KakaoTalk is installed on user's device, false otherwise
     */
    fun isKakaoTalkLoginAvailable(context: Context): Boolean {
        return UserApiClient.instance.isKakaoTalkLoginAvailable(context = context)
    }

    /**
     * Login with Kakao Account/KakaoTalk
     */
    fun login(context: Context, callback: (User?, Throwable?) -> Unit) {
        // Login common callback
        val internalCallback: (OAuthToken?, Throwable?) -> Unit = { token, error ->
            if (error != null) {
                // 登录过程中发生错误
                loge("login 登录过程中发生错误：${error.message}", error)
                error.printStackTrace()
                callback.invoke(null, error)
            } else if (token != null) {
                // 登录成功，token 包含了访问令牌

                Log.i(TAG, "login 登录成功，开始检索用户信息，token 包含了访问令牌：$token")
                // 检索用户信息
                getUserInfo { user: User?, throwable: Throwable? ->
                    if (throwable != null) {
//                        loge("login 登录成功，获取用户信息失败：${throwable.message}", throwable)
                        throwable.printStackTrace()
                        callback.invoke(null, throwable)
                    } else if (user != null) {
//                        logi("login 登录成功，检索用户信息成功，user(${user.id})：$user")
                        callback.invoke(user, null)
                    }
                }
            }
        }
        // If Kakao Talk is installed on user's device, proceed to log in with Kakao Talk. Otherwise, implement to log in with Kakao Account.
        if (isKakaoTalkLoginAvailable(context)) {
            logd("login with KakaoTalk")
            UserApiClient.instance.loginWithKakaoTalk(context) { token, error ->
                if (error != null) {
                    // After installing Kakao Talk, if a user does not complete app permission and cancels Login with Kakao Talk, skip to log in with Kakao Account, considering that the user does not want to log in.
                    // You could implement other actions such as going back to the previous page.
                    if (error is ClientError && error.reason == ClientErrorCause.Cancelled) {
                        loge("login with KakaoTalk failed cancelled: ${error.message}", error)
                        return@loginWithKakaoTalk
                    }
                    loge(
                        "login with KakaoTalk failed, attempt loginWithKakaoAccount, error: ${error.message}",
                        error
                    )

                    // If a user is not logged into Kakao Talk after installing Kakao Talk and allowing app permission, make the user log in with Kakao Account.
                    UserApiClient.instance.loginWithKakaoAccount(
                        context,
                        callback = internalCallback,
                    )
                } else if (token != null) {
                    logd("login with KakaoTalk succeeded, accessToken=${token.accessToken}")
                    internalCallback.invoke(token, null)
                }
            }
        } else {
            logd("login with KakaoAccount")
            UserApiClient.instance.loginWithKakaoAccount(context, callback = internalCallback)
        }
    }

    fun loginWithKakaoTalk(context: Context, callback: (User?, Throwable?) -> Unit) {
        // Login with Kakao Talk
        UserApiClient.instance.loginWithKakaoTalk(context) { token, error ->
            if (error != null) {
                loge("loginWithKakaoTalk failed.", error)
                callback.invoke(null, error)
            } else if (token != null) {
                logi("loginWithKakaoTalk succeeded.${token.accessToken}")
                // 检索用户信息
                getUserInfo { user: User?, throwable: Throwable? ->
                    if (throwable != null) {
                        // 获取用户信息失败
//                        loge("loginWithKakaoTalk 登录成功，获取用户信息失败：${throwable.message}", throwable)
                        throwable.printStackTrace()
                        callback.invoke(null, throwable)
                    } else if (user != null) {
//                        logi("loginWithKakaoTalk 登录成功，检索用户信息成功，user(${user.id})：$user")
                        callback.invoke(user, null)
                    }
                }
            }
        }
    }

    fun loginWithKakao(context: Context, callback: (User?, Throwable?) -> Unit) {
        UserApiClient.instance.loginWithKakaoAccount(context) { token, error ->
            if (error != null) {
                // 登录过程中发生错误
                loge("loginWithKakao 登录过程中发生错误：${error.message}", error)
                error.printStackTrace()
                callback.invoke(null, error)
            } else if (token != null) {
                // 登录成功，token 包含了访问令牌

//                logi("loginWithKakao 登录成功，开始检索用户信息，token 包含了访问令牌：$token")
                // 检索用户信息
                getUserInfo { user: User?, throwable: Throwable? ->
                    if (throwable != null) {
//                        loge("loginWithKakao 登录成功，获取用户信息失败：${throwable.message}", throwable)
                        throwable.printStackTrace()
                        callback.invoke(null, throwable)
                    } else if (user != null) {
//                        logi("loginWithKakao 登录成功，检索用户信息成功，user(${user.id})：$user")
                        callback.invoke(user, null)
                    }
                }
            }
        }
    }

    /**
     * Retrieve user information
     *
     * https://developers.kakao.com/docs/latest/en/kakaologin/android#req-user-info
     */
    fun getUserInfo(callback: (User?, Throwable?) -> Unit = { _, _ -> }) {
        UserApiClient.instance.me { user: User?, throwable: Throwable? ->
            if (throwable != null) {
                // 获取用户信息失败
                loge("getUserInfo 登录成功，获取用户信息失败：${throwable.message}", throwable)
                throwable.printStackTrace()
                callback.invoke(null, throwable)
            } else if (user != null) {
                // 获取用户信息成功，这里可以处理用户信息
                logi("getUserInfo 登录成功，检索用户信息成功，user(${user.id})：$user")
                callback.invoke(user, null)
            }
        }
    }

    /**
     * Retrieve token information
     *
     * https://developers.kakao.com/docs/latest/en/kakaologin/android#get-token-info
     */
    fun accessTokenInfo(callback: (tokenInfo: AccessTokenInfo?, error: Throwable?) -> Unit) {
        // However, note that the return value true does not guarantee that the user is in a logged-in state.
        if (AuthApiClient.instance.hasToken()) {
            UserApiClient.instance.accessTokenInfo { tokenInfo, error ->
                if (error != null) {
                    loge("accessTokenInfo Failed to retrieve token information.", error)
                } else if (tokenInfo != null) {
                    logi(
                        "accessTokenInfo Retrieving token information success" +
                                "\n App ID: ${tokenInfo.appId}" +
                                "\nService user ID: ${tokenInfo.id}" +
                                "\nValidity period: ${tokenInfo.expiresIn} seconds"
                    )
                }
                callback.invoke(tokenInfo, error)
            }
        } else {
            loge("accessTokenInfo Failed to retrieve token information. No token.")
            callback.invoke(null, null)
        }
    }

    /**
     * Logout, Regardless of the result of the logout request, the Android SDK deletes the access and refresh tokens and has the login session end.
     *
     * deletes the access and refresh tokens issued to the user.
     *
     * https://developers.kakao.com/docs/latest/en/kakaologin/android#logout
     */
    fun logout(callback: (Throwable?) -> Unit) {
        UserApiClient.instance.logout { error ->
            if (error != null) {
                loge("Logout failed: ${error.message}", error)
                callback.invoke(error)
            } else {
                logi("Logout succeeded")
                callback.invoke(null)
            }
        }
    }

    /**
     * Unlink
     *
     * If the request is successful, the Android SDK deletes the access and refresh tokens. As the issued tokens are deleted, the session between an app and a user is disconnected, and the user is logged out and unlinked from your app.
     *
     * https://developers.kakao.com/docs/latest/en/kakaologin/android#unlink
     */
    fun unlink(callback: (error: Throwable?) -> Unit) {
        UserApiClient.instance.unlink { error ->
            callback.invoke(error)
            if (error != null) {
                loge("Unlink fail", error)
            } else {
                logi("Unlink success. Tokens are deleted from SDK.")
            }
        }
    }

    fun loge(msg: String, e: Throwable? = null) {
        Log.e(TAG, msg, e)
    }

    fun logi(msg: String) {
        Log.i(TAG, msg)
    }

    fun logd(msg: String) {
        Log.d(TAG, msg)
    }
}
```

kakao登录授权弹窗<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702880017423-03eebdeb-b687-4bfe-8596-9cf92ed380e7.png#averageHue=%238d8d8d&clientId=u9ad79290-392f-4&from=paste&height=602&id=u76ebeb0d&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=135691&status=done&style=none&taskId=u4bb3a56d-ec6f-4642-b4ba-42829541ff4&title=&width=271)

1. 拿到access_token会拿到userid
2. 拿userid给中间层登录

## 遇到的问题

### 管理员设置问题导致授权不了

没有开启kakao登录<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702879898157-625026b8-835d-4509-89dc-f97082f7833d.png?x-oss-process=image/format,png#averageHue=%23faf9f9&clientId=ub02a43ff-3c7b-4&from=paste&height=687&id=ua0249291&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=10368850&status=done&style=none&taskId=u5a39b5ad-5fff-4d0f-bca7-5c7a60ad3fe&title=&width=309)<br />解决：kakao应用后台开启<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702879896897-d49218e9-dde3-4ee1-8c90-ad14891795c2.png#averageHue=%23b2b1b1&clientId=ub02a43ff-3c7b-4&from=paste&height=274&id=u95ccd916&originHeight=1084&originWidth=2062&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171166&status=done&style=none&taskId=u09ee3a49-2078-47b0-aa30-34c7ca36e2f&title=&width=522)

### Error due to incorrect platform information：invalid android_key_hash or ios_bundle_id or web_site_url

解决：[错误：invalid android_key_hash or ios_bundle_id or web_site_url](https://developers.kakao.com/docs/latest/en/getting-started/app#platform)<br />应用设置后台看看有没有注册对应的登录平台

# Kakao SDK 评估

## 背景

亚洲站点、韩国市场，添加三方登录Kakao

## 版本分析

新接入的sdk，没有历史接入版本

## 影响范围

新功能，功能异常情况下会影响到Kakao用户的三方登录，需要做abt降级

## 价值评估

提升亚洲站点、韩国市场用户登录转化率

## 影响评估

### App质量

- github没有相关仓库
- 最新版本的SDK，App质量暂时没办法验证，接入到测试的Monkey流程来测试稳定性，上线需观察， 发现有不可控的Crash问题需要abt降级

### 性能

待测试

### 包大小

aar大小(com.kakao.sdk:v2-user:2.18.0)：342K

1. user 103K
2. network 22K
3. common 90K
4. auth 127K

### 兼容性

- Kakao的sdk最低版本：Android6.0及以上；而shein/romwe app最低兼容版本是Android5.0
- 其他兼容问题待测试

### 业务功能影响

新功能，功能异常情况下会影响到Kakao用户的三方登录，需要做abt降级

## 技术方案评估

### UI、UE

无影响

### 接口

无影响

### 效果监控

不实施

## 风险评估

### 电子应用市场审核规则风险评估

待评估

### 安全评估

- 获取用户的email, phone，隐私协议是否需要更新？

### 降级方案

隐藏Kakao登录方式
