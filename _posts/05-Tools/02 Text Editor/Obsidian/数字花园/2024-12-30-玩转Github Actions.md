---
date_created: Monday, December 30th 2024, 12:33:07 am
date_updated: Sunday, January 19th 2025, 9:59:27 am
title: 玩转Github Actions
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
tags: [obsidian]
image-auto-upload: true
feed: show
format: list
categories:
  - Obsidian
aliases: [玩转 Github]
linter-yaml-title-alias: 玩转 Github
---

# 玩转 Github

## Github Pages

### Github Pages 是什么？

Github Pages 官网： <https://pages.github.com/>

GitHub Pages 是 GitHub 提供的一个免费的静态网站托管服务，它允许 GitHub 用户创建和托管自己的静态网站，这些网站可以通过特定的 GitHub 仓库进行管理和托管。

GitHub Pages 的主要特点包括：

- **免费托管**： GitHub Pages 提供免费的静态网站托管服务，允许用户将自己的网站内容托管在 GitHub 上，用户不需要支付额外的托管费用；
- **使用简单**： 创建和管理 GitHub Pages 静态网站相对简单，特别是对于熟悉 GitHub 的用户来说，用户只需在自己的 GitHub 帐户中创建一个特定名称的仓库，将网站文件上传到该仓库即可；
- **自定义域名**： 用户可以选择使用自定义域名来访问他们的 GitHub Pages 网站，这使得它们更适合个人网站、博客和项目页面；
- **支持多种静态网站生成工具**： GitHub Pages 支持多种静态网站生成工具，如 Jekyll、Hugo、Gatsby 等，以及纯 HTML、CSS 和 JavaScript 等前端技术，这使得用户能够根据自己的需求选择适合他们的工具；
- **自动构建**： GitHub Pages 可以自动构建用户上传的网站内容，无需用户手动生成或编译网页，这使得发布网站变得更加简单。
对于开发人员和技术爱好者来说， GitHub Pages 是一个很好的选择，用于托管个人网站、博客、文档、项目页面等静态内容，它提供了一个方便的方式来分享和展示自己的作品。

### 静态网站生成工具

GitHub Pages 支持多种静态网站生成工具。以下是一些 GitHub Pages 支持的主要静态网站生成工具：

- Jekyll（ [https://jekyllrb.com](https://jekyllrb.com/)）： Jekyll 是 GitHub Pages 的默认静态网站生成工具，它使用 Markdown 文件和 Liquid 模板引擎来创建静态网站，Jekyll 对于博客和文档站点非常流行。
- Hugo（ [https://gohugo.io/](https://gohugo.io/)）： Hugo 是另一个受欢迎的静态网站生成工具，它非常快速且易于使用，它使用 Go 语言编写，支持多种主题和内容组织方式。
- Gatsby（ [https://www.gatsbyjs.com/](https://www.gatsbyjs.com/)）： Gatsby 是基于 React 的静态网站生成工具，它可以构建高性能、现代化的网站，Gatsby 适用于博客、电子商务、应用程序文档等。
- VuePress（ [https://vuepress.vuejs.org/](https://vuepress.vuejs.org/)）： VuePress 是 Vue.js 驱动的静态网站生成工具，专注于文档站点，它支持 Markdown 文件和 Vue 组件。
- Hexo（ [https://hexo.io/](https://hexo.io/)）： Hexo 是一个快速、简单的博客框架，使用 Markdown 文件来生成静态博客，它是 Node.js 应用程序。

### GitHub Pages 的用户站点

若要发布用户站点，必须要先建立仓库（repository），仓库名**必须**与用户名保持一致，即 `<username>.github.io`。

站点的原文件与项目存储在同一个仓库中，用户站点为 `http(s)://<username>.github.io/<repository>`

### 创建站点

- 在 Github 上导航到已经创建好的仓库，点击 `Settings` 确定站点要使用的发布源 Source
- 如果要查看已经发布的网站，可以选择 `visit site`
- 另外可以通过 `add a Jekyll theme` 和 `choose a theme` 添加和选择自己喜欢的模板

### 配置发布源

- 同样是在 `pages` 页面 `branch` 下，选择 `deploy from a branch`，在 `branch` 下，使用 `none` 或从下拉菜单选择发布源
如果不喜欢已有的模板，可以通过 Jekyll 生成

### 使用 Jekyll 设置站点

### Ref

- [Quickstart for GitHub Pages - GitHub Docs](https://docs.github.com/en/pages/quickstart)

## Github Actions
