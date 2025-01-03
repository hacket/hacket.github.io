---
date created: 2024-09-19 00:46
date updated: 2024-12-26 00:15
dg-publish: true
---

# JDBC 入门

## 数据库驱动

这里的驱动的概念和平时听到的那种驱动的概念是一样的，比如平时购买的声卡，网卡直接插到计算机上面是不能用的，必须要安装相应的驱动程序之后才能够使用声卡和网卡，同样道理，我们安装好数据库之后，我们的应用程序也是不能直接使用数据库的，必须要通过相应的数据库驱动程序，通过驱动程序去和数据库打交道

## 什么是 JDBC？

SUN公司为了简化、统一对数据库的操作，定义了一套Java操作数据库的规范（接口），称之为**JDBC**。 这套接口由数据库厂商去实现，这样，开发人员只需要学习jdbc接口，并通过jdbc加载具体的驱动，就 可以操作数据库。

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202409190046349.png)

- JDBC全称为：Java Data Base Connectivity（java数据库连接），它主要由接口组成。
- 组成JDBC的２个包：java.sql、javax.sql
- 开发JDBC应用需要以上2个包的支持外，还需要导入相应JDBC的数据库实现(即数据库驱动包—mysql-connector-java-5.1.47.jar)。

## JDBC 开发步骤

### JDBC 开发

需要jar包的支持：

- `java.sql`
- `javax.sql`
- `mysql-conneter-java`… 连接驱动（必须要导入）

**JDBC 固定步骤：**

1. 加载驱动
2. 连接数据库,代表数据库
3. 向数据库发送SQL的对象Statement : CRUD
4. 编写SQL （根据业务，不同的SQL）
5. 执行SQL
6. 关闭连接

SQL 准备：

```mysql
CREATE DATABASE jdbcStudy CHARACTER SET utf8 COLLATE utf8_general_ci;
USE jdbcStudy;
CREATE TABLE users(
id INT PRIMARY KEY,
NAME VARCHAR(40),
PASSWORD VARCHAR(40),
email VARCHAR(60),
birthday DATE
);
INSERT INTO users(id,NAME,PASSWORD,email,birthday)
VALUES(1,'zhansan','123456','zs@sina.com','1980-12-04'),
(2,'lisi','123456','lisi@sina.com','1981-12-04'),
(3,'wangwu','123456','wangwu@sina.com','1979-12-04');
```

Java 代码：

```java
/**
 * 第一个JDBC程序
 */
public class JdbcFirstDemo {
    public static void main(String[] args) throws Exception{
        // 1.加载驱动
        Class.forName("com.mysql.jdbc.Driver"); // 固定写法，加载驱动

        // 2.用户信息和url
        // uesUnicode=true 支持中文编码
        // characterEncoding=utf8 设定字符集
        // useSSL=true 使用安全的连接
        String url = "jdbc:mysql://localhost:3306/jdbcStudy?uesUnicode=true&characterEncoding=utf8&useSSL=true";
        String username = "root";
        String password = "root";

        // 3.连接成功，数据库对象 connection 代表数据库
        Connection connection = DriverManager.getConnection(url, username, password);

        // 4.执行SQL对象
        Statement statement = connection.createStatement();

        // 5.执行SQL对象，执行SQL
        String sql = "SELECT * FROM users";

        ResultSet resultSet = statement.executeQuery(sql);  // 返回结果集,结果集中封装了我们全部查询出来的对象

        while(resultSet.next()){
            System.out.println("id=" + resultSet.getObject("id"));
            System.out.println("name=" + resultSet.getObject("NAME"));
            System.out.println("pwd=" + resultSet.getObject("PASSWORD"));
            System.out.println("email=" + resultSet.getObject("email"));
            System.out.println("both=" + resultSet.getObject("birthday"));
        }

        // 6.释放连接
        resultSet.close();
        statement.close();
        connection.close();

    }
}
```

步骤总结：

1. 加载驱动；
2. 连接数据库 `DriverManager`；
3. 获得执行SQL的对象 `Statement`；
4. 获得返回的结果集；
5. 释放连接。

### DriverManager

- JDBC程序中的DriverManager用于加载驱动，并创建与数据库的链接，这个API的常用方法：

```java
// DriverManager.registerDriver(new Driver())
// DriverManager.getConnection(url, user, password)

Class.forName("com.mysql.jdbc.Driver"); // 固定写法，加载驱动 
Connection connection = DriverManager.getConnection(url, username, password);

// connection 代表数据库
connection.createStatement();// 创建向数据库发送sql的statement对象
connection.prepareStatement(sql);// 创建向数据库发送预编译sql的PrepareSatement对象
connection.rollback();  // 事务回滚
connection.commit(); // 事务提交
connection.setAutoCommit(); // 设置数据库自动提交
```

注意：==在实际开发中并不推荐采用registerDriver方法注册驱动==。原因如下：

1. 查看Driver的源代码可以看到，如果采用此种方式，会导致驱动程序注册两次，也就是在内存中会 有两个Driver对象。
2. 程序依赖mysql的api，脱离mysql的jar包，程序将无法编译，将来程序切换底层数据库将会非常麻 烦。

推荐方式：`Class.forName("com.mysql.jdbc.Driver");`
采用此种方式不会导致驱动对象在内存中重复出现，并且采用此种方式，程序仅仅只需要一个字符串， 不需要依赖具体的驱动，使程序的灵活性更高。

### URL说明

- URL用于标识数据库的位置，通过URL地址告诉JDBC程序连接哪个数据库，URL地址的写法为：

```java
String url = "jdbc:mysql://localhost:3306/jdbcStudy?uesUnicode=true&characterEncoding=utf8&useSSL=true";

// mysql 端口号 3306
// jdbc:mysql://localhost:3306/数据库名?参数1&参数2&参数3

// oracle 端口号 1521
// jdbc:oracle:thin:@localhost:1521:sid
```

- 常用数据库URL地址的写法：
  - Oracle写法：`jdbc:oracle:thin:@localhost:1521:sid`
  - SqlServer写法：`jdbc:microsoft:sqlserver://localhost:1433; DatabaseName=sid`
  - MySql写法：`jdbc:mysql://localhost:3306/sid`

- 如果连接的是本地的Mysql数据库，并且连接使用的端口是3306，那么的url地址可以简写为
  - `jdbc:mysql:///数据库`

### Statement执行SQL的对象

```java
String sql = "SELECT * FROM users";
ResultSet resultSet = statement.executeQuery(sql);  // 返回结果集,结果集中封装了我们全部查询出来的对象

// Statement对象常用方法
statement.executeQuery(sql); // 查询操作，返回结果集
statement.execute(sql); // 执行任何SQL
statement.executeUpdate(sql); // 更新、插入、删除，均为这个。唯一受影响的是行数
statement.addBatch(sql); // 把多条sql语句放到一个批处理中
statement.executeBatch(sql); // 向数据库发送一批sql语句执行
```

==JDBC中的statement对象用于向数据库发送SQL语句，想完成对数据库的增删改查，只需要通过这个对象 向数据库发送增删改查语句即可==。
Statement对象的executeUpdate方法，用于向数据库发送增、删、改的sql语句，executeUpdate执行 完后，将会返回一个整数（即增删改语句导致了数据库几行数据发生了变化）。

`Statement.executeQuery`方法用于向数据库发送查询语句，executeQuery方法返回代表查询结果的 ResultSet对象。

#### CRUD操作-create

- 使用executeUpdate(String sql)方法完成数据添加操作，示例操作：

```java
Statement st = conn.createStatement();
String sql = "insert into user(….) values(…..) ";
int num = st.executeUpdate(sql);
if(num>0){
    System.out.println("插入成功！！！");
}
```

#### CRUD 操作 -delete

- 使用executeUpdate(String sql)方法完成数据删除操作，示例操作：

```java
Statement st = conn.createStatement();
String sql = "delete from user where id=1";
int num = st.executeUpdate(sql);
if(num>0){
	System.out.println(“删除成功！！！");
}
```

#### CRUD操作-update

- 使用executeUpdate(String sql)方法完成数据修改操作，示例操作：

```java
Statement st = conn.createStatement();
String sql = "update user set name='' where name=''";
int num = st.executeUpdate(sql);
if(num>0){
	System.out.println(“修改成功！！！");
}
```

#### CRUD操作-read

- 使用executeQuery(String sql)方法完成数据查询操作，示例操作：

```java
Statement st = conn.createStatement();
String sql = "select * from user where id=1";
ResultSet rs = st.executeUpdate(sql);
while(rs.next()){
	//根据获取列的数据类型，分别调用rs的相应方法映射到java对象中
}
```

#### PreparedStatement对象

PreperedStatement是Statement的子类，它的实例对象可以通过调用 Connection.preparedStatement()方法获得，相对于Statement对象而言：==PreperedStatement可以避免SQL注入的问题==。
==Statement会使数据库频繁编译SQL，可能造成数据库缓冲区溢出==。

PreparedStatement可对SQL进行预编译，从而提高数据库的执行效率。并且PreperedStatement对于 sql中的参数，允许使用占位符的形式进行替换，简化sql语句的编写。

### ResultSet 查询的结果集：封装了所有的查询结果

- 获取指定的数据类型

```java
resultSet.getString(); // 不知道数据类型时使用
// 如果知道列的类型就用指定的类型
resultSet.getString();
resultSet.getInt();
resultSet.getFloat();
resultSet.getDouble();
resultSet.getDate();
resultSet.getObject();
// ...
```

- ResultSet还提供了对结果集进行滚动的方法：

```java
resultSet.next(); // 移动到下一行
resultSet.previous(); // 移动到前一行
resultSet.absolute(int row); // 移动到指定行
resultSet.beforeFirst(); // 移动resultSet的最前面。
resultSet.afterLast(); // 移动到resultSet的最后面。
```

- 释放资源

```java
// 6.释放连接
resultSet.close();
statement.close();
connection.close(); // 用完即关掉
```

### JDBC 操作事务

### 数据库连接池

用户每次请求都需要向数据库获得链接，而数据库创建连接通常需要消耗相对较大的资源，创建时间也 较长。假设网站一天10万访问量，数据库服务器就需要创建10万次连接，极大的浪费数据库的资源，并且极易造成数据库服务器内存溢出、拓机。

数据库连接是一种关键的有限的昂贵的资源，这一点在多用户的网页应用程序中体现的尤为突出。对数据库连接的管理能显著影响到整个应用程序的伸缩性和健壮性，影响到程序的性能指标。数据库连接池正式针对这个问题提出来的。**数据库连接池负责分配,管理和释放数据库连接,它允许应用程序重复使用一个现有的 数据库连接,而不是重新建立一个**。

数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，这些数据库连接的数量是由最小数据库连接数来设定的。无论这些数据库连接是否被使用，连接池都将一直保证至少拥有这么多的连接数量。连接池的最大数据库连接数量限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数 超过最大连接数量时，这些请求将被加入到等待队列中。

数据库连接池的最小连接数和最大连接数的设置要考虑到以下几个因素：

1. 最小连接数：是连接池一直保持的数据库连接，所以如果应用程序对数据库连接的使用量不大，将会有大量的数据库连接资源被浪费。
2. 最大连接数：是连接池能申请的最大连接数，如果数据库连接请求超过次数，后面的数据库连接请求将被加入到等待队列中，这会影响以后的数据库操作。
3. 如果最小连接数与最大连接数相差很大：那么最先连接请求将会获利，之后超过最小连接数量的连接请求等价于建立一个新的数据库连接。不过，这些大于最小连接数的数据库连接在使用完不会马上被释放，他将被放到连接池中等待重复使用或是空间超时后被释放。

==编写连接池，需实现java.sql.DataSource接口==。

现在很多WEB服务器(`Weblogic`, `WebSphere`, `Tomcat`)都提供了DataSoruce的实现，即连接池的实现。 **通常我们把DataSource的实现，按其英文含义称之为数据源，数据源中都包含了数据库连接池的实 现**。

也有一些开源组织提供了数据源的独立实现：

- DBCP 数据库连接池
- C3P0 数据库连接池
- Druid 数据库连接池 —— 阿里巴巴

# Ref

- [狂神说笔记——MySQL快速入门12](https://www.cnblogs.com/gh110/p/15153660.html)
- [JDBC核心技术(上)](https://www.cnblogs.com/gh110/p/13282302.html)
- [JDBC核心技术(下)](https://www.cnblogs.com/gh110/p/13282301.html)
