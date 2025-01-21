---
date_created: Friday, April 19th 2024, 10:45:19 pm
date_updated: Wednesday, January 22nd 2025, 12:07:41 am
title: in-app-review 应用内评价
author: hacket
categories:
  - Android
category: GooglePlay
tags: [GooglePlay]
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
date created: 2024-04-19 15:51
date updated: 2024-12-24 00:33
aliases: [in-app-review 应用内评价]
linter-yaml-title-alias: in-app-review 应用内评价
---

# in-app-review 应用内评价

`Google Play In-App Review` API 可让您提示用户提交 Play 商店评分和评论，而无需离开您的应用或游戏。

一般来说，` in-app review` 流程（见下图）可以在应用的整个用户旅程中随时触发。在此流程中，用户可以使用 1 到 5 星系统对您的应用程序进行评分，并添加可选评论。提交后，评论将发送到 Play 商店并最终显示。

为了保护用户隐私并避免 API 滥用，您的应用程序应遵循有关何时请求应用程序内评论以及评论提示设计的严格准则，见 [[#何时请求 in-app review？]]。

![|900](https://developer.android.com/static/images/google/play/in-app-review/iar-flow.jpg)

## 要求

- 运行 Android 5.0（API 级别 21）或更高版本并安装了 Google Play 商店的 Android 设备（手机和平板电脑）。
- 要在您的应用中集成应用内评论，您的应用必须使用 Play Core 库的 1.8.0 或更高版本。

## 何时请求 in-app review？

请遵循以下指南来帮助您决定何时向用户请求 `in-app reviews`：

- 当用户充分体验您的应用或游戏并提供有用的反馈后，触发 `in-app review` 流程
- 不要过度提示用户进行 `review`，此方法有助于最大程度地减少用户的挫败感并限制 API 使用（请参阅有关配额的部分）
- 您的应用程序不应在呈现评级按钮或卡片之前或同时询问用户任何问题，包括有关他们意见的问题（例如 " 您喜欢该应用程序吗？"）或预测性问题（例如 " 您会给这个应用程序打 5 星吗？" "）。

## 设计指南

在确定如何将应用内评论集成到您的应用中时，请遵循以下准则：

- 按原样显示卡片，不得以任何方式篡改或修改现有设计，包括尺寸、不透明度、形状或其他属性。
- 请勿在卡片顶部或卡片周围添加任何覆盖层。
- 卡片和卡片的背景应该位于最顶层。一旦卡出现，请勿以编程方式移除该卡。该卡会根据用户的明确操作或内部 Play 商店机制自动删除。

## Quotas 配额

为了提供出色的用户体验，Google Play 对向用户显示审阅对话框的频率强制执行有时限的配额。由于此配额，在短时间内（例如，不到一个月）多次调用 `launchReviewFlow` 方法可能并不总是显示对话框。

> 注意：配额的具体值是一个实施细节，Google Play 可以更改该值，恕不另行通知。

由于配额可能会发生变化，因此应用您自己的逻辑并瞄准请求审核的最佳时机非常重要。例如，您不应该使用号召性用语选项（例如按钮）来触发 API，因为用户可能已经达到了配额，并且不会显示流程，从而给用户带来糟糕的体验。对于此用例，请将用户重定向到 Play 商店。

## 集成 in-app reviews (Kotlin)

```kotlin
// In your app’s build.gradle.kts file:
...
dependencies {
    // This dependency is downloaded from the Google’s Maven repository.
    // So, make sure you also include that repository in your project's build.gradle file.
    implementation("com.google.android.play:review:2.0.1")

    // For Kotlin users also import the Kotlin extensions library for Play In-App Review:
    implementation("com.google.android.play:review-ktx:2.0.1")
    // ...
}
```

- 创建 `ReviewManager`：

`ReviewManager` 是让您的应用启动应用内审核流程的界面

```kotlin
val manager = ReviewManagerFactory.create(context)
```

- 请求 `ReviewInfo` 对象：

```kotlin
val request = manager.requestReviewFlow()
request.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        // We got the ReviewInfo object
        val reviewInfo = task.result
    } else {
        // There was some problem, log or handle the error code.
        @ReviewErrorCode val reviewErrorCode = (task.getException() as ReviewException).errorCode
    }
}
```

注意： `ReviewInfo` 对象仅在有限的时间内有效。您的应用应提前（预缓存）请求 `ReviewInfo` 对象，但前提是您确定您的应用将启动 `in-app review` 流程。

- 启动 `in-app review` 流程：

使用 `ReviewInfo` 实例启动应用内审核流程。等到用户完成应用内审核流程后，您的应用程序才会继续其正常用户流程（例如进入下一个级别）。

```kotlin
val flow = manager.launchReviewFlow(activity, reviewInfo)
flow.addOnCompleteListener { _ ->
    // The flow has finished. The API does not indicate whether the user
    // reviewed or not, or even whether the review dialog was shown. Thus, no
    // matter the result, we continue our app flow.
}
```

重要提示：如果在应用内审核流程中发生错误，请勿通知用户或更改应用的正常用户流程。调用 `onComplete` 后继续应用的正常用户流程。

- Test in-app reviews

[测试应用内评价  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/in-app-review/test)

## 集成 `in-app reviews` native（C/C++）

[集成应用内评价（原生）  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/in-app-review/native)

# Ref

- [Google Play 应用内评价 API  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/in-app-review?hl=zh-cn)
- [ ] ["一篇就够"系列：GooglePlay 应用内评价，应用内更新](https://juejin.cn/post/7202049817206505509)
