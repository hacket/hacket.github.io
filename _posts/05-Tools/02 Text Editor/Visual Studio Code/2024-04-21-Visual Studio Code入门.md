---
date_created: Sunday, April 21st 2024, 2:18:41 pm
date_updated: Sunday, January 19th 2025, 10:01:58 am
title: Visual Studio Code入门
author: hacket
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
categories:
  - VSCode
tags: [vscode]
aliases: ["`VSCode` 基本使用"]
linter-yaml-title-alias: "`VSCode` 基本使用"
---

# `VSCode` 基本使用

## VS Code 常用快捷键，默认（Mac 版本）

将 `VSCode` 的快捷键映射成 JetBrains 系列，下载插件 `JetBrains IDE Keymap` 即可。

- 快速打开文件： `Ctrl+P`
- 打开 Command Palette：`Ctrl+Shift+A` 或 `F1`
- 隐藏侧边栏：`Ctrl+B`
- **分割（Side by side）编辑**: `Ctrl+\`
- **切换到资源管理器窗口（explorer window）**: `Ctrl+Shift+E`

## VS Code 配置好用到爆

如果你正好从别的编辑器转到 VS Code 也完全不用担心，它提供了对应的 Keymap 插件，可以将你的键盘设置迁移过来，帮你快速上手操作，而不用再重新花时间去适应快捷键。

- 配置 <font color="#92d050">XXX Keymap</font> 扩展，我们选 `JetBrains` 的 `keymap`，还有其他相关 JetBrains 扩展
  - `JetBrains IDE Keymap`
  - `JetBrains Icon Theme`
  - `JetBrains Darcula Theme`

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404003139.png)

为每一种语言都提供了很好的支持，将开发中需要用到的 `Extension` 打包成一个合集，基本上开发的时候下载对应的 <font color="#92d050">XXX Extension Package</font> 就可以获得很好的支持。

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404003124.png)

- `Git Extension Pack`
- `Extension Pack for Java`
- `Python Extension Pack`
- `C/C++ Extension Pack`
- `Vue.js Extension Pack`
- `HTML5 extension pack`

## VSCode 官方 Setting Sync

[Settings Sync in Visual Studio Code](https://code.visualstudio.com/docs/editor/settings-sync)

- 开启 Sync Settings 功能

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404222204.png)

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404222301.png)

登录 `github` 账号

## VSCode 修改扩展和用户文件夹目录位置

### Windows

#### 新旧路径建立软联系

```cmd
 mklink /d 链接目录 源目录
```

```cmd
mklink /d "D:\Program Files\VSCode\extensions" "C:\Users\hacket\.vscode\extensions"
mklink /d "D:\Program Files\VSCode\Code" "C:\Users\hacket\AppData\Roaming\Code"
```

修改后 C 盘的文件还是存在

## VSCode 设置

设置入口：`Code→首选项→设置→打开设置(json,settings.json)`<br>VSCode 设置中的设置都是通过**配置文件**实现的没有设置面板，配置文件分为：

1. 系统默认设置
2. 全局配置
3. 工作区配置

### Git

**将 VS Code 设置为默认合并工具：**

```shell
git config --global merge.tool code
```

## VSCode 配置编译环境

### VSCode 配置 C/C++ 环境

[[Visual Studio Code配置C++环境]]

### VSCode 配置 Kotlin 环境

#### 安装 Kotlin Compiler

<https://kotlinlang.org/docs/tutorials/command-line.html>

`Homebrew`

```shell
$ brew update
$ brew install kotlin
```

#### 安装 VSCode 插件

- Code Runner
- Kotlin Language

**Note:** 如果 `Code Runner` 执行中文有乱码，可以更改一下设置<br>在 User Setting 中搜索 `code-runner.executorMap`，在用户自定义右边的窗口加上 `"code-runner.runInTerminal": true`。

# VSCode 技巧

### VSCode 选择文件时打开隐藏文件/文件夹

1. `File→Open Folder`
2. 在目标文件夹，按 `Ctrl+Shift+.` 可以显示出隐藏的文件/文件夹

### **将命令复制粘贴到快速打开中**

键入 `cmd+p` ，然后粘贴想要运行的命令，浏览扩展（插件）市场时尤为适用。

如：

```shell
ext install Java IDE
```
