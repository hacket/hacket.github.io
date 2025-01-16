---
date created: 2024-04-13 10:38
date updated: 2024-12-25 00:59
dg-publish: true
---

# JS数据类型

## 数据类型分类

JavaScript 语言的每一个值，都属于某一种数据类型。JavaScript 的数据类型，共有六种。（ES6 又新增了 Symbol 和 BigInt 数据类型）

- 数值（number）：整数和小数（比如1和3.14）。
- 字符串（string）：文本（比如Hello World）。
- 布尔值（boolean）：表示真伪的两个特殊值，即true（真）和false（假）。
- undefined：表示“未定义”或不存在，即由于目前没有定义，所以此处暂时没有任何值。
- null：表示空值，即此处的值为空。
- 对象（object）：各种值组成的集合。

通常，数值、字符串、布尔值这三种类型，合称为原始类型（primitive type）的值，即它们是最基本的数据类型，不能再细分了。对象则称为合成类型（complex type）的值，因为一个对象往往是多个原始类型的值的合成，可以看作是一个存放各种值的容器。至于undefined和null，一般将它们看成两个特殊值。<br>对象是最复杂的数据类型，又可以分成三个子类型：

- 狭义的对象（object）
- 数组（array）
- 函数（function）：函数其实是处理数据的方法，JavaScript 把它当成一种数据类型，可以赋值给变量，这为编程带来了很大的灵活性，也为 JavaScript 的“函数式编程”奠定了基础。

> 注：**Symbol** 是 ES6 引入了一种新的原始数据类型，表示独一无二的值。

| **变量**                                                               | **解释**                                    | **示例**                                                                           |
| -------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| [String](https://developer.mozilla.org/zh-CN/docs/Glossary/String)   | 字符串（一串文本）：字符串的值必须用引号（单双均可，必须成对）括起来。       | let myVariable = '李雷';                                                           |
| [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)   | 数字：无需引号。                                  | let myVariable = 10;                                                             |
| [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean) | 布尔值（真 / 假）： true/false 是 JS 里的特殊关键字，无需引号。 | let myVariable = true;                                                           |
| [Array](https://developer.mozilla.org/zh-CN/docs/Glossary/Array)     | 数组：用于在单一引用中存储多个值的结构。                      | let myVariable = [1, '李雷', '韩梅梅', 10];<br>元素引用方法：myVariable[0], myVariable[1] …… |
| [Object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)   | 对象：JavaScript 里一切皆对象，一切皆可储存在变量里。这一点要牢记于心。 | let myVariable = document.querySelector('h1');<br>以及上面所有示例都是对象。                  |

- [ ] [完整的数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

## typeof 运算符

JavaScript 有三种方法，可以确定一个值到底是什么类型：

- `typeof`运算符
- `instanceof`运算符
- `Object.prototype.toString`方法

```javascript
typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"

function f() {}
typeof f
// "function"

typeof undefined
// "undefined"

typeof window // "object"
typeof {} // "object"
typeof [] // "object"  空数组（[]）的类型也是object

typeof null // "object"
```

typeof可以用来检查一个没有声明的变量，而不报错。

```javascript
v
// ReferenceError: v is not defined

typeof v
// "undefined"
```

变量`v`没有用var命令声明，直接使用就会报错。但是，放在typeof后面，就不报错了，而是返回`undefined`。实际编程中，这个特点通常用在判断语句。

```javascript
// 错误的写法
if (v) {
  // ...
}
// ReferenceError: v is not defined

// 正确的写法
if (typeof v === "undefined") {
  // ...
}
```

`instanceof`运算符可以区分数组和对象。

```javascript
var o = {};
var a = [];

o instanceof Array // false
a instanceof Array // true
```

## 声明变量类型

当您声明新变量时，可以使用关键词 "new" 来声明其类型：

```javascript
var carname=new String;
var x=      new Number;
var y=      new Boolean;
var cars=   new Array;
var person= new Object;
```

> JavaScript 变量均为对象。当您声明一个变量时，就创建了一个新的对象。

## 动态类型

JavaScript 拥有动态类型。这意味着相同的变量可用作不同的类型：

```javascript
var x;               
// x 为 undefinedvar x = 5;           
// 现在 x 为数字
var x = "John";      // 现在 x 为字符串
```

变量的数据类型可以使用 `typeof` 操作符来查看：

```javascript
typeof "John"                // 返回 string
typeof 3.14                  // 返回 number
typeof false                 // 返回 boolean
typeof [1,2,3,4]             // 返回 object
typeof {name:'John', age:34} // 返回 object
```

## 字符串 string

字符串是存储字符（比如 "Bill Gates"）的变量。<br>字符串可以是引号中的任意文本。您可以使用单引号 `''` 或双引号 `""`：

```javascript
var carname="Volvo XC60";
var carname='Volvo XC60';
```

可以在字符串中使用引号，只要不匹配包围字符串的引号即可(单双引号混合)：

```javascript
var answer="It's alright";
var answer="He is called 'Johnny'";
var answer='He is called "Johnny"';
```

### 字符串模板

JavaScript 中的模板字符串是一种方便的字符串语法，允许你在字符串中嵌入表达式和变量。<br>模板字符串使用反引号 ```` 作为字符串的定界符分隔的字面量。

模板字面量是用反引号（``）分隔的字面量，允许多行字符串、带嵌入表达式的字符串插值和一种叫带标签的模板的特殊结构。

语法：

```javascript
`string text`

`string text line 1
 string text line 2`

`string text ${expression} string text`

tagFunction`string text ${expression} string text`
```

参数：

- **string text**：将成为模板字面量的一部分的字符串文本。几乎允许所有字符，包括换行符和其他空白字符。但是，除非使用了标签函数，否则无效的转义序列将导致语法错误。
- **expression**：要插入当前位置的表达式，其值被转换为字符串或传递给 tagFunction。
- **tagFunction**：如果指定，将使用模板字符串数组和替换表达式调用它，返回值将成为模板字面量的值。

```javascript
const name = 'Runoob';
const age = 30;
const message = `My name is ${name} and I'm ${age} years old.`;
```

## 数值 number

### 数值概述

#### 整数和浮点数

JavaScript 内部，所有数字都是以**64位浮点数**形式储存，即使整数也是如此。所以，1与1.0是相同的，是同一个数。

```javascript
1 === 1.0 // true
```

JavaScript 语言的底层根本没有整数，所有数字都是小数（64位浮点数）。容易造成混淆的是，某些运算只有整数才能完成，此时 JavaScript 会自动把64位浮点数，转成32位整数，然后再进行运算。<br>由于浮点数不是精确的值，所以涉及小数的比较和运算要特别小心。

```javascript
0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

(0.3 - 0.2) === (0.2 - 0.1)
// false
```

#### 数值精度

#### 示例

JavaScript 只有一种数字类型。数字可以带小数点，也可以不带：

```javascript
var x1=34.00;      //使用小数点来写
var x2=34;             //不使用小数点来写
```

极大或极小的数字可以通过科学（指数）计数法来书写：

```javascript
var y=123e5;      // 12300000
var z=123e-5;     // 0.00123
```

### Ref

- [x] [数值](https://wangdoc.com/javascript/types/number)

## 布尔 boolean

布尔（逻辑）只能有两个值：true 或 false。

```javascript
var x=true;
var y=false;
```

如果 JavaScript 预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面六个值被转为false，其他值都视为true。

- undefined
- null
- false
- 0
- NaN
- `""`或`''`（空字符串）

注意，空数组（`[]`）和空对象（`{}`）对应的布尔值，都是true。

```javascript
if ([]) {
  console.log('true');
}
// true

if ({}) {
  console.log('true');
}
// true
```

## 数组 Array

### 数组定义

数组（array）是按次序排列的一组值。每个值的位置都有编号（从0开始），整个数组用方括号表示

```javascript
var arr = ['a', 'b', 'c'];

// 除了在定义时赋值，数组也可以先定义后赋值
var arr = [];
arr[0] = 'a';
arr[1] = 'b';
arr[2] = 'c';

// 任何类型的数据，都可以放入数组。
var arr = [
  {a: 1},
  [1, 2, 3],
  function() {return true;}
];

arr[0] // Object {a: 1}
arr[1] // [1, 2, 3]
arr[2] // function (){return true;}
// 上面数组arr的3个成员依次是对象、数组、函数。
```

如果数组的元素还是数组，就形成了多维数组。

```javascript
var a = [[1, 2], [3, 4]];
a[0][1] // 2
a[1][1] // 4
```

Array

```javascript
var cars=new Array();
cars[0]="Saab";
cars[1]="Volvo";
cars[2]="BMW";
// 或者 (condensed array):
var cars=new Array("Saab","Volvo","BMW");
// 或者 (literal array):
var cars=["Saab","Volvo","BMW"];
```

### 数组的本质

本质上，数组属于一种特殊的对象。typeof运算符会返回数组的类型是object

```javascript
typeof [1, 2, 3] // "object"
```

**键名：**Object.keys方法返回数组的所有键名。可以看到数组的键名就是整数0、1、2。

```javascript
var arr = ['a', 'b', 'c'];

Object.keys(arr)
// ["0", "1", "2"]
```

由于数组成员的键名是固定的（默认总是0、1、2...），因此数组不用为每个元素指定键名，而对象的每个成员都必须指定键名。JavaScript 语言规定，对象的键名一律为字符串，所以，数组的键名其实也是字符串。之所以可以用数值读取，是因为**非字符串的键名会被转为字符串**。

```javascript
var arr = ['a', 'b', 'c'];

arr['0'] // 'a'
arr[0] // 'a'
// 分别用数值和字符串作为键名，结果都能读取数组。原因是数值键名被自动转为了字符串。
```

赋值时也成立。一个值总是先转成字符串，再作为键名进行赋值

```javascript
var a = [];

a[1.00] = 6;
a[1] // 6
```

### length 属性

数组的length属性，返回数组的成员数量。

```javascript
['a', 'b', 'c'].length // 3
```

JavaScript 使用一个`32位`整数，保存数组的元素个数。这意味着，数组成员最多只有 4294967295 个（232 - 1）个，也就是说length属性的最大值就是 `4294967295`。<br>只要是数组，就一定有length属性。该属性是一个动态的值，等于键名中的最大整数加上1。

```javascript
var arr = ['a', 'b'];
arr.length // 2

arr[2] = 'c';
arr.length // 3

arr[9] = 'd';
arr.length // 10

arr[1000] = 'e';
arr.length // 1001
```

数组是一种动态的数据结构，可以随时增减数组的成员；length属性的值总是比最大的那个整数键大1<br>length属性是可写的。如果人为设置一个小于当前成员个数的值，该数组的成员数量会自动减少到length设置的值：

```javascript
var arr = [ 'a', 'b', 'c' ];
arr.length // 3

arr.length = 2;
arr // ["a", "b"]
```

清空数组的一个有效方法，就是将length属性设为0。

```javascript
var arr = [ 'a', 'b', 'c' ];

arr.length = 0;
arr // []
```

如果人为设置length大于当前元素个数，则数组的成员数量会增加到这个值，新增的位置都是空位

```javascript
var a = ['a'];

a.length = 3;
a[1] // undefined

// 上面代码表示，当length属性设为大于数组个数时，读取新增的位置都会返回undefined。
```

如果人为设置length为不合法的值，JavaScript 会报错。

```javascript
// 设置负值
[].length = -1
// RangeError: Invalid array length

// 数组元素个数大于等于2的32次方
[].length = Math.pow(2, 32)
// RangeError: Invalid array length

// 设置字符串
[].length = 'abc'
// RangeError: Invalid array length
```

值得注意的是，由于数组本质上是一种对象，所以可以为数组添加属性，但是这不影响length属性的值。

```javascript
var a = [];

a['p'] = 'abc';
a.length // 0

a[2.1] = 'abc';
a.length // 0
// 上面代码将数组的键分别设为字符串和小数，结果都不影响length属性。
// 因为，length属性的值就是等于最大的数字键加1，而这个数组没有整数键，所以length属性保持为0。
```

### in 运算符

检查某个键名是否存在的运算符`in`，适用于对象，也适用于数组

```javascript
var arr = [ 'a', 'b', 'c' ];
2 in arr  // true
'2' in arr // true
4 in arr // false
// 如果数组的某个位置是空位，in运算符返回false。
var arr = [];
arr[100] = 'a';

100 in arr // true
1 in arr // false
```

### for...in 循环和数组的遍历

```javascript
Explain
var a = [1, 2, 3];

for (var i in a) {
  console.log(a[i]);
}
// 1
// 2
// 3
```

`for...in`不仅会遍历数组所有的数字键，还会遍历非数字键

```javascript
var a = [1, 2, 3];
a.foo = true;

for (var key in a) {
  console.log(key);
}
// 0
// 1
// 2
// foo
// 上面代码在遍历数组时，也遍历到了非整数键foo。所以，不推荐使用for...in遍历数组。
```

数组的遍历可以考虑使用`for`循环或`while`循环：

```javascript
var a = [1, 2, 3];

// for循环
for(var i = 0; i < a.length; i++) {
  console.log(a[i]);
}

// while循环
var i = 0;
while (i < a.length) {
  console.log(a[i]);
  i++;
}

var l = a.length;
while (l--) {
  console.log(a[l]);
}
```

数组的`forEach`方法，也可以用来遍历数组：

```javascript
var colors = ['red', 'green', 'blue'];
colors.forEach(function (color) {
  console.log(color);
});
// red
// green
// blue
```

### 数组的空位

当数组的某个位置是空元素，即两个逗号之间没有任何值，我们称该数组存在空位（hole）

```javascript
var a = [1, , 1];
a.length // 3
```

如果最后一个元素后面有逗号，并不会产生空位。也就是说，有没有这个逗号，结果都是一样的。

```javascript
var a = [1, 2, 3,];

a.length // 3
a // [1, 2, 3]
```

数组的空位是可以读取的，返回undefined。

```javascript
var a = [, , ,];
a[1] // undefined
```

使用delete命令删除一个数组成员，会形成空位，并且不会影响length属性。

```javascript
var a = [1, 2, 3];
delete a[1];

a[1] // undefined
a.length // 3
```

> 用delete命令删除了数组的第二个元素，这个位置就形成了空位，但是对length属性没有影响。也就是说，length属性不过滤空位。所以，使用length属性进行数组遍历，一定要非常小心。

数组的某个位置是**空位**，与某个位置是undefined，是不一样的。如果是空位，使用数组的forEach方法、for...in结构、以及Object.keys方法进行遍历，空位都会被跳过。

```javascript
var a = [, , ,];

a.forEach(function (x, i) {
  console.log(i + '. ' + x);
})
// 不产生任何输出

for (var i in a) {
  console.log(i);
}
// 不产生任何输出

Object.keys(a)
// []
```

如果某个位置是**undefined**，遍历的时候就不会被跳过。

```javascript
var a = [undefined, undefined, undefined];

a.forEach(function (x, i) {
  console.log(i + '. ' + x);
});
// 0. undefined
// 1. undefined
// 2. undefined

for (var i in a) {
  console.log(i);
}
// 0
// 1
// 2

Object.keys(a)
// ['0', '1', '2']
```

空位就是数组没有这个元素，所以不会被遍历到，而undefined则表示数组有这个元素，值是undefined，所以遍历不会跳过

### 类似数组的对象

如果一个对象的所有键名都是正整数或零，并且有length属性，那么这个对象就很像数组，语法上称为“类似数组的对象”（array-like object）。

```javascript
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

obj[0] // 'a'
obj[1] // 'b'
obj.length // 3
obj.push('d') // TypeError: obj.push is not a function
```

对象obj就是一个类似数组的对象。但是，“类似数组的对象”并不是数组，因为它们不具备数组特有的方法。对象obj没有数组的push方法，使用该方法就会报错。<br>“类似数组的对象”的根本特征，就是具有length属性。只要有length属性，就可以认为这个对象类似于数组。但是有一个问题，这种length属性不是动态值，不会随着成员的变化而变化。

```javascript
var obj = {
  length: 0
};
obj[3] = 'd';
obj.length // 0
```

数组的`Array.prototype.slice`方法可以将“类似数组的对象”变成真正的数组

```javascript
var arr = Array.prototype.slice.call(arrayLike);
```

除了转为真正的数组，“类似数组的对象”还有一个办法可以使用数组的方法，就是通过call()把数组的方法放到对象上面。

```javascript
function print(value, index) {
  console.log(index + ' : ' + value);
}

Array.prototype.forEach.call(arrayLike, print);
```

这种方法比直接使用数组原生的forEach要慢，所以最好还是先将“类似数组的对象”转为真正的数组，然后再直接调用数组的forEach方法。

```javascript
var arr = Array.prototype.slice.call('abc');
arr.forEach(function (chr) {
  console.log(chr);
});
// a
// b
// c
```

## 函数

见`JS函数`

## 对象

见`JS面向对象`

## undefined 和 null

### undefined背景

JavaScript 的设计者 Brendan Eich，觉得这样做还不够。首先，第一版的 JavaScript 里面，null就像在 Java 里一样，被当成一个对象，Brendan Eich 觉得表示“无”的值最好不是对象。其次，那时的 JavaScript 不包括错误处理机制，Brendan Eich 觉得，如果null自动转为0，很不容易发现错误。<br>因此，他又设计了一个undefined。区别是这样的：`null`是一个表示“空”的对象，转为数值时为0；`undefined`是一个表示"此处无定义"的原始值，转为数值时为NaN。

```javascript
Number(null) // 0
5 + null // 5

Number(undefined) // NaN
5 + undefined // NaN
```

### 用法和含义

- `null`表示空值，即该处的值现在为空。调用函数时，某个参数未设置任何值，这时就可以传入null，表示该参数为空。比如，某个函数接受引擎抛出的错误作为参数，如果运行过程中未出错，那么这个参数就会传入null，表示未发生错误。
- `undefined`表示“未定义”
- 在if语句中，它们都会被自动转为false，相等运算符（==）甚至直接报告两者相等。

```javascript
if (!undefined) {
  console.log('undefined is false');
}
// undefined is false

if (!null) {
  console.log('null is false');
}
// null is false

undefined == null
// true
```

下面是返回undefined的典型场景：

```javascript
// 变量声明了，但没有赋值
var i;
i // undefined

// 调用函数时，应该提供的参数没有提供，该参数等于 undefined
function f(x) {
  return x;
}
f() // undefined

// 对象没有赋值的属性
var  o = new Object();
o.p // undefined

// 函数没有返回值时，默认返回 undefined
function f() {}
f() // undefined
```

## 类型转换

JavaScript 变量可以转换为新变量或其他数据类型：

- 通过使用 JavaScript 函数
- 通过 JavaScript 自身自动转换

### 将数字转换为字符串

全局方法 `String()` 可以将数字转换为字符串。<br>该方法可用于任何类型的数字，字母，变量，表达式：

```javascript
String(x)         // 将变量 x 转换为字符串并返回
String(123)       // 将数字 123 转换为字符串并返回
String(100 + 23)  // 将数字表达式转换为字符串并返回
```

Number 方法 `toString()` 也是有同样的效果。

```javascript
x.toString()(123).toString()(100 + 23).toString()
```

更多数字转换为字符串的方法：

- toExponential()	把对象的值转换为指数计数法。
- toFixed()	把数字转换为字符串，结果的小数点后有指定位数的数字。
- toPrecision()	把数字格式化为指定的长度。

### 将布尔值转换为字符串

全局方法 String() 可以将布尔值转换为字符串。

```javascript
String(false)        // 返回 "false"
String(true)         // 返回 "true"
```

Boolean 方法 toString() 也有相同的效果。

```javascript
false.toString()     // 返回 "false"
true.toString()      // 返回 "true"
```

### 将日期转换为字符串

Date() 返回字符串。

```javascript
Date()      // 返回 Thu Jul 17 2014 15:38:19 GMT+0200 (W. Europe Daylight Time)
```

全局方法 String() 可以将日期对象转换为字符串。

```javascript
String(new Date())      // 返回 Thu Jul 17 2014 15:38:19 GMT+0200 (W. Europe Daylight Time)
```

Date 方法 toString() 也有相同的效果。

```javascript
obj = new Date()
obj.toString()   // 返回 Thu Jul 17 2014 15:38:19 GMT+0200 (W. Europe Daylight Time)
```

多关于日期转换为字符串的函数：

| 法                 | 描述                            |
| ----------------- | ----------------------------- |
| getDate()         | 从 Date 对象返回一个月中的某一天 (1 ~ 31)。 |
| getDay()          | 从 Date 对象返回一周中的某一天 (0 ~ 6)。   |
| getFullYear()     | 从 Date 对象以四位数字返回年份。           |
| getHours()        | 返回 Date 对象的小时 (0 ~ 23)。       |
| getMilliseconds() | 返回 Date 对象的毫秒(0 ~ 999)。       |
| getMinutes()      | 返回 Date 对象的分钟 (0 ~ 59)。       |
| getMonth()        | 从 Date 对象返回月份 (0 ~ 11)。       |
| getSeconds()      | 返回 Date 对象的秒数 (0 ~ 59)。       |
| getTime()         | 返回 1970 年 1 月 1 日至今的毫秒数。      |

### 将字符串转换为数字

全局方法 Number() 可以将字符串转换为数字。

- 字符串包含数字(如 "3.14") 转换为数字 (如 3.14).
- 空字符串转换为 0。
- 其他的字符串会转换为 `NaN` (不是个数字)。

更多关于字符串转为数字的方法：

| 方法           | 描述                |
| ------------ | ----------------- |
| parseFloat() | 解析一个字符串，并返回一个浮点数。 |
| parseInt()   | 解析一个字符串，并返回一个整数。  |

### 一元运算符 +

Operator `+` 可用于将变量转换为数字：

```javascript
var y = "5";     
// y 是一个字符串
var x = + y;      
// x 是一个数字
```

如果变量不能转换，它仍然会是一个数字，但值为 NaN (不是一个数字)：

```javascript
var y = "John";  
// y 是一个字符串
var x = + y;      // x 是一个数字 (NaN)
```

### 将布尔值转换为数字

全局方法 Number() 可将布尔值转换为数字。

```javascript
Number(false)     // 返回 0
Number(true)      // 返回 1
```

### 将日期转换为数字

全局方法 Number() 可将日期转换为数字。

```javascript
d = new Date();
Number(d)          // 返回 1404568027739
```

日期方法 getTime() 也有相同的效果。

```javascript
d = new Date();
d.getTime()        // 返回 1404568027739
```

### 自动转换类型

当 JavaScript 尝试操作一个 "错误" 的数据类型时，会自动转换为 "正确" 的数据类型。<br>以下输出结果不是你所期望的：

```javascript
5 + null    // 返回 5         
null 转换为 0"5" + null  // 返回"5null"   
null 转换为 "null"
"5" + 1     // 返回 "51"      
1 转换为 "1"  
"5" - 1     // 返回 4         
"5" 转换为 5
```

### 自动转换为字符串

当你尝试输出一个对象或一个变量时 JavaScript 会自动调用变量的 toString() 方法：

```javascript
document.getElementById("demo").innerHTML = myVar;
myVar = {name:"Fjohn"}  // toString 转换为 "[object Object]"
myVar = [1,2,3,4]       // toString 转换为 "1,2,3,4"
myVar = new Date()      // toString 转换为 "Fri Jul 18 2014 09:08:55 GMT+0200"
```

数字和布尔值也经常相互转换：

```javascript
myVar = 123             // toString 转换为 "123"
myVar = true            // toString 转换为 "true"
myVar = false           // toString 转换为 "false"
```

下表展示了使用不同的数值转换为数字(Number), 字符串(String), 布尔值(Boolean):

| 原始值                 | 转换为数字     | 转换为字符串            | 转换为布尔值    |
| ------------------- | --------- | ----------------- | --------- |
| false               | 0         | "false"           | false     |
| true                | 1         | "true"            | true      |
| 0                   | 0         | "0"               | false     |
| 1                   | 1         | "1"               | true      |
| "0"                 | 0         | "0"               | **true**  |
| "000"               | 0         | "000"             | **true**  |
| "1"                 | 1         | "1"               | true      |
| NaN                 | NaN       | "NaN"             | false     |
| Infinity            | Infinity  | "Infinity"        | true      |
| -Infinity           | -Infinity | "-Infinity"       | true      |
| ""                  | **0**     | ""                | **false** |
| "20"                | 20        | "20"              | true      |
| "Runoob"            | NaN       | "Runoob"          | true      |
| [ ]                 | **0**     | ""                | true      |
| [20]                | **20**    | "20"              | true      |
| [10,20]             | NaN       | "10,20"           | true      |
| ["Runoob"]          | NaN       | "Runoob"          | true      |
| ["Runoob","Google"] | NaN       | "Runoob,Google"   | true      |
| function(){}        | NaN       | "function(){}"    | true      |
| { }                 | NaN       | "[object Object]" | true      |
| null                | **0**     | "null"            | false     |
| undefined           | NaN       | "undefined"       | false     |

## 表达式和运算符

| **运算符** | **解释**                                                   | **符号**       | **示例**                                                                      |
| ------- | -------------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| 加       | 将两个数字相加，或拼接两个字符串。                                        | `+`          | 6 + 9;<br>"Hello " + "world!";                                              |
| 减、乘、除   | 这些运算符操作与基础算术一致。只是乘法写作星号，除法写作斜杠。                          | `-`,`*`, `/` | **Explain**<br>9 - 3;<br>8 * 2; //乘法在 JS 中是一个星号<br>9 / 3;                   |
| 赋值运算符   | 为变量赋值（你之前已经见过这个符号了）                                      | `=`          | let myVariable = '李雷';                                                      |
| 等于      | 测试两个值是否相等，并返回一个 true/false （布尔）值。=== 为恒等计算符，同时检查表达式的值与类型 | `===`        | let myVariable = 3;<br>myVariable === 4; // false                           |
| 不等于     | 和等于运算符相反，测试两个值是否不相等，并返回一个 true/false （布尔）值。              | `!==`        | let myVariable = 3;<br>myVariable !== 3; // false                           |
| 取非      | 返回逻辑相反的值，比如当前值为真，则返回 false。                              | `!`          | 原式为真，但经取非后值为 false：<br>let myVariable = 3;<br>!(myVariable === 3); // false |

- [ ] [完整的表达式和运算符（mozilla）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators)

## JS异常

当错误发生时，当事情出问题时，JavaScript 引擎通常会停止，并生成一个错误消息。<br>描述这种情况的技术术语是：JavaScript 将抛出一个错误。

### try 和 catch

try 语句允许我们定义在执行时进行错误测试的代码块。<br>catch 语句允许我们定义当 try 代码块发生错误时，所执行的代码块。<br>JavaScript 语句 try 和 catch 是成对出现的。<br>语法：

```javascript
try {
    ...    //异常的抛出
} catch(e) {
    ...    //异常的捕获与处理
} finally {
    ...    //结束处理
}
```

示例：

```javascript
var txt=""; 
function message() 
{ 
    try { 
        adddlert("Welcome guest!"); 
    } catch(err) { 
        txt="本页有一个错误。\n\n"; 
        txt+="错误描述：" + err.message + "\n\n"; 
        txt+="点击确定继续。\n\n"; 
        alert(txt); 
    } 
}
```

### finally 语句

finally 语句不论之前的 try 和 catch 中是否产生异常都会执行该代码块。

```javascript
function myFunction() {
  var message, x;
  message = document.getElementById("p01");
  message.innerHTML = "";
  x = document.getElementById("demo").value;
  try { 
    if(x == "") throw "值是空的";
    if(isNaN(x)) throw "值不是一个数字";
    x = Number(x);
    if(x > 10) throw "太大";
    if(x < 5) throw "太小";
  }
  catch(err) {
    message.innerHTML = "错误: " + err + ".";
  }
  finally {
    document.getElementById("demo").value = "";
  }
}
```

### Throw 语句

throw 语句允许我们创建自定义错误。正确的技术术语是：创建或抛出异常（exception）。<br>如果把 throw 与 try 和 catch 一起使用，那么您能够控制程序流，并生成自定义的错误消息。<br>语法：

```javascript
throw exception
```

其中exception可以是 JavaScript 字符串、数字、逻辑值或对象。<br>示例：

```javascript
function myFunction() {
    var message, x;
    message = document.getElementById("message");
    message.innerHTML = "";
    x = document.getElementById("demo").value;
    try { 
        if(x == "")  throw "值为空";
        if(isNaN(x)) throw "不是数字";
        x = Number(x);
        if(x < 5)    throw "太小";
        if(x > 10)   throw "太大";
    }
    catch(err) {
        message.innerHTML = "错误: " + err;
    }
}
```

## let 和 const

ES2015(ES6) 新增加了两个重要的 JavaScript 关键字: `let` 和 `const`。

- let 声明的变量只在 let 命令所在的代码块内有效。
- const 声明一个只读的常量，一旦声明，常量的值就不能改变。

在 ES6 之前，JavaScript 只有两种作用域： 全局变量 与 函数内的局部变量。

### var 全局、局部变量

#### var全局变量

在函数外声明的变量作用域是全局的：

```javascript
var carName = "Volvo";
 
// 这里可以使用 carName 变量
 
function myFunction() {
    // 这里也可以使用 carName 变量
}
```

全局变量在 JavaScript 程序的任何地方都可以访问。

#### var局部变量

在函数内声明的变量作用域是局部的（函数内）：

```javascript
// 这里不能使用 carName 变量
 
function myFunction() {
    var carName = "Volvo";
    // 这里可以使用 carName 变量
}
 
// 这里不能使用 carName 变量
```

函数内使用 var 声明的变量只能在函数内访问，如果不使用 var 则是全局变量。

### JavaScript 块级作用域(Block Scope)

使用 `var` 关键字声明的变量不具备块级作用域的特性，它在 `{}` 外依然能被访问到。

```javascript
{ 
    var x = 2; 
}
// 这里可以使用 x 变量
```

在 ES6 之前，是没有块级作用域的概念的。<br>ES6 可以使用 let 关键字来实现块级作用域。<br>let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。

```javascript
{ 
    let x = 2;
}
// 这里不能使用 x 变量
```

### var重新定义变量

使用 var 关键字重新声明变量可能会带来问题。<br>在块中重新声明变量也会重新声明块外的变量：

```javascript
var x = 10;
// 这里输出 x 为 10
{ 
    var x = 2;
    // 这里输出 x 为 2
}
// 这里输出 x 为 2
```

let 关键字就可以解决这个问题，因为它只在 let 命令所在的代码块 {} 内有效。

```javascript
var x = 10;
// 这里输出 x 为 10
{ 
    let x = 2;
    // 这里输出 x 为 2
}
// 这里输出 x 为 10
```

### var、let循环作用域

使用 var 关键字：

```javascript
var i = 5;
for (var i = 0; i < 10; i++) {
    // 一些代码...
}
// 这里输出 i 为 10
```

使用 let 关键字：

```javascript
var i = 5;
for (let i = 0; i < 10; i++) {
    // 一些代码...
}
// 这里输出 i 为 5
```

> 在第一个实例中，使用了 var 关键字，它声明的变量是全局的，包括循环体内与循环体外。
> 在第二个实例中，使用 let 关键字， 它声明的变量作用域只在循环体内，循环体外的变量不受影响。

### let 全局、局部变量

#### let全局变量

在函数体外或代码块外使用 var 和 let 关键字声明的变量也有点类似。<br>它们的作用域都是 全局的：

```javascript
// 使用 var
var x = 2;       // 全局作用域

// 使用 let
let x = 2;       // 全局作用域
```

在 JavaScript 中, 全局作用域是针对 JavaScript 环境。<br>在 HTML 中, 全局作用域是针对 window 对象。<br>使用 var 关键字声明的全局作用域变量属于 window 对象:

```javascript
var carName = "Volvo";
// 可以使用 window.carName 访问变量
```

使用 let 关键字声明的全局作用域变量不属于 window 对象:

```javascript
let carName = "Volvo";
// 不能使用 window.carName 访问变量
```

#### let局部变量

在函数体内使用 var 和 let 关键字声明的变量有点类似。<br>它们的作用域都是 局部的:

```javascript
// 使用 var
function myFunction() {
    var carName = "Volvo";   // 局部作用域
}

// 使用 let
function myFunction() {
    let carName = "Volvo";   //  局部作用域
}
```

### var重置变量

使用 var 关键字声明的变量在任何地方都可以修改：

```javascript
var x = 2;
 
// x 为 2
 
var x = 3;
 
// 现在 x 为 3
```

在相同的作用域或块级作用域中，不能使用 let 关键字来重置 var 关键字声明的变量:

```javascript
var x = 2;       // 合法
let x = 3;       // 不合法

{
    var x = 4;   // 合法
    let x = 5   // 不合法
}
```

let 关键字在不同作用域，或不同块级作用域中是可以重新声明赋值的:

```javascript
let x = 2;       // 合法

{
    let x = 3;   // 合法
}

{
    let x = 4;   // 合法
}
```

### var变量提升

JavaScript 中，var 关键字定义的变量可以在使用后声明，也就是变量可以先使用再声明（[JavaScript 变量提升](https://www.runoob.com/js/js-hoisting.html)）。

```javascript
// 在这里可以使用 carName 变量
var carName;
```

let 关键字定义的变量则不可以在使用后声明，也就是变量需要先声明再使用。

```javascript
// 在这里不可以使用 carName 变量
let carName;
```

### const 关键字

const 用于声明一个或多个常量，声明时必须进行初始化，且初始化后值不可再修改：

```javascript
const PI = 3.141592653589793;
PI = 3.14;      // 报错
PI = PI + 10;   // 报错
```

const定义常量与使用let 定义的变量相似：

- 二者都是块级作用域
- 都不能和它所在作用域内的其他变量或函数拥有相同的名称

两者还有以下两点区别：

- const声明的常量必须初始化，而let声明的变量不用
- const 定义常量的值不能通过再赋值修改，也不能再次声明。而 let 定义的变量值可以修改。

```javascript
var x = 10;
// 这里输出 x 为 10
{ 
    const x = 2;
    // 这里输出 x 为 2
}
// 这里输出 x 为 10
```

const 声明的常量必须初始化：

```javascript
// 错误写法
const PI;
PI = 3.14159265359;

// 正确写法
const PI = 3.14159265359;
```

#### const: 并非真正的常量

const 的本质: const 定义的变量并非常量，并非不可变，它定义了一个常量引用一个值。使用 const 定义的对象或者数组，其实是可变的。下面的代码并不会报错：

```javascript
// 创建常量对象
const car = {type:"Fiat", model:"500", color:"white"};
 
// 修改属性:
car.color = "red";
 
// 添加属性
car.owner = "Johnson";
```

但是我们不能对常量对象重新赋值：

```javascript
const car = {type:"Fiat", model:"500", color:"white"};
car = {type:"Volvo", model:"EX60", color:"red"};    // 错误
```

#### const重置变量

使用 var 关键字声明的变量在任何地方都可以修改：

```javascript
var x = 2;    //  合法
var x = 3;    //  合法
x = 4;        //  合法
```

在相同的作用域或块级作用域中，不能使用 const 关键字来重置 var 和 let关键字声明的变量：

```javascript
var x = 2;         // 合法
const x = 2;       // 不合法
{
    let x = 2;     // 合法
    const x = 2;   // 不合法
}
```

在相同的作用域或块级作用域中，不能使用 const 关键字来重置 const 关键字声明的变量:

```javascript
const x = 2;       // 合法
const x = 3;       // 不合法
x = 3;             // 不合法
var x = 3;         // 不合法
let x = 3;         // 不合法

{
    const x = 2;   // 合法
    const x = 3;   // 不合法
    x = 3;         // 不合法
    var x = 3;     // 不合法
    let x = 3;     // 不合法
}
```

const 关键字在不同作用域，或不同块级作用域中是可以重新声明赋值的:

```javascript
const x = 2;       // 合法
{
    const x = 3;   // 合法
}
{
    const x = 4;   // 合法
}
```

#### const变量提升

JavaScript var 关键字定义的变量可以在使用后声明，也就是变量可以先使用再声明；<br>const 关键字定义的变量则不可以在使用后声明，也就是变量需要先声明再使用。

```javascript
carName = "Volvo";    // 在这里不可以使用 carName 变量
const carName = "Volvo";
```
