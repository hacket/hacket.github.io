---
date created: 2024-03-07 20:17
date updated: 2025-01-02 23:26
dg-publish: true
image-auto-upload: true
feed: show
format: list
---

# Python基础

## Python解释器

有很多Python解释器

1. CPython

从Python官方网站下载并安装好Python 3.x后，我们就直接获得了一个官方版本的解释器：CPython。这个解释器是用C语言开发的，所以叫CPython。在命令行下运行python就是启动CPython解释器。CPython是使用最广的Python解释器。

2. IPython

IPython是基于CPython之上的一个交互式解释器，也就是说，IPython只是在交互方式上有所增强，但是执行Python代码的功能和CPython是完全一样的。CPython用`>>>`作为提示符，而IPython用`In [序号]:`作为提示符。

3. PyPy

PyPy是另一个Python解释器，它的目标是执行速度。PyPy采用JIT技术，对Python代码进行动态编译（注意不是解释），所以可以显著提高Python代码的执行速度。<br>绝大部分Python代码都可以在PyPy下运行，但是PyPy和CPython有一些是不同的，这就导致相同的Python代码在两种解释器下执行可能会有不同的结果。

4. Jython

Jython是运行在Java平台上的Python解释器，可以直接把Python代码编译成Java字节码执行。

5. IronPython

IronPython和Jython类似，只不过IronPython是运行在微软.Net平台上的Python解释器，可以直接把Python代码编译成.Net的字节码。

## IDE/编辑器

1. Visual Studio Code
2. PyCharm CE
3. <https://pyscript.net/> 在线

### PyCharm

#### 常用设置

##### 在新的界面或当前界面打开一个项目

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1703039344433-fa0bf0a5-665f-4439-9fc7-a208975d9f5e.png)

##### PyCharm 导入自己的模块没有智能提示的解决办法

1. 在 `PyCharm` 界面中右击你想要导入模块的 `py` 文件夹，选择 `Make Diretory as`
2. **然后选择 `Sourse Root
3. 或者 `File–>setting–>project:你的工程名–>project structure–>选中上方的Sourse–>点击ADD content root手动添加即可`
4. 在导入的模块添加 `__init__.py`，多一层文件夹添加一个 `__init__.py`

# 基本语法

## 变量

### 变量命名

在Python程序中，变量是用一个变量名表示，变量名必须是大小写英文、数字和下划线（`_`）的组合，且不能用数字开头<br>在Python中，等号`=`是赋值语句，可以把任意数据类型赋值给变量，同一个变量可以反复赋值，而且可以是不同类型的变量<br>这种变量本身类型不固定的语言称之为动态语言，与之对应的是静态语言。

### 变量使用

**变量不需要关键字声明，还可以随意赋值，也可以是不同的类型**

```python
a = 321
b = 12
print(a + b)    # 333
print(a - b)    # 309
print(a * b)    # 3852
print(a / b)    # 26.75
```

使用type函数对变量的类型进行检查：

```python
a = 100
b = 12.345
c = 1 + 5j
d = 'hello, world'
e = True
print(type(a))    # <class 'int'>
print(type(b))    # <class 'float'>
print(type(c))    # <class 'complex'>
print(type(d))    # <class 'str'>
print(type(e))    # <class 'bool'>
```

### 变量作用域

Python查找一个变量时会按照“局部作用域”、“嵌套作用域”、“全局作用域”和“内置作用域”的顺序进行搜索：

```python
def foo():
    b = 'hello' # foo函数局部作用域

    # Python中可以在函数内部再定义函数
    def bar():
        c = True # bar函数局部作用域
        print(a)
        print(b)
        print(c)

    bar()
    # print(c)  # NameError: name 'c' is not defined


if __name__ == '__main__':
    a = 100 # 全局变量
    # print(b)  # NameError: name 'b' is not defined
    foo()
```

打印：100、hello和True

glabal声明全局变量：

```python
def foo():
    global a
    a = 200
    print(a)  # 200


if __name__ == '__main__':
    a = 100
    foo()
    print(a)  # 200
```

## 控制语句

### if else

#### if

Python代码的**缩进**规则。具有相同缩进的代码被视为代码块，上面的3，4行 print 语句就构成一个代码块（但不包括第5行的print）。如果 if 语句判断为 True，就会执行这个代码块。

```python
age = 20
if age >= 18:
    print 'your age is', age
    print 'adult'
print 'END'
```

缩进请严格按照Python的习惯写法：4个空格，不要使用Tab，更不要混合Tab和空格，否则很容易造成因为缩进引起的语法错误。<br>注意: if 语句后接表达式，然后用`:`表示代码块开始。

#### if else

```python
if age >= 18:
    print 'adult'
else:
    print 'teenager'
```

注意: else 后面有个`:`。

#### if elif else

` if ... 多个elif ... else ...  `的结构，一次写完所有的规则

```python
if age >= 18:
    print 'adult'
elif age >= 6:
    print 'teenager'
elif age >= 3:
    print 'kid'
else:
    print 'baby'
```

### while

```python
N = 10
x = 0
while x < N:
    print x
    x = x + 1
```

### for in

在Python中，如果给定一个list或tuple，我们可以通过for循环来遍历这个list或tuple，这种遍历我们成为迭代（Iteration）。<br>在Python中，迭代是通过 `for ... in` 来完成的，而很多语言比如C或者Java，迭代list是通过下标完成的

```python
L = ['Adam', 'Lisa', 'Bart']
for name in L:
    print name
```

双层for：

```python
for x in range(1,10):
    for y in range(x+1,10):
        print x*10+y
```

Python 的 for循环不仅可以用在list或tuple上，还可以作用在其他任何可迭代对象上。

> 注意: 集合是指包含一组元素的数据结构，我们已经介绍的包括：
>
> 1. 有序集合：list，tuple，str和unicode；
> 2. 无序集合：set
> 3. 无序集合并且具有 key-value 对：dict

### 迭代之索引迭代

Python中，迭代永远是取出元素本身，而非元素的索引。<br>使用 `enumerate()` 函数进行索引迭代

```python
>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']
>>> for index, name in enumerate(L):
...     print index, '-', name
... 
0 - Adam
1 - Lisa
2 - Bart
3 - Paul
```

使用 enumerate() 函数，我们可以在for循环中同时绑定索引index和元素name。但是，这不是 enumerate() 的特殊语法。实际上，enumerate() 函数把：

```python
['Adam', 'Lisa', 'Bart', 'Paul']
```

变成了类似：

```python
[(0, 'Adam'), (1, 'Lisa'), (2, 'Bart'), (3, 'Paul')]
```

因此，迭代的每一个元素实际上是一个tuple:

```python
for t in enumerate(L):
    index = t[0]
    name = t[1]
    print index, '-', name
```

我们知道每个tuple元素都包含两个元素，for循环又可以进一步简写为：

```python
for index, name in enumerate(L):
    print index, '-', name
```

案例：在迭代 ['Adam', 'Lisa', 'Bart', 'Paul'] 时，如果我们想打印出名次 - 名字（名次从1开始)，请考虑如何在迭代中打印出来。

```python
L = ['Adam', 'Lisa', 'Bart', 'Paul']
for index, name in zip(range(1,len(L)+1),L):
    print index, '-', name
```

## 数据类型

在Python中，能够直接处理的数据类型有以下几种：

### 整数

Python可以处理任意大小的整数，当然包括负整数，在Python程序中，整数的表示方法和数学上的写法一模一样，例如：1，100，-8080，0，等等。<br>计算机由于使用二进制，所以，有时候用十六进制表示整数比较方便，十六进制用0x前缀和0-9，a-f表示，例如：0xff00，0xa5b4c3d2，等等。

1. 十六进制，以`0x`开头
2. 八进制，以`0`开头

```python
0xff
07
```

### 浮点数

浮点数也就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，比如，1.23x109和12.3x108是相等的。浮点数可以用数学写法，如1.23，3.14，-9.01，等等。但是对于很大或很小的浮点数，就必须用科学计数法表示，把10用e替代，1.23x10^9就是1.23e9，或者12.3e8，0.000012可以写成1.2e-5，等等。<br>整数和浮点数在计算机内部存储的方式是不同的，整数运算永远是精确的（除法难道也是精确的？是的），而浮点数运算则可能会有四舍五入的误差。

```python
1.23e9
1.23*10**9
```

### 布尔值

布尔值和布尔代数的表示完全一致，一个布尔值只有`True`、`False`两种值，要么是True，要么是False，在Python中，可以直接用True、False表示布尔值（请注意大小写），也可以通过布尔运算计算出来。

```python
>>> True
True
>>> False
False
>>> 3 > 2
True
>>> 3 > 5
False
```

布尔值可以用`and`、`or`和`not`运算。

- `and`运算是与运算，只有所有都为 True，and运算结果才是 True
- `or`运算是或运算，只要其中有一个为 True，or 运算结果就是 True
- `not`运算是非运算，它是一个单目运算符，把 True 变成 False，False 变成 True

**Python把**`**0**`**、空字符串**`**''**`**和**`**None**`**看成 False，其他数值和非空字符串都看成 True**

### 字符串

见`Python字符串`

### 空值

空值是Python里一个特殊的值，用`None`表示。None不能理解为0，因为0是有意义的，而None是一个特殊的空值。<br>此外，Python还提供了列表、字典等多种数据类型，还允许创建自定义数据类型。

### 类型转换

可以使用Python中内置的函数对变量类型进行转换。

- int()：将一个数值或字符串转换成整数，可以指定进制。
- float()：将一个字符串转换成浮点数。
- str()：将指定的对象转换成字符串形式，可以指定编码。
- chr()：将整数转换成该编码对应的字符串（一个字符）。
- ord()：将字符串（一个字符）转换成对应的编码（整数）。

## 运算符

Python支持多种运算符，下表大致按照优先级从高到低的顺序列出了所有的运算符：

| 运算符                                                                          | 描述              |        |
| ---------------------------------------------------------------------------- | --------------- | ------ |
| `[]` `[:]`                                                                   | 下标，切片           |        |
| `**`                                                                         | 指数              |        |
| `~` `+` `-`                                                                  | 按位取反, 正负号       |        |
| `*` `/` `%` `//`                                                             | 乘，除，模，整除        |        |
| `+` `-`                                                                      | 加，减             |        |
| `>>` `<<`                                                                    | 右移，左移           |        |
| `&`                                                                          | 按位与             |        |
| `^` `\|` `&`                                                                 | 按位异或 ^ ,按位或     | ,按位与 & |
| `<=` `<` `>` `>=`                                                            | 小于等于，小于，大于，大于等于 |        |
| `==`  `!=`                                                                   | 等于，不等于          |        |
| `is` `is not`                                                                | 身份运算符           |        |
| `in` `not in`                                                                | 成员运算符           |        |
| `not` `or` `and`                                                             | 逻辑运算符           |        |
| `=` `+=` `-=` `*=` `/=` `%=` `//=` `**=` `&=` `&#124;=` <br>`^=` `>>=` `<<=` | （复合）赋值运算符       |        |

## 模块

### 什么是Python模块？

Python中每个文件就代表了一个模块（module），我们在不同的模块中可以有同名的函数。

### 使用模块

在使用函数的时候我们通过import关键字导入指定的模块就可以区分到底要使用的是哪个模块中的foo函数：

```python
# module1.py
def foo():
    print('hello, world!')

# module2.py
def foo():
    print('goodbye, world!')

# test.py
from module1 import foo
# 输出hello, world!
foo()

from module2 import foo
# 输出goodbye, world!
foo()
```

也可以按照如下所示的方式来区分到底要使用哪一个foo函数：

```python
import module1 as m1
import module2 as m2

m1.foo()
m2.foo()
```

注意：如果我们导入的模块除了定义函数之外还有可以执行代码，那么Python解释器在导入这个模块时就会执行这些代码，事实上我们可能并不希望如此，因此如果我们在模块中编写了执行代码，最好是将这些执行代码放入如下所示的条件中，这样的话除非直接运行该模块，if条件下的这些代码是不会执行的，因为只有直接执行的模块的名字才是"`__main__`"。

```python
def foo():
    pass


def bar():
    pass


# __name__是Python中一个隐含的变量它代表了模块的名字
# 只有被Python解释器直接执行的模块的名字才是__main__
if __name__ == '__main__':
    print('call foo()')
    foo()
    print('call bar()')
    bar()
```

```python
import module3

# 导入module3时 不会执行模块中if条件成立时的代码 因为模块的名字是module3而不是__main__
```

### 包

Python按目录来组织模块的方法，称为包（Package）。
每一个包目录下面都会有一个`__init__.py` 的文件，这个文件是必须存在的，否则，Python就把这个目录当成普通目录，而不是一个包。`__init__.py`可以是空文件，也可以有Python代码

```
mycompany
├─ __init__.py
├─ abc.py
└─ xyz.py
```

其他py文件引入：

```python
import mypack.abc as abc
abc.abc_fun()
```

- 包也可以是多级目录，每层包都有一个`__init__.py`
- 自己创建模块时要注意命名，不能和Python自带的模块名称冲突。例如，系统自带了sys模块，自己的模块就不可命名为sys.py，否则将无法导入系统自带的sys模块。最好先查看系统是否已存在该模块，检查方法是在Python交互环境执行`import abc`，若成功则说明系统存在此模块。

一个包中可以包含多个模块（Python 文件），一个模块（Python 文件）可以包含多个独立功能的函数。

> Package > module > function

### import

可以通过 `as` 来给模块设定别名缩写，方便引用。

#### import

```python
# import 模块
import module1[, module2[,... moduleN]]

# import 模块中的函数
import module.function  # 等价于 from module import function
```

#### `from…import`

```python
# 格式
from modname import name1[, name2[, ... nameN]]

# import 模块中函数
from module import function

# import 包中的模块
from package import module as alias
```

#### `from…import*`

把一个模块的所有内容全都导入到当前的命名空间。

```python
from module import *
```

#### 跨包引用

- 将项目的根目录加到PYTHONPATH变量中
- `sys.path.append("..")`

```
project
├── package1
│   ├── __init__.py
│   ├── module_11.py
│   └── module_12.py
├── package2
│   ├── __init__.py
│   ├── module_21.py
│   └── module_22.py
├── main.py
└── tool.py
```

- 导入同级模块

```python
# module_11.py文件导入module_12.py模块
import module_12
```

- 导入下级模块

```python
# ain.py文件导入module_12.py模块 
from package1 import module_12
# 或者
import package1.module_12
```

- 导入上级模块

```python
# module_11.py导入上级目录的tool.py模块
import sys 
sys.path.append("..") 

import tool
# 相当于通过sys.path.append("..")进入上级目录，然后类似导入同级目录模块的方式导入。
```

- 导入跨包下级模块

```python
# module_11.py导入package2包的module_21.py模块
import sys 
sys.path.append("..") 

from package2 import module_21
# 相当于通过sys.path.append("..")进入上级目录，然后类似导入下级目录模块的方式导入。
```

### 搜索路径

Python解析器对模块位置的搜索顺序：

1. 当前目录。
2. `PYTHONPATH` 的每个目录。
3. 查看Python安装时的默认包路径。例如：`/usr/lib64/python2.6/site-packages`。

可以通过查询 `sys.path` 查看模块搜索路径。

环境变量 `PYTHONPATH` 有多个目录组成，类似环境变量 PATH:

```
export PYTHONPATH=/usr/local/lib/python
```

## 包管理器

在Python中，安装第三方模块，是通过包管理工具`pip`完成的。

- Mac和Linux自带pip工具
- Windows需要安装pip

### 设置镜像源

pip install pip-setting

输入 pip-setting, 选择阿里源

清华源：`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple +模块名`

### 安装三方库

`pip install xxx`

## 日志

### Python 给屏幕打印信息加上颜色

```python
# !/usr/bin/env python
# -*- coding:utf-8 -*-
from enum import Enum

class Color(Enum):
    BLACK = 30
    RED = 31
    GREEN = 32
    YELLOW = 33
    BLUE = 34
    MAGENTA = 35
    CYAN = 36
    WHITE = 37


def print_color(text: str, fg: Color = Color.BLACK.value):
    print(f'\033[{fg}m{text}\033[0m')


# 打印红色文字
print_color('Hello World', fg=Color.RED.value)
print_color('Hello World', fg=Color.BLACK.value)
print_color('Hello World', fg=Color.GREEN.value)
print_color('Hello World', fg=Color.YELLOW.value)
print_color('Hello World', fg=Color.BLUE.value)
print_color('Hello World', fg=Color.MAGENTA.value)
print_color('Hello World', fg=Color.CYAN.value)
print_color('Hello World', fg=Color.WHITE.value)

```

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1690977116054-1fd0e8f7-24ac-4786-b87c-0488ec6213a3.png#averageHue=%232c4751&clientId=u69f72ab6-3481-4&from=paste&height=112&id=ub3ab3e37&originHeight=224&originWidth=238&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22814&status=done&style=none&taskId=u8c921f19-b159-4738-ac4d-a4665242453&title=&width=119)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1690976996332-02e24f63-18cf-48fd-a708-385de0c69f07.png#averageHue=%23286c81&clientId=u69f72ab6-3481-4&from=paste&height=649&id=u6b81572f&originHeight=1297&originWidth=915&originalType=binary&ratio=2&rotation=0&showTitle=false&size=403707&status=done&style=none&taskId=u50563d15-b396-4fae-8b7c-4b28ca0ed23&title=&width=457.5)
