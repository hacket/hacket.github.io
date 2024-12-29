---
date created: 2024-12-24 00:26
date updated: 2024-12-24 00:26
dg-publish: true
---

# ContentProvider 中做应用初始化

## 在ContentProvider 中做应用初始化

- 原理<br />我们都知道`ContentProvider`的onCreate的调用时机介于Application的attachBaseContext和onCreate之间，Provider的onCreate优先于Application的onCreate执行，并且此时的Application已经创建成功，而Provider里的context正是Application的对象,`Lifecycle`这么做，把init的逻辑放到库内部，让调用方完全不需要在Application里去进行初始化了，十分方便。
- 定义ContentProvider

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

- 清单文件注册<br />使用ContentProvider初始化的方式，我们需要注意一下几点：<br />首先，在Manifest里设置ContentProvider的时候要设置一个authorities，这个authorities相当于ContentProvider的标识，是不能重复的，为了保证不重复，我们再设置这个值的时候最好不要硬编码，而是使用以下的这种方式：使用appid+xxx

```xml
<application>
    <provider
            android:name=".DebugToolsProvider"
            android:authorities="${applicationId}.debugtools.autopilot"
            android:exported="false" />
</application>
```

## 使用ContentProvider初始化的库

- SAK<br /><https://github.com/android-notes/SwissArmyKnife>
- LeakCanary2.0
- Lifecycle

## Ref

- 一个小技巧——使用ContentProvider初始化你的Library<br />[http://zjutkz.net/2017/09/11/一个小技巧——使用ContentProvider初始化你的Library/](http://zjutkz.net/2017/09/11/%E4%B8%80%E4%B8%AA%E5%B0%8F%E6%8A%80%E5%B7%A7%E2%80%94%E2%80%94%E4%BD%BF%E7%94%A8ContentProvider%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BD%A0%E7%9A%84Library/)
