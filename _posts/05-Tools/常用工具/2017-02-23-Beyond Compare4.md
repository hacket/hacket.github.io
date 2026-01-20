---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 3:00:05 pm
title: Beyond Compare4
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
image-auto-upload: true
feed: show
format: list
date created: 2024-12-23 23:41
date updated: 2024-12-27 23:57
aliases: [Beyond Compare4]
linter-yaml-title-alias: Beyond Compare4
---

# Beyond Compare4

## BC 4.3.7 Windows

- Windows 亲测可用

<https://blog.csdn.net/ShelleyLittlehero/article/details/109058062>

## BC 在 Mac OS 系统下永久试用

1. **原理**

Beyond Compare 每次启动后会先检查注册信息，试用期到期后就不能继续使用。解决方法是在启动前，先删除注册信息，然后再启动，这样就可以永久免费试用了。

2. **下载**

首先 [下载Beyond Compare](https://www.scootersoftware.com/download.php) 最新版本，链接如下：。

3. **安装**

下载完成后，直接安装。

4. **创建 BCompare 文件**
   1. 进入 Mac 应用程序目录下，找到刚刚安装好的 Beyond Compare，路径如下 `/Applications/Beyond Compare.app/Contents/MacOS`。
   2. 修改启动程序文件 BCompare 为 BCompare.real。
   3. 在当前目录下新建一个文件 BCompare，文件内容如下：

```shell
#!/bin/bash
rm "/Users/$(whoami)/Library/Application Support/Beyond Compare/registry.dat"
"`dirname "$0"`"/BCompare.real $@
```

5. **保存 BCompare 文件。**
6. **修改文件的权限：**

`chmod a+x /Applications/Beyond\ Compare.app/Contents/MacOS/BCompare`

7. 以上步骤完成后，再次打开 Beyond Compare 就可以正常使用了。

# BC 操作

## 文件夹对比，不对比时间戳

![ny87c](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ny87c.png)
