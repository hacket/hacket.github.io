---
date created: 2024-12-08 19:43
tags:
  - '#包的名字'
  - '#包的版本'
  - '#包的描述'
  - '#包的入口文件'
  - '#脚本配置'
  - '#作者'
  - '#开源证书'
date updated: 2024-12-25 23:53
dg-publish: true
---

# npm入门

## 什么是npm？

npm 是 Node.js 的标准包管理器。新版的node.js已经集成了npm。可以通过输入 `npm -v` 来测试是否成功安装；如果你安装的是旧版本的 npm，可以很容易得通过 npm 命令来升级，命令如下：

```shell
sudo npm install npm -g

# 如果是 Window 系统使用以下命令即可：
npm install npm -g
```

## npm init

```shell
npm init
```

> 通过`npm init`命令为你的应用创建一个`package.json`文件，该命令要求你输入几个参数，例如此应用的名称、版本号、描述、指定的入口文件，你可以直接按回车键接受大部分默认设置即可。

npm init 命令的作用是将文件夹初始化为一个包，交互式创建 package.json 文件。 package.json 文件是包的配置文件，每个包都必须要有， package.json 文件内容：

```javascript
{
    "name": "1-npm", #包的名字
    "version": "1.0.0", #包的版本
    "description": "", #包的描述
    "main": "index.js", #包的入口文件
    "scripts": { #脚本配置
    "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "", #作者
    "license": "ISC" #开源证书
}
```

## npm安装模块 npm install

npm 安装 Node.js 模块语法格式如下：`npm install <Module Name>`

示例：使用 npm 命令安装常用的 Node.js web框架模块 express:

```bash
npm install express
# npm在哪个目录下执行命令，node_modules目录就在哪生成
```

安装好之后，express 包就放在了工程目录下的 node_modules 目录中，因此在代码中只需要通过 require('express') 的方式就好，无需指定第三方包路径。

```javascript
var express = require('express');
```

### 全局安装与本地安装

npm 的包安装分为本地安装（local）、全局安装（global）两种，从敲的命令行来看，差别只是有没有`-g`而已，比如：

```shell
npm install express          # 本地安装
npm install express -g   # 全局安装
```

如果出现以下错误：

> npm err! Error: connect ECONNREFUSED 127.0.0.1:8087

解决办法为：

> npm config set proxy null

#### 本地安装

1. 将安装包放在 `node_modules` 下（**运行 npm 命令时所在的目录**），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。
2. 可以通过 `require()` 来引入本地安装的包。

#### 全局安装

1. 将安装包放在 `/usr/local`（Windows下的`$HOME\AppData\Roaming\npm`） 下或者你 node 的安装目录
2. 可以直接在命令行里使用。

### npm install -S/-D/-g区别

主要区别就是依赖配置写入`package.json`文件的位置不同而已；

`npm install` 本身就有一个别名 `npm i`

#### -S --save

语法：`  npm i module_name -S

即  npm install module_name --save     写入dependencies，发布到生产环境

> 这样安装是局部安装的，会写进package.json文件中的dependencie里。
> dependencies： 表示生产环境下的依赖管理；
> 说白了你安装一个库如果是用来构建你的项目的，比如echarts、element-ui，是实际在项目中起作用，就可以使用 -s 来安装

#### -D --save-dev

语法：`npm i module_name -D`

即  npm install module_name --save-dev  写入devDependencies，发布到开发环境

> 这样安装是局部安装的，会写进package.json文件中的devDependencies 里。
> devDependencies ：表示开发环境下的依赖管理
> 如果你安装的库是用来打包的、解析代码的，比如webpack、babel，就可以用 -d 来安装，项目上线了，这些库就没用了

#### -g --global?

语法：`npm i module_name -g`

即  global全局安装(命令行使用)

`npm install module_name -g`，表示全局安装，安装一次过后，你就可在其他地方直接用啦

#### 不加参数

`npm i module_name` 即  本地安装(将安装包放在当前目录下的 `node_modules` 目录下)

npm5 开始通过 npm install module_name 什么都不加 和 npm install module_name --save一样，都是局部安装并会把模块自动写入package.json中的dependencies里。

> 注意：-D，-S 分别是 --save-dev和 --save的简写，默认就是 -S，可以省略不写

## 查看安装信息 list

```shell
npm list -g # 查看所有全局安装的模块
```

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1701277963645-a90c8d9a-22f2-4708-a4f3-4e8b1affd46a.png#averageHue=%23171717&clientId=u0b86169a-ba5f-4&from=paste&height=94&id=u8983ecdf&originHeight=141&originWidth=504&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3609&status=done&style=stroke&taskId=u867620ff-2c87-48f1-80ac-5d288eb7977&title=&width=336)

如果要查看某个模块的版本号，可以使用命令如下：`npm list xxx`
![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1701278003783-b3063b06-15f4-4dd5-8dc2-774fa361d0fb.png#averageHue=%23151515&clientId=u0b86169a-ba5f-4&from=paste&height=79&id=uc50e601b&originHeight=118&originWidth=343&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=2149&status=done&style=stroke&taskId=u9dba5108-77be-49bc-bd2c-bef1580b91b&title=&width=228.66666666666666)

## package.json文件

package.json 位于模块的目录下，用于定义包的属性，以express模块的pakage.json来看：

```json
{
  "name": "express",
  "description": "Fast, unopinionated, minimalist web framework",
  "version": "4.18.2",
  "author": "TJ Holowaychuk <tj@vision-media.ca>",
  "contributors": [
    "Aaron Heckmann <aaron.heckmann+github@gmail.com>",
    "Ciaran Jessup <ciaranj@gmail.com>",
    "Douglas Christopher Wilson <doug@somethingdoug.com>",
    "Guillermo Rauch <rauchg@gmail.com>",
    "Jonathan Ong <me@jongleberry.com>",
    "Roman Shtylman <shtylman+expressjs@gmail.com>",
    "Young Jae Sim <hanul@hanul.me>"
  ],
  "license": "MIT",
  "repository": "expressjs/express",
  "homepage": "http://expressjs.com/",
  "keywords": [
    "express",
    "framework",
    "sinatra",
    "web",
    "http",
    "rest",
    "restful",
    "router",
    "app",
    "api"
  ],
  "dependencies": {
    "accepts": "~1.3.8",
    "array-flatten": "1.1.1",
    "body-parser": "1.20.1",
    "content-disposition": "0.5.4",
    "content-type": "~1.0.4",
    "cookie": "0.5.0",
    "cookie-signature": "1.0.6",
    "debug": "2.6.9",
    "depd": "2.0.0",
    "encodeurl": "~1.0.2",
    "escape-html": "~1.0.3",
    "etag": "~1.8.1",
    "finalhandler": "1.2.0",
    "fresh": "0.5.2",
    "http-errors": "2.0.0",
    "merge-descriptors": "1.0.1",
    "methods": "~1.1.2",
    "on-finished": "2.4.1",
    "parseurl": "~1.3.3",
    "path-to-regexp": "0.1.7",
    "proxy-addr": "~2.0.7",
    "qs": "6.11.0",
    "range-parser": "~1.2.1",
    "safe-buffer": "5.2.1",
    "send": "0.18.0",
    "serve-static": "1.15.0",
    "setprototypeof": "1.2.0",
    "statuses": "2.0.1",
    "type-is": "~1.6.18",
    "utils-merge": "1.0.1",
    "vary": "~1.1.2"
  },
  "devDependencies": {
    "after": "0.8.2",
    "connect-redis": "3.4.2",
    "cookie-parser": "1.4.6",
    "cookie-session": "2.0.0",
    "ejs": "3.1.8",
    "eslint": "8.24.0",
    "express-session": "1.17.2",
    "hbs": "4.2.0",
    "marked": "0.7.0",
    "method-override": "3.0.0",
    "mocha": "10.0.0",
    "morgan": "1.10.0",
    "multiparty": "4.2.3",
    "nyc": "15.1.0",
    "pbkdf2-password": "1.2.1",
    "supertest": "6.3.0",
    "vhost": "~3.0.2"
  },
  "engines": {
    "node": ">= 0.10.0"
  },
  "files": [
    "LICENSE",
    "History.md",
    "Readme.md",
    "index.js",
    "lib/"
  ],
  "scripts": {
    "lint": "eslint .",
    "test": "mocha --require test/support/env --reporter spec --bail --check-leaks test/ test/acceptance/",
    "test-ci": "nyc --reporter=lcovonly --reporter=text npm test",
    "test-cov": "nyc --reporter=html --reporter=text npm test",
    "test-tap": "mocha --require test/support/env --reporter tap --check-leaks test/ test/acceptance/"
  }
}
```

### package.json 属性说明

- name - 包名。
- version - 包的版本号。
- description - 包的描述。
- homepage - 包的官网 url 。
- author - 包的作者姓名。
- contributors - 包的其他贡献者姓名。
- dependencies - 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。
- devDependencies 开发阶段的依赖，不打包进去
- repository - 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。
- main - main 字段指定了程序的主入口文件，`require('moduleName')` 就会加载这个文件。这个字段的默认值是模块根目录下面的 `index.js`。
- keywords - 关键字

### scripts

可以通过配置 package.json 中的 scripts 属性来启动项目

```json
{
    "scripts": {
        "server": "node server.js",
        "start": "node index.js",
    },
}
```

配置完成之后，执行命令启动项目：

> npm run server
> npm run start

不过 start 比较特别，使用时可以省略 run

> npm start

npm run 有自动向上级目录查找的特性，跟 require 函数一样

### devDependencies与dependencies有什么区别呢？

- devDependencies  表示 开发环境 下的依赖管理，里面的插件只用于开发环境（开发时依赖），不用于生产环境，例如vite、sass插件等(打包后就跟他没关系了)；
- dependencies 表示 生产环境 下的依赖管理，里面的插件只用于生产环境（运行时依赖），是需要发布到生产环境的，例如vue、element-plus等等。

## 卸载模块 uninstall

> npm uninstall express

卸载后，你可以到 /node_modules/ 目录下查看包是否还存在，或者使用以下命令查看：

> npm ls

## 更新模块 update

> $ npm update express

## 搜索模块 search

> $ npm search express

## 创建模块 init

创建模块，package.json 文件是必不可少的。我们可以使用 NPM 生成 package.json 文件，生成的文件包含了基本的结果。

- 按照提示来输入基本信息，在最后输入 "yes" 后会生成 package.json 文件。

```shell
npm init
```

- 在 npm 资源库中注册用户（使用邮箱注册）：

```shell
npm adduser
```

- 发布模块

```shell
npm publish
```

## 版本号

NPM 使用`语义版本号`来管理代码：语义版本号分为`X.Y.Z`三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。

- 如果只是修复bug，需要更新Z位。
- 如果是新增了功能，但是向下兼容，需要更新Y位。
- 如果有大变动，向下不兼容，需要更新X位。

版本号有了这个保证后，在申明第三方包依赖时，除了可依赖于一个固定版本号外，还可依赖于某个范围的版本号。例如`"argv": "0.0.x"`表示依赖于`0.0.x`系列的最新版argv。

NPM支持的所有版本号范围指定方式可以查看官方文档。

## NPM 常用命令

- NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。
- 使用`npm help <command>`可查看某条命令的详细帮助，例如npm help install。
- 在package.json所在目录下使用`npm install` . `-g`可先在本地安装当前命令行程序，可用于发布前的本地测试。
- 使用`npm update <package>`可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。
- 使用`npm update <package> -g`可以把全局安装的对应命令行程序更新至最新版。
- 使用`npm cache clear`可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。
- 使用`npm unpublish <package>@<version>`可以撤销发布自己发布过的某个版本代码。

## cnpm 淘宝npm镜像

### 安装cnpm

由于国内直接使用 npm 的官方镜像是非常慢的，这里推荐使用淘宝 NPM 镜像。<br />淘宝 NPM 镜像是一个完整 npmjs.org 镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。<br />可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm：

> ~~npm install -g cnpm --registry=<https://registry.npm.taobao.org>~~ 过时了
> // 或者
> npm install -g cnpm --registry=<https://registry.npmmirror.com>

然后使用cnpm install命令来安装模块，速度就很快了。

> cnpm替换到npm即可

原来的 [https://registry.npm.taobao.org](https://link.zhihu.com/?target=http%3A//registry.npm.taobao.org "https://registry.npm.taobao.org") 已替换为 [https://registry.npmmirror.com](https://link.zhihu.com/?target=http%3A//registry.npmmirror.com "https://registry.npmmirror.com") ，最新的配置淘宝镜像的淘宝官方提供的方法：

```shell
npm config set registry https://registry.npmmirror.com
```

### npm配置淘宝镜像

用 npm 也可以使用淘宝镜像，配置的方式有两种：

- 直接配置

执行如下命令即可完成配置：

```shell
npm config set registry https://registry.npmmirror.com/
```

- 工具配置：nrm

使用 nrm 配置 npm 的镜像地址 npm registry manager

1. 安装 nrm：`npm i -g nrm`
2. 修改镜像：`nrm use taobao`
3. 检查是否配置成功（选做）：`npm config list`

> 检查 registry 地址是否为 <https://registry.npmmirror.com/>, 如果是则表明成功

虽然 cnpm 可以提高速度，但是 npm 也可以通过淘宝镜像进行加速，所以 npm 的使用率还是高于 cnpm

## 问题

### npm install运行卡住不动

> npm config set registry <http://registry.cnpmjs.org>

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701360579344-9557d5cb-9a7e-41fb-b597-ce215fab9fb7.png#averageHue=%232b2b2b&clientId=u5cc66aeb-5b13-4&from=paste&height=65&id=u6aaf72c3&originHeight=97&originWidth=910&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3104&status=done&style=stroke&taskId=u20f7ff3b-eb6d-4490-8181-be4e5c0c4b8&title=&width=606.6666666666666)或者用淘宝npm镜像

# 其他包管理器

## yarn

yarn 是由 Facebook 在 2016 年推出的新的 Javascript 包管理工具，官方网址：<https://yarnpkg.com/>。

yarn 特点：

- 速度超快：yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。同时利用并行下载以最大化资源利用率，因此安装速度更快。
- 超级安全：在执行代码之前，yarn 会通过算法校验每个安装包的完整性
- 超级可靠：使用详细、简洁的锁文件格式和明确的安装算法，yarn 能够保证在不同系统上无差异的工作

## nvm

nvm 全称 `Node Version Manager` 顾名思义它是用来管理 Node 版本的工具，方便切换不同版本的 Node.js。
nvm 的使用非常的简单，跟 npm 的使用方法类似。

下载地址 <https://github.com/coreybutler/nvm-windows/releases>

常用命令：

| 命令                    | 说明                     |
| --------------------- | ---------------------- |
| nvm list available    | 显示所有可以下载的 Node.js 版本   |
| nvm list              | 显示已安装的版本               |
| nvm install 18.12.1   | 安装 18.12.1 版本的 Node.js |
| nvm install latest    | 安装最新版的 Node.js         |
| nvm uninstall 18.12.1 | 删除某个版本的 Node.js        |
| nvm use 18.12.1       | 切换 18.12.1 的 Node.js   |
