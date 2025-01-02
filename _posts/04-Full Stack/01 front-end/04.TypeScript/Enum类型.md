---
date created: 2024-12-25 01:00
date updated: 2024-12-25 01:00
dg-publish: true
---

Enum 是 TypeScript 新增的一种数据结构和类型，中文译为“枚举”。

## Enum基础

```typescript
enum Color {
  Red,     // 0
  Green,   // 1
  Blue     // 2
}
```

声明了一个 Enum 结构Color，里面包含三个成员Red、Green和Blue。第一个成员的值默认为整数0，第二个为1，第三个为2，以此类推。<br>使用时，调用 Enum 的某个成员，与调用对象属性的写法一样，可以使用点运算符，也可以使用方括号运算符：

```typescript
let c = Color.Green; // 1
// 等同于
let c = Color['Green']; // 1
```

Enum 结构本身也是一种类型。比如，上例的变量c等于1，它的类型可以是 Color，也可以是number。

```typescript
let c:Color = Color.Green; // 正确
let c:number = Color.Green; // 正确
```

Enum 结构的特别之处在于，它既是一种类型，也是一个值。绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。

```typescript
// 编译前
enum Color {
  Red,     // 0
  Green,   // 1
  Blue     // 2
}

// 编译后
let Color = {
  Red: 0,
  Green: 1,
  Blue: 2
};
```

由于 TypeScript 的定位是 JavaScript 语言的类型增强，所以官方建议谨慎使用 Enum 结构，因为它不仅仅是类型，还会为编译后的代码加入一个对象。<br>Enum 结构比较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性。

TypeScript 5.0 之前，Enum 有一个 Bug，就是 Enum 类型的变量可以赋值为任何数值。TypeScript 5.0 纠正了这个问题。

```typescript
enum Bool {
  No,
  Yes
}

function foo(noYes:Bool) {
  // ...
}

foo(33);  // TypeScript 5.0 之前不报错
```

另外，由于 Enum 结构编译后是一个对象，所以不能有与它同名的变量（包括对象、函数、类等）。

```typescript
enum Color {
  Red,
  Green,
  Blue
}

const Color = 'red'; // 报错
```

很大程度上，Enum 结构可以被对象的`as const`断言替代。

```typescript
enum Foo {
  A,
  B,
  C,
}

const Bar = {
  A: 0,
  B: 1,
  C: 2,
} as const;

if (x === Foo.A) {}
// 等同于
if (x === Bar.A) {}
```

> 对象Bar使用了as const断言，作用就是使得它的属性无法修改。这样的话，Foo和Bar的行为就很类似了，前者完全可以用后者替代，而且后者还是 JavaScript 的原生数据结构。

## 同名 Enum 的合并

多个同名的 Enum 结构会自动合并。

```typescript
enum Foo {
  A,
}

enum Foo {
  B = 1,
}

enum Foo {
  C = 2,
}

// 等同于
enum Foo {
  A,
  B = 1，
  C = 2
}
```

## 字符串 Enum

Enum 成员的值除了设为数值，还可以设为字符串。也就是说，Enum 也可以用作一组相关字符串的集合。

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

注意，字符串枚举的所有成员值，都必须显式设置。如果没有设置，成员值默认为数值，且位置必须在字符串成员之前。

```typescript
enum Foo {
  A, // 0
  B = 'hello',
  C // 报错
}
```

Enum 成员可以是字符串和数值混合赋值。

```typescript
enum Enum {
  One = 'One',
  Two = 'Two',
  Three = 3,
  Four = 4,
}
```

由于这个原因，如果函数的参数类型是字符串 Enum，传参时就不能直接传入字符串，而要传入 Enum 成员。

```typescript
enum MyEnum {
  One = 'One',
  Two = 'Two',
}

function f(arg:MyEnum) {
  return 'arg is ' + arg;
}

f('One') // 报错
```

所以，字符串 Enum 作为一种类型，有限定函数参数的作用。<br>字符串 Enum 可以使用联合类型（union）代替。

```typescript
function move(
  where:'Up'|'Down'|'Left'|'Right'
) {
  // ...
 }
```

函数参数where属于联合类型，效果跟指定为字符串 Enum 是一样的。<br>注意，字符串 Enum 的成员值，不能使用表达式赋值。

```typescript
enum MyEnum {
  A = 'one',
  B = ['T', 'w', 'o'].join('') // 报错
}
```

## keyof 运算符

`keyof` 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回。

```typescript
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
```

Enum 作为类型，本质上属于number或string的一种变体，而typeof MyEnum会将MyEnum当作一个值处理，从而先其转为对象类型，就可以再用keyof运算符返回该对象的所有属性名。

如果要返回 Enum 所有的成员值，可以使用`in`运算符。

```typescript
enum MyEnum {
  A = 'a',
  B = 'b'
}

// { a: any, b: any }
type Foo = { [key in MyEnum]: any };
```

## 反向映射

数值 Enum 存在反向映射，即可以通过成员值获得成员名。

```typescript
enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

console.log(Weekdays[3]) // Wednesday
```

Enum 成员Wednesday的值等于3，从而可以从成员值3取到对应的成员名Wednesday，这就叫反向映射。<br>这是因为 TypeScript 会将上面的 Enum 结构，编译成下面的 JavaScript 代码。

```typescript
var Weekdays;
(function (Weekdays) {
    Weekdays[Weekdays["Monday"] = 1] = "Monday";
    Weekdays[Weekdays["Tuesday"] = 2] = "Tuesday";
    Weekdays[Weekdays["Wednesday"] = 3] = "Wednesday";
    Weekdays[Weekdays["Thursday"] = 4] = "Thursday";
    Weekdays[Weekdays["Friday"] = 5] = "Friday";
    Weekdays[Weekdays["Saturday"] = 6] = "Saturday";
    Weekdays[Weekdays["Sunday"] = 7] = "Sunday";
})(Weekdays || (Weekdays = {}));
```

实际进行了两组赋值

注意，这种情况只发生在数值 Enum，对于字符串 Enum，不存在反向映射。这是因为字符串 Enum 编译后只有一组赋值。

```typescript
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 编译后
var MyEnum;
(function (MyEnum) {
    MyEnum["A"] = "a";
    MyEnum["B"] = "b";
})(MyEnum || (MyEnum = {}));
```
