---
date_created: Monday, December 23rd 2024, 11:19:51 pm
date_updated: Thursday, January 30th 2025, 2:55:25 pm
title: Proxifier
author: hacket
categories:
  - Tools
category: 科学上网
tags: [科学上网]
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
date created: 2024-12-23 23:19
date updated: 2024-12-26 14:15
aliases: ["`Proxifier`"]
linter-yaml-title-alias: "`Proxifier`"
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

## 选择 `Proxifier` 或 `Clash Verge` 系统代理 Tun 的适用场景

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

打开 `Proxifier`，依次在 `菜单栏 —> “Profile” —> “Proxy Server…”`

点击 "`Add…`" 按钮后，输入代理服务器 ip、port、授权用户名、密码、代理服务器 ip，也可以用域名代替，这样就不必每次修改代理 ip 地址了 ![thvv3](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/thvv3.png) 若代理 IP 没有密码，则不用授权用户名、密码。若代理 ip 有密码，则设置授权的用户名、密码 ![o2ht9](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/o2ht9.png)

#### 设置代理链 Proxy chain

设置了多个代理服务器 ip 后，若要轮询、提供代理稳定性，可以设置代理链：

`菜单栏 —> “Profile” —> “Proxy Server…”—> "Create"`

命名代理链名称 "proxy-chain"，然后把上方的代理 ip 都拖到下方的代理链里，如下图：

![puivt](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/puivt.png)

然后，点击上图右侧 "Type…"，设置代理链的轮询方式 (Windows 有，Mac 没有)

推荐选择第二项，代理失效后自动轮询到下一个可用的代理，选项里有检测代理失败的策略，可自行设置 ![uk9jk](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/uk9jk.png)

#### 检测代理可用 (Windows 有，Mac 没有)

`菜单栏 —> “Profile” —> “Proxy Server…”—> 任选一个代理 —> 右侧 "Check…"`

![g6ssg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/g6ssg.png)

### 代理规则设置

代理服务器设置后，还需要设置代理规则，才可使用代理。<br />代理规则里，"Add…" 添加规则，输入规则名称、Action、勾选自定义的规则 "foshan"

![0wb32](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/0wb32.png)

![l4nbt](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/l4nbt.png)

**案例：** 有的公司不能用的网盘，云笔记配置成走代理![n88jq](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/n88jq.png)

### 域名解析代理

为了防止本地或国内的 DNS 污染，推荐使用代理服务器端 (可以部署在国外) 来做 DNS 解析

取消第一个复选框，选择第二个复选框，通过代理服务器远程解析 DNS

![tb310](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/tb310.png)

### 运行界面 (MacOS)

![xjkq7](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/xjkq7.png)

### `Proxifier` profile 导出

[work-shein.ppx.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1691484668661-6b7fedff-56ee-4ee6-b33e-d1b9f7957fb0.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1691484668661-6b7fedff-56ee-4ee6-b33e-d1b9f7957fb0.zip%22%2C%22name%22%3A%22work-shein.ppx.zip%22%2C%22size%22%3A1576%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uebf2f2ff-290b-4be7-b27a-995aaa5f37c%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u7e27727a%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

### Ref

- [x] [Proxifier 代理软件介绍和使用教程](https://www.laoxu.cc/post/114.html)

# 境外公司科学上网指南

## `Proxifier` 一切皆可代理

使用 `Proxifier` 目的是让一些不支持代理的软件或者不遵守系统代理的也能走代理

### Proxies 规则

新增 Proxies 规则

![d07tb](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/d07tb.png)

### Rules 规则

- `[Work]No Proxy App` direct 按 APP，不需要代理的 APP，都添加到这

```shell
"dvc-manageproxy-exe.app"; "dvc-manageproxy-exe"; com.leagsoft.epp.manageproxy; "LVSecurityAgent.app"; "LVSecurityAgent"; LVSecurityAgent; "企业微信.app"; "企业微信"; com.tencent.WeWorkMac; "Android Studio.app"; "Android Studio"; com.google.android.studio; "Android Studio Preview.app"; "Android Studio Preview"; com.google.android.studio-EAP
```

![apcv0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/apcv0.png)

- `[Work]No Proxy Domain` direct 不需要代理的域名

```shell
10.122.*.*;10.102.*.*;nexus.dev.sheincorp.cn;*.dotfashion.cn;*.sheincorp.cn;*.*.sheincorp.cn;*.shein.com;*.*.shein.com;dotfashion.cn;innospace.biz.sheincorp.cn;*.*.sheincorp.cn;*.Shein-inc.com;drive.weixin.qq.com;doc.weixin.qq.com;*.weixin.qq.com;cube.weixinbridge.com;*.weixinbridge.com;*.qq.com;;wakatime.com;*.wakatime.com;*.xunlei.com;*.*.xunlei.com
```

![zayb7](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/zayb7.png)

- `[Work]需要代理的 APP` 需要代理的 APP

```shell
"WeChat.app"; "WeChat"; com.tencent.xinWeChat; "夸克网盘.app"; "夸克网盘"; com.alibaba.quark.clouddrive; "有道云笔记.app"; "有道云笔记"; ynote-desktop; ; "语雀.app"; "语雀"; com.yuque.app; "Telegram.app"; "Telegram"; com.tdesktop.Telegram; "TickTick.app"; "TickTick"; com.TickTick.task.mac; "网易有道翻译.app"; "网易有道翻译"; com.youdao.YoudaoDict; "TeamViewer.app"; "TeamViewer"; com.teamviewer.TeamViewer; "Telegram.app"; "Telegram"; com.tdesktop.Telegram; "AirDroid.app"; "AirDroid"; com.sandstudio.airdroid; "SunloginClient.app"; "SunloginClient"; com.oray.sunlogin.macclient; "SunloginClient.app"; "SunloginClient"; com.oray.sunlogin.macclient; "ToDesk.app"; "ToDesk"; com.youqu.todesk.mac; "RustDesk.app"; "RustDesk"; com.carriez.rustdesk; "Nutstore.app"; "Nutstore"; net.nutstore.NutstoreJavaBE; "Obsidian.app"; "Obsidian"; md.obsidian; "Docker.app"; "Docker"; com.docker.docker; "Docker.app";"Postman.app"; "Postman"; com.postmanlabs.mac; "PicGo.app"; "PicGo"; Electron
```

![eqyja](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/eqyja.png)

- `Proxy Domain` 需要代理的域名

```shell
*.github.com;*.*.github.com;*.githubusercontent.com;*.*.githubusercontent.com;raw.githubusercontent.com;mail.google.com
```

![k2qs1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/k2qs1.png)

## `Clash Verge`

- 开启全局模式
- 不要开启系统代理: 开启代理后，公司部分域名可能走代理，导致打不开
- 不要开启 Tun 模式：会开启虚拟网卡，由 `Proxifier` 来接管控制谁 proxy 谁 direct

![4b388](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/4b388.png)

## 关闭 APP 自己设置的 proxy

关闭 APP 自己设置的 proxy，如语雀

> 如果公司禁用语雀，语雀设置的是一个被封装的代理软件的 `ip:port`，此时要更换新的代理软件 `ip:port`，就会打开语雀访问不了，离线状态也设置不了，Proxifier 也不生效，只能卸载 APP 重装了
