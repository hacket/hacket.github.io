---
date created: 2024-12-23 00:48
date updated: 2025-01-02 08:48
dg-publish: true
image-auto-upload: true
feed: show
format: list
---

# Obsidian Digital Garden 插件

### 元数据

```yaml
dg-publish: true
dg-home: true
```

1. `dg-home` 是告诉插件这篇文章应该是你的主页。(它只需要添加到一个笔记，而不是你要发布的每个笔记)。
2. `dg-publish` 设置告诉插件这个注释所在的文章需要发布。没有此设置的注释将无法发布。(换句话说: 你发布的每个笔记都需要这个设置。)

## 设置

### 数字花园标题和主题的设置

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260833625.png)
最后点击`Apply settings to site`，等待一会儿，刷新你的网页即可。

### 笔记的创建和最近更新信息显示

同样在`Manage appearance`打开的页面，往下拉，找到`Timestamps Settings`并作如下配置:
![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260836554.png)

### 数字花园布局设置

同样在Digital Garden插件的设置页面，找到`Global Note Settings` —> `Manage note settings` ，打开笔记设置页面，建议将这个页面的所有设置都打开。
![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412272248419.png)

其中：

- `Show filetree sidebar` 是显示左边的文件树；
- `Show local graph for notes` 是表示开启右侧笔记间的关系图；
- `Show backlins for notes` 表示开启连接到当前笔记的所有笔记；
- `Enable search` 表示开启搜索框。

### 笔记置顶的设置

随着我们笔记的增加，我们希望非常重要的笔记总是在文件树的第一条显示，只需要在我们要置顶的笔记的元数据中新增`dg-pinned = true` 即可实现该笔记的置顶。

### 非英文笔记要注意的配置

对于非英文笔记要注意关掉以下配置，不然会出现同一个目录下的多篇笔记，你只能发布一篇到你的数字花园，因为非英文字符无法处理导致路径的冲突，这也是我踩过的一个坑。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412272255837.png)

### 配合 Markdown Prettifier 插件添加发布元数据

- Markdown Prettifier 插件

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412232338250.png)

## 版本更新

obsidian-digital-garden 插件中提供了一个功能，它会自动检测 digitalgarden 的版本，使我们能够在 Obsidian 内部完成对我们的 Repo 的升级。功能的截图如下：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020847783.png)

点击 Update 按钮，插件会自动发起一个 PR，将 digitalgarden 的更新发送到我们的 Repo。不过，合并 PR 还是得我们自己动手。

## Ref

- [01 Getting started](https://dg-docs.ole.dev/getting-started/01-getting-started/)
- [Obsidian-Digital-Garden](https://garden.maxieewong.com/000.wiki/Obsidian-Digital-Garden/)
