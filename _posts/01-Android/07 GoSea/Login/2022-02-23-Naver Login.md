---
date_created: Friday, February 23rd 2022, 10:10:45 pm
date_updated: Wednesday, January 22nd 2025, 12:49:12 am
title: Naver Login
author: hacket
categories:
  - Android进阶
category: 出海
tags: [出海, 登录]
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
date created: 2024-09-14 00:15
date updated: 2024-12-24 00:35
aliases: [Naver 集成文档]
linter-yaml-title-alias: Naver 集成文档
---

# Naver 集成文档

Naver 为韩国最大搜索引擎公司<br /><https://developers.naver.com/main/>

## Naver Login 注册和引入

集成文档：<https://developers.naver.com/docs/login/android/android.md>

### My Application 注册

My Application 注册：<https://developers.naver.com/apps/#/wizard/register?auth=true><br />记录：`OAUTH_CLIENT_ID`、`OAUTH_CLIENT_SECRET`、`OAUTH_CLIENT_NAME`<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702905480179-7b32df6f-e406-4b47-a52b-18b5accf3f9e.png#averageHue=%23fbfbfb&clientId=ua9d001ed-b3f1-4&from=paste&height=218&id=ua26a37f3&originHeight=968&originWidth=2808&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151126&status=done&style=none&taskId=u8a23cd89-8694-41b1-aca2-989206dd53f&title=&width=632)

### [Gradle引入](https://developers.naver.com/docs/login/android/android.md#3--%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95)

```groovy
// groovy
implementation 'com.navercorp.nid:oauth:5.9.0' // jdk 11
implementation 'com.navercorp.nid:oauth-jdk8:5.9.0' // jdk 8

// kts
implementation("com.navercorp.nid:oauth:5.9.0") // jdk 11
implementation("com.navercorp.nid:oauth-jdk8:5.9.0") // jdk 8
```

## Login 代码

### initialize

```kotlin
fun init(context: Context) {
    NaverIdLoginSDK.initialize(context, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_CLIENT_NAME)
}
```

### Login in

登录分为 2 种方式：

- NidOAuthLoginButton
- NaverIdLoginSDK.authenticate()

#### [NidOAuthLoginButton](https://developers.naver.com/docs/login/android/android.md#5-1--nidoauthloginbutton-%EA%B0%9D%EC%B2%B4%EB%A1%9C-%EB%B2%84%ED%8A%BC-%EC%B6%94%EA%B0%80)

1. xml

```xml
<com.navercorp.nid.oauth.view.NidOAuthLoginButton
      android:id="@+id/buttonOAuthLoginImg"
      android:layout_width="wrap_content"
      android:layout_height="50dp" />
```

2. code

```kotlin
binding.buttonOAuthLoginImg.setOAuthLogin(launcher)
// OR
binding.buttonOAuthLoginImg.setOAuthLogin(oauthLoginCallback)
```

#### NaverIdLoginSDK.authenticate()

```kotlin
object NaverHelper {

    private const val TAG = "hacket.naver"

    const val OAUTH_CLIENT_ID = "AEhmbl_uDX5pCOSIIRiq"
    const val OAUTH_CLIENT_SECRET = "VGZ5lyXLUv"
    const val OAUTH_CLIENT_NAME = "KingAssistant"

    fun init(context: Context) {
        NaverIdLoginSDK.showDevelopersLog(BuildConfig.DEBUG)
        NaverIdLoginSDK.initialize(context, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_CLIENT_NAME)
    }

    fun login(
        context: Context,
        onSuccess: (NaverLoginAuthInfo?, NidProfile?) -> Unit = { _, _ -> },
        onFailure: (String?, String?) -> Unit = { _, _ -> }
    ) {
        val oauthLoginCallback = object : OAuthLoginCallback {
            override fun onSuccess() {
                // 네이버 로그인 인증이 성공했을 때 수행할 코드 추가
                getProfile(
                    {
                        val loginAuthInfo = getLoginAuthInfo()
                        onSuccess.invoke(loginAuthInfo, it)
                    }
                ) { err, msg ->
                    onFailure.invoke(err.toString(), msg)
                }
            }

            override fun onFailure(httpStatus: Int, message: String) {
                val errorCode = NaverIdLoginSDK.getLastErrorCode().code
                val errorDescription = NaverIdLoginSDK.getLastErrorDescription()
                Toast.makeText(
                    context,
                    "errorCode:$errorCode, errorDesc:$errorDescription",
                    Toast.LENGTH_SHORT,
                ).show()
                onFailure.invoke(errorCode, errorDescription)
            }

            override fun onError(errorCode: Int, message: String) {
                onFailure(errorCode, message)
            }
        }
        NaverIdLoginSDK.authenticate(context, oauthLoginCallback)
    }

    fun getLoginAuthInfo(): NaverLoginAuthInfo {
        return NaverLoginAuthInfo(
            NaverIdLoginSDK.getAccessToken(),
            NaverIdLoginSDK.getRefreshToken(),
            NaverIdLoginSDK.getExpiresAt(),
            NaverIdLoginSDK.getTokenType(),
            NaverIdLoginSDK.getState(),
        )
    }

    /**
     * Profile API call
     *
     * https://developers.naver.com/docs/login/android/android.md#9--%ED%94%84%EB%A1%9C%ED%95%84-api-%ED%98%B8%EC%B6%9C
     */
    fun getProfile(
        onSuccess: (NidProfile?) -> Unit = {},
        onFailure: (Int, String) -> Unit = { _, _ -> }
    ) {
        NidOAuthLogin().callProfileApi(object : NidProfileCallback<NidProfileResponse> {
            override fun onError(errorCode: Int, message: String) {
                onFailure(errorCode, message)
            }

            override fun onFailure(httpStatus: Int, message: String) {
                onFailure(httpStatus, message)
            }

            override fun onSuccess(result: NidProfileResponse) {
                onSuccess(result.profile)
            }
        })
//  返回的是Map结构
//        NidOAuthLogin().getProfileMap(nidProfileCallback)
    }

    /**
     *  Log out
     *
     *  When the method is called, the token stored on the client is deleted
     *
     *  如果网络不行的只会删除本地的token
     *
     * https://developers.naver.com/docs/login/android/android.md#7--%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
     */
    fun logout() {
        NaverIdLoginSDK.logout()
    }

    /**
     * Unlink
     *
     * When you unlink, both the tokens stored on the client and the tokens stored on the server will be deleted.
     *
     * 会删除本地和服务器的token
     *
     * https://developers.naver.com/docs/login/android/android.md#8--%EC%97%B0%EB%8F%99-%ED%95%B4%EC%A0%9C
     */
    fun unlink(
        onSuccess: () -> Unit = {},
        onFailure: (Int, String) -> Unit = { _, _ -> }
    ) {
        NidOAuthLogin().callDeleteTokenApi(object : OAuthLoginCallback {
            override fun onSuccess() {
                // 서버에서 토큰 삭제에 성공한 상태입니다.
                onSuccess.invoke()
            }

            override fun onFailure(httpStatus: Int, message: String) {
                // 서버에서 토큰 삭제에 실패했어도 클라이언트에 있는 토큰은 삭제되어 로그아웃된 상태입니다.
                // 클라이언트에 토큰 정보가 없기 때문에 추가로 처리할 수 있는 작업은 없습니다.
                onFailure(httpStatus, message)
                loge("errorCode: ${NaverIdLoginSDK.getLastErrorCode().code}: ${NaverIdLoginSDK.getLastErrorDescription()}")
            }

            override fun onError(errorCode: Int, message: String) {
                // 서버에서 토큰 삭제에 실패했어도 클라이언트에 있는 토큰은 삭제되어 로그아웃된 상태입니다.
                // 클라이언트에 토큰 정보가 없기 때문에 추가로 처리할 수 있는 작업은 없습니다.
                onFailure(errorCode, message)
            }
        })
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

data class NaverLoginAuthInfo(
    val accessToken: String?,
    val refreshToken: String?,
    val expire: Long?,
    val type: String?,
    val state: NidOAuthLoginState?,
)
```

- `NaverIdLoginSDK.authenticate()` 获取到 accessToken
- 通过 `callProfileApi` 获取到 NidProfile 的 id，传给中间层登录

# Naver SDK 评估

## 背景

亚洲站点、韩国市场，添加三方登录 Naver

## 版本分析

新接入的 sdk，没有历史接入版本

## 影响范围

新功能，功能异常情况下会影响到 Naver 用户的三方登录，需要做 abt 降级

## 价值评估

提升亚洲站点、韩国市场用户登录转化率

## 影响评估

### App 质量

- 存在 4 个 bug 相关的 issues

[Naver 5.9.0 存在的issues](https://github.com/naver/naveridlogin-sdk-android/issues)

- 未发现有 ANR 的 issues

### 性能

待测试

### 包大小

- aar 大小 (`com.navercorp.nid:oauth:5.9.0`) 226KB

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703320107066-ef39304b-024b-4f97-bb7b-9153affa36ed.png#averageHue=%23f8f8f8&clientId=uc5255f85-2aed-4&from=paste&height=237&id=ACHB9&originHeight=1082&originWidth=1664&originalType=binary&ratio=2&rotation=0&showTitle=false&size=196551&status=done&style=none&taskId=ua31e0ed9-8d0b-4b3b-b767-aa283674d77&title=&width=364)

- 文档很久未更新，国际化适配做的不好

### 兼容性

- SDK 最低版本兼容到 21，和 shein app 最低版本一致
- 其他兼容问题待测试

### 业务功能影响

新功能，功能异常情况下会影响到 Naver 用户的三方登录，需要做 abt 降级

## 技术方案评估

### 6.1 UI、UE

无影响

### 6.2 接口

无影响

### 6.3 效果监控

不实施

## 风险评估

### 7.1 电子应用市场审核规则风险评估

待评估

### 7.2 安全评估

- 获取用户的 email, phone，隐私协议是否需要更新？

### 7.3 降级方案

隐藏 Naver 登录方式
