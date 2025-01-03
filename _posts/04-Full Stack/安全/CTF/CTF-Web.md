---
date created: 2024-08-27 00:37
date updated: 2024-12-26 00:19
dg-publish: true
---

# 基础知识类题目

考察基本的查看网页源代码、HTTP请求、修改页面元素等。
实际做题的时候基本都是和其他更复杂的知识结合起来出现。
还有要记住一些`=0`的试试可以改成`1`，因为`0`是`false`，`1`是`ture`

## 查看网页源代码

按`F12`就都看到了，flag一般都在`注释`里，有时候注释里也会有一条hint或者是对解题有用的信息。

## 发送HTTP请求

## 不常见类型的请求发送

以前做过一道题考 `OPTIONS` 请求(也可能是你公司的名称或缩写)。不过如果要发送这类请求，写一个脚本应该就能解决了。

可以使用 `burpsuite`，给请求方式，列如：请求方式那一题需要把 `GET` 方式改成 `CTFHUB`，可以用 `burpsuite` 改，可以使用 `curl -X CTFHUB 网址`

# HTTP头相关的题目

主要是查看和修改HTTP头。

## 查看响应头

有时候响应头里会有hint或者题目的关键信息，也有的时候会直接把flag放在响应头里给你，但是直接查看响应头拿flag的题目并不多，因为太简单了。

只是查看的话，可以不用抓包，用F12的“网络”标签就可以解决了。

## 修改请求头、伪造Cookie

常见的有`set-cookie`、`XFF`和`Referer`，总之考法很灵活，做法比较固定，知道一些常见的请求头再根据题目随机应变就没问题了。

有些题目还需要伪造Cookie，根据题目要求做就行了。

可以用BurpSuite抓包，也可以直接在浏览器的F12“网络”标签里改

## 备份文件下载

通常是index.php.swp、.index.php.swp、[www.zip、robots.txt之类的](http://www.zip、robots.txt之类的)\
注意看不出来是什么可以放到kali里面试试，例如：vim的缓存文件用vim -r 可以恢复，.DS_Store文件可以用cat命令看看有没有什么文件，好像也有脚本可以修复

# Ref

- [ ] [001-CTF web题型解题技巧-第一课 解题思路.pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/001-CTF%20web%E9%A2%98%E5%9E%8B%E8%A7%A3%E9%A2%98%E6%8A%80%E5%B7%A7-%E7%AC%AC%E4%B8%80%E8%AF%BE%20%E8%A7%A3%E9%A2%98%E6%80%9D%E8%B7%AF.pdf)

- [ ] [002-CTF web题理论基础篇-第二课理论基础.pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/002-CTF%20web%E9%A2%98%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80%E7%AF%87-%E7%AC%AC%E4%BA%8C%E8%AF%BE%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.pdf)

- [ ] [003-CTF web题型解流量分析-第三课 工具使用-流量分析.pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/003-CTF%20web%E9%A2%98%E5%9E%8B%E8%A7%A3%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90-%E7%AC%AC%E4%B8%89%E8%AF%BE%20%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8-%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90.pdf)

- [ ] [004-CTF web题型解题技巧-第四课 web总结.pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/004-CTF%20web%E9%A2%98%E5%9E%8B%E8%A7%A3%E9%A2%98%E6%8A%80%E5%B7%A7-%E7%AC%AC%E5%9B%9B%E8%AF%BE%20web%E6%80%BB%E7%BB%93.pdf)

- [ ] [005-CTF web题型总结-第五课 CTF WEB实战练习(一).pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/005-CTF%20web%E9%A2%98%E5%9E%8B%E6%80%BB%E7%BB%93-%E7%AC%AC%E4%BA%94%E8%AF%BE%20CTF%20WEB%E5%AE%9E%E6%88%98%E7%BB%83%E4%B9%A0(%E4%B8%80).pdf)

- [ ] [006-CTF web题型总结-第六课 CTF WEB实战练习(二) .pdf](https://potato.gold/data/uploads/pdf/CTF/Web%E8%B5%84%E6%96%99/006-CTF%20web%E9%A2%98%E5%9E%8B%E6%80%BB%E7%BB%93-%E7%AC%AC%E5%85%AD%E8%AF%BE%20CTF%20WEB%E5%AE%9E%E6%88%98%E7%BB%83%E4%B9%A0(%E4%BA%8C)%20.pdf)
