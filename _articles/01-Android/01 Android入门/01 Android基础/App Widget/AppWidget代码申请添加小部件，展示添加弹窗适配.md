---
date created: Friday, December 13th 2024, 9:04:00 pm
date updated: Saturday, January 4th 2025, 7:31:22 pm
title: AppWidget代码申请添加小部件，展示添加弹窗适配
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories:
  - Android
aliases: [官方]
linter-yaml-title-alias: 官方
---

# 官方

Android 8（Android 0，API 26）及以上系统⽀持代码添加桌⾯⼩部件。调⽤ `AppWidgetManager.requestPinAppWidget()` 即可。

```kotlin
private fun requestPinAppWidget(context: Context): Boolean {
    //Android8以下不支持
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false
    
    val appWidgetManager = AppWidgetManager.getInstance(context)

    //小组件的provider
    val provider = ComponentName(context, HelloWidgetProvider::class.java)

    //添加成功的广播
    val successBroadcast = PendingIntent.getBroadcast(
        context,
        0,
        Intent()
            .setComponent(provider)
            .setAction(ACTION_PIN_APP_WIDGET_SUCCESS), //这里为了方便，将广播发到HelloWidgetProvider
        PendingIntent.FLAG_UPDATE_CURRENT.toImmutableCompatFlag()
    )

    return try {
        //请求添加小部件，如果不支持的话会返回false，支持的话返回true
        appWidgetManager.requestPinAppWidget(
            provider,//添加的小部件provider
            null,
            successBroadcast//添加成功后会执行的intent
        )
    } catch (e: IllegalStateException) {
        // 没有存在前台的activity或者前台service会出现这个异常
        false
    }

}

private fun Int.toImmutableCompatFlag(): Int {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        this or PendingIntent.FLAG_IMMUTABLE
    } else {
        this
    }
```

# MiUi

- [x] [小部件规范 | 小米澎湃OS开发者平台](https://dev.mi.com/xiaomihyperos/documentation/detail?pId=1664)

## isRequestPinAppWidgetSupported

测试的几台 Android8.0 及以上的手机，都是返回的 true。

## requestPinAppWidget()

### 小米 6

- 小米 6 Android8.0 不支持
- 添加 `home screen shortcut` 权限也不行

### 小米 14

- 小米 14，Android 14，设置页 `home screen shortcut` 权限，可以代码添加，不用在 xml 声明 `INSTALL_SHORTCUT` 权限也可以

```xml
<uses-permission android:name="com.android.launcher.permission.INSTALL_SHORTCUT" />
<uses-permission android:name="com.android.launcher.permission.UNINSTALL_SHORTCUT" />
```

请求代码：

```kotlin
private fun addAppWidget() {
	val tv2 = findViewById<TextView>(R.id.tv_info)
	val appWidgetManager = AppWidgetManager.getInstance(this)
	val myProvider = ComponentName(this, AppWidgetSearchToolProvider::class.java)

	// 查询指定的 App Widget 提供者是否已经绑定
	if (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			appWidgetManager.isRequestPinAppWidgetSupported
		} else {
			Toast.makeText(this, "android8.0以下不支持代码添加widget", Toast.LENGTH_SHORT)
				.show()
			false
		}
	) {
		// 请求用户添加 app widget
		val pinnedWidgetCallbackIntent =
			Intent(this, AppWidgetRequestPinActivity::class.java).apply {
				action = "com.example.APPWIDGET_PINNED_CALLBACK"
			}
		// 第三个参数一个PendingIntent，在小组件添加成功后触发，可以根据需要做一些添加成功监听
		val successCallback = PendingIntent.getActivity(
			this, 0, pinnedWidgetCallbackIntent,
			PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
		)
		// 系统会显示一个对话框请求用户确认添加小部件。
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			val isSucceed =
				appWidgetManager.requestPinAppWidget(myProvider, null, successCallback)
			if (isSucceed) {
				Toast.makeText(this, "请求添加widget成功", Toast.LENGTH_SHORT).show()
			} else {
				Toast.makeText(this, "请求添加widget失败", Toast.LENGTH_SHORT).show()
			}
			tv2.append("\nandroid8.0以上支持代码添加widget, isSucceed=$isSucceed")
		} else {
			tv2.append("\nandroid8.0以下不支持代码添加widget")
		}
	}
}
```

`Home screen shortcuts` 权限情况：

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241213211854.png)

报错：

```
2024-12-13 21:17:35.871 4930  Launcher:WidgetView                 pid-4930                        W  onMiuiWidgetUpdate widget is not miuiWidget!
...
2024-12-13 21:17:41.718 4930  AddItemActivity-... TcutRequestUtils pid-4930                        D  mRequest=2
2024-12-13 21:17:41.721 4930  AddItemActivity-... TcutRequestUtils pid-4930                        E  add widget failed, a.me. Hacket. Demos has no permission
```

- [android - App widget dialog from Activity not showing in redmi phones - Stack Overflow](https://stackoverflow.com/questions/57781688/app-widget-dialog-from-activity-not-showing-in-redmi-phones)

### 其他小米设备

`RedMi Note 9 Pro` `Miui13` `Android12`

![|400](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20241213214455.png)

小米 15

### 小结

- 需要申请特殊权限：`Home screen shortcuts` 。
- 添加时没有展示确认弹窗，直接添加成功。
- 拉起 widget 商店 ：[小部件技术规范与系统能力说明 | 小米澎湃OS开发者平台](https://dev.mi.com/xiaomihyperos/documentation/detail?pId=1584#_16)
- 在 MIUI 13 以下的机型上，需要申请 `INSTALL_SHORTCUT(com.android.launcher.permission.INSTALL_SHORTCUT)` 才可以添加。待确认

[android - App widget dialog from Activity not showing in redmi phones - Stack Overflow](https://stackoverflow.com/questions/57781688/app-widget-dialog-from-activity-not-showing-in-redmi-phones)

# Vivo

Vivo 默认的 Launcher 无法添加。

参考 [Widget pinning not working with Android Huawei and Vivo devices - Stack Overflow](https://stackoverflow.com/questions/72492999/widget-pinning-not-working-with-android-huawei-and-vivo-devices), 好像没有解决方案。

# 华为

华为默认的 Launcher 无法添加。

参考 [Widget pinning not working with Android Huawei and Vivo devices - Stack Overflow](https://stackoverflow.com/questions/72492999/widget-pinning-not-working-with-android-huawei-and-vivo-devices), 好像没有解决方案。

# Oppo

- [OPPO 开放平台-OPPO开发者服务中心](https://open.oppomobile.com/new/developmentDoc/info?id=11733)

# Ref

- [【APP Widget】使用代码申请添加小部件，展示添加弹窗。申请添加小部件代码 。 Android 8及以上系统⽀持代 - 掘金](https://juejin.cn/post/7302241918351114274)
