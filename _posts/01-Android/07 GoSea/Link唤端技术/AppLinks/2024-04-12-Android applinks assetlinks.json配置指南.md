---
date_created: Invalid date
date_updated: Wednesday, January 22nd 2025, 12:46:12 am
title: Android applinks assetlinks.json配置指南
author: hacket
categories: 
category: 
tags: []
toc: true
description: 
dg-publish: false
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-04-17 17:18
date updated: 2024-12-24 00:35
aliases: [Android `applinks` 配置指南]
linter-yaml-title-alias: Android `applinks` 配置指南
---

# Android `applinks` 配置指南

## 如何配置 `assetlinks.json`？

1. 配置路径：`https://[域名]/.well-known/assetlinks.json`，将 `[域名]` 替换成要配置的域名即可，将 `[域名]` 替换成要配置的域名即可，不要带 path，只需要配置 host 部分

> 配置好后就是：<https://shein.com.co/.well-known/assetlinks.json>)

2. 哪里取 assetlinks.json？见下面的 `shein app assetlinks.json文件` 和 `romwe app assetlinks.json文件`
3. 注意：shein 和 rowme app 的 assetlinks.json 内容不一样，别配置错了

例如：域名 `app.shein.com.mx` 配置后的链接<br>[https://app.shein.com.mx/.well-known/assetlinks.json](https://onelink.shein.com.mx/.well-known/assetlinks.json)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703659828906-db0a6647-3ea6-40ec-af3b-522ee098251e.png#averageHue=%23f6f6f6&clientId=ufa70c6c7-8fbc-4&from=paste&height=446&id=u1496ff1f&originHeight=892&originWidth=2142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171683&status=done&style=none&taskId=uefadb9b6-285e-47f5-b07d-311684847d3&title=&width=1071)

## shein app assetlinks.json 文件

方法有 3 种，任取一种即可

1. 直接下载 shein app 的 assetlinks.json 配置：[assetlinks.json](https://www.yuque.com/attachments/yuque/0/2023/json/694278/1703662792112-6aa6d64b-4a26-4263-bbd4-00fe2027befa.json?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjson%2F694278%2F1703662792112-6aa6d64b-4a26-4263-bbd4-00fe2027befa.json%22%2C%22name%22%3A%22assetlinks.json%22%2C%22size%22%3A294%2C%22ext%22%3A%22json%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u6092311a-3e1a-4635-b4cc-850a2079260%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fjson%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u55750e74%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)
2. 从线上已有的配置拿，shein app 相关的取: <https://onelink.shein.com.mx/.well-known/assetlinks.json>
3. 将下面内容保存为 assetlinks.json：

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.zzkko",
      "sha256_cert_fingerprints": [
        "BE:88:6A:FB:C7:A9:A1:1D:E1:52:97:4F:BB:02:8C:8A:7B:B8:3A:45:62:53:60:2A:18:C7:13:C9:3F:E7:E5:20"
      ]
    }
  }
]
```

## romwe app assetlinks.json 文件

1. 直接下载 romweapp 的 assetlinks.json 配置 [assetlinks.json](https://www.yuque.com/attachments/yuque/0/2023/json/694278/1703662792279-2099c9f8-0543-4f91-9f19-681d4efa27c0.json?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fjson%2F694278%2F1703662792279-2099c9f8-0543-4f91-9f19-681d4efa27c0.json%22%2C%22name%22%3A%22assetlinks.json%22%2C%22size%22%3A252%2C%22ext%22%3A%22json%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u948c21cd-bbd6-4ce0-9746-15325965660%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fjson%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u325a288f%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)
2. 从线上已有的配置拿，romwe app 相关的取: <https://romwe.onelink.me/.well-known/assetlinks.json>
3. 将下面内容保存为 assetlinks.json：

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.romwe",
      "sha256_cert_fingerprints": [
        "0A:83:77:FA:B6:66:08:90:FB:5C:0F:99:58:E4:8B:3D:D6:86:EB:ED:DB:DF:32:21:08:0C:7D:71:76:CE:F9:18"
      ]
    }
  }
]
```

## 如何验证是否配置成功

### 方式一：浏览器直接打开

直接在浏览器打开查看 `https://[域名]/.well-known/assetlinks.json`，把域名替换成你配置的域名，如 [https://app.shein.com.mx/.well-known/assetlinks.json](https://onelink.shein.com.mx/.well-known/assetlinks.json)，能正常访问到你配置的 `assetlinks.json` 即可<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703660336444-b37969ee-6bc4-434c-bc41-6de37306f0e9.png#averageHue=%23f6f6f6&clientId=ufa70c6c7-8fbc-4&from=paste&height=482&id=u04673615&originHeight=964&originWidth=2142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=174581&status=done&style=none&taskId=ub628245d-d5a4-4675-8e82-40e3858d118&title=&width=1071)

### 方式二：Statement List Generator and Tester

<https://developers.google.com/digital-asset-links/tools/generator>，出现 Success 就表示成功配置<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703660539347-e183dbe1-4c45-4efd-8f48-ac70cc00b34b.png#averageHue=%23e0dede&clientId=ufa70c6c7-8fbc-4&from=paste&height=534&id=u39d53c09&originHeight=1068&originWidth=3140&originalType=binary&ratio=2&rotation=0&showTitle=false&size=305697&status=done&style=none&taskId=uc78e89ac-8e12-4b41-99df-e04cc61609a&title=&width=1570)

- shein app
  - package name： `com.zzkko`，固定值，不变
  - package fingerprint: `BE:88:6A:FB:C7:A9:A1:1D:E1:52:97:4F:BB:02:8C:8A:7B:B8:3A:45:62:53:60:2A:18:C7:13:C9:3F:E7:E5:20`，固定值，不变
- romwe app
  - package name： `com.romwe`，固定值，不变
  - package fingerprint: `0A:83:77:FA:B6:66:08:90:FB:5C:0F:99:58:E4:8B:3D:D6:86:EB:ED:DB:DF:32:21:08:0C:7D:71:76:CE:F9:18`，固定值，不变

> **注意：shein 和 romwe app 的都不一样**
