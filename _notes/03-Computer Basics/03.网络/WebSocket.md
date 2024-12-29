---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
---

# WebSocket

## 背景

http协议是无状态的，只能由客户端主动发起，服务端再被动响应，服务端无法向客户端主动推送内容，并且一旦服务器响应结束，所以无法进行实时通信。WebSocket协议正是为解决客户端与服务端实时通信而产生的技术，现在已经被主流浏览器支持。

> http协议中虽然可以通过keep-alive机制使服务器在响应结束后链接会保持一段时间，但最终还是会断开，keep-alive机制主要是用于避免在同一台服务器请求多个资源时频繁创建链接，它本质上是支持链接复用的技术，而并非用于实时通信

## 什么是WebSocket？

WebSocket是一种在单个TCP连接上进行全双工通信的协议，允许服务端主动向客户端推送数据；在WebSocket中，客户端和服务器只需要完成一次HTTP握手，两者之间就可以创建持久性的连接，并进行双向数据传输。

> WebSocket出现之前，客户端与服务器通常采用HTTP轮询或Comet等方式保持长连接

## WebSocket握手流程

WebSocket复用了HTTP的握手通道：客户端通过HTTP请求与WebSocket服务端协商升级协议，协议升级完成后，后续的数据交换则遵照WebSocket协议。WebSocket握手流程如下：

1. **浏览器、服务器通过TCP三次握手，建立TCP连接**，
2. **客户端：申请协议升级**

客户端发起协议升级请求，采用的是标准的HTTP报文格式，且只支持GET方法

```kotlin
GET ws://localhost:8888/ HTTP/1.1
Host: localhost:8888
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36
Upgrade: websocket
Origin: http: // localhost:8080
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Sec-WebSocket-Key: QPDJV2rsT8OhiiMvpB+3QQ==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
```

- Connection: Upgrade：表示要升级协议
- Upgrade: websocket：表示要升级到websocket协议
- Sec-WebSocket-Version: 13：表示websocket的版本
- Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

3. **服务端：响应协议升级**

```kotlin
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: R1gaI7r75Salqt4dEyJ2MDWiA2c=
```

- Sec-WebSocket-Accept的计算

Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来，有个计算公式

- Sec-WebSocket-Key/Accept的作用
  - 避免服务端收到非法的websocket连接
  - 确保服务端理解websocket连接
  - Sec-WebSocket-Key主要目的并不是确保数据的安全性，因为Sec-WebSocket-Key、Sec-WebSocket-Accept的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）

## WebSocket优点？

- **较少的控制开销**：数据包头部协议较小，不同于HTTP每次请求需要携带完整的头部
- **更强的实时性**：相对于HTTP请求需要等待客户端发起请求服务端才能响应，延迟明显更少
- **保持长连接状态**：创建连接后，可省略状态信息，不同于HTTP每次请求需要携带身份认证
- **更好的二进制支持**：定义了二进制帧，更好处理二进制内容
- **支持扩展**：用户可以扩展websocket协议，实现部分自定义的子协议
- **更好的压缩效果**：WebSocket在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率

## WebSocket和Socket关系

- Socket并不是一种协议，而是为了方便使用TCP或UDP而抽象出来的一层，是位于应用层和传输控制层(TCP/IP协议簇)之间的软件抽象层，它是一组接口；
- WebSocket是应用层协议
