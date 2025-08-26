---
banner: 
date_created: Tuesday, July 8th 2025, 11:33:14 pm
date_updated: Wednesday, July 9th 2025, 11:17:38 pm
title: Claw Cloud Run
author: hacket
categories:
  - 云
category: 
tags: []
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
aliases: [Claw Cloud Run]
linter-yaml-title-alias: Claw Cloud Run
---

# Claw Cloud Run

<https://console.run.claw.cloud/signin?link=CAJGED4CPI4M>

## Claw Cloud Run 是什么？

Claw Cloud。这是一家云服务公司，目前主要提供云服务器、游戏服务器等云产品。Claw Cloud Run 是其推出的云服务应用部署平台，类似于 Vercel、Railway 等，可以方便快捷地部署各种应用程序。

## Claw Cloud Run 能做什么？

Claw Cloud Run 主要提供云服务应用的部署功能，支持一键部署各种应用。可以用来 `部署网站`、`API`、`数据库`、`DevBox` 等。从 UI 看像是一个云操作系统，包括了应用市场、控制台、启动器等功能。

![20250708233801542](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250709230633396.png)

在 AppStore 中包含了大量的开源应用 (如 n8n)，可以一键部署，几乎 0 门槛，普通用户也可以轻松上手。

![20250708234150563](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250709230633399.png)

部署后如果需要公网服务也可以直接访问，对于非商业化项目来说是相当够用了。

## 使用

### 5 美元额度

Claw Cloud Run 从 4 月 1 日开始提供永久免费的云服务部署额度。目前，只要你的 GitHub 账号注册超过 180 天，通过 GitHub 注册即可享受每月 5 美元的免费额度，无需任何信用卡或其他认证。

你可以使用这些免费额度来部署各种服务和应用。应用市场提供了大量开源应用，支持一键部署。

**验证免费额度：**
如果不确定自己是否获得了永久免费额度，可在右上角菜单点击 _Plan_ 查看当前的计划，应该能看到如下界面：
![20250708234509162](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250709230633400.png)

如果看到 `Monthly Gift Credits` 中显示 $5，说明你已经获得了免费额度资格。如果没有显示，请在 `Account Setting` 中检查是否绑定了 GitHub 账号，或者 GitHub 账号是否超过 180 天。

## 部署

### 部署 CloudPaste

<https://github.com/ling-drag0n/CloudPaste?tab=readme-ov-file#ClawCloud-CloudPaste-Deployment-Tutorial>

#### 部署 backend

- cloud-page-backend
- 环境变量

```
NODE_ENV=production
RUNTIME_ENV=docker
PORT=9999
LOG_LEVEL=3
ENCRYPTION_SECRET=hacket
```

![20250709005228749](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250709230633401.png)

#### 部署 frontend

- cloud-paste-frontend
- 环境变量

```
lflzhkilpzzy.ap-northeast-1.clawcloudrun.com
```

- 截图
![20250709005620335](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250709230633402.png)
