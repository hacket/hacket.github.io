---
title: "[C++] std::function 是如何实现 lambda 递归的"
date: 2023-3-30 14:20:18 +0800
categories: [杂记, Cpp]
tags: [c++, 编程语言]     # TAG names should always be lowercase
---

我们都知道，C++ 是不允许 lambda 函数递归调用自己的，如果想要递归，最好的办法就是使用 `std::function`{:.language-cpp}：

```cpp
#include <functional>
#include <iostream>

int main() {
  std::function<unsigned(unsigned)> fact = [&fact](unsigned x) -> unsigned {
    return x <= 1 ? 1 : x * fact(x - 1);
  };
  std::cout << fact(10) << std::endl;

  return 0;
}
```
{: run="cpp" }

`std::function`{:.language-cpp} 究竟有什么魔力，可以让 lambda 进行递归？鲁迅说的好，**要想明白一个东西的原理，最好的办法就是从头实现一遍**。鲁迅：这是周树人说的，不是我说的。

让我们先简单分析一下，假设我们实现的类名为 `Closure`，那么我们需要知道 lambda 的**返回值类型**和**参数类型**，这样才能重载 `Closure` 的 `operator()`{:.language-cpp} 以调用 lambda 函数（注：为了保持参数的引用类型，后续所有代码都会使用 `std::forward`{:.language-cpp} 进行完美转发）：

```cpp
template <typename Ret, typename... Args>
class Closure {
 public:
  typedef Ret (*Func)(Args...);
  Closure(Func fp) : _fp(fp) {}

  Ret operator()(Args... args) const { return _fp(std::forward<Args>(args)...); }

 private:
  Func _fp;
};
```

当然，事情远没有那么简单，上述 `Closure` 类型虽然可以包装无捕捉的简单 lambda 函数，但是**无法包装有捕捉的 lambda 函数**，更别说递归：

```cpp
#include <iostream>

template <typename Ret, typename... Args>
class Closure {
 public:
  typedef Ret (*Func)(Args...);
  Closure(Func fp) : _fp(fp) {}

  Ret operator()(Args... args) const { return _fp(std::forward<Args>(args)...); }

 private:
  Func _fp;
};

int main() {
  // 可以包装无捕捉的 lambda 函数
  Closure<int, int> addOne = (Closure<int, int>::Func)[](int x) { return x + 1; };
  std::cout << addOne(10) << std::endl;

  // 但是不能包装有捕捉的 lambda 函数
  // int m = 12;
  // Closure<int, int> addm = (Closure<int, int>::Func)[m](int x) { return x + m; };
  // std::cout << addm(10) << std::endl;

  return 0;
}
```
{: run="cpp" }

不过我们先不着急，我们先处理两个小问题。

一是，我们使用 `Closure<int, int>`{:.language-cpp} 而不是 `Closure<int(int)>`{:.language-cpp} 声明类型，这个问题可以用**模板特化**来解决：

```cpp
#include <iostream>

template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 public:
  typedef Ret (*Func)(Args...);
  Closure(Func fp) : _fp(fp) {}

  Ret operator()(Args... args) const { return _fp(std::forward<Args>(args)...); }

 private:
  Func _fp;
};

int main() {
  Closure<int(int)> addOne = (Closure<int(int)>::Func)[](int x) { return x + 1; };
  std::cout << addOne(10) << std::endl;

  return 0;
}
```
{: run="cpp" }

二是，我们不得不将闭包进行**显式类型转换**，这是因为复制初始化（即使用等号初始化）对于隐式类型转换的要求比直接初始化（即使用括号初始化）更严格。既然不允许在这里隐式类型转换，那么我们可以换个思路，我们把构造函数改成**模板构造函数**，把强制类型转换放到构造函数中进行：

```cpp
#include <iostream>

template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 public:
  typedef Ret (*Func)(Args...);

  template<typename Lambda>
  Closure(Lambda&& fp) : _fp(std::forward<Lambda>(fp)) {}

  Ret operator()(Args... args) const { return _fp(std::forward<Args>(args)...); }

 private:
  Func _fp;
};

int main() {
  Closure<int(int)> addOne = [](int x) { return x + 1; };
  std::cout << addOne(10) << std::endl;

  return 0;
}
```
{: run="cpp" highlight-lines="13, 14" }

现在我们该来处理一下有捕捉的 lambda 函数的问题了。

我们知道，lambda 函数可以被视为一个匿名类，其成员变量就是被捕捉的环境变量或其引用，然后还重载了 `operator()`{:.language-cpp} 用来执行 lambda 函数的函数体。这就意味着，我们要有办法可以**保存一个可能是任意结构的匿名类型**。

注意直接将 lambda 函数的类型作为模板类型，然后使用该模板类型来声明一个成员变量是**不可行**的，因为 lambda 函数想要捕捉一个环境变量，这个环境变量的类型大小必须是已知的，如果 `Closure` 类型依赖 lambda 函数的类型，那么它就无法在 lambda 函数的函数体中被捕捉。

既然如此，我们还是只能储存 lambda 函数的指针，因为指针的大小是固定的。但是由于我们不知道该指针的具体类型，因此我们考虑使用 `void *`{:.language-cpp}。但是使用 `void *`{:.language-cpp} 意味着丢失了 lambda 函数的类型，我们还需要通过其他方法再拿回它的类型。

我们先把想到的东西先写下，一步一步走：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 public:
  template <typename Lambda>
  Closure(Lambda&& fp) {
    // 我们通过 new 把 lambda 函数转移到堆上，这样我们就不需要直接持有它
    _fp = new Lambda(std::forward<Lambda>(fp));
  }

  // 禁止拷贝构造
  Closure(const Closure&) = delete;

  // 允许移动构造
  Closure(Closure &&other) {
    _fp = other._fp;
    other._fp = nullptr;
  }

  Ret operator()(Args... args) const {
    // 我们不知道 lambda 的实际类型，因此这里暂时无法实现
  }

 private:
  void* _fp;
};
```

现在的关键是我们无法在 `operator()`{:.language-cpp} 中得到 lambda 函数的实际类型，该类型只有在构造函数中才知道。那么我们有什么办法可以不依赖 Lambda 类型但是却能储存一个包含了 Lambda 类型的类型呢？

答案是**模板特化**。具体来说，我们可以让一个函数接收一个 Lambda 模板类型，然后在函数体内使用 Lambda 模板类型，但是在它的入参和返回值上不使用 Lambda 模板类型。这样的话，我们可以不依赖 Lambda 模板类型来储存它特化的指针，具体来说：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  // 注意到该函数的类型是 Ret (*)(void*, Args...)，并不包含 Lambda 模板类型
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    // 在函数体内使用 Lambda 模板类型，而不是让函数的调用者提供
    return (*reinterpret_cast<Lambda*>(fp))(std::forward<Args>(args)...);
  }

 public:
  template <typename Lambda>
  Closure(Lambda&& fp) {
    _fp = new Lambda(std::forward<Lambda>(fp));
    // 我们通过储存 invoke 函数模板特化后的指针来间接储存 lambda 的类型
    _invoke = invoke<Lambda>;
  }
  Closure(const Closure&) = delete;
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
  }

  Ret operator()(Args... args) const {
    // 最终实际调用的是模板特化后的 invoke 函数
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  // _invoke 指针不依赖 lambda 函数的实际类型
  Ret (*_invoke)(void*, Args...);
};
```

当然，由于我们用到了 `new`{:.language-cpp} 来储存 lambda 函数，因此我们也需要一个合适的方法去 `delete`{:.language-cpp} 掉它。和 `invoke` 同理，我们可以实现一个 `free` 函数：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return (*reinterpret_cast<Lambda*>(fp))(std::forward<Args>(args)...);
  }
  template <typename Lambda>
  static void free(void* fp) {
    delete reinterpret_cast<Lambda*>(fp);
  }

 public:
  template <typename Lambda>
  Closure(Lambda&& fp) {
    _fp = new Lambda(std::forward<Lambda>(fp));
    _invoke = invoke<Lambda>;
    _free = free<Lambda>;
  }
  Closure(const Closure&) = delete;
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
    _free = other._free;
  }
  ~Closure() {
    // 最终实际调用的是模板特化后的 free 函数
    _free(_fp);
  }

  Ret operator()(Args... args) const {
    // 最终实际调用的是模板特化后的 invoke 函数
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  Ret (*_invoke)(void*, Args...);
  void (*_free)(void*);
};
```

不过有一个细节需要注意，我们的泛型类型 `Lambda` 有可能是引用类型（涉及到引用折叠的概念，有兴趣的话可以在[如何在 C++ 中实现柯里化]({{ base.url }}{% link _posts/2023-7-18-cpp_currying.md %})这篇文章中了解更多），而如果定义一个引用类型的指针就会出错。因此我们使用标准库中的 `std::remove_reference_t` 来获取它去掉引用之后的类型：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return (*reinterpret_cast<std::remove_reference_t<Lambda>*>(fp))(
        std::forward<Args>(args)...);
  }
  template <typename Lambda>
  static void free(void* fp) {
    delete reinterpret_cast<std::remove_reference_t<Lambda>*>(fp);
  }

 public:
  template <typename Lambda>
  Closure(Lambda&& fp) {
    _fp = new std::remove_reference_t<Lambda>(std::forward<Lambda>(fp));
    _invoke = invoke<Lambda>;
    _free = free<Lambda>;
  }
  Closure(const Closure& other) = delete;
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
    _free = other._free;
  }
  ~Closure() {
    _free(_fp);
  }

  Ret operator()(Args... args) const {
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  Ret (*_invoke)(void*, Args...);
  void (*_free)(void*);
};
```

然后，让我们来尝试恢复它的拷贝构造函数。原理也类似 `invoke` 和 `free`，我们要做一个模板特化的 `copy` 函数：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return (*reinterpret_cast<std::remove_reference_t<Lambda>*>(fp))(
        std::forward<Args>(args)...);
  }
  template <typename Lambda>
  static void free(void* fp) {
    delete reinterpret_cast<std::remove_reference_t<Lambda>*>(fp);
  }
  template <typename Lambda>
  static void* copy(void* fp) {
    return new std::remove_reference_t<Lambda>(
        *reinterpret_cast<std::remove_reference_t<Lambda>*>(fp));
  }

 public:
  template <typename Lambda>
  Closure(Lambda&& fp) {
    _fp = new std::remove_reference_t<Lambda>(std::forward<Lambda>(fp));
    _invoke = invoke<Lambda>;
    _free = free<Lambda>;
    _copy = copy<Lambda>;
  }
  Closure(const Closure& other) {
    _fp = other._copy(other._fp);
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  };
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  }
  ~Closure() {
    _free(_fp);
  }

  Ret operator()(Args... args) const {
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  Ret (*_invoke)(void*, Args...);
  void (*_free)(void*);
  void* (*_copy)(void*);
};
```
{: highlight-lines="18-22,33" }

但是，停，这里会出现一个很严重的问题。当我们让 `Closure s2 = s1`{:.language-cpp} 时，我们期望它会调用 `Closure(const Closure &)`{:.language-cpp} 这个拷贝构造函数，但实际上 C++ 却会选择 `Closure(Lambda &&fp)`{:.language-cpp} 这个构造函数。这是因为 `Lambda&&`{:.language-cpp} 是一个万能引用，它可以匹配 `Closure &`{:.language-cpp} 使得它比 `const Closure &`{:.language-cpp} 的重载更精确。

解决这个问题的方法通常是使用 **C++20 的 concept 语法**。但是这并不是说在 C++20 之前我们就无能为力了。由于 C++ 强大的模板推导能力，我们可以借助**模板元编程（Template Metaprogramming）**来解决这个问题，而标准库就专门为此实现了 **`std::enable_if`{:.language-cpp}**。关于模板元编程和 `std::enable_if`{:.language-cpp}，很难用三言两语来讲清楚它们究竟是什么，如果有兴趣，可以移步到[如何在 C++ 中实现柯里化]({{ base.url }}{% link _posts/2023-7-18-cpp_currying.md %})这篇文章。而在本文中，我们只需要知道它可以解决我们的问题就行了：

```cpp
template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return (*reinterpret_cast<std::remove_reference_t<Lambda>*>(fp))(
        std::forward<Args>(args)...);
  }
  template <typename Lambda>
  static void free(void* fp) {
    delete reinterpret_cast<std::remove_reference_t<Lambda>*>(fp);
  }
  template <typename Lambda>
  static void* copy(void* fp) {
    return new std::remove_reference_t<Lambda>(
        *reinterpret_cast<std::remove_reference_t<Lambda>*>(fp));
  }

 public:
  template <typename Lambda,
            std::enable_if_t<!std::is_same_v<std::remove_reference_t<Lambda>,
                                             Closure<Ret(Args...)>>,
                             bool> = true>
  Closure(Lambda&& fp) {
    _fp = new std::remove_reference_t<Lambda>(std::forward<Lambda>(fp));
    _invoke = invoke<Lambda>;
    _free = free<Lambda>;
    _copy = copy<Lambda>;
  }
  Closure(const Closure& other) {
    _fp = other._copy(other._fp);
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  };
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  }
  ~Closure() { _free(_fp); }

  Ret operator()(Args... args) const {
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  Ret (*_invoke)(void*, Args...);
  void (*_free)(void*);
  void* (*_copy)(void*);
};
```
{: highlight-lines="25-28" }

让我们来测试一下它能不能做到闭包递归：

```cpp
#include <iostream>

template <typename T>
class Closure {
  Closure() = delete;
};

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return (*reinterpret_cast<std::remove_reference_t<Lambda>*>(fp))(
        std::forward<Args>(args)...);
  }
  template <typename Lambda>
  static void free(void* fp) {
    delete reinterpret_cast<std::remove_reference_t<Lambda>*>(fp);
  }
  template <typename Lambda>
  static void* copy(void* fp) {
    return new std::remove_reference_t<Lambda>(
        *reinterpret_cast<std::remove_reference_t<Lambda>*>(fp));
  }

 public:
  template <typename Lambda,
            std::enable_if_t<!std::is_same_v<std::remove_reference_t<Lambda>,
                                             Closure<Ret(Args...)>>,
                             bool> = true>
  Closure(Lambda&& fp) {
    _fp = new std::remove_reference_t<Lambda>(std::forward<Lambda>(fp));
    _invoke = invoke<Lambda>;
    _free = free<Lambda>;
    _copy = copy<Lambda>;
  }
  Closure(const Closure& other) {
    _fp = other._copy(other._fp);
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  };
  Closure(Closure&& other) {
    _fp = other._fp;
    other._fp = nullptr;
    _invoke = other._invoke;
    _free = other._free;
    _copy = other._copy;
  }
  ~Closure() { _free(_fp); }

  Ret operator()(Args... args) const {
    return _invoke(_fp, std::forward<Args>(args)...);
  }

 private:
  void* _fp;
  Ret (*_invoke)(void*, Args...);
  void (*_free)(void*);
  void* (*_copy)(void*);
};

int main() {
  Closure<unsigned(unsigned)> fact = [&fact](unsigned x) {
    return x <= 1 ? 1 : x * fact(x - 1);
  };
  // 输出 3628800
  std::cout << fact(10) << std::endl;

  Closure<unsigned(unsigned)> fib = [&fib](unsigned x) {
    return x == 0 ? 0 : x <= 2 ? 1 : fib(x - 1) + fib(x - 2);
  };
  // 输出 55
  std::cout << fib(10) << std::endl;

  return 0;
}
```
{: run="cpp" }

Perfect！完美达成了我们的需求

这时候有人要说了，博主你这 `Closure` 没法用在成员函数上啊！啊是的，成员函数指针必须以 `(x.*f)()`{:.language-cpp} 或者 `(x->*f)()`{:.language-cpp} 的形式调用，而我们的 `invoke` 函数显然没有对这种情况做特殊处理。不过问题也不大，C++17 之后我们可以使用标准库的 `std::invoke()`{:.language-cpp} 来兼容成员函数：

```cpp
#include <functional>

...

template <typename Ret, typename... Args>
class Closure<Ret(Args...)> {
 private:
  template <typename Lambda>
  static Ret invoke(void* fp, Args... args) {
    return std::invoke(*reinterpret_cast<std::remove_reference_t<Lambda>*>(fp),
                       std::forward<Args>(args)...);
  }

  ...
};

class Test {
 public:
  void test() {
    std::cout << "hello world" << std::endl;
  }
};

int main() {
  Test t;
  Closure<void(Test *)> f = &Test::test;
  f(&t);

  return 0;
}
```
{: highlight-lines="10-11" }

至于 `std::invoke()`{:.language-cpp} 为什么有这种奇效，则涉及到一定的模板元编程知识，同样可以在[如何在 C++ 中实现柯里化]({{ base.url }}{% link _posts/2023-7-18-cpp_currying.md %})这篇文章中了解一二。

当然，`std::function`{:.language-cpp} 的东西远不止这么点，不过最核心的功能已经在本文中介绍了，剩下那些边角料，有兴趣的话就请自行翻阅源代码吧~

最后，在 C++23 的提案中，有一个新的语法称为 **deducing this**，它允许类成员函数将一个显式对象作为其第一个参数，如果该语法得到实施，这意味着我们可以简单的写出这样的代码来递归 lambda函数：

```cpp
#include<iostream>

int main()
{
    auto fact = [](this auto &&self, unsigned x) {
        return x <= 1 ? 1 : x * self(x - 1);
    };
    std::cout << fact(10) << std::endl;
    return 0;
}
```
