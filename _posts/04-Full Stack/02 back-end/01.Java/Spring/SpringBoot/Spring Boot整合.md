---
date created: 2024-11-22 08:39
date updated: 2024-12-26 00:12
tags:
  - '#{id}")'
dg-publish: true
---

# Spring Boot 整合 junit

回顾 `Spring` 整合 `junit`：

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class UserServiceTest {
    
    @Autowired
    private BookService bookService;
    
    @Test
    public void testSave(){
        bookService.save();
    }
}
```

使用 `@RunWith` 注解指定运行器，使用 `@ContextConfiguration` 注解来指定配置类或者配置文件。

而 `SpringBoot` 整合 `junit` 特别简单，分为以下三步完成

- 在测试类上添加 `SpringBootTest` 注解
- 使用 `@Autowired` 注入要测试的资源
- 定义测试方法进行测试

目录结构：
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202411220840452.png)

编写测试类：在 `test/java` 下创建 `com.example` 包，在该包下创建测试类，将 `BookService` 注入到该测试类中

```java
@SpringBootTest(classes = Springboot07TestApplication.class)  
class Springboot07TestApplicationTests {  
  
    @Autowired  
    private BookService bookService;  
  
    @Test  
    public void save() {  
        bookService.save();  
    }  
}
```

==注意：==这里的引导类所在包必须是测试类所在包及其子包。

例如：

- 引导类所在包是 `com.example`
- 测试类所在包是 `com.example`

如果不满足这个要求的话，就需要在使用 `@SpringBootTest` 注解时，使用 `classes` 属性指定引导类的字节码对象。如 `@SpringBootTest(classes = Springboot07TestApplication.class)`

# Spring Boot 整合 MyBatis

## 回顾Spring整合Mybatis

`Spring` 整合 `Mybatis` 需要定义很多配置类

### SpringConfig 配置类

- 导入 `JdbcConfig` 配置类
- 导入 `MybatisConfig` 配置类

```java
@Configuration
@ComponentScan("com.example")
@PropertySource("classpath:jdbc.properties")
@Import({JdbcConfig.class, MyBatisConfig.class})
public class SpringConfig {
}
```

### JdbcConfig 配置类

- 定义数据源（加载 properties 配置项：driver、url、username、password）

```java
public class JdbcConfig {
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String userName;
    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource getDataSource(){
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
    }
}
```

### MybatisConfig 配置类

- 定义 `SqlSessionFactoryBean`
- 定义映射配置

```java
@Bean
public MapperScannerConfigurer getMapperScannerConfigurer(){
    MapperScannerConfigurer msc = new MapperScannerConfigurer();
    msc.setBasePackage("com.example.dao");
    return msc;
}
@Bean
public SqlSessionFactoryBean getSqlSessionFactoryBean(DataSource dataSource){
    SqlSessionFactoryBean ssfb = new SqlSessionFactoryBean();
    ssfb.setTypeAliasesPackage("com.example.domain");
    ssfb.setDataSource(dataSource);
    return ssfb;
}
```

## Spring Boot 整合 MyBatis

### 整体目录结构

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202411220906810.png)

### pom.xml 引入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
    </parent>
    <artifactId>springboot_08_mybatis</artifactId>
    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.0</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.16</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 定义实体类

```java
package com.example.domain;

public class Book {
    private Integer id;
    private String name;
    private String type;
    private String description;
    // getters/setters
}
```

### 定义dao接口

```java
package com.example.dao;

import com.example.domain.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookDao {
    @Select("select * from book where id = #{id}")
    public Book getById(Integer id);
}
```

### 编写配置 application.yaml

```yaml
spring:  
  datasource:  
    driver-class-name: com.mysql.cj.jdbc.Driver  
    url: jdbc:mysql://localhost:3306/mybatis?serverTimezone=UTC  
    username: root  
    password: roots？   
    type: com.alibaba.druid.pool.DruidDataSource
```

### 定义测试类

在 `test/java` 下定义包 `com.example`，在该包下测试类，内容如下：

```java
@SpringBootTest
class Springboot08MybatisApplicationTests {

	@Autowired
	private BookDao bookDao;

	@Test
	void testGetById() {
		Book book = bookDao.getById(1);
		System.out.println(book);
	}
}
```

### 使用Druid数据源

`SpringBoot` 有默认的数据源，我们也可以指定使用 `Druid` 数据源，按照以下步骤实现：

- 导入 `Druid` 依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>
```

- 在 `application.yml` 配置文件配置: 可以通过 `spring.datasource.type` 来配置使用什么数据源。配置文件内容可以改进为

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mybatis?serverTimezone=UTC
    username: root
    password: root
    type: com.alibaba.druid.pool.DruidDataSource
```
