---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 1:38:07 pm
title: git subtree和submodule
author: hacket
categories:
  - Tools
category: Git
tags: [git]
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
date created: 2024-03-30 00:09
date updated: 2024-12-27 23:54
aliases: [git subtree 和 submodule]
linter-yaml-title-alias: git subtree 和 submodule
---

# git subtree 和 submodule

## git subtree

git subtree 主要命令：

```git
git subtree add --prefix=<prefix> <commit>
git subtree add --prefix=<prefix> <repository> <ref>
git subtree pull --prefix=<prefix> <repository> <ref>
git subtree push --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
```

### 1、添加 subtree

```git
git subtree add --prefix=sub/AndroidDemos git@gitee.com:hacketzeng/Android_Tools.git master --squash
// --squash参数表示不拉取历史信息，而只生成一条commit信息。
```

执行 git status 可以看到提示新增两条 commit<br>git push 到远端，其他开发人员 git clone，会完整拉取代码

### 2、子工程更新

```git
git subtree pull --prefix=sub/AndroidDemos git@gitee.com:hacketzeng/Android_Tools.git master --squash
```

### 3、修改了子工程，如何 push 到远端

```git
git subtree push
```

## git submodule

git submodule 允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。

### 添加子模块 add

**语法：**

```git
git submodule add <git仓库地址> [<本地工程路径名>]
```

- git 仓库地址为子模块的路径，
- 本地工程路径名为该子模块存储的目录路径，可以不写，默认从 git 仓库读取目录名

例如，将 AndroidDemos 工程添加到当前工程下。

```git
git submodule add https://github.com/hacket/AppInit hacket/appinit
# 或者，添加以AppInit命名的目录路径
git submodule add https://github.com/hacket/AppInit
```

添加成功后，工程会增加 `.gitmodules` 文件，该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射，这个需要提交到主工程版本管理：

```git
[submodule "hacket/appinit"]
	path = hacket/appinit
	url = https://github.com/hacket/AppInit
```

- `.gitmodules文件` 是 git 仓库用来管理所有跟踪的 submodule 的基本信息，主要是跟踪 `仓库地址` 和本 `地存放路径` 的一个映射（当然可以配置其他信息）
- `.gitmodules` 文件是归本仓库进行版本控制的
- 对于 submodule 管理的模块，会将.gitmodules 映射的本地存储路径进行忽略，将其最新的 commitid 作为文件内容在主仓库中进行跟踪管理

### 克隆子模块：clone 一个包含 submodule 的 repo

#### 主工程未 clone 的情况，--recurse-submodules

如果要 clone 一个项目，并且包含其子模块的文件，则需要给 `git clone` 命令最后加上 `--recurse-submodules` 或者 `--recursive` 参数（否则只会下载一个空的子模块文件）：

```git
git clone --recurse-submodules https://github.com/grpc/grpc
# 其中--recurse-submodules选项，它会自动初始化并更新仓库中的每一个子模块， 包括可能存在的嵌套子模块。
```

#### clone 时未带 submodule 相关参数

克隆一个包含 submodule 的仓库目录，未带 submodule 相关参数，并不会 clone 下子仓库的文件，只是会克隆下.gitmodule 描述文件，需要进一步克隆子仓库文件。

```git
git clone ssh://xxx.git

# 初始化子模块相关配置
git submodule init
## 会自动在 config 中加入下面两行内容，可以用gift config --list查看
## submodule.xxx.url=git@github.com:yyy/xxx.git
## submodule.xxx.active=true

# 然后执行下面，就可以拉取到子模块仓库中的文件了
git submodule update
```

或者使用组合指令：

```git
# 拉取到子模块仓库中的文件了，也可以将这两步命令合并为一步：
git submodule update --init
# 要拉取所有层层嵌套的子模块，则执行：
git submodule update --init --recursive
```

此时子目录在一个未命名分支 61f6637，此时子仓库有改动并没有检测到。

```git
* (HEAD detached at 61f6637)
master
remotes/origin/HEAD -> origin/master
remotes/origin/dev
remotes/origin/master
```

> 其中 --recursive 选项和 git clone 时候的 --recurse-submodules 的含义是一样的；

#### 修改拉取的 submodule 仓库默认分支

命令默认拉取主分支（master），想要修改这个默认拉取分支可以修改 .gitmodules 文件中子模块对应的 branch 值，或者执行：

```shell
git config submodule.xxx.branch dev
```

或者执行同时将配置写入文件，这样其他人拉取父项目也会获取该配置：

```shell
git config -f .gitmodules submodule.xxx.branch dev
```

### 更新子模块 update

默认情况下，在主仓库的根目录下，执行 `git pull` 命令并不会主动更新 submodule 最新的 commit

#### submodule update 概述

submodule 的更新一般有两个层面的更新，分别是：

1. 拉取 submodule 子项目最新的提交，如果子项目对应的分支上有更新，那么会拉取下来，并且修改主项目跟踪的改子项目的 commitId；这种情况一般是：<font color="#c00000">明确需要跟踪子项目的特定提交，使用其新特性；</font>

```shell
git submodule update --remote
```

2. 拉取项目中跟踪的 submodule 的 commitId 对应的数据到本地；这种情况一般都是项目的开发者拉取 submodule 是否有跟踪的变化，更新一下对应的数据；如果 submodule 的子项目有最新的，只会拉取项目跟踪的 commitId，<font color="#c00000">不一定是最新的</font>

```shell
git submodule update
```

`git submodule update --remote` 命令结果：

![hzktg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/hzktg.png)

#### submodule update 策略

submodule update --rebase 后 submodule 项目的状态变成了 detached：<br>![51na2](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/51na2.png)<br>命令 git submodule update 更新子项目的策略有三种：

- checkout 方式：子项目 checkout 到 detached 的分支，然后在 detached 分支上更新远端的提交；默认选项；

```shell
git submodule update --remote
```

- rebase 方式：将子项目本地分支上的提交在远端最新的提交上进行 rebase；

```shell
git submodule update --remote --rebase
```

- merge 方式：将子项目远端分支的提交本 merge 到子项目本地分支上；

```shell
git submodule update --remote --merge
```

两种方式设置更新策略：

- update 命令执行时设置：`git submodule update --remote --rebase`
- 修改.gitmodules 文件，默认采用某种策略更新 `git config -f .gitmodules submodule.submodules/draw_io.update rebase`，然后将变动的.gitmodules 文件提交到主项目中

> git config -f .gitmodules .modules/si_basic_flutter.update rebase

#### 向上同步主仓库

如果你是子模块的开发者，当你希望主仓库使用新版本的子模块时，需要向上同步主仓库。<br>![fubcq](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/fubcq.png)<br>在主仓库中，可以使用 git submodule status 和 git status 查看子模块的状态：显示为 + 号表示主仓库和子仓库未同步：<br>![qjztf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/4vjep.png)<br>如果想要将子模块的内容同步到主仓库，只需要在主仓库中创建一个新的提交即可

#### submodule uodate 相关命令

##### 只拉取主工程跟踪的子模块的 commitId 对应的代码，子模块有最新的提交不更新

- git submodule update 只会拉取最新的主工程对应子模块的代码，不会更新到主工程跟踪的 commitId
- git submodule update --init --recursive 更新到主工程子模块最新的 commitId，如果子模块有更新的 commit，但主工程未更新跟踪的 commitId，这条命令不会更新跟踪的子模块到最新的 commitId
- git pull origin master --recurse-submodules 拉取所有子仓库 (fetch) 并 merge 到所跟踪的分支上，跟踪到主工程 REMOTE 最新的 commit

##### 拉取子模块最新的代码，并更新主工程跟踪的 commitId

- 进入到子模块中，git pull 拉取，会拉取子模块最新更新，修改主工程跟踪的 commitId
- **git submodule update --remote **拉取子模块最新的 commit，会更新主工程对应的子模块跟踪的的 commitId；用这个可以获取到子模块最新的 commit 和修改主工程跟踪的 commitId

### 跟踪 submodule 特定分支

想换 submodule 的分支或 tag，进入到 submodule 目录，然后 git checkout xxx 指定分支即可<br>GIt Fork 直接点开对应的 submodule 操作即可。<br>![e1qa1](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/e1qa1.png)

### 查看子模块状态

> git submodule
> 或
> git submodule status

- 结果的 hash 前不带符号说明该 module 正常且提交版本同步（提交版本同步指主项目记录提交版本与子模块当前提交版本一致）
- 结果的 hash 前带 - 号说明该 module 未初始化
- 结果的 hash 前带 + 号说明该 module 版本未同步

![6iw7v](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/9sq6l.png)

### push 带修改的 submodule 的主工程

#### 存在的一个问题：主工程跟踪的 commit 修改提交了，但子模块修改未提交

如果 A 修改了子模块的内容并提交了记录，**父项目也提交并推送了远程仓库（更新了跟踪的 commitId），但是子模块没有推送其对应的远程仓库**， A 运行起来没有什么问题，那么 B 拉取父项目代码变更时没有问题，但是更新子模块时就会遇到下面的问题：

> fatal: remote error: upload-pack: not our ref 16d1b6b94e3245f3a7fb4f43e5b6f44b14027fbb
> Fetched in submodule path 'xxx', but it did not contain 16d1b6b94e3245f3a7fb4f43e5b6f44b14027fbb.
> Direct fetching of that commit failed.

**原因：**即由于其他人没有及时将子模块的提交 push 的子模块的远程仓库，我们本地父项目有了关于子模块最新的变更，但是在子模块的仓库中却找不到，就报错了<br>**解决：**让对方在子模块下 push 一下这边再重新更新就行了；

#### 主工程和子模块同时推送

目标：修改了 submoudle 的内容，在推送主项目的时候，也希望推送跟踪的子 submodule 项目

- check 检查报错

如果子模块（与父项目记录的对应分支）存在未 push 的提交，就会报错，并且子模块有推送失败的，父项目也会推送失败；

```shell
git push --recurse-submodules=check
# 配置到config，避免每次手动输入
git config push.recurseSubmodules check
```

- on-demand 在推送主项目的时候会递归的推送子项目

```git
git push --recurse-submodules --on-demand
```

- git 配置

```git
git config --global push.recurseSubmodules=on-demand
```

> 与 --on-demand 含义一样；不过这里为什么不使用 `git config --global submodule.recurse true` 的设置呢？submodule.recurse 的配置不仅不对 clone 生效，在 push 的时候也不生效

#### 游离的 HEAD（git submodule head detached）

在使用 git submodule 的时候，常常会遇到 执行完以下操作后发现 子仓库的 head 指针处于游离状态<br>在主工程修改子模块的代码后提交，出现这个弹窗提示<br>![ybe4k](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ybe4k.png)<br>解决：

1. 首先删除已有的 submodule
2. 重新建立 submodule，加入时使用 -b 参数，使得母项目追踪子项目的指定 branch（否则默认不追踪）：

```powershell
git submodule add -b <branch> <repository> [<submodule-path>]
# 如
git submodule add -b master git@github.com:hacket/DebugTools.git submodules/debugtools
```

3. 更新

```shell
git submodule update --remote
```

简单的一行命令递归修复所有子项目的 detached head（其中默认都追踪子项目的 master branch）：

```shell
git submodule foreach -q --recursive 'git checkout $(git config -f $toplevel/.gitmodules submodule.$name.branch || echo master)'
```

### 修改子模块

如果在本地修改 submodule 工程，在主仓库 git status 会显示 submodule 仓库有修改。但是在主工程进行 git push 没用，现在需要进去子仓库进行提交

```git
$ git add .
$ git commit -m "commit"
$ git push origin HEAD:master
```

### 删除子模块

`git submodule deinit -f 子模块名` 删除了子模块，则再次查看时输出会是这样的，删除的子模块前面加了个 `-`：<br>![jvp4y](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/jvp4y.png)

- `rm -rf 子模块目录` 删除子模块目录及源码
- `vi .gitmodules` 删除项目目录下.gitmodules 文件中子模块相关条目
- `vi .git/config` 删除配置项中子模块相关条目
- `rm .git/modules/*` 删除模块下的子模块目录，每个子模块对应一个目录，注意只删除对应的子模块目录即可

```git
git submodule deinit -f AndroidDemos
git rm --cached AndroidDemos
# git rm --cached <本地路径>
rm -rf AndroidDemos
```

如果是带了目录的，需要加上目录<br>![0yjgl](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/0yjgl.png)

### 批量修改子模块 foreach

git submodule foreach [git 操作]

- 批量 stash

```shell
git submodule foreach 'git stash'
```

- 每个子模块中新建切换分支

```shell
git submodule foreach 'git checkout -b new'
```

### submodule 主要问题

#### 主工程一个分支有 submodule，一个分支没有 submodule，分支切换问题

父项目从含有子模块的分支切换到没有子模块的分支时，默认会保留子模块对应的目录，所以这使得切换过去时本地会保留关于子模块的修改记录，显然这不太合理，所以从包含子模块的分支切换到 xxx 时，需要这样执行：

```shell
git checkout xxx --recurse-submodules
```

#### submodule 的 url 被修改了

如果父项目中子模块的仓库地址（submodule.xxx.url）被其他协作者修改了，那么我们再更新子模块时就可能遇到问题，需要执行：

```shell
git submodule sync --recursive
```

同步完 url，然后再重新初始化更新：

```shell
git submodule update --int --recursive
```

#### 忽略 submodule 中的修改或新增文件

在 `.gitmodules` 添加 ignore 字段，ignore 意义：

```git
untracked ：忽略 在子模块B(子模块目录)新添加的，未受版本控制内容
dirty ： 忽略对子模块目录下受版本控制的内容进行了修改
all ： 同时忽略untracked和dirty
```

添加了 ignore 后，子模块的修改，在主工程用 git status 就看不到了

#### detached head does not point any branch

在项目哪个拉去

#### submodule 冲突

1. 将子仓库的冲突解决后，push
2. 然后同步主仓库的 commit，主仓库对子仓库的引用可能也会导致冲突，将主仓库对准最新的子仓库的的最新 commit 即可

![9sj4e](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/9sj4e.png)
