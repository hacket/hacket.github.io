---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# MultiDex

## multidex的产生

在Android5.0之前，每一个Android应用中只会含有一个dex文件，因为Android系统本身的bug，使得这个dex的方法数量被限制在65535之内，这就是64K(64x1024)事件。为了解决这个问题，Google官方推出了support-library库。用起来也会有一些坑。

Android Apk文件包含DEX(Dalvik Executable)文件形式的可执行字节码文件，其中包含用来运行您的应用的已编译代码。Dalvik Executable规范将可在单个DEX文件内可引用的方法总数限制在65536，其中包括Android框架方法、库方法以及您自己代码中的方法，称之为64K引用限制。<br />Android5.0之前版本的Dalvik可执行文件分包支持Android5.0（API21）之前的平台版本使用Dalvik运行时来执行应用代码。默认情况下，Dalvik限制应用的每个apk只能使用单个classes.dex字节码文件。要想绕过这一限制，可以使用Dalvik可执行文件分包支持库，它会成为您的应用主要DEX文件的一部分，然后管理对其他DEX文件及其包含代码的访问。<br />Android5.0及更高的版本的Dalvik可执行文件分包支持Android5.0及更高版本使用名为ART的运行时，ART原生支持从APK文件加载多个DEX文件。ART在应用安装时执行预编译，扫描`classesN.dex`文件，并将它们编译成单个`.oat`文件，供Android设备执行。因此，如果你的minSdkVersion大于等于21，不需要Dalvik可执行文件分包支持库。

> 如果将应用的minSdkVerson设置大于等于21，使用InstallRun时，AS会自动将应用配置为进行Dalvik可执行文件分包。由于Install Run仅适用于调试版本的应用，您仍需配置发布构建进行Dalvik可执行文件分包，以规避64K限制。

## multiDexKeepFile属性

## multiDexKeepProguard属性

## multidex产生背景

Android系统安装一个应用的时候，有一步是对Dex进行优化，这个过程有一个专门的工具来处理，叫做DexOpt。DexOpt的执行过程是第一次加载Dex文件的时候执行的。这个过程会生成一个ODEX文件，即Optimised Dex。执行ODEX文件效率会比直接执行Dex文件的效率要高的多。<br />但是在早期Android系统中，DexOpt有一个问题，DexOpt会把每一个类的方法id检索起来，存在一个链表结构里面。但是这个链表的长度是用一个short类型来保存的，导致了方法id的数目不能够超过65536个。当一个项目足够大的时候，显然这个方法数的上限是不够的。尽管在新版本的Android系统中，DexOpt修复了这个问题，但是我们仍然需要对低版本的Android系统做兼容。需要将dex文件拆分成两个或多个。

## multidex原理总结

1. apk在Application实例化之后，会检查系统版本是否支持MultiDex，判断二级dex是否需要安装
2. 如果需要安装则会从apk中解压出classes2.dex并将其拷贝到应用的`/data/data/<package-name>/code_cache/secondary-dexes/`目录下
3. 通过反射将classes2.dex等注入到当前ClassLoader的pathList中，完成安装流程

## multiDex原理

MultiDex工作流程分为2个部分，一个部分是打包构建apk的时候，将dex文件拆分若干个小的dex文件，这个gradle已经帮我们做了；另外一个部分是在启动apk的时候，同时加载多个dex文件（具体是加载Dex文件优化后的odex文件，不过文件名还是.dex），这一部分工作从Android5.0开始系统已经帮我们做了，但是Android5.0之前还是需要通过MultiDex库来支持。

我们来分析第二部分的，启动apk时加载多个dex文件。<br />从MultiDex.install()入手:

```java
 // MultiDex#install(Context)
 public static void install(Context context) {
    Log.i(TAG, "install");
    if (IS_VM_MULTIDEX_CAPABLE) {
        Log.i(TAG, "VM has multidex support, MultiDex support library is disabled.");
        return;
    }

    if (Build.VERSION.SDK_INT < MIN_SDK_VERSION) { // 最低版本兼容到Android1.6
        throw new RuntimeException("Multi dex installation failed. SDK " + Build.VERSION.SDK_INT
                + " is unsupported. Min SDK version is " + MIN_SDK_VERSION + ".");
    }

    try {
        ApplicationInfo applicationInfo = getApplicationInfo(context);
        if (applicationInfo == null) {
            // Looks like running on a test Context, so just return without patching.
            return;
        }

        synchronized (installedApk) {
            String apkPath = applicationInfo.sourceDir;
            if (installedApk.contains(apkPath)) {
                return;
            }
            installedApk.add(apkPath);

            if (Build.VERSION.SDK_INT > MAX_SUPPORTED_SDK_VERSION) {
                Log.w(TAG, "MultiDex is not guaranteed to work in SDK version "
                        + Build.VERSION.SDK_INT + ": SDK version higher than "
                        + MAX_SUPPORTED_SDK_VERSION + " should be backed by "
                        + "runtime with built-in multidex capabilty but it's not the "
                        + "case here: java.vm.version=\""
                        + System.getProperty("java.vm.version") + "\"");
            }

            /* The patched class loader is expected to be a descendant of
             * dalvik.system.BaseDexClassLoader. We modify its
             * dalvik.system.DexPathList pathList field to append additional DEX
             * file entries.
             */
            ClassLoader loader;
            try {
                loader = context.getClassLoader();
            } catch (RuntimeException e) {
                /* Ignore those exceptions so that we don't break tests relying on Context like
                 * a android.test.mock.MockContext or a android.content.ContextWrapper with a
                 * null base Context.
                 */
                Log.w(TAG, "Failure while trying to obtain Context class loader. " +
                        "Must be running in test mode. Skip patching.", e);
                return;
            }
            if (loader == null) {
                // Note, the context class loader is null when running Robolectric tests.
                Log.e(TAG,
                        "Context class loader is null. Must be running in test mode. "
                        + "Skip patching.");
                return;
            }

            try {
              clearOldDexDir(context);
            } catch (Throwable t) {
              Log.w(TAG, "Something went wrong when trying to clear old MultiDex extraction, "
                  + "continuing without cleaning.", t);
            }
            // MultiDex的二级dex文件将存放在/data/data/<package-name>/secondary-dexex目录下
            File dexDir = getDexDir(context, applicationInfo);
            // 从apk中查找并解压二级dex文件到/data/data/<package-name>/secondary-dexes目录下
            List<File> files = MultiDexExtractor.load(context, applicationInfo, dexDir, false);
            if (checkValidZipFiles(files)) { // 检查dex压缩文件的完整性
                installSecondaryDexes(loader, dexDir, files); // 开始安装dex
            } else {
                Log.w(TAG, "Files were not valid zip files.  Forcing a reload.");
                // Try again, but this time force a reload of the zip file. // 第一次失败，重试一次
                files = MultiDexExtractor.load(context, applicationInfo, dexDir, true); 

                if (checkValidZipFiles(files)) {
                    installSecondaryDexes(loader, dexDir, files);
                } else {
                    // Second time didn't work, give up
                    throw new RuntimeException("Zip files were not valid.");
                }
            }
        }

    } catch (Exception e) {
        Log.e(TAG, "Multidex installation failure", e);
        throw new RuntimeException("Multi dex installation failed (" + e.getMessage() + ").");
    }
    Log.i(TAG, "install done");
}
```

MultiDex安装的整个流程：

1. 检查虚拟机版本判断是否需要MultiDex<br />在ART虚拟机中(部分4.4机器及5.0以上的机器)，采用了AOT(Ahead-of-time compilation)技术，系统在apk的安装过程中，会使用自带的dex2oat工具对apk中可用的dex文件进行编译，并生成一个可在本地机器上运行的odex(optimized dex)文件，这样做会提高应用的启动速度（安装速度降低了）。<br />若不需要使用MultiDex，将使用`clearOldDexDir()`清除`/data/data/<package-name>/code-cache/secondary-dexes`目录下所有文件
2. 根据ApplicationInfo.sourceDir的值获取安装的apk路径<br />安装完成的apk路径为`/data/app/<package-name>.apk`
3. 检查apk是否执行MultiDex.install)，若已经安装直接退出
4. 使用MultiDexExtractor.load()获取apk中可用的二级dex列表<br />MultiDexExtractor.load()会先判断是否需要从apk中解压dex文件，主要判断依据是：上次保存的apk(zip文件)的CRC校验码和last modify日期与dex的总数量是否与当前apk相同，forceReload也会决定是否需要重新解压。<br />如果需要解压dex文件，将会使用`performExtractions()`将.dex从apk中解压出来，解压路径为`/data/data/<package-name>/code_cache/secondary-dexes/<package-name>.apk.classN.zip`(N>=2)。<br />解压成功后，会保存本次解压所使用的apk信息，用于下次调用MultiDexExtractor.load()时判断是否需要重新解压；<br />如果apk未被修改，将会调用`loadExistingExtractors()`方法，直接加载上一次解压出来的文件。
5. 两次校验dex压缩包的完整性<br />若第一次校验失败(dex文件损坏等)，MultiDex会重新调用MultiDexExtractor.load()方法重新查找加载二级dex文件列表，值得注意的是第二次查找forceReload的值为true，会强制重新从apk中解压dex文件。
6. 开始dex的安装<br />经过上面的重重检验和解压，到了最关键的一步：<br />将二级dex添加到我们的ClassLoader中。

```java
private static void installSecondaryDexes(ClassLoader loader, File dexDir, List<File> files)
        throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException,
        InvocationTargetException, NoSuchMethodException, IOException {
    if (!files.isEmpty()) {
        if (Build.VERSION.SDK_INT >= 19) {
            V19.install(loader, files, dexDir);
        } else if (Build.VERSION.SDK_INT >= 14) {
            V14.install(loader, files, dexDir);
        } else {
            V4.install(loader, files);
        }
    }
}
```

由于SDK版本不同，ClassLoader中的实现存在差异，分析V14版本：

```java
 // MultiDex
 private static final class V14 {

    private static void install(ClassLoader loader, List<File> additionalClassPathEntries,
            File optimizedDirectory)
                    throws IllegalArgumentException, IllegalAccessException,
                    NoSuchFieldException, InvocationTargetException, NoSuchMethodException {
        /* The patched class loader is expected to be a descendant of
         * dalvik.system.BaseDexClassLoader. We modify its
         * dalvik.system.DexPathList pathList field to append additional DEX
         * file entries.
         */
        Field pathListField = findField(loader, "pathList");  // 通过反射找到BaseDexClassLoader的pathList字段
        Object dexPathList = pathListField.get(loader); // 获取pathList原有的值
        expandFieldArray(dexPathList, "dexElements", makeDexElements(dexPathList,
                new ArrayList<File>(additionalClassPathEntries), optimizedDirectory));
    }

    // 通过反射调用DexPathList#makeDexElements()方法
    private static Object[] makeDexElements(
            Object dexPathList, ArrayList<File> files, File optimizedDirectory)
                    throws IllegalAccessException, InvocationTargetException,
                    NoSuchMethodException {
        Method makeDexElements =
                findMethod(dexPathList, "makeDexElements", ArrayList.class, File.class);

        return (Object[]) makeDexElements.invoke(dexPathList, files, optimizedDirectory);
    }
}
// dexPathList,dexElements,makeDexElements()
private static void expandFieldArray(Object instance, String fieldName,
        Object[] extraElements) throws NoSuchFieldException, IllegalArgumentException,
        IllegalAccessException {
    Field jlrField = findField(instance, fieldName); // 找到dexElements字段
    Object[] original = (Object[]) jlrField.get(instance); // 获取到该字段的值，为Element[]数组
    Object[] combined = (Object[]) Array.newInstance(
            original.getClass().getComponentType(), original.length + extraElements.length);
    System.arraycopy(original, 0, combined, 0, original.length); // 拷贝原来dexElements数组中的元素到combined数组中
    System.arraycopy(extraElements, 0, combined, original.length, extraElements.length); // 拷贝要添加的元素到combined数组中去
    jlrField.set(instance, combined); // 然后重新设置dexElements的值：为原来的值+后面追加的值
}
```

MultiDex在安装开始时，会先通过反射获取BaseDexClassLoader中`DexPathList`类型的字段`pathList`；

```java
// BaseDexClassLoader
/** structured lists of path elements */
private final DexPathList pathList;
```

接着反射调用`DexPathList`的`makeDexElements()`方法，将上面解压得到的additionalClassPathEntries(二级dex文件列表)封装成Element数组，因为dexElements是通过makeDexElements()方法获取的，我们也通过该方法来构建dexElements数组的值。

```java
// DexPathList
/** list of dex/resource (class path) elements */
private final Element[] dexElements;
public DexPathList(ClassLoader definingContext, String dexPath,
        String libraryPath, File optimizedDirectory) {
    // ...
    this.definingContext = definingContext;
    this.dexElements =
        makeDexElements(splitDexPath(dexPath), optimizedDirectory);
    this.nativeLibraryDirectories = splitLibraryPath(libraryPath);
}
/**
 * Makes an array of dex/resource path elements, one per element of
 * the given array.
 */
private static Element[] makeDexElements(ArrayList<File> files,
        File optimizedDirectory) {
}
```

> makeDexElements最终会去进行dex2opt操作，这是一个比较耗时的过程，如果全部放在main线程去处理的话，比较影响用户体验，甚至可能引起ANR；dex2opt后，/data/data//code_cache/secondary-dexes/目录下会出现优化后的文件：.apk.classes2.dex等

最后调用`MultiDex.expandFieldArray()`，通过反射调用，找到DexPathList中的dexElements字段，并将上一步生成的封装了二级dex的Element数组添加到dexElements以后，完成整个安装流程。

## Reference

- [ ] MultiDex工作原理分析和优化方案<br /><https://zhuanlan.zhihu.com/p/24305296>

# MultiDex优化

#### multidex问题描述

multidex有个问题，就是会产生明显的卡顿问题，主要产生在**解压dex文件**和**优化dex**两个步骤。不过在Application#attachBaseContext中，UI线程的阻塞不会引发ANR的，只不过这段长时间的卡顿（白屏）还是影响用户体验。

#### multidex优化方案

##### PreMultiDex

在安装一个新的apk的时候，先在worker线程里做好MultiDex的解压和optimize工作，安装apk并启动后，直接使用之前optimize产生的odex文件，这样就可以避免第一次启动时候的optimize工作。

缺点：第一次安装的apk没有作用，而且事先需要使用内置的apk更新功能把新版本的apk文件下载下来后，才能做PreMultiDex工作。

##### 异步MultiDex方案

Dex手动分包方案，启动App的时候，先显示一个简单的Spash闪屏界面，然后启动Worker线程执行MultiDex#install()工作，这样就可以避免UI线程阻塞。不过需要确保启动及启动MultiDex#install()工作所需要的类都在主dex里面（手动分包），而且需要处理好进程同步问题。
