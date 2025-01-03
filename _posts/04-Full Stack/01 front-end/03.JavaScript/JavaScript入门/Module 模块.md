---
date created: 2024-12-25 00:59
date updated: 2024-12-25 00:59
dg-publish: true
---

# Module基础

## 模块化

背景：<br>早期开发常使用script标签进行引入，但是这样容易存在全局污染与依赖混乱的问题。如果不同文件里都存在同一变量，那么就全局污染混乱了（当然也是可以使用`匿名函数自执行`的方式，形成独立的块级作用域）。<br>依赖管理也是一个难以处理的问题。正常情况下，执行 js 的先后顺序就是 script 标签排列的前后顺序。那么如果三个 js 之间有依赖关系，处理就成了问题。<br>引入了模块化。前端模块化的两个重要方案：`CommonJS` 和 `ES Module(ES6)`。

## CommonJS

### CommonJS规范

- 是Node.js所遵守的模块规范
- 该规范约定一个文件就是一个模块，每个模块都有单独的作用域
- 通过`module.exports`导出c模块中的成员，再通过`require`函数载入模块

### 特点

- 同步加载，效率低；不适用于浏览器
- 每一个 js 文件都是一个单独的模块，我们可以称之为 module；
- 通过`module.exports`导出成员，通过`require`函数载入模块
  - 模块中，包含 CommonJS 规范的核心变量: `exports`、`module.exports`、`require`；
  - exports 和 module.exports 可以负责对模块中的内容进行导出
  - require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；
- 在执行阶段分析模块依赖，采用深度优先遍历（depth-first traversal），执行顺序是`父 -> 子 -> 父`；

### 使用

#### require

##### require标识符

当 require 方法执行的时候，接收的唯一参数作为一个标识符 ，CommonJS下对不同的标识符，处理流程不同，但是目的相同，都是找到对应的模块。

- 像 fs ，http ，path 等标识符，会被作为 nodejs 的核心模块。
- `./`和`../`作为相对路径的文件模块， `/`作为绝对路径的文件模块。
- 非路径形式也非核心模块的模块，将作为自定义模块。

##### 示例

- a.js

```javascript
const getMes = require('./b')
console.log('我是 a 文件')
exports.say = function(){
    const message = getMes()
    console.log(message)
}
```

- b.js

```javascript
const say = require('./a')
const  object = {
   name:'name',
   author:'author'
}
console.log('我是 b 文件')
module.exports = function(){
    return object
}
```

- main.js

```javascript
const a = require('./a')
const b = require('./b')

console.log('node 入口文件')
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704275021851-ea35195c-aabc-45ca-b741-6c789e477aa4.png#averageHue=%23252525&clientId=ud632e0a4-bbd1-4&from=paste&height=60&id=uf5de60d4&originHeight=120&originWidth=770&originalType=binary&ratio=2&rotation=0&showTitle=false&size=23478&status=done&style=none&taskId=u67a10f74-5a54-48f3-8a0c-bf594e0986a&title=&width=385)

1. main.js 与a都引用了b 但是b只执行了一次
2. a b相互引用，但并没有造成循环引用的情况
3. 执行顺序父——子——父

##### require加载原理？

`module` 和 `Module`

- module ：在 Node 中每一个 js 文件都是一个 module ，module 上保存了 exports 等信息之外，还有一个 ` loaded  `表示该模块是否被加载。
- Module ：以 nodejs 为例，整个系统运行之后，会用 Module 缓存每一个模块加载的信息。

**require加载流程：**

- require 会接收一个参数——文件标识符，然后分析定位文件，接下来会从 Module 上查找有没有缓存，如果有缓存，那么直接返回缓存的内容。
- 如果没有缓存，会创建一个 module 对象，缓存到 Module 上，然后执行文件，加载完文件，将 loaded 属性设置为 true ，然后返回 module.exports 对象。借此完成模块加载流程。
- 模块导出就是 return 这个变量的其实跟 a = b 赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址。
- exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对 exports 进行赋值会导致 exports 操作的不再是 module.exports 的引用

##### require怎么避免重复加载？

缓存，加载了一次后就缓存了，再次加载就直接从缓存中拿

##### require循环引用解决？

也是因为缓存。

1. 首先执行 node main.js ，那么开始执行第一行 require(a.js)；
2. 那么首先判断 a.js 有没有缓存，因为没有缓存，先加入缓存，然后执行文件 a.js （需要注意 是先加入缓存， 后执行模块内容）;
3. a.js 中执行第一行，引用 b.js。
4. 那么判断 b.js 有没有缓存，因为没有缓存，所以加入缓存，然后执行 b.js 文件。
5. b.js 执行第一行，再一次循环引用 require(a.js) 此时的 a.js 已经加入缓存，直接读取值。接下来打印 console.log(‘我是 b 文件’)，导出方法。
6. b.js 执行完毕，回到 a.js 文件，打印 console.log(‘我是 a 文件’)，导出方法。
7. 最后回到 main.js，打印 console.log(‘node 入口文件’) 完成这个流程。

不过我们需要注意第5点的时候，当执行 b.js 模块的时候，因为 a.js 还没有导出 say 方法，所以 b.js 同步上下文中，获取不到 say。<br>因此要想在b中用到say：

- 异步
- 动态加载：require 可以在任意的上下文，动态加载模块

异步：

```javascript
const say = require('./a')
const  object = {
   name:'name',
   author:'author'
}
console.log('我是 b 文件')
console.log('打印 a 模块' , say)

setTimeout(()=>{
    console.log('异步打印 a 模块' , say)
},0)

module.exports = function(){
    return object
}
```

动态加载：

```javascript
console.log('我是 a 文件')
exports.say = function(){
    const getMes = require('./b')
    const message = getMes()
    console.log(message)
}
```

#### exports 和 module.exports

在node执行一个文件时,会给这个文件内生成一个 exports 对象和一个 module 对象，而这个module 对象又有一个属性叫做 exports。<br>![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704285113754-2317bb2d-7f9e-4dd3-a928-60a834bf2047.png#averageHue=%23f9f9f9&clientId=ud632e0a4-bbd1-4&from=paste&height=90&id=ud7ab1f19&originHeight=180&originWidth=412&originalType=binary&ratio=2&rotation=0&showTitle=false&size=9944&status=done&style=none&taskId=u4dc08bce-9955-46ff-a058-3e3663300d0&title=&width=206)

1. exports 对象是 module 对象的一个属性,在初始时 module.exports 和 exports 指向同一块内存区域
2. 模块导出的是 module.exports ，exports 只是对它的引用，在不改变exports 内存的情况下，修改exports 的值可以改变 module.exports 的值
3. 导出时尽量使用 module.exports ，以免因为各种赋值导致的混乱

## ES Module

ES Modules 规范是 ECMAScript 2015 (ES6） 中才定义的模块系统，是近几年才制定的标准，存在环境兼容的问题；随着 Webpack 等一系列打包工具的流行，这一规范才开始逐渐被普及。<br>模块化规范基本实现了统一：

- Node.js环境中，遵循CommonJS规范
- 在浏览器环境中， 遵循ES Module规范

### ES Module特点和优势

#### ES Module特性

从代码中去理解4个特性：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ES Module - 模块的特性</title>
</head>

<body>
    <!-- 通过给 script 添加 type = module 的属性，就可以以 ES Module 的标准执行其中的 JS 代码了 -->
    <script type="module">
        console.log('this is es module') // this is es module
    </script>

    <!-- 特性1. ESM 自动采用严格模式 -->
    <script type="module">
        console.log(this) //undefined。因为每个semodule都是私有作用域,this无法指向全局对象
    </script>

    <script>
        console.log(this) //window 
    </script>

    <!-- 特性2. 每个 ES Module 都是运行在单独的私有作用域中 -->
    <script type="module">
        var foo = 100
        console.log(foo) //100
    </script>

    <script type="module">
        console.log(foo) //Uncaught ReferenceError:foo is not undefined
    </script>

    <!-- 特性3. ESM 是通过 CORS 的方式请求外部 JS 模块的 -->
    <script type="module" src="https://libs.baidu.com/jquery/2.0.0/jquery.min.js">
        //跨域请求错误：Access to script at 'https://libs.baidu.com/jquery/2.0.0/jquery.min.js' from origin 'http://localhost:5000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
        //请求地址失败：GET https://libs.baidu.com/jquery/2.0.0/jquery.min.js net::ERR_FAILED
    </script>
    <script type="module" src="https://unpkg.com/jquery@3.4.1/dist/jquery.min.js">
        //换了一个支持CORS请求的链接就不会报错了
    </script>

    <!-- 特性4. ESM 的 script 标签会延迟执行脚本 -->
    <script defer src="demo.js"></script>
    <p>需要显示的内容</p> <!-- 被延迟执行的脚本内容：先alert再加载p标签下内容 -->
</body>

</html>
```

#### ES Module优势

1. 静态加载，好处：可进行静态分析（不执行代码，从字面量上对代码进行分析），即利于 Tree-shaking，在编译时消除无用代码

> Tree Shaking 指基于 ES Module 进行静态分析，通过 AST 将用不到的函数进行移除，从而减小打包体积。

同时由于这一特性，import 会自动提升到代码的顶层 ，import , export 不能放在块级作用域或条件语句中

2. 完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案：

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704286412318-d0375129-df1c-48f0-ab3c-7724f94f4b15.png#averageHue=%23f9f9f8&clientId=ud632e0a4-bbd1-4&from=paste&height=480&id=u3feff17a&originHeight=960&originWidth=2078&originalType=binary&ratio=2&rotation=0&showTitle=false&size=380770&status=done&style=none&taskId=u6ad5130e-861a-45be-a623-d15c53c4d44&title=&width=1039)

3. 异步加载：不会造成堵塞浏览器，页面渲染完毕，再执行脚本

### export

export 用来导出模块，import 用来导入模块。但是 export 配合 import 会有很多种组合情况

#### export { }、import { } from 'xxx'

所有通过 export 导出的属性，在 import 中可以通过结构的方式，解构出来。

```javascript
// a.js
const name = 'name' 
const author = 'author'
export { name, author }
export const say = function (){
   console.log('hello , world')
}
export let num = 1;   // √
export let name = 'name';   // √

export 2;   // X，直接输出，未提供对外的接口

let num = 1;   
let name = 'name';

export {num, name};   // √，使用{}指定输出的变量

export num;   // X，还是直接输出，未提供对外的接口


// 可用as重命名
let num = 1;   
let name = 'name';

export {num as number, name};   // √，num 重命名为 number

// 其他js导入
import { name , author , say } from './a.js'
```

#### module导出时给变量名重命名

```javascript
// 导出
var name = 'foo module'

export {
  // name as default,
  name as fooHello
}

// 导入
import { fooHello } from './module.js';
console.log(fooHello);
```

#### export default 默认导出

export default anything 导入 module 的默认导出。 anything 可以是函数，属性方法，或者对象。<br>一个模块中只能有一个默认导出export default， 即只能使用一次<br>对于引入默认导出的模块，`import anyName from ‘module’`， anyName 可以是自定义名称。

```javascript
const name = 'name'
const author = 'author'
const say = function (){
   console.log('hello , world')
}

export default {
   name,
   author,
   say
}
```

导入：

```javascript
import mes from './a.js'
console.log(mes) //{ name: 'name',author:'author', say:Function }
```

##### export default 和 export 混合

```javascript
// 导出 a.js
export const name = 'name'
export const author = 'author'

export default function say (){
    console.log('hello , world')
}

// 导入
import theSay, { name, author as bookAuthor } from './a.js'
console.log(
    theSay,     // ƒ say() {console.log('hello , world') }
    name,       // "name"
    bookAuthor  // "author"
)
import theSay, * as mes from './a'
console.log(
    theSay, // ƒ say() { console.log('hello , world') }
    mes // { name:'name' , author: "author" ，default:  ƒ say() { console.log('hello , world') } }
```

导出的属性被合并到 mes 属性上， export 被导入到对应的属性上，export default 导出内容被绑定到 default 属性上。 theSay 也可以作为被 export default 导出属性。

#### 重定向导出

可以把当前模块作为一个中转站，一方面引入 module 内的属性，然后把属性再给导出去：

```javascript
export * from 'module' // 第一种方式
export { name, author, ..., say } from 'module' // 第二种方式
export {   name as bookName ,  author as bookAuthor , ..., say } from 'module' //第三种方式
```

#### 动态导入 import(‘module’)

const promise = import('module') ，动态导入返回一个 Promise。为了支持这种方式，需要在 webpack 中做相应的配置处理。

#### 无需导入 直接运行import ‘module’

执行 module 不导出值 多次调用 module 只运行一次

### import

规则：

1. 输入的变量、函数或类 只读（对象较特殊），均不建议改写
2. from后指定模块文件的位置，可相对路径，可绝对路径，可模块名（需具有配置文件）
3. 具有提升效果，类似变量提升效果，import会自动提升到代码的顶层
4. 不能使用表达式和变量

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704289899699-cd44bd8f-b2fc-412c-9874-c1216e4d72aa.png#averageHue=%23faf9f8&clientId=u9f726499-a507-4&from=paste&height=314&id=uc5c424ea&originHeight=628&originWidth=1954&originalType=binary&ratio=2&rotation=0&showTitle=false&size=218822&status=done&style=none&taskId=u312a4a40-9cdd-42f4-a6de-c351d453f1f&title=&width=977)

#### 动态加载

首先 import() 动态加载一些内容，可以放在条件语句或者函数执行上下文中

```javascript
if(isRequire){
    const result  = import('./b')
}
```

#### 懒加载

比如vue中的路由懒加载：

```javascript
[
   {
        path: 'home',
        name: '首页',
        component: ()=> import('./home') ,
   },
]
```

#### tree shaking

Tree Shaking 在 Webpack 中的实现，是用来尽可能的删除没有被使用过的代码，一些被 import 了但其实没有被使用的代码。作为没有引用的方法，不会被打包进来。

### module export/import注意

#### 对象后面的花括号和export后的花括号是不同的概念：一个是【对象】，一个是导出【引用】。

```javascript
var obj = { name, age } // 这个花括号是个对象
export { name, age } // 这个花括号是个引用

// 导出错误：
export name // 错误的导出用法
export 'foo' // 同样错误的导出用法

// 可以这样导出变量名：
export default name  
```

#### 导出导入的是引用的内存地址

导出：module.js：

```javascript
var name = 'jack'
var age = 18

export { name, age }  
setTimeout(function () {
  name = 'ben'
}, 1000)
```

导入：app.js：

```javascript
import { name, age } from './module.js'

console.log(name, age)

// 导入成员并不是复制一个副本，
// 而是直接导入模块成员的引用地址，
// 也就是说 import 得到的变量与 export 导入的变量在内存中是同一块空间。
// 一旦模块中成员修改了，这里也会同时修改，
setTimeout(function () {
  console.log(name, age)
}, 1500)
```

![](https://pic4.zhimg.com/v2-2c3af7f360741ba70e178dccf99b83d3_b.webp#height=188&id=PVQtG&originHeight=320&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=376)

#### 导入的变量只读不能修改

```javascript
import { name, age } from './module.js'
name=1 //Uncaught TypeError: Assignment to constant variable.=
```

## CommonJS和ES Module交互

- ES6 模块和 CommonJS 模块有很大的差异。
  - 语法上面，CommonJS 模块使用require()加载和module.exports输出，ES6 模块使用import和export。
  - 用法上面，require()是同步加载，后面的代码必须等待这个命令执行完，才会执行。import命令则是异步加载，或者更准确地说，ES6 模块有一个独立的静态解析阶段，依赖关系的分析是在那个阶段完成的，最底层的模块第一个执行。
- ES Modules可以导入CommonJS模块
- CommonJS不能导入ES Modules模块
- CommonJS始终只会导出一个默认成员
- 以ES Modules方式运行模块

```shell
node --experimental-modules esm.mjs
```

以ES Modules方式实现CommonJS的 filename 和dirname

```javascript
import { fileURLToPath } from 'url'
import { dirname} from 'path'
const __filename = fileURLToPath(import.meta.url)
console.log(__filename) // \differences\esm.mjs 当前运行文件的路径
const __dirname = dirname(__filename) 
console.log(__dirname) // \differences 当前项目路径
```

## 坑

### CommonJS中引入了ES Module的库

报错：<br>![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704265705587-fe52d3ba-152f-46e2-8fc8-f3c6565bc827.png#averageHue=%231f1f1f&clientId=ud632e0a4-bbd1-4&from=paste&height=278&id=uca12d87b&originHeight=556&originWidth=2506&originalType=binary&ratio=2&rotation=0&showTitle=false&size=159195&status=done&style=none&taskId=uf653e728-e6f4-45f1-9179-e2554e1226c&title=&width=1253)
