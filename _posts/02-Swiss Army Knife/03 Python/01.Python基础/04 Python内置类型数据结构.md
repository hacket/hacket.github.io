---
date created: Thursday, January 2nd 2025, 11:26:00 pm
date updated: Saturday, January 4th 2025, 12:25:13 am
title: 04 Python内置类型数据结构
dg-publish: true
layout: post
categories:
  - Python
feed: show
format: list
image-auto-upload: true
aliases: [list 列表]
linter-yaml-title-alias: list 列表
---

# list 列表

list 是一种结构化的、非标量类型，它是值的有序序列，每个值都可以通过索引进行标识，定义列表可以将列表的元素放在 `[]` 中，多个元素用,进行分隔，可以使用 for 循环对列表元素进行遍历，也可以使用 `[]` 或 `[:]` 运算符取出列表中的一个或多个元素。

## List 声明

- list 中的元素是按照顺序排列的。
- 用 `[ ]` 把 list 的所有元素都括起来，就是一个 list 对象。
- 由于 Python 是动态语言，所以 list 中包含的元素并不要求都必须是同一种数据类型，我们完全可以在 list 中包含各种数据。
- 一个元素也没有的 list，就是空 list。

```python
classmates = ['Michael', 'Bob', 'Tracy']
print classmates

L = ['Michael', 100, True]
print L

empty_list = []
```

- 生成式和生成器生成 list

```python
f = [x for x in range(1, 10)]
print(f)

f = [x + y for x in 'ABCDE' for y in '1234567']
print(f)
# 用列表的生成表达式语法创建列表容器
# 用这种语法创建列表之后元素已经准备就绪所以需要耗费较多的内存空间
f = [x ** 2 for x in range(1, 1000)]
print(sys.getsizeof(f))  # 查看对象占用内存的字节数
print(f)

# 请注意下面的代码创建的不是一个列表而是一个生成器对象
# 通过生成器可以获取到数据但它不占用额外的空间存储数据
# 每次需要数据的时候就通过内部的运算得到数据(需要花费额外的时间)
f = (x ** 2 for x in range(1, 1000))
print(sys.getsizeof(f))  # 相比生成式生成器不占用存储数据的空间
print(f)
for val in f:
    print(val)
```

## List 访问

### len()

len() 函数可以获得 list 元素的个数

```python
list1 = [1, 3, 5, 7, 100]
print(list1) # [1, 3, 5, 7, 100]
# 乘号表示列表元素的重复
list2 = ['hello'] * 3
print(list2) # ['hello', 'hello', 'hello']
# 计算列表长度(元素个数)
print(len(list1)) # 5
```

### 访问

#### 顺序访问

通过索引来获取 list 中的指定元素：`L[0]`。当索引超出了范围时，Python 会报一个 `IndexError` 错误<br>要取最后一个元素，除了计算索引位置外，还可以用 `-1` 做索引，直接获取最后一个元素

#### 倒序访问 list

用负数，-1 表示最后一个元素

#### 遍历

```python
list1 = [1, 3, 5, 7, 100]
print(list1) # [1, 3, 5, 7, 100]

# 通过循环用下标遍历列表元素
for index in range(len(list1)):
    print(list1[index])
    
# 通过for循环遍历列表元素
for elem in list1:
    print(elem)
    
# 通过enumerate函数处理列表之后再遍历可以同时获得元素索引和值
for index, elem in enumerate(list1):
    print(index, elem)
```

### 示例

```python
list1 = [1, 3, 5, 7, 100]
print(list1) # [1, 3, 5, 7, 100]
# 乘号表示列表元素的重复
list2 = ['hello'] * 3
print(list2) # ['hello', 'hello', 'hello']

# 下标(索引)运算
print(list1[0]) # 1
print(list1[4]) # 100
# print(list1[5])  # IndexError: list index out of range
print(list1[-1]) # 100
print(list1[-3]) # 5
```

### 添加元素 append 或 insert

- append()

第一个办法是用 list 的 `append()` 方法，追加到 list 的末尾

```python
>>> L = ['Adam', 'Lisa', 'Bart']
>>> L.append('Paul')
>>> print L
['Adam', 'Lisa', 'Bart', 'Paul']
```

- insert()

list 的 `insert()` 方法，它接受两个参数，第一个参数是索引号，第二个参数是待添加的新元素：

```python
>>> L = ['Adam', 'Lisa', 'Bart']
>>> L.insert(0, 'Paul')
>>> print L
['Paul', 'Adam', 'Lisa', 'Bart']
```

### 删除元素 remove 或 pop

- `pop()` 方法总是删掉 list 的最后一个元素，并且它还返回这个元素

```python
>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']
>>> L.pop()
'Paul'
>>> print L
['Adam', 'Lisa', 'Bart']
```

- `pop(i)` 删除 list 指定位置元素，其中 i 是索引位置

```python
list1 = [1, 3, 5, 7, 100]
# 添加元素
list1.append(200)
list1.insert(1, 400)
# 合并两个列表
# list1.extend([1000, 2000])
list1 += [1000, 2000]
print(list1) # [1, 400, 3, 5, 7, 100, 200, 1000, 2000]
print(len(list1)) # 9
# 先通过成员运算判断元素是否在列表中，如果存在就删除该元素
if 3 in list1:
	list1.remove(3)
if 1234 in list1:
    list1.remove(1234)
print(list1) # [1, 400, 5, 7, 100, 200, 1000, 2000]
# 从指定的位置删除元素
list1.pop(0)
list1.pop(len(list1) - 1)
print(list1) # [400, 5, 7, 100, 200, 1000]
# 清空列表元素
list1.clear()
print(list1) # []
```

### 替换元素

要把某个元素替换成别的元素，可以直接赋值给对应的索引位置：

```python
classmates[1] = 'Sarah'
```

也可以用负数索引

### list 切片操作

和字符串一样，列表也可以做切片操作，通过切片操作我们可以实现对列表的复制或者将列表中的一部分取出来创建出新的列表

```python
fruits = ['grape', 'apple', 'strawberry', 'waxberry']
fruits += ['pitaya', 'pear', 'mango']
# 列表切片
fruits2 = fruits[1:4]
print(fruits2) # apple strawberry waxberry
# 可以通过完整切片操作来复制列表
fruits3 = fruits[:]
print(fruits3) # ['grape', 'apple', 'strawberry', 'waxberry', 'pitaya', 'pear', 'mango']
fruits4 = fruits[-3:-1]
print(fruits4) # ['pitaya', 'pear']
# 可以通过反向切片操作来获得倒转后的列表的拷贝
fruits5 = fruits[::-1]
print(fruits5) # ['mango', 'pear', 'pitaya', 'waxberry', 'strawberry', 'apple', 'grape']
```

### 排序

```python
list1 = ['orange', 'apple', 'zoo', 'internationalization', 'blueberry']
list2 = sorted(list1)
# sorted函数返回列表排序后的拷贝不会修改传入的列表
# 函数的设计就应该像sorted函数一样尽可能不产生副作用
list3 = sorted(list1, reverse=True)
# 通过key关键字参数指定根据字符串长度进行排序而不是默认的字母表顺序
list4 = sorted(list1, key=len)
print(list1)
print(list2)
print(list3)
print(list4)
# 给列表对象发出排序消息直接在列表对象上进行排序
list1.sort(reverse=True)
print(list1)
```

# tuple 元组 `()`

## tuple 定义

tuple 是另一种有序的列表，中文翻译为 " 元组 "。tuple 和 list 非常类似，但是，tuple 一旦创建完毕，就不能修改了

- 创建 tuple 和创建 list 唯一不同之处是用 `( )` 替代了 `[ ]`，元祖不可变
- 获取 tuple 元素的方式和 list 是一模一样的，我们可以正常使用 `t[0]`，`t[-1]` 等索引方式访问元素，但是不能赋值成别的元素；没有 append()，insert() 这样的方法。
- 不可变的 tuple 有什么意义？因为 tuple 不可变，所以代码更安全。如果可能，能用 tuple 代替 list 就尽量用 tuple。

```python
# 定义元组
t = ('hacket', 30, True, '四川成都')
print(t)
# 获取元组中的元素
print(t[0])
print(t[3])
# 遍历元组中的值
for member in t:
    print(member)
# 重新给元组赋值
# t[0] = '王大锤'  # TypeError
# 变量t重新引用了新的元组原来的元组将被垃圾回收
t = ('王大锤', 20, True, '云南昆明')
print(t)
# 将元组转换成列表
person = list(t)
print(person)
# 列表是可以修改它的元素的
person[0] = '李小龙'
person[1] = 25
print(person)
# 将列表转换成元组
fruits_list = ['apple', 'banana', 'orange']
fruits_tuple = tuple(fruits_list)
print(fruits_tuple)
```

## 单元素 tuple

`()` 既可以表示 tuple，又可以作为括号表示运算时的优先级，结果 (1) 被 Python 解释器计算出结果 1，导致我们得到的不是 tuple，而是整数 1。<br>正是因为用 () 定义单元素的 tuple 有歧义，所以 Python 规定，单元素 tuple 要多加一个逗号 `,`，这样就避免了歧义：

```python
>>> t = (1,)
>>> print t
(1,)
```

Python 在打印单元素 tuple 时，也自动添加了一个 `,`，为了更明确地告诉你这是一个 tuple。

## " 可变的 "tuple

```python
>>> t = ('a', 'b', ['A', 'B'])
>>> t[2][0] = 'X'
>>> t[2][1] = 'Y'
>>> t
('a', 'b', ['X', 'Y'])
```

> 表面上看，tuple 的元素确实变了，但其实变的不是 tuple 的元素，而是 list 的元素。tuple 一开始指向的 list 并没有改成别的 list，所以，tuple 所谓的 " 不变 " 是说，tuple 的每个元素，指向永远不变。即指向 'a'，就不能改成指向 'b'，指向一个 list，就不能改成指向其他对象，但指向的这个 list 本身是可变的。

## tuple 和 list 对比

有了列表这种数据结构，为什么还需要元组这样的类型呢？

1. 元组中的元素是无法修改的，事实上我们在项目中尤其是 [多线程](https://zh.wikipedia.org/zh-hans/%E5%A4%9A%E7%BA%BF%E7%A8%8B) 环境（后面会讲到）中可能更喜欢使用的是那些不变对象（一方面因为对象状态不能修改，所以可以避免由此引起的不必要的程序错误，简单的说就是一个不变的对象要比可变的对象更加容易维护；另一方面因为没有任何一个线程能够修改不变对象的内部状态，一个不变对象自动就是线程安全的，这样就可以省掉处理同步化的开销。一个不变对象可以方便的被共享访问）。所以结论就是：如果不需要对元素进行添加、删除、修改的时候，可以考虑使用元组，当然如果一个方法要返回多个值，使用元组也是不错的选择。
2. 元组在创建时间和占用的空间上面都优于列表。我们可以使用 sys 模块的 `getsizeof` 函数来检查存储同样的元素的元组和列表各自占用了多少内存空间，这个很容易做到。我们也可以在 ipython 中使用魔法指令 `%timeit` 来分析创建同样内容的元组和列表所花费的时间，

测试：<br>![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1708534287066-25f500e9-1693-43ee-a153-8408cfeb352e.png#averageHue=%23010203&clientId=u96fd8143-7db2-4&from=paste&height=277&id=u386f5384&originHeight=416&originWidth=986&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=210782&status=done&style=none&taskId=ub0246db8-cf0c-4cc3-8ada-e3013230d5d&title=&width=657.3333333333334)

# dict 字典 `{key:value}`

## dict 定义

dict 类似 Java 中的 Map，key/value 结构。花括号 `{}` 表示这是一个 dict，然后按照 `key: value`, 写出来即可。最后一个 key: value 的逗号可以省略。

```python
# 创建字典的字面量语法
scores = {'hacket': 95, '白元芳': 78, '狄仁杰': 82}
print(scores)
# 创建字典的构造器语法
items1 = dict(one=1, two=2, three=3, four=4)
# 通过zip函数将两个序列压成字典
items2 = dict(zip(['a', 'b', 'c'], '123'))
# 创建字典的推导式语法
items3 = {num: num ** 2 for num in range(1, 10)}
print(items1, items2, items3)
# 通过键可以获取字典中对应的值
print(scores['hacket'])
print(scores['狄仁杰'])
# 对字典中所有键值对进行遍历
for key in scores:
    print(f'{key}: {scores[key]}')
# 更新字典中的元素
scores['白元芳'] = 65
scores['诸葛王朗'] = 71
scores.update(冷面=67, 方启鹤=85)
print(scores)
if '武则天' in scores:
    print(scores['武则天'])
print(scores.get('武则天'))
# get方法也是通过键获取对应的值但是可以设置默认值
print(scores.get('武则天', 60))
# 删除字典中的元素
print(scores.popitem())
print(scores.popitem())
print(scores.pop('hacket', 100))
# 清空字典
scores.clear()
print(scores)
```

## dict 访问

### 方式 1：`[key]` 方式

使用 `dict[key]` 的形式来查找对应的 value，这和 list 很像，不同之处是，list 必须使用索引返回对应的元素，而 dict 使用 key

```python
d = {
    'Adam': 95,
    'Lisa': 85,
    'Bart': 59
}
>>> print d['Adam']
95
>>> print d['Paul']
Traceback (most recent call last):
  File "index.py", line 11, in <module>
    print d['Paul']
KeyError: 'Paul'
```

**注意:** 通过 key 访问 dict 的 value，只要 key 存在，dict 就返回对应的 value。如果 key 不存在，会直接报错：`KeyError`。<br>要避免 KeyError 发生，先判断一下 key 是否存在，用 in 操作符：

```python
if 'Paul' in d:
    print d['Paul']
```

### 方式 2：get 方式

```python
>>> print d.get('Bart')
59
>>> print d.get('Paul')
None
```

使用 dict 本身提供的一个 get 方法，在 Key 不存在的时候，返回 `None`。

## dict 更新

要把新同学 'Paul' 的成绩 72 加进去，用赋值语句：

```python
d = {
    'Adam': 95,
    'Lisa': 85,
    'Bart': 59
}
>>> d['Paul'] = 72
```

如果 key 已经存在，则赋值会用新的 value 替换掉原来的 value

## dict 遍历

### dict 遍历 key

由于 dict 也是一个集合，所以，遍历 dict 和遍历 list 类似，都可以通过 for 循环实现。<br>直接使用 for 循环可以遍历 dict 的 key

```python
d = {
    'Adam': 95,
    'Lisa': 85,
    'Bart': 59
}
for key in d:
    print key+":"+str(d[key])
```

### dict 遍历 value `values()/itervalues()`

dict 对象本身就是可迭代对象，用 for 循环直接迭代 dict，可以每次拿到 dict 的一个 key。dict 对象有一个 `values()` 方法，这个方法把 dict 转换成一个包含所有 value 的 list，这样，我们迭代的就是 dict 的每一个 value。

```python
d = { 'Adam': 95, 'Lisa': 85, 'Bart': 59 }
print d.values()
# [85, 95, 59]
for v in d.values():
    print v
# 85
# 95
# 59
```

dict 除了 values() 方法外，还有一个 `itervalues()` 方法，用 itervalues() 方法替代 values() 方法，迭代效果完全一样：

```python
d = { 'Adam': 95, 'Lisa': 85, 'Bart': 59 }
print d.itervalues()
# <dictionary-valueiterator object at 0x106adbb50>
for v in d.itervalues():
    print v
# 85
# 95
# 59
```

那这两个方法有何不同之处：

1. values() 方法实际上把一个 dict 转换成了包含 value 的 list。
2. 但是 itervalues() 方法不会转换，它会在迭代过程中依次从 dict 中取出 value，所以 itervalues() 方法比 values() 方法节省了生成 list 所需的内存。
3. 打印 itervalues() 发现它返回一个  对象，这说明在 Python 中，for 循环可作用的迭代对象远不止 list，tuple，str，unicode，dict 等，任何可迭代对象都可以作用于 for 循环，而内部如何迭代我们通常并不用关心。

### dict 遍历 key 和 value--item()/iteritems()

- items()

```python
>>> d = { 'Adam': 95, 'Lisa': 85, 'Bart': 59 }
>>> print d.items()
[('Lisa', 85), ('Adam', 95), ('Bart', 59)]
```

items() 方法把 dict 对象转换成了包含 tuple 的 list，我们对这个 list 进行迭代，可以同时获得 key 和 value：

```python
>>> for key, value in d.items():
...     print key, ':', value
... 
Lisa : 85
Adam : 95
Bart : 59
```

- iteritems()

和 values() 有一个 itervalues() 类似， items() 也有一个对应的 iteritems()，iteritems() 不把 dict 转换成 list，而是在迭代过程中不断给出 tuple，所以， iteritems() 不占用额外的内存。

## dict 特点

### 查找速度快

dict 的第一个特点是**查找速度快**，无论 dict 有 10 个元素还是 10 万个元素，查找速度都一样。而 list 的查找速度随着元素增加而逐渐下降。<br>不过 dict 的查找速度快不是没有代价的，dict 的缺点是占用内存大，还会浪费很多内容，list 正好相反，占用内存小，但是查找速度慢。<br>由于 dict 是按 key 查找，所以，在一个 dict 中，**key 不能重复**。

### 存储的 key-value 序对是没有顺序的

dict 内部是无序的，不能用 dict 存储有序的集合。

### 作为 key 的元素必须不可变

Python 的基本类型如字符串、整数、浮点数都是不可变的，都可以作为 key。但是 list 是可变的，就不能作为 key。

# set `{}`

set 和 dict 类似，也是一组 key 的集合，但不存储 value。由于 key 不能重复，所以，在 set 中，没有重复的 key。

## 创建 set

- 通过字面量 `{key1, key2, …}`
- 通过 range
- 通过 list 或 tuple
- 通过生成器

```python
# 创建集合的字面量语法
set1 = {1, 2, 3, 3, 3, 2}
print(set1)
print('Length =', len(set1))
# 创建集合的构造器语法(面向对象部分会进行详细讲解)
set2 = set(range(1, 10))
set3 = set((1, 2, 3, 3, 2, 1))
print(set2, set3)
# 创建集合的推导式语法(推导式也可以用于推导集合)
set4 = {num for num in range(1, 100) if num % 3 == 0 or num % 5 == 0}
print(set4)
```

打印：

> {1, 2, 3}
> Length = 3
> {1, 2, 3, 4, 5, 6, 7, 8, 9} {1, 2, 3}
> {3, 5, 6, 9, 10, 12, 15, 18, 20, 21, 24, 25, 27, 30, 33, 35, 36, 39, 40, 42, 45, 48, 50, 51, 54, 55, 57, 60, 63, 65, 66, 69, 70, 72, 75, 78, 80, 81, 84, 85, 87, 90, 93, 95, 96, 99}

## set 访问

由于 set 存储的是无序集合，所以我们没法通过索引来访问。<br>访问 set 中的某个元素实际上就是判断一个元素是否在 set 中。<br>用 `in` 操作符判断：

```python
s = set(['Adam', 'Lisa', 'Bart', 'Paul'])
'Bart' in s
```

## set 遍历

由于 set 也是一个集合，所以，遍历 set 和遍历 list 类似，都可以通过 for 循环实现。

```python
s = set([('Adam', 95), ('Lisa', 85), ('Bart', 59)])
for x in s:
    print x[0]+":"+str(x[1])
```

## 添加和删除元素

由于 set 存储的是一组不重复的无序元素，因此，更新 set 主要做两件事：<br>一是把新的元素添加到 set 中，二是把已有元素从 set 中删除。

- add(key)

添加元素时，用 set 的 `add()` 方法：

```python
>>> s = set([1, 2, 3])
>>> s.add(4)
>>> print s
set([1, 2, 3, 4])
```

如果添加的元素已经存在于 set 中，add() 不会报错，但是不会加进去了。

- remove(key)

删除 set 中的元素时，用 set 的 `remove()` 方法：

```python
>>> s = set([1, 2, 3, 4])
>>> s.remove(4)
>>> print s
set([1, 2, 3])
```

如果删除的元素不存在 set 中，remove() 会报错：

```python
>>> s = set([1, 2, 3])
>>> s.remove(4)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: 4
```

所以用 add() 可以直接添加，而 remove() 前需要判断。

- discard
- pop

```python
set1.add(4)
set1.add(5)
set2.update([11, 12])
set2.discard(5)
if 4 in set2:
    set2.remove(4)
print(set1, set2)
print(set3.pop())
print(set3)
```

## 交集、并集、差集等运算

```python
# 集合的交集、并集、差集、对称差运算
print(set1 & set2)
# print(set1.intersection(set2))

print(set1 | set2)
# print(set1.union(set2))

print(set1 - set2)
# print(set1.difference(set2))

print(set1 ^ set2)
# print(set1.symmetric_difference(set2))

# 判断子集和超集
print(set2 <= set1)
# print(set2.issubset(set1))

print(set3 <= set1)
# print(set3.issubset(set1))

print(set1 >= set2)
# print(set1.issuperset(set2))

print(set1 >= set3)
# print(set1.issuperset(set3))
```

> &运算符跟 intersection 方法的作用就是一样的，但是使用运算符让代码更加直观。

## set 和 dict 对比

set 和 dict 的唯一区别仅在于没有存储对应的 value，但是，set 的原理和 dict 一样，所以，同样不可以放入可变对象，因为无法判断两个可变对象是否相等，也就无法保证 set 内部 " 不会有重复元素 "。试试把 list 放入 set，看看是否会报错。

## `list`、`tuple`、`dict` 和 `set` 是四种常见的数据类型总结

- `list`（列表）是一种有序的可变序列，可以存储任意类型的元素。列表使用方括号 `[]` 来表示，元素之间用逗号 `,` 分隔。列表支持索引、切片、添加、删除、修改等操作，是 Python 中最常用的数据类型之一。
- `tuple`（元组）是一种有序的不可变序列，可以存储任意类型的元素。元组使用圆括号 `()` 来表示，元素之间用逗号 `,` 分隔。元组支持索引、切片等操作，但不支持添加、删除、修改等操作。元组通常用于存储不可变的数据，如坐标、颜色等。
- `dict`（字典）是一种无序的键值对集合，可以存储任意类型的键和值。字典使用花括号 `{}` 来表示，每个键值对之间用冒号 `:` 分隔，键值对之间用逗号 `,` 分隔。字典支持通过键来访问值，也支持添加、删除、修改等操作。字典通常用于存储具有映射关系的数据，如姓名和电话号码的对应关系。
- `set`（集合）是一种无序的元素集合，可以存储任意类型的元素。集合使用花括号 `{}` 来表示，元素之间用逗号 `,` 分隔。集合支持添加、删除、交集、并集、差集等操作。集合通常用于去重、交集、并集等操作。

需要注意的是，`list`、`tuple`、`dict` 和 `set` 是不同的数据类型，它们之间不能直接进行转换。如果需要将它们之间进行转换，需要使用相应的转换函数，如 `list()`、`tuple()`、`dict()` 和 `set()`。

# range 列表生成式

列表生成式即 List Comprehensions，是 Python 内置的非常简单却强大的可以用来创建 list 的生成式。

## 生成列表

用 `range(x,y)`，包括 x 不包括 y

```python
>>> range(1, 11)
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

但如果要生成 `[1x1, 2x2, 3x3, …, 10x10]` 怎么做

```python
>>> L = []
>>> for x in range(1, 11):
...    L.append(x * x)
... 
>>> L
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

也可以用 Python 特有的列表生成式，利用列表生成式，可以以非常简洁的代码生成 list。<br>写列表生成式时，把要生成的元素 `x * x` 放到前面，后面跟 for 循环，就可以把 list 创建出来：

```python
>>> [x * x for x in range(1, 11)]
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

## 条件过滤

列表生成式的 for 循环后面还可以加上 if 判断：

```python
>>> [x * x for x in range(1, 11)]
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

如果我们只想要偶数的平方，不改动 range() 的情况下，可以加上 if 来筛选：

```python
>>> [x * x for x in range(1, 11) if x % 2 == 0]
[4, 16, 36, 64, 100]
```

有了 if 条件，只有 if 判断为 True 的时候，才把循环的当前元素添加到列表中。

## 多层表达式

for 循环可以嵌套，因此，在列表生成式中，也可以用多层 for 循环来生成列表。<br>对于字符串 'ABC' 和 '123'，可以使用两层循环，生成全排列：

```python
>>> [m + n for m in 'ABC' for n in '123']
['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']
```

翻译成循环代码就像下面这样：

```python
L = []
for m in 'ABC':
    for n in '123':
        L.append(m + n)
```

# slice 切片

## 背景

对这种 `**经常取指定索引范围的操作**`，用循环十分繁琐，因此，Python 提供了切片（`slice`）操作符，能大大简化这种操作

## slice 正序

- `L[start:end]` 从 [start, end)，包括 start，不包括 end

```python
>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']
>>> L[0:3] # 取前3个元素
# L[0:3]表示，从索引0开始取，直到索引3为止，但不包括索引3。即索引0，1，2，正好是3个元素。
```

- `L[:end]`

如果第一个索引是 0，还可以省略：

```python
>>> L[:3]
['Adam', 'Lisa', 'Bart']
```

也可以从索引 1 开始，取出 2 个元素出来：

```python
>>> L[1:3]
['Lisa', 'Bart']
```

- `L[:]`

只用一个 `:`，表示从头到尾：

```python
>>> L[:]
['Adam', 'Lisa', 'Bart', 'Paul']
```

因此，`L[:]` 实际上复制出了一个新 list。

- `L[start:end:step]`，切片操作还可以指定第三个参数，表示每隔多少取一个；从 [start, end)，每隔 step 取 1 个数据

```python
L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack', 'hacket', 1.3, 4, True]
newL = L[0:len(L):2]
print(newL) # ['Michael', 'Tracy', 'Jack', 1.3, True]
```

小案例

```python
L = range(1, 101)

请利用切片，取出：

1. 前10个数；
2. 3的倍数；
3. 不大于50的5的倍数。

print L[0:10]
print L[2::3]
print L[4:50:5]
```

## slice 切片 (下标负数)

对于 list，既然 Python 支持 `L[-1]` 取倒数第一个元素，那么它同样支持倒数切片：

```python
>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']

>>> L[-2:]
['Bart', 'Paul']

>>> L[:-2]
['Adam', 'Lisa']

>>> L[-3:-1]
['Lisa', 'Bart']

>>> L[-4:-1:2]
['Adam', 'Bart']
```

记住倒数第一个元素的索引是 -1。倒序切片包含起始索引，不包含结束索引。<br>利用倒序切片对 1 - 100 的数列取出：

- 最后 10 个数；
- 最后 10 个 5 的倍数。

```python
L = range(1, 101)
print L[-10:]
print L[4::5][-10:]
```

## 对字符串切片

字符串 'xxx' 和 Unicode 字符串 u'xxx' 也可以看成是一种 list，每个元素就是一个字符。因此，字符串也可以用切片操作，只是操作结果仍是字符串：

```python
>>> 'ABCDEFG'[:3]
'ABC'
>>> 'ABCDEFG'[-3:]
'EFG'
>>> 'ABCDEFG'[::2]
'ACEG'
```

Python 没有针对字符串的截取函数，只需要切片一个操作就可以完成，非常简单。

## list、tuple 配合 slice

- 对于 list，只写 `list[:]` 就可以原样复制一个 list

```python
list = list(range(100))
# 复制一个list
L = list[:]
```

- tuple 也是一种 list，唯一区别是 tuple 不可变。因此，tuple 也可以用切片操作，只是操作的结果仍是 tuple：

```python
>>> (0, 1, 2, 3, 4, 5)[:3]
(0, 1, 2)
```
