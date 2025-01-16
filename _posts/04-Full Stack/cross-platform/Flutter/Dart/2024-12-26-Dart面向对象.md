---
date created: 2024-12-26 00:19
date updated: 2024-12-26 00:19
dg-publish: true
tags:
  - '#33118](https://github.com/dart-lang/sdk/issues/33118)'
  - '#27776](https://github.com/dart-lang/sdk/issues/27776)'
---

# [Dart类](https://dart.cn/guides/language/language-tour#classes) class

Dart 是一门面向对象的语言。<br >Dart 语言中所有的变量引用都是一个对象，并且所有的对象都对应一个类的实例。无论是数字、函数和null ，都是一个对象，所有对象继承自Object类。在 2.12 版本 Dart 新增空安全后（sound null safety），null不再是Object的子类。

## class基础

### class成员

对象的 成员 由函数和数据（即 方法 和 实例变量）组成。方法的 调用 要通过对象来完成，这种方式可以访问对象的函数和数据。<br >使用（`.`）来访问对象的实例变量或方法：

```dart
var p = Point(2, 2);
// Get the value of y.
assert(p.y == 2);
// Invoke distanceTo() on p.
double distance = p.distanceTo(Point(4, 4));
```

使用 `?.` 代替 . 可以避免因为左边表达式为 null 而导致的问题：

```dart
// If p is non-null, set a variable equal to its y value.
var a = p?.y;
```

访问方式和kotlin一样

### 构造函数

1. 构造函数名前面的的 `new` 关键字是可选的
2. 构造函数分类
   1. 普通构造函数
   2. 命名构造函数
   3. 常量构造函数
   4. 工厂构造函数

#### 普通构造函数

- **默认构造函数**

如果你没有声明构造函数，那么 Dart 会自动生成一个无参数的构造函数并且该构造函数会调用其父类的无参数构造方法

- **普通构造函数（和Java类似）**

```dart
class Point {
  double x = 0;
  double y = 0;

  Point(double x, double y) {
    // See initializing formal parameters for a better way
    // to initialize instance variables.
    this.x = x;
    this.y = y;
  }
}
```

- x和y需要有个初始值，否则在构造器中会报：Non-nullable instance field 'color' must be initialized
- x和y不能是final

##### 构造函数不被继承

子类不会继承父类的构造函数，如果子类没有声明构造函数，那么只会有一个默认无参数的构造函数。

##### 终值初始化

如果构造函数有10个参数，用普通构造函数写10个参数就很麻烦；dart提供了语法糖：直接在构造器传递this.x和this.y，初始化了x和y

```dart
class Point {
  final double x;
  final double y;
  // Sets the x and y instance variables
  // before the constructor body runs.
  Point(this.x, this.y);
}
```

##### 调用父类非默认构造函数

如果父类没有匿名无参数构造函数，那么子类必须调用父类的其中一个构造函数，为子类的构造函数指定一个父类的构造函数只需在构造函数体前使用（`:`）指定。

```dart
class Person {
  String firstName = "";
  Person.fromJson(Map data) {
    print('in Person');
  }
}
class Employee extends Person {
  // Person does not have a default constructor;
  // you must call super.fromJson(data).
  Employee.fromJson(Map data) : super.fromJson(data) { // 方式1
    print('in Employee');
  }
  Employee.fromJson2(super.data) : super.fromJson() { // 方式2
    print('in Employee');
  }
}

void main() {
  var employee = Employee.fromJson({});
  print(employee);
  // Prints:
  // in Person
  // in Employee
  // Instance of 'Employee'
}

```

> **注意：**传递给父类构造函数的参数不能使用 this 关键字，因为在参数传递的这一步骤，子类构造函数尚未执行，子类的实例对象也就还未初始化，因此所有的实例成员都不能被访问，但是类成员可以。

#### 命名式构造函数

其实类似Java的静态方法

```dart
const double xOrigin = 1;
const double yOrigin = 2;
class MyPoint1 {
  final double x;
  final double y;
  MyPoint1(this.x, this.y);
  // Named constructor
  MyPoint1.origin(xx, yy)
      : x = xOrigin + xx,
        y = yOrigin + yy;
}
```

命名构造函数不可继承；如果子类想要有 和父类一样的命名构造函数，那就写个同名的（通常也会在子类的命名构造函数里，调用父类的同名命名构造函数）

#### dart构造函数注意点

##### 超类参数

为了不重复地将参数传递到超类构造的指定参数，你可以使用超类参数，直接在子类的构造中使用超类构造的某个参数。超类参数不能和重定向的参数一起使用。超类参数的表达式和写法与 [终值初始化](https://dart.cn/guides/language/language-tour#initializing-formal-parameters) 类似：

```dart
class Vector2d {
  final double x;
  final double y;

  Vector2d(this.x, this.y);
}

class Vector3d extends Vector2d {
  final double z;

  // Forward the x and y parameters to the default super constructor like:
  // Vector3d(final double x, final double y, this.z) : super(x, y);
  Vector3d(super.x, super.y, this.z);
}
```

##### 初始化列表

初始化列表就是构造函数名的冒号后面，打括号前面的部分<br >除了调用父类构造函数之外，还可以在构造函数体执行之前初始化实例变量。每个实例变量之间使用逗号分隔。

```dart
class Point3 {
  final double x;
  final double y;

// Initializer list sets instance variables before
// the constructor body runs.
  Point3.fromJson(Map<String, double> json)
      : x = json['x']!,
        y = json['y']! {
    print('In Point.fromJson(): ($x, $y)');
  }
}
var p2 = Point3.fromJson({'x': 1, 'y': 2});
```

> **注意：**初始化列表表达式 = 右边的语句不能使用 this 关键字，当前类的构造函数还没调用

初始化顺序：

1. 初始化列表
2. 父类的无参数构造函数
3. 当前类的构造函数

##### 重定向构造函数（调用其他构造函数）

有时候类中的构造函数仅用于调用类中其它的构造函数，此时该构造函数没有函数体，只需在函数签名后使用（`:`）指定需要重定向到的其它构造函数 (使用 `this` 而非类名)：

```dart
class Point {
  double x, y;

  // The main constructor for this class.
  Point(this.x, this.y);

  // Delegates to the main constructor.
  Point.alongXAxis(double x) : this(x, 0);
}
```

#### 常量构造函数

应用场景：创建的对象永远不会改变<br >如果类生成的对象都是不变的，可以在生成这些对象时就将其变为编译时常量。你可以在类的构造函数前加上 `const` 关键字并确保所有实例变量均为 `final` 来实现该功能。

1. 使用常量构造函数，在构造函数名之前加 `const` 关键字，来创建编译时常量时

```dart
// 1、在构造函数声明为const构造函数
class ImmutablePoint {
  static const ImmutablePoint origin = ImmutablePoint(0, 0);

  final double x, y;

  const ImmutablePoint(this.x, this.y);
}

// 2、使用时使用const；两种方式都可以
var p = const ImmutablePoint(2, 2);
```

2. 两个使用相同构造函数相同参数值构造的编译时常量是同一个对象：

```dart
void main() {
// 两个常量构造的对象是同一个对象
  var a = Point0(1, 1);
  var b = Point0(1, 1);
  print('a:${a.hashCode},b:${b.hashCode}'); // a:722621523,b:715903274
  
  var a1 = const Point(1, 1);
  var b1 = const Point(1, 1);
  var c1 = const Point(1, 1);
  print('a1:${a1.hashCode},b1:${b1.hashCode},c1:${c1.hashCode}'); // a1:299543721,b1:299543721,c1:299543721
  assert(identical(a1, b1)); // They are the same instance!
}
// 自定义的Point0
class Point0<T extends num> {
  final T x;
  final T y;
  Point0(T x, T y)
      : this.x = x,
        this.y = y;
}
// 系统的Point的构造函数是const
class Point<T extends num> {
  final T x;
  final T y;
  /// Creates a point with the provided [x] and [y] coordinates.
  const Point(T x, T y)
      : this.x = x,
        this.y = y;
}
```

3. 在 常量上下文 场景中，你可以省略掉构造函数或字面量前的 const 关键字。例如下面的例子中我们创建了一个常量 Map：

```dart
// Lots of const keywords here.
const pointAndLine = const {
  'point': const [const ImmutablePoint(0, 0)],
  'line': const [const ImmutablePoint(1, 10), const ImmutablePoint(-2, 11)],
};
// 根据上下文，你可以只保留第一个 const 关键字，其余的全部省略：
// Only one const, which establishes the constant context.
const pointAndLine = {
  'point': [ImmutablePoint(0, 0)],
  'line': [ImmutablePoint(1, 10), ImmutablePoint(-2, 11)],
};
```

#### 工厂构造函数

使默认情况下，dart类中的构造函数返回的是该类的新实例，但是我们在实际的应用中可能会对返回的对象做些选择，比如从缓存中返回已经存在的对象，或者返回该类具体的实现子类。

```dart
class Student {
  final String name;

  static final Map<String, Student> _studentMap =
  <String, Student>{};

  factory Student(String name) {
    return _studentMap.putIfAbsent(
        name, () => Student._newStudent(name));
  }

  factory Student.fromJson(Map<String, Object> json) {
    return Student(json['name'].toString());
  }

  Student._newStudent(this.name);
}
```

- 在工厂构造函数中无法访问 this
- 工厂构造函数的调用方式与其他构造函数一样

#### 多个构造函数

- dart中只能有一个未命名的构造函数，对应命名函数来说，名字不能够重复，否则会报The unnamed constructor is already defined异常。

```dart
class Player {
  // Non-nullable instance field 'color' must be initialized
  // int color;
  // String name;
  int _color = 0;
  String _name = "";

  Player(String name, int color) {
    this._color = color;
    this._name = name;
  }

  Player(Player another) { // 报错：The unnamed constructor is already defined.
    this._color = another.getColor();
    this._name = another.getName();
  }
}
```

- dart只能有一个unnamed的构造函数，但可以有多个named构造函数

```dart
class Player {
  // Non-nullable instance field 'color' must be initialized
  // int color;
  // String name;
  int _color = 0;
  String _name = "";

  Player(String name, int color) {
    this._color = color;
    this._name = name;
  }
  Player.fromPlayer(Player another) {
    this._color = another._color;
    this._name = another._name;
  }
}
// 或者
class Player {
  final String name;
  final String color;

  Player(this.name, this.color);

  Player.fromPlayer(Player another)
      : color = another.color,
        name = another.name;
}
```

### 获取对象的类型

可以使用 Object 对象的 runtimeType 属性在运行时获取一个对象的类型，该对象类型是 Type 的实例。

```dart
print('The type of a is ${a.runtimeType}');
```

### 实例变量

1. 所有未初始化的实例变量其值均为 `null`
2. 所有实例变量均会隐式地声明一个 Getter 方法；`非终值`的实例变量和 `late final` 声明但未声明初始化的实例变量还会隐式地声明一个 Setter 方法
3. final修饰的变量只能被初始化一次
4. 初始化final和late final的变量用构造方法或初始化块

### 方法

方法是为对象提供行为的函数。

#### 实例方法

1. 和Java类似
2. 可以访问this

#### Getter 和 Setter

1. 实例对象的每一个属性都有一个隐式的 Getter 方法
2. 非 final 属性的话还会有一个 Setter 方法
3. 可以使用 `get` 和 `set` 关键字为额外的属性添加 Getter 和 Setter 方法

```dart
class Rectangle {
  double left, top, width, height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  double get right => left + width;
  set right(double value) => left = value - width;
  double get bottom => top + height;
  set bottom(double value) => top = value - height;
}

void main() {
  var rect = Rectangle(3, 4, 20, 15);
  assert(rect.left == 3);
  rect.right = 12;
  assert(rect.left == -8);
}
```

#### 抽象方法（同Java）

实例方法、Getter 方法以及 Setter 方法都可以是抽象的，定义一个接口方法而不去做具体的实现让实现它的类去实现该方法，抽象方法只能存在于 [抽象类](https://dart.cn/guides/language/language-tour#abstract-classes)中。<br >直接使用分号（`;`）替代方法体即可声明一个抽象方法：

```dart
abstract class Doer {
  // Define instance variables and methods...
  void doSomething(); // Define an abstract method.
}

class EffectiveDoer extends Doer {
  void doSomething() {
    // Provide an implementation, so the method is not abstract here...
  }
}
```

### 类别名 Typedefs

```dart
typedef IntList = List<int>;
IntList il = [1, 2, 3];
```

类型别名可以有类型参数：

```dart
typedef ListMapper<X> = Map<X, List<X>>;
Map<String, List<String>> m1 = {}; // Verbose.
ListMapper<String> m2 = {}; // Same thing but shorter and clearer.
```

针对函数，在大多数情况下，我们推荐使用 [内联函数类型](https://dart.cn/guides/language/effective-dart/design#prefer-inline-function-types-over-typedefs) 替代 typedefs。然而，函数的 typedefs 仍然是有用的：

```dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```

## [抽象类](https://dart.cn/guides/language/language-tour#abstract-classes)

使用关键字 `abstract` 标识类可以让该类成为 抽象类，抽象类将无法被实例化。抽象类常用于声明接口方法、有时也会有具体的方法实现。如果想让抽象类同时可被实例化，可以为其定义 [工厂构造函数](https://dart.cn/guides/language/language-tour#factory-constructors)。

```dart
// This class is declared abstract and thus
// can't be instantiated.
abstract class AbstractContainer {
  // Define constructors, fields, methods...

  void updateChildren(); // Abstract method.
}
```

## 隐式接口

1. 一个类默认也是一个接口，可以被实现
2. 一个类可以通过关键字 `implements` 来实现一个或多个接口并实现每个接口定义的 API
3. 如果需要实现多个类接口，可以使用逗号分隔每个接口类

```dart
// A person. The implicit interface contains greet().
class Person {
  // In the interface, but visible only in this library.
  final String _name;

  // Not in the interface, since this is a constructor.
  Person(this._name);

  // In the interface.
  String greet(String who) => 'Hello, $who. I am $_name.';
}

// An implementation of the Person interface.
class Impostor implements Person {
  String get _name => '';

  String greet(String who) => 'Hi $who. Do you know who I am?';
}

String greetBob(Person person) => person.greet('Bob');

void main() {
  print(greetBob(Person('Kathy')));
  print(greetBob(Impostor()));
}
```

## 扩展一个类

使用 `extends` 关键字来创建一个子类，并可使用 `super` 关键字引用一个父类：

```dart
class Television {
  void turnOn() {
    _illuminateDisplay();
    _activateIrSensor();
  }
  // ···
}

class SmartTelevision extends Television {
  void turnOn() {
    super.turnOn();
    _bootNetworkInterface();
    _initializeMemory();
    _upgradeApps();
  }
  // ···
}
```

### 重写==

如果重写 `==` 操作符，必须同时重写对象 `hashCode` 的 Getter 方法。你可以查阅 [实现映射键](https://dart.cn/guides/libraries/library-tour#implementing-map-keys) 获取更多关于重写的 == 和 hashCode 的例子。

### 重写类成员（同Java）

子类可以重写父类的实例方法（包括 [操作符](https://dart.cn/guides/language/language-tour#_operators)）、 Getter 以及 Setter 方法。你可以使用 `@override` 注解来表示你重写了一个成员：

```dart
class Television {
  // ···
  set contrast(int value) {...}
}

class SmartTelevision extends Television {
  @override
  set contrast(num value) {...}
  // ···
}
```

### noSuchMethod 方法

如果调用了对象上不存在的方法或实例变量将会触发 `noSuchMethod` 方法，你可以重写 noSuchMethod 方法来追踪和记录这一行为：

```dart
class A {
  // Unless you override noSuchMethod, using a
  // non-existent member results in a NoSuchMethodError.
  @override
  void noSuchMethod(Invocation invocation) {
    print('You tried to use a non-existent member: '
        '${invocation.memberName}');
  }
}
// 调用
dynamic aaa = A(); // 用var不行
aaa.getX();
```

只有下面其中一个条件成立时，你才能调用一个未实现的方法：

- 接收方是静态的 dynamic 类型。
- 接收方具有静态类型，定义了未实现的方法（抽象亦可），并且接收方的动态类型实现了 noSuchMethod 方法且具体的实现与 Object 中的不同。

## 扩展方法

```dart
extension NumberParsing on String {
  int parseInt() {
    return int.parse(this);
  }
// ···
}
```

## 枚举类型

所有的枚举都继承于 [Enum](https://api.dart.cn/stable/dart-core/Enum-class.html) 类。枚举类是封闭的，即不能被继承、被实现、被 mixin 混入或显式被实例化。

### 简单的枚举

```dart
enum Color { red, green, blue }
```

### 声明增强的枚举类型

Dart 中的枚举也支持定义字段、方法和常量构造，常量构造只能构造出已知数量的常量实例（已定义的枚举值）<br >你可以使用与定义 [类](https://dart.cn/guides/language/language-tour#classes) 类似的语句来定义增强的枚举，但是这样的定义有一些限制条件：

- 实例的字段必须是 final，包括由 [mixin](https://dart.cn/guides/language/language-tour#mixins) 混入的字段。
- 所有的 [实例化构造](https://dart.cn/guides/language/language-tour#constant-constructors) 必须以 const 修饰
- [工厂构造](https://dart.cn/guides/language/language-tour#factory-constructors) 只能返回已知的一个枚举实例。
- 由于 [Enum](https://api.dart.cn/stable/dart-core/Enum-class.html) 已经自动进行了继承，所以枚举类不能再继承其他类。
- 不能重载 index、hashCode 和比较操作符 ==
- 不能声明 values 字段，否则它将与枚举本身的静态 values getter 冲突。
- 在进行枚举定义时，所有的实例都需要首先进行声明，且至少要声明一个枚举实例。

```dart
enum Vehicle implements Comparable<Vehicle> {
  car(tires: 4, passengers: 5, carbonPerKilometer: 400),
  bus(tires: 6, passengers: 50, carbonPerKilometer: 800),
  bicycle(tires: 2, passengers: 1, carbonPerKilometer: 0);

  const Vehicle({
    required this.tires,
    required this.passengers,
    required this.carbonPerKilometer,
  });

  final int tires;
  final int passengers;
  final int carbonPerKilometer;

  int get carbonFootprint => (carbonPerKilometer / passengers).round();

  @override
  int compareTo(Vehicle other) => carbonFootprint - other.carbonFootprint;
}
```

## 使用 Mixin 为类添加功能

Mixin 是一种在多重继承中复用某个类中代码的方法模式。

- 使用 `with` 关键字并在其后跟上 Mixin 类的名字来使用 **Mixin 模式**，多个类使用逗号分隔

```dart
void main() {
  Musician musician = Musician();
  musician.perform();
  musician.entertainMe();
}

class Musician extends Performer with Musical, A, B {}

class Performer {
  void perform() {
    print('Performing...');
  }
}

mixin A {}
mixin B {}
mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}
```

- 可以使用关键字 `on` 来指定哪些类可以使用该 Mixin 类，

```dart
mixin MusicalPerformer on A { // MusicalPerformer指定了只有A及子类可以使用该mixin
  // ...
}
class MusicArtist with MusicalPerformer { // 报错：'MusicalPerformer' can't be mixed onto 'Object' because 'Object' doesn't implement 'A'
  // ...
}
```

- 想要实现一个 Mixin，请创建一个继承自 Object 且未声明构造函数的类

## 库和可见性

- 以下划线（`_`）开头的成员仅在代码库中可见（如果你对 Dart 为何使用下划线而不使用 `public` 或 `private` 作为可访问性关键字，可以查看 [SDK issue 33383](https://github.com/dart-lang/sdk/issues/33383)）
- import库别名：如果你导入的两个代码库有冲突的标识符，你可以为其中一个指定前缀。比如如果 library1 和 library2 都有 Element 类，那么可以这么处理：

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```

- 导入库的一部分

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

- 延迟加载库：允许应用在需要时再去加载代码库
  - 使用 deferred as 关键字来标识需要延时加载的代码库：
  - 目前只有 dart compile js 支持延迟加载 Flutter 和 Dart VM目前都不支持延迟加载。你可以查阅 [issue #33118](https://github.com/dart-lang/sdk/issues/33118) 和 [issue #27776](https://github.com/dart-lang/sdk/issues/27776) 获取更多的相关信息。

```dart
import 'package:greetings/hello.dart' deferred as hello;
// 当实际需要使用到库中 API 时先调用 loadLibrary 函数加载库：
Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

- loadLibrary 函数可以调用多次也没关系，代码库只会被加载一次。
- 延迟加载的代码库中的常量需要在代码库被加载的时候才会导入，未加载时是不会导入的。
- 导入文件的时候无法使用延迟加载库中的类型。如果你需要使用类型，则考虑把接口类型转移到另一个库中然后让两个库都分别导入这个接口库。
- Dart会隐式地将 loadLibrary() 导入到使用了 deferred as 命名空间 的类中。 loadLibrary() 函数返回的是一个 [Future](https://dart.cn/guides/libraries/library-tour#future)。

# 泛型

- 基本和Java中的类似，也有一些不同
- 使用集合字面量：List、Set 以及 Map 字面量也可以是参数化的。定义参数化的 List 只需在中括号前添加 `<type>`；定义参数化的 Map 只需要在大括号前添加 `<keyType, valueType>`：

```dart
var names = <String>['Seth', 'Kathy', 'Lars'];
var uniqueNames = <String>{'Seth', 'Kathy', 'Lars'};
var pages = <String, String>{
  'index.html': 'Homepage',
  'robots.txt': 'Hints for web robots',
  'humans.txt': 'We are people, not machines'
};
```

- 使用类型参数化的构造函数：在调用构造方法时也可以使用泛型，只需在类名后用尖括号（`<...>`）将一个或多个类型包裹即可：

```dart
var nameSet = Set<String>.from(names);
// 下面代码创建了一个键为 Int 类型，值为 View 类型的 Map 对象：
var views = Map<int, View>();
```

- Dart的泛型类型是 **固化的**，这意味着即便在运行时也会保持类型信息：

```dart
var names = <String>[];
names.addAll(['Seth', 'Kathy', 'Lars']);
print(names is List<String>); // true
```

# 集合

## 定义集合并初始化

1. 集合元素类型是泛型的 , 可以接受任何数据类型
2. 如果没有指定泛型 , 集合中可以存放不同类型的元素
3. 使用 `[]` 初始化集合元素

示例：在一个未指定泛型的集合中同时存放 int , double , String , bool 类型的元素

```dart
List list = [1, 1.0, '字符串' , true];

//使用 print 可以直接打印集合
//打印集合 list : [1, 1.0, 字符串, true]
print("打印集合 list : $list");
```

## 集合泛型

1. 如果集合声明时 , 指定了泛型 , 那么就只能存放该泛型类型的元素
2. 泛型不同的 List 集合斌量之间不能相互赋值

示例：

```dart
List<int> list_int = [1 , 2, 3];

//打印集合 list1 : [1, true]
print("打印集合 list_int : $list_int");
```

## 集合操作

### 添加元素

1. 添加单个元素 : 通过 add ( ) 方法 添加单个元素 ;
2. 添加多个元素 : 通过 addAll ( ) 方法 添加多个元素 ;

```dart
List list1 = [];
list1.add(1);
list1.add(true);
// 打印集合 list1 : [1, true]
print("打印集合 list1 : $list1");


List list = [1, 1.0, '字符串' , true];  
List list2 = [];
list2.addAll(list);
// 打印集合 list2 : [1, 1.0, 字符串, true]
print("打印集合 list2 : $list2");
```

### 集合生成函数

generate()

- int length 参数 : List 集合元素个数 ;
- E generator(int index) 参数 : 生成元素的回调函数 , 其中 index 是元素索引值 ;

```dart
//集合的生成函数
//  int length 参数 : 集合的长度
//  E generator(int index) : 集合的回调函数 , 调用该函数获取集合的 index 位置的元素
List list_generate = List.generate(3, ( index ) => index * 3);

//打印集合 list_generate : [0, 3, 6]
print("打印集合 list_generate : $list_generate");
```

### 集合遍历

1. 通过 带循环条件的 普通 for 循环遍历

```dart
// 1 . 方式 1 : 通过下标访问集合
for(int i = 0; i < list_generate.length; i ++){
  print(list_generate[i]);
}
```

2. 通过 for in 样式的 for 循环遍历

```dart
// 2 . 方式 2 : 通过 var obj in list_generate 获取集合中的元素
for( var obj in list_generate ){
  print(obj);
}
```

3. 通过 For Each 循环遍历

```dart
// 3 . 方式 3 : For Each 循环
list_generate.forEach( ( element ) {
  print(element);
});
```

# Dart单例

在实现单例模式时，也需要考虑如下几点，以防在使用过程中出现问题：

- 是否需要懒加载，即类实例只在第一次需要时创建。
- 是否线程安全，在 Java、C++ 等多线程语言中需要考虑到多线程的并发问题。由于 Dart 是单线程模型的语言，所有的代码通常都运行在同一个 isolate 中，因此不需要考虑线程安全的问题。
- 在某些情况下，单例模式会被认为是一种 反模式，因为它违反了 SOLID 原则中的单一责任原则，单例类自己控制了自己的创建和生命周期，且单例模式一般没有接口，扩展困难。
- 单例模式的使用会影响到代码的可测试性。如果单例类依赖比较重的外部资源，比如 DB，我们在写单元测试的时候，希望能通过 mock 的方式将它替换掉。而单例类这种硬编码式的使用方式，导致无法实现 mock 替换。

## 普通单例

```dart
class Singleton {
  static Singleton? _instance;
  // 私有的命名构造函数
  Singleton._internal();
  static Singleton getInstance() {
    _instance ??= Singleton._internal();
    return _instance!;
  }
}
```

## Dart化

Dart 语言作为单线程模型的语言，实现单例模式时，我们本身已经可以不用再去考虑 线程安全 的问题了。Dart 的很多其他特性也依然可以帮助到我们实现更加 Dart 化的单例<br >使用 getter 操作符，可以打破单例模式中既定的，一定要写一个 getInstance() 静态方法的规则，简化我们必须要写的模版化代码，如下的 get instance:

```dart
class Singleton2 {
  static Singleton2? _instance;
  static get instance {
    _instance ??= Singleton2._internal();
    return _instance;
  }
  Singleton2._internal();
}
```

Dart 的 getter 的使用方式与普通方法大致相同，只是调用者不再需要使用括号，这样，我们在使用时就可以直接使用如下方式拿到这个单例对象：

```dart
Singleton2.instance;
```

而 Dart 中特有的 `工厂构造函数（factory constructor）`也原生具备了 不必每次都去创建新的类实例 的特性，将这个特性利用起来，我们就可以写出更优雅的 Dart(able) 单例模式了

```dart
class Singleton3 {
  static Singleton3? _instance;
  Singleton3._internal();
  // 工厂构造函数
  factory Singleton3() {
    _instance ??= Singleton3._internal();
    return _instance!;
  }
}

// 或者
class Singleton4 {
  static Singleton4? _instance;

  Singleton4._internal() {
    _instance = this;
  }

  factory Singleton4() => _instance ?? Singleton4._internal();
}
```

被标记为 late 的变量 _instance 的初始化操作将会延迟到字段首次被访问时执行，而不是在类加载时就初始化。

```dart
class Singleton5 {
  Singleton5._internal();

  factory Singleton5() => _instance;

  static late final Singleton5 _instance = Singleton5._internal();
}
```

Dart中实现单例模式的标准做法就是使用`static变量+工厂构造函数`的方式，这样就可以保证EventBus()始终返回都是同一个实例

```dart
class EventBus {
	// 私有构造函数
  EventBus._internal();
  
	// 保存单例
  static EventBus _singleton = EventBus._internal();
  
	// 工厂构造函数
  factory EventBus() => _singleton;
}
```
