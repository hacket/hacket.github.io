---
author: hacket
date created: 2024-02-22 00:56
date updated: 2024-12-28 00:14
tags:
  - obsidian
dg-publish: true
---

[Obsidian 中文帮助 官方](https://publish.obsidian.md/help-zh/%E7%94%B1%E6%AD%A4%E5%BC%80%E5%A7%8B)

# Obsidian入门

## Obsidian介绍

### Obsidian特性

- 一款笔记软件
- 文件都存储在本地
- markdown格式
- 双向链接、关系图谱

### 使用Obsidian需要解决的问题

- 同步，电脑端用 Github+ [obsidian-git](https://github.com/denolehov/obsidian-git) 解决；移动端：用 `Syncthing`
- 图床OSS，Github图床配合PicGo自动上传

## Obsidian安装

### 下载安装Obsidian

- <https://obsidian.md/download>

### 配置Github同步笔记

1. Github建立一个私有仓库，去设置里获取Token并记录下来
2. 电脑 Obsidian 的 Vault 目录用新建的 git 仓库来管理
3. 配合 `obsidian-git` [[6.obsidian-git]]插件，自动提交

## Android同步方案

### Syncthing

#### 什么是Syncthing？

Syncthing是一款开源免费跨平台的文件同步工具，是基于P2P技术实现设备间的文件同步，所以它的同步是去中心化的，即你并不需要一个服务器，故不需要担心这个中心的服务器给你带来的种种限制，而且类似于torrent协议，参与同步的设备越多，同步的速度越快。针对隐私问题，Syncthing软件只会将数据存储于个人信任的设备上，不会存储到服务器上。设备之间的通信均通过TLS进行，Syncthing还使用了完全正向保密技术来进一步保障你的数据安全。对于处于不同局域网之中的设备之间的文件同步，Syncthing也提供了支持。

#### 安装

1. Windows
   1. Syncthing官方： <https://syncthing.net/downloads/>
   2. SyncTrayzor图形化
2. Mac

#### 配置

##### 配置用户名和密码

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004122.png)

##### 配置主机

每台设备均会被分配一个**唯一的设备ID（一长串字符）** 用以标识这台设备，后面同步我们会用到。点击 `操作` --> `显示ID` 即可查看。

查看主机ID？

- 网页版的主机

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004505.png)

- Android把抽屉拉出来就能看到：`显示设备ID`

互相添加设备：

- Web端添加远程设备

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004720.png)

- Android端添加远程设备

##### 新建共享文件夹

- Windows Web端设置共享文件夹给远程设备

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004929.png)
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229005020.png)
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229005113.png)

- Android端接收
  - 打开Android App抽屉→网页管理页面
  - 会有提示刚刚共享的文件夹，选接收就好了
  - 配置忽略列表？
  - 等待同步就行了

##### 配置忽略模式

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403120815208.png)

##### 高级

- 文件夹类型，接收还是发送，设置好可以减少冲突

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403120815192.png)

### 配置图床

参考`图床` 章节

# Obsidian使用

## 快捷键

1. Ctrl+O 快速切换
2. Ctrl+Shift+C 全局搜索

## 标签

在笔记文本中添加一个以 `#` 开头的短语即可成为一个标签。比如，`#这就是一个标签` 。

## 核心双联功能-如何引用文章

### 内链

#### 链接到内部其他文档

直接链接其他 obsidian 的文档\
`[[ 两个左框框就可以链接其他文档`

#### 链接当前页面的标题

- `#` 链接内部标题 `[[#内部文档标题`
- `|` 指定要显示的文本 `[[#内部文档标题|要显示的文本`
- `^` 链接文本块 `[[#内部文档标题^内部文档标题`

## 外观

### 字体

1. 先安装字体，重启Obsidian
2. Obsidian设置字体

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240224140856.png)

#### 推荐字体

| 字体                     | 说明                                                                           | 下载                                                                                                                                                                                                                   |   |
| :--------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| **LXGW WenKai Screen** | 中文字体: `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`；obsidian 不错的界面字体，比默认的舒服很多，也比较适合中文的阅读； | [下载](https://github.com/lxgw/LxgwWenKai-Screen/releases)                                                                                                                                                             |   |
| **FiraCode**           | 编程等宽字体                                                                       | 下载 <https://github.com/tonsky/FiraCode/wiki/Installing>                                                                                                                                                              |   |
| **阿里巴巴普惠体**            | 免费商用；我使用的是 `AlibabaPuHuiTi-3-65-Medium`                                      | [阿里巴巴普惠体 (alibabagroup.com)](https://fonts.alibabagroup.com/#/font)                                                                                                                                                  |   |
| **思源黑体**               | Adboe                                                                        | [荒原 // Wasteland](https://n2o.io/lab/userstyles/?ref=greasyfork)     <br><br>[Source Han Sans Simplified Chinese<br><br>Adobe Fonts](https://fonts.adobe.com/fonts/source-han-sans-simplified-chinese#fonts-section) |   |

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240607101435.png)

### 主题

可下载三方主题，切换
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240224103430.png)

### CSS片段

添加启动css片段的方法

1. 打开obsidian设置 → 外观 → CSS 代码片段，点击此处的文件夹图标📁，打开css片段文件夹
2. 复制你的css文件到这个文件夹，回到obsidian中，刷新并启动片段。偶尔需要重启ob生效

具体可见[[2 Obsidian CSS片段]]

## Obsidian技巧

### 更换目录

Obsidian在下载完.exe文件后安装时无法选择下载位置。其实并不是因为无法选择下载位置，而是因为Obsidian的安装位置和它的库的位置是统一的，而你选择了“打开库文件”，那么Obsidian会将库和Obsidian笔记的配置文件一起放在默认地址。此时它的默认保存位置为 “`C:\Users\用户名\Documents\Obsidian Vault` ” ，此时你也可以通过资源管理器的"文档"快速找到"`Obsidian Vault` "库文件夹。
如果需要将Obsidian安装到指定位置，请选择创建新库。
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240223003033.png)

### 更改图片尺寸

- 指定width和height

`![Engelbart|100x145](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)`

- 只指定width

`![Engelbart|100](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)`

- 本地图片

`![[xxx.jpg|100x100]]`

- 也可以用插件：`mousewheel image zoom` 去调节

# Obsidian插件

## 核心插件

- [[1.Obsidian核心插件]]

## 三方插件

### `T0`

1. DataView
2. StyleSettings
3. Commander

### `T1`

### 其他

- 外观相关 [[4.外观相关插件]]
- 画图相关 [[2.画图相关插件]]
- Markdown相关 [[5.Markdown相关插件]]
- 云同步
  - [[6.obsidian-git]]
- AI?
- 其他
  - 自动提示词：[[8.Various Complements]]
  - [[3.图片相关插件]]

# 其他

## 语雀迁移到Obsidian

[yuque-tools/packages/yuque-tools-cli/README.md at main · vannvan/yuque-tools · GitHub](https://github.com/vannvan/yuque-tools/blob/main/packages/yuque-tools-cli/README.md#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240222202620.png)
<https://github.com/vannvan/yuque-tools>

## Obsidian 发布成 Web 方案

- [GitHub - code-scan/obsidian-web](https://github.com/code-scan/obsidian-web)
- [GitHub - chenyukang/obweb: ObWeb = Obsidian on Mobile + Flomo + Rss Reader](https://github.com/chenyukang/obweb)
- [Obsidian发布方案：Github Pages+Docsify](https://zhuanlan.zhihu.com/p/444061013)[Obsidian发布方案：Github Pages+Docsify - 知乎](https://zhuanlan.zhihu.com/p/444061013)
- 发布到 Github Pages: 现成的解决方案和模板，比如 obsidian-publish-mkdocs (<https://github.com/jobindjohn/obsidian-publish-mkdocs>) 和 obsidian-github-publisher (<https://github.com/ObsidianPublisher/obsidian-github-publisher)，这些可以简化发布流程。>

## Ref

- [ ] [Obsidian文档咖啡豆版](https://coffeetea.top/zh/)
- [ ] [Obsidian](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian/)
