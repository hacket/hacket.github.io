---
date created: 星期二, 十二月 24日 2024, 12:30:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:55:14 晚上
title: LayoutInflater 源码解析
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [LayoutInflater 源码解析]
linter-yaml-title-alias: LayoutInflater 源码解析
---

# LayoutInflater 源码解析

## LayoutInfleter 获取

### getSystemService()

```java
LayoutInflater  inflater = (LayoutInflater) MainActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE)
```

### LayoutInflater.from(Context)

```java
LayoutInflater inflater = LayoutInflater.from(context)
```

## inflate layout 的 2 种方式

### public View inflate([@LayoutRes](/LayoutRes) int resource, [@Nullable](/Nullable) ViewGroup root, boolean attachToRoot)

参数详解

- 1、 如果 root 为 null，attachToRoot 将失去作用，设置任何值都没有意义。
- 2、 如果 root 不为 null，attachToRoot 设为 true，则会给加载的布局文件的指定一个父布局，即 root，并 generateLayoutParams 在 addView 的时候设置进去。
- 3、 如果 root 不为 null，attachToRoot 设为 false，不会给布局指定一个父布局，会将布局文件最外层的所有 layout 属性进行设置，当该 view 被添加到父 view 当中时，这些 layout 属性会自动生效 setLayoutParams()。
- 4、 使用两个参数的 `LayoutInflater.inflate(int resource,ViewGroup root)` 或者 `View.inflate(resource,root)`，在不设置 attachToRoot 参数的情况下，如果 root 不为 null，attachToRoot 参数默认为 true。

```java
public View inflate(XmlPullParser parser, @Nullable ViewGroup root, boolean attachToRoot) {
    // ...
    View result = root;
    final String name = parser.getName();
    if (TAG_MERGE.equals(name)) {
        // ...
        rInflate(parser, root, inflaterContext, attrs, false);
    } else {
        final View temp = createViewFromTag(root, name, inflaterContext, attrs);
        ViewGroup.LayoutParams params = null;
        if (root != null) { 
            // 如果root不为null，那么会生成LayoutParams
            params = root.generateLayoutParams(attrs);
            if (!attachToRoot) {
                // 如果attachToRoot为false，那么会为createViewFromTag()生成的根View设置setLayoutParams(params)
                temp.setLayoutParams(params);
            }
        }
        // ...
        rInflateChildren(parser, temp, attrs, true);
        // ...
        // 如果root不为null且attachToRoot为true，那么将生成的View添加到root
        if (root != null && attachToRoot) {
            root.addView(temp, params);
        }
        // 如果root为null或者attachToRoot为false，那么返回的View为生成的View，否则为root
        if (root == null || !attachToRoot) {
            result = temp;
        }
    }
    // ...
    return result;
}
```

### public static View inflate(Context context, [@LayoutRes](/LayoutRes) int resource, ViewGroup root)

```java
public static View inflate(Context context, @LayoutRes int resource, ViewGroup root) {
    LayoutInflater factory = LayoutInflater.from(context);
    return factory.inflate(resource, root);
}
```

## 小结

### merge 相关

1. merge 必须作为布局的根标签，如果非 root 标签抛出异常 InflateException`<merge /> must be the root element`

```java
void rInflate(XmlPullParser parser, View parent, Context context, AttributeSet attrs, boolean finishInflate) {
    //...
    int type;
    while (((type = parser.next()) != XmlPullParser.END_TAG ||
            parser.getDepth() > depth) && type != XmlPullParser.END_DOCUMENT) {
        //...
        final String name = parser.getName();
        if (TAG_REQUEST_FOCUS.equals(name)) {
        //...
        } else if (TAG_MERGE.equals(name)) {
            throw new InflateException("<merge /> must be the root element");
        }
        //...
    }
}
```

疑问：为啥 `TAG_MERGE.equals(name)` 就一定不为 root 标签呢？<br />这是因为如果 merge 为根标签，在 `inflate(parser, root, attachToRoot)`

```java
public View inflate(XmlPullParser parser, @Nullable ViewGroup root, boolean attachToRoot) {
    advanceToRootNode(parser); // 这里调用了一次parser.next()
    if (TAG_MERGE.equals(name)) {
        if (root == null || !attachToRoot) {
            throw new InflateException("<merge /> can be used only with a valid "
                    + "ViewGroup root and attachToRoot=true");
        }
        rInflate(parser, root, inflaterContext, attrs, false); // 这里又调用了一次parser.next()
    }
}
```

2. 如果 inflate(resource,root,attachToRoot) 中的 root 为 null 或者 attachToRoot 为 false，那么 resource 布局根标签不能为标签，抛出异常 InflateException`<merge /> can be used only with a valid ViewGroup root and attachToRoot=true`

```java
// LayoutInflater
public View inflate(XmlPullParser parser, @Nullable ViewGroup root, boolean attachToRoot) {
    if (TAG_MERGE.equals(name)) { 
        if (root == null || !attachToRoot) {
            throw new InflateException("<merge /> can be used only with a valid "
                    + "ViewGroup root and attachToRoot=true");
        }
        rInflate(parser, root, inflaterContext, attrs, false);
    } 
}
```

### include 相关

1. include 不能作为根标签

```java
void rInflate(XmlPullParser parser, View parent, Context context, AttributeSet attrs, boolean finishInflate) {
    //...
    int type;
    while (((type = parser.next()) != XmlPullParser.END_TAG ||
            parser.getDepth() > depth) && type != XmlPullParser.END_DOCUMENT) {
        //...
        final String name = parser.getName();
        if (TAG_REQUEST_FOCUS.equals(name)) {
        //...
        } else if ((TAG_INCLUDE.equals(name)) {
            throw new InflateException("<merge /> must be the root element");
        }
        //...
    }
}
```

2. include 不能用在 View 里面，只能用于 ViewGroup 中，否则报错 `"<include /> can only be used inside of a ViewGroup"`
3. include 必须指定 layout 属性，而且 layout 指定的 layout 必须有效 `"You must specify a layout in the include tag: <include layout=@layout/layoutID/>"`
4. 如果 include 所在的 ViewGroup 可以 generateLayoutParams() 那么就用这个，如果不能，会默认设置一个 ViewGroup.LayoutParams

## inflate() 原理

### inflate

这个函数就是我们把 Xml 布局文件实例化为一个 View 对象的入口了；tryInflatePrecompiled() 是编译期通过 xml 生成 view，目前 (2020 年 10 月 26 日) 还不可靠。

```java
// LayoutInflater
public View inflate(@LayoutRes int resource, @Nullable ViewGroup root, boolean attachToRoot) {
    final Resources res = getContext().getResources();
    if (DEBUG) {
        Log.d(TAG, "INFLATING from resource: \"" + res.getResourceName(resource) + "\" ("
              + Integer.toHexString(resource) + ")");
    }

    View view = tryInflatePrecompiled(resource, res, root, attachToRoot); //这段代码其实是必然返回null的，因为当前版本写死了预编译的Enable为false
    if (view != null) {
        return view;
    }
    XmlResourceParser parser = res.getLayout(resource); //获取XmlBlock.Parser对象
    try {
        return inflate(parser, root, attachToRoot); 
    } finally {
        parser.close(); 
    }
}
```

此处又调用了 `inflate(parser, root, attachToRoot)` 这个函数，来对 Xml 布局进行解析

```java
public View inflate(XmlPullParser parser, @Nullable ViewGroup root, boolean attachToRoot) {//XmlPullParser是一个接口
	//此函数是真正执行将xml解析为视图view的过程，此处的parser为根据xml布局获取到的parser对象
    synchronized (mConstructorArgs) {
        Trace.traceBegin(Trace.TRACE_TAG_VIEW, "inflate");

        final Context inflaterContext = mContext;
        final inflateAttributeSet attrs = Xml.asAttributeSet(parser);
        Context lastContext = (Context) mConstructorArgs[0];
        mConstructorArgs[0] = inflaterContext;
        View result = root; //需要返回的view对象

        try {
            advanceToRootNode(parser); //对START_TAG和END_TAG进行判断和处理
            final String name = parser.getName();  //获取当前标签

            if (DEBUG) {
                System.out.println("**************************");
                System.out.println("Creating root view: "
                        + name);
                System.out.println("**************************");
            }

            if (TAG_MERGE.equals(name)) { //如果使用merge标签
                if (root == null || !attachToRoot) { //使用merge标签必须有父布局，且依赖于父布局加载，否则就会抛出异常
                    throw new InflateException("<merge /> can be used only with a valid "
                            + "ViewGroup root and attachToRoot=true");
                }

                rInflate(parser, root, inflaterContext, attrs, false);//递归（Recursive）生成布局视图
            } else { //如果不使用merge标签，创建tmp 作为临时的根节点，并最终赋值给result返回
                // Temp is the root view that was found in the xml
                final View temp = createViewFromTag(root, name, inflaterContext, attrs); ////根据标签名创建一个view

                ViewGroup.LayoutParams params = null;

                if (root != null) {  //如果rootView不为空
                    if (DEBUG) {
                        System.out.println("Creating params from root: " +
                                root);
                    }
                    // Create layout params that match root, if supplied
                    params = root.generateLayoutParams(attrs);  //根据rootView生成layoutparams
                    if (!attachToRoot) { //如果attachToRoot为false
                        // Set the layout params for temp if we are not
                        // attaching. (If we are, we use addView, below)
                        temp.setLayoutParams(params);  //设置一个临时的params
                    }
                }

                if (DEBUG) {
                    System.out.println("-----> start inflating children");
                }

                // Inflate all children under temp against its context.
                rInflateChildren(parser, temp, attrs, true);

                if (DEBUG) {
                    System.out.println("-----> done inflating children");
                }

                // We are supposed to attach all the views we found (int temp)
                // to root. Do that now.
                if (root != null && attachToRoot) { //如果root不为空，且attachToRoot为true
                    root.addView(temp, params); //把temp添加到到rootview中
                }

                // Decide whether to return the root that was passed in or the
                // top view found in xml.
                if (root == null || !attachToRoot) { // 如果root为空且attachToRoot为false
                    result = temp; //将temp，也就是根结点的View赋值给result
                }
            }

        } 
		// ...
        return result;  //返回结果
	}
}
```

### rInflate

不管是 merge 标签，还是非 merge 标签，最终都会调用到 rInflate() 这个函数，这个是用于递归向下遍历 xml 布局，最终调用 createViewFromTag() 函数来反射创建 View 对象

```java
void rInflate(XmlPullParser parser, View parent, Context context,
            AttributeSet attrs, boolean finishInflate) throws XmlPullParserException, IOException {

    final int depth = parser.getDepth();
    int type;
    boolean pendingRequestFocus = false;

    while (((type = parser.next()) != XmlPullParser.END_TAG ||
            parser.getDepth() > depth) && type != XmlPullParser.END_DOCUMENT) {

        if (type != XmlPullParser.START_TAG) {
            continue;
        }

        final String name = parser.getName();

        if (TAG_REQUEST_FOCUS.equals(name)) { //如果需REQUEST_FOCUS标签
            pendingRequestFocus = true;
            consumeChildElements(parser);
        } else if (TAG_TAG.equals(name)) { //如果是“tag”标签
            parseViewTag(parser, parent, attrs);
        } else if (TAG_INCLUDE.equals(name)) { //如果是 Include标签
            if (parser.getDepth() == 0) {
                throw new InflateException("<include /> cannot be the root element");
            }
            parseInclude(parser, context, parent, attrs); //对 include标签进行解析
        } else if (TAG_MERGE.equals(name)) { //如果是merge标签
            throw new InflateException("<merge /> must be the root element"); //直接抛出异常
        } else { //其他标签
            final View view = createViewFromTag(parent, name, context, attrs); //根据Tag创建view，反射创建View
            final ViewGroup viewGroup = (ViewGroup) parent;
            final ViewGroup.LayoutParams params = viewGroup.generateLayoutParams(attrs);
            rInflateChildren(parser, view, attrs, true); //递归调用rInflate函数
            viewGroup.addView(view, params);
        }
    }

    if (pendingRequestFocus) {
        parent.restoreDefaultFocus();
    }

    if (finishInflate) {
        parent.onFinishInflate();
    }
}
```

### createViewFromTag

真正根据解析到的 Tag 标签去反射创建 View 的函数

```java
View createViewFromTag(View parent, String name, Context context, AttributeSet attrs,
            boolean ignoreThemeAttr) {
    if (name.equals("view")) {
        name = attrs.getAttributeValue(null, "class");
    }

    // Apply a theme wrapper, if allowed and one is specified.
    if (!ignoreThemeAttr) {
        final TypedArray ta = context.obtainStyledAttributes(attrs, ATTRS_THEME);
        final int themeResId = ta.getResourceId(0, 0);
        if (themeResId != 0) {
            context = new ContextThemeWrapper(context, themeResId);
        }
        ta.recycle();
    }

    try {
        View view = tryCreateView(parent, name, context, attrs); //尝试使用Factory来闯将View对象

        if (view == null) { //如果tryCreateView返回null
            final Object lastContext = mConstructorArgs[0];
            mConstructorArgs[0] = context;
            try {
				//sample：com.aiwinn.base.widget.CameraSurfaceView
                if (-1 == name.indexOf('.')) {  //如果当前Tag含有“.”
                    view = onCreateView(context, parent, name, attrs);
                } else {
                    view = createView(context, name, null, attrs);
                }
            } finally {
                mConstructorArgs[0] = lastContext;
            }
        }

        return view;
    } 
  	// ...
}
```

#### tryCreateView() 通过 Factory/Factory2/mPrivateFactory 来创建 View

在这个函数中会首先调用 tryCreateView() 来获取 View 对象

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

> 如果标签为 blink 返回 BlinkLayout；根据设置的 Factory2 和 Factory 来创建对象

#### createView() 没有自定义 Factory，默认创建，反射

如果 tryCreateView() 返回为 null，则进一步调用 createView() 函数来创建 View 对象

```java
public final View createView(@NonNull Context viewContext, @NonNull String name,
        @Nullable String prefix, @Nullable AttributeSet attrs)
        throws ClassNotFoundException, InflateException {
			//根据Tag反射创建view
    Objects.requireNonNull(viewContext);
    Objects.requireNonNull(name);
    Constructor<? extends View> constructor = sConstructorMap.get(name);
    if (constructor != null && !verifyClassLoader(constructor)) {
        constructor = null;
        sConstructorMap.remove(name);
    }
    Class<? extends View> clazz = null;

    try {
        Trace.traceBegin(Trace.TRACE_TAG_VIEW, name);

        if (constructor == null) {
            // Class not found in the cache, see if it's real, and try to add it
            clazz = Class.forName(prefix != null ? (prefix + name) : name, false,
                    mContext.getClassLoader()).asSubclass(View.class);//把prefix和name进行拼接，获取到对应的Class对象

            if (mFilter != null && clazz != null) {
                boolean allowed = mFilter.onLoadClass(clazz);
                if (!allowed) {
                    failNotAllowed(name, prefix, viewContext, attrs);
                }
            }
            constructor = clazz.getConstructor(mConstructorSignature);//获取构构造器对象
            constructor.setAccessible(true);
            sConstructorMap.put(name, constructor);
        } else {
            // ...
        }

        Object lastContext = mConstructorArgs[0];
        mConstructorArgs[0] = viewContext;
        Object[] args = mConstructorArgs;
        args[1] = attrs;

        try {
            final View view = constructor.newInstance(args); //根据获取到的构造器创建一个View的实例化对象
            if (view instanceof ViewStub) {
                // Use the same context when inflating ViewStub later.
                final ViewStub viewStub = (ViewStub) view;
                viewStub.setLayoutInflater(cloneInContext((Context) args[0]));
            }
            return view;
        } finally {
            mConstructorArgs[0] = lastContext;
        }catch{
          	// ...
        }
    } 
}
```

## 彩蛋 BlinkLayout

BlinkLayout 是 LayoutInflater 中的一个内部类，它本身是是 FrameLayout 的子类,如果当前标签为 `TAG_1995`blink，则创建一个隔 0.5 秒闪烁一次的 BlinkLayout 来承载它的布局内容

> 源码注释也很有意思，写了 Let's party like it's 1995!, 据说是为了庆祝 1995 年的复活节

```xml
<blink
    android:layout_below="@id/iv_qr_code"
    android:layout_centerHorizontal="true"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Android研习社"
        android:textColor="#157686"
        android:textSize="55sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</blink>
```

![](https://user-gold-cdn.xitu.io/2019/11/20/16e86998404438a3?imageslim#id=rXupY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

这种效果也适合来做 EditText 中光标的闪烁效果

## Ref

- [x] 「Android10 源码分析」为什么复杂布局会产生卡顿？-- LayoutInflater 详解 <https://juejin.im/post/6844904000966361101>
