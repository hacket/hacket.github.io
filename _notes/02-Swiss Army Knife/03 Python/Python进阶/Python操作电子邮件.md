---
date created: 2024-12-27 23:48
date updated: 2024-12-27 23:48
dg-publish: true
---

# SMTP发送邮件

SMTP是发送邮件的协议，Python内置对SMTP的支持，可以发送纯文本邮件、HTML邮件以及带附件的邮件。

Python对SMTP支持有smtplib和email两个模块，email负责构造邮件，smtplib负责发送邮件。

[SMTP发送邮件](https://www.liaoxuefeng.com/wiki/1016959663602400/1017790702398272)

# POP3收取邮件

收取邮件就是编写一个**MUA**作为客户端，从**MDA**把邮件获取到用户的电脑或者手机上。收取邮件最常用的协议是**POP**协议，目前版本号是3，俗称**POP3**。

Python内置一个`poplib`模块，实现了POP3协议，可以直接用来收邮件。

注意到POP3协议收取的不是一个已经可以阅读的邮件本身，而是邮件的原始文本，这和SMTP协议很像，SMTP发送的也是经过编码后的一大段文本。

要把POP3收取的文本变成可以阅读的邮件，还需要用`email`模块提供的各种类来解析原始文本，变成可阅读的邮件对象。

所以，收取邮件分两步：

- 第一步：用`poplib`把邮件的原始文本下载到本地；

- 第二步：用`email`解析原始文本，还原为邮件对象。

[POP3收取邮件](https://www.liaoxuefeng.com/wiki/1016959663602400/1017800447489504)
