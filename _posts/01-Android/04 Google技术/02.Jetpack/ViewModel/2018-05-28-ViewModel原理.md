---
date_created: Tuesday, May 28th 2018, 12:02:31 am
date_updated: Tuesday, January 21st 2025, 11:45:47 pm
title: ViewModel原理
author: hacket
categories:
  - Android
category: Jetpack
tags: [Jetpack, ViewModel]
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
date created: 2024-05-18 21:34
date updated: 2024-12-24 00:32
aliases: [ViewModel 原理]
linter-yaml-title-alias: ViewModel 原理
---

# ViewModel 原理

## ViewModel 生命周期

ViewModel 的生命周期依赖于对应的 Activity 或 Fragment 的生命周期。通常会在 Activity 第一次 `onCreate()` 时创建 ViewModel，ViewModel 的生命周期一直持续到 Activity 最终销毁或 Fragment 最终 `detached`，期间由于屏幕旋转等配置变化引起的 Activity 销毁重建并不会导致 ViewModel 重建。借用官方示意图来解释一下：<br>![image.png|700](https://cdn.nlark.com/yuque/0/2023/png/694278/1691240763611-40e10e39-5672-4fff-b771-1da066d834c0.png#averageHue=%23fbf9f6&clientId=ufb16f5af-ab1a-4&from=paste&height=272&id=u84d565b1&originHeight=543&originWidth=522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=35020&status=done&style=stroke&taskId=u32680168-be39-4acd-9b2d-ea145c8b2f1&title=&width=261)

## ViewModel 原理 -- ViewModelProviders

一般通过如下代码初始化 ViewModel：

```java
ViewModel viewModel = ViewModelProviders.of(this).get(UserProfileViewModel.class);
```

`ViewModelProviders` 用来创建 `ViewModelProvider` 的，提供了很多 Fragment/Activity 来创建 ViewModelProvider

```java
public static ViewModelProvider of(@NonNull Fragment fragment) {
    return of(fragment, null);
}
public static ViewModelProvider of(@NonNull FragmentActivity activity) {
    return of(activity, null);
}
public static ViewModelProvider of(@NonNull Fragment fragment, @Nullable Factory factory) {
    Application application = checkApplication(checkActivity(fragment));
    if (factory == null) {
        factory = ViewModelProvider.AndroidViewModelFactory.getInstance(application);
    }
    return new ViewModelProvider(fragment.getViewModelStore(), factory);
}
public static ViewModelProvider of(@NonNull FragmentActivity activity,
        @Nullable Factory factory) {
    Application application = checkApplication(activity);
    if (factory == null) {
        factory = ViewModelProvider.AndroidViewModelFactory.getInstance(application);
    }
    return new ViewModelProvider(activity.getViewModelStore(), factory);
}
```

1. 首先会进行一系列针对 Fragment 的 `checkActivity` 看 Fragment 是否 detach，然后再 checkApplication 看 Activity/Fragment 是否 attach Application 了；
2. New ViewModelProvider 时需要 2 个参数，第一个参数 ViewModelStore，下面讲
3. 第 2 个参数是 Factory，其中 `ViewModelProvider.Factory` 是用来创建 ViewModel 的，默认是 `ViewModelProvider.AndroidViewModelFactory.getInstance(application);`，看看 AndroidViewModelFactory：

```java
public static class AndroidViewModelFactory extends ViewModelProvider.NewInstanceFactory {

    private static AndroidViewModelFactory sInstance;

    /**
     * Retrieve a singleton instance of AndroidViewModelFactory.
     *
     * @param application an application to pass in {@link AndroidViewModel}
     * @return A valid {@link AndroidViewModelFactory}
     */
    @NonNull
    public static AndroidViewModelFactory getInstance(@NonNull Application application) {
        if (sInstance == null) {
            sInstance = new AndroidViewModelFactory(application);
        }
        return sInstance;
    }

    private Application mApplication;

    /**
     * Creates a {@code AndroidViewModelFactory}
     *
     * @param application an application to pass in {@link AndroidViewModel}
     */
    public AndroidViewModelFactory(@NonNull Application application) {
        mApplication = application;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (AndroidViewModel.class.isAssignableFrom(modelClass)) {
            //noinspection TryWithIdenticalCatches
            try {
                return modelClass.getConstructor(Application.class).newInstance(mApplication);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (InstantiationException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (InvocationTargetException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            }
        }
        return super.create(modelClass);
    }
}
```

可以看到 `create` 方法，是用来创建 ViewModel 的。如果 modelClass 是 AndroidViewModel，那么就会传递 mApplication 参数反射来创建 AndroidViewModel 对象；如果只是普通的 ViewModel，调用 super.Create () 直接反射创建 ViewModel 对象。

现在看看 ViewModelStore，它是用来存储 ViewModel 的，里面维护了一个 HashMap，如果 ViewModelStoreOwner destroy 时会调用 ViewModelStore 的 clear 方法，将其保存的 ViewModel 遍历 clear。

```java
public class ViewModelStore {
    private final HashMap<String, ViewModel> mMap = new HashMap<>();
    final void put(String key, ViewModel viewModel) {
        ViewModel oldViewModel = mMap.put(key, viewModel);
        if (oldViewModel != null) {
            oldViewModel.onCleared();
        }
    }
    final ViewModel get(String key) {
        return mMap.get(key);
    }
    Set<String> keys() {
        return new HashSet<>(mMap.keySet());
    }
    /**
     *  Clears internal storage and notifies ViewModels that they are no longer used.
     */
    public final void clear() {
        for (ViewModel vm : mMap.values()) {
            vm.clear();
        }
        mMap.clear();
    }
}
```

其中 ViewModelOwner 代表了一个 scope 拥有 ViewModelStore，通常是 Activity/Fragment 都有对应的实现

```java
public interface ViewModelStoreOwner {
    /**
     * Returns owned {@link ViewModelStore}
     *
     * @return a {@code ViewModelStore}
     */
    @NonNull
    ViewModelStore getViewModelStore();
}
```

上面是获取到了 ViewModelProvider，通过 ViewModelProvider 可以获取到具体的 ViewModel

```java
public <T extends ViewModel> T get(@NonNull String key, @NonNull Class<T> modelClass) {
    ViewModel viewModel = mViewModelStore.get(key);

    if (modelClass.isInstance(viewModel)) {
        if (mFactory instanceof OnRequeryFactory) {
            ((OnRequeryFactory) mFactory).onRequery(viewModel);
        }
        return (T) viewModel;
    } else {
        //noinspection StatementWithEmptyBody
        if (viewModel != null) {
            // TODO: log a warning.
        }
    }
    if (mFactory instanceof KeyedFactory) {
        viewModel = ((KeyedFactory) (mFactory)).create(key, modelClass);
    } else {
        viewModel = (mFactory).create(modelClass);
    }
    mViewModelStore.put(key, viewModel);
    return (T) viewModel;
}
```

通过 mViewModelStore 如果有返回 ViewModel，如果没有通过 factory 创建 ViewModel，并将其缓存到 mViewModelStore 中去。

如果在 Activity recreate 时重新获取到之前的 ViewModel，通过 `NonConfigurationInstances`，待验证？

### Activity 中创建与获取 ViewModel 的整体流程如下所示

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691240786969-db57580c-2d91-4bdd-9dbf-2de880e93823.png#averageHue=%23f7f7f7&clientId=ufb16f5af-ab1a-4&from=paste&height=412&id=u564414e3&originHeight=823&originWidth=1240&originalType=binary&ratio=2&rotation=0&showTitle=false&size=137620&status=done&style=stroke&taskId=ub80d08e4-8f22-450e-911b-63b89dc5305&title=&width=620)

# ViewModel 原理 --ViewModelProvider

## 主要类

### ViewModelProvider 作用域类提供 ViewModel

#### ViewModelProvider 构造器

先看如何创建 `ViewModelProvider`：

```kotlin
public open class ViewModelProvider {
	// 3个参数
	@JvmOverloads  
	constructor(  
	    private val store: ViewModelStore,  
	    private val factory: Factory,  
	    private val defaultCreationExtras: CreationExtras = CreationExtras.Empty,  
	)
	// 1个参数
	public constructor(  
	    owner: ViewModelStoreOwner  
	) : this(owner.viewModelStore, defaultFactory(owner), defaultCreationExtras(owner))
	// 2个参数
	public constructor(owner: ViewModelStoreOwner, factory: Factory) : this(  
	    owner.viewModelStore,  
	    factory,  
	    defaultCreationExtras(owner)  
)
	// ...
}
```

- 参数 1：store ViewModelStore，用于存储 ViewModel 的，见 [[#ViewModelStore]]
- 参数 2：factory，用于实例化 ViewModel 的
- 参数 3：defaultCreationExtras，传参到 factory

##### 1 个参数

```kotlin
// ViewModelProvider
public constructor(
	owner: ViewModelStoreOwner
) : this(owner.viewModelStore, defaultFactory(owner), defaultCreationExtras(owner))
```

###### 默认的 Factory

默认的 Factory

```kotlin
defaultFactory(owner)
```

其实是 AndroidViewModelFactory 的 defaultFactory

```kotlin
public open class AndroidViewModelFactory  
private constructor(  
    private val application: Application?,  
) : NewInstanceFactory() {
	// AndroidViewModelFactory.Companion.defaultFactory
	public companion object {
		internal fun defaultFactory(owner: ViewModelStoreOwner): Factory =  
		    if (owner is HasDefaultViewModelProviderFactory)  
		        owner.defaultViewModelProviderFactory else instance
	}
}
```

如果 `ViewModelStoreOwner` 是 `HasDefaultViewModelProviderFactory`，返回其 `defaultViewModelProviderFactory`，Activity/Fragment 都实现了该接口；否则返回 instance。

其中 instance 是 `NewInstanceFactory`：

```kotlin
class NewInstanceFactory {
	public companion object {
		@JvmStatic  
		public val instance: NewInstanceFactory  
		    get() {  
		        if (sInstance == null) {  
		            sInstance = NewInstanceFactory()  
		        }  
		        return sInstance!!  
		    }
	}
}
```

而 `NewInstanceFactory` 是通过反射创建 ViewModel 实例的

```kotlin
public open class NewInstanceFactory : Factory {
	@Suppress("DocumentExceptions")
	override fun <T : ViewModel> create(modelClass: Class<T>): T {
		return try {
			modelClass.getDeclaredConstructor().newInstance()
		} catch (e: XXXException) {
		}
	}
}
```

接着看 `HasDefaultViewModelProviderFactory`：

```kotlin
interface HasDefaultViewModelProviderFactory {
     // 返回默认的ViewModelProvider.Factory，如果ViewModelProvider没有提供自定义的Factory
    val defaultViewModelProviderFactory: ViewModelProvider.Factory 
     // 返回默认的CreationExtras，如果ViewModelProvider.Factory.create没有复写，
    val defaultViewModelCreationExtras: CreationExtras
        get() = CreationExtras.Empty
}
```

`HasDefaultViewModelProviderFactory` 有很多实现。

###### HasDefaultViewModelProviderFactory

以 `ComponentActivity` 为例：

```java
// androidx.activity.ComponentActivity
class ComponentActivity implements HasDefaultViewModelProviderFactory {
	private ViewModelProvider.Factory mDefaultFactory;
	@Override  
	public ViewModelProvider.Factory getDefaultViewModelProviderFactory() {  
	    if (mDefaultFactory == null) {  
	        mDefaultFactory = new SavedStateViewModelFactory(getApplication(), this, getIntent() != null ? getIntent().getExtras() : null); 
	    }  
	    return mDefaultFactory;  
	}
}


```

ComponentActivity 默认是 `SavedStateViewModelFactory`，传递到 `SavedStateHandle` 的参数是 `intent.getExtras()`

接着看下 Fragment：

```java
class Fragment implements HasDefaultViewModelProviderFactory {
	ViewModelProvider.Factory mDefaultFactory;
	@Override  
	public ViewModelProvider.Factory getDefaultViewModelProviderFactory() {  
	    if (mFragmentManager == null) {  
	        throw new IllegalStateException("Can't access ViewModels from detached fragment");  
	    }  
	    if (mDefaultFactory == null) {  
	        Application application = null;  
	        Context appContext = requireContext().getApplicationContext();  
	        while (appContext instanceof ContextWrapper) {  
	            if (appContext instanceof Application) {  
	                application = (Application) appContext;  
	                break;            }  
	            appContext = ((ContextWrapper) appContext).getBaseContext();  
	        }  
	        if (application == null && FragmentManager.isLoggingEnabled(Log.DEBUG)) {  
	            Log.d(FragmentManager.TAG, "Could not find Application instance from "  
	                    + "Context " + requireContext().getApplicationContext() + ", you will "  
	                    + "not be able to use AndroidViewModel with the default "  
	                    + "ViewModelProvider.Factory");  
	        }  
	        mDefaultFactory = new SavedStateViewModelFactory(  
	                application,  
	                this,                getArguments());  
	    }  
	    return mDefaultFactory;  
	}
}
```

Fragment 默认也是 `SavedStateViewModelFactory`，传递到 `SavedStateHandle` 参数的是 `Fragment.getArguments()`

获取一个 Context 的 Application：

```java
Application application = null;  
Context appContext = requireContext().getApplicationContext();  
while (appContext instanceof ContextWrapper) {  
	if (appContext instanceof Application) {  
		application = (Application) appContext;  
		break;            }  
	appContext = ((ContextWrapper) appContext).getBaseContext();  
}  
```

###### 默认的 `CreationExtras`

```kotlin
internal fun defaultCreationExtras(owner: ViewModelStoreOwner): CreationExtras {  
    return if (owner is HasDefaultViewModelProviderFactory) {  
        owner.defaultViewModelCreationExtras  
    } else CreationExtras.Empty  
}
```

如果 `owner` 是 `HasDefaultViewModelProviderFactory`，取其 `defaultViewModelCreationExtras`，`ComponentActivity` 实现了该接口，Fragment 实现了该接口，但没有提供 `defaultViewModelCreationExtras`，下面是 `ComponentActivity` 的：

```java
public CreationExtras getDefaultViewModelCreationExtras() {  
    MutableCreationExtras extras = new MutableCreationExtras();  
    if (getApplication() != null) {  
        extras.set(ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY, getApplication());  
    }  
    extras.set(SavedStateHandleSupport.SAVED_STATE_REGISTRY_OWNER_KEY, this);  
    extras.set(SavedStateHandleSupport.VIEW_MODEL_STORE_OWNER_KEY, this);  
    if (getIntent() != null && getIntent().getExtras() != null) {  
        extras.set(SavedStateHandleSupport.DEFAULT_ARGS_KEY, getIntent().getExtras());  
    }  
    return extras;  
}
```

##### 2 个参数

```kotlin
public constructor(owner: ViewModelStoreOwner, factory: Factory) : this(  
    owner.viewModelStore,  
    factory,  
    defaultCreationExtras(owner)  
)
```

有默认的 `CreationExtras` 参数

### ViewModelStore 存储 ViewModel

`ViewModelStore` 是用来存储 ViewModel 的；ViewModelStore 一种缓存机制，通过键值对的形式来缓存 ViewModel 对象，key 取值为 ViewModel 类名；一个 ViewModelStore 实例必须在配置变更时保留实例不变：

- 一个 Owner 的 `ViewModelStore` 由于配置变更导致的销毁和重建，新实例的 Owner 仍然需要持有旧的 ViewModelStore 实例。
- 如果一个 Owner 已经 destroy 并且不需要重建时，需要调用 `ViewModelStore` 的 `clear` 方法，所以 ViewModel 需要被通知不能再使用了
- 用 `ViewModelStoreOwner.getViewModelStore` 来检索 `activities` 或 `fragments` 的 `ViewModelStore` 实例

```kotlin
// androidX viewmodel v2.6.2
open class ViewModelStore {
    private val map = mutableMapOf<String, ViewModel>()
    fun put(key: String, viewModel: ViewModel) {
        val oldViewModel = map.put(key, viewModel)
        oldViewModel?.onCleared()
    }
    operator fun get(key: String): ViewModel? {
        return map[key]
    }
    fun keys(): Set<String> {
        return HashSet(map.keys)
    }
    fun clear() {
        for (vm in map.values) {
            vm.clear()
        }
        map.clear()
    }
}
```

`ViewModelStore` 里面有一个 map，用来缓存 ViewModel 的实例。

### ViewModelStoreOwner 拥有 ViewModelStore

实现了 `ViewModelStoreOwner` 接口的组件内部会自动创建 `ViewModelStore`, ViewModel 对象会缓存到 ViewModelStore 这些组件产生了绑定关系, `NonConfigurationInstances` 是实现 Activity 配置发生改变时，ViewModel 保存数据的关键

一个用于 `ViewModelStore` 的作用域，实现此接口的责任是保留 ViewModelStore 实例由于配置变更，scope 销毁时调用 `ViewModelStore.clear()`

```kotlin
interface ViewModelStoreOwner {
    val viewModelStore: ViewModelStore
}
```

### Factory 创建 ViewModel 实例

Factory 是用于创建 ViewModel 实例的

```kotlin
public interface Factory {  
    public fun <T : ViewModel> create(modelClass: Class<T>): T {  
        throw UnsupportedOperationException(  
            "Factory.create(String) is unsupported.  This Factory requires " +  
                "`CreationExtras` to be passed into `create` method."  
        )  
    }  
	public fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T = create(modelClass)  

	companion object {  
		fun from(vararg initializers: ViewModelInitializer<*>): Factory =  
		InitializerViewModelFactory(*initializers)  
	}  
}
```

- 1 个参数的 `create`，通过给定的 `Class` 创建一个 `ViewModel` 实例
- 2 个参数的 `create`，通过给定的 `Class` 创建一个 `ViewModel` 实例，并将 `CreationExtras` 传递给 `Factory`

#### NewInstanceFactory、AndroidViewModelFactory

工厂类接口两个自带实现类， `NewInstanceFactory`、`AndroidViewModelFactory` 分别用于创建自定义 ViewModel、AndroidViewModel *

##### NewInstanceFactory

简单的工厂，调用给定的 `modelClass` 的默认构造函数来创建实例，所以 `modelClass` 需要有默认的构造器

```kotlin
public open class NewInstanceFactory : Factory {
	@Suppress("DocumentExceptions")
	override fun <T : ViewModel> create(modelClass: Class<T>): T {
		return try {
		} catch (e: XXXException) {
		}
	}
	public companion object {
		private var sInstance: NewInstanceFactory? = null
		@JvmStatic
		public val instance: NewInstanceFactory
			@RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
			get() {
				if (sInstance == null) {
					sInstance = NewInstanceFactory()
				}
				return sInstance!!
			}

		private object ViewModelKeyImpl : Key<String>
		/**
		 * A [CreationExtras.Key] to get a key associated with a requested
		 * `ViewModel` from [CreationExtras]
		 *
		 *  `ViewModelProvider` automatically puts a key that was passed to
		 *  `ViewModelProvider.get(key, MyViewModel::class.java)`
		 *  or generated in `ViewModelProvider.get(MyViewModel::class.java)` to the `CreationExtras` that
		 *  are passed to [ViewModelProvider.Factory].
		 */
		@JvmField
		val VIEW_MODEL_KEY: Key<String> = ViewModelKeyImpl
	}
}
```

**构造器：** 没有参数的默认构造器

**create：** 通过反射，调用 modelClass 的默认构造器 new 出对象

##### AndroidViewModelFactory

可用于创建 `ViewModel` 和 `AndroidViewModel`

```kotlin
public open class AndroidViewModelFactory  
private constructor(  
    private val application: Application?, 
) : NewInstanceFactory() {
	public constructor() : this(null, 0)
	public constructor(application: Application) : this(application, 0)
	override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {
	    return if (application != null) {  
	        create(modelClass)  
	    } else {  
	        val application = extras[APPLICATION_KEY]  
	        if (application != null) {  
	            create(modelClass, application)  
	        } else {  
	            // For AndroidViewModels, CreationExtras must have an application set  
				// 判断是否为AndroidViewModel
	            if (AndroidViewModel::class.java.isAssignableFrom(modelClass)) {  
	                throw IllegalArgumentException(  
	                    "CreationExtras must have an application by `APPLICATION_KEY`"  
	                )  
	            }  
	            super.create(modelClass)  
	        }  
	    }  
	}
	override fun <T : ViewModel> create(modelClass: Class<T>): T {  
	    return if (application == null) {  
	        throw UnsupportedOperationException(  
	            "AndroidViewModelFactory constructed " +  
	                "with empty constructor works only with " +  
	                "create(modelClass: Class<T>, extras: CreationExtras)."  
	        )  
	    } else {  
	        create(modelClass, application)  
	    }  
	}
	private fun <T : ViewModel> create(modelClass: Class<T>, app: Application): T {  
		// 判断是否为AndroidViewModel
	    return if (AndroidViewModel::class.java.isAssignableFrom(modelClass)) {  
	        try {  
	            modelClass.getConstructor(Application::class.java).newInstance(app)  
	        } catch (e: XXXException) { /*...*/}
	    } else super.create(modelClass)  
	}
	public companion object {  
	    internal fun defaultFactory(owner: ViewModelStoreOwner): Factory =  
	        if (owner is HasDefaultViewModelProviderFactory)  
	            owner.defaultViewModelProviderFactory else instance  
	    internal const val DEFAULT_KEY = "androidx.lifecycle.ViewModelProvider.DefaultKey"  
	  
	    private var sInstance: AndroidViewModelFactory? = null  
	    @JvmStatic  
	    public fun getInstance(application: Application): Android是iewModelFactory {  
	        if (sInstance == null) {  
	            sInstance = AndroidViewModelFactory(application)  
	        }  
	        return sInstance!!  
	    }  
	    private object ApplicationKeyImpl : Key<Application>  
		@JvmField  
	    val APPLICATION_KEY: Key<Application> = ApplicationKeyImpl  
	}
}
```

**构造器：** 有 1 个 `application` 参数

**create() 方法：**

- 不带 `CreationExtras` 参数，通过反射调用 modelClass 带 1 个 application 的构造器 new 出对象，所以需要是 AndroidViewModel 且带一个 application 参数
- 带 `CreationExtras` 参数，取出来 `APPLICATION_KEY` 参数，再通过反射 new 出对象，也是需要是 AndroidViewModel 且带一个 application 参数

#### SavedStateViewModelFactory

见：[[ViewModel的SavedStateHandle#SavedStateViewModelFactory]]

#### ComponentActivity 默认的 Factory

```kotlin
// androidx.activity.ComponentActivity
class ComponentActivity {
	// Lazily recreated from NonConfigurationInstances by getViewModelStore()  
	private ViewModelStore mViewModelStore;  
	private ViewModelProvider.Factory mDefaultFactory;
	@Override  
	public ViewModelProvider.Factory getDefaultViewModelProviderFactory() {  
	    if (mDefaultFactory == null) {  
	        mDefaultFactory = new SavedStateViewModelFactory( getApplication(),  
	                this,getIntent() != null ? getIntent().getExtras() : null);  
	    }  
	    return mDefaultFactory;  
	}
}
```

继承自 `ComponentActivity` 的，如 `AppCompatActivity`，默认都是 `SavedStateViewModelFactory`，所以在 `AppCompatActivity` 中默认支持的 ViewModel:

- 无参数的 `ViewModel`
- 1 个 `Application` 参数的 `AndroidViewModel`
- 1 个 `SavedStateHandle` 参数的 `ViewModel`
- 依次 `Application`、`SavedStateHandle` 2 个参数的 `AndroidViewModel`

#### Fragment 默认的 Factory

```java
// androidx.fragment v1.4.1
@Override  
public ViewModelProvider.Factory getDefaultViewModelProviderFactory() {  
    if (mFragmentManager == null) {  
        throw new IllegalStateException("Can't access ViewModels from detached fragment");  
    }  
    if (mDefaultFactory == null) {  
        Application application = null;  
        Context appContext = requireContext().getApplicationContext();  
        while (appContext instanceof ContextWrapper) {  
            if (appContext instanceof Application) {  
                application = (Application) appContext;  
                break;            }  
            appContext = ((ContextWrapper) appContext).getBaseContext();  
        }  
        if (application == null && FragmentManager.isLoggingEnabled(Log.DEBUG)) {  
            Log.d(FragmentManager.TAG, "Could not find Application instance from "  
                    + "Context " + requireContext().getApplicationContext() + ", you will "  
                    + "not be able to use AndroidViewModel with the default "  
                    + "ViewModelProvider.Factory");  
        }  
        mDefaultFactory = new SavedStateViewModelFactory(application, this, getArguments());  
    }  
    return mDefaultFactory;  
}
```

`Fragment` 默认都是 `SavedStateViewModelFactory`，所以在 `Fragment` 中默认支持的 `ViewModel`:

- 无参数的 `ViewModel`
- 1 个 `Application` 参数的 `AndroidViewModel`
- 1 个 `SavedStateHandle` 参数的 `ViewModel`
- 依次 `Application`、`SavedStateHandle` 2 个参数的 `AndroidViewModel`

### CreationExtras 为 Factory 提供创建 ViewModel 参数

为 `Factory` 提供创建 `ViewModel` 参数，使 Factory 回归工厂本质，实现 `Stateless Factory`。

见 [[ViewModel之CreationExtras]]

## ViewModel 原理

获取 ViewModel 实例的过程：

```kotlin
ViewModelProvider(this).get(TestActLifecycleViewModel::class.java)
```

调用的是 `ViewModelProvider` 1 个参数的构造器，`factory` 和 `defaultCreationExtras` 都是默认的。

**store：**

- 用于存储 ViewModel 的，用 `LinkedHashMap` 存储的，key 默认为：`$DEFAULT_KEY:$canonicalName`

**factory：**

- 如果是 `ComponentActivity`，是 `SavedStateViewModelFactory`
- 如果是 `Fragment`，是 `SavedStateViewModelFactory`

**defaultCreationExtras：**

- 如果是 `ComponentActivity` oAULT_ARGS_KEY `
- 如果是 `Fragment`，则没有提供

### ViewModel 的存储和获取原理

**ViewModel 的存储：**
ViewModel 是存储在 ViewModelStore 中的

```kotlin
store.put(key, viewModel);
```

**ViewModel 的获取：**
ViewModel 的获取是通过 Factory 的 create 方法，不同的 Factory 实现不同

```kotlin
// ViewModelProvider
internal const val DEFAULT_KEY = "androidx.lifecycle.ViewModelProvider.DefaultKey"
public open operator fun <T : ViewModel> get(modelClass: Class<T>): T {  
    val canonicalName = modelClass.canonicalName  
        ?: throw IllegalArgumentException("Local and anonymous classes can not be ViewModels")  
    return get("$DEFAULT_KEY:$canonicalName", modelClass)  
}
@MainThread  
public open operator fun <T : ViewModel> get(key: String, modelClass: Class<T>): T {  
    val viewModel = store[key]  
    if (modelClass.isInstance(viewModel)) {  
        (factory as? OnRequeryFactory)?.onRequery(viewModel!!)  
        return viewModel as T  
    } else {  
        @Suppress("ControlFlowWithEmptyBody")  
        if (viewModel != null) {  
            // TODO: log a warning.  
        }  
    }  
    val extras = MutableCreationExtras(defaultCreationExtras)  
    extras[VIEW_MODEL_KEY] = key  
    // AGP has some desugaring issues associated with compileOnly dependencies so we need to  
    // fall back to the other create method to keep from crashing.    return try {  
        factory.create(modelClass, extras)  
    } catch (e: AbstractMethodError) {  
        factory.create(modelClass)  
    }.also { store.put(key, it) }  
}
```

1 个参数的 `get()`：通过 `canonicalName` 和 `DEFAULT_KEY` 字段拼接成一个字符串，从而形成一个完整的 Key 字段，就是在 `ViewModelStore` 里面**存储 ViewModel 的 key**。

2 个参数的 `get()`：通过 key 从 store 中获取 viewModel，如果获取到了就返回；没有获取到，先构造一个 `MutableCreationExtras`，将当前 key 存储到 `VIEW_MODEL_KEY`，并将 `ViewModelProvider` 中的 `defaultCreationExtras` 也存储到 `extras` 中去，最后调用 Factory 的 create 方法创建 ViewModel。

具体见：[[#Factory 创建 ViewModel 实例]]

### ViewModelStore 的存储和获取

ViewModel 实例是用 ViewModelStore 来获取的，既然要做到 ViewModel 实例的复用，那么 ViewModelStore 它也必须做到复用才可以。

```java
// androidx.activity v1.8.0
class ComponentActivity {
	@Override  
	public ViewModelStore getViewModelStore() {  
	    if (getApplication() == null) {  
	        throw new IllegalStateException("Your activity is not yet attached to the "  
	                + "Application instance. You can't request ViewModel before onCreate call.");  
	    }  
	    ensureViewModelStore();  
	    return mViewModelStore;  
	}
	void ensureViewModelStore() {  
	    if (mViewModelStore == null) {  
	    // 如果mViewModelStore为空则从NonConfigurationInstances中获取
	        NonConfigurationInstances nc = (NonConfigurationInstances) getLastNonConfigurationInstance();  
	        if (nc != null) {  
	            // Restore the ViewModelStore from NonConfigurationInstances  
	            mViewModelStore = nc.viewModelStore;  
	        }  
	        // 如果获取不到，则直接创建一个
	        if (mViewModelStore == null) {  
	            mViewModelStore = new ViewModelStore();  
	        }  
	    }  
	}
}
```

首先通过 `NonConfigurationInstances` 获取 `ViewModelStore`，如果 `NonConfigurationInstances` 不存则创建一个 `ViewModelStore` 实例。

看看 `NonConfigurationInstances` 是什么？

```java
static final class NonConfigurationInstances {  
    Object custom;  
    ViewModelStore viewModelStore;  
}
```

**ViewModelStore 存储时机？**
发生在 `onRetainNonConfigurationInstance()` 方法里面：

```java
// 在Activity异常、配置更改要销毁的时，调用该方法保存该方法返回的对象；在getLastNonConfigurationInstance()中恢复
@Override  
public final Object onRetainNonConfigurationInstance() {  
    // 兼容旧的的方式
    Object custom = onRetainCustomNonConfigurationInstance();  
  
    ViewModelStore viewModelStore = mViewModelStore;  
    if (viewModelStore == null) {  
        // No one called getViewModelStore(), so see if there was an existing  
        // ViewModelStore from our last NonConfigurationInstance      
        // 尝试从NonConfigurationInstance获取ViewModelStore  
        NonConfigurationInstances nc = (NonConfigurationInstances) getLastNonConfigurationInstance();  
        if (nc != null) {  
            viewModelStore = nc.viewModelStore;  
        }  
    }  
  
    if (viewModelStore == null && custom == null) {  
        return null;  
    }  
	// viewModelStore不为空则构建了一个NonConfigurationInstances对象，并且把viewModelStore存了进去。
    NonConfigurationInstances nci = new NonConfigurationInstances();  
    nci.custom = custom;  
    nci.viewModelStore = viewModelStore;  
    return nci;  
}
@Deprecated  
@Nullable  
public Object getLastCustomNonConfigurationInstance() {  
    NonConfigurationInstances nc = (NonConfigurationInstances)  
            getLastNonConfigurationInstance();  
    return nc != null ? nc.custom : null;  
}
@Nullable  
public Object getLastNonConfigurationInstance() {  
    return mLastNonConfigurationInstances != null  
            ? mLastNonConfigurationInstances.activity : null;  
}
```

在 Activity 因配置变更而要销毁时，且会重新创建 Activity，系统就会调用这个方法。也就说，配置改变时系统把 `viewModelStore` 存在了 `NonConfigurationInstances` 中。

跟进 `onRetainNonConfigurationInstance()`，它是在 Activity 的 `retainNonConfigurationInstances` 调用，而该方法又是在 `ActivityThread.performDestroyActivity中调用的`：

```java
// ActivityThread
class ActivityThread {
	void performDestroyActivity(ActivityClientRecord r, boolean finishing,  
        int configChanges, boolean getNonConfigInstance, String reason) {
	    // ...
	    performPauseActivityIfNeeded(r, "destroy");
	    if (!r.stopped) {  
		    callActivityOnStop(r, false /* saveState */, "destroy");  
		}
		if (getNonConfigInstance) {  
			r.lastNonConfigurationInstances = r.activity.retainNonConfigurationInstances();  
		}
		// ...
		mInstrumentation.callActivityOnDestroy(r.activity);
		// ...
	}
}
```

即在 `Activity` 的 `onPause` 到 `onDestroy` 之间会调用 `Activity.retainNonConfigurationInstances()` 来保存数据。

### Activity 的重建流程

正常启动一个 `Activity`，会执行 `ActivityThread` 的 `handleLaunchActivity`，但是一个页面因为配置变更而重建的时候它执行 `handleRelaunchActivity` 方法，这个方法是重新创建 `Activity` 的一个入口。

#### handleRelaunchActivity

```java
// ActivityThread API34
@Override  
public void handleRelaunchActivity(ActivityClientRecord tmp, PendingTransactionActions pendingActions) {
	// ...
	// mActivities里面存储的就是当前应用当前进程所已经打开的所有Activity信息的集合
	ActivityClientRecord r = mActivities.get(tmp.token);
	r.activity.mChangingConfigurations = true;
	// 重新创建Activity执行
	handleRelaunchActivityInner(r, configChanges, tmp.pendingResults, tmp.pendingIntents,  
        pendingActions, tmp.startsNotResumed, tmp.overrideConfig, "handleRelaunchActivity");
}
```

`mActivities` 里面存储的就是当前应用当前进程所已经打开的所有 `Activity` 信息的集合，通过 `mActivities` 集合获取到一个 `ActivityClientRecord`，它里面有个重要的参数 `lastNonConfigurationInstances`：

```java
// ActivityThread API34
final ArrayMap<IBinder, ActivityClientRecord> mActivities = new ArrayMap<>();
// ActivityClientRecord
public static final class ActivityClientRecord {
    // ···
    // 因配置变更而被销毁的Activity它所存留下来的数据
    Activity.NonConfigurationInstances lastNonConfigurationInstances;
}
```

#### handleRelaunchActivityInner

**handleRelaunchActivityInner()：**

```java
// ActivityThread API34
private void handleRelaunchActivityInner(ActivityClientRecord r, int configChanges) {
	// 保留上次使用的Intent
	// Preserve last used intent, it may be set from Activity#setIntent().  
	final Intent customIntent = r.activity.mIntent;
	// 重新创建Acitivty之前需要把发生配置变更的Activity销毁掉
    if (!r.paused) {
        performPauseActivity(r, false, reason, null /* pendingActions */);
    }
    if (!r.stopped) {
        callActivityOnStop(r, true /* saveState */, reason);
    }
    // 销毁Activity
    handleDestroyActivity(r, false, configChanges, true, reason);

    // 创建和启动Activity，这个r就是和前面要销毁的r是同一个
    handleLaunchActivity(r, pendingActions, customIntent);
}
```

在重新创建 `Activity` 之前需要把发生配置变更的 `Activity` 销毁掉，所以执行配置变更的 `performPauseActivity()` 方法以及 `callActivityOnStop()` 方法，在 `callActivityOnStop()` 一并执行 `callActivityOnSaveInstanceState(r)` 并且有机会存储数据

#### handleDestroyActivity

**Activity 的 lastNonConfigurationInstances 哪里来？**
在 `performDestroyActivity()`，根据 `getNonConfigInstance` 会保存 `Activity` 的 `retainNonConfigurationInstances()` 方法返回值，而这个 `retainNonConfigurationInstances()` 就来源于 `Activity` 的 `onRetainNonConfigurationInstance()` 方法，而 `onRetainNonConfigurationInstance` 方法就保存了 `NonConfigurationInstances` 实例，`这个实例里面就保存了ViewModelStore`。

```java
// ActivityThread
@Override  
public void handleDestroyActivity() {
	performDestroyActivity(r, finishing, configChanges, getNonConfigInstance, reason);
}
ActivityClientRecord performDestroyActivity(IBinder token, boolean finishing,
            int configChanges, boolean getNonConfigInstance, String reason) {
    // 获取到ActivityClientRecord
	ActivityClientRecord r = mActivities.get(token);
	// 保存了来自Activity的东西，它里面就包含了viewModelStore
 	 if (getNonConfigInstance) {  
    try {  
        r.lastNonConfigurationInstances = r.activity.retainNonConfigurationInstances();  
    } catch (Exception e) {  
        if (!mInstrumentation.onException(r.activity, e)) {  
            throw new RuntimeException("Unable to retain activity "  
                    + r.intent.getComponent().toShortString() + ": " + e.toString(), e);  
	}
}
// Activity
NonConfigurationInstances retainNonConfigurationInstances() {
	// 调用方法,activity包含了viewModelStore
	Object activity = onRetainNonConfigurationInstance();
	HashMap<String, Object> children = onRetainNonConfigurationChildInstances();
	FragmentManagerNonConfig fragments = mFragments.retainNestedNonConfig();
	//...
	NonConfigurationInstances nci = new NonConfigurationInstances();
	// 赋值
	nci.activity = activity;
	nci.children = children;
	nci.fragments = fragments;
	nci.loaders = loaders;
	return nci;
}
// androidx ComponentActivity
public final Object onRetainNonConfigurationInstance() {
	Object custom = onRetainCustomNonConfigurationInstance();
	// 这个mViewModelStore成员就是Activity里面的ViewModelStore
	ViewModelStore viewModelStore = mViewModelStore;
	if (viewModelStore == null) {
		// No one called getViewModelStore(), so see if there was an existing
		// ViewModelStore from our last NonConfigurationInstance
		NonConfigurationInstances nc =
				(NonConfigurationInstances) getLastNonConfigurationInstance();
		if (nc != null) {
			viewModelStore = nc.viewModelStore;
		}
	}
	if (viewModelStore == null && custom == null) {
		return null;
	}
	NonConfigurationInstances nci = new NonConfigurationInstances();
	nci.custom = custom;
	// 赋值并返回，保存好了
	nci.viewModelStore = viewModelStore;
	return nci;
}
```

这个数据都会被保存到 `ActivityClientRecord` 的 `lastNonConfigurationInstances` 里面，这个 r 对象是通过 `ActivityClientRecord r = mActivities.get(tmp.token)` 获取的，那实际上就跟在 `handleLaunchActivity()` 当中获取到的那个 `ActivityClientRecord` 对象是同一个实例对象。

那么在 `performDestroyActivity()` 中的 `ActivityClientRecord` 就包含了被销毁的 `Activity` 存留下来的对象，销毁之后就执行 `Activity` 重建工作，重建最终会走到 `performLaunchActivity()` 方法，执行 `newActivity()` 去 new 一个 `Activity`，还会执行 `activity.attach()` 方法：

```java
// ActivityThread API34
public Activity handleLaunchActivity(ActivityClientRecord r) {
	final Activity a = performLaunchActivity(r, customIntent);
}
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {
	Activity activity = null;
	// 创建Activity
	activity = mInstrumentation.newActivity(cl, component.getClassName(), r.intent);
	// ... 
	// 里面保存了lastNonConfigurationInstances，省略部分参数
    activity.attach(appContext, this, r.lastNonConfigurationInstances ····);
    
	r.lastNonConfigurationInstances = null;
	r.activity = activity;
	if (r.isPersistable()) {
		mInstrumentation.callActivityOnCreate(activity, r.state, r.persistentState);
	} else {
		mInstrumentation.callActivityOnCreate(activity, r.state);
	}
    r.setState(ON_CREATE);
}
```

在 `Activity` 类中的 `attach()` 方法就把 `lastNonConfigurationInstances` 保存到 `mLastNonConfigurationInstances`:

```java
// Activity API34
NonConfigurationInstances mLastNonConfigurationInstances;
final void attach(Context context, ActivityThread aThread, NonConfigurationInstances lastNonConfigurationInstances,) {
	// 保存lastNonConfigurationInstances 
	mLastNonConfigurationInstances = lastNonConfigurationInstances;
}
public Object getLastNonConfigurationInstance() {  
    return mLastNonConfigurationInstances != null  
            ? mLastNonConfigurationInstances.activity : null;  
}
```

#### ViewModel 为什么能复用？

那么我们在 `ComponentActivity` 的 `ensureViewModelStore` 就能获取到保存的 `NonConfigurationInstances`：

```java
// androidx ComponentActivity 
void ensureViewModelStore() {  
    if (mViewModelStore == null) {  
        NonConfigurationInstances nc =  
                (NonConfigurationInstances) getLastNonConfigurationInstance();  
        if (nc != null) {  
	        // 从NonConfigurationInstances中恢复ViewModelStore
            // Restore the ViewModelStore from NonConfigurationInstances  
            mViewModelStore = nc.viewModelStore;  
        }  
        if (mViewModelStore == null) {  
            mViewModelStore = new ViewModelStore();  
        }  
    }  
}
```

也就是说，`ActivityThread` 中的 `ActivityClientRecord` 是不受 `Activity` 销毁重建的影响而被保存下来，`ActivityClientRecord` 中的 `lastNonConfigurationInstances` 也就被保存下来，那么 `ComponentActivity` 中的 `NonConfigurationInstances` 的 `viewModelStore` 就被保存下来实现复用。

**这就是为什么 ViewModelStore 为什么没有被清理？**

因为在执行 `onDestroy` 之前，从 `ActivityClientRecord` 持有一条到 `ViewModelStore` 引用链，所以当 `Activity` 被销毁时，`ViewModelStore` 不会被垃圾回收，也就不会被销毁，而 `Activity` 的 `reLaunch` 并不会销毁对应的 `ActivityClientRecord`，下次仍然会复用 `ActivityClientRecord`，进而复用保存的 `ViewModelStore`。

**ViewModelStore 可以复用，但是 Activity 在 OnDestroy 事件时执行了 ViewModelStore 的 onClear 方法，清除掉内部存储 ViewModel 了，那这个 ViewModel 如何能被复用呢？**

```java
// androidx ComponentActivity
getLifecycle().addObserver(new LifecycleEventObserver() {
	@Override
	public void onStateChanged(@NonNull LifecycleOwner source,
			@NonNull Lifecycle.Event event) {
		if (event == Lifecycle.Event.ON_DESTROY) {
			// Clear out the available context
			mContextAwareHelper.clearAvailableContext();
			// And clear the ViewModelStore
			if (!isChangingConfigurations()) {
				getViewModelStore().clear();
			}
			mReportFullyDrawnExecutor.activityDestroyed();
		}
	}
});
```

如果是因为配置更改导致的，比如横竖屏配置，不会去执行 clear 方法，这样也说得通，ViewModel 保存的只是数据，界面配置变化，并不需要数据重新加载，使用之前的也可以

### ViewModel 流程总结

1. ViewModelProvider 从 ViewModelStore 根据 key 获取 ViewModel 实例，如果存在直接返回；不存在就用 Factory 创建一个 ViewModel 实例返回，并缓存到 ViewModelStore 中
2. Activity 实现了 ViewModelStoreOwner 接口，重写了 getViewModelStore 方法，**先从 NonConfigurationInstances 里面获取 ViewModelStore，如果没有就创建新的实例并保存起来**
3. ViewModelStore 通过 key-value 的形式存储 ViewModel，而它自己在 Activity 因配置变更而销毁再重建时，调用 onRetainNonConfigurationInstance() 存储在 NonConfigurationInstances 里面。
4. Activity 销毁时会将 NonConfigurationInstances 保存在 ActivityThread#ActivityClientRecord 中，重建后通 Activity.attach() 重新传递给 Activity，实现复用。
5. ActivityThread 中的 ActivityClientRecord 是不受 Activity 销毁重建的影响而被保存下来，ActivityClientRecord 中的 lastNonConfigurationInstances 也就被保存下来，那么 ComponentActivity 中的 NonConfigurationInstances 的 viewModelStore 就被保存下来实现复用

# ViewModel 问题

### 一个 activity 同一个 classType 对应一个 viewModel？

是的

### 怎么实现 Activity 旋转 ViewModel 不销毁的？

在 `onRetainNonConfigurationInstance()` 回调时，从 mLastNonConfigurationInstances 中获取

```java
// 在Activity因配置改变 而正要销毁时，且新Activity会立即创建，那么系统就会调用此方法
public final Object onRetainNonConfigurationInstance() {
    Object custom = onRetainCustomNonConfigurationInstance();
    
    ViewModelStore viewModelStore = mViewModelStore;
    // ...
    if (viewModelStore == null && custom == null) {
        return null;
    }

    // new了一个NonConfigurationInstances，mViewModelStore赋值过来
    NonConfigurationInstances nci = new NonConfigurationInstances();
    nci.custom = custom;
    nci.viewModelStore = viewModelStore;
    return nci;
}

public Object getLastNonConfigurationInstance() {
    return mLastNonConfigurationInstances != null ? mLastNonConfigurationInstances.activity : null;
}
```

MLastNonConfigurationInstances 是在 Activity 的 attach 方法中赋值。

```java
// Activity
final void attach(Context context, ActivityThread aThread, ...
    NonConfigurationInstances lastNonConfigurationInstances,... ) {
    // ...
    mLastNonConfigurationInstances = lastNonConfigurationInstances;
    // ...
}
```

Attach 方法是为 Activity 关联上下文环境，是在 Activity 启动的核心流程——ActivityThread 的 performLaunchActivity 方法中调用，这里的 lastNonConfigurationInstances 是存在 ActivityClientRecord 中的一个组件信息。

ActivityClientRecord 是存在 ActivityThread 的 mActivities 中。

那么 ActivityThread 中的 ActivityClientRecord 是不受 activity 重建的影响，那么 ActivityClientRecord 中 lastNonConfigurationInstances 也不受影响，那么其中的 Object activity 也不受影响，那么 ComponentActivity 中的 NonConfigurationInstances 的 viewModelStore 不受影响，那么 viewModel 也就不受影响了。

- [ ] [屏幕旋转导致Activity销毁重建，ViewModel是如何恢复数据的](https://juejin.cn/post/6986936609522319391)
