---
date created: Monday, December 23rd 2024, 11:24:00 pm
date updated: 星期一, 一月 20日 2025, 4:47:13 下午
title: Git Advanced Skills
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:58:10 am
categories:
  - Tools
category: Git
tags: [git]
image-auto-upload: true
feed: show
format: list
aliases: [Git 回滚]
linter-yaml-title-alias: Git 回滚
---

# Git 回滚

- 未 push 到远端
  - 未 add/已经 add 未 commit
	- `git checkout . && git clean -xdf git clean`
	- SourceTree reset/discard
  - 已经 commit
	- git reset
	- git revert
- 已经 push 到远端
  - git reset/revert + git push -f

## git reset 和 git revert

### git 的版本管理，及 HEAD 的理解

git 的每次提交，Git 都会自动把它们串成一条时间线，这条时间线就是一个分支。如果没有新建分支，那么只有一条时间线，即只有一个分支，在 Git 里，这个分支叫主分支，即**master**分支。有一个**HEAD**指针指向当前分支（只有一个分支的情况下会指向 master，而 master 是指向最新提交）。每个版本都会有自己的版本信息，如特有的版本号、版本名等。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104867.png)

### git reset

**什么是 git reset？**<br>回到某次提交，提交及之前的 commit 都会被保留，但是此次之后的修改都会被退回到暂存区<br>**git reset 原理：**<br>git reset 的作用是修改 HEAD 的位置，即将 HEAD 指向的位置改变为之前存在的某个版本，如下图所示，假设我们要回退到版本一：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104868.png)

**git reset 命令：**

> `git reset [--hard|soft|mixed|merge|keep] [commit|HEAD]`

- --mixed 会保留源码，只是将 git commit 和 index 信息回退到了某个版本.(默认 git reset 不带参数就是 --mixed 模式)
- --hard 源码也会回退到某个版本，commit 和 index 都回回退到某个版本.(注意,这种方式是改变本地代码仓库源码)
- --soft 保留源码，只回退到 commit 信息到某个版本。不涉及 index 的回退，如果还需要提交，直接 commit 即可

**git reset 用途**

- git reset 主要用于回滚 commit 未 push 的代码
- 已经 push 的代码也可以用 git reset，但是可能会出现很多冲突

**git reset 具体操作：**

1. 查看版本号：

可以使用命令 `git log` 查看：

2. 使用 `git reset --hard 目标版本号` 命令将版本回退：

再用 "git log" 查看版本信息，此时本地的 HEAD 已经指向之前的版本：

3. 使用 `git push -f` 强推提交更改：

此时如果用 "git push" 会报错，因为我们本地库 HEAD 指向的版本比远程库的要旧

### git revert

**git revert 原理：**<br>git revert 是用于 " 反做 " 某一个版本，以达到撤销该版本的修改的目的。比如，我们 commit 了三个版本（版本一、版本二、 版本三），突然发现版本二不行（如：有 bug），想要撤销版本二，但又不想影响撤销版本三的提交，就可以用 git revert 命令来反做版本二，生成新的版本四，这个版本四里会保留版本三的东西，但撤销了版本二的东西。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104869.png)

**git revert 理解**

- git revert 用于反转提交，执行 revert 命令时，要求工作树必须是干净的
- git revert 用一个新的提交来消除一个历史所做的任何修改
- git revert 生成一个新的提交来撤销某次提交，此次提交之前的 commit 都会被保留；之后你的本地代码会回滚到指定的历史版本，这时再 git push 就可以把远端仓库的代码更新了（不会像 reset 造成冲突）

**git revert 案例：** 要 rervert 已经 push 到远端的 9a3d099commit，用命令：

```git
git revert 9a3d099
```

用 SourceTree，选中 9a3d099commit，右键 Reverse commit：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104870.png)

> 注意：如果 revert 的是一个 merge commit，要注意 parent commit 的选择，仓库<http://blog.psjay.com/posts/git-revert-merge-commit/>

### git 回滚命令 reset、revert 的区别

- git revert 是生成一个新的提交来撤销某次提交，此次提交之前的 commit 都会被保留.
- git reset 是回到某次提交，提交及之前的 commit 都会被保留，但是此次之后的修改都会被退回到暂存区
- 用 git reset 回滚远端代码，很容易出现冲突；git revert 则不会有冲突
- reset 是在正常 commit 历史中，删除了指定的 commit，这是 HEAD 是向后移动了；revert 是在正常的 commit 历史再 commit 一次，只不过是反向提交，它的 HEAD 是一直向前的

## 未 push 的文件

1. `git checkout .` 本地所有修改的。没有的提交的，都返回到原来的状态，新增的文件不能删除，只能是修改的文件
2. git stash 把所有没有提交的修改暂存到 stash 里面。可用 git stash pop 恢复
3. git reset
   - `git reset --hard HASH` 返回到某个节点，不保留修改，已有的改动会丢失。
   - `git reset --soft HASH` 返回到某个节点, 保留修改，已有的改动会保留，在未提交中，git status 或 git diff 可看。

### 未 add 的文件（unstagged files，还在工作区）

1. 新文件 SourceTree 中直接 Remove 掉
2. 旧文件的修改直接在 SourceTree 中 Discard 掉
3. git checkout
   - `git checkout .` 作用是放弃掉还没有加入到暂存区的修改。此命令不会删除新创建的文件，因为新创建的文件还没有被跟踪（tracked）,因此需要 git clean。

```git
❯ git checkout .
Updated 1 path from the index
```

- `git checkout . && git clean -xdf git clean` 的作用是从工作目录中删除还没有被追踪的文件。
  - -n 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
  - -i 显示将要删除的文件
  - -d 递归删除目录及文件（将 .gitignore 文件标记的文件全部删除）
  - -f 删除文件 强制运行
  - -q 仅显示错误，成功删除的文件不显示

```git
❯ git checkout . && git clean -xdf
Updated 0 paths from the index
Removing .DS_Store
Removing .gradle/
Removing .idea/
Removing AppLibs/core/build/
Removing AppLibs/lib_pagergrid/build/
Removing AppLibs/libcommon/build/
Removing AppLibs/libwidget/build/
Removing AppUIs/AndroidUI/build/
Removing AppUIs/Google/build/
Removing build/
Removing buildSrc/.gradle/
Removing buildSrc/build/
Removing debugTools/.gradle/
Removing debugTools/build/
Removing debugTools/~/
Removing local.properties
```

- 可用 `git clean -nxdf` 查看要删除的文件及目录，确认无误后再使用下面的命令进行删除

```git
❯ git clean -nxdf
Would remove .gradle/
Would remove buildSrc/.gradle/
Would remove buildSrc/build/
```

### 已经 add 了未 commit（staged files，在工作区）

丢弃暂存区修改 (丢弃已经 add 的文件，把暂存区修改撤销掉恢复到 unstage 状态，重新放回工作区)

#### SourceTree

- 方式 1：直接右键选中文件 Discard 掉
- 方式 2：Repository→Reset

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104871.png)

### 已经 commit 未 push 的（在暂存区）

#### git reset 方式

```git
git reset --mixed HEAD
```

## 已经 push 到远端仓库

对于已经把代码 push 到远端仓库了，回滚本地代码并回滚远端仓库的代码，回滚到某个版本，本地和远端保存一致。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104872.png)<br>已经 push 了到 origin 了 `96c3e0c`，现在想回滚到 `8f46933`：

1. 如果用 git reset 的话，只是将本地的 branch master 给回滚了，origin/master 并没有修改（这个仅仅是回滚了本地仓库，远端仓库并没有被回滚）

```
 git reset --mixed 8f46933
```

2. 用 git revert，找到你想要回滚的 commit id，现在是想将 `96c3e0` 删除，那么 commit id 就填写这个。

```git
git revert 96c3e0
```

然后进入 vim 模式，编写 commit message，如果不填写就会默认生成一个 commit，并有默认的 commit message![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104873.png)<br>然后 push 到远端去。

3. 用 SourceTree

选中要 revert 的 commit id，`9a3d099`，然后单击右键，Revert commit 即可，并会生成一个新的 commit，并带默认的 commit message。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104874.png)<br>示例：

```git
## 回退到指定版本，不保留原更改代码
git reset --hard e377f60e28c8b84158
 
## 回退到指定版本，保留原更改代码，且生成新的提交
# git revert e377f60e28c8b84158     
　　
git push -f origin master
```

## 案例

### merge 分支错了，需要回滚到 merge 前

如果确定放弃这次合并的提交，假如是 merge 了错误的分支到 master，先通过 git reflog 或者 gitg、gitk、qgit 等工具确定你 merge 之前 master 所在的 commit，然后在 master 分支上使用 `git reset --hard <commit>` 重置头指针。一般来说，在 master 上直接执行 `git reset --hard HEAD~` 也可以回到合并之前的提交，但 git reset --hard 命令还是使用确定的 commit 为好。注意，git reset --hard 命令有风险，除非十分确定要放弃当前提交，否则最好先 git branch 为当前的提交建立个新的分支引用后再继续，待确定无误后删除即可。

```git
git rest --hard <commint id> // 要回滚的分支的commit id
```

还是需要 git push -f 强推掉错误的分支的 commit id

# rebase

## git pull 用 rebase 替代默认 pull 行为

默认的 git pull 是 git fetch 和 git merge 的组合操作，在 merge 时会生成一个新的 commit，让分支线变得杂乱不堪。<br>从远端拉取代码使用 `git pull --rebase` 替代默认的 `git pull`

### 命令方式

用 git rebase 替换 git merge

```git
git pull --rebase
# 或者
git fetch origin master
git rebase origin/master
```

如果遇到冲突了，会中断让你去解决冲突，此时需要解决掉冲突后再 `git add`，然后执行 `--continue`

```git
git rebase --continue
```

这样 git 会继续应用 (apply) 余下的补丁，这个过程可能还会有冲突，需要继续解决掉冲突后继续。<br>在任何时候，你都可以用 `--abort` 来终止 rebase 行动，然后分支会回到 rebase 开始前的状态。

```git
git rebase --abort
```

### SourceTree 图形化

git pull 时勾选最后一项<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104875.png)

- 如果想要把 rebase 当做 git pull 的預設值，可以在项目根目录的 `.git/config` 加上：

```git
[branch "master"]
    remote = origin
    merge = refs/heads/master
    rebase = true
```

(全局添加) 也可以直接加到 `~/.gitconfig` 让所有的 tracked branches 都自动套用这个设定：

```git
[branch]
		autosetuprebase = always
```

## 合并分支用 rebase 替代 merge

分支合并使用 `git rebase <branch-name>` 替代 `git merge <branch-name>`

### 命令方式

如在 master 分支合并 develop 分支，先切换到 master 分支，执行命令：

```git
git rebase develop
```

### SourceTree 图形化

先切换到要被合并的分支 develop，然后右键要合并的分支 master，然后 rebase<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104876.png)

## git rebase -i

### 合并多个 commit

1. 查看提交历史，git log

```git
commit 3ca6ec340edc66df13423f36f52919dfa3......

commit 1b4056686d1b494a5c86757f9eaed844......

commit 53f244ac8730d33b353bee3b24210b07......

commit 3a4226b4a0b6fa68783b07f1cee7b688.......
```

> 历史记录是按照时间排序的，时间近的排在前面。

2. git rebase<br>想要合并 1-3 条，有两个方法

- 1、从 HEAD 版本开始往过去数 3 个版本

```git
git rebase -i HEAD~3
```

- 2、指名要合并的版本之前的版本号 (3a4226b 这个版本是不参与合并的，可以把它当做一个坐标)

```git
git rebase -i 3a4226b
```

3. 选取要合并的提交

```shell
# 1.执行了rebase命令之后，会弹出一个窗口，头几行如下：
pick 3ca6ec3   '注释**********'
pick 1b40566   '注释*********'
pick 53f244a   '注释**********'

# 2. 将pick改为squash或者s,之后保存并关闭文本编辑窗口即可。改完之后文本内容如下：
pick 3ca6ec3   '注释**********'
s 1b40566   '注释*********'
s 53f244a   '注释**********'

# 3. 然后保存退出，Git会压缩提交历史，如果有冲突，需要修改，修改的时候要注意，保留最新的历史，不然我们的修改就丢弃了。修改以后要记得敲下面的命令：
git add .  
git rebase --continue

#放弃这次压缩的话，执行以下命令：
git rebase --abort 

# 4. 如果没有冲突，或者冲突已经解决，则会出现如下的编辑窗口：
# This is a combination of 4 commits.  
#The first commit’s message is:  
注释......
# The 2nd commit’s message is:  
注释......
# The 3rd commit’s message is:  
注释......
# Please enter the commit message for your changes. Lines starting # with ‘#’ will be ignored, and an empty message aborts the commit.

# 5.输入wq保存并推出, 再次输入git log查看 commit 历史信息，你会发现这两个 commit 已经合并了。
```

### rebase 变更 commit log 记录

现在 log 顺序是：`patch_5→patch_4→patch_3→patch_2→patch_1`<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104877.png)<br>我想把 patch_2 放到 patch_4 之前，修改后顺序是：`patch_5→patch_2→patch_4→patch_3→patch_1`<br>现在执行 git rebase -i commitId

```git
git rebase -i a262604ce4efc36b0bcfe007a77d2de532575f7c
```

然后就进去到了 vim 编辑界面<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104878.png)

### git rebase -i 在 SourceTree 使用

`rebase children of xxx interactively`

### git rebase -i 在 Git Fork 中使用

#### Interactive Rebase 功能

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104879.png)<br>主要看 `Interactively Rebase 'master' to Here` 功能，下面的选项都是对这个功能的简化

##### Interactively Rebase 'master' to Here

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104880.png)

- **Pick** 选择用这个 commit，会保留该 commit 和 message
- **Edit **停止 amend
- **Reword** 编辑当前 commit 的 message
- **Squash** 将当前 commit 合并到前一个 commit，并保留 message（追加到前一个 commit message 后）
- **Fixup **将当前 commit 合并到前一个 commit，并丢弃当前 commit message，使用前一个 commit message
- **Drop** 移除当前 commit

#### 多个 commit 合并成一个

目标：将 update readme.txt add x 这几个 commit 合并到一个 commit 中去<br>原有：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104881.png)

##### 解决 1：Interactive Rebase / Squash into Parent（追加 commit）

在 `40e1a1e`commit 右键 `Interactive Rebase`，然后 `Squash into Parent`<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104882.png)<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104883.png)

- Squash：保留 commit message
- Fixup：丢弃 commit message

将第 1 条第 2 条 commit 改成 squash，用 afa6b5f 的 commit message<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104884.png)<br>如果已经 push 到 remote 后，`git push -f` 下，效果：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104885.png)

##### 改动 commit 顺序

目标：将 8 移动到 add 4 后面，并把 add 4 这 2 个合并成一个<br>原有顺序：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104886.png)<br>操作：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104887.png)

##### 示例：Git Fork 将多条 commit 合并

目标：将红色框合并成一条 commit<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104888.png)<br>步骤：<br>选中：`feat(SAB-73120): 未支付组件初步框架`commit<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104889.png)<br>选择 `Edit`，进入交互模式<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104890.png)<br>选择 FixUp，最后一个 Edit，后续还会进行 Continue Rebase 确认<br>修改后：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104891.png)<br>由于之前的提交已经 push 到 remote，这里需要强推：`git push -f`

## 其他

### 洁癖者 git rebase 和 git merge --no-ff

使用 `git pull --rebase` 主要是为是将提交约线图平坦化，而 `git merge --no-ff` 则是刻意制造分叉。

- 洁癖者用 Git：pull --rebase 和 merge --no-ff<br><http://hungyuhei.github.io/2012/08/07/better-git-commit-graph-using-pull---rebase-and-merge---no-ff.html>
- 洁癖患者的 Git GUI 指南<br><http://blog.justbilt.com/2017/04/12/the-git-for-neat-freak/>

### git rebase 后找回消失的 commit

1. 执行：`git reflog` 这里显示了 commit 的 sha, version, message，找到你消失的 commit id，然后可以使用这个 ' 消失的 'commit 重新建立一个 branch.

> reflog 记录你的每一次命令，reflog 命令查看命令历史，以便确定要回到未来的哪个版本，特别是进行了 reset 后
> ![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104892.png)

2. 切换到消失的 commit

```git
git checkout -b branch-bak [commit-sha]
```

3. 再进行 commit/merge
4. Ref

- [x] [git rebase 后找回消失的commit](https://blog.csdn.net/whereismatrix/article/details/50611706)

# Git Hooks 钩子

## 什么是 Git Hooks？

git hooks 是一些自定义的脚本，用于控制 git 工作的流程，分为客户端钩子和服务端钩子。

## 客户端钩子

客户端钩子分为很多种。 下面把它们分为：提交工作流钩子、电子邮件工作流钩子和其它钩子。主要介绍提交工作流钩子：`pre-commit`、`prepare-commit-msg`、`commit-msg`、`post-commit`。

### pre-commit（常用）

在键入提交信息前运行。 **它用于检查即将提交的快照**。例如，检查是否有所遗漏，确保测试运行，以及核查代码。 如果该钩子以非零值退出，Git 将放弃此次提交，不过你可以用 `git commit --no-verify` 来绕过这个环节。 你可以利用该钩子，来检查代码风格是否一致（运行类似 lint 的程序）、尾随空白字符是否存在（自带的钩子就是这么做的），或新方法的文档是否适当。

### prepare-commit-msg

**在启动提交信息编辑器之前，默认信息被创建之后运行**。 它允许你编辑提交者所看到的默认信息。 该钩子接收一些选项：存有当前提交信息的文件的路径、提交类型和修补提交的提交的 SHA-1 校验。 它对一般的提交来说并没有什么用；然而对那些会自动产生默认信息的提交，如提交信息模板、合并提交、压缩提交和修订提交等非常实用。 你可以结合提交模板来使用它，动态地插入信息。

### commit-msg（常用）

接收一个参数，此参数即上文提到的，存有当前提交信息的临时文件的路径。 如果该钩子脚本以非零值退出，Git 将放弃提交，因此，可以**用来在提交通过前验证项目状态或提交信息**。

### post-commit

在整个提交过程完成后运行。 它不接收任何参数，但你可以很容易地通过运行 `git log -1 HEAD` 来获得最后一次的提交信息。 **该钩子一般用于通知之类的事情**。

## 服务端钩子

服务端钩子脚本在推送到服务器之前和之后运行。 推送到服务器前运行的钩子可以在任何时候以非零值退出，拒绝推送并给客户端返回错误消息，还可以依你所想设置足够复杂的推送策略。钩子包括：`pre-receive`、`update`、`post-receive`。

### pre-receive

处理来自客户端的推送操作时，最先被调用的脚本是 pre-receive。 它从标准输入获取一系列被推送的引用。如果它以非零值退出，所有的推送内容都不会被接受。 你可以用这个钩子阻止对引用进行非快进（non-fast-forward）的更新，或者对该推送所修改的所有引用和文件进行访问控制。

### update

update 脚本和 pre-receive 脚本十分类似，不同之处在于它会为每一个准备更新的分支各运行一次。 假如推送者同时向多个分支推送内容，pre-receive 只运行一次，相比之下 update 则会为每一个被推送的分支各运行一次。 它不会从标准输入读取内容，而是接受三个参数：引用的名字（分支），推送前的引用指向的内容的 SHA-1 值，以及用户准备推送的内容的 SHA-1 值。 如果 update 脚本以非零值退出，只有相应的那一个引用会被拒绝；其余的依然会被更新。

### post-receive

post-receive 挂钩在整个过程完结以后运行，可以用来更新其他系统服务或者通知用户。 它接受与 pre-receive 相同的标准输入数据。 它的用途包括给某个邮件列表发信，通知持续集成（continuous integration）的服务器， 或者更新问题追踪系统（ticket-tracking system） —— 甚至可以通过分析提交信息来决定某个问题（ticket）是否应该被开启，修改或者关闭。 该脚本无法终止推送进程，不过客户端在它结束运行之前将保持连接状态， 所以如果你想做其他操作需谨慎使用它，因为它将耗费你很长的一段时间。

## 开启 Git Hooks

### git hooks 存储位置

git hooks 被存储在 Git 目录下的.hooks 子目录中，即绝大部分项目中的 `.git/hooks`。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104893.png)<br>注意这些以.sample 结尾的示例脚本**默认是不会执行的**，只有把一个正确命名（不带扩展名.sample）且可执行的文件放入 .git/hooks 目录中，才会激活该钩子脚本，生效且被 git 调用。

- 把 sample 去掉
- 名称必须是固定的，不能随意改名字

### 开启 git hooks 两种方式

#### 1、单个项目

将脚本放到当前根目录的 `.git/hooks` 中，把 `.sample` 后缀去掉即可生效

#### 2、全局所有项目

- 配置 `core.hooksPath`，即配置全局的 hooks 路径，对所有项目生效，配置后会会在 `~/.gitconfig` 生成一条配置
- 然后将 hooks 脚本放到该目录即可，记得 chmod 改权限
- 查看是否配置成功：`git config core.hooksPath`

```shell
#创建hooks文件夹
mkdir -p ~/.git-hooksPath/hooks
#配置全局git hooksPath
git config --global core.hooksPath ~/.git-hooksPath/hooks  
# 将commit-msg脚本放到~/.git-hooksPath/hooks目录下，chmod更改权限
chmod a+x ~/.git-hooksPath/hooks/commit-msg
# 查看git hook路径配置
git config core.hooksPath
```

配置完后，打开 `~/.gitconfig` 看看是否配置成功：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104894.png)

## 示例

在提交时在客户端进行判断，不符合提交规范的不让提交

```shell
#!/bin/sh
# COMMIT_EDITMSG_FILE=$1
# 读取commit message的第一行
# START_LINE=$(head -n1 $COMMIT_EDITMSG_FILE)

# 匹配代码仓库
#  1. https://github.com/hacket/king-assist.git
#REG='^https:\/\/github\.com\/(king-assist\)(.{1,})(\.git)$'
#
#temp=$(git config --get remote.origin.url)
#if [[ "$temp" =~ $REG ]];
# if [ true ];
  # then
    # 正则匹配 格式：
    # 场景                    commit message
    #
    # 01. 需求Jira单号          "feat(XXX-123456): 需求描述"
    # 02. bug修复单号           "fix(XXX-123456): bug描述"
    # 03. 更新Jira号            "update(XXX-123456): 需求描述"
    # 04. 修改版本号             "feat(version): 版本描述"
    # 05. 修改打包脚本           "feat(ci/cd): 改动描述"
    # 06. 修改Debug工具          "feat(debug): 改动描述"
    # 07. 预研或Demo代码         "feat(new): 功能描述"
    # 08. CI打包集成             "[CI]:8.4.6/release integration success"
    # 09. 合并代码(git自动产生)   "Merge branch ..."
    # 10. 解决冲突               "Resolve conflicts: 冲突描述"

    # REG='^((feat)|(fix)|(update))[(]([A-Za-z]{3,})-([0-9]{5,})[)][:：]'
    # REG='^((((fix)|(feat)|(update))[(](([A-Za-z]{1,})-([0-9]{1,})|(version)|(ci\/cd)|(debug)|(new))[)]|(Resolve conflicts)|(\[CI\]))[:：]|(Merge branch))'
    # if ! [[ "$START_LINE" =~ $REG ]];
      # then
        # echo "hey, guy，your commit message doesn't meet specifications! check it"
        # exit 1
      # else
        # exit 0
    # fi
  # else
    # exit 0
# fi
```

## 绕过钩子

```shell
git commit -m 'xxx' --no-verify
```

## 本地.git/hooks 的缺陷

不能共享，由于.git 文件夹是不会被 git 跟踪的，所以.git/hooks 目录下的 hooks 钩子无法提交，就不能和他人共享钩子脚本。<br>解决：用**husky**

# Git lfs

## 什么是 lfs

[Git LFS](https://links.jianshu.com/go?to=https%3A%2F%2Fgit-lfs.github.com%2F)（Large File Storage），用以帮助 git 管理比较大的文件。git 的 diff 等是基于文件。对于二进制文件来说，git 需要存储每次提交的变动。git fls 对于追踪的文件只会保存一个指向其的指针。不会在本地仓库保存你每次提交的所有版本。对于历史提交版本，基本上我们都很少去动，不需要检出。所以这样极大的节省了空间和仓库拉取速度。<br>**核心**：把需要进行版本管理、但是占用很大空间的文件独立于 Git 仓库管理，加快 clone 仓库速度。

### 安装 lfs

lfs 目前是 git 扩展，没有被加入 git 核心。所以就需要有个安装的步骤。<br>**注意**：安装 git lfs 需要 git 版本>=1.8.2

```shell
# mac下请使用homebrew安装：
brew install git-lfs
git lfs install

# linux(unbuntu)下安装：
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
apt-get install git-lfs

# Windows
## 下载安装windows installer
## 运行windows installer
## git lfs install
```

## 常用命令

- git lfs ls-files 可以显示当前被 lfs 追踪的文件列表
- git lfs track "xx.a" 告诉 lfs 需要处理哪些文件

> 此命令执行后，会在项目根目录下创建一个名为 ".gitattributes" 的文件；.gitattributes 文件是需要加入版本控制的。

- git lfs untrack "*xx.a" 取消 git fls 对 xx.a 的追踪管理
- git lfs version 查看当前所用 git lfs 版本
- git lfs pull 如果起之前拉代码时，没有同时获取 lfs 对象，之后又需要将被 lfs 追踪的文件时，可执行此命令来拉取

### 使用 lfs

```shell
# 1. 安装完成后，首先先初始化；如果有反馈，一般表示初始化成功
git lfs install

# 2. 如果刚刚下载的那个项目没啥更改，重新下一遍，不算麻烦事（因为下载大文件，一般会比较慢）
git lfs clone https://github.com/AABBBCC/aaa.git
# 在下载的过程中，你也可以查看一下，你刚刚无法解析的那个pkl大文件，是不是在这个项目中，(进入项目目录)使用如下指令：
cd aaa
git lfs track

# 3. 如果不想重新下载整个项目，可以使用如下命令，单独下载需要使用lfs下载的大文件。
git lfs fetch
git lfs checkout
#（备选：git lfs pull），不建议
```

# Git 奇淫技巧

## 修改 Git 提交非当前时间

git revision 的时间是以本地时间记录的，只需要将本机时间修改成你想提交的时间就可以了

## 修复而非新建提交 (git commit --amend)

假设提交之后，你意识到自己犯了一个拼写错误。你可以重新提交一次，并附上描述你的错误的提交信息 (这样的话，你就有了 2 个 commit 记录)。但是，还有一个更好的方法（前提是提交尚未推送到远程分支），那么按照下面步骤简单操作一下就可以了：

1. 修正你的错误（如 build.gradle）
2. 将修正的文件暂存

```shell
git add build.gradle
```

3. 在提交的时候，运行 `git commit –amend` 命令，将会把最近一次的变更追加到你最新的提交。同时也会给你一个编辑提交信息的机会

```shell
git commit –amend
```

4. 准备好之后 wq 保存，将干净的分支推送到远程分支。
5. SourceTree 勾选 `Amend last commit`

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104895.png)

## Git 跨仓库迁移代码文件，并保留 git 历史记录

### A 仓库全部迁移到 B 仓库，并保留 git 历史记录

#### A mirror 方式 push B

比如：我又一个私有仓库在码云上，现在 github 私有仓库免费，我想迁移到 github 上。

1. Github 新建一个仓库 `TheMonkeyKingAssistant`
2. 进入到码云所在的代码仓库
3. 执行命令：`git push --mirror git@github.com:hacket/TheMonkeyKingAssistant.git`；这样 push 的代码就会带 git log
4. 去 Github 拉取代码就行了

#### 给 B 添加一个 A 仓库的 remote url

git 项目初始化后，默认情况下会有一个叫 origin 的远程仓库。我们也可以用 `git remote add repo_A [repo_A的仓库地址]` 来新增一个 " 远程 " 仓库，然后使用 git pull，将多个仓库的代码拉下来并 merge。这样便可以实现 A 仓库全部迁移到 B 仓库，并保留 git 历史记录。<br>注意这里的 `[repo_A的仓库地址]` 也可以是本地仓库路径。比如我这里添加了两个 repo，repo-A 是位于本地路径的 " 远程 " 仓库。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104896.png)

### A 仓库中部分子目录文件迁移到 B 仓库，并保留 git 历史记录

#### Git filter-branch 重写历史

`git filter-branch` 是 git 提供的重写历史的命令，我们可以用 `subdirectory-filter` 来实现重写 git 项目子路径的 git 历史记录：

> `git filter-branch -f --subdirectory-filter <directory>` 重写子路径 directory 的 git 历史记录

subdirectory-filter 可以从 git 项目中过滤出给定子目录的 git 历史记录，同时会把给定的子目录作为 git 项目的根目录

对于一个多模块项目，有一天想把其中一个模块迁移成单独的项目，因为有很多提交，所以想带着提交记录一起迁移。本质上就是：git 迁移项目中的某个目录到新项目，包括那一个目录的提交记录。

```shell
# 克隆一份新的旧项目, 选择一个分支，比如dev分支
$ git clone -b dev 旧项目git地址

$ cd my-project

# 假如我只需要 service 目录下的东西和其提交记录
$ git filter-branch -f --subdirectory-filter AppSamples/SiDebugKit

# 现在，该项目只剩下 AppSamples/SiDebugKit里的东西了

# 推送到新的git地址
$ git push --mirror 新的git地址

# 然后，在新地址里捣鼓，删掉旧的分支的信息

```

原仓库：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104897.png)<br>执行 `git filter-branch -f --subdirectory-filter AppSamples/SiDebugKit`：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104898.png)<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104899.png)

> 注意：
>
> 1. 只保留 AppSamples/SiDebugKit 目录下的文件，其他文件会被删除
> 2. 如果新的 git 地址不为空，如果提交到 master，会把之前的给覆盖掉
> 3. 如果有 submodule，非空的目录删除不了

##### 将仓库 A 迁移到仓库 B(仓库 B 已经存在了，且有自己的代码)

1. 裁剪仓库 A

```shell
# 裁剪仓库A
git filter-branch -f --subdirectory-filter AppSamples/SiDebugKit
# 裁剪后的仓库A，会以AppSamples/SiDebugKit为根目录，怎么样让提交到B仓库是带目录的？
mkdir SiDebugKit
git add. 
git commit "add SiDebugKit"
```

操作后的目录：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104901.png)

2. 合并到仓库 B

```shell
# 先进入到仓库B
## 给仓库B添加一个remote，这个remote是本地裁剪后的仓库A
git remote add from_repo_A /Users/10069683/OpenSources/temp/king-assist/
## 查看仓库B所有的remote仓库
git remote -v
## 从from_repo_A的master拉取代码
git pull from_repo_A master --allow-unrelated-histories 
## 删除仓库B的remote：from_repo_A
git remote rm from_repo_A
```

步骤 2 操作完后，仓库 B 存在两个不相关的 remote：origin/master，from_repo_A/master，如果直接将 from_repo_A/master 合并到 master 会报错：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104902.png)<br>需要加上参数 `--allow-unrelated-histories`：

> git merge master --allow-unrelated-histories

#### git-filter-repo 三方库

1. 新的仓库需要为空的 git 库

- [ ] [利用git-filter-repo无缝迁移git项目](https://www.jianshu.com/p/b71d901e8ffe)

## Git 将当前修改提交至其他分支

### 还未 commit 的

当前处于 A 分支，需要将此次的代码提交至 B 分支则可以进行以下操作

```
//在没有进行commit之前可以进行一下操作
 
1、通过git stash将工作区恢复到上次提交的内容，同时备份本地所做的修改
git stash
2、然后切换至B分支
git checkout B
3、从git栈中获取到最近一次stash进去的内容，恢复工作区的内容，获取之后，会删除栈中对应的stash
git stash pop
4、在进行正常的提交代码步骤即可
git add /src/main/..
5、git commit -m "功能开发"
6、git pull origin   分支名称
7、git push origin   分支名称
```

### 已经 commit 的 cherry pick

v11.6.0 的已经提交到本地了，现在需要提交到 v11.7.0 远端分支上<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104903.png)<br>首先切换到本地的 v11.7.0 分支，然后选中 v11.6.0 要提交到 v11.7.0 分支的 commit，<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104904.png)<br>然后 Cherry pick 到 v11.7.0 分支上，最后 push v11.7.0 分支到远端分支上。

## git 上做文件大小写重命名坑

> git 大小写不敏感

### 设置 git 库为大小写敏感（不建议）

```
git config core.ignorecase false
```

用这种方法进行重命名，用 git status 就可以识别出修改了，但是不推荐用这种方式，因为在更新这种修改的时候会有麻烦。

### 使用 git mv 命令（仅当 core.ignorecase 为 true 时可用

```
 git mv ABC.java Abc.java
```

此时的状态是 renamed，git commit 即可。

### `core.ignorecase` 为 false 时，更新时错误

core.ignorecase 不为 true 时会出现如下错误

```
error:
 The following untracked working tree files would be overwritten by merge:

        Abc.java
```

或者在切换分支等操作的时候莫名出现这样的错误，解决方法都是将 core.ignorecase 设置为 true，然后再进行操作。

## Git 行尾换行符 line-ending（CRLF&LF）

### 遇到的问题

在 Windows 平台上，会出现如下的 warning：

```
$ git add app.wxss
warning: LF will be replaced by CRLF in app.wxss.
The file will have its original line endings in your working directory.
```

### Why？

1. Windows 在换行的时候，同时使用了回车符 (carriage-return character) 和换行符 (linefeed character)；
2. Mac 和 Linux 系统 (很老的 mac 系统才是 CR，可以参见 wiki)，此时，仅仅使用了换行符 (linefeed character)。
3. 同时呢，Windows 的许多编辑器还悄悄滴将 LF 修改成了 CRLF 格式的行结束符，或者在你敲回车的时候，CRLF 格式的行结束符就产生了。当然，这一切都发生在同时存在 Windows 和非 Windows 的跨平台工作中，如果大家都是同一种操作系统，那么，就天下太平了。

**warning 中所说的 LF 和 CRLF 分别是** `linefeed`**和**`carriage-return&linefeed`**。**

- Git 为什么 LF->CRLF<br>Git 有一个针对性的功能：当添加到暂存区时，自动将 CRLF 转换成 LF；反之，当检出时，自动将 LF 转换成 CRLF。<br>可以通过设置 `core.autocrlf` 来开启这个功能

## cherry-pick Git 中只 merge 部分 commit

### git cheery-pick（单个 commit）

在 Git 1.7.2 以上的版本引入了一个 cheery-pick 的命令可以只 merge 部分的 commit 而不用直接把整个分支 merge 过来：

```
git cherry-pick <commit 号>
```

如

```
git cherry-pick e43a6fd3e94888d76779ad79fb568ed180e5fcdf
```

这样就只会把这个 `e43a6fd3e94888d76779ad79fb568ed180e5fcdf` commit 的内容 pull 到当前的分支，不过你会得到一个新的 commit。 这样就可以按需 merge 需要的 commit,而不需要的就可以直接废弃咯。

### 多个 commit

可以用空格指定多个 commit:

```
git cherry-pick b8dcc42 3370c39
```

### 范围 merge

cherry-pick 可以范围 merge ,使用 两次版本间使用 `..` 连起来：

```
git cherry-pick A..B
```

这样会把从从版本 A（不包含）到 B（包含）即（A，B] 的版本 pull 到当前分支<br>甚至，可以使用多段，同样使用空格隔开：

```
git cherry-pick A..B C..D E..F
```

注：中间需要自己解决冲突，若出现冲突，可以尝试使用 git mergetool 使用 GUI 工具解决

## Git 拉取大仓库技巧

- 背景：

> 一般仓库文件不大时，我们都可以用这个方法 git clone 仓库，但问题是有时候，在仓库历史的某次 commit 时，有人不小心提交了 1G 的文件，虽然后面的 commit 中他把这个文件删除了，但是在.git 文件夹中仍然存储着这个文件，所以如果我们克隆仓库这个仓库，会把所有的历史协作记录都 clone 下来，这样整个文件会非常大，其实对于我们直接使用仓库，而不是参与仓库工作的人来说，只要把最近的一次 commit 给 clone 下来就好了。这就好比一个产品有很多个版本，我们只要 clone 最近的一个版本来使用就行了。实现这个功能就需要用到 git clone --depth=1 命令

### git clone --depth 1 克隆最近一次 commit

- **只克隆下包含最近一次 commit 的一个分支：**

```
git clone --depth 1 https://github.com/labuladong/fucking-algorithm.git
```

`--depth` 用来指定克隆的深度，1 表示克隆最近的一次 commit。这种方法克隆的项目只包含最近的一次 commit 的一个分支，体积很小。<br>需要将该分支所有的 commit 克隆下来的话，可以用下面的命令：

```
git fetch --unshallow
```

但会产生另外一个问题，他只会把默认分支 clone 下来，其他远程分支并不在本地，所以这种情况下，需要用如下方法拉取其他分支：

```
$ git clone --depth 1 https://github.com/dogescript/xxxxxxx.git
$ git remote set-branches origin 'remote_branch_name'
$ git fetch --depth 1 origin remote_branch_name
$ git checkout remote_branch_name
```

- **只克隆某个指定分支的最近一次 commit**

```
git clone --depth 1  --branch english https://github.com/labuladong/fucking-algorithm.git
```

- **git clone --depth=1 后拉取其他分支的方法**

> 上面提到的 git clone --depth=1 操作只会 clone 一个分支 english，如果我们想把其他远程分支 (如 master) 也克隆到本地，我们需要用下面的命令

```
git clone --depth 1 https://github.com/labuladong/fucking-algorithm.git
git remote set-branches origin 'remote_branch_name'
git fetch --depth 1 origin remote_branch_name
git checkout remote_branch_name
```

### Sparse Checkout 拉取某个目录

Git 基于元数据方式分布式存储文件信息的，它会在每一次 Clone 的时候将所有信息都取回到本地，即相当于在你的机器上生成一个克隆版的版本库。<br>Git 通过 `Sparse Checkout` 支持拉取子文件夹，   其中一共 5 个步骤，分别进行分析：

```
（1）在指定的文件夹下，创建一个空的repository。
（2）获取远程仓库中的所有对象，但不Check out它们到本地，同时将远程Git Server URL加入到Git Config文件中，这个过程会耗时多一点，如果项目比较大。
（3）在Config中允许使用Sparse Checkout模式。
（4）定义要实际检出的文件/文件夹。这是通过在列表中借助“.git/info/sparse-checkout”将他们列出。也支持用感叹号`!`实现反向操作
（5）见证奇迹的时刻，从远程库中拉取你要检出的项目。
```

如，公司的 ui 图，所有项目都在一起，总共有 7G 多，新来的同学要全部拉取，那是个灾难：

```shell
# 初始化一个仓库
git init

# 添加远程url，项目大的化，会很慢
git remote add -f origin git@git.moumentei.com:ddddffe/qiubai_design.git

# 配置支持sparse checkout，在.git/config文件写个配置
git config core.sparseCheckout true

# 添加子文件夹，在.git/info/sparse-checkout添加一条记录
echo "标注与切图/糗百新版/用户教育/截图分享&看图分享" >> .git/info/sparse-checkout

# 拉取
git pull origin master
```

- 要 Sparse Checkout 的目录：

```shell
#!/usr/bin/env bash
# 用于配置Sparse Checkou目录

git config core.sparsecheckout true

echo "【要Sparse Checkout的目录】：" $@
for var in "$@"
do
    echo "    目录已配置Sparse Checkout：$var"
    echo ${var} >> .git/info/sparse-checkout
done
echo "【当前的Sparse Checkout配置】："
#ls -al .git/info/sparse-checkout
cat .git/info/sparse-checkout
#open .git/info/sparse-checkout
git pull origin master

#标注与切图/糗百新版/用户教育/截图分享&看图分享
#标注与切图/糗百新版/单帖页/评论详情排序
#标注与切图/糗百新版/发帖审帖/糗事发帖授权协议
```

- [ ] Sparse checkout 解决 pull 远程库特定文件失败问题<br><https://blog.csdn.net/zzh920625/article/details/77073816>

# Git 遇到的问题

## ssh_exchange_identification: Connection closed by remote host

> 开了 vpn 或者 ss 等代理开了全局模式

## git pull refusing to merge unrelated histories

1. 错误

```
$ git pull
fatal: refusing to merge unrelated histories
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104905.png)

2. 原因

<https://github.com/git/git/blob/master/Documentation/RelNotes/2.9.0.txt#L58-L68>

3. 解决

```
git pull --allow-unrelated-histories
```

## No newline at end of file

每个文本文件最后要有一行空格，否则会提示在 SourceTree<br>`No newline at end of file`<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104906.png)

## error: invalid path(Linux/Mac 下的文件在 Windows 下 clone 失败)

- 问题：

```
在git clone到本地时遇到报错：
error: invalid path 'src/main/java/com/sankuai/meituan/hive/udf/Aux.java'
fatal: unable to checkout working tree
warning: Clone succeeded, but checkout failed.
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104907.png)

- 分析：<br>core.protectNTFS 默认为 true。官方解释：If set to true, do not allow checkout of paths that would cause problems with the NTFS filesystem

> NTFS 有个路径保护机制，防止文件系统出错

- 解决：

```shell
# 忽略路径中的转义字符，否则在mac和windows混合路径可能会报错
git config --global core.protectNTFS false
```

## 在 git 拉取的时候报错 fatal: cannot create directoryxxxx': Invalid argument

- 问题：<br> ![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104908.png)
- 原因：<br>UI 同事用的是 Mac，你用的是 Windows 的话，其中有个文件夹的名称中有一个 / 号，这个文件夹命名规则在苹果上没有问题，但在 windows 上，不能通过 git 创建这个文件夹（git 项目中的某个文件夹的名字中有 windows 不允许的字符比如 `?，. ， \ :` 等）<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104909.png)
- 解决：<br>让 UI 同事修改文件夹的名称 (不能包含 `/:*?"<>|` 中的任何一种符号)

## git pull 时远端存在删除 remote 时，报错 error: cannot lock ref unable to update local ref

**原因：**<br>远端删除了分支 `origin/xos2/gac/res/sop0_hotfix`，git pull 时报错<br>**错误：**<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104910.png)<br>**解决**

1. 清除松散对象

```
git gc --prune=now
```

2. 刷新本地分支 (步远程仓库分支到本地，删除远程分支不存在但是本地还有的分支)

```
git remote prune origin
```

3. 拉取远端仓库代码

```
git pull
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104911.png)

## error: RPC failed; curl 56 Recv failure: Connection was reset/s

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104912.png)

- **原因**<br>在网络情况不稳定下克隆项目时，可能会出现上图中的错误。<br>问题原因：Http 缓存不够或者网络不稳定等。
- **解决：**

```
git config --global http.postBuffer 524288000
```

## git push pre-receive hook declined

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290104913.png)<br>**分析：就是没有权限**；在使用 Git 进行推送（push）操作时，如果出现 "pre-receive hook declined" 的错误提示，这通常意味着 Git 服务器上的 pre-receive 钩子阻止了推送操作的执行。这个错误提示通常意味着 Git 服务器上设置了一些规则或限制，以确保代码库的安全性和稳定性。<br>出现 "pre-receive hook declined" 错误的原因通常是由于 pre-receive 钩子执行了某些验证操作，但是这些操作未通过检验，导致钩子返回了 false，从而阻止了推送操作的执行。具体钩子脚本中执行的操作和验证规则与 Git 服务器的配置和要求有关，因此需要具体问题具体分析。<br>要解决这个问题，首先需要查看 Git 服务器的配置，了解 pre-receive 钩子的具体规则和验证操作。然后需要检查自己提交的代码是否符合这些规则，如果不符合，需要对代码进行修改，然后重新推送。如果需要修改 pre-receive 钩子的验证规则，可以联系 Git 服务器管理员进行配置修改。
