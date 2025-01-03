---
date created: 2024-12-25 00:58
date updated: 2024-12-25 00:58
dg-publish: true
---

# JS面向对象

## JS对象（ES6之前）

大部分面向对象的编程语言，都是通过“类”（class）实现对象的继承。传统上，JavaScript 语言的继承不通过 class，而是通过“**原型对象**”（`prototype`）实现<br>对象（object）是 JavaScript 语言的核心概念，也是最重要的数据类型。

- 对象是单个实物的抽象
- 对象是一个容器，封装了属性（property）和方法（method）

### JS对象定义

什么是对象？简单说，对象就是一组“键值对”（key-value）的集合，是一种无序的复合数据集合。<br>对象由花括号分隔。在括号内部，对象的属性以名称和值对的形式 (name : value) 来定义。属性由逗号分隔：

```javascript
var obj = {
  foo: 'Hello',
  bar: 'World'
};
```

> 大括号就定义了一个对象，它被赋值给变量obj，所以变量obj就指向一个对象。该对象内部包含两个键值对（又称为两个“成员”），第一个键值对是foo: 'Hello'，其中foo是“键名”（成员的名称），字符串Hello是“键值”（成员的值）。键名与键值之间用冒号分隔。第二个键值对是bar: 'World'，bar是键名，World是键值。两个键值对之间用逗号分隔。

#### 键名

对象的所有键名都是字符串（ES6 又引入了 Symbol 值也可以作为键名），所以加不加引号都可以。上面的代码也可以写成下面这样。

```javascript
var obj = {
  'foo': 'Hello',
  'bar': 'World'
};
```

如果键名是数值，会被自动转为字符串。

```javascript
var obj = {
  1: 'a',
  3.2: 'b',
  1e2: true,
  1e-2: true,
  .234: true,
  0xFF: true
};

obj
// Object {
//   1: "a",
//   3.2: "b",
//   100: true,
//   0.01: true,
//   0.234: true,
//   255: true
// }

obj['100'] // true
// 上面代码中，对象obj的所有键名虽然看上去像数值，实际上都被自动转成了字符串。
```

如果键名不符合标识名的条件（比如第一个字符为数字，或者含有空格或运算符），且也不是数字，则必须加上引号，否则会报错。

```javascript
// 报错
var obj = {
  1p: 'Hello World'
};

// 不报错
var obj = {
  '1p': 'Hello World',
  'h w': 'Hello World',
  'p+q': 'Hello World'
};
```

对象的每一个键名又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用。

```javascript
var obj = {
  p: function (x) {
    return 2 * x;
  }
};

obj.p(1) // 2
// 上面代码中，对象obj的属性p，就指向一个函数
```

如果属性的值还是一个对象，就形成了链式引用。

```javascript
var o1 = {};
var o2 = { bar: 'hello' };

o1.foo = o2;
o1.foo.bar // "hello"
// 上面代码中，对象o1的属性foo指向对象o2，就可以链式引用o2的属性。
```

对象的属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

```javascript
var obj = {
  p: 123,
  m: function () { ... },
}
```

属性可以动态创建，不必在对象声明时就指定。

```javascript
var obj = {};
obj.foo = 123;
obj.foo // 123
```

#### 表达式还是语句？

对象采用大括号表示，这导致了一个问题：如果行首是一个大括号，它到底是表达式还是语句？

```javascript
{ foo: 123 }
// JavaScript 引擎读到上面这行代码，会发现可能有两种含义。第一种可能是，这是一个表达式，表示一个包含foo属性的对象；
// 第二种可能是，这是一个语句，表示一个代码区块，里面有一个标签foo，指向表达式123。
{ console.log(123) } // 123
```

JavaScript 引擎的做法是，如果遇到这种情况，无法确定是对象还是代码块，一律解释为代码块。<br>如果要解释为对象，最好在大括号前加上圆括号。因为圆括号的里面，只能是表达式，所以确保大括号只能解释为对象。

```javascript
({ foo: 123 }) // 正确
({ console.log(123) }) // 报错
```

这种差异在`eval`语句（作用是对字符串求值）中反映得最明显。

```javascript
eval('{foo: 123}') // 123
eval('({foo: 123})') // {foo: 123}
// 如果没有圆括号，eval将其理解为一个代码块；加上圆括号以后，就理解成一个对象。
```

#### 原型对象构造函数

构造函数就是一个普通的函数，但具有自己的特征和用法

```javascript
var Vehicle = function () {
  this.price = 1000;
};
```

Vehicle就是构造函数。为了与普通函数区别，构造函数名字的第一个字母通常大写。<br>构造函数的特点有两个：

- 函数体内部使用了this关键字，代表了所要生成的对象实例
- 生成对象的时候，必须使用new命令
- 同一个构造函数的多个实例之间，无法共享属性，从而造成对系统资源的浪费。通过`prototype`解决

#### new命令

new命令的作用，就是执行构造函数，返回一个实例对象：

```javascript
var Vehicle = function () {
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000
```

> 通过new命令，让构造函数Vehicle生成一个实例对象，保存在变量v中。这个新生成的实例对象，从构造函数Vehicle得到了price属性。new命令执行时，构造函数内部的this，就代表了新生成的实例对象，this.price表示实例对象有一个price属性，值是1000。

使用new命令时，根据需要，构造函数也可以接受参数：

```javascript
var Vehicle = function (p) {
  this.price = p;
};

var v = new Vehicle(500);
```

new命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号：

```javascript
// 推荐的写法
var v = new Vehicle();
// 等同
// 不推荐的写法
var v = new Vehicle;
```

##### new 命令的原理

使用new命令时，它后面的函数依次执行下面的步骤：

1. 创建一个空对象，作为将要返回的对象实例
2. 将这个空对象的原型，指向构造函数的`prototype`属性
3. 将这个空对象赋值给函数内部的`this`关键字
4. 开始执行构造函数内部的代码

构造函数内部，this指的是一个新生成的空对象，所有针对this的操作，都会发生在这个空对象上。构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作一个空对象（即this对象），将其“构造”为需要的样子。<br>如果构造函数内部有return语句，而且return后面跟着一个对象，new命令会返回return语句指定的对象；否则，就会不管return语句，返回this对象。

```javascript
var Vehicle = function () {
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000
// false
// 构造函数Vehicle的return语句返回一个数值。这时，new命令就会忽略这个return语句，
// 返回“构造”后的this对象，所以不相等
```

但是，如果return语句返回的是一个跟this无关的新对象，new命令会返回这个新对象，而不是this对象。这一点需要特别引起注意。

```javascript
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
// 构造函数Vehicle的return语句，返回的是一个新对象。new命令会返回这个对象，而不是this对象。
```

如果对普通函数（内部没有this关键字的函数）使用new命令，则会返回一个空对象。

```javascript
function getMessage() {
  return 'this is a message';
}

var msg = new getMessage();

msg // {}
typeof msg // "object"
```

> getMessage是一个普通函数，返回一个字符串。对它使用new命令，会得到一个空对象。这是因为new命令总是返回一个对象，要么是实例对象，要么是return语句指定的对象。本例中，return语句返回的是字符串，所以new命令就忽略了该语句。

##### new.target

函数内部可以使用`new.target`属性。如果当前函数是new命令调用，new.target指向当前函数，否则为`undefined`。

```javascript
function f() {
  console.log(new.target === f);
}

f() // false
new f() // true
```

使用这个属性，可以判断函数调用的时候，是否使用new命令：

```javascript
function f() {
  if (!new.target) {
    throw new Error('请使用 new 命令调用！');
  }
  // ...
}

f() // Uncaught Error: 请使用 new 命令调用！
```

### Object.create() 创建实例对象

构造函数作为模板，可以生成实例对象。但是，有时拿不到构造函数，只能拿到一个现有的对象。我们希望以这个现有的对象作为模板，生成新的实例对象，这时就可以使用`Object.create()`方法。

```javascript
var person1 = {
  name: '张三',
  age: 38,
  greeting: function() {
    console.log('Hi! I\'m ' + this.name + '.');
  }
};

var person2 = Object.create(person1);

person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

### 对象属性的操作

#### 属性的读取

读取对象的属性，有两种方法，一种是使用`点运算符`，还有一种是使用`方括号运算符`。

```javascript
var obj = {
  p: 'Hello World'
};

obj.p // "Hello World"
obj['p'] // "Hello World"
```

如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。

```javascript
var foo = 'bar';

var obj = {
  foo: 1,
  bar: 2
};

obj.foo  // 1
obj[foo]  // 2
// 引用对象obj的foo属性时，如果使用点运算符，foo就是字符串；
// 如果使用方括号运算符，但是不使用引号，那么foo就是一个变量，指向字符串bar。
```

方括号运算符内部还可以使用表达式。

```javascript
obj['hello' + ' world']
obj[3 + 3]
```

数字键可以不加引号，因为会自动转成字符串。

```javascript
var obj = {
  0.7: 'Hello World'
};

obj['0.7'] // "Hello World"
obj[0.7] // "Hello World"
```

数值键名不能使用点运算符（因为会被当成小数点），只能使用方括号运算符。

```javascript
var obj = {
  123: 'hello world'
};

obj.123 // 报错
obj[123] // "hello world"
```

#### 属性的赋值

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值

```javascript
var obj = {};

obj.foo = 'Hello';
obj['bar'] = 'World';
```

JavaScript 允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。

```javascript
var obj = { p: 1 };

// 等价于

var obj = {};
obj.p = 1;
```

#### 属性的查看

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```javascript
var obj = {
  key1: 1,
  key2: 2
};

Object.keys(obj);
// ['key1', 'key2']
```

#### 属性的删除：delete 命令

delete命令用于删除对象的属性，删除成功后返回true。

```javascript
var obj = { p: 1 };
Object.keys(obj) // ["p"]

delete obj.p // true
obj.p // undefined
Object.keys(obj) // []
```

注意，删除一个不存在的属性，delete不报错，而且返回true。因此，不能根据delete命令的结果，认定某个属性是存在的。

```javascript
var obj = {};
delete obj.p // true
```

只有一种情况，delete命令会返回false，那就是该属性存在，且不得删除。

```javascript
var obj = Object.defineProperty({}, 'p', {
  value: 123,
  configurable: false
});

obj.p // 123
delete obj.p // false
```

delete命令只能删除对象本身的属性，无法删除继承的属性

```javascript
var obj = {};
delete obj.toString // true
obj.toString // function toString() { [native code] }
```

> toString是对象obj继承的属性，虽然delete命令返回true，但该属性并没有被删除，依然存在。这个例子还说明，即使delete返回true，该属性依然可能读取到值。

#### 属性是否存在：in 运算符

in运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回true，否则返回false。它的左边是一个字符串，表示属性名，右边是一个对象。

```javascript
var obj = { p: 1 };
'p' in obj // true
'toString' in obj // true
```

in运算符的一个问题是，它不能识别哪些属性是对象自身的，哪些属性是继承的。就像上面代码中，对象obj本身并没有toString属性，但是in运算符会返回true，因为这个属性是继承的。<br>这时，可以使用对象的`hasOwnProperty`方法判断一下，是否为对象自身的属性。

```javascript
var obj = {};
if ('toString' in obj) {
  console.log(obj.hasOwnProperty('toString')) // false
}
```

#### 属性的遍历：`for...in` 循环

for...in循环用来遍历一个对象的全部属性。

```javascript
var obj = {a: 1, b: 2, c: 3};

for (var i in obj) {
  console.log('键名：', i);
  console.log('键值：', obj[i]);
}
// 键名： a
// 键值： 1
// 键名： b
// 键值： 2
// 键名： c
// 键值： 3
```

for...in循环有两个使用注意点。

- 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。toString不可遍历
- 它不仅遍历对象自身的属性，还遍历继承的属性。

#### with 语句

with语句的格式如下：

```javascript
with (对象) {
  语句;
}
```

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

```javascript
// 例一
var obj = {
  p1: 1,
  p2: 2,
};
with (obj) {
  p1 = 4;
  p2 = 5;
}
// 等同于
obj.p1 = 4;
obj.p2 = 5;

// 例二
with (document.links[0]){
  console.log(href);
  console.log(title);
  console.log(style);
}
// 等同于
console.log(document.links[0].href);
console.log(document.links[0].title);
console.log(document.links[0].style);
```

**注意**，如果with区块内部有变量的赋值操作，必须是当前对象已经存在的属性，否则会创造一个当前作用域的全局变量。

```javascript
var obj = {};
with (obj) {
  p1 = 4;
  p2 = 5;
}

obj.p1 // undefined
p1 // 4
```

因为with区块没有改变作用域，它的内部依然是当前作用域。这造成了with语句的一个很大的弊病，就是绑定对象不明确。

```javascript
with (obj) {
  console.log(x);
}
```

单纯从上面的代码块，根本无法判断x到底是全局变量，还是对象obj的一个属性。这非常不利于代码的除错和模块化，编译器也无法对这段代码进行优化，只能留到运行时判断，这就拖慢了运行速度。**因此，建议不要使用with语句，可以考虑用一个临时变量代替with。**

```javascript
with(obj1.obj2.obj3) {
  console.log(p1 + p2);
}

// 可以写成
var temp = obj1.obj2.obj3;
console.log(temp.p1 + temp.p2);
```

### 函数和对象区别？

Function 在 JS 中被单独视为一类, 是因为它在 JS 中是所谓的一等公民, JS 中没有类的概念, 其是`通过函数来模拟类的`;<br>尽管 Function 被单独视为一类，但从形式上看，它还是一个 Object 对象，那么我们如何区分 Function 和 Object 呢？答案就是 `prototype`

- prototype 是用来区分 Function 和 Object 的关键：函数创建时, JS 会为函数自动添加 prototype 属性, 其值为一个带有 constructor 属性(指向对应的构造函数)的对象，这个对象就是我们所说的原型对象，除了 constructor 属性外，我们还可以在上面添加一些公用的属性和方法：

```javascript
Function.prototype = {
  constructor: Function,
  // ...
}
```

- 而每个对象则都有一个内部属性[[Prototype]], 其用于存放该对象对应的原型对象。但是对象的内部属性`[[Prototype]]`是无法被直接访问和获取的，需要通过 `__proto__` , `Object.getPrototypeOf` / `Object.setPrototypeOf`访问

> 可以理解为，[[Prototype]] 存放了对原型对象的引用，真正的原型对象是由 Function.prototype 创建和维护的。

### 继承（ES6之前）

大部分面向对象的编程语言，都是通过“类”（class）实现对象的继承。传统上，JavaScript 语言的继承不通过 class，而是通过“原型对象”（`prototype`）实现。

#### prototype

JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。也就是说，如果属性和方法定义在原型上，那么所有实例对象就能共享，不仅节省了内存，还体现了实例对象之间的联系。

- 怎么为对象指定原型？JavaScript 规定，每个函数都有一个`prototype`属性，指向一个对象。

```javascript
function f() {}
typeof f.prototype // "object"
// 函数f默认具有prototype属性，指向一个对象
```

- 对于普通函数来说，该属性基本无用。但是，对于构造函数来说，生成实例的时候，该属性会自动成为实例对象的原型。

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.color = 'white';

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

cat1.color // 'white'
cat2.color // 'white'
```

> 构造函数Animal的prototype属性，就是实例对象cat1和cat2的原型对象。原型对象上添加一个color属性，结果，实例对象都共享了该属性。

- 原型对象的属性不是实例对象自身的属性。只要修改原型对象，变动就立刻会体现在所有实例对象上。

```javascript
Animal.prototype.color = 'yellow';

cat1.color // "yellow"
cat2.color // "yellow"
```

> 原型对象的color属性的值变为yellow，两个实例对象的color属性立刻跟着变了。这是因为实例对象其实没有color属性，都是读取原型对象的color属性。也就是说，当实例对象本身没有某个属性或方法的时候，它会到原型对象去寻找该属性或方法。这就是原型对象的特殊之处。

- 如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法。

```javascript
cat1.color = 'black';

cat1.color // 'black'
cat2.color // 'yellow'
Animal.prototype.color // 'yellow';
```

> 实例对象cat1的color属性改为black，就使得它不再去原型对象读取color属性，后者的值依然为yellow

- 原型对象的作用，就是定义所有实例对象共享的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象。

```javascript
Animal.prototype.walk = function () {
  console.log(this.name + ' is walking');
};
```

> Animal.prototype对象上面定义了一个walk方法，这个方法将可以在所有Animal实例对象上面调用。

#### prototype chain 原型链

JS所有对象都有自己的原型对象(prototype)，任何对象又可以充当其他对象的原型，形成了一个原型链；所有对象的原型链最终到`Object.prototype`（也就是说，所有对象都继承了Object.prototype的属性。这就是所有对象都有valueOf和toString方法的原因，因为这是从Object.prototype继承的）<br>`Object.prototype`的原型是null。null没有任何属性和方法，也没有自己的原型。因此，原型链的尽头就是null。

```javascript
Object.getPrototypeOf(Object.prototype)
// null
```

读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。如果直到最顶层的Object.prototype还是找不到，则返回undefined。如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做“`覆盖`”（overriding）。<br>在整个原型链上寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链。

#### constructor 属性

`prototype`对象有一个`constructor`属性，默认指向prototype对象所在的构造函数。

```javascript
function P() {}
P.prototype.constructor === P // true
```

constructor属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的。

```javascript
function F() {};
var f = new F();

f.constructor === F // true
f.constructor === RegExp // false
// constructor属性确定了实例对象f的构造函数是F，而不是RegExp
```

有了constructor属性，就可以从一个实例对象新建另一个实例

```javascript
function Constr() {}
var x = new Constr();

var y = new x.constructor();
y instanceof Constr // true
// x是构造函数Constr的实例，可以从x.constructor间接调用构造函数。
// 这使得在实例方法中，调用自身的构造函数成为可能。
```

```javascript
Constr.prototype.createCopy = function () {
  return new this.constructor();
};
// createCopy方法调用构造函数，新建另一个实例。
```

constructor属性表示原型对象与构造函数之间的关联关系，如果修改了原型对象，一般会同时修改constructor属性，防止引用的时候出错。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.constructor === Person // true

Person.prototype = {
  method: function () {}
};

Person.prototype.constructor === Person // false
Person.prototype.constructor === Object // true
```

构造函数Person的原型对象改掉了，但是没有修改constructor属性，导致这个属性不再指向Person。由于Person的新原型是一个普通对象，而普通对象的constructor属性指向Object构造函数，导致Person.prototype.constructor变成了Object。<br>所以，修改原型对象时，一般要同时修改constructor属性的指向。

```javascript
// 坏的写法
C.prototype = {
  method1: function (...) { ... },
  // ...
};

// 好的写法
C.prototype = {
  constructor: C,
  method1: function (...) { ... },
  // ...
};

// 更好的写法
C.prototype.method1 = function (...) { ... };
```

如果不能确定constructor属性是什么函数，还有一个办法：通过name属性，从实例得到构造函数的名称。

```javascript
function Foo() {}
var f = new Foo();
f.constructor.name // "Foo"
```

#### instanceof 运算符

instanceof运算符返回一个布尔值，表示对象是否为某个构造函数的实例。

```javascript
var v = new Vehicle();
v instanceof Vehicle // true
```

instanceof运算符的左边是实例对象，右边是构造函数。它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上。因此，下面两种写法是等价的。

```javascript
v instanceof Vehicle
// 等同于
Vehicle.prototype.isPrototypeOf(v)
```

> Vehicle是对象v的构造函数，它的原型对象是Vehicle.prototype，isPrototypeOf()方法是 JavaScript 提供的原生方法，用于检查某个对象是否为另一个对象的原型

由于instanceof检查整个原型链，因此同一个实例对象，可能会对多个构造函数都返回true。

```javascript
var d = new Date();
d instanceof Date // true
d instanceof Object // true
```

由于任意对象（除了null）都是Object的实例，所以instanceof运算符可以判断一个值是否为非null的对象。

```javascript
var obj = { foo: 123 };
obj instanceof Object // true

null instanceof Object // false
```

instanceof的原理是检查右边构造函数的prototype属性，是否在左边对象的原型链上。有一种特殊情况，就是左边对象的原型链上，只有null对象。这时，instanceof判断会失真。

```javascript
var obj = Object.create(null);
typeof obj // "object"
obj instanceof Object // false
```

instanceof运算符的一个用处，是判断值的类型。

```javascript
var x = [1, 2, 3];
var y = {};
x instanceof Array // true
y instanceof Object // true
```

注意，instanceof运算符只能用于对象，不适用原始类型的值。

```javascript
var s = 'hello';
s instanceof String // false
// 字符串不是String对象的实例（因为字符串不是对象），所以返回false。
```

对于undefined和null，instanceof运算符总是返回false。

```javascript
undefined instanceof Object // false
null instanceof Object // false
```

利用instanceof运算符，还可以巧妙地解决，调用构造函数时，忘了加new命令的问题。

```javascript
function Fubar (foo, bar) {
  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  } else {
    return new Fubar(foo, bar);
  }
}
// 在函数体内部判断this关键字是否为构造函数Fubar的实例。如果不是，就表明忘了加new命令。
```

#### 构造函数的继承

让一个构造函数继承另一个构造函数，这可以分成两步实现：

- 第一步是在子类的构造函数中，调用父类的构造函数。

```javascript
function Sub(value) {
  Super.call(this);
  this.prop = value;
}
```

> Sub是子类的构造函数，this是子类的实例。在实例上调用父类的构造函数Super，就会让子类实例具有父类实例的属性。

- 第二步，是让子类的原型指向父类的原型，这样子类就可以继承父类原型。

```javascript
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
Sub.prototype.method = '...';
```

> Sub.prototype是子类的原型，要将它赋值为Object.create(Super.prototype)，而不是直接等于Super.prototype。否则后面两行对Sub.prototype的操作，会连父类的原型Super.prototype一起修改掉

另外一种写法是Sub.prototype等于一个父类实例。

```javascript
Sub.prototype = new Super();
// 这种写法也有继承的效果，但是子类会具有父类实例的方法。有时，这可能不是我们需要的，所以不推荐使用这种写法。
```

举例来说，下面是一个Shape构造函数。

```javascript
Explain
function Shape() {
  this.x = 0;
  this.y = 0;
}

Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};
// 让Rectangle构造函数继承Shape。
// 第一步，子类继承父类的实例
function Rectangle() {
  Shape.call(this); // 调用父类构造函数
}
// 另一种写法
function Rectangle() {
  this.base = Shape;
  this.base();
}

// 第二步，子类继承父类的原型
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
```

上面代码中，子类是整体继承父类。有时只需要单个方法的继承，这时可以采用下面的写法。

```javascript
ClassB.prototype.print = function() {
  ClassA.prototype.print.call(this);
  // some code
}
// 子类B的print方法先调用父类A的print方法，再部署自己的代码。这就等于继承了父类A的print方法。
```

#### 多重继承（利用原型链）

JavaScript 不提供多重继承功能，即不允许一个对象同时继承多个对象。但是，可以通过变通方法，实现这个功能。

```javascript
Explain
function M1() {
  this.hello = 'hello';
}

function M2() {
  this.world = 'world';
}

function S() {
  M1.call(this);
  M2.call(this);
}

// 继承 M1
S.prototype = Object.create(M1.prototype);
// 继承链上加入 M2
Object.assign(S.prototype, M2.prototype);

// 指定构造函数
S.prototype.constructor = S;

var s = new S();
s.hello // 'hello'
s.world // 'world'
```

> 子类S同时继承了父类M1和M2。这种模式又称为 `Mixin（混入）`

## JS类 class （ES6）

ES6 引入了 class 语法

### 类定义

创建一个类的语法格式如下：

```javascript
class ClassName {
  constructor() { ... }
}
```

使用 `class` 关键字来创建一个类，类体在一对大括号 `{}` 中，我们可以在大括号 {} 中定义类成员的位置，如方法或构造函数。<br>每个类中包含了一个特殊的方法 `constructor()`，它是类的构造函数，这种方法用于创建和初始化一个由 class 创建的对象。<br>示例：

```javascript
class Runoob {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}
```

> 以上实例创建了一个类，名为 "Runoob"。类中初始化了两个属性： "name" 和 "url"。

**使用类**<br>定义好类后，我们就可以使用 new 关键字来创建对象：

```javascript
class Runoob {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}
 
let site = new Runoob("xxx",  "https://www.runoob.com");
```

### 类表达式

类表达式是定义类的另一种方法。类表达式可以命名或不命名。命名类表达式的名称是该类体的局部名称。

```javascript
// 未命名/匿名类
let Runoob = class {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
};
console.log(Runoob.name);
// output: "Runoob"
 
// 命名类
let Runoob = class Runoob2 {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
};
console.log(Runoob.name);
// 输出: "Runoob2"
```

### 类的方法

```javascript
class ClassName {
  constructor() { ... }
  method_1() { ... }
  method_2() { ... }
  method_3() { ... }
}
```

示例：

```javascript
class Runoob {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  age() {
    let date = new Date();
    return date.getFullYear() - this.year;
  }
}
 
let runoob = new Runoob("xxx", 2018);
document.getElementById("demo").innerHTML =
"菜鸟教程 " + runoob.age() + " 岁了。";
```

还可以向类的方法发送参数：

```javascript
class Runoob {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  age(x) {
    return x - this.year;
  }
}
 
let date = new Date();
let year = date.getFullYear();
 
let runoob = new Runoob("xxx", 2020);
document.getElementById("demo").innerHTML=
"菜鸟教程 " + runoob.age(year) + " 岁了。";
```

### 类继承

JavaScript 类继承使用 `extends` 关键字。<br>继承允许我们依据另一个类来定义一个类，这使得创建和维护一个应用程序变得更容易。<br>`super()` 方法用于调用父类的构造函数。

```javascript
// 基类
class Animal {
    // eat() 函数
    // sleep() 函数
};
//派生类
class Dog extends Animal {
    // bark() 函数
};
```

示例：

```javascript
class Site {
  constructor(name) {
    this.sitename = name;
  }
  present() {
    return '我喜欢' + this.sitename;
  }
}
 
class Runoob extends Site {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  show() {
    return this.present() + ', 它创建了 ' + this.age + ' 年。';
  }
}
 
let noob = new Runoob("xxx", 5);
document.getElementById("demo").innerHTML = noob.show();
```

#### 原型链继承

JavaScript 并没有像其他编程语言一样具有传统的类，而是基于原型的继承模型。<br>ES6 引入了类和 class 关键字，但底层机制仍然基于原型继承。<br>示例：，Animal 是一个基类，Dog 是一个继承自 Animal 的子类，Dog.prototype 使用 Object.create(Animal.prototype) 来创建一个新对象，它继承了 Animal.prototype 的方法和属性，通过将 Dog.prototype.constructor 设置为 Dog，确保继承链上的构造函数正确。

```javascript
function Animal(name) {
  this.name = name;
}
 
Animal.prototype.eat = function() {
  console.log(this.name + " is eating.");
};
 
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
 
// 建立原型链，让 Dog 继承 Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
 
Dog.prototype.bark = function() {
  console.log(this.name + " is barking.");
};
 
var dog = new Dog("Buddy", "Labrador");
dog.eat();  // 调用从 Animal 继承的方法
dog.bark(); // 调用 Dog 的方法
```

#### ES6 类继承

ES6 引入了 class 关键字，使得定义类和继承更加清晰，extends 关键字用于建立继承关系，super 关键字用于在子类构造函数中调用父类的构造函数。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
 
  eat() {
    console.log(this.name + " is eating.");
  }
}
 
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
 
  bark() {
    console.log(this.name + " is barking.");
  }
}
 
const dog = new Dog("Buddy", "Labrador");
dog.eat();
dog.bark();
```

> 不论是使用原型链继承还是 ES6 类继承，都可以实现类似的继承效果，在选择哪种方法时，可以根据个人偏好和项目需求来决定。

### getter 和 setter

使用 getter 和 setter 来获取和设置值，getter 和 setter 都需要在严格模式下执行。<br>getter 和 setter 可以使得我们对属性的操作变的很灵活。<br>类中添加 getter 和 setter 使用的是 get 和 set 关键字。

```javascript
class Runoob {
  constructor(name) {
    this.sitename = name;
  }
  get s_name() {
    return this.sitename;
  }
  set s_name(x) {
    this.sitename = x;
  }
}
 
let noob = new Runoob("xxx");
 
document.getElementById("demo").innerHTML = noob.s_name;
```

注意：即使 getter 是一个方法，当你想获取属性值时也不要使用括号。<br>**getter/setter 方法的名称不能与属性的名称相同**，在本例中属名为 sitename。<br>很多开发者在属性名称前使用下划线字符 _ 将 getter/setter 与实际属性分开：

```javascript
class Runoob {
  constructor(name) {
    this._sitename = name;
  }
  get sitename() {
    return this._sitename;
  }
  set sitename(x) {
    this._sitename = x;
  }
}
 
let noob = new Runoob("xxx");
 
document.getElementById("demo").innerHTML = noob.sitename;
```

getter/setter小结：

- getter 是一种获得属性值的方法，setter 是一种设置属性值的方法
- getter 负责查询值，它不带任何参数，setter 则负责设置键值，值是以参数的形式传递，在他的函数体中，一切的 return 都是无效的。
- get/set 访问器不是对象的属性，而是属性的特性，特性只有内部才用，因此在 JavaScript 中不能直接访问他们，为了表示特性是内部值用两对中括号括起来表示如 `[[Value]]`。

### 提升

函数声明和类声明之间的一个重要区别在于, 函数声明会提升，类声明不会。<br>你首先需要声明你的类，然后再访问它，否则类似以下的代码将抛出 ReferenceError：

```javascript
// 这里不能这样使用类，因为还没有声明
// noob = new Runoob("xxx")
// 报错
 
class Runoob {
  constructor(name) {
    this.sitename = name;
  }
}
 
// 这里可以使用类了
let noob = new Runoob("xxx")
```

### 静态方法

静态方法是使用 `static` 关键字修饰的方法，又叫类方法，属于类的，但不属于对象，在实例化对象之前可以通过 `类名.方法名` 调用静态方法。<br>静态方法不能在对象上调用，只能在类中调用。

```javascript
class Runoob {
  constructor(name) {
    this.name = name;
  }
  static hello() {
    return "Hello!!";
  }
}
 
let noob = new Runoob("xxx");
 
// 可以在类中调用 'hello()' 方法
document.getElementById("demo").innerHTML = Runoob.hello();
 
// 不能通过实例化后的对象调用静态方法
// document.getElementById("demo").innerHTML = noob.hello();
// 以上代码会报错
```

如果你想在对象 noob 中使用静态方法，可以作为一个参数传递给它：

```javascript
class Runoob {
  constructor(name) {
    this.name = name;
  }
  static hello(x) {
    return "Hello " + x.name;
  }
}
let noob = new Runoob("xxx");
document.getElementById("demo").innerHTML = Runoob.hello(noob);
```

## this

面向对象语言中 this 表示当前对象的一个引用。<br>但在 JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变。

- 在方法中，this 表示该方法所属的对象。
- 如果单独使用，this 表示全局对象。
- 在函数中，this 表示全局对象。
- 在函数中，在严格模式下，this 是未定义的(undefined)。
- 在事件中，this 表示接收事件的元素。
- 类似 call() 和 apply() 方法可以将 this 引用到任何对象。

### this关键字

`this`关键字是一个非常重要的语法点。毫不夸张地说，不理解它的含义，大部分开发任务都无法完成。<br>this总是返回一个对象，this就是属性和方法当前所在的对象。

```javascript
var person = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

person.describe()
// "姓名：张三"
// this指的是person
```

### this使用场景

#### 对象的方法

如果对象的方法里面包含this，this的指向就是方法运行时所在的对象。该方法赋值给另一个对象，就会改变this的指向（即this 指向调用它所在方法的对象）

```javascript
var obj ={
  foo: function () {
    console.log(this);
  }
};
obj.foo() // obj
// 上面代码中，obj.foo方法执行时，它内部的this指向obj。

// 下面这几种用法，都会改变this的指向。

```

#### 全局环境

全局环境使用this，则它指向全局(Global)对象。在浏览器中，window 就是该全局对象为 [object Window]:

```javascript
this === window // true

function f() {
  console.log(this === window);
}
f() // true
```

> 上面代码说明，不管是不是在函数内部，只要是在全局环境下运行，this就是指顶层对象window。

#### 函数中使用 this（默认）

在函数中，函数的所属者默认绑定到 this 上。在浏览器中，window 就是该全局对象为 [object Window]:

```javascript
function myFunction() {
  return this;
}
```

严格模式下函数是没有绑定到 this 上，这时候 this 是 undefined。

```javascript
"use strict";
function myFunction() {
  return this;
}
```

#### 事件中的 this

在 HTML 事件句柄中，this 指向了接收事件的 HTML 元素：

```javascript
<button onclick="this.style.display='none'">
点我后我就消失了
</button>
```

#### 对象方法中绑定

下面实例中，this 是 person 对象，person 对象是函数的所有者：

```javascript
var person = {
  firstName  : "John",
  lastName   : "Doe",
  id         : 5566,
  myFunction : function() {
    return this;
  }
};
```

#### 显式函数绑定

在 JavaScript 中函数也是对象，对象则有方法，`apply` 和 `call` 就是函数对象的方法。这两个方法异常强大，他们允许切换函数执行的上下文环境（context），即 this 绑定的对象。<br>在下面实例中，当我们使用 person2 作为参数来调用 person1.fullName 方法时, this 将指向 person2, 即便它是 person1 的方法：

```javascript
var person1 = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
var person2 = {
  firstName:"John",
  lastName: "Doe",
}
person1.fullName.call(person2);  // 返回 "John Doe"，this代表的对象是person2
```

### 绑定this

this的动态切换，固然为 JavaScript 创造了巨大的灵活性，但也使得编程变得困难和模糊。有时，需要把this固定下来，避免出现意想不到的情况。JavaScript 提供了`call`、`apply`、`bind`这三个方法，来切换/固定this的指向。

#### Function.prototype.call()

函数实例的`call`方法，可以指定函数内部this的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。

```javascript
var obj = {};

var f = function () {
  return this;
};

f() === window // true，this指向全局
f.call(obj) === obj // true，this指向obj
```

> 上面代码中，全局环境运行函数f时，this指向全局环境（浏览器为window对象）；call方法可以改变this的指向，指定this指向对象obj，然后在对象obj的作用域中运行函数f。

call方法的参数，应该是一个对象。如果参数为`空`、`null`和`undefined`，则默认传入全局对象：

```javascript
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

> a函数中的this关键字，如果指向全局对象，返回结果为123。如果使用call方法将this关键字指向obj对象，返回结果为456。可以看到，如果call方法没有参数，或者参数为null或undefined，则等同于指向全局对象。

如果call方法的参数是一个原始值，那么这个原始值会自动转成对应的包装对象，然后传入call方法：

```javascript
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```

> call的参数为5，不是对象，会被自动转成包装对象（Number的实例），绑定f内部的this。

call方法还可以接受多个参数：call的第一个参数就是this所要指向的那个对象，后面的参数则是函数调用时所需的参数。

```javascript
func.call(thisValue, arg1, arg2, ...)
// 示例
function add(a, b) {
  return a + b;
}

add.call(this, 1, 2) // 3
```

> call方法指定函数add内部的this绑定当前环境（对象），并且参数为1和2，因此函数add运行后得到3。

call方法的一个应用是调用对象的原生方法：

```javascript
var obj = {};
obj.hasOwnProperty('toString') // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true

Object.prototype.hasOwnProperty.call(obj, 'toString') // false
```

> hasOwnProperty是obj对象继承的方法，如果这个方法一旦被覆盖，就不会得到正确结果。call方法可以解决这个问题，它将hasOwnProperty方法的原始定义放到obj对象上执行，这样无论obj上有没有同名方法，都不会影响结果。

#### Function.prototype.apply()

apply方法的作用与call方法类似，也是改变this指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为函数执行时的参数，使用格式如下：

```javascript
func.apply(thisValue, [arg1, arg2, ...])
```

- apply方法的第一个参数也是this所要指向的那个对象，如果设为null或undefined，则等同于指定全局对象。
- 第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在call方法中必须一个个添加，但是在apply方法中，必须以数组形式添加。

```javascript
function f(x, y){
  console.log(x + y);
}

f.call(null, 1, 1) // 2
f.apply(null, [1, 1]) // 2
```

> 上面代码中，f函数本来接受两个参数，使用apply方法以后，就变成可以接受一个数组作为参数。

利用这一点，可以做一些有趣的应用。

- 找出数组最大元素

JavaScript 不提供找出数组最大元素的函数。结合使用apply方法和Math.max方法，就可以返回数组的最大元素。

```javascript
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a) // 15
```

#### Function.prototype.bind()

bind()方法用于将函数体内的this绑定到某个对象，然后返回一个新函数。

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var func = counter.inc.bind(counter);
func();
counter.count // 1
// counter.inc()方法被赋值给变量func。这时必须用bind()方法将inc()内部的this，绑定到counter，否则就会出错。
```

this绑定到其他对象也是可以的。

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var obj = {
  count: 100
};
var func = counter.inc.bind(obj);
func();
obj.count // 101
// bind()方法将inc()方法内部的this，绑定到obj对象。结果调用func函数以后，递增的就是obj内部的count属性。
```

bind()还可以接受更多的参数，将这些参数绑定原函数的参数。

```javascript
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);
newAdd(5) // 20
```

> bind()方法除了绑定this对象，还将add()函数的第一个参数x绑定成5，然后返回一个新函数newAdd()，这个函数只要再接受一个参数y就能运行了。

如果bind()方法的第一个参数是null或undefined，等于将this绑定到全局对象，函数运行时this指向顶层对象（浏览器为window）。

```javascript
function add(x, y) {
  return x + y;
}

var plus5 = add.bind(null, 5);
plus5(10) // 15
```

> 函数add()内部并没有this，使用bind()方法的主要目的是绑定参数x，以后每次运行新函数plus5()，就只需要提供另一个参数y就够了。而且因为add()内部没有this，所以bind()的第一个参数是null，不过这里如果是其他对象，也没有影响。

bind()方法有一些使用注意点。

##### 每一次返回一个新函数

bind()方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。

```javascript
element.addEventListener('click', o.m.bind(o));
// click事件绑定bind()方法生成的一个匿名函数。这样会导致无法取消绑定，所以下面的代码是无效的。
element.removeEventListener('click', o.m.bind(o));

// 正确的方法是写成下面这样：
var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);
```

##### 结合回调函数使用

回调函数是 JavaScript 最常用的模式之一，但是一个常见的错误是，将包含this的方法直接当作回调函数。解决方法就是使用bind()方法，将counter.inc()绑定counter。

```javascript
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc.bind(counter));
counter.count // 1
```

> callIt()方法会调用回调函数。这时如果直接把counter.inc传入，调用时counter.inc()内部的this就会指向全局对象。使用bind()方法将counter.inc绑定counter以后，就不会有这个问题，this总是指向counter。

还有一种情况比较隐蔽，就是某些数组方法可以接受一个函数当作参数。这些函数内部的this指向，很可能也会出错。

```javascript
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// 没有任何输出

// 打印this对象
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this === window);
  });
};

obj.print()
// true
// true
// true
```

obj.print内部this.times的this是指向obj的，这个没有问题。但是，forEach()方法的回调函数内部的this.name却是指向全局对象，导致没有办法取到值。<br>解决这个问题，也是通过bind()方法绑定this。

```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};

obj.print()
// 张三
// 张三
// 张三
```

##### 结合call()方法使用

利用bind()方法，可以改写一些 JavaScript 原生方法的使用形式，以数组的slice()方法为例。

```javascript
[1, 2, 3].slice(0, 1) // [1]
// 等同于
Array.prototype.slice.call([1, 2, 3], 0, 1) // [1]
```

> 上面的代码中，数组的slice方法从[1, 2, 3]里面，按照指定的开始位置和结束位置，切分出另一个数组。这样做的本质是在[1, 2, 3]上面调用Array.prototype.slice()方法，因此可以用call方法表达这个过程，得到同样的结果。

call()方法实质上是调用`Function.prototype.call()`方法，因此上面的表达式可以用bind()方法改写。

```javascript
var slice = Function.prototype.call.bind(Array.prototype.slice);
slice([1, 2, 3], 0, 1) // [1]
```

上面代码的含义就是，将Array.prototype.slice变成Function.prototype.call方法所在的对象，调用时就变成了Array.prototype.slice.call。类似的写法还可以用于其他数组方法。

```javascript
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]
```

将`Function.prototype.call`方法绑定到`Function.prototype.bind`对象，就意味着bind的调用形式也可以被改写。

```javascript
function f() {
  console.log(this.v);
}

var o = { v: 123 };
var bind = Function.prototype.call.bind(Function.prototype.bind);
bind(f, o)() // 123
```

> 上面代码的含义就是，将Function.prototype.bind方法绑定在Function.prototype.call上面，所以bind方法就可以直接使用，不需要在函数实例上使用。

## 模块

JavaScript 不是一种模块化编程语言，ES6 才开始支持“类”和“模块”。模块是实现特定功能的一组属性和方法的封装。

### 方式1：模块基本的实现方法

简单的做法是把模块写成一个对象，所有的模块成员都放到这个对象里面。

```javascript
var module1 = new Object({
　_count : 0,
　m1 : function (){
　　//...
　},
　m2 : function (){
  　//...
　}
});
```

函数m1和m2，都封装在module1对象里。使用的时候，就是调用这个对象的属性。

```javascript
module1.m1();
```

**不足：**这样的写法会暴露所有模块成员，内部状态可以被外部改写。比如，外部代码可以直接改变内部计数器的值。

```javascript
module1._count = 5;
```

### 方式2：封装私有变量：构造函数的写法

```javascript
function StringBuilder() {
  var buffer = [];
  this.add = function (str) {
     buffer.push(str);
  };
  this.toString = function () {
    return buffer.join('');
  };
}
```

buffer是模块的私有变量。一旦生成实例对象，外部是无法直接访问buffer的。但是，这种方法将私有变量封装在构造函数中，导致构造函数与实例对象是一体的，总是存在于内存之中，无法在使用完成后清除。这意味着，构造函数有双重作用，既用来塑造实例对象，又用来保存实例对象的数据，违背了构造函数与实例对象在数据上相分离的原则（即实例对象的数据，不应该保存在实例对象以外）。同时，非常耗费内存。<br>用prototype，每个StringBuilder实例共享add和toString方法

```javascript
function StringBuilder() {
  this._buffer = [];
}

StringBuilder.prototype = {
  constructor: StringBuilder,
  add: function (str) {
    this._buffer.push(str);
  },
  toString: function () {
    return this._buffer.join('');
  }
};
```

这种方法将私有变量放入实例对象中，好处是看上去更自然，但是它的私有变量可以从外部读写，不是很安全。

### 封装私有变量：立即执行函数的写法

“立即执行函数”（Immediately-Invoked Function Expression，IIFE），将相关的属性和方法封装在一个函数作用域里面，可以达到不暴露私有成员的目的。

```javascript
var module1 = (function () {
　var _count = 0;
　var m1 = function () {
　  //...
　};
　var m2 = function () {
　　//...
　};
　return {
　　m1 : m1,
　　m2 : m2
　};
})();
```

使用上面的写法，外部代码无法读取内部的_count变量：

```javascript
console.info(module1._count); //undefined
```

上面的module1就是 JavaScript 模块的基本写法。

### 输入全局变量

独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。<br>为了在模块内部调用全局变量，必须显式地将其他变量输入模块

```javascript
var module1 = (function ($, YAHOO) {
　//...
})(jQuery, YAHOO);
```

立即执行函数还可以起到命名空间的作用。

```javascript
(function($, window, document) {

  function go(num) {
  }

  function handleEvents() {
  }

  function initialize() {
  }

  function dieCarouselDie() {
  }

  //attach to the global scope
  window.finalCarousel = {
    init : initialize,
    destroy : dieCarouselDie
  }

})( jQuery, window, document );
```

> 上面代码中，finalCarousel对象输出到全局，对外暴露init和destroy接口，内部方法go、handleEvents、initialize、dieCarouselDie都是外部无法调用的。

## Object 对象的相关方法

### Object.getPrototypeOf()

`Object.getPrototypeOf()`方法返回参数对象的原型。这是获取原型对象的标准方法。

```javascript
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
// 实例对象f的原型是F.prototype
```

几种特殊对象的原型。

```javascript
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true
```

### Object.setPrototypeOf()

`Object.setPrototypeOf`方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

```javascript
Explain
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```

> Object.setPrototypeOf方法将对象a的原型，设置为对象b，因此a可以共享b的属性。

new命令可以使用Object.setPrototypeOf方法模拟。

```javascript
var F = function () {
  this.foo = 'bar';
};

var f = new F();
// 等同于
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```

> new命令新建实例对象，其实可以分成两步。第一步，将一个空对象的原型设为构造函数的prototype属性（上例是F.prototype）；第二步，将构造函数内部的this绑定这个空对象，然后执行构造函数，使得定义在this上面的方法和属性（上例是this.foo），都转移到这个空对象上。

### Object.create()

生成实例对象的常用方法是，使用new命令让构造函数返回一个实例。<br>如果从一个已有的实例生成新的实例：<br>JavaScript 提供了`Object.create()`方法，该方法接受一个对象作为参数，然后以它为原型，返回一个实例对象。该实例完全继承原型对象的属性。

```javascript
// 原型对象
var A = {
  print: function () {
    console.log('hello');
  }
};

// 实例对象
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true
```

实际上，Object.create()方法可以用下面的代码代替。

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
```

> Object.create()方法的实质是新建一个空的构造函数F，然后让F.prototype属性指向参数对象obj，最后返回一个F的实例，从而实现让该实例继承obj的属性。

下面三种方式生成的新对象是等价的。

```javascript
var obj1 = Object.create({});
var obj2 = Object.create(Object.prototype);
var obj3 = new Object();
```

### Object.prototype.isPrototypeOf()

实例对象的isPrototypeOf方法，用来判断该对象是否为参数对象的原型。

```javascript
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true

Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false
```

### Object.prototype.**proto**

实例对象的`__proto__`属性（前后各两个下划线），返回该对象的原型。该属性可读写。

```javascript
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```

根据语言标准，`__proto__`属性只有浏览器才需要部署，其他环境可以没有这个属性。它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用`Object.getPrototypeOf()`和`Object.setPrototypeOf()`，进行原型对象的读写操作。<br>原型链可以用`__proto__`很直观地表示。

```javascript
var A = {
  name: '张三'
};
var B = {
  name: '李四'
};

var proto = {
  print: function () {
    console.log(this.name);
  }
};

A.__proto__ = proto;
B.__proto__ = proto;

A.print() // 张三
B.print() // 李四

A.print === B.print // true
A.print === proto.print // true
B.print === proto.print // true
```

# JSON

JSON 使用 JavaScript 语法，但是 JSON 格式仅仅是一个文本。<br>文本可以被任何编程语言读取及作为数据格式传递。

## JSON 实例

```javascript
{"sites":[
    {"name":"Runoob", "url":"www.runoob.com"}, 
    {"name":"Google", "url":"www.google.com"},
    {"name":"Taobao", "url":"www.taobao.com"}
]}
```

## JSON 格式化后为 JavaScript 对象

JSON 格式在语法上与创建 JavaScript 对象代码是相同的。<br>由于它们很相似，所以 JavaScript 程序可以很容易的将 JSON 数据转换为 JavaScript 对象。

```javascript
var text = '{ "sites" : [' +
'{ "name":"Runoob" , "url":"www.runoob.com" },' +
'{ "name":"Google" , "url":"www.google.com" },' +
'{ "name":"Taobao" , "url":"www.taobao.com" } ]}';
// 使用 JavaScript 内置函数 JSON.parse() 将字符串转换为 JavaScript 对象:
var obj = JSON.parse(text);
```

| 函数                                                                           | 描述                               |
| ---------------------------------------------------------------------------- | -------------------------------- |
| [JSON.parse()](https://www.runoob.com/js/javascript-json-parse.html)         | 用于将一个 JSON 字符串转换为 JavaScript 对象。 |
| [JSON.stringify()](https://www.runoob.com/js/javascript-json-stringify.html) | 用于将 JavaScript 值转换为 JSON 字符串。    |

## 严格模式

早期的 JavaScript 语言有很多设计不合理的地方，但是为了兼容以前的代码，又不能改变老的语法，只能不断添加新的语法，引导程序员使用新语法。<br>严格模式是从 ES5 进入标准的，主要目的有以下几个。

- 明确禁止一些不合理、不严谨的语法，减少 JavaScript 语言的一些怪异行为。
- 增加更多报错的场合，消除代码运行的一些不安全之处，保证代码运行的安全。
- 提高编译器效率，增加运行速度。
- 为未来新版本的 JavaScript 语法做好铺垫。
- [ ] [严格模式](https://wangdoc.com/javascript/oop/strict)
