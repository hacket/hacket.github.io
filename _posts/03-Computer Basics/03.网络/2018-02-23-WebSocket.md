---
date_created: Friday, February 23rd 2018, 10:10:44 pm
date_updated: Tuesday, January 21st 2025, 1:27:32 am
title: WebSocket
author: hacket
categories:
  - 计算机基础
category: 网络协议
tags: [网络协议, WebSocket]
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
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
aliases: [WebSocket]
linter-yaml-title-alias: WebSocket
---

# WebSocket

## 背景

http 协议是无状态的，只能由客户端主动发起，服务端再被动响应，服务端无法向客户端主动推送内容，并且一旦服务器响应结束，所以无法进行实时通信。WebSocket 协议正是为解决客户端与服务端实时通信而产生的技术，现在已经被主流浏览器支持。

> http 协议中虽然可以通过 keep-alive 机制使服务器在响应结束后链接会保持一段时间，但最终还是会断开，keep-alive 机制主要是用于避免在同一台服务器请求多个资源时频繁创建链接，它本质上是支持链接复用的技术，而并非用于实时通信

## 什么是 WebSocket？

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，允许服务端主动向客户端推送数据；在 WebSocket 中，客户端和服务器只需要完成一次 HTTP 握手，两者之间就可以创建持久性的连接，并进行双向数据传输。

> WebSocket 出现之前，客户端与服务器通常采用 HTTP 轮询或 Comet 等方式保持长连接

## WebSocket 握手流程

WebSocket 复用了 HTTP 的握手通道：客户端通过 HTTP 请求与 WebSocket 服务端协商升级协议，协议升级完成后，后续的数据交换则遵照 WebSocket 协议。WebSocket 握手流程如下：

1. **浏览器、服务器通过 TCP 三次握手，建立 TCP 连接**，
2. **客户端：申请协议升级**

客户端发起协议升级请求，采用的是标准的 HTTP 报文格式，且只支持 GET 方法

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
- Upgrade: websocket：表示要升级到 websocket 协议
- Sec-WebSocket-Version: 13：表示 websocket 的版本
- Sec-WebSocket-Key：与后面服务端响应首部的 Sec-WebSocket-Accept 是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

3. **服务端：响应协议升级**

```kotlin
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: R1gaI7r75Salqt4dEyJ2MDWiA2c=
```

- Sec-WebSocket-Accept 的计算

Sec-WebSocket-Accept 根据客户端请求首部的 Sec-WebSocket-Key 计算出来，有个计算公式

- Sec-WebSocket-Key/Accept 的作用
  - 避免服务端收到非法的 websocket 连接
  - 确保服务端理解 websocket 连接
  - Sec-WebSocket-Key 主要目的并不是确保数据的安全性，因为 Sec-WebSocket-Key、Sec-WebSocket-Accept 的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）

## WebSocket 优点？

- **较少的控制开销**：数据包头部协议较小，不同于 HTTP 每次请求需要携带完整的头部
- **更强的实时性**：相对于 HTTP 请求需要等待客户端发起请求服务端才能响应，延迟明显更少
- **保持长连接状态**：创建连接后，可省略状态信息，不同于 HTTP 每次请求需要携带身份认证
- **更好的二进制支持**：定义了二进制帧，更好处理二进制内容
- **支持扩展**：用户可以扩展 websocket 协议，实现部分自定义的子协议
- **更好的压缩效果**：WebSocket 在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率

## WebSocket 和 Socket 关系

- Socket 并不是一种协议，而是为了方便使用 TCP 或 UDP 而抽象出来的一层，是位于应用层和传输控制层 (TCP/IP 协议簇) 之间的软件抽象层，它是一组接口；
- WebSocket 是应用层协议
