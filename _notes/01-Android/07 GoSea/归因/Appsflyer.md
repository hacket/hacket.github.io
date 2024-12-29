---
date created: 2024-07-01 11:15
date updated: 2024-12-24 00:26
dg-publish: true
---

# 什么是Appsflyer

# Appsflyer接入

## Install SDK

### SDK集成

- [Install SDK](https://zh.dev.appsflyer.com/hc/docs/install-android-sdk)

### The Google AD_ID permission

[the-ad_id-permission](https://zh.dev.appsflyer.com/hc/docs/install-android-sdk#the-ad_id-permission) API33需要

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

- If your app participates in the [Designed for Families](https://support.google.com/googleplay/android-developer/topic/9877766?hl=en&ref_topic=9858052) program:
  - If using SDK V6.8.0 and above, you should [Revoke the AD_ID permission](https://zh.dev.appsflyer.com/hc/docs/install-android-sdk#revoking-the-ad_id-permission).
  - If using SDK older than V6.8.0, don't add this permission to your app.
- For apps that target API level 32 (Android 12L) or older, this permission is not needed.

## Uninstall measurement

- [Uninstall measurement](https://dev.appsflyer.com/hc/docs/uninstall-measurement-android)

## 测试

### 测试设备加白

1. 手动
2. 自动，[下载并安装名为“My Device ID by AppsFlyer”的应用](https://support.appsflyer.com/hc/zh-cn/articles/207031996#add-a-device-using-the-appsflyer-device-id-app-admin-only)

### 实时测试

<https://hq1.appsflyer.com/sdk-integration-test/app/me.hacket.assistant.samples>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686196859976-2ad761d4-d061-488a-ae76-878025631c0d.png#averageHue=%23deac81&clientId=u6a8fc653-f54a-4&from=paste&height=729&id=u8cda7de1&originHeight=1458&originWidth=2848&originalType=binary&ratio=2&rotation=0&showTitle=false&size=298441&status=done&style=none&taskId=u8f49c6a3-72d4-4755-9833-fdff2e73295&title=&width=1424)
