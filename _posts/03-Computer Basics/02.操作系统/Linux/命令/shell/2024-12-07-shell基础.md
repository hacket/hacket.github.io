---
date created: 2024-12-07 22:09
tags:
  - '#$A'
  - '#!/bin/bash'
  - '#调用函数并传递参数'
  - '#!/usr/bin/env'
  - '#echo'
  - '#do'
date updated: 2024-12-24 00:15
dg-publish: true
---

# Shell基础

## 什么是Shell？

Shell是一个连接用户和操作系统的应用程序，它提供了人机交互的界面（接口），用户通过这个界面访问操作系统内核的服务。Shell脚本是一种为Shell编写的脚本程序，我们可以通过Shell脚本来进行系统管理，同时也可以通过它进行文件操作

## 数组

```shell
A="a b c def" 　　#$A　　表示一个单一的字符串
A=(a b c def)    #$A　　表示为数组。

A=(a b c def)    # 定义$A数组
${A[@]} 或 ${A[*]}     可得到 a b c def (全部元素)
${A[0]}     可得到 a (第一个数组元素)，${A[1]} 则为第二个数组元素
${#A[@]} 或 ${#A[*]}     可得到 4 (全部数组数量)
${#A[0]}     可得到 1 (第一个数组元素(a)的长度)，
${#A[3]}     可得到 3 (第四个数组(def)的长度)
A[3]=xyz    将第4个数组重新定义为 xyz
```

案例1：

```shell
#!/bin/bash
ip_list=(10.6.207.1 10.6.207.11)
for i in ${ip_list[@]}
do
    echo $i 
done
```

## shell函数

### 函数定义

Shell 函数定义的语法格式如下：

```shell
function name() {
  statements
  [return value]
}
```

对各个部分的说明：

- `function`是 Shell 中的关键字，专门用来定义函数；
- name是函数名；
- statements是函数要执行的代码，也就是一组语句；
- `return value`表示函数的返回值，其中 return 是 Shell 关键字，专门用在函数中返回一个值；这一部分可以写也可以不写。
- 由`{ }`包围的部分称为函数体，调用一个函数，实际上就是执行函数体中的代码。

函数定义时也可以不写 `function` 关键字：

```shell
name() {
  statements
  [return value]
}
```

如果写了 function 关键字，也可以省略函数名后面的小括号：

```shell
function name {
  statements
  [return value]
}
```

函数参数：<br />Shell 函数在定义时不能指明参数，但是在调用时却可以传递参数，并且给它传递什么参数它就接收什么参数<br />定义一个函数，计算所有参数的和：

```shell
#!/bin/bash
function getsum(){
    local sum=0

    for n in $@
    do
         ((sum+=n))
    done

    return $sum
}
getsum 10 20 55 15  #调用函数并传递参数
echo $?
```

运行结果：<br />100

> `$@`表示函数的所有参数，`$?`表示函数的退出状态（返回值）

### 参数输入判断

#### 1个字符串参数不能为空

- `[ -n "$1" ]` $1非空
- `[ -z "${key}" ]` key为空

```shell
# 字符串为空判断
function checkOpts() {
    local key=$1
    if [[ -z "${key}" ]] ; then # -z为空
        echo -e "\033[31mFATAL: key should not be empty! \033[0m"
        return 1
    fi
}

# 字符串不为空判断
#!/bin/bash
echo "Shell 传递参数实例！";
echo "执行的文件名：$0";
echo "第一个参数为：$1";
echo "第二个参数为：$2";
echo "第三个参数为：$3";

arg1=arg;
if [ -n "$1" ] # -n非空
then
    echo "第一个参数$1"
else
    echo "第一个参数为空"
fi
```

#### 文件是否存在判断

- -f 文件是否存在

```shell
f [ ! -f "${path}" ]; then
    pwd
    echo -e "\033[31mFATAL: ${pwd}/$path 文件不存在 \033[0m"
    return 0
  fi
```

#### 2个字符串判断

```shell
if [ "$applicationId" = "$MAIN_APP_ID" ]; then
    echo "即将启动shein"
    adb:start:shein
elif [ "$applicationId" = "$SECOND_APP_ID" ]; then
    echo "即将启动romwe"
    adb:start:romwe
fi
```

#### 参数个数判断

```shell
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "没有输入参数"
elif [ $# -eq 1 ]; then
    echo "输入了一个参数"
else
    echo "输入了多个参数"
fi


# $#表示参数的个数
if [ $# -lt 2 ]; then # 小于2个参数
  echo -e "\033[31mFATAL 请输入至少2个参数，参数1：应用包名，参数2：包路径 \033[0m"
  echo "当前参数 $*"
  return 0
fi
```

> `#` 表示输入参数的个数。如果#等于0，则表示没有输入参数；如果#等于1，则表示只输入了一个参数；否则，表示输入了多个参数。根据#的值，脚本会输出不同的结果。使用这种方式，可以方便地判断输入参数的个数，并根据不同的情况执行不同的操作。

### 函数调用

不管是哪种形式，函数名字后面都不需要带括号。

- 调用 Shell 函数时可以给它传递参数，也可以不传递。如果不传递参数，直接给出函数名字
- 如果传递参数，那么多个参数之间以空格分隔
- Shell 也不限制定义和调用的顺序，你可以将定义放在调用的前面，也可以反过来，将定义放在调用的后面

### 函数案例

```shell
function test() {
    local p0=${0}
    local p1=${1}
    local p2=${2}
    local p3=${3}
    echo "p0=$p0, p1=$p1, p2=$p2, p3=$p3"
}
test "1" "2" "3"
```

输出：p0=shell.sh, p1=1, p2=2, p3=3

## Shell脚本参数传递的2种方法

### Shell特殊参数解释

1. `$*`<br />传递给脚本或函数的所有参数，参数用双引号也会被拆分
2. `$@`<br />传递给脚本或函数的所有参数，参数用双引号也会被拆分
3. `"$*"`<br />将所有的参数作为一个整体，包括空格的，双引号的
4. `"$@"`<br />会将各个参数分开，双引号的作为一个整体，空格区分参数

```
echo "print each param from \"\$@\""
for var in "$@"
do
    echo $var
done
```

<https://blog.csdn.net/beibei0921/article/details/45287855><br />$0表示命令本身，<br />S1表示第一个参数，<br />S2表示第二个参数，<br />测试：

```shell
#!/bin/bash
echo $0    # 当前脚本的文件名（间接运行时还包括绝对路径）。
echo $n    # 传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是 $1 。
echo $#    # 传递给脚本或函数的参数个数。
echo $*    # 传递给脚本或函数的所有参数。
echo $@    # 传递给脚本或函数的所有参数。被双引号 (" ") 包含时，与 $* 不同。
echo $?    # 上个命令的退出状态，或函数的返回值。
echo $$    # 当前 Shell 进程 ID。对于 Shell 脚本，就是这些脚本所在的进程 ID。
echo $_    # 上一个命令的最后一个参数
echo $!    # 后台运行的最后一个进程的 ID 号
```

./test.sh test test1 test2 test3 test4 输出：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1697960661843-e31918be-b6a5-4fbf-a74f-1225e6e5a8b8.png#averageHue=%232c2f36&clientId=u5e87fe30-d3d3-4&from=paste&height=240&id=ua4c87939&originHeight=480&originWidth=692&originalType=binary&ratio=2&rotation=0&showTitle=false&size=56531&status=done&style=none&taskId=u4db56e0f-3d52-463e-8c85-df2aa2123c3&title=&width=346)

- `$*` 和 `$@` 都表示传递给函数或脚本的所有参数，不被双引号 ("") 包含时，都以"$1""$2" … "$n" 的形式输出所有参数
- 但是当它们被双引号 ("") 包含时，`"$*"`会将所有的参数作为一个整体，以"$ 1  $2 … $n"的形式输出所有参数；`"$@"`会将各个参数分开，以"$1""$2" … "$n" 的形式输出所有参数。

### 方法1：$0,$1,$2..

采用$0,$1,$2..等方式获取脚本命令行传入的参数，值得注意的是，$0获取到的是脚本路径以及脚本名，后面按顺序获取参数，当参数超过10个时(包括10个)，需要使用${10},${11}....才能获取到参数。<br />优点：获取参数更容易，执行脚本时需要的输入少<br />缺点：必须按照顺序输入参数，如果中间漏写则参数对应就会错误

### 方法2：getopts

语法格式：`getopts [option[:]] [DESCPRITION] VARIABLE`

- option：表示为某个脚本可以使用的选项
- ":"：如果某个选项（option）后面出现了冒号（":"），则表示这个选项后面可以接参数（即一段描述信息DESCPRITION）；没有冒号表现该选项没有参数
- VARIABLE：表示将某个选项保存在变量VARIABLE中

```shell
#!/usr/bin/env bash
# -n 名称
# -a 作者
# -h 帮助
while getopts ":n:a:h" optname
do
    case "$optname" in
      "n")
        echo "get option -n,value is $OPTARG"
        ;;
      "q")
        echo "get option -a ,value is $OPTARG"
        ;;
      "h")
        echo "get option -h,eg:./test.sh -n 编程珠玑 -a 守望先生"
        ;;
      ":")
        echo "No argument value for option $OPTARG"
        ;;
      "?")
        echo "Unknown option $OPTARG"
        ;;
      *)
        echo "Unknown error while processing options"
        ;;
    esac
    #echo "option index is $OPTIND"
done
```

- n后面有`:`，表示该选项需要参数，而h后面没有:，表示不需要参数
- 最开始的一个冒号，表示出现错误时保持静默，并抑制正常的错误消息

测试：

> $ ./test.sh -a
> No argument value for option a
>
> $ ./test.sh -h
> get option -h,eg:./test.sh -n 编程珠玑 -a 守望先生
>
> $ ./test.sh -n 编程珠玑 -a 守望先生
> get option -a ,value is 守望先生

## `> /dev/null`

`> /dev/null`: 这部分命令将命令的输出重定向到 /dev/null 文件，因此结果不会在终端中显示。它只是让执行命令的用户获得的返回值。如果包已安装，则该命令将返回“0”，否则返回“1”

> adb pull /sdcard/demo.mp4

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1697896047567-80451de4-b002-4a34-b672-089280badab3.png#averageHue=%23291716&clientId=u759a9b3f-1346-4&from=paste&height=32&id=u13247bbc&originHeight=64&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=98379&status=done&style=none&taskId=ucfa535cb-a61b-428c-aaad-7355fcc697c&title=&width=564)

> adb pull /sdcard/demo.mp4 > /dev/null

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1697896061328-dc7de1f0-59a2-4c33-ac17-9ddb3a0fd56e.png#averageHue=%23391817&clientId=u759a9b3f-1346-4&from=paste&height=30&id=u200471bf&originHeight=60&originWidth=986&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96752&status=done&style=none&taskId=ua415dd08-a519-45fc-8b17-a9b7ea2d8af&title=&width=493)

## 引入其他独立的.sh文件

### source

```shell
export COMMON_PROFILE=$HOME/.sh/.common_profile.sh
[ -f $COMMON_PROFILE ] && source $COMMON_PROFILE # 存在COMMON_PROFILE文件就加载
```

# 其他

## dirname获取脚本所在的文件夹

`dirname` 可以获取一个文件所在的路径，`dirname`的用处是：输出已经去除了尾部的"/“字符部分的名称；如果名称中不包含”/“，
则显示”."(表示当前目录)。
![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240302193200.png)
直接从`dirname`返回的未必是绝对路径，取决于提供给`dirname`的参数是否是绝对路径
用`cd`和`pwd`命令配合获取脚本所在绝对路径，正确的写法是这样的，

```shell
# 获取脚本所在的文件夹
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)

# 其他类似的写法1
CUR_DIR=$(cd `dirname $0` && pwd -P)
# 类似写法2
BASEDIR=$(dirname "$0")
```

# shell脚本编写规范

## 指定解释器

```shell
#!/bin/bash 
```

解释器有很多种，除了bash之外，我们可以用下面的命令查看本机支持的解释器：

```shell
cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
/usr/local/bin/zsh
```

## shell脚本加颜色，背景色

<https://misc.flogisoft.com/bash/tip_colors_and_formatting>

## 巧用main函数

```shell
#!/usr/bin/env zsh
function func1(){
    #do sth
    echo func1
}
function func2(){
    #do sth
     echo func2
}
function main(){
    echo 'main'
    func1
    func2
}
main "$@" # "$@"把所有参数都传递给main函数
```

实现main函数，使得脚本的结构化程度更好。

## 作用域

shell中默认的变量作用域都是全局的，比如下面的脚本：

```shell
#!/usr/bin/env bash
var=1
function func(){
    var=2
}
func
echo $var 
# 输出结果就是2而不是1
```

## 学会查路径

很多情况下，我们会先获取当前脚本的路径，然后一这个路径为基准，去找其他的路径。通常我们是直接用pwd以期获得脚本的路径。<br /> 不过其实这样是不严谨的，pwd获得的是当前shell的执行路径，而不是当前脚本的执行路径。<br /> 正确的做法应该是下面这两种：

```shell
script_dir=$(cd $(dirname $0) && pwd)
script_dir=$(dirname $(readlink -f $0 )) 
```

应当先cd进当前脚本的目录然后再pwd，或者直接读取当前脚本的所在路径。

## 使用新写法

1. 尽量使用`func(){}`来定义函数，而不是`func{}`
2. 尽量使用`[[]]`来代替`[]`
3. 尽量使用`$()`将命令的结果赋给变量，而不是`反引号```
4. 在复杂的场景下尽量使用`printf`代替`echo`进行回显

- 路径尽量保持绝对路径，绝多路径不容易出错，如果非要用相对路径，最好用./修饰
- 优先使用bash的变量替换代替`awk sed`，这样更加简短
- 简单的if尽量使用&& ||，写成单行。比如`[[ x > 2]] && echo x`
- 当export变量时，尽量加上子脚本的namespace，保证变量不冲突
- 会使用trap捕获信号，并在接受到终止信号时执行一些收尾工作
- 使用mktemp生成临时文件或文件夹
- 利用/dev/null过滤不友好的输出信息
- 会利用命令的返回值判断命令的执行情况
- 使用文件前要判断文件是否存在，否则做好异常处理
- 不要处理ls后的数据(比如`ls -l | awk '{ print $8 }'`)，ls的结果非常不确定，并且平台有关
- 读取文件时不要使用for loop而要使用while read

## 静态检查工具shellcheck

## Ref

- [ ] [编写Shell脚本的最佳实践 - 掘金](https://juejin.cn/post/6844903494650953741)

# Ref

- [ ] [shell编程](http://c.biancheng.net/shell/program/)
