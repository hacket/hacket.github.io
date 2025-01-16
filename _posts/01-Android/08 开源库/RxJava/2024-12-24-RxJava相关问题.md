---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# RxJava

## 什么是RxJava？

一个在 JVM 上使用可观测的序列来组成异步的、基于事件的程序的库。<br />举个例子说明：下载一张照片，用户点击下载，弹出正在下载提示框，下载结束显示图片，关闭提示框。<br />用RxJava实现简洁。<br />和观察者模式对比：观察者设计模式，起点是被观察者，终点是观察者，一条流水线的思维，响应式编程.

## RxJava原理？

1. 构建链的阶段
2. subscribe阶段

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

1. Observable的创建，没有每个操作符xxx都对应一个ObservableXxx(比如create，对应ObservableCreate)，每次链式调用一个操作符，都是将前面的Observable作为source保存在当前ObservableXxx中

> ObservableCreate的source是ObservableOnSubscribe，ObservableFlatMap的source是ObservableCreate，ObservableMap的source是ObservableFlatMap

2. subscribe，调用的就是Observable的subscribeActual，最后的操作符，优先subscribe

> ObservableMap.subscribeActual: ObservableFlatMap.subscribe(MapObserver(自定义的Observer))
> ObservableFlatMap.subscribeActual: ObservableCreate.subscribe(MergeObserver(MapObserver))
> ObservableCreate.subscribeActual: ObservableOnSubscribe.subscribe(CreateEmitter(MergeObserver))
> ObservableOnSubscribe.subscribe(): 调用Emitter.onNext()和onComplete()
> Emitter.onNext : 调用的就是MergerObserver的onNext

操作符的链式调用，其实就是前面的ObservableXxx.subscribe后面的XXXObserver，每个XxxObserver又持有后续的xxxObserver，最顶层的CreateEmitter，调用的Observer.onNext，然后就一层层的按照操作链式的顺序调用各个操作符对应的Observer<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654529893095-7133d42a-433e-44c4-9e45-ba2fcbcae9cb.png#averageHue=%23f6f4f4&clientId=uce81d59a-7571-4&from=paste&height=444&id=ua643010a&originHeight=666&originWidth=1470&originalType=binary&ratio=1&rotation=0&showTitle=false&size=314033&status=done&style=none&taskId=u91ea4945-9ec8-40a1-b08f-2311f1af3cb&title=&width=980)<br />![](https://cdn.nlark.com/yuque/0/2022/png/694278/1655866410462-1b00b41e-922d-4fbd-9e48-af48d3b469fc.png#averageHue=%23fdfbf9&clientId=uc6976aa9-5aa3-4&from=paste&height=228&id=u5fc9fffa&originHeight=661&originWidth=2376&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u459f4eb5-6071-4cdb-ba44-b88caf2b68e&title=&width=821)

## RxJava怎么切换线程的？

1. 由于Observable的创建，是一层包裹一层的
2. subscribeOn对应ObservableSubscribeOn，在其subscribeActual里，通过SubscribeTask，它是一个Runnable，在其run方法里，后续订阅都在在该Scheduler里，导致调用onNext时也是在该Scheduler里

```java
public void subscribeActual(final Observer<? super T> observer) {
    scheduler.scheduleDirect(new SubscribeTask(parent))
}
final class SubscribeTask implements Runnable {
    private final SubscribeOnObserver<T> parent;

    SubscribeTask(SubscribeOnObserver<T> parent) {
        this.parent = parent;
    }

    @Override
    public void run() {
        source.subscribe(parent);
    }
}
```

3. observeOn对应ObservableObserveOn，在其ObserveOnObserver，调用他的onNext时，是被schedule到指定的Scheduler中去的，而observeOn一般是放在subscibe()前一个，所以就会让你自己写的Observer的onNext就在指定的Scheduler运行，影响的是observeOn后续的代码线程运行

## RxJava中flatmap原理
