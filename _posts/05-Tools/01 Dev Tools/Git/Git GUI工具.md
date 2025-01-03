---
date created: 2024-12-27 23:54
date updated: 2024-12-28 00:08
dg-publish: true
---

# lazygit

<https://github.com/jesseduffield/lazygit>

# [Git Fork](https://git-fork.com/)

比SourceTree简洁，快速

## 基本使用

### 配置Merge tool/External Diff Tool

配置路径：`File→Preferences`

- 可配置Beyond Compare 4（收费）
- 可配置VS Code（免费）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685896198146-c7d29d17-acda-45ef-87cb-76cf448c58e3.png#averageHue=%23eeeeee&clientId=u191f63e1-eff8-4&from=paste&height=400&id=u13935d85&originHeight=854&originWidth=894&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=62732&status=done&style=none&taskId=u93b41a3d-3e6e-4b32-b55f-7e8c8edfce5&title=&width=419)

### Git fork解决冲突

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685935740451-35469c12-cae4-4b78-9fa9-b0475f71960e.png#averageHue=%23fbfafa&clientId=ue5f78299-9e82-4&from=paste&height=780&id=ub077a8da&originHeight=1560&originWidth=2490&originalType=binary&ratio=2&rotation=0&showTitle=false&size=308050&status=done&style=none&taskId=u16663b06-bc33-4f58-b4f6-cff84c6d106&title=&width=1245)

#### git fork自带merge tools解决冲突

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685936045682-7cffea08-eade-4f42-a929-f83040ca0953.png#averageHue=%23bebebe&clientId=ue5f78299-9e82-4&from=paste&height=401&id=u872fe3b5&originHeight=1780&originWidth=2276&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1011474&status=done&style=stroke&taskId=u9cee54fa-1c8b-4603-a590-3069db8bd16&title=&width=513)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685936145800-cf4b547c-9b0b-4079-8182-10e023b19a29.png#averageHue=%23f8f7f6&clientId=ue5f78299-9e82-4&from=paste&height=372&id=ub01b98c1&originHeight=1556&originWidth=2052&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1066907&status=done&style=none&taskId=u64cdb24c-a7bb-445b-8461-3eb02ae6da8&title=&width=490)

- Select Left 应用左边的更改
- Select Right 应用右边的修改，如果Left已经更改，不会覆盖，会叠加

## 疑问

### 配置了 `--recurse-submodules` git pull 按钮报错

执行命令查看--recurse-submodules 是否配置了，true 表示配置了：

> Git config --show-origin submodule. Recurse.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694154222538-a7ec1fcb-2c95-4851-aafb-241e11467358.png#averageHue=%23767f26&clientId=u18ffbf96-b590-4&from=paste&height=29&id=ucec5e397&originHeight=58&originWidth=1016&originalType=binary&ratio=2&rotation=0&showTitle=false&size=77538&status=done&style=none&taskId=uf4421a57-a603-4c27-b6c9-53014f108aa&title=&width=508)<br>配置成 true 后，fork 每次手动 git pull 都报错<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694153513559-9a67fc67-7791-4a9e-84a8-b968c6010ee2.png#averageHue=%23f7f6f6&clientId=u5c26a2ab-3571-4&from=paste&height=355&id=u1414040a&originHeight=1220&originWidth=1700&originalType=binary&ratio=2&rotation=0&showTitle=false&size=271065&status=done&style=none&taskId=u4c644232-4752-435d-8ddd-37dc13ba6cc&title=&width=494)<br>解决：去掉--recurse-submodules=true 配置，fork 的 git pull 命令不会自动加上该配置，fork 在 pull/checkout 会自动更新 submodules

> Git config --global submodule. Recurse false

- [ ] [Pulling with stash+rebase always throws submodule command error ](https://github.com/fork-dev/Tracker/issues/1787#issuecomment-1400095375)

# VS Code 解决 Git 冲突

### vscode 解决 git pull --rebase 出现的冲突

rebase变基后，本地的变成了remote了，远端的变成了local，所以：

- Remote代表的是本地你自己的修改
- Local代表的是远端
- Result代表的是合并后的结果

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685896712549-a126f3c7-56f5-4d0b-8c91-9b7224b218f9.png#averageHue=%23242221&clientId=u191f63e1-eff8-4&from=paste&height=1019&id=uabe122f8&originHeight=1529&originWidth=2560&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=516321&status=done&style=none&taskId=ud0b7371c-527c-4123-9423-70349be7548&title=&width=1706.6666666666667)<br>冲突后如何选择？

- 右上角的↑↓箭头可以切换冲突
- Accept Remote 选择remote的修改
- Accept Local 选择local的修改
- Accept Combination Remote First 先选择Remote再选择Local
- Accept Combination Local First 先选择Local再选择Remote
- Copy 拷贝当前行

mac上的不太一样，merge完成点击`Complete Merge`即可：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685935192240-26671e9e-dde5-4181-a5ad-54caf1b6ff85.png#averageHue=%23151515&clientId=ue5f78299-9e82-4&from=paste&height=396&id=ucb306c1b&originHeight=1942&originWidth=3248&originalType=binary&ratio=2&rotation=0&showTitle=false&size=876309&status=done&style=none&taskId=u6503b78a-d6bd-4cb6-b142-ba6aded7be7&title=&width=663)

# SourceTree

## SourceTree跳过Atlassian账号，免登陆，跳过初始设置

SourceTree 安装之后需要使用账号登陆以授权，并且是强制登陆。<br>登录过程非常漫长，并未在不FQ的情况下是不能成功的，下面记录一下跳过登录的方法:<br>装之后，转到用户本地文件夹下的 SourceTree 目录，找到`accounts.json`文件，没有则新建。`C:\Users\Administrator\AppData\Local\Atlassian\SourceTree`输入以下内容保存即可:

```
[
  {
    "$id": "1",
    "$type": "SourceTree.Api.Host.Identity.Model.IdentityAccount, SourceTree.Api.Host.Identity",
    "Authenticate": true,
    "HostInstance": {
      "$id": "2",
      "$type": "SourceTree.Host.Atlassianaccount.AtlassianAccountInstance, SourceTree.Host.AtlassianAccount",
      "Host": {
        "$id": "3",
        "$type": "SourceTree.Host.Atlassianaccount.AtlassianAccountHost, SourceTree.Host.AtlassianAccount",
        "Id": "atlassian account"
      },
      "BaseUrl": "https://id.atlassian.com/"
    },
    "Credentials": {
      "$id": "4",
      "$type": "SourceTree.Model.BasicAuthCredentials, SourceTree.Api.Account",
      "Username": "",
      "Email": null
    },
    "IsDefault": false
  }
]
```

现在再打开 SourceTree，直接显示主窗口了。

## SourceTree&Git部分名词解释

- 克隆(clone)<br>从远程仓库URL加载创建一个与远程仓库一样的本地仓库
- 提交(commit)<br>将暂存文件上传到本地仓库（我们在Finder中对本地仓库做修改后一般都得先提交一次，再推送）
- 检出(checkout)<br>切换不同分支
- 添加（add）<br>添加文件到缓存区
- 移除（remove）<br>移除文件至缓存区
- 暂存(git stash)<br>保存工作现场
- 重置(reset)<br>回到最近添加(add)/提交(commit)状态
- 合并(merge)<br>将多个同名文件合并为一个文件，该文件包含多个同名文件的所有内容，相同内容抵消
- 抓取(fetch)<br>从远程仓库获取信息并同步至本地仓库
- 拉取(pull)<br>从远程仓库获取信息并同步至本地仓库，并且自动执行合并（merge）操作，即**pull = fetch + merge**
- 推送(push)<br>将本地仓库同步至远程仓库，一般推送（push）前先拉取（pull）一次，确保一致
- 分支(branch)<br>创建/修改/删除分支
- 标签(tag)<br>给项目增添标签
- 工作流(Git Flow)<br>团队工作时，每个人创建属于自己的分支（branch），确定无误后提交到master分支
- 终端(terminal)<br>可以输入git命令行

## SourceTree 多标签(TAB)支持

- Windows上的SourceTree默认就有多标签，而Mac版的在设置里找了半天没找到
- Mac Window > Merge All Windows

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688633305126-ae22055f-7ca3-4458-ba19-03183e366540.png#averageHue=%23d3cdc7&clientId=u54326ba6-493f-4&from=paste&height=220&id=u0f201805&originHeight=834&originWidth=990&originalType=binary&ratio=2&rotation=0&showTitle=false&size=142439&status=done&style=none&taskId=u66dc700a-0cfc-4f61-9a6d-9582dbd8496&title=&width=261)

## SourceTree之pull

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081136876-f4b7e149-dc84-4b05-843b-6570600ad1ea.png#averageHue=%23e3e2e1&clientId=u575aa065-5589-4&from=paste&height=222&id=u3e7f1a8b&originHeight=279&originWidth=699&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31276&status=done&style=none&taskId=u34a970f1-0e2a-4422-8367-d05f35667d3&title=&width=555.5)

1. **Commit merged changes immediately**<br>将merge过来的代码直接commit，不会push
2. **Include messages from commits being merged in merge commit**<br>将merge的代码的commit添加到commit messages中
3. **Create a new commit even if fast-forward is possible**<br>会创建一条新的commit message如果符合fast-forward
4. **Rebase instead of merge**<br>用rebase替代merge，前提是你没有要commit的代码；分支线很好看，不会凌乱

## SourceTree之merge

### 1. 首先切换到要合并的分支

### 2. 点击工具栏上的merge

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081226870-e0097cf1-1c1f-417c-8d69-52013e03f26b.png#averageHue=%23deb37b&clientId=u575aa065-5589-4&from=paste&height=373&id=ud9051a01&originHeight=746&originWidth=1366&originalType=binary&ratio=2&rotation=0&showTitle=false&size=157985&status=done&style=none&taskId=u497e41ef-4e12-4ae9-8cee-a7f74615b82&title=&width=683)

- Commit merge immediately(if no conflicts)<br>勾选会自动提交这次 Merege Commit, 否则的话, 你需要手动提交；但不会push。
- Include messages from commits being merged in merge commit<br>会把这个分支上（被合并分支）的所有的提交日志附加到 Merege Commit 的提交日志中.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081248363-30d17d82-d475-43cd-af4b-9b0a531fb051.png#averageHue=%23f9f8f6&clientId=u575aa065-5589-4&from=paste&height=417&id=ucb5e76be&originHeight=441&originWidth=654&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61560&status=done&style=none&taskId=u4cdd7ef8-8607-4ecb-9f5d-59dd0fe9b1a&title=&width=619)

- Create a new commit even if fast-forward is possible<br>会创建一条新的merger commit message

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081265867-b260575d-dcd6-4ee2-803f-4d5a44bb6735.png#averageHue=%23eaffff&clientId=u575aa065-5589-4&from=paste&height=31&id=u0ed6bdd2&originHeight=25&originWidth=233&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4957&status=done&style=none&taskId=ub55f4d17-ef67-411e-987b-16bc1371389&title=&width=290.5)![](https://note.youdao.com/yws/res/22308/50DC2C870C4346AA85D323E7359F0DAC#clientId=ucef9144a-5f63-4&id=GCzPz&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud644caaf-2b07-4727-930d-26e7d182530&title=)

## SourceTree git rebase -i变基

### 未push到远端

选中`9961a67d5d3e528df32a49f8800cd8b289436bf3`（不包括）<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081372259-56fdbfbc-ed57-4f19-a739-1f34833a1690.png#averageHue=%23ecc9c1&clientId=u575aa065-5589-4&from=paste&height=231&id=u4869b198&originHeight=462&originWidth=2082&originalType=binary&ratio=2&rotation=0&showTitle=false&size=212610&status=done&style=none&taskId=ue9a2409a-f5a0-403f-beb5-8c67905e667&title=&width=1041)<br>`Rebase children of 9961a67d5 interactively`<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081381354-c17c6c17-498e-46ba-81aa-5abacbb1e8fc.png#averageHue=%23eee3db&clientId=u575aa065-5589-4&from=paste&height=534&id=uaa70ec8d&originHeight=1068&originWidth=1728&originalType=binary&ratio=2&rotation=0&showTitle=false&size=502837&status=done&style=none&taskId=u813362d0-ac68-4353-98c7-5dc579cb590&title=&width=864)

1. 上下箭头变更commit顺序
2. squash with previous，只能选择第一个（在最后一个点击无效），后面的合并到该commit，而commit message默认为:

```
提交错了啊 (+1 squashed commit)
Squashed commits:
[d087858] 连击动画
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081412681-441e6853-0822-4b5a-8318-04ca6cf4c12d.png#averageHue=%23ebe9e1&clientId=u575aa065-5589-4&from=paste&height=500&id=u411a5c97&originHeight=1000&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=430213&status=done&style=none&taskId=ue90018c3-7f28-4237-8268-85427c9d580&title=&width=800)

3. Edit message可以更改commit message
4. Delete，删除该commit

```
git rebase --abort // 放弃
git rebase --continue // 继续
```

### 已经push到远端

1. 同未push到远端
2. 需要加个git push -f

## SourceTree回滚

### 1、Unstaged files和Staged files需要回滚

**Unstaged files**<br>未git add 文件状态<br>**Staged files**<br>git add后文件状态<br>此时的文件还是处于本地分支, 远端还没有, 直接选中要回滚的文件右键Discard丢弃掉<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082355305-e002b79c-6999-4345-99a1-fd87e8d6bae6.png#averageHue=%23f0efee&clientId=u575aa065-5589-4&from=paste&height=261&id=uabd83d15&originHeight=522&originWidth=422&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29064&status=done&style=none&taskId=ufa77eaca-b688-4deb-ae3b-d3ce1c5271d&title=&width=211)

### 2、已经commit，未push

这个可以先`git pull --rebase`下来，此时你的commit在最上面；然后再选中你提交的上一个commit，然后reset，选择hard模式。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082392510-24ad8fb2-1619-4e09-bb24-341560a20abc.png#averageHue=%23eeecea&clientId=u575aa065-5589-4&from=paste&height=211&id=ubfb4ec57&originHeight=422&originWidth=709&originalType=binary&ratio=2&rotation=0&showTitle=false&size=68822&status=done&style=none&taskId=u5aa27df4-e9d0-4178-b5db-7888521bf68&title=&width=354.5)<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082408594-df126a31-4ede-4437-bc07-9ad230a1727c.png#averageHue=%23dcdbd9&clientId=u575aa065-5589-4&from=paste&height=143&id=ub87e9031&originHeight=161&originWidth=401&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15027&status=done&style=none&taskId=u63996519-b54b-48f8-9ee3-25303a62bad&title=&width=355.5)

### 3、已经push的

> 要注意选择`commit id`

1. 选中要回滚的commit，
2. 右键，Reverse commit，这种方式不好有冲突，会留下一个Revert的commit记录

然后生成一条未push的commit，并生成一条commit msg，类似`Revert "fix: Splash页，debug环境20秒跳转"`

3. 也可以用git reset，修改后，git push -f强推（这种方式可能容易出冲突，但是没有了log了）

## SourceTree丢弃本地未commit的修改记录和新增的文件

### 1、没有新增的文件

- 方式1：Repository→Reset
- 方式2：右键File Status![](http://note.youdao.com/yws/res/19853/6265FEB9E3F142E7BA482F68E1AD8E17#clientId=ucef9144a-5f63-4&id=Jl7JA&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0815f6b1-2339-449d-943c-525eec21b68&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081625577-9e7c4a8c-72a9-4f7d-accd-6a778ee01371.png#averageHue=%23e9e7e7&clientId=u575aa065-5589-4&from=paste&height=430&id=ub7fc87a4&originHeight=860&originWidth=1574&originalType=binary&ratio=2&rotation=0&showTitle=false&size=204538&status=done&style=none&taskId=ue70fce41-1e09-4932-88f1-b9a8c0dcba3&title=&width=787)
- Discard File Changes 丢弃当前选中的文件的修改（这种方式不能删除新增的文件）
- Reset All 丢弃所有的修改（这种方式不能删除新增的文件）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081761770-b1ac2107-61d9-4a82-a7c6-d7e7736f92bc.png#averageHue=%23696868&clientId=u575aa065-5589-4&from=paste&height=205&id=ua946fe9a&originHeight=506&originWidth=1138&originalType=binary&ratio=2&rotation=0&showTitle=false&size=132824&status=done&style=none&taskId=u891aaecf-2295-487d-809e-7695acc595d&title=&width=462)

> 如果要删除新增的文件，上诉操作后，选中要删除的文件右键remove

### 2、有新增的文件

Repository→Checkout Clean<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081925010-b0d1b51c-d2ad-4161-af8e-ec7fa9446731.png#averageHue=%23f0efee&clientId=u575aa065-5589-4&from=paste&height=589&id=ufe270568&originHeight=1178&originWidth=1616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=329259&status=done&style=none&taskId=ud8be0f73-35fd-408c-8d40-f40456186f7&title=&width=808)

> 可以Discard修改的文件，貌似也删除不了新增的文件

## SourceTree配置merge tools：Beyond Compare

### 配置Beyond Compare辅助解决冲突

- 在SourceTree配置BeyondCompare工具

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082943038-34c38f4a-35f7-4ed0-a77e-a38034733713.png#averageHue=%23f1f0ef&clientId=u575aa065-5589-4&from=paste&height=295&id=u6a6f71d6&originHeight=490&originWidth=584&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58621&status=done&style=none&taskId=u52d03b56-5fc7-4636-8a01-b97ab83df94&title=&width=351)

- 启动冲突解决外部工具

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082953912-221cf7d4-2563-45bf-b300-38d6a5e3087e.png#averageHue=%23f3f2f1&clientId=u575aa065-5589-4&from=paste&height=322&id=uc5887270&originHeight=567&originWidth=664&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42740&status=done&style=none&taskId=uc053270e-25ba-4c3b-b7c7-f1e9f245a4c&title=&width=377)

- 这时会启动BeyondCompare

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684083000321-4a9c4d96-9d04-4478-804e-a7d38793e18c.png#averageHue=%23c7a672&clientId=u575aa065-5589-4&from=paste&height=406&id=u15027407&originHeight=811&originWidth=1032&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103907&status=done&style=none&taskId=uf42b37f2-a97a-4327-b61d-7ab8822daf7&title=&width=516)

### BC工具对比解决git冲突时 Mine/Theirs区分

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684083197970-c548670f-b53c-45ef-9776-c05283a861f2.png#averageHue=%23e1a46c&clientId=u575aa065-5589-4&from=paste&height=520&id=u0d1e0786&originHeight=1040&originWidth=1920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=236682&status=done&style=none&taskId=u4bc945fc-8737-449f-a0c5-7eb2836cac7&title=&width=960)

1. 如果没有加`--rebease`，就是merge，左边`xxx_LOCAL`就是你提交的，右边的`xxx_REMOTE`就是他人提交的
2. 如果加了`--rebase`，左边的`xxx_LOCAL`就是他人提交的，右边的`xxx_REMOTE`就是你提交的
3. 蓝色代表的LOCAL的，灰色代表中间的BASE，粉色代表的是REMOTE的；默认BC会为什么自动合并代码
   1. 当出现冲突时，冲突的地方会有红色的感叹号，我们可以选择用LOCAL的还是REMOTE；或者先left再right；或者先right再left
   2. 点击上方工具栏的`Next Confilct`或`Prev Conflict`可快速定位到后/前一个冲突的代码块

### 用BC解决冲突时不生成.orig

- 用BC解决完冲突Session→Exit , 完毕

> 但是会生成README.md.orig文件

- 不生成`.orig`文件

```
git config --global mergetool.keepBackup false
```

- 添加到`.gitignore`忽略列表

```
# git mergetool backup
*.orig
```

### SourceTree Mine/Theirs 解决冲突时的坑

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684082596319-22567657-5d51-4f49-8fe2-184fa787812a.png#averageHue=%23e7e8e7&clientId=u575aa065-5589-4&from=paste&height=172&id=u576accce&originHeight=344&originWidth=1756&originalType=binary&ratio=2&rotation=0&showTitle=false&size=575995&status=done&style=none&taskId=u826ba04b-a7bd-4032-b744-e9cca049372&title=&width=878)

1. SourceTree 在解冲突时，如果使用`Resolve using 'Theirs'`，不是指冲突部分使用他人版本，而是将整个文件`Resolve using 'Theirs'`；**没有冲突的那部分也会被丢弃。**

> <https://segmentfault.com/a/1190000019990611>

2. **git merge/git pull时的冲突**<br>这个时候，`Resolve using 'Mime'`表示的是自己本地的修改；`Resolve using 'Theirs'`表示的是远端的修改
3. **git rebase方式的冲突**<br>`Resolve using 'Mime'`表示的是远端的修改；`Resolve using 'Theirs'`表示的是本地的修改，这个要注意
4. applying a stash<br>这个没有试

### Mine/Theirs的解释

官方解释<br><https://community.atlassian.com/t5/Git-questions/Resolve-using-quot-theirs-quot-vs-quot-mine-quot-what-is-the/qaq-p/393422>

```
When you have conflict between your file and the file that you're merging, you have two choices:
"Mine" - Your file will be used to solve the conflicts
"Theirs" - The Target file will be used to solve the conflicts.
```

啊男公司git布道师解释：

- rebase 别人的分支，相当于把别人分支当成主体，自己就是外来的； 所以这种情况，Mine代表远端，Theris代表你的分支
- merge 别人分支过来，相当于当前这个是主体，别人是外来的节点；这种情况，Mine代表你的分支，Theirs代表远端

官方问题反馈：<br><https://jira.atlassian.com/browse/SRCTREE-1579?_ga=2.74721882.952710698.1566959108-1816678471.1566959108>

#### 注意

免费版本不支持Three-Way冲突对比，只有Local和Remote对比

## SourceTree配置merge tools：Vscode

1. Vscode: Install Command tools
2. 配置diff tool: `code --diff --wait "$LOCAL" "$REMOTE"`
3. 配置merge tool: `code -n --wait "$MERGED"`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688890463736-a50fc719-7efa-490d-b2cb-fcfb59005c60.png#averageHue=%23eae4e0&clientId=u538b52dd-a8b2-4&from=paste&height=454&id=u9e648999&originHeight=908&originWidth=1710&originalType=binary&ratio=2&rotation=0&showTitle=false&size=248671&status=done&style=none&taskId=ud322eb32-f4be-4274-94e5-7f520aaee26&title=&width=855)

## SourceTree配置多个ssh key

**Tools→Options：**<br>![](https://note.youdao.com/yws/res/103212/WEBRESOURCE6fa0780a6fe3b22134eee14087e8da75#clientId=ucef9144a-5f63-4&id=CPjEX&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7bf5add6-b842-46de-ab81-113ed8ee619&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684081296282-1174c64b-e2bf-40a3-8c87-faf6dc9cce26.png#averageHue=%23f4f2f2&clientId=u575aa065-5589-4&from=paste&height=375&id=MzvOI&originHeight=750&originWidth=851&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72811&status=done&style=none&taskId=uad4a01b6-97f2-4c4e-b75a-7b54deabd3e&title=&width=425.5)
