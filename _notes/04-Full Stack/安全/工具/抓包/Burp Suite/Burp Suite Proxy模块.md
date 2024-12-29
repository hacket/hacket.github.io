---
date created: 2024-08-27 01:32
date updated: 2024-12-26 00:19
dg-publish: true
---

# Proxy 基础

`Burp Suite` 中的 `Proxy` 模块是其中一个最常用和最强大的模块之一。它允许用户拦截、查看和修改 Web 应用程序的 HTTP 和 HTTPS 流量，使用户能够识别和利用各种不同类型的漏洞。Proxy 模块又分为四部分，分别是 **Intercept (拦截)**，**HTTP history**，**WebSockets history**，**Option (选项)**。

## 界面介绍

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270134907.png)

## Intercept

`Intercept` 是 `Proxy` 模块的核心功能之一，它允许用户拦截应用程序的 `HTTP` 和 `HTTPS` 请求，查看和修改请求，然后转发到目标服务器。使用 Intercept，用户可以深入分析应用程序的请求和响应，并查找潜在的漏洞。Intercept 还可以帮助用户快速验证漏洞的利用。

首先我们要进行成功抓包，必须要将浏览器的流量包转移到 burpsuit 上，burpsuit 在进行发包。

- Burpsuit 默认监听本地8080端口，我们只需要把浏览器的流量转发到8080端口，Burpsuit即可收到，进行相应的操作。
- 我们一般在浏览器上安装`Proxy SwitchyOmega`,进行快速代理，不要慢慢去打开浏览器的设置去配置。

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270150133.png)

- 用 `Open Browser` 打开一个网站

使用`Buprsuit`进行抓包：如下
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270202637.png)

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270202205.png)

**Action：**
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270203465.png)

**Inspector：**
http请求被拦截下时，右边有个`Inspector`的区域。一共有`Request Attributes`, `Request Query Parameters`, `Request Body Parameters`, `Request Cookies`, `Request Headers`五个部分，可以展开查看每个部分的内容，也可以手动更改内容值。例如Request Attributes中可以选择使用HTTP/1或HTTP/2协议，或者更改HTTP Method等。其他部分也可以直接对参数值进行修改，修改后直接Apply changes，应用成功后的修改会变成橙色的，然后点击Forward观察页面变化。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280020192.png)

## Http history

## WebSockets history

## Options

### Proxy listeners 代理监听

拦截的代理设置，proxy 就是拦截当前设置的 IP 与 port

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270138791.png)

#### Windows 安装证书

如果没有安装 CA 证书就拦截 https 协议的网址，就会出现下面的情况：
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272308897.png)

- Chrome浏览器，请先安装插件 `Proxy SwitchyOmega` 并设置好代理

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272339715.png)

- 选择`BurpSuite`代理，然后访问 <http://burp> 下载证书

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272339469.png)
和在 `Proxy Settings` 导出的证书是一样的：
![|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272340399.png)

- 双击 `cacert.der`，然后安装证书；选择本地计算机，然后将证书存储在受信任的证书颁发机构

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272342429.png)

- 在浏览器的证书管理器中确认是否安装到位，就可以愉快的进行测试了。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408272343265.png)

- 如果未生效，重启浏览器

#### Mac OS 安装证书

1. 设置好 Burp 代理并开启代理。
2. 访问 <http://burp/cert> 下载证书。
3. 双击导入钥匙串访问，或者打开钥匙串导入项目。
4. 找到导入的证书，然后开启始终信任。

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240828100538.png)

#### Android 安装证书

#### iPhone 安装证书

1. 在iphone上访问[http://x.x.x.x](http://x.x.x.x/):8080 点击右上角的CA Certificate并允许
2. 打开设置---通用---描述文件与设备管理---安装描述文件
3. 打开设置---通用---关于本机---信任证书设置(拉倒最底下)---开启信任

### Request interception rules 请求拦截规则

添加请求拦截规则设置：可以设置不拦截某些条件，例如不拦截请求地址后缀为 `jpg` 等，`proxy` 会自动放行此数据包
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270139273.png)

设置：只拦截post请求

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270140891.png)

### Response interception rules 响应拦截规则

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270142517.png)

如果需要拦截response并修改response中的返回值怎么做？

- 第一步仍然是进入 Proxy-Options-Intercept Server Response 设置 response 拦截的选项：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270225254.png)

- 勾选 `Intercept response based on the following rules`
- 添加了一条rule：当request被拦截的时候，也拦截response

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270226236.png)

- 然后效果如下，你可以修改request/response中的值并Forward
- 拦截 request
- 拦截 response

### WebSockets interception rules

针对 WebSocket 的，用的不是太多。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270143266.png)

### Response modification rules

用的不是太多。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270144193.png)

### HTTP match and replace rules

自动将请求包的指定内容替换成某些内容

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270145742.png)

Proxy 模块的其他内容不常用，不做介绍。

# Proxy 实战

## 拦截并修改 request 和 response

- Proxy Settings 配置拦截规则

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280010403.png)

- 拦截成功后如下，你可以在Intercept选项卡页直接编辑请求的参数/headers等等然后再转发（Forward）报文

### 修改 requst method，GET 为 POST

- 首先进入 `Proxy Settings` → Request interception rules 设置 request 拦截的规则：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270223772.png)

- 如果不勾选`Intercept requests based on the following rules`，无法拦截到任何http request
- 可以添加多条规则，规则之间可以是`与/或`的关系，添加并勾选规则后，只有满足这些规则组合的http request才会被拦截
- 拦截成功后如下，你可以在Intercept选项卡页直接编辑请求的参数/headers等等然后再转发（Forward）报文
- 在 `Open Browser` 打开 <https://www.baidu.com>
- 点击 `Action` → `Change request method`

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270220613.png)

- 会自动将 GET 修改成 POST

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270222154.png)

## 抓 web

## 抓 App

# 问题

## Proxy 证书问题

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270155851.png)
