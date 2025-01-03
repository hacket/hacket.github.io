---
date created: 2024-04-24 21:42
date updated: 2024-12-27 23:51
tags:
  - '#include'
dg-publish: true
---

# 手写 std::array

```cpp
#include <iostream>

// 不使用模板定义数组
class MyArray0
{
private:
    // int m_Data[];
    int *m_Data;

public:
    MyArray0(int size)
    {
        // m_Data = new int[size];
        m_Data = (int *)malloc(size);
    }

    ~MyArray0()
    {
        delete[] m_Data;
    }
};

// 使用模板定义数组
template <typename T, size_t S>
class MyArray1
{
private:
    T m_Data[S];

public:
    // 返回数组大小
    constexpr size_t size() const { return S; }
    // 重载下标操作符
    // T operator[](size_t index) { return m_Data[index]; } //  data[0] = 1; error expression must be a modifiable lvalue

    T &operator[](size_t index) { return m_Data[index]; } //  data[0] = 1; ok

    // const T &operator[](size_t index) // data[0] = 1; error expression must be a modifiable lvalueC
    // {
    //     if (index >= S)
    //     {
    //         throw std::out_of_range("Index out of range");
    //         // __debugbreak();
    //     }
    //     return m_Data[index];
    // }

    T *getData() { return m_Data; }

    const T *getData() const { return m_Data; }
};

int main(int argc, char const *argv[])
{
    // C++标准数组
    // int array[5];
    // int array[size]; // error: identifier "size" is undefinedC/

    // int size = 5;
    // int *heapArray = new int[size];
    // delete[] heapArray;

    // std::array
    // std::array<int, 10> stdArray;

    // MyArray0 myArray(5); // ok

    static_assert(sizeof(MyArray0) == sizeof(int *), "MyArray0 is not zero size!");

    MyArray1<int, 5> data;
    size_t size = data.size();

    // data[0] = 1;

    // 设置数组元素为0，不设置的话，数组元素为随机值
    memset(data.getData(), 0, data.size() * sizeof(int));

    data[1] = 89;

    // 打印数组元素
    for (size_t i = 0; i < data.size(); i++)
    {
        std::cout << data[i] << std::endl;
    }

    return 0;
}
```

`MyArray1` 的内存分配情况？
在 `MyArray1` 类中，`m_Data` 是一个大小为 S 的数组，作为类的成员变量。该数组是在模板类 `MyArray1<T, S>` 实例化时分配内存的。内存分配位置取决于你如何使用 `MyArray1` 的实例。

如果你在函数内部创建了 `MyArray1` 类的对象，例如：

```cpp
void myFunction() {
    MyArray1<int, 5> myArray;
    // 这里 myArray 的存储空间以及 m_Data 的内存都被分配在栈上。栈是自动分配并且在函数调用结束后自动释放的内存区域。
}
```

如果你用 new 在堆上动态创建 `MyArray1` 的实例，比如：

```cpp
MyArray1<int, 5>* myArray = new MyArray1<int, 5>();
// ...
delete myArray;
// 在这个例子中，myArray 指向的对象以及 m_Data 的内存都被分配在堆上。堆是一个需要程序员手动管理内存的区域，意味着你需要显式地创建和删除对象。
```

因此，`m_Data` 的内存是在栈上还是堆上，取决于你如何声明和初始化你的 `MyArray1` 对象。通常来说，在栈上创建对象比较快和简单，但堆上可以创建更大的对象，并可以跨函数调用持续存在。

# 手写 `std::vector`

- [VECTOR/DYNAMIC ARRAY - Making DATA STRUCTURES in C++](https://www.youtube.com/watch?v=ryRf4Jh_YC0&list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb&index=92&ab_channel=TheCherno)
