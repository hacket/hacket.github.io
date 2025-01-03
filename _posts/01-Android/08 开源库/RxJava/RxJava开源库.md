---
date created: 2024-12-24 00:37
date updated: 2024-12-25 00:16
dg-publish: true
---

# [RxLifecycle](https://github.com/trello/RxLifecycle)

RxJava通过线程调度器更容易控制和切换线程，种种优点，使用它的人也越来越多。但是使用不好，很容易导致内存泄露。用来严格控制由于发布了一个订阅后，由于没有及时取消，导致Activity/Fragment无法销毁导致的内存泄露。

## 引入

```groovy
// RxLifecycle基础库
compile 'com.trello.rxlifecycle2:rxlifecycle:2.1.0'

// Android使用的库，里面使用了Android的生命周期方法
// 内部引用了基础库，如果使用此库则无需再引用基础库
compile 'com.trello.rxlifecycle2:rxlifecycle-android:2.1.0'

// Android组件库，里面定义了例如RxAppCompatActivity、RxFragment之类的Android组件
// 内部引用了基础库和Android库，如果使用此库则无需再重复引用
compile 'com.trello.rxlifecycle2:rxlifecycle-components:2.1.0'

// Android使用的库，继承NaviActivity使用
compile 'com.trello.rxlifecycle2:rxlifecycle-navi:2.1.0'

// Android使用的库，继承LifecycleActivity使用
// 需要引入Google的仓库支持，用法和rxlifecycle-navi类似
compile 'com.trello.rxlifecycle2:rxlifecycle-android-lifecycle:2.1.0'

// Google的仓库支持
allprojects {
    repositories {
        jcenter()
        maven { url 'https://dl.google.com/dl/android/maven2/' }
    }
}

// 支持Kotlin语法的RxLifecycle基础库
compile 'com.trello.rxlifecycle2:rxlifecycle-kotlin:2.1.0'

// 支持Kotlin语法的Android库
compile 'com.trello.rxlifecycle2:rxlifecycle-android-lifecycle-kotlin:2.1.0'
```

### 基本API

#### 1、bindToLifecycle()

在子类使用Observable中的compose操作符，调用，完成Observable发布的事件和当前的组件绑定，实现生命周期同步。从而实现当前组件生命周期结束时，自动取消对Observable订阅。<br />使用compose(this.bindToLifecycle())方法绑定Activity的生命周期，在onStart方法中绑定，在onStop方法被调用后就会解除绑定，以此类推。

```java
protected void onStart() {
        super.onStart();
        Observable.interval(1, TimeUnit.SECONDS)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .compose(this.<Long>bindToLifecycle())
                .subscribe();
}
```

#### 2、bindUntilEvent()

使用ActivityEvent类，其中的CREATE、START、 RESUME、PAUSE、STOP、 DESTROY分别对应生命周期内的方法。使用bindUntilEvent指定在哪个生命周期方法调用时取消订阅。

```java
Observable.interval(1, TimeUnit.SECONDS)
    .compose(this.bindUntilEvent(ActivityEvent.PAUSE))
    .subscribe(mSub);
```

#### 使用

首先你的Activity/Fragment需继承`RxAppCompatActivity/RxFragment`，目前支持的有`RxAppCompatActivity`、`RxFragment`、`RxDialogFragment`、`RxFragmentActivity`。<br />然后，在使用时用你的`Observable`调用一下`compose()`

### 案例

#### 1、手动设置在Activity的onPause取消订阅`bindUntilEvent(@NonNull ActivityEvent event)`

```java
// Specifically bind this until onPause()
//Note:例子1:
Observable
        .interval(1, TimeUnit.SECONDS)
        .doOnUnsubscribe(new Action0() {
            @Override
            public void call() {
                Log.i(TAG, "Unsubscribing subscription from onCreate()");
            }
        })
        // Note:手动设置在activity onPause的时候取消订阅
        .compose(this.<Long>bindUntilEvent(ActivityEvent.PAUSE))
        .subscribe(new Action1<Long>() {
            @Override
            public void call(Long num) {
                Log.i(TAG, "Started in onCreate(), running until onPause(): " + num);
            }
        });
```

#### 2、自动取消订阅`bindToLifecycle()`

```java
//Note:例子2:
// Using automatic unsubscription, this should determine that the correct time to
// unsubscribe is onStop (the opposite of onStart).
Observable.interval(1, TimeUnit.SECONDS)
        .doOnUnsubscribe(new Action0() {
            @Override
            public void call() {
                Log.i(TAG, "Unsubscribing subscription from onStart()");
            }
        })
        //Note:bindToLifecycle的自动取消订阅示例，因为是在onStart的时候调用，所以在onStop的时候自动取消订阅
        .compose(this.<Long>bindToLifecycle())
        .subscribe(new Action1<Long>() {
            @Override
            public void call(Long num) {
                Log.i(TAG, "Started in onStart(), running until in onStop(): " + num);
            }
        });
```

#### 3、在Activity的onDestroy()中取消

```java
//Note:例子3:
// `this.<Long>` is necessary if you're compiling on JDK7 or below.
// If you're using JDK8+, then you can safely remove it.
Observable.interval(1, TimeUnit.SECONDS)
        .doOnUnsubscribe(new Action0() {
            @Override
            public void call() {
                Log.i(TAG, "Unsubscribing subscription from onResume()");
            }
        })
        //Note:手动设置在activity onDestroy的时候取消订阅
        .compose(this.<Long>bindUntilEvent(ActivityEvent.DESTROY))
        .subscribe(new Action1<Long>() {
            @Override
            public void call(Long num) {
                Log.i(TAG, "Started in onResume(), running until in onDestroy(): " + num);
            }
        });
```

### RxLifecycle Providers

LifecycleProvider可以传递给MVP中的P使用。<br />RxAppCompatActivity直接实现了LifecycleProvider，可以在里面直接调用方法。

### RxLifecycle ActivityLifecycleCallbacks实现

<https://gist.github.com/dlew/33b650bd8ef3d360ff7d>

```java

class RxActivityLifecycleCallbacks implements Application.ActivityLifecycleCallbacks {

    private static RxActivityLifecycleCallbacks instance;
    private Map<Activity, BehaviorSubject<LifecycleEvent>> activityBehaviorSubjectMap;

    public static final RxActivityLifecycleCallbacks getInstance(Context context) {
        if (instance == null) {
            instance = new RxActivityLifecycleCallbacks(context);
        }
        return instance;
    }

    private RxActivityLifecycleCallbacks(Context context) {

        activityBehaviorSubjectMap = new ConcurrentHashMap<Activity, BehaviorSubject<LifecycleEvent>>();

        Application application = (Application) context.getApplicationContext();

        application.registerActivityLifecycleCallbacks(this);
    }

    public Observable<LifecycleEvent> getLifecycle(Activity activity) {

        BehaviorSubject<LifecycleEvent> subject = activityBehaviorSubjectMap.get(activity);

        if (subject == null) {
           throw new IllegalStateException("The Activity is outside the lifecycle; cannot bind to it!");
        }

        return subject.asObservable();
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        activityBehaviorSubjectMap.put(activity, BehaviorSubject.create(LifecycleEvent.CREATE));
    }

    @Override
    public void onActivityStarted(Activity activity) {
        activityBehaviorSubjectMap.get(activity).onNext(LifecycleEvent.START);
    }

    @Override
    public void onActivityResumed(Activity activity) {
        activityBehaviorSubjectMap.get(activity).onNext(LifecycleEvent.RESUME);
    }

    @Override
    public void onActivityPaused(Activity activity) {
        activityBehaviorSubjectMap.get(activity).onNext(LifecycleEvent.PAUSE);
    }

    @Override
    public void onActivityStopped(Activity activity) {
        activityBehaviorSubjectMap.get(activity).onNext(LifecycleEvent.STOP);
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        activityBehaviorSubjectMap.remove(activity).onNext(LifecycleEvent.DESTROY);

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
        // Not tracked
    }
}
```

### Reference

- [ ] RxAndroid之Rxlifecycle使用

> 有一些注意点<br /><http://blog.csdn.net/jdsjlzx/article/details/51527542>

- [ ] RxLifecycle 使用与原理

> RxLifeCycle原理<br /><http://brucezz.itscoder.com/articles/2016/09/19/usage_and_principle_of_rxlifecycle/>

- [ ] RxLifecycle源码解析－当Activity被destory时自动停掉网络请求<br />[http://wingjay.com/2016/07/14/RxLifecycle源码解析－当Activity被destory时自动暂停网络请求/](http://wingjay.com/2016/07/14/RxLifecycle%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%EF%BC%8D%E5%BD%93Activity%E8%A2%ABdestory%E6%97%B6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82/)

# [AutoDispose2](https://uber.github.io/AutoDispose/)

## 引入

```
// Java
implementation 'com.uber.autodispose2:autodispose:x.y.z'

// LifecycleScopeProvider
implementation 'com.uber.autodispose2:autodispose-lifecycle:x.y.z'

// Android extensions:
implementation 'com.uber.autodispose2:autodispose-android:x.y.z'

// Android Architecture Components extensions : 引入这个会把前面的都引入进来
// AutoDispose 1.x
implementation 'com.uber.autodispose:autodispose-android-archcomponents:x.y.z'
// AutoDispose 2.x
implementation 'com.uber.autodispose2:autodispose-androidx-lifecycle:x.y.z'

// Androidx-Lifecycle Test extensions:
// AutoDispose 1.x
implementation 'com.uber.autodispose:autodispose-android-archcomponents-test:x.y.z'
// AutoDispose 2.x
implementation 'com.uber.autodispose2:autodispose-androidx-lifecycle-test:x.y.z'
```

### RxLifecycle interop (AutoDispose 1.x/RxJava 2.x only):

```
// autodispose-rxlifecycle
implementation 'com.uber.autodispose:autodispose-rxlifecycle:x.y.z'

// autodispose-rxlifecycle3
implementation 'com.uber.autodispose:autodispose-rxlifecycle3:x.y.z'
```

## 使用

### Java版本

1. 根据subscribe的时lifecycle owner状态来决定dispose的时机

```java
Observable.interval(1, TimeUnit.SECONDS)
    .to(autoDisposable(AndroidLifecycleScopeProvider.from(this)))
    .subscribe();
```

> onCreate→onDestroy  onStart→onStop onResume→onPause

2. 指定Lifecycle.Event dispose

```java
Observable.interval(1, TimeUnit.SECONDS)
    .to(autoDisposable(AndroidLifecycleScopeProvider.from(this, Lifecycle.Event.ON_DESTROY)))
    .subscribe();
```

### Kotlin版本

1. 根据subscribe的时lifecycle owner状态来决定dispose的时机

```kotlin
private val scopeProvider by lazy { AndroidLifecycleScopeProvider.from(this) }

// Activity
// Using automatic disposal, this should determine that the correct time to
// dispose is onDestroy (the opposite of onCreate).
Observable.interval(1, TimeUnit.SECONDS)
    .autoDispose(scopeProvider)
    .subscribeBy { }
    
// Fragment
Observable.interval(1, TimeUnit.SECONDS)
    .autoDispose(AndroidLifecycleScopeProvider.from(viewLifecycleOwner))
    .subscribeBy { }
```

> onCreate→onDestroy  onStart→onStop onResume→onPause

2. 指定Lifecycle.Event dispose

```
// Setting a specific untilEvent, this should dispose in onDestroy.
Observable.interval(1, TimeUnit.SECONDS)
    .autoDispose(
        AndroidLifecycleScopeProvider.from(this, Lifecycle.Event.ON_DESTROY))
    .subscribeBy { }
```

### ViewScopeProvider

在View#onDetachWindow时，调用Observer#onComplete，结束当前事件流

```java
Observable
    .create(ObservableOnSubscribe<Int> {
        for (i in 0..9) {
            if (!it.isDisposed) {
                it.onNext(i)
            }
            try {
                Thread.sleep(1000)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }
        it.onComplete()
    })
    .subscribeOn(io.reactivex.rxjava3.schedulers.Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .autoDispose(ViewScopeProvider.from(this))
    .subscribe(
            {
                "onNext $it".logi()
                onNext.invoke("onNext $it".log())
            },
            {
                "onError ${it.message}".loge()
            },
            {
                "onComplete".logd()
            }
    )
```

### 自定义ScopeProvider，参考ViewScopeProvider

### 自定义LifeScopeProvider

#### AutoDisposeActivity

```java
public abstract class AutoDisposeActivity extends Activity
    implements LifecycleScopeProvider<AutoDisposeActivity.ActivityEvent> {

  public enum ActivityEvent {
    CREATE,
    START,
    RESUME,
    PAUSE,
    STOP,
    DESTROY
  }

  /**
   * This is a function of current event -> target disposal event. That is to say that if event A
   * returns B, then any stream subscribed to during A will autodispose on B. In Android, we make
   * symmetric boundary conditions. Create -> Destroy, Start -> Stop, etc. For anything after Resume
   * we dispose on the next immediate destruction event. Subscribing after Destroy is an error.
   */
  private static final CorrespondingEventsFunction<ActivityEvent> CORRESPONDING_EVENTS =
      activityEvent -> {
        switch (activityEvent) {
          case CREATE:
            return ActivityEvent.DESTROY;
          case START:
            return ActivityEvent.STOP;
          case RESUME:
            return ActivityEvent.PAUSE;
          case PAUSE:
            return ActivityEvent.STOP;
          case STOP:
            return ActivityEvent.DESTROY;
          default:
            throw new LifecycleEndedException("Cannot bind to Activity lifecycle after destroy.");
        }
      };

  private final BehaviorSubject<ActivityEvent> lifecycleEvents = BehaviorSubject.create();

  @Override
  public Observable<ActivityEvent> lifecycle() {
    return lifecycleEvents.hide();
  }

  @Override
  public CorrespondingEventsFunction<ActivityEvent> correspondingEvents() {
    return CORRESPONDING_EVENTS;
  }

  @Nullable
  @Override
  public ActivityEvent peekLifecycle() {
    return lifecycleEvents.getValue();
  }

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    lifecycleEvents.onNext(ActivityEvent.CREATE);
  }

  @Override
  protected void onStart() {
    super.onStart();
    lifecycleEvents.onNext(ActivityEvent.START);
  }

  @Override
  protected void onResume() {
    super.onResume();
    lifecycleEvents.onNext(ActivityEvent.RESUME);
  }

  @Override
  protected void onPause() {
    lifecycleEvents.onNext(ActivityEvent.PAUSE);
    super.onPause();
  }

  @Override
  protected void onStop() {
    lifecycleEvents.onNext(ActivityEvent.STOP);
    super.onStop();
  }

  @Override
  protected void onDestroy() {
    lifecycleEvents.onNext(ActivityEvent.DESTROY);
    super.onDestroy();
  }
}
```

#### AutoDisposeFragment

```java
/**
 * A {@link Fragment} example implementation for making one implement {@link
 * LifecycleScopeProvider}. One would normally use this as a base fragment class to extend others
 * from.
 */
public abstract class AutoDisposeFragment extends Fragment
    implements LifecycleScopeProvider<AutoDisposeFragment.FragmentEvent> {

  public enum FragmentEvent {
    ATTACH,
    CREATE,
    CREATE_VIEW,
    START,
    RESUME,
    PAUSE,
    STOP,
    DESTROY_VIEW,
    DESTROY,
    DETACH
  }

  /**
   * This is a function of current event -> target disposal event. That is to say that if event A
   * returns B, then any stream subscribed to during A will autodispose on B. In Android, we make
   * symmetric boundary conditions. Create -> Destroy, Start -> Stop, etc. For anything after Resume
   * we dispose on the next immediate destruction event. Subscribing after Detach is an error.
   */
  private static final CorrespondingEventsFunction<FragmentEvent> CORRESPONDING_EVENTS =
      event -> {
        switch (event) {
          case ATTACH:
            return FragmentEvent.DETACH;
          case CREATE:
            return FragmentEvent.DESTROY;
          case CREATE_VIEW:
            return FragmentEvent.DESTROY_VIEW;
          case START:
            return FragmentEvent.STOP;
          case RESUME:
            return FragmentEvent.PAUSE;
          case PAUSE:
            return FragmentEvent.STOP;
          case STOP:
            return FragmentEvent.DESTROY_VIEW;
          case DESTROY_VIEW:
            return FragmentEvent.DESTROY;
          case DESTROY:
            return FragmentEvent.DETACH;
          default:
            throw new LifecycleEndedException("Cannot bind to Fragment lifecycle after detach.");
        }
      };

  private final BehaviorSubject<FragmentEvent> lifecycleEvents = BehaviorSubject.create();

  @Override
  public Observable<FragmentEvent> lifecycle() {
    return lifecycleEvents.hide();
  }

  @Override
  public CorrespondingEventsFunction<FragmentEvent> correspondingEvents() {
    return CORRESPONDING_EVENTS;
  }

  @Nullable
  @Override
  public FragmentEvent peekLifecycle() {
    return lifecycleEvents.getValue();
  }

  @Override
  public void onAttach(Context context) {
    super.onAttach(context);
    lifecycleEvents.onNext(FragmentEvent.ATTACH);
  }

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    lifecycleEvents.onNext(FragmentEvent.CREATE);
  }

  @Override
  public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);
    lifecycleEvents.onNext(FragmentEvent.CREATE_VIEW);
  }

  @Override
  public void onStart() {
    super.onStart();
    lifecycleEvents.onNext(FragmentEvent.START);
  }

  @Override
  public void onResume() {
    super.onResume();
    lifecycleEvents.onNext(FragmentEvent.RESUME);
  }

  @Override
  public void onPause() {
    lifecycleEvents.onNext(FragmentEvent.PAUSE);
    super.onPause();
  }

  @Override
  public void onStop() {
    lifecycleEvents.onNext(FragmentEvent.STOP);
    super.onStop();
  }

  @Override
  public void onDestroyView() {
    lifecycleEvents.onNext(FragmentEvent.DESTROY_VIEW);
    super.onDestroyView();
  }

  @Override
  public void onDestroy() {
    lifecycleEvents.onNext(FragmentEvent.DESTROY);
    super.onDestroy();
  }

  @Override
  public void onDetach() {
    lifecycleEvents.onNext(FragmentEvent.DETACH);
    super.onDetach();
  }
}
```

#### AutoDisposeView

```java
/**
 * An example implementation of an AutoDispose View with lifecycle handling and precondition checks
 * using {@link LifecycleScopeProvider}. The precondition checks here are only different from what
 * {@link ViewScopeProvider} provides in that it will check against subscription in the constructor.
 */
public abstract class AutoDisposeView extends View
    implements LifecycleScopeProvider<AutoDisposeView.ViewEvent> {

  /**
   * This is a function of current event -> target disposal event. That is to say that if event
   * "Attach" returns "Detach", then any stream subscribed to during Attach will autodispose on
   * Detach.
   */
  private static final CorrespondingEventsFunction<ViewEvent> CORRESPONDING_EVENTS =
      viewEvent -> {
        switch (viewEvent) {
          case ATTACH:
            return ViewEvent.DETACH;
          default:
            throw new LifecycleEndedException("Cannot bind to View lifecycle after detach.");
        }
      };

  @Nullable private BehaviorSubject<ViewEvent> lifecycleEvents = null;

  public AutoDisposeView(Context context) {
    this(context, null);
  }

  public AutoDisposeView(Context context, @Nullable AttributeSet attrs) {
    this(context, attrs, View.NO_ID);
  }

  public AutoDisposeView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    init();
  }

  @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
  public AutoDisposeView(
      Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
    super(context, attrs, defStyleAttr, defStyleRes);
    init();
  }

  private void init() {
    if (!isInEditMode()) {
      // This is important to gate so you don't break the IDE preview!
      lifecycleEvents = BehaviorSubject.create();
    }
  }

  public enum ViewEvent {
    ATTACH,
    DETACH
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    if (lifecycleEvents != null) {
      lifecycleEvents.onNext(ViewEvent.ATTACH);
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (lifecycleEvents != null) {
      lifecycleEvents.onNext(ViewEvent.DETACH);
    }
  }

  @SuppressWarnings("NullAway") // only null in layoutlib
  @Override
  public Observable<ViewEvent> lifecycle() {
    //noinspection ConstantConditions only in layoutlib
    return lifecycleEvents.hide();
  }

  @Override
  public CorrespondingEventsFunction<ViewEvent> correspondingEvents() {
    return CORRESPONDING_EVENTS;
  }

  @SuppressWarnings("NullAway") // only null in layoutlib
  @Nullable
  @Override
  public ViewEvent peekLifecycle() {
    //noinspection ConstantConditions only in layoutlib
    return lifecycleEvents.getValue();
  }
}
```

#### AutoDisposeViewHolder

```java
/**
 * Example implementation of a {@link androidx.recyclerview.widget.RecyclerView.ViewHolder}
 * implementation that implements {@link LifecycleScopeProvider}. This could be useful for cases
 * where you have subscriptions that should be disposed upon unbinding or otherwise aren't
 * overwritten in future binds.
 */
public abstract class AutoDisposeViewHolder extends BindAwareViewHolder
        implements LifecycleScopeProvider<AutoDisposeViewHolder.ViewHolderEvent> {

    public enum ViewHolderEvent {
        BIND,
        UNBIND
    }

    private static final CorrespondingEventsFunction<ViewHolderEvent> CORRESPONDING_EVENTS =
            viewHolderEvent -> {
                switch (viewHolderEvent) {
                    case BIND:
                        return ViewHolderEvent.UNBIND;
                    default:
                        throw new LifecycleEndedException("Cannot use ViewHolder lifecycle after unbind.");
                }
            };

    private final BehaviorSubject<ViewHolderEvent> lifecycleEvents = BehaviorSubject.create();

    public AutoDisposeViewHolder(View itemView) {
        super(itemView);
    }

    @Override
    public CorrespondingEventsFunction<ViewHolderEvent> correspondingEvents() {
        return CORRESPONDING_EVENTS;
    }

    @Override
    public Observable<ViewHolderEvent> lifecycle() {
        return lifecycleEvents.hide();
    }

    @Nullable
    @Override
    public ViewHolderEvent peekLifecycle() {
        return lifecycleEvents.getValue();
    }

    @Override
    protected void onBind() {
        lifecycleEvents.onNext(ViewHolderEvent.BIND);
    }

    @Override
    protected void onUnbind() {
        lifecycleEvents.onNext(ViewHolderEvent.UNBIND);
    }
}
```

#### AutoDisposeViewModel

```kotlin
/**
 * Demo base [ViewModel] that can automatically dispose itself in [onCleared].
 */
abstract class AutoDisposeViewModel : ViewModel(), LifecycleScopeProvider<ViewModelEvent> {

  // Subject backing the auto disposing of subscriptions.
  private val lifecycleEvents = BehaviorSubject.createDefault(CREATED)

  /**
   * The events that represent the lifecycle of a [ViewModel].
   *
   * The [ViewModel] lifecycle is very simple. It is created
   * and then allows you to clean up any resources in the
   * [ViewModel.onCleared] method before it is destroyed.
   */
  enum class ViewModelEvent {
    CREATED, CLEARED
  }

  /**
   * The observable representing the lifecycle of the [ViewModel].
   *
   * @return [Observable] modelling the [ViewModel] lifecycle.
   */
  override fun lifecycle(): Observable<ViewModelEvent> {
    return lifecycleEvents.hide()
  }

  /**
   * Returns a [CorrespondingEventsFunction] that maps the
   * current event -> target disposal event.
   *
   * @return function mapping the current event to terminal event.
   */
  override fun correspondingEvents(): CorrespondingEventsFunction<ViewModelEvent> {
    return CORRESPONDING_EVENTS
  }

  override fun peekLifecycle(): ViewModelEvent? {
    return lifecycleEvents.value
  }

  /**
   * Emit the [ViewModelEvent.CLEARED] event to
   * dispose off any subscriptions in the ViewModel.
   */
  override fun onCleared() {
    lifecycleEvents.onNext(ViewModelEvent.CLEARED)
    super.onCleared()
  }

  companion object {
    /**
     * Function of current event -> target disposal event. ViewModel has a very simple lifecycle.
     * It is created and then later on cleared. So we only have two events and all subscriptions
     * will only be disposed at [ViewModelEvent.CLEARED].
     */
    private val CORRESPONDING_EVENTS = CorrespondingEventsFunction<ViewModelEvent> { event ->
      when (event) {
        ViewModelEvent.CREATED -> ViewModelEvent.CLEARED
        else -> throw LifecycleEndedException(
            "Cannot bind to ViewModel lifecycle after onCleared.")
      }
    }
  }
}
```

## AutoDispose源码解析

这是一个简单的使用AutoDispose的例子

```java
Observable.interval(1, TimeUnit.SECONDS)
    .to(AutoDispose.autoDisposable(AndroidLifecycleScopeProvider.from(this)))
    .subscribe();
```

现在我们看看这个`.to()`，之前的rx版本为`as`

```java
// Observable
public final <R> R to(@NonNull ObservableConverter<T, ? extends R> converter) {
    return Objects.requireNonNull(converter, "converter is null").apply(this);
}
public interface ObservableConverter<@NonNull T, @NonNull R> {
    R apply(@NonNull Observable<T> upstream);
}
```

这个`to`操作符，就是传递一个ObservableConverter，然后调用apply方法，将upstream转换为另外一个R输出。

现在看`AutoDispose.autoDisposable`，然后一个AutoDisposeConverter

```java
// AutoDispose
public static <T> AutoDisposeConverter<T> autoDisposable(final ScopeProvider provider) {
    checkNotNull(provider, "provider == null");
    return autoDisposable(completableOf(provider));
}
```

autoDisposable()返回AutoDisposeConverter实现了一堆XXXConverter，在这里是ObservableConverter

```java
public interface AutoDisposeConverter<T>
    extends FlowableConverter<T, FlowableSubscribeProxy<T>>,
        ParallelFlowableConverter<T, ParallelFlowableSubscribeProxy<T>>,
        ObservableConverter<T, ObservableSubscribeProxy<T>>,
        MaybeConverter<T, MaybeSubscribeProxy<T>>,
        SingleConverter<T, SingleSubscribeProxy<T>>,
        CompletableConverter<CompletableSubscribeProxy> {}
```

### ScopeProvier

参数provier是一个ScopeProvider

```java
public interface ScopeProvider {
    ScopeProvider UNBOUND = Completable::never;
    CompletableSource requestScope() throws Exception;
}
```

实现有`ViewScopeProvider`和`LifecycleScopeProvider`

1. ViewScopeProvider 提供给view用的
2. LifecycleScopeProvider 绑定lifecycle

#### LifecycleScopeProvider

1. Observable lifecycle(); 获取Observable
2. CorrespondingEventsFunction correspondingEvents(); 事件的对应关系，建议弄成静态变量更好
3. E peekLifecycle(); 获取当前时刻最后可见的事件（the last seen lifecycle event）
4. CompletableSource requestScope()

### 上游upstream流程

```java
public static <T> AutoDisposeConverter<T> autoDisposable(final ScopeProvider provider) {
    checkNotNull(provider, "provider == null");
    return autoDisposable(completableOf(provider));
}
```

我们看下completableOf(ScopeProvider)

```java
// Scopes
public static Completable completableOf(ScopeProvider scopeProvider) {
    return Completable.defer(
        () -> {
          try {
            return scopeProvider.requestScope();
          } catch (OutsideScopeException e) {
            Consumer<? super OutsideScopeException> handler =
                AutoDisposePlugins.getOutsideScopeHandler();
            if (handler != null) {
              handler.accept(e);
              return Completable.complete();
            } else {
              return Completable.error(e);
            }
          }
        });
  }
```

用了defer操作符，在真正subscribe的时候才new Observable，而这个CompletableSource是通过ScopeProvider的`requestScope()`给返回

由completableOf得知CompletableSource是ScopeProvider提供的，接着我们看autoDisposable(CompletableSource)

```java
// AutoDispose
public static <T> AutoDisposeConverter<T> autoDisposable(final CompletableSource scope) {
    checkNotNull(scope, "scope == null");
    return new AutoDisposeConverter<T>() {
      @Override
      public ParallelFlowableSubscribeProxy<T> apply(final ParallelFlowable<T> upstream) {}
      @Override
      public CompletableSubscribeProxy apply(final Completable upstream) { }
      @Override
      public FlowableSubscribeProxy<T> apply(final Flowable<T> upstream) { }
      @Override
      public MaybeSubscribeProxy<T> apply(final Maybe<T> upstream) { }
      @Override
      public SingleSubscribeProxy<T> apply(final Single<T> upstream) { }
      
      @Override
      public ObservableSubscribeProxy<T> apply(final Observable<T> upstream) {
        if (!AutoDisposePlugins.hideProxies) {
          return new AutoDisposeObservable<>(upstream, scope);
        }
        return new ObservableSubscribeProxy<T>() {
          @Override
          public Disposable subscribe() {
            return new AutoDisposeObservable<>(upstream, scope).subscribe();
          }

          @Override
          public Disposable subscribe(Consumer<? super T> onNext) {
            return new AutoDisposeObservable<>(upstream, scope).subscribe(onNext);
          }

          @Override
          public Disposable subscribe(
              Consumer<? super T> onNext, Consumer<? super Throwable> onError) {
            return new AutoDisposeObservable<>(upstream, scope).subscribe(onNext, onError);
          }

          @Override
          public Disposable subscribe(
              Consumer<? super T> onNext, Consumer<? super Throwable> onError, Action onComplete) {
            return new AutoDisposeObservable<>(upstream, scope)
                .subscribe(onNext, onError, onComplete);
          }

          @Override
          public void subscribe(Observer<? super T> observer) {
            new AutoDisposeObservable<>(upstream, scope).subscribe(observer);
          }

          @Override
          public <E extends Observer<? super T>> E subscribeWith(E observer) {
            return new AutoDisposeObservable<>(upstream, scope).subscribeWith(observer);
          }

          @Override
          public TestObserver<T> test() {
            TestObserver<T> observer = new TestObserver<>();
            subscribe(observer);
            return observer;
          }

          @Override
          public TestObserver<T> test(boolean dispose) {
            TestObserver<T> observer = new TestObserver<>();
            if (dispose) {
              observer.dispose();
            }
            subscribe(observer);
            return observer;
          }
        };
      }
    };
  }
```

AutoDisposeConverter提供了`ParallelFlowable`、`Flowable`，`Maybe`，`Single`和`Observable`的XXXConverter。

在我们现在这个案例是ObservableConverter，默认`AutoDisposePlugins.hideProxies=false`，所以走的ObservableSubscribeProxy，只是一个代理，最终走的是`AutoDisposeObservable`，将参数upstream和scope传递进去。

而这个scope从之前分析可以知道，是通过`completableOf`返回的，最终是通过`ScopeProvider#requestScope()`返回。

我们目前这个案例是通过`AndroidLifecycleScopeProvider.from(LifecycleOwner)`获取的

```java
// AndroidLifecycleScopeProvider
public static AndroidLifecycleScopeProvider from(
    Lifecycle lifecycle, CorrespondingEventsFunction<Lifecycle.Event> boundaryResolver) {
    return new AndroidLifecycleScopeProvider(lifecycle, boundaryResolver);
}
```

现在我们看看requestScope的返回

```java
// AndroidLifecycleScopeProvider
public CompletableSource requestScope() {
    return LifecycleScopes.resolveScopeFromLifecycle(this);
}
```

往下看`LifecycleScopes#resolveScopeFromLifecycle(LifecycleScopeProvider)`

```java
// LifecycleScopes
public static <E> CompletableSource resolveScopeFromLifecycle(
      final LifecycleScopeProvider<E> provider) throws OutsideScopeException {
    return resolveScopeFromLifecycle(provider, true);
}
public static <E> CompletableSource resolveScopeFromLifecycle(
      final LifecycleScopeProvider<E> provider, final boolean checkEndBoundary)
      throws OutsideScopeException {
    E lastEvent = provider.peekLifecycle(); // 获取最后可见的事件
    CorrespondingEventsFunction<E> eventsFunction = provider.correspondingEvents(); // 事件对应关系
    if (lastEvent == null) { 
      throw new LifecycleNotStartedException();
    }
    E endEvent;
    try {
      endEvent = eventsFunction.apply(lastEvent); // 获取最后可见的事件找到对应的endEvent，即在该Evnet时dispose
    } catch (Exception e) {
      if (checkEndBoundary && e instanceof LifecycleEndedException) {
        Consumer<? super OutsideScopeException> handler =
            AutoDisposePlugins.getOutsideScopeHandler();
        if (handler != null) {
          try {
            handler.accept((LifecycleEndedException) e);

            // Swallowed the end exception, just silently dispose immediately.
            return Completable.complete();
          } catch (Throwable e1) {
            return Completable.error(e1);
          }
        }
        throw e;
      }
      return Completable.error(e);
    }
    return resolveScopeFromLifecycle(provider.lifecycle(), endEvent); // 获取Observable，将endEvent传递过去
}
```

1. 获取当前时刻最后的lastEvent
2. 通过CorrespondingEventsFunction，找到lastEvent对应的endEvent

```java
// LifecycleScopes
public static <E> CompletableSource resolveScopeFromLifecycle(
      Observable<E> lifecycle, final E endEvent) {
    @Nullable Comparator<E> comparator = null;
    if (endEvent instanceof Comparable) {
      //noinspection unchecked
      comparator = (Comparator<E>) COMPARABLE_COMPARATOR;
    }
    return resolveScopeFromLifecycle(lifecycle, endEvent, comparator);
}
public static <E> CompletableSource resolveScopeFromLifecycle(
      Observable<E> lifecycle, final E endEvent, @Nullable final Comparator<E> comparator) {
    Predicate<E> equalityPredicate;
    if (comparator != null) {
      equalityPredicate = e -> comparator.compare(e, endEvent) >= 0;
    } else {
      equalityPredicate = e -> e.equals(endEvent);
    }
    return lifecycle.skip(1).takeUntil(equalityPredicate).ignoreElements();
}
```

直到结束事件才会执行compete，忽略其他方法。equalityPredicate：当前event和endEvent相等是complete。

现在看看`AndroidLifecycleScopeProvider#lifecycle()`

```java
// AndroidLifecycleScopeProvider
private final LifecycleEventsObservable lifecycleObservable;
public Observable<Lifecycle.Event> lifecycle() {
    return lifecycleObservable;
}
```

lifecycleObservable是一个LifecycleEventsObservable

```java
class LifecycleEventsObservable extends Observable<Event> {
    private final Lifecycle lifecycle; // Lifecycle
    private final BehaviorSubject<Event> eventsObservable = BehaviorSubject.create(); // 当前处于什么事件的BehaviorSubject
    @Override
    protected void subscribeActual(Observer<? super Event> observer) {
        AutoDisposeLifecycleObserver lifecycleObserver =
            new AutoDisposeLifecycleObserver(lifecycle, observer, eventsObservable);
        observer.onSubscribe(lifecycleObserver);
        if (!isMainThread()) {
          observer.onError(
              new IllegalStateException("Lifecycles can only be bound to on the main thread!"));
          return;
        }
        lifecycle.addObserver(lifecycleObserver);
        if (lifecycleObserver.isDisposed()) {
          lifecycle.removeObserver(lifecycleObserver);
        }
    }
    
    static final class AutoDisposeLifecycleObserver extends MainThreadDisposable
      implements LifecycleObserver {
        private final Lifecycle lifecycle;
        private final Observer<? super Event> observer;
        private final BehaviorSubject<Event> eventsObservable;
    
        AutoDisposeLifecycleObserver(
            Lifecycle lifecycle,
            Observer<? super Event> observer,
            BehaviorSubject<Event> eventsObservable) {
          this.lifecycle = lifecycle;
          this.observer = observer;
          this.eventsObservable = eventsObservable;
        }
    
        @Override
        protected void onDispose() {
          lifecycle.removeObserver(this);
        }
    
        @OnLifecycleEvent(Event.ON_ANY)
        void onStateChange(@SuppressWarnings("unused") LifecycleOwner owner, Event event) {
            if (!isDisposed()) {
                if (!(event == ON_CREATE && eventsObservable.getValue() == event)) {
                  // Due to the INITIALIZED->ON_CREATE mapping trick we do in backfill(),
                  // we fire this conditionally to avoid duplicate CREATE events.
                  eventsObservable.onNext(event);
                }
                observer.onNext(event);
            }
        }
    }
}
```

1. 将当前observer包装成AutoDisposeLifecycleObserver(lifecycleObserver)，是一个LifecycleObserver可以监听Activity/Fragment的生命周期变化
2. 当前subscribe时，将lifecycleObserver绑定到lifecycle中去
3. 在AutoDisposeLifecycleObserver#onStateChange，通过eventsObservable更新当前的event
4. Lifecycle state变化时，调用observer.onNext(event)

### subscribe流程

```java
final class AutoDisposeObservable<T> extends Observable<T> implements ObservableSubscribeProxy<T> {
    private final ObservableSource<T> source;
    private final CompletableSource scope;
    
    AutoDisposeObservable(ObservableSource<T> source, CompletableSource scope) {
        this.source = source;
        this.scope = scope;
    }
    
    @Override
    protected void subscribeActual(Observer<? super T> observer) {
        source.subscribe(new AutoDisposingObserverImpl<>(scope, observer));
    }
}
```

前面知道这里的source是`LifecycleScopeProvider#lifecycle()提供的`，也就是LifecycleEventsObservable。

将observer包装成AutoDisposingObserverImpl

# RxPermissions

# RxBinding

> RxBinding ，Android平台上的基于RxJava的Binding API。把`发布→订阅`模式用在了Android控件的点击，文本变化上。通过RxBinding把点击监听转换成了`Observable`，就可以对其进行扩展了。<br /><https://github.com/JakeWharton/RxBinding>

## View的点击事件

- RxView.clicks([@NonNull ](/NonNull) View view) 控件点击事件
- RxView.longClicks([@NonNull ](/NonNull) View view) 控件长按事件，并且返回true
- RxView.longClicks([@NonNull ](/NonNull) View view, [@NonNull ](/NonNull) Func0  handled) 控件长按事件

## 其他控件

- RxTextView.textChanges([@NonNull ](/NonNull) TextView view) 只关心TextView的 `onTextChanged()`变化的String而已，可以用这个
- RxTextView.textChangeEvents([@NonNull ](/NonNull) TextView view) TextView的 `onTextChanged()`多个参数的封装
- RxTextView.beforeTextChangeEvents([@NonNull ](/NonNull) TextView view) 对应TextView的 `beforeTextChanged()`
- RxTextView.afterTextChangeEvents([@NonNull ](/NonNull) TextView view) 对应TextView的 `afterTextChanged()`
- RxCompoundButton.checkedChanges([@NonNull ](/NonNull) CompoundButton view) CheckBox的check变化

## RxBinding之InitialValueObservable

```java
public abstract class InitialValueObservable<T> extends Observable<T> {
  @Override protected final void subscribeActual(Observer<? super T> observer) {
    subscribeListener(observer);
    observer.onNext(getInitialValue());
  }

  protected abstract void subscribeListener(Observer<? super T> observer);
  protected abstract T getInitialValue();

  public final Observable<T> skipInitialValue() {
    return new Skipped();
  }

  private final class Skipped extends Observable<T> {
    Skipped() {
    }

    @Override protected void subscribeActual(Observer<? super T> observer) {
      subscribeListener(observer);
    }
  }
}
```

在`subscribeActual()`，调用`subscribeListener()`进行订阅Listener，然后调用onNext发射一条初始值。

默认InitialValueObservable被订阅时，会发送init值。所以如果不需要处理初始值，需要skip初始值。如RxBinding对EditText的textChanged()监听，需要skip空字符串。

当然直接调用`skipInitialValue`，它是直接调用`subscribeListener`而不会调用onNext()

```java
RxTextView.textChanges(edittext)
    .skipInitialValue()
    .debounce(500, TimeUnit.MILLISECONDS)
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe({
        textview.text = text.toString()
    }, {
        Log.w("test", it.localizedMessage)
    })
```

## 自定义View的Listener转换为Observable

一个自定义View的Listener有多个方法，可以针对多个方法实现多个Observable，也可以通过不同的值来判断。<br />**模仿RxView的实现**<br />定义一个静态的方法，可以写到一个通用的工具类中去。

```xml
@CheckResult
@NonNull
public static InitialValueObservable<Long> timerTextViewProgress(@NonNull TimerTextView view) {
    checkNotNull(view, "TimerTextView view == null");
    return new TimerTextViewListenerObservable(view);
}
```

对每个自定义View的Listener写一个Observable，在Listener变化时，调用Observer的onNext()，

```java
public class TimerTextViewListenerObservable extends InitialValueObservable<Long> {

    TimerTextView mTimerTextView;

    public TimerTextViewListenerObservable(TimerTextView timerTextView) {
        this.mTimerTextView = timerTextView;
    }

    @Override
    protected void subscribeListener(Observer observer) {
        TimerTextViewListenerObservable.Listener listener = new TimerTextViewListenerObservable.Listener(mTimerTextView, observer);
        observer.onSubscribe(listener);
        mTimerTextView.setOnTimerProgressListener(listener);
    }

    @Override
    protected Long getInitialValue() {
        return Long.valueOf(Progress.INIT);
    }

    final static class Listener extends MainThreadDisposable implements TimerTextView.OnTimerProgressListener {
        private final TimerTextView view;
        private final Observer<Long> observer;
        public Listener(TimerTextView view, Observer<Long> observer) {
            this.view = view;
            this.observer = observer;
        }

        @Override
        public void onTimerStart(TimerTextView timerTextView) {
            if (!isDisposed()) {
                observer.onNext(Long.valueOf(Progress.START));
            }
        }

        @Override
        public void onTimerProgress(TimerTextView timerTextView, long second) {
            if (!isDisposed()) {
                observer.onNext(second);
            }
        }

        @Override
        public void onTimerEnd(TimerTextView timerTextView) {
            if (!isDisposed()) {
                observer.onNext(Long.valueOf(Progress.END));
            }
        }

        @Override
        protected void onDispose() {
            view.removeOnTimerProgressListener();
        }
    }

    @IntDef({
            Progress.INIT,
            Progress.START,
            Progress.END
    })
    @Retention(RetentionPolicy.SOURCE)
    public @interface Progress {
        int START = -2;
        int END = -1;
        int INIT = 0;
    }
}
```

## RxBinding案例

### 控件点击

```java
RxView.clicks(findViewById(R.id.btn_rxbinding_button_click))
    .subscribe(new Action1<Void>() {
        @Override
        public void call(Void aVoid) {
            i++;
            LogUtil.i("click...:" + i);
        }
    });
```

### 控件长按

```java
RxView.longClicks(findViewById(R.id.btn_rxbinding_button_click), new Func0<Boolean>() {
    @Override
    public Boolean call() {
        return true;
    }
}).subscribe(new Action1<Void>() {
    @Override
    public void call(Void aVoid) {
        Toast.makeText(RxBindingDemoActivity.this, "rx 长按", Toast.LENGTH_SHORT).show();
    }
});
```

### 控件多次点击过滤，使用`throttleFirst(2, TimeUnit.SECONDS)`，2秒内只发射一次点击事件。两秒钟之内只取一个点击事件，防抖操作

```java
RxView.clicks(findViewById(R.id.btn_start_act_rxbinding))
    .throttleFirst(2, TimeUnit.SECONDS)
    .subscribe(new Action1<Void>() {
        @Override
        public void call(Void aVoid) {
            startActivity(RxBindingDemoActivity.this, TestMultiClickActivity.class);
        }
    });
```

### item长按事件

```java
 RxAdapterView.itemLongClicks( listView)
     .subscribe(new Action1<Integer>() {
         @Override
         public void call(Integer integer) {
             Toast.makeText(ListActivity.this, "item long click " + integer , Toast.LENGTH_SHORT).show();
             }
         })
```

### EditText的`textChanged()`变化事件

```java
RxTextView.textChanges(mEtRxbinding)
    .subscribe(new Action1<CharSequence>() {
        @Override
        public void call(CharSequence charSequence) {
            Toast.makeText(RxBindingDemoActivity.this, "change:" + charSequence.toString(), Toast.LENGTH_SHORT).show();
        }
    });
```

### CheckBox的onCheckedChanged()事件

```java
RxCompoundButton.checkedChanges(cbCheckbox)
        .subscribe(new Action1<Boolean>() {
            @Override
            public void call(Boolean aBoolean) {
                mTvResult.setText("" + aBoolean);
            }
        });
```

# RxRelay

<https://github.com/JakeWharton/RxRelay><br />没有onError和onComplete的Subject<br />Subjects是连接non-Rx APIs很好的桥梁，但他们接收`onError`或`onComplete`后，就不再接收数据了；<br />而RxReplay是没有`onError`和`onComplete`状态的Subjects，有`BehaviorRelay`、`PublishRelay`、`ReplayRelay`。没有`AsyncRelay`，因为RxRelay没有onComplete事件。

## BehaviorRelay

同BehaviorSubject，只是没有onError和onComplete的Subject

## PublishRelay

同PublishSubject，只是没有onError和onComplete的Subject

## ReplayRelay

同ReplaySubject，只是没有onError和onComplete的Subject
