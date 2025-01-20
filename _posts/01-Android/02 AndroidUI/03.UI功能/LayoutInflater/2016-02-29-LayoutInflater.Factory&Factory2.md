---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:46:02 pm
title: LayoutInflater.Factory&Factory2
author: hacket
categories:
  - AndroidUI
category: UI基础
tags: [UI基础]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
aliases: [LayoutInflater.Factory&Factory2]
linter-yaml-title-alias: LayoutInflater.Factory&Factory2
---

# LayoutInflater.Factory&Factory2

## LayoutInflater 中的 Factory/Factory2

在 LayoutInflater 创建 View 时，会调用 tryCreateView() 方法，会通过我们设置的工厂来创建对象。如果我们设置了 `LayoutInflater.Factory2` 会优先通过 Factory2，否则通过 `LayoutInflater.Factory`；如果都没有设置，就会通过反射来创建 View 对象。

```java
public final View tryCreateView(@Nullable View parent, @NonNull String name,
    @NonNull Context context,
    @NonNull AttributeSet attrs) {
    if (name.equals(TAG_1995)) {
        // Let's party like it's 1995!
        return new BlinkLayout(context, attrs);
    }
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
    return view;
}
```

### 注意点

1. LayoutInflater#tryCreateView 中也可以看出，mFactory2 优先于 mFactory。上面源码可以看出来
2. setFactory 和 setFactory2 默认只能设置其中一个，设置多个会抛出异常

```java
public void setFactory(Factory factory) {
    if (mFactorySet) {
        throw new IllegalStateException("A factory has already been set on this LayoutInflater");
    }
    if (factory == null) {
        throw new NullPointerException("Given factory can not be null");
    }
    mFactorySet = true;
    if (mFactory == null) {
        mFactory = factory;
    } else {
        mFactory = new FactoryMerger(factory, null, mFactory, mFactory2);
    }
}
public void setFactory2(Factory2 factory) {
    if (mFactorySet) {
        throw new IllegalStateException("A factory has already been set on this LayoutInflater");
    }
    if (factory == null) {
        throw new NullPointerException("Given factory can not be null");
    }
    mFactorySet = true;
    if (mFactory == null) {
        mFactory = mFactory2 = factory;
    } else {
        mFactory = mFactory2 = new FactoryMerger(factory, factory, mFactory, mFactory2);
    }
}
```

3. setFactory 要在 onCreate 之前调用
4. AppCompatActivity 默认设置一个 Factory2，如果我们设置 Factory2，会提示

```
The Activity's LayoutInflater already has a Factory installed so we can not install AppCompat's
```

### AppCompatActivity 的 Factory2

而我们的 App 一般都是继承自 AppCompatActivity，而 AppCompatActivity 给我们默认设置了 Factory2，这个实现就是 AppCompatDelegateImpl。

```java
// AppCompatActivity
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    final AppCompatDelegate delegate = getDelegate();
    delegate.installViewFactory();
    delegate.onCreate(savedInstanceState);
    super.onCreate(savedInstanceState);
}

// AppCompatDelegateImpl实现了LayoutInflater.Factory2接口
@Override
public void installViewFactory() {
    LayoutInflater layoutInflater = LayoutInflater.from(mContext);
    if (layoutInflater.getFactory() == null) {
        LayoutInflaterCompat.setFactory2(layoutInflater, this); // 设置setFactory2为AppCompatDelegateImpl实例
    } else {
        if (!(layoutInflater.getFactory2() instanceof AppCompatDelegateImpl)) {
            Log.i(TAG, "The Activity's LayoutInflater already has a Factory installed"
                    + " so we can not install AppCompat's");
        }
    }
}
```

现在看看 AppCompatDelegateImpl 实现接口 Factory2 的 onCreateView 方法

```java
// AppCompatDelegateImpl
@Override
public final View onCreateView(View parent, String name, Context context, AttributeSet attrs) {
    return createView(parent, name, context, attrs);
}
@Override
public View onCreateView(String name, Context context, AttributeSet attrs) {
    return onCreateView(null, name, context, attrs);
}
```

最后都调用了：

```
@Override
public View createView(View parent, final String name, @NonNull Context context,
        @NonNull AttributeSet attrs) {
    if (mAppCompatViewInflater == null) {
        TypedArray a = mContext.obtainStyledAttributes(R.styleable.AppCompatTheme);
        String viewInflaterClassName =
                a.getString(R.styleable.AppCompatTheme_viewInflaterClass); // 从主题设置中找viewInflaterClass的配置
        if (viewInflaterClassName == null) {
            // Set to null (the default in all AppCompat themes). Create the base inflater
            // (no reflection) 
            mAppCompatViewInflater = new AppCompatViewInflater(); // 如果主题中没有设置，那么创建默认值
        } else {
            try {
                Class<?> viewInflaterClass = Class.forName(viewInflaterClassName);
                mAppCompatViewInflater =
                        (AppCompatViewInflater) viewInflaterClass.getDeclaredConstructor()
                                .newInstance(); // 反射创建AppCompatViewInflater对象
            } catch (Throwable t) {
                Log.i(TAG, "Failed to instantiate custom view inflater "
                        + viewInflaterClassName + ". Falling back to default.", t);
                mAppCompatViewInflater = new AppCompatViewInflater();
            }
        }
    }

    boolean inheritContext = false;
    if (IS_PRE_LOLLIPOP) {
        inheritContext = (attrs instanceof XmlPullParser)
                // If we have a XmlPullParser, we can detect where we are in the layout
                ? ((XmlPullParser) attrs).getDepth() > 1
                // Otherwise we have to use the old heuristic
                : shouldInheritContext((ViewParent) parent);
    }

    return mAppCompatViewInflater.createView(parent, name, context, attrs, inheritContext,
            IS_PRE_LOLLIPOP, /* Only read android:theme pre-L (L+ handles this anyway) */
            true, /* Read read app:theme as a fallback at all times for legacy reasons */
            VectorEnabledTintResources.shouldBeUsed() /* Only tint wrap the context if enabled */
    );
}
```

## LayoutInflater.Factory/Factory2 应用

1. 使用自定义 View 替换系统中的 View
2. 高效的引入外部字体的完成 app 中统一所有字体的
3. 动态换肤<br /><https://blog.csdn.net/lmj623565791/article/details/51503977>
4. 无需编写 shape、selector，直接在 xml 设置值<br />[无需自定义View，彻底解放shape，selector吧](https://juejin.im/post/5b9682ebe51d450e543e3495)
5. View 拦截操作
6. View inflate 耗时统计

### view inflate 耗时（只能统计 view 创建的时间，不能统计解析 xml 的时间）

1. 继承自 AppCompatActivity

```java
//MainActivity extends AppCompatActivity
@Override
protected void onCreate(Bundle savedInstanceState) {
    //Hook 每一个控件加载耗时
    LayoutInflaterCompat.setFactory2(getLayoutInflater(), new LayoutInflater.Factory2() {
        @Override
        public View onCreateView(View parent, String name, Context context, AttributeSet attrs) {
            //①
            long startTime = System.currentTimeMillis();
            //②
            View view = getDelegate().createView(parent, name, context, attrs);
            //③
            long cost = System.currentTimeMillis() - startTime;
            Log.d(TAG, "加载控件：" + name + "耗时：" + cost);
            return view;
        }
        @Override
        public View onCreateView(String name, Context context, AttributeSet attrs) {
            return null;
        }
    });
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
}
```

2. 继承自 FragmentActivity

```java
//MainActivity extends FragmentActivity
@Override
protected void onCreate(Bundle savedInstanceState) {
    LayoutInflaterCompat.setFactory(getLayoutInflater(), new LayoutInflaterFactory() {
        @Override
        public View onCreateView(View parent, String name, Context context, AttributeSet attrs) {
            long startTime = System.currentTimeMillis();
            View view = null;
            try {
                view = getLayoutInflater().createView(name, null, attrs);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
            long cost = System.currentTimeMillis() - startTime;
            map.put(parent,new Hodler(parent,view,name,cost));
            Log.d("=========", "加载布局：" + name + "耗时：" + cost);
            return view;
        }
    });
    super.onCreate(savedInstanceState);
}
```

### 相关库

<https://github.com/chrisjenx/Calligraphy>

<https://github.com/JcMinarro/Philology>

ViewPump

- [ ] LayoutInflater Factory 小结<br /><https://juejin.im/post/5bcd6f1551882577e71c8c88>

# AppCompatViewInflater

可用于减少反射创建 View
