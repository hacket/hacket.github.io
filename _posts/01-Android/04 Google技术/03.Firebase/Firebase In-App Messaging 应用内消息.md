---
date created: 2024-06-11 17:34
date updated: 2024-12-24 00:33
dg-publish: true
---

- [ ] [Firebase In-App Messaging](https://firebase.google.com/docs/in-app-messaging)

## In-App Messaging接入

<https://firebase.google.com/docs/in-app-messaging/get-started?authuser=0&platform=android#add_the_sdk_to_your_project>

## [In-App Messaging支持的样式](https://firebase.google.com/docs/in-app-messaging/explore-use-cases?authuser=0)

### Card

![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1693291454137-c74bac26-f2fb-45ee-9549-5af3f37178fd.png#averageHue=%23a19988&clientId=u4e5c5d2f-05f4-4&from=paste&height=478&id=l7TSk&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1588867&status=done&style=none&taskId=uc575caba-8282-45be-8650-eb9536e99aa&title=&width=215)

### Modal

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693289040395-98ee5c0e-d056-4b91-bb33-5f193fa2d684.png#averageHue=%23a8a192&clientId=u4e5c5d2f-05f4-4&from=paste&height=487&id=c1qqO&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=602394&status=done&style=none&taskId=uc427849f-3995-4a7f-ac38-2bd5561b984&title=&width=219)

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

1. 找到FID，过滤TAG为`FIAM.Headless`，在Firebase Console测试用的到

> Starting InAppMessaging runtime with Installation ID eyAh5czpTKSRH3GnNI5oOd

2. Firebase Console Messaging找到In-App

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693292434598-d732e605-0e8f-4f2f-950f-40f2a4b0c87f.png#averageHue=%23a59561&clientId=u4e5c5d2f-05f4-4&from=paste&height=650&id=ue69c651a&originHeight=1300&originWidth=2960&originalType=binary&ratio=2&rotation=0&showTitle=false&size=407495&status=done&style=none&taskId=u0cbaa5e4-38e3-409a-be31-bf8599c3fc3&title=&width=1480)

3. 配置对应的测试数据

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693292472073-c40218d8-6eba-42c9-bb4d-548d31d44157.png#averageHue=%23757469&clientId=u4e5c5d2f-05f4-4&from=paste&height=539&id=ud840b2a4&originHeight=1078&originWidth=2448&originalType=binary&ratio=2&rotation=0&showTitle=false&size=232084&status=done&style=none&taskId=u95ee103f-1ae6-44c9-8912-b65c8eb9e95&title=&width=1224)

4. 测试，填写ID

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693292507922-0e1277c3-dfd8-4a33-b8c4-a144067e01bf.png#averageHue=%23646768&clientId=u4e5c5d2f-05f4-4&from=paste&height=603&id=u645becba&originHeight=1206&originWidth=2282&originalType=binary&ratio=2&rotation=0&showTitle=false&size=214045&status=done&style=none&taskId=u2b7f683a-bce9-4f95-be37-d523c17c5d8&title=&width=1141)
