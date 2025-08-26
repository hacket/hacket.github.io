---
banner: 
date_created: Sunday, July 6th 2025, 8:28:31 am
date_updated: Sunday, August 3rd 2025, 1:56:40 am
title: Google Gemini API
author: hacket
categories:
  - AI
category: Gemini
tags: [AI, Gemini, VibeCoding]
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
aliases: [Genimi Api]
linter-yaml-title-alias: Genimi Api
---

# Genimi Api

## gemini-balance 代理 gemini api

<https://github.com/snailyp/gemini-balance>

### 服务器版安装

#### gemini-balance 安装

<https://gb-docs.snaily.top/>

- 申请 Gemini API，可申请多个账号轮换：<https://aistudio.google.com/>
- 修改 `.env` 文件，[示例](https://github.com/snailyp/gemini-balance/blob/main/.env.example)，修改 `API_KEYS` 和 `ALLOWED_TOKENS` 即可

```properties
# 数据库配置
DATABASE_TYPE=mysql
#SQLITE_DATABASE=default_db
MYSQL_HOST=gemini-balance-mysql
#MYSQL_SOCKET=/run/mysqld/mysqld.sock
MYSQL_PORT=3306
MYSQL_USER=gemini
MYSQL_PASSWORD=change_me
MYSQL_DATABASE=default_db
API_KEYS=["AIzaSyDX-xxx1","xxx2"]
ALLOWED_TOKENS=["sk-xxx"] # sk-xxx为自定义的token
```

- 编辑 `docker-compose.yaml`，复制<https://github.com/snailyp/gemini-balance/blob/main/docker-compose.yml>
- `sudo docker compose up -d`，就安装成功了
- 服务器 ip 地址 +8000 访问
![20250706002343589](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250706232445020.png)
- 验证令牌填 `ALLOWED_TOKENS` 的值 `sk-xxx`
- 配置：<http://43.159.135.247:8000/config>

#### Cherry Studio 配置

**添加自定义的 gemini-balance**
设置→模型服务→添加
- API 密钥为上面的 `ALLOWED_TOKENS`
- API 地址为：<http://43.159.135.247:8000>
- 添加模型
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707002516077.png)

在 Cherry Studio 的 Chat 使用

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707002747996.png)

- 然后在后台可以看到调用了 1 次
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707002818285.png)

### 免费无服务器版 ClawCloud

- [从零部署 Gemini Balance 手册之clawcloud上部署sqlite版本Gemini Balance](https://gb-docs.snaily.top/guide/setup-clawcloud-sqlite.html)

<https://run.claw.cloud/>

- 用 Google 账户注册登录
- 选择区域
- 配置环境变量: 配置 `API_KEYS` 和 `ALLOWED_TOKENS`

```properties
DATABASE_TYPE=sqlite
SQLITE_DATABASE=default_db
API_KEYS=["AIzaSyDX-nQQuao-Nhn8cYmXl-m11G9vpH3XslA","AIzaSyCvAxqjf1Lga7FsR0MJbAL4JHcf1sUIFKQ"]
ALLOWED_TOKENS=["sk-hacket"]
AUTH_TOKEN=
TZ=Asia/Shanghai
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707010029856.png)

- 右上角 deploy application，等待 20 min；部署好了 `public address` 就会出现一个公网地址
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707011349220.png)

## Clion

### 官方 Gemini Pro 2.5

- 每天 100 次限制
- 需要一直挂科学上网
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707231946265.png)

### 使用 Gemini balance

- 不需要挂科学上网
- 多个 API 轮流来

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250707234036488.png)

- 勾选 `Use custom base URL`，填写部署的 Gemini balance 服务器地址
- `Gemini API Key` 填写 `sk-hacket`
