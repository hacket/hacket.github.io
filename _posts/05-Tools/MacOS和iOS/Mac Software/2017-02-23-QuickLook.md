---
banner:
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Tuesday, December 23rd 2025, 11:41:54 pm
title: QuickLook
author: hacket
categories:
  - Tools
category: Mac
tags: [Mac]
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
date created: 2024-04-01 17:06
date updated: 2024-12-23 23:41
aliases: [QuickLook]
linter-yaml-title-alias: QuickLook
---

# QuickLook

## QuickLook 是什么？

QuickLook，中文叫『快速预览』，文件无需打开就可以用 QuickLook 一键快速预览，QuickLook 是 Mac 上最好用的功能之一。<br>QuickLook 是 Mac 上能快速预览大部分文件的功能，包括语音，视频 (仅限 mp4/mov)，图片，文档 (office 文档，iworks 文档等，普通文本文档等)，甚至在安装插件之后还能浏览 rmvb/mkv 格式视频，无后缀文档，字幕文件.srt，压缩包，Mac 软件 dmg 镜像，webp 图片，以及程序猿才用到的 json 预览，markdown，语法高亮等。

## **怎么使用 QuickLook？**

- 空格
- Ctrl+Y

## quicklook 重启

```shell
qlmanage -r cache
```

## QuickLook 插件

QuickLook 虽然强大，能打开大部分文件，但是默认还是有很多文件的无法打开的。

安装 QuickLook 插件：

> brew install --cask 插件名

卸载

> brew uninstall --cask 插件名

插件安装路径：除了 `betterzip`，其他都是安装在 QuickLook 的插件目录 `/Library/QuickLook/` 或 `~/Library/QuickLook`，后缀都是 `.qlgenerator`，betterZip 比较特殊，它是安装到 `应用程序` 里的，其实是要你自己拷贝到应用程序里面去。

### qlstephen 无后缀名的文本文件

无后缀名的文本文件，安装插件 `qlstephen` 即可支持

> brew install --cask qlstephen

### qlvideo 无法打开的视频文件

QuickTime 无法打开的视频文件（没错，QuickTime 不支持的，QuickLook 肯定也不支持，rmvb/mkv 之类的视频需要安装 `qlvideo` 插件来支持，但只能支持预览截图，不支持直接预览播放）

### qladdict srt 字幕文件

喜欢下载美剧看的都知道这个，安装 `qladdict` 即可支持，但有两个问题：

1. 是.srt 字幕据我估计国内字幕组大部分应该都是用 windows，所以导致有时候编码不是 utf-8 的时候，中文会乱码
2. 还有.ass/.ssa 这些字幕还是不支持用 QuickLook 查看，因为这些查看插件都是别人写的，没人写自然就不支持

### BetterZip 压缩包/dmg 镜像

安装 `BetterZip` 后即可用 QuickLook 查看压缩包/dmg 镜像内的内容，需要注意的是，大部分用于支持 QuickLook 的都是插件，但 BetterZip 还是一个压缩/解压软件

### quicklook-csv csv 文件

默认是能查看，但安装 `quicklook-csv` 插件后，能查看到 csv 的行数、列数，字节数，编码方式

### QuickLookJSON json 文件

默认也是能查看，但安装 `QuickLookJSON` 插件后，能查看格式化的 json，看起来更舒服

### `qlImageSize` webp 格式图片

默认不支持查看，安装 `qlImageSize` 插件后即可支持，而且安装该插件后在查看图片时能在上方显示宽高及大小，不安装的时候是不显示的

### ~~qlcolorcode 预览代码文件~~

[GitHub - anthonygelibert/QLColorCode: QuickLook plugin for source code with syntax highlighting.](https://github.com/anthonygelibert/QLColorCode)

默认看代码文件就当是普通文本看，安装 `qlcolorcode` 后，即可支持代码高亮，看起来舒服多了

#### 问题 1：M1/M2 不能预览源文件

1. 下载 [QLColorCode 4.1.2+m1](https://github.com/jpc/QLColorCode/releases/tag/release-4.1.2%2Bm1)[QLColorCode-4.1.2+m1.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1692172762683-06820759-6a07-4029-86bf-cf9c2fb150fb.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1692172762683-06820759-6a07-4029-86bf-cf9c2fb150fb.zip%22%2C%22name%22%3A%22QLColorCode-4.1.2%20m1.zip%22%2C%22size%22%3A2063697%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u9dc2ca97-283b-4b72-8e3e-457ecba9cd5%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22id%22%3A%22ub5761eae%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)
2. 放到~/Library/QuickLook 目录下替换掉旧的 `QLColorCode.qlgenerator`
3. 如果需要执行 `qlmanage -r`

用 [[SourceCodeSyntaxHighlight]]

#### 问题 2：dart 源文件不能预览

1. 新建一个空的.dart 文件或用已有的 dart 文件

```shell
cd ~
touch example.dart
```

2. Find the content type for `.dart` files

```shell
mdls -name kMDItemContentType ~/example.dart
# 响应，dyn.ah62d4rv4ge80k2pwsu需要写到Info.plist中去
# kMDItemContentType = "dyn.ah62d4rv4ge80k2pwsu"
```

3. Update QLColorCode Info.plist
   - `open ~/Library/QuickLook/QLColorCode.qlgenerator/Contents/Info.plist`
   - 将 `kMDItemContentType = "dyn.ah62d4rv4ge80k2pwsu"` 添加到下图位置

![k44fx](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/k44fx.png)

4. 重启 `quicklook`

```shell
qlmanage -r
```

存在一个旧版本的，删除

![eykn0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/eykn0.png)

用 [[SourceCodeSyntaxHighlight]]

- [x] [How to Preview Dart files with MacOS Quick Look](https://medium.com/@claudmarotta/how-to-preview-dart-files-with-macos-quick-look-54779340811f)

### SourceCodeSyntaxHighlight

[GitHub - sbarex/SourceCodeSyntaxHighlight: Quick Look extension for highlight source code files on macOS 10.15 and later.](https://github.com/sbarex/SourceCodeSyntaxHighlight)

```shell
brew install --cask --no-quarantine syntax-highlight
qlmanage -r
qlmanage -r cache
# 重启Finder，按住option，长按右键Finder，ReLaunch

# 安装完成后，需要启动Syntax Highlight App，否则Quick Look不会生效
```

### 给开发者的 quicklook 插件

```shell
brew install qlstephen qlmarkdown quicklook-json qlimagesize suspicious-package apparency quicklookase qlvideo syntax-highlight
# qlcolorcode在高版本Mac不支持了
```

## 更多插件

- [ ] <https://github.com/haokaiyang/Mac-QuickLook>
- [ ] <https://github.com/xupefei/QuickLook>
- [ ] [给开发者的quicklook插件: https://github.com/sindresorhus/quick-look-plugins](https://github.com/sindresorhus/quick-look-plugins)

## 遇到的问题

### `Mac13.2.1(Ventura)` 不能预览 ` .java  `、` .dart  `、` .kt  ` 等源文件

问题：`.java`、`.dart`、`.kt` 等源文件；`.cpp` 和 `.c` 文件可以预览但没语法高亮

![vb6bo](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/vb6bo.png)

解决 1：安装 `qlcolorcod`

```shell
brew install --cask qlcolorcod
qlmanage -r
qlmanage -r cache
# 重启Finder，按住option，长按右键Finder，ReLaunch
```

出现新的问题，白屏了

![f9uoj](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/f9uoj.png)

解决 2：`SourceCodeSyntaxHighlight`

```shell
brew install --cask --no-quarantine syntax-highlight
qlmanage -r
qlmanage -r cache
# 重启Finder，按住option，长按右键Finder，ReLaunch

# 安装完成后，需要启动Syntax Highlight App，否则Quick Look不会生效
```

![ml5f2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ml5f2.png)
