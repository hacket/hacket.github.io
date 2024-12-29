---
date created: 2024-11-19 14:56
date updated: 2024-12-26 00:18
dg-publish: true
---

# Maven 基础

## POM 和 GAV

### 什么是 POM？

POM（Project Object Model），项目对象模型。<br>Maven 把一个项目的结构和内容抽象成一个模型，在 xml 文件中进行声明，`pom.xml` 就是这个模型文件。

Pom. Xml 文件中声明了当前项目的坐标，引入的依赖，打包的方式，以及 maven 管理使用到的插件等配置信息，是 maven 项目的核心配置文件。

### 什么是 GAV？ - 坐标

1. GroupId 、artifactId 、version 三个元素生成了一个 Maven 项目的基本坐标，在众多的 maven 项目中可以唯一定位到某一个项目。
2. 坐标也决定着将来项目在仓库中的路径及名称。坐标是资源的唯一标识。坐标的组成是由 `groupId`、`artifactId`、`version` 组成，简称 gav。

```xml
<groupId>com.northcastle</groupId>
<artifactId>HelloWorld</artifactId>
<version>1.0-SNAPSHOT</version>
```

- `groupId`

组织名称，代码。公司、团体或单位的标识。<br>这个值常常使用公司域名的倒写。也可以是公司域名的倒写+项目名称。【组织名称是唯一的】
例如 ：

```
com.google
com.google.guava
```

- `artifactId`

项目名称，如果 groupId 中有项目名称了，则此处是子项目名称。<br>【项目名是唯一的】

- `version`

项目的版本号：一般由三位数字组成。例如 ： 主版本号. 次版本号. 小版本号，1.1.2<br>【注意】当版本号中存在-SNAPSHOT 时，表示当前版本仍在开发中，为不稳定版本。

## 上哪儿去找 GAV

maven 中央仓库的坐标是 ： `https://mvnrepository.com`
