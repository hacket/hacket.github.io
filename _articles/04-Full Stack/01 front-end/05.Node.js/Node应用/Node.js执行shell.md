---
date created: 2024-12-25 23:57
date updated: 2024-12-25 23:57
dg-publish: true
tags:
  - '#!/bin/bash'
---

# `child_process`（原生）

Nodejs下引入模块`child_process`实现调用shell<br>调用的两种方式

```javascript
child_process.exec(command[, options][, callback])
child_process.execFile(file[, args][, options][, callback])
```

Nodejs中通过 exec执行shell脚本，并打印查询到的信息

```
Explainvar child = require('child_process');

child.exec('ls', function(err, sto) {
    console.log(sto);//sto才是真正的输出，要不要打印到控制台，由你自己啊
})
```

执行文件

```javascript
const exec = require('child_process').execSync
exec('bash ./shell/shell1.sh hello')
```

对应的shell文件

```javascript
#!/bin/bash
# This is our first script.
echo "$1" > log.txt
```

示例

```javascript
const util = require('util');
const path = require('path');
const child_process = require('child_process');
// 调用util.promisify方法，返回一个promise,如const { stdout, stderr } = await exec('rm -rf build')
const exec = util.promisify(child_process.exec);
const appPath = path.join(__dirname, 'app');

const runClean = async function () {
  // cwd指定子进程的当前工作目录 这里的rm -rf build为删除指定目录下的一个文件夹
  await exec(`rm -rf build`, {
    cwd: appPath
  });
  await exec(`rm -rf test`, {
    cwd: appPath
  });
}
runClean();
```

注意<br>util.promisify是在node.js 8.x版本中新增的一个工具，用于将老式的Error first callback转换为Promise对象，让老项目改造变得更为轻松。

# shelljs（三方）

shelljs是j基于nodeAPI的一个扩展，要引入插件：（[npm地址](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fshelljs&source=article&objectId=1812689)）；<br>它比原生的child_process的兼容性更好，使用更灵活，这个插件的使用率很高。

# simple-git（GIT）

执行shell脚本操作git，其实对于复杂的git命令语句，写起来还是很不方便，最后介绍一个专为git设计的插件：simple-git([npm地址](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsimple-git&source=article&objectId=1812689))

1. 在项目中引入插件后，调用simple-git/promise可执行异步git操作，方便结合async/await使用
2. 它封装并支持了很多git的方法，比如clone、commit、status、pull等等，将cmd命令和参数，传入即可
3. 甚至可以用git.raw(),解析前端输入的git命令

<https://github.com/steveukx/git-js>
