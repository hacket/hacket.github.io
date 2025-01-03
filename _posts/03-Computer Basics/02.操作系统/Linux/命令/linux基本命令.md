---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
tags:
  - '#!/bin/bash'
  - '#/bin/echo'
  - '#/bin/echo'
  - '#/bin/echo'
  - '#单个if'
  - '#zero'
  - '#not'
  - '#equal'
  - '#not'
  - '#greater'
  - '#less'
  - '#greater'
  - '#less'
  - '#!/bin/sh'
  - '#!/bin/sh'
  - '#!/bin/sh'
  - '#!/bin/sh'
  - '#!/bin/sh'
  - '#!/bin/bash'
  - '#!/bin/sh'
  - '#!/bin/bash'
  - '#!/bin/zsh'
  - '#!/bin/zsh'
  - '#提示用户输入'
  - '#输出结果'
  - '#删除第二行'
  - '#---------------------------------------------'
  - '#2'
  - '#3'
  - '#This''s'
  - '#10'
  - '#2'
  - '#3'
  - '#This''s'
  - '#10'
---

# 基本命令

## echo

echo命令用于在shell中打印shell变量的值，或者直接输出指定的字符串

### 语法

echo(选项)(参数)选项<br />-e：激活转义字符。使用-e选项时，若字符串中出现以下字符，则特别加以处理，而不会将它当成一般文字输出：

> \a 发出警告声；
> \b 删除前一个字符；
> \c 最后不加上换行符号；
> \f 换行但光标仍旧停留在原来的位置；
> \n 换行且光标移至行首；
> \r 光标移至行首，但不换行；
> \t 插入tab；
> \v 与\f相同；
> \ 插入\字符；
> \nnn 插入nnn（八进制）所代表的ASCII字符；

### 案例

#### Foreground 文字颜色

颜色码：重置=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，洋红=35，青色=36，白色=37<br />`echo "\033[颜色码m XXX \033[0m"`

```shell
echo "\033[30m This is 黑色=30 text\033[0m"
echo "\033[31m This is 红色=31 text\033[0m"
echo -e "\033[32m This is 绿色=32 text\033[0m"
echo -e "\033[33m This is 黄色=33 text\033[0m"
echo -e "\033[34m This is 蓝色=34 text\033[0m"
echo -e "\033[35m This is 洋红=35 text\033[0m"
echo -e "\033[36m This is 青色=36 text\033[0m"
echo -e "\033[37m This is 白色=37 text\033[0m"
echo -e "\033[0m This is 重置=0 text\033[0m"
# 设置了颜色后，如果没有[0m重置，后面的文字都会变成设置的颜色
echo -e "\033[31m This is 1.红色=31 text"
echo "这是没加颜色的，会变成红色"
```

> 注意：
>
> - Mac可以不用加-e
> - Mac用的是\033，Linux用\e（未验证）？

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1708335127738-be82a0bf-5fe4-41a9-9036-689b8b9792d2.png#averageHue=%23ada4a2&clientId=ua62d17e9-9056-4&from=paste&height=155&id=u66669330&originHeight=310&originWidth=418&originalType=binary&ratio=2&rotation=0&showTitle=false&size=57523&status=done&style=stroke&taskId=u67273984-aa81-457a-b1db-152c34fbfcc&title=&width=209)<br />更多颜色见：<https://misc.flogisoft.com/bash/tip_colors_and_formatting>

#### Background 背景色

Greed Background颜色码：重置=0，黑色=40，红色=41，绿色=42，黄色=43，蓝色=44，洋红=45，青色=46，白色=47

```shell
echo -e "\033[40m 背景黑色=40 \033[0m"
echo -e "\033[41m 背景红色=41 \033[0m"
echo -e "\033[42m 背景绿色=42 \033[0m"
echo -e "\033[43m 背景黄色=43 \033[0m"
echo -e "\033[44m 背景蓝色=44 \033[0m"
echo -e "\033[45m 背景洋红=45 \033[0m"
echo -e "\033[46m 背景青色=46 \033[0m"
echo -e "\033[47m 背景白色=47\033[0m"
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1708348401479-b534892c-a46a-4aee-98cb-7308c85703e5.png#averageHue=%23a29b5a&clientId=u92825a02-b5be-4&from=paste&height=115&id=uae65ca09&originHeight=230&originWidth=318&originalType=binary&ratio=2&rotation=0&showTitle=false&size=40262&status=done&style=stroke&taskId=u94d66f87-d49d-49d4-9024-298a8e49a77&title=&width=159)<br />更多颜色见：<https://misc.flogisoft.com/bash/tip_colors_and_formatting>

#### 文字闪动

红色数字处还有其他数字参数：0 关闭所有属性、1 设置高亮度（加粗）、4 下划线、5 闪烁、7 反显、8 消隐<br />`echo "\033[37;31;xxxm XXX \033[39;49;0m"`其中小写xxx，可以替换成上面

```shell
echo -e "\033[37;31;5m MySQL Server Stop...\033[39;49;0m"
```

### 问题

#### echo -n在Mac不生效

Mac Shell脚本中使用`echo -n`导入文件无法实现不换行，在Linux服务器上未发现此问题。<br />问题代码：

```shell
#!/bin/bash

test_file="tmp"

echo -n "line1" > ${test_file}
echo -n "line2" >> ${test_file}
echo -n "line3" >> ${test_file}
#/bin/echo -n "line1" > ${test_file}
#/bin/echo -n "line2" >> ${test_file}
#/bin/echo -n "line3" >> ${test_file}
```

查看输出的文件tmp如下，不能实现不换行并且信息打印有误，多了-n：

> -n line1
> -n line2
> -n line3

解决方法：<br />将echo替换为`/bin/echo`

```shell
test_file="tmp"
/bin/echo $test_file
/bin/echo -n "line1" > ${test_file}
/bin/echo -n "line2" >> ${test_file}
/bin/echo -n "line3" >> ${test_file}
```

再看输出：

> line1lin2line3

## if 条件判断

1. `[ x ]`表示条件测试。注意这里的空格很重要。要注意在`[`后面和`]`前面都必须要有空格
2. 在shell中，then和fi是分开的语句。如果要在同一行里面输入，则需要用分号将他们隔开。
3. 注意if判断中对于变量的处理，需要加引号，以免一些不必要的错误。没有加双引号会在一些含空格等的字符串变量判断的时候产生错误。比如`[ -n "$var" ]`如果var为空会出错
4. 判断是不支持浮点值的
5. 如果只单独使用`>`或者`<`号，系统会认为是输出或者输入重定向，虽然结果显示正确，但是其实是错误的，因此要对这些符号进行转义
6. 空变量和没有初始化的变量可能会对shell脚本测试产生灾难性的影响，因此在不确定变量的内容的时候，在测试号前使用-n或者-z测试一下

### 条件判断基本结构 if（数字条件，字符串条件，字符串为空）

#### 条件判断的格式

```
[ exp ]
[[ exp ]]
test exp
```

> 注意： exp 与 “[”、"]"括号之间必须要有空格，否则会报语法错误；

#### if基本结构

```shell
if 条件判断的格式 ；then
    # statement1
    # .......
fi


if 条件判断的格式 ；then
    statement1
else
    statement2
fi


if 条件判断的格式 ; then
    statement1
elif 条件判断的格式 ; then
    statement2
fi
```

> 注意==或=前后要有空格

##### if

```shell
a=1
#单个if
if [ a==2 ] ; then # ==号前后没有空格，这样会认为是true
    echo '1.a==2' # 这里会输出结果
fi

if [ a == 2 ] ; then # 判断结果为false
    echo '2.a==2' # 不会输出
fi
```

##### if else

```shell
PUBLISH_TO_MAVEN=all
if [ $PUBLISH_TO_MAVEN == 'all' ]; then
    echo "publish all"
else
    echo "publish $PUBLISH_TO_MAVEN"
fi
```

##### if elif else

```shell
t=redis
if [[ $t = 'tomcat' ]];
then
  echo "Input is tomcat"
elif [[ $t = 'redis' ]] || [[ $t = 'zookeeper' ]];
then
  echo "Input is $t"
else
  echo "Input Is Error."
fi

或者：
a=1
if [[ a -eq 2 ]]; then
    echo "a=2"
elif [[ a -eq 3 ]]; then
    echo "a==3"
else
    echo "a=1"
fi
```

### if常用判断

#### 文件/目录判断：

```shell
[ -a FILE ] 如果 FILE 存在则为真。 
[ -b FILE ] 如果 FILE 存在且是一个块文件则返回为真。
[ -c FILE ] 如果 FILE 存在且是一个字符文件则返回为真。
[ -d FILE ] 如果 FILE 存在且是一个目录则返回为真。 
[ -e FILE ] 如果 指定的文件或目录存在时返回为真。
[ -f FILE ] 如果 FILE 存在且是一个普通文件则返回为真。
[ -g FILE ] 如果 FILE 存在且设置了SGID则返回为真。
[ -h FILE ] 如果 FILE 存在且是一个符号符号链接文件则返回为真。（该选项在一些老系统上无效）
[ -k FILE ] 如果 FILE 存在且已经设置了冒险位则返回为真。
[ -p FILE ] 如果 FILE 存并且是命令管道时返回为真。
[ -r FILE ] 如果 FILE 存在且是可读的则返回为真。
[ -s FILE ] 如果 FILE 存在且大小非0时为真则返回为真。
[ -u FILE ] 如果 FILE 存在且设置了SUID位时返回为真。
[ -w FILE ] 如果 FILE 存在且是可写的则返回为真。（一个目录为了它的内容被访问必然是可执行的）
[ -x FILE ] 如果 FILE 存在且是可执行的则返回为真。
[ -O FILE ] 如果 FILE 存在且属有效用户ID则返回为真。
[ -G FILE ] 如果 FILE 存在且默认组为当前组则返回为真。（只检查系统默认组）
[ -L FILE ] 如果 FILE 存在且是一个符号连接则返回为真。 
[ -N FILE ] 如果 FILE 存在 and has been mod如果ied since it was last read则返回为真。 
[ -S FILE ] 如果 FILE 存在且是一个套接字则返回为真。
[ FILE1 -nt FILE2 ] 如果 FILE1 比 FILE2 新, 或者 FILE1 存在但是 FILE2 不存在则返回为真。 
[ FILE1 -ot FILE2 ] 如果 FILE1 比 FILE2 老, 或者 FILE2 存在但是 FILE1 不存在则返回为真。
[ FILE1 -ef FILE2 ] 如果 FILE1 和 FILE2 指向相同的设备和节点号则返回为真。
```

#### 字符串判断

```shell
[ -z STRING ]    如果STRING的长度为零则返回为真，即空是真
[ -n STRING ]    如果STRING的长度非零则返回为真，即非空是真
[ STRING1 ]　   如果字符串不为空则返回为真,与-n类似
[ STRING1 == STRING2 ]   如果两个字符串相同则返回为真
[ STRING1 != STRING2 ]    如果字符串不相同则返回为真
[ STRING1 < STRING2 ]     如果 “STRING1”字典排序在“STRING2”前面则返回为真。 
[ STRING1 > STRING2 ]     如果 “STRING1”字典排序在“STRING2”后面则返回为真。 

-z #zero 当前字符串是否为空
-n #not zero 当前字符串是否不为空
== 两端字符串是否相等，与=等价；如:if [ "$a" == "$b" ]和if [ "$a" = "$b" ]等价
!= 两端字符串是否不相等
> 长度是否大于
< 长度是否小于
```

例如：

```shell
STR1="HELLO"
STR2="HELL"

if [[ $STR1 > $STR2 ]];then
    echo "1.$STR1 > $STR2" # 输出结果
fi

if [ $STR1 \> $STR2 ];then
    echo "2.$STR1 > $STR2" # 输出结果
fi        
```

> 注意：“< ”与 “> ”做字符串比较的时候，在[ exp ] 情况下需要需要输入 “<” 或者 “>” 作为转义，或者使用 [[ > exp ]] 模式可以直接使用“< ”与 “> ”作为判断符号使用。

```
比较两个字符串是否相等的办法是：
if [ "$test"x = "test"x ]; then
这里的关键有几点：
1 使用单个等号
2 注意到等号两边各有一个空格：这是unix shell的要求
3 注意到"$test"x最后的x，这是特意安排的，因为当$test为空的时候，上面的表达式就变成了x = testx，显然是不相等的。而如果没有这个x，表达式就会报错：[: =: unary operator expected
```

注意:==的功能在[[]]和[]中的行为是不同的,如下:

```shell
 [[ $a == z* ]]   # 如果$a以"z"开头(模式匹配)那么将为true 
 [[ $a == "z*" ]] # 如果$a等于z*(字符匹配),那么结果为true 
 
 [ $a == z* ]     # File globbing 和word splitting将会发生 
 [ "$a" == "z*" ] # 如果$a等于z*(字符匹配),那么结果为true 
```

#### 数值判断

```shell
-eq #equal 相等  如:if [ "$a" -eq "$b" ] 
-ne #not equal 不相等  如:if [ "$a" -ne "$b" ] 
-gt #greater than 大于  如:if [ "$a" -gt "$b" ] 
-lt #less than 小于  if [ "$a" -lt "$b" ] 
-ge #greater or equal 大于或等于  如:if [ "$a" -ge "$b" ] 
-le #less or equal 小于或等于

<   小于(需要双括号),如:(("$a" < "$b")) 
<=  小于等于(需要双括号),如:(("$a" <= "$b")) 
>   大于(需要双括号),如:(("$a" > "$b")) 
>=  大于等于(需要双括号),如:(("$a" >= "$b"))
```

例如：

```shell
if [ 1 -eq 1 ]; then
    echo "1=1?" # 输出结果
fi

if [ 2 -eq 1 ]; then
    echo "2=1?" # 不输出结果
fi
```

> -eq和数字前后要有空格，数字和括号要有空格

#### 逻辑判断

```shell
[ ! EXPR ]       逻辑非，如果 EXPR 是false则返回为真。
[ EXPR1 -a EXPR2 ]      逻辑与，如果 EXPR1 and EXPR2 全真则返回为真。
[ EXPR1 -o EXPR2 ]      逻辑或，如果 EXPR1 或者 EXPR2 为真则返回为真。
[  ] || [  ]           用OR来合并两个条件
[  ] && [  ]        用AND来合并两个条件
```

#### 其他判断

```shell
[ -t FD ]  如果文件描述符 FD （默认值为1）打开且指向一个终端则返回为真
[ -o optionname ]  如果shell选项optionname开启则返回为真
```

#### 判断一个变量是否为空

##### 变量通过`" "`引号引起来

```shell
#!/bin/sh
para1=
if [ ! -n "$para1" ]; then
    echo "IS NULL"
else
    echo "NOT NULL"
fi
```

【输出结果】"IS NULL"

##### 直接通过变量判断

```shell
#!/bin/sh
para1=
if [ ! $para1 ]; then
  echo "IS NULL"
else
  echo "NOT NULL"
fi
```

【输出结果】"IS NULL"

##### 使用`test`判断

```shell
#!/bin/sh
dmin=
if test -z "$dmin"
then
  echo "dmin is not set!"
else 
  echo "dmin is set !"
fi
```

【输出结果】"dmin is not set!"

##### 使用`""`判断

```shell
#!/bin/sh
dmin=
if [ "$dmin" = "" ]
then
  echo "dmin is not set!"
else 
  echo "dmin is set !"
fi
```

【输出结果】"dmin is not set!"

#### if高级特性

- 双圆括号`((  ))`：表示数学表达式<br />    在判断命令中只允许在比较中进行简单的算术操作，而双圆括号提供更多的数学符号，而且在双圆括号里面的'>','<'号不需要转意。
- 双方括号`[[  ]]`：表示高级字符串处理函数

双方括号中判断命令使用标准的字符串比较，还可以使用匹配模式，从而定义与字符串相匹配的正则表达式。<br />双括号的作用：在shell中，[ $ a != 1 ||  $b = 2 ]是不允许出，要用[ $ a != 1 ] || [  $b = 2 ]，而双括号就可以解决这个问题的，[[ \$a != 1 || \$b = 2 ]]。又比如这个[ "$a" -lt "$b" ]，也可以改成双括号的形式(("$a" < "$b"))

#### 案例

1. 判断目录`$doiido`是否存在，若不存在，则新建一个

```shell
if [ ! -d "$doiido"]; then
	mkdir "$doiido"
fi
```

2. 判断普通文件`$doiido`是否存，若不存在，则新建一个

```shell
if [ ! -f "$doiido" ]; then
	touch "$doiido"
fi
```

3. 判断`$doiido`是否存在并且是否具有可执行权限

```shell
if [ ! -x "$doiido"]; then
	mkdir "$doiido"
	chmod +x "$doiido"
fi
```

4. 是判断变量$doiido是否有值

```shell
if [ ! -n "$doiido" ]; then
　　echo "$doiido is empty"
　　exit 0
fi
```

5. 两个变量判断是否相等

```shell
if [ "$var1" = "$var2" ]; then
　　echo '$var1 eq $var2'
else
　　echo '$var1 not eq $var2'
fi
```

6. 测试退出状态：

```shell
if [ $? -eq 0 ];then
    echo 'That is ok'
fi
```

7. 数值的比较：

```shell
if [ "$num" -gt "150" ]
    echo "$num is biger than 150"
fi
```

8. a>b且a<c

```shell
(( a > b )) && (( a < c ))
[[ $a > $b ]] && [[ $a < $c ]]
[ $a -gt $b -a $a -lt $c ]
```

9. a>b或a<c

```shell
(( a > b )) || (( a < c ))
[[ $a > $b ]] || [[ $a < $c ]]
[ $a -gt $b -o $a -lt $c ]
```

10. 检测执行脚本的用户

```shell
if [ "$(whoami)" != 'root' ]; then
    echo "You have no permission to run $0 as non-root user."
    exit 1;
fi
# 上面的语句也可以使用以下的精简语句
[ "$(whoami)" != 'root' ] && ( echo "You have no permission to run $0 as non-root user."; exit 1 )
```

11. 正则表达式

```shell
doiido="hero"
if [[ "$doiido" == h* ]];then 
    echo "hello，hero"
fi
```

12. 查看当前操作系统类型

```shell
#!/bin/sh
SYSTEM=`uname -s`
if [ $SYSTEM = "Linux" ] ; then
    echo "Linux"
elif [ $SYSTEM = "FreeBSD" ] ; then
    echo "FreeBSD"
elif [ $SYSTEM = "Solaris" ] ; then
    echo "Solaris"
else
    echo "What?"
fi
```

13. if利用read传参判断

```shell
#!/bin/bash
read -p "please input a score:" score
echo -e "your score [$score] is judging by sys now"

if [ "$score" -ge "0" ]&&[ "$score" -lt "60" ];then
    echo "sorry,you are lost!"
elif [ "$score" -ge "60" ]&&[ "$score" -lt "85" ];then
    echo "just soso!"
elif [ "$score" -le "100" ]&&[ "$score" -ge "85" ];then
    echo "good job!"
else
    echo "input score is wrong , the range is [0-100]!"
fi
```

14. 判断文件是否存在

```shell
#!/bin/sh
today=`date -d yesterday +%y%m%d`
file="apache_$today.tar.gz"
cd /home/chenshuo/shell
if [ -f "$file" ];then
    echo "OK"
else
    echo "error $file" >error.log
    mail -s "fail backup from test" loveyasxn924@126.com <error.log
fi
```

15. 这个脚本在每个星期天由cron来执行。如果星期的数是偶数，他就提醒你把垃圾箱清理

```shell
#!/bin/bash
WEEKOFFSET=$[ $(date +"%V") % 2 ]

if [ $WEEKOFFSET -eq "0" ]; then
    echo "Sunday evening, put out the garbage cans." | mail -s "Garbage cans out" your@your_domain.org
fi
```

## 切换目录 cd pushd popd dirs

### cd

1. 普通目录切换：`cd xxx`
2. 两个目录之间切换：`cd -` -作用是可以回到前一个目录，只支持最近操作的两个目录

### pushd、popd和dirs多个目录切换

- pushd：切换到作为参数的目录，并把原目录和当前目录压入到一个虚拟的堆栈中；如果不指定参数，则会回到前一个目录，并把堆栈中最近的两个目录作交换
- popd： 弹出堆栈中最近的目录
- dirs：列出当前堆栈中保存的目录列表
  - -p参数可以每行一个目录的形式显示堆栈中的目录列表
  - -v参数可以在目录前加上编号 注意:有 -v时，不添加 -p也可以每行一个目录的形式显示
  - 最近压入堆栈的目录位于最上面

### 示例一：pushd命令切换目录

```shell
❯ dirs -p -v
0	~
❯ pushd /usr/local/bin
/usr/local/bin ~
❯ dirs -p -v
0	/usr/local/bin
1	~
❯ pushd /usr/share/man
/usr/share/man /usr/local/bin ~
❯ dirs -p -v
0	/usr/share/man
1	/usr/local/bin
2	~
```

### 示例二：最近的两个目录之间切换

在最近的两个目录之间切换：用pushd不加参数即可

```shell
❯ dirs -p -v
0	/usr/share/man
1	/usr/local/bin
2	~
❯ pushd
/usr/local/bin /usr/share/man ~
❯ pushd
/usr/share/man /usr/local/bin ~
```

> 也可以用cd -

### 示例三：如何在多个目录之间切换？

pushd +n<br />n是一个数字,有此参数时，是切换到堆栈中的第n个目录,并把此目录以堆栈循环的方式推到堆栈的顶部（需要注意: 堆栈从第0个开始数起）

```shell
❯ dirs -p -v
0	/cores
1	~
2	/usr/share/man
3	/usr/local/bin
4	/usr
❯ pushd +2
/usr/share/man /usr/local/bin /usr /cores ~
❯ dirs -p -v
0	/usr/share/man
1	/usr/local/bin
2	/usr
3	/cores
4	~
❯ pwd
/usr/share/man
❯ pushd +2
/usr /cores ~ /usr/share/man /usr/local/bin
```

### 示例四：如何把目录从堆栈中删除?

用popd即可

- popd不加参数：popd把堆栈顶端的目录从堆栈中删除，并切换于位于新的顶端的目录
- popd 加有参数 +n时，n是堆栈中的第n个目录，表示把堆栈中第n个目录从堆栈中删除
- 位于堆栈顶部的目录是当前目录，它不能被pop出去

```shell
# popd不加参数，默认删除栈顶，并切换目录到新的栈顶目录
❯ pwd
/usr
❯ dirs -p -v
0	/usr
1	/cores
2	~
3	/usr/share/man
4	/usr/local/bin
❯ popd
/cores ~ /usr/share/man /usr/local/bin

# popd +n 删除栈中n位置的目录
❯ dirs -p -v
0	/system
1	/cores
2	~
3	/usr/share/man
4	/usr/local/bin
❯ popd +2
/system /cores /usr/share/man /usr/local/bin
❯ dirs -p -v
0	/system
1	/cores
2	/usr/share/man
3	/usr/local/bin
```

## 获取用户输入 read

在shell脚本中，使用`read`命令获取命令行输入<br />read命令参数

- -p(指定提示语句)
- -n(限定字符个数)
- -t(设置等待时间)
- -s(不显示)

### 基本读取

read命令接收标准输入（键盘）的输入，或者其他文件描述符的输入。在得到输入之后，read命令把输入数据放入一个标准变量中

```shell
#!/bin/zsh
/bin/echo -n "Enter your name:"             # 参数-n的作用是不换行，echo默认换行；在Mac上-n不起作用，需要使用/bin/echo
read name                                   # 把键盘输入放入变量name
echo "hello $name, welcome to my program"   # 显示输入信息
exit 0                                      # 返回一个零退出状态，退出shell程序

# 输出结果
# ❯ sh test.sh
# Enter your name:hacket
# hello hacket, welcome to my program
```

也可以用`-p`简化上面的写法，它允许在read命令行中直接指定一个提示语句：

```shell
#!/bin/zsh
read -p "Enter your name:" name              #提示用户输入
echo "hello $name, welcome to my program"   #输出结果
```

上例中，read后面的变量只有name一个，实际上可以有多个。如果有多个输入数据，则应指定多个变量，这样第一个数据赋给第一个变量，第二个数据赋给第二个变量…

```shell
read -p "Enter your,name,age,id_card,address:" name age id_card address           # 通过参数-p指定一个提示语句，并把键盘输入放入变量name
echo "hello -$name =$age ==$id_card -=$address , welcome to my program"

# 输出结果
❯ sh test.sh # 输入参数以空格区分
Enter your,name,age,id_card,address:1 2 3 4
hello -1 =2 ==3 -=4 , welcome to my program
❯ sh test.sh # 输入的参数如果是逗号,那就不对了
Enter your,name,age,id_card,address:1,2,3,4
hello -,2,3,4 = == -= , welcome to my program
```

如果输入数据个数过多，远大于变量个数，则多余的所有数据都给最后一个变量；如果输入数据太少，不会结束（mac上表现是少了的参数为默认空值）。

```shell
## -p 指定多个变量
read -p "Enter your,name,age,id_card,address:" name age id_card address           # 通过参数-p指定一个提示语句，并把键盘输入放入变量name
echo "hello -$name =$age ==$id_card -=$address , welcome to my program"   

❯ sh test.sh # 输入参数过多，多的都给最后一个变量
Enter your,name,age,id_card,address:1 2 3 4 5 6 7
hello -1 =2 ==3 -=4 5 6 7 , welcome to my program
# mac参数少了，少的参数就是默认值
Enter your,name,age,id_card,address:1 2 3
hello -1 =2 ==3 -= , welcome to my program
```

如果不指定变量名，那么read命令把接收到的输入放在环境变量`REPLY`中，例如read -p "Enter a number"。环境变量REPLY中包含输入的所有数据，在shell脚本中，我们可以正常使用环境变量REPLY。

```shell
read -p "Enter a number: "
echo $REPLY
```

### 输入计时，输入计数

计时<br />使用read命令有潜在危险，脚本很可能停下来一直等待用户输入。使用-t选项指定一个计时器，设置等待输入的秒数。当计时器满时，read命令返回一个非零退出状态。

```shell
if read -t 5 -p "please enter your name:" name    # -t，设置输入超时时间（本语句设置超时时间为5秒），默认单位是秒；-p，指定输入提示
then                                              # 如果不超过5秒
    echo "hello $name ,welcome to my script"
else                                              # 超过5秒
    echo "Timeout"
fi
```

计数<br />read命令除了可以设置输入计时，还可以设置输入计数。当输入的字符数目达到设定数目时，自动退出，并把输入数据赋给变量

```shell
# !/bin/bash          # 指定shell类型

read -n2 -p "Do you want to continue [Y/N]?" answer
case $answer in
(Y | y)
      echo "fine, continue";;
(N | n)
      echo "ok, good bye";;
(*)
      echo "error choice";;
esac
```

该例子使用了`-n`选项，后接数值1，只要按下1个字符进行回答，无需按回车键，read命令立即接受输入并将其传给变量；如果输入的字符个数小于-n选项数值，我们就需要按回车键。

### 默读（输入不显示在监视器上）

有时，脚本需要用户输入，但用户不希望输入数据显示在监视器上。典型的例子就是输入密码。`-s`选项能够使read命令中的输入数据不显示在监视器上（实际上，数据是显示的，只是read命令把文本颜色设置成与背景相同）

```shell
# !/bin/bash                               # 指定shell类型

# 默读（输入不显示在监视器上，如读取隐藏数据、用户密码）

read  -s  -p "Enter your password:" passwd 
echo                                       # read默认不换行，echo用于换行
echo "your password is $passwd"
```

## sed修改文件

### sed命令

sed 全名为 stream editor，流编辑器，用程序的方式来编辑文本，功能相当的强大。

### Mac sed

##### 案例

修改一个txt文本信息

```
// 文件test.txt内容：
12345
aaa
CCC

// 执行命令
sed -i "" "s/12345/Hello/" test.txt
// 文件test.txt内容：
Hello
aaa
CCC
```

- 分析命令 `sed -i "" "s/12345/Hello/" test.txt`
  1. -i 直接操作文件并不需要备份文件，如果需要备分则使用 -i "benfen"
  2. s 代表 substitue 即替换
  3. 12345 要被代替的文字
  4. Hello 要代替的文字
  5. test.txt 对应修改的文件

##### 修改demo.properties

- 原有内容：

```
user.name=test
user.password=123456
gioenable=false
```

- 将 user.name 和 user.password 的value值替换为实际需要的用户名和密码

```
sed -i "" "s#^user.name=.*#user.name=hacket#g" demo.properties
sed -i "s#^user.password=.*#user.password=密码#g" demo.properties
```

- 将gioenable=false改为gioenable=true

```
sed -i "" '/gioenable/s/false/true/g' demo.properties
# 或
sed -i "" "s#^gioenable=.*#gioenable=true#g" demo.properties
```

##### 修改gradle.properties

```
sed -i "" '/libcommon/s/false/true/g' gradle.properties
sed -n '/^libcommon.*/p' gradle.properties

sed -i "" '/libwidget/s/false/true/g' gradle.properties
sed -n '/^libwidget.*/p' gradle.properties

sed -i "" '/core/s/false/true/g' gradle.properties
sed -n '/^core.*/p' gradle.properties

./gradlew :libcommon:publishLibCommonPublicationToHacketGitHubPackagesRepository
./gradlew :libwidget:publishLibWidgetPublicationToHacketGitHubPackagesRepository
./gradlew :core:publishReleasePublicationToHacketGitHubPackagesRepository

sed -i "" '/libcommon/s/true/false/g' gradle.properties
sed -n '/^libcommon.*/p' gradle.properties

sed -i "" '/libwidget/s/true/false/g' gradle.properties
sed -n '/^libwidget.*/p' gradle.properties

sed -i "" '/core/s/true/false/g' gradle.properties
sed -n '/^core.*/p' gradle.properties
```

### sed功能

修改文件要用-i， 另外基本操作码如下，以及熟悉简单的正则表达式就OK

```
s 替换
c change line
d 删除line
i 插入line
a 追加line
```

#### d 删除

- 案例

```shell
sed -i "" "2d" test.txt #删除第二行
```

删除第二行，此时test.txt内容：

```
Hello
CCC
```

- 删除第二行

```shell
sed -i "" "2d" test.txt  # 2代表第二行
```

- 删除以什么开头的某行

```shell
sed -i "" "/^C.*/d" test.txt  # C.* 代表以C开头的行数，.*是通配符
```

- 删除包含什么的行

```shell
sed -i "" "/2/d" test.txt  # 2 代表包含 2 的行
```

- 删除空行

```
sed -i "" "/^$/d" test.txt
```

#### p 查

demo.properties内容：

```
user.name=test
user.password=123456
gioenable=true
```

- 输出所有

```
sed -n "p" demo.properties
```

输出：

```
user.name=test
user.password=123456
gioenable=true
```

- 输出第二行

```
sed -n "2p" demo.properties
```

输出：

```
user.password=123456
```

- 输出指定的key:gioenable

```
sed -n '/^gioenable.*/p' demo.properties
```

输出：

```
gioenable=true
```

- 输出前缀为user的行

```
sed -n '/^user.*/p' demo.properties
```

输出：

```
user.name=test
user.password=123456
```

#### s 改

- 修改某个字符串

```
sed -i "" "s/Hello/xxxx/" test.txt  # Hello 表示要修改的文字，xxx 表示替代的
```

- 修改某行的指定

```
sed -i "" "4s/xxxx/aaa/" test.txt  # 4 代表第四行
```

#### a 新增

```shell
sed -i "" '2 a\   
apply from: \"\$rootDir\/config\/gradle\/config_bytex.gradle\" \
apply from: \"\$rootDir\/config\/gradle\/config_bytex_method_call_opt.gradle\" \
apply from: \"\$rootDir\/config\/gradle\/config_bytex_third_part_fix.gradle\" \
' demo.properties
```

原内容：

```
user.name=test
user.password=123456
gioenable=true
```

修改后：

```
user.name=test
user.password=123456
apply from: "$rootDir/config/gradle/config_bytex.gradle" 
apply from: "$rootDir/config/gradle/config_bytex_method_call_opt.gradle" 
apply from: "$rootDir/config/gradle/config_bytex_third_part_fix.gradle" 
gioenable=true
```

- [ ] Mac 上简单使用 Sed<br /><https://www.jianshu.com/p/316868196bd1>

# 其他命令

## which 查看命令所在路径

用来查看当前要执行的命令所在的路径。

> which命令的原理：在PATH变量指定的路径中，搜索某个系统命令的位置，并且返回第一个搜索结果。也就是说，使用which命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

![which命令](https://cdn.nlark.com/yuque/0/2024/png/694278/1708332287091-302e031e-4b6b-4446-bb8a-ee3fc3582e10.png#averageHue=%23a8a4a4&clientId=ud130f0d7-c0ab-4&from=paste&height=60&id=u66226f79&originHeight=120&originWidth=830&originalType=binary&ratio=2&rotation=0&showTitle=true&size=28290&status=done&style=stroke&taskId=u52ea283b-2769-4f86-9940-65c46a6f7d5&title=which%E5%91%BD%E4%BB%A4&width=415 "which命令")

## whereis

用来查看一个命令或者文件所在的路径。

> whereis命令原理：只能用于程序名的搜索，而且只搜索二进制文件（参数-b）、man说明文件（参数-m）和源代码文件（参数-s）。如果省略参数，则返回所有信息。

![which和whereis执行区别](https://cdn.nlark.com/yuque/0/2024/png/694278/1708332356344-e7140357-819b-4265-8d1e-f4877336b1f9.png#averageHue=%23aaa6a6&clientId=ud130f0d7-c0ab-4&from=paste&height=116&id=u70ca127f&originHeight=232&originWidth=840&originalType=binary&ratio=2&rotation=0&showTitle=true&size=56180&status=done&style=stroke&taskId=u61cc9a31-82ae-483f-aba1-560afad6153&title=which%E5%92%8Cwhereis%E6%89%A7%E8%A1%8C%E5%8C%BA%E5%88%AB&width=420 "which和whereis执行区别")

## awk

AWK 是一种处理文本文件的语言，是一个强大的文本分析工具。

> 之所以叫 AWK 是因为其取了三位创始人 Alfred Aho，Peter Weinberger, 和 Brian Kernighan 的 Family Name 的首字符

### 语法

```shell
awk [选项参数] 'script' var=value file(s)
或
awk [选项参数] -f scriptfile var=value file(s)
```

- -F fs or --field-separator fs<br />指定输入文件折分隔符，fs是一个字符串或者是一个正则表达式，如-F:。
- -v var=value or --asign var=value<br />赋值一个用户定义变量。
- -f scripfile or --file scriptfile<br />从脚本文件中读取awk命令。

### 用法

log.txt文本内容如下：

> 2 this is a test
> 3 Do you like awk
> This's a test
> 10 There are orange,apple,mongo

用法1：`awk '{[pattern] action}' {filenames}   # 行匹配语句 awk '' 只能用单引号`

```shell
# 每行按空格或TAB分割，输出文本中的1、4项
 $ awk '{print $1,$4}' log.txt
 #---------------------------------------------
 #2 a
 #3 like
 #This's
 #10 orange,apple,mongo
 
 # 格式化输出
 $ awk '{printf "%-8s %-10s\n",$1,$4}' log.txt
 # ---------------------------------------------
 #2        a
 #3        like
 #This's
 #10       orange,apple,mongo
```

用法2：配合grep管道来打印APP的进程

```shell
 ps -e | grep ClashX.app | awk 'NR==1{print $1}'
 # 或
 ps -ef | grep $1 | awk 'NR==1{print $2}'

 # kill进程
 ps -ef | grep $1 | awk 'NR==1{print $2}' | xargs kill -9
```

- awk 后 $ 1 表示进程信息的第一列，即第一个元素。  获取 PID 需先确定 PID 位于进程信息的列数，即通过  $N 获取 PID。
- NR==1表示取第一行数据
