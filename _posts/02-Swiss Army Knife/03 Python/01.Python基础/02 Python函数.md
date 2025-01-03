---
date created: Thursday, March 7th 2024, 5:14:00 pm
date updated: Saturday, January 4th 2025, 12:25:02 am
title: 02 Python函数
dg-publish: true
layout: post
categories:
  - Python
image-auto-upload: true
feed: show
format: list
aliases: [函数]
linter-yaml-title-alias: 函数
---

# 函数

## 函数基础

### 函数定义（`def`）

在 Python 中，定义一个函数要使用 `def` 语句，依次写出 `函数名`、`括号`、`括号中的参数` 和冒号 `:`，然后，在缩进块中编写 `函数体`，函数的返回值用 `return` 语句返回。

```python
def my_abs(x):
    if x >= 0:
        return x
    else:
        return -x
```

请注意，函数体内部的语句在执行时，一旦执行到 return 时，函数就执行完毕，并将结果返回。因此，函数内部通过条件判断和循环可以实现非常复杂的逻辑。<br>如果没有 return 语句，函数执行完毕后也会返回结果，只是结果为 None。return None 可以简写为 return。

### 空函数 pass

定义一个什么事也不做的空函数，可以用 pass 语句：

```python
def nop():
    pass
```

pass 语句什么都不做，那有什么用？实际上 pass 可以用来作为占位符，比如现在还没想好怎么写函数的代码，就可以先放一个 pass，让代码能运行起来。<br>pass 还可以用在其他语句里，比如：

```python
if age >= 18:
    pass
# 缺少了pass，代码运行就会有语法错误
```

### 函数返回多个值（tuple）

在语法上，返回一个 tuple 可以省略括号，而多个变量可以同时接收一个 tuple，按位置赋给对应的值，所以，Python 的函数返回多值其实就是返回一个 tuple，但写起来更方便。

```python
import math
def move(x, y, step, angle):
    nx = x + step * math.cos(angle)
    ny = y - step * math.sin(angle)
    return nx, ny
    
>>> x, y = move(100, 100, 60, math.pi / 6)
>>> print x, y
151.961524227 70.0

>>> r = move(100, 100, 60, math.pi / 6)
>>> print r
(151.96152422706632, 70.0)
```

### 函数默认参数

函数的默认参数的作用是简化调用，你只需要把必须的参数传进去。但是在需要的时候，又可以传入额外的参数来覆盖默认参数值。

```python
def power(x, n=2):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s
```

由于函数的参数按从左到右的顺序匹配，所以 `**默认参数只能定义在必需参数的后面**`。

### 函数可变参数 （`*`）

让一个函数能接受任意个参数，我们就可以定义一个可变参数：

```python
def fn(*args):
    print args
```

可变参数的名字前面有个 `*` 号，我们可以传入 0 个、1 个或多个参数给可变参数：

```python
>>> fn()
()
>>> fn('a')
('a',)
>>> fn('a', 'b')
('a', 'b')
>>> fn('a', 'b', 'c')
('a', 'b', 'c')
```

可变参数也不是很神秘，Python 解释器会把传入的一组参数组装成一个 tuple 传递给可变参数，因此，在函数内部，直接把变量 args 看成一个 tuple 就好了。

### 关键字参数 （`**kw`）

可变参数允许你传入 `0个或任意个` 参数，这些可变参数在函数调用时自动组装为一个 tuple。而关键字参数允许你传入 `0个或任意个含参数名` 的参数，这些关键字参数在函数内部自动组装为一个 dict

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

>>> person('Bob', 35, city='Beijing')
name: Bob age: 35 other: {'city': 'Beijing'}
>>> person('Adam', 45, gender='M', job='Engineer')
name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}
```

关键字参数有什么用？它可以扩展函数的功能。<br>和可变参数类似，也可以先组装出一个 dict，然后，把该 dict 转换为关键字参数传进去：

```python
>>> extra = {'city': 'Beijing', 'job': 'Engineer'}
>>> person('Jack', 24, city=extra['city'], job=extra['job'])
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}
```

可以用简化的写法：

```python
>>> extra = {'city': 'Beijing', 'job': 'Engineer'}
>>> person('Jack', 24, **extra)
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}
```

`**extra` 表示把 extra 这个 dict 的所有 key-value 用关键字参数传入到函数的 `**kw` 参数，kw 将获得一个 dict，注意 kw 获得的 dict 是 extra 的一份拷贝，对 kw 的改动不会影响到函数外的 extra。

### 命名关键字参数（`*`）

对于关键字参数，函数的调用者可以传入任意不受限制的关键字参数。至于到底传入了哪些，就需要在函数内部通过 kw 检查。<br>示例：person() 函数，我们希望检查是否有 city 和 job 参数：

```python
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)
# 但是调用者仍可以传入不受限制的关键字参数：
>>> person('Jack', 24, city='Beijing', addr='Chaoyang', zipcode=123456)
```

要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收 city 和 job 作为关键字参数。这种方式定义的函数如下：

```python
def person(name, age, *, city, job):
    print(name, age, city, job)
```

**和关键字参数**`****kw**`**不同，命名关键字参数需要一个特殊分隔符**`*****`**，_后面的参数被视为命名关键字参数。_*

```python
# 命名关键字参数调用：
>>> person('Jack', 24, city='Beijing', job='Engineer')
Jack 24 Beijing Engineer
```

如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符 `*` 了：

```python
def person(name, age, *args, city, job):
    print(name, age, args, city, job)
```

`**命名关键字参数必须传入参数名，这和位置参数不同。如果没有传入参数名**`，调用将报错：

> > > > person('Jack', 24, 'Beijing', 'Engineer')
>
> Traceback (most recent call last):
> File "<stdin>", line 1, in <module>
> TypeError: person() missing 2 required keyword-only arguments: 'city' and 'job'

由于调用时缺少参数名 city 和 job，Python 解释器把前两个参数视为位置参数，后两个参数传给 *args，但缺少命名关键字参数导致报错。<br>命名关键字参数可以有缺省值，从而简化调用：

```python
def person(name, age, *, city='Beijing', job):
    print(name, age, city, job)
# 由于命名关键字参数city具有默认值，调用时，可不传入city参数：
>>> person('Jack', 24, job='Engineer')
Jack 24 Beijing Engineer
```

使用命名关键字参数时，要特别注意，如果没有可变参数，就必须加一个 `*` 作为特殊分隔符。如果缺少 *，Python 解释器将无法识别位置参数和命名关键字参数：

```python
def person(name, age, city, job):
    # 缺少 *，city和job被视为位置参数
    pass
```

### 参数组合

在 Python 中定义函数，可以用必选参数、默认参数、可变参数、关键字参数和命名关键字参数，这 5 种参数都可以组合使用。但是请注意，参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。<br>比如定义一个函数，包含上述若干种参数：

```python
def f1(a, b, c=0, *args, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c=0, *, d, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)
```

在函数调用的时候，Python 解释器自动按照参数位置和参数名把对应的参数传进去。

```python
>>> f1(1, 2)
a = 1 b = 2 c = 0 args = () kw = {}
>>> f1(1, 2, c=3)
a = 1 b = 2 c = 3 args = () kw = {}
>>> f1(1, 2, 3, 'a', 'b')
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {}
>>> f1(1, 2, 3, 'a', 'b', x=99)
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {'x': 99}
>>> f2(1, 2, d=99, ext=None)
a = 1 b = 2 c = 0 d = 99 kw = {'ext': None}
```

最神奇的是通过一个 tuple 和 dict，你也可以调用上述函数：

```python
>>> args = (1, 2, 3, 4)
>>> kw = {'d': 99, 'x': '#'}
>>> f1(*args, **kw)
a = 1 b = 2 c = 3 args = (4,) kw = {'d': 99, 'x': '#'}
>>> args = (1, 2, 3)
>>> kw = {'d': 88, 'x': '#'}
>>> f2(*args, **kw)
a = 1 b = 2 c = 3 d = 88 kw = {'x': '#'}
```

所以，**对于任意函数，都可以通过类似**`**func(*args, **kw)**`**的形式调用它，无论它的参数是如何定义的。**

### 内建函数

- dir()<br>返回对象属性
- type<br>返回对象类型

# Python 函数式编程

## 函数式编程概念

函数式编程是一种编程范式。<br>函数式编程特点：

1. 把计算视为函数而非指令
2. 纯函数式编程：不需要变量，没有副作用，测试简单
3. 支持高阶函数，代码简洁

Python 支持的函数式编程

1. Python 不是纯函数式编程，允许有变量
2. 支持高阶函数，函数也可以作为变量传入
3. 支持闭包，有了闭包就能返回函数
4. 有限度地支持匿名函数

## Python 高阶函数

### 高阶函数定义

能接收函数做参数和返回值的函数

#### 函数作为参数

```python
# 案例1
def add(x,y,f): # add就是一个高阶函数
    return f(x)+f(y)

def testFun1():
    print add(-10,-4,abs)
    pass

# 案例2
import math

def add(x, y, f):
    return f(x) + f(y)

print add(25, 9, math.sqrt)
```

#### 函数作为返回值

高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回。<br>来实现一个可变参数的求和。通常情况下，求和的函数是这样定义的：

```python
def calc_sum(*args):
    ax = 0
    for n in args:
        ax = ax + n
    return ax
```

如果不需要立刻求和，而是在后面的代码中，根据需要再计算怎么办？可以不返回求和的结果，而是返回求和的函数：

```python
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum
```

### 内置高阶函数

#### map

map() 函数接收两个参数，一个是函数，一个是 Iterable，map 将传入的函数依次作用到序列的每个元素，并把结果作为新的 Iterator 返回：

```
f(x) = x * x
                  │
                  │
  ┌───┬───┬───┬───┼───┬───┬───┬───┐
  │   │   │   │   │   │   │   │   │
  ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼

[ 1   2   3   4   5   6   7   8   9 ]

  │   │   │   │   │   │   │   │   │
  │   │   │   │   │   │   │   │   │
  ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼

[ 1   4   9  16  25  36  49  64  81 ]
```

代码实现：

```python
>>> def f(x):
...     return x * x
...
>>> r = map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9])
>>> list(r)
[1, 4, 9, 16, 25, 36, 49, 64, 81]
```

#### reduce

`reduce()` 函数也是 Python 内置的一个高阶函数。reduce() 函数接收的参数和 map() 类似，一个函数 f，一个 list，但行为和 map() 不同，reduce() 传入的函数 f 必须接收两个参数，reduce() 对 list 的每个元素反复调用函数 f，并返回最终结果值。

```python
def f(x, y):
    return x + y

print reduce(f,[1,3,5,7,9]) # 25
```

上述计算实际上是对 list 的所有元素求和。虽然 Python 内置了求和函数 `sum()`，但是，利用 `reduce()` 求和也很简单。<br>reduce() 还可以接收第 3 个可选参数，作为计算的初始值。如果把初始值设为 100：

```python
reduce(f, [1, 3, 5, 7, 9], 100) # 1 25
```

#### filter

`filter()` 函数是 Python 内置的另一个有用的高阶函数，filter() 函数接收一个函数 f 和一个 list，这个函数 f 的作用是对每个元素进行判断，返回 True 或 False，filter() 根据判断结果自动过滤掉不符合条件的元素，返回由符合条件元素组成的新 list。(返回 True 保留，False 的过滤掉)

```python
# 请利用filter()过滤出1~100中平方根是整数的数，即结果应该是：[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
import math


def is_sqr(x):
    y = math.sqrt(x)
    return y%1==0


print filter(is_sqr, range(1, 101))
```

#### sorted

sorted() 也是一个高阶函数，它可以接收一个比较函数来实现自定义排序，比较函数的定义是，传入两个待比较的元素 x, y，如果 x 应该排在 y 的前面，返回 -1，如果 x 应该排在 y 的后面，返回 1。如果 x 和 y 相等，返回 0。

```python
# 对字符串排序时，有时候忽略大小写排序更符合习惯。请利用sorted()高阶函数，实现忽略大小写排序的算法。

def cmp_ignore_case(s1, s2):
    s11 = str(s1).lower()
    s22 = str(s2).lower()
    return cmp(s11,s22)


print sorted(['bob', 'about', 'Zoo', 'Credit'], cmp_ignore_case)
```

## 闭包

```python
def calc_sum(lst):
    def lazy_sum():
        return sum(lst)
    return lazy_sum
```

像这种内层函数引用了外层函数的变量（参数也算变量），然后返回内层函数的情况，称为闭包 Closure。<br>**闭包的特点：**<br>返回的函数还引用了外层函数的局部变量，所以，要正确使用闭包，就要确保引用的局部变量在函数返回后不能变

```python
# 希望一次返回3个函数，分别计算1x1,2x2,3x3:
def count():
    fs = []
    for i in range(1, 4):
        def f():
             return i*i
        fs.append(f)
    return fs

f1, f2, f3 = count()
```

你可能认为调用 f1()，f2() 和 f3() 结果应该是 1，4，9，但实际结果全部都是 9。<br>原因就是当 count() 函数返回了 3 个函数时，这 3 个函数所引用的变量 i 的值已经变成了 3。由于 f1、f2、f3 并没有被调用<br>所以，此时他们并未计算 i*i，当 f1 被调用时，i 的值已经变为 3。<br>**返回函数不要引用任何循环变量，或者后续会发生变化的变量。**<br>返回闭包不能引用循环变量，请改写 count() 函数，让它正确返回能计算 1x1、2x2、3x3 的函数。

```python
def count():
    fs = []
    for i in range(1, 4):
        def f(j):
            def g():
                return j**2
            return g # 返回闭包g，g所引用的变量j不是循环变量，不会变 
        r = f(i)
        fs.append(r)
    return fs

f1, f2, f3 = count()
print f1(), f2(), f3() // 1, 4, 9
```

## 匿名函数

高阶函数可以接收函数做参数，有些时候，我们不需要显式地定义函数，直接传入**匿名函数**更方便。

```python
def testAnonymous():
    c = map(lambda x: x * x, range(1, 10))
    print c
```

### lambda

其中 `lambda x: x * x` 就是匿名函数 ，实际上就是：

```python
def f(x):
    return x * x
```

关键字 `lambda` 表示匿名函数，冒号前面的 `x` 表示函数参数。

- **匿名函数有个限制**，就是只能有一个表达式，不写 return，返回值就是该表达式的结果
- 用匿名函数有个好处，因为函数没有名字，不必担心函数名冲突

```python
>>> sorted([1, 3, 9, 5, 0], lambda x,y: -cmp(x,y))
[9, 5, 3, 1, 0]
```

- 匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数

```python
>>> f = lambda x: x * x
>>> f
<function <lambda> at 0x101c6ef28>
>>> f(5)
25
```

- 返回函数的时候，也可以返回匿名函数：

```python
def build(x, y):
    return lambda: x * x + y * y
```

### 示例

```python
def is_odd(n):
    return n % 2 == 1


# 非匿名函数
L = list(filter(is_odd, range(1, 20)))
print(L)
# 匿名函数
L1 = list(filter(lambda n: n % 2 == 1, range(1, 20)))
print(L1)

```
