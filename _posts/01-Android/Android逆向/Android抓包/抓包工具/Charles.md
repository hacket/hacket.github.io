---
date created: 2024-03-28 23:47
date updated: 2024-12-24 00:44
dg-publish: true
---

# Charles Settings

[Charles_Settings_2023-11-06 10-51-41.xml](https://www.yuque.com/attachments/yuque/0/2023/xml/694278/1699239149738-d2d5026f-b898-4809-807c-7f6ce6a26461.xml?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fxml%2F694278%2F1699239149738-d2d5026f-b898-4809-807c-7f6ce6a26461.xml%22%2C%22name%22%3A%22Charles_Settings_2023-11-06%2010-51-41.xml%22%2C%22size%22%3A13067%2C%22ext%22%3A%22xml%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u918d0044-f135-48ed-866b-46237c161b0%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fxml%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u929dd031%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[CharlesSettings2023-11-14 14-12-00.xml](https://www.yuque.com/attachments/yuque/0/2023/xml/694278/1699942346851-f085dd4f-0f4d-4fa7-8219-84e9a118963a.xml?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fxml%2F694278%2F1699942346851-f085dd4f-0f4d-4fa7-8219-84e9a118963a.xml%22%2C%22name%22%3A%22CharlesSettings2023-11-14%2014-12-00.xml%22%2C%22size%22%3A14034%2C%22ext%22%3A%22xml%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u4c9a207b-11d2-4a88-a253-727ce25547b%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fxml%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u6d515214%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

# Charles http基本配置

1. 使手机和电脑在一个局域网内 ，不一定非要是一个ip段，只要是同一个路由器下就可以了，比如电脑连接的有线网ip为192.168.16.12，然后手机链接的wifi ip 192.168.1.103，但是这个有线网和无线网的最终都是来自于一个外部ip，这样的话也是可以的。
2. 下面说说具体配置，这里电脑端是不用做任何配置的，但是需要把防火墙关掉（这点很重要）！然后charles设置 需要设置下允许接收的ip地址的范围 。 设置首先要进入这个位置 `Proxy - Access Control Settings`然后如果接收的ip范围是192.168.1.xxx的话，那么就添加并设置成192.168.1.0/24 如果全部范围都接收的话，那么就直接设置成0.0.0.0/0。

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771021270-0f94fb60-cec5-45a4-86f6-eb02e04243c1.png#averageHue=%23eeedec&clientId=u24173f2f-bde2-4&from=paste&height=463&id=u8535af20&originHeight=695&originWidth=800&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=95228&status=done&style=stroke&taskId=ue25365d5-ec69-43c6-a5e5-22566d25326&title=&width=533.3333333333334)

3. 只抓取手机，不抓取电脑<br>然后如果勾选了`Proxy - Windows Proxy` 的话，那么就会将电脑上的抓包请求也抓取到，如果只抓手机的话，可以将这个设置为不勾选。

# Charles进阶用法

## 配置focus

View→Focused Hosts
![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1699859507521-0bb34459-d2e5-4363-898a-5a12f6d62117.png#averageHue=%23ededec&clientId=u7d17de6c-720f-4&from=paste&height=328&id=ued7cd378&originHeight=656&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72018&status=done&style=stroke&taskId=uaefaef5f-1b9b-4186-b11f-a31ca8fe7ce&title=&width=540)

## 过滤 Record include/exclude（Recording Settings）

在 Charles 的菜单栏选择 `Proxy->Recording Settings`，然后选择 `Include` 栏，选择 `Add`，然后填入需要监控的协议，主机地址，端口号,这样就达到了过滤的目的。<br>![|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771221098-4e2258ff-d4db-4704-a800-15b208b36ad7.png#averageHue=%23ecebea&clientId=u24173f2f-bde2-4&from=paste&height=378&id=ue17f7450&originHeight=474&originWidth=565&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub924fd97-e665-4fae-820f-23282fb2f5c&title=&width=451)

应用场景：某些服务挂了代理访问不了，比如 Google 登录，Google Cubes SDK 发布

## focus某个host

右键选中某个 host：focus<br>![|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771236058-0b0a7031-19aa-4d35-85b8-6b7a80bc3c78.png#averageHue=%23f0eeed&clientId=u24173f2f-bde2-4&from=paste&id=uc9052544&originHeight=635&originWidth=276&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ube0ddce5-4e98-4b2a-afc1-0ebd1208da4&title=)<br>然后 focus 的 Host 就单独一条，其他的在 `Other Hosts`：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771268589-55fbb757-1228-49c7-8c60-9efbea03c2bf.png#averageHue=%23ebeae3&clientId=u24173f2f-bde2-4&from=paste&id=u3c3e5b86&originHeight=296&originWidth=348&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u4efe5b09-4847-45f9-a7a0-f57cb5d619d&title=)

## 使用Charles模拟弱网环境（Throttle Settings）

菜单栏：`Proxy→Throttle Settings`<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771277671-c9f9805d-04b5-434a-83b5-942c60180ff6.png#averageHue=%23ebebeb&clientId=u24173f2f-bde2-4&from=paste&height=418&id=u98c04ca3&originHeight=1188&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u1a2502d2-9911-41f1-a159-5735192166a&title=&width=380)<br>进入Throttle设置，可以配置指定Hosts弱网环境<br>工具栏，小乌龟绿色表示开启<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771305666-09964f47-8694-44ba-8932-98e8837721aa.png#averageHue=%23e7e7e5&clientId=u24173f2f-bde2-4&from=paste&id=u84d99df1&originHeight=31&originWidth=313&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ue3433f6d-e8f5-409b-92db-1a61d7b6a9e&title=)

## 使用Charles设置断点（Breakpoint Settings）

在Charles发起一个请求的时候，我们是可以给某个请求打一个断点的，然后来观察或者修改请求或者返回的内容，但是在这过程中药注意请求的超时时间问题。要针对某一个请求设置断点，只需要在这个请求网址右击选择Breakpoints就可以断点某一个请求了。<br>`断点设置：proxy→Breakpoint Settings`<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771325714-d0dcabc6-eb56-477d-9472-643ddceeab66.png#averageHue=%23dfc09c&clientId=u24173f2f-bde2-4&from=paste&id=u15c680e7&originHeight=345&originWidth=538&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9879196e-b709-4f9d-8a39-7c0d6862f6c&title=)<br>`断点开启：proxy→Enable Breakpoints`

或者工具栏大红点<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771336130-d1662eef-76b0-4d42-b5cb-5f1ab69a85f5.png#averageHue=%23e6e5e4&clientId=u24173f2f-bde2-4&from=paste&id=u94884dc0&originHeight=41&originWidth=360&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ue55b8ebd-3ca7-417a-b33f-31095eda268&title=)

## 使用repeat测试

重复请求：`右键选中host，repeat`<br>Repeat Advanced可以重复定期发送多个请求

## 请求重定向（Map Remote/Local）

请求重定向的作用是什么呢？开发中一般都是测试环境，如果我们想对比一下和线上版本的区别的话，可以讲测试的请求重定向到正式环境下。在选择 `Tools`->`Map Remote`下：

### Map Remote

重定向到远端<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771401356-407a3245-6c59-450d-8ec4-ebf87a1efe97.png#averageHue=%23e7e7e7&clientId=u24173f2f-bde2-4&from=paste&id=u700a4718&originHeight=1400&originWidth=1800&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u69561044-b00e-414f-9663-5117db2c6da&title=)

> 注意上面`map From`中的`Path`配置项使用了`*`通配符，表示匹配127.0.0.1:8080/api/下的所有文件及子路径，将其重定向到cmstest.intra.xiaojukeji.com下的/api/路径下<br>如果某个不写，保持不变，完整的map to过来。

> 可以在正常的某个请求，右键选择Map，会自动帮我们把Map From的信息填好

### MapLocal

mapLocal类似，只是数据在本地

### 其他功能

- map隐射可以使用的模式匹配符有三种：

1. `*****`: 可以匹配0个或者多个字符
2. `**?**`: 可以匹配一个字符
3. `**[...]**`: 范围选择符，可以匹配范围中的任意一个字符

- 假设Map From配置中的各个项为空，表示匹配所有请求，然后Map To项的配置不同，代表不同含义

## 内容替换（Rewrite）

有时候我们会测一下请求的参数不同会带来不同的返回结果以测试是否达到业务需求，或者需要不同的返回结果来验证我们对数据的处理是否正确，这时候需要后台的同事配合，但是有了Charles，我们可以自己把控接口返回来的内容，比如数据的空与否，数据的长短等等。在`Tools`->`Rewrite Settings`下：

### 替换Body

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771455591-96b377b2-ab6e-4def-9b4b-e2422253bcca.png#averageHue=%23f1f0f0&clientId=u24173f2f-bde2-4&from=paste&id=u48ad2a1d&originHeight=525&originWidth=1194&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u811322cf-2efa-4ee8-9133-4c630423557&title=)

### 替换Query Param

- 先Remove Query Param

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702957161025-3e50f183-5dc0-44dd-b0b7-db6010018c94.png#averageHue=%23e8e8e8&clientId=u8bf8222d-2675-4&from=paste&height=321&id=u4c2951dd&originHeight=1034&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109589&status=done&style=stroke&taskId=u93c367dc-683b-4783-8fed-deb3a6dab79&title=&width=335)

- 再Add Query Param

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702957202374-2b73be04-0f4c-4193-b287-a2116e48d510.png#averageHue=%23e7e6e6&clientId=u8bf8222d-2675-4&from=paste&height=321&id=ued5dee5e&originHeight=1034&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=117411&status=done&style=stroke&taskId=u15cf37c3-cf9c-4572-aa27-6cf9e2ae0ab&title=&width=335)

### 添加Query Param

添加请求参数，如忽略接口加密的参数

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1684771469169-911860a2-9602-41b0-bf3e-03cdd18995fd.png#averageHue=%23e4e4e4&clientId=u24173f2f-bde2-4&from=paste&height=346&id=ud394c713&originHeight=1006&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u9aea2fe6-80f5-4517-94e5-ea225c652b9&title=&width=371)

### 添加Header

1. 击菜单栏Tools，选择Rewrite；勾选Enable Rewrite，点击Add按钮

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694855722730-8450ddf0-bf98-460f-9635-3c4245ecdc75.png#averageHue=%23ededec&clientId=u49f4b0f2-68e1-4&from=paste&height=315&id=ufefbba17&originHeight=1044&originWidth=1302&originalType=binary&ratio=2&rotation=0&showTitle=false&size=129312&status=done&style=stroke&taskId=ue0db2f9c-2a65-497e-95fb-e083b1f0eb7&title=&width=393)

2. 添加请求：将请求粘贴到Host字段后，自动区分协议、域名、路径

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694856285928-3001dd09-fdd9-4c7d-b002-90c85e63adc2.png#averageHue=%23e6e5e5&clientId=u49f4b0f2-68e1-4&from=paste&height=243&id=u7563dcc0&originHeight=558&originWidth=880&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62510&status=done&style=stroke&taskId=uf8d92725-6902-464b-aeec-adbbebfdde0&title=&width=384)

3. 添加规则

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694856550497-d12f0bb7-81f2-4966-a3c3-70d17a8750bf.png#averageHue=%23e3e3e2&clientId=u49f4b0f2-68e1-4&from=paste&height=369&id=uf310d8e5&originHeight=1034&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=115978&status=done&style=stroke&taskId=ub83a1480-2e47-4ec0-85d5-f4ba1910f76&title=&width=385)

4. 再次请求

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694856952666-6272c780-b167-41a0-a454-853adb43c44a.png#averageHue=%23e9e1e0&clientId=u49f4b0f2-68e1-4&from=paste&height=117&id=u604bc694&originHeight=234&originWidth=1528&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44445&status=done&style=stroke&taskId=uc112726d-adf3-4b1d-b983-08f7eb6f873&title=&width=764)

# Charles破解

## Charles4.2

### 破解步骤

将下载的文件重命名为charles.jar并覆盖到安装目录下的lib文件夹下即可完成破解(Windows)<br>将下载的文件重命名为charles.jar并覆盖到Content->Java下即可完成破解(MAC)

### charles4.2包破解包（见charles.jar）

<http://download.csdn.net/download/charmer21/10016501>

---

> Charles 4.2目前是最新版，可用。<br>Registered Name: <https://zhile.io><br>License Key: 48891cf209c6d32bf4

### 4.6.3

// Charles Proxy License<br>// 适用于Charles任意版本的注册码，谁还会想要使用破解版呢。<br>// Charles 4.2目前是最新版，可用。

```
Registered Name: https://zhile.io
License Key: 48891cf209c6d32bf4
```

#### 抓包工具Charles v4.6.3 Win/Mac破解版-附中文补丁

[抓包工具Charles v4.6.3 Win/Mac破解版-附中文补丁](https://www.shserve.cn/7313.html)

# 抓包不了问题排查

## 手机和电脑端是否能ping通

遇到过手机和电脑是在同一个网段，但是ping不通，也就抓不了包了

## 证书问题：红色的叉unknown

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699257303645-381ef45d-31e7-486a-a1f9-03607142588f.png#averageHue=%23fafafa&clientId=u3f7d7186-943d-4&from=paste&height=382&id=u3e000622&originHeight=764&originWidth=1748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127905&status=done&style=stroke&taskId=ue42a1f9a-79da-4d6c-9951-c4c8c7f7f24&title=&width=874)

- Mac上是否安装并信任证书；

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699257457562-a139b5ca-f4c2-4273-aab4-055c6ad90def.png#averageHue=%23f2f1ef&clientId=u3f7d7186-943d-4&from=paste&height=795&id=uc774e06c&originHeight=1590&originWidth=2206&originalType=binary&ratio=2&rotation=0&showTitle=false&size=720427&status=done&style=stroke&taskId=u818ac993-e0b6-41f3-b293-4244dea4e69&title=&width=1103)

- 手机是否设置代理、是否已安装描述文件；
- 手机证书是否已信任。
  - iOS 10.3 以后需要额外在`通用>关于本机>证书信任`设置里对 Charles Proxy CA 启用完全信任

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699257543580-9c33f649-b37c-4405-b8ce-ccef22e71aa1.png#averageHue=%239bd79c&clientId=u3f7d7186-943d-4&from=paste&height=348&id=u484e6337&originHeight=1188&originWidth=1125&originalType=binary&ratio=2&rotation=0&showTitle=false&size=316817&status=done&style=stroke&taskId=u516cb949-0ea9-4aac-80a3-d02f8814e51&title=&width=330)

## Android7.0 无法抓包的问题

Android 7.0 之后默认不信任用户添加到系统的 CA 证书：也就是说对基于 SDK24 及以上的 APP 来说，即使你在手机上安装了抓包工具的证书也无法抓取 HTTPS 请求。<br>需要配置:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!--release只依赖system证书-->
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
    <!--指定域名-->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">d1.music.126.net</domain>
        <domain includeSubdomains="true">dldir1.qq.com</domain>
        <domain includeSubdomains="true">imgsrc.baidu.com</domain>
    </domain-config>
    <!--debug依赖system和user证书-->
    <debug-overrides>
        <trust-anchors>
            <certificates src="system"/>
            <certificates src="user"/>
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

`Manifest`文件的`appliccation`节点配置：`android:networkSecurityConfig="@xml/network_security_config"`

## include和exclude规则

上面还不生效，检查Proxy→Recording Settings，去除exclude的配置

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1699859011687-dcd60c1c-b5b2-4fc3-815a-094092e22a49.png#averageHue=%23edecec&clientId=u7d17de6c-720f-4&from=paste&height=404&id=ub0654c32&originHeight=808&originWidth=1184&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77294&status=done&style=stroke&taskId=u7be6410e-9162-4b7f-9208-b6671aa1c7f&title=&width=592)

# Ref

- Android 常用抓包工具介绍之Charles<br><http://blog.tingyun.com/web/article/detail/516>
- 抓包工具Charles的使用心得<br><http://www.jianshu.com/p/fdd7c681929c>
