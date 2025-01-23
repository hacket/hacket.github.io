---
date_created: Wednesday, August 28th 2024, 12:21:23 am
date_updated: Wednesday, January 22nd 2025, 11:15:20 pm
title: Burp Suite 其它模块
author: hacket
categories:
  - 计算机基础
category: 安全
tags: [抓包, BurpSuite]
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
date created: 2024-08-28 00:34
date updated: 2024-12-26 00:18
aliases: [Repeater]
linter-yaml-title-alias: Repeater
---

# Repeater

Burp Repeater 能够修改并反复发送一个 HTTP 或 WebSocket 消息。

在拦截到请求时点击 Action -> Send to Repeater, 拦截的请求会被发送到 Repeater 中（可以发送多个请求到 Repeater 中）。在 Repeater 里，可以任意修改请求内容，并且查看对应的响应。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280032945.png)

而且，在请求或响应中选择的对应文本，会直接显示在 Inspector 中，伴随显示解码后的文本，解码类型有四种 `URL encoding`, `HTML encoding`, `Base 64`, `Base 64 URL`。

# Sequencer

Sequencer 用来生成随机数和伪随机数，可以帮助分析分析 token 样本中的随机性质量。token 可以是 `Session tokens`, `Anti-CSRF tokens`, `Password reset tokens` 等旨在保持不可预测性的令牌。

将包含会话信息的请求转发到 `Sequencer` 中，

- `Token Location Within Response` 会自动识别 token，也可以自己选择想要分析的 token；
- `Live Capture Options` 可以控制线程数量和请求的限制速率等。设置好上述两个部分，就可以点击 `Start live capture` 来分析对应的 token 了。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280034586.png)

Burp Suite 会产生另一个页面来分析 token 的指标，有效熵、可靠性等，还有字符级别和位级别的分析。不点击 stop，样本量会无限增长，可以在 Auto analyze 旁边的 next 知道这一阶段的目标样本量。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280035895.png)

# Comparer

Comparer 可以比较识别出请求或响应之间的微妙差异，也可以比较任何两个数据项。

拦截请求后发送给 Comparer，请求会自动复制到 Comparer 的列表上，在上下两个部分分别选择两个不同的选项，并在右下角选择比较单词还是字节。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280036260.png)

弹出的弹窗里会自动进行左右两边的对比，像 diff 一样将右边与左边对比修改，删除和增加的各项。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280036798.png)

拦截请求只能将请求进行对比，如果想对比响应的话，需要自己复制粘贴到列表中，选择后也可以进行对比。
