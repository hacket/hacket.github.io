---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# emoji

[toc]

所有emoji对应的unicode：<http://www.unicode.org/emoji/charts/full-emoji-list.html>

## 什么是 Emoji？

1. Emoji 是可以被插入文字中的图形符号，它是一个日本语，e 表示"绘"，moji 表示 "文字" ，连在一起就是 “绘文字”，它最早是用于我们发短信来增强用户的一个体验，2007 年，Apple 在 iPhone 中支持了 Emoji，才让它在全球范围内流行起来。
2. 在 2010 年以前，Emoji 的实现是将一些特殊的符号组合替换成图片表情，例如 :) 替换成 😊 ，这样的解决方案导致 Emoji 表情很难标准化，而且表达范围有限
3. 从 2010 年开始，Unicode 开始为 Emoji 分配固定的码点，也就是说，在这之后，每一个 Unicode 字符对应一个字体，它会被渲染为图片显示
4. Emoji 表情由于其表达情绪的特点，被广受欢迎。Emoji 表情的国际标准在 2015 年出台，到目前为止已经是 V13.1 版本的标准了，具体关于 Unicode 字符和 Emoji 表情的一个映射关系以及其他的一些细节，可以从这个网站中去查询：<http://www.unicode.org/emoji/charts/full-emoji-list.html>

## Unicode 和 Emoji

每个 Unicode 字符对应的 Emoji 表情在各个平台展示的样式都不太一样，因为 Unicode 只是规定了 Emoji 的码点和含义，并没有规定它的样式，每个平台都有自己的 Emoji 实现

## 如果使用并显示emoji

一个标准的 Emoji ，其实是有多种表示方法的，举个例子，先看看前面说的笑脸 `U+1F601`<br />![](https://note.youdao.com/yws/res/84284/93F4FD5E23AB4C6996A4468F14ECA689#id=zIXG0&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214940982-53279439-903f-4ef2-8ce4-faa22bdba6a6.png#averageHue=%23f5f5f4&clientId=u400dc2d5-b9e3-4&from=paste&height=59&id=u2892c580&originHeight=118&originWidth=1652&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105195&status=done&style=none&taskId=u89c292aa-fa4e-40be-80f8-45d50cd9cc9&title=&width=826)

Code、UTF-8、Surrogates 这些形式，都可以表示这个笑脸的 Emoji。通常这个 Emoji 表情是来自用户输入的数据或者服务端传递过来的数据，虽然这些形式都可以表示这个Emoji，但是不同的格式就需要不同的形式来解析。

### Surrogates可直接显示

推荐使用 Surrogates 传递 Emoji，例如：\uD83D\uDE01，它本身就是一个 Unicode 的编码，是通用的，可以在 TextView 中直接使用就可以显示。

### Code

Code ，例如 1F601，这样我们就需要进行额外的处理了：

```
String(Character.toChars(Integer.parseInt("1F601", 16)))
```

## emoji存在的问题

### 不同平台显示的emoji效果不一致

具体可在<http://www.unicode.org/emoji/charts/full-emoji-list.html查询>

### Emoji表情显示出来像一个信封（Emoji显示不出来）

原因是当前设备不支持，当前设备字体库没有该emoji，每一个Unicode字符对应一个字体，它会被渲染为图片显示，但是如果当前系统不支持这种字体，那么就会显示出一个信封，而且随着 Android 版本越来越低，这种情况越来越多，这种效果肯定是不行的<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214921813-e95e1e47-f10d-4f96-93fa-48d434df4eee.png#averageHue=%23e7ebed&clientId=u400dc2d5-b9e3-4&from=paste&height=446&id=u0f9cf789&originHeight=892&originWidth=1540&originalType=binary&ratio=2&rotation=0&showTitle=false&size=970791&status=done&style=none&taskId=u6edbcc6f-2d56-450d-a8cf-3c6d470e2dd&title=&width=770)![](https://note.youdao.com/yws/res/84260/EE861089EA034C1FAB3DB96CC070E31D#id=zTFrZ&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## EmojiCompat

### 什么是 EmojiCompat?

EmojiCompat 是 Google 官方给我们提供的一个 Emoji 表情兼容库，最低支持到 Android 4.4(Api Level 19) 的系统设备，它可以防止应用中，出现以信封的形式来显示 Emoji，虽然它仅仅只是因为你当前的设备没有这个字体而已。通过 EmojiCompat ，你的设备无需等待 Android 系统更新，就可以获得最新的 Emoji 表情显示效果。

### EmojiCompat 的运行原理

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688215014727-2bf17309-18d9-49d6-becc-0085d3236a0b.png#averageHue=%23f8faf5&clientId=u400dc2d5-b9e3-4&from=paste&height=169&id=u567abb9f&originHeight=216&originWidth=600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108449&status=done&style=none&taskId=u4e84149d-efe1-4ab9-b059-93fa9c9b5e1&title=&width=469)<br />EmojiCompat 会判断当前设备是否支持这个 Emoji，如果支持则还是使用系统内置的字体加载，如果不支持，则使用 EmojiSpan 来进行替换，从而达到替换渲染的效果。

### 如何使用 EmojiCompat ？

```java
EmojiCompat.init(config);
// EmojiCompat 的 init 方法
public static EmojiCompat init(@NonNull final Config config) {
    if (sInstance == null) {
        synchronized (sInstanceLock) {
            if (sInstance == null) {
                sInstance = new EmojiCompat(config);
            }
        }
    }
    return sInstance;
}
```

#### 可下载的字体配置 (需要GMS)

可下载的字体的方式会在首次启动 app 的时候检查本地是否有该字体，没有的话会从网上下载最新的 Emoji 字体，然后遇到不支持的 Emoji，就会从这个字体文件中，加载资源并且渲染

缺点：可下载字体的方式，完全依赖 GMS 服务，在没有 GMS 服务的手机上并不可用

#### 本地捆绑的字体配置 (增大APK体积)

本地捆绑的方式会在 App 打包的过程中，植入一个最新的Emoji字体文件（`NotoColorEmojiCompat.ttf`字体文件），然后遇到不支持的 Emoji，就会从这个字体文件中，加载资源并且渲染

缺点：本地捆绑的方式会嵌入一个约 9M+ 的字体文件，无形中增大了 Apk 安装包的体积

### EmojiCompat遇到的问题

#### 没有GMS下载不了字体，emoji还是显示不出来

- **原因：**<br />可下载的字体配置完全依赖 GMS 服务，如果没有 GMS 服务，则会导致字体下载失败，相应的 EmojiCompat 就会初始化失败，EmojiCompat 初始化失败，则看当前系统是否支持该 emoji，如果不支持，那就会显示成信封状。
- **解决：**
  1. 将 Google 官方提供的 `NotoColorEmojiCompat.ttf` 字体文件，上传到我们自己的服务器
  2. 针对没有 GMS 的手机，EmojiCompat 会初始化失败，那么在 EmojiCompat 首次初始化失败后，在它失败的回调里面启动一个下载任务去下载 NotoColorEmojiCompat.ttf 这个字体
  3. 若下载成功，则构造一个自定义的字体配置重新初始化 EmojiCompat

#### EmojiCompat 帮我补齐了我当前设备部支持的那些 Emoji 表情，但是并没有将 Android 的果冻表情替换为标准的 Emoji 表情

#### 其他常见问题

- 1、下载字体的下载策略是怎么样的？

> Emoji 字体在第一次使用的时候，会检测是否存在于当前设备，如果不存在则在子线程中进行下载。

- 2、初始化需要多长时间？

> 当本地已经有字体之后，初始化 EmojiCompat 大约需要 150 毫秒。

- 3、EmojiCompat 支持库，会使用多少内存？

> 目前，Emoji 字体被完全加载之后，会使用大约 200kb 的内存。

- 4、在 Android 4.4 以下的设备上，使用 EmojiAppCompatXxx 控件会发生什么情况？

> EmojiCompat 内部已经做了兼容处理，在低版本上就和使用普通的 AppCompatXxx 控件一样。

- 5、本地捆绑的 Emoji 字体文件，大约有多大？

> 本地捆绑的 Emoji 字体文件NotoColorEmojiCompat.ttf，会在打包的时候嵌入到assets目录下，现在实际情况来看大小有9.0MB+，具体看最新的ttf文件，这会直接造成 Apk 的增大。

## Ref

-  [x] Android 开发，你遇上 Emoji 头疼吗？<br /><https://mp.weixin.qq.com/s?__biz=MzIxNjc0ODExMA==&mid=2247485072&idx=1&sn=e1acf7aad9cc66fddadec62cb3eafb62&chksm=97851fb1a0f296a75bcaa87442f254304a49239dd64bc93fcdfe6974f1cf11d15c403aa5ed26#rd>
-  [x] "一篇就够"系列：Android Emoji 表情分享和实践<br /><https://juejin.cn/post/6966858553583730718>
