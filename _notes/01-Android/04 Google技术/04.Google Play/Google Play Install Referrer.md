---
date created: 2024-04-08 13:52
date updated: 2024-12-24 00:33
dg-publish: true
---

[Play Install Referrer 库  |  Android 开发者  |  Android Developers](https://developer.android.com/google/play/installreferrer/library)

## Google Play Install Referrer

### 什么是 Play Install Referrer？

是安卓专用的广告跟踪标识符。它类似于设备 ID 和设备指纹匹配，是用户点击广告时发送到 Play Store（而非 App Store）的唯一字符串。如果安装了该应用，则会将 referrer 发送给归因合作伙伴，然后该归因合作伙伴会匹配推广渠道和安装，从而归因转化。来自 Install Referrer 的所有数据都位于 Play Store 开发者控制台以及 Google Analytics 中（若已安装）

### 集成

```groovy
dependencies {
    // ...
    implementation "com.android.installreferrer:installreferrer:2.2"
}
```

### 使用

#### 前置条件

1. 安装了 Google Play Store App
2. 有 Google Play Service 服务

#### Getting the install referrer 获取 install referrer 数据/Closing service connection 关闭连接

```kotlin
private fun requestGoogleInstallReferer(
    @Brand brand: String,
    context: Context,
    onFailed: (Throwable) -> Unit,
    onSuccess: (GPIRInfo) -> Unit
) {
    val referrerClient = InstallReferrerClient.newBuilder(context).build()
    val s1 = SystemClock.elapsedRealtime()
    val installReferrerStateListener = object : InstallReferrerStateListener {
        override fun onInstallReferrerSetupFinished(responseCode: Int) {
            when (responseCode) {
                InstallReferrerClient.InstallReferrerResponse.OK -> {
                    val response: ReferrerDetails =
                        try {
                            referrerClient.installReferrer
                        } catch (e: Exception) {
                            Logger.printException(e)
                            onFailed.invoke(e)
                            return
                        }
                    val installReferrer = response.installReferrer
                    // 1、Google 的install参数有效期是90天，如果用户下载后90天之后再打开app，会导致获取不到参数，无法展示下载权益弹窗（这个场景不考虑）
                    if (installReferrer.isNullOrEmpty()) {
                        Logger.e(
                            TAG,
                            "AppOneLinker→requestGoogleInstallReferer failed. cost(GPIR)=${SystemClock.elapsedRealtime() - s1}ms, installReferrer NullOrEmpty, ReferrerDetails=${response.string()}"
                        )
                        onFailed.invoke(GPIRException("0x01installReferrer empty"))
                        return
                    }
                    val params = mutableMapOf<String, String>()
                    try {
                        installReferrer.split('&').forEach { param ->
                            val split = param.split('=')
                            if (split.size == 2) {
                                params[split[0]] = split[1]
                            }
                        }
                    } catch (e: Exception) {
                        Logger.printException(e)
                    }
                    // 断开连接
                    try {
                        referrerClient.endConnection()
                    } catch (e: Exception) {
                        Logger.e(TAG, "AppOneLinker→requestGoogleInstallReferer endConnection error. ${e.message}, ${response.string()}")
                        Logger.printException(e)
                    }
                }

                else -> {
                    Logger.e(TAG, "AppOneLinker→requestGoogleInstallReferer error. InstallReferrerResponse not ok. responseCode=$responseCode")
                    onFailed.invoke(GPIRException("0x05gpir InstallReferrerResponse not ok. responseCode=$responseCode"))
                    // API 不受支持
                    // InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED -> {}
                    // 无法连接到 Play 商店
                    // InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE -> {}
                }
            }
        }

        override fun onInstallReferrerServiceDisconnected() {
            Logger.e(TAG, "AppOneLinker→requestGoogleInstallReferer error. onInstallReferrerServiceDisconnected")
            onFailed.invoke(GPIRException("0x06gpir onInstallReferrerServiceDisconnected"))
        }
    }
    try {
        referrerClient.startConnection(installReferrerStateListener)
    } catch (e: Exception) {
        Logger.e(
            TAG,
            "AppOneLinker→requestGoogleInstallReferer startConnection error. ${e.message}"
        )
        Logger.printException(e)
        onFailed.invoke(GPIRException("0x07gpir startConnection error:${e.message}"))
        return
    }
}
```

### Play Install Referrer 如何模拟测试？

- 准备好要测试的包，先不安装；卸载已有的 Shein app
- 用户通过手机浏览器点击带有 referrer 的 url，[ ](http://play.google.com/store/apps/details?id=com.zzkko&referrer=utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_shein_onelink%3Dhttp%3A%2F%2Fshein.top%2Fm-app-9e9d8f58e6c24ac89314006c46c20d3d) 会跳转到 Google Play 商店的 Shein App 安装页面，**点击安装后取消**（不要直接复制链接在浏览器打开该 url 或浏览器扫码跳转，有的低端手机不会带数据给 GP，可复制链接到备忘录后进行跳转）

> Referrer 就是带给 Google Play 的数据，需要进行一次 Url Encode，Play Install Referrer SDK 取 referer 会进行一次 Url Decode 操作。
> 带有 referrer 的 url 示例：<http://play.google.com/store/apps/details?id=com.zzkko&referrer=utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_shein_onelink%3Dhttp%3A%2F%2Fshein.top%2Fm-app-9e9d8f58e6c24ac89314006c46c20d3d>
> 上面链接 decode 后：
> <http://play.google.com/store/apps/details?id=com.zzkko&referrer=utm_source=google&utm_medium=cpc&utm_shein_onelink=http://shein.top/m-app-9e9d8f58e6c24ac89314006c46c20d3d>
> 对应的短链（utm_shein_onelink 后的链接）：
> <http://shein.top/m-app-9e9d8f58e6c24ac89314006c46c20d3d>

- 然后安装刚刚准备好的测试包
- 打开App，首次启动 App 会通过 Play Install Referrer SDK 的数据，拿到 Install Referer 数据
- 解析 Install Referer 中 utm_shein_onelink 的链接：短链或者 onelink，然后请求中间层接口，拿到 deeplink 跳转落地页并埋点上报

这个 [Google Play 网址构建工具](https://developers.google.com/analytics/devguides/collection/android/v4/campaigns?hl=zh-cn#google-play-url-builder)可以生成带 referrer 的链接

#### 坑

1. 低端的手机（如 Motor Android 7），将带 GPIR 的链接直接在浏览器地址栏输入，然后跳转到 Google Play Store，但并没有拿到 install referer 数据

解决：用记事本复制测试的 gpir 链接，如何点击跳转
