---
date created: 2024-04-22 08:29
date updated: 2024-12-27 23:51
tags:
  - '#include'
dg-publish: true
---

# C++ 左值、右值和右值引用

在 C++ 中，左值（`lvalue`）、右值（`rvalue`）和右值引用（`rvalue reference`）是与对象存储、对象身份及其可移动性相关的三个概念。

## Lvalue

左值是表达式的结果，它指向一个明确的内存位置，可能是变量、数组的一个元素或者一个对象的引用。左值的特点是它们可以持续存在超出单个表达式的生命周期。你可以将左值看作是一个可以被赋值的实体。例如，在表达式 `int a = 1`; 中，**a** 就是一个左值。

左值特点：

- 有明确的内存地址
- 可以出现在赋值运算符左边或右边

### Lvalue Reference

## Rvalue

右值是不占据明确指定内存位置的表达式的结果，它们是临时的、不可寻址的值。这些值通常出现在表达式的右边（例如字面量或返回临时对象的表达式）。右值不具有持久性，一旦它们的表达式结束，它们就可能消失。例如，在表达式 `int b = a + 2;` 中，**a + 2** 就是一个右值。

右值特点：

- 临时变量
- 无内存地址

### Rvalue reference

右值引用是 C++11 中引入的，它允许你引用一个右值从而进行优化操作，如移动语义（move semantics）**和完美转发（perfect forwarding）**。
右值引用使用两个连续的和 `&` 符号标识，例如 `int &&c`。不同于常规引用（左值引用），右值引用可以绑定到将要被销毁的对象上，并从中“移动”它的数据。
一种常见用途是在**移动构造函数**中使用它们，来避免复制数据，从而实现更有效率的代码。一个使用右值引用的例子是 `std:: move`，它可以将左值转换为右值引用，使对象的资源可以被移动而非复制。

右值引用特点：

- 右值引用不能绑定到左值，可以通过常引用或者右值引用延长右值的生命周期，`有名字的右值引用是左值`

示例：

```cpp
#include <iostream>

void PrintName(std::string name)
{ // 这里的name是一个值传递，不能修改name，可以传入右值；也可以传入左值
    name += " Hazel";
    std::cout << name << std::endl;
}

void PrintName1(std::string &name)
{ // 只可以传入左值，左值可以被修改，这里的name是一个左值引用，可以修改name，不能传入右值
    std::cout << name << std::endl;
}

void PrintName2(const std::string &name)
{ // 这里的name是一个const左值引用，不能修改name，但是可以传入右值；也可以传入左值，因为左值是一个变量，可以被修改，所以可以传入；把右值当做const lvalue&传入
    std::cout << name << std::endl;
}
void PrintName3(std::string &&name)
{ // 这里的name是一个右值引用，可以修改name，但是不能传入左值；但是可以传入右值，因为右值是一个临时变量，不能被修改，所以可以传入
    std::cout << name << std::endl;
}

int main(int argc, char const *argv[])
{
    std::string first_name = "Cherno";
    std::string last_name = "Hazel";
    std::string full_name = first_name + last_name;

    PrintName(first_name); // ok，传入左值
    PrintName(last_name);  // ok，传入左值
    PrintName(full_name);  // ok，传入左值
    PrintName("hacket");   // ok，传入右值

    PrintName1(first_name); // ok，传入左值
    // PrintName1("hacket"); // error, 不能传入右值

    PrintName2(first_name); // ok，传入左值
    PrintName2("hacket"); // ok，传入右值

    // PrintName3(first_name); // an rvalue reference cannot be bound to an lvalue
    PrintName3("hacket"); 

    return 0;
}
```

### 从 Lvalue 和 Rvalue 看C++ 对象的性质

左值（Lvalue）和右值（Rvalue）的概念帮助开发者理解了 C++ 对象的以下性质：

1. **对象的存储时长（`Storage Duration`）**：
   - 左值通常对应于具有持久存储时长的对象，其在内存中有明确的、可识别的地址，可以在程序执行过程中多次访问。
   - 右值通常对应于临时对象，它们在表达式求值后就不再存在，因此它们的存储时长非常短暂。
2. **对象的可寻址性（`Addressability`）**：
   - 左值可以被取地址操作符 (`&`) 应用，从而获取它们的内存地址。
   - 右值不能直接被取地址，因为它们不是持久存储的对象。
3. **对象的可移动性（`Move Semantics`）**：
   - 右值概念允许 C++ 通过右值引用支持移动语义。由于右值不需要在表达式之外持久存在，这使得它们成为资源转移（例如，从一个对象“移动”数据到另一个对象）的理想候选。
4. **对象的可修改性（`Mutability`）**：
   - 左值引用可以是可修改的（如果它们不是常量），允许改变左值的状态。
   - 右值表达的对象通常是只读的，除非它们被绑定到右值引用上，在这种情况下，它们可以被修改。
5. **对象的生命周期（`Lifespan`）**：
   - 左值引用延长了对象的生命周期，因为它们继续引用并保持对象的活动状态。
   - 右值通常表示的是临时数据，它们在创建后不久（即表达式结束后）就会被销毁。

# C++移动语义

## 移动语义概念

在 C++ 中，移动语义（`Move Semantics`）是 C++11 引入的一个特性，旨在优化资源管理并提高性能。其核心概念是允许资源（如动态分配的内存、文件句柄等）从一个对象转移（或“移动”）到另一个对象，而不是传统的复制操作。
之前的 C++ 版本在对象赋值或返回值传递时，通常涉及到深拷贝，这会导致额外的资源和性能开销。移动语义则提供了一种方法，使得对象能将其资源直接“移动”到另一个对象中，避免不必要的资源复制。

## 拷贝构造函数(`const String&`)和移动构造函数(`const String&&`)

### 不使用移动构造函数

```cpp
#include <iostream>
#include <cstdint>
#include <string.h>

class String
{
private:
    char *m_Buffer;
    uint32_t m_Size;

public:
    String() = default; // default constructor
    String(const char *string)
    { // constructor, create a string, copy the string to the buffer
        std::cout << "Create String" << std::endl;
        m_Size = strlen(string);
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, string, m_Size);
    }

    String(const String &other) // 拷贝构造函数
    { // copy constructor, copy the string to the buffer
        std::cout << "Copy String" << std::endl;
        m_Size = other.m_Size;
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, other.m_Buffer, m_Size);
    }
    ~String()
    { // destructor, delete the buffer
        std::cout << "Destroy String" << std::endl;
        delete[] m_Buffer;
    }
    void print()
    {
        std::cout << "print: ";
        for (uint32_t i = 0; i < m_Size; i++)
        {
            std::cout << m_Buffer[i] << ",";
        }
        std::cout << std::endl;
    }
};

class Entity
{
public:
    Entity(const String &name) : m_Name(name) {}
    void printName()
    {
        m_Name.print();
    }

private:
    String m_Name;
};

int main(int argc, char const *argv[])
{
    String str = String("Cherno");
    Entity entity(str);
    entity.printName();
    return 0;
}
```

输出：

```
Create String
Copy String
print: C,h,e,r,n,o,
Destroy String：48
Destroy String
```

> 先调用 String 的构造函数来创建一个字符串由实例对象str; 传递给 Entity 时，调用 String 的拷贝构造函数复制给 m_Name 变量

### 使用移动构造函数

```cpp
#include <iostream>
#include <cstdint>
#include <string.h>

class String2
{
private:
    char *m_Buffer;
    uint32_t m_Size;

public:
    String2() = default; // default constructor
    String2(const char *string)
    { // constructor, create a string, copy the string to the buffer
        std::cout << "Create String" << std::endl;
        m_Size = strlen(string);
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, string, m_Size);
    }

    String2(const String2 &other) // 拷贝构造函数
    {                             // copy constructor, copy the string to the buffer
        std::cout << "Copy String" << std::endl;
        m_Size = other.m_Size;
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, other.m_Buffer, m_Size);
    }
    String2(String2 &&other) noexcept
    { // 右值引用拷贝，相当于移动，就是把复制一次指针，原来的指针给nullptr
        std::cout << "Move String" << std::endl;
        // 让新对象的指针指向指定内存，然后将旧对象的指针移开
        // 所以这里做的其实是接管了原来旧的内存，而不是将这片内存复制粘贴！
        m_Size = other.m_Size;     // move the size
        m_Buffer = other.m_Buffer; // move the buffer
        // //这里便完成了数据的转移，将other里的数据偷走了，指向nullptr就不执行other的析构函数了
        other.m_Size = 0;         // set the size to 0
        other.m_Buffer = nullptr; // set the buffer to nullptr
    }
    ~String2()
    { // destructor, delete the buffer
        std::cout << "Destroy String：" << strlen(m_Buffer) << std::endl;
        delete[] m_Buffer;
    }
    void print()
    {
        std::cout << "print: ";
        for (uint32_t i = 0; i < m_Size; i++)
        {
            std::cout << m_Buffer[i] << ",";
        }
        std::cout << std::endl;
    }
};

class Entity
{
public:
    Entity(const String2 &name) : m_Name(name) {
        std::cout << "Copy Entity" << std::endl;
    }       // 这里会调用拷贝构造函数
    Entity(String2 &&name) : m_Name(std::move(name)) {
        std::cout << "Move Entity" << std::endl;
    } // 这里会调用右值引用拷贝
    void printName()
    {
        m_Name.print();
    }

private:
    String2 m_Name;
};

int main(int argc, char const *argv[])
{
    // 1、左值
    String2 str = String2("Cherno");
    Entity entity(str); // 这种不行，传递的是左值，会调用拷贝构造函数
    
    // 2、右值
    // Entity entity(String2("hacket"));
    // entity.printName();
    return 0;
}

```

1、输出结果

```
Create String
Copy String
Copy Entity
Destroy String：32
Destroy String：32
```

> 1、由于变量 str 是一个左值（它在之前被声明并且有一个名称），那么在创建 Entity 类的实例 entity 时，将会调用 Entity 的拷贝构造函数 (`Entity (const String 2 &name)`)。这会导致 `String2的拷贝构造函数` 被调用，以创建 entity 的 `m_Name` 成员变量的一个副本。多了复制 `String2` 对象给 Entity 的 m_Name 变量

2、输出结果

```
Create String
Move String
Move Entity
Destroy String：
```

> 2、代码会创建一个 `String2` 类型的临时对象，该对象是一个右值，因此 Entity 类的移动构造函数将会被调用，在这个过程中 `String2` 的移动构造函数也会被调用（如果已经定义）。这允许资源从临时 `String2` 对象“移动”到 Entity 实例 entity 的 m_Name 成员变量中，而非复制。不会有复制操作。

## `std::move`

### 什么是 `std::move`

在 C++11 中，`std::move` 是一个标准库函数模板，它可以将它的参数转换为一个右值引用。这使得程序员能够向函数表明一个对象可以安全地“移动”，而非复制。

右值引用是对临时对象的引用，临时对象通常在表达式结束后就会被销毁。通过 `std::move`，我们可以实现资源的转移，从而避免不必要的深拷贝，提高程序的性能。（临时对象一般是分配在栈上，作用域结束后随即销毁）

`std::move` 实际上并不移动任何东西，只是执行一个类型转换。它将左值转换为该左值对应类型的右值引用。这样，**移动构造函数**或**移动赋值运算符**就可以对该临时引用进行操作，将资源从源对象“移动”到目的对象中。

### 示例

示例 1：

```cpp
#include <iostream>
#include <cstdint>
#include <string.h>

class String3
{
private:
    uint32_t m_Size;
    char *m_Buffer;

public:
    String3() = default;
    // 拷贝构造函数: 从一个字符串创建一个新的字符串，const char*
    String3(const char *String3)
    {
        std::cout << "Create String3" << std::endl;
        m_Size = strlen(String3);
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, String3, m_Size);
    }
    // 拷贝构造函数: 从一个字符串创建一个新的字符串，const String引用
    String3(const String3 &other)
    {
        std::cout << "Copied String3" << std::endl;
        m_Size = other.m_Size;
        m_Buffer = new char[m_Size];
        memcpy(m_Buffer, other.m_Buffer, m_Size);
    }
    // 移动构造函数: 从一个字符串创建一个新的字符串，String&&
    String3(String3 &&other) noexcept
    {
        std::cout << "Moved String3" << std::endl;
        m_Size = other.m_Size;
        m_Buffer = other.m_Buffer;

        other.m_Size = 0;
        other.m_Buffer = nullptr;
    }
    //  赋值运算符重载
    String3 &operator=(String3 &other)
    {
        std::cout << "operator= String3" << std::endl;
        // 检查是否是自己，如果是自己，直接返回自己
        if (this != &other)
        {
            // 删除原来的buffer
            delete[] m_Buffer;

            // 复制新的buffer
            m_Size = other.m_Size;
            m_Buffer = other.m_Buffer;

            // 将原来的buffer指向nullptr
            other.m_Size = 0;
            other.m_Buffer = nullptr;
        }
        // 返回自己，这里是为了支持连续赋值
        return *this;
    }
	// 移动复制运算符重载
    String3 &operator=(String3 &&other)
    {
        std::cout << "RvalueReference operator= String3" << std::endl;
        // 检查是否是自己，如果是自己，直接返回自己
        if (this != &other)
        {
            // 删除原来的buffer
            delete[] m_Buffer;

            // 复制新的buffer
            m_Size = other.m_Size;
            m_Buffer = other.m_Buffer;

            // 将原来的buffer指向nullptr
            other.m_Size = 0;
            other.m_Buffer = nullptr;
        }
        // 返回自己，这里是为了支持连续赋值
        return *this;
    }

    // 析构函数: 删除字符串
    ~String3()
    {
        std::cout << "Destroy String3" << std::endl;
        delete[] m_Buffer;
    }
    void print()
    {
        for (uint32_t i = 0; i < m_Size; i++)
        {
            std::cout << m_Buffer[i] << ",";
        }
        std::cout << std::endl;
    }
};

class Entity3
{
public:
    Entity3(const String3 &name) : m_Name(name)
    {
        std::cout << "Copied Entity3" << std::endl;
    }
    Entity3(String3 &&name) : m_Name(std::move(name))
    {
        std::cout << "Move Entity3" << std::endl;
    } // 这里会调用右值引用拷贝
    void PrintName()
    {
        m_Name.print();
    };

private:
    String3 m_Name;
};

int main(int argc, char const *argv[])
{
    String3 apple = "apple";
    String3 orange = "orange";
    // apple = orange; // 赋值运算符重载测试
    // orange赋值给apple，调用operator= String3, 会调用赋值运算符重载
    // Create String3
    // Create String3
    // operator= String3

    apple = std::move(orange); // 移动赋值运算符
    // orange赋值给apple，调用RvalueReference operator= String3，不会调用赋值运算符重载，而是调用移动赋值运算
    // Create String3
    // Create String3
    // RvalueReference operator= String3 
 

    std::cout << "分割线-------------" << std::endl;
    // 1、左值
    // 调用拷贝构造函数
    // String3 str = String3("hacket");
    // Entity3 Entity3(str); // 这种不行，传递的是左值，会调用拷贝构造函数
    // Create String3
    // Copied String3
    // Copied Entity3

    String3 str = String3("hacket");
    Entity3 entity(std::move(str)); // 通过std::move()将左值转换为右值引用，减少拷贝次数
    // Create String3
    // Moved String3
    // Move Entity3


    std::cout << "分割线-------------" << std::endl;
    // 2、右值
    Entity3 entity3(String3("hacket")); // 调用的是Entity3的移动构造函数
    // Create String3
    // Moved String3
    // Move Entity3

    std::cin.get();
    return 0;
}

```

输出：

```
Create String3
Create String3
RvalueReference operator= String3
分割线-------------
Create String3
Moved String3
Move Entity3
分割线-------------
Create String3
Moved String3
Move Entity3
Destroy String3

Destroy String3
Destroy String3
Destroy String3
Destroy String3
Destroy String3
```

示例 2：

```cpp
#include <utility>  // for std::move

class Movable {
public:
    // 移动构造函数
    Movable(Movable&& other) noexcept {
        // 接管 other 的资源
    }

    // 移动赋值运算符
    Movable& operator=(Movable&& other) noexcept {
        if (this != &other) {
            // 释放当前资源，并接管 other 的资源
        }
        return *this;
    }
    // ...
};

void foo(Movable m);

int main() {
    Movable a;
    // 使用 std::move，告诉编译器我们希望移动 a 而不是复制 a
    foo(std::move(a));

    // 注意：在 std::move 之后，a 处于未定义状态，不能再使用
    return 0;
}

```

在这里，`std::move(a)` 返回 `Movable&&` 类型的右值引用，移动构造函数将被调用来构造 `foo()` 函数内的临时对象 m。这个过程不涉及深拷贝 a 的资源，而是将资源从 a 移动到 m，然后 a 的状态会变成未定义但有效的状态，这意味着它的析构函数将不会释放任何已经移动的资源。

使用 `std::move` 前，你需要确保源对象之后不会再被使用，或者源对象能够安全地销毁不会造成资源泄露或其它问题。

因此，`std::move` 是利用现代 C++ 中的移动语义来优化性能的重要工具，尤其对于大型对象以及那些涉及大量资源（如动态内存）的对象。

## 移动赋值操作符

"移动复制运算符"这一表达可能引起一些混淆，因为在 C++ 中通常所说的是"移动构造函数"（`Move Constructor`）和"移动赋值运算符"（`Move Assignment Operator`）。这两者都是利用移动语义来优化对象资源的管理。

**移动构造函数：**
移动构造函数是一种特殊的构造函数，它从另一个对象"移动"资源而非复制资源。它的参数是该类类型的一个右值引用。通常用 `std::move` 来标记一个对象为右值，从而触发移动构造函数。

```cpp
class MyClass {
public:
    MyClass(MyClass&& other) noexcept {
        // 移动 'other' 的资源到 'this' 实例中
    }
};
// 在这个例子里，原本 other 所拥有的资源（如动态分配的内存）现在被转移到了新创建的对象（*this）中，other 被置于一个不保留任何资源的状态，确保在 other 的生命周期结束时不会发生不应有的资源释放。
```

**移动赋值运算符：**
移动赋值运算符允许你将一个对象的资源"移动"到另一个已经存在的对象中。通常这意味着：

1. 释放接收对象当前持有的任何资源。
2. 从源对象移动资源到接收对象中。
3. 将源对象置于适合被析构的状态。

移动赋值运算符的典型用法：

```cpp
class MyClass {
public:
    MyClass& operator=(MyClass&& other) noexcept {
        if (this != &other) { // 自我赋值检查
            // 释放 'this' 当前资源
            // 将 'other' 的资源移动到 'this' 中
            // 置 'other' 为不持有任何资源的状态
        }
        return *this; // 返回对该对象的引用以支持链式调用
    }
};
// 首先检查自我赋值（一个对象赋值给自己）的情况。然后，我们移动 other 对象的资源并将 other 置于一个安全状态，使得 other 在其生命周期结束时不会释放已经“移动”出去的资源。
```

示例：移动赋值运算符演示

```cpp
#include <iostream>
#include <utility> // for std::move

class MoveAssignmentTest
{
private:
    int *data;
    std::string tag;

public:
    MoveAssignmentTest(int size, std::string name) : data(new int[size]), tag(name) { /* ... */ }

    // 移动构造函数，未处理tag的复制
    MoveAssignmentTest(MoveAssignmentTest &&other) noexcept : data(nullptr)
    {
        data = other.data;
        other.data = nullptr;
    }

    // 移动赋值运算符，未处理tag的移动
    MoveAssignmentTest &operator=(MoveAssignmentTest &&other) noexcept
    {
        if (this != &other)
        {
            std::cout << other.tag << " MoveAssignmentTest::operator=() to " << tag << std::endl;
            delete[] data;
            data = other.data;
            other.data = nullptr;
        }
        return *this;
    }

    ~MoveAssignmentTest()
    {
        std::cout << tag << " MoveAssignmentTest::~MoveAssignmentTest()" << std::endl;
        delete[] data; // 删除动态分配的数组
        // 'tag' 将在这一点后自动释放其内存资源 ，std::string的析构函数会自动释放内存，自己管理内存的话需要手动释放
    }

    void print() const
    {
        if (data)
        {
            std::cout << tag << " MoveAssignmentTest contains data." << std::endl;
        }
        else
        {
            std::cout << tag << " MoveAssignmentTest is empty." << std::endl;
        }
    }
};

int main()
{
    MoveAssignmentTest a(10, std::string("a"));
    MoveAssignmentTest b(20, std::string("b"));

    std::cout << "Before move assignment:" << std::endl;
    a.print();
    b.print();

    a = std::move(b);

    std::cout << "After move assignment:" << std::endl;
    a.print();
    b.print();

    return 0;
}
```

输出：

```
Before move assignment:
a MoveAssignmentTest contains data.
b MoveAssignmentTest contains data.
b MoveAssignmentTest::operator=() to a
After move assignment:
a MoveAssignmentTest contains data.
b MoveAssignmentTest is empty.
b MoveAssignmentTest::~MoveAssignmentTest()
a MoveAssignmentTest::~MoveAssignmentTest()
```
