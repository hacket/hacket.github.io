---
date created: 2024-12-23 23:21
date updated: 2024-12-23 23:21
dg-publish: true
---

## Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.8.0, expected version is 1.6.0.

**报错：**

> /Users/10069683/.gradle/caches/transforms-3/638bdc2f3e1ec12bf62601ed14331206/transformed/jetified-firebase-analytics-ktx-21.2.2-api.jar!/META-INF/java.com.google.android.libraries.firebase.firebase_analytics_ktx_granule.kotlin_module: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.8.0, expected version is 1.6.0.

**分析：**<br />当前`kotlin_version = '1.6.0'`，在引入了Firebase Remote Config后，编译报错了

```groovy
// Import the BoM for the Firebase platform
implementation platform('com.google.firebase:firebase-bom:32.0.0')
// Add the dependencies for the Remote Config and Analytics libraries
// When using the BoM, you don't specify versions in Firebase library dependencies
implementation 'com.google.firebase:firebase-config-ktx'
implementation 'com.google.firebase:firebase-analytics-ktx'
```

�**解决：**<br />改`kotlin_version = '1.7.0'`，kotlin compiler版本：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684497730181-a65701b3-37cb-4650-87c2-da8ec365862d.png#averageHue=%23404348&clientId=u3c8ca99d-ab18-4&from=paste&height=282&id=u3818f4b6&originHeight=818&originWidth=1426&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156001&status=done&style=none&taskId=uf08dce41-aa9a-4ebd-bcf9-849fbad077e&title=&width=492)<br />�
