---
date created: 2024-12-24 00:37
date updated: 2024-12-25 00:16
dg-publish: true
---

# Cold Observable 和 Hot Observable

**Hot Observable** 无论有没有 Subscriber 订阅，事件始终都会发生。当 Hot Observable 有多个订阅者时，Hot Observable 与订阅者们的关系是一对多的关系，可以与多个订阅者共享信息。<br>**Cold Observable** 只有 Subscriber 订阅时，才开始执行发射数据流的代码。并且 Cold Observable 和 Subscriber 只能是一对一的关系，当有多个不同的订阅者时，消息是重新完整发送的。也就是说对 Cold Observable 而言，有多个Subscriber的时候，他们各自的事件是独立的。<br>形象解释：

> Think of a hot Observable as a radio station. All of the listeners that are listening to it at this moment listen to the same song.
> A cold Observable is a music CD. Many people can buy it and listen to it independently.
> by Nickolay Tsvetinov
> 想象hot Observable是一个无线电台，所有的听众在同一时刻听到的是同一首歌。
> 而cold Observable是一个音乐光碟，人们可以独立地购买它然后收听。

## Cold Observable

只有观察者订阅了，才开始执行发射数据流的代码。Cold Observable和Observer只能是一对一的关系。当有多个不同的订阅者时，消息是重新完整发送的。对于Cold Observable，有多个Observer时，它们各自的事件是独立的。<br>Observable 的 just、creat、range、fromXXX 等操作符都能生成Cold Observable。<br>有多个subscriber时，他们的事件是独立的，其中一个订阅不会影响其他subscriber事件接收

> 尽管 Cold Observable 很好，但是对于某些事件不确定何时发生以及不确定 Observable 发射的元素数量，那还得使用 Hot Observable。比如：UI交互的事件、网络环境的变化、地理位置的变化、服务器推送消息的到达等等。

## Hot Observable

无论有没有观察者进行订阅，事件始终都会发生。当Hot Observable有多个订阅者（多个观察者进行订阅时），Hot Observable与订阅者们的关系是一对多的关系，可以与多个订阅者共享信息。

### Cold Observable 如何转换成 Hot Observable？

##### 1. 使用publish，生成 ConnectableObservable

注意，生成的 `ConnectableObservable` 需要调用`connect()`才能真正执行。

```java
Consumer<Long> subscriber1 = new Consumer<Long>() {
    @Override
    public void accept(@NonNull Long aLong) throws Exception {
        System.out.println("subscriber1: "+aLong);
    }
};

Consumer<Long> subscriber2 = new Consumer<Long>() {
    @Override
    public void accept(@NonNull Long aLong) throws Exception {
        System.out.println("   subscriber2: "+aLong);
    }
};

Consumer<Long> subscriber3 = new Consumer<Long>() {
    @Override
    public void accept(@NonNull Long aLong) throws Exception {
        System.out.println("      subscriber3: "+aLong);
    }
};

ConnectableObservable<Long> observable = Observable.create(new ObservableOnSubscribe<Long>() {
    @Override
    public void subscribe(@NonNull ObservableEmitter<Long> e) throws Exception {
        Observable.interval(10, TimeUnit.MILLISECONDS,Schedulers.computation())
                .take(Integer.MAX_VALUE)
                .subscribe(e::onNext);
    }
}).observeOn(Schedulers.newThread()).publish();
observable.connect();

observable.subscribe(subscriber1);
observable.subscribe(subscriber2);

try {
    Thread.sleep(20L);
} catch (InterruptedException e) {
    e.printStackTrace();
}

observable.subscribe(subscriber3);

try {
    Thread.sleep(100L);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

##### 2. 使用Subject/Processor

- Subject和Processor作用相同，Processor是2.x新增的类，继承自Flowable，支持背压，而Subject不支持背压。
- Subject既是Observable，又是Observer。
- Subject作为观察者，可以订阅目标Cold Observable，使对方开始发送事件；同时它又作为Observable转发或发送新的事件，让Cold Observable借助Subject转换为Hot Observable。
- Subject并不是线程安全的，需要线程安全需要调用toSerialized()方法（Rx1.x可以用SerializedSubject，Rx2.x后没有该类了）。
- 很多基于EventBus改造的RxBus没有这么做，很危险，会遇到并发问题。

```kotlin
private fun testCold() {

    var observable = Observable.create<Long> {
        var it1 = it
        Observable.interval(1, TimeUnit.SECONDS, Schedulers.computation())
                .take(15)
                .subscribe({
                    if (!it1.isDisposed) {
                        it1.onNext(it)
                    }
                })
    }
            .observeOn(Schedulers.newThread())

    val subject = PublishSubject.create<Long>()
    observable.subscribe(subject)

    subject.subscribe({
        LogUtil.logi("hacket", "Subscriber1", "subscriber1: $it")
    })
    subject.subscribe({
        LogUtil.logi("hacket", "Subscriber2", "subscriber2: $it")
    })

    try {
        Thread.sleep(2000L)
    } catch (e: InterruptedException) {
        e.printStackTrace()
    }

    subject.subscribe({
        LogUtil.logi("hacket", "Subscriber3", "subscriber3: $it")
    })

    try {
        Thread.sleep(1000L)
    } catch (e: InterruptedException) {
        e.printStackTrace()
    }
}
```

### Hot Observable 如何转换成 Cold Observable？

##### 1. ConnectableObservable的refCount操作符

![](https://upload-images.jianshu.io/upload_images/2613397-7a9fbb425a012864.png#id=DiGZl&originHeight=1020&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

RefCount操作符把从一个可连接的 Observable 连接和断开的过程自动化了。它操作一个可连接的Observable，返回一个普通的Observable。当第一个订阅者订阅这个Observable时，RefCount连接到下层的可连接Observable。RefCount跟踪有多少个观察者订阅它，直到最后一个观察者完成才断开与下层可连接Observable的连接。<br>如果所有的订阅者都取消订阅了，则数据流停止。如果重新订阅则重新开始数据流。

```java
Consumer<Long> subscriber1 = new Consumer<Long>() {
    @Override
    public void accept(@NonNull Long aLong) throws Exception {
        System.out.println("subscriber1: "+aLong);
    }
};

Consumer<Long> subscriber2 = new Consumer<Long>() {
    @Override
    public void accept(@NonNull Long aLong) throws Exception {
        System.out.println("   subscriber2: "+aLong);
    }
};

ConnectableObservable<Long> connectableObservable = Observable.create(new ObservableOnSubscribe<Long>() {
    @Override
    public void subscribe(@NonNull ObservableEmitter<Long> e) throws Exception {
        Observable.interval(10, TimeUnit.MILLISECONDS,Schedulers.computation())
                .take(Integer.MAX_VALUE)
                .subscribe(e::onNext);
    }
}).observeOn(Schedulers.newThread()).publish();
connectableObservable.connect();

Observable<Long> observable = connectableObservable.refCount();

Disposable disposable1 = observable.subscribe(subscriber1);
Disposable disposable2 = observable.subscribe(subscriber2);

try {
    Thread.sleep(20L);
} catch (InterruptedException e) {
    e.printStackTrace();
}

disposable1.dispose();
disposable2.dispose();

System.out.println("重新开始数据流");

disposable1 = observable.subscribe(subscriber1);
disposable2 = observable.subscribe(subscriber2);

try {
    Thread.sleep(20L);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

如果不是所有的订阅者都取消了订阅，只取消了部分。部分的订阅者重新开始订阅，则不会从头开始数据流。而是从没有取消订阅的订阅者最新的值开始发射数据

##### 2. Observable的share操作符

share操作符封装了publish().refCount()调用，可以看其源码。

# RxJava1.x vs RxJava2.x

## 新增Flowable

RxJava1 中 Observable 不能很好地支持 backpressure ，会抛出MissingBackpressureException。所以在 RxJava2 中 Oberservable 不再支持 backpressure ，而使用新增的 Flowable 来支持 backpressure 。Flowable的用法跟原先的Observable是一样的。

## ActionN 和 FuncN 改名

ActionN 和 FuncN 遵循Java 8的命名规则。 其中，Action0 改名成Action，Action1改名成Consumer，而Action2改名成了BiConsumer，而Action3 - Action9都不再使用了，ActionN变成了Consumer。 同样，Func改名成Function，Func2改名成BiFunction，Func3 - Func9 改名成 Function3 - Function9，FuncN 由 Function 取代。

## Observable.OnSubscribe 变成 ObservableOnSubscribe

## ObservableOnSubscribe 中使用 ObservableEmitter 发送数据给 Observer

ObservableOnSubscribe 不再使用 Subscriber 而是用 ObservableEmitter 替代。 ObservableEmitter 可以理解为发射器，是用来发出事件的，它可以发出三种类型的事件，通过调用emitter的onNext(T value)、onComplete()和onError(Throwable error)可以分别发出next事件、complete事件和error事件。 如果只关心next事件的话，只需单独使用onNext()即可。 需要特别注意，emitter的onComplete()调用后，Consumer不再接收任何next事件

## Observable.Transformer 变成 ObservableTransformer

由于新增了Flowable，同理也增加了FlowableTransformer

## Subscription 改名为 Disposable

在 RxJava2 中，由于已经存在了 org.reactivestreams.subscription 这个类，为了避免名字冲突将原先的 rx.Subscription 改名为 io.reactivex.disposables.Disposable。 刚开始不知道，在升级 RxJava2 时发现 org.reactivestreams.subscription 这个类完全没法做原先 rx.Subscription 的事情。( 顺便说下，Disposable必须单次使用，用完就要销毁。)

## Observable不支持订阅Subscriber了

## RxJava2不支持Nulls值

RxJava 2x 不再支持`null`值，如果传入一个`null`会抛出 `NullPointerException`

## RxJava2新增Single&Completable&Maybe

### Single

2.x 的Single类可以发射一个单独onSuccess 或 onError消息。它现在按照Reactive-Streams规范被重新设计，SingleObserver改成了如下的接口。

```java
interface SingleObserver<T> {
    void onSubscribe(Disposable d);
    void onSuccess(T value);
    void onError(Throwable error);
}
```

并遵循协议 onSubscribe (onSuccess | onError)?.

### Completable

Completable大部分和以前的一样。因为它在1.x的时候就是按照Reactive-Streams的规范进行设计的。<br>命名上有些变化，<br>`rx.Completable.CompletableSubscriber`变成了 `io.reactivex.CompletableObserver`和 onSubscribe(Disposable):

```java
interface CompletableObserver<T> {
    void onSubscribe(Disposable d);
    void onComplete();
    void onError(Throwable error);
}
```

并且仍然遵循协议 onSubscribe (onComplete | onError)?.

### Maybe

RxJava 2.0.0-RC2 介绍了一个新的类型 Maybe 。从概念上来说，它是Single 和 Completable 的结合体。它可以发射0个或1个通知或错误的信号。

Maybe类结合了MaybeSource, MaybeObserver作为信号接收接口，同样遵循协议onSubscribe (onSuccess | onError | onComplete)?。因为最多有一个元素被发射，Maybe没有背压的概念。

这意味着调用onSubscribe(Disposable)请求可能还会触发其他 onXXX方法。和Flowable不同，如果那有一个单独的值要发射，那么只有onSuccess被调用，onComplete不被调用。

这个新的类,实际上和其他Flowable的子类操作符一样可以发射0个或1个序列。

```java
Maybe.just(1)
.map(v -> v + 1)
.filter(v -> v == 1)
.defaultIfEmpty(2)
.test()
.assertResult(2);
```

# RxJava3和RxJava2区别

- [ ] Android：RxJava 3.0尝鲜，你做好准备了吗？<br><https://blog.csdn.net/weixin_45258969/article/details/95386872>

# 五种发射器对比

| 类型          | 描述                                                    |
| ----------- | ----------------------------------------------------- |
| Observable  | 能够发射0或n个数据，并以成功或错误事件终止，不支持背压                          |
| Flowable    | 能够发射0或n个数据，并以成功或错误事件终止，支持背压，可以控制数据源发射的速度              |
| Single      | 只发射单个数据或错误事件，不支持背压                                    |
| Completable | 从来不发射数据，只处理onComplete和onError事件。可以看成Rx的Runnable，不支持背压 |
| Maybe       | 能够发射0或1个数据，要么成功，要么失败。类似于Optional，不支持背压                |

## Observable

## Flowable

在RxJava2.x，Observable不再支持背压，改由Flowable来支持非阻塞式的背压。Flowable可以看成是Observable新的实例，支持背压，同时实现Reactive Stream的Publisher接口，Flowable所有的操作符强制支持背压，和Observable中的操作符大多数类似。<br>和Observable使用场景对比：<br>使用Observable场景较好：

1. 一般处理最大不超过1000条数据，并且几乎不会出现内存溢出
2. GUI鼠标事件，基本不会背压（可以结合sampling/debouncing操作）
3. 处理同步流

使用Flowable场景较好：

1. 处理以某种方式产生超过10KB的元素
2. 文件读取与分析
3. 读取数据库记录，也是一个阻塞的和基于拉取模式
4. 网络I/O流
5. 创建一个响应式非阻塞接口

## Single

Single只有onSuccess和onError事件，只能发射一个数据，后面即使再发射数据也不会做任何处理。<br>SingleObserver只有onSuccess，onError，onSubscribe()三个方法，没有onComplete。<br>Single可以通过toXXX方法转换为Observable，Flowable，Completable及Maybe。

## Completable

Completable在创建后，不会发射任何数据，从CompletableEmitter源码可以看出<br>Completable只有onComple和onError事件，同时Completable并没有map,flatMap等操作符，它的操作符比起Observable/Flowable要少很多。<br>可以通过fromXXX操作符来创建一个Completable<br>经常和andThen操作符使用。

## Maybe

Maybe可以看成是Single和Completable的结合。<br>Maybe创建之后，MaybeEmitter和SingleEmitter一样，并没有onNext方法，同样需要通过onSuccess方法发射数据；<br>Maybe只能发射0或1个数据，即使发射多个数据，后面发射的数据也不会处理。<br>如果Maybe调用了onComplete，再调用onSuccess，也不会发射任何数据

# RxJava订阅取消

订阅的及时取消，防止内存泄漏

## Disposable

- RxJava1.x中，订阅关系由Subscription维护，可以检测订阅关系是否存在，取消订阅关系；
- RxJava2.x中，Subscription改名为Disposable了，因为RxJava2.x存在了`org.reactivestreams.subscription`这个类（遵循Reactive Streams标准），为了避免冲突，改名为Disposable了。

## CompositeDisposable

RxJava1.x有个复合订阅(composite subscription)，RxJava2.x中，有一个类似的复合订阅，CompositeDisposable，每当我们得到一个Disposable时，调用CompositeDisposable的add方法，将其添加CompositeDisposable容器中，在退出时，调用clear，即可切断所有的事件，就可以在合适的地方取消订阅。

> 我们可以使用Disposable来管理一个订阅，使用CompositeDisposable来管理多个订阅，防止没有及时取消，导致Activity/Fragment无法销毁而引起内存泄漏。

## RxLifecycle库 （过时）

## AutoDispose库（Uber，推荐）

# RxJava2异常处理

1. RxJava2 一个重要的设计需求就是不能吞下任何的 Throwable 错误。这里的错误是指那些由于下游流的生命周期走到了尽头或下游流取消了即将发射错误的序列
2. 这些错误被发送到 RxJavaPlugins.onError 处理器。该处理器可以通过<br>`RxJavaPlugins.setErrorHandler` 方法重载。如果没有重载，缺省状态下 RxJava 打印 Throwable 的堆栈轨迹到控制台并且调用当前线程的未捕获异常处理器
3. 如果要避免调用未捕获异常处理器，使用 RxJava2（直接地或间接地）的最终程序应该设置一个空的处理器`RxJavaPlugins.setErrorHandler(e -> {});`
4. RxJava2 中如果通过 RxJavaPlugins.setErrorHandler 方法设置了错误处理器，那么在 subscribe 时不指定 onError 的 Consumer 应用也不会崩溃，除非是在错误处理器中手动调用了 `Thread.currentThread().getUncaughtExceptionHandler().uncaughtException(Thread.currentThread(), e);`才会崩溃

## Unchecked异常

一般情况下，unchecked异常会自动传递给`onError`；<br>也有例外的情况，那就是... 那些非常严重的错误，以致于RxJava都不能继续运行了，如`StackOverflowError`，这些异常被认为是致命的，对它们来说，调用`onError`毫无意义，并没什么用。<br>你可以用`Exceptions.throwIfFatal`来过滤掉这些致命的异常并重新抛出，不发射关于它们的通知。

- VirtualMachineError
- ThreadDeath
- LinkageError
- StackOverflowError

## Checked异常

Checked Exception需要手动的try{}catch{}，通过`Exceptions.propagate()`将`Checked Exception`转换成RuntimeException，否则app会崩溃。

## RxJava2中的UndeliverableException

[Error handling Wiki](https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0#error-handling)

### 原因

1. 调用了多次onError，正常来说，出现一次onError会走正常Observer处理，其他的会走Error handling ,可以通过以下捕捉多次的error：
2. 已经被dispose了，但Observable，没有判断是否dispose了，还在发射数据，并发生了异常

RxJava2取消订阅后，抛出的异常无法捕获，导致程序崩溃<br>背景：RxJava2的一个重要的设计理念是：不吃掉任何一个异常。产生的问题是，当RxJava2“downStream”取消订阅后，“upStream”仍有可能抛出异常，这时由于已经取消订阅，“downStream”无法处理异常，此时的异常无人处理，便会导致程序崩溃。

3. AutoDispose订阅，已经取消订阅了，还在抛异常。

### 解决

```java

public static void registerRx2ErrorHandler() {

    RxJavaPlugins.setErrorHandler(e -> {

        if (e instanceof UndeliverableException) {

            e = e.getCause();

        }

        String stackTraceString = Log.getStackTraceString(e);

        if ((e instanceof IOException) || (e instanceof SocketException)) {

            // fine, irrelevant network problem or API that throws on cancellation

            LogUtil.e(TAG, "fine, irrelevant network problem or API that throws on cancellation：" + stackTraceString);

            return;

        }

        if (e instanceof InterruptedException) {

            // fine, some blocking code was interrupted by a dispose call

            LogUtil.e(TAG, "fine, some blocking code was interrupted by a dispose call：" + stackTraceString);

            return;

        }

        if (e instanceof ANError) {

            LogUtil.e(TAG, ((ANError) e).getErrorDetail());

            return;

        }

        if ((e instanceof NullPointerException) || (e instanceof IllegalArgumentException)) {

            // that's likely a bug in the application

            LogUtil.e(TAG, "that's likely a bug in the application：" + stackTraceString);

            Thread.currentThread()

                    .getUncaughtExceptionHandler()

                    .uncaughtException(Thread.currentThread(), e);

            return;

        }

        if (e instanceof IllegalStateException) {
            // that's a bug in RxJava or in a custom operator
            LogUtil.e(TAG, " that's a bug in RxJava or in a custom operator：" + stackTraceString);
            Thread.currentThread()
                    .getUncaughtExceptionHandler()
                    .uncaughtException(Thread.currentThread(), e);
            return;
        }
        LogUtil.e(TAG, "Undeliverable exception received, not sure what to do：" + stackTraceString);
    });
}
```

### 案例

在onNext发射到10之前，取消订阅就会报异常；

```java

Observable

        .create(new ObservableOnSubscribe<Integer>() {

            @Override

            public void subscribe(ObservableEmitter<Integer> emitter) throws Exception {

                for (int i = 0; i < 20; i++) {

                    emitter.onNext(i);

                    SystemClock.sleep(1000);

                    if (i == 10) {

                        int j = i / 0;

                    }

                    if (i == 19) {

                        emitter.onComplete();

                    }

                }

            }

        })
```

报如下异常：

```java

    me.hacket.assistant E/AndroidRuntime: FATAL EXCEPTION: RxCachedThreadScheduler-1

    Process: me.hacket.assistant, PID: 18900

    io.reactivex.exceptions.UndeliverableException: java.lang.ArithmeticException: divide by zero

        at io.reactivex.plugins.RxJavaPlugins.onError(RxJavaPlugins.java:367)

        at io.reactivex.internal.operators.observable.ObservableCreate$CreateEmitter.onError(ObservableCreate.java:74)

        at io.reactivex.internal.operators.observable.ObservableCreate.subscribeActual(ObservableCreate.java:43)

        at io.reactivex.Observable.subscribe(Observable.java:12030)

        at io.reactivex.internal.operators.observable.ObservableDoOnLifecycle.subscribeActual(ObservableDoOnLifecycle.java:33)

        at io.reactivex.Observable.subscribe(Observable.java:12030)

        at io.reactivex.internal.operators.observable.ObservableSubscribeOn$SubscribeTask.run(ObservableSubscribeOn.java:96)

        at io.reactivex.Scheduler$DisposeTask.run(Scheduler.java:579)

        at io.reactivex.internal.schedulers.ScheduledRunnable.run(ScheduledRunnable.java:66)

        at io.reactivex.internal.schedulers.ScheduledRunnable.call(ScheduledRunnable.java:57)

        at java.util.concurrent.FutureTask.run(FutureTask.java:237)

        at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:154)

        at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:269)

        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1113)

        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:588)

        at java.lang.Thread.run(Thread.java:818)

     Caused by: java.lang.ArithmeticException: divide by zero

        at me.hacket.assistant.samples.rx.rxjava2.RxJava2异常处理.UndeliverableException.RxJava2的UndeliverableException$2.subscribe(RxJava2的UndeliverableException.java:54)

        at io.reactivex.internal.operators.observable.ObservableCreate.subscribeActual(ObservableCreate.java:40)

        at io.reactivex.Observable.subscribe(Observable.java:12030) 

        at io.reactivex.internal.operators.observable.ObservableDoOnLifecycle.subscribeActual(ObservableDoOnLifecycle.java:33) 

        at io.reactivex.Observable.subscribe(Observable.java:12030) 

        at io.reactivex.internal.operators.observable.ObservableSubscribeOn$SubscribeTask.run(ObservableSubscribeOn.java:96) 

        at io.reactivex.Scheduler$DisposeTask.run(Scheduler.java:579) 

        at io.reactivex.internal.schedulers.ScheduledRunnable.run(ScheduledRunnable.java:66) 

        at io.reactivex.internal.schedulers.ScheduledRunnable.call(ScheduledRunnable.java:57) 

        at java.util.concurrent.FutureTask.run(FutureTask.java:237) 

        at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:154) 

        at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:269) 

        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1113) 

        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:588) 

        at java.lang.Thread.run(Thread.java:818)
```

分析：

> 如果没有取消订阅，一直走的正常的流程，那么会被捕捉到`onError`中去，分析Observable的源码

```java

public final void subscribe(Observer<? super T> observer) {

        ObjectHelper.requireNonNull(observer, "observer is null");

        try {

            observer = RxJavaPlugins.onSubscribe(this, observer);

            ObjectHelper.requireNonNull(observer, "Plugin returned null Observer");

            subscribeActual(observer);

        } catch (NullPointerException e) { // NOPMD

            throw e;

        } catch (Throwable e) {

            Exceptions.throwIfFatal(e);

            // can't call onError because no way to know if a Disposable has been set or not

            // can't call onSubscribe because the call might have set a Subscription already

            RxJavaPlugins.onError(e);

            NullPointerException npe = new NullPointerException("Actually not, but can't throw other exceptions due to RS");

            npe.initCause(e);

            throw npe;

        }

    }
```

发射数据在`subscribeActual()`方法，那么现在我们看`ObservableCreate`的实现方式：

```java

public final class ObservableCreate<T> extends Observable<T> {

    final ObservableOnSubscribe<T> source;

    public ObservableCreate(ObservableOnSubscribe<T> source) {

        this.source = source;

    }

    @Override

    protected void subscribeActual(Observer<? super T> observer) {

        CreateEmitter<T> parent = new CreateEmitter<T>(observer);

        observer.onSubscribe(parent);

        try {

            source.subscribe(parent);

        } catch (Throwable ex) {

            Exceptions.throwIfFatal(ex);

            parent.onError(ex);

        }

    }

    // ...

}
```

可以看到捕获了异常，然后走入到catch，`Exceptions.throwIfFatal(ex);`，

```java

public static void throwIfFatal(@NonNull Throwable t) {

        // values here derived from https://github.com/ReactiveX/RxJava/issues/748#issuecomment-32471495

        if (t instanceof VirtualMachineError) {

            throw (VirtualMachineError) t;

        } else if (t instanceof ThreadDeath) {

            throw (ThreadDeath) t;

        } else if (t instanceof LinkageError) {

            throw (LinkageError) t;

        }

    }
```

最后调用了Observer的onError()，如果被取消订阅了，那么会走到`RxJavaPlugins.onError(t);`中去

```java

public void onError(Throwable t) {

       if (!tryOnError(t)) {

                RxJavaPlugins.onError(t);

            }

        }

        @Override

        public boolean tryOnError(Throwable t) {

            if (t == null) {

                t = new NullPointerException("onError called with null. Null values are generally not allowed in 2.x operators and sources.");

            }

            if (!isDisposed()) {

                try {

                    observer.onError(t);

                } finally {

                    dispose();

                }

                return true;

            }

            return false;

        }
```

看RxJavaPlugins.onError(t);

```java

public static void onError(@NonNull Throwable error) {

        Consumer<? super Throwable> f = errorHandler;

        if (error == null) {

            error = new NullPointerException("onError called with null. Null values are generally not allowed in 2.x operators and sources.");

        } else {

            if (!isBug(error)) {

                error = new UndeliverableException(error);

            }

        }

        if (f != null) {

            try {

                f.accept(error);

                return;

            } catch (Throwable e) {

                // Exceptions.throwIfFatal(e); TODO decide

                e.printStackTrace(); // NOPMD

                uncaught(e);

            }

        }

        error.printStackTrace(); // NOPMD

        uncaught(error);

    }
```

# 背压策略

## 背压

### 同步订阅&异步订阅

1. 同步订阅 <br>Observable和Observer都工作在同一个线程；Observable每发送一个事件，必须等到Observer接收处理后，才能继续发送下一个事件
2. 异步订阅 <br>Observable和Observer工作在不同的线程；Observable不需要等待Observer接收处理事件后才能继续发送下一个事件，而是不断的发送，直到发送事件完毕(此时事件并不会直接发送到Observer处，而是先发送到缓存区，等Observer从缓存区取出来来处理)

> 对于异步订阅关系，存在 被观察者发送事件速度 与观察者接收事件速度 不匹配的情况

### 问题

Observable发送事件速度太快，而Observer来不及接收所有事件，从而导致Observer无法及时响应 /处理所有发送过来事件的问题，最终导致缓存区溢出、事件丢失 & OOM。

### Flowable(RxJava2.0)

在 RxJava2.0中，采用 Flowable 实现“非阻塞式背压” 策略。<br>相比RxJava1.0，为什么要采用新实现Flowable实现背压，而不采用旧的Observable呢？

1. RxJava1.x，Observable无法很好解决背压问题，Observable内部采用队列存储事件，Android中默认缓存大小16
2. RxJava1.x，手动减少被观察者发送的事件，降低被观察者发送事件的速度（采用延迟的方式），效果不好，依然会出现事件丢失等问题
3. RxJava2.x，被观察者的新实现Flowable来实现背压问题

### 背压策略原理

解决思路：

1. 避免出现事件发送&接收流速不匹配的情况
   - 控制观察者接收事件的速度，响应式拉取
   - 控制被观察者发送事件的速度，反馈控制
2. 当出现事件发送&接收流速不匹配时的解决方案
   - 背压策略模式

#### 响应式拉取 (控制**观察者接收事件**的速度)

##### 1. 异步订阅(Observable和Observer工作在不同线程)

Observable和Observer工作在不同线程，Observer没有调用Subscription.request(long)，Observer不接收事件，但Observable仍然会发送数据，会暂存到缓存区，默认最大大小为128，超出就报错。

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
        @Override
        public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
            // 一共发送129个事件，即超出了缓存区的大小
            for (int i = 0; i < 129; i++) {
                Log.d(TAG, "发送了事件" + i);
                emitter.onNext(i);
            }
            emitter.onComplete();
        }
    }, BackpressureStrategy.ERROR).subscribeOn(Schedulers.io()) // 设置被观察者在io线程中进行
            .observeOn(AndroidSchedulers.mainThread()) // 设置观察者在主线程中进行
            .subscribe(new Subscriber<Integer>() {
                @Override
                public void onSubscribe(Subscription s) {
                    Log.d(TAG, "onSubscribe");
                    // 默认不设置可接收事件大小
                }

                @Override
                public void onNext(Integer integer) {
                    Log.d(TAG, "接收到了事件" + integer);
                }

                @Override
                public void onError(Throwable t) {
                    Log.w(TAG, "onError: ", t);
                }

                @Override
                public void onComplete() {
                    Log.d(TAG, "onComplete");
                }
            });
```

当发射到129个数据时报错了：

```
io.reactivex.rxjava3.exceptions.MissingBackpressureException: create: could not emit value due to lack of requests
```

##### 2. 同步订阅 (Observable和Observer工作在相同线程)

对于没有缓存区概念的同步订阅关系来说，单纯采用控制观察者的接收事件数量（响应式拉取）实际上就等于“单相思”，虽然观察者控制了要接收3个事件，但假设被观察者需要发送4个事件，还是会出现问题。

```java
/**
 * 步骤1：创建被观察者 =  Flowable
 */
Flowable<Integer> upstream = Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {

        // 被观察者发送事件数量 = 4个
        Log.d(TAG, "发送了事件1");
        emitter.onNext(1);
        Log.d(TAG, "发送了事件2");
        emitter.onNext(2);
        Log.d(TAG, "发送了事件3");
        emitter.onNext(3);
        Log.d(TAG, "发送了事件4");
        emitter.onNext(4);
        emitter.onComplete();
    }
}, BackpressureStrategy.ERROR);

/**
 * 步骤2：创建观察者 =  Subscriber
 */
Subscriber<Integer> downstream = new Subscriber<Integer>() {

    @Override
    public void onSubscribe(Subscription s) {
        Log.d(TAG, "onSubscribe");
        s.request(3);
        // 观察者接收事件 = 3个 ，即不匹配
    }

    @Override
    public void onNext(Integer integer) {
        Log.d(TAG, "接收到了事件 " + integer);
    }

    @Override
    public void onError(Throwable t) {
        Log.w(TAG, "onError: ", t);
    }

    @Override
    public void onComplete() {
        Log.d(TAG, "onComplete");
    }
};

/**
 * 步骤3：建立订阅关系
 */
upstream.subscribe(downstream);
```

当发射第4个数据时，报错了：

```
D: onSubscribe
D: 发送了事件1
D: 接收到了事件 1
D: 发送了事件2
D: 接收到了事件 2
D: 发送了事件3
D: 接收到了事件 3
D: 发送了事件4
W: onError: 
    io.reactivex.rxjava3.exceptions.MissingBackpressureException: create: could not emit value due to lack of requests
        at io.reactivex.rxjava3.internal.operators.flowable.FlowableCreate$ErrorAsyncEmitter.onOverflow(FlowableCreate.java:445)
        at io.reactivex.rxjava3.internal.operators.flowable.FlowableCreate$NoOverflowBaseAsyncEmitter.onNext(FlowableCreate.java:413)
        at me.hacket.assistant.samples.三方库.rx.rxjava2.RxJava2背压.背压基础.背压测试Activity$1.subscribe(背压测试Activity.java:61)
        at io.reactivex.rxjava3.internal.operators.flowable.FlowableCreate.subscribeActual(FlowableCreate.java:71)
        at io.reactivex.rxjava3.core.Flowable.subscribe(Flowable.java:15747)
        at io.reactivex.rxjava3.core.Flowable.subscribe(Flowable.java:15696)
        at me.hacket.assistant.samples.三方库.rx.rxjava2.RxJava2背压.背压基础.背压测试Activity.test2(背压测试Activity.java:97)
        at me.hacket.assistant.samples.三方库.rx.rxjava2.RxJava2背压.背压基础.背压测试Activity.onClick(背压测试Activity.java:41)
        at android.view.View.performClick(View.java:7253)
        at android.view.View.performClickInternal(View.java:7230)
        at android.view.View.access$3500(View.java:822)
        at android.view.View$PerformClick.run(View.java:27766)
        at android.os.Handler.handleCallback(Handler.java:883)
        at android.os.Handler.dispatchMessage(Handler.java:100)
        at android.os.Looper.loop(Looper.java:227)
        at android.app.ActivityThread.main(ActivityThread.java:7582)
        at java.lang.reflect.Method.invoke(Native Method)
        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:539)
        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:953)
```

> 同步订阅，如果Subscription没有调用request，Flowable发射数据，就会报错MissingBackpressureException；没有调用request，观察者是默认没有处理数据的能力

#### 反馈控制 (控制**被观察者发送事件**的速度)

##### 1. 同步订阅

同步订阅情况中，被观察者 通过`FlowableEmitter.requested()`获得了观察者自身接收事件能力，从而根据该信息控制事件发送速度，从而达到了观察者反向控制被观察者的效果

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
        // 调用emitter.requested()获取当前观察者需要接收的事件数量
        long n = emitter.requested();
        Log.d(TAG, "观察者可接收事件" + n);
        // 根据emitter.requested()的值，即当前观察者需要接收的事件数量来发送事件
        for (int i = 0; i < n; i++) {
            Log.d(TAG, "发送了事件" + i);
            emitter.onNext(i);
        }
    }
}, BackpressureStrategy.ERROR)
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
                // 设置观察者每次能接受10个事件
                s.request(10);
            }
            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }
            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }
            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

###### 在同步订阅情况中使用FlowableEmitter.requested()注意

> Flowable同步时，需要调用Subscription.request(n)，否则报MissingBackpressureException；
> Flowable异步时，不需要调用，因为默认有128容量，

1. 可叠加性: 观察者可连续要求接收事件，被观察者会进行叠加并一起发送

```
Subscription.request（a1）；
Subscription.request（a2）；

FlowableEmitter.requested()的返回值 = a1 + a2
```

代码演示：

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
        // 调用emitter.requested()获取当前观察者需要接收的事件数量
        Log.d(TAG, "观察者可接收事件" + emitter.requested()); // 30

    }
}, BackpressureStrategy.ERROR)
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
                s.request(10); // 第1次设置观察者每次能接受10个事件
                s.request(20); // 第2次设置观察者每次能接受20个事件
            }
            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }
            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }
            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

2. 实时更新性 <br>每次发送事件后，emitter.requested()会实时更新观察者能接受的事件

```
1. 即一开始观察者要接收10个事件，发送了1个后，会实时更新为9个
2. 仅计算Next事件，complete & error事件不算。

Subscription.request（10）；
// FlowableEmitter.requested()的返回值 = 10

FlowableEmitter.onNext(1); // 发送了1个事件
// FlowableEmitter.requested()的返回值 = 9
```

代码演示：

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {

        // 1. 调用emitter.requested()获取当前观察者需要接收的事件数量
        Log.d(TAG, "观察者可接收事件数量 = " + emitter.requested()); // 10

        // 2. 每次发送事件后，emitter.requested()会实时更新观察者能接受的事件
        // 即一开始观察者要接收10个事件，发送了1个后，会实时更新为9个
        Log.d(TAG, "发送了事件 1");
        emitter.onNext(1);
        Log.d(TAG, "发送了事件1后, 还需要发送事件数量 = " + emitter.requested()); // 9

        Log.d(TAG, "发送了事件 2");
        emitter.onNext(2);
        Log.d(TAG, "发送事件2后, 还需要发送事件数量 = " + emitter.requested()); // 8

        Log.d(TAG, "发送了事件 3");
        emitter.onNext(3);
        Log.d(TAG, "发送事件3后, 还需要发送事件数量 = " + emitter.requested()); // 7 

        emitter.onComplete();
    }
}, BackpressureStrategy.ERROR)
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");

                s.request(10); // 设置观察者每次能接受10个事件
            }

            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }

            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }

            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

3. 异常 <br>当`FlowableEmitter.requested()`减到0时，则代表观察者已经不可接收事件；此时被观察者若继续发送事件，则会抛出`MissingBackpressureException`异常。<br>代码演示：

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
        // 1. 调用emitter.requested()获取当前观察者需要接收的事件数量
        Log.d(TAG, "观察者可接收事件数量 = " + emitter.requested());
        // 2. 每次发送事件后，emitter.requested()会实时更新观察者能接受的事件
        Log.d(TAG, "发送了事件 1");
        emitter.onNext(1);
        Log.d(TAG, "发送了事件1后, 还需要发送事件数量 = " + emitter.requested());
        Log.d(TAG, "发送了事件 2");
        emitter.onNext(2);
        Log.d(TAG, "发送事件2后, 还需要发送事件数量 = " + emitter.requested());
        emitter.onComplete();
    }
}, BackpressureStrategy.ERROR)
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
                s.request(1); // 设置观察者每次能接受1个事件
            }
            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }
            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }
            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

> 如观察者可接收事件数量 = 1，当被观察者发送第2个事件时，就会抛出异常

---

1. 若观察者没有设置可接收事件数量，即无调用`Subscription.request()`
2. 被观察者默认观察者可接收事件数量 = 0，即`FlowableEmitter.requested()`的返回值 = 0

##### 2. 异步订阅

在异步订阅中，由于二者处于不同线程，所以被观察者无法通过`FlowableEmitter.requested()`知道观察者自身接收事件能力，即 **被观察者不能根据 观察者自身接收事件的能力 控制发送事件的速度**。具体请看下面例子

```java
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
        // 调用emitter.requested()获取当前观察者需要接收的事件数量
        Log.d(TAG, "观察者可接收事件数量 = " + emitter.requested()); // 128
    }
}, BackpressureStrategy.ERROR).subscribeOn(Schedulers.io()) // 设置被观察者在io线程中进行
        .observeOn(AndroidSchedulers.mainThread()) // 设置观察者在主线程中进行
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
                s.request(150);
                // 该设置仅影响观察者线程中的requested，却不会影响的被观察者中的FlowableEmitter.requested()的返回值
                // 因为FlowableEmitter.requested()的返回值 取决于RxJava内部调用request(n)，而该内部调用会在一开始就调用request(128)
                // 为什么是调用request(128)下面再讲解
            }
            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }
            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }
            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

在异步订阅关系中，反向控制的原理是：通过RxJava内部固定调用被观察者线程中的request(n) 从而 反向控制被观察者的发送事件速度

> RxJava内部调用request(n)（n = 128、96、0）

代码演示：

```java
// 被观察者：一共需要发送500个事件，但真正开始发送事件的前提 = FlowableEmitter.requested()返回值 ≠ 0
// 观察者：每次接收事件数量 = 48（点击按钮）
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {

        Log.d(TAG, "观察者可接收事件数量 = " + emitter.requested());
            boolean flag; //设置标记位控制

            // 被观察者一共需要发送500个事件
            for (int i = 0; i < 500; i++) {
                flag = false;

                // 若requested() == 0则不发送
                while (emitter.requested() == 0) {
                    if (!flag) {
                        Log.d(TAG, "不再发送");
                        flag = true;
                    }
                }
                // requested() ≠ 0 才发送
                Log.d(TAG, "发送了事件" + i + "，观察者可接收事件数量 = " + emitter.requested());
                emitter.onNext(i);


        }
    }
}, BackpressureStrategy.ERROR).subscribeOn(Schedulers.io()) // 设置被观察者在io线程中进行
        .observeOn(AndroidSchedulers.mainThread()) // 设置观察者在主线程中进行
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
                mSubscription = s;
               // 初始状态 = 不接收事件；通过点击按钮接收事件
            }

            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }

            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }

            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });

// 点击按钮才会接收事件 = 48 / 次
btn = (Button) findViewById(R.id.btn);
btn.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        mSubscription.request(48);
        // 点击按钮 则 接收48个事件
    }
});
```

#### 采用背压策略模式

流速不匹配时（发送事件速度>接收事件速度），当缓存区满(默认缓存区128)，被观察者仍然继续发送下1个事件时。

##### BackpressureStrategy.ERROR

直接抛出异常MissingBackpressureException

```java
// 创建被观察者Flowable
Flowable.create(new FlowableOnSubscribe<Integer>() {
    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {

        // 发送 129个事件
        for (int i = 0;i< 129; i++) {
            Log.d(TAG, "发送了事件" + i);
            emitter.onNext(i);
        }
        emitter.onComplete();
    }
}, BackpressureStrategy.ERROR) // 设置背压模式 = BackpressureStrategy.ERROR
        .subscribeOn(Schedulers.io()) // 设置被观察者在io线程中进行
        .observeOn(AndroidSchedulers.mainThread()) // 设置观察者在主线程中进行
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onSubscribe(Subscription s) {
                Log.d(TAG, "onSubscribe");
            }

            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }

            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }

            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

> 发送第129个事件时，报错直接抛出异常MissingBackpressureException

```
// ...
D: ERROR 发送了事件127
D: ERROR 发送了事件128
W: ERROR onError: 
    io.reactivex.rxjava3.exceptions.MissingBackpressureException: create: could not emit value due to lack of requests
```

##### BackpressureStrategy.MISSING

友好提示：报异常MissingBackpressureException，并提示缓存区满了

代码同上，只是mode改为`BackpressureStrategy.MISSING`

```
// ...
D: ERROR 发送了事件127
D: ERROR 发送了事件128
W: MISSING onError: 
    io.reactivex.rxjava3.exceptions.MissingBackpressureException: Queue is full?!
```

##### BackpressureStrategy.BUFFER

将缓存区大小设置成无限大

```
1. 即 被观察者可无限发送事件 观察者，但实际上是存放在缓存区
2. 但要注意内存情况，防止出现OOM
```

可以接收超过原先缓存区大小（128）的事件数量了。

##### BackpressureStrategy.DROP

超过缓存区大小（128）的事件丢弃

> 如发送了150个事件，仅保存第1-第128个事件，第129 -第150事件将被丢弃

##### BackpressureStrategy.LATEST

只保存最新（最后）事件，超过缓存区大小（128）的事件丢弃

> 即如果发送了150个事件，缓存区里会保存129个事件（第1-第128 + 第150事件）

1. 被观察者一下子发送了150个事件，点击按钮接收时观察者接收了128个事件；
2. 再次点击接收时却接收到1个事件（第150个事件），这说明超过缓存区大小的事件仅保留最后的事件（第150个事件）

### 背压注意

1. 对于自身手动创建FLowable的情况，可通过传入背压模式参数选择背压策略
2. 可是对于自动创建FLowable，却无法手动传入传入背压模式参数，那么出现流速不匹配的情况下，该如何选择 背压模式呢？

> 用背压内置策略模式方法

#### 背压内置策略模式方法

```
onBackpressureBuffer()
onBackpressureDrop()
onBackpressureLatest()
```

> 默认采用BackpressureStrategy.ERROR模式

```java
Flowable.interval(1, TimeUnit.MILLISECONDS)
    .onBackpressureBuffer() // 添加背压策略封装好的方法，此处选择Buffer模式，即缓存区大小无限制
    .observeOn(Schedulers.newThread()) 
    .subscribe(new Subscriber<Long>() {
        @Override
        public void onSubscribe(Subscription s) {
            Log.d(TAG, "onSubscribe");
            mSubscription = s;
            s.request(Long.MAX_VALUE); 
        }

        @Override
        public void onNext(Long aLong) {
            Log.d(TAG, "onNext: " + aLong);
            try {
                Thread.sleep(1000);
                
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        @Override
        public void onError(Throwable t) {
            Log.w(TAG, "onError: ", t);
        }
        @Override
        public void onComplete() {
            Log.d(TAG, "onComplete");
        }
    });
```

## 背压总结

在RxJava2.0中，推出了Flowable用来支持背压，去除了Observable对背压的支持，下面在背压策略的讲解中，我们都使用Flowable作为我们的响应类型。在使用背压时，只需要在create()方法中第二个参数添加背压策略即可

1. 在订阅的时候如果使用FlowableSubscriber，那么需要通过`s.request(Long.MAX_VALUE)`去主动请求上游的数据项。如果遇到背压报错的时候，FlowableSubscriber默认已经将错误try-catch，并通过onError()进行回调，程序并不会崩溃。
2. 在订阅的时候如果使用Consumer，那么不需要主动去请求上游数据，默认已经调用了`s.request(Long.MAX_VALUE)`。如果遇到背压报错、且对Throwable的Consumer没有new出来，则程序直接崩溃。
3. 背压策略的上游的默认缓存池是128

## 背压Ref

- [ ] Android RxJava：一文带你全面了解 背压策略<br><https://blog.csdn.net/carson_ho/article/details/79081407>

# Subject和Processor

## Subject

Subject 既是 Observable 又是 Observer(Subscriber)。官网称 Subject 可以看成是一个桥梁或者代理。<br>当 Subject 作为 Subscriber 时，它可以订阅目标 Cold Observable 使对方开始发送事件。同时它又作为Observable 转发或者发送新的事件，让 Cold Observable 借助 Subject 转换为 Hot Observable。

### Subject分类

| Subject         | 发射行为                   |
| --------------- | ---------------------- |
| AsyncSubject    | 不论订阅发生在什么时候，只会发射最后一个数据 |
| BehaviorSubject | 发送订阅之前一个数据和订阅之后的全部数据   |
| ReplaySubject   | 不论订阅发生在什么时候，都发射全部数据    |
| PublishSubject  | 发送订阅之后全部数据             |

### PublishSubject

Observer只接收PublishSubject被订阅之后发送的数据。订阅前发射的数据收不到。<br>![](https://raw.github.com/wiki/ReactiveX/RxJava/images/rx-operators/PublishSubject.png#id=kkszA&originHeight=484&originWidth=1101&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 1、简单案例：

```java
hk_button3.setOnClickListener {
    subject.onNext("publicSubject1")
    subject.onNext("publicSubject2")

    subject.subscribe {
        LogUtil.logi("hacket", "onNext", "publicSubject:$it")
    }

    subject.onNext("publicSubject3")
    subject.onNext("publicSubject4")

    subject.subscribe {
        LogUtil.logi("hacket", "onNext", "publicSubject2:$it")
    }

    subject.onComplete() // complete，后面的5发射不出去了
    subject.onNext("publicSubject5")
}
```

结果：

```
I: 【onNext】publicSubject:publicSubject3，线程：main，日期：2018-11-07 13:14:21
I: 【onNext】publicSubject:publicSubject4，线程：main，日期：2018-11-07 13:14:21
```

第二个subject收不到数据，因为已经complete了

- 2、PublishSubject订阅在子线程会错过事件

```java
hk_button4.setOnClickListener {
    var subject = PublishSubject.create<String>()
    subject.onNext("publicSubject1")
    subject.onNext("publicSubject2")
    
    subject.subscribeOn(Schedulers.io())
    .subscribe(
        {
            LogUtil.logi("hacket", "onNext", "publicSubject:$it")
        },
        {
            LogUtil.logw("hacket", "onError", "publicSubject onError")  //不输出（异常才会输出）
        },
	{
    LogUtil.logi("hacket", "onComplete", "publicSubject:complete")  //输出 publicSubject onComplete

        })
	subject.onNext("publicSubject3")
    subject.onNext("publicSubject4")
    subject.onComplete()
    subject.onNext("publicSubject5")
}
```

结果：

```
I: 【onComplete】publicSubject:complete，线程：RxCachedThreadScheduler-1，日期：2018-11-07 13:16:09
```

- 3、配合RxBinding实现监听EditText变化

```kotlin
var subject3 = PublishSubject.create<String>()
RxTextView.textChanges(et_username)
        .filter { !it.isNullOrBlank() }
        .subscribe {
            subject3.onNext(it.toString())
        }
RxTextView.textChanges(et_age)
        .filter(Predicate { return@Predicate !it.isNullOrBlank() })
        .subscribe {
            subject3.onNext(it.toString())
        }
var sum = 0
subject3.subscribe {
    sum += it.toInt()
    tv_user.text = "总金额：$sum"
}
```

### BehaviorSubject

#### BehaviorSubject行为

Observer会先接收到BehaviorSubject被订阅之前的最后一个数据，再接收订阅之后发射过来的数据。如果BehaviorSubject被订阅之前没有发送任何数据，则会发送一个默认数据。<br>BehaviorSubject每次只会发射调用subscribe()方法之前的最后一个事件和调用subscribe()方法之后的事件。还可以缓存最近一次发出信息的数据。![](https://raw.github.com/wiki/ReactiveX/RxJava/images/rx-operators/S.BehaviorSubject.png#height=338&id=mJle0&originHeight=830&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=521)

> - 图表的第1次subscribe时，BehaviorSubject还没有发射数据，订阅者得到的是默认的粉红色数据，接着发送红色，绿色数据
> - 图表的第2次subscribe时，BehaviorSubject已经发射了红色和绿色数据了，BehaviorSubject会缓存最后一个数据在订阅时发射给订阅者，所以这时订阅者在订阅时会获取到绿色的数据

BehaviorSubject它可以给订阅者发送订阅前最后一个事件和订阅后发送的事件

```java
StringBuilder sb = new StringBuilder();
BehaviorSubject<Integer> behaviorSubject = BehaviorSubject.create();
behaviorSubject.onNext(1);
behaviorSubject.onNext(2);
behaviorSubject.onNext(22);
behaviorSubject.subscribe(new Consumer<Integer>() {

    @Override
    public void accept(Integer integer) throws Exception {
        LogUtil.i("RxJava2", "running num : " + integer);
        sb.append("running num : " + integer + "\n");
        mTextView7.setText(sb.toString());
    }
});
behaviorSubject.onNext(3);
behaviorSubject.onNext(4);
behaviorSubject.onNext(5);
```

结果：

```
07-16 16:28:19.189 2796-2796/me.hacket.assistant I/hacket.RxJava2: running num : 22
07-16 16:28:19.190 2796-2796/me.hacket.assistant I/hacket.RxJava2: running num : 3
07-16 16:28:19.191 2796-2796/me.hacket.assistant I/hacket.RxJava2: running num : 4
    running num : 5
```

#### BehaviorSubject应用

##### RxBus

```java
public class RxBus<Msg> {
    private final Subject<AbsBusMessage<Msg>> stickyBus; // 黏性事件
    private static RxBus INSTANCE = new RxBus();
    private RxBus() {
        stickyBus = BehaviorSubject
                .<AbsBusMessage<Msg>>create()
                .<AbsBusMessage<Msg>>toSerialized();
    }
    // ...
}
```

##### RxLifecycle使用了BehaviorSubject

##### 实现预加载？RxPreloader

使用BehaviorSubject来实现预加载<br>[https://www.jianshu.com/p/99bd603881bf#4. PublishSubject](https://www.jianshu.com/p/99bd603881bf#4.%20PublishSubject)

```java
public class RxPreLoader<T> {
    // 能够缓存订阅之前的最新数据
    private BehaviorSubject<T> mBehaviorSubject;
    private Disposable preDisposable;
    private Disposable disposable;
    private RxPreLoader(@NonNull Observable<T> preloadObservable) {
        mBehaviorSubject = BehaviorSubject.create();
        preDisposable = preloadObservable
            .subscribe(
                data -> {
                    if (mBehaviorSubject != null) {
                        publish(data);
                    }
                },
                throwable -> {
                    // nothing to do
                    if (mBehaviorSubject != null) {
                        mBehaviorSubject.onError(throwable);
                    }
                },
                () -> {
                    if (mBehaviorSubject != null) {
                        mBehaviorSubject.onComplete();
                    }
                });
    }
    public static <T> RxPreLoader<T> preLoad(@NonNull Observable<T> preloadObservable) {
        return new RxPreLoader<>(preloadObservable);
    }
    /**
    * 发送事件
    */
    private void publish(T data) {
        mBehaviorSubject.onNext(data);
    }
    public Disposable subscribe(Consumer<T> onNext) {
        disposable = mBehaviorSubject.subscribe(onNext);
        return disposable;
    }
    public Disposable subscribe(DisposableObserver<T> observer) {
        disposable = mBehaviorSubject.subscribeWith(observer);
        return disposable;
    }
    public Disposable subscribe(ResourceObserver<T> observer) {
        disposable = mBehaviorSubject.subscribeWith(observer);
        return disposable;
    }
    /**
	* 反订阅
	*/
    public void dispose() {
        if (preDisposable != null && !preDisposable.isDisposed()) {
            preDisposable.dispose();
            preDisposable = null;
        }

        if (disposable != null && !disposable.isDisposed()) {
            disposable.dispose();
            disposable = null;
        }
    }
    /**
    * 获取缓存数据的Subject
    */
    public BehaviorSubject<T> getCacheDataSubject() {
        return mBehaviorSubject;
    }
	/**
	 * 直接获取最近的一个数据
	 */
    @Nullable
    public T getCacheData() {
        return mBehaviorSubject.getValue();
    }
}
```

### ReplaySubject

RelaySubject会发射所有来自原始Observable的数据给观察者，无论他们是何时订阅的。<br>除了可以限制缓存数据的数量，还能限制缓存的时间，使用`createWithTime()`。

```java
ReplaySubject<String> subject = ReplaySubject.create();
subject.onNext("replaySubject1");
subject.onNext("replaySubject2");

subject.subscribe(new Consumer<String>() {
    @Override
    public void accept(@NonNull String s) throws Exception {
        System.out.println("replaySubject:"+s);
    }
}, new Consumer<Throwable>() {
    @Override
    public void accept(@NonNull Throwable throwable) throws Exception {
        System.out.println("replaySubject onError");  //不输出（异常才会输出）
    }
}, new Action() {
    @Override
    public void run() throws Exception {
        System.out.println("replaySubject:complete");  //输出 replaySubject onComplete
    }
});

subject.onNext("replaySubject3");
subject.onNext("replaySubject4");
```

执行结果：

```
replaySubject:replaySubject1
replaySubject:replaySubject2
replaySubject:replaySubject3
replaySubject:replaySubject4
```

稍微改一下代码，将create()改成`createWithSize(1)`只缓存订阅前最后发送的1条数据：

```java
ReplaySubject<String> subject = ReplaySubject.createWithSize(1);
subject.onNext("replaySubject1"); // 只缓存订阅前一条数据，这条不会被缓存
subject.onNext("replaySubject2"); 

subject.subscribe(new Consumer<String>() {
    @Override
    public void accept(@NonNull String s) throws Exception {
        System.out.println("replaySubject:"+s);
    }
}, new Consumer<Throwable>() {
    @Override
    public void accept(@NonNull Throwable throwable) throws Exception {
        System.out.println("replaySubject onError");  //不输出（异常才会输出）
    }
}, new Action() {
    @Override
    public void run() throws Exception {
        System.out.println("replaySubject:complete");  //输出 replaySubject onComplete
    }
});

subject.onNext("replaySubject3");
subject.onNext("replaySubject4");
```

执行结果：

```
replaySubject:replaySubject2
replaySubject:replaySubject3
replaySubject:replaySubject4
```

这个执行结果跟BehaviorSubject是一样的。但是从并发的角度来看，ReplaySubject 在处理并发 subscribe() 和 onNext() 时会更加复杂。

### AsyncSubject

- Observer会接收AsyncSubject的onComplete()之前的最后一个数据，不管你什么时候订阅。
- subject.onComplete()必须要调用才会开始发送数据，否则Subscriber将不接收任何数据。

```java
AsyncSubject<String> subject = AsyncSubject.create();
subject.onNext("asyncSubject1");
subject.onNext("asyncSubject2");
subject.onComplete();
subject.subscribe(new Consumer<String>() {
    @Override
    public void accept(@NonNull String s) throws Exception {
        System.out.println("asyncSubject:"+s);
    }
}, new Consumer<Throwable>() {
    @Override
    public void accept(@NonNull Throwable throwable) throws Exception {
        System.out.println("asyncSubject onError");  //不输出（异常才会输出）
    }
}, new Action() {
    @Override
    public void run() throws Exception {
        System.out.println("asyncSubject:complete");  //输出 asyncSubject onComplete
    }
});
subject.onNext("asyncSubject3");
subject.onNext("asyncSubject4");
```

结果：

```
syncSubject:asyncSubject2
asyncSubject:complete
```

改一下代码，将subject.onComplete()放在最后。

```java
AsyncSubject<String> subject = AsyncSubject.create();
subject.onNext("asyncSubject1");
subject.onNext("asyncSubject2");

subject.subscribe(new Consumer<String>() {
    @Override
    public void accept(@NonNull String s) throws Exception {
        System.out.println("asyncSubject:"+s);
    }
}, new Consumer<Throwable>() {
    @Override
    public void accept(@NonNull Throwable throwable) throws Exception {
        System.out.println("asyncSubject onError");  //不输出（异常才会输出）
    }
}, new Action() {
    @Override
    public void run() throws Exception {
        System.out.println("asyncSubject:complete");  //输出 asyncSubject onComplete
    }
});

subject.onNext("asyncSubject3");
subject.onNext("asyncSubject4");
subject.onComplete();
```

结果：

```
asyncSubject:asyncSubject4
asyncSubject:complete
```

### Subject注意点

#### 1、不是线程安全

Subject 并不是线程安全的，如果想要其线程安全需要调用`toSerialized()`方法。(在RxJava1.x的时代还可以用 SerializedSubject 代替 Subject，但是在RxJava2.x以后SerializedSubject不再是一个public class）<br>然而，很多基于 EventBus 改造的 RxBus 并没有这么做，包括我以前也写过这样的 RxBus :( 。这样的做法是非常危险的，因为会遇到并发的情况。

#### 2、子线程中发射数据可能错过事件

```kotlin
hk_button4.setOnClickListener {
    var subject = PublishSubject.create<String>()
    subject.onNext("publicSubject1")
    subject.onNext("publicSubject2")

    subject.subscribeOn(Schedulers.io())
            .subscribe(
                    {
                        LogUtil.logi("hacket", "onNext", "publicSubject:$it")
                    },
                    {
                        LogUtil.logw("hacket", "onError", "publicSubject onError")  //不输出（异常才会输出）
                    }
                    ,
                    {
                        LogUtil.logi("hacket", "onComplete", "publicSubject:complete")  //输出 publicSubject onComplete

                    })

    subject.onNext("publicSubject3")
    subject.onNext("publicSubject4")
    subject.onComplete()
    subject.onNext("publicSubject5")
}
```

结果：

```
onComplete】publicSubject:complete，线程：RxCachedThreadScheduler-1，日期：2018-10-08 20:01:42
```

subject 发射元素的线程被指派到了 IO 线程，此时 IO 线程正在初始化还没起来，subject 发射前这两个元素publicSubject3、publicSubject4还在主线程中，主线程的这两个元素往 IO 线程转发的过程中由于 IO 线程还没有起来，所以就被丢弃了

#### 3、Subject遇到onError时中断

Subject所以在onNext方法中一旦出现了error。那么所有的Subscriber都将和这个subject断开了链接。这里也可以用 RxRelay 代替Subject，简单来说`RxRelay`就是一个没有onError和onComplete的Subject

## Processor

和Subject作用相同，不同的是Processor支持背压。
