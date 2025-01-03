---
image-auto-upload: true
feed: show
format: list
date created: 星期一, 十二月 30日 2024, 10:02:59 上午
tags: ['#include']
date updated: 星期四, 一月 2日 2025, 4:16:43 下午
dg-publish: true
title: STL 容器
date modified: 星期四, 一月 2日 2025, 4:00:33 下午
aliases: [C++容器]
linter-yaml-title-alias: C++容器
---

# C++容器

STL**容器**就是将运用**最广泛的一些数据结构**实现出来

常用的数据结构：数组、链表、树、栈、队列、集合和映射表等

这些容器分为**序列式容器**和**关联式容器**两种:

- **序列式容器**: 强调值的排序，序列式容器中的每个元素均有固定的位置
- **关联式容器**: 二叉树结构，各元素之间没有严格的物理上的顺序关系

## 序列式容器/顺序容器 Sequential Containers

序列式容器维护元素的严格线性顺序。

> 元素排列次序与元素无关，由元素添加到容器的顺序决定

| 容器                  | 说明                                                                  |
| ------------------- | ------------------------------------------------------------------- |
| `std::vector`       | 动态数组，提供快速的随机访问（通过索引）。不过在数组的中间或开始位置插入或删除元素可能效率较低，因为这可能导致内存重新分配和元素移动。 |
| `std::deque`        | 双端队列，可以在开始和结尾处高效地插入和删除元素。与 `std::vector` 相比，它的随机访问效率较低。             |
| `std::list`         | 双向链表，允许在任意位置快速插入和删除元素。但是，随机访问效率低，因为需要通过迭代器逐个遍历元素。                   |
| `std::forward_list` | 单向链表，提供了在任意位置快速插入和删除元素的功能。空间使用更为高效，但只支持前向迭代。                        |
| `std::stack`        | 后进先出LIFO(Last In First Out)堆栈                                       |
| `std::queue`        | 先进先出FIFO(First Input First Output)队列                                |
| `std::array`        | 固定大小的数组，大小在编译时指定。提供快速的随机访问，并在栈上分配内存。                                |

### `std::vector` 动态数组

#### vector 概述

**功能：**

- vector数据结构和**数组非常相似**，也称为**单端数组**

**vector与普通数组区别：**

- 不同之处在于数组是静态空间，而vector可以**动态扩展**

**动态扩展：**

- vector容器的迭代器是支持随机访问的迭代器
- 并不是在原空间之后续接新空间，而是找更大的内存空间，然后将原数据拷贝新空间，释放原空间

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405040055189.png)

#### vector 构造器

**功能描述：**

- 创建vector容器

**函数原型：**

- `vector<T> v;`  //采用模板实现类实现，默认构造函数
- `vector(v.begin(), v.end());`  //将`v[begin(), end())`区间中的元素拷贝给本身。
- `vector(n, elem);` //构造函数将n个elem拷贝给本身。
- `vector(const vector &vec);` //拷贝构造函数。

**示例：**

```cpp
void printVector(std::vector<int> &v)
{
    std::vector<int>::iterator item = v.begin();
    auto end = v.end();
    while (item != end)
    {
        std::cout << *item << " ";
        item++;
    };
    std::cout << std::endl;
}
// 测试vector的构造函数
void test_vector_constructor()
{
    std::cout << "test vector constructor" << std::endl;
    std::vector<int> v1; // 默认构造函数，无参数
    for (int i = 0; i < 10; i++)
    {
        v1.push_back(i);
    }
    printVector(v1); // 0 1 2 3 4 5 6 7 8 9

    std::vector<int> v2(v1.begin(), v1.end());
    printVector(v2); // 0 1 2 3 4 5 6 7 8 9

    std::vector<int> v3(10, 100);
    printVector(v3); // 100 100 100 100 100 100 100 100 100 100

    std::vector<int> v4(v3);
    printVector(v4); // 100 100 100 100 100 100 100 100 100 100
}
```

#### vector赋值操作

**功能描述：**

- 给vector容器进行赋值

**函数原型：**

- `vector& operator=(const vector &vec);`//重载等号操作符
- `assign(beg, end);` //将`[beg, end)`区间中的数据拷贝赋值给本身。
- `assign(n, elem);` //将n个elem拷贝赋值给本身。

**示例：**

```cpp
// 赋值操作
void test_vector_assign()
{
    vector<int> v1; // 无参构造
    for (int i = 0; i < 10; i++)
    {
        v1.push_back(i);
    }
    printVector(v1); // 0 1 2 3 4 5 6 7 8 9

    vector<int> v2;
    v2 = v1;
    printVector(v2); // 0 1 2 3 4 5 6 7 8 9

    vector<int> v3;
    v3.assign(v1.begin(), v1.end());
    printVector(v3); // 0 1 2 3 4 5 6 7 8 9

    vector<int> v4;
    v4.assign(10, 100);
    printVector(v4); // 100 100 100 100 100 100 100 100 100 100
}
```

#### vector容量和大小

**函数原型：**

- `empty();`  //判断容器是否为空
- `capacity();` //容器的容量
- `size();` //返回容器中元素的个数
- `resize(int num);` //重新指定容器的长度为num，若容器变长，则以默认值填充新位置。
  ​ //如果容器变短，则末尾超出容器长度的元素被删除。
- `resize(int num, elem);` //重新指定容器的长度为num，若容器变长，则以elem值填充新位置。
  ​ //如果容器变短，则末尾超出容器长度的元素被删除

**示例：**

```cpp
void test01()
{
	vector<int> v1;
	for (int i = 0; i < 10; i++)
	{
		v1.push_back(i);
	}
	printVector(v1);
	if (v1.empty())
	{
		cout << "v1为空" << endl;
	}
	else
	{
		cout << "v1不为空" << endl;
		cout << "v1的容量 = " << v1.capacity() << endl;
		cout << "v1的大小 = " << v1.size() << endl;
	}

	//resize 重新指定大小 ，若指定的更大，默认用0填充新位置，可以利用重载版本替换默认填充
	v1.resize(15,10);
	printVector(v1);

	//resize 重新指定大小 ，若指定的更小，超出部分元素被删除
	v1.resize(5);
	printVector(v1);
}
```

**总结：**

- 判断是否为空 --- empty
- 返回元素个数 --- size
- 返回容器容量 --- capacity
- 重新指定大小 --- resize

#### vector插入和删除

**函数原型：**

- `push_back(ele);` //尾部插入元素ele
- `pop_back();` //删除最后一个元素
- `insert(const_iterator pos, ele);` //迭代器指向位置pos插入元素ele
- `insert(const_iterator pos, int count,ele);`//迭代器指向位置pos插入count个元素ele
- `erase(const_iterator pos);` //删除迭代器指向的元素
- `erase(const_iterator start, const_iterator end);`//删除迭代器从start到end之间的元素
- `clear();` //删除容器中所有元素

**示例：**

```cpp
//插入和删除
void test01()
{
	vector<int> v1;
	//尾插
	v1.push_back(10);
	v1.push_back(20);
	v1.push_back(30);
	v1.push_back(40);
	v1.push_back(50);
	printVector(v1);
	//尾删
	v1.pop_back();
	printVector(v1);
	//插入
	v1.insert(v1.begin(), 100);
	printVector(v1);

	v1.insert(v1.begin(), 2, 1000);
	printVector(v1);

	//删除
	v1.erase(v1.begin());
	printVector(v1);

	//清空
	v1.erase(v1.begin(), v1.end());
	v1.clear();
	printVector(v1);
}
```

**总结：**

- 尾插 --- push_back
- 尾删 --- pop_back
- 插入 --- insert (位置迭代器)
- 删除 --- erase （位置迭代器）
- 清空 --- clear

#### vector数据存取

**函数原型：**

- `at(int idx);`  //返回索引idx所指的数据
- `operator[];`  //返回索引idx所指的数据
- `front();`  //返回容器中第一个数据元素
- `back();` //返回容器中最后一个数据元素

**示例：**

```cpp
void test01()
{
	vector<int>v1;
	for (int i = 0; i < 10; i++)
	{
		v1.push_back(i);
	}

	for (int i = 0; i < v1.size(); i++)
	{
		cout << v1[i] << " ";
	}
	cout << endl;

	for (int i = 0; i < v1.size(); i++)
	{
		cout << v1.at(i) << " ";
	}
	cout << endl;

	cout << "v1的第一个元素为： " << v1.front() << endl;
	cout << "v1的最后一个元素为： " << v1.back() << endl;
}
```

**总结：**

- 除了用迭代器获取vector容器中元素，`[]`和`at`也可以
- `front`返回容器第一个元素
- `back`返回容器最后一个元素

#### vector互换容器

**功能描述：**

- 实现两个容器内元素进行互换

**函数原型：**

- `swap(vec);` // 将vec与本身的元素互换

**示例：**

```cpp
void test01()
{
	vector<int>v1;
	for (int i = 0; i < 10; i++)
	{
		v1.push_back(i);
	}
	printVector(v1);

	vector<int>v2;
	for (int i = 10; i > 0; i--)
	{
		v2.push_back(i);
	}
	printVector(v2);

	//互换容器
	cout << "互换后" << endl;
	v1.swap(v2);
	printVector(v1);
	printVector(v2);
}
void test02()
{
	vector<int> v;
	for (int i = 0; i < 100000; i++) {
		v.push_back(i);
	}

	cout << "v的容量为：" << v.capacity() << endl;
	cout << "v的大小为：" << v.size() << endl;

	v.resize(3);

	cout << "v的容量为：" << v.capacity() << endl;
	cout << "v的大小为：" << v.size() << endl;

	//收缩内存
	vector<int>(v).swap(v); //匿名对象

	cout << "v的容量为：" << v.capacity() << endl;
	cout << "v的大小为：" << v.size() << endl;
}
```

总结：`swap`可以使两个容器互换，可以达到实用的收缩内存效果

#### vector预留空间

**功能描述：**

- 减少vector在动态扩展容量时的扩展次数

**函数原型：**

- `reserve(int len);`//容器预留len个元素长度，预留位置不初始化，元素不可访问。

**示例：**

```cpp
void test01()
{
	vector<int> v;

	//预留空间
	v.reserve(100000);

	int num = 0;
	int* p = NULL;
	for (int i = 0; i < 100000; i++) {
		v.push_back(i);
		if (p != &v[0]) {
			p = &v[0];
			num++;
		}
	}

	cout << "num:" << num << endl;
}
```

**总结：** 如果数据量较大，可以一开始利用 `reserve` 预留空间

#### 一些示例

```c
#include <vector>
using namespace std;

vector<int> vec_1;
//1个元素
vector<int> vec_2(1);
//6个值为 1 的元素
vector<int> vec_3(6,1);
//使用容器初始化
vector<int> vec_4(vec_3);

//通过下标操作元素
int i = vec_3[1];
int j = vec_3.at(1);
//首尾元素
vec_3.front()
vec_3.back()

//插入元素 
//vector不支持 push_front list,deque可以
vec_1.push_back(1);
//删除元素 vector不支持 pop_front
vec_1.pop_back();

//释放
//可以单个清除，也可以清除一段区间里的元素
vec_3.erase(vec_3.begin(),vec_3.end())
//清理容器 即erase所有
vec_3.clear(); 

//容量大小
vec_3.capacity();
//在容器中，其内存占用的空间是只增不减的，
//clear释放元素，却不能减小vector占用的内存
//所以可以对vector 收缩到合适的大小 
vector< int >().swap(vec_3);  

//在vec是全局变量时候
//建立临时vector temp对象，swap调用之后对象vec占用的空间就等于默认构造的对象的大小
//temp就具有vec的大小，而temp随即就会被析构，从而其占用的空间也被释放。
```

- 迭代器

```c
//获得指向首元素的迭代器  模板类，不是指针，当做指针来使用
vector<int>::iterator it = vec.begin();
//遍历元素
for (; it < vec.end(); it++)
{
	cout << *it << endl;
}
//begin和end   分别获得 指向容器第一个元素和最后一个元素下一个位置的迭代器
//rbegin和rend 分别获得 指向容器最后一个元素和第一个元素前一个位置的迭代器

//注意循环中操作元素对迭代器的影响
vector<int>::iterator it = vec.begin();
for (; it < vec.end(); )
{
    //删除值为2的元素 
	if (*it == 2) {
		vec.erase(it);
	}
	else {
		it++;
	}
}
```

### `std::deque` 双端队列

#### deque 概述

**功能：**

- 双端数组，可以对头端进行插入删除操作

**deque与vector区别：**

- `vector`对于头部的插入删除效率低，数据量越大，效率越低
- `deque`相对而言，对头部的插入删除速度回比`vector`快
- `vector`访问元素时的速度会比deque快,这和两者内部实现有关
- deque容器的迭代器也是支持随机访问的

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405041100550.png)

**deque 内部工作原理：**
deque内部有个**中控器**，维护每段缓冲区中的内容，缓冲区中存放真实数据
中控器维护的是每个缓冲区的地址，使得使用deque时像一片连续的内存空间
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405041101593.png)

#### deque构造函数

**功能描述：**

- deque容器构造

**函数原型：**

- `deque<T>` deqT; //默认构造形式
- `deque(beg, end);` //构造函数将[beg, end)区间中的元素拷贝给本身。
- `deque(n, elem);` //构造函数将n个elem拷贝给本身。
- `deque(const deque &deq);` //拷贝构造函数

**示例：**

```cpp
template <typename T>
void printDeque(const std::deque<T> &d)
{
    for (typename std::deque<T>::const_iterator it = d.begin(); it != d.end(); it++)
    {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
}
// 测试deque的构造函数
void test_deque_constructor()
{
    std::cout << "test deque constructor" << std::endl;
    std::deque<int> d1;
    for (int i = 0; i < 10; i++)
    {
        d1.push_back(i);
    }
    printDeque<int>(d1); // 0 1 2 3 4 5 6 7 8 9

    std::deque<int> d2(d1.begin(), d1.end());
    printDeque<int>(d2); // 0 1 2 3 4 5 6 7 8 9

    std::deque<int> d3(10, 100);
    printDeque<int>(d3); // 100 100 100 100 100 100 100 100 100 100

    std::deque<int> d4(d3);
    printDeque<int>(d4); // 100 100 100 100 100 100 100 100 100 100
}
```

#### deque赋值操作

**功能描述：**

- 给`deque`容器进行赋值

**函数原型：**

- `deque& operator=(const deque &deq);`  //重载等号操作符
- `assign(beg, end);` //将`[beg, end)`区间中的数据拷贝赋值给本身。
- `assign(n, elem);` //将n个elem拷贝赋值给本身。

**示例：**

```cpp
// 赋值操作
void test_deque_assign()
{
    std::deque<int> d1;
    for (int i = 0; i < 10; i++)
    {
        d1.push_back(i);
    }
    printDeque(d1); // 0 1 2 3 4 5 6 7 8 9

    std::deque<int> d2;
    d2 = d1;
    printDeque(d2); // 0 1 2 3 4 5 6 7 8 9

    std::deque<int> d3;
    d3.assign(d1.begin(), d1.end());
    printDeque(d3); // 0 1 2 3 4 5 6 7 8 9

    std::deque<int> d4;
    d4.assign(10, 100);
    printDeque(d4); // 100 100 100 100 100 100 100 100 100 100
}
```

#### deque大小操作

**功能描述：**

- 对deque容器的大小进行操作

**函数原型：**

- `deque.empty();` //判断容器是否为空
- `deque.size();` //返回容器中元素的个数
- `deque.resize(num);` //重新指定容器的长度为num,若容器变长，则以默认值填充新位置。
  ​ //如果容器变短，则末尾超出容器长度的元素被删除。
- `deque.resize(num, elem);` //重新指定容器的长度为num,若容器变长，则以elem值填充新位置。
  ​ //如果容器变短，则末尾超出容器长度的元素被删除。​

**示例：**

```cpp
// 测试deque大小操作
void test_deque_size()
{
    std::deque<int> d1;
    for (int i = 0; i < 10; i++)
    {
        d1.push_back(i);
    }
    printDeque(d1); // 0 1 2 3 4 5 6 7 8 9
    if (d1.empty())
    {
        std::cout << "d1 empty" << std::endl;
    }
    else
    {
        std::cout << "d1 not empty" << std::endl;
        std::cout << "d1 size=" << d1.size() << std::endl;
    }
    // 重新指定大小
    d1.resize(15);
    printDeque(d1); // 0 1 2 3 4 5 6 7 8 9 0 0 0 0 0
    d1.resize(5);
    printDeque(d1); // 0 1 2 3 4
}
```

总结：

- deque没有容量的概念
- 判断是否为空 --- empty
- 返回元素个数 --- size
- 重新指定个数 --- resize

#### deque 插入和删除

**功能描述：**

- 向deque容器中插入和删除数据

**函数原型：**

两端插入操作：

- `push_back(elem);` //在容器尾部添加一个数据
- `push_front(elem);` //在容器头部插入一个数据
- `pop_back();` //删除容器最后一个数据
- `pop_front();` //删除容器第一个数据

指定位置操作：

- `insert(pos,elem);` //在pos位置插入一个elem元素的拷贝，返回新数据的位置。
- `insert(pos,n,elem);` //在pos位置插入n个elem数据，无返回值。
- `insert(pos,beg,end);` //在pos位置插入`[beg,end)`区间的数据，无返回值。
- `clear();` //清空容器的所有数据
- `erase(beg,end);` //删除`[beg,end)`区间的数据，返回下一个数据的位置。
- `erase(pos);` //删除pos位置的数据，返回下一个数据的位置。

**示例：**

```cpp
//两端操作
void test01()
{
	deque<int> d;
	//尾插
	d.push_back(10);
	d.push_back(20);
	//头插
	d.push_front(100);
	d.push_front(200);

	printDeque(d);

	//尾删
	d.pop_back();
	//头删
	d.pop_front();
	printDeque(d);
}

//插入
void test02()
{
	deque<int> d;
	d.push_back(10);
	d.push_back(20);
	d.push_front(100);
	d.push_front(200);
	printDeque(d);

	d.insert(d.begin(), 1000);
	printDeque(d);

	d.insert(d.begin(), 2,10000);
	printDeque(d);

	deque<int>d2;
	d2.push_back(1);
	d2.push_back(2);
	d2.push_back(3);

	d.insert(d.begin(), d2.begin(), d2.end());
	printDeque(d);
}

//删除
void test03()
{
	deque<int> d;
	d.push_back(10);
	d.push_back(20);
	d.push_front(100);
	d.push_front(200);
	printDeque(d);

	d.erase(d.begin());
	printDeque(d);

	d.erase(d.begin(), d.end());
	d.clear();
	printDeque(d);
}
```

总结：

- 插入和删除提供的位置是迭代器！
- 尾插 --- push_back
- 尾删 --- pop_back
- 头插 --- push_front
- 头删 --- pop_front

#### deque 数据存取

**功能描述：**

- 对deque 中的数据的存取操作

**函数原型：**

- `at(int idx);`  //返回索引idx所指的数据
- `operator[];`  //返回索引idx所指的数据
- `front();`  //返回容器中第一个数据元素
- `back();` //返回容器中最后一个数据元素

**示例：**

```cpp
//数据存取
void test01()
{
	deque<int> d;
	d.push_back(10);
	d.push_back(20);
	d.push_front(100);
	d.push_front(200);
	for (int i = 0; i < d.size(); i++) {
		cout << d[i] << " ";
	}
	cout << endl;
	for (int i = 0; i < d.size(); i++) {
		cout << d.at(i) << " ";
	}
	cout << endl;
	cout << "front:" << d.front() << endl;
	cout << "back:" << d.back() << endl;
}
```

总结：

- 除了用迭代器获取deque容器中元素，`[]`和`at`也可以
- `front`返回容器第一个元素
- `back`返回容器最后一个元素

#### deque 排序

**功能描述：**

- 利用算法实现对deque容器进行排序

**算法：**

- `sort(iterator beg, iterator end)` //对beg和end区间内元素进行排序

**示例：**

```cpp
void test01()
{

	deque<int> d;
	d.push_back(10);
	d.push_back(20);
	d.push_front(100);
	d.push_front(200);

	printDeque(d);
	sort(d.begin(), d.end());
	printDeque(d);

}
```

总结：`sort`算法非常实用，使用时包含头文件`algorithm`即可

### `std::stack` 栈

#### stack 概述

**stack是一种先进后出**(First In Last Out,FILO)的数据结构，它只有一个出口
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405041157093.png)
栈中只有顶端的元素才可以被外界使用，因此栈不允许有遍历行为

栈中进入数据称为 --- **入栈** `push`
栈中弹出数据称为 --- **出栈** `pop`

#### stack 常用接口

构造函数：

- `stack<T> stk;` //stack采用模板类实现， stack对象的默认构造形式
- `stack(const stack &stk);` //拷贝构造函数

赋值操作：

- `stack& operator=(const stack &stk);` //重载等号操作符

数据存取：

- `push(elem);` //向栈顶添加元素
- `pop();` //从栈顶移除第一个元素
- `top();`  //返回栈顶元素

大小操作：

- `empty();` //判断堆栈是否为空
- `size();`  //返回栈的大小

**示例：**

```cpp
//栈容器常用接口
void test01()
{
	//创建栈容器 栈容器必须符合先进后出
	stack<int> s;

	//向栈中添加元素，叫做 压栈 入栈
	s.push(10);
	s.push(20);
	s.push(30);

	while (!s.empty()) {
		//输出栈顶元素
		cout << "栈顶元素为： " << s.top() << endl;
		//弹出栈顶元素
		s.pop();
	}
	cout << "栈的大小为：" << s.size() << endl;
}
```

**总结：**

- 入栈 --- `push`
- 出栈 --- `pop`
- 返回栈顶 --- `top`
- 判断栈是否为空 --- `empty`
- 返回栈大小 --- `size`

### `std::queue` 队列

#### queue 概述

**Queue是一种先进先出**(First In First Out,FIFO)的数据结构，它有两个出口
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405041159823.png)
队列容器允许从一端新增元素，从另一端移除元素

队列中只有队头和队尾才可以被外界使用，因此队列不允许有遍历行为

队列中进数据称为 --- **入队** `push`
队列中出数据称为 --- **出队** `pop`

#### queue 常用接口

构造函数：

- `queue<T> que;` //queue采用模板类实现，queue对象的默认构造形式
- `queue(const queue &que);` //拷贝构造函数

赋值操作：

- `queue& operator=(const queue &que);` //重载等号操作符

数据存取：

- `push(elem);` //往队尾添加元素
- `pop();` //从队头移除第一个元素
- `back();` //返回最后一个元素
- `front();`  //返回第一个元素

大小操作：

- `empty();` //判断堆栈是否为空
- `size();`  //返回栈的大小

**示例：**

```cpp
void test01() {
	//创建队列
	queue<Person> q;
	//准备数据
	Person p1("唐僧", 30);
	Person p2("孙悟空", 1000);
	Person p3("猪八戒", 900);
	Person p4("沙僧", 800);
	//向队列中添加元素  入队操作
	q.push(p1);
	q.push(p2);
	q.push(p3);
	q.push(p4);
	//队列不提供迭代器，更不支持随机访问	
	while (!q.empty()) {
		//输出队头元素
		cout << "队头元素-- 姓名： " << q.front().m_Name 
              << " 年龄： "<< q.front().m_Age << endl;
		cout << "队尾元素-- 姓名： " << q.back().m_Name  
              << " 年龄： " << q.back().m_Age << endl;
		cout << endl;
		//弹出队头元素
		q.pop();
	}
	cout << "队列大小为：" << q.size() << endl;
}
```

总结：

- 入队 --- push
- 出队 --- pop
- 返回队头元素 --- front
- 返回队尾元素 --- back
- 判断队是否为空 --- empty
- 返回队列大小 --- size

> 元素的次序是由所存储的数据的某个值排列的一种队列

```c
//最大的在队首
priority_queue< int, vector<int>, less<int> > pq1;
pq1.push(11);
pq1.push(2);
pq1.push(21);
pq1.push(4);
cout<< "top:" << pq1.top() << endl;

//vector 承载底层数据结构堆的容器
//less 表示数字大的优先级高，而 greater 表示数字小的优先级高
//less  	 让优先队列总是把最大的元素放在队首
//greater    让优先队列总是把最小的元素放在队首

//less和greater都是一个模板结构体 也可以自定义
```

自定义

```c
class Student {
public:
	int grade;
	Student(int grade):grade(grade) {
	}
};
struct cmp {
	bool operator ()(Student* s1, Student* s2) {
        // > 从小到大
        // < 从大到小 
		return s1->grade > s2->grade;
	}
	bool operator ()(Student s1, Student s2) {
		return s1.grade > s2.grade;
	}
};
priority_queue<Student*, vector<Student*>, cmp > q1;
q1.push(new Student(2));
q1.push(new Student(1));
q1.push(new Student(3));
cout << q1.top()->grade << endl;
```

### `std::list`

#### list 概述

**功能：** 将数据进行链式存储

**链表**（list）是一种物理存储单元上非连续的存储结构，数据元素的逻辑顺序是通过链表中的指针链接实现的

链表的组成：链表由一系列**结点**组成

结点的组成：一个是存储数据元素的**数据域**，另一个是存储下一个结点地址的**指针域**

STL中的链表是一个双向循环链表
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405041206740.png)

由于链表的存储方式并不是连续的内存空间，因此链表list中的迭代器只支持前移和后移，属于**双向迭代器**

**list的优点：**

- 采用动态存储分配，不会造成内存浪费和溢出
- 链表执行插入和删除操作十分方便，修改指针即可，不需要移动大量元素

**list的缺点：**

- 链表灵活，但是空间(指针域) 和 时间（遍历）额外耗费较大

List有一个重要的性质，插入操作和删除操作都不会造成原有list迭代器的失效，这在vector是不成立的。

总结：STL中**List和vector是两个最常被使用的容器**，各有优缺点

#### list构造函数

**函数原型：**

- `list<T> lst;` //list采用采用模板类实现,对象的默认构造形式：
- `list(beg,end);` //构造函数将`[beg, end)`区间中的元素拷贝给本身。
- `list(n,elem);` //构造函数将n个elem拷贝给本身。
- `list(const list &lst);` //拷贝构造函数。

**示例：**

```cpp
#include <list>
void printList(const list<int>& L) {

	for (list<int>::const_iterator it = L.begin(); it != L.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;
}

void test01()
{
	list<int> L1;
	L1.push_back(10);
	L1.push_back(20);
	L1.push_back(30);
	L1.push_back(40);

	printList(L1);

	list<int> L2(L1.begin(),L1.end());
	printList(L2);

	list<int> L3(L2);
	printList(L3);

	list<int> L4(10, 1000);
	printList(L4);
}
```

#### list 赋值和交换

**功能描述：**

- 给list容器进行赋值，以及交换list容器

**函数原型：**

- `assign(beg, end);` //将`[beg, end)`区间中的数据拷贝赋值给本身。
- `assign(n, elem);` //将n个elem拷贝赋值给本身。
- `list& operator=(const list &lst);` //重载等号操作符
- `swap(lst);` //将lst与本身的元素互换。

**示例：**

```cpp
//赋值和交换
void test01()
{
	list<int>L1;
	L1.push_back(10);
	L1.push_back(20);
	L1.push_back(30);
	L1.push_back(40);
	printList(L1);

	//赋值
	list<int>L2;
	L2 = L1;
	printList(L2);

	list<int>L3;
	L3.assign(L2.begin(), L2.end());
	printList(L3);

	list<int>L4;
	L4.assign(10, 100);
	printList(L4);

}

//交换
void test02()
{
	list<int>L1;
	L1.push_back(10);
	L1.push_back(20);
	L1.push_back(30);
	L1.push_back(40);

	list<int>L2;
	L2.assign(10, 100);

	cout << "交换前： " << endl;
	printList(L1);
	printList(L2);

	cout << endl;

	L1.swap(L2);

	cout << "交换后： " << endl;
	printList(L1);
	printList(L2);
}
```

#### list 大小操作

**功能描述：**

- 对list容器的大小进行操作

**函数原型：**

- `size();`  //返回容器中元素的个数
- `empty();`  //判断容器是否为空
- `resize(num);` //重新指定容器的长度为num，若容器变长，则以默认值填充新位置。
  ​ //如果容器变短，则末尾超出容器长度的元素被删除。
- `resize(num, elem);`  //重新指定容器的长度为 num，若容器变长，则以 elem 值填充新位置。//如果容器变短，则末尾超出容器长度的元素被删除。

**示例：**

```cpp
//大小操作
void test01()
{
	list<int>L1;
	L1.push_back(10);
	L1.push_back(20);
	L1.push_back(30);
	L1.push_back(40);
	if (L1.empty())
	{
		cout << "L1为空" << endl;
	}
	else
	{
		cout << "L1不为空" << endl;
		cout << "L1的大小为： " << L1.size() << endl;
	}
	//重新指定大小
	L1.resize(10);
	printList(L1);

	L1.resize(2);
	printList(L1);
}
```

#### list 插入和删除

**功能描述：**

- 对list容器进行数据的插入和删除

**函数原型：**

- `push_back(elem)`;//在容器尾部加入一个元素
- `pop_back()`;//删除容器中最后一个元素
- `push_front(elem)`;//在容器开头插入一个元素
- `pop_front()`;//从容器开头移除第一个元素
- `insert(pos,elem)`;//在pos位置插elem元素的拷贝，返回新数据的位置。
- `insert(pos,n,elem)`;//在pos位置插入n个elem数据，无返回值。
- `insert(pos,beg,end)`;//在pos位置插入`[beg,end)`区间的数据，无返回值。
- `clear()`;//移除容器的所有数据
- `erase(beg,end)`;//删除`[beg,end)`区间的数据，返回下一个数据的位置。
- `erase(pos)`;//删除pos位置的数据，返回下一个数据的位置。
- `remove(elem)`;//删除容器中所有与elem值匹配的元素。

**示例：**

```cpp
//插入和删除
void test01()
{
	list<int> L;
	//尾插
	L.push_back(10);
	L.push_back(20);
	L.push_back(30);
	//头插
	L.push_front(100);
	L.push_front(200);
	L.push_front(300);

	printList(L);

	//尾删
	L.pop_back();
	printList(L);

	//头删
	L.pop_front();
	printList(L);

	//插入
	list<int>::iterator it = L.begin();
	L.insert(++it, 1000);
	printList(L);

	//删除
	it = L.begin();
	L.erase(++it);
	printList(L);

	//移除
	L.push_back(10000);
	L.push_back(10000);
	L.push_back(10000);
	printList(L);
	L.remove(10000);
	printList(L);
    
    //清空
	L.clear();
	printList(L);
}
```

**总结：**

- 尾插 --- push_back
- 尾删 --- pop_back
- 头插 --- push_front
- 头删 --- pop_front
- 插入 --- insert
- 删除 --- erase
- 移除 --- remove
- 清空 --- clear

#### list 数据存取

**功能描述：**

- 对list容器中数据进行存取

**函数原型：**

- `front();` //返回第一个元素。
- `back();` //返回最后一个元素。

**示例：**

```cpp
//数据存取
void test01()
{
	list<int>L1;
	L1.push_back(10);
	L1.push_back(20);
	L1.push_back(30);
	L1.push_back(40);
	
	//cout << L1.at(0) << endl;//错误 不支持at访问数据
	//cout << L1[0] << endl; //错误  不支持[]方式访问数据
	cout << "第一个元素为： " << L1.front() << endl;
	cout << "最后一个元素为： " << L1.back() << endl;

	//list容器的迭代器是双向迭代器，不支持随机访问
	list<int>::iterator it = L1.begin();
	//it = it + 1;//错误，不可以跳跃访问，即使是+1
}
```

**总结：**

- list容器中不可以通过`[]`或者`at`方式访问数据
- 返回第一个元素 --- `front`
- 返回最后一个元素 --- `back`

#### list 反转和排序

**功能描述：**

- 将容器中的元素反转，以及将容器中的数据进行排序

**函数原型：**

- `reverse();` //反转链表
- `sort();` //链表排序

**示例：**

```cpp
bool myCompare(int val1 , int val2)
{
	return val1 > val2;
}

//反转和排序
void test01()
{
	list<int> L;
	L.push_back(90);
	L.push_back(30);
	L.push_back(20);
	L.push_back(70);
	printList(L);

	//反转容器的元素
	L.reverse();
	printList(L);

	//排序
	L.sort(); //默认的排序规则 从小到大
	printList(L);

	L.sort(myCompare); //指定规则，从大到小
	printList(L);
}
```

**总结：**

- 反转 --- reverse
- 排序 --- sort （成员函数）

## 关联式容器 Associative Containers

关联式容器根据键来组织数据，而不是保持数据的插入顺序。它们使用**比较函数**（比如 <）来组织元素，确保元素保持排序状态，这样可以快速检索。主要有以下几种：

- `std::set`:
  元素集合，只包含键，不包含值。每个键只能出现一次，不允许重复。

- `std::multiset`:
  类似于 std::set，但允许键重复出现。

- `std::map`:
  键值对集合，键是独一无二的。每个键只映射到单一的值。

- `std::multimap`:
  类似于 std::map，但同一个键可以映射到多个值，允许键的重复出现。

关联式容器内部通常由一个平衡二叉树实现（如红黑树）。

### `std::set` 和 `std::multiset`

#### set 概述

**简介：**

- 所有元素都会在插入时自动被排序

**本质：**

- set/multiset属于**关联式容器**，底层结构是用**二叉树**实现。

**set和multiset区别**：

- set不允许容器中有重复的元素
- multiset允许容器中有重复的元素

#### set构造和赋值

功能描述：创建set容器以及赋值

构造：

- `set<T> st;` //默认构造函数：
- `set(const set &st);` //拷贝构造函数

赋值：

- `set& operator=(const set &st);` //重载等号操作符

**示例：**

```cpp
void printSet(set<int> &s)
{
    for (set<int>::iterator it = s.begin(); it != s.end(); it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}
void test_set_constructor() {
    set<int> s1;
    s1.insert(10);
    s1.insert(30);
    s1.insert(20);
    s1.insert(40);
    s1.insert(50);
    printSet(s1); // 10 20 30 40 50

    // 拷贝构造
    set<int> s2(s1);
    printSet(s2); // 10 20 30 40 50

    // 赋值
    set<int> s3;
    s3 = s1;
    printSet(s3); // 10 20 30 40 50

    // 区间构造
    set<int> s4(s1.begin(), s1.end());
    printSet(s4); // 10 20 30 40 50

    // 重载=赋值，区间构造
    set<int> s5;
    s5 = set<int>(s1.begin(), s1.end());
    printSet(s5); // 10 20 30 40 50

    // 重载=赋值，初始化列表
    set<int> s6;
    s6 = {1, 2, 3, 4, 5};
    printSet(s6); // 1 2 3 4 5

    // 重载=赋值，自动排序
    set<int> s7;
    s7 = {5, 4, 3, 2, 1};
    printSet(s7); // 1 2 3 4 5

    // 重载=赋值，去重
    set<int> s8;
    s8 = {5, 4, 3, 2, 1, 1, 2, 3, 4, 5};
    printSet(s8); //set会去重： 1 2 3 4 5 如果是multiset 不会去重：1 1 2 2 3 3 4 4 5 5
}
```

**总结：**

- `set`容器插入数据时用insert
- `set`容器插入数据的数据会自动排序
- `multiset` 和 `set` 用法基本一致，和 `set` 区别是 `multiset` 不会去重

#### set大小和交换

**功能描述：**

- 统计set容器大小以及交换set容器

**函数原型：**

- `size();` //返回容器中元素的数目
- `empty();` //判断容器是否为空
- `swap(st);` //交换两个集合容器

**示例：**

```cpp
//大小
void test01()
{
	set<int> s1;
	s1.insert(10);
	s1.insert(30);
	s1.insert(20);
	s1.insert(40);

	if (s1.empty())
	{
		cout << "s1为空" << endl;
	}
	else
	{
		cout << "s1不为空" << endl;
		cout << "s1的大小为： " << s1.size() << endl;
	}
}

//交换
void test02()
{
	set<int> s1;
	s1.insert(10);
	s1.insert(30);
	s1.insert(20);
	s1.insert(40);

	set<int> s2;
	s2.insert(100);
	s2.insert(300);
	s2.insert(200);
	s2.insert(400);

	cout << "交换前" << endl;
	printSet(s1);
	printSet(s2);
	cout << endl;

	cout << "交换后" << endl;
	s1.swap(s2);
	printSet(s1);
	printSet(s2);
}
```

**总结：**

- 统计大小 --- size
- 判断是否为空 --- empty
- 交换容器 --- swap

#### set插入和删除

**功能描述：**

- set容器进行插入数据和删除数据

**函数原型：**

- `insert(elem);` //在容器中插入元素。
- `clear();` //清除所有元素
- `erase(pos);` //删除pos迭代器所指的元素，返回下一个元素的迭代器。
- `erase(beg, end);` //删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
- `erase(elem);` //删除容器中值为elem的元素。

**示例：**

```cpp
//插入和删除
void test01()
{
	set<int> s1;
	//插入
	s1.insert(10);
	s1.insert(30);
	s1.insert(20);
	s1.insert(40);
	printSet(s1);

	//删除
	s1.erase(s1.begin());
	printSet(s1);

	s1.erase(30);
	printSet(s1);

	//清空
	//s1.erase(s1.begin(), s1.end());
	s1.clear();
	printSet(s1);
}
```

#### set查找和统计

**功能描述：**

- 对set容器进行查找数据以及统计数据

**函数原型：**

- `find(key);` //查找key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回`set.end()`;
- `count(key);` //统计key的元素个数

**示例：**

```cpp
//查找和统计
void test01()
{
	set<int> s1;
	//插入
	s1.insert(10);
	s1.insert(30);
	s1.insert(20);
	s1.insert(40);
	//查找
	set<int>::iterator pos = s1.find(30);
	if (pos != s1.end())
	{
		cout << "找到了元素 ： " << *pos << endl;
	}
	else
	{
		cout << "未找到元素" << endl;
	}
	//统计
	int num = s1.count(30);
}
```

#### set和multiset区别

**区别：**

- set不可以插入重复数据，而multiset可以
- set插入数据的同时会返回插入结果，表示插入是否成功
- multiset不会检测数据，因此可以插入重复数据

**示例：**

```cpp
//set和multiset区别
void test01()
{
	set<int> s;
	pair<set<int>::iterator, bool>  ret = s.insert(10);
	if (ret.second) {
		cout << "第一次插入成功!" << endl;
	}
	else {
		cout << "第一次插入失败!" << endl;
	}

	ret = s.insert(10);
	if (ret.second) {
		cout << "第二次插入成功!" << endl;
	}
	else {
		cout << "第二次插入失败!" << endl;
	}
    
	//multiset
	multiset<int> ms;
	ms.insert(10);
	ms.insert(10);

	for (multiset<int>::iterator it = ms.begin(); it != ms.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;
}
```

**总结：**

- 如果不允许插入重复数据可以利用set
- 如果需要插入重复数据利用multiset

#### pair对组创建

**功能描述：**

- 成对出现的数据，利用对组可以返回两个数据

**两种创建方式：**

- `pair<type, type> p ( value1, value2 );`
- `pair<type, type> p = make_pair( value1, value2 );`

**示例：**

```cpp
#include <string>
//对组创建
void test01()
{
	pair<string, int> p(string("Tom"), 20);
	cout << "姓名： " <<  p.first << " 年龄： " << p.second << endl;

	pair<string, int> p2 = make_pair("Jerry", 10);
	cout << "姓名： " << p2.first << " 年龄： " << p2.second << endl;
}
```

#### set容器排序

set 容器默认排序规则为从小到大。

**示例一：** set 存放内置数据类型，利用仿函数可以指定set容器的排序规则

```cpp
#include <set>
class MyCompare 
{
public:
	bool operator()(int v1, int v2) {
		return v1 > v2;
	}
};
void test01() 
{    
	set<int> s1;
	s1.insert(10);
	s1.insert(40);
	s1.insert(20);
	s1.insert(30);
	s1.insert(50);

	//默认从小到大
	for (set<int>::iterator it = s1.begin(); it != s1.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;

	//指定排序规则
	set<int, MyCompare> s2;
	s2.insert(10);
	s2.insert(40);
	s2.insert(20);
	s2.insert(30);
	s2.insert(50);

	for (set<int, MyCompare>::iterator it = s2.begin(); it != s2.end(); it++) {
		cout << *it << " ";
	}
	cout << endl;
}
```

**示例二** set 存放自定义数据类型，自定义数据类型，set必须指定排序规则才可以插入数据

```cpp
#include <set>
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
class comparePerson
{
public:
	bool operator()(const Person& p1, const Person &p2)
	{
		//按照年龄进行排序  降序
		return p1.m_Age > p2.m_Age;
	}
};

void test01()
{
	set<Person, comparePerson> s;

	Person p1("刘备", 23);
	Person p2("关羽", 27);
	Person p3("张飞", 25);
	Person p4("赵云", 21);

	s.insert(p1);
	s.insert(p2);
	s.insert(p3);
	s.insert(p4);

	for (set<Person, comparePerson>::iterator it = s.begin(); it != s.end(); it++)
	{
		cout << "姓名： " << it->m_Name << " 年龄： " << it->m_Age << endl;
	}
}
```

#### `std::set` 原理

`std::set` 属于 C++ STL（Standard Template Library）中的关联式容器（Associative Containers）。关联式容器内部通常由一个**平衡二叉树**实现（如红黑树）
`std::set` 容器维护着一个**有序**的数据集合，并确保每个元素只出现一次（唯一性）。由于内部的数据是有序的，`std::set` 允许快速地查找和访问元素。在标准库实现中，`std::set` 通常是被实现为一种自平衡二叉搜索树，即红黑树

相关操作，如插入、删除和查找元素的平均时间复杂度为 `O(log n)`，使得 `std::set` 成为当需要快速查找和保持集合元素唯一及有序时的理想选择。然而，由于元素是有序的，`std::set` 并不适用于要求保持元素插入顺序的情况。

对于无序的唯一元素集合，可以使用 `std::unordered_set`，它基于哈希表实现，通常提供更快的查询速度（平均时间复杂度为 O(1)），但不保证元素的顺序。

### `std::map` 和 `std::multimap` (键值对)

#### map 概述

**简介：**

- map中所有元素都是pair
- pair中第一个元素为key（键值），起到索引作用，第二个元素为value（实值）
- 所有元素都会根据元素的键值自动排序

**本质：**

- map/multimap属于**关联式容器**，底层结构是用二叉树实现。

**优点：**

- 可以根据key值快速找到value值

map和multimap**区别**：

- map不允许容器中有重复key值元素
- multimap允许容器中有重复key值元素

#### map构造和赋值

**功能描述：**

- 对map容器进行构造和赋值操作

**函数原型：**

**构造：**

- `map<T1, T2> mp;` //map默认构造函数:
- `map(const map &mp);` //拷贝构造函数

**赋值：**

- `map& operator=(const map &mp);` //重载等号操作符

**示例：**

```cpp
#include <map>
void printMap(map<int,int>&m)
{
	for (map<int, int>::iterator it = m.begin(); it != m.end(); it++)
	{
		cout << "key = " << it->first << " value = " << it->second << endl;
	}
	cout << endl;
}
void test01()
{
	map<int,int>m; //默认构造
	m.insert(pair<int, int>(1, 10));
	m.insert(pair<int, int>(2, 20));
	m.insert(pair<int, int>(3, 30));
	printMap(m);

	map<int, int>m2(m); //拷贝构造
	printMap(m2);

	map<int, int>m3;
	m3 = m2; //赋值
	printMap(m3);
}
```

#### map大小和交换

**功能描述：**

- 统计map容器大小以及交换map容器

函数原型：

- `size();` //返回容器中元素的数目
- `empty();` //判断容器是否为空
- `swap(st);` //交换两个集合容器

**示例：**

```cpp
void test01()
{
	map<int, int>m;
	m.insert(pair<int, int>(1, 10));
	m.insert(pair<int, int>(2, 20));
	m.insert(pair<int, int>(3, 30));
	if (m.empty())
	{
		cout << "m为空" << endl;
	}
	else
	{
		cout << "m不为空" << endl;
		cout << "m的大小为： " << m.size() << endl;
	}
}
//交换
void test02()
{
	map<int, int>m;
	m.insert(pair<int, int>(1, 10));
	m.insert(pair<int, int>(2, 20));
	m.insert(pair<int, int>(3, 30));

	map<int, int>m2;
	m2.insert(pair<int, int>(4, 100));
	m2.insert(pair<int, int>(5, 200));
	m2.insert(pair<int, int>(6, 300));

	cout << "交换前" << endl;
	printMap(m);
	printMap(m2);

	cout << "交换后" << endl;
	m.swap(m2);
	printMap(m);
	printMap(m2);
}
```

#### map插入和删除

**功能描述：**

- map容器进行插入数据和删除数据

**函数原型：**

- `insert(elem);` //在容器中插入元素。
- `clear();` //清除所有元素
- `erase(pos);` //删除pos迭代器所指的元素，返回下一个元素的迭代器。
- `erase(beg, end);` //删除区间`[beg,end)`的所有元素 ，返回下一个元素的迭代器。
- `erase(key);` //删除容器中值为key的元素。

**示例：**

```cpp
void test01()
{
	//插入
	map<int, int> m;
	//第一种插入方式
	m.insert(pair<int, int>(1, 10));
	//第二种插入方式
	m.insert(make_pair(2, 20));
	//第三种插入方式
	m.insert(map<int, int>::value_type(3, 30));
	//第四种插入方式
	m[4] = 40; 
	printMap(m);

	//删除
	m.erase(m.begin());
	printMap(m);

	m.erase(3);
	printMap(m);

	//清空
	m.erase(m.begin(),m.end());
	m.clear();
	printMap(m);
}
```

#### map查找和统计

**功能描述：**

- 对map容器进行查找数据以及统计数据

**函数原型：**

- `find(key);` //查找key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end();
- `count(key);` //统计key的元素个数

**示例：**

```cpp
#include <map>
//查找和统计
void test01()
{
	map<int, int>m; 
	m.insert(pair<int, int>(1, 10));
	m.insert(pair<int, int>(2, 20));
	m.insert(pair<int, int>(3, 30));
	//查找
	map<int, int>::iterator pos = m.find(3);
	if (pos != m.end())
	{
		cout << "找到了元素 key = " << (*pos).first << " value = " << (*pos).second << endl;
	}
	else
	{
		cout << "未找到元素" << endl;
	}
	//统计
	int num = m.count(3);
	cout << "num = " << num << endl;
}
```

**总结：**

- 查找 --- find （返回的是迭代器）
- 统计 --- count （对于map，结果为0或者1）

#### map容器排序

map 容器默认排序规则为按照 key 值进行从小到大排序。

**示例：** 利用仿函数，可以改变排序规则

```cpp
#include <map>
class MyCompare {
public:
	bool operator()(int v1, int v2) {
		return v1 > v2;
	}
};
void test01() 
{
	//默认从小到大排序
	//利用仿函数实现从大到小排序
	map<int, int, MyCompare> m;

	m.insert(make_pair(1, 10));
	m.insert(make_pair(2, 20));
	m.insert(make_pair(3, 30));
	m.insert(make_pair(4, 40));
	m.insert(make_pair(5, 50));

	for (map<int, int, MyCompare>::iterator it = m.begin(); it != m.end(); it++) {
		cout << "key:" << it->first << " value:" << it->second << endl;
	}
}
```

**总结：**

- 利用仿函数可以指定map容器的排序规则
- 对于自定义数据类型，map 必须要指定排序规则，同 set 容器

#### 其他

> unordered_map c++11取代hash_map（哈希表实现，无序）
>
> 哈希表实现查找速度会比RB树实现快,但rb整体更节省内存
>
> 需要无序容器，高频快速查找删除，数据量较大用unordered_map；
>
> 需要有序容器，查找删除频率稳定，在意内存时用map。

## 无序关联式容器（Unordered Associative Containers）

无序的**关联式容器**也是基于键来存储元素，但不是按照排序的顺序，而是根据内部哈希表组织。这意味着元素的检索通常比关联式容器更快，但遍历时元素的顺序是不确定的。主要有以下几种：

- `std::unordered_set`：
  基于哈希表的集合，键不重复。

- `std::unordered_multiset`：
  基于哈希表的集合，允许键重复。

- `std::unordered_map`：
  基于哈希表的键值对映射，键是唯一的。

- `std::unordered_multimap`：
  基于哈希表的键值对映射，允许键重复。

有序的关联容器一般是基于平衡二叉树实现的，而无序关联容器基于哈希表实现的。
无序容器的性能依赖于哈希函数的质量和冲突解决机制。

## 其他容器

### `std::priority_queue`

`std::priority_queu`e 是 C++ 标准模板库 (STL) 中的一个容器适配器，它提供了队列的接口，其中的元素被按优先级排序。这意味着`std::priority_queue`允许你以一个固定顺序插入元素，而从队列中取出元素时，总是先得到具有最高优先级的元素（默认情况下是最大元素）。

在实际的实现中，`std::priority_queue` 通常使用 `std::vector` 作为底层容器，配合堆算法（如 `std::make_heap`、`std::push_heap` 和 `std::pop_heap`）来管理元素。正是这些堆操作保证了队列顶部始终是最大（或最小，取决于比较函数）的元素。

`std::priority_queue` **不属于序列式容器或关联式容器**。相反，它是一个容器适配器，类似于 `std::stack` 和 `std::queue`，用于为底层容器提供特定的接口。虽然 `std::priority_queue` 提供类似于队列的接口，但它不允许迭代遍历所有元素，因为堆的内部顺序并不是完全排序的顺序。

**示例：**

```cpp
#include <queue>

// 默认为大顶堆，最大元素总是在队列的前面
std::priority_queue<int> pq;

// 将元素按优先级插入队列
pq.push(10);
pq.push(5);
pq.push(20);

// 获取优先级最高的元素（20）
int top = pq.top();

// 删除优先级最高的元素
pq.pop();
```

如果你想创建一个最小元素优先的队列，可以提供自定义的比较函数：

```cpp
#include <queue>
#include <functional>
#include <vector>

// 创建一个小顶堆，最小元素优先
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;

min_pq.push(10);
min_pq.push(5);
min_pq.push(20);

// 获取优先级最高（此处为最低）的元素（5）
int top = min_pq.top();
```
