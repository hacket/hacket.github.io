---
date created: 2024-08-15 11:27
date updated: 2024-12-24 00:40
dg-publish: true
---

# 已经 Root 的手机

## 找到程序的包名

```shell
adb shell pm list packages
package:android
package:cn.wps.moffice
package:com.android.backupconfirm
package:com.android.bluetooth
package:com.android.browser
package:com.android.calculator2
package:com.android.camera
package:com.android.certinstaller
package:com.android.contacts
package:com.einnovation.temu
```

## 找到 apk 的位置

```shell
adb shell pm path com.einnovation.temu
package:/data/app/~~4lL8HzrNoc2xW7Ngk3VjeA==/com.einnovation.temu-yeBCf25O8oPx4IJXYNXdWg==/base.apk
package:/data/app/~~4lL8HzrNoc2xW7Ngk3VjeA==/com.einnovation.temu-yeBCf25O8oPx4IJXYNXdWg==/split_config.arm64_v8a.apk
package:/data/app/~~4lL8HzrNoc2xW7Ngk3VjeA==/com.einnovation.temu-yeBCf25O8oPx4IJXYNXdWg==/split_config.xxxhdpi.apk
```

## pull 出来

```shell
adb pull /data/app/~~4lL8HzrNoc2xW7Ngk3VjeA==/com.einnovation.temu-yeBCf25O8oPx4IJXYNXdWg==/base.apk ~/downloads/
```
