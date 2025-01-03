---
date created: 2024-12-25 01:00
date updated: 2024-12-25 01:00
dg-publish: true
---

# TS简介

## 什么是TypeScript？

TypeScript（简称 TS）是微软公司开发的一种基于 JavaScript （简称 JS）语言的编程语言。

- TS是对JS的增强，可以看成是JS的超集，继承了JS的所有语法
- TS主要是添加了类型系统

## TS和JS

### 静态类型和动态类型

JavaScript 的类型系统非常弱，而且没有使用限制，运算符可以接受各种类型的值。在语法上，JavaScript 属于动态类型语言。<br>TypeScript 已经推断确定了类型，后面就不允许再赋值为其他类型的值，即变量的类型是静态的。<br>静态类型有利于代码的静态分析，有利于提前发现错误。

### 类型声明

TypeScript 代码最明显的特征，就是为 JavaScript 变量加上了类型声明：

```javascript
let foo:string;
```

> 变量foo的后面使用冒号`:`，声明了它的类型为string

类型声明的写法，一律为在标识符后面添加“`冒号:类型`”。函数参数和返回值，也是这样来声明类型

```javascript
function toString(num:number):string {
  return String(num);
}
```

- 变量的值应该与声明的类型一致，如果不一致，TypeScript 就会报错
- TypeScript 规定，变量只有赋值后才能使用，否则就会报错

### 类型推断

- 变量类型推断

类型声明并不是必需的，如果没有，TypeScript 会自己推断类型：

```javascript
let foo = 123; // 推测类型为number
// 如果变量foo更改为其他类型的值，跟推断的类型不一致，TypeScript 就会报错。
let foo = 123;
foo = 'hello'; // 报错
```

- TypeScript 也可以推断函数的返回值

### 值与类型

学习 TypeScript 需要分清楚“值”（value）和“类型”（type）。

- “类型”是针对“值”的，可以视为是后者的一个元属性。每一个值在 TypeScript 里面都是有类型的。比如，3是一个值，它的类型是number。
- TypeScript 代码只涉及类型，不涉及值。所有跟“值”相关的处理，都由 JavaScript 完成。
- TypeScript 项目里面，其实存在两种代码，一种是底层的“值代码”，另一种是上层的“类型代码”。前者使用 JavaScript 语法，后者使用 TypeScript 的类型语法；它们是可以分离的，TypeScript 的编译过程，实际上就是把“类型代码”全部拿掉，只保留“值代码”。
- 编写 TypeScript 项目时，不要混淆哪些是值代码，哪些是类型代码

## TS编译

### TypeScript 的编译

JavaScript 的运行环境（浏览器和 Node.js）不认识 TypeScript 代码。所以，TypeScript 项目要想运行，必须先转为 JavaScript 代码，这个代码转换的过程就叫做“编译”（compile）。<br>TypeScript 官方没有做运行环境，只提供编译器。编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。<br>因此，TypeScript 的类型检查只是编译时的类型检查，而不是运行时的类型检查。一旦代码编译为 JavaScript，运行时就不再检查类型了。

### TypeScript Playground

[官网的在线编译页面 Playground](https://www.typescriptlang.org/play)

### tsc 编译器

TypeScript 官方提供的编译器叫做 `tsc`，可以将 TypeScript 脚本编译成 JavaScript 脚本。本机想要编译 TypeScript 代码，必须安装 tsc。<br>根据约定，TypeScript 脚本文件使用`.ts`后缀名，JavaScript 脚本文件使用.js后缀名。tsc 的作用就是把.ts脚本转变成.js脚本。

### 安装tsc

```shell
npm install -g typescript
# 或者淘宝镜像
cnpm install -g typescript
```

检查一下是否安装成功：

```shell
# 或者 tsc --version
$ tsc -v
Version 5.1.6
```

### 编译tsc脚本

- 编译单个tss：`tsc xxx.ts`

```shell
 tsc app.ts
 # 在当前目录下，生成一个app.js脚本文件，这个脚本就完全是编译后生成的 JavaScript 代码。
```

- tsc命令也可以一次编译多个 TypeScript 脚本

```shell
 tsc file1.ts file2.ts file3.ts
 # 在当前目录生成三个 JavaScript 脚本文件file1.js、file2.js、file3.js
```

- tsc 有很多参数，可以调整编译行为
  - `--outFile`如果想将多个 TypeScript 脚本编译成一个 JavaScript 文件，使用--outFile参数

> tsc file1.ts file2.ts --outFile app.js
>
> # 将file1.ts和file2.ts两个脚本编译成一个 JavaScript 文件app.js

- `--outDir` 编译结果默认都保存在当前目录，--outDir参数可以指定保存到其他目录

> tsc app.ts --outDir dist

- `--target` 为了保证编译结果能在各种 JavaScript 引擎运行，tsc 默认会将 TypeScript 代码编译成很低版本的 JavaScript，即3.0版本（以es3表示）。这通常不是我们想要的结果。以使用--target参数，指定编译后的 JavaScript 版本。建议使用es2015，或者更新版本。

> tsc --target es2015 app.ts

### 编译错误的处理

- 如果编译报错，tsc命令就会显示报错信息，但是这种情况下，依然会编译生成 JavaScript 脚本
- 如果希望一旦报错就停止编译，不生成编译产物，可以使用`--noEmitOnError`参数

> tsc --noEmitOnError app.ts

- tsc 还有一个--noEmit参数，只检查类型是否正确，不生成 JavaScript 文件

> tsc --noEmit app.ts

### tsconfig.json

TypeScript 允许将tsc的编译参数，写在配置文件`tsconfig.json`。只要当前目录有这个文件，tsc就会自动读取，所以运行时可以不写参数：

```shell
tsc file1.ts file2.ts --outFile dist/app.js
```

上面这个命令写成tsconfig.json，就是下面这样：

```json
{
  "files": ["file1.ts", "file2.ts"],
  "compilerOptions": {
    "outFile": "dist/app.js"
  }
}
```

## ts-node 模块

ts-node 是一个非官方的 npm 模块，可以直接运行 TypeScript 代码。<br>全局安装：

```shell
npm install -g ts-node
# 或
cnpm install -g ts-node
```

安装后，就可以直接运行 TypeScript 脚本：

```shell
ts-node script.ts
```

如果不安装 ts-node，也可以通过 `npx` 调用它来运行 TypeScript 脚本

```shell
npx ts-node script.ts
```

> npx会在线调用 ts-node，从而在不安装的情况下，运行script.ts

如果执行 ts-node 命令不带有任何参数，它会提供一个 TypeScript 的命令行 `REPL` 运行环境，你可以在这个环境中输入 TypeScript 代码，逐行执行：

```shell
$ ts-node
>
```

> 单独运行ts-node命令，会给出一个大于号，这就是 TypeScript 的 REPL 运行环境，可以逐行输入代码运行
> $ ts-node
>
> > const twice = (x:string) => x + x;
> > twice('abc')
>
> 'abcabc'
>
> >

要退出这个 REPL 环境，可以按下 `Ctrl + d`，或者输入`.exit`

# TypeScript 的三种特殊类型

## ~~any 类型（不建议使用）~~

### any类型介绍

any 类型表示没有任何限制，该类型的变量可以赋予任意类型的值：

```typescript
let x:any;

x = 1; // 正确
x = 'foo'; // 正确
x = true; // 正确
```

变量类型一旦设为any，TypeScript 实际上会关闭这个变量的类型检查。即使有明显的类型错误，只要句法正确，都不会报错：

```typescript
let x:any = 'hello';

x(1) // 不报错
x.foo = 100; // 不报错
```

> 变量x的值是一个字符串，但是把它当作函数调用，或者当作对象读取任意属性，TypeScript 编译时都不报错。原因就是x的类型是any，TypeScript 不对其进行类型检查。

由于这个原因，应该尽量避免使用any类型，否则就失去了使用 TypeScript 的意义。<br>实际开发中，any类型主要适用以下两个场合：

- 出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为any
- 为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为any。有些年代很久的大型 JavaScript 项目，尤其是别人的代码，很难为每一行适配正确的类型，这时你为那些类型复杂的变量加上any，TypeScript 编译时就不会报错。

总之，TypeScript 认为，只要开发者使用了any类型，就表示开发者想要自己来处理这些代码，所以就不对any类型进行任何限制，怎么使用都可以。<br>从集合论的角度看，any类型可以看成是所有其他类型的全集，包含了一切可能的类型。TypeScript 将这种类型称为“顶层类型”（top type），意为涵盖了所有下层。

### 类型推断问题

对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是any：

```typescript
function add(x, y) {
  return x + y;
}

add(1, [1, 2, 3]) // 不报错
```

> 函数add()的参数变量x和y，都没有足够的信息，TypeScript 无法推断出它们的类型，就会认为这两个变量和函数返回值的类型都是any。以至于后面就不再对函数add()进行类型检查了，怎么用都可以

TypeScript 提供了一个编译选项`noImplicitAny`，打开该选项，只要推断出any类型就会报错。

```shell
tsc --noImplicitAny app.ts
```

这里有一个特殊情况，即使打开了noImplicitAny，使用`let`和`var`命令声明变量，但不赋值也不指定类型，是不会报错的：

```typescript
var x; // 不报错
let y; // 不报错

// 示例
let x;

x = 123;
x = { foo: 'hello' };
// 量x的类型推断为any，但是不报错，可以顺利通过编译
```

> 变量x和y声明时没有赋值，也没有指定类型，TypeScript 会推断它们的类型为any。这时即使打开了noImplicitAny，也不会报错

由于这个原因，建议使用let和var声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。<br>`const`命令没有这个问题，因为 JavaScript 语言规定const声明变量时，必须同时进行初始化（赋值）：

```typescript
const x; // 报错
```

### 污染问题

any类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他变量。它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。

```typescript
let x:any = 'hello';
let y:number;

y = x; // 不报错

y * 123 // 不报错
y.toFixed() // 不报错
```

> 变量x的类型是any，实际的值是一个字符串。变量y的类型是number，表示这是一个数值变量，但是它被赋值为x，这时并不会报错。然后，变量y继续进行各种数值运算，TypeScript 也检查不出错误，问题就这样留到运行时才会暴露。

污染其他具有正确类型的变量，把错误留到运行时，这就是不宜使用any类型的另一个主要原因。

## unknown 类型

为了解决any类型“污染”其他变量的问题，TypeScript 3.0 引入了unknown类型。它与any含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像any那样自由，可以视为严格版的any。<br>unknown跟any的相似之处，在于所有类型的值都可以分配给unknown类型：

```typescript
let x:unknown;

x = true; // 正确
x = 42; // 正确
x = 'Hello World'; // 正确
```

unknown类型跟any类型的不同之处在于，它不能直接使用。主要有以下几个限制：

- 首先，unknown类型的变量，不能直接赋值给其他类型的变量（除了any类型和unknown类型）。

```typescript
let v:unknown = 123;

let v1:boolean = v; // 报错
let v2:number = v; // 报错
```

- 其次，不能直接调用unknown类型变量的方法和属性

```typescript
let v1:unknown = { foo: 123 };
v1.foo  // 报错

let v2:unknown = 'hello';
v2.trim() // 报错

let v3:unknown = (n = 0) => n + 1;
v3() // 报错
```

- 再次，unknown类型变量能够进行的运算是有限的，只能进行比较运算（运算符`==、===、!=、!==、||、&&、?`）、取反运算（运算符`!`）、`typeof`运算符和`instanceof`运算符这几种，其他运算都会报错。

```typescript
let a:unknown = 1;

a + 1 // 报错
a === 1 // 正确
```

怎么才能使用unknown类型变量呢？<br>只有经过“类型缩小”，unknown类型变量才可以使用。所谓“类型缩小”，就是缩小unknown变量的类型范围，确保不会出错。

```typescript
let a:unknown = 1;

if (typeof a === 'number') {
  let r = a + 10; // 正确
}
// unknown类型的变量a经过typeof运算以后，能够确定实际类型是number，就能用于加法运算了。
// 这就是“类型缩小”，即将一个不确定的类型缩小为更明确的类型。
```

这样设计的目的是，只有明确unknown变量的实际类型，才允许使用它，防止像any那样可以随意乱用，“污染”其他变量。类型缩小以后再使用，就不会报错。

总之，unknown可以看作是更安全的any。一般来说，凡是需要设为any类型的地方，通常都应该优先考虑设为unknown类型。<br>在集合论上，unknown也可以视为所有其他类型（除了any）的全集，所以它和any一样，也属于 TypeScript 的顶层类型。

## never 类型

为了保持与集合论的对应关系，以及类型运算的完整性，TypeScript 还引入了“空类型”的概念，即该类型为空，不包含任何值。<br>由于不存在任何属于“空类型”的值，所以该类型被称为never，即不可能有这样的值。

```typescript
let x:never;
// 变量x的类型是never，就不可能赋给它任何值，否则都会报错
```

never类型的使用场景，主要是在一些类型运算之中，保证类型运算的完整性，详见后面章节。另外，不可能返回值的函数，返回值的类型就可以写成never：

```typescript
function fn(x:string|number) {
  if (typeof x === 'string') {
    // ...
  } else if (typeof x === 'number') {
    // ...
  } else {
    x; // never 类型
  }
}
```

ver类型的一个重要特点是，可以赋值给任意其他类型：

```typescript
function f():never {
  throw new Error('Error');
}

let v1:number = f(); // 不报错
let v2:string = f(); // 不报错
let v3:boolean = f(); // 不报错
```

为什么never类型可以赋值给任意其他类型呢？这也跟集合论有关，空集是任何集合的子集。TypeScript 就相应规定，任何类型都包含了never类型。因此，never类型是任何其他类型所共有的，TypeScript 把这种情况称为“底层类型”（bottom type）。<br>总之，**TypeScript 有两个“顶层类型”（**`**any和unknown**`**），但是“底层类型”只有**`**never**`**唯一一个。**
