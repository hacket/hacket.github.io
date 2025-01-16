---
date created: 2024-12-23 23:19
date updated: 2024-12-26 14:15
dg-publish: true
---

# `Proxifier`

- [Proxifier - The Most Advanced Proxy Client](https://www.proxifier.com)

## 什么是 `Proxifier`？

Proxifier 是一个桌面程序，它允许网络应用程序通过代理服务器路由请求——即使这些应用程序没有内置代理设置。换句话说，您可以使用任何应用程序，在 Proxifier 上进行设置，并通过代理连接路由其流量以更改或隐藏您的真实 IP 地址。

Proxifier 可以影响所有网络连接、特定应用程序，或者您可以使用灵活的代理规则进行自定义设置。它还提供详细的实时统计信息，用于监控网络流量和记录网络错误。

## License key

- Mac

```kotlin
3CWNN-WYTP4-SD83W-ASDFR-84KEA
```

- Windows 激活码生成工具：<https://github.com/Danz17/Proxifier-Keygen>

## **`Proxifier` 的作用**

### 将流量强制重定向到代理

Proxifier 的核心作用是让原本不支持代理的应用程序强制通过代理服务器转发流量，例如：

- 内置代理功能较弱的程序（如一些本地化软件）。
- 系统默认不会走代理的流量（如某些 CLI 程序）。

### 允许细粒度的规则控制

- 你可以为特定的应用程序、目标 IP 地址、目标端口自定义规则。
- 流量可以根据规则分配到不同的代理，或者直接跳过代理（直连）。

### 支持多种代理协议

- 支持多种代理协议（如 `HTTP`、`HTTPS`、`SOCKS5`）。
- 可搭配多个代理服务器形成「代理链」，实现多跳网络传递。

### 高兼容性

Proxifier 的工作模式基于 **连接劫持**，劫持程序产生的 TCP 连接流量借助代理转发，因此绝大部分非代理智能感知的程序都通过它实现代理功能。

### 场景举例

- **应用级代理**：为不支持代理功能的软件（如某些老旧游戏客户端、定制化办公系统）代理流量。
- **分应用流量管理**：为不同的程序或流量设置不同的代理策略，通过细化规则实现。
- **代理支持不足时的补充工具**：类似 VPN 的工具传递流量，但它更轻量化，适合程序级别的场景。

## 选择 `Proxifier` 或 `Clash Verge` 系统代理Tun 的适用场景

| 工具              | 适用场景                                                           |
| --------------- | -------------------------------------------------------------- |
| **Proxifier**   | - 老旧或自定义应用程序需要代理（不支持系统代理）。<br>- 分程序/分端口流量管理。<br>- 多代理链式转发需求。   |
| **Clash Verge** | - 需要规则精确分流（如域名后缀/IP 区段规则）。<br>- 全设备流量代理需求，尤其是绕过应用级限制时（TUN 模式）。 |

### **如何选择 Clash Verge 系统代理模式和 TUN 模式**

1. **优先选择系统代理模式**：
   - 简单易用，适合浏览器、普通程序。
   - 如果你只需要 HTTP/HTTPS 和绝大部分 TCP 流量的代理，系统代理足够。
2. **选择 TUN 模式的情况**：
   - 如果应用程序使用 UDP（如游戏、实时聊天或流媒体服务），TUN 模式是必需的。
   - 如果某些程序绕过了系统代理，可以使用 TUN 模式对所有流量进行代理劫持。

### **两者组合使用建议**

- 在程序级代理需求（如分程序设置代理）上，可通过 **Proxifier** 或 Clash Verge 的 **系统代理模式** 精确管理流量。
- 在全流量代理需求上，通过 **Clash Verge 的 TUN 模式** 劫持所有网络流量更适用。

## `Proxifier` 代理配置

Proxifier 代理配置，分为三步：代理服务器配置、代理规则设置、域名解析设置

### 代理服务器配置

#### 添加代理服务器 ip、port、授权用户名、密码

打开 `Proxifier`，依次在 `菜单栏 —> “Profile” —> “Proxy Server...”`

点击 "`Add...`" 按钮后，输入代理服务器 ip、port、授权用户名、密码、代理服务器 ip，也可以用域名代替，这样就不必每次修改代理 ip 地址了 ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691207065836-7c475c10-0009-4b36-8d3f-e8d0ea98b8e3.png#averageHue=%23ece9e6&clientId=u08ecd8a5-b4f1-4&from=paste&height=219&id=ud068b527&originHeight=1158&originWidth=2044&originalType=binary&ratio=2&rotation=0&showTitle=false&size=595371&status=done&style=none&taskId=u2bd7337c-7882-47c0-ba9c-4f0980cd874&title=&width=386) 若代理 IP 没有密码，则不用授权用户名、密码。若代理 ip 有密码，则设置授权的用户名、密码 ![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215268098-6e6db03f-cecc-4ea5-96fa-5494820e159e.png#averageHue=%23eee8e7&clientId=u38f7a5c7-69a7-4&from=paste&height=215&id=uf140a83f&originHeight=429&originWidth=372&originalType=binary&ratio=2&rotation=0&showTitle=false&size=27749&status=done&style=none&taskId=u9dbd5e76-d50a-4f25-96fe-65066008912&title=&width=186)

#### 设置代理链 Proxy chain

设置了多个代理服务器 ip 后，若要轮询、提供代理稳定性，可以设置代理链：

`菜单栏 —> “Profile” —> “Proxy Server...”—> "Create"`
命名代理链名称 "proxy-chain"，然后把上方的代理 ip 都拖到下方的代理链里，如下图：
![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215269781-a142c6c8-33ff-4680-8514-b1bfb8c4e89e.png#averageHue=%23f3efee&clientId=u38f7a5c7-69a7-4&from=paste&height=241&id=u235c8aa6&originHeight=481&originWidth=437&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46025&status=done&style=none&taskId=udbdf1941-7b17-4d73-8b30-244cec8b9f1&title=&width=218.5)
然后，点击上图右侧 "Type..."，设置代理链的轮询方式 (Windows 有，Mac 没有)

推荐选择第二项，代理失效后自动轮询到下一个可用的代理，选项里有检测代理失败的策略，可自行设置 ![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215399552-78ab9ab6-c0da-4353-84f7-a03ff0ba244a.png#averageHue=%23eee8e7&clientId=u38f7a5c7-69a7-4&from=paste&height=169&id=ud99c1d49&originHeight=337&originWidth=411&originalType=binary&ratio=2&rotation=0&showTitle=false&size=27810&status=done&style=none&taskId=ue28a33c8-1e22-408d-9085-1f593f7dec4&title=&width=205.5)

#### 检测代理可用 (Windows 有，Mac 没有)

`菜单栏 —> “Profile” —> “Proxy Server...”—> 任选一个代理 —> 右侧 "Check..."`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215481125-c9acb141-a262-4072-8a5e-96e0affeabec.png#averageHue=%23f3f1ee&clientId=u38f7a5c7-69a7-4&from=paste&height=192&id=ua4c3cf0d&originHeight=384&originWidth=603&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54278&status=done&style=none&taskId=ubbac589b-f48a-4ac4-af18-373568a4cf6&title=&width=301.5)

### 代理规则设置

代理服务器设置后，还需要设置代理规则，才可使用代理。<br />代理规则里，"Add..." 添加规则，输入规则名称、Action、勾选自定义的规则 "foshan"
![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215697965-78cc89d7-019d-47d0-9cbc-38c2e3b1d1ee.png#averageHue=%23f5f2f1&clientId=u38f7a5c7-69a7-4&from=paste&height=203&id=u881e5c5e&originHeight=406&originWidth=634&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31918&status=done&style=none&taskId=ucf79039e-086c-4144-b42e-919f78781ea&title=&width=317)

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1691215704456-cb5de022-2237-4b6b-8101-0c1f10e54228.png#averageHue=%23f1efee&clientId=u38f7a5c7-69a7-4&from=paste&height=249&id=u246cfdbf&originHeight=498&originWidth=470&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29910&status=done&style=none&taskId=ufcbd9d61-6018-45a9-9b93-8565990bd35&title=&width=235)

**案例：** 有的公司不能用的网盘，云笔记配置成走代理![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691207181773-3a664fb8-9ffc-46fc-ab18-51bcb24e0916.png#averageHue=%23eeeae7&clientId=u08ecd8a5-b4f1-4&from=paste&height=160&id=uf22d54d1&originHeight=1110&originWidth=2738&originalType=binary&ratio=2&rotation=0&showTitle=false&size=729767&status=done&style=none&taskId=u7e7f5d25-98d1-4218-a8c5-ff4e56ef996&title=&width=394)

### 域名解析代理

为了防止本地或国内的 DNS 污染，推荐使用代理服务器端 (可以部署在国外)来做 DNS 解析
取消第一个复选框，选择第二个复选框，通过代理服务器远程解析 DNS
![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1691216382545-556a27fa-3597-42f0-9453-6066cd20129b.png#averageHue=%23eeedec&clientId=u38f7a5c7-69a7-4&from=paste&height=256&id=u7d1afe35&originHeight=511&originWidth=556&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46230&status=done&style=none&taskId=u72bac708-4382-4131-a939-af055a3017e&title=&width=278)

### 运行界面 (MacOS)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691207227932-cb190113-28bd-4429-8615-d60b6cd902f7.png#averageHue=%23f1ece6&clientId=u08ecd8a5-b4f1-4&from=paste&height=270&id=ub05f3d76&originHeight=1736&originWidth=3024&originalType=binary&ratio=2&rotation=0&showTitle=false&size=944452&status=done&style=none&taskId=u9cc2138a-457c-4084-ad71-679990863a7&title=&width=471)

### `Proxifier` profile 导出

[work-shein.ppx.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1691484668661-6b7fedff-56ee-4ee6-b33e-d1b9f7957fb0.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1691484668661-6b7fedff-56ee-4ee6-b33e-d1b9f7957fb0.zip%22%2C%22name%22%3A%22work-shein.ppx.zip%22%2C%22size%22%3A1576%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uebf2f2ff-290b-4be7-b27a-995aaa5f37c%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u7e27727a%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

### Ref

- [x] [Proxifier 代理软件介绍和使用教程](https://www.laoxu.cc/post/114.html)

# 境外公司科学上网指南

## `Proxifier` 一切皆可代理

使用 `Proxifier` 目的是让一些不支持代理的软件或者不遵守系统代理的也能走代理

### Proxies 规则

新增 Proxies 规则
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225213411.png)

### Rules 规则

- `[Work]No Proxy App` direct  按 APP，不需要代理的 APP，都添加到这

```shell
"dvc-manageproxy-exe.app"; "dvc-manageproxy-exe"; com.leagsoft.epp.manageproxy; "LVSecurityAgent.app"; "LVSecurityAgent"; LVSecurityAgent; "企业微信.app"; "企业微信"; com.tencent.WeWorkMac; "Android Studio.app"; "Android Studio"; com.google.android.studio; "Android Studio Preview.app"; "Android Studio Preview"; com.google.android.studio-EAP
```

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225213558.png)

- `[Work]No Proxy Domain` direct 不需要代理的域名

```shell
10.122.*.*;10.102.*.*;nexus.dev.sheincorp.cn;*.dotfashion.cn;*.sheincorp.cn;*.*.sheincorp.cn;*.shein.com;*.*.shein.com;dotfashion.cn;innospace.biz.sheincorp.cn;*.*.sheincorp.cn;*.Shein-inc.com;drive.weixin.qq.com;doc.weixin.qq.com;*.weixin.qq.com;cube.weixinbridge.com;*.weixinbridge.com;*.qq.com;;wakatime.com;*.wakatime.com;*.xunlei.com;*.*.xunlei.com
```

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225213951.png)

- `[Work]需要代理的 APP` 需要代理的 APP

```shell
"WeChat.app"; "WeChat"; com.tencent.xinWeChat; "夸克网盘.app"; "夸克网盘"; com.alibaba.quark.clouddrive; "有道云笔记.app"; "有道云笔记"; ynote-desktop; ; "语雀.app"; "语雀"; com.yuque.app; "Telegram.app"; "Telegram"; com.tdesktop.Telegram; "TickTick.app"; "TickTick"; com.TickTick.task.mac; "网易有道翻译.app"; "网易有道翻译"; com.youdao.YoudaoDict; "TeamViewer.app"; "TeamViewer"; com.teamviewer.TeamViewer; "Telegram.app"; "Telegram"; com.tdesktop.Telegram; "AirDroid.app"; "AirDroid"; com.sandstudio.airdroid; "SunloginClient.app"; "SunloginClient"; com.oray.sunlogin.macclient; "SunloginClient.app"; "SunloginClient"; com.oray.sunlogin.macclient; "ToDesk.app"; "ToDesk"; com.youqu.todesk.mac; "RustDesk.app"; "RustDesk"; com.carriez.rustdesk; "Nutstore.app"; "Nutstore"; net.nutstore.NutstoreJavaBE; "Obsidian.app"; "Obsidian"; md.obsidian; "Docker.app"; "Docker"; com.docker.docker; "Docker.app";"Postman.app"; "Postman"; com.postmanlabs.mac; "PicGo.app"; "PicGo"; Electron
```

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225214033.png)

- `Proxy Domain` 需要代理的域名

```shell
*.github.com;*.*.github.com;*.githubusercontent.com;*.*.githubusercontent.com;raw.githubusercontent.com;mail.google.com
```

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225214122.png)

## `Clash Verge`

- 开启全局模式
- 不要开启系统代理: 开启代理后，公司部分域名可能走代理，导致打不开
- 不要开启 Tun 模式：会开启虚拟网卡，由 `Proxifier` 来接管控制谁 proxy 谁 direct

![|150](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241225214235.png)

## 关闭 APP 自己设置的 proxy

关闭 APP 自己设置的 proxy，如语雀

> 如果公司禁用语雀，语雀设置的是一个被封装的代理软件的 `ip:port`，此时要更换新的代理软件 `ip:port`，就会打开语雀访问不了，离线状态也设置不了，Proxifier 也不生效，只能卸载 APP 重装了
