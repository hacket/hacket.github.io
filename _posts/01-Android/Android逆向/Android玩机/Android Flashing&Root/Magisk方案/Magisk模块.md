---
date created: 2024-03-17 01:34
date updated: 2024-12-24 00:40
dg-publish: true
---

# 必装 Magisk 模块

## LPosed 模块

[[LSPosed]]

## 救砖

### 自动救砖模式3合1

【作用】当刷入一些模块导致无法正常开机时，自动触发已设置的自动救砖操作方式：1.如果在重启2次后未成功开机将自动清除系统包名缓存和关闭 SELinux 尝试一次开机操作。 2.如果再无限重启3次后未开机强制自动救砖重启到 recovery。 3.正常启动等待1.5分钟后没有开机自动禁用所有模块。

- [下载](https://downloads1.suchenqaq.club/magisk_module/system_optimization/%E8%87%AA%E5%8A%A8%E6%95%91%E7%A0%96%E6%A8%A1%E5%BC%8F3%E5%90%881.zip)

![[自动救砖模式三合一.zip]]

### 神仙自动救砖-双防版 v 35

自动救砖条件：系统连续重启到3次或卡在开机界面1.5分钟(每次升级系统时将自动延长时间至6分钟)，将禁用所有模块。若再不开机会执行APP解冻救砖模式再开机，已为您自动救砖：2次。

- [Magisk 模块-神仙自动救砖-双防版 提取码：yshd](https://pan.baidu.com/s/1r41KlnEMIqT23D9A-VFOKA?pwd=yshd)
- [自动神仙救砖-支持OTA稳定版](https://downloads1.suchenqaq.club/magisk_module/tool/%E8%87%AA%E5%8A%A8%E7%A5%9E%E4%BB%99%E6%95%91%E7%A0%96-%E6%94%AF%E6%8C%81OTA%E7%A8%B3%E5%AE%9A%E7%89%88v35.zip)

![[自动神仙救砖支持OTA稳定版v35.zip]]

#### 自动神仙救砖-支持 OTA 稳定白名单版 v 4-等待重启中

![image.png|230](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403190826415.png)

- [下载](https://downloads1.suchenqaq.club/magisk_module/system_optimization/Magisk%E6%A8%A1%E5%9D%97-%E7%A5%9E%E4%BB%99%E8%87%AA%E5%8A%A8%E6%95%91%E7%A0%96-%E6%94%AF%E6%8C%81OTA%E7%A8%B3%E5%AE%9A.zip)

![[自动神仙救砖-支持OTA稳定白名单版v4-等待重启中.zip]]

### MM

- [`Rikj000/Magisk-Manager-for-Recovery-Mode`](https://github.com/Rikj000/Magisk-Manager-for-Recovery-Mode)

在Recovery模式中对magisk模块进行管理，mm管理器可以在手机不开机时进入recovery模式终端中对magisk模块进行查看停用卸载。

按手机 `音量上+开机键` 进入第三方 recovery 模式(不同手机进入方法可能不一样)，找到终端, 进入在终端中输入 `*/mm` ，然后提示操作即可。

注意：有些官方的 Recovery 的终端（如 `一加ACE2V`，也不支持刷入三方 Recovery 如 TWRP），这种就没法用 MM 了

![[MagiskManagerForRecovery_v9_202312060.zip]]

### 救砖必备神技之使用音量键进入 edl(9008)

[小米社区](https://web.vip.miui.com/page/info/mio/mio/detail?postId=2531270&app_version=dev.20051)

### 音量键极速救砖

主：在开机1秒后三击音量+触发 magisk 核心模式并禁止所有模块，三击音量-触发 XPosed 模块禁用功能，副：在禁用模块重启后第二次将对应用卸载，伪装，误禁用组件，误冻开始全面恢复，是否生效可通过爱玩机 Magisk 模块管理-智能救砖查看次数，若多次重启为0则模块无效！

[下载](https://downloads1.suchenqaq.club/magisk_module/tool/%E9%9F%B3%E9%87%8F%E9%94%AE%E6%9E%81%E9%80%9F%E6%95%91%E7%A0%96_19011.zip)

## `Sytemless hosts & EnergizedProtection` 系统级去广告利器：

Magisk Manager 在设置中有 `Systemless hosts` 的选项，点击后会生成一个同名模块。Hosts 文件一直深居系统分区，这个模块的作用就是无损系统地修改 hosts 文件，使得一些依赖 hosts 方式去广告的应用也能正常使用。

### EnergizedProtection

EnergizedProtection 则是一款依赖 hosts 的去广告模块。行迹互联网多年的老用户可能已经对各种侵入式广告、恶意软件、跟踪器感到厌烦，那么不妨试试看这款模块，它会将收录的广告地址通过 hosts 文件指向到 `0.0.0.0`，从而起到全局屏蔽广告的效果。
![image.png|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidianobsidian202403170054181.png)

## Shamiko ：隐藏 Root

Magisk 自 `v24.0` 版本起去除了 `Magisk Hide` 功能。如果要对软件隐藏 Root，现在比较好的方法是使用 `Shamiko` 模块

### `隐藏 Magisk 应用`（开启面具随机包名）

`打开 Magisk，主页→设置，列表下滑至隐藏 Magisk 应用`，点击该选项，弹出授予应用安装权限，然后修改包名，可以修改为非 root 敏感包名，如 Mask，修改完后按照提示安装

> 有时安装失败，可能需要科学网络环境；

小米手机若出现反复安装失败，需要到开发者选项中下拉至底部，关闭 MIUI 优化，再次操作即可（应该是 MIUI 的 bug）
在系统更新时记得先关闭随机包名，再更新系统，否则有可能出现更新系统后打不开 magisk，若忘记关闭，直接卸载 magisk，再重新下载安装包安装即可，配置的模块，设置等数据重新获取 root 后不会消失

### 启用 `Zygisk` 选项

打开 Magisk 软件，点击右上角设置图标，开启 Zygisk 选项（开启后先不要重启，等下面安装 Shamiko 后一块重启）。
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056330322-0ea9021b-f301-4640-a1b0-44053bae09f9.png)
备注：Magisk 设置里的“遵守排除列表”选项注意不要开启，它与 Shamiko 模块功能冲突。

### 安装 Shamiko 模块

1. 下载 [ Shamiko](https://github.com/LSPosed/LSPosed.github.io/releases) 模块，整个 zip 到手机就行，不用解压 ![[Shamiko-v1.0.1-300-release.zip]]
2. 在 Magisk 模块界面点击从本地安装，选择 Shamiko 模块文件，安装后重启手机

![|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056560256-399c17d6-dd99-4b1a-a9af-ac4309d5b0c6.png)

3. 之后检查 Zygisk 是否正常开启，以及 Shamiko 模块是否正常运行。

![|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056589760-528790bb-6674-4479-aa9e-e58ca42f85fd.png)

### 配置排除列表：对软件隐藏 Root

1. 先关闭运行中的，要隐藏 Root 的 App
2. 点击 Magisk 软件右上角设置图标，点击“配置排除列表”

![|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056651493-070506a5-4e8d-4fff-88cd-c1879bbd2054.png)

3. 选择要隐藏 Root 的软件（如果找不到软件，点击右上角菜单，选中“显示系统应用”和“显示操作系统”）

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056679622-5dde9147-637a-41ee-b25b-711a33c44631.png)

4. 正确添加方法：先点击软件图标展开软件所有进程，再勾选，确认已选择软件的所有进程

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695056716218-32176fd2-ca49-4e2e-9c50-18bfcb193224.png)

5. 设置后，返回 Magisk 主界面，关闭 Magisk 软件，这时就可以测试隐藏效果了
6. 记得隐藏 Magisk 应用
7. 如果隐藏后遇到提示支付环境风险问题，这是因为手机管家检测到 Root，同时对手机管家隐藏 Root 即可解决。

### 部分软件还能检测 Root：LSPosed：`隐藏应用列表`

隐藏 Magisk（面具）后，此时大部分的软件都已经检测不到 root，但是还有一部分顽强的软件还是可以检测到 root 十分顽强<br>下载 Zygisk 版本的 LSPosed，用面具刷入，重启手机<br>![|400|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058345352-8ebcaffc-077b-410a-9194-15ff7093035f.webp)
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058370167-fd5fe609-a0a0-4588-94d6-16ff4511c4cb.webp)<br>然后打开 `隐藏应用列表` 模块，点击检测测试下载测试软件，后面需要用到和点击安装 magisk 插件，选择 Zygisk，安装成功后，重启手机<br>![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058476357-485b1695-b0c8-401d-aff5-103a9980710a.webp)
然后点击模板管理，创建黑名单模板，填写以下可能被检测到的 maps 规则
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058512486-69365f22-ebad-4ac6-b789-f4dd868c3361.webp)<br>如下图将规则复制粘贴：

```dart
magisk

root

lsposed

edxposed

xposed

qn_dyn_lib

qn_mmkv

org.meowcatedxposedmanager

org.lsposed.manage

manager

com.topjohnwumagisk

magisk manager
```

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058553932-c49ccadd-48a8-4a90-837d-566b9d7fe548.webp)
然后然后点击隐藏应用，勾选带有 root 权限的所有软件
![|230](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058579225-cd32c8d6-fdd9-4cec-8d9a-a5e320d370cc.webp)<br>保存刚才设置好的规则
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058606855-c1f6450a-d027-44fb-a8d9-4188bcd2b00d.webp)
选择你要隐藏 root 的软件，按照下面的图片并且保存选择刚才设置好的规则模板，保存即可。
![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1695058636198-39fccffc-4b8a-4627-bdc1-8b89c0546a0f.webp)<br>还要注意的是，那个工作模式不要盲目选择所有隐藏方式，容易让某些软件直接崩溃下面打开测试软件，我们会发现，没有被检测到 root，这样说明很多软件都不会被检测了，可以正常使用。

> 还要注意一点 Zygisk 不能和 riru 系列的模块共存，安装 riru，Shamiko 模块就会不工作，如果你想用 riru 系列模块又想隐藏 root 建议会退 magisk 23.0 即可

## 抓包

### movecert

将用户证书放到系统证书中去

模块下载地址:  <https://wwfi.lanzouj.com/iF3FH1mama8j>

- [关于 HTTPS 抓包， Android 14 据说改不了根证书了 - V2EX](https://v2ex.com/t/972949)
- [解决安卓14的抓包证书模块](https://zhaoxincheng.com/index.php/2024/01/25/%E8%A7%A3%E5%86%B3%E5%AE%89%E5%8D%9314%E7%9A%84%E6%8A%93%E5%8C%85%E8%AF%81%E4%B9%A6%E6%A8%A1%E5%9D%97/?btwaf=14412087)
- [GitHub - zhaoboy9692/movecert: movecert](https://github.com/zhaoboy9692/movecert)

# 可选

## 太极

[[太极]]
