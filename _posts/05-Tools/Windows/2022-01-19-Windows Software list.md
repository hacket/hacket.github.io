---
banner: 
date_created: Wednesday, January 19th 2022, 8:06:26 am
date_updated: Monday, September 15th 2025, 11:50:47 pm
title: Windows Software list
author: hacket
categories:
  - Tools
category: Windows
tags: [Windows]
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
date created: 2024-09-10 00:54
date updated: 2024-12-23 23:41
aliases: [Windows 必备工具]
linter-yaml-title-alias: Windows 必备工具
---

# Windows 必备工具

## 📝 开发与编辑

### 代码编辑器

- **VSCode** - 微软开源代码编辑器
- **Notepad++** - 轻量级文本编辑器 [[#^8228b0]]
  - 下载：<https://notepad-plus-plus.org/downloads/>
- **SublimeText** - 高性能文本编辑器

### Markdown 编辑器

- **Typora** - 所见即所得 Markdown 编辑器

## 📚 知识管理

- **Obsidian**（推荐，目前使用）- 双链笔记软件 [[1 Obsidian入门]]
- **有道云笔记** - <https://note.youdao.com/download.html>
- **语雀** - <https://www.yuque.com/download>
- **幕布** - 思维导图笔记

## ⚡ 效率工具

### 启动器与搜索

- **Everything** - 本地文件搜索神器
  - 下载：<http://www.voidtools.com/downloads/>
- **Wox** - Windows 下的 Alfred [[#^9467c1]]
- **Listary** - 文件浏览和搜索神器（详细配置见 `listary.md`）
- **uTools** - 插件化生产力工具
  - 开源替代：[Rubick](https://github.com/rubickCenter/rubick)

### 剪贴板与输入

- **Ditto** - 剪贴板历史管理
  - 免费开源、免安装的剪贴板增强工具
  - 快捷键：**Ctrl+`**
  - 下载：<https://github.com/sabrogden/Ditto/releases>
  - 功能：编辑内容、快速搜索、合并粘贴、分组、热键粘贴、网络共享
- **AutoHotkey** - 自动化脚本工具

### 系统增强

- **MouseInc** - 鼠标手势增强工具 <https://shuax.com/project/mouseinc/>
- **VistaSwitcher** - 程序切换工具（替换 Alt+Tab）
- **QuickLook** - 文件快速预览（空格键预览）
  - 下载：<https://github.com/QL-Win/QuickLook/releases>
  - 插件：<https://github.com/QL-Win/QuickLook/wiki/Available-Plugins>
  - 使用：下载 .qlplugin 文件，选中文件按空格安装，重启 QuickLook

### 右键菜单

- **breeze-shell** - 右键菜单增强 <https://github.com/std-microblock/breeze-shell/>
- **FileMenuTools** - 右键菜单自定义

## 🎬 多媒体工具

### 播放器

- **Potplayer** - 全能视频播放器 <https://potplayer.daum.net/>

### 录屏工具

- **Bandicam** - 高质量录屏软件（文件小、质量高）
- **LiceCAP** - 最好用的 GIF 录屏软件
  - 下载：<https://www.cockos.com/licecap/>
  - 特点：操作简单，界面就是录制框，画质体积平衡
- **ScreenToGif** - GIF 制作工具
  - 下载：<https://www.screentogif.com/>

### 截图工具

- **PixPin**（推荐）- 功能全面的截图工具
  - 下载：<https://pixpinapp.com/>
  - 功能：截图、长图、动图、截动图、OCR 文本识别、标注
- **Snipaste** - 强大的截图工具（Win/Mac）
  - 下载：<https://www.snipaste.com/>
- **Fscapture** - 小巧的截图录屏工具（仅 Windows）
- **QQ/微信截图** - 日常截图使用

## 📄 文档处理

### PDF 工具

- **PDF24**（推荐）- 最好用的免费 PDF 工具
  - 下载：<https://www.pdf24.org/en/>
- **PDF Candy** - PDF 工具箱，功能全面，免费永久使用

## 🗂️ 文件管理

### 文件管理器

- **Clover** - 资源管理器标签化
  - 下载：<https://clover.en.uptodown.com/windows/download>
  - 快捷键：Ctrl+T 新开页面、Ctrl+W 关闭页面、Ctrl+Tab 切换页面
- **Total Commander** - 经典双窗口文件管理器
- **Directory Opus** - 专业文件管理器

### 压缩解压

- **Bandizip** - 免费解压缩软件
  - 下载：<https://cn.bandisoft.com/bandizip/>
  - 特点：清新简洁、功能强大、无广告无捆绑

## 🔧 系统维护

### 卸载清理

- **Geek Uninstaller** - 彻底卸载工具
  - 下载：<https://geekuninstaller.com/>
- **IObit Uninstaller** - 程序卸载清理
  - 下载：<https://www.iobit.com/en/recommend/iu.php?name=driver_booster_free>
- **Wise Disk Cleaner** - 免费磁盘清理工具

### 文件解锁

- **IObit Unlocker** - 文件占用解锁工具
  - 下载：<https://www.iobit.com/en/iobit-unlocker.php>

## 🌐 网络工具

### 下载工具

- **IDM** (Internet Download Manager) - 专业下载工具
  - 官网：<https://www.internetdownloadmanager.com/>
  - 破解工具：见备份的破解工具目录

---

# 🛠️ 工具详细配置教程

## [wox](https://github.com/Wox-launcher/Wox) windows 下的 alfred

^9467c1

### wox 的安装

1、安装 EveryThing<br />2、安装 python,并加入到 PATH 环境变量中去<br />3、安装 wox,下载地址

### 安装 wox 插件

> 插件地址<br /><http://www.getwox.com/plugin>

> wpm install xxx

### 常用插件

#### 有道翻译

```
wpm install 有道翻译
```

> yd retrofit

#### 移除 usb

```
wpm install Remove USB
```

> reu

#### 关闭屏幕

```
wpm install Close Screen
```

> closescreen

#### 内网和外网的 Ip 地址

```
wpm install IP Address
```

> ipadr

#### Color

```
wpm install Color
```

### 3、功能

- 查询颜色<br />输入#F00
- 搜索<br />google 搜索 : g xxx<br />百度搜索 : bd xxx<br />github : github xxx<br />维基百科 : wiki xxx<br />google 翻译 : translate xxx

## Listary

> listary 官网<br /><http://www.listary.com/><br />listary 介绍：<br /><http://www.iplaysoft.com/listary.html>

### 什么是 listary？

Listary 是一个革命性的 Windows 搜索工具，借助 Listary 软件，你可以快速搜索电脑文件、定位文件、执行智能命令、记录访问历史、快速切换目录、收藏常用项目等。<br />Listary 为 Windows 传统低效的文件打开/保存对话框提供了便捷、人性化的文件（夹）定位方式，同时改善了常见文件管理器中文件夹切换的效率。

### listary 破解

#### 注册码

```
姓  名：准女婿
邮  箱：welcome5201311@163.com
注册码：
DR6QRNJBSYB344AJ7NJA3EKZC9B2PMWV
KF2HP9CAQSJMBZCJXM8KSH4H3XYPAKNS
WRR6ZBJ3HQPPZGF8FL88VQSNZ27EAW8S
AAV6TVFGLQZTHGJCAEMAKG74573ZTDDG
8NMLXAMZVJ6546QZLE7VTYZRNFKMHUBB
JNWC2T2FR3EKVUDA2JEL85RDHLVFBC4Q

姓  名：准女婿
邮  箱：welcome5201311@163.com
注册码：
AQUTK8NRYKGREDZMS68GPG9NPDYSYJJK
FGQ2ZL8B6Z3STGXEST27EAS67F77HR6M
CW7Y6YA85T75AQUX7W3CYBNJLCJE7GY9
WA3HSDTA8YLT2FPF8YMXWWWFLT4NQK4F
C3LUGRGZR5R29CYAUPZ4XUEXDLGFZNGV
JNWC2T2FR3EKULSBLMG9NLPJWRW29WYH

姓  名：准女婿
邮  箱：welcome5201311@znx_52pojie.com
注册码：
JRWX9QN8GJYF9J3S27KYKY2F7UGCW9QD
VUHQL8ZBERXM9KMY8UM8P23QKYDXHTCW
VHD2WNSSP8CV755UFGALVG34XYEENR76
YSKTDDH29DEVTYD9V5TV8HLMRVGEUVC5
XKE62QZA7YH97CBBA5V7V53MC6XC89N6
4YA4DWA2TZ4VU8VT8S3R89W6HBKG3J42
```

#### 注册机

<https://www.52pojie.cn/thread-528397-1-1.html><br />链接：<http://pan.baidu.com/s/1dE8WPOH> 密码：oqv2 （自己百度网盘也有）

破解方法：

1. 运行 Kill-ListaryService.bat 杀死进程
2. 将 Crack 里面的 MSVCP140.dll 文件替换掉原程序软件，
3. 在输入提供的 key，注册成功

### listary 功能

#### 搜索：Listary 搜索的四种方式

##### 任意界面双击 "Ctrl" 打开搜索框

##### 资源管理器内任意位置直接搜索

1. 文件夹内直接输入要搜索的关键字
2. 文件夹任意空白位置双击左键

##### 搜索网络资源

###### 用 Google 搜索 ABC

1. 双击 Ctrl 键
2. 输入 gg ABC（中间要空格）

###### 自定义搜素

选项→关键字→Web，添加自定义搜素的网址<br />整理了一些常用的网址，你们可以直接在 Listary 中批量添加：

```
bk | 百度百科 | https://baike.baidu.com/item/{query}
wj | 维基百科 | https://zh.wikipedia.org/wiki/{query}
cd | 字典词典 | https://www.zdic.net/hans/{query}
zh | 知乎 | https://www.zhihu.com/search?type=content&q={query}
db | 豆瓣电影信息 | https://movie.douban.com/subject_search?search_text={query}
wp | 网盘搜索 | https://www.xalssy.com.cn/search/kw{query}
pdd | 盘多多搜索 | http://nduoduo.net/s/name/{query}
zz | 种子磁力搜索 | http://zhongzijidiso.xyz/list/{query}/1/0/0/
yk | 优酷 | https://so.youku.com/search_video/q_{query}
Iqy | 爱奇艺 | https://so.iqiyi.com/so/q_{query}
tx | 腾讯 | https://v.qq.com/x/search/?q={query}
eb 电子书URL:http://cn.epubee.com/books/?s={query}
wk | 百度文库 | https://wenku.baidu.com/search?word={query}
lm | 绿色软件 | http://www.xdowns.com/search.php?ac=search&keyword={query}
app | 安卓软件 | http://www.appchina.com/sou/?keyword={query}
```

##### 拼音首字母模糊搜索

Listary 不仅支持关键词模糊查找，也支持用拼音首字母进行模糊查找，甚至还可以拆字。

> Listary 根据你的启动和搜索历史记录自动优化和改进搜索结果，将常用内容排在前面，创建更快的工作流程。

#### 核心功能

##### 快速启动软件

例如，单击 Ctrl 两次，然后键入 " 微信 "，Listary 将打开微信。或者，为微信输入 'wx'，为 Photoshop 输入 'ps'， Listary 也能打开程序！

##### 快速切换定位

你是否厌倦了通过打开一系列窗口来处理程序中的文件？<br />明明知道文件路径，为什么还非要一层层打开？文件放在很深的的文件夹里，一不小心进错目录，又要不断地 " 向上 " 去另一个目录。

- 案例 1：<br />例如，当你下载文件选择保存目录时，在选择目录的提示框下方会浮现 Listary 搜索框，你直接搜索文件路径即可。
- 案例 2：<br />如果你要保存的路径早已打开，使用 Listary 的快速切换功能，只需单击 Ctrl + G 即可立即跳转到您正在使用的文件的打开文件夹。

> 在任意软件里 " 打开文件 " 的对话窗口里，按捷键 Ctrl+G，跳转到刚才已在文件管理器里打开的文件夹

##### 搜索之后对文件进行操作

在得到搜索结果后，Listary 也提供多种文件处理方式，例如发送到指定位置、为文件设置搜索关键词，复制文件路径等等。具体查看：选项→动作

1. Ctrl+C 复制
2. Ctrl+Shift+C 复制路径到剪切板
3. Alt+O 打开方式
4. Ctrl+Enter 打开文件夹
5. 其他

#### 高阶用法

##### 指定父文件夹名称

当你获得太多搜索结果时，您可以使用此语法让 Listary 仅显示父文件夹名称包含特定关键字的结果，快速缩小范围。<br />附加尾缀 `\` 到一个关键字，表明它是父文件夹路径的一部分。<br />示例：搜索 Listary 在 Windows 文件夹内:

```
win\Lis
win\ Lis
Lis win\
```

> 一个符合条件的结果：C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Listary、

##### 搜索过滤 精准直达

键入搜索过滤器关键字后加冒号，使您能搜索特定文件夹中的特定文件扩展名或文件夹

- 搜索/.用法：

```
过滤器关键:要搜索的关键字
```

比如搜索 utils 开头的文件：<br />file:utils

- 目前系统默认搜索过滤器（可自行添加）：

```
folder: 文件夹
file: 文件
doc: 文章
pic: 图片
audio: 音频
video: 视频
示例：搜索一个文件夹 ， game 作为其名称的一部分:
folder: game
game folder:
```

- 自定义一个搜索.java 和.class 的过滤器

```
名称：搜索.java和.class的过滤器
关键字：java
搜索：不勾选目录；勾选文件，扩展名填：java;class
```

自定义的 java 过滤器使用：

1. 按键 2 次 Ctrl 键
2. java: 要搜索的关键字

##### 工程文件 指定目录

选项→工程<br />可以在指定的目录下搜索文件，而不是全局搜索。<br />例如：我们将 "D:\桌面快捷方式 " 添加进了工程列表，并给了它一个关键字 "link"。我们可以在任意地方通过 "link xxx" 来搜索这个文件夹下的文件。

## Notepad++

^8228b0

### 宏

### 插件

#### JSONViewer json 格式化

1. json 格式化 Ctrl+Alt+Shift+M
2. 压缩 json Ctrl+Alt+Shift+C

#### JSTool json 格式化、压缩 json

1. json 格式化 Ctrl+Alt+M
2. json 压缩
3. json sort
4. json viewer json 折叠起来

#### compare 文件比较

# Ref

- [x] Windows 上那些值得推荐的良心软件 - 整理<br /><http://blog.csdn.net/qq_37610423/article/details/72729873>
