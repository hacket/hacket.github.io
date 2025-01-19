---
date_created: Sunday, December 29th 2024, 11:27:11 pm
date_updated: Sunday, January 19th 2025, 1:35:22 pm
title: Github Pages和JekyII
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
categories:
  - Obsidian
feed: show
format: list
permalink: /github_pages
aliases: [Jekyll 和 Github Pages]
linter-yaml-title-alias: Jekyll 和 Github Pages
dg-path: /github_jekyii
---

# Jekyll 和 Github Pages

## JekyII 和 Github Pages 搭建博客

- 注册 Github 账户
- 选择一款 JekyII 主题
- 找到该主题的 Github 仓库，fork 项目，并重命名为：`用户名.github.io`
- 开启 Github Pages
- 修改 `_config.yml` 配置文件
- 将要发布的 md 文章放到 `_post` 目录，格式为：`日期_xxx.md`，如：`2020-02-26-Github Actions.md`

### JekyII 主题选择

如果你不想将文件放在 `_posts` 目录中，也不希望按照日期格式命名文件，以下主题是非常合适的选择：

- **Just the Docs**：特别适合文档型站点，支持自由的目录结构和文件命名。
- **Chirpy**：支持自定义目录结构，适合博客或文档站点。
- **Minimal Mistakes**：功能强大，适用于博客、个人网站及文档站点，支持自定义目录结构。
- **Tale**：简洁的博客主题，支持自由命名文件。
- **HoloPress**：简洁的博客或文档站点主题，支持自由组织目录。

这些主题都允许你自由组织文件，并且不强制要求使用日期格式命名文件。你可以根据自己的需求选择合适的主题，灵活管理站点内容。

## Obsidian 和 JekyII

### 将 Obsidian 转换为 JekyII 笔记

- <https://gist.github.com/cs-qyzhang/9ae9f68f91e6c853ce6911f07eddf168>

# Jekyll 主题

## minimal-mistakes

#### 介绍

**Minimal Mistakes** 是 Jekyll 上最受欢迎的主题之一，非常适合博客和文档站点。它本身设计简洁而高效，支持高度自定义，且自带强大的多级目录支持。

- **多级目录支持**：支持在导航中自动生成多级目录，适用于文档型站点。可以通过在 `navigation` 设置中设置目录层级。
- **Obsidian 兼容性**：虽然并非专门为 Obsidian 设计，但由于它的高度可配置性，完全可以作为 Obsidian 笔记的网页呈现工具来使用。你可以用它来展示 Markdown 文件，或者利用 Jekyll 配置来支持层次结构。
- 布局样式
![](https://github.com/mmistakes/minimal-mistakes/raw/master/screenshot-layouts.png)
- Ref
- [GitHub - mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)

## chirpy 主题

### chirpy 使用

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501060015216.png)

- [GitHub - cotes2020/jekyll-theme-chirpy: A minimal, responsive, and feature-rich Jekyll theme for technical writing.](https://github.com/cotes2020/jekyll-theme-chirpy)
- chirpy 示例：<https://chirpy.cotes.page/>

### 基于 chirpy-starter 主题

- 打开 [GitHub - cotes2020/chirpy-starter](https://github.com/cotes2020/chirpy-starter)
- 点击右上角的 `Use this template`

### 定制的 chirpy 主题

#### NichtsHsu/nichtshsu.github.io

[NichtsHsu/nichtshsu.github.io](https://github.com/NichtsHsu/nichtshsu.github.io)（这个仓库提供了一些 Chirpy 的定制化示例，例如添加 Waline 评论系统、知乎式 404 页面等）。

#### halo-theme-chirpy

[主题使用文档 · AirboZH/halo-theme-chirpy Wiki · GitHub](https://github.com/AirboZH/halo-theme-chirpy/wiki/%E4%B8%BB%E9%A2%98%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)

## just-the-docs

#### 介绍

**Just the Docs** 是一个专注于文档站点的 Jekyll 主题，特别适合用来创建层级文档站点。它的多级目录支持非常强大，可以很好地展示结构化的文档内容。

- **多级目录支持**：它自动为页面生成侧边栏导航，能够正确处理多级目录层次。
- **Obsidian 兼容性**：适合展示 Markdown 文件，因此非常适合与 Obsidian 笔记的导出结合使用。你可以将 Obsidian 笔记导出为 Markdown 格式，并通过 Jekyll 将其呈现为一个有层级结构的文档网站。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501060042216.png)

#### Ref

[GitHub - just-the-docs/just-the-docs: A modern, high customizable, responsive Jekyll theme for documentation with built-in search.](https://github.com/just-the-docs/just-the-docs)

## beautiful-jekyII

效果：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501180008269.png)

- [GitHub - daattali/beautiful-jekyll: ✨ Build a beautiful and simple website in literally minutes. Demo at https://beautifuljekyll.com](https://github.com/daattali/beautiful-jekyll)

#### `_config.yml` 配置

```yml
###########################################################
### Welcome to Beautiful Jekyll!
### This config file is meant for settings that affect your entire website. When you first
### set up your website you should go through all these settings and edit them, but after
### the initial set up you won't need to come back to this file often.
###########################################################

############################
# --- Required options --- #
############################

# Name of website
title: 大圣

# Your name to show in the footer
author: hacket

###############################################
# --- List of links in the navigation bar --- #
###############################################

navbar-links:
  大圣的数字花园: "https://garden.hacket.me"
  Resources:
    - Github: "https://github.com/hacket/"
    - Beautiful Jekyll: "https://beautifuljekyll.com"
    - Learn markdown: "https://www.markdowntutorial.com/"
  About Me: "aboutme"

################
# --- Logo --- #
################

# Image to show in the navigation bar - works best with a square image
# Remove this parameter if you don't want an image in the navbar
avatar: "/assets/img/avatar-icon.png"

# By default, the image is cut into a circle. You can disable this behaviour by setting 'round-avatar: false'
round-avatar: true

# If you want to have an image logo in the top-left corner instead of having the title of the website,
# then specify the following parameter
#title-img: /path/to/image


#####################################
# --- Footer social media links --- #
#####################################

# Select the social network links that you want to show in the footer.
# You can change the order that they show up on the page by changing the order here.
# Uncomment the links you want to show and add your information to each one.
social-network-links:
  email: "shengfanzeng@gmail.com"
  rss: true  # remove this line if you don't want to show an RSS link at the bottom
  facebook: hacketzeng
  github: hacket
  twitter: hacket
#  patreon: DeanAttali
#  youtube: "@daattali"
#  whatsapp: 15551212
#  medium: yourname
#  reddit: yourname or r/yoursubreddit
#  linkedin: daattali
#  xing: yourname
#  stackoverflow: "3943160/daattali"
#  snapchat: deanat78
#  instagram: deanat78
#  spotify: yourname
#  telephone: +14159998888
#  steam: deanat78
#  twitch: yourname
#  yelp: yourname
#  telegram: yourname
#  calendly: yourname
#  mastodon: instance.url/@username
#  bluesky: yourname
#  ORCID: your ORCID ID
#  google-scholar: your google scholar
#  discord: "invite_code" or "users/userid" or "invite/invite_code"
#  kaggle: yourname
#  hackerrank: yourname
#  gitlab: yourname
#  itchio: yourname
#  untappd: yourname

# If you want your website to generate an RSS feed, provide a description
# The URL for the feed will be https://<your_website>/feed.xml
rss-description: This website is a virtual proof that I'm awesome

###########################
# --- General options --- #
###########################

# Select which social network share links to show in posts
share-links-active:
  twitter: true
  facebook: true
  linkedin: true
  vk: false

# How to display the link to your website in the footer
# Remove this if you don't want a link in the footer
url-pretty: "MyWebsite.com"

# Add the website title to the title of every page
title-on-all-pages: true

# Excerpt word length - Truncate the excerpt of each post on the feed page to the specified number of words
excerpt_length: 50

# Whether or not to show an excerpt for every blog post in the feed page
feed_show_excerpt: true

# Whether or not to show a list of tags below each post preview in the feed page
feed_show_tags: true

# Add a search button to the navbar
post_search: true

# Add a button in the footer to edit the current page. Only works if your website is hosted on GitHub
edit_page_button: true

# Allow sub-menu items (second-level navigation menu items) to be longer than the top-level menu
# If this setting is off, then long sub-menu words might get cut off
# See https://github.com/daattali/beautiful-jekyll/issues/765 to understand the issue this setting can solve
navbar-var-length: false

# The keywords to associate with your website, for SEO purposes
#keywords: "my,list,of,keywords"

######################################
# --- Colours / background image --- #
######################################

# Personalize the colours in your website. Colour values can be any valid CSS colour

page-col: "#FFFFFF"
text-col: "#404040"
link-col: "#008AFF"
hover-col: "#0085A1"
navbar-col: "#EAEAEA"
navbar-text-col: "#404040"
navbar-border-col: "#DDDDDD"
footer-col: "#EAEAEA"
footer-text-col: "#777777"
footer-link-col: "#404040"
footer-hover-col: "#0085A1"

# Alternatively, the navbar, footer, and page background can be set to an image
# instead of colour

#navbar-img: "/assets/img/bgimage.png"
#footer-img: "/assets/img/bgimage.png"
#page-img: "/assets/img/bgimage.png"

# Suggest a colour for mobile browsers to use as the browser's theme. This is only supported by a few mobile browsers.
#mobile-theme-col: "#0085A1"

# For any extra visual customization, you can include additional CSS files in every page on your site. List any custom CSS files here
#site-css:
#  - "/assets/css/custom-styles.css"

# If you have common JavaScript files that should be included in every page, list them here
#site-js:
#  - "/assets/js/custom-script.js"

#################################
# --- Web Analytics Section --- #
#################################

# Fill in your Google Analytics tag ID (or "Measurement ID") to track your website usage
#gtag: "G-XXXXXXXXXX"

# Fill in your Cloudflare Analytics beacon token to track your website using Cloudflare Analytics
#cloudflare_analytics: ""

# Google Tag Manager ID
#gtm: ""

# Matomo (aka Piwik) Web statistics
# Uncomment the following section to enable Matomo. The opt-out parameter controls
# whether or not you want to allow users to opt out of tracking.
#matomo:
#  site_id: "9"
#  uri: "demo.wiki.pro"
#  opt-out: true

# Google Universal Analytics ID -- deprecated
# As of July 2023 this is no longer supported by Google! If you are still using `google_analytics`,
# you should switch to using the `gtag` field above instead.
#google_analytics: "UA-XXXXXXXX-X"

####################
# --- Comments --- #
####################

# To use Disqus comments, sign up to https://disqus.com and fill in your Disqus shortname (NOT the userid)
#disqus: ""

# To use Facebook Comments, create a Facebook app and fill in the Facebook App ID
#fb_comment_id: ""

# To use CommentBox, sign up for a Project ID on https://commentbox.io
#commentbox: "" # Project ID, e.g. "5694267682979840-proj"

# To use Utterances comments: (0) uncomment the following section, (1) fill in
# "repository" (make sure the repository is public), (2) Enable Issues in your repository,
# (3) Install the Utterances app in your repository https://github.com/apps/utterances
# See more details about the parameters below at https://utteranc.es/
#utterances:
#  repository: # GitHub username/repository eg. "daattali/beautiful-jekyll"
#  issue-term: title   # Mapping between blog posts and GitHub issues
#  theme: github-light # Utterances theme
#  label: blog-comments # Label that will be assigned to GitHub Issues created by Utterances

# To use Staticman comments, uncomment the following section. You may leave the reCaptcha
# section commented if you aren't using reCaptcha for spam protection.
# Using Staticman requires advanced knowledge, please consult
# https://github.com/eduardoboucas/staticman/ and https://staticman.net/ for further
# instructions. For any support with staticman please direct questions to staticman and
# not to BeautifulJekyll.
#staticman:
#  repository : # GitHub username/repository eg. "daattali/beautiful-jekyll"
#  branch     : master # If you're not using `master` branch, then you also need to update the `branch` parameter in `staticman.yml`
#  endpoint   : # URL of your deployment, with a trailing slash eg. "https://<your-api>/v3/entry/github/"
#  reCaptcha:   # (optional, set these parameters in `staticman.yml` as well)
#    siteKey  : # You need to apply for a site key on Google
#    secret   : # Encrypt your password by going to https://<your-own-api>/v3/encrypt/<your-site-secret>

# To use giscus comments:
# (0) Uncomment the following giscus section, (1) Enable Discussions in your GitHub repository,
# (2) Install the giscus app in your repository (details at https://giscus.app),
# (3) Fill in *all* the parameters below
# See more details about giscus and each of the following parameters at https://giscus.app
#giscus:
#  hostname: giscus.app # Replace with your giscus instance's hostname if self-hosting
#  repository: # GitHub username/repository eg. "daattali/beautiful-jekyll"
#  repository-id: # ID of your repository, retrieve this info from https://giscus.app
#  category: Announcements # Category name of your GitHub Discussion posts
#  category-id: # ID of your category, retrieve this info from https://giscus.app
#  mapping: pathname
#  reactions-enabled: 1
#  emit-metadata: 0
#  theme: light

################
# --- Misc --- #
################

# Ruby Date Format to show dates of posts
date_format: "%B %-d, %Y"

# Facebook App ID
#fb_app_id: ""

#################################################################################
# --- You don't need to touch anything below here (but you can if you want) --- #
#################################################################################

# Output options (more information on Jekyll's site)
timezone: "America/Toronto"
markdown: kramdown
highlighter: rouge
permalink: /:year-:month-:day-:title/
paginate: 5

kramdown:
  input: GFM

# Default YAML values (more information on Jekyll's site)
defaults:
  -
    scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      comments: true  # add comments to all blog posts
      social-share: true # add social media sharing buttons to all blog posts
  -
    scope:
      path: "" # any file that's not a post will be a "page" layout by default
    values:
      layout: "page"

# Exclude these files from production site
exclude:
  - CHANGELOG.md
  - CNAME
  - Gemfile
  - Gemfile.lock
  - LICENSE
  - README.md
  - screenshot.png
  - docs/

plugins:
  - jekyll-paginate
  - jekyll-sitemap

# Beautiful Jekyll / Dean Attali
# 2fc73a3a967e97599c9763d05e564189
```

# 遇到的问题

## Github Actions Test site 失败：htmlproofer

- htmlproofer 会校验 url 链接是否有效
- 下面的错误由于 htmlproofer 不存在，被我注释掉了
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501080844739.png)

解决：`.github\workflows\pages-deploy.yml` 注释掉 `Test site` 任务

```yaml
# - name: Test site
#   run: |
#     bundle exec htmlproofer _site \
#       \-\-disable-external \
#       \-\-ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"
```

## Liquid Warning: Liquid syntax error

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501170812366.png)

- 将带双大括号的，用代码块包裹。
- 或者用截图
- 获取将 2 个大括号分开，如加个空格

## tag 包含 `#!!` 报错

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501170904425.png)

## Github Pages + JekyII 显示默认 index.html

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501180919464.png)

## Liquid Exception: undefined method `gsub` for an instance of Integer

使用的主题：[GitHub - cotes2020/chirpy-starter: A website startup template using the Chirpy theme gem.](https://github.com/cotes2020/chirpy-starter)，

Github Pages 问题：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501190153895.png)

解决：yaml 的 `categories` 不要有个多个，保留一个

Ref: [common.rb:304:in escape: undefined method gsub for ... (NoMethodError) - T.I.D.](https://tokkonopapa.github.io/blog/2013/02/03/jekyll-error-of-common-rb/)
