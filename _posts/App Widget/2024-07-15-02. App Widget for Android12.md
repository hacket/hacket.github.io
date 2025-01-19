---
date created: Monday, July 15th 2024, 12:14:00 am
date updated: Monday, January 13th 2025, 11:37:40 pm
title: 02. App Widget for Android12
author: hacket
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
image-auto-upload: true
feed: show
format: list
categories:
  - Android
aliases: [Android 12 对 App Widget 的更改]
linter-yaml-title-alias: Android 12 对 App Widget 的更改
---

# Android 12 对 App Widget 的更改

- [x] [Enhance your widget](https://developer.android.com/develop/ui/views/appwidgets/enhance)

## Android 12 更改

## 选择和展示的统一变化

即使未做任何适配，在 12 上直接运行的小组件与 11 就有明显不同，主要表现在**选择器**和**展示**的效果。以 Chrome 和 Youtube Music 的小组件为例：

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407152342147.png)

可以看到 Android12 上的一些变化：

- 选择器
- 顶部悬浮**搜索框**，可以更加快速地找到目标小组件
- 小组件按照 App**自动折叠**，避免无关的小组件占用屏幕空间
- App 标题还对包含的**小组件数目**进行了提示
- 拖拽到桌面上之后小组件默认拥有**圆角设计**

Android11 及以下上的小组件选择器不支持搜索而且无法折叠，拖拽到桌面上也是初始的直角效果。

![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407152343455.png)

## 美观的圆角设计

Android 12 中的小部件具有圆角。当在运行 Android12 或更高版本的设备上使用应用小部件时，启动器会自动识别小部件的背景并将其裁剪为圆角。

但布局需要遵从如下两点建议：

- 四周的边角不要放置内容，防止被切掉
- 背景不要采用**透明的**、**空的视图或布局**，避免系统无法探测边界去进行裁切

事实上，系统预设了如下 `dimension` 以设置默认的圆角表现。

- `system_app_widget_background_radius`: 小组件背景的圆角尺寸，默认 `16dp`，上限 `28dp`
- `system_app_widget_inner_radius`: 小组件内部视图的圆角尺寸，默认 `8dp`，上限 `20dp`
- `system_app_widget_internal_padding`：内部视图的 `padding` 值，默认 `16dp`

看下官方的对于内外圆角尺寸的示意图。

![|300](https://developer.android.com/static/images/appwidgets/widget-weather.png)

**注意：**

1. 圆角的尺寸可能因设备而异，因为圆角半径的大小可由设备制造商（最大 16dp）和第三方启动器控制；不一定能保证一致性的尺寸
2. 官方没有说明小组件的内部视图如何才能应用上内部圆角尺寸，DEMO 确实也没有适配上，不知道是 ROM 的问题还是 App 的问题，有待后续的进一步研究

具体见：[[04. App Widget问题总结#Rounded corners 圆角]]

## Use dynamic colors 动态颜色 (设备主题)

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:background="?attr/colorPrimaryContainer"
  android:theme="@style/Theme.Material3.DynamicColors.DayNight">

  <ImageView
    ...
    app:tint="?attr/colorPrimaryContainer"
    android:src="@drawable/ic_partly_cloudy" />

    <!-- Other widget content. -->

</LinearLayout>
```

![|300](https://developer.android.com/static/images/appwidgets/example-lightmode.png) ![|300](https://developer.android.com/static/images/appwidgets/example-darkmode.png)

提示：我们建议使用 [Material 3](https://m3.material.io/) 主题并遵循 Material Design 指南，以确保设备之间的一致性和向后兼容性。

- [ ] [Use dynamic colors](https://developer.android.com/develop/ui/views/appwidgets/enhance#dynamic-colors)

**示例：** 给小组件添加暗黑主题支持即可自动适配动态色彩。

```xml
<!-- values/themes.xml -->
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.AppWidget" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        ...
    </style>
</resources>

<!-- values-night/themes.xml -->
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.AppWidget" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/purple_200</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/black</item>
        ...
    </style>
</resources>
```

![|300](https://z3.ax1x.com/2021/06/01/2KFt2j.gif)

- [ ] [Android 12 widget 改进  |  Android Developers](https://developer.android.com/about/versions/12/features/widgets#dynamic-colors)

## 启用语音支持

- [ ] [改进 widget  |  Views  |  Android Developers](https://developer.android.com/develop/ui/views/appwidgets/enhance#voice)

## preview 的改善

### previewLayout

Android12 之前只能使用 `previewImage` 属性展示一张预览图，功能迭代的过程中忘记更新它的话，可能导致预览和实际效果发生偏差。

Android12 新引入了 `previewLayout` 属性用以配置小组件的实际布局，使得用户能够在小组件的选择器里看到更加接近实际效果的视图，而不再是一层不变的静态图片。

要实现可缩放小部件预览，请使用 `appwidget-provider` 元素的 `previewLayout` 属性来提供 XML 布局：

```xml
<appwidget-provider
	android:previewLayout="@layout/my_widget_preview">
</appwidget-provider>
```

**建议 `previewLayout` 和 `initialLayout` 一样的布局**

我们建议同时指定 `previewLayout` 和 `previewImage` 属性，以便您的应用在用户设备不支持 `previewLayout`。`previewLayout` 属性优先于 `previewImage` 属性。

### description

从 Android 12 开始，为要为你的 `widget` 显示的 `widget` 选择器提供 `description`。

![|300](https://developer.android.com/static/images/appwidgets/description.png)

**示例：**

```xml
<appwidget-provider
    android:description="@string/my_widget_description">
</appwidget-provider>
```

> 注意：description 要简洁。没有字符限制，但 description 的表示形式和可用空间可能会因设备而异。

您可以在以前版本的 Android 上使用 `descriptionRes` 属性，但 `widget picker` 会忽略它。

## 添加新的复合按钮

从 Android12 开始全面支持 `CheckBox`、`Switch` 和 `RadioButton` 三种状态控件。小部件仍然是无状态的。您的应用程序必须存储状态并注册状态更改事件。

![|300](https://developer.android.com/static/images/appwidgets/home.png)

具体参考：[Support for stateful behavior](https://developer.android.com/guide/topics/appwidgets#stateful-behavior)

## 配置：用户可重新设置原有小部件

- [x] [允许用户配置应用 widget  |  Views  |  Android Developers](https://developer.android.com/develop/ui/views/appwidgets/configuration)

在 `Android12` 之前，用户如果想要重新设置小部件的话只能删除了再重新添加，但是在 Android12 中，用户将无需通过删除和重新添加 widget 来调整这些原有设定。例如，时钟小部件可以让用户配置要显示的时区。

如果您想让用户配置您的小部件的设置，请创建小部件配置 `Activity` 。此活动由应用程序小部件主机在**创建小部件时**或稍后自动启动，具体取决于您指定的配置选项。

### 声明 configuration activity

在 Android 清单文件中将配置 activity 声明为普通 activity。应用程序小部件宿主使用 `ACTION_APPWIDGET_CONFIGURE` 操作启动它，因此该活动需要接受此意图。例如：

```xml
<activity android:name=".ExampleAppWidgetConfigurationActivity">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_CONFIGURE"/>
    </intent-filter>
</activity>
```

使用 `android:configure` 属性在 `appwidget-provider` 文件中声明活动。

```xml
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    ...
    android:configure="com.example.android.ExampleAppWidgetConfigurationActivity"
    ... >
</appwidget-provider>
```

- `android:configure` 使用全路径包名声明，因为要在外部调用
- 不配置这个 action 也是可以启动的：`android.appwidget.action.APPWIDGET_CONFIGURE`

### 实现 configuration activity

配置该 Activity 时需要记住两点：

- 应用程序小部件宿主 (一般是 Launcher) 调用该配置 activity，并且配置 activity 必须始终返回结果。返回的结果中必须包含 `App Widget ID` （放在启动该 Activity 的 intent 中），保存在 Intent 中的 `EXTRA_APPWIDGET_ID`
- 启动配置 Activity 时系统不会发送 `ACTION_APPWIDGET_UPDATE` 广播，这意味着在创建小部件时不会调用 `onUpdate()` 方法。首次创建小部件时，配置 Activity 有责任从 `AppWidgetManager` 请求更新。但是，后续更新时会调用 `onUpdate()` — 仅在第一次时跳过。

#### configuration activity 更新小组件

当小部件使用配置活动时，该活动有责任在配置完成时更新小部件。您可以通过直接从 `AppWidgetManager` 请求更新来执行此操作。

以下是正确更新小部件和关闭配置活动的过程摘要：

- 从启动 Activity 的 Intent 中获取 `App Widget ID`：

```kotlin
val appWidgetId = intent?.extras?.getInt(
        AppWidgetManager.EXTRA_APPWIDGET_ID,
        AppWidgetManager.INVALID_APPWIDGET_ID
) ?: AppWidgetManager.INVALID_APPWIDGET_ID
```

- 将 activity result 设置为 `RESULT_CANCELED`  这样，如果用户在到达结束之前退出 Activity，系统会通知应用程序小部件主机配置已取消，并且主机不会添加小部件：

```kotlin
val resultValue = Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
setResult(Activity.RESULT_CANCELED, resultValue)
```

- 根据用户的喜好配置小部件。
- 配置完成后，通过调用 `getInstance(Context)` 获取 `AppWidgetManager` 的实例：

```kotlin
val appWidgetManager = AppWidgetManager.getInstance(context)
```

- 通过调用 `updateAppWidget(int, RemoteViews)` 更新具有 `RemoteViews` 布局的小部件：

```kotlin
val views = RemoteViews(context.packageName, R.layout.example_appwidget)
appWidgetManager.updateAppWidget(appWidgetId, views)
```

- 创建 return intent，将其设置为 activity result，然后完成活动：

```kotlin
val resultValue = Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
setResult(Activity.RESULT_OK, resultValue)
finish()
```

- 示例：[user-interface-samples/AppWidget/app/src/main/java/com/example/android/appwidget/rv/list/ListWidgetConfigureActivity.kt at main · android/user-interface-samples · GitHub](https://github.com/android/user-interface-samples/blob/main/AppWidget/app/src/main/java/com/example/android/appwidget/rv/list/ListWidgetConfigureActivity.kt)

### Widget configuration options

默认情况下，应用程序小部件主机 (如 Launcher) 仅在用户将小部件添加到主屏幕后立即启动配置 activity 一次。但是，您可以指定选项，使用户能够重新配置现有小部件或通过提供默认小部件配置来跳过初始小部件配置。

> 注意：这些选项仅从 Android 12（API 级别 31）开始可用。您可以为以前版本的 Android 指定它们，但系统会忽略它们并遵循默认行为。

#### 允许用户重新配置已经放置的小部件

要让用户重新配置现有小部件，请在 `appwidget-provider` 的 `widgetFeatures` 属性中指定 `reconfigurable` 标志。

```xml
<appwidget-provider
    android:configure="com.myapp.ExampleAppWidgetConfigurationActivity"
    android:widgetFeatures="reconfigurable">
</appwidget-provider>
```

用户可以通过触摸并按住小部件并点击 " 重新配置 " 按钮（在图 1 中标记为 1）来重新配置其小部件。

![|300](https://developer.android.com/static/images/appwidgets/widget-reconfigure-button.png)

> 注意：`reconfigurable` 标志是在 Android 9（API 级别 28）中引入的，但直到 Android 12 才得到广泛支持。

#### Use the widget's default configuration 使用默认配置

您可以通过让用户跳过初始配置步骤来提供更加无缝的小部件体验。为此，请在 `widgetFeatures` 字段中指定 `configuration_optional` 和 `reconfigurable` 标志。这会绕过用户添加小部件后启动配置活动。如前所述，用户之后仍然可以重新配置小部件。例如，时钟小部件可以绕过初始配置并默认显示设备时区。

以下是如何将配置活动标记为 `reconfigurable` 和 `optional` 的示例：

```xml
<appwidget-provider
    android:configure="com.myapp.ExampleAppWidgetConfigurationActivity"
    android:widgetFeatures="reconfigurable|configuration_optional">
</appwidget-provider>
```

## 使用改进的 API 来确定小部件尺寸和布局

### 指定额外的小部件尺寸限制

在已有的 `minWidth`、`minResizeWidth` 等属性以外，新增了几个属性以更便捷地配置小组件的尺寸。

- **maxResizeWidth**：定义用户所能够调整的小部件尺寸的最大宽度
- **maxResizeHeight**：定义用户所能够调整的小部件尺寸的最大高度
- **targetCellWidth**：定义设备主屏幕上的小部件默认宽度所占格数（即使不同型号的手机中也会占定义好的格数，但手机系统版本必须在 Android12 及以上）
- **targetCellHeight**：定义设备主屏幕上的小部件默认高度所占格数

```xml
<appwidget-provider
    ...
    android:targetCellWidth="3"
    android:targetCellHeight="2"
    android:maxResizeWidth="250dp"
    android:maxResizeHeight="110dp">
</appwidget-provider>
```

### 灵活调节尺寸 (用户可重新设置原有小部件)

iOS 上添加小组件后尺寸就固定了，不支持调节。而 Android 12 上小组件在长按后即可灵活调节。

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407160044558.png)

在 Android12 之前，用户如果想要重新设置小部件的话只能删除了再重新添加，但是在 Android 12 中，用户将无需通过删除和重新添加 widget 来调整这些原有设定。

想要支持这个特性只需要给 `widgetFeatures` 属性指定 `reconfigurable` 值即可。

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:configure="com.zj.weather.common.widget.WeatherWidgetConfigureActivity"
    android:widgetFeatures="reconfigurable" 
    ... />
```

> The reconfigurable flag was introduced in Android 9 (API level 28), but it was not widely supported in launchers until Android 12. **事实上这个属性早在 Android 9 的时候就引入了，但官方说从 S 开始才全面支持。我在 11 版本的 Pixel Launcher 上发现已经可以直接调节尺寸了，不知道官方的意思是不是别的 Launcher 并不支持。**

- **widgetFeatures** 就是 Android 12 中新增的可重新设置小部件的配置项
- **configure** 是配置小部件的 Activity，想要使 widgetFeatures 起作用的话必须要配置 Activity，这很好理解，如果都不知道去哪配置小部件何谈重新设置呢！

### 采用默认配置

`configure` 属性可以在小组件展示之前启动一个配置画面，供用户选择小组件所需的内容、主题和风格等。如果想让用户快速看到效果，即不想展示这个画面的话，只要在 `widgetFeatures` 里指定新的 `configuration_optional` 值即可。

```xml
<appwidget-provider
  ...
  android:configure="com.example.appwidget.activity.WidgetConfigureActivity"
  android:widgetFeatures="reconfigurable|configuration_optional">
</appwidget-provider>
```

后面改主意了又想替换配置的话，可以长按小组件找到配置的入口。

一是小组件右下方的编辑按钮，二是上方出现的 Setup 菜单，这在以前的版本上是没有的。

![|300](https://z3.ax1x.com/2021/05/30/2ZmpB6.gif)

### 高效地控制布局

小组件内容较多的时候，为了展示的完整往往会给它限定 Size，这意味着只有 Launcher 空间足够大小组件才能成功放置。当 Launcher 空间捉急的时候就尴尬了，用户只能在移除别的小组件和放弃你的小组件之间做个抉择。

免除这种困扰的最佳做法是在不同的 `Size` 下采用不同的布局，对展示的内容做出取舍。即 Size 充足的情况下提供更多丰富的内容，反之只呈现最基本、最常用的信息。

#### 响应式布局（AppWidget 动态适配大小）

- [x] [Site Unreachable](https://developer.android.com/develop/ui/views/appwidgets/layouts#provide-responsive-layouts)

之前是如何做到这一需求呢？除了预设各种尺寸的小组件的一般思路以外，通过 `onAppWidgetOptionsChanged` 回调也可以控制布局的变化，但往往非常繁琐。

而 Android12 上借助新增的 `RemoteViews(Map<SizeF, RemoteViews> map)` API 可以大大简化实现过程。在小组件放置的时候就将 `Size` 和布局的映射关系告知系统，当 `Size` 变化了 `AppWidgetManager` 将自动响应更新对应的布局。

**示例 1：** 比如待办事项小组件在 Size 为 `3x2` 的时候额外展示添加按钮，`2x2` 的时候只展示事项列表的相应式布局。

```kotlin
private fun updateAppWidgetWithResponsiveLayouts(...) {
    //...
    // 尺寸够宽的情况下Button才显示
    val wideView = RemoteViews(rv)
    wideView.setViewVisibility(button, View.VISIBLE)
    val viewMapping: Map<SizeF, RemoteViews> = mapOf(
        SizeF(100f, 100f) to rv,
        SizeF(200f, 100f) to wideView    )

    // 将Size和RemoteViews布局的映射关系告知AppWidgetManager
    val remoteViews = RemoteViews(viewMapping)
    appWidgetManager.updateAppWidget(appWidgetId, remoteViews)
}
```

![|300](https://z3.ax1x.com/2021/05/30/2Zmh5D.gif)

**好处：**

- 免于同一功能提供一堆尺寸小组件的繁琐，减轻选择器的负担
- 实现简单，自动响应

**示例 2：**

```kotlin
private fun updateWidget() {
    // 以 dp 为单位，指定最大宽度和高度，
    // 并指定一个用于已指定尺寸的布局
    val views64 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x4)
    val views34 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x4)
    val views32 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x2)
	//根据大小实现不同的布局文件
    val viewMapping: Map<SizeF, RemoteViews> = mapOf(
        SizeF( 180f, 110f) to views32,
        SizeF( 180f, 500f) to views34,
        SizeF( 390f, 420f) to views64
    )

    updateWidgetLayout()

    //刷新小组件
    val manager: AppWidgetManager =
        AppWidgetManager.getInstance(this.applicationContext)
    val componentName = ComponentName(this.applicationContext, RadioAppWidget3x2::class.java)
    // Instruct the widget manager to update the widget
    val result = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
	    manager.updateAppWidget(componentName, RemoteViews(viewMapping))
    } else {
	    // TODO
    }
}

private fun updateWidgetLayout() {
	val views64 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x4)
    val views34 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x4)
    val views32 = RemoteViews(this.packageName, R.layout.appwidget_radio_3x2)
    //...省略更新view内容
}
```

#### 提供精确布局

- [ ] [提供灵活的 widget 布局  |  Views  |  Android Developers](https://developer.android.com/develop/ui/views/appwidgets/layouts#provide-exact-layouts)

如今移动设备的尺寸、形态丰富多样，尤其是折叠屏愈加成熟。如果响应式布局仍不能满足更精细的需求，可以在 Size 变化的回调里，获取目标 Size 对布局进一步的精确把控。

利用 `AppWidgetManager` 新增的 `OPTION_APPWIDGET_SIZES` KEY 可以从 `AppWidgetManager` 里拿到目标 Size。

```kotlin
// 监听目标尺寸
override fun onAppWidgetOptionsChanged(
        context: Context,
        appWidgetManager: AppWidgetManager,
        id: Int,
        newOptions: Bundle?
) {
    super.onAppWidgetOptionsChanged(context, appWidgetManager, id, newOptions)
    // Get the new sizes.
    val sizes = newOptions?.getParcelableArrayList<SizeF>(
            AppWidgetManager.OPTION_APPWIDGET_SIZES
    )
    // Check that the list of sizes is provided by the launcher.
    if (sizes.isNullOrEmpty()) {
        return
    }
    // Map the sizes to the RemoteViews that you want.
    val remoteViews = RemoteViews(sizes.associateWith(::createRemoteViews))
    appWidgetManager.updateAppWidget(id, remoteViews)
}

// Create the RemoteViews for the given size.
private fun createRemoteViews(size: SizeF): RemoteViews {
    val smallView: RemoteViews = ...
    val tallView: RemoteViews = ...
    val wideView: RemoteViews = ...
    //...

    return when (size) {
        SizeF(100f, 100f) -> smallView
        SizeF(100f, 200f) -> tallView
        SizeF(200f, 100f) -> wideView
        //...
    }
}
```

**注意：实际上 Size 列表由 Launcher 提供，如果 3rd Launcher 没有适配这一特性的话，回传的 Size 可能为空**

## Android12 对 Broadcast Receiver 或 Service 的限制

Android 12 对从 Broadcast Receiver 或 Service 启动 Activity 做了更严格的限制，但不包括 Widget 发起的场合。但为了避免视觉上的突兀，这种后台启动的情况下不展示迁移动画。

## Enable smoother transitions (流畅的启动效果)

从 Android 12 开始，当用户从小部件启动您的应用时，启动器可以提供更平滑的过渡。

要启用这种改进的过渡，只需给小组件的根布局指定 android 的 `backgoround` id 即可，请使用 `@android:id/background` 或 `android.R.id.background` 来标识您的背景元素，可见 [Enable smoother transitions](https://developer.android.com/guide/topics/appwidgets/enhance#enable-smoother-transitions)：

```xml
// Top-level layout of the widget.
<LinearLayout
    android:id="@android:id/background">
</LinearLayout>
```

> 警告：避免使用 [broadcast trampolines](https://developer.android.com/about/versions/12/behavior-changes-12#notification-trampolines)。从 Android 12 开始，如果应用是通过小部件点击的 `PendingIntent` 启动的，那么应用仍然可以从广播接收器或服务启动 Activity。但是，新的应用程序动画不用于从广播接收器或服务启动的应用程序，这会导致用户体验不佳。

您的应用可以在以前版本的 Android 上使用 `@android:id/background` 而不会中断，但它会被忽略。

实际的动作显示添加这个 ID 后 App 启动没有什么变化

## 自由地更新视图

`RemoteViews` 作为小组件视图的重要管理类，添加了诸多 API，以便更加自由地控制视图的展示。

- 更改颜色的 `setColorStateList()`
- 更改边距的 `setViewLayoutMargin()`
- 更改宽高的 `setViewLayoutWidth()` 等

这些新 API 可以助力我们实很多方便的功能，比如 `CheckBox` 选中之后更新文本颜色，思路很简单：

1. 监听小组件的点击事件并传递目标视图
2. 根据 `CheckBox` 的状态获得预设的文本颜色
3. 使用 `setColorStateList()` 更新

```kotlin
override fun onReceive(context: Context?, intent: Intent?) {
    //...
    // Get target widget.
    val appWidgetManager = AppWidgetManager.getInstance(context)
    val thisAppWidget = ComponentName(context!!.packageName, TodoListAppWidget::class.java.name)
    val appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidget)

    // Update widget color parameters dynamically.
    for (appWidgetId in appWidgetIds) {
        val remoteViews = RemoteViews(context.packageName, R.layout.widget_todo_list)
        remoteViews.setColorStateList(
            viewId,
            "setTextColor",
            getColorStateList(context, checked)
        )
        appWidgetManager.updateAppWidget(appWidgetId, remoteViews)
    }
}
private fun getColorStateList(context: Context, checkStatus: Boolean): ColorStateList =
    if (checkStatus) 
        ColorStateList.valueOf(context.getColor(R.color.widget_checked_text_color))
    else 
        ColorStateList.valueOf(context.getColor(R.color.widget_unchecked_text_color))
```

![|300](https://z3.ax1x.com/2021/05/30/2ZmHKI.gif)

**示例：Chart 线图太小，看不清楚。可以让它在点击之后放大，再点击之后恢复原样。**

```kotlin
// 根据记录的缩放状态获得预设的宽高
// 通过setViewLayoutWidth和setViewLayoutHeight更新宽高
override fun onReceive(context: Context?, intent: Intent?) {
    ...
    val widthScaleSize = if (scaleOutStatus) 200f else 260f
    val heightScaleSize = if (scaleOutStatus) 130f else 160f

    // Update widget layout parameters dynamically.
    for (appWidgetId in appWidgetIds) {
        val remoteViews = RemoteViews(context.packageName, R.layout.widget_pedometer)
        remoteViews.setViewLayoutWidth(viewId, widthScaleSize, TypedValue.COMPLEX_UNIT_DIP)
        remoteViews.setViewLayoutHeight(viewId, heightScaleSize, TypedValue.COMPLEX_UNIT_DIP)
        appWidgetManager.updateAppWidget(appWidgetId, remoteViews)
    }
}
```

![|300](https://z3.ax1x.com/2021/06/01/2Ke8I0.gif)

## 运行时修改 RemoteViews

从 Android 12 开始，您可以利用多种 `RemoteViews` 方法来提供 `RemoteViews` 属性的运行时修改。有关添加方法的完整列表，请参阅 [`RemoteViews`](https://developer.android.com/reference/android/widget/RemoteViews) API 参考。

**示例：**

```kotlin
// Set the colors of a progress bar at runtime.
remoteView.setColorStateList(R.id.progress, "setProgressTintList", createProgressColorStateList())

// Specify exact sizes for margins.
remoteView.setViewLayoutMargin(R.id.text, RemoteViews.MARGIN_END, 8f, TypedValue.COMPLEX_UNIT_DP)
```

## Collections RemoteViews (简化的数据绑定)

- [ ] [Android 12 widget 改进  |  Android Developers](https://developer.android.com/about/versions/12/features/widgets#leverage-simplified-remoteview-collections)

小组件里展示 ListView 的需求也很常见，提供数据的话需要声明一个 `RemoteViewsService` 以返回 `RemoteViewsFactory`，比较绕。

而 Android12 里新增的 `setRemoteAdapter(int , RemoteCollectionItems)` API 则可以大大简化这个绑定过程。

**示例：制作一个即将到来的事件列表小组件，通过这个 API 便可以高效注入数据。**

```kotlin
private fun updateCountDownList(...) {
    ...
    // 创建用于构建Remote集合数据的Builder
    val builder = RemoteViews.RemoteCollectionItems.Builder()
    val menuResources = context.resources.obtainTypedArray(R.array.count_down_list_titles)

    // 往Builder里添加各Item对应的RemoteViews
    for (index in 0 until menuResources.length()) {
        ...
        builder.addItem(index.toLong(), constructRemoteViews(context, resId))
    }

    // 构建Remote集合数据
    // 并通过setRemoteAdapter直接放入到ListView里
    val collectionItems = builder.setHasStableIds(true).build()
    remoteViews.setRemoteAdapter(R.id.count_down_list, collectionItems)
    ...
}

// 创建ListView各Item对应的RemoteViews
private fun constructRemoteViews(...): RemoteViews {
    val remoteViews = RemoteViews(context.packageName, R.layout.item_count_down)
    val itemData = context.resources.getStringArray(stringArrayId)

    // 遍历Item数据行设置对应的文本
    itemData.forEachIndexed { index, value ->
        val viewId = when (index) {
            0 -> R.id.item_title
            1 -> R.id.item_time
            ...
        }
        remoteViews.setTextViewText(viewId, value)
    }
    return remoteViews
}
```

![|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202407160112338.png)

如果 Item 的布局不固定不止一种，可以使用 `setViewTypeCount` 指定布局类型的数目，告知 `ListView` 需要提供的 `ViewHolder` 种类。如果不指定也可以，系统将自动识别布局的种类，需要系统额外处理而已。

但要注意：如果指定的数目和实际的不一致会引发异常。`IllegalArgumentException: View type count is set to 2, but the collection contains 3 different layout ids`

另外，需要补充一下，支持该 API 的 View 必须是 `AdapterView` 的子类，比如常见的 `ListView`、`GridView` 等。`RecyclerView` 是不支持的，毕竟小组件里数据量不多，不能使用也没关系。

## 新增 API 总结

### RemoteViews 类

| 方法                                                | 作用                                                |
| ------------------------------------------------- | ------------------------------------------------- |
| **RemoteViews(Map<SizeF, RemoteViews>)**          | 根据响应式布局映射表创建目标 RemoteViews                         |
| **addStableView()**                               | 向 RemoteViews 动态添加子 View，类似 `ViewGroup.addView()` |
| **setCompoundButtonChecked()**                    | 针对 CheckBox 或 Switch 控件更新选中状态                         |
| **setRadioGroupChecked()**                        | 针对 RadioButton 控件更新选中状态                             |
| **setRemoteAdapter(int , RemoteCollectionItems)** | 直接将数据填充进小组件的 ListView                              |
| **setColorStateList()**                           | 动态更新小组件视图的颜色                                      |
| **setViewLayoutMargin()**                         | 动态更新小组件视图的边距                                      |
| **setViewLayoutWidth()、setViewLayoutHeight()**    | 动态更新小组件视图的宽高                                      |
| **setOnCheckedChangeResponse()**                  | 监听 CheckBox 等三种状态小组件的状态变化                           |

### XML 属性

| 属性                                   | 作用                        |
| ------------------------------------ | ------------------------- |
| **description**                      | 配置小组件在选择器里的补充描述           |
| **previewLayout**                    | 配置小组件的预览布局                |
| **reconfigurable**                   | 指定小组件的尺寸支持直接调节            |
| **configuration_optional**           | 指定小组件的内容可以采用默认设计，无需启动配置画面 |
| **targetCellWidth、targetCellHeight** | 限定小组件所占的 Launcher 单元格       |
| **maxResizeWidth、maxResizeHeight**   | 配置小组件所能支持的最大高宽尺寸          |

## Ref

- [ ] [developer.android.com/about/versions/12/features/widgets](https://developer.android.com/about/versions/12/features/widgets)
- [ ] [Android 12上焕然一新的小组件：美观、便捷和实用_kwgt安卓12小组件-CSDN博客](https://blog.csdn.net/allisonchen/article/details/117261795)
