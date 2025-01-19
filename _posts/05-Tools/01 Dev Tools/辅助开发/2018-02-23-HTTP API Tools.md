---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:49:50 am
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

在 Postman 中，一个完整的 Postman 请求生命周期，除了常规的请求（request）和响应（response），还包括前置请求脚本（pre-request script）和后置测试脚本（tests script）。Postman 包含一个基于 Node.js 的强大运行态（runtime），允许用户在 pre-request script 和 tests 事件中编写 JavaScript 代码。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702300028713-eb2eb49f-8a64-489d-92cf-882f75ffb1d2.png#averageHue=%23282828&clientId=u24c581cf-c91c-4&from=paste&height=143&id=u25a7fa5b&originHeight=193&originWidth=800&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32759&status=done&style=none&taskId=u2d4c788a-980a-4183-9f6b-57fbb0a0b22&title=&width=591)

### pre-request script

前置请求脚本（pre-request script）顾名思义就是在请求发送之前执行的脚本。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702300065366-ee5a30ad-270f-43d8-a3b6-7ac43eb3aad6.png#averageHue=%23f6f5f5&clientId=u24c581cf-c91c-4&from=paste&height=172&id=u991d151e&originHeight=344&originWidth=800&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83998&status=done&style=none&taskId=uf2e67157-2f0a-4282-b9ef-e02014116ac&title=&width=400)

### 请求

### 在测试（tests）中使用脚本

Postman 支持在请求响应后通过测试脚本来验证请求是否符合预期。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702300114900-065873fe-c232-4558-a83b-14d47d129c93.png#averageHue=%23f8f8f7&clientId=u24c581cf-c91c-4&from=paste&height=235&id=uf8bb863b&originHeight=469&originWidth=800&originalType=binary&ratio=2&rotation=0&showTitle=false&size=142251&status=done&style=none&taskId=u8704867d-892e-4416-bc39-6926310ee5a&title=&width=400)<br>示例一：验证响应状态码是否是 200：

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

从 charles 等抓包工具中请求地址复制为 CURL 粘贴至 postman 可直接生成接口请求<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693128981770-e8049211-22cf-4e93-be18-2bd1a77372cf.png#averageHue=%23b2b1b1&clientId=u3da8516b-bb71-4&from=paste&height=726&id=u37ecfbd3&originHeight=1452&originWidth=2194&originalType=binary&ratio=2&rotation=0&showTitle=false&size=248212&status=done&style=none&taskId=u4d439da0-2971-4c99-997e-7a09bedcc18&title=&width=1097)

## 变量

### 变量介绍

在测试过程中，经常要切换测试环境，本地环境、开发环境、测试环境、灰度环境等。<br>不同的环境一般就是 URI 不一样而已，也就是 IP、端口号会变；接口的路径和值基本是不变的。<br>Postman 允许用户在发送和接收时 [使用变量](https://link.segmentfault.com/?enc=sFhtt9Cx5FfhoEyCljWUFg%3D%3D.oxVHEJkBIvZwdEtjnC8%2FxvaO%2FPZcAQg4%2FKV8JIT1VMRzzBWutAI7DjE6s9YvBeRH%2FY4J%2B2%2Bx7TSj8eVQ9udPOA%3D%3D)，以提高工作效率和可读性（不过只能保存字符串类型的值，所以复杂数据类型需要借助于 `JSON.stringify()` 和 `JSON.parse()` 来管理）。<br>Postman 支持在不同的作用域和上下文中使用变量，遵循就近原则，即如果在 Global 和 Environment 中都有变量 name，则会取 Environment 中的 name。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702281798217-14950a2d-7716-4389-a0ed-283ed1e6ba8d.png#averageHue=%23f5f5f5&clientId=u24c581cf-c91c-4&from=paste&height=192&id=u1435d152&originHeight=384&originWidth=400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24642&status=done&style=none&taskId=u1b0648d3-bedc-4ba7-87fc-34a4702ff39&title=&width=200)

### 变量应用

URL、Params、Authorization、Headers 和 Body 都可以使用环境变量

### 变量引用

语法：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501170034229.png)

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

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702287393971-6ab41d0d-a92d-47a1-9c61-efbb8aa6d2c1.png#averageHue=%23f8f0ee&clientId=u24c581cf-c91c-4&from=paste&height=300&id=u0aa37ed0&originHeight=599&originWidth=553&originalType=binary&ratio=2&rotation=0&showTitle=false&size=192317&status=done&style=none&taskId=ude76260f-e06e-4479-9a57-f0e92eb91df&title=&width=276.5)

#### GUI

![](https://segmentfault.com/img/remote/1460000039825326#id=W39ER&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 全局变量

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702299794962-3825b0d2-b9b7-48a4-aad4-8bc58b598ef6.png#averageHue=%23272727&clientId=u24c581cf-c91c-4&from=paste&height=482&id=u8274ed25&originHeight=964&originWidth=1418&originalType=binary&ratio=2&rotation=0&showTitle=false&size=105475&status=done&style=none&taskId=uf266bbef-24fd-447a-bd36-ca7e7cb5690&title=&width=709)

- 环境变量

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702299835528-fba9a700-e6e4-47a6-98e6-855ea7a6523b.png#averageHue=%23292828&clientId=u24c581cf-c91c-4&from=paste&height=321&id=u86869388&originHeight=642&originWidth=1512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96721&status=done&style=none&taskId=udcb3f8bd-dd4c-44f0-a2d2-52f08625f18&title=&width=756)

- Collection 变量

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702299911543-88fdcc4b-cb55-43e2-8ed6-d48656e32260.png#averageHue=%23262626&clientId=u24c581cf-c91c-4&from=paste&height=392&id=udf8ba0b1&originHeight=784&originWidth=2398&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151894&status=done&style=none&taskId=ud0ac50d2-bc75-45cf-959e-a7e2de2dde4&title=&width=1199)

#### 代码设置 Tests

定义全局变量：`pm.globals.set("变量名",变量值)`

<br>定义环境变量：`pm.environment.set("变量名",变量值)`<br>

定义集合变量：`pm.collectionVariables.set("变量名",变量值)`

```shell
pm.globals.set("token1", "token1 value")

pm.environment.set("tokenxx", "tokenxx value")

pm.collectionVariables.set("tokencollect", "token collect value")
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702281315731-836041c4-25e5-4603-b5f7-c6b5052a729c.png#averageHue=%23fcfcfb&clientId=u24c581cf-c91c-4&from=paste&height=392&id=afolq&originHeight=784&originWidth=1306&originalType=binary&ratio=2&rotation=0&showTitle=false&size=100522&status=done&style=none&taskId=u64b51544-66c4-44da-b533-016ed06d4a3&title=&width=653)

### 环境变量

#### 多环境配置和应用

- 新增环境

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702277455574-4670daac-c03b-4922-b470-3ee698cec2e3.png#averageHue=%23fbfaf9&clientId=u24c581cf-c91c-4&from=paste&height=497&id=u9a29d11c&originHeight=994&originWidth=3582&originalType=binary&ratio=2&rotation=0&showTitle=false&size=241174&status=done&style=none&taskId=u8bf3489d-533f-4867-abc9-c244037bbd8&title=&width=1791)

- api 接口替换

用![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501170034229.png)来替换，这里我们是替换 host<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702277484619-0769849c-841e-4366-81b7-b2231b5d6da5.png#averageHue=%23f6f6f5&clientId=u24c581cf-c91c-4&from=paste&height=95&id=u817dac0d&originHeight=190&originWidth=620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=22207&status=done&style=none&taskId=ub12cde30-062c-4e23-baf1-feb9c7a8456&title=&width=310)

#### 导入环境配置

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702278772220-06d1c089-84b2-456e-b4fb-c577525bc1a4.png#averageHue=%23f6f5f5&clientId=u24c581cf-c91c-4&from=paste&height=482&id=ua0594586&originHeight=1296&originWidth=740&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96580&status=done&style=none&taskId=udf692473-aa04-4b7e-b119-ecafa49cc3a&title=&width=275)<br>下载的配置，是一个 json 串的文件，里面的内容是和网页版的配置相对应的，都是 key-value

### 全局变量

一般啥时候用全局变量，比如 token 保持登录态就要用全局变量。

- 添加全局变量

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702280918685-40b3b567-20b4-4a80-8204-a89f1a26a05c.png#averageHue=%23f9f9f8&clientId=u24c581cf-c91c-4&from=paste&height=366&id=udc1c2e21&originHeight=732&originWidth=3470&originalType=binary&ratio=2&rotation=0&showTitle=false&size=212329&status=done&style=none&taskId=uc9d6011f-3792-4ebe-a529-3bc80cfc907&title=&width=1735)

- 使用

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1702280939153-387d1f65-a9da-4c6d-8baf-ea4c617bf32b.png#averageHue=%23faf9f9&clientId=u24c581cf-c91c-4&from=paste&height=500&id=u63378609&originHeight=1000&originWidth=1944&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155736&status=done&style=none&taskId=u620aac61-b262-4035-8421-2e6618edf26&title=&width=972)

### 动态变量？Tests？

## 使用 Postman 抓包

## Ref

- [x] [Postman 环境变量的使用](https://apifox.com/apiskills/using-postman-environment/)
- [x] [Postman环境变量以及设置token全局变量](https://zhuanlan.zhihu.com/p/521664294)
- [x] [Postman 使用小技巧/指南](https://segmentfault.com/a/1190000039825314)

# ApiFox
