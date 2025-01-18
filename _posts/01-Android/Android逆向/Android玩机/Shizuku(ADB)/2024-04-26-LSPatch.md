---
date created: 2024-04-26 19:41
date updated: 2024-12-24 00:44
dg-publish: true
---

# LSPatch

## 什么是 LSPatch？

- 不需要 Root 的 `LSPosed` 框架
- `LSPatch`目前支持`Android9`以上系统

下载：[Releases · LSPosed/LSPatch](https://github.com/LSPosed/LSPatch/releases)

`LSPosed` 还具备一种模块注入的模式：便携模式（集成模式）。\
便携模式可以直接把注入模块后的应用打包。这样的应用运行不再需要依靠Lspatch，可以分享给其他人。

# LSPatch 使用

## 连接 `Shizuku` 服务

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240427103653.png)

## 管理

### 应用

#### 修补APK

- 点击`LSPatch`管理功能右下角的加号
- 会提示选择一个目录来存储已修复的 apk，我们选择自己方便调用的文件夹，点击使用此文件夹并给予存储权限
- 新建修补时我们可从存储目录中选择apk或选择已安装的应用程序
- 选择好程序和**修补模式**后即可开始修补

#### 修补模式

##### 集成模式（便携式模式）

在这里，我选择了开源的QA模块注入到QQ中，以实现防撤回功能。
**准备：**

1. Lspatch:<https://github.com/LSPosed/LSPatch>
2. Qa模块(全面叫QAuxiliary):<https://github.com/cinit/QAuxiliary>
3. QQ安装包:<https://im.qq.com/download>
4. 一部安卓手机，可以使用模拟器，但千万不要使用安卓子系统，因为没有文件目录体系。

**集成模式：修补：**
![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240426201407.png)

**点击"嵌入模块"，选择模块 qa。**

**点击右下角“开始修补“，等待修补完成。**
![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202404270758846.png)

进入手机的文件管理器，在 `/sdcard/Downloads/lspatch`，找到类似 `base-398-lspatched.apk`

就可以将这个 APK 给其他没有安装 LSPatch 的手机就可以安装

就可以去：`QQ → 设置 → QAuxiliary`，看是否存在

##### 本地模式

本地模式，顾名思义只能在本地运行。它不再嵌入模块，而只是修改应用以模块得以使用。

缺点很明显，即需要Lspatch在后台运行，应用才可正常运作。优点是可以灵活管理模块，模块更新不需要重新打包。

#### 控制台合成安装包

Lspatch 还提供了另一种打包方式：从电脑打包，通过他提供的一个 jar 包，打包出来**本地模式**或**便携模式**的包。

准备资源:

1. Java环境 推荐使用集成的Java开发环境，如Android Studio，安装后无需启动Android Studio即可使用Java
2. `lspatch.jar` <https://github.com/LSPosed/LSPatch/releases/latest>
3. 应用、模块的apk

在`lspatch.jar`所在的目录运行cmd.\
控制台输入以下命令:

- 本地模式:`java -jar lspatch.jar xxx.apk -manager -l 2`
- 便携模式:`java -jar lspatch.jar xxx.apk [-m 模块1.apk [-m 模块2.apk ...]] -l 2`

`xxx.apk`为要修改的应用安装包.

### 模块

## LSPatch 应用

### LSPatch 实现对 release 包的抓包和修改成可调试 (无 Root)

- 安装 `Shizuku`，并开启 `Shizuku` 服务
- 安装 LSPatch
- 打开 LSPatch→管理→应用，开启修补
- 修补选本地模式，勾选**可调试**和**破解签名校验**

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240427104827.png)

- 重新卸载并重新安装修补后的包

**注意：有的手机安装修补后的包可能会启动闪退**

# Ref

- [GitHub - LSPosed/LSPatch: LSPatch: A non-root Xposed framework extending from LSPosed](https://github.com/LSPosed/LSPatch)
