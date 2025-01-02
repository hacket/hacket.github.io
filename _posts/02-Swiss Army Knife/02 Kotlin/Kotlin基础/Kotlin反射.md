---
date created: 2024-12-27 23:45
date updated: 2024-12-27 23:45
dg-publish: true
tags:
  - '#1'
---

- [ ] [Reflection（官方文档）](https://kotlinlang.org/docs/reflection.html#jvm-dependency)

![](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1684690271651-7ce8089a-e987-4228-adde-58437d5bf4bf.jpeg)

# Kotlin反射基础

## Kotlin反射和Java反射

**Kotlin反射类图：**<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684403639245-4e26927c-8da5-43e4-a165-df72f198fbad.png#averageHue=%23f9f9f9&clientId=u4f7c4e4c-8850-4&from=paste&height=365&id=u34acf059&originHeight=1324&originWidth=1256&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156079&status=done&style=none&taskId=ud648b3e8-4c4d-4849-bb64-f0c9fce86ca&title=&width=346)<br>**Java反射类图：**<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684403717118-d9af39ac-36fc-4a08-88e1-7e738574b3c7.png#averageHue=%23f9f9f9&clientId=u4f7c4e4c-8850-4&from=paste&height=221&id=u9ff1354b&originHeight=1064&originWidth=2164&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200723&status=done&style=none&taskId=ua85f08df-ac53-4329-afd3-9016729b50a&title=&width=449)<br>Kotlin 和 Java 的对比：

- Kotlin 的反射类都是基于 KAnnotatedElement, 而 Java 的反射类都是基于 AnnotateElement；
- Kotlin 的 KCallable 和 Java 的 AccessiableObject 都是可用元素；
- Kotlin 的 KProperty 和 Java 的 Field 不太相同。 Kotlin 的 KProperty 通常指相应的 Getter 和 Setter 整体作为一个 KProperty(不存在字段的概念),而 Java 的 Field 通常仅仅指字段本身。

## 引入reflect库

Kotlin 的反射需要集成 `org.jetbrains.kotlin:kotlin-reflect` 仓库,版本保持与 kotlin 一致。

```kotlin
implementation "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
```

## 常用API

```kotlin
// 1.通过类::class的方式获取Kclass实例
val clazz1: KClass<*> = XXX::class
// 2. 通过实例.javaClass.kotlin获取Kclass实例
var xxx = XXX()
val clazz2 = xxx.javaClass.kotlin

// 构造函数Constructor
// 返回这个类的所有构造器
public val constructors: Collection<KFunction<T>>

// 成员变量和成员函数
//返回类可访问的所有函数和属性，包括继承自基类的，但是不包括构造器
override val members: Collection<KCallable<*>>
//返回类声明的所有函数
val KClass<*>.declaredFunctions: Collection<KFunction<*>>
//返回类的扩展函数
val KClass<*>.declaredMemberExtensionFunctions: Collection<KFunction<*>>
//返回类的扩展属性
val <T : Any> KClass<T>.declaredMemberExtensionProperties: Collection<KProperty2<T, *, *>>
//返回类自身声明的成员函数
val KClass<*>.declaredMemberFunctions: Collection<KFunction<*>>
//返回类自身声明的成员变量（属性）
val <T : Any> KClass<T>.declaredMemberProperties: Collection<KProperty1<T, *>>

// 类相关信息
//1.返回类的名字
public val simpleName: String?
//2.返回类的全包名
public val qualifiedName: String?
//3.如果这个类声明为object，则返回其实例，否则返回null
public val objectInstance: T?
//4.返回类的可见性
@SinceKotlin("1.1")
public val visibility: KVisibility?
//5.判断类是否为final类（在Kotlin中，类默认是final的，除非这个类声明为open或者abstract)
@SinceKotlin("1.1")
public val isFinal: Boolean
//6.判断类是否是open的(abstract类也是open的），表示这个类可以被继承
@SinceKotlin("1.1")
public val isOpen: Boolean
//7.判断类是否为抽象类
@SinceKotlin("1.1")
public val isAbstract: Boolean
//8.判断类是否为密封类，密封类:用sealed修饰，其子类只能在其内部定义
@SinceKotlin("1.1")
public val isSealed: Boolean
//9.判断类是否为data类
@SinceKotlin("1.1")
public val isData: Boolean
//10.判断类是否为成员类
@SinceKotlin("1.1")
public val isInner: Boolean
//11.判断类是否为companion object
@SinceKotlin("1.1")
public val isCompanion: Boolean 
//12.返回类中定义的其他类，包括内部类(inner class声明的)和嵌套类(class声明的)
public val nestedClasses: Collection<KClass<*>>
//13.判断一个对象是否为此类的实例
@SinceKotlin("1.1")
public fun isInstance(value: Any?): Boolean
//14.返回这个类的泛型列表
@SinceKotlin("1.1")
public val typeParameters: List<KTypeParameter>
//15.类其直接基类的列表
@SinceKotlin("1.1")
public val supertypes: List<KType>
//16.返回类所有的基类
val KClass<*>.allSuperclasses: Collection<KClass<*>>
//17.返回类的伴生对象companionObject
val KClass<*>.companionObject: KClass<*>?

```

### 类引用

Kotlin中的类引用用`KClass`表示，引用的是KClass对象，Java的类引用是`java.lang.Class`对象，二者不一样

```kotlin
// 已知Kotlin类，获取KClass
val kClass = TestObj::class // KClass<TestObj>

// 已知Kotlin对象，获取KClass和Class
val testObj = TestObj("hacket")
val kClass1 = testObj::class  // KClass<TestObj>
val clazz2 = testObj.javaClass // Class<TestObj>

// 通过KClass获取对应的Java类引用：调用KClass对象的java属性
val clazz1 = testObj::class.java // Class<TestObj>
val clazz = TestObj::class.java // Class<TestObj>
```

### 反射创建实例

#### 方式一

获取到KClass对象后，可以调用其`createInstance()`方法创建该类的实例，该方法**_总是调用该列无参构造器创建的实例_**，因此使用该方法的前提就是必须提供无参构造器或构造器都是默认参数

#### 方式二

通过获取到的KClass对象的，借助其constructors获取到所有构造器，再利用条件判断返回目标构造器，最后通过目标构造器对象的`call()`创建出对应的实例

#### 案例

```kotlin
val itemClz = Item::class;
val instance = itemClz.createInstance()
println("1. createInstance()调用无参构造器创建实例")
println("instance.name=${instance.name},instance.price=${instance.price}")

println("2. 调用有参构造器创建实例")
itemClz.constructors.forEach {
    if (it.parameters.size == 2) {
        val instance = it.call("酸奶", 9.0)
        println("instance.name=${instance.name},instance.price=${instance.price}")
    }
}
class Item(var name: String) {
    var price = 0.0
    constructor(name: String, price: Double) : this(name) {
        this.price = price
    }
    constructor() : this("未知商品") {
    }
}
```

输出：

```
1. createInstance()调用无参构造器创建实例
instance.name=未知商品,instance.price=0.0
2. 调用有参构造器创建实例
instance.name=酸奶,instance.price=9.0
```

### 构造器引用

构造器本质也是函数，即一个返回值为当前类实例的函数，可以将构造器引用当成函数使用；Kotlin允许通过`::`操作符并添加类名来引用**_主构造器_**（`::类名`）

```kotlin
private fun testConstructor() {
    val fruit = Fruit()
    fruit.test(::Fruit)
}


class Fruit(var name: String = "未知") {
    fun test(apple: (String) -> Fruit) {
        val apple1: Fruit = apple("苹果")
        println("Fruit实例name属性：${apple1.name}")
    }
}
```

输出：

```
Fruit实例name属性：苹果
```

和函数作为方法形参也一样，当把函数赋值给变量时，通过"::函数名"既可，构造器大同小异，是通过"`::类名`"将构造器赋值给变量；

需要说明的是：如果要调用Kotlin构造器引用对应的Java构造器对象，则可通过`KFunction`的扩展属性javaConstructor来实现；

```kotlin
// 调用构造器引用的javaCostructor属性，需要导入Kotlin.reflect.jvm包，这些扩展属性属于与Java反射互相操作的部分
::Fruit.javaConstructor
```

### 调用方法 KFunction

所有构造器和方法都是`KFunction`的实例，调用他们可以通过其`call()`方法；

1. 获取方法对象（`KFunction`的实例）
2. 调用方法对象的`call()`

方法是面向对象的，必须有主谓宾如（“猪八戒.吃（西瓜）”），因此在转函数时其形参都是会比对应方法多一个参数即：主语（方法调用者），就变了"吃（猪八戒，西瓜）"

```kotlin
fun testFunction() {
    val kclz = Foo::class
    val instance = kclz.createInstance()
    kclz.declaredMemberFunctions.forEach {
        println("Foo所有成员方法：$it \n parameters[0]=${it.parameters[0]}\n parameters[1]=${it.parameters[1]}")
        if (it.parameters.size == 2) {
            it.call(instance, "Hello Kotlin")
        }
    }
}

class Foo {
    fun test(msg: String) {
        println("执行带参方法，mag=$msg")
    }
}
```

输出：

```
Foo所有成员方法：fun me.hacket.reflect.Foo.test(kotlin.String): kotlin.Unit 
 parameters[0]=instance parameter of fun me.hacket.reflect.Foo.test(kotlin.String): kotlin.Unit
 parameters[1]=parameter #1 msg of fun me.hacket.reflect.Foo.test(kotlin.String): kotlin.Unit
执行带参方法，mag=Hello Kotlin
```

> 反射调用test方法，除了正常的参数msg外，第1个位置的隐藏参数为Foo对象实例

### 函数引用

我们多次说过，函数也是一等公民，将函数赋值给引用是`::函数名`

```kotlin
fun testFunctionRef() {
    // 当我们将函数赋值给未显示指定变量类型的引用，就会报错
    // var f = ::isSmall
    // 这儿就必须显示声明变量类型，正确写法
    val f: (String) -> Boolean = ::isSmall
}

fun isSmall(i: String) = i.length < 5

fun isSmall(i: Int) = i < 5
```

如果将**成员方法**或**扩展方法**赋值给引用，需要使用限定：**_类名::成员/扩展方法_**。方法类型也不是函数的`(形参类型)->返回值类型`类型，同样需要使用限定即**_类名.(形参类型)->返回值类型_**

总结：

1. _函数赋值_给引用变量是`::函数名`,该变量类型为函数类型是`(形参类型)->返回值类型`，
2. _类方法、扩展方法赋值_给引用变量时是`类名::方法名`，该变量类型是`类名.(形参类型)->返回值类型`
3. 如果要获取Kotlin函数引用的java方法对象，可以通过KFunction的扩展属性javaMethod实现：`::方法名.javaMeethod`

### 访问属性值

获取到KClass对象后，通过该对象来获取该类包含的属性：

1. KProperty：代表**_通用的属性_**，他是KCallable的子接口
2. KMutableProperty：代表通用的读写属性，他是KProperty的子接口
3. KProperty0：代表无需调用者的属性（静态属性），他是KPropety的子接口
4. KMutableProperty0：代表无需调用者的读写属性（静态读写属性），他是Kproperty的子接口
5. Kproperty1: 代表需要1个调用者的属性（成员属性），他是KProperty的子接口
6. KMutableProperty1: 代表一个调用者的读写属性（成员读写属性）他是KProperty1的子接口；
7. Kproperty2: 代表需要两个调用者的属性（扩展属性），他是KProperty的子接口
8. KMutableProperty2: 代表需要2个调用者的读写属性（扩展读写属性），他是KProperty2的子接口

> 从命名字面意思就可以知道：Mutable：表示读写属性；PropertyN中的数字表示：0：表示无需调用者即静态属性，1：成员属性，2：表示扩展属性

![](https://note.youdao.com/yws/res/103810/491F4F7D0CEE4143941BCAE5EEBBCB90#id=CNHmn&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

当获取到KProperty对象后，可以调用`get()`方法获取该属性的值；如果是读写属性，需要设置值，则需要获取代表读写属性KMutableProperty对象，调用`set()`

```kotlin
fun testField() {
    val userKClass = User::class
    val members = userKClass.members
    println("User members.size=${members.size}\nmembers=${members}")
    val m0 = members.iterator().next()
    println("members[0] = $m0")
}

data class User(
    val name: String,
    val age: Int
)
```

输出：

```
User members.size=8
members=[val me.hacket.reflect.User.age: kotlin.Int, val me.hacket.reflect.User.name: kotlin.String, fun me.hacket.reflect.User.component1(): kotlin.String, fun me.hacket.reflect.User.component2(): kotlin.Int, fun me.hacket.reflect.User.copy(kotlin.String, kotlin.Int): me.hacket.reflect.User, fun me.hacket.reflect.User.equals(kotlin.Any?): kotlin.Boolean, fun me.hacket.reflect.User.hashCode(): kotlin.Int, fun me.hacket.reflect.User.toString(): kotlin.String]
val me.hacket.reflect.User.age: kotlin.Int
```

### 属性引用

Kotlin同样提供了`::`符号加属性名的形式获取属性引用；获取的属性引用属于前面的KProperty及其子类接口实例；获取到的读写属性引用，可以调用set()、get()修改、获取属性值，只读属性可以通过get()方法获取属性值

- 包级属性：`::属性名`
- 类成员属性：`类名::属性名`
- 在kotlin.reflect.jvm包下提供了Kotlin属性与java反射互操作的扩展属性(kotlin属性对应java中的字段、getter、setter方法三种成员)，Kproperty类包含三个扩展属性：
  1. javaField: 获取该属性的幕后字段（如果该属性有幕后字段），该属性返回java.lang.reflect.Field对象
  2. javaGetter:获取该属性的getter方法，该属性返回java.lang.reflect.Method对象
  3. javaSetter:获取该属性的setter方法（如果该属性是读写属性），该属性返回java.lang.reflect.Method对象

### 绑定的方法与属性引用

前面我们在获取**_类中_**静态属性、实例属性、静态方法、实例方法引用时，都是直接通过类名限定（类名::方法名、属性名），在获取到方法引用、属性引用时，无论是调用方法或者设置属性值时第一个参数**_必须传入该方法、属性的调用者即该方法、属性所属对象实例_**（参数个数=等于形参个数+方法调用者）

Kotlin1.1支持绑定的方法与属性引用，方法、属性引用不是通过类（名）获取（如：类名::方法名），而是通过对象获取（如：“对象名::方法/属性名”），这样在调用该方法是将不用在传入该方法的调用者了（其实就是获取实例方法、实例属性引用）；

```kotlin
val str = "kotlin"
val f: (CharSequence, Boolean) -> Boolean = str::endsWith

// 无须再传入方法调用者
f("lin", true)
```

# Kotlin反射案例

- Kotlin中反射修改final的值，用Java反射更简单？

# Ref

- [ ] [Kotlin学习手记——反射](https://blog.csdn.net/lyabc123456/article/details/112341465)

> 详细，值得一看

[链接](http://www.yxhuang.com/2021/08/01/kotlin-reflect/)<br><https://blog.csdn.net/yxhuang2008/article/details/119294187><br><https://aisia.moe/2018/01/07/kotlin-jiqiao/><br><https://blog.csdn.net/qq_31339141/article/details/108411934?ydreferer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS5oay8%3D><br>[反射调用Kotlin类里的Companion函数](https://blog.csdn.net/qq_37299249/article/details/84304001)
