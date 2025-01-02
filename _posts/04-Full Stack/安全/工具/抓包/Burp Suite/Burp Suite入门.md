---
date created: 2024-08-27 00:31
date updated: 2024-12-26 00:19
dg-publish: true
---

# Burp Suite入门

## Burp Suite 简介

Burp Suite 是一款用于 Web 应用程序安全测试的软件应用程序。它由 PortSwigger 开发，广泛用于安全专业人员、渗透测试员和 Web 开发人员中，用于识别和利用 Web 应用程序中的漏洞。Burp Suite 提供了一个全面的工具集，包括代理服务器、扫描器、入侵者、重复器、排序器、解码器等。这些工具可以用于拦截和修改 HTTP 请求和响应，执行自动化漏洞扫描、暴力破解攻击等。Burp Suite 是一款强大而多功能的工具，被广泛应用于 Web 应用程序安全领域。

## 安装

### Windows

#### Windows 安装

- [x] 下载链接：[Download and install](https://portswigger.net/burp/documentation/desktop/getting-started/download-and-install)

#### Windows 破解

1. 下载注册机&启动器二合一版本：<https://github.com/lzskyline/BurpLoaderKeygen/raw/main/BurpLoaderKeygen.jar>
2. 下载 1.9 版本或以上的 JDK：<https://www.oracle.com/java/technologies/javase/jdk14-archive-downloads.html>
3. 双击打开 `burp-loader-keygen.jar`；有可能双击是没反应的，如果我们双击没反应。打不开 `burp-loader-keygen.jar` 文件，那我们就需要在 cmd 中用 java 打开它：`java -jar burp-loader-keygen.jar`
4. 就会弹出以下窗口，直接点击右边那个run

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270051546.png)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270052208.png)

5. 在弹出的小窗点击`Manual activation`

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270053785.png)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270053235.png)
将红框里面的代码复制到 `BurpLoaderKeygen另一边`
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270054924.png)
然后在将左边弹出来的内容复制到有右边，点击`NEXT`即可完成
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270056333.png)
激活成功：
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270055713.png)

### 破解 - Mac

1. 下载注册机&启动器二合一版本：<br><https://github.com/lzskyline/BurpLoaderKeygen/raw/main/BurpLoaderKeygen.jar>
2. 下载1.9版本或以上的JDK<br><https://www.oracle.com/java/technologies/javase/jdk14-archive-downloads.html><br>自行下载原版burpsuite，目前网上流传的有两种格式：
3. 下载Burp Suite <https://portswigger.net/burp/releases/>
4. 在应用程序中找到`burp`，显示包内容，依次打开文件夹：`./Contents/java/app`（如果没有的话就是`./Contents/Resources/app`），然后就会看到我们熟悉的`jar`文件了
5. 将启动器`BurpLoaderKeygen.jar`移动到当前app目录
6. 返回到`Contents`目录，编辑`vmoptions.txt`，末尾追加内容

```
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.Opcodes=ALL-UNNAMED
-javaagent:BurpLoaderKeygen.jar
-noverify
```

7. 保存，从启动台中运行app，然后启动注册机BurpLoaderKeygen.jar，注册机上会显示license

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052042438-b2d19251-263c-4507-8785-ec61db530995.png#averageHue=%23ededed&clientId=ufd806808-f4c1-4&from=paste&height=253&id=uf524487c&originHeight=1000&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197466&status=done&style=none&taskId=u03dee636-ec00-479c-8e8d-82a1717c943&title=&width=405)

8. .把license填到app的页面以后，选中Manual activat，进行手工注册，点击next

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052086198-f6e9afb6-7425-441c-9ac4-38a015b81fcf.png#averageHue=%23e5e4e3&clientId=ufd806808-f4c1-4&from=paste&height=386&id=ua719eef0&originHeight=946&originWidth=1126&originalType=binary&ratio=2&rotation=0&showTitle=false&size=227189&status=done&style=none&taskId=ufeae1db7-e4b2-4e0d-a2ee-b2abe0cc594&title=&width=459)<br>![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052106811-c068358c-09e8-4836-b29e-4b12866f29eb.png#averageHue=%23d4d3d2&clientId=ufd806808-f4c1-4&from=paste&height=409&id=u79ae92f4&originHeight=1018&originWidth=1198&originalType=binary&ratio=2&rotation=0&showTitle=false&size=107121&status=done&style=none&taskId=u2f14c24f-98b5-48c7-a53d-ca5269e3937&title=&width=481)

9. app页面上出现了request，把request的内容粘贴到注册机中，会在注册机中生成response；

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052304755-26ed9e2c-e922-433a-925a-cd1b9057c691.png#averageHue=%23d9d8d8&clientId=ufd806808-f4c1-4&from=paste&height=294&id=u4bd406ae&originHeight=1000&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=390668&status=done&style=none&taskId=u90637235-e127-4c58-ab0c-d3d9f940a8f&title=&width=471)

10. 把注册机中的response，粘贴回app的页面，然后点击 next

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052244098-d61d1db1-a426-42ce-9e77-ac9909fd913b.png#averageHue=%23ccc9c9&clientId=ufd806808-f4c1-4&from=paste&height=408&id=uca1056f0&originHeight=1018&originWidth=1198&originalType=binary&ratio=2&rotation=0&showTitle=false&size=175214&status=done&style=none&taskId=u9d100cc8-a6b7-449f-af50-a31e85fc456&title=&width=480)

10. 提示注册成功

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1703052331970-b637c5d0-40f1-4441-9e13-be1a9cfdf5c3.png#averageHue=%23f9f8f7&clientId=ufd806808-f4c1-4&from=paste&height=402&id=u9976583a&originHeight=946&originWidth=1126&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50324&status=done&style=none&taskId=u3b4093b6-49ca-4bd9-81bf-b208cc06710&title=&width=478)

### Ref

- [x] [MacOS安装破解BurpSuite2023.10.2【持续更新】](https://www.lzskyline.com/index.php/archives/121/)

# 使用

## 界面

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270111286.png)

**重点介绍：** Proxy 模块、Repeater 模块、Intruder 模块、Target 模块，杂项模块、Decoder 模块，Comparer 模块，User Options 模块、Extensions 模块+常见 BurpSuite 插件、上游代理记录

### Dashboard 模块

扫描模块 (**Dashboard**)：用于执行自动化漏洞扫描，包括 `SQL注入`、`跨站脚本` 等多种漏洞。
Burp Suite 的扫描模块用于执行自动化漏洞扫描，包括 SQL 注入、跨站脚本等多种漏洞。用户可以选择使用预定义的扫描规则，也可以创建自己的自定义规则。扫描结果将被分为高、中、低三个级别，以便用户更容易地识别和定位漏洞。(记录：平时用这个扫描模块用的比较少，一般使用的是爬取模块。原因，目标部署了 waf 很容易被 ban Ip, 所以使用爬虫模块就足够了)
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270120179.png)

#### New scan

新建扫描对象，这里使用的是 `爬取` 与 `审计` 测试，下面 `Protocol settings` 模块可以设定爬取的条件，即不爬取某些对象，
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270124177.png)
其他按照默认的配置，可以设置自己的UA头
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270124893.png)
设置账户密码访问
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270124299.png)
其他参数
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270125414.png)
扫描结果：更详细可以点击项目的右下角view模块，看到爬取的url信息与扫描结果
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270128979.png)

更详细的模块查看你（Target模块）
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270128770.png)

#### New live task 模块的使用

第一个模块：来自代理的实时审计(所有流量)
第二个模块：从代理(所有流量)动态被动爬行

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270130664.png)

爬取结果：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270131703.png)

### Proxy 模块

代理模块 (**porxy**)：用于`拦截和修改 HTTP 请求和响应，并允许用户在发送到目标服务器之前手动修改请求内容`。
Burp Suite 的代理服务器是其最核心的组件之一。它允许用户拦截和修改 HTTP 请求和响应，并允许用户在发送到目标服务器之前手动修改请求内容。通过这个功能，用户可以轻松地测试各种不同的漏洞类型，例如`跨站点脚本（XSS）`和 `SQL 注入`。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270117567.png)

具体使用见：[[Burp Suite Proxy模块]]

### Target 模块

目标模块(**Target**)：用于设置测试目标，并让`Burp Suite`扫描目标应用程序以发现漏洞。\
在使用Burp Suite进行安全测试时，用户需要指定测试目标。Burp Suite的目标模块允许用户设置测试目标，并让Burp Suite扫描目标应用程序以发现漏洞。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270117923.png)

### Repeater 模块

响应模块(**Repeater**)：用于显示请求和响应的详细信息，包括HTTP头和正文。\
Burp Suite的响应模块用于显示请求和响应的详细信息，包括HTTP头和正文。用户可以使用此模块来查看已拦截的请求和响应，以了解应用程序如何响应不同类型的攻击。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270120173.png)

## 基本使用

重点学习**Proxy**、**Repeater**、**Intruder**三个模块，分别用于 `抓包放包`、`重放包`、`爆破`

### 设置 proxy

打开BP，我们选择默认临时文件就可以了，点击next
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270101010.png)
直接点击进入
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270101863.png)
然后进入一个学习的页面：
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408270102581.png)

打开软件后，我们第一件事就应该去`调试软件和浏览器`的代理，让`BURP`能够正常工作抓包

## 技能

### 修改请求方法

# Ref

- [ ] [Burp Suite 实战指南 --电子书](https://t0data.gitbooks.io/burpsuite/content/)
