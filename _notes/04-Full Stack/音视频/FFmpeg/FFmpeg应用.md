---
date created: 2024-12-26 00:19
date updated: 2024-12-26 00:19
dg-publish: true
tags:
  - '#!/bin/bash'
---

# 应用

## mp4转gif

```shell
#!/bin/bash
function getWidthAndHeight() {
    # adb shell wm size
    # Physical size: 1440x2560
    w=$(adb shell wm size | awk '{print $3}' | awk -F'x' '{print $1}')
    h=$(adb shell wm size | awk '{print $3}' | awk -F'x' '{print $2}')
    echo "${w}"x"${h}"
}
function checkffmpeg() {
    if brew ls --versions ffmpeg > /dev/null; then
        echo 'ffmpeg已安装'
    else
        echo 'ffmpeg未安装'
        echo '开始安装ffmpeg'
        brew install ffmpeg
    fi
}
function mp4togif() {
    read -p "请输入录制时间（单位秒）:" t
    if [ -z "$t" ]; then
        echo "录制时间不能为空"
        exit 1
    fi
    echo -e '录制时间为:' $t '秒'
    echo -e '开始录制' 
    adb shell screenrecord  --time-limit $t /sdcard/demo.mp4
    adb pull /sdcard/demo.mp4 

    # 获取时间戳
    currentTimeStamp=$(date +%s)
    echo $currentTimeStamp

    # 获取设备分辨率
    size=$(getWidthAndHeight)
    echo "设备分辨率：${size}"

    # 'ffmpeg转换' 
    ffmpeg -i demo.mp4 -s "$size" -r 10 target-$currentTimeStamp.gif
    # '删除缓存的视频' 
    rm -f demo.mp4
    # '输出打开我们最后的gif /r' 
    echo "$(cd `dirname $0`; pwd)"/target-$currentTimeStamp.gif
    open .
}
function main() {
    checkffmpeg
    mp4togif
}
main
```
