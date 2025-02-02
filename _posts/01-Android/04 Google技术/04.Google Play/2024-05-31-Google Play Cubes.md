---
date_created: Friday, May 31st 2024, 12:48:09 am
date_updated: Wednesday, January 22nd 2025, 12:06:41 am
title: Google Play Cubes
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
date created: 2024-04-03 15:23
date updated: 2024-12-24 00:33
aliases: [Google Play Cubes]
linter-yaml-title-alias: Google Play Cubes
---

# Google Play Cubes

文档基于 `engage sdk v1.4.0`

## Google Play Cubes 是什么？

Cubes 是 Google 开发的一个新的功能。

- CUBES 以 Play 商店的小组件形式存在，需用户手动添加后才会展现，桌面以 5 个 ICON 的信息条样式展现，点击后可打开 CUBES；（用户手动添加小组件方式：手动长按 Play 商店，添加小组件；桌面缩放，添加小组件）
- 顶部拆分为 5 个分类（Category apps）：Watch、Games、Read、Listen、<font color="#953734">Shopping</font>，当前仅 Watch、Games 有信息，后面 3 个分类为空白，分类内展示顺序按最后使用时间排序（空白是因为设备当前未安装该分类下支持的 APP）
- 每个分类下面可以发布不同种类的集群，如 Shopping 分类（具体见 [[#Cluster types]]），可分为：
  - `Recommendation cluster`：推荐集群。可用来展示推荐的商品、活动、销售、促销或订阅信息；可根据用户是否登录来做个性化还是一般化的推荐；可以展示多个；Google 建议一天更新一次就行
  - `Featured cluster`：精选集群。用于展示精选的 ShoppingEntity，Google 建议放促销、重要事件、会员相关等；可根据用户是否登录来做个性化还是一般化的推荐；只有一个；
  - `Shopping Cart cluster`：购物车集群。用于展示购物车商品，购物车商品总数量；需要登录态；只有一个；
  - `Shopping List cluster`：购物清单集群。用于展示购物清单；需要登录态；只有一个；
  - `Reorder cluster`：再订购集群。用于展示上一次购物订单，引导用户再次下单；需要登录态；只有一个；
  - `Order tracking cluster`：可用于物流追踪，新增的 api，还没有文档；需要登录态；只有一个；
- 一些 Cubes 功能的截图 _Source_: [Google News Telegram](https://t.me/google_nws/3749)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/google-play-cubes-1.jpeg)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/google-play-cubes-2.jpeg)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/google-play-cubes-3.jpeg)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/google-play-cubes-4.jpeg)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/google-play-cubes-5.jpeg)

## Google Play Engage Shopping for app 交互流程

![Google_Cubes_for_shein.jpg|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/Google_Cubes_for_shein.jpg)

## Engage 开发者集成流程

[Engage 开发者集成工作流程  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/workflow)

### Shared files

#### Verification app 验证应用程序

[`engage_verify_app_dev_03052024.apk`](https://developer.android.com/guide/playcore/engage/workflow#debug:~:text=%E9%AA%8C%E8%AF%81%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-,engage_verify_app_dev_03052024.apk,-An%20Android%20application)

该 APP 的包名为：`com.google.android.engage.verifyapp`，用于验证 APP 发布集群测试

查看 Engage SDK：

```java
public final class zzac {
	@VisibleForTesting  
	static final Intent zza = (new Intent("com.google.android.engage.BIND_APP_ENGAGE_SERVICE")).setPackage("com.android.vending");  
	static final Intent zzb = (new Intent("com.google.android.engage.BIND_APP_ENGAGE_SERVICE")).setPackage("com.google.android.engage.verifyapp");
}
```

- `com.android.vending` 是 Google Play Store APP 的包名；Google Play app
- `com.google.android.engage.verifyapp` 是 Google 提供给我们验证集群发布状态的 APP 的包名；verifyapp app

如果同时存在 2 个 App，优先级：`verifyapp` > `Google Play`

#### **内容发布指南**

[[#Engage SDK Cluster publishing guidelines （Engage SDK 集群发布指南 ）]]

### 1、使用 SDK 调试模式进行开发

在 `build.gradle` 文件中添加 Engage SDK，并遵循相应的类别特定集成指南来完成集成。

```groovy
dependencies {
    // Make sure you also include the repository in your project's build.gradle file.
    implementation 'com.google.android.engage:engage-core:1.4.0'
}
```

不同类别的，按照不同类别的集成文档集成，如 Shopping：[[#Shopping 类别集成指南]]

### 2、安装验证应用程序

验证应用程序（`engage_verify_app_dev_03052024.apk`）是一个 Android 应用程序，开发人员可以使用它来验证集成是否正常工作。该应用程序包括帮助开发人员验证数据和广播意图的功能。

### 3、验证数据在验证应用程序中是否可见

验证数据在验证应用程序中是否可见

- 输入正在发布数据的开发包的名称。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/workflow-data-1.png)

- 验证集群中的所有实体均已发布。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/workflow-data-2.png)

- 验证实体中的所有字段均已发布。对于该行中的每个项目，开发人员可以单击海报图像来验证意图。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/workflow-data-3.png)

### 4、验证广播意图流

要验证广播意图，请单击 UI 顶部的按钮来触发发送广播的逻辑。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/workflow-intent.png)

完成步骤 1 到 4 后，您就完成了集成测试。

### 5、调试完成后，您必须更新清单文件中的元数据

```xml
<application>
  <meta-data
	android:name="com.google.android.engage.service.ENV"
	android:value="PRODUCTION"></meta-data>
</application>
```

<font color="#92d050">警告：在将应用程序发布到 Play 商店之前，请确保元数据已更新。</font>

### 6、Send Google the release-ready APK

将您的可发布 APK 文件的副本作为电子邮件附件发送至 `engage-developers@google.com` 。 Google 将验证整个流程是否按我们的预期运行。完成后，应用程序就可以提交到生产环境进行发布。

> 警告：确保 APK 的包名称与发布到 Play 商店的包名称匹配。

### 7、Publish the APK to the Play Store

获得批准后，将 APK 发布到 Play 商店。发布后，将发布的版本号发送电子邮件至 `engage-developers@google.com` 。谷歌将采取后续措施予以回应。

## Shopping 类别集成指南

[Engage SDK Shopping：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/shopping)

`Engage SDK Shopping` 是 Google 给合作伙伴在其 APP 外展示其<font color="#953734">购物</font>相关内容，在一块新的 Surface 区域或者 Google Surface 如 `Entertainment` 区域。

### Cluster types

Shopping 下面有 6 种 cluster type：

**Recommendation**, **Featured**, **Shopping Cart**, **Shopping List** and **Reorder**

V 1.4.0 新增了 **Order Track**

#### **Recommendation** cluster 推荐集群（多个）

`Recommendation` clusters 展示来自各个开发者合作伙伴提供的个性化的 shopping 建议。这些推荐可以针对用户进行个性化或一般化（如：趋势项目）。使用它们来显示你认为合适的产品、活动、销售、促销或订阅。

你的 Recommendations 采用下面的结构：

- **Recommendation Cluster**：包含来自同一开发合作伙伴的一组推荐的 UI 视图
- **ShoppingEntity**：代表集群中单个项目的对象

#### **Featured** cluster 特色集群（单个）

`Featured` cluster 展示了来自多个开发合作伙伴的精选购物实体 (`ShoppingEntity`)，以一个 UI 分组的形式呈现。在 UI 的顶部附近，有一个单独的**Featured** cluster ，优先于所有**Recommendation** cluster。每个开发合作伙伴都可以在**Featured** cluster 中发布一个购物实体 (`ShoppingEntity`)。

#### **Shopping Cart** cluster 购物车集群（单个）

`Shopping Cart` cluster 在一个 UI 分组中展示多个开发者合作伙伴的购物车商品一撇，促使用户完成未完成的购物车。只有一个 `Shopping Cart` cluster，在 UI 的顶部附近显示，优先于所有的 `Recommendation` clusters。每个开发者合作伙伴在只能在 `Shopping Cart` cluster 广播一个 `ShoppingCart`。

你的 `Shopping Cart` 采用下面的结构：

- **Shopping Cart Cluster:** 包含来自许多开发合作伙伴的一组购物车预览的 UI 视图。
- **ShoppingCart:** 一个表示单个开发者合作伙伴购物车预览的对象，将在 `Shopping Cart` cluster 中显示。`ShoppingCart` 必须显示购物车中物品的总数量，并且可能还包括用户购物车中某些物品的图片。

#### Shopping List cluster 购物清单集群（单个）

`Shopping List` cluster 展示了来自多个开发者合作伙伴的购物清单一撇，将用户引导返回 APP 去更新和完成他们的清单。只有一个 `Shopping List` cluster。

#### Reorder cluster 购物重新订购集群

`Reorder` cluster 展示了来自多个开发者合作伙伴的上一笔订单的一撇，以一个 UI 界面分组的方式提示用户再去下单。只有一个 `Record` cluster。

`Reorder` cluster 必须显示用户先前订单中的所有商品数量，并且还必须包含以下内容之一：

1. 用户先前订单中 X 件商品的图片
2. 用户先前订单中 X 件商品的标签

#### Order Track 物流追踪 `v1.4.0新增的`

#### 展示优先级

先展示 `ShoppingCart`，然后 `Featured`，然后 `Recommendations`

### Pre-work 前期工作

- 最低 API 级别：`19`
- 添加依赖库

```groovy
dependencies {
    // Make sure you also include that repository in your project's build.gradle file.
    implementation 'com.google.android.engage:engage-core:1.4.0'
}
```

For more information, see [Package visibility in Android 11](https://developer.android.com/about/versions/11/privacy/package-visibility).

### Summary

前提条件：绑定了 SDK 提供的 Service？

对于不同的集群类型，客户端可以发布的数据受到以下限制：

| Cluster type 簇型                          | Cluster limits 集群限制 | Maximum entity limits in a cluster  <br>集群中的最大实体限制 |
| ---------------------------------------- | ------------------- | -------------------------------------------------- |
| `Recommendation` Cluster(s)  <br>推荐集群    | 最多 5 个              | 最多 25 个 `ShoppingEntity`                           |
| `Featured` Cluster 特色集群                  | 最多 1 个              | 最多 1 `ShoppingEntity`                              |
| `Shopping Cart` Cluster 购物车集群            | 最多 1 个              | 最多 1 `ShoppingCart`                                |
| `Shopping List` Cluster 购物清单集群           | 最多 1 个              | 最多 1 `ShoppingListEntity`                          |
| `Shopping Reorder` Cluster  <br>购物重新订购集群 | 最多 1 个              | 最多 1 `ReorderEntity`                               |

#### 步骤一：提供 `Entity` 数据

SDK 定义了不同的 `Entity` 来表示每种类型，`Shopping` 类别支持以下 `Entity`：

1. `ShoppingEntity`
2. `ShoppingCart`
3. `ShoppingList`
4. `Reorder`

下图概述了每种类型的可用属性和要求。

##### `ShoppingEntity`

`ShoppingEntity` 对象代表开发者合作伙伴希望发布的 `product`, `promotion`, `deal`, `subscription`, or `event`。

| Attribute             | Requirement                  | Description                                                                                                                                                                      | Format                                                                                                                                   | API                                  |
| --------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `Poster images`       | **必需的**                      | 海报图片，必须至少提供一张图像。                                                                                                                                                                 | 请参阅图像规格 [Image Specifications](https://developer.android.com/guide/playcore/engage/shopping#image-specs) 以获取指导。[[#Image specifications]] | `addPosterImage` 和 `addPosterImages` |
| Action Uri            | **必需的**                      | 操作的 Uri：指向应用程序中显示实体详细信息的页面的 DeepLink。<br><br>[Refer to this FAQ](https://developer.android.com/guide/playcore/engage/faq#deeplinks-attribution)  <br>注意：您可以使用深层链接进行归因。请参阅此常见问题解答 | Uri                                                                                                                                      | `setActionLinkUri(Uri)`              |
| Title                 | 可选                           | 实体的名称。                                                                                                                                                                           | 文本<br>  <br>建议文本大小：**90** 个字符以下（文本太长可能会显示省略号）                                                                                            | `setTitle`                           |
| Price - current       | Conditionally required 有条件需要 | 实体的当前价格。<br><br>**如果提供了删除线价格，则必须提供。**                                                                                                                                            | 文本                                                                                                                                       | `setPrice`                           |
| Price - strikethrough | 可选                           | 删除线价格：实体的原始价格，在 UI 中被删除。                                                                                                                                                         | 文本                                                                                                                                       | `setPrice`                           |
| Callout               | 可选                           | 标注实体的促销、活动或更新（如果有）。                                                                                                                                                              | 文本<br>  <br>建议文本大小：**45** 个字符以下（文本太长可能会显示省略号）                                                                                            | `setCallout`                         |
| Callout fine print    | 可选                           | 标注细则                                                                                                                                                                             | 文本<br> <br>建议文本大小：**45** 个字符以下（文本太长可能会显示省略号）                                                                                             | `setCalloutFinePrint`                |
| Rating                | 可选                           | 评级                                                                                                                                                                               | Rating                                                                                                                                   | `setRating`                          |

**Rating（可选，注意：我们使用标准的星级评分系统显示所有评级）**

| Attribute              | Requirement | Description                                          | Format          | API         |
| :--------------------- | :---------- | :--------------------------------------------------- | :-------------- | :---------- |
| Rating - max value     | 必选          | 评级最大值<br><br>如果提供了 `currentValue`，必须提供 `maxValue`    | `Number >= 0.0` | `setRating` |
| Rating - current value | 必选          | 实体评级的当前值<br><br>如果提供了 `maxValue`，必须提供 `currentValue` | `Number >= 0.0` | `setRating` |
| Rating - count         | 可选          | 实体的评级计数。                                             | String          | `setRating` |

**DisplayTimeWindow**（可选，**设置要在表面上显示的内容的时间窗口**）

| Attribute       | Requirement | Description                                          | Format                               | API                                            |
| :-------------- | :---------- | :--------------------------------------------------- | :----------------------------------- | :--------------------------------------------- |
| Start Timestamp | 可选          | 开始时间戳<br><br><br>到了该时间戳内容才显示<br><br>如果未设置，内容可以显示在表面上 | 时间戳，世界时（UTC），相对于 `1970年1月1日00:00:00` | `addDisplayTimeWindow/addAllDisplayTimeWindow` |
| End Timestamp   | 可选          | 结束时间戳<br><br>到了该时间戳内容不显示<br><br>如果未设置，内容可以显示在表面上。    | 时间戳，世界时（UTC），相对于 `1970年1月1日00:00:00` | `addDisplayTimeWindow/addAllDisplayTimeWindow` |

##### `ShoppingCart`

| Attribute       | Requirement | Description                                                                                                                                                                | Format                                                                                                                                   | API                                  |
| --------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Action Uri      | **必需的**     | 操作的 Uri：合作伙伴应用程序中购物车的 DeepLink。<br><br>[Refer to this FAQ](https://developer.android.com/guide/playcore/engage/faq#deeplinks-attribution)  <br>注意：您可以使用深层链接进行归因。请参阅此常见问题解答 | Uri                                                                                                                                      | `setActionLinkUri(Uri)`              |
| Number of items | **必需的**     | 购物车中的商品数量（不仅仅是产品数量）。<br><br>>例如：如果购物车中有 3 件相同的衬衫和 1 顶帽子，则该数字应为 4。                                                                                                          | Integer >= 1                                                                                                                             | `setNumberOfItems`                   |
| Action Text     | 可选          | 动作文本购物车上按钮的号召性用语文本（例如，您的购物袋）。**如果开发人员未提供操作文本，则默认为 " 查看购物车 "。**<br><br>从 1.1.0 版本开始支持此属性。                                                                                      | String                                                                                                                                   | `setActionText`                      |
| Title           | 可选          | 购物车的标题（例如，您的购物袋）。<br><br>**如果开发商未提供标题，则默认为您的购物车。**                                                                                                                         | 文本<br>  <br>建议文本大小：**25** 个字符以下（文本太长可能会显示省略号）                                                                                            | `setTitle`                           |
| Cart images     | 可选          | 购物车图片<br>购物车中每个产品的图片。<br><br>**最多可提供 10 张图像（按优先顺序排列）；实际显示的图像数量取决于设备的外形尺寸。**<br>                                                                                            | 请参阅图像规格 [Image Specifications](https://developer.android.com/guide/playcore/engage/shopping#image-specs) 以获取指导。[[#Image specifications]] | `addPosterImage` 和 `addPosterImages` |
| Item labels     | 可选          | 购物清单上的商品标签列表。<br><br>**显示的标签的实际数量取决于设备的外形尺寸。**                                                                                                                             | 文本<br><br>建议文本大小：**20** 个字符以下（文本太长可能会显示省略号）                                                                                              | `addItemLabel/addItemLabels`         |

- 在 shoppingCart 里传入图片或者 label 的时候就会显示效果 1
- 有图片或者文字的话就会显示效果 2

**Play Engage Verify App 效果：**

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624164921.png)

**Google Play Cubes 上效果：**
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/企业微信截图_371e2acb-f4b5-4318-a798-cd7daf765696.png)

- Image 的图片必须是 https，http 的会加载不出来

**DisplayTimeWindow**（可选，**设置要在表面上显示的内容的时间窗口**）

| Attribute       | Requirement | Description                                          | Format                                 | API                                            |
| :-------------- | :---------- | :--------------------------------------------------- | :------------------------------------- | :--------------------------------------------- |
| Start Timestamp | 可选          | 开始时间戳<br><br><br>到了该时间戳内容才显示<br><br>如果未设置，内容可以显示在表面上 | 时间戳，世界时（UTC），相对于 `1970年1月1日00:00:00`    | `addDisplayTimeWindow/addAllDisplayTimeWindow` |
| End Timestamp   | 可选          | 结束时间戳<br><br>到了该时间戳内容不显示<br><br>如果未设置，内容可以显示在表面上。    | 时间戳，世界时（UTC），相对于 `1970年1月1日00:00:00` 0 | `addDisplayTimeWindow/addAllDisplayTimeWindow` |

##### `ShoppingList`

| Attribute       | Requirement | Description                                                                                                                                                                   | Format                                        | API                          |
| --------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| Action Uri      | **必需的**     | 操作的 Uri：指向合作伙伴应用程序中购物清单的 DeepLink。<br><br>[Refer to this FAQ](https://developer.android.com/guide/playcore/engage/faq#deeplinks-attribution)  <br>注意：您可以使用深层链接进行归因。请参阅此常见问题解答 | Uri                                           | `setActionLinkUri(Uri)`      |
| Number of items | **必需的**     | 购物清单中的商品数量。<br><br>                                                                                                                                                           | Integer >= 1                                  | `setNumberOfItems`           |
| Title           | 可选          | 列表的标题（例如，您的杂货清单）。<br><br>**如果开发者没有提供标题，则默认为购物清单。**                                                                                                                            | 文本<br>  <br>建议文本大小：**25** 个字符以下（文本太长可能会显示省略号） | `setTitle`                   |
| Item labels     | 可选          | 购物清单上的商品标签列表。<br><br>**必须至少提供 1 个标签，最多可提供 10 个标签（按优先顺序排列）；显示的实际标签数量取决于设备外形尺寸。**                                                                                               | 文本<br><br>建议文本大小：**20** 个字符以下（文本太长可能会显示省略号）   | `addItemLabel/addItemLabels` |

##### `ShoppingReorderCluster`

| Attribute       | Requirement      | Description                                                                                                                                                                   | Format                                                                                                                                   | API                                  |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Action Uri      | **必需的**          | 操作的 Uri：在合作伙伴的应用程序中重新订购的 DeepLink。<br><br>[Refer to this FAQ](https://developer.android.com/guide/playcore/engage/faq#deeplinks-attribution)  <br>注意：您可以使用深层链接进行归因。请参阅此常见问题解答 | Uri                                                                                                                                      | `setActionLinkUri(Uri)`              |
| Number of items | **必需的**          | 上一个订单中的商品数量（不仅仅是产品数量）。<br><br>> 例如：如果之前的订单中有 3 份小杯咖啡和 1 份牛角面包，则该数字应为 4。                                                                                                       | Integer >= 1                                                                                                                             | `setNumberOfItems`                   |
| Action Text     | 可选               | 重新订购按钮的号召性用语文本（例如，再次订购）。<br><br>**如果开发人员未提供操作文本，则默认重新排序 (`Reorder`)。**<br><br>从 1.1.0 版本开始支持此属性。                                                                               | String                                                                                                                                   | `setActionText`                      |
| Title           | 可选               | 重新订购商品的标题。<br><br>                                                                                                                                                            | 文本<br>  <br>建议文本大小：**40** 个字符以下（文本太长可能会显示省略号）                                                                                            | `setTitle`                           |
| Poster images   | 可选               | 上一个订单中的商品的图像。<br><br><br>**最多可提供 10 张图像（按优先顺序排列）；实际显示的图像数量取决于设备的外形尺寸。**<br>                                                                                                   | 请参阅图像规格 [Image Specifications](https://developer.android.com/guide/playcore/engage/shopping#image-specs) 以获取指导。[[#Image specifications]] | `addPosterImage` 和 `addPosterImages` |
| Item labels     | 可选（如未提供，应提供海报图片） | 上一个订单的商品标签列表。<br><br>**最多可提供 10 个标签，按优先级顺序排列；显示的实际标签数量取决于设备外形尺寸。**                                                                                                              | 文本<br><br>建议文本大小：**20** 个字符以下（文本太长可能会显示省略号）                                                                                              | `addItemLabel/addItemLabels`         |

##### Image specifications

下面列出了图像资源所需的规格：

| Aspect ratio 比例                                     | Minimum pixels 最小像素 | Recommended pixels 推荐像素 |
| --------------------------------------------------- | ------------------- | ----------------------- |
| Square (1x1) <br><br>**非 featured clusters 的首选**      | 300x300             | 1200x1200               |
| Landscape (1.91x1) <br><br>**featured clusters 的首选** | 600x314             | 1200x628                |
| Portrait (4x5)                                      | 480x600             | 960x1200                |

- _File formats 文件格式：_ `PNG`, `JPG`, `static GIF`, `WebP`
- _Maximum file size 最大文件大小：_ 5120 KB
- _Additional recommendations 其他建议：_
  - **Image safe area** 图像安全区域：将重要内容放在图像中心 80% 的位置。
  - 使用透明背景，以便图像可以在深色和浅色主题设置中正确显示。

##### ShoppingOrderTrackingCluster

v 1.4.0 文档还未更新

##### Sign In Card

| Attribute   | Requirement                                                                | Description                                                                                                                      |
| ----------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Action Uri  | Required                                                                   | Deeplink to Action (i.e. navigates to app sign in page)  <br>深层链接到操作（即导航到应用程序登录页面）                                               |
| Image       | Optional - If not provided, Title must be provided  <br>可选 - 如果未提供，则必须提供标题 | Image Shown on the Card  <br>卡上显示的图像<br><br>16x9 aspect ratio images with a resolution of 1264x712  <br>16x9 宽高比图像，分辨率为 1264x712 |
| Title       | Optional - If not provided, Image must be provided  <br>可选 - 如果未提供，则必须提供图像 | Title on the Card  <br>卡上的标题                                                                                                     |
| Action Text | Optional                                                                   | Text Shown on the CTA (i.e. Sign in)  <br>CTA 上显示的文本（即登录）                                                                        |
| Subtitle    | Optional                                                                   | Optional Subtitle on the Card  <br>卡上的可选字幕                                                                                       |

```kotlin
var SIGN_IN_CARD_ENTITY =
      SignInCardEntity.Builder()
          .addPosterImage(
              Image.Builder()
                  .setImageUri(Uri.parse("http://www.x.com/image.png"))
                  .setImageHeightInPixel(500)
                  .setImageWidthInPixel(500)
                  .build())
          .setActionText("Sign In")
          .setActionUri(Uri.parse("http://xx.com/signin"))
          .build()

appEngagePublishClient.publishUserAccountManagementRequest(
            PublishUserAccountManagementRequest.Builder()
                .setSignInCardEntity(SIGN_IN_CARD_ENTITY)
                .build());
```

<font color="#953734">注意：</font>用户登录后，开发者必须通过调用 `deleteUserManagementCluster()` API 删除卡片。

#### 步骤二：提供 `Cluster` 数据 publish 发布

建议在**后台**执行内容发布作业 (`publish`)（例如，使用 `WorkManager`）并**定期或按事件**安排（例如，每次用户打开应用程序或用户刚刚向应用程序添加内容时）他们的购物车）。

`AppEngageShoppingClient` 负责 publish `shopping clusters`。

以下 API 公开用于在客户端中发布集群：

- `isServiceAvailable`
- `publishRecommendationClusters`
- `publishFeaturedCluster`
- `publishShoppingCart`
- `publishShoppingList`
- `publishShoppingReorderCluster`
- `publishUserAccountManagementRequest`
- `updatePublishStatus`
- `deleteRecommendationsClusters`
- `deleteFeaturedCluster`
- `deleteShoppingCartCluster`
- `deleteShoppingListCluster`
- `deleteShoppingReorderCluster`
- `deleteUserManagementCluster`
- `deleteClusters`

##### `isServiceAvailable`

该 API 用于检查服务是否可集成以及内容是否可以在设备上呈现。

```kotlin
client.isServiceAvailable.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        // Handle IPC call success
        if(task.result) {
          // Service is available on the device, proceed with content publish
          // calls.
        } else {
          // Service is not available, no further action is needed.
        }
    } else {
      // The IPC call itself fails, proceed with error handling logic here,
      // such as retry.
    }
}
```

> 注意：我们强烈建议保持定期作业运行，以检查该服务是否在以后的某个时间点可用。该服务的可用性可能会随着 Android 版本升级、应用程序升级、安装和卸载而变化。
> 通过确保以一定时间间隔进行定期作业检查，一旦服务可用，就可以发布数据。**其他 publishXXX API 也是一样。**

##### `publishRecommendationClusters`

该 API 用于发布 `RecommendationCluster` 对象，可能是一个列表。

`RecommendationCluster` 对象可以具有以下属性：

| Attribute 属性                  | Requirement 要求 | Description 描述                                                                                                                                                                   |
| ----------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List of ShoppingEntity 购物实体列表 | **必需的**        | 构成此 `Recommendation Cluster` 的推荐的 `ShoppingEntity` 对象的列表。                                                                                                                         |
| Title 标题                      | **必需的**        | `Recommendation Cluster` 的标题。<br><br>建议文本大小：**25** 个字符以下（文本太长可能会显示省略号）                                                                                                           |
| Action Uri 操作 URI             | 可选             | 指向合作伙伴应用程序中页面的深层链接，用户可以在其中查看完整的推荐列表。<br><br>注意：您可以使用深层链接进行归因。请参阅此常见问题解答 [Refer to this FAQ](https://developer.android.com/guide/playcore/engage/faq#deeplinks-attribution)  <br> |

> 重要提示：发布 API 是更新插入 API; 它替换了现有内容。不要随后调用 delete 和 publish API 来替换内容，因为发布 API 本质上是这样做的。

```kotlin
client.publishRecommendationClusters(
	PublishRecommendationClustersRequest.Builder()
		.addRecommendationCluster(
			RecommendationCluster.Builder()
				.addEntity(entity1)
				.addEntity(entity2)
				.setTitle("Black Friday Deals")
				.build())
		.build())
```

当服务收到请求时，在一个事务中执行以下操作：

- 所有现有的 `Recommendation Cluster` 数据都将被移除。
- 来自请求的数据将被解析并存储在新的 `Recommendation Cluster` 中。

如果发生错误，则将拒绝整个请求并保留现有状态。

##### `publishFeaturedCluster`

此 API 用于发布 `FeaturedCluster` 对象。

```kotlin
client.publishFeaturedCluster(
	PublishFeaturedClusterRequest.Builder()
		.setFeaturedCluster(
			FeaturedCluster.Builder()
				// ...
				.build())
		.build())
```

当服务收到请求时，在一个事务中执行以下操作：

- 将删除来自开发人员合作伙伴的现有 `FeaturedCluster` 数据。
- 来自请求的数据将被解析并存储在更新的 `Featured Cluster` 中

如果发生错误，则将拒绝整个请求并保留现有状态。

**注意：**

- Shopping featured 的 Entity 是 `ShoppingEntity`
- `ShoppingEntity` 的 price 和 rating 同时存在，优先展示 rating
- 如果通过 `FeaturedCluster.Builder.addEntity` 添加了多个 Entity，只有第 1 个生效
- `deeplink` 只需要设置每个 Entity 的 `setActionLinkUri`，最外层不需要设置 `deeplink`
- 目前 featured 只会显示一个，API 可以 add 多个是允许当有一个过期了之后我们可以自动选择下一个有效的

效果：

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240711145936.png)

**示例：**

```java
public final class GetFeaturedCluster {
    private static final String ACTION_LINK_URI = "xxx://applink/ad_landing_recommend?test=1&mallcode=b&page_type=B";
    @RequiresApi(api = Build.VERSION_CODES.O)
    public static FeaturedCluster getFeaturedCluster() {
        FeaturedCluster.Builder clusterBuilder = new FeaturedCluster.Builder();

        Image image = new Image.Builder()
                .setImageUri(Uri.parse("https://img1.baidu.com/it/u=2127952341,1978494606&fm=253&fmt=auto&app=138&f=PNG?w=600&h=477"))
                .setImageHeightInPixel(314)
                .setImageWidthInPixel(600)
                .build();

        for (int i = 0; i < 5; i++) {
            Price price = new Price.Builder()
                    .setCurrentPrice("$" + (100.00 + i))
                    .setStrikethroughPrice("$" + (200.00 + i))
                    .build();

            Rating rating = new Rating.Builder()
                    .setCurrentValue(1.1 + i)
                    .setMaxValue(10.0)
                    .build();

            ShoppingEntity shoppingEntity = new ShoppingEntity.Builder()
                    .addPosterImage(image)
                    .setActionLinkUri(Uri.parse(ACTION_LINK_URI))
                    .setTitle("Goods_" + i + "_" + MyRecommendationCluster.INSTANCE.getCurrentTimestampAndFormat())
                    .setPrice(price)
                    .setCallout("Callout_" + i)
                    .setRating(rating)
                    .build();
            clusterBuilder.addEntity(shoppingEntity);
        }
        return clusterBuilder.build();
    }

    private GetFeaturedCluster() {
    }
}
```

##### `publishShoppingCart`

此 API 用于发布 `ShoppingCartCluster` 对象。

```kotlin
client.publishShoppingCart(
	PublishShoppingCartRequest.Builder()
		.setShoppingCart(
			ShoppingCart.Builder()
				// ...
				.build())
	.build())
```

当服务收到请求时，在一个事务中执行以下操作：

- 将删除来自开发人员合作伙伴的现有 `ShoppingCart` 数据。
- 来自请求的数据将被解析并存储在更新的 `Shopping Cart Cluster` 中。

如果发生错误，则将拒绝整个请求并保留现有状态。

效果 1：没有 image 和 label

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240619202843.png)

效果 2：有 image

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240619202954.png)

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240711145849.png)

##### `publishShoppingList`

此 API 用于发布 `FoodShoppingList` 对象。

```kotlin
client.publishFoodShoppingList(
	PublishFoodShoppingListRequest.Builder()
		.setFoodShoppingList(
			FoodShoppingListEntity.Builder()
				...
				.build())
		.build())
```

当服务收到请求时，在一个事务中执行以下操作：

- 将删除来自开发人员合作伙伴的现有 `FoodShoppingList` 数据。
- 来自请求的数据将被解析并存储在更新的 ` Shopping List Cluster` 中。

如果发生错误，则将拒绝整个请求并保留现有状态。

##### `publishShoppingReorderCluster`

此 API 用于发布 `ShoppingReorderCluster` 对象。

```kotlin
client.publishShoppingReorderCluster(
	PublishShoppingReorderClusterRequest.Builder()
		.setReorderCluster(
			ShoppingReorderCluster.Builder()
				...
				.build())
		.build())
```

当服务收到请求时，在一个事务中执行以下操作：

- 将删除来自开发人员合作伙伴的现有 `ShoppingReorderCluster` 数据。
- 来自请求的数据将被解析并存储在更新的 `Reorder Cluster` 中。

如果发生错误，则将拒绝整个请求并保留现有状态。

##### publishShoppingOrderTrackingCluster

截止到 `sdk v1.4.0`，Shopping order tracking 这个是一个新开发的功能

Shopping reorder 说的是我买了一个东西可能之后还会再买一次，比如说日用品，order tracking 是物流追踪

```kotlin
object GetShoppingOrderTrackingCluster {  
  
    private const val ACTION_LINK_URI = "mysheinlink://applink/order_detail"  
  
    fun getShoppingOrderTrackingCluster(): ShoppingOrderTrackingCluster {  
  
        val orderType = 10;  
  
        val builder = with(ShoppingOrderTrackingCluster.Builder()) {  
            // 必选  
            setTitle("order tracking title")  
            setStatus("订单已发货")  
            setShoppingOrderType(orderType)  
            setTrackingId("order trackingId:shin3121sdf489djsij")  
            setOrderTime(System.currentTimeMillis())  
            val readyTimeWindow = OrderReadyTimeWindow.Builder()  
                .setStartTimestampMillis(System.currentTimeMillis() - 10000L)  
                .setEndTimestampMillis(System.currentTimeMillis() + 10000000L)  
                .build()  
            setOrderReadyTimeWindow(readyTimeWindow)  
  
            // 可选  
            setOrderDescription("my order orderDescription")  
            setActionLinkUri(ACTION_LINK_URI.toUri())  
        }  
        return builder.build()  
    }  
}

val request = PublishShoppingOrderTrackingClusterRequest.Builder()  .setShoppingOrderTrackingCluster(GetShoppingOrderTrackingCluster.getShoppingOrderTrackingCluster())  
    .build()
client.publishShoppingOrderTrackingCluster(request)
```

##### `publishUserAccountManagementRequest`（其他类别可以共用）

此 API 用于发布登录卡。登录操作将用户定向到应用的登录页面，以便应用可以发布内容（或提供更个性化的内容）。

以下元数据是登录卡的一部分：

| Attribute 属性 | Requirement 要求     | Description 描述                                 |
| ------------ | ------------------ | ---------------------------------------------- |
| Action Uri   | 必须                 | 操作的 DeepLink（即导航到应用登录页面）                       |
| Image        | 可选 - 如果未提供，则必须提供标题 | 卡片上显示的图像<br><br>分辨率为 `1264x712` 的 `16x9` 宽高比图像 |
| Title        | 可选 - 如果未提供，则必须提供图像 | 卡片上的标题                                         |
| Action Text  | 可选                 | CTA 上显示的文本（即登录）                                |
| Subtitle     | 可选                 | 卡片上的可选子标题                                      |

```kotlin
var SIGN_IN_CARD_ENTITY =
  SignInCardEntity.Builder()
	  .addPosterImage(
		  Image.Builder()
			  .setImageUri(Uri.parse("http://www.x.com/image.png"))
			  .setImageHeightInPixel(500)
			  .setImageWidthInPixel(500)
			  .build())
	  .setActionText("Sign In")
	  .setActionUri(Uri.parse("http://xx.com/signin"))
	  .build()

client.publishUserAccountManagementRequest(
	PublishUserAccountManagementRequest.Builder()
		.setSignInCardEntity(SIGN_IN_CARD_ENTITY)
		.build());
```

当服务收到请求时，在一个事务中执行以下操作：

- 将删除来自开发人员合作伙伴的现有 `UserAccountManagementCluster` 数据。
- 来自请求的数据将解析并存储在更新的 `UserAccountManagementCluster` 群集中。

如果发生错误，则将拒绝整个请求并保留现有状态。

效果：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240607164812.png)

##### `updatePublishStatus`

如果由于任何内部业务原因，未发布任何集群，我们强烈建议使用 `updatePublishStatus` API 更新发布状态。这很重要，因为

- 在所有方案中提供状态（即使在内容已发布 （`STATUS == PUBLISHED`） 时也是如此，这对于填充使用此显式状态来传达集成的运行状况和其他指标的仪表板至关重要。
- 如果未发布任何内容，但集成状态未中断 （`STATUS == NOT_PUBLISHED`），则 Google 可以避免在应用运行状况信息中心中触发提醒。它确认从提供商的角度来看，由于预期情况而未发布内容。
- 它可以帮助开发人员深入了解数据何时发布与不发布。
- `Google` 可能会使用状态代码来提示用户在应用中执行某些操作，以便他们可以看到应用内容或克服它。

符合条件的发布状态代码列表为：

```kotlin
// Content is published
AppEngagePublishStatusCode.PUBLISHED,

// Content is not published as user is not signed in
AppEngagePublishStatusCode.NOT_PUBLISHED_REQUIRES_SIGN_IN,

// Content is not published as user is not subscribed
AppEngagePublishStatusCode.NOT_PUBLISHED_REQUIRES_SUBSCRIPTION,

// Content is not published as user location is ineligible
AppEngagePublishStatusCode.NOT_PUBLISHED_INELIGIBLE_LOCATION,

// Content is not published as there is no eligible content
AppEngagePublishStatusCode.NOT_PUBLISHED_NO_ELIGIBLE_CONTENT,

// Content is not published as the feature is disabled by the client
// Available in v1.3.1
AppEngagePublishStatusCode.NOT_PUBLISHED_FEATURE_DISABLED_BY_CLIENT,

// Content is not published as the feature due to a client error
// Available in v1.3.1
AppEngagePublishStatusCode.NOT_PUBLISHED_CLIENT_ERROR,

// Content is not published as the feature due to a service error
// Available in v1.3.1
AppEngagePublishStatusCode.NOT_PUBLISHED_SERVICE_ERROR,

// Content is not published due to some other reason
// Reach out to engage-developers@ before using this enum.
AppEngagePublishStatusCode.NOT_PUBLISHED_OTHER
```

如果由于用户未登录而导致内容未发布，我们建议发布登录卡。如果由于任何原因提供商无法发布登录卡，那么我们建议使用状态代码 `NOT_PUBLISHED_REQUIRES_SIGN_IN` 调用 `updatePublishStatus` API

```kotlin
client.updatePublishStatus(
   PublishStatusRequest.Builder()
     .setStatusCode(AppEngagePublishStatusCode.NOT_PUBLISHED_REQUIRES_SIGN_IN)
     .build())
```

##### deleteXXX

删除相关发布的 cluster

> 重要提示：仅当没有要发布的内容时才应调用删除 API。不要随后调用删除和发布 API 来替换内容，因为发布 API 本身就会执行此操作。在使用删除 API 之前，请联系 <engage-developers@google.com> 。

- `deleteRecommendationsClusters`
- `deleteFeaturedCluster`
- `deleteShoppingCartCluster`
- `deleteShoppingListCluster`
- `deleteShoppingReorderCluster`
- `deleteUserManagementCluster` 删除用户登录卡片，在登录后移除
- `deleteClusters`

```kotlin
client.deleteClusters(
    DeleteClustersRequest.Builder()
      .addClusterType(ClusterType.TYPE_FEATURED)
      .addClusterType(ClusterType.TYPE_RECOMMENDATION)
      // ...
      .build())
```

##### Error handling 错误处理

```kotlin
client.publishRecommendationClusters(
	PublishRecommendationClustersRequest.Builder()
	  .addRecommendationCluster(..)
	  .build())
  .addOnCompleteListener { task ->
	if (task.isSuccessful) {
	  // do something
	} else {
	  val exception = task.exception
	  if (exception is AppEngageException) {
		@AppEngageErrorCode val errorCode = exception.errorCode
		if (errorCode == AppEngageErrorCode.SERVICE_NOT_FOUND) {
		  // do something
		}
	  }
	}
  }
```

### 步骤三：处理 `broadcast intents`

除了通过作业发出发布内容 API 调用外，还需要设置 [`BroadcastReceiver`](https://developer.android.com/reference/android/content/BroadcastReceiver?hl=zh-cn) 来接收内容发布请求

目的：广播 intent 主要用于重新激活应用和强制同步数据。不应过于频繁地发送广播 intent。仅在 Engage Service 确定内容可能已过时（例如，内容是一周前的）的情况下，广播 intent 才会触发。这样一来，开发者将更加确信，即使应用长时间未执行，用户也能够获得新鲜的内容体验。

必须通过以下两种方式设置 `BroadcastReceiver`：

- 使用 `Context.registerReceiver()` 动态注册 `BroadcastReceiver` 类的实例。这样一来，仍位于内存中的应用即可进行通信。

```kotlin
 private fun registerBroadcastReceiver(context: Context) {  
    // Register Recommendation Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(Intents.ACTION_PUBLISH_RECOMMENDATION),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
  
    // Register Featured Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(Intents.ACTION_PUBLISH_FEATURED),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
  
    // Register Shopping Cart Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(ShoppingIntents.ACTION_PUBLISH_SHOPPING_CART),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
  
    // Register Shopping List Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(ShoppingIntents.ACTION_PUBLISH_SHOPPING_LIST),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
  
    // Register Reorder Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(ShoppingIntents.ACTION_PUBLISH_REORDER_CLUSTER),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
    // Register Reorder Cluster Publish Intent  
    ActivityCompat.registerReceiver(  
        context,  
        mReceiver,  
        IntentFilter(ShoppingIntents.ACTION_PUBLISH_SHOPPING_ORDER_TRACKING_CLUSTER),  
        ContextCompat.RECEIVER_EXPORTED  
    )  
}
```

- 在 `AndroidManifest.xml` 文件中使用 `<receiver>` 标记静态声明实现。这样一来，应用便可以在未运行时接收广播 intent，并且应用也可以发布内容。

```xml
<receiver
	android:name=".AppEngageBroadcastReceiver"
	android:enabled="true"
	android:exported="true">
	<intent-filter>
		<action android:name="com.google.android.engage.action.PUBLISH_RECOMMENDATION" />
	</intent-filter>
	<intent-filter>
		<action android:name="com.google.android.engage.action.PUBLISH_FEATURED" />
	</intent-filter>
	<intent-filter>
		<action android:name="com.google.android.engage.action.shopping.PUBLISH_SHOPPING_CART" />
	</intent-filter>
	<intent-filter>
		<action android:name="com.google.android.engage.action.shopping.PUBLISH_SHOPPING_LIST" />
	</intent-filter>
	<intent-filter>
		<action android:name="com.google.android.engage.action.shopping.PUBLISH_REORDER_CLUSTER" />
	</intent-filter>
	<intent-filter>
		<action android:name="com.google.android.engage.action.shopping.PUBLISH_SHOPPING_ORDER_TRACKING_CLUSTER" />
	</intent-filter>
</receiver>
```

该服务会发送以下 [intent](https://developer.android.com/reference/android/content/Intent?hl=zh-cn)：

- `com.google.android.engage.action.PUBLISH_RECOMMENDATION` 建议在收到此 intent 时启动 `publishRecommendationClusters` 调用。
- `com.google.android.engage.action.PUBLISH_FEATURED` 建议在收到此 intent 时启动 `publishFeaturedCluster` 调用。
- `com.google.android.engage.action.shopping.PUBLISH_SHOPPING_CART` 建议在收到此 intent 时启动 `publishShoppingCart` 调用。
- `com.google.android.engage.action.shopping.PUBLISH_SHOPPING_LIST` 建议在收到此 intent 时启动 `publishShoppingList` 调用。
- `com.google.android.engage.action.shopping.PUBLISH_REORDER_CLUSTER` 建议在收到此 intent 时启动 `publishReorderCluster` 调用。
- `com.google.android.engage.action.shopping.PUBLISH_SHOPPING_ORDER_TRACKING_CLUSTER`

### 其他类别 SDK 集成

- Watch: [Engage SDK Watch：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/watch)
- Listen: [Engage SDK Listen：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/listen)
- Read: [Engage SDK Read：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/read)
- Food: [Engage SDK Food：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/food)
- Social: [Engage SDK Social：第三方技术集成说明  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/social)

## 集群 publish 指南

[Engage SDK Cluster 发布指南  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage/publish)

本指南包含一组集群发布指南，开发人员在与 Engage SDK 集成时可以使用这些指南。

### Recommendation clusters 推荐集群 s

#### Cluster Title

我们建议提供一个独特且相关的集群标题，让用户能够更深入地了解集群的内容。

以下是一些基于内容的良好集群标题的示例：

##### Shopping-related clusters 购物相关集群

- _`Lightning Deals` 秒杀优惠_
- _`Weekly must buys` 每周必买_
- _`Related to your purchase of Pixel Buds` 与您购买 Pixel Buds 相关_
- _`Women’s rain boots` 女式雨鞋_

##### Clusters of books on health 健康书籍簇

- _`Health, mind & body` 健康、精神和身体_
- _`Recommended for you in Health` 为您推荐健康类_
- _`Best-sellers in Fitness` 健身类畅销书_

#### Cluster Content 集群内容

发布推荐集群时，开发者必须考虑用户是否登录到开发者的应用程序。

##### 已登录

如果用户登录到开发者应用程序，我们建议发布个性化或用户生成的内容集群。由于个性化和用户生成的内容与用户更相关，因此他们更有动力从 Google 界面访问开发者应用程序。

- `Personalized recommendations can be published`. 可以发布个性化推荐。以下是个性化推荐的一些示例：
  - Top picks based on the user's watch history. 基于用户观看历史记录的首选。
  - Books similar to books that are in the user's read history. 与用户阅读历史中的书籍相似的书籍。
  - Songs by the user's favorite artists. 用户最喜欢的艺术家的歌曲。
- User-generated content libraries can be published. 可以发布用户生成的内容库。以下是用户生成的内容库的一些示例：
  - The user's watchlist from the developer app. 来自开发者应用程序的用户监视列表。
  - A self-reported list of the user's favorite artists from the developer app. 来自开发者应用程序的用户最喜欢的艺术家的自我报告列表。

| Recommendation type 推荐类型                       | Content freshness strategy  <br>内容新鲜度策略                                                                                                                     | Content freshness guideline  <br>内容新鲜度准则                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personalized recommendations  <br>个性化推荐        | **Lenient 宽容**<br><br>We recommend updating the recommendations once per day so users can see new recommendations daily.  <br>我们建议每天更新一次推荐，以便用户每天都可以看到新的推荐。 | Because users do not have an exact expectation of what the recommendation content will be, the content freshness strategy can be lenient.  <br>由于用户对推荐内容没有确切的预期，因此内容新鲜度策略可以比较宽松。                                                                                                                                                                                                                                  |
| User-generated content libraries  <br>用户生成的内容库 | **Strict 严格的**<br><br>We recommend updating the content library as users exit the developer app.  <br>我们建议在用户退出开发者应用程序时更新内容库。                               | It's important for this content to be in sync with the data displayed on Google surfaces. This is because unlike personalized recommendations, the user expects an exact set of content. Any significant delay in publishing will confuse users.  <br>此内容与 Google 界面上显示的数据同步非常重要。这是因为与个性化推荐不同，用户期望一组精确的内容。发布的任何重大延迟都会让用户感到困惑。  <br>Therefore, the content freshness strategy must be strict.  <br>因此，内容新鲜度策略必须严格。 |

##### 未登录

如果用户未登录开发者应用，我们仍然建议发布集群，以便鼓励用户从 Google Surface 访问开发者应用。

- Non-personalized recommendation clusters should be published. 应发布非个性化推荐簇。以下是一些非个性化推荐的示例：
  - Top 10 books read this year. 今年阅读的前十本书。
  - Newly released movies. 新上映的电影。
  - Trending podcasts. 热门播客。
- Publish a sign-in card. 发布签到卡。
  - 为了鼓励用户登录开发者应用，开发者可以选择在发布非个性化推荐集群的同时发布登录卡。请查看以下部分，了解有关如何发布登录卡的更多详细信息 [Sign In Card](https://developer.android.com/guide/playcore/engage/publish#user-management-cluster-signin).。

| Recommendation type 推荐类型                     | Content freshness strategy  <br>内容新鲜度策略                                                                                                                                                                                                                                                                             | Content freshness guideline  <br>内容新鲜度准则                                                                                                                                                                                                                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Non-personalized recommendations  <br>非个性化推荐 | **Lenient 宽容**<br><br>We recommend updating the recommendations once per day.  <br>我们建议每天更新一次建议。                                                                                                                                                                                                                    | Because users do not have an exact expectation of what the recommendation content will be, the content freshness strategy can be lenient.  <br>由于用户对推荐内容没有确切的预期，因此内容新鲜度策略可以比较宽松。                                                                                                                                        |
| Sign-in card in recommendations  <br>推荐中的登录卡 | **Strict 严格的**<br><br>We recommend updating the sign-in card state as users exit the developer app.  <br>我们建议在用户退出开发者应用程序时更新登录卡状态。<br><br>After users have signed in, developers must delete the card by calling `deleteUserManagementCluster()` API.  <br>用户登录后，开发者必须通过调用 `deleteUserManagementCluster()` API 删除卡片。 | It's important for the sign-in state to be in sync with the Google surface. It's confusing for a user to see a sign-in card on Google's surface when they're already signed in. Therefore, the content freshness strategy must be strict.  <br>登录状态与 Google 界面同步非常重要。当用户已经登录时，在 Google 界面上看到登录卡会让他们感到困惑。因此，内容新鲜度策略必须严格。 |

### Continuation clusters

##### 已登录

示例：

- Continue Watching from where the user left off. 从用户停止的地方继续观看。
- Continue Reading from where the user left off. 从用户上次停下的地方继续阅读。

| Continuation type 延续型                               | Content freshness strategy  <br>内容新鲜度策略                                                                                       | Content freshness guideline  <br>内容新鲜度准则                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User-generated continuation clusters  <br>用户生成的延续集群 | **Strict 严格的**<br><br>We recommend updating the content library as users exit the developer app.  <br>我们建议在用户退出开发者应用程序时更新内容库。 | It's important for this content to be in sync with the data displayed on Google's surfaces. This is because unlike personalized recommendations, the user expects an exact set of content. Any significant delay in publishing will confuse users.  <br>此内容与 Google 界面上显示的数据同步非常重要。这是因为与个性化推荐不同，用户期望一组精确的内容。发布的任何重大延迟都会让用户感到困惑。  <br>Therefore, the content freshness strategy must be strict.  <br>因此，内容新鲜度策略必须严格。 |

##### 未登录

`Continuation clusters` 主要面向登录用户；但是，如果您的应用程序支持访客会话，您还可以为注销用户发布 `Continuation clusters`。

### User Management Cluster 用户管理集群

`User Management Cluster` 的主要目的是促使用户在提供商应用程序上执行某些操作。登录操作将用户引导至应用程序的登录页面，以便应用程序可以发布内容（或提供更个性化的内容）

具体见： [[#Sign In Card]]

### WorkManager for cluster publishing

推荐使用 WorkManager 来发布集群，因为它是后台工作的推荐解决方案，执行必须是机会性的和有保证的。

- WorkManager 会尽快执行您的后台工作。
- WorkManager 处理在各种条件下开始工作的逻辑，即使用户离开您的应用程序也是如此。

当用户离开应用程序时，我们建议启动一个后台作业来发布延续集群和推荐集群。处理此逻辑的一个好地方是 `Activity.onStop()` ，当用户离开应用程序时调用它。

我们建议使用 `PeriodicWorkRequest` 安排一个每 24 小时发布一次集群的重复作业。通过使用 `CANCEL_AND_REENQUEUE` 策略来触发工作，开发人员可以确保 WorkManager 在用户每次离开应用程序时发送更新的数据。这有助于防止用户看到过时的数据。

```kotlin
// Define the PublishClusters Worker requiring input
public class PublishClusters extends Worker {

   public PublishClusters(Context appContext, WorkerParameters workerParams) {
       super(appContext, workerParams);
   }

   @NonNull
   @Override
   public Result doWork() {
       // publish clusters
   }
   ...
}

public static void schedulePublishClusters(Context appContext) {
// Create a PeriodicWorkRequest to schedule a recurring job to update
// clusters at a regular interval
PeriodicWorkRequest publishClustersEntertainmentSpace =
// Define the time for the periodic job
       new PeriodicWorkRequest.Builder(PublishClusters.class, 24, TimeUnit.HOURS)
// Set up a tag for the worker.
// Tags are Unique identifier, which can be used to identify that work
// later in order to cancel the work or observe its progress.
          .addTag("Publish Clusters to Entertainment Space")
          .build();

// Trigger Periodic Job, this will ensure that the periodic job is triggered
// only once since we have defined a uniqueWorkName
WorkManager.getInstance(appContext).enqueueUniquePeriodicWork(
// uniqueWorkName
     "publishClustersEntertainmentSpace",
// If a work with the uniqueWorkName is already running, it will cancel the
// existing running jobs and replace it with the new instance.
// ExistingPeriodicWorkPolicy#CANCEL_AND_REENQUEUE
     ExistingPeriodicWorkPolicy.CANCEL_AND_REENQUEUE,
// Recurring Work Request
publishClustersEntertainmentSpace);

}
```

### 处理广播 intent

除了通过作业发出发布内容 API 调用外，还需要设置 [`BroadcastReceiver`](https://developer.android.com/reference/android/content/BroadcastReceiver?hl=zh-cn) 来接收内容发布请求。

但是，**开发者必须格外小心，不要只依赖于广播**，因为广播只有在特定情况（主要是指重新激活应用和强制同步数据的情况）下才会触发。**只有在 Engage Service 确定内容可能已过时的情况下，广播才会触发。**这样一来，即使用户已很长时间没有打开应用，系统也能更有效地保证用户获得新鲜的内容体验。

必须通过以下两种方式设置 `BroadcastReceiver`：

- 使用 `Context.registerReceiver()` 动态注册 `BroadcastReceiver` 类的实例。这样一来，仍位于内存中的应用即可进行通信。
- 在 `AndroidManifest.xml` 文件中使用 `<receiver>` 标记对实现进行静态声明。这样一来，应用便可以在未运行时接收广播 intent，并且也可以发布内容。

[Engage SDK Cluster 发布指南  |  Android Developers](https://developer.android.com/guide/playcore/engage/publish?hl=zh-cn#broadcast-intents)

## Engage SDK FAQ

### publish FAQs

#### 谁管理内容发布工作？

应用程序开发人员管理内容发布作业并向 `Engage Service` 发送请求。通过这种方式，开发者合作伙伴可以更好地控制何时以及如何向用户发布内容。这可以避免过于频繁地唤醒合作伙伴应用程序来发布内容。

#### 开发者是否需要发布所有集群类型？

虽然从技术上讲，开发人员可以自由地仅发布一个集群，但我们强烈建议包括更多集群。否则，开发者就会错失提高内容互动度的机会。我们强烈建议发布每个垂直领域的所有集群类型。

#### 在应用程序运行时，开发人员合作伙伴应该多久通过 `WorkManager` 发布数据？

这由开发合作伙伴决定。

Google 建议每天发布一次或两次一般 `recommendation` 内容，并对 `shopping cart`、`reorder` 和其他 `continuation` 内容使用事件驱动的方法（例如，启动工作线程作为用户将商品添加到购物车或用户中途停止电影）。

- Recommendation cluster，一天发布 1 次或 1 次
- `Shopping cart` 、 `Reorder` 和 `Continuation` 使用事件驱动时发布，如加入购物车

#### 开发者应该什么时候调用删除 API？

仅当没有要发布的内容时才应调用删除 API。后续不要调用删除、发布接口替换内容；发布 API 会自动删除较早的内容。

### Broadcast Intent FAQs

#### 为什么 Android 应用开发者需要注册广播意图？

为了向用户提供新鲜内容，您应该在用户可能不经常使用应用程序的情况下使用广播意图来触发数据同步。

广播在每次 Cutes 页面启动会执行？

#### 不允许后台执行

在注册广播意图时，您可能会遇到以下错误：

```java
Background execution not allowed: receiving Intent
{ act=com.google.android.engage.action.PUBLISH_RECOMMENDATION .. }
```

您需要动态注册广播接收器。

```java
class AppEngageBroadcastReceiver extends BroadcastReceiver {
	// Trigger recommendation cluster publish when PUBLISH_RECOMMENDATION broadcast
	// is received
}

public static void registerBroadcastReceivers(Context context) {
	context = context.getApplicationContext();
	// Register Recommendation Cluster Publish Intent
	context.registerReceiver(new AppEngageBroadcastReceiver(),
	new IntentFilter(com.google.android.engage.service.Intents.ACTION_PUBLISH_RECOMMENDATION));
	//...
}
```

### 疑问

#### Engage SDK 提供的广播 Action，能否在清单文件注册，是否受 Android 8.0 限制

建议的是同时注册，manifest 静态注册和 application context 动态 都注册一下

> 官方提供的 samples，两种方式都注册了，需要注意 receiver 的 onReceive 会执行两次

#### 如何在 Google Play Store 上测试？对 Play 商店版本有什么需求吗？

测试的话，如果想在 Play store 测试的话，需要在 `verify app` 验证通过之后然后发 apk 到我们这里做一下初步的内部校验，然后我们会把你们的 account 加到我们的白名单里就可以了

最新版本的 Play 商店就好，最好是用海外版本的手机

校验需要个 2~3 天

#### APP 卸载后集群是否还在？

通过在 verify app 测试，APP 卸载后，集群发布状态就被移除了；

在 Google Play 上，如果 App 被卸载了，Google Play Cubes 也不会存在了

#### actionUri 能否用 `onelink`？

可以的，`deeplink` 和 `onelink` 都可以

#### 登录后，`SignInCardEntity` 要移除吗？

登录后，通过 `deleteUserManagementCluster` 把 Sign in Card 移除掉

#### 退出登录后，已发布的集群处理

退出登录后，涉及到需要登录才能发布的集群，应当 delete 掉；不需要登录的更新下数据就好了

#### Cubes 入口显示条件和命令

**Cubes 入口显示条件**

1. 美国 VPN
2. 不要挂抓包代理，如 Charles
3. Google Play 账号白名单
4. Google Play 最新的版本

Google Play Cubes 提供 Widget 有入口，

**adb 命令启动 Cubes：**
也可以用命令：`adb shell am start -n com.android.vending/com.google.android.finsky.rubiks.cubes.activity.CubesActivity`

访问不了 Cubes，一般是网络问题：

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240607142546.png)

首次启动

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240607142510.png)

#### 接口调用时机，提供哪些数据，数据什么时候更新

**接口调用时机？**
在调用集群发布后，就需要调用接口；或者之前就要调用接口，把要发布集群所需要的数据准备好

提供哪些数据？

不同的集群提供的数据不一样，具体看上面不同集群所需要的数据

数据什么时候更新？

- 不同集群不一样
- 推荐的集群，数据不需要依赖登录，变更不大的数据，一天更新一次即可
- 像 `Shopping Cart` 集群，强依赖用户登录、加入移除购物车的操作的，在登录、加车操作后就需要更新数据

#### v1.5.1 sdk 问题

- v1.5.1 的 Shopping cart setActionText 还是不生效，设置后还是默认的 View cart。

> 前端同学把这个 feature 给漏掉了，所以现在默认都是 view cart。我们会在之后的版本里更新上

### 常见错误

#### 发布的卡片加载不出来

```
Error while loading the image http://img.ltwebstatic.com/images3_pi/2024/02/20/dd/17083979518bfa684b0ee5d2264e922efd9dd0ce98_thumbnail_405x552_thumbnail_1200x1200.jpg 
java.net.UnknownServiceException: CLEARTEXT communication to img.ltwebstatic.com not permitted by network security policy
```

原因：Image 用了 http 协议

解决：用 https 协议

#### The input calling package name com.xxx is not installed by Play Store

**问题描述：** 通过系统 APK 安装器，发布 Cubes 时报错了：
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624204609.png)
![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624224715.png)
或者是下面的报错：

> SERVICE_CALL_INVALID_ARGUMENT - The request contains invalid data (e.g. more than allowed number of clusters (5)

通过 adb install 安装的没有报错：

![image.png|1500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240624205045.png)

**分析：** Google Play Cubes 对 Production 的包的限制，必须是 Google Play 下载安装的包，通过三方浏览器下载的包不能发布 Cubes。

**解决：** 未发布上线到 Google Play 前，只能通过 adb install 这种方式才能发布内容到 Cubes；上线后应该直接从 Google Play 安装就能发布了，通过扫码下载安装是看不到发布的内容

## Ref

- [Engage SDK  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/playcore/engage?hl=zh-cn)
- [企微文档 Google Play CUBES 调研](https://doc.weixin.qq.com/doc/w3_AYoAawZvANgkO27mwZ2T1O47XiedB?scode=APMA2QcuAAkUXVSqojAV8APQbRAC8)
- [企微文档 Google Play CUBES](https://doc.weixin.qq.com/doc/w3_AVUAVAb3AAk2qx40WqDQo68avof3W?scode=APMA2QcuAAkAz65qjvAV8APQbRAC8)
