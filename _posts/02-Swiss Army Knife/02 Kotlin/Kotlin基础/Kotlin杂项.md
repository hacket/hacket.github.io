---
date created: 2024-12-20 10:03
date updated: 2024-12-27 23:46
dg-publish: true
---

# Kotlin与Java

## Java调用Kotlin

### 属性

Kotlin属性编译为以下Java元素：

1. 一个getter方法, 方法名由属性名加上 get 前缀得到
2. 一个setter方法, 方法名由属性名加上 set 前缀得到 (只会为 var 属性生成设值方法);
3. 一个私有的域变量, 名称与属性名相同 (只会为拥有后端域变量的属性生成域变量)
4. 如果属性名以 is 开头, 会使用另一种映射规则: 取值方法名称会与属性名相同, 设值方法名称等于将属性名中的 is 替换为 set.比如, 对于 isOpen 属性, 取值方法名称将会是 isOpen() , 设值方法名称将会是 setOpen() . 这个规则适用于任何数据类型的属性, 而不仅限于Boolean 类型

### 包级函数

在源代码文件example.kt的org.foo.bar包内声明的所有函数和属性, 包括扩展函数, 都被会编译成为Java类 org.foo.bar.ExampleKt的静态方法；编译生成的 Java 类的名称, 可以通过`@JvmName`注解来改变:

```kotlin
@file:JvmName("DemoUtils") 

package demo
class Foo
fun bar() { 

}
```

## Kotlin调用Java

Kotlin 的设计过程中就考虑到了与 Java 的互操作性. 在 Kotlin 中可以通过很自然的方式调用既有的 Java 代码, 反过来在 Java 中也可以很 流畅地使用 Kotlin 代码。

### 1、大多数 Java 代码都可以直接使用, 没有任何问题:

```kotlin

fun demoList(source: List<Int>) {
    val list = ArrayList<Int>(source.size)
    // 对Java集合使用for循环
    for (item in source) {
        list.add(item)
    }
    // 对Java使用kotlin操作符
    for (i in 0..source.size - 1) {
        println("i:$i")
        list[i] = source[i] // 这里会调用get和set方法
    }
    println(list)
}
```

### 2、Get 和 Set 方法

符合 Java 的 Get 和 Set 方法规约的方法(无参数, 名称以 get 开头, 或单个参数, 名称以 set 开头) 在 Kotlin 中会被识别为属性. Boolean 类型的属性访问方法(Get 方法名称以 is 开头, Set 方法名称以 set 开头), 会被识别为属性, 其名称与 Get 方法相同。

> 注意, 如果 Java 类中只有 set 方法, 那么在 Kotlin 中不会被识别为属性, 因为 Kotlin 目前还不支持只写(set-only) 的属性.

### 3、返回值为 void 的方法

如果一个Java方法返回值为void,那么在Kotlin中调用时将返回 Unit.如果,在Kotlin中使用了返回值,那么会由Kotlin编译器在调用 处赋值, 因为返回值已经预先知道了(等于 Unit ).

### 4、当 Java 标识符与 Kotlin 关键字重名时的转义处理

某些 Kotlin 关键字在 Java 中是合法的标识符: in, object, is, 等等. 如果 Java 类库中使用 Kotlin 的关键字作为方法名, 你仍然可以调用这 个方法, 只要使用反引号(`)对方法名转义即可:

```kotlin

foo.`is`(bar)
```

### 5、Null 值安全性与平台数据类型

Java 中的所有引用都可以为 null 值, 因此对于来自 Java 的对象, Kotlin 的严格的 null 值安全性要求就变得毫无意义了. Java 中定义的类 型在 Kotlin 中会被特别处理, 被称为 `平台数据类型(platform type)`. 对于这些类型, Null 值检查会被放松, 因此对它们来说, 只提供与 Java 中相同的 null 值安全保证

```kotlin

val list = ArrayList<String>() // 非 null 值 (因为是构造器方法的返回结果) list.add("Item")
val size = list.size // 非 null 值 (因为是基本类型 int)
val item = list[0] // 类型自动推断结果为平台类型 (通常的 Java 对象)
```

对于平台数据类型的变量, 当我们调用它的方法时, Kotlin 不会在编译时刻报告可能为 null 的错误, 但这个调用在运行时可能失败, 原因可 能是发生 null 指针异常, 也可能是 Kotlin 编译时为防止 null 值错误而产生的断言, 在运行时导致失败:

```kotlin

item.substring(1) // 编译时允许这样的调用, 但在运行时如果 item == null 则可能抛出异常
```

平台数据类型是 `无法指示的(non-denotable)`, 也就是说不能在语言中明确指出这样的类型. 当平台数据类型的值赋值给 Kotlin 变量时, 我们可以依靠类型推断(这时变量的类型会被自动推断为平台数据类型, 比如上面示例程序中的变量 item 就是如此), 或者我们也可以选择 我们期望的数据类型(可为 null 的类型和非 null 类型都允许):

```kotlin

val nullable: String? = item // 允许, 永远不会发生错误 val notNull: String = item // 允许, 但在运行时刻可能失败
```

如果我们选择使用非 null 类型, 那么编译器会在赋值处理之前输出一个断言(assertion). 它负责防止 Kotlin 中的非 null 变量指向一个 null 值. 当我们将平台数据类型的值传递给 Kotlin 函数的非 null 值参数时, 也会输出断言. 总之, 编译器会尽可能地防止 null 值错误在程序中 扩散(然而, 有些时候由于泛型的存在, 不可能完全消除这种错误).

### 6、数据类型映射

### 7、在Kotlin中使用Java的泛型

Kotlin的泛型和Java的泛型有些差异，将Java类型导入到kotlin时，需要进行变换：

1. Java的通配符会被转换为Kotlin的类型投射

```kotlin

Foo<? extends Bar>变换为Foo<out Bar!>!

Foo<? super Bar>变换为Foo<in Bar!>!
```

2. Java的原生类型转换为Kotlin的型号投射

```kotlin

List变换为List<*>，也就是List<out Any?>!
```

与 Java 一样, Kotlin 的泛型信息在运行时不会保留, 也就是说, 创建对象时传递给构造器的类型参数信息, 在对象中不会保留下来, 所以, ArrayList() 与 ArrayList() 在运行时刻是无法区分的. 这就导致无法进行带有泛型信息的 is 判断. Kotlin 只允许对<br>星号投射(star projection)的泛型类型进行 is 判断:

```kotlin

if (a is List<Int>) // 错误: 无法判断它是不是 Int 构成的 List // 但是
if (a is List<*>) // OK: 这里的判断不保证 List 内容的数据类型
```

### 8、Java数组

与 Java 不同, Kotlin 中的数组是不可变的(invariant). 这就意味着, Kotlin 不允许我们将 Array 赋值给 Array , 这样就可以 避免发生运行时错误. 在调用 Kotlin 方法时, 如果参数声明为父类型的数组, 那么将子类型的数组传递给这个参数, 也是禁止的, 但对于 Java 的方法, 这是允许(通过使用 Array<(out) String>! 形式的平台数据类型)。

在 Java 平台上, 会使用基本类型构成的数组, 以避免装箱(boxing)/拆箱(unboxing)操作带来的性能损失. 由于 Kotlin 会隐藏这些实现细节, 因此与 Java 代码交互时需要使用一个替代办法. 对于每种基本类型, 都存在一个专门的类( IntArray , DoubleArray , CharArray , 等等) 来解决这种问题. 这些类与 Array 类没有关系, 而且会被编译为 Java 的基本类型数组, 以便达到最好的性能.

基本类型的数组，编译器会对数组的访问处理进行优化，不会有性能损失；使用下标访问数组也不会有性能损失；in判断也不会有性能损失

### 9、Kotlin调用Java的可变参数（*符号）

Java声明可变参数：

```java

public class JavaArrayExample {
    public void removeIndicesVarArg(int... indices) {
        //     方法代码在这里...
    } 

}
```

Kotlin中将数组传递给Java，为了将 IntArray 传递给这个参数, 需要使用展开`(spread) *` 操作符:

```kotlin

val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

对于使用可变长参数的 Java 方法, 目前无法向它传递 null 参数。

### 10、操作符

由于 Java 中无法将方法标记为操作符重载方法, Kotlin 允许我们使用任何的 Java 方法, 只要方法名称和签名定义满足操作符重载的要求, 或者满足其他规约( invoke() 等等.) 使用中缀调用语法来调用 Java 方法是不允许的。

### 11、受控异常(Checked Exception)

在 Kotlin 中, 所有的异常都是不受控的(unchecked), 也就是说编译器不会强制要求你捕获任何异常. 因此, 当调用 Java 方法时, 如果这个 方法声明了受控异常, Kotlin 不会要求你做任何处理：

```kotlin

fun render(list: List<*>, to: Appendable) { for (item in list) {
    to.append(item.toString()) // Java 会要求我们在这里捕获 IOException }
}
```

### 12、Object 类的方法

当 Java 类型导入 Kotlin 时, 所有 java.lang.Object 类型的引用都会被转换为 Any 类型. 由于 Any 类与具体的实现平台无关, 因此它声明的成员方法只有 toString() , hashCode() 和 equals() , 所以, 为了补足 java.lang.Object 中的其他方法, Kotlin 使用了 扩展函数。

# Kotlin中的符号

## typealias

`typealias` 允许在不引入新类型的情况下为类或函数类型提供别名

```kotlin
typealias Callback = (User) -> Unit

fun getUser(callback: Callback) {
    // 模拟网络请求
    Thread.sleep(2000)
    callback
}

suspend fun getUserCoroutines() = suspendCoroutine<User> { completion ->
    getUser {
        completion.resume(it)
    }
}
```

## import alias

```kotlin
import me.hacket.kotlin.basic.UserAtHAhhhajj as U1
typealias  U  = Userfafdsfdsfjkldafj

class Userfafdsfdsfjkldafj {
    val name:String = "hacket"
}
class UserAtHAhhhajj {
    val name:String = "hacket"
}
fun main() {
    val u  = U()
    println(u.name)
    val u1  = U1()
    println(u1.name)
}
```

# SAM和fun interface

## 什么是SAM？

Single Abstract Method实际上这是Java8中提出的概念。只有一个方法的接口

SAM 转换，即 Single Abstract Method Conversions，就是对于只有单个非默认抽象方法接口的转换 —— 对于符合这个条件的接口（称之为 SAM Type ），在 Kotlin 中可以直接用 Lambda 来表示 —— 当然前提是 Lambda 的所表示函数类型能够跟接口的中方法相匹配。

## [@FunctionalInterface ](/FunctionalInterface)

## fun interface

在Kotlin1.4之前，Kotlin是不支持Kotlin的SAM转换的，可以支持Java SAM转换，官方给出的的解释是：**Kotlin 本身已经有了函数类型和高阶函数，不需要在去SAM转化**。

1.4之前：<br>![](https://note.youdao.com/src/199FBD47CE864E86828FD2A982F6DDE5#id=X3VJM&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1.4及以上：

```kotlin
// 注意需用fun 关键字声明
fun interface Action {
    fun run()
}

fun runAction(a: Action) = a.run()

fun main() {
    // 传递一个对象，OK
    runAction(object : Action{
        override fun run() {
            println("run action")
        }
    })
   // 1.4-M1支持SAM,OK
    runAction {
        println("Hello, Kotlin 1.4!")
    }
}
```

在1.4之前，只能传递一个对象，是不支持Kotlin SAM的，而在1.4之后，可以支持Kotlin SAM,但是用法有一丢丢变化。interface需要使用fun关键字声明。使用fun关键字标记接口后，只要将此类接口作为参数，就可以将lambda作为参数传递。

## 示例

```java
public interface JavaListener {
    void onCheckedChanged(String param1, String param2);
}
```

Java调用：

```java
public class JavaSAMTest {

    static void setJavaListener(JavaListener listener) {
        listener.onCheckedChanged("name", "zyt");
    }

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newScheduledThreadPool(3);
        executorService.execute(() -> System.out.println("hello world"));

        // 匿名内部类调用
        setJavaListener(new JavaListener() {
            @Override
            public void onCheckedChanged(String param1, String param2) {
            }
        });
        // lambda调用
        setJavaListener((param1, param2) -> {
        });
    }
}
```

Kotlin也可以兼容Java的SAM：

```kotlin
fun setJavaListener(listener: JavaListener) {
    listener.onCheckedChanged("name", "zyt")
}
fun main() {
    // 匿名内部类调用
    setJavaListener(object : JavaListener {
        override fun onCheckedChanged(a: String, b: String) {
            print("param1:$a,param2:$b")
        }
    })
    // lambda调用
    setJavaListener { a, b ->
        print("param1:$a,param2:$b") // Compile time error
    }
}
```

那Kotlin的单个方法接口是不是也可以这样写？

```kotlin
interface KotlinListener {
    fun onCheckedChanged(param1: String, param2: String)
}
fun setKotlinListener(listener: KotlinListener) {
    listener.onCheckedChanged("name", "zyt")
}

fun main() {
    // 当我们通过SAM转译调用时,会出现错误 Type mismatch.
    setKotlinListener { a, b ->
        print("param1:$a,param2:$b") // Compile time error
    }
}
```

那怎么才能让kotlin兼容kotlin的SAM，那就是`fun interface`：

```kotlin
fun interface KotlinListener {
    fun onCheckedChanged(param1: String, param2: String)
}
fun setKotlinListener(listener: KotlinListener) {
    listener.onCheckedChanged("name", "zyt")
}
fun main() {
    setKotlinListener { a, b ->
        print("param1:$a,param2:$b") // Compile time error
    }
}
```

# kotlin之constract(1.3 Experimental)

## 为何需要Contract契约

Kotlin中有个非常nice的功能就是类型智能推导(官方称为smart cast), 在使用Kotlin开发的过程中有没有遇到过这样的场景，会发现有时候智能推导能够正确识别出来，有时候却失败了。

案例：contract契约让checkTokenIsValid函数具有被编译器智能推导识别的黑魔法

```kotlin
// @ExperimentalContracts //由于Contract契约API还是Experimental，所以需要使用ExperimentalContracts注解声明
@UseExperimental(ExperimentalContracts::class) // 用这个调用者不会有hint报错提示
fun main(args: Array<String>) {
    val token: String? = TokenGenerator().generateToken("kotlin")
    if (checkTokenIsValid(token)) {//这里判空处理交于函数来处理，根据函数返回值做判断
        println("token length is ${token.length}")//编译正常: 使用自定义契约实现，这里智能推导正常识别
    }
}

@ExperimentalContracts //由于Contract契约API还是Experimental，所以需要使用ExperimentalContracts注解声明
fun checkTokenIsValid(token: String?): Boolean{
    contract {
        returns(true) implies (token != null)
    }
    return token != null && token.isNotBlank()
}
```

## Contract契约基本介绍

Kotlin中的Contract契约是一种向编译器通知函数行为的方法。

```kotlin
@ExperimentalContracts //由于Contract契约API还是Experimental，所以需要使用ExperimentalContracts注解声明
fun checkTokenIsValid(token: String?): Boolean{
    contract {
        returns(true) implies (token != null)
    }
    return token != null && token.isNotBlank()
}
//这里契约的意思是: 调用checkTokenIsValid函数，会产生这样的效果: 如果返回值是true, 那就意味着token != null. 把这个契约行为告知到给编译器，编译器就知道了下次碰到这种情形，你的token就是非空的，自然就smart cast了。注意: 编译器下次才能识别，所以当你改了契约后，你会发现smart cast不会马上生效，而是删除后重新调用才可生效。
```

### Kotlin源码中Contract契约的应用

#### CharSequence类扩展函数isNullOrBlank()、isNullOrEmpty()

```kotlin
@kotlin.internal.InlineOnly
public inline fun CharSequence?.isNullOrBlank(): Boolean {
    contract {
        returns(false) implies (this@isNullOrBlank != null)
    }
    return this == null || this.isBlank()
}
```

契约解释: 这里契约表示告诉编译器:调用isNullOrBlank()扩展函数产生效果是如果该函数的返回值是false，那么就意味着当前CharSequence实例不为空。所以我们可以发现一个细节当你调用isNullOrBlank()只有在取反的时候，smart cast才会生效，不信可以自己试试。

#### requireNotNull函数

```kotlin
@kotlin.internal.InlineOnly
public inline fun <T : Any> requireNotNull(value: T?, lazyMessage: () -> Any): T {
    contract {
        returns() implies (value != null)
    }

    if (value == null) {
        val message = lazyMessage()
        throw IllegalArgumentException(message.toString())
    } else {
        return value
    }
}
```

契约解释: 这里可以看到和上面有点不一样，不带参数的returns()函数，这表示告诉编译器:调用requireNotNull函数后产生效果是如果该函数正常返回，没有异常抛出，那么就意味着value不为空

#### 常见标准库函数run,also,with,apply,let

```kotlin
//以apply函数举例，其他函数同理
@kotlin.internal.InlineOnly
public inline fun <T> T.apply(block: T.() -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    block()
    return this
}
```

契约解释: 调用apply函数后产生效果是指定block lamba表达式参数在适当的位置被调用。适当位置就是block lambda表达式只能在自己函数(这里就是指外层apply函数)被调用期间被调用，当apply函数被调用结束后，block表达式不能被执行，并且指定了`InvocationKind.EXACTLY_ONCE`表示block lambda表达式只能被调用一次，此外这个外层函数还必须是个inline内联函数。

## Contract契约使用限制

1. 我们只能在顶层函数体内使用Contract契约，即我们不能在成员和类函数上使用它们。
2. Contract调用声明必须是函数体内第一条语句
3. 编译器无条件地信任契约;这意味着程序员负责编写正确合理的契约。

## Contract契约背后原理

### contract {}

```kotlin
@ContractsDsl
@ExperimentalContracts
@InlineOnly
@SinceKotlin("1.3")
@Suppress("UNUSED_PARAMETER")
public inline fun contract(builder: ContractBuilder.() -> Unit) { }
```

### Effect

```kotlin
//用来表示一个函数被调用的效果
public interface Effect 
//继承Effect接口，用来表示在观察函数调用后另一个效果之后，某些条件的效果为true。
public interface ConditionalEffect : Effect 

//继承Effect接口,用来表示一个函数调用后的结果(这个一般就是最为普通的Effect)
public interface SimpleEffect : Effect {
    public infix fun implies(booleanExpression: Boolean): ConditionalEffect //infix表明了implies函数是一个中缀函数，那么它调用起来就像是中缀表达式一样
}
//继承SimpleEffect接口,用来表示当一个函数正常返回给定的返回值
public interface Returns : SimpleEffect
//继承SimpleEffect接口,用来表示当一个函数正常返回非空的返回值
public interface ReturnsNotNull : SimpleEffect
//继承Effect接口,用来表示调用函数式参数(lambda表达式参数)的效果，并且函数式参数(lambda表达式参数)只能在自己函数被调用期间被调用，当自己函数被调用结束后，函数式参数(lambda表达式参数)不能被执行.
public interface CallsInPlace : Effect
```

### ContractBuilder.kt

```kotlin
//ContractBuilder接口聚合了不同的Effect返回对应接口对象的函数
public interface ContractBuilder {
    @ContractsDsl public fun returns(): Returns

    @ContractsDsl public fun returns(value: Any?): Returns
    
    @ContractsDsl public fun returnsNotNull(): ReturnsNotNull

    @ContractsDsl public fun <R> callsInPlace(lambda: Function<R>, kind: InvocationKind = InvocationKind.UNKNOWN): CallsInPlace
}

//用于枚举callsInPlace函数lambda表达式参数被调用次数情况
public enum class InvocationKind {
    //最多只能被调用一次(不能调用或只能被调用1次)
    @ContractsDsl AT_MOST_ONCE,
    //至少被调用一次(只能调用1次或多次)
    @ContractsDsl AT_LEAST_ONCE,
    //仅仅只能调用一次
    @ContractsDsl EXACTLY_ONCE,
    //不能确定被调用多少次
    @ContractsDsl UNKNOWN
}
```

### 理清Effect之间关系

```kotlin
fun checkTokenIsValid(token: String?): Boolean{
    contract {//首先这里实际上就是调用那个contract函数传入一个带ContractBuilder类型返回值的Lambad表达式。
        returns(true) implies (token != null)
        //然后这里开始定义契约规则，lambda表达式体内就是ContractBuilder，所以这里的returns(value)函数实际上相当于this.returns(true);
        //再接着分析implies函数这是一个中缀调用可以看到写起来像中缀表达式，实际上相当于returns(value)函数返回一个Returns接口对象，Returns接口是继承了SimpleEffect接口(带有implies中缀函数)的，所以直接用Returns接口对象中缀调用implies函数
    }
    return token != null && token.isNotBlank()
}
```

> 契约描述的实际上就是函数的行为，包括函数返回值、函数中lambda表达式形参在函数内部执行规则。把这些行为约束告知给编译器，可以节省编译器智能分析的时间，相当于开发者帮助编译器更快更高效做一些智能推导事情。

# Kotlin之infix关键字

中缀调用

1. infix 不能定义成顶层函数，必须是某个类的成员函数，可使用扩展方法的方式将它定义到某个类中
2. infix 函数必须且只有能接收一个参数，类型的话没有限制。

```kotlin
infix fun String.begin(prefix: String): Boolean = this.startsWith(prefix)
```

调用

```kotlin
val a = result begin "hacket"
```

# Kotlin lateinit 和 by lazy

## lateinit

1. lateinit 只能用在var类型，不能用于局部变量
2. lateinit可以在任何位置初始化并且可以初始化多次。
3. lateinit 有支持（反向）域（Backing Fields）
4. lateinit不能用在可空的属性上和基本数据类型上

```kotlin
lateinit var name:String
lateinit var age:Int // 报错
```

如果`lateinit`变量没有初始化，会报错：

```
Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property pagerAdapter has not been initialized
	at TestLazyKt.main(TestLazy.kt:6)
```

这块需要注意的是，即使咱们觉得不会为空，但肯定会有特殊情况需要进行判断，需要进行判断的话要使用 isInitialized ，使用方法如下：

```kotlin
if (::name.isInitialized){
    // 判断是否已经进行赋值
}
```

## lazy

lazy() 是接受一个lambda 并返回一个 Lazy  实例的函数，返回的实例可以作为实现延迟属性的委托。

> 也就是说：第一次调用get() 会执行已传递给 lazy() 的 lambda 表达式并记录结果， 后续调用get() 只是返回记录的结果。和set没啥关系。

1. lazy{} 只能用在val类型
2. lazy在第一次被调用时就被初始化，想要被改变只能重新定义；以后调用该属性会返回之前的结果。
3. 默认情况下，对于 lazy 属性的求值是同步锁的（synchronized）：该值只在一个线程中计算，并且所有线程会看到相同的值。如果初始化委托的同步锁不是必需的，这样多个线程可以同时执行，那么将`LazyThreadSafetyMode.PUBLICATION`作为参数传递给 lazy() 函数。 而如果你确定初始化将总是发生在单个线程，那么你可以使用 LazyThreadSafetyMode.NONE模式， 它不会有任何线程安全的保证和相关的开销。

### 应用场景

- 常量初始化
- 常见操作，只获取，不赋值，并且多次使用的对象
- acitivity中控件初始化的操作，一般传统的进入界面就初始化所有的控件，而使用懒加载，只有用到时才会对控件初始化

```kotlin
class TestCase {
    private val name: String by lazy(LazyThreadSafetyMode.NONE) { "hacket" }
    
    private val mFragments by lazy() { arrayListOf(MyCollectionRoomFragment.newInstance(), MyRecentlyRoomFragment.newInstance(), MyJoinedRoomFragment.newInstance()) }
    
    private lateinit var age: String
    init {
//        println(age) // 报错
        println(name)
        printname()
//        name = "" // 报错，val不能改变
    }

    fun printname() {
        age = "haha"
        println(name + age)
    }
    
    //kotlin 封装：
    fun <V : View> Activity.bindView(id: Int): Lazy<V> = lazy {
        viewFinder(id) as V
    }
    
    //acitivity中扩展调用
    private val Activity.viewFinder: Activity.(Int) -> View?
        get() = { findViewById(it) }
    
    
    //在activity中的使用姿势
    val mTextView by bindView<TextView>(R.id.text_view)
    mTextView.text="执行到我时，才会进行控件初始化"
}
```

## 延迟属性Lazy 与 lateinit 区别

1. lazy { ... }代表只能用于val属性，而lateinit只能用于var，因为它不能编译到final字段，因此不能保证不变性;
2. lateinit var具有存储值的后备字段(backing field)，而by lazy { ... }创建一个委托对象，其中存储一次计算的值，将对代理实例的引用存储在类对象中，并为与委托实例一起使用的属性生成getter。
3. 除了val之外，lateinit不能用于可空属性和Java原语类型(这是因为null用于未初始化的值);所以如果你需要在类中存在的支持字段，请使用lateinit;<br>lateinit var可以从对象被看到的任何地方被初始化。从一个框架代码的内部，多个初始化方案是可能的单一类的不同对象。 by lazy { ... }反过来又定义了属性的唯一初始化器，只能通过覆盖子类中的属性进行更改。如果您希望以预先未知的方式从外部初始化属性，请使用lateinit。

Delegates.notNull()，它适用于non-null属性的延迟初始化，包括Java原始类型的属性。

# Kotlin style

## Kotlin style guide(Google官方)

<https://developer.android.com/kotlin/style-guide>

## ktlint
