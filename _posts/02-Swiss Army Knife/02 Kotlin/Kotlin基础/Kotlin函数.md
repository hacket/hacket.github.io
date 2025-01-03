---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
tags:
  - '#1,2,3;'
---

![](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1684687039560-2f8cd681-02a5-4255-b411-254e28ba9ad0.jpeg)

# Kotlin普通函数

## Kotlin函数的声明和调用

### main函数

main函数式kotlin程序的入口函数，它是计算机运行起来第一个默认找到第一个运行的函数。

### 标准函数格式

用关键字`fun`声明

```kotlin
// 函数声明
fun 函数名(参数名:参数类型):返回值类型{
    函数体
}

// 示例
fun main(args: Array<String>) {
    println(plus(1, 3))
}

fun plus(a: Int, b: Int): Int {
    return a + b;
}
```

### 函数简写

如果函数体只有一行代码，可以简写

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
// 等价于
fun add(a: Int, b: Int): Int = a + b
// 还可以写成
fun sum(a: Int, b: Int) = a + b
```

### 函数表达式

- 第一种简洁方式：

```kotlin
var 函数名 = {变量名1:变量1类型, 变量名2:变量2类型 -> 函数体}
```

- 第二种方式：

```kotlin
var 函数名:(参数类型1,参数类型2) -> 返回值类型 = {变量1,变量2 -> 函数体(要返回对应的类型)}
```

案例：

```kotlin
// 第一种方式
var add2 = { a: Int, b: Int -> a + b }
var result2 = add2(3, 5)
println(result2)

// 第二种方式1
var add3: (Int, Int) -> Int = { x, y -> x + y }
var result3 = add3(3, 5)
println(result3)

// 第二种方式2
var j: (Int, Int) -> String = { a, b -> "$a+$b=" + (a + b) };
println(j(1, 2))
```

### 默认参数和具名参数

**默认参数**，在函数的参数中指定默认值；<br>**具名参数**，当一个函数有了默认参数，调用时除了默认参数，其他的参数需要把参数名写出来

```kotlin
fun getRectArea(length: Float, width: Float): Float {
    return length * width
}

val PI = 3.1415926f

fun getCircumference(Pi: Float = PI, radius: Float): Float { // Pi为默认参数
    return 2 * Pi * radius;
}

fun main(args: Array<String>) {
    var result = getRectArea(2.0f,4.0f)
    println(result)

    var result2 = getCircumference(radius = 3.0f) // 具名参数，有了默认参数，调用函数要把参数名写出来
    println(result2)
}
```

### 可变参数

可变参数结构：`vararg args:String?`

#### 可变参数中的`*`

`*`把数组拆分为可变参数<br>可变参数调用可变参数需要注意，需要在可变参数前加上`*`，否则会当成调用者的是一个可变参数，导致出错

```kotlin
override fun d(message: String?, vararg args: Any?) {
    d(null, message, *args)
}

override fun d(tag: String?, message: String?, vararg args: Any?) {
    if (!TextUtils.isEmpty(tag)) {
        Timber.tag(tag)
    }
    Timber.d(message, *args)
}
```

### 函数的调用

调用一个kotlin函数，可以显示地标明一些参数的名称（如果在调用了一个函数时，指明了一个函数的名称，为了避免混淆，那它之后的所有参数都需要标明名称）

```kotlin
fun <T> joinToString(collection: Collection<T>, separator: String, prefix: String, postfix: String): String {
    val result = StringBuffer(prefix)
    for ((index, ele) in collection.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(ele)
    }
    result.append(postfix)
    return result.toString()
}
// 调用
println(joinToString(list, "-", "{", "}"))
println(joinToString(list, separator = ";", prefix = "<", postfix = ">"))
```

- 默认参数

```kotlin
@JvmOverloads
fun <T> joinToString(collection: Collection<T>, separator: String = ",", prefix: String = "", postfix: String = ""): String {
    val result = StringBuffer(prefix)
    for ((index, ele) in collection.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(ele)
    }
    result.append(postfix)
    return result.toString()
}
// 调用
println(joinToString(list, "-", "{", "}")) // {1-2-3}
println(joinToString(list, separator = ";", prefix = "<", postfix = ">")) // <1;2;3>
println(joinToString(list)) // 1,2,3
println(joinToString(list, "--")) // 1--2--3
println(joinToString(list, postfix = ";", prefix = "#")) // #1,2,3;
```

> 调用有默认参数的函数时

1. 常规调用，必须按照函数声明中定义的参数顺序来给定参数
2. 可以省略的只有排在末尾的参数
3. 调用使用命名参数，可以省略中间的一些参数，也可以以你想要的任意顺序只给定你需要的参数

Java中没有参数默认值的概念，从Java中调用kotlin函数的时候，必须显示地指定所有参数值。如果希望Java调用者简单，可以用`@JvmOverloads`注解它，这个指示编译器生成java重载函数，从最后一个开始省略每个参数

## kotlin中消除静态类(Kotlin顶层函数和顶层属性)

### 顶层函数

java中很多存静态方法的类（如Collections），kotlin可以消除掉这些类，这些没什么意义。

```java
@file:JvmName("StringFunctions") // 改变生成的.class文件的名字，要放在文件顶层开头的位置

package strings

@JvmOverloads
fun <T> joinToString(collection: Collection<T>, separator: String = ",", prefix: String = "", postfix: String = ""): String {
    val result = StringBuffer(prefix)
    for ((index, ele) in collection.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(ele)
    }
    result.append(postfix)
    return result.toString()
}
```

> 默认生成的.class名为kotlin.kt文件名首字母大写加Kt的名，如base.kt，生成BaseKt.class

### 顶层属性

属性写在文件的顶层；如果想以java中的常量`public static final`属性暴露，那么可以用`const`来修饰它

```kotlin
var opCount = 0
const val UNIX_LINE_SEPARATOR = "\n"
```

## 扩展函数和属性

### 扩展函数

扩展函数，就是一个类的成员函数，不过定义在类的外面。要做的就是把你要扩展的类或接口的名称，放到即将添加的函数前面，这个类称为接收者类型，用来调用这个扩展函数的对象叫做接收者对象。

```kotlin
//fun String.lastChar(): Char {
//    return this.get(this.length - 1)
//}
// 等同于
//fun String.lastChar(): Char = this.get(this.length - 1)
// 也等同于
fun String.lastChar(): Char = get(length - 1)
```

> String是接收者类型，this是接收者对象

使用：

```kotlin
println("Kotlin".lastChar())
```

> 在扩展函数中，可以直接访问被扩展的类的其他方法和属性，就好像是在这个类自己的方法中访问它们一样。但是，扩展函数并不允许你打破它的封装性，扩展函数不能访问**私有的或受保护的成员**。扩展函数使用需要导入，用import可以导入单个函数，也可以重命名修改导入的类或者函数

```kotlin
import strings.lastChar as last
val c = "kotlin".last()
```

> 一般的类或函数，可以选择用全名；而扩展函数，kotlin语法要求你用简短的名称，所以导入的时候，as就很重要了

### 从Java中扩展函数

扩展函数是用Java的静态函数实现的，它把调用对象作为了它的第一个参数。调用扩展函数，不会创建适配的对象或者任何运行时的额外消耗。

### 不可重写的扩展函数

扩展函数的静态性质决定了扩展函数不能被子类重写。类的成员函数可以被重写。

```kotlin
open class View {
    open fun click() = println("View clicked")
}
class Button : View() {
    override fun click() {
        println("Button clicked")
    }
}
fun View.showOff() =
        println("I am a view showoff")
fun Button.showOff() =
        println("I am a button showoff")
fun main(args: Array<String>) {
    val view: View = Button()
    view.click() // Button clicked
    view.showOff() // I am a view showoff
}
```

扩展函数并不是类的一部分，它是声明在类的外面。<br>如果一个类的成员函数和扩展函数有相同的签名，成员函数往往会被优先使用。

### 扩展属性

扩展属性需要定义getter和setter(val就没有setter)，因为没有支持字段，也就没默认的getter，所以需要自己定义，同理，初始化也不可以，因为没有地方存储初始值。

```kotlin
var StringBuilder.lastChar: Char
    get() = get(length - 1)
    set(value) {
        this.setCharAt(length - 1, value)
    }
```

> 从Java中访问扩展属性时，应该显示地调用它的getter函数

## 内联函数

### lambda表达式效率低原因

lambda表达式会被正常地编译成匿名类，这表示每调用一次lambda表达式，一个额外的类就会被创建，并且如果lambda捕捉了某个变量，那么每次调用的时候都会创建一个新的对象，这带来了运行时的额外开销，导致使用lambda比使用一个直接执行相同代码的函数效率更低。

### 内联函数作用

内联函数的作用：消除lambda带来的运行时开销<br>当一个函数被声明为inline，它的函数体是内联的，函数体会被直接替换到函数被调用的地方，而不是被正常调用。

```kotlin
fun foo(l: Lock) {
    println("Before sync")
    synchronized(l)
    {
        println("Action")
    }
    println("After sync")
}
inline fun <T> synchronized(lock: Lock, action: () -> T): T {
    lock.lock()
    try {
        return action()
    } finally {
        lock.unlock()
    }
}
```

会被编译成：

```kotlin
fun _foo_(l: Lock) {
    println("Before sync")
    l.lock()
    try {
        println("Action")
    } finally {
        l.unlock()
    }
    println("After sync")
}
```

**注意：**函数体太大不要内联

## 尾递归函数优化

在递归函数前面加`tailrec`，告诉编译器进行相应的优化，提升性能，即采用循环方式替代递归，从而避免栈溢出的情况。

- 求阶乘

```kotlin
fun factorial(num: BigInteger): BigInteger {
    if (num == BigInteger.ONE) {
        return BigInteger.ONE
    }
    return num * factorial(num - BigInteger.ONE)
}
```

- **尾递归优化**

尾递归的重要性在于它可以不在调用栈上面添加一个新的堆栈帧——而是更新它，如同迭代一般。<br>尾递归因而具有两个特征： 调用自身函数(Self-called)； 计算仅占用常量栈空间(Stack Space)。

允许一些通常**用循环写的算法改用递归函数来写**，而无堆栈溢出的风险。 当一个函数用 tailrec 修饰符标记并满足所需的形式时，编译器会优化该递归，留下一个快速而高效的基于循环的版本：

要符合 tailrec 修饰符的条件的话，函数必须将其自身调用作为它执行的最后一个操作。在递归调用后有更多代码时，不能使用尾递归，并且不能用在 try/catch/finally 块中。目前在 Kotlin for JVM 与 Kotlin/Native 中支持尾递归。

`tailrec`关键字提示编译器尾递归优化；在方法前加`tailrec`关键字，要求调用本身

```kotlin
// 普通递归
fun sum1(num: Int, result: Int): Int {
    println("${num}次运算：" + result)
    if (num == 0) {
        return 0
    }
    return sum1(num - 1, result + num) // 将每次运算的结果保存到result，下次运算再传进来
}
// 尾递归
tailrec fun sum(num: Int, result: Int): Int {
    println("${num}次运算：" + result)
    if (num == 0) {
        return 0
    }
    return sum(num - 1, result + num) // 将每次运算的结果保存到result，下次运算再传进来
}
```

反编译后：

```java
public final class TestTailrecKt {
   public static final int sum1(int num, int result) {
      String var2 = num + "次运算：" + result;
      boolean var3 = false;
      System.out.println(var2);
      return num == 0 ? 0 : sum1(num - 1, result + num);
   }

   public static final int sum(int num, int result) {
      while(true) {
         String var2 = num + "次运算：" + result;
         boolean var3 = false;
         System.out.println(var2);
         if (num == 0) {
            return 0;
         }

         int var10000 = num - 1;
         result += num;
         num = var10000;
      }
   }
}
```

## 泛型函数

```kotlin
fun <T> appendStr(tag: String, vararg otherInfo: T?): String {
    var str: String = "$tag: "
    for (info in otherInfo) {
        str = "$str $info, "
    }
    return str
}
```

## 数据解构声明和组件函数

**解构声明**：允许你展开单个复合值。一个解构声明看起来像一个普通的变量声明，但它在括号中有多个变量

```kotlin
var point2 = Point2(20, 21)
val (x, y) = point2
println("x:$x,y:$y")

class Point2(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```

要在解构声明中初始化每个变量，将调用`componentN`的函数，其中N就是声明中变量的位置；<br>对于数据类，编译器为每个在主构造方法中声明的属性生成了一个`componentN`函数；使用场景1从一个函数返回多个值

```kotlin
fun test706() {
    var (name, ext) = splitFilename("android.kt")
    print("name:$name,ext:$ext")
}
data class NameComponents(val name: String, val ext: String)
fun splitFilename(fullName: String): NameComponents {
    val result = fullName.split('.', limit = 2)
    return NameComponents(result[0], result[1])
}
// 也等价于
fun splitFilename(fullName: String): NameComponents {
    val (name, extension) = fullName.split('.', limit = 2)
    return NameComponents(name, extension)
}
```

`componentN`函数在数组和集合上也有定义，个数不能无限定义，标准库只允许访问一个对象前五个元素<br>**解构声明用在循环**<br>解构声明不仅可以用作函数中的顶层语句，还可以用在声明变量地方

```kotlin
fun test707() {
    val map = mapOf("Oracel" to "Java", "JetBrains" to "Kotlin")
    printEntries(map)
}

fun printEntries(map: Map<String, String>) {
    for ((key, value) in map) {
        println("key:$key, value:$value")
    }
}
```

## 函数的应用

### 1、集合的扩展

kotlin的集合和java中的集合类相同，但对api做了很多的扩展

```kotlin
val strings: List<String> = listOf("first", "second", "third")
println(strings.last())

val numbers: Collection<Int> = setOf(1, 3, 24)
println(numbers.max())
```

### 2、可变参数 *

kotlin用`vararg`关键字声明可变参数，和java的`...`不同。<br>和java的可变参数不同，需要传递的参数已经包装在数组中时，调用该函数的语法。在java，可以按原样传递数组，而kotlin则要求你显式地解包数组，以便每个数组元素在函数中能作为单独的参数来调用。这个叫做**展开运算符**，而使用的时候，不过在对应的参数前面放一个`*`号。

```kotlin
fun test22(args: Array<String>) {
    var list = listOf("args:", *args)
    println(list)
}
fun main(args: Array<String>) {
    var listOf = listOf("hacket", "you")
    test22(listOf.toTypedArray())
}
```

### 3、键值对处理：中缀调用和解构声明 to

使用`mapOf()`声明一个map集合。

```kotlin
val map = mapOf(1.to("one"), 7 to "seven", 53 to "fifty-three")
```

> 单词`to`不是内置的结构，而是一种特殊的函数调用，称为**中缀调用**，在中缀调用中，没有添加额外的分隔符，函数名称是直接放在目标对象名称和参数之间的，下面两种调用方式等价：

```kotlin
1.to("one") // 一般to函数调用
1 to "one" // 使用中缀符号调用to函数
```

中缀调用可以与只有一个参数的函数一起使用，无论是普通的函数还是扩展函数。要允许使用中缀符号调用函数，需要使用`infix`修饰符来标记它，下面是to函数的声明。

```kotlin
public infix fun <A, B> A.to(that: B): Pair<A, B> = Pair(this, that)
```

用to函数创建一个Pair，然后用解构声明来展开。

### 4、字符串和正则（三重引号字符串）

`""" """`三重引号的字符串，在这样的字符串中，不需要对任何字符进行转义，包括反斜线。<br>三重引号字符串，不仅仅可以避免转义字符，而且可以使它包含任何字符，包括换行符，包括用于格式化代码的缩进

### 5、局部函数

局部函数：在函数中嵌套函数<br>局部函数可以访问所在函数中的所有参数和变量

```kotlin
class User(val id: Int, val name: String, val address: String)
fun User.validateBeforSaveUser() {
    fun validate(value: String, fieldName: String) {
        if (value.isEmpty()) {
            throw IllegalArgumentException("Can't save user${this.id}: empty $fieldName")
        }
    }
    validate(this.name, "Name")
    validate(this.address, "Address")
}
fun saveUser(user: User) {
    user.validateBeforSaveUser()
    // 验证通过，保存到数据库
}
```

# 高阶函数

## 什么是高阶函数？

**高级函数定义：**一个用函数作为参数或者返回值的函数。<br>kotlin官方定义的高阶函数

```
maxBy
minBy
filter
map
any
count
find 查找第一个符合条件的
groupBy
```

## 高阶函数基础

### 匿名函数（等同于FunctionX）

函数类型声明：`(P1,P2) -> R`

1. P1,P2是参数类型
2. R是返回值

lambda括号里面的函数最后一行就是这个函数的返回值

#### 匿名函数不带参数，不带返回值

案例：

```kotlin
fun main() {

    val func: () -> Unit = fun() {
        println("没有函数名，无参数，无返回值，带参数类型的，带func的匿名函数")
    }

    // 没有函数名可以省略fun关键字
    val func1: () -> Unit = {
        println("没有函数名，无参数，无返回值，带参数类型的，不带func的匿名函数")
    }

    // 参数类型也省略
    val func2 = fun() {
        println("没有函数名，无参数，无返回值，不带参数类型，带fun()的匿名函数")
    }
    // 没有函数名，没有参数，又没有返回值，那么fun和函数类型都可以省略掉
    val func3 = {
        println("没有函数名，无参数，无返回值，不带参数类型，不带fun()的匿名函数")
        1+2
    }

    func()
    func1() // 等同于func1.invoke()
    func2()
    val i = func3()
    println("------ i=$i ------")
}
```

结果：

```
没有函数名，无参数，无返回值，带参数类型的，带func的匿名函数
没有函数名，无参数，无返回值，带参数类型的，不带func的匿名函数
没有函数名，无参数，无返回值，不带参数类型，带fun()的匿名函数
没有函数名，无参数，无返回值，不带参数类型，不带fun()的匿名函数
------ i=3 ------
```

#### 匿名函数带参数，不带返回值

```kotlin
val f1 = { p: Int -> println("没有函数名，带参数($p)，无返回值，不带fun的匿名函数") }
val f2: (Int) -> Unit = { p: Int -> println("没有函数名，带1个参数($p)，无返回值，不带fun的匿名函数") }
val f3: Function1<Int, Unit> = { p: Int -> println("没有函数名，带1个参数($p)，无返回值，不带fun的匿名函数") }
f1.invoke(100)
f1(120)
f2(130)
f3(140)

val f4 = { p: Int, p2: String -> println("没有函数名，带2个参数(${p} ${p2})，无返回值，不带fun的匿名函数") }
val f5: Function2<Int, String, Unit> = { p: Int, p2: String -> println("没有函数名，带2个参数(${p} ${p2})，无返回值，不带fun的匿名函数") }
f4(159, "hacket")
f5.invoke(190, "h111acket")

val f6:(Int)->Int = {
    println("没有函数名，带1个参数($it)，用it指代，有返回值，不带fun的匿名函数")
    470
}
println(f6(110))
```

结果：

```
没有函数名，带参数(100)，无返回值，不带fun的匿名函数
没有函数名，带参数(120)，无返回值，不带fun的匿名函数
没有函数名，带1个参数(130)，无返回值，不带fun的匿名函数
没有函数名，带1个参数(140)，无返回值，不带fun的匿名函数
没有函数名，带2个参数(159 hacket)，无返回值，不带fun的匿名函数
没有函数名，带2个参数(190 h111acket)，无返回值，不带fun的匿名函数
没有函数名，带1个参数(110)，用it指代，有返回值，不带fun的匿名函数
470
```

#### 匿名函数小结

1. 匿名函数的声明可以省略，如`(Int) -> Unit`；fun关键字也可以省略
2. 无参数无返回值，fun都可以省略
3. 只有一个参数时，参数列表可以省略，用it指代

## 声明高阶函数

高阶函数就是以另一个函数作为**参数**或**返回值**的函数，kotlin中函数可以用lambda或者函数引用表示。

### 函数类型

如何声明形参的类型？

```kotlin
fun test802() {
    var sum = { x: Int, y: Int -> x + y }
    var sum2: (Int, Int) -> Int = { x, y -> x + y } // 两个Int型参数和Int型返回值的函数
    println(sum(1, 2))
    println(sum2(1, 2))

    val action = { println(42) }
    val action2: () -> Unit = { println(42) } // 没有参数和返回值的函数
}
```

声明**函数类型**，需要将函数参数类型放在括号中，紧接着是一个箭头和函数的返回类型：

```kotlin
// 声明函数类型
(Int, String) -> Unit
// (Int, String) 是参数类型
// Unit 是返回类型
```

Unit类型用于表示函数不返回任何值，普通的函数声明中Unit可以省略；但是一个函数类型声明总是需要一个显式地返回类型<br>函数类型的返回值也可以为空：

```kotlin
var canRetrunNull: (Int, Int) -> Int? = { _, _ -> null }
```

也可以定义一个**函数类型的可空变量**，表示是变量本身可空，而不是函数类型的返回值类型为空，需要将整个函数类型的定义包含在括号内并在括号后加上`?`号：

```
var funOrNull: ((Int, Int) -> Int)? = null
```

可以为函数类型声明中的参数指定名字：

```kotlin
fun performRequest(url: String,callback: (code: Int, content: String) -> Unit) { // 函数类型的参数现在有了名字
}
// 调用
val url = "http://kotl.in"
performRequest(url) { code, content -> } // 使用API中提供的参数名字作为lambda参数的名字
performRequest(url) { code, page -> } // 改变参数的名字
performRequest(url, ({ code, page -> }))
```

## 调用作为参数的函数

声明一个函数类型的函数

```kotlin
fun twoAndThree(operation: (Int, Int) -> Int) {
    val result = operation(2, 3)
    println(result)
}
// 使用
twoAndThree(({ a, b -> a + b }))
twoAndThree { a, b -> a * b }
```

例子讲解：

```kotlin
fun String.filter(predicate: (Char) -> Boolean): String
// String为接收者类型
// predicate为参数类型
// Char作为参数传递的函数的参数类型
// Boolean作为参数传递的函数的返回类型
// (Char) -> Boolean 函数类型参数
```

filter函数以一个判断式作为参数，判断式的类型是一个函数，以字符作为参数并返回boolean类型的值

```kotlin
// 基于String类型filter函数
fun String.filter(predicate: (Char) -> Boolean): String {
    val sb = StringBuffer()
    for (index in this.indices) {
        var ch = this[index]
        if (predicate(ch)) {
            sb.append(ch)
        }
    }
    return sb.toString()
}
// 使用
val string = "fdahfjlkrja0iprip5m"
var s = "465fhr0em".filter { ch -> ch in string }
var s1 = "465fhr0em".filter { it in string }
println(s)
println(s1)
```

### 在Java中使用函数类型

函数类型背后的原理是，函数类型被声明为普通的接口：一个函数类型的变量是`FunctionN`接口的一个实现。`Function0<R>`表没有参数的函数，`Function1<P1,R>`表一个参数的函数，每个接口定义了一个invoke方法，调用这个方法就会执行函数，一个函数类型的变量就是实现了对应的FunctionN接口的实现类的实例，实现类的invoke方法包含了lambda函数体。<br>Java8的lambda会被自动转换为函数类型的值<br>可以在Java代码中使用kotlin标准库中的函数，但必须显式地返回一个Unit类型的值

### 函数类型的参数值默认和空值

声明函数类型的默认值并不需要特殊的语法，只需要把lambda作为值放在=号后面

```kotlin
fun <T> Collection<T>.joinToString(
        separator: String = ", ",
        prefix: String = "",
        postfix: String = "",
        transform: (T) -> String = { it.toString() }
): String {
    val result = StringBuilder(prefix)
    for ((index, value) in this.withIndex()) {
        if (index > 0) {
            result.append(separator)
        }
        result.append(transform(value))
    }
    result.append(postfix)
    return result.toString()
}
// 调用
var listOf = listOf("ALPHA", "BETA", "HACKET")
println(listOf.joinToString(transform = { ch: String -> ch.toUpperCase() }))
println(listOf.joinToString { ch: String -> ch.toLowerCase() })
```

声明函数类型为空，用?.安全调用

### 返回函数的函数

### 通过lambda去除重复代码

函数类型和lambda表达式一起组成了一个创建可重用代码的好工具。<br>如策略模式，使用函数类型，用一个通用的函数类型来描述策略，然后传递不同的lambda表达式作为不同的策略。

```kotlin
fun testHigherFun() {

    var ints: Array<Int> = arrayOf(1, 4, 3, 65, 6, 3)
    var maxInt = maxCustom(ints, { a, b ->
        a > b
    })
    println(maxInt)

    var strings = arrayOf("f", "fafdf", "dd", "fdafda111f", "dfdf", "kojko")
    var maxLength = maxCustom(strings, { s1, s2 ->
        s1.length > s2.length
    })
    println(maxLength)
}

fun <T> maxCustom(array: Array<T>, greater: (T, T) -> Boolean): T? {
    var max: T? = null
    for (item in array) {
        if (max == null || greater(item, max)) {
            max = item
        }
    }
    return max
}
```

## Function Reference

Kotlin 官方文档里对于双冒号(`::`)加函数名的写法叫 Function Reference 函数引用<br>在 Kotlin 里，一个函数名的左边加上双冒号，它就不表示这个函数本身了，而表示一个对象，或者说一个指向对象的引用，但，这个对象可不是函数本身，而是一个和这个函数具有相同功能的对象。<br>个声明好的函数，不管是你要把它作为参数传递给函数，还是要把它赋值给变量，都得在函数名的左边加上双冒号才行：

```kotlin

fun b(param: Int): String {
  return param.toString()
}

fun a(funParam: (Int) -> String): String {
  return funParam(1)
}

a(::b)
val d = ::b
```

## 高阶函数小结

1. Kotlin中，函数并不能传递，传递的是对象
2. 匿名函数和 Lambda 表达式其实都是对象，普通函数加上`::`变成对象
3. 创建一个函数类型的对象有三种方式：双冒号加函数名、匿名函数和 Lambda

# Lambda

## Lambda定义

Lambda表达式，就是匿名函数，本质上是可以传递给其他函数的一小段代码。

1. 在代码中存储和传递一小段行为
2. 函数式编程提供了一种解决问题方法，把函数当做值来对待，不用声明函数了
3. lambda可以被独立地声明并存储到一个变量中，常见的还是直接声明它并传递给函数
4. lambda只能定义22个参数

## Lambda和集合

maxBy()

```
data class Person0(val name: String, val age: Int)
var persons = listOf(Person0("hacket", 26), Person0("xiaohu", 27), Person0("gounan", 24))
var max = persons.maxBy { it.age }
```

如果Lambda刚好是函数或者属性的委托，可以用成员引用替换

```
var max = persons.maxBy(Person0::age)
```

## Lambda语法

### Lambda表达式基本语法

```
{ x: Int, y: Int -> x + y }
// x,y是实参列表，实参列表没有用括号括起来
// -> 箭头把实参列表和函数体隔开
// x+y是函数体
// kotlin中的lambda表达式始终用花括号包围
```

### Lambda基本应用

1. Lambda表达式可以存储在一个变量中

```kotlin
val sum = { x: Int, y: Int -> x + y }
println(sum(1, 20))
```

2. 当作普通函数对待

```kotlin
{ println(42) }()
// 直接执行lambda函数体中的代码
// 等价于：使用库函数run来执行传递给它的lambda
run { println(42) }
```

### Lambda简明语法

1. 常规lambda语法的写法

```kotlin
persons.maxBy({ p: Person0 -> p.age })
```

2. 移到括号`()`外边<br>如果**lambda表达式**是函数调用的最后一个实参，它可以放到括号的外边（lambda表达式可以有多个实参）

```kotlin
persons.maxBy() { p: Person0 -> p.age }
```

3. 去掉括号`()`<br>当**lambda表达式**是函数唯一的实参时，还可以去掉调用代码中的空括号对（lambda表达式可以有多个实参）

```kotlin
persons.maxBy { p: Person0 -> p.age }
```

4. 如果你想传递两个或者更多的lambda表达式，只能有一个lambda表达式可以放到外面，这时使用常规语法来传递它们通常是最好选择

```kotlin
// var joinToString = persons.joinToString(separator = " ", transform = { p: Person0 -> p.name }) // 命名实参方式
var joinToString = persons.joinToString(separator = " ") { p: Person0 -> p.name } // 等价
```

5. 省略lambda参数类型<br>和局部变量一样，如果lambda参数的类型可以被推导出来，你就不需要显式地指定它

```kotlin
persons.maxBy { p -> p.age }
```

可以指定部分实参的类型，而剩下的实参只用名称。

6. 使用默认参数名称<br>如果当前上下文期望的只有一个参数的lambda表达式，且这个参数的类型可以推断出来，就会生成这个名称`it`

```kotlin
persons.maxBy { it.age }
```

`it`是自动生成的参数名称，仅在实参名称没有显式地指定时这个默认的名称才会生成；不要滥用它

7. 变量存储lambda<br>如果你用变量存储lambda，那么就没有可以推断出参数类型的上下文，所以你必须显式地指定参数类型

```kotlin
val getAge = { p: Person0 -> p.age }
```

8. 复杂的lambda表达式<br>包含多个语句的lambda表达式

```kotlin
val sum2 = {
    x: Int, y: Int ->
    println("Computing the sum of $x and $y:")
    x + y
}
println(sum2(1, 2))
```

`->`后面的函数体，不要用`{}`包围了

### lambda中访问变量

1. 在lambda表达式中使用函数的参数和定义的局部变量<br>在函数内声明一个匿名内部类时，这个匿名内部类可以引用函数的参数和局部变量，lambda表达式也可以访问函数的参数和局部变量

```kotlin
fun printMsgPrefix(msgs: Collection<String>, prefix: String) {
    msgs.forEach {
        println("$prefix -> $it")
    }
}
// call
val msgs = listOf("403 forbidden", "404 not found", "500 server error")
printMsgPrefix(msgs, "Error: ")
```

2. lambda捕捉<br>lambda捕捉：从lambda内访问外部变量，我们称这些变量被lambda捕捉。

```kotlin
var clientErrors = 0;
var serverErrors = 0;
fun printProblemsCounts(responses: Collection<String>) {
    var clientErrors = 0
    var serverErrors = 0
    responses.forEach {
        if (it.startsWith('4')) {
            clientErrors++
        } else if (it.startsWith('5')) {
            serverErrors++
        }
    }
    println("$clientErrors client errors , $serverErrors server errors")
}
// call
val msgs = listOf("403 forbidden", "404 not found", "500 server error")
printProblemsCounts(msgs)
```

默认情况下，局部变量的生命周期被限制在声明这个变量的函数中，但是如果它被lambda捕捉了，使用这个变量的代码可以被存储并稍后再执行。<br>捕捉可变变量实现细节：当你捕捉了一个可变变量(var)时，它的值被作为Ref类的一个实例被存储下来，Ref变量是final的能轻易地被捕捉，然而实际值被存储在其字段中，并且可以在lambda内修改

3. 成员引用<br>kotlin和java8一样，如果把函数转换为一个值，用`::成员函数名`运算符来转换

```kotlin
val getAge = Person0::age
// 等同
val getAge = { person: Person -> person.age }
```

这种表达式称为**成员引用**，来创建一个调用单个方法或访问单个属性的函数值。双冒号把类名称与你要引用的成员（一个方法或者一个属性）名称隔开，语法

```
类::成员(一个方法或一个属性)
```

不管你引用的是函数还是属性，都不要在成员引用的名称后面加括号。<br>还可以引用顶层函数

```kotlin
fun salute() = println("salute!")
run(::salute)
```

## Java的函数式接口

函数式接口：也叫**SAM接口**，SAM表示单抽象方法，一个**接口只有一个抽象方法**，<br>SAM构造方法<br>对同一个对象执行多次操作，而不需要反复把对象名写出来，库函数with可以实现

- with()<br>两个参数，把它第一个参数转换成作为第二个参数传给它的lambda的接收者，可以显示的通过this引用来访问这个接收者，也可以省略this，不用任何限定符直接访问这个值的方法和属性
- apply()<br>和with几乎一模一样，唯一的区别是apply始终会返回作为实参传递给它的对象

带接收者的lambda

# Kotlin官方提供的lambda函数

## filter和map

### filter

过滤，从集合中移除你不想要的元素，但是并不会改变这些元素

```kotlin
val list = listOf(1, 2, 4, 5)
println(list.filter { it % 2 == 0 })
```

### map

map是对集合中的每一个元素应用给定的函数并把结果收集到一个新集合

```kotlin
var map = list.map { it * it }
println(map)

var persons = listOf(Person0("hacket", 26), Person0("hacketzeng", 25), Person0("xiaohu", 27))
println(persons.map { it.name })
println(persons.map(Person0::name))
println(persons.filter { it.age > 25 }.map { it.name })
```

filterKeys,mapKeys 过滤和变换map的key<br>filterValues,mapValues 过滤和变换map的value

```kotlin
val numbers = mapOf(0 to "zero", 1 to "one")
println(numbers.mapKeys { it.key+1 })
println(numbers.mapValues { it.value.toUpperCase() })
```

## all/any/count/find/groupBy/flatMap/flatten

all：对所有元素都满足判断式<br>any：检查集合中是否至少存在一个匹配的元素<br>count：多少个元素满足了判断式<br>find：找到一个满足判断式的元素（有多个匹配，就返回匹配的第一个元素；返回null一个也没有匹配）<br>firstOrNull()：和find()函数一样

```
val canBeInClub27 = { p: Person0 -> p.age <= 27 }
var persons = listOf(Person0("hacket", 36), Person0("hacketzeng", 25), Person0("xiaohu", 27 + 1))
println(persons.all(canBeInClub27)) // false
println(persons.any(canBeInClub27)) // true
println(persons.count(canBeInClub27))  // 1
```

groupBy：分组，返回的结果是map，key为元素分组依据的键，value为元素

```kotlin
println(persons.groupBy { it.age })
```

flatMap：做了两件事，首先根据作为实参给定的函数对集合中的每个元素做变换（映射），然后把多个列表合并（平铺）成一个列表。

```kotlin
val strings = listOf("abc", "def", "xyz")
println(strings.map { it.toList() }) // [[a, b, c], [d, e, f], [x, y, z]]
println(strings.flatMap { it.toList() }) // [a, b, c, d, e, f, x, y, z]
```

flatten：如果你不需要做任何变换，只是需要平铺一个集合，可以用flatten函数

## Sequence 序列（懒惰集合）

下面这个，filter和map都返回一个列表，那就是会创建两个列表。

```kotlin
println(persons.filter { it.age > 25 }.map { it.name })
```

为了提升效率，可以把操作变成使用序列，而不是直接使用集合

```kotlin
persons.asSequence()
        .filter { it.age > 25 }
        .map { it.name }
```

kotlin中的懒惰集合操作的入口就是`Sequence`接口，这个接口表示的就是一个可以逐个列举元素的元素序列。Sequence只提供了一个方法，iterator()，用来从序列中获取值。它不需要创建额外的集合来保存过程中产生的中间结果。

```kotlin
sequence
    .map{ ... }
    .filter{ ... } // 到这里上面都是中间操作
    .toList() // 这里是末端操作
```

- 序列操作之中间操作<br>一次中间操作返回的是另一个序列，这个新序列知道如何变换原始序列中的元素
- 序列操作之末端操作<br>一次末端操作返回的是一个结果，这个结果可能是集合、元素、数字或者其他从初始集合的变换序列中获取的任意对象

下面这段代码不会在控制台输出任何内容，因为map和filter被延期了，他们只有在获取结果的时候才会被应用（末端操作才会被调用）

```kotlin
listOf(1, 2, 3, 4)
        .asSequence()
        .map { print("map($it) "); it * it }
        .filter { print("filter($it)"); it % 2 == 0 }
```

加上toList()执行末端操作才会输出日志

- 集合上的执行操作顺序也会影响性能<br>不同的顺序，会减少不必要的操作
- 序列中java8中的流概念类似
- 创建序列<br>asSequence()<br>generateSequence()

## fold 累计

以IntArray为例

```kotlin
public inline fun <R> IntArray.fold(initial: R, operation: (acc: R, Int) -> R): R {
    var accumulator = initial
    for (element in this) accumulator = operation(accumulator, element)
    return accumulator
}
```

- initial为初始值
- operation为每次循环操作的block

从初始值initial开始累积，循环遍历，每次计算的结果作为acc参与下一次计算，累积最终结果返回<br>案例：

```kotlin
fun fold() {
    val arr = intArrayOf(1, 2, 4, 6, 1)
    val fold = arr.fold(1) { acc, i -> acc + i } // 前一个结果相加
    println(fold) // 1+1+2+4+6+1 = 15
    
    val fold2 = arr.fold(2) { temp, i ->
        temp * i
    }
    println(fold2) // 2*1*2*4*6*1 = 96

    // 将集合拼接成字符串
    println((0..6).fold(StringBuilder()) { acc, i ->
        acc.append(i).append(",") // 0,1,2,3,4,5,6,
    })
}
```

结果：

```
15
96
0,1,2,3,4,5,6,
```

## apply let also run等扩展作用域函数

| 函数名   | 定义inline的结构                                                            | 函数体内使用的对象      | 返回值     | 是否是扩展函数 | 适用场景                                                                                                                                 |
| ----- | ---------------------------------------------------------------------- | -------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| let   | `fun <T, R> T.let(block: (T) -> R): R = block(this)`                   | it指代当前对象       | 闭包的返回结果 | 是       | 适用于处理不为null的操作场景                                                                                                                     |
| with  | `fun <T, R> with(receiver: T, block: T.() -> R): R = receiver.block()` | this指代当前对象或者省略 | 闭包的返回结果 | 否       | 适用于调用同一个类的多个方法时，可以省去类名重复，直接调用类的方法即可                                                                                                  |
| run   | `fun <T, R> T.run(block: T.() -> R): R = block()`                      | this指代当前对象或者省略 | 闭包的返回结果 | 是       | 适用于let,with函数任何场景。                                                                                                                   |
| also  | `fun T.also(block: (T) -> Unit): T { block(this); return this }`       | it指代当前对象       | 返回this  | 是       | 适用于let函数的任何场景，一般可用于多个扩展函数链式调用                                                                                                        |
| apply | `fun T.apply(block: T.() -> Unit): T { block(); return this }`         | this指代当前对象或者省略 | 返回this  | 是       | `1、适用于run函数的任何场景，一般用于初始化一个对象实例的时候，操作对象属性，并最终返回这个对象。2、动态inflate出一个XML的View的时候需要给View绑定数据也会用到 3、一般可用于多个扩展函数链式调用 4、数据model多层级包裹判空处理的问题` |

- apply和also返回上下文对象
- let、run 和with返回 lambda 结果
- let、also引用对象是it ，其余是this
- apply和also也非常相似，文档给出的建议是如果是对象配置操作使用apply，额外的处理使用also

```kotlin
val numberList = mutableListOf<Double>()
numberList.also { println("Populating the list") }
    .apply {
        add(2.71)
        add(3.14)
        add(1.0)
    }
    .also { println("Sorting the list") }
    .sort()
```

### apply

> apply适用于构建对象后紧接着还需要调用该对象的若干方法进行设置并最终返回这个对象实例

1. object.apply()接收一个带接收者的lambda作为参数，将lambda应用于对象，带接收者的lambda的函数体除了能访问其所在类的成员外，还能访问接收者的所有非私有成员
2. 对object操作后返回object对象本身(返回值是对象本身)

源码：

```kotlin
public inline fun <T> T.apply(block: T.() -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    block()
    return this
}
```

案例1：

```kotlin
val block = { user: User ->
    user.name = user.name.toUpperCase()
    user.age = user.age + 10
}
val u1 =  User("hacket", 123).apply(block)
println(u1)

// 上面的black等同
val u2 = User("hacket", 123).apply {
    this.name = this.name.toUpperCase()
    this.age = this.age + 10
}
println(u2)
```

案例2：

```kotlin
val span = 300
AnimatorSet().apply {
    playTogether(
            ObjectAnimator.ofPropertyValuesHolder(
                    tvTitle,
                    PropertyValuesHolder.ofFloat("alpha", 0f, 1.0f),
                    PropertyValuesHolder.ofFloat("translationY", 0f, 100f)).apply {
                interpolator = AccelerateInterpolator()
                duration = span
            },
            ObjectAnimator.ofPropertyValuesHolder(
                    ivAvatar,
                    PropertyValuesHolder.ofFloat("alpha", 1.0f, 0f),
                    PropertyValuesHolder.ofFloat("translationY", 0f,100f)).apply {
                interpolator = AccelerateInterpolator()
                duration = span
            }
    )
    start()
}
```

### let

#### 和apply区别

#### let()和apply()非常像，但因为下面的两个区别：

1. let接收一个普通的lambda作为参数；而apply需要一个带接收者的lambda，接收者为对象本身
2. let将lambda的值作为返回值；而apply返回对象本身
3. apply通常用于构建新对象，let用于既有对象

#### let用途

1. 在函数体内使用it替代对象去访问其公有的属性和方法

```kotlin
object.let{
   it.todo()//在函数体内使用it替代object对象去访问其公有的属性和方法
   ...
}
```

2. 使用let函数一般和`?.`处理需要针对一个可null的对象统一做判空处理；表示object不为null的条件下，才会去执行let函数体

```kotlin
//另一种用途 判断object为null的操作
object?.let{//表示object不为null的条件下，才会去执行let函数体
   it.todo()
}
```

3. let嵌套时，显示指明lambda参数名避免it歧义
4. 也可以作为变换函数使用，类似RxJava中的map操作符

#### 源码分析

```kotlin
public inline fun <T, R> T.let(block: (T) -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block(this)
}
```

### also

also()几乎和let()相同，唯一的却别是它会返回调用者本身而不是将 lambda 的值作为返回值。<br>和同样返回调用者本身的apply()相比：

1. 就传参而言，apply()传入的是带接收者的lambda，而also()传入的是普通 lambda。所以在 lambda 函数体中前者通过this引用调用者，后者通过it引用调用者(如果不定义参数名字，默认为it)
2. apply()更多用于构建新对象并执行一顿操作，而also()更多用于对既有对象追加一顿操作。

```kotlin
public inline fun <T> T.also(block: (T) -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    block(this)
    return this
}
```

### with

> 可用于省略对象调用名称书写

格式

```kotlin
with(object){
   // todo
 }
```

with函数和前面的几个函数使用方式略有不同，因为它不是以扩展的形式存在的。它是将某对象作为函数的参数，在函数块内可以通过 this 指代该对象。返回值为函数块的最后一行或指定return表达式。

1. 接收者对象，接收者lambda
2. 返回lambda结果

```kotlin
public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return receiver.block()
}
```

#### with适用场景

适用于调用同一个类的多个方法时，可以省去类名重复，直接调用类的方法即可，经常用于Android中RecyclerView中onBinderViewHolder中，数据model的属性映射到UI上

```kotlin
override fun onBindViewHolder(holder: ViewHolder, position: Int){
   val item = getItem(position)?: return
   with(item){
      holder.tvNewsTitle.text = StringUtils.trimToEmpty(titleEn)
	  holder.tvNewsSummary.text = StringUtils.trimToEmpty(summary)
	  holder.tvExtraInf.text = "难度：$gradeInfo | 单词数：$length | 读后感: $numReviews"
      // ...   
   }
}
```

### run

run函数使用的一般结构

```kotlin
object.run{
    // todo
}
```

run函数的inline+lambda结构

```kotlin
@kotlin.internal.InlineOnly
public inline fun <T, R> T.run(block: T.() -> R): R = block()
```

> run函数只接收一个lambda函数为参数，以闭包形式返回，返回值为最后一行的值或者指定的return的表达式。

## 作用域函数小结

1. with(T){}<br>with比较特殊，不是以扩展方法的形式存在，是一个顶级函数
2. run{}<br>返回闭包结果，与let不同，没有闭包参数，用this
3. let{}<br>返回闭包结果，与run不同，有闭包参数，参数为调用者
4. apply{}<br>不返回闭包结果，与also不同，没有闭包参数
5. also{}<br>不返回闭包结果，与apply不同，有闭包参数
6. takeIf<br>takeIf的闭包返回一个判断结果，为false时，takeIf函数会返回空
7. takeUnless<br>takeUnless与takeIf相反，为true时函数会返回空
8. repeat{}<br>重复执行当前闭包，可用于循环

# inline,noinline,crossline

1. inline: 声明在编译时，将函数的代码拷贝到调用的地方(内联)
2. noinline: 声明 inline 函数的形参中，不希望内联的 lambda
3. crossinline: 表明 inline 函数的形参中的 lambda 不能有 return

## 内联函数的特性

1. 内联函数中有函数类型的参数，那么该函数类型的参数默认也是内联的。除非，显示使用noinline进行修饰，那样该函数类型就不再是内联的。
2. 内联函数的优点是效率高、运行速度快。
3. 内联函数的缺点是编译器会生成比较多的代码，所以内联函数不要乱用。

## inline

Kotlin 的内联函数是使用inline修饰的函数，从编译器角度将函数的函数体复制到调用处实现内联。

### 没有lambda

定义一个sum函数计算两个数的和。

```kotlin
fun main(args: Array<String>) {
    println(sum(1, 2))
}
 
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

反编译为 Java 代码:

```java
public static final void main(@NotNull String[] args) {
   int var1 = sum(1, 2);
   System.out.println(var1);
}
 
public static final int sum(int a, int b) {
   return a + b;
}
```

> 在该调用的地方调用函数

然后为 sum 函数添加 inline 声明:

```kotlin
inline fun sum(a: Int, b: Int): Int {
    return a + b
}
```

再反编译为 Java 代码:

```java
public static final void main(@NotNull String[] args) {
   //...
   byte a$iv = 1;
   int b$iv = 2;
   int var4 = a$iv + b$iv;
   System.out.println(var4);
}
 
public static final int sum(int a, int b) {
   return a + b;
}
```

> sum 函数的实现代码被直接拷贝到了调用的地方。<br>上面两个使用实例并没有体现出 inline 的优势。当你的函数中有 lambda 形参时，inline 的优势才会体现。

### 带lambda

```kotlin
fun sum(a: Int, b: Int, lambda: (result: Int) -> Unit): Int {
    val r = a + b
    lambda.invoke(r)
    return r
}
 
fun main(args: Array<String>) {
    sum(1, 2) { println("Result is: $it") }
}
```

反编译为 Java:

```java
public static final int sum(int a, int b, @NotNull Function1 lambda) {
   //...
   int r = a + b;
   lambda.invoke(r);
   return r;
}
 
public static final void main(@NotNull String[] args) {
   //...
   sum(1, 2, (Function1)null.INSTANCE);
}
```

> (Function1）null.INSTANCE，是由于反编译器工具在找不到等效的Java类时的显示的结果。传递的那个 lambda 被转换为 Function1 类型，它是 Kotlin 函数（kotlin.jvm.functions包）的一部分，它以 1 结尾是因为我们在 lambda 函数中传递了一个参数（result：Int)。

如果循环调用sum()

```kotlin
fun main(args: Array<String>) {
    for (i in 0..10) {
        sum(1, 2) { println("Result is: $it") }
    }
}
```

在循环中调用 sum 函数，每次传递一个 lambda 打印结果。反编译为 Java:

```java
for(byte var2 = 10; var1 <= var2; ++var1) {
    sum(1, 2, (Function1)null.INSTANCE);
}
```

可见在每次循环里都会创建一个 Function1 的实例对象。这里就是性能的优化点所在，如何避免在循环里创建新的对象？

1. 在循环外部创建 lambda 对象

```kotlin
val l: (r: Int) -> Unit = { println(it) }
 
for (i in 0..10) {
    sum(1, 2, l)
}
```

反编译为 Java:

```java
Function1 l = (Function1)null.INSTANCE;
int var2 = 0;
 
for(byte var3 = 10; var2 <= var3; ++var2) {
    sum(1, 2, l);
}
```

2. 使用 inline

```kotlin
fun main(args: Array<String>) {
    for (i in 0..10) {
        sum(1, 2) { println("Result is: $it") }
    }
}
 
inline fun sum(a: Int, b: Int, lambda: (result: Int) -> Unit): Int {
    val r = a + b
    lambda.invoke(r)
    return r
}
```

反编译为 Java:

```java
public static final void main(@NotNull String[] args) {
   //...
   int var1 = 0;
 
  for(byte var2 = 10; var1 <= var2; ++var1) {
     byte a$iv = 1;
     int b$iv = 2;
     int r$iv = a$iv + b$iv;
     String var9 = "Result is: " + r$iv;
     System.out.println(var9);
  }
}
```

> lambda 代码在编译时被拷贝到调用的地方， 避免了创建 Function 对象。

### inline 注意事项

#### 不要内联超长方法

#### public inline 函数不能访问私有属性

```kotlin
class Demo(private val title: String) {

    inline fun test(l: () -> Unit) {
        println("Title: $title") // 编译错误: Public-Api inline function cannot access non-Public-Api prive final val title
    }

    // 私有的没问题
    private inline fun test2(l: () -> Unit) {
        println("Title: $title")
    }
}
```

#### 注意程序控制流

当使用 inline 时，如果传递给 inline 函数的 lambda，有 return 语句，那么会导致闭包的调用者也返回。

```kotlin
inline fun sum(a: Int, b: Int, lambda: (result: Int) -> Unit): Int {
    val r = a + b
    lambda.invoke(r)
    return r
}
 
fun main(args: Array<String>) {
    println("Start")
    sum(1, 2) {
        println("Result is: $it")
        return // 这个会导致 main 函数 return
    }
    println("Done")
}
```

反编译 Java:

```java
public static final void main(@NotNull String[] args) {
   String var1 = "Start";
   System.out.println(var1);
   byte a$iv = 1;
   int b$iv = 2;
   int r$iv = a$iv + b$iv;
   String var7 = "Result is: " + r$iv;
   System.out.println(var7);
}
```

可以使用 `return@label` 语法，返回到 lambda 被调用的地方。

```kotlin
fun main(args: Array<String>) {
    println("Start")
    sum(1, 2) {
        println("Result is: $it")
        return@sum
    }
    println("Done")
}
```

## noinline

当一个 inline 函数中，有多个 lambda 作为参数时，可以在不想内联的 lambda 前使用 `noinline` 声明.

```kotlin
inline fun sum(a: Int, b: Int, lambda: (result: Int) -> Unit, noinline lambda2: (result: Int) -> Unit): Int {
    val r = a + b
    lambda.invoke(r)
    lambda2.invoke(r)
    return r
}
 
fun main(args: Array<String>) {
    sum(1, 2,
            { println("Result is: $it") },
            { println("Invoke lambda2: $it") }
    )
}
```

反编译 Java:

```java
public static final int sum(int a, int b, @NotNull Function1 lambda, @NotNull Function1 lambda2) {
   int r = a + b;
   lambda.invoke(r);
   lambda2.invoke(r);
   return r;
}
 
public static final void main(@NotNull String[] args) {
   byte a$iv = 1;
   byte b$iv = 2;
   Function1 lambda2$iv = (Function1)null.INSTANCE;
   int r$iv = a$iv + b$iv;
   String var8 = "Result is: " + r$iv;
   System.out.println(var8);
   lambda2$iv.invoke(r$iv);
}
```

> 第一个 lambda 内联到了调用处，而第二个使用 noinline 声明的 lambda 没有。

## crossinline

声明一个 lambda 不能有 return 语句(可以有 return[@label ](/label) 语句)。这样可以避免使用 inline 时，lambda 中的 return 影响程序流程

```kotlin
inline fun sum(a: Int, b: Int, crossinline lambda: (result: Int) -> Unit): Int {
    val r = a + b
    lambda.invoke(r)
    return r
}
 
fun main(args: Array<String>) {
    sum(1, 2) {
        println("Result is: $it")
        return  // 编译错误: return is not allowed here
    }
}
```
