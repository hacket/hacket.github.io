---
date created: 2024-03-25 19:30
date updated: 2024-12-23 23:41
dg-publish: true
---

## 什么是 Raycast？

类Spotlight/Alfred的启动器工具。Raycast特色：

- Raycast 支持导入导出数据：换设备时可以很方便地迁移所有偏好设置及保存在其中的快捷键、自定义片段等内容。这样一来，比起使用多个应用，把所有数据都汇聚在一个应用里，更便于管理和迁移。
- 带了AI功能 

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053692.png)

## 基本功能

### 搜索应用

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053700.png)

### 搜索文件

先输入`file`或者`file search`，然后通过 tab 建或者 回车键进入 file search 插件（当然这里也可以设置快捷键）；

### Quicklinks

#### 界面

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053701.png)

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

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053702.png)

1. **Primary Action:** 设置主操作是「复制到剪贴板」还是「粘贴到当前应用」
2. **Keep History For: **设置保留历史记录的时间（被 pin 住的条目不会被自动清除）
3. **Disabled Applications:** 设置忽略的 app（比如不保存从密码管理器复制的内容；Raycast 默认会自动忽略一些敏感内容）

### 操作

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053703.png)

- 左侧是剪贴板条目列表，不同的条目类型会有不同的图标区分；右侧是内容预览及一些 metadata，包含条目复制于哪个应用、复制时间等
- 可以输入文字检索，也可以按类型筛选（Text 文字、Images 图片、Files 文件、Links 链接、Colors 色值这 5 项）；v1.30.0后，可以直接搜索图片及文本文件中的文字了
- 快捷键 `⌘+数字` 可以按列表顺序快速选取条目。如果条目比较多，不能一下看出是第几个，`长按 ⌘`将会显示对应的数字。
- 最下方是操作栏，其中左边是主操作，可以在 设置 中自定义，我设置的是「粘贴到当前窗口」；按 `⌘+K` 可以展开更多操作。

## [Window Management](https://raycastapp.notion.site/Window-Management-30b5f3e5210e43ebb63969cfc8cda717) 移动和缩放window

### Window Management界面

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501010053704.png)

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
![image.png|500](undefined)

## Snippets 自定义片段（替代 Text Replacement）

## [Extensions store](https://www.raycast.com/store)

## `Raycast`提效

## Ref

- [ ] [能少一个是一个：我用 Raycast 替代了这些应用](https://sspai.com/post/72540)
