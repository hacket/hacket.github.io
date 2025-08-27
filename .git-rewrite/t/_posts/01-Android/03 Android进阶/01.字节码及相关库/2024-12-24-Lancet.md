---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# Lancet引入

## 什么是Lancet？

Lancet 是一个轻量级Android AOP框架，基于ASM

1. 编译速度快, 并且支持增量编译.
2. 简洁的 API, 几行 Java 代码完成注入需求.
3. 没有任何多余代码插入 apk.
4. 支持用于 SDK, 可以在SDK编写注入代码来修改依赖SDK的App.

## lancet引入

- 目前最新官方版本1.0.6的很久不维护了，不支持AMS6，在高版本的AGP上会报错，一般自己要用得自己修改支持
- 支持AGP7.x，Transform废弃

[lancet 升级ASM9.1 ， 适配Gradle7.5.1 AGP7.3.0 ，调整支持Java11](https://github.com/eleme/lancet/issues/69)

- AGP8.x AGP的Transform API移除，用不了了

### Gradle

```groovy
// top gradle.build.kts
buildscript {
    dependencies {
        //noinspection UseTomlInstead
        classpath("me.ele:lancet-plugin:2.0.0")
    }
}

// app gradle.build.kts
plugins {
    id("me.ele.lancet")
}
```

## 和AspectJ对比

Lancet本质上是 Gradle Plugin，通过依赖 Android 的打包插件提供的 Transform API，在打包过程中获取到所有的代码。<br />依赖 ASM 提供的字节码注入能力，通过我们解析自定义的注解，在目标点注入相应的代码。<br />通过注解进行 AOP 这点和 AspectJ 很相似，但是更加轻量和简洁，使用方式也有所不同。

这里要区分一个概念，编译期注入和运行期注入。

**编译期**：即在编译时对字节码做插桩修改，达到 AOP 的目的。优点是运行时无额外的性能损耗，但因为编译时的限制，只能修改最终打包到APK中的代码，即 Android Framework 的代码是固化在 ROM 中的，无法修改。<br />**运行期**：是只在运行时动态的修改代码的执行，因而可以修改 Framework 中代码的执行流程，在hook点上执行性能上有所损耗。

- Lancet，编译期注入
- AspectJ，既支持编译期也支持运行期的注入，运行期的注入一般是依赖JVM提供的AttachAPI，因为

Android 没有 JVM 的环境，实际上 class 还会继续转换成 dex，因此 AspectJ 在 Android 平台是只能做到编译期注入。

- Dexposed，运行期注入

# 使用

- Transfrom 生成的 class 文件放在 `build/intermediates/transforms/lancet/debug`
- 可以在 module 或者 library 中使用，在 module 中定义的注解，在 APK 打包时才会被解析，因此在写

module 时不要 `apply plugin: me.ele.lancet`

## 代码织入方式

### @Proxy

#### @Proxy介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Proxy {
    String value();
}
```

将使用新的方法替换代码里存在的原有的目标方法<br />应用场景：通常用于对系统 API 的劫持。因为虽然我们不能注入代码到系统提供的库之中，但我们可以劫持掉所有调用系统API的地方。

#### @Proxy示例

示例：在Log.d输出，增加当前调用者的线程信息

```java
@Proxy("d")
@TargetClass("android.util.Log")
public static int anyName(String tag, String msg) {
    tag = "hacket123." + tag;
    msg = msg + "-->>" + Thread.currentThread().getName();
    return (int) Origin.call();
}
```

在Activity的onCreate调用Log.d，

```kotlin
Log.d("hacket","onCreate。。。。。。")
```

输出：

> onCreate。。。。。。-->>main

反编译后：在原有的msg后增加了线程信息，原有方法调用替换成`包.aop注解的方法`

```java
public final class MainActivity extends ComponentActivity {
    public static final int $stable = LiveLiterals$MainActivityKt.INSTANCE.m5476Int$classMainActivity();

    /* loaded from: classes4.dex */
    class _lancet {
        private _lancet() {
        }

        @Proxy("d")
        @TargetClass("android.util.Log")
        static int com_example_lancetdemos_lancet_LancetAop_anyName(String str, String str2) {
            SystemClock.elapsedRealtime();
            return Log.d("hacket123." + str, str2 + "-->>" + Thread.currentThread().getName());
        }
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.activity.ComponentActivity, androidx.core.app.ComponentActivity, android.app.Activity
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        _lancet.com_example_lancetdemos_lancet_LancetAop_anyName(LiveLiterals$MainActivityKt.INSTANCE.m5477String$arg0$calld$funonCreate$classMainActivity(), LiveLiterals$MainActivityKt.INSTANCE.m5478String$arg1$calld$funonCreate$classMainActivity());
        androidx.activity.compose.ComponentActivity.setContent$default(this, null, ComposableSingletons$MainActivityKt.INSTANCE.m5473getLambda3$app_debug(), 1, null);
    }
}
```

#### @NameRegex

`@NameRegex` 用来限制范围操作的作用域. 仅用于Proxy模式中, 比如你只想代理掉某一个包名下所有的目标操作. 或者你在代理所有的网络请求时，不想代理掉自己发起的请求. 使用NameRegex对 `@TargetClass` , `@ImplementedInterface` 筛选出的class再进行一次匹配。

### @Insert

#### @Insert介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Insert {
    String value();
    boolean mayCreateSuper() default false;
}
```

- 将新代码插入到目标方法原有代码前后。
- 常用于操作App与library的类，并且可以通过`This`操作目标类的私有属性与方法
- @Insert当目标方法不存在时，还可以使用`mayCreateSuper`参数来创建目标方法。

#### @Insert介绍

示例：注入每一个Activity的onStop生命周期

```java

@TargetClass(value = "android.support.v7.app.AppCompatActivity", scope = Scope.LEAF)
@Insert(value = "onStop", mayCreateSuper = true)
protected void onStop(){
    System.out.println("hello world");
    Origin.callVoid();
}
```

- scope 目标是 AppCompatActivity 的所有最终子类
- 如果一个类 MyActivity extends AppcompatActivity 没有重写 onStop 会自动创建onStop方法，而Origin在这里就代表了super.onStop()，最终注入效果：

```java
protected void onStop() {
    System.out.println("hello world");
    super.onStop();
}
```

- 注入后的方法的修饰符（public/protected/private）会完全照搬注解修饰的Hook方法的修饰符

## [匹配目标类](https://github.com/eleme/lancet/blob/develop/README_zh.md#%E5%8C%B9%E9%85%8D%E7%9B%AE%E6%A0%87%E7%B1%BB)

```java
public @interface TargetClass {
    String value();

    Scope scope() default Scope.SELF;
}

public @interface ImplementedInterface {

    String[] value();

    Scope scope() default Scope.SELF;
}

public enum Scope {
    SELF,
    DIRECT,
    ALL,
    LEAF
}
```

- TargetClass 类
- ImplementedInterface 接口

### @TargetClass 通过类

- value 是一个类的全名
- scope
  - Scope.SELF 代表仅匹配 value 指定的目标类本身
  - Scope.DIRECT 代表匹配 value 指定类的直接子类
  - Scope.All 代表匹配 value 指定类的所有子类
  - Scope.LEAF 代表匹配 value 指定类的最终子类。Java是单继承，所以继承关系是树形结构，所以这里代表了指定类为顶点的继承树的所有叶子节点.

### @ImplementedInterface

- value 可以填写多个接口的全名
- scope
  - Scope.SELF : 代表直接实现所有指定接口的类
  - Scope.DIRECT : 代表直接实现所有指定接口，以及指定接口的子接口的类
  - Scope.ALL: 代表 Scope.DIRECT 指定的所有类及他们的所有子类
  - Scope.LEAF: 代表 Scope.ALL 指定的森林结构中的所有叶节点

![](https://github.com/eleme/lancet/raw/develop/media/14948409810841/scope.png#height=260&id=POTLq&originHeight=290&originWidth=445&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=&width=399)<br />示例：当我们使用@ImplementedInterface(value = "I", scope = ...)时, 目标类如下:

- Scope.SELF -> A
- Scope.DIRECT -> A C
- Scope.ALL -> A B C D
- Scope.LEAF -> B D

### 如何获取类的全名

1. 右键类，Copy→Copy Reference
2. this.getClass() 看日志输出
3. javap命令
   1. 进入app/build/intermediates/javac/debug/classes/com/example/lancetdemos
   2. javap -c MyRunnable
4. 三方库，用jadx-gui，上面会注释内部类的全路径名

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700122598232-c9ff1f6c-1b18-4ade-98cc-fe2ea928e03e.png#averageHue=%23faf9f9&clientId=u0ebc8e0d-e6dc-4&from=paste&height=607&id=uc3e011c8&originHeight=1746&originWidth=1842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=367084&status=done&style=stroke&taskId=ub09076cc-16af-42a9-891b-e164e0dab84&title=&width=640)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700122561044-7cff0b90-241e-41da-82aa-5bb9e83384f4.png#averageHue=%23f6f4f4&clientId=u0ebc8e0d-e6dc-4&from=paste&height=355&id=u41ea84d2&originHeight=1024&originWidth=1896&originalType=binary&ratio=2&rotation=0&showTitle=false&size=262266&status=done&style=stroke&taskId=u4ce39e4b-b80d-498f-ade8-f889c573c7e&title=&width=657)

> 匿名内部类com.appsflyer.internal.AFd1pSDK.4�是不对的，正确的应该是com.appsflyer.internal.AFd1pSDK$4

5. ClassyShark

> java -jar $HACK_HOME/ClassyShark.jar -open

## [匹配目标方法](https://github.com/eleme/lancet/blob/develop/README_zh.md#%E5%8C%B9%E9%85%8D%E7%9B%AE%E6%A0%87%E6%96%B9%E6%B3%95)

虽然在 Proxy , Insert 中我们指定了方法名, 但识别方法必须要更细致的信息. 我们会直接使用 Hook 方法的修饰符，参数类型来匹配方法.<br />所以一定要保持 Hook 方法的 public/protected/private static 信息与目标方法一致，参数类型，返回类型与目标方法一致.<br />返回类型可以用 Object 代替.<br />方法名不限. 异常声明也不限.

### @ClassOf

没有权限声明目标类，用@ClassOf注解来替代对类的直接 import。<br />ClassOf 的 value 一定要按照 `(package_name.)(outer_class_name$)inner_class_name([]...)`的模板。<br />比如:

- java.lang.Object
- java.lang.Integer[][]
- A[]
- A$B

示例：

```java
public class A {
    protected int execute(B b){
        return b.call();
    }

    private class B {

        int call() {
            return 0;
        }
    }
}

@TargetClass("com.dieyidezui.demo.A")
@Insert("execute")
public int hookExecute(@ClassOf("com.dieyidezui.demo.A$B") Object o) {
    System.out.println(o);
    return (int) Origin.call();
}
```

## API

### Origin

Origin 用来调用原目标方法，可以被多次调用。

- Origin.call() 用来调用有返回值的方法
- Origin.callVoid() 用来调用没有返回值的方法

如果你有捕捉异常的需求，可以使用：

- Origin.call/callThrowOne/callThrowTwo/callThrowThree()
- Origin.callVoid/callVoidThrowOne/callVoidThrowTwo/callVoidThrowThree()

### This

仅用于`@Insert`方式的**非静态方法**的Hook中，否则报错<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700116338775-74d24d67-40a4-417e-972f-c614f81a3029.png#averageHue=%23342e2e&clientId=u048354fd-bcde-4&from=paste&height=85&id=u30d96fe3&originHeight=170&originWidth=2186&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39635&status=done&style=stroke&taskId=u2580064a-95d5-4c8e-a3f8-bbc62cd8489&title=&width=1093)

1. get() 返回目标方法被调用的实例化对象
2. putField & getField

你可以直接存取目标类的所有属性，无论是 protected or private.<br />另外，如果这个属性不存在，我们还会自动创建这个属性. Exciting!<br />自动装箱拆箱肯定也支持了.<br />注意：

1. Proxy 不能使用 This
2. 你不能存取你父类的属性. 当你尝试存取父类属性时，我们还是会创建新的属性

```java
package me.ele;
public class Main {
    private int a = 1;

    public void nothing(){

    }

    public int getA(){
        return a;
    }
}

@TargetClass("me.ele.Main")
@Insert("nothing")
public void testThis() {
    Log.e("debug", This.get().getClass().getName());
    This.putField(3, "a");
    Origin.callVoid();
}
```

## 示例

### 匿名内部类

```java
public class StaticClassTest {

    public static class InnerClass {
        public int i;
        public void test() {
            System.out.println("InnerClass test");
        }
    }
}
```

hook：

```java
@Insert("test")
@TargetClass(value = "com.example.lancetdemos.StaticClassTest$InnerClass", scope = Scope.SELF)
public void test() {
    StaticClassTest.InnerClass innerClass = (StaticClassTest.InnerClass) This.get();
    innerClass.i = 100;
    System.out.println("StaticClassTest.InnerClass test aop i=" + innerClass.i);
    Origin.callVoid();
}
```

反编译：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700383808693-64f6b4c9-d64d-4a51-bb61-cb508820f887.png#averageHue=%23fcfbf9&clientId=uf838543a-a635-4&from=paste&height=547&id=u0a070b34&originHeight=1094&originWidth=1922&originalType=binary&ratio=2&rotation=0&showTitle=false&size=194453&status=done&style=stroke&taskId=uece397e4-33ed-48b5-a9af-e8e599af72b&title=&width=961)

### 捕获MyRunnable崩溃

原始代码：

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        Log.w("hacket", "MyRunnable run...");

        try {
            Thread.sleep(3000);
            Log.d("hacket", "MyRunnable run sleep 3 end...");
            int i = 1 / 0;
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

hook：

```java
@TargetClass(value = "com.example.lancetdemos.MyRunnable", scope = Scope.SELF)
@Insert(value = "run", mayCreateSuper = false)
protected void run() {
    Log.d("hacket", "MyRunnable aop run.");
    try {
        Origin.callVoid();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

用jadx-gui反编译看看：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700116894792-eb0c0c4f-b375-4c93-88fa-096349d7b8bf.png#averageHue=%23fafaf9&clientId=u0ebc8e0d-e6dc-4&from=paste&height=904&id=uee6906d6&originHeight=1808&originWidth=2144&originalType=binary&ratio=2&rotation=0&showTitle=false&size=406045&status=done&style=stroke&taskId=u2b8d32b7-0fa4-4117-88b3-73843534084&title=&width=1072)

- 原有的run方法替换成了`_lancet.com_example_lancetdemos_lancet_LancetAop_run(this);`，这里我们进行了try catch

#### 方法内的方法捕获

原代码：

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        Log.w("hacket", "MyRunnable run...");

        try {
            Thread.sleep(3000);
            Log.d("hacket", "MyRunnable run sleep 3 end...");
//            int i = 1 / 0;
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        class InnerRunnable implements Runnable {
            @Override
            public void run() {
                Log.i("hacket", "InnerRunnable run start. class=" + this.getClass());
                String s = null;
                s.toLowerCase();

                Log.d("hacket", "InnerRunnable run end...");
            }
        }

        InnerRunnable innerRunnable = new InnerRunnable();
        innerRunnable.run();
    }
}
```

hook代码：

```java
@TargetClass(value = "com.example.lancetdemos.MyRunnable$1InnerRunnable", scope = Scope.SELF)
@Insert(value = "run", mayCreateSuper = false)
protected void run() {
    Log.d("hacket", "MyRunnable$InnerRunnable aop run add try catch.");
    try {
        Origin.callVoid();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### callThrowOne示例

```java
// 原始
public abstract class InputStream implements Closeable {
	public abstract int read() throws IOException;
}

@TargetClass("java.io.InputStream")
@Proxy("read")
public int read(byte[] bytes) throws IOException {
    try {
        return (int) Origin.<IOException>callThrowOne();
    } catch (IOException e) {
        e.printStackTrace();
        throw e;
    }
}
```

### 修复三方sdk的crash

#### appsflyer 崩溃

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700133594386-9aa0239e-14b9-41ef-9c38-556181644fe0.png#averageHue=%23f3f5f8&clientId=u0ebc8e0d-e6dc-4&from=paste&height=258&id=ufe7f1055&originHeight=922&originWidth=1942&originalType=binary&ratio=2&rotation=0&showTitle=false&size=238882&status=done&style=stroke&taskId=ue43b28a3-1a2f-4dd6-bf98-d7ef24e8170&title=&width=544)<br />hook代码：

```java
@TargetClass(value = "com.appsflyer.internal.AFd1pSDK$4", scope = Scope.SELF)
    @Insert(value = "run", mayCreateSuper = false)
    protected void run1() {
        Log.d("hacket", "com.appsflyer.internal.AFd1pSDK.4 aop run add try catch.");
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

hook前代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700122984881-ab63e945-3150-44f9-8b59-1b2f5b5c41a7.png#averageHue=%23f7f6f2&clientId=u0ebc8e0d-e6dc-4&from=paste&height=479&id=u1045f719&originHeight=1646&originWidth=2084&originalType=binary&ratio=2&rotation=0&showTitle=false&size=484212&status=done&style=stroke&taskId=ua24134e7-e068-4ce1-a600-f48057ec8a5&title=&width=606)<br />hook后代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700125227086-bcebab36-d837-4d0b-ba55-2476dd514adb.png#averageHue=%23f9f8f6&clientId=u0ebc8e0d-e6dc-4&from=paste&height=518&id=u670af842&originHeight=1664&originWidth=1946&originalType=binary&ratio=2&rotation=0&showTitle=false&size=358469&status=done&style=stroke&taskId=ua84d9878-8a2f-4b7b-894f-06d90b9088d&title=&width=606)

### 插桩OkHttp添加Flipper的Interceptor

```java
public class OkHttpHook {

    // hook okhttp，添加一个拦截器

    @Insert("build")
    @TargetClass("okhttp3.OkHttpClient$Builder")
    public OkHttpClient hookBuild() {
        System.out.println("hook okhttp");
        OkHttpClient.Builder builder = (OkHttpClient.Builder) This.get();

        builder.addNetworkInterceptor(FlipperTool.getFlipperOkhttpInterceptor());

        OkHttpClient client = (OkHttpClient) Origin.call();
        return client;
    }
}
```

### 修复案例

```java
public class CrashHook {

    //捕捉ConnectionTracker中unbindService出现异常的情况
    @Insert("unbindService")
    @TargetClass("com.google.android.gms.common.stats.ConnectionTracker")
    public void changeUnbindService(Context var1, ServiceConnection var2) { //getGoogleAnalytics
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    //捕捉RecyclerView动画崩溃问题，
    @TargetClass("androidx.recyclerview.widget.SimpleItemAnimator")
    @Insert("dispatchChangeFinished")
    public void changeUnbindService(RecyclerView.ViewHolder item, boolean oldItem) { //getGoogleAnalytics
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

//    @TargetClass("com.alibaba.android.arouter.launcher._ARouter")
//    @Insert("startActivity") //可能是options出错了，去掉options重试
//    private void startRouterActivity(int requestCode,
//                                     Context currentContext,
//                                     Intent intent,
//                                     Postcard postcard,
//                                     NavigationCallback callback) {
//        if (requestCode >= 0) {  // Need start for result
//            if (currentContext instanceof Activity) {
//                try {
//                    ActivityCompat.startActivityForResult((Activity) currentContext, intent, requestCode, postcard.getOptionsBundle());
//                } catch (Throwable e) {
//                    ActivityCompat.startActivityForResult((Activity) currentContext, intent, requestCode, null);
//                    FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
//                }
//            } else {
//                Log.w(Consts.TAG, "Must use [navigation(activity, ...)] to support [startActivityForResult]");
//            }
//        } else {
//            try {
//                ActivityCompat.startActivity(currentContext, intent, postcard.getOptionsBundle());
//            } catch (Throwable e) {
//                ActivityCompat.startActivity(currentContext, intent, null);
//                FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
//            }
//        }
//        if ((-1 != postcard.getEnterAnim() && -1 != postcard.getExitAnim()) && currentContext instanceof Activity) {    // Old version.
//            try {
//                ((Activity) currentContext).overridePendingTransition(postcard.getEnterAnim(), postcard.getExitAnim());
//            } catch (Throwable e) {
//                e.printStackTrace();
//                FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
//            }
//        }
//        if (null != callback) { // Navigation over.
//            callback.onArrival(postcard);
//        }
//    }


    @TargetClass("okio.RealBufferedSink")
    @Insert("flush") //可能是options出错了，去掉options重试
    public void okioFlush() throws IOException {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            if (e instanceof IOException) {
                throw e;
            } else {
                throw new IOException(e);
            }
        }
    }


    //线上Google play日志，数据库打开有少量报错，firebase日志记录分析原因
//    @Insert("getWritableDatabase")
//    @TargetClass("androidx.sqlite.db.framework.FrameworkSQLiteOpenHelper")
//    public SupportSQLiteDatabase getWritableDatabase() {
//        try {
//            return (SupportSQLiteDatabase) Origin.call();
//        } catch (Throwable e) {
//            try {
//                FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
//            } catch (Throwable ignore) {
//            }
//            throw e;
//        }
//    }

    @TargetClass("com.facebook.animated.giflite.draw.MovieFrame")
    public void renderGifFrame(int w, int h, Bitmap bitmap) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    @Insert("setAlarm")
    @TargetClass("androidx.work.impl.utils.ForceStopRunnable")
    static void setAlarmFix(Context context) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    @Insert("updateScrollEventValues")
    @TargetClass("androidx.viewpager2.widget.ScrollEventAdapter")
    private void fixUpdateScrollEvent() {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    @Insert("closeQuietly")
    @TargetClass("okhttp3.internal.Util")
    public static void fixCloseQuietly(Socket socket) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    /*   @Insert("onActivityCreated")
       @TargetClass("com.google.firebase.messaging.FcmLifecycleCallbacks")
       public void fixFcmOnCreate(Activity var1, Bundle var2) {
           try {
               Origin.callVoid();
           } catch (Exception e) {
               try {
                   FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
               } catch (Exception ignore) {
               }
               e.printStackTrace();
           }
       }*/
    //Fatal Exception: java.util.NoSuchElementException
//    @TargetClass("okhttp3.internal.connection.ConnectInterceptor")
//    public okhttp3.Response fixFindConnection(Interceptor.Chain chain) throws IOException {
//        try {
//            return (okhttp3.Response) Origin.call();
//        } catch (Throwable e) {
//            try {
//                FirebaseCrashlyticsProxy.INSTANCE.recordException(e);
//            } catch (Throwable ignore) {
//            }
//            if (!(e instanceof IOException)) {
//                throw new IOException(e);
//            } else {
//                throw e;
//            }
//        }
//    }

    @Insert("tryIntent")
    @TargetClass("com.facebook.login.NativeAppLoginMethodHandler")
    protected boolean fixTryIntent(Intent intent, int requestCode) {
        try {
            return (Boolean) Origin.call();
        } catch (Throwable e) {
            e.printStackTrace();
            return false;
        }
    }

    @Insert("prefetchPositionWithDeadline")
    @TargetClass("androidx.recyclerview.widget.GapWorker")
    private RecyclerView.ViewHolder fixRecyclerViewDeadline(RecyclerView view, int position, long deadlineNs) {
        try {
            return (RecyclerView.ViewHolder) Origin.call();
        } catch (Throwable e) {
            e.printStackTrace();
            return null; //返回null，reclerView某些情况也会出错崩溃
        }
    }

    //临时修复
    @Insert("dispatchStop")
    @TargetClass("androidx.fragment.app.FragmentController")
    public void fixFragmentDispatchStop() {
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Insert("isForceStopped")
    @TargetClass("androidx.work.impl.utils.ForceStopRunnable")
    public boolean fixForceStopped() {
        try {
            return (Boolean) Origin.call();
        } catch (Throwable e) {
            return false;
        }
    }

    @TargetClass(value = "com.facebook.login.LoginFragment")
    @Insert(value = "onActivityResult")
    public void fixFacebookLoginResult(int requestCode, int resultCode, Intent data) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }


    @TargetClass(value = "com.google.android.material.resources.TypefaceUtils")
    @Insert(value = "maybeCopyWithFontWeightAdjustment")
    public static Typeface fixTypefaceCrash(android.content.res.Configuration configuration, Typeface typeface) {
        try {
            return (Typeface) Origin.call();
        } catch (Throwable e) {
            return null;
        }
    }

//    @TargetClass("com.huawei.hms.push.HmsMessageService")
//    @Insert("handleIntentMessage")
//    private void dispatchMessageHuaWei(Intent intent) {
//        Log.w("aws_push", "aws_push HmsMessageService dispatchMessage1");
//        Origin.callVoid();
//        NotifyReport.dispatchMessageT(intent);
//        Log.w("aws_push", "aws_push HmsMessageService dispatchMessage2");
//    }


    @TargetClass("com.tencent.mmkv.MMKV")
    @Insert("getAll")
    public Map<String, ?> catchMMKVGetAll() {
        try {
            return (Map<String, ?>) Origin.call();
        } catch (Throwable e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    @TargetClass("com.tencent.mmkv.MMKV")
    @Insert("registerOnSharedPreferenceChangeListener")
    public void catchMMKVRegisterOnSharedPreferenceChangeListener(SharedPreferences.OnSharedPreferenceChangeListener listener) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            if (BuildConfig.DEBUG) {
                e.printStackTrace();
            }
        }
    }

    @TargetClass("com.tencent.mmkv.MMKV")
    @Insert("unregisterOnSharedPreferenceChangeListener")
    public void catchMMKVUnregisterOnSharedPreferenceChangeListener(SharedPreferences.OnSharedPreferenceChangeListener listener) {
        try {
            Origin.callVoid();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }


    //启动页res/drawable/abc_vector_test.xml 图片加载失败，导致启动页崩溃
    @Insert("getDrawableIfKnown")
    @TargetClass("androidx.appcompat.widget.TintTypedArray")
    public Drawable fixVectorCrash(int index) {
        try {
            return (Drawable) Origin.call();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //商详页大图模块FragmentStateAdapter onStateChanged导致的崩溃
    @Insert("consumeRestoredStateForKey")
    @TargetClass("androidx.savedstate.SavedStateRegistry")
    public Bundle consumeRestoredStateForKey(String key) {
        if (BuildConfig.DEBUG) {
            return (Bundle) Origin.call();
        } else {
            try {
                return (Bundle) Origin.call();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    //商详/拍照等页面大图片会Crash
    @Insert("draw")
    @TargetClass("com.facebook.drawee.drawable.ForwardingDrawable")
    public void draw(Canvas canvas) {
        boolean check = true;
        try {
            Object o = This.get();
            check = ForwardingDrawableCheckUtils.check(o);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (check) {
            Origin.callVoid();
        }
    }

    //购物车刷新推荐列表 mChildHelper为空导致firebase少量崩溃
    @Insert("removeView")
    @TargetClass("androidx.recyclerview.widget.RecyclerView$LayoutManager")
    public void removeView(View child) {
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 列表滑动回收的时候，抛异常，捕获崩溃
    @Insert("recycleViewHolderInternal")
    @TargetClass("androidx.recyclerview.widget.RecyclerView$Recycler")
    public void recycleViewHolderInternal(RecyclerView.ViewHolder holder) {
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /*
     *
     * fix appsflyer sdk 6.10.3
     */
    @TargetClass(value = "com.appsflyer.internal.AFd1pSDK$4", scope = Scope.SELF)
    @Insert(value = "run")
    public void run() {
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 注意坑

### Module requires ASM6

版本太旧

### 官方的版本太旧没维护了，不支持7.x+高版本的；AGP8.0不支持

需要自己fork维护，特别是AGP8.0后，Transformer API移除了

### 不支持类的构造方法hook

```java
@Proxy("<init>")
@TargetClass("com.example.lancetdemos.MyOkhttpClient")
void OkHttpClient(MyOkhttpClient.Builder builder) {
    builder.i = 10024;
    Origin.callVoid();
}
```

### 利用ByteX的lancet

<https://github.com/Knight-ZXW/LancetX>
