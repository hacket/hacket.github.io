---
date created: Monday, December 23rd 2024, 12:48:00 am
date updated: Thursday, January 16th 2025, 12:45:31 am
title: Obsidian Digital Garden
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
categories: 
image-auto-upload: true
feed: show
format: list
aliases: [Obsidian Digital Garden 插件]
linter-yaml-title-alias: Obsidian Digital Garden 插件
---

# Obsidian Digital Garden 插件

## 介绍

基于静态生成网站 `Eleventy`，使用 `Nunjucks` 作为其模板引擎。

## 元数据

```yaml
dg-publish: true
dg-home: true
```

1. `dg-home` 是告诉插件这篇文章应该是你的主页。(它只需要添加到一个笔记，而不是你要发布的每个笔记)。
2. `dg-publish` 设置告诉插件这个注释所在的文章需要发布。没有此设置的注释将无法发布。(换句话说: 你发布的每个笔记都需要这个设置。)

## 设置

### 数字花园标题和主题的设置

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260833625.png)

最后点击 `Apply settings to site`，等待一会儿，刷新你的网页即可。

### 笔记的创建和最近更新信息显示

同样在 `Manage appearance` 打开的页面，往下拉，找到 `Timestamps Settings` 并作如下配置:

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260836554.png)

### 数字花园布局设置

同样在 Digital Garden 插件的设置页面，找到 `Global Note Settings` —> `Manage note settings` ，打开笔记设置页面，建议将这个页面的所有设置都打开。

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412272248419.png)

其中：

- `Show filetree sidebar` 是显示左边的文件树；
- `Show local graph for notes` 是表示开启右侧笔记间的关系图；
- `Show backlins for notes` 表示开启连接到当前笔记的所有笔记；
- `Enable search` 表示开启搜索框。

### 笔记置顶的设置

随着我们笔记的增加，我们希望非常重要的笔记总是在文件树的第一条显示，只需要在我们要置顶的笔记的元数据中新增 `dg-pinned = true` 即可实现该笔记的置顶。

### 非英文笔记要注意的配置

对于非英文笔记要注意关掉以下配置，不然会出现同一个目录下的多篇笔记，你只能发布一篇到你的数字花园，因为非英文字符无法处理导致路径的冲突，这也是我踩过的一个坑。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412272255837.png)

### 配合 Markdown Prettifier 插件添加发布元数据

- Markdown Prettifier 插件

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412232338250.png)

### 配合 linter

```yaml
author: hacket
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: magic.css
image-auto-upload: true
feed: show
format: list
categories: 
toc: true
description: 
```

dg 开头的是 Obsidian Digital Garden 相关的属性

## custom components 自定义组件

### Namespaces

#### common

作用所有的 home 和 note 页面

#### index

作用 home 页面

#### notes

作用 note 页面

### Slots

## 自定义 CSS

在 `src/site/styles/user` 的样式会被自动加载

- [CSS Customization](https://dg-docs.ole.dev/advanced/css-customization/)
- Magic css: [Custom CSS for Obsigian Digital Garden plugin (Incomplete) - Share & showcase - Obsidian Forum](https://forum.obsidian.md/t/custom-css-for-obsigian-digital-garden-plugin-incomplete/74205)

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501070104242.png)

## 使用 Nunjucks 作为其模板引擎

### Adding analytics

- [Adding analytics](https://dg-docs.ole.dev/advanced/guides-and-how-tos/adding-analytics/)

### Adding comments

- [Adding comments](https://dg-docs.ole.dev/advanced/guides-and-how-tos/adding-comments/)

#### cusdis

- Vercel 集成教程：[Cusdis Documentation](https://cusdis.com/doc#/self-host/vercel)

### disqus

- 注册一个账号
- 新建一个 site
- install
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501152313196.png)

- 选择博客平台，obsidian 这个选自建
- <https://da-sheng-de-shu-zi-hua-yuan.disqus.com/admin/settings/universalcode/>
- 代码
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501152315095.png)

```html
<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://da-sheng-de-shu-zi-hua-yuan.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
```

### 参考

- [GitHub - uroybd/topobon](https://github.com/uroybd/topobon)

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501070107415.png)

## .env 备份

```properties
SITE_NAME_HEADER=大圣的数字花园
SITE_MAIN_LANGUAGE=en
SITE_BASE_URL=https://garden.hacket.me
SHOW_CREATED_TIMESTAMP=true
TIMESTAMP_FORMAT=MMM dd, yyyy h:mm a
SHOW_UPDATED_TIMESTAMP=true
NOTE_ICON_DEFAULT=1
NOTE_ICON_TITLE=true
NOTE_ICON_FILETREE=true
NOTE_ICON_INTERNAL_LINKS=true
NOTE_ICON_BACK_LINKS=true
STYLE_SETTINGS_CSS=body.css-settings-manager { --tag-radius: 14px; --inline-title-size: 2.3em; --h1-size: 2.5em; --h2-size: 2em; --h3-size: 1.6em; --h4-size: 1.3em; --h5-size: 1.1em; --h6-size: 1.1em; --h6-variant: small-caps; --h6-weight: 400; --h5-weight: 700; } body.theme-light.css-settings-manager { --ax1: #0097BD; --ax2: #006F8B; } body.theme-dark.css-settings-manager { --ax1: #0097BD; --ax2: #006F8B; }
STYLE_SETTINGS_BODY_CLASSES=mod-macos is-frameless is-hidden-frameless obsidian-app native-scrollbars theme-light show-inline-title show-ribbon show-view-header is-maximized minimal-theme minimal-flexoki-light minimal-flexoki-dark minimal-line-nums minimal-readable minimal-light-white minimal-dark full-width-media img-grid minimal-folding chart-default-width table-default-width img-default-width iframe-default-width map-default-width css-settings-manager is-focused callouts-default minimal-code-scroll embed-hide-title checkbox-square pdf-seamless-on pdf-invert-dark pdf-blend-light sidebar-tabs-square tab-names-off vault-profile-default ribbon-hidden maximize-tables-off tabs-square tab-stack-top minimal-tab-title-visible default
USE_FULL_RESOLUTION_IMAGES=false
THEME=https://raw.githubusercontent.com/kepano/obsidian-minimal/HEAD/theme.css
BASE_THEME=light
dgHomeLink=false
dgPassFrontmatter=true
dgShowBacklinks=true
dgShowLocalGraph=true
dgShowInlineTitle=true
dgShowFileTree=true
dgEnableSearch=true
dgShowToc=true
dgLinkPreview=true
dgShowTags=true
```

## 版本更新

obsidian-digital-garden 插件中提供了一个功能，它会自动检测 digitalgarden 的版本，使我们能够在 Obsidian 内部完成对我们的 Repo 的升级。功能的截图如下：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501020847783.png)

点击 Update 按钮，插件会自动发起一个 PR，将 digitalgarden 的更新发送到我们的 Repo。不过，合并 PR 还是得我们自己动手。

## 好看的示例

[GitHub - uroybd/topobon](https://github.com/uroybd/topobon)

## Ref

- [01 Getting started](https://dg-docs.ole.dev/getting-started/01-getting-started/)
- [Obsidian-Digital-Garden](https://garden.maxieewong.com/000.wiki/Obsidian-Digital-Garden/)
