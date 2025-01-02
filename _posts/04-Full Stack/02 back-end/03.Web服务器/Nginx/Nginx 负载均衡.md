---
date created: 2024-12-10 00:13
date updated: 2024-12-26 00:15
tags:
  - '#配置负载均衡的服务器和端口'
  - '#设定mime类型,类型由mime.type文件定义'
  - '#设定日志格式'
  - '#设定负载均衡的服务器列表'
  - '#weigth参数表示权值，权值越高被分配到的几率越大'
  - '#HTTP服务器'
  - '#侦听80端口'
  - '#定义使用www.xx.com访问'
  - '#对所有请求进行负载均衡请求'
  - '#定义服务器的默认网站根目录位置'
  - '#定义首页索引文件的名称'
  - '#以下是一些反向代理的配置(可选择性配置)'
  - '#proxy_redirect'
  - '#后端的Web服务器可以通过X-Forwarded-For获取用户真实IP'
  - '#nginx跟后端服务器连接超时时间(代理连接超时)'
  - '#后端服务器数据回传时间(代理发送超时)'
  - '#连接成功后，后端服务器响应时间(代理接收超时)'
  - '#设置代理服务器（nginx）保存用户头信息的缓冲区大小'
  - '#proxy_buffers缓冲区，网页平均在32k以下的话，这样设置'
  - '#高负荷下缓冲大小（proxy_buffers*2）'
  - '#设定缓存文件夹大小，大于这个值，将从upstream服务器传'
  - '#允许客户端请求的最大单文件字节数'
  - '#缓冲区代理缓冲用户端请求的最大字节数'
dg-publish: true
---

# 负载均衡

## 什么是负载均衡？

简单来说就是使用分布式的场景，将原先的一台服务器做成一个集群，然后将请求分发到各个服务器上，但是，如何将请求每次转发到不同的服务器呢，Nginx 就可以做到。原来我们都是直接访问服务器，现在我们可以使用 Nginx 进行反向代理，然后我们访问 Nginx，**由 Nginx 将我们的请求分发到不同的服务器上，以实现负载均衡**。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412110014398.png)

## 配置

`实现：`

> 访问 <http://192.168.80.102:80/edu/test.html，Nginx> 将请求分配到 8081 和 8082 两台 tomcat 服务器上。
> `1、开启两台tomcat`
> 分别在 webapps 下的 edu 下编写一个 test.html，文件内容可以不一致，为了明显看到[负载均衡](https://cloud.tencent.com/product/clb?from_column=20065&from=20065)的效果
> `2、配置文件`

```shell
# 在http块中的全局块中配置
# upstream固定写法 后面的myserver可以自定义
upstream myserver {
    server 192.168.80.102:8081;
    server 192.168.80.102:8082;
}

# server配置
server {
	  # 监听80端口
	listen 80;   
	 # location块
	location / {
		# 反向代理到上面的两台服务器 写上自定义的名称
		proxy_pass http://myserver;
	}
}
```

访问 <http://192.168.80.102:80/edu/test.html> 时，可以分发到 8081 和 8082 两台服务器，测试成功。

## 负载均衡规则

### 轮询 (默认)

**每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除**

### weight 权重

**weight** **代表权重默认为 1, 权重越高被分配的客户端越多**

```shell
upstream myserver { 
	server 192.168.80.102:8081 weight=1 ;
	server 192.168.80.102:8082 weight=2 ;
}
server {  
    listen 80;  
    location / {
	    proxy_pass http://myserver; 
	}
```

### ip_hash

**每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 问题**

```shell
#配置负载均衡的服务器和端口
upstream myserver { 
	server 192.168.80.102:8081;
	server 192.168.80.102:8082;
    ip_hash;
}
server {  
    listen 80;  
    location / {
		proxy_pass http://myserver; 
	}
}
```

### fair

**按后端服务器的响应时间来分配请求**，响应时间短的优先分配。

```shell
# 配置负载均衡的服务器和端口
upstream myserver {   
	server 192.168.80.102:8081;
	server 192.168.80.102:8082;
    fair;
}
server {  
    listen 80;   
    location / {
	    proxy_pass http://myserver; 
    }    
}
```

## 负载均衡案例

假设这样一个应用场景：将应用部署在 192.168.1.11:80、192.168.1.12:80、192.168.1.13:80 三台 linux 环境的服务器上。网站域名叫 [www.helloworld.com，公网](http://www.helloworld.com，公网) IP 为 192.168.1.11。在公网 IP 所在的服务器上部署 nginx，对所有请求做负载均衡处理（下面例子中使用的是加权轮询策略）。

`/etc/nginx/nginx.conf` 配置如下：

```shell
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;

    #设定负载均衡的服务器列表
    upstream load_balance_server {
        #weigth参数表示权值，权值越高被分配到的几率越大
        server 192.168.1.11:80   weight=5;
        server 192.168.1.12:80   weight=1;
        server 192.168.1.13:80   weight=6;
    }

   #HTTP服务器
   server {
        #侦听80端口
        listen       80;

        #定义使用www.xx.com访问
        server_name  www.helloworld.com;

        #对所有请求进行负载均衡请求
        location / {
            root        /root;                 #定义服务器的默认网站根目录位置
            index       index.html index.htm;  #定义首页索引文件的名称
            proxy_pass  http://load_balance_server ;#请求转向load_balance_server 定义的服务器列表

            #以下是一些反向代理的配置(可选择性配置)
            #proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_connect_timeout 90;          #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_send_timeout 90;             #后端服务器数据回传时间(代理发送超时)
            proxy_read_timeout 90;             #连接成功后，后端服务器响应时间(代理接收超时)
            proxy_buffer_size 4k;              #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k;               #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
            proxy_busy_buffers_size 64k;       #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k;    #设定缓存文件夹大小，大于这个值，将从upstream服务器传

            client_max_body_size 10m;          #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k;      #缓冲区代理缓冲用户端请求的最大字节数
        }
    }
}
```

### 轮询

```shell
upstream bck_testing_01 {
  # 默认所有服务器权重为 1
  server 192.168.250.220:8080
  server 192.168.250.221:8080
  server 192.168.250.222:8080
}
```

### 加权轮询

```shell
upstream bck_testing_01 {
  server 192.168.250.220:8080   weight=3
  server 192.168.250.221:8080              # default weight=1
  server 192.168.250.222:8080              # default weight=1
}
```

### 最少连接

```shell
upstream bck_testing_01 {
  least_conn;

  # with default weight for all (weight=1)
  server 192.168.250.220:8080
  server 192.168.250.221:8080
  server 192.168.250.222:8080
}
```

### 加权最少连接

```shell
upstream bck_testing_01 {
  least_conn;

  server 192.168.250.220:8080   weight=3
  server 192.168.250.221:8080              # default weight=1
  server 192.168.250.222:8080              # default weight=1
}
```

### IP Hash

```shell
upstream bck_testing_01 {

  ip_hash;

  # with default weight for all (weight=1)
  server 192.168.250.220:8080
  server 192.168.250.221:8080
  server 192.168.250.222:8080

}
```

### 普通 Hash

```shell
upstream bck_testing_01 {

  hash $request_uri;

  # with default weight for all (weight=1)
  server 192.168.250.220:8080
  server 192.168.250.221:8080
  server 192.168.250.222:8080

}
```
