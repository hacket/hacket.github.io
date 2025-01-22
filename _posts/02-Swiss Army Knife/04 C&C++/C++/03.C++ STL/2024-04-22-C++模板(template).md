---
date_created: Monday, April 22nd 2024, 10:58:22 pm
date_updated: Wednesday, January 22nd 2025, 11:54:15 pm
title: C++模板(template)
author: hacket
categories:
  - C&C++
category: CPP
tags: [CPP]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-04-11 00:16
date updated: 2024-12-27 23:51
aliases: [C++ 模板 (template)]
linter-yaml-title-alias: C++ 模板 (template)
---

# C++ 模板 (template)

## C++ 模板概述

- **模板**允许你定义一个可以根据你的用途进行编译的模板。模板是泛型编程的基础，类似于 Java 中的泛型。
- 模板只有在被调用的时候才会创建，编译时不会被创建，如果模板代码有错误，编译不会出错，但运行会出错
- 模板不应该被滥用，滥用了会导致可读性太差，有的团队禁止用模板

C++ 提供两种模板机制：**函数模板** 和 **类模板**

## 函数模板

### 函数模板概述

**函数模板**（`Function Template`）是 C++ 中实现泛型编程的一种机制，它允许程序员编写处理不同数据类型而不必改变函数结构的代码。函数模板通过使用类型参数化创建可重用的函数，这些类型参数在函数被调用时被特定的类型替代。

**函数模板作用：**
使用函数模板，可以编写一个与类型无关的函数模板，而编译器会根据需要生成具体类型的函数实例。

### 函数模板示例

**语法：**

```cpp
template<typename T>
函数声明或定义

// template --- 声明创建模板
// typename --- 表面其后面的符号是一种数据类型，可以用class代替
// T --- 通用的数据类型，名称可以替换，通常为大写字母
```

**示例 1：**

```cpp
// 函数模板定义
template <typename T>
T Max(T a, T b){
    return a > b ? a : b;
}
// 在代码中使用函数模板
int main() {
    // 使用 int 类型实例化模板
    int i = Max(10, 5); // 实例化成 Max<int>(int, int)

    // 使用 double 类型实例化模板
    double d = Max(6.34, 3.12); // 实例化成 Max<double>(double, double)

    // 使用 string 类型实例化模板
    std::string s = Max(std::string("hello"), std::string("world")); 
    // 实例化成 Max<std::string>(std::string, std::string)

    return 0;
}
```

> 在这个例子中，Max 是一个函数模板，其目的是返回两个参数中较大的那个。模板参数 T 是一个占位符，表示函数可接受任何类型。
> 当你调用 Max (10, 5) 时，编译器推断出 T 应该是 int 类型，并生成一个 int 版本的 Max 函数。同样地，其他调用（如 Max (6.34, 3.12) 和 Max (std:: string ("hello"), std:: string ("world"))）会分别生成 double 和 std:: string 版本的函数。

**示例 2：也可以用 class**

```cpp
template <typename T>
void mySwap(T &a, T &b)
{
    T temp = a;
    a = b;
    b = temp;
}
template <class T> // 也可以用class替代typename
void mySwap2(T &a, T &b)
{
    T temp = a;
    a = b;
    b = temp;
}
int main()
{
    int a = 10;
    int b = 20;

    // 利用模板实现交换
    // 1、自动类型推导
    mySwap(a, b);
    std::cout << "a = " << a << std::endl;
    std::cout << "b = " << b << std::endl;

    // 2、显示指定类型
    mySwap<int>(a, b);

    std::cout << "----------------" << std::endl;

    // 3、class关键字也可以
    mySwap2(a, b);
    std::cout << "a = " << a << std::endl;
    std::cout << "b = " << b << std::endl;

    return 0;
}
```

- 函数模板利用关键字 `template`
- 使用函数模板有两种方式：**自动类型推导**、**显示指定类型**
- 模板的目的是为了提高复用性，将类型参数化

**示例 3：**

```cpp
template<typename T> void Print(T temp) {
    // 把类型改成模板类型的名字如T就可以了
    std::cout << temp;
}
//干净简洁
int main() {
    Print(1);
    Print("hello");
    Print(5.5);
    // 调用，可读性
    Print(96);//这里其实是隐式的传递信息给模板，可读性不高
    Print<int>(96);//可以显示的定义模板参数，声明函数接受的形参的类型
    Print<char>(96);//输出的可以是数字，也可以是字符！这样的操纵性强了很多
}
```

通过 `template` 定义，则说明定义的是一个模板，它会在编译期被评估，**所以 `template` 后面的函数其实不是一个实际的代码**，**只有当我们实际调用时，模板函数才会基于传递的参数来真的创建** 。 只有当真正调用函数的时候才会被实际创建 。

### 普通函数与函数模板的区别

- 普通函数调用时可以发生自动类型转换（隐式类型转换）
- 函数模板调用时，如果利用自动类型推导，不会发生隐式类型转换
- 如果利用显示指定类型的方式，可以发生隐式类型转换

**示例：**

```cpp
//普通函数
int myAdd01(int a, int b)
{
	return a + b;
}
//函数模板
template<class T>
T myAdd02(T a, T b)  
{
	return a + b;
}
//使用函数模板时，如果用自动类型推导，不会发生自动类型转换,即隐式类型转换
void test01()
{
	int a = 10;
	int b = 20;
	char c = 'c';
	
	cout << myAdd01(a, c) << endl; //正确，将char类型的'c'隐式转换为int类型  'c' 对应 ASCII码 99

	//myAdd02(a, c); // 报错，使用自动类型推导时，不会发生隐式类型转换

	myAdd02<int>(a, c); //正确，如果用显示指定类型，可以发生隐式类型转换
}
int main() {
	test01();
	return 0;
}
```

### 普通函数与函数模板的调用规则

调用规则如下：

1. 如果函数模板和普通函数都可以实现，优先调用普通函数
2. 可以通过空模板参数列表来强制调用函数模板
3. 函数模板也可以发生重载
4. 如果函数模板可以产生更好的匹配，优先调用函数模板

**示例：**

```cpp
// 普通函数与函数模板调用规则
void myPrint(int a, int b)
{
    cout << "call normal function" << endl;
}

template <typename T>
void myPrint(T a, T b)
{
    cout << "call template function" << endl;
}

template <typename T>
void myPrint(T a, T b, T c)
{
    cout << "call template function overload" << endl;
}

void test_fun_call()
{

    // 1、如果函数模板和普通函数都可以实现，优先调用普通函数
    //  注意 如果告诉编译器  普通函数是有的，但只是声明没有实现，或者不在当前文件内实现，就会报错找不到
    int a = 10;
    int b = 20;
    myPrint(a, b); // 调用普通函数

    // 2、可以通过空模板参数列表来强制调用函数模板
    myPrint<>(a, b); // 调用函数模板

    // 3、函数模板也可以发生重载
    int c = 30;
    myPrint(a, b, c); // 调用重载的函数模板

    // 4、 如果函数模板可以产生更好的匹配,优先调用函数模板
    char c1 = 'a';
    char c2 = 'b';
    myPrint(c1, c2); // 调用函数模板
}
```

### 模板的局限性

模板的通用性并不是万能的，自定义数据类型可能就不行。

因此 C++ 为了解决这种问题，提供模板的重载，可以为这些**特定的类型**提供**具体化的模板**，通过 `template <>` 来定义

**示例：**

```cpp
#include<iostream>
using namespace std;
#include <string>
class Person
{
public:
	Person(string name, int age)
	{
		this->m_Name = name;
		this->m_Age = age;
	}
	string m_Name;
	int m_Age;
};
//普通函数模板
template<class T>
bool myCompare(T& a, T& b)
{
	if (a == b)
	{
		return true;
	}
	else
	{
		return false;
	}
}
//具体化，显示具体化的原型和定意思以template<>开头，并通过名称来指出类型
//具体化优先于常规模板
template<> bool myCompare(Person &p1, Person &p2)
{
	if ( p1.m_Name  == p2.m_Name && p1.m_Age == p2.m_Age)
	{
		return true;
	}
	else
	{
		return false;
	}
}
void test01()
{
	int a = 10;
	int b = 20;
	//内置数据类型可以直接使用通用的函数模板
	bool ret = myCompare(a, b);
	if (ret)
	{
		cout << "a == b " << endl;
	}
	else
	{
		cout << "a != b " << endl;
	}
}
void test02()
{
	Person p1("Tom", 10);
	Person p2("Tom", 10);
	//自定义数据类型，不会调用普通的函数模板
	//可以创建具体化的Person数据类型的模板，用于特殊处理这个类型
	bool ret = myCompare(p1, p2);
	if (ret)
	{
		cout << "p1 == p2 " << endl;
	}
	else
	{
		cout << "p1 != p2 " << endl;
	}
}
int main() {
	test01();
	test02();
	return 0;
}
```

- 利用具体化的模板，可以解决自定义类型的通用化

## 类模板（泛型类）

### 类模板概述

为类定义一种模式。使得类中的某些数据成员、默写成员函数的參数、某些成员函数的返回值，能够取随意类型

> 常见的容器比如向量 vector  或 vector  就是模板类

**语法：**

```cpp
template<typename T>
类
```

**示例 1：** 传递数字给模板，来指定要生成的类

```cpp
//不仅仅是typename，这里是具体的类型
template<int N> class Array {
private:
    //在栈上分配一个数组，而为了知道它的大小，要用模板传一个数字N过来
    int m_Array[N];
};
int main() {
    Array<5> array;//用尖括号给模板传递构造的规则。
}
```

**示例 2：** 传递数字给模板，来指定要生成的类

```cpp
//可以传类型，也可以传数字，功能太强大了
//两个模板参数：类型和大小
template<typename T, int size> class Array {
private:
    T m_Array[size];
};
int main() {
    Array<int, 5> array;
}
```

**示例 3：**

```cpp
template <class T, class E>
class Add {
public:
    T add(T t, E e) {
        return t + e;
    }
};
int main() {
    Add<float, int> add;
    cout<< add.add(1.4f, 4) <<endl; // 5.4
}
```

### 类模板与函数

#### 类模板与函数模板区别

类模板与函数模板区别主要有两点：

1. 类模板没有自动类型推导的使用方式
2. 类模板在模板参数列表中可以有默认参数

```cpp
#include <string>
//类模板
template<class NameType, class AgeType = int> 
class Person
{
public:
	Person(NameType name, AgeType age)
	{
		this->mName = name;
		this->mAge = age;
	}
	void showPerson()
	{
		cout << "name: " << this->mName << " age: " << this->mAge << endl;
	}
public:
	NameType mName;
	AgeType mAge;
};
// 1、类模板没有自动类型推导的使用方式
void test01()
{
	// Person p("孙悟空", 1000); // 错误 类模板使用时候，不可以用自动类型推导
	Person <string ,int>p("孙悟空", 1000); //必须使用显示指定类型的方式，使用类模板
	p.showPerson();
}
// 2、类模板在模板参数列表中可以有默认参数
void test02()
{
	Person <string> p("猪八戒", 999); //类模板中的模板参数列表 可以指定默认参数
	p.showPerson();
}
int main() {
	test01();
	test02();
	return 0;
}
```

#### 类模板中成员函数创建时机

类模板中成员函数和普通类中成员函数创建时机是有区别的：

- 普通类中的成员函数一开始就可以创建
- 类模板中的成员函数在调用时才创建

**示例：**

```cpp
class Person1
{
public:
	void showPerson1()
	{
		cout << "Person1 show" << endl;
	}
};

class Person2
{
public:
	void showPerson2()
	{
		cout << "Person2 show" << endl;
	}
};

template<class T>
class MyClass
{
public:
	T obj;

	//类模板中的成员函数，并不是一开始就创建的，而是在模板调用时再生成

	void fun1() { obj.showPerson1(); }
	void fun2() { obj.showPerson2(); }

};

void test01()
{
	MyClass<Person1> m;
	m.fun1();
	//m.fun2();//编译会出错，说明函数调用才会去创建成员函数，m如果一开始创建的话
}

int main() {
	test01();
	return 0;
}
```

#### 类模板对象做函数参数

类模板实例化出的对象，向函数传参的方式，一共有三种传入方式：

1. **指定传入的类型**：直接显示对象的数据类型
2. **参数模板化**：将对象中的参数变为模板进行传递
3. **整个类模板化**：将这个对象类型模板化进行传递

**示例：**

```cpp
#include <string>
//类模板
template<class NameType, class AgeType = int> 
class Person
{
public:
	Person(NameType name, AgeType age)
	{
		this->mName = name;
		this->mAge = age;
	}
	void showPerson()
	{
		cout << "name: " << this->mName << " age: " << this->mAge << endl;
	}
public:
	NameType mName;
	AgeType mAge;
};

//1、指定传入的类型
void printPerson1(Person<string, int> &p) 
{
	p.showPerson();
}
void test01()
{
	Person <string, int >p("孙悟空", 100);
	printPerson1(p);
}

//2、参数模板化
template <class T1, class T2>
void printPerson2(Person<T1, T2>&p)
{
	p.showPerson();
	cout << "T1的类型为： " << typeid(T1).name() << endl;
	cout << "T2的类型为： " << typeid(T2).name() << endl;
}
void test02()
{
	Person <string, int >p("猪八戒", 90);
	printPerson2(p);
}

//3、整个类模板化
template<class T>
void printPerson3(T & p)
{
	cout << "T的类型为： " << typeid(T).name() << endl;
	p.showPerson();

}
void test03()
{
	Person<string, int>p("唐僧", 30);
	printPerson3(p);
}
int main() {
	test01();
	test02();
	test03();
	return 0;
}
```

#### 类模板成员函数类外实现

```cpp
#include <string>
// 类模板中成员函数类外实现
template<class T1, class T2>
class Person {
public:
	// 构造函数类内声明
	Person(T1 name, T2 age);
	// 成员函数类内声明
	void showPerson();
public:
	T1 m_Name;
	T2 m_Age;
};

//构造函数 类外实现
template<class T1, class T2>
Person<T1, T2>::Person(T1 name, T2 age) {
	this->m_Name = name;
	this->m_Age = age;
}

//成员函数 类外实现
template<class T1, class T2>
void Person<T1, T2>::showPerson() {
	cout << "姓名: " << this->m_Name << " 年龄:" << this->m_Age << endl;
}

void test01()
{
	Person<string, int> p("Tom", 20);
	p.showPerson();
}
int main() {
	test01();
	return 0;
}
```

### 类模板与继承

当类模板碰到继承时，需要注意一下几点：

- 当子类继承的父类是一个类模板时，子类在声明的时候，要指定出父类中 T 的类型
- 如果不指定，编译器无法给子类分配内存
- 如果想灵活指定出父类中 T 的类型，子类也需变为类模板

**示例：**

```cpp
template<class T>
class Base
{
	T m;
};

//class Son:public Base  //错误，c++编译需要给子类分配内存，必须知道父类中T的类型才可以向下继承
class Son :public Base<int> //必须指定一个类型
{
};
void test01()
{
	Son c;
}

//类模板继承类模板 ,可以用T2指定父类中的T类型
template<class T1, class T2>
class Son2 :public Base<T2>
{
public:
	Son2()
	{
		cout << typeid(T1).name() << endl;
		cout << typeid(T2).name() << endl;
	}
};
void test02()
{
	Son2<int, char> child1;
}
int main() {
	test01();
	test02();
	return 0;
}
```

## C++11

### variadic templates （since C++11）可变模板参数

```
variadic templates即：**数量不定的模板参数**。它有如下特点：
```

- 该语法是 C++11 的新特性，它可以传入数量不定的模板参数，它把传入的参数分为：**一个**和**一包**。
- 如果你想确定这 " 一包 " 参数具体有多少个，可以用语法：`sizeof…(args)`。

**示例 1：一个可变参数模板类**

```cpp
template<typename... Types>
class Tuple {};

Tuple<int, double, std::string> some_instance; // 实例化一个包含三种类型的 Tuple

Tuple<> empty_instance; // 不包含任何类型的 Tuple
```

**示例 2：允许一个或多个参数的可变模板**

```cpp
template<typename T, typename... Types>
class Tuple {};

Tuple<int> single_instance; // 至少包含一个类型
```

**可变模板参数同样可以用于函数**，这不仅提供了一种类型安全的增强的变参函数（例如 printf），还允许函数使用类似 printf 的语法处理非平凡对象。
