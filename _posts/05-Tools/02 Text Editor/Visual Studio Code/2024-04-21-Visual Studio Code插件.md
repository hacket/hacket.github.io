---
date_created: Sunday, April 21st 2024, 2:18:41 pm
date_updated: Sunday, January 19th 2025, 10:01:20 am
title: Visual Studio Code插件
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
aliases: [VSCode 插件]
linter-yaml-title-alias: VSCode 插件
---

# VSCode 插件

## 前端相关插件

### Vue 插件

#### Vetur

VUE 是时下最流行的 js 框架之一，很多公司都会选择基于 VUE 来构建产品，`Vetur` 对 VUE 提供了很好的语言支持。

可识别 `.vue` 文件

没有安装该插件之前之前编写后缀名为 `.vue` 的文件时代码是白色的

安装插件后编写 vue 文件输入 `s`，按 Tab 键就可以自动补全模版。

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-a535f4a1b73399e6.gif)

#### `Vscode-element-helper`

使用 element-ui 库的可以安装这个插件，编写标签时自动提示 element 标签名称。

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-2c9831f44f9834a7.gif)

### Open-in-browser 在浏览器中查看

VS Code 没有提供直接在浏览器中运行程序的内置功能，所以我们需要安装此插件，在浏览器中查看我们的程序运行效果。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004037.png)

### Live Server 实时预览

安装这个插件之后，我们在编辑器中修改代码，按 Ctrl+S 保存，修改效果就会实时同步，显示在浏览器中，再不用手动刷新。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004127.png)

### HTML Preview（George Oliveira）

预览 html<br>安装好之后，fn+f 1 打开菜单，输入 html: ，即可看到所有可用命令。也可以直接在 html 文件上右键，也会有 open preview 和 show in browser 命令

- Open Preview
- Open Preview to the side
- Open Locked Preview to the Side

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685590811582-d7723c7c-75fb-4c81-81c4-cf655aa1be1a.png#averageHue=%232b2b2b&clientId=u3ead4250-b74d-4&from=paste&height=130&id=u753fc7f4&originHeight=260&originWidth=1196&originalType=binary&ratio=2&rotation=0&showTitle=false&size=56652&status=done&style=none&taskId=u3c812d91-5521-4cb9-96cc-56fb83c197d&title=&width=598)

### `Auto Close Tag` 自动闭合标签

输入标签名称的时候自动生成闭合标签，特别方便。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004259.png)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-64e0bd4dfd9e256f.gif)

### `Auto Rename Tag` 尾部闭合标签同步修改

自动检测配对标签，同步修改。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004417.png)

![|400|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-2b55ad52ed51ff52.gif)

### `Improt Cost` 成本提示

这个插件可以在你导入工具包的时候提示这个包的体积，如果体积过大就需要考虑压缩包，为后期上线优化做准备。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404214114.png)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-cdbd74114332cb25.gif)

### Version Lens 工具包版本信息

在 `package.json` 中显示你下载安装的 npm 工具包的版本信息，同时会告诉你当前包的最新版本。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404215821.png)

使用：在 `package.json` 的右上角点击 `V` 显示依赖信息

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404220106.png)

## Remote - SSH

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241203101444.png)

- CTRL+SHIFT+P，`remote-ssh:open ssh configuration file…`

![|800](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412040855166.png)

- 配置 SSH

```shell
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host tencentClound
    HostName 43.159.135.247
    User hacket
    IdentityFile ~/.ssh/id_rsa


# 完整的.ssh/config配置
Include ~/.orbstack/ssh/config 

Host github.com
   User git
   Hostname github.com
   IdentityFile ~/.ssh/id_rsa
  
Host gitee.com
   User git
   Hostname gitee.com
   IdentityFile ~/.ssh/id_ed25519_gitee

Host gitlab.com
   User git
   Hostname gitlab.com
   IdentityFile ~/.ssh/id_ed25519

Host tencentClound
    HostName 43.159.135.247
    User hacket
    IdentityFile ~/.ssh/id_rsa
```

config 文件中，包括三行：

- 服务器名称
- IP 地址
- 用户名

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412040900802.png)

- 连接：`remote-ssh:connect to host`

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241209102255.png)

## `vscode-icons` 文件类型图标

此插件可以帮助我们根据不同的文件类型生成对应的图标，这样我们在侧边栏查看文件列表的时候直接通过图标就可以区分文件类型。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004651.png)

使用 mac 的小伙伴可以选择下载 `Vscode-icons-mac`，基本图标与 `Vscode-icons` 类似，就是文件夹采用的是 mac 风格。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004726.png)

## `Bracket Pair Colorizer` 用不同颜色高亮显示匹配的括号

对配对的括号进行着色，方便区分，未安装该插件之前括号统一都是白色的。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004518.png)

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404004527.png)

## `Highlight Matching Tag` 高亮显示匹配标签

这个插件自动帮我们将选中的匹配标签高亮显示，再也不用费劲查找了。

![|500](https://upload-images.jianshu.io/upload_images/2484592-c3fa7a3ddcc61408.gif?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

## TODO Highlight 高亮

如果我们在编写代码时想在某个地方做一个标记，后续再来完善或者修改里面的内容，可以利用此插件高亮显示，之后可以帮助我们快速定位到需要修改的代码行。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404102122.png)

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404102131.png)

## Code Spell Checker 单词拼写检查

自动识别单词拼写错误并且给出修改建议。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404102258.png)

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/2484592-5bae0bd9948a6a8d.gif)

## Code Runner 运行选中代码段

如果你需要学习或者接触各种各样的开发语言，那么 Code Runner 插件可以让你不用搭建各种语言的开发环境，直接通过此插件就可以直接运行对应语言的代码，非常适合学习或测试各种开发语言，使用方式直接右键选择 Run Code，支持大量语言，包括 Node。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404213759.png)

如果是 C/C++ 的话，默认是 G++，自己配置的就会无效

![image.png|800](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240420202947.png)

## Bookmarks 书签

对代码进行书签标记，通过快捷键实现快速跳转到书签位置。

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404215605.png)

- 添加书签

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404215458.png)

- `Ctrl+Shift+P`，输入 `bookmark` 列举出所有的 bookmark 功能

## Git

### GitLens 查看 Git 信息

将光标移到代码行上，即可显示当前行最近的 commit 信息和作者

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240404214226.png)

⚠️upload failed, check dev console

### GitHub Repositories

本地查看 Github 仓库源码<br>![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1705908917260-ec9ccdce-6bdb-46cb-9434-dfb00dbdaa09.png#averageHue=%231c1b1b&clientId=u540ebebe-a078-4&from=paste&height=411&id=u730c3041&originHeight=1164&originWidth=784&originalType=binary&ratio=2&rotation=0&showTitle=false&size=76159&status=done&style=none&taskId=u7a50f1ba-70b6-4e27-94f5-1e3159620f4&title=&width=277)

## Draw. Io Integration

画图用的<br>新增 `xxx.drawio` 文件就可以用了

## Error Lens

语法错误提示

## ~~`Settings Sync` VSCode 设置同步到 Gist~~

插件过时了，用官方的：[[#VSCode 官方 Setting Sync]]

## 其他

### `WakaTime` 计算代码工作量，时间

这是一款时间记录工具，它可以帮助你在 vs code 中记录有效的编程的时间。
