---
date created: 2024-12-24 00:32
date updated: 2024-12-24 00:32
dg-publish: true
tags:
  - '#1'
  - '#1'
---

# LiveData

## LiveData基础

### 什么是LiveData？

LiveData 是 Android Jetpack Lifecycle 组件中的内容。属于官方库的一部分，Kotlin/Java 均可使用。

一句话概括 LiveData：**LiveData 是可感知生命周期的，可观察的，数据持有者**。

它的能力和作用很简单：**更新 UI**。

### LiveData 的特性

#### 观察者的回调永远发生在主线程（observe在主线程）

LiveData 被用来更新 UI，因此 Observer 的 onChanged() 方法在主线程回调。

> 背后的原理也很简单，LiveData 的 setValue() 发生在主线程（非主线程调用会抛异常，postValue() 内部会切换到主线程调用 setValue()）。之后遍历所有观察者的 onChanged() 方法。

#### 仅持有单个且最新的数据

LiveData 每次持有一个数据，并且新数据会覆盖上一个。（这个设计很好理解，数据决定了UI的展示，绘制UI时肯定要使用最新的数据，「过时的数据」应该被忽略。）

> 配合 Lifecycle，观察者只会在活跃状态下（STARTED 到 RESUMED）接收到 LiveData 持有的最新的数据。在非活跃状态下绘制 UI 没有意义，是一种资源的浪费。

#### 自动取消订阅

这是 LiveData 可感知生命周期的重要表现，自动取消订阅意味着开发者无需手动写那些取消订阅的模板代码，降低了内存泄漏的可能性。

背后原理是在生命周期处于 DESTROYED 时，移除观察者。

```java
// LifecycleBoundObserver
public void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event) {
    Lifecycle.State currentState = mOwner.getLifecycle().getCurrentState();
    if (currentState == DESTROYED) {
        removeObserver(mObserver);
        return;
    }
    Lifecycle.State prevState = null;
    while (prevState != currentState) {
        prevState = currentState;
        activeStateChanged(shouldBeActive());
        currentState = mOwner.getLifecycle().getCurrentState();
    }
}
```

#### 提供「可读可写」和「仅可读」两个版本

LiveData 提供了 mutable（`MutableLiveData`）和immutable（`LiveData`）两个类，前者「可读可写」，后者「仅可读」。通过权限的细化，让使用者各取所需，避免由于权限泛滥导致的数据异常。

#### 配合DataBinding实现「双向绑定」

LiveData 配合 DataBinding 可以实现 更新数据自动驱动 UI 变化，如果使用「双向绑定」还能实现 UI 变化影响数据的变化。

#### LiveData “缺点”

这些也不能算是LiveData「设计缺陷」或「LiveData 的缺点」。作为开发者应了解这些特性并在使用过程中正确处理它们。

##### observe在主线程

##### Value 是 nullable 的

```java
// LiveData
@Nullable
public T getValue() {
    Object data = mData;
    if (data != NOT_SET) {
        return (T) data;
    }
    return null;
}
```

`LiveData#getValue()` 是可空的，使用时应该注意判空。

##### 使用正确的 lifecycleOwner

androidx fragment 1.2.0 起，添加了新的 Lint 检查，以确保您在从 onCreateView()、onViewCreated() 或 onActivityCreated() 观察 LiveData 时使用 `getViewLifecycleOwner()`。<br>![lifecycle_owner.webp|500](https://cdn.nlark.com/yuque/0/2023/webp/694278/1691238027900-3b4fa2f1-ad5e-4772-96c1-7393702eb79f.webp#clientId=uc2954e40-de36-4&from=ui&id=ub19b1a5c&originHeight=338&originWidth=600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=124368&status=done&style=none&taskId=u3505bbe7-0bd5-4842-827f-5cce36af16a&title=)<br>fragment 拥有两个生命周期：fragment 自身和 fragment 内部 view 的生命周期

当需要观察 view 相关的 LiveData ，可以在 onCreateView()、onViewCreated() 或 onActivityCreated()  中 LiveData observe 方法中传入 viewLifecycleOwner 而不是传入 this

##### 黏性事件

具体见下面的解决方案。

##### 默认不防抖

SetValue()/postValue() 传入相同的值多次调用，观察者的 onChanged() 会被多次调用。

官方在 Transformations 中提供了 distinctUntilChanged() 方法，配合官方提供的扩展函数，如下使用即可：

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    
    viewModel.headerText.distinctUntilChanged().observe(viewLifecycleOwner) {
        header.text = it
    }
}
```

##### Transformation 工作在主线程

有些时候我们从 repository 层拿到的数据需要进行处理，例如从数据库获得 User List，我们想根据 id 获取某个 User。

此时我们可以借助 MediatorLiveData 和 Transformatoins 来实现：

```kotlin
class MainViewModel {
  val viewModelResult = Transformations.map(repository.getDataForUser()) { data ->
     convertDataToMainUIModel(data)
  }
}
```

Map 和 switchMap 内部均是使用 MediatorLiveData#addSource() 方法实现的，而该方法会在主线程调用，使用不当会有性能问题。

### MutableLiveData

MutableLiveData是LiveData的子类，添加了公共方法setValue和postValue，方便开发者直接使用。setValue必须在主线程调用。postValue可以在后台线程中调用

### AlwaysActiveObserver

默认情况下，LiveData会跟LicycleOwner绑定，只在active状态下更新，如若想要不管在什么状态下都能接收到数据的更改通知的话，怎么办？这时候需要使用 AlwaysActiveObserver ，改调用 observe 方法为调用`LiveData.observeForever(Observer)` 方法即可。

```kotlin
val alwaysLiveString = MutableLiveData<String>()
alwaysLiveString.observeForever {
    tv_always_live_data_result.text = "always接收倒计时:$it"
    LogUtils.i("always接收倒计时 $it 秒 ${Thread.currentThread().name}")
}
```

### postValue 与 setValue

#### postValue 与 setValue区别

1. setValue 只能在主线程调用，同步更新数据
2. postValue 可在后台线程调用，其内部会切换到主线程调用 setValue

#### 多次postValue，只有最后一次数据才更新

postValue 使用不当，可能发生接收到数据变更的通知：

```
If you called this method multiple times before a main thread executed a posted task, only the last value would be dispatched.
```

> 当连续调用 postValue时，有可能只会收到最后一次数据更新通知。

源码：

```java
protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        postTask = mPendingData == NOT_SET; // mPendingData消费了这个才为true
        mPendingData = value; 
    }
    if (!postTask) { // 多次postValue，mPendingData为消费，这里会return掉，多次postValue无效，只是更新mPendingData的值
        return;
    }
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}
```

mPendingData 被成功赋值 value 后，post 了一个 Runnable；mPostValueRunnable 的实现如下：

```java
private final Runnable mPostValueRunnable = new Runnable() {
    @SuppressWarnings("unchecked")
    @Override
    public void run() {
        Object newValue;
        synchronized (mDataLock) { // 加锁，多线程访问
            newValue = mPendingData; // 消费掉mPendingData
            mPendingData = NOT_SET; // mPendingData消费后置空
        }
        setValue((T) newValue);
    }
};
```

1. postValue 将数据存入 mPendingData，mPostValueRunnable 在UI线程消费mPendingData。
2. 在 Runnable 中 mPendingData 值还没有被消费之前，即使连续 postValue ， 也不会 post 新的 Runnable
3. mPendingData 的生产 (赋值) 和消费（赋 NOT_SET） 需要加锁

## LiveData局部刷新

支持某个属性的更新。

```kotlin
// T不能被混淆
fun <T, A> LiveData<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    action: (A) -> Unit
) {
    map { StateTuple1(prop1.get(it)) }
        .distinctUntilChanged()
        .observe(lifecycleOwner, Observer { (a) -> action.invoke(a) })
}

fun <T, A, B> LiveData<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    prop2: KProperty1<T, B>,
    action: (A, B) -> Unit
) {
    map { StateTuple2(prop1.get(it), prop2.get(it)) }
        .distinctUntilChanged().observe(
            lifecycleOwner,
            Observer { (a, b) ->
                action.invoke(a, b)
            }
        )
}

fun <T, A, B, C> LiveData<T>.observeState(
    lifecycleOwner: LifecycleOwner,
    prop1: KProperty1<T, A>,
    prop2: KProperty1<T, B>,
    prop3: KProperty1<T, C>,
    action: (A, B, C) -> Unit
) {
    this.map {
        StateTuple3(prop1.get(it), prop2.get(it), prop3.get(it))
    }.distinctUntilChanged().observe(lifecycleOwner) { (a, b, c) ->
        action.invoke(a, b, c)
    }
}

internal data class StateTuple1<A>(val a: A)
internal data class StateTuple2<A, B>(val a: A, val b: B)
internal data class StateTuple3<A, B, C>(val a: A, val b: B, val c: C)

// endregion
```

> T要keep住

使用：

```kotlin
viewModel.viewStates.run {
    observeState(this@MainScreenActivity, MainViewState::newsList) {
        newsRvAdapter.submitList(it)
    }
}
```

## MediatorLiveData

MediatorLiveData 中介者LiveData

1. 它可以监听另一个LiveData的数据变化
2. 同时也可以做为一个liveData，被其他Observer观察。
3. addSource是MutableLiveData作为观察者添加观察者来观察其他LiveData的数据，observe是MutableLiveData作为被观察者来观察多个LiveData的数据更新，MutableLiveData只是作为一个中间代理人而已

示例：

```kotlin
class MediaLiveDataDemo : AppCompatActivity() {

    private val liveData1: MutableLiveData<String> = MutableLiveData()
    private val liveData2: MutableLiveData<String> = MutableLiveData()
    private val mediatorLiveData: MediatorLiveData<String> = MediatorLiveData()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_media_live_data_demo)

        // 这个Observer是观察LiveData1的数据变化，此时MediaLiveData是作为观察者
        mediatorLiveData.addSource(liveData1) {
            tv_live_data_result.append("LiveData1:$it\n")
            LogUtils.i("LiveData1接收 $it ${Thread.currentThread().name}")
            mediatorLiveData.setValue(it)
        }
        mediatorLiveData.addSource(liveData2) {
            tv_live_data_result.append("LiveData2:$it\n")
            LogUtils.i("LiveData2接收 $it ${Thread.currentThread().name}")
            mediatorLiveData.value = it
            if (it == "out") {
                mediatorLiveData.removeSource(liveData2)
            }
        }

        // MediaLiveData作为被观察者，被观察，只有livedata1和livedata2更新就会收到数据更新
        mediatorLiveData.observe(this, Observer<String> {
            LogUtils.i("mediatorLiveData接收 $it ${Thread.currentThread().name}")
        })

        btn_medialivedata_livedata1.setOnClickListener {
            LogUtils.i("LiveData1发送 $it ${Thread.currentThread().name}")
            liveData1.value = "LiveData1 data=${DateUtils.formatDateToString(System.currentTimeMillis())}"
        }
        btn_medialivedata_livedata2.setOnClickListener {
            LogUtils.i("LiveData2发送 $it ${Thread.currentThread().name}")
            liveData2.value = "LiveData2 data=${DateUtils.formatDateToString(System.currentTimeMillis())}"
        }
    }
    override fun onDestroy() {
        super.onDestroy()
        mediatorLiveData.removeObservers(this)
    }
}
```

### conbine

联合多个livedata数据，类似RxJava2的`combineLatest`

```kotlin
fun <T1, T2> conbineLatest(f1: LiveData<T1>, f2: LiveData<T2>): LiveData<Pair<T1?, T2?>> = MediatorLiveData<Pair<T1?, T2?>>().also { mediator ->
    mediator.value = Pair(f1.value, f2.value)

    mediator.addSource(f1) { t1: T1? ->
        val (_, t2) = mediator.value!!
        mediator.value = Pair(t1, t2)
    }

    mediator.addSource(f2) { t2: T2? ->
        val (t1, _) = mediator.value!!
        mediator.value = Pair(t1, t2)
    }
}
```

更多参数conbine参考：<br><https://github.com/Zhuinden/livedata-combinetuple-kt>

### MediaLiveData原理

首先看MediaLiveData.addSource

```java
// 参数1：要观察的LiveData   参数2：观察source的Observer
public <S> void addSource(@NonNull LiveData<S> source, @NonNull Observer<? super S> onChanged) {
    Source<S> e = new Source<>(source, onChanged);
    Source<?> existing = mSources.putIfAbsent(source, e); // 如果不存在就添加
    if (existing != null && existing.mObserver != onChanged) {
        throw new IllegalArgumentException(
                "This source was already added with the different observer");
    }
    if (existing != null) {
        return;
    }
    if (hasActiveObservers()) { // 存在active的Observer，调用source.plug()
        e.plug();
    }
}
```

下面看Source

```java
private static class Source<V> implements Observer<V> { // 作为mLiveData的观察者
    final LiveData<V> mLiveData; // 被观察的LiveData
    final Observer<? super V> mObserver; 
    int mVersion = START_VERSION;

    Source(LiveData<V> liveData, final Observer<? super V> observer) {
        mLiveData = liveData;
        mObserver = observer;
    }

    void plug() { // 永久的观察mLiveData的数据变化
        mLiveData.observeForever(this);
    }

    void unplug() { // 移除观察
        mLiveData.removeObserver(this);
    }

    @Override
    public void onChanged(@Nullable V v) { // 当mLiveData数据变化时，且版本是最新的，通知MediaLiveData
        if (mVersion != mLiveData.getVersion()) {
            mVersion = mLiveData.getVersion();
            mObserver.onChanged(v);
        }
    }
}
```

## Transformations

Transformations 允许我们把一个 LiveData 进行处理，变化成另外一个 LiveData，目前支持 `map` 跟 `switchMap` 两个方法，跟 RxJava 的操作类似。

在使用LiveData时，有时候我们想改变LiveData的值在LiveData通知其Observers之前，或者在有些时候我们的数据源Repository会返回不同的LiveData实例，我们需要一种数据转换的功能帮助我们去转换不同数据层的数据，而Transformations就是这样一个工具。

### map

同RxJava中的map，将源LiveData的数据变换后输出

map方法原型

```java
public static <X, Y> LiveData<Y> map(@NonNull LiveData<X> source,@NonNull final Function<X, Y> mapFunction)
```

参数1：源LiveData<br>参数2：变换Function

#### map原理

从Transformations.map看：

```java
public static <X, Y> LiveData<Y> map(
        @NonNull LiveData<X> source,
        @NonNull final Function<X, Y> mapFunction) {
    final MediatorLiveData<Y> result = new MediatorLiveData<>();
    result.addSource(source, new Observer<X>() {
        @Override
        public void onChanged(@Nullable X x) {
            result.setValue(mapFunction.apply(x));
        }
    });
    return result;
}
```

通过中间代理人MediatorLiveData来监听源LiveData的数据更新，在Observer中应用变换后返回该MediatorLiveData

#### 案例

```kotlin
class LiveDataTransformationsDemo : AppCompatActivity() {
    private val liveData = MutableLiveData<Long>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_data_transformations_demo)

        Transformations.map(liveData) { input -> "map转换后$input" }
                .observe(this, Observer {
                    tv_result.append("$it\n")
                })
        timerInc()
    }
    private fun timerInc() {
        lifecycleScope.launch {
            RxUtils.countdown(30).subscribe {
                liveData.postValue(it)
            }
        }
    }
}
```

### switchMap

同RxJava中的switchMap。将一个LiveData转换成另外一个LiveData，并可以手动控制这个LiveData

源码：

```java
public static <X, Y> LiveData<Y> switchMap(
        @NonNull LiveData<X> source,
        @NonNull final Function<X, LiveData<Y>> switchMapFunction) {
    final MediatorLiveData<Y> result = new MediatorLiveData<>();
    result.addSource(source, new Observer<X>() {
        LiveData<Y> mSource;

        @Override
        public void onChanged(@Nullable X x) {
            LiveData<Y> newLiveData = switchMapFunction.apply(x);
            if (mSource == newLiveData) {
                return;
            }
            if (mSource != null) {
                result.removeSource(mSource);
            }
            mSource = newLiveData;
            if (mSource != null) {
                result.addSource(mSource, new Observer<Y>() {
                    @Override
                    public void onChanged(@Nullable Y y) {
                        result.setValue(y);
                    }
                });
            }
        }
    });
    return result;
}
```

将source的变换，交给switchMapFunction返回的LiveData，并交由这个LiveData控制数据的更新，可以自由变换后postValue/seValue，也可以不更新这个value了。

案例：

```kotlin
class LiveDataTransformationsDemo : AppCompatActivity() {

    private val liveData = MutableLiveData<Long>()
    private lateinit var liveDataString: SwitchMapDemoLiveData

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_data_transformations_demo)
        Transformations
                .switchMap(liveData) { input ->
                    liveDataString = SwitchMapDemoLiveData(input)
                    liveDataString
                }
                .observe(this, Observer {
                    tv_result_switch_map.append("$it\n")
                })
        timerInc()
        btn_switch_map.setOnClickListener {
            liveDataString.update()
        }
    }
    private fun timerInc() {
        lifecycleScope.launch {
            RxUtils.countdown(10).subscribe {
                liveData.postValue(it)
            }
        }
    }
    inner class SwitchMapDemoLiveData(val input: Long, value: String? = "") : MutableLiveData<String>(value) {
        fun update() {
            value = "switchMap 后=$input"
        }
    }
}
```

### distinctUntilChanged

过滤掉重复的数据，根据`equals()`方法判断

```java
public static <X> LiveData<X> distinctUntilChanged(@NonNull LiveData<X> source) {
    final MediatorLiveData<X> outputLiveData = new MediatorLiveData<>();
    outputLiveData.addSource(source, new Observer<X>() {

        boolean mFirstTime = true;

        @Override
        public void onChanged(X currentValue) {
            final X previousValue = outputLiveData.getValue();
            if (mFirstTime
                    || (previousValue == null && currentValue != null)
                    || (previousValue != null && !previousValue.equals(currentValue))) {
                mFirstTime = false;
                outputLiveData.setValue(currentValue);
            }
        }
    });
    return outputLiveData;
}
```

案例：

```kotlin
Transformations.distinctUntilChanged(liveData)
    .observe(this, Observer {
        tv_result_map.append("$it\n")
```

## LiveDataReactiveStreams

文档：<https://developer.android.com/reference/android/arch/lifecycle/LiveDataReactiveStreams>

### RxJava2转为LiveData

透過`fromPublisher`我們可以在ViewModel中將`Flowable<T>`轉換成`LiveData<T>`。

```groovy
implementation "android.arch.lifecycle:reactivestreams:1.0.0"
```

示例：

```java
public final class InewsListViewModel extends AndroidViewModel {
    private LiveData<List<ArticleModel>> mListLiveData;
    public LiveData<List<ArticleModel>> loadListDatasFromFlowable() {
        Flowable<List<ArticleModel>> listFlowable = mInewsRepository.loadListDatasFlowable();
        mListLiveData = LiveDataReactiveStreams.fromPublisher(listFlowable);
        return mListLiveData;
}
```

### RxJava+MutableLiveData

不使用LiveDataReactiveStreams轉換的話，我們可以在ViewModel中subscribe並用setValue更新MutableLiveData，這樣就不限於Flowable，可以使用任意的Observable。

```java
public class UserRepository {
    // ...
    public Single<List<User>> getUsers() {
        return service.getUsers();
    }
}

public class UserViewModel extends ViewModel {
    private final MutableLiveData<List<User>> users;
    //..
    public void loadUsers() {
        disposables.add(repository.getUsers()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribeWith(new DisposableSingleObserver<List<User>>() {
            @Override
            public void onSuccess(List<User> data) {
                users.setValue(data);
            }
            @Override
            public void onError(Throwable e) {
                // Error handle.
            }
        }));
    }
    LiveData<List<User>> getUsers() {
        return users;
    }
    //...
    @Override
    public void onCleard() {
        super.onCleard();
        disposables.clear();
    }
}
```

## LiveData coroutine builder (ktx中`liveData{ }`)

### livedata{}介绍及原理

```kotlin
public fun <T> liveData(
    context: CoroutineContext = EmptyCoroutineContext,
    timeoutInMs: Long = DEFAULT_TIMEOUT,
    @BuilderInference block: suspend LiveDataScope<T>.() -> Unit
)
```

1. 连接协程和LiveData的工具方法
2. 可以在子线程中转换LiveData数据，默认在主线程
3. timeoutInMs可指定处于inActive时，block是否取消
   1. 在后台(inActive)的时间<timeoutInMs，那么block会执行，不会被取消，不会更新UI，等active时再更新UI
   2. 在后台(inActive)的时间>=timeoutInMs，block会被取消掉，等active时重新执行block（如果有delay，那么delay重新开始计算），等block执行完毕，更新UI

原理：<br>用MediatorLiveData包装了下，默认的CoroutineContext为`SupervisorJob+Dispatchers.Main.immediate`，默认在主线程中。

### Connect Kotlin Coroutine to LiveData (连接协程和LiveData)

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691238275809-12db28a5-a598-4a99-93e7-191eb1d6d212.png#averageHue=%23f2f2f2&clientId=uc2954e40-de36-4&from=paste&height=113&id=ubb56c031&originHeight=135&originWidth=478&originalType=binary&ratio=2&rotation=0&showTitle=false&size=18070&status=done&style=none&taskId=uc8e338f9-e2d2-4974-b5cc-576258cfbc7&title=&width=400)<br>示例：

```kotlin
fun getGameGoodsList(): LiveData<List<KittyGameGoodsItem>> =
    liveData(viewModelScope.coroutineContext) {
        val data = getGameGoodsListSuspend()
        LogUtils.logi("hacket", "getGameGoodsList()", "emit data=$data")
        emit(data)
    }
private suspend fun getGameGoodsListSuspend(): List<KittyGameGoodsItem> {
    val list = mutableListOf<KittyGameGoodsItem>()
    list.add(KittyGameGoodsItem("apple"))
    list.add(KittyGameGoodsItem("orange"))
    list.add(KittyGameGoodsItem("kitty"))
    LogUtils.logd("hacket", "getGameGoodsListSuspend()", "模拟网络请求，delay5秒后返回数据")
    delay(5000L) // 模拟网络请求
    LogUtils.logd("hacket", "getGameGoodsListSuspend()", "模拟网络请求数据返回:$list")
    return list
}
```

### Connect Kotlin Flow (or StateFlow) to LiveData

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691238306423-f54c7ed3-b2e4-4848-a3a9-110f3776e323.png#averageHue=%23f3f3f3&clientId=uc2954e40-de36-4&from=paste&height=82&id=u8f31356e&originHeight=128&originWidth=616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20477&status=done&style=none&taskId=uf17b8d80-5323-4cf7-8926-862e458801d&title=&width=397)

```kotlin
val someTypeLiveData: LiveData<SomeType> =   
    stateFlow.asLiveData(
        viewModelScope.coroutineContext + Dispatchers.IO
    )
```

一旦LiveData连接到任何观察者，它就会在stateFlow上待命，发出它的数据。在内部对于asLiveData实际上也是一个LiveData {...}

```kotlin
public fun <T> Flow<T>.asLiveData(
    context: CoroutineContext = EmptyCoroutineContext,
    timeoutInMs: Long = DEFAULT_TIMEOUT
): LiveData<T> = liveData(context, timeoutInMs) {
    collect {
        emit(it)
    }
}
```

### Transformation on Background (在后台线程运行转换数据)

```kotlin
fun getGameGoodsListOnIO(): LiveData<List<KittyGameGoodsItem>> =
    liveData(viewModelScope.coroutineContext + Dispatchers.IO) {
        val data = getGameGoodsListSuspend()
        LogUtils.logi("hacket", "getGameGoodsList()", "emit data=$data") // 在IO
        emit(data)
    }
```

### Connecting Multiple LiveData Source Emission (连接多个livedata的更新) --直接用MediaLiveData也可以

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691238327188-8e3e8b6e-ff8c-4807-be8c-93379c8ef06e.png#averageHue=%23f6f6f6&clientId=uc2954e40-de36-4&from=paste&height=199&id=u225eb7c2&originHeight=310&originWidth=716&originalType=binary&ratio=2&rotation=0&showTitle=false&size=33809&status=done&style=none&taskId=u67cfeb77-7fc0-44df-8055-03ea5b152d9&title=&width=460)

```kotlin
liveData(viewModelScope.coroutineContext + Dispatchers.IO) {
    emitSource(repository.liveDataSourceA)
    delay(2000)
    emitSource(repository.liveDataSourceB)
    delay(2000)
    emitSource(repository.liveDataSourceC)
}
```

### Ref

- [x] 5 Uses of KTX LiveData Coroutine Builder<br><https://medium.com/mobile-app-development-publication/5-uses-of-ktx-livedata-coroutine-builder-48b226bdd591>

## ComputableLiveData

## LiveDataBus

## LiveData应用场景

- [x] LiveData奇思妙用的 11 个场景总结~ <https://mp.weixin.qq.com/s/013AABBND0XVXsOfY7dGuA>

## LiveData坑

### postValue数据丢失的问题

postValue 只是把传进来的数据先存到 mPendingData，然后往主线程抛一个 Runnable，在这个 Runnable 里面再调用 setValue 来把存起来的值真正设置上去，并回调观察者们。而如果在这个 Runnable 执行前多次 postValue，其实只是改变暂存的值 mPendingData，并不会再次抛另一个 Runnable。这就会出现后设置的值把前面的值覆盖掉的问题，会导致事件丢失。

```java
protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        postTask = mPendingData == NOT_SET;
        // 这里先把数据暂存起来，后来的数据会覆盖前面的
        mPendingData = value;
    }
    // 这里保证只抛一个 mPostValueRunnable
    if (!postTask) {
        return;
    }
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}
```

### LiveData为什么最多收到2个通知？

```java
public class JavaTestLiveDataActivity extends AppCompatActivity {
    
    private TestViewModel model;
 
    private String test="12345";
 
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_java_test_live_data);
        model = new ViewModelProvider(this).get(TestViewModel.class);
        test3();       
        model.getCurrentName().setValue("3");
    }
    private void test3() {
 
        for (int i = 0; i < 10; i++) {
            model.getCurrentName().observe(this, new Observer<String>() {
                @Override
                public void onChanged(String s) {
                    Log.v("ttt", "s:" + s);
                }
            });
        }
    }
}
```

> 实际上对于Log系统来说，如果他判定时间戳一致的情况下，后面的Log内容也一致，那么他就不会重复打印内容了。这里一定要注意这个细节，否则在很多时候，会影响我们对问题的判断。再回到我们之前没有添加hashCode的代码，再仔细看看也就明白了：只是Log打印了两条而已，但是通知是收到了10次的，为啥打印两条？因为你的时间戳一致，后续的内容也一致。

### Observer用lambda写，只有一次log

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691238375351-53889367-0182-40cb-be67-deceab1264d7.png#averageHue=%233c4043&clientId=uc2954e40-de36-4&from=paste&height=190&id=u57bc890c&originHeight=379&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=131662&status=done&style=none&taskId=u651bf11e-3be2-42d9-b249-dad0a53d1d2&title=&width=540)

> 对于for循环中间使用lambda的场景，当你的lambda中没有使用外部的变量或者函数的时候，那么不管是Java8的编译器还是Kotlin的编译器都会默认帮你优化成使用同一个lambda。

编译器的出发点是好的，for循环中new不同的对象，当然会导致一定程度的性能下降(毕竟new出来的东西最后都是要gc的)，但这种优化往往可能不符合我们的预期，甚至有可能在某种场景下造成我们的误判，所以使用的时候一定要小心。

### LiveData黏性和数据倒灌（LiveData为何会收到Observe之前的消息？）

[https://caoyangim.github.io/2020/12/19/LiveData后续/](https://caoyangim.github.io/2020/12/19/LiveData%E5%90%8E%E7%BB%AD/)

#### 黏性事件(Sticky Event)

粘性事件：事件发送后，观察者才订阅，订阅后会收到之前的事件（LiveData所维护的数据具有粘性）。

> 具体代码中指的是，先setValue/postValue,后调用observe(),如果成功收到了回调，即为粘性事件

比如：一个订阅者订阅了LiveData，该LiveData调用setValue发送一个事件弹出一次toast。

> 正常情况下是先订阅了，然后再发送数据；如果正常情况下是对的，但当屏幕旋转了或其他情况导致Activity重建了，再次订阅了该LiveData，那么又会弹出一次toast，显然这不是我们想要的。

LiveData的设计也不是为了**传递一次性事件**的，它是为了反应View当前状态的，View层只需要根据当前LiveData的值去渲染数据就行，非激活状态时View都不可见，就算更新了也没意义，只关心最新的值。

#### 数据倒灌

一个LiveData被多次订阅后，每次都会收到最新的值；存在数据倒灌，一定是黏性的。

> 先setValue/postValue,后调用observe(new Obs())，至此收到了回调。然后再第二次调用observe(new anotherObs()),如果还能收到第一次的回调，则为“数据倒灌”。

只要将LiveData变为“非粘性”的，就一定不会出现数据倒灌的问题了。

##### 数据倒灌原因

```java
// LiveData Android29
private void considerNotify(ObserverWrapper observer) {
    if (!observer.mActive) {
        return;
    }
    // Check latest state b4 dispatch. Maybe it changed state but we didn't get the event yet.
    //
    // we still first check observer.active to keep it as the entrance for events. So even if
    // the observer moved to an active state, if we've not received that event, we better not
    // notify for a more predictable notification order.
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    if (observer.mLastVersion >= mVersion) { // #1
        return;
    }
    observer.mLastVersion = mVersion;
    observer.mObserver.onChanged((T) mData);
}
```

ObserverWrapper.mLastVersion=-1，在observe时，`observer.mLastVersion >= mVersion`不成立，会立即将LiveData最后的数据倒灌给Observer。

#### 解决方案

##### SingleLiveEvent（不能解决黏性问题，解决的是先setValue后observe的数据倒灌问题，多个observe只有第一个能接收值）

[SingleLiveEvent.java](https://github.com/android/architecture-samples/blob/dev-todo-mvvm-live/todoapp/app/src/main/java/com/example/android/architecture/blueprints/todoapp/SingleLiveEvent.java)<br><https://juejin.im/post/5b2b1b2cf265da5952314b63>

- SingleLiveEvent特性

```
1. SingleLiveEvent，顾名思义，是一个只会发送一次更新的 LiveData
2. SingleLiveEvent只适合单个Observer，只有第一个Observer会接收到更新，有多个Observer订阅时就无效了
3. SingleLiveEvent解决的并不是粘性事件的问题，而是“数据倒灌”的问题；先setValue再observe还是能收到旧值
4. SingleLiveEvent适用场景：一次setValue后，多次observe，却只想消费一个observe。但是，SingleLiveEvent的问题在于它仅限于一个观察者。如果您无意中添加了多个，则只会调用一个，并且不能保证哪一个。
```

- SingleLiveEvent原理 <br>SingleLiveEvent维护了一个`mPending`，默认值为false的AtomicBoolean；在每次onChanged触发时，通过`mPending.compareAndSet(true, false)`来判断，期望为false，更改为true，默认mPending默认为false，调用setValue后mPending更新为true；也就是说，调用一次setValue，mPending=true，此时第一个Observer会收到更新，并将mPending改为true，那么第二个及后面的订阅者就收不到数据的更新了
- SingleLiveEvent源码

```java
public class SingleLiveEvent<T> extends MutableLiveData<T> {
    private static final String TAG = "hacket";
    private final AtomicBoolean mPending = new AtomicBoolean(false);
    @MainThread
    public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
        if (hasActiveObservers()) {
            Log.w(TAG, "Multiple observers registered but only one will be notified of changes.");
        }
        // Observe the internal MutableLiveData
        super.observe(owner, new Observer<T>() {
            @Override
            public void onChanged(@Nullable T t) {
                if (mPending.compareAndSet(true, false)) {
                    Log.w(TAG, "onChanged observer=" + observer);
                    observer.onChanged(t);
                }
            }
        });
    }
    @MainThread
    public void setValue(@Nullable T t) {
        mPending.set(true);
        super.setValue(t);
    }
    /**
     * Used for cases where T is Void, to make calls cleaner.
     */
    @MainThread
    public void call() {
        setValue(null);
    }
}
```

##### Event（事件包装类）

- Event事件包装类特性

```
1. 解决了数据倒灌问题，没有解决数据黏性问题
2. 只允许一个消费者消费事件；如果要支持多个消费者，后续的消费者需要调用peekContent()
```

- Event事件包装类原理 <br>对LiveData要发送的数据包装成Event；在收到LiveData更新时，第一个访问时，通过Event的hasBeenHandled变量置为true表示已经处理了，后续的Observer访问该变量就是true，直接返回null，即可实现一次性事件。
- 事件包装类源码

```kotlin
/**
 * https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150
 *
 * 事件包装
 *
 * Used as a wrapper for data that is exposed via a LiveData that represents an event.
 */
open class Event<out T>(private val content: T) {
    var hasBeenHandled = false
        private set // Allow external read but not write

    /**
     * Returns the content and prevents its use again.
     */
    fun getContentIfNotHandled(): T? {
        return if (hasBeenHandled) {
            null
        } else {
            hasBeenHandled = true
            content
        }
    }
    /**
     * Returns the content, even if it's already been handled.
     */
    fun peekContent(): T = content
}
```

使用：

```kotlin
class ListViewModel : ViewModel {
    private val _navigateToDetails = MutableLiveData<Event<String>>()
    val navigateToDetails : LiveData<Event<String>>
        get() = _navigateToDetails
    fun userClicksOnButton(itemId: String) {
        _navigateToDetails.value = Event(itemId)  // Trigger the event by setting a new Event as a new value
    }
}
myViewModel.navigateToDetails.observe(this, Observer {
    it.getContentIfNotHandled()?.let { // Only proceed if the event has never been handled
        startActivity(DetailsActivity...)
    }
})
```

> [[译] 在 SnackBar，Navigation 和其他事件中使用 LiveData（SingleLiveEvent 案例）](https://juejin.cn/post/6844903623252508685)

###### EventLiveData(typealias封装事件包装类)

```kotlin
/**
 * https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150
 *
 * 事件包装
 *
 * Used as a wrapper for data that is exposed via a LiveData that represents an event.
 */
open class Event<out T>(private val content: T) {

    var hasBeenHandled = false
        private set // Allow external read but not write

    /**
     * Returns the content and prevents its use again.
     */
    fun getContentIfNotHandled(): T? {
        return if (hasBeenHandled) {
            null
        } else {
            hasBeenHandled = true
            content
        }
    }

    /**
     * Returns the content, even if it's already been handled.
     */
    fun peekContent(): T = content
}

// 为 LiveData<Event<T>>提供类型别名，使用 EventLiveData<T> 即可
typealias EventMutableLiveData<T> = MutableLiveData<Event<T>> // ktlint-disable experimental:type-parameter-list-spacing

typealias EventLiveData<T> = LiveData<Event<T>> // ktlint-disable experimental:type-parameter-list-spacing

fun <T> EventMutableLiveData<T>.setValueEvent(value: T) {
    this.value = Event(value)
}

fun <T> EventMutableLiveData<T>.postValueEvent(value: T) {
    this.postValue(Event(value))
}

inline fun <T> EventLiveData<T>.observeEvent(
    owner: LifecycleOwner,
    crossinline onChanged: (T) -> Unit
) {
    observe(owner) {
        it.getContentIfNotHandled()?.let(onChanged)
    }
}
```

使用：

```kotlin
class StickyViewModel : ViewModel() {
    val eventLiveData = EventMutableLiveData<Int>()
    fun update(value: Int) {
        eventLiveData.setValueEvent(value)
    }
}

// 订阅
viewModel.eventLiveData.observeEvent(this) { t ->
    // ...
}
```

##### ~~“反射干预 LastVersion”~~

```java
private void considerNotify(ObserverWrapper observer) {
    if (!observer.mActive) {
        return;
    }
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    observer.mLastVersion = mVersion;
    //noinspection unchecked
    observer.mObserver.onChanged((T) mData);
}
```

```kotlin
class SmartLiveData<T> : MutableLiveData<T>() {
    override fun observe(owner: LifecycleOwner, observer: Observer<in T>) {
        super.observe(owner, observer)
        // get livedata version
        val livedataVersion = javaClass.superclass.superclass.getDeclaredField("mVersion")
        livedataVersion.isAccessible = true
        // 获取livedata version的值
        val livedataVerionValue = livedataVersion.get(this)
        // 取 mObservers Filed
        val mObserversFiled = javaClass.superclass.superclass.getDeclaredField("mObservers")
        mObserversFiled.isAccessible = true
        // 取 mObservers 对象
        val objectObservers = mObserversFiled.get(this)
        // 取 mObservers 对象 所属的class SafeIterableMap
        val objectObserversClass = objectObservers.javaClass
        val methodGet = objectObserversClass.getDeclaredMethod("get", Any::class.java)
        methodGet.isAccessible = true
        // LifecycleBoundObserver
        val objectWrapper = (methodGet.invoke(objectObservers, observer) as Map.Entry<*, *>).value
        // ObserverWrapper
        val mLastVersionField = objectWrapper!!.javaClass.superclass.getDeclaredField("mLastVersion")
        mLastVersionField.isAccessible = true
        // 将 mVersion的值 赋值给 mLastVersion 使其相等
        mLastVersionField.set(objectWrapper, livedataVerionValue)
        Log.w("hacket", "SmartLiveData observe, observer=$observer")
    }
}
```

貌似并没有什么用，修改version是在observe后，此时已经收到了之前Observable的值了，解决不了数据倒灌问题。

- [ ] <https://blog.csdn.net/geyuecang/article/details/89028283>

##### UnPeek-LiveData (解决黏性和数据倒灌问题)

- UnPeek-LiveData特性：

```
1. 解决了黏性事件和数据倒灌问题
2. 适用于一次性事件通知，即MVI的Event订阅（Event更多的是该事件是一次的，用完就丢弃）
3. 不适用于MVI的State订阅（State关心的是最新的数据）
```

- UnPeek-LiveData原理：

```
1. UnPeekLiveData内部维护了一个mCurrentVersion版本，默认为-1
2. ObserverWrapper(Observer包装成了ObserverWrapper，里面维护了一个version)在observe时带了ProtectedUnPeekLiveData的mCurrentVersion，即observer时Observer和UnPeekLiveData的version是一样的
3. 当UnPeekLiveData更新数据时，ObserverWrapper回调了onChanged，此时判断UnPeekLiveData的version比ObserverWrapper的version大才更新数据，否则不更新，这样就避免了首次observe还会收到旧数据的黏性问题（对应的数据倒灌也不存在了）。
4. UnPeekLiveData在setValue/postValue会将mCurrentVersion版本加1，这样UnPeekLiveData的version就比ObserverWrapper的版本大了，那么ObserverWrapper就可以收到最新值了
```

- UnPeek-LiveData实现源码：

```java
public class ProtectedUnPeekLiveData<T> extends LiveData<T> {
  private final static int START_VERSION = -1;
  private final AtomicInteger mCurrentVersion = new AtomicInteger(START_VERSION);
  protected boolean isAllowNullValue;
  
  @Override
  public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<? super T> observer) {
    super.observe(owner, createObserverWrapper(observer, mCurrentVersion.get()));
  }
  @Override
  public void observeForever(@NonNull Observer<? super T> observer) {
    super.observeForever(createObserverWrapper(observer, mCurrentVersion.get()));
  }
  public void observeSticky(@NonNull LifecycleOwner owner, @NonNull Observer<T> observer) {
    super.observe(owner, createObserverWrapper(observer, START_VERSION));
  }
  public void observeStickyForever(@NonNull Observer<? super T> observer) {
    super.observeForever(createObserverWrapper(observer, START_VERSION));
  }
  @Override
  protected void setValue(T value) {
    mCurrentVersion.getAndIncrement();
    super.setValue(value);
  }
  class ObserverWrapper implements Observer<T> {
    private final Observer<? super T> mObserver;
    private int mVersion = START_VERSION;

    public ObserverWrapper(@NonNull Observer<? super T> observer, int version) {
      this.mObserver = observer;
      this.mVersion = version;
    }

    @Override
    public void onChanged(T t) {
      if (mCurrentVersion.get() > mVersion && (t != null || isAllowNullValue)) {
        mObserver.onChanged(t);
      }
    }

    @SuppressWarnings("unchecked")
    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      ObserverWrapper that = (ObserverWrapper) o;
      return Objects.equals(mObserver, that.mObserver);
    }

    @Override
    public int hashCode() {
      return Objects.hash(mObserver);
    }
  }
  @Override
  public void removeObserver(@NonNull Observer<? super T> observer) {
    if (observer.getClass().isAssignableFrom(ObserverWrapper.class)) {
      super.removeObserver(observer);
    } else {
      super.removeObserver(createObserverWrapper(observer, START_VERSION));
    }
  }

  private ObserverWrapper createObserverWrapper(@NonNull Observer<? super T> observer, int version) {
    return new ObserverWrapper(observer, version);
  }
  public void clear() {
    super.setValue(null);
  }
}
```

参考：[ProtectedUnPeekLiveData.java]()

##### MutableSharedFlow

```kotlin
class ListViewModel : ViewModel() {
    val _navigateToDetails = MutableSharedFlow<Boolean>()
    fun userClicksOnButton() {
        viewModelScope.launch {
            _navigateToDetails.emit(true)
        }
    }
}
```

SharedFlow这个热流

```kotlin
public fun <T> MutableSharedFlow(
    replay: Int = 0,
    extraBufferCapacity: Int = 0,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND
): MutableSharedFlow<T>
```

- 参数replay: 当有新的订阅者collect的时候（可以理解为collect就是Livedata中的observe），发送几个(replay)collect之前已经发送过的数据给它,默认值是0，就是不会收到之前的消息的；replay改成1就和LiveData效果一样

#### LiveData数据黏性和数据倒灌解决方案小结

|                                   | 黏性问题 | 数据倒灌 | 特点                                                                                        | 原理                                                                                                                                                    |
| --------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| SingleLiveEvent                   | ×    | √    | 能解决数据倒灌，解决不了黏性问题；Google出品；只有第一个Observer订阅后能收到更新数据，后续的Observer订阅收不到                        | SingleLiveEvent维护一个默认值为false的mPengding，onChanged更新时，不是true，就收不到数据回调；setValue更新mPending为true                                                           |
| Event事件包装类                        | ×    | √    | 能解决数据倒灌，解决不了黏性问题；和SingleLiveEvent一样只能单个Observer消费事件，多个Observer订阅调用peekContent()可返回已经消费的事件 | 对LiveData发射的数据进行Event包装，通过Event内部变量hasBeenHandled控制只有首次访问的Observer能获取到该事件，从而保证事件的一次性                                                                  |
| EventLiveData(typealis Event事件包装) | ×    | √    | 同Event事件包装类                                                                               | 同Event事件包装类                                                                                                                                           |
| UnpeekLiveData                    | √    | √    | 解决数据倒灌和黏性问题                                                                               | UnpeekLiveData维护了一个version，Observer也维护了一个version，默认两个相等，只有UnpeekLiveData的version大于Observer的version时，Observer才能收到更新；setValue时UnpeekLiveData的version会自增 |
| MutableSharedFlow                 | √    | √    | 能解决黏性和数据倒灌问题                                                                              | replay=0；replay=1就和LiveData一样                                                                                                                         |

## Ref

-  [x] 关于LiveData粘性事件所带来问题的解决方案<br><https://www.jianshu.com/p/d0244c4c7cc9>
-  [x] <https://github.com/KunMinX/UnPeek-LiveData>

)

# LiveData小结

## 0、什么是LiveData？

1. LiveData 是可感知生命周期的，可观察的，数据持有者。
2. 观察者的回调在主线程
3. Observer在LifecycleOwner处于DESTROY时订阅自动取消
4. LifecycleOwner不在active（state>=STARTED）时，不更新回调onChanged；在active时，回调onChanged

## 1、LiveData的实现原理？

1. 在LiveData.observe的时，注册了一个LifecycleObserver(包装成了LifecycleBoundObserver)，就可以监听到LifecycleOwner的生命周期变化的回调(`onStateChanged()`)。
2. 在onStateChanded中，如果发现state为`Lifecycle.State.DESTROYED`的话，会直接removeObserver；如果是其他状态，调用`activeStateChanged()`然后`dispatchingValue()`分发value
3. dispatchingValue中遍历所有的Observer，调用其onChanged()方法

## 2、LiveData postValue数据丢失的问题(postValue会有数据丢失)？

```java
static final Object NOT_SET = new Object();
volatile Object mPendingData = NOT_SET;
final Object mDataLock = new Object();
// If you called this method multiple times before a main thread executed a posted task,
// only the last value would be dispatched.
protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        postTask = mPendingData == NOT_SET; // 首次postValue时postTask为true
        mPendingData = value;
    }
    if (!postTask) { // 首次postValue postTask为true，不会return；多次post
        return;
    }
    // 通过Handler提交一个Runable
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}
private final Runnable mPostValueRunnable = new Runnable() {
    @Override
    public void run() {
        Object newValue;
        synchronized (mDataLock) {
            newValue = mPendingData;
            mPendingData = NOT_SET;
        }
        setValue((T) newValue);
    }
};
```

1. 在提交的postValue的Runnable未执行前，如果调用多次postValue，只有最新的value会被分发
2. 多次提交postValue，只会更新mPendingData，导致多次提交只有最后一次的value有效
3. 或者说postValue会有数据的丢失，其实就是在提交的Runnable未执行时，多次postValue，只有最后一次postValue的值会存在，前面提交的值就被覆盖掉了，表现看起来就是丢失了

## 3、LiveData黏性问题？黏性问题的原理？怎么解决黏性问题？

**什么是LiveData的黏性问题？**<br>LiveData setValue一次值后，后续有新的Observer注册时，会直接把之前的旧值给这个Observer<br>**为什么要设计成这样？**<br>LiveData的设计也不是为了传递一次性事件的，它是为了反应View当前状态的，View层只需要根据当前LiveData的值去渲染数据就行，非激活状态时View都不可见，就算更新了也没意义，只关心最新的值。<br>**黏性问题的原理**

```java
// LiveData Android29
private void considerNotify(ObserverWrapper observer) {
    if (!observer.mActive) {
        return;
    }
    // Check latest state b4 dispatch. Maybe it changed state but we didn't get the event yet.
    //
    // we still first check observer.active to keep it as the entrance for events. So even if
    // the observer moved to an active state, if we've not received that event, we better not
    // notify for a more predictable notification order.
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    if (observer.mLastVersion >= mVersion) { // #1
        return;
    }
    observer.mLastVersion = mVersion;
    observer.mObserver.onChanged((T) mData);
}
```

首次订阅的Observer的mLastVersion=-1，不会大于等于mVersion，导致Observer的onChanged会执行<br>**黏性问题的解决**

1. Google官方的SingleLiveEvent

> 只适用于单个Observer的订阅，多个Observer订阅，只有第一个Observer能收到值；只适用于只有首个Observer可以收到更新值的场景

2. UnPeek-LiveData

> - UnPeekLiveData维护了一个verion，默认值-1；
> - UnPeekLiveData setValue时verions自增
> - observe()方法中，会把UNPeekLiveData的version带给Observer
> - 自定义一个ObserverWrapper ，包装了传递进来的Observer，里面也维护了一个mVersion ，默认值-1
> - 在ObserverWrapper的onChanged()方法中判断，只有UnPeekLiveData.version>mVerion，才执行Observer的onChanged()方法；在未setValue情况下，新observe的Observer的verion就和UnPeekLiveData的version一样了，这样就避免了数据的倒灌

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1658330526800-67035658-9a2d-450f-bd1b-f4cbfd0a64e2.png#averageHue=%23fefdfc&clientId=uce8549e4-9c98-4&from=paste&height=518&id=uf8fad9d8&originHeight=777&originWidth=1497&originalType=binary&ratio=1&rotation=0&showTitle=false&size=126414&status=done&style=none&taskId=u163d1936-ebc4-41e5-b37b-76b4ea0e88f&title=&width=998)

## 4、LiveData setValue和postValue的区别

```java
liveData.postValue("a");
liveData.setValue("b");
```

先输出b再输出a
