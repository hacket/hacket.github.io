---
date created: 2024-12-25 23:54
date updated: 2024-12-25 23:54
dg-publish: true
---

# mysql 模块

<https://github.com/mysqljs/mysql>

## 安装

```shell
cnpm install mysql
```

## 连接数据库

数据库连接参数说明：

| 参数                 | 描述                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------- |
| host               | 主机地址 （默认：localhost）                                                                |
| user               | 用户名                                                                                |
| password           | 密码                                                                                 |
| port               | 端口号 （默认：3306）                                                                      |
| database           | 数据库名                                                                               |
| charset            | 连接字符集（默认：'UTF8_GENERAL_CI'，注意字符集的字母都要大写）                                           |
| localAddress       | 此IP用于TCP连接（可选）                                                                     |
| socketPath         | 连接到unix域路径，当使用 host 和 port 时会被忽略                                                   |
| timezone           | 时区（默认：'local'）                                                                     |
| connectTimeout     | 连接超时（默认：不限制；单位：毫秒）                                                                 |
| stringifyObjects   | 是否序列化对象                                                                            |
| typeCast           | 是否将列值转化为本地JavaScript类型值 （默认：true）                                                  |
| queryFormat        | 自定义query语句格式化方法                                                                    |
| supportBigNumbers  | 数据库支持bigint或decimal类型列时，需要设此option为true （默认：false）                                 |
| bigNumberStrings   | supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回（默认：false） |
| dateStrings        | 强制timestamp,datetime,data类型以字符串类型返回，而不是JavaScript Date类型（默认：false）                 |
| debug              | 开启调试（默认：false）                                                                     |
| multipleStatements | 是否许一个query中有多个MySQL语句 （默认：false）                                                   |
| flags              | 用于修改连接标志                                                                           |
| ssl                | 使用ssl参数（与crypto.createCredenitals参数格式一至）或一个包含ssl配置文件名称的字符串，目前只捆绑Amazon RDS的配置文件    |

示例：

```javascript
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
```

## CURD

### <br />
