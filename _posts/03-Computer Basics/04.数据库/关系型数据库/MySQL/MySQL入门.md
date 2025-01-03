---
date created: 2024-09-06 00:12
date updated: 2024-11-22 08:48
---

# MySQL基础

## MySQL介绍

MySQL 最早是由瑞典的 MySQL AB 公司开发的一个开放源码的关系数据库管理系统，该公司于2008年被昇阳微系统公司（Sun Microsystems）收购。在2009年，甲骨文公司（Oracle）收购昇阳微系统公司，因此 MySQL 目前也是 Oracle 旗下产品。

MySQL 在过去由于性能高、成本低、可靠性好，已经成为最流行的开源数据库，因此被广泛地应用于中小型网站开发。随着 MySQL 的不断成熟，它也逐渐被应用于更多大规模网站和应用，比如维基百科、谷歌（Google）、脸书（Facebook）、淘宝网等网站都使用了 MySQL 来提供数据持久化服务。

甲骨文公司收购后昇阳微系统公司，大幅调涨 MySQL 商业版的售价，且甲骨文公司不再支持另一个自由软件项目 [OpenSolaris](https://zh.wikipedia.org/wiki/OpenSolaris) 的发展，因此导致自由软件社区对于 Oracle 是否还会持续支持 MySQL 社区版（MySQL 的各个发行版本中唯一免费的版本）有所担忧，MySQL 的创始人麦克尔·维德纽斯以 MySQL 为基础，创建了 [MariaDB](https://zh.wikipedia.org/wiki/MariaDB)（以他女儿的名字命名的数据库）分支。有许多原来使用 MySQL 数据库的公司（例如：维基百科）已经陆续完成了从 MySQL 数据库到 MariaDB 数据库的迁移。

- MySQL 是开源的，目前隶属于 Oracle 旗下产品。
- MySQL 支持大型的数据库。可以处理拥有上千万条记录的大型数据库。
- MySQL 使用标准的 SQL 数据语言形式。
- MySQL 可以运行于多个系统上，并且支持多种语言。这些编程语言包括 C、C++、Python、Java、Perl、PHP、Eiffel、Ruby 和 Tcl 等。
- MySQL 对 PHP 有很好的支持，PHP 是很适合用于 Web 程序开发。
- MySQL 支持大型数据库，支持 5000 万条记录的数据仓库，32 位系统表文件最大可支持 4GB，64 位系统支持最大的表文件为8TB。
- MySQL 是可以定制的，采用了 GPL 协议，你可以修改源码来开发自己的 MySQL 系统。

## MySQL 新特性

### JSON 类型

很多开发者在使用关系型数据库做数据持久化的时候，常常感到结构化的存储缺乏灵活性，因为必须事先设计好所有的列以及对应的数据类型。在业务发展和变化的过程中，如果需要修改表结构，这绝对是比较麻烦和难受的事情。从 MySQL 5.7 版本开始，MySQL 引入了对 JSON 数据类型的支持（MySQL 8.0 解决了 JSON 的日志性能瓶颈问题），用好 JSON 类型，其实就是打破了关系型数据库和非关系型数据库之间的界限，为数据持久化操作带来了更多的便捷。

示例 1：
哪些地方需要用到 JSON 类型呢？`举一个简单的例子，现在很多产品的用户登录都支持多种方式，例如手机号、微信、QQ、新浪微博等，但是一般情况下我们又不会要求用户提供所有的这些信息，那么用传统的设计方式，就需要设计多个列来对应多种登录方式，可能还需要允许这些列存在空值，这显然不是很好的选择；另一方面，如果产品又增加了一种登录方式，那么就必然要修改之前的表结构，这就更让人痛苦了。但是，有了 JSON 类型，刚才的问题就迎刃而解了，我们可以做出如下所示的设计。`

```mysql
create table `tb_test`
(
`user_id` bigint unsigned,
`login_info` json,
primary key (`user_id`)
) engine=innodb;

insert into `tb_test` values 
    (1, '{"tel": "13122335566", "QQ": "654321", "wechat": "jackfrued"}'),
    (2, '{"tel": "13599876543", "weibo": "wangdachui123"}');
```

如果要查询用户的手机和微信号，可以用如下所示的 SQL 语句：

```mysql
select 
    `user_id`,
    json_unquote(json_extract(`login_info`, '$.tel')) as 手机号,
    json_unquote(json_extract(`login_info`, '$.wechat')) as 微信 
from `tb_test`;
```

>

+---------+-------------+-----------+
| user_id | 手机号      | 微信      |
+---------+-------------+-----------+
|       1 | 13122335566 | jackfrued |
|       2 | 13599876543 | NULL      |
+---------+-------------+-----------+
2 rows in set (0.00 sec)

因为支持 JSON 类型，MySQL 也提供了配套的处理 JSON 数据的函数，就像上面用到的 `json_extract` 和 `json_unquote`。当然，上面的 SQL 还有更为便捷的写法，如下所示。

```mysql
select 
	`user_id`,
    `login_info` ->> '$.tel' as 手机号,
    `login_info` ->> '$.wechat' as 微信
from `tb_test`;
```

示例 2：
如果我们的产品要实现用户画像功能（给用户打标签），然后基于用户画像给用户推荐平台的服务或消费品之类的东西，我们也可以使用 JSON 类型来保存用户画像数据，示意代码如下所示。

创建画像标签表：

```mysql
create table `tb_tags`
(
`tag_id` int unsigned not null comment '标签ID',
`tag_name` varchar(20) not null comment '标签名',
primary key (`tag_id`)
) engine=innodb;

insert into `tb_tags` (`tag_id`, `tag_name`) 
values
    (1, '70后'),
    (2, '80后'),
    (3, '90后'),
    (4, '00后'),
    (5, '爱运动'),
    (6, '高学历'),
    (7, '小资'),
    (8, '有房'),
    (9, '有车'),
    (10, '爱看电影'),
    (11, '爱网购'),
    (12, '常点外卖');
```

为用户打标签：

```mysql
create table `tb_users_tags`
(
`user_id` bigint unsigned not null comment '用户ID',
`user_tags` json not null comment '用户标签'
) engine=innodb;

insert into `tb_users_tags` values 
    (1, '[2, 6, 8, 10]'),
    (2, '[3, 10, 12]'),
    (3, '[3, 8, 9, 11]');
```

接下来，我们通过一组查询来了解 JSON 类型的巧妙之处。

1. 查询爱看电影（有 `10` 这个标签）的用户 ID。
   ```sql
   select * from `tb_users` where 10 member of (user_tags->'$');
   ```
2. 查询爱看电影（有 `10` 这个标签）的 80 后（有 `2` 这个标签）用户 ID。

   ```mysql
   select * from `tb_users` where json_contains(user_tags->'$', '[2, 10]');
   ```
3. 查询爱看电影或 80 后或 90 后的用户 ID。
   ```mysql
   select `user_id` from `tb_users_tags` where json_overlaps(user_tags->'$', '[2, 3, 10]');
   ```

上面的查询用到了 `member of` 谓词和两个 JSON 函数，`json_contains` 可以检查 JSON 数组是否包含了指定的元素，而 `json_overlaps` 可以检查 JSON 数组是否与指定的数组有重叠部分。

### 窗口函数

MySQL 从 8.0 开始支持窗口函数，大多数商业数据库和一些开源数据库早已提供了对窗口函数的支持，有的也将其称之为 OLAP（联机分析和处理）函数，听名字就知道跟统计和分析相关。为了帮助大家理解窗口函数，我们先说说窗口的概念。

窗口可以理解为记录的集合，窗口函数也就是在满足某种条件的记录集合上执行的特殊函数，对于每条记录都要在此窗口内执行函数。窗口函数和我们上面讲到的聚合函数比较容易混淆，二者的区别主要在于聚合函数是将多条记录聚合为一条记录，窗口函数是每条记录都会执行，执行后记录条数不会变。窗口函数不仅仅是几个函数，它是一套完整的语法，函数只是该语法的一部分，基本语法如下所示：

```mysql
<窗口函数> over (partition by <用于分组的列名> order by <用户排序的列名>)
```

上面语法中，窗口函数的位置可以放以下两种函数：

1. 专用窗口函数，包括：`lead`、`lag`、`first_value`、`last_value`、`rank`、`dense_rank` 和 `row_number` 等。
2. 聚合函数，包括：`sum`、`avg`、`max`、`min` 和 `count` 等。

下面为大家举几个使用窗口函数的简单例子，我们先用如下所示的 SQL 建库建表：

```mysql
-- 创建名为hrs的数据库并指定默认的字符集
create database `hrs` default charset utf8mb4;

-- 切换到hrs数据库
use `hrs`;

-- 创建部门表
create table `tb_dept`
(
`dno` int not null comment '编号',
`dname` varchar(10) not null comment '名称',
`dloc` varchar(20) not null comment '所在地',
primary key (`dno`)
);

-- 插入4个部门
insert into `tb_dept` values 
    (10, '会计部', '北京'),
    (20, '研发部', '成都'),
    (30, '销售部', '重庆'),
    (40, '运维部', '深圳');

-- 创建员工表
create table `tb_emp`
(
`eno` int not null comment '员工编号',
`ename` varchar(20) not null comment '员工姓名',
`job` varchar(20) not null comment '员工职位',
`mgr` int comment '主管编号',
`sal` int not null comment '员工月薪',
`comm` int comment '每月补贴',
`dno` int not null comment '所在部门编号',
primary key (`eno`),
constraint `fk_emp_mgr` foreign key (`mgr`) references tb_emp (`eno`),
constraint `fk_emp_dno` foreign key (`dno`) references tb_dept (`dno`)
);

-- 插入14个员工
insert into `tb_emp` values 
    (7800, '张三丰', '总裁', null, 9000, 1200, 20),
    (2056, '乔峰', '分析师', 7800, 5000, 1500, 20),
    (3088, '李莫愁', '设计师', 2056, 3500, 800, 20),
    (3211, '张无忌', '程序员', 2056, 3200, null, 20),
    (3233, '丘处机', '程序员', 2056, 3400, null, 20),
    (3251, '张翠山', '程序员', 2056, 4000, null, 20),
    (5566, '宋远桥', '会计师', 7800, 4000, 1000, 10),
    (5234, '郭靖', '出纳', 5566, 2000, null, 10),
    (3344, '黄蓉', '销售主管', 7800, 3000, 800, 30),
    (1359, '胡一刀', '销售员', 3344, 1800, 200, 30),
    (4466, '苗人凤', '销售员', 3344, 2500, null, 30),
    (3244, '欧阳锋', '程序员', 3088, 3200, null, 20),
    (3577, '杨过', '会计', 5566, 2200, null, 10),
    (3588, '朱九真', '会计', 5566, 2500, null, 10);
```

例子 1：查询按月薪从高到低排在第 4 到第 6 名的员工的姓名和月薪。

```sql
select * from (
	select 
		`ename`, `sal`,
		row_number() over (order by `sal` desc) as `rank`
	from `tb_emp`
) `temp` where `rank` between 4 and 6;
```

> **说明**：上面使用的函数 `row_number()` 可以为每条记录生成一个行号，在实际工作中可以根据需要将其替换为 `rank()` 或 `dense_rank()` 函数，三者的区别可以参考官方文档或阅读 [《通俗易懂的学会：SQL窗口函数》](https://zhuanlan.zhihu.com/p/92654574)进行了解。在 MySQL 8 以前的版本，我们可以通过下面的方式来完成类似的操作。
>
> ```sql
> select `rank`, `ename`, `sal` from (
>     select @a:=@a+1 as `rank`, `ename`, `sal` 
>     from `tb_emp`, (select @a:=0) as t 1 order by `sal` desc
> ) t 2 where `rank` between 4 and 6;
> ```

例子 2：查询每个部门月薪最高的两名的员工的姓名和部门名称。

```sql
select `ename`, `sal`, `dname` 
from (
    select 
        `ename`, `sal`, `dno`,
        rank() over (partition by `dno` order by `sal` desc) as `rank`
    from `tb_emp`
) as `temp` natural join `tb_dept` where `rank`<=2;
```

> 说明：在 MySQL 8 以前的版本，我们可以通过下面的方式来完成类似的操作。

```mysql
select `ename`, `sal`, `dname` from `tb_emp` as `t1` 
natural join `tb_dept` where ( select count(*) from `tb_emp` as `t2` where `t1`.`dno`=`t2`.`dno` and `t2`.`sal`>`t1`.`sal` )<2 order by `dno` asc, `sal` desc;
```

## MySQL 安装

- Windows 安装 MySQL：[Windows下載](https://dev.mysql.com/downloads/windows/installer/8.0.html)

### MySQL 安装

- 安装 MySQL
- 配置 `my.ini`
- 启动管理员模式下的CMD，并将路径切换至mysql下的bin目录，然后输入`mysqld –install` (安装mysql)；
- 再输入 `mysqld --initialize-insecure --user=mysql` 初始化数据文件；
- 然后输入命令`net start mysql`再次启动mysql 然后用命令 `mysql –u root –p` 进入mysql管理界面（密码可为空）；
- 进入界面后更改root密码；

```shell
update mysql.user set authentication_string=password('root') where user='root' 
and Host = 'localhost';
```

- 刷新权限；

```shell
flush privileges;
```

- 重启 MySQL 服务

```shell
net stop MySQL
net start MySQL
```

### `my.ini配置`

#### my.ini配置文件简介

MySQL 的配置文件是 `my.ini`，在 MySQL 的数据存储目录（如果没有该配置文件，需要自己新建一个空白txt文档，更名为my.ini，放到该目录下）：
![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409192359131.png)

MySQL 的配置信息都在这个文件夹里面。数据库的字符集、端口号、数据目录的地址、日志文件等。

`my.ini` 从结构上可以分为三大块：

- `[client]信息：` 配置图形界面的设置
- `[mysql]信息：` 配置的是命令行客户端的设置
- `[mysqld]信息：` 配置的时数据库的设置，重点

每次修改my.ini配置文件后，如果想让其生效

```shell
# 关闭mysql服务
net stop mysql80

# 加载下配置文件
mysqld --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --console

# 重启mysql服务
net start mysql80
```

#### `my.ini` 配置项

```shell
 1 [mysqld]
 2 # 设置3306端口
 3 port=3306
 4 # 设置mysql的安装目录，修改为自己的安装目录路径。
 5 basedir=E:\Software\mysql-8.0.19-winx64
 6 # 设置mysql数据库的数据的存放目录，在安装mysql-5.7.30-winx64.zip版本的时候，此配置不可添加，否则mysql将无法启动。修改为自己的安装目录路径。
 7 datadir=E:\Software\mysql-8.0.19-winx64\data
 8 # 允许最大连接数
 9 max_connections=200
10 # 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
11 max_connect_errors=10
12 # 服务端使用的字符集默认为UTF8
13 character-set-server=utf8
14 # 创建新表时将使用的默认存储引擎
15 default-storage-engine=INNODB
16 # 默认使用“mysql_native_password”插件认证
17 default_authentication_plugin=mysql_native_password
18 # 关闭ssl
19 skip_ssl
20 # 配置时区
21 default-time_zone='+8:00'
22 [mysql]
23 # 设置mysql客户端默认字符集
24 default-character-set=utf8
25 [client]
26 # 设置mysql客户端连接服务端时默认使用的端口
27 port=3306
28 default-character-set=utf8
```

### MySQL 可视化工具

#### SQLyog

- 可手动操作,管理MySQL数据库的软件工具。
- 特点 : 简洁 , 易用 , 图形化。
- 收费

#### Navicat

收费

# 资源

- 视频
  - ⭐ 2022 黑马 MySQL 教程：<https://www.bilibili.com/video/BV1Kr4y1i7ru>（倾向于速成，初学只看完 P57 节前的基础篇即可，后面可以再来补进阶知识）
  - 老杜 - mysql入门基础 + 数据库实战：<https://www.bilibili.com/video/BV1Vy4y1z7EX> （内容相对精炼，有习题）
  - 尚硅谷 - MySQL基础教程：<https://www.bilibili.com/video/BV1xW411u7ax> （小姐姐讲课，但感觉音质一般）
- 在线练习
  - ⭐ 鱼皮的闯关式 SQL 自学网：<http://sqlmother.yupi.icu/>
  - ⭐ SQL 在线运行：<https://www.bejson.com/runcode/sql/>
- 文档
  - SQL - 菜鸟教程：<https://www.runoob.com/sql/sql-tutorial.html>
  - MySQL - 菜鸟教程：<https://www.runoob.com/mysql/mysql-tutorial.html>
- 网站
  - [数据库大全](https://www.code-nav.cn/rd/?rid=b00064a76012546b016e274a3724c5f0)：果创云收录的各种数据库表设计

#### DBeaver

免费
