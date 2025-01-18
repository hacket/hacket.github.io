---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# create分析

## create无其他操作符，无切换线程原理分析

看看create的使用案例：

```java
Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> emitter) throws Exception {
            emitter.onNext("hacket");
            emitter.onComplete();
        }
    }).subscribe(new Observer<String>() {
        @Override
        public void onSubscribe(@NonNull Disposable d) {
            System.out.println("onSubscribe");
        }
        @Override
        public void onNext(@NonNull String s) {
            System.out.println("onNext:" + s);
        }
        @Override
        public void onError(@NonNull Throwable e) {
            e.printStackTrace();
            System.out.println("onError:" + e.getMessage());
        }
        @Override
        public void onComplete() {
            System.out.println("onComplete");
        }
    });
}
```

输出：

```
onSubscribe
onNext:hacket
onComplete
```

要分析原理，我们分2部分来看看：Observable的创建和subscribe

首先看Observable的创建部分，Observable.create：

```java
public static <T> Observable<T> create(ObservableOnSubscribe<T> source) {
    ObjectHelper.requireNonNull(source, "source is null"); // 判断source不为null
    return RxJavaPlugins.onAssembly(new ObservableCreate<T>(source)); 
}
```

1. 判断source不为null
2. RxJavaPlugins.onAssembly，RxJava提供的全局hook操作符的入口，如果设置了保存在onObservableAssembly
3. new了一个ObservableCreate，并把source传递进去

source是什么呢？

```java
public interface ObservableOnSubscribe<T> {
    void subscribe(@NonNull ObservableEmitter<T> emitter) throws Exception;
}
```

ObservableOnSubscribe是一个拥有subscribe的接口，接收一个ObservableEmitter实例

下面看看ObservableCreate：

```java
public final class ObservableCreate<T> extends Observable<T> {
    final ObservableOnSubscribe<T> source;
    public ObservableCreate(ObservableOnSubscribe<T> source) {
        this.source = source;
    }
    // ...
}
```

这里只是将source作为一个成员变量保存在ObservableCreate类中

到这里可以看到，create操作就是创建一个ObservableCreate对象。

下面看subscribe订阅，从上面可以知道，返回的Observable就是一个ObservableCreate对象，那么subscribe也是调用的ObservableCreate的subscribe()方法，而ObservableCreate又是继承Observable

```java
// Observable
public final void subscribe(Observer<? super T> observer) {
    ObjectHelper.requireNonNull(observer, "observer is null");
    try {
        // 全局hook onSubscribe
        observer = RxJavaPlugins.onSubscribe(this, observer)
        // 最后调用subscribeActual，这个方式是个抽象的
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

subscribe做了如下操作：

1. 回调全局的onObservableSubscribe并判断返回的Observer部位null
2. 调用抽象方法subscribeActual，这个方法由具体子类实现，这里是ObservableCreate

最终调用的是ObservableCreate的subscribeActual：

```java
public final class ObservableCreate<T> extends Observable<T> {
    final ObservableOnSubscribe<T> source;
    public ObservableCreate(ObservableOnSubscribe<T> source) {
        this.source = source;
    }
    @Override
    protected void subscribeActual(Observer<? super T> observer) {
        // CreateEmitter
        CreateEmitter<T> parent = new CreateEmitter<T>(observer);
        // 调用Observer的onSubscribe，传递parent
        observer.onSubscribe(parent);
        try {
            source.subscribe(parent); // 就是我们代码写的匿名内部类的subscribe方法
        } catch (Throwable ex) {
            Exceptions.throwIfFatal(ex);
            parent.onError(ex);
        }
    }
    static final class CreateEmitter<T> extends AtomicReference<Disposable> implements ObservableEmitter<T>, Disposable {
        final Observer<? super T> observer;
        CreateEmitter(Observer<? super T> observer) {
            this.observer = observer;
        }
        @Override
        public void onNext(T t) {
            if (!isDisposed()) {
                observer.onNext(t);
            }
        }
        @Override
        public void onComplete() {
            if (!isDisposed()) {
                try {
                    observer.onComplete();
                } finally {
                    dispose();
                }
            }
        }
        // ...
    }
}
```

1. 创建了一个CreateEmitter
2. 回调Observer的onSubscribe(Disposable)方法，代表订阅成功了
3. 调用create代码中写的匿名内部类的subscribe方法

在ObservableOnSubscribe的subscribe中我们调用了：

```java
emitter.onNext("hacket");
emitter.onComplete();
```

其实就是调用了上面CreateEmitter的onNext和onComplete方法，最后调用的是Observer的onNext和onComplete方法。

# RxJava原理分析

## RxJava原理-简单的链式调用（无线程切换）

示例代码：

```java
Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
            System.out.println("subscribe > " + Thread.currentThread().getName());
            emitter.onNext("test");
            emitter.onComplete();
        }
    }).flatMap(new Function<String, ObservableSource<String>>() {
        public ObservableSource<String> apply(@NonNull String s) throws Exception {
            return Observable.just(s);
        }
    }).map(new Function<String, Integer>() {
        @Override
        public Integer apply(@NonNull String s) throws Exception {
            return 0;
        }
    }).subscribe(new Observer<Integer>() {
        @Override
        public void onSubscribe(@NonNull Disposable d) {
            System.out.println("onSubscribe > " + Thread.currentThread().getName());
        }

        @Override
        public void onNext(@NonNull Integer integer) {
            System.out.println("onNext > " + Thread.currentThread().getName());
        }
        @Override
        public void onError(@NonNull Throwable e) {
            System.out.println("onError > " + Thread.currentThread().getName());
        }
        @Override
        public void onComplete() {
            System.out.println("onComplete > " + Thread.currentThread().getName());
        }
    });
```

输出：

```
onSubscribe > main
subscribe >  main
onNext >  main
onComplete >  main
```

整体代码执行流程：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687615086075-a083e208-8076-4c36-8e0b-c23c7aff8b90.png#averageHue=%23f6f5f4&clientId=u155159f8-4bb5-4&from=paste&height=414&id=u9e545e66&originHeight=828&originWidth=1830&originalType=binary&ratio=2&rotation=0&showTitle=false&size=454994&status=done&style=none&taskId=u4ddafbe7-f5a3-4ce8-a2eb-d0685cbfd79&title=&width=915)<br />![](https://note.youdao.com/yws/res/72477/BCAA6B0D21F4466B86CA02A8355BCD52#id=rep4T&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 数据源的包裹封装（正向）

正向数据源包裹封装：

```
ObservableOnSubscribe → ObservableCreate → ObservableFlatMap → ObservableMap
```

---

#### create(ObservableCreate)

先看Observable.create，new一个ObservableCreate，保存source（类型ObservableOnSubscribe）为成员变量

```java
public static <T> Observable<T> create(ObservableOnSubscribe<T> source) {
   ObjectHelper.requireNonNull(source, "source is null");
   return RxJavaPlugins.onAssembly(new ObservableCreate<T>(source));
}
```

ObservableCreate 内部包含一个类型为`ObservableOnSubscribe<T>`的 source 变量，source就是上面create操作符new出来的匿名内部类。现在看看ObservableCreate：

```java
public final class ObservableCreate<T> extends Observable<T> {
    final ObservableOnSubscribe<T> source;
    public ObservableCreate(ObservableOnSubscribe<T> source) {
        this.source = source;
    }
    @Override
    protected void subscribeActual(Observer<? super T> observer) {
        // ...
    }
    // ...
}
```

#### flatMap(ObservableFlatMap)

接下来看flatMap，new一个ObservableFlatMap，

```java
public final <R> Observable<R> flatMap(Function<? super T, ? extends ObservableSource<? extends R>> mapper, boolean delayErrors, int maxConcurrency, int bufferSize) {
    // ...
    return RxJavaPlugins.onAssembly(new ObservableFlatMap<T, R>(this, mapper, delayErrors, maxConcurrency, bufferSize));
}
```

调用flatMap的为前面create创建出来的ObservableCreate。现在看看ObservableFlatMap：

```java
public final class ObservableFlatMap<T, U> extends AbstractObservableWithUpstream<T, U> {
    final Function<? super T, ? extends ObservableSource<? extends U>> mapper;
    // ...
    public ObservableFlatMap(ObservableSource<T> source, Function<? super T, ? extends ObservableSource<? extends U>> mapper, boolean delayErrors, int maxConcurrency, int bufferSize) {
        super(source);
        this.mapper = mapper;   
        // ...
    }
}
```

ObservableFlatMap内部持有一个类型为`ObservableSource<T>`的source变量，而该source则是上一步中的ObservableCreate实例。ObservableFlatMap内部还持有一个类型为Function的mapper，这个就是上面代码flatMap的匿名内部类`Function<String,ObservableSource<String>>`。

#### map(ObservableMap)

最后是map操作符，new了一个ObservableMap

```java
public final <R> Observable<R> map(Function<? super T, ? extends R> mapper) {
    ObjectHelper.requireNonNull(mapper, "mapper is null");
    return RxJavaPlugins.onAssembly(new ObservableMap<T, R>(this, mapper));
}
```

看看ObservableMap：

```java
public final class ObservableMap<T, U> extends AbstractObservableWithUpstream<T, U> {
    final Function<? super T, ? extends U> function;
    public ObservableMap(ObservableSource<T> source, Function<? super T, ? extends U> function) {
        super(source);
        this.function = function;
    }
    // ...
}
```

看看ObservableMap内部持有一个类型为`ObservableSource<T>`的source变量，而该source则是上一步中的ObservableFlatMap实例。ObservableMap内部还持有了一个类型为Function的function，这个就是上面代码map的匿名内部类`Function<String,Integer>`。

到此，数据源的包裹封包完毕，下面是subscribe订阅部分。

#### 小结

1. 操作符xxx，都存在着对应的`ObservableXxx`类，如create对应ObservableCreate，map对应ObservableMap，flapMap对应ObservableFlatMap
2. create→flatMap→map层层封装包裹；后面的操作符，持有前面操作符对应的实例；如ObservableMap持有的source为ObservableCreate，ObservableMap持有的source为ObservableFlatMap
3. 每个操作符对应的类都持有了各自的功能，如create是`ObservableOnSubscribe<T>`，被Observer订阅后，通过ObservableEmitter发送数据；flatMap是`Function<? super T, ? extends ObservableSource<? extends U>>`，输入为T，输出为`ObservableSource<U>`的Function；map是`Function<? super T, ? extends U>`，输入为T，输出为U的Function

### 订阅数据源（逆向）subscribe

逆向订阅流程：

```java
ObservableMap.subscribe(Observer) →  // .subscribe(Observer)
ObservableFlatMap.subscribe(MapObserver) →  // .map()
ObservableCreate.subscribe(MergerObserver) → // .flatMap
ObservableOnSubscribe.subscribe(CreateEmitter(MergerObserver)) // .create
```

---

以上的代码调用并没有出发数据的流转，只有当我们调用`subscribe`时才真正触发了RxJava的数据流。而调用subscribe的Observable是最后的map操作符对应的ObservableMap。

```java
public final void subscribe(Observer<? super T> observer) {
    ObjectHelper.requireNonNull(observer, "observer is null");
    try {
        observer = RxJavaPlugins.onSubscribe(this, observer);
        ObjectHelper.requireNonNull(observer, "Plugin returned null Observer");
        // 发生订阅的核心方法，这是一个抽象方法，由具体操作符对应的ObservableXxx实现
        subscribeActual(observer);
    } catch (NullPointerException e) { // NOPMD
        throw e;
    } catch (Throwable e) {
        // ...
        throw npe;
    }
}
```

订阅调用的是subscribeActual，执行subscribeActual的对象其实是ObservableMap。

#### ObservableMap#subscribeActual

上面示例中调用subscribe后，调用的就是`ObservableMap#subscribeActual()`，现在看看ObservableMap的subscribeActual：

```java
public final class ObservableMap<T, U> extends AbstractObservableWithUpstream<T, U> {
    // ...
    @Override
    public void subscribeActual(Observer<? super U> t) {
        source.subscribe(new MapObserver<T, U>(t, function));
    }
    // ...
}
```

1. source为前面分析的ObservableFlatMap
2. new了一个MapObserver，t为上面示例代码中一个Observer匿名内部类，真正的Observer；function前面已经分析
3. 调用了subscribe，Observer为MapObserver，最终又调用到了FlatMapObservable的subscribeActual

> 其实相当于ObservableFlatMap.subscribe(MapObserver)

#### ObservableFlatMap#subscribeActual

现在看看`ObservableFlatMap#subscribeActual`：

```java
public final class ObservableFlatMap<T, U> extends AbstractObservableWithUpstream<T, U> {
    // ...
    public void subscribeActual(Observer<? super U> t) {
        // ...
        source.subscribe(new MergeObserver<T, U>(t, mapper, delayErrors, maxConcurrency, bufferSize));
    }
    // ...
}
```

1. source为ObservableCreate
2. t为MapObserver
3. 创建了一个MergeObserver

> 其实相当于ObservableCreate.subscribe(MergeObserver)

#### ObservableCreate#subscribeActual

现在看`ObservableCreate#subscribeActual`：

```java
public final class ObservableCreate<T> extends Observable<T> {
    final ObservableOnSubscribe<T> source;
    public ObservableCreate(ObservableOnSubscribe<T> source) {
        this.source = source;
    }
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
}
```

1. source为ObservableOnSubscribe，即传递给create的匿名内部类
2. observer为MergeObserver

> 相当于ObservableOnSubscribe.subscribe(MergeObserver)

### 触发数据源产生原始数据，数据流转 onNext/onComplete

当订阅发生在最顶层时，也就是 ObservableCreate 中的 subscribeActual ，此时触发了数据源的产生，通过 emitter 发射数据：

```java
public final class ObservableCreate<T> extends Observable<T> {
    // ...
    @Override
    protected void subscribeActual(Observer<? super T> observer) {
        CreateEmitter<T> parent = new CreateEmitter<T>(observer);
        observer.onSubscribe(parent); // 此时触发了onSubscribe回调
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

调用source.subscribe(parent)，其实就是调用上面示例中的匿名内部类ObservableOnSubscribe

```java
new ObservableOnSubscribe<String>() {
    @Override
    public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
        System.out.println("subscribe > " + Thread.currentThread().getName());
        emitter.onNext("test");
        emitter.onComplete();
    }
}
```

再来看 CreateEmitter 的实现：

```java
static final class CreateEmitter<T> extends AtomicReference<Disposable> implements ObservableEmitter<T>, Disposable {
    final Observer<? super T> observer;
    CreateEmitter(Observer<? super T> observer) {
        this.observer = observer;
    }
    @Override
    public void onNext(T t) {
        // ...
        if (!isDisposed()) {
            observer.onNext(t);  // 向下层分发数据
        }
    }
    // ...
  }
```

根据我们上面的分析CreateEmitter中持有的observer是FlatMapObserver的实例，而 FlatMapObserver 调用 onNext 时，又会调用 MapObserver 的 onNext ，依次调用至我们自己实现的观察者的 onNext处理数据，此时数据流转完毕。

### 小结

1. `操作符`对应产生的被观察者和观察者命名规则很有规律，比如说被观察者的命名 `Observable + 操作符` ，例如 ObservableMap = Observable + map；观察者命名大多遵循 `操作符 + Observer` ，例如 FlatMapObserver = flatMap + Observer。
2. 一个是按照代码顺序的操作符产生了一个一层层的数据源包裹（蓝色虚线的流程部分）
3. 另外一个是在逆向订阅时，将观察者按照订阅顺序打包成一个一层层的观察者包裹（上部分的红色流程部分）

## 线程切换，subscribeOn，无observeOn

```java
new Thread() {
    @Override
    public void run() {
        Observable
                .create(new ObservableOnSubscribe<String>() {
                    @Override
                    public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
                        System.out.println("subscribe >  " + Thread.currentThread().getName());
                        emitter.onNext("test");
                        emitter.onComplete();
                    }
                })
                .subscribeOn(Schedulers.io())
                .map(new Function<String, Integer>() {
                    @Override
                    public Integer apply(@NonNull String s) throws Exception {
                        return 1;
                    }
                })
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Observer<Integer>() {
                    @Override
                    public void onSubscribe(@NonNull Disposable d) {
                        System.out.println("onSubscribe > " + Thread.currentThread().getName());
                    }

                    @Override
                    public void onNext(@NonNull Integer integer) {
                        System.out.println("onNext >  " + integer + " " + Thread.currentThread().getName());
                    }

                    @Override
                    public void onError(@NonNull Throwable e) {
                        e.printStackTrace();
                        System.out.println("onError >  " + Thread.currentThread().getName());
                    }

                    @Override
                    public void onComplete() {
                        System.out.println("onComplete >  " + Thread.currentThread().getName());
                    }
                });
    }
}.start();
```

输出：

```java
onSubscribe > Thread-0
subscribe >  RxCachedThreadScheduler-1
onNext >  1 main
onComplete >  main
```

### 数据源的包裹封装（正向）

```java
ObservableOnSubscribe → ObservableCreate → ObservableSubscribeOn → ObservableMap → ObservableObserveOn
```

### 订阅数据源（逆向）subscribe

#### 单个subscribeOn示例1，subscribeOn在最后

```java
Observable.create()
    .map()
    .subscribeOn(Schedulers.newThread())
     .subscribe()
```

订阅流程：

```java
ObservableSubscribeOn.subscribe(Observer) ↓ // .subscribe() 在当前线程
ObservableMap.subscribe(SubscribeOnObserver) ↓ // subscribeOn 这里发生了线程切换，上游的订阅全部发生在该线程
ObservableCreate.subscribe(MapObserver) ↓ // .map()
ObservableOnSubscribe.subscribe(CreateEmitter(MapObserver)) // .create()
```

可以看到，在subscribeOn调用后，上游的map和create都是订阅在newThread线程。后续的事件发送都会在该线程

#### 单个subscribeOn示例2，subscribeOn在中间

```java
thread {
    Observable.create()
        .map() // 1
        .subscribeOn(Schedulers.newThread())
        .map() // 2
        .subscribe()
}
```

输出：

```
onSubscribe > Thread-0
subscribe >  RxNewThreadScheduler-1
map1 > RxNewThreadScheduler-1
map2 > RxNewThreadScheduler-1
onNext >  2 RxNewThreadScheduler-1
onComplete >  RxNewThreadScheduler-1
```

1. 数据源包裹封装

```java
ObservableOnSubscribe → ObservableCreate → ObservableMap → ObservableSubscribeOn → ObservableMap
```

2. 定义数据源

```java
ObservableMap.subscribe(Observer) ↓ // .subscribe()
ObservableSubscribeOn.subscribe(MapObserver) ↓ // .map() 
ObservableMap.subscribe(SubscribeOnObserver) ↓  // subscribeOn() 这里发生了线程切换
ObservableCreate.subscribe(MapObserver) ↓ // .map()
ObservableOnSubscribe.subscribe(CreateEmitter(MapObserver)) // .create()
```

可以看到，在subscribeOn调用后，上游的map和create都是订阅在newThread线程。后续的事件发送都会在该线程。可以看到subscribeOn写在哪里无所谓的。

### 数据流转 onNext/onComplete

create数据源在什么线程，后面调用的onNext都是在这个线程中。

### subscribeOn总结

#### subscribeOn只生效一次？为什么subscribeOn只有第一次有效？

subscribeOn通过切换订阅线程，改变Observable.create所在线程，从而影响数据的发射线程。由于订阅过程自下而上，所以Observable.create只受最近一次subscribeOn影响，当调用链中有多个subscribeOn时只有第一个有效。其他subscibeOn仍然可以影响其上游的`doOnSubscribe`的执行线程。

```kotlin
@Test
fun test() {
    Observable.create<Unit> { emitter ->
        log("onSubscribe")
        emitter.onNext(Unit)
        emitter.onComplete()
    }.subscribeOn(namedScheduler("1 - subscribeOn"))
        .doOnSubscribe { log("1 - doOnSubscribe") }
        .subscribeOn(namedScheduler("2 - subscribeOn"))
        .doOnSubscribe { log("2 - doOnSubscribe") }
        .doOnNext { log("onNext") }
        .test().awaitTerminalEvent() // Wait until observable completes
}
```

![](https://note.youdao.com/yws/res/72852/B4CF003F31A1476386965B9B4C05CD1C#id=rfJaz&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687615125394-d6af4ac5-e741-4d56-9304-c2744334b551.png#averageHue=%23464646&clientId=u155159f8-4bb5-4&from=paste&height=280&id=ued7e0e11&originHeight=560&originWidth=1858&originalType=binary&ratio=2&rotation=0&showTitle=false&size=366866&status=done&style=none&taskId=u11ae359f-9f7e-48ec-b18d-c52c5e9892f&title=&width=929)

类似的问题：

1. subscribeOn是离数据源近的有效还是远的有效？

订阅是反向订阅，离数据源最近的有效，最近的会覆盖掉后面的subscribeOn
2.  为什么subscribeOn写在map前面和后面都是一样？

subscribeOn只有一次有效，写哪里都一样
3.  为什么subscribeOn写在observeOn也可以？

#### subscribeOn用来决定订阅线程，但这并不意味着上游数据一定来自此线程

```kotlin
@Test
fun test() {
    val observable = Observable.create<Int> { emitter ->
        log("onSubscribe")
        thread(name = "Main thread", isDaemon = false) {
            log("1 - emitting"); emitter.onNext(1)
            log("2 - emitting"); emitter.onNext(2)
            log("3 - emitting"); emitter.onNext(3)
            emitter.onComplete()
        }
    }
    observable
        .subscribeOn(Schedulers.computation())
        .doOnNext { log("$it - after subscribeOn") }
        .test().awaitTerminalEvent() // Wait until observable completes
}
```

![](https://note.youdao.com/yws/res/72869/A4B5546E189A42C8A7222179FB779813#id=l8laW&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687615159435-dca63e54-ce5a-4380-a060-d932c88c5f56.png#averageHue=%23424242&clientId=u155159f8-4bb5-4&from=paste&height=450&id=u82c1aea7&originHeight=900&originWidth=1840&originalType=binary&ratio=2&rotation=0&showTitle=false&size=604088&status=done&style=none&taskId=u6c1b8db8-c377-4abe-91c1-d6308189283&title=&width=920)

subscribeOn支持决定订阅线程，但这并不意味着上游数据一定来自此线程，这是因为发送数据onNext/onComplete/onError也在其他线程中运行。

#### 对于PublishSubject无效

```kotlin
@Test
fun test() {
    val subject = PublishSubject.create<Int>()
    val observer1 = subject
        .subscribeOn(Schedulers.io())
        .doOnNext { log("$it - I want this happen on an IO thread") }
        .test()
    val observer2 = subject
        .subscribeOn(Schedulers.newThread())
        .doOnNext { log("$it - I want this happen on a new thread") }
        .test()

    sleep(10); 
    subject.onNext(1)
    subject.onNext(2)
    subject.onNext(3)
    subject.onComplete()

    observer1.awaitTerminalEvent()
    observer2.awaitTerminalEvent()
}
```

![](https://note.youdao.com/yws/res/72881/FB6A9D8172CB4015ADD733B7504D27CF#id=PDbvV&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687615168548-dde4cda8-2177-43a8-835c-8ec40238c874.png#averageHue=%234a4a4a&clientId=u155159f8-4bb5-4&from=paste&height=352&id=u123365ec&originHeight=704&originWidth=1852&originalType=binary&ratio=2&rotation=0&showTitle=false&size=556040&status=done&style=none&taskId=u80026316-3ca1-4216-a713-9d86a45aaa6&title=&width=926)

对于PublishSubject来说，上游数据来自哪个线程是在onNext时决定的，所以对一个PublishSubject使用使用subscribeOn没有意义。

#### 对于Observable.just()无效

```java
private static void testJust() {
    Observable.just(getJustData())
        .subscribeOn(Schedulers.io())
        .subscribe(new Consumer<String>() {
            @Override
            public void accept(String s) throws Exception {
                System.out.println("accept :" + s + " " + Thread.currentThread().getName());
            }
        });
}
private static String getJustData() {
    System.out.println("getJustData :" + Thread.currentThread().getName());
    return "just data";
}
```

输出：

```
getJustData :main
accept :just data RxCachedThreadScheduler-1
```

如上，getJustData() 放在just中显然是不合适的。just()在当前线程立即执行，因此不受subscribeOn影响，应该修改如下：

```java
private static void testJust2() {
    Observable
            .defer(new Callable<ObservableSource<String>>() {
                @Override
                public ObservableSource<String> call() throws Exception {
                    return Observable.just(getJustData());
                }
            })
            .subscribeOn(Schedulers.io())
            .subscribe(new Consumer<String>() {
                @Override
                public void accept(String s) throws Exception {
                    System.out.println("accept :" + s + " " + Thread.currentThread().getName());
                }
            });
    // 或者
    Observable.fromCallable(new Callable<String>() {
            @Override
            public String call() throws Exception {
                return getJustData();
            }
        })
        .subscribeOn(Schedulers.io())
        .subscribe(new Consumer<String>() {
            @Override
            public void accept(String s) throws Exception {
                System.out.println("accept :" + s + " " + Thread.currentThread().getName());
            }
        });
}
```

输出：

```
getJustData :RxCachedThreadScheduler-1
accept :just data RxCachedThreadScheduler-1
```

#### 使用flatMap处理并发

```java
private static void testFlatMap() {
    List<String> list = new ArrayList<>();
    list.add("id1");
    list.add("id2");
    list.add("id3");
    Observable.fromIterable(list)
            .flatMap(new Function<String, ObservableSource<String>>() {
                @Override
                public ObservableSource<String> apply(@NonNull String s) throws Exception {
                    System.out.println("flatMap apply " + s + "," + Thread.currentThread().getName());
                    return toUpperCase(s);
                }
            })
            .subscribeOn(Schedulers.io())
            .subscribe(new Consumer<String>() {
                @Override
                public void accept(String s) throws Exception {
                    System.out.println("subscribe accept " + s + "， " + Thread.currentThread().getName());
                }
            });
}
private static Observable<String> toUpperCase(String data) {
    return Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
            System.out.println("toUpperCase create " + data + "，" + Thread.currentThread().getName());
            emitter.onNext(data.toUpperCase());
        }
    });
}
```

输出：

```
flatMap apply id1,RxCachedThreadScheduler-1
toUpperCase create id1，RxCachedThreadScheduler-1
subscribe accept ID1， RxCachedThreadScheduler-1
flatMap apply id2,RxCachedThreadScheduler-1
toUpperCase create id2，RxCachedThreadScheduler-1
subscribe accept ID2， RxCachedThreadScheduler-1
flatMap apply id3,RxCachedThreadScheduler-1
toUpperCase create id3，RxCachedThreadScheduler-1
subscribe accept ID3， RxCachedThreadScheduler-1
```

如果我们希望多个toUpperCase(data)并发执行，上述写法是错误的。

subscribeOn决定了flatMap上游线程，flatMap返回多个Observable的订阅都是发生在此线程，多个toUpperCase只能运行在单一线程，无法实现并行。

想要达到并行执行效果，需要修改如下：

```java
private static Observable<String> toUpperCase(String data) {
    return Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
            System.out.println("toUpperCase create " + data + "，" + Thread.currentThread().getName());
            emitter.onNext(data.toUpperCase());
        }
    }).subscribeOn(Schedulers.newThread());
}
```

## 线程切换observeOn

示例：

```java
private static void testObserveOn() {
    new Thread() {
        @Override
        public void run() {
            Observable
                    .create(new ObservableOnSubscribe<String>() {
                        @Override
                        public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
                            System.out.println("create subscribe >  " + Thread.currentThread().getName());
                            new Thread() {
                                @Override
                                public void run() {
                                    super.run();
                                    emitter.onNext("create test");
                                    emitter.onComplete();
                                }
                            }.start();
                        }
                    })
                    .subscribeOn(Schedulers.io())
                    .map(s -> {
                        System.out.println("map1 > " + Thread.currentThread().getName());
                        return 1;
                    })
                    .subscribeOn(Schedulers.newThread())
                    .observeOn(Schedulers.computation())
                    .map(s -> {
                        System.out.println("map2 > " + Thread.currentThread().getName());
                        return 2;
                    })
                    .observeOn(Schedulers.single())
                    .subscribe(new Observer<Integer>() {
                        @Override
                        public void onSubscribe(@NonNull Disposable d) {
                            System.out.println("onSubscribe > " + Thread.currentThread().getName());
                        }

                        @Override
                        public void onNext(@NonNull Integer integer) {
                            System.out.println("onNext >  " + integer + " " + Thread.currentThread().getName());
                        }

                        @Override
                        public void onError(@NonNull Throwable e) {
                            System.out.println("onError >  " + Thread.currentThread().getName());
                        }

                        @Override
                        public void onComplete() {
                            System.out.println("onComplete >  " + Thread.currentThread().getName());
                        }
                    });
        }
    }.start();
}
```

输出：

```
onSubscribe > Thread-0
create subscribe >  RxCachedThreadScheduler-1  // .subscribeOn(IO)
map1 > Thread-1 // new Thread
map2 > RxComputationThreadPool-1 // .observeOn(Schedulers.computation())
onNext >  2 RxSingleScheduler-1 // .observeOn(Schedulers.single())
onComplete >  RxSingleScheduler-1 // .observeOn(Schedulers.single())
```

代码简写：

```java
Observable.create()
    .subscribeOn(Schedulers.io())
    .map()
    .subscribeOn(Schedulers.newThread())
    .observeOn(Schedulers.computation())
    .map()
    .observeOn(Schedulers.single())
    .subscribe()
```

订阅流程：

```
ObservableObserveOn.subscribe(Observer) ↓  // .subscribe()
ObservableMap.subscribe(ObserveOnObserver) ↓ // .observeOn(Schedulers.single())，Observer中onNext发送数据时实现了线程切换
ObservableObserveOn.subscribe(MapObserver) ↓ // .map()
ObservableSubscribeOn.subscribe(ObserveOnObserver) ↓ // .observeOn(Schedulers.computation())，MapObserver中onNext发送数据时实现了线程切换
ObservableMap.subscribe(SubscribeOnObserver) ↓ // .subscribeOn(Schedulers.newThread())
ObservableSubscribeOn.subscribe(MapObserver) ↓ // .map()
ObservableCreate.subscribe(SubscribeOnObserver) ↓ // .subscribeOn(Schedulers.io())
ObservableOnSubscribe.subscribe(CreateEmitter(SubscribeOnObserver)) // .create()
```

原理分析：

```java
//ObservableObserveOn.java
final class ObservableObserveOn extends Observable<T> {
    @Override
    protected void subscribeActual(Observer<? super T> observer) {
        if (scheduler instanceof TrampolineScheduler) {
            source.subscribe(observer);
        } else { 
            Scheduler.Worker w = scheduler.createWorker();
            // 直接向上游订阅数据，不进行线程切换，切换操作在Observer中进行
            source.subscribe(new ObserveOnObserver<T>(observer, w, delayError, bufferSize));
        }
    }
    static final class ObserveOnObserver<T> implements Observer<T>, Runnable {
        @Override
        public void onNext(T t) {
            if (done) {
                return;
            }
            // 这里选把数据放到队列中，增加吞吐量，提高性能
            if (sourceMode != QueueDisposable.ASYNC) {
                queue.offer(t);
            }
            // 在schedule方法里进行线程切换并把数据循环取出
            // 回调给下游，下游会在指定的线程中收到数据
            schedule();
        }
        void schedule() {
            if (this.getAndIncrement() == 0) {
                // 切换线程
                this.worker.schedule(this);
            }
        }
    }
}
```

### observeOn总结

#### observeOn多次生效

不同于subscribeOn，observeOn可以有多个而且每个都会生效

1. subscribeOn切换的线程可以通过doOnSubscribe监听
2. observeOn切换的线程可以通过doOnNext监听

## 总结

1. 创建Observable是一层包裹一层，后面的操作符会持有前面操作符对应的Observable对象
2. 订阅时是个逆向的，从最后的操作符订阅
3. subscribeOn切换订阅时的线程，不能保证数据发送的线程就在该线程
4. observeOn切换数据发送(onNext)所在的线程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687615190796-60d7001d-7987-426b-a0bd-134154aad001.png#averageHue=%23f5f4f4&clientId=u155159f8-4bb5-4&from=paste&height=357&id=u555b4d1c&originHeight=714&originWidth=1838&originalType=binary&ratio=2&rotation=0&showTitle=false&size=489857&status=done&style=none&taskId=ud01ad2ca-2307-465f-836b-245c6a5bf08&title=&width=919)<br />![](https://note.youdao.com/yws/res/72992/01AFE83A8A8842A480924923DBD322D1#id=eAGoL&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## Ref

- [x] 两张图彻底理解 RxJava2 的核心原理<br /><http://solart.cc/2020/06/16/understand_rxjava2/>
