---
date created: 2024-09-14 00:13
date updated: 2024-12-27 23:48
dg-publish: true
---

# git-repos-tool

> 基于`GitPython`的多仓库Git命令行脚本，支持多仓库克隆代码、更新、分支切换、创建分支，删除分支，查看分支，查看分支状态，推送到远端等功能。支持多仓库的submodule更新、切换分支等功能

## Installation

1. 安装Python3
2. 下载GitPython

````shell

> 基于`GitPython`的多个Git命令行脚本，支持克隆代码、更新、分支切换、创建分支，删除分支，查看分支，查看分支状态，推送到远端等功能。支持submodule更新、切换分支等功能


## Installation
1. 安装Python3

2. 下载GitPython
```shell
$pip3 install gitpython
````

3. clone本项目<br />执行 `git-repos-tool.py -h` 查看使用说明

```
$ git-repos-tool.py -h
usage: Git多仓库批处理工具

多个仓库执行Git命令

positional arguments:
  {clone,pull,checkout,co,new,delete,query,push,status,delete,convert}
                        批量执行任务, clone, pull, checkout[co], new, delete, query, push, status, delete, convert

options:
  -h, --help            show this help message and exit
  -d, --debug           是否输出详细log
  -f FILTER_FILE, --filter_file FILTER_FILE
                        clone项目的目标文件/需要create的仓库，每个仓库一行；如果带了--shein，传settings.gradle路径，会自动解析出需要clone的仓库
  --shein               是否是clone shein项目，需要-f参数传settings.gradle路径
  -b [BRANCH], --branch [BRANCH]
                        指定target分支
  -p PATH, --path PATH  批处理目录，默认为当前目录
  -r REMOTE, --remote REMOTE
                        是否操作远端分支，默认为False
```

## Feature

### 查看帮助文档

```
python3 git-repos-tool.py -h
```

### clone 克隆代码

- clone<br />python3 git-repos-tool.py clone [-f clone.txt/--filter clone.txt] [-p path/--path path]

其中clone.txt 形如

```
git@github.com:hacket/AppInit.git
git@github.com:hacket/ActivityResultHelper.git
```

示例：

> python3 git-repos-tool.py clone -f ~/py/git-repos-tool/clone.txt -p ~~/hacket 从clone.txt将配置的仓库clone到~~/hacket路径<br />python3 git-repos-tool.py clone --filter ~/py/git-repos-tool/clone.txt 从clone.txt将配置的仓库clone到当前路径

- clone shein<br />python3 git-repos-tool.py clone --shein -f settings.gradle路径 [-p path]<br />如：

```shell
python3 git_repos_tool.py clone --shein -f settings.gradle路径 -p xxx/xxx/path
```

示例：

> gits clone -f /Users/10069683/WorkSpace/shein/shein_android/settings.gradle -p /Users/10069683/temp/ --shein

![git_clone_shein.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701781327233-e226b59f-9798-4018-8e5c-ea311fc84416.png#averageHue=%23c88c87&clientId=uc6de396d-4097-4&from=paste&height=429&id=u67730ac3&originHeight=1396&originWidth=1938&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1229612&status=done&style=none&taskId=u9ae937ff-a696-4453-9eb5-4c49d5dd098&title=&width=596)

### checkout 切换分支

将所有仓库切换到指定分支；没有指定分支名的仓库切换到master；checkout的过程，如果存在dirty，会先stash save，checkout成功后，会stash pop，如果有冲突会失败<br />python3 git-repos-tool.py checkout [-b branch/--branch branch]

```
python3 git-repos-tool.py checkout -b maseter
python3 git-repos-tool.py checkout --branch maseter
python3 git-repos-tool.py co -b maseter
```

![git_checkout.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701781345507-bbde4154-1b5b-41f6-aac7-2924789f2a57.png#averageHue=%23baa9a6&clientId=uc6de396d-4097-4&from=paste&height=634&id=ua2317503&originHeight=1860&originWidth=1772&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1408236&status=done&style=none&taskId=u17d3fe73-bc64-4d19-bfe1-5e8ff83209a&title=&width=604)

### pull 更新代码

会先切换到master分支，并pull branch的最新代码；未指定就pull当前分支；pull的过程，如果存在dirty，会先stash，然后再pull，最后stash pop<br />python3 git-repos-tool.py pull [-b branch/--branch branch]

```shell
# 基于当前分支pull
python3 git_repos_tool.py pull 
# 切换到dev分支并执行pull拉取最新代码
python3 git_repos_tool.py pull -b dev 
python3 git_repos_tool.py pull --branch dev
```

![git_pull.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701781364269-bff2a2d1-ee71-4a77-9ac7-06f245b18c58.png#averageHue=%23cbc7c4&clientId=uc6de396d-4097-4&from=paste&height=731&id=u2cdc7e34&originHeight=2012&originWidth=1742&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1540682&status=done&style=none&taskId=u09de176b-fd8d-4a5b-a83b-c8b5e9328e7&title=&width=633)

### query 查询当前分支

查询所有repo当前分支(区分local/remote)；红色表示只有本地分支，黄色的表示存在远端分支<br />python3 git-repos-tool.py query [-b branch/--branch branch]

```shell
python3 git_repos_tool.py query -b 9.9.0/user 查看当前仓库所在分支如果存在就标红9.9.0/user
python3 git_repos_tool.py query 查看当前仓库所在分支
```

![git_query.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701781392414-b5da3d02-f4fc-498e-993a-34c33298ecdc.png#averageHue=%23b7b4b2&clientId=uc6de396d-4097-4&from=paste&height=983&id=u33aa94b4&originHeight=1834&originWidth=1222&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1226564&status=done&style=none&taskId=uee06f8fd-9a22-42da-a0dd-5ca42e9da69&title=&width=655)![](./images/git_query.png#id=Sz5AB&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### push 推送到远端

push指定branch到remote，如果指定branch本地没有，那么该repo就不会push会跳过<br />python3 git-repos-tool.py push [-b branch/--branch branch]

```shell
# 将9.5.4/user-zfs分支push到remote
python3 git_repos_tool.py --branch 9.5.4/user-zfs
```

### status 查看所有仓库当前分支的status

python3 git-repos-tool.py status

```shell
python3 git_repos_tool.py status
```

### new 创建新分支

python3 git-repos-tool.py [-b branch/--branch branch] [-f create.txt/--filter create.txt]

```shell
# 从master创建新分支dev
python3 git_repos_tool.py new -b dev
# 从filter.txt中指定的
python3 git_repos_tool.py new -b 10.0.2/user-zfs-test -f ~/py/git-repos-tool/create.txt
```

创建新分支，也可以提供create.txt文件，只对create.txt文件中匹配的项目名创建新的分支

```
python3 repos-tool.py new 10.0.2/user-zfs-test -f create.txt
```

create.txt如下：

```
lib1
lib2
```

### 删除分支

python3 git-repos-tool.py delete [-b branch/--branch branch]

```shell
# 删除所有仓库的dev分支（local和remote）
python3 git_repos_tool.py delete dev
```

注意：

- 如果仓库是dirty的，会抛出异常
- TODO: dirty删除时要二次确认

### 多仓库submodule支持

#### submodule pull 更新代码(会更改跟踪的commitId)

python3 git_submodule.py pull --repo repo_path --branch branch_name --debug

- --repo 带submodule的工程 必选
- --branch 要pull的branch 必选
- --debug 是否输出详细的log

案例，所有submodule切换到master，并拉取最新代码

```shell
python3 git_submodule.py pull --repo /Users/10069683/WorkSpace/shein/romwe_flutter_module --branch master --debug
```

#### submodule checkout 切换分支

python3 git_submodule.py checkout --repo repo_path --branch branch_name --debug

- --repo 带submodule的工程 必选
- --branch 要pull的branch 必选
- --debug 是否输出详细的log

案例：所有submodule切换到master

```shell
python3 git_submodule.py checkout --repo /Users/10069683/WorkSpace/shein/romwe_flutter_module --branch master --debug
```

### TODO: push支持，其他支持

## TODO

1. rename 分支重命名
2. convert 将https的git仓库转换为ssh;互相转换

## 简化操作

封装成shell function，配置到`~/.zshrc`(用的zsh shell)或者`~/.bashrc`

```shell
WORKSPACE_MAIN=~/Workspace/xxx # 
GITS=/Users/xxx/py/git-repos-tool/git_repos_tool.py # git多仓库拉取的py脚本
GITS_SUBMODULE=/Users/xxx/py/git-repos-tool/git_submodule.py # git submodule多仓库拉取的py脚本

## gits 批量处理git仓库
alias py='python3' # 默认使用Python3
alias gits="python3 $GITS"

#### 将~/py/git-batch/clone.txt目录下的repo全部clone下到当前位置，clone.txt替换成自己的目录
function gits:clone() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS clone -c ~/py/git-batch/clone.txt -p $WORKSPACE_MAIN
}

#### 主工程 gits:checkout master 所有分支切换到master
function gits:co() { 
  gits:checkout $1
}
function gits:checkout() { 
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS checkout --branch $1
}
#### 主工程 gits:pull master 所有分支先切换到master，然后pull，不传递参数pull当前分支
function gits:pull() { 
  cd $WORKSPACE_MAIN
  pwd
  echo "[$GITS] $0 $1 $2"
  branch=$1
  python3 $GITS pull --branch $branch $2
}
#### 主工程 push指定分支，如果指定分支本地没有，就不会push python3 git-batch.py branch 9.5.4/user-zfs
function gits:push() {
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS push --branch $1
}
#### 查看主工程 所有仓库当前分支名
function gits:query() {
  cd $WORKSPACE_MAIN
  pwd
  echo $0 $1
  python3 $GITS query --branch $1
}
function gits:status() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS status
}
function gits:del() {
  gits:delete $1
}
function gits:delete() {
  cd $WORKSPACE_MAIN
  pwd
  python3 $GITS delete --branch $1
}
```
