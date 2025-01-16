---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
---

# 变量和常量

**常见变量类型及变量的取值范围**<br>变量用var关键字声明，常见的数据类型如下:<br>Byte、Short、Int、Long、Float、Double、String、Boolean

| 数据类型    | 取值范围                                     | 备注    |
| ------- | ---------------------------------------- | ----- |
| Byte    | -128~127                                 | 8bit  |
| Short   | -32768~32767                             | 16bit |
| Int     | -2147483648~2147483647                   | 32bit |
| Long    | -9223372036854775808~9223372036854775807 | 64bit |
| Float   | 1.4E-45~3.4028235E38                     |       |
| Double  | 4.9E-324~1.7976931348623157E308          |       |
| String  |                                          |       |
| Boolean |                                          |       |

```kotlin
fun main(args: Array<String>) {
    var aByte: Byte = Byte.MAX_VALUE; // 127
    var aByte1: Byte = Byte.MIN_VALUE;  // -128 
    println(aByte)
    println(aByte1)

    var aInt:Int = 0b0011 // 二进制赋值
    println(aInt) // 3
}
```

取最大值最小值通过如`Byte.MAX_VALUE`或`Byte.MIN_VALUE`来获取；<br>用二进制来赋值，前面加上`0b`表示二进制赋值<br>**变量类型推断（Type inference）**<br>由编译器推断变量的类型；变量不能只声明而没有具体的值

```kotlin
fun main(args: Array<String>) {
    var name = "hacket很厉害";
    println(name)
    
    name = "张三"
    println(name)
    
//    name = 8 // 报错，
//    println(name)
}
```

**变量显示类型声明**<br>显示的指明变量的类型；可以只声明变量而不用初始化

```kotlin
fun main(args: Array<String>) {
    
    var a // 报错,This variable must either have a type annotation or be initialized
    var b:Int // 不报错
    
    var i:Int = 9
    
    var j:Long = 999999999999999999;
    
    var name:String = "hacket"
}
```

**常量 val**<br>常量用val关键字声明，声明后不能修改值

```kotlin
val num = "NO.124344"
```

**小结**

- var声明变量
- val声明常量
- 不同的数据类型用不同的容器保存
- kotlin会通过类型推断自动推断数据类型
- 用:可以显示的指定数据类型

# 控制语句

## 条件控制

### if-else

同java中的if else用法

```kotlin
fun gradeStude2(scroe: Int) {
    if (scroe == 10) {
        println("满分，棒棒哒")
    } else if (scroe == 9) {
        println("干的不错")
    } else if (scroe == 8) {
        println("还可以")
    } else if (scroe == 7) {
        println("还需努力")
    } else if (scroe == 6) {
        println("刚好及格")
    } else {
        println("需要加油哦")
    }
}
```

kotlin中的if else可以用成Java中的三目运算符功能，kotlin中没有三目运算符；允许if else返回值

```kotlin
String s = if (i>0) "大于0" else "不大于0"
```

### when

1. 和Java语言中的switch类似，Kotlin中没有switch/case，但是比switch强大<br>2. when也允许有返回值<br>3. Java中的switch/case只能跟常量，case不能跟变量，Kotlin去掉了这个限制，允许引入变量；也可以引入具体的运算表达式

```kotlin
fun gradeStude(scroe: Int) {
    when (scroe) {
        10 -> println("满分，棒棒哒")
        9 -> println("干的不错")
        8 -> println("还可以")
        7 -> println("还需努力")
        6 -> println("刚好及格")
        else -> println("需要加油哦")
    }
}
fun main(args: Array<String>) {
    gradeStude(9)
}
```

4. Java的case仅仅对应一个常量值，when机制可以5个常量并排写一起用逗号隔开即可；如果几个常量是连续的数字，用in，或者!in不在区间内范围。

```kotlin
fun testWhen() {
    var count = 20
    var s = when(count){
        1,3,5,7,9 -> "凉风有信的谜底"
        in 13..19 -> "秋月无边的谜底"
        !in 6..10 -> "当里的当，少侠你来猜猜"
        else -> "好诗，这真是一首好诗！"
    }
    println(s)
}
```

5. 还可以跟is XXX类型判断

```kotlin
fun testIs() {
    var str = ""
    if (str is String) {

    }

    var count = 6 % 3
    var countType = when (count) {
        0 -> count.toLong()
        1 -> count.toDouble()
        else -> count.toFloat()
    }
   var result = when (countType) {
        is Long -> "Long了啊"
        is Double -> "Double了啊"
        else -> "Float了啊"
    }
    println(result)
}
```

6. when跟表达式判断

```kotlin
when {
    processName == app.applicationInfo.packageName -> return MainAppRuntime()
    processName.endsWith(":core") -> return CoreRuntime()
    processName.endsWith(":push") -> return PushRuntime()
    else -> throw IllegalArgumentException("不认识的进程，进程名：$processName")
}
```

7.when跟return

```kotlin
fun createRuntime(app: Application, processName: String): AbsRuntime {
    return when {
        processName == app.applicationInfo.packageName -> MainAppRuntime()
        processName.endsWith(":core") -> CoreRuntime()
        processName.endsWith(":push") -> PushRuntime()
        else -> throw IllegalArgumentException("不认识的进程，进程名：$processName")
    }
}
```

## 循环控制

### for

#### 标准for

```
for(item量 in list step 跳过值){
	循环体
}
```

#### 下标indices

```kotlin
fun testFor() {
    var list = listOf(1, 2, 3, 4, 5, 6)
    for (i in list.indices) {
        var get = list[i]
        var get1 = list.get(i)
    }

    var array = arrayOf(1, 2, 3, 4, 1)
    for (i in array.indices) {
        var item = array[i]
    }
}
```

#### 进阶for

- until 升序，默认一步；左闭右开区间
- step 升序，跨越几步
- downTo 降序，默认一步

```
// 左闭右开区间，合法值包括11，不包括66
for(i in 11 until 66) {}

// 每次递增4，包括23也包括89
for(i in 23..89 step 4) {}

// 50递减到7，包括50包括7
for(i in 50 downTo 7){}
```

#### for配合range

1. 用`..`来表示区间
2. 定义首尾闭区间：1..100（包括首尾即1和100）
3. 定义首闭尾开区间：1 until 100（包括1不包括100）

获取range总数： count()方法<br>反转range： reversed()方法

```kotlin
fun main(args: Array<String>) {
//    rangeDemo(100);

    var nums = 1..100; // [1,100]
//    printRange(nums)
    println("nums总数："+nums.count());

    var nums1 = 1 until 100;
//    printRange(nums1) // [1,100)

    var num2 = 1..16
    printRange(num2, 2)
    
    var num3 = num2.reversed();
}

fun printRange(nums: IntRange) {
    for (num in nums) {
        print(" " + num)
    }
}
fun printRange(nums: IntRange, step: Int = 1) {
    for (num in nums step step) {
        print(" " + num)
    }
}
```

### while、do while

和Java一样<br>kotlin之loop和range

### Kotlin在for、forEach、forEachIndexed中如何continue和break

#### Java中的forEach

- Java8中使用return，会跳出当前循环，继续下一次循环，作用类似continue;
- Java8中的lambda表达式foreach()不支持continue和break关键字

#### for中的continue和break 和Java一样

##### Break 与 Continue 标签

在 Kotlin 中任何表达式都可以用标签（label）来标记。 标签的格式为标识符后跟 @ 符号，例如：abc@、fooBar@都是有效的标签（参见语法）。 要为一个表达式加标签，我们只要在其前加标签即可。

```
loop@ for (i in 1..100) {
    // ……
}
```

##### continue

1. 不带label

```kotlin
fun testForContinue() {
    println("test for begin")
    for (index in 0 until 4) {
        if (index == 1) {
            println("test for continue index=$index")
            continue
        }
        println("test for index=$index")
    }
    println("test for end")
}
```

结果：

```
test for begin
test for index=0
test for continue index=1
test for index=2
test for index=3
test for end
```

2. 带label

```kotlin
fun testForContinue() {
    println("test for begin")
    loop@ for (index in 0 until 4) {
        if (index == 1) {
            println("test for continue index=$index")
            continue@loop
        }
        println("test for index=$index")
    }
    println("test for end")
}
```

输出

```
test for begin
test for index=0
test for continue index=1
test for index=2
test for index=3
test for end
```

##### break

单层循环break

```kotlin
for (i in 1..10 step 1) {
    if (i == 4) {
        break
    }
    println(i)
}
```

跳出多层循环，用`xxx@`做标记，跳出时用`@xxx`

```kotlin
out@ for (i in 1..10 step 1) {
    for (j in 1..4) {
        if (j == 3) {
            break@out
        }
    println("$i -- $j")
    }
}
```

#### forEach、forEachIndexed中的continue和break

##### forEach return (forEach默认return 跳出函数)

```kotlin
// 直接return到testForeachReturn
fun testForeachReturn() {
    println("test start")
    val array = arrayOf(1, 2, 3, 4)
    array.forEach {
        println("forEach start $it")
        if (it == 2) {
            println("forEach return $it")
            return
        }
        println("forEach end $it")
    }
    println("test end")
}

fun main(args: Array<String>) {
    println("main start")
    testForeachReturn()
    println("main end")
}
```

`forEach`中return，是直接return到该函数了。<br>结果：

```
main start
test start
forEach start 1
forEach end 1
forEach start 2
forEach return 2
main end
```

编译成class，可以看到return，是直接return到`testForeachReturn()`

```java
public static final void testForeachReturn() {
  String var0 = "test start";
  System.out.println(var0);
  Integer[] array = new Integer[]{1, 2, 3, 4};
  Object[] $receiver$iv = array;
  int var2 = array.length;

  for(int var3 = 0; var3 < var2; ++var3) {
     Object element$iv = $receiver$iv[var3];
     int it = ((Number)element$iv).intValue();
     String var6 = "forEach start " + it;
     System.out.println(var6);
     if (it == 2) {
        var6 = "forEach return " + it;
        System.out.println(var6);
        return;
     }

     var6 = "forEach end " + it;
     System.out.println(var6);
  }

  String var10 = "test end";
  System.out.println(var10);
}
```

##### forEach continue （return@forEach  跳出当前一轮循环，相当于continue）

```kotlin
// continue
fun testForeachContinue() {
    println("test start")
    val array = arrayOf(1, 2, 3)
    array.forEach continuing@{
        println("forEach start $it")
        if (it == 2) {
            println("forEach return $it")
            return@continuing
        }
        println("forEach end $it")
    }
    println("test end")
}

fun main(args: Array<String>) {
    println("main start")
    testForeachContinue()
    println("main end")
}
```

结果：

```
main start
test start
forEach start 1
forEach end 1
forEach start 2
forEach return 2
forEach start 3
forEach end 3
test end
main end
```

可以看到`return@continuing`或者`return@forEach`，相当于continue，只是结束当前循环。<br>编译成class，`return@continuing`后面的代码是直接作为else块分支

```java
public static final void testForeachContinue() {
  String var0 = "test start";
  System.out.println(var0);
  Integer[] array = new Integer[]{1, 2, 3};
  Object[] $receiver$iv = array;
  int var2 = array.length;

  for(int var3 = 0; var3 < var2; ++var3) {
     Object element$iv = $receiver$iv[var3];
     int it = ((Number)element$iv).intValue();
     String var6 = "forEach start " + it;
     System.out.println(var6);
     if (it == 2) {
        var6 = "forEach return " + it;
        System.out.println(var6);
     } else {
        var6 = "forEach end " + it;
        System.out.println(var6);
     }
  }

  String var10 = "test end";
  System.out.println(var10);
}
```

##### forEach break (forEach跳出循环，相当于break)

```kotlin
// break
fun testForeachBreak() {
    println("test start")
    run breaking@{
        val array = arrayOf(1, 2, 3)
        array.forEach continuing@{
            println("forEach start $it")
            if (it == 2) {
                println("forEach return $it")
                return@breaking
            }
            println("forEach end $it")
        }
    }
    println("test end")
}

fun main(args: Array<String>) {
    println("main start")
    testForeachBreak()
    println("main end")
}
```

结果：

```
main start
test start
forEach start 1
forEach end 1
forEach start 2
forEach return 2
test end
main end
```

在forEach前面加上`run breaking@{}`，然后return到`return@breaking`，相当于break。<br>编译成class，符合了`return@breaking`条件的代码直接走else break了。

```java
public static final void testForeachBreak() {
  String var0 = "test start";
  System.out.println(var0);
  Integer[] array = new Integer[]{1, 2, 3};
  Object[] $receiver$iv = array;
  int var2 = array.length;
  int var3 = 0;

  while(var3 < var2) {
     Object element$iv = $receiver$iv[var3];
     int it = ((Number)element$iv).intValue();
     String var6 = "forEach start " + it;
     System.out.println(var6);
     if (it != 2) {
        var6 = "forEach end " + it;
        System.out.println(var6);
        ++var3;
     } else {
        var6 = "forEach return " + it;
        System.out.println(var6);
        break;
     }
  }

  var0 = "test end";
  System.out.println(var0);
}
```

### 自定义forEach，未加inline

kotlin自带的forEach：

```kotlin
@kotlin.internal.HidesMembers
public inline fun <T> Iterable<T>.forEach(action: (T) -> Unit): Unit {
    for (element in this) action(element)
}
```

自带的forEach是inline修饰的，编译会插入到代码运行处，所以return会直接return调用函数。<br>自己编写不带inline的：

```kotlin
fun <T> Array<out T>.forEach2(action: (T) -> Unit): Unit {
    for (element in this) action(element)
}
```

不带label的return编译不过<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684689284333-80278e65-33c1-48f6-a8f6-e2bba12c32b9.png#averageHue=%233e3d3c&clientId=uc39ee5d5-8bac-4&from=paste&height=464&id=ufa56e14f&originHeight=696&originWidth=1277&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=149531&status=done&style=none&taskId=u49c4bd80-1ee3-46fe-9cc1-f272f25c67f&title=&width=851.3333333333334)<br>编译成class

```java
public static final void forEach2(@NotNull Object[] $receiver, @NotNull Function1 action) {
  Intrinsics.checkParameterIsNotNull($receiver, "$receiver");
  Intrinsics.checkParameterIsNotNull(action, "action");
  int var4 = $receiver.length;

  for(int var3 = 0; var3 < var4; ++var3) {
     Object element = $receiver[var3];
     action.invoke(element);
  }
}
```

# 运算符

## 位运算符`^`、`&`、`|`、`~`

1. 与运算符 `&`<br>两个二进制数值如果在同一位上都是1，则结果中该位为1，否则为0，可以认为两个都是true(1)，结果也为true(1)，比如1011 & 0110 = 0010。
2. 或运算符 `|`<br>运算规则：两个二进制数值如果在同一位上至少有一个1，则结果中该位为1，否则为0，比如1011 & 0010 = 1011。
3. 非运算符 `~`<br>如果位为0，结果是1，如果位为1，结果是0
4. 异或运算符 `^`<br>运算规则：两个二进制数值如果在同一位上相同，则结果中该位为0，否则为1，比如1011 & 0010 = 1001。

```
and(bits) 位与                   同Java                &

or(bits) 位或                    同Java                |

inv(bits) 位非                   同Java                ~

xor(bits) 位异或                 同Java                ^

shl(bits) 左移                   同Java                <<

shr(bits) 右移                   同Java                >>

ushr(bits) 无符号右移            同Java                >>>
```

> Kotlin中的 位运算符 只对Int和Long两种 数据类型 起作用

## 双冒号(`::`)

支持函数作为参数，是 Kotlin 自带的特性，`::` 的作用跟这个特性无关，不过它能够使函数调用更为简单。<br>`::` 只能将函数作为参数来使用，不能直接用来调用函数

- 无参数：

```kotlin
fun main() {
    val body = { -> bar1() }
    foo1(body)
    // 等同于
    foo1(::bar1)
}

fun foo1(body: () -> Unit) {
    body()
}

fun bar1() {
    println("bar1")
}
```

- 不过需要注意的是，作为参数的函数，该函数的参数类型和返回值类型一定要和规定的一致

```kotlin
fun main() {
    foo2("xxx", ::bar2)     // right
    foo2("xxx", ::bar1)     // 编译不过，Type mismatch
}

fun bar1() {
    print("bar1")
}

fun foo2(content: String, body: (String) -> Unit) {
    body(content)
}

fun bar2(string: String) {
    print(string)
}
```

- viewBinding(mashi)

```kotlin
abstract class BaseViewBindingFragment<VB : ViewBinding> : BaseFragment() {
    abstract val bindingInflater: (LayoutInflater, ViewGroup?, Boolean) -> VB
}

class OvoFragment :BaseViewBindingFragment<FragmentOvoBinding>() {
    override val bindingInflater: (LayoutInflater, ViewGroup?, Boolean) -> FragmentOvoBinding
        get() = FragmentOvoBinding::inflate
    // 等同于
    override val bindingInflater: (LayoutInflater, ViewGroup?, Boolean) -> FragmentOvoBinding
        get() = { inflater, parent, root ->
            FragmentOvoBinding.inflate(inflater, parent, root)
        }
}
```

## Kotlin等式判断

### `==`值判断

- 用`==`，字符串也是
- `!=` 不等

### `===` 引用判断

- `===` 引用地址相同
- `!==` 引用地址不相同

```
val ii = java.lang.String("123")
val jj = java.lang.String("123")
println("ii==jj ${ii == jj}") // true
println("ii!=jj ${ii != jj}") // false
println("ii===jj ${ii === jj}") // false
println("ii!==jj ${ii !== jj}") // true
```

结果：

```
ii==jj true
ii!=jj false
ii===jj false
ii!==jj true
```

- kotlin中的`===`等同于java中`==`，比较的是引用；`!==类似`
- kotlin中的`==`等同于java的`equals`，比较的是值；`!=`类似

## `is`判断类型

Java中用instanceOf，被kotlin中的is替代了

- is
- !is

```kotlin
fun testIs() {
    var str = ""
    if (str is String) {

    }

    var count = 6 % 3
    var countType = when (count) {
        0 -> count.toLong()
        1 -> count.toDouble()
        else -> count.toFloat()
    }
   var result = when (countType) {
        is Long -> "Long了啊"
        is Double -> "Double了啊"
        else -> "Float了啊"
    }
    println(result)
}
```

## `in`

判断值是否在数据和容器中

- in
- !in

## 运算符重载

### 重载算术运算符

Java中的算术运算符只能用于基本数据类型；kotlin中可以重载运算符

### 重载二元算术运算

使用`operator`关键字来声明plus函数，重载plus函数后，就可以用+号来求和了

```kotlin
fun test701() {
    var point = Point(10, 44)
    var plus = point.plus(Point(1, 2))
    println(plus)
}
// 1、声明为成员函数
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point): Point {
        return Point(x + other.x, y + other.y)
    }
}
// 2、声明为一个扩展函数（给第三方库的类定义约定扩展函数的常用模式）
operator fun Point.plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
}
```

kotlin不能定义自己的运算符，它限定了你能重载的运算符，以及你需要在你的类中定义的对应名字的函数，列举了你能定义的二元运算符：

| 表达式   | 函数名   |
| ----- | ----- |
| a * b | times |
| a / b | div   |
| a % b | mod   |
| a + b | plus  |
| a - b | minus |

自定义的运算符的优先级和标准的优先级一样，`*、/、%高级+和-`<br>定义算术运算符，不要求两个运算数是相同的类型；返回类型也可以不同于任一运算数的类型<br>运算符函数可以被重载，可以定义多个同名的参数不同的方法<br>kotlin中没有位运算符

| 位运算函数 | 描述    |
| ----- | ----- |
| shl   | 带符号左移 |
| shr   | 带符号右移 |
| ushr  | 无符号右移 |
| and   | 按位与   |
| or    | 按位或   |
| xor   | 按位异或  |
| inv   | 按位取反  |

#### `+` (plus)

Point类使用operator关键词声明了plus()函数，并在其中定义了相加算法，这使得Point对象之间可以使用+来做加法运算，即原本的p1.plus(p2)可以简写成p1+p2。

- 重载后新建对象

```kotlin
fun main() {
    val p1 = Point(1, 0)
    val p2 = Point(2, 1)
    println(p1 + p2) // Point(x=3, y=1)
    println(p1.plus(p2)) // Point(x=3, y=1)
}
data class Point(
        val x: Int,
        val y: Int
) {

    operator fun plus(other: Point): Point {
        return Point(x + other.x, y + other.y)
    }
}
```

- 操作原有对象

```kotlin
fun main() {
    val p1 = Point(1, 0)
    val p2 = Point(2, 1)
    p1 + p2
    println(p1)
    println(p2)
    p1.plus(p2)
    println(p1)
    println(p2)
    // Point(x=3, y=1)
    // Point(x=2, y=1)
    // Point(x=5, y=2)
    // Point(x=2, y=1)
}

data class Point(
        var x: Int,
        var y: Int
) {

    operator fun plus(other: Point) {
        x += other.x
        y += other.y
    }
}
```

#### `*` (times)

```kotlin
operator fun String.times(n: Int): String {
    var temp = ""
    for (index in 0 until n) {
        temp += " $this"
    }
    return temp
}
```

使用:

```
val result = "hacketzeng" * 3
println(result)
```

结果：

```
hacketzeng hacketzeng hacketzeng
```

#### `in` (contains)

in 关键字其实是 `contains`  操作符的简写，它不是一个接口，也不是一个类型，仅仅是一个操作符，也就是说任意一个类只要重写了 contains 操作符，都可以使用 in 关键字，如果我们想要在自定义类型中检查一个值是否在列表中，只需要重写 contains() 方法即可，Collections 集合也重写了 contains 操作符。

```kotlin
// 使用扩展函数重写 contains 操作符
operator fun Regex.contains(text: CharSequence) : Boolean {
  return this.containsMatchIn(text)
}

// 结合着 in 和 when 一起使用
when (input) {
  in Regex("[0–9]") -> println("contains a number")
  in Regex("[a-zA-Z]") -> println("contains a letter")
}
```

### 重载复合赋值运算符

复合运算符：`+=`，`-=`，`*=`等

| 表达式    | 函数名         |
| ------ | ----------- |
| a *= b | timesAssign |
| a /= b | divAssign   |
| a %= b | modAssign   |
| a += b | plusAssign  |
| a -= b | minusAssign |

标准库为可变集合定义了plusAssign函数，

```kotlin
operator fun <T> MutableCollection<T>.plusAssign(element: T) {
    this.add(element)
}
```

plus和plusAssign同时定义，解决：

1. val替代var，这样plusAssign不会适用
2. 不要同时给出plus和plusAssign
3. 类可变的，一般只需要提供plusAssign即可

### 重载一元运算符

可重载的一元运算符：

| 表达式     | 函数名        |
| ------- | ---------- |
| +a      | unaryPlus  |
| -a      | unaryMinus |
| !a      | not        |
| a,a     | inc        |
| --a,a-- | dec        |

```kotlin
operator fun Point.unaryMinus(): Point {
    return Point(-x, -y)
}
fun test702() {
    var point = Point(7, 34)
    println(-point)
}
```

### 重载比较运算符

比较运算符：`==`、`!=`、`>`、`<`等<br>等号运算符：equals<br>kotiln中使用`==`，它将直接转换为equals方法的调用；`!=`也会调用equals方法，只是对结果取反

```
a==b
等同于：转换为equals调用及null的校验
a?.equals(b) ?: (b==null)
```

`===`恒等运算符，来检查参数与调用equals的对象是否相同，与Java中的`==`运算符完全相同；`===`不能被重载<br>equals被标记为override，它是在Any中被定义了；equals函数不能实现为扩展函数，因为继承自Any类的实现始终优先于扩展函数

### 排序运算符：compareTo

compareTo返回类型必须是Int；比较运算符（`<`，`>`，`<=`，`>=`）的使用转换为compareTo调用<br>利用kotlin提供的`compareValuesBy()`函数来简洁地实现compareTo方法，按顺序调用，相同，调用下组，没有更多就返回0；<br>java中实现了Comparable接口的类，都可以直接使用简洁的运算符语法，不需要增加扩展函数。

1. 重写compareTo方法，大于返回正数，=相等，小于返回负数
2. 实现Comparable接口

```kotlin
data class GiftComboInfo(
    val giftId: Long,
    val giftName: String,
    val giftSendAmount: Int, // 单次送礼数量
    var giftTotalCount: Int,  // 总数量数量，3秒内连击
    var msgOrderId: Long,// 用户送礼请求响应序列id，有序
    val comboSeq: String // 用户送礼连击标识
) : Comparable<GiftComboInfo?> {
    override fun compareTo(other: GiftComboInfo?): Int {
        if (other == null) return 1
        if (comboSeq != other.comboSeq) return 1 // comboSeq不等于都算大于
        return msgOrderId.compareTo(other.msgOrderId)
    }
}
```

测试

```
fun main() {
    val c1: GiftComboInfo? = null
    val c1_0: GiftComboInfo = GiftComboInfo(1, "rocket", 777, 777, 10, "431kj")
    val c1_1: GiftComboInfo = GiftComboInfo(1, "rocket", 1, 778, 11, "431kj")
    val c2: GiftComboInfo = GiftComboInfo(2, "gift", 7, 7, 29, "45fsda")
    val c3: GiftComboInfo = GiftComboInfo(2, "gift", 7, 7, 19, "45fsda")
    println("c1_0>c1_1:${c1_0 > c1_1}") // false
    println("c1_0>c1:${c1_0 > c1}") // true
    println("c1_1>c1:${c1_1 > c1}") // true
    println("c1_0>c2:${c1_0 > c2}") // true
    println("c2>=c3:${c2 >= c3}") // true
}
```

### 集合与区间的约定

#### 1）通过下标来访问元素：get、set(下标运算符`[]`)

kotlin中访问map可以通过java中访问数组一样来访问map；同样也可以改变一个可变的map元素

```
val value = map[key]
mutableMap[key] = newValue
```

使用下标运算符(`[]`)，会被转换为get运算符方法的调用，写入元素将调用set，Map和MutableMap接口已经定义好了这些方法<br>定义一个名get函数，标记为operator，get参数可以是任意类型（当你对map使用下标运算符，参数类型是key的类型，它可以是任意类型），还可以定义具有多个参数的get方法。

```kotlin
fun test703() {
    val p = Point(10, 20)
    println(p[0])
    println(p[1])
    println(p[2])
}
operator fun Point.get(index: Int): Int {
    return when (index) {
        0 -> x
        1 -> y
        else -> throw IndexOutOfBoundsException("Invalid index: $index")
    }
}
```

#### 2）in约定

集合支持的另一运算符in，用于检查某个对象是否属于集合，相对应的函数叫做`contains`；in右边的对象将会调用contains函数，in左边的对象将会作为参数入参

```kotlin
fun test704() {
    val rect = Rectangle(Point(10, 20), Point(50, 50))
    println(Point(20, 30) in rect) // true
    println(Point(5, 5) in rect) // false
}
data class Rectangle(val upperLeft: Point, val lowerRight: Point)
operator fun Rectangle.contains(p: Point): Boolean {
    return p.x in upperLeft.x until lowerRight.x // until来构建一个开区间
            && p.y in upperLeft.y until lowerRight.y
}
```

#### 3）rangeTo的约定

创建区间用`..`，`..`运算符是调用rangeTo函数的一个简洁方法；rangeTo函数返回一个区间；如果该类实现了Comparable接口，那么不需要定义了，可以调用kotlin标准库创建一个任意可比较元素的区间，这个库定义了可以用于任何可比较元素的rangeTo函数<br>rangeTo运算符优先级低于算术运算符

#### 4）for循环使用iterator约定

for也可以用in；<br>`for(x in list) { }`将被转换为list.iterator()的调用；在kotlin中这是一种约定，iterator()方法可以被定义为扩展函数

# kotlin中的数据类型

## 基本数据类型

kotlin不区分基本类型和引用类型；大多数情况下，基本类型会被编译成Java中的基本类型（如Int编译成Java中的int）;而泛型例外，用作泛型类型参数的基本数据类型会被编译成对应的java包装类型

1. kotlin对应到Java基本数据类型<br>整数类型：Byte、Short、Int、Long<br>浮点数类型：Float、Double<br>字符类型：Char<br>布尔类型：Boolean
2. 可空的基本数据类型<br>kotlin中的可空类型不能用java的基本数据类型表示，null只能被存储在java的引用类型的变量中（只要用了基本数据类型的可空版本，它就会编译成对应的包装类型）
3. 数字转换<br>kotlin不会自动把数字从一种类型转换成另外一种，即便是转换成更大的类型

```kotlin
val i= 1
val l:Long = i // 编译不过，需要显式地转换
var l:Long = i.toLong()
```

每一种基本数据类型（Boolean除外）都定义有转换函数，支持双向转换

```kotlin
fun test() {

    var i: Int = 20

    var toFloat = i.toFloat()
    var toString = i.toString()
    var toLong = i.toLong()
    var toDouble = i.toDouble()
    var toChar = i.toChar()

    println("toFloat:$toFloat  toString:$toString  toLong:$toLong toDouble:$toDouble  toChar:$toChar")

   var s:String = "65"
    var toInt = s.toInt()
    var toLong1 = s.toLong()
    var toFloat1 = s.toFloat()
    var toDouble1 = s.toDouble()
    var toCharArray = s.toCharArray()
    println("toFloat:$toFloat1  toInt:$toInt  toLong:$toLong1 toDouble:$toDouble1  toCharArray:${toCharArray.forEach { println(it.toString()) }}")
}
```

## 其他类型

1. `Any`和`Any?`<br>Any相当于Java中的Object类，Java中Object是所有引用类型的超类，而基本数据类型并不是；而kotlin中Any是所有类型的超类型，包括Int这样的基本数据类型<br>把基本数据类型赋值给Any类型的变量会自动装箱
2. Unit类型(`void`)<br>kotlin中Unit类型完成了java中的void一样的功能，当函数没有什么可以返回的，可以用Unit来作为返回值。<br>Java中的void和Unit的区别：<br>Unit是一个完备的类型，可以作为类型参数，而void却不行；只存在一个值是Unit类型，这个值也叫做Unit，并且在函数中会被隐式地返回

```kotlin
interface Processor<T> {
    fun process(): T
}
class NoResultProcessor : Processor<Unit> {
    override fun process() { // 返回Unit，可以省略类型说明
        // do stuff //这里不需要显式地return
    }
}
```

3. `Nothing`类型：这个函数永不返回<br>当做函数返回值使用，或者当做泛型函数返回值的类型参数使用才会有意义

## 集合

集合变量自己类型的可空性<br>集合中的变量类型的可空性

1. 只读集合与可变集合<br>kotlin中的把访问集合的数据接口和修改集合数据的接口分开了<br>访问集合接口：`Collection`<br>修改集合接口：`MutableCollection`

只读集合并不是一定是不可变的，只读集合并不总是线程安全的<br>如：同一个集合对象，有两个不同的引用，一个只读，另一个可变，可变的集合引用可以修改

2. Kotlin集合和Java<br>Java中的集合接口在kotlin中都有两种版本，只读的，可变的<br>平台类型<br>kotlin和java混编时，要做可空性判断

## 数组

kotlin中的一个数组是一个带有类型参数的类，其元素类型被指定为相应的类型参数，创建数组

1. arrayOf函数创建一个数组，它包含的元素是指定为该函数的实参
2. arrayOfNulls创建一个给定大小的数组，包含的是null元素（它只能用来创建包含元素类型可空的数组）
3. Array构造方法接收数组的大小和一个lambda表达式，调用lambda表达式来创建每一个数组元素

```kotlin
var array = Array<String>(26, { i -> ('a' + i).toString() })
println(array.joinToString("-"))
```

```kotlin
var strings = listOf("a", "b", "c")
var toTypedArray = strings.toTypedArray()
println("%s/%s/%s".format(*toTypedArray)) // 期望vararg参数时，使用展开运算符*传递数组
```

数组类型的类型参数始终会变成对象类型，你声明的`Array<Int>`，将会是一个包含了包装类的数组，对应的java类型是`Integer[]`。<br>创建基本数据类型数组，用`IntArray`，`ByteArray`，`CharArray`，`BooleanArray`等，有三种方式创建基本数据类型数组：

1. 类型构造方法接受size作为默认大小的数组大小
2. 工厂函数
3. 构造方法，接收lambda表达式

```kotlin
var squares = IntArray(5) { i -> (i + 1) * (i + 1) }
// 数组遍历方式1：下标
for (i in squares.indices) { // 下标遍历
    var value = squares[i]
    println("Argument $i is :$value")
}
// 数组遍历方式2：forEachIndexed
squares.forEachIndexed { index, element ->
    println("Argument forEachIndexed $index is :$element")
}
```

# Kotlin中的属性和字段

## 普通属性

### 普通属性声明

在Kotlin中，声明一个属性涉及到2个关键字，var 和 val 。

1. var 声明一个可变属性
2. val 声明一个只读属性

### getters与setters 读写访问器

一个属性的完整声明：

```
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
// = 和 {}怎么用看一行是否能返回值
```

其`初始器(initializer)`、`getter` 和 `setter` 都是可选的。属性类型如果可以从初始器 （或者从其 getter 返回值，如下文所示）中推断出来，也可以省略

```kotlin
class User {
    var initialized = 1 // 类型 Int、默认 getter 和 setter
    // 自定义getter和setter
    var name: String? = null
        get() {
            return if (field.isNullOrBlank()) "百姓头条用户" else field
        }
        set(value) {
            field = value?.toUpperCase()
        }
    val isEmpty: Boolean
        get() = this.name?.isNullOrBlank() ?: true
}
```

### 只读属性

改变一个访问器的可见性，但是不需要改变默认的实现， 你可以定义访问器而不定义其实现。<br>setter前添加`private`, 那么这个setter就是私有的：

```kotlin
class PPPPP {
    var setterVisibility: String = "abc"
        private set // 此 setter 是私有的并且有默认实现
}
```

### 属性加注解

对一个访问器注解，但是不需要改变默认的实现， 你可以定义访问器而不定义其实现。

```kotlin
class PPP {
    var setterWithAnnotation: Any? = null
        @Inject set // 用 Inject 注解此 setter
    
    annotation class Inject
}
```

## backing field (幕后字段)

### 什么是backing field

在 Kotlin 类中不能直接声明字段。然而，当一个属性需要一个幕后字段时，Kotlin 会自动提供。这个幕后字段可以使用`field`标识符在访问器中引用

```kotlin
var counter = 0 // 注意：这个初始器直接为幕后字段赋值
    set(value) {
        if (value >= 0) field = value
    }
```

`**field**`**标识符只能用在属性的读或写访问器内，即getter或setter。**<br>Kotlin的属性需要满足下面条件之一才有幕后字段：

1. 使用默认 getter / setter 的属性，一定有幕后字段。对于 var 属性来说，只要 `getter / setter 中有一个使用默认实现`，就会生成幕后字段；
2. 在自定义`  getter/setter中使用了field的属性 `

举一个没有幕后字段的例子：

```kotlin
class NoField {
    var size = 0
    // isEmpty没有幕后字段
    var isEmpty
        get() = size == 0
        set(value) {
            size *= 2
        }
}
```

生成的Java代码：

```java
public final class NoField {
   private int size;

   public final int getSize() {
      return this.size;
   }

   public final void setSize(int var1) {
      this.size = var1;
   }

   public final boolean isEmpty() {
      return this.size == 0;
   }

   public final void setEmpty(boolean value) {
      this.size *= 2;
   }
}
```

> isEmpty是没有幕后字段的，重写了setter和getter，没有在其中使用 field；翻译成Java代码，只有一个size变量，isEmpty翻译成了 isEmpty()和setEmpty()两个方法。返回值取决于size的值。

**有幕后字段的属性转换成Java代码一定有一个对应的Java变量**<br>有幕后属性生成的Java代码：

```kotlin
class Person {
    var name: String = "Paul"
        set(value) {
            println("执行了写访问器，参数为：$value")
        }
}
```

Person生成的Java代码：

```java
public final class Person {
   @NotNull
   private String name = "Paul";

   @NotNull
   public final String getName() {
      return this.name;
   }

   public final void setName(@NotNull String value) {
      Intrinsics.checkNotNullParameter(value, "value");
      String var2 = "执行了写访问器，参数为：" + value;
      System.out.println(var2);
   }
}
```

### 扩展属性初始化（没有backing field）

扩展属性是没有backing field的，它其实就是扩展函数的特殊形式。但是总有人想要给某个类扩展一个真正的field，就像下面那样：

```kotlin
class Some {}

// unresolved reference: field
var Some.rua : String
   get() = field
   set(value) {
      field = value
   }
```

解决：找个地方将数据存起来，这里选择了一个全局的Map来解决存储问题

```kotlin
private var refMap: WeakHashMap<Some, String> = WeakHashMap()
var Some.rua: String
    get() = refMap[this] ?: ""
    set(value) {
        refMap[this] = value
    }
```

> 需要注意的是，这里对Map的类型有要求：因为不能干扰jvm的垃圾回收机制，所以需要是`WeakReferenceMap`；因为每个实例都需要保存一份自己的数据，所以需要是`IdentityMap`；如果在多线程环境跑这代码，需要是ConcurrentMap。综上你需要一个`ConcurrentWeakIdentityMap`来解决这个问题。

## backing property(幕后属性)

默认 getter 和 setter 访问私有属性会被优化，所以不会引入函数调用开销。<br>有时候有这种需求，我们希望一个属性：**对外表现为只读，对内表现为可读可写，我们将这个属性成为幕后属性。** 如：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 类型参数已推断出
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> 将_table属性声明为private,因此外部是不能访问的，内部可以访问，外部访问通过table属性，而table属性的值取决于_table，这里_table就是幕后属性。

幕后属性这中设计在Kotlin 的的集合Collection中用得非常多，Collection中有个size字段，size对外是只读的，size的值的改变根据集合的元素的变换而改变，这是在集合内部进行的，这用幕后属性来实现非常方便。<br>如Kotlin AbstractList中SubList源码：

```kotlin
// AbstractList
private class SubList<out E>(private val list: AbstractList<E>, private val fromIndex: Int, toIndex: Int) : AbstractList<E>(), RandomAccess {
    private var _size: Int = 0

    init {
        checkRangeIndexes(fromIndex, toIndex, list.size)
        this._size = toIndex - fromIndex
    }

    override fun get(index: Int): E {
        checkElementIndex(index, _size)

        return list[fromIndex + index]
    }

    override val size: Int get() = _size
}
```

AbstractMap 源码中的keys 和 values 也用到了幕后属性：

```kotlin
public abstract class AbstractMap<K, out V> protected constructor() : Map<K, V> {
    override val keys: Set<K>
        get() {
            if (_keys == null) {
                _keys = object : AbstractSet<K>() {
                    override operator fun contains(element: K): Boolean = containsKey(element)

                    override operator fun iterator(): Iterator<K> {
                        val entryIterator = entries.iterator()
                        return object : Iterator<K> {
                            override fun hasNext(): Boolean = entryIterator.hasNext()
                            override fun next(): K = entryIterator.next().key
                        }
                    }

                    override val size: Int get() = this@AbstractMap.size
                }
            }
            return _keys!!
        }
    @kotlin.jvm.Volatile
    private var _keys: Set<K>? = null
    
    override val values: Collection<V>
        get() {
            if (_values == null) {
                _values = object : AbstractCollection<V>() {
                    override operator fun contains(element: @UnsafeVariance V): Boolean = containsValue(element)

                    override operator fun iterator(): Iterator<V> {
                        val entryIterator = entries.iterator()
                        return object : Iterator<V> {
                            override fun hasNext(): Boolean = entryIterator.hasNext()
                            override fun next(): V = entryIterator.next().value
                        }
                    }

                    override val size: Int get() = this@AbstractMap.size
                }
            }
            return _values!!
        }
    @kotlin.jvm.Volatile
    private var _values: Collection<V>? = null
}
```

## 编译期常量

已知值的属性可以使用`const`修饰符标记为**编译期常量**。 这些属性需要满足以下要求：

1. 位于顶层或者是 object 的一个成员
2. 用 String 或原生类型 值初始化
3. 没有自定义getter

这些属性可以用在注解中：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"
@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { …… }
```

## 延迟初始化属性与变量

一般地，属性声明为非空类型必须在构造函数中初始化。 然而，这经常不方便。例如：属性可以通过依赖注入来初始化， 或者在单元测试的 setup 方法中初始化。 这种情况下，你不能在构造函数内提供一个非空初始器。 但你仍然想在类体中引用该属性时避免空检查。<br>为处理这种情况，你可以用`lateinit`修饰符标记该属性：

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接解引用
    }
}
```

该修饰符只能用于在类体中的属性（不是在主构造函数中声明的 var 属性，并且仅当该属性没有自定义 getter 或 setter 时），而自 Kotlin 1.2 起，也用于顶层属性与局部变量。该属性或变量必须为非空类型，并且不能是原生类型。<br>在初始化前访问一个 lateinit 属性会抛出一个特定异常，该异常明确标识该属性被访问及它没有初始化的事实。<br>检测一个 lateinit var 是否已初始化（自 1.2 起）

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此检测仅对可词法级访问的属性可用，即声明位于同一个类型内、位于其中一个外围类型中或者位于相同文件的顶层的属性。

## 覆盖属性

## 委托属性

# Kotlin null值安全

## null引用 ?

1. 非null引用，kotlin默认
2. null引用，类型后面加上?即可

```kotlin
var a:String? = null
var b:String = "abc"
```

## 安全调用符 ?.

用`?.`表示

```
fun testNull1() {
    var b: String? = "abc"
    b = null
    println(b?.length)
}
```

可以结合`let`对非null值执行某个操作

## Elvis操作符 ?:

用`?:`表示，如果`?:`左侧的表达式值不为null，Elvis操作符就会返回它的值，否则返回右侧表达式的值。（只有在左侧表达式值为null时，才会计算右侧表达式）

```kotlin
fun testNullElvis() {
    var b: String? = null
    val len: Int = if (b != null) b.length else 0
    println(len)
    println(b?.length ?: 0)
}
```

- throw和return结合<br>Kotlin中，`throw`和`return`都是表达式，也可以出现在Elvis操作符的右侧。

```kotlin
val name = b ?: throw IllegalArgumentException("b不能为null")
val name2 = b ?: return null
```

- `?.`和`?:`配合使用

```kotlin
fun isNotchScreen(fragment: String?): Boolean {
    return fragment?.let {
        println("test $fragment")
        true
    } ?: false
}
```

```kotlin
fun isVivoRom(): Boolean {
    val a = getSystemProperty("ro.vivo.os.name")
    return !a.isNullOrBlank()
            && a?.contains("funtouch", true)!!
}
```

另外一种：

```kotlin
get?.invoke(null) as Boolean
```

## !!操作符

用`!!`表示，左侧为空时，直接抛出NPE异常。

```kotlin
var b:String? = null
b!!.length
```

抛出的NPE

```
Exception in thread "main" kotlin.KotlinNullPointerException
```

## 安全的类型转换 as?

用`as? 具体类型`，如果左侧为null或者不是右边的类型，那么返回null

```kotlin
fun testAs(a: Any?) {
    val value: Int? = a as? Int
    println(value)
}
// 调用
testAs("11") // null
testAs(null) // null
testAs(1) // 1
```

## 可为null的类型构成的集合

用`filterNotNull()`函数类过滤集合中的null元素

```kotlin
fun testListNUll() {
    var nullableList = listOf(1, 2, null, 4)
    println(nullableList) // [1, 2, null, 4]
    var filterNotNull = nullableList.filterNotNull()
    println(filterNotNull) // [1, 2, 4]
}
```

## Kotlin是如何实现空安全的

```kotlin
class Test {
    fun test_1(str: String) = str.length // 1
    fun test_2(str: String?) = str?.length // 2
    fun test_3(str: String?) = str!!.length // 3
    fun test_4(str: Any?) = str as String // 4
    fun test_5(str: Any?) = str as? Int // 5
}
```

最终编译成java代码：

```java
public final class Test {
   public final int test_1(@NotNull String str) {
      Intrinsics.checkParameterIsNotNull(str, "str");
      return str.length();
   }

   @Nullable
   public final Integer test_2(@Nullable String str) {
      return str != null ? str.length() : null;
   }

   public final int test_3(@Nullable String str) {
      if (str == null) {
         Intrinsics.throwNpe();
      }

      return str.length();
   }

   @NotNull
   public final String test_4(@Nullable Object str) {
      if (str == null) {
         throw new TypeCastException("null cannot be cast to non-null type kotlin.String");
      } else {
         return (String)str;
      }
   }

   @Nullable
   public final Integer test_5(@Nullable Object str) {
      Object var10000 = str;
      if (!(str instanceof Integer)) {
         var10000 = null;
      }

      return (Integer)var10000;
   }
}
```

- test_1函数<br>如果str为null，就会触发`Intrinsics.checkParameterIsNotNull(str, "str");`，抛出异常`IllegalArgumentException`参数为空的异常
- test_2函数<br>比较简单，判断是否为空，不为空的话，调用对应的方法，否则返回一个null。
- test_3<br>直接判断是否为空，空的话直接抛出Npe异常
- test_4<br>判空，如果空抛出类型转换异常，否则执行后续代码；如果类型不对，转换会报`ClassCastException`异常的
- test_5<br>创建一个新对象把参数的值传给他，然后进行类型判断，如果不是特定类型，对象赋值null，然后把执行类型强转后的对象赋值给一个新的对象。(类型不对的话，转换返回null)

### Kotlin中对空安全处理

1. 非空类型的属性编译器添加`@NotNull`注解，可空类型添加`@Nullable`注解；
2. 非空类型直接对参数进行判空，如果为空直接抛出异常；
3. 可空类型，如果是`?.`判空，不空才执行后续代码，否则返回null；如果是`!!`，空的话直接抛出NPE异常。
4. `as`操作符会判空，空的话直接抛出异常，不为空才执行后续操作，没做类型判断！运行时可能会报错`ClassCastException`！
5. `as?`则是新建一个变量，参数赋值给它，然后判断是否为特定类型，如果不是要转换的类型那么赋值为null，如果是的话直接强制转换（as?处理后的参数可能为空）。

## 小结

1. ？类型后?表示该变量可以为null类型
2. ?. 左侧变量为空时直接返回null
3. ?: 左侧变量为空时返回右边的值
4. !! 左侧变量为空时，抛异常
5. filterNotNull()过滤集合中的null元素
6. null不等于false，也不等于true

```kotlin
println(null == false) // false
println(null == true) // false
```

# Kotlin类型检查和类型转换

## is和!is操作符

`is`操作符，在运行时检查一个对象与一个给定的类型是否一致；`!is`相反。

1. is表达式满足条件，Kotlin编译器会自动转换is前面的对象到后面的数据类型。
2. 对象和is后面的类型要兼容，如果不兼容，无法编译通过。

```kotlin
fun testType1() {
    var obj:Any = 456
    if (obj is String) {
        println("""字符串：$obj""")
    }
    if (obj is Int) {
        println("""Int：$obj""")
        var toString = obj.toString() // 自动转换为Int
    }
}
```

## 智能类型转换

很多情况下，Kotlin不必使用显式的类型转换操作，编译器会对不可变的值追踪`is`检查，然后在需要的时候自动插入安全的类型转换。

- is后面自动转换对应的类型

```kotlin
fun demo(x: Any) {
    if (x is String) {
        println(x.length) // x自动转换为String类型
    }
}
```

- is相反的类型检查导致了return，编译器能够判断出转换处理是安全的

```kotlin
fun demo2(x:Any) {
    if (x !is String)
        return
    print(x.length) // x自动转换为String类型
}
```

- 在`&&`和`||`操作符的右侧也是一样<br>在`!is`的`||`右侧；在`is`和`&&`的右侧

```kotlin
fun demo3(x:Any) {
    if (x !is String || x.length ==0) { // ||右侧x被自动转换为String
        return
    }
    if (x is String && x.length > 0) { // &&右侧x被自动转换为String
        println(x.length)
    }
}
```

这种类型转换（smart cast）对于`when`表达式，`while`循环同样有效。

## 强制类型转换（as和as?）

### as(转换失败抛出异常)

在Kotlin中，不安全的类型转换使用中缀操作符`as`。

`null`不能被转换为String，因为String表示不可为null的。需要在后面加上String`?`。如果转换是不可能的，转换操作符会抛出一个异常。因此，我们称之为不安全的。

```kotlin
val y:Any? = null
val x:Int? = y as Int?
```

### as?(转换失败不抛出异常，返回null)

为了避免抛出异常，我们使用安全的类型转换操作符`as?`，在类型转换失败时，返回null。

```kotlin
val y:Any? = "abcd"
val x:Int? = y as? Int? // 转换错误，不抛出异常，x为null
print(x) // null
```
