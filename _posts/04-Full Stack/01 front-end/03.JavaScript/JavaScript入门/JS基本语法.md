---
date created: 2024-12-25 00:58
date updated: 2024-12-25 00:58
dg-publish: true
---

# JavaScript概述

## 什么是JavaScript？

1. JavaScript是一们轻量级的脚本语言，不具备开发操作系统能力
2. JavaScript 也是一种嵌入式（embedded）语言。它本身提供的核心语法不算很多，只能用来做一些数学和逻辑运算。JavaScript 本身不提供任何与 I/O（输入/输出）相关的 API，都要靠宿主环境（host）提供，所以 JavaScript 只合适嵌入更大型的应用程序环境，去调用宿主环境提供的底层 API。已经嵌入 JavaScript 的宿主环境有多种，最常见的环境就是浏览器，另外还有服务器环境，也就是 Node 项目
3. JavaScript 并不是纯粹的“面向对象语言”，还支持其他编程范式（比如函数式编程）
4. JavaScript 的核心语法部分相当精简，只包括两个部分：基本的语法构造（比如操作符、控制结构、语句）和标准库（就是一系列具有各种功能的对象比如Array、Date、Math等）。除此之外，各种宿主环境提供额外的 API（即只能在该环境使用的接口），以便 JavaScript 调用。

以**浏览器**为例，它提供的额外 API 可以分成三大类。

1. 浏览器控制类：操作浏览器
2. DOM 类：操作网页的各种元素
3. Web 类：实现互联网的各种功能

如果宿主环境是**服务器**，则会提供各种操作系统的 API，比如文件操作 API、网络通信 API等等。这些你都可以在 Node 环境中找到。

# JavaScript语法

## 注释

```javascript
// 这是一条注释。

/*
这里的所有内容
都是注释。
*/
```

由于历史上 JavaScript 可以兼容 HTML 代码的注释，所以`<!--`和`-->`也被视为合法的单行注释。

```javascript
x = 1; <!-- x = 2;
--> x = 3;
```

需要注意的是，`-->`只有在行首，才会被当成单行注释，否则会当作正常的运算。

```javascript
function countdown(n) {
  while (n --> 0) console.log(n);
}
countdown(3)
// 2
// 1
// 0
```

## 标识符

标识符命名规则如下。

- 第一个字符，可以是任意 Unicode 字母（包括英文字母和其他语言的字母），以及美元符号（$）和下划线（_）。
- 第二个字符及后面的字符，除了 Unicode 字母、美元符号和下划线，还可以用数字0-9。

不合法的标识符：

```javascript
1a  // 第一个字符不能是数字
23  // 同上
***  // 标识符不能包含星号
a+b  // 标识符不能包含加号
-d  // 标识符不能包含减号或连词线
```

中文是合法的标识符，可以用作变量名

```javascript
var 临时变量 = 1;
```

JavaScript 有一些保留字，不能用作标识符：`arguments、break、case、catch、class、const、continue、debugger、default、delete、do、else、enum、eval、export、extends、false、finally、for、function、if、implements、import、in、instanceof、interface、let、new、null、package、private、protected、public、return、static、super、switch、this、throw、true、try、typeof、var、void、while、with、yield`。

## 变量

与代数一样，JavaScript 变量可用于存放值（比如 x=5）和表达式（比如 z=x+y）。<br />变量可以使用短名称（比如 x 和 y），也可以使用描述性更好的名称（比如 age, sum, totalvolume）。

- 变量必须以字母开头
- 变量也能以 `$` 和 `_` 符号开头（不过不推荐这么做）
- 变量名称对大小写敏感（y 和 Y 是不同的变量）

要声明一个变量，先输入关键字 `let` 或 `var`，然后输入合适的名称：

```javascript
let myVariable;
// 赋值
myVariable = "李雷";

// 也可以将定义、赋值操作写在同一行：
let myVariable = "李雷";

// 变量在赋值后是可以更改的：
let myVariable = '李雷';
myVariable = '韩梅梅';
```

> 备注： JavaScript 对大小写敏感，myVariable 和 myvariable 是不同的。如果代码出现问题了，先检查一下大小写！

### 变量提升

JavaScript 引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（hoisting）。

```javascript
console.log(a);
var a = 1;
```

## 区块

JavaScript 使用大括号，将多个相关的语句组合在一起，称为“区块”（block）。<br />对于`var`命令来说，JavaScript 的区块不构成单独的作用域（scope）。

```javascript
{
  var a = 1;
}

a // 1
```

上面代码在区块内部，使用var命令声明并赋值了变量a，然后在区块外部，变量a依然有效，区块对于var命令不构成单独的作用域，与不使用区块的情况没有任何区别。<br />在 JavaScript 语言中，单独使用区块并不常见，区块往往用来构成其他更复杂的语法结构，比如for、if、while、function等。

## JavaScript 语句

### 分号 ;

分号用于分隔 JavaScript 语句。<br />通常我们在每条可执行的语句结尾添加分号。<br />使用分号的另一用处是在一行中编写多条语句。

```javascript
a = 5;
b = 6;
c = a + b;
// 以上实例也可以这么写:
a = 5; b = 6; c = a + b;
```

### JavaScript 语句标识符

JavaScript 语句通常以一个 语句标识符 为开始，并执行该语句。<br />语句标识符是保留关键字不能作为变量名使用。<br />下表列出了 JavaScript 语句标识符 (关键字) ：

| 语句           | 描述                               |
| ------------ | -------------------------------- |
| break        | 用于跳出循环。                          |
| catch        | 语句块，在 try 语句块执行出错时执行 catch 语句块。  |
| continue     | 跳过循环中的一个迭代。                      |
| do ... while | 执行一个语句块，在条件语句为 true 时继续执行该语句块。   |
| for          | 在条件语句为 true 时，可以将代码块执行指定的次数。     |
| for ... in   | 用于遍历数组或者对象的属性（对数组或者对象的属性进行循环操作）。 |
| function     | 定义一个函数                           |
| if ... else  | 用于基于不同的条件来执行不同的动作。               |
| return       | 退出函数                             |
| switch       | 用于基于不同的条件来执行不同的动作。               |
| throw        | 抛出（生成）错误 。                       |
| try          | 实现错误处理，与 catch 一同使用。             |
| var          | 声明一个变量。                          |
| while        | 当条件语句为 true 时，执行语句块。             |

### 空格

JavaScript 会忽略多余的空格。您可以向脚本添加空格，来提高其可读性。下面的两行代码是等效的：

```javascript
var person="runoob";
var person = "runoob";
```

### 对代码行进行折行

可以在文本字符串中使用反斜杠`\`对代码行进行换行。

```javascript
document.write("你好 \
世界!");
// 不过，不能像这样执行：
document.write \ 
("你好世界!");
```

### 三元运算符 `?:`

> (条件) ? 表达式1 : 表达式2

如果“条件”为true，则返回“表达式1”的值，否则返回“表达式2”的值<br />示例：

```javascript
var even = (n % 2 === 0) ? true : false;
// 等同于
var even;
if (n % 2 === 0) {
  even = true;
} else {
  even = false;
}
```

### 条件语句

条件语句是一种代码结构，用来测试表达式的真假，并根据测试结果运行不同的代码

#### if结构

```javascript
if (布尔值)
  语句;

// 或者
if (布尔值) 语句;
```

有些开发者习惯将常量写在运算符的左边，这样的话，一旦不小心将相等运算符写成赋值运算符，就会报错，因为常量不能被赋值。

```javascript
if (x = 2) { // 不报错
if (2 = x) { // 报错
```

#### if else 结构

示例：

```javascript
let iceCream = "chocolate";
if (iceCream === "chocolate") {
  alert("我最喜欢巧克力冰淇淋了。");
} else {
  alert("但是巧克力才是我的最爱呀……");
}
```

#### if else if else

```javascript
if (time<10)
{
    document.write("<b>早上好</b>");
}
else if (time>=10 && time<20)
{
    document.write("<b>今天好</b>");
}
else
{
    document.write("<b>晚上好!</b>");
}
```

#### switch

```javascript
switch(n)
{
    case 1:
        执行代码块 1
        break;
    case 2:
        执行代码块 2
        break;
    default:
        与 case 1 和 case 2 不同时执行的代码
}
```

示例：

```javascript
var d=new Date().getDay();
switch (d)
{
    case 6:x="今天是星期六";
    break;
    case 0:x="今天是星期日";
    break;
    default:
    x="期待周末";
}
document.getElementById("demo").innerHTML=x;
```

### 循环语句

#### for - 循环代码块一定的次数

```javascript
for (var i=0; i<5; i++)
{
      x=x + "该数字为 " + i + "<br>";
}
```

#### for/in - 循环遍历对象的属性

```javascript
var person={fname:"Bill",lname:"Gates",age:56}; 
 
for (x in person)  // x 为属性名
{
    txt=txt + person[x];
}
```

#### while - 当指定的条件为 true 时循环指定的代码块

while 循环会在指定条件为真时循环执行代码块

```javascript
while (i<5)
{
    x=x + "The number is " + i + "<br>";
    i++;
}
```

#### do/while - 同样当指定的条件为 true 时循环指定的代码块

do/while 循环是 while 循环的变体。该循环会在检查条件是否为真之前执行一次代码块，然后如果条件为真的话，就会重复这个循环。<br />该循环至少会执行一次，即使条件为 false 它也会执行一次，因为代码块会在条件被测试前执行：

```javascript
do
{
    x=x + "The number is " + i + "<br>";
    i++;
}
while (i<5);
```

#### break 和 continue 语句

- break 语句用于跳出循环。
- continue 用于跳过循环中的一个迭代。

```javascript
for (i=0;i<10;i++)
{
    if (i==3) break;
    x=x + "The number is " + i + "<br>";
}

while (i < 10){
  if (i == 3){
    i++;    //加入i++不会进入死循环
    continue;
  }
  x= x + "该数字为 " + i + "<br>";
  i++;
}
```

#### JavaScript 标签

可以对 JavaScript 语句进行标记。<br />如需标记 JavaScript 语句，请在语句之前加上冒号`：`

```javascript
label:
statements
```

break 和 continue 语句仅仅是能够跳出代码块的语句。<br />语法:

```javascript
break labelname; 
 
continue labelname;
```

- continue 语句（带有或不带标签引用）只能用在循环中。
- break 语句（不带标签引用），只能用在循环或 switch 中。

通过标签引用，break 语句可用于跳出任何 JavaScript 代码块：

```javascript
cars=["BMW","Volvo","Saab","Ford"];
list: 
{
    document.write(cars[0] + "<br>"); 
    document.write(cars[1] + "<br>"); 
    document.write(cars[2] + "<br>"); 
    break list;
    document.write(cars[3] + "<br>"); 
    document.write(cars[4] + "<br>"); 
    document.write(cars[5] + "<br>"); 
}
```

## 运算符

### 算术运算符

JavaScript 共提供10个算术运算符，用来完成基本的算术运算。

- **加法运算符**：x + y
- **减法运算符**： x - y
- **乘法运算符**： x * y
- **除法运算符**：x / y
- **指数运算符**：x ** y
- **余数运算符**：x % y
- **自增运算符**：++x 或者 x++
- **自减运算符**：--x 或者 x--
- **数值运算符**： +x
- **负数值运算符**：-x

#### 加法运算符

##### 基本规则

JavaScript 允许非数值的相加：

```javascript
true + true // 2
1 + true // 2
```

> 第一行是两个布尔值相加，第二行是数值与布尔值相加。这两种情况，布尔值都会自动转成数值，然后再相加。

如果是两个字符串相加，这时加法运算符会变成连接运算符，返回一个新的字符串，将两个原字符串连接在一起。

```javascript
'a' + 'bc' // "abc"
```

如果一个运算子是字符串，另一个运算子是非字符串，这时非字符串会转成字符串，再连接在一起。

```javascript
1 + 'a' // "1a"
false + 'a' // "falsea"
```

**加法运算符是在运行时决定，到底是执行相加，还是执行连接。**<br />也就是说，运算子的不同，导致了不同的语法行为，这种现象称为“**重载**”（overload）。由于加法运算符存在重载，可能执行两种运算，使用的时候必须很小心。

```javascript
'3' + 4 + 5 // "345"
3 + 4 + '5' // "75"
// 由于从左到右的运算次序，字符串的位置不同会导致不同的结果。
```

除了加法运算符，其他算术运算符（比如减法、除法和乘法）都不会发生重载。它们的规则是：所有运算子一律转为数值，再进行相应的数学运算。

```javascript
1 - '2' // -1
1 * '2' // 2
1 / '2' // 0.5
```

##### 对象的相加

如果运算子是对象，必须先转成原始类型的值，然后再相加。

```javascript
var obj = { p: 1 };
obj + 2 // "[object Object]2"
// 对象obj转成原始类型的值是[object Object]
```

对象转成原始类型的值，规则如下：

- 自动调用对象的valueOf方法，一般来说，对象的`valueOf()`方法总是返回对象自身
- 再调用toString()方法，对象的toString方法默认返回`[object Object]`

自己定义valueOf方法或toString方法：

```javascript
// 自定义valueOf()
var obj = {
  valueOf: function () {
    return 1;
  }
};

obj + 2 // 3

// 自定义toString()
var obj = {
  toString: function () {
    return 'hello';
  }
};

obj + 2 // "hello2"
```

如果运算子是一个Date对象的实例，那么会优先执行toString方法。

```javascript
var obj = new Date();
obj.valueOf = function () { return 1 };
obj.toString = function () { return 'hello' };

obj + 2 // "hello2"
```

> 对象obj是一个Date对象的实例，并且自定义了valueOf方法和toString方法，结果toString方法优先执行。

#### 余数运算符

余数运算符（`%`）返回前一个运算子被后一个运算子除，所得的余数。

```javascript
12 % 5 // 2
```

需要注意的是，运算结果的正负号由第一个运算子的正负号决定。

```javascript
-1 % 2 // -1
1 % -2 // 1
```

所以，为了得到负数的正确余数值，可以先使用绝对值函数

```javascript
// 错误的写法
function isOdd(n) {
  return n % 2 === 1;
}
isOdd(-5) // false
isOdd(-4) // false

// 正确的写法
function isOdd(n) {
  return Math.abs(n % 2) === 1;
}
isOdd(-5) // true
isOdd(-4) // false
```

#### 自增和自减运算符

自增和自减运算符，是一元运算符，只需要一个运算子。它们的作用是将运算子首先转为数值，然后加上1或者减去1。它们会修改原始变量。

```javascript
var x = 1;
++x // 2
x // 2

--x // 1
x // 1
```

自增和自减运算符有一个需要注意的地方，就是放在变量之后，会先返回变量操作前的值，再进行自增/自减操作；放在变量之前，会先进行自增/自减操作，再返回变量操作后的值。

```javascript
var x = 1;
var y = 1;

x++ // 1
++y // 2
```

运算之后，**变量的值发生变化，这种效应叫做运算的副作用**（`side effect`）。自增和自减运算符是仅有的两个具有副作用的运算符，其他运算符都不会改变变量的值。

#### 数值运算符，负数值运算符

数值运算符（`+`）同样使用加号，但它是一元运算符（只需要一个操作数），而加法运算符是二元运算符（需要两个操作数）。<br />数值运算符的作用在于可以将任何值转为数值（与Number函数的作用相同）。

```javascript
+true // 1
+[] // 0
+{} // NaN
```

负数值运算符（`-`），也同样具有将一个值转为数值的功能，只不过得到的值正负相反。连用两个负数值运算符，等同于数值运算符。

```javascript
var x = 1;
-x // -1
-(-x) // 1 圆括号不可少，否则会变成自减运算符
```

数值运算符号和负数值运算符，都会返回一个新的值，而不会改变原始变量的值。

#### 指数运算符

指数运算符（`**`）完成指数运算，前一个运算子是底数，后一个运算子是指数。

```javascript
2 ** 4 // 16
```

注意，指数运算符是**右结合**，而不是左结合。即多个指数运算符连用时，先进行最右边的计算：

```javascript
// 相当于 2 ** (3 ** 2)
2 ** 3 ** 2
// 512
```

#### 赋值运算符

赋值运算符（Assignment Operators）用于给变量赋值。<br />最常见的赋值运算符，当然就是等号（`=`）。

```javascript
// 将 1 赋值给变量 x
var x = 1;
// 将变量 y 的值赋值给变量 x
var x = y;

// 赋值运算符还可以与其他运算符结合，形成变体。下面是与算术运算符的结合。
// 等同于 x = x + y
x += y

// 等同于 x = x - y
x -= y

// 等同于 x = x * y
x *= y

// 等同于 x = x / y
x /= y

// 等同于 x = x % y
x %= y

// 等同于 x = x ** y
x **= y

// 下面是与位运算符的结合
// 等同于 x = x >> y
x >>= y

// 等同于 x = x << y
x <<= y

// 等同于 x = x >>> y
x >>>= y

// 等同于 x = x & y
x &= y

// 等同于 x = x | y
x |= y

// 等同于 x = x ^ y
x ^= y
```

### 比较运算符

JavaScript 一共提供了8个比较运算符。

- > 大于运算符
- < 小于运算符
- <= 小于或等于运算符
- > = 大于或等于运算符
- == 相等运算符
- === 严格相等运算符
- != 不相等运算符
- !== 严格不相等运算符

这八个比较运算符分成两类：相等比较和非相等比较。两者的规则是不一样的，对于非相等的比较，算法是先看两个运算子是否都是字符串，如果是的，就按照字典顺序比较（实际上是比较 Unicode 码点）；否则，将两个运算子都转成数值，再比较数值的大小。

#### 非相等运算符：字符串的比较

字符串按照字典顺序进行比较。JavaScript 引擎内部首先比较首字符的 Unicode 码点。如果相等，再比较第二个字符的 Unicode 码点，以此类推。

```javascript
'cat' > 'dog' // false
'cat' > 'catalog' // false
```

#### 非相等运算符：非字符串的比较

如果两个运算子之中，至少有一个不是字符串，需要分成以下两种情况。

- 原始类型值

如果两个运算子都是原始类型的值，则是先转成数值再比较。

```javascript
5 > '4' // true
// 等同于 5 > Number('4')
// 即 5 > 4

true > false // true
// 等同于 Number(true) > Number(false)
// 即 1 > 0

2 > true // true
// 等同于 2 > Number(true)
// 即 2 > 1
```

需要注意与`NaN`的比较。任何值（包括NaN本身）与NaN使用非相等运算符进行比较，返回的都是false。

```javascript
1 > NaN // false
1 <= NaN // false
'1' > NaN // false
'1' <= NaN // false
NaN > NaN // false
NaN <= NaN // false
```

- 对象

如果运算子是对象，会转为原始类型的值（对象转换成原始类型的值，算法是先调用valueOf方法；如果返回的还是对象，再接着调用toString方法），再进行比较。

```javascript
var x = [2];
x > '11' // true
// 等同于 [2].valueOf().toString() > '11'
// 即 '2' > '11'

x.valueOf = function () { return '1' };
x > '11' // false
// 等同于 (function () { return '1' })() > '11'
```

两个对象之间的比较也是如此。

```javascript
[2] > [1] // true
// 等同于 [2].valueOf().toString() > [1].valueOf().toString()
// 即 '2' > '1'

[2] > [11] // true
// 等同于 [2].valueOf().toString() > [11].valueOf().toString()
// 即 '2' > '11'

({ x: 2 }) >= ({ x: 1 }) // true
// 等同于 ({ x: 2 }).valueOf().toString() >= ({ x: 1 }).valueOf().toString()
// 即 '[object Object]' >= '[object Object]'
```

#### 严格相等运算符 ===

JavaScript 提供两种相等运算符：`==`和`===`。<br />简单说，它们的区别是相等运算符（==）比较两个值是否相等，严格相等运算符（===）比较它们是否为“同一个值”。如果两个值不是同一类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转换成同一个类型，再用严格相等运算符进行比较。

- 不同类型的值

如果两个值的类型不同，直接返回false

```javascript
1 === "1" // false
true === "true" // false
```

- 同一类的原始类型值

同一类型的原始类型的值（数值、字符串、布尔值）比较时，值相同就返回true，值不同就返回false。

```javascript
1 === 0x1 // true
```

需要注意的是，`NaN`与任何值都不相等（包括自身）。另外，正0等于负0。

```javascript
NaN === NaN  // false
+0 === -0 // true
```

- 复合类型值

两个复合类型（对象、数组、函数）的数据比较时，不是比较它们的值是否相等，而是比较它们是否指向同一个地址。

```javascript
{} === {} // false
[] === [] // false
(function () {} === function () {}) // false
```

> 上面代码分别比较两个空对象、两个空数组、两个空函数，结果都是不相等。原因是对于复合类型的值，严格相等运算比较的是，它们是否引用同一个内存地址，而运算符两边的空对象、空数组、空函数的值，都存放在不同的内存地址，结果当然是false。

如果两个变量引用同一个对象，则它们相等。

```javascript
var v1 = {};
var v2 = v1;
v1 === v2 // true
```

注意，对于两个对象的比较，严格相等运算符比较的是地址，而大于或小于运算符比较的是值。

```javascript
var obj1 = {};
var obj2 = {};

obj1 > obj2 // false，比较值
obj1 < obj2 // false，比较值
obj1 === obj2 // false，比较地址
```

- `undefined` 和 `null`

undefined和null与自身严格相等

```javascript
undefined === undefined // true
null === null // true
```

由于变量声明后默认值是undefined，因此两个只声明未赋值的变量是相等的。

```javascript
var v1;
var v2;
v1 === v2 // true
```

#### 严格不相等运算符  !==

严格相等运算符有一个对应的“严格不相等运算符”（`!==`），它的算法就是先求严格相等运算符的结果，然后返回相反值。

```javascript
1 !== '1' // true
// 等同于
!(1 === '1')
```

#### 相等运算符 ==

相等运算符用来比较相同类型的数据时，与严格相等运算符完全一样：

```javascript
1 == 1.0
// 等同于
1 === 1.0
```

比较不同类型的数据时，相等运算符会先将数据进行类型转换，然后再用严格相等运算符比较。

- 原始类型值

原始类型的值会转换成数值再进行比较。

```javascript
1 == true // true
// 等同于 1 === Number(true)

0 == false // true
// 等同于 0 === Number(false)

2 == true // false
// 等同于 2 === Number(true)

2 == false // false
// 等同于 2 === Number(false)

'true' == true // false
// 等同于 Number('true') === Number(true)
// 等同于 NaN === 1

'' == 0 // true
// 等同于 Number('') === 0
// 等同于 0 === 0

'' == false  // true
// 等同于 Number('') === Number(false)
// 等同于 0 === 0

'1' == true  // true
// 等同于 Number('1') === Number(true)
// 等同于 1 === 1

'\n  123  \t' == 123 // true
// 因为字符串转为数字时，省略前置和后置的空格
```

- 对象与原始类型值比较

对象（这里指广义的对象，包括数组和函数）与原始类型的值比较时，对象转换成原始类型的值，再进行比较。

```javascript
// 数组与数值的比较
[1] == 1 // true

// 数组与字符串的比较
[1] == '1' // true
[1, 2] == '1,2' // true

// 对象与布尔值的比较
[1] == true // true
[2] == true // false
```

- undefined 和 null

undefined和null只有与自身比较，或者互相比较时，才会返回true；与其他类型的值比较时，结果都为false。

```javascript
undefined == undefined // true
null == null // true
undefined == null // true

false == null // false
false == undefined // false

0 == null // false
0 == undefined // false
```

- 相等运算符的缺点

相等运算符隐藏的类型转换，会带来一些违反直觉的结果。

```javascript
0 == ''             // true
0 == '0'            // true

2 == true           // false
2 == false          // false

false == 'false'    // false
false == '0'        // true

false == undefined  // false
false == null       // false
null == undefined   // true

' \t\r\n ' == 0     // true
```

#### 不相等运算符  !=

相等运算符有一个对应的“不相等运算符”（`!=`），它的算法就是先求相等运算符的结果，然后返回相反

```javascript
1 != '1' // false

// 等同于
!(1 == '1')
```

### 布尔运算符

布尔运算符用于将表达式转为布尔值，一共包含四个运算符。

- 取反运算符：`!`
- 且运算符：`&&`
- 或运算符：`||`
- 三元运算符：`?:`

#### 取反运算符（!）

取反运算符是一个感叹号，用于将布尔值变为相反值，即true变成false，false变成true。<br />对于非布尔值，取反运算符会将其转为布尔值。可以这样记忆，以下六个值取反后为true，其他值都为false。

- undefined
- null
- false
- 0
- NaN
- 空字符串（''）

```javascript
Explain
!undefined // true
!null // true
!0 // true
!NaN // true
!"" // true

!54 // false
!'hello' // false
![] // false
!{} // false
```

#### 且运算符（&&）

运算规则是：如果第一个运算子的布尔值为true，则返回第二个运算子的值（注意是值，不是布尔值）；如果第一个运算子的布尔值为false，则直接返回第一个运算子的值，且不再对第二个运算子求值。

```javascript
't' && '' // ""
't' && 'f' // "f"
't' && (1 + 2) // 3
'' && 'f' // ""
'' && '' // ""

var x = 1;
(1 - 1) && ( x += 1) // 0
x // 1
```

#### 或运算符（||）

或运算符（||）也用于多个表达式的求值。它的运算规则是：如果第一个运算子的布尔值为true，则返回第一个运算子的值，且不再对第二个运算子求值；如果第一个运算子的布尔值为false，则返回第二个运算子的值。

```javascript
't' || '' // "t"
't' || 'f' // "t"
'' || 'f' // "f"
'' || '' // ""
```

#### 三元条件运算符（?:）

三元条件运算符由问号（?）和冒号（:）组成，分隔三个表达式。它是 JavaScript 语言唯一一个需要三个运算子的运算符。如果第一个表达式的布尔值为true，则返回第二个表达式的值，否则返回第三个表达式的值。

```javascript
't' ? 'hello' : 'world' // "hello"
0 ? 'hello' : 'world' // "world"
```

三元条件表达式与`if...else`语句具有同样表达效果，前者可以表达的，后者也能表达。但是两者具有一个重大差别，`if...else`是语句，没有返回值；三元条件表达式是表达式，具有返回值。所以，在需要返回值的场合，只能使用三元条件表达式，而不能使用`if..else`。

```javascript
console.log(true ? 'T' : 'F');
```

### 二进制位运算符

二进制位运算符用于直接对二进制位进行计算，一共有7个。

- 二进制或运算符（or）：符号为`|`，表示若两个二进制位都为0，则结果为0，否则为1。
- 二进制与运算符（and）：符号为`&`，表示若两个二进制位都为1，则结果为1，否则为0。
- 二进制否运算符（not）：符号为`~`，表示对一个二进制位取反。
- 异或运算符（xor）：符号为`^`，表示若两个二进制位不相同，则结果为1，否则为0。
- 左移运算符（left shift）：符号为`<<`。
- 右移运算符（right shift）：符号为`>>`。
- 头部补零的右移运算符（zero filled right shift）：符号为`>>>`

位运算符只对整数起作用，如果一个运算子不是整数，会自动转为整数后再执行。另外，虽然在 JavaScript 内部，数值都是以64位浮点数的形式储存，但是做位运算的时候，是以32位带符号的整数进行运算的，并且返回值也是一个32位带符号的整数。

```javascript
i = i | 0;
```

上面这行代码的意思，就是将i（不管是整数或小数）转为32位整数。<br />利用这个特性，可以写出一个函数，将任意数值转为32位整数。

```javascript
function toInt32(x) {
  return x | 0;
}
// 示例：
toInt32(1.001) // 1
toInt32(1.999) // 1
toInt32(1) // 1
toInt32(-1) // -1
toInt32(Math.pow(2, 32) + 1) // 1
toInt32(Math.pow(2, 32) - 1) // -1
```

> toInt32可以将小数转为整数。对于一般的整数，返回值不会有任何变化。对于大于或等于2的32次方的整数，大于32位的数位都会被舍去

#### 二进制或运算符

二进制或运算符（|）逐位比较两个运算子，两个二进制位之中只要有一个为1，就返回1，否则返回0

```javascript
0 | 3 // 3
```

位运算只对整数有效，遇到小数时，会将小数部分舍去，只保留整数部分。所以，将一个小数与0进行二进制或运算，等同于对该数去除小数部分，即取整数位。

```javascript
2.9 | 0 // 2
-2.9 | 0 // -2
```

需要注意的是，这种取整方法不适用超过32位整数最大值2147483647的数。

```javascript
2147483649.4 | 0;
// -2147483647
```

#### 二进制与运算符

二进制与运算符（&）的规则是逐位比较两个运算子，两个二进制位之中只要有一个位为0，就返回0，否则返回1。

```javascript
0 & 3 // 0
```

#### 二进制否运算符

二进制否运算符（~）将每个二进制位都变为相反值（0变为1，1变为0）。它的返回结果有时比较难理解，因为涉及到计算机内部的数值表示机制。

```javascript
~ 3 // -4
```

3的32位整数形式是00000000000000000000000000000011，二进制否运算以后得到11111111111111111111111111111100。由于第一位（符号位）是1，所以这个数是一个负数。JavaScript 内部采用补码形式表示负数，即需要将这个数减去1，再取一次反，然后加上负号，才能得到这个负数对应的10进制值。这个数减去1等于11111111111111111111111111111011，再取一次反得到00000000000000000000000000000100，再加上负号就是-4。考虑到这样的过程比较麻烦，可以简单记忆成，一个数与自身的取反值相加，等于-1。

#### 异或运算符

异或运算（^）在两个二进制位不同时返回1，相同时返回0。

```javascript
0 ^ 3 // 3
```

“异或运算”有一个特殊运用，连续对两个数a和b进行三次异或运算，a^=b; b^=a; a^=b;，可以互换它们的值。这意味着，使用“异或运算”可以在不引入临时变量的前提下，互换两个变量的值。

```javascript
var a = 10;
var b = 99;

a ^= b, b ^= a, a ^= b;

a // 99
b // 10
```

异或运算也可以用来取整。

```javascript
12.9 ^ 0 // 12
```

#### 左移运算符

左移运算符（`<<`）表示将一个数的二进制值向左移动指定的位数，尾部补0，即乘以2的指定次方。向左移动的时候，最高位的符号位是一起移动的。

```javascript
// 4 的二进制形式为100，
// 左移一位为1000（即十进制的8）
// 相当于乘以2的1次方
4 << 1
// 8

-4 << 1
// -8
```

> -4左移一位得到-8，是因为-4的二进制形式是11111111111111111111111111111100，左移一位后得到11111111111111111111111111111000，该数转为十进制（减去1后取反，再加上负号）即为-8

如果左移0位，就相当于将该数值转为32位整数，等同于取整，对于正数和负数都有效。

```javascript
13.5 << 0
// 13

-13.5 << 0
// -13
```

左移运算符用于二进制数值非常方便。

```javascript
var color = {r: 186, g: 218, b: 85};

// RGB to HEX
// (1 << 24)的作用为保证结果是6位数
var rgb2hex = function(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16) // 先转成十六进制，然后返回字符串
    .substr(1);   // 去除字符串的最高位，返回后面六个字符串
}

rgb2hex(color.r, color.g, color.b)
// "#bada55"
```

#### 右移运算符

右移运算符（>>）表示将一个数的二进制值向右移动指定的位数。如果是正数，头部全部补0；如果是负数，头部全部补1。右移运算符基本上相当于除以2的指定次方（最高位即符号位参与移动）。

```javascript
4 >> 1
// 2
/*
// 因为4的二进制形式为 00000000000000000000000000000100，
// 右移一位得到 00000000000000000000000000000010，
// 即为十进制的2
*/

-4 >> 1
// -2
/*
// 因为-4的二进制形式为 11111111111111111111111111111100，
// 右移一位，头部补1，得到 11111111111111111111111111111110,
// 即为十进制的-2
*/
```

右移运算可以模拟 2 的整除运算。

```javascript
5 >> 1
// 2
// 相当于 5 / 2 = 2

21 >> 2
// 5
// 相当于 21 / 4 = 5

21 >> 3
// 2
// 相当于 21 / 8 = 2

21 >> 4
// 1
// 相当于 21 / 16 = 1
```

#### 头部补零的右移运算符

头部补零的右移运算符（`>>>`）与右移运算符（`>>`）只有一个差别，就是一个数的二进制形式向右移动时，头部一律补零，而不考虑符号位。所以，该运算总是得到正值。对于正数，该运算的结果与右移运算符（>>）完全一致，区别主要在于负数。

```javascript
4 >>> 1
// 2

-4 >>> 1
// 2147483646
/*
// 因为-4的二进制形式为11111111111111111111111111111100，
// 带符号位的右移一位，得到01111111111111111111111111111110，
// 即为十进制的2147483646。
*/
```

这个运算实际上将一个值转为32位无符号整数。<br />查看一个负整数在计算机内部的储存形式，最快的方法就是使用这个运算符。

```javascript
-1 >>> 0 // 4294967295
```

上面代码表示，-1作为32位整数时，内部的储存形式使用无符号整数格式解读，值为 4294967295（即(2^32)-1，等于11111111111111111111111111111111）。

### 其他运算符，运算顺序

#### 空值合并运算符（??）

空值合并运算符（??）是一个逻辑运算符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。

```javascript
const foo = null ?? 'default string';
console.log(foo);
// Expected output: "default string"

const baz = 0 ?? 42;
console.log(baz);
// Expected output: 0
```

与逻辑或运算符（`||`）不同，逻辑或运算符会在左侧操作数为假值时返回右侧操作数。也就是说， 如果使用 `||` 来为某些变量设置默认值，可能会遇到意料之外的行为。比如为假值（例如，'' 或 0）时。见下面的例子。

#### void 运算符

void运算符的作用是执行一个表达式，然后不返回任何值，或者说返回undefined

```javascript
void 0 // undefined
void(0) // undefined
```

建议采用后一种形式，即总是使用圆括号。因为**void运算符的优先性很高**，如果不使用括号，容易造成错误的结果。比如，`void 4 + 7`实际上等同于(void 4) + 7。

```javascript
var x = 3;
void (x = 5) //undefined
x // 5
```

这个运算符的主要用途是浏览器的书签工具（Bookmarklet），以及在超级链接中插入代码防止网页跳转。

```html
<a href="javascript: void(f())">文字</a>

<!--下面是一个更实际的例子，用户点击链接提交表单，但是不产生页面跳转。!-->
<a href="javascript: void(document.form.submit())">
  提交
</a>
```

#### 逗号运算符 `,`

逗号运算符用于对两个表达式求值，并返回后一个表达式的值。

```javascript
'a', 'b' // "b"

var x = 0;
var y = (x++, 10);
x // 1
y // 10
```

逗号运算符的一个用途是，在返回一个值之前，进行一些辅助操作。

```javascript
var value = (console.log('Hi!'), true);
// Hi!

value // true
```

#### 运算顺序

- 优先级

JavaScript 各种运算符的优先级别（Operator Precedence）是不一样的。优先级高的运算符先执行，优先级低的运算符后执行。

- 乘法运算符（*）的优先性高于加法运算符（+），所以先执行乘法，再执行加法
- 五个运算符的优先级从高到低依次为：小于等于（<=)、严格相等（===）、或（||）、三元（?:）、等号（=）

```javascript
4 + 5 * 6 // 34
```

- 圆括号

圆括号（`()`）可以用来提高运算的优先级，因为它的优先级是最高的，即圆括号中的表达式会第一个运算。

- 左结合与右结合

对于优先级别相同的运算符，同时出现的时候，就会有计算顺序的问题。<br />将左侧两个运算数结合在一起，采用这种解释方式的运算符，称为“左结合”（left-to-right associativity）运算符；将右侧两个运算数结合在一起，这样的运算符称为“右结合”运算符（right-to-left associativity）。<br />JavaScript 语言的大多数运算符是“左结合”

指数运算符（**）是右结合。

# 错误处理机制

## Error

JavaScript 解析或运行时，一旦发生错误，引擎就会抛出一个错误对象。JavaScript 原生提供Error构造函数，所有抛出的错误都是这个构造函数的实例。

```javascript
var err = new Error('出错了');
err.message // "出错了"
```

JavaScript 语言标准只提到，Error实例对象必须有message属性，表示出错时的提示信息，没有提到其他属性。大多数 JavaScript 引擎，对Error实例还提供name和stack属性，分别表示错误的名称和错误的堆栈，但它们是非标准的，不是每种实现都有。

- message：错误提示信息
- name：错误名称（非标准属性）
- stack：错误的堆栈（非标准属性）

## 原生错误类型

Error实例对象是最一般的错误类型，在它的基础上，JavaScript 还定义了其他6种错误对象。也就是说，存在Error的6个派生对象。

### SyntaxError 对象

SyntaxError对象是解析代码时发生的语法错误。

```javascript
// 变量名错误
var 1a;
// Uncaught SyntaxError: Invalid or unexpected token

// 缺少括号
console.log 'hello');
// Uncaught SyntaxError: Unexpected string
```

### ReferenceError 对象

ReferenceError对象是引用一个不存在的变量时发生的错误。

```javascript
// 使用一个不存在的变量
unknownVariable
// Uncaught ReferenceError: unknownVariable is not defined
```

另一种触发场景是，将一个值分配给无法分配的对象，比如对函数的运行结果赋值。

```javascript
// 等号左侧不是变量
console.log() = 1
// Uncaught ReferenceError: Invalid left-hand side in assignment
```

### RangeError 对象

RangeError对象是一个值超出有效范围时发生的错误。主要有几种情况，一是数组长度为负数，二是Number对象的方法参数超出范围，以及函数堆栈超过最大值。

```javascript
// 数组长度不得为负数
new Array(-1)
// Uncaught RangeError: Invalid array length
```

### TypeError 对象

TypeError对象是变量或参数不是预期类型时发生的错误。比如，对字符串、布尔值、数值等原始类型的值使用new命令，就会抛出这种错误，因为new命令的参数应该是一个构造函数。

```javascript
new 123
// Uncaught TypeError: 123 is not a constructor

var obj = {};
obj.unknownMethod()
// Uncaught TypeError: obj.unknownMethod is not a function
```

### URIError 对象

URIError对象是 URI 相关函数的参数不正确时抛出的错误，主要涉及encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape()这六个函数。

```javascript
decodeURI('%2')
// URIError: URI malformed
```

### EvalError 对象

eval函数没有被正确执行时，会抛出EvalError错误。该错误类型已经不再使用了，只是为了保证与以前代码兼容，才继续保留。

## 自定义错误

```javascript
function UserError(message) {
  this.message = message || '默认信息';
  this.name = 'UserError';
}

UserError.prototype = new Error();
UserError.prototype.constructor = UserError;
```

自定义一个错误对象UserError，让它继承Error对象。然后，就可以生成这种自定义类型的错误了。

```javascript
new UserError('这是自定义的错误！');
```

## throw 语句

throw语句的作用是手动中断程序执行，抛出一个错误。

```javascript
var x = -1;

if (x <= 0) {
  throw new Error('x 必须为正数');
}
// Uncaught Error: x 必须为正数
```

throw也可以抛出自定义错误。

```javascript
function UserError(message) {
  this.message = message || '默认信息';
  this.name = 'UserError';
}

throw new UserError('出错了！');
// Uncaught UserError {message: "出错了！", name: "UserError"}
```

实际上，throw可以抛出任何类型的值。也就是说，它的参数可以是任何值。

```javascript
// 抛出一个字符串
throw 'Error！';
// Uncaught Error！

// 抛出一个数值
throw 42;
// Uncaught 42

// 抛出一个布尔值
throw true;
// Uncaught true

// 抛出一个对象
throw {
  toString: function () {
    return 'Error!';
  }
};
// Uncaught {toString: ƒ}
```

对于 JavaScript 引擎来说，遇到throw语句，程序就中止了。引擎会接收到throw抛出的信息，可能是一个错误实例，也可能是其他类型的值。

## `try...catch` 结构

一旦发生错误，程序就中止执行了。JavaScript 提供了try...catch结构，允许对错误进行处理，选择是否往下执行。

```javascript
try {
  throw new Error('出错了!');
} catch (e) {
  console.log(e.name + ": " + e.message);
  console.log(e.stack);
}
// Error: 出错了!
//   at <anonymous>:3:9
//   ...
```

为了捕捉不同类型的错误，catch代码块之中可以加入判断语句。

```javascript
try {
  foo.bar();
} catch (e) {
  if (e instanceof EvalError) {
    console.log(e.name + ": " + e.message);
  } else if (e instanceof RangeError) {
    console.log(e.name + ": " + e.message);
  }
  // ...
}
```

## finally 代码块

`try...catch`结构允许在最后添加一个`finally`代码块，表示不管是否出现错误，都必需在最后运行的语句。

```javascript
function cleansUp() {
  try {
    throw new Error('出错了……');
    console.log('此行不会执行');
  } finally {
    console.log('完成清理工作');
  }
}

cleansUp()
// 完成清理工作
// Uncaught Error: 出错了……
//    at cleansUp (<anonymous>:3:11)
//    at <anonymous>:10:1
```

下面的例子说明，return语句的执行是排在finally代码之前，只是等finally代码执行完毕后才返回。

```javascript
var count = 0;
function countUp() {
  try {
    return count;
  } finally {
    count++;
  }
}

countUp()
// 0
count
// 1
```

# Ref

- [x] [JavaScript 教程（阮一峰）](https://wangdoc.com/javascript/)
- [x] [JavaScript 基础（mozilla）](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web/JavaScript_basics)
- [ ] [JavaScript（mozilla）](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript)
- [ ] [JavaScript 教程（runoob）](https://www.runoob.com/js/js-tutorial.html)
