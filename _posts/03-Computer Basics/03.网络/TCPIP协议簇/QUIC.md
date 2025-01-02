---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
---

# QUIC

## 什么是QUIC？

QUIC(Quick UDP Internet Connections)，快速UDP网络连接。QUIC 由 Google 实现于2013年，是一种网络传输协议，旨在提升网络传输速度。2015年，QUIC 被提交到 IETF，目标是成为下一代的正式网络规范，2018年，HTTP over QUIC 被 IETF 重命名为 HTTP/3。<br />在 UDP 之上，**QUIC 实现了类似 TCP 的丢失重传机制**，QUIC 传输以数据包级报头发送，并对每个包增加了单调递增的数据包号来代表传输顺序，当检测到必要帧丢失时，QUIC 会将必要帧绑定到新数据包重发。QUIC 对报文头部和数据也都进行了加密，且建联时改进使用了 DH 密钥交换算法，在防劫持方面也具有一定优势。<br />QUIC是在应用层实现的协议，可以很灵活的切换各种协议状态，而不需要在内核中增加socket的netFamily的族群，在传输层增加逻辑。<br />相较于传统的 HTTP + TCP，**QUIC 还具有多项改进网络传输的优势**，其部分优势如 图2 所示。<br />![](https://cdn.nlark.com/yuque/0/2022/png/694278/1669605208822-467c6b16-0d4e-44d1-881a-db950d344dcb.png#averageHue=%23282724&clientId=u898b50a9-119f-4&from=paste&height=318&id=u23c0134c&originHeight=502&originWidth=447&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c4bba45-ce19-444f-b5c5-1fe67029350&title=&width=283)<br />**QUIC 目前分为 gQUIC 与 iQUIC 两种**，gQUIC 即为最初的 Google QUIC，而 iQUIC 是后来 IETF 制定的通用传输协议是提供给HTTP3的，gQUIC应用更广泛。<br />相较 iQUIC 而言，gQUIC 目前的应用较为普遍、成熟，如 Cadddy 支持 gQUIC，客户端还有 Chromium 的 Net 库 Cronet 也可以支持 gQUIC，包括 ExoPlayer 等三方库也都提供了对于 gQUIC 的扩展支持。目前来看，**选择 gQUIC 对于渴望改善网络传输情况的开发者来说，在接入成本和接入效率上具有优势**。

## QUIC特性

### 实现了类似TCP的流量控制、传输可靠性的功能

UDP不提供可靠性的传输，但QUIC在UDP的基础上增加了一层来保证数据可靠性传输，它提供了数据包重传、拥塞控制以及其他一些TCP中存在的特性。<br />QUIC协议的改进：

- 可插拔 应用程序层面就能实现不同的拥塞控制算法
- 单调递增的Packet Number 使用Packet Number替代了TCP的seq
- 不允许Reneging 一个Packet只要被ACK，就认为它一定被正确接收
- 前向纠错（FEC）
- 更多的ACK块和增加ACK Delay时间
- 基于Stream和Connection级别的流量控制

### 实现了0-RTT快速握手功能

由于QUIC是基于UDP协议的，根本就不需要握手和挥手。所以QUIC可以实现使用0-RTT或1-RTT来建立连接。QUIC可以用更快的速度来发送和接收数据，可以大大提高首次打开页面的速度。**0-RTT建立连接可以说是QUIC相比HTTP2最大的性能优势**。

### 集成了TLS功能

目前QUIC使用的是TLS1.3，相比较于早期版本的TLS1.3有更多的优点，最重要的一点是减少了握手所花费的RTT个数。<br />在完全握手情况下，需要1-RTT建立连接，TLS1.3恢复会话可以直接发送加密后的应用数据，不需要额外的TLS握手，也就是0-RTT。但是TLS1.3的0-RTT无法保证前向安全性(Forward secrecy)，要缓解该问题可以通过设置使得与SessionTicket Key相关的DH静态参数在短时间内过期（一般几个小时）

### 无对头阻塞的多路复用，彻底解决TCP队头阻塞的问题

和TCP不同，QUIC实现了在同一物理连接上可以有多个独立的逻辑数据流。实现了数据流的单独传输，就解决了TCP中队头阻塞的问题。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687883297306-335df0d9-bd35-4343-a698-efc3ba2505de.png#averageHue=%23e7ece5&clientId=u40d5464d-4766-4&from=paste&id=u826deb03&originHeight=400&originWidth=687&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufd54cbdc-9e40-47e2-8e72-c9472c55cf3&title=)

### 连接迁移

TCP用四元组（客户端IP、端口、服务器IP、端口）确定一个连接，而QUIC是让客户端生成一个ConnectionID(64位)来区别不同连接，只要ConnectionID不变，连接就不需要重新建立连接，即便是客户端的网络发生变化（比如客户端从WIFI切换到蜂窝网络）。由于连接迁移客户端继续使用相同的会话密钥来加密和解密数据包，QUIC还提供了迁移客户端的自动加密验证。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687883321933-10d89505-75d7-41dd-8049-db65afdb5e4c.png#averageHue=%23f7f6f5&clientId=u40d5464d-4766-4&from=paste&id=ud4c28800&originHeight=514&originWidth=1060&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u542f6c4f-dda9-48dc-9b82-2d59d46e10e&title=)

### 全应用态协议栈

QUIC核心逻辑都在用户态，能灵活的修改连接参数、替换拥塞算法、更改传输行为。而TCP核心实现在内核态，改造需要修改内核并且进行系统重启，成本极高。

## QUIC接入

自研支持quic的库，使用三方库

### cronet

# HTTP3

Google在推SPDY的时候就已经意识到了这些问题，于是就另起炉灶搞了一个基于UDP协议的QUIC协议，让HTTP跑在QUIC上而不是TCP上，这个`HTTP over QUIC`就是HTTP3，在HTTP2的基础上又实现了质的飞跃，真正完美地解决了队头阻塞问题。<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1673067023854-bbf06982-bce4-42be-a4b7-f9bf93f4227c.webp#averageHue=%23b2b778&clientId=u1284454d-cd4e-4&from=paste&id=u6e2a27d3&originHeight=245&originWidth=579&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u968b8310-7601-4e7c-ba10-9b477d956cd&title=)

# Ref

-  [ ] [网易新闻QUIC敏捷实践](https://mp.weixin.qq.com/s/MUCSsgLbn3XBz7jgmdWk6Q)
-  [ ] [弱网不弱-TQUIC助力业务提速30%](https://zhuanlan.zhihu.com/p/438920906)
