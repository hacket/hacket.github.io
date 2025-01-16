---
date created: 星期二, 十二月 24日 2024, 12:30:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:55:15 晚上
title: Android夜间模式
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [自定义 Factory2 应用 -- 动态换肤]
linter-yaml-title-alias: 自定义 Factory2 应用 -- 动态换肤
---

## Android 夜间模式

夜间模式需求：

1. 改动少，侵入性小
2. 不需要重启 Activity

---

### 1、UiModeManager（android 官方）

弊端：要开启车载模式

### 2、Change Theme（需 restart Activity）

通过定义两套 Theme，在切换模式的时候，保存 Theme Id，重建 Activity。在 Activity 中，在 setContentView() 之前，读取保存的 Theme Id，再 setTheme(Theme id) 一下即可。

缺点：<br />需要重启 Activity，界面会闪烁

> 可参考 `MultipleTheme` 开源库，不需要重启页面即可实现夜间模式的切换

### 3、NightModeHelper

---

### 知乎简书实现方案

1. 定义两套 Theme，color 等
2. 在布局中引入属性 (?attr/) 的值
3. 代码中重新设置对应模式的值；其他页面根据 setTheme() 判断。

### 资源 id 映射的方式

通过 id 获取资源时，先将其转换为夜间模式对应 id，再通过 Resources 来获取对应的资源。

缺点：<br />每次添加资源都需要建立映射关系

### Material Design 实现夜间模式

```java
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGTH_NO);
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGTH_YES);
```

### 自定义 LayoutInflaterFactory

# 自定义 Factory2 应用 -- 动态换肤

## 注意

### androidP(28) 以上的，如何实现 Factory2 的多次设置？反射修改 `mFactorySet` 值实现了

### 多个 Factory2 怎么实现兼容？如何兼容 AppCompatDelete 设置的 Factory2 的功能？

## 换肤基础

### Resources

1. String getResourceEntryName([@AnyRes](/AnyRes) int resid)  通过 resId 获取资源的 name，对应 apk 中的 `resources.arsc` 的 name
2. String getResourceTypeName([@AnyRes](/AnyRes) int resid)  通过 resId 获取资源的 type
3. int getIdentifier(String name, String defType, String defPackage)  通过 `package:type/entry` 获取资源 id

#### AssetManager

1. int addAssetPath(String path)    添加 path 资源到 AssetManager，过时，不能反射
2. void setApkAssets([@NonNull](/NonNull) ApkAssets[] apkAssets, boolean invalidateCaches) 替代 addAssetPath

### 自定义 Factory2

用于收集要换肤的 view

系统 createView 流程:

```java
// LayoutInflater
View createViewFromTag(View parent, String name, Context context, AttributeSet attrs,
            boolean ignoreThemeAttr) {
    // ...
    try {
        View view;
        if (mFactory2 != null) {
            view = mFactory2.onCreateView(parent, name, context, attrs);
        } else if (mFactory != null) {
            view = mFactory.onCreateView(name, context, attrs);
        } else {
            view = null;
        }
        if (view == null && mPrivateFactory != null) {
            view = mPrivateFactory.onCreateView(parent, name, context, attrs);
        }
        if (view == null) {
            final Object lastContext = mConstructorArgs[0];
            mConstructorArgs[0] = context;
            try {
                if (-1 == name.indexOf('.')) {
                    view = onCreateView(parent, name, attrs);
                } else {
                    view = createView(name, null, attrs);
                }
            } finally {
                mConstructorArgs[0] = lastContext;
            }
        }
        return view;
        // ...
    } catch (Exception e) {
        final InflateException ie = new InflateException(attrs.getPositionDescription()
                + ": Error inflating class " + name, e);
        ie.setStackTrace(EMPTY_STACK_TRACE);
        throw ie;
    }
}
```

### ActivityLifecycleCallbacks

## 资源加载流程

主要流程：

1. 注册 `ActivityLifecycleCallbacks` 监听 Activity 的创建，在每个 Activity 创建时，创建一个 Factory2 并记录
2. 自定义 `Factory2`，收集需要换肤的 View，属性（Factory2 可能需要多次应用，需要反射修改 Factory2 的判断值，默认一个 Activity 只能设置一次，注意 AndroidP(28) 不能反射修改 `mFactorySet` 值了），里面保存了所有要换肤的 View 和属性
3. 换肤操作时替换掉系统的 Resource，替换为换肤的 Resource，从而实现换肤时调用资源是皮肤包的
4. 应用观察者模式，SkinManager 为 Observable(被观察者)，Factory2 为观察者，换肤操作时，通知各个观察者应用换肤

## Ref

<https://github.com/fengjundev/Android-Skin-Loader>

> 糗百用

<https://github.com/ximsfei/Android-skin-support>
