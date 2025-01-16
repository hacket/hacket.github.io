---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# cronet

<https://developer.android.com/guide/topics/connectivity/cronet>

## cronet介绍

Cronet是Chromium的网络模块，位Chromium提供网络支持。其是一个支持多平台的网络库(Android/iOS/Mac/Windows/Linux)。 Cronet利用多种技术来减少延迟并提高应用程序需要工作的网络请求的吞吐量。

Cronet Library每天处理数百万人使用的应用程序请求，例如YouTube，Google App，Google Photos和Maps - Navigation＆Transit。

Cronet具有以下特点：

- **Protocol support**<br />Cronet本身支持HTTP，HTTP / 2和QUIC协议
- **Request prioritization**<br />该库允许您为请求设置优先级标记。服务器可以使用优先级标记来确定处理请求的顺序。
- **Resource caching**<br />Cronet可以使用内存或磁盘缓存来存储在网络请求中检索到的资源。后续请求将自动从缓存中提供。
- **Asynchronous requests**<br />默认情况下，使用Cronet Library发出的网络请求是异步的。在等待请求返回时，不会阻止您的工作线程。
- **Data compression**<br />Cronet使用Brotli压缩数据格式支持数据压缩。

## 接入cronet

为了让大家更便捷的接入Cronet网络库，google也给到了编译好的，android/iOS平台下的网络库。<https://console.cloud.google.com/storage/browser/chromium-cronet>

Android上的具体使用，请参考官方文档：<https://developer.android.com/guide/topics/connectivity/cronet/start>

## cronet的数据表现

### 网易新闻

#### 平均响应时间与错误率

- QUIC 平均响应时间较 H2 缩减了约 45%
- QUIC 带来的错误率也大幅降低

#### 弱网表现

- QUIC 在弱网场景下，请求响应时间优化更明显
- QUIC 在弱网场景下，错误率优化更明显

#### 视频性能

- 卡顿率
- 1秒率

### 腾讯

腾讯核心业务用户登录耗时降低30%，下载场景500ms内请求成功率从HTTPS的60%提升到90%，腾讯的移动端APP在弱网、跨网场景下取得媲美正常网络的用户体验。

## 三方库对cronet的支持

### okhttp

<https://github.com/google/cronet-transport-for-okhttp>

### glide

<https://bumptech.github.io/glide/int/cronet.html>

## Ref

- [x] [网易新闻QUIC敏捷实践](https://mp.weixin.qq.com/s/MUCSsgLbn3XBz7jgmdWk6Q)
