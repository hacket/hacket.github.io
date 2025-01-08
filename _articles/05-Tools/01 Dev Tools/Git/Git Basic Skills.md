---
date created: 2024-03-13 10:52
tags:
  - '#恢复最新的进度到工作区和暂存区。（尝试将原来暂存区的改动还恢复到暂存区）'
  - '#恢复指定的进度到工作区。stash_id是通过git'
  - '#或'
  - '#built'
  - '#NDK'
  - '#!!'
date updated: 2024-12-28 23:29
dg-publish: true
---

# Git基础

## 工作区(Working Directory)、暂存区(stage)和版本库

### Git工作区、暂存区和版本库概念

- 工作区：修改后的文件或新增的文件，未进行staged和commit操作；Git Fork中对应Unstaged视图里的文件
- 暂存区：英文叫 stage 或 index。一般存放在 .git 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。
- 版本库：工作区有一个隐藏目录 .git，这个不算工作区，而是 Git 的版本库。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123798.png)

- 图中左侧为工作区，右侧为版本库。在版本库中标记为 "index" 的区域是暂存区（stage/index），标记为 "master" 的是 master 分支所代表的目录树。

### git命令在不同区切换

- git add 工作区→暂存区(就是把文件修改添加到暂存区)
- git commit 暂存区→版本库（就是把暂存区的内容提交到当前分支)
- git diff区别
  - git diff 是工作区(work dict)和暂存区(stage)的比较
  - git diff --cached 是暂存区(stage)和分支(master)的比较
- git管理方式<br>git管理的是修改而不是文件，如一个文件修改一行，再重命名，提交；git会识别出修改+重命名操作，而不是像SVN删文件+新文件操作
- 丢弃git工作区和暂存区修改
  - git checkout .

会用暂存区全部或指定的文件替换工作区的文件。这个操作很危险，会清除工作区中未添加到暂存区中的改动。

```shell
git checkout . 

git checkout -- <file> 命令时
```

- git checkout HEAD .

会用 HEAD 指向的 master 分支中的全部或者部分文件替换暂存区和以及工作区中的文件。这个命令也是极具危险性的，因为不但会清除工作区中未提交的改动，也会清除暂存区中未提交的改动。

```shell
git checkout HEAD . 或者 git checkout HEAD <file> 命令时
```

- git reset

丢弃暂存区修改(丢弃已经add的文件，把暂存区修改撤销掉恢复到unstage状态，重新放回工作区)

```git
git reset HEAD readme.txt
```

`_git reset_`_既可以回退版本，也可以把暂存区的修改回退到工作区_

```
  - 删除文件
  - 工作区删除， 然后add到暂存区
```

- git rm

```git
git rm test.txt
```

## git中文件的各个状态

- **unstaged** - git仓库中没有此文件的相关记录
- **modified** - git仓库中有这个文件的记录，并且此文件当前有改动
- **staged** - 追加,删除或修改的文件被暂时保存，这些追加,删除和修改并没有提交到git仓库
- **commited** - 追加或修改的文件被提交到本地git仓库（git仓库中大部分都是这种文件，所以git status不显示这些文件）

## 基本命令

### git init 初始化为git仓库(init)

```git
git init
```

在当前文件夹下生成.git目录，完成初始化，此时此文件夹下的所有文件处于unstaged状态

### git clone 克隆仓库(clone已经存在的远程仓库)

1. `git clone {要获取库的URL}`获取远程库到当前文件夹

```git
git clone https://github.com/hacket/NetRequest.git
```

2. `git clone --depth 1` clone最近一次commit

### git add 将文件添加到暂存区(add)

- git add，a.text的文件变为staged状态，其他文件还是unstaged状态<br>`git add a.text`<br>add所有<br>`git add .`
- git rm<br>`git rm --cache a.text` 恢复为原先状态（变为unstaged）
- git reset<br>取消刚才的暂时保存，状态变回modified<br>`git reset test.c`

### git commit 保存到仓库(commit)

```git
git commit -m 'a.text'
```

`-m '提交的信息'`  单引号里面是你对这一次存档的描述<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123803.png)

### git log 查看提交记录(log)

- **每个提交都列出了修改过的文件，** 以及其中添加和移除的行数，并在最后列出所有增减行数小计

```git
git log --stat
```

- **每个提交 放在一行显示** 另外还有`short`，`full` 和`fuller` 可以用，展示的信息或多或少有些不同

```git
git log --pretty=oneline
```

- 查看log显示较少信息

```git
git log
```

- 查看log显示很多信息

```git
git log --pretty=raw
```

### git remote xxx

Git Remote是一个指针，它指向通常托管在远程服务器上的存储库的另一个副本

- git remote -v  列出现有的仓库并查看其名称和URL

```git
❯ git remote -v
origin  git@github.com:hacket/king-assist.git (fetch)
origin  git@github.com:hacket/king-assist.git (push)
```

- git remote add {远程库的名字(一般为origin)} {远程库的URL} 为一个仓库添加远程url

```git
git remote add origin https://github.com/hacket/NetRequest.git
```

- git remote set-url {远程库的名字(一般为origin)} {远程库的URL}

git remote set-url命令的实际作用是使用指向远程存储库的新URL更新存储库`.git/config文件`

```shell
[remote "origin"]

url = git@gitserver.com:user/repo_name.git

fetch = +refs/heads/*:refs/remotes/origin/*
```

> 远程URL可以以HTTPS或SSH开头。如果未指定协议，则默认为SSH。该URL可以在Git托管服务的存储库页面上找到。

### 常用git config

- 设置git status颜色

```git
git config --global color.status auto
```

- 设置全局username和email

```git
git config --global user.name "hacket"
git config --global user.email "zeng_fansheng@sina.com"
```

### git status 查看状态

```git
git status
```

## git push、pull、fetch

### git push 推送至远程仓库

> git push {远程库的名字} {要推送的分支}

```git
git push origin master
```

默认Git有条主分支`master`，也就是我们`hello`文件`commit`所在分支.<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123804.png)

### git pull fetch远端更新并merge

> git pull {远程库的名字} {要推送的分支}

```shell
git pull origin master
```

## git reset (git 版本回退)

- `HEAD`概念<br>在Git中，在Git中，用`HEAD`表示当前版本；上一个版本就是`HEAD^`，上上一个版本就是`HEAD^^`，当然往上100个版本写100个`^`比较容易数不过来，所以写成`HEAD~100`。
- 回退到上一个版本<br>回退到上一个版本，就可以使用`git reset`命令：

```git
git reset --hard HEAD^
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123805.png)

> --hard参数?<br>此时readme.txt内容已经变化，`git log`也已经看不到之前的提交了，只能看到上一个版本的提交log。

- 回退到未来版本<br>如果我还想回到最开始提交，只要命令行没有关闭，找到提交的`commit id`，就可以回到未来指定的某个版本：

```git
git reset --hard 5484
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123807.png)

- 为什么git回退速度这么快？<br>因为Git在内部有个指向当前版本的`HEAD`指针，当你回退版本的时候，Git仅仅是把HEAD从指向要回退的版本`append GPL`：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123808.png)<br>改为指向`add distributed`：<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123809.png)<br>然后顺便把工作区的文件更新了。所以你让`HEAD`指向哪个版本号，你就把当前版本定位在哪。
- 找不到之前`commit id`，用`git reflog`用来记录你的每一次命令操作：

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123810.png)<br>想恢复到 `append GPL`，找到从下到上第3行：

```git
git reset --hard d769c1c
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123811.png)

## git远程仓库操作

- 简单查看-所有仓库，只能查看远程仓库的名字<br>`git remote`
- 查看更多内容-所有仓库，远程仓库的名字及git地址<br>`git remote -v`
- 查看单个仓库的信息<br>`git remote show [remote-name]`
- 新建远程仓库<br>`git remote add [shortname] [url]`
- 修改远程仓库<br>`git remote rename [oldnanme] [newname]`
- 删除远程仓库<br>`git remote rm [remote-name]`
- 获取远程仓库的数据<br>`git fetch [remote-name] (获取仓库的所有更新，但是不自动合并当前分支)`<br>`git pull (获取仓库的所有更新, 并且自动合并到当前分支)`
- 上传数据到远程仓库<br>`git push [remote-name] [branch-name]`

# Git branch 分支

## 本地分支、远程分支、跟踪分支(tracking)、HEAD分支

### 本地分支(local branch)

我们自己本地git仓库所拥有的分支

### 远程分支(remote branch)

和本地分支一样，只是存在于远程服务器，我们无法移动它，必须要在和服务器交互更新到本地来的代码移动

### 跟踪分支(tracking branch)

它是一个本地分支，只是它对应了一个远程分支，叫做_跟踪分支_；或者从远程分支checkout出来的本地分支，叫做_跟踪分支_。跟踪分支是一种和远程分支有直接联系的本地分支。在`clone`仓库时，git通常会自动创建一个名为`master`的分支来跟踪`origin/master`。

### HEAD

git 中的分支，其实本质上仅仅是个指向 commit 对象的可变指针。git是如何知道你当前在哪个分支上工作的呢？<br>它保存着一个名为 `HEAD` 的特别指针。在 git 中，它是一个指向你正在工作中的本地分支的指针，可以将 HEAD 想象为当前分支的别名。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123812.png)

1. `git reset HEAD <file>` 指的是恢复到当前分支中文件的状态
2. `git log` 日志展示中`HEAD -> master`指的是：当前分支指向的是master分支。

The HEAD: Pointer to last commit snapshot, next parent

> The HEAD in Git is the pointer to the current branch reference, which is in turn a pointer to the last commit you made or the last commit that was checked out into your working directory. That also means it will be the parent of the next commit you do. It's generally simplest to think of it as HEAD is the snapshot of your last commit.

查看HEAD:

```git
cat .git/HEAD
Ref: refs/heads/master
```

## 本地分支

### 1、创建分支并切换

创建一个叫做`“feature_hacket”`的分支，并切换过去，此时git commit就提交到该branch

```git
git checkout -b feature_hacket
```

`git checkout`命令加上`-b`参数表示创建并切换，相当于两条命令：

```git
git branch feature_hacket
git checkout feature_hacket
```

**注意：**在哪个分支拉取新的分支，那么就从这个分支的拉取，新拉取分支的HEAD和所在分支的节点信息一致。

> 使用git init初始化，然后立即git branch，不会出现任何分支包括master，因为git的分支必须指向一个commit，没有任何commit就没有任何分支，提交第一个commit后git自动创建master分支

### 2、查看分支状态

`git status`

- 查看当前所在分支<br>`git checkout`

### 3、切换分支

- 切换回主分支<br>`git checkout master`

**未commit的工作区文件和stage文件是可以灵活地在且仅在任一branch分支的**，切换到新的分支也可以看到这些文件，commit后的就看不到了<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123813.png)

### 4、更新和合并

- 新你的本地仓库至最新改动，_获取（fetch）_ 并 _合并（merge）_ 远端的改动<br>`git pull`
- 合并其他分支到你的当前分支（例如 master），记得push<br>`git merge <branch>`

`git pull`和`git merge`两种情况下，git 都会尝试去自动合并改动。不幸的是，自动合并并非次次都能成功，并可能导致 _冲突（conflicts）_。 这时候就需要你修改这些文件来人肉合并这些 _冲突（conflicts）_ 了。

- 在合并改动之前，也可以使用如下命令查看<br>`git diff <source_branch> <target_branch>`
- `git rebase`替代`git merge`<br>将分支dev2222合并到mastersetUs

```git
git rebase dev2222
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123814.png)

### 5、删除分支

> 删除分支，需要当前不在这个分支才能删除

把新建的分支 `feature_hacket` 删掉，如果没有merge到master，会报错<br>git branch -d feature_hacket<br>强制删除可以使用<br>`git branch -D feature_hacket`<br>除非你将分支推送到远端仓库，不然该分支就是 不为他人所见的：<br>`git push origin <branch>`

### 6、rest 丢弃commit的内容

丢弃你所有的本地改动与提交，可以到服务器上获取最新的版本并将你指定的主分支指向到它

```git
git fetch origin
git reset --hard origin/feature_hacket
```

### 7、stash 暂存

git stash这个命令可以将当前的工作状态保存到git栈，在需要的时候再恢复。

- 默认

```shell
git stash
# 保存当前的工作区与暂存区的状态，把当前的修改的保存到git 栈，等以后需要的时候再恢复，git stash 这个命令可以多次使用，每次使用都会新加一个`stash@{num}`，num是编号
```

- 带消息的 Git stash

```shell
git stash save "Your stash message"
# 或者
git stash push -m "Your stash message"
```

- 列举所有stash

```shell
git stash list
# 查看当前stash的所有内容
```

- 恢复stash，但不删除stash

```shell
git stash apply
git stash apply stash@{0}
# git stash apply [–index] [stash_id] 除了不删除恢复的进度之外，其余和`git stash pop` 命令一样。
# 将堆栈中的内容恢复到当前分支下。这个命令不同于 git stash pop。该命令不会将内容从对堆栈中删除，也就是该命令能够将堆栈的内容多次运用到工作目录，适合用与多个分支的场景
```

- 恢复最新的stash，并删除该stash

```shell
# git stash pop [–index] [stash_id]
git stash pop # 恢复最新的进度到工作区。git默认会把工作区和暂存区的改动都恢复到工作区。
git stash pop --index #恢复最新的进度到工作区和暂存区。（尝试将原来暂存区的改动还恢复到暂存区）
git stash pop stash@{1} #恢复指定的进度到工作区。stash_id是通过git stash list命令得到的

# 默认恢复git栈中最新的一个`stash@{num}`，建议在git栈中只有一条的时候使用，以免混乱
# 注：该命令将堆栈中最新保存的内容删除
```

- 从堆栈中移除指定的stash

```shell
git stash drop
git stash drop stash@{$num}

# git stash drop [stash_id]
# 删除一个存储的进度。如果不指定stash_id，则默认删除最新的存储进度。
```

- 移除全部stash

```shell
git stash clear
```

- 查看差异

```shell
git stash show
# 查看堆栈中最新保存的stash和当前⽬录的差异，显⽰做了哪些改动，默认show第一个存储
```

### 8、查看分支

基本语法是：`git branch 参数`

```shell
git branch 列出本地已经存在的分支，并且当前分支会用*标记
git branch -r 查看远程版本库的分支列表
git branch -a 查看所有分支列表（包括本地和远程，remotes/开头的表示远程分支）
git branch -v 查看一个分支的最后一次提交
git branch --merged  查看哪些分支已经合并到当前分支
git branch --no-merged 查看所有未合并工作的分支
```

- `不加参数`或`-l` 查看本地所有分支，当前分支前面会标一个`*`号

```shell
> git branch
#或
> git branch -l

  9.2.0/user
  9.2.0/user-wkg
  9.2.0/user_lizhipei
* master # 当前所在分支
```

- `-r`查看远程分支

```shell
> git branch -r
 origin/6.0.0
  origin/6.2.4
  origin/6.2.8
  origin/6.5.2
  origin/6.5.6
  origin/6.6.0
  origin/6.6.2
  origin/6.6.4
  origin/6.6.6
  origin/6.6.8
  origin/6.7.2
  origin/6.7.3
  origin/6.7.4
  origin/6.7.6
# 分支太多，按enter继续，按q退出
```

- `-a`查看所有本地和远程分支(远程分支会用红色表示出来)

```shell
> git branch -r
  9.2.0/user
  9.2.0/user-wkg
  9.2.0/user_lizhipei
* master
  remotes/origin/6.0.0
  remotes/origin/6.2.4
  remotes/origin/6.2.8
  remotes/origin/6.5.2
  remotes/origin/6.5.6
  remotes/origin/6.6.0
  remotes/origin/6.6.2
  remotes/origin/6.6.4
  remotes/origin/6.6.6
```

- `-vv`或`-vva`参数，查看本地/远程分支更详细信息（如正在使用的本地或远程分支、提交 ID 和提交信息等）

```shell
# 查看本地分支的详细信息
git branch -vv
  9.2.0/user          432193e7e4 [origin/9.2.0/user] Merge branch '9.2.0/ft-login-refactor-conflict' into '9.2.0/user'
  9.2.0/user-wkg      e139b9583f [origin/9.2.0/user-wkg] fix(WEB-7760):付费会员-"buy_when": null, "trial_status": 0,的情况下，返回了产品
包价值引导 终端没展示
  9.2.0/user_lizhipei 34d2ed07a7 [origin/9.2.0/user_lizhipei] feat(SAB-51566):vn、tw、uk、mx、se域名支持onelink
* master              630a51be2b [origin/master] Merge branch '9.2.0/release' into 'master'

# 查看本地和远程分支的详细信息
> git branch -vva
  9.2.0/user                                               432193e7e4 [origin/9.2.0/user] Merge branch '9.2.0/ft-login-refactor-conflict' into '9.2.0/user'
  9.2.0/user-wkg                                           e139b9583f [origin/9.2.0/user-wkg] fix(WEB-7760):付费会员-"buy_when": null, "trial_status": 0,的情况下，返回了产品包价值引导 终端没展示
  9.2.0/user_lizhipei                                      34d2ed07a7 [origin/9.2.0/user_lizhipei] feat(SAB-51566):vn、tw、uk、mx、se域名支持onelink
* master                                                   630a51be2b [origin/master] Merge branch '9.2.0/release' into 'master'
  remotes/origin/6.0.0                                     b6f1a5d101 fix:fresco gif
  remotes/origin/6.2.4                                     11c169e413 6.2.4 build
  remotes/origin/6.2.8                                     fe4147c925 6.2.8修复
  remotes/origin/6.5.2                                     2e6f1929ae URL modify
```

- 打印当前本地分支名

```shell
# git symbolic-ref --short HEAD
❯ git symbolic-ref --short HEAD
test_git_hooks

# git rev-parse --abbrev-ref HEAD
❯ git rev-parse --abbrev-ref HEAD
test_git_hooks

## --abbrev-ref 表示输出所给对象不会混淆的短名，不加 --abbrev-ref 时，会打印出HEAD对应的hash值：
❯ git rev-parse HEAD
0f5311feaa12335e316e5bd550b8128bd430b447
```

### 9、合并分支

#### 1、fast-forward 合并

`git merge`用于合并指定分支到当前分支。

```shell
git merge dev
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123815.png)

> 注意到上面的`Fast-forward`信息，Git告诉我们，这次合并是“快进模式”，也就是直接把`master`指向`dev`的当前提交，所以合并速度非常快。当然，也不是每次合并都能`Fast-forward`。

#### 2、有冲突的merge，当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。

用带参数的`git log`也可以看到分支的合并情况

```shell
git log --graph --pretty=oneline --abbrev-commit
```

### 10、删除分支

```shell
git branch -d dev
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123816.png)<br>因为创建、合并和删除分支非常快，所以git鼓励你使用分支完成某个任务，合并后再删除掉分支，这和直接在`master`分支上工作效果是一样的，但过程更安全。

## 远程分支

更新远程代码到本地有两个命令，fetch和pull。

- fetch : 是将远程代码更新到本地，但不会执行合并操作，需要自己查看，解决冲突，然后merge新来的代码合并到我们自己的分支<br>`git fetch 远程仓库 [本地分支]:[远程分支]`

```shell
git fetch origin dev_2:master
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123817.png)

- pull : 将这两个操作合成了一步，直接更新服务器代码更新并合并到到本地指定分支，当然遇到冲突也必须要自己解决
- push<br>`git push 远程仓库 [远程分支]:[本地分支]`

```shell
git push origin master:dev_2
```

- 推送本地分支到远程仓库

```shell
git push origin dev_22
```

- 删除远程分支<br>`git push 远程仓库 :远程分支`

```shell
git push origin :dev_2
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123818.png)<br>或者

```shell
git push --delete origin dev_22
```

### 远程分支的stale状态

```git
git remote show origin
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123819.png)<br>**原因：** 其他人删除了远程仓库，我 fetch 和 pull 这些远程仓库还在，使用 `git branch -a` 在还在，都是 stale 状态。<br>**解决：** 使用 prune

```shell
git remote prune origin
```

更简单的方法是使用这个命令，它在fetch之后删除掉没有与远程分支对应的本地分支：

```shell
git fetch -p
```

## 跟踪分支(tracking branch)

**1、创建跟踪分支和远程分支名一样**

```shell
git checkout --track origin/dev_2
```

**2、创建一个跟踪分支并切换到该分支，并指定本地分支名字**<br>`git checkout -b [本地分支名] [远程名]/[分支名]`<br>如创建dev_4本地分支并track远程master分支

```shell
git checkout -b dev_4 origin/master
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123820.png)<br>**3、指定本地的分支成为追踪分支**

```shell
git branch -f --track dev_3 origin/master
```

# Git tag 标签

每发布一个版本，通常会在版本库中打一个tag。将来可以将这个tag版本取出来。tag和branch类似，只是branch可以移动，而tag不能移动。

## 1、查看tag

- 查看所有tag<br>`git tag`
- 查看某个tag<br>`git show [tag-name]`

## 2、新建tag

- 轻量级tag，默认tag是打在最新提交的commit上<br>`git tag [tag-name]`
- 带标注的tag<br>`git tag -a [tag-name] -m "tag message"`
- 后期追加tag,创建一个叫做v1.0.0的tag<br>`git tag v1.0.0 1b2e1d63ff`

`1b2e1d63ff`是你想要标记的提交 ID 的前 10 位字符，通过git log获取提交ID。你也可以用该提交 ID 的少一些的前几位，只要它是唯一的。

- 删除tag<br>`git tag -d [tag-name]`

## 3、push到远端

- push一个tag

```shell
git push origin <tagname>
```

- 一次性推送全部尚未推送到远程的本地tag

```shell
git push origin --tags
```

- 删除远程tag，先删除本地，再push

```shell
git tag -d v1.1
git push origin :refs/tags/v1.1
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123821.png)

## git tag --contain

```shell
-contains <commit>   print only tags that contain the commit // 打印包含该commit的tags
--no-contains <commit> print only tags that don't contain the commit // 打印不包含该commit的tags
```

# Git config 配置

修改的都是用户目录下的`.gitconfig`文件，这个文件是全局配置

## git config介绍

Git有一个工具被称为git config，它允许你获得和设置配置变量；这些变量可以控制Git的外观和操作的各个方面。这些变量可以被存储在三个不同的位置：

1. `/etc/gitconfig`文件：**针对整个系统**。包含了适用于系统所有用户和所有库的值。如果你传递参数选项`--system`给 git config，它将明确的读和写这个文件。
2. `~/.gitconfig`文件 ：**针对单个用户**。在用户的主目录。你可以通过传递`--global`选项使Git 读或写这个特定的文件。
3. `.git/config`：**针对单个仓库**。位于git目录的config文件 (也就是 .git/config) ：无论你当前在用的库是什么，特定指向该单一的库。每个级别重写前一个级别的值。因此，在.git/config中的值覆盖了在/etc/gitconfig中的同一个值。

## color.status 设置git status颜色

```shell
git config --global color.status auto
```

## mergetool.keepBackup git mergetool不再生成烦人的备份文件（`*.orig`）

```shell
git config --global mergetool.keepBackup false
```

## 你的标识(Your Identity) ：user.name和user.email 配置全局用户和邮箱

每次提交时都会使用到这2个信息。

```git
git config --global user.name "hacket"
git config --global user.email "zeng_fansheng@sina.com"
```

## `core.protectNTFS` 忽略路径中的转义字符，否则在mac和windows混合路径可能会报错

```shell
git config --global core.protectNTFS false
```

git error：invalid path问题解决（Windows下）
具体问题：

```shell
在git clone到本地时遇到报错：
error: invalid path 'src/main/java/com/sankuai/meituan/hive/udf/Aux.java'
fatal: unable to checkout working tree
warning: Clone succeeded, but checkout failed.
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123822.png)

**分析：**
`core.protectNTFS` 默认为 true。官方解释：If set to true, do not allow checkout of paths that would cause problems with the NTFS filesystem

> NTFS有个路径保护机制，防止文件系统出错

## core.autocrlf 禁用换行符转换

```shell
git config --global core.autocrlf false
```

## 你的比较工具(Your Diff Tool)

```shell
git config --global merge.tool vimdiff
```

## 查看git config

### 查看所有

```shell
git config --list
```

### 查看某一个

```shell
git config user.name 
```

# Git冲突

## 手动解决冲突

**查看冲突**

```shell
git diff
```

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123823.png)

<br> **分析**

- `<<<<<<<`标记冲突开始，后面跟的是当前分支中的内容,HEAD指向当前分支末梢的提交
- `=======` 之后，`>>>>>>>` 之前是要 merge 过来的另一条分支上的代码。  >>>>>>>之后是另外一个 commit 的 id。
- 对于简单的合并，手工编辑，然后去掉这些标记，最后像往常的提交一样先add再commit即可。

**解决后再次添加add：**`git add .`<br>**再commit：**`git commit -m 'xxx'`<br>**最后push**：`git push origin master`

## merge工具解决

### `git mergetool`  执行这句就会生成几个文件

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123824.png)<br>上面是`"LOCAL"`、`"BASE"`、`"REMOTE"`，它们只是提供解决冲突需要的信息，是无法编辑的。<br>下面一个窗口是合并后的结果，可以手动修改，也可以点击相应颜色的箭头选择"LOCAL"或者"REMOTE"。<br>readme_BACKUP_8264.txt 冲突文件的备份<br>readme_BASE_8264.txt 冲突前修改的<br>readme_LOCAL_8264.txt 本地修改的<br>readme_REMOTE_8264.txt 远程库的

### Beyond Compare

具体见 [[Beyond Compare4]]

### TortoiseGit→Edit conflicts

### Android Studio Merge Tool

### Vscode

见 [[Git GUI工具#VS Code 解决 Git 冲突]]

### Git Fork自带

见 [[Git GUI工具#Git fork解决冲突]]

## Merge Request冲突

- [x] [GitLab Merge request 合并分支时的冲突解决方案](https://softgoto.top/posts/90c4bd5b.html#%E6%96%B9%E5%BC%8F%E4%B8%80%EF%BC%9A%E5%9C%A8%E6%9C%AC%E5%9C%B0%E5%B0%86-develop-%E5%90%88%E5%B9%B6%E5%88%B0-main%EF%BC%8C%E5%A4%84%E7%90%86%E5%86%B2%E7%AA%81%E5%90%8E%E6%8E%A8%E9%80%81%E5%88%B0%E8%BF%9C%E7%A8%8B%E7%9A%84-main%EF%BC%8CGitLab-%E4%B8%AD%E7%9A%84-Merge-Request-%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%90%88%E5%B9%B6)

前提，你在个人开发分支dev开发功能，开发完后要提交到master分支，master分支是protected的，你开发完毕后，发一个dev到master的MR，这时出现了冲突

### 解决1：网站上resolved按钮（master要有权限）

在网站上解决冲突，然后提交，这种要求有master的权限，但我们一般是没有master权限，这种方式不行

### 解决2：本地dev合并到本地master（master要有权限）

本地master拉取最新代码，然后将本地dev合并到本地master，处理冲突后推送到远程的 master，GitLab 中的 Merge Request 自动完成合并<br>如果master分支是受保护的分支，并且开发人员的账号没有 merge 的权限，就只能用下面的方案了

### 解决3：本地master合并到本地dev 远端master会污染dev分支

master拉取远端最新代码，将本地master合并到本地dev，处理冲突后推送到远程的dev，在 GitLab 中手动点击 Merge（不推荐，会污染分支代码）<br>这种方式的话， 如果远端是新的代码，合并到dev的话，**会把dev的分支代码给污染**了

> 如果不是master，而是release分支（release分支包括了所有业务的最新代码），如果将release分支的代码merge到你的dev分支，你的dev分支就被污染了

### 解决4：临时分支

#### 个人分支→master（master 一般保护，不让推送）

1. 本地master分支拉取最新的远端master分支的代码
2. 基于本地master拉取一个dev_temp分支（此时dev_temp拥有最新代码）
3. 将dev分支合并到dev_temp分支，解决好冲突
4. 发dev_temp到master的MR，此时就没有冲突了

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123825.png)

#### 业务分支→release (保护)

**一种情况**：业务分支 `ft-cart-share` 合并到 release 冲突(release 为保护分支，无权限)

1. 基于release拉临时分支cart-share-tmp2，将ft-cart-share分支合并到cart-share-tmp2，解决好冲突，发送MR合并cart-share-tmp2到release

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123826.png)

2. 基于ft-cart-share分支拉临时分支cart-share-tmp，将release分支合并到cart-share-tmp，解决好冲突，发送MR合并cart-share-tmp到release

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123827.png)<br>这2种分支解决冲突没什么区别，都可以，推荐基于 release 拉临时分支

#### Master→业务分支（都是保护分支）

问题：`master` 合并到业务分支 `user` 冲突(`master` 为保护分支，`user` 也是保护分支，无权限)

解决 1：基于 `user` 拉临时分支 `tmp`，将 `master` 合并到 `tmp` 分支，解决好冲突，然后将 `tmp` 发送 MR 合并到 `user`

解决 2：基于 `master` 拉临时分支 `master-xxx`，将业务分支 `user` 合并到 `master-xxx`，解决好冲突，将 `master-xxx` 合并到 `user`

> 现在 master 合并到业务分支，会有临时分支 master-xxx，如果有冲突，只需要将业务分支合并到临时分支 master-xxx 提交即可；如果还出现编译失败，大概率是业务分支 user 用了旧 master 的 API，但新的 master 将该 API 修改了或删除了，导致编译不过，这种就需要在业务分支改成用 master最新的 api

# 其他

## git修改历史提交信息和提交时间

**下载git-redate**<br><https://github.com/PotatoLabs/git-redate><br>[点我下载git-redate](https://gitee.com/duyiluntan/git-redate)<br>**git修改提交时间步骤**

- 步骤1：选择要修改时间的revision

```
// 修改前2个
git redate -c 2

// 修改所有
git redate --all
```

- 步骤2：选择1，用vi编辑时间
- 步骤3：强推

```git
git push -f
```

**Ref**

- [x] [掘金：git历史提交信息和提交时间修改](https://juejin.cn/post/7099719745850572808)

## .gitignore模板

### 各种gitignore

<https://github.com/github/gitignore>

#### 在线生成gitignore

<https://www.gitignore.io/>

#### 简单的Android.gitignore模板

<https://github.com/github/gitignore/blob/master/Android.gitignore><br><https://github.com/lzyzsd/JsBridge/blob/master/.gitignore>

#### gitignore模板

##### [Android Studio 中 .gitignore 的编写](http://www.jianshu.com/p/caeacecb50cc)

##### 简单的.gitignore模板

```.gitignore
#built application files
*.apk
*.ap_# files for the dex VM
*.dex

# Java class files
*.class

# generated files
bin/
gen/
out/
build/

# Local configuration file (sdk path, etc)
/local.properties

# Windows thumbnail db
Thumbs.db

# OSX files
.DS_Store

# Eclipse project files
.classpath
.project
.settings

# Android Studio
*.iml
.idea

# Local IDEA workspace
.idea/workspace.xml

# Gradle cache
.gradle

#NDK
obj/

# git mergetool backup
*.orig
```

##### [gitignore.io在线生成模板：android/java/eclipse/idea/linux](https://www.gitignore.io/api/ndroid%2Cjava%2Ceclipse%2Cintellij%2Clinux)

```git
# Created by https://www.gitignore.io/api/ndroid,java,eclipse,intellij,linux

#!! ERROR: ndroid is undefined. Use list command to see defined gitignore types !!#

### Eclipse ###

.metadata
bin/
tmp/
*.tmp
*.bak
*.swp
*~.nib
local.properties
.settings/
.loadpath
.recommenders

# Eclipse Core
.project

# External tool builders
.externalToolBuilders/

# Locally stored "Eclipse launch configurations"
*.launch

# PyDev specific (Python IDE for Eclipse)
*.pydevproject

# CDT-specific (C/C++ Development Tooling)
.cproject

# JDT-specific (Eclipse Java Development Tools)
.classpath

# Java annotation processor (APT)
.factorypath

# PDT-specific (PHP Development Tools)
.buildpath

# sbteclipse plugin
.target

# Tern plugin
.tern-project

# TeXlipse plugin
.texlipse

# STS (Spring Tool Suite)
.springBeans

# Code Recommenders
.recommenders/


### Intellij ###
# Covers JetBrains IDEs: IntelliJ, RubyMine, PhpStorm, AppCode, PyCharm, CLion, Android Studio and Webstorm
# Reference: https://intellij-support.jetbrains.com/hc/en-us/articles/206544839

# User-specific stuff:
.idea/workspace.xml
.idea/tasks.xml
.idea/dictionaries
.idea/vcs.xml
.idea/jsLibraryMappings.xml

# Sensitive or high-churn files:
.idea/dataSources.ids
.idea/dataSources.xml
.idea/dataSources.local.xml
.idea/sqlDataSources.xml
.idea/dynamic.xml
.idea/uiDesigner.xml

# Gradle:
.idea/gradle.xml
.idea/libraries

# Mongo Explorer plugin:
.idea/mongoSettings.xml

## File-based project format:
*.iws

## Plugin-specific files:

# IntelliJ
/out/

# mpeltonen/sbt-idea plugin
.idea_modules/

# JIRA plugin
atlassian-ide-plugin.xml

# Crashlytics plugin (for Android Studio and IntelliJ)
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties

### Intellij Patch ###
*.iml


### Linux ###
*~

# temporary files which can be created if a process still has a handle open of a deleted file
.fuse_hidden*

# KDE directory preferences
.directory

# Linux trash folder which might appear on any partition or disk
.Trash-*


### Java ###
*.class

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files #
*.jar
*.war
*.ear

# virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml
hs_err_pid*
```

# Git指令图

## Git指令速查表图

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123828.png)

## 版本控制最佳实践图

## ![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290123829.png)

# Ref

- GitHub极速入门-程序员必备技能<br><http://www.jianshu.com/p/da9bc509b1d2>
