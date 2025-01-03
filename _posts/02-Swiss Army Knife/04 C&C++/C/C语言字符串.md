---
date created: 2024-05-09 00:57
date updated: 2024-12-27 23:49
tags:
  - '#define'
  - '#include'
dg-publish: true
---

# C 语言字符串

## 字符串概述

在 C 语言中，字符串代表一系列字符的有序集合。按照 C 语言的约定，字符串以空字符 `'0'`（也称作空终止字符或字符串终止符）结尾，它在 `ASCII` 编码中代表数值 0。因此，在 C 语言的字符串（也被称作 C 风格字符串）通常是通过字符数组来实现，并在数组的末尾包含空字符来标记字符串的结束。

## C 语言字符串表达方式

在 C 语言中，字符串可以通过以下几种方式来表达：

### 字符串字面量（String Literals）：

使用双引号括起来的字符序列是字符串字面量。字符串字面量在内存中以空字符 '0' 结尾来存储，这样就构成了 C 风格的字符串。

```c
char* str = "Hello, World!";
str[2] = 'ff'; // 编译失败，不可修改
```

**注意：** 字符串字面量不可以修改的，要修改用字符数组。

### 字符数组（Character Arrays）：

一个以空字符结尾的字符数组可以表示字符串。

```c
char str[] = {'H', 'e', 'l', 'l', 'o', '0'};
char str2[] = "Hello"; // 编译器在末尾自动添加 '0'
```

### 字符指针（Character Pointers）：

可以使用字符指针指向字符串字面量或字符数组。字符串字面量存储在程序的只读数据段，当通过字符指针指向字符串字面量时，不应该尝试去修改它。

```c
const char* str = "Hello, World!";
char arr[] = "Hello, World!";
char* ptr = arr; // 指向字符数组，该数组包含一个字符串
```

### 联编字符串字面量（Concatenated String Literals）：

在 C 语言中，如果在编译时将多个字符串字面量放在一起，它们将自动连接在一起。

```c
char* str = "Hello, " "World!";
```

### 字符串宏（String Macros）：

在 C 语言中，可以使用宏来定义字符串。

```c
#define STR "Hello, World!"
```

### 小结

字符串字面量用得最普遍，而字符数组允许你修改数组中的字符。字符串字面量通常存储在程序的只读段，因此不应该通过字符指针修改它们的内容。
联编字符串字面量通常用于拼接长字符串，以提高代码的可读性。字符串宏可以提高代码的复用性和灵活性。在任何情况下，处理字符串时都需要确保在末尾加上空字符 '\0'，以符合 C 语言字符串的约定。

**示例：**

```c
#include <stdio.h>

int main()
{
    char str[] = {'D', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r', '\0'};
    printf("String: %s\n", str); // Developer

    str[2] = 'C'; // 修改字符串
    printf("String: %s\n", str); // DeCeloper

    char* str1 = "hacket";
    printf("1String: %s\n", str1); // hacket
    str1[2] = 'c'; // 修改字符串，编译失败
    printf("2String: %s\n", str1); // hacket

    return 0;
}
```

> 在 C 语言中，字符串字面量（如 "hacket"）是常量，并且它们通常存储在一个只读的程序内存区域中。上面的代码首先声明一个指向字符串常量的指针 `str1`，然后试图修改字符串常量的第三个字符为 'c'。这种操作是未定义的行为，可能导致程序崩溃。

为了可靠地修改字符串，你应该使用字符数组而非指针，就像你在代码的上方对 str 数组所做的那样。如果你想要一个可修改的字符串，你应该这样声明它：

```c
char str1[] = "hacket";
```

## C 语言字符串操作

### 字符串和指针：

C 语言中的指针也常常用于操作字符串。例如，一个指向字符串的指针可以指向字符串的第一个字符，然后可以通过指针算术运算依次访问字符串中的其他字符。

**示例：**

```c
#include <string.h>
#include <stdio.h>

int main() {
    char str[20] = "hello";            // 字符数组，初始化为 "hello0"
    strcpy(str, "world");              // 将 "world0" 复制到 str
    printf("%sn", str);               // 输出: world
    printf("Length: %lun", strlen(str)); // 输出字符串长度: 5

    // 使用指针访问字符串
    char* ptr = str;
    while (*ptr != '0') {
        printf("%c", *ptr);
        ptr++;
    }
    printf("n");                        // 输出: world

    return 0;
}
```

> 要注意的是，由于 C 语言中没有内置字符串类型，所以在处理字符串时需要格外小心，以避免常见的错误，比如数组越界、忘记空字符终止导致的缓冲区溢出等。

### 字符串操作

在 C 语言中，字符串操作函数提供了对字符数组（即 C 风格字符串）的各种处理方法，包括比较、复制、连接、搜索和获取字符串长度等。以下是一些常用的 C 字符串操作函数，它们定义在 `<string.h>` 头文件中：

1. `strcpy(char* dest, const char* src)`：
   把 `src` 指向的字符串复制到 `dest` 指向的位置，包括结束的 `null` 字符。

2. `strncpy(char* dest, const char* src, size_t n)`：
   把 `src` 指向的字符串复制到 `dest` 指向的位置，最多复制 `n` 个字符。

3. `strcat(char* dest, const char* src)`：
   把 `src` 指向的字符串连接到 `dest` 指向的字符串结尾处。

4. `strncat(char* dest, const char* src, size_t n)`：
   把 `src` 指向的字符串的前 `n` 个字符连接到 `dest` 指向的字符串结尾处。

5. `strcmp(const char* str1, const char* str2)`：
   比较两个字符串并返回它们的字典序比较结果。

6. `strncmp(const char* str1, const char* str2, size_t n)`：
   比较两个字符串的前 `n` 个字符。

7. `strchr(const char* str, int c)`：
   在字符串 `str` 中搜索第一次出现的字符 `c`。

8. `strrchr(const char* str, int c)`：
   在字符串 `str` 中搜索最后一次出现的字符 `c`。

9. `strstr(const char* haystack, const char* needle)`:
   在字符串 `haystack` 中搜索子串 `needle` 的首次出现。

10. `strlen(const char* str)`：
    返回 `str` 指向的字符串的长度（不包括结束的 `null` 字符）。

11. `strspn(const char* str1, const char* str2)`:
    返回字符串 str1 中的最长子串的长度，该子串只包含在 str2 中的字符。

12. `strcspn(const char* str1, const char* str2)`:
    返回字符串 str1 中的最长子串的长度，该子串不含有 str2 中的字符。

13. `strtok(char* str, const char* delim)`:
    使用 `delim` 中定义的分隔符来分割 str 字符串。

14. `strerror(int errnum)`:
    根据错误号 `errnum` 返回对应的错误描述字符串。

### 字符串类型互相转换

在 C 语言中，还有一些函数可以将字符串转换为其他数据类型，或者将其他类型的数据转换为字符串。以下列举了一些常见的类型转换函数：

#### 字符串转换为数值类型的函数：

1. `atoi(const char* str)`：
   将字符串转换为 int 类型。

2. `atol(const char* str)`：
   将字符串转换为 long 类型。

3. `atoll(const char* str)`：
   将字符串转换为 long long 类型，C99 标准后提供。

4. `atof(const char* str)`：
   将字符串转换为 double 类型。

5. `strtol(const char* str, char** endptr, int base)`：
   把字符串转换成 long 整数。

6. `strtoll(const char* str, char** endptr, int base)`：
   把字符串转换成 long long 整数。

7. `strtoul(const char* str, char** endptr, int base)`：
   把字符串转换成无符号 long 整数。

8. `strtoull(const char* str, char** endptr, int base)`：
   把字符串转换成无符号 long long 整数。

9. `strtof(const char* str, char** endptr)`：
   把字符串转换成浮点数 float。

10. `strtod(const char* str, char** endptr)`：
    把字符串转换成双精度浮点数 double。

11. `strtold(const char* str, char** endptr)`：
    把字符串转换成扩展精度浮点数 long double。

#### 数值转换为字符串的函数：

1. `sprintf(char* str, const char* format, ...)`：
   按照 format 指定的格式将数据格式化后存储到字符串中。
2. `snprintf(char* str, size_t size, const char* format, ...)`：
   功能同 sprintf，但可以指定写入的最大字符数 size，用以防止缓冲区溢出。
3. `itoa(int value, char* str, int base)`：
   将整数转换为字符串。这不是 C 标准函数，但在一些编译器中提供

函数 `sprintf` 和 `snprintf` 非常强大，可以将多种类型的数据转换为字符串，并可用于创建复杂的格式化字符串。`itoa` 函数可以将整数转换为字符串，但因其不是标准 C 函数，其可移植性较差。

在使用这些类型转换函数时，建议对输入字符串的格式和有效性进行仔细检查，特别是在使用 `sprintf` 和类似功能时，要确保目标缓冲区足够大以避免溢出。使用 `strtol` 系列的函数时，还可以检测转换是否成功以及是否有任何非数字字符。

#### 示例

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // 字符串转换为整型
    const char* intString = "1234";
    int intValue = atoi(intString);
    printf("字符串 "%s" 转换为整型是 %dn", intString, intValue);

    // 字符串转换为长整型
    const char* longString = "1234567890";
    long longValue = atol(longString);
    printf("字符串 "%s" 转换为长整型是 %ldn", longString, longValue);

    // 字符串转换为浮点型
    const char* floatString = "1234.56";
    float floatValue = atof(floatString);
    printf("字符串 "%s" 转换为浮点型是 %fn", floatString, floatValue);

    // 整型转换为字符串
    char buffer[20];
    int numberToConvert = 1234;
    snprintf(buffer, 20, "%d", numberToConvert);
    printf("整型 %d 转换为字符串是 "%s"n", numberToConvert, buffer);

    // 浮点型转换为字符串
    double doubleToConvert = 1234.5678;
    snprintf(buffer, 20, "%.2f", doubleToConvert);
    printf("浮点型 %.4f 转换为字符串是 "%s"n", doubleToConvert, buffer);

    return 0;
}

```

输出：

```
字符串 "1234" 转换为整型是 1234
字符串 "1234567890" 转换为长整型是 1234567890
字符串 "1234.56" 转换为浮点型是 1234.560059
整型 1234 转换为字符串是 "1234"
浮点型 1234.5677 转换为字符串是 "1234.57"
```

注意：`atoi`、`atol` 和 `atof` 在转换失败时不会设置错误码，而只是返回零。因此，在安全较高的场景，我们推荐使用 strtol、`strtoul`、`strtod` 等函数，因为它们能够提供更多的错误检查。同时注意，`itoa` 函数没有在这个例子中演示，因为它不是标准 C 函数，可能并不在所有编译器中可用。
