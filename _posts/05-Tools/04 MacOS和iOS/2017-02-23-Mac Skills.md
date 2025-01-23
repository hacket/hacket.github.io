---
date_created: Friday, February 23rd 2017, 10:10:45 pm
date_updated: Monday, January 20th 2025, 1:07:39 am
title: Mac Skills
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
date created: 2024-09-11 00:47
date updated: 2024-12-23 23:41
aliases: [Mac 技巧]
linter-yaml-title-alias: Mac 技巧
---

# Mac 技巧

## 如何给批量文件进行重新命名

1. 首先在 Finder 中选择你希望批量修改的文件（要进行批量修改的文件最好在名字上有共同点）。
2. 鼠标右键点击选中的文件，并选择 " 给 x 个项目重新命名… "，"x" 代表选中的文件数。(用于处理帧动画批量命名特别有用)

## Chrome 快速隐藏标签栏

> Mac Shift+Command+B

## Android Studio 中按 Ctrl+F12/Alt+F7 无效

**原因：** 默认的 F1~F12 功能键打开了，对应的 Ctrl+F12 就失效了 <br>**解决：**`设置→键盘→键盘快捷键→功能键，勾选上`<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132484.png)

## Mac10.11 后，需要运行允许任何来源的 App(去掉 Mac 自身有保护机制)

发现 Mac 自身有保护机制，默认是只识别 AppStore 来源的 app，我们要想使用破解版，必须得给该应用程序开一下权限，打开未知来源。嗯，这很简单，但是一打开隐私和安全的时候，我发现了我并没有未知来源这个选项。于是又上百度去搜，结果发现 Mac os 10.11 + 的系统中的偏好设置的 " 安全与隐私 " 中默认已经去除了 `允许任何来源App` 的选项，无法运行一些第三方应用。<br>**解决办法**<br>需要恢复允许 " 任何来源 " 的选项，即关闭 Gatekeeper，请在终端中使用 spctl 命令：

> sudo spctl --master-disable

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132485.png)

## Mac 备份和恢复系统

### 备份系统

用 `时间机器备份`

### 恢复系统

用迁移助手从时间机器中恢复系统

> Note: 旧版本的 MacOS 系统不能恢复备份好的新系统

#### 时间机器备份恢复系统步骤

- 重启后按⌘(command)+R，选择时间机器恢复

#### 恢复系统时的问题

[time machine恢复备份的时候卡住](https://discussionschinese.apple.com/thread/252292649)<br>在输入用户密码 - 进入时间机器选择好备份之后，选择目标磁盘输入密码之后就卡住了，一直没有开始恢复，而且右下角依然显示 " 解锁 "，但此时点解锁已经没有反应了<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132486.png)<br>**问题：** 新系统是 big sur(v11.0.1)，而备份的系统是 mojave(10.14)，恢复时，输入密码后就卡住了<br>**分析：** 注意不能直接在 Big Sur 里通过时间机器恢复，因为不是同一代系统了。<br>**解决：** 选择磁盘工具，把 Mac 磁盘抹掉，然后重启 Mac。再按住⌘(command)+R 进入实用工具，选择「从时间机器备份进行恢复」。后面就一步步来就行了。

### 苹果电脑恢复出厂设置（Macbook/iMac）

1. 重新启动电脑后 按 Command+R，进入 `macOS 实用工具`
2. 选中磁盘工具，将磁盘抹掉
3. 再次回到 `macOS 实用工具`，在线重新安装 macOS 系统

- [x] MacBook Pro 如何恢复出厂设置<br><https://discussionschinese.apple.com/thread/250228945>
- [x] 如何重新安装 macOS<br><https://support.apple.com/zh-cn/HT204904>

## 清理 Mac 磁盘空间

1. 用软件 `OmniDiskSweeper` 扫描占用空间大的文件和文件夹

> OmniDiskSweeper 下载路径：<https://www.omnigroup.com/more>

2. 删除掉
3. 清空废纸篓命令： `sudo rm -rf ~/.Trash/`

## 让 Touch Bar 一直显示功能键

打开 Keyboard 设置，接着选择 Shortcuts 一栏，在左侧列表中找到 Function Keys 一项。然后就可以在右侧栏里添加需要一直显示功能键的应用程序了，比如我常用的 Intellij 和 Android Studio 都在上边，Genymotion 也即将上榜。<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132487.png)

## Mac 10.13.2 (17C88) 配置 ss 无法翻墙

Mac 版本 `10.13.2 (17C88)`<br>用的 `https://github.com/shadowsocks/ShadowsocksX-NG` 的 1.7.1 的版本不行<br>换成 `https://github.com/yangfeicheung/Shadowsocks-X` 就可以了<br>Mac 的端口是 1086

## Mac 监控？

- 修改代理 app 名字，ClashX 为
- 修改 ClashX app 图标为 App music 图标：[Over 5000+ free icons for macOS Monterey, Big Sur & iOS - massive app icon pack](https://macosicons.com/#/)
- 修改运行后的图片，Content → Resources → `AppIcon.icns`
- 修改 ClashX 默认端口 7890
- 不单独使用 ClashX，使用 `Proxifier` + ClashX

### Mac 更换应用图标

#### 更改应用图标

**第一步：** 打开 Finder 应用程序，选择「应用程序」文件夹，然后选择你要更改图标的应用程序。在本文例子中，我将更换掉默认的 iTunes 图标。
**第二步：** 右键单击该应用程序并选择「显示简介」（或按下「Command + I」快捷键）。
**第三步：** 在应用程序信息面板的左上角，你可以看到应用程序的图标。现在将新的应用程序图标文件拖拽拖过来，然后释放鼠标按键即可。你还会看到一个更换动画
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132488.png)<br>当然你也可以使用快捷键：在 Finder 应用程序中选中新的图标文件，鼠标右键单击，选择「复制」，或选中该文件，然后按下「Command + C」，接着返回应用程序的信息面板，选中左上角原本的图标，然后按下「Command + V」粘贴即可。<br>注：OS X 可能会要求你输入管理员密码来确认更改应用程序的图标。<br>如果应用程序在你的 Dock 上，你会发现新更换的图标没有显示，我们还需要做一次注销操作。<br>**第四步：**打开「终端」应用程序，然后键入 `killall Dock`，然后按下「Enter」键确认即可。

#### 如何恢复到应用程序原来的图标

**第一步：** 打开 Finder 应用程序，找到「应用程序」文件夹，然后选择你要恢复图标的应用程序。<br>**第二步：** 右键单击该应用程序，选择「显示简介」选项（或按下「Command + I」快捷键）。<br>**第三步：** 在应用程序信息面板的左上角，你可以看到应用程序的图标。单击它使其高亮显示。<br>**第四步：** 按下「Delete」键。该应用程序的图标就会即刻恢复到原来的样子。<br>**注：OS X 可能会要求你输入管理员密码来确认恢复应用程序的图标。**<br>[wechat.icns.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1690961607465-e0b78a2a-43f8-4fc3-810f-8b83b290fc64.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1690961607465-e0b78a2a-43f8-4fc3-810f-8b83b290fc64.zip%22%2C%22name%22%3A%22wechat.icns.zip%22%2C%22size%22%3A468691%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22ucd48f5e6-f148-4d40-8abf-f23e3872d5f%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fzip%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u035f9f34%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

#### Mac/iOS 图标网站

<https://macosicons.com/>

## [使uniaccess agent监控软件失能？](https://www.zhihu.com/question/308601708)

```shell
cd /opt
ls -lO
sudo chflags -f -R nohidden LVUAAgentInstBaseRoot
sudo chflags -f -R noschg LVUAAgentInstBaseRoot

sudo mv LVUAAgentInstBaseRoot LVUAAgentInstBaseRoot_
sudo pkill dvc-screen-exe dvc-unisensitive-exe dvc-core-exe dvc-remote-exe
```

## Mac 电脑卸载 LVSecurityAgent 监控软件

```shell
echo 'delete shit.app..need your root pwd';
sudo rm -rf /Applications/dvc-manageproxy-exe.app;
sudo rm -rf /Applications/LVSecurityAgent.app;
echo 'script is fighting...';
sudo chflags noschg /opt/LVUAAgentInstBaseRoot;
sudo chflags noschg /opt/LVUAAgentInstBaseRoot/face;
sudo chflags noschg /opt/LVUAAgentInstBaseRoot/web;
echo 'delete shit.datafile..';
sudo rm -rf /opt/LVUAAgentInstBaseRoot;
echo 'kill shit.process..';
sudo ps -ef|grep -E 'LVUAAgentInstBaseRoot|dvc-manageproxy-exe' |grep -v "grep"|awk '{print $2}'|xargs sudo kill -9;
echo 'congratulations! You throw that shit!';
```

还有一些定时的脚本，可以删除<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132489.png)<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132490.png)<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132491.png)

## App 开机自启动 shell 脚本

1. 写一个 shell 脚本

```shell
#!/bin/zsh

scrcpy -m 1920 -b 25M

open -a SourceTree
open -a TeamViewer
open -a Proxifier
open -a TickTick
open -a 企业微信
open -a Alfred\ 5
open -a Android\ Studio\ Preview
open -a Fork
open -a ClashX
# open -a Flipper
```

2. 右键点击 run.sh->显示简介，主要将打开方式修改为终端，共享和权限将所有权限打开

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132492.png)

3. 进入系统偏好设置 ->Generay→LoginItem，将 shell 脚本添加进来

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132493.png)

## Mac 定时

### launchd

crontab 已经被 Mac OS 废弃了，替代品就是 launchd

#### launchd 配置目录

存放定时器任务配置文件的，有 5 个目录：

- /System/Library/LaunchDaemons 不用登陆也要运行,Apple 提供的系统守护进程
- /System/Library/LaunchAgents Apple 提供的代理，适用于每个用户的所有用户
- /Library/LaunchDaemons 不用登陆也要运行，第三方系统守护进程
- /Library/LaunchAgents 需要 root 登录并且配置文件归 root 所有
- **~/Library/LaunchAgents** 需要非 root 登录，并且配置文件归非 root 所有

#### plist 文件

#### 常用命令

- 加载任务, -w 选项会将 plist 文件中无效的 key 覆盖掉，建议加上

launchctl load -w com.test.plist

- 删除任务

launchctl unload -w com.test.plist

- 查看任务列表, 使用 grep ' 任务部分名字 ' 过滤

launchctl list | grep 'test.demo'

- 开始任务 - 立即执行

launchctl start com.test.plist

- 结束任务

launchctl stop com.test.plist

- 错误排查

launchctl error errcode 查看哪里不对

#### 配置

1. 创建 plist 配置文件

> vi me.hacket.cron.plist

2. 加载配置文件

> launchctl load me.hacket.cron.plist
>
> # or
>
> # launchctl load /xxx/xxx/me.hacket.cron.plist

3. 卸载

> launchctl unload me.hacket.cron.plist

4. 查看多少作业在执行

> sudo launchctl list | grep 'cron'

##### 案例

##### 每隔 5 秒定时任务

1. /Users/10069683/Library/LaunchAgents/me.hacket.cron.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>me.hacket.cron</string>

    <key>ProgramArguments</key>
    <array>
      <string>/Users/10069683/.sh/wework.sh</string>
    </array>

    <key>Nice</key>
    <integer>1</integer>

    <key>StartInterval</key>
    <integer>5</integer>

    <key>RunAtLoad</key>
    <true />

    <key>StandardErrorPath</key>
    <string>/Users/10069683/.sh/tmp/test_err.txt</string>

    <key>StandardOutPath</key>
    <string>/Users/10069683/.sh/tmp/test_out.txt</string>
  </dict>
</plist>
```

2. shell 脚本

```shell
#!/bin/zsh # shell interpreter

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
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export FLUTTER_HOME=~/flutter

export PATH=$HOME/bin:/usr/local/bin:$GRADLE_HOME/bin:$ANDROID_HOME:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$DIY_TOOLS:$FLUTTER_HOME/bin:$PATH

## HomeBrew
export PATH=/opt/homebrew/bin:$PATH

## 进程
### 获取某个进程的pid pid:print '企业微信'
function pid:print() {
  ps -ef | grep $1 | awk 'NR==1{print $2}'
  # 或者  ps -e | grep ClashX.app | awk 'NR==1{print $1}'
}
### macOS根据名称杀死进程 pid:kill '企业微信'
function pid:kill() { 
  ps -ef | grep $1 | awk 'NR==1{print $2}' | xargs kill -9
}

OUT_FILE=/Users/10069683/.sh/tmp/test_out.txt

echo '-----------------add path-------------------'
date >> $OUT_FILE
echo "adb shell am force-stop com.tencent.wework" >>  $OUT_FILE
adb shell am force-stop com.tencent.wework

echo "adb shell monkey -p com.tencent.wework -c android.intent.category.LAUNCHER 1" >>  $OUT_FILE
# /Users/10069683/Library/Android/sdk/platform-tools/adb shell monkey -p com.tencent.wework -c android.intent.category.LAUNCHER 1 

echo "kill 企业微信 111"  >>  $OUT_FILE
# ps -ef | grep '企业微信' | awk 'NR==1{print $2}'
```

- 需要写 shell 解释器，第一行注释的代码
- 定时任务的 shell 读取不到 `~/.zshrc` 的 PATH，要执行的命令需要把 PATH 写在 shell 脚本中，否则找不到命令的路径

#### launchd 定时任务不生效

用软件 `LaunchControl` 打开你的 plist 文件，上面有错误码和提示<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132494.png)

#### Ref

- [ ] [Mac 定时任务 launchctl](https://cl9000.github.io/2017/04/09/Mac-%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1-launchctl/)
- [ ] [macOS launchd 不完全指南](https://juejin.cn/post/7234433850456719397)

### crontab

#### crontab 文件的语法格式

每一行都代表一项任务，每行的每个字段代表一项设置，它的格式共分为六个字段，前五段是时间设定段，第六段是要执行的命令段，格式如下：

```shell
minute  hour  day  month  week  command
# For details see man 4 crontabs
# Example of job definition:
.---------------------------------- minute (0 - 59) 表示分钟
|  .------------------------------- hour (0 - 23)   表示小时
|  |  .---------------------------- day of month (1 - 31)   表示日期
|  |  |  .------------------------- month (1 - 12) OR jan,feb,mar,apr ... 表示月份
|  |  |  |  .---------------------- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat  表示星期（0 或 7 表示星期天）
|  |  |  |  |  .------------------- username  以哪个用户来执行 
|  |  |  |  |  |            .------ command  要执行的命令，可以是系统命令，也可以是自己编写的脚本文件
|  |  |  |  |  |            |
*  *  *  *  * user-name  command to be executed
```

- `*` 表示任何时候都匹配
- `a,b,c` 表示 a 或者 b 或者 c 执行命令
- `a-b` 表示 a 到 b 之间 执行命令
- `*/a` 表示每 a 分钟 (小时等) 执行一次
- crontab 不能编辑系统级的任务

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132495.png)

```shell
# 每1分钟执行一次Command
*/1 * * * * Command
 
# 每1小时执行一次Command
0 */1 * * * Command
 
# 每小时的第3和第15分钟执行
3,15 * * * * Command
 
# 每天早上9点执行
0 9 * * * Command
 
# 在上午8点到11点的第3和第15分钟执行
3,15 8-11 * * * Command
 
# 每隔两天的上午8点到11点的第3和第15分钟执行
3,15 8-11 */2  *  * Command
 
# 每周一上午8点到11点的第3和第15分钟执行
3,15 8-11 * * 1 Command
 
# 晚上11点到早上7点之间，每隔一小时重启httpd服务
* 23-7/1 * * * service httpd restart
```

示例：

```shell
# 每天9点输出一条日志到~/.sh/work_log.txt
0 9 * * * /bin/date >> /Users/10069683/.sh/time.txt

00 22 * * 1-6 /bin/zsh /Users/10069683/.sh/click.sh

# 每周一上午9点35分执行wework.sh
35 9 * * 1 /bin/zsh /Users/10069683/.sh/wework.sh
22 22 * * 1 /bin/zsh /Users/10069683/.sh/wework.sh

36 9 * * 2 /bin/zsh /Users/10069683/.sh/wework.sh
21 22 * * 2 /bin/zsh /Users/10069683/.sh/wework.sh

32 9 * * 3 /bin/zsh /Users/10069683/.sh/wework.sh
25 22 * * 3 /bin/zsh /Users/10069683/.sh/wework.sh

38 9 * * 4 /bin/zsh /Users/10069683/.sh/wework.sh
20 22 * * 4 /bin/zsh /Users/10069683/.sh/wework.sh

33 9 * * 5 /bin/zsh /Users/10069683/.sh/wework.sh
15 22 * * 5 /bin/zsh /Users/10069683/.sh/wework.sh

#30 9 * * 6 /bin/zsh /Users/10069683/.sh/wework.sh
#40 22 * * 6 /bin/zsh /Users/10069683/.sh/wework.sh

*/1 * * 5 /bin/zsh /Users/10069683/.sh/wework.sh
```

```shell
echo '------------------------------------'
/bin/date >> /Users/10069683/.sh/work_log.txt
echo "adb shell am force-stop com.tencent.wework" >> /Users/10069683/.sh/work_log.txt
/Users/10069683/Library/Android/sdk/platform-tools/adb shell am force-stop com.tencent.wework

echo "adb shell monkey -p com.tencent.wework -c android.intent.category.LAUNCHER 1" >> /Users/10069683/.sh/work_log.txt
/Users/10069683/Library/Android/sdk/platform-tools/adb shell monkey -p com.tencent.wework -c android.intent.category.LAUNCHER 1 
```

#### crontab 用 vscode 编辑

- [ ] [How can I edit crontabs in VS Code?](https://stackoverflow.com/a/65142525)

1. Create a file touch ~/code-wait.sh:

```shell
#!/bin/bash
OPTS=""
if [[ "$1" == /tmp/* ]]; then
    OPTS="-w"
fi

/usr/local/bin/code ${OPTS:-} -a "$@"
```

2. Make this file executable:

```shell
chmod 755 ~/code-wait.sh
```

3. Add to your .bashrc or .bash_profile or .zshrc:

```shell
export VISUAL=~/code-wait.sh
export EDITOR=~/code-wait.sh
```

4. Run command:

```shell
EDITOR='code' crontab -e
```

#### crontab 注意

- 在使用 crontab 命令时前面需要加 sudo 避免权限问题
- crontab 创建任务里面的路径都需要绝对路径
- 创建的 cron 任务是否在当前用户下
- crontab 脚本环境变量

crontab 使用的 shell 环境可能不同，因此您需要确保您的环境变量设置在 crontab 中正确生效。您可以通过使用「SHELL」行设置 crontab 中 shell 的路径来确保正确性<br>解决：将 `~/.zshrc` 中的拷贝到 sh 脚本中去就能识别了；记得指定 shell 解释器

```shell
#!/bin/zsh # shell interpreter
# Edit the crontab file
crontab -e

# Add the following line to the file
SHELL=/bin/bash
export VAR_NAME=value
* * * * * echo $VAR_NAME
```

- Android 中使用 ocrntab 需要 root 权限

# Mac 常用命令

## 常用命令

**ls**<br>列出文件夹中的内容<br>ls -l 列出文件详细信息<br>ls -a 列表隐藏文件<br>**cd**<br>切换目录<br>`.`  当前目录<br>`..` 上级目录<br>`~`  home 目录<br>`-` 上一个工作目录<br>**mkdir**<br>建立新目录，默认只能建立一级目录

> mkdir test1

mkdir -p 可建立多级目录不存在的目录

> mkdir -p test2/test3/test4/

**rmdir**<br>删除目录，非空目录用 rm 命令<br>**cp**<br>拷贝文件<br>cp 源文件 目标文件<br>如果源文件是目录，加上 -r 参数

> cp -r testDir2 testDir222

**rm**<br>删除文件

> rm 1.txt

参数 -rf 表示递归和强制，可以删除文件夹

> rm -rf test666

**mv**<br>移动文件，也有改名的功能<br>mv 源文件 目标文件<br>**nano**<br>文本编辑<br>**ps**<br>**复制内容到剪切板**

> cat ~/.ssh/id_rsa.pub | pbcopy

## MacOS 命令行计算文件 hash 值

**MD5**

```
openssl dgst -md5 123.bin
// or
openssl md5 123.bin
// or
md5 123.bin
// or
md5 -s "text"
```

**SHA1**

```
openssl dgst -sha1 123.bin
// or
openssl sha1 123.bin
```

**HmacMD5**

```
openssl md5 -hmac "replace_hmac_key_string_here" 123.bin
```

**sha256**

```
openssl sha256 filename
```

## 显示隐藏文件命令

1. **命令行方式：**
   - 显示隐藏文件：

> defaults write com.apple.Finder AppleShowAllFiles YES;KillAll Finder

- 不显示隐藏文件：

> defaults write com.apple.Finder AppleShowAllFiles NO;KillAll Finder

2. **快捷键方式：**

> `command+shift+.`

3. **Finder→前往文件夹**

# Mac 快捷键

## 常用

cmd+option+esc 强制关闭应用<br>cmd+space 打开 SpotLight<br>cmd+h 隐藏窗口<br>cmd+option+h 隐藏除当前窗口其他窗口<br>cmd+m 最小化当前窗口<br>cmd+n 新建任务<br>cmd+o 打开<br>cmd+s 保存<br>cmd+shift+s 另存为<br>cmd+p 打印<br>cmd+w 关闭当前窗口<br>cmd+q 退出程序<br>cmd+f3 最小化桌面

f3 Mission Control<br>f4 Launchpad

cmd+← 移动光标到最前面<br>cmd+→ 移动光标到最后面<br>cmd+↑ 回到上一层文件夹<br>cmd+↓ 进入文件夹

## 切换

control+space 切换输入法<br>cmd+tab 切换 app<br>cmd+shift+tab 反向切换 app<br>cmd+tab 引用程序间切换

## 截屏

cmd+shift+3 截取全屏 png 保存到桌面<br>cmd+shift+4 区域截图 (再按 space，可以选择截取窗口)

## 文件管理

选中 +space 预览文件内容<br>cmd+c 拷贝<br>cmd+v 粘贴<br>cmd+x 剪切<br>cmd+a 全选<br>opt+cmd+v 剪切 (cmd+C 复制后，第一次可以使用 opt+cmd+V 使用 Move to here 功能。以后再按 cmd+V 粘贴复制到别的地方。)

## 浏览器

cmd+n 新建一个新的窗口<br>cmd+t 在当前窗口新建标签页<br>cmd+r 刷新<br>cmd+f 搜索<br>cmd+w 关闭当前选项卡<br>cmd+d 收藏当前网页

## 系统

control+shift+f12 后面的键 关闭显示器<br>control+cmd+space 调出面板中常用的各种表情和符号

## 其他

### 打出 Apple logo 快捷键

option+shift+K

### 常用快捷键一览图

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132496.png)

### 键盘按键对应的虚拟图标

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290132497.png)

# Mac 软件破解资源 (推荐买正版)

<https://macwk.lanzoui.com/>

# Mac 遇到的问题

## 快捷键冲突 ShortcutDetective

[[Mac Software list#快捷键冲突 ShortcutDetective]]

## （重置 SMC）Android 手机连接 usb，休眠后一段时间回来连接不上

**问题：** 需要重新插拔 usb 线才能连接上。<br>**解决：** 这可能是由于 USB 电源管理设置导致的问题。您可以尝试以下方法来解决这个问题：

1. 重置 SMC (System Management Controller)：
   - 关机你的 Mac。
   - 插入电源适配器。
   - 同时按住 `左侧Shift + Control + Option` 键和电源按钮，然后释放所有键同时按下电源按钮。
   - 启动 Mac。
2. 更改电源管理设置：
   - 转到 " 系统偏好设置 " > " 节能 "，然后取消勾选 " 启用电源 nap" 和 " 自动唤醒 "。
3. 更新系统和驱动程序：
   - 确保您的 Mac 和连接的设备都有最新的系统更新和驱动程序。
