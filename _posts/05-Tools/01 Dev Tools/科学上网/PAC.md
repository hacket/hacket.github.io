---
date created: 2024-12-25 19:56
date updated: 2024-12-25 20:12
dg-publish: true
---

# 什么是 PAC？

PAC，一个自动代理配置脚本，包含了很多使用 JavaScript 编写的规则，它能够决定网络流量走默认通道还是代理服务器通道，控制的流量类型包括：HTTP、HTTPS 和 FTP。
它是一段 JavaScript 脚本：

```js
function FindProxyForURL(url, host) {  
  return "DIRECT";  
}
```

上面就是一个最简洁的 PAC 文件，意思是所有流量都直接进入互联网，不走代理。

# PAC 语法和函数

## PAC 语法

上面函数中，`url` 字段就是我们在浏览器地址栏输入的待访问地址，`host` 为该地址对应的 hostname，`return` 语句有三种指令：

- `DIRECT`，表示无代理直接连接
- `PROXY host:port`，表示走 `host:port` 的 proxy 服务
- `SOCKS host:port`，表示走 `host:port` 的 socks 服务

而返回的接口可以是多个代理串联：

```js
return "PROXY 222.20.74.89:8800; SOCKS 222.20.74.89:8899; DIRECT";
```

上面代理的意思是，默认走 `222.20.74.89:8800` 的 proxy 服务；如果代理挂了或者超时，则走 `222.20.74.89:8899` 的 socks 代理；如果 socks 也挂了，则无代理直接连接。从这里可以看出 PAC 的一大优势：自动容灾。

## PAC 内置函数类型

### dnsDomainIs

类似于 `两个等号==`，但是对大小写不敏感，

```js
if (dnsDomainIs(host, "google.com") ||   
    dnsDomainIs(host, "www.google.com")) {  
  return "DIRECT";  
}
```

### shExpMatch

Shell 正则匹配，`*` 匹配用的比较多，可以是 `*.example.com`，也是可以下面这样，

```js
if (shExpMatch(host, "vpn.domain.com") ||  
    shExpMatch(url, "http://abcdomain.com/folder/*")) {  
  return "DIRECT";   
}
```

### isInNet

判断是否在网段内容，比如 `10.1.0.0` 这个网段，`10.1.1.0` 就在网段中，

```js
if (isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0")) {  
  return "DIRECT";  
}
```

### myIpAddress

返回主机的 IP，

```js
if (isInNet(myIpAddress(), "10.10.1.0", "255.255.255.0")) {
  return "PROXY 10.10.5.1:8080";
}
```

### dnsResolve

通过 DNS 查询主机 ip，

```js
if (isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
    isInNet(dnsResolve(host), "172.16.0.0",  "255.240.0.0") ||
    isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0") ||
    isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0")) {
  return "DIRECT";
}
```

### isPlainHostName

判断是否为诸如 `http://barret/`，`http://server-name/` 这样的主机名，

```js
if (isPlainHostName(host)) {
  return "DIRECT";
}
```

### isResolvable

判断主机是否可访问，

```js
if (isResolvable(host)) {
  return "PROXY proxy1.example.com:8080";
}
```

### dnsDomainLevels

返回是几级域名，比如 `dnsDomainLevels(baidu.com)` 返回的结果就是 1，

```js
if (dnsDomainLevels(host) > 0) {  
  return "PROXY proxy1.example.com:8080";  
} else {  
  return "DIRECT";  
}
```

### 日期时间

#### weekdayRange

周一到周五，

```js
if (weekdayRange("MON", "FRI")) {  
  return "PROXY proxy1.example.com:8080";  
} else {  
  return "DIRECT";  
}
```

#### dateRange

一月到五月，

```js
if (dateRange("JAN", "MAR"))  {  
  return "PROXY proxy1.example.com:8080";    
} else {  
  return "DIRECT";  
}
```

#### timeRange

八点到十八点，

```js
if (timeRange(8, 18)) {  
  return "PROXY proxy1.example.com:8080";  
} else {  
  return "DIRECT";    
}
```

### alert

据说这个函数可以用来调试，不过我在 Chrome 上测试并未生效，

```js
resolved_host = dnsResolve(host);
alert(resolved_host);
```

## PAC 文件的安装和注意事项

在 Windows 系统中，通过「`Internet选项 -> 连接 -> 局域网设置 -> 使用自动配置脚本」`可以找到配置处，下放的地址栏填写 PAC 文件的 URI，这个 URI 可以是本地资源路径(`file:///`)，也可以是网络资源路径(`http://`)。

Chrome 中可以在 `「chrome://settings/ -> 显示高级设置 -> 更改代理服务器设置」` 中找到 PAC 填写地址。

**需要注意的几点：**

- PAC 文件被访问时，返回的文件类型（Content-Type）应该为：`application/x-ns-proxy-autoconfig`，当然，如果你不写，一般浏览器也能够自动辨别
- `FindProxyByUrl(url, host)` 中的 host 在上述函数对比时无需转换成小写，对大小写不敏感
- 没必要对 `dnsResolve(host)` 的结果做缓存，DNS 在解析的时候会将结果缓存到系统中

## PAC 示例

### 示例1

```js
function FindProxyForURL(url, host) 
    //对于所有.edu.cn域名，直接连接
    if (shExpMatch(url,"*.edu.cn/*"))    return "DIRECT";
      //对于10.0.0.0到10.0.0.255之间的IP地址使用代理
    if (isInNet(host, "10.0.0.0",  "255.255.255.0"))    
          return "PROXY proxy.example.com:8080";
    
    //其他网站尝试使用代理访问，代理无效时，直接访问
      return "PROXY proxy.example.com:8080; DIRECT";
}
```

> 这 个例子说明了JavaScript函数在PAC文件中的使用方法。例子中，所有以`.edu.cn`作为域名的网站都将采用直接连接，所有在`10.0.0.0`到`10.0.0.255`之间的网站都会通过代理服务器`proxy.example.com的8080`端口连接（即使这个代理不可用）。其他一切网络连接都 将尝试通过`proxy.example.com:8080`连接，如果代理无响应则直接连接。

## PAC 文件怎么用？

### Linux ubuntu

对于Linux系统（以ubuntu10.04为例），在”系统设置”里面打开”网络代理首选项”，在”自动代理配置”中填入PAC的URL。
### Windows
对于 Windows 系统，直接在”Internet 选项”中，”连接”标签，”局域网设置”按钮，选中”使用自动配置脚本”，下面的地址栏填写 PAC 文件的 URL。例如有个 `auto.pac` 在你的 D 盘根目录，则填写” `file://d:/auto.pac`”；如果这个 pac 在网络主机上，你就需要填成类似 “`http://genghis-yang.tk/something/auto.pac`“这样。

### Firefox

对于Firefox浏览器，”首选项”中”高级选项卡”，”网络”标签，”设置”按钮，在”自动代理配置URL”中填入你的PAC。