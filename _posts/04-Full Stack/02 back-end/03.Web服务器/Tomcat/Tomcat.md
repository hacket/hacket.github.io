---
date created: 2024-09-14 00:36
date updated: 2024-12-26 00:15
dg-publish: true
---

# Tomcat 入门

## Tomcat 配置

### Tomcat 目录介绍

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409140035638.png)

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409140036473.png)

### 访问测试

- 访问测试：<http://localhost:8080/>

### 配置端口，主机

- Tomcat的默认端口号为：**8080**
- mysql：**3306**
- http：**80**
- https：**443**

```xml
<Connector port="8081" protocol="HTTP/1.1"
   connectionTimeout="20000"
   redirectPort="8443" />
```

可以配置主机的名称

- 默认的主机名为：`localhost->127.0.0.1`
- 默认网站应用存放的位置为：`webapps`

```xml
<Host name="www.subeily.com"  appBase="webapps"
	unpackWARs="true" autoDeploy="true">
```
