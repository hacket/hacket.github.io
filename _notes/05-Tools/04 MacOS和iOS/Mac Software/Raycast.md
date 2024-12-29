---
date created: 2024-03-25 19:30
date updated: 2024-12-23 23:41
dg-publish: true
---

## 什么是 Raycast？

类Spotlight/Alfred的启动器工具。Raycast特色：

- Raycast 支持导入导出数据：换设备时可以很方便地迁移所有偏好设置及保存在其中的快捷键、自定义片段等内容。这样一来，比起使用多个应用，把所有数据都汇聚在一个应用里，更便于管理和迁移。
- 带了AI功能 

![](https://res.cloudinary.com/practicaldev/image/fetch/s--pI7IT29D--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fgx10cf0m9fsfw01lzlk.gif#height=353&id=KvST6&originHeight=500&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=564)

## 基本功能

### 搜索应用

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687431810731-ec75df80-54ba-4fa9-8052-f5cb5e07a76a.png#averageHue=%23d2c7c6&clientId=u509e6f34-c34d-4&from=paste&height=321&id=ub620f91b&originHeight=938&originWidth=1536&originalType=binary&ratio=2&rotation=0&showTitle=false&size=202824&status=done&style=none&taskId=u3dd32610-cdf5-4a44-8062-db39f7d9cb9&title=&width=525)

### 搜索文件

先输入`file`或者`file search`，然后通过 tab 建或者 回车键进入 file search 插件（当然这里也可以设置快捷键）；

### Quicklinks

#### 界面

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688129933545-f126eee4-aa1f-429f-a8c5-1b07379086e2.png#averageHue=%23353231&clientId=uf3407d3c-07d7-4&from=paste&height=266&id=ue24807bb&originHeight=1280&originWidth=2000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=797419&status=done&style=none&taskId=uf833d321-6e78-469e-988f-77225a4e184&title=&width=415)

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

## Clipboard history 剪贴板历史界面与操作

### 提供的功能

- 能够预览剪贴板条目内容，并支持文字、图片、文件等方便统一复制，统一粘贴；支持快捷键
- 支持文本、图片检索
- 支持pined某个条目
- 支持保存某个条目到Snippet
- 支持保存为文件

Raycast 剪贴板管理的最大特点和优势是可以与其他内建插件打通，比如上文提到的 Save as Snippet，Save as Quicklink 等

### 主界面及设置

- 设置快捷键：Command+Shift+V

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686712774524-7913305f-9a81-4101-ba22-5cff860c8139.png#averageHue=%23e2ddda&clientId=u003c9974-f369-4&from=paste&height=244&id=u9da31f27&originHeight=1280&originWidth=2000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=861420&status=done&style=none&taskId=ub9ee664e-9af7-4671-b2f7-dc70fe07bda&title=&width=381)

1. **Primary Action:** 设置主操作是「复制到剪贴板」还是「粘贴到当前应用」
2. **Keep History For: **设置保留历史记录的时间（被 pin 住的条目不会被自动清除）
3. **Disabled Applications:** 设置忽略的 app（比如不保存从密码管理器复制的内容；Raycast 默认会自动忽略一些敏感内容）

### 操作

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686714589480-3bb74e1f-8596-47b4-8cd9-36a9ba07b462.png#averageHue=%23dfdad7&clientId=u003c9974-f369-4&from=paste&height=316&id=uf43dace5&originHeight=948&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=494016&status=done&style=none&taskId=u6ebbf454-5d55-41ee-9777-37bad2cdc68&title=&width=500)

- 左侧是剪贴板条目列表，不同的条目类型会有不同的图标区分；右侧是内容预览及一些 metadata，包含条目复制于哪个应用、复制时间等
- 可以输入文字检索，也可以按类型筛选（Text 文字、Images 图片、Files 文件、Links 链接、Colors 色值这 5 项）；v1.30.0后，可以直接搜索图片及文本文件中的文字了
- 快捷键 `⌘+数字` 可以按列表顺序快速选取条目。如果条目比较多，不能一下看出是第几个，`长按 ⌘`将会显示对应的数字。
- 最下方是操作栏，其中左边是主操作，可以在 设置 中自定义，我设置的是「粘贴到当前窗口」；按 `⌘+K` 可以展开更多操作。

## [Window Management](https://raycastapp.notion.site/Window-Management-30b5f3e5210e43ebb63969cfc8cda717) 移动和缩放window

### Window Management界面

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687403299796-ca1e8040-72d6-493d-b92f-8a79b2a07c0c.png#averageHue=%23e1dcd9&clientId=u0251880b-3db1-4&from=paste&height=345&id=u0706fae8&originHeight=1280&originWidth=2000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=911095&status=done&style=none&taskId=u956f1a5e-0b69-4955-88b9-bec995ee51b&title=&width=539)

- 设置快捷键

```shell
# Left Half
Command+Shift+Control+←
# Right Half
Command+Shift+Control+→
# Top Half
Command+Shift+Control+↑
#  Half
Command+Shift+Control+↓
```

- Respect Stage Manager

一般不用勾选，勾选后Left Half，就会保留左端部分空间给Stage Manager用， 导致不能贴边

### 常用快捷键

#### Move Top/Bottom/Left/Right

移动到各个方向：`上/下/左/右`
设置快捷键：Command(`⌘`)+Shift(`⇧`)+`↑/↓/←/→`

#### Top/Bottom/Left/Right Half

设置各个方向半屏<br>设置快捷键：Command(`⌘`)+Shift(`⇧`)+Control(`⌃`)+`↑/↓/←/→`

#### Almost Maximize 90%

设置窗口90%大<br>设置快捷键：Command(`⌘`)+Shift(`⇧`)+Control(`⌃`)+M

### 使用

1. 当前窗口唤起 Raycast 的主搜索框，搜索指令名称
2. 使用快捷

## 卸载应用 （替代 AppCleaner）

搜索某一应用，按 `⌘ + K` 打开更多操作，搜索 ` uninstall application  ` 就可以卸载 APP 了。
![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1687405457188-92acac3f-dbde-48f0-9da6-ac8fbdbd4631.png#averageHue=%233b3e57&clientId=u0251880b-3db1-4&from=paste&height=223&id=ud55209a2&originHeight=719&originWidth=1120&originalType=binary&ratio=2&rotation=0&showTitle=false&size=283702&status=done&style=none&taskId=ud48515c5-6ed9-4b5e-a485-b1439ccbaa8&title=&width=347)

## Snippets 自定义片段（替代 Text Replacement）

## [Extensions store](https://www.raycast.com/store)

## `Raycast`提效

## Ref

- [ ] [能少一个是一个：我用 Raycast 替代了这些应用](https://sspai.com/post/72540)
