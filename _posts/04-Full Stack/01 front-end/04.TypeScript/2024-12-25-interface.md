---
date created: 2024-12-25 01:00
date updated: 2024-12-25 01:00
dg-publish: true
---

# interface

## interface基础

interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”。使用了某个模板的对象，就拥有了指定的类型结构：

```typescript
interface Person {
  firstName: string;
  lastName: string;
  age: number;
}
```

实现该接口很简单，只要指定它作为对象的类型即可：

```typescript
const p:Person = {
  firstName: 'John',
  lastName: 'Smith',
  age: 25
};
```

方括号运算符(`[]`)可以取出 interface 某个属性的类型。

```typescript
interface Foo {
  a: string;
}

type A = Foo['a']; // string
```

## interface语法

interface 可以表示对象的各种语法，它的成员有5种形式。

- 对象属性
- 对象的属性索引
- 对象方法
- 函数
- 构造函数

### 对象属性

- 属性之间使用分号或逗号分隔，最后一个属性结尾的分号或逗号可以省略。

```typescript
interface Point {
  x: number;
  y: number;
}
```

> x和y都是对象的属性，分别使用冒号指定每个属性的类型

- 如果属性是可选的，就在属性名后面加一个问号。

```typescript
interface Foo {
  x?: string;
}
```

- 如果属性是只读的，需要加上readonly修饰符。

```typescript
interface A {
  readonly a: string;
}
```

### 对象的属性索引

```typescript
interface A {
  [prop: string]: number;
}
```

> [prop: string]就是属性的字符串索引，表示属性名只要是字符串，都符合类型要求。

属性索引共有string、number和symbol三种类型。<br>一个接口中，最多只能定义一个字符串索引。字符串索引会约束该类型中所有名字为字符串的属性。

```typescript
interface MyObj {
  [prop: string]: number;

  a: boolean;      // 编译错误
}
```

> 属性索引指定所有名称为字符串的属性，它们的属性值必须是数值（number）。属性a的值为布尔值就报错了。

属性的数值索引，其实是指定数组的类型。

```typescript
interface A {
  [prop: number]: string;
}

const obj:A = ['a', 'b', 'c'];
```

> [prop: number]表示属性名的类型是数值，所以可以用数组对变量obj赋值。

同样的，一个接口中最多只能定义一个数值索引。数值索引会约束所有名称为数值的属性。<br>如果一个 interface 同时定义了字符串索引和数值索引，那么数值索引必须服从于字符串索引。因为在 JavaScript 中，数值属性名最终是自动转换成字符串属性名。

```typescript
interface A {
  [prop: string]: number;
  [prop: number]: string; // 报错
}

interface B {
  [prop: string]: number;
  [prop: number]: number; // 正确
}
```

> 数值索引的属性值类型与字符串索引不一致，就会报错。数值索引必须兼容字符串索引的类型声明。

### 对象方法

对象的方法共有三种写法。

```typescript
// 写法一
interface A {
  f(x: boolean): string;
}

// 写法二
interface B {
  f: (x: boolean) => string;
}

// 写法三
interface C {
  f: { (x: boolean): string };
}
```

属性名可以采用表达式，所以下面的写法也是可以的：

```typescript
const f = 'f';

interface A {
  [f](x: boolean): string;
}
```

类型方法可以重载：

```typescript
interface A {
  f(): number;
  f(x: boolean): boolean;
  f(x: string, y: string): string;
}
```

interface 里面的函数重载，不需要给出实现。但是，由于对象内部定义方法时，无法使用函数重载的语法，所以需要额外在对象外部给出函数方法的实现。

```typescript
interface A {
  f(): number;
  f(x: boolean): boolean;
  f(x: string, y: string): string;
}

function MyFunc(): number;
function MyFunc(x: boolean): boolean;
function MyFunc(x: string, y: string): string;
function MyFunc(
  x?:boolean|string, y?:string
):number|boolean|string {
  if (x === undefined && y === undefined) return 1;
  if (typeof x === 'boolean' && y === undefined) return true;
  if (typeof x === 'string' && typeof y === 'string') return 'hello';
  throw new Error('wrong parameters');  
}

const a:A = {
  f: MyFunc
}
```

> 接口A的方法f()有函数重载，需要额外定义一个函数MyFunc()实现这个重载，然后部署接口A的对象a的属性f等于函数MyFunc()就可以了。

### 函数

interface 也可以用来声明独立的函数。

```typescript
interface Add {
  (x:number, y:number): number;
}

const myAdd:Add = (x,y) => x + y;
```

### 构造函数

interface 内部可以使用new关键字，表示构造函数。

```typescript
interface ErrorConstructor {
  new (message?: string): Error;
}
```

TypeScript 里面，构造函数特指具有constructor属性的类

## interface 的继承

### interface 继承 interface

interface 可以使用`extends`关键字，继承其他 interface。

```typescript
interface Shape {
  name: string;
}

interface Circle extends Shape {
  radius: number;
}
```

extends关键字会从继承的接口里面拷贝属性类型，这样就不必书写重复的属性。<br>interface 允许多重继承。

```typescript
interface Style {
  color: string;
}

interface Shape {
  name: string;
}

interface Circle extends Style, Shape {
  radius: number;
}
```

多重接口继承，实际上相当于多个父接口的合并。<br>如果子接口与父接口存在同名属性，那么子接口的属性会覆盖父接口的属性。注意，子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错。

```typescript
interface Foo {
  id: string;
}

interface Bar extends Foo {
  id: number; // 报错
}
```

### interface 继承 type

interface 可以继承type命令定义的对象类型。

```typescript
type Country = {
  name: string;
  capital: string;
}

interface CountryWithPop extends Country {
  population: number;
}
```

注意，如果type命令定义的类型不是对象，interface 就无法继承。

### interface 继承 class

interface 还可以继承 class，即继承该类的所有成员。

```typescript
class A {
  x:string = '';

  y():boolean {
    return true;
  }
}

interface B extends A {
  z: number
}

const b:B = {
  x: '',
  y: function(){ return true },
  z: 123
}
```

某些类拥有私有成员和保护成员，interface 可以继承这样的类，但是意义不大。

```typescript
class A {
  private x: string = '';
  protected y: string = '';
}

interface B extends A {
  z: number
}

// 报错
const b:B = { /* ... */ }

// 报错
class C implements B {
  // ...
}
```

> A有私有成员和保护成员，B继承了A，但无法用于对象，因为对象不能实现这些成员。这导致B只能用于其他 class，而这时其他 class 与A之间不构成父类和子类的关系，使得x与y无法部署。

## 接口合并

多个同名接口会合并成一个接口。

```typescript
interface Box {
  height: number;
  width: number;
}

interface Box {
  length: number;
}
```

这样的设计主要是为了兼容 JavaScript 的行为。JavaScript 开发者常常对全局对象或者外部库，添加自己的属性和方法。那么，只要使用 interface 给出这些自定义属性和方法的类型，就能自动跟原始的 interface 合并，使得扩展外部类型非常方便。

同名接口合并时，同一个属性如果有多个类型声明，彼此不能有类型冲突。

```typescript
interface A {
  a: number;
}

interface A {
  a: string; // 报错
}
```

同名接口合并时，如果同名方法有不同的类型声明，那么会发生函数重载。而且，后面的定义比前面的定义具有更高的优先级。

```typescript
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// 等同于
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

这个规则有一个例外。同名方法之中，如果有一个参数是字面量类型，字面量类型有更高的优先级。

```typescript
interface A {
  f(x:'foo'): boolean;
}

interface A {
  f(x:any): void;
}

// 等同于
interface A {
  f(x:'foo'): boolean;
  f(x:any): void;
}
```

> f()方法有一个类型声明的参数x是字面量类型，这个类型声明的优先级最高，会排在函数重载的最前面

如果两个 interface 组成的联合类型存在同名属性，那么该属性的类型也是联合类型。

```typescript
interface Circle {
  area: bigint;
}

interface Rectangle {
  area: number;
}

declare const s: Circle | Rectangle;

s.area;   // bigint | number
```

## interface和type对比

interface命令与type命令作用类似，都可以表示对象类型。<br>很多对象类型既可以用 interface 表示，也可以用 type 表示。而且，两者往往可以换用，几乎所有的 interface 命令都可以改写为 type 命令。

class命令也有类似作用，通过定义一个类，同时定义一个对象类型。但是，它会创造一个值，编译后依然存在。如果只是单纯想要一个类型，应该使用type或interface。

interface 与 type 的区别有下面几点。

- type能够表示非对象类型，而interface只能表示对象类型（包括数组、函数等）。
- interface可以继承其他类型，type不支持继承。继承的主要作用是添加属性，type定义的对象类型如果想要添加属性，只能使用&运算符，重新定义一个类型。

```typescript
type Animal = {
  name: string
}

type Bear = Animal & {
  honey: boolean
}
```

作为比较，interface添加属性，采用的是继承的写法。

```typescript
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}
```

继承时，type 和 interface 是可以换用的。interface 可以继承 type。

```typescript
type Foo = { x: number; };

interface Bar extends Foo {
  y: number;
}
```

type 也可以继承 interface。

```typescript
interface Foo {
  x: number;
}

type Bar = Foo & { y: number; };
```

- 同名interface会自动合并，同名type则会报错。也就是说，TypeScript 不允许使用type多次定义同一个类型。

```typescript
type A = { foo:number }; // 报错
type A = { bar:number }; // 报错
```

作为比较，interface则会自动合并

```typescript
interface A { foo:number };
interface A { bar:number };

const obj:A = {
  foo: 1,
  bar: 1
};
```

> interface 是开放的，可以添加属性，type 是封闭的，不能添加属性，只能定义新的 type。

- interface不能包含属性映射（mapping），type可以

```typescript
interface Point {
  x: number;
  y: number;
}

// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};
```

- this关键字只能用于interface。

```typescript
// 正确
interface Foo {
  add(num:number): this;
};

// 报错
type Foo = {
  add(num:number): this;
};
```

- type 可以扩展原始数据类型，interface 不行。

```typescript
// 正确
type MyStr = string & {
  type: 'new'
};

// 报错
interface MyStr extends string {
  type: 'new'
}
// type 可以扩展原始数据类型 string，interface 就不行
```

- interface无法表达某些复杂类型（比如交叉类型和联合类型），但是type可以

```typescript
type A = { /* ... */ };
type B = { /* ... */ };

type AorB = A | B;
type AorBwithName = AorB & {
  name: string
}
```

综上所述，如果有复杂的类型运算，那么没有其他选择只能使用type；一般情况下，interface灵活性比较高，便于扩充类型或自动合并，建议优先使用
