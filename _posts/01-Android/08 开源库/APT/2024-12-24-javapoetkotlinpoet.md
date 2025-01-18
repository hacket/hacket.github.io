---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# JavaPoet

> javapoet，产生Java源文件<br /><https://github.com/square/javapoet>

## JavaPoet API说明

### FieldSpec 创建字段（属性）

代表一个成员变量，一个字段声明

- builder(Type type, String name, Modifier... modifiers) 字段类型，字段名，字段修饰符
- addModifiers(Modifier... modifiers) 字段修饰符
- initializer(String format, Object... args) 初始化参数

```java
FieldSpec fieldSpec = FieldSpec.builder(String.class, "android") // 等价于 String android;
    .addModifiers(Modifier.PRIVATE, Modifier.FINAL) // 等价于 private final String android;
    .initializer("$S", "Android") // 等价于 private final String android = "Android";
    .build();
```

#### Modifier

Modifier包括我们用到的所有修饰符：

```java
public enum Modifier {
    PUBLIC,
    PROTECTED,
    PRIVATE,
    ABSTRACT,
    DEFAULT, // JDK1.8
    STATIC,
    FINAL,
    TRANSIENT,
    VOLATILE,
    SYNCHRONIZED,
    NATIVE,
    STRICTFP;
}
```

### MethodSpec 创建方法

代表一个方法或者构造方法声明

- constructorBuilder() 构造方法
- methodBuilder(String name) 方法名
- addModifiers(Modifier... modifiers) 方法修饰符
- addParameter(Type type, String name, Modifier... modifiers) 方法参数列表
- addStatement(String format, Object... args) 方法代码段，会自动导包
- addCode(String format, Object... args) 方法代码段；一股脑的添加所有代码。但是我们需要自己换行，输入分号和缩进不会导包
- returns(Type returnType) 返回值
- beginControlFlow(String controlFlow, Object... args) 流程控制开始
- endControlFlow() 流程控制结束
- addJavadoc(String format, Object... args) 添加方法文档注释
- addAnnotation(Class<?> annotation) 方法上面添加注解

#### 构造方法

```java
MethodSpec methodSpec = MethodSpec.constructorBuilder()
    .addModifiers(Modifier.PUBLIC)
    .build();

TypeSpec typeSpec = TypeSpec.classBuilder("Test")
    .addMethod(methodSpec)
    .build();

/*
class Test {
    public Test() {
    }
}*/
```

#### 案例

**案例1：**

```java
MethodSpec methodSpec = MethodSpec.methodBuilder("test")
    .returns(void.class) // void test() {}
    .addModifiers(Modifier.PUBLIC) // public void test() {}
    .addParameter(String.class, "str") //  public void test(String str) {}
    .addStatement("System.out.println(str)")
    .build();
```

输出：

```
public void test(String str) {
    System.out.println(str);
}
```

**案例2：**

```java
MethodSpec methodSpec = MethodSpec.methodBuilder("test")
    .addCode(""
            + "int total = 0;\n"
            + "for (int i = 0; i < 10; i++) {\n"
            + "  total += i;\n"
            + "}\n")
    .build();
```

输出：

```
void test() {
    int total = 0;
    for (int i = 0; i < 10; i++) {
      total += i;
    }
}
```

### TypeSpec 创建类、接口或枚举

代表一个类，接口，或者枚举声明

#### 创建类

- classBuilder(String name) 类，接口或枚举名
- addModifiers(Modifier... modifiers) 类修饰符
- addMethod(MethodSpec methodSpec) 类中添加方法
- addField(Type type, String name, Modifier... modifiers) 类中添加字段

```java
// class Test {}
TypeSpec.classBuilder("Test").build();
```

#### 创建枚举

- enumBuilder(String name) 生成一个name枚举

```java
/*
enum Test {
    ONE
}*/
TypeSpec typeSpec = TypeSpec.enumBuilder("Test").addEnumConstant("ONE").build();
```

#### 创建接口

- interfaceBuilder(String name) 生成一个name接口

```java
// interface Test {}
TypeSpec.interfaceBuilder("Test").build();
```

### JavaFile 输出文件

JavaFile用于输出包含单个顶级类的Java文件。

- builder(String packageName, TypeSpec typeSpec) 包名，类名
- addStaticImport(Class<?> clazz, String... names) 静态导包
- writeTo(Appendable out) 写入到xxx

案例1：

```java
private static void test1() {
    FieldSpec fieldSpec = FieldSpec.builder(String.class, "android") // 等价于 String android;
            .addModifiers(Modifier.PRIVATE, Modifier.FINAL) // 等价于 private final String android;
            .initializer("$S", "Android") // 等价于 private final String android = "Android";
            .build();

    MethodSpec methodSpec = MethodSpec.methodBuilder("test")
            .returns(void.class) // void test() {}
            .addModifiers(Modifier.PUBLIC) // public void test() {}
            .addParameter(String.class, "str") //  public void test(String str) {}
            .addStatement("System.out.println(str)")
            .build();
//                public void test(String str) {
//                    System.out.println(str);
//                }

    TypeSpec typeSpec = TypeSpec.classBuilder("Test")
            .addMethod(methodSpec)
            .addField(fieldSpec)
            .build();

    JavaFile javaFile = JavaFile.builder("me.hacket.apt.demo", typeSpec)
            .build();

    try {
        javaFile.writeTo(System.out);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

输出：

```java
package me.hacket.apt.demo;

import java.lang.String;

class Test {
    private final String android = "Android";

    public void test(String str) {
        System.out.println(str);
    }
}
```

## 进阶用法

### ControlFlow

使用`addStatement`可以帮我们添加分号和换行，而使用`beginControlFlow`和`endControlFlow`组合可以帮我们轻松实现控制流代码：

### for循环

```java
MethodSpec methodSpec = MethodSpec.methodBuilder("test")
        .addStatement("int total = 0")
        .beginControlFlow("for (int i = 0; i < 10; i++)")
        .addStatement("total += i")
        .endControlFlow()
        .build();
TypeSpec typeSpec = TypeSpec.classBuilder("Test")
        .addMethod(methodSpec)
        .build();
JavaFile javaFile = JavaFile.builder("me.hacket.apt.demo", typeSpec)
        .build();
javaFile.writeTo(System.out);
```

输出：

```java
class Test {
  void test() {
    int total = 0;
    for (int i = 0; i < 10; i++) {
      total += i;
    }
  }
}
```

### 其他控制语句

```java
// do... while
.beginControlFlow("do")
.endControlFlow("while (true)")

// if... else if... else...
.beginControlFlow("if (true)")
.nextControlFlow("else if (false)")
.nextControlFlow("else")
.endControlFlow()

// try... catch... finally
.beginControlFlow("try")
.nextControlFlow("catch ($T e)", Exception.class)
.addStatement("e.printStackTrace()")
.nextControlFlow("finally")
.endControlFlow()
```

### 占位符

#### $S （String）字符串

当代码中包含字符串的时候, 可以使用`$S`表示

```java
private static MethodSpec whatsMyName(String name) {
  return MethodSpec.methodBuilder(name)
      .returns(String.class)
      .addStatement("return $S", name)
      .build();
}
```

#### $L （Literal）字面量

`$L`是字面量替换，它与`$S`相似，但是它并不需要转义，也就是不包含字符串的引号。

```java
private MethodSpec computeRange(String name, int from, int to, String op) {
  return MethodSpec.methodBuilder(name)
      .returns(int.class)
      .addStatement("int result = 0")
      .beginControlFlow("for (int i = $L; i < $L; i++)", from, to)
      .addStatement("result = result $L i", op)
      .endControlFlow()
      .addStatement("return result")
      .build();
}
```

#### $T （Type）非基础类型的类

上面例子为了简单，都使用的是一些基础类型，为的是不需要导包。实际中我们需要使用大量对象，如果只是在字符串中写死，代码虽没有问题，但是没有导包还是会保错。这是可以考虑使用$T，它的作用是替换类型。

```java
MethodSpec today = MethodSpec.methodBuilder("today")
    .returns(Date.class)
    .addStatement("return new $T()", Date.class)
    .build();
```

#### $N （ Name）

`$N是名称替换。例如我们定义了一个getXXX的方法，我们调用它时可以使用addStatement("get$`L()", "XXX")<br />这种写法实现，但是每次拼接"get"未免太麻烦了，一个不留心说不定还忘记了。那么使用addStatement("$N()", methodSpec)就更加方便了。

```java
MethodSpec methodSpec = MethodSpec.methodBuilder("get" + name)
    .returns(String.class)
    .addStatement("return $S", name)
    .build();

MethodSpec.methodBuilder("getValue")
    .returns(String.class)
    .addStatement("return $N()", methodSpec)
    .build();
```

### 继承与接口

```java
TypeSpec.classBuilder("Test")
    .superclass(String.class)
    .addSuperinterface(Serializable.class)
    .build();

// class Test extends String implements Serializable {}
```

### 泛型

```java
FieldSpec.builder(TypeVariableName.get("T"), "mT", Modifier.PRIVATE).build();
// private T mT;

TypeVariableName mTypeVariable = TypeVariableName.get("T");
ParameterizedTypeName mListTypeName = ParameterizedTypeName.get(ClassName.get(List.class), mTypeVariable);
FieldSpec fieldSpec = FieldSpec.builder(mListTypeName, "mList", Modifier.PRIVATE).build();

// private List<T> mList;
```

方法和类中使用`addTypeVariable`添加泛型。

### 初始化块

```java
TypeSpec.classBuilder("Test")
    .addStaticBlock(CodeBlock.builder().build())
    .addInitializerBlock(CodeBlock.builder().build())
    .build();
    
/*
class Test {
    static {
    }

    {
    }
}*/
```

### Annotations

添加注解的方法可以直接使用`addAnnotation()`。

```java
MethodSpec toString = MethodSpec.methodBuilder("toString")
    .addAnnotation(Override.class)
    .returns(String.class)
    .addModifiers(Modifier.PUBLIC)
    .addStatement("return $S", "Hoverboard")
    .build();
```

如果需要给注解设置属性，那么需要使用`AnnotationSpec` :

```java
AnnotationSpec.builder(Headers.class)
    .addMember("accept", "$S", "application/json; charset=utf-8")
    .addMember("userAgent", "$S", "Square Cash")
    .build()

/*@Headers(
    accept = "application/json; charset=utf-8",
    userAgent = "Square Cash"
)*/
```

### 匿名内部类

```java
TypeSpec.anonymousClassBuilder("") // <- 也可添加参数
    .superclass(Runnable.class)
    .addMethod(MethodSpec.methodBuilder("run")
    			   .addModifiers(Modifier.PUBLIC)
                   .addAnnotation(Override.class)
                   .returns(TypeName.VOID)
                   .build())
    .build();

/*
new Runnable() {
    @Override
    public void run() {
    }
}*/
```

### Javadoc

添加注释可以使用`addJavadoc`，直接传入注释字符串就行了

## 简单用法

### 案例1：生成一个`HelloWorld`

```java
MethodSpec mainMethodSpec = MethodSpec.methodBuilder("main") // 方法名
        .addModifiers(Modifier.PUBLIC, Modifier.STATIC) // 方法修饰符
        .addParameter(String[].class, "args") // 添加string[]类型的名为args的参数
        .addStatement("$T.out.println($S)", System.class, "Hello World!") // 添加代码，这里$T和$S后面会讲，这里其实就是添加了System,out.println("Hello World");
        .build();

TypeSpec helloWorld = TypeSpec.classBuilder("HelloWorld") // 类名
        .addModifiers(Modifier.PUBLIC, Modifier.STATIC) // 类修饰符
        .addMethod(mainMethodSpec) // 在类中添加方法
        .build();

JavaFile javaFile = JavaFile.builder("com.example.helloworld", helloWorld).build();
javaFile.writeTo(System.out);
```

生成的文件:

```java
package com.example.helloworld;

import java.lang.String;
import java.lang.System;

public static class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

### 案例2：for循环

- addCode() 方式

```java
MethodSpec mainMethodSpec = MethodSpec.methodBuilder("main")
    .addModifiers(Modifier.PUBLIC, Modifier.STATIC)
    .addParameter(String[].class, "args")
    .addCode(""
            + "int total = 0;\n"
            + "for (int i = 0; i < 10; i++) {\n"
            + "  total += i;\n"
            + "}\n") // for循环
    .build();
```

- addStatement()方式

```java
mainMethodSpec = MethodSpec.methodBuilder("main")
        .addModifiers(Modifier.PUBLIC, Modifier.STATIC)
        .addParameter(String[].class, "args")
        .addStatement("int total = 0")
        .beginControlFlow("for (int i = 0; i < 10; i++)") // 控制流语句
        .addStatement("total += i")
        .endControlFlow()
        .build();
```

- addCode()和addStatement()区别<br />addStatement() 生成的代码，自动缩进的，自动加分号、换行的和自动导包的。<br />addCode() 什么都没有

## 占位符

- $L 字面量
- $S for Strings
- $T for Types（在生成的源码会自动导入你的类包）
- $N for Names(我们自己生成的方法名或者变量名等)

### 添加变量FieldSpec

```java
FieldSpec android = FieldSpec.builder(String.class, "android")
        .addModifiers(Modifier.PRIVATE, Modifier.FINAL)
        .initializer("$S + $L", "Lollipop v.", 5.0d)
        .build();

TypeSpec typeSpec = TypeSpec.classBuilder("HelloWorld")
        .addModifiers(Modifier.PUBLIC)
        .addField(android)
        .addField(String.class, "robot", Modifier.PRIVATE, Modifier.FINAL)
        .build();

JavaFile javaFile = JavaFile.builder("me.hacket.demo", typeSpec).build();
javaFile.writeTo(System.out);
```

生成的代码：

```java
package me.hacket.demo;

import java.lang.String;

public class HelloWorld {
  private final String android = "Lollipop v." + 5.0;

  private final String robot;
}
```

### 生成构造方法

```java
MethodSpec methodSpec = MethodSpec.constructorBuilder().build();
TypeSpec typeSpec = TypeSpec.classBuilder("HelloWorld")
        .addModifiers(Modifier.PUBLIC)
        .addMethod(methodSpec)
        .build();
JavaFile javaFile = JavaFile.builder("me.hacket.demo", typeSpec).build();
javaFile.writeTo(System.out);
```

生成的代码：

```java
package me.hacket.demo;

public class HelloWorld {
  HelloWorld() {
  }
}
```

<http://www.jianshu.com/p/95f12f72f69a>

## Ref

- [ ] JavaPoet 看这一篇就够了

<https://juejin.cn/post/6844903475776585741>

# kotlinpoet

文档：<https://square.github.io/kotlinpoet/>
