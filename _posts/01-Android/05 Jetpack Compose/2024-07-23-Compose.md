---
date created: 2024-07-23 01:58
date updated: 2024-12-24 00:34
dg-publish: true
---

# Compose遇到的问题

## java.lang.NoSuchMethodError: No static method setContent$default

### 现象

出现的这个问题比较恶心，编译啥的都能通过，也能安装成功，但是就是运行无法成功，启动就闪退。<br>将Compose集成到App中，编译通过，启动时崩溃报错：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1698340309727-020942af-35e2-480a-b4b3-71f5d9b5cb0e.png#averageHue=%233f3130&clientId=u5246dfd6-e0af-4&from=paste&height=285&id=u7efcade0&originHeight=427&originWidth=1363&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=149073&status=done&style=stroke&taskId=ud52d00bd-103c-4bab-88af-fbe0554864f&title=&width=908.6666666666666)<br><https://developer.android.com/jetpack/androidx/releases/compose-ui?hl=zh-cn#1.3.2><br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1698971823569-b056130d-1d5a-43fd-9013-fce56b274e1c.png#averageHue=%23ebeff8&clientId=u48c99259-d9f8-4&from=paste&height=297&id=u0b9170cb&originHeight=445&originWidth=1305&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=17323&status=done&style=stroke&taskId=u9c3ae6f4-9836-4c8b-9b1a-a855fcc566e&title=&width=870)

### 可能的原因

1. [Kotlin和Compose Compiler版本兼容问题](https://developer.android.google.cn/jetpack/androidx/releases/compose-kotlin?hl=en)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1698972220549-97b4cedc-c2ad-439b-8852-7656f8a2db13.png#averageHue=%23fefefe&clientId=u48c99259-d9f8-4&from=paste&height=336&id=u6d770ec8&originHeight=1111&originWidth=1306&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=13888&status=done&style=stroke&taskId=u8eb2dfc3-298a-45b8-80a1-3f44240b603&title=&width=395)

2. Compose Compiler没有生效

从报错信息看，再反编译看调用到的方法<br>调用的` setContent$default(Landroidx/activity/ComponentActivity;Landroidx/compose/runtime/CompositionContext;Lkotlin/jvm/functions/Function0;ILjava/lang/Object;)V  `是一个带Function0的方法，但没有这个方法<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699337265177-cb7f9cf0-e838-472e-ab61-1b9de447a762.png#averageHue=%23f9f9f8&clientId=u99d84ce1-25c3-4&from=paste&height=196&id=udbc62226&originHeight=392&originWidth=1716&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93281&status=done&style=stroke&taskId=u94be5b0a-45d4-47cf-a752-5c0e0a4b7e4&title=&width=858)<br>但androidx.activity.compose�.ComponentActivity.setDefault的是Function2<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699337400015-dd5214a4-8707-4cd0-8661-27cdee5eded3.png#averageHue=%23f4f3f2&clientId=u99d84ce1-25c3-4&from=paste&height=416&id=u4d0551bd&originHeight=832&originWidth=2620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=258743&status=done&style=stroke&taskId=u2bb8fbe9-5250-4051-b22c-31292df65e0&title=&width=1310)<br>修改正确后反编译<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699346247299-08166975-c16b-424d-b6a0-034cc43af3dd.png#averageHue=%23f8f7f6&clientId=u2760a0c0-8831-4&from=paste&height=208&id=u39698705&originHeight=416&originWidth=2630&originalType=binary&ratio=2&rotation=0&showTitle=false&size=133841&status=done&style=stroke&taskId=u8298e844-abca-4687-8054-3e38f80ca35&title=&width=1315)

### 解决

1. Kotlin 版本：1.8.10
2. JDK版本：11
3. Compose compiler 版本：1.4.3
4. 去除buildSrc

### Ref

- [ ] [NoSuchMethodError: No static method setContent, because of gradle buildSrc "com.android.tools.build:gradle:7.0.0"](https://issuetracker.google.com/issues/195273509)
- [ ] [Loading the kotlin plugin multiple time leads to compose compiler plugin not being run.](https://issuetracker.google.com/issues/295349264)
