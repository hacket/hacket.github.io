---
date created: 2024-08-26 21:48
tags:
  - '#!/bin/zsh'
  - '#=号两边不能有空格'
  - '#adb'
date updated: 2024-12-31 00:07
dg-publish: true
---

# 安装homebrew

<https://brew.sh/index_zh-cn>

> /bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)")

报错：Warning: /opt/homebrew/bin is not in your PATH.<br>解决：`export PATH=/opt/homebrew/bin:$PATH`，或永久编辑到`~/.zshrc`或`~/.bashrc`

# iTerm2

## 安装iTerm2

1. 手动下载安装

是一个终端，替代Mac自带的终端，可以设置终端的主题	<br><https://iterm2.com/downloads.html>

2. 通过homebrew安装

```shell
brew tap caskroom/cask  # 首次安装需执行该条命令
brew cask install iterm2 # 安装iterm2
```

## iTerm2设置

### 替换默认的shell为zsh

系统提供了很多shell，默认的shell格式为`/bin/bash`格式

- 查看当前的shell格式：`echo $SHELL`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693460956399-23ac7bd7-e8d1-4f26-831f-2137ebd32048.png#averageHue=%232a252a&clientId=ud1dffced-811b-4&from=paste&height=29&id=u2ca6292b&originHeight=58&originWidth=572&originalType=binary&ratio=2&rotation=0&showTitle=false&size=37403&status=done&style=none&taskId=u8ccb55b1-c142-40ae-917e-3f9c11e957c&title=&width=286)

- 查看系统支持的所有shell格式：`cat /etc/shells`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693460983119-0cb64958-7bac-43e1-9b22-4ba34dd700c4.png#averageHue=%2355591b&clientId=ud1dffced-811b-4&from=paste&height=183&id=u8b44cf7a&originHeight=366&originWidth=812&originalType=binary&ratio=2&rotation=0&showTitle=false&size=333319&status=done&style=none&taskId=u9df9f2fb-443f-4ca9-9a0c-4a9a29be81e&title=&width=406)

- Mac系统默认使用dash作为shell，可以使用命令修改默认使用zsh：

```shell
# 将当前shell改为zsh
chsh -s /bin/zsh	
# 退出系统shell重进
exit
# 查看当前的shell格式
cat /etc/shells
```

### 安装Nerd Fonts

使用的theme中有很多小图标，需要使用支持这些图标的icon font，这类字体称为powerline font(plus版的支持更多图标的称为：nerd font)<br>没有安装icon font的界面：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683525712264-743edf35-0dbd-4937-8484-748bf5f310ce.png#averageHue=%2315212a&clientId=uc5fb2a63-2aab-4&from=paste&height=38&id=ucc06610a&originHeight=76&originWidth=1706&originalType=binary&ratio=2&rotation=0&showTitle=false&size=50109&status=done&style=none&taskId=u0b5ac531-1d3f-4b30-9cd8-687125a45fd&title=&width=853)<br>设置字体：`iTerm2 -> Preferences -> Profiles -> Text -> Font -> Change Font`

### window设置半透明/blur

路径：`菜单栏 -> Preferences -> Profiles -> Window`<br>Transparency：10 透明度设置<br>Blur：4 模糊度设置<br>Enabled：开启背景图片<br>Mode：Scale to Fill 填充<br>Blending：30 背景纯色与背景图片的混合度<br>Rows：20 新窗口显示的行数（高度）<br>style：新窗口的位置，我习惯设置Full-Width Top of Screen

### 状态栏设置

路径：`菜单栏 -> Preferences -> Profiles -> 分栏Session`<br>Status bar enabled：拖动你喜欢的Item

### iterm2 zsh隐藏命令行前面的用户名和主机名

修改`vim ~/.zshrc`文件,在文件底部增加
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412310007947.png)

修改后执行 `source ~/.zshrc`就能看到效果。<br>用户名也可以自定义

# zsh

## 什么是zsh?

Zsh 也被称为 z Shell，它扩展了 Bourne Shell (sh)的功能，提供了更新的特性以及对插件和主题的更多支持。从2019年的 MacOS Catalina 开始，Zsh 成为 Mac 电脑中默认的登录和交互式 shell。<br>Zsh 本身既不美观也不智能，但它具有可扩展性，因此可以应用社区开发的插件使其美观而强大。<br>Zsh 非常受欢迎,它被发布到几乎所有 Unix 发行版(Ubuntu、Centos、macOS 等)的包存储库中，因此您可以使用包管理器轻松安装 Zsh

## antigen 用于 zsh 的插件管理器

### 什么是[antigen](https://github.com/zsh-users/antigen)？

Zsh 支持可插拔性,以便用户可以安装插件并扩展其功能。但是 Zsh 本身并没有提供很好的插件管理机制,包括获取、安装、更新、移除插件等。<br>Antigen很好地承担了这个责任。大多数 Zsh 插件都以 git 存储库的形式发布。 Antigen 允许我们简单地指定远程存储库的路径，然后它会在第一次运行时自动获取和安装。 Antigen 还提供了轻松更新和删除插件的命令。

### [安装antigen](https://github.com/zsh-users/antigen/wiki/Installation)

- curl

```shell
curl -L git.io/antigen > antigen.zsh
```

### [配置](https://github.com/zsh-users/antigen#usage)

```shell
## 导入antigen.zsh文件
source $HOME/antigen.zsh

## Load the oh-my-zsh's library. # 使用ohmyzsh
antigen use oh-my-zsh

## 添加要使用的ohmyzsh插件，可以在ohmyzsh项目plugins文件夹下找到
antigen bundle zsh-users/zsh-syntax-highlighting # 终端命令语法高亮
antigen bundle zsh-users/zsh-autosuggestions
antigen bundle zsh-users/zsh-completions # 命令自动补全 键盘命令自动补全 键盘 https://github.com/zsh-users/zsh-completions

antigen bundle extract
antigen bundle sublime
antigen bundle autojump
antigen bundle git

antigen bundle node
antigen bundle npm
antigen bundle yarn

antigen bundle pip
antigen bundle python
antigen bundle pip3
antigen bundle python3

antigen bundle fastlane
antigen bundle mac

antigen bundle command-not-found

# ZSH Config
DEFAULT_USER="hacket"
ZSH_DISABLE_COMPFIX=true
# ZSH_THEME="agnoster"

# Load the theme.
# antigen theme robbyrussell
# fixApplyTheme
[[ ! -z "$HasApplyThemeTag" ]] && echo "pass apply theme" || antigen theme robbyrussell/oh-my-zsh themes/agnoster
export HasApplyThemeTag=true

# Tell Antigen that you're done.
antigen apply
```

## oh my zsh

见下面

# Oh My Zsh

## Oh my zsh是什么？

**Oh my Zsh**是一个 Zsh 配置框架，它嵌入了一堆插件和主题；zsh没人用的原因就是过于复杂。

## Oh my zsh安装？

1. curl安装

> sh -c "$(curl -fsSL <https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh>)"

安装好 oh my zsh 后，在 Mac 的用户根目录下会多了 `.zshrc`配置文件和 `.oh-my-zsh` 目录。均为隐藏文件，通过快捷键 ` command + shift + .  `可以快速显示/隐藏

```shell
.oh-my-zsh文件
├───plugins       # 自带插件目录，每个插件目录下都有一个 README，有详细使用说明
├───themes        # 自带主题目录
└───custom        # 用户自定义目录
    ├───plugins   # 第三方插件目录
    └───themes    # 第三方主题目录
```

## zsh字体

### [powerline fonts](https://github.com/powerline/fonts)

```shell
# clone
git clone https://github.com/powerline/fonts.git --depth=1
# install
cd fonts
./install.sh
# clean-up a bit
cd ..
rm -rf fonts
```

### [nerd-fonts](https://github.com/ryanoasis/nerd-fonts#font-installation)

nerd font很多安装方式，推荐用homebrew<br>[homebrew 安装 nerd fonts](https://github.com/ryanoasis/nerd-fonts#option-4-homebrew-fonts)

```shell
brew tap homebrew/cask-fonts
brew install font-hack-nerd-font
```

## zsh插件

推荐插件：

- **git**：如效果图所见，显示git项目信息，还有各种 git 命令快捷方式；
- **z**：快速目录跳转， cd进入过某个目录后，可直接通过 **z 目录名** 快速跳转，而不需要输入完整路径；
- **zsh-syntax-highlighting**：常见命令高亮，输入错误为红色，正确为绿色，比如cd,ls,clear等；
- **zsh-autosuggestions**：命令提示，输入时会灰字提示推荐命令，直接键盘➡️补全，并不是 tab 键；

> 注意点：其中git 和z 插件是oh my zsh 自带的，可直接配置.zshrc文件 使用。另外两个需要安装

### git

查看所有git插件的配置：`~/.oh-my-zsh/plugins/git/git.plugin.zsh`

| **设置前的git命令**                  | **设置后的git命令** |
| ------------------------------ | ------------- |
| git add --all                  | gaa           |
| git branch -D                  | gbD           |
| git commit -a -m               | gcam          |
| git checkout -b                | gcb           |
| git checkout master            | gcm           |
| git clone --recurse-submodules | gcl           |

### [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)

在oh my zsh中安装：

```shell
# 下载插件
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 命令会将插件git clone 到 ~/.oh-my-zsh/custom/plugins 用户自定义插件目录下

# 在~/.zshrc激活插件
plugins=( [plugins...] zsh-syntax-highlighting)
```

### [autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 输入命令时会显示自动补全提示

安装教程：[zsh-autosuggestions/INSTALL.md at master · zsh-users/zsh-autosuggestions · GitHub](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)

**在oh my zsh中安装：**

```shell
# 下载插件
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 在~/.zshrc中激活
plugins=( 
    # other plugins...
    zsh-autosuggestions
)
```

**用`homebrew`安装：**

```shell
# 通过homebrew安装zsh-autosuggestions
brew install zsh-autosuggestions

# 在.zshrc文件配置插件
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)

# .zshrc文件 source zsh-autosuggestions.zsh
source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```

## 配置zsh主题

在`~/.zshrc`中配置`ZSH_THEME`

```shell
# theme
# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="agnoster"
# ZSH_THEME="powerlevel9k/powerlevel9k"
```

Oh my zsh主题查看：在`~/.oh-my-zsh/themes`<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683515137238-1729e9ba-d879-462d-b774-a98fe688345b.png#averageHue=%237a7b7a&clientId=u2345c8ec-0eda-4&from=paste&height=358&id=u5d12fef2&originHeight=956&originWidth=524&originalType=binary&ratio=2&rotation=0&showTitle=false&size=122096&status=done&style=none&taskId=u23bc984c-bf70-40fc-a5ec-53dd5f412d9&title=&width=196)

### 系统主题

### 第三方主题

#### [powerlevel9k（p9k）](https://github.com/Powerlevel9k/powerlevel9k) zsh下最棒的Powerline主题

Powerlevel9k主题可以用于 vanilla ZSH 或 ZSH 框架，如 oh-my-ZSH、 Prezto、 Antigen 等。<br>Powerlevel9k的四个主要目标：

- 开箱即用：让用户无需过多配置即可拥有一个让人眼前一亮的主题
- 极易定制：为那些想调整提示符的用户，提供更加语义化和模块化的方式直接在 ~/.zshrc 中进行配置。Powerlevel9k将提示符分割成不同的分段，用户可以使用这些内置的分段来自由组合最终的提示符。
- 提供丰富的配置分段(Segments)：内置分段涵盖使用场景非常多；从表示计算机状态的分段到单元测试覆盖率的分段再到 AWS 实例的分段，都有提供。
- 保证主题渲染的速度：Powerlevel9k 尽可能优化代码以提高执行速度

**安装 Powerlevel9k**<br>涉及两个步骤：

- [安装 Powerline 字体](https://github.com/Powerlevel9k/powerlevel9k/wiki/Install-Instructions#step-2-install-a-powerline-font)/nerd字体（p9k依赖[powerline/fonts](https://github.com/powerline/fonts)字体库） 安装步骤见`zsh字体`章节
- 安装 Powerlevel9k 主题

#### [powerlevel10k](https://github.com/romkatv/powerlevel10k)

提供漂亮的提示符，可以显示当前路径、时间、命令执行成功与否，还能够支持 git 分支显示等等

- 安装powerline字体/nerd字体
- 安装powerlevel10k主题

主题[powerlevel 10k](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fromkatv%2Fpowerlevel10k)，克隆到Oh My Zsh的主题目录，方式如下：

> git clone --depth=1 <https://github.com/romkatv/powerlevel10k.git> ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

然后去`~/.oh-my-zsh/custom/themes/`目录下看看有没有`powerlevel10k`就知道有没有安装成功了。

- 配置Oh My Zsh

  在 ~/.zshrc中设置`ZSH_THEME="powerlevel10k/powerlevel10k"`即可，

- 最后source ~/.zshrc，然后会引导你做一些配置，按需选择即可

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683516276211-ab0e00f9-122c-49aa-8681-8a38661262ae.png#averageHue=%231a1a1a&clientId=u2345c8ec-0eda-4&from=paste&height=304&id=u73bbd93d&originHeight=608&originWidth=1142&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89537&status=done&style=none&taskId=uce7cc5f4-1b8a-4fb9-841d-1b04bebe56b&title=&width=571)

- 如果想重新配置，执行`p10k configure`，并在最后一步选择覆盖原有的配置文件。

## 配色

### solarized

solarized是目前最完整的配色项目了，几乎覆盖主流的操作系统（Mac OS X，Linux，Windows）、编辑器和IDE（Vim，Emacs,Xcode等）、终端（Iterm2, Terminal.app等）<br>[下载链接](http://ethanschoonover.com/solarized/files/solarized.zip)<br>在solarized/iterm2-colors-solarized 下双击 `Solarized Dark.itermcolors` 和 `Solarized Light.itermcolors`两个文件就可以把配置文件导入到 iTerm2 里<br>在`iTerm→Preferences→Colors→color Presets→选择solarized Dark或Light`

## 其他配置

### 支持中文，防止乱码

```shell
# encode
export LANG=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

# 大佬完整的.zshrc配置

## `大圣.zshrc单独完整配置`

[zsh终端环境配置.zshrc 截止2023年08月19日.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1693487191712-ac2df86e-86a6-4c46-bc7a-567ab62d1941.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1693487191712-ac2df86e-86a6-4c46-bc7a-567ab62d1941.zip%22%2C%22name%22%3A%22zsh%E7%BB%88%E7%AB%AF%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.zshrc%20%E6%88%AA%E6%AD%A22023%E5%B9%B408%E6%9C%8819%E6%97%A5.zip%22%2C%22size%22%3A6192%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uc67e6e80-3424-43a1-b02a-78eb1e05160%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u28e4a15e%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[easyproxy_proxyman.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1692170245466-ade90fb0-c54c-4653-b748-09a301445590.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1692170245466-ade90fb0-c54c-4653-b748-09a301445590.sh%22%2C%22name%22%3A%22easyproxy_proxyman.sh%22%2C%22size%22%3A1299%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u93c51aff-2437-4179-a025-3fd3d4f207d%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u3c86580d%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[easyproxy.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1692170245458-243d97da-b341-45fc-9398-5db9b054bc12.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1692170245458-243d97da-b341-45fc-9398-5db9b054bc12.sh%22%2C%22name%22%3A%22easyproxy.sh%22%2C%22size%22%3A1299%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u9c8f3bfb-badb-4517-9209-f19cb3590b1%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22uf43a7551%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[script_of_justice.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1692170245478-873bd824-88eb-4178-8a69-2cdcf9137478.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1692170245478-873bd824-88eb-4178-8a69-2cdcf9137478.sh%22%2C%22name%22%3A%22script_of_justice.sh%22%2C%22size%22%3A586%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22ue1db15de-7d13-4041-a9ca-536b89a9f98%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u2a8b060d%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[work.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1692170427269-7db6ed72-f028-47ed-a1ca-889c4f7cb41e.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1692170427269-7db6ed72-f028-47ed-a1ca-889c4f7cb41e.sh%22%2C%22name%22%3A%22work.sh%22%2C%22size%22%3A439%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u0e8dd147-02b7-4cfe-8d4d-7d1bf2d8bb0%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22ue73ae702%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[click.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1692170245607-9c39afc5-ddc3-459b-b14b-65f1e658469a.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1692170245607-9c39afc5-ddc3-459b-b14b-65f1e658469a.sh%22%2C%22name%22%3A%22click.sh%22%2C%22size%22%3A169%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u4ae7d1a3-cd38-4aca-bb88-f6a0f020664%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u72b2bd84%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[git-batch.py](https://www.yuque.com/attachments/yuque/0/2023/py/694278/1693487237211-2fd117bb-48d9-424b-85da-fa3d5788ce62.py?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fpy%2F694278%2F1693487237211-2fd117bb-48d9-424b-85da-fa3d5788ce62.py%22%2C%22name%22%3A%22git-batch.py%22%2C%22size%22%3A15271%2C%22ext%22%3A%22py%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uacce4ed8-f3da-45e6-bb22-0ae634d3801%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-python-script%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22ua21d2171%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## 大圣zshrc和shell脚本分开

- .zshrc

```shell
source /etc/profile

#################################################################################################
############################################ antigen ############################################
#################################################################################################

## 导入antigen.zsh文件
source $HOME/antigen.zsh

## Load the oh-my-zsh's library. # 使用ohmyzsh
antigen use oh-my-zsh

## 添加要使用的ohmyzsh插件，可以在ohmyzsh项目plugins文件夹下找到
antigen bundle zsh-users/zsh-syntax-highlighting # 终端命令语法高亮
antigen bundle zsh-users/zsh-autosuggestions # 支持Zsh终端输入代码补全建议
# antigen bundle zsh-users/zsh-completions # 命令自动补全 键盘命令自动补全 键盘 https://github.com/zsh-users/zsh-completions
# antigen bundle zsh-users/zsh-history-substring-search # 支持方向键上下移动按关键字搜索历史命令 https://github.com/zsh-users/zsh-history-substring-search/issues/113
# antigen bundle zsh-users/zsh-apple-touchbar

antigen bundle extract
antigen bundle sublime
antigen bundle autojump
antigen bundle git

antigen bundle node
antigen bundle npm
antigen bundle yarn

antigen bundle pip
antigen bundle python
antigen bundle pip3
antigen bundle python3

antigen bundle fastlane
antigen bundle mac

antigen bundle command-not-found

# ZSH Config
DEFAULT_USER="hacket"
ZSH_DISABLE_COMPFIX=true
# ZSH_THEME="agnoster"

# Load the theme.
# antigen theme robbyrussell
# fixApplyTheme
[[ ! -z "$HasApplyThemeTag" ]] && echo "pass apply theme robbyrussell" || antigen theme robbyrussell/oh-my-zsh themes/agnoster
export HasApplyThemeTag=true

# Tell Antigen that you're done.
antigen apply


# # # oh my zsh
# if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
#   source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
# fi

# # 指定了命令行终端的主题，这里使用的是 Powerlevel10k 主题
# ZSH_THEME="powerlevel10k/powerlevel10k"
# [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh



# ## default EDITOR
# export EDITOR="vi"
# ## source ohmyzsh
# source $ZSH/oh-my-zsh.sh

# ## encode
export LANG=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# ## To customize prompt, run `p10k configure` 


#################################################################################################
############################################# PATH ##############################################
#################################################################################################

# PATH
## Gradle
GRADLE_HOME=$HOME/Library/gradle-4.6
export GRADLE_HOME
GRADLE_USER_HOME=$HOME/.gradle
export GRADLE_USER_HOME
## Android 
ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_HOME
## Flipper use
ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT
## JAVA
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export JAVA_HOME 

## Flutter

### Flutter镜像
#### 社区镜像
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

#### 腾讯开源的镜像站（与TUNA同步，定时更新）
# export PUB_HOSTED_URL=https://mirrors.cloud.tencent.com/dart-pub
# export FLUTTER_STORAGE_BASE_URL=https://mirrors.cloud.tencent.com/flutter

#### 上海交通大学 Linux 用户组的镜像站（与原站实时更新）
# export PUB_HOSTED_URL=https://dart-pub.mirrors.sjtug.sjtu.edu.cn
# export FLUTTER_STORAGE_BASE_URL=https://mirrors.sjtug.sjtu.edu.cn

#### CNNIC的镜像站 （与TUNA同步）
# export PUB_HOSTED_URL=http://mirrors.cnnic.cn/dart-pub
# export FLUTTER_STORAGE_BASE_URL=http://mirrors.cnnic.cn/flutter

#### 清华大学 TUNA 协会的镜像站（与Flutter社区同步，推荐）
# export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub
# export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter

### 单个Flutter版本
# export FLUTTER3_HOME=~/flutter/flutter3
# export FLUTTER2_HOME=~/flutter/flutter_macos_2.10.5-stable
# export FLUTTER_HOME=/Users/10069683/WorkSpace/shein/romwe_flutter_module/.flutter
# export PATH=$FLUTTER3_HOME/bin:$FLUTTER2_HOME/bin:$FLUTTER_HOME/bin:$PATH

### fvm管理多个Flutter版本
export FVM_HOME=$HOME/fvm
export FLUTTER_ROOT=$FVM_HOME/default
export PATH=~/fvm/default/bin:$PATH


export PATH=$HOME/.pub-cache/bin:$PATH

export PATH=/bin:/sbin:/usr/bin/:$HOME/bin:/usr/local/bin:$PATH

## Android
export PATH=$GRADLE_HOME/bin:$$ANDROID_SDK_ROOT:$ANDROID_SDK_ROOT/tools/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/34.0.0:$PATH

## HomeBrew
export PATH=/opt/homebrew/bin:$PATH

## crontab -e用vscode打开编辑
export VISUAL=~/code-wait.sh
export EDITOR=~/code-wait.sh
function crontab:vscode() {
  EDITOR='code' crontab -e
}


#################################################################################################
############################################ zshrc ##############################################
#################################################################################################
export ZSHRC_DIR=${${(%):-%x}:A:h} # 获取当前脚本的绝对路径
export ZSHRC=$ZSHRC_DIR/.zshrc 
export COMMON_PROFILE=$ZSHRC_DIR/.common_profile.sh

[ -f $COMMON_PROFILE ] && source $COMMON_PROFILE # 存在COMMON_PROFILE文件就加载

```

- .common_profile.sh

```shell
#!/bin/zsh

echo ".common_profile.sh start work"


#################################################################################################
############################################ 一些变量 ############################################
#################################################################################################

MAIN_APP_ID=com.zzkko # 主要开发的APP shein
MAIN_APP_SPLASH=$MAIN_APP_ID/com.shein.welcome.WelcomeActivity
SECOND_APP_ID=com.romwe # 次要开发的APP romwe
SECOND_APP_SPLASH=$SECOND_APP_ID/com.romwe.work.home.SplashUI

WEWORK_APP=com.tencent.wework # 企业微信
WX_APP=com.tencent.mm # 微信
KING_APP=me.hacket.assistant.samples # 大圣助手king
DEVKIT_APP=me.hacket.assistant.devkit # devkit辅助工具

WORKSPACE_MAIN=~/Workspace/shein # 主工程
WORKSPACE_BUG=~/Workspace/bugfix/shein # bug工程

GITS=~/py/git-batch/git-batch.py # git多仓库拉取的py脚本

HACK_HOME=${HOME}/software/decompile # 存放反编译脚本的目录
CHARLES_HOME=${HOME}/charles

CHARLES_PROXY_PORT=8888
PROXY_PORT_PROXYMAN=9091

ANDROID_HOME=$HOME/Library/Android/sdk
GRADLE_HOME=$HOME/Library/gradle-4.6
GRADLE_USER_HOME=$HOME/.gradle
ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
# FLUTTER_HOME=~/flutter

VISUAL=~/code-wait.sh
EDITOR=~/code-wait.sh

SHELL_HOME=~/.sh # 存放shell脚本主目录
USER_HOME=/Users/10069683 # 用户目录

alias adb='~/Library/Android/sdk/platform-tools/adb'



#################################################################################################
############################################# PATH ##############################################
#################################################################################################

# PATH
## Gradle
# export GRADLE_HOME
# export GRADLE_USER_HOME
# ## Android 
# export ANDROID_HOME
# export ANDROID_SDK_ROOT ## Flipper use
# ## JAVA
# export JAVA_HOME 
# ## Flutter
# export FLUTTER_HOME
# export PUB_HOSTED_URL=https://pub.flutter-io.cn
# export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
# export PATH="$PATH":"$HOME/.pub-cache/bin"

# export PATH=/bin:/sbin:/usr/bin/:$HOME/bin:/usr/local/bin

# ### Android
# export PATH=$GRADLE_HOME/bin:$ANDROID_HOME:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$FLUTTER_HOME/bin:$PATH

# ### HomeBrew
# export PATH=/opt/homebrew/bin:$PATH

# ## crontab -e用vscode打开编辑
# export VISUAL
# export EDITOR
# function crontab:vscode() {
#   EDITOR='code' crontab -e
# }

#################################################################################################
############################################ alias #############################################
#################################################################################################

# alias
## common
alias cls='clear'
alias ll='ls -l'
alias la='ls -a'
alias vi='vim'

## md5/sha1
alias check:md5='md5'
alias check:sha1='openssl dgst -sha1'
alias check:sha256='openssl dgst -sha256's
alias check:sha512='openssl dgst -sha512'


#################################################################################################
############################################ common #############################################
#################################################################################################

function checkOpts() {
    local key=$1
    if [[ -z "${key}" ]] ; then
        echo -e "\033[31mFATAL: $2 should not be empty! \033[0m"
        return 0 
    fi 
}

##############################################
################## honebrew ##################
##############################################
alias brew:info='brew info'
alias brew:info:cask='brew cask info'
alias brew:install='brew install'
alias brew:install:cask='brew cask install'
alias brew:uninstall='brew uninstall'
alias brew:uninstall:cask='brew cask uninstall'
alias brew:reinstall='brew reinstall --force'
alias brew:reinstall:cask='brew cask reinstall --force'
alias brew:search='brew search'
alias brew:doctor='brew doctor'
alias brew:update='brew update'
alias brew:upgrade='brew upgrade; brew upgrade --cask;'
alias brew:cleanup='brew cleanup;brew cask cleanup;'
alias brew:repair='sudo chown -R $(whoami) $(brew --prefix)/*'
alias brew:ls='brew:list'
### 列举brew已经安装的软件
function brew:list() {
    echo "\n\033[42;30m brew list: \033[m"
    brew list
    # echo "\n\033[42;30m brew list --cask: \033[m"
    # brew list --cask
    echo ""
}

### brew 安装必要QuickLook插件
function brew:quicklook:init() {
    brew install qlcolorcode # 高亮代码
    brew install qlstephen # 无后缀名的文本文件
    brew install qlmarkdown # markdown
    brew install quicklook-json # json
    brew install quicklook-csv # 更好查看csv文件
    brew install quicklook-pat
    brew install qlprettypatch
    brew install qlimagesize
    brew install webpquicklook
    brew install quicklookapk
    brew install betterzip # 预览zip文件
    brew install suspicious-package
    brew install apparency
    brew install quicklookase
    brew install qlvideo # 预览视频
    brew install provisionql
}

### brew必要的Tools:
function brew:tool:init() {
    brew install tree
    brew install exa
    brew install bat
    brew install fzf
    brew install dust
    brew install delta
    brew install glances
    brew install neofetch
    brew install bandwhich
    brew install grex
    brew install tealdeer
    brew install tokei
    brew install ripgrep
    brew install procs
    brew install jadx # https://github.com/skylot/jadx#install
    brew install apktool # https://apktool.org/docs/install/#brew
    brew install scrcpy # scrcpy：https://github.com/Genymobile/scrcpy/blob/master/doc/macos.md
    brew install android-platform-tools # scrcpy依赖的adb
    brew install shellcheck # shell脚本语法检查 https://github.com/koalaman/shellcheck
    brew install launchcontrol
    # brew tap dart-lang/dart # dart https://dart.dev/get-dart#install
    # brew install dart
}

##############################################
#################### git #####################
##############################################
## git
# Git https://blog.csdn.net/dwarven/article/details/46550117
function git:author:lines() {
    userName=""
    if [ -z $1 ]; then
        userName=`git config --get user.name`
    else
        userName="$1"
    fi
    echo " $userName :"
    git log --author="$userName" --pretty=tformat: --numstat | awk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf " Added   Lines: %s \n Removed Lines: %s \n Total   Lines: %s\n",add,subs,loc }'
}
function git:majority:author:name() {
    topCount=10
    if [ ! -z $1 ]; then
        topCount=$1
    fi
    git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n $topCount
}
function git:majority:author:email() {
    topCount=10
    if [ ! -z $1 ]; then
        topCount=$1
    fi
    git log --pretty=format:%ae | awk -- '{ ++c[$0]; } END { for(cc in c) printf "%5d %s\n",c[cc],cc; }' | sort -u -n -r | head -n $topCount
}
function git:count:author() {
    git log --pretty='%aN' | sort -u | wc -l
}
function git:count:commit() {
    git log --oneline | wc -l
}
function git:tag:cleanup() {
    git tag | xargs git tag -d
}

function git:submodule() {
  git submodule # 查看当前repo的submodule
}
function git:submodule:add() {
  git submodule add $1 $2 # 在当前路径add submodule
}
function git:submodule:update() {
  git submodule update --remote # 以checkout的方式更新 
}
function git:submodule:delete() {
  git rm --cached $1
  # git rm --cached <本地路径>
  rm -rf $1
  rm .gitmodules
}

##############################################
################## gradle ####################
##############################################
## Gradle
alias gw='./gradlew' # gradlew命令
function g:clean() {
  ./gradlew clean
}
function g:aDebug() {
  ./gradlew assembleDebug
}
function g:aRelease() {
  ./gradlew assembleRelease
}


##############################################
#################### proxy ###################
##############################################
function proxyhelper() {
    local operator=$1 #=号两边不能有空格
    if [[ -z "${operator}" ]] ; then 
        echo -e "\033[31mFATAL: 请输入合法的proxyhelper命令： \033[0m"
        echo "设置代理：本机IP:8888       proxyhelper set"
        echo "设置代理：本机IP:port       proxyhelper set port"
        echo "设置代理： ip:port         proxyhelper set ip port"
        echo "获取当前代理：              proxyhelper get"
        echo "删除代理：                 proxyhelper clear"
        return 0
    fi
    if [[ "$operator" == "set" ]];then
        if [ $# -eq 3 ]; then # set后2个参数的是ip:port
            IP=$2
            PROT=$3
            echo "设置自定义代理 $IP:$PROT"
            adb shell settings put global http_proxy $IP:$PROT
        elif [ $# -eq 2 ]; then # set后1个参数的是port
            PROT=$2
            # 获取 IP
            ip=$(/sbin/ifconfig | /usr/bin/sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
            # echo $ip
            count=$(echo $ip | /usr/bin/tr ' ' '\n' | /usr/bin/wc -l )
            if [ $count -gt 1 ];then
                echo "多个ip, 请手动选择一个"
                exit
            fi
            default_proxy=${ip}":$PROT"
            echo "设置代理为本机IP: $default_proxy"
            adb shell settings put global http_proxy $default_proxy
        else # 0个参数的是默认端口：8888
            # 获取 IP
            ip=$(/sbin/ifconfig | /usr/bin/sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
            # echo $ip
            count=$(echo $ip | /usr/bin/tr ' ' '\n' | /usr/bin/wc -l )
            if [ $count -gt 1 ];then
                echo "多个ip, 请手动选择一个"
                exit
            fi
            default_proxy=${ip}":$CHARLES_PROXY_PORT"
            echo "设置代理为本机IP(默认port:8888): $default_proxy"
            adb shell settings put global http_proxy $default_proxy
        fi
    elif [[ $operator == "get" ]];then
        echo "当前代理："
        adb shell settings get global http_proxy
    elif [[ $operator == "clear" ]];then
        echo "清除代理成功！"
        adb shell settings put global http_proxy :0
        # 下面的方式需要重启手机
        # adb shell settings delete global http_proxy
        # adb shell settings delete global global_http_proxy_host
        # adb shell settings delete global global_http_proxy_port
    else
        echo -e "\033[31mFATAL: 请输入合法的proxyhelper命令： \033[0m"
        echo "设置代理：本机IP:8888       proxyhelper set"
        echo "设置代理：本机IP:port       proxyhelper set port"
        echo "设置代理： ip:port         proxyhelper set ip port"
        echo "获取当前代理：              proxyhelper get"
        echo "删除代理：                 proxyhelper clear"
    fi
}
## charles proxy抓包
function proxy:on() { # 设置charles全局代理
  proxyhelper set $CHARLES_PROXY_PORT
  # ~/.sh/easyproxy.sh set
}
function proxyman:on() { # 设置proxyman全局代理
  proxyhelper set $PROXY_PORT_PROXYMAN
}
function proxy:get() { # 获取当前代理
  proxyhelper get
}
function proxy:off() { # 清除charles全局代理
  proxyhelper clear
}


##############################################
#################### adb #####################
##############################################

function adb:focus() { # 查看当前焦点Activity并复制到剪切板
  # result=`adb shell dumpsys window |grep mCurrentFocus`
  result=$(adb shell dumpsys window |grep mCurrentFocus)
  echo $result
  echo $result | pbcopy
}

function adb:input() { # 模拟输入
  adb shell input text "$1"
}
function adb:install() {
  adb install -r -t "$1"
}
function adb:uninstall() {
  echo 'uninstall '$MAIN_APP_ID
  adb uninstall $MAIN_APP_ID
}
function adb:uninstall:romwe() {
  echo 'uninstall '$SECOND_APP_ID
  adb uninstall $SECOND_APP_ID
}
function adb:5037() {
  lsof -i tcp:5037 ##查看占用5037
}
function adb:kill() {
  adb kill-server
}

#### 重启某个启动，参数应用包名
function adb:stop() { # 停止一个组件
  adb shell am force-stop $1
}
function adb:stop:shein() {
  adb:stop $MAIN_APP_ID
}
function adb:stop:romwe() {
  adb:stop $SECOND_APP_ID
}

function adb:start() { # 显示启动一个组件
  adb shell am start -n $1
}
function adb:start:intent() { # 显示启动一个组件
  adb shell am start -a android.intent.action.VIEW # -d  http://www.baidu.cn/
}
function adb:start:browser() { 
  # 启动浏览器
  # 显示：adb shell am start -n com.android.browser/com.android.browser.BrowserActivity
  # adb:start com.android.browser/com.android.browser.BrowserActivity

  # 隐式：adb shell am start -a android.intent.action.VIEW -d  http://www.baidu.cn/
  adb shell am start -a android.intent.action.VIEW -d  http://www.baidu.cn/
}
function adb:start:via() {
  adb:stop $1
  # adb shell monkey -p $1 -c android.intent.category.LAUNCHER 1 
  adb:start mark.via.gp/mark.via.Shell # 启动Via
}
function adb:start:shein() {
  adb:stop $MAIN_APP_ID
  adb:start $MAIN_APP_SPLASH
}
function adb:start:romwe() {
  adb:stop $SECOND_APP_ID
  adb:start $SECOND_APP_SPLASH
}

#### 重启企业微信
function adb:start:wework() {
  adb shell am force-stop $WEWORK_APP
  adb shell monkey -p $WEWORK_APP -c android.intent.category.LAUNCHER 1 
}

### adb debug 调试
function adb:debug:shein() { # 启动时调试模式
  adb shell am set-debug-app -w --persistent $MAIN_APP_ID
}
function adb:debug:romwe() { # 启动时调试模式
  adb shell am set-debug-app -w --persistent $SECOND_APP_ID
}
function adb:debug:clear() { # 清除启动时的调试模式
  adb shell am clear-debug-app
}
function adb:debug:king() {
  adb shell am set-debug-app -w --persistent $KING_APP
}

### adb applink
function adb:applink() { # 查看applink情况，参数应用包名；不带参数就是查看手机上的所有包
  adb shell pm get-app-links $1
}
function adb:applink:shein() {
  adb shell pm get-app-links $MAIN_APP_ID
}
function adb:applink:romwe() {
  adb shell pm get-app-links $SECOND_APP_ID
}
function adb:applink:reverify:shein() {
  adb shell pm verify-app-links --re-verify $MAIN_APP_ID
}
function adb:applink:reverify:romwe() {
  adb shell pm verify-app-links --re-verify $SECOND_APP_ID
}

### others
function adb:debugtools() {
  # 打开辅助开发工具
  adb shell am start -n $DEVKIT_APP/.SettingsToolsActivity
}
function adb:debugtools:test() {
  # 打开辅助开发工具
  adb shell am start -n $DEVKIT_APP/.SettingsToolsActivity
  # App的WebSocket服务端地址
  echo 'ws://10.102.177.66:8800/mock' | pbcopy
  # PC浏览器打开 http://www.websocket-test.com/
  open 'http://www.websocket-test.com/'
}

#### 启动via app mark.via.gp/mark.via.Shell，然后输入文本，最后按回车键
#### 可用来测试deeplink跳转
function adb:via() {
  echo "stop Via app."
  adb shell am force-stop mark.via.gp
  
  echo "start Via app."
  adb shell am start -n mark.via.gp/mark.via.Shell
  
  sleep 2
  echo "input tap 500 1033"
  # 模拟按2次tab键盘到tab，才能定位到EditText，好像经常找不到焦点
  # adb shell input keyevent KEYCODE_TAB
  # adb shell input keyevent KEYCODE_TAB
  adb shell input tap 500 1033 

  echo "input text $1"
  adb shell input text "$1"

  echo "send keyevent KEYCODE_ENTER"
  adb shell input keyevent KEYCODE_ENTER
}

function adb:leakcanary:shein() { 
  adb:leakcanary $MAIN_APP_ID
}
function adb:leakcanary:romwe() {
  adb:leakcanary $SECOND_APP_ID
} 
function adb:leakcanary:king() {
  adb:leakcanary $KING_APP
}
#### 启动/关闭 LeakCanary的Dump heap automatically
function adb:leakcanary() {
  applicationId=$1
  if [[ -z "${applicationId}" ]] ; then 
    echo -e "\033[31mFATAL: 请输入合法的applicationId \033[0m"
    return 0
  fi

  echo "start $applicationId App LeakLauncherActivity page"
  adb shell am start -n $applicationId/leakcanary.internal.activity.LeakLauncherActivity

  # 休眠2秒，启动Activity需要一定的时间
  sleep 2

  echo "Simulated click \"About\" tab"
  adb shell input tap 915 2190 

  sleep 1

  echo "Simulated click \"Dump heap automatically\""
  adb shell input tap 500 2000

  adb shell input keyevent 4 # 模拟返回键
}

#### deeplink测试，value中如果带了” & 等符合要转义
#### adb:deeplink 'sheinlink://applink/pushtoweb2?data={\"url\":\"https://www.baidu.com?aaa=xx\&bbb=yyy\"}' 
function adb:deeplink() {
  # 快速测试deeplink跳转
  echo $1
  #adb shell am start -a android.intent.action.VIEW -d $1
  adb shell am start -a android.intent.action.VIEW -d $1
}
function adb:deeplink:sleep() {
  # 模拟sleep 8秒后跳转
  sleep 8 
  # 快速测试deeplink跳转
  adb shell am start -a android.intent.action.VIEW -d $1
}

# 模拟测试fb ddl的流程: shein
function adb:fbddl:shein() {
    APK_BUILD_PATH=$WORKSPACE_MAIN/shein_android/shein/build/outputs/apk/
    test_link_splash=com.facebook.katana/com.facebook.katana.LoginActivity
    adb:deferredlink $MAIN_APP_ID $APK_BUILD_PATH $test_link_splash
}
# 模拟测试fb ddl的流程: romwe
function adb:fbddl:romwe() {
    APK_BUILD_PATH=$WORKSPACE_MAIN/shein_android/shein/build/outputs/apk/
    test_link_splash=com.facebook.katana/com.facebook.katana.LoginActivity
    adb:deferredlink $SECOND_APP_ID $APK_BUILD_PATH $test_link_splash
}

# 模拟测试gpir的流程: shein
function adb:gpir:shein() {
    APK_BUILD_PATH=$WORKSPACE_MAIN/shein_android/shein/build/outputs/apk/
    test_link_splash=com.pushbullet.android/com.pushbullet.android.ui.LaunchActivity
    adb:deferredlink $MAIN_APP_ID $APK_BUILD_PATH $test_link_splash
}
# 模拟测试gpir的流程: romwe
function adb:gpir:romwe() {
    APK_BUILD_PATH=$WORKSPACE_MAIN/romwe_android/app/build/outputs/apk/
    test_link_splash=com.pushbullet.android/com.pushbullet.android.ui.LaunchActivity
    adb:deferredlink $SECOND_APP_ID $APK_BUILD_PATH $test_link_splash
}

# 模拟测试deferredlink的流程
function adb:deferredlink() {
    echo '参数：' $@
    # 校验输入参数的正确性：
    ## 参数1：应用包名，如：me.hacket.assistant
    ## 参数2：存放apk包的路径，如：相对路径也可以
    ## 参数3：splas页，通过什么APP的启动页点击链接去到Google Play的，如：com.pushbullet.android/com.pushbullet.android.ui.LaunchActivity
    if [ $# -lt 2 ]; then # 大于或等于2个参数
      echo -e "\033[31mFATAL 请输入至少2个参数，参数1：应用包名，参数2：包路径 \033[0m"
      echo "当前参数 $*"
      return 0
    fi
    applicationId=$1
    if [[ -z "${applicationId}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的applicationId： \033[0m"
      return 0
    fi
    apk_build_path=$2
    if [[ -z "${apk_build_path}" ]] ; then 
      echo -e "\033[31mFATAL: 请输入合法的apk_build_path： \033[0m"
      return 0
    else 
      # 这里的-d参数判断目录是否存在
      if [ ! -d "${apk_build_path}" ]; then
        echo -e "\033[31mFATAL: $apk_build_path 目录不存在 \033[0m"
        return 0
      fi
    fi
    test_link_splash=$3
    if [[ -z "${path}" ]] ; then 
      echo -e "\033[31mFATAL: 没有输入splash页，默认为Pushbullet的splash： \033[0m"
      splash=com.pushbullet.android/com.pushbullet.android.ui.LaunchActivity
    fi

    echo '1. cd ' $apk_build_path
    cd $apk_build_path
    final_apk_path=$(find $apk_build_path -name  "*.apk")
    echo '2. find apk: ' $final_apk_path

    # 卸载App
    echo "3. 卸载$applicationId"
    adb uninstall $applicationId

    # 去掉代理
    echo '4. 清除手机Charles等抓包代理（代理会影响applinks的校验）'
    proxy:off

    echo '5. 杀死Google Play Store进程（避免影响测试）'
    adb shell am force-stop com.android.vending

    echo "6. 点击带Google Play Install Referrer的链接到Google Play Store, 点击安装按钮到下载中，然后取消来安装测试包（线上包不好调试/抓包）"
    echo " |--启动 $test_link_splash"
    adb shell am start -n $test_link_splash
    echo " |--点击链接到Google Play Store下载后，然后取消，按任意按键继续"
    read temp

    echo "7. 安装测试包：$final_apk_path"
    # 安装要测试的App
    adb install -r -t "$final_apk_path"

    echo "8. 休息3秒，等待 $applicationId 的applinks的校验(需要Android12及以上的手机)"
    echo "  |-- 如果结果返回none或1024继续重新执行命令，直到返回verified：adb shell pm verify-app-links --re-verify $applicationId 命令校验applinks"
    echo "  |-- 等个几秒再用命令adb shell pm get-app-links $applicationId 查看校验结果"
    # 等待校验applinks
    /bin/sleep 3

    echo "9. 获取 $applicationId 的applinks校验结果(会连接Google校验，需要科学上网，关闭抓包等代理，返回verified表示校验成功)"
    # 查看applinks
    adb shell pm get-app-links $applicationId

    echo "10. 开启手机Charles抓包代理"
    # 开启代理
    proxy:on

    echo "11. 重新打开 $applicationId，开始测试Google Play Install Referrer吧"
    echo "  |-- 即将启动shein"
    if [ "$applicationId" = "$MAIN_APP_ID" ]; then
      adb shell am start -n $MAIN_APP_SPLASH
    elif [ "$applicationId" = "$SECOND_APP_ID" ]; then
      adb shell am start -n $SECOND_APP_SPLASH
    fi
}


function getWidthAndHeight() {
    # adb shell wm size
    # Physical size: 1440x2560
    w=$(adb shell wm size | awk '{print $3}' | awk -F'x' '{print $1}')
    h=$(adb shell wm size | awk '{print $3}' | awk -F'x' '{print $2}')
    echo "${w}"x"${h}"
}
function checkffmpeg() {
    if brew ls --versions ffmpeg > /dev/null; then
        echo 'ffmpeg已安装'
    else
        echo 'ffmpeg未安装'
        echo '开始安装ffmpeg'
        brew install ffmpeg
    fi
}
# mp4转gif
function adb:record() {
    checkffmpeg
    if [ $# -lt 1 ]; then # 大于或等于1个参数
    echo -e "\033[31mFATAL 请输入至少1个参数，参数1：录制时间，单位秒 \033[0m"
    echo "当前参数 $*"
    return 0
  fi
    # read -p "请输入录制时间（单位秒）:" t
    # if [ -z "$t" ]; then
    #     echo "录制时间不能为空"
    #     exit 1
    # fi
    echo -e '录制时间为:' $1 '秒'
    echo -e '开始录制' 
    adb shell screenrecord  --time-limit $1 /sdcard/demo.mp4
    adb pull /sdcard/demo.mp4 > /dev/null 

    # 获取时间戳
    currentTimeStamp=$(date +%s)
    echo $currentTimeStamp

    # 获取设备分辨率
    size=$(getWidthAndHeight)
    echo "设备分辨率：${size}"

    # 'ffmpeg转换' 
    ffmpeg -i demo.mp4 -s "$size" -r 10 target-$currentTimeStamp.gif 
    # '删除缓存的视频' 
    rm -f demo.mp4
    # '输出打开我们最后的gif /r' 
    echo "$(cd `dirname $0`; pwd)"/target-$currentTimeStamp.gif
    open .
}

##############################################
################### open #####################
##############################################

### 打开zshrc文件
function open:zshrc() {
  open ~/.zshrc
}
### ~/Library/LaunchAgents
function open:launchagent() {
  open ~/Library/LaunchAgents
}
### launchctl
function launch:list() { # list
  cd ~/Library/LaunchAgents
  launchctl list |grep $1
}
function launch:load() { # load
  cd ~/Library/LaunchAgents
  launchctl load -w $1
}
function launch:unload() { # unload
  cd ~/Library/LaunchAgents
  launchctl unload $1
}

### source zshrc文件
function source:zshrc() {
  source ~/.zshrc
}

### 打开home目录
function open:home() {
  open ~
}


##############################################
################# git-batch ##################
##############################################

## gits 批量处理git仓库
alias py='python3' # 默认使用Python3
alias gits="python3 $GITS"

#### 将~/py/git-batch/clone.txt目录下的repo全部clone下到当前位置
function gits:clone() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS clone -f ~/py/git-batch/clone.txt -p $WORKSPACE_MAIN
}

#### 主工程 gits:checkout master 所有分支切换到master
function gits:checkout() { 
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS checkout $1
}
#### 主工程 gits:pull master 所有分支先切换到master，然后pull，不传递参数pull当前分支
function gits:pull() { 
  cd $WORKSPACE_MAIN
  pwd
  echo $0  $1
  python3 $GITS pull $1
}
#### 主工程 push指定分支，如果指定分支本地没有，就不会push python3 git-batch.py branch 9.5.4/user-zfs
function gits:push() {
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS push $1
}
#### 查看主工程 所有仓库当前分支名
function gits:query() {
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS query $1
}
function gits:status() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS status
}
function gits:delete() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS delete $1
}

function gits:clone:bug() {
  cd $WORKSPACE_BUG
  pwd
  python3 $GITS clone -f ~/py/git-batch/clone.txt -p $WORKSPACE_BUG
}
### bug工程 gits:checkout master 所有分支切换到master
function gits:checkout:bug() { 
  cd $WORKSPACE_BUG
  pwd
  echo $0  $1
  python3 $GITS checkout $1
}
function gits:pull:bug() { 
  cd $WORKSPACE_BUG
  pwd
  echo $0  $1
  python3 $GITS pull $1
}
function gits:push:bug() {
  cd $WORKSPACE_BUG
  pwd
  echo $0 $1
  python3 $GITS push $1
}
function gits:query:bug() {
  cd $WORKSPACE_BUG
  pwd
  echo $0 $1
  python3 $GITS query $1
}
function gits:delete:bug() {
  cd $WORKSPACE_BUG
  pwd
  python3 $GITS delete $1
}

##############################################
################## tomcat ####################
##############################################

## tomcat
TOMCAT_HOME=~/Downloads/apache-tomcat-9.0.75
function tomcat:start() {
  echo ${${(%):-%x}:A:h}
  $TOMCAT_HOME/bin/startup.sh
}
function tomcat:stop() {
  $TOMCAT_HOME/bin/shutdown.sh
}


##############################################
################# 工作相关 ####################
##############################################

## 进程
### 获取某个进程的pid pid:print '企业微信'
function pid:print() {
  ps -ef | grep $1
  ps -ef | grep $1 | awk 'NR==1{print $2}'
  # 或者  ps -e | grep ClashX.app | awk 'NR==1{print $1}'
}
### macOS根据名称杀死进程 pid:kill '企业微信'
function pid:kill() { 
  ps -ef | grep $1 | awk 'NR==1{print $2}' | xargs kill -9
}
### 杀死常用的APP
function pid:kill:all() {
  pid:kill 企业微信
  pid:kill WeCom
  pid:kill WeChat
  pid:kill Google\ Chrome
  pid:kill AndroidStudioPreview
  pid:kill AndroidStudioBeta0622
  pid:kill PyCharm
  pid:kill Fork
  pid:kill Microsoft\ Edge
  pid:kill Microsoft\ Edge\ Dev
  pid:kill Visual\ Studio\ Code
  pid:kill Terminal
  pid:kill iTerm
  pid:kill Flipper
  pid:kill Charles
  pid:kill 语雀
  pid:kill 有道云笔记
  pid:kill TickTick
  pid:kill TeamViewer
  pid:kill ToDesk
  pid:kill Proxifier
  pid:kill ClashX
  pid:kill scrcpy
  pid:kill Postman
}

## cp相关
WORK_ID=10069683
WOEK_EMAIL=neozeng@shein.com
function cp:id() { # 拷贝工号ip
  echo $WORK_ID | pbcopy | echo $WORK_ID copied
}
function cp:email() { # 拷贝工作邮箱
  echo $WOEK_EMAIL | pbcopy | echo $WOEK_EMAIL copied
}
function cp:pwd() { # 拷贝当前路径
  pwd | pbcopy
}
function cp:ip() { # 拷贝当前IP
  # 获取 IP
  ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
  # echo $ip
  count=$(echo $ip | tr ' ' '\n' | wc -l )
  if [ $count -gt 1 ];then
    echo "多个ip, 请手动选择一个"
    exit
  fi
  echo "$ip" | pbcopy | echo ip copied
}
function cp:ws() { # 获取websocket测试链接
  # ws://10.102.156.58:8800/mock
  ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
  echo "ws://$ip:8080/mock" | pbcopy | echo "ws://$ip:8080/mock" copied
}

## Terminal开启和关闭proxy
function ss:on() {
    local_hosts="127.0.0.1:7890"
    export http_proxy="http://${local_hosts}" https_proxy="http://${local_hosts}" ftp_proxy="http://${local_hosts}" all_proxy="socks5://${local_hosts}"
    echo "proxy on"
}
function ss:off() {
    unset http_proxy https_proxy ftp_proxy all_proxy
    echo "proxy off"
}

## Open

### 用Android Studio打开文件


function open:as() {
  # 以AS打开一个项目
  open -a /Applications/AndroidStudioBeta0622.app $1
}
function open:gradle() {
  # 打开gradle文件夹
  open $USER_HOME/.gradle
}
function open:initgradle() {
  # 打开nit.gradle文件
  open $GRADLE_USER_HOME/init.gradle
}
function open:charles() {
  # 打开存放charles模拟的数据的目录
  open $CHARLES_HOME
}

### 打开AS工作目录
function open:workspace() {
  open ~/Workspace
}
### 启动工作所需APP、脚本
function open:work:sh() {
  $SHELL_HOME/work.sh
}
function open:gohome() {
  $SHELL_HOME/go_home.sh
}

# 反编译

alias apktool="apktool d -s "
alias dex2jar="$HACK_HOME/dex-tools-2.1-20190905-lanchon/d2j-dex2jar.sh "
alias dex2jar2="$HACK_HOME/dex2jar-2.0/d2j-dex2jar.sh "
alias jadx="$HACK_HOME/jadx-1.4.7/bin/jadx "
alias jadx-gui="$HACK_HOME/jadx-1.4.7/bin/jadx-gui "
alias classyshark="java -jar $HACK_HOME/ClassyShark.jar -open "
# 查看keystore的指纹：MD5、SHA1、SHA256，新版的keytool不支持MD5了
function keytool:list() {
  keytool -list -v -keystore $1
}
function keytool:list:md5() {
  keytool -exportcert -keystore $1 | openssl dgst -md5
}

### click.sh
function click() {
  sh $SHELL_HOME/click.sh $1
}

## 查询ip
alias ip="curl -i http://ip.cn"

## 工作特定的脚本

### 过时的分支管理脚本
alias git_branch="sh $WORKSPACE_MAIN/git_branch.sh"
alias git_branch_name="sh $WORKSPACE_MAIN/git_branch_name.sh"
alias git_branch_bugfix="sh $WORKSPACE_BUG/git_branch.sh"
alias git_branch_name_bugfix="sh $WORKSPACE_BUG/git_branch_name.sh"

function whenceFunction() {
    whence -w $@
}
```

[git-batch.py](https://www.yuque.com/attachments/yuque/0/2023/py/694278/1693487253171-f3d430e2-10bb-4588-a769-0bb7c4fe01cd.py?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fpy%2F694278%2F1693487253171-f3d430e2-10bb-4588-a769-0bb7c4fe01cd.py%22%2C%22name%22%3A%22git-batch.py%22%2C%22size%22%3A15271%2C%22ext%22%3A%22py%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22udb2ac898-6600-4514-9fb7-90e0f947fe2%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-python-script%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u5803d5a3%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>[click.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1693487274191-9c3d2d7d-c42e-42e1-995e-0a1253b30f27.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1693487274191-9c3d2d7d-c42e-42e1-995e-0a1253b30f27.sh%22%2C%22name%22%3A%22click.sh%22%2C%22size%22%3A169%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u8ace6504-a860-4d4a-b20d-0e5d675c906%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22ue3957b27%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

# 遇到的问题

## .zshrc和shell独立有些命令找不到

- `.zshrc`和`.common_profile.sh`都要将使用到的命令的路径进行export
- 被调用的`function/alias`要写在使用的前面

## oh-my-zsh 特殊字符无法显示

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683520671297-530696a4-5d53-4a25-8683-a4a2e74d8a8b.png#averageHue=%23ece9e7&clientId=u1efcb5de-6a7e-4&from=paste&height=62&id=u943723bb&originHeight=124&originWidth=1136&originalType=binary&ratio=2&rotation=0&showTitle=false&size=36479&status=done&style=none&taskId=uf40e15a7-6807-4d04-8cb0-937b6fa0778&title=&width=568)<br>**原因**<br>现有的字体不支持这些符合的显示<br>**解决1**

1. 安装nerd fonts
2. iTerm2中设置字体为nerd相关的字体

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683520781326-e2c81c63-620d-48ef-851f-4d630f14ea70.png#averageHue=%23eeebe8&clientId=u1efcb5de-6a7e-4&from=paste&height=319&id=u21e02fbb&originHeight=962&originWidth=1886&originalType=binary&ratio=2&rotation=0&showTitle=false&size=270570&status=done&style=none&taskId=u710cc160-a5db-438e-b9cc-4cd4cc9af80&title=&width=625)

3. 解决后

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683520835930-033c71a1-e35d-4381-acc8-c20ae85b412d.png#averageHue=%234e4d4b&clientId=u1efcb5de-6a7e-4&from=paste&height=92&id=u27a22942&originHeight=184&originWidth=1134&originalType=binary&ratio=2&rotation=0&showTitle=false&size=43269&status=done&style=none&taskId=u453ad5a3-f70d-4615-b36d-cac83d22306&title=&width=567)<br>**解决2：**

- 安装Menlo for Powerline字体	mkdir ~/.fonts

> mkdir ~/.fonts
> cd ~/.fonts
> wget <https://github.com/abertsch/Menlo-for-Powerline/raw/master/Menlo%20for%20Powerline.ttf>
> fc-cache -vf ~/.fonts

# Ref

<https://juejin.cn/post/6973069891691610126>
