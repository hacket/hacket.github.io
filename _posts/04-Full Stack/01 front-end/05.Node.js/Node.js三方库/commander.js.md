---
date created: 2024-03-08 23:32
date updated: 2024-12-25 23:57
dg-publish: true
---

[GitHub - tj/commander.js: node.js command-line interfaces made easy](https://github.com/tj/commander.js)

[玩转 Commander.js —— 你也是命令行大师-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1887034)

# 一些有用的工具

- [left-pad](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fstevemao%2Fleft-pad "https://github.com/stevemao/left-pad") - 常用来制表，对齐（广为流传的一个包..）

```js
const leftPad = require('left-pad')

leftPad('foo', 5) // => "  foo"

leftPad('foobar', 6) // => "foobar"

leftPad(1, 2, '0') // => "01"

leftPad(17, 5, 0) // => "00017"
```

- [chalk](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fchalk%2Fchalk "https://github.com/chalk/chalk") - 控制命令行文本样式

```js
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));

```

- [ora](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Fora "https://github.com/sindresorhus/ora") - 终端加载动效

```js
const ora = require('ora');

const spinner = ora('Loading unicorns').start();

setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
}, 1000);

```

- Pkg 打包 nodesjs 成可执行程序
