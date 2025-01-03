---
date created: 2024-09-20 22:59
---

# SQL基础

通常可以将 SQL 分为四类，分别是 DDL（数据定义语言）、DML（数据操作语言）、DQL（数据查询语言）和 DCL（数据控制语言）。

- DDL 主要用于创建、删除、修改数据库中的对象，比如创建、删除和修改二维表，核心的关键字包括create、drop和alter；
- DML 主要负责数据的插入、删除和更新，关键词包括insert、delete和update；
- DQL 负责数据查询，最重要的一个关键词是select；
- DCL 通常用于授予和召回权限，核心关键词是grant和revoke。

> 说明：SQL 是不区分大小写的语言

## DDL（数据定义语言）

示例：实现一个选课系统的数据库，如下所示的 SQL 创建了名为school的数据库和五张表，分别是学院表（tb_college）、学生表（tb_student）、教师表（tb_teacher）、课程表（tb_course）和选课记录表（tb_record），其中学生和教师跟学院之间是多对一关系，课程跟老师之间也是多对一关系，学生和课程是多对多关系，选课记录表就是维持学生跟课程多对多关系的中间表。

```mysql
-- 如果存在名为school的数据库就删除它
drop database if exists `school`;

-- 创建名为school的数据库并设置默认的字符集和排序方式
create database `school` default character set utf8mb4 collate utf8mb4_general_ci;

-- 切换到school数据库上下文环境
use `school`;

-- 创建学院表
create table `tb_college`
(
`col_id` int unsigned auto_increment comment '编号',
`col_name` varchar(50) not null comment '名称',
`col_intro` varchar(500) default '' comment '介绍',
primary key (`col_id`)
) engine=innodb auto_increment=1 comment '学院表';

-- 创建学生表
create table `tb_student`
(
`stu_id` int unsigned not null comment '学号',
`stu_name` varchar(20) not null comment '姓名',
`stu_sex` boolean default 1 not null comment '性别',
`stu_birth` date not null comment '出生日期',
`stu_addr` varchar(255) default '' comment '籍贯',
`col_id` int unsigned not null comment '所属学院',
primary key (`stu_id`),
constraint `fk_student_col_id` foreign key (`col_id`) references `tb_college` (`col_id`)
) engine=innodb comment '学生表';

-- 创建教师表
create table `tb_teacher`
(
`tea_id` int unsigned not null comment '工号',
`tea_name` varchar(20) not null comment '姓名',
`tea_title` varchar(10) default '助教' comment '职称',
`col_id` int unsigned not null comment '所属学院',
primary key (`tea_id`),
constraint `fk_teacher_col_id` foreign key (`col_id`) references `tb_college` (`col_id`)
) engine=innodb comment '老师表';

-- 创建课程表
create table `tb_course`
(
`cou_id` int unsigned not null comment '编号',
`cou_name` varchar(50) not null comment '名称',
`cou_credit` int not null comment '学分',
`tea_id` int unsigned not null comment '授课老师',
primary key (`cou_id`),
constraint `fk_course_tea_id` foreign key (`tea_id`) references `tb_teacher` (`tea_id`)
) engine=innodb comment '课程表';

-- 创建选课记录表
create table `tb_record`
(
`rec_id` bigint unsigned auto_increment comment '选课记录号',
`stu_id` int unsigned not null comment '学号',
`cou_id` int unsigned not null comment '课程编号',
`sel_date` date not null comment '选课日期',
`score` decimal(4,1) comment '考试成绩',
primary key (`rec_id`),
constraint `fk_record_stu_id` foreign key (`stu_id`) references `tb_student` (`stu_id`),
constraint `fk_record_cou_id` foreign key (`cou_id`) references `tb_course` (`cou_id`),
constraint `uk_record_stu_cou` unique (`stu_id`, `cou_id`)
) engine=innodb comment '选课记录表';
```

创建数据库时，我们通过`default character set utf8mb4`指定了数据库默认使用的字符集为`utf8mb4`（最大`4`字节的`utf-8`编码），我们推荐使用该字符集，它也是 MySQL 8.x 默认使用的字符集，因为它能够支持国际化编码，还可以存储 Emoji 字符。

## DML（数据操作语言）

给上面创建的表添加数据：

```mysql
use school;

-- 插入学院数据
insert into `tb_college` 
    (`col_name`, `col_intro`) 
values 
    ('计算机学院', '计算机学院1958年设立计算机专业，1981年建立计算机科学系，1998年设立计算机学院，2005年5月，为了进一步整合教学和科研资源，学校决定，计算机学院和软件学院行政班子合并统一运作、实行教学和学生管理独立运行的模式。 学院下设三个系：计算机科学与技术系、物联网工程系、计算金融系；两个研究所：图象图形研究所、网络空间安全研究院（2015年成立）；三个教学实验中心：计算机基础教学实验中心、IBM技术中心和计算机专业实验中心。'),
    ('外国语学院', '外国语学院设有7个教学单位，6个文理兼收的本科专业；拥有1个一级学科博士授予点，3个二级学科博士授予点，5个一级学科硕士学位授权点，5个二级学科硕士学位授权点，5个硕士专业授权领域，同时还有2个硕士专业学位（MTI）专业；有教职员工210余人，其中教授、副教授80余人，教师中获得中国国内外名校博士学位和正在职攻读博士学位的教师比例占专任教师的60%以上。'),
    ('经济管理学院', '经济学院前身是创办于1905年的经济科；已故经济学家彭迪先、张与九、蒋学模、胡寄窗、陶大镛、胡代光，以及当代学者刘诗白等曾先后在此任教或学习。');

-- 插入学生数据
insert into `tb_student` 
    (`stu_id`, `stu_name`, `stu_sex`, `stu_birth`, `stu_addr`, `col_id`) 
values
    (1001, '杨过', 1, '1990-3-4', '湖南长沙', 1),
    (1002, '任我行', 1, '1992-2-2', '湖南长沙', 1),
    (1033, '王语嫣', 0, '1989-12-3', '四川成都', 1),
    (1572, '岳不群', 1, '1993-7-19', '陕西咸阳', 1),
    (1378, '纪嫣然', 0, '1995-8-12', '四川绵阳', 1),
    (1954, '林平之', 1, '1994-9-20', '福建莆田', 1),
    (2035, '东方不败', 1, '1988-6-30', null, 2),
    (3011, '林震南', 1, '1985-12-12', '福建莆田', 3),
    (3755, '项少龙', 1, '1993-1-25', '四川成都', 3),
    (3923, '杨不悔', 0, '1985-4-17', '四川成都', 3);

-- 插入老师数据
insert into `tb_teacher` 
    (`tea_id`, `tea_name`, `tea_title`, `col_id`) 
values 
    (1122, '张三丰', '教授', 1),
    (1133, '宋远桥', '副教授', 1),
    (1144, '杨逍', '副教授', 1),
    (2255, '范遥', '副教授', 2),
    (3366, '韦一笑', default, 3);

-- 插入课程数据
insert into `tb_course` 
    (`cou_id`, `cou_name`, `cou_credit`, `tea_id`) 
values 
    (1111, 'Python程序设计', 3, 1122),
    (2222, 'Web前端开发', 2, 1122),
    (3333, '操作系统', 4, 1122),
    (4444, '计算机网络', 2, 1133),
    (5555, '编译原理', 4, 1144),
    (6666, '算法和数据结构', 3, 1144),
    (7777, '经贸法语', 3, 2255),
    (8888, '成本会计', 2, 3366),
    (9999, '审计学', 3, 3366);

-- 插入选课数据
insert into `tb_record` 
    (`stu_id`, `cou_id`, `sel_date`, `score`) 
values 
    (1001, 1111, '2017-09-01', 95),
    (1001, 2222, '2017-09-01', 87.5),
    (1001, 3333, '2017-09-01', 100),
    (1001, 4444, '2018-09-03', null),
    (1001, 6666, '2017-09-02', 100),
    (1002, 1111, '2017-09-03', 65),
    (1002, 5555, '2017-09-01', 42),
    (1033, 1111, '2017-09-03', 92.5),
    (1033, 4444, '2017-09-01', 78),
    (1033, 5555, '2017-09-01', 82.5),
    (1572, 1111, '2017-09-02', 78),
    (1378, 1111, '2017-09-05', 82),
    (1378, 7777, '2017-09-02', 65.5),
    (2035, 7777, '2018-09-03', 88),
    (2035, 9999, '2019-09-02', null),
    (3755, 1111, '2019-09-02', null),
    (3755, 8888, '2019-09-02', null),
    (3755, 9999, '2017-09-01', 92);
```

> 上面的`insert`语句使用了批处理的方式来插入数据，这种做法插入数据的效率比较高。

## DQL（数据查询语言）

```mysql
-- 查询所有学生的所有信息
select * from `tb_student`;

-- 查询学生的学号、姓名和籍贯(投影)
select `stu_id`, `stu_name`, `stu_addr` from `tb_student`;

-- 查询所有课程的名称及学分(投影和别名)
select `cou_name` as 课程名称, `cou_credit` as 学分 from `tb_course`;

-- 查询所有女学生的姓名和出生日期(筛选)
select `stu_name`, `stu_birth` from `tb_student` where `stu_sex`=0;

-- 查询籍贯为“四川成都”的女学生的姓名和出生日期(筛选)
select `stu_name`, `stu_birth` from `tb_student` where `stu_sex`=0 and `stu_addr`='四川成都';

-- 查询籍贯为“四川成都”或者性别为“女生”的学生
select `stu_name`, `stu_birth` from `tb_student` where `stu_sex`=0 or `stu_addr`='四川成都';

-- 查询所有80后学生的姓名、性别和出生日期(筛选)
select `stu_name`, `stu_sex`, `stu_birth` from `tb_student` 
where `stu_birth`>='1980-1-1' and `stu_birth`<='1989-12-31';

select `stu_name`, `stu_sex`, `stu_birth` from `tb_student` 
where `stu_birth` between '1980-1-1' and '1989-12-31';

-- 补充：将表示性别的 1 和 0 处理成 “男” 和 “女”
select 
    `stu_name` as 姓名, 
    if(`stu_sex`, '男', '女') as 性别, 
    `stu_birth` as 出生日期
from `tb_student` 
where `stu_birth` between '1980-1-1' and '1989-12-31';

select 
    `stu_name` as 姓名, 
    case `stu_sex` when 1 then '男' else '女' end as 性别, 
    `stu_birth` as 出生日期
from `tb_student` 
where `stu_birth` between '1980-1-1' and '1989-12-31';

-- 查询学分大于2的课程的名称和学分(筛选)
select `cou_name`, `cou_credit` from `tb_course` where `cou_credit`>2;

-- 查询学分是奇数的课程的名称和学分(筛选)
select `cou_name`, `cou_credit` from `tb_course` where `cou_credit`%2<>0;

select `cou_name`, `cou_credit` from `tb_course` where `cou_credit` mod 2<>0;

-- 查询选择选了1111的课程考试成绩在90分以上的学生学号(筛选)
select `stu_id` from `tb_record` where `cou_id`=1111 and `score`>90;

-- 查询名字叫“杨过”的学生的姓名和性别
select `stu_name`, `stu_sex` from `tb_student` where `stu_name`='杨过';
    
-- 查询姓“杨”的学生姓名和性别(模糊)
-- % - 通配符（wildcard），它可以匹配0个或任意多个字符
select `stu_name`, `stu_sex` from `tb_student` where `stu_name` like '杨%';

-- 查询姓“杨”名字两个字的学生姓名和性别(模糊)
-- _ - 通配符（wildcard），它可以精确匹配一个字符
select `stu_name`, `stu_sex` from `tb_student` where `stu_name` like '杨_';

-- 查询姓“杨”名字三个字的学生姓名和性别(模糊)
select `stu_name`, `stu_sex` from `tb_student` where `stu_name` like '杨__';

-- 查询名字中有“不”字或“嫣”字的学生的姓名(模糊)
select `stu_name` from `tb_student` where `stu_name` like '%不%' or `stu_name` like '%嫣%';

-- 将“岳不群”改名为“岳不嫣”，比较下面两个查询的区别
update `tb_student` set `stu_name`='岳不嫣' where `stu_id`=1572;

select `stu_name` from `tb_student` where `stu_name` like '%不%'
union 
select `stu_name` from `tb_student` where `stu_name` like '%嫣%';

select `stu_name` from `tb_student` where `stu_name` like '%不%'
union all 
select `stu_name` from `tb_student` where `stu_name` like '%嫣%';

-- 查询姓“杨”或姓“林”名字三个字的学生的姓名(正则表达式模糊查询)
select `stu_name` from `tb_student` where `stu_name` regexp '[杨林].{2}';

-- 查询没有录入籍贯的学生姓名(空值处理)
select `stu_name` from `tb_student` where `stu_addr` is null;

select `stu_name` from `tb_student` where `stu_addr` <=> null;

-- 查询录入了籍贯的学生姓名(空值处理)
select `stu_name` from `tb_student` where `stu_addr` is not null;

-- 下面的查询什么也查不到，三值逻辑 --> true / false / unknown
select `stu_name` from `tb_student` where `stu_addr`=null or `stu_addr`<>null;

-- 查询学生选课的所有日期(去重)
select distinct `sel_date` from `tb_record`;

-- 查询学生的籍贯(去重)
select distinct `stu_addr` from `tb_student` where `stu_addr` is not null;

-- 查询男学生的姓名和生日按年龄从大到小排列(排序)
-- 升序：从小到大 - asc，降序：从大到小 - desc
select `stu_id`, `stu_name`, `stu_birth` from `tb_student` 
where `stu_sex`=1 order by `stu_birth` asc, `stu_id` desc;

-- 补充：将上面的生日换算成年龄(日期函数、数值函数)
select 
    `stu_id` as 学号,
    `stu_name` as 姓名, 
    floor(datediff(curdate(), `stu_birth`)/365) as 年龄
from `tb_student` 
where `stu_sex`=1 order by 年龄 desc, `stu_id` desc;

-- 查询年龄最大的学生的出生日期(聚合函数)
select min(`stu_birth`) from `tb_student`;

-- 查询年龄最小的学生的出生日期(聚合函数)
select max(`stu_birth`) from `tb_student`;

-- 查询编号为1111的课程考试成绩的最高分(聚合函数)
select max(`score`) from `tb_record` where `cou_id`=1111;

-- 查询学号为1001的学生考试成绩的最低分(聚合函数)
select min(`score`) from `tb_record` where `stu_id`=1001;

-- 查询学号为1001的学生考试成绩的平均分(聚合函数)
select avg(`score`) from `tb_record` where `stu_id`=1001;

select sum(`score`) / count(`score`) from `tb_record` where `stu_id`=1001;

-- 查询学号为1001的学生考试成绩的平均分，如果有null值，null值算0分(聚合函数)
select sum(`score`) / count(*) from `tb_record` where `stu_id`=1001;

select avg(ifnull(`score`, 0)) from `tb_record` where `stu_id`=1001;

-- 查询学号为1001的学生考试成绩的标准差(聚合函数)
select std(`score`), variance(`score`) from `tb_record` where `stu_id`=1001;

-- 查询男女学生的人数(分组和聚合函数)
select 
    case `stu_sex` when 1 then '男' else '女' end as 性别,
    count(*) as 人数
from `tb_student` group by `stu_sex`;

-- 查询每个学院学生人数(分组和聚合函数)
select 
    `col_id` as 学院,
    count(*) as 人数
from `tb_student` group by `col_id` with rollup;

-- 查询每个学院男女学生人数(分组和聚合函数)
select 
    `col_id` as 学院,
    if(`stu_sex`, '男', '女') as 性别,
    count(*) as 人数
from `tb_student` group by `col_id`, `stu_sex`;

-- 查询每个学生的学号和平均成绩(分组和聚合函数)
select 
    `stu_id`, 
    round(avg(`score`), 1) as avg_score
from `tb_record` group by `stu_id`;

-- 查询平均成绩大于等于90分的学生的学号和平均成绩
-- 分组以前的筛选使用where子句，分组以后的筛选使用having子句
select 
    `stu_id`, 
    round(avg(`score`), 1) as avg_score
from `tb_record`
group by `stu_id` having avg_score>=90;

-- 查询1111、2222、3333三门课程平均成绩大于等于90分的学生的学号和平均成绩
select 
    `stu_id`, 
    round(avg(`score`), 1) as avg_score
from `tb_record` where `cou_id` in (1111, 2222, 3333)
group by `stu_id` having avg_score>=90;

-- 查询年龄最大的学生的姓名(子查询/嵌套查询)
-- 嵌套查询：把一个select的结果作为另一个select的一部分来使用
select `stu_name` from `tb_student` 
where `stu_birth`=(
    select min(`stu_birth`) from `tb_student`
);

-- 查询选了两门以上的课程的学生姓名(子查询/分组条件/集合运算)
select `stu_name` from `tb_student` 
where `stu_id` in (
    select `stu_id` from `tb_record` 
    group by `stu_id` having count(*)>2
);

-- 查询学生的姓名、生日和所在学院名称
select `stu_name`, `stu_birth`, `col_name` 
from `tb_student`, `tb_college` 
where `tb_student`.`col_id`=`tb_college`.`col_id`;

select `stu_name`, `stu_birth`, `col_name` 
from `tb_student` inner join `tb_college` 
on `tb_student`.`col_id`=`tb_college`.`col_id`;

select `stu_name`, `stu_birth`, `col_name` 
from `tb_student` natural join `tb_college`;

-- 查询学生姓名、课程名称以及成绩(连接查询/联结查询)
select `stu_name`, `cou_name`, `score` 
from `tb_student`, `tb_course`, `tb_record` 
where `tb_student`.`stu_id`=`tb_record`.`stu_id` 
and `tb_course`.`cou_id`=`tb_record`.`cou_id` 
and `score` is not null;

select `stu_name`, `cou_name`, `score` from `tb_student` 
inner join `tb_record` on `tb_student`.`stu_id`=`tb_record`.`stu_id` 
inner join `tb_course` on `tb_course`.`cou_id`=`tb_record`.`cou_id` 
where `score` is not null;

select `stu_name`, `cou_name`, `score` from `tb_student` 
natural join `tb_record` 
natural join `tb_course`
where `score` is not null;

-- 补充：上面的查询结果取前5条数据(分页查询)
select `stu_name`, `cou_name`, `score` 
from `tb_student`, `tb_course`, `tb_record` 
where `tb_student`.`stu_id`=`tb_record`.`stu_id` 
and `tb_course`.`cou_id`=`tb_record`.`cou_id` 
and `score` is not null 
order by `score` desc 
limit 0,5;

-- 补充：上面的查询结果取第6-10条数据(分页查询)
select `stu_name`, `cou_name`, `score` 
from `tb_student`, `tb_course`, `tb_record` 
where `tb_student`.`stu_id`=`tb_record`.`stu_id` 
and `tb_course`.`cou_id`=`tb_record`.`cou_id` 
and `score` is not null 
order by `score` desc 
limit 5 offset 5;

-- 补充：上面的查询结果取第11-15条数据(分页查询)
select `stu_name`, `cou_name`, `score` 
from `tb_student`, `tb_course`, `tb_record` 
where `tb_student`.`stu_id`=`tb_record`.`stu_id` 
and `tb_course`.`cou_id`=`tb_record`.`cou_id` 
and `score` is not null 
order by `score` desc 
limit 5 offset 10;

-- 查询选课学生的姓名和平均成绩(子查询和连接查询)
select `stu_name`, `avg_score` 
from `tb_student` inner join (
    select `stu_id` as `sid`, round(avg(`score`), 1) as avg_score 
    from `tb_record` group by `stu_id`
) as `t2` on `stu_id`=`sid`;

-- 查询学生的姓名和选课的数量
select `stu_name`, `total` from `tb_student` as `t1`
inner join (
    select `stu_id`, count(*) as `total`
    from `tb_record` group by `stu_id`
) as `t2` on `t1`.`stu_id`=`t2`.`stu_id`;

-- 查询每个学生的姓名和选课数量(左外连接和子查询)
-- 左外连接：左表（写在join左边的表）的每条记录都可以查出来，不满足连表条件的地方填充null。
select `stu_name`, coalesce(`total`, 0) as `total`
from `tb_student` as `t1`
left outer join (
    select `stu_id`, count(*) as `total`
    from `tb_record` group by `stu_id`
) as `t2` on `t1`.`stu_id`=`t2`.`stu_id`;

-- 修改选课记录表，去掉 stu_id 列的外键约束
alter table `tb_record` drop foreign key `fk_record_stu_id`;

-- 插入两条新纪录（注意：没有学号为 5566 的学生）
insert into `tb_record` 
values
    (default, 5566, 1111, '2019-09-02', 80),
    (default, 5566, 2222, '2019-09-02', 70);

-- 右外连接：右表（写在join右边的表）的每条记录都可以查出来，不满足连表条件的地方填充null。
select `stu_name`, `total` from `tb_student` as `t1`
right outer join (
    select `stu_id`, count(*) as `total`
    from `tb_record` group by `stu_id`
) as `t2` on `t1`.`stu_id`=`t2`.`stu_id`;

-- 全外连接：左表和右表的每条记录都可以查出来，不满足连表条件的地方填充null。
-- 说明：MySQL不支持全外连接，所以用左外连接和右外连接的并集来表示。
select `stu_name`, `total`
from `tb_student` as `t1`
left outer join (
    select `stu_id`, count(*) as `total`
    from `tb_record` group by `stu_id`
) as `t2` on `t1`.`stu_id`=`t2`.`stu_id`
union 
select `stu_name`, `total` from `tb_student` as `t1`
right outer join (
    select `stu_id`, count(*) as `total`
    from `tb_record` group by `stu_id`
) as `t2` on `t1`.`stu_id`=`t2`.`stu_id`;
```

1. MySQL目前的版本不支持全外连接，上面我们通过`union`操作，将左外连接和右外连接的结果求并集实现全外连接的效果。大家可以通过下面的图来加深对连表操作的认识。[![|600](https://camo.githubusercontent.com/33a5227afb8a250f85aaf838ec09bbcd9dae4289445974956142da2f9f5b94a6/68747470733a2f2f67697465652e636f6d2f6a61636b66727565642f6d797069632f7261772f6d61737465722f32303231313132313133353131372e706e67)](https://camo.githubusercontent.com/33a5227afb8a250f85aaf838ec09bbcd9dae4289445974956142da2f9f5b94a6/68747470733a2f2f67697465652e636f6d2f6a61636b66727565642f6d797069632f7261772f6d61737465722f32303231313132313133353131372e706e67)

2. MySQL 中支持多种类型的运算符，包括：算术运算符（`+`、`-`、`*`、`/`、`%`）、比较运算符（`=`、`<>`、`<=>`、`<`、`<=`、`>`、`>=`、`BETWEEN...AND..`.、`IN`、`IS NULL`、`IS NOT NULL`、`LIKE`、`RLIKE`、`REGEXP`）、逻辑运算符（`NOT`、`AND`、`OR`、`XOR`）和位运算符（`&`、`|`、`^`、`~`、`>>`、`<<`），我们可以在 DML 中使用这些运算符处理数据。

3. 在查询数据时，可以在`SELECT`语句及其子句（如`WHERE`子句、`ORDER BY`子句、`HAVING`子句等）中使用函数，这些函数包括字符串函数、数值函数、时间日期函数、流程函数等，如下面的表格所示。

常用字符串函数。

| 函数                          | 功能                          |
| --------------------------- | --------------------------- |
| `CONCAT`                    | 将多个字符串连接成一个字符串              |
| `FORMAT`                    | 将数值格式化成字符串并指定保留几位小数         |
| `FROM_BASE64` / `TO_BASE64` | BASE64解码/编码                 |
| `BIN` / `OCT` / `HEX`       | 将数值转换成二进制/八进制/十六进制字符串       |
| `LOCATE`                    | 在字符串中查找一个子串的位置              |
| `LEFT` / `RIGHT`            | 返回一个字符串左边/右边指定长度的字符         |
| `LENGTH` / `CHAR_LENGTH`    | 返回字符串的长度以字节/字符为单位           |
| `LOWER` / `UPPER`           | 返回字符串的小写/大写形式               |
| `LPAD` / `RPAD`             | 如果字符串的长度不足，在字符串左边/右边填充指定的字符 |
| `LTRIM` / `RTRIM`           | 去掉字符串前面/后面的空格               |
| `ORD` / `CHAR`              | 返回字符对应的编码/返回编码对应的字符         |
| `STRCMP`                    | 比较字符串，返回-1、0、1分别表示小于、等于、大于  |
| `SUBSTRING`                 | 返回字符串指定范围的子串                |

常用数值函数。

| 函数                                                       | 功能                |
| -------------------------------------------------------- | ----------------- |
| `ABS`                                                    | 返回一个数的绝度值         |
| `CEILING` / `FLOOR`                                      | 返回一个数上取整/下取整的结果   |
| `CONV`                                                   | 将一个数从一种进制转换成另一种进制 |
| `CRC32`                                                  | 计算循环冗余校验码         |
| `EXP` / `LOG` / `LOG2` / `LOG10`                         | 计算指数/对数           |
| `POW`                                                    | 求幂                |
| `RAND`                                                   | 返回[0,1)范围的随机数     |
| `ROUND`                                                  | 返回一个数四舍五入后的结果     |
| `SQRT`                                                   | 返回一个数的平方根         |
| `TRUNCATE`                                               | 截断一个数到指定的精度       |
| `SIN` / `COS` / `TAN` / `COT` / `ASIN` / `ACOS` / `ATAN` | 三角函数              |

常用时间日期函数。

| 函数                            | 功能                  |
| ----------------------------- | ------------------- |
| `CURDATE` / `CURTIME` / `NOW` | 获取当前日期/时间/日期和时间     |
| `ADDDATE` / `SUBDATE`         | 将两个日期表达式相加/相减并返回结果  |
| `DATE` / `TIME`               | 从字符串中获取日期/时间        |
| `YEAR` / `MONTH` / `DAY`      | 从日期中获取年/月/日         |
| `HOUR` / `MINUTE` / `SECOND`  | 从时间中获取时/分/秒         |
| `DATEDIFF` / `TIMEDIFF`       | 返回两个时间日期表达式相差多少天/小时 |
| `MAKEDATE` / `MAKETIME`       | 制造一个日期/时间           |

常用流程函数。

| 函数       | 功能                         |
| -------- | -------------------------- |
| `IF`     | 根据条件是否成立返回不同的值             |
| `IFNULL` | 如果为NULL则返回指定的值否则就返回本身      |
| `NULLIF` | 两个表达式相等就返回NULL否则返回第一个表达式的值 |

其他常用函数。

| 函数                         | 功能              |
| -------------------------- | --------------- |
| `MD5` / `SHA1` / `SHA2`    | 返回字符串对应的哈希摘要    |
| `CHARSET` / `COLLATION`    | 返回字符集/校对规则      |
| `USER` / `CURRENT_USER`    | 返回当前用户          |
| `DATABASE`                 | 返回当前数据库名        |
| `VERSION`                  | 返回当前数据库版本       |
| `FOUND_ROWS` / `ROW_COUNT` | 返回查询到的行数/受影响的行数 |
| `LAST_INSERT_ID`           | 返回最后一个自增主键的值    |
| `UUID` / `UUID_SHORT`      | 返回全局唯一标识符       |

## DCL（数据控制语言）

数据控制语言用于给指定的用户授权或者从召回指定用户的指定权限，这组操作对数据库管理员来说比较重要，将一个用户的权限最小化（刚好够用）是非常重要的，对数据库的安全至关重要。

```mysql
-- 创建名为 wangdachui 的账号并为其指定口令，允许该账号从任意主机访问
create user 'wangdachui'@'%' identified by '123456';

-- 授权 wangdachui 可以对名为school的数据库执行 select 和 insert 操作
grant select, insert on `school`.* to 'wangdachui'@'%';

-- 召回 wangdachui 对school数据库的 insert 权限
revoke insert on `school`.* from 'wangdachui'@'%';
```

> 创建一个可以允许任意主机登录并且具有超级管理员权限的用户在现实中并不是一个明智的决定，因为一旦该账号的口令泄露或者被破解，数据库将会面临灾难级的风险。
