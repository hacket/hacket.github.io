---
date created: 2024-12-27 23:49
date updated: 2024-12-27 23:49
dg-publish: true
---
 
# Pycharm

## pip安装第三方库，但PyCharm中却无法识别

1. 通过`pip3 install gitpython`安装gitpython库，但在pycharm中无法识别
2. 原因是M2的mac默认的python3是在/usr/bin/python3，而你通过pip3安装的是在`/opt/homebrew/bin/python3`
3. 解决，将项目的interpreter改成`/opt/homebrew/bin/python3`

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1690963306337-65f28b26-acc1-4f1e-9a3d-0db2f9dd1739.png#averageHue=%233d4046&clientId=uf29fe18b-43e7-4&from=paste&height=302&id=uf07e041b&originHeight=1418&originWidth=1952&originalType=binary&ratio=2&rotation=0&showTitle=false&size=443800&status=done&style=none&taskId=u5c8cb531-1b79-49da-bd53-fb4403a2034&title=&width=416)
![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1699532089911-d6709fb6-f3ad-4587-98eb-0703abf468f6.png#averageHue=%232c2e32&clientId=u08894e32-163d-4&from=paste&height=713&id=u71e0d19c&originHeight=1426&originWidth=1970&originalType=binary&ratio=2&rotation=0&showTitle=false&size=439931&status=done&style=none&taskId=u8c0fd1b2-d614-40a7-be34-b61da677338&title=&width=985)
**pip install 安装路径问题**

> 这个是遵守“就近原则”的！
> 即：python安装目录解释器就用该目录下的库，项目的解释器就用项目里面的库！

## python已安装好第三方库，pycharm import时仍标红的解决办法

`pip install pymysql`之后导入import pymysql时候标红
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240229210638.png)

解决办法：
首先打开 Settings找到Project:untitled[这里untitled会是你自己的项目名称]
然后点击Project Interpreter-----》双击pip
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240229210734.png)
在输入框中搜索pymysql-----》点击Install Package
![image.png|500 ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240229210747.png)
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240229210754.png)
