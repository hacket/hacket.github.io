---
date created: 2024-12-14 11:25
date updated: 2024-12-26 00:16
dg-publish: true
---

[宝塔面板 - 简单好用的Linux/Windows服务器运维管理面板](https://www.bt.cn/new/index.html)

# 宝塔 Linux 基础

## 安装 宝塔 Linux

## 登录宝塔

### 腾讯云宝塔

<http://hacket.me:8888/tencentcloud>

- 安全组放行 8888 端口

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412032341883.png)

- 防火墙放行 8888 端口

```shell
# 放行8080端口
firewall-cmd --zone=public --add-port=8080/tcp --permanent
# 查看所有打开的端口
firewall-cmd --zone=public --list-ports
```

- 连接服务器
- 输入以下命令重置宝塔登录地址和密码

```shell
sudo /etc/init.d/bt default
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412032331491.png)

- 执行 ` sudo bt 5  `修改面板登录密码

## FTP

<http://hacket.me:8888/ftp>

- FTP 登录地址：`ftp://43.159.135.247:2121`
- FTP 目录： /www/wwwroot/hacket
