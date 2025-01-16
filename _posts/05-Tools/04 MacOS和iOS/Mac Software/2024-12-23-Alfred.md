---
date created: 2024-12-23 23:41
date updated: 2024-12-23 23:41
dg-publish: true
---

# Alfred介绍

## General

## Features

### Default Results（默认结果）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683127680211-cd7ae141-b8e2-4086-b388-6f3f0611f10f.png#averageHue=%23e4e4e4&clientId=u09a739d6-ac8d-4&from=paste&height=639&id=u7833e39e&originHeight=1119&originWidth=1457&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=672508&status=done&style=none&taskId=ue445c799-0ab0-4447-813e-50e66f6850f&title=&width=832.3333740234375)

1. Essentials：可设置搜索“应用程序”、“联系人”、“设置”、“Safari书签”。
2. Extras：可设置搜索“文件夹”、“文本文件”、“压缩文件”、“个人文档目录”、“图片”、“AppleScript”等其他文件。
3. Unintelligent：Search all file types搜索所有文件类型。若勾选此项不但影响巡查速度，还混淆默认搜索结果。Alfred建议用户使用Find+空格+文件名来查询文件或文件夹；使用Open+空格+文件名也可以。
4. Search Scope：设置Alfred查询时会搜索的文件夹范围，可自己添加和删除。
5. Fallbacks：若上面的查询搜索不到结果时，就会调用这里设置的网站或搜索引擎来进行进一步的查询。默认反馈结果为Google、Amazon、Wikipedia网页搜索，可点击界面右下角的+来添加更多的搜索引擎。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683127710984-5232d7b8-05bd-4df9-b4b0-95667f39d9ab.png#averageHue=%23f3f3f3&clientId=u09a739d6-ac8d-4&from=paste&height=333&id=u49a8e063&originHeight=629&originWidth=1364&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=182215&status=done&style=none&taskId=uc5e1f5cf-adc1-4ae0-a9c1-d5782c6f7dc&title=&width=722.3333740234375)

### Alfred web search

添加自定义百度搜索

> <https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&ch=&tn=baiduerr&bar=&wd={query}>

#### 常见的搜索url

```
百度：https://www.baidu.com/s?ie=utf-8&f=8&wd={query}
简书：http://www.jianshu.com/search?utf8=%E2%9C%93&q={query}
淘宝：http://s.taobao.com/search?oe=utf-8&f=8&q={query}
京东：http://search.360buy.com/Search?keyword={query}&enc=utf-8&area=15
微信文章：http://weixin.sogou.com/weixin?type=2&query={query}
stackoverflow：http://www.stackoverflow.com/search?q={query}
github：https://github.com/search?utf8=%E2%9C%93&q={query}
maven：http://mvnrepository.com/search?q={query}
Android API Search：https://developer.android.com/reference/classes.html#q={query}
```

#### 搜索的logo见附件

### Clipboard（剪切板）

可以设置文本、图片和文件保持的历史，默认是不保存的<br />查看Alfred剪切板历史记录。默认热键为`Command + Alt + C`（Mac为Command+Option+C）。<br />清空Alfred剪切板。在Alfred操作界面中输入clear。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686722632383-9092aca3-9dfb-4069-9db1-a4482e51f2ef.png#averageHue=%23222222&clientId=u95bd78d2-5bc5-4&from=paste&height=333&id=u6c326217&originHeight=834&originWidth=1118&originalType=binary&ratio=2&rotation=0&showTitle=false&size=218405&status=done&style=none&taskId=u70789f4f-9bec-4bf8-9c3e-3c89cd83a1b&title=&width=446)

### Snippets

#### 主界面

打开Alfred的Snippet设置面板，可以看到下方分为左右两个区域，左边为Snippet的分组，右边为每个分组下的具体文字Snippet。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686721900111-526b83eb-3d02-4f04-9e85-bfe1c0ebab2a.png#averageHue=%23e8e2dd&clientId=u95bd78d2-5bc5-4&from=paste&height=606&id=uba5da3f7&originHeight=1532&originWidth=3000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1145748&status=done&style=none&taskId=u73d2e05c-27c0-4a14-bc67-c5e1697d47d&title=&width=1186)

#### 新建Snippets

##### 新建分组

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686721570267-8e201943-aa22-4f7e-b39f-168874ecad98.png#averageHue=%23e3e2e2&clientId=u22d1ffe6-a4e4-4&from=paste&height=198&id=u9c94e254&originHeight=428&originWidth=960&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81594&status=done&style=none&taskId=u28c65f86-abce-4afd-837e-5a6d327ae49&title=&width=444)

- **Name**：分组名字
- **Affix**：Snippet前缀。与后面描述的单独条目的Snippet Keyword一起组合成Snippet关键字；
- **keyword**：分组关键字，为可选项，如果输入了keyword，则会在单独条目关键字后面自动添加这个keyword；
- **图标**：分组的图标。

##### 新建具体的snippets

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686722129329-95a35433-001e-40d9-83bc-722452191349.png#averageHue=%23f0f0f0&clientId=u95bd78d2-5bc5-4&from=paste&height=334&id=u206059ca&originHeight=1040&originWidth=1440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127732&status=done&style=none&taskId=u8fe88af3-e3c9-4cb3-96d9-39d549d20d8&title=&width=463)

- Name:条目名称
- Keyword：Snippet条目关键字
- Collection：条目所在的分组
- Snippet：需要进行对其进行扩展的完整文本内容
- Auto expansion allowed：允许自动扩展

在这里输入Keyword关键字后，这个Snippet的缩略语就会变成`分组Affix(前缀) + 条目Keyword + 分组keyword(suffix后缀)`。只要在任何地方输入这个组合，就能扩展出Snippet中定义的文本内容。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686722455360-31b88c8a-97df-4f57-88aa-52786e4c8356.png#averageHue=%23fcfbfb&clientId=u95bd78d2-5bc5-4&from=paste&height=265&id=u3e760d8c&originHeight=842&originWidth=1644&originalType=binary&ratio=2&rotation=0&showTitle=false&size=135484&status=done&style=none&taskId=ue25be383-c15b-4a89-9324-374106f9d32&title=&width=517)

##### 通过Clipboard创建Snippets

按下Clipboard的热键（默认为Command + Option + C）打开剪切板历史记录的面板，里面列出了所有进行过复制动作的文本条目。选中一个条目后，按下`Command + S`，就能弹出添加Snippet条目的对话框

#### 查看所有的Snippets

1. 利用热键，可以在Snippet的设置面板中，对Viewer Hotkey进行设置
2. 按下Command + Option + C打开剪切板历史记录面板，选择最上方的“All Snippets”
3. 打开Alfred输入框，利用“snip”关键字也能快捷的对Snippet进行查询，只需输入名字或者某些字符串即可

#### 分享Snippet

右键单击某个Snippet分组，然后选择Export，就会将其导出成一个文件。其他用户只要双击这个Snippet文件就能将这个Snippet集合导入到自己的Alfred中。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686723893556-c0006a0b-0d5b-401b-9dee-599ea9c42108.png#averageHue=%23f5f4f3&clientId=u95bd78d2-5bc5-4&from=paste&height=260&id=uc54f389b&originHeight=520&originWidth=646&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86483&status=done&style=none&taskId=u30a1619f-23a9-4d63-80c5-5bff02bbc85&title=&width=323)

#### Alfred提供的很实用的Snippet集合

<https://www.alfredapp.com/extras/snippets/><br />其中包含了以下几个Snippet分组：

- Mac Symbols：集合了很多常用的Mac符号，比如输入“!!cmd”对应“”符号，“!!shift”对应“”符号等等。有了这个集合，就再也不用在符号表中辛辛苦苦去找某个Mac标志符号了；
- ASCII Art：集合了一些好玩的火星文字表情；
- Currency Symbols：集合了一些常用的货币符号，比如“::cny”代表“”，“::usd”代表“$”等等；
- Dynamic Content examples：一些关于动态占位符的例子，可以学习一下使用方法；
- Emoji Pack：很强大的Emoji表情包。有海量的Emoji符号，输入对应的关键字就能自动插入想要的Emoji表情，简直不要太方便，再也不用一个个翻页的去找了

#### 动态占位符（Dynamic Placeholders）

你想在文本中插入一些特定的内容，但这些内容在每一次输入的时候都会有所不同，比如日期、时间、剪切板中的文本等等。<br />使用动态占位符，就能在输入Snippets的时候，扩展出的文字根据具体的情况而变化。只需在编辑Snippets的时候，将相应的关键字放在`{关键字}`内，比如`{date}`，`{time}`，`{clipboard}`。则当输入Snippets的时候，`{}`中的内容会自动转变为相应的动态内容，比如日期、时间、剪切板文本。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686724620554-e6f5e1d4-d540-4c10-9d0e-69609dde2b4c.png#averageHue=%23efefef&clientId=u95bd78d2-5bc5-4&from=paste&height=255&id=ud39aa0d3&originHeight=1040&originWidth=1440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=132632&status=done&style=none&taskId=ue8e89a0a-c12b-42a7-bff8-13e88cbf8f8&title=&width=353)<br />显示日期时间的占位符关键字有三个：

- {date}：显示当前日期
- {time}：显示当前时间
- {datetime}：显示当前日期和时间日期和时间都有short、medium、long和full这几种显示方式，Alfred默认的为midium。要想改变显示方式，只需在关键字后面接上相应的方式名称即可，例如“{date:long}”。这些显示方式的具体格式可以在Mac设置面板中的“时间&区域”中查看：

不仅能显示当前时间，利用加减算数符号进行计算之后，还能显示过去或者未来的日期时间，比如{date +1D}会显示明天的日期，{time -3h -30m}会显示3个半小时之前的时间等等。支持的算子有以下几种：

- 1Y：年
- 1M：月
- 1D：天
- 1h：小时
- 1m：分钟
- 1s：秒

在用算式计算时间时，同时也能接上显示方式，按照需要的格式显示相应的日期时间，比如“{time -2h -20m:long}”，“{date -2m:short}”。

#### 剪切板内容

- 利用Snippet的`{clipboard}`这个占位符，可以动态获取剪切板中的内容
- 位移：`{clipboard:0}`代表剪切板第一项内容，“{clipboard:1}”为第二项内容，“{clipboard:2}”为第三项，以此类推。{clipboard}和{clipboard:0}的意义相同。
- `{clipboard:uppercase}`：将文本全部转换为大写；
- `{clipboard:lowercase}`：将文本全部转换为小写；
- `{clipboard:capitals}`：将文本中每个单词的首字母变为大写。

#### 光标位置

利用`{cursor}`占位符，可以在输入Snippet扩展为对应文字后，光标自动定位到{cursor}在文本中的位置，方便之后对某些内容的输入。

## Workflows

官网workflows：<https://www.alfredapp.com/workflows/><br />大神维护的：<http://alfredworkflow.com/><br />Packal：<http://www.packal.org/>

### color

<http://www.packal.org/workflow/colors>

### YoudaoTranslate

<https://github.com/wensonsmith/YoudaoTranslate>

### Google-Alfred-Workflow

<https://segmentfault.com/a/1190000005773711><br /><https://github.com/ethan-funny/Google-Alfred3-Workflow><br />插件支持的功能主要有：

> 输入 gs，以及关键词，实时查询搜索结果（标题+链接）<br />Enter 直接跳转到链接所在页面<br />Command + Enter 直接复制链接<br />Option + Enter 复制 markdown 形式的链接

### ip 显示内部和外部ip

<http://www.packal.org/workflow/whats-my-ip>

> 使用：ip

### github

<https://github.com/gharlan/alfred-github-workflow>

### app killer

<https://github.com/ngreenstein/alfred-process-killer>

## Alfred使用注意

Alfred建议用户不要搜索所有的文件和文件夹，而使用`Find+空格+文件名`来查询文件或文件夹；使用`Open+空格+文件名`也可以。

# Alfred破解

## Alfred3

- 官网下载正版并安装好

<https://www.alfredapp.com/>

- 用Alfred CORE Keygen注册机注册

找到Alfred3.app注册并保存

- 重新签名

`sudo codesign -f -d -s - /Applications/Alfred\ 3.app/Contents/Frameworks/Alfred\ Framework.framework/Versions/A/Alfred\ Framework`

> 如果是10.11后，需要运行允许任何来源的App

`sudo spctl --master-disable`<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683127974640-8c14c0c9-73f1-4f43-a4c1-c558c007731b.png#averageHue=%23e5e5e5&clientId=u09a739d6-ac8d-4&from=paste&height=795&id=ufb88c692&originHeight=1193&originWidth=1469&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=358774&status=done&style=none&taskId=u25a9d07e-68ae-48a8-86ba-989a961ae84&title=&width=979.3333333333334)<br />[alfred注册机.zip](https://www.yuque.com/attachments/yuque/0/2023/zip/694278/1683128749582-238ae54f-a018-46c7-abd1-5faea2d9bd3e.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fzip%2F694278%2F1683128749582-238ae54f-a018-46c7-abd1-5faea2d9bd3e.zip%22%2C%22name%22%3A%22alfred%E6%B3%A8%E5%86%8C%E6%9C%BA.zip%22%2C%22size%22%3A486753%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u74873c2a-b003-4b76-96f6-4e7387c91ba%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fx-zip-compressed%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22uea9e01c6%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## Alfred5 mac

<https://www.macyy.cn/archives/1514#J_DLIPPCont>

# Ref

- [ ] 5分钟上手Mac效率神器Alfred以及Alfred常用操作

<https://www.jianshu.com/p/e9f3352c785f>

- [ ] Mac效率神器Alfred以及常用Workflow

<https://www.jianshu.com/p/0e78168da7ab>
