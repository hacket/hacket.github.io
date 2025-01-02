---
date created: 2024-12-24 00:45
date updated: 2024-12-24 00:45
dg-publish: true
---

# adb 绕过非公开API(私有API)检查

```shell
# // 临时关闭非公开 API 的检查。
adb shell settings put global hidden_api_policy 0
```

如果遇到报错：<br />![](https://note.youdao.com/yws/res/79393/61CFF3641F9D42A19C716BEA5850D430#id=vqxUd&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

在`开发者选项` → `USB调试(安全设置)`开启就可以了。

# 绕过AndroidP反射限制(灰名单)

<https://github.com/Guolei1130/android_p_no_sdkapi_support>

# 开源库

## FreeReflection

<https://github.com/tiann/FreeReflection>

A library that lets you use reflection without any restriction above Android P
