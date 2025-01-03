---
date created: 2024-04-15 00:02
date updated: 2024-12-27 23:52
tags:
  - '#include'
  - '#define'
dg-publish: true
---

# C++内存模型

C++程序在执行时，将内存大方向划分为**4个区域**

- **代码区**：存放函数体的二进制代码，由操作系统进行管理的
- **全局区**：存放全局变量和静态变量以及常量
- **栈区**：由编译器自动分配释放，存放函数的参数值，局部变量等
- **堆区**：由程序员分配和释放，若程序员不释放，程序结束时由操作系统回收

## C/C++内存布局

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405052205266.png)

## 程序运行前

 在程序编译后，生成了可执行程序，**未执行该程序前**分为两个区域

​**代码区：**

- 存放 CPU 执行的机器指令
- 代码区是**共享**的，共享的目的是对于频繁被执行的程序，只需要在内存中有一份代码即可
- 代码区是**只读**的，使其只读的原因是防止程序意外地修改了它的指令

​**全局区：**

- 全局变量和静态变量存放在此
- 全局区还包含了常量区, 字符串常量和其他常量也存放在此
- ==该区域的数据在程序结束后由操作系统释放==.

示例：

```cpp
#include <iostream>

using namespace std;

// 全局变量
int g_a = 10;
int g_b = 10;

// 全局常量
const int c_g_a = 10;
const int c_g_b = 10;

int main()
{

    // 局部变量
    int a = 10;
    int b = 10;

    // 打印地址
    cout << "局部变量a地址为： " << (int *)&a << endl;
    cout << "局部变量b地址为： " << (int *)&b << endl;

    cout << "全局变量g_a地址为： " << (int *)&g_a << endl;
    cout << "全局变量g_b地址为： " << (int *)&g_b << endl;

    // 静态变量
    static int s_a = 10;
    static int s_b = 10;

    cout << "静态变量s_a地址为： " << (int *)&s_a << endl;
    cout << "静态变量s_b地址为： " << (int *)&s_b << endl;

    cout << "字符串常量地址为： " << (int *)&"hello world" << endl;
    cout << "字符串常量地址为： " << (int *)&"hello world1" << endl;

    cout << "全局常量c_g_a地址为： " << (int *)&c_g_a << endl;
    cout << "全局常量c_g_b地址为： " << (int *)&c_g_b << endl;

    const int c_l_a = 10;
    const int c_l_b = 10;
    cout << "局部常量c_l_a地址为： " << (int *)&c_l_a << endl;
    cout << "局部常量c_l_b地址为： " << (int *)&c_l_b << endl;

    system("pause");

    return 0;
}
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240428174104.png)

总结：

- C++中在程序运行前分为全局区和代码区
- 代码区特点是共享和只读
- 全局区中存放全局变量、静态变量、常量
- 常量区中存放 const修饰的全局常量 和 字符串常量

## 程序运行后

**栈区：**

- 由编译器自动分配释放, 存放函数的参数值,局部变量等

​ 注意事项：不要返回局部变量的地址，栈区开辟的数据由编译器自动释放

示例：

```cpp
int * func()
{
	int a = 10;
	return &a;
}

int main() {

	int *p = func();

	cout << *p << endl;
	cout << *p << endl;

	system("pause");

	return 0;
}
```

**堆区：**

- 由程序员分配释放,若程序员不释放,程序结束时由操作系统回收

​ 在C++中主要利用new在堆区开辟内存

```cpp
int* func()
{
	int* a = new int(10);
	return a;
}

int main() {

	int *p = func();
	
	cout << *p << endl;
	cout << *p << endl;
	delete p;
	system("pause");
	
	return 0;
}
```

## C++的堆和栈内存对比

- 当我们的程序开始的时候，程序被分成了一堆不同的内存区域，有堆和栈。

### 栈内存 Stack

#### 栈内存定义

**概念：** 是存在于某作用域 (scope) 的一块內存空间 (memory space)。例如当你调用函数，函数本身即会形成一个 stack 用來放置它所接收的参数，以及返回地址。在函数本体 (function body) 內声明的任何变量，其所使用的內存块都取自上述 stack 内存。

**栈**通常是一个预定义大小的内存区域，通常约为 `2M` 字节左右。**堆**也是一个预定义了默认值的区域，**但是它可以**随着应用程序的进行而改变。

### 堆内存 Heap

#### Heap 定义

概念：或谓 system heap，是指由操作系统提供的一块 global 內存空间，程序可动态分配 (dynamic allocated) 从某中获得若干区块 (blocks)。

**栈和堆内存区域的实际位置（物理位置）在 RAM 中完全一样**（并不是一个存在 CPU 缓存而另一个存在其他地方）

> 在程序中，内存是用来实际储存数据的。我们需要一个地方来储存允许程序所需要的数据（比如局部变量 or 从文件中读取的东西）。而栈和堆，它们就是可以储存数据的地方，但**栈和堆的工作原理非常非常不同**，但本质上它们做的事情是一样的

### 栈和堆的区别

定义格式不同：

```cpp
// 在栈上分配
int val = 5; 
// 在堆上分配
int *hval = new int; // 区别是，我们需要用new关键词来在堆上分配
*hval = 5;
```

内存分配方式不同：

1. **在栈上**，分配的内存都是**连续**的。添加一个 int，则**栈指针（栈顶部的指针）** 就移动 4 个字节，所以连续分配的数据在内存上都是**连续**的。栈分配数据是直接把数据堆在一起（所做的就是移动栈指针），所以栈分配数据会很快。如果离开作用域，在栈中分配的所有内存都会弹出，内存被释放。
2. **在堆上**，分配的内存都是**不连续**的，`new` 实际上做的是在内存块的**空闲列表**中找到空闲的内存块，然后把它用一个指针圈起来，然后返回这个指针。（但如果**空闲列表**找不到合适的内存块，则会询问**操作系统**索要更多内存，而这种操作是很麻烦的，潜在成本是巨大的）离开作用域后，堆中的内存仍然存在。

**建议：** 能在栈上分配就在栈上分配，**不能够在栈上分配时或者有特殊需求时（比如需要生存周期比函数作用域更长，或者需要分配一些大的数据），才在堆上分配**

# C语言动态内存管理方式

C 语言中的动态内存管理是通过一组标准库函数完成的，这些函数包括 `malloc`、`calloc`、`realloc` 和 `free`。它们定义于 `<stdlib.h>` 头文件中，并允许在运行时分配和释放内存。

## malloc

`malloc` 函数用于**分配一块连续的内存区域**，其大小由传递给 `malloc` 的参数指定。如果分配成功，`malloc` 返回指向分配内存的指针；如果失败，返回 `NULL`。

```c
#include <stdlib.h>

int* ptr = (int*)malloc(sizeof(int) * n); // 分配 n 个整数的空间
if (ptr == NULL) {
    // 内存分配失败的处理
}
```

## calloc

`calloc` 函数和 `malloc` 类似，但有两个不同之处：一是它接收两个参数，数组的数量和每个元素的大小；二是它会将分配的内存初始化为零。

```c
#include <stdlib.h>

int* ptr = (int*)calloc(n, sizeof(int)); // 分配并清零 n 个整数的空间
if (ptr == NULL) {
    // 内存分配失败的处理
}

```

## realloc

`realloc` 函数用于改变先前分配的内存块的大小。如果内存重新分配成功，它返回指向新内存的指针；如果失败，返回 `NULL`

```c
#include <stdlib.h>

ptr = (int*)realloc(ptr, sizeof(int) * n_new); // 将 ptr 指向的内存大小重设为 n_new 个整数的空间
if (ptr == NULL) {
    // 内存重新分配失败的处理
}

```

## free

`free` 函数用于释放先前通过 `malloc`、`calloc` 或 `realloc` 函数分配的内存。一旦内存被释放，指向它的指针应该被置为 `NULL`，以避免悬空指针（`Dangling Pointer`）。

```c
#include <stdlib.h>

free(ptr); // 释放 ptr 指向的内存
ptr = NULL; // 防止出现悬空指针
```

## 动态内存管理的注意事项

- 在使用完动态分配的内存后，总是要调用 `free` 函数来释放内存，避免内存泄漏。
- 在 `free` 之后，确保将指针设置为 `NULL`，这样就不会意外地操作无效内存。
- 进行任何动态内存管理操作时，都需要检查返回值以确保操作成功。
- 使用动态内存时，应确保不会发生内存越界、重复释放或忘记释放等问题。这些错误可能导致程序崩溃或安全漏洞。

# C++动态内存管理

C++ 的动态内存管理是通过一对操作符 `new` 和 `delete` 来实现的，这两个操作符使得动态内存分配和释放更加直接、更容易避免错误。

**new 有三个动作：**

1. 分配内存
2. 调用构造函数
3. 转型，返回指针

**delete 有两个动作：**

1. 调用析构函数
2. 释放内存

当我们 new 一个对象或 delete 一块内存的时候，这个 new 和 delete 是一个 expression 表达式，不可以重载；但它们的内部的 `operator new`，`operator delete` 是可以被重载的。

## new 和 delete 使用

### 使用 new 分配内存

`new` 操作符在堆（heap）上为指定类型的数据分配内存，并返回指向该内存的指针。`new` 还会自动调用对象的构造函数（如果存在）来初始化对象。

```cpp
// 为单个整数分配内存
int* p = new int(10);  // 分配并初始化一个整数值为 10

// 为整数数组分配内存
int* arr = new int[10];  // 分配一个大小为 10 的 int 数组，数组元素未被初始化
```

### 使用 delete 释放内存

`delete` 操作符用于释放由 `new` 操作符分配的内存，并调用相应对象的析构函数（如果有的话）。

```cpp
delete p;     // 释放单个对象
delete[] arr; // 释放对象数组
```

注意，释放数组时应该使用 `delete[]` 而不是 `delete`，否则可能导致未定义行为。

### new 和 delete 的注意事项

- 与 `malloc` 和 `free` 不同，`new` 和 `delete` 会自动处理构造函数和析构函数的调用。
- 总是成对使用 `new` 和 `delete` 以及 `new[]` 和 `delete[]` 避免内存泄露和其他内存问题。
- 在 `delete` 或 `delete[]` 之后，应将指针设置为 `nullptr` 避免悬挂指针（dangling pointers）。

### C++11 后的动态内存管理

在 `new` 和 `delete` 之外，C++11 引入了智能指针，这些智能指针如 `std::unique_ptr`, `std::shared_ptr` 和 `std::weak_ptr` 在 `<memory>`头文件中被定义，并提供自动化的内存管理。

示例：使用 `std::unique_ptr`：

```cpp
#include <memory>

// 创建 unique_ptr 管理单个对象
std::unique_ptr<int> pUnique(new int(10));

// 创建 unique_ptr 管理对象数组
std::unique_ptr<int[]> pArray(new int[10]);
```

当智能指针离开作用域时，它们会自动释放所管理的内存，并对它们的对象调用适当的析构函数，极大地减少了内存泄露的几率。智能指针是处理动态内存时的现代和首选方法。

### new/delete 和 malloc/free 区别

#### 内置类型

如果申请的是内置类型的空间，`new` 和 `malloc`，`delete` 和 `free`基本类似，不同的地方是：

1. `new` / `delete` 申请和释放的是单个元素的空间，`new[]`和`delete[]`申请的是连续空间，
2. new在申请空间失败时会抛异常， `malloc`会返回NULL。

#### 自定义类型

**共同点是:**

都是从堆上申请空间，并且需要用户手动释放。

**不同点：**

- **malloc和free是函数，new和delete是操作符**
- malloc 申请的空间不会初始化，new 可以初始化(调用构造函数)
- malloc申请空间时，需要手动计算空间大小并传递，new只需在其后跟上空间的类型即可
- malloc的返回值为`void*`, 在使用时必须强转，new不需要，因为new后跟的是空间的类型
- **malloc申请空间失败时，返回的是NULL，因此使用时必须判空，new不需要，但是new需要捕获异常**
- **申请自定义类型对象时，malloc/free只会开辟与销毁空间，不会调用构造函数与析构函数，而new在申请空间后会调用构造函数完成对象的初始化，delete在释放空间前会调用析构函数完成空间中资源的清理**
- new/delete比malloc和free的效率稍微低点，因为new/delete的底层封装了malloc/free

**示例：**

```cpp
#include <iostream>
#include <malloc.h>
using namespace std;
class Test
{
private:
    int _data;
public:
    Test() : _data(0)
    {
        cout << "Test()" << endl;
    }
    ~Test()
    {
        cout << "~Test():" << this << endl;
    }
};
void test_malloc_free()
{
    // 申请单个Test类型的内存空间
    Test *p1 = (Test *)malloc(sizeof(Test));
    free(p1);

    // 申请10个Test类型的内存空间
    Test *p2 = (Test *)malloc(sizeof(Test) * 10);
    free(p2);
}
void test_new_delete()
{
    // 申请单个Test类型的对象
    Test *p1 = new Test;
    delete p1;
    // 申请10个Test类型的对象
    Test *p2 = new Test[10];
    delete[] p2;
}
int main()
{
    test_malloc_free();
    cout << "----------------" << endl;
    test_new_delete();
    std::cin.get();
    return 0;
}
```

输出：

```
----------------
Test()
~Test():0x7d6fa0
Test()
Test()
Test()
Test()
Test()
Test()
Test()
Test()
Test()
Test()
~Test():0x7d6fcc
~Test():0x7d6fc8
~Test():0x7d6fc4
~Test():0x7d6fc0
~Test():0x7d6fbc
~Test():0x7d6fb8
~Test():0x7d6fb4
~Test():0x7d6fb0
~Test():0x7d6fac
~Test():0x7d6fa8
```

> 可以看到，`malloc` 和 `free` 分配/释放内存后，不会调用构造函数和析构函数；而 `new` 和 `delete` 分配/释放内存后，会调用构造函数和析构函数。

### new 一个对象时加括号和不加括号的区别

#### 内置类型

`int *a = new int;`不会将申请到的int空间初始化，而`int *a = new int();`则会将申请到的int空间初始化为0。

- 不带括号，默认初始化，内置的简单数据类型，如 int、float、double 等，如果它们没有初始化，它们的值是未定义的。
- 带括号，会被初始化，如 int 会被初始化为 0

```cpp
void test1()
{
    int *p = new int; // 未初始化
    cout << "*p = " << *p << endl; // *p = -1163005939

    int *p2 = new int(); // 初始化为0
    cout << "*p2 = " << *p2 << endl; // *p2 = 0

    int *p3 = new int[10]; // 未初始化
    for (int i = 0; i < 10; i++)
    {
        cout << p3[i] << " ";
    }
    cout << endl;
    int *p4 = new int[10](); // 初始化为0
    for (int i = 0; i < 10; i++)
    {
        cout << p4[i] << " ";
    }
}
```

#### 自定义类型

- 如果该类没有定义构造函数（由编译器合成默认构造函数）也没有虚函数，那么 class c = new class;将不调用合成的默认构造函数，而 class c = new class();则会调用默认构造函数。
- 如果该类没有定义构造函数（由编译器合成默认构造函数）但有虚函数，那么 class c = new class;和 class c = new class();一样，都会调用默认构造函数。
- 如果该类定义了默认构造函数，那么 class c = new class;和 class c = new class();一样，都会调用默认构造函数。

#### 其他疑问

**new申请的内存，能用free吗？**

- 不可以，new对应delete不可以张冠李戴。（malloc/free,new/delete必需配对使用）
- 对于非内部数据类型的对象而言，光用 malloc/free 无法满足动态对象的要求。对象在创建的同时要自动执行构造函数，对象在消亡之前要自动执行析构函数。由于 malloc/free 是库函数而不是运算符，不在编译器控制权限之内，不能够把执行构造函数和析构函数的任务强加于 malloc/free。因此 C++语言需要一个能完成动态内存分配和初始化工作的运算符 new，以及一个能完成清理与释放内存工作的运算符 delete。

**free如何知道要free多大的空间？**
malloc函数的实现是以块分配内存，在被分配的块中包括两部分。

- **第一部分中存储含有报头的元数据，它其中包含有分配块的大小信息，是一个常量；**
- **第二部分中存储实际用户数据。而使用malloc分配内存返回的是第二部分用户数据的地址。**

而块的两个部分在内存中的存储取决有编译器的实现，一般有两种情况，第一种是最常见的，即元数据和用户数据是连续的，存储在连续空间位置。第二种是两部分分开存储。
所以内存释放时不再需要再指定释放多大的内存空间，只需要指定该块内存空间的首地址即可。

## new 和 delete 原理

### new 原理

`new` 主要做三件事：

1. 调用 `operator_new` 分配空间
2. 初始化对象(调用构造函数)
3. 返回指针

如：

```cpp
String * ps = new String("Hello");
```

编译器转换为：

```cpp
void* mem = operator_new(sizeOf(String)); // 分配内存，内部调用malloc(n)
ps = static_cast<String*>(mem); // 强转
ps->String::String("Hello"); // 调用构造函数
```

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405051917890.png)

new 操作符底层调用关系：

```
new → operator new() → malloc()
```

#### `operator new`

- new 是一个操作符，进行动态内存申请；
- `operator new` 是系统提供的一个全局函数，可以重载。

```cpp
/*
operator new:该函数实际通过malloc来申请空间，当malloc申请空间成功时直接返回;申请空间失败，尝试执行空间不足应对措施，如果改应对措施用户设置了，则继续申请，否则抛异常。
*/
void* __CRTDECL operator new(size_t size) _THROW1(_STD bad_alloc)
{
    // try to allocate size bytes
    void* p;
    while ((p = malloc(size)) == 0) // 尝试分配内存
        if (_callnewh(size) == 0)
        {
            // report no memory
            // 如果申请内存失败了，这里会抛出bad_alloc 类型异常 
            static const std::bad_alloc nomem; 
            _RAISE(nomem);
        }
        
    return (p); // 返回指针
}
```

**operator new 实际也是通过malloc来申请空间**，如果malloc申请空间成功就直接返回，否则执行用户提供的空间不足应对措施，如果用户提供该措施就继续申请，否则就抛异常

#### 重载 `operator_new`

##### 全局重载

**全局重载 `::operator new, ::operator delete, :: operator new[], ::operator delete[]`**，全局重载要小心，它影响范围是全局。
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405082330906.png)

**为什么不能放在 namespace 内？**

因为全局 `operator new` 是放在 **default global namespace**中的。

##### 类成员函数operator new的重载

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405082331091.png)

注意：类成员函数`operator new/delete`实际都是**静态**的。本身new操作是创建对象时进行的，而非静态函数需要对象来调用。想在对象创建之前就调用成员函数，那么该成员函数必定是静态函数。（不需要加static关键字，因为编译器默认operator new/delete为静态函数）

**示例：**

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405082332190.png)

- `Foo* pf = new Foo;`编译器寻找类中有没有重载的`operator new`，若没有则调用全局的::operator new。
- `Foo* pf = ::new Foo；`可以强制使用全局的`::operator new`。

##### 用途

1. 用于调试内存分配
2. 实现内存池

### delete 原理

`delete` 先调用析构函数，再释放内存。

```cpp
String *ps = new String("Hello");
// ...
delete ps;
```

编译器转换为：

```cpp
String::~String(ps); // 调用析构函数
operator_delete(ps); // 释放内存
```

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405051916132.png)

`delete` 操作符底层调用关系：

```
delete → operator delete() → free()
```

#### operator delete

`operator delete` 源码：

```cpp
/*
operator delete: 该函数最终是通过free来释放空间的 
*/
void operator delete(void* pUserData)
{
    _CrtMemBlockHeader* pHead;
    
    RTCCALLBACK(_RTC_Free_hook, (pUserData, 0));
    if (pUserData == NULL)
        return;
    _mlock(_HEAP_LOCK);  /* block other threads */
    __TRY
    
        /* get a pointer to memory block header */
        pHead = pHdr(pUserData);
        
    	/* verify block type */
    	_ASSERTE(_BLOCK_TYPE_IS_VALID(pHead->nBlockUse));
    	
    	_free_dbg(pUserData, pHead->nBlockUse);
    	
    __FINALLY
        _munlock(_HEAP_LOCK);  /* release other threads */
    __END_TRY_FINALLY
    
    return;
}
/* free的实现 */ #define free(p) _free_dbg(p, _NORMAL_BLOCK)
```

**operator delete 最终是通过free来释放空间的。**

### new 和 delete 原理总结

**new T 原理：**

1. 调用 `void* operator new(sizeof(T))` 函数，申请与 T 类型大小的堆空间
2. 调用构造函数，完成 T 类型对象的构造
3. 返回指针

**delete原理：**

1. 在空间上执行析构函数，完成对象中资源的清理工作
2. 调用 `operator delete` 函数释放对象的空间

**`new T[N]` 原理：**

1. 调用 `void* operator new[](count = sizeof(T)*N+4(用来记录申请对象的个数)` 函数，在 `operator new[]` 中实际调用 `operator new` 函数完成 N 个对象空间的申请
2. 将空间前 4 个字节中填充对象的个数
3. 在申请的空间上执行 N 次构造函数

**delete[]原理：**

1. 从第一个对象空间之前的 4 个字节中取对象的个数 N
2. 在释放的对象空间上执行 N 次析构函数，完成 N 个对象的资源清理
3. 调用 `void* operator delete[](void *p)` 释放空间，实际在 `operator delete[]` 中调用的事 `operator delete` 来释放空间

## placement new和placement delete

### placement new

在 C++ 中，`placement new` 是一种特殊的 `new` 表达式，它允许在已经分配的内存地址上构造对象。通常，常规的 `new` 表达式首先分配内存，然后调用构造函数来初始化对象。而 `placement new` 允许开发者手动指定对象的位置，这样可以避免额外的内存分配，并允许更精细地控制内存。

`placement new` 的使用语法如下：

```cpp
#include <new> // 必须包含此头文件

void* mem = ...; // 获取一块预先分配好的内存
T* obj = new (mem) T(args); // 在指定的内存地址 mem 构造对象 T
```

其中，mem 是一个指向预先分配内存的指针，T 是要构建的对象类型，args 是传递给 T 构造函数的参数。

由于 `placement new` 实际上并不分配内存，所以与之配对的删除操作也有所区别。C++ 标准并没有定义一个对应的 "placement delete"，因为内存是由用户管理的。但是，如果在使用 placement new 构造的对象发生了异常，那么相应类型的 placement delete（如果提供）会被调用来释放资源。在正常情况下，当你不再需要使用 placement new 分配的对象时，需要显式地调用析构函数来销毁对象，并且还需要确保手动管理的内存被适当地释放。

```cpp
obj->~T(); // 显式地调用对象的析构函数
```

在使用 `placement new` 时，你需要非常小心地管理内存，确保不会发生内存泄漏或其他资源管理错误。

**placement new**有如下特点：

- 使用形式：`Foo* pf = new(300,'c') Foo;`
- 可以重载多个`class member operator new()`版本，但每一个版本的**参数列表必须独一无二**。
- 且参数列表的第一个参数必须为size_t，其余参数以new所指定的placement arguments为初值。出现在new(......)小括号内的便是所谓的placement arguments。
- 所以上述的使用形式小括号内虽然看到有两个参(300，‘c’)，其实有三个。

### placement delete

有如下特点：

- **可以**（也**可以不**）重载多个`class member operator delete()`版本，但绝不会被**delete**调用（这个delete是指可以被分解为两步的那个delete）
- **唯一被调用的时机**：只有**当new所调用的构造函数**(new被分解的第一步)抛出异常，才会调用与new对应的那个重载operator delete()，主要用来归还未能**完全创建成功**的对象所占用的内存。
