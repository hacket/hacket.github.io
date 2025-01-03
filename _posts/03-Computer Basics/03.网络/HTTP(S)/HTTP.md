---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
---

# HTTP协议发展史

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1669602294961-29a04893-c0c6-45ae-9d39-cf404761eaee.png#averageHue=%23f1f0f0&clientId=u20249c9c-4830-4&from=paste&id=uf96fded5&originHeight=160&originWidth=1078&originalType=url&ratio=1&rotation=0&showTitle=false&size=78639&status=done&style=none&taskId=ubc914522-e2cb-4d85-b37d-99b1713470a&title=)

## HTTP1.x

### HTTP请求报文结构

http1中奠定了http协议的基本语义：由请求行/状态行、body和header构成<br />**HTTP请求协议**<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1669602767973-bf944eb5-7025-408e-be01-5c97990894e5.png#averageHue=%23d2e4cf&clientId=ua73c11a6-4b18-4&from=paste&height=343&id=u7c376a94&originHeight=491&originWidth=611&originalType=url&ratio=1&rotation=0&showTitle=false&size=74678&status=done&style=none&taskId=u0ad371ba-0627-4775-965c-f7c07e62067&title=&width=427)<br />**HTTP响应协议**<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1669602896088-5ee67dd6-805d-497c-b641-a318e8561978.png#averageHue=%23d3e6d0&clientId=ua73c11a6-4b18-4&from=paste&height=343&id=uea10d001&originHeight=491&originWidth=611&originalType=url&ratio=1&rotation=0&showTitle=false&size=72322&status=done&style=none&taskId=u9dd49501-a172-4038-b675-0b07173c0ef&title=&width=427)

### HTTP1.1管道化（没有解决HTTP1.x的队头阻塞）

**什么是HTTP1.1管道化**<br />HTTP1.1允许在持久连接上可选的使用请求管道，这是相对于keep-alive连接的又一次性能优化。在相应请求到达之前，可以将多条请求放入队列，当第一条请求发往服务器的时候，第二第三条请求也可以开始发送了，在高延时的网络条件下，这样可以降低网络的RTT，提高性能。<br />![HTTP1.1 非管道化和管道化请求区别](https://cdn.nlark.com/yuque/0/2023/png/694278/1673539165917-d1681f98-5d08-4f53-a32e-d49f44c272dc.png#averageHue=%23000000&clientId=u3cf4537e-1150-4&from=paste&height=407&id=uec789e4c&originHeight=834&originWidth=1200&originalType=url&ratio=1&rotation=0&showTitle=true&status=done&style=none&taskId=uc6bfcd3c-ae7b-4113-a7f6-0b25a7e32f5&title=HTTP1.1%20%E9%9D%9E%E7%AE%A1%E9%81%93%E5%8C%96%E5%92%8C%E7%AE%A1%E9%81%93%E5%8C%96%E8%AF%B7%E6%B1%82%E5%8C%BA%E5%88%AB&width=585 "HTTP1.1 非管道化和管道化请求区别")

- 非管道化：一个请求一个响应，请求串行
- 管道化：请求可以并发发出，但是响应必须串行返回，后一个响应必须在前一个响应之后。原因是没有序号标明顺序，只能串行接收。即客户端可以并行，服务端串行，客户端可以不用等待前一个请求返回，发送请求，但服务器必须顺序的返回客户端的请求响应结果。

**HTTP管道化的限制**

1. 管道化要求服务器按照请求发送的顺序返回响应（FIFO），原因很简单，HTTP请求和响应并没有序号标识，无法将乱序的响应和请求关联起来
2. 客户端需要保持未收到响应的请求的连接，当连接意外中断时，需要重新发送这部分请求
3. 只有幂等的请求才能进行管道化，即GET和HEAD请求才能管道化，否则可能会出现意料之外的结果
4. HTTP管道化没有解决HTTP队头阻塞：HTTP管道化要求服务端必须按照请求发送的顺序返回响应，那如果一个响应返回延迟了，那么其后续的响应都会被延迟，直到队头的响应送达。

### HTTP1.1协议缺点

HTTP1.1有两个主要的缺点：安全不足和性能不高

#### 队头阻塞(Head-Of-Line Blocking) — 高延迟，性能差

网络延迟问题主要由于队头阻塞导致带宽无法被充分利用。<br />**队头阻塞**：当顺序发送的请求序列中的一个请求因为原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。<br />HTTP1.1缓解队头阻塞问题通过：**并发连接和域名分片，本质还是提高一个域名下的TCP连接数，并没有本质上解决HTTP队头阻塞问题**<br />具体解决方案见`HTTP相关面试题→TCP队头阻塞和HTTP队头阻塞怎么解决？`

#### 明文传输 — 不安全性

HTTP1.1传输数据时，所有传输的内容都是明文，客户端和服务器都无法验证对方的身份，无法保证数据的安全性

#### 无状态特性 — 阻碍交互

见`HTTP特点→无状态性`

#### 不支持服务端推送消息

## HTTP2.x

### SPDY

由于HTTP1.x的缺陷，引入了雪碧图、将小图内联、使用多个域名等等的方式来提高性能，不过这些优化都绕开了HTTP协议。直到2009，Google公开了自研的SPDY协议，主要解决了HTTP1.1效率不高的问题，SPDY的推出算正式改造HTTP协议本身。降低延迟、压缩Header等，最终也带来了HTTP2的诞生。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1673025145295-ce41bd7a-4f91-402f-83ff-0414fe619bcc.png#averageHue=%23f9ebd7&clientId=ub5be1ac7-5723-4&from=paste&height=275&id=u286a89db&originHeight=558&originWidth=375&originalType=binary&ratio=1&rotation=0&showTitle=false&size=92296&status=done&style=none&taskId=u75a1d4b2-861d-4b87-b5e1-5140f6b788d&title=&width=185)

### HTTP2简介

2015年，HTTP2发布，兼容HTTP1.1，HTTP2基于SPDY，专注于性能，最大的一个目标是在用户和网站间只用一个连接。使用HTTP2能带来20%~60%的效率提升。

### HTTP2新特性

为了解决HTTP1.x的问题，HTTP2诞生了，HTTP2性能提升主要有两点：

- **头部压缩**
- **多路复用（二进制帧）**

还有一些颠覆性的功能实现：

- 设置请求优先级
- 服务器推送

**HTTP/2传输数据量的大幅减少，主要有两个原因：以二进制方式传输和Header压缩**

#### 二进制传输(二进制分帧)

HTTP2把报文从文本全部换成二进制格式了，二进制协议解析起来更高效，HTTP2将请求和响应数据分割为更小的帧，并且它们采用二进制编码。<br />把TCP协议的部分特性摞到了应用层，把原来的`Headers+Body`的报文消息打散为数个小片的二进制帧(Frame)。用**HEADERS帧**存放头部字段，**DATA帧**存放请求体数据。分帧之后，服务器看到的不再是一个个完整的HTTP请求报文，而是一堆乱序的二进制帧。这些二进制帧不存在先后关系，因此也就不会排队等待，也就没有了HTTP的队头阻塞问题。<br />通信双方都可以给对方发送二进制帧，这种二进制帧的双向传输的序列，也叫做流，HTTP2用流来在一个TCP连接上来进行多个数据帧的通信，这就是多路复用的概念。<br />**如何保证乱序的数据帧？**<br />乱序指的是不同ID的Stream是乱序的，同一个StreamID的帧一定是按顺序传输的，二进制帧到达后对方会将StreamID相同的二进制帧组装成完成的请求报文和响应报文。

#### 头部编码(Header压缩)-HPack算法

HTTP1.x时代，请求体一般有响应的压缩编码过程，通过`Content-Encoding`头部字段来指定。HTTP2针对头部字段，并没有使用传统的压缩算法，而是开发了专门的压缩算法——**HPACK算法**，对请求头进行压缩<br />HPack算法：服务器和客户端之间建立哈希表(字典)，将用到的字段存放在这张表中，那么在传输的时候对于之前出现过的值，只需要把索引传给对方即可，对方拿到索引查表即可，这种传索引的方式，让请求头字段得到极大程度的精简和复用；还采用哈夫曼编码来压缩整数和字符串，可以达到50%~90%的高压缩率。<br />具体来说：

- 在客户端和服务端使用`首部表`来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送
- 首部表在HTTP2的连接存续期内始终存在，由客户端和服务器共同渐进地更新
- 每个新的首部键值对要么被追加到当前表的末尾，要么替换表中之前的值

![首先把头部的键值对内容根据对应的表进行转换，最后经过编码生成最终的压缩后的数据。](https://cdn.nlark.com/yuque/0/2023/png/694278/1677081478103-8f06e4c7-a370-479c-a4d0-7013c563fb5d.png#averageHue=%23f2f2f2&clientId=u6d742520-5f47-4&from=paste&height=397&id=u80bde6a2&originHeight=676&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=true&size=321708&status=done&style=none&taskId=u7ae8302d-6843-48fe-b1dd-8556bc5055f&title=%E9%A6%96%E5%85%88%E6%8A%8A%E5%A4%B4%E9%83%A8%E7%9A%84%E9%94%AE%E5%80%BC%E5%AF%B9%E5%86%85%E5%AE%B9%E6%A0%B9%E6%8D%AE%E5%AF%B9%E5%BA%94%E7%9A%84%E8%A1%A8%E8%BF%9B%E8%A1%8C%E8%BD%AC%E6%8D%A2%EF%BC%8C%E6%9C%80%E5%90%8E%E7%BB%8F%E8%BF%87%E7%BC%96%E7%A0%81%E7%94%9F%E6%88%90%E6%9C%80%E7%BB%88%E7%9A%84%E5%8E%8B%E7%BC%A9%E5%90%8E%E7%9A%84%E6%95%B0%E6%8D%AE%E3%80%82&width=704 "首先把头部的键值对内容根据对应的表进行转换，最后经过编码生成最终的压缩后的数据。")

#### 多路复用

HTTP2有了二进制分帧之后，HTTP2不再依赖TCP连接去实现多流并行了：

- 同域名下所有通信都在单个TCP连接上完成

> 同个域名只需要占用一个TCP连接，使用一个TCP连接并行发送多个请求和响应，这样整个页面资源的下载过程只需要一次慢启动，同时也避免了多个TCP连接竞争带宽所带来的问题

- 单个TCP连接可以承载任意数量的双向数据流Stream

> 并行交错地发送多个请求/响应，请求/响应之间互不影响，不像HTTP1.x那样排队阻塞

- 数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装
- HTTP2中，每个请求都可以带一个31bit的优先级，0表示最高优先级，数值越大优先级越低。有了这个优先级，客户端和服务器就可以处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

**多路复用的技术可以只通过一个TCP连接就可以传输所有的请求数据：**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1673027239820-29cc6702-98b5-4857-9a71-bcdd1dbd31d8.png#averageHue=%23efefee&clientId=u6a4318b4-40b0-4&from=paste&height=314&id=u0957ad76&originHeight=554&originWidth=1111&originalType=binary&ratio=1&rotation=0&showTitle=false&size=149446&status=done&style=none&taskId=u9df941ed-89de-47bf-9784-edfdf39bcff&title=&width=630.6666870117188)

#### 服务器推送 (Server Push)

HTTP2还在一定程度上改变了传统的“请求-应答”工作模式，服务器不再是完全被动地响应请求，也可以新建“流”主动向客户端发送消息。比如，在浏览器刚请求HTML的时候就提前把可能会用到的JS、CSS文件发给客户端，减少等待的延迟，这被称为"服务器推送"（ Server Push，也叫 Cache push）

> 另外需要补充的是,服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST_STREAM帧来拒收。主动推送也遵守同源策略，换句话说，服务器不能随便将第三方资源推送给客户端，而必须是经过双方确认才行。

### HTTP2缺点

虽然HTTP2解决了很多之前旧版本的问题，但是它还是存在一个巨大的问题，主要是底层支撑的TCP协议造成的。HTTP2的主要缺点：

1. TCP以及TCP+TLS建立连接慢，延时
2. TCP的队头阻塞并没有彻底解决
3. 多路复用导致服务器压力上升
4. 多路复用容易timeout

#### 建立连接慢，延时（还是和HTTP1.x一样，未优化）

HTTP2还是使用TCP协议来传输的，如果使用HTTPS的话，还需要使用TLS协议进行安全传输，而TLS还有一个握手过程，这样就需要两个握手延迟过程

- 建立TCP连接时，需要和服务器进行三次握手来确认连接成功，需要消耗1.5个RTT才能进行数据传输
- 进行TLS连接，TLS分不同的版本，1.2和1.3，每个版本建立连接所花费时间不同，大致需要0~2个RTT（利用SessionID/Session Ticket可达到1-RTT、TLS1.3用PSK可达到0-RTT）

总之，在传输数据之前，需要花费2~4个RTT。

> RTT（Round-Trip Time）：往返时延，表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后立即发送确认），总共经历的时延。

#### TCP队头阻塞未解决

HTTP2只解决了HTTP的队头阻塞，未解决底层TCP队头阻塞问题。<br />HTTP2多个请求是跑在一个TCP连接中，当出现了丢包时，HTTP2的表现反倒不如HTTP1.x了。因为TCP为了保证可靠传输，有个`丢包重传`机制，丢失的包必须要等待重新传输确认，HTTP2出现丢包时，整个TCP都要开始等待重传，那么就会阻塞该TCP连接上的所有请求，而对于HTTP1.1来说，可以开启多个TCP连接，出现这种情况反倒只会影响其中一个连接，剩余的TCP连接还可以正常传输数据。<br />![http2协议队头阻塞](https://cdn.nlark.com/yuque/0/2022/png/694278/1669603565709-4d821c37-4687-4937-a0f5-277953aa27d1.png#averageHue=%23d4e3cf&clientId=ua73c11a6-4b18-4&from=paste&height=191&id=uac866c4b&originHeight=256&originWidth=801&originalType=url&ratio=1&rotation=0&showTitle=true&size=71828&status=done&style=none&taskId=u0695fe82-d7d7-4afc-a151-7218976f34b&title=http2%E5%8D%8F%E8%AE%AE%E9%98%9F%E5%A4%B4%E9%98%BB%E5%A1%9E&width=598 "http2协议队头阻塞")

> 因为http2使用的是多路复用的流模型，一个tcp连接的发送数据过程中可能会把一个个请求分割成多个流发送到服务器，因为tcp的tls加密是一个record的加密，也就是接近10stream大小进行加密，如果其中在某一个流丢失了，整一串都会解密失败。这就是http2最为严重的队头阻塞问题。

#### 多路复用压力大，容易timeout

多路复用没有限制同时请求数，请求的平均数量与往常相同，但实际会有许多请求的短暂爆发，导致瞬时QPS暴增。<br />大批量的请求同时发送，由于HTTP2连接上存在多个并行的流，而网络带宽和服务器资源优先，每个流的资源都会被稀释，虽然它们开始时间相差更短，但却都可能超时。

#### 网络切换导致四元组变化，需要重建连接

3. 基于TCP四元组确定一个链接，在移动互联网中表现不佳。因为移动设备经常移动，可能在公交地铁等地方，出现了基站变换，Wi-Fi变化等状态。导致四元组发声变化，而**需要重新建立连接**。

## QUIC/HTTP3.x

见`QUIC`章节

# HTTP协议

## HTTP协议组成

### HTTP1.x报文结构

**请求报文**<br />![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1672332497666-81685a38-5829-43cb-8c93-3bcb11372316.webp#averageHue=%2392c958&clientId=u36ff4947-d98b-4&from=paste&height=209&id=u85f09d2e&originHeight=1314&originWidth=3000&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u638956cb-26bf-4a46-9e19-02ff54e9c13&title=&width=477)<br />**响应报文**<br />![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1672332513163-fa24f355-5a26-4a6f-8fed-c681c1b4f0da.webp#averageHue=%2394cb5b&clientId=u36ff4947-d98b-4&from=paste&height=205&id=ue6d15fcb&originHeight=1344&originWidth=3000&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u666e8a1b-1dfe-4430-b4bf-0c47eab9d0e&title=&width=458)

### HTTP请求方法

http/1.1规定了以下请求方法(注意，都是大写):

1. **GET** 通常用来获取资源，没有body，幂等性
2. **POST** 增加或修改资源(上传数据)，有body
3. **PUT** 修改资源，有body，幂等性
4. **DELETE** 删除资源，幂等性
5. **HEAD** 获取资源的元信息
6. **CONNECT** 建立连接隧道，用于代理服务器
7. **OPTIONS** 列出可对资源实行的请求方法，用来跨域请求
8. **TRACE** 追踪请求-响应的传输路径

### HTTP状态码

RFC 规定 HTTP 的状态码为三位数，被分为五类：

- **1xx**: 表示目前是协议处理的中间状态，还需要后续操作。
- **2xx**: 表示成功状态。
- **3xx**: 重定向状态，资源位置发生变动，需要重新请求。
- **4xx**: 请求报文有误。
- **5xx**: 服务器端发生错误。

**1xx**

- **101 Switching Protocols**。在HTTP升级为WebSocket的时候，如果服务器同意变更，就会发送状态码 101。

**2xx**

- **200 OK**是见得最多的成功状态码。通常在响应体中放有数据。
- **204 No Content**含义与 200 相同，但响应头后没有 body 数据。
- **206 Partial Content**顾名思义，表示部分内容，它的使用场景为 HTTP 分块下载和断点续传，当然也会带上相应的响应头字段Content-Range。

**3xx**

- **301 Moved Permanently**即永久重定向，对应着**302 Found**，即临时重定向。

> 1. 比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。
> 2. 如果只是暂时不可用，那么直接返回302即可，和301不同的是，浏览器并不会做缓存优化。

- **304 Not Modified**: 当协商缓存命中时会返回这个状态码。详见浏览器缓存

**4xx**

- **400 Bad Request**: 开发者经常看到一头雾水，只是笼统地提示了一下错误，并不知道哪里出错了。
- **403 Forbidden**: 这实际上并不是请求报文出错，而是服务器禁止访问，原因有很多，比如法律禁止、信息敏感。
- **404 Not Found**: 资源未找到，表示没在服务器上找到相应的资源。
- **405 Method Not Allowed**: 请求方法不被服务器端允许。
- **406 Not Acceptable**: 资源无法满足客户端的条件。
- **408 Request Timeout**: 服务器等待了太长时间。
- **409 Conflict**: 多个请求发生了冲突。
- **413 Request Entity Too Large**: 请求体的数据过大。
- **414 Request-URI Too Long**: 请求行里的 URI 太大。
- **429 Too Many Request**: 客户端发送的请求过多。
- **431 Request Header Fields Too Large**请求头的字段内容太大。

**5xx**

- **500 Internal Server Error**: 仅仅告诉你服务器出错了，出了啥错咱也不知道。
- **501 Not Implemented**: 表示客户端请求的功能还不支持。
- **502 Bad Gateway**: 服务器自身是正常的，但访问的时候出错了，啥错误咱也不知道。
- **503 Service Unavailable**: 表示服务器当前很忙，暂时无法响应服务。

### HTTP请求头有哪些？

#### 数据类型、压缩格式、语言和字符集（Content-Type、Content-Encoding、Content-Languages）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1672588660045-1f120747-987f-43c7-9343-fe0ef3d2ef2c.png#averageHue=%23d4e4e9&clientId=u7a530de7-b8eb-4&from=paste&height=293&id=ue2988b76&originHeight=1154&originWidth=2465&originalType=binary&ratio=1&rotation=0&showTitle=false&size=565627&status=done&style=none&taskId=u1978fba2-5c03-452a-8d24-045602200b1&title=&width=626)

##### Content-Type/`Accept` 发送端发送的数据MIME类型

发送端发送的数据格式`Content-Type`，接收端对应`Accept`

- text： text/html, text/plain, text/css 等
- image: image/gif, image/jpeg, image/png 等
- audio/video: audio/mpeg, video/mp4 等
- application: application/json, application/javascript, application/pdf, application/octet-stream

##### Content-Encoding/`Accept-Encoding` 发送端压缩格式

Accept-Encoding 和Content-Encoding是HTTP中用来对采用哪种编码格式传输正文进行协定的一对头部字段；发送端数据的压缩格式`Content-Encoding`，接收端`Accept-Encoding`

- gzip: 当今最流行的压缩格式
- deflate: 另外一种著名的压缩格式
- br: 一种专门为 HTTP 发明的压缩算法

##### Content-Language/Accept-Language 支持的语言

发送端的语言`Content-Language`，接收端`Accept-Language`

##### 字符集

发送端的字符集`Content-Type: text/html; charset=utf-8`，接收端`Accept-Charset: charset=utf-8`

#### 定长和分块传输（Content-Length和chunked）

##### `Content-Length`定长

响应头`Content-Length`指明内容的固定大小

##### Transfer-Encoding 不定长

响应头`Transfer-Encoding: chunked`，表示分块传输数据，设置这个header后有两个效果：

- Content-Length会被忽略
- 基于长链接持续推送动态内容

#### 大文件传输、分块传输（Range和Content-Range）

客户端请求用`Range`，服务端返回用`Content-Range`

##### Range

对于客户端而言，它需要指定请求哪一部分，通过Range这个请求头字段确定，格式为`Range: bytes=x-y,x1-y1`

- **0-499**表示从开始到第 499 个字节
- **500**- 表示从第 500 字节到文件终点。
- **-100**表示文件的最后100个字节。

```kotlin
// 请求单段数据
Range: bytes=0-9
// 请求多段数据
Range: bytes=0-9, 30-39

1. HTTP请求头字段
Range头指示服务器只传输一部分Web资源。这个头可以用来实现断点续传功能。Range字段可以通过三种格式设置要传输的字节范围：
Range:bytes=1000-2000    传输范围从1000到2000字节。
Range:bytes=1000-   传输Web资源中第1000个字节以后的所有内容。
Range bytes=1000   传输最后1000个字节。

2. HTTP响应消息头字段
Accept-Ranges：这个字段说明Web服务器是否支持Range支持，则返回Accept-Ranges:bytes，如果不支持，则返回Accept-Ranges:none.
Content-Range：指定了返回的Web资源的字节范围。这个字段值的格式是：例子： Content-Range：1000-3000/5000
```

可用于实现断点下载续传功能

##### Content-Range

- 单段数据

```kotlin
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100 // 0-9表示请求的返回，100表示资源的总大小

i am xxxxx
```

- 多段数据

```kotlin
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101 // 多段数据、响应体中的分隔符
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101-- // 分隔末尾添上--表示结束
```

##### http分块传输原理

http协议定义的分块传输的响应header字段，具体是否支持取决于server的实现，通过在请求头加上`range`字段来验证服务器是否支持分块传输：

```shell
curl -H "Range: bytes=0-10" http://download.dcloud.net.cn/HBuilder.9.0.2.macosx_64.dmg -v
# 请求头
> GET /HBuilder.9.0.2.macosx_64.dmg HTTP/1.1
> Host: download.dcloud.net.cn
> User-Agent: curl/7.54.0
> Accept: */*
> Range: bytes=0-10
# 响应头
< HTTP/1.1 206 Partial Content
< Content-Type: application/octet-stream
< Content-Length: 11
< Connection: keep-alive
< Date: Thu, 21 Feb 2019 06:25:15 GMT
< Content-Range: bytes 0-10/233295878
```

> 在请求头中添加"Range: bytes=0-10"的作用是，告诉服务器本次请求我们只想获取文件0-10(包括10，共11字节)这块内容。如果服务器支持分块传输，则响应状态码为206，表示“部分内容”，并且同时响应头中包含“Content-Range”字段，如果不支持则不会包含

Content-Range: bytes 0-10/233295878<br />0-10表示本次返回的区块，233295878代表文件的总长度，单位都是byte, 也就是该文件大概233M多一点。<br />简单的设计一个多线程的文件分块下载器：

1. 先检测是否支持分块传输，如果不支持，直接下载；如果支持，将剩余内容分块下载
2. 各个分块下载时保存到各自临时文件，等待所有分块下载完成后合并临时文件
3. 删除临时文件

#### HTTP表单数据

在HTTP中，有两种主要的表单提交的方式，体现在两种不同的`Content-Type`取值:

- application/x-www-form-urlencoded
- multipart/form-data

##### application/x-www-form-urlencoded URL编码

- 其中的数据会被编码成以`&`分隔的键值对
- 字符以`URL编码`方式编码

> 如a=1&b=2，转换为a%3D1%26b%3D2

##### multipart/form-data

- 请求头中的Content-Type字段会包含boundary，且boundary的值有浏览器默认指定。例: `Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe`。
- 数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 HTTP 头部描述子包体，如Content-Type，在最后的分隔符会加上`--`表示结束。

```kotlin
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```

### HTTP缓存

#### HTTP缓存相关Header

**Expires**<br />在HTTP1.0，响应使用Expires头标识缓存的有效期，其值是一个绝对时间，当客户端再次发出网络请求时可比较当前时间和上次响应的Expires时间进行比较，来决定是使用缓存还是发起新的请求

> ⽐如Expires:Thu,31 Dec 2020 23:59:59 GMT。使用Expires最大的问题是它依赖客户端的本地时间，如果用户自己修改了本地时间，就会导致无法准确的判断缓存是否过期。

**Cache-Control**<br />HTTP1.1推出，优先级高于Expires。主要值有：

1. private 默认值，标识那些私有的业务逻辑数据，比如根据用户行为下发的推荐数据。该模式下网络链路中的代理服务器等节点不应该缓存这部分数据，因为没有实际意义。
2. public 内容是公开的，中间节点可缓存。public和private相反，用于标识那些通用的业务数据，比如获取新闻列表，所有人看到的都是同一份数据，因此客户端、代理服务器都可以缓存
3. no-cache 可进行缓存，但在客户端使用缓存前必须去服务器进行缓存资源有效性的验证
4. max-age 表示缓存时长，单位为秒，指一个时间段，比如一年，通常用于不经常变化的静态资源
5. no-store 任何节点禁止使用缓存

#### HTTP缓存原理

**强制缓存**<br />网络请求响应header标识了Expires或Cache-Control带了max-age信息，客户端计算缓存并未过期，则可以直接使用本地缓存内容，而不用真正的发起一次网络请求

> 强制缓存缺点：一旦服务器有资源更新，直到缓存时间截止前，客户端无法获取到最新的资源（除非请求时手动添加no-store头）

**协商缓存**<br />几种头来实现协商缓存：

1. Last-Modified/If-Modified-Since头

- 在服务器响应头添加Last-Modified头标识资源的最后修改时间，单位为秒，当客户端再次发起网络请求时添加If-Modified-Since头并赋值为上次请求拿到的Last-Modified头的值
- 服务器收到请求后自行判断资源是否仍然有效，如果有效则返回状态码304同时body体位空，否则下发最新的资源数据；客户端如果发现响应状态码是304，则取出本地的缓存数据作为响应内容。

> 这套方案问题：
>
> - 资源文件使用最后修改时间有一定局限性，Last-Modified单位为秒，如果某些文件在一秒内被修改则并不能准确的标识修改时间；
> - 资源修改时间并不能作为资源是否修改的唯一依据（比如资源文件是Daily Build的，每天都会生成新的，但是其实实际内容可能并未改变）

2. If-None-Match/Etag头

标签，类似指纹。流程和Last-Modified一样，只是把服务器响应头换成ETag，客户端发出请求的头变成了If-None-Match。<br />ETag是资源的唯一标识，服务端资源变化一定会导致ETag变化。ETag具体的生成方式由服务端控制，常见的影响因素包括：文件最终修改时间、文件大小、文件编号等。

### URI和URL？

**URI**, 全称为(Uniform Resource Identifier), 也就是**统一资源标识符**，它的作用很简单，就是区分互联网上不同的资源。但是，它并不是我们常说的网址, 网址指的是URL, 实际上URI包含了URN和URL两个部分，由于 URL 过于普及，就默认将 URI 视为 URL 了。<br />URI只能使用ASCII, ASCII 之外的字符是不支持显示的，需要编码。<br />**URI结构**<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1672332914245-20475b89-2613-48ba-a64b-03173eb36468.png#averageHue=%2355bae4&clientId=u36ff4947-d98b-4&from=paste&height=94&id=u56bef69c&originHeight=345&originWidth=2436&originalType=binary&ratio=1&rotation=0&showTitle=false&size=197161&status=done&style=shadow&taskId=uf148a578-2076-4704-9dcb-1329653299d&title=&width=662)

- **scheme** 表示协议名，比如http, https, file等等。后面必须和://连在一起。
- **user:passwd**@ 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。
- **host:port **表示主机名和端口。
- **path **表示请求路径，标记资源所在位置。
- **query **表示查询参数，为key=val这种形式，多个键值对之间用&隔开。
- **fragment **表示URI所定位的资源内的一个**锚点**，浏览器可以根据这个锚点跳转到对应的位置。

> <https://www.baidu.com/s?wd=HTTP&rsv_spt=1>

### HTTP特点

#### 灵活可扩展

HTTP协议只规定了基本格式；另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。

#### 可靠传输

HTTP 基于 TCP/IP，因此把这一特性继承了下来

#### 请求-应答

也就是一发一收、有来有回

#### 无状态性

**无状态性**指的是HTTP协议对于事物处理没有记忆能力，每一次请求之间是没有联系的，都是独立的，服务器不知道请求两次之间是否是同一个用户。

- HTTP/1.0时代每个TCP连接只能发送一个请求，因此无法在连接中产生会话的概念，属于无状态协议
- HTTP/1.1时代引入了keep-alive即TCP连接默认不关闭，可以被多个请求复用。但此时的连接复用仅仅是为了提高传输效率，keep-alive默认情况下，它的若干个请求会排队串行化单线程处理，即后面的请求等待前面请求的返回才能获得执行机会，它们之间没有什么关联，也属于无状态协议
- 至于HTTP/2，它应该算是一个有状态的协议了（有握手和GOAWAY消息，有类似于TCP的流控），所以以后说“HTTP是无状态的协议”就不太对了，最好说“HTTP 1.x是无状态的协议”

**TCP有状态吗？**<br />TCP是有状态的，在一次TCP连接中，每一次的数据交换都和上一次紧密相关的，TCP报文存在ACK字段用于确认上次接收的报文，每一次TCP数据交换双方都是能够确切知道对方的信息。<br />**为什么基于TCP的HTTP是无状态的？**<br />HTTP协议利用TCP协议来进行数据传输的，因为它们本身并没有强关联，它们处于OSI不同层次（HTTP应用层协议，TCP属于传输层协议），不能说TCP是有状态，HTTP协议就有状态<br />**HTTP1.1后支持了keep-alive，那么每次HTTP请求还是无状态吗？**<br />也是无状态，不同的请求还是按队列来响应的，它们之间没有任何关联<br />**为什么不改进 http 协议使之有状态？**<br />最初的 http 协议只是用来浏览静态文件的，无状态协议已经足够，这样实现的负担也很轻（相对来说，实现有状态的代价是很高的，要维护状态，根据状态来操作。）引入了Cookie和Session来保证有状态。

### HTTP缺点

1. 无状态

> 在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。
> 但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。

2. 明文传输 数据不安全
3. 队头阻塞问题

> 当 HTTP 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的**HTTP队头阻塞**问题。

## HTTP和HTTPS的区别？

HTTPS 相比 HTTP最大的不同就是多了一层 SSL (Secure Sockets Layer 安全套接层)或 TLS (Transport Layer Security 安全传输层协议)。

## Cookie、Session和Token

### Cookie

**背景**<br />HTTP 协议是无状态的，无状态意味着，服务器无法给不同的客户端响应不同的信息。这样一些交互业务就无法支撑了。Cookie 应运而生。<br />**什么是Cookie？**<br />Cookie是浏览器里存储的一个很小的文本文件，内部以键值对的方式来存储；Cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息。<br />Cookie最大的作用就是存储sessionID用来唯一标识用户。<br />Cookie不可跨域名<br />**Cookie流程**

1. Client发送HTTP请求给Server
2. Server响应，并附带`set-cookie`的头信息
3. Client保存Cookie，之后请求Server会覆盖`cookie:xxx`的头信息
4. Server从Cookie知道Client是谁了，返回相应的响应

**Cookie缺点**

1. 安全缺陷 Cookie很容易被非法用户截获，然后进行一系列的篡改，最后在Cookie的有效期内重新发送给服务器
2. 容量缺陷：体积上限只有4K，只能用来存储少量的信息
3. 性能缺陷：Cookie紧跟域名，因此域名下的请求都会携带上完整的Cookie，造成性能浪费，因为请求携带了很多不必要的内容。

### Session

**什么是Session？**

- Session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而Session保存在服务器上
- 客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上。这就是Session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了
- 如果说Cookie机制是通过检查客户身上的“通行证”来确定客户身份的话，那么Session机制就是通过检查服务器上的“客户明细表”来确认客户身份。
- Session相当于程序在服务器上建立的一份客户档案，客户来访的时候只需要查询客户档案表就可以了。

**Session缺点**

1. Session信息保存在服务器，会话多了后，服务器压力增大
2. SessionID存储在Cookie，还是有暴露的风险，比如CSRF（Cross-Site Request Forgery，跨站请求伪造）

### Cookie和Session关系

- cookie是一个实际存在的、具体的东西，HTTP协议中定义在header中的字段
- session是一个抽象概念，开发者为了实现中断和继续等操作，将Client和Server之间一对一的交互，抽象为会话，进行衍生出会话状态，这就session的概念
- session描述的是一种通信会话机制，而Cookie只是目前实现这种机制的主流方案里面的一个参与者，它一般用于保存session ID

### Token 令牌

Token 就是一段字符串，Token 传递的过程跟 Cookie 类似，只是传递对象变成了 Token。用户使用用户名、密码请求服务器后，服务器就生成 Token，在响应中返给客户端，客户端再次请求时附带上 Token，服务器就用这个 Token 进行认证鉴权。<br />Token一般放header，不放body或url query，否则和请求业务的参数混合在一起，导致代码混乱

## Http错误

### 线上问题-ERR_CONNECTION_CLOSED

问题：线上一个链接在不登录时能正常打开，登录后就打不开报错ERR_CONNECTION_CLOSED<br />分析：登录后有很多ABT参数会被设置到request header，导致header过大，报错<br />解决：header数据不要过大

- [x] [线上问题-ERR_CONNECTION_CLOSED](https://1991421.cn/2021/09/21/844e39cc/)

# HTTP相关面试题

## HTTP队头阻塞和TCP队头阻塞？怎么解决？

- HTTP1.0/HTTP1.1存在HTTP队头阻塞
  - **并发连接**：一个域名允许多个TCP长连接，不会阻塞一个队列的所有任务；RFC2616标准是2个，Chrome是6个
  - **域名分片：**一个顶级域名划分为多个二级域名，多个二级域名都指向同一台服务器，能并发的连接就更多了
  - **pipeline**：请求管道化，Client可以并行发送请求，由于HTTP的无状态性，请求没有序号，Server必须串行的一个个处理客户端请求，如果前一个请求慢，那就会阻塞后面请求的响应
  - 并发连接和域名分片，本质还是提高一个域名下的TCP连接数，并没有本质上解决HTTP队头阻塞问题，多条TCP连接还会竞争有限的带宽资源
- HTTP2.0解决HTTP队头阻塞，还存在TCP队头阻塞
  - **多路复用：**二进制分帧**，**报文由文本变为了二进制，请求/响应报文拆分成若干个帧：Header帧，Data帧，每个帧有序号，一个TCP存在多个流，一个帧在一个流传输，流互相独立，也就不存在HTTP队头阻塞问题了
  - HTTP2.0通过多路复用同一个TCP连接解决了队头阻塞问题，前提是TCP协议不出现任何数据包阻塞的前提
  - HTTP2.0还是基于TCP，如果网络环境不好，数据包超时确认或丢失导致的重传，导致TCP的滑动窗口阻塞了后续数据包的发送，就是TCP队头阻塞
- HTTP3.0（基于UDP的QUIC）解决了TCP队头阻塞
  - 需要重传的数据包不阻塞在当前窗口，而是转移到最后的当成新的数据包发送：QUIC使用Packet Number单调递增的设计，可以让数据包不再像TCP那样必须有序确认，QUIC支持乱序确认，当数据包Packet N丢失后，只要有新的已接收数据包确认，当前窗口就会继续向右滑动

### HTTP1.x队头阻塞问题

HTTP传输是基于请求-响应的模型进行的，报文必须是一发一收，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理，这就是**HTTP队头阻塞**问题。<br />**HTTP1.1如何解决队头阻塞问题？（未基于HTTP本身解决队头阻塞问题）**

- **并发连接**：一个域名允许分配多个长连接，相当于增加了任务队列，不至于一个队列的任务阻塞其他所有任务。在RFC2616规定客户端最多并发2个连接，只不过事实上浏览器标准中，这个上限要多，Chrome是6个。即使提高了并发连接，还是不能满足对性能的需求。
- **域名分片**：如content1.haket.me、content2.hacket.me，这样hacket.me域名下可以分出非常多的二级域名，它们都指向同一台服务器，能够并发的长连接数更多了，事实上也更好地缓解了HTTP队头阻塞的问题。

**HTTP管道化**没有解决HTTP队头阻塞问题， 原因是HTTP管道化，客户端可以并行的发送请求，但服务器必须串行的处理客户端的请求，一个个响应，如果前一个请求慢，那就会阻塞后面请求的响应

### HTTP/1.1 管道(pipelining)解决了队头阻塞问题？

没有。<br />![HTTP1.1 pipelining](https://cdn.nlark.com/yuque/0/2023/webp/694278/1673537949249-3f7b2c08-20ec-406d-95a8-ecc6d0849b77.webp#averageHue=%23f5f5f5&clientId=u3cf4537e-1150-4&from=paste&height=397&id=u0121ee07&originHeight=839&originWidth=1440&originalType=url&ratio=1&rotation=0&showTitle=true&status=done&style=none&taskId=ue2adca36-41f6-470c-878e-9d65a5f65ec&title=HTTP1.1%20pipelining&width=682 "HTTP1.1 pipelining")

- 如果没有管道(上图左侧)，浏览器必须等待发送第二个资源请求，直到第一个请求的响应被完全接收，这会为每个请求增加一个RTT延迟
- 有了管道(上图中间)，浏览器不必等待任何响应数据，就可以发送新的请求，这样就可以节省一些RTTs。但服务器必须按照接收请求的顺序发送对这些管道化请求的响应。**管道解决了请求的队头阻塞，而不是响应的队头阻塞**。可悲的是，响应队头阻塞是导致 Web 性能问题最多的原因。更糟糕的是，大多数浏览器实际上并没有在现实中使用 HTTP/1.1 管道，因为这会使队头阻塞在多个并行 TCP 连接的设置中变得更加不可预测。

### HTTTP2如何解决HTTP队头阻塞

HTTP1.1并没有真正从HTTP本身层面解决该问题，只是增加了TCP连接，分摊风险而已。多条TCP连接会竞争有限的带宽，让真正优先级高的请求不能优先处理。而HTTP2从HTTP协议本身解决了队头阻塞问题。<br />HTTP2引入了帧、消息和数据流等概念，每个请求/响应被称为消息，每个消息都被拆分成若干个帧进行传输，每个帧都分配一个序号。每个帧在传输是属于一个数据流，而一个连接上可以存在多个流，各个帧在流和连接上独立传输，到达之后在组装成消息，这样就避免了请求/响应阻塞。<br />把TCP协议的部分特性摞到了应用层，把原来的`Headers+Body`的报文消息打散为数个小片的二进制帧(Frame)。用**HEADERS帧**存放头部字段，**DATA帧**存放请求体数据。分帧之后，服务器看到的不再是一个个完整的HTTP请求报文，而是一堆乱序的二进制帧。这些二进制帧不存在先后关系，因此也就不会排队等待，也就没有了HTTP的队头阻塞问题。

### HTTP队头阻塞和TCP队头阻塞

- HTTP协议的队头阻塞是在应用层，而TCP协议的队头阻塞是在传输层
- TCP的队头阻塞是在数据包层面，单位是数据包，前一个报文没有收到就不会将后面收到的报文上传给HTTP，而HTTP的队头阻塞是在HTTP请求-响应层面，前一个请求没处理完，后面的请求就要阻塞。

### HTTP2的TCP队头阻塞(TCP丢包重传)

HTTTP2还是基于TCP协议的，还是存在TCP队头阻塞问题。TCP中的队头阻塞的产生是由TCP自身的实现机制决定的，无法避免。想要在应用程序当中避免TCP队头阻塞带来的影响，只有舍弃TCP协议。<br />HTTP2主要的问题在于，多个HTTP请求在复用一个TCP连接，下层的TCP协议是不知道有多少个HTTP请求的，所以一旦发生了**TCP丢包**现象，就会触发TCP的重传机制，这样在一个TCP连接中的所有HTTP请求都必须等待这个丢了的包被重传回来（即如果一个TCP包丢失，所有后续的包都需要等待它的重传，先到的数据包不会传递给HTTP，直到丢失的包重传成功，即使它们包含来自不同流的无关联数据）。

> 假设包3先到达，服务器端必须等待包2到达后，才将其和包3发送给浏览器。

### HTTTP3(基于QUIC)真正解决TCP队头阻塞

由于TCP本身的限制，难以对其进行改变。<br />所以HTTP3选择的替代方法是实现一个全新的传输层协议QUIC，它运行在不可靠的UDP协议之上，但它包括TCP的所有特性（可靠性、拥塞控制、流量控制和排序等），且集成了TLS，不允许未加密的连接。HTTP3运行在QUIC协议之上。<br />QUIC的流帧(Stream Frames)分别跟踪每个流的字节范围，QUIC协议知道有自己独立的流。<br />当服务器端知道包3比包2早到达，QUIC查看流1的字节范围，发现这个流帧完全遵循流id 1的第一个流帧，它可以立即将这些数据提供给浏览器进行处理，然而对于流id 2，QUIC确实看到了一个缺口（它还没有接收到字节0-299，这些字节在丢失的QUIC数据包2中），它将保存该流帧，直到QUIC数据包2的重传到达。

## GET请求和POST请求的区别？

GET和POST本质上都是TCP连接，**并无差别**，但是由于HTTP的规定和浏览器/服务器的限制，导致它们在应用过程中体现出一些不同

- 从**缓存**的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。
- 从**编码**的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制，支持多种编码方式。
- 从**参数**的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
- 从**幂等性**的角度，GET是**幂等**的，而POST不是。(幂等表示执行相同的操作，结果也是相同的)
- GET请求参数会被完整的记录在浏览历史中，而POST的参数不会被保留
- 从**TCP**的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(**火狐**浏览器除外，它的 POST 请求只发一个 TCP 包)

## HTTP1.0、HTTP1.1、HTTP2和HTTP3协议的介绍？

### HTTP1.0

- 1996年，HTTP1.0使用
- TCP连接不复用，每发起一个网络请求都要重新建立连接。但由于TCP的三次握手和四次挥手机制，都会经历这样一个慢启动过程。所以HTTP1.0的性能很差

> HTTP1.0实现中，如果需要从服务端获取大量资源，会开启N条TCP短链接，并行的获取信息。

### HTTP1.1

- 1999年，HTTP1.1开始使用
- 持久连接keep-alive：HTTP1.1支持持久连接和请求流水线(Pipelining)处理。在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，HTTP1.1默认开启keep-alive。
- HTTP1.1队头阻塞：后面的请求必须等待前面的请求完成才能进行，当所有请求都集中在一条连接时，在网络拥塞时就会出现队头阻塞

### SPDY

- 多路复用TCP通道，降低HTTP的高延时
- 允许请求设置优先级
- 头部压缩
- 基于SSL的安全传输
- 还是使用文本格式的协议

### HTTP2.0（基于SPDY修改）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677078537988-7d80b891-ce57-4345-a715-78e1d6ba9599.png#averageHue=%23c8c6c4&clientId=u6d742520-5f47-4&from=paste&height=456&id=u9ddad40d&originHeight=980&originWidth=836&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=173509&status=done&style=none&taskId=ua7dad4c7-79c6-4d2c-8c21-f8702b20a20&title=&width=389)

- TLS1.2
- 二进制分帧：请求和响应采用二进制格式，所有的传输信息分割为更小的帧，有Headers帧和Data帧
- TCP多路复用：单个TCP连接，在一条连接上，可以发送多个请求和响应
- 头部压缩，采用HPACK压缩算法，查表
- 服务器推送，服务端可以推送资源给客户端
- TCP队头阻塞：HTTP/2采用多路复用，多个资源可以共用一个连接。 但它解决的只是应用层的复用，在出现数据包丢失时，由于TCP重传机制，后面的资源需要等待前面的传输完毕才能继续。这就是队头阻塞现象(Head-of-line blocking)

### HTTP3.0（基于QUIC）

- 2018年，基于QUIC的HTTP3协议
- QUIC=HTTP2.0+TLS1.3+UDP
  - 基于UDP，没有了TCP的三次握手和四次挥手的过程，连接更快
  - 连接迁移不需要重新连接，用Connection ID替换了TCP四元组
  - QUIC抽象出了一个stream（流）的概念，多个流，可以复用一条连接，那么滑动窗口这些概念就不用作用在连接上了，而是作用在stream上。由于UDP只管发送不管成功与否的特性，这些数据包的传输就能够并发执行。协议的server端，会解析并缓存这些数据包，进行组装和整理等。由于抽象出了stream的概念，就使得某个数据包传输失败，只会影响个stream的准确性，而不是整个连接的准确性
