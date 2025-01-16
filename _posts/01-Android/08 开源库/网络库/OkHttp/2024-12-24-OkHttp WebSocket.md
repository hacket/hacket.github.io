---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

# WebSocket

## WebSocket介绍

### Http与WebSocket区别与联系

1. Http与WebSocket是两个完全不同的协议，都是基于TCP的。两者唯一的联系是WebSocket利用Http进行握手；具体说明请看RFC6455-1.7。
2. WS默认也使用80端口；WSS默认也使用443端口。当然如果这个也算是和Http的联系的话，那么你说的也对。
3. Http协议局限性一大堆，比如明文传输、无法保证信息完整性、没有身份验证等。而WebSocket的出现则是为了解决Http协议只能由Client发起通信请求的问题。WebSocket是全双工通信。

### WebSocket如何实现长链接

1. TCP是持久连接，建立TCP连接是3次握手，关闭TCP连接是4次挥手（关于TCP连接建立和关闭的过程不赘述，网上帖子一堆）。TCP连接是由通信双方来决定什么时候结束通信，那么自然就是一个持久连接。TCP连接可以进行全双工通信，因为双方都知道对方是谁（如果大学学习Socket通信的时候，自己编程玩过Socket连接，会对这一点印象深刻）。
2. Http协议只能单向通信的原因是：Server端没有保存Http客户端的信息，想要通信的时候找不到人啊，不知道发给谁啊。而Http1.1协议新增Keep-alive Header之后，Server会保存连接，即长连接。虽然Comet等基于长链接的轮询技术，实现了全双工通信；但是每次都是Http请求啊，一堆没用的信息，效率很低啊！这个不是浪费服务器资源么？
3. WebSocket协议实现全双工通信、以及实现持久连接的一个前提是，它是基于TCP通信的。然后还有一点就是，WebSocket协议本身就是针对于全双工通信设计的，通信双方都可以发起/响应请求。
4. WebSocket如何管理连接的呢？RFC6455-5.5给出了答案，协议定义了`Control Frame`。WebSocket的控制帧有：Close、Ping、Pong。其中Close发起关闭请求；Ping帧是通信发起方确认链路是否畅通的报文；Pong则是通信接收方回应链路是否畅通的报文。
5. WebSocket在建立连接之后，通信的基本数据帧格式如下图（来源RFC6455-5.2）没有Http协议那么多固定的报头，且不用重复建立连接，所以通信效率高：

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687912861375-65cf95b2-cb09-47fb-af40-b6d935d033d4.png#averageHue=%23f1f1f1&clientId=u6ede8161-a8d7-4&from=paste&id=u64ed416e&originHeight=364&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud34bae39-4336-4d45-b07c-54931484e51&title=)

### WebSocket连接的生命周期

WebSocket连接的生命周期如下图(来源：Design - websockets 7.0 documentation）：<br />![](http://note.youdao.com/yws/res/26903/436CC49E916641C39F754D8409543695#id=Ot2Rm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687912872399-038d3d6e-b768-4897-a08f-e37d0c8376eb.png#averageHue=%23f2f2f2&clientId=u6ede8161-a8d7-4&from=paste&id=u80340a43&originHeight=441&originWidth=720&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u035a4519-5a50-43c8-b0a0-c70094ec743&title=)

1. CONNECTING：使用Http发起请求，RFC6455-4规定了Client和Server的报文格式。Server在响应时使用Http状态码是101（切换协议）。在握手时，WebSocket连接处于CONNECTING状态。
2. OPEN：握手成功之后，进入OPEN状态。
3. CLOSING：如果一方发起了CLOSE帧，那么便标志着WebSocket连接进入了CLOSING状态；
4. CLOSED：当TCP连接关闭之后，那么WebSocet连接便进入了CLOSED状态。

## WebScoket注意

- WebSocket心跳包<br />使用Websocket实现消息推送（心跳）<br /><https://blog.csdn.net/ttdevs/article/details/62887058>
- OkHttp WebSocket实现的心跳ping/pong为何不对接口层感知<br /><https://github.com/square/okhttp/issues/2239>
- [Android]Okhttp心跳策略研究<br /><https://juejin.im/post/5c88a8da6fb9a04a027b35f9>

## WebSocket开源库

### RxWebSocket

<https://github.com/dhhAndroid/RxWebSocket>

RxJava2.0: <https://github.com/dhhAndroid/RxWebSocket/tree/2.x>

RxWebSocket是一个基于okhttp和RxJava封装的WebSocket客户端,此库的核心特点是 除了手动关闭WebSocket(就是RxJava取消订阅),WebSocket在异常关闭的时候(onFailure,发生异常,如WebSocketException等等),会自动重连,永不断连.其次,对WebSocket做的缓存处理,同一个URL,共享一个WebSocket.

- 基于okhttp和RxJava封装的自动重连的WebSocket<br /><https://blog.csdn.net/huiAndroid/article/details/78071703>

### rxWebSocket

<https://github.com/navinilavarasan/rxWebSocket>

## Ref

- [ ] WebSocket 是什么原理？为什么可以实现持久连接？<br /><https://www.zhihu.com/question/20215561>
- [ ] Android最佳实践——深入浅出WebSocket协议

<https://blog.csdn.net/sbsujjbcy/article/details/52839540>

- [ ] WebSocket安卓客户端实现详解(一)--连接建立与重连

<https://blog.csdn.net/zly921112/article/details/72973054>
