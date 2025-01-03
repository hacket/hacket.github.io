---
date created: 2024-09-22 10:32
date updated: 2024-11-22 08:48
tags:
  - '#方法一：创建表时'
  - '#方法二：CREATE在已存在的表上创建索引'
  - '#方法三：ALTER'
  - '#删除索引：DROP'
  - '#删除主键索引:'
---

# 索引

## 索引介绍

索引是关系型数据库中用来提升查询性能最为重要的手段。

> 关系型数据库中的索引就像一本书的目录，我们可以想象一下，如果要从一本书中找出某个知识点，但是这本书没有目录，这将是意见多么可怕的事情！我们估计得一篇一篇的翻下去，才能确定这个知识点到底在什么位置。创建索引虽然会带来存储空间上的开销，就像一本书的目录会占用一部分篇幅一样，但是在牺牲空间后换来的查询时间的减少也是非常显著的。

MySQL 数据库中所有数据类型的列都可以被索引。对于 MySQL 8.0 版本的 InnoDB 存储引擎来说，它支持三种类型的索引，分别是 B+ 树索引、全文索引和 R 树索引。这里，我们只介绍使用得最为广泛的 B+ 树索引。使用 B+ 树的原因非常简单，因为它是目前在基于磁盘进行海量数据存储和排序上最有效率的数据结构。B+ 树是一棵[平衡树](https://zh.wikipedia.org/zh-cn/%E5%B9%B3%E8%A1%A1%E6%A0%91)，树的高度通常为 3 或 4，但是却可以保存从百万级到十亿级的数据，而从这些数据里面查询一条数据，只需要 3 次或 4 次 I/O 操作。

B+ 树由根节点、中间节点和叶子节点构成，其中叶子节点用来保存排序后的数据。由于记录在索引上是排序过的，因此在一个叶子节点内查找数据时可以使用二分查找，这种查找方式效率非常的高。当数据很少的时候，B+ 树只有一个根节点，数据也就保存在根节点上。随着记录越来越多，B+ 树会发生分裂，根节点不再保存数据，而是提供了访问下一层节点的指针，帮助快速确定数据在哪个叶子节点上。

在创建二维表时，我们通常都会为表指定主键列，主键列上默认会创建索引，而对于 MySQL InnoDB 存储引擎来说，因为它使用的是索引组织表这种数据存储结构，所以主键上的索引就是整张表的数据，而这种索引我们也将其称之为**聚集索引**（clustered index）。很显然，一张表只能有一个聚集索引，否则表的数据岂不是要保存多次。我们自己创建的索引都是二级索引（secondary index），更常见的叫法是**非聚集索引**（non-clustered index）。通过我们自定义的非聚集索引只能定位记录的主键，在获取数据时可能需要再通过主键上的聚集索引进行查询，这种现象称为“回表”，因此通过非聚集索引检索数据通常比使用聚集索引检索数据要慢。

## 索引的作用

- 提高查询速度；
- 确保数据的唯一性；
- 可以加速表和表之间的连接 , 实现表与表之间的参照完整性；
- 使用分组和排序子句进行数据检索时 , 可以显著减少分组和排序的时间；
- 全文检索字段进行搜索优化。

## 索引的分类

- 主键索引 (Primary Key)
  - 唯一的标识，主键不可重复，只能有一个列作为主键。

- 唯一索引 (`Unique`)
  - 避免重复的列出现，唯一索引可以重复，多个列都可以标识唯一索引。

- 常规索引 (Index)
  - 默认的，key关键字来设置。

- 全文索引 (`FullText`)
  - 在特定引擎下才可以实现，MyISAM。
    - MySQL 5.6 以前的版本，只有 MyISAM 存储引擎支持全文索引；
    - MySQL 5.6 及以后的版本，MyISAM 和 InnoDB 存储引擎均支持全文索引;
    - 只有字段的数据类型为 char、varchar、text 及其系列才可以建全文索引。
    - 测试或使用全文索引时，要先看一下自己的 MySQL 版本、存储引擎和数据类型是否支持全文索引。
  - 快速定位数据。

**索引创建语法：**

```mysql
#方法一：创建表时
CREATE TABLE 表名 (
   字段名1 数据类型 [完整性约束条件…],
   字段名2 数据类型 [完整性约束条件…],
   [UNIQUE | FULLTEXT | SPATIAL ]   INDEX | KEY
   [索引名] (字段名[(长度)] [ASC |DESC])
);

#方法二：CREATE在已存在的表上创建索引
CREATE [UNIQUE | FULLTEXT | SPATIAL ] INDEX 索引名
	ON 表名 (字段名[(长度)] [ASC |DESC]) ;

#方法三：ALTER TABLE在已存在的表上创建索引
ALTER TABLE 表名 ADD [UNIQUE | FULLTEXT | SPATIAL ] INDEX
	索引名 (字段名[(长度)] [ASC |DESC]) ;
                           
                           
#删除索引：DROP INDEX 索引名 ON 表名字;
#删除主键索引: ALTER TABLE 表名 DROP PRIMARY KEY;
alter table tb_student drop index idx_student_name;
# 或者
drop index idx_student_name on tb_student;
```

**索引使用：**

```mysql
-- 索引的使用
-- 1.在创建表时给字段增加索引
-- 2.创建完毕后，增加索引

-- 显示所有的索引信息
SHOW INDEX FROM student;

-- 增加全文索引
ALTER TABLE `school`.`student` ADD FULLTEXT INDEX `studentname` (`studentname`);

-- EXPLAIN : 分析SQL语句执行性能
EXPLAIN SELECT * FROM student;  -- 非全文索引

EXPLAIN SELECT * FROM student WHERE MATCH(`studentname`) AGAINST('张');
```

### Create 索引

接下来我们通过一个简单的例子来说明索引的意义，比如我们要根据学生的姓名来查找学生，这个场景在实际开发中应该经常遇到，就跟通过商品名称查找商品是一个道理。我们可以使用 MySQL 的 `explain` 关键字来查看 SQL 的执行计划（数据库执行 SQL 语句的具体步骤）。

```mysql
explain select * from tb_student where stu_name='林震南'\G
```

> ```
>      id: 1
> ```

Select_type: SIMPLE
Table: tb_student
Partitions: NULL
Type: ALL
Possible_keys: NULL
Key: NULL
Key_len: NULL
Ref: NULL
Rows: 10
Filtered: 10.00
Extra: Using where
1 row in set, 1 warning (0.00 sec)

在上面的 SQL 执行计划中，有几项值得我们关注：

1. `select_type`：查询的类型。
   - `SIMPLE`：简单 SELECT，不需要使用 UNION 操作或子查询。
   - `PRIMARY`：如果查询包含子查询，最外层的 SELECT 被标记为 PRIMARY。
   - `UNION`：UNION 操作中第二个或后面的 SELECT 语句。
   - `SUBQUERY`：子查询中的第一个 SELECT。
   - `DERIVED`：派生表的 SELECT 子查询。
2. `table`：查询对应的表。
3. `type`：MySQL 在表中找到满足条件的行的方式，也称为访问类型，包括：`ALL`（全表扫描）、`index`（索引全扫描，只遍历索引树）、`range`（索引范围扫描）、`ref`（非唯一索引扫描）、`eq_ref`（唯一索引扫描）、`const` / `system`（常量级查询）、`NULL`（不需要访问表或索引）。在所有的访问类型中，很显然 ALL 是性能最差的，它代表的全表扫描是指要扫描表中的每一行才能找到匹配的行。
4. `possible_keys`：MySQL 可以选择的索引，但是**有可能不会使用**。
5. `key`：MySQL 真正使用的索引，如果为 `NULL` 就表示没有使用索引。
6. `key_len`：使用的索引的长度，在不影响查询的情况下肯定是长度越短越好。
7. `rows`：执行查询需要扫描的行数，这是一个**预估值**。
8. `extra`：关于查询额外的信息。
   - `Using filesort`：MySQL 无法利用索引完成排序操作。
   - `Using index`：只使用索引的信息而不需要进一步查表来获取更多的信息。
   - `Using temporary`：MySQL 需要使用临时表来存储结果集，常用于分组和排序。
   - `Impossible where`：`where` 子句会导致没有符合条件的行。
   - `Distinct`：MySQL 发现第一个匹配行后，停止为当前的行组合搜索更多的行。
   - `Using where`：查询的列未被索引覆盖，筛选条件并不是索引的前导列。

从上面的执行计划可以看出，当我们通过学生名字查询学生时实际上是进行了全表扫描，不言而喻这个查询性能肯定是非常糟糕的，尤其是在表中的行很多的时候。如果我们需要经常通过学生姓名来查询学生，那么就应该在学生姓名对应的列上创建索引，通过索引来加速查询。

```mysql
create index idx_student_name on tb_student(stu_name);
```

再次查看刚才的 SQL 对应的执行计划。

```mysql
explain select * from tb_student where stu_name='林震南'\G
```

> ```
>    id: 1
> ```

Select_type: SIMPLE
Table: tb_student
Partitions: NULL
Type: ref
Possible_keys: idx_student_name
Key: idx_student_name
Key_len: 82
Ref: const
Rows: 1
Filtered: 100.00
Extra: NULL
1 row in set, 1 warning (0.00 sec)

可以注意到，在对学生姓名创建索引后，刚才的查询已经不是全表扫描而是基于索引的查询，而且扫描的行只有唯一的一行，这显然大大的提升了查询的性能。

MySQL 中还允许创建前缀索引，即对索引字段的前 N 个字符创建索引，这样的话可以减少索引占用的空间（但节省了空间很有可能会浪费时间，**时间和空间是不可调和的矛盾**），如下所示：

```mysql
create index idx_student_name_1 on tb_student(stu_name(1));
```

上面的索引相当于是根据学生姓名的第一个字来创建的索引，我们再看看 SQL 执行计划。

```mysql
explain select * from tb_student where stu_name='林震南'\G
```

在创建索引时，我们还可以使用复合索引、函数索引（MySQL 5.7 开始支持），用好复合索引实现**索引覆盖**可以减少不必要的排序和回表操作，这样就会让查询的性能成倍的提升，有兴趣的读者可以自行研究。

我们简单的为大家总结一下索引的设计原则：

1. **最适合**索引的列是出现在**WHERE 子句**和连接子句中的列。
2. 索引列的基数越大（取值多、重复值少），索引的效果就越好。
3. 使用**前缀索引**可以减少索引占用的空间，内存中可以缓存更多的索引。
4. **索引不是越多越好**，虽然索引加速了读操作（查询），但是写操作（增、删、改）都会变得更慢，因为数据的变化会导致索引的更新，就如同书籍章节的增删需要更新目录一样。
5. 使用 InnoDB 存储引擎时，表的普通索引都会保存主键的值，所以**主键要尽可能选择较短的数据类型**，这样可以有效的减少索引占用的空间，提升索引的缓存效果。

最后，还有一点需要说明，InnoDB 使用的 `B-tree` 索引，数值类型的列除了等值判断时索引会生效之外，使用 `>`、`<`、`>=`、`<=`、`BETWEEN...AND...` 、`<>` 时，索引仍然生效；对于字符串类型的列，如果使用不以通配符开头的模糊查询，索引也是起作用的，但是其他的情况会导致索引失效，这就意味着很有可能会做全表查询。

## 索引测试

- 测试索引准备

```mysql
-- 建表app_user：
CREATE TABLE `app_user` (
`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(50) DEFAULT'' COMMENT'用户昵称',
`email` VARCHAR(50) NOT NULL COMMENT'用户邮箱',
`phone` VARCHAR(20) DEFAULT'' COMMENT'手机号',
`gender` TINYINT(4) UNSIGNED DEFAULT '0'COMMENT '性别（0：男;1:女）',
`password` VARCHAR(100) NOT NULL COMMENT '密码',
`age` TINYINT(4) DEFAULT'0'  COMMENT '年龄',
`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT = 'app用户表';

-- 批量插入数据：100w
-- 插入百万条数据
DROP FUNCTION IF EXISTS mock_data;

DELIMITER $$ -- 写函数之前必须写，标志

CREATE FUNCTION mock_data()
RETURNS INT
BEGIN
    DECLARE num INT DEFAULT 1000000;
    DECLARE i INT DEFAULT 0;
    WHILE i < num DO
	-- 插入语句
	INSERT INTO app_user(`name`, `email`, `phone`, `gender`, `password`, `age`)
	VALUES(CONCAT('用户', i), '24736743@qq.com', CONCAT('18', FLOOR(RAND()*(999999999-100000000)+100000000)),FLOOR(RAND()*2),UUID(), FLOOR(RAND()*100));
	SET i = i + 1;
    END WHILE;
    RETURN i;
END;

SELECT mock_data();
```

- **索引效率测试**

```mysql
-- 无索引
SELECT * FROM app_user WHERE NAME = '用户9999'; -- 查看耗时
SELECT * FROM app_user WHERE NAME = '用户9999';
SELECT * FROM app_user WHERE NAME = '用户9999';

EXPLAIN SELECT * FROM app_user WHERE NAME = '用户9999';


-- 创建索引
-- CREATE INDEX 索引名 ON 表(字段)
CREATE INDEX id_app_user_name ON app_user(`name`);

-- 测试普通索引
SELECT * FROM app_user WHERE NAME = '用户9999';
```

## 索引原则

- 索引不是越多越好；

- 不要对经常变动的数据加索引；

- 小数据量的表建议不要加索引；

- 索引一般应加在查找条件的字段。

- 在创建上述索引的时候，为其指定索引类型，分两类：
  - hash类型的索引：查询单条快，范围查询慢；
  - btree类型的索引：b+树，层数越多，数据量指数级增长（我们就用它，因为innodb默认支持它）。

- 不同的存储引擎支持的索引类型也不一样：
  - InnoDB 支持事务，支持行级别锁定，支持 B-tree、Full-text 等索引，不支持 Hash 索引；
  - MyISAM 不支持事务，支持表级别锁定，支持 B-tree、Full-text 等索引，不支持 Hash 索引；
  - Memory 不支持事务，支持表级别锁定，支持 B-tree、Hash 等索引，不支持 Full-text 索引；
  - NDB 支持事务，支持行级别锁定，支持 Hash 索引，不支持 B-tree、Full-text 等索引；
  - Archive 不支持事务，支持表级别锁定，不支持 B-tree、Hash、Full-text 等索引；
