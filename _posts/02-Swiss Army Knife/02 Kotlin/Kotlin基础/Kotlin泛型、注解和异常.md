---
date created: 2024-12-27 23:45
date updated: 2024-12-27 23:45
dg-publish: true
---

# Kotlin泛型

## 泛型类型参数

> 1. 类型形参，如List `<>`里的T叫`类型形参`
> 2. 类型实参，List，String叫`类型实参`

泛型允许你定义带**类型形参**的类型，当这种类型的实例被创建出来的时候，类型形参被替换成称为**类型实参**的具体类型。

正常情况下，编译器可以推导出你创建的类型。但你想创建一个空的列表，这样就没有任何可以推导出类型实参的线索，你就得显式地指定它（类型形参）

创建列表来说，可以在列表变量声明中（引用）说明泛型的类型，也可以选择在创建列表的函数中说明类型实参：

```kotlin
val readers: MutableList<String> = mutableListOf("test1", "test2")
val readers2 = mutableListOf<String>("test1", "test2")
```

> Kotlin始终要求实参要么被显式地说明，要么能被编译器推导出来。Kotlin从一开始就支持泛型，它的类型实参必须定义

## 泛型类、函数和属性

### 泛型函数

泛型函数，很多库函数是泛型函数

```kotlin
public fun <T> List<T>.slice(indices: IntRange): List<T> {
    if (indices.isEmpty()) return listOf()
    return this.subList(indices.start, indices.endInclusive + 1).toList()
}
// 函数的返回类型是List<T>，函数的类型形参是T
```

### 泛型属性

和泛型函数一样，可以声明泛型的扩展属性

```kotlin
val <T> List<T>.penultimate: T
    get() = this[size - 2]
```

普通（不是扩展属性）属性不能拥有类型参数，不能在一个类的属性中存储多个不同类型的值，因此声明泛型属性非扩展函数没有任何意义。

```kotlin
 val <T> x:T = null
```

### 泛型类

基本和Java语法意义，在类名称后加上`<>`

## 类型参数约束

**类型参数约束**可以限制作为泛型类和泛型函数的类型实参的类型。

**上界约束**<br>一个类型指定为泛型类型形参的上界约束，在泛型类型具体的初始化中，其对应的类型实参必须是这个具体类型或者它的子类型。

```kotlin
// Java中
<T extends Number> T sum(List<T> list)
// kotlin中
fun <T : Number> List<T>.sum(): T
```

例子：找出两个条目中最大值的泛型函数：

```kotlin
fun <T : Comparable<T>> max(first: T, second: T): T {
    return if (first > second) first else second
}
```

在一个类型参数上指定多个约束，给定的seq以句号结尾

```kotlin
fun <T> ensureTrailingPerion(seq: T) where T : CharSequence, T : Appendable {
    if (!seq.endsWith(".")) {
        seq.append(".")
    }
}
```

### 类型形参非空

没有指定上界的类型形参都会使用`Any?`这个默认的上界。

类型形参非空，用`Any`替代`Any?`，也可以指定任意非空类型作为上界，让类型参数非空。

```kotlin
class Processsor<T : Any> {
    fun process(value: T) {
        value.hashCode()
    }
}
```

## `*` 号

Java 中单个 `?` 号也能作为泛型通配符使用，相当于`? extends Object`。

在 Kotlin 中有等效的写法：`*` 号，相当于 `out Any`。

```kotlin
var list: List<*>
```

和 Java 不同的地方是，如果你的类型定义里已经有了 out 或者 in，那这个限制在变量声明时也依然在，不会被 * 号去掉。

比如你的类型定义里是 out T : Number 的，那它加上 <*> 之后的效果就不是 out Any，而是 out Number。

## where

Java 中声明类或接口的时候，可以使用 extends 来设置边界，将泛型类型参数限制为某个类型的子集，同时这个边界是可以设置多个，用 & 符号连接：

```java
//                            👇  T 的类型必须同时是 Animal 和 Food 的子类型
class Monster<T extends Animal & Food>{ 
}
```

Kotlin 只是把 extends 换成了 `:` 冒号，设置多个边界可以使用 `where` 关键字：。

```kotlin
class Monster<T> where T : Animal, T : Food
```

## reified

具体可见`Kotlin运行时泛型`章节<br>由于 Java 中的泛型存在类型擦除的情况，任何在运行时需要知道泛型确切类型信息的操作都没法用了<br>比如你不能检查一个对象是否为泛型类型 T 的实例：

```java
<T> void printIfTypeMatch(Object item) {
    if (item instanceof T) { // 👈 IDE 会提示错误，illegal generic type for instanceof
        System.out.println(item);
    }
}
```

Kotlin 里同样也不行：

```kotlin
fun <T> printIfTypeMatch(item: Any) {
    if (item is T) { // 👈 IDE 会提示错误，Cannot check for instance of erased type: T
        println(item)
    }
}
```

在 Java 中的解决方案通常是额外传递一个 Class 类型的参数，然后通过 Class#isInstance 方法来检查

```java
<T> void check(Object item, Class<T> type) {
    if (type.isInstance(item)) {
               👆
        System.out.println(item);
    }
}
```

Kotlin 中同样可以这么解决，不过还有一个更方便的做法：使用关键字 reified 配合 inline 来解决：

```kotlin
inline fun <reified T> printIfTypeMatch(item: Any) {
    if (item is T) { // 👈 这里就不会在提示错误了
        println(item)
    }
}
```

## kotlin协变out & 逆变in

和 Java 泛型一样，Kolin 中的泛型本身也是不可变的。

1. 使用关键字`out`来支持协变，等同于 Java 中的上界通配符 `? extends`。
2. 使用关键字 `in` 来支持逆变，等同于 Java 中的下界通配符 `? super`。

### out 协变 只能读不能写

out 表示，我这个变量或者参数只用来输出，不用来输入，你只能读我不能写我；对应Java中的 `? extend`。

### in 逆变 只能写不能读

in 表示它只用来输入，不用来输出，你只能写我不能读我；对应Java中的`? super T`。

如`List<? extends Foo>`，将无法调用add()和set()方法，但并不代表这个集合对象的值是不变的(immutable)，如clear()方法可以清空集合中的值，**通配符类型唯一能够确保的仅仅是类型安全，对象值的不可变性是另外一个问题**。

1. 能接收的类型为类型实参为Foo及子类
2. 写的数据是T或T的子类

```kotlin
val apples4: MutableList<Apple> = mutableListOf()
val fruit4: MutableList<Fruit> = mutableListOf()
val smallApple4: MutableList<SmallApple> = mutableListOf()
val any4: MutableList<Any> = mutableListOf()
val fruit4_0: MutableList<in Apple> = apples4 // ok
fruit4_0.add(Apple()) // ok
fruit4_0.add(SmallApple()) // ok
//    fruit4_0.add(Fruit()) // 编译错误
//    fruit4_0.add(Any()) // 编译错误
val fruit4_1: MutableList<in Apple> = fruit4 // ok
fruit4_1.add(Apple()) // ok
fruit4_1.add(SmallApple()) // ok
//    fruit4_1.add(Fruit()) // 编译错误
//    fruit4_1.add(Any()) // 编译错误
val fruit4_2: MutableList<in Apple> = any4 // ok
fruit4_2.add(Apple()) // ok
fruit4_2.add(SmallApple()) // ok
//    fruit4_2.add(Fruit()) // 编译错误
//    fruit4_2.add(Any()) // 编译错误
//    val fruit4_3: MutableList<in Apple> = smallApple4 // 编译错误
```

### Java和Kotlin数组中的协变和逆变

#### Java 里的数组是支持协变的，而 Kotlin 中的数组 Array 不支持协变。

```java
Fruit[] fruitsArray = new Fruit[3]; // Java数组支持协变
fruitsArray[0] = new Fruit();
fruitsArray[0] = new Apple();
fruitsArray[0] = new SmallApple();
```

因为在 Kotlin 中数组是用 Array 类来表示的，这个 Array 类使用泛型就和集合类一样，所以不支持协变。

#### Java 中的 List 接口不支持协变，而 Kotlin 中的 List 接口支持协变

Java 中的 List 不支持协变，原因在上文已经讲过了，需要使用泛型通配符来解决。

在 Kotlin 中，实际上 MutableList 接口才相当于 Java 的 List。Kotlin 中的 List 接口实现了只读操作，没有写操作，所以不会有类型安全上的问题，自然可以支持协变。

```kotlin
// kotlin
public interface List<out E> : Collection<E>
```

Kotlin中的List支持协变

```kotlin
val apple5: List<Apple> = listOf()
val smallApple5: List<SmallApple> = listOf()
val fruit5_0: List<out Fruit> = apple5
val fruit5_1: List<out Fruit> = smallApple5
```

案例：

```
/**
 * 实现一个 fill 函数，传入一个 Array 和一个对象，将对象填充到 Array 中，要求 Array 参数的泛型支持逆变（假设 Array size 为 1）。  https://kaixue.io/kotlin-generics/
 */
fun <T> fill(array: Array<in T>, t: T) {
    array[0] = t
}

/**
 * 实现一个 copy 函数，传入两个 Array 参数，将一个 Array 中的元素复制到另外个 Array 中，要求 Array 参数的泛型分别支持协变和逆变。
 */
fun <T> copy(src: Array<out T>, dst: Array<in T>) {
    for (index in src.indices) {
        val source = src[index]
        dst[index] = source
    }
}
```

## Kotlin运行时泛型

### 1、运行时的泛型：类型检查和转换

和Java一样，kotlin的泛型在运行时也被擦除了。

`List<*>` 星号投影，和Java中的`List<?>`一样。

用`is`可以检查，

### 2、声明带实化类型参数的函数

实化：消除运行时类型擦除对Kotlin的影响，通过将函数声明为inline来解决，保证其类型实参不被擦除。

```kotlin
fun <T> isA(value: Any) = value is T // 编译报错
```

**内联函数**：inline函数的类型形参能够被实化，可以在运行时引用实际的类型实参；<br>内联函数，编译器会把每一次函数调用都转换成函数实际的代码实现；使用内联函数还可能提升性能，如果函数使用了lambda实参，lambda的代码也会内联，不会创建任何匿名类。

**reified**声明的类型参数不会在运行时被擦除

```kotlin
inline fun <reified T> isA(value: Any) = value is T // 可以编译了
```

例子，标准库函数`filterIsInstance`，接收一个集合，选择指定的类型，返回集合中是该类型的实例

```kotlin
inline fun <reified T> Iterable<*>.filterIsInstance1(): List<T> {
    val dest = mutableListOf<T>()
    for (ele in this) {
        if (ele is T) {
            dest.add(ele)
        }
    }
    return dest
}
// 使用
val items = listOf("one", 2, "three")
println(items.filterIsInstance<String>())
println(items.filterIsInstance1<String>())
```

> **注意**：带reified类型参数的inline函数不能再Java代码中调用，普通的内联函数可以像常规函数那样在Java中调用（它们可以被调用而不能被内联）；带实化类型参数的函数需要额外的处理，来把类型实参的值替换到字节码中，所以它们必须永远是内联的，这样它们不可能用Java那样普通的方法调用

一个内联函数可以有多个实化类型参数，也可以同时拥有非实化类型参数和实化类型参数。

> 为了保证良好的性能，函数太大，最好不不依赖实化类型参数的代码抽取到单独的非内联函数中

#### 2-1 实化类型参数(reified)替代类引用(Class)

实化参数可以用来替代接收`java.lang.Class`类型参数的API，如JDK中的ServiceLoader，用kotlin重写

```kotlin
inline fun <reified T> loadService(): ServiceLoader<T>? {
    return ServiceLoader.load(T::class.java)
}
```

Android中的startActivity：

```kotlin
inline fun <reified T : Activity> Context.startActivity() {
   val intent = Intent(this, T::class.java) // 相当于T.class
   startActivity(intent)
}
// 调用
startActivity<DetailActivity>()
```

#### 2-2 实化类型参数的限制

按照下列方式来使用实化类型参数：

1. 用在类型检查和类型转换中( is !is as as?)
2. 使用kotlin反射API (::class)
3. 获取对应的java.lang.Class (::class.java)
4. 作为调用其他函数的类型实参

不能做下面的：

1. 创建指定为类型参数的类的实例
2. 调用类型参数类的伴生对象的方法
3. 调用带实化类型参数的时候使用非实化类型形参作为类型实参
4. 把类、属性或者非内联函数的类型参数标记为reified

# Kotlin之注解

使用注解的语法和Java完全一样，而声明自己注解类的语法略有不同。

## Kotlin注解基础

### 声明应用注解

`@Deprecated`注解被增强了，idea不仅可以提示应该用哪个函数替代，还会提供一个快速自动修正。

```kotlin
@Deprecated("User removeNew(index) instead.", ReplaceWith("removeNew(index)"), DeprecationLevel.WARNING)
fun removeOld(index: Int) {
}

fun removeNew(index: Int) {
}
```

注解只能有如下类型的参数：<br>基本数据类型，字符串，枚举，类引用，其他的注解类，以及这些类型的数组

1. 要把一个类指定为注解的实参，需要在类名后加上`::class`

```kotlin
@MyAnnotation(MyClass::class)
```

2. 要把另一个注解指定为实参，去掉注解名称前面的`@`，如@Deprecated注解的实参@ReplaceWith是一个注解参数
3. 要把一个数组指定为一个实参，使用`arrayOf`函数（如果注解类是在Java中声明的，命名为value的形参按需自动地被转换为可变长度的形参，所以不用arrayOf函数就可以提供多个实参）

```kotlin
@RequestMapping(path = arrayOf("/foo","/bar"))
```

注解实参需要是**编译期常量**，用`const`修饰符标记。

> const标注的属性可以声明在一个文件的顶层或者一个Object之中，而且必须初始化为基本数据类型或String类型的值

### 注解目标

Kotlin中单个声明会对应多个Java声明，而且它们每个都能携带注解，如一个Kotlin属性对应一个Java字段、一个getter、可能还有setter和它的参数；而一个主构造方法中声明的属性还多拥有一个对应的元素：构造方法的参数。因此，**说明这些元素中哪些需要注解十分必要**

使用**点目标**声明被用来说明要注解的元素。点目标放在`@`符号和注解名称直接，并用`:`和注解名称隔开：

```kotlin
@get:Rule // 注解@Rule被应用到了属性getter上
// @get 使用点目标
// Rule 注解名称
class HasTempFolder {
    @get:Rule
    private val folder = HasTempFolder()
    @Test
    fun testUsingTempFolder() {

    }
}
```

使用Java中声明的注解来注解一个属性，它会被默认地应用到相应的字段上，Kotlin也可以让你声明被直接对应到属性上的注解：

1. property Java的注解不能应用这种使用点目标
2. field 为属性生成的字段
3. get 属性的getter
4. set 属性的setter
5. receiver 扩展函数或扩展属性的接收者参数
6. param 构造方法的参数
7. setparam 属性setter的参数
8. delegate 为委托属性存储委托实例的字段
9. file 包含在文件中声明的顶层函数和属性的类<br>任何应用到file目标的注解都必须放在文件的顶层，放在package指令之前，`@JvmName`是常见的应用到文件的注解之一，它改变了对应类的名称。

Kotlin允许你对任意的表达式应用注解，而不仅仅是类和函数的声明及类型。

用注解控制Java API，有些注解替代了Java的关键字，其他的注解则是被用来改变Kotlin声明对Java调用者的可见性

1. `@Volatile`和`@Strictfp`充当了Java关键字volatile和strictfp的替身
2. 其他的注解被用来改变Kotlin声明对Java调用者的可见性<br>`@JvmName`改变由Kotlin生成的Java方法或字段的名称<br>`@JvmStatic` 用在对象声明或者伴生对象的方法上，把它们暴露成Java的静态方法<br>`@JvmOverloads` 指导kotlin编译器为带默认参数值的函数生成多个重载函数<br>`@JvmField` 应用于一个属性，把这个属性暴露成一个没有访问器的公有Java字段

案例：

```kotlin
@MyAnnoClass
class Foo @MyAnnoClass constructor(@MyAnnoClass var n: String) { // 类的主构造器添加注解

    var x: Int? = null
        @MyAnnoClass set
        @MyAnnoClass get

    @get:MyAnnoClass // get添加注解
    @set:MyAnnoClass // set添加注解
    var y: String? = ""


    // 属性添加注解
    @MyAnnoClass
    var z: Double? = 0.0

    @MyAnnoClass
    fun testFoo(@MyAnnoClass s: String) {

    }

}

@Target(AnnotationTarget.ANNOTATION_CLASS, AnnotationTarget.FUNCTION, AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.EXPRESSION,
        AnnotationTarget.PROPERTY_SETTER, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.FIELD, AnnotationTarget.CONSTRUCTOR,
        AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@Repeatable
@MustBeDocumented
annotation class MyAnnoClass
```

### 注解到Lambda表达式

注解Lambda，Lambda表达式的函数体内容将会生成一个invoke()方法，注解将被添加到这个方法上

## Kotlin中的元注解

- [@Target ](/Target) <br>指定这个注解可被用于哪些元素
- [@Retention ](/Retention) <br>指定这个注解的信息保留的时机
- [@Retention ](/Retention) <br>允许在单个元素上多次使用同一个注解
- [@MustBeDocumented ](/MustBeDocumented) <br>表示这个注解是公开API的一部分，在自动产生的API的文档的类或函数签名中，应该包含这个注解的信息

```kotlin
@Target(AnnotationTarget.ANNOTATION_CLASS, AnnotationTarget.FUNCTION, AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.RUNTIME)
@Repeatable
@MustBeDocumented
annotation class MyAnnoClass
```

## Kotlin注解类

注解类可以拥有带参数的构造器

```kotlin
@Special("hacket")
class TestSpecial {
}
annotation class Special(val why: String) {
}
```

注解类的构造器只能用下面的类型：

1. 与Java基本类型对应的数据类型（Int、Long等）
2. String
3. 枚举类
4. KClass
5. 其他注解类

为注解构造器添加参数时，注意2点：

1. 参数类型只能使用val，不能用var，不加也不行
2. 当参数类型是另外一个注解类时，该注解类的名字前面不能使用`@`

```kotlin
annotation class Person(val value: String, val num: Int)

enum class MyEnum {
    VALUE1, VALUE2
}

// 枚举类和注解类
annotation class NewWorld(val value: MyEnum, val p: Person)

annotation class Ann(val arg1: KClass<*>, val args2: KClass<out Any>)

@Ann(String::class, Int::class) // KCLass，Java类也可以正常访问
class TestAnn {

}
```

## 使用注解定制JSON序列化反序列化

JKid库为例<br>`@JsonExclude` 标记一个属性，这个属性应该排除在序列化和反序列化之外<br>`@JsonName` 代表这个属性的JSON键值对之中的键应该是一个给定的字符串，而不是属性的名称

### 声明注解

注解类只是用来定义关联到声明和表达式的元数据的结构，他们不能包含任何代码，编译器禁止为一个注解类指定类主体

```kotlin
annotation class JsonExclude
```

对拥有参数的注解来说，在类的构造方法中声明这些参数，对注解类的所有参数来说，val是强制的

```kotlin
annotation class JsonExclude(val name: String)
```

Java中有value方法，而kotlin注解拥有一个name属性，kotlin注解调用就是常规的构造方法调用，可以用命名实参语法让实参名称变为显示的，或可以省略掉这些实参。

#### 1-1 元注解

1. `@Target` 注解应用的目标<br>Java中无法使用目标为`PORPERTY`的注解，除了添加一个`AnnotationTarget.FIELD`，这样注解可以在Java和Kotlin中的属性或字段都可以使用
2. `@Retention`<br>Java默认是保存的CLASS<br>而Kotlin默认注解拥有RUNTIME保留

#### 1-2 使用类作为注解参数

```kotlin
annotation class DeserializeInterface(val targetClass: KClass<out Any>) // 没有写上out就不能传递Company::class，唯一允许的实参是Any::class；out关键字说明允许引用那些继承Any的类，而不仅仅是引用Any自己

// 引用
DeserializeInterface(Company::class) // Company::class表示KClassM<Company>
```

KClass对应的是Java中的`java.lang.Class`类型，它用来保存kotlin类的引用。

#### 1-3 使用泛型类做注解参数

# kotlin之异常处理

基本语法和Java差不多<br>**Kotlin不存在checked exception。**

## try{}catch(e:Exception){}finally{}

```kotlin
fun calc() {
    while (true) {
        println("请输入第一个数字：")
        var num1Str = readLine(); // 可能为null

        println("请输入第二个数字：")
        var num2Str = readLine(); // 可能为null

        try {
            var num1 = num1Str!!.toInt()
            var num2 = num2Str!!.toInt()
            println("$num1+$num2=" + (num1 + num2))
        } catch(e: Exception) {
            println("大哥，你输入的数字不正确:")
            e.printStackTrace()
        }
    }
}
```

## try{}catch(){}可作为表达式

表达式的返回值，要么是try代码块内最后一个表达式的值，要么是catch代码块内最后一个表达式的值，finally代码内不影响try表达式的结果

```kotlin
fun testException() {
    var var1: Nothing? = null
    val a = try {
        parseInt(var1)
    } catch (e: Exception) {
        null
    }
    println(a)
}
```

```
java.lang.NumberFormatException: For input string: "123a"
kotlin.Unit

kotlin.KotlinNullPointerException
kotlin.Unit
```
