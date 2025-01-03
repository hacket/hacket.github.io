---
date created: 2024-05-02 00:04
tags:
  - '#变量名为'
  - '#引用'
  - '#add_library('
  - '#设置'
  - '#set_target_properties(external'
  - '#=====================引入外部'
  - '#set(CMAKE_C_FLAGS'
date updated: 2024-12-27 23:52
dg-publish: true
---

# CMake 入门

文档：<https://cmake.org/documentation>

## Cmake 简介

CMake是一个跨平台的安装(编译)工具,可以用简单的语句来描述所有平台的安装(编译过程)。他能够输出各种各样的makefile或者project文件,能测试编译器所支持的C++特性,类似UNIX下的automake。

Make 是一种跨平台编译工具，比 make 更为高级，使用起来要方便得多。`CMake` 主要是编写 `CMakeLists.txt` 文件，然后用 cmake 命令将 `CMakeLists.txt` 文件转化为 `make工具` 所需要的 `makefile` 文件，最后用 `make` 命令编译源码生成可执行程序或共享库（`so(shared object)`）。因此 `CMake` 的编译基本就两个步骤：

```shell
cmake 
make
```

**Android Studio CMake 提示插件：**

`CMake simple highlighter`

**CMake 安装 Mac OS**

- 命令行

```
// 如果没有安装homebrew，那么先安装homebrew
ruby -e "$(curl -fsSkL raw.github.com/mxcl/homebrew/go)"

// homebrew安装cmake
brew install cmake

// 如果出错了，根据错误提示，直接下面的2条命令即可
```

- 桌面下载<https://cmake.org/download/>

## CMake基本语法

### 注释与大小写

- `#` 代表注释

- CMake 的所有语法指令是不区分大小写的

### CMake 变量定义和 log 输出

#### CMake 常用变量和常用环境变量

| Variable                   | Info                                                 |
| -------------------------- | ---------------------------------------------------- |
| `CMAKE_SOURCE_DIR`         | 根源代码目录，工程顶层目录。暂认为就是`PROJECT_SOURCE_DIR`              |
| `CMAKE_CURRENT_SOURCE_DIR` | 当前处理的 `CMakeLists.txt` 所在的路径                         |
| `PROJECT_SOURCE_DIR`       | 工程顶层目录                                               |
| `CMAKE_BINARY_DIR`         | 运行cmake的目录。外部构建时就是build目录                            |
| `CMAKE_CURRENT_BINARY_DIR` | The build directory you are currently in.当前所在build目录 |
| `PROJECT_BINARY_DIR`       | 暂认为就是`CMAKE_BINARY_DIR`                              |

#### set 指令 定义变量

在 CMake 中，set 命令用于定义或修改变量的值。变量在整个 CMake 脚本中持续有效，直到被修改或清除。也可以使用 set 来定义缓存变量，这些变量的值将会在构建系统重新运行 CMake 时保持不变。

**set 命令的基本语法是：**

```
set(VARIABLE_NAME "value" [CACHE TYPE "description"])
```

- 其中，可选的 `CACHE` 参数用于指定变量要设置成缓存变量，并且可以附带一种类型和描述。类型通常为 `BOOL`, `STRING`, `FILEPATH`, `PATH` 等。

在 CMakeLists 文件或包含的文件中引用变量时，在变量名外面加上 `${变量名}` 符合来引用变量。

```cmake
#引用 var 变量
${var}
```

**示例：简单用法**

```cpp
# 设置普通变量
set(MY_VARIABLE "SomeValue")

# 设置缓存变量
set(MY_CACHE_VARIABLE "SomeCacheValue" CACHE STRING "A description of the cache variable")
```

- 在第一个示例中，`MY_VARIABLE` 被设定为值 `SomeValue`。稍后在 `CMakeLists` 文件或包含的文件中你可以通过访问 `${MY_VARIABLE}` 来获取这个值。
- 在第二个示例中，变量 `MY_CACHE_VARIABLE` 被定义并添加到 CMake 缓存中，如果 CMake 配置运行多次，缓存变量将会保持其值（除非用户通过界面更改了它），使它在不同的 CMake 配置运行中保持持久，可以通过 CMake 缓存编辑器 UI 进行访问和修改。

**示例：** 重新定义 `EXECUTABLE_OUTPUT_PATH` 和 `LIBRARY_OUTPUT_PATH` 变量来指定最终的目标二进制的位置(指最终生成的二进制或者最终的共享库，不包含编译生成的中间文件)

```cpp
SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
SET(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)
```

**示例：设置一个列表：**

```cpp
# 设置列表变量
set(MY_LIST "Item1" "Item2" "Item3")
```

**示例：强制覆盖环境变量**

```cpp
# 设置环境变量
set(ENV{MY_ENV_VARIABLE} "Value")
```

#### message 输出 log

**语法格式：**

```
MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display" ...)
```

这个指令用于向终端输出用户定义的信息，包含了三种类型:

- `SEND_ERROR`，产生错误，生成过程被跳过。
- `STATUS`，输出前缀为 `--` 的信息。
- `FATAL_ERROR`，立即终止所有 cmake 过程。

**示例：**

```cpp
message(STATUS "This is BINARY dir " ${PROJECT_BINARY_DIR})
# message(SEND_ERROR "This is BINARY dir " ${PROJECT_BINARY_DIR})
# message(FATAL_ERROR "This is BINARY dir " ${PROJECT_BINARY_DIR})
```

### 数学和字符串操作

#### 数学操作

CMake 中通过`math`来实现数学操作

```cmake
# math 使用，EXPR 为大写
math(EXPR <output-variable> <math-expression>)
```

案例:

```cmake
math(EXPR var "1+1") # var是变量
# 输出结果为 2
message(${var})
```

math 支持`+, -, *, /, %, |, &, ^, ~, <<, >>`等操作，和 C 语言中大致相同。

#### 字符串操作

CMake 通过 `string` 来实现字符串的操作，这波操作有很多，包括将字符串全部大写、全部小写、求字符串长度、查找与替换等操作。

```cmake
set(var "this is  string")
set(sub "this")
set(sub1 "that")
# 字符串的查找，结果保存在 result 变量中
string(FIND ${var} ${sub1} result )
# 找到了输出 0 ，否则为 -1
message(${result}) # 0

# 将字符串全部大写
string(TOUPPER ${var} result)
message(${result}) # THIS IS  STRING

# 求字符串的长度
string(LENGTH ${var} num)
message(${num}) # 15

# 通过空白或者分隔符号可以表示字符串序列。
set(foo this is a list) # 实际内容为字符串序列
message(${foo}) # thisisalist

# 当字符串中需要用到空白或者分隔符时，再用双括号""表示为同一个字符串内容
set(foo "this is a list") # 实际内容为一个字符串
message(${foo}) # this is a list
```

### 文件操作

CMake 中通过 `file` 来实现文件操作，包括文件读写、下载文件、文件重命名等。

```cmake
# 文件重命名
file(RENAME "test.txt" "new.txt")

# 文件下载
# 把文件 URL 设定为变量
set(var "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg")

# 使用 DOWNLOAD 下载
file(DOWNLOAD ${var} "/Users/glumes/CLionProjects/HelloCMake/image.jpg")
```

在文件的操作中，还有两个很重要的指令 `GLOB` 和 `GLOB_RECURSE` 。

```cmake
# GLOB 的使用
file(GLOB ROOT_SOURCE *.cpp)

# GLOB_RECURSE 的使用
file(GLOB_RECURSE CORE_SOURCE ./detail/*.cpp)
```

其中，`GLOB` 指令会将所有匹配 *.cpp 表达式的文件组成一个列表，并保存在 ROOT_SOURCE 变量中。

而 `GLOB_RECURSE` 指令和 GLOB 类似，但是它会遍历匹配目录的所有文件以及子目录下面的文件。

使用  GLOB 和 GLOB_RECURSE 有好处，就是当添加需要编译的文件时，不用再一个一个手动添加了，同一目录下的内容都被包含在对应变量中了，但也有弊端，就是新建了文件，但是 CMake 并没有改变，导致在编译时也会重新产生构建文件，要解决这个问题，就是动一动 CMake，让编译器检测到它有改变就好了。

### 预定义的常量

在 CMake 中有许多预定义的常量，使用好这些常量能起到事半功倍的效果

```cmake
CMAKE_CURRENT_SOURCE_DIR
# 指当前 CMake 文件所在的文件夹路径

CMAKE_SOURCE_DIR
# 指当前工程的 CMake 文件所在路径

CMAKE_CURRENT_LIST_FILE
# 指当前 CMake 文件的完整路径

PROJECT_SOURCE_DIR
# 指当前工程的路径

PROJECT_NAME
# 当前工程名，默认值为Project，受project()影响

PROJECT_BINARY_DIR 
# 二进制目录
```

### 函数、宏、流程控制和选项 等命令

#### 函数

```cmake
function(add a b )
    message("this is function call")
    math(EXPR num "${a} + ${b}" )
    message("result is ${num}")
endfunction()

add(1 2)
```

其中，`function` 为定义函数，第一个参数为函数名称，后面为函数参数。<br />在调用函数时，参数之间用空格隔开，不要用逗号。

#### 宏

宏的使用与函数使用有点类似：

```cmake
macro(del a b)
    message("this is macro call")
    math(EXPR num "${a} - ${b}")
    message("num is ${num}")
endmacro()

del(1 2)
```

#### 流程控制

```cmake
set(num 0)
if (1 AND ${num})
    message("and operation")
elseif (1 OR ${num})
    message("or operation")
else ()
    message("not reach")
endif ()
```

其中，CMake 提供了 `AND、OR、NOT、LESS、EQUAL` 等等这样的操作来对数据进行判断，比如 AND 就是要求两边同为 True 才行。

#### 迭代控制

```cmake
set(stringList this is string list)
foreach (str ${stringList})
    message("str is ${str}")
endforeach ()
```

#### 选项option

CMake 还提供了一个 `option` 指令。可以通过它来给 CMake 定义一些全局选项:

```cmake
option(ENABLE_SHARED "Build shared libraries" TRUE)

if(ENABLE_SHARED)
    # do something
else()
    # do something   
endif()
```

可能会觉得 `option` 无非就是一个 `True or False` 的标志位，可以用变量来代替，但使用变量的话，还得添加 `${}` 来表示变量，而使用 option 直接引用名称就好了。

## CMakeLists.txt 中常用指令

**CMakeLists.txt** 的语法比较简单，由命令、注释和空格组成，其中命令是不区分大小写的。符号`#`后面的内容被认为是注释。命令由命令名称、小括号和参数组成，参数之间使用空格进行间隔。

### cmake_minimum_required 设置CMake最小版本

这个指令用来指定CMake编译所需的最小版本号

```cpp
cmake_minimum_required(VERSION 3.5)
```

### project 工程名称/支持的语言

**语法格式：**

```
PROJECT(projectname [CXX] [C] [Java])
```

你可以用这个指令定义工程名称，并可指定工程支持的语言，支持的语言列表是可以忽略的， 默认情况表示支持所有语言。

这个指令隐式的定义了两个 cmake 变量: `<projectname>_BINARY_DIR` 以及 `<projectname>_SOURCE_DIR`，如：

```cpp
# 项目信息
project(Demo3)
message($Demo3_SOURCE_DIR = ${Demo3_SOURCE_DIR})
message($Demo3_BINARY_DIR = ${Demo3_BINARY_DIR})
```

输出：

> [cmake] $Demo 3_SOURCE_DIR=F:/C++/Workspace/VSCpp/CMakeDemo/demo 3
> \[cmake]$Demo 3_BINARY_DIR=F:/C++/Workspace/VSCpp/build

同时 `cmake` 系统也帮助我们预定义了 `PROJECT_BINARY_DIR` 和 `PROJECT_SOURCE_DIR变量`，他们的值分别跟 `DEMO 3_BINARY_DIR` 与 `DEMO3_SOURCE_DIR` 一致。

**为了统一起见，建议直接使用 `PROJECT_BINARY_DIR`，`PROJECT_SOURCE_DIR`，即 使修改了工程名称，也不会影响这两个变量。**

### include_directories() 添加头文件搜索路径

在 CMake 中，`include_directories` 命令被用来向项目添加包含目录（即头文件搜索路径）。这些指定的目录会被添加到编译器的头文件搜索路径中，这就允许编译器在编译项目时查找这些目录下的头文件。
`include_directories` 的基本语法是：

```cpp
include_directories([AFTER|BEFORE] [SYSTEM] dir1 [dir2 ...])
```

其中：

- `AFTER` 或 `BEFORE` 用于控制这些目录是被追加到已有的包含目录列表的末尾还是开头。默认情况下使用的是 `BEFORE`，但强烈建议显式地使用 AFTER 以避免潜在的冲突。
- `SYSTEM` 是一个可选的关键字，用来指示给定的目录是系统目录。这意味着编译器在这些目录中搜索到的头文件里的警告会被视作不重要的。
- `dir1、dir2 ...` 是你想要添加到包含路径中的目录；多个目录用空格分隔；如果路径中包含了空格，可以使用`双引号`将它括起来

默认的行为是追加到当前的头文件搜索路径的后面，你可以通过两种方式来进行控制搜索路径添加的方式：

1. `CMAKE_INCLUDE_DIRECTORIES_BEFORE`，通过 set 这个 `CMake` 变量为 on`，`可以将添加的头文件搜索路径放在已有路径的前面。
2. 通过 `AFTER` 或者 `BEFORE` 参数，也可以控制是追加还是置前。

**示例：如果你有一个项目，它的某些头文件位于 include 目录下**

```cpp
include_directories(include)
```

这样做会影响到 CMake 配置中随后声明的所有目标（即由 `add_executable` 或 `add_library` 命令创建的目标）。

如果你想要指定一个包含目录只对特定目标有效，那么应该使用 `target_include_directories` 命令，它允许你更精细地控制作用域和继承：

```cpp
target_include_directories(my_target PRIVATE include)
// 在这个例子中，include 目录只会被添加到名为 my_target 的构建目标的包含路径中，而不会影响到其他目标。
```

通常推荐使用 `target_include_directories` 而不是 `include_directories`，因为它能让你更明确、更有控制地指定依赖关系，有助于创建更可维护和可移植的 CMake 脚本。

### 库链接

#### ~~link_directories~~

在 CMake 中，`link_directories` 命令用来为链接器添加库文件搜索路径。这些指定的目录将被添加到链接器的搜索路径中，从而在链接期间可以找到所需的库文件。

这是一个~~现已不推荐使用的命令~~，因为它是基于目录的，可能会引入复杂性和潜在的问题，比如错误地链接到不同目录下同名的库。它影响所有后续定义的目标。

**语法：**

```cpp
link_directories(directory1 directory2 ...)
```

在实际项目中，建议而不是使用 `link_directories`，而是使用 `target_link_libraries` 和 `find_library` 等命令针对具体的目标进行库链接。使用这些命令不仅可以指定库的绝对路径，还可以利用 CMake 的模块找到并链接系统中的库。

#### target_link_libraries() 将库与其他库相关联

`target_link_libraries` 是 CMake 中最常用于指定链接库的命令。这个命令告诉 CMake 将某个库或多个库链接到你的目标上，无论它是可执行目标还是库目标。

**语法：**

```cpp
target_link_libraries(<target>
  <PRIVATE|PUBLIC|INTERFACE> <item>...
  [<PRIVATE|PUBLIC|INTERFACE> <item>...]...)
```

其中：

- ` <target>  `是你希望链接库的目标名称（通常是通过 `add_executable` 或 `add_library` 定义的）。
- `<PRIVATE|PUBLIC|INTERFACE>` 指定链接库的作用域：
  - `PRIVATE` 表示链接的库将仅用于该目标，不会被任何链接到该目标的消费者看到。
  - `PUBLIC` 表示链接的库既用于该目标，又会被其任何链接到该目标的消费者所使用。
  - `INTERFACE` 表示链接的库不用于该目标的构建，但任何链接到该目标的消费者都将需要这些库。
- `<item>` 是库的名称，也可以是目标名称，路径，或者在特定情况下的关键字。

**示例：假设你有一个可执行文件目标 app，它依赖于库 mylib（可以是自定义的目标，系统库或第三方库）**

```cpp
# 你的库目标
add_library(mylib STATIC src/mylib.cpp)

# 你的应用目标
add_executable(app src/main.cpp)

# 连接库到应用目标
target_link_libraries(app PRIVATE mylib)
```

在这个例子里，`app` 可执行文件会链接到名为 `mylib` 的库。使用 `PRIVATE` 关键字表示 `mylib` 只用于 `app` 的构建，在 `app` 的消费者（如其他目标链接到 `app`）中不会继承 `mylib` 的链接信息。如果 `mylib` 是一个共有接口的一部分（例如，如果 app 是一个库，其公共头文件中包括了来自 `mylib` 的头文件），那么应当使用 `PUBLIC` 而不是 `PRIVATE`。

**示例：Android log**
如果编译了多个库，并且想库与库之间进行链接。

```cpp
target_link_libraries( native-lib
    glm
    turbojpeg
    log )
```

在 Android 底层也提供了一些 so 库供上层链接使用，也要通过上面的方式来链接，比如最常见的就是 `log` 库打印日志。

#### find_library

在 `CMake` 中，`find_library` 命令用于寻找并设置库文件的全路径。该命令尝试在指定的路径中或者标准的库安装路径中查找库文件。如果找到，它会设置一个变量到该库的完整路径。如果没有找到，变量将被设置为 `NOTFOUND`。
使用 `find_library` 可以帮助你写出跨平台的构建脚本，因为它能够透明化底层文件系统的差异。

**语法：**

```cpp
find_library(<VAR> <name1> [path1 path2 ...])
```

其中：

- ` <VAR>  `是当 `find_library` 找到对应库之后用于存储库全路径的变量名称。
- `<name1>` 是你要找的库的名称。通常，你不需要包含 `lib` 前缀或文件扩展名，因为 CMake 会根据当前平台适当地查找库。
- `[path 1 path 2 ...]` 是可选的，这些是 CMake 在运行库搜索时额外考虑的搜索路径。

**示例1：查找数学库（通常命名为 m），在标准库安装路径**

```cpp
find_library(MATH_LIB m)
// 找到MATH_LIB，通过target_link_libraries链接库
add_executable(myapp main.cpp)
find_library(MATH_LIB m)
if(MATH_LIB)
    target_link_libraries(myapp ${MATH_LIB})
endif()
```

如果找到数学库，那么变量 `MATH_LIB` 将包含库的完整路径。如果没有找到，`MATH_LIB` 将为 `NOTFOUND`。

**示例2: 多个搜索路径**

```cpp
find_library(MYLIBRARY mylibrary 
             PATHS /some/custom/path /another/custom/path
             NO_DEFAULT_PATH)
```

`PATHS` 指定了 `CMake` 额外搜索库文件的路径。使用 `NO_DEFAULT_PATH` 选项会让 `CMake` 忽略默认的标准路径，仅在你指定的路径下搜索库文件。

**标准库目录**通常是操作系统定义的一组路径，可能包括 `/lib`、`/usr/lib`、`/usr/local/lib` 等目录，以及可能的环境变量或编译器指定的目录。

#### find_package

find_package 命令用于以模块或配置模式查找和加载外部项目（即**第三方库**）的设置（包括头文件路径、库文件路径等）。这个命令更为复杂，不仅可以查找库文件，还能够设置编译器和链接器选项、定义宏、加载宏等。

**语法：**

```cpp
find_package(<PackageName> [version] [REQUIRED] [COMPONENTS <components>...])
```

- `<PackageName>` 是你想要查找的包的名字。
- `[version]` 是一个可选的具体版本号。
- `REQUIRED` 是一个可选的关键字，指定这个包是必须的；如果没找到，CMake 会报错。
- `COMPONENTS` 后面跟着一个或多个组件名称，也是可选的，仅某些包支持这种使用方式。

`find_package` 很适合于查找配置良好的第三方库，特别是那些提供了`CMake`支持或“`xxx-config.cmake`”文件的库。使用 `find_package` 通常能够简化链接多个相关库和包含路径的工作

举个例子，找到并链接 Boost 库：

```cpp
find_package(Boost 1.65 REQUIRED)  # 查找至少版本为1.65的Boost

# 如果找到，使用Boost的头文件和库
if(Boost_FOUND)
    message(STATUS "Boost_INCLUDE_DIRS: ${Boost_INCLUDE_DIRS}")
    message(STATUS "Boost_LIBRARIES: ${Boost_LIBRARIES}")

    include_directories(${Boost_INCLUDE_DIRS})
    target_link_libraries(mytarget ${Boost_LIBRARIES})
endif()
```

##### find_library 和 find_package 对比

**区别：**

- `find_package` 一般用于第三方库，可以设置大量的配置项和选择性查找组件。它通常需要设置的是 `INCLUDE_DIRECTORIES`、`LIBRARIES` 等变量。
- `find_library` 通常针对找单个库文件路径，适用于系统库或不提供 `config.cmake` 文件的第三方库。

**根据需求选择：**

- 如果库提供了 `CMake` 导出的目标（Targets）或 `xxx-config.cmake` 文件（`CMake-friendly`），使用 `find_package` 往往更方便且功能强大。
- 如果你只想找到某个库的文件路径，或者明确知道库文件的名称和可能的路径，使用 `find_library`。

`find_package` 是现代 `CMake` 推荐的寻找依赖关系的方式，因为它遵循 `CMake` 的“使用逻辑目标而非物理路径”的原则，并且支持传递目标依赖项，包括包含路径和编译选项。在实践中尽可能使用 `find_package` 可以使构建系统更加可复用和可移植。

### add_subdirectory 添加子模块

`add_subdirectory` 是一个 CMake 命令，它用于向当前工程添加子目录。这个子目录应包含它自己的 `CMakeLists.txt` 文件，CMake 会在构建过程中递归地处理这个子目录的 `CMakeLists.txt`。

这个命令非常有用，因为它允许你把大型项目拆分成多个小的、更易于管理的子模块，而每个子模块都有自己的构建脚本。

**add_subdirectory** 的基本语法是：

```cmake
add_subdirectory(source_dir [binary_dir] [EXCLUDE_FROM_ALL])
```

- `source_dir` 是子目录相对于当前 CMakeLists.txt 文件的相对路径。
- `binary_dir` 是生成的构建文件（Makefiles、CMake缓存等）存放的目录。通常这个参数是可选的，如果不提供，CMake 会使用默认的构建文件目录。
- `EXCLUDE_FROM_ALL` 参数是可选的，如果使用这个参数，那么这个子目录中的目标（targets）不会被包含在父目录的 ALL 目标中，即使用父目录的构建所有目标的构建命令时，这个子目录中的目标不会被构建。

**示例：** 如果你有一个包含多个库和应用程序的项目，项目结构可能如下所示：

```
/project
    /CMakeLists.txt      # 顶级 CMakeLists 文件
    /libfoo              # 库 foo 的源码目录
        /CMakeLists.txt  # libfoo 的 CMakeLists 文件
    /app                 # 应用程序源码目录
        /CMakeLists.txt  # app 的 CMakeLists 文件
```

你可以在顶级的 `CMakeLists.txt` 中使用 `add_subdirectory` 命令来添加 `libfoo` 和 `app` 子目录：

```cpp
 cmake
# /project/CMakeLists.txt
cmake_minimum_required(VERSION 3.0)
project(MyProject)

# 添加 'libfoo' 子目录
add_subdirectory(libfoo)

# 添加 'app' 子目录
add_subdirectory(app)
```

然后每个子目录的 `CMakeLists.txt` 文件负责定义和构建该目录中的目标（库或执行程序）。通过使用 `add_subdirectory`，这些定义可以在整个项目的构建过程中被重新利用。

### set_target_properties 给编译的库设置属性

在 CMake 中，`set_target_properties` 命令用于设置已有目标（通常是可执行文件或库）的属性。这个命令允许你为目标定义多个属性，比如输出名称、版本号、编译选项、定义等。

命令的基本语法是：

```
set_target_properties(target1 target2 ...
                      PROPERTIES prop1 value1
                      prop2 value2
                      ...)
```

其中：

- `target1`、`target2` 等是你想要设置属性的目标名称。
- `PROPERTIES` 是跟在目标名称后面的关键字，表明接下来要设置属性。
- `prop1`、`prop2` 等是目标的具体属性名称。
- `value1`、`value2` 等是对应属性的值。

属性可以包括但不限于：

- `COMPILE_DEFINITIONS` — 在此目标的编译时定义预处理器宏。
- `COMPILE_OPTIONS` — 给此目标的编译器添加选项。
- `INCLUDE_DIRECTORIES` — 为此目标的编译器添加包含目录。
- `LINK_DIRECTORIES` — 为此目标的链接器添加链接目录。
- `LINK_LIBRARIES` — 指定链接目标时使用的库。
- `RUNTIME_OUTPUT_DIRECTORY` — 指定可执行文件的输出目录。
- `LIBRARY_OUTPUT_DIRECTORY` — 指定库文件的输出目录。
- `ARCHIVE_OUTPUT_DIRECTORY` — 指定静态库的输出目录。
- `OUTPUT_NAME` — 指定输出文件的名字，不包括后缀。
- `VERSION` 版本号
- `CXX_STANDARD` C++版本号

下面是一些 `set_target_properties` 的实例用法：

```cpp
# 设置目标 myapp 的输出文件名为 my_application
set_target_properties(myapp PROPERTIES OUTPUT_NAME "my_application")

# 设置目标 mylib 的版本号
set_target_properties(mylib PROPERTIES VERSION "1.2.3")

# 设置目标 myexe 的 C++ 标准为 C++14
set_target_properties(myexe PROPERTIES CXX_STANDARD 14)

# 为目标 mylib 添加一个宏定义
set_target_properties(mylib PROPERTIES COMPILE_DEFINITIONS "MYLIB_EXPORTS")

# 将多个属性同时指定给单个目标
set_target_properties(mylib
                      PROPERTIES
                      VERSION "1.2.3"
                      SOVERSION "1"
                      PUBLIC_HEADER "include/mylib.h")

```

这些属性可以改变编译行为、输出文件名、动态库版本等。

确保只有在定义了目标（如 `add_executable`, `add_library`）之后才能使用 `set_target_properties` 命令，因为目标需要先存在才能设置其属性。

### aux_source_directory 源文件目录

将当前目录的所有文件添加到 DIR_SRCS 变量

```cpp
# 源文件目录
aux_source_directory(
    src DIR_SRCS # DIR_SRCS代表的是所有源文件，但在AS环境中似乎没有这个变量
)
add_executable(target_name ${DIR_SRCS})
```

#### 多个子目录源文件添加

`aux_source_directory` 命令用于查找指定目录下的所有源文件，并将结果存储在一个变量中。然而，它只搜索指定的目录，并不递归子目录。因此，如果你在子目录中有源文件，你需要为每个子目录分别调用 `aux_source_directory`。
例如，如果你的项目结构如下：

```
- CMakeLists.txt
- main.cpp
- /src
  - utility.cpp
  - /subdir
    - more_utility.cpp
```

在顶层 `CMakeLists.txt` 文件中，你可以像这样设置：

```cpp
# 将当前目录中的源文件添加到变量 DIR_SRCS
aux_source_directory(. DIR_SRCS)

# 将 src 目录中的源文件添加到变量 DIR_SRCS
aux_source_directory(src DIR_SRCS)

# 为了包括 src/subdir 中的源文件，你需要另外一个变量或扩展现有的变量
aux_source_directory(src/subdir DIR_SUBDIR_SRCS)

# 然后你可能需要将它们合并到一个列表
set(ALL_SRCS ${DIR_SRCS} ${DIR_SUBDIR_SRCS})

# 最终，使用所有源文件来创建你的项目目标
add_executable(my_project ${ALL_SRCS})
```

`aux_source_directory` 可能会导致导出的源文件列表不是最新的（添加或删除文件后），所以除非你不经常修改目录结构和文件，否则通常不推荐使用这个命令。

更好的实践是手动指定你的源文件，或者在较新的 CMake 版本中使用 `file(GLOB_RECURSE ...)` 命令来递归地搜索源文件，同时注意到它同样不会跟踪文件的添加或删除。

```cpp
file(GLOB_RECURSE MY_SOURCES "src/*.cpp" "include/*.h")
add_executable(my_executable ${MY_SOURCES})
```

在这个例子中，`file(GLOB_RECURSE ...)` 使用两个模式：`"src/.cpp"` 和 `"include/.h"` 来查找所有在 `src` 目录及其子目录的 `.cpp` 文件，以及在 `include` 目录及其子目录的 `.h` 文件。然后，它将这些文件的完整路径存储在变量 `MY_SOURCES` 中，这个变量之后可以作为源文件路径列表提供给 `add_executable` 或 `add_library` 命令。

需要注意的是，使用 `file(GLOB ...)` 或 `file(GLOB_RECURSE ...)` 可能会导致一些问题，特别是在源文件被添加或移除，而且 `CMake` 未被重新运行的情况下。这是因为 `GLOB` 生成的文件列表不会实时更新，所以在文件结构变更之后，你可能需要手动重新运行 `CMake` 来确保正确的文件被包含在构建中。

因此，建议还是明确列出你的源文件或者设计项目结构时优化以减少这种自动查找文件的需要。这也是官方建议的最佳实践，以确保项目的可重复性和预期的行为。如果项目经常有文件添加或删除，使用 `GLOB` 的方式可能造成构建系统不一致，导致构建错误或者意外的行为。

### add_executable 生成可执行程序

`add_executable` 是 `CMake` 中用于从指定的源文件创建一个可执行文件的命令。当你有多个源文件时，可以通过简单地将它们全部列在 `add_executable` 函数后作为参数来添加。
**语法格式：**

```cpp
add_executable(target_name file1.cpp file2.cpp ...)
```

**示例1：包含多个源文件**

```cpp
add_executable(target_name file1.cpp file2.cpp file3.cpp)
# 这里，target_name 是你创建的可执行文件的目标名称，file1.cpp, file2.cpp, file3.cpp 则是源文件列表。你可以在列表中添加任意数量的源文件。
```

**示例2：从变量**

```cpp
# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(Demo3 ${DIR_SRCS})
```

将当前目录的所有源文件添加到 `DIR_SRCS` 变量，创建可执行目录的名称为 Demo3

**示例3：**
如果源文件很多，列出每一个可能会使 `CMakeLists.txt` 文件变得很长且不容易维护。为了解决这个问题，你可以使用`file(GLOB ...)` 命令来自动将所有指定模式的源文件添加到一个变量中，如下所示：

```cpp
# 将当前目录下所有的 .cpp 文件添加到变量 SRC_FILES 中
file(GLOB SRC_FILES *.cpp)

# 指定可执行文件由 SRC_FILES 变量中的源文件构建
add_executable(target_name ${SRC_FILES})
```

> 使用 `GLOB` 时请注意，这种自动化的文件收集不会跟踪新文件的添加或现有文件的删除，这可能导致 `CMake` 在构建时不是基于最新的源文件列表。因此，有时直接在 `add_executable` 中明确列出源文件可能是个更好的选择。

### `add_library()` 生成库

在 `CMake` 中，`add_library` 命令用于创建一个库目标。库可以是**静态库（.a，.lib）**、**动态库（.so，.dylib，.dll）** 或者是一个**模块库**，在 `CMake` 中分别通过 `STATIC`, `SHARED` 或 `MODULE` 关键字表示。库目标通常包括一组源文件，当构建项目时，CMake 会根据这些源文件生成库文件。

**add_library** 命令的基本用法如下：

```
add_library(<name> [STATIC | SHARED | MODULE] <source1> <source2> ... <sourceN>)
```

其中：

- `<name>` 是你为库目标选择的名称。如果是静态库，cmake 系统会自动生成 `lib<name>.a`
- `STATIC`, `SHARED`, 或 `MODULE` 用于指定库的类型。如果不指定类型，库的类型将由 `BUILD_SHARED_LIBS` 变量决定，如果这个变量为true则构建为共享库，否则构建为静态库。
- `<source1> <source2> ... <sourceN>` 是库的源文件列表。

**示例：**

```cmake
add_library( 
	# Sets the name of the library.
	native-lib
    # Sets the library as a shared library.
    SHARED
    # Provides a relative path to your source file(s).
    src/main/cpp/native-lib.cpp )
```

1. `native-lib`：设置本地 lib 的 name
2. `SHARED`：表示编译生成的是动态链接库。STATIC 表示是静态库
3. `src/main/cpp/native-lib.cpp`：表示编译文件的相对路径, 这里可以是一个文件的路径也可以是多个文件的路径

## Reference

- [CMake 入门实战 | HaHack](https://www.hahack.com/codes/cmake/)
- [x] cmake 使用方法详解 <https://www.cnblogs.com/lidabo/p/7359422.html>
- [x] Android NDK 开发之 CMake 必知必会 <https://juejin.im/post/5b9879976fb9a05d330aa206>

# CMake 案例

## 单个目录，单个文件

```cpp
cmake_minimum_required(VERSION 3.5.0)
project(CMakeHelloWorld VERSION 0.1.0 LANGUAGES C CXX)
add_executable(CMakeHelloWorld1 main.cpp)
```

## 同一个目录多个源文件

见[[#多个子目录源文件添加]]

### `file`

用 `file(GLOB xxx *.cpp)`

```cpp
cmake_minimum_required(VERSION 3.0)

project(Singleton)

set(CMAKE_CXX_STANDARD 11)

file(GLOB SOURCES "*.cpp")
add_executable(Singleton ${SOURCES})

// 或者
# file(GLOB_RECURSE MY_SOURCES "main.cpp" "string.cpp" "string.h")
# add_executable(MyString ${MY_SOURCES})
```

### `aux_source_directory`

## 配置文件复制到构建目录

目的：将源码中的一些配置文件复制到 build 目录，程序要用到里面的配置

### 通过 `configure_file`

解决：在你的 `CMakeLists.txt` 文件中，可以使用 `configure_file` 或 `file(COPY ...)` 命令来复制文件。

在根目录的 `CMakeLists.txt` 配置：

```cpp
# Copy the configuration file to the build directory
configure_file(
    ${CMAKE_SOURCE_DIR}/config/admin.txt
    ${CMAKE_BINARY_DIR}/admin.txt
    COPYONLY
)
configure_file(
    ${CMAKE_SOURCE_DIR}/config/computerRoom.txt
    ${CMAKE_BINARY_DIR}/computerRoom.txt
    COPYONLY
)
configure_file(
    ${CMAKE_SOURCE_DIR}/config/order.txt
    ${CMAKE_BINARY_DIR}/order.txt
    COPYONLY
)
configure_file(
    ${CMAKE_SOURCE_DIR}/config/student.txt
    ${CMAKE_BINARY_DIR}/student.txt
    COPYONLY
)
# configure_file(
#     ${CMAKE_SOURCE_DIR}/config/teacher.txt
#     ${CMAKE_BINARY_DIR}/teacher.txt
#     COPYONLY
# )   
# 或者，使用以下命令将teacher.txt文件复制到构建目录，DESTINATION填写目录
file(COPY ${CMAKE_SOURCE_DIR}/config/teacher.txt
    DESTINATION ${CMAKE_BINARY_DIR}/)
```

- `configure_file` 这个命令会在配置 (CMake 运行)时执行文件复制；它不会在每次构建时重新复制
- `file(COPY xxx)` 命令会立即执行文件复制，而不管是否进行构建。

### 多个目录，多个源文件

1. 使用 `add_subdirectory` 命令：
   如果你的项目文件结构在不同的子目录中组织了代码，你可以在顶层 `CMakeLists.txt` 文件中使用 `add_subdirectory` 命令来添加这些子目录。每个子目录应包含自己的 `CMakeLists.txt` 文件，其中定义了如何构建在该目录中的源文件。

2. 显式指定源文件：
   在每个子目录的 `CMakeLists.txt` 中，你可以显式列出所有的源文件，并使用 `add_executable` 或 `add_library` 来构建它们。

3. 使用 `file(GLOB)` 或 `file(GLOB_RECURSE)`：
   你也可以在各个 `CMakeLists.txt` 文件中使用 `file(GLOB)` 或 `file(GLOB_RECURSE)` 命令来自动查找匹配给定模式的文件。这种方法的缺点是，当新文件被添加到目录中时，CMake可能不会自动检测到变化，你可能需要重新运行 CMake。

举一个项目结构的例子：

```cpp
/my_project
    CMakeLists.txt (顶层)
    /src
        CMakeLists.txt
        main.cpp
        helper.cpp
    /include
        helper.h
    /libs
        /math
            CMakeLists.txt
            add.cpp
            subtract.cpp
            math_functions.h
```

顶层 `CMakeLists.txt`:

```cpp
cmake_minimum_required(VERSION 3.10)
project(MyProject)

# 指定包含目录
include_directories(include)

# 添加 src 子目录
add_subdirectory(src)

# 添加 libs 子目录
add_subdirectory(libs)
```

/src/CMakeLists.txt:

```cpp
# 列出所有在 src 目录下的源文件
set(SOURCE_FILES
    main.cpp
    helper.cpp
)

# 如果源文件非常多，也可以使用 file(GLOB...
# file(GLOB SOURCE_FILES *.cpp)

# 添加可执行目标
add_executable(my_executable ${SOURCE_FILES})

# 链接 libraries 如果有的话
target_link_libraries(my_executable math_lib)
```

/libs/math/CMakeLists.txt:

```cpp
# 为 math 库创建一个库目标
file(GLOB MATH_SOURCES "*.cpp")
add_library(math_lib STATIC ${MATH_SOURCES})
```

### 将复制操作加入到构建过程

如果你希望在每次构建时都执行复制操作，可以创建一个自定义目标并使用 `add_custom_command` 或 `add_custom_target` 命令。

**使用 add_custom_command 命令：**

```cpp
add_custom_command(
   TARGET MyTarget PRE_BUILD
   COMMAND ${CMAKE_COMMAND} -E copy
		   ${CMAKE_SOURCE_DIR}/path/to/source/file.txt
		   ${CMAKE_BINARY_DIR}/path/to/destination/file.txt)
```

在这里，`MyTarget` 应当被替换为实际目标（比如可执行文件或库），该命令会在构建 `MyTarget` 前复制文件。

**使用 add_custom_target 命令：** 来创建一个独立的自定义目标，然后将它添加到构建的所有目标中：

```cpp
add_custom_target(CopyFiles ALL
   COMMAND ${CMAKE_COMMAND} -E copy
		   ${CMAKE_SOURCE_DIR}/path/to/source/file.txt
		   ${CMAKE_BINARY_DIR}/path/to/destination/file.txt)
```

在这里，`ALL` 选项表示随着项目的所有目标一起构建这个自定义目标。

## CMake 在 Android Studio 中示例

### 简单示例

```txt
# 设置 cmake 最小支持版本
cmake_minimum_required(VERSION 3.4.1)

# 创建一个库
add_library( # 库名称，比如现在会生成 native-lib.so
             native-lib

             # 设置是动态库（SHARED）还是静态库（STATIC）
             SHARED

             # 设置源文件的相对路径
             native-lib.cpp )
             
 # 搜索并指定预构建库并将路径存储为变量。
 # NDK中已经有一部分预构建库（比如 log），并且ndk库已经是被配置为cmake搜索路径的一部分
 # 可以不写 直接在 target_link_libraries 写上log
 find_library( # 设置路径变量的名称
              log-lib

              # 指定要CMake定位的NDK库的名称
              log )
              
 # 指定CMake应链接到目标库的库。你可以链接多个库，例如构建脚本、预构建的第三方库或系统库。
 target_link_libraries( # Specifies the target library.
                       native-lib
                       ${log-lib} )
```

Gradle 配置：

```groovy
android {
    compileSdkVersion 29
    buildToolsVersion "29.0.1"
    defaultConfig {
        ...
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        // 设置编译版本
        externalNativeBuild {
            cmake {
                abiFilters "armeabi-v7a","x86"
            }
        }
    }
    //...
    // 设置配置文件路径
    externalNativeBuild {
        cmake {
            path "src/main/cpp/CMakeLists.txt"
            version "3.10.2"
        }
    }
}
```

### 添加源文件，支持多个源文件

```txt
add_library( 
             native-lib
             SHARED
             native-lib.cpp
             // 添加 extra.h 
             extra.h )
             
# 当然如果源文件非常多，并且可能在不同的文件夹下，像上面明确的引入各个文件就会非常繁琐，此时可以批量引入

# 如果文件太多，可以批量加载，下面时将 cpp 文件夹下所有的源文件定义成了 SOURCE（后面的源文件使用相对路径）
file(GLOB SOURCE *.cpp *.h)

add_library(
        native-lib
        SHARED
        # 引入 SOURCE 下的所有源文件
        ${SOURCE}
        )
```

### 添加第三方动态库

**第三方库的存放位置：**
动态库必须放到 `src/main/jniLibs/xxabi` 目录下才能被打包到 apk 中，这里用的是虚拟机，所以用的是 x86 平台，所以我们放置一个第三方库 `libexternal.so` 到 `src/main/jniLibs/x86` 下面

**配置 CMakeLists.txt：**

```txt
cmake_minimum_required(VERSION 3.4.1)

# 如果文件太多，可以批量加载，下面时将 cpp 文件夹下所有的源文件定义成了 SOURCE（后面的源文件使用相对路径）
file(GLOB SOURCE src/main/cpp/*.cpp src/main/cpp/*.h)

add_library(
        native-lib
        SHARED
        # 引入 SOURCE 下的所有源文件
        ${SOURCE}
        )
set_target_properties(native-lib PROPERTIES LINKER_LANGUAGE CXX)

#add_library( # Sets the name of the library.
#             native-lib
#
#             # Sets the library as a shared library.
#             SHARED
#
#             # Provides a relative path to your source file(s).
#             native-lib.cpp
#             extra.h )

find_library(
              log-lib
              log )

# ==================引入外部 so===================
message("ANDROID_ABI : ${ANDROID_ABI}")
message("CMAKE_SOURCE_DIR : ${CMAKE_SOURCE_DIR}")
message("PROJECT_SOURCE_DIR : ${PROJECT_SOURCE_DIR}")

# external 代表第三方 so - libexternal.so
# SHARED 代表动态库，静态库是 STATIC；
# IMPORTED: 表示是以导入的形式添加进来(预编译库)
add_library(external SHARED IMPORTED)

#设置 external 的 导入路径(IMPORTED_LOCATION) 属性,不可以使用相对路径
# CMAKE_SOURCE_DIR: 当前cmakelists.txt的路径 （cmake工具内置的）
# android cmake 内置的 ANDROID_ABI :  当前需要编译的cpu架构
set_target_properties(external PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/src/main/jniLibs/x86/libexternal.so)
#set_target_properties(external PROPERTIES LINKER_LANGUAGE CXX)

# ==================引入外部 so end===================

target_link_libraries( # Specifies the target library.
                       native-lib

                       # Links the target library to the log library
                       # included in the NDK.
                       ${log-lib}
                       # 链接第三方 so
                       external
        )
```

**增加 CMake 查找路径：**
除了上面的方式还可以给 CMake 增加一个查找 so 的 path，当我们 `target_link_libraries` `external` 的时候就会在该路径下找到。

```txt
#=====================引入外部 so 的第二种方式===============================

# 直接给 cmake 在添加一个查找路径，在这个路径下可以找到 external

# CMAKE_C_FLAGS 代表使用 c 编译， CMAKE_CXX_FLAGS 代表 c++
# set 方法 定义一个变量 CMAKE_C_FLAGS = "${CMAKE_C_FLAGS} XXXX"
# -L: 库的查找路径 libexternal.so
#set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -L${CMAKE_SOURCE_DIR}/src/main/jniLibs/${ANDROID_ABI} ")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -L${CMAKE_SOURCE_DIR}/src/main/jniLibs/x86")
#=====================引入外部 so 的第二种方式 end===============================
```
