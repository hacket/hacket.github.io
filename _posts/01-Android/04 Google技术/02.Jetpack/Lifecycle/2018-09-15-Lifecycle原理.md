---
banner:
date_created: Sunday, September 15th 2018, 12:10:00 am
date_updated: Tuesday, September 16th 2025, 11:57:05 pm
title: Lifecycle原理
author: hacket
categories:
  - Android
category: Jetpack
tags: [Jetpack, Lifecyle]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-09-14 21:56
date updated: 2024-12-28 00:24
aliases: [Lifecycle 原理]
linter-yaml-title-alias: Lifecycle 原理
---

# Lifecycle 原理

## 1、类组成

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250129222449.png)

### Lifecycle（订阅关系管理）

Lifecycle 被定义成了抽象类

```java
public abstract class Lifecycle {
    // 添加观察者
    @MainThread
    public abstract void addObserver(@NonNull LifecycleObserver observer);
    // 移除观察者
    @MainThread
    public abstract void removeObserver(@NonNull LifecycleObserver observer);
    // 获取当前状态
    public abstract State getCurrentState();

    // 生命周期事件，对应Activity生命周期方法
    public enum Event {
        ON_CREATE,
        ON_START,
        ON_RESUME,
        ON_PAUSE,
        ON_STOP,
        ON_DESTROY,
        ON_ANY  //可以响应任意一个事件
    }

    // 生命周期状态. （Event是进入这种状态的事件）
    public enum State {
        DESTROYED,
        INITIALIZED,
        CREATED,
        STARTED,
        RESUMED;

        // 判断至少是某一状态
        public boolean isAtLeast(@NonNull State state) {
            return compareTo(state) >= 0;
    }
}
```

#### Lifecycle. Event 生命周期事件

生命周期事件，这些事件对应 Activity/Fragment 生命周期方法。<br>State 到下一个 State 之间的过程叫 Event

Event 触发的时机：

1. `ON_CREATE`、`ON_START`、`ON_RESUME` 事件，是在 LifecycleOwner 对应的方法执行之后分发。
2. `ON_PAUSE`、`ON_STOP`、`ON_DESTROY` 事件，是在 LifecycleOwner 对应的方法调用之前分发。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250129222537.png)

#### Lifecycle. State 生命周期状态

生命周期状态，而 Event 是指进入一种状态的事件。<br>理解为图上的一个节点，而 Event 是这些节点之间的一个过程

#### LifecycleRegistry

Lifecycle 子类，系统框架实现中 Lifecycle 的唯一子类。用于 Fragment 和 support activity 中，也可直接用于自定义的 `LifecycleOwner`

1. AddObserver ()<br>添加观察者 LifecycleObserver
2. RemoveObserver -- 不是必须的操作<br>移除观察者 LifecycleObserver
3. HandleLifecycleEvent<br>用于在 LifecycleOwner 的生命周期变化时，通过该方法告知 LifecycleObserver 生命变化了

### LifecycleOwner（生命周期拥有者，被观察者）

生命周期事件的拥有者，拥有 android lifecycle，这些事件用于给那些没有在 Activity 或 Fragment 内实现任何代码的自定义组件来处理生命周期的变化。

Fragment 和 `androidx.activity.ComponentActivity` 实现了 LifecycleOwner，getLifecycle () 方法返回 LifecycleRegistry

### LifecycleObserver（观察者）

Lifecycle 架构中，该接口的实现类表示为关注生命周期事件的观察者。

#### 直接实现 LifecycleObserver

采用注解方式，`@OnLifecycleEvent` 标记自定义的方法以实现回调。注解的工作方式有两种：反射，预编译适配类，默认的工作方式为反射。

```java
class BoundLocationListener implements LifecycleObserver {
    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    void addLocationListener() {}
    
    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    void removeLocationListener(){}
}
```

1. 反射方式：

就是通过包装和处理后，最终通过 invoke 调用被注解的方法。

2. 预编译方式：

需要引入注解编译器：`androidx.lifecycle:lifecycle-compiler:<*>`。<br>对被注解标记且继承/实现 LifecycleObserver 接口的类/接口，自动编译生成对应的继承 `GeneratedAdapter的<ClassName>_LifecycleAdapter.class` 适配类，以减少反射消耗，典型的空间换时间。

#### LifecycleEventObserver

LifecycleObserver 子接口。只有一个 onStateChanged 方法，以 Lifecycle. Event 入参提供事件区分的形式，进行统一方法回调。<br>与 FullLifecycleObserver 不冲突，但是也会无效化@OnLifecycleEvent 注解。<br>同时实现 LifecycleEventObserver 和 FullLifecycleObserver，可以得到 2 次相同的生命周期回调，FullLifecycleObserver 的具体方法回调优先于 LifecycleEventObserver 的统一方法回调。

```java
public interface LifecycleEventObserver extends LifecycleObserver {
    void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event);
}
```

#### FullLifecycleObserver

LifecycleObserver 子接口。为所有的生命周期事件都定义了对应的回调方法。<br>实现该接口，就需要把不需要观察的方法回调都做一个空实现。在没有 java 8 的 default 关键字时，如果仅需要 1-2 个回调方法，那么最终实现类中的空方法会相当碍眼，这种情况下推选使用@OnLifecycleEvent 注解方式替代。(当然也可以自己弄一个空实现的 BaseLifecycleObserver)。

- DefaultLifecycleObserver<br>FullLifecycleObserver 子接口。使用 java 8 的 default 关键字空实现了 FullLifecycleObserver 的所有方法。<br>需要引入：`androidx.lifecycle:lifecycle-compiler:<*>`。<br>如果项目中使用了 java 8 或者开启 java 8 特性，那么官方强烈推选 DefaultLifecycleObserver 替代的@OnLifecycleEvent 注解实现 (注解后续可能被弃用)，包括预编译。<br>引入 DefaultLifecycleObserver 后，就需要把注解实现相关逻辑移除。即使保留注解，由于 Lifecycling 的处理逻辑（系统架构逻辑中所有传入的观察者都会经过 Lifecycling 处理），任何 FullLifecycleObserver 的实现类 (即包括 DefaultLifecycleObserver) 内部所有的@OnLifecycleEvent 注解都会失效。

```java
interface FullLifecycleObserver extends LifecycleObserver {

    void onCreate(LifecycleOwner owner);

    void onStart(LifecycleOwner owner);

    void onResume(LifecycleOwner owner);

    void onPause(LifecycleOwner owner);

    void onStop(LifecycleOwner owner);

    void onDestroy(LifecycleOwner owner);
}
```

##### FullLifecycleObserverAdapter

如果一个类实现了 LifecycleEventObserver 和 FullLifecycleObserver，会被包装成 FullLifecycleObserverAdapter

```java
class FullLifecycleObserverAdapter implements LifecycleEventObserver {

    private final FullLifecycleObserver mFullLifecycleObserver;
    private final LifecycleEventObserver mLifecycleEventObserver;

    FullLifecycleObserverAdapter(FullLifecycleObserver fullLifecycleObserver,
            LifecycleEventObserver lifecycleEventObserver) {
        mFullLifecycleObserver = fullLifecycleObserver;
        mLifecycleEventObserver = lifecycleEventObserver;
    }

    @Override
    public void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event) {
        switch (event) {
            case ON_CREATE:
                mFullLifecycleObserver.onCreate(source);
                break;
            case ON_START:
                mFullLifecycleObserver.onStart(source);
                break;
            case ON_RESUME:
                mFullLifecycleObserver.onResume(source);
                break;
            case ON_PAUSE:
                mFullLifecycleObserver.onPause(source);
                break;
            case ON_STOP:
                mFullLifecycleObserver.onStop(source);
                break;
            case ON_DESTROY:
                mFullLifecycleObserver.onDestroy(source);
                break;
            case ON_ANY:
                throw new IllegalArgumentException("ON_ANY must not been send by anybody");
        }
        if (mLifecycleEventObserver != null) {
            mLifecycleEventObserver.onStateChanged(source, event);
        }
    }
}
```

从上面可以看到，会先执行 `FullLifecycleObserver#onXXX()` 对应的方法，然后调用 `LifecycleEventObserver#onStateChanged`。

#### ReflectiveGenericLifecycleObserver

LifecycleEventObserver 子类。适应于注解方式的反射工作方式。<br>通过该类对观察者进行包装，处理观察者关注的回调的反射调用，由 Lifecycling 处理包装过程。

#### SingleGeneratedAdapterObserver

LifecycleEventObserver 子类。适应于注解方式的预编译工作方式。<br>通过该类对观察者的 GeneratedAdapter 进行包装，处理 GeneratedAdapter 的方法调用，由 Lifecycling 处理包装过程。

#### CompositeGeneratedAdaptersObserver

SingleGeneratedAdapterObserver 的复数版，内部逻辑基本与其一致，只是提供 " 复数 "GeneratedAdapter 的支持。

#### ObserverWithState

`LifecycleOwner.getLifecycle().addObserver(LifecycleObserver)` 时，将会 LifecycleObserver 包装成 ObserverWithState，并将当前 LifecycleOwner 的当前初始化状态传递进来

```java
static class ObserverWithState {
    State mState;
    LifecycleEventObserver mLifecycleObserver;

    ObserverWithState(LifecycleObserver observer, State initialState) {
        mLifecycleObserver = Lifecycling.lifecycleEventObserver(observer);
        mState = initialState;
    }

    void dispatchEvent(LifecycleOwner owner, Event event) {
        State newState = getStateAfter(event);
        mState = min(mState, newState);
        mLifecycleObserver.onStateChanged(owner, event);
        mState = newState;
    }
}
```

## 2、Activity Lifecycle 原理

### 初始化 Lifecycle，注册观察者

以 Activity 为例，首先我们使用的是通过 `getLifecycle()` 得到一个 Lifecycle，并调用 `addObserver()` 来添加一个观察者

```java
getLifecycle().addObserver(presenter);
```

Activity 中的 getLifecycle () 最终是在 `SupportActivity` (新版在 `androidx.activity.ComponentActivity`) 中定义的，getLifecycle () 得到的就是一个 Lifecycle 对象，其实就是一个 `LifecycleRegistry`，它是 Lifecycle 的子类：

```java
private LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);
```

而 LifecycleRegistry 构造需要一个 `LifecycleOwner`，LifecycleOwner 是一个接口

```java
# LifecycleOwner
public interface LifecycleOwner {
    Lifecycle getLifecycle();
}
```

> LifecycleOwner 就是事件的拥有者，如 Activity/Fragment，在观察者模式中扮演中被观察者的角色。

然后通过 addObserver 添加 `LifecycleObserver`，

> LifecycleObserver 就是对事件发送的观察者，它用于观察事件的变化，如 onCreate ()，onDestroy()

### ReportFragment 感知生命周期分发 Event

在 `androidx.activity.ComponentActivity` 中 onCreate () 注入了一个没有界面的 ReportFragment

```java
// ComponentActivity#onCreate
protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ReportFragment.injectIfNeededIn(this);
}
// ReportFragment#injectIfNeededIn
public static void injectIfNeededIn(Activity activity) {
    if (Build.VERSION.SDK_INT >= 29) {
        // 在API 29及以上，可以直接注册回调 获取生命周期
        activity.registerActivityLifecycleCallbacks(
                new LifecycleCallbacks());
    }
    // API29以前，使用Fragment获取生命周期
    // Prior to API 29 and to maintain compatibility with older versions of
    // ProcessLifecycleOwner (which may not be updated when lifecycle-runtime is updated and
    // need to support activities that don't extend from FragmentActivity from support lib),
    // use a framework fragment to get the correct timing of Lifecycle events
    android.app.FragmentManager manager = activity.getFragmentManager();
    if (manager.findFragmentByTag(REPORT_FRAGMENT_TAG) == null) {
        manager.beginTransaction().add(new ReportFragment(), REPORT_FRAGMENT_TAG).commit();
        // Hopefully, we are the first to make a transaction.
        manager.executePendingTransactions();
    }
}
```

InjectIfNeededIn () 内进行了版本区分：在 API 29 及以上直接使用 activity 的 registerActivityLifecycleCallbacks 直接注册了生命周期回调，然后给当前 activity 添加了 ReportFragment，注意这个 Fragment 是没有布局的。

论 LifecycleCallbacks、还是 Fragment 的生命周期方法最后都走到了 `dispatch(Activity activity, Lifecycle.Event event)` 方法，其内部使用 LifecycleRegistry 的 handleLifecycleEvent 方法处理事件。

然后在 ReportFragment 的生命周期方法中，在对应的生命周期中分发对应的事件

```java
// ReportFragment Andrdoi29
private void dispatch(@NonNull Lifecycle.Event event) {
    if (Build.VERSION.SDK_INT < 29) {
        // Only dispatch events from ReportFragment on API levels prior
        // to API 29. On API 29+, this is handled by the ActivityLifecycleCallbacks
        // added in ReportFragment.injectIfNeededIn
        dispatch(getActivity(), event);
    }
}
static void dispatch(@NonNull Activity activity, @NonNull Lifecycle.Event event) {
    if (activity instanceof LifecycleRegistryOwner) {
        ((LifecycleRegistryOwner) activity).getLifecycle().handleLifecycleEvent(event);
        return;
    }

    if (activity instanceof LifecycleOwner) {
        Lifecycle lifecycle = ((LifecycleOwner) activity).getLifecycle();
        if (lifecycle instanceof LifecycleRegistry) {
            ((LifecycleRegistry) lifecycle).handleLifecycleEvent(event);
        }
    }
}
```

最终调用 LifecycleRegistry 的 handleLifecycleEvent (event) 分发给对应的 LifecycleObserver。

### 生命周期事件处理——LifecycleRegistry

```java
// LifecycleRegistry Android29
public class LifecycleRegistry extends Lifecycle {
    
    // 自定义了保存Observer的map，可在遍历中增删
    private FastSafeIterableMap<LifecycleObserver, ObserverWithState> mObserverMap = new FastSafeIterableMap<>();
    
    @Override
    public void addObserver(@NonNull LifecycleObserver observer) {
        State initialState = mState == DESTROYED ? DESTROYED : INITIALIZED;
        // 带状态的观察者，这个状态的作用：新的事件触发后遍历通知所有观察者时，判断是否已经通知这个观察者了
        ObserverWithState statefulObserver = new ObserverWithState(observer, initialState);
        
        // 添加到mObserverMap，如果已经存在则返回存在的实例
        ObserverWithState previous = mObserverMap.putIfAbsent(observer, statefulObserver);

        if (previous != null) { // 如果之前已经添加了，那么直接return
            return;
        }
        LifecycleOwner lifecycleOwner = mLifecycleOwner.get();
        if (lifecycleOwner == null) {
            // it is null we should be destroyed. Fallback quickly
            return;
        }

        boolean isReentrance = mAddingObserverCounter != 0 || mHandlingEvent;
        
        // 通过while循环，把新的观察者的状态 连续地 同步到最新状态mState。意思就是：虽然可能添加的晚，但把之前的事件一个个分发给你(upEvent方法)，即粘性
        State targetState = calculateTargetState(observer);
        mAddingObserverCounter++;
        while ((statefulObserver.mState.compareTo(targetState) < 0
                && mObserverMap.contains(observer))) {
            pushParentState(statefulObserver.mState);
            statefulObserver.dispatchEvent(lifecycleOwner, upEvent(statefulObserver.mState));
            popParentState();
            // mState / subling may have been changed recalculate
            targetState = calculateTargetState(observer);
        }

        if (!isReentrance) {
            // we do sync only on the top level.
            sync();
        }
        mAddingObserverCounter--;
    }
    
    public void handleLifecycleEvent(@NonNull Lifecycle.Event event) {
        State next = getStateAfter(event); // 获取event发生之后的将要处于的状态
        moveToState(next); // 移动到这个状态
    }
    private void moveToState(State next) {
        if (mState == next) {
            return; // 如果和当前状态一致，不处理
        }
        mState = next; // 赋值新状态
        if (mHandlingEvent || mAddingObserverCounter != 0) { // 如果正在sync同步状态 或 正在添加Observer，不同步状态
            mNewEventOccurred = true;
            // we will figure out what to do on upper level.
            return;
        }
        mHandlingEvent = true;
        sync(); // 把生命周期状态同步给所有观察者
        mHandlingEvent = false;
    }
    
    private void sync() {
        LifecycleOwner lifecycleOwner = mLifecycleOwner.get();
        if (lifecycleOwner == null) {
            throw new IllegalStateException("LifecycleOwner of this LifecycleRegistry is already"
                    + "garbage collected. It is too late to change lifecycle state.");
        }
        while (!isSynced()) { // 所有观察者都同步完了
            mNewEventOccurred = false;
            // no need to check eldest for nullability, because isSynced does it for us.
            if (mState.compareTo(mObserverMap.eldest().getValue().mState) < 0) {
                backwardPass(lifecycleOwner);
            }
            Entry<LifecycleObserver, ObserverWithState> newest = mObserverMap.newest();
            if (!mNewEventOccurred && newest != null
                    && mState.compareTo(newest.getValue().mState) > 0) {
                forwardPass(lifecycleOwner);
            }
        }
        mNewEventOccurred = false;
    }
    
    private boolean isSynced() {
        if (mObserverMap.size() == 0) {
            return true;
        }
        State eldestObserverState = mObserverMap.eldest().getValue().mState;
        State newestObserverState = mObserverMap.newest().getValue().mState;
        // 最老的和最新的观察者的状态一致，都是ower的当前状态，说明已经同步完了
        return eldestObserverState == newestObserverState && mState == newestObserverState;
    }
    
    // ... 
    static State getStateAfter(Event event) {
        switch (event) {
            case ON_CREATE:
            case ON_STOP:
                return CREATED;
            case ON_START:
            case ON_PAUSE:
                return STARTED;
            case ON_RESUME:
                return RESUMED;
            case ON_DESTROY:
                return DESTROYED;
            case ON_ANY:
                break;
        }
        throw new IllegalArgumentException("Unexpected event value " + event);
    }
    private static Event downEvent(State state) {
        switch (state) {
            case INITIALIZED:
                throw new IllegalArgumentException();
            case CREATED:
                return ON_DESTROY;
            case STARTED:
                return ON_STOP;
            case RESUMED:
                return ON_PAUSE;
            case DESTROYED:
                throw new IllegalArgumentException();
        }
        throw new IllegalArgumentException("Unexpected state value " + state);
    }
}
```

1. AddObserver 用 observer 创建带状态的观察者 ObserverWithState，observer 作为 key、ObserverWithState 作为 value，存到 mObserverMap。接着做了安全判断，最后把新的观察者的状态连续地同步到最新状态 mState，意思就是：虽然可能添加的晚，但会把之前的事件一个个分发给你，即粘性。
2. GetStateAfter () 获取 event 发生之后的将要处于的状态 State
3. MoveToState () 是移动到新状态，最后使用 sync () 把生命周期状态同步给所有观察者
4. 循环条件是!IsSynced ()，若最老的和最新的观察者的状态一致，且都是 ower 的当前状态，说明已经同步完了。没有同步完就进入循环体：

- MState 比最老观察者状态小，走 backwardPass (lifecycleOwner)：从新到老分发，循环使用 downEvent () 和 observer.DispatchEvent ()，连续分发事件；
- MState 比最新观察者状态大，走 forwardPass (lifecycleOwner)：从老到新分发，循环使用 upEvent () 和 observer.DispatchEvent ()，连续分发事件。

### ObserverWithState 分发事件

接着 ObserverWithState 类型的 observer 就获取到了事件，即 observer.DispatchEvent (lifecycleOwner, event)，下面来看看它是如何让加了对应注解的方法执行的。

```java
// ObserverWithState Android29
static class ObserverWithState {
    State mState;
    GenericLifecycleObserver mLifecycleObserver;

    ObserverWithState(LifecycleObserver observer, State initialState) {
        mLifecycleObserver = Lifecycling.getCallback(observer);
        mState = initialState;
    }

    void dispatchEvent(LifecycleOwner owner, Event event) {
        State newState = getStateAfter(event);
        mState = min(mState, newState);
        mLifecycleObserver.onStateChanged(owner, event);
        mState = newState;
    }
}
```

mLifecycleObserver 是通过 `Lifecycling.getCallback(observer)` 获取的，其实就是一个 `LifecycleEventObserver`

```java
// Lifecycling Android29
static GenericLifecycleObserver getCallback(final Object object) {
    final LifecycleEventObserver observer = lifecycleEventObserver(object);
    return new GenericLifecycleObserver() {
        @Override
        public void onStateChanged(@NonNull LifecycleOwner source,
                @NonNull Lifecycle.Event event) {
            observer.onStateChanged(source, event);
        }
    };
}
static LifecycleEventObserver lifecycleEventObserver(Object object) {
    boolean isLifecycleEventObserver = object instanceof LifecycleEventObserver;
    boolean isFullLifecycleObserver = object instanceof FullLifecycleObserver;
    if (isLifecycleEventObserver && isFullLifecycleObserver) {
        return new FullLifecycleObserverAdapter((FullLifecycleObserver) object,
                (LifecycleEventObserver) object);
    }
    if (isFullLifecycleObserver) {
        return new FullLifecycleObserverAdapter((FullLifecycleObserver) object, null);
    }

    if (isLifecycleEventObserver) {
        return (LifecycleEventObserver) object;
    }

    final Class<?> klass = object.getClass();
    int type = getObserverConstructorType(klass);
    if (type == GENERATED_CALLBACK) {
        List<Constructor<? extends GeneratedAdapter>> constructors =
                sClassToAdapters.get(klass);
        if (constructors.size() == 1) {
            GeneratedAdapter generatedAdapter = createGeneratedAdapter(
                    constructors.get(0), object);
            return new SingleGeneratedAdapterObserver(generatedAdapter);
        }
        GeneratedAdapter[] adapters = new GeneratedAdapter[constructors.size()];
        for (int i = 0; i < constructors.size(); i++) {
            adapters[i] = createGeneratedAdapter(constructors.get(i), object);
        }
        return new CompositeGeneratedAdaptersObserver(adapters);
    }
    return new ReflectiveGenericLifecycleObserver(object);
}
```

1. 如果是 FullLifecycleObserver 和 LifecycleEventObserver，那么先回调 FullLifecycleObserver 的各个方法，再回调 LifecycleEventObserver 的 onStateChanged
2. 如果只是 FullLifecycleObserver，那么回调 FullLifecycleObserver 的各个方法
3. 如果只是 LifecycleEventObserver，那么回调 onStateChanged
4. 如果 ReflectiveGenericLifecycleObserver，反射获取 `@OnLifecycleEvent` 注解的方法（第一个参数必须是 LifecycleOwner；第二个参数必须是 Event；有两个参数注解值只能是 ON_ANY；参数不能超过两个）

## 3、Fragment Lifecycle 原理

1. 我们在 Fragment（AppCompatActivity 也一样）中调用 getLifecycle () 方法得到 LifecycleRegistry 对象，然后调用 addObserver () 方法并将实现了 LifecycleObserver 接口的对象作为参数传进去。这样一个过程就完成了注册监听的过程。
2. 后续就是 Fragment 生命周期变化时，通知 LifecycleObserver 的过程：Fragment 的 performXXX ()、onXXX () 方法；LifecycleRegistry 的 handleLifecycleEvent () 方法；LifecycleObserver 的 onXXX() 方法。
3. 如果你细心点看上面的时序图，你会发现 Fragment 中 performCreate ()、performStart ()、performResume () 会先调用自身的 onXXX () 方法，然后再调用 LifecycleRegistry 的 handleLifecycleEvent () 方法；而在 performPause ()、performStop ()、performDestroy () 中会先 LifecycleRegistry 的 handleLifecycleEvent () 方法，然后调用自身的 onXXX() 方法。

Fragment 实现 Lifecycle 原理图：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250129222630.png)

## 4、ProcessLifecycleOwner 提供 Application 生命周期

## Ref

- [x] 带你理解 Jetpack——Lifecycle 篇<br><https://blog.csdn.net/c10WTiybQ1Ye3/article/details/106726000>
