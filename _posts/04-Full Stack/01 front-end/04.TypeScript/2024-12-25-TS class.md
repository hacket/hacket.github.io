---
date created: 2024-12-25 01:00
date updated: 2024-12-25 01:00
dg-publish: true
tags:
  - '#x'
  - '#x'
---

# class

## class基础

类（class）是面向对象编程的基本构件，封装了属性和方法，TypeScript 给予了全面支持。

### 属性的类型

类的属性可以在顶层声明，也可以在构造方法内部声明。<br>对于顶层声明的属性，可以在声明时同时给出类型。

```typescript
class Point {
  x:number;
  y:number;
}
```

如果不给出类型，TypeScript 会认为x和y的类型都是any。

```typescript
class Point {
  x;
  y;
}
```

如果声明时给出初值，可以不写类型，TypeScript 会自行推断属性的类型。

```typescript
class Point {
  x = 0;
  y = 0;
}
// 推断出number类型
```

TypeScript 有一个配置项`strictPropertyInitialization`，只要打开（默认是打开的），就会检查属性是否设置了初值，如果没有就报错。

### readonly 修饰符

属性名前面加上 readonly 修饰符，就表示该属性是只读的。实例对象不能修改这个属性。

```typescript
class A {
  readonly id = 'foo';
}

const a = new A();
a.id = 'bar'; // 报错
```

readonly 属性的初始值，可以写在顶层属性，也可以写在构造方法里面。

```typescript
class A {
  readonly id:string;

  constructor() {
    this.id = 'bar'; // 正确
  }
}
// 构造方法内部设置只读属性的初值，这是可以的。
class A {
  readonly id:string = 'foo';

  constructor() {
    this.id = 'bar'; // 正确
  }
}
```

### 方法的类型

类的方法就是普通函数，类型声明方式与函数一致。

```typescript
class Point {
  x:number;
  y:number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  add(point:Point) {
    return new Point(
      this.x + point.x,
      this.y + point.y
    );
  }
}
```

- 类的方法跟普通函数一样，可以使用参数默认值，以及函数重载。

```typescript
class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
// 重载
class Point {
  constructor(x:number, y:string);
  constructor(s:string);
  constructor(xs:number|string, y?:string) {
    // ...
  }
}
```

- 另外，构造方法不能声明返回值类型，否则报错，因为它总是返回实例对象。

```typescript
class B {
  constructor():object { // 报错
    // ...
  }
}
```

### 存取器方法

存取器（accessor）是特殊的类方法，包括取值器（getter）和存值器（setter）两种方法。

```typescript
class C {
  _name = '';
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
}
```

> - get name()是取值器，其中get是关键词，name是属性名。外部读取name属性时，实例对象会自动调用这个方法，该方法的返回值就是name属性的值。
> - set name()是存值器，其中set是关键词，name是属性名。外部写入name属性时，实例对象会自动调用这个方法，并将所赋的值作为函数参数传入。

TypeScript 对存取器有以下规则。

- 如果某个属性只有get方法，没有set方法，那么该属性自动成为只读属性。

```typescript
class C {
  _name = 'foo';

  get name() {
    return this._name;
  }
}

const c = new C();
c.name = 'bar'; // 报错
```

- TypeScript 5.1 版之前，set方法的参数类型，必须兼容get方法的返回值类型，否则报错。

```typescript
// TypeScript 5.1 版之前
class C {
  _name = '';
  get name():string {  // 报错
    return this._name;
  }
  set name(value:number) {
    this._name = String(value);
  }
}
```

peScript 5.1 版做出了改变，现在两者可以不兼容。

- get方法与set方法的可访问性必须一致，要么都为公开方法，要么都为私有方法。

### 属性索引

类允许定义属性索引。

```typescript
class MyClass {
  [s:string]: boolean |
    ((s:string) => boolean);

  get(s:string) {
    return this[s] as boolean;
  }
}
```

> [s:string]表示所有属性名类型为字符串的属性，它们的属性值要么是布尔值，要么是返回布尔值的函数。

注意，由于类的方法是一种特殊属性（属性值为函数的属性），所以属性索引的类型定义也涵盖了方法。如果一个对象同时定义了属性索引和方法，那么前者必须包含后者的类型。

```typescript
class MyClass {
  [s:string]: boolean;
  f() { // 报错
    return true;
  }
}
```

## class类型

### 实例类型

TypeScript 的类本身就是一种类型，但是它代表**该类的实例类型**，而不是 class 的自身类型。

```typescript
class Color {
  name:string;

  constructor(name:string) {
    this.name = name;
  }
}

const green:Color = new Color('green');
```

> 类名Color就代表一种类型，实例对象green就属于该类型。

实例对象的变量既可以声明为class，也可以声明为interface，因为两者都代表实例对象的类型。

```typescript
interface MotorVehicle {
}

class Car implements MotorVehicle {
}

// 写法一
const c1:Car = new Car();
// 写法二
const c2:MotorVehicle = new Car();
```

> 变量的类型可以写成类Car，也可以写成接口MotorVehicle。它们的区别是，如果类Car有接口MotoVehicle没有的属性和方法，那么只有变量c1可以调用这些属性和方法。

**由于类名作为类型使用，实际上代表一个对象，因此可以把类看作为对象类型起名。事实上，TypeScript 有三种方法可以为对象类型起名：**`**type**`**、**`**interface**`** 和 **`**class**`**。**

### 类的自身类型

JavaScript 语言中，类只是构造函数的一种语法糖，本质上是构造函数的另一种写法。所以，类的自身类型可以写成`构造函数`的形式。

```typescript
function createPoint(
  PointClass: new (x:number, y:number) => Point,
  x: number,
  y: number
):Point {
  return new PointClass(x, y);
}
```

构造函数也可以写成对象形式，所以参数PointClass的类型还有另一种写法：

```typescript
function createPoint(
  PointClass: {
    new (x:number, y:number): Point
  },
  x: number,
  y: number
):Point {
  return new PointClass(x, y);
}
```

也可以把构造函数提取出来，单独定义一个接口（interface），这样可以大大提高代码的通用性。

```typescript
interface PointConstructor {
  new(x:number, y:number):Point;
}

function createPoint(
  PointClass: PointConstructor,
  x: number,
  y: number
):Point {
  return new PointClass(x, y);
}
```

类的自身类型就是一个构造函数，可以单独定义一个接口来表示。

### 结构类型原则

Class 也遵循“结构类型原则”。一个对象只要满足 Class 的实例结构，就跟该 Class 属于同一个类型。

```typescript
class Foo {
  id!:number;
}

function fn(arg:Foo) {
  // ...
}

const bar = {
  id: 10,
  amount: 100,
};

fn(bar); // 正确
```

> 对象bar满足类Foo的实例结构，只是多了一个属性amount。所以，它可以当作参数，传入函数fn()。

如果两个类的实例结构相同，那么这两个类就是兼容的，可以用在对方的使用场合：

```typescript
class Person {
  name: string;
}

class Customer {
  name: string;
}

// 正确
const cust:Customer = new Person();
```

总之，只要 A 类具有 B 类的结构，哪怕还有额外的属性和方法，TypeScript 也认为 A 兼容 B 的类型。<br>不仅是类，如果某个对象跟某个 class 的实例结构相同，TypeScript 也认为两者的类型相同。

```typescript
class Person {
  name: string;
}

const obj = { name: 'John' };
const p:Person = obj; // 正确
```

> 对象obj并不是Person的实例，但是赋值给变量p不会报错，TypeScript 认为obj也属于Person类型，因为它们的属性相同

由于这种情况，运算符instanceof不适用于判断某个对象是否跟某个 class 属于同一类型。

```typescript
obj instanceof Person // false
```

空类不包含任何成员，任何其他类都可以看作与空类结构相同。因此，凡是类型为空类的地方，所有类（包括对象）都可以使用。

```typescript
class Empty {}

function fn(x:Empty) {
  // ...
}

fn({});
fn(window);
fn(fn);
```

- 确定两个类的兼容关系时，只检查实例成员，不考虑静态成员和构造方法。
- 如果类中存在私有成员（private）或保护成员（protected），那么确定兼容关系时，TypeScript 要求私有成员和保护成员来自同一个类，这意味着两个类需要存在继承关系

## 类的继承 extends

类（这里又称“子类”）可以使用`extends`关键字继承另一个类（这里又称“基类”）的所有属性和方法。

```typescript
class A {
  greet() {
    console.log('Hello, world!');
  }
}

class B extends A {
}

const b = new B();
b.greet() // "Hello, world!"
```

- 根据结构类型原则，子类也可以用于类型为基类的场合，类似Java多态

```typescript
const a:A = b;
a.greet()
```

- 子类可以覆盖基类的同名方法

```typescript
class B extends A {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name}`);
    }
  }
}
```

- 子类的同名方法不能与基类的类型定义相冲突

```typescript
class A {
  greet() {
    console.log('Hello, world!');
  }
}

class B extends A {
  // 报错
  greet(name:string) {
    console.log(`Hello, ${name}`);
  }
}
```

- 如果基类包括保护成员（protected修饰符），子类可以将该成员的可访问性设置为公开（public修饰符），也可以保持保护成员不变，但是不能改用私有成员（private修饰符）(**修饰符范围不能变小**)

```typescript
class A {
  protected x: string = '';
  protected y: string = '';
  protected z: string = '';
}

class B extends A {
  // 正确
  public x:string = '';

  // 正确
  protected y:string = '';

  // 报错
  private z: string = '';
}
```

- extends关键字后面不一定是类名，可以是一个表达式，只要它的类型是构造函数就可以了

```typescript
/ 例一
class MyArray extends Array<number> {}

// 例二
class MyError extends Error {}

// 例三
class A {
  greeting() {
    return 'Hello from A';
  }
}
class B {
  greeting() {
    return 'Hello from B';
  }
}

interface Greeter {
  greeting(): string;
}

interface GreeterConstructor {
  new (): Greeter;
}

function getGreeterBase():GreeterConstructor {
  return Math.random() >= 0.5 ? A : B;
}

class Test extends getGreeterBase() {
  sayHello() {
    console.log(this.greeting());
  }
}
```

## 可访问性修饰符

类的内部成员的外部可访问性，由三个可访问性修饰符（access modifiers）控制：`public`、`private`和`protected`。<br>这三个修饰符的位置，都写在属性或方法的最前面。

### public

- public修饰符表示这是公开成员，外部可以自由访问。
- public修饰符是默认修饰符，如果省略不写，实际上就带有该修饰符。因此，类的属性和方法默认都是外部可访问的。

### ~~private~~

- private修饰符表示私有成员，只能用在当前类的内部，类的实例和子类都不能使用该成员。
- 子类不能定义父类私有成员的同名成员，会报错
- 如果在类的内部，当前类的实例可以获取私有成员。
- 严格地说，private定义的私有成员，并不是真正意义的私有成员。一方面，编译成 JavaScript 后，private关键字就被剥离了，这时外部访问该成员就不会报错。另一方面，由于前一个原因，TypeScript 对于访问private成员没有严格禁止，使用方括号写法（`[]`）或者`in`运算符，实例对象就能访问该成员。

```typescript
class A {
  private x = 1;
}

const a = new A();
a['x'] // 1

if ('x' in a) { // 正确
  // ...
}
```

- 由于private存在这些问题，加上它是 ES2022 标准发布前出台的，而 ES2022 引入了自己的私有成员写法`#propName`。因此~~建议不使用private~~，改用 ES2022 的写法，获得真正意义的私有成员。

```typescript
class A {
  #x = 1;
}

const a = new A();
a['x'] // 报错
```

- 构造方法也可以是私有的，这就直接防止了使用new命令生成实例对象，只能在类的内部创建实例对象。时一般会有一个静态方法，充当工厂函数，强制所有实例都通过该方法生成。

### protected

protected修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用。

```typescript
class A {
  protected x = 1;
}

class B extends A {
  getX() {
    return this.x;
  }
}

const a = new A();
const b = new B();

a.x // 报错
b.getX() // 1
```

- 子类不仅可以拿到父类的保护成员，还可以定义同名成员。
- 在类的外部，实例对象不能读取保护成员，但是在类的内部可以

### 实例属性的简写形式

旧写法：

```typescript
class Point {
  x:number;
  y:number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}
```

这样的写法等于对同一个属性要声明两次类型，一次在类的头部，另一次在构造方法的参数里面。这有些累赘，TypeScript 就提供了一种简写形式，新写法：

```typescript
class Point {
  constructor(
    public x:number,
    public y:number
  ) {}
}

const p = new Point(10, 10);
p.x // 10
p.y // 10
```

> 构造方法的参数x前面有public修饰符，这时 TypeScript 就会自动声明一个公开属性x，不必在构造方法里面写任何代码，同时还会设置x的值为构造方法的参数值。注意，这里的public不能省略。

除了public修饰符，构造方法的参数名只要有private、protected、readonly修饰符，都会自动声明对应修饰符的实例属性。

```typescript
class A {
  constructor(
    public a: number,
    protected b: number,
    private c: number,
    readonly d: number
  ) {}
}

// 编译结果
class A {
    a;
    b;
    c;
    d;
    constructor(a, b, c, d) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
    }
}
```

`readonly`还可以与其他三个可访问性修饰符，一起使用：

```typescript
class A {
  constructor(
    public readonly x:number,
    protected readonly y:number,
    private readonly z:number
  ) {}
}
```

## 静态成员

- 类的内部可以使用static关键字，定义静态成员。
- 静态成员是只能通过类本身使用的成员，不能通过实例对象使用。
- static关键字前面可以使用 public、private、protected 修饰符。

```typescript
class MyClass {
  private static x = 0;
}

MyClass.x // 报错
```

- 静态私有属性也可以用 ES6 语法的`#前缀`表示

```typescript
class MyClass {
  static #x = 0;
}
```

- public和protected的静态成员可以被继承。

```typescript
class A {
  public static x = 1;
  protected static y = 1;
}

class B extends A {
  static getY() {
    return B.y;
  }
}

B.x // 1
B.getY() // 1
```

# 泛型类（同Java）

类也可以写成泛型，使用类型参数

```typescript
class Box<Type> {
  contents: Type;

  constructor(value:Type) {
    this.contents = value;
  }
}

const b:Box<string> = new Box('hello!');
```

注意，静态成员不能使用泛型的类型参数。

```typescript
class Box<Type> {
  static defaultContents: Type; // 报错
}
```

# 抽象类，抽象成员（同Java）

TypeScript 允许在类的定义前面，加上关键字`abstract`，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做“抽象类”（abstract class）。

```typescript
abstract class A {
  id = 1;
}

const a = new A(); // 报错
```

- 抽象类只能当作基类使用，用来在它的基础上定义子类。
- 抽象类的子类也可以是抽象类，也就是说，抽象类可以继承其他抽象类。
- 抽象类的内部可以有已经实现好的属性和方法，也可以有还未实现的属性和方法。后者就叫做“抽象成员”（abstract member），即属性名和方法名有abstract关键字，表示该方法需要子类实现。如果子类没有实现抽象成员，就会报错。

这里有几个注意点。<br>（1）抽象成员只能存在于抽象类，不能存在于普通类。<br>（2）抽象成员不能有具体实现的代码。也就是说，已经实现好的成员前面不能加abstract关键字。<br>（3）抽象成员前也不能有private修饰符，否则无法在子类中实现该成员。<br>（4）一个子类最多只能继承一个抽象类。
