---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 2:06:13 pm
title: Git多平台ssh key
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
date created: 2024-09-10 01:11
date updated: 2024-12-30 00:16
aliases: [Git 多平台 ssh key]
linter-yaml-title-alias: Git 多平台 ssh key
---

# Git 多平台 ssh key

## SSH 基础

### 密码口令登录

1. 客户端连接上服务器之后，服务器把自己的公钥传给客户端
2. 客户端输入服务器密码通过公钥加密之后传给服务器
3. 服务器根据自己的私钥解密登录密码，如果正确那么就让客户端登录

### 公钥登录

公钥登录是为了解决每次登录服务器都要输入密码的问题，流行使用 RSA 加密方案，主要流程包含：

1. 客户端生成 RSA 公钥和私钥
2. 客户端将自己的公钥存放到服务器
3. 客户端请求连接服务器，服务器将一个随机字符串发送给客户端
4. 客户端根据自己的私钥加密这个随机字符串之后再发送给服务器
5. 服务器接受到加密后的字符串之后用公钥解密，如果正确就让客户端登录，否则拒绝。这样就不用使用密码了

### 仓库 Deploy keys 和账户 SSH Keys 的区别

1. Github 账户中的 SSH keys，相当于这个账号的最高级 key，只要是这个账号有的权限（任何项目），都能进行操作
2. 仓库的 Deploy keys，就是这个仓库专有的 key，用这个 key，只能操作这个项目，其他项目没有权限。

### Git 的.ssh 文件夹内容介绍

#### id_rsa 与 id_rsa.pub

公钥和私钥文件，id_rsa.pub 是公钥，配置到各个 Git 平台的 SSH keys 中。<br>`id_rsa` 可以称之为私有密钥，`id_rsa.pub` 可以称之为公有密钥。我们会把公有密钥交给服务端，当需要从服务端请求内容的时候，要带上私有密钥。此时，服务器会通过一定的算法计算私有密钥，并判断计算的结果是否与公有密钥一样，如果不一样则响应请求失败。

#### config 文件

config 文件主要在配置多个 git 账户时使用的，里面主要配置了访问不同的主机 (Host) 时采用不同的密钥。<br>文件内容例如：

```
Host git.moumentei.com
   User git
   Hostname git.moumentei.com
   IdentityFile ~/.ssh/id_ed25519

Host github.com
   User git
   Hostname github.com
   IdentityFile ~/.ssh/id_rsa
  
Host gitee.com
   User git
   Hostname gitee.com
   IdentityFile ~/.ssh/id_ed25519_gitee
```

#### known_hosts 文件

当我们成功与服务端进行连接时，ssh 会记录服务端的 Host、IP 以及 rsa 文件

```
gitee.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEKxHSJ7084RmkJ4YdEi5tngynE8aZe2uExxx
git.moumentei.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILQaptBrxxxxH+QM6SrUi9qVzXBdNdXX7roBcgithub.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVxxxoqKLsabgH5C9okWi0dh2l9GKJl
github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2xxxbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==
github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTxxxNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
github.com ssh-ed25519 AAAAC3NzaC1lZDxxxMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
git.moumentei.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILQaptBrtxxxQM6SrUi9qVzXBdNdXX7roBc
```

## 快速配置 SSH keys

1. 安装 git 程序
2. 在 Git Bash 生成 RSA 或 Ed25519 密钥对

```powershell
# 生成ed25519密钥对
ssh-keygen -t ed25519 -C "shengfanzeng@gmail.com"

# 生成RSA秘钥对
# 注：如果您使用的是不支持 Ed25519 算法的旧系统，请使用以下命令：
ssh-keygen -t rsa -b 4096 -C "shengfanzeng@gmail.com"

# 如果需要变更生成的名字，在第一步骤输入对应的名字即可如:id_ed25519_syscore
```

3. 多个平台配置 config，改对应的 IdentityFile 路径即可

```git
Host gxatek.com
   User git
   Hostname gxatek.com
   IdentityFile ~/.ssh/id_ed25519_syncore
Host git.moumentei.com
   User git
   Hostname git.moumentei.com
   IdentityFile ~/.ssh/id_ed25519

Host github.com
   User git
   Hostname github.com
   IdentityFile ~/.ssh/id_rsa
  
Host gitee.com
   User git
   Hostname gitee.com
   IdentityFile ~/.ssh/id_ed25519_gitee
```

4. 测试

```
ssh -T github.com
ssh -T git@gitlab.com
ssh -T gitee.com
```

## Github 添加 Deploy key 和 SSH key

### 配置 `user.name` 和 `user.email`

```
git config --global user.name "gitHub上注册的用户名" 
git config --global user.email “gitHub上注册时用的邮箱”
```

> 配置完成后，可以使用 git config --global --list 命令查看是否配置成功。

### 生成新 SSH 密钥 (RSA 和 Ed25519)

1. Ed25519

```shell
ssh-keygen -t ed25519 -C "shengfanzeng@gmail.com"
```

2. RSA

```git
# 注：如果您使用的是不支持 Ed25519 算法的旧系统，请使用以下命令：
ssh-keygen -t rsa -b 4096 -C "shengfanzeng@gmail.com"
```

会出现以下内容，直接敲 3 次回车：

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/c/Users/hacket/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /c/Users/hacket/.ssh/id_ed25519
Your public key has been saved in /c/Users/hacket/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:eYis1ywBJIyfpKqJoEf498jrypsGhzWJ+J/KkS0mhoQ shengfanzeng@gmail.com
The key's randomart image is:
+--[ED25519 256]--+
| o. .            |
|. oo             |
|.= o.            |
|= *  o . o       |
|E* .  + S .      |
|O +o . + .       |
|BB=.o.o o        |
|*=+=+o .         |
| oB*=o.          |
+----[SHA256]-----+
```

> 默认生成在~./.ssh/目录，文件 id_ed25519 和 id_ed25519.pub

### 将 SSH 密钥添加到 ssh-agent（如果需要）

确保 ssh-agent 是可用的。ssh-agent 是一种控制用来保存公钥身份验证所使用的私钥的程序，其实 ssh-agent 就是一个密钥管理器，运行 ssh-agent 以后，使用 ssh-add 将私钥交给 ssh-agent 保管，其他程序需要身份验证的时候可以将验证申请交给 ssh-agent 来完成整个认证过程。

```
eval "$(ssh-agent -s)"
```

中间可能需要：

```
ssh-agent bash
```

将私钥交给 ssh-agent 管理：

```shell
ssh-add ~/.ssh/id_ed25519
```

### 将 SSH 公钥复制到剪贴板

```shell
clip < ~/.ssh/id_ed25519.pub
```

### 将公钥添加到 GitHub 管理平台

Mac 下打开终端，输入 open ~/.ssh，进入.ssh 文件夹<br>查看 `id_rsa.pub`（公钥）这个文件，打开复制里面的内容

#### 添加仓库的 Deploy keys

1. 找到一个 Repository 的 Settings
2. 找到 Deploy keys，添加一个 deploy key
3. title 随便写，用来标识 key 的来源，然后把刚才复制的内容 (公钥) 直接粘贴到 key 里面，不要敲任何其他的按钮，点选 Allow write access。然后点击 add key。创建完成 SSH 的 Key 了。<br>![8mucf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/8mucf.png)

#### 添加账户的 SSH Keys

1. 页面右上角头像点击 Settings，进入账户设置中心
2. 选择左侧的 SSH and GPG keys，点击 New SSH key 添加 key
3. 其他操作同添加 Deploy keys

### 测试

测试<br>`ssh -T git@xxx`(其中 xxx 为主机名)<br>在 `Are you sure you want to continue connecting (yes/no/[fingerprint])?` 选择的时候选 yes 不能按 enter，不然会测试不通过。

```
$ ssh -T git@git.gxatek.com
The authenticity of host 'git.gxatek.com (10.103.106.14)' can't be established.
ED25519 key fingerprint is SHA256:RCkEUtOACSLGzMYEcxxxmoYi47iMYAek.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'git.gxatek.com' (ED25519) to the list of known hosts.
Welcome to GitLab, @fszeng!
```

#### Github 测试

```shell
ssh -T github.com
```

![28vyx](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/28vyx.png)

#### Gitlab 测试

```shell
ssh -T git@gitlab.com
# 公司的Gitlab
ssh -T git@git.moumentei.com
```

#### Gitee 测试

```shell
ssh -T gitee.com
```

#### Coding.net(前身 gitcafe)

```
 ssh -T git@git.coding.net
```

![hgvhh](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/hgvhh.png)

## 快速生成多个平台 SSH Key，且让他们之间能共存

1. 生成 ssh key 到指定位置，并支持重命名

```shell
# 生成到默认位置默认名字
ssh-keygen -t ed25519 -C "fszeng@syscore.space"
# 指定位置指定名字
ssh-keygen -t ed25519 -C "fszeng@syscore.space" -f ~/.ssh/id_ed25519_github
```

2. 在 `~/.ssh/config` 文件添加内容，没有 config 新建 config 文件

```
Host gxatek.com
   User git
   Hostname gxatek.com
   IdentityFile ~/.ssh/id_ed25519
Host git.moumentei.com
   User git
   Hostname git.moumentei.com
   IdentityFile ~/.ssh/id_ed25519

Host github.com
   User git
   Hostname github.com
   IdentityFile ~/.ssh/id_rsa
  
Host gitee.com
   User git
   Hostname gitee.com
   IdentityFile ~/.ssh/id_ed25519_gitee
```

3. 测试，第一天连接可能需要添加到 known_hosts，需要输入 yes，否则测试不成功

```
ssh -T git@git.moumentei.com
ssh -T gitgxatek.com
ssh -T github.com
ssh -T gitee.com
```

## GPG

1. 下载 Windows64 位<br><https://gpg4win.org/download.html>
2. 命令行下创建 GPG 密钥，填写用户名、邮箱和密码

```
gpg --full-generate-key
```

![cfc77](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/cfc77.png)

3. 牢记这个密码，后续还用得到

```
pub   rsa3072 2022-11-15 [SC]
      71605C636B524EB7A8A98648B0D7165B00581DF6
uid                      hacket (good gpg) <shengfanzeng@gmail.com>
sub   rsa3072 2022-11-15 [E]
```

4. 把这个 key 上传到 GPG 服务器 (命令中最后的 00581DF6 这个字符串替换成你刚刚申请的密码的后 8 位)

```
gpg --keyserver hkp://keyserver.ubuntu.com --send-keys 00581DF6
```

![ec608](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ec608.png)

5. 查询命令查询一下，只有能查询到的 key 才能是认为上传成功的。

```
gpg --keyserver hkp://keyserver.ubuntu.com --search-keys 00581DF6
```

![eupvf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/eupvf.png)

6. 导出这个私钥以便在上传时使用 -o 后面指定输出文件的路径

```
gpg -o c:/Users/hacket/desktop/secret.gpg --export-secret-keys 00581DF6
```

7. 可以将这个 `secret.gpg` 文件放在工程中，注意在上传时记得忽略<br>具体见附件 `secrte.gpg`

[secret.gpg.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1684080327279-c486b307-cbcf-42b6-8308-600d2bf28148.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1684080327279-c486b307-cbcf-42b6-8308-600d2bf28148.zip%22%2C%22name%22%3A%22secret.gpg.zip%22%2C%22size%22%3A4381%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uf671eb2d-c18f-4664-8a58-43cc4b8db66%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22rnlB1%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## Github secret.gpg

[secret.gpg.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1684080327279-c486b307-cbcf-42b6-8308-600d2bf28148.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1684080327279-c486b307-cbcf-42b6-8308-600d2bf28148.zip%22%2C%22name%22%3A%22secret.gpg.zip%22%2C%22size%22%3A4381%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uf671eb2d-c18f-4664-8a58-43cc4b8db66%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u283abea1%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## Ref

- [x] [Github deploy-keys](https://docs.github.com/en/developers/overview/managing-deploy-keys#deploy-keys)
