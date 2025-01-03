---
date created: 2024-05-07 23:19
tags:
  - '#include'
date updated: 2024-12-27 23:51
dg-publish: true
---

# C++中的 `static`

### C++ class 和 struct 外的 static

**类外定义 static 变量：**
在类或结构体外部使用 static 关键字，**这意味着你定义的函数和变量只对它的声明所在的 cpp 文件（编译单元）是“可见”的**。此时 `static` 修饰的符号,（在 `link` 的时候）它只对定义它的翻译单元 (`.obj`)可见（`internal linkage`）。

**类外定义非 static 变量：**
如果不用 `static` 定义全局变量，在别的翻译单元可以用 `extern int a` 这样的形式，这被称为 `external linkage` 或 `external linking`。

### C++ class 和 struct 中的 static

类或结构体内部使用 static 关键字，此时表示这部分内存（static 变量）是这个类的所有实例共享的。即：该静态变量在类中创建的所有实例中，静态变量只有一个实例。**一个改变就改变所有。**；和 Java 的类似

- **静态方法**不能访问**非静态变量**，只能访问静态变量
- **静态方法没有类实例**
- **静态方法没有 this 指针**：类中的每个**非静态方法**都会获得当前的类实例作为参数 (this 指针)
- **静态成员必须在类外定义：** 静态成员变量在编译时存储在静态存储区，即**定义过程应该在编译时完成**，因此**一定要在类外进行定义**，但可以不初始化。 **静态成员变量是所有实例共享的**，但是其**只是在类中进行了声明，并未定义或初始化**（分配内存），类或者类实例就无法访问静态成员变量，这显然是不对的，**所以必须先在类外部定义**，也就是分配内存。
-

> 在几乎所有面向对象的语言里，static 在一个类中意味着特定的东西。如果是 static 变量，这意味着在类的所有实例中，这个变量只有一个实例。比如一个 entity 类，有很多个 entity 实例，若其中一个实例更改了这个 static 变量，它会在所有实例中反映这个变化。这是因为即使创建了很多实例，static 的变量仍然只有一个。正因如此，通过类实例来引用静态变量是没有意义的。因为这就像类的全局实例。
> 静态方法也是一样，无法访问类的实例。静态方法可以被调用，不需要通过类的实例。而在静态方法内部，你不能写引用到类实例的代码，因为你不能引用到类的实例。

```cpp
#include <iostream>
using namespace std;

struct Entity
{
    static int x;

    void print()
    {
        cout << x << endl;
    }
};
// 编译不会报错，但是链接会报错：source.obj : error LNK2001: unresolved external symbol "public: static int Entity::x"
int main()
{
    Entity e1;
    e1.x = 1;
    cin.get();
}

// 于是我们需要给出定义，让链接器可以链接到合适的变量
int Entity::x;

// 通过类实例访问
int main()
{
    Entity e1;
    e1.x = 1;
    cin.get();
}
// 通过类访问
int main()
{
    Entity e1;
    Entity::x = 1;

    Entity e2;
    Entity::x= 2;

    e1.print();
    e2.print();

    cin.get();
}
```

### C++ Local static（C++11）

**Local static 定义:** 一个函数中 static 的东西，只有当该静态的东西被调用的时候，它才会被创建，且离开该函数作用域后它依然存在。

- 函数中的 static 变量，生命周期是整个程序的生命周期
- 作用域被限制在了函数内

**示例：**

```cpp
#include <iostream>

void Function（）
{   //这句的意思是当我第一次调用这个函数时它的值被初始化为0,后续调用不会再创建一个新的变量
 static int i = 0；
 i++；  //如果上一行没有static结果会是每次调用这个函数i的值被设为0，然后i自增1向控制台输出1
 std::cout << i << std::endl；
}

int main()
{
 Function();
 Function();
 Function();
 std::cin.get();
}
// 输出 1 2 3
```

这其实就如同在函数外声明一个全局变量：

```cpp
#include <iostream>
int i = 0；//声明一个全局变量
void Function（）
{ 
 i++； 
 std::cout << i << std::endl；
}

int main()
{
 Function();
 Function();
 Function(); //输出 1 2 3
 std::cin.get();
}
// 但是这种问题是：可以在任何地方访问到变量 i
int main()
{
 Function();
 i = 10;     // 可以在函数之间改变i的值
 Function();
 Function(); //输出 1 11 12
 std::cin.get();
}
```

因此，如果想达到这种效果，但又不想让其他人访问到该变量，就可以 `Local Static`；

另一个例子：有一个单例的类（即: 这个类只有一个实例存在）
如果我想不使用静态局部作用域（local static scope）来创建一个单例类，我得创建某种静态的单例实例
如果我用静态局部作用域（local static scope）：通过 static 静态，将生存期延长到永远。这意味着，我们第一次调用 get 的时候，它实际上会构造一个单例实例，在接下来的时间它只会返回这个已经存在的实例。
具体可见：[[C++单例#C++11 后的局部静态变量]]

# 有用的函数

## **conversion function 转换函数**

**定义：**
在 C++ 中，转换函数（conversion function）是一种特殊类型的成员函数，它可以被定义在类内部以允许对象被隐式或显式地转换为另一种类型。转换函数必须是成员函数，不能指定返回类型，且不能有参数。

**格式：**`operator double() const {...}` (以转换成 double 类型为例)

**特点：**

- 一定要有关键字 `operator`，且目标类型不能带参数
- 大多数情况下都要加 `const` 属性
- 只要你认为合理，你可以在类中写多个转换函数，将 class 类型转换成多个其他类型。

**示例：转成 double**

```cpp
// 头文件 conversion_function.h
class Fraction
{
public:
    // Fraction(int numerator = 0, int denominator = 1) : m_numerator(numerator), m_denominator(denominator){};
    Fraction(int numerator = 0, int denominator = 1); // : m_numerator(numerator), m_denominator(denominator){};
    // 重写 double 类型转换运算符
    operator double() const;

private:
    int m_numerator;   // Numerator
    int m_denominator; // Denominator
};

// cpp文件
#include "conversion_function.h"
#include <iostream>
Fraction::Fraction(int numerator, int denominator) : m_numerator(numerator), m_denominator(denominator)
{
}

// 重写 double 类型转换运算符
Fraction::operator double() const
{
    return (double)(m_numerator) / (double)m_denominator;
}
// 测试
int main()
{
    Fraction f1(2, 5);
    Fraction f2(4, 8);
    double f2d = f2; // 调用operator double()转换为0.5
    double d = 4 + f2; 
    std::cout << f2d << '\n'; // 0.5
    std::cout << d << '\n';   // 4.5
    return 0;
}
```
