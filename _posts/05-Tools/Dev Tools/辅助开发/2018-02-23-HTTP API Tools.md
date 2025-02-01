---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 2:56:33 pm
title: HTTP API Tools
author: hacket
categories:
  - Tools
category: DevTools
tags: [辅助开发工具]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: Tuesday, December 10th 2024, 11:46:00 pm
date updated: Friday, January 17th 2025, 12:34:58 am
image-auto-upload: true
feed: show
format: list
aliases: [API 接口管理工具]
linter-yaml-title-alias: API 接口管理工具
---

# API 接口管理工具

- YApi

YApi 是一个可本地部署的、打通前后端及 QA 的、可视化的接口管理平台 [https://yapi.ymfe.org](https://yapi.ymfe.org/)<br><https://yapi.ymfe.org/><br><https://github.com/YMFE/yapi>

- 小幺鸡

开源的 api 管理工具<br><http://www.xiaoyaoji.cn/>

- Apifox
- swagger
- Postwoman (hoppscotch)
- Postamn

# Postman

## Postman 请求生命周期

在 Postman 中，一个完整的 Postman 请求生命周期，除了常规的请求（request）和响应（response），还包括前置请求脚本（pre-request script）和后置测试脚本（tests script）。Postman 包含一个基于 Node.js 的强大运行态（runtime），允许用户在 pre-request script 和 tests 事件中编写 JavaScript 代码。<br>![kniff](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/kniff.png)

### pre-request script

前置请求脚本（pre-request script）顾名思义就是在请求发送之前执行的脚本。<br>![nmo5d](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/nmo5d.png)

### 请求

### 在测试（tests）中使用脚本

Postman 支持在请求响应后通过测试脚本来验证请求是否符合预期。<br>![3fegf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/3fegf.png)<br>示例一：验证响应状态码是否是 200：

```javascript
pm.test("Status test", function () {
    pm.response.to.have.status(200);
});
```

示例二：验证返回的业务数据（JSON）是否符合预期：

```javascript
pm.test("请求成功！", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql('success');
});
```

## 导入 curl 生成请求接口

从 charles 等抓包工具中请求地址复制为 CURL 粘贴至 postman 可直接生成接口请求<br>![bviv3](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/bviv3.png)

## 变量

### 变量介绍

在测试过程中，经常要切换测试环境，本地环境、开发环境、测试环境、灰度环境等。<br>不同的环境一般就是 URI 不一样而已，也就是 IP、端口号会变；接口的路径和值基本是不变的。<br>Postman 允许用户在发送和接收时 [使用变量](https://link.segmentfault.com/?enc=sFhtt9Cx5FfhoEyCljWUFg%3D%3D.oxVHEJkBIvZwdEtjnC8%2FxvaO%2FPZcAQg4%2FKV8JIT1VMRzzBWutAI7DjE6s9YvBeRH%2FY4J%2B2%2Bx7TSj8eVQ9udPOA%3D%3D)，以提高工作效率和可读性（不过只能保存字符串类型的值，所以复杂数据类型需要借助于 `JSON.stringify()` 和 `JSON.parse()` 来管理）。<br>Postman 支持在不同的作用域和上下文中使用变量，遵循就近原则，即如果在 Global 和 Environment 中都有变量 name，则会取 Environment 中的 name。<br>![27o2e](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/27o2e.png)

### 变量应用

URL、Params、Authorization、Headers 和 Body 都可以使用环境变量

### 变量引用

语法：

![zchas](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/zchas.png)

### 变量分类

- **Global**：全局变量可以在整个工作空间（Workspace）中使用，因为无法控制使用环境和容易造成混淆，应当是不可变的**全局常量**，谨慎使用。

```
pm.globals.set("variable_key", "variable_value");
pm.globals.get("variable_key");
```

- **Collection**：集合变量在单个集合（Collection）中可用，往往具备通用的业务绑定属性，例如：商品属性、会员等级、通用秘钥等。

```
pm.collectionVariables.set("variable_key", "variable_value");
pm.collectionVariables.get("variable_key");
```

- **Environment**：环境变量允许请求适应不同的环境，例如：本地、测试、预演和生产环境，常常用来区别请求地址。

```
pm.environment.set("variable_key", "variable_value");
pm.environment.get("variable_key");
```

- **Data**: 数据变量来自外部 CSV 和 JSON 文件，当通过 Newman 或 Runner 来运行时才用到。
- **Local**：局部变量只在单个请求生命周期中可用，运行完成后自动销毁。

```
pm.variables.set("variable_key", "variable_value");
pm.variables.get("variable_key");
```

![ejhb5](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ejhb5.png)

#### GUI

![1nzub](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1nzub.png)

- 全局变量

![8b12a](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8b12a.png)

- 环境变量

![dca5k](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/dca5k.png)

- Collection 变量

![z950s](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/z950s.png)

#### 代码设置 Tests

定义全局变量：`pm.globals.set("变量名",变量值)`

<br>定义环境变量：`pm.environment.set("变量名",变量值)`<br>

定义集合变量：`pm.collectionVariables.set("变量名",变量值)`

```shell
pm.globals.set("token1", "token1 value")

pm.environment.set("tokenxx", "tokenxx value")

pm.collectionVariables.set("tokencollect", "token collect value")
```

![ig0eq](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ig0eq.png)

### 环境变量

#### 多环境配置和应用

- 新增环境

![uv2sp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/uv2sp.png)

- api 接口替换

用![5t9rp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/5t9rp.png)来替换，这里我们是替换 host<br>![vd2i7](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/vd2i7.png)

#### 导入环境配置

![v18qs](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/v18qs.png)<br>下载的配置，是一个 json 串的文件，里面的内容是和网页版的配置相对应的，都是 key-value

### 全局变量

一般啥时候用全局变量，比如 token 保持登录态就要用全局变量。

- 添加全局变量

![w08lm](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/w08lm.png)

- 使用

![e0tg1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/e0tg1.png)

### 动态变量？Tests？

## 使用 Postman 抓包

## Ref

- [x] [Postman 环境变量的使用](https://apifox.com/apiskills/using-postman-environment/)
- [x] [Postman环境变量以及设置token全局变量](https://zhuanlan.zhihu.com/p/521664294)
- [x] [Postman 使用小技巧/指南](https://segmentfault.com/a/1190000039825314)

# ApiFox
