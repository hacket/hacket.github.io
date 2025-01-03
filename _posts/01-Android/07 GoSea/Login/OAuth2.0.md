---
date created: 2024-09-14 00:15
date updated: 2024-12-24 00:36
dg-publish: true
---

# OAuth基础

## 什么是OAuth？

在OAuth2.0中“O”是Open的简称，表示“开放”的意思。Auth表示“授权”的意思，所以连起来OAuth表示“开放授权”的意思，它是一个关于授权（authorization）的开放网络标准，在全世界得到广泛应用。用一句话总结来说，OAuth2.0是一种授权协议。<br />OAuth允许用户授权第三方应用访问他存储在另外服务商里的各种信息数据，而这种授权不需要提供用户名和密码提供给第三方应用。

> 总的来说：OAuth2.0这种授权协议，就是保证第三方应用只有在获得授权之后，才可以进一步访问授权者的数据。

## OAuth2.0作用

### 解决的问题

用户登录应用时传统的方式是用户直接进入客户端应用的登录页面输入账号和密码，但有的用户感觉注册后再登录比较繁琐麻烦，于是用户选择使用相关社交账号（微信、QQ、微博）登录，这种方式通过用户的账号和密码去相关社交账号里获取数据存在严重的问题缺陷。

- 如果第三方应用获取微信中的用户信息，那么你就把你的微信的账号和密码给第三应用。稍微有些安全意识，都不会这样做，这样很不安全；因此使用OAuth2.0可以避免向第三方暴露账号密码；
- 第三方应用拥有了用户微信的所有权限，用户没法限制第三方应用获得授权的范围和有效期；因此OAuth2.0可以限制授权第三方应用获取微信部分功能，比如只可以获取用户信息，但不可以获取好友列表，有需求时再申请授权访问好友列表的权限；
- 用户只有修改密码，才能收回赋予第三方应用权限，但是这样做会使得其他所有获得用户授权的第三方应用程序全部失效。
- 只要有一个第三方应用程序被破解，就会导致用户密码泄漏，以及所有使用微信登录的应用的数据泄漏。

OAuth的作用就是让"第三方应用"安全可控地获取"用户"的授权，与"服务商提供商"进行交互。本质是使用token令牌代替用户名密码。

### 应用的场景

现在各大开放平台，如微信开放平台、腾讯开放平台、百度开放平台等大部分的开放平台都是使用的OAuth 2.0协议作为支撑

- 客户端App使用三方登录；
- 微信小程序登录授权
- 多个服务的统一登录认证中心、内部系统之间受保护资源请求

## 名词定义

先看一个示例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703223691406-a3f1430b-a8e8-47a0-a6a9-16c9cb5e8a13.png#averageHue=%23e5eef7&clientId=u0580cd21-d154-4&from=paste&height=312&id=u7e28db3f&originHeight=1502&originWidth=1222&originalType=binary&ratio=2&rotation=0&showTitle=false&size=474507&status=done&style=none&taskId=ud1941233-f1a7-4529-b51e-420d4f0b60b&title=&width=254)<br />假如你正在“网站A”上冲浪，看到一篇帖子表示非常喜欢，当你情不自禁的想要点赞时，它会提示你进行登录操作。<br />打开登录页面你会发现，除了最简单的账户密码登录外，还为我们提供了微博、微信、QQ等快捷登录方式。假设选择了快捷登录，它会提示我们扫码或者输入账号密码进行登录。<br />登录成功之后便会将QQ/微信的昵称和头像等信息回填到“网站A”中，此时你就可以进行点赞操作了。

### Client

**Client**：客户端（第三方应用），它本身不会存储用户快捷登录的账号和密码，只是通过资源拥有者的授权去请求资源服务器的资源，即例子中的网站A

### Resource Owner

**Resource Owner**：资源拥有者，通常是用户，即例子中拥有QQ/微信账号的用户

### **Authorization Server**

**Authorization Server**：认证服务器，可以提供身份认证和用户授权的服务器，即给客户端颁发token和校验token

### **Resource Server**

**Resource Server**：资源服务器，存储用户资源的服务器，即例子中的QQ/微信存储的用户信息；可能和Authorization Server服务器一台也可能不是

## Oauth 2.0的思路和运行流程

### 思路

OAuth2.0 在【第三方应用】与【服务提供商】之间，设置了一个授权层（authorization layer）。【第三方应用】不能直接登录【服务提供商】，只能登录授权层，以此将【用户】与【第三方应用】区分开来。【第三方应用】登录授权层所用的令牌（token），与【用户】的密码不同。【用户】可以在登录的时候，指定授权层令牌的权限范围和有效期<br />【第三方应用】登录授权层以后，【服务提供商】根据令牌的权限范围和有效期，向【第三方应用】开放用户储存的资料。

### 运行流程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703249781614-6efc417f-de3c-48db-ba24-66ab26a372c3.png#averageHue=%23ebece8&clientId=ue4c64a75-479d-4&from=paste&height=335&id=u384192c8&originHeight=425&originWidth=764&originalType=binary&ratio=2&rotation=0&showTitle=false&size=76157&status=done&style=none&taskId=u937bb8d8-b5bc-4c24-9241-3861bb653ae&title=&width=602)

> （A）用户打开【第三方应用】以后，【第三方应用】要访问【服务提供商】，要求用户给予授权。
> （B）用户同意给予【第三方应用】授权访问，并返回一个授权凭证Code。
> （C）【第三方应用】使用上一步获得的授权Code和身份认证信息（AppId、AppSecret），向认证服务器申请令牌(AccessToken)。
> （D）认证服务器对【第三方应用】进行认证以后，确认无误，同意发放令牌Access_Token。
> （E）【第三方应用】使用Access_Token，向资源服务器申请获取资源。
> （F）资源服务器确认Access_Token无误，同意向【第三方应用】开放资源。
> PS. 上面六个步骤之中，B是关键，即用户怎样才能给于客户端授权。有了这个授权以后，客户端就可以获取令牌，进而凭令牌获取资源。

## Oauth2.0的四种授权模式

- 客户端凭据许可（client credentials）
- 资源拥有者凭据许可（resource owner passwordcredentials）
- 隐式许可（implicit）
- 授权码模式（authorization code）

其中授权码模式是步骤流程最为详细严谨的一种模式，而网络上大部分的第三方Oauth2实现都是基于授权码模式的。

### 客户端凭据许可 Client Credentials

指客户端以自己的名义，而不是以用户的名义，向"服务提供商"进行认证。严格地说，客户端模式并不属于OAuth框架所要解决的问题。在这种模式中，用户直接向客户端注册，客户端以自己的名义要求"服务提供商"提供服务，其实不存在授权问题。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703251471120-fbf12a1b-ec9b-48af-8393-aea135ef1d15.png#averageHue=%23f7f4f1&clientId=ue4c64a75-479d-4&from=paste&height=378&id=udb7b6d8a&originHeight=766&originWidth=1246&originalType=binary&ratio=2&rotation=0&showTitle=false&size=286419&status=done&style=none&taskId=u75fc90db-4342-44c1-adc2-c94fc2f9c86&title=&width=615)<br />主要是第2步和第3步：

- 客户端向授权认证服务器进行身份认证，并申请访问临牌（token）;
- 授权认证服务器验证通过后，向客户端提供访问令牌。

### 资源拥有者凭据许可 Resource Owner Password Credentials

如果你高度信任某个应用，允许用户把用户名和密码，直接告诉该应用。该应用就使用你的密码，申请令牌，这种方式称为"密码式"。<br />使用用户名/密码作为授权方式从授权服务器上获取令牌，一般不支持刷新令牌。这种方式风险很大，用户向客户端提供自己的用户名和密码。客户端使用这些信息，向"服务商提供商"索要授权。在这种模式中，用户必须把自己的密码给客户端，但是客户端不得储存密码。这通常用在用户对客户端高度信任的情况下，而认证服务器只有在其他授权模式无法执行的情况下，才能考虑使用这种模式。<br />**流程步骤：**

- A[步骤1，2]：用户向第三方客户端提供，其在服务提供商那里注册的账户名和密码；
- B[步骤3]：客户端将用户名和密码发给认证服务器，向后者请求令牌access_token；
- C[步骤4]：授权认证服务器确认身份无误后，向客户端提供访问令牌access_token；

### 隐式许可 Implicit

不需要获取授权码，第三方应用授权后授权认证服务器直接发送临牌给第三方应用，适用于静态网页应用，返回的access_token可见，access_token容易泄露且不可刷新。<br />简化模式不通过第三方应用程序的服务器，直接在客户端中向认证服务器申请令牌，跳过了"授权码"这个步骤，因此得名。所有步骤在客户端中完成，令牌对访问者是可见的，且客户端不需要认证。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703251915498-1fc861c4-cbed-4c78-889b-6adb35d64644.png#averageHue=%23efe6da&clientId=ue4c64a75-479d-4&from=paste&height=436&id=u747ab119&originHeight=872&originWidth=1248&originalType=binary&ratio=2&rotation=0&showTitle=false&size=595302&status=done&style=none&taskId=u1adea3df-f334-4384-87c9-bfffe92b731&title=&width=624)<br />流程步骤

- A [步骤1，2]：用户访问客户端，需要使用服务提供商（微信）的数据，触发客户端相关事件后，客户端拉起或重定向到服务提供商的页面或APP。
- B [步骤3]：用户选择是否给予第三方客户端授权访问服务提供商（微信）数据的权限；
- C [步骤4]：用户同意授权，授权认证服务器将访问令牌access_token返回给客户端，并且会拉起应用或重定（redirect_uri）向到第三方网站；
- D[步骤5]：第三方客户端向资源服务器发出请求资源的请求；
- E[步骤6，7]：服务提供商的资源服务器返回数据给客户端服务器，然后再回传给客户端使用；

### 授权码模式 Authorization Code

第三方应用先申请获取一个授权码，然后再使用该授权码获取令牌，最后使用令牌获取资源；授权码模式是工能最完整、流程最严密的授权模式。它的特点是通过客户端的后台服务器，与服务提供商的认证服务器进行交互。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703252039937-c27b35d7-99fa-499a-a0d3-14887a73954d.png#averageHue=%23f5f1f0&clientId=ue4c64a75-479d-4&from=paste&height=625&id=ua10166e7&originHeight=1376&originWidth=1474&originalType=binary&ratio=2&rotation=0&showTitle=false&size=604410&status=done&style=none&taskId=u44bb6360-6ed0-4ee2-a2f3-06410080ccd&title=&width=669)<br />流程步骤

- A [步骤1，2]：用户访问客户端，需要使用服务提供商（微信）的数据，触发客户端相关事件后，客户端拉起或重定向到服务提供商的页面或APP。
- B [步骤3]：用户选择是否给予第三方客户端授权访问服务提供商（微信）数据的权限；
- C [步骤4]：用户同意授权，授权认证服务器将授权凭证code码返回给客户端，并且会拉起应用或重定（redirect_uri）向到第三方网站；
- D [步骤5，6]:客户端收到授权码后，将授权码code和ClientId或重定向URI发送给自己的服务器，客户端服务器再想认证服务器请求访问令牌access_token;
- E [步骤7，8]：认证服务器核对了授权码和ClientId或重定向URI，确认无误后，向客户端服务器发送访问令牌（access_token）和更新令牌（refresh_token），然后客户端服务器再发送给客户端；
- F [步骤9，10]：客户端持有access_token和需要请求的参数向客户端服务器发起资源请求，然后客户端服务器再向服务提供商的资源服务器请求资源（web API）；
- G [步骤11，12，13]：服务提供商的资源服务器返回数据给客户端服务器，然后再回传给客户端使用；

授权码许可（Authorization Code）类型。它是 OAuth 2.0 中最经典、最完备、最安全、应用最广泛的许可类型。至于为什么称它为授权码许可，为什么有两次重定向，以及这种许可类型更详细的通信流程又是怎样的？

## OpenId Connect(OIDC)

### 简介

OpenID Connect 1.0是建立在OAuth 2.0上的一个身份验证机制，它允许客户端通过授权服务对用户进行认证并获取简单的用户信息。

### OpenID Connect特性

OpenID Connect在2014年发行。虽然它不是第一个idp（identity provider）标准，但从可用性、简单性方面来说，它可能是最好的。OpenID Connect从SAML和OpenID 1.0/2.0中做了大量借鉴。<br />OAuth2.0使用access token来授权三方应用访问受保护的信息。OpenID Connect遵循oAuth2.0协议流程，并在这个基础上提供了id token来解决三方应用的用户身份认证问题。OpenID Connect将用户身份认证信息以id token的方式给到三方应用。id token基于JWT(json web token）进行封装，具有自包含性、紧凑性和防篡改性等特点。三方应用在验证完id token的正确性后，可以进一步通过oAuth2授权流程获得的access token读取更多的用户信息。<br />OpenID Connect大获成功的秘诀：

- 容易处理的id token。OpenID Connect使用JWT来给应用传递用户的身份信息。JWT以其高安全性（防止token被伪造和篡改）、跨语言、支持过期、自包含等特性而著称，非常适合作为token来使用。
- 基于oAuth2.0协议。id token是经过oAuth2.0流程来获取的，这个流程即支持web应用，也支持原生app。
- 简单。OpenID Connect足够简单。但同时也提供了大量的功能和安全选项以满足企业级业务需求。

OpenID Connect所涉及的角色如下：

- 用户。
- RP：Relying Party，申请授信信息的可信客户端（既上文中提到的三方应用）。
- OP：OpenID Provider，提供身份认证的服务方，比如google和facebook等公司的系统。
- id token：包含身份认证信息的JWT。
- user info api，返回用户信息的接口，当RP使用id token来访问时，返回授权用户的信息。

## OAUTH的问题

## 授权码code的作用？为什么需要授权码code？不能直接使用访问令牌access_token？

授权码，既「照顾」到了用户的体验，不至于授权后干等，又「照顾」了通信的安全。

- [x] [为什么需要授权码？](https://zq99299.github.io/note-book/oath2/01/02.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81%E6%8E%88%E6%9D%83%E7%A0%81)

## Ref

- [ ] [OAuth 2.0 实战](https://zq99299.github.io/note-book/oath2/)
