---
date_created: Wednesday, May 29th 2022, 12:37:40 am
date_updated: Monday, January 27th 2025, 1:05:08 am
title: Obsidian插件之QuickAdd
author: hacket
categories:
  - Tools
category: Obsidian
tags: [obsidian]
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
aliases: [Quick Add]
linter-yaml-title-alias: Quick Add
---

# Quick Add

## 什么是 Quick Add？

QuickAdd 是一款可快速添加信息，捕捉想法，采用模板新建笔记和添加宏命令，快速执行多项操作的好用又强大的插件。宏命令，快速执行多项操作的好用又强大的插件。

在 QuickAdd 的插件设置中，可以添加四种模式的命令，命令名称支持 emoji 标签。

可添加的四种命令模式分别为：

- Template 创建一个模板
- Capture 捕获思考，想法，添加进一个文件。
- Macro 快速创建一个宏
- Multi 创建一个命令组

![au18w](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033747.png)

## 基本使用

- 设置界面有个输入框，输入命令的名称，在调用时方便使用
- 在设置界面点击 `Template` 指定类型的 Quickadd 命令（一共有 4 种类似）
- 点击 `Add Choice` 添加该类型的命令，按照弹出界面进行配置，确定后这时候这个命令就会添加到界面里
- 点击 `闪电图标` 激活命令，点击设置图标设置命令
- 除了 `Macro` 之外需要点击 `Manage Macros` 单独的一系列配置，其他命令就可以使用了
- `Ctrl P` 快捷键弹出命令窗口，输入命令名就可运行 Quickadd 了

Quickadd 的使用需要明白四个核心概念：

- 模板 **Template**：直接调用模板创建新的笔记，也可以利用 inline script 实现格式化模板
- 捕获 **Capture**：快速添加可格式化内容到当前笔记或添加可格式化内容到具体笔记的具体位置
- 组合命令 **Macro**：obsidian 命令，编辑器命令，用户脚本，已有的 Template 或 Capture
- **Multi**：类似于文件夹的功能将上述内容进行管理

### Template

大多数模板功能都分为两个部分：模板定义文件和模板设置文件。

- 模板定义文件：类似于一篇笔记，里面是一些占位符：当调用模板文件时，会根据设置的规则自动进行填充，或者弹出输入框手动填充。自动填充的应用场景包括：自动获取网页上的数据，结合多个脚本从上一个脚本中获取数据，根据应用场景自动生成对应场景的模板等。高度自定义上手难度较高，需要一些 Javascript 编程经验。
- 模板设置文件：是一些设置项，除了高度自定义的形式，Quickadd 还提供了一些常见的功能以图形界面展示，方便无编程经验的朋友使用。包括重命名笔记，在新的标签页打开，自动聚焦到新标签页等。

### Capture **快速捕获灵感（快速添加一项内容）**

Capture 功能，可以快速添加一项内容，并放置在当前文件或选择一个特定的文件中

相当于快速添加已经设定好的东西，类似复制

如快速插入时间日期

#### Ref

- 【【杂货分享 07】QuickAdd 插件 - 记录灵感及宏功能的强大工具】 [【杂货分享07】QuickAdd插件-记录灵感及宏功能的强大工具_哔哩哔哩_bilibili](https://link.zhihu.com/?target=https%3A//www.bilibili.com/video/BV1DT4y127oQ/%3Fshare_source%3Dcopy_web%26vd_source%3Debdaf3cc595538123eed55357f4842d7)
- 【Johnny 学 OB 第 38 集用 OB 搭建个人首页收尾篇，用 Quickadd, Kanban, Buttons 把之前的坑都补上吧 Obsidian 教程】 [Johnny学OB 第38集 用OB搭建个人首页收尾篇，用Quickadd, Kanban, Buttons 把之前的坑都补上吧 Obsidian教程_哔哩哔哩_bilibili](https://link.zhihu.com/?target=https%3A//www.bilibili.com/video/BV1qQ4y1q7Gs/%3Fshare_source%3Dcopy_web%26vd_source%3Debdaf3cc595538123eed55357f4842d7)

### Macro

#### Macro 介绍

Quickadd 最强大的地方就是这个 Macro 了，它能把一系列的命令组合起来，形成一个处理流程。这些命令包括自定义的脚本，而本地软件的自定义脚本，能够通过系统命令，调用包括 Python，Rust 等其他语言写的脚本。

#### Macro 应用

##### 语雀 CDN 的图片下载，上传到 Github OSS，替换链接

**背景：** 从语雀转到 Obsidian，很多笔记还是用的图片还是用的语雀 CDN，导致发布成网页后，图片跨域了，访问不了了

**解决：** 需要将语雀 CDN 的图片上传到自己的图床，并替换图片链接
 配合 `Image auto upload Plugin` 插件，先 download 所有的图片，再 upload 图片到配置的图床，如 Github
![2t1p1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033748.png)

通过 `Quick Add` 将 2 条命令命令组合起来

- 添加 `DownloadImagesThenUploadToGithubOSS`
![0ho1k](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033749.png)

- 点击 `Manage Macros` 或者右侧的设置图片，配置 Macros
![aeh2p](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033750.png)
添加一个 600 ms 的 delay，是为了有时间下载图片
![cvywp](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033751.png)

- 激活闪电图标，不激活在命令面板搜索不到
![64sif](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033752.png)

- 配合 `Commander` 插件，将该命令配置到状态栏
![wrpej](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033753.png)

![nnzqg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033754.png)

### Multi

创建一个命令组；当添加了很多命令的时候，使用 Multi 可以做整理分组，方便搜索

![mkfv4](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033755.png)

建立了一个名为 group 的 multi 类型分组按最右按键拖动分组：

![pnw7p](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033756.png)

点进去就可以看到组内的命令

![01i8u](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033757.png)

## 脚本增强

### 自定义外部应用打开

- 在 `templates/` 目录，新建 `OpenWith.js`

```js
const child_process = require('child_process')
const basePath = app.vault.adapter.basePath.replaceAll("\\","/")
const filePath = app.workspace.activeLeaf.view.file.path
const line = app.workspace.activeLeaf.view.editor.getCursor().line

module.exports = async (params) => {
  //console.log(basePath)
  const options = ["terminal", "css", "script", "vim", "vscode"]
  const action = await params.quickAddApi.suggester(options,options)
  //console.log(action)
  if(action === options[0]){
    await child_process.exec(`wt -d ${basePath}`)
  }else if(action === options[1]){
    await child_process.exec(`code ${basePath}\\.obsidian\\snippets`)
  }else if(action === options[2]){
    await child_process.exec(`code ${basePath}\\Config`)
  }else if(action === options[3]){
    await child_process.exec(`gvim "${basePath}/${filePath}"`)
  }else if(action === options[4]){
    await child_process.exec(`code -g "${basePath}/${filePath}:${line}" `)
  }
}
```

- 新增 `QuickAdd` 配置
![0yuif](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033758.png)

- 命令面板搜索 `OpenWith`，点击出现选择
![o4uqw](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270033759.png)

- 配合 `Commander` 添加到状态栏（如没有出现，重启 OB）
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270034575.png)
- 点击 `Tab Bar` 上的文件夹图标
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501270034421.png)

- Ref
[【QuickAdd脚本】自定义外部应用打开 - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/33393/6)

## AI 增强

通过调用 ChatGPT 实现比 `obsidian-textgenerator-plugin` 这样做好的 AI 更加细腻的控制，定制化更强，难度理所当然更大一点。

开发者也提供了一些友好的操作，[AI Assistant for Obsidian](https://bagerbach.com/blog/obsidian-ai#actionable-takeaways) 则比较详细的描述了如何使用 Quickadd 的 AI 辅助功能，包括：

- 自动生成 MOC
- 总结
- 文本转换
- 闪卡创建
- 提示
- 链式提示：即包含提问上下文的提示
- 配合 Readwise 总结书籍内容
- Youtube 视频总结

# Ref

- [GitHub - chhoumann/quickadd: QuickAdd for Obsidian](https://github.com/chhoumann/quickadd)
- B 站 QuickAdd
【【从零开始学 OB】—— QuickAdd (上) 助力提升笔记效率】 <https://www.bilibili.com/video/BV1cH4y1Q7ou/?share_source=copy_web&vd_source=cdc5b4cea94ed3b5afe17160407a8cc5>
【【从零开始学 OB】—— QuickAdd (下) 助力提升笔记效率】 <https://www.bilibili.com/video/BV1U94y1W7ba/?share_source=copy_web&vd_source=cdc5b4cea94ed3b5afe17160407a8cc5>

- [Obsidian最强插件：QuickAdd - 少数派](https://sspai.com/post/69375)
