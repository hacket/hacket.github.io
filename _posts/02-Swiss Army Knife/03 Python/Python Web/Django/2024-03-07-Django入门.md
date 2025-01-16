---
date created: 2024-03-07 00:01
date updated: 2024-12-27 23:48
dg-publish: true
---

# Django基础

[The web framework for perfectionists with deadlines | Django](https://www.djangoproject.com/)

## Django概述

Python的Web框架有上百个，比它的关键字还要多。所谓Web框架，就是用于开发Web服务器端应用的基础设施，说得通俗一点就是一系列封装好的模块和工具。事实上，即便没有Web框架，我们仍然可以通过socket或[CGI](https://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8%E7%BD%91%E5%85%B3%E6%8E%A5%E5%8F%A3)来开发Web服务器端应用，但是这样做的成本和代价在商业项目中通常是不能接受的。通过Web框架，我们可以化繁为简，降低创建、更新、扩展应用程序的工作量。刚才我们说到Python有上百个Web框架，这些框架包括Django、Flask、Tornado、Sanic、Pyramid、Bottle、Web2py、web.py等。

在上述Python的Web框架中，Django无疑是最有代表性的重量级选手，开发者可以基于Django快速的开发可靠的Web应用程序，因为它减少了Web开发中不必要的开销，对常用的设计和开发模式进行了封装，并对MVC架构提供了支持（Django中称之为MTV架构）。MVC是软件系统开发领域中一种放之四海而皆准的架构，它将系统中的组件分为模型（Model）、视图（View）和控制器（Controller）三个部分并借此实现模型（数据）和视图（显示）的解耦合。由于模型和视图进行了分离，所以需要一个中间人将解耦合的模型和视图联系起来，扮演这个角色的就是控制器。稍具规模的软件系统都会使用MVC架构（或者是从MVC演进出的其他架构），Django项目中我们称之为MTV，MTV中的M跟MVC中的M没有区别，就是代表数据的模型，T代表了网页模板（显示数据的视图），而V代表了视图函数，在Django框架中，视图函数和Django框架本身一起扮演了MVC中C的角色。
![image.png|1000](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403070007891.png)
Django框架诞生于2003年，它是一个在真正的应用中成长起来的项目，由劳伦斯出版集团旗下在线新闻网站的内容管理系统（CMS）研发团队（主要是Adrian Holovaty和Simon Willison）开发，以比利时的吉普赛爵士吉他手Django Reinhardt来命名。Django框架在2005年夏天作为开源框架发布，使用Django框架能用很短的时间构建出功能完备的网站，因为它代替程序员完成了那些重复乏味的劳动，剩下真正有意义的核心业务给程序员来开发，这一点就是对DRY（Don't Repeat Yourself）理念的最好践行。许多成功的网站和应用都是基于Python语言进行开发的，国内比较有代表性的网站包括：知乎、豆瓣网、果壳网、搜狐闪电邮箱、101围棋网、海报时尚网、背书吧、堆糖、手机搜狐网、咕咚、爱福窝、果库等，其中不乏使用了Django框架的产品。

## 安装

```shell
pip install Django
```

检查安装是否成功：

```shell
python3 -m django --version
```
