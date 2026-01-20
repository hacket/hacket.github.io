---
banner: 
date_created: Friday, April 12th 2024, 10:41:00 pm
date_updated: Friday, February 14th 2025, 11:32:06 pm
title: Google Play Billing
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
date created: 2024-04-08 13:48
date updated: 2024-12-24 00:33
aliases: [Google 支付接入流程]
linter-yaml-title-alias: Google 支付接入流程
---

[Google Play 结算系统  |  Google Play's billing system  |  Android Developers](https://developer.android.com/google/play/billing)

# Google 支付接入流程

## 一、注册开发者账号

注册链接<https://play.google.com/apps/publish/signup/>

### 1.1、注册 Google 账号并登陆

### 1.2、支付注册费用 ( $25 )

注册开发者账号是需要支付 $25 美元，需要使用国外信用卡或者是在国内申请的 visa 卡 (visa 信用卡建议申请双币卡 (就是在国内外都能使用的))。

### 1.2、填写账号详细信息

**另外，如果要发布付费应用，还需要设置 Google Checkout 商家账户，也就是绑定一张非大陆的银行卡进行收款，建议是香港或者国外的。**

## 二、新建一个 APP 项目

控制台链接<https://play.google.com/apps/publish/?authuser=0>

### 2.1、新建一个项目

![2mlj4](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2mlj4.png)

### 2.2、配置应用版本

![8eup2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8eup2.png)应用版本分四大类：

- 正式版<br />当您创建正式版后，应用的此版本便可供您指定的国家/地区的所有用户使用。
- Beta 版<br />在您完成封闭式版本的测试后，即可创建开放式测试版。您可以让更多的用户参与开放式版本测试，然后再发布应用的正式版。
- Alpha 版<br />要测试应用的预发布版，并邀请较多测试人员参与，请创建封闭式测试版。在让少量的员工或受信任的用户进行测试后，便可以扩展测试范围进行开放式版本测试。应用版本页面中将提供一个 Alpha 版轨道，供您首次进行封闭式测试时使用。您还可以视需要创建其他封闭式轨道，并为其命名。
- 内部测试<br />要快速分发应用以进行内部测试和质量保证检查，请创建内部测试版。

### 2.3、填写其他信息

**在应用详情左侧的菜单栏中有对号标识的都必须填写**

### 2.4、配置应用内商品

todo 待补充

商品类型说明：

- 一次性消耗型商品<br />发生一次购买并且确认消费 (调用它提供的方法即可确认消费) 后可继续购买。
- 订阅型商品<br />首次订阅后，google 商店中当前账号下的订阅菜单选项中会生成一个订阅，可在 Google 商店中取消订阅，若没有取消订阅时，会自动续订。

## 三、接入 Google 支付

官方文档链接<https://developer.android.com/google/play/billing/billing_overview?hl=zh-cn>

准备好以上的工作之后就可以在 APP 中接入 Google 支付了。

google play 支付服务，具体使用可参考官方 [demo](https://github.com/android/play-billing-samples)。

依赖包

```groovy
 com.android.billingclient:billing:2.0.1
```

APP 中接入流程参考：

### 3.1、判断当前设备是否支持 Google 服务

添加 `com.google.android.gms:play-sevices-base:17.0.0`

```kotlin
	 /**
     * 检查 Google Play 服务
     */
    @JvmStatic
    fun onCheckGooglePlayServices(activity: Activity) {
        // 验证是否已在此设备上安装并启用Google Play服务，以及此设备上安装的旧版本是否为此客户端所需的版本
        val code = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(activity)
        if (code == ConnectionResult.SUCCESS) {
            // 支持Google服务
            LogUtils.i(TAG, "支持Google服务")
        } else {
            GoogleApiAvailability.getInstance()
                    .makeGooglePlayServicesAvailable(activity)
                    .addOnCanceledListener {
                        LogUtils.w(TAG, "Google服务cancel")
                    }
                    .addOnFailureListener { e->
                        LogUtils.printStackTrace(e)
                        LogUtils.w(TAG, "Google服务failure ${e.message}")
                    }
                    .addOnSuccessListener {
                        LogUtils.i(TAG, "Google服务success")
                    }
                    .addOnCompleteListener {
                        LogUtils.i(TAG, "Google服务complete")
                    }
            ToastAndDialog.makeText(activity, "不支持Google服务.").show()
            //不支持时，可以利用getErrorDialog得到一个提示框, 其中第2个参数传入错误信息
            //提示框将根据错误信息，生成不同的样式
            //例如，我自己测试时，第一次Google Play Service不是最新的，
            //对话框就会显示这些信息，并提供下载更新的按键
            if (GoogleApiAvailability.getInstance().isUserResolvableError(code)) {
                GoogleApiAvailability.getInstance().getErrorDialog(activity, code, 0).show()
            }
        }
    }
```

### 3.2、连接 Google play 服务

**这步可能会失败，有可能是你的 Google 账号的付款方式设置的不对，详见 4.1 测试账号准备**

- 初始化 BillingClient:

```java
 public BillingClientManager init(Context context) {
        mBillingClient = BillingClient.newBuilder(context).enablePendingPurchases().setListener(this).build();
        return this;
    }
```

- 连接服务

```java
 /**
     * 连接支付服务
     */
    public void connectToPlayBillingService(BillingClientListener listener) {
        if (mBillingClient.isReady() == false) {
            mBillingClient.startConnection(this);
        }
    }
```

- 判断连接是否成功

```java
boolean isConnected =mBillingClient.isReady()
```

### 3.3、加载商品列表

```java
 mBillingClient.querySkuDetailsAsync(getInappSkuDetailsParams(), responseListener);

查询参数params：

 //在应用内商品页面中配置的商品的商品ID
    private static final String SUB_VIP_YEAR = "sub_vip_year";
    private static final String SUB_VIP_MOUTH = "sub_vip_mouth";
    private static final String SUB_THREE_MOUTH_VIP = "sub_three_mouth_vip";

    private static final String PERMANENT_FREE_VIP = "vip_of_one_yearly";


    public static List<String> INAPP_SKUS = Arrays.asList(PERMANENT_FREE_VIP);
    public static List<String> SUBS_SKUS = Arrays.asList(SUB_VIP_YEAR, SUB_VIP_MOUTH);

 public static SkuDetailsParams getInappSkuDetailsParams() {
        String skuType = BillingClient.SkuType.INAPP;
        return SkuDetailsParams.newBuilder().setSkusList(INAPP_SKUS).setType(skuType).build();
    }

    public static SkuDetailsParams getSubsProductList() {

        String skuTypeSubs = BillingClient.SkuType.SUBS;
        return SkuDetailsParams.newBuilder().setSkusList(SUBS_SKUS).setType(skuTypeSubs).build();

    }
```

### 3.3、购买商品

**这步可能会失败，有可能是你的 Google 账号的付款方式设置的不对，详见 4.1 测试账号准备**

- 发起购买

```java
 public void launchBillingFlow(Activity activity, SkuDetails skuDetails) {
        if (mBillingClient == null) {
            return;
        }
        if (BillingClient.SkuType.INAPP.equals(skuDetails.getType())) {
            BillingFlowParams purchaseParams = BillingFlowParams.newBuilder().setSkuDetails(skuDetails).build();
            mBillingClient.launchBillingFlow(activity, purchaseParams);
            return;
        }
        BillingFlowParams.Builder builder = BillingFlowParams.newBuilder();
        String productId = "";
        if (localPurchaseSet.size() != 0) {
            for (Purchase purchase : localPurchaseSet) {
                String sku = purchase.getSku();
                if (ProductRepository.getSubsProductList().getSkusList().contains(sku)) {
                    productId = sku;
                }
            }
        }
        //如果之前有订阅过 并且不同于将要订购的产品 那么就将它进行升级 例如月会员升级到年会员
        if (StringUtils.isNotBlank(productId) && !productId.equals(skuDetails.getSku())) {
            builder.setOldSku(productId);
        }
        BillingFlowParams params = builder.setSkuDetails(skuDetails).build();
        mBillingClient.launchBillingFlow(activity, params);
    }
```

- 购买成功之后获取回调信息，需要确认购买

```java
 @Override
    public void onPurchasesUpdated(BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult == null) {
            return;
        }
        LogUtils.d(TAG, "Purchases发生了变化=>" + billingResult.getResponseCode());

        switch (billingResult.getResponseCode()) {
            case BillingClient.BillingResponseCode.OK:
                acknowledged(purchases);
                break;
            case BillingClient.BillingResponseCode.SERVICE_DISCONNECTED:
                if (mBillingClient.isReady() == false) {
                    mBillingClient.startConnection(this);
                }
                break;
            case BillingClient.BillingResponseCode.USER_CANCELED:
                //用户取消了支付
                if (getBillingClientListener() != null) {
                    getBillingClientListener().onConsumeFail(AppUtils.getString(R.string.user_canceled_play));
                }
                break;
            default:
                if (getBillingClientListener() != null) {
                    getBillingClientListener().onConsumeFail(billingResult.getDebugMessage());
                }
                break;
        }


    }
     /**
     * 确认消费订单
     */
    private void acknowledged(@Nullable List<Purchase> purchases) {
        Set<Purchase> inapPpurchaseSet = new HashSet<>();
        Set<Purchase> subsPurchases = new HashSet<>();
        //未确认的账单调用确认方法
        for (Purchase purchase : purchases) {
            if (ProductRepository.SUBS_SKUS.contains(purchase.getSku())) {
                subsPurchases.add(purchase);
            } else if (ProductRepository.INAPP_SKUS.contains(purchase.getSku())) {
                inapPpurchaseSet.add(purchase);
            }
        }
        handleConsumablePurchasesAsync(inapPpurchaseSet, null);
        acknowledgeNonConsumablePurchasesAsync(subsPurchases, null);
    }
```

## 四、如何测试购买

官方文档链接<https://developer.android.com/google/play/billing/billing_testing?hl=zh-cn>

### 4.1、测试账号准备

**在连接服务或付款时，会去 Google 商店中验证你当前在商店中登录的账号是否有购买商品的资格 (中国区的 Google 账号没有设置付款方式时会连接不上)。**

**如何使你的 Google 账号能够在应用内购买商品?**

- 准备<br />一张 visa 信用卡，一个从未设置付款方式的 Google 账号。
- 设置流程：<br />在 Google play 中登录你的 Google 账号并 [设置付款方式](https://pay.google.com/gp/w/u/1/home/paymentmethods?sctid=2951382848143197)，

在设置付款详情时，需要注意的是，你的账单地址需要填写外国地址。你可以打开 Google map 随便点击一个地址，上面会显示相应的地址和邮编等信息，填写上去就 OK 了。

### 4.2、在测试人员列表中添加需要测试的测试账号

发布到内部测试渠道的 APP，如果其他人需要测试购买流程，需要在测试人员列表中添加测试人的 Google 账号。<br />

![xetat](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/xetat.png)

## 五、其他

### 5.1、购买成功之后能获取到什么信息？

| 参数名           | 参数解释 |
| ------------- | ---- |
| orderId       | 订单 ID |
| packageName   | 应用名  |
| productId     | 商品 ID |
| purchaseTime  | 购买时间 |
| purchaseToken | 购买令牌 |

### 5.2、能获取到的订单信息的方式有哪些？

查询订单分两种方式查询：

- queryPurchases<br />Google Play 会返回登录到设备的用户帐号发起的购买交易。如果请求成功，则 Google Play 结算库会将查询结果存储在 Purchase 对象的 List 中。queryPurchases() 方法会使用 Google Play 商店应用的缓存，而不会发起网络请求。
- queryPurchaseHistoryAsync<br />如果需要查看用户针对每个商品 ID 发起的最近一笔购买交易，可以使用 queryPurchaseHistoryAsync()，并传入购买类型和 PurchaseHistoryResponseListener 以处理查询结果。<br />**需要注意的是查询订单信息只能查询到每一种商品的最近一次购买订单**

### 5.3、订阅商品需要注意哪些？

官方文档<https://developer.android.com/google/play/billing/billing_subscriptions?hl=zh-cn>

用户订购的商品会自动续订，用户可以在 Google play 商店中查看并操作 (取消订阅等操作) 自己订阅的商品。到期时用户续订是否成功，在客户端去查询订单信息的时候是不能确定的，需要通过后端接入 [Google Play Developer API](https://developer.android.com/google/play/developer-api.html?hl=zh-cn) 才能知晓用户是否已经续订成功。
