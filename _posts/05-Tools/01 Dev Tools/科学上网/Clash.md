---
date created: 2024-12-23 23:18
date updated: 2024-12-25 21:48
dg-publish: true
---

# Clash

Clash 是一个跨平台、支持 `SS`/`V2ray`/`Trojan` 协议、基于规则的网络代理软件，功能强大、界面美观、支持订阅，尤其适合机场和付费服务使用。Clash 功能全加颜值好看，使得 Clash 深受喜爱。

## Clash 端

1. ClashX mac
2. Clash
3. [Clash for Android](https://github.com/Kr328/ClashForAndroid)
4. Clash Verge（Mac）[下载与安装 - Clash Verge Rev Docs](https://www.clashverge.dev/install.html#__tabbed_1_3)

## Clash 使用教程

- [ ] [Clash 常用客户端使用教程（简易版）](https://mitsea.medium.com/clash-%E5%B8%B8%E7%94%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B-%E7%AE%80%E6%98%93%E7%89%88-c77aeb2a10c)

## ClashX 配置

### 设置过滤规则

Toolbar->Config->General，支持直接设置代理忽略地址，支持正则

- 公司的网络可以翻墙，就忽略掉 Google/Facebook 等域名

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1688525231979-03c9e2f5-3cd7-4f63-88d0-24f84e0160f2.png#averageHue=%23e8e3df&clientId=uda3d7248-c6ab-4&from=paste&height=447&id=uf935ae10&originHeight=1296&originWidth=1000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=194692&status=done&style=none&taskId=u6a389585-e199-4a0f-a577-8d8cb9cfe73&title=&width=345)

```
192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,127.0.0.1,localhost,*.local,timestamp.apple.com,sequoia.apple.com,seed-sequoia.siri.apple.com,*.google.com.hk,*.*google*.com,*.google.*,*.google.*.*,*.google*.*,*.facebook.*,*.github.com,*.*github*.*,*.android.*,*.android.*.*,*.googleapis.*,*.visualstudio.*,*.*microsoft*.*
```

### ClashX 自定义规则 Rules

#### Rules 规则编写

#### 规则解释

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1688616172051-142bb92f-8f1d-4b6c-9b3b-9483b08bb2c0.png#averageHue=%23f5f5f5&clientId=u839a5476-278f-4&from=paste&height=232&id=ucb549610&originHeight=614&originWidth=744&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77364&status=done&style=none&taskId=u08dd4db9-6b19-4078-8528-a38a85560ce&title=&width=281)

##### [CIDR格式](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1)

参考以下举例几种常用写法：

- 0.0.0.0/0 代表所有 IP 地址。
- 10.0.0.0/8 代表所有 10. 开头的内网地址。
- 10.132.0.104/32 代表仅 10.132.0.104 这个 IP 地址。

#### 手动修改 yaml 文件

**路径：**`Config→Open config folder→找到你要修改的yaml文件(ikuuu.eu(pro).yaml)`<br />**述求：**

1. 公司被封禁的网站，如有道云/语雀/gitee 等网站走海外节点代理
2. 由于公司网络可以翻墙，google/facebook 等网络直连就行

**解决：**

- 手动添加规则
- 最后 Config→Reload Config 生效

**存在的问题：**

- 更新后会覆盖掉当前 yaml 文件

```yaml
// ...
rules:
 - DOMAIN-SUFFIX,alicdn.com,🔰 选择节点
 - DOMAIN-SUFFIX,netease.com,🔰 选择节点
 - DOMAIN-SUFFIX,alipay.com,🔰 选择节点
 - IP-CIDR,139.224.214.226/32,🔰 选择节点,no-resolve
 - DOMAIN-KEYWORD,yuque,youdao,ali,lark,baiduyun,zijie,gitee,🔰 选择节点
 - DOMAIN-KEYWORD,google,facebook,twitter,🇨🇳 国内网站
```

#### 开源库 clash-rules

<https://github.com/Loyalsoldier/clash-rules>

### `Clashx` 问题

#### `clash/ss/ssr` 被公司禁用，替代方案

用 V 2 rayU (mac) 替代，V 2 rayU 最新版 (mac)支持 clash 订阅协议

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241212103433.png)

#### 所有的节点都测速失败，无法上网

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1702710450506-859bb09c-99d4-42f9-95b8-cdbe2ca2239b.png#averageHue=%238a8481&clientId=u906c0446-0501-4&from=paste&height=425&id=ue7f5945e&originHeight=1516&originWidth=1130&originalType=binary&ratio=2&rotation=0&showTitle=false&size=496585&status=done&style=none&taskId=uf7c3ed4c-eddf-40ca-a09f-cd916b214bf&title=&width=317)

1. 内置 dns 开启的情况下观察是否有 fallback 的配置

Nameserver 后面加上 fallback

```java
dns:
  enable: true # 启用自定义DNS
  ipv6: false # default is false
  listen: 0.0.0.0:1053
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16 # if you don't know what it is, don't change it
  default-nameserver:
    - 180.76.76.76
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query

  fallback:
    - tls://1.1.1.1:853
    - tls://1.0.0.1:853
    - 101.6.6.6:5353
```

2. Dns enable 设置为 false

#### Ref

- [ ] [Mac系统的ClashX测速一直失败是为什么？？？](https://www.zhihu.com/question/464846886/answer/2991342203?utm_id=0) <https://hellodk.cn/post/870>
- [ ] [https://sobaigu.com/clash-timeout-failed-by-dns.html?ivk_sa=1024320u](解决Clash节点全部超时/失败/timeout不能联网)
- [ ] [假设一个机场爆炸了，所有节点都不能使用，报错并且无法切换配置文件](https://github.com/zzzgydi/clash-verge/issues/485)

## Clash Verge

- [快速入门 - Clash Verge Rev Docs](https://www.clashverge.dev/guide/quickstart.html)

### Clash Verge 的系统代理和 TUN 模式的区别

#### **Clash Verge 的系统代理模式**

系统代理基于 HTTP/HTTPS 和 SOCKS5 协议来转发流量，通过设置代理服务器的方式（通常是 127.0.0.1 的回环地址）将系统或程序的流量重定向到 Clash。

##### **工作原理**

- Clash 核心在本地监听 HTTP/HTTPS 代理端口和 SOCKS5 端口（默认为 7890 和 7891）。
- 在系统中开启全局代理或通过 PAC 文件配置流量，使系统的应用程序流量转发到这些监听端口。
- Clash 根据规则（如域名后缀、IP 地址、GEOIP 规则）转发流量到不同的代理节点或选择直连。

##### **优点**

- **简单高效**：HTTP 和 SOCKS5 基于现有协议，兼容性强，配置简单。
- **分流规则灵活**：通过 Clash 配置文件的 `rules` 段明确指定规则，适合需要特定站点或流量走代理的场景。
- **跨应用支持**：任何`遵循系统代理设置的程序`都可以自动使用 Clash 转发流量（浏览器、开发工具等）。

##### **缺点**

- **不支持所有协议**：系统代理模式主要支持 HTTP/HTTPS 和 TCP 流量，无法处理 UDP 流量（如在线游戏、VoIP）。
- **部分流量绕过代理**：某些流量不会遵循系统代理（例如某些直接与网络交互的本地程序或系统内核流量）。

#### **Clash Verge 的 TUN 模式**

TUN 模式（基于 TUN/TAP 虚拟网卡）是一种低级网络代理模式，它可以劫持和转发所有流量（包括 TCP 和 UDP），不依赖于应用程序是否遵循系统代理。

##### **工作原理**

- Clash 核心在操作系统中开启虚拟网卡（TUN 网卡），并将该网卡设置为系统默认网关。
- 所有网络请求（包括 TCP 和 UDP）首先通过 TUN 网卡，再由 Clash 核心转发到代理节点或根据规则做直连。
- TUN 模式支持 TCP 和 UDP 数据包的代理转发，因此更全面。

##### **优点**

- **捕获全流量**：不依赖系统代理设置，能代理全部网络请求，包括 UDP。
- **适用范围更广**：即使程序本身直接操作 socket，也会劫持其流量（适合游戏、VoIP 等 UDP 密集型应用）。
- **规则更灵活**：可以使用 Clash 的规则文件分流所有层级的应用程序，甚至是系统级流量。

##### **缺点**

- **需要更多权限**：TUN 模式需要管理员权限，因为虚拟网卡需要修改系统网络配置。
- **复杂性更高**：配置难度比系统代理模式稍高，可能需要额外安装支持 TUN 的依赖组件（如 `clash-core-service`）。

#### **对比总结：系统代理 vs TUN 模式**

| **特性**       | **系统代理模式**            | **TUN 模式**                    |
| ------------ | --------------------- | ----------------------------- |
| **支持的协议**    | HTTP/HTTPS、TCP        | HTTP/HTTPS、TCP、UDP            |
| **对 UDP 支持** | 不支持                   | 支持                            |
| **覆盖范围**     | 遵循系统代理的程序             | 全网络流量（包括直连 socket 的程序）        |
| **权限需求**     | 无管理员权限                | 需要管理员权限                       |
| **适用场景**     | 浏览器、开发工具、HTTP API 请求等 | 游戏、视频流服务、VoIP 应用，所有需要 UDP 的场景 |
| **配置复杂性**    | 简单（基于系统代理设置）          | 较复杂（需要系统支持虚拟网卡 TUN/TAP）       |
| **性能开销**     | 较低                    | 较高                            |
| **规则适配**     | Clash 的规则适用于遵循系统代理的流量 | Clash 的规则适用于所有网络流量            |

