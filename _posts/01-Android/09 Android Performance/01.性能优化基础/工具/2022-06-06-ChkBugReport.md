---
banner: 
date_created: Friday, June 6th 2022, 12:52:24 am
date_updated: Monday, June 9th 2025, 12:09:09 am
title: ChkBugReport
author: hacket
categories:
  - 性能优化
category: 性能优化工具
tags: [性能优化, 性能优化工具]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
aliases: [ChkBugReport]
linter-yaml-title-alias: ChkBugReport
---

# ChkBugReport

## ChkBugReport 编译

官方地址：<https://github.com/sonyxperiadev/ChkBugReport>

这是索尼使用 java 开发的一款专门解析 `bugreport` 报告的命令行工具。它是一个 gradle 项目，我们需要编译才可以得到命令行工具

```shell
git clone https://github.com/sonyxperiadev/ChkBugReport.git
cd ChkBugReport/core
./gradlew assemble

cd build/distributions
unzip ChkBugReport.zip
cd ChkBugReport
```

编译产物如下：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506060053850.png)

## 使用

选择对应的平台的命令行，window 使用 .bat 文件

```shell
ChkBugReport.bat bugreport-PHP110-UKQ1.230924.001-2025-05-20-00-03-53.zip
```

这样可以直接解析日志报告文件，并生成 html 报告到 `bugreport-PHP110-UKQ1.230924.001-2025-05-20-00-03-53_out` 文件夹

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506060053851.png)

打开 index. html，就可以快速查看各种 log、ANR、错误等等信息

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506060053853.png)

### Errors

比较明显的异常崩溃等信息会在 Error 中展示，点击 `link to log` 查看详情

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506090005853.png)

可以通过日志信息分析出来错误原因，对应的修复即可。
