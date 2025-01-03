---
date created: Friday, December 27th 2020, 11:47:00 pm
date updated: Saturday, January 4th 2025, 12:18:45 am
title: Python技巧
dg-publish: true
layout: post
categories:
  - Python
image-auto-upload: true
feed: show
format: list
aliases: [命令行参数]
linter-yaml-title-alias: 命令行参数
---

# 命令行参数

## sys.args 简单参数

Python 内置的 `sys.argv` 保存了完整的参数列表

- 第 1 个参数是脚本本身
- 从第 2 个开始是参数

```python
import sys

file = sys.argv[0]
source = sys.argv[1]
target = sys.argv[2]

print(sys.argv) # ['sys.py', 'abc', 'def', 'g']
print(len(sys.argv)) # 4

print(file) # sys.py
print(source) # abc
print(target) # def
```

## [argparse](https://docs.python.org/zh-cn/3/library/argparse.html#module-argparse) 库 命令行选项、参数和子命令解析器

### [ArgumentParser对象](https://docs.python.org/zh-cn/3/library/argparse.html#argumentparser-objects)

```python
def __init__(self,
    prog=None,
    usage=None,
    description=None,
    epilog=None,
    parents=[],
    formatter_class=HelpFormatter,
    prefix_chars='-',
    fromfile_prefix_chars=None,
    argument_default=None,
    conflict_handler='error',
    add_help=True,
    allow_abbrev=True,
    exit_on_error=True):
```

主要参数介绍：

- prog：The name of the program (default: `sys.argv[0]`)
- usage：脚本用途，默认是根据 prog 和定义的参数来生成的

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1698931150541-93f7dd2d-a895-4a59-9ae7-f39d08ffcab6.png#averageHue=%232b2c2f&clientId=u3366a8a2-539f-4&from=paste&height=46&id=u5a3a85cc&originHeight=92&originWidth=1882&originalType=binary&ratio=2&rotation=0&showTitle=false&size=35670&status=done&style=none&taskId=u04b30a7a-b56d-4920-ae45-ad7d8347df8&title=&width=941)

- description 脚本的说明
- epilog 参数描述后面的文本
- argument_default 所有参数的默认值

### [add_argument方法](https://docs.python.org/zh-cn/3/library/argparse.html#the-add-argument-method)

给一个 ArgumentParser 添加程序参数信息，是通过调用 add_argument() 方法完成的

> parser.add_argument(name or flags…[, action][, nargs][, const][, default][, type][,choices][, required][, help][, metavar][, dest])

add_argument 参数解释：

- **name or flags** 普通参数或 flag 参数选项参数的名称或标签，例如 epochs 或者 -e, --epochs。flag 参数不需要指定参数值，只需要带有参数名即可。
- **action** 命令行遇到 flags 参数时的动作。常见的动作：
  - store_true：设定 flag 参数为 True，后面不需要跟值
  - store_false：设定 flag 参数为 False，后面不需要跟值
  - store: 值为传递的值

```python
parser.add_argument("--p2", action='store', default="p2_default")
python3 arg_demo.py --p2 p2val 
```

- store_const 表示赋值为 const；store_const 的参数后面不用跟具体的值

```python
parser.add_argument("--p1", action='store_const', const="p1_const", default="p1_default")
python3 arg_demo.py --p1 ### 取值为const，即p1_const
python3 arg_demo.py ### 没有指定默认值为p1_default
```

- append 将遇到的值存储成列表，也就是如果参数重复则会保存多个值
- append_const 将参数规范中定义的一个值保存到一个列表；
- count 存储遇到的次数；此外，也可以继承 argparse.Action 自定义参数解析；
- help
- version
- 注意：如果直接运行程序，默认不读取该变量，要使用必须要进行传参，例如：python try.py --epochs
- **nargs** 参数可被使用的次数（`int`, `'?'`, `'*'` 或 `'+'`），可以是具体的数字，或者是?号，当不指定值时对于 Positional argument 使用 default，对于 Optional argument 使用 const；或者是 * 号，表示 0 或多个参数；或者是 + 号表示 1 或多个参数
- **choices**： 参数可允许的值的一个容器。`['foo', 'bar']`, `range(1, 10)` 或 `Container 实例`
- **default**: 不指定参数时该参数的默认值，默认 `None`
- **type**: 命令行参数应该被转换成的数据类型，`int, float, argparse.FileType('w')` 或 `可调用函数`
- **required**: 是否为必选参数或可选参数，`True` 或 `False`
- help: 某个参数的帮助消息
- metavar： 在 usage 说明中的参数名称，对于必选参数，默认就是参数名称，对于可选参数默认是全大写的参数名称。
- dest： 解析后的参数名称，默认情况下，对于可选参数选取最长的名称，中划线转换为下划线.
- const： action 和 nargs 所需要的常量值。

位置参数（positional arguments）：必须填写<br>可选择参数（options）：根据 required 来定是否未必填

### 示例

### 示例 1：位置参数和可选参数

```python
parser.add_argument('filename')           # positional argument
parser.add_argument('-c', '--count')      # option that takes a value
parser.add_argument('-v', '--verbose',
                    action='store_true')  # on/off flag
### 解析参数
args = parser.parse_args()
print(args.filename, args.count, args.verbose)
```

> python3 arg_demo.py filename -c c -v

### 示例 2：获取一个整数列表并计算总和或者最大值

```python
import argparse

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('integers', metavar='N', type=int, nargs='+',
                    help='an integer for the accumulator')
parser.add_argument('--sum', dest='accumulate', action='store_const',
                    const=sum, default=max,
                    help='sum the integers (default: find the max)')

args = parser.parse_args()
print(args.accumulate(args.integers))
```

当使用适当的参数运行时，它会输出命令行传入整数的总和或者最大值：

> python prog.py 1 2 3 4
> 4
> python prog.py 1 2 3 4 --sum
> 10

如果传入了无效的参数，将显示一个错误消息:

> python prog.py a b c
> usage: prog.py [-h] [--sum] N [N …]
> prog.py: error: argument N: invalid int value: 'a'

### 示例 3：一个备份 MySQL 数据库的命令行程序

host 参数：表示 MySQL 主机名或 IP，不输入则默认为 localhost；<br>port 参数：表示 MySQL 的端口号，int 类型，不输入则默认为 3306；<br>user 参数：表示登录 MySQL 的用户名，必须输入；<br>password 参数：表示登录 MySQL 的口令，必须输入；<br>gz 参数：表示是否压缩备份文件，不输入则默认为 False；<br>outfile 参数：表示备份文件保存在哪，必须输入。<br>其中，outfile 是位置参数，而其他则是类似 --user root 这样的 " 关键字 " 参数。

```python
def main1():
    # 定义一个ArgumentParser实例:
    parser = argparse.ArgumentParser(
        prog='backup-mysql',
        usage="用于备份mysql",
        description='Backup mysql database.',
        epilog='参数描述后面的文本',
        argument_default=""
    )
    # 定义位置参数:
    parser.add_argument('outfile')
    # 定义关键字参数:
    parser.add_argument('--host', default='localhost')
    # 此参数必须为int类型:
    parser.add_argument('--port', default='3306', type=int)
    # 允许用户输入简写的-u:
    parser.add_argument('-u', '--user', required=True)
    parser.add_argument('-p', '--password', required=True)
    parser.add_argument('--database', required=True)
    # gz参数不跟参数值，因此指定action='store_true'，意思是出现-gz表示True:
    parser.add_argument('-gz', '--gzcompress', action='store_true', required=False, help='Compress backup files by gz.')

    # 解析参数:
    args = parser.parse_args()
    # 打印参数:
    print('parsed args:')
    print(f'host = {args.host}')
    print(f'port = {args.port}')
    print(f'user = {args.user}')
    print(f'password = {args.password}')
    print(f'database = {args.database}')
    print(f'gzcompress = {args.gzcompress}')

    print(f'sys.argv[0]={sys.argv[0]}')
```

> python3 back_mysql.py -u root -p hello --database testdb backup.sql
> parsed args:
> host = localhost
> port = 3306
> user = root
> password = hello
> database = testdb
> gzcompress =
> sys.argv[0]=arg_demo.py
