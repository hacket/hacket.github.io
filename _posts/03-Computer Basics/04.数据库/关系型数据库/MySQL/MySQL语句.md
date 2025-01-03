---
date created: 2024-09-20 00:37
date updated: 2024-11-22 08:48
tags:
  - >-
    #创建Student表（学号int、登录密码varchar（20）、姓名varchar、性别varchar（2）、出生日期（Datetime）、家庭住址、email）
  - '#...'
---

# MySQL 基本命令

## 查看命令

### 1. 查看所有数据库

```sql
show databases;
```

### 2. 查看所有字符集

```sql
show character set;
```

> +----------+---------------------------------+---------------------+--------+

| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| armscii 8 | ARMSCII-8 Armenian              | armscii 8_general_ci |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| big 5     | Big 5 Traditional Chinese        | big 5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
| cp 1250   | Windows Central European        | cp 1250_general_ci   |      1 |
| cp 1251   | Windows Cyrillic                | cp 1251_general_ci   |      1 |
| cp 1256   | Windows Arabic                  | cp 1256_general_ci   |      1 |
| cp 1257   | Windows Baltic                  | cp 1257_general_ci   |      1 |
| cp 850    | DOS West European               | cp 850_general_ci    |      1 |
| cp 852    | DOS Central European            | cp 852_general_ci    |      1 |
| cp 866    | DOS Russian                     | cp 866_general_ci    |      1 |
| cp 932    | SJIS for Windows Japanese       | cp 932_japanese_ci   |      2 |
| dec 8     | DEC West European               | dec 8_swedish_ci     |      1 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| gb 18030  | China National Standard GB 18030 | gb 18030_chinese_ci  |      4 |
| gb 2312   | GB 2312 Simplified Chinese       | gb 2312_chinese_ci   |      2 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| geostd 8  | GEOSTD 8 Georgian                | geostd 8_general_ci  |      1 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| hp 8      | HP West European                | hp 8_english_ci      |      1 |
| keybcs 2  | DOS Kamenicky Czech-Slovak      | keybcs 2_general_ci  |      1 |
| koi 8 r    | KOI 8-R Relcom Russian           | koi 8 r_general_ci    |      1 |
| koi 8 u    | KOI 8-U Ukrainian                | koi 8 u_general_ci    |      1 |
| latin 1   | cp 1252 West European            | latin 1_swedish_ci   |      1 |
| latin 2   | ISO 8859-2 Central European     | latin 2_general_ci   |      1 |
| latin 5   | ISO 8859-9 Turkish              | latin 5_turkish_ci   |      1 |
| latin 7   | ISO 8859-13 Baltic              | latin 7_general_ci   |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| swe 7     | 7 bit Swedish                    | swe 7_swedish_ci     |      1 |
| tis 620   | TIS 620 Thai                     | tis 620_thai_ci      |      1 |
| ucs 2     | UCS-2 Unicode                   | ucs 2_general_ci     |      2 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| utf 16    | UTF-16 Unicode                  | utf 16_general_ci    |      4 |
| utf 16 le  | UTF-16 LE Unicode                | utf 16 le_general_ci  |      4 |
| utf 32    | UTF-32 Unicode                  | utf 32_general_ci    |      4 |
| utf 8 mb 3  | UTF-8 Unicode                   | utf 8 mb 3_general_ci  |      3 |
| utf 8 mb 4  | UTF-8 Unicode                   | utf 8 mb 4_0900_ai_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
41 rows in set (0.00 sec)

如果要设置 MySQL 服务启动时默认使用的字符集，可以修改 MySQL 的配置并添加以下内容。

```mysql
character-set-server=utf8
```

### 3. 查看所有的排序规则

```sql
show collation;
```

### 4. 查看所有的引擎

在创建表的时候，可以自行选择底层的存储引擎。MySQL 支持多种存储引擎，可以通过 `show engines` 命令进行查看。MySQL 5.5 以后的版本默认使用的存储引擎是 InnoDB，它是我们推荐大家使用的存储引擎（因为更适合当下互联网应用对高并发、性能以及事务支持等方面的需求），为了 SQL 语句的向下兼容性，我们可以在建表语句结束处右圆括号的后面通过 `engine=innodb` 来指定使用 InnoDB 存储引擎。

```sql
show engines;
```

> *************************** 1. Row ***************************

```
  Engine: InnoDB
 Support: DEFAULT
 Comment: Supports transactions, row-level locking, and foreign keys
```

Transactions: YES
XA: YES
Savepoints: YES
*************************** 2. Row ***************************
Engine: MRG_MYISAM
Support: YES
Comment: Collection of identical MyISAM tables
Transactions: NO
XA: NO
Savepoints: NO
*************************** 3. Row ***************************
Engine: MEMORY
Support: YES
Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
XA: NO
Savepoints: NO
*************************** 4. Row ***************************
Engine: BLACKHOLE
Support: YES
Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
XA: NO
Savepoints: NO
*************************** 5. Row ***************************
Engine: MyISAM
Support: YES
Comment: MyISAM storage engine
Transactions: NO
XA: NO
Savepoints: NO
*************************** 6. Row ***************************
Engine: CSV
Support: YES
Comment: CSV storage engine
Transactions: NO
XA: NO
Savepoints: NO
*************************** 7. Row ***************************
Engine: ARCHIVE
Support: YES
Comment: Archive storage engine
Transactions: NO
XA: NO
Savepoints: NO
*************************** 8. Row ***************************
Engine: PERFORMANCE_SCHEMA
Support: YES
Comment: Performance Schema
Transactions: NO
XA: NO
Savepoints: NO
*************************** 9. Row ***************************
Engine: FEDERATED
Support: NO
Comment: Federated MySQL storage engine
Transactions: NULL
XA: NULL
Savepoints: NULL
9 rows in set (0.00 sec)

下面的表格对 MySQL 几种常用的数据引擎进行了简单的对比：

| 特性                                                                            | InnoDB   | MRG_MYISAM | MEMORY | MyISAM |
| ----------------------------------------------------------------------------- | -------- | ---------- | ------ | ------ |
| 存储限制                                                                          | 有        | 没有         | 有      | 有      |
| 事务                                                                            | 支持       |            |        |        |
| 锁机制                                                                           | 行锁       | 表锁         | 表锁     | 表锁     |
| B 树索引                                                                         | 支持       | 支持         | 支持     | 支持     |
| 哈希索引                                                                          |          |            | 支持     |        |
| 全文检索                                                                          | 支持（5.6+） |            |        | 支持     |
| 集群索引                                                                          | 支持       |            |        |        |
| 数据缓存                                                                          | 支持       |            | 支持     |        |
| 索引缓存                                                                          | 支持       | 支持         | 支持     | 支持     |
| 数据可压缩                                                                         |          |            |        | 支持     |
| 内存使用                                                                          | 高        | 低          | 中      | 低      |
| 存储空间使用                                                                        | 高        | 低          |        | 低      |
| 批量插入性能                                                                        | 低        | 高          | 高      | 高      |
| 是否支持外键                                                                        | 支持       |            |        |        |
| `InnoDB 是唯一能够支持外键、事务以及行锁的存储引擎，所以我们之前说它更适合互联网应用，而且在较新版本的 MySQL 中，它也是默认使用的存储引擎。 |          |            |        |        |
| #### 5. 查看所有日志文件                                                              |          |            |        |        |
| ```sql                                                                        |          |            |        |        |
| show binary logs;                                                             |          |            |        |        |
| ```                                                                           |          |            |        |        |
| #### 6. 查看数据库下所有表                                                             |          |            |        |        |
| ```sql                                                                        |          |            |        |        |
| show tables;                                                                  |          |            |        |        |
| ```                                                                           |          |            |        |        |
| ### 获取帮助                                                                      |          |            |        |        |

在 MySQL 命令行工具中，可以使用 `help` 命令或 `?` 来获取帮助，如下所示。

1. 查看 `show` 命令的帮助。
   ```sql
   ```

? Show
` 2. 查看有哪些帮助内容。
    `sql
? Contents
` 3. 获取函数的帮助。
    `sql
? Functions

````
4. 获取数据类型的帮助。
通过 MySQL 的帮助系统来了解每种数据类型的特性、数据的长度和精度等相关信息。

```sql
? data types
````

在数据类型的选择上，保存字符串数据通常都使用 `VARCHAR` 和 `CHAR` 两种类型，前者通常称为变长字符串，而后者通常称为定长字符串；对于 InnoDB 存储引擎，行存储格式没有区分固定长度和可变长度列，因此 `VARCHAR` 类型和 `CHAR` 类型没有本质区别，后者不一定比前者性能更好。如果要保存的很大字符串，可以使用 `TEXT` 类型；如果要保存很大的字节串，可以使用 `BLOB`（二进制大对象）类型。在 MySQL 中，`TEXT` 和 `BLOB` 又分别包括 `TEXT`、`MEDIUMTEXT`、`LONGTEXT` 和 `BLOB`、`MEDIUMBLOB`、`LONGBLOB` 三种不同的类型，它们主要的区别在于存储数据的最大大小不同。保存浮点数可以用 `FLOAT` 或 `DOUBLE` 类型，`FLOAT` 已经不推荐使用了，而且在 MySQL 后续的版本中可能会被移除掉。而保存定点数应该使用 `DECIMAL` 类型。如果要保存时间日期，`DATETIME` 类型优于 `TIMESTAMP` 类型，因为前者能表示的时间日期范围更大。

### 其他命令

1. 新建/重建服务器连接 - `connect` / `resetconnection`。
2. 清空当前输入 - `\c`。在输入错误时，可以及时使用 `\c` 清空当前输入并重新开始。
3. 修改终止符（定界符）- `delimiter`。默认的终止符是 `;`，可以使用该命令修改成其他的字符，例如修改为 `$` 符号，可以用 `delimiter $` 命令。
4. 打开系统默认编辑器 - `edit`。编辑完成保存关闭之后，命令行会自动执行编辑的内容。
5. 查看服务器状态 - `status`。
6. 修改默认提示符 - `prompt`。
7. 执行系统命令 - `system`。可以将系统命令跟在 `system` 命令的后面执行，`system` 命令也可以缩写为 `\!`。
8. 执行 SQL 文件 - `source`。`source` 命令后面跟 SQL 文件路径。
9. 重定向输出 - `tee` / `notee`。可以将命令的输出重定向到指定的文件中。
10. 切换数据库 - `use`。
11. 显示警告信息 - `warnings`。
12. 退出命令行 - `quit` 或 `exit`。

# 数据库操作

结构化查询语句分类

|      名称     | 解释                  | 命令                          |
| :---------: | ------------------- | --------------------------- |
| 数据定义语言(DDL) | 定义和管理数据对象，如数据库、数据表等 | `CRATE`、`DROP`、`ALTER`      |
| 数据操作语言(DML) | 用于操作数据库对象中所包含的数据    | `INSERT`、`UPDATE`、`DELETE`  |
| 数据查询语言(DQL) | 用于查询数据库数据           | `SELECT`                    |
| 数据控制语言(DCL) | 用于管理数据的语言，包括权限及数据更改 | `GRANT`、`COMMIT`、`ROLLBACK` |

## 连接数据库

> mysql -h 服务器主机地址 -u 用户名 -p 用户密码

如：

```shell
mysql -uroot -pxxx
```

对于自己的机器来说，可以写“127.0.0.1”，这个ip就是本机回还地址；也可以写“localhost”。\
**-h、-u后面可以加个空格，也可以不加，但是-p后面的密码不允许有空格，否则就错了。所以这个-p后面可以直接跟密码，也可以不写等下一行再写。**

## 操作数据库

- 创建数据库 : `create database [if not exists] 数据库名;`
- 删除数据库 : `drop database [if exists] 数据库名;`
- 查看数据库 : `show databases;`
- 使用数据库 : `use 数据库名;`

> 到这种语句中有中括号的，都是可写可不写的。

```sql
CREATE DATABASE westos;

DROP DATABASE westos;

SHOW DATABASES;
-- tab键上面，如果你的表名或字段名是一个特殊字符，就需要带 ``
USE book;
```

## 表 (DDL)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202310940.png)

1、建表的时候用的不是单引号，而是一小撇 `：就键盘上波浪线那个按键；但是在没有跟保留字冲突的时候可以不加。\
2、小括号之间创建的各个列之间有逗号，但是最后一个没有逗号。\
3、表明随便取；字段名也是随便取（可中文可英文）。

**示例：**

```mysql
#创建Student表（学号int、登录密码varchar（20）、姓名varchar、性别varchar（2）、出生日期（Datetime）、家庭住址、email）
CREATE TABLE IF NOT EXISTS student(
      id INT(4) PRIMARY KEY  AUTO_INCREMENT COMMENT '主键 ，学号',
      pwd VARCHAR(6) DEFAULT '123456' NOT NULL COMMENT '密码',
      `name` VARCHAR(30) DEFAULT 'a' NOT NULL COMMENT '姓名',
      sex VARCHAR(2) NOT NULL DEFAULT '1',
      birthday DATETIME,
      address VARCHAR(100),
      email VARCHAR(50)    
)
```

#### 数据值和列类型

##### 数值类型

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202327706.png)

- 最后一个：`decimal(13,2)` 代表这个数字有13位，小数点后面有2位。

##### 字符串类型

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202328551.png)

- 前两个的区别在于一个定长一个可变长。

##### 日期和时间型数值类型

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202328410.png)

##### NULL值

- 理解为“没有值”或者“未知值”
- 不要用NULL进行算数运算，结构仍为NULL

##### 如何选择合适的数据类型

1. 整数和浮点：如果你存的这一列没有小数，就选整数类型（货币选 decimal）
2. 日期类型：一般选 `DATETIME` 类型；以后可能会用到 TIMESTAMP 类型。但是后面这个的存储范围是小于前面这个的。
3. `char` 和 `varchar`：char 是固定长度的，varchar 是可变长度的。如果存储的东西对速度要求很高而对空间要求比较小，就用 char；反之则用 varchar。

#### 数据字段属性

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202334067.png)

**Auto_InCrement: **

- 自动增长的 , 每添加一条数据 , 自动在上一个记录数上加 1(默认)；
- 通常用于设置**主键** , 且为整数类型；
- 可定义起始值和步长；
  - 当前表设置步长(`AUTO_INCREMENT=100`) : 只影响当前表；
  - SET @@auto_increment_increment=5 ; 影响所有使用自增的表(全局)；

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409202357270.png)

`每一个表 ，都必须存在以下五个字段`：

- id 主键；
- vorsion 乐观锁；
- is_delete 伪删除；
- gmt_create 创建时间；
- gmt_update 修改时间；

#### 创建数据表

- 属于DDL的一种，语法 :

```mysql
create table [if not exists] `表名`(
   '字段名1' 列类型 [属性][索引][注释],
   '字段名2' 列类型 [属性][索引][注释],
  #...
   '字段名n' 列类型 [属性][索引][注释]
)[表类型][表字符集][注释];
```

- 反引号用于区别MySQL保留字与普通字符而引入的 (键盘esc下面的键)。
- 小括号之间创建的各个列之间有逗号，但是最后一个没有逗号。
- 表明随便取；字段名也是随便取（可中文可英文）。

**例如,性别字段,默认为"男" , 否则为 “女” ; 若无指定该列的值 , 则默认值为"男"的值；**

```mysql
-- 目标 : 创建一个school数据库
-- 创建学生表(列,字段)
-- 学号int 登录密码varchar(20) 姓名,性别varchar(2),出生日期(datatime),家庭住址,email

-- 创建表之前, 一定要先选择数据库
USE school;

CREATE TABLE IF NOT EXISTS `student` (
    `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
    `name` varchar(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
    `pwd` varchar(20) NOT NULL DEFAULT '123456' COMMENT '密码',
    `sex` varchar(2) NOT NULL DEFAULT '男' COMMENT '性别',
    `birthday` datetime DEFAULT NULL COMMENT '出生日期',
    `address` varchar(100) DEFAULT NULL COMMENT '地址',
    `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 查看数据库的定义
SHOW CREATE DATABASE school;

-- 查看数据表的定义
SHOW CREATE TABLE student;

-- 显示表结构
DESC student;  -- 设置严格检查模式(不能容错了)SET sql_mode='STRICT_TRANS_TABLES';
```

#### 数据表的类型

```mysql
CREATE TABLE 表名(
   -- 省略的代码
   -- Mysql注释
   -- 1. # 单行注释
   -- 2. /*...*/ 多行注释
)ENGINE = MyISAM (or InnoDB)

-- 查看mysql所支持的引擎类型 (表类型)
SHOW ENGINES;
```

- MySQL的数据表的类型 : **MyISAM** , **InnoDB** , HEAP , BOB , CSV等…
- 常见的 MyISAM 与 InnoDB 类型：

|   名称  | MyISAM | InnoDB |
| :---: | :----: | :----: |
|  事务处理 |   不支持  |   支持   |
| 数据行锁定 |   不支持  |   支持   |
|  外键约束 |   不支持  |   支持   |
|  全文索引 |   支持   |   不支持  |
| 表空间大小 |   较小   | 较大，约2倍 |

- 适用场合:
  - 适用 MyISAM : 节约空间及相应速度；
  - 适用 InnoDB : 安全性 , 事务处理，多用户操作数据表；

- 在物理空间存在的位置: MySQL 数据表以文件方式存放在磁盘中；
  - 包括表文件 , 数据文件 , 以及数据库的选项文件；
  - 位置 : Mysql安装目录`\data\`下存放数据表 . 目录名对应数据库名 , 该目录下文件名对应数据表；

- 注意 :
  - `*.frm` – 表结构定义文件；
  - `*.MYD` – 数据文件 ( data )；
  - `*.MYI` – 索引文件 ( index )；
  - InnoDB类型数据表只有一个`*.frm`文件 , 以及上一级目录的ibdata1文件；
  - MyISAM类型数据表对应三个文件：![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409210008962.png)

- 设置数据表字符集：我们可为数据库,数据表,数据列设定不同的字符集，设定方法：
  - 创建时通过命令来设置 , 如 : `CREATE TABLE 表名() CHARSET = utf8;`
  - 如无设定 , 则根据MySQL数据库配置文件 my.ini 中的参数设定。

## 修改数据库

##### 修改表 ( ALTER TABLE )

- 修改表名 :`ALTER TABLE 旧表名 RENAME AS 新表名；`

- 添加字段 : `ALTER TABLE 表名 ADD 字段名 列属性[属性]；`

- 修改字段 :

  - `ALTER TABLE 表名 MODIFY 字段名 列类型[属性]；`
  - `ALTER TABLE 表名 CHANGE 旧字段名 新字段名 列属性[属性]；`

- 删除字段 : `ALTER TABLE 表名 DROP 字段名；`

**示例：**

```mysql
USE school;

CREATE TABLE `teacher`( 
    `id` INT(10) NOT NULL COMMENT '教师ID', 
    `name` VARCHAR(100) NOT NULL COMMENT '教师姓名', 
    `age` INT(3) NOT NULL COMMENT '教师年龄', 
    PRIMARY KEY (`id`)
) ENGINE=INNOBASE CHARSET=utf8 COLLATE=utf8_general_ci;

-- 修改表名 :`ALTER TABLE 旧表名 RENAME AS 新表名；`
ALTER TABLE teacher RENAME AS teacher1;

-- 添加字段 : `ALTER TABLE 表名 ADD 字段名 列属性[属性]；`
ALTER TABLE teacher1 ADD age INT(12);

-- 修改字段 : `ALTER TABLE 表名 MODIFY 字段名 列类型[属性]；`
ALTER TABLE teacher1 MODIFY age VARCHAR(12);	-- 修改约束
ALTER TABLE teacher1 CHANGE age age1 INT(12);    -- 字段重命名

-- 删除字段 :  `ALTER TABLE 表名 DROP 字段名；`
ALTER TABLE teacher1 DROP age1;
```

### 删除数据表

- 语法：`DROP TABLE [IF EXISTS] 表名；`
  - IF EXISTS 为可选 , 判断是否存在该数据表；
  - 如删除不存在的数据表会抛出错误；

**注意：**

- 可用反引号为标识符（库名、表名、字段名、索引、别名）包裹，以避免与关键字重名！中文也可以作为标识符！

- 每个库目录存在一个保存当前数据库的选项文件`db.opt`。

- 注释：
  1. 单行注释： `# 注释内容`
  2. 多行注释 ：`/* 注释内容 */`
  3. 单行注释： `– 注释内容` (标准SQL注释风格，要求双破折号后加一空格符（空格、TAB、换行等）)

- 模式通配符：
  1. `_`： 任意单个字符
  2. `%` ： 任意多个字符，甚至包括零字符
  3. 单引号需要进行转义 `\’`

- CMD命令行内的语句结束符可以为 “`;`”, “`\G`”, “`\g`”，仅影响显示结果。其他地方还是用分号结束。delimiter 可修改当前对话的语句结束符。

- `SQL对大小写不敏感 （关键字）

- 清除已有语句：`\c`

# MySQL数据管理

## 外键

### 外键概念

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409210018154.png)

​如果公共关键字在一个关系中是主关键字，那么这个公共关键字被称为另一个关系的外键。由此可见，外键表示了两个关系之间的相关联系。以另一个关系的外键作主关键字的表被称为**主表**，具有此外键的表被称为主表的**从表**。

​在实际操作中，将一个表的值放入第二个表来表示关联，所使用的值是第一个表的主键值(在必要时可包括复合主键值)。此时，第二个表中保存这些值的属性称为外键(**foreign key**)。

### 外键作用

- 保持数据**一致性**，**完整性**，主要目的是控制存储在外键表中的数据，**约束**。使两张表形成关联，外键只能引用外表中的列的值或使用空值。

### 创建外键

- 建表时指定外键约束

```mysql
-- 创建外键的方式一 : 创建子表同时创建外键

-- 年级表 (id\年级名称)
CREATE TABLE `grade` (
`gradeid` INT(10) NOT NULL AUTO_INCREMENT COMMENT '年级ID',
`gradename` VARCHAR(50) NOT NULL COMMENT '年级名称',
PRIMARY KEY (`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- 学生信息表 (学号,姓名,性别,年级,手机,地址,出生日期,邮箱,身份证号)
CREATE TABLE `student2` (
`studentno` INT(4) NOT NULL COMMENT '学号',
`studentname` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
`sex` TINYINT(1) DEFAULT '1' COMMENT '性别',
`gradeid` INT(10) DEFAULT NULL COMMENT '年级',
`phoneNum` VARCHAR(50) NOT NULL COMMENT '手机',
`address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
`borndate` DATETIME DEFAULT NULL COMMENT '生日',
`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
`idCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
PRIMARY KEY (`studentno`),
KEY `FK_gradeid` (`gradeid`),
CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade` (`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

```

- 当创建完子表之后，点开你创建的这个表，如果可以在你创建的这个表的indexes下面看到你创建的外键名，则创建外键就成功了。如下：

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409210021408.png)

- 建表后修改

```mysql
-- 创建外键方式二 : 创建子表完毕后,修改子表添加外键
CREATE TABLE `student` (
`id` INT(4) NOT NULL COMMENT '学号',
`name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
`sex` TINYINT(1) DEFAULT '1' COMMENT '性别',
`gradeid` INT(10) DEFAULT NULL COMMENT '年级',
`phoneNum` VARCHAR(50) NOT NULL COMMENT '手机',
`address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
`borndate` DATETIME DEFAULT NULL COMMENT '生日',
`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
`idCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

ALTER TABLE `student`
ADD CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade` (`gradeid`);
```

### 删除外键

- 操作：删除 grade 表，发现报错；

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409210022367.png)

- **注意** : ==删除具有主外键关系的表时 , 要先删子表 , 后删主表==。

```mysql
-- 删除外键
ALTER TABLE student DROP FOREIGN KEY FK_gradeid;
-- 发现执行完上面的,索引还在,所以还要删除索引
-- 注:这个索引是建立外键的时候默认生成的
ALTER TABLE student DROP INDEX FK_gradeid;
```

## DML

**管理数据库数据方法：**

- 通过SQLyog等管理工具管理数据库数据；
- 通过**DML语句**管理数据库数据；

**DML语言** ：数据操作语言。

- 用于操作数据库对象中所包含的数据；
- 包括 :
  - INSERT (添加数据语句)；
  - DELETE (删除数据语句)；
  - UPDATE (更新数据语句)；

### 添加数据 INSERT

- **语法：**`INSERT INTO 表名[(字段1,字段2,字段3,...)] VALUES('值1','值2','值3');`

- **注意 :**
  - 字段或值之间用英文逗号隔开；
  - ’ 字段1,字段2…’ 该部分可省略 , 但添加的值务必与表结构,数据列,顺序相对应,且数量一致；
  - 可同时插入多条数据 , `values` 后用英文逗号隔开；

**示例1：**

```mysql
-- 插入语句（添加）
-- 语法 : INSERT INTO 表名[(字段1,字段2,字段3,...)] VALUES('值1','值2','值3')
INSERT INTO grade(gradename) VALUES ('大一');

-- 主键自增,那能否省略呢?
INSERT INTO grade VALUES ('大二');

-- 查询:INSERT INTO grade VALUE ('大二')
-- 错误代码：1136 Column count doesn`t match value count at row 1

-- 一次插入多条数据
INSERT INTO grade(gradename) VALUES ('大三'),('大四');

-- 结论:'字段1,字段2...'该部分可省略 , 但添加的值务必与表结构,数据列,顺序相对应,且数量一致.
```

**示例2：**

```mysql
CREATE TABLE `student` (
  `id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
  `name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
  `sex` VARCHAR(10) DEFAULT '1' COMMENT '性别',
  `gradeid` INT(10) DEFAULT NULL COMMENT '年级',
  `phoneNum` VARCHAR(50) DEFAULT NULL COMMENT '手机',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `borndate` DATETIME DEFAULT NULL COMMENT '生日',
  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
  `idCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
  PRIMARY KEY (`id`),
  KEY `FK_gradeid2` (`gradeid`)
) ENGINE=INNODB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT INTO `student`(`name`) VALUES ('张三');

INSERT INTO `student`(`name`,`address`,`sex`) VALUES ('张三','admin','男');

INSERT INTO `student`(`name`,`address`,`sex`) 
VALUES ('李四','pppppp','女'),('王五','tttttt','男');
```

### 修改数据 UPDATE

- 语法：`UPDATE 表名 SET column_name=value [,column_name2=value2,...] [WHEREcondition];`

- **注意 :**
  - `column_name` 为要更改的数据列；
  - `value` 为修改后的数据 , 可以为变量 , 具体指 , 表达式或者嵌套的SELECT结果；
  - `condition` 为筛选条件 , 如不指定则修改该表的所有列数据；

**示例1：**

```mysql
-- 案例
UPDATE `student` SET `name`='subei',`birthday`=CURRENT_DATE WHERE id = 5;
```

**示例2：**

```mysql
-- 修改年级名字，带了简介
UPDATE grade SET gradename = '高中' WHERE gradeid = 1;

-- 不指定条件情况下，会改动所有的表
UPDATE `grade` SET `gradename`='果汁';

-- 修改多个属性
UPDATE `student` SET `name`='admin',`email`='2943357596@qq.com' WHERE id = 2;
```

where条件子句，可以简单理解为 : 有条件地从表中筛选数据。

|    运算符   |    含义   |        范例        |   结果  |
| :------: | :-----: | :--------------: | :---: |
|     =    |    等于   |        5=6       | false |
| < > 或 != |   不等于   |       5!=6       |  true |
|     >    |    大于   |        5>6       | false |
|     <    |    小于   |        5<6       |  true |
|    >=    |   大于等于  |       5>=6       | false |
|    <=    |   小于等于  |       5<=6       |  true |
|  BETWEEN | 在某个范围之间 | BETWEEN 5 AND 10 |   -   |
|    AND   |    并且   |    5>1 AND 1>2   | false |
|    OR    |    或    |    5>1 OR 1>2    |  true |

```mysql
UPDATE `student` SET `name` = '高中' WHERE `id` <= 3;
```

### 删除数据 DELETE

#### DELETE命令

- 语法：`DELETE FROM 表名 [WHERE condition];`
- 注意：`condition`为筛选条件 , 如不指定则删除该表的所有列数据。

**示例1：**

```mysql
-- 删除最后一个数据
DELETE FROM grade WHERE gradeid = 5;
```

#### TRUNCATE命令

- 作用：用于完全清空表数据 , 但表结构 , 索引 , 约束等不变；
- 语法：`TRUNCATE [TABLE] 表名;`

```mysql
-- 清空年级表
TRUNCATE grade;
```

**注意：区别于DELETE命令**

- 相同：都能删除数据 , 不删除表结构 , 但`TRUNCATE`速度更快；
- 不同：
  - 使用`TRUNCATE TABLE` 重新设置`AUTO_INCREMENT`计数器；
  - 使用`TRUNCATE TABLE`不会对事务有影响。

**示例：**

```mysql
-- 创建一个测试表
CREATE TABLE `test` (
`id` INT(4) NOT NULL AUTO_INCREMENT,
`coll` VARCHAR(20) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

-- 插入几个测试数据
INSERT INTO test(coll) VALUES('row1'),('row2'),('row3');

-- 删除表数据(不带where条件的delete)
DELETE FROM test;
-- 结论:如不指定Where则删除该表的所有列数据,自增当前值依然从原来基础上进行,会记录日志.

-- 删除表数据(truncate)
TRUNCATE TABLE test;
-- 结论:truncate删除数据,自增当前值会恢复到初始值重新开始;不会记录日志.

-- 同样使用DELETE清空不同引擎的数据库表数据.重启数据库服务后
-- InnoDB : 自增列从初始值重新开始 (因为是存储在内存中,断电即失)
-- MyISAM : 自增列依然从上一个自增数据基础上开始 (存在文件中,不会丢失)
```

# DQL查询数据

## DQL 语言

**DQL( Data Query Language 数据查询语言 )**

- 查询数据库数据 , 如**SELECT**语句；
- 简单的单表查询或多表的复杂查询和嵌套查询；
- ==是数据库语言中最核心,最重要的语句==；
- 使用频率最高的语句；

### SELECT语法

```mysql
SELECT [ALL | DISTINCT]
{* | table.* | [table.field1[as alias1][,table.field2[as alias2]][,...]]}
FROM table_name [as table_alias]
  [left | right | inner join table_name2]  -- 联合查询
  [WHERE ...]  -- 指定结果需满足的条件
  [GROUP BY ...]  -- 指定结果按照哪几个字段来分组
  [HAVING]  -- 过滤分组的记录必须满足的次要条件
  [ORDER BY ...]  -- 指定查询记录按一个或多个条件排序
  [LIMIT {[offset,]row_count | row_countOFFSET offset}];
   -- 指定查询的记录从哪条至哪条
```

- **注意 : `[]` 括号代表可选的 , `{ }`括号代表必选得**。

**SQL 准备:**

```mysql
-- 创建一个school数据库
CREATE DATABASE IF NOT EXISTS `school`;

USE `school`; -- 创建学生表
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`(
    `studentno` INT(4) NOT NULL COMMENT '学号',
    `loginpwd` VARCHAR(20) DEFAULT NULL,
    `studentname` VARCHAR(20) DEFAULT NULL COMMENT '学生姓名',
    `sex` TINYINT(1) DEFAULT NULL COMMENT '性别，0或1',
    `gradeid` INT(11) DEFAULT NULL COMMENT '年级编号',
    `phone` VARCHAR(50) NOT NULL COMMENT '联系电话，允许为空',
    `address` VARCHAR(255) NOT NULL COMMENT '地址，允许为空',
    `borndate` DATETIME DEFAULT NULL COMMENT '出生时间',
    `email` VARCHAR (50) NOT NULL COMMENT '邮箱账号允许为空',
    `identitycard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
    PRIMARY KEY (`studentno`),
    UNIQUE KEY `identitycard`(`identitycard`),
    KEY `email` (`email`)
)ENGINE=MYISAM DEFAULT CHARSET=utf8;

-- 创建年级表
DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade`(
	`gradeid` INT(11) NOT NULL AUTO_INCREMENT COMMENT '年级编号',
  `gradename` VARCHAR(50) NOT NULL COMMENT '年级名称',
    PRIMARY KEY (`gradeid`)
) ENGINE=INNODB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8;

-- 创建科目表
DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject`(
	`subjectno`INT(11) NOT NULL AUTO_INCREMENT COMMENT '课程编号',
    `subjectname` VARCHAR(50) DEFAULT NULL COMMENT '课程名称',
    `classhour` INT(4) DEFAULT NULL COMMENT '学时',
    `gradeid` INT(4) DEFAULT NULL COMMENT '年级编号',
    PRIMARY KEY (`subjectno`)
)ENGINE = INNODB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8;

-- 创建成绩表
DROP TABLE IF EXISTS `result`;
CREATE TABLE `result`(
	`studentno` INT(4) NOT NULL COMMENT '学号',
    `subjectno` INT(4) NOT NULL COMMENT '课程编号',
    `examdate` DATETIME NOT NULL COMMENT '考试日期',
    `studentresult` INT (4) NOT NULL COMMENT '考试成绩',
    KEY `subjectno` (`subjectno`)
)ENGINE = INNODB DEFAULT CHARSET = utf8;

-- 插入学生数据
insert into `student` (`studentno`,`loginpwd`,`studentname`,`sex`,`gradeid`,`phone`,`address`,`borndate`,`email`,`identitycard`)
values
(1000,'111111','郭靖',1,1,'13500000001','北京海淀区中关村大街1号','1986-12-11 00:00:00','test1@bdqn.cn','450323198612111234'),
(1001,'123456','李文才',1,2,'13500000002','河南洛阳','1981-12-31 00:00:00','test1@bdqn.cn','450323198112311234'),
(1002,'111111','李斯文',1,1,'13500000003','天津市和平区','1986-11-30 00:00:00','test1@bdqn.cn','450323198611301234'),
(1003,'123456','武松',1,3,'13500000004','上海卢湾区','1986-12-31 00:00:00','test1@bdqn.cn','450323198612314234'),
(1004,'123456','张三',1,4,'13500000005','北京市通州','1989-12-31 00:00:00','test1@bdqn.cn','450323198612311244'),
(1005,'123456','张秋丽 ',2,1,'13500000006','广西桂林市灵川','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311214'),
(1006,'123456','肖梅',2,4,'13500000007','地址不详','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311134'),
(1007,'111111','欧阳峻峰',1,1,'13500000008','北京东城区','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311133'),
(1008,'111111','梅超风',1,1,'13500000009','河南洛阳','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311221'),
(1009,'123456','刘毅',1,2,'13500000011','安徽','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311231'),
(1010,'111111','大凡',1,1,'13500000012','河南洛阳','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311044'),
(1011,'111111','奥丹斯',1,1,'13500000013','北京海淀区中关村大街*号','1984-12-31 00:00:00','test1@bdqn.cn','450323198412311234'),
(1012,'123456','多伦',2,3,'13500000014','广西南宁中央大街','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311334'),
(1013,'123456','李梅',2,1,'13500000015','上海卢湾区','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311534'),
(1014,'123456','张得',2,4,'13500000016','北京海淀区中关村大街*号','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311264'),
(1015,'123456','李东方',1,4,'13500000017','广西桂林市灵川','1976-12-31 00:00:00','test1@bdqn.cn','450323197612311234'),
(1016,'111111','刘奋斗',1,1,'13500000018','上海卢湾区','1986-12-31 00:00:00','test1@bdqn.cn','450323198612311251'),
(1017,'123456','可可',2,3,'13500000019','北京长安街1号','1981-09-10 00:00:00','test1@bdqn.cn','450323198109108311'),
(10066,'','Tom',1,1,'13500000000','','0000-00-00 00:00:00','email@22.com','33123123123123123');

-- 插入成绩数据
insert into `result`(`studentno`,`subjectno`,`examdate`,`studentresult`)
values
(1000,1,'2013-11-11 16:00:00',85),
(1000,2,'2012-11-10 10:00:00',75),
(1000,3,'2011-12-19 10:00:00',76),
(1000,4,'2010-11-18 11:00:00',93),
(1000,5,'2013-11-11 14:00:00',97),
(1000,6,'2012-09-13 15:00:00',87),
(1000,7,'2011-10-16 16:00:00',79),
(1000,8,'2010-11-11 16:00:00',74),
(1000,9,'2013-11-21 10:00:00',69),
(1000,10,'2012-11-11 12:00:00',78),
(1000,11,'2011-11-11 14:00:00',66),
(1000,12,'2010-11-11 15:00:00',82),
(1000,13,'2013-11-11 14:00:00',94),
(1000,14,'2012-11-11 15:00:00',98),
(1000,15,'2011-12-11 10:00:00',70),
(1000,16,'2010-09-11 10:00:00',74),
(1001,1,'2013-11-11 16:00:00',76),
(1001,2,'2012-11-10 10:00:00',93),
(1001,3,'2011-12-19 10:00:00',65),
(1001,4,'2010-11-18 11:00:00',71),
(1001,5,'2013-11-11 14:00:00',98),
(1001,6,'2012-09-13 15:00:00',74),
(1001,7,'2011-10-16 16:00:00',85),
(1001,8,'2010-11-11 16:00:00',69),
(1001,9,'2013-11-21 10:00:00',63),
(1001,10,'2012-11-11 12:00:00',70),
(1001,11,'2011-11-11 14:00:00',62),
(1001,12,'2010-11-11 15:00:00',90),
(1001,13,'2013-11-11 14:00:00',97),
(1001,14,'2012-11-11 15:00:00',89),
(1001,15,'2011-12-11 10:00:00',72),
(1001,16,'2010-09-11 10:00:00',90),
(1002,1,'2013-11-11 16:00:00',61),
(1002,2,'2012-11-10 10:00:00',80),
(1002,3,'2011-12-19 10:00:00',89),
(1002,4,'2010-11-18 11:00:00',88),
(1002,5,'2013-11-11 14:00:00',82),
(1002,6,'2012-09-13 15:00:00',91),
(1002,7,'2011-10-16 16:00:00',63),
(1002,8,'2010-11-11 16:00:00',84),
(1002,9,'2013-11-21 10:00:00',60),
(1002,10,'2012-11-11 12:00:00',71),
(1002,11,'2011-11-11 14:00:00',93),
(1002,12,'2010-11-11 15:00:00',96),
(1002,13,'2013-11-11 14:00:00',83),
(1002,14,'2012-11-11 15:00:00',69),
(1002,15,'2011-12-11 10:00:00',89),
(1002,16,'2010-09-11 10:00:00',83),
(1003,1,'2013-11-11 16:00:00',91),
(1003,2,'2012-11-10 10:00:00',75),
(1003,3,'2011-12-19 10:00:00',65),
(1003,4,'2010-11-18 11:00:00',63),
(1003,5,'2013-11-11 14:00:00',90),
(1003,6,'2012-09-13 15:00:00',96),
(1003,7,'2011-10-16 16:00:00',97),
(1003,8,'2010-11-11 16:00:00',77),
(1003,9,'2013-11-21 10:00:00',62),
(1003,10,'2012-11-11 12:00:00',81),
(1003,11,'2011-11-11 14:00:00',76),
(1003,12,'2010-11-11 15:00:00',61),
(1003,13,'2013-11-11 14:00:00',93),
(1003,14,'2012-11-11 15:00:00',79),
(1003,15,'2011-12-11 10:00:00',78),
(1003,16,'2010-09-11 10:00:00',96),
(1004,1,'2013-11-11 16:00:00',84),
(1004,2,'2012-11-10 10:00:00',79),
(1004,3,'2011-12-19 10:00:00',76),
(1004,4,'2010-11-18 11:00:00',78),
(1004,5,'2013-11-11 14:00:00',81),
(1004,6,'2012-09-13 15:00:00',90),
(1004,7,'2011-10-16 16:00:00',63),
(1004,8,'2010-11-11 16:00:00',89),
(1004,9,'2013-11-21 10:00:00',67),
(1004,10,'2012-11-11 12:00:00',100),
(1004,11,'2011-11-11 14:00:00',94),
(1004,12,'2010-11-11 15:00:00',65),
(1004,13,'2013-11-11 14:00:00',86),
(1004,14,'2012-11-11 15:00:00',77),
(1004,15,'2011-12-11 10:00:00',82),
(1004,16,'2010-09-11 10:00:00',87),
(1005,1,'2013-11-11 16:00:00',82),
(1005,2,'2012-11-10 10:00:00',92),
(1005,3,'2011-12-19 10:00:00',80),
(1005,4,'2010-11-18 11:00:00',92),
(1005,5,'2013-11-11 14:00:00',97),
(1005,6,'2012-09-13 15:00:00',72),
(1005,7,'2011-10-16 16:00:00',84),
(1005,8,'2010-11-11 16:00:00',79),
(1005,9,'2013-11-21 10:00:00',76),
(1005,10,'2012-11-11 12:00:00',87),
(1005,11,'2011-11-11 14:00:00',65),
(1005,12,'2010-11-11 15:00:00',67),
(1005,13,'2013-11-11 14:00:00',63),
(1005,14,'2012-11-11 15:00:00',64),
(1005,15,'2011-12-11 10:00:00',99),
(1005,16,'2010-09-11 10:00:00',97),
(1006,1,'2013-11-11 16:00:00',82),
(1006,2,'2012-11-10 10:00:00',73),
(1006,3,'2011-12-19 10:00:00',79),
(1006,4,'2010-11-18 11:00:00',63),
(1006,5,'2013-11-11 14:00:00',97),
(1006,6,'2012-09-13 15:00:00',83),
(1006,7,'2011-10-16 16:00:00',78),
(1006,8,'2010-11-11 16:00:00',88),
(1006,9,'2013-11-21 10:00:00',89),
(1006,10,'2012-11-11 12:00:00',82),
(1006,11,'2011-11-11 14:00:00',70),
(1006,12,'2010-11-11 15:00:00',69),
(1006,13,'2013-11-11 14:00:00',64),
(1006,14,'2012-11-11 15:00:00',80),
(1006,15,'2011-12-11 10:00:00',90),
(1006,16,'2010-09-11 10:00:00',85),
(1007,1,'2013-11-11 16:00:00',87),
(1007,2,'2012-11-10 10:00:00',63),
(1007,3,'2011-12-19 10:00:00',70),
(1007,4,'2010-11-18 11:00:00',74),
(1007,5,'2013-11-11 14:00:00',79),
(1007,6,'2012-09-13 15:00:00',83),
(1007,7,'2011-10-16 16:00:00',86),
(1007,8,'2010-11-11 16:00:00',76),
(1007,9,'2013-11-21 10:00:00',65),
(1007,10,'2012-11-11 12:00:00',87),
(1007,11,'2011-11-11 14:00:00',69),
(1007,12,'2010-11-11 15:00:00',69),
(1007,13,'2013-11-11 14:00:00',90),
(1007,14,'2012-11-11 15:00:00',84),
(1007,15,'2011-12-11 10:00:00',95),
(1007,16,'2010-09-11 10:00:00',92),
(1008,1,'2013-11-11 16:00:00',96),
(1008,2,'2012-11-10 10:00:00',62),
(1008,3,'2011-12-19 10:00:00',97),
(1008,4,'2010-11-18 11:00:00',84),
(1008,5,'2013-11-11 14:00:00',86),
(1008,6,'2012-09-13 15:00:00',72),
(1008,7,'2011-10-16 16:00:00',67),
(1008,8,'2010-11-11 16:00:00',83),
(1008,9,'2013-11-21 10:00:00',86),
(1008,10,'2012-11-11 12:00:00',60),
(1008,11,'2011-11-11 14:00:00',61),
(1008,12,'2010-11-11 15:00:00',68),
(1008,13,'2013-11-11 14:00:00',99),
(1008,14,'2012-11-11 15:00:00',77),
(1008,15,'2011-12-11 10:00:00',73),
(1008,16,'2010-09-11 10:00:00',78),
(1009,1,'2013-11-11 16:00:00',67),
(1009,2,'2012-11-10 10:00:00',70),
(1009,3,'2011-12-19 10:00:00',75),
(1009,4,'2010-11-18 11:00:00',92),
(1009,5,'2013-11-11 14:00:00',76),
(1009,6,'2012-09-13 15:00:00',90),
(1009,7,'2011-10-16 16:00:00',62),
(1009,8,'2010-11-11 16:00:00',68),
(1009,9,'2013-11-21 10:00:00',70),
(1009,10,'2012-11-11 12:00:00',83),
(1009,11,'2011-11-11 14:00:00',88),
(1009,12,'2010-11-11 15:00:00',65),
(1009,13,'2013-11-11 14:00:00',91),
(1009,14,'2012-11-11 15:00:00',99),
(1009,15,'2011-12-11 10:00:00',65),
(1009,16,'2010-09-11 10:00:00',83),
(1010,1,'2013-11-11 16:00:00',83),
(1010,2,'2012-11-10 10:00:00',87),
(1010,3,'2011-12-19 10:00:00',89),
(1010,4,'2010-11-18 11:00:00',99),
(1010,5,'2013-11-11 14:00:00',91),
(1010,6,'2012-09-13 15:00:00',96),
(1010,7,'2011-10-16 16:00:00',72),
(1010,8,'2010-11-11 16:00:00',72),
(1010,9,'2013-11-21 10:00:00',98),
(1010,10,'2012-11-11 12:00:00',73),
(1010,11,'2011-11-11 14:00:00',68),
(1010,12,'2010-11-11 15:00:00',62),
(1010,13,'2013-11-11 14:00:00',67),
(1010,14,'2012-11-11 15:00:00',69),
(1010,15,'2011-12-11 10:00:00',71),
(1010,16,'2010-09-11 10:00:00',66),
(1011,1,'2013-11-11 16:00:00',62),
(1011,2,'2012-11-10 10:00:00',72),
(1011,3,'2011-12-19 10:00:00',96),
(1011,4,'2010-11-18 11:00:00',64),
(1011,5,'2013-11-11 14:00:00',89),
(1011,6,'2012-09-13 15:00:00',91),
(1011,7,'2011-10-16 16:00:00',95),
(1011,8,'2010-11-11 16:00:00',96),
(1011,9,'2013-11-21 10:00:00',89),
(1011,10,'2012-11-11 12:00:00',73),
(1011,11,'2011-11-11 14:00:00',82),
(1011,12,'2010-11-11 15:00:00',98),
(1011,13,'2013-11-11 14:00:00',66),
(1011,14,'2012-11-11 15:00:00',69),
(1011,15,'2011-12-11 10:00:00',91),
(1011,16,'2010-09-11 10:00:00',69),
(1012,1,'2013-11-11 16:00:00',86),
(1012,2,'2012-11-10 10:00:00',66),
(1012,3,'2011-12-19 10:00:00',97),
(1012,4,'2010-11-18 11:00:00',69),
(1012,5,'2013-11-11 14:00:00',70),
(1012,6,'2012-09-13 15:00:00',74),
(1012,7,'2011-10-16 16:00:00',91),
(1012,8,'2010-11-11 16:00:00',97),
(1012,9,'2013-11-21 10:00:00',84),
(1012,10,'2012-11-11 12:00:00',82),
(1012,11,'2011-11-11 14:00:00',90),
(1012,12,'2010-11-11 15:00:00',91),
(1012,13,'2013-11-11 14:00:00',91),
(1012,14,'2012-11-11 15:00:00',97),
(1012,15,'2011-12-11 10:00:00',85),
(1012,16,'2010-09-11 10:00:00',90),
(1013,1,'2013-11-11 16:00:00',73),
(1013,2,'2012-11-10 10:00:00',69),
(1013,3,'2011-12-19 10:00:00',91),
(1013,4,'2010-11-18 11:00:00',72),
(1013,5,'2013-11-11 14:00:00',76),
(1013,6,'2012-09-13 15:00:00',87),
(1013,7,'2011-10-16 16:00:00',61),
(1013,8,'2010-11-11 16:00:00',77),
(1013,9,'2013-11-21 10:00:00',83),
(1013,10,'2012-11-11 12:00:00',99),
(1013,11,'2011-11-11 14:00:00',91),
(1013,12,'2010-11-11 15:00:00',84),
(1013,13,'2013-11-11 14:00:00',98),
(1013,14,'2012-11-11 15:00:00',74),
(1013,15,'2011-12-11 10:00:00',92),
(1013,16,'2010-09-11 10:00:00',90),
(1014,1,'2013-11-11 16:00:00',64),
(1014,2,'2012-11-10 10:00:00',81),
(1014,3,'2011-12-19 10:00:00',79),
(1014,4,'2010-11-18 11:00:00',74),
(1014,5,'2013-11-11 14:00:00',65),
(1014,6,'2012-09-13 15:00:00',88),
(1014,7,'2011-10-16 16:00:00',86),
(1014,8,'2010-11-11 16:00:00',77),
(1014,9,'2013-11-21 10:00:00',86),
(1014,10,'2012-11-11 12:00:00',85),
(1014,11,'2011-11-11 14:00:00',86),
(1014,12,'2010-11-11 15:00:00',75),
(1014,13,'2013-11-11 14:00:00',89),
(1014,14,'2012-11-11 15:00:00',79),
(1014,15,'2011-12-11 10:00:00',73),
(1014,16,'2010-09-11 10:00:00',68),
(1015,1,'2013-11-11 16:00:00',99),
(1015,2,'2012-11-10 10:00:00',60),
(1015,3,'2011-12-19 10:00:00',60),
(1015,4,'2010-11-18 11:00:00',75),
(1015,5,'2013-11-11 14:00:00',78),
(1015,6,'2012-09-13 15:00:00',78),
(1015,7,'2011-10-16 16:00:00',84),
(1015,8,'2010-11-11 16:00:00',95),
(1015,9,'2013-11-21 10:00:00',93),
(1015,10,'2012-11-11 12:00:00',79),
(1015,11,'2011-11-11 14:00:00',74),
(1015,12,'2010-11-11 15:00:00',65),
(1015,13,'2013-11-11 14:00:00',63),
(1015,14,'2012-11-11 15:00:00',74),
(1015,15,'2011-12-11 10:00:00',67),
(1015,16,'2010-09-11 10:00:00',65),
(1016,1,'2013-11-11 16:00:00',97),
(1016,2,'2012-11-10 10:00:00',90),
(1016,3,'2011-12-19 10:00:00',77),
(1016,4,'2010-11-18 11:00:00',75),
(1016,5,'2013-11-11 14:00:00',75),
(1016,6,'2012-09-13 15:00:00',97),
(1016,7,'2011-10-16 16:00:00',96),
(1016,8,'2010-11-11 16:00:00',92),
(1016,9,'2013-11-21 10:00:00',62),
(1016,10,'2012-11-11 12:00:00',83),
(1016,11,'2011-11-11 14:00:00',98),
(1016,12,'2010-11-11 15:00:00',94),
(1016,13,'2013-11-11 14:00:00',62),
(1016,14,'2012-11-11 15:00:00',97),
(1016,15,'2011-12-11 10:00:00',76),
(1016,16,'2010-09-11 10:00:00',82),
(1017,1,'2013-11-11 16:00:00',100),
(1017,2,'2012-11-10 10:00:00',88),
(1017,3,'2011-12-19 10:00:00',86),
(1017,4,'2010-11-18 11:00:00',73),
(1017,5,'2013-11-11 14:00:00',96),
(1017,6,'2012-09-13 15:00:00',64),
(1017,7,'2011-10-16 16:00:00',81),
(1017,8,'2010-11-11 16:00:00',66),
(1017,9,'2013-11-21 10:00:00',76),
(1017,10,'2012-11-11 12:00:00',95),
(1017,11,'2011-11-11 14:00:00',73),
(1017,12,'2010-11-11 15:00:00',82),
(1017,13,'2013-11-11 14:00:00',85),
(1017,14,'2012-11-11 15:00:00',68),
(1017,15,'2011-12-11 10:00:00',99),
(1017,16,'2010-09-11 10:00:00',76);

-- 插入年级数据
insert into `grade` (`gradeid`,`gradename`) 
values(1,'大一'),(2,'大二'),(3,'大三'),
(4,'大四'),(5,'预科班');

-- 插入科目数据
insert into `subject`(`subjectno`,`subjectname`,`classhour`,`gradeid`)values
(1,'高等数学-1',110,1),
(2,'高等数学-2',110,2),
(3,'高等数学-3',100,3),
(4,'高等数学-4',130,4),
(5,'C语言-1',110,1),
(6,'C语言-2',110,2),
(7,'C语言-3',100,3),
(8,'C语言-4',130,4),
(9,'JAVA第一学年',110,1),
(10,'JAVA第二学年',110,2),
(11,'JAVA第三学年',100,3),
(12,'JAVA第四学年',130,4),
(13,'数据库结构-1',110,1),
(14,'数据库结构-2',110,2),
(15,'数据库结构-3',100,3),
(16,'数据库结构-4',130,4),
(17,'C#基础',130,1);
```

## 指定查询字段

### 查询所有

```mysql
-- 查询表中所有的数据列结果 , 采用 **" \* "** 符号; 但是效率低，不推荐 .

-- 查询所有学生信息
SELECT * FROM student;

-- 查询指定列(学号 , 姓名)
SELECT studentno,studentname FROM student;
```

### AS 子句作为别名

作用：

- 可给数据列取一个新别名；
- 可给表取一个新别名；
- 可把经计算或总结的结果用另一个新名称来代替；

```mysql
-- 这里是为列取别名(当然as关键词可以省略)
SELECT studentno AS 学号,studentname AS 姓名 FROM student;

-- 使用as也可以为表取别名
SELECT studentno AS 学号,studentname AS 姓名 FROM student AS s;

-- 使用as,为查询结果取一个新名字
-- CONCAT()函数拼接字符串
SELECT CONCAT('姓名:',studentname) AS 新姓名 FROM student;
```

### DISTINCT关键字的使用

- 作用 : 去掉SELECT查询返回的记录结果中重复的数据 ( 返回所有列的值都相同 ) , 只返回一条。

```mysql
-- 查看哪些同学参加了考试(学号) 去除重复项
SELECT * FROM result; -- 查看考试成绩
SELECT studentno FROM result; -- 查看哪些同学参加了考试
SELECT DISTINCT studentno FROM result; -- 了解:DISTINCT 去除重复项 , (默认是ALL)
```

### 数据库的列——(表达式)

- 数据库中的表达式 : 一般由`文本值` , `列值` , `NULL` , `函数`和`操作符`等组成。

应用场景 :

- SELECT语句返回结果列中使用；
- SELECT语句中的`ORDER BY` , `HAVING`等子句中使用；
- DML语句中的 `where` 条件语句中使用表达式。

```mysql
-- selcet查询中可以使用表达式
SELECT VERSION(); -- 查询版本号
SELECT 100*3-1 AS 计算结果; -- 表达式
SELECT @@auto_increment_increment; -- 查询自增步长

-- 学员考试成绩集体提分一分查看
SELECT studentno,StudentResult+1 AS '提分后' FROM result;
```

- - 避免SQL返回结果中包含 ’`.`’ , ’ `*` ’ 和括号等干扰开发语言程序。

## where条件语句

- 作用：用于检索数据表中 `符合条件` 的记录。
- 搜索条件可由一个或多个逻辑表达式组成 , 结果一般为真或假。

> 逻辑运算符：`尽量使用英文符号`。

| 操作符名称    | 语法               | 描述               |   |                  |
| -------- | ---------------- | ---------------- | - | ---------------- |
| AND 或 && | a AND b 或 a && b | 逻辑与，同时为真结果才为真    |   |                  |
| OR 或     |                  | a OR b 或 a       | b | 逻辑或，只要一个为真，则结果为真 |
| NOT 或 !  | NOT a 或 !a       | 逻辑非，若操作数为假，则结果为真 |   |                  |

**测试**

```mysql
-- =============where===============
SELECT studentno,studentResult FROM result;

-- 查询考试成绩在95-100之间的
SELECT studentno,studentresult
FROM result
WHERE studentresult>=95 AND studentresult<=100;

-- AND也可以写成 &&
SELECT studentno,studentresult
FROM result 
WHERE studentresult>=95 AND studentresult<=100;

-- 模糊查询(对应的词:精确查询)
SELECT studentno,studentresult
FROM result WHERE studentresult BETWEEN 95 AND 100;

-- 除了1000号同学,要其他同学的成绩
SELECT studentno,studentresult
FROM result WHERE studentno!=1000;

-- 使用NOT
SELECT studentno,studentresult
FROM result WHERE NOT studentno=1000;
```

### 模糊查询 ：比较运算符

| 操作符名称       | 语法                | 描述                       |
| ----------- | ----------------- | ------------------------ |
| IS NULL     | a IS NULL         | 若操作符为NULL，则结果为真          |
| IS NOT NULL | a IS NOT NULL     | 若操作符不为NULL，则结果为真         |
| BETWEEN     | a BETWEEN b AND c | 若a范围在b与c之间，则结果为真         |
| LIKE        | a LIKE b          | SQL模式匹配，若a匹配b，则结果为真      |
| IN          | a IN              | 若 a 等于 a1，a2…中的某一个，则结果为真 |

- **注意：**
  - 数值数据类型的记录之间才能进行算术运算 ;
  - 相同数据类型的数据之间才能进行比较 ;

- **测试：**

```mysql
-- ===================LIKE==========================
-- 查询姓刘的同学的学号及姓名
-- like结合使用的通配符 : % (代表0到任意个字符) _ (一个字符)
SELECT studentno,studentname FROM student
WHERE studentname LIKE '刘%';

-- 查询姓刘的同学,后面只有一个字的
SELECT studentno,studentname FROM student
WHERE studentname LIKE '刘_';

-- 查询姓刘的同学,后面只有两个字的
SELECT studentno,studentname FROM student
WHERE studentname LIKE '刘__';

-- 查询姓名中含有 梅 字的
SELECT studentno,studentname FROM student
WHERE studentname LIKE '%梅%';

-- 查询姓名中含有特殊字符的需要使用转义符号 '\'
-- 自定义转义符关键字: ESCAPE ':'

-- =====================IN========================
-- 查询学号为1000,1001,1002的学生姓名
SELECT studentno,studentname FROM student
WHERE studentno IN (1000,1001,1002);

-- 查询地址在北京,南京,河南洛阳的学生
SELECT studentno,studentname,address FROM student
WHERE address IN ('北京','南京','河南洛阳');

-- ====================NULL 空=========================
-- 查询出生日期没有填写的同学
-- 不能直接写=NULL , 这是代表错误的 , 用 is null
SELECT studentname FROM student
WHERE BornDate IS NULL;

-- 查询出生日期填写的同学
SELECT studentname FROM student
WHERE BornDate IS NOT NULL;

-- 查询没有写家庭住址的同学(空字符串不等于null)
SELECT studentname FROM student
WHERE Address='' OR Address IS NULL;
```

## 联表查询

| 操作符名称      | 描述                    |
| ---------- | --------------------- |
| INNER JOIN | 如果表中有至少一个匹配，则返回行      |
| LEFT JOIN  | 即使右表中没有匹配，也从左表中返回所有的行 |
| RIGHT JOIN | 即使左表中没有匹配，也从右表中返回所有的行 |

- 七种 join

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409211112795.png)

- 连接查询
  - 如需要多张数据表的数据进行查询,则可通过连接运算符实现多个查询。
- 内连接 `inner join`
  - 查询两个表中的结果集中的交集。
- 外连接 `outer join`
  - 左外连接 left join——(以左表作为基准,右边表来一一匹配,匹配不上的,返回左表的记录,右表以NULL填充)。
  - 右外连接 right join——(以右表作为基准,左边表来一一匹配,匹配不上的,返回右表的记录,左表以NULL填充)。
- 等值连接和非等值连接。
- 自连接

[SQL Joins (Inner, Left, Right and Full Join)](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)

**测试：**

```mysql
-- 查询参加了考试的同学信息(学号,学生姓名,科目编号,分数)
SELECT * FROM student;
SELECT * FROM result;

/*思路:
(1):分析需求,确定查询的列来源于两个类,student result,连接查询
(2):确定使用哪种连接查询?(内连接)
*/
SELECT s.studentno,studentname,subjectno,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno;

-- 右连接(也可实现)
SELECT s.studentno,studentname,subjectno,StudentResult
FROM student s
RIGHT JOIN result r
ON r.studentno = s.studentno;

-- 等值连接
SELECT s.studentno,studentname,subjectno,StudentResult
FROM student s , result r
WHERE r.studentno = s.studentno;

-- 左连接 (查询了所有同学,不考试的也会查出来)
SELECT s.studentno,studentname,subjectno,StudentResult
FROM student s
LEFT JOIN result r
ON r.studentno = s.studentno;

-- 查询缺考的同学(左连接应用场景)
SELECT s.studentno,studentname,subjectno,StudentResult
FROM student s
LEFT JOIN result r
ON r.studentno = s.studentno
WHERE StudentResult IS NULL;

-- 思考题:查询参加了考试的同学信息(学号,学生姓名,科目名,分数)
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON sub.subjectno = r.subjectno;
```

- **自己的表与自己的表连接，核心：`一张表拆成两张一样的表`。**

```mysql
/*
需求:从一个包含栏目ID , 栏目名称和父栏目ID的表中
    查询父栏目名称和其他子栏目名称
*/

-- 创建一个表
CREATE TABLE `category` (
`categoryid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主题id',
`pid` INT(10) NOT NULL COMMENT '父id',
`categoryName` VARCHAR(50) NOT NULL COMMENT '主题名字',
PRIMARY KEY (`categoryid`)
) ENGINE=INNODB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- 插入数据
INSERT INTO `category` (`categoryid`, `pid`, `categoryName`)
VALUES('2','1','信息技术'),
('3','1','软件开发'),
('4','3','数据库'),
('5','1','美术设计'),
('6','3','web开发'),
('7','5','ps技术'),
('8','2','办公信息');

-- 编写SQL语句,将栏目的父子关系呈现出来 (父栏目名称,子栏目名称)
-- 核心思想:把一张表看成两张一模一样的表,然后将这两张表连接查询(自连接)
SELECT a.`categoryName` AS '父栏目',b.`categoryName` AS '子栏目'
FROM `category` AS a,`category` AS b
WHERE a.`categoryid` = b.`pid`;

-- 思考题:查询参加了考试的同学信息(学号,学生姓名,科目名,分数)
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON sub.subjectno = r.subjectno;

-- 查询学员及所属的年级(学号,学生姓名,年级名)
SELECT studentno AS 学号,studentname AS 学生姓名,gradename AS 年级名称
FROM student s
INNER JOIN grade g
ON s.`GradeId` = g.`GradeID`;

-- 查询科目及所属的年级(科目名称,年级名称)
SELECT subjectname AS 科目名称,gradename AS 年级名称
FROM SUBJECT sub
INNER JOIN grade g
ON sub.gradeid = g.gradeid;

-- 查询 数据库结构-1 的所有考试结果(学号 学生姓名 科目名称 成绩)
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON r.subjectno = sub.subjectno
WHERE subjectname='数据库结构-1';
```

## 分页和排序

### 排序——order by

- 语法 : `ORDER BY`
  - ORDER BY 语句用于根据指定的列对结果集进行排序。
  - ORDER BY 语句==默认按照ASC升序对记录进行排序==。
  - 如果希望按照==降序==对记录进行排序，可以使用 `DESC` 关键字。

**示例：**

```mysql
-- 查询 数据库结构-1 的所有考试结果(学号 学生姓名 科目名称 成绩)
-- 按成绩降序排序
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON r.subjectno = sub.subjectno
WHERE subjectname='数据库结构-1'
ORDER BY StudentResult DESC;

-- 如果成绩一样，按其他规则排列，比如学号的升序与降序。
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON r.subjectno = sub.subjectno
WHERE subjectname='数据库结构-1'
ORDER BY StudentResult DESC, studentno DESC;
```

**注意**：

```mysql
ORDER BY StudentResult, studentno DESC;
-- 此处的正确理解是：成绩升序排列、学号降序排列。因为DESC是修饰studentno的，而StudentResult 是默认的。
```

### 分页——limit

- 语法 : `SELECT * FROM table LIMIT [offset,] rows | rows OFFSET offset`;
- 好处 : (用户体验,网络传输,查询压力)。

**示例：**

```mysql
/*
推导:
   第一页 : limit 0,5  (1-1)*5
   第二页 : limit 5,5  (2-1)*5
   第三页 : limit 10,5  (3-1)*5
   ......
   第N页 : limit (n-1)*pageSzie,pageSzie
   [n:当前页码,pageSize:单页面显示条数]
*/

-- 需求：查询 数据库结构-1 的所有考试结果（学号 学生 科目名称 成绩),成绩
-- 每页显示5条数据
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON r.subjectno = sub.subjectno
WHERE subjectname='数据库结构-1'
ORDER BY StudentResult DESC , studentno
LIMIT 0,5;

-- 查询 JAVA第一学年 课程成绩前10名并且分数大于80的学生信息(学号,姓名,课程名,分数)
SELECT s.studentno,studentname,subjectname,StudentResult
FROM student s
INNER JOIN result r
ON r.studentno = s.studentno
INNER JOIN `subject` sub
ON r.subjectno = sub.subjectno
WHERE studentresult>80 AND subjectname='JAVA第一学年'
ORDER BY StudentResult DESC
LIMIT 0,10;
```

## 子查询

**什么是子查询?**

- 在查询语句中的WHERE条件子句中,又嵌套了另一个查询语句;
- 嵌套查询可由多个子查询组成,求解的方式是由里及外;
- 子查询返回的结果一般都是集合,故而建议使用IN关键字;

**示例：**

```mysql
-- 查询 数据库结构-1 的所有考试结果(学号,科目编号,成绩),并且成绩降序排列
-- 方法一:使用连接查询
SELECT studentno,r.subjectno,StudentResult
FROM result r
INNER JOIN `subject` sub
ON r.`SubjectNo`=sub.`SubjectNo`
WHERE subjectname = '数据库结构-1'
ORDER BY studentresult DESC;

-- 方法二:使用子查询(执行顺序:由里及外)
SELECT studentno,subjectno,StudentResult
FROM result
WHERE subjectno=(
   SELECT subjectno FROM `subject`
   WHERE subjectname = '数据库结构-1'
)
ORDER BY studentresult DESC;

-- 查询课程为 高等数学-2 且分数不小于80分的学生的学号和姓名
-- 方法一:使用连接查询
SELECT s.studentno,studentname
FROM student s
INNER JOIN result r
ON s.`StudentNo` = r.`StudentNo`
INNER JOIN `subject` sub
ON sub.`SubjectNo` = r.`SubjectNo`
WHERE subjectname = '高等数学-2' AND StudentResult>=80;

-- 方法二:使用连接查询+子查询
-- 分数不小于80分的学生的学号和姓名
SELECT r.studentno,studentname FROM student s
INNER JOIN result r ON s.`StudentNo`=r.`StudentNo`
WHERE StudentResult>=80;

-- 在上面SQL基础上,添加需求:课程为 高等数学-2
SELECT r.studentno,studentname FROM student s
INNER JOIN result r ON s.`StudentNo`=r.`StudentNo`
WHERE StudentResult>=80 AND subjectno=(
   SELECT subjectno FROM `subject`
   WHERE subjectname = '高等数学-2'
);

-- 方法三:使用子查询
-- 分步写简单sql语句,然后将其嵌套起来
SELECT studentno,studentname FROM student WHERE studentno IN(
   SELECT studentno FROM result WHERE StudentResult>=80 AND subjectno=(
       SELECT subjectno FROM `subject` WHERE subjectname = '高等数学-2'
  )
);
```

**练习：**

```mysql
/*
题目:
   查 C语言-1 的前5名学生的成绩信息(学号,姓名,分数)
   使用子查询,查询郭靖同学所在的年级名称
*/

-- 需求：查询C语言-1的前5名学生的成绩信息：学号、姓名、分数
-- 方式一：连接查询
SELECT s.studentno,studentname,studentresult
FROM student AS s
INNER JOIN result AS r
ON s.StudentNo=r.StudentNo
INNER JOIN `subject` AS su
ON r.SubjectNo=su.subjectno
WHERE subjectname='C语言-1'
ORDER BY studentresult DESC
LIMIT 0,5;

-- 方式二：连接查询和子查询并用
SELECT s.studentno,studentname,studentresult
FROM student AS s
INNER JOIN result AS r
ON s.StudentNo=r.StudentNo
WHERE subjectno=
(SELECT subjectno FROM `subject` WHERE subjectname='C语言-1')
ORDER BY studentresult DESC
LIMIT 0,5;

-- 使用子查询：查询郭靖同学所在的年级名称
SELECT gradename FROM grade 
WHERE gradeid=
(SELECT gradeid FROM student WHERE studentname='郭靖');
```

## 分组和过滤

```mysql
 -- 查询不同课程的平均分,最高分,最低分
 -- 前提:根据不同的课程进行分组
 
 SELECT subjectname,AVG(studentresult) AS 平均分,MAX(StudentResult) AS 最高分,MIN(StudentResult) AS 最低分
 FROM result AS r
 INNER JOIN `subject` AS s
 ON r.subjectno = s.subjectno
 GROUP BY r.subjectno
 HAVING 平均分>80;
 
 /*
 where写在group by前面.
 要是放在分组后面的筛选
 要使用HAVING..
 因为having是从前面筛选的字段再筛选，而where是从数据表中的>字段直接进行的筛选的
 */
```
