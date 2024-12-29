---
date created: 2024-09-22 10:33
date updated: 2024-11-22 08:48
---

# 事务

## 什么是事务?

- 要么都成功，要么都失败。
- 事务就是将一组 SQL 语句放在同一批次内去执行；
- 如果一个 SQL 语句出错, 则该批次内的所有 SQL 都将被取消执行；
- MySQL 事务处理只支持 `InnoDB` 和 `BDB` 数据表类型；

## 事务管理（ACID）

### 原子性 (Atomic)

- 整个事务中的所有操作，要么全部完成，要么全部不完成，不可能停滞在中间某个环节。事务在执行过程中发生错误，会被回滚（ROLLBACK）到事务开始前的状态，就像这个事务从来没有执行过一样

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409220938252.png)

这个过程包含两个步骤：
A：800 - 200 = 600\
B：200 + 200 = 400

原子性表示，这两个步骤一起成功，或者一起失败，不能只发生其中一个动作

### 一致性 (Consist)

- 一个事务可以封装状态改变（除非它是一个只读的）。==事务必须始终保持系统处于一致的状态，不管在任何给定的时间并发事务有多少==。
- 也就是说：如果事务是并发多个，系统也必须如同串行事务一样操作。其主要特征是保护性和不变性 (Preserving an Invariant)，以转账案例为例，假设有五个账户，每个账户余额是 100 元，那么五个账户总额是 500 元，如果在这个 5 个账户之间同时发生多个转账，无论并发多少个，比如在 A 与 B 账户之间转账 5 元，在 C 与 D 账户之间转账 10 元，在 B 与 E 之间转账 15 元，五个账户总额也应该还是 500 元，这就是保护性和不变性。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409220946684.png)

操作前 A：800，B：200\
操作后 A：600，B：400
一致性表示事务完成后，符合逻辑运算

### 持久性 (Durable)

- 在事务完成以后，该事务对数据库所作的更改便持久的保存在数据库之中，并不会被回滚。

表示事务结束后的数据不随着外界原因导致数据丢失

操作前 A：800，B：200
操作后 A：600，B：400
如果在操作前（事务还没有提交）服务器宕机或者断电，那么重启数据库以后，数据状态应该为
A：800，B：200
如果在操作后（事务已经提交）服务器宕机或者断电，那么重启数据库以后，数据状态应该为
A：600，B：400

### 隔离性 (Isolated)

- 隔离状态执行事务，使它们好像是系统在给定时间内执行的唯一操作。如果有两个事务，运行在相同的时间内，执行相同的功能，事务的隔离性将确保每一事务在系统中认为只有该事务在使用系统。这种属性有时称为 `串行化`，为了防止事务操作间的混淆，必须串行化或序列化请求，使得在同一时间仅有一个请求用于同一数据。

针对多个用户同时操作，主要是排除其他事务对本次事务的影响
![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409220956733.png)

事务一）A 向 B 转账 200\
事务二）C 向 B 转账100

最终：A: 600 B: 500 C:900

两个事务同时进行，其中一个事务读取到另外一个事务还没有提交的数据，执行步骤如图所示，按照数字顺序执行
![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409220957610.png)

隔离性用于解决以上问题。

## 事务的隔离级别

隔离所导致的一些问题：

- 脏读：指一个事务读取了另外一个事务未提交的数据。
- 不可重复读：在一个事务内读取表中的某一行数据，多次读取结果不同。（这个不一定是错误，只是某些场合不对）。
- 虚读 (幻读)：是指在一个事务内读取到了别的事务插入的数据，导致前后读取数量总量不一致。

### 脏读

指一个事务读取了另外一个事务未提交的数据。

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409221003279.png)

事务二读取到了事务一未提交的数据，B 应该为 400，现在还是 200

### 不可重复读

在一个事务内读取表中的某一行数据，多次读取结果不同。（这个不一定是错误，只是某些场合不对）

页面统计查询值：

| A  | 100 |
| :- | :-- |
| B  | 200 |
| C  | 500 |

生成报表的时候，B 有人转账进来 300（B 事务已经提交）

| A  | 100 |
| :- | :-- |
| B  | 500 |
| C  | 500 |

### 虚读 (幻读)

是指在一个事务内读取到了别的事务插入的数据，导致前后读取数量总量不一致。\
（一般是行影响，如下图所示：多了一行）

| A  | 100 |
| :- | :-- |
| B  | 500 |
| C  | 500 |

| A  | 100 |
| :- | :-- |
| B  | 500 |
| C  | 500 |
| D  | 500 |

### 四种隔离级别设置

#### 数据库

| 设置                       | 描述                        |
| ------------------------ | ------------------------- |
| `Serializable`           | 可避免脏读、不可重复读、虚读情况的发生。（串行化） |
| `Repeatable read`        | 可避免脏读、不可重复读情况的发生。（可重复读）   |
| `Read committed` 读已提交    | 可避免脏读情况发生（读已提交）。          |
| `Read uncommitted` 未提交的读 | 最低级别，以上情况均无法保证。(读未提交)     |

#### Java

适当的 Connection 方法，比如 `setAutoCommit` 或 `setTransactionIsolation`

| 设置                             | 描述                                                 |
| ------------------------------ | -------------------------------------------------- |
| `TRANSACTION_SERIALIZABLE`     | 指示不可以发生脏读、不可重复读和虚读的常量。                             |
| `TRANSACTION_REPEATABLE_READ`  | 指示不可以发生脏读和不可重复读的常量；虚读可以发生。                         |
| `TRANSACTION_READ_UNCOMMITTED` | 指示可以发生脏读 (dirty read)、不可重复读和虚读 (phantom read) 的常量。 |
| `TRANSACTION_READ_COMMITTED`   | 指示不可以发生脏读的常量；不可重复读和虚读可以发生。                         |

## 执行事务

- 注意:
  1. MySQL 中默认是自动提交；
  2. `使用事务时应先关闭自动提交`。

```mysql
-- ==========事务==========

-- MySQL默认开启事务的
SET autocommit = 0;   -- 关闭
SET autocommit = 1;   -- 开启(默认的)

-- 手动处理事务

-- 事务开启
START TRANSACTION;  -- 开始一个事务,标记事务的起始点

INSERT XX
INSERT XX

-- 提交:持久化
COMMIT;

-- 回滚:数据回到本次事务的初始状态
ROLLBACK;

-- 事务结束
SET autocommit =1;  -- 开始自动提交

-- 保存点
SAVEPOINT 保存点名称; -- 设置一个事务保存点
ROLLBACK TO SAVEPOINT 保存点名称; -- 回滚到保存点
RELEASE SAVEPOINT 保存点名称; -- 删除保存点

```

**测试事务：**

```mysql
/*
题目：
	A在线买一款价格为500元商品,网上银行转账.
	A的银行卡余额为2000,然后给商家B支付500.
	商家B一开始的银行卡余额为10000
	
	创建数据库shop和创建表account并插入2条数据
*/

CREATE DATABASE `shop`CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `shop`;

CREATE TABLE `account` (
`id` INT(11) NOT NULL AUTO_INCREMENT,
`name` VARCHAR(32) NOT NULL,
`money` DECIMAL(9,2) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO account (`name`,`money`)
VALUES('A',2000.00),('B',10000.00);

-- 模拟转账
SET autocommit = 0; -- 关闭自动提交
START TRANSACTION;  -- 开始一个事务

UPDATE account SET money=money-500 WHERE `name`='A';
UPDATE account SET money=money+500 WHERE `name`='B';

COMMIT; -- 提交事务，持久化了！！！
# rollback; -- 回滚
SET autocommit = 1; -- 恢复自动提交
```
