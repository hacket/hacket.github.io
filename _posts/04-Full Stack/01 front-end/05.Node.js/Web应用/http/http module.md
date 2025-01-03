---
date created: 2024-12-25 23:57
date updated: 2024-12-25 23:57
dg-publish: true
---

# http

## 使用 http 创建 Web 服务器

http模块提供的request和response对象。

- request对象封装了HTTP请求，我们调用request对象的属性和方法就可以拿到所有HTTP请求的信息；
- response对象封装了HTTP响应，我们操作response对象的方法，就可以把HTTP响应返回给浏览器。

示例：简易http服务器

```javascript
'use strict';

// 导入http模块:
var http = require('http');

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response:
    response.end('<h1>Hello world!</h1>');
});

// 让服务器监听8080端口:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
```

跑起来`node http_server.js`，在浏览器输入<http://127.0.0.1:8080/，能看到`Hello> World!`的内容

## 使用 http 创建 Web 客户端

```javascript
'use strict';

var http = require('http');

var options = {
    host:'127.0.0.1',
    port:12345,
    path:'/onelink.html',
};

var callback = function(response){
    // 不断更新数据
    var body = '';
    response.on('data', function(data){
        body += data;
    });
    // 数据接收完成
    response.on('end', function(){
        console.log(body);
    });
}

var req = http.request(options, callback);
req.end();
```

执行命令：`node http_client.js`能获取到./onelink.html中的内容

## 示例

### 实现简易http服务器

```javascript
'use strict';

var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

console.log("args=: " + process.argv);

// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建服务器:
var server = http.createServer(function (request, response) {
    // 获得URL的path，类似 '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    var filepath = path.join(root, pathname);
    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});
```

执行node命令：node file_server.js onelink/<br />即root目录是当前file_server.js所在目录的子目录onelink<br />测试：<http://127.0.0.1:8080/onelink.html>

# url模块

## parse

可以使用 url.parse 方法来解析 URL 中的参数

```javascript
'use strict';
var url = require('url');
console.log(url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash'));
```

结果：

> Explain
> Url {
> protocol: 'http:',
> slashes: true,
> auth: 'user:pass',
> host: 'host.com:8080',
> port: '8080',
> hostname: 'host.com',
> hash: '#hash',
> search: '?query=string',
> query: 'query=string',
> pathname: '/path/to/file',
> path: '/path/to/file?query=string',
> href: '<http://user:pass@host.com:8080/path/to/file?query=string#hash>' }

###
