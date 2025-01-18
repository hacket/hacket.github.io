---
date created: 2024-05-21 12:23
tags:
  - '#mLastVersion'
  - '#onChanged'
date updated: 2024-12-24 00:32
dg-publish: true
---

# LiveData 原理

## LiveData 注意

1. LiveData.Observe ()只能在主线程调用
2. 一个 LiveData. Observer 只能对应一个 LifecycleOwner；一个 LifecleOwner 可以对应多个 Observer
3. LiveData 更新数据时，inactive 时不会更新，等到 active 时会立即更新，通过 LifecycleEventObserver 的 `activeStateChanged()` (active 的情况下，LiveData 如果有数据，则 Observer 会立马接受到该数据修改的通知。称之为**生命周期改变触发的流程**)
4. 手动触发更新 `postValue` & `setValue`；postValue 可以在子线程调用，setValue 必须在主线程调用，只不过最终 postValue 通过 Post 到主线程，所以 2 种方式最终都是在主线程中调用
5. 中途加入的 Observer 可以收到之前的数据；数据更新完毕后加入可以立马收到更新完毕后的数据，因为当前已经处理 `RESUME` 状态了

## 类组成

### LiveData

1. LiveData
2. MutableLiveData
3. MediatorLiveData

### LifecycleBoundObserver

### Observer

## 原理

### LiveData.Observe ()

LiveData 的使用流程从 `observe(LifecycleOwner owner,Observer<T> observer)` 开始，咱们尝试从 observe () 方法开始分析：

```java
// LiveData Android29
private SafeIterableMap<Observer<? super T>, ObserverWrapper> mObservers = new SafeIterableMap<>();
@MainThread
public void observe(@NonNull LifecycleOwner owner, @NonNull Observer<T> observer) {
    // 如果是 DESTROYED 的状态则忽略
    if (owner.getLifecycle().getCurrentState() == DESTROYED) {
        // ignore
        return;
    }
    //把 Observer 用 LifecycleBoundObserver 包装起来
    LifecycleBoundObserver wrapper = new LifecycleBoundObserver(owner, observer);
    // 将LifecycleBoundObserver缓存到mObservers
    ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
    // 如果已经 observe 过 并且两次的 owner 不同则报错
    if (existing != null && !existing.isAttachedTo(owner)) {
        throw new IllegalArgumentException("Cannot add the same observer"
                + " with different lifecycles");
    }
    if (existing != null) { // 已经存在mObservers忽略
        return;
    }
    // 绑定 owner
    owner.getLifecycle().addObserver(wrapper);
}
```

可以看到 observe 方法里把我们传递的 observer 用 `LifecycleBoundObserver` 包装了起来，并且存入了 mObservers ，并且跟 owner 进行了关联：

1. 忽视处于 DESTROYED 的 owner 的注册行为；
2. 将一个 Observer 同时绑定两个 owner 的行为视为非法操作，也即一个 Observer 只能绑定一个 owner，而 owner 可以有多个 Observer；
3. 如果 observer 已经绑定了，后续同一个 Observer 绑定忽略

这里出现了几个新的类 LifecycleBoundObserver 、ObserverWrapper 来看看。

### LifecycleBoundObserver、ObserverWrapper

```java
class LifecycleBoundObserver extends ObserverWrapper implements GenericLifecycleObserver {
    @NonNull final LifecycleOwner mOwner;

    LifecycleBoundObserver(@NonNull LifecycleOwner owner, Observer<T> observer) {
        super(observer);
        mOwner = owner;
    }

    @Override
    boolean shouldBeActive() {
        // 判断 owner 当前的状态是否是至少 STARTED
        return mOwner.getLifecycle().getCurrentState().isAtLeast(STARTED);
    }

    @Override
    public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
        // 生命周期改变，如果是 DESTROYED 就自动解除
        if (mOwner.getLifecycle().getCurrentState() == DESTROYED) {
            removeObserver(mObserver);
            return;
        }
        // ObserverWrapper.activeStateChanged
        activeStateChanged(shouldBeActive());
    }

    @Override
    boolean isAttachedTo(LifecycleOwner owner) {
        return mOwner == owner;
    }

    @Override
    void detachObserver() {
        mOwner.getLifecycle().removeObserver(this);
    }
}
```

```java
private abstract class ObserverWrapper {
    final Observer<T> mObserver;
    boolean mActive;
    int mLastVersion = START_VERSION;

    ObserverWrapper(Observer<T> observer) {
        mObserver = observer;
    }
    // 是否是 active 状态
    abstract boolean shouldBeActive();

    boolean isAttachedTo(LifecycleOwner owner) {
        return false;
    }

    void detachObserver() {
    }

    void activeStateChanged(boolean newActive) {
        if (newActive == mActive) {
            return;
        }
        // immediately set active state, so we'd never dispatch anything to inactive
        // owner
        mActive = newActive;
        boolean wasInactive = LiveData.this.mActiveCount == 0; // 如果active的Observer为0，表示处于inAction状态了
        LiveData.this.mActiveCount += mActive ? 1 : -1; // 
        if (wasInactive && mActive) {
            onActive();
        }
        if (LiveData.this.mActiveCount == 0 && !mActive) {
            onInactive();
        }
        // 如果 active 状态下，则发送数据更新通知
        if (mActive) {
            dispatchingValue(this);
        }
    }
}
```

LifecycleBoundObserver 是抽象类 ObserverWrapper 的子类，重写了 shouldBeActive () 方法，在 owner 处于至少是 STARTED 的状态下认为是 active 状态；并且它也实现了 GenericLifecycleObserver 接口，可以监听 lifecycle 回调，并且在 onStateChanged () 方法里处理了生命周期改变的事件，当接收到 DESTROYED 的事件会自动解除跟 owner 的绑定，并且将下个流程交给了 `activeStateChanged()` 。

当我们调用 observe () 注册后，由于绑定了 owner，所以在 active 的情况下，LiveData 如果有数据，则 Observer 会立马接受到该数据修改的通知。可以称之为**生命周期改变触发**的流程，另外还有一种流程是 **postValue&setValue 触发**的流程，共两种。

### ActiveStateChanged

在 activeStateChanged () 方法里，处理了 onActive () 跟 onInactive () 回调的相关逻辑处理，并且调用了 dispatchingValue (this) 。（MediatorLiveData 用到了 onActive () 跟 onInactive () 有兴趣自行了解，这里不展开）

```java
// ObserverWrapper
void activeStateChanged(boolean newActive) {
    if (newActive == mActive) {
        return;
    }
    // immediately set active state, so we'd never dispatch anything to inactive
    // owner
    mActive = newActive;
    boolean wasInactive = LiveData.this.mActiveCount == 0;
    LiveData.this.mActiveCount += mActive ? 1 : -1;
    if (wasInactive && mActive) { // 有一个Observer处于active，即Observer从0到1
        onActive();
    }
    if (LiveData.this.mActiveCount == 0 && !mActive) { // 没有Observer订阅了
        onInactive();
    }
    if (mActive) {
        dispatchingValue(this);
    }
}
```

### DispatchingValue (ObserverWrapper) 分析

```java
private void dispatchingValue(@Nullable ObserverWrapper initiator) {
    //如果正在分发则直接返回
    if (mDispatchingValue) {
        //标记分发失效
        mDispatchInvalidated = true;
        return;
    }
    //标记分发开始
    mDispatchingValue = true;
    do {
        mDispatchInvalidated = false;
        //生命周期改变调用的方法 initiator 不为 null
        if (initiator != null) {
            considerNotify(initiator);
            initiator = null;
        } else {
            //postValue/setValue 方法调用 传递的 initiator 为 null
            for (Iterator<Map.Entry<Observer<T>, ObserverWrapper>> iterator =
                    mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
                considerNotify(iterator.next().getValue());
                if (mDispatchInvalidated) {
                    break;
                }
            }
        }
    } while (mDispatchInvalidated);
    //标记分发结束
    mDispatchingValue = false;
}
```

ConsiderNotify (ObserverWrapper) 方法:

```java
private void considerNotify(ObserverWrapper observer) {
    // 检查状态 确保不会分发给 inactive 的 observer
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
    // setValue 会增加 mVersion
    if (observer.mLastVersion >= mVersion) { // mLastVersion默认为-1，mVersion在LiveData构造方法赋值为0了
        return;
    }
    observer.mLastVersion = mVersion;
    //noinspection unchecked
    observer.mObserver.onChanged((T) mData);
}
```

- 可以看到 dispatchingValue 正是分发事件逻辑的处理方法，而 considerNotify 方法则确保了只将最新的数据分发给 active 状态下的 Observer 。
- 另外也可以看到 LiveData 引入了版本管理来管理数据 （mData）以确保发送的数据总是最新的。
- mVersion 默认为-1，在 LiveData 构造方法赋值为 0 了；Observer #mLastVersion ，默认为-1；所以每个新 observe 的 Observer 都会收到最新的数据，这个称为数据倒灌

#### ObserverWrapper 不为 null 的情况，只回调生命周期更改的 Observer #onChanged

上面提到过，LifecycleBoundObserver. OnStateChanged 方法里调用了 activeStateChanged ，而该方法调用 dispatchingValue (this); 传入了 this ，也就是 LifecycleBoundObserver ，这时候不为 null 。

也就是说生命周期改变触发的流程就是这种情况，这种情况下，只会通知跟该 Owner 绑定的 Observer。

#### ObserverWrapper 为 null 的情况，set/PostValue 更改所有的 Observer

除了生命周期改变触发的流程外，还有 postValue&setValue 流程，来看下这俩方法

```java
private final Runnable mPostValueRunnable = new Runnable() {
    @Override
    public void run() {
        Object newValue;
        synchronized (mDataLock) {
            newValue = mPendingData;
            mPendingData = NOT_SET;
        }
        //noinspection unchecked
        //调用 setValue
        setValue((T) newValue);
    }
};

protected void postValue(T value) {
    boolean postTask;
    synchronized (mDataLock) {
        postTask = mPendingData == NOT_SET;
        mPendingData = value;
    }
    if (!postTask) {
        return;
    }
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}

@MainThread
protected void setValue(T value) {
    //必须在主线程调用 否则会 crash
    assertMainThread("setValue");
    mVersion++;//增加版本号
    mData = value;
    //传入了 null
    dispatchingValue(null);
}
```

LiveData 的 postValue 方法其实就是把操作 post 到主线程，最后调用的还是 setValue 方法，注意 setValue 必须是在主线程调用。<br>并且可以看到 setValue 方法调用了 dispatchingValue 方法，并传入了 null ，这个时候的流程则会通知 active 的 mObservers

LiveData 的两个流程都会走到 dispatchingValue 处理分发通知逻辑，并且在分发通知前会判断 owner 的状态，再加上 LiveData 本身内部的版本管理，确保了只会发送最新的数据给 active 状态下的 Observer。

注意：LiveData 对同时多次修改数据做了处理，如果同时多次修改，只会修改为最新的数据。

## Reference

- [x] 深入理解 Jetpack 之 LiveData<br>[<http://yifeiyuan.me/blog/9d326805.html](><http://yifeiyuan.me/blog/9d326805.html>
