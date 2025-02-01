---
date_created: Friday, February 23rd 2021, 10:10:45 pm
date_updated: Thursday, January 30th 2025, 9:57:30 am
title: 动态扩展类并绑定生命周期的新方式(参考viewModelScope)
author: hacket
categories:
  - Android进阶
category: 源码学习
tags: [ViewModel, 优秀代码, 源码学习]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
date created: 星期一, 五月 20日 2024, 10:41:00 晚上
date updated: 星期一, 一月 20日 2025, 4:50:05 下午
image-auto-upload: true
feed: show
format: list
aliases: [动态扩展类并绑定生命周期的新方式 (参考 viewModelScope)]
linter-yaml-title-alias: 动态扩展类并绑定生命周期的新方式 (参考 viewModelScope)
---

# 动态扩展类并绑定生命周期的新方式 (参考 viewModelScope)

## 引出问题？

不使用继承和组合，如何动态地扩展类？比如，如何给 Activity 扩展一个 String 属性，当 Activity 被销毁时，将其置空？

## viewModelScope 源码

我们来看 ViewModel 生命周期绑定的 viewModelScope 被定义成它的扩展属性。它是怎么做到和 ViewModel 生命周期绑定的：

```kotlin
val ViewModel.viewModelScope: CoroutineScope
    get() {
        // 尝试根据 tag 获取 CoroutineScope
        val scope: CoroutineScope? = this.getTag(JOB_KEY)
        // 命中则直接返回
        if (scope != null) {
            return scope
        }
        // 若未命中则构建 CloseableCoroutineScope 并将其和 JOB_KEY 绑定
        return setTagIfAbsent(JOB_KEY,
            CloseableCoroutineScope(SupervisorJob() + Dispatchers.Main))
    }
```

接着看 ViewModel：

```kotlin
public abstract class ViewModel {
    // 存放 Object对象 的 map
    private final Map<String, Object> mBagOfTags = new HashMap<>();

    // 取值方法
    <T> T getTag(String key) {
        synchronized (mBagOfTags) {
            return (T) mBagOfTags.get(key);
        }
    }
    
    // 设置方法
    <T> T setTagIfAbsent(String key, T newValue) {
        T previous;
        synchronized (mBagOfTags) {
            previous = (T) mBagOfTags.get(key);
            if (previous == null) {
                mBagOfTags.put(key, newValue);
            }
        }
        T result = previous == null ? newValue : previous;
        if (mCleared) {
            closeWithRuntimeException(result);
        }
        return result;
    }

    // ViewModel 生命周期结束时释放资源
    final void clear() {
        mCleared = true;
        // 遍历 map 清理其中的对象
        if (mBagOfTags != null) {
            synchronized (mBagOfTags) {
                for (Object value : mBagOfTags.values()) {
                    // 清理单个对象
                    closeWithRuntimeException(value);
                }
            }
        }
        onCleared();
    }
    
    // 清理实现了 Closeable 接口的对象
    private static void closeWithRuntimeException(Object obj) {
        if (obj instanceof Closeable) {
            try {
                ((Closeable) obj).close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

ViewModel 预留了后门，是存放 Object 对象的 HashMap 结构。这使得不修改 ViewModel 源码，就能为其动态扩展属性。

ViewModel 在生命周期结束时，会清理后门中所有的 Closeable 对象。当扩展属性也是该类型时类，其生命周期自动和 ViewModel 同步。

Cloaseable 接口定义如下：

```java
public interface Closeable extends AutoCloseable {
    // 定义如何释放资源
    public void close() throws IOException;
}
// 回到扩展属性viewModelScope的获取算法，从Map中获取viewModelScope失败后，会构建CloseableCoroutineScope对象，它实现了Closeable接口：
// 可自动取消的 CoroutineScope
internal class CloseableCoroutineScope(context: CoroutineContext) : Closeable, CoroutineScope {
    override val coroutineContext: CoroutineContext = context

    // 将协程取消
    override fun close() {
        coroutineContext.cancel()
    }
}
```

## 扩展到其他用处

### BaseActivity 提供动态无侵入方式关联生命周期

```java
public abstract class BaseActivity extends CommonActivity {

    // Can't use ConcurrentHashMap, because it can lose values on old apis (see b/37042460)
    @Nullable
    private final Map<String, Object> mBagOfTags = new HashMap<>();
    private volatile boolean mCleared = false;

    @MainThread
    private final void clear() {
        mCleared = true;
        // Since clear() is final, this method is still called on mock objects
        // and in those cases, mBagOfTags is null. It'll always be empty though
        // because setTagIfAbsent and getTag are not final so we can skip
        // clearing it
        if (mBagOfTags != null) {
            synchronized (mBagOfTags) {
                for (Object value : mBagOfTags.values()) {
                    // see comment for the similar call in setTagIfAbsent
                    closeWithRuntimeException(value);
                }
            }
        }
    }

    /**
     * Sets a tag associated with this BaseActivity and a key.
     * If the given {@code newValue} is {@link Closeable},
     * it will be closed once {@link #clear()}.
     * <p>
     * If a value was already set for the given key, this calls do nothing and
     * returns currently associated value, the given {@code newValue} would be ignored
     * <p>
     * If the ViewModel was already cleared then close() would be called on the returned object if
     * it implements {@link Closeable}. The same object may receive multiple close calls, so method
     * should be idempotent.
     */
    @SuppressWarnings("unchecked")
    protected <T> T setTagIfAbsent(String key, T newValue) {
        T previous;
        synchronized (mBagOfTags) {
            previous = (T) mBagOfTags.get(key);
            if (previous == null) {
                mBagOfTags.put(key, newValue);
            }
        }
        T result = previous == null ? newValue : previous;
        if (mCleared) {
            // It is possible that we'll call close() multiple times on the same object, but
            // Closeable interface requires close method to be idempotent:
            // "if the stream is already closed then invoking this method has no effect." (c)
            closeWithRuntimeException(result);
        }
        return result;
    }

    /**
     * Returns the tag associated with this viewmodel and the specified key.
     */
    @SuppressWarnings({"TypeParameterUnusedInFormals", "unchecked"})
    protected <T> T getTag(String key) {
        if (mBagOfTags == null) {
            return null;
        }
        synchronized (mBagOfTags) {
            return (T) mBagOfTags.get(key);
        }
    }

    private void closeWithRuntimeException(Object obj) {
        if (obj instanceof Closeable) {
            try {
                ((Closeable) obj).close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public void onDestory() {
        super.onDestory();
        clear();
    }
}
```

有需要关联 `BaseActivity#onDestory` 声明周期的类就可以通过这种非继承非组合的方式关联起来。

使用：

```java
public abstract class BasePresenterTest implements Closeable {  
    @Override  
    public void close() throws IOException {  
        onCleared();  
    }  
    public abstract void onCleared();  
    public abstract String key();    
}

public class MyPresenterTest extends BasePresenterTest {  
    @Override  
    public void onCleared() {  
        Toast.makeText(GlobalContext.getAppContext(), "onCleared了", Toast.LENGTH_SHORT).show();  
    }  
    public void test() {  
        Toast.makeText(GlobalContext.getAppContext(), "test", Toast.LENGTH_SHORT).show();  
    }  
    @Override  
    public String key() {  
        return "key_1";  
    }  
}

// 测试，Activity中
val myPresenterTest = MyPresenterTest()
setTagIfAbsent(myPresenterTest.key(), myPresenterTest)
```

## Ref

- [x] 读源码长知识 | 动态扩展类并绑定生命周期的新方式<https://juejin.cn/post/6844904200707506189>
