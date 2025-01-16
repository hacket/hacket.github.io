---
date created: 2024-04-08 13:49
date updated: 2024-12-24 00:33
dg-publish: true
---

在使用 AAB 格式之后，我们发现案例应用最终输出的 AAB 文件依旧很大，而且上传到 Google Play 依旧超过了上限。

这时候就要使用 `Play Asset Delivey（PAD）`功能，PAD 广泛用于游戏 App，它可以将游戏资源（纹理、声音等）单独发布，并且在 Google Play 上传 AAB 包时，单独计算大小。我们可以将 App 内占用空间较大的资源放到单独的 Asset Pack 中，绕过 Google Play 上传 AAB 包 150M 的限制。

**PAD 有三种分发模式：**

**1.** **install-time**：Asset Pack 在用户安装应用时分发，也被称为“预先”资源包，可以在应用启动时立即使用。这些资源包会增加 Google Play 商店上列出的应用大小，且用户无法修改或删除。

**2.** **fast-follow**：Asset Pack 会在用户安装应用后立即自动下载。用户无需打开应用即可开始下载，并且不会阻塞用户使用 App。这些资源包会增加 Google Play 商店上列出的应用大小。

**3.** **on-demand**：Asset Pack 会在应用运行的时候下载。

**不同的分发模式，Asset Pack 的大小上限不同**：

1. 每个 `fast-follow` 和 `on-demand` 模式的 Asset Pack 大小上限为 512MB。

2. 所有 `install-time` 模式的 Asset Pack 总上限为 1GB。

3. 一个 AAB 包中所有 Asset Pack 的总大小上限为 2GB。

4. 一个 AAB 包中最多可以使用 50 个 Asset Pack。·

# Ref

[Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/asset-delivery)
