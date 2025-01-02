---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
---

# Kotlin基础

## Kotlin有哪些特性？

1. **简洁**：更少的代码实现更多的功能，少编写样板代码；
   1. data class相对于Java Bean自动重写了getter、setter、equals/hashCode、toString、componentN、copy等方法
   2. 扩展函数、扩展属性
   3. lambda表达式（高阶函数）
   4. 智能转换
   5. 字符串模板
   6. 类委托
2. **更安全的代码**
   1. Null Safety 空指针安全，降低出现NPE的概率
   2. 密封类，防止when出现其他分支的错误
   3. 类默认不可继承，方法默认不可重写
3. **Java和Kotlin互相调用方便**
4. **协程**
   1. 异步代码同步编写
   2. 结构化并发

## kt中的Any和Java中的Object有什么区别？

```java
public open class Any {
    public open operator fun equals(other: Any?): Boolean
    public open fun hashCode(): Int
    public open fun toString(): String
}
```

1. Object是Java中所有类的超类, Any是Kotlin的所有超类；Kotlin类可以使用继承自Any的toString、equals和hashCode方法，但是不能使用Object的其他方法(如wait和notify)可以手动把值转换成java.lang.Object使用。
2. Any中定义的方法有：toString()、equals()、hashCode()  3个
3. Object类中定义的方法有：toString()、equals()、hashCode()、getClass()、clone()、finalize()、notify()、notifyAll()、wait()、wait(long)、wait(long,int)  11个
4. Kotlin编译器将kotlin.Any和java.lang.Object类视作两个不同的类，但是在运行时它们俩就是一样的。你可以打印：

```java
fun main() {
    println(Any().javaClass)
}
// 输出：
// class java.lang.Object
// 发现打印出“class java.lang.Object”，因为javaClass属性代表一个运行时对象的类型

fun main() {
    var o = Object()
    println(o is Any) // true
    var a = Any()
    println(a is Object) // true
}
```

> 总结：Any和Object只是编译期不一样；运行期Any和Object是一样的。

## kt中的Unit和Java中的void区别？还有Nothing

```kotlin
public object Unit {
    override fun toString() = "kotlin.Unit"
}
```

```kotlin
public class Nothing private constructor()
```

**相同点：**

> 两者概念相同

**不同点：**

1. Unit是一个类，继承自Any类，方法的返回类型为Unit时，可以省略；单例（目的在于函数返回 Unit 时避免分配内存）
2. void是Java中的一个关键字；Void：Java中的方法无法回类型时使用，但是不能省略；
3. Nothing：任何类型的子类，编译器对其有优化，有一定的推导能力，另外其常常和抛出异常一起使用；

```kotlin
@Throws(IOException::class)
private fun invalidLengths(strings: List<String>): Nothing {
    throw IOException("unexpected journal line: $strings")
}
```

## Kotlin和Java互相调用注意？

kotlin调用java的时候 如果java返回值可能为 null 那就必须加上@nullable 否则kotlin无法识别，也就不会强制你做非空处理，一旦java返回了 null 那么必定会出现null指针异常，加上@nullable 注解之后kotlin就能识别到java方法可能会返回null，编译器就能会知道，并且强制你做非null处理，这也就是kotlin的空安全

> Java提供给Kotlin调用的代码最好加上`@Nullable`、`@Nonable`注解

## Kotlin中的单例，和Java对比？

1. 饿汉式

```kotlin
// Java 实现
public class Config{
    private static Config INSTANCE = new Config();
    private Config(){
        //构造函数
    }
    public static Config getInstance(){
        return INSTANCE;
    }
}
// kt实现
object Config {}
```

2. 懒汉式

```kotlin
// Java实现
public class Config{
    private static Config INSTANCE;
    private Config(){
        //构造函数
    }
    public static synchronized Config getInstance(){
        if(null==INSTANCE){
            INSTANCE = new Config();
        }
        return INSTANCE;
    }
}

// kt实现
class Config{
     companion object{
        private var instance:Config?=null
        @Synchronized
        fun get():Config{
            if(null==instance) instance=Config()
            return instance
        }
     }
}
```

3. 双重检测

```kotlin
// Java实现
public class Config{
    private static volatile Config INSTANCE;
    private Config(){
        // 构造函数
    }
    public static Config getInstance(){
        if(INSTANCE == null){
            synchronized(Config.class){
                if(INSTANCE == null){
                     INSTSANCE = new Config();
                }
            }
        }
        return INSTANCE;
    }
}
// kt实现
class Config{
    companion object{
        val instance by lazy(LazyThreadSafetyMode.SYNCHRONIZED){
            Config()
        }
    }
}
```

4. 静态内部类写法

```kotlin
// Java实现
public class Config {
    private static class Helper {
        private static Config INSTANCE = new Config();
    }
    private Config(){
        //构造函数
    }
    public static Config getInstance(){
        return Helper.INSTANCE;
    }
}
// kt实现
class Singleton private constructor() {
    companion object {
        val instance = SingletonHolder.holder
    }
    private object SingletonHolder {
        val holder = Singleton()
    }
}
```

5. 枚举类

```kotlin
enum class Singleton {
    INSTANCE;
}
```

## object的原理

object就是饿汉式的单例

```kotlin
object objectTest {
    fun getInstance(): String {
        return ""
    }
}
```

反编译后：

```java
public final class objectTest {
   @NotNull
   public static final objectTest INSTANCE;

   @NotNull
   public final String getInstance() {
      return "";
   }

   private objectTest() {
   }

   static {
      objectTest var0 = new objectTest();
      INSTANCE = var0;
   }
}
```

1. 构造方法私有，无法在外部进行对象生成
2. object修饰的单例是线程安全的，这是因为在其类构造方法初始化的时候就完成了实例的生成，这个是由类加载器来保证的。
3. 会生成一个INSTANCE实例，该实例在static代码块中初始化

## infix 关键字的原理和使用场景？

用来修饰函数，使用了 infix 关键字的函数称为中缀函数，使用时可以省略点表达式和括号。让代码看起来更加优雅，更加语义化。<br>原理不过是编译器在语法层面给与了支持，编译为 Java 代码后可以看到就是普通的函数调用。<br>kotlin 的很多特性都是在语法和编译器上的优化。

## 扩展函数是怎么实现的？

```kotlin
fun String.s(): String {
    return "$this-s"
}
```

kt扩展函数原理：

- 通过**Java的静态方法**实现的
- 扩展哪个类，哪个类就作为参数传递到这个静态方法中
- 不能访问扩展类的私有成员变量
- 扩展函数没有额外的性能消耗

扩展函数反编译成Java代码：

```java
public final class ExtFunKt {
   @NotNull
   public static final String s(@NotNull String $this$s) {
      Intrinsics.checkNotNullParameter($this$s, "$this$s");
      return $this$s + "-s";
   }
}
```

## lateinit 和 by lazy 的区别？

### lateinit和by lazy区别？

1. lateinit用来实现**延迟初始化**；by lazy用于**懒加载**，第一次使用时被初始化，lazy{} 是个顶层函数，其实是一个Lazy实例
2. lazy{}只能用在val类型上；而lateinit只能用在var上
3. lateinit不能用在可空的属性与Java的基本类型上
4. lateinit可以在任何位置初始化并且可以初始化多次；而lazy在第一次被调用时就被初始化，想要被改变只能重新定义
5. lateinit有支持backing fields(反向域)

### lateinit原理

```kotlin
class lateinitTest {
    lateinit var name: String
    fun checkName(): String {
        val name1 = ::name
        if (::name.isInitialized) {
            return "$name success"
        }
        return "$name failed"
    }
}
```

反编译后：<br>lateinit修饰的属性，在用的时候判断有没有初始化，没有的话抛出UninitializedPropertyAccessException

```java
public final class lateinitTest {
   public String name;

   @NotNull
   public final String getName() {
      String var10000 = this.name;
      if (var10000 == null) {
         Intrinsics.throwUninitializedPropertyAccessException("name");
      }
      return var10000;
   }
   public final void setName(@NotNull String var1) {
      Intrinsics.checkNotNullParameter(var1, "<set-?>");
      this.name = var1;
   }
   @NotNull
   public final String checkName() {
      new lateinitTest$checkName$name1$1((lateinitTest)this);
      StringBuilder var10000;
      String var10001;
      if (((lateinitTest)this).name != null) {
         var10000 = new StringBuilder();
         var10001 = this.name;
         if (var10001 == null) {
            Intrinsics.throwUninitializedPropertyAccessException("name");
         }

         return var10000.append(var10001).append(" success").toString();
      } else {
         var10000 = new StringBuilder();
         var10001 = this.name;
         if (var10001 == null) {
            Intrinsics.throwUninitializedPropertyAccessException("name");
         }

         return var10000.append(var10001).append(" failed").toString();
      }
   }
}
```

### by lazy原理

```kotlin
class lazyTest {
    val name by lazy {
        "test"
    }
    fun checkName(): Boolean = name.isNotEmpty()
}
```

`lazy{}`源码：

```kotlin
public actual fun <T> lazy(initializer: () -> T): Lazy<T> = SynchronizedLazyImpl(initializer)
public actual fun <T> lazy(mode: LazyThreadSafetyMode, initializer: () -> T): Lazy<T> =
    when (mode) {
        LazyThreadSafetyMode.SYNCHRONIZED -> SynchronizedLazyImpl(initializer)
        LazyThreadSafetyMode.PUBLICATION -> SafePublicationLazyImpl(initializer)
        LazyThreadSafetyMode.NONE -> UnsafeLazyImpl(initializer)
    }
```

`lazy()`接受一个lambda表达式并返回一个Lazy实例，第一次调用get()会执行已传递给lazy()的lambda表达式并记录结果，后续调用get()只是返回记录的结果。<br>lazy{}代码反编译：

```java
public final class lazyTest {
   @NotNull
   private final Lazy name$delegate;
   @NotNull
   public final String getName() {
      Lazy var1 = this.name$delegate;
      Object var3 = null;
      return (String)var1.getValue();
   }
   public final boolean checkName() {
      CharSequence var1 = (CharSequence)this.getName();
      return var1.length() > 0;
   }
   public lazyTest() {
      this.name$delegate = LazyKt.lazy((Function0)null.INSTANCE);
   }
}

```

Lazy默认的实现类是`SynchronizedLazyImpl`，线程安全的，在使用的getName()的时候会调用lazy的`getValue()`方法。

## null safety

### kotlin 实现空安全判断的原理

```kotlin
class TestDome {
    fun Test01(name: String) {
        name.length
    }

    fun Test02(name: String?) {
        name?.length
    }

    fun Test03(name: String?) {
        name!!.length
    }
}
```

转换为Bytecode：

```java
public final class me/hacket/kt/基础/TestDome {

  // access flags 0x11
  public final Test01(Ljava/lang/String;)V
    // annotable parameter count: 1 (visible)
    // annotable parameter count: 1 (invisible)
    @Lorg/jetbrains/annotations/NotNull;() // invisible, parameter 0 // 通过注解标示参数是否可以为null
   L0
    ALOAD 1
    LDC "name"
    // 判断name参数是否不为null，为null抛出NPE
    INVOKESTATIC kotlin/jvm/internal/Intrinsics.checkNotNullParameter (Ljava/lang/Object;Ljava/lang/String;)V
   L1
    LINENUMBER 9 L1
    ALOAD 1
    INVOKEVIRTUAL java/lang/String.length ()I
    POP
   L2
    LINENUMBER 10 L2
    RETURN
   L3
    LOCALVARIABLE this Lme/hacket/kt/基础/TestDome; L0 L3 0
    LOCALVARIABLE name Ljava/lang/String; L0 L3 1
    MAXSTACK = 2
    MAXLOCALS = 2

  // access flags 0x11
  public final Test02(Ljava/lang/String;)V
    // annotable parameter count: 1 (visible)
    // annotable parameter count: 1 (invisible)
    @Lorg/jetbrains/annotations/Nullable;() // invisible, parameter 0 // 表示可以为空值
   L0
    LINENUMBER 13 L0
    ALOAD 1
    DUP
    IFNULL L1 // 如果是null 执行L1即Pop方法，不会执行后续的length()方法了
    INVOKEVIRTUAL java/lang/String.length ()I
    POP
    GOTO L2
   L1
    POP
   L2
   L3
    LINENUMBER 14 L3
    RETURN
   L4
    LOCALVARIABLE this Lme/hacket/kt/基础/TestDome; L0 L4 0
    LOCALVARIABLE name Ljava/lang/String; L0 L4 1
    MAXSTACK = 2
    MAXLOCALS = 2

  // access flags 0x11
  public final Test03(Ljava/lang/String;)V
    // annotable parameter count: 1 (visible)
    // annotable parameter count: 1 (invisible)
    @Lorg/jetbrains/annotations/Nullable;() // invisible, parameter 0 // 表示可以为空值
   L0
    LINENUMBER 17 L0
    ALOAD 1
    DUP
    // 先判断参数是否不为null，为null就会抛出NPE
    INVOKESTATIC kotlin/jvm/internal/Intrinsics.checkNotNull (Ljava/lang/Object;)V
    INVOKEVIRTUAL java/lang/String.length ()I
    POP
   L1
    LINENUMBER 18 L1
    RETURN
   L2
    LOCALVARIABLE this Lme/hacket/kt/基础/TestDome; L0 L2 0
    LOCALVARIABLE name Ljava/lang/String; L0 L2 1
    MAXSTACK = 2
    MAXLOCALS = 2

  // access flags 0x1
  public <init>()V
   L0
    LINENUMBER 7 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this Lme/hacket/kt/基础/TestDome; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  @Lkotlin/Metadata;(mv={1, 7, 1}, k=1, d1={"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\u0008\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\u0008\u0003\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006J\u0010\u0010\u0007\u001a\u00020\u00042\u0008\u0010\u0005\u001a\u0004\u0018\u00010\u0006J\u0010\u0010\u0008\u001a\u00020\u00042\u0008\u0010\u0005\u001a\u0004\u0018\u00010\u0006\u00a8\u0006\u0009"}, d2={"Lme/hacket/kt/\u57fa\u7840/TestDome;", "", "()V", "Test01", "", "name", "", "Test02", "Test03", "king-assist.JavaKotlinCodeLabs.main"})
  // compiled from: 可空判断原理.kt
}
```

1. 首先通过注解 `@Lorg/jetbrains/annotations/NotNull`和`@Lorg/jetbrains/annotations/Nullable`来向编译器标示参数是否为空，如果不为空则通过 `INVOKESTATIC kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull (Ljava/lang/Object;Ljava/lang/String;)`来进行检查，此时如果我们给个空值则编译器出现报错提示
2. 对用使用` ?.  `操作符号Kotlin会判断是否为null，如果不为null执行对应的逻辑，如果为null则什么也不执行（此时的默认结果也是null）
3. 对用使用`!!`操作符号Kotlin首先会调用`Intrinsics.checkNotNull()`判断参数是否为null，如果为null 则抛出异常，不为null才会执行后续逻辑

### 可空变量，已经判断!=null，为什么编译器提示还需要添加?.

```kotlin
var left: Node? = null
    
fun show() {
    if (left != null) {
        queue.add(left) // ERROR HERE
    }
}
```

**原因：**<br>Between execution of left != null and queue.add(left) another thread could have changed the value of left to null. (会有其他线程访问改变left)<br>[Smart cast to 'Type' is impossible, because 'variable' is a mutable property that could have been changed by this time](https://stackoverflow.com/questions/44595529/smart-cast-to-type-is-impossible-because-variable-is-a-mutable-property-tha)<br>[Let, Also, Apply, Run, With - Kotlin Scope Functions](https://www.youtube.com/watch?v=Vy-dS2SVoHk)

#

# Kotlin 集合

## 谈谈Kotlin中的Sequence，为什么它处理集合操作更加高效？

**普通集合**

```kotlin
fun testList() {
    val list = mutableListOf<Int>()
    list.map { it + 1 }
        .filter { it % 2 == 0 }
        .count { it < 3 }
}
```

处理集合时性能损耗的最大原因是循环。集合元素迭代的次数越少性能越好。<br>反编译成Java代码，Kotlin编译器会创建三个while循环。

```java
public static final void testList() {
      List list = (List)(new ArrayList());
      Iterable $this$count$iv = (Iterable)list;
      int $i$f$count = false;
      Collection destination$iv$iv = (Collection)(new ArrayList(CollectionsKt.collectionSizeOrDefault($this$count$iv, 10)));
      int $i$f$filterTo = false;
      Iterator var6 = $this$count$iv.iterator();

      Object element$iv$iv;
      int it;
      boolean var9;
      while(var6.hasNext()) {
         element$iv$iv = var6.next();
         it = ((Number)element$iv$iv).intValue();
         var9 = false;
         Integer var11 = it + 1;
         destination$iv$iv.add(var11);
      }

      $this$count$iv = (Iterable)((List)destination$iv$iv);
      $i$f$count = false;
      destination$iv$iv = (Collection)(new ArrayList());
      $i$f$filterTo = false;
      var6 = $this$count$iv.iterator();

      while(var6.hasNext()) {
         element$iv$iv = var6.next();
         it = ((Number)element$iv$iv).intValue();
         var9 = false;
         if (it % 2 == 0) {
            destination$iv$iv.add(element$iv$iv);
         }
      }

      $this$count$iv = (Iterable)((List)destination$iv$iv);
      $i$f$count = false;
      if (!($this$count$iv instanceof Collection) || !((Collection)$this$count$iv).isEmpty()) {
         int count$iv = 0;
         Iterator var12 = $this$count$iv.iterator();

         while(var12.hasNext()) {
            Object element$iv = var12.next();
            int it = ((Number)element$iv).intValue();
            int var15 = false;
            if (it < 3) {
               ++count$iv;
               var15 = false;
               if (count$iv < 0) {
                  CollectionsKt.throwCountOverflow();
               }
            }
         }
      }
   }
```

**Sequence**

1. Sequences 减少了循环次数

> Sequences提高性能的秘密在于这三个操作可以共享同一个迭代器(iterator)，只需要一次循环即可完成。Sequences允许 map 转换一个元素后，立马将这个元素传递给 filter操作 ，而不是像集合(lists) 那样，等待所有的元素都循环完成了map操作后，用一个新的集合存储起来，然后又遍历循环从新的集合取出元素完成filter操作。

2. Sequences 是懒惰的

> map、filter、count 都是属于中间操作，只有等待到一个终端操作，如打印、sum()、average()、first()时才会开始工作

```kotlin
fun testSequence() {
    val list = listOf(1, 2, 3, 4, 5, 6)
    val result = list.asSequence()
        .map { println("--map"); it + 1 }
        .filter { println("--filter"); it % 2 == 0 }
    println("go~")
    println(result.average())
}
```

反编译后Java代码：

```java
public static final void testSequence() {
      List list = CollectionsKt.listOf(new Integer[]{1, 2, 3, 4, 5, 6});
      Sequence result = SequencesKt.filter(SequencesKt.map(CollectionsKt.asSequence((Iterable)list), (Function1)null.INSTANCE), (Function1)null.INSTANCE);
      String var2 = "go~";
      System.out.println(var2);
      double var4 = SequencesKt.averageOfInt(result);
      System.out.println(var4);
   }
```

# 内联函数？内联类？

## 在Kotlin中，什么是内联函数？有什么作用？

Kotlin里使用关键 inline 来表示内联函数

1. inline: 作用是在编译时将内联函数内联掉，将函数的代码拷贝到调用的地方(内联)，避免方法调用的开销(方法栈帧)
2. noinline: 声明 inline 函数的形参中，不希望内联的 lambda
3. crossinline: 表明 inline 函数的形参中的 lambda 不能有 return

# 委托

## 什么是委托？

委托模式也叫代理模式，指的是一个对象接收到请求之后将请求转交由另外的对象来处理。

## by关键字有什么用？

by关键字后跟委托类，用于属性委托和类委托。<br>by关键字虽然方便但是也有限制，那就是它只能委托接口的方法，class不行。

## 什么是属性委托？请简要说说其使用场景和原理？

**什么是属性委托？**<br>属性委托 = 把成员变量的 set/get函数封装到其他地方 + 使用的时候直接调用这个封装好的东西。

> 属性委托其实就是把成员变量的set和get封装起来，方便复用

**属性委托实现方式？**

1. 自己实现类，重写setValue和getValue
2. 实现ReadOnlyProperty / ReadWriteProperty接口
3. 标准委托 lazy 延迟属性：值只在第一次访问的时候计算
4. 标准委托 observable 可观察属性：属性发生改变时通知
5. 标准委托 map 集合：将属性存在一个map集合里面

## 类委托及使用场景

**什么是类委托？**<br>类委托的核心思想是将一个类的一些具体实现委托给另一个类去完成

1. 可以通过类委托来减少 extend
2. 类委托的时，编译器会优先使用自身重写的函数，而不是委托对象的函数

**类委托的使用场景？**<br>有一些公共方法在接口中，如果每次实现该接口都需要覆写这些方法，如果希望覆写的方式统一唯一，那可以建一个代理类实现这个接口，然后在实现该接口的共有方法的时候，指定代理类来替自己做出统一的覆写，可以简化代码结构，同时使覆写方式唯一，如果需要有新的覆写方式，那使用新的代理类就好了<br>**示例**

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val b = BaseImpl(10)
    Derived(b).print()
}
```

> Derived的所有请求会被转发给传入的b对象，它的实现原理实际上是编译器帮我们补全了Derived的方法,将传入的b对象保存起来,然后在补全的方法内去调用b对象:

# 对于Kotlin语言设计方面

## Kotlin data class为啥还要提供setter/getter？

## Kotlin异常为什么没有Checked Exception？

只有Java有Checked Exception，其他语言C++、OC、C#、Kotlin、Scala等都没有Checked Exception。<br>**Checked Exception机制**

1. 提升了编程语言的安全性

**Kotlin为什么没有Checked Exception？**

1. 麻烦，调用方都需要处理异常或者重新抛出异常
2. Kotlin认为节约不必要的异常处理提高代码可读性带来的收益比较高
3. 写程序不是为了不crash，而是要写对，不应该为了不crash而掩盖程序中潜在的问题

**没有Checked Exception会不会危险？**

1. 经过几年的实践发现，即使没有Checked Exception，Kt程序也没有比Java程序出现更多的异常，反而Kt程序减少了很多异常
2. Kotlin并没有阻止你去捕获潜在的异常，只是不强制要求你去捕获而已
3. 绝大多数的方法其实都是没有抛出异常的
4. 拥有Checked Exception的Java也并不是那么安全，Java也有UnChecked Exception，并不能保证你调用的每个方法都是安全的
