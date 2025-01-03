---
date created: 2024-05-05 22:25
date updated: 2024-12-27 23:49
tags:
  - '#include'
dg-publish: true
---

# getchar()

`getchar()` 是 C 语言标准库中的一个函数，用于从标准输入（通常是键盘）读取下一个可用的字符。这个函数定义在 `<stdio.h>` 头文件中，在 C++ 中也可以使用这个函数，只需要包含对应的 `<cstdio>` 头文件。

`getchar()` 函数原型如下：

```c
int getchar(void);
```

当调用 `getchar()` 函数时，它会等待用户输入字符并按下回车键。函数随后返回输入的第一个字符，并将其作为一个 int 类型的值返回。`getchar()` 函数读取的是 `unsigned char` 类型转换到 `int` 类型的值，因此可以处理任何可能的字符，包括特殊字符。如果遇到文件结束符（`EOF`），通常是用户按下 `Ctrl+D`（在 UNIX-like 系统中）或 `Ctrl+Z`（在 DOS/Windows 系统中），`getchar()` 会返回特殊的 `EOF` 标志。

示例：

```c
#include <stdio.h>

int main() {
    printf("请输入一个字符: ");
    int ch = getchar(); // 读取一个字符

    printf("您输入的字符是: %cn", ch);
    return 0;
}
```

C++中用 `std::cin.get()`
