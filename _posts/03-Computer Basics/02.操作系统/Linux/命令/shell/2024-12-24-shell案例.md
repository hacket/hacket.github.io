---
date created: 2024-12-24 00:14
date updated: 2024-12-24 00:14
dg-publish: true
tags:
  - '#!/bin/zsh'
  - '#要修改的字符串'
  - '#build.gradle配置文件所在目录'
  - '#拼接修改后的字符串'
  - '#获取行数,并保存到变量'
  - '#获取要修改的字符串所在行,并将它保存到变量line'
  - '#插入内容的位置'
  - '#删除指定行'
  - '#在指定行追加要字符串,并保存修改('
---

# 批量更新所有仓库代码、切换分支、创建分支

> 将当前.sh放到要操作的仓库平级，输入下面指令：
> 1 批量切换分支
> 2 批量创建新分支
> 默认：更新所有分支（其它输入或者直接回车）

[shell.sh](https://www.yuque.com/attachments/yuque/0/2023/sh/694278/1684138016606-df6a7dce-d718-4f92-b22d-02ce0da7f95a.sh?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fsh%2F694278%2F1684138016606-df6a7dce-d718-4f92-b22d-02ce0da7f95a.sh%22%2C%22name%22%3A%22shell.sh%22%2C%22size%22%3A13405%2C%22ext%22%3A%22sh%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u4d735b70-9012-47c2-abe7-13c1ae65e3a%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fx-sh%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22udadaa4dd%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

# 获取当前目录下所有git仓库的branch name

```shell
#!/bin/zsh
function gitLog(){
    curr_dir="."
    # dirs=$(ls $curr_dir)
    # echo $dirs
    for element in `ls $curr_dir`
        do
        dir_or_file=$curr_dir"/"$element
        if [ -d $dir_or_file ]
            then
            cd $dir_or_file 
            local_branch=$(git rev-parse --abbrev-ref HEAD)
            echo "$element $local_branch"  
            cd .. 
        fi
    done
}
BASEDIR=$(cd "$(dirname "$0")";pwd)
cd $BASEDIR
gitLog
```

# Shell案例

## 读取applicationId

### 读取applicationId并启动某个App

```shell
#!/bin/zsh
CUR_DIR=$(cd `dirname $0` && pwd -P)
echo 'relocation to project root dir'

# 读取gradle.properties(兼容不同在不同目录执行sh路径找不到问题，默认在remix项目根目录执行))
## 1. 项目根目录 sh sh/launch.sh 可选配置REMIX_HOME环境变量为remix项目根目录
## 2. cd到sh目录 ./launch.sh 必须配置REMIX_HOME环境变量为remix项目根目录
echo "REMIX_HOME=$REMIX_HOME"
gradle_properties_path=""
if [ "$REMIX_HOME" = "" ]; then
  gradle_properties_path="gradle.properties"
else
  gradle_properties_path="${REMIX_HOME}/gradle.properties"
fi
echo "gradle_properties_path=$gradle_properties_path"

# 读取applicationId的值
line=$(sed -n '/mj_applicationId/=' "$gradle_properties_path")
appId=$(sed -n "$line"'p' "$gradle_properties_path")
appId=${appId#*\=}
appId=${appId%,*}
length=${#appId}
# shellcheck disable=SC2003,SC2006,SC2086
last=`expr $length`
appId=${appId: 0: $last}
main="$appId/qsbk.app.remix.ui.SplashActivity"
echo "applicationId = $main"

# launch multiple mobiles SplashActivity
# shellcheck disable=SC2207
array=($(adb devices | tail -n +2 | cut -sf 1 | xargs -I {}))
for item in ${array[*]}
  do
    # 安装apk忽略掉wifi debug连接的设备
    if [[ $item != *":5555"* ]]; then
      adb -s $item shell am start -n $main -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
    fi
  done
```

## 通过shell修改build.gradle配置文件

### 需求

自动化打包前,修改版本号

### 思路如下

1. 获取要修改字符串在build.gradle配置文件的所在行
2. 整行删除旧字符串
3. 新将新字符串写入配置文件

### 技术点

1. sed读写配置文件
2. 获取指定字符串所在行
3. 将字符串写入配置文件指定位置(指定行)
4. 拼接字符串,字符串包含特殊符号,双隐号,单隐号,转义符号的使用

### 实战

build.gradle配置文件内容如下:

```groovy
defaultConfig {
    applicationId "com.wawj.app.t"
    //        applicationId "com.wawj.app.tt"
    minSdkVersion 16
    targetSdkVersion 26
    versionCode 20191226
    versionName "8.8.8" #要修改的字符串 
    testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunn$
    multiDexEnabled true
    //        resConfigs "en", "de", "fr", "it"git
    //        resConfigs "nodpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"
    ndk {
        //极光推送--选择要添加的对应cpu类型的.so库
        abiFilters 'xx', 'xx-xxxa', 'xxx'
    }
}
```

脚本：

```shell
cd AppFrameWork/app/ #build.gradle配置文件所在目录

VERSION=" versionName \"$Version\"" #拼接修改后的字符串

#获取行数,并保存到变量
line=$(sed -n '/versionName/=' build.gradle) #获取要修改的字符串所在行,并将它保存到变量line
echo "版本号所在行$line"

#插入内容的位置
newline=$(expr $line - 1)#计算要插入行的的行号,因后面使用 追加(注意不是插入)的方式将要修改的字符串 追加所在行,所以里这里要将line-1,写入字符串的位置才是准确的
#删除指定行
sed  -i  "$line  d"   build.gradle

#在指定行追加要字符串,并保存修改( -i表示保存修改)
sed -i "$newline a\\$VERSION" build.gradle
echo "修改的版本号是$VERSION"
```
