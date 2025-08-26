---
banner: 
date_created: Friday, June 6th 2022, 12:52:24 am
date_updated: Friday, June 6th 2025, 1:10:10 am
title: Battery Historian
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
aliases: [Battery Historian]
linter-yaml-title-alias: Battery Historian
---

# Battery Historian

Battery Historian 是一个检查电池相关的信息和事件的工具，支持 Android 5.0 (API 21) 和更高版本的 Android 设备。

它是一个 go 开发的 web 服务形式的工具，需要运行在 docker 内由于无法访问 ~~[gcr.io](https://gcr.io)~~ 的 docker 镜像，这里使用别人 dockerhub 编译好的镜像 [runcare/battery-historian](https://hub.docker.com/r/runcare/battery-historian)

```shell
# 1、安装docker（如果已安装跳过此步骤）
# 2、执行命令：
docker run -it -d -p 9999:9999 runcare/battery-historian --port 9999
# 3、访问 http://localhost:9999/；需要注意防火墙，特别是通过Docker Desktop run的可能访问不了，用docker run命令方式没问题
```

访问 `http://localhost:9999` 就可以打开页面，可以上传上面生成的报告 zip 文件进行分析。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506060108662.png)

除了使用 docker 快速运行以外，也可以在本地编译。

这个工具主要是用于分析电池功耗相关的数据，对系统异常等信息没有显示。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506060109971.png)
