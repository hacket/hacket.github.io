---
date_created: Wednesday, August 28th 2024, 12:37:33 am
date_updated: Saturday, February 1st 2025, 12:49:57 am
title: Burp Suite Intruder 模块
author: hacket
categories:
  - 计算机基础
category: 安全
tags: [BurpSuite, 安全]
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
date created: 2024-12-26 00:18
date updated: 2024-12-26 00:18
aliases: [Intruder 模块]
linter-yaml-title-alias: Intruder 模块
---

# Intruder 模块

## Intruder 介绍

`Intruder` 是一个用于对网络应用程序进行自动化定制攻击的工具。能够配置攻击参数，反复发送相同的 HTTP 请求，根据不同的攻击方式，每次在预定义的位置插入不同的 payload 发送请求。

## Intruder 使用

将请求发送到 `Intruder` 后，可以选择攻击类型以及要攻击的参数。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280039380.png)

然后在 Payloads 的页面中配置要使用的攻击负载类型，添加常见的攻击负载（社区版只能手动添加，专业版可以直接上传文件）。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280039085.png)

然后点击 start attack 开始发送请求攻击，并弹出一个对应的响应列表，供使用者查看。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280039286.png)
