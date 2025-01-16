---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
---

# 面向对象基础

## 基本

用class来表示一个类<br>属性<br>行为

### 封装

函数前可加private，默认public，没有default

### 继承

子类继承父类用`:`<br>class要可以被继承，必须用open修饰，否则不能被继承；<br>class中的函数要可以被子类override，也必须用open修饰

```kotlin
open class Father {

    var character = "性格内向"

    open fun action() {
        println("父亲喜欢在公共场所大声说话")
    }
}

class Son : Father() {

    override fun action() {
        println("儿子不喜欢在公共场所大声说话")
    }
}
```

### 抽象类

和Java一样用`abstract`关键字修饰抽象类或抽象函数，复写的函数必须加`override`字

```kotlin
abstract class Human(name: String) {
    abstract fun eat()
}

class Woman(private var name: String) : Human(name) {
    override fun eat() {
        println("${name}女人小口吃饭")
    }
}

class Man(private var name: String) : Human(name) {
    override fun eat() {
        println("${name}男人大口吃饭")
    }
}
```

### 多态

## 类

Kotlin用`class`关键字定义

```kotlin
class Invoice {
}
```

### 1-1 类的定义

```kotlin
类名 类头部(指定类的类型参数,主构造器,等) {
    // 类主体
}
```

类的头部和主体都是可选的；没有类的主体部分，大括号也可以省略

```kotlin
class Empty
```

### 1-2 类的构造器

Kotlin中的类可以有一个**主构造器**，一个或多个**次构造器**

```kotlin
class Person constructor(firstName: String) {
}
```

**主构造器**<br>如果主构造器没有任何注解(annotation), 也没有任何可见度修饰符, 那么`constructor`关键字可以省略:

```kotlin
class Person(firstName: String) {
}
```

主构造器中不能包含任何代码. 初始化代码可以放在`初始化代码段 (initializer block)`中, 初始化代码段使用`init`关键字作为前缀。<br>在类的实例初始化过程中, 初始化代码段按照它们在类主体中出现的顺序执行, 初始化代码段之间还可以插入属性的初始化代码:

```kotlin
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    init {
        println("First initializer block that prints ${name}")
    }
    val secondProperty = "Second property: ${name.length}".also(::println)
    init {
        println("Second initializer block that prints ${name.length}")
    }
}
// 结果
First property: hacket
First initializer block that prints hacket
Second property: 6
Second initializer block that prints 6
```

注意, 主构造器的参数可以在初始化代码段中使用. 也可以在类主体定义的属性初始化代码中使用:

```kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

Kotlin 有一种简洁语法, 可以通过主构造器来定义属性并初始化属性值:

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int) { // ...
}
```

与通常的属性一样, 主构造器中定义的属性可以是可变的(var), 也可以是只读的(val)。<br>如果构造器有注解, 或者有可见度修饰符, 这时 constructor 关键字是必须的, 注解和修饰符要放在它之前:

```kotlin
class Customer public @Inject constructor(name: String) {
    // ...
}
```

**次级构造器(secondary constructor)**<br>类还可以声明 次级构造器 (secondary constructor), 使用 constructor 关键字作为前缀:

```kotlin
class Person { constructor(parent: Person) {
    parent.children.add(this) }
}
```

如果类有主构造器, 那么每个次级构造器都必须委托给主构造器, 要么直接委托, 要么通过其他次级构造器间接委托. 委托到同一个类的另 一个构造器时, 使用 this 关键字实现:

```kotlin
class Person(val name: String, val age: Int) {
    constructor(name: String) : this(name, 20)
}
```

注意, 初始化代码段中的代码实际上会成为主构造器的一部分. 对主构造器的委托调用, 会作为次级构造器的第一条语句来执行, 因此所有 初始化代码段中代码, 都会在次级构造器的函数体之前执行. 即使类没有定义主构造器, 也会隐含地委托调用主构造器, 因此初始化代码段 仍然会被执行:

```kotlin
class Constructors {
    init {
        println("Init block")
    }
    constructor(i: Int) {
        println("Constructor")
    }
}
// 结果
Init block
Constructor
```

如果一个非抽象类没有声明任何主构造器和次级构造器, 它将带有一个自动生成的, 无参数的主构造器. 这个构造器的可见度为 public. 如 果不希望你的类带有 public 的构造器, 你需要声明一个空的构造器, 并明确设置其可见度:

```kotlin
class DontCreateMe private constructor () {
}
```

**完整的类构造器示例**

```kotlin
/**
 * 1. @JvmOverloads 加了默认参数，需要加这个注解，才能给Java调用用的，JVM会重载，可省略
 * 2. @Anno 自定义注解，可以省略
 * 3. private 默认主构造器是public，可以省略
 * 4. constructor 主构造器，在没有修饰符和注解的情况下，可以省略
 * 5. (xxx) 主构造器参数，默认为val，val可以省略，var表示变量，可以用默认参数，也可以省略主构造器
 */
class Test @JvmOverloads @Anno private constructor(val name: String, var age: Int, var gender: Boolean = true)/*主构造器*/ {
    // 主构造器初始化函数，可以访问主构造器声明的参数
    init {
        age = 26
        println("这是主构造器初始化函数")
    }

    /**
     * 次构造器
     * 1. 必须直接或间接调用主构造器
     * 2. 可以定义默认参数
     */
    // 次构造器，直接并调用主构造器
    constructor(age: Int, gender: Boolean) : this("", age, gender) {
        println("次级构造器1")
    }
    // 次构造器，并调用次级构造器，间接调用主构造器
    constructor(age: Int) : this(age, true) {
        println("次级构造器2")
    }
}
annotation class Anno {
}
```

**定义多个构造器**

```kotlin
abstract class BaseMashiQuickAdapter<T, K : BaseViewHolder>(@LayoutRes layoutId: Int, data: List<T>?) : BaseQuickAdapter<T, K>(layoutId, data) {
    constructor(data: List<T>?) : this(0, data)
    constructor(@LayoutRes layoutId: Int) : this(layoutId, null)
}
```

### 1-3 创建类的实例

要创建一个类的实例, 我们需要调用类的构造器, 调用方式与使用通常的函数一样:

```kotlin
val invoice = Invoice()
val customer = Customer("Joe Smith")
```

> 注意, Kotlin 没有 new 关键字.

### 1-4 类成员

类成员包括：<br>1. 构造器和初始化代码<br>2. 函数<br>3. 属性<br>4. 嵌套类和内部类<br>5. 对象声明

### 类的构造方法

kotlin的构造方法区分了：**主构造方法**和**从构造方法**<br>主构造方法：主要而简洁的初始化类的方法，并且在类体外部声明<br>从构造方法：在类体内部声明

#### 主构造方法和初始化语句块

类被括号围起来的语句块就叫做主构造方法

```kotlin
// 方式1：定义了nickname成员属性和构造方法，并可以定义提供默认值的参数
class User(val nickname: String, val isSubscribed:Boolean = true)
// 方式2：
class User2 constructor(nick: String) { // 带一个参数的主构造方法
    val nick: String
    init { // 初始化语句块
        this.nick = nick
    }
}
// 方式3：
class User3(nick: String) { // 带一个参数的主构造方法
    val nick = nick; // 用参数来初始化属性
}
```

`constructor`关键字用来开始一个主构造方法或从构造方法的声明<br>`init`关键字用来引入一个**初始化语句块**，包含了在类被创建时执行的代码，并会与主构造方法一起使用，因为主构造方法有语法限制，不能包含初始化代码

> 方式1，在类体中用val关键字声明了属性，如果属性用相应的构造方法参数来初始化，代码中可以通过把val关键字加在参数前的方法来简化，这样可以替换类中的属性定义

你的类具有一个父类，主构造方法同样需要初始化父类

如果没有给一个类声明任何的构造方法，将会生成一个不做任何事情的默认构造方法；该类的子类必须显示地调用父类的构造方法，即使它没有任何的参数（实现接口就不需要加括号）：

```kotlin
open class Button2
class RadioButton : Button2()
```

定义一个私有的构造方法

```kotlin
class Secretive private constructor() { // private的构造方法，见伴生类
}
```

#### 其他方式初始化父类

用`constructor`关键字定义从构造方法

```kotlin
class Context
class AttributeSet
open class View { // 没有主构造方法
    constructor(ctx: Context) { // 从构造方法1
    }
    constructor(ctx: Context, attr: AttributeSet) { // 从构造方法2
    }
}
class MyButton : View {
    constructor(ctx: Context) : super(ctx) { // 调用父类构造方法1
    }
    constructor(ctx: Context, attr: AttributeSet) : super(ctx, attr) { // 调用父类构造方法2
    }
}
```

#### 构造器总结

1. Kotlin中的类可以有一个主构造器，一个或多个次构造器
2. 构造器声明用constructor关键字声明
3. 主构造器函数的入参在类名后面声明，函数体位于init函数，主构造器只能有一个
4. 次构造器可以有多个，从属于主构造器，必须先调用主构造器函数
5. 主构造器init优先于次构造器函数直接
6. 带有默认参数的构造器，Java调用不了，需要在构造器前面加上`@JvmOverloads`注解，告知编译器这个类是给Java重载用的
7. 构造器上面的参数用var和val声明的表示生成对应成员变量/常量并赋值

**完整的类的构造器**

```kotlin
/**
 * 1. @JvmOverloads 加了默认参数，需要加这个注解，才能给Java调用用的，JVM会重载，可省略
 * 2. @Anno 自定义注解，可以省略
 * 3. private 默认主构造器是public，可以省略
 * 4. constructor 主构造器，在没有修饰符和注解的情况下，可以省略
 * 5. (xxx) 主构造器参数，默认为val，val可以省略，var表示变量，可以用默认参数，也可以省略主构造器
 */
class Test @JvmOverloads @Anno private constructor(val name: String, var age: Int, var gender: Boolean = true)/*主构造器*/ {
    // 主构造器初始化函数，可以访问主构造器声明的参数
    init {
        age = 26
        println("这是主构造器初始化函数")
    }

    /**
     * 次构造器
     * 1. 必须直接或间接调用主构造器
     * 2. 可以定义默认参数
     */
    // 次构造器，直接并调用主构造器
    constructor(age: Int, gender: Boolean) : this("", age, gender) {
        println("次级构造器1")
    }
    // 次构造器，并调用次级构造器，间接调用主构造器
    constructor(age: Int) : this(age, true) {
        println("次级构造器2")
    }
}
annotation class Anno {
}
```

#### 定义多个构造器

```kotlin
abstract class BaseMashiQuickAdapter<T, K : BaseViewHolder>(@LayoutRes layoutId: Int, data: List<T>?) : BaseQuickAdapter<T, K>(layoutId, data) {

    constructor(data: List<T>?) : this(0, data)
    constructor(@LayoutRes layoutId: Int) : this(layoutId, null)
}
```

### 类成员

#### 类的成员属性（变量/常量）

##### 类变量/常量

类成员声明，在构造器中加上var或者val，就会对应生成成员变量/常量，并赋值

```kotlin
class Animal(var name: String, val sex: Int = 0) {
 
}
```

Kotlin成员和Java成员相比精简：

1. 冗余的同名属性声明语句
2. 冗余的同名属性赋值语句
3. 冗余的属性getter/setter方法

类的非空成员属性必须在声明时赋值或者在构造函数中赋值

```kotlin
class Animal(var name: String, val sex: Int = 0) {
    var sexName: String
    init {
        sexName = if (sex == 0) "公" else "母"
    }
}
```

##### 通过getter和setter访问支持字段

1. 存储值的属性
2. 具有自定义访问器在每次访问时计算值的属性

###### 变量getter / setter

```kotlin
class User4(val name: String) {
    var address: String = "unspecified"
        set(value: String) {
            println("""
                Address was changed for $name:
                "$field" -> "$value".
            """.trimIndent())
            field = value
        }
}
```

address属性了，重定义了setter函数，getter函数是默认的，只返回字段的值。

```kotlin
open class Test {

    var allByDefault: Int? = null// 错误：需要显式初始化器，隐含默认 getter 和 setter

    // 变量getter
    open var str: String? = null
        get() = "a get $field"
        
    val createTime: String
        get() {
            return "fff"
        }

    // 变量setter
    var address: String? = null
        set(value) {
            println(
                """
                Address was changed for $value:
                "$field" -> "$value".
            """.trimIndent()
            )
            field = value
        }

    // 变量setter private
    var str3: String = "a"
        private set
        
    var stringRepresentation: String = ""
        get() = this.toString()
        set(value) {
            field = "aa$value" // 解析字符串并赋值给其他属性
        }
}
```

##### 常量getter

```kotlin
// 常量getter
open val str2: String = "a"
    get() {
        return field + "1"
    }
```

##### 修改访问器的可见性

访问器的可见性默认和属性的可见性相同，如果需要可以通过在get和set关键字前面放置可见性修饰符的方式修改它：

```kotlin
class LengthCounter {
    var counter: Int = 0 // 这个属性是public的，但对外不可修改
        private set // 不能在外部修改这个属性，setter为private的，getter默认是public
    fun addWord(word: String) {
        counter += word.length
    }
}
```

##### back field

见`Kotlin面向对象→Kotlin属性和字段`

#### 类的成员方法

和普通的方法没什么区别

#### 伴生对象（静态方法）

类似于Java中的static静态成员，用`companion object`关键字声明；<br>伴生对象，在类加载时就运行伴生对象的代码块，作用等同于Java中的`static{}`代码块

```kotlin
class Animal(var name: String, val sex: Int = 0) {
    var sexName: String
    init {
        sexName = if (sex == 0) "公" else "母"
    }
    // companion表示伴随，object表示对象，WildAnimal表示伴生对象的名称，可以省略
    companion object WildAnimal{
        fun judgeSex(sexName: String): Int {
            var sex: Int = when (sexName) {
                "公" -> 0
                "母" -> 1
                else -> -1
            }
            return sex
        }
    }
}
// 调用
var judgeSex = Animal.judgeSex("公") // 省略伴生对象的名称
println(judgeSex)
var judgeSex1 = Animal.WildAnimal.judgeSex("母") // 带上伴生对象的名称
println(judgeSex1)
```

#### 静态属性

在伴生对象里定义常量

```kotlin
companion object WildAnimal {
    const val MALE = 0
    const val FEMALE = 1
    const val UNKNOWN = -1
    fun judgeSex(sexName: String): Int {
        var sex: Int = when (sexName) {
            "公" -> MALE
            "母" -> FEMALE
            else -> UNKNOWN
        }
        return sex
    }
}
// 调用
var female = Animal.WildAnimal.FEMALE
var female1 = Animal.FEMALE
var male = Animal.MALE
```

### Kotlin中this表达式

为了表示当前函数的接收者（Receiver），可以使用`this`表达式。

1. 在类的成员函数中，this指向这个类的当前对象实例
2. 在扩展函数中，或带接收者的函数字面值（function literal）中，this代表调用函数时，在点号左侧传递的接收者参数

如果this没有限定符，那么它指向包含当前代码的最内层范围。如果要指向其他范围内的this，需要使用**标签限定符**。

为了访问更外层范围（类、扩展函数、有标签的带接收者的函数字面值）内的this，用`this@Label`，`@Label`是一个标签，代表我们想要访问的this所属范围。

```kotlin
fun main(args: Array<String>) {

    var b = A().B()
    b.testFoo()
}

class A { // 隐含的标签 @A
    inner class B { // 隐含的标签 @
        fun testFoo() { // 隐含的标签 @foo
            var i = 110
            i.foo()
        }

        fun Int.foo() {
            val a = this@A // 指向A的this
            println("a:$a") // a:me.hacket.kotlin.basic.A@24d46ca6
            val b = this@B // 指向B的this
            println("b:$b") // b:me.hacket.kotlin.basic.A$B@4517d9a3

            val c = this // 指向foo()函数的接收者，一个Int值
            println("c:$c") // c:110  指向110
            val c1 = this@foo // 指向foo()函数的接收者，一个Int值
            println("c1:$c1") // c1:110  指向110

            val funList = lambda@ fun String.() {
                val d = this // 指向funList的接收者
                println("funList:$d")
            }
            val funList2 = { s: String ->
                val d2 = this // 指向函数foo()的接收者，因为包含当前代码的lambda表达式没有接收者
                println("funList2:$d2,$s")
            }
        }

    }
}
```

## Kotlin中的类、接口

### kotlin和java中的类和接口的区别

1. kotlin中的接口可以包含属性声明
2. kotlin的声明默认是`final`和`public`的，不可继承的
3. 嵌套的类默认并不是内部类，它们并没有包含对其外部类的隐式引用
4. 继承用`:`
5. 创建对象不需要new
6. 没有构造函数，用init替代

### 类

1. java中的类和方法默认都是open的，kotlin中默认都是final的；允许创建子类，用`open`关键字标示这个类，方法和属性也需要添加`open`关键字；重写了的成员默认open的，可以用final显示地禁止子类复写

```kotlin
open class Button : Clickable, Focusable {
    override fun click() {
        println("i was clicked")
    }
    final override fun showOff() {
        super<Clickable>.showOff()
        super<Focusable>.showOff()
    }
}
class ImageButton : Button() {
    override fun click() {
        super.click()
    }
}
```

2. kotlin中和java一样，用`abstract`关键字声明抽象，抽象成员默认是open的，非抽象成员默认是final的

```kotlin
abstract class Animated {
    abstract fun animate()
    open fun stopAnimating() {
    }
    fun animateTwice() { // 该方法非抽象的，默认final，子类不能重写
    }
}
class MyAnimated : Animated() {
    override fun animate() {
    }
}
```

3. 可见性修饰符和java一样，使用`public`、`protected`和`private`，和java不同，kotlin默认的可见性为public；

| 修饰符        | 类成员    | 顶层声明   |
| ---------- | ------ | ------ |
| public（默认） | 所有地方可见 | 所有地方可见 |
| internal   | 模块中可见  | 模块中可见  |
| protected  | 子类中可见  | -      |
| private    | 类中可见   | 文件中可见  |

类的基本类型和类型参数列表中用到的所有类，或者函数的签名都有与这个类或者函数本身相同的可见性

```kotlin
internal open class TalkativeButton : Focusable {
    private fun yell() = println("Hey!")
    protected fun whisper() = println("Let's talk!")
}
fun TalkativeButton.giveSpeech() { // 编译报错，public访问不到internal的class
    yell() // 编译报错，访问不到private的yell
    whisper() // 编译报错，访问不到protected的whisper
}
```

解决上述问题，可以把giveSpeech()函数修饰符改为internal，或者把yell()或whisper()函数改为internal

> kotlin只是把包作为在命名空间里组织代码的一种方式使用，并没有将其作为可见性控制；protected在kotlin中只能在类和子类中可见；类的扩展函数不能访问它的private和protected成员

4、kotlin中内部类默认不包含外部类的引用。默认没有显示修饰符的嵌套类与java中的static嵌套类一样的，如果要它变成一个持有外部类引用的内部类，需要使用`inner`修饰符。<br>在kotlin中引用外部类实例和java也不同，用`this@Outer`从Inner类去访问Outer类

```kotlin
class Outer {
    inner class Inner {
        fun getOuterReference(): Outer = this@Outer
    }
}
```

5、密封类：定义受限的类继承结构<br>`sealed`类，为父类添加一个sealed修饰符，对可能创建的子类做出严格的限制，所有直接子类必须嵌套在父类中；sealed修饰符隐含的这个类是一个open类。

```kotlin
sealed class Expr {
    class Num(val value: Int) : Expr()
    class Sum(val left: Expr, val right: Expr) : Expr()
}
fun eval(e: Expr): Int =
        when (e) { // 在when表达式处理所有的sealed类的子类，就不再需要else默认分支了
            is Expr.Num -> e.value
            is Expr.Sum -> eval(e.left) + eval(e.right)
        }
```

#### 类继承

Kotlin 中所有的类都有一个共同的父类 - Any，对于没有声明父类，那么Any 就是默认父类。Any 不是 java.lang.Object，特别的是，它除了 equals()、hashCode() 和 toString() 之外，没有任何其他成员。<br>继承用冒号替代Java的extends<br>默认情况下，Kotlin 中所有的类都是 final，正好符合 Effective Java 的第 17 条：要么为继承而设计，并提供文档说明，要么就禁止继承。用`open`关键字修饰的可以被继承<br>如果有主构造器，子类继承时需要指定父类主构造器；没有主构造器，每个次要构造器必须使用super来初始化基类，或者调用另一个实现了这个要求的构造器。<br>子类继承父类后，父类已经声明的属性，在子类构造器中，不需要再用var和val声明了

#### Kotlin修饰符

| 修饰符       | 说明                                              |
| --------- | ----------------------------------------------- |
| public    | 对所有人开放，类、函数、变量不加修饰符，默认public                    |
| internal  | 只对本模块内部开放，对App来说，本模块指App自身                      |
| protected | 只对自己和子类开放                                       |
| private   | 只对自己开放，私有                                       |
| open      | 不能和private共存；类可以继承、函数和变量可以被复写；默认类不能继承、函数和变量不能复写 |

#### 方法复写

open修饰的方法，可以被子类复写<br>复写的方法必须带上override关键字修饰

#### 属性复写

和方法复写一样，每个声明的属性都可以被复写为自带初始化或者带有getter方法的属性<br>也可以用var属性来复写val属性，反过来不可以。（原因是，val属性本质上声明了一个getter方法，用var复写就等价于在继承的类中额外定义了一个setter方法）

#### 抽象属性

> 写代码会遇到这样的场景：类中包含了若干属性，其中有一些属性是构造类时必须的，通常会通过构造函数的参数将这些属性值传递进来。另一些属性虽然在构造时非必须但在稍后的时间点会用到它，通常会用set()函数来为这些属性赋值。<br>如果忘记调用 set() 会发生什么？程序会出错甚至崩溃，这很常见，特别是当别人使用你的类时，他并不知道除了构造对象之外还需要在另一个地方调用 set() 为某个属性赋值，虽然你可能已经把这个潜规则写在了注释里。

```kotlin
// 接口属性
interface 抽象属性 {
    abstract val name: String
    abstract var age: Int
}

// 放构造方法重写
class TestA(override val name: String) : 抽象属性 {
    override var age: kotlin.Int = 0
        get() = field+1
        set(value) {field = value+2}

    fun p() {
        print(name)
    }
}

// 放类成员
class TestA() : 抽象属性 {
    override val name: String = ""
    override var age: kotlin.Int = 0
        get() = field+1
        set(value) {field = value+2}

    fun p() {
        print(name)
    }
}
```

#### 类委托

kotlin中的类默认是final的，不可继承。<br>需要向一些没有扩展功能的类添加一些行为，常见的实现方式就是装饰器模式（会有很多样板代码）。<br>kotlin语言级别支持委托

```
class DelegatingCollection<T>(innerList: Collection<T> = ArrayList<T>()) : Collection<T> by innerList {
}
```

实现一个集合，它可以计算向它添加元素的尝试次数：

```
class CountingSet<T>(val innerSet: MutableCollection<T> = HashSet<T>()) : MutableCollection<T> by innerSet { // 将MutableCollection的实例委托给innerSet
    var objectsAdded = 0
    override fun add(element: T): Boolean { // 不使用委托，用自己的实现
        objectsAdded++
        return innerSet.add(element)
    }
    override fun addAll(elements: Collection<T>): Boolean {
        objectsAdded += elements.size
        return innerSet.addAll(elements)
    }
}
```

实现了add()和addAll()方法，剩下的方法全部委托给HashSet

#### object

定义一个类并同时创建一个实例（其实就是一个对象）

- 对象声明是定义单例的一种方式
- 伴生对象可以持有工厂方法和其他与这个类相关，但在调用时并不依赖类实例的方法，它们的成员可以通过类名类访问
- 对象表达式用来替代java的匿名内部类

##### 对象声明

kotlin对象声明：将类声明和该类的单一实例声明结合到了一起，用`object`声明。<br>对象声明，可以包含属性、方法和初始化语句块等，唯一不允许的是构造方法（主、从构造方法）；对象声明在定义的时候就立即创建了，不需要在代码的其他地方调用构造方法，所以为对象声明定义一个构造方法也是没有意义的；对象声明允许你使用对象名加`.`字符的方法调用方法和访问属性；对象声明也可以继承类和接口<br>例：忽略大小写比较文件路径的比较器

```
object CaseInsensitiveFileComparator : Comparator<File> {
    override fun compare(o1: File, o2: File): Int {
        return o1.path.compareTo(o2.path, ignoreCase = true)
    }
}
// 调用
println(CaseInsensitiveFileComparator.compare(File("/user"), File("/USEr"))) // 0
```

也可以在类中声明对象，这样的对象同样只有一个单一实例

> 在Java中使用kotlin对象，kotlin中的对象声明被编译成了通过静态字段来持有它的单一实例的类，这个实例始终是INSTANCE。

##### 伴生对象

伴生对象：是一个声明在类中的普通对象，它可以有名字，实现一个接口或者有扩展函数和属性。

1. kotlin中的类没有静态成员，java中的static关键字并不是kotlin语言的一部分。
2. kotlin依赖包级别函数（顶层函数）、对象声明；顶层函数不能访问类的privat成员
3. 如果需要一个可以在没有类实例的情况下调用但是需要访问类内部的函数，可以将其写成那个类中的对象声明的成员

在类中定义的对象可以用`companion`来定义，这样就可以直接通过容器类名称来访问这个对象方法和属性的能力，不再需要显示地指明对象的名称，有点java中的静态方法调用。

```kotlin
class A {
    companion object {
        fun bar() {
            println("companion object called")
        }
    }
}
// 调用
A.bar()
```

伴生对象可以访问类中的所有private成员，包括private构造方法，它是实现工厂模式的理想选择。<br>最开始的写法：从构造方法构造对象

```kotlin
class User10 {
    val nickname: String
    constructor(email: String) {
        nickname = email.substringBefore("@")
    }
    constructor(facebookAccountId: Int) {
        nickname = facebookAccountId.toString();
    }
}
```

伴生对象，工厂方法构造对象

```kotlin
class User11 private constructor(val nickname: String) {
    companion object {
        fun newUserFromEmail(email: String): User11 = User11(email.substringBefore("@"))

        fun newUserFromFBAccoutId(fbAccoutnId: Int): User11 = User11(fbAccoutnId.toString())
    }
}
// 调用
println(User11.newUserFromEmail("hacket@1.com").nickname)
println(User11.newUserFromFBAccoutId(10).nickname)
```

伴生对象方法，也可以返回容器类的子类<br>伴生对象在在类不能被重写<br>伴生对象可以有名字，Loader，调用可以Person.Loader.fromjson()或者Person.fromjson()

```kotlin
class Person(val name: String) {
    companion object Loader : JsonFactory<Person> {
        override fun fromJson(json: String): Person {
            return Person(json);
        }
    }
}
```

伴生对象实现接口<br>可以直接将包含它的类的名字当做实现了该接口的对象实例来使用<br>伴生对象扩展：伴生对象扩展函数，需要在类中声明一个空的伴生对象

```
// business login module
class Person2(val firstName: String, val lastName: String) {
    companion object {
    }
}

fun Person2.Companion.fromJson(json: String): Person2 {
    return Person2(json, json);
}
// 调用
Person2.fromJson(json)
```

##### 对象表达式

1. object不仅仅能用来声明单例式的对象，还能用来声明**匿名对象**；匿名对象替代了java中匿名内部类的用法
2. 可以去掉对象的名字，语法和对象声明相同。
3. 对象表达式声明了一个类并创建了该类的一个实例，但并没有给这个类或实例分配一个名字，一般也不需要名字，因为你会将这个对象用作一个函数调用的参数，也可以分配名字

```kotlin
val listener = object : MouseAdapter() { // 匿名对象的名字listener
    override fun mouseClicked(e: MouseEvent?) {
        super.mouseClicked(e)
    }
    override fun mouseEntered(e: MouseEvent?) {
        super.mouseEntered(e)
    }
}
```

4. java匿名内部类只能扩展一个类或实现一个接口，kotlin匿名对象可以实现多个接口或不实现接口
5. 和对象声明不同，匿名对象不是单例的，每次对象表达式被执行都会创建一个新的对象实例
6. 和java匿名类一样，对象表达式中的代码可以访问创建它的函数中的变量，和java不同，变量不用final，还可以在对象表达式中修改变量的值

#### 枚举类

#### 密封类

#### 数据类

### 接口

用interface关键字定义

#### kotlin中的接口

1. kotlin中的接口与java8中的相似，可以包含抽象方法的定义以及非抽象方法的实现（和java8中的默认方法类似），但它们不能包含任何状态
2. 使用`interface`声明kotlin接口
3. kotlin继承使用`:`替代java中的`extends`和`implements`关键字
4. 和java一样，一个类可以实现任意多个接口，但只能继承一个类
5. kotlin中用`override`关键字来标注被重写的父类或者接口的方法和属性，是强制使用的
6. kotlin中的接口方法可以有一个默认实现，和java8不同，java8需要你在这样的实现上标注`default`关键字，kotlin只需要提供一个方法体即可。
7. 如果一个类实现了两个接口中的同一个方法，该类需要重写这个方法，否则编译不过
8. 调用父接口的方法，java中是`Clickable.super.showOff()`，而kotlin中是放在super后的`<>`中

```kotlin
interface Focusable {
    fun showOff() = println("I am focusable!")
}
interface Clickable {
    fun click()
    // 默认实现
    fun showOff() = println("i am clickable!")
}
class Button : Clickable, Focusable {
    // 使用override重写父接口方法
    override fun click() {
        println("i was clicked")
    }
    // 不重写编译就会报错
    override fun showOff() {
        // 使用<>加上父类型名字的super表示你想要调用哪一个父类的方法
        super<Clickable>.showOff()
        super<Focusable>.showOff()
    }
}
fun main(args: Array<String>) {
    var button = Button()
    button.click()
    button.showOff()
}
```

#### 接口中属性

Kotlin的接口允许声明抽象属性，子类必须重载该属性<br>kotlin中接口可以包含抽象属性声明

```kotlin
interface IUser {
    val nickname: String
}
class PrivateUser(override val nickname: String) : IUser // 主构造方法属性直接复写
class SubscribingUser(val email: String) : IUser {
    override val nickname: String // 自定义getter，没有一个支持字段来存储它的值，通过getter得到的
        get() = email.substringBefore('@')
}
class FacebookUser(val accountId: Int) : IUser {
    override val nickname: String  // 属性初始化
        get() = getFackbookName(accountId)
    fun getFackbookName(accountId: Int): String {
        return accountId.toString()
    }
}


var privateUser = PrivateUser("hacket")
println(privateUser.nickname)
var subscribingUser = SubscribingUser("zengfansheng@163.com")
println(subscribingUser.nickname)
var facebookUser = FacebookUser(123)
println(facebookUser.nickname)
```

#### 接口代理 by

##### 类代理（Class Delegation）

```kotlin
interface Base {
    fun print()
}

class Derived(b: Base) : Base by b

class BaseImpl(val x: Int) : Base {
    override fun print() {
        print(x)
    }
}
// 调用
val b = BaseImpl(110)
Derived(b).print()
```

通过`by`关键字，将“b”实例存储到Derived对象中，编译器会生成“Base”接口的所有方法，使用“b”的实现。

# String字符串

## Kotlin空字符串判断

null字符串可以调用

- **isNullOrEmpty** 为空指针或者字符串长度为0返回true
- **isNullOrBlank** 为空指针或者字符串长度为0，字符串trim后长度为0返回true

只有非null才可以调用

- **isEmpty** 字符串长度为0返回true
- **isBlank** 字符串长度为0或者字符串trim后长度为0返回true
- **isNotEmpty** 字符串长度大于0返回true
- **isNotBlank** 字符串长度大于0并且字符串trim后长度大于0返回true

```kotlin
var s: String? = null
var nullOrEmpty = s.isNullOrEmpty()
println(nullOrEmpty) // true

s = "  "
var isNullOrBlank = s.isNullOrBlank()
println(isNullOrBlank) // true
```

## Kotlin字符串常用方法

### indexOf 查找子串

> 和Java类似，都是indexOf

### replace 替换子串

> 和Java类似，replace

### substring 截取指定位置的子串

> 和Java类似，substring

### split 按特定字符串分隔子串

> 和Java类似，split，kotlin分割后是返回的List

### 获取某个位置的字符串

kotlin更简单，kotlin允许直接通过下标访问字符串指定位置的字符，和操作数组一样

```kotlin
fun testSubstring() {
    var originStr = "31ff.fdaf.fff"
    var c = originStr[5].toString()
    println(c)
    var toString = originStr.get(5)
    println(toString)
}
```

## kotlin字符串模板

用`${占位符}`来占位

```kotlin
fun diaryTemp(placeName: String): String {
    var temp = "今天天气晴朗，我们去了${placeName}玩；映入眼帘的是${placeName}${placeName.length}个大字。";
    return temp;
}
```

单个转义用`\`，多个转义用`${'xxx'}`

```kotlin
fun testStringTemp() {
    var i = 2
    var s = "\$i"
    println(s)
    var g = "money is ${'$'}$i"
    println(g)
}
// 结果
$i
money is $2
```

## kotlin字符串比较

和java字符串比较不一样，kotlin中的字符串比较`==`和`equals()`方法作用是一样的，都是比较的字符串内容。<br>equals(other: String?, ignoreCase: Boolean = false) 两个参数的，第二个参数默认为false，表示是否忽略大小写比较。

```kotlin
fun main(args: Array<String>) {
    var str1:String = "张三";
    var str2 = "张三";

    println(str1 == str2) // true
    println(str1.equals(str2)); // true
    
    var str3 = "hacket";
    var str4 = "hacket";
    var str5 = "Hacket";
    var str6 = "hacKet";
    println(str3 == str4) // true
    println(str3.equals(str4)); // true
    println(str3.equals(str6,true)); // true
    println(str5.equals(str6,true)); // true
}
```

## kotlin之null值处理

kotlin的函数参数，默认都是不可为null，如果要允许null参数，在参数类型后加个?<br>参数不可为null

```kotlin
fun main(args: Array<String>) {

    var result1 = heat("水");
    println(result1);
    
    var result2 = heat(null); // Null can not be a value of a non-null type String
}

fun heat(str: String): String {
    return "热" + str;
}
```

参数可为null，参数后加?

```kotlin
fun main(args: Array<String>) {

    var result1 = heat("水");
    println(result1); // 热水
    
    var result2 = heat(null);
    println(result2); // 热null
}

fun heat(str: String?): String {
    return "热" + str;
}
```

## toXXX() 字符串和数字之间的转换

toXXX()方法

```kotlin
// 字符串转换成Int
var a = "13"
var aa = a.toInt()
println(aa)

// Int转换成String
var b = 13
var bb = b.toString()
println(bb)
```

## readLine()

```kotlin
fun main(args: Array<String>) {
    println("请输入第一个数字：")
    var num1Str = readLine(); // 可能为null

    println("请输入第二个数字：")
    var num2Str = readLine(); // 可能为null

    var num1 = num1Str!!.toInt()
    var num2 = num2Str!!.toInt()

    println("$num1+$num2=" + (num1 + num2))
}
```

## String有用的函数

### removePrefix 移除前缀

### removeSuffix 移除后缀

### removeSurrounding 移除前缀和后缀

### substringAfter 返回第一次出现分隔符后的字符串

```kotlin
fun main() {

    val data = "**hi dhl**"

// 移除前缀
    println(data.removePrefix("**")) //  hi dhl**
// 移除后缀
    println(data.removeSuffix("**")) //  **hi dhl
// 移除前缀和后缀
    println(data.removeSurrounding("**")) // hi dhl

    // 返回第一次出现分隔符后的字符串
    println(data.substringAfter("**")) // hi dhl**
    // 如果没有找到，返回原始字符串
    println(data.substringAfter("--")) // **hi dhl**
    // 如果没有找到，返回默认字符串 "no match"
    println(data.substringAfter("--","no match")) // no match
}
```

# object

## object declaration 对象声明

### 什么是Object Declaration?

1. 对象声明尽管和普通类的声明一样，可以包含属性、方法、初始化代码块以及可以继承其他类或者实现某个接口，但是它不能包含构造器（包括主构造器以及次级构造器）
2. Java中的饿汉式单例模式
3. object 声明不能放在函数中，但是可以放在其他object 声明中或者类声明中
4. 对象声明的类最终被编译成：一个类拥有一个静态成员来持有对自己的引用，并且这个静态成员的名称为INSTANCE，当然这个INSTANCE是单例的

```
object XXX {
    
}
```

### object声明

#### 简单的object声明

```kotlin
// Kt文件中的声明方式： object 关键字声明,其内部不允许声明构造方法
object SingleObject {
    fun test() {
        //...
    }
}
// 调用单例方法:
SingleObject.test()

// 编译成.class后
// Kotlin文件编译后的class代码如下：
public final class SingleObject {
   public static final SingleObject INSTANCE;

   public final void test() {
   }

   private SingleObject() {
      INSTANCE = (SingleObject)this;
   }

   static {
      new SingleObject();
   }
}
```

#### 继承自类或接口object声明

```kotlin
abstract class Machine {
    abstract fun start()
    open fun stop() {}//只有被open修饰过的方法才能被继承，否则默认是final类型的，不可被重写；
}
object MyMachine : Machine() {
    override fun start() {
        //...
    }
}
```

#### 类内部object声明

```kotlin
class Single {
    object Manage {
        //类内部的对象声明，没有被inner修饰的内部类都是静态的
        fun execute() {
            //...
        }
    }
}
```

## Companion Objects 伴生对象

在Kotlin中是没有static关键字的，也就是意味着没有了静态方法和静态成员。那么在kotlin中如果要想表示这种概念，取而代之的是`包级别函数（package-level function）`和我们这里提到的`伴生对象`。

1. 伴生对象是一个声明在类中的普通对象，它可以有名称 (默认为Companion) ，它可以实现一个接口或者有扩展函数或属性。
2. Companion Objects中定义的成员类似于Java中的静态成员，因为Kotlin中没有static成员
3. `companion object`关键字定义伴生对象
4. 会在当前类生成一个伴生对象对应的实例，默认叫`Companion`
5. 一个类的伴生对象只能有一个。仔细想想也很好理解，伴生对象的名称是可以省略的。如果允许对应多个伴生对象，那么我们在多个伴生对象中都定义了一模一样的函数，在调用时到底是使用哪个伴生对象的方法呢？就会产生歧义，这样就不难理解这条语法规定了。

```
companion object 伴生对象名(可以省略){
    //define method and field here
```

### 普通的伴生对象

```kotlin
class MyClass {
    companion object Factory {
        val url = ""
        fun create(): MyClass = MyClass()
    }
}
// 调用的时候，直接使用 类名.属性名 或 类名.方法名
MyClass.url
MyClass.create()
MyClass.Factory.create()
```

`companion object`的名字可以省略，可以使用`Companion`来指代

```kotlin
class MyClass {
    companion object {
        val url = ""
        fun create(): MyClass = MyClass()
    }
}
val c = MyClass.Companion.create()
```

### 伴生对象实现接口

虽然Companion object看起来像静态变量，但是在运行时是有创建Companion object实例的，比如可以实现接口。

```kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    // 伴生类中实现接口
    companion object : Factory<MyClass> {
        val url = ""
        // 实现接口的抽象方法
        override fun create(): MyClass = MyClass()
    }
}
fun <T> setFactory(factory: Factory<T>) {
    factory.create()
}
// 调用
fun testCompanionDemo() {
    MyClass.url
    MyClass.create()
    MyClass.Companion.create()

    // 这里传递进去的MyClass对象，其实就是MyClass的伴生对象
    setFactory(MyClass)
}
```

### 伴生对象扩展

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
// 伴生类的扩展，在方法中、文件内都可以定义
fun MyClass.Factory.fun_name(name: String) = { println("伴生对象扩展：$name") }
MyClass.fun_name("hacket")
// 等同于
fun MyClass.Factory.fun_name(name: String) { println("伴生对象扩展：$name") }
```

## Object Expression 对象表达式（替代Java中匿名内部类）

类似java的匿名内部类<br>对象表达式语法：

```kotlin
object [:接口1,接口2,类型1, 类型2] { }    // 中括号中的可省略
```

### 替代Java中匿名内部类的写法

````kotlin
var intent = Intent(applicationContext, HolderFragmentActivity结果页::class.java)
HolderLifeFragment
        .of()
        .startActFor(this, intent, object : HolderLifeFragment.OnActionResult {
            override fun onResult(data: Intent?, resultCode: Int) {
                var result = data?.getStringExtra("data")
                ToastUtils.showLong("${resultCode.toString()},$result")
            }
        })

fun startActFor(act: FragmentActivity, intent: Intent, onActionResult: OnActionResult?) {
    this.onActionResult = onActionResult
    bindAct(act)
    startActivityForResult(intent, 0)
}


如果父类的构造函数有参数，需要显示调用
```kotlin
open class A(x: Int) {
    public open val y: Int = x
}
interface B {...}
val ab: A = object : A(1), B {
    override val y = 15
}
````

如果不想继承任何父类，可以不写父类（应该是继承了Any）

```kotlin
val adHoc = object {
    var x: Int = 0
    var y: Int = 0
}
print(adHoc.x + adHoc.y)
```

object可以访问外围作用域的变量

```kotlin
fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // ...
}
```

### 匿名对象

匿名对象只有定义成局部变量和private成员变量时，才能体现它的真实类型。如果你是将匿名对象作为public函数的返回值或者是public属性时，你只能将它看做是它的父类，当然你不指定任何类型时就当做Any看待。这时，你在匿名对象中添加的属性和方法是不能够被访问的。<br>![](https://img-blog.csdn.net/20180313195045608?watermark/2/text/Ly9ibG9nLmNzZG4ubmV0L3hsaDExOTE4NjA5Mzk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70#id=BMPd5&originHeight=276&originWidth=1796&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```kotlin
class MyTest {
    private val foo = object {
        fun method() {
            println("private")
        }
    }
    val foo2 = object {
        fun method() {
            println("public")
        }
    }
    fun m() = object {
        fun method(){
            println("method")
        }
    }
    fun invoke(){
 
        val local = object {
            fun method(){
                println("local")
            }
        }
 
        local.method()  //编译通过
        foo.method()    //编译通过
        foo2.method()   //编译通不过
        m().method()    //编译通不过
    }
}
```

## object declaration、Companion object以及object expression的初始化

1. object declaration：对象声明；当第一次访问它时才初始化，是一种懒初始化对象声明
2. Companion object：伴生对象；当它对应的类被加载后，它才初始化，类似Java中的静态代码块伴生对象
3. object expression：对象表达式 ；一旦它被执行，立马初始化

## object与注解@JvmStatic

Kotlin 还可以为对象声明或伴生对象中定义的函数生成静态方法，如果你将这些函数标注为`@JvmStatic`的话。 如果你使用该注解，编译器既会在相应对象的类中生成静态方法，也会在对象自身中生成实例方法。<br>@JvmStatic注解也可以应用于对象声明或伴生对象的属性， 使其 getter 和 setter方法在该对象或包含该伴生对象的类中是静态成员。

### 伴生对象与@JvmStatic

可以使用@JvmStatic使Companion object的成员真正成为静态成员

```
class C {
    companion object {
        @JvmStatic
        fun foo() {
        }
        fun bar() {}
    }
}
// Java中调用
// foo() 在 Java 中是静态的，而 bar() 不是
public class Java与JvmStatic {
    public static void main(String[] args) {
        C.foo(); // 编译通过，foo()定义了@JvmStatic
//        C.bar() // 没有定义

        C.Companion.foo(); // 保留实例方法
        C.Companion.bar(); // 唯一的工作方式
    }
}
```

### 对象声明与@JvmStatic

```
object Obj {
    @JvmStatic
    fun foo() {
    }

    fun bar() {}
}
// Java调用
Obj.foo();
// Obj.bar() // 编译不过
Obj.INSTANCE.bar(); // 没问题，通过单例实例调用
Obj.INSTANCE.foo();
```

# 枚举类 enum class

## 枚举类的定义

用`enum class`关键字

```kotlin
enum class Week {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

fun main(args: Array<String>) {
    println(Week.Friday.name)
    println(Week.Friday.ordinal)
}
```

枚举类，类`Enum`的子类，有name和ordinal属性<br>枚举类还可以定义构造器，本质上还是一个类

```kotlin
enum class SeasonName( val seasonName: String) {
    SPRING("春天"),
    SUMMER("夏天"),
    AUTUMN("秋天"),
    WINTER("冬天");
}
```

## 枚举类的属性

1. name
2. ordinal
3. values 获取枚举类中所有的枚举值

# 密封类 sealed class

## Sealed class定义

1. 密封类，用`sealed class`关键字声明
2. 子类类型有限的class，且不能直接初始化，子类必须继承密封类
3. 更严格的枚举类，用于解决when枚举类时，else不知道枚举多个元素的问题

```kotlin
sealed class SonSealed {

    class Mule : SonSealed() // 骡子

    class Donkey : SonSealed() // 驴子

    fun sayHello() {
        println("hello!")
    }
}

fun main(args: Array<String>) {
    var son: SonSealed = SonSealed.Donkey()
    var son1: SonSealed = SonSealed.Mule()
    var son2: SonSealed = SonSealed.Donkey()

    var list = listOf<SonSealed>(son, son1, son2)
    for (v in list) {
        if (v is SonSealed.Donkey) {
            v.sayHello()
        }
    }
}
```

### sealed class和object

```kotlin
@Keep
sealed class Animal(val id: String, val name: String, @DrawableRes val icon: Int) {
    object Dog :
        Animal("dog", R.string.kitty_game_animal_dog.toStr(), R.drawable.ic_kitty_game_dog) // 狗🐶
    object Horse : Animal(
        "horse",
        R.string.kitty_game_animal_horse.toStr(),
        R.drawable.ic_kitty_game_horse
    ) // 马🐎
    object Sheep : Animal(
        "sheep",
        R.string.kitty_game_animal_sheep.toStr(),
        R.drawable.ic_kitty_game_sheep
    ) // 羊🐑

    object Snake : Animal(
        "snake",
        R.string.kitty_game_animal_snake.toStr(),
        R.drawable.ic_kitty_game_snake
    ) // 蛇🐍
    object Tiger : Animal(
        "tiger",
        R.string.kitty_game_animal_tiger.toStr(),
        R.drawable.ic_kitty_game_tiger
    ) // 老虎🐅
    object Unknown : Animal(
        "unknown",
        R.string.kitty_game_animal_unknown.toStr(),
        R.drawable.ic_kitty_game_tiger
    ) // 暂不支持的
}
```

### sealed class和Parcelable

sealed class不支持Parcelable，我们可以加在其子类上

```kotlin
@Keep
sealed class Animal(val id: String, val name: String, @DrawableRes val icon: Int) : Parcelable {
    @Parcelize
    object Dog :
        Animal("dog", R.string.kitty_game_animal_dog.toStr(), R.drawable.ic_kitty_game_dog) // 狗🐶

    @Parcelize
    object Horse : Animal(
        "horse",
        R.string.kitty_game_animal_horse.toStr(),
        R.drawable.ic_kitty_game_horse
    ) // 马🐎

    @Parcelize
    object Sheep : Animal(
        "sheep",
        R.string.kitty_game_animal_sheep.toStr(),
        R.drawable.ic_kitty_game_sheep
    ) // 羊🐑

    @Parcelize
    object Snake : Animal(
        "snake",
        R.string.kitty_game_animal_snake.toStr(),
        R.drawable.ic_kitty_game_snake
    ) // 蛇🐍

    @Parcelize
    object Tiger : Animal(
        "tiger",
        R.string.kitty_game_animal_tiger.toStr(),
        R.drawable.ic_kitty_game_tiger
    ) // 老虎🐅

    @Parcelize
    object Unknown : Animal(
        "unknown",
        R.string.kitty_game_animal_unknown.toStr(),
        R.drawable.ic_kitty_game_tiger
    ) // 暂不支持的
}
```

## sealed class和when配合

`sealed class` 和`when`，配合`BaseQuickAdapter`实现多布局

```kotlin
internal sealed class ReceiptItem(
        @LayoutRes val resId: Int = R.layout.room_gift_box_receipt_layout_item
) {
    data class AllInOnLineItem(
            val name: String = ResUtils.getStr(R.string.room_gift_panel_all_in_online),
            @DrawableRes val icon: Int = R.drawable.ic_gift_box_all_in_online
    ) : ReceiptItem()

    data class AllInSeatsItem(
            val name: String = ResUtils.getStr(R.string.room_gift_panel_all_in_seats),
            @DrawableRes val icon: Int = R.drawable.ic_gift_box_all_in_seats
    ) : ReceiptItem()

    data class NormalReceiptItem(val user: User) : ReceiptItem()
}


override fun convert(helper: BaseViewHolder?, item: ReceiptItem?) {
    when (item) {
        is ReceiptItem.AllInOnLineItem -> {
            helper?.setText(R.id.tv_gift_box_sender_name, item.name)
            val avatarView = helper?.getView<QbDraweeView>(R.id.iv_gift_box_sender_avatar)
            Phoenix.with(avatarView).load(item.icon)
        }
        is ReceiptItem.AllInSeatsItem -> {
            helper?.setText(R.id.tv_gift_box_sender_name, item.name)
            val avatarView = helper?.getView<QbDraweeView>(R.id.iv_gift_box_sender_avatar)
            Phoenix.with(avatarView).load(item.icon)
        }
        is ReceiptItem.NormalReceiptItem -> {
            helper?.setText(R.id.tv_gift_box_sender_name, item.user.name)
            val avatarView = helper?.getView<QbDraweeView>(R.id.iv_gift_box_sender_avatar)
            Phoenix.with(avatarView).load(item.user.avatar)
        }
    }
}
```

# 内部类和嵌套类

## 内部类 inner class

Kotlin中内部类可以访问外部类成员，用`inner class`声明

```kotlin
class Tree(var treeName: String) {

    // 嵌套类
    class Flower(var flowerName: String) {
        fun getName(): String {
            return "这是一朵${flowerName}"
        }
    }

    // 内部类
    inner class Fruit(var fruitName: String) {
        fun getName(): String {
            return "这是一朵${treeName}长出来的$fruitName"
        }
    }

}
```

## 嵌套类

Java内部类允许访问外部类的成员，而kotlin的嵌套类不允许访问外部类的成员；类似Java中的静态内部类

```kotlin
class Tree(var treeName: String) {

    class Flower(var flowerName: String) {
        fun getName(): String {
            return "这是一朵${flowerName}"
        }
    }
}
```

# 数据类 data class

数据类，kotlin中自动生成通用方法，不需要手动写前面的通用对象方法了。

- equals() 会检测所有的属性值是否相等
- hashCode() 返回一个根据所有属性生成的哈希值
- toString() 生成按声明顺序排列的所有字段的字符串表达形式

```kotlin
data class Client2(val name: String, val postalCode: Int)
```

- copy()方法，多生成了一个copy()方法，一个允许copy类实例的方法，并在copy的同时修改某些属性的值，只是一个副本，副本有着单独的生命周期不会影响代码中引用原始实例的位置，手动实现的copy方法

```kotlin
class Client2(val name: String, val postalCode: Int) {
    fun copy(name: String = this.name, postalCode: Int = this.postalCode) =
            Client(name, postalCode)
}
```

> 没有在主构造方法中声明的属性将不会加入到相等性检查和哈希值计算中

数据类定义

```kotlin
data class T {
    
}
```

## 数据类自动实现的功能

1. 自动声明与构造函数入参同名的属性字段
2. 自动实现每个属性字段的getter/setter方法
3. 自动提供equals方法，用于比较两个数据对象是否相等
4. 自动提供copy方法，允许完整复制某个数据对象，也可以在复制单独后修改某几个字段的值
5. 自动提供toString方法

## 数据类的约束条件

1. 数据类必须有主构造函数，且至少有一个输入函数（因为它的属性要跟输入参数一一对应，如果没有属性字段，这个数据类保存不了数据，也就没有意义了）
2. 主构造函数的输入参数前面必须加上var或者val，保证每个入参都会自动声明同名的属性字段
3. 数据类有自己的一套规则，只能是个独立的类，不能是其他的类，否则不同规则之间会产生冲突（不能是open类、abstract抽象类、inner内部类、sealed密封类）

```kotlin
data class Plant(var name: String, var stem: String, var leaf: String, var flower: String, var fruit: String, var seed: String = "") {
    init {
    }
}
```

## data class成员的解构

> 用idea工具，data class后输入var，会提示创建单一变量声明和解构声明(Create Destructuring declaration)

数据类成员解构，就是解除解构，将这些数据类对象中的属性提取出来，分别赋值给单个变量，就可以单独使用它们了。

Kotlin编译器会自动为数据类生成组件函数（Component Function）。

```kotlin
data class UserD(val name: String, var age: Int, val gender: Boolean, var hobby: String) : UserSuper() {

}

// 声明一部分
var (name, age) = UserD("hacketzeng", 26, true, "backetball")
var (name1, age1, gender, hobby) = UserD("hacketzeng", 26, true, "backetball")
println("$name $age")
println("$name1 $age1 $gender $hobby")
```

## data class getter/setter

kotlin的数据类，由于其内部封装了getter和setter方法，极大地简化了我们的编程代码，但同时其不能像java那样方便的重写getter或者setter方法

1. 不用data class，使用常规的class：不要拘泥于建议，谁说这些数据实体类就必须要用data class的，使用IDE去自动生成，照样可以，而且还实现了自己的完全控制。
2. 另外创建一个安全的变量

```kotlin
data class OrderBean(val createTime: Long){
    val createTimeShow:String
        get() = { ...do something }
}
```

## data class copy（浅拷贝）

对现有对象的copy，new了一个新的对象<br>如果data class存在其他的class，新旧会共享该class

```kotlin

fun main(args: Array<String>) {

    val u = User("hacket", 28)

    println("u=$u, hash=${System.identityHashCode(u)}")


    val u2 = u.copy()
    println("copy u=${u2}, hash=${System.identityHashCode(u2)}")

    val u3 = u.copy(age = 21)
    println("copy u=${u3}, hash=${System.identityHashCode(u3)}")

}

data class User(
    val name: String,
    val age: Int
)
```

结果：

```
u=User(name=hacket, age=28), hash=1229416514
copy u=User(name=hacket, age=28), hash=2016447921
copy u=User(name=hacket, age=21), hash=666988784
```

# 深拷贝和浅拷贝

## 浅拷贝

浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。<br>如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址 ，因此如果其中一个对象改变了这个地址，就会影响到另一个对象。

### data class copy为浅拷贝

### 默认clone

### 构造参数

### 数组的拷贝

数组除了默认实现了clone()方法之外，还提供了Arrays.copyOf方法用于拷贝，这两者都是浅拷贝。

### 浅拷贝案例

```java
public class Student implements Cloneable { 
   // 对象引用 
   public Subject subj; 
   public String name; 
   public Student(String s, String sub) { 
      name = s; 
      subj = new Subject(sub); 
   }
   /** 
    *  重写clone()方法 
    * @return 
    */ 
   public Object clone() { 
      //浅拷贝 
      try { 
         // 直接调用父类的clone()方法
         return super.clone(); 
      } catch (CloneNotSupportedException e) { 
         return null; 
      } 
   } 
}
```

## 深拷贝

深拷贝会拷贝所有的属性,并拷贝属性指向的动态分配的内存。当对象和它所引用的对象一起拷贝时即发生深拷贝。深拷贝相比于浅拷贝速度较慢并且花销较大。

### 序列化Serialable/Parcelable

> 通过序列化进行深拷贝时，必须确保对象图中所有类都是可序列化的。

### Kotlin用KotlinDeepCopy框架深拷贝

### 实现深拷贝的几种方式

1. 手动实现
2. 反射

```kotlin
fun <T : Any> T.deepCopy(): T {
    // 如果不是数据类，直接返回
    if (!this::class.isData) {
        return this
    }

    val primaryConstructor = this::class.primaryConstructor ?: return this

    // 拿到构造函数
    return primaryConstructor.let { constructor ->
        constructor.parameters.map { parameter ->
            // 转换类型
            // memberProperties 返回非扩展属性中的第一个并将构造函数赋值给其
            // 最终value=第一个参数类型的对象
            val value = (this::class as KClass<T>).memberProperties.first {
                it.name == parameter.name
            }.get(this)

            // 如果当前类(这里的当前类指的是参数对应的类型，比如说这里如果非基本类型时)是数据类
            if ((parameter.type.classifier as? KClass<*>)?.isData == true) {
                parameter to value?.deepCopy()
            } else {
                parameter to value
            }

            // 最终返回一个新的映射map,即返回一个属性值重新组合的map，并调用callBy返回指定的对象
        }.toMap().let(constructor::callBy)
    }
}
```

3. 三方库[KotlinDeepCopy](https://github.com/bennyhuo/KotlinDeepCopy)

> 也许你需要这个为数据类生成 DeepCopy 方法的库 <https://www.bennyhuo.com/2018/12/02/deepcopy/>

## Ref

- [x] Java深拷贝和浅拷贝<br><https://juejin.cn/post/6844903806577164302>

# 模板类

模板类其实就是类中定义了有泛型的方法

# kotlin之委托

## 委托介绍

委托，也就是委托模式，它是23种经典设计模式种的一种，又名`代理模式`。在委托模式中，有2个对象参与同一个请求的处理，接受请求的对象将请求委托给另一个对象来处理。委托模式是一项技巧，其他的几种设计模式如：策略模式、状态模式和访问者模式都是委托模式的具体场景应用。<br>委托模式中，有三个角色，`约束`、`委托对象`和`被委托对象`。

- 约束： 约束是接口或者抽象类，它定义了通用的业务类型，也就是需要被代理的业务
- 被委托对象： 具体的业务逻辑执行者
- 委托对象： 负责对真是角色的应用，将约束累定义的业务委托给具体的委托对象。

## 类/接口委托

委托模式已经证明是实现继承的一个很好的替代方式， 而 Kotlin 可以零样板代码地原生支持它。

1. 用`by`关键字
2. 覆盖由委托实现的接口成员，就不会再委托给委托者

### 案例1: 被委托类作为构造器形参传入（常用）

Derived 类可以通过将其所有公有成员都委托给指定对象来实现一个接口 Base：

```kotlin
// 约束： 接口
interface Base {
    fun print()
}

// 被委托对象，实现了Base接口
class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

// 委托对象
class Derived(b: Base) : Base by b

fun main() {
    val b = BaseImpl(10)
    Derived(b).print()
}
```

结果：

```
10
```

> 通过by关键在标识了b便意味着吧b对象存储在Derived类中，并且编译器会将b的所有的方法转发给Derived对象

编译成Java代码，b编译成了`$$delegate_0`：

```java
public final class Derived implements Base {
   // $FF: synthetic field
   private final Base $$delegate_0;

   public Derived(@NotNull Base b) {
      Intrinsics.checkParameterIsNotNull(b, "b");
      super();
      this.$$delegate_0 = b;
   }

   public void print() {
      this.$$delegate_0.print();
   }
}
```

### 案例2

用by关键字，小头爸爸的IWashBowl实现全部代理给了大头儿子去实现

```kotlin
// 定义洗碗接口
interface IWashBowl {
    fun wathBowl()
}

// 大头儿子实现洗碗
class BigHeadSon : IWashBowl {
    override fun wathBowl() {
        println("大头儿子洗碗了，每次赚1块钱")
    }
}

// 小头爸爸把洗碗委托给了小头儿子去实现洗碗，自己可以做其他的事情去
class SmallHeadFather : IWashBowl by BigHeadSon() {
    override fun wathBowl() {
        println("小头爸爸洗碗了，每次赚10块钱")
        // 小头爸爸把洗碗委托给了大头儿子，自己可以做其他事情
        BigHeadSon().wathBowl()
        println("小头爸爸看着大头儿子洗完碗，给大头儿子1块，自己赚了9块")
    }
}
```

### 案例3：利用类委托+动态代理实现类似`EmptyActivityLifecycleCallbacks`的效果

```kotlin
inline fun <reified T : Any> noOpDelegate(): T {
    val javaClass = T::class.java
    return Proxy.newProxyInstance(
        javaClass.classLoader,
        arrayOf(javaClass),
        NO_OP_HANDLER
    ) as T
}

val NO_OP_HANDLER = InvocationHandler { proxy, method, args ->
    // no op
}

// 复写的方法会回调，未复写的默认处理（不回调）
registerActivityLifecycleCallbacks(object :
        Application.ActivityLifecycleCallbacks by noOpDelegate<ActivityLifecycleCallbacks>() {
        override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
            Log.i("hacket.activity", "onActivityCreated:" + activity.localClassName)
        }

        override fun onActivityDestroyed(activity: Activity) {
            Log.w("hacket.activity", "onActivityDestroyed:" + activity.localClassName)
        }
    })
```

## 属性委托

见`Kotlin之属性委托.md`

# Kotlin之委托属性

在Kotlin 中，有一些常见的属性类型，虽然我们可以在每次需要的时候手动实现它们，但是很麻烦，各种样板代码存在。Kotlin宣称要实现零样板代码的。为了解决这些问题呢？Kotlin标准为我们提供了`委托属性`。

## 什么是属性委托？

kt中属性不是单纯的成员变量。

```kotlin
class Person {
	var personName = "Tom"
}
```

> personName不是单纯的成员变量，属性 = 成员变量 + 该变量的get方法 + 该变量的set方法；var personName = "Tom"实际上编译后会自动生成默认的get+set方法。

- 如果我们要控制 get set的默认逻辑就要去重写对应的方法。

```kotlin
class Person {
	var personName = "Tom"
	// 这是重写的 get/set
	get() = "PersonName $field"
	set(value) {
		field = if (value.length > 10) value else field
	}
}
```

- 如果我们不想直接在这个类里面去重写成员的set/get，或者这个逻辑其实是通用的，对其他成员变量也是能重用到的，那么可以通过**自定义属性委托**去实现。

**属性委托 = 把成员变量的 set/get函数封装到其他地方 + 使用的时候直接调用这个封装好的东西**

属性委托 = 把成员变量的 set/get函数封装到其他地方 + 使用的时候直接调用这个封装好的东西。

## 委托属性的写法

`委托属性`的语法如下：

```kotlin
val/var <属性名>: <类型> by <表达式> // 在 by 后面的表达式是该 委托
```

### 属性委托实现方式一：提供setValue()/getValue()方法

委托属性，被代理的就是这个属性的`get/set`方法。get/set会委托给被委托对象的`setValue/getValue`方法，因此被委托类需要提供`setValue`/`getValue`这两个方法。如果是`val`属性，只需提供getValue。如果是`var`属性，则setValue/getValue都需要提供。

```kotlin
class TestDelegate {
    // 属性委托
    var prop: String by Delegate()
}

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}

fun main() {
    val delegate = TestDelegate()
    delegate.prop = "hacket"
    println(delegate.prop)
}

// 结果：
// hacket has been assigned to 'prop' in me.hacket.delegate.TestDelegate@7daf6ecc.
// me.hacket.delegate.TestDelegate@7daf6ecc, thank you for delegating 'prop' to me!
```

其中的参数解释如下：

- thisRef 必须与 属性所有者 类型（对于扩展属性——指被扩展的类型）相同或者是它的超类型；TestDelegate对象
- property 必须是类型`KProperty<*>`或其超类型。 KProperty
- value  必须与属性同类型或者是它的子类型。 具体的值

当我们从委托到一个 Delegate 实例的 p 读取时，将调用 Delegate 中的 getValue() 函数， 所以它第一个参数是读出 p 的对象、第二个参数保存了对 p 自身的描述 （例如你可以取它的名字)。当我们给 p 赋值时，将调用 setValue() 函数。前两个参数相同，第三个参数保存将要被赋予的值：

```kotlin
e.p = "NEW"
```

[https://www.kotlincn.net/docs/reference/delegated-properties.html#属性委托要求](https://www.kotlincn.net/docs/reference/delegated-properties.html#%E5%B1%9E%E6%80%A7%E5%A7%94%E6%89%98%E8%A6%81%E6%B1%82)

### 属性委托实现方式一：ReadOnlyProperty / ReadWriteProperty

要实现属性委托，就必须要提供getValue/setValue方法，对于比较懒的同学可能就要说了，这么复杂的参数，还要每次都要手写，真是麻烦，一不小心就写错了。确实是这样，为了解决这个问题， Kotlin 标准库中声明了2个含所需operator方法的`ReadOnlyProperty`/`ReadWriteProperty` 接口

```kotlin
// val
interface ReadOnlyProperty<in R, out T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
}

// var
interface ReadWriteProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
    operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}
```

> 被委托类 实现这两个接口其中之一就可以了，val 属性实现ReadOnlyProperty，var属性实现ReadOnlyProperty。

案例：

```
// val 属性委托实现
class Delegate1: ReadOnlyProperty<Any,String>{
    override fun getValue(thisRef: Any, property: KProperty<*>): String {
        return "通过实现ReadOnlyProperty实现，name:${property.name}"
    }
}
// var 属性委托实现
class Delegate2: ReadWriteProperty<Any,Int>{
    override fun getValue(thisRef: Any, property: KProperty<*>): Int {
        return  20
    }

    override fun setValue(thisRef: Any, property: KProperty<*>, value: Int) {
       println("委托属性为： ${property.name} 委托值为： $value")
    }

}
// 测试
class Test {
    // 属性委托
    val d1: String by Delegate1()
    var d2: Int by Delegate2()
}

val test = Test()
println(test.d1)
println(test.d2)
test.d2 = 100

// 结果：
// 通过实现ReadOnlyProperty实现，name:d1
// 20
// 委托属性为： d2 委托值为： 100
```

## 标准委托

Kotlin 标准库为几种有用的委托提供了工厂方法

1. 延迟属性（lazy properties）: 其值只在首次访问时计算；
2. 可观察属性（observable properties）: 监听器会收到有关此属性变更的通知；
3. 把多个属性储存在一个映射（map）中，而不是每个存在单独的字段中。

### 延迟属性 Lazy

#### `lazy() {} 顶层函数`

`lazy(){}` 是接受一个 lambda 并返回一个`Lazy <T>`实例的函数，返回的实例可以作为实现延迟属性的委托： 第一次调用get()会执行已传递给lazy()的lambda表达式并记录结果，后续调用get()只是返回记录的结果。

```kotlin
val lazyProp: String by lazy {
    println("Hello，第一次调用才会执行我！")
    "hacket！"
}

fun lazyDelegate() {
    // 打印lazyProp 3次，查看结果
    println(lazyProp)
    println(lazyProp)
    println(lazyProp)
}
```

结果：

```
Hello，第一次调用才会执行我！
hacket！
hacket！
hacket！
```

> 可以看到，只有第一次调用，才会执行lambda表达式中的逻辑，后面调用只会返回lambda表达式的最终值。

#### LazyThreadSafetyMode

lazy延迟初始化是可以接受参数的，提供了如下三个参数：

##### SYNCHRONIZED

LazyThreadSafetyMode.SYNCHRONIZED: 默认值，线程同步，添加对象锁，使lazy延迟初始化线程安全(该值只在一个线程中计算，并且所有线程会看到相同的值)

##### PUBLICATION

LazyThreadSafetyMode.PUBLICATION：线程同步，CAS，初始化的lambda表达式可以在同一时间被多次调用，但是只有第一个返回的值作为初始化的值。

##### NONE

LazyThreadSafetyMode.NONE：没有同步锁，多线程访问时候，初始化的值是未知的，非线程安全，一般情况下，不推荐使用这种方式，除非你能保证初始化和属性始终在同一个线程(它不会有任何线程安全的保证以及相关的开销)

#### `lazy(){}`原理

```kotlin
public actual fun <T> lazy(mode: LazyThreadSafetyMode, initializer: () -> T): Lazy<T> =
    when (mode) {
        LazyThreadSafetyMode.SYNCHRONIZED -> SynchronizedLazyImpl(initializer)
        LazyThreadSafetyMode.PUBLICATION -> SafePublicationLazyImpl(initializer)
        LazyThreadSafetyMode.NONE -> UnsafeLazyImpl(initializer)
    }
```

以SynchronizedLazyImpl为例：

```java
internal object UNINITIALIZED_VALUE
private class SynchronizedLazyImpl<out T>(initializer: () -> T, lock: Any? = null) : Lazy<T>, Serializable {
    private var initializer: (() -> T)? = initializer
     // 内部初始化的value，默认为一个静态类
    @Volatile private var _value: Any? = UNINITIALIZED_VALUE
    // final field is required to enable safe publication of constructed instance  // 默认使用Lazy自身实例作为锁对象,如果lock不为空
    private val lock = lock ?: this

    override val value: T
        get() {
            val _v1 = _value
            // 如果不等于默认值,则证明已初始化过，直接强转返回
            if (_v1 !== UNINITIALIZED_VALUE) {
                @Suppress("UNCHECKED_CAST")
                return _v1 as T
            }
            // 为初始化增加对象锁，锁对象为传递进来的lock，默认为当前自身对象
            return synchronized(lock) {
                val _v2 = _value
                // 如果不等于默认值,则证明已初始化过，直接强转返回
                if (_v2 !== UNINITIALIZED_VALUE) {
                    @Suppress("UNCHECKED_CAST") (_v2 as T)
                } else {
                    val typedValue = initializer!!()
                    _value = typedValue
                    initializer = null
                    typedValue
                }
            }
        }

    override fun isInitialized(): Boolean = _value !== UNINITIALIZED_VALUE

    override fun toString(): String = if (isInitialized()) value.toString() else "Lazy value not initialized yet."

    private fun writeReplace(): Any = InitializedLazyImpl(value)
}
```

#### 系统提供的一些Lazy

##### ComponentActivity.viewModels

```kotlin
@MainThread
public inline fun <reified VM : ViewModel> ComponentActivity.viewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> {
    val factoryPromise = factoryProducer ?: {
        defaultViewModelProviderFactory
    }
    return ViewModelLazy(VM::class, { viewModelStore }, factoryPromise)
}
```

##### Fragment.activityViewModels

```kotlin
@MainThread
public inline fun <reified VM : ViewModel> Fragment.activityViewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> = createViewModelLazy(
    VM::class, { requireActivity().viewModelStore },
    factoryProducer ?: { requireActivity().defaultViewModelProviderFactory }
)
```

#### 自定义Lazy

### 可观察属性 Observable

#### 1. Delegates.observable

观察一个属性的变化过程，那么可以将属性委托给Delegates.observable。<br>Delegates.observable() 接受两个参数：初始值与修改时处理程序（handler）。 每当我们给属性赋值时会调用该处理程序（在赋值后执行）。它有三个参数：被赋值的属性、旧值与新值：

```kotlin
public inline fun <T> observable(initialValue: T, crossinline onChange: (property: KProperty<*>, oldValue: T, newValue: T) -> Unit):
    ReadWriteProperty<Any?, T> =
object : ObservableProperty<T>(initialValue) {
    override fun afterChange(property: KProperty<*>, oldValue: T, newValue: T) = onChange(property, oldValue, newValue)
}
```

接受2个参数：

- initialValue： 初始值
- onChange： 属性值被修改时的回调处理器，回调有三个参数property,oldValue,newValue,分别为：被赋值的属性、旧值与新值。

案例：

```kotlin
var observableProp: String by Delegates.observable("默认值：xxx"){
    property, oldValue, newValue ->
    println("property: $property: $oldValue -> $newValue ")
}
// 测试
fun main() {
    observableProp = "第一次修改值"
    observableProp = "第二次修改值"
}
```

结果：

```kotlin
property: var observableProp: kotlin.String: 默认值：xxx -> 第一次修改值 
property: var observableProp: kotlin.String: 第一次修改值 -> 第二次修改值
```

#### 2. Delegates.vetoable

vetoable 与 observable一样，可以观察属性值的变化，不同的是，vetoable可以通过处理器函数来决定属性值是否生效。true表示替换成新值，false不替换新值还是返回旧值

例子：声明一个Int类型的属性vetoableProp，如果新的值比旧值大，则生效，否则不生效。

```kotlin
fun vetoableDelegate() {
    var vetoableProp: Int by Delegates.vetoable(0){
            _, oldValue, newValue ->
        // 如果新的值大于旧值，则生效
        newValue > oldValue
    }
    println("vetoableProp=$vetoableProp")
    vetoableProp = 10
    println("vetoableProp=$vetoableProp")
    vetoableProp = 5
    println("vetoableProp=$vetoableProp") // 可以看到10 -> 5 的赋值没有生效。
    vetoableProp = 100
    println("vetoableProp=$vetoableProp")
}
```

结果：

```
vetoableProp=0
 0 -> 10 
vetoableProp=10
 10 -> 5 
vetoableProp=10
 10 -> 100 
vetoableProp=100
```

---

```kotlin
fun main(args: Array<String>) {
    val user = User2()
    println(user.name)
    user.name = "first"
    println(user.name)
    user.name = "second"
    println(user.name)

    println("------")

    println(user.name2)
    user.name2 = "first2"
    println(user.name2)
    user.name2 = "  "
    println("[${user.name2}](${user.name2.length})")
}

class User2 {
    var name: String by Delegates.observable("<no name>") { prop, old, new ->
        println("prop=$prop  $old -> [$new](${new.length})")
    }
    var name2: String by Delegates.vetoable("<no name>") { prop, old, new ->
        println("prop=$prop  $old -> [$new](${new.length})")
        !new.isBlank()
    }
}
```

结果：

```
<no name>
prop=var helloworld.User2.name: kotlin.String  <no name> -> [first](5)
first
prop=var helloworld.User2.name: kotlin.String  first -> [second](6)
second
------
<no name>
prop=var helloworld.User2.name2: kotlin.String  <no name> -> [first2](6)
first2
prop=var helloworld.User2.name2: kotlin.String  first2 -> [  ](2)
[first2](6)
```

### 把属性储存在映射中（Map/MutableMap）

在一个映射（map）里存储属性的值，使用映射实例自身作为委托来实现委托属性。

一个常见的用例是在一个映射（map）里存储属性的值。 这经常出现在像解析 JSON 或者做其他“动态”事情的应用中。 在这种情况下，你可以使用映射实例自身作为委托来实现委托属性。

```kotlin
class User(val/*var*/ map: Map<String, Any?>) {
    val/*var*/ name: String by map
    val/*var*/ age: Int     by map
}

val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))

// 委托属性会从这个映射中取值（通过字符串键——属性的名称）：
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```

## 局部委托属性（自 1.1 起）

你可以将局部变量声明为委托属性。 例如，你可以使一个局部变量惰性初始化：

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

memoizedFoo 变量只会在第一次访问时计算。 如果 someCondition 失败，那么该变量根本不会计算。

## Ref

-  [x] 一文彻底搞懂Kotlin中的委托<br><https://juejin.cn/post/6844904038589267982>
-  [x] 委托属性<br><http://www.kotlincn.net/docs/reference/delegated-properties.html>
