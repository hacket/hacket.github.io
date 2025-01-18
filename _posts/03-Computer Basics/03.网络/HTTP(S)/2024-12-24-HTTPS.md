---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
---

# HTTPS

## HTTPS为什么是安全的？

HTTPS=HTTP+TLS，多了一层TLS安全协议层，数据会经过加密传输的

## TLS/SSL

### 什么是TLS/SSL？TLS/SSL版本

SSL即安全套接层（Secure Sockets Layer），在OSI七层模型中处于会话层(第5层)。SSL出过三个大版本，当它发展到第三个大版本的时候才被标准化，成为TLS（传输层安全，Transport Layer Security），并当做TLS1.0版本。<br />TLS1.0=SSL3.1，1999年<br />TLS1.0、TLS1.1不安全了<br />TLS1.2 <br />TLS1.3 2018年推出，大大优化了TLS握手流程

### TLS基础

#### 数字证书

证书实际上就是一段符合指定标准的文本：

- 证书所属的域名
- 域名所有者的公钥
- 有效日期
- 使用的加密算法

CA机构会对这些内容使用哈希函数计算出一个值，然后用CA的私钥进行加密（签名），同时签名也将被记录到证书上<br />数字证书主要用来标识服务器身份，防止中间人攻击。<br />**证书验证**<br />用CA公布的公钥，来对被加密的值进行解密，然后对证书使用同样的哈希函数进行计算，并使用计算出的值和解密出的值进行比对，如果相等则说明没用被篡改过，可以放心使用证书上的公钥进行通信。

#### 加密套件

加密套件列表一般长这样：_TLS_ECDHE_WITH_AES_128_GCM_SHA256_

- 使用ECDHE算法生成pre_random
- 128位的AES算法进行对称加密，在对称加密的过程中使用主流的GCM分组模式
- 采用SHA256哈希摘要算法

### TLS握手流程

#### TLS握手的目的

TLS 握手的目的是建立安全连接，那么通信双方在这个过程中究竟干了什么呢？

1. 商定双方通信所使用的的 TLS 版本 (例如 TLS1.0, 1.2, 1.3等等)；
2. 确定双方所要使用的密码组合
3. 客户端通过服务器的公钥和数字证书上的数字签名验证服务端的身份；
4. 生成会话密钥，该密钥将用于握手结束后的对称加密

#### 最简化的TLS握手流程

1. Client向Server请求建立连接
2. Server将自己的证书发送给Client
3. Client验证证书，然后使用证书中的公钥加密接下来要用来通信的密钥，将加密结果发送给Server
4. Server收到后进行响应，且将该密钥来对需要发送或接收的上层数据进行加解密
5. 自此TLS握手完成，接下来开始使用密钥进行通信

![最简化的TLS握手流程](https://cdn.nlark.com/yuque/0/2023/png/694278/1672674724573-9cb8abe6-d59a-4c7b-90e9-967a4f06137c.png#averageHue=%23faf4f4&clientId=u98e4a21e-0f53-4&from=paste&height=424&id=u93d2f30f&originHeight=1243&originWidth=1512&originalType=binary&ratio=1&rotation=0&showTitle=true&size=158852&status=done&style=shadow&taskId=u524bcf34-a175-482f-820f-bdf555e0392&title=%E6%9C%80%E7%AE%80%E5%8C%96%E7%9A%84TLS%E6%8F%A1%E6%89%8B%E6%B5%81%E7%A8%8B&width=516 "最简化的TLS握手流程")

#### TLS1.0 RSA和DHE握手流程

1. Client向Server发送一个**随机数**、客户端**可使用的加密组件**、压缩算法和可能的Session ID。

> - 可使用的加密组件：Client需要告知Server自己支持的加密算法，让Server进行选择
> - 压缩算法不建议启用，在TLS1.3时相关功能还是被禁用
> - 可能的Session ID：是在Client在重连Server时减少握手成本的一个机制，重连时不需要重新走一次握手流程，只需要带着Session ID就能重连了
> - 随机数：

2. Server收到消息后返回**数字证书**、**Session ID**、**准备使用的加密组件**和可能使用的压缩算法，同时还会生成一个**随机数**并返回

> - 数字证书：
> - Session ID：如果启用了Session ID就会返回，后续Client重连时带上该Session ID就不需要走完整的握手流程了；Session ID也可能为空，代表Server不希望缓存会话
> - 随机数：

3. Client收到后进行**证书验证**，证书合法才会继续。然后根据密钥协商协议向Server发送规定的密钥交换信息

> Client生成_pre master secret_，_pre master secret_是用来生成_master secret_的重要参数，用证书上的公钥对_pre master secret_加密，发送给Server

4. Server和Client一起使用_**pre master secret**_与之前的**随机数**（客户端随机数+服务器随机数），通过协商好的加密算法生成_**master secret**_。然后Server和Client将开始使用master secret作为通信密钥进行通信
5. 紧接着，Client和Server互相向对方发送本次握手中所有报文生成的摘要（Hash算法计算结果），同时也是生成了master secret后发送的第一条加密信息
6. 当Client收到Server发来的摘要后，就可以正式开始发送应用数据

**TLS1.0 RSA握手流程**<br />![TLS1.0 RSA握手流程](https://cdn.nlark.com/yuque/0/2023/png/694278/1672765098226-af3ea9b9-6355-4ebf-a304-54c6e94e0b9a.png#averageHue=%23f9f5f5&clientId=ud0d3f589-47a2-4&from=paste&height=564&id=ubc05aa13&originHeight=1197&originWidth=1268&originalType=binary&ratio=1&rotation=0&showTitle=true&size=310824&status=done&style=none&taskId=u104c9770-f1c9-44fe-9554-ac8898b46ad&title=TLS1.0%20RSA%E6%8F%A1%E6%89%8B%E6%B5%81%E7%A8%8B&width=597 "TLS1.0 RSA握手流程")<br />**TLS1.0 DH(E)握手流程**<br />![TLS1.0 DH(E)握手流程](https://cdn.nlark.com/yuque/0/2023/png/694278/1672766138865-ee4f07cb-eabd-47e1-8d0f-72097281c7e0.png#averageHue=%23f9f5f5&clientId=ud0d3f589-47a2-4&from=paste&height=511&id=ud250f0ae&originHeight=1204&originWidth=1417&originalType=binary&ratio=1&rotation=0&showTitle=true&size=343252&status=done&style=none&taskId=u278a47d7-983e-406c-abad-ae67696c9d7&title=TLS1.0%20DH%28E%29%E6%8F%A1%E6%89%8B%E6%B5%81%E7%A8%8B&width=601 "TLS1.0 DH(E)握手流程")<br />**TLS1.0缺点**

- **慢**，建立一次TLS连接需要2⋅_RTT_，如果 http 使用 TLS 进行保护，那么如果每次加载一个资源都建立一条连接，那不是每个资源都会比普通的 http 慢上_2⋅RTT_？

> HTTP1.1默认开启了长连接，HTTP2.0启用了二进制分帧，一般不会为单独一个资源建立一条连接的，因此只会在初次连接时慢；TLS用了Session ID缓存来减少握手流程，握手时间减少了_1⋅RTT_，缺点就是缓存过小起不到作用，缓存过大需要占用更多内存资源维护SessionID到通信密钥的映射

- **RSA、DH不具备前向安全性** Forward Secrecy

> **前向安全性**（Forward Secrecy）指的是过去的通信的安全性不会受到未来的密钥泄露事件的影响。RSA 和 DH 的密钥协商方式在 TLS 1.3 中被删除就是因为不具备前向安全性。
> 拿 RSA 举例，如果我们一直使用 RSA 的密钥协商方式进行通信，虽然攻击人不能立刻的解密出通信密钥，但是可以持续的收集这些被加密的通信内容。直到某一天你的服务器终于被攻破，证书对应的私钥被攻击人拿到，那么他将可以使用私钥解密你在之前的所有连接建立时被加密的_pre master secret_ ，并生成_master secret_，然后可以获得使用该密钥加密的所有会话数据。
> 在这种情况下，由于被攻破的时间点前的被加密的通信数据会受到影响。所以**RSA不具备前向安全性。**
> 同样的，静态的 DH 算法由于公钥是固定在证书上的，所以**DH也不具备前向安全性**。
> 那 DHE 呢？由于它的私钥 n 每次都会重新生成，其证书只用于保证公钥 N 没有被篡改，在一次通信完成后私钥就会被丢弃，所以攻击者无法取得。中间人即使获得了证书的私钥，也只能使用中间人攻击获得在那之后的通信数据，而在那之前的通信数据则无法取得，所以说 **DHE具备前向安全性**。

#### TLS1.0 RSA握手详细过程

![](https://cdn.nlark.com/yuque/0/2022/png/694278/1655877439417-ce285c6f-b7b7-4ed3-a7d5-cc6d4d8c3cab.png#averageHue=%23eabc9d&clientId=uc50a236a-e470-4&from=paste&height=901&id=QGppr&originHeight=732&originWidth=618&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u96dc2b14-27b8-4b9a-a7f1-524b4af74ab&title=&width=761)

1. "client hello"消息：

> 客户端通过发送"client hello"消息向服务器发起握手请求，该消息包含了客户端所支持的 TLS 版本和密码组合以供服务器进行选择，还有一个"client random"随机字符串。

2. "server hello"消息：

> 服务器发送"server hello"消息对客户端进行回应，该消息包含了数字证书，服务器选择的密码组合和"server random"随机字符串。

3. 验证：

> 客户端对服务器发来的证书进行验证，确保对方的合法身份，验证过程可以细化为以下几个步骤：
>
> 1. 检查数字签名
> 2. 验证证书链
> 3. 检查证书的有效期
> 4. 检查证书的撤回状态 (撤回代表证书已失效)

4. "premaster secret"字符串：

> 客户端向服务器发送另一个随机字符串"premaster secret (预主密钥)"，这个字符串是经过服务器的公钥加密过的，只有对应的私钥才能解密。

5. 服务器使用私钥

> 服务器使用私钥解密"premaster secret"。

6. 客户端和服务器都生成共享密钥

> 客户端和服务器均使用 client random，server random 和 premaster secret，并通过相同的算法生成相同的共享密钥 KEY(master secret)。

7. 客户端就绪

> 客户端发送经过共享密钥 KEY加密过的"finished"信号。

8. 服务器就绪

> 服务器发送经过共享密钥 KEY加密过的"finished"信号。

9. 达成安全通信

> 握手完成，双方使用对称加密进行安全通信

#### TLS1.2握手流程优化（TLS False Start）

TLS1.2握手增加了一个叫做`Flase Start`抢跑的小优化，该优化在于Client无需等待收到来自Server的finish响应就可以开始发送被加密的业务数据，也就是说减少了一个RTT。<br />不过为了安全（由于是在finish消息前就开始发送业务数据，所以报文有被篡改的风险），这个小优化需要使用密钥协商算法具有前向安全性（如DHE或ECDHE）。<br />启用 False Start 时的 DHE/ECDHE 算法的握手流程：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1672846538696-4d73f56d-8638-4f17-b9b1-9a047626a762.png#averageHue=%23f5f5f5&clientId=ub5be1ac7-5723-4&from=paste&height=473&id=ud00d6d69&originHeight=709&originWidth=970&originalType=binary&ratio=1&rotation=0&showTitle=false&size=181557&status=done&style=shadow&taskId=ud1a3071a-caad-4103-8866-c9e20cb025d&title=&width=647)<br />**1、Client Hello**<br />Client发送`client_random`、`TLS版本`、`加密套件列表`<br />**2、Server Hello**<br />Server回复了很多内容：

- server_random是生成secret的一个参数
- 确认TLS版本
- 需要使用的加密套件
- server的数字证书
- server_params

**3、Client验证证书，生成master secret**<br />Client验证证书是否合法，如果验证通过，则传递client_params参数给Server；<br />Client通过ECDHE算法计算出pre_random，其中传入两个参数server_random和client_random，ECDHE基于_椭圆曲线离散对数_，这两个参数也称作_椭圆曲线的公钥。_<br />Client将`client_random`、`server_random`和`pre_random`三个数通过一个伪随机树函数计算出最终的secret<br />**4、Server生成master secret**<br />Client传递了client_params给Server，Server开始ECDHE算法生成pre_random，接着用和Client同样的伪随机数函数生成最后的secret

#### TLS1.3握手流程

2018年推出了TLS1.3，在TLS1.2做了一系列的改进，主要分为强化安全和提高性能。

##### 强化安全

在TLS1.3废除了很多没有前向安全性的加密算法，只保留五个加密套件：

- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256
- TLS_AES_128_GCM_SHA256
- TLS_AES_128_GCM_8_SHA256

对称加密算法只有 **AES** 和 **CHACHA20**，之前主流的也会这两种。分组模式也只剩下 **GCM** 和 **POLY1305**, 哈希摘要算法只剩下了 **SHA256** 和 **SHA384** 了，RSA和DH都被废弃了。

##### 提升性能

**1、握手改进**<br />大体和TLS1.2差不多，不过比TLS1.2少了一个RTT，服务器不必等待对方验证证书之后才拿到client_params，而是直接在第一次握手的时候就能够拿到，拿到之后立即计算出secret，节省了之前不必要的等待时间，意味着在第一次握手的时候客户端需要传送更多的信息，一口气传完。<br />TLS1.3握手方式被叫做**1-RTT握手**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1672852302590-92890bfa-c10f-4e87-9f92-2e4583c6ae2a.png#averageHue=%23f6f6f6&clientId=ub5be1ac7-5723-4&from=paste&height=452&id=u0b8f51c4&originHeight=678&originWidth=984&originalType=binary&ratio=1&rotation=0&showTitle=false&size=163774&status=done&style=none&taskId=u37939aa9-6fc9-4642-98de-0d12751e641&title=&width=656)<br />**2、PSK(Pre-share key) 0-RTT**<br />PSK 是 TLS 1.3 实现 **0-RTT** 的重要功能，它的全称是 _pre share key_ ，从名称你应该已经知道了，它是用于会话恢复的一个机制，同时 Session ID 和 Session Ticket 机制在 TLS 1.3 中被废弃也是因为其作用被该功能所替代了。<br />在发送**Session Ticket**的同时带上应用数据，不用等到服务端确认。<br />**PSK缺点：**在使用 PSK 发送早期数据时，此时的加密早期数据的密钥派生于 PSK，而 PSK 是不具备前向安全性的！也就是说如果某时的攻击者获得了 PSK ，那么使用该 PSK 导出的密钥加密的早期数据将会被解密。（当然，这不包括在建立连接后的应用数据，因为它们使用的是具有前向安全的 DHE/ECDHE 算法协商出的密钥）<br />解决：使用较短有效期的 PSK

## HTTPS中，怎么判断CA证书没有被篡改？

系统内置了所有权威的CA机构列表，CA证书需要是权威CA机构颁发的才可靠，否则不可靠？

## SSL pinning?

# HTTPS协议面试题

## HTTPS问题怎么答？

## HTTPS如何防范中间人攻击？

**什么事中间人攻击？**<br />当数据传输发生在一个设备(PC/手机)和网络服务器之间时，攻击者使用其技能和工具将自己置于两个端点之间并截获数据，尽管交谈的两方认为他们是在与对方交谈，但是实际上他们是在与这个中间人交流。<br />**如何避免？**

1. 客户端不要相信证书，因为这些证书极有可能是中间人
2. App可以提前预埋证书在本地，其他证书就不会起作用

### HTTPS可以抓包吗？

HTTPS数据是加密的，常规下抓包工具是无法直接查看的。<br />可以通过抓包工具，类似中间人。通常HTTPS抓包工具会生成一个证书，用户需要手动把证书安装到客户端中，然后终端发起的所有请求通过该证书完成与抓包工具的交互，然后抓包工具再转发请求到服务器，最后把服务器返回的结果在控制台输出后再返回给终端

## HTTPS IP直接问题

见`网络优化→HTTPS IP直接问题`章节

## HTTPS单向认证和双向认证？

### 单向认证（仅认证服务器证书）

一般的HTTPS都是提供服务器证书，用于浏览器客户端验证服务器；单向认证SSL证书也称为服务器身份认证证书。<br />**单向认证流程：**<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1678024837296-561bafb9-38b7-45df-8fe1-e702bb17f9fd.webp#averageHue=%23fefefb&clientId=u2e1e5d6a-496c-4&from=paste&id=u03cfa486&originHeight=854&originWidth=862&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u6432587d-a8c7-4ee7-9ae0-7711b52bb78&title=)<br />单向认证使客户端浏览器可以连接到正确的网站服务器。

### 双向认证

双向认证是指在SSL握手过程中将同时验证客户端和服务器身份，双向认证SSL证书至少包括两个或两个以上的证书，一个是服务器证书，另一个或多个是客户端证书（即个人认证证书）。<br />**双向认证流程：**![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1678025495633-655ae6cb-1986-4c69-afe1-ddbdfe6917ec.webp#averageHue=%23fefefb&clientId=u2e1e5d6a-496c-4&from=paste&id=u04b04c2f&originHeight=926&originWidth=869&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7564c6d0-9a05-49bd-ac7b-3d003d4c5a8&title=)

### 为什么需要双向认证SSL证书？

双向认证需要服务器和客户端提供身份认证，只能是服务器允许的客户才能访问，安全性相对于高一些。所以需要做双向认证的一般是金融行业等对安全性要求较高的企业。

## TLS相关

### TLS握手流程？需区分不同版本来答？

1. 先答TLS1.0 RSA握手流程，2-RTT
   1. 利用SessionID优化为1-RTT，SessionID的缺点
   2. Session Ticket优化
2. TLS1.2的TLS False Start优化，无需等待Finish消息
3. TLS1.3废弃RSA，优化握手流程，达到1-RTT、0-RTT(利用PSK)

### TLS握手的过程中有哪些加密算法？分别有什么用？

**非对称加密，用作密钥协商**

- RSA
- DH(E)
- ECDHE

**对称加密算法，**后续HTTP报文都用对称加密来加解密传输的报文

- DES（Data Encryption Standard）：数据加密标准，速度较快，适用于加密大量数据的场合。
- 3DES（Triple DES）：3DES，也称为 3DESede 或 TripleDES，是三重数据加密算法，相当于是对每个数据库应用三次DES的对称加密算法。

> 由于DES密码长度容易被暴力破解，所以3DES算法通过对DES算法进行改进，增加DES的密钥长度来避免类似的攻击，针对每个数据块进行三次DES加密；因此，3DES加密算法并非什么新的加密算法，是DES的一个更安全的变形，它以DES为基本模块，通过组合分组方法设计出分组加密算法。。
> 3DES是DES向AES过渡的加密算法，它使用2个或者3个56位的密钥对数据进行三次加密。相比DES，3DES因密钥长度变长，安全性有所提高，但其处理速度不高。因此又出现了AES加密算法，AES较于3DES速度更快、安全性更高。

- AES（Advanced Encryption Standard）：高级加密标准，是下一代的加密算法标准，速度快，安全级别高；

### TLS1.0握手流程有什么缺点？

1. 慢，需要2-RTT才能建立连接，有SessionId，Session Ticket，PSK等方案实现1-RTT、0-RTT优化
2. RSA没有前向安全性，未来如果服务器私有被泄漏，那么之前的报文都将不安全

### RSA 和 ECDHE 握手过程的区别

- 主流的TLS1.2握手中，使用ECDHE实现pre_random的加密解密，没有用到RSA
- 使用ECDHE，Client发送完收尾消息后可以提前抢跑，直接发送HTTP报文，节省了一个RTT，不必等到收尾消息到达Server，也不需要等Server返回收尾消息给Client，就直接发请求，也叫做`TLS Flase Start`。

### TSL中的Session ID、Session Ticket有什么用？

**Session ID**<br />Session ID 为第一次握手时候发送的 Session ID 字段的值，服务器端会维护对于该 Session ID 对应的通信密钥，当 Client 再次连接的时候，只需要在头部中加上 Session ID，即可通知 Server 重新使用上次协商过的通信密钥进行通信，这样就不需要每一次都重新协商来浪费资源，同时由于不需要完整的握手过程，所以握手时间也减少了_1-RTT。_<br />缺点明显：当连接数较大时效果可能降低，当我们缓存池过小会起不到作用，因为连接数较大时之前Session ID会很快的失效；而缓存池大时，Server需要更多的内存资源去维护SessionID到通信密钥的映射。<br />**Session Ticket**<br />和Session ID相同，Session Ticket 也是一种无需重新协商密钥的方案。<br />当 Client 明确支持 Session Ticket 时，Server 会在握手结束后，向 Client 发送被加密的恢复连接所需要的数据，同时 Server 无需保存任何信息，且由于此时握手已经完成，所以信道是安全的。<br />在下次建立 TLS 连接时，Client 只需要在第一次握手时发送上次收到的"被加密的恢复连接所需的数据"，Server 则可以通过只有自己知道的密钥解密该握手数据，并重新使用上次的通信密钥。

> **一个更简单的理解：Session ID 相当于 HTTP 中的 Session，Session Ticket 相当于 HTTP 中的 Cookies**

使用 Session ID 或 Session Ticket 时的握手流程：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1672853005256-ea423ce4-cb63-43eb-b9b4-5d01578a165c.png#averageHue=%23f8f4f4&clientId=ub5be1ac7-5723-4&from=paste&height=827&id=uff77ee24&originHeight=1240&originWidth=2102&originalType=binary&ratio=1&rotation=0&showTitle=false&size=445355&status=done&style=none&taskId=ub91b1654-d33c-44a3-baea-61adc46fe4f&title=&width=1401.3333333333333)

> 需要注意的是，Client 在第一次握手时仍然携带了较为完整的握手报文，这是为了当 Server 发现 Session ID 或 Session Ticket 过期的时候能够方便的退化为普通的握手流程。

### TLS重连需要重新握手吗，实现机制是什么？

TLS1.0，如果服务器开启了SessionID，客户端下次重连带上SessionID即可，就不需要再重新走一遍TLS握手流程了。<br />还有Session Ticket，PSK

### client随机数和server随机数的作用，可以去掉吗？

客户端随机数，对于RSA，它是属于由客户端生成的随机数；但对于DH/DHE来讲，其是通过密钥协商得到的密钥，不属于随机数，不能够被去掉。客户端随机数为最后的master secret的生成贡献**熵**(相当于盐salt)<br />服务器随机数，最大的作用是用来防止**重放攻击**

### pre master secret作用？可以去掉吗？

TLS协议加入了_pre master secret_来生成_master secret_，最主要还是为了使得协议能更好的模块化，密钥协商流程中，加密套件不止有RSA，还有其他的算法DH/DHE，所以这其实是一个协议设计上的问题

### TLS1.3为啥抛弃了RSA/DH算法？替代方案？

TLS1.3强化了安全，废弃了很多加密套件，其中包括RSA。<br />**RSA被废弃主要有两方面的原因**

1. 2015年发现了**FREAK**攻击，已经有人发现了RSA的漏洞，能够进行破解了
2. 没有前向安全性，一旦私钥泄露，那么中间人可以通过私钥计算出之前所有报文的**secret**，破解之前所有的密文

**RSA为什么没有前向安全性？**<br />回到 RSA 握手的过程中，客户端拿到服务器的证书后，提取出服务器的公钥，然后生成pre_random并用**公钥**加密传给服务器，服务器通过**私钥**解密，从而拿到真实的pre_random。当中间人拿到了服务器私钥，并且截获之前所有报文的时候，那么就能拿到pre_random、server_random和client_random并根据对应的随机数函数生成secret，也就是拿到了 TLS 最终的会话密钥，每一个历史报文都能通过这样的方式进行破解。<br />但ECDHE在每次握手时都会生成临时的密钥对，即使私钥被破解，之前的历史消息并不会收到影响。这种一次破解并不影响历史信息的性质也叫**前向安全性**。<br />RSA 算法不具备前向安全性，而 ECDHE 具备，因此在 TLS1.3 中彻底取代了RSA。

### 数字证书的作用？

验证服务器的真伪，防止中间人攻击

### TCP握手和TLS握手会同时发生吗？

不会，TCP先握手，后TLS握手

### 非对称加密（RSA）在HTTPS中有什么作用（RSA在TLS握手流程承担了什么角色？）？

1. 密钥协商（交换）：公钥加密，私钥解密

> 客户端用服务器证书中的公钥加密pre master secret，服务器用私钥解密，然后作为参数生成master secret

2. 数字证书验证：私钥加密，公钥解密

> 服务器私钥加密数字签名打包成数字证书发送客户端，客户端用服务器的公钥解密校验数字证书

# Ref

- [x] [HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.cn/post/6844904100035821575)
- [x] [TLS 1.0 至 1.3 握手流程详解](https://www.cnblogs.com/enoc/p/tls-handshake.html)
- [ ] [HTTP/1 to HTTP/2 to HTTP/3](https://medium.com/@sandeep4.verma/http-1-to-http-2-to-http-3-647e73df67a8)
