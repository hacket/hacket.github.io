---
date created: 2024-12-23 23:21
date updated: 2024-12-23 23:21
dg-publish: true
---

# [ClassyShark](http://w4lle.github.io/2016/02/15/ClassyShark%E2%80%94%E2%80%94%E5%88%86%E6%9E%90apk%E5%88%A9%E5%99%A8/#comments)

## 背景

1、了解该项目的基本框架、使用到哪些开源项目<br />2、对于一些大厂的项目，我们还比较关心的是用到了哪些新的框架和技术，对于新技术的流行程度和使用普遍程度有个比较好的把握，指导是否需要进行深度的使用学习。比如最近的比较流行的`rxjava`，`热更新`技术等等。

## 作用

[ClassyShark](https://github.com/google/android-classyshark) 是一款可以查看Android可执行文件的浏览工具，支持.dex, .aar, .so, .apk, .jar, .class, .xml 等文件格式，分析里面的内容包括classes.dex文件，包、方法数量、类、字符串、使用的NativeLibrary等。<br />官网：<http://www.classyshark.com><br />下载：<https://github.com/google/android-classyshark/releases>

## 使用

1. 打开apk文件`java -jar ClassyShark.jar -open <YOUR_APK.apk>`
2. 将生成的所有数据导出到文本文件里`java -jar ClassyShark.jar -dump <BINARY_FILE>`
3. 将指定类生成的文件导出到文本文件里`java -jar ClassyShark.jar -dump <BINARY_FILE> <FULLY_QUALIFIED_CLASS_NAME>`
4. 打开ClassyShark，在GUI界面展示某特定的类
5. `java -jar ClassyShark.jar -open <BINARY_FILE> <FULLY_QUALIFIED_CLASS_NAME>`
6. 检测APK`java -jar ClassyShark.jar -inspect <YOUR_APK.apk>`
7. 导出所有的字符串 `java -jar ClassyShark.jar -stringdump <YOUR_APK.apk>`

> java -jar ClassyShark.jar -open meituan.apk

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687794144170-facabb78-df69-405b-9bc8-193bc4be0b53.png#averageHue=%234d4c4a&clientId=u0c011d10-771d-4&from=paste&height=609&id=u2a079615&originHeight=913&originWidth=1208&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=207840&status=done&style=none&taskId=u7be9c626-891c-4cf5-b72b-4c6bc4a820f&title=&width=805.3333333333334)

- `查看有多少个classes.dex`，美团有3个
- `查看编译版本`，美团编译版本非常新, 紧跟时代, 23版本(Android 6.0)，并且TargetSdkVersion也是23版本，紧跟技术方向，最低版本是16(Android 4.1), 4.1以下的手机无法运行
- `用到的so库`，有美团自己的，也有好多是第三方的库
- `查看有多少个方法`，可以看到9万多个方法，怪不得会有3个classes.dex文件
- `查看用到了哪些第三方库`，项目中应用了大量的第三方库，并且一般都是主流的比较稳定的开源库，我们来看下都用到了哪些库：
- [ZXing](https://github.com/zxing/zxing)二维码识别库;
- amap: 高德地图;
- [PullToRefresh](https://github.com/chrisbanes/Android-PullToRefresh)使用最广的下拉刷新组件；
- [jackson](https://github.com/FasterXML/jackson-dataformat-smile), json解析库;
- [NineOldAndroids](https://github.com/JakeWharton/NineOldAndroids) Jake大神的android兼容库
- [fresco](https://github.com/facebook/fresco),facebook出品的图片处理库，图片加载节省很多内存，避免OOM。
- [RxJava](https://github.com/ReactiveX/RxJava)java响应式编程库，再加上`Square`的`Retrofit`库的支持，可以说未来就是`rxjava`的天下，目前市面上已经有很多基于rxjava的项目；我们团队也将基于rxjava来开发项目；<br />圈内最牛逼的开源公司[Square](https://github.com/square)，Jake大神所在的公司，可以毫不夸张的说，[Square](https://github.com/square)的开源项目使得Android开发提速了好几年
- [okhttp](https://github.com/square/okhttp)网络请求库，已被官方采用;
- [retrofit](https://github.com/square/retrofit)非常牛逼的网络请求库，配合`rxjava`和lambda使用，代码量减少90%;
- [otto](https://github.com/square/otto)事件总线;
- [picasso](https://github.com/square/picasso)图片加载库；
- [dagger](https://github.com/square/dagger)依赖注入框架；
- [ExpandableTextView](https://github.com/Manabu-GT/ExpandableTextView)可折叠的TextView
- iflytek, 科大讯飞的语音集成;
- [ViewPagerIndicator](https://github.com/JakeWharton/ViewPagerIndicator)还是Jake大神的项目，viewpager的滚动控件；
- [actionbarsherlock](http://actionbarsherlock.com/)依然是Jake大神的项目，Actionbar的适配库，不过已经过时了；
- [华为推送](http://developer.huawei.com/push)
- [SystemBarTint](https://github.com/jgilfelt/SystemBarTint)状态栏沉浸效果库
- 百度地图
- 新浪微博
- 腾讯的QQ和微信
- 大众点评,已经合并一家,东西也得用;
- [umpay](http://www.umpay.com/umpay_cms/), 联动优势支付;
- 支付宝；
- [andfix](https://github.com/alibaba/AndFix)阿里出品的android热更新框架；
- [flurry](http://www.flurry.com/)统计库；
- [小米推送](http://dev.xiaomi.com/doc/?page_id=1670)
- [http-request](https://github.com/kevinsawicki/http-request)网络请求库；
- [EventBus](https://github.com/greenrobot/EventBus)事件总线库；
- [PhotoView](https://github.com/chrisbanes/PhotoView)放大缩小的图片处理库；
- [roboguice](https://github.com/roboguice/roboguice)依赖注入框架，类似`Dagger`；
- [zip4j](http://www.lingala.net/zip4j/)处理zip压缩的库;<br />[link](https://github.com/BoltsFramework/Bolts-Android)异步task关联库,很像`rxjava`；

## 总结

通过分析App的项目结构和引用库的信息，我们大致掌握了该项目的架构，一些开发中的经验和不足，拓宽下开发视野，发现一些好用的开源库，增强我们的武器，这些都是我们在开发中可以借鉴的东西。

# jadx

```
jadx -d out calc.apk
```

# Android逆向助手
