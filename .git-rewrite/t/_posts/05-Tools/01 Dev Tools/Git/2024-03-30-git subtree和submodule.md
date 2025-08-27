---
date created: 2024-03-30 00:09
date updated: 2024-12-27 23:54
dg-publish: true
---

# git subtree和submodule

## git subtree

git subtree主要命令：

```git
git subtree add --prefix=<prefix> <commit>
git subtree add --prefix=<prefix> <repository> <ref>
git subtree pull --prefix=<prefix> <repository> <ref>
git subtree push --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
```

### 1、添加subtree

```git
git subtree add --prefix=sub/AndroidDemos git@gitee.com:hacketzeng/Android_Tools.git master --squash
// --squash参数表示不拉取历史信息，而只生成一条commit信息。
```

执行git status可以看到提示新增两条commit<br>git push到远端，其他开发人员git clone，会完整拉取代码

### 2、子工程更新

```git
git subtree pull --prefix=sub/AndroidDemos git@gitee.com:hacketzeng/Android_Tools.git master --squash
```

### 3、修改了子工程，如何push到远端

```git
git subtree push
```

## git submodule

git submodule允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。

### 添加子模块 add

**语法：**

```git
git submodule add <git仓库地址> [<本地工程路径名>]
```

- git仓库地址为子模块的路径，
- 本地工程路径名为该子模块存储的目录路径，可以不写，默认从git仓库读取目录名

例如，将AndroidDemos工程添加到当前工程下。

```git
git submodule add https://github.com/hacket/AppInit hacket/appinit
# 或者，添加以AppInit命名的目录路径
git submodule add https://github.com/hacket/AppInit
```

添加成功后，工程会增加`.gitmodules`文件，该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射，这个需要提交到主工程版本管理：

```git
[submodule "hacket/appinit"]
	path = hacket/appinit
	url = https://github.com/hacket/AppInit
```

- `.gitmodules文件`是git仓库用来管理所有跟踪的submodule的基本信息，主要是跟踪`仓库地址`和本`地存放路径`的一个映射（当然可以配置其他信息）
- `.gitmodules`文件是归本仓库进行版本控制的
- 对于submodule管理的模块，会将.gitmodules映射的本地存储路径进行忽略，将其最新的commitid作为文件内容在主仓库中进行跟踪管理

### 克隆子模块：clone一个包含submodule的repo

#### 主工程未clone的情况，--recurse-submodules

如果要 clone 一个项目，并且包含其子模块的文件，则需要给 `git clone` 命令最后加上 `--recurse-submodules` 或者 `--recursive` 参数（否则只会下载一个空的子模块文件）：

```git
git clone --recurse-submodules https://github.com/grpc/grpc
# 其中--recurse-submodules选项，它会自动初始化并更新仓库中的每一个子模块， 包括可能存在的嵌套子模块。
```

#### clone时未带submodule相关参数

克隆一个包含submodule的仓库目录，未带submodule相关参数，并不会clone下子仓库的文件，只是会克隆下.gitmodule描述文件，需要进一步克隆子仓库文件。

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

此时子目录在一个未命名分支61f6637，此时子仓库有改动并没有检测到。

```git
* (HEAD detached at 61f6637)
master
remotes/origin/HEAD -> origin/master
remotes/origin/dev
remotes/origin/master
```

> 其中--recursive选项和git clone时候的--recurse-submodules的含义是一样的；

#### 修改拉取的submodule仓库默认分支

命令默认拉取主分支（master），想要修改这个默认拉取分支可以修改 .gitmodules 文件中子模块对应的 branch 值，或者执行：

```shell
git config submodule.xxx.branch dev
```

或者执行同时将配置写入文件，这样其他人拉取父项目也会获取该配置：

```shell
git config -f .gitmodules submodule.xxx.branch dev
```

### 更新子模块 update

默认情况下，在主仓库的根目录下，执行`git pull`命令并不会主动更新submodule最新的commit

#### submodule update概述

submodule的更新一般有两个层面的更新，分别是：

1. 拉取submodule子项目最新的提交，如果子项目对应的分支上有更新，那么会拉取下来，并且修改主项目跟踪的改子项目的commitId；这种情况一般是：<font color="#c00000">明确需要跟踪子项目的特定提交，使用其新特性；</font>

```shell
git submodule update --remote
```

2. 拉取项目中跟踪的submodule的commitId对应的数据到本地；这种情况一般都是项目的开发者拉取submodule是否有跟踪的变化，更新一下对应的数据；如果submodule的子项目有最新的，只会拉取项目跟踪的commitId，<font color="#c00000">不一定是最新的</font>

```shell
git submodule update
```

`git submodule update --remote` 命令结果：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692877582299-a9dad8db-9f8c-47fc-8548-ad169fa2d6bc.png#averageHue=%23333333&clientId=uab4d43e1-b9f7-4&from=paste&height=334&id=u7c16278f&originHeight=1320&originWidth=1926&originalType=binary&ratio=2&rotation=0&showTitle=false&size=341104&status=done&style=stroke&taskId=uc2b51cd2-b0f9-4ae6-b21b-fcbd16eaa47&title=&width=488)

#### submodule update策略

submodule update --rebase后submodule项目的状态变成了detached：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692879164608-78e71100-65ad-4a31-b918-dbd710d3d589.png#averageHue=%2382912c&clientId=u81bed025-7fdb-4&from=paste&height=43&id=u2d095ed8&originHeight=86&originWidth=1642&originalType=binary&ratio=2&rotation=0&showTitle=false&size=147845&status=done&style=stroke&taskId=ud3f268aa-75e3-43e3-b050-2c82d11e93a&title=&width=821)<br>命令git submodule update更新子项目的策略有三种：

- checkout方式：子项目checkout到detached的分支，然后在detached分支上更新远端的提交；默认选项；

```shell
git submodule update --remote
```

- rebase方式：将子项目本地分支上的提交在远端最新的提交上进行rebase；

```shell
git submodule update --remote --rebase
```

- merge方式：将子项目远端分支的提交本merge到子项目本地分支上；

```shell
git submodule update --remote --merge
```

两种方式设置更新策略：

- update命令执行时设置：`git submodule update --remote --rebase`
- 修改.gitmodules文件，默认采用某种策略更新`git config -f .gitmodules submodule.submodules/draw_io.update rebase`，然后将变动的.gitmodules文件提交到主项目中

> git config -f .gitmodules .modules/si_basic_flutter.update rebase

#### 向上同步主仓库

如果你是子模块的开发者，当你希望主仓库使用新版本的子模块时，需要向上同步主仓库。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692969992082-769b5b27-b72f-4ab1-bfb0-4a0ea6e5cece.png#averageHue=%23382e2b&clientId=u0a712167-0c2d-4&from=paste&height=180&id=udce8b23c&originHeight=360&originWidth=1286&originalType=binary&ratio=2&rotation=0&showTitle=false&size=90924&status=done&style=stroke&taskId=u5ee03b82-ad6c-4173-a9a2-bd6f7eea92f&title=&width=643)<br>在主仓库中，可以使用 git submodule status 和 git status 查看子模块的状态：显示为+号表示主仓库和子仓库未同步：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692970046252-8963181b-d417-4f6a-aad9-4200596ec0da.png#averageHue=%23a3852c&clientId=u0a712167-0c2d-4&from=paste&height=29&id=uab2965b8&originHeight=58&originWidth=1270&originalType=binary&ratio=2&rotation=0&showTitle=false&size=94968&status=done&style=stroke&taskId=u04b9c043-2667-407f-9397-3add42b29f6&title=&width=635)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692970084705-2573aa1c-edd8-44e0-ba31-ea734bb70edf.png#averageHue=%23383433&clientId=u0a712167-0c2d-4&from=paste&height=394&id=uc0931082&originHeight=788&originWidth=2476&originalType=binary&ratio=2&rotation=0&showTitle=false&size=214893&status=done&style=stroke&taskId=u0a1809ff-3615-44e9-9564-e02a3eeb7f3&title=&width=1238)<br>如果想要将子模块的内容同步到主仓库，只需要在主仓库中创建一个新的提交即可

#### submodule uodate相关命令

##### 只拉取主工程跟踪的子模块的commitId对应的代码，子模块有最新的提交不更新

- git submodule update 只会拉取最新的主工程对应子模块的代码，不会更新到主工程跟踪的commitId
- git submodule update --init --recursive  更新到主工程子模块最新的commitId，如果子模块有更新的commit，但主工程未更新跟踪的commitId，这条命令不会更新跟踪的子模块到最新的commitId
- git pull origin master --recurse-submodules 拉取所有子仓库 (fetch) 并 merge 到所跟踪的分支上，跟踪到主工程REMOTE最新的commit

##### 拉取子模块最新的代码，并更新主工程跟踪的commitId

- 进入到子模块中，git pull拉取，会拉取子模块最新更新，修改主工程跟踪的commitId
- **git submodule update --remote **拉取子模块最新的commit，会更新主工程对应的子模块跟踪的的commitId；用这个可以获取到子模块最新的commit和修改主工程跟踪的commitId

### 跟踪submodule特定分支

想换 submodule 的分支或 tag，进入到 submodule 目录，然后 git checkout xxx 指定分支即可<br>GIt Fork 直接点开对应的 submodule 操作即可。<br>![image.png|700](https://cdn.nlark.com/yuque/0/2023/png/694278/1692966952871-596975ca-3a29-4380-ab5f-6b9b1f4fc681.png#averageHue=%2339312f&clientId=u0a712167-0c2d-4&from=paste&height=372&id=u17185f5a&originHeight=744&originWidth=486&originalType=binary&ratio=2&rotation=0&showTitle=false&size=67064&status=done&style=stroke&taskId=u3344245f-09db-4fc9-913e-876118adcce&title=&width=243)

### 查看子模块状态

> git submodule
> 或
> git submodule status

- 结果的 hash 前不带符号说明该 module 正常且提交版本同步（提交版本同步指主项目记录提交版本与子模块当前提交版本一致）
- 结果的 hash 前带 - 号说明该 module 未初始化
- 结果的 hash 前带 + 号说明该 module 版本未同步

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692968403860-072fc7fa-08e3-451f-8f6e-e9b7c7629c88.png#averageHue=%2399812a&clientId=u0a712167-0c2d-4&from=paste&height=30&id=ud621e67e&originHeight=60&originWidth=1242&originalType=binary&ratio=2&rotation=0&showTitle=false&size=94633&status=done&style=stroke&taskId=ub4b42fd6-6866-4b96-a4df-168b4b5fc91&title=&width=621)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692968430855-a825e21c-93f7-478e-8cc6-5f62cc064465.png#averageHue=%23362e2c&clientId=u0a712167-0c2d-4&from=paste&height=223&id=u549aa928&originHeight=446&originWidth=1256&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127590&status=done&style=stroke&taskId=u2d265eb2-d1ef-4709-954c-d3d11d29642&title=&width=628)

### push带修改的submodule的主工程

#### 存在的一个问题：主工程跟踪的commit修改提交了，但子模块修改未提交

如果A修改了子模块的内容并提交了记录，**父项目也提交并推送了远程仓库（更新了跟踪的commitId），但是子模块没有推送其对应的远程仓库**， A运行起来没有什么问题，那么B拉取父项目代码变更时没有问题，但是更新子模块时就会遇到下面的问题：

> fatal: remote error: upload-pack: not our ref 16d1b6b94e3245f3a7fb4f43e5b6f44b14027fbb
> Fetched in submodule path 'xxx', but it did not contain 16d1b6b94e3245f3a7fb4f43e5b6f44b14027fbb.
> Direct fetching of that commit failed.

**原因：**即由于其他人没有及时将子模块的提交 push 的子模块的远程仓库，我们本地父项目有了关于子模块最新的变更，但是在子模块的仓库中却找不到，就报错了<br>**解决：**让对方在子模块下 push 一下这边再重新更新就行了；

#### 主工程和子模块同时推送

目标：修改了submoudle的内容，在推送主项目的时候，也希望推送跟踪的子submodule项目

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

- git配置

```git
git config --global push.recurseSubmodules=on-demand
```

> 与--on-demand含义一样；不过这里为什么不使用`git config --global submodule.recurse true`的设置呢？submodule.recurse的配置不仅不对clone生效，在push的时候也不生效

#### 游离的HEAD（git submodule head detached）

在使用git submodule 的时候，常常会遇到 执行完以下操作后发现 子仓库的head 指针处于游离状态<br>在主工程修改子模块的代码后提交，出现这个弹窗提示<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701658442480-b5f4012c-f9f9-41d4-ae5c-7d341814a877.png#averageHue=%23404346&clientId=u7042df73-bd85-4&from=paste&height=257&id=ud46e1dcd&originHeight=596&originWidth=880&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89874&status=done&style=stroke&taskId=u1c828117-b7a4-41d8-8590-168e007c3b4&title=&width=379)<br>解决：

1. 首先删除已有的submodule
2. 重新建立submodule，加入时使用-b参数，使得母项目追踪子项目的指定branch（否则默认不追踪）：

```powershell
git submodule add -b <branch> <repository> [<submodule-path>]
# 如
git submodule add -b master git@github.com:hacket/DebugTools.git submodules/debugtools
```

3. 更新

```shell
git submodule update --remote
```

简单的一行命令递归修复所有子项目的detached head（其中默认都追踪子项目的master branch）：

```shell
git submodule foreach -q --recursive 'git checkout $(git config -f $toplevel/.gitmodules submodule.$name.branch || echo master)'
```

### 修改子模块

如果在本地修改submodule工程，在主仓库 git status会显示submodule仓库有修改。但是在主工程进行git push没用，现在需要进去子仓库进行提交

```git
$ git add .
$ git commit -m "commit"
$ git push origin HEAD:master
```

### 删除子模块

`git submodule deinit -f 子模块名`删除了子模块，则再次查看时输出会是这样的，删除的子模块前面加了个`-`：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699670383590-dcc37242-3e2d-488d-9fec-13d74984a978.png#averageHue=%23353433&clientId=ua3dfea6f-22ae-4&from=paste&height=158&id=u394ecd2b&originHeight=316&originWidth=1664&originalType=binary&ratio=2&rotation=0&showTitle=false&size=97691&status=done&style=stroke&taskId=u91fd7d50-1cf9-43ea-b527-e903232d7cd&title=&width=832)

- `rm -rf 子模块目录` 删除子模块目录及源码
- `vi .gitmodules` 删除项目目录下.gitmodules文件中子模块相关条目
- `vi .git/config` 删除配置项中子模块相关条目
- `rm .git/modules/*` 删除模块下的子模块目录，每个子模块对应一个目录，注意只删除对应的子模块目录即可

```git
git submodule deinit -f AndroidDemos
git rm --cached AndroidDemos
# git rm --cached <本地路径>
rm -rf AndroidDemos
```

如果是带了目录的，需要加上目录<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701658577768-123c157a-6ebf-4cd3-b67d-c70ba7a2d0a0.png#averageHue=%23353533&clientId=u7042df73-bd85-4&from=paste&height=73&id=u4d35ea04&originHeight=146&originWidth=1828&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48250&status=done&style=stroke&taskId=u5fc51ecc-3af5-4b41-ab23-24303b86ec6&title=&width=914)

### 批量修改子模块 foreach

git submodule foreach [git 操作]

- 批量stash

```shell
git submodule foreach 'git stash'
```

- 每个子模块中新建切换分支

```shell
git submodule foreach 'git checkout -b new'
```

### submodule主要问题

#### 主工程一个分支有submodule，一个分支没有submodule，分支切换问题

父项目从含有子模块的分支切换到没有子模块的分支时，默认会保留子模块对应的目录，所以这使得切换过去时本地会保留关于子模块的修改记录，显然这不太合理，所以从包含子模块的分支切换到 xxx 时，需要这样执行：

```shell
git checkout xxx --recurse-submodules
```

#### submodule的url被修改了

如果父项目中子模块的仓库地址（submodule.xxx.url）被其他协作者修改了，那么我们再更新子模块时就可能遇到问题，需要执行：

```shell
git submodule sync --recursive
```

同步完 url，然后再重新初始化更新：

```shell
git submodule update --int --recursive
```

#### 忽略submodule中的修改或新增文件

在`.gitmodules`添加ignore字段，ignore意义：

```git
untracked ：忽略 在子模块B(子模块目录)新添加的，未受版本控制内容
dirty ： 忽略对子模块目录下受版本控制的内容进行了修改
all ： 同时忽略untracked和dirty
```

添加了ignore后，子模块的修改，在主工程用git status就看不到了

#### detached head does not point any branch

在项目哪个拉去

#### submodule冲突

1. 将子仓库的冲突解决后，push
2. 然后同步主仓库的commit，主仓库对子仓库的引用可能也会导致冲突，将主仓库对准最新的子仓库的的最新commit即可

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692971233009-4ea7d14f-b7cd-4477-a9c0-b7ea3fe7ebb1.png#averageHue=%23f9f8f8&clientId=u0a712167-0c2d-4&from=paste&height=163&id=ua7445c64&originHeight=508&originWidth=1998&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96737&status=done&style=stroke&taskId=u2fca5f65-ef08-4448-a9c5-5045c8f1097&title=&width=641)
