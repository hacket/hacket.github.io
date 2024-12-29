---
date created: 2024-12-27 23:46
date updated: 2024-12-27 23:46
dg-publish: true
---

# kotlin中数组声明和元素操作

## 数组声明

| Kotlin的基本数组类型 | 数组类型的名称      | 数组类型的初始化方法     |
| ------------- | ------------ | -------------- |
| 整型类型          | IntArray     | intArrayOf     |
| 长整型类型         | LongArray    | longArrayOf    |
| 浮点数组          | FloatArray   | floatArrayOf   |
| 双精度数组         | DoubleArray  | doubleArrayOf  |
| 布尔型数组         | BooleanArray | booleanArrayOf |
| 字符数组          | CharArray    | charArrayOf    |

没有StringArray，String是一种特殊的基本数据类型，在kotlin用Array来表示数组，声明用`arrayOf`。

---

示例：

```kotlin
fun main(args: Array<String>) {
    testArray()
}

fun testArray() {

    // 声明整型数组
    //var int_array:IntArray = intArrayOf(1, 2, 3)
    //也可按下面方式声明
    var int_array: Array<Int> = arrayOf(1, 2, 3)
    printArray(int_array)

    //声明长整型数组
    //var long_array:LongArray = longArrayOf(1, 2, 3)
    var long_array: Array<Long> = arrayOf(1, 2, 3)
    printArray(long_array)

    //声明浮点数组
    //var float_array:FloatArray = floatArrayOf(1.0f, 2.0f, 3.0f)
    var float_array: Array<Float> = arrayOf(1.0f, 2.0f, 3.0f)
    printArray(float_array)

    //声明双精度数组
    //var double_array:DoubleArray = doubleArrayOf(1.0, 2.0, 3.0)
    var double_array: Array<Double> = arrayOf(1.0, 2.0, 3.0)
    printArray(double_array)

    //声明布尔型数组
    var boolean_array: BooleanArray = booleanArrayOf(true, false, true)
    boolean_array.forEach { print("$it ") }

    println()

    //声明字符数组
    var char_array: CharArray = charArrayOf('a', 'b', 'c')
    char_array.forEach { print("$it ") }

    println()

    //声明字符串数组
    var string_array: Array<String> = arrayOf("How", "Are", "You")
    var str: String = ""
    var i: Int = 0
    while (i < string_array.size) {
        str = str + string_array[i] + ", "
        //数组元素可以通过下标访问，也可通过get方法访问
        //str = str + string_array.get(i) + ", "
        i++
    }
    println(str)
//            for (item in string_array) {
//                str = str + item + ", "
//            }

}

inline fun <reified T : Number> printArray(array: Array<T>): String {
    var str = ""
    for (item in array) {
        str = str + item.toString() + ", "
    }
    println(str)
    return str
}
```

结果：

```
1, 2, 3, 
1, 2, 3, 
1.0, 2.0, 3.0, 
1.0, 2.0, 3.0, 
true false true 
a b c 
How, Are, You,
```

## 数组元素操作

- 获取
  1. 下标
  2. get方式<br>1.获取长度用size
- 设置
  1. set

```kotlin
fun testArrayOperate() {
    var arrayOf = arrayOf("How", "are", "you")
    var i = 0
    var str = ""
    while (i < arrayOf.size) {
        str += arrayOf[i] + ","

//        除了下标，也可以通过get
//        str += arrayOf.get(i) + ","
        i++
    }
    println(str)
}
```

结果：How,are,you,

# Kotlin中容器

Kotlin有3大容器：Set、List、Map；每类容器又分为**只读**和**可变**两种类型。<br>默认容器不可以修改，加上**Mutable**前缀表示可变容器了，只有可变容器才能够对其内部的数据进行增删改查操作。

## 容器公共方法

1. isEmpty 容器是否为空
2. isNotEmpty 容器是否非空
3. clear 清空容器
4. contains 容器是否包含指定元素
5. iterator 容器的迭代器
6. count 容器元素大小，也可以用size

## 容器初始化

kotlin允许声明容器变量时就可以初始化，Java不行。

1. Set setOf()
2. MutableSet mutableSetOf()
3. List listOf()
4. MutableList mutableListOf()
5. Map mapOf()
6. MutableMap mutableMapOf()

## Set/MutableSet

特点：

1. 容器内部的元素不按顺序排列，因此无法按照下标进行访问
2. 容器内部的元素存在唯一性，通过哈希值校验是否存在相同的元素，若存在，则将其覆盖

不足：

1. Set不允许修改内部元素的值
2. Set无法删除指定位置的元素（因为无序）
3. 不能通过下标获取指定位置的元素（因为无序）

```kotlin
fun testSet() {
    var setMut = setOf("iPhoneX", "Mate20", "小米8", "OPPO Find X", "魅族16")
    for (item in setMut) {
        print("$item ")
    }

    println()

    var iterator = setMut.iterator()
    while (iterator.hasNext()) {
        var next = iterator.next()
        print("$next ")
    }

    println()

    setMut.forEach { print("$it ") }
}
```

## List/MutableList

和Set比，多了位置，可以对位置元素进行CRUD

MutableList提供了sortBy升序排列，sortByDescending降序排列

```kotlin
fun testList() {
    var mutableList = mutableListOf("iPhoneX", "Mate20", "小米8", "OPPO Find X", "魅族16","C","aa")
    mutableList.sortBy { it.length } // 后面跟排序条件，按元素长度从小到大
    for (s in mutableList) {
        print("$s ")
    }
}
```

## Map/MutableMap

键值对

### Map创建

```kotlin
fun testMap() {
    var map = mapOf("苹果" to "iPhoneX", "华为" to "Mate20", "小米" to "小米8", "步步高" to "vivo NEX")
    for (entry in map) {
        print("${entry.key}:${entry.value} ")
    }

    println()

    var mutableMap = mutableMapOf(Pair("苹果", "iPhoneX"), Pair("华为", "Mate20"), Pair("小米", "小米8"), Pair("步步高", "vivo NEX"))
    mutableMap.forEach({
        print("${it.key}:${it.value} ")
    })
}

private val mBageMap = mutableMapOf<Int,String>(1 to "1",2 to "12",3 to "123",4 to "1234")
```

### Map遍历

- 方式1：

```kotlin
mMap1.forEach {  
    it.key  
    it.value  
}
```

- 方式2：

```kotlin
for ((key,value) in mMap1){  
      
}
```

- 方式3：

```kotlin
for (entry in map) {
    print("${entry.key}:${entry.value} ")
}
```

## list

用`listOf()`<br>简单的list，用`list.withIndex()`可以得到索引和值

```kotlin
fun listDemo() {
    var lang = listOf("Java", "C", "C++", "Kotlin")
    println(lang) // [Java, C, C++, Kotlin]
    for (l in lang) { //  Java C C++ Kotlin 
        print(l + " ")
    }
    println()
    for ((index, value) in lang.withIndex()) { // 第一个为index,第二个为value
//        print(index.toString() + ":" + value+" ") // 0:Java 1:C 2:C++ 3:Kotlin
        print("$index:$value  ") // 0:Java  1:C  2:C++  3:Kotlin 
    }
}
```

## map

用`TreeMap()`

```kotlin
fun mapDemo() {
    var map = TreeMap<String, String>()
    map.put("I", "我")
    map.put("Love", "爱")
    map.put("You", "你")
    println(map) // {I=我, Love=爱, You=你}
    for (m in map) {
        print(m) // I=我Love=爱You=你
    }
    println()
    for ((index, value) in map) {
        print("$index:$value ") // I:我 Love:爱 You:你 
    }
    println()
    println(map["I"]) // 我
    println(map.get("Love")) // 爱
}
```

### Map 集合的默认值

在 Map 集合中，可以使用 `withDefault` 设置一个默认值，当键不在 Map 集合中，通过 getValue 返回默认值。

```kotlin
val map = mapOf(
        "java" to 1,
        "kotlin" to 2,
        "python" to 3
).withDefault { "?" }

println(map.getValue("java")) // 1
println(map.getValue("kotlin")) // 2
println(map.getValue("c++")) // ?
```

但是这种写法和 plus 操作符在一起用，有一个 bug ，看一下下面这个例子。

```kotlin
val newMap = map + mapOf("python" to 3)
println(newMap.getValue("c++")) // 调用 getValue 时抛出异常，异常信息：Key c++ is missing in the map.
```

> 通过 plus(+) 操作符合并两个 map，返回一个新的 map, 但是忽略了默认值，所以看到上面的错误信息，我们在开发的时候需要注意这点。

## plus 操作符

```kotlin
fun main() {
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println("$numbersMap") // {one=1, two=2, three=3}
    
    // plus (+)
    println(numbersMap + ("four" to 4)) // {one=1, two=2, three=3, four=4}
    println(numbersMap + Pair("one", 10)) // {one=10, two=2, three=3}
    println(numbersMap + Pair("five", 5)) // {one=1, two=2, three=3, five=5}
    println(numbersMap + Pair("five", 5) + Pair("one", 11)) // {one=11, two=2, three=3, five=5}
    
    // minus (-)
    println(numbersMap - "one") // {two=2, three=3}
    println(numbersMap - listOf("two", "four")) // {one=1, three=3}
    
}
```

# Kotlin容器操纵

测试数据

```
data class Course constructor(var name: String, var period: Int, var isMust: Boolean = false)
data class Student constructor(var name: String, var age: Int, var isMale: Boolean, var courses: List<Course> = listOf())

val students = listOf(
        Student("taylor", 33, false, listOf(Course("physics", 50), Course("chemistry", 78))),
        Student("milo", 20, false, listOf(Course("computer", 50, true))),
        Student("lili", 40, true, listOf(Course("chemistry", 78), Course("science", 50))),
        Student("meto", 10, false, listOf(Course("mathematics", 48), Course("computer", 50, true)))
)
```

> 业务需求如下：假设现在需要基于学生列表过滤出所有学生的选修课（课时数 < 70），输出时按课时数升序排列，课时数相等的再按课程名字母序排列，并写课程名的第一个字母。

```kotlin
val friends = students
        .flatMap { it.courses }
        .toSet()
        .filter { it.period < 70 && !it.isMust }
        .map {
            it.apply {
                name = name.replace(name.first(), name.first().toUpperCase())
            }
        }
        .sortedWith(compareBy({ it.period }, { it.name }))
```

## map (集合中的所有元素一一映射到其他元素构成新的集合)

原来`map()`内部使用了for循环遍历源集合，并在每个元素上应用了transform这个变换，最后将变换后的元素加入临时集合中并将其返回。

1. 将List变换后生成新的ArrayList，也可以是ArrayList
2. 对原来的List没有影响，是新生成的一个ArrayList
3. 内置了for循环，会对集合中的每一个元素应用变换逻辑

原理：<br>map()内会新建一个ArrayList类型的集合（它是一个中间临时集合）并传给mapTo()

```kotlin
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
    return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)
}
public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.mapTo(destination: C, transform: (T) -> R): C {
    for (item in this)
        destination.add(transform(item))
    return destination
}
```

案例：将所有student的name大写

```kotlin
val map = students.map {
it.name =  it.name.toUpperCase()
it.name
}
println("map result=$map")
```

> map: 在集合的每一个元素上应用一个自定义的变换，然后返回变换后的List；返回结果也是一个ArrayList

## flatMap（集合中的所有元素一一映射到新的集合并合并这些集合得到新的集合）

> 将嵌套集合中的内层集合铺开，变换transform需要一个Iterable类型的（不然和Map没啥区别）<br>flatMap()的源码和map()非常相似，唯一的区别是，**transform这个变换的结果是一个集合类型，然后会把该集合整个加入到临时集合。**<br>flatMap()做了两件事情：先对源集合中每个元素做变换（变换结果是另一个集合），然后把多个集合合并成一个集合。这样的操作非常适用于集合中套集合的数据结构，就好像本例中的学生实例存放在学生列表中，而每个学生实例中包含课程列表。通过先变换后平铺的操作可以方便地将学生列表中的所有课程平铺开来。

源码：

```kotlin
public inline fun <T, R> Iterable<T>.flatMap(transform: (T) -> Iterable<R>): List<R> {
    return flatMapTo(ArrayList<R>(), transform)
}

public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.flatMapTo(destination: C, transform: (T) -> Iterable<R>): C {
    for (element in this) {
        val list = transform(element)
        destination.addAll(list)
    }
    return destination
}
```

案例：

```kotlin
val flatMapResult = students.flatMap {
    it.courses
}
println(flatMapResult.log())

//    val flatMapResult2 = students.flatMap {
//        it.name // 报错，需要的是一个Iterable的类型，不然就和Map一样了
//    }
//    println(flatMapResult2.log())
```

结果：

```
Course(name=physics, period=50, isMust=false), 
Course(name=chemistry, period=78, isMust=false), 
Course(name=computer, period=50, isMust=true), 
Course(name=chemistry, period=78, isMust=false), 
Course(name=science, period=50, isMust=false), 
Course(name=mathematics, period=48, isMust=false), 
Course(name=computer, period=50, isMust=true),
```

## filter（保留满足条件的元素）

> 只保留满足条件的集合元素，即保留返回值为true的元素，用ArrayList保存返回

类似的，它也会构建一个临时集合来暂存运算的中间结果，在遍历源集合的同时应用条件判断predicate，当满足条件时才将源集合元素加入到临时集合。

```kotlin
public inline fun <T> Iterable<T>.filter(predicate: (T) -> Boolean): List<T> {
    return filterTo(ArrayList<T>(), predicate)
}

public inline fun <T, C : MutableCollection<in T>> Iterable<T>.filterTo(destination: C, predicate: (T) -> Boolean): C {
    for (element in this) if (predicate(element)) destination.add(element)
    return destination
}
```

案例：

```kotlin
val filterResult = students.filter {
    it.age >=30
}
```

## toSet

> 将集合元素去重，新创建一个LinkedHashSet来实现元素的唯一性

```kotlin
public fun <T> Iterable<T>.toSet(): Set<T> {
    if (this is Collection) {
        return when (size) {
            0 -> emptySet()
            1 -> setOf(if (this is List) this[0] else iterator().next())
            else -> toCollection(LinkedHashSet<T>(mapCapacity(size)))
        }
    }
    return toCollection(LinkedHashSet<T>()).optimizeReadOnlySet()
}

public fun <T, C : MutableCollection<in T>> Iterable<T>.toCollection(destination: C): C {
    for (item in this) {
        //重复元素会添加失败
        destination.add(item)
    }
    return destination
}
```

## asSequence

> 用于将一连串集合操作变成序列，以提升集合操作性能。

因为每个操纵集合的函数都会新建一个临时集合以存放中间结果。为了更好的性能，有没有什么办法去掉临时集合的创建？

序列就是为此而生的，用序列改写上面的代码：

```kotlin
val friends = students
        .flatMap { it.courses }
        .toSet()
        .filter { it.period < 70 && !it.isMust }
        .map {
            it.apply {
                name = name.replace(name.first(), name.first().toUpperCase())
            }
        }
        .sortedWith(compareBy({ it.period }, { it.name }))
```

通过调用`asSequence()`将原本的集合转化成一个序列，序列将对集合元素的操作分为两类

1. 中间操作
2. 末端操作

从返回值上看，中间操作返回的另一个序列，而末端操作返回的是一个集合（toSet()就是末端操作）。

从执行时机上看，中间操作都是惰性的，也就说中间操作都会被推迟执行。而末端操作触发执行了所有被推迟的中间操作。所以将toSet()移动到了末尾。

序列还会改变中间操作的执行顺序，如果不用序列，n 个中间操作就需要遍历集合 n 遍，每一遍应用一个操作，使用序列之后，只需要遍历集合 1 遍，在每个元素上一下子应用所有的中间操作。

## forEach(遍历)

```kotlin
listOf(1, 2, 3).forEach {
    println("-----start each $it -----")
    if (it == 2) {
        return@forEach // 这里的意思是下面的代码不执行，循环还是会继续，不会跳出循环
    }
    println("-----end each $it -----")
}
```

结果：

```
-----start each 1 -----
-----end each 1 -----
-----start each 2 -----
-----start each 3 -----
-----end each 3 -----
```

## sum 求和

## reduce

## fold

## joinToString

joinToString 方法提供了一组丰富的可选择项（ 分隔符，前缀，后缀，数量限制等等 ）可用于将可迭代对象转换为字符串。

```kotlin
val data = listOf("Java", "Kotlin", "C++", "Python")
    .joinToString(
        separator = ",",
        prefix = "{",
        postfix = "}",
        limit = 3,
        truncated = ""
    ) {
        it.toUpperCase()
    }
println(data)
```

结果：

```
{JAVA,KOTLIN,C++,}
```

# Sequence和Iterator

## Iterator

在 Iterator 处理过程中，每一次的操作都是对整个数据进行操作，需要开辟新的内存来存储中间结果，将结果传递给下一个操作。

```
val data = (1..3).asIterable()
        .filter { print("F$it, "); it % 2 == 1 }
        .map { print("M$it, "); it * 2 }
        .forEach { print("E$it, ") }
println(data)

// 输出 F1, F2, F3, M1, M3, E2, E6
```

在 Iterator 处理过程中，调用 filter 方法对整个数据进行操作输出 F1, F2, F3，将结果存储到 List 中, 然后将结果传递给下一个操作 （ map ） 输出 M1, M3 将新的结果在存储的 List 中, 直到所有操作处理完毕。

```kotlin
// 每次操作都会开辟一块新的空间，存储计算的结果
public inline fun <T> Iterable<T>.filter(predicate: (T) -> Boolean): List<T> {
    return filterTo(ArrayList<T>(), predicate)
}

// 每次操作都会开辟一块新的空间，存储计算的结果
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
    return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)
}
```

对于每次操作都会开辟一块新的空间，存储计算的结果，这是对内存极大的浪费，我们往往只关心最后的结果，而不是中间的过程。

## Sequence

Sequences 是属于懒加载操作类型，在 Sequences 处理过程中，每一个中间操作不会进行任何计算，它们只会返回一个新的 Sequence，经过一系列中间操作之后，会在末端操作 toList 或 count 等等方法中进行最终的求值运算

在 Sequences 处理过程中，会对单个元素进行一系列操作，然后在对下一个元素进行一系列操作，直到所有元素处理完毕。

在 Sequences 处理过程中，每一个中间操作（ map、filter 等等 ）不进行任何计算，只有在末端操作（ toList、count、forEach 等等方法 ） 进行求值运算，如何区分是中间操作还是末端操作，看方法的返回类型，中间操作返回的是  Sequence，末端操作返回的是一个具体的类型（ List、int、Unit 等等 ）源码如下所示。

```kotlin
// 中间操作 map ，返回的是  Sequence
public fun <T, R> Sequence<T>.map(transform: (T) -> R): Sequence<R> {
    return TransformingSequence(this, transform)
}

// 末端操作 toList 返回的是一个具体的类型（List）
public fun <T> Sequence<T>.toList(): List<T> {
    return this.toMutableList().optimizeReadOnlyList()
}

// 末端操作 forEachIndexed 返回的是一个具体的类型（Unit）
public inline fun <T> Sequence<T>.forEachIndexed(action: (index: Int, T) -> Unit): Unit {
    var index = 0
    for (item in this) action(checkIndexOverflow(index++), item)
}
```

1. 如果是中间操作 map、filter 等等，它们返回的是一个 Sequence，不会进行任何计算
2. 如果是末端操作 toList、count、forEachIndexed 等等，返回的是一个具体的类型（ List、int、Unit 等等 ），会做求值运算

> sequence 比 iterator 更好，因为他的定义更清晰。推荐使用 Java8 的 Stream API 也是基于相同的理由。

## 什么时候使用Sequences(序列)

### 数据集量级是足够大，建议使用序列(Sequences)。

### 对数据集进行频繁的数据操作，类似于多个操作符链式操作，建议使用序列(Sequences)

### 链接多个操作符

> 处理集合时性能损耗的最大原因是循环。集合元素迭代的次数越少性能越好

```kotlin
list
  .map { it + 1 }
  .filter { it % 2 == 0 }
  .count { it < 10 } //286 μs
```

decompile code

```java
Collection<Integer> destination = new ArrayList<>(list.size());
Iterable<Integer> iterable = list;
Iterator<Integer> iterator = iterable.iterator();
 
while (iterator.hasNext()) {
    int it = iterator.next();
    destination.add(it + 1);
}
 
iterable = destination;
destination = new ArrayList<>();
iterator = iterable.iterator();
 
while (iterator.hasNext()) {
    int it = iterator.next();
    if (it % 2 == 0) {
        destination.add(it);
    }
}
 
iterable = destination;
int count = 0;
iterator = iterable.iterator();
 
while (iterator.hasNext()) {
     int it = iterator.next();
    if (it < 10) {
        ++count;
    }
}
return count;
```

当你反编译上述代码的时候，你会发现Kotlin编译器会创建三个while循环.其实你可以使用命令式编程方式利用一个循环就能实现上面相同任务的需求。不幸的是，编译器无法将代码优化到这样的程度。

使用Sequence

```kotlin
list
  .asSequence()
  .map { it + 1 }
  .filter { it % 2 == 0 }
  .count { it < 10 } // 212 μs
```

序列(Sequences) 的秘诀在于它们是共享同一个迭代器(iterator) ---序列允许 map操作 转换一个元素后，然后立马可以将这个元素传递给 filter操作 ，而不是像集合(lists) 一样等待所有的元素都循环完成了map操作后，用一个新的集合存储起来，然后又遍历循环从新的集合取出元素完成filter操作。通过减少循环次数，该序列为我们提供了26％（List为286μs，Sequence为212μs）性能提升：

### 使用first{...}或者last{...}操作符

当使用接收一个预判断的条件 `first or last` 方法时候，使用**序列(Sequences)**会产生一个小的性能提升，如果将它与其他操作符结合使用，它的性能将会得到更大的提升。

```kotlin
list
  .map { it + 1 }
  .first { it % 100 == 0 } // 232 μs
```

使用了序列(Sequences) 的版本:

```kotlin
list
  .asSequence()
  .map { it + 1 }
  .first { it % 100 == 0 } // 8 μs
```

## 什么时候使用Iterator(集合)

### 量级比较小的集合元素

Kotlin Lists API在处理一些小量级的集合元素（比如说少于100个）时仍然非常有效，你不应该在乎它是否需要0.000007s（7μs）或0.000014s（14μs），通常不值得花了很大功夫去进行优化。

### 访问索引元素

### 返回/传递给其他的函数

每次迭代Sequences(序列) 时，都会计算元素。Lists(集合) 中的元素只计算一次，然后存储在内存中。

这就是为什么你不应该将Sequences(序列) 作为参数传递给函数: 函数可能会多次遍历它们。在传递或者在整个使用List之前建议将Sequences(序列) 转换 Lists(集合)

如果你真的想要传递一个Sequences(序列)，你可以使用`constrainOnce()`，它只允许一次遍历Sequences(序列)，第二次尝试遍历会抛出一个异常

## Sequences 和 Iterator 性能对比

```kotlin
fun main() {
    test1()
    test2()
}

fun test2() {
    val time2 = measureTimeMillis {
        (1..10000000 * 10).asIterable()
            .filter { it % 2 == 1 }
            .map { it * 2 }
            .count()
    }
    println(time2) // 54428
}

fun test1() {
    val time = measureTimeMillis {
        (1..10000000 * 10).asSequence()
            .filter { it % 2 == 1 }
            .map { it * 2 }
            .count()
    }
    println(time) // 1726
}
```

相差了30倍耗时

## Sequences 和 Iterator 内存对比

```kotlin
File("ChicagoCrimes.csv").readLines()
   .drop(1) // Drop descriptions of the columns
   .mapNotNull { it.split(",").getOrNull(6) } 
    // Find description
   .filter { "CANNABIS" in it } 
   .count()
   .let(::println)
// Exception in thread "main" java.lang.OutOfMemoryError: Java heap space


File("ChicagoCrimes.csv").useLines { lines ->
// The type of `lines` is Sequence<String>
   lines
       .drop(1) // Drop descriptions of the columns
       .mapNotNull { it.split(",").getOrNull(6) } 
       // Find description
       .filter { "CANNABIS" in it } 
       .count()
       .let { println(it) } // 318185
```

## Ref

- [x] Sequence和List对比<br><https://mp.weixin.qq.com/s/Vj4ad8f2w_7xiAMjRiLe3A>

# Kotlin可变参数之数组和容器

## 可变参数`vararg`

kotlin用`vararg`关键字声明可变参数，和java的`...`不同。<br>和java的可变参数不同，需要传递的参数已经包装在数组中时，调用该函数的语法。在java，可以按原样传递数组，而kotlin则要求你显式地解包数组，以便每个数组元素在函数中能作为单独的参数来调用。这个叫做**展开运算符**，而使用的时候，不过在对应的参数前面放一个`*`号。

### 1. 可变参数调用可变参数，需要加`*`

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

### 2. 数组传递给可变参数，前面需要加`*`

### 3. 集合传递给可变参数，先将集合转变为数组，再在前面需要加`*`

```
// 可变参数
fun addGames(vararg games: MiniGameModel) {
    miniGameBox.addGames(games.toList())
}
// 将List传递给可变参数
room_mini_game_panel.addGames(*(games.toTypedArray()))
```
