---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# 版本兼容问题

## Typeface.create ArrayIndexOutOfBoundsException

### 错误堆栈

```java
Caused by java.lang.ArrayIndexOutOfBoundsException: length=3; index=3
   at android.util.ContainerHelpers.binarySearch(ContainerHelpers.java:47)
   at android.util.LongSparseArray.get(LongSparseArray.java:113)
   at android.util.LongSparseArray.get(LongSparseArray.java:104)
   at android.graphics.Typeface.create(Typeface.java:744)
   at android.graphics.Typeface.create(Typeface.java:710)
   at android.widget.TextView.setTypefaceFromAttrs(TextView.java:2151)
   at android.widget.TextView.<init>(TextView.java:1657)
   at android.widget.Button.<init>(Button.java:166)
   at android.widget.Button.<init>(Button.java:141)
   at androidx.appcompat.widget.AppCompatButton.<init>(AppCompatButton.java:80)
   at androidx.appcompat.widget.AppCompatButton.<init>(AppCompatButton.java:75)
   at androidx.appcompat.app.AppCompatViewInflater.createButton(AppCompatViewInflater.java:211)
   at androidx.appcompat.app.AppCompatViewInflater.createView(AppCompatViewInflater.java:129)
   at androidx.appcompat.app.AppCompatDelegateImpl.createView(AppCompatDelegateImpl.java:1565)
   at androidx.appcompat.app.AppCompatDelegateImpl.onCreateView(AppCompatDelegateImpl.java:1616)
   at android.view.LayoutInflater$FactoryMerger.onCreateView(LayoutInflater.java:189)
   at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:783)
   at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:741)
   at android.view.LayoutInflater.rInflate(LayoutInflater.java:874)
   at android.view.LayoutInflater.rInflateChildren(LayoutInflater.java:835)
   at android.view.LayoutInflater.rInflate(LayoutInflater.java:877)
   at android.view.LayoutInflater.rInflateChildren(LayoutInflater.java:835)
   at android.view.LayoutInflater.inflate(LayoutInflater.java:515)
   at android.view.LayoutInflater.inflate(LayoutInflater.java:423)
   at androidx.databinding.DataBindingUtil.inflate(DataBindingUtil.java:126)
   at androidx.databinding.ViewDataBinding.inflateInternal(ViewDataBinding.java:1409)
   at com.xxx.xxx.databinding.SiGuideDialogDefaultSettingBinding.inflate(SiGuideDialogDefaultSettingBinding.java:91)
   at com.xxx.xxx.databinding.SiGuideDialogDefaultSettingBinding.inflate(SiGuideDialogDefaultSettingBinding.java:77)
   at com.xxx.xxx.FirstInstallConfirmDefaultDialog.getView(FirstInstallConfirmDefaultDialog.kt:63)
   at com.xxx.base.uicomponent.dialog.BaseBottomSheetDialog.onCreateView(BaseBottomSheetDialog.kt:46)
   at androidx.fragment.app.Fragment.performCreateView(Fragment.java:3104)
   at androidx.fragment.app.DialogFragment.performCreateView(DialogFragment.java:510)
   at androidx.fragment.app.FragmentStateManager.createView(FragmentStateManager.java:524)
   at androidx.fragment.app.FragmentStateManager.moveToExpectedState(FragmentStateManager.java:261)
   at androidx.fragment.app.FragmentManager.executeOpsTogether(FragmentManager.java:1890)
   at androidx.fragment.app.FragmentManager.removeRedundantOperationsAndExecute(FragmentManager.java:1814)
   at androidx.fragment.app.FragmentManager.execPendingActions(FragmentManager.java:1751)
   at androidx.fragment.app.FragmentManager$5.run(FragmentManager.java:538)
   at android.os.Handler.handleCallback(Handler.java:795)
   at android.os.Handler.dispatchMessage(Handler.java:99)
   at android.os.Looper.loop(Looper.java:166)
   at android.app.ActivityThread.main(ActivityThread.java:6861)
   at java.lang.reflect.Method.invoke(Method.java)
   at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:450)
   at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:936)
```

### 系统版本分布和设备

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686058517840-00d48e04-bdca-4926-9799-1990894c25e3.png#averageHue=%23dee6f6&clientId=u23bcf36e-748c-4&from=paste&height=127&id=u29c8c01d&originHeight=344&originWidth=806&originalType=binary&ratio=2&rotation=0&showTitle=false&size=38013&status=done&style=none&taskId=ua6c7f48d-0bbb-4a86-a9e6-37ef3d2cd83&title=&width=297)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686058540712-35d46495-853f-45f8-b1ee-3841c6829109.png#averageHue=%23f9f9f9&clientId=u23bcf36e-748c-4&from=paste&height=207&id=ua02aafa3&originHeight=568&originWidth=818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55232&status=done&style=none&taskId=u430d08c0-17dd-41dc-ab1a-d37e8a4306c&title=&width=298)<br />从系统版本分布可得知，这大概率是一个Android8.0及以下的系统bug

### 分析

从堆栈可以看出来，在TextView的setTypefaceFromAttrs中调用了`Typeface create(String familyName, @Style int style)`

```java
private void setTypefaceFromAttrs(@Nullable Typeface typeface, @Nullable String familyName,
                                  @XMLTypefaceAttr int typefaceIndex, @Typeface.Style int style,
                                  @IntRange(from = -1, to = FontStyle.FONT_WEIGHT_MAX) int weight) {
if (typeface == null && familyName != null) {
    // Lookup normal Typeface from system font map.
    final Typeface normalTypeface = Typeface.create(familyName, Typeface.NORMAL);
}
// ...
}
```

下面我们从Android8和Android9来分析一下：<br />[**Android8 Typeface**](https://cs.android.com/android/platform/superproject/+/android-8.1.0_r10:frameworks/base/graphics/java/android/graphics/Typeface.java)

```java
// TODO: Unify with Typeface.sTypefaceCache.
@GuardedBy("sLock")
private static final LongSparseArray<SparseArray<Typeface>> sTypefaceCache = new LongSparseArray<>(3);
public static Typeface create(String familyName, int style) {
    if (sSystemFontMap != null) {
        return create(sSystemFontMap.get(familyName), style);
    }
    return null;
}
public static Typeface create(Typeface family, int style) {
    if (style < 0 || style > 3) {
        style = 0;
    }
    long ni = 0;
    if (family != null) {
        // Return early if we're asked for the same face/style
        if (family.mStyle == style) {
            return family;
        }

        ni = family.native_instance;
    }

    Typeface typeface;
    SparseArray<Typeface> styles = sTypefaceCache.get(ni);

    if (styles != null) {
        typeface = styles.get(style);
        if (typeface != null) {
            return typeface;
        }
    }

    typeface = new Typeface(nativeCreateFromTypeface(ni, style));
    if (styles == null) {
        styles = new SparseArray<Typeface>(4);
        sTypefaceCache.put(ni, styles);
    }
    styles.put(style, typeface);

    return typeface;
}
// LongSparseArray
public E get(long key, E valueIfKeyNotFound) {
    int i = ContainerHelpers.binarySearch(mKeys, mSize, key);

    if (i < 0 || mValues[i] == DELETED) {
        return valueIfKeyNotFound;
    } else {
        return (E) mValues[i];
    }
}
static int binarySearch(long[] array, int size, long value) {
    int lo = 0;
    int hi = size - 1;

    while (lo <= hi) {
        final int mid = (lo + hi) >>> 1;
        final long midVal = array[mid];

        if (midVal < value) {
            lo = mid + 1;
        } else if (midVal > value) {
            hi = mid - 1;
        } else {
            return mid;  // value found
        }
    }
    return ~lo;  // value not present
}
```

从报错堆栈来看，是在LongSparseArray进行get时，数组越界了，那么我们可以大概猜测的是在22行`sTypefaceCache.get(ni);`导致的，而`sTypefaceCache`是一个初始最大容量为3的LongSparseArray�。<br />在操作LongSparseArray有多线程操作，导致mKeys, mSize值的变更不是原子操作，可能出现不一致的情况，导致数组越界了。<br />[**Android9 Typeface create**](https://cs.android.com/android/platform/superproject/+/android-9.0.0_r5:frameworks/base/graphics/java/android/graphics/Typeface.java)

```java
private static final Object sStyledCacheLock = new Object();
/**
 * Cache for Typeface objects for weight variant. Currently max size is 3.
 */
@GuardedBy("sWeightCacheLock")
private static final LongSparseArray<SparseArray<Typeface>> sWeightTypefaceCache =
        new LongSparseArray<>(3);
public static Typeface create(String familyName, @Style int style) {
    return create(sSystemFontMap.get(familyName), style);
}
public static Typeface create(Typeface family, @Style int style) {
    if ((style & ~STYLE_MASK) != 0) {
        style = NORMAL;
    }
    if (family == null) {
        family = sDefaultTypeface;
    }

    // Return early if we're asked for the same face/style
    if (family.mStyle == style) {
        return family;
    }

    final long ni = family.native_instance;

    Typeface typeface;
    synchronized (sStyledCacheLock) {
        SparseArray<Typeface> styles = sStyledTypefaceCache.get(ni);
        if (styles == null) {
            styles = new SparseArray<Typeface>(4);
            sStyledTypefaceCache.put(ni, styles);
        } else {
            typeface = styles.get(style);
            if (typeface != null) {
                return typeface;
            }
        }
        typeface = new Typeface(nativeCreateFromTypeface(ni, style));
        styles.put(style, typeface);
    }
    return typeface;
}
```

### 结论：

- Android8的版本在读写`sTypefaceCache`的时候没有加锁，而sTypefaceCache是一个静态变量，所有线程通过Typeface.create创建的Typeface会被缓存在sTypefaceCache，如果有多线程访问的话，会有多线程安全问题
- Android9的版本就用`sStyledCacheLock`对象锁加锁了
- 而项目中用到异步inflate，如果设置加粗字体，会在子线程设置Typeface，在Android8及以下可能会导致线程安全问题，多线程访问了sTypefaceCache，多线程访问了就数组越界了？
