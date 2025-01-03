---
date created: 2024-09-22 10:31
date updated: 2024-11-22 08:48
---

# MySQL 函数

MySQL 中的函数跟 Python 中的函数没有太多的差异，因为函数都是用来封装功能上相对独立且会被重复使用的代码的。如果非要找出一些差别来，那么 MySQL 中的函数是可以执行 SQL 语句的。

示例：我们通过自定义函数实现了截断超长字符串的功能。

```mysql
delimiter $$

create function truncate_string(
    content varchar(10000),
    max_length int unsigned
) returns varchar(10000) no sql
begin
    declare result varchar(10000) default content;
    if char_length(content) > max_length then
        set result = left(content, max_length);
        set result = concat(result, '……');
    end if;
    return result;
end $$

delimiter ;
```

- 函数声明后面的 `no sql` 是声明函数体并没有使用 SQL 语句；如果函数体中需要通过 SQL 读取数据，需要声明为 `reads sql data`。
- 定义函数前后的 `delimiter` 命令是为了修改定界符，因为函数体中的语句都是用 `;` 表示结束，如果不重新定义定界符，那么遇到的 `;` 的时候代码就会被截断执行，显然这不是我们想要的效果。

示例：在查询中调用自定义函数。

```mysql
select truncate_string('和我在成都的街头走一走，直到所有的灯都熄灭了也不停留', 10) as short_string;
```

>

+--------------------------------------+
| short_string                         |
+--------------------------------------+
| 和我在成都的街头走一……                 |
+--------------------------------------+

## 常用函数

### 数据函数

```mysql
SELECT ABS(-8);	-- 绝对值函数
SELECT CEILING(9.4); -- 向上取整/
SELECT FLOOR(9.4);   -- 向下取整
SELECT RAND();  -- 随机数,返回一个0-1之间的随机数
SELECT SIGN(0); -- 符号函数: 负数返回-1,正数返回1,0返回0
```

### 字符串函数

```mysql
SELECT CHAR_LENGTH('Java坚持就能成功'); -- 返回字符串包含的字符数
SELECT CONCAT('我','改','程序');  -- 合并字符串,参数可以有多个
SELECT INSERT('我在编程hello world',1,2,'为了咸鱼');  -- 替换字符串,从某个位置开始替换某个长度
SELECT LOWER('subeiLY'); -- 小写
SELECT UPPER('unremittingly'); -- 大写
SELECT LEFT('hello,world',5);   -- 从左边截取
SELECT RIGHT('hello,world',5);  -- 从右边截取
SELECT REPLACE('Java坚持就能成功','咸鱼','努力');  -- 替换字符串
SELECT SUBSTR('Java坚持就能成功',4,6); -- 截取字符串,开始和长度
SELECT REVERSE('Java坚持就能成功'); -- 反转
 
-- 查询姓郭的同学,改成邹
SELECT REPLACE(studentname,'郭','邹') AS 新名字
FROM student WHERE studentname LIKE '郭%';
```

### 日期和时间函数

```mysql
 SELECT CURRENT_DATE();   -- 获取当前日期
 SELECT CURDATE();   -- 获取当前日期
 SELECT NOW();   -- 获取当前日期和时间
 SELECT LOCALTIME();   -- 获取当前日期和时间
 SELECT SYSDATE();   -- 获取当前日期和时间
 
 -- 获取年月日,时分秒
 SELECT YEAR(NOW());
 SELECT MONTH(NOW());
 SELECT DAY(NOW());
 SELECT HOUR(NOW());
 SELECT MINUTE(NOW());
 SELECT SECOND(NOW());
```

### 系统信息函数

```mysql
 SELECT VERSION();  -- 版本
 SELECT USER();     -- 用户 
```

## 聚合函数

| **函数名称** | **描述**                                                   |
| -------- | -------------------------------------------------------- |
| COUNT () | 返回满足 Select 条件的记录总和数，如 `select count(*)` 【不建议使用 `*`，效率低】 |
| SUM ()   | 返回数字字段或表达式列作统计，返回一列的总和。                                  |
| AVG ()   | 通常为数值字段或表达列作统计，返回一列的平均值                                  |
| MAX ()   | 可以为数值字段，字符字段或表达式列作统计，返回最大的值。                             |
| MIN ()   | 可以为数值字段，字符字段或表达式列作统计，返回最小的值。                             |

- 从含义上讲，`count(1)` 与 `  count(*) ` 都表示对全部数据行的查询。
  - `count(字段)` 会统计该字段在表中出现的次数，忽略字段为 null 的情况。即不统计字段为 null 的记录。
  - `count(*)` 包括了所有的列，相当于行数，在统计结果的时候，包含字段为 null 的记录；
  - ` count(1)  ` 用 1 代表代码行，在统计结果的时候，包含字段为 null 的记录。

> 很多人认为 `count(1)` 执行的效率会比 `count(*)` 高，原因是 `count(*)` 会存在全表扫描，而 `count(1)` 可以针对一个字段进行查询。其实不然，`count(1)` 和 `count(*)` 都会对全表进行扫描，统计所有记录的条数，包括那些为 null 的记录，因此，它们的效率可以说是相差无几。而 `count(字段)` 则与前两者不同，它会统计该字段不为 null 的记录条数。

- 两者之间的对比：
  - 1）在表没有主键时，`count(1)` 比 `count(*)` 快；
  - 2）有主键时，主键作为计算条件，`count(主键)` 效率最高；
  - 3）若表格只有一个字段，则 `count(*)` 效率较高。

**示例：**

```mysql
 -- 聚合函数
 -- COUNT:非空的
 SELECT COUNT(studentname) FROM student; -- count(指定列
 SELECT COUNT(*) FROM student;  -- count(*)
 SELECT COUNT(1) FROM student;  -- count(1) 推荐
 
 SELECT SUM(StudentResult) AS 总和 FROM result;
 SELECT AVG(StudentResult) AS 平均分 FROM result;
 SELECT MAX(StudentResult) AS 最高分 FROM result;
 SELECT MIN(StudentResult) AS 最低分 FROM result;
```

## 数据库级别的 MD 5 加密

```mysql
-- 准备
CREATE TABLE `testmd5` (
`id` INT(4) NOT NULL,
`name` VARCHAR(20) NOT NULL,
`pwd` VARCHAR(50) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO testmd5 VALUES(1,'subei','123456'),(2,'wahaha','456789');

-- 如果我们要对pwd这一列数据进行加密，语法是：
update testmd5 set pwd = md5(pwd);

-- 如果单独对某个用户(如wahaha)的密码加密：
INSERT INTO testmd5 VALUES(3,'admin','123456');
UPDATE testmd5 SET pwd = MD5(pwd) WHERE NAME='admin';

-- 插入新的数据自动加密
INSERT INTO testmd5 VALUES(4,'party',md5('123456'));

-- 查询登录用户信息（md5对比使用，查看用户输入加密后的密码进行比对）
SELECT * FROM testmd5 WHERE `name`='subei' AND pwd=MD5('123456');
```
