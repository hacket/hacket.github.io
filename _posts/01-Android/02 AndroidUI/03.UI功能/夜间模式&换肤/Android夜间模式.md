---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

## Android夜间模式

夜间模式需求：

1. 改动少，侵入性小
2. 不需要重启Activity

---

### 1、UiModeManager（android官方）

弊端：要开启车载模式

### 2、Change Theme（需restart Activity）

通过定义两套Theme，在切换模式的时候，保存Theme Id，重建Activity。在Activity中，在setContentView()之前，读取保存的Theme Id，再setTheme(Theme id)一下即可。

缺点：<br />需要重启Activity，界面会闪烁

> 可参考`MultipleTheme`开源库，不需要重启页面即可实现夜间模式的切换

### 3、NightModeHelper

---

### 知乎简书实现方案

1. 定义两套Theme，color等
2. 在布局中引入属性(?attr/)的值
3. 代码中重新设置对应模式的值；其他页面根据setTheme()判断。

### 资源id映射的方式

通过id获取资源时，先将其转换为夜间模式对应id，再通过Resources来获取对应的资源。

缺点：<br />每次添加资源都需要建立映射关系

### Material Design实现夜间模式

```java
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGTH_NO);
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGTH_YES);
```

### 自定义LayoutInflaterFactory

# 自定义Factory2应用--动态换肤

## 注意

### androidP(28)以上的，如何实现Factory2的多次设置？反射修改`mFactorySet`值实现了

### 多个Factory2怎么实现兼容？如何兼容AppCompatDelete设置的Factory2的功能？

## 换肤基础

### Resources

1. String getResourceEntryName([@AnyRes ](/AnyRes) int resid)  通过resId获取资源的name，对应apk中的 `resources.arsc`的name
2. String getResourceTypeName([@AnyRes ](/AnyRes) int resid)  通过resId获取资源的type
3. int getIdentifier(String name, String defType, String defPackage)  通过`package:type/entry`获取资源id

#### AssetManager

1. int addAssetPath(String path)    添加path资源到AssetManager，过时，不能反射
2. void setApkAssets([@NonNull ](/NonNull) ApkAssets[] apkAssets, boolean invalidateCaches) 替代addAssetPath

### 自定义Factory2

用于收集要换肤的view

系统createView流程:

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

1. 注册`ActivityLifecycleCallbacks`监听Activity的创建，在每个Activity创建时，创建一个Factory2并记录
2. 自定义`Factory2`，收集需要换肤的View，属性（Factory2可能需要多次应用，需要反射修改Factory2的判断值，默认一个Activity只能设置一次，注意AndroidP(28)不能反射修改`mFactorySet`值了），里面保存了所有要换肤的View和属性
3. 换肤操作时替换掉系统的Resource，替换为换肤的Resource，从而实现换肤时调用资源是皮肤包的
4. 应用观察者模式，SkinManager为Observable(被观察者)，Factory2为观察者，换肤操作时，通知各个观察者应用换肤

## Ref

<https://github.com/fengjundev/Android-Skin-Loader>

> 糗百用

<https://github.com/ximsfei/Android-skin-support>
