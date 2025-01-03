---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# Java中的异常

Java中有两种异常：已检测异常（Checked exceptions）和未检测异常（Unchecked exceptions）。<br />Checked exceptions必须使用 throws 或 try catch 进行异常处理；Unchecked exceptions不需要指定或捕获。<br />Java对未检测异常默认处理方式是：将堆栈跟踪信息写到 控制台中（或者记录到错误日志文件中）然后退出程序。常见的APP崩溃现象（应用程序XXX已经停止）

# UncaughtExceptionHandler机制

## Java Thread异常处理逻辑 dispatchUncaughtException

线程出现未捕获异常后，JVM将调用Thread中的`dispatchUncaughtException`方法把异常传递给线程的未捕获异常处理器。

```java
// libcore/ojluni/src/main/java/java/lang/Thread.java
public final void dispatchUncaughtException(Throwable e) {
    Thread.UncaughtExceptionHandler initialUeh =
    Thread.getUncaughtExceptionPreHandler();
    if (initialUeh != null) {
        try {
            initialUeh.uncaughtException(this, e);
        } catch (RuntimeException | Error ignored) {
            // Throwables thrown by the initial handler are ignored
        }
    }
    getUncaughtExceptionHandler().uncaughtException(this, e);
}
public UncaughtExceptionHandler getUncaughtExceptionHandler() {
    return uncaughtExceptionHandler != null ?
    uncaughtExceptionHandler : group;
}
```

- 先交给`PreHandler`处理
- 再调用`getUncaughtExceptionHandler`即DefaultHandler来处理
  - 如果PreHandler不为空，就交给PreHandler处理
  - 否则交给group处理

先看看PreHandler和DefaultUncaughtExceptionHandler的定义

```java
class Thread {
    private static volatile UncaughtExceptionHandler uncaughtExceptionPreHandler;
    private static volatile UncaughtExceptionHandler defaultUncaughtExceptionHandler;
    public static void setUncaughtExceptionPreHandler(UncaughtExceptionHandler eh) {
        uncaughtExceptionPreHandler = eh;
    }
    public static UncaughtExceptionHandler getUncaughtExceptionPreHandler() {
        return uncaughtExceptionPreHandler;
    }
    public static void setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler eh) {
         defaultUncaughtExceptionHandler = eh;
	}
    public static UncaughtExceptionHandler getDefaultUncaughtExceptionHandler(){
        return defaultUncaughtExceptionHandler;
    }
}
```

一般情况下，一个应用中所使用的线程都是在同一个线程组，而在这个线程组里只要有一个线程出现未被捕获异常的时候，JAVA 虚拟机就会调用当前线程所在线程组中的 uncaughtException()方法：

```java
public class ThreadGroup implements Thread.UncaughtExceptionHandler {
    public void uncaughtException(Thread t, Throwable e) {
        if (parent != null) {
            parent.uncaughtException(t, e);
        } else {
            // 调用defaultUncaughtExceptionHandler来处理
            Thread.UncaughtExceptionHandler ueh =
                Thread.getDefaultUncaughtExceptionHandler();
            if (ueh != null) {
                ueh.uncaughtException(t, e);
            } else if (!(e instanceof ThreadDeath)) {
                System.err.print("Exception in thread \""
                                 + t.getName() + "\" ");
                e.printStackTrace(System.err);
            }
        }
    }
}
```

- parent不为空，交给parent处理；parent表示当前线程组的父级线程组
- parent为空，通过getDefaultUncaughtExceptionHandler获取到了系统默认的异常处理器，然后调用了uncaughtException方法，在Android中是KillApplicationHandler

## Android中默认的异常处理

1. PreHandler Android在fork进程时，会设置一个默认的处理器，打印crash的线程信息；API的hidden的开发者不能替换掉；Android中默认是LoggingHandler
2. defaultUncaughtExceptionHandler 默认弹出crash框，进程干掉；Android的默认设置的是KillApplicationHandler
3. uncaughtExceptionHandler 开发者自定义的处理器，设置了这个处理器，defaultUncaughtExceptionHandler就不会调用了

Android中提供PreHandler和defaultUncaughtExceptionHandler的默认实现。Android系统中，应用进程由Zygote进程孵化而来，Zygote进程启动时，zygoteInit方法中会调用[RuntimeInit.commonInit](https://cs.android.com/android/platform/superproject/+/android-8.1.0_r35:frameworks/base/core/java/com/android/internal/os/RuntimeInit.java)：

```java
public class RuntimeInit {
   // ...
   protected static final void commonInit() {
        /*
        * set handlers; these apply to all threads in the VM. Apps can replace
        * the default handler, but not the pre handler.
        */
        Thread.setUncaughtExceptionPreHandler(new LoggingHandler());
        Thread.setDefaultUncaughtExceptionHandler(new KillApplicationHandler());
   }
}
```

- 设置了PreHandler为LoggingHandler
- 设置了DefaultUncaughtExceptionHandler为KillApplicationHandler

现在分别看下这2个分别是怎么处理的

#### LoggingHandler

```java
private static class LoggingHandler implements Thread.UncaughtExceptionHandler {
    @Override
    public void uncaughtException(Thread t, Throwable e) {
        // Don't re-enter if KillApplicationHandler has already run
        if (mCrashing) return;
        if (mApplicationObject == null) {
            // The "FATAL EXCEPTION" string is still used on Android even though
            // apps can set a custom UncaughtExceptionHandler that renders uncaught
            // exceptions non-fatal.
            Clog_e(TAG, "*** FATAL EXCEPTION IN SYSTEM PROCESS: " + t.getName(), e);
        } else {
            StringBuilder message = new StringBuilder();
            // The "FATAL EXCEPTION" string is still used on Android even though
            // apps can set a custom UncaughtExceptionHandler that renders uncaught
            // exceptions non-fatal.
            message.append("FATAL EXCEPTION: ").append(t.getName()).append("\n");
            final String processName = ActivityThread.currentProcessName();
            if (processName != null) {
                message.append("Process: ").append(processName).append(", ");
            }
            message.append("PID: ").append(Process.myPid());
            Clog_e(TAG, message.toString(), e);
        }
    }
}
```

LoggingHandler作用：打印异常信息，包括进程名，pid，Java栈信息等。

- 系统进程，日志以`*** FATAL EXCEPTION IN SYSTEM PROCESS:`开头
- 应用进程，日志以`FATAL EXCEPTION:`开头

#### KillApplicationHandler

```java
private static class KillApplicationHandler implements Thread.UncaughtExceptionHandler {
    private final LoggingHandler mLoggingHandler;
    public KillApplicationHandler(LoggingHandler loggingHandler) {
        this.mLoggingHandler = Objects.requireNonNull(loggingHandler);
    }   
     @Override
    public void uncaughtException(Thread t, Throwable e) {
        try {
            ensureLogging(t, e); // 确保LoggingHandler已打印出信息（Android 9.0新增）

            // Don't re-enter -- avoid infinite loops if crash-reporting crashes.
            if (mCrashing) return;
            mCrashing = true;

            // Try to end profiling. If a profiler is running at this point, and we kill the
            // process (below), the in-memory buffer will be lost. So try to stop, which will
            // flush the buffer. (This makes method trace profiling useful to debug crashes.)
            if (ActivityThread.currentActivityThread() != null) {
                ActivityThread.currentActivityThread().stopProfiling();
            }

            // 通知AMS处理异常，弹出闪退的对话框等
            // Bring up crash dialog, wait for it to be dismissed
            ActivityManager.getService().handleApplicationCrash(
                    mApplicationObject, new ApplicationErrorReport.ParcelableCrashInfo(e));
        } catch (Throwable t2) {
            if (t2 instanceof DeadObjectException) {
                // System process is dead; ignore
            } else {
                try {
                    Clog_e(TAG, "Error reporting crash", t2);
                } catch (Throwable t3) {
                    // Even Clog_e() fails!  Oh well.
                }
            }
        } finally {
            // Try everything to make sure this process goes away.
            Process.killProcess(Process.myPid()); // 本质上给自己发送Singal 9，杀死进程
            System.exit(10); // Java中关闭进程的方法，调用其结束Java虚拟机
        }
    }
}
```

- 在KillApplicationHandler uncaughtException回调方法中，会执行一个handleApplicationCrash方法进行异常处理，并且最后都会走到finally中进行进程销毁，Try everything to make sure this process goes away。所以程序就崩溃了

> KillApplicationHandler，检查日志是否已打印，通知AMS，杀死进程。

- 手机上看到的崩溃提示弹窗，就是在这个handleApplicationCrash方法中弹出来的。不仅仅是java崩溃，还有我们平时遇到的native_crash、ANR等异常都会最后走到handleApplicationCrash方法中进行崩溃处理

- Android N及之前版本，只有一个UncaughtHandler类，继承自Thread.UncaughtExceptionHandler

- Android O及之后版本，拆分为2个Handler类，分别是LoggingHandler和KillApplicationHandler，均继承于Thread#UncaughtExceptionHandler

#### Android异常处理器小结

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1695473856872-7601a301-560a-4910-8a9c-1b4cd5be585c.png#averageHue=%23f3efee&clientId=u894e4370-2f8e-4&from=paste&height=394&id=ubea3493b&originHeight=788&originWidth=1666&originalType=binary&ratio=2&rotation=0&showTitle=false&size=220400&status=done&style=none&taskId=u6a80ed19-f60a-48ec-bbfa-538644caa2c&title=&width=833)

## App永不崩溃？

### 子线程崩溃

只设置`Thread.setDefaultUncaughtExceptionHandler`<br />测试代码：

```kotlin
// 在Application中调用
Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
    Log.e(
        "hacket",
        "------>>> uncaughtException: " + throwable.message + "-" + Thread.currentThread().name,
        throwable
    )
}

class ExceptionActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_exception)
        
        btn.setOnClickListener {
            throw RuntimeException("主线程异常")
        }
        btn2.setOnClickListener {
            thread {
                throw RuntimeException("子线程异常")
            }
        }
    }
}
```

- 子线程崩溃，还能继续运行

> 子线程崩溃后，会走到我们自定义的uncaughtException，会覆盖掉默认异常的处理，只是将异常的信息输出，由于捕获了走默认的异常处理逻辑也就不会崩溃
> 子线程崩溃了并不会影响主线程也就是UI线程的操作，所以用户还能正常使用。

- 主线程崩溃，卡住了，再点几下，直接ANR了

> 由于主线程的代码都是在Looper.loop()这个死循环里执行的，点击事件也是一个Message(`View$PerformClick`)，在这个Mesage里抛出了异常，导致loop会退出，Looper就不能继续轮训后续的Message，所以APP就会卡住无法正常操作，时间久了就会ANR；

```java
private static boolean loopOnce(final Looper me,
        final long ident, final int thresholdOverride) {
    Message msg = me.mQueue.next(); // might block
    if (msg == null) {
        // No message indicates that the message queue is quitting.
        return false;
    }
	// ...
    try {
        msg.target.dispatchMessage(msg);
        if (observer != null) {
            observer.messageDispatched(token, msg);
        }
        dispatchEnd = needEndTime ? SystemClock.uptimeMillis() : 0;
    } catch (Exception exception) {
        if (observer != null) {
            observer.dispatchingThrewException(token, msg, exception);
        }
        throw exception; // 抛出了异常
    }
}
```

- 子线程先崩溃，主线程再崩溃，可以继续运行；子线程崩溃后就接管了系统的Looper，后面主线程崩溃就可以捕获到了
- Activity生命周期崩溃（生命周期在主线程中），直接黑屏

### 主线程崩溃

**方案一：**在setDefaultUncaughtExceptionHandler回调用中接管系统的Looper.loop

```kotlin
Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
    Log.w(
        "hacket",
        "------>>> uncaughtException: " + throwable.message + "-" + Thread.currentThread().name,
        throwable
    )
    Handler(Looper.getMainLooper()).post {
        while (true) {
            try {
                Looper.loop()
            } catch (e: Throwable) {
                Log.w(
                    "hacket",
                    "--------->>>>>> looper.loop exception: " + e.message + "-" + Thread.currentThread().name,
                    e
                )
                e.printStackTrace()
            }
        }
    }
}
```

- 点子线程crash，可以继续跑；子线程崩溃不影响主线程的loop
- 直接点主线程crash，直接卡住了，不动了
- 先子线程crash，再点主线程crash，可以正常跑；子线程crash后就跑到了setDefaultUncaughtExceptionHandler，这里会接管系统的loop()，后面主线程崩溃就try catch住了
- Activity生命周期崩溃（先子线程崩溃后，接管Looper后的情况）
  - onCreate/onResume 直接黑屏（捕获异常了，但绘制不出了）
  - onPause/onStop 直接捕获异常

**方案二：**直接在Application#onCreate中接管Looper.loop

```kotlin
Handler(Looper.getMainLooper()).post {
    while (true) {
        try {
            Looper.loop()
        } catch (e: Throwable) {
            Log.w(
                "hacket",
                "--------->>>>>> looper.loop exception: " + e.message + "-" + Thread.currentThread().name,
                e
            )
            e.printStackTrace()
        }
    }
}
```

- <br />

### 拦截 Activity 生命周期的异常

Activity 生命周期（比如 onCreate， onResume等）抛出异常时，如果不 finish掉抛出异常的 Activity 的话会导致黑屏。

#### Activity生命周期崩溃测试代码

测试代码：

```kotlin
// 在Application.onCreate
new Handler(Looper.getMainLooper()).post(new Runnable() {
    @Override
    public void run() {
        while (true) {
            try {
                Looper.loop();
            } catch (Throwable e) {
                Log.w(
                        "hacket",
                        "--------->>>>>> looper.loop exception: " + e.getMessage() + "-" + Thread.currentThread().getName(),
                        e
                );
                e.printStackTrace();
            }
        }
    }
});
Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
    Log.w(
        "hacket",
        "------>>> uncaughtException: " + throwable.message + "-" + Thread.currentThread().name,
        throwable
    )
}
// Activity.onCreate测试
class Test2Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_exception)

        throw RuntimeException("主线程异常")
    }
}
```

- 如果是在onCreate/onResume等生命周期出现崩溃，会出现黑屏
- 如果是在onStop出现的崩溃，不会出现崩溃，还能正常用

如果在Activity生命周期内抛出异常，会导致界面绘制无法完成，Activity无法被正确启动，就会白屏或者黑屏了<br />这种严重影响到用户体验的情况还是建议直接杀死APP，因为很有可能会对其他的功能模块造成影响。或者如果某些Activity不是很重要，也可以只finish这个Activity。

#### 解决Activity onCreate崩溃黑屏问题

由于Activity的生命周期都是通过主线程的Handler（`mH`）进行消息处理，所以我们可以通过反射替换掉主线程的Handler中的Callback回调，也就是`ActivityThread.mH.mCallback`，然后针对每个生命周期对应的消息进行try catch捕获异常，然后就可以进行finishActivity或者杀死进程操作了。<br />先来看看mH的源码，Android9.0前后代码不一样

#### mH源码

Activity的生命周期，都是通过mH的handleMessage来处理的：

- Android9.0之前是通过多个message.what来实现的；
- Android9.0及以上通过ClientTransaction来实现的

##### Android9.0以下

Activity不同的生命周期对应不同的message.what

- [x] [android-8.0.0_r10](https://cs.android.com/android/platform/superproject/+/android-8.0.0_r10:frameworks/base/core/java/android/app/ActivityThread.java)

```java
public final class ActivityThread {
    final H mH = new H();
    private class H extends Handler {
        public static final int LAUNCH_ACTIVITY         = 100;
        public static final int PAUSE_ACTIVITY          = 101;
        public static final int PAUSE_ACTIVITY_FINISHING= 102;
        public static final int STOP_ACTIVITY_SHOW      = 103;
        public static final int STOP_ACTIVITY_HIDE      = 104;
        public static final int RESUME_ACTIVITY         = 107;
        public void handleMessage(Message msg) {
            case LAUNCH_ACTIVITY:
                final ActivityClientRecord r = (ActivityClientRecord) msg.obj;
                r.packageInfo = getPackageInfoNoCheck(r.activityInfo.applicationInfo, r.compatInfo);
                handleLaunchActivity(r, null, "LAUNCH_ACTIVITY");
                break;
            case RELAUNCH_ACTIVITY:
                ActivityClientRecord r = (ActivityClientRecord)msg.obj;
                handleRelaunchActivity(r);
            	break;
            case RESUME_ACTIVITY:
                Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "activityResume");
                SomeArgs args = (SomeArgs) msg.obj;
                handleResumeActivity((IBinder) args.arg1, true, args.argi1 != 0, true,
                        args.argi3, "RESUME_ACTIVITY");
                Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
                break;
            case PAUSE_ACTIVITY: 
                SomeArgs args = (SomeArgs) msg.obj;
                handlePauseActivity((IBinder) args.arg1, false,
                    (args.argi1 & USER_LEAVING) != 0, args.argi2,
                    (args.argi1 & DONT_REPORT) != 0, args.argi3);
                maybeSnapshot();
            	break;
            case PAUSE_ACTIVITY_FINISHING:
                SomeArgs args = (SomeArgs) msg.obj;
                handlePauseActivity((IBinder) args.arg1, true, (args.argi1 & USER_LEAVING) != 0,
                    args.argi2, (args.argi1 & DONT_REPORT) != 0, args.argi3);
            	break;
            case STOP_ACTIVITY_SHOW: 
                SomeArgs args = (SomeArgs) msg.obj;
                handleStopActivity((IBinder) args.arg1, true, args.argi2, args.argi3);
            	break;
            case STOP_ACTIVITY_HIDE:
                SomeArgs args = (SomeArgs) msg.obj;
                handleStopActivity((IBinder) args.arg1, false, args.argi2, args.argi3);
            	break;
            // ...
        }
    }
}
```

##### Android9.0及以上

Android9.0及以上都在一个message.what中了

- [x] [android-9.0.0_r60](https://cs.android.com/android/platform/superproject/+/android-9.0.0_r60:frameworks/base/core/java/android/app/ActivityThread.java)

```java
public final class ActivityThread extends ClientTransactionHandler {
	final H mH = new H();

     class H extends Handler {
         public static final int BIND_APPLICATION = 110;
         public static final int EXECUTE_TRANSACTION = 159;
         public void handleMessage(Message msg) {
             case BIND_APPLICATION:
                    Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "bindApplication");
                    AppBindData data = (AppBindData)msg.obj;
                    handleBindApplication(data);
                    Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
                    break;
             // ...
             case EXECUTE_TRANSACTION:
                    final ClientTransaction transaction = (ClientTransaction) msg.obj;
                    mTransactionExecutor.execute(transaction);
                    if (isSystem()) {
                        // Client transactions inside system process are recycled on the client side
                        // instead of ClientLifecycleManager to avoid being cleared before this
                        // message is handled.
                        transaction.recycle();
                    }
                    // TODO(lifecycler): Recycle locally scheduled transactions.
                    break;
         }
     }
}
```

#### hook mH注入Handler.Callback finish activity

替换主线程Handler的Callback，对Activity的生命周期的异常捕获，捕获后然后调用finishActivity，finishActivity在不同版本不一样

#### 反射 finish activity

API31的Activity的finish流程：

```java
private IBinder mToken;
final void attach(IBinder token) {
    mToken = token;
}
private void finish(int finishTask) {
    if (mParent == null) {
        int resultCode;
        Intent resultData;
        synchronized (this) {
            resultCode = mResultCode;
            resultData = mResultData;
        }
        // ...
        if (ActivityClient.getInstance().finishActivity(mToken, resultCode, resultData,
                finishTask)) {
            mFinished = true;
        }
    } else {
        mParent.finishFromChild(this);
    }
	// ...
}
```

从Activity的finish源码可以得知，最终是调用到ActivityTaskManagerService的finishActivity方法，这个方法有四个参数，其中有个用来标识Activity的参数也就是最重要的参数：token<br />不同系统版本的token获取不一样，需要兼容处理<br />Android9.0及以上的token获取：

```java
class H extends Handler {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case EXECUTE_TRANSACTION: 
                final ClientTransaction transaction = (ClientTransaction) msg.obj;
                mTransactionExecutor.execute(transaction);
                break;              
        }        
    }
}

public void execute(ClientTransaction transaction) {
    final IBinder token = transaction.getActivityToken();
    executeCallbacks(transaction);
    executeLifecycleState(transaction);
    mPendingActions.clear();
    log("End resolving transaction");
}    

```

我们就可以利用反射ClientTransaction中来获取token：

```java
private void finishMyCatchActivity(Message message) throws Throwable {
    ClientTransaction clientTransaction = (ClientTransaction) message.obj;
    IBinder binder = clientTransaction.getActivityToken();
    
    Method getServiceMethod = ActivityManager.class.getDeclaredMethod("getService");
    Object activityManager = getServiceMethod.invoke(null);
    
    Method finishActivityMethod = activityManager.getClass().getDeclaredMethod("finishActivity", IBinder.class, int.class, Intent.class, int.class);
    finishActivityMethod.setAccessible(true);
    finishActivityMethod.invoke(activityManager, binder, Activity.RESULT_CANCELED, null, 0);
}

```

### 如何打造永不崩溃App?

1. 主线程所发生的所有异常，追踪其源头都是Looper.loop方法，接管该方法，即可将主线程出现的任何异常都正确捕获处理了

> 通过在主线程里面发送一个消息，捕获主线程的异常，并在异常发生后继续调用Looper.loop方法，使得主线程继续处理消息。

2. 对于子线程的异常，可以通过Thread.setDefaultUncaughtExceptionHandler来拦截，并且子线程的停止不会给用户带来感知。
3. 对于在生命周期内发生的异常，可以通过替换ActivityThread.mH.mCallback的方法来捕获，并且通过token来结束Activity或者直接杀死进程。但是这种办法要适配不同SDK版本的源码才行，所以慎用
4. 远程配置需要捕获不崩溃的异常

- [x] 参考：[Android稳定性：可远程配置化的Looper兜底框架](https://zhuanlan.zhihu.com/p/615280921)

### 应用场景

- 异常我们无法解决或者解决成本太高
  - 使用 react native 之类的三方框架，我们解决不了
  - 不同厂商的手机带来的一些bug
- 异常被屏蔽对用户、业务来说并没有实质性影响
  - Android 7.x toast的 BadTokenException 之类的系统崩溃
  - 一些不影响业务、用户使用的三方库崩溃
- 异常很严重，但是吃掉之后通过修复运行环境能够让用户所使用的业务恢复正常运行
  - 磁盘满了， 抛出了一个no space left，这时候我们就可以将异常吃掉，同时清空app的磁盘缓存，并且告知用户重试，就可以成功的让用户保存图片成功

## Ref

- [ ] [能否让APP永不崩溃—小光与我的对决](https://www.cnblogs.com/jimuzz/p/14113556.html)
- [ ] [有赞 Android 崩溃保护的探索与实践](https://www.infoq.cn/article/f6irpfwgcdc0rt54cx5z)
