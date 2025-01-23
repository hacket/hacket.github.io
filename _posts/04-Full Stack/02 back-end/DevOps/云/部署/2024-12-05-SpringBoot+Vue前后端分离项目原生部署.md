---
date_created: Thursday, December 5th 2024, 11:54:11 pm
date_updated: Wednesday, January 22nd 2025, 11:33:05 pm
title: SpringBoot+Vue前后端分离项目原生部署
author: hacket
categories:
  - back-end
category: 云
tags: [云, SpringBoot]
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
date created: 2024-12-05 23:54
date updated: 2024-12-26 00:16
aliases: [SpringBoot+Vue 前后端分离项目原生部署]
linter-yaml-title-alias: SpringBoot+Vue 前后端分离项目原生部署
---

# SpringBoot+Vue 前后端分离项目原生部署

## 原生部署概念

原生部署是指将应用程序（一般是指软件、应用或服务）在底层的操作系统环境中直接运行和部署，而不依赖于额外的中间件、框架或虚拟化技术。

在原生部署中，应用程序直接与操作系统进行交互，并利用操作系统提供的资源和功能来执行任务。这种部署方式通常需要考虑操作系统的兼容性和依赖项，以确保应用程序能够正确地在目标操作系统上运行。

**原生部署的优点包括：**

1. 性能高：由于没有中间层的额外开销，原生部署的应用程序可以更直接地访问底层系统资源，从而获得更好的性能。
2. 可控性强：可以直接控制操作系统环境和配置，更容易进行定制和优化，以满足特定的需求。
3. 可移植性好：原生部署允许将应用程序部署到多个操作系统上，从而实现跨平台的可移植性。

**存在的问题：**

1. 平台依赖性：原生部署的应用程序在不同的操作系统或架构上可能会有不兼容性的问题，需要做额外的适配。
2. 部署复杂性：原生部署通常需要手动进行配置和安装，可能需要额外的管理和维护工作。
3. 扩展性和弹性：相对于一些**云原生**或**容器化**部署方式，原生部署可能在扩展性和弹性方面具有一定的限制。

## 环境安装

### SpringBoot 项目

- **Java** **Development Kit（JDK）：** Spring Boot 是一个 Java 框架，需要 JDK 来编译和运行。因为 SpringBoot 内嵌 Tomcat，因此我们无需再安装 Tomcat 服务器。
- **Maven：** Maven 是一个用于构建和管理 Java 项目的强大工具。 它提供了一种规范化的项目结构和一组标准化的构建配置，以简化项目的构建、依赖管理和项目报告等任务。
- **MySQL** **（根据项目需要安装）**：MySQL 是一个强大、稳定且易于使用的关系型数据库管理系统,可以用来存储系统执行时产生的数据。
- **Redis****（根据项目需要安装）**：Redis 是一种开源的基于内存的键值存储系统，也被称为数据结构服务器。由于 Redis 的高性能和基于内存的特性，它常常被用作缓存服务器。将常用的数据放在 Redis 中可以加快数据访问速度，减轻后端数据库的负载。

### Vue.js 项目

- **Node.js 和 npm：** Vue.js 是一个 JavaScript 框架，使用 Node.js 作为运行环境。安装 Node.js 会自动安装 npm（Node 包管理器）。
- **Nginx**：Nginx 是一个高性能的 HTTP 和反向代理 web 服务器。

### 工具库

#### Git

- **Git**：Git 是一个分布式版本控制系统，广泛用于协作开发和源代码管理。上传项目代码服务器有两种方式：一是直接从本地拖拽代码文件上传到服务器上，二是使用 Git 在第三方代码托管平台下载我们上传的代码。

#### FTP

##### FileZilla

- 下载 [Download FileZilla Client for Windows (64bit x86)](https://filezilla-project.org/download.php)

FileZilla 我估计是绝大多数工程师的首选，非常受人欢迎，适用于 Windows、Mac 和 Linux 操作系统，同时 FileZilla 还支持 FTPS 和 SFTP。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412071004176.png)

###### **FileZilla 特性**

- 支持 FTP、FTP over SSL/TLS (FTPS) 和 SSH 文件传输协议 (SFTP)
- 跨平台，可以在 Windows、Linux、BSD、Mac OS X 等平台上运行
- 支持 IPv6
- 提供多种语言
- 支持大于 4GB 的大文件续传和传输
- 选项卡式用户界面
- 强大的站点管理器和传输队列
- 支持拖放
- 可配置限制传输速度
- 文件名过滤器
- 目录比较
- 网络配置向导
- 远程文件编辑
- 支持 HTTP/1.1、SOCKS5 和 FTP 代理
- 同步目录浏览
- 远程文件搜索

### 搭建环境

#### JDK

```shell
yum install -y java-1.8.0-openjdk

vim /etc/profile
export JAVA_HOME=/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.141-2.6.10.1.el7_3.x86_64
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar

source /etc/profile

java --version

```

#### Maven

```shell
cd ~/software/maven
# 下载maven
wget https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
# 解压下载的maven
tar -zxvf apache-maven-3.6.3-bin.tar.gz
# 配置环境变量 修改 /etc/profile，并重启使之生效。 
vim /etc/profile
## 修改配置
## 在文件末尾添加如下信息
export MAVEN_HOME=~/software/maven/apache-maven-3.6.1
export PATH=$PATH:$MAVEN_HOME/bin

## 重启环境变量，使之生效 
source /etc/profile

# 查看maven版本
mvn -v
```

#### Git

```shell
```

#### MySQL

#### Nginx

#### Redis

#### Node.js

```shell
# 确保您的 CentOS 7 系统是最新的
sudo yum update
# Node.js 可以通过包管理器 yum 进行安装。但是，CentOS 7 的默认仓库可能不包含最新版本的 Node.js。因此，我们需要添加 Node.js 的官方仓库。
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
## 上述命令将安装 Node.js 14.x 版本。如果您希望安装其他版本，可以将 14.x 替换为相应的版本号

# 执行以下命令以安装 Node.js：
sudo yum install nodejs

# 验证 会显示 Node.js 和 npm 的版本号
node -v
npm -v

# 查看node安装位置
which node
vim /etc/profile
## 设置环境变量
export PATH=$PATH:/usr/bin/nodejs
export PATH=$PATH:/usr/bin/npm

source /etc/profile
```

#### Tomcat

##### 安装 tomcat

```shell
sudo mkdir /usr/tomcat
cd /usr/tomcat

sudo yum install tomcat
```

`y` 在确认提示下回答安装 tomcat。这将安装 Tomcat 7 及其依赖项，例如 `Java`，它还将创建 `tomcat` 用户。

大多数重要的 Tomcat 文件都位于 `/usr/share/tomcat`。如果您已经有要运行的 Tomcat 应用程序，可以将其放在 `/usr/share/tomcat/webapps` 目录中，配置 Tomcat，然后重新启动 Tomcat 服务。

让我们快速更改 Tomcat 启动时使用的 Java 选项。打开 Tomcat 配置文件：

```shell
sudo vim /usr/share/tomcat/conf/tomcat.conf
```

将以下 `JAVA_OPTS` 行添加到该文件中。随意更改 `Xmx` 和 `MaxPermSize` 值 - 这些设置会影响 Tomcat 将使用的内存量：

```shell
JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom -Djava.awt.headless=true -Xmx512m -XX:MaxPermSize=256m -XX:+UseConcMarkSweepGC"
```

##### **安装管理包：**

刚开始使用 Apache Tomcat，您很可能希望安装一些管理工具来帮助您部署 Java 应用程序和管理虚拟主机。幸运的是，有些软件包将这些工具作为 Web 应用程序包含在内。

要安装默认的 Tomcat 根页（tomcat-webapps）以及 Tomcat Web 应用程序管理器和 Virtual Host Manager（tomcat-admin-webapps），请运行以下命令：

```shell
sudo yum install tomcat-webapps tomcat-admin-webapps 
```

在确认提示下回答 `y`。

这在 `tomcat/webapps` 目录增加了 `ROOT`，`examples`，`sample`，`manager`，和 `host-manager` 网络应用程序。

##### **安装在线文档（可选）**

如果要安装 Tomcat 文档，以便默认 Tomcat 页面上的所有链接都能正常工作，请运行以下命令：

```shell
sudo yum install tomcat-docs-webapp tomcat-javadoc
```

##### **配置 Tomcat Web 管理界面**

为了使用上一步中安装的管理器 webapp，我们必须向 Tomcat 服务器添加登录。我们将通过编辑 `tomcat-users.xml` 文件来完成此操作：

```shell
sudo vim /usr/share/tomcat/conf/tomcat-users.xml
```

您将需要添加可以访问 `manager-gui` 和 `admin-gui`（我们之前安装的管理界面）的用户。您可以通过定义类似于以下示例的用户来执行此操作。请务必将用户名和密码更改为安全的内容：

```xml
<tomcat-users>
    <user username="admin" password="password" roles="manager-gui,admin-gui"/>
</tomcat-users>
```

##### 启动 Tomcat

```shell
sudo systemctl start tomcat
# 重启
sudo systemctl restart tomcat
```

##### 启用 Tomcat 服务

如果您希望每次启动服务器时都运行 Tomcat，则需要启用该服务：

```shell
sudo systemctl enable tomcat
```

##### 访问 Web 界面

http://server_IP_address:8080

## 项目部署

### Vue 打包

#### 修改后台请求地址

需要将你前端的启动端口，全部改成后端项目的端口，保持一致，然后修改后端请求的 IP 地址。就是你服务器的 IP 地址或者域名。

- 修改 `vue.config.js`

#### 生成 dist 文件夹

- 拉代码
- 打包

```shell
npm run build
```

生成一个 `dist` 目录，其中包含一组静态文件，包括 HTML、CSS 和 JavaScript 文件。

#### 上传到服务器

将 dist 一整个文件上传至 Linux 中，创建一个目录，用于存放 dist 文件，记住存放地址，下面配置 Nginx 静态资源需要使用：

统一放到：`/usr/local/dt`

#### 修改 nginx 配置

由于 Nginx 服务器都部署在一台服务器上面，并且我们没有域名，也不做什么负载均衡，所以这里的配置就很简单，IP 就写本机，服务器本机即是 localhost，后面我们会有部署升级的文章，比如关于配置负载均衡、静态资源压缩、Https 证书等等。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412120022295.png)

- Vue 的静态资源文件路径：

```nginx
root   /usr/local/dt/dist; 
```

- Spring Boot 的接口地址：

```nginx
proxy_pass  http://localhost:9090/api/;
```

- 完整配置：

```nginx
server {
	listen       80;
	server_name  localhost;

	#前端页面
	location / {
		#Linux上的前端工程打包目录
		root   /usr/local/dt/dist; 
		#防止重定向页面刷新 路由失效
		try_files $uri $uri/ /index.html;
		index index.html index.htm;
	}
	
	#后台接口地址
	location /api/{
		 proxy_set_header Host $host;
		 proxy_set_header X-Real-IP $remote_addr;
		 proxy_set_header REMOTE-HOST $remote_addr;
		 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		 #填写你接口地址和端口，利用 nginx 反向代理进行服务转发
		 proxy_pass  http://localhost:9090/api/;
	}
}
```

- 更新 nginx 配置文件

```shell
nginx -s reload
```

### Spring Boot 打包

- 拉代码
- 打 jar 包

```shell
mvn package -DskipTests
```

Maven 将在项目目录下生成一个 `target` 目录，其中包含我们需要的可执行 JAR 文件

- 启动项目

```shell
java -jar ./自己打包出来的.jar --spring.profiles.active=prod
# 当然这么用的话，这个窗口就不能做任何事了,被这个命令占满了,按ctrl+c中断它

# SpringBoot程序，jar包后台运行
nohup  java  -jar  xxx.jar &


# 让它在后台运行
nohup java -jar ./自己打包出来的.jar --spring.profiles.active=prod &
## 如
nohup java -jar ./target/FCMHttpV1-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod &
```

- 如此我们便完成了后端项目的部署，最后需要自己去防火墙开放使用到的端口号

### 启动项目

#### 启动 nginx

```shell
nginx -s reload
```

### 启动 Spring Boot

```shell
# 推荐后台启动方式：
nohup java -jar cms-manage-1.0-SNAPSHOT.jar >online.log 2>&1 &
```

`online.log` 为启动试试日志，可通过 cat 命令进行查看。
