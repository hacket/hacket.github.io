---
date created: 2024-12-23 23:41
date updated: 2024-12-27 23:57
dg-publish: true
tags:
  - '#!/bin/bash'
---

# Beyond Compare4

## BC 4.3.7 Windows

- Windows亲测可用

<https://blog.csdn.net/ShelleyLittlehero/article/details/109058062>

## BC 在Mac OS系统下永久试用

1. **原理**

Beyond Compare每次启动后会先检查注册信息，试用期到期后就不能继续使用。解决方法是在启动前，先删除注册信息，然后再启动，这样就可以永久免费试用了。

2. **下载**

首先[下载Beyond Compare](https://www.scootersoftware.com/download.php)最新版本，链接如下：。

3. **安装**

下载完成后，直接安装。

4. **创建BCompare文件**
   1. 进入Mac应用程序目录下，找到刚刚安装好的Beyond Compare，路径如下`/Applications/Beyond Compare.app/Contents/MacOS`。
   2. 修改启动程序文件BCompare为BCompare.real。
   3. 在当前目录下新建一个文件BCompare，文件内容如下：

```shell
#!/bin/bash
rm "/Users/$(whoami)/Library/Application Support/Beyond Compare/registry.dat"
"`dirname "$0"`"/BCompare.real $@
```

5. **保存BCompare文件。**
6. **修改文件的权限：**

`chmod a+x /Applications/Beyond\ Compare.app/Contents/MacOS/BCompare`

7. 以上步骤完成后，再次打开Beyond Compare就可以正常使用了。

# BC操作

## 文件夹对比，不对比时间戳

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1683938006969-825af156-0562-4cce-89cf-ccaadcc50c23.png#averageHue=%23f8f5f5&clientId=u64778e6c-d8e1-4&from=paste&height=653&id=u435ccbcb&originHeight=1306&originWidth=1218&originalType=binary&ratio=2&rotation=0&showTitle=false&size=297480&status=done&style=none&taskId=u650387a0-6cb1-4c52-992c-5069e36f3fe&title=&width=609)
