---
date created: 2024-11-21 00:09
date updated: 2024-12-26 00:12
tags:
  - '#开发'
  - '#给开发环境起的名字'
  - '#生产'
  - '#给生产环境起的名字'
  - '#测试'
  - '#给测试环境起的名字'
  - '#设置启用的环境'
  - '#表示使用的是开发环境的配置'
dg-publish: true
---

# yaml 基础

## yaml格式

**YAML（YAML Ain't Markup Language），一种数据序列化格式。** 这种格式的配置文件在近些年已经占有主导地位，那么这种配置文件和前期使用的配置文件是有一些优势的，我们先看之前使用的配置文件。

最开始我们使用的是 `xml` ，格式如下：

```xml
<enterprise>
    <name>itcast</name>
    <age>16</age>
    <tel>4006184000</tel>
</enterprise>
```

而 `properties` 类型的配置文件如下:

```properties
enterprise.name=itcast
enterprise.age=16
enterprise.tel=4006184000
```

`yaml` 类型的配置文件内容如下:

```yaml
enterprise:
	name: itcast
	age: 16
	tel: 4006184000
```

**优点：**

- 容易阅读： `yaml` 类型的配置文件比 `xml` 类型的配置文件更容易阅读，结构更加清晰
- 容易与脚本语言交互
- 以数据为核心，重数据轻格式：`yaml` 更注重数据，而 `xml` 更注重格式

**YAML 文件扩展名：**

- `.yml` (主流)
- `.yaml`

上面两种后缀名都可以，以后使用更多的还是 `yml` 的。

## 语法规则

- 大小写敏感
- 属性层级关系使用多行描述，每行结尾使用冒号结束
- 使用缩进表示层级关系，同层级左侧对齐，只允许使用空格（不允许使用Tab键）
  空格的个数并不重要，只要保证同层级的左侧对齐即可。
- 属性值前面添加空格（属性名与属性值之间使用冒号+空格作为分隔）
- `#` 表示注释

==核心规则：数据前面要加空格与冒号隔开==

数组数据在数据书写位置的下方使用减号作为数据开始符号，每行书写一个数据，减号与数据间空格分隔，例如

```yaml
enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

## yaml配置文件数据读取

### 读取配置数据

在 `resources` 下创建一个名为 `application.yml` 的配置文件，里面配置了不同的数据，内容如下:

```yaml
lesson: SpringBoot

server:
  port: 80

enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

#### 使用 @Value注解

使用 `@Value("表达式")` 注解可以从配合文件中读取数据，注解中用于读取属性名引用方式是：`${一级属性名.二级属性名……}`

```java
@RestController
@RequestMapping("/books")
public class BookController {
    
    @Value("${lesson}")
    private String lesson;
    @Value("${server.port}")
    private Integer port;
    @Value("${enterprise.subject[0]}")
    private String subject_00;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(lesson);
        System.out.println(port);
        System.out.println(subject_00);
        return "hello , spring boot!";
    }
}
```

#### Environment对象

`@Value`方式读取到的数据特别零散，`SpringBoot` 还可以使用 `@Autowired` 注解注入 `Environment` 对象的方式读取数据。这种方式 `SpringBoot` 会将配置文件中所有的数据封装到 `Environment` 对象中，如果需要使用哪个数据只需要通过调用 `Environment` 对象的 `getProperty(String name)` 方法获取。具体代码如下：

```java
@RestController
@RequestMapping("/books")
public class BookController {
    
    @Autowired
    private Environment env;
    
    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(env.getProperty("lesson"));
        System.out.println(env.getProperty("enterprise.name"));
        System.out.println(env.getProperty("enterprise.subject[0]"));
        return "hello , spring boot!";
    }
}
```

==注意：这种方式，框架内容大量数据，而在开发中我们很少使用。==

#### 自定义对象

`SpringBoot` 还提供了将配置文件中的数据封装到我们自定义的实体类对象中的方式。具体操作如下：

- 将实体类 `bean` 的创建交给 `Spring` 管理。
  在类上添加 `@Component` 注解
- 使用 `@ConfigurationProperties` 注解表示加载配置文件
  在该注解中也可以使用 `prefix` 属性指定只加载指定前缀的数据
- 在 `BookController` 中进行注入

**示例：**

`Enterprise` 实体类内容如下：

```java
@Component
@ConfigurationProperties(prefix = "enterprise")
public class Enterprise {
    private String name;
    private int age;
    private String tel;
    private String[] subject;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String[] getSubject() {
        return subject;
    }

    public void setSubject(String[] subject) {
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "Enterprise{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", tel='" + tel + '\'' +
                ", subject=" + Arrays.toString(subject) +
                '}';
    }
}
```

`BookController` 内容如下：

```java
@RestController
@RequestMapping("/books")
public class BookController {
    
    @Autowired
    private Enterprise enterprise;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(enterprise.getName());
        System.out.println(enterprise.getAge());
        System.out.println(enterprise.getSubject());
        System.out.println(enterprise.getTel());
        System.out.println(enterprise.getSubject()[0]);
        return "hello , spring boot!";
    }
}
```

==注意：==
使用这种方式，在实体类上有如下警告提示
![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202411210019525.png)
这个警告提示解决是在 `pom.xml` 中添加如下依赖即可

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

## 多环境配置

在工作中，对于开发环境、测试环境、生产环境的配置肯定都不相同，比如我们开发阶段会在自己的电脑上安装 `mysql` ，连接自己电脑上的 `mysql` 即可，但是项目开发完毕后要上线就需要该配置，将环境的配置改为线上环境的。

### yaml 多环境配置支持

来回的修改配置会很麻烦，而 `SpringBoot` 给开发者提供了多环境的快捷配置，需要切换环境时只需要改一个配置即可。不同类型的配置文件多环境开发的配置都不相同，接下来对不同类型的配置文件进行说明

在 `application.yml` 中使用 `---` 来分割不同的配置，内容如下

```yaml
#开发
spring:
  profiles: dev #给开发环境起的名字
server:
  port: 80
---
#生产
spring:
  profiles: pro #给生产环境起的名字
server:
  port: 81
---
#测试
spring:
  profiles: test #给测试环境起的名字
server:
  port: 82
---
```

上面配置中 `spring.profiles` 是用来给不同的配置起名字的。而如何告知 `SpringBoot` 使用哪段配置呢？可以使用如下配置来启用都一段配置

```yaml
#设置启用的环境
spring:
  profiles:
    active: dev  #表示使用的是开发环境的配置
```

综上所述，`application.yml` 配置文件内容如下

```yaml
#设置启用的环境
spring:
  profiles:
    active: dev

---
#开发
spring:
  profiles: dev
server:
  port: 80
---
#生产
spring:
  profiles: pro
server:
  port: 81
---
#测试
spring:
  profiles: test
server:
  port: 82
---
```

==注意：== 在上面配置中给不同配置起名字的 `spring.profiles` 配置项已经过时。最新用来起名字的配置项是

```yaml
#开发
spring:
  config:
    activate:
      on-profile: dev
```

### properties 文件多环境配置支持

`properties` 类型的配置文件配置多环境需要定义不同的配置文件

- `application-dev.properties` 是开发环境的配置文件。我们在该文件中配置端口号为 `80`

```properties
server.port=80  
```

- `application-test.properties` 是测试环境的配置文件。我们在该文件中配置端口号为 `81`

```properties
server.port=81  
```

- `application-pro.properties` 是生产环境的配置文件。我们在该文件中配置端口号为 `82`

```properties
server.port=82  
```

`SpringBoot` 只会默认加载名为 `application.properties` 的配置文件，所以需要在 `application.properties` 配置文件中设置启用哪个配置文件，配置如下:

```properties
spring.profiles.active=pro  
```
