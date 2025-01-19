---
date_created: Thursday, February 29th 2024, 10:50:50 pm
date_updated: Sunday, January 19th 2025, 2:07:22 pm
title: 2 Obsidian CSS片段
author: hacket
categories:
  - Tools
category: Obsidian
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date created: Monday, December 23rd 2024, 1:07:00 am
date updated: Tuesday, January 7th 2025, 7:43:17 am
image-auto-upload: true
feed: show
format: list
tags: [obsidian]
aliases: [去除待办的删除线样式]
linter-yaml-title-alias: 去除待办的删除线样式
---

# 去除待办的删除线样式

```css
/* 实现去除待办的删除线样式，方便在回顾任务的时候使用，避免干扰。 */

.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task="x"],
.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task="X"] {
    text-decoration: unset;
}
```

效果：

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240224104713.png)

# 编辑模式下当前行高亮

```css
/* Active line background */
.markdown-source-view.mod-cm6 .cm-line.cm-active {
    background-color: rgba(var(--mono-rgb-100), 0.05)
}

/*Active line number */
.markdown-source-view.mod-cm6 .cm-lineNumbers .cm-gutterElement.cm-active {
    font-weight: 600;
    color: purple
}
```

效果：

![image.png|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240224110854.png)

# 笔记页内标题居中

```css
.view-content .markdown-source-view .inline-title {
    align-self: center;
}

.markdown-preview-view .mod-header .inline-title {
    text-align: center;
}
```

# 编辑模式代码块显示行号

通过 CSS 的方法实现在编辑模式下显示代码行号 ，但因为受限于 Obsidian 的渲染机制，如果代码长度超过一屏幕，代码行号会被重置。

```css
.HyperMD-codeblock-begin {
  counter-reset: line-numbers;
}

.HyperMD-codeblock.cm-line:not(.HyperMD-codeblock-begin):not(.HyperMD-codeblock-end) {
  padding-left: 3em;
  position: relative;
}

.HyperMD-codeblock.cm-line:not(.HyperMD-codeblock-begin):not(.HyperMD-codeblock-end)::after {
  align-items: flex-start;
  color: var(--text-faint);
  content: counter(line-numbers);
  counter-increment: line-numbers;
  display: flex;
  font-size: 0.8em;
  height: 100%;
  justify-content: flex-end;
  left: 0;
  position: absolute;
  text-align: right;
  width: 2em;
  padding-right: 0.5em;
  bottom: -2px;
  border-right: 1px solid var(--scrollbar-thumb-bg);
 white-space: nowrap;
}

.HyperMD-codeblock.cm-line.cm-active:not(.HyperMD-codeblock-begin):not(.HyperMD-codeblock-end)::after {
  color: var(--color-accent);
}

.HyperMD-codeblock .cm-foldPlaceholder::before {
  display: none;
}
```

# 图片添加边框阴影

```css
/**
使用 CSS3 的filter阴影滤镜 drop-shadow；此函数有点类似于 box-shadow 属性；box-shadow 属性在元素的整个框后面创建一个矩形阴影, 而 drop-shadow() 过滤器则是创建一个符合图像本身形状 ( alpha 通道)的阴影。
其语法是：
drop-shadow(offset-x offset-y blur-radius spread-radius color)

采用 drop-shadow 是更加可取的方案；box-shadow，只是盒子的阴影；倘若盒子中间是透明的，其光线不能穿透；
*/

/* 图片添加边框阴影 */
img {
    -webkit-filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, .5));
    filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, .5));
}

/* 图片添加边框 */
img {
    border-style: solid;
    /*图片边框: 实线*/
    border-width: 0px;
    /*边框宽度: 0.5px*/
}
```

# 搜索框美化，类似 Vscode

1. 类 vscode 搜索框
2. 基于 AccentColor 的高亮

```css
.theme-light {
    /* 外部链接 ()[] */
    --external-link: #e39133;
    /* 内部链接 [[]] */
    --internal-link: #5d94ca;
}

.theme-dark {
    --external-link: #965e1edd;
    --internal-link: #58a8fadd;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link,
.markdown-preview-view .internal-link,
.is-live-preview .cm-line:not(.cm-active) .cm-link,
.markdown-preview-view .external-link {
    border-radius: 6px;
    padding: 2px 20px;
    border: 0.5px solid var(--c);
    box-sizing: border-box;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2705882353), -1px -1px 4px rgba(255, 255, 255, 0.2705882353);
    background: conic-gradient(from -135deg at 100% 50%, var(--c) 90deg, rgba(0, 0, 0, 0) 0) -2px var(--p, 1%)/var(--s, 0%) 200% no-repeat, conic-gradient(from -135deg at 1.2em 50%, rgba(0, 0, 0, 0) 90deg, var(--c) 0) calc(100% + 2px) var(--p, 1%)/var(--s, 0%) 200% no-repeat !important;
    transition: 0.3s ease-in-out, background-position 0s, padding 0s, border-radius 0s, border 0s;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link:hover,
.markdown-preview-view .internal-link:hover,
.is-live-preview .cm-line:not(.cm-active) .cm-link:hover,
.markdown-preview-view .external-link:hover {
    --p: 96%;
    --s: calc(50% + 0.9em);
    color: var(--background-primary) !important;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2705882353), -3px -3px 6px rgba(255, 255, 255, 0.2705882353);
}

.cm-link,
.external-link {
    color: var(--external-link) !important;
}

.cm-link,
.cm-link .cm-underline,
.external-link,
.external-link .cm-underline {
    text-decoration: none !important;
}

span.external-link {
    display: none !important;
}

.is-live-preview .cm-line:not(.cm-active) .cm-link,
.markdown-preview-view .external-link {
    --c: var(--external-link);
}

.cm-url,
.cm-hmd-internal-link,
.internal-link {
    color: var(--internal-link) !important;
}

.cm-url,
.cm-url .cm-underline,
.cm-hmd-internal-link,
.cm-hmd-internal-link .cm-underline,
.internal-link,
.internal-link .cm-underline {
    text-decoration: none !important;
}

.internal-link {
    padding: 0 4px;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link,
.markdown-preview-view .internal-link {
    --c: var(--internal-link);
}

.cm-formatting-link,
.cm-formatting-link-string,
.cm-formatting-image {
    font-weight: 700;
    margin: 0 2px;
    border: none !important;
    box-shadow: none !important;
}

.cm-formatting-link~.cm-hmd-internal-link,
.cm-formatting-link+.cm-link,
.cm-formatting-link-string~.cm-hmd-internal-link,
.cm-formatting-link-string+.cm-link,
.cm-formatting-image+.cm-hmd-internal-link,
.cm-formatting-image+.cm-link {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
}
```

效果：

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240227174341.png)

Ref：<https://www.yuque.com/fanmofeng/obsidian/rh5cke>

# 链接美化

- 常规状态的链接样式
- `hover` 时链接的着重显示

```css
.theme-light {
    /* 外部链接 ()[] */
    --external-link: #e39133;
    /* 内部链接 [[]] */
    --internal-link: #5d94ca;
}

.theme-dark {
    --external-link: #965e1edd;
    --internal-link: #58a8fadd;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link,
.markdown-preview-view .internal-link,
.is-live-preview .cm-line:not(.cm-active) .cm-link,
.markdown-preview-view .external-link {
    border-radius: 6px;
    padding: 2px 20px;
    border: 0.5px solid var(--c);
    box-sizing: border-box;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2705882353), -1px -1px 4px rgba(255, 255, 255, 0.2705882353);
    background: conic-gradient(from -135deg at 100% 50%, var(--c) 90deg, rgba(0, 0, 0, 0) 0) -2px var(--p, 1%)/var(--s, 0%) 200% no-repeat, conic-gradient(from -135deg at 1.2em 50%, rgba(0, 0, 0, 0) 90deg, var(--c) 0) calc(100% + 2px) var(--p, 1%)/var(--s, 0%) 200% no-repeat !important;
    transition: 0.3s ease-in-out, background-position 0s, padding 0s, border-radius 0s, border 0s;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link:hover,
.markdown-preview-view .internal-link:hover,
.is-live-preview .cm-line:not(.cm-active) .cm-link:hover,
.markdown-preview-view .external-link:hover {
    --p: 96%;
    --s: calc(50% + 0.9em);
    color: var(--background-primary) !important;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2705882353), -3px -3px 6px rgba(255, 255, 255, 0.2705882353);
}

.cm-link,
.external-link {
    color: var(--external-link) !important;
}

.cm-link,
.cm-link .cm-underline,
.external-link,
.external-link .cm-underline {
    text-decoration: none !important;
}

span.external-link {
    display: none !important;
}

.is-live-preview .cm-line:not(.cm-active) .cm-link,
.markdown-preview-view .external-link {
    --c: var(--external-link);
}

.cm-url,
.cm-hmd-internal-link,
.internal-link {
    color: var(--internal-link) !important;
}

.cm-url,
.cm-url .cm-underline,
.cm-hmd-internal-link,
.cm-hmd-internal-link .cm-underline,
.internal-link,
.internal-link .cm-underline {
    text-decoration: none !important;
}

.internal-link {
    padding: 0 4px;
}

.is-live-preview .cm-line:not(.cm-active) .cm-hmd-internal-link,
.markdown-preview-view .internal-link {
    --c: var(--internal-link);
}

.cm-formatting-link,
.cm-formatting-link-string,
.cm-formatting-image {
    font-weight: 700;
    margin: 0 2px;
    border: none !important;
    box-shadow: none !important;
}

.cm-formatting-link~.cm-hmd-internal-link,
.cm-formatting-link+.cm-link,
.cm-formatting-link-string~.cm-hmd-internal-link,
.cm-formatting-link-string+.cm-link,
.cm-formatting-image+.cm-hmd-internal-link,
.cm-formatting-image+.cm-link {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
}
```

效果：

![](https://cdn.nlark.com/yuque/0/2022/gif/29193455/1657629544383-e3e309a6-c398-422b-a9af-caf7069fea98.gif)

- [ ] [链接美化](https://www.yuque.com/fanmofeng/obsidian/lwb2gr)

# 仿 firefox tab 栏

```css
/**
仿firefox tab栏
https://www.yuque.com/fanmofeng/obsidian/dddwl1
*/

.mod-root .workspace-tab-header-container-inner {
    margin-top: 4px;
    padding-bottom: 4px;
}

.workspace-tab-header {
    padding-bottom: 0 !important;
}

.workspace-tab-header.is-active {
    --tab-radius-active: 6px;
    box-shadow: var(--shadow-s);
    border: 1px solid var(--color-base-30);
}

.workspace-tab-header .workspace-tab-header-inner-close-button {
    padding: 2px;
}

.workspace-split.mod-root .workspace-tab-header.is-active::before,
.workspace-split.mod-root .workspace-tab-header.is-active::after {
    box-shadow: none;
}
```

效果：

![](https://cdn.nlark.com/yuque/0/2022/gif/29193455/1665902339789-8b17030a-98d0-46f1-97ca-ac544fbd0f82.gif)

Ref: [仿firefox tab栏](https://www.yuque.com/fanmofeng/obsidian/dddwl1)

# Ref

- [ ] [Obsidian 的 CSS 代码片段](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E5%A4%96%E8%A7%82/obsidian%E7%9A%84css%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5/)
