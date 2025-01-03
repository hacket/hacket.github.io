---
date created: 2024-03-15 14:21
date updated: 2024-12-24 00:40
tags:
  - '#解锁'
dg-publish: true
---

# Magisk

## Magisk介绍

### Magisk 是如何工作的？

Xposed 通过劫持 Android 系统的 zygote 进程来加载自定义功能，这就像是半路截杀，在应用运行之前就已经将我们需要的自定义内容强加在了系统进程当中。<br>Magisk 则另辟蹊径，通过挂载一个与系统文件相隔离的文件系统来加载自定义内容，为系统分区打开了一个通往平行世界的入口，所有改动在那个世界（Magisk 分区）里发生，在必要的时候却又可以被认为是（从系统分区的角度而言）没有发生过。<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1695057497971-804c611b-5c30-468a-b68c-e3facb4f5648.png#averageHue=%23f8e8d4&clientId=u76f0c72c-5e5d-4&from=paste&height=308&id=ud284b752&originHeight=630&originWidth=1120&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=71337&status=done&style=none&taskId=uc7302a56-83df-4e85-a53d-6b18b28ee8a&title=&width=548.3333740234375)<br>Magisk 的实现方式就像是一种魔法，当被挂载的 Magisk 分区被隐藏甚至被取消挂载时，原有系统分区的完整性丝毫未损，玩需要 root 验证的游戏、运行对设备认证状态有要求的应用甚至进行需要验证系统完整性的 OTA 更新都没有任何问题。<br>因此严格来说 Magisk 可以被看作是一种文件系统，这种文件系统通过巧妙的实现方式避开了对系统文件的直接修改，从稳定性上来看要优于以往任何一种系统框架，这也是当前它在玩机社区广受认可和好评的原因所在。

## Root不能运行的App

### Root后不能运行的App

1. 建设银行
2. 就医160
3. 中国移动

### 建议隐藏Root的App：

1. MIUI的手机管家（可能需要重启手机，不然不会生效；或者杀死App）
2. 系统的App
3. 银行类的App
4. Google Play
5. Netflix
6. Pokémon Go

## 安装 Magisk

### 前提

1. 解锁BL（BootLoader）锁
2. 安装ADB环境

### TWRP 的官方支持

[[01.Root和刷机基础#TWRP]]

### 没有官方 TWRP 支持

1. 修补 boot 镜像文件
   1. 从你的刷机包中提取当前固件的 boot.img 文件，将它传入到安装了 Magisk Manager 的手机中
   2. 进入 `Magisk Manager` —— 安装（install）—— install —— 修补 boot 镜像文件
   3. 然后选择传入的 boot.img 文件进行生成，并将生成后的 Patchedboot.img 传输到电脑上。

![修补 boot 镜像文件|400](https://cdn.nlark.com/yuque/0/2023/gif/694278/1695057736418-ad2890ee-bb9a-434f-95c4-2773fcd01665.gif#averageHue=%23f0f5f0&clientId=u76f0c72c-5e5d-4&from=paste&height=651&id=u5eabe0be&originHeight=1209&originWidth=680&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=ub8214164-c1db-4846-8c58-9b132b6689b&title=%E4%BF%AE%E8%A1%A5%20boot%20%E9%95%9C%E5%83%8F%E6%96%87%E4%BB%B6&width=366.3333435058594 "修补 boot 镜像文件")

2. 使用 Magisk 应用对 boot.img 进行重新打包：
   1. 执行 `adb reboot bootloader` 进入 Bootloader 界面
   2. 执行 `fastboot boot Patchedboot.img` 来加载生成后的 boot 分区文件获取临时 root
3. Magisk Manager
   1. 进入 Magisk Manager，选择安装（install）——install——Direct Install（直接安装）才能将临时 root 转换为永久 root

![别忘了进行二次安装|400](https://cdn.nlark.com/yuque/0/2023/gif/694278/1695057907340-11611dfd-a18f-40b5-a8b1-4f5f75d1fb28.gif#averageHue=%23a49c7a&clientId=u76f0c72c-5e5d-4&from=paste&height=745&id=uf47cd999&originHeight=1201&originWidth=676&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=uae42b66d-3a3a-47a7-b3bc-e58280c2f79&title=%E5%88%AB%E5%BF%98%E4%BA%86%E8%BF%9B%E8%A1%8C%E4%BA%8C%E6%AC%A1%E5%AE%89%E8%A3%85&width=419.3333740234375 "别忘了进行二次安装")

2. [三星](https://topjohnwu.github.io/Magisk/install.html#samsung-system-as-root)、[华为](https://topjohnwu.github.io/Magisk/install.html#huawei)等特殊机型的 Magisk 安装方法参见 Magisk 官方帮助文档
3. 安装模块
   1. 安装完 Magisk 后，我们就可以通过 TWRP 或者 Magisk Manager 刷入获取到的模块了。模块的获取方式可以是 Magisk Manager 自带的模块仓库，也可以是其他第三方论坛（如酷安、XDA 等）。
4. 卸载Magisk
   1. 卸载 Magisk 最为彻底的方式就是在 Magisk Manager 中点击「卸载」、「完全卸载」，应用会自动下载刷完 uninstall.zip 卸载包、自动卸载它自己、自动重启。如果你无法进入系统，在 TWRP 中手动刷入 uninstall.zip 卸载包即可。

### Ref

- [ ] Android Root和刷机章节的Magisk
- [ ] [小米手机安装 Magisk 获取 Root 权限指南](https://miuiver.com/install-magisk-for-xiaomi/)

## Magisk 更新或修复及系统 OTA

[Android 玩家必备神器入门：Magisk 核心功能和翻车自救指南 - 少数派](https://sspai.com/post/68071)

# 用Magisk如何Root

大致步骤，具体看`刷机&Root实操`

1. 解锁BL
2. 下载ROM全量包，提取boot.img
3. 下载Magisk apk，修复boot.img，并把修复的好的img保存到电脑
4. 校验修复的boot.img
5. 刷入修复好的boot.img
6. 重启

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1700149239710-55d49c2b-0ee7-4478-b7c5-6e160a74e77b.png#averageHue=%23e8e8e8&clientId=ua6b8d910-f93f-4&from=paste&height=362&id=u8e9a755a&originHeight=644&originWidth=1120&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=131727&status=done&style=none&taskId=ud34d4e30-a900-4648-aacf-ffc98ae4613&title=&width=629)

- [ ] [Android 玩家必备神器入门：从零开始安装 Magisk](https://sspai.com/post/67932)

### 准备

#### 手机解锁了 Bootloader

##### 解锁 OEM

- 打开开发者模式

> 先找到【设置】-【关于本机】-【版本信息】-【版本号】

多次点击【版本号】直到出现提示【您已经处于开发者模式，无需进行此操作】

- 打开 OEM 解锁，开启 USB 调试模式

> 找到【OEM 解锁】和【USB 调试】并全部开启

- `adb reboot bootloader`

- 解锁：

老版本：

```
sudo fastboot oem unlock
```

新版本：

```
fastboot flashing unlock
```

#### 下载 ADB

<https://developer.android.google.cn/studio/releases/platform-tools.html>

#### 下载 Google USB 驱动程序 (windows 需要，mac/linux 不需要)

<https://developer.android.google.cn/studio/run/win-usb>

#### 手机Rom

- 安装在手机的ROM

可见：[ROM下载 - Magisk中文网](https://magiskcn.com/rom)

#### 提取boot.img

##### `payload-dumper-go`

[GitHub - vm03/payload_dumper: Android OTA payload dumper](https://github.com/vm03/payload_dumper)

- Windows：[payload-dumper-go 提取 boot（payload 提取 boot.img） - Magisk 中文网](https://magiskcn.com/payload-dumper-go-boot?ref=payload-dumper-go)

- Mac ：[Releases · ssut/payload-dumper-go](https://github.com/ssut/payload-dumper-go/releases)

执行命令：

```shell
./payload-dumper-go ../rom/payload.bin
```

![image.png|800](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316172106.png)
然后在当前目录可以看到 `boot.img` 提取出来了
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316172300.png)

##### `vm03/payload`

[GitHub - vm03/payload_dumper: Android OTA payload dumper](https://github.com/vm03/payload_dumper)

- Python

```shell
python3 payload_dumper/payload_dumper.py 66057b64768347d8b02a16f6d2ada6fd/payload.bin --out data
```

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316141709.png)

- Docker

```shell
docker run --rm -v "${PWD}":/data -it vm03/payload_dumper 66057b64768347d8b02a16f6d2ada6fd/payload.bin --out data

# rom包 66057b64768347d8b02a16f6d2ada6fd/payload.bin 
# 输出目录 --out data
```

##### Github Actions

[`GitHub - yyzq3/actions\_android\_bootimg\_payload\_dumper: 利用Github Actions解包payload.bin并提取boot.img`](https://github.com/yyzq3/actions_android_bootimg_payload_dumper?tab=readme-ov-file)

### 下载 Magisk app

- 下载安装 [GitHub - topjohnwu/Magisk: The Magic Mask for Android](https://github.com/topjohnwu/Magisk)
- 将上面提取的 `boot.img` push 到手机上：`adb push boot.img /sdcard/download`

## 修复 `boot.img`

- 选择刚刚从全量包提取出来的 `boot.img`
- `主页→安装→选择并修补一个文件` ，这里选 `boot.img`

![image.png|5900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316160432.png)

- 修复 `boot.img`，修复后在 `/sdcard/download/` 下会有 `magisk_patched-xxx.img`
- Pull 到电脑：`adb pull /sdcard/download .`
- 进入 fastboot 修复

## ~~校验修复后的 `boot.img`~~

`fastboot boot <boot 镜像文件>` 执行命令后，将会把此镜像传输至手机。手机会暂时地使用这一镜像进行启动，而不会直接将其刷入。你将会看到手机先回到带有“Fastboot Mode”字样的 Logo 界面，然后播放开机动画，进入系统。<br>注意，开机动画显示异常、开机时间比正常开机长、开机后的卡顿比正常情况长、开机后一段时间不显示锁屏等，都不是正常现象。如果出现这类情况，说明此镜像不能正常工作。

请注意区分 `fastboot boot boot.img` 和 `fastboot flash boot boot.img`。前者是试用启动，只是暂时地用镜像启动设备，而不会修改设备；后者是刷入镜像，会将镜像直接写入 Boot 分区。

```shell
adb reboot bootloader 
fastboot boot magisk_patched-27000_lidNV.img
```

Mac 上一加 ACE2V 失败了：
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316154042.png)
Windows 也失败了：
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403171529810.png)

## 进入退出 fastboot 模式

### 进入 fastboot 模式

```shell
adb reboot bootloader            # 进入 fastboot 模式
```

### 查看设备是否连上

- Fastboot devices

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699163121309-380d91c2-9a22-4f5a-9f3b-6ec35b1d0801.png#averageHue=%23471c19&clientId=ufcf389d8-88f8-4&from=paste&height=46&id=u338700d1&originHeight=92&originWidth=814&originalType=binary&ratio=2&rotation=0&showTitle=false&size=121939&status=done&style=none&taskId=u74f3ce31-db51-4107-918b-120e24a3b05&title=&width=407)

- 看到此时的手机设备状态是锁着的【DEVICE STATE - locked】

```shell
 fastboot flashing unlock #解锁 BL
```

- 如果 `waiting for any device` ，就是 usb 驱动需要更新

手机进入 fastboot mode，如果出现执行 fastboot devices 命令没有设备信息显示的情况，这种情况基本和手机软件没有关系，基本都是 PC 环境所导致，一般是 fastboot 驱动安装问题（和 ADB 驱动程序不是一个东西），也有由于 fastboot. Exe 工具版本太旧导致无法检测到设备的情况。
在 Windows电脑的设备上查看
![|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1699181490564-fd596142-9e7b-41d0-872f-3ba91f89c893.png#averageHue=%23f4eeea&clientId=u102042b3-75e6-4&from=paste&id=u0a78f4e7&originHeight=116&originWidth=158&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u66b62675-fbce-4c36-9bcc-88aa248abf0&title=)
可以下载个驱动精灵更新驱动
![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1699182666641-3efe5333-bec3-4d82-98b4-1a2adb4ce115.png#averageHue=%233ccd1c&clientId=u102042b3-75e6-4&from=paste&height=181&id=u0c402498&originHeight=447&originWidth=1363&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=111010&status=done&style=none&taskId=ue8704098-bff8-4546-b129-3595d85e067&title=&width=551)<br>更新后<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1699182819212-7ee0ae52-074e-48cd-bb25-b911653a29af.png#averageHue=%23f1f0f0&clientId=u102042b3-75e6-4&from=paste&height=69&id=u720b4143&originHeight=103&originWidth=423&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=9914&status=done&style=none&taskId=u39dcfb88-d7a8-4569-9a71-6937c38241a&title=&width=282)<br>再次执行 fastboot devices<br>![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1699182835008-c065624b-e600-433c-8fff-999f12d4b626.png#averageHue=%231b1b1b&clientId=u102042b3-75e6-4&from=paste&height=52&id=udec08df3&originHeight=78&originWidth=423&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1991&status=done&style=none&taskId=uccfcb719-1089-471c-9f5d-a23022070a1&title=&width=282)
**退出：**<br>按住 `电源键` + `音量+` 键 10秒后退出

## 刷入修复后的 `boot.img`

```shell
fastboot flash boot magisk_patched-26300_Z 5 mKN.img
```

## 遇到的问题

### 问题 1：BL 锁未解锁

如果出现下面这样的，就是没有解锁 BL，需要解锁 BootLoader
![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699184067966-3015a361-f84f-4c09-b03b-5898e5014727.png#averageHue=%23181818&clientId=u102042b3-75e6-4&from=paste&height=84&id=u40c6ea78&originHeight=126&originWidth=1267&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=6529&status=done&style=none&taskId=ucf07282f-85a9-40fe-9b82-e4d9ee72067&title=&width=844.6666666666666)<br>成功后：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1699186559749-1ff5d4cb-cd4f-4436-9f66-58b5cbbf6e98.png#averageHue=%23161616&clientId=u9789818a-f1f1-4&from=paste&height=84&id=u14163ae4&originHeight=126&originWidth=1326&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=6037&status=done&style=none&taskId=u62572082-3df3-4597-91fd-0aa3cf15b3c&title=&width=884)

- fastboot reboot 重启设备；或者长按 `电源键` + `音量+`

```shell
fastboot reboot
```

- 判断是否 Root 成功，就看 **`Magisk 当前的版本号`** 是否有

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316160636.png)

### 问题 2： usb_read failed with status e 00002 ed ERROR

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316164620.png)

> 查阅很多资料有说 USB 线不好用或者是 U 口有问题等等，经换线、换电脑、换操作系统的排查发现均不是以上问题。后怀疑应该是刷机包本身有问题或者版本不匹配造成

解决：进入 `fasstbootd` 模式

```shell
# 一加ACE2V 演示
adb reboot bootloader
fastboot reboot fastboot
fastboot boot magisk_patched-27000_1HVrn.img # Magisk修复后的boot.img
fastboot reboot
```

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240316193607.png)

> 会把用户的数据清空，谨慎操作

重启后重新下载 Magisk APP 就是已经 Root 的了

# [[Magisk]] 模块

[[Magisk模块]]

# 升级系统保留 Magisk Root

以 `一加Ace2V` 为例演示手机升级系统保留 magisk 完美 root 权限：

### 查看是否支持 A/B 分区

- `adb shell getprop ro.build.ab_update`
- `adb shell getprop | get treble`
- 查看当前分区：`adb shell getprop ro.boot.slot_suffix`

### 步骤

![image.png|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403171130506.png)

![image.png|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403171130660.png)

# 其他

## Magisk 模块开机无法启动，如何自救？

安装模块后手机出现应用闪退、显示错误和无法开机等种种异常，大概率是使用的某个模块出了问题。

救砖思路：

- 有救砖模块会自己救砖

- 没有救砖模块，进行 Recovery 模式，如 TWRP，进入 Magisk 模块目录 `data/usb/modules`，删除模块

- 如果还能访问 Magisk App，在模块界面中，「移除」出问题的模块，然后重启以完全卸载此模块

- 如果已经无法打开 Magisk App，但能使用 adb，用数据线连接电脑，输入 `adb wait-for-device shell magisk --remove-modules`，这会删除所有模块并重启

- 如果连 adb 都不能访问，那么请尝试进入安全模式。不同机型安全模式启用方式不同：开机状态下，比较常见的启用方式是按住电源键呼出的重启按钮；关机状态下，一般能通过特定的实体按键激活。进入安全模式后，Magisk 会自动禁用所有模块。再重启一次，模块禁用的状态会被保留，设备应当能恢复正常。

- 如果装有第三方 Recovery，利用 Recovey 的文件管理功能（高级 > 文件管理），定位到 `/data/adb/modules`，将其中的问题模块重命名为「remove」，Magisk 会在重启时自动卸载该模块。更简单粗暴的方式是直接删除该目录下问题模块文件。如 TWRP ![image.png|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidianobsidian202403170105472.png)

- 装有第三方 Recovey 时，我们还能将 Magisk. Apk 重命名为 `uninstall.zip`，在 Recovery 下刷入，这可以完全卸载 Magisk

- **Magisk 检测到手机进入安全模式之后，就会自动禁用所有模块：[Android 11 刷入 Magisk 模块后无法开机的解决方法 - 搞机男](https://www.gaojinan.com/android-11-magisk-cant-boot-solve.html)**

Ref

- [一日一技 | Magisk 模块「翻车」，没有 TWRP 如何救砖？ | 码农网](https://www.codercto.com/a/116462.html)
- [刷 Magisk 模块手机「变砖」了？这三款工具能帮你救急 - 少数派](https://sspai.com/post/57320)

## 刷入 `boot.img` 不能开机

如果刷入 **magisk.img** 不能开机，可以把前面提取的 **boot.img** 通过 **fastboot** 刷回去，恢复原 boot，一般都能正常开机！\
**boot.img** 保留一份在电脑，避免出问题了可以自救下！还原 boot 指令

```shell
fastboot flash boot boot.img
# boot.img为原始ROM的boot.img，不是通过Magisk修复后boot.img
```
