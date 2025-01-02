---
date created: 2024-04-20 01:04
date updated: 2024-12-27 23:51
tags:
  - '#include'
  - '#include<iostream>'
dg-publish: true
---

# C++单例模式

- Singleton只允许被实例化一次，用于组织一系列全局的函数或者变量，与namespace很像。例子：随机数产生的类、渲染器类。
- **C++中的单例只是一种组织一堆全局变量和静态函数的方法**
- C++实现单例的基本方法：
  1. **将构造函数设为私有**，因为单例类不能有第二个实例
  2. 提供一个静态访问该类的方法：设一个**私有的静态的实例**，**并且在类外将其定义！** 然后用一个静态函数返回其引用or指针，便可正常使用了
  3. 为了安全，**标记拷贝构造函数为delete**（删除拷贝构造函数）

C++单例模板代码：

```cpp
#include "stdafx.h"
#include "SingleTon.h"


class SingleTon
{
	// SingleTon(const SingleTon&) = delete; // 删除拷贝构造函数
	SingleTon(const SingleTon&) = delete;  // 删除拷贝构造函数
	SingleTon& operator=(const SingleTon&) = delete; // 删除拷贝赋值运算符
public:
	static SingleTon& get()
	{
		return m_temp;
	}
	// 局部静态变量 instance 确保了只有一个 SingleTon 实例会被创建，
	// 并且仅在第一次调用 get 方法时进行初始化。这个实现无需在类外单独定义和初始化静态成员，并且它是线程安全的（在 C++11 模型中）。
	// 如果您的编译器和标准库实现支持 C++11，那么局部静态变量的初始化是线程安全的。
	//static SingleTon& get() {
	//	static SingleTon instance; // 局部静态变量，只初始化一次
	//	return instance;
	//}

	void Function()
	{
		std::cout << "SingleTon Function()" << std::endl;
	}
private:
	SingleTon() {};// 构造函数私有
	static SingleTon m_temp; // 类静态成员 m_temp 必须在类的外部定义和初始化
};
// 单例实例
SingleTon SingleTon::m_temp; // 如果使用静态成员变量的单例实现，不定义编译报错


void SingleTonTest::test_singleton()
{
	// 	SingleTon temp2 = SingleTon::get();       //会报错，因为无法复制了
	SingleTon& temp2 = SingleTon::get();
	// SingleTon::get().Function();  //这般使用便可
	temp2.Function();

}
// 测试：
int main() {
    //SingleTon temp2 = SingleTon::get();       //会报错，因为无法复制了
    SingleTon& temp2 = SingleTon::get();        //会报错，因为无法复制了
   // SingleTon::get().Function();  //这般使用便可
    temp2.Function();
}
```

示例 ：随机数类

```cpp
#include "stdafx.h"
class Random
{
public:
	Random(const Random&) = delete; // 删除拷贝构造函数
	Random& operator=(const Random&) = delete; // 删除拷贝赋值运算符
	static Random& get()
	{
		static Random instance;
		return instance;
	}
	static float getFloat()
	{
		// return m_random; // m_random是非静态成员
		return get().randomProxy();
	}

private:
	Random() {}
	float m_random = 0.5f;
	float randomProxy()
	{
		return m_random;
	}
};
// 与namespace很像
namespace RandomClass {
    static float s_RandomGenerator = 0.5f;
    static float Float() { return s_RandomGenerator; }
}
int main()
{
    float randomNum = Random::Float();
    std::cout<<randomNum<<std::endl;
    std::cin.get();
}
```

## 单例的各种实现

### 全局静态单例

```cpp
// Singleton.h头文件
/ 方式1：全局变量的方式实现单例模式
// 单例模式：确保一个类只有一个实例，并提供一个全局访问点
class Singleton
{
public:
    static Singleton &getInstance() // 获取实例的方法，是静态的，所以可以直接通过类名调用
    {
        return instance;
    }

private:
    Singleton() {}                                    // 默认构造函数是私有的，这意味着它不能从外部调用
    Singleton(const Singleton &) = delete;            // 删除拷贝构造函数，防止复制，这样就不会有两个实例了
    Singleton &operator=(const Singleton &) = delete; // 删除赋值构造函数，防止赋值，这样就不会有两个实例了
    Singleton(Singleton &&) = delete;                 // 删除移动构造函数，防止移动，这样就不会有两个实例了

    static Singleton instance; // 静态实例，这样就可以在外部访问了

    ~Singleton() // 析构函数是私有的，这意味着它不能从外部调用
    {
        std::cout << "~Singleton" << std::endl;
    }
};

// Singleton.cpp
#include "Singleton.h"
Singleton Singleton::instance; // 静态实例，这样就可以在外部访问了；不定义的话会报错：main.cpp:(.text+0x1c): undefined reference to `Singleton::instance'

// 测试：
void testSingleton1()
{
    const Singleton &s1 = Singleton::getInstance();

    // const Singleton &s2 = std::move(s1);

    Singleton &s2 = Singleton::getInstance();

    if (&s1 == &s2)
    {
        std::cout << "Singleton s1 and s2 are the same instance." << &s1 << ":" << &s2 << std::endl;
    }
    else
    {
        std::cout << "Singleton s1 and s2 are different instances." << std::endl;
    }
}
// 结果是相等
```

Singleton 类的 instance 是一个静态成员变量。静态成员变量的内存是分配在程序的全局/静态内存区域，而不是在堆或栈上。
全局/静态内存区通常用于存储全局变量、静态变量、常量字符串和其它在程序整个生命周期都存在的数据。

- 全局/静态内存区：在程序启动时分配，在程序结束时释放。`Singleton::instance` 的生命周期从程序开始到程序结束，这时会调用 Singleton 的析构函数。

### 延迟初始化，动态分配的静态实例

如果你想延迟初始化，可以在首次使用时创建实例，并在程序结束时销毁。

```cpp
// 头文件
class Singleton2
{
public:
    static Singleton2 &getInstance() // 获取实例的方法，是静态的，所以可以直接通过类名调用
    {
        if (instance == nullptr) // 如果实例为空，就创建一个实例
        {
            instance = new Singleton2(); // 创建实例，这里是动态分配的
            atexit(destroy);             // 注册销毁函数，确保程序结束时销毁实例
        }
        return *instance; // 返回实例，这里是引用，所以返回的是实例的引用
    }

private:
    Singleton2() {}                                     // 默认构造函数是私有的，这意味着它不能从外部调用
    Singleton2(const Singleton2 &) = delete;            // 删除拷贝构造函数，防止复制，这样就不会有两个实例了
    Singleton2 &operator=(const Singleton2 &) = delete; // 删除赋值构造函数，防止赋值，这样就不会有两个实例了
    Singleton2(Singleton2 &&) = delete; // 删除移动构造函数，防止移动，这样就不会有两个实例了

    static void destroy()
    {
        if (instance != nullptr)
        {
            delete instance;
            instance = nullptr;
        }
    }

    static Singleton2 *instance; // 静态实例，这样就可以在外部访问了

    ~Singleton2() // 析构函数是私有的，这意味着它不能从外部调用
    {
        std::cout << "~Singleton2" << std::endl;
        // if (instance != nullptr)
        // {
        //     delete instance;
        //     instance = nullptr;
        // }
    }
};

// cpp
Singleton2 *Singleton2::instance = nullptr; // 静态实例，这样就可以在外部访问了；不定义的话会报错：main.cpp:(.text+0x1c): undefined reference to `Singleton::instance2'

// 测试
void testSingleton2()
{
    Singleton2 &s1 = Singleton2::getInstance();
    Singleton2 &s2 = Singleton2::getInstance();
    if (&s1 == &s2)
    {
        std::cout << "Singleton2 s1 and s2 are the same instance." << &s1 << ":" << &s2 << std::endl;
    }
    else
    {
        std::cout << "Singleton2 s1 and s2 are different instances." << std::endl;
    }
}
// 结果是相等
```

- 相比之下，第二种实现方式中单例是使用 new 创建的，它的内存分配发生在堆上。
- 这需要手动管理内存，意味着你必须在程序中的某个时点使用 delete 来释放内存，或者在程序退出前通过 `atexit()` 注册的函数来释放内存。

### C++11 后的局部静态变量

#### 局部静态变量，分配在全局内存区

```cpp
// 头文件
class Singleton3
{
public:
    static Singleton3 &getInstance() // 获取实例的方法，是静态的，所以可以直接通过类名调用
    {
        static Singleton3 instance; // 局部静态变量，这样就可以确保线程安全
        return instance;
    }

private:
    Singleton3() {}                                     // 默认构造函数是私有的，这意味着它不能从外部调用
    Singleton3(const Singleton3 &) = delete;            // 删除拷贝构造函数，防止复制，这样就不会有两个实例了
    Singleton3 &operator=(const Singleton3 &) = delete; // 删除赋值构造函数，防止赋值，这样就不会有两个实例了
    Singleton3(Singleton3 &&) = delete; // 删除移动构造函数，防止移动，这样就不会有两个实例了

    ~Singleton3() // 析构函数是私有的，这意味着它不能从外部调用
    {
        std::cout << "~Singleton3" << std::endl;
    }
};
// cpp文件
// 不需要在外定义静态变量

// 测试
void testSingleton3()
{
    Singleton3 &s1 = Singleton3::getInstance();
    Singleton3 &s2 = Singleton3::getInstance();
    if (&s1 == &s2)
    {
        std::cout << "Singleton3 s1 and s2 are the same instance." << &s1 << ":" << &s2 << std::endl;
    }
    else
    {
        std::cout << "Singleton3 s1 and s2 are different instances." << std::endl;
    }
}
// 结果相等
```

- 这种方式是线程安全的，因为局部静态变量只会被初始化一次，即使在多线程环境下也是如此；这种方式是 C++11 之后的特性，之前的版本不支持，因为 C++11 之前的版本不保证局部静态变量的线程安全性。
- 利用局部静态变量的线程安全（并发安全）特性，这是因为 C++11 保证了局部静态变量在首次初始化时的线程安全性。
- 但是，这种方式有一个缺点，就是不能在程序结束时销毁实例，因为局部静态变量的生命周期是从第一次调用开始到程序结束。
- 为了解决这个问题，我们可以使用局部静态变量的线程安全单例模式的变种，即使用局部静态变量，但是使用智能指针来管理实例的生命周期。

#### 局部静态变量，分配在堆上

```cpp
// 头文件
#include <memory>
class Singleton3_1
{
public:
    static Singleton3_1 &getInstance()
    {
        static Singleton3_1 *instance = new Singleton3_1(); // 局部静态变量，这样就可以确保线程安全
        // 使用智能指针来管理实例的生命周期，这样就可以在程序结束时销毁实例；这里使用了 lambda 表达式，来自定义销毁函数
        static std::shared_ptr<Singleton3_1> s{
            instance, [](Singleton3_1 *p)
            {
                delete p;
            }};
        return *instance; // 返回实例，这里是引用，所以返回的是实例的引用
    }

private:
    Singleton3_1() {}                                       // 默认构造函数是私有的，这意味着它不能从外部调用
    Singleton3_1(const Singleton3_1 &) = delete;            // 删除拷贝构造函数，防止复制，这样就不会有两个实例了
    Singleton3_1 &operator=(const Singleton3_1 &) = delete; // 删除赋值构造函数，防止赋值，这样就不会有两个实例了
    Singleton3_1(Singleton3_1 &&) = delete; // 删除移动构造函数，防止移动，这样就不会有两个实例了

    ~Singleton3_1() // 析构函数是私有的，这意味着它不能从外部调用
    {
        std::cout << "~Singleton3_1" << std::endl;
    }
};
// cpp
// 无
// 测试
void testSingleton3_1()
{
    Singleton3_1 &s1 = Singleton3_1::getInstance();
    Singleton3_1 &s2 = Singleton3_1::getInstance();
    if (&s1 == &s2)
    {
        std::cout << "Singleton3_1 s1 and s2 are the same instance." << &s1 << ":" << &s2 << std::endl;
    }
    else
    {
        std::cout << "Singleton3_1 s1 and s2 are different instances." << std::endl;
    }
}
// 结果相等
```

在本例中，使用了智能指针`std::shared_ptr`来确保`Singleton`实例会被正确删除。C++11保证了静态局部变量（在函数内部的静态变量）的初始化是线程安全的，这样做即使用了这一特性，又避免了直接利用静态局部作用域。

### 局部静态变量，double check

```cpp
// 头文件
// 方式4: 使用局部静态变量的线程安全单例模式，使用局部静态变量，但是使用双检查锁定
#include <mutex>
class Singleton4
{
public:
    static Singleton4 &getInstance() // 获取实例的方法，是静态的，所以可以直接通过类名调用
    {
        if (instance == nullptr) // 如果实例为空，就创建一个实例
        {
            std::lock_guard<std::mutex> lock(mutex); // 加锁
            if (instance == nullptr)                 // 双检查锁定
            {
                instance = new Singleton4(); // 创建实例，这里是动态分配的
                atexit(destroy);             // 注册销毁函数，确保程序结束时销毁实例
            }
        }
        return *instance; // 返回实例，这里是引用，所以返回的是实例的引用
    }

private:
    Singleton4() {}                                     // 默认构造函数是私有的，这意味着它不能从外部调用
    Singleton4(const Singleton4 &) = delete;            // 删除拷贝构造函数，防止复制，这样就不会有两个实例了
    Singleton4 &operator=(const Singleton4 &) = delete; // 删除赋值构造函数，防止赋值，这样就不会有两个实例了
    // Singleton4(Singleton4 &&) = delete; // 删除移动构造函数，防止移动，这样就不会有两个实例了

    static void destroy()
    {
        if (instance != nullptr)
        {
            delete instance;
            instance = nullptr;
        }
    }

    static Singleton4 *instance; // 静态实例，这样就可以在外部访问了
    static std::mutex mutex;     // 互斥锁

    ~Singleton4() // 析构函数是私有的，这意味着它不能从外部调用
    {
        std::cout << "~Singleton4" << std::endl;
    }
};
// cpp
std::mutex Singleton4::mutex;               // 声声明互斥锁
Singleton4 *Singleton4::instance = nullptr; // 静态实例，这样就可以在外部访问了；不定义的话会报错：main.cpp:(.text+0x1c): undefined reference to `Singleton::instance'
// 测试
void testSingleton4()
{
    Singleton4 &s1 = Singleton4::getInstance();
    Singleton4 &s2 = Singleton4::getInstance();
    if (&s1 == &s2)
    {
        std::cout << "Singleton4 s1 and s2 are the same instance." << &s1 << ":" << &s2 << std::endl;
    }
    else
    {
        std::cout << "Singleton4 s1 and s2 are different instances." << std::endl;
    }
}
// 结果是相等的
```

这种方式，使用局部静态变量，但是使用双检查锁定，这样就可以确保线程安全了。
