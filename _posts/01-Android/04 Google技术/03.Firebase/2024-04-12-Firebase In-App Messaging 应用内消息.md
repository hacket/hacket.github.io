---
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Wednesday, January 29th 2025, 10:43:31 pm
title: Firebase In-App Messaging 应用内消息
author: hacket
categories:
  - Android
category: Firebase
tags: [Firebase]
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
date created: 2024-06-11 17:34
date updated: 2024-12-24 00:33
aliases: [Firebase In-App Messaging 应用内消息]
linter-yaml-title-alias: Firebase In-App Messaging 应用内消息
---

# Firebase In-App Messaging 应用内消息

- [ ] [Firebase In-App Messaging](https://firebase.google.com/docs/in-app-messaging)

## In-App Messaging 接入

<https://firebase.google.com/docs/in-app-messaging/get-started?authuser=0&platform=android#add_the_sdk_to_your_project>

## [In-App Messaging支持的样式](https://firebase.google.com/docs/in-app-messaging/explore-use-cases?authuser=0)

### Card

![2hxcp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2hxcp.png)

### Modal

![y0yu2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/y0yu2.png)

### Image only

### Banner

## [点击事件的监听](https://firebase.google.com/docs/in-app-messaging/modify-message-behavior?authuser=0&platform=android)

```kotlin
object FirebaseInAppMessagingHelper {

    fun init() {
        val listener = MyClickListener()
        Firebase.inAppMessaging.addClickListener(listener)
    }

    class MyClickListener : FirebaseInAppMessagingClickListener {

        override fun messageClicked(inAppMessage: InAppMessage, action: Action) {
            Log.i(
                "hacket", "messageClicked: inAppMessage=$inAppMessage, action=$action \n" +
                        "url=${action.actionUrl}, metadata=${inAppMessage.campaignMetadata}\n"
            )
            // Determine which URL the user clicked
            val url = action.actionUrl

            // Get general information about the campaign
            val metadata = inAppMessage.campaignMetadata

            // ...
        }
    }
}
```

## Test

### 如何测试？

1. 找到 FID，过滤 TAG 为 `FIAM.Headless`，在 Firebase Console 测试用的到

> Starting InAppMessaging runtime with Installation ID eyAh5czpTKSRH3GnNI5oOd

2. Firebase Console Messaging 找到 In-App

![clmie](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/clmie.png)

3. 配置对应的测试数据

![45bj8](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/45bj8.png)

4. 测试，填写 ID

![0cmn6](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/0cmn6.png)
