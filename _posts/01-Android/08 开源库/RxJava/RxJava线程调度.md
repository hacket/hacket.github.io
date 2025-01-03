---
date created: 2024-12-24 00:37
date updated: 2024-12-25 00:17
dg-publish: true
---

# RxJava线程调度

## 调度器分类

RxJava 使用 subscribeOn、observeOn 和 onNext 的时候可以改变和切换线程，它们都是按顺序执行的，不是并发执行，至多也就切换到另外一个线程，如果它中间的操作是阻塞的，久会影响整个 Rx 的执行

| 调度器类型                          | 作用                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schedulers.computation()       | 线程有上限。用于计算任务，如事件循环或和回调处理，不要用于 IO 操作，默认线程数等于处理器的数量。它也是许多 RxJava 方法的默认调度器：buffer(),debounce(),delay(),interval(),sample(),skip()。                                        |
| Schedulers.io()                | 线程无上限；用于 IO 密集型任务，如异步阻塞 IO 操作（读写文件、读写数据库、网络信息交互等），这个调度器的线程池会根据需要增长；对于普通的计算任务，请使用 Schedulers.computation()；Schedulers.io() 默认是一个 CachedThreadScheduler，很像一个有线程缓存的新线程调度器 |
| Schedulers.immediate()         | 这个调度器允许你立即在当前线程执行你指定的工作。它是 timeout(),timeInterval(), 以及 timestamp() 方法默认的调度器                                                                                           |
| Schedulers.newThread()         | 为每个任务创建一个新线程，它是没有线程池在管理的                                                                                                                                               |
| Schedulers.trampoline()        | 为当前线程建立一个队列，将当前任务加入到队列中依次执行。当其它排队的任务完成后，在当前线程排队开始执行                                                                                                                    |
| Schedulers.from(executor)      | 使用指定的 Executor 作为调度器                                                                                                                                                   |
| AndroidSchedulers.mainThread() | 在主线程中工作                                                                                                                                                                |

io 和 computation，因为它们两个都是依赖线程池来维护线程的，区别就是 io 线程池中的个数是无限的，由 AtomicLongFieldUpdater 产生的递增值和 prefix 来决定线程的名字；而 computation 中则是一个固定线程数量的线程池，数据为 cpu 个数，并且不要把 I/O 操作放在 computation() 中，否则 I/O 操作的等待时间会浪费 CPU。<br />所以我们在使用时，需要注意，控制 io 线程的数量，如果你使用了大量的线程的话，可能会导致 OutOfMemory 等资源用尽的异常。<br />io() 的行为模式和 newThread() 差不多，区别在于 io() 的内部实现是是用一个无数量上限的线程池，可以重用空闲的线程，因此多数情况下 io() 比 newThread() 更有效率。不要把计算工作放在 io() 中，可以避免创建不必要的线程。

## observeOn

1. 如果后续没有 observeOn，则影响后续「操作符」和 Observer 的「onNext」、「onComplete」、「onError」方法的执行线程
2. 如果后续还有 observeOn，则影响两个 observeOn 之间操作符的执行线程
3. flatMap 内部执行 observeOn 来切换线程会影响外部的操作符执行线程，但不会影响外部的doOnComplete

## subscribeOn()

1. 第一次执行，影响「被观察者」以及「被观察者和第一个 observeOn」之间操作符的执行线程（包括 doOnSubscribe）
2. 第二次执行，只影响两个subscribeOn之间的doOnSubscribe
3. 对 flatMap、switchMap 内部新创建的 Observable 执行subscribeOn会影响外部后续操作符的执行线程，但是不会影响doOnSubscribe
4. interval不受subscribeOn影响？内部有线程调度器

## doOnSubscribe

1. 在 subscribeOn 之前调用时，受 subscribeOn 影响
2. 在subscribeOn 之后调用时，与 Observer 的 onSubscribe 方法一样，总是在 subscribe 所发生的线程被调用，而不能指定线程

默认情况下， `doOnSubscribe()` 执行在 subscribe() 发生的线程；而如果在 doOnSubscribe() 之后有 subscribeOn() 的话，它将执行在离它最近的subscribeOn()所指定的线程，如果之后没有subscribeOn()那么就执行在subscribe()所在线程。

## 案例1

observeOn、subscribeOn、doOnSubscribe()

```java
new Thread() {
    @Override
    public void run() {
        super.run();
        setName("订阅[subscribe()]");
        testObserveOn();
    }
}.start();

private static void testObserveOn() {
        Observable
                .create((ObservableOnSubscribe<Integer>) emitter -> {
                    try {
                        if (!emitter.isDisposed()) { // Observable 并不是在创建的时候就立即开始发送事件，而是在它被订阅的时候
                            Thread.sleep(3000);
                            prinnt("[Observable]create onNext" + threadName());
                            emitter.onNext(0);
                        }
                        if (!emitter.isDisposed()) {
                            Thread.sleep(3000);
                            prinnt("[Observable]create onComplete" + threadName());
                            emitter.onComplete(); // 在一个正确运行的事件序列中, onComplete() 和 onError() 有且只有一个，并且是事件序列中的最后一个
                        }
                    } catch (Exception e) {
                        if (!emitter.isDisposed()) {
                            prinnt("[Observable]create onError" + threadName());
                            emitter.onError(e);
                        }
                    }
                })
                .doOnSubscribe(disposable ->
                        prinnt("订阅成功 doOnSubscribe3" + threadName())
                )
                .map(integer -> {
                    prinnt("map1：" + integer + threadName());
                    return integer.toString();
                })

                .subscribeOn(Schedulers.newThread()) // 第一次，影响Observable.create()、subscribeOn之前的doOnSubscribe()操作符、subscribeOn到observeOn之间的操作符

                .doOnSubscribe(disposable ->
                        prinnt("订阅成功 doOnSubscribe2" + threadName())
                )

                .subscribeOn(Schedulers.computation())  // 第二次subscribeOn，只影响两个subscribeOn之间的doOnSubscribe操作符

                .map(integer -> {
                    prinnt("map2：" + integer + threadName());
                    return integer.toString();
                })

                .observeOn(Schedulers.io()) // 影响后续的操作符及Observer的onNext、onComplete、onError

                .doOnSubscribe(disposable ->
                        prinnt("订阅成功 doOnSubscribe1" + threadName())
                )
                .subscribe(new Observer<String>() {
                    @Override
                    public void onSubscribe(Disposable disposable) {
                        // 在 subscribe 刚开始，但事件还未发送之前被调用，可以用于做一些准备工作，如果对准备工作的线程有要求，可能该方法就不适用做准备工作
                        // 因为该方法总是在 subscribe 所发生的线程被调用，而不能指定线程（例如本例就不适合在该方法中显示对话框，因为是在 computation 中 subscribe 的）
                        prinnt("[Observer] onSubscribe 订阅成功" + threadName());
                    }

                    @Override
                    public void onNext(String item) {
                        prinnt("[Observer]onNext: " + item + threadName());
                    }

                    @Override
                    public void onComplete() {
                        prinnt("[Observer]onComplete接收完所有数据" + threadName());
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        prinnt("[Observer]onError" + throwable.getMessage());
                    }
                });
    }
```

结果：

```kotlin
订阅成功 doOnSubscribe1 ->订阅[subscribe()]线程
[Observer] onSubscribe 订阅成功 ->订阅[subscribe()]线程
订阅成功 doOnSubscribe2 ->RxComputationThreadPool-1线程
订阅成功 doOnSubscribe3 ->RxNewThreadScheduler-1线程
[Observable]create onNext ->RxNewThreadScheduler-1线程
map1：0 ->RxNewThreadScheduler-1线程
map2：0 ->RxNewThreadScheduler-1线程
[Observer]onNext: 0 ->RxCachedThreadScheduler-1线程
[Observable]create onComplete ->RxNewThreadScheduler-1线程
[Observer]onComplete接收完所有数据 ->RxCachedThreadScheduler-1线程
```

## flatMap影响

```java
private static void test2() {
    Observable
            .create((ObservableOnSubscribe<Integer>) emitter -> {
                try {
                    if (!emitter.isDisposed()) { // Observable 并不是在创建的时候就立即开始发送事件，而是在它被订阅的时候
                        Thread.sleep(3000);
                        print("[Observable]create onNext" + threadName());
                        emitter.onNext(0);
                    }
                    if (!emitter.isDisposed()) {
                        Thread.sleep(3000);
                        print("[Observable]create onComplete" + threadName());
                        emitter.onComplete(); // 在一个正确运行的事件序列中, onComplete() 和 onError() 有且只有一个，并且是事件序列中的最后一个
                    }
                } catch (Exception e) {
                    if (!emitter.isDisposed()) {
                        print("[Observable]create onError" + threadName());
                        emitter.onError(e);
                    }
                }
            })
            .doOnSubscribe(disposable ->
                    print("订阅成功 doOnSubscribe3" + threadName())
            )
            .map(integer -> {
                print("map1：" + integer + threadName());
                return integer.toString();
            })

            .subscribeOn(Schedulers.newThread()) // 第一次，影响Observable.create()、subscribeOn之前的doOnSubscribe()操作符、subscribeOn到observeOn之间的操作符

            .doOnSubscribe(disposable ->
                    print("订阅成功 doOnSubscribe2" + threadName())
            )

            .flatMap(new Function<String, ObservableSource<?>>() {
                @Override
                public ObservableSource<?> apply(String s) throws Exception {
                    return ftObservable();
                }
            })

            .subscribeOn(Schedulers.single())
            .map(integer -> {
                print("map3：" + integer + threadName());
                return integer.toString();
            })


            .subscribeOn(Schedulers.computation())  // 第二次subscribeOn，只影响两个subscribeOn之间的doOnSubscribe操作符

            .map(integer -> {
                print("map4：" + integer + threadName());
                return integer.toString();
            })

            .observeOn(Schedulers.single()) // 影响后续的操作符及Observer的onNext、onComplete、onError

            .doOnSubscribe(disposable ->
                    print("订阅成功 doOnSubscribe1" + threadName())
            )
            .subscribe(new Observer<String>() {
                @Override
                public void onSubscribe(Disposable disposable) {
                    // 在 subscribe 刚开始，但事件还未发送之前被调用，可以用于做一些准备工作，如果对准备工作的线程有要求，可能该方法就不适用做准备工作
                    // 因为该方法总是在 subscribe 所发生的线程被调用，而不能指定线程（例如本例就不适合在该方法中显示对话框，因为是在 computation 中 subscribe 的）
                    print("[Observer] onSubscribe 订阅成功" + threadName());
                }

                @Override
                public void onNext(String item) {
                    print("[Observer]onNext: " + item + threadName());
                }

                @Override
                public void onComplete() {
                    print("[Observer]onComplete接收完所有数据" + threadName());
                }

                @Override
                public void onError(Throwable throwable) {
                    print("[Observer]onError" + throwable.getMessage());
                }
            });
}

private static Observable<String> ftObservable() {
    return Observable
            .create((ObservableOnSubscribe<String>) emitter -> {
                try {
                    if (!emitter.isDisposed()) {
                        Thread.sleep(2000);
                        print("[Observable2]create onNext" + threadName());
                        emitter.onNext("这是flatMap发射的");
                    }
                    if (!emitter.isDisposed()) {
                        Thread.sleep(2000);
                        print("[Observable2]create onComplete" + threadName());
                        emitter.onComplete();
                    }
                } catch (Exception e) {
                    if (!emitter.isDisposed()) {
                        print("[Observable2]create onError" + threadName());
                        emitter.onError(e);
                    }
                }
            }).subscribeOn(Schedulers.io());/*.observeOn(Schedulers.single()*/
}
```

结果：

```
订阅成功 doOnSubscribe1 ->main线程
[Observer] onSubscribe 订阅成功 ->main线程
订阅成功 doOnSubscribe2 ->RxSingleScheduler-1线程
订阅成功 doOnSubscribe3 ->RxNewThreadScheduler-1线程
[Observable]create onNext ->RxNewThreadScheduler-1线程
map1：0 ->RxNewThreadScheduler-1线程
[Observable2]create onNext ->RxCachedThreadScheduler-1线程
map3：这是flatMap发射的 ->RxCachedThreadScheduler-1线程
map4：这是flatMap发射的 ->RxCachedThreadScheduler-1线程
[Observer]onNext: 这是flatMap发射的 ->RxSingleScheduler-1线程
[Observable]create onComplete ->RxNewThreadScheduler-1线程
[Observable2]create onComplete ->RxCachedThreadScheduler-1线程
[Observer]onComplete接收完所有数据 ->RxSingleScheduler-1线程
```

# RxJava线程注意事项

## RxJava线程总结

1. 使用默认computation()线程池实现的操作符时，最后另外设置线程进去
2. 不要使用trampoline()来实现延时操作
3. 日常开发时不要设置RxJavaPlugins.setErrorHandler()，线上正式包中最好设置RxJavaPlugins.setErrorHandler()

## Schedulers.computation()注意

`Schedulers.computation()`在RxJava中定义为用于计算任务的线程池，其线程数等于当前运行环境的CPU核心数。比如在我的华为Mate9 Pro中，其线程数为8。

事实上RxJava中很多操作符都默认使用computation()线程池，比如timer()、interval()、intervalRange()等。

使用timer()、interval()的时候，有几率不执行。其实根本原因是其他地方也使用了computation()中的线程，并且其线程池中的所有线程都被占用了，必须等到computation()中有空闲的线程后才执行后面的任务。

所以使用到默认computation()线程的操作符时，最好直接设置io()或者newThread()线程。

## Schedulers.trampoline()注意

[https://vites.app/article/dev/64bbb612.html#坑2：Schedulers-trampoline](https://vites.app/article/dev/64bbb612.html#%E5%9D%912%EF%BC%9ASchedulers-trampoline)

## subscribeOn()方法没有按照预期地运行

### 正常的线程切换，subscribeOn()生效

```java
private static void case1() {
    Observable
        .create(new ObservableOnSubscribe<String>() {
            @Override
            public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
                String data = "i am hacket";
                log("create. emiter:" + data); // 在IO线程
                emitter.onNext(data);
            }
        })
        .subscribeOn(Schedulers.io())
        .map(new Function<String, String>() {
            @Override
            public String apply(@NonNull String s) throws Exception {
                String data0 = "map0_" + s;
                log("map0. apply:" + data0); // 在IO线程
                return data0;
            }
        })
        .flatMap(new Function<String, ObservableSource<String>>() {
            @Override
            public ObservableSource<String> apply(@NonNull String s) throws Exception {
                log("flatMap."); // 在IO线程
                return Observable.create(new ObservableOnSubscribe<String>() {
                    @Override
                    public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
                        String data = "--->>>_" + s;
                        log("flatMap.create emitter:" + data); // 在IO线程
                        emitter.onNext(data);
                    }
                });
            }
        })
        .map(new Function<String, String>() {
            @Override
            public String apply(@NonNull String s) throws Exception {
                String data1 = "map1_" + s;
                log("map1. apply:" + data1); // 在IO线程
                return data1;
            }
        })
        .map(new Function<String, String>() {
            @Override
            public String apply(@NonNull String s) throws Exception {
                String data2 = "map2_" + s;
                log("map2. apply:" + data2); // 在IO线程
                return data2;
            }
        })
        .observeOn(Schedulers.newThread())
        .subscribe(new Consumer<String>() {
            @Override
            public void accept(String s) throws Exception {
                log("subscribe. onNext:" + s); // 在NewThread线程
            }
        });
}
```

输出：

```
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]create. emiter:i am hacket
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]map0. apply:map0_i am hacket
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]flatMap.
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]flatMap.create emitter:--->>>_map0_i am hacket
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]map1. apply:map1_--->>>_map0_i am hacket
[RxCachedThreadScheduler-1-2021-11-23 23:33:57]map2. apply:map2_map1_--->>>_map0_i am hacket
[RxNewThreadScheduler-1-2021-11-23 23:33:57]subscribe. onNext:map2_map1_--->>>_map0_i am hacket
```

### create或flatMap中切换了线程后emiter数据，subscribeOn会不生效

create或flatMap操作符中切换了线程后，subscribeOn不生效

```java
Observable
    .create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
            String data = "i am hacket";
            log("create."); // IO线程
            new Thread(new Runnable() {
                @Override
                public void run() {
                    log("[new Thread0]create. emiter:" + data); // Thread0线程
                    emitter.onNext(data);
                }
            }).start();
        }
    })
    .subscribeOn(Schedulers.io())
    .map(new Function<String, String>() {
        @Override
        public String apply(@NonNull String s) throws Exception {
            String data0 = "map0_" + s;
            log("map0. apply:" + data0); // Thread0线程
            return data0;
        }
    })
    .flatMap(new Function<String, ObservableSource<String>>() {
        @Override
        public ObservableSource<String> apply(@NonNull String s) throws Exception {
            log("flatMap."); // Thread0线程
            return Observable.create(new ObservableOnSubscribe<String>() {
                @Override
                public void subscribe(@NonNull ObservableEmitter<String> emitter) throws Exception {
                    String data = "--->>>_" + s;
                    log("flatMap. create:" + data); // Thread0线程
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            log("[new Threa1]flatMap create. emiter:" + data); // Thread1线程
                            emitter.onNext(data);
                        }
                    }).start();
                }
            });
        }
    })
    .map(new Function<String, String>() {
        @Override
        public String apply(@NonNull String s) throws Exception {
            String data1 = "map1_" + s;
            log("map1. apply:" + data1); // Thread1线程
            return data1;
        }
    })
    .map(new Function<String, String>() {
        @Override
        public String apply(@NonNull String s) throws Exception {
            String data2 = "map2_" + s;
            log("map2. apply:" + data2); // Thread1线程
            return data2;
        }
    })
    .observeOn(Schedulers.single())
    .subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            log("subscribe. onNext:" + s); // Single线程
        }
    });
```

输出：

```
[RxCachedThreadScheduler-1-2021-11-23 23:39:02]create.
[Thread-0-2021-11-23 23:39:02][new Thread0]create. emiter:i am hacket
[Thread-0-2021-11-23 23:39:02]map0. apply:map0_i am hacket
[Thread-0-2021-11-23 23:39:02]flatMap.
[Thread-0-2021-11-23 23:39:02]flatMap. create:--->>>_map0_i am hacket
[Thread-1-2021-11-23 23:39:02][new Threa1]flatMap create. emiter:--->>>_map0_i am hacket
[Thread-1-2021-11-23 23:39:02]map1. apply:map1_--->>>_map0_i am hacket
[Thread-1-2021-11-23 23:39:02]map2. apply:map2_map1_--->>>_map0_i am hacket
[RxSingleScheduler-1-2021-11-23 23:39:02]subscribe. onNext:map2_map1_--->>>_map0_i am hacket
```

### Hot Observable对subscribeOn()调用造成的影响

#### 特殊的创建操作符just

1. subscribeOn()对just无效，just在调用者线程发送数据

具体见:`操作符just.md`

#### Subject对subscribeOn()调用影响

##### PublishSubject

Observer 只接收 PublishSubject 被订阅之后发送的数据。如果 PublishSubject 在订阅之前，已经执行了 onComplete() 方法，则无法发射数据

```java
private static void test_subject_subscribeon() {
    PublishSubject<Integer> subject = PublishSubject.create();
    subject.subscribeOn(Schedulers.io()) // 无效
//        subject.observeOn(Schedulers.io()) // 有效
            .doOnNext(i -> log("value: " + i + " - I want this happen on an io thread")).subscribe();
    try {
        Thread.sleep(20);
        subject.onNext(1);
        Thread.sleep(20);
        subject.onNext(2);
        Thread.sleep(20);
        subject.onNext(3);
        Thread.sleep(20);
        subject.onComplete();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

输出：

```
Current Thread Name:main, value: 1 - I want this happen on an io thread
Current Thread Name:main, value: 2 - I want this happen on an io thread
Current Thread Name:main, value: 3 - I want this happen on an io thread
```

- subscribeOn() 并没有起作用，所有的操作都是在主线程中运行
- 想达到切换线程的效果，需要让 Subject 使用 observeOn() 替换 subscribeOn()

##### BehaviorSubject

Observer 会接收到 BehaviorSubject 被订阅之前的最后一个数据，再接收订阅之后发射过来的数据。如果 BehaviorSubject 被订阅之前没有发送任何数据，则会发送一个默认数据。

```java
public static void main(String[] args) {

    BehaviorSubject<Integer> subject = BehaviorSubject.create();

    subject.subscribeOn(Schedulers.io())
            .doOnNext(i-> log("value: "+ i+" - I want this happen on an io thread")).subscribe();

    subject.onNext(1);

    subject.subscribeOn(Schedulers.newThread())
            .doOnNext(i-> log("value: "+ i+" - I want this happen on a new thread")).subscribe();

    subject.subscribeOn(Schedulers.computation())
            .doOnNext(i-> log("value: "+ i+" - I want this happen on a computation thread")).subscribe();

    try {
        Thread.sleep(20);
        subject.onNext(2);
        Thread.sleep(20);
        subject.onNext(3);
        Thread.sleep(20);
        subject.onComplete();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}

public static void log(String msg) {
    System.out.println("Current Thread Name:"+Thread.currentThread().getName() + ", "+ msg);
}
```

执行结果：

```java
Current Thread Name:main, value: 1 - I want this happen on an io thread
Current Thread Name:RxNewThreadScheduler-1, value: 1 - I want this happen on a new thread
Current Thread Name:RxComputationThreadPool-1, value: 1 - I want this happen on a computation thread
Current Thread Name:main, value: 2 - I want this happen on an io thread
Current Thread Name:main, value: 2 - I want this happen on a new thread
Current Thread Name:main, value: 2 - I want this happen on a computation thread
Current Thread Name:main, value: 3 - I want this happen on an io thread
Current Thread Name:main, value: 3 - I want this happen on a new thread
Current Thread Name:main, value: 3 - I want this happen on a computation thread
```

- 当我们的 subject 发射第一个值时，第一个观察者已经被订阅。由于订阅代码在我们调用 onNext() 时已经完成，因此订阅调度程序没有任何作用。在这种情况下，当我们调用 onNext() 它类似于 PublishSubject 的工作方式。
- 第二和第三个观察者都在初始 onNext() 之后订阅。这是 BehaviorSubject 特性，对于任何新的订阅，它将重播最后一个发射的数据。因此，对于这两个观察者来说，BehaviorSubject 已缓存了这个发射的值(1)，并将其作为预订的一部分发出。这样，将尊重订阅调度程序，并在它提供的线程上通知观察者。
- 所有后续的发射的值都发生在订阅之后，因此，值再次与 onNext() 在同一线程上发出，类似于 PublishSubject 的工作方式。

#### timer、interval等操作符有默认的Scheduler

RxJava 的某些操作符，例如：timer、interval、buffer、debounce、delay 等都支持 Scheduler

### RxJava线程总结

1. 被观察者多次执行subscribeOn()方法，只有第一次有效；被观察者多次调用subscribeOn()之后，并不意味着线程只会切换一次，而是线程多次切换之后，最终切换到第一次设置的线程
2. 被观察者必须是Cold Observable
3. just操作符，subscribeOn无效
4. Subject，subscribeOn无效
5. 部分操作符自带了Scheduler
6. 在create/flatMap等能发送数据的操作符中，不要手动切换线程；手动切换线程后，subscribeOn操作符指定的线程就会对后面的操作符失效了，后续操作符都会运行在你手动切换的线程中
7. 用create封装各种callback为Observablbe时，callback回来时，emitter应该在调用方法的线程中发射数据，比如不要手动切换到主线程，否则会导致subscribeOn(IO)失效后续操作符都在主线程中，进而导致ANR卡顿
