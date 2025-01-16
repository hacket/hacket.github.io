---
date created: 2024-04-08 13:49
date updated: 2024-12-24 00:33
dg-publish: true
---

# Play Feature Delivery

Google Play 的应用服务模型使用 Android App Bundle 为每个用户的设备配置生成和提供优化的 APK，因此用户只需下载运行应用所需的代码和资源。

`Play Feature Delivery` 使用了 `AAB` 的高级功能，允许有条件地交付或按需下载应用程序的某些功能。为此，首先您需要将这些功能从基本应用程序中分离到 `feature modules` 中。

## Feature module build configuration

当您使用 Android Studio 创建新功能模块时，IDE 会将以下 Gradle 插件应用到模块的 `build.gradle` 文件。

```kotlin
// The following applies the dynamic-feature plugin to your feature module.
// The plugin includes the Gradle tasks and properties required to configure and build
// an app bundle that includes your feature module.

plugins {
  id 'com.android.dynamic-feature'
}
```

以下部分描述了您应该和不应该包含在功能模块的构建配置中的属性。

#### 不应该包含在 `feature module` 配置的

由于每个 `feature` 模块都依赖于 `base` 模块，因此，你应该在 `feature` 模块的 `build.gradle` 文件中省略以下内容。

- **Signing configurations:** 签名配置，AAB 使用 `base` 模块的签名配置进行签名
- **The `minifyEnabled` property:** `minifyEnabled` 属性：您可以仅从 `base` 模块的构建配置中为整个应用程序项目启用代码收缩。因此，您应该从 `feature` 模块中忽略此属性。但是，您可以为每个 `feature` 模块指定其他 ProGuard 规则：[specify additional ProGuard rules](https://developer.android.com/guide/playcore/feature-delivery#dynamic_feature_proguard)。
- **`versionCode` and `versionName`**: 使用 `base` 模块的

#### 建立与 `base` 模块的关系

当 Android Studio 创建 `feature` 模块时，它会通过将 `android.dynamicFeatures` 属性添加到 `base` 模块的 `build.gradle` 文件中来使其对 `base` 模块可见，如下所示：

```kotlin
// In the base module’s build.gradle file.
android {
    // ...
    // Specifies feature modules that have a dependency on
    // this base module.
    dynamicFeatures = [":dynamic_feature", ":dynamic_feature2"]
}
```

此外，Android Studio 还包含 `base` 模块作为 `feature` 模块的依赖项，如下所示：

```kotlin
// In the feature module’s build.gradle file:
// ...
dependencies {
    // ...
    // Declares a dependency on the base module, ':app'.
    implementation project(':app')
}
```

#### 指定额外的 `ProGuard` 规则

虽然只有 `base` 模块的构建配置可以为您的应用程序项目启用 `code shrink`，但您可以使用 `proguardFiles` 属性为每个功能模块提供自定义 ProGuard 规则，如下所示。

```kotlin
android.buildTypes {
     release {
         // You must use the following property to specify additional ProGuard
         // rules for feature modules.
         proguardFiles 'proguard-rules-dynamic-features.pro'
     }
}
```

请注意，这些 ProGuard 规则在构建时与其他模块（包括 `base` 模块）的规则合并。因此，虽然每个 `feature` 模块可能指定一组新规则，但这些规则适用于应用程序项目中的所有模块。

## 部署你的 APP

当您开发支持 `feature` 模块的应用程序时，您可以像平常一样将应用程序部署到连接的设备上，方法是从菜单栏中选择“Run”>“Run”（或单击工具栏中的“Run” ![|20](https://developer.android.com/static/studio/images/buttons/toolbar-run.png) ））。

如果您的应用程序项目包含一个或多个 `feature` 模块，您可以通过修改现有的 `Run/Debug Configurations` 来选择在部署应用程序时包含哪些功能，如下所示：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240420140838.png)

默认情况下，Android Studio 不会使用`AAB`来部署您的应用程序。相反，IDE 会构建 APK 并将其安装到您的设备，这些 APK 针对部署速度而不是 APK 大小进行了优化。

## 使用`feature`模块进行定制交付

`feature` 模块的一个独特优势是能够自定义应用程序的不同功能下载到运行 Android 5.0（API 级别 21）或更高版本的设备上的方式和时间。
例如，为了减少应用程序的初始下载大小，您可以将某些功能配置为按需下载或仅由支持某些功能的设备下载，例如拍照或支持增强现实功能。

尽管当您将应用程序作为应用程序包上传时，默认情况下您会获得高度优化的下载，但更高级和可自定义的功能交付选项需要使用 `feature` 模块对应用程序的功能进行额外的配置和模块化。也就是说，`feature` 模块提供了用于创建模块化功能的构建块，您可以根据需要对其进行配置以下载。

考虑一个允许用户在在线市场上买卖商品的应用程序。您可以将应用程序的以下每个功能合理地模块化为单独的功能模块：

- Account login and creation 帐户登录和创建
- Browsing the marketplace 浏览市场
- Placing an item for sale 放置待售物品
- Processing payments 处理付款

下表描述了功能模块支持的不同交付选项，以及如何使用它们来优化示例市场应用程序的初始下载大小。

| Delivery option              | Behavior                                                                                                                                                                                                     | Sample use-case                                                                                                                                                                            | Getting started  入门                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install-time delivery  安装时交付 | 默认情况下，未配置上述任何交付选项的功能模块会在应用程序安装时下载。这是一个重要的行为，因为它意味着您可以逐渐采用高级交付选项。<br><br>例如，您可以从应用程序功能模块化中受益，并且仅在使用 Play 功能交付库完全实现按需下载后才启用按需交付。<br><br>此外，您的应用程序可以请求稍后卸载功能。因此，如果您在应用安装时需要某些功能，但之后不需要，您可以通过请求从设备中删除该功能来减少安装大小。 | 如果应用程序具有某些培训活动，例如有关如何在市场上买卖商品的交互式指南，则默认情况下您可以在应用程序安装时包含该功能。<br><br>但是，为了减少应用程序的安装大小，应用程序可以在用户完成培训后请求删除该功能。                                                                                 | 使用不配置高级交付选项的功能模块来模块化您的应用程序：[Modularize your app](https://developer.android.com/guide/playcore/feature-delivery#modularize)。<br><br>要了解如何通过删除用户可能不再需要的某些功能模块来减少应用程序的安装大小，请阅读管理已安装的模块：[Manage installed modules](https://developer.android.com/guide/playcore/feature-delivery/on-demand#manage_installed_modules)。                                                                                                                                                                                                   |
| On demand delivery  按需交付     | 允许您的应用根据需要请求和下载功能模块。                                                                                                                                                                                         | 如果只有 20% 使用市场应用程序的人发布待售商品，那么为大多数用户减少初始下载大小的一个好策略是提供拍照功能，包括商品描述和放置待售商品可按需下载。<br><br>也就是说，您可以配置功能模块，以便仅当用户表现出有兴趣将待售商品放到市场上时才下载应用程序的销售功能。<br><br>此外，如果用户在一段时间后不再销售商品，应用程序可以通过请求卸载该功能来减少其安装大小。 | 创建功能模块并配置按需交付[configure on demand delivery](https://developer.android.com/guide/app-bundle/on-demand-delivery)。然后，您的应用程序可以使用 Play 功能交付库[Play Feature Delivery Library](https://developer.android.com/guide/playcore#java-kotlin-feature-delivery)来请求按需下载模块。                                                                                                                                                                                                                                                         |
| Conditional delivery  有条件交付  | 允许您指定某些用户设备要求，例如硬件功能、区域设置和最低 API 级别，以确定是否在应用安装时下载模块化功能。                                                                                                                                                      | 如果市场应用程序具有全球影响力，您可能需要支持仅在某些地区或当地人流行的付款方式。<br><br>为了减少初始应用程序下载大小，您可以创建单独的功能模块来处理某些类型的付款方式，并根据用户注册的区域设置有条件地将它们安装在用户的设备上。                                                                     | 创建功能模块并配置条件传送[configure conditional delivery](https://developer.android.com/guide/playcore/feature-delivery/conditional)。                                                                                                                                                                                                                                                                                                                                                                                           |
| Instant delivery  即时交付       | Google Play Instant 允许用户与您的应用进行交互，而无需在其设备上安装该应用。相反，他们可以通过 Google Play 商店上的“立即试用”按钮或您创建的 URL 来体验您的应用。<br><br>这种内容交付形式使您可以更轻松地提高应用程序的参与度。<br><br>通过即时交付，您可以利用 Google Play Instant 让您的用户无需安装即可立即体验应用的某些功能。      | 考虑一个游戏，该游戏在轻量级功能模块中包含游戏的前几个级别。您可以即时启用该模块，以便用户可以通过 URL 链接或“立即尝试”按钮立即体验游戏，而无需安装应用程序。                                                                                                         | 创建功能模块并配置即时交付[configure instant delivery](https://developer.android.com/guide/app-bundle/instant-delivery).。然后，您的应用程序可以使用 Play 功能交付库来 [Play Feature Delivery Library](https://developer.android.com/guide/app-bundle/playcore)请求按需下载模块。<br><br>请记住，使用功能模块模块化应用程序功能只是第一步。为了支持 Google Play Instant，应用程序的基本模块和给定的即时启用功能的下载大小必须满足严格的大小限制。<br><br>要了解更多信息，请阅读通过减小应用或游戏大小来实现即时体验 [Enable instant experiences by reducing app or game size](https://developer.android.com/topic/google-play-instant/overview#reduce-size)。 |

# Ref

- [Play Feature Delivery 概览  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/feature-delivery)
