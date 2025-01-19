---
date created: 2024-12-24 00:33
date updated: 2024-12-27 13:48
dg-publish: true
---

# Firebase Analytics

## Firebase Analytics 集成

```java
implementation 'com.google.firebase:firebase-analytics-ktx'

import com.google.firebase.analytics.FirebaseAnalytics

class MyApplication : Application() {
    lateinit var firebaseAnalytics: FirebaseAnalytics

    override fun onCreate() {
        super.onCreate()
        firebaseAnalytics = FirebaseAnalytics.getInstance(this)
    }
}

```

## Firebase Analytics 测试

### 实时调试（推荐）

#### 测试代码

```kotlin
val firebaseAnalytics = FirebaseAnalytics.getInstance(this)

// 模拟用户加入购物车的商品数据
val bundle = Bundle().apply {
    putString(FirebaseAnalytics.Param.ITEM_ID, "12345") // 商品 ID
    putString(FirebaseAnalytics.Param.ITEM_NAME, "Smartphone X") // 商品名称
    putString(FirebaseAnalytics.Param.ITEM_CATEGORY, "Electronics") // 商品分类
    putString(FirebaseAnalytics.Param.ITEM_VARIANT, "Black") // 商品变种
    putDouble(FirebaseAnalytics.Param.PRICE, 699.99) // 商品价格
    putString(FirebaseAnalytics.Param.CURRENCY, "USD") // 货币
}

// 记录 ADD_TO_CART 事件
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.ADD_TO_CART, bundle)
```

#### **启用调试模式：**

如果你在开发和调试阶段，希望实时查看事件是否被记录，可以启用调试模式。
在命令行通过 `adb` 命令启动调试模式：

```shell
adb shell setprop debug.firebase.analytics.app <YOUR_PACKAGE_NAME>
```

替换 `<YOUR_PACKAGE_NAME>` 为你的应用包名（例如，`com.example.myapp`）。

#### **使用调试视图查看实时事件：**

- 进入 [Firebase 控制台](https://console.firebase.google.com/)。
- 选择你的 Firebase 项目。
- 在左侧导航栏中，点击 **Analytics -> DebugView**。
- 打开你的应用，开始执行“`ADD_TO_Cart`”操作。如果记录成功，你将在 Firebase 控制台中实时看到 `ADD_TO_CART` 事件及其参数。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241227134836.png)

#### 完成调试后，可禁用调试模式：

```shell
adb shell setprop debug.firebase.analytics.app .none.
```

### Ref

DebugView 实时查看埋点及页面数据<https://firebase.google.com/docs/analytics/debugview?hl=zh-cn#enabling_debug_mode>
