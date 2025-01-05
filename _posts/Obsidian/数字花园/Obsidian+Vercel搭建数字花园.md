---
date created: 2024-12-29 23:12
date updated: 2024-12-29 23:13
dg-publish: true
---

# 利用 Obsidian 搭建自己的 Digital Garden

## Obsidian

### 创建 Obsidian Vault

- 存在一个 Obsidian Vault

### 安装 Digital Garden 插件

搜索：`digital garden`

## Github

### 注册 Github 账号

- Github 注册地址：<https://github.com/signup?user_email=&source=form-home-signup>
- 作用：Github 上创建的仓库用来存储你后续发布的笔记；通过 `Digital Gardne` 插件发布到 Github

### 创建 Github Token

登录 github 后，点击个人头像点击 `Settings`，依次选择 `Developer Settings` —> `Personal access tokens` —> `Tokens(classic)` —> `Generate new token(classic)`. 按照如图所示创建自己的 token (这个 token 将被用来从 Obsidian 访问你 github 的私有仓库)。关于过期时间的选择，为了避免频繁更换，建议选择长期，但如果处于安全考虑，也可以选择其他选项。

注意：这个 token 创建后记得保存，因为仅有一次可见的机会。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260055832.png)

### 创建 Github 私有仓库并部署到 vercel

- 打开<https://github.com/oleeskild/digitalgarden>，击 Deploy 直接部署。

![  ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260057544.png)

- 将会跳转到 vercel 界面，点击 `Create` ，创建 github 仓库，并进行 vercel 部署配置。

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260058095.png)

- 自动部署，等待完成将会看到如下界面：

![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260058332.png)
因为现在你刚刚创建的 github 仓库没有任何笔记，所以显示 `There is nothing here`. Vercel 给你的网站自动生成了域名，你可以用这个域名来访问你刚刚搭建的网站 (这个就是你的数字花园)。

## 配置 Digital Garden 插件

在 Obsidian 的 Digital Garden 插件中进行简单的配置，并发布你的第一篇笔记到你的数字花园。简单配置如下：
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260101199.png)
配置信息无误后，你会发现图中的 4 号标识会从以前的 x 变成上图所示，说明你的 Obsidian 已经能通过 Digital Garden 插件访问你的 github 仓库了。

## 发布笔记

```shell
---
date created: 2024-12-23 00:56
date updated: 2024-12-25 17:30
dg-home: true
dg-publish: true
---
第一篇笔记
```

- `dg-publish: true` 表示你的这篇笔记是要发布到你的数字花园。
- `dg-home` 表示该笔记是你数字花园的主页 (输入域名默认打开的页面)

按照如图所示勾选你要发布的笔记，选择 `PUBLISH SELECTED` 。等待完成。
![ ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260104468.png)
如此操作后，该发布的笔记会被提交到你前面所创建的 github 仓库（digitalgarden）。一旦该仓库有新的提交，那么 vercel 会自动部署最新的依次提交。一般等两三分钟后，点击你的域名，你就可以在网站中看到你刚刚写的笔记了。
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260105684.png)

## 优化事项

## 域名

### 购买域名

### 腾讯云自定义域名解析

我是在 `godaddy` 买的域名，但 DNS 解析设置的是腾讯云服务器，所以需要在腾讯云云平台操作域名解析。

添加一条 `CNAME` 解析到 `vercel.app` 的主机。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412230840888.png)

## Vercel

### 注册 vercel 账号

- vercel 注册地址：<https://vercel.com/signup>
- 作用：vercel 用来部署你的 Github 仓库成为一个网站，最终实现你的数字花园

<https://vercel.com/hackets-projects/digitalgarden>

### 添加自定义域名

- 现在 DNS 添加一条 `CNAME` 的域名解析到 vercel 的域名
- 将域名配置的 Domains 下

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412260034846.png)

## 遇到的问题

### 跨域

问题描述：数字花园中有语雀 cdn 上的图片，显示不出来，跨域了

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412281341423.png)

**解决：** 添加一些 header

Vercel 创建 deplayment 时可能还会报错：
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412281349712.png)

完整的 `vercel.json` 文件：

```json
{
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run start",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Origin, X-Requested-With, Content-Type, Accept"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/dist/$1"
    },
    {
      "source": "/404",
      "destination": "/dist/404.html"
    }
  ]
}
```

**注意：** 比如你的笔记是从语雀迁移过来的，有的图片还是语雀 cdn 的，这种方式解决不了跨域的问题

# Ref

- [Digital Garden - Publish Obsidian Notes For Free](https://dg-docs.ole.dev/)
- [利用Obsidian搭建自己的Digital Garden | Charley の Blog](https://blog.rahc.top/article/tech-share-mydigitalgarden#19e3f794b76b4467970b1bda92890230)
