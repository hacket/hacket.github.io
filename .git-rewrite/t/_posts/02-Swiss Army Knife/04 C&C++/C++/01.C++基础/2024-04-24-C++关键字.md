---
date created: 2024-04-24 21:38
date updated: 2024-12-27 23:51
tags:
  - '#ifdef'
  - '#endif'
  - '#include'
dg-publish: true
---

# 常见关键字

关键字是 C++中预先保留的单词（标识符），**在定义变量或者常量时候，不要用关键字**

| asm        | do           | if               | return      | typedef  |
| ---------- | ------------ | ---------------- | ----------- | -------- |
| auto       | double       | inline           | short       | typeid   |
| bool       | dynamic_cast | int              | signed      | typename |
| break      | else         | long             | sizeof      | union    |
| case       | enum         | mutable          | static      | unsigned |
| catch      | explicit     | namespace        | static_cast | using    |
| char       | export       | new              | struct      | virtual  |
| class      | extern       | operator         | switch      | void     |
| const      | false        | private          | template    | volatile |
| const_cast | float        | protected        | this        | wchar_t  |
| continue   | for          | public           | throw       | while    |
| default    | friend       | register         | true        |          |
| delete     | goto         | reinterpret_cast | try         |          |

## extern

### extern 作用

`extern` 关键字在 C 和 C++ 中用于指定变量或函数的声明，告知编译器该名称是在其他地方定义的。使用 `extern`，你可以在一个文件中访问另一个文件中定义的全局变量或函数。

当你使用 `extern` 声明一个变量或函数时，你并没有创建它的实例，你只是告诉编译器这个变量或函数的定义存在于程序的其他部分，避免了链接错误。

以下是使用 extern 关键字的一些常见场景：

### 多文件项目中共享全局变量

假设有一个全局变量 `int counter` 在 `file1.c`中定义。你想在 `file2.c` 中访问它，就可以在 `file2.c` 或其头文件中用 `extern` 声明这个全局变量：

```cpp
// file1.c
int counter; // 定义全局变量

// file2.c 或 file2.h:
extern int counter; // 声明全局变量
```

### 多文件项目中声明函数

函数默认具有外部链接，因此通常不需要显式用 extern 声明。然而，对于 C++ 中的函数，如果要在 C 代码中调用，通常会结合 `extern "C"` 使用，以防止 C++ 的名称重整（name mangling）。

```cpp
// file1.cpp
void foo(); // C++ 编译器自动处理为外部链接
   
// file2.c:
extern "C" {
   void foo(); // 防止名称重整，以便按照 C 语言方式链接
}
// 这里的 extern "C" 告诉 C++ 编译器按照 C 语言的方式处理链接性，从而确保函数名在链接时不会被更改（即没有名称重整）。这样，你可以在 C++ 项目中链接并使用由 C 语言编写的代码库。
```

**什么是函数外部链接性？**

- 函数的外部链接性：指它可以被程序的其他文件所看见，即你可以在一个文件中定义该函数，然后在其他文件中声明并调用它
- 默认情况下，所有在文件作用域（非局部作用域）声明且未使用 static 关键字的函数都具有外部链接
- 如果使用 static 修饰的函数，函数就具备了内部链接 (`internal linkage`)，即该函数只能在其定义所在的文件中可见和可调用，对其他文件则是隐藏的

**C++名称重整？**

C++ 的名称重整（name mangling）是一个在编译过程中发生的转换，它将函数和变量的名字转换成包含更多信息的新名字。这样做是为了支持 C++ 复杂的特性，如函数重载、命名空间、模板、类和操作符重载。

由于 C++ 允许函数重载，即可以在相同的作用域中声明多个具有相同名字但参数列表不同的函数，编译器需要一种方法来区分这些具有相同名字的不同函数。名称重整就是这样一种方法，它为每个函数生成一个独一无二的名字，通常包含了函数的原始名字、参数类型、作用域（比如类名）等信息。

不同编译期重整方式不一样。

在与 C 语言交互时或者需要跨编译器链接二进制代码时，需要使用 `extern C` 来关闭重整，让编译期按 C 语言规则来处理函数，使得函数符号不经过名称重整处理。

### C++和 C 兼容

C 的大部分代码可以在 C++中直接使用，但是仍然有需要注意的地方

函数符号兼容，使用 `extern`

```c
// 如果需要在C++中调用C实现的库中的方法
extern "C" // 指示编译器这部分代码使用C的方式进行编译而不是C++
```

> 众所周知, C 是面向过程的语言，没有函数重载。

```c
void func(int x, int y);
```

对于 `func` 函数被 C 的编译器编译后在函数库中的名字可能为 `func` (无参数符号), 而 C++编译器则会产生类似 `funcii` 之类的名字。

```c
//main.c / main.cpp
int func(int x,int y){}
int main(){return 0;}
```

```shell
gcc main.c -o mainc.o
gcc main.cpp -o maincpp.o

nm -A mainc.o 
nm -A maincpp.o
```

![|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1687537559788-5392355c-21cf-4f4a-919e-c9a697b00aaa.png#averageHue=%23130e0a&clientId=u301ea645-2a2a-4&from=paste&id=u68b01fcb&originHeight=574&originWidth=501&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9f404ec9-74f7-4425-8acf-cd276b2aaa8&title=) ![|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1687537569327-a24813bf-aee8-469a-bfdc-9ee5903670fe.png#averageHue=%23130e0a&clientId=u301ea645-2a2a-4&from=paste&id=ueaeeb884&originHeight=567&originWidth=537&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1beffc4f-7d01-4ac1-8ee3-8a783b65c52&title=)

那么这样导致的问题就在于： c 的 `.h` 头文件中定义了 `func` 函数，则. C 源文件中实现这个函数符号都是 `func`, 然后拿到 C++中使用，. H 文件中的对应函数符号就被编译成另一种，和库中的符号不匹配，这样就无法正确调用到库中的实现。

因此，对于 C 库可以:

```c
#ifdef __cplusplus
extern "C" {
#endif
void func(int x,int y);
#ifdef __cplusplus    
}
#endif

//__cplusplus 是由C++编译器定义的宏，用于表示当前处于C++环境
```

> Extern 关键字可用于变量或者函数之前，表示真实定义在其他文件，编译器遇到此关键字就会去其他模块查找

# C++中的 `const` 和 `mutable`

## C++中的 const

### 什么是 const？

在 C++ 中，`const` 是一种类型修饰符，它用于指定一个对象是只读的。使用 `const` 可以定义常量，也可以保证函数不会修改其接收的参数。由于 `const` 修饰的是类型，当它与指针、引用、复合数据类型结合时，会表现出复杂的行为，并对类型检查产生影响。

### const 是常量吗？

- **const 首先作用于左边的东西；如果左边没东西，就作用于右边的东西**
- const 被 `cherno` 称为伪关键字，因为它在改变生成代码方面做不了什么。
- Const 是一个承诺，承诺一些东西是不变的，你是否遵守诺言取决于你自己。我们要保持 const 是因为这个承诺实际上可以简化很多代码。
- 绕开 const 的方法：强制转换

```cpp
void ConstDemo::testConst() {
	// a constant integer
	const int MAX_AGE = 90;
	std::cout << "MAX_AGE=" << MAX_AGE << std::endl;
	
	// a pointer to a constant integer
	int* a = new int;
	*a = 2;
	std::cout << "*a=" << *a << std::endl;
	
	// a = &MAX_AGE; //error!  无法从 const int* 转换到 int*
	// 将const int*转换为int*，这样做是不安全的
	a = (int*)&MAX_AGE; //ok 但是不建议这样做
}
```

const 不能称为常量，只能算是可读变量，还是可以修改的

### const 修饰不同数据类型

#### const 修饰普通变量

```cpp
const int myConst = 10; // 可读变量，其值不能被改变；其实是可以被改变的
int nonConst = 5;       // 普通变量，其值可以改变
```

#### 常量引用

对常量的引用，这意味着通过这个引用不能修改它绑定的对象。

```cpp
  const int& refToConst = myConst;
  // refToConst = 20; // 错误！不能修改常量引用绑定的对象。
```

#### const 与指针

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405092340940.png)

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405092340401.png)

```cpp
void ConstDemo::testConst() {
	// a constant integer
	const int MAX_AGE = 90;
	
	int* a = new int;
	*a = 2;
	
	// a = &MAX_AGE; //error!  无法从 const int* 转换到 int*
	// 将const int*转换为int*，这样做是不安全的
	a = (int*)&MAX_AGE; //ok 但是不建议这样做
}
```

上述代码我们可以做两件事情，一可以**改变这个指针的内容**，就是指针指向的内存内容；二可以**改变指针指向的内存地址**。

##### 常量指针 `int* const`

**定义：** 常量指针（`const pointer`），这种指针本身是一个常量，一旦被初始化就不能指向另一个地址，但它指向的内容可以被修改（如果它不是指向常量的）。

- `const` 在 `*` 右边：`int* const` 或 `int *const`，**可以改变指针指向的内容, 不能再去修改指针指向的地址**
- 助记：`int* const`，const 在 `int*` 后面，说明这是一个常量指针，不能改变指向地址，可以改变指向地址中的内容

**示例：**

```cpp
const int MAX_AGE = 90;
int* const a1 = new int; // 常量指针：指向的内容可以修改，但是指针本身不能修改
*a1 = 52; // ok，修改指向的内容可以
//a1 = (int*)&MAX_AGE;  // error，内容可以修改，指针本身不能修改
std::cout << "*a1=" << *a1 << std::endl; // 52

// 或者
int *const a1 = new int;
*a1 = 2; //ok
a1 = (int*)&MAX_AGE;  //error
```

##### 指针常量 `const int*`

**定义：**
指向常量的指针（`pointer to const`）: 这种指针指向一个常量对象，防止使用这个指针来改变该对象。

- `const` 在 `*` 左边：`const int*`：**可以改变指针指向的地址, 不能再去修改指针指向的内容了**
- const 在 `int*` 左边，

**示例：**

```cpp
const int MAX_AGE = 90;
const int* a2 = new int; // 指针常量：指针指向的内容不能修改，但是指针本身可以修改
std::cout << "*a2=" << *a2 << std::endl; // 未知数，还未初始化
//*a2 = 2; //error! 不能再去修改指针指向的内容了。
a2 = (int*)&MAX_AGE;  //可以改变指针指向的地址
std::cout << "*a2=" << *a2 << std::endl; // 90
```

##### 指针常量、常量指针 `const int* const`

- `const` 在 `*` 左和右边都有：**既不可以改变指针指向的内容, 也不能再去修改指针指向的地址**

```cpp
const int* const a3 = new int;
// *a3 = 2; //error! 不能再去修改指针指向的内容了。
//a3 = (int*)&MAX_AGE;  //error! 不能再去修改指针指向的地址了。
```

**助记 1：** 看 const 右侧紧跟着的是指针还是常量, 是指针就是常量指针，是常量就是指针常量
**助记 2：**

```cpp
const int *p1;
int *const p2;
// 怎么区分这2种，得看解指针的值，
// p1，解指针出来的是，const int ，表示指针指向值是const的不修改可以，但可以改变指针的指向；所以称为常量指针
p1 = nullptr; // ok
*p1 = 5; // error

// p2，解指针出来的是int，表示指针指向的值是int的，可以修改，但指针的指向不能修改；所以称为指针常量
p2 = nullptr; // error
*p2 = 5; // ok
```

> 可参考：【5 分钟讲透 C++const-哔哩哔哩】 <https://b23.tv/clxzKhs>

#### 在类和方法中的 const

用在方法名的后面 (**只有类才有这样的写法** )，这意味这这个方法不会修改任何实际的类的成员，不改变对象的状态

```cpp
class Entity
{
private:
    int m_x,m_y;
public:
    int Getx() const  //const的第三种用法，他和变量没有关系，而是用在方法名的后面
    {
        return m_x; //不能修改类的成员变量
        //m_x = 2; //ERROR!
    }
    void Setx(int a)
    {
        m_x = a; //ok
    }
};

void PrintEntity(const Entity& e)  //const Entity调用const函数
{
    std::cout << e.Getx() << std::endl;
}

int main()
{
    Entity e;
}
```

然后有时我们就会写两个 Getx 版本，一个有 const 一个没有，然后上面面这个传 `const Enity&` 的方法就会调用 `const` 的 GetX 版本。、

所以，我们把成员方法标记为 const 是因为**如果我们真的有一些 const Entity 对象，我们可以调用 const 方法**。如果没有 const 方法，那 `const Entity&` 对象就调用不了该方法。

- 如果实际上没有修改类或者它们不应该修改类，**总是**标记你的方法为 const，否则在有常量引用或类似的情况下就用不了你的方法。
- 在**const 函数中**，如果要修改别的变量，可以用**关键字 mutable**：

```cpp
// 把类成员标记为mutable，意味着类中的const方法可以修改这个成员。
class Entity
  {
  private:
      int m_x,m_y;
      mutable var;
  public:
      int Getx() const 
      {   
          var = 2; //ok mutable var
          return m_x; //不能修改类的成员变量
          // m_x = 2; //ERROR!
      }
  };
```

### const 小结

- 常量对象不可以调用非常量成员函数
- **const 也是函数签名的一部分，可构成函数重载**
- 当成员函数的 const 和 non-const 版本同时存在，const 对象只能调用 const 版本的成员函数，non-const 对象只能调用 non-const 版本的成员函数
- `non-const` 成员函数可以调用 const 成员函数，反之不行

## C++ `mutable` 关键字

mutable 有两种不同的用途：

1. 与 const 一起用
2. Lambda 表达式，很少用
3. 或者同时包含这两种情况

```cpp
//引用传递，没什么问题
#include <iostream>
int main()
{
    int x = 8;  
    auto f = [&]()
    {
        x++;  //如果是值传递，则会报错。
        std::cout << y << std::endl;
    };
    f();
}
// -----------------------------------------------
//值传递的正确做法
#include <iostream>
int main()
{
    int x = 8;
    auto f = [=]()
    {
        int y = x;  //有些臃肿
        y++;
        std::cout << y << std::endl;
    };
    f();
}
```

添加 `mutable` 关键字, 会干净许多（但本质是一样的）

```cpp
#include <iostream>
int main()
{
    int x = 8;
    auto f = [=]() mutable
    {
        x++;
        std::cout << x << std::endl;
    };
    f();
}
```

## constexpr

Constant expression 常量表达式，期望在编译期常量处理，成为运行时常量

`constexpr` 是 C++11 中引入的一个关键字，它用于声明可以在编译时求值的常量表达式。与 const 不同，constexpr 可以保证其修饰的变量或函数在编译时就会被求值，这样可以提高程序的性能，因为避免了运行时的计算，并且可以在需要编译时常量表达式的上下文中使用，比如数组大小、整数模板参数等。

以下是一些 `constexpr` 的使用例子：

- 定义编译时常量：

```cpp
constexpr int my_const = 3 + 2; // 编译时常量
```

- 定义编译时常量表达式函数：

```cpp
constexpr int add(int a, int b) {
    return a + b;
}

constexpr int sum = add(5, 10); // 使用constexpr函数计算编译时常量
```

- 在模板和数组大小中使用：

```cpp
template<int size>
class Array {
   int data[size]; // 编译时已知数组大小
};

constexpr int size = 10;
Array<size> myArray; // 使用constexpr作为数组或模板参数
```

使用 `constexpr` 时需要确保表达式包含的操作都是编译时可以确定的。因此，你不能在 constexpr 函数内部有未知的分支、循环或其他只能在运行时确定的操作。随着 `C++14` 和 `C++17` 的发布，constexpr 的功能得到了扩展，允许其完成更复杂的计算，包括局部变量、循环和条件分支等。
