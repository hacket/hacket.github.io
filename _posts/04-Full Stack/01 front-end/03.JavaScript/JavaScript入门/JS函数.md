---
date created: 2024-12-25 00:57
date updated: 2024-12-25 00:57
dg-publish: true
---

## JS函数

函数是一段可以反复调用的代码块。函数还能接受输入的参数，不同的参数有唯一对应的返回值。

### 函数的声明 Function Declaration

JavaScript 有三种声明函数的方法：

#### function 命令

function命令声明的代码区块，就是一个函数。function命令后面是函数名，函数名后面是一对圆括号，里面是传入函数的参数。函数体放在大括号里面。

```javascript
// 无参函数
function functionname() {
	// 执行代码
}
// 可以发送任意多的参数，由逗号 (,) 分隔：
function myFunction(var1,var2) {
	// 代码
}
// 带有返回值的函数
function myFunction() {
    var x=5;
    return x;
}
```

#### 函数表达式 Function Expression

JavaScript 函数可以通过一个表达式定义。这个匿名函数又称函数表达式（Function Expression）

```javascript
var print = function(s) {
  console.log(s);
};
```

采用函数表达式声明函数时，function命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。

```javascript
var print = function x(){
  console.log(typeof x);
};

x
// ReferenceError: x is not defined

print()
// function
```

加入了函数名x。这个x只在函数体内部可用，指代函数表达式本身，其他地方都不可用。这种写法的用处有两个：

- 一是可以在函数体内部调用自身
- 二是方便除错（除错工具显示函数调用栈时，将显示函数名，而不再显示这里是一个匿名函数）

下面的形式声明函数也非常常见：

```javascript
var f = function f() {};
```

> 需要注意的是，函数的表达式需要在语句的结尾加上分号，表示语句结束。而函数的声明在结尾的大括号后面不用加分号

#### ~~Function() 构造函数（不推荐使用）~~

函数同样可以通过内置的 JavaScript 函数构造器（`Function()`）定义。

```javascript
var myFunction = new Function("a", "b", "return a * 
b");
var x = myFunction(4, 3);
// 也等同于
var myFunction = function (a, b) {return a * b};
var x = myFunction(4, 3);
```

> 在 JavaScript 中，很多时候，你需要避免使用 new 关键字。

可以传递任意数量的参数给Function构造函数，只有最后一个参数会被当做函数体，如果只有一个参数，该参数就是函数体。

```javascript
var foo = new Function(
  'return "hello world";'
);

// 等同于
function foo() {
  return 'hello world';
}
```

Function构造函数可以不使用new命令，返回结果完全一样。<br>总的来说，这种声明函数的方式非常不直观，几乎无人使用。

#### 函数的重复声明

如果同一个函数被多次声明，后面的声明就会覆盖前面的声明

```javascript
function f() {
  console.log(1);
}
f() // 2

function f() {
  console.log(2);
}
f() // 2
// 后一次的函数声明覆盖了前面一次。而且，由于函数名的提升，前一次声明在任何时候都是无效的，这一点要特别注意。
```

### 函数参数

JavaScript 函数对参数的值没有进行任何的检查。

#### 默认参数

ES6 支持函数带有默认参数，就判断 `undefined` 和 `||` 的操作：

```javascript
function myFunction(x, y = 10) {
    // y is 10 if not passed or undefined
    return x + y;
}
 
myFunction(0, 2) // 输出 2
myFunction(5); // 输出 15, y 参数的默认值
```

#### arguments 对象

JavaScript 函数有个内置的对象 `arguments` 对象。<br>arguments 对象包含了函数调用的参数数组。<br>通过这种方式你可以很方便的找到最大的一个参数的值：

```javascript
x = findMax(1, 123, 500, 115, 44, 88);
 
function findMax() {
    var i, max = arguments[0];
    
    if(arguments.length < 2) return max;
 
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    return max;
}
```

### 函数名的提升（Hoisting）

JavaScript 引擎将函数名视同变量名，所以采用`function`命令声明函数时，整个函数会像变量声明一样，被提升到代码头部。所以，下面的代码不会报错。

```javascript
f();

function f() {}
```

上面代码好像在声明之前就调用了函数f。但是实际上，由于“变量提升”，函数f被提升到了代码头部，也就是在调用之前已经声明了。但是，如果采用函数表达式语句定义函数，JavaScript 就会报错。

```javascript
f();
var f = function (){};
// TypeError: undefined is not a function

// 上面的代码等同于下面的形式。
var f;
f();
f = function () {};
// 代码第二行，调用f的时候，f只是被声明了，还没有被赋值，等于undefined，所以会报错。
```

采用function命令和var赋值语句声明同一个函数，由于存在函数提升，最后会采用var赋值语句的定义。

```javascript
var f = function () {
  console.log('1');
}

function f() {
  console.log('2');
}

f() // 1
```

> 表面上后面声明的函数f，应该覆盖前面的var赋值语句，但是由于存在函数提升，实际上正好反过来。

### 自调用函数

函数表达式可以 "自调用"。<br>自调用表达式会自动调用。<br>如果表达式后面紧跟 `()` ，则会自动调用。<br>不能自调用声明的函数。<br>通过添加括号，来说明它是一个函数表达式：

```javascript
(function () {
    var x = "Hello!!";      // 我将调用自己
})();
```

### 函数可作为一个值使用

JavaScript 语言将函数看作一种值，与其它值（数值、字符串、布尔值等等）地位相同。凡是可以使用值的地方，就能使用函数。<br>由于函数与其他数据类型地位平等，所以在 JavaScript 语言中又称函数为第一等公民。<br>函数作为一个值使用：

```javascript
function myFunction(a, b) {
	return a * b;
}
var x = myFunction(4, 3);
```

函数可作为表达式使用：

```javascript
function myFunction(a, b) {
	return a * b;
}
var x = myFunction(4, 3) * 2;
```

### 函数是对象

在 JavaScript 中使用 typeof 操作符判断函数类型将返回 "`function`" 。<br>但是JavaScript 函数描述为一个对象更加准确。<br>JavaScript 函数有 `属性` 和 `方法`。

#### name 属性

函数的name属性返回函数的名字

```javascript
function f1() {}
f1.name // "f1"
```

如果是通过变量赋值定义的函数，那么name属性返回变量名。

```javascript
var f2 = function () {};
f2.name // "f2"
```

上面这种情况，只有在变量的值是一个匿名函数时才是如此。如果变量的值是一个具名函数，那么name属性返回function关键字之后的那个函数名。

```javascript
var f3 = function myName() {};
f3.name // 'myName'
```

> 上面代码中，f3.name返回函数表达式的名字。注意，真正的函数名还是f3，而myName这个名字只在函数体内部可用。

name属性的一个用处，就是获取参数函数的名字。

```javascript
var myFunc = function () {};

function test(f) {
  console.log(f.name);
}

test(myFunc) // myFunc
```

> 函数test内部通过name属性，就可以知道传入的参数是什么函数

#### length 属性

函数的length属性返回函数预期传入的参数个数，即函数定义之中的参数个数。

```javascript
function f(a, b) {}
f.length // 2
// 它的length属性就是定义时的参数个数。不管调用时输入了多少个参数，length属性始终等于2
```

`arguments.length` 属性返回函数调用过程接收到的参数个数：

```javascript
function myFunction(a, b) {
  return arguments.length;
}
function myFunction(a, b) {
  return a * b;
}
var txt = myFunction.toString();
```

#### toString()

函数的toString()方法返回一个字符串，内容是函数的源码

### 箭头函数

ES6 新增了箭头函数。<br>箭头函数表达式的语法比普通函数表达式更简洁。

```javascript
(参数1, 参数2, …, 参数N) => { 函数声明 }

(参数1, 参数2, …, 参数N) => 表达式(单一)
// 相当于：(参数1, 参数2, …, 参数N) =>{ return 表达式; }
```

当只有一个参数时，圆括号是可选的：

```javascript
(单一参数) => {函数声明}
// 或
单一参数 => {函数声明}
```

没有参数的函数应该写成一对圆括号:

```javascript
() => {函数声明}
```

示例：

```javascript
// ES5
var x = function(x, y) {
     return x * y;
}
 
// ES6
const x = (x, y) => x * y;
```

有的箭头函数都没有自己的 this。 不适合定义一个 `对象的方法`。<br>当我们使用箭头函数的时候，箭头函数会默认帮我们绑定外层 this 的值，所以在箭头函数中 this 的值和外层的 this 是一样的。<br>箭头函数是不能提升的，所以需要在使用之前定义。<br>使用 const 比使用 var 更安全，因为函数表达式始终是一个常量。<br>如果函数部分只是一个语句，则可以省略 return 关键字和大括号 {}，这样做是一个比较好的习惯:

```javascript
const x = (x, y) => { return x * y };
```

### 函数调用

JavaScript 函数有 4 种调用方式。每种方式的不同在于 this 的初始化。

#### this 关键字

一般而言，在Javascript中，this指向函数执行时的当前对象。<br>this含义见下面的定义

### JS闭包

闭包是一种保护私有变量的机制，在函数执行时形成私有的作用域，保护里面的私有变量不受外界干扰。<br>直观的说就是形成一个不销毁的栈环境。

```javascript
var add = (function () {
    var counter = 0;
    return function () {return counter += 1;}
})();
 
add();
add();
add();
 
// 计数器为 3
```

### eval

eval命令接受一个字符串作为参数，并将这个字符串当作语句执行。

```javascript
eval('var a = 1;');
a // 1
```

如果参数字符串无法当作语句运行，那么就会报错。

```javascript
eval('3x') // Uncaught SyntaxError: Invalid or unexpected token
```

如果eval的参数不是字符串，那么会原样返回。

```javascript
eval(123) // 123
```

在严格模式下，eval依然可以读写当前作用域的变量。

```javascript
(function f() {
  'use strict';
  var foo = 1;
  eval('foo = 2');
  console.log(foo);  // 2
})()
// 上面代码中，严格模式下，eval内部还是改写了外部变量，可见安全风险依然存在。
```

总之，eval的本质是在当前作用域之中，注入代码。由于安全风险和不利于 JavaScript 引擎优化执行速度，一般不推荐使用。通常情况下，eval最常见的场合是解析 JSON 数据的字符串，不过正确的做法应该是使用原生的JSON.parse方法。

## javascript:void(0)

javascript:void(0) 中最关键的是 void 关键字， void 是 JavaScript 中非常重要的关键字，该操作符指定要计算一个表达式但是不返回值。<br>语法格式如下：

```javascript
void func()
javascript:void func()
// 或者
void(func())
javascript:void(func())
```

示例：创建了一个超级链接，当用户点击以后不会发生任何事。

```html
<a href="javascript:void(0)">单击此处什么也不会发生</a>
```

当用户链接时，void(0) 计算为 0，但 Javascript 上没有任何效果。<br>以下实例中，在用户点击链接后显示警告信息：

```html
<p>点击以下链接查看结果：</p>
<a href="javascript:void(alert('Warning!!!'))">点我!</a>
```

以下实例中参数 a 将返回 undefined :

```javascript
function getValue(){
   var a,b,c;
   a = void ( b = 5, c = 7 );
   document.write('a = ' + a + ' b = ' + b +' c = ' + c );
}
```

`href="#"`**与**`href="javascript:void(0)"`**的区别:**

- # 包含了一个位置信息，默认的锚是#top 也就是网页的上端。
- 而`javascript:void(0)`, 仅仅表示一个死链接。
- 在页面很长的时候会使用 # 来定位页面的具体位置，格式为：`# + id`。
- 如果你要定义一个死链接请使用`javascript:void(0) `。

```javascript
如果你要定义一个死链接请使用 javascript:void(0) 。
```
