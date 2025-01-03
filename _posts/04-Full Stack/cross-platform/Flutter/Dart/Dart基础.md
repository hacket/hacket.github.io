---
date created: 2024-12-26 00:19
date updated: 2024-12-26 00:19
dg-publish: true
---

- [x] [Dart 语言开发文档](https://dart.cn/guides)

# Dart一些概念

- **所有变量皆对象**：所有变量引用的都是 对象，每个对象都是一个 类 的实例。数字、函数以及 null 都是对象。除去 null 以外（如果你开启了 [空安全](https://dart.cn/null-safety)）, 所有的类都继承于 [Object](https://api.dart.cn/stable/dart-core/Object-class.html) 类。
- **类型可推断**：尽管 Dart 是强类型语言，但是在声明变量时指定类型是可选的，因为 Dart 可以进行类型推断。可以用var、dynamic和Object来声明变量
- **空安全**：从dartv2.12，如果你开启了 [空安全](https://dart.cn/null-safety)，变量在未声明为可空类型时不能为 null；通过在类型后加上问号 (`?`) 将类型声明为可空；加`!`来断言表达式不为空（为空时将抛出异常）(基本同kotlin)
- **动态类型**：如果你想要显式地声明允许任意类型，使用 Object?（如果你 [开启了空安全](https://dart.cn/null-safety#enable-null-safety)）、 Object 或者 [特殊类型dynamic](https://dart.cn/guides/language/effective-dart/design#avoid-using-dynamic-unless-you-want-to-disable-static-checking) 将检查延迟到运行时进行。
- **Dart 支持泛型**，比如 `List<int>`（表示一组由 int 对象组成的列表）或 `List<Object>`（表示一组由任何类型对象组成的列表）。
- **Dart 支持顶级函数**（例如 main 方法），同时还支持定义属于类或对象的函数（即 静态 和 实例方法）。你还可以在函数中定义函数（嵌套 或 局部函数）。
- **Dart 支持顶级变量**，以及定义属于类或对象的变量（静态和实例变量）。实例变量有时称之为域或属性。
- **Dart没有访问限制符**，Dart 没有类似于 Java 那样的 public、protected 和 private 成员访问限定符。如果一个标识符以下划线 `_`开头则表示该标识符在库内是私有的。可以查阅 [库和可见性](https://dart.cn/guides/language/language-tour#libraries-and-visibility) 获取更多相关信息。
- **标识符** 可以以字母或者下划线`_`开头，其后可跟字符和数字的组合。
- Dart 中 表达式 和 语句 是有区别的，表达式有值而语句没有；一个语句通常包含一个或多个表达式，但是一个表达式不能只包含一个语句。

> 比如[条件表达式](https://dart.cn/guides/language/language-tour#conditional-expressions) expression condition ? expr1 : expr2 中含有值 expr1 或 expr2。与 [if-else 分支语句](https://dart.cn/guides/language/language-tour#if-and-else)相比，if-else 分支语句则没有值。

- Dart 工具可以显示 **警告** 和 **错误** 两种类型的问题。警告表明代码可能有问题但不会阻止其运行。错误分为编译时错误和运行时错误；编译时错误代码无法运行；运行时错误会在代码运行时导致 [异常](https://dart.cn/guides/language/language-tour#exceptions)。

# Dart类型变量

## 变量的声明

1. var
2. dynamic
3. Object

**案例：**

- 声明一个未初始化的变量，变量的类型可以更改

```dart
void variable_declaration() {
  // ----------------------- 变量的声明-----------------
  // 声明一个未初始化的变量，变量的类型可改变
  var data;
  data = "HelloWorld";

  dynamic data1;
  data1 = "HelloWorld1";
  data1 = 123;

  Object data2;
  data2 = 'HelloWorld2';
  data2 = 123;
  print([data, data1, data2]); // [HelloWorld, 123, 123]
}

```

- 声明一个初始化的变量，变量类型不能再更改

```dart
var variablel = 'HelloWorld'; // 变量是一个引用，名字为 variablel 的变量引用了一个内容为‘HelloWorld’的 String 对象。
// variablel = 123; // 报错：A value of type 'int' can't be assigned to a variable of type 'String'
```

- dynamic 和 Object 声明的变量初始化后，变量的类型仍可改变

```dart
dynamic variable2 = "HelloWorld";
variable2 = 123;
//  variable2.test();//调用不存在的test()方法，编译通过，运行报异常。编译阶段不检查类型

Object variable3 = 'HelloWorld';
variable3 = 123;
//  variable3.test();//调用不存在的test()方法，编译不通过。编译阶段检查类型

```

- 使用确定类型显示声明变量，变量的类型不能再改变

```dart
String name3 = "HelloWorld";
//  name3 = 123; // 变量的类型不能更改
```

**变量声明总结：**

1. `var`：如果没有初始值，可以变成任何类型；var 如果有初始值，类型被是锁定
2. `dynamic`：动态任意类型，编译阶段不检查类型
3. `Object`：动态任意类型，编译阶段检查类型

## 默认值

在 Dart 中，未初始化以及可空类型的变量拥有一个默认的初始值 null。（如果你未迁移至 [空安全](https://dart.cn/null-safety)，所有变量都为可空类型。）即便数字也是如此，因为在 Dart 中一切皆为对象，数字也不例外。

> 一切皆对象，对象的默认值是null

```dart
int? lineCount;
assert(lineCount == null);

// 启用了空安全，你必须在使用变量前初始化它的值
int lineCount = 0;

// 也可以延迟初始化
int lineCount;

if (weLikeToCount) {
  lineCount = countLines();
} else {
  lineCount = 0;
}

print(lineCount);
```

## late 延迟初始化变量

Dart 2.12 新增了 `late` 修饰符，这个修饰符可以在以下情况中使用：

- 声明一个非空变量，但不在声明时初始化。
- 延迟初始化一个变量。

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

若 late 标记的变量在使用前没有初始化，在变量被使用时会抛出运行时异常。<br />如果一个 late 修饰的变量在声明时就指定了初始化方法，那么它实际的初始化过程会发生在第一次被使用的时候（类似kotlin中的lazy）。这样的延迟初始化在以下场景中会带来便利：

- Dart 认为这个变量可能在后文中没被使用，而且初始化时将产生较大的代价。
- 你正在初始化一个实例变量，它的初始化方法需要调用 this。

```dart
// This is the program's only call to readThermometer().
late String temperature = readThermometer(); // Lazily initialized.
// 如果 temperature 变量从未被使用的话，那么 readThermometer() 将永远不会被调用：
```

## final 和 const

1. 一个final变量只可以被赋值一次
2. 一个const变量是一个**编译时常量**（const变量同时也是final的）；如果使用 const 修饰类中的变量，则必须加上 static 关键字，即`static const`（注：顺序不能颠倒）。在声明 const 变量时可以直接为其赋值，也可以使用其它的 const 变量为其赋值：
3. [实例变量](https://dart.cn/guides/language/language-tour#instance-variables) 可以是 final 的但不可以是 const
4. const 关键字不仅仅可以用来定义常量，还可以用来创建 常量值，该常量值可以赋予给任何变量。你也可以将构造函数声明为 const 的，这种类型的构造函数创建的对象是不可改变的。

- 被 `final` 或者 `const` 修饰的变量，变量类型可以省略

```dart
final FVariablel = "HelloWorld";
//  final  String FVariablel = "HelloWorld";

const cVariablel = "HelloWorld";
//  const String cVariablel = "HelloWorld";
```

- 被 final 或 const 修饰的变量无法再去修改其值

```dart
// fVariable1 = '123';
// cVariable1 = '123456';
```

- const 可以使用其他 const 常量的值来初始化其值

```dart
const width = 100;
const height = 100;
const square = width * height;
```

- const 赋值申明可省略

```dart
const List clist = [1, 2, 3];
//  const List clist = const [1, 2, 3];//dart 2之前，const赋值必须用const声明
print("\n\n\n");
print(clist);
```

- 可以更改非 final,非 const 变量的值，即使它曾经具有 const 值

```dart
var varList = const [1, 2, 3];
final finalList = const [1, 2, 3];
const constList = [1, 2, 3];
print([varList, finalList, constList]); // [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
varList = [1];
constList[1];
finalList[1];
print("\n");
print([varList, finalList, constList]); // [[1], [1, 2, 3], [1, 2, 3]]
```

- 使用关键字 const 修饰变量表示该变量为 编译时常量。如果使用 const 修饰类中的变量，则必须加上 static 关键字，即 `static const`（注：顺序不能颠倒）。在声明 const 变量时可以直接为其赋值，也可以使用其它的 const 变量为其赋值：

```dart
class Foo {
  // const name2 = "foo2"; // 编译错误：Only static fields can be declared as const.
  static const name3 = "foo3";
}
const bar0 = 1000000; // Unit of pressure (dynes/cm2)
const double atm = 1.01325 * bar0; // Standard atmosphere
```

- const 导致的不可变性是可传递的

```dart

final List ls = [1, 2, 3];
ls[2] = 444;
print(ls);
const List cLs = [4, 5, 6];
// cLs[1] = 4; Unhandled exception: Unsupported operation: Cannot modify an unmodifiable list
print("\n");
print(ls);
```

- 相同的 const 常量不会在内存中重复创建

```dart
final finalList1 = [1, 2, 3];
final finalList2 = [4, 5, 6];
print(identical(finalList1, finalList2)); // false identical用于检查两个引用是否指向同一个对象

const constList1 = [1, 2];
const constList2 = [1, 2];
print(identical(constList1, constList2)); // true identical用于检查两个引用是否指向同一个对象
```

- const 需要是编译时常量

```dart
final DateTime finalDateTime = DateTime.now();
// const DateTime constDateTime = DateTime.now();// 报错：Const variables must be initialized with a constant value DateTime.now() 是运行期计算出来的值
const sum = 1 + 2; //使用内置数据类型的字面量通过基本运算得到的值
const aConstNum = 0;
const aConstBool = true;
const aConstString = 'a constant string';
const aConstNull = null;
const validConstString =
    '$aConstNum, $aConstBool, $aConstString, $aConstNull';
print(validConstString); //使用计算结果为null或数字，字符串或布尔值的编译时常量的插值表达式
```

**final 和 const 总结**

1. 声明的类型可省略
2. 初始化后不能再赋值
3. 不能和var同时使用

## dart类型检查和强制类型转换

### is 类型检查

### as 强制类型转换

### 集合中的if

### 展开运算符`... 和 ...?`

```dart
const Object i = 3; // Where i is a const Object with an int value...
const list = [i as int]; // Use a typecast.
const map = {if (i is int) i: 'int'}; // Use is and collection if.
const set = {if (list is List<int>) ...list}; // ...and a spread.
```

## [dart内置类型](https://dart.cn/guides/language/language-tour#built-in-types)

Dart 语言支持下列内容：

- [Numbers](https://dart.cn/guides/language/language-tour#numbers) (int, double)
- [Strings](https://dart.cn/guides/language/language-tour#strings) (String)
- [Booleans](https://dart.cn/guides/language/language-tour#booleans) (bool)
- [Lists](https://dart.cn/guides/language/language-tour#lists) (也被称为 arrays)
- [Sets](https://dart.cn/guides/language/language-tour#sets) (Set)
- [Maps](https://dart.cn/guides/language/language-tour#maps) (Map)
- [Runes](https://dart.cn/guides/language/language-tour#characters) (常用于在 Characters API 中进行字符替换)
- [Symbols](https://dart.cn/guides/language/language-tour#symbols) (Symbol)
- The value null (Null)

### Number 数值(int,double)

Dart支持两种Number类型：

1. **int** 整数值；长度不超过 64 位，具体取值范围 [依赖于不同的平台](https://dart.cn/guides/language/numbers)。在 DartVM 上其取值位于 -263 至 263 - 1 之间。在 Web 上，整型数值代表着 JavaScript 的数字（64 位无小数浮点型），其允许的取值范围在 -253 至 253 - 1 之间。
2. **double **64 位的双精度浮点数字，且符合 IEEE 754 标准。

```dart
void internal_type_declaration() {
  int i = 1; //整数型
  double d = 1.0; //double b4-bit(双精度)浮点数
  int bitLength = i.bitLength;
  print('bitLength:${bitLength}'); //bitLength 判断 int 值需要多少位 bit 位。
  double maxFinite = double.maxFinite;
  print('maxFinite: ${maxFinite}'); //maxFinitedouble的最大值
//int和double都是num的子类
  num n1 = 1;
  num n2 = 1.0;
//支持 十进制、十六进制
  int il = 0xfff;

//科学计数法
  double dl = 1.2e2; //120.0
//转换
//String > int
  int i2 = int.parse('1');
  double d2 = 1; //当 double 的值为 int 值时，int 自动转为 double
  print('d2：${d2}');

  int? i3 = int.tryParse('1.0');

//int > String
  int i4 = 123;
  String s = i4.toString();
}
```

输出：

```dart
Hello dart.
bitLength:1
maxFinite: 1.7976931348623157e+308
d2：1.0
```

### String 字符串

1. Dart 字符串是 UTF-16 编码的字符序列，可以使用单引号或者双引号来创建字符串
2. 字符串可用单引号`' '`，双引号`" "`和三引号`''' '''`
3. `r`前缀可以创建一个 `r"原始 raw"` 字符串，如\n不会被转义
4. `..`级联符实现链式

```dart
var s1 = '使用单引号创建字符串字面量。';
var s2 = "双引号也可以用于创建字符串字面量。";
var s3 = '使用单引号创建字符串时可以使用斜杠来转义那些与单引号冲突的字符串：\'。';
var s4 = "而在双引号中则不需要使用转义与单引号冲突的字符串：'";
```

使用 `+` 运算符或并列放置多个字符串来连接字符串

```dart
var s1 = '可以拼接'
    '字符串'
    "即便它们不在同一行。";
assert(s1 == '可以拼接字符串即便它们不在同一行。');

var s2 = '使用加号 + 运算符' + '也可以达到相同的效果。';
assert(s2 == '使用加号 + 运算符也可以达到相同的效果。');
```

使用`三个单引号`或者`三个双引号`也能创建多行字符串：

```dart
var s1 = '''
你可以像这样创建多行字符串。
''';

var s2 = """这也是一个多行字符串。""";
```

在字符串前加上 ` r  `作为前缀创建 “raw” 字符串（即不会被做任何处理（比如转义）的字符串）：

```dart
var s = r'在 raw 字符串中，转义字符串 \n 会直接输出 “\n” 而不是转义为换行。';
```

### Booleans 布尔值 (bool)

Dart 使用 bool 关键字表示布尔类型，布尔类型只有两个对象 true 和 false，两者都是编译时常量。

```dart
//bool :true 和 false
bool isNull;
print('isNull: ${isNull}');
```

### 集合

#### List 列表(数组 List)

Dart 中的列表字面量是由逗号分隔的一串表达式或值并以方括号`[]`包裹而组成的。

```dart
var list = [1, 2, 3];
// 这里 Dart 推断出 list 的类型为 List<int>，如果往该数组中添加一个非 int 类型的对象则会报错。
```

你可以在 Dart 的集合类型的最后一个项目后添加逗号。这个尾随逗号并不会影响集合，但它能有效避免「复制粘贴」的错误。

```dart
var list = [
  'Car',
  'Boat',
  'Plane',
];
```

在 List 字面量前添加 `const` 关键字会创建一个编译时常量：

```dart
var constantList = const [1, 2, 3];
// constantList[1] = 1; // This line will cause an error.
```

#### Set 集合 (Set)

#### Maps 键值对集合 (Map)

## Dart类型系统

Dart 是类型安全的编程语言：Dart 使用静态类型检查和 [运行时检查](https://dart.cn/guides/language/type-system#runtime-checks) 的组合来确保变量的值始终与变量的静态类型或其他安全类型相匹配。尽管类型是必需的，但由于 [类型推断](https://dart.cn/guides/language/type-system#type-inference)，类型的注释是可选的。

# Dart空安全

Dart 语言包含了健全的空安全特性。<br />和Kotlin类似

# Dart函数

## 函数定义

### 函数内定义函数

```dart
void main() {
    int add(int x,int y) {
        return x + y;
    }
    print(add(1,2));
}
```

### 定义函数时可省略类型

```dart
void main2() {
  add(x, y) {
    //不建议省略
    return x + y;
  }
  print(add(3, 4));
}
```

### 支持缩写语法 `=>`

语法 `=> _表达式_` 是`  { return _表达式_; } ` 的简写， `=>` 有时也称之为 **箭头** 函数。

```dart
void main3() {
  int add2(int x, int y) => x + y;
  /// 等同于
  int add3(int x, int y) {
    return x + y;
  }
  print(add2(3, 4));
  print(add3(3, 4));
}
```

## 函数参数

函数可以有两种形式的参数：**必要参数** 和 **可选参数**。必要参数定义在参数列表前面，可选参数则定义在必要参数后面。可选参数可以是 **命名的** 或 **位置的**。<br />向函数传入参数或者定义函数参数时，可以使用 [尾逗号](https://dart.cn/guides/language/language-tour#trailing-comma)

### 可选命名参数

- 命名参数默认为可选参数，除非他们被特别标记为`required`；声明为required的参数可以传null；required修饰的参数不能有默认值

```dart
const Scrollbar({super.key, required Widget child});
```

- 定义函数时，使用 `{参数1, 参数2, …}` 来指定命名参数：如果你没有提供一个默认值，也没有使用 `required` 标记的话，那么它一定可空的类型，因为他们的默认值会是 null：

```dart
void enableFlags({bool? bold, bool? hidden}) {...}
```

- 当调用函数时，你可以使用 `参数名: 参数值` 指定一个命名参数的值

```dart
enableFlags(bold: true, hidden: false);
```

- 用`=`来为一个命名参数指定除了`null`以外的默认值。指定的默认值必须要为编译时的常量

```dart
/// Sets the [bold] and [hidden] flags ...
void enableFlags({bool bold = false, bool hidden = false}) {...}

// bold will be true; hidden will be false.
enableFlags(bold: true);
```

- 尽管将位置参数放在最前面通常比较合理，但你也可以将命名参数放在参数列表的任意位置，让整个调用的方式看起来更适合你的 API：

```dart
repeat(times: 2, () {
	// ...
});
```

- dart可选参数示例

```dart
void main() {
  // 普通调用
  enableFlags(true, false);

  // required 修饰的参数必须传值
  // enableFlags1(hidden:true); // 编译不过 The named parameter 'bold' is required

  // 当调用函数时，你可以使用 参数名: 参数值 指定一个命名参数的值
  enableFlags1(bold: true, hidden: false);
  enableFlags1(hidden: true, bold: false);

  enableFlags2(hidden: true);

  // 编译不过
  // enableFlags1({bold: true, hidden: false}); // Too many positional arguments: 0 allowed, but 1 found. Try removing the extra positional arguments.
}

// 普通函数
void enableFlags(bool bold, bool hidden) {
  print('enableFlags bold:${bold},hidden:${hidden}');
}

// 可选参数-命名参数
void enableFlags1({required bool? bold, bool? hidden}) {
  print('enableFlags1 bold:${bold},hidden:${hidden}');
}

// 可选参数-默认参数
void enableFlags2({bool? bold = true, bool? hidden = false}) {
  print('enableFlags1 bold:${bold},hidden:${hidden}');
}
```

### 可选的位置参数

使用 `[]` 将一系列参数包裹起来，即可将其标记为位置参数，因为它们的默认值是 null，所以如果你没有提供默认值的话，它们的类型必须得是允许为空 (nullable) 的类型

```dart
void main() {
  final s = say('hacket', 'hello', 'iphone', 21);
  print('s:${s}');
}

String say(String from, String msg,
    [String? device, int? age = 21, String? hobby = 'coding']) {
  var result = '$from says $msg ,age=$age, hobby=$hobby';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```

## 函数是一级对象

- 可以将函数作为参数传递给另一个函数

```dart
void printElement(int element) {
  print(element);
}

var list = [1, 2, 3];

// Pass printElement as a parameter.
list.forEach(printElement);
```

## 匿名函数

创建一个没有名字的方法，称之为 **匿名函数**、 **Lambda 表达式** 或 **Closure 闭包**。你可以将匿名方法赋值给一个变量然后使用它，比如将该变量添加到集合或从中删除。<br />匿名方法看起来与命名方法类似，在括号之间可以定义参数，参数之间用逗号分割，后面大括号中的内容则为函数体：<br />([[类型] 参数[, …]]) {<br />  函数体;<br />};

```dart
const list = ['apples', 'bananas', 'oranges'];
list.map((item) {
  return item.toUpperCase();
}).forEach((item) {
  print('$item: ${item.length}');
});
```

## 返回值

所有的函数都有返回值。没有显式返回语句的函数最后一行默认为执行 `return null;`。

# 流程控制语句

你可以使用下面的语句来控制 Dart 代码的执行流程：

- if 和 else
- for 循环
- while 和 do-while 循环
- break 和 continue
- switch 和 case
- assert

## 流程控制 if else

- if else，和Java一样

```dart
if (条件语句) {
    内容体
} else {
    内容体
}
```

## 循环语句

### 1、 简单for循环

```
for(初始值;判断条件;循环后的语句){
    内容体
}
```

案例：

```dart
for(int i=0;i<10;i++){
	print(i);
}
```

### 2、使用forEach循环，一般List和Set都可以使用forEach遍历元素。

```dart
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
numbers.forEach((number) => print(number));
```

### 3、使用for in循环，一般List和Set使用for-in遍历元素。

```dart
var list = [1,2,3];
for(var data in list){
    print(data);
}
```

### 4、for循环里面使用标记`:`和Java中Label类似；类似goto

Dart的标记`:`。标记是后面跟着冒号的标识符。带标记的陈述是以标记 L为前缀的陈述。带标签的case子句是标签L前缀的switch语句中的case子句。标签的唯一作用是为“break”和“continue”声明提供对象。

- **continue**

```dart
// 返回具有最小总和的内部列表（正整数）。
/// Returns the inner list (of positive integers) with the smallest sum.
List<int> smallestSumList(List<List<int>> lists) {
  var smallestSum = 0xFFFFFFFF; //已知list的总和较小。
  var smallestList = null;
  outer: // 这就是标记
  for (var innerList in lists) {
    var sum = 0;
    for (var element in innerList) {
      assert(element >= 0);
      sum += element;
      // 无需继续迭代内部列表。它的总和已经太高了。
      if (sum > smallestSum) continue outer; // continue 跳出到标记处(outer)
    }
    smallestSum = sum;
    smallestList = innerList;
  }
  return smallestList;
}
```

- break

```dart
// 计算第一个非空list
List<int> firstListWithNullValueList(List<List<int>> lists) {
  var firstListWithNullValues = null;
  outer:
  for (var innerList in lists) {
    for (var element in innerList) {
      if (element == null) {
        firstListWithNullValues = innerList;
        break outer;  // break 返回到标记处
      }
    }
  }
  // 现在继续正常的工作流程
  if (firstListWithNullValues != null) {
    // ...
  }
  return firstListWithNullValues;
}
```

- 用标记跳出代码块

```dart
void doSomethingWithA(A a) {
  errorChecks: {
    if (a.hasEntries) {
      for (var entry in a.entries) {
        if (entry is Bad) break errorChecks;   // 跳出代码块
      }
    }
    if (a.hasB) {
      var b = new A.b();
      if (b.inSomeBadState()) break errorChecks;  // 跳出代码块
    }
    // 一些看起来都正常
    use(a);
    return;
  }
  // 错误的情况，执行这里的代码：
  print("something bad happened");
}

class A{
  bool hasEntries = false;
  bool hasB = true;
  List<Bad> entries = [new Bad2(),new Bad2()];
  A.b(){

  }

  bool inSomeBadState(){
    return false;
  }
  
}

void use(A a){}

abstract class Bad{}
class Bad1 extends Bad{}
class Bad2 extends Bad{}
```

对代码块的使用break指令，使得Dart继续执行块之后的语句。从某个角度来看，它是一个结构化的goto，它只允许跳转到当前指令之后的嵌套较少的位置。

### 5、switch中的标记(label)

标记也可以用于switch内部。switch中的标记允许continue使用其它的case子句。

```dart
void switchExample(int foo) {
  switch (foo) {
    case 0:
      print("foo is 0");
      break;
    case 1:
      print("foo is 1");
      continue shared; // continue使用在被标记为shared的子句中
    shared:
    case 2:
      print("foo is either 1 or 2");
      break;
  }
}
```

有趣的是, Dart没有要求continue的目标子句是当前case子句之后的子句。<br />带标记的任何case子句都是有效的目标。这意味着，Dart的switch语句实际上是状态机（state machines）

### 6、while 和do while（同Java）

while和do while同Java

```dart
while(判断条件){
    内容体
}

do{
    内容体
} while(判断条件);
```

### 7、break和continue（同Java）

### 8、switch case（同Java）

switch case同Java

```dart
var command = 'OPEN';
switch (command) {
  case 'CLOSED':
    executeClosed();
    break;
  case 'PENDING':
    executePending();
    break;
  case 'APPROVED':
    executeApproved();
    break;
  case 'DENIED':
    executeDenied();
    break;
  case 'OPEN':
    executeOpen();
    break;
  default:
    executeUnknown();
}
```

# [运算符](https://dart.cn/guides/language/language-tour#operators)

Dart 支持下表所示的操作符，它也体现了 Dart 运算符的关联性和 [优先级](https://dart.cn/guides/language/language-tour#operator-precedence-example) 的从高到低的顺序。这也是 Dart 运算符关系的近似值。你可以将这些运算符实现为 [一个类的成员](https://dart.cn/guides/language/language-tour#_operators)。

| Description              | Operator                                                                     | Associativity |
| ------------------------ | ---------------------------------------------------------------------------- | ------------- |
| unary postfix            | `_expr_++    _expr_--    ()    []    ?[]    .    ?.    !`                    | None          |
| unary prefix             | ` -_expr_    !_expr_    ~_expr_    ++_expr_    --_expr_      await _expr_  ` | None          |
| multiplicative           | `*    /    %  ~/`                                                            | Left          |
| additive                 | `+    -`                                                                     | Left          |
| shift                    | `<<    >>    >>>`                                                            | Left          |
| bitwise AND              | `&`                                                                          | Left          |
| bitwise XOR              | `^`                                                                          | Left          |
| bitwise OR               | `&#124;`                                                                     | Left          |
| relational and type test | `>=    >    <=    <    as    is    is!`                                      | None          |
| equality                 | `==    !=`                                                                   | None          |
| logical AND              | `&&`                                                                         | Left          |
| logical OR               | `&#124;&#124;`                                                               | Left          |
| if null                  | `??`                                                                         | Left          |
| conditional              | `_expr1_ ? _expr2_ : _expr3_`                                                | Right         |
| cascade                  | `..    ?..`                                                                  | Left          |
| assignment               | `=    *=    /=   +=   -=   &=`   ^=`   _etc._                                | Right         |

## Dart常用运算符

### `?.`

和Kotlin中的`?.`一样，左边为空右边不执行

### `..` 级联符号

级联符号`..`允许您在同一个对象上进行一系列操作。除了函数调用之外，还可以访问同一对象上的字段。其实相当于java的链式调用。

```dart
var s = new StringBuffer()
    ..write('test1 ')
    ..write('test2 ')
    ..write('test3 ')
    ..write('test4 ')
    ..write('test5');
print(s.toString());
```

### ?? 三目运算符

`??`三目运算符的一种形式<br />和Kotlin中的`?:`一样，`expr1 ?? expr2` 表示如果expr1非空返回expr1值; 否则expr1为null则返回expr2的值。

```dart
// 普通三元运算符
int a = 10;
var values = a > 5 ? a : 0;
print('value = $values');

var b = null;
b = 1;
// ??操作符
print('b ??=3 : ${b ?? 3}'); 

// 输出
// value = 10
// b ??=3 : 1
```

### ~/ 取商

`~/` 除法，返回一个整数结果，其实就是取商；取模用`%`<br />在Dart里面A ~/ B = C，这个C就是商，这个语句相当于Java里面的A / B = C。Dart与Java不同的是，Dart里面如果使用A / B = D语句，这个结果计算出来的是真实的结果。

```dart
var result1 = 15/7;
print(result1); // 结果是：2.142857...
var result2 = 15~/7;
print(result2); // 结果是：2
```

### `as`、`is`与`is!`

- as 判断属于某种类型并自动转换为该类型；和Kotlin中的as，Java中的instantOf类似，只是会进行默认的类型转换
- is 如果对象具有指定的类型，则为true
- is! 如果对象具有指定的类型，则为false

## 重写操作符

使用 `operator` 标识来进行标记。下面是重写 `+` 和 `-` 操作符的例子

```dart
class Vector {
  final int x, y;

  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);

  @override
  bool operator ==(Object other) =>
      other is Vector && x == other.x && y == other.y;

  @override
  int get hashCode => Object.hash(x, y);
}

void main() {
  final v = Vector(2, 3);
  final w = Vector(2, 2);

  assert(v + w == Vector(4, 5));
  assert(v - w == Vector(0, 1));
}
```

# [Dart异常](https://dart.cn/guides/language/language-tour#exceptions)

Dart 代码可以抛出和捕获异常。异常表示一些未知的错误情况，如果异常没有捕获则会被抛出从而导致抛出异常的代码终止执行。<br />与 Java 不同的是，Dart 的所有异常都是非必检异常，方法不必声明会抛出哪些异常，并且你也不必捕获任何异常。<br />Dart 提供了 [Exception](https://api.dart.cn/stable/dart-core/Exception-class.html) 和 [Error](https://api.dart.cn/stable/dart-core/Error-class.html) 两种类型的异常以及它们一系列的子类，你也可以定义自己的异常类型。但是在 Dart 中可以将任何非 null 对象作为异常抛出而不局限于 Exception 或 Error 类型。

## 抛出异常

1. 抛出Exception

```dart
throw FormatException('Expected at least 1 section');
```

2. 抛出任意对象(不建议)

```dart
throw 'Out of llamas!';
```

3. 因为抛出异常是一个表达式，所以可以在 => 语句中使用，也可以在其他使用表达式的地方抛出异常：

```dart
void distanceTo(Point other) => throw UnimplementedError();
```

## 捕获异常

1. 捕获异常可以避免异常继续传递（重新抛出异常除外）。捕获一个异常可以给你处理它的机会：

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  buyMoreLlamas();
}
```

2. 对于可以抛出多种异常类型的代码，也可以指定多个 catch 语句，每个语句分别对应一个异常类型，如果 catch 语句没有指定异常类型则表示可以捕获任意异常类型：

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e) {
  // No specified type, handles all
  print('Something really unknown: $e');
}
```

3. 你可以为 catch 方法指定两个参数，第一个参数为抛出的异常对象，第二个参数为栈信息 [StackTrace](https://api.dart.cn/stable/dart-core/StackTrace-class.html) 对象：

```dart
try {
  // ···
} on Exception catch (e) {
  print('Exception details:\n $e');
} catch (e, s) {
  print('Exception details:\n $e');
  print('Stack trace:\n $s');
}
```

4. 关键字 rethrow 可以将捕获的异常再次抛出：

```dart
void misbehave() {
  try {
    dynamic foo = true;
    print(foo++); // Runtime error
  } catch (e) {
    print('misbehave() partially handled ${e.runtimeType}.');
    rethrow; // Allow callers to see the exception.
  }
}

void main() {
  try {
    misbehave();
  } catch (e) {
    print('main() finished handling ${e.runtimeType}.');
  }
}
```

5. **Finally**
   - 无论是否抛出异常，finally 语句始终执行，如果没有指定 catch 语句来捕获异常，则异常会在执行完 finally 语句后抛出：

```dart
try {
  breedMoreLlamas();
} finally {
  // Always clean up, even if an exception is thrown.
  cleanLlamaStalls();
}
```

- finally 语句会在任何匹配的 catch 语句后执行：

```dart
try {
  breedMoreLlamas();
} catch (e) {
  print('Error: $e'); // Handle the exception first.
} finally {
  cleanLlamaStalls(); // Then clean up.
}
```
