---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# parceler

[TOC]

<https://github.com/johncarl81/parceler>

## 背景

Parcelable有很多冗余代码；用Java的Annotation Processor生成样板代码

## 基本使用

### 相关注解

#### [@Parcel ](/Parcel)

1. 如果没有设置`ParcelConverter`，那么会用value
2. value默认是`Serialization.FIELD`，直接read/write字段，`Serialization.BEAN`通过setter/getter，

#### [@ParcelConstructor ](/ParcelConstructor)

1. 作用于构造器上
2. 用于非空构造器，指定该构造器参与Parceler的序列化代码生成

```java
@Parcel(Serialization.BEAN)
public class Example {
    private final String name;
    private final int age;
    private boolean enabled;

    @ParcelConstructor
    public Example(int age, String name, boolean enabled) {
        this.age = age;
        this.name = name;
        this.enabled = enabled;
    }

    public String getName() { return name; }

    public int getAge() { return age; }

    public boolean isEnabled() { return enabled; }
}
```

#### [@ParcelProperty ](/ParcelProperty)

属性和getter/setter混用，未搞明白

#### [@Transient ](/Transient)

不需要序列化的字段加上

### Parcels支持的类型

```
byte

double

float

int

long

char

boolean

String

IBinder

Bundle

SparseArray of any of the mapped types*

SparseBooleanArray

ObservableField

List, ArrayList and LinkedList of any of the mapped types*

Map, HashMap, LinkedHashMap, SortedMap, and TreeMap of any of the mapped types*

Set, HashSet, SortedSet, TreeSet, LinkedHashSet of any of the mapped types*

Parcelable

Serializable

Array of any of the mapped types

Any other class annotated with @Parcel
```

- 需要泛型的需要指定泛型，不指定就会报错

```
List testList;
```

报错

```
Parceler: Unable to find read/write generator for type java.util.List for me.hacket.assistant.samples.三方库.parcels.Example.testList
```

### 单个Parcelable

```java
// wrap
intent.putExtra(KEY_DATA, Parcels.wrap(parcelModel));
// unwrap
ParcelModel mParcelModel = Parcels.unwrap(intent.getParcelableExtra(KEY_DATA));
```

### 集合

对集合类型支持友好

```
Parcelable listParcelable = Parcels.wrap(new ArrayList<Example>());
Parcelable mapParcelable = Parcels.wrap(new HashMap<String, Example>());
```

### 多态(继承)

<https://github.com/johncarl81/parceler#polymorphism>

1. Parceler不能unwrap子类，所以任何多态字段unwrap后都是实例化为其基类实例，为了性能因为这不是运行时，而是编译时，不会检测`.getClass()`；
2. 子类不能继承父类的@Parcel注解，子类需要单独声明`@Parcel`注解

### Serialization techniques

### 注意

- 用`@Parcel`注解在要Parcelable的类，如果是内部类必须也要用`@Parcel`修饰
- 如果某个成员存在非`Parcelable`的子类的class，会报错，如`View.OnClickListener`

```
Error:(29, 33) 错误: Parceler: Unable to find read/write generator for type android.view.View.OnClickListener for me.hacket.thirdpart.parceler.ParcelModel.mOnClickListener
```

- 默认序列化策略，字段不能是private

> 默认@Parcel，测试是可以的，会反射暴力获取设置值，前提是需要有默认构造器，不建议用private，用了暴力反射可能会出bug

- 默认序列化策略，没有空构造器，报错，需要加`@ParcelConstructor`注解标记构造器，有且只有一个`@ParcelConstructor`

```
No @ParcelConstructor annotated constructor and no default empty bean constructor found.
```

- 可以为private，默认构造器，且带getter/setter

```java
@Parcel(Serialization.BEAN)
public class Example {
    private String name;
    private int age;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
```

- 报错，可能是该module没有应用kapt注解处理器

```
位置: 程序包 club.jinmei.mgvoice.core.arouter.provider.gift
/Users/zengfansheng/Hacket/Workspace/salam/m_room/build/generated/source/kapt/devDebug/club/jinmei/mgvoice/m_room/model/message/RoomGiftMessage$$Parcelable.java:86: 错误: 找不到符号
            GiftBean giftBean$$0 = club.jinmei.mgvoice.core.arouter.provider.gift.GiftBean$$Parcelable.read(parcel$$3, identityMap$$1);
```

- `@Transient`某个字段不序列化

```
For attributes that should not be serialized with Parceler, the attribute field, getter or setter may be annotated by @Transient.
```

#### 非空构造器

```java
@Parcel(Serialization.BEAN)
public class Example {
    private final String name;
    private final int age;

    @ParcelConstructor
    public Example(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public String getName() { return name; }

    public int getAge() { return age; }
}
```

- 继承关系<br /><https://github.com/johncarl81/parceler#polymorphism><br />不支持多态接收，接收的总是Parent。需要自定义。
- 混淆

```
# Parceler library
-keep interface org.parceler.Parcel
-keep @org.parceler.Parcel class * { *; }
-keep class **$$Parcelable { *; }
```

## 常见问题

### Kotlin中使用Parcel

使用data class时会报错

```
 Parceler: No @ParcelConstructor annotated constructor and noefault empty bean constructor found.
```

解决：

#### 1. 将所有的构造参数都设置个默认值

> kotlin的data class所有参数都设置个默认值才有空构造器

```kotlin
@Parcel
data class User(
        val name: String? = "",
        val age: Int = 0,
        val g: Boolean = true
)
```

#### 2. 加上`@ParcelConstructor`，这个没测试过

<https://github.com/johncarl81/parceler/issues/275>

```kotlin
@Parcel
data class  User @ParcelConstructor constructor(
        val name: String,
        val age: Int,
        val g: Boolean
)
```

#### 3. 用Kotlin的`@Parcelize`

### org.parceler.ParcelerRuntimeException: Unable to find generated Parcelable class

```
org.parceler.ParcelerRuntimeException: Unable to find generated Parcelable class for club.jinmei.mgvoice.m_userhome.model.UserHomeInfo, verify that your class is configured properly and that the Parcelable class club.jinmei.mgvoice.m_userhome.model.UserHomeInfo$$Parcelable is generated by Parceler.
```

类以及加了`@Parcel`注解，但还是报错，这是因为没有添加kapt注解编译器

```
kapt commons["parceler-compiler"]
```
