---
date created: Friday, December 27th 2024, 11:48:00 pm
date updated: Saturday, January 4th 2025, 7:28:24 pm
title: Python内置模块
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories:
  - Python
aliases: [datetime]
linter-yaml-title-alias: datetime
---

# datetime

datetime 是 Python 处理日期和时间的标准库。

## 获取当前日期和时间

```python
>>> from datetime import datetime
>>> now = datetime.now() # 获取当前datetime
>>> print(now)
2015-05-18 16:28:07.198690
>>> print(type(now))
<class 'datetime.datetime'>
```

> [!NOTE] 注意
> 注意到 `datetime` 是模块，`datetime` 模块还包含一个 `datetime` 类，通过 `from datetime import datetime` 导入的才是 `datetime` 这个类。

- datetime.now() 返回当前日期和时间，其类型是 datetime

## 获取指定日期和时间

要指定某个日期和时间，我们直接用参数构造一个 datetime：

```python
>>> from datetime import datetime
>>> dt = datetime(2015, 4, 19, 12, 20) # 用指定日期时间创建datetime
>>> print(dt)
2015-04-19 12:20:00
```

## datetime 转换为 timestamp

在计算机中，时间实际上是用数字表示的。我们把 1970 年 1 月 1 日 00:00:00 UTC+00:00 时区的时刻称为 epoch time，记为 0（1970 年以前的时间 timestamp 为负数），当前时间就是相对于 epoch time 的秒数，称为**timestamp**。

> [!NOTE] 等价
>
> timestamp = 0 = 1970-1-1 00:00:00 UTC+0:00
> 对应的北京时间是：
> timestamp = 0 = 1970-1-1 08:00:00 UTC+8:00

可见 timestamp 的值与时区毫无关系，因为 timestamp 一旦确定，其 UTC 时间就确定了，转换到任意时区的时间也是完全确定的，这就是为什么计算机存储的当前时间是以 timestamp 表示的，因为全球各地的计算机在任意时刻的 timestamp 都是完全相同的（假定时间已校准）。

把一个 datetime 类型转换为 timestamp 只需要简单调用 timestamp() 方法：

```python
>>> from datetime import datetime
>>> dt = datetime(2015, 4, 19, 12, 20) # 用指定日期时间创建datetime
>>> dt.timestamp() # 把datetime转换为timestamp
1429417200.0
```

注意 Python 的 `timestamp` 是一个浮点数，整数位表示秒。

某些编程语言（如 Java 和 JavaScript）的 timestamp 使用整数表示毫秒数，这种情况下只需要把 timestamp 除以 1000 就得到 Python 的浮点表示方法。

## timestamp 转换为 datetime

要把 timestamp 转换为 `datetime`，使用 `datetime` 提供的 `fromtimestamp()` 方法：

```python
>>> from datetime import datetime
>>> t = 1429417200.0
>>> print(datetime.fromtimestamp(t))
2015-04-19 12:20:00
```

注意到 `timestamp是一个浮点数，它没有时区的概念，而datetime是有时区的`。上述转换是在 timestamp 和本地时间做转换。

本地时间是指当前操作系统设定的时区。

例如北京时区是东 8 区，则本地时间，实际上就是 UTC+8:00 时区的时间：

```python
2015-04-19 12:20:00 UTC+8:00
```

而此刻的格林威治标准时间与北京时间差了 8 小时，也就是 UTC+0:00 时区的时间应该是：

```python
2015-04-19 04:20:00 UTC+0:00
```

timestamp 也可以直接被转换到 UTC 标准时区的时间：

```python
>>> from datetime import datetime
>>> t = 1429417200.0
>>> print(datetime.fromtimestamp(t)) # 本地时间
2015-04-19 12:20:00
>>> print(datetime.utcfromtimestamp(t)) # UTC时间
2015-04-19 04:20:00
```

## str 转换为 datetime

把 str 转换为 datetime。转换方法是通过 `datetime.strptime()` 实现，需要一个日期和时间的格式化字符串：

```python
>>> from datetime import datetime
>>> cday = datetime.strptime('2015-6-1 18:19:59', '%Y-%m-%d %H:%M:%S')
>>> print(cday)
2015-06-01 18:19:59
```

字符串 `'%Y-%m-%d %H:%M:%S'` 规定了日期和时间部分的格式。详细的说明请参考 [Python文档](https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior)。

**注意：转换后的 datetime 是没有时区信息的**。

## datetime 转换为 str

如果已经有了 datetime 对象，要把它格式化为字符串显示给用户，就需要转换为 str，转换方法是通过 strftime() 实现的，同样需要一个日期和时间的格式化字符串：

```python
>>> from datetime import datetime
>>> now = datetime.now()
>>> print(now.strftime('%a, %b %d %H:%M'))
Mon, May 05 16:28
```

## datetime 加减

对日期和时间进行加减实际上就是把 datetime 往后或往前计算，得到新的 datetime。加减可以直接用 + 和 - 运算符，不过需要导入 timedelta 这个类：

```python
>>> from datetime import datetime, timedelta
>>> now = datetime.now()
>>> now
datetime.datetime(2015, 5, 18, 16, 57, 3, 540997)
>>> now + timedelta(hours=10)
datetime.datetime(2015, 5, 19, 2, 57, 3, 540997)
>>> now - timedelta(days=1)
datetime.datetime(2015, 5, 17, 16, 57, 3, 540997)
>>> now + timedelta(days=2, hours=12)
datetime.datetime(2015, 5, 21, 4, 57, 3, 540997)
```

使用 timedelta 你可以很容易地算出前几天和后几天的时刻。

## 本地时间转换为 UTC 时间

本地时间是指系统设定时区的时间，例如北京时间是 UTC+8:00 时区的时间，而 UTC 时间指 UTC+0:00 时区的时间。

一个 datetime 类型有一个时区属性 tzinfo，但是默认为 None，所以无法区分这个 datetime 到底是哪个时区，除非强行给 datetime 设置一个时区：

```python
>>> from datetime import datetime, timedelta, timezone
>>> tz_utc_8 = timezone(timedelta(hours=8)) # 创建时区UTC+8:00
>>> now = datetime.now()
>>> now
datetime.datetime(2015, 5, 18, 17, 2, 10, 871012)
>>> dt = now.replace(tzinfo=tz_utc_8) # 强制设置为UTC+8:00
>>> dt
datetime.datetime(2015, 5, 18, 17, 2, 10, 871012, tzinfo=datetime.timezone(datetime.timedelta(0, 28800)))
```

如果系统时区恰好是 UTC+8:00，那么上述代码就是正确的，否则，不能强制设置为 UTC+8:00 时区。

## 时区转换

可以先通过 utcnow() 拿到当前的 UTC 时间，再转换为任意时区的时间：

```python
# 拿到UTC时间，并强制设置时区为UTC+0:00:
>>> utc_dt = datetime.utcnow().replace(tzinfo=timezone.utc)
>>> print(utc_dt)
2015-05-18 09:05:12.377316+00:00
# astimezone()将转换时区为北京时间:
>>> bj_dt = utc_dt.astimezone(timezone(timedelta(hours=8)))
>>> print(bj_dt)
2015-05-18 17:05:12.377316+08:00
# astimezone()将转换时区为东京时间:
>>> tokyo_dt = utc_dt.astimezone(timezone(timedelta(hours=9)))
>>> print(tokyo_dt)
2015-05-18 18:05:12.377316+09:00
# astimezone()将bj_dt转换时区为东京时间:
>>> tokyo_dt2 = bj_dt.astimezone(timezone(timedelta(hours=9)))
>>> print(tokyo_dt2)
2015-05-18 18:05:12.377316+09:00
```

时区转换的关键在于，拿到一个 `datetime` 时，要获知其正确的时区，然后强制设置时区，作为基准时间。

利用带时区的 `datetime`，通过 `astimezone()` 方法，可以转换到任意时区。

注：不是必须从 UTC+0:00 时区转换到其他时区，任何带时区的 `datetime` 都可以正确转换，例如上述 `bj_dt` 到 `tokyo_dt` 的转换。

## 小结

`datetime` 表示的时间需要时区信息才能确定一个特定的时间，否则只能视为本地时间。

如果要存储 `datetime`，最佳方法是将其转换为 timestamp 再存储，因为 timestamp 的值与时区完全无关。

# collections

collections 是 Python 内建的一个集合模块，提供了许多有用的集合类。

常用的工具类：

- `namedtuple`：命令元组，它是一个类工厂，接受类型的名称和属性列表来创建一个类。
- `deque`：双端队列，是列表的替代实现。Python 中的列表底层是基于数组来实现的，而 deque 底层是双向链表，因此当你需要在头尾添加和删除元素时，deque 会表现出更好的性能，渐近时间复杂度为 $O(1)$。
- `Counter`：`dict` 的子类，键是元素，值是元素的计数，它的 `most_common()` 方法可以帮助我们获取出现频率最高的元素。`Counter` 和 `dict` 的继承关系我认为是值得商榷的，按照 CARP 原则，`Counter` 跟 `dict` 的关系应该设计为关联关系更为合理。
- `OrderedDict`：`dict` 的子类，它记录了键值对插入的顺序，看起来既有字典的行为，也有链表的行为。
- `defaultdict`：类似于字典类型，但是可以通过默认的工厂函数来获得键对应的默认值，相比字典中的 `setdefault()` 方法，这种做法更加高效。

## namedtuple

tuple 可以表示不变集合；namedtuple 是一个函数，它用来创建一个自定义的 tuple 对象，并且规定了 tuple 元素的个数，并可以用属性而不是索引来引用 tuple 的某个元素。这样一来，我们用 namedtuple 可以很方便地定义一种数据类型，它具备 tuple 的不变性，又可以根据属性来引用，使用十分方便。

```python
>>> from collections import namedtuple
>>> Point = namedtuple('Point', ['x', 'y'])
>>> p = Point(1, 2)
>>> p.x
1
>>> p.y
2

>>> isinstance(p, Point)
True
>>> isinstance(p, tuple)
True
```

## deque

使用 list 存储数据时，按索引访问元素很快，但是插入和删除元素就很慢了，因为 list 是线性存储，数据量大的时候，插入和删除效率很低。

deque 是为了高效实现插入和删除操作的双向列表，适合用于队列和栈：

```python
>>> from collections import deque
>>> q = deque(['a', 'b', 'c'])
>>> q.append('x')
>>> q.appendleft('y')
>>> q
deque(['y', 'a', 'b', 'c', 'x'])
```

deque 除了实现 list 的 append() 和 pop() 外，还支持 appendleft() 和 popleft()，这样就可以非常高效地往头部添加或删除元素。

## defaultdict

使用 dict 时，如果引用的 Key 不存在，就会抛出 KeyError。如果希望 key 不存在时，返回一个默认值，就可以用 defaultdict

```python
>>> from collections import defaultdict
>>> dd = defaultdict(lambda: 'N/A')
>>> dd['key1'] = 'abc'
>>> dd['key1'] # key1存在
'abc'
>>> dd['key2'] # key2不存在，返回默认值
'N/A'
```

## OrderedDict

使用 dict 时，Key 是无序的。在对 dict 做迭代时，我们无法确定 Key 的顺序。

如果要保持 Key 的顺序，可以用 OrderedDict：

- OrderedDict 的 Key 会按照插入的顺序排列，不是 Key 本身排序：
- OrderedDict 可以实现一个 FIFO（先进先出）的 dict，当容量超出限制时，先删除最早添加的 Key：

## ChainMap

`ChainMap` 可以把一组 `dict` 串起来并组成一个逻辑上的 `dict`。`ChainMap` 本身也是一个 dict，但是查找的时候，会按照顺序在内部的 dict 依次查找。

什么时候使用 `ChainMap` 最合适？举个例子：应用程序往往都需要传入参数，参数可以通过命令行传入，可以通过环境变量传入，还可以有默认参数。我们可以用 `ChainMap` 实现参数的优先级查找，即先查命令行参数，如果没有传入，再查环境变量，如果没有，就使用默认参数。

## Counter

Counter 是一个简单的计数器，Counter 实际上也是 dict 的一个子类，

# argparse

Python 内置的 sys.argv 保存了完整的参数列表，我们可以从中解析出需要的参数：

# base64

# struct

Python 提供了一个 struct 模块来解决 bytes 和其他二进制数据类型的转换。

struct 的 pack 函数把任意数据类型变成 bytes：

# hashlib

Python 的 hashlib 提供了常见的摘要算法，如 MD5，SHA1 等等。

## hmac

Python 自带的 hmac 模块实现了标准的 Hmac 算法

# itertools

Python 的内建模块 itertools 提供了非常有用的用于操作迭代对象的函数。

```python
"""
迭代工具模块
"""
import itertools

# 产生ABCD的全排列
itertools.permutations('ABCD')
# 产生ABCDE的五选三组合
itertools.combinations('ABCDE', 3)
# 产生ABCD和123的笛卡尔积
itertools.product('ABCD', '123')
# 产生ABC的无限循环序列
itertools.cycle(('A', 'B', 'C'))
```

# contextlib

# urllib

urllib 提供了一系列用于操作 URL 的功能。
