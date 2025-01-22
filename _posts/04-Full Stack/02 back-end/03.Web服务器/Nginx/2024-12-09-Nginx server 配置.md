---
date_created: Monday, December 9th 2024, 12:35:40 am
date_updated: Wednesday, January 22nd 2025, 11:35:50 pm
title: Nginx server 配置
author: hacket
categories:
  - back-end
category: Web服务器
tags: [nginx]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: Tuesday, December 10th 2024, 12:02:00 am
date updated: Friday, January 17th 2025, 11:07:32 pm
image-auto-upload: true
feed: show
format: list
aliases: [Nginx 反向代理]
linter-yaml-title-alias: Nginx 反向代理
---

# Nginx 反向代理

## **正向代理与反向代理概述**

### 正向代理

- 正向代理代理的是客户端，需要在客户端配置，我们访问的还是 `真实的服务器地址`

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412100011476.png)

### 反向代理

- 反向代理代理的是 `服务器端`，客户端不需要任何配置，`客户端只需要将请求发送给反向代理服务器即可`，代理服务器将请求分发给真实的服务器，获取数据后将数据转发给你。隐藏了真实服务器，有点像网关。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412100012393.png)

### 区别与总结

`最根本的区别是代理的对象不同`

- 正向代理代理的是 `客户端`，需要为每一个客户端都做一个代理服务器，`客户端访问的路径是目标服务器`
- 反向代理代理的是 `真实服务器`，客户端不需要做任何的配置，`访问的路径是代理服务器`，由代理服务器将请求转发到真实服务器

## 配置

### 应用一

实现效果访问 <http://192.168.80.102:80>(Nginx> 首页), 最终代理到 <http://192.168.80.102:8080>(Tomcat> 首页)

首先启动一台 Tomcat 服务器 (已经安装了 Tomcat)

进入 Tomcat 的 `安装目录下的bin目录下`，使用 `./startup.sh` 命令，启动 Tomcat

> 在 Nginx 的配置文件中进行配置

**1、新建一个 server 块，在 server 全局块中配置监听 80 端口**
**2、在 location 块中配置 / 路径请求代理到 tomcat 的地址**

```shell
# /etc/nginx/nginx.conf
server {
	# 监听端口80 即当访问服务器的端口是80时，进入这个server块处理
	listen 80;
	# server_name当配置了listen时不起作用        
	server_name localhost;
	# location后面代表访问路径 当是/ 请求时 代理到tomcat的地址
	location / {
		# 使用 proxy_pass（固定写法）后面跟要代理服务器地址            
		proxy_pass http://192.168.80.102:8080;
	}
}
```

上面三个配置的含义就是 ，当访问 Linux 的 <http://192.168.80.102:80> 这个地址时，由于配置 Nginx 监听的是 80 端口，所以会进入这个 server 块进行处理，然后看你的访问路径，根据 `location` 块配置的不同路径进入对应的处理，由于配置了 `/` 请求，所以进入 / 的 location 处理，然后配置了 `proxy_pass`，所以进行代理到指定的路径。

经过测试，当输入 `http://192.168.80.102:80` 时，Nginx 给我们代理到了 Tomcat，所以显示了 Tomcat 的页面，即配置成功

### 应用二

> 应用一访问的是 `/` 路径，给我们代理到指定的服务器。

应用二实现：

- 让 Nginx 监听 9001 端口
- 我们实现当访问 <http://192.168.80.102:9001/edu(Nginx> 地址) 时，nginx 给我们代理到 <http://192.168.80.102:8081>
- 当访问 <http://192.168.80.102:9001/vod> 时，nginx 给我们代理到 <http://192.168.80.102:8082>

启动两个 Tomcat 服务器：

- 端口分别是 8081 和 8082，
- 在 8001 的服务器的 webapps 下创建一个 edu 目录，编写一个 test.html
- 在 8002 的服务器的 webapps 下创建一个 vod 目录，编写一个 test.html

> 由于虚拟机的 ip 是 192.168.80.102，所以保证访问 <http://192.168.80.102:8081/edu/test.html> 和 <http://192.168.80.102:8082/vod/test.html> 都可以成功访问

**配置 nginx.conf：**

```shell
# /etc/nginx/nginx.conf
server {
	# 监听9001端口
	listen  9001;
	# 进行路径匹配，匹配到edu代理到8081
	location ~/edu/ {
		proxy_pass http://192.168.80.102:8081;
	}
	# 进行路径匹配，匹配到vod代理到8082
	location ~/vod/ {
		proxy_pass http://192.168.80.102:8082;
	}
}
```

### HTTP 反向代理完整配置

```shell
#运行用户
#user somebody;

#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志
error_log  D:/Tools/nginx-1.10.1/logs/error.log;
error_log  D:/Tools/nginx-1.10.1/logs/notice.log  notice;
error_log  D:/Tools/nginx-1.10.1/logs/info.log  info;

#PID文件，记录当前启动的nginx的进程ID
pid        D:/Tools/nginx-1.10.1/logs/nginx.pid;

#工作模式及连接数上限
events {
    worker_connections 1024;    #单个后台worker process进程的最大并发链接数
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
    #设定mime类型(邮件支持类型),类型由mime.types文件定义
    include       D:/Tools/nginx-1.10.1/conf/mime.types;
    default_type  application/octet-stream;

    #设定日志
	log_format  main  '[$remote_addr] - [$remote_user] [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log    D:/Tools/nginx-1.10.1/logs/access.log main;
    rewrite_log     on;

    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    keepalive_timeout  120;
    tcp_nodelay        on;

	#gzip压缩开关
	#gzip  on;

    #设定实际的服务器列表
    upstream zp_server1{
        server 127.0.0.1:8089;
    }

    #HTTP服务器
    server {
        #监听80端口，80端口是知名端口号，用于HTTP协议
        listen       80;

        #定义使用www.xx.com访问
        server_name  www.helloworld.com;

		#首页
		index index.html

		#指向webapp的目录
		root D:\01_Workspace\Project\github\zp\SpringNotes\spring-security\spring-shiro\src\main\webapp;

		#编码格式
		charset utf-8;

		#代理配置参数
        proxy_connect_timeout 180;
        proxy_send_timeout 180;
        proxy_read_timeout 180;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarder-For $remote_addr;

        #反向代理的路径（和upstream绑定），location 后面设置映射的路径
        location / {
            proxy_pass http://zp_server1;
        }

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            root D:\01_Workspace\Project\github\zp\SpringNotes\spring-security\spring-shiro\src\main\webapp\views;
            #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status           on;
            access_log            on;
            auth_basic            "NginxStatus";
            auth_basic_user_file  conf/htpasswd;
        }

        #禁止访问 .htxxx 文件
        location ~ /\.ht {
            deny all;
        }

		#错误处理页面（可选择性配置）
		#error_page   404              /404.html;
		#error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        # }
    }
}
```

### HTTPS 反向代理

```shell
  #HTTP服务器
  server {
      #监听443端口。443为知名端口号，主要用于HTTPS协议
      listen       443 ssl;

      #定义使用www.xx.com访问
      server_name  www.helloworld.com;

      #ssl证书文件位置(常见证书文件格式为：crt/pem)
      ssl_certificate      cert.pem;
      #ssl证书key位置
      ssl_certificate_key  cert.key;

      #ssl配置参数（选择性配置）
      ssl_session_cache    shared:SSL:1m;
      ssl_session_timeout  5m;
      #数字签名，此处使用MD5
      ssl_ciphers  HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers  on;

      location / {
          root   /root;
          index  index.html index.htm;
      }
  }
```

## server_name 作用及访问流程

客户端通过域名访问服务器时会将域名与被解析的 ip 一同放在请求中。当请求到了 nginx 中时。`nginx会先去匹配ip，如果listen中没有找到对应的ip，就会通过域名进行匹配`，匹配成功以后，再匹配端口。当这三步完成，就会找到对应的 server 的 location 对应的资源。

# Nginx 动静分离

## 什么是动静分离？

- 将静态资源 css html js 等和动态资源 (jsp servlet) 进行分开部署，`我们可以将静态资源直接部署在专门的服务器上，也可以直接放在反向代理服务器上(Nginx)所在在的服务器上` 然后动态资源还是部署在服务器上，如 tomcat。
- 然后请求来的时候，静态资源从专门的静态资源服务器获取，动态资源还是转发到后端服务器上。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412100022762.png)

## 配置

> **准备工作：在 Linux 的根目录下 / 的 staticResource 目录下创建两个文件夹，分别是 www 和 image，在 www 目录下创建一个 okc.html, 在 image 目录下放一张 ttt.jpg**

实现效果，访问 <http://192.168.80.102:80/www/okc.html> 和 <http://192.168.80.102:80/image/ttt.img> 时可以成功访问资源

```shell
# /etc/nginx/nginx.conf
server {
	listen       80;
    # 当访问路径带了www时，进入这个location处理，去/staticResource目录下对应的www目录     去找okc.html
	# 即最终实现访问到这个路径
	#  http://192.168.80.102:80/staticResource/www/okc.html
	location /www/{
		root   /staticResource/;
		index  index.html index.htm;
	}
	# 跟上面一样
	location /image/{
		root  /staticResource/;
	}   
}
```

### root 与 alias 区别与访问路径

- alias 实际访问文件路径不会拼接 URL 中的路径
- root 实际访问文件路径会拼接 URL 中的路径

**示例：alias**

```shell
# /etc/nginx/nginx.conf
location ^~ /sta/ {  
   alias /usr/local/nginx/html/static/;  
}
```

- 请求：<http://test.com/sta/sta1.html>
- 实际访问：**/usr/local/nginx/html/static/sta1.html** 文件

**示例：root**

```shell
# /etc/nginx/nginx.conf
location ^~ /tea/ {  
   root /usr/local/nginx/html/;  
}
```

- 请求：<http://test.com/tea/tea1.html>
- 实际访问：**/usr/local/nginx/html/`tea`/tea1.html** 文件
