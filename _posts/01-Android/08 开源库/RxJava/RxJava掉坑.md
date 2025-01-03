---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# RxJava注意

## Observable.just()、fromIterable()的局限性

### 代码执行过早

使用Observable.just() 即使你没有调用subscribe方法。just()括号里面的代码也已经执行了。显然，Observable.just()不适合封装网络数据，因为我们通常不想在subscribe之前做网络请求。<br />同理，`fromIterable`也和`just`有同样的缺点。当然，这个可以简单的用defer()/fromCallable()/create()操作符来是实现只有subscribe只有才加载。

### Observable.just()不够灵活

设计模式上我们追求 "Minimize Mutability" 但是如果我们的程序越来越 reactive的时候。一个 ObservableJust 往往是不满足需求的。比如之前一定订阅的subscriber。如果数据更新了，你不可以同过ObservableJust 来通知所有的Observable 新数据更新了，需要你的subscriber主动更新。这显然有悖于我们追求的reactive programming。 主动pull数据而不是数据告诉你，我更新了然后再做出反应。<br />当然ObservableJust在很多情况下，确实不错。如果你不需要监听后续的更新，那么ObservableJust可以满足你的需求。

## RxJava2通用的Observer，需要在onNext捕获异常

防止使用框架的人崩溃

```java
public abstract class BaseNetObserver<T> implements Observer<T> {

    private static final int OTHER_EXCEPTION_CODE = -1;

    @Override
    public void onSubscribe(Disposable d) {
    }

    @Override
    public final void onNext(T t) {
        if (t != null) {
            try {
                onSuccess(t); 
            } catch (@NonNull Exception e) {
                onError(new RuntimeException(e));
            }
        } else {
            onError(new RuntimeException("返回的数据为null"));
        }
    }

    @Override
    public void onError(Throwable e) {
        if (e instanceof ApiException) {
            onFailed((ApiException) e);
        } else {
            onFailed(new ApiException(e, OTHER_EXCEPTION_CODE));
        }
    }

    @Override
    public void onComplete() {

    }

    protected abstract void onSuccess(@NonNull T t);

    /**
     * 错误回调
     */
    protected abstract void onFailed(ApiException ex);

}
```

## RxJava2 SchedulerPoolFactory周期清除

前一阵在用Android Studio的内存分析工具检测App时，发现每隔一秒，都会新分配出20多个实例，跟踪了一下发现是RxJava2中的SchedulerPoolFactory创建的。<br />![](http://note.youdao.com/yws/res/15625/564690784E1E4F8BB561D7C100663704#clientId=uf16e3a9d-ee8a-4&id=WpXo5&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udd7e9767-ba1b-456c-8205-f621bb6c0b8&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687542312883-5b5bc349-cd30-4eaf-b06b-6a46b9a6aed6.png#averageHue=%23384247&clientId=u96c4f48e-5c02-4&from=paste&height=436&id=u03aa5f17&originHeight=654&originWidth=1321&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=362965&status=done&style=none&taskId=u3fc5b456-77b9-4c4b-8730-3ce9092a48f&title=&width=880.6666666666666)<br />一般来说如果一个页面创建加载好后是不会再有新的内存分配，除非页面有动画、轮播图、EditText的光标闪动等页面变化。当然了在应用退到后台时，或者页面不可见时，我们会停止这些任务。保证不做这些无用的操作。然而我在后台时，这个线程池还在不断运行着，也就是说CPU在周期性负载，自然也会耗电。那么就要想办法优化一下了。<br />SchedulerPoolFactory 的作用是管理 ScheduledExecutorServices的创建并清除。<br />SchedulerPoolFactory 部分源码如下：

```java
static void tryStart(boolean purgeEnabled) {
    if (purgeEnabled) {
        for (;;) { // 一个死循环
            ScheduledExecutorService curr = PURGE_THREAD.get();
            if (curr != null) {
                return;
            }
            ScheduledExecutorService next = Executors.newScheduledThreadPool(1, new RxThreadFactory("RxSchedulerPurge"));
            if (PURGE_THREAD.compareAndSet(curr, next)) {
	    		// RxSchedulerPurge线程池，每隔1s清除一次
                next.scheduleAtFixedRate(new ScheduledTask(), PURGE_PERIOD_SECONDS, PURGE_PERIOD_SECONDS, TimeUnit.SECONDS);
                return;
            } else {
                next.shutdownNow();
            }
        }
    }
}

static final class ScheduledTask implements Runnable {
    @Override
    public void run() {
        for (ScheduledThreadPoolExecutor e : new ArrayList<ScheduledThreadPoolExecutor>(POOLS.keySet())) {
            if (e.isShutdown()) {
                POOLS.remove(e); 
            } else {
                e.purge();//图中154行，purge方法可用于移除那些已被取消的Future。
            }
        }
    }
}
```

我查了相关问题，在stackoverflow找到了此问题[RxSchedulerPurge always take periodic cpu load even in the background on Android<br />](https://stackoverflow.com/questions/44717193/rxschedulerpurge-always-take-periodic-cpu-load-even-in-the-background-on-android)，同时也给RxJava提了Issue，得到了回复是可以使用：

```java
// 修改周期时间为一小时
System.setProperty("rx2.purge-period-seconds", "3600");
```

当然你也可以关闭周期清除：

```java
System.setProperty("rx2.purge-enabled", "false");
```

作用范围如下：

```java
static final class PurgeProperties {
    boolean purgeEnable;
    int purgePeriod;
    void load(Properties properties) {
        if (properties.containsKey(PURGE_ENABLED_KEY)) {
            purgeEnable = Boolean.parseBoolean(properties.getProperty(PURGE_ENABLED_KEY));
        } else {
            purgeEnable = true; // 默认是true
        }
        if (purgeEnable && properties.containsKey(PURGE_PERIOD_SECONDS_KEY)) {
            try {
                // 可以修改周期时间
                purgePeriod = Integer.parseInt(properties.getProperty(PURGE_PERIOD_SECONDS_KEY));
            } catch (NumberFormatException ex) {
                purgePeriod = 1; // 默认是1s
            }
        } else {
            purgePeriod = 1; // 默认是1s
        }
    }
}
```

**1s的清除周期我觉得有点太频繁了，最终我决定将周期时长改为60s。最好在首次使用RxJava前修改，放到Application中最好。**
