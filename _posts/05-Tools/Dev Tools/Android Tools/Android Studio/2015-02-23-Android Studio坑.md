---
banner: 
date_created: Friday, February 23rd 2015, 10:10:45 pm
date_updated: Monday, April 14th 2025, 11:44:39 pm
title: Android Studio坑
author: hacket
categories:
  - Tools
category: DevTools
tags: []
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
date created: 2024-12-23 23:21
date updated: 2024-12-23 23:21
aliases: [Android Studio 坑]
linter-yaml-title-alias: Android Studio 坑
---

# Android Studio 坑

## Android 编译时的各种问题

### Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.8.0, expected version is 1.6.0

**报错：**

> /Users/xxx/.gradle/caches/transforms-3/638bdc2f3e1ec12bf62601ed14331206/transformed/jetified-firebase-analytics-ktx-21.2.2-api.jar!/META-INF/java.com.google.android.libraries.firebase.firebase_analytics_ktx_granule.kotlin_module: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.8.0, expected version is 1.6.0.

**分析：**<br />当前 `kotlin_version = '1.6.0'`，在引入了 Firebase Remote Config 后，编译报错了

```groovy
// Import the BoM for the Firebase platform
implementation platform('com.google.firebase:firebase-bom:32.0.0')
// Add the dependencies for the Remote Config and Analytics libraries
// When using the BoM, you don't specify versions in Firebase library dependencies
implementation 'com.google.firebase:firebase-config-ktx'
implementation 'com.google.firebase:firebase-analytics-ktx'
```

**解决：**<br />
改 `kotlin_version = '1.7.0'`，kotlin compiler 版本：<br />
![neqye](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/neqye.png)

# 不能调试&手机没有 Log

## 魅族手机无法打印 Log 日志的问题

打开【设置/辅助功能】中的【开发者选项】，页面底部找到【性能优化】，打开【高级日志输出】，勾选【全部允许】即可

## 小米手机 INSTALL_FAILED_USER_RESTRICTED

需要在开发者选项中开启：`usb安装`

## 美图手机开发者选项

- 打开开发者选项<br>美图 M 4 在拨号界面输入 `*#63488#`，找到 `开发者选项` - `usb调试`，向右滑动打开
- 打开 log 输出<br>默认不输出 V/D/I 级别的 log，在输入 `*#63488#` 后，在最下面一行找到日志控制选项，把 log 打开

## 【华为】如何正确打开华为手机的 USB 调试和完整 log 功能？

- 华为手机（荣耀 6）不能开启 USB 调试？

借了一台华为荣耀手机，估计被重置过系统，电脑都连接不上，在关于里面开启开发者模式。并开启 USB 调试模式，但是刚打开，再次进来就变成不可选择的状态，并且不能调试。

### 打开 USB 调试模式

需要如下操作才能正常使用 USB 调试模式。

1. 首先打开拨号盘，输入<br>`*#*#2846579#*#*`
2. 系统自动弹出下面的对话框，选择 "`projectmenu`"
3. ![glhp9](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/glhp9.png)
4. 在下一个对话框内选择 "`后台设置`"
5. 再下一个对话框内选择 "USB 端口设置 "
6. 在弹出来的下一个对话框内选择 "Google 模式 "，选择 " 确定 "
7. 到这里会显示端口配置成功，退出工程模式.<br>此时应该可以正常使用 USB 调试模式，如果还是有问题，可以尝试重启手机。

### 华为手机不能使用 Debug 和 Info 的日志

听测试说在华为 P 9 上无法显示日志，经过查看，应该是系统做了限制，只能你显示 Info 级别以上的，不能显示 Debug 和 Verbose 的日志。<br>华为 Android 手机打开 Log, 显示日志

1. 在拨号界面输入<br>`*#*#2846579#*#*`
2. 打开 Log

- 依次进入 "`后台设置–>2.LOG设置–>LOG开关”，选择“LOG打开`"； （如有就选择，没有就下一步）返回上一个界面，点击 "LOG 级别设置 "，选择 "VREBOSE"。
- 返回到上图，选择 "Dump & Log", 打开开关 " 打开 Dump & Log"。（不同手机可能略微有差异，看意思就能懂）

如果找不到，可以按照这个步骤：<br>`ProjectMenu -> 后台设置 -> 1.LOG 设置 -> LOG 打开 -> Dump & Log -> 日志开关 -> 后面打钩 -> 回到桌面` 即可。<br>如果还是有异常，可以重启手机。

- 如何正确打开华为手机的 USB 调试和完整 log 功能？<br><https://blog.csdn.net/gdky005/article/details/76851001>

## 各个厂商手机不打印 log 日志的解决方法

```shell
360手机
1） 在桌面的【其他应用】文件夹找到【用户反馈】，或通过搜索找到【用户反馈】
2 )  点击系统问题反馈
3 )  等复现问题，让问题出现2～3次
4 )  问题复现之后，直接到文件管理、本地存储，找到根目录下的“log或者mtklog”文件，将文件压缩后发送给工作人员

MIUI：
1） 在拨号键输入 *#*#284#*#* 来抓日志（不包括前后空格），过程可能要 1 分钟左右，成功后通知栏会提示；
2）等复现问题
3） 日志存放在 MIUI/debug_log 目录里，一个类似 bugreport-0227-14564.zip 的压缩包，将其发给我们

魅族
1） 去魅族应用市场下载一个叫“Log Report\ 的软件
2） 然后用它抓取LOG
3） 等问题复现后将log发给我们

OPPO
1）在拨号键盘输入*#800# ，在弹出的界面选择第一项“Oppo Logkit”，再选取第一项“常规log日志信息抓取”，点击最下面一排按钮最左右的“保存log”，返回到上一界面
2）选择QXDM log抓取，选择打开Device_Log，运行一段时间后选择关闭Device_Log
3）问题出现后在进入“常规log日志信息抓取”点击暂停log，再点击转存log，
4）进入文件管理把文件夹OPPOlog里面最新的log和文件夹diag_logs里面的最新文件压缩后发送给相关的工作人员

vivo
在拨号键盘输入  *#*#112#*#*   进入bbklog
我们机型抓log的方法根据处理器的平台不同方法也不同，分高通处理器平台以及MTK处理器平台
mtk开启LOG方法：拔号界面输入*#*#112#*#* —>MTKLogger,点最下方红色小键头,然后点返回键到主菜单，问题出现后，输入：*#*#112#*#*—>MTKLogger，点红色的方框停止，log路径：文件管理根目录下的mtklog文件夹，将整个文件夹压缩后发给相关的工作人员
高通平台抓log的步骤：在拨号盘输入*#*#112#*#*即可进入Bbklog界面，ADBLog开关是总开关，开启后退出该界面。然后运行问题出现的软件或者打开问题出现的路径，log路径：文件管理根目录下的bbk_log文件夹，将整个文件夹压缩后发给相关的工作人员

Nubia UI：
拨号输入 *#62564#（旧版 ROM 为 *#983564#）进入自带的抓日志工具 Woodpecker
1. 软件报错、闪退相关问题：
    a) 开启 MobileLog、NetworkLog 两项，并点击最下方开始箭头按钮
    b) 退出工具界面，操作手机，使问题复现后，记下时间点，再次进入工具点击停止按钮
    c) 在 内置存储/nubialog 文件夹里，将刚生成的 log 文件夹压缩，提交给工作人员并告知时间点
2. 功耗问题：
    a) 保证手机没有连接电脑、关闭 ModemLog 的情况下，重启手机，然后再开启 MobileLog 、NetworkLog、功耗Log 三项，记下当前电量，并点击最下方开始箭头按钮
    b) 正常使用手机，观察耗电情况（至少30分钟）；若发现异常，记录时间点、当前电量、使用了什么软件，做了什么操作，并进入 Log 工具点击停止按钮
    c) 在 内置存储/nubialog 文件夹里，将刚生成的 log 文件夹压缩，提交给工作人员并告知时间点

三星
1.  在系统拨号盘输入  *#9900#  进入sys Dump菜单
2.  Delete dumpstate/logcat
3.  Set Silent log : On to default
4.  测试复现问题
5. *#9900#进入sys Dump菜单
6.  Press Run dumpstate/logcat/modem log
7.  press copy to SDcard(include CP Ramdump)
8.  然后将内存根目录下的log文件夹压缩后发给工作人员

华为
1.  拨号键输入*#*#2846579#*#*，进入工程菜单
2.  选择后台设置--Log设置->Log开关
3.  点击页面最下方中间的播放按钮开始抓log，之后按钮会变成暂停图标，
点击后可以停止抓log，一旦选择了start，每次开机，log都会自动打开
4.  复现问题后，需要先选择stop，这样log能完全保存下来；
5.  打开LOG，正常使用手机，观察问题是否出现；
6.  如果问题出现，请记录一下时间点，最好能截个问题现象的截图；在问题出现后过10分钟再停止LOG，确保整个过程的LOG都抓到；
（如果长时间不复现，考虑到LOG可能占满手机空间，造成LOG覆盖的情况，请定时清除一下LOG）
7.  清除LOG方法为：首先将LOG停止；然后点击又下角的*桶图标，进入后选择“clear all”，然后选择确定，则手机存储中的LOG将会被全部清除；之后再打开LOG继续进行抓取；
8.  停止LOG后将LOG导出压缩发送；
Log的保存路径是：手机内部存储或者SD卡存储根目录下会有一个“mtklog”的文件夹；请将此文件夹从手机中拖出后压缩发送给相关工作人员

联想（含Moto z/z play/M 国行）
####3333#模式（MTK平台）
1. 打开拨号界面，输入####3333#，打开工程模式
2. 点击SystemLog后点击右上角设置按钮，进入设置界面，将三个log模式均点上，其他的暂时不要点
3.点击返回键，后点击屏幕下方中间的三角按钮，显示等待开始录取log，你会看到时间在动，这个时候退出，再通知栏也可以看到录取模式再运行
4.按照之前出现问题的操作方式再次进行操作，直至问题再次出现（即问题复现）
5.点击通知栏的log录取按钮，再次进入log录取界面，点击下方中间的方块按钮停止log录制
6.找到mtklog这个文件夹，将里面的内容拷出后压缩打包发给工程师
7.反馈完毕后为了避免log占用大量内存，按照步骤1进入工程模式后点击右下角的清除按钮（垃圾桶），然后选择需要清除的log，一般选择全部清除即可，然后返回退出即可。

####8888#模式（高通平台）
1. 在拨号界面输入####8888#，进入工程模式
2. 点选所有日志（或者根据问题类型选择）
3.点home键，然后按照之前的操作步骤复现问题
4.问题复现后再次按照步骤1进入工程模式点击保存日志
5.找到log这个文件夹，把里面的log拷出后打包发给工程师就ok了

金立
高通平台
1.  开机后，进入拨号界面，在拨号界面输入指令*#446633#
2.  进入金立的log日志选项界面了，看到英文很头疼？放心，很简单的！下面我来介绍。
3.  默认情况下，最上面两项Mobile Log和Kernel Log是打开的。遇到报错或者为了验证特殊问题时，如果是日常使用场景，不涉及到使用网络（WiFi、数据网络），打开它们就够了。
4.  如果你反馈的问题与网络连接有关，那么一定要打开后面两项Modem Log和Net Log。（否则你做了无用功，工程师收到无效log也会感到心好累的= =！）modem log开启后会占用一定内存，这一点请注意，传完log记得及时清理，腾出存储空间。
5.  接着看下面的Log Path选项，这个是log文件存储的位置选项，默认的就是Internal Storage（内置存储），所以这一项我们不用管。
6.  大家注意到了吗，有一行小字，Start Automatically when Reboot，勾选这个选项后便于开机直接启动log记录器，而不需要每次都进拨号盘输入命令启动，尤其是验证死机重启的问题时它很有用。
7.  最后也是最重要的一点，打开上面的所有选项后，一定记得点击绿色的“START”按钮。这时就会变成下面的界面了，log记录就开始了，我们就可以按返回键退出这个界面，执行各种操作，从而复现问题了。
8.   最后的最后，复现了问题步骤以后，记得连接电脑，复制存储目录下的GNLogs文件夹（因机型与平台的不同，有些为diag_logs文件夹），最好压缩后发给工作人员

MTK平台
1、到手机的拨号界面，输入*#446633#，会进入工程模式的界面。如下图所示，然后手指向左侧滑动，进入Log and Debugging子项下的MTKLogger选项，点击进入
2、 默认界面如下，正常情况下直接开启即可。开启方法就是点击正下方的红色小三角，类似于播放器的图标一样。开启后会有一个等待动画，几秒钟后开始计时，就表明你已经开始记录log了。这时候就可以退出此界面去复现你遇到的问题了。（也就是操作一遍你遇到问题的过程）
PS：如果你对于log占用的空间比较在意，并且所反馈的问题确认与网络无关，可以在开启log之前，点击右上角的设置按钮，进入下方右侧图片中的界面，关闭ModemLog。这样记录下来的log体积会大大减少。
但如果你的问题跟网络有关（无论数据流量还是WiFi相关），请务必保持ModemLog在开启的状态，否则记录的log是没用的！
3、复现问题后，下拉状态栏，进入log抓取界面，然后点击按钮关闭log开关。进入文件管理器，找到mtklog文件夹，压缩后发给工作人员
4、 log抓取部分的教程到此就结束了。Log传完以后，手机里的log文件仍然占用着空间，你可以直接在文件管理器删除整个mtklog文件夹进行清理，也可以进入抓log界面，点击右下角的垃圾桶，进入后选择右下角的Clear All，即可完成清理


一加
氢OS系统日志抓取步骤：
1.  打开拨号键盘输入*#800#——点击oneplus logkit；
2.  勾选“保存log”；
3.  点击“QXDM log抓取”；
4.  点击“打开device log”；
5.  返回操作使BUG复现；
6.  问题复现后记录问题出现时间，等待几分钟；
7.  将文件管理中“oem_log”文件夹拷出；
8.  为了不占用更多手机容量，在LOG已经提取后，可以再次打开“常规log日志信息抓取”与“QXDM log抓取”，关闭log抓取以后点击“删除历史log”。
然后把提取的文件压缩后发我就可以了  


乐视
1.  打开拨号页面，输入*#*#8888#*#* （或者打开问题反馈app，连续按5次左上角在线反馈后，会自动打开Log抓取设置页面）
2. 进入抓取页面后，把所有log选项都打开
3. 点击开始记录离线日志，点击后软件会在回后台运行记录日志
4. 复现你所发现的bug或问题后，按照上面的方法再次进入Log抓取页，点击停止记录，选择复现了，保存日志。
5. 保存日志后会自动打开在线反馈页面，请直接点返回键，放弃在线提交。(切记不要点提交!)
6. 返回桌面，找到文件管理app打开。依次点击：手机储存→logs→ArchivedLogs。这时可以看到抓取的log日志就保存在ArchivedLogs文件夹下
7. 把抓取的log日志压缩后可以发送给工程师们咯

酷派
MTK平台：
一、 如何抓取日志？
1.    进入拨号盘，输入*20121220#进入工程模式，选择【MTK_Engineermode】。
2.    左划到【Log and Debugging】下并点选【MTKLogger】。
3.    点击图标抓取日志。
日志抓取是可home键挂后台并会在托盘显示日志正在运行提示，下拉托盘点击即可进入日志抓取界面。
注意：日志开启后，操作出现异常日志方有效，提供日志时同时提供问题发生时间点，以便定位问题。


二、如何调整日志输出等级？
1、进入工程模式中后，进入日志输出等级，就是下面的截图
2、分别将Java log level和Cand C++ log level的日志等级调整为LOGV：
3、将Kernel log level的输出等级调整为最后的KERN_DEBUG：
三、如何保存日志？
1.    在日志抓取界面，点击结束图标，停止日志抓取。日志会自动保存到/storage/emulated/0/mtklog目录下。
2.    进入文件管理器，在/storage/emulated/0/mtklog目录下，将【mdlog】、【mobilelog】、【netlog】三个文件夹一起压缩打包即可。
四、如何清除日志文件？
3.    在日志抓取界面，点击删除图标，选择【CLEAR ALL】清除日志文件。
注意：长时间开启日志抓取会占用存储空间，建议及时清除日志文件。


高通平台：
方法如下：
1 、从拨号盘输入*20121220#进入到工程模式
2 、进入 日志输出等级
3、 按照如下的说明设置一下日志级别
       java log level 选择 LOGV (即第一项)
       c and c++ log level 选择  LOGV (即第一项)
       kernel log level 选择 KERN_DEBUG (即最后一项)
按照上面的设置之后，返回上一级
4、 进入 离线日志设置 进行如下的操作:
      (1)取消 离线日志开关  的钩钩,  然后依次点击菜单最后两行是 删除以前所有的日志 和 清除日志缓冲区。
      (2)进入 日志缓冲区类型，请勾选除最后一项“Elog日志转储”之外的所有选项，即勾选Main缓冲区，Radio缓 冲区，Events缓冲区，system缓冲区，网络日志转储，内核日志转储，QXDM日志转储。然后按  确定 ，请务必保证  QXDM日志转储  勾选上。
     (3)日志转储设为NO
     (4)完成上面的操作之后 ，重新将 离线日志开关 勾选上。
     (5)重启机器，按照你的操作步骤操作。
     (6)从/sdcard/log中把日志压缩发给我们，谢谢！

使用ADB抓取系统log
一、配置环境变量
电脑桌面上右击 计算机-->属性-->高级系统配置-->环境变量，在 系统变量 中找到path（没有可以新建一个）。点击path后再变量值的开头加上你的路径“d:adb;”，切记路径最后还要带个分号。点击确定-->确定，如此就完成了环境变量的配置。
二、抓log
将手机与电脑用数据线相连。
打开命令行（开始-->附件-->命令提示符），然后进行一下步骤：

1. 显示现在连接的手机设备：输入 adb devices  + 回车

2. 抓log：输入 adb logcat + 回车

3. 停止抓log：使用ctrl + c

4. 将log导出：adb logcat > d：1.txt（将log导出到d：/1.txt文件中

ADB工具下载地址：https://yunpan.cn/cWkyshMeDeKDf  访问密码 8a91
```
