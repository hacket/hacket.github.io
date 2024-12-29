---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

### google AutoValue

> `Google AutoValue` 一个Java不可变数据类型的代码生成库，用于帮我们生成Bean的`getter()`，`hashCode()`，`equals()`，`toString()`，注意没有`setter()`<br />开源项目主页<br /><https://github.com/google/auto><br />官网文档:<br /><https://github.com/google/auto/blob/master/value/userguide/index.md><br />Why use AutoValue?<br /><https://github.com/google/auto/blob/master/value/userguide/why.md>

生成的immutable，没有setter方法，怎么修改？

#### 简单用法

##### 添加dependencies

```groovy
provided 'com.google.auto.value:auto-value:1.2'
apt 'com.google.auto.value:auto-value:1.2'
```

##### 创建一个`abstract`类使用`@AutoValue`作用于类上

```java
@AutoValue
public abstract class Story {
    public abstract int id();
    public abstract String title();
}
```

使用`@AutoValue`注解后，`AutoValue`会生成一个`AutoValue_你的类名`为名称的类并继承你写的抽象类，这个类是`包级私有`的，他里面有私有的成员变量，对应的构造函数，以及重写的`hashCode()`、`equals()`和`toString()`方法。由于这个生成的子类是包级私有的，所以这里在给Story提供构造方法的时候需要提供一个静态的构造方法。

##### [生成Builder代码]

- 编写builder()方法，返回`new AutoValue_*.Builder();`具体根据你的实体名字修改
- 编写Builder类：
  - 使用`@AutoValue.Builder`注解`abstract static class Builder`类
  - 在类中必须要有一个方法`abstract T build();` 将T改为你的实体。
  - 在类中用`abstract Builder 变量名(变量类型 value)` 这样的形式声明你所有的参数。

```java
@AutoValue
public abstract class Animal {
    abstract String name();
    abstract int numberOfLegs();
    static Builder builder() {
        return new AutoValue_Animal.Builder();
    }
    @AutoValue.Builder
    abstract static class Builder {
        abstract Builder name(String value);
        abstract Builder numberOfLegs(int value);
        abstract Animal build();
    }
}
```

使用

```java
Animal animal = Animal.builder().name("dog").numberOfLegs(4).build();
```

#### 注意

1.

##### 类必须是`abstract`，并且只能是带有返回值的无参数的`abstract`的方法，返回值不能是void，也不能带有参数。修饰符不能为private

```java
// 带有参数的
abstract String name(int age);
// 返回值为void的
abstract void haha();
```

2.

##### `equals(`)、`hashCode()` 和 `toString()`如果你想要实现你自己版本的这些方法（或其中之一），你可以在注解类中自己实现，AutoValue 会识别出来并不产生代码，你的实现也会被继承并在 final 类中被使用。

3.

##### 生成的类

- 生成类继承了添加注解的抽象类，生成的类是 final 的，而且带有 `AutoValue_`前缀。
- 如果你想要在添加注解的类中访问生成的代码的话，这一点很重要。因为这样就像通过静态工厂方法访问构造器。
- 该类是包间私有的。因此在其他包里无法看到生成的类，当然，它也不应该在其他类中被使用。
- 该类构造器也是包间私有的，将所有参数作为属性
- 构造器中对传入的参数作了判断，所有属性都不会是空。如果你想让某个属性为空，不妨添加一个`@Nullable`注解

```java
@AutoValue
public abstract class User {
  @Nullable public abstract String middleName();
}
```

- 成员变量真的没什么特别的，唯一要说的就是数据域都是 final，以保证类型不变性。

#### AutoValue Extension API

- 实现Parcelable<br /><https://github.com/rharter/auto-value-parcel>
- Gson<br /><https://github.com/rharter/auto-value-gson>

#### Reference

使用 Google AutoValue 自动生成代码<br /><http://www.jianshu.com/p/0e2be3536a4e><br />深入研究AutoValue<br />[https://github.com/hehonghui/android-tech-frontier/blob/master/issue-49/深入研究AutoValue.md](https://github.com/hehonghui/android-tech-frontier/blob/master/issue-49/%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6AutoValue.md)

### auto-service

> auto-service<br /><https://github.com/google/auto/tree/master/service>

#### 使用

```
'com.google.auto.service:auto-service:1.0-rc2'
'com.squareup:javapoet:1.8.0'
```

在你的Processor上添加`@AutoService(Processor.class)`

```java
package foo.bar;

import javax.annotation.processing.Processor;

@AutoService(Processor.class)
final class MyProcessor extends Processor {
  // …
}
```

会在`src/main/`生成`META-INF/services/javax.annotation.processing.Processor`

```
me.hacket.BindViewProcessor
```
