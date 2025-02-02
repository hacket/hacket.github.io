---
date_created: Saturday, May 4th 2024, 1:36:11 pm
date_updated: Wednesday, January 22nd 2025, 11:53:23 pm
title: C++ Functions Object 函数对象
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
date created: 2024-05-04 14:01
date updated: 2024-12-27 23:51
aliases: [函数对象]
linter-yaml-title-alias: 函数对象
---

# 函数对象

## 函数对象/仿函数 `Functions Object或Functors`

**概念：**

- 重载 **函数调用操作符 ()** 的类，其对象常称为**函数对象**
- **函数对象**使用重载的 () 时，行为类似函数调用，也叫**仿函数**

**本质：**

函数对象 (仿函数) 是一个**类**，不是一个函数

**特点：**

- 函数对象在使用时，可以像普通函数那样调用, 可以有参数，可以有返回值
- 函数对象超出普通函数的概念，函数对象可以有自己的状态
- 函数对象可以作为参数传递

**示例:**

```cpp
// 1、函数对象，重载()操作符，仿函数，函数对象在使用时，可以像普通函数那样调用, 可以有参数，可以有返回值
class MyAdd
{
public:
    int operator()(int v1, int v2)
    {
        return v1 + v2;
    }
};
void FunctionsObjectDemo::test_functions_demo()
{
    // 函数对象
    MyAdd myAdd;
    // 函数对象在使用时，可以像普通函数那样调用，可以有参数，可以有返回值，函数对象超出普通函数的概念
    cout << myAdd(10, 20) << endl;

    // 匿名函数对象，匿名函数对象在使用时，只能使用一次；匿名函数对象一般用于传递临时函数对象；匿名函数对象一般用于参数传递
    cout << MyAdd()(100, 200) << endl;
}

// 2、函数对象可以有自己的状态
class MyPrint
{
public:
    int count; // 内部自己的状态
    MyPrint()
    {
        count = 0;
    }
    void operator()(string str)
    {
        cout << str << endl;
        count++; // 记录调用次数
    }
};
void FunctionsObjectDemo::test_functions_demo2()
{
    MyPrint myPrint;
    myPrint("hello world");
    myPrint("hello world");
    myPrint("hello world");
    cout << "myPrint call count=" << myPrint.count << endl;
}

// 3、函数对象可以作为参数传递
void doPrint(MyPrint &mp, std::string str)
{
    mp(str);
}
void FunctionsObjectDemo::test_functions_demo3()
{
    MyPrint myPrint;
    doPrint(myPrint, "hello c++");
}
```

## 谓词（`Predicates`）

### 谓词概念

**概念：**

- 返回 bool 类型的函数对象 (仿函数) 称为**谓词**
- 如果 operator() 接受一个参数，那么叫做一元谓词
- 如果 operator() 接受两个参数，那么叫做二元谓词
- 它们在算法中用作判断逻辑，比如在 `std::sort` 中作为比较函数，或者在 `std::find_if` 中作为条件判断。

### 一元谓词

参数只有一个的谓词，称为一元谓词

**示例：**

```cpp
// 1、一元谓词，返回bool类型，一个参数，常用于set容器的排序
struct GreaterFive
{
    bool operator()(int val)
    {
        // 返回值为true，表示val大于5
        return val > 5;
    }
};
void PredicatesDemo::test_predicates_demo()
{
    std::vector<int> v;
    for (int i = 0; i < 10; i++)
    {
        v.push_back(i);
    }

    // 查找大于5的元素
    std::vector<int>::iterator iterator = std::find_if(v.begin(), v.end(), GreaterFive());
    if (iterator != v.end())
    {
        cout << "look for > 5 :" << *iterator << endl; // look for > 5 :6
    }
    else
    {
        cout << "not found > 5." << endl; // not found > 5.
    }
}
```

### 二元谓词

参数只有两个的谓词，称为二元谓词

**示例：**

```cpp
// 2、二元谓词，返回bool类型，两个参数，常用于sort排序
struct MyCompare
{
    bool operator()(int v1, int v2)
    {
        return v1 > v2;
    }
};
void PredicatesDemo::test_predicates_demo2()
{
    std::vector<int> v;
    for (int i = 0; i < 10; i++)
    {
        v.push_back(i);
    }
    cout << "================================" << endl;
    // 默认从小到大排序
    std::sort(v.begin(), v.end());
    for (std::vector<int>::iterator it = v.begin(); it != v.end(); it++)
    {
        cout << *it << " "; // 0 1 2 3 4 5 6 7 8 9
    }
    cout << endl;
    cout << "================================" << endl;

    // 从大到小排序，使用二元谓词，返回bool类型，两个参数，常用于sort排序
    std::sort(v.begin(), v.end(), MyCompare());
    for (std::vector<int>::iterator it = v.begin(); it != v.end(); it++)
    {
        cout << *it << " "; // 9 8 7 6 5 4 3 2 1 0
    }
    cout << endl;
}
```

## 内建函数对象（Standard Function Objects）

C++ 标准库提供了一系列内置的函数对象，包括一些算术操作、逻辑操作和关系操作。这些函数对象可以在 `<functional>` 头文件中找到。

**分类:**

- 算术仿函数
- 关系仿函数
- 逻辑仿函数

**用法：**

- 这些仿函数所产生的对象，用法和一般函数完全相同
- 使用内建函数对象，需要引入头文件 `#include<functional>`

### 算术仿函数

**功能描述：**

- 实现四则运算
- 其中 `negate` 是一元运算，其他都是二元运算

**仿函数原型：**

- `template<class T> T plus<T>` //加法仿函数
- `template<class T> T minus<T>` //减法仿函数
- `template<class T> T multiplies<T>` //乘法仿函数
- `template<class T> T divides<T>` //除法仿函数
- `template<class T> T modulus<T>` //取模仿函数
- `template<class T> T negate<T>` //用于对其单个实参应用取反（负号）操作。

**示例：**

```cpp
// 算术仿函数
// plus<int> 加法
// minus<int> 减法
// multiplies<int> 乘法
// divides<int> 除法
// modulus<int> 取模
// negate<int> 取反(负号)

negate<int> n;
cout << n(50) << endl; // -50
plus<int> p;
cout << p(10, 20) << endl;
```

### 关系仿函数

**功能描述：**

- 实现关系对比

**仿函数原型：**

- `template<class T> bool equal_to<T>` //等于
- `template<class T> bool not_equal_to<T>` //不等于
- `template<class T> bool greater<T>` //大于
- `template<class T> bool greater_equal<T>` //大于等于
- `template<class T> bool less<T>` //小于
- `template<class T> bool less_equal<T>` //小于等于

**示例：**

```cpp
#include <algorithm>

class MyCompare
{
public:
	bool operator()(int v1,int v2)
	{
		return v1 > v2;
	}
};
void test01()
{
	vector<int> v;

	v.push_back(10);
	v.push_back(30);
	v.push_back(50);
	v.push_back(40);
	v.push_back(20);

	for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;

	//自己实现仿函数
	//sort(v.begin(), v.end(), MyCompare());
	//STL内建仿函数  大于仿函数
	sort(v.begin(), v.end(), greater<int>());

	for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;
}
```

**总结：** 关系仿函数中最常用的就是 `greater<>` 大于

### 逻辑仿函数

**功能描述：**

- 实现逻辑运算

**函数原型：**

- `template<class T> bool logical_and<T>` //逻辑与
- `template<class T> bool logical_or<T>` //逻辑或
- `template<class T> bool logical_not<T>` //逻辑非

**示例：**

```cpp
#include <vector>
#include <functional>
#include <algorithm>
void test01()
{
	vector<bool> v;
	v.push_back(true);
	v.push_back(false);
	v.push_back(true);
	v.push_back(false);

	for (vector<bool>::iterator it = v.begin();it!= v.end();it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	//逻辑非  将v容器搬运到v2中，并执行逻辑非运算
	vector<bool> v2;
	v2.resize(v.size());
	transform(v.begin(), v.end(),  v2.begin(), logical_not<bool>());
	for (vector<bool>::iterator it = v2.begin(); it != v2.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}
```

**总结：** 逻辑仿函数实际应用较少，了解即可
