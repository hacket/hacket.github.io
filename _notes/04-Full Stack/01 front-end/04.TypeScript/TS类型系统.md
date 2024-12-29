---
date created: 2024-12-25 01:00
date updated: 2024-12-25 01:00
dg-publish: true
---

TypeScript 继承了 JavaScript 的类型，在这个基础上，定义了一套自己的类型系统。

# TS类型系统基础

## 基本类型

JavaScript 语言（注意，不是 TypeScript）将值分成8种类型：

- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

TypeScript 继承了 JavaScript 的类型设计，以上8种类型可以看作 TypeScript 的基本类型。

> **注意**，上面所有类型的名称都是小写字母，首字母大写的Number、String、Boolean等在 JavaScript 语言中都是内置对象，而不是类型名称。

另外，`undefined` 和 `null` 既可以作为值，也可以作为类型，取决于在哪里使用它们。<br>这8种基本类型是 TypeScript 类型系统的基础，复杂类型由它们组合而成。

### boolean 类型

boolean类型只包含true和false两个布尔值。

```typescript
const x:boolean = true;
const y:boolean = false;
```

### string 类型

string类型包含所有字符串。

```typescript
const x:string = 'hello';
const y:string = `${x} world`;
```

### number 类型

number类型包含所有整数和浮点数。

> 整数、浮点数和非十进制数都属于 number 类型。

```typescript
const x:number = 123;
const y:number = 3.14;
const z:number = 0xffff;
```

### bigint 类型

bigint 类型包含所有的大整数。

```typescript
const x:bigint = 123n;
const y:bigint = 0xffffn;
```

bigint 与 number 类型不兼容。

```typescript
const x:bigint = 123; // 报错
const y:bigint = 3.14; // 报错
```

注意，bigint 类型是 `ES2020` 标准引入的。如果使用这个类型，TypeScript 编译的目标 JavaScript 版本不能低于 ES2020（即编译参数target不低于es2020）。

### symbol 类型

symbol 类型包含所有的 Symbol 值

```typescript
const x:symbol = Symbol();
```

### object 类型

根据 JavaScript 的设计，object 类型包含了所有对象、数组和函数

```typescript
const x:object = { foo: 123 };
const y:object = [1, 2, 3];
const z:object = (n:number) => n + 1;
```

### undefined 类型，null 类型

undefined 和 null 是两种独立类型，它们各自都只有一个值：

- undefined 类型只包含一个值undefined，表示未定义（即还未给出定义，以后可能会有定义）。

```typescript
let x:undefined = undefined;
```

- null 类型也只包含一个值null，表示为空（即此处没有值）。

```typescript
const x:null = null;
```

- 注意，如果没有声明类型的变量，被赋值为undefined或null，在关闭编译设置noImplicitAny和strictNullChecks时，它们的类型会被推断为any。

```typescript
// 关闭 noImplicitAny 和 strictNullChecks

let a = undefined;   // any
const b = undefined; // any

let c = null;        // any
const d = null;      // any
```

果希望避免这种情况，则需要打开编译选项`strictNullChecks`。

```typescript
// 打开编译设置 strictNullChecks

let a = undefined;   // undefined
const b = undefined; // undefined

let c = null;        // null
const d = null;      // null
```

## 包装对象类型

### 包装对象介绍

JavaScript 的8种类型之中，undefined和null其实是两个特殊值，object属于复合类型，剩下的五种属于原始类型（primitive value），代表最基本的、不可再分的值。

- boolean
- string
- number
- bigint
- symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。

```typescript
'hello'.charAt(1) // 'e'
```

> 字符串hello执行了charAt()方法。但是，在 JavaScript 语言中，只有对象才有方法，原始类型的值本身没有方法。这行代码之所以可以运行，就是因为在调用方法时，字符串会自动转为包装对象，charAt()方法其实是定义在包装对象上。
> 这样的设计大大方便了字符串处理，省去了将原始类型的值手动转成对象实例的麻烦。

五种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（即`Symbol()`和`BigInt()`不能作为构造函数使用），但是剩下三种可以。

- Boolean()
- String()
- Number()

以上三个构造函数，执行后可以直接获取某个原始类型值的包装对象：

```typescript
const s = new String('hello');
typeof s // 'object'
s.charAt(1) // 'e'
```

**注意**，String()只有当作构造函数使用时（即带有new命令调用），才会返回包装对象。如果当作普通函数使用（不带有new命令），返回就是一个普通字符串。其他两个构造函数Number()和Boolean()也是如此。

### 包装对象类型与字面量类型

由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况：

```typescript
'hello' // 字面量
new String('hello') // 包装对象
```

为了区分这两种情况，TypeScript 对五种原始类型分别提供了大写和小写两种类型：

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象：

```typescript
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错
```

> String类型可以赋值为字符串的字面量，也可以赋值为包装对象。但是，string类型只能赋值为字面量，赋值为包装对象就会报错

建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象。而且，TypeScript 把很多内置方法的参数，定义成小写类型，使用大写类型会报错：

```typescript
const n1:number = 1;
const n2:Number = 1;

Math.abs(n1) // 1
Math.abs(n2) // 报错
```

Symbol()和BigInt()这两个函数不能当作构造函数使用，所以没有办法直接获得 symbol 类型和 bigint 类型的包装对象，除非使用下面的写法。但是，它们没有使用场景，因此Symbol和BigInt这两个类型虽然存在，但是完全没有使用的理由：

```typescript
let a = Object(Symbol());
let b = Object(BigInt());
```

注意，目前在 TypeScript 里面，symbol和Symbol两种写法没有差异，bigint和BigInt也是如此，不知道是否属于官方的疏忽。建议始终使用小写的symbol和bigint，不使用大写的Symbol和BigInt。

## Object和object类型

TypeScript 的对象类型也有`大写Object`和`小写object`两种。

### Object 类型

大写的Object类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是Object类型，这囊括了几乎所有的值：

```typescript
let obj:Object;
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
```

事实上，除了undefined和null这两个值不能转为对象，其他任何值都可以赋值给Object类型：

```typescript
let obj:Object;

obj = undefined; // 报错
obj = null; // 报错
```

`空对象{}`是Object类型的简写形式，所以使用Object时常常用空对象代替：

```typescript
let obj:{};
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
```

显然，无所不包的Object类型既不符合直觉，也不方便使用。

### object类型

小写的object类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值：

```typescript
let obj:object;
 
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
obj = true; // 报错
obj = 'hi'; // 报错
obj = 1; // 报错
```

大多数时候，我们使用对象类型，只希望包含真正的对象，不希望包含原始类型。所以，建议总是使用小写类型object，不使用大写类型Object。<br>注意，无论是大写的Object类型，还是小写的object类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中。

```typescript
const o1:Object = { foo: 0 };
const o2:object = { foo: 0 };

o1.toString() // 正确
o1.foo // 报错

o2.toString() // 正确
o2.foo // 报错
```

## undefined 和 null 的特殊性

undefined和null既是值，又是类型。

- 作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为undefined或null。

```typescript
let age:number = 24;

age = null;      // 正确
age = undefined; // 正确
// 变量age的类型是number，但是赋值为null或undefined并不报错
```

> 并不是因为undefined和null包含在number类型里面，而是故意这样设计，任何类型的变量都可以赋值为undefined和null，以便跟 JavaScript 的行为保持一致。

- JavaScript 的行为是，变量如果等于undefined就表示还没有赋值，如果等于null就表示值为空。所以，TypeScript 就允许了任何类型的变量都可以赋值为这两个值。

但是有时候，这并不是开发者想要的行为，也不利于发挥类型系统的优势：

```typescript
const obj:object = undefined;
obj.toString() // 编译不报错，运行就报错
```

为了避免这种情况，及早发现错误，TypeScript 提供了一个编译选项`strictNullChecks`。只要打开这个选项，undefined和null就不能赋值给其他类型的变量（除了any类型和unknown类型）。

```typescript
// tsc --strictNullChecks app.ts

let age:number = 24;

age = null;      // 报错
age = undefined; // 报错
```

这个选项在配置文件tsconfig.json的写法如下：

```json
{
  "compilerOptions": {
    "strictNullChecks": true
    // ...
  }
}
```

打开strictNullChecks以后，undefined和null这两种值也不能互相赋值了：

```typescript
// 打开 strictNullChecks

let x:undefined = null; // 报错
let y:null = undefined; // 报错
```

总之，打开strictNullChecks以后，undefined和null只能赋值给自身，或者any类型和unknown类型的变量：

```typescript
let x:any = undefined;
let y:unknown = null;
```

## 值类型

TypeScript 规定，单个值也是一种类型，称为“值类型：

```typescript
let x:'hello';

x = 'hello'; // 正确
x = 'world'; // 报错
// 变量x的类型是字符串hello，导致它只能赋值为这个字符串，赋值为其他字符串就会报错。
```

TypeScript 推断类型时，遇到const命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型：

```typescript
// x 的类型是 "https"
const x = 'https';

// y 的类型是 string
const y:string = 'https';
// 变量x是const命令声明的，TypeScript 就会推断它的类型是值https，而不是string类型。
```

这样推断是合理的，因为const命令声明的变量，一旦声明就不能改变，相当于常量。值类型就意味着不能赋为其他值。<br>注意，const命令声明的变量，如果赋值为对象，并不会推断为值类型。

```typescript
// x 的类型是 { foo: number }
const x = { foo: 1 };
```

值类型可能会出现一些很奇怪的报错：

```typescript
const x:5 = 4 + 1; // 报错
```

> 等号左侧的类型是数值5，等号右侧4 + 1的类型，TypeScript 推测为number。由于5是number的子类型，number是5的父类型，父类型不能赋值给子类型，所以报错了

反过来是可以的，子类型可以赋值给父类型：

```typescript
let x:5 = 5;
let y:number = 4 + 1;

x = y; // 报错
y = x; // 正确
```

> 变量x属于子类型，变量y属于父类型。子类型x不能赋值为父类型y，但是反过来是可以的：子类型可以赋值给父类型。

如果一定要让子类型可以赋值为父类型的值，就要用到类型断言：

```typescript
const x:5 = (4 + 1) as 5; // 正确
```

## 联合类型 `|`

联合类型（union types）指的是多个类型组成的一个新类型，使用符号`|`表示。<br>联合类型`A|B`表示，任何一个类型只要属于A或B，就属于联合类型A|B。

```typescript
let x:string|number; // 它的值既可以是字符串，也可以是数值。

x = 123; // 正确
x = 'abc'; // 正确
```

联合类型可以与值类型相结合，表示一个变量的值有若干种可能：

```typescript
let setting:true|false;

let gender:'male'|'female';

let rainbowColor:'赤'|'橙'|'黄'|'绿'|'青'|'蓝'|'紫';
```

打开编译选项`strictNullChecks`后，其他类型的变量不能赋值为`undefined`或`null`。这时，如果某个变量确实可能包含空值，就可以采用联合类型的写法。

```typescript
let name:string|null;

name = 'John';
name = null;
```

联合类型的第一个成员前面，也可以加上竖杠|，这样便于多行书写：

```typescript
let x:
  | 'one'
  | 'two'
  | 'three'
  | 'four';
```

如果一个变量有多种类型，读取该变量时，往往需要进行“类型缩小”（type narrowing），区分该值到底属于哪一种类型，然后再进一步处理：

```typescript
function printId(
  id:number|string
) {
    console.log(id.toUpperCase()); // 报错
}
```

> 参数变量id可能是数值，也可能是字符串，这时直接对这个变量调用toUpperCase()方法会报错，因为这个方法只存在于字符串，不存在于数值

解决方法就是对参数id做一下类型缩小，确定它的类型以后再进行处理：

```typescript
function printId(
  id:number|string
) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```

“**类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。实际上，联合类型本身可以看成是一种“类型放大”（type widening），处理时就需要“类型缩小”（type narrowing）。**

## 交叉类型 `&`

交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号`&`表示<br>交叉类型`A&B`表示，任何一个类型必须同时属于A和B，才属于交叉类型A&B，即交叉类型同时满足A和B的特征。

```typescript
let x:number&string;
```

> 变量x同时是数值和字符串，这当然是不可能的，所以 TypeScript 会认为x的类型实际是never。

- 交叉类型的主要用途是表示对象的合成：

```typescript
let obj:
  { foo: string } &
  { bar: string };

obj = {
  foo: 'hello',
  bar: 'world'
};
```

> 变量obj同时具有属性foo和属性bar

- 交叉类型常常用来为对象类型添加新属性：

```typescript
type A = { foo: number };

type B = A & { bar: number };
```

> 类型B是一个交叉类型，用来在A的基础上增加了属性bar

## type 命令（类型别名 alias）

type命令用来定义一个类型的别名。

```typescript
type Age = number;

let age:Age = 55;
```

- 别名不允许重名

```typescript
type Color = 'red';
type Color = 'blue'; // 报错
// 同一个别名Color声明了两次，就报错了
```

- 别名的作用域是块级作用域。这意味着，代码块内部定义的别名，影响不到外部。

```typescript
type Color = 'red';

if (Math.random() < 0.5) {
  type Color = 'blue';
}
// if代码块内部的类型别名Color，跟外部的Color是不一样的
```

- 别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套。

```typescript
type World = "world";
type Greeting = `hello ${World}`;	
```

- type命令属于类型相关的代码，编译成 JavaScript 的时候，会被全部删除。

## typeof 运算符

### js中的typeof

JavaScript 语言中，typeof 运算符是一个一元运算符，返回一个字符串，代表操作数的类型。

```typescript
typeof 'foo'; // 'string'
```

> 注意，这时 typeof 的操作数是一个值。

JavaScript 里面，typeof运算符只可能返回八种结果，而且都是字符串。

```typescript
typeof undefined; // "undefined"
typeof true; // "boolean"
typeof 1337; // "number"
typeof "foo"; // "string"
typeof {}; // "object"
typeof parseInt; // "function"
typeof Symbol(); // "symbol"
typeof 127n // "bigint"
```

### ts中的typeof

TypeScript 将typeof运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型：

```typescript
const a = { x: 0 };

type T0 = typeof a;   // { x: number }
type T1 = typeof a.x; // number
```

这种用法的typeof返回的是 TypeScript 类型，所以只能用在类型运算之中（即跟类型相关的代码之中），不能用在值运算。<br>也就是说，同一段代码可能存在两种typeof运算符，一种用在值相关的 JavaScript 代码部分，另一种用在类型相关的 TypeScript 代码部分。

```typescript
let a = 1;
let b:typeof a;

if (typeof a === 'number') {
  b = a;
}
// 上例的代码编译结果如下。
let a = 1;
let b;
if (typeof a === 'number') {
    b = a;
}
```

JavaScript 的 typeof 遵守 JavaScript 规则，TypeScript 的 typeof 遵守 TypeScript 规则。它们的一个重要区别在于，编译后，前者会保留，后者会被全部删除。<br>由于编译时不会进行 JavaScript 的值运算，所以TypeScript 规定，typeof 的参数只能是标识符，不能是需要运算的表达式。

```typescript
type T = typeof Date(); // 报错
// 原因是 typeof 的参数不能是一个值的运算式，而Date()需要运算才知道结果。
```

另外，typeof命令的参数不能是类型。

```typescript
type Age = number;
type MyAge = typeof Age; // 报错
```

typeof 是一个很重要的 TypeScript 运算符，有些场合不知道某个变量foo的类型，这时使用typeof foo就可以获得它的类型。

## 块级类型声明

TypeScript 支持块级类型声明，即类型可以声明在代码块（用大括号表示）里面，并且只在当前代码块有效。

```typescript
if (true) {
  type T = number;
  let v:T = 5;
} else {
  type T = string;
  let v:T = 'hello';
}
```

## 类型的兼容

TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型：

```typescript
type T = number|string;

let a:number = 1;
let b:T = a;
```

> 变量a和b的类型是不一样的，但是变量a赋值给变量b并不会报错。这时，我们就认为，b的类型兼容a的类型。

TypeScript 为这种情况定义了一个专门术语。如果类型A的值可以赋值给类型B，那么类型A就称为类型B的子类型（subtype）。在上例中，类型number就是类型number|string的子类型。<br>TypeScript 的一个规则是，凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行。

```typescript
let a:'hi' = 'hi';
let b:string = 'hello';

b = a; // 正确
a = b; // 报错
```

之所以有这样的规则，是因为子类型继承了父类型的所有特征，所以可以用在父类型的场合。但是，子类型还可能有一些父类型没有的特征，所以父类型不能用在子类型的场合。<br>和Java中的多态很类似。

# TS数组

## TS数组基础

TypeScript 数组有一个根本特征：所有成员的类型必须相同，但是成员数量是不确定的，可以是无限数量的成员，也可以是零成员。<br>数组的类型有两种写法：

- 数组成员的类型后面，加上一对方括号

```typescript
// 单一类型
let arr:number[] = [1, 2, 3];

// 聚合类型，可以写在圆括号里面。
let arr:(number|string)[]; // 圆括号是必须的，否则因为竖杠|的优先级低于[]，TypeScript 会把number|string[]理解成number和string[]的联合类型

```

- TypeScript 内置的 `Array` 接口，可用泛型

```typescript
// 单一类型
let arr:Array<number> = [1, 2, 3];

// 聚合类型
let arr:Array<number|string>;
```

正是由于数组成员数量可以动态变化，所以 TypeScript 不会对数组边界进行检查，越界访问数组并不会报错：

```typescript
let arr:number[] = [1, 2, 3];
let foo = arr[3]; // 正确
```

## TS数组的类型推断

如果数组变量没有声明类型，TypeScript 就会推断数组成员的类型。这时，推断行为会因为值的不同，而有所不同。

- 如果变量的初始值是空数组，那么 TypeScript 会推断数组类型是`any[]`

```typescript
// 推断为 any[]
const arr = [];
// 后面，为这个数组赋值时，TypeScript 会自动更新类型推断。
const arr = [];
arr // 推断为 any[]

arr.push(123);
arr // 推断类型为 number[]

arr.push('abc');
arr // 推断类型为 (string|number)[]
```

- 类型推断的自动更新只发生初始值为空数组的情况。如果初始值不是空数组，类型推断就不会更新

```typescript
// 推断类型为 number[]
const arr = [123];

arr.push('abc'); // 报错
```

### 只读数组，const 断言

- JavaScript 规定，const命令声明的数组变量是可以改变成员的。

```typescript
const arr = [0, 1];
arr[0] = 2;
```

- TypeScript 允许声明只读数组，方法是在数组类型前面加上`readonly`关键字。

```typescript
const arr:readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
// arr是一个只读数组，删除、修改、新增数组成员都会报错。
```

- TypeScript 将`readonly number[]`与`number[]`视为两种不一样的类型，后者是前者的子类型。

```typescript
let a1:number[] = [0, 1];
let a2:readonly number[] = a1; // 正确

a1 = a2; // 报错
```

- 由于只读数组是数组的父类型，所以它不能代替数组。

```typescript
function getSum(s:number[]) {
  // ...
}

const arr:readonly number[] = [1, 2, 3];

getSum(arr) // 报错
// 解决：使用类型断言getSum(arr as number[])
```

- `readonly`关键字不能与数组的泛型写法一起使用

```typescript
// 报错
const arr:readonly Array<number> = [0, 1];
```

- TypeScript 提供了两个专门的泛型，用来生成只读数组的类型
  - 泛型`ReadonlyArray<T>`和`Readonly<T[]>`都可以用来生成只读数组类型。两者尖括号里面的写法不一样
  - `Readonly<T[]>`的尖括号里面是整个数组（number[]）
  - `ReadonlyArray<T>`的尖括号里面是数组成员（number）

```typescript
const a1:ReadonlyArray<number> = [0, 1];

const a2:Readonly<number[]> = [0, 1];
```

- 只读数组还有一种声明方法，就是使用“const 断言”。

```typescript
const arr = [0, 1] as const;

arr[0] = [2]; // 报错 
```

## 多维数组

TypeScript 使用`T[][]`的形式，表示二维数组，T是最底层数组成员的类型。

```typescript
var multi:number[][] = [[1,2,3], [23,24,25]];
```

# 元祖

## 元祖基础

元组（`tuple`）是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。

- 由于成员的类型可以不一样，所以元组必须明确声明每个成员的类型

```typescript
const s:[string, string, boolean]
  = ['a', 'b', true];
```

- 数组的成员类型写在方括号外面（`number[]`），元组的成员类型是写在方括号里面（`[number]`）。TypeScript 的区分方法就是，成员类型写在方括号里面的就是元组，写在外面的就是数组

```typescript
// 数组
let a:number[] = [1];

// 元组
let t:[number] = [1];
```

- 使用元组时，必须明确给出**类型声明**（上例的[number]），不能省略，否则 TypeScript 会把一个值自动推断为数组。

```typescript
// a 的类型被推断为 (number | boolean)[]
let a = [1, true];
```

- 元组成员的类型可以添加问号后缀（`?`），表示该成员是可选的

```typescript
let a:[number, number?] = [1];
```

注意，问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后。

```typescript
type myTuple = [
  number,
  number,
  number?,
  string?
];
```

- 由于需要声明每个成员的类型，所以大多数情况下，元组的成员数量是有限的，从类型声明就可以明确知道，元组包含多少个成员，越界的成员会报错

```typescript
let x:[string, string] = ['a', 'b'];

x[2] = 'c'; // 报错
```

- 使用扩展运算符（`...`），可以表示不限成员数量的元组

```typescript
type NamedNums = [
  string,
  ...number[]
];

const a:NamedNums = ['A', 1, 2];
const b:NamedNums = ['B', 1, 2, 3];
```

- 扩展运算符（`...`）用在元组的任意位置都可以，它的后面只能是一个数组或元组

```typescript
type t1 = [string, number, ...boolean[]];
type t2 = [string, ...boolean[], number];
type t3 = [...boolean[], string, number];
```

- 如果不确定元组成员的类型和数量，可以写成下面这样；这样写，也就失去了使用元组和 TypeScript 的意义。

```typescript
type Tuple = [...any[]];
```

- 元组可以通过方括号，读取成员类型。

```typescript
type Tuple = [string, number];
type Age = Tuple[1]; // number
```

- 由于元组的成员都是数值索引，即索引类型都是number，所以可以像下面这样读取。

```typescript
type Tuple = [string, number, Date];
type TupleEl = Tuple[number];  // string|number|Date
```

> Tuple[number]表示元组Tuple的所有数值索引的成员类型，所以返回string|number|Date，即这个类型是三种值的联合类型。

## 只读元祖

元组也可以是只读的，不允许修改，有两种写法：

```typescript
// 写法一
type t = readonly [number, string]

// 写法二
type t = Readonly<[number, string]>
```

跟数组一样，只读元组是元组的父类型。所以，元组可以替代只读元组，而只读元组不能替代元组。

```typescript
type t1 = readonly [number, number];
type t2 = [number, number];

let x:t2 = [1, 2];
let y:t1 = x; // 正确

x = y; // 报错
```

# Symbol

## Symbol基础

Symbol 是 ES2015 新引入的一种原始类型的值。它类似于字符串，但是每一个 Symbol 值都是独一无二的，与其他任何值都不相等。<br>Symbol 值通过Symbol()函数生成。在 TypeScript 里面，Symbol 的类型使用symbol表示。

```typescript
let x:symbol = Symbol();
let y:symbol = Symbol();

x === y // false
```

## unique symbol

`symbol`类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。

> 5是一个具体的数值，就用5这个字面量来表示，这也是它的值类型。但是，Symbol 值不存在字面量，必须通过变量来引用，所以写不出只包含单个 Symbol 值的那种值类型。

为了解决这个问题，TypeScript 设计了symbol的一个子类型`unique symbol`，它表示单个的、某个具体的 Symbol 值。<br>因为`unique symbol`表示单个值，所以这个类型的变量是不能修改值的，只能用const命令声明，不能用let声明。

```typescript
// 正确
const x:unique symbol = Symbol();

// 报错
let y:unique symbol = Symbol();
```

const命令为变量赋值 Symbol 值时，变量类型默认就是unique symbol，所以类型可以省略不写。

```typescript
const x:unique symbol = Symbol();
// 等同于
const x = Symbol();
```

每个声明为unique symbol类型的变量，它们的值都是不一样的，其实属于两个值类型。

```typescript
const a:unique symbol = Symbol();
const b:unique symbol = Symbol();

a === b // 报错
```

unique symbol 类型的一个作用，就是用作属性名，这可以保证不会跟其他属性名冲突。如果要把某一个特定的 Symbol 值当作属性名，那么它的类型只能是 unique symbol，不能是 symbol。

```typescript
const x:unique symbol = Symbol();
const y:symbol = Symbol();

interface Foo {
  [x]: string; // 正确
  [y]: string; // 报错
}
```

> 变量y当作属性名，但是y的类型是 symbol，不是固定不变的值，导致报错。

unique symbol类型也可以用作类（class）的属性值，但只能赋值给类的readonly static属性。

```typescript
class C {
  static readonly foo:unique symbol = Symbol();
}
```

## 类型推断

如果变量声明时没有给出类型，TypeScript 会推断某个 Symbol 值变量的类型。

- let命令声明的变量，推断类型为 symbol。

```typescript
/ 类型为 symbol
let x = Symbol();
```

- const命令声明的变量，推断类型为 unique symbol。

```typescript
// 类型为 unique symbol
const x = Symbol();
```

但是，const命令声明的变量，如果赋值为另一个 symbol 类型的变量，则推断类型为 symbol。

```typescript
let x = Symbol();

// 类型为 symbol
const y = x;
```

let命令声明的变量，如果赋值为另一个 unique symbol 类型的变量，则推断类型还是 symbol。

```typescript
const x = Symbol();

// 类型为 symbol
let y = x;
```

# TypeScript 的类型断言

## 什么是类型断言？

对于没有类型声明的值，TypeScript 会进行类型推断，很多时候得到的结果，未必是开发者想要的。

```typescript
type T = 'a'|'b'|'c';
let foo = 'a';

let bar:T = foo; // 报错
```

> 后一行报错，原因是 TypeScript 推断变量foo的类型是string，而变量bar的类型是'a'|'b'|'c'，前者是后者的父类型。父类型不能赋值给子类型，所以就报错了。

TypeScript 提供了“类型断言”这样一种手段，允许开发者在代码中“断言”某个值的类型，告诉编译器此处的值是什么类型。TypeScript 一旦发现存在类型断言，就不再对该值进行类型推断，而是直接采用断言给出的类型。

> 这种做法的实质是，允许开发者在某个位置“绕过”编译器的类型推断，让本来通不过类型检查的代码能够通过，避免编译器报错。这样虽然削弱了 TypeScript 类型系统的严格性，但是为开发者带来了方便，毕竟开发者比编译器更了解自己的代码。

上面的例子，解决方法就是进行类型断言，在赋值时断言变量foo的类型。

```typescript
type T = 'a'|'b'|'c';

let foo = 'a';
let bar:T = foo as T; // 正确
```

总之，类型断言并不是真的改变一个值的类型，而是提示编译器，应该如何处理这个值。

## 类型断言语法

类型断言有两种语法：

```typescript
// 语法一：<类型>值
<Type>value

// 语法二：值 as 类型
value as Type
```

上面两种语法是等价的，value表示值，Type表示类型。早期只有语法一，后来因为 TypeScript 开始支持 React 的 `JSX` 语法（尖括号表示 HTML 元素），为了避免两者冲突，就引入了语法二。目前，推荐使用语法二。

```typescript
// 语法一
let bar:T = <T>foo;

// 语法二
let bar:T = foo as T;
```

> 其中的语法一因为跟 JSX 语法冲突，使用时必须关闭 TypeScript 的 React 支持，否则会无法识别。由于这个原因，现在一般都使用语法二。

类型断言的一大用处是，指定 unknown 类型的变量的具体类型。

```typescript
const value:unknown = 'Hello World';

const s1:string = value; // 报错
const s2:string = value as string; // 正确
```

另外，类型断言也适合指定联合类型的值的具体类型。

```typescript
const s1:number|string = 'hello';
const s2:number = s1 as number;
```

## 类型断言的条件

- 类型断言并不意味着，可以把某个值断言为任意类型。
- 类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件。

```typescript
expr as T
// expr是实际的值，T是类型断言，它们必须满足下面的条件：expr是T的子类型，或者T是expr的子类型。
```

也就是说，类型断言要求实际的类型与断言的类型兼容，实际类型可以断言为一个更加宽泛的类型（父类型），也可以断言为一个更加精确的类型（子类型），但不能断言为一个完全无关的类型。

## as const 断言

如果没有声明变量类型，let 命令声明的变量，会被类型推断为 TypeScript 内置的基本类型之一；const 命令声明的变量，则被推断为值类型常量。

```typescript
// 类型推断为基本类型 string
let s1 = 'JavaScript';

// 类型推断为字符串 “JavaScript”
const s2 = 'JavaScript';
```

> 变量s1的类型被推断为string，变量s2的类型推断为值类型JavaScript。后者是前者的子类型，相当于 const 命令有更强的限定作用，可以缩小变量的类型范围。

有些时候，let 变量会出现一些意想不到的报错，变更成 const 变量就能消除报错。

```typescript
let s = 'JavaScript';

type Lang =
  |'JavaScript'
  |'TypeScript'
  |'Python';

function setLang(language:Lang) {
  /* ... */
}

setLang(s); // 报错
```

## 非空断言

对于那些可能为空的变量（即可能等于`undefined`或`null`），TypeScript 提供了非空断言，保证这些变量不会为空，写法是在变量名后面加上感叹号`!`。

```typescript
function f(x?:number|null) {
  validateNumber(x); // 自定义函数，确保 x 是数值
  console.log(x!.toFixed());
}

function validateNumber(e?:number|null) {
  if (typeof e !== 'number')
    throw new Error('Not a number');
}
```
