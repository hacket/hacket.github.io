---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# 反编译工具

## apktool + dex2jar+ jadx三件套

- ApkTool：是一款应用在Apk上的逆向工程的工具，它有编译、反编译、签名等功能，可利用ApkTool查看apk的xml文件、AndroidManifest.xml和图片等。
- dex2jar：顾名思义，这款工具的作用主要是将dex文件转换成jar文件，转换成jar后我们才好借助JD-GUI来查看反编译dex后的代码；
- enjarify: 替代dex2jar？
- jadx：一款Java反编译器，通过它我们能查看到反编译后的dex的代码，通常需要配合dex2jar使用；

### apktool 提取apk资源

#### [安装](https://apktool.org/docs/install/)

Mac homebrew安装：

> brew install apktool

#### [参数 CLI Parameters](https://apktool.org/docs/cli-parameters)

##### Decoding Options 反编译

`apktool d(decode) file.apk _{options}_`

- -f, --force 如果目标文件夹已存在，则强制删除现有文件夹（默认如果目标文件夹已存在，则解码失败）
- -s, --no-src 不反编译dex文件，也就是说 classes.dex 文件会被保留（默认会将 dex 文件解码成 smali 文件）
- -r, --no-res

> apktool decode app-release-agp4.1.0.apk --force

APkTool只能将资源文件提取处理，对于.dex类型的文件是无法查看的，这里就需要用到dex2jar了<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692004902845-f2f5c84c-3de9-4a35-8bd8-ac9537b70673.png#averageHue=%23989998&clientId=u27d7b98e-75c8-4&from=paste&height=142&id=Ov1Mr&originHeight=284&originWidth=552&originalType=binary&ratio=2&rotation=0&showTitle=false&size=36767&status=done&style=none&taskId=u0e036dae-f585-444e-b6ea-6f7ef191bbf&title=&width=276)

##### Building Options 重新打包

- -o ：指定解码目标文件夹的名称（默认使用 APK 文件的名字来命名目标文件夹）
- -r ：不反编译资源文件，也就是说 resources.arsc 文件会被保留（默认会将 resources.arsc 解码成具体的资源文件）

#### 示例：使用 apktool 将我们反编译的app-debug.apk.zip.out文件夹重新打包成 apk

> apktool b app-debug.apk.zip.out -o new_app_debug.apk

### dex2jar

#### 安装

<https://sourceforge.net/projects/dex2jar/files/>

#### 使用

> sh d2j-dex2jar.sh classes.dex

#### 问题：不支持Android8及以上

现象：安卓8以上的apk需要修改版本号才能识别到，否则反编译会报错，有些类反编译不出<br />解决1：用SublimeText<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692004036214-86d48ece-f84f-4af5-be0f-2756c5530510.png#averageHue=%23565751&clientId=u27d7b98e-75c8-4&from=paste&height=107&id=u4bf32e71&originHeight=214&originWidth=844&originalType=binary&ratio=2&rotation=0&showTitle=false&size=117189&status=done&style=none&taskId=u198f41f7-2373-4fa0-8e42-fd8543c5a35&title=&width=422)<br />改成<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1692004047044-365f1adc-7fcf-4bf2-88cf-378e6e8ff802.png#averageHue=%23575852&clientId=u27d7b98e-75c8-4&from=paste&height=104&id=u911efec7&originHeight=208&originWidth=944&originalType=binary&ratio=2&rotation=0&showTitle=false&size=117906&status=done&style=none&taskId=uf0bb55db-dca8-44f8-9015-753d6039b12&title=&width=472)<br />解决2：<br />[支持Android8的dex2jar](https://github.com/DexPatcher/dex2jar)

### jadx

<https://github.com/skylot/jadx><br />mac homebrew安装：

> brew install jadx

## [ClassyShark](https://github.com/google/android-classyshark)

下载：<br /><https://github.com/google/android-classyshark/releases>

> jar -jar ClassyShark.jar -open apk路径

## 其他工具

### [TTDeDroid](https://github.com/tp7309/TTDeDroid)

一键反编译工具(不需要手动安装Python) One key for quickly decompile apk/aar/dex/jar, support by jadx/dex2jar/enjarify.
