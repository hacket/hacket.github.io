---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# Search-View

- [模仿googlePaly的搜索toolbar](https://github.com/Quinny898/PersistentSearch)
- [FloatingSearchView- 有一个模仿谷歌的浮动搜索控件](https://github.com/renaudcerrato/FloatingSearchView)
- [SearchMenuAnim-搜索图标动画变成搜索输入框](https://github.com/kongnanlive/SearchMenuAnim)
- [Search-View-Layout](https://github.com/sahildave/Search-View-Layout)
- [一个搜索search的view](https://github.com/lapism/SearchView)

### 时间轴

- [**TimelineView**](https://github.com/alorma/TimelineView)
- [一个有嵌套时间轴的Recycleview](https://github.com/ishratkhan/NestedTimeLineRecyclerView)

### 多媒体

- [**LyricView-歌词View**](https://github.com/markzhai/LyricView)

### Preference

- [MDPreference](https://github.com/XhinLiang/MDPreference)

### 其他

- [LinearLayout可绑定ListAdapter的库](https://github.com/frankiesardo/LinearListView)
- [android-vertical-slide-view仿照淘宝和聚美优品，在商品详情页，向上拖动时，可以加载下一页。使用ViewDragHelper，滑动比较流畅](https://github.com/xmuSistone/android-vertical-slide-view)

# Custom Tabs

Chrome浏览器的自定义Tab窗口，可以用于用Chrome打开网页，替代webview<br /><http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0914/3451.html>

# SwitchCompat

自定义SwitchCompat样式

```xml
<style name="SwitchCompat">
    <item name="android:track">@drawable/abc_switch_track_mtrl_alpha</item>
    <item name="android:thumb">@drawable/abc_switch_thumb_material</item>
    <item name="android:background">@color/transparent</item>
    <item name="showText">false</item>
    <item name="switchPadding">@dimen/abc_switch_padding</item>
    <item name="android:textOn">@string/abc_capital_on</item>
    <item name="android:textOff">@string/abc_capital_off</item>
    <item name="android:tint">#CCFFE300</item>
    <item name="colorControlActivated">#CCFFE300</item>
</style>
```

应用样式：

```xml
<androidx.appcompat.widget.SwitchCompat
    android:id="@+id/switch_night_mode"
    android:layout_width="60dp"
    android:layout_height="wrap_content"
    android:layout_gravity="center_vertical"
    android:layout_centerInParent="true"
    app:switchMinWidth="@dimen/qb_px_56"
    app:showText="false"
    app:switchPadding="3dp"
    app:theme="@style/SwitchCompat"
    app:track="@drawable/abc_switch_track_mtrl_alpha"/>
```

```java
switch_night_mode.setOnCheckedChangeListener(this)
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688662685585-67d3db84-bd3c-4284-a273-be8a1aefb14e.png#averageHue=%23fbfbfb&clientId=ua79040be-9c0c-4&from=paste&height=247&id=ud700163e&originHeight=370&originWidth=182&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5895&status=done&style=stroke&taskId=ucaf32075-22d7-49d2-beaf-00278348bae&title=&width=121.33333333333333)

# draganddrop

![](http://note.youdao.com/yws/res/31865/4B2BB8D3D6EC4B30B9EF64F339622407#id=X7mtk&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# LinearLayoutCompat

1、 应用<br />在布局当中使用`分割线`区分每个Item布局；这样的实现同样还减少了View 的绘制。那么Google在 support.v7当中提供了 LinearLayoutCompat 这样的一个控件<br />2、属性

| 标签                 | 属性内容                                   |
| ------------------ | -------------------------------------- |
| app:divider        | 设置分割线的样式支持自定义 drawable                 |
| app:dividerPadding | 设置分割线两端的距离                             |
| app:showDividers   | 设置分割线显示的位置 [beginning middle end none] |

3、案例

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.v7.widget.LinearLayoutCompat xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    app:divider="@drawable/bootom_line"
    app:dividerPadding="10dp"
    app:showDividers="middle|end">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:text="Hello World!" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:text="Hello World!" />
    <TextView
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:text="Hello World!" />

</android.support.v7.widget.LinearLayoutCompat>
```

4、效果<br />![](https://upload-images.jianshu.io/upload_images/2539449-2739d7e8efeea5fb?imageMogr2/auto-orient/strip%7CimageView2/2/w/378/format/webp#height=364&id=ljKRf&originHeight=637&originWidth=378&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=216)

# Search-View

- [模仿googlePaly的搜索toolbar](https://github.com/Quinny898/PersistentSearch)
- [FloatingSearchView- 有一个模仿谷歌的浮动搜索控件](https://github.com/renaudcerrato/FloatingSearchView)
- [SearchMenuAnim-搜索图标动画变成搜索输入框](https://github.com/kongnanlive/SearchMenuAnim)
- [Search-View-Layout](https://github.com/sahildave/Search-View-Layout)
- [一个搜索search的view](https://github.com/lapism/SearchView)

### 时间轴

- [**TimelineView**](https://github.com/alorma/TimelineView)
- [一个有嵌套时间轴的Recycleview](https://github.com/ishratkhan/NestedTimeLineRecyclerView)

### 多媒体

- [**LyricView-歌词View**](https://github.com/markzhai/LyricView)

### Preference

- [MDPreference](https://github.com/XhinLiang/MDPreference)

### 其他

- [LinearLayout可绑定ListAdapter的库](https://github.com/frankiesardo/LinearListView)
- [android-vertical-slide-view仿照淘宝和聚美优品，在商品详情页，向上拖动时，可以加载下一页。使用ViewDragHelper，滑动比较流畅](https://github.com/xmuSistone/android-vertical-slide-view)
