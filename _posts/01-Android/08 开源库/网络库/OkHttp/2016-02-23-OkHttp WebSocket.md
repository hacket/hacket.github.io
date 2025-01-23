---
date_created: Friday, February 23rd 2016, 10:10:45 pm
date_updated: Wednesday, January 22nd 2025, 12:54:08 am
title: OkHttp WebSocket
author: hacket
categories:
  - 计算机基础
category: 开源库
tags: [开源库, 网络库, 网络协议, OkHttp, WebSocket]
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
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
aliases: [WebSocket]
linter-yaml-title-alias: WebSocket
---

# WebSocket

## WebSocket 介绍

### Http 与 WebSocket 区别与联系

1. Http 与 WebSocket 是两个完全不同的协议，都是基于 TCP 的。两者唯一的联系是 WebSocket 利用 Http 进行握手；具体说明请看 RFC6455-1.7。
2. WS 默认也使用 80 端口；WSS 默认也使用 443 端口。当然如果这个也算是和 Http 的联系的话，那么你说的也对。
3. Http 协议局限性一大堆，比如明文传输、无法保证信息完整性、没有身份验证等。而 WebSocket 的出现则是为了解决 Http 协议只能由 Client 发起通信请求的问题。WebSocket 是全双工通信。

### WebSocket 如何实现长链接

1. TCP 是持久连接，建立 TCP 连接是 3 次握手，关闭 TCP 连接是 4 次挥手（关于 TCP 连接建立和关闭的过程不赘述，网上帖子一堆）。TCP 连接是由通信双方来决定什么时候结束通信，那么自然就是一个持久连接。TCP 连接可以进行全双工通信，因为双方都知道对方是谁（如果大学学习 Socket 通信的时候，自己编程玩过 Socket 连接，会对这一点印象深刻）。
2. Http 协议只能单向通信的原因是：Server 端没有保存 Http 客户端的信息，想要通信的时候找不到人啊，不知道发给谁啊。而 Http1.1 协议新增 Keep-alive Header 之后，Server 会保存连接，即长连接。虽然 Comet 等基于长链接的轮询技术，实现了全双工通信；但是每次都是 Http 请求啊，一堆没用的信息，效率很低啊！这个不是浪费服务器资源么？
3. WebSocket 协议实现全双工通信、以及实现持久连接的一个前提是，它是基于 TCP 通信的。然后还有一点就是，WebSocket 协议本身就是针对于全双工通信设计的，通信双方都可以发起/响应请求。
4. WebSocket 如何管理连接的呢？RFC6455-5.5 给出了答案，协议定义了 `Control Frame`。WebSocket 的控制帧有：Close、Ping、Pong。其中 Close 发起关闭请求；Ping 帧是通信发起方确认链路是否畅通的报文；Pong 则是通信接收方回应链路是否畅通的报文。
5. WebSocket 在建立连接之后，通信的基本数据帧格式如下图（来源 RFC6455-5.2）没有 Http 协议那么多固定的报头，且不用重复建立连接，所以通信效率高：

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687912861375-65cf95b2-cb09-47fb-af40-b6d935d033d4.png#averageHue=%23f1f1f1&clientId=u6ede8161-a8d7-4&from=paste&id=u64ed416e&originHeight=364&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud34bae39-4336-4d45-b07c-54931484e51&title=)

### WebSocket 连接的生命周期

WebSocket 连接的生命周期如下图 (来源：Design - websockets 7.0 documentation）：<br />![](http://note.youdao.com/yws/res/26903/436CC49E916641C39F754D8409543695#id=Ot2Rm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687912872399-038d3d6e-b768-4897-a08f-e37d0c8376eb.png#averageHue=%23f2f2f2&clientId=u6ede8161-a8d7-4&from=paste&id=u80340a43&originHeight=441&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u035a4519-5a50-43c8-b0a0-c70094ec743&title=)

1. CONNECTING：使用 Http 发起请求，RFC6455-4 规定了 Client 和 Server 的报文格式。Server 在响应时使用 Http 状态码是 101（切换协议）。在握手时，WebSocket 连接处于 CONNECTING 状态。
2. OPEN：握手成功之后，进入 OPEN 状态。
3. CLOSING：如果一方发起了 CLOSE 帧，那么便标志着 WebSocket 连接进入了 CLOSING 状态；
4. CLOSED：当 TCP 连接关闭之后，那么 WebSocet 连接便进入了 CLOSED 状态。

## WebScoket 注意

- WebSocket 心跳包<br />使用 Websocket 实现消息推送（心跳）<br /><https://blog.csdn.net/ttdevs/article/details/62887058>
- OkHttp WebSocket 实现的心跳 ping/pong 为何不对接口层感知<br /><https://github.com/square/okhttp/issues/2239>
- [Android]Okhttp 心跳策略研究<br /><https://juejin.im/post/5c88a8da6fb9a04a027b35f9>

## WebSocket 开源库

### RxWebSocket

<https://github.com/dhhAndroid/RxWebSocket>

RxJava2.0: <https://github.com/dhhAndroid/RxWebSocket/tree/2.x>

RxWebSocket 是一个基于 okhttp 和 RxJava 封装的 WebSocket 客户端,此库的核心特点是 除了手动关闭 WebSocket(就是 RxJava 取消订阅),WebSocket 在异常关闭的时候 (onFailure,发生异常,如 WebSocketException 等等),会自动重连,永不断连.其次,对 WebSocket 做的缓存处理,同一个 URL,共享一个 WebSocket.

- 基于 okhttp 和 RxJava 封装的自动重连的 WebSocket<br /><https://blog.csdn.net/huiAndroid/article/details/78071703>

### rxWebSocket

<https://github.com/navinilavarasan/rxWebSocket>

## Ref

- [ ] WebSocket 是什么原理？为什么可以实现持久连接？<br /><https://www.zhihu.com/question/20215561>
- [ ] Android 最佳实践——深入浅出 WebSocket 协议

<https://blog.csdn.net/sbsujjbcy/article/details/52839540>

- [ ] WebSocket 安卓客户端实现详解 (一)-- 连接建立与重连

<https://blog.csdn.net/zly921112/article/details/72973054>
