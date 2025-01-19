---
date_created: Friday, February 23rd 2018, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:54:03 am
title: Android Studio
author: hacket
categories:
  - Tools
category: DevTools
tags: [IDE]
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
date created: 2024-03-13 22:04
date updated: 2024-12-23 23:22
aliases: [Android Studio 基本设置]
linter-yaml-title-alias: Android Studio 基本设置
---

# Android Studio 基本设置

## Version Control

### git 没有显示 Local Changes 界面

`Setting -> Version Control-> commit -> 把 use non-modal commit interface` 的勾去掉，如下图所示

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240906142434.png)

## Editor

### Code style

1. 设置 Tab 空格数，按语言来设置

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1694833457332-5d94afe6-39f6-4d18-bb1b-c0a2805c137a.png#averageHue=%235a675a&clientId=ub2d1ab10-e33c-4&from=paste&height=712&id=u790149bc&originHeight=1424&originWidth=2024&originalType=binary&ratio=2&rotation=0&showTitle=false&size=267110&status=done&style=none&taskId=ufe7a54fd-0a91-40ed-89f1-99a2a87b9dc&title=&width=1012)

2. 格式化缩进 4 个空格变成 8 个空格

转到 settings->editor->code style, 进去 general，然后取消选中 "enable EditorConfig support".<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1694833517685-6750427b-7948-44a8-b555-60e86866b24b.png#averageHue=%232f3236&clientId=ub2d1ab10-e33c-4&from=paste&height=712&id=ub570e7c9&originHeight=1424&originWidth=2024&originalType=binary&ratio=2&rotation=0&showTitle=false&size=238595&status=done&style=none&taskId=u186ffc97-6e16-4cfb-b286-388f8ccdf36&title=&width=1012)

## 新版 Logcat

### 界面

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1693314522561-a8add46c-e36c-4d57-9c2e-375abb378a87.png#averageHue=%23424437&clientId=ua190187f-bb82-4&from=paste&height=233&id=ud241c27f&originHeight=466&originWidth=1280&originalType=binary&ratio=2&rotation=0&showTitle=false&size=590849&status=done&style=none&taskId=ud16c90fd-5850-4d5a-87fa-05f8fc74572&title=&width=640)

### [使用键值对搜索查询日志](https://developer.android.com/studio/debug/logcat?hl=zh-cn#key-value-search)

1. 包名/进程名
   - Package:xxx
   - Package: mime 当前调试的 app
2. Log Tag
   - Tag:xxx
3. 日志级别：verbose/debug/info/warn/error/assert 六种级别
   - Level:debug
4. 内容：支持模糊搜索
   - Message:xxx
5. 时间：关键词 age，我们可以通过这个关键词对日志以时间纬度进行一定的筛选；筛选时间指的是以电脑时间对日志的时间进行筛选

| 单位 | 介绍 |
| -- | -- |
| s  | 秒  |
| m  | 分钟 |
| h  | 小时 |
| d  | 天  |

- Age: 10 m 筛选 10 分钟内的所有日志

6. 多选
   - logcat 筛选框中，如果同时输入多个条件，默认情况下不同类型的筛选，是且的关系，如：`message:level level:warn`
   - 如果是相同类型的筛选，则默认是或的关系，如：`message:level message:info`
   - 如果相同类型仍然进行且的筛选，则我们需要改一下筛选条件，如：`message:level & message:warn`
   - 多选：或满足 message 中包含 level 或者日志等于大于等于 warn 的才显示：如 `message:level | level:warn`
7. 复杂场景组合

我想监控从 A 应用点击按钮开始，跳转到 B 应用页面的完整日志流程，其中就包含了多种条件的组合。

- 进程名为 com.Xt.Appplugin (应用 A)，system_server (系统应用) 或 com.Xt.Client (应用 B)
- Tag 为 lxltest 或者 Activity
- 日志级别为 debug

`(process:system_server | process:com.xt.appplugin | process:com.xt.client) & level:debug & (tag:lxltest | tag:Activity)`

8. 否定和正则表达式

以下字段支持否定和正则表达式匹配：tag、package、message 和 line。

- 否定的表示方式是在字段名称前面加上 -。例如，-tag: MyTag 匹配 tag 不包含字符串 MyTag 的日志条目。
- 正则表达式匹配通过在字段名称中附加 ~ 来表示。例如 tag~: My.*Tag。
- 否定和正则表达式修饰符可以结合使用。例如，-tag~: My.*Tag。

## AS 编辑窗口最大数目限制修改 (默认 10 页)

android studio 打开的页面数<br>用 android studio 看系统源码的时候，发现 android studio 打开的代码窗口数最大只有 10 个<br>![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793408754-74af0677-ddd6-46c7-80f1-fecc0b516244.png#averageHue=%23e7eaed&clientId=uab4f5bee-94f2-4&from=paste&id=ub06157d7&originHeight=988&originWidth=1424&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=udcc0acf4-a1b3-4a36-ab30-9d698a967ab&title=)

## Mac OS 上用命令行通过 AS 来打开 Android 项目

可以在 `~/.bash_profile` 或 `~/.zshrc` 文件中加上一句脚本，然后可以用 AndroidStudio 命令代替 `open -a /Applications/Android\ Studio.app` 命令

```
# Android Studio 打开命令
alias as="open -a /Applications/Android\ Studio.app"
```

如果是 zsh

```
source ~/.zshrc
```

举例子，clone 一个项目，直接命令行用 as 打开

```
git clone git@github.com:Gurupreet/ComposeCookBook.git
as .
```

## Editor-fold 和 region As 中折叠代码块

### editor-fold

```kotlin
//<editor-fold defaultstate="collapsed" desc="重置选中的数据">
fun resetSelectInfo() {}
//</editor-fold>
```

快捷键：`ctrl+option+t`，选择 `<editor-fold> Comments`

### region

```
//region 你好
override fun onDestroy() {
    super.onDestroy()
    toast("binding==null(${getBinding() == null}), binding.name==null(${getBinding().name == null})")
}

override fun init(binding: ActivityViewBindingHelloWorldBinding) {
    binding.name.text = "ViewBinding name"
    binding.button.setOnClickListener {
        toast("ViewBinding button toast")
    }
}
//endregion
```

快捷键：`ctrl+option+t`，选择 `region Comments`

## Android Studio settings

![[settings_mac_2024-03-26.zip]]

## Android Studio 技巧

### Android Studio 查看不了三方 kotlin 库源码

问题：点击看不到源码, `Download Sources` 也没用

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240313220628.png)

解决：

1. 先下载库源码 [Release sdk-version-16.0.0 · facebook/facebook-android-sdk · GitHub](https://github.com/facebook/facebook-android-sdk/releases/tag/sdk-version-16.0.0)
2. Choose Source：选择下载好的源码

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240313220729.png)

3. 选择 Roots，就可以查看源码了

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240313220745.png)

### 自定义搜索 Scope

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688198726953-93721480-cb8d-4f66-86a5-813583859af0.png#averageHue=%233b423a&clientId=ub869a14d-aa4a-4&from=paste&height=385&id=u19b5e869&originHeight=653&originWidth=809&originalType=binary&ratio=2&rotation=0&showTitle=false&size=378637&status=done&style=none&taskId=ue5f567f2-f89e-4e8d-a0aa-fb9a77a36d9&title=&width=477.5)

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688198812112-63c2934d-e109-401a-9f6e-eabf849ad58c.png#averageHue=%233c3f42&clientId=ub869a14d-aa4a-4&from=paste&height=289&id=u93a579e8&originHeight=440&originWidth=731&originalType=binary&ratio=2&rotation=0&showTitle=false&size=222508&status=done&style=none&taskId=u2886a66b-46ba-4866-9141-f07ad672c5d&title=&width=479.5)<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688198838037-1264f623-93aa-4b81-b068-37ca2c17c9df.png#averageHue=%233c4146&clientId=ub869a14d-aa4a-4&from=paste&height=294&id=u773d49c5&originHeight=445&originWidth=728&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171278&status=done&style=none&taskId=u239d702a-b64c-4baa-9476-7def004d30e&title=&width=481)<br>**案例：** 搜索 Glide 库中的采样率 inSampleSize

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688199857188-af47c89d-b757-4873-bb9a-e919e5da457f.png#averageHue=%232f3235&clientId=ub869a14d-aa4a-4&from=paste&height=281&id=u185f7613&originHeight=924&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=144694&status=done&style=none&taskId=u1d314863-5952-483b-9222-c820aca799e&title=&width=487)

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1688199918995-44e617e8-c04d-468e-96be-b641d645dcda.png#averageHue=%23537347&clientId=ub869a14d-aa4a-4&from=paste&height=297&id=ucc0ca121&originHeight=984&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=320144&status=done&style=none&taskId=ufd3cdfc8-cf98-48d9-8a20-692f6de1647&title=&width=489)

- [x] [Android Studio - File in Path 搜索你想要的](https://www.jianshu.com/p/247f4d9e63af)

### 改 Manifest 的 package name

改了 Manifest 的 package name，主要会涉及 2 个地方的修改

- R 文件的导包
- BuildConfig 的导包�
- Manifest 组件的 name 导包

**R 文件的导包修改：**

1. 在项目的根目录 `右键→Replace in Path`

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684832482836-2a5b2432-6fae-47e1-aa69-ce4bd58da8a0.png#averageHue=%233f454c&clientId=ue60cdbe4-6b24-4&from=paste&height=299&id=u91ab4685&originHeight=598&originWidth=1050&originalType=binary&ratio=2&rotation=0&showTitle=false&size=253301&status=done&style=none&taskId=u05c59a67-11a4-423d-b6c5-fea8384d21b&title=&width=525)

2. 替换

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684832583315-439313a6-e0fa-41cc-a36e-68bc4311d087.png#averageHue=%23303234&clientId=ue60cdbe4-6b24-4&from=paste&height=417&id=u5e49d51b&originHeight=834&originWidth=1996&originalType=binary&ratio=2&rotation=0&showTitle=false&size=178271&status=done&style=none&taskId=ue5569fe6-dcd5-424c-a878-a76710e0684&title=&width=998)<br>**Manifest 的导包修改：**

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684832692890-16737410-21cc-4d01-98ff-a06e688ca295.png#averageHue=%232f2e2d&clientId=ue60cdbe4-6b24-4&from=paste&height=572&id=ub9f1b455&originHeight=1144&originWidth=2082&originalType=binary&ratio=2&rotation=0&showTitle=false&size=366431&status=done&style=none&taskId=u90fdc53a-99e0-452c-8917-6836e1f5f5e&title=&width=1041)

### 当前源码引用外部仓库时看不到 git 信息

需要将外部仓库的 git root 信息加到 Android Studio 中<br>**解决 1：**`./idea/vcs.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="VcsDirectoryMappings">
    <mapping directory="" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_account_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_addcart_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_address_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_basic_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_buyers_show_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_cart_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_cart_api_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_cashier_desk_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_ccc_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_component_promotion_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_coupon_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_customer_service_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_dynamic_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_gals_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_giftcard_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_global_configs_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_goods_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_goods_detail_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_guide_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_http_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_httpdns_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_language_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_live_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_main_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_message_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_order_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_outfit_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_payment_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_point_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_router_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_search_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_security_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_setting_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_trail_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_user_platform_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_userkit_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_wallet_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_welcome_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_wing_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_wish_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../si_zebra_android" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/../suikit_android" vcs="Git" />
  </component>
</project>
```

**解决 2：** 将红色框目录加进来<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1683805329924-d4b84470-671f-4ede-b98f-08a271e872f6.png#averageHue=%23404347&clientId=udd49e997-8363-4&from=paste&height=700&id=u1344c33c&originHeight=1400&originWidth=2020&originalType=binary&ratio=2&rotation=0&showTitle=false&size=380594&status=done&style=none&taskId=u157fd1ef-4d95-45db-b8da-7a0ac587516&title=&width=1010)

### 设置 Android Studio 在保存时自动对代码进行格式化

路径：`File - Settings - Tools - Actions on Save`

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684894432509-9133a544-d7b2-4441-9ba8-37c0449dcdac.png#averageHue=%233f4244&clientId=uf577d57a-2374-4&from=paste&height=331&id=u11a1d218&originHeight=662&originWidth=1844&originalType=binary&ratio=2&rotation=0&showTitle=false&size=96210&status=done&style=none&taskId=u029325df-1135-4993-a92f-f9fe74be242&title=&width=922)

- Reformat code 格式化代码
- Optimize imports：对引用的清理也非常需要，否则会遗留一堆无用的引用。但也会带来一些不便，就是反复尝试一些代码端时，需要来回重新 import。
- Rearrange code （建议禁用。若开启，会导致 XML 中组件顺序被调换）
- Run code cleanup

#### 去掉自动格式化

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241203162907.png)

### Android Studio Debug 调试技巧

[Android Studio调试技巧.pdf](https://www.yuque.com/attachments/yuque/0/2023/pdf/694278/1695657255598-275bd8ab-3d2f-4ef6-9154-1902e4b93996.pdf)

### 变量访问或修改时 debug

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793483811-bf7c1208-c886-48a9-9cc1-bf165ad11993.png#averageHue=%233e4346&clientId=uab4f5bee-94f2-4&from=paste&id=u70f1ed3c&originHeight=505&originWidth=922&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u27c479c4-1be9-4fd1-94ed-d1cd69f92f7&title=)<br>你所不知道的 Android Studio 调试技巧

> <http://www.jianshu.com/p/011eb88f4e0d>

#### Application 启动时需要 Debug 应用

##### ADB Idea 插件

适用于自己启动 APP<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1685369105978-7c645baa-0202-44d9-b104-7252ba3a3de1.png#averageHue=%239eaca4&clientId=udb1439ea-8425-4&from=paste&height=408&id=u3d5e2342&originHeight=1278&originWidth=1350&originalType=binary&ratio=2&rotation=0&showTitle=false&size=335056&status=done&style=none&taskId=uf1c9d2b4-8983-49aa-97bb-586423cb1b5&title=&width=431)

##### 代码方式：` android.os.Debug.waitForDebugger();  ` 代码到工程中的指定位置

适用自己启动 APP 或三方启动 APP<br>添加 android.Os.Debug.WaitForDebugger (); 代码到工程中的指定位置，进程启动后，在 Android Studio 点击 Attache Debugger to Android Process 即可。

##### 开发者模式：选择调试应用

如果三方启动 APP，如 deeplink，applink 等，ADB Idea 插件就不适用了，代码方式可以

1. 打开开发者模式，择调试应用并打开等待调试程序

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1685368938513-c039dfe2-b6ef-4af4-b541-0c63d2537766.png#averageHue=%23f5f1f1&clientId=udb1439ea-8425-4&from=paste&height=408&id=u46827631&originHeight=1558&originWidth=874&originalType=binary&ratio=2&rotation=0&showTitle=false&size=307158&status=done&style=none&taskId=u27ab8075-0971-4bf2-bfb7-f42d9063c00&title=&width=229)

2. 重启应用后，即会显示如下界面：

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1685369047131-44578bba-7c1c-4e62-af00-808c812fe098.png#averageHue=%23c4c4c4&clientId=udb1439ea-8425-4&from=paste&height=400&id=u92e9cb10&originHeight=800&originWidth=450&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58809&status=done&style=none&taskId=u61154c4b-609e-46e1-be8e-05d723091f2&title=&width=225)

3. 在 Application 中选择断点，然后在 Android Studio 点击 Attache Debugger to Android Process 即可。

#### Adb 设置等待调试应用

等待调试有 2 种方式：

- 方法 1：「开发者选项 - 选择调试应用」的方式来调试应用启动阶段代码。具体方式为 `「选择调试应用」-> 「运行应用」-> 「Attach To Process」`，然后等待断点执行即可。
- 方法 2：使用 adb 命令 `adb shell am set-debug-app -w --persistent 包名`

##### 设置 APP 启动时等待 debugger

**单次 wait debugger**

> Adb shell am set-debug-app -w me. Hacket. Assistant. Samples

- Set-debug-app 用来应用为 debug 模式
- -w 意思为 wait，在进程启动的时候，等待 debugger 进行连接
- Me. Hacket. Assistant. Samples 代表想要调试的应用的包名或 ApplicationId

执行上面的命令，当我们再次启动目标应用时会出现等待的页面，需要在 AS 中 `Run—> Attach Debugger to Android Process` 来绑定进程 debug，然后会进入到 APP 的断点处<br>**持久化 wait debugger**

> Adb shell am set-debug-app -w --persistent me. Hacket. Assistant. Samples

—persistent 意思是持久的，意思是一直设置这个应用为调试模式，即每次开启（进程创建）都会弹出对话框，即使卸载再安装或者更新应用

##### 清除调试应用

> Adb shell am clear-debug-app

执行这个命令后会清除 `选择调试应用` 和 `等待调试程序` 选项

![image.png|300](https://cdn.nlark.com/yuque/0/2023/png/694278/1686216084516-a1da6b8f-5a65-4d13-8f9e-bf2e0287fa34.png?x-oss-process=image/format,png#averageHue=%23f1f1f1&clientId=u1d859792-3a07-4&from=paste&height=467&id=u1e82c9fe&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=10368850&status=done&style=none&taskId=u57b389ef-5eb9-4ec4-b288-885fd372e29&title=&width=210)

## Android Studio 的坑

### Android Studio Debug 时提示 Method breakpoints may dramatically slow down debugging

**问题描述：**<br>Android Studio 打了断点开始调试时，提示：`Method breakpoints may dramatically slow down debugging`，而且非常卡，没法操作<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684390667132-ab76593d-8300-406b-9da0-882158cf6324.png#averageHue=%23efeeee&clientId=u319e552a-ce72-4&from=paste&height=76&id=u95f81202&originHeight=120&originWidth=671&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15124&status=done&style=none&taskId=uec6ccc70-8441-46b1-ac9f-391a630514c&title=&width=422.5)<br>解决：去除 Java/Kotlin 的 method breakpoints.

- 去掉 Java Method Breakpoints

Turn off the method breakpoints. You can see all your breakpoints through Run | View Breakpoints (Ctrl - Shift -F 8 )<br>![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684390711384-3132cc74-7b13-4352-8cfe-355bac46f5d3.png#averageHue=%23404651&clientId=u319e552a-ce72-4&from=paste&height=121&id=u9b6a0156&originHeight=242&originWidth=415&originalType=binary&ratio=2&rotation=0&showTitle=false&size=19853&status=done&style=none&taskId=u73193a35-eade-48ed-8c87-5fca75b8476&title=&width=207.5)

- 去掉 `Kotlin Function Breakpoints`

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1684390634528-a0ecd32d-6bf3-49f3-91a0-9a3d88afacfa.png#averageHue=%23384737&clientId=u319e552a-ce72-4&from=paste&height=124&id=u62d19324&originHeight=378&originWidth=1682&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140349&status=done&style=none&taskId=u0642584f-4810-4e52-9e2f-bcb6933199b&title=&width=552)

# AS 设置三种 Templates

## Postfix Completion 后缀模板 (系统默认，不能修改)

Editor→General→Postfix Completion

## Custom Postfix Templates 自定义后缀模板（第三方插件，可自定义规则）

> 科学上网，Custom Postfix Templates 设置会卡住

### Edit the templates 自定义插件模板定义

入口：快捷键：`Alt+Shift+P` 快速调出编辑脚本或 `Tools→Custom Postfix Templates→ Edit Templates for Current Language`

路径: `~/Library/Application Support/AndroidStudio4.0/intellij-postfix-templates_templates/templates/kotlin` 每个语言一个目录

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793620628-26394346-4714-4fd2-a741-947f5a3fca6d.png#averageHue=%23282121&clientId=uab4f5bee-94f2-4&from=paste&id=u97efc8c4&originHeight=485&originWidth=1015&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9403e462-75e9-4c94-9f13-1ceca9299ae&title=)<br>语法：

```
.TEMPLATE_NAME : TEMPLATE_DESCRIPTION
    TEMPLATE_RULE1
    TEMPLATE_RULE2
    // ...
```

### MATCHING_TYPE  类型匹配（每种语言的不太一样）

##### Java 类型

In Java the MATCHING_TYPE can be either a Java class name or one of the following special types:

##### Kotlin 类型

In Kotlin the _MATCHING_TYPE_ has to be `ANY`.

### TEMPLATE_CODE

#### 特殊变量

1. `$expr$` 应用该 template 的表达式自身
2. `$END$` 光标最后的位置

#### 自定义变量和用户交互

```
$NAME#NO:EXPRESSION:DEFAULT_VALUE$
```

- NAME  变量名；变量名后加 `*` 跳过用户交互
- NO (optional) 变量名的交互顺序
- EXPRESSION (optional)  a live template macro used to generate a replacement
- DEFAULT_VALUE (optional) 默认值
- 显示多行用 `\` 连接

#### Template Examples

- Artificial example showing variable reordering, variable reusage, interaction skipping, macros, and default values:

```
.test : test
    NON_VOID → "$user*#1:user()$: $second#3:className()$ + $first#2::"1st"$ + $first$" + $expr$
```

- Real world example: Write a variable to the debug log, including the developer name, the class name, and method name:

```
.logd : log a variable
    NON_VOID → Log.d("$user*:user():"MyTag"$", "$className*:className()$ :: $methodName*:methodName()$): $expr$="+$expr$);
```

- Multi-line template:

```
.for : iterate over ...
    ITERABLE_OR_ARRAY → for ($ELEMENT_TYPE:iterableComponentType(expr):"java.lang.Object"$ $VAR:suggestVariableName()$ : $expr$) {\
      $END$\
    }
```

### 常用模板

```kotlin
.timber : logcat with timber
    ANY → Timber.d("$expr$ = %s",$expr$$END$);

.if : if
    ANY -> if($expr$)  { \
		$END$ \
	}

.forUntil : for Until(不包括)
	ANY -> for(i in 0 until $expr$) { \
		$END$ \
	}

.forIn : for in(包括)
	ANY -> for(i in 0 .. $expr$) { \
		$END$ \
	}

.logv : Log.v
	ANY -> Log.v("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")
.logd : Log.d
	ANY -> Log.d("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ )
.logi : Log.i
	ANY -> Log.i("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ )
.logw : Log.w
	ANY -> Log.w("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ )
.loge : Log.e
	ANY -> Log.e("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ )

.logUtil_v : LogUtils.v
	ANY -> LogUtils.v("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")
.logUtil_d : LogUtils.d
	ANY -> LogUtils.d("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")
.logUtil_i : LogUtils.i
	ANY -> LogUtils.i("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")
.logUtil_w : LogUtils.w
	ANY -> LogUtils.w("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")
.logUtil_e : LogUtils.e
	ANY -> LogUtils.e("$tag*#1:kotlinClassName():""$", "[$className*#2:kotlinClassName():""$ $methodName*#3:kotlinFunctionName():""$] $expr$ $END$ ")

.scl : setOnClickListener
	ANY -> $expr$.setOnClickListener {\
		$END$\
	}

.ttl : Toast show LONG
	ANY -> Toast.makeText($tag*#1:classNameKt():""$@this, $expr$$END$, Toast.LENGTH_LONG).show()\
	 $END$ \

.tts : Toast show SHORT
	ANY -> Toast.makeText($tag*#1:kotlinClassName():""$@this, $expr$$END$, Toast.LENGTH_SHORT).show()\
	 $END$ \
```

## Live Templates

Live Templates 定义：<br>![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793643626-5b1a24aa-48f8-4af2-a370-0c9f7ce67849.png#averageHue=%233e4349&clientId=uab4f5bee-94f2-4&from=paste&id=u4c8b3c32&originHeight=923&originWidth=1231&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0271a7d1-1de9-4314-a2e2-acafe9313e3&title=)

### 自定义 Live Template

1. 首先建立一个 Template Group，路径 `Editor→Live Templates`，以后自定义的都放这里面 ![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793650991-a0915d23-5f83-4809-9734-6c30e89c6afb.png#averageHue=%235ca86f&clientId=uab4f5bee-94f2-4&from=paste&id=uf4c26697&originHeight=79&originWidth=169&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1885b568-c986-4f08-add5-e2543cd9a04&title=)
2. 建立一个文档注释为/**的
3. ![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793656856-77e762e5-58c7-4ba4-8f5d-319f7a6f7fb3.png#averageHue=%233f4449&clientId=uab4f5bee-94f2-4&from=paste&id=ue14ebc6e&originHeight=711&originWidth=1046&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u2c5c95e4-92d1-4efa-89d9-0981cdd2df3&title=)

```
Abbreviation 为缩写
Description 为描述
Template text 为模板
Options→Expand with，按什么生效，有Enter，Tab，Space
```

3. Edit variables（先输入 `$VAR$`，`Edid variable` 编辑变量值）<br>![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793667444-79611854-f876-4d22-9b64-3c2a4f68331d.png#averageHue=%23444c56&clientId=uab4f5bee-94f2-4&from=paste&id=u77573564&originHeight=246&originWidth=574&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u93028935-d255-4079-a44c-bbc16d6a9f3&title=)<br>这里的 Expression 填什么可以参考官方网站的说明：<https://www.jetbrains.com/idea/help/live-template-variables.html>

> Java 和 Kotlin 的 Expression 比如类名调用，是不一样的，要注意区分

4. Application in 作用在哪

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793681529-fc42164b-d0e9-45c3-b1dc-08d3c0f422bc.png#averageHue=%233d4143&clientId=uab4f5bee-94f2-4&from=paste&id=u9b038949&originHeight=334&originWidth=271&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u04fc9151-051a-41d0-a311-c6dd3fcdfee&title=)

### Ref

- [ ] Android Studio 增加函数注释模板<br><http://www.cnblogs.com/zgz345/p/4994885.html>
- [ ] 让你变懒的 ANDROID STUDIO LIVE TEMPLATES<br><http://stormzhang.com/2016/08/21/android-studio-live-templates/>

An `#androidDev` collection of Live Templates for Android Studio<br><https://github.com/keyboardsurfer/idea-live-templates>

## File and Code Templates  配置新建文件模板

### 1、新建 Class, Activity 等的类注释

路径：`Editor→Code Style→File and Code Templates→Includes→File Header`

```kotlin
/**
 *  <br/>
 *
 * @author ${USER} <br/>
 * @time ${DATE} ${TIME} <br/>
 * @since v1.0
 */
```

其他的文件很多引用该文件

```shell
#parse("File Header.java")
```

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793710467-a44072ce-ed3d-4392-8da2-5f8c861b9e02.png#averageHue=%233f4344&clientId=uab4f5bee-94f2-4&from=paste&id=uafb48639&originHeight=674&originWidth=1156&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc1f7056d-3c19-4a59-aa92-80e129eb5f9&title=)

### 2、新建的布局文件增加 app 和 tools 名称空间声明以及 +id

其中 app 自定义属性用到，tools 进行布局预览可以用到

```xml
android:id="@+id/root_layout"
xmlns:app="http://schemas.android.com/apk/res-auto"
xmlns:tools="http://schemas.android.com/tools"
```

全部：

```xml
<?xml version="1.0" encoding="utf-8"?>
<${ROOT_TAG} xmlns:android="http://schemas.android.com/apk/res/android"
        android:id = "@+id/root_layout"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="${LAYOUT_WIDTH}"
        android:layout_height="${LAYOUT_HEIGHT}">

</${ROOT_TAG}>
```

![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793722599-874c949a-f9e2-4ce5-b58d-db2dc8a1cb0e.png#averageHue=%23404445&clientId=uab4f5bee-94f2-4&from=paste&id=udf0da7c4&originHeight=674&originWidth=1156&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u92561fd9-a12c-45b4-ab7f-9e71d3e79ee&title=)

## 基于 FreeMarker 创建多文件模版（New->Empty Activity）

### Ref

- [ ] <https://blog.csdn.net/qq_33306246/article/details/107170950>
- [ ] <https://zhuanlan.zhihu.com/p/157361281>
- [ ] [https://chewenkai.github.io/2019/03/07/Android Studio的三种类型的模版创建/](https://chewenkai.github.io/2019/03/07/Android%20Studio%E7%9A%84%E4%B8%89%E7%A7%8D%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%A8%A1%E7%89%88%E5%88%9B%E5%BB%BA/)

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
3. ![|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1687793930312-b3ee38d2-216f-48ab-8cd2-f2381dad6e74.png#averageHue=%23e6e6e7&clientId=uab4f5bee-94f2-4&from=paste&height=347&id=u14d925ac&originHeight=1224&originWidth=850&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0c3d6c84-5b29-4939-a6b2-40d20fea9fa&title=&width=241)
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
5.  Press Run dumpstate/logcat/modem log
6.  press copy to SDcard(include CP Ramdump)
7.  然后将内存根目录下的log文件夹压缩后发给工作人员

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
1.    在日志抓取界面，点击删除图标，选择【CLEAR ALL】清除日志文件。
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

# Android Studio 问题

## AS 的 Layout Inspector 导致的崩溃

- 报错堆栈

```kotlin
FATAL EXCEPTION: Studio:LayInsp
Process: com.zzkko, PID: 415
java.lang.UnsupportedOperationException: Tried to obtain display from a Context not associated with one. Only visual Contexts (such as Activity or one created with Context#createWindowContext) or ones created with Context#createDisplayContext are associated with displays. Other types of Contexts are typically related to background entities and may return an arbitrary display.
	at android.app.ContextImpl.getDisplay(ContextImpl.java:2958)
	at android.content.ContextWrapper.getDisplay(ContextWrapper.java:1115)
	at com.android.tools.agent.appinspection.proto.ViewExtensionsKt.getDefaultDisplayRotation(ViewExtensions.kt:181)
	at com.android.tools.agent.appinspection.proto.ViewExtensionsKt.createAppContext(ViewExtensions.kt:157)
	at com.android.tools.agent.appinspection.CaptureExecutor.sendLayoutEvent(CaptureExecutor.kt:173)
	at com.android.tools.agent.appinspection.CaptureExecutor.executeCapture(CaptureExecutor.kt:145)
	at com.android.tools.agent.appinspection.CaptureExecutor.access$executeCapture(CaptureExecutor.kt:42)
	at com.android.tools.agent.appinspection.CaptureExecutor$execute$1.run(CaptureExecutor.kt:75)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1137)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:637)
	at java.lang.Thread.run(Thread.java:1012)
Attempt to remove non-JNI local reference, dumping thread
```

- 问题 `Layout Inspector` 导致
- 解决关闭掉 `Layout Inspector` 并重启 `AS`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1689322448549-cd9f50b2-7a25-4f91-8fe2-f4854a6148ba.png#averageHue=%233f4144&clientId=uef7c4340-156c-4&from=paste&height=96&id=u7dd74fb2&originHeight=192&originWidth=1298&originalType=binary&ratio=2&rotation=0&showTitle=false&size=34737&status=done&style=none&taskId=ua8ffbf95-d879-449d-af82-2ca4d83d2b5&title=&width=649)
