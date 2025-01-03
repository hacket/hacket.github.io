---
date created: 星期三, 三月 6日 2024, 11:30:00 晚上
date updated: 星期四, 一月 2日 2025, 8:57:03 晚上
title: obsidian-git
dg-publish: true
image-auto-upload: true
feed: show
format: list
aliases: [obsidian -git]
linter-yaml-title-alias: obsidian -git
---

# obsidian -git

## Obsidian git

- 安装 Obsidian git 插件：<https://github.com/denolehov/obsidian-git>
- obsidian 默认安装目录：`~/Documents/Obsidian Vault`
- 在 Github 创建一个空仓库，将这个仓库 clone 到 `~/Documents/Obsidian Vault`

### 配置

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240222203345.png)

## Github 同步 Vault 配置忽略文件

1. `git rm --cached .obsidian/workspace.json`
2. 添加

```shell
# 工作台配置，如打开的文件
.obsidian/workspace.json

# obsidian-git插件配置
.obsidian/plugins/obsidian-git/data.json
```
