---
date_created: Saturday, April 27th 2017, 8:49:05 am
date_updated: Wednesday, January 22nd 2025, 11:49:56 pm
title: C语言的struct和union
author: hacket
categories:
  - C&C++
category: C
tags: [C]
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
date created: 2024-04-27 08:49
date updated: 2024-12-27 23:49
aliases: [C 语言结构体和联合体（共用体）]
linter-yaml-title-alias: C 语言结构体和联合体（共用体）
---

# C 语言结构体和联合体（共用体）

## 结构体 (struct)

### 结构体定义和使用

**语法：**`struct 结构体名 { 结构体成员列表 }；`

通过结构体创建变量的方式有三种：

- `struct 结构体名 变量名`
- `struct 结构体名 变量名 = { 成员1值 ， 成员2值…}`
- `定义结构体时顺便创建变量`

示例 1：

```cpp
#include <iostream>

using namespace std;

struct student
{

    // 成员列表
    std::string name; // 姓名
    int age;          // 年龄
    int score;        // 分数
} stu3;               // 结构体变量创建方式3

int main()
{
    // 结构体变量创建方式1
    struct student stu1; // struct 关键字可以省略

    stu1.name = "张三";
    stu1.age = 18;
    stu1.score = 100;

    cout << "姓名：" << stu1.name << " 年龄：" << stu1.age << " 分数：" << stu1.score << endl;

    // 结构体变量创建方式2
    struct student stu2 = {"李四", 19, 60};

    cout << "姓名：" << stu2.name << " 年龄：" << stu2.age << " 分数：" << stu2.score << endl;

    stu3.name = "王五";
    stu3.age = 18;
    stu3.score = 80;

    cout << "姓名：" << stu3.name << " 年龄：" << stu3.age << " 分数：" << stu3.score << endl;
    return 0;
}
```

> 总结 1：定义结构体时的关键字是 struct，不可省略
> 总结 2：创建结构体变量时，关键字 struct 可以省略
> 总结 3：结构体变量利用操作符 ''.'' 访问成员

- 示例 2：使用 typedef 定义 struct

```c
//Student 相当于类名
//student和a 可以不定义，表示结构变量，也就Student类型的变量
struct Student
{
	char name[50];
	int age;
} student,a;

//使用typedef定义
typedef struct{
    char name[50];
    int age;
} Student;
```

### 结构体数组

**作用：** 将自定义的结构体放入到数组中方便维护

**语法：** `struct 结构体名 数组名[元素个数] = { {} , {} , … {} }`

**示例：**

```cpp
//结构体定义
struct student
{
	//成员列表
	string name;  //姓名
	int age;      //年龄
	int score;    //分数
}

int main() {
	
	//结构体数组
	struct student arr[3]=
	{
		{"张三",18,80 },
		{"李四",19,60 },
		{"王五",20,70 }
	};

	for (int i = 0; i < 3; i++)
	{
		cout << "姓名：" << arr[i].name << " 年龄：" << arr[i].age << " 分数：" << arr[i].score << endl;
	}

	system("pause");

	return 0;
}
```

### 结构体指针

**作用：** 通过指针访问结构体中的成员

- 利用操作符 `->` 可以通过结构体指针访问结构体属性

```cpp
//结构体定义
struct student
{
	//成员列表
	string name;  //姓名
	int age;      //年龄
	int score;    //分数
};


int main() {
	
	struct student stu = { "张三",18,100, };
	
	struct student * p = &stu;
	
	p->score = 80; //指针通过 -> 操作符可以访问成员

	cout << "姓名：" << p->name << " 年龄：" << p->age << " 分数：" << p->score << endl;
	
	system("pause");

	return 0;
}
```

### 结构体嵌套结构体

**作用：** 结构体中的成员可以是另一个结构体

**例如：** 每个老师辅导一个学员，一个老师的结构体中，记录一个学生的结构体

```cpp
//学生结构体定义
struct student
{
	//成员列表
	string name;  //姓名
	int age;      //年龄
	int score;    //分数
};

//教师结构体定义
struct teacher
{
    //成员列表
	int id; //职工编号
	string name;  //教师姓名
	int age;   //教师年龄
	struct student stu; //子结构体 学生
};


int main() {

	struct teacher t1;
	t1.id = 10000;
	t1.name = "老王";
	t1.age = 40;

	t1.stu.name = "张三";
	t1.stu.age = 18;
	t1.stu.score = 100;

	cout << "教师 职工编号： " << t1.id << " 姓名： " << t1.name << " 年龄： " << t1.age << endl;
	
	cout << "辅导学员 姓名： " << t1.stu.name << " 年龄：" << t1.stu.age << " 考试分数： " << t1.stu.score << endl;

	system("pause");

	return 0;
}
```

### 结构体做函数参数

**作用：**将 结构体作为参数向函数中传递

传递方式有两种：

- 值传递
- 地址传递

示例：

```cpp
//学生结构体定义
struct student
{
	//成员列表
	string name;  //姓名
	int age;      //年龄
	int score;    //分数
};

//值传递
void printStudent(student stu)
{
	stu.age = 28;
	cout << "子函数中 姓名：" << stu.name << " 年龄： " << stu.age  << " 分数：" << stu.score << endl;
}

//地址传递
void printStudent2(student *stu)
{
	stu->age = 28;
	cout << "子函数中 姓名：" << stu->name << " 年龄： " << stu->age  << " 分数：" << stu->score << endl;
}

int main() {

	student stu = { "张三",18,100};
	//值传递
	printStudent(stu);
	cout << "主函数中 姓名：" << stu.name << " 年龄： " << stu.age << " 分数：" << stu.score << endl;

	cout << endl;

	//地址传递
	printStudent2(&stu);
	cout << "主函数中 姓名：" << stu.name << " 年龄： " << stu.age  << " 分数：" << stu.score << endl;

	system("pause");

	return 0;
}
```

如果不想修改主函数中的数据，用值传递，反之用地址传递。

### 结构体中 const 使用场景

**作用：** 用 const 来防止误操作

示例：

```cpp
//学生结构体定义
struct student
{
	//成员列表
	string name;  //姓名
	int age;      //年龄
	int score;    //分数
};

//const使用场景
void printStudent(const student *stu) //加const防止函数体中的误操作
{
	//stu->age = 100; //操作失败，因为加了const修饰
	cout << "姓名：" << stu->name << " 年龄：" << stu->age << " 分数：" << stu->score << endl;

}

int main() {

	student stu = { "张三",18,100 };

	printStudent(&stu);

	system("pause");

	return 0;
}
```

### 结构体字节对齐

结构体（struct）字节对齐是 C/C++ 编程中一个重要概念，它涉及到结构体成员在内存中如何排列。因为计算机硬件通常访问内存的方式是按照一定的字节块（通常是 4 或 8 字节）进行的，不正确的字节对齐会导致访问内存时的性能下降或者增加额外的内存读写操作。

字节对齐的规则主要有两条：

1. 结构体的首地址能整除其最大基本类型成员的大小:
   如果结构体有 int（通常是 4 字节），那么结构体的首地址也应该是 4 的倍数。

2. 结构体中每个成员相对于结构体首地址的偏移量（`offset`）都应能整除该成员的大小:
   如果有一个 int 类型的成员，那么从结构体开始到这个成员开始的字节数，必须是 4 的倍数。为此，编译器可能会在成员之间插入填充字节（padding）。

示例：

```cpp
struct Example {
    char a;        // 1 byte
    // 3 bytes padding
    int b;         // 4 bytes
    short c;       // 2 bytes
    // 2 bytes padding
};
```

> 在这个例子中，为了让 int b 的偏移量是 4 的倍数，编译器在 char a 和 int b 之间添加了 3 个字节的填充。同样的，为了让整个结构体的大小是最大成员大小（这里是 4 字节）的倍数，编译器在 short c 后面添加了 2 个字节的填充。

示例 2：

```cpp
struct MyStruct1
{
	short a; // 2B 
	int b; // 2B
	short c; // 4B
}; // 最长的是int，4B
struct MyStruct2
{
    short a;
	short c; 
	int b;
}; // 最长的是int，4B
//自然对齐
//1、某个变量存放的起始位置相对于结构的起始位置的偏移量是该变量字节数的整数倍；
//2、结构所占用的总字节数是结构中字节数最长的变量的字节数的整数倍。
// short = 2  补 2
// int = 4
// short = 2  补 2
sizeof(MyStruct1) = 12
// 2个short在一起组成一个 4 
sizeof(MyStruct2) = 8
```

#### 控制字节对齐

在编译时，可以通过指定打包对齐（`#pragma pack`）来控制结构体的字节对齐方式，例如：

示例 1：

```cpp
#pragma pack(push, 1) // 将当前对齐方式压栈，并设定新的对齐方式为1字节对齐
struct PackExample {
    char a;
    int b;
    short c;
};
#pragma pack(pop) // 恢复之前的对齐方式

// 这里 #pragma pack(1) 指令使得 PackExample 中不会有任何填充字节插入，每个成员都紧密排列，无论它的自然对齐是多少。
```

示例 2：

```c
#pragma pack(2) //指定以2字节对齐
struct MyStruct1
{
	short a;  
	int b;	
	short c; 
};
#pragma pack()	//取消对齐
//short = 2
//int = 4
//short = 2
```

**字节对齐的选择影响着结构体在内存中的实际占用和程序的性能。对齐时要权衡结构体的紧凑性与硬件访问效率。在嵌入式编程或网络编程中，为了减小内存或传输负载，通常会选择较小的对齐数。而在性能敏感的应用程序中，可能会选择与硬件访问对齐保持一致，以最大化数据访问速度。**

#### 结构体字节对齐作用？

- **提高内存访问效率：**

多数现代硬件平台访问对齐的内存比访问非对齐的内存更高效。如果数据是对齐的，处理器可以在较少的内存访问操作中读写数据。例如，在 32 位平台上，4 字节对齐的 int 数据可以在一个操作周期内完成读取，如果这个 int 数据没有对齐，可能需要两次读取操作，从而降低了效率。

- **避免硬件错误：**

有些处理器在访问非对齐内存时可能会产生硬件错误。在这种情况下对结构体进行正确的字节对齐就变得非常重要，否则程序可能无法运行。

- **兼容不同平台的要求：**

在结构体用于不同的平台或跨平台数据交换的时候，标准的对齐可以确保每一个平台都能正确地解读数据结构，例如，网络协议中的数据包通常是按照一定对齐规则构建的，以确保跨平台的数据一致性。

- **满足语言和编译器的要求：**

C/C++ 标准不定义特定的字节对齐规则，而是交给编译器来决定。大多数编译器选择的默认对齐方式目的是为了满足上述的效率和兼容性要求。

- **优化内存布局：**

通过考虑字节对齐，程序员可以优化数据结构的内存布局，减少因为对齐引入的填充字节，使得内存使用更加高效。

正确处理字节对齐是低级编程和系统编程中一个非常重要的细节，特别是在性能敏感、资源受限或需要与硬件直接交互的环境中。了解如何控制和利用字节对齐能够帮助开发更加可靠和高效的程序。

### 结构体动态内存分配

当结构体需要内存过大，使用动态内存申请。结构体占用字节数和结构体内字段有关，指针占用内存就是 4/8 字节，因此传指针比传值效率更高。

```c
struct Student *s = (Student*)malloc(sizeof(Student));
memset(s,0,sizeof(Student));
printf("%d\n", s->age);
```

## Union 联合体、共用体

- `union { };`，注意结尾有**分号**。
- 通常 union 是匿名使用的，但是匿名 union 不能含有成员函数
- 在可以使用**类型双关**的时候，使用 union 时，可读性更强。
- Union 的特点是**共用内存** 。可以像使用结构体或者类一样使用它们，也可以给它添加静态函数或者普通函数、方法等待。然而**不能使用虚方法**，还有其他一些限制。
- 在相同的内存位置存储不同的数据类型，内存地址是一样的。
- 共用体占用的内存应足够存储共用体中最大的成员

示例 1：

```c
//在相同的内存位置 存储不同的数据
//共用体 最大成员的字节大小
union MyUnion
{
	short i;
	int j;
};
int main() {
    union MyUnion mu;
	mu.i = 10;
	printf("i地址：%#x\n", &mu.i);
	printf("i地址：%#x\n", &mu.j);
	printf("%d\n", mu.i);
	printf("%d\n",mu.j); 
	
	mu.j = 11;
	printf("%d\n", mu.i);
	printf("%d\n", mu.j);
	
	//占用内存
	int i = 0;
	int j = 0;
	
	i = 10;
	//一直使用i
	// i不使用 使用j
	j = 10;
	
	return 0;
}
// 输出
i地址：0xececefc8
i地址：0xececefc8
10
122290186 // 如果先初始化int j，比short要长，那又不一样了。
11
11
```

示例 2：内存共享

```cpp
#include <iostream>
int main() {  
    union {  //匿名使用，不写名字
        float a;
        int b;
    };  
    a = 2.0f;  //共享内存，a被赋值了一个浮点数，整形的b也被复制了一个浮点数
    std::cout << a << '，' << b << std::endl;
    //输出： 2，107165123
    //原因：int b取了组成浮点数的内存，然后把它解释成一个整型（类型双关）
}
```

示例 3：配合类型双关

```cpp
#include <iostream>
struct Vector2
{
    float x, y;
};

struct Vector4
{
    union // 不写名称，作为匿名使用
    {
        struct //第一个Union成员
        {
            float x, y, z, w;
        };
        struct // 第二个Union成员，与第一个成员共享内存
        {
            Vector2 a, b;//a和x，y的内存共享，b和z，w的内存共享
        };
    };
};

void PrintVector2(const Vector2 &vector)
{
    std::cout << vector.x << ", " << vector.y << std::endl;
}

int main()
{
	// 定义一个vector
    Vector4 vector = {1.0f, 2.0f, 3.0f, 4.0f};
    // vector.a和vector.b和x,y,z,w是同一个union，也就是他们之间内存共享的
    PrintVector2(vector.a);
    PrintVector2(vector.b);
    // 将vector的z改了，即改了vector.b的第一个元素的值
    vector.z = 500;
    std::cout << "-----------------------" << std::endl;
    PrintVector2(vector.a);
    PrintVector2(vector.b);
}
//输出：
1，2
3，4
-----------------------
1，2
500，4
```

> union 里的成员会共享内存，分配的大小是按最大成员的 sizeof, 视频里有两个成员，也就是那两个结构体，改变其中一个另外一个里面对应的也会改变. 如果是这两个成员是结构体 struct{ int a, b} 和 int k , 如果 k=2 ; 对应 a 也=2 ，b 不变； union 我觉得在这种情况下很好用，就是用不同的结构表示同样的数据，那么你可以按照获取和修改他们的方式来定义你的 union 结构很方便
