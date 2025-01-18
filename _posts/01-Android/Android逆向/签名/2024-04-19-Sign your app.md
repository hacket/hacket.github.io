---
date created: 2024-04-19 20:55
date updated: 2024-12-24 00:40
dg-publish: true
---

# Sign your app

## Play App Signing

[Sign your app  |  Android Studio  |  Android Developers](https://developer.android.com/studio/publish/app-signing#app-signing-google-play)

通过 Play 应用签名，Google 可以为您管理和保护您的应用的签名密钥，并使用它来签署您的 APK 以便分发。
而且，由于 `AAB` 会延迟将 APK 构建和签名到 Google Play 商店，因此您需要在上传 `AAB` 之前配置 Play 应用程序签名。这样做可以让您受益于以下几点：

- 使用 Android App Bundle 并支持 Google Play 的高级交付模式。 Android App Bundle 使您的应用程序变得更小、发布更简单，并且可以使用功能模块并提供即时体验。
- 提高签名密钥的安全性，并允许使用单独的上传密钥对您上传到 Google Play 的 `AAB` 进行签名。
- 密钥升级可让您更改应用程序签名密钥，以防现有密钥遭到泄露或需要迁移到加密性更强的密钥

注意：为了确保安全，在使用自动生成的密钥或您提供的密钥配置 Play 应用签名后，您将无法检索应用签名密钥的副本，并且 Google 可能会保留该密钥的备份副本以供使用。灾难恢复的目的。

Play 应用签名使用两个密钥：应用签名密钥 `app signing key` 和上传密钥 `app signing key`，有关密钥和密钥库的部分对此进行了更详细的描述。您保留上传密钥并使用它来签署您的应用程序以上传到 Google Play 商店。 Google 使用上传证书来验证您的身份，并使用您的应用签名密钥对您的 APK 进行签名以进行分发，如图 1 所示。通过使用单独的上传密钥，如果您的密钥丢失或妥协了。

相比之下，对于未选择加入 Play 应用签名的应用，如果您丢失了应用的签名密钥，您将无法更新应用。

![|700](https://developer.android.com/static/studio/images/publish/appsigning_googleplayappsigningdiagram_2x.png)

重要提示：如果您想在多个商店中使用相同的签名密钥，请确保在配置 Play 应用签名([configure Play App Signing](https://developer.android.com/studio/publish/app-signing#enroll),)时提供您自己的签名密钥，而不是让 Google 为您生成一个签名密钥。

您的密钥存储在 Google 用于存储自己密钥的同一基础设施上，并受到 Google 密钥管理服务的保护。

当您使用 Play 应用签名时，如果您丢失上传密钥或上传密钥遭到泄露，您可以在 Play 管理中心请求重置上传密钥。由于您的应用签名密钥由 Google 保护，因此即使您更改了上传密钥，您也可以继续上传应用的新版本作为原始应用的更新。

要了解更多信息，请参阅重置丢失或受损的私人上传密钥（[Reset a lost or compromised private upload key](https://developer.android.com/studio/publish/app-signing#reset_upload_key)）。

### App signing key 和 upload key

#### App signing key

- 它是用来签名应用，使之可以被安装到用户设备上的密钥。
- 这个密钥由 Google Play 管理并用来为 APK 文件重新签名，以便在 Play Store 上分发。
- 如果你选择了使用 Google Play 应用签名服务，应用签名密钥将由 Google 保管，你不需要在本地保存这个密钥。
- 这个密钥通常比上传密钥有更长的有效期（比如使用 SHA-1 的签名证书需要在 2033 年之前替换成 SHA-256 或者更安全的选项）

#### Upload key

- 它是在开发过程中用来初步签名 APK 的密钥，之后 APK 文件会上传到 Google Play Console。
- 上传密钥用来证明开发者对应用的所有权，以防其他未授权的源头上传。
- 如果上传密钥丢失或遭到危机，开发者可以请求 Google Play 替换新的上传密钥。
- 由于上传密钥不是最终分发给用户的 APK 所使用的密钥，所以即便它被泄露，攻击者也无法用此密钥来伪造合法的应用更新。

#### 小结

使用 Google Play 应用签名服务的好处包括更安全的密钥管理——即使上传密钥丢失或泄露，你也可以请求重置上传密钥而不影响用户的使用。同时，Google Play 也能提供关于应用遭到篡改或密钥使用不当的保护。

简而言之，应用签名密钥是用于分发 APK 的密钥，只由 Google Play 保管；而上传密钥则由开发者保管，用于在上传 APK 到 Google Play 时证明其所有权。两种密钥分离的策略旨在提高应用的安全性和处理密钥丢失的灵活性。

当您开始使用 Google Play 的 App Signing 服务时，默认情况下，您将生成一个新的密钥对，该密钥对将成为您的 App Signing 密钥，而您以前用于签名 APK 的旧密钥将变成上传密钥。这样做的好处是，即使上传密钥泄露或丢失，您的 App Signing 密钥仍然安全，因为它被 Google Play 管理。

如果您希望上传密钥同时用作 App Signing 密钥，可以选择在 Google Play Console 设置应用签名时不生成新的密钥对，并使用现有的上传密钥作为 App Signing 密钥。但一般不建议这么做，因为它不提供上传密钥和 App Signing 密钥分开所带来的安全性的好处。

如果您刚开始使用 Google Play 应用签名服务，并想要让您的现有密钥同时用作上传密钥和应用签名密钥，可以在初始化应用签名服务的过程中选择“`Export and upload a key from a Java keystore`”选项，并按照界面指引操作。但注意，一旦上传并且由 Google Play 管理此密钥后，您就不能将其作为上传密钥使用了。

以下是如何将您的上传密钥作为应用签名密钥的一般步骤：

1. 登录到 `Google Play Console`。
2. 选择您的应用。
3. 进入`“Release” > “Setup” > “App integrity”`部分。
4. 在`“App Signing”`部分，点击`“Request key upgrade（如果可用）”`。
5. 如果您有资格获取密钥升级，您可以向 Google Play 提交您的上传密钥（将成为新的应用签名密钥），并跟随指引完成流程。

如果您决定使用上传密钥作为应用签名密钥，请务必考虑到它将无法提供两个密钥分离所带来的额外安全性。谨慎管理您的密钥，并确保遵循最佳安全实践来减少密钥泄露或丢失的风险。如果您不确定如何操作或考虑到安全因素，最佳做法是保持上传密钥和应用签名密钥的分离，并让 Google Play 管理您的 App Signing 密钥

### Using Play App Signing

需要配置 Play 应用签名才能对您的应用进行签名以便通过 Google Play 分发（2021 年 8 月之前创建的应用除外，这些应用可能会继续分发自签名 APK）。您需要执行的步骤取决于您的应用是否尚未发布到 Google Play，或者您的应用是否已使用现有应用签名密钥进行签名并在 2021 年 8 月之前发布。

#### 新 APP

[Sign your app  |  Android Studio  |  Android Developers](https://developer.android.com/studio/publish/app-signing#enroll_new)

#### 已有的 APP

[Sign your app  |  Android Studio  |  Android Developers](https://developer.android.com/studio/publish/app-signing#enroll_existing)

#### 丢失 upload key

[Sign your app  |  Android Studio  |  Android Developers](https://developer.android.com/studio/publish/app-signing#reset_upload_key)

# Ref

[Sign your app  |  Android Studio  |  Android Developers](https://developer.android.com/studio/publish/app-signing)
