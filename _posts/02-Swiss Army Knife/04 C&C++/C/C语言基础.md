---
date created: 2024-04-09 23:47
tags:
  - '#include'
  - '#ifdef'
  - '#else'
  - '#endif'
  - '#pragma'
  - '#define'
  - '#defind'
date updated: 2024-12-28 13:02
dg-publish: true
---

# C 语言数据类型

## C 语言基本数据类型

### 整形

| 整型             | 字节 | 取值范围                           | 占位  |
| -------------- | -- | ------------------------------ | --- |
| int            | 4  | -2,147,483,648 到 2,147,483,647 | %d  |
| unsigned int   | 4  | 0 到 4,294,967,295              | %u  |
| short          | 2  | -32,768 到 32,767               | %hd |
| unsigned short | 2  | 0 到 65,535                     | %hu |
| long           | 4  | -2,147,483,648 到 2,147,483,647 | %ld |
| unsigned long  | 4  | 0 到 4,294,967,295              | %lu |
| char           | 1  | -128 到 127                     | %c  |
| unsigned char  | 1  | 0 到 255                        | %c  |

> 1.**signed**----有符号，可修饰char、int。Int是默认有符号的。
> 2.**unsigned**-----无符号，修饰int 、char

表达式 `sizeof(type)` 得到对象或类型的存储字节大小。

### 浮点型

| 浮点型         | 字节 | 精度    | 占位  |
| ----------- | -- | ----- | --- |
| float       | 4  | 6位小数  | %f  |
| double      | 8  | 15位小数 | %lf |
| long double | 8  | 19位小数 | %Lf |

### 布尔

C99标准里面定义了bool类型，需要引入头文件`stdbool.h`

bool类型有只有两个值：true =1 、false=0。

因此实际上bool就是一个int

所以在 C 中 if 遵循一个规则，非0为 true，非空为 true；

NULL 其实也就是被define为了 0

1. 非0为true
2. 非NULL为true

## 格式化

需引入头`#include <stdio.h>`

`printf`、`sprintf`等

- printf

```c
#include <stdio.h>

int main(int argc, char** argv) {

    int a = 1;
    unsigned int b = 2;
    int16_t aa = 1;

    printf("int size:%lu\n", sizeof(int)); // 4, mbp
    printf("unsigned int size:%lu\n", sizeof(unsigned int)); // 4

    printf("short size:%lu\n", sizeof(short)); // 2
    printf("unsigned short size:%lu\n", sizeof(unsigned short)); // 2

    printf("long size:%lu\n", sizeof(long)); // 8
    printf("unsigned long size:%lu\n", sizeof(unsigned long)); // 8

    printf("char size:%lu\n", sizeof(char)); // 1
    printf("unsigned char size:%lu\n", sizeof(unsigned char)); // 1

    printf("float size:%lu\n", sizeof(float)); // 4
    printf("double size:%lu\n", sizeof(double)); // 8
    printf("long double size:%lu\n", sizeof(long double)); // 16

    printf("int32_t size:%lu\n", sizeof(int32_t)); // 4
    printf("int64_t size:%lu\n", sizeof(int64_t)); //8

    printf("HelloWorld %d",4);

    return 0;
}
```

结果：

```
int size:4
unsigned int size:4
short size:2
unsigned short size:2
long size:8
unsigned long size:8
char size:1
unsigned char size:1
float size:4
double size:8
long double size:16
int32_t size:4
int64_t size:8
HelloWorld 4
```

- sprintf 将格式化的数据写入第一个参数

```c
char str[100];
sprintf(str, "img/png_%d.png", 1);
printf("%s", str);

//使用 0 补到3个字符
sprintf(str, "img/png_%03d.png", 1);
printf("%s", str);
```

> 格式化还有：

```
8进制 			%o
16进制			小写： %x    大写：%X
(0x)+16进制前面 	%#x
```

## C语言可变参数

```c
#include <stdarg.h>

//可变参数
void add(char* buf,...) {
	// 表示 ... 的参数列表
	va_list list;
	va_start(list, buf);
	
	char c = va_arg(list, char);
	printf("可变参数有:%c\n", c);
	va_end(list);
}

add(NULL,1,2,3,4,5,'a');
```

## 枚举

在 C 语言中，枚举（`Enumeration`）是一种用户定义的数据类型，它允许程序员为整数值指定有意义的名称，提高代码的可读性和可维护性。枚举在 C 语言中用 `enum` 关键字来声明。
枚举的基本语法格式如下：

```c
enum 枚举名 {
    枚举元素1,
    枚举元素2,
    //...
    枚举元素N
} 枚举变量;
```

其中，枚举名是枚举的名称，枚举元素 1 到枚举元素 N 是枚举类型的可能值。每个枚举元素都是一个常量，如果不显式指定值，枚举元素的值默认从 0 开始自动递增。你也可以手动为枚举的元素指定特定的整数值。

**示例：**

```c
int main()
{
    enum week
    {
        Sunday,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday
    } week;

    printf("week: %d\n", week); // week: 0

    enum week today;

    printf("Day %d\n", today + 1); // Day 1
    today = Wednesday;
    printf("Day %d\n", today + 1); // Day 4

    return 0;
}
```

# C语言函数

## 函数的值传递和址传递

```c
// 值传递
void change(int p){
    p = 10;
}
// 地址传递：修改的是指针指向的内存地址的数据，并没有修改指针p的值（即指针p指向的内存地址）
void change1(int *p){ // 参数是一个地址
    *p = 1000; // 修改p的值(是一个地址)，地址指向的内存的值
   printf("p的地址：%#x\n",p);
}

// 指针p的值是一个指针，修改的是指针p的值，也就是修改了指针p指向另外一块内存地址，
void change2(int **p){ // 参数是一个指针的指针，p指针存放的是一个指针，
    int i = 2000;
    *p = &i; // 修改p指向的地址
}

void main() {
    int i3 = 100;
    change(100);
    printf("i3=%d\n",i3);
    
    //2、传引用
    //不修改指针的值 修改的是指针指向内存的数据
    int *p9 = &i3; // 指针p3存放的是i3的地址
    printf("i3的地址：%#x\n",&i3);
    //修改i3的值
    change1(p9);
    printf("change1 i3=%d\n",i3);
    
    int **p10 = &p9; // 指针p10指向的是p9的地址，而p9存放的是i3的地址
    printf("change2前p10存放的地址：%#x\n",*p10);
    //修改指针指向内存数据，而是修改指针指向的地址，也就是说指向换了一块内存地址
	change2(p10);
    printf("change2后p10存放的地址：%#x\n",*p10);
    printf("change2 i3=%d\n",**p10);
}
```

```
i3=100
i3的地址：0xef156fa8
p的地址：0xef156fa8
change1 i3=1000
change2前p10存放的地址：0xef156fa8
change2后p10存放的地址：0xef156f24
change2 i3=0
```

## 函数指针

见 [[08.C和C++指针和引用#函数和指针]]

# 数组

> 数组 ：连续的内存

数组声明

```c

// int arr[]; // 错误
int arr[10]; // 数组，必须声明时确定大小
int arr1[] = {1,2,3}; // 或者直接初始化

printf("数组长度：%lu\n",sizeof(arr)/sizeof(int)); // 10
```

# C语言预处理器

> 预处理器不是编译器，但是它是编译过程中一个单独的步骤。
>
> 预处理器是一个文本替换工具
>
> 所有的预处理器命令都是以井号（#）开头

## 常用预处理器

| 预处理器       | 说明      |
| ---------- | ------- |
| `#include` | 导入头文件   |
| `#if`      | if      |
| `#elif`    | else if |
| `#else`    | else    |
| `#endif`   | 结束 if   |
| `#define`  | 宏定义     |
| `#ifdef`   | 如果定义了宏  |
| `#ifndef`  | 如果未定义宏  |
| `#undef`   | 取消宏定义   |

```c
// 如果为 true  编译并执行块内的代码
#ifdef DEBUG
	Func fun = println;
	say(fun, "hello");
	say(println, "hello");
	//模拟  举例子 执行http请求
	http(1, httpOk, httpFailure);
	http(0, httpOk, httpFailure);
#else


#endif
```

### 宏

**预处理器是一个文本替换工具**

> 宏就是文本替换，用#define来定义

1. 宏变量
2. 宏函数，如果需要换行用`\`连接
3. 宏一般用大写表示
4. 用##连接
5. 可变宏
6. 宏仅仅是进行文本替换

```c

// 用于只引用一次，宏定义两次会出错
#pragma once

//宏一般使用大写区分
//宏变量
//在代码中使用 A 就会被替换为1
#define A 1
//宏函数
#defind test(i) i > 10 ? 1: 0

//其他技巧
// # 连接符 连接两个符号组成新符号
#define DN_INT(arg) int dn_ ## arg
DN_INT(i) = 10;
dn_i = 100;

// \ 换行符
#define PRINT_I(arg) if(arg) { \
 printf("%d\n",arg); \
 }
PRINT_I(dn_i);

//可变宏
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR,"NDK", __VA_ARGS__);

//陷阱
#define MULTI(x,y)  x*y
//获得 4
printf("%d\n", MULTI(2, 2));
//获得 1+1*2  = 3
printf("%d\n", MULTI(1+1, 2));
```

- 宏函数和内联函数区别

> 宏函数
>
> 优点：
>
> 缺点：
>
> 内联函数
>
> 和宏函数工作模式相似，但是两个不同的概念，首先是函数，那么就会有类型检查同时也可以debug<br />在编译时候将内联函数插入。
>
> 不能包含复杂的控制语句，while、switch，并且内联函数本身不能直接调用自身。<br />如果内联函数的函数体过大，编译器会自动的把这个内联函数变成普通函数。

```
  文本替换，每个使用到的地方都会替换为宏定义。

  不会造成函数调用的开销（开辟栈空间，记录返回地址，将形参压栈，从函数返回还要释放堆		

  栈。）
```

```
  生成的目标文件大，不会执行代码检查
```

# C语言疑惑点

- <  > 和区别
  - `<>` 用于导入系统库头文件
  - `""` 用于导入相对路径的头文件

# Ref

- [ ] [C 语言教程（阮一峰）](https://wangdoc.com/clang/)
