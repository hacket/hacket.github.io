---
date created: 星期五, 三月 8日 2024, 12:06:00 凌晨
date updated: 星期四, 一月 2日 2025, 9:34:30 晚上
title: Templater
dg-publish: true
image-auto-upload: true
feed: show
format: list
aliases: [Templater 概述]
linter-yaml-title-alias: Templater 概述
---

# Templater 概述

`Templater` 号称 Obsidian 四大金刚之一 (`quickadd`, `dataview`, `obsidian-excalidraw-plugin`), 模板插件当之无愧，但因为模板插件用法很极客基本靠命令代码，很多新手只能用别人写好的模板实现自己需求，入坑门槛比较高。注意此模板插件并非 Obsidian 官方自带的核心模板插件。

Template 中文翻译为 " 模板，范本 "。那插件 Templater 顾名思义就是帮助我们创建模板范本。

下面是插件作者对该插件的介绍：

> [Templater](https://link.zhihu.com/?target=https%3A//github.com/SilentVoid13/Templater) is a template language that lets you insert **variables** and **functions** results into your notes. It will also let you execute JavaScript code manipulating those variables and functions.
> With [Templater](https://link.zhihu.com/?target=https%3A//github.com/SilentVoid13/Templater), you will be able to create powerful templates to automate manual tasks.
> ——引用自 [插件原作者](https://silentvoid13.github.io/Templater/)

翻译：Templater 是一种 template 语言，能够让你插入变量结果和函数结果到你的笔记中。也能让你执行 Javascript 来操作那些变量和函数。使用 Templater，你能够生成功能强大的模板来自动化日常任务。

## Ref

- [GitHub - dmscode/Obsidian-Templates: 我在 Obsidian 中用的各种模板（Dataview，Templater，QuickAdd）](https://github.com/dmscode/Obsidian-Templates)

# Templater 模板示例

## 日报

日报模板

## 目录

将当前目录下所有笔记生成一个目录

- `{{tp.date.now()}}`：插入当前日期和时间。
- `{{tp.date.weekyear()}}`：获取当前年份所属的周年度。
- 自定义格式：`{{tp.date.now("YYYY-MM-DD")}}`。
