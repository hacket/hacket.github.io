---
date created: 2024-12-25 23:54
date updated: 2024-12-25 23:54
dg-publish: true
---

# 什么是流？

我们也可以把数据看成是数据流，比如你敲键盘的时候，就可以把每个字符依次连起来，看成字符流。这个流是从键盘输入到应用程序，实际上它还对应着一个名字：`标准输入流（stdin）`。<br>如果应用程序把字符一个一个输出到显示器上，这也可以看成是一个流，这个流也有名字：`标准输出流（stdout）`。流的特点是数据是有序的，而且必须依次读取，或者依次写入，不能像Array那样随机定位。<br>在Node.js中，流也是一个对象，我们只需要响应流的事件就可以了：`data`事件表示流的数据已经可以读取了，`end`事件表示这个流已经到末尾了，没有数据可以读取了，`error`事件表示出错了。

![|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1700962841792-db45b5df-6549-4eac-ac28-efb05d58af64.png#averageHue=%23f2f2f2&clientId=u4f28c632-203e-4&from=paste&id=u7e6693f8&originHeight=241&originWidth=248&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u3a9a1f4f-fc63-494d-9c5a-723d4c9f666&title=)

# Stream

Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。<br>Node.js，Stream 有四种流类型：

- Readable - 可读操作
- Writable - 可写操作
- Duplex - 可读可写操作
- Transform - 操作被写入数据，然后读出结果

所有的 Stream 对象都是 `EventEmitter` 的实例。常用的事件有：

- data - 当有数据可读时触发
- end - 没有更多的数据可读时触发
- error - 在接收和写入过程中发生错误时触发
- finish - 所有数据已被写入到底层系统时触发

## 从流中读数据

```javascript
var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");

```

## 写数据

```javascript
'use strict';

var fs = require("fs");
var data = 'xxxxxxx';

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data, 'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> finish、error
writerStream.on('finish', function () {
    console.log("写入完成。");
});

writerStream.on('error', function (err) {
    console.log(err.stack);
});

console.log("程序执行完毕");
```

# pipe 管道

管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。<br>![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1700963894740-f096098c-9f4c-43a1-9c25-fccfba3c2dc1.png#averageHue=%23fcfcfc&clientId=u4f28c632-203e-4&from=paste&height=228&id=ue974d34d&originHeight=550&originWidth=565&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=42646&status=done&style=stroke&taskId=u28847b5b-0240-4cf6-84e1-18b0660d0a7&title=&width=234.66668701171875)

> 如上面的图片所示，我们把文件比作装水的桶，而水就是文件里的内容，我们用一根管子(pipe)连接两个桶使得水从一个桶流入另一个桶，这样就慢慢的实现了大文件的复制过程。

pipe就像可以把两个水管串成一个更长的水管一样，两个流也可以串起来。一个Readable流和一个Writable流串起来后，所有的数据自动从Readable流进入Writable流，这种操作叫pipe。<br>在Node.js中，Readable流有一个`pipe()`方法，就是用来干这件事的。

示例：用pipe()把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，所以，这实际上是一个复制文件的程序：

```typescript
'use strict';

var fs = require('fs');

var input = fs.createReadStream('sample.txt');
var output = fs.createWriteStream('output.txt');

input.pipe(output);
```

默认情况下，当Readable流的数据读取完毕，end事件触发后，将自动关闭Writable流。如果我们不希望自动关闭Writable流，需要传入参数：

```typescript
readable.pipe(writable, { end: false });
```

## 链式流

链式是通过连接输出流到另外一个流并创建多个流操作链的机制。链式流一般用于管道操作。<br>示例：用管道和链式来压缩和解压文件。

```javascript
var fs = require("fs");
var zlib = require('zlib');

// 压缩 input.txt 文件为 input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
  
console.log("文件压缩完成。");
```

> 执行完以上操作后，我们可以看到当前目录下生成了 input.txt 的压缩文件 input.txt.gz。

解压文件：

```javascript
var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));
  
console.log("文件解压完成。");
```
