---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# AspectJ基础

## AOP？

AOP（Aspect-Oriented Programming）是一种面向切面的编程范式，是一种编程思想，旨在通过分离横切关注点，提高模块化，可以跨越对象关注点。<br />AOP的典型应用是Spring的事务机制，日志记录。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。主要功能是：日志记录，性能统计，安全控制，事务处理，异常处理等等；主要的意图是：将日志记录，性能统计，安全控制，事务处理，异常处理等代码从业务逻辑代码中划分出来，通过对这些行为的分离，我们希望可以将它们独立到非指导业务逻辑的方法中，进而改变这些行为的时候不影响业务逻辑的代码。<br />AspectJ和Spring AOP 是AOP的两种实现方案。

## 什么是AspectJ？

AspectJ 作为 Java 中流行的 AOP（aspect-oriented programming） 编程扩展框架。

- AspectJ是一种AOP框架
- 内部使用的是 BCEL框架 来完成其功能
- 调用时机是在 Java 文件编译成 .class 文件之后，生成 Dalvik 字节码之前执行
- AspectJ是一种编译期的用注解形式实现的AOP

APT、AspectJ和Javassist工作时机：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501011949723.png)

## Android中使用AspectJ

## AspectJ中由哪些组件组成？

- PointCut 切点，是一个（组）基于正则表达式的表达式；本身是一个表达式，是基于正则语法的。通常一个PointCut会选取程序中的某些我们感兴趣的执行点
- joinPoint 连接点，通过PointCut选取出来的集合中的具体的一个执行点，我们就叫JoinPoint
- Advice 通知，在选取出来的JoinPoint上要执行的操作、逻辑：Before、After、AfterReturning、AfterThrowing、Around
- aspect 切面，是一个抽象的概念，指应用程序不同模块的某一个领域或方面，由PointCut和Advice组成
- Target，被AspectJ横切的对象，我们所说的JoinPoint就是Target的某一行，如方法开始执行的地方，方法类调用某个其他方法的代码

## 引入AspectJ

### AGP低版本引入

- [ ] [hujiang的gradle_plugin_android_aspectjx](https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx)

1. 在项目根目录的build.gradle里依赖AspectJX

```groovy
dependencies {
	classpath 'com.hujiang.aspectjx:gradle-android-plugin-aspectjx:2.0.10'
}
```

或者使用product目录下的jar包，在你的项目根目录下新建目录plugins，把product/gradle-android-plugin-aspectjx-2.0.10.jar拷贝到plugins，依赖jar包

```groovy
dependencies {
	classpath fileTree(dir:'plugins', include:['*.jar'])
}
```

2. 添加插件

```groovy
apply plugin: 'android-aspectjx'
// 或
apply plugin: 'com.hujiang.android-aspectjx'
```

3. 添加依赖

```groovy
implementation 'org.aspectj:aspectjrt:1.9.7'
```

4. 添加不扫描的包 跟Android同级

```groovy
aspectjx {
    // 排除一些第三方库的包名（Gson、 LeakCanary 和 AOP 有冲突）
    // 否则就会起冲突：ClassNotFoundException: Didn't find class on path: DexPathList
    exclude 'androidx', 'com.google', 'com.squareup', 'com.alipay', 'com.taobao',
            'org.apache',
            'org.jetbrains.kotlin',
            "module-info", 'versions.9'
}

```

- [ ] [低版本的AspectyJ引入：性能优化，还得看AspectJ](https://mp.weixin.qq.com/s/heBoKE2UqMgp4_zm_fciuA)

### AGP高版本

```groovy
classpath 'io.github.wurensen:gradle-android-plugin-aspectjx:3.3.2'

// app build.gradle 
apply plugin: 'io.github.wurensen.android-aspectjx'
```

### 集成遇到的问题

#### 高版本AGP报错No such property: FD_INTERMEDIATES

> Failed to apply plugin 'android-aspectjx'.
> No such property: FD_INTERMEDIATES for class: com.android.builder.model.AndroidProject`

解决：<br /><https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx/issues/332><br />修改支持高版本AGP的aspectj插件<https://github.com/wurensen/gradle_plugin_android_aspectjx>

```groovy
classpath 'io.github.wurensen:gradle-android-plugin-aspectjx:3.3.2'

// app build.gradle 
apply plugin: 'io.github.wurensen.android-aspectjx'
```

#### 各种报错，需要exclude

如：

> Caused by: org.aspectj.weaver.BCException: Whilst processing type 'Lcom/appsflyer/internal/AFa1wSDK$4;' - cannot cast the outer type to a reference type.  Signature=Lcom/appsflyer/internal/AFa1wSDK; toString()=com.appsflyer.internal.AFa1wSDK class=AFa1wSDK

解决：

```groovy
apply plugin: 'io.github.wurensen.android-aspectjx'
aspectjx {
    // 移除kotlin相关，编译错误和提升速度
    exclude 'kotlin.jvm', 'kotlin.internal', 'kotlin'
    exclude 'kotlinx.coroutines.internal', 'kotlinx.coroutines.android'
    // 排除所有package路径中包含`android.support`的class文件及库（jar文件）
    exclude 'android.support'
    exclude 'com.appsflyer'
    // Caused by: org.aspectj.weaver.BCException: Whilst processing type 'Lcom/appsflyer/internal/AFa1wSDK$4;' - cannot cast the outer type to a reference type.  Signature=Lcom/appsflyer/internal/AFa1wSDK; toString()=com.appsflyer.internal.AFa1wSDK class=AFa1wSDK
    exclude 'com.google'
    // Caused by: java.lang.IllegalStateException: Expecting .,<, or ;, but found - while unpacking <T::Lcom/google/android/gms/internal/firebase-auth-api/zzabd<*>;>Ljava/lang/Object;
    exclude 'leakcanary'
    exclude 'com.hujiang'
    exclude 'com.google.android.material', 'androidx.appcompat', 'androidx.fragment', 'androidx.emoji2', 'androidx.viewpager', 'androidx.paging'
}
```

## AspectJ API

### 注解

#### @Before

在方法执行之前要插入的代码。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Before {
    String value();
    String argNames() default "";
}
```

#### @After

在方法执行之后要插入的代码。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface After {
    String value();
    String argNames() default "";
}
```

#### @AfterReturning

在方法执行后，返回一个结果再执行；如果没有结果，用此修饰符修饰是不会执行的<br />注意的是方法参数必须和注解中的值一致。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AfterReturning {
    String value() default "";
    String pointcut() default "";
    String returning() default "";
    String argNames() default "";

}
```

#### @AfterThrowing

在方法执行过程中抛出异常后执行：也就是方法执行过程中，如果抛出异常后，才会执行此切面方法。

```kotlin
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AfterThrowing {
    String value() default "";
    String pointcut() default "";
    String throwing() default "";
    String argNames() default "";
}
```

参数和注解里的值必须一致。这里崩溃同样会发生，不会因为切面操作而直接catch住，只是在抛出异常之前会打印出异常信息而已

#### @Around

在方法执行前后和抛出异常时执行。

```kotlin
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Around {
    String value();
    String argNames() default "";
}
```

#### 示例

- AOP代码

```kotlin
@Aspect
class DemoAspect {
    @After("execution(* $ASPECTJ_HELPER_CLASS.test*(..))")
//    @Before("execution(* $ASPECTJ_HELPER_CLASS.test*(..))")
    fun testAspectBefore(point: JoinPoint) {
        Log.d(
            TAG,
            "--->>> ${point.signature.name}-before \n signature=${point.signature}, point=$point,\n shortStr=${point.toShortString()}"
        )
    }

    @AfterReturning(
        value = "execution(* $ASPECTJ_HELPER_CLASS.afterReturning*(..))",
        returning = "num1"
    )
    // 方法参数必须和注解中的值一致
    fun testAspectAfterReturning(num1: Int, point: JoinPoint) {
        Log.i(TAG, "--->>> afterReturning-num:$num1 $point")
    }


    @AfterThrowing(
        value = "execution(* $ASPECTJ_HELPER_CLASS.afterThrowing*(..))",
        throwing = "exception"
    )
    fun testAspectAfterThrowing(exception: Exception) {
        exception.printStackTrace()
        Log.w(TAG, "--->>> afterThrowing-exception:" + exception.message)
    }

    @Around("execution(* $ASPECTJ_HELPER_CLASS.aroundTest(..))")
    @Throws(
        Throwable::class
    )
    fun testAspectAround(point: ProceedingJoinPoint) {
        Log.e(TAG, "--->>> ${point.signature.name}-before ")
        point.proceed()
        Log.e(TAG, "--->>> ${point.signature.name}-after ")
    }

    companion object {
        const val TAG = "DemoAspect"
        private const val ASPECTJ_HELPER_CLASS =
            "me.hacket.assistant.samples.进阶.aop.aspectj.AspectJHelper"
    }
}
```

- 测试代码

```java
public class AspectJHelper {

    public String testAspectJMethod() {
        Log.e("DemoAspect", "testAspectJMethod-invoke");
        return "hacket";
    }

    public int afterReturningTest() {
        Log.e(DemoAspect.TAG, "AfterReturning-invoke");
        return 10;
    }


    public void afterThrowingTest() {
        View v = null;
        v.setVisibility(View.VISIBLE);
    }

    public void aroundTest() {
        Log.e(DemoAspect.TAG, "AroundTest-invoke");
        int x = 0;
        int y = 1 / x;
    }
}
```

## @Pointcut

`@Before("execution(* me.hacket.assistant.samples.进阶.aop.aspectj.AspectJHelper.test*(..))")`<br />我们分成几个部分依次来看：

- **@Before**：Advice，具体的插入点
- **execution**：处理Join Point的类型，例如call、execution、withincode
  - call、execution类似，都是插入代码的意思；区别就是execution是在被切入的方法中，call是在调用被切入的方法前或者后。

> // 对于call来说：
> call（Before）
> Pointcut {
> Pointcut Method
> }
> call（After）
> // 对于execution来说：
> Pointcut {
> execution（Before）
> Pointcut Method
> execution（After）
> }

- **withcode** 通常来进行一些切入点条件的过滤，作更加精确的切入控制

### withcode

假如我们想要切test方法，但是只希望在test2中调用test才执行切面方法，就需要用到withincode。

```java
public class AspectJHelper {
    public void callTest1_2() {
        test1Hacket();
        test2Hacket();
    }

    public void testHacket() {
        Log.e(DemoAspect.TAG, "testHacket");
    }

    public void test1Hacket() {
        testHacket();
    }

    public void test2Hacket() {
        testHacket();
    }
} 
callTest1_2();
```

- AOP代码

```kotlin
// 在test()方法内
@Pointcut(value = "withincode(* $ASPECTJ_HELPER_CLASS.test2Hacket(..))")
fun invoke2() {
    Log.e(TAG, "-->> invoke2()")
}

// 调用test()方法的时候
@Pointcut(value = "call(* $ASPECTJ_HELPER_CLASS.testHacket(..))")
operator fun invoke() {
    Log.e(TAG, "-->> invoke()")
}

// 同时满足前面的条件，即在test2()方法内调用test()方法的时候才切入
@Pointcut("invoke() && invoke2()")
fun invokeOnlyIn2() {
    Log.w(TAG, "-->> invoke() && invoke2()")
}

@Before("invokeOnlyIn2()")
fun beforeInvokeOnlyIn2(joinPoint: JoinPoint) {
    val key = joinPoint.signature.toString()
    Log.d(TAG, "beforeInvokeOnlyIn2: $key")
}
```

输出：

> testHacket
> beforeInvokeOnlyIn2: void me.hacket.assistant.samples.进阶.aop.aspectj.AspectJHelper.testHacket()
> testHacket

### MethodPattern

这个是最重要的表达式，大致为:@注解和访问权限，返回值的类型和包名.函数名(参数)<br />如：`@After("execution(* me.hacket.assistant.samples.进阶.aop.aspectj.AspectJHelper.test*(..))")`

- @注解和访问权限

public/private/protect，以及static/final：属于可选项。如果不设置它们，则默认都会选择。以访问权限为例，如果没有设置访问权限作为条件，那么public，private，protect及static、final的函数都会进行搜索。

- 返回值类型

就是普通的函数的返回值类型。如果不限定类型的话，就用*通配符表示。

- 包名.函数名

用于查找匹配的函数。可以使用通配符，包括和`…`以及`+`号。其中号用于匹配除`.`号之外的任意字符，而`…`则表示任意子package，`+`号表示子类<br />`* com.hujiang.library.demo.DemoActivity.test*(...)`

### 切入点

#### 匹配通配符含义

- `*`：匹配任何数量字符
- `..`：匹配任何数量字符的重复，如在类型模式中匹配任何数量子包；而在方法参数模式中匹配任何数量参数
- `+`：匹配指定类型的子类型；仅能作为后缀放在类型模式后边

案例：

- `public * *(..)` ：任何公共方法。
- `* com..*.*(..)`：com包以及所有子包下所有类的任何方法。
- `* com..Manager.*(..)`：com包以及所有子包下的Manager类的任何方法。
- `* com.alan..*Manager.find*(..)`：com.alan包以及所有子包下的以Manager结尾的类的以find开头的任何方法。

# AspectJ应用

### 统计 Application 中所有方法的耗时

```java
@Aspect
public class ApplicationAop {

    @Around("call (* com.json.chao.application.BaseApplication.**(..))")
    public void getTime(ProceedingJoinPoint joinPoint) {
    Signature signature = joinPoint.getSignature();
    String name = signature.toShortString();
    long time = System.currentTimeMillis();
    try {
        joinPoint.proceed();
    } catch (Throwable throwable) {
        throwable.printStackTrace();
    }
    Log.i(TAG, name + " cost" +     (System.currentTimeMillis() - time));
    }
}
```

1. 当 Action 为 Before、After 时，方法入参为 JoinPoint。当 Action 为 Around 时，方法入参为 ProceedingPoint。
2. 而 Around 和 Before、After 的最大区别就是 ProceedingPoint 不同于 JoinPoint，其提供了 proceed 方法执行目标方法。

### 对 App 中所有的方法进行 Systrace 函数插桩

```java
@Aspect
public class SystraceTraceAspectj {

    private static final String TAG = "SystraceTraceAspectj";

    @Before("execution(* **(..))")
    public void before(JoinPoint joinPoint) {
        TraceCompat.beginSection(joinPoint.getSignature().toString());
    }

    @After("execution(* **(..))")
    public void after() {
        TraceCompat.endSection();
    }
}
```

## 遇到的问题

### app:externalNativeBuildCleanDebug clean循环引用

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501011949724.png)<br />解决：删除这段代码，具体原因未知

```
cmake {
    path "src/main/cpp/CMakeLists.txt"
    version "3.10.2"
}
```

### Cannot cast object TransformTask$2$1

```
Cannot cast object 'com.android.build.gradle.internal.pipeline.TransformTask$2$1@4436acbe' with class 'com.android.build.gradle.internal.pipeline.TransformTask$2$1' to class 'com.android.build.gradle.internal.pipeline.TransformTask'
```

解决：<br />在root project的build.gralde里面加入，升级到2.0.10版本

```groovy
classpath 'com.hujiang.aspectjx:gradle-android-plugin-aspectjx:2.0.10'
```

在app的build.gradle里面加入

```groovy
apply plugin: 'android-aspectjx'
api 'org.aspectj:aspectjrt:1.9.5'
aspectjx {
    enabled true
    exclude 'com.google','com.taobao'
}
```

参考：[as 4.0 编译失败](https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx/issues/264)

### java.util.zip.ZipException: zip file is empty

exclude对应冲突的包

```groovy
aspectjx {
    // 关闭AspectJX功能
    enabled true
    // 排除所有package路径中包含`android.support`的class文件及库（jar文件）
//    exclude 'android.support', 'androidx', 'com.google', 'com.appsflyer', 'com.android'
    exclude 'versions.9'
//    exclude 'com.squareup'
//    exclude 'leakcanary'
//    exclude 'com.taobao'
//    exclude 'com.ut'
}
```

### 升级到 2.0.1 后报错，java.lang.ClassNotFoundException

applying to join point that doesn't return void: method-call(java.lang.String me.hacket.assistant.base.app.BaseApplication.getCurrentProcessName(android.content.Context))<br /><https://github.com/HujiangTechnology/gradle_plugin_android_aspectjx/issues/82>
