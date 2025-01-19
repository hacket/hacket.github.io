---
date_created: Friday, February 23rd 2024, 10:10:45 pm
date_updated: Monday, January 20th 2025, 12:24:24 am
title: ContentProvider 中做应用初始化
author: hacket
categories:
  - Android
category: Android基础
tags: []
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:26:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:46:41 晚上
image-auto-upload: true
feed: show
format: list
aliases: [ContentProvider 中做应用初始化]
linter-yaml-title-alias: ContentProvider 中做应用初始化
---

# ContentProvider 中做应用初始化

## 在 ContentProvider 中做应用初始化

- 原理<br />我们都知道 `ContentProvider` 的 onCreate 的调用时机介于 Application 的 attachBaseContext 和 onCreate 之间，Provider 的 onCreate 优先于 Application 的 onCreate 执行，并且此时的 Application 已经创建成功，而 Provider 里的 context 正是 Application 的对象,`Lifecycle` 这么做，把 init 的逻辑放到库内部，让调用方完全不需要在 Application 里去进行初始化了，十分方便。
- 定义 ContentProvider

```kotlin
@RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
internal class DebugToolsProvider : ContentProvider() {

    override fun onCreate(): Boolean {
        Log.i(DebugTools.TAG, "[DebugToolsProvider onCreate]" +
                "run adb shell am broadcast -a club.jinmei.mgvoice.debug to install DebugTools")
        context.registerReceiver(object : BroadcastReceiver() {
            var installed: Boolean = false
            override fun onReceive(context: Context?, intent: Intent?) {
                if (!installed) {
                    DebugTools.init(context!!)
                    Toast.makeText(context, "debug tools初始化", Toast.LENGTH_SHORT)
                            .show()
                    installed = true
                } else {
                    Toast.makeText(context, "debug tools已开启了，不要重复初始化", Toast.LENGTH_LONG)
                            .show()
                }
            }
        }, IntentFilter("club.jinmei.mgvoice.debug"))
        return true
    }

    override fun query(uri: Uri, projection: Array<String>?, selection: String?, selectionArgs: Array<String>?, sortOrder: String?): Cursor? {
        return null
    }

    override fun getType(uri: Uri): String? {
        return null
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

}
```

- 清单文件注册<br />使用 ContentProvider 初始化的方式，我们需要注意一下几点：<br />首先，在 Manifest 里设置 ContentProvider 的时候要设置一个 authorities，这个 authorities 相当于 ContentProvider 的标识，是不能重复的，为了保证不重复，我们再设置这个值的时候最好不要硬编码，而是使用以下的这种方式：使用 appid+xxx

```xml
<application>
    <provider
            android:name=".DebugToolsProvider"
            android:authorities="${applicationId}.debugtools.autopilot"
            android:exported="false" />
</application>
```

## 使用 ContentProvider 初始化的库

- SAK<br /><https://github.com/android-notes/SwissArmyKnife>
- LeakCanary2.0
- Lifecycle

## Ref

- 一个小技巧——使用 ContentProvider 初始化你的 Library<br />[http://zjutkz.net/2017/09/11/一个小技巧——使用ContentProvider初始化你的Library/](http://zjutkz.net/2017/09/11/%E4%B8%80%E4%B8%AA%E5%B0%8F%E6%8A%80%E5%B7%A7%E2%80%94%E2%80%94%E4%BD%BF%E7%94%A8ContentProvider%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BD%A0%E7%9A%84Library/)
