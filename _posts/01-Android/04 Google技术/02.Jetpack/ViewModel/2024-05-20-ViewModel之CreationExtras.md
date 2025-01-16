---
date created: 2024-05-20 00:07
date updated: 2024-12-24 00:32
dg-publish: true
---

# ViewModel `CreationExtras`

## CreationExtras 概述

`CreationExtras` 是在 `Androidx-Lifecycle` 在 2.5.0 版本中添加。这个和现有的 ViewModel 搭配使用。他不能单独使用，也是被包含在 `ViewModelProvider.Factory` 里。

## 接入

```kotlin
val lifecycle_version = "2.5.0" // >=2.5.0
// ViewModel
implementation("androidx.lifecycle:lifecycle-viewmodel:$lifecycle_version")
```

## 探讨 CreationExtras

### 目前使用 Factory 的问题: `Stateful Factory`

我们知道 `ViewModel` 是通过 `ViewModelProvider` 创建的，默认 Factory 是通过反射创建实例的；如果有多个参数的 ViewModel，需要自定义 Factory：

```kotlin
class MyViewModelFactory(
    private val application: Application,
    private val param: String
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return MyViewModel(application, param) as T
    }
}
```

然后在 Activity/Fragment 中声明 ViewModel，传入自定义的 Factory：

```kotlin
val vm : MyViewModel by viewModels {
    MyViewModelFactory(application, "some data")
}
```

`"some data"` 可能来自 Activity 的 `Intent Bundle` 或者 Fragment 的 `argements`。

**一个真实的项目 ViewModel 的参数代码复杂的多，一个持有状态的 Factory 不利于复用，为了保存 ViewModel 创建时的正确性，往往要为每个 ViewModel 配备一个专属的 Factory，这就失去了 `工厂` 原本存在的意义；随着 App 页面的复杂度增加，每一处需要共享 ViewModel 的地方都要单独构建 Factory，冗余代码也越来越多**

除了直接使用 `ViewModelProvider.Factory`，还有其他几种初始化方式，例如借助 `SavedStateHandler` 等，但是无论何种方式本质上都是借助了 `ViewModelProvider.Factory`，都免不了上述 Stateful Factory 的问题。

### `CretionExtras` 解决问题：`Stateless Factory`

**Lifecycle 2.5.0-alpha01** 开始引入了 `CreationExtras` 的概念，它替代了 `Factory` 的任务为 `ViewModel` 初始化所需的参数，`Factory` 无需再持有状态。
`ViewModelProvider.Factory` 使用 `create(modelClass)` 创建 ViewModel ，在 2.5.0 之后方法签名发生了如下变化：

```kotlin
// < 2.5.0
fun <T : ViewModel> create(modelClass: Class<T>): T 
// >= 2.5.0
fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T
```

一个 `Stateless` 的 `Factory` 可以更好地复用。我们可以在一个 `Factory` 中使用 `when` 处理所有类型的 `ViewModel` 创建，一次定义多处使用。

## CreationExtras 使用

### 示例1

1 个 `application` 参数，1 个 `int`，1 个 `String` 参数的 `AndroidViewModel`

```kotlin
// ViewModel
class MyExtraAndroidViewModel(
    application: Application,
    private val param1: String?,
    private val param2: Int?,
    private val param3: Int?
) : AndroidViewModel(application) {

    fun test() {
        Log.d("hacket", "test $param1 - $param2 - $param3")
    }
}
// Factory
class ViewModelFactory : ViewModelProvider.Factory {  
    override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {  
        return when (modelClass) {  
            MyExtraAndroidViewModel::class.java -> {  
                // 通过extras获取自定义参数  
                val params1 = extras[PARAM1_KEY]  
                val params2 = extras[PARAM2_KEY]  
                val params3 = extras[PARAM3_KEY]  
                // 通过extras获取application  
                val application = extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY]  
  
                val viewModel = extras[ViewModelProvider.NewInstanceFactory.VIEW_MODEL_KEY]  
  
                Log.d(  
                    "hacket",  
                    "ViewModelFactory application=$application, viewModel=$viewModel, param1=$params1, param2=$params2, param3=$params3"  
                )  
  
                // 创建 VM                
                MyExtraAndroidViewModel(application!!, params1, params2, params3) as T  
            }  
            // ...  
            else -> throw IllegalArgumentException("Unknown class $modelClass")  
        }  
    }  
  
    companion object {  
        private object StringKeyImpl : CreationExtras.Key<String>  
        private object IntKeyImpl : CreationExtras.Key<Int>  
  
        /**  
         * A [CreationExtras.Key] to query an String in which ViewModel is being created.         */        @JvmField  
        val PARAM1_KEY: CreationExtras.Key<String> = StringKeyImpl  
  
        /**  
         * A [CreationExtras.Key] to query an Int in which ViewModel is being created.         */        @JvmField  
        val PARAM2_KEY: CreationExtras.Key<Int> = IntKeyImpl  
  
        // 不能复用IntKeyImpl，否则前面会被覆盖掉  
        @JvmField  
        val PARAM3_KEY: CreationExtras.Key<Int> = IntKeyImpl  
    }  
}
```

**使用1： ViewModelProvider**

```kotlin
// 使用
val vm by lazy {  
    val extras = MutableCreationExtras()  
    extras[ViewModelFactory.PARAM1_KEY] = "param1 value"  
    extras[ViewModelFactory.PARAM2_KEY] = 112  
    extras[ViewModelFactory.PARAM3_KEY] = 520  
    extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] = application  
    ViewModelProvider(  
        this.viewModelStore,  
        ViewModelFactory(),  
        extras  
    )["MyExtraAndroidViewModel_Key1", MyExtraAndroidViewModel::class.java]  
}
```

**使用2：viewmodels**

```kotlin
private val myExtraAndroidViewModel2 by viewModels<MyExtraAndroidViewModel>(
	extrasProducer = {
		val extras = MutableCreationExtras()
		extras[ViewModelFactory.PARAM1_KEY] = "-》param1 value"
		extras[ViewModelFactory.PARAM2_KEY] = 110
		extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] = application
		extras
	},
	factoryProducer = {
		ViewModelFactory()
	}
)
```

### 示例2：多个 ViewModel 公用Factory

```kotlin
// ViewModel
class MyExtraViewModel(  
    private val param1: String?,  
    private val param2: Int?,  
) : ViewModel() {  
  
    fun test() {  
        Log.d("hacket", "MyExtraViewModel test $param1 - $param2")  
    }  
}
// Factory
class ViewModelFactory : ViewModelProvider.Factory {  
    override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {  
        return when (modelClass) {  
            MyExtraAndroidViewModel::class.java -> {  
                // 通过extras获取自定义参数  
                val params1 = extras[PARAM1_KEY]  
                val params2 = extras[PARAM2_KEY]  
                val params3 = extras[PARAM3_KEY]  
                // 通过extras获取application  
                val application = extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY]  
                val viewModel = extras[ViewModelProvider.NewInstanceFactory.VIEW_MODEL_KEY]  
                // 创建 VM                
                MyExtraAndroidViewModel(application!!, params1, params2, params3) as T  
            }  
            MyExtraViewModel::class.java -> {  
                // 通过extras获取自定义参数  
                val params1 = extras[PARAM1_KEY]  
                val params2 = extras[PARAM2_KEY]  
                val viewModel = extras[ViewModelProvider.NewInstanceFactory.VIEW_MODEL_KEY]
                // 创建 VM                
                MyExtraViewModel(params1, params2) as T  
            }  
            // ...  
            else -> throw IllegalArgumentException("Unknown class $modelClass")  
        }  
    }
    companion object {  
        private object StringKeyImpl : CreationExtras.Key<String>  
        private object IntKeyImpl : CreationExtras.Key<Int>  
        /**  
         * A [CreationExtras.Key] to query an String in which ViewModel is being created.         */        @JvmField  
        val PARAM1_KEY: CreationExtras.Key<String> = StringKeyImpl  
        /**  
         * A [CreationExtras.Key] to query an Int in which ViewModel is being created.         */        @JvmField  
        val PARAM2_KEY: CreationExtras.Key<Int> = IntKeyImpl  
        // 不能复用IntKeyImpl，否则前面会被覆盖掉  
        @JvmField  
        val PARAM3_KEY: CreationExtras.Key<Int> = IntKeyImpl  
    }  
}
// 使用
private val myExtraViewModel by lazy {  
    val extras = MutableCreationExtras()  
    extras[ViewModelFactory.PARAM1_KEY] = "-》hacket"  
    extras[ViewModelFactory.PARAM2_KEY] = 90  
    ViewModelProvider(  
        this.viewModelStore,  
        ViewModelFactory(),  
        extras  
    )[MyExtraViewModel::class.java]  
}
```

### 示例 3：获取 Activity intent

```kotlin
object : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(
        modelClass: Class<T>,
        extras: CreationExtras
    ): T {
        // 使用 DEFAULT_ARGS_KEY 获取 Intent 中的 Bundle
        val bundle = extras[DEFAULT_ARGS_KEY]
        val id = bundle?.getInt("id") ?: 0
        return MyViewModel(id) as T
    }
}
```

### 对 `AndroidViewModel` 和 `SavedStateHandle` 的支持

`CreationExtras` 本质上就是让 Factory 变得无状态。以前为了构建不同参数类型的 ViewModel 而存在的各种特殊的 Factory 子类，比如 `AndroidViewModel` 的 `AndroidViewModelFactory` 以及 `SavedStateHandler ViewModel` 的 `SavedStateViewModelFactory` 等等，都会由于 `CreationExtras` 出现而逐渐退出舞台。

```kotlin
class CustomFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {
        return when (modelClass) {
            HomeViewModel::class -> {
                // Get the Application object from extras
                val application = checkNotNull(extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY])
                // Pass it directly to HomeViewModel
                HomeViewModel(application)
            }
            DetailViewModel::class -> {
                // Create a SavedStateHandle for this ViewModel from extras
                val savedStateHandle = extras.createSavedStateHandle()
                DetailViewModel(savedStateHandle)
            }
            else -> throw IllegalArgumentException("Unknown class $modelClass")
        } as T
    }
}
```

如上，无论 `Application` 还是 `SavedStateHandler` 都可以统一从 `CreationExtras` 获取。

`createSavedStateHandle()` 扩展函数可以基于 `CreationExtras` 创建 `SavedStateHandler`

```kotlin
public fun CreationExtras.createSavedStateHandle(): SavedStateHandle {
    val savedStateRegistryOwner = this[SAVED_STATE_REGISTRY_OWNER_KEY]
    val viewModelStateRegistryOwner = this[VIEW_MODEL_STORE_OWNER_KEY]
    val defaultArgs = this[DEFAULT_ARGS_KEY]
    val key = this[VIEW_MODEL_KEY]
    return createSavedStateHandle(
        savedStateRegistryOwner, viewModelStateRegistryOwner, key, defaultArgs
    )
}
```

### 使用 DSL 创建 ViewModelFactory

**2.5.0-alpha03** 新增了用 DSL 创建 `ViewModelFactory` 的方式，

```kotlin
androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.0-alpha03
androidx.fragment:fragment-ktx:1.5.0-alpha03
```

**源码：**

```kotlin
// viewModelFactory()
public inline fun viewModelFactory(  
    builder: InitializerViewModelFactoryBuilder.() -> Unit  
): ViewModelProvider.Factory = InitializerViewModelFactoryBuilder().apply(builder).build()

// InitializerViewModelFactoryBuilder
@ViewModelFactoryDsl  
public class InitializerViewModelFactoryBuilder {  
    private val initializers = mutableListOf<ViewModelInitializer<*>>()  
  
    fun <T : ViewModel> addInitializer(clazz: KClass<T>, initializer: CreationExtras.() -> T) {  
        initializers.add(ViewModelInitializer(clazz.java, initializer))  
    }  
	  fun build(): ViewModelProvider.Factory =  InitializerViewModelFactory(*initializers.toTypedArray())  
}

inline fun <reified VM : ViewModel> InitializerViewModelFactoryBuilder.initializer(  
    noinline initializer: CreationExtras.() -> VM  
) {  
    addInitializer(VM::class, initializer)  
}

// ViewModelInitializer
class ViewModelInitializer<T : ViewModel>(  
    internal val clazz: Class<T>,  
    internal val initializer: CreationExtras.() -> T,  
)

// InitializerViewModelFactory
internal class InitializerViewModelFactory(  
    private vararg val initializers: ViewModelInitializer<*>  
) : ViewModelProvider.Factory {  
     override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {  
        var viewModel: T? = null  
        @Suppress("UNCHECKED_CAST")  
        initializers.forEach {  
            if (it.clazz == modelClass) {  
                viewModel = it.initializer.invoke(extras) as? T  
            }  
        }  
        return viewModel ?: throw IllegalArgumentException(  
            "No initializer set for given class ${modelClass.name}"  
        )  
    }  
}
```

#### viewModelFactory 配合 ViewModelProvider

```kotlin
private val myExtraViewModel3 by lazy {  
	val factory = viewModelFactory {  
		initializer {  
			val v1 = this[ViewModelFactory.PARAM1_KEY]  
			val v2 = this[ViewModelFactory.PARAM2_KEY]  
			MyExtraViewModel(v1, v2)  
		}  
//                addInitializer(MyExtraViewModel::class) {  
//                    val v1 = this[ViewModelFactory.PARAM1_KEY]  
//                    val v2 = this[ViewModelFactory.PARAM2_KEY]  
//                    MyExtraViewModel(v1, v2)  
//                }  
	}  
	val extras = MutableCreationExtras()  
	extras[ViewModelFactory.PARAM1_KEY] = "from hacket zeng"  
	extras[ViewModelFactory.PARAM2_KEY] = 100  
	ViewModelProvider(  
		this.viewModelStore,  
		factory,  
		extras  
	)["key-MyExtraViewModel", MyExtraViewModel::class.java]  
}
```

#### viewModelFactory 配合 `viewModels()`

```kotlin
private val myExtraViewModel2 by viewModels<MyExtraViewModel>(  
	// 提供CreationExtras
	extrasProducer = {  
		val extras = MutableCreationExtras()  
		extras[ViewModelFactory.PARAM1_KEY] = "from hacket"  
		extras[ViewModelFactory.PARAM2_KEY] = 900  
		extras  
	},  
	factoryProducer = {  
		viewModelFactory {  
			initializer {  
				// 取CreationExtras数据
				val v1 = this[ViewModelFactory.PARAM1_KEY]  
				val v2 = this[ViewModelFactory.PARAM2_KEY]  
				MyExtraViewModel(v1, v2)  
			}  
//                addInitializer(MyExtraViewModel::class) {  
//                    val v1 = this[ViewModelFactory.PARAM1_KEY]  
//                    val v2 = this[ViewModelFactory.PARAM2_KEY]  
//                    MyExtraViewModel(v1, v2)  
//                }  
		}  
	}    
)
```

#### 配置多个ViewModel

由于 `initializers` 是一个列表，所以可以存储多个 ViewModel 的创建信息，因此可以通过 DSL 配置多个 ViewModel 的创建：

```kotlin
val factory = viewModelFactory {
    initializer {
        MyViewModel(123)
    }
    initializer {
        MyViewModel2("Test")
    }
}
```

### 对 Compose 的支持

可以通过 `LocalViewModelStoreOwner` 获取当前的 `defaultExtras`，然后根据需要添加自己的 `extras` 即可。

## CreationExtras 原理

### CreationExtras

`CreationExtras` 是一个类似 map 的对象，传递给`ViewModelProvider.Factory.create()`方法，提供一些可选的信息给 `Factory`。

它用于标记 Factory 无状态（**Stateless Factory**），这样更容易注入一个 factory，因为在构造时，不需要所有可用的信息

CreationExtras 类源码：

```kotlin
public abstract class CreationExtras internal constructor() {
    internal val map: MutableMap<Key<*>, Any?> = mutableMapOf()

    /**
     * Key for the elements of [CreationExtras]. [T] is a type of an element with this key.
     */
    public interface Key<T>

    /**
     * Returns an element associated with the given [key]
     */
    public abstract operator fun <T> get(key: Key<T>): T?

    /**
     * Empty [CreationExtras]
     */
    object Empty : CreationExtras() {
        override fun <T> get(key: Key<T>): T? = null
    }
}
```

- map：一个返回 key 为 `Key`，value 为任意类型的 map
- `Key<T>`：接口，作为 map 的 key
- `get(Key)`：返回关联该 Key 的值
- `Empty`：空的 `CreationExtras`

可以修改的 `MutableCreationExtras`：

```kotlin
public class MutableCreationExtras(initialExtras: CreationExtras = Empty) : CreationExtras() {
    init {
        map.putAll(initialExtras.map)
    }
    public operator fun <T> set(key: Key<T>, t: T) {
        map[key] = t
    }
    public override fun <T> get(key: Key<T>): T? {
        @Suppress("UNCHECKED_CAST")
        return map[key] as T?
    }
}
```

#### CreationExtras.Key

```kotlin
public abstract class CreationExtras internal constructor() {
    internal val map: MutableMap<Key<*>, Any?> = mutableMapOf()
    public interface Key<T>
    public abstract operator fun <T> get(key: Key<T>): T?
    object Empty : CreationExtras() {
        override fun <T> get(key: Key<T>): T? = null
    }
}
```

`Key` 的泛型 `T` 代表对应 `Value` 的类型。相对于 `Map<K，V>` ，这种定义方式可以更加类型安全地获取多种类型的键值对，`CoroutineContext` 等也是采用这种设计。

系统以及提供了几个预置的 Key 供使用：

| CreationExtras.Key                                          | 描述                                                                       | 备注        |
| :---------------------------------------------------------- | :----------------------------------------------------------------------- | --------- |
| `ViewModelProvider.NewInstanceFactory.VIEW_MODEL_KEY`       | `ViewModelProvider 可以基于 key 区分多个 VM 实例，VIEW_MODEL_KEY 用来提供当前 VM 的这个 key` | 每个 get 都有 |
| `ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY` | 提供当前 Application context                                                 |           |
| `SavedStateHandleSupport.SAVED_STATE_REGISTRY_OWNER_KEY`    | 提供创建 createSavedStateHandle 所需的 SavedStateRegistryOwner                  |           |
| `SavedStateHandleSupport.VIEW_MODEL_STORE_OWNER_KEY`        | createSavedStateHandle 所需的 ViewModelStoreOwner                           |           |
| `SavedStateHandleSupport.DEFAULT_ARGS_KEY`                  | createSavedStateHandle 所需的 Bundle                                        |           |

后三个 `Key` 都跟 `SavedStateHandle` 的创建有关

#### MutableCreationExtras

`CreatioinExtras`是一个密封类，因此无法直接实例化。我们需要使用其子类 `MutableCreationExtras` 来创建实例，这是一种**读写分离**的设计思想，保证了使用处的不可变性。

### 一些 Factory 对 CreationExtras 的支持

在 `ViewModelProvider` 构造函数的第 3 个是 C`reationExtras`

```kotlin
public open class ViewModelProvider  
constructor(  
    private val store: ViewModelStore,  
    private val factory: Factory,  
    private val defaultCreationExtras: CreationExtras = CreationExtras.Empty,  
)
```

在 `ViewModelProvider.Factory` 的 `create(modelClass: Class<T>, extras: CreationExtras)` 方法的第 2 个参数是 CreationExtras

在哪里用到了？

具体看各个 Factory 的实现。

#### NewInstanceFactory

```kotlin
class NewInstanceFactory {
	public companion object {
		private object ViewModelKeyImpl : Key<String>
		@JvmField  
		val VIEW_MODEL_KEY: Key<String> = ViewModelKeyImpl
	}
}
```

提供了`VIEW_MODEL_KEY`

#### AndroidViewModelFactory

```kotlin
// AndroidViewModelFactory v2.6.2
override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {  
    return if (application != null) {  
        create(modelClass)  
    } else {  
        val application = extras[APPLICATION_KEY]  
        if (application != null) {  
            create(modelClass, application)  
        } else {  
            // For AndroidViewModels, CreationExtras must have an application set  
            if (AndroidViewModel::class.java.isAssignableFrom(modelClass)) {  
                throw IllegalArgumentException(  
                    "CreationExtras must have an application by `APPLICATION_KEY`"  
                )  
            }  
            super.create(modelClass)  
        }  
    }  
}
public companion object {
	private object ApplicationKeyImpl : Key<Application>
	@JvmField  
	val APPLICATION_KEY: Key<Application> = ApplicationKeyImpl
}
```

- 如果 `application` 不为空，还是走老的 `create` 逻辑
- 如果 application 为空，但存在 `APPLICATION_KEY`，走 `create(modelClass, application)`

所以使用 `AndroidViewModelFactory`，需要在构造函数传入 `application` 或者在 `extras` 中设置 `key` 为 `APPLICATION_KEY` 值为 application。

### 原理

以示例来讲解：

```kotlin
val vm by lazy {
	val extras = MutableCreationExtras()
	extras[ViewModelFactory.PARAM1_KEY] = "param1 value"
	extras[ViewModelFactory.PARAM2_KEY] = 112
	extras[ViewModelFactory.PARAM3_KEY] = 520
	extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] = application
	ViewModelProvider(
		this.viewModelStore,
		ViewModelFactory(),
		extras
	)[MyViewModel::class.java]
}
```

`ViewModelProvider` 第 3 个参数 `defaultCreationExtras`，保存了很多参数。

当调用 get 时，

```kotlin
// lifecycle-viewmodel v2.6.2 ViewModelProvider
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

get 方法内部创建了一个 extras `MutableCreationExtras`，默认设置了一个 `VIEW_MODEL_KEY` 的 key，值为 `$DEFAULT_KEY:$canonicalName` (如：`androidx.lifecycle.ViewModelProvider.DefaultKey:me.hacket.assistant.samples.google.architecture.viewmodel.creationextras.MyViewModel`)；然后将 ViewModelProvider 的 `defaultCreationExtras` 保存到 extras 中；

然后调用 `factory.create` 方法创建 ViewModel。

### 默认参数 DefaultCreationExtras

```kotlin
// ViewModelProvider
internal fun defaultCreationExtras(owner: ViewModelStoreOwner): CreationExtras {  
    return if (owner is HasDefaultViewModelProviderFactory) {  
        owner.defaultViewModelCreationExtras  
    } else CreationExtras.Empty  
}
```

如果 owner 是 `HasDefaultViewModelProviderFactory`，那么就取 `owner.defaultViewModelCreationExtras`，而 `ComponentActivity` 实现了 `HasDefaultViewModelProviderFactory`，看一下 `ComponentActivity` 的默认实现：

```java
// ComponentActivity
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

> 注意: `Activity 1.5.0-alpha01` 和 `Fragment 1.5.0-alpha01` 之后才能重写 `getDefaultViewModelCreationExtras` 方法。之前的版本中，访问 `defaultCreationExtras` 将返回 `CreationExtras.Empty`

默认提供了下列 ：

- `ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY` application
- `SavedStateHandleSupport.SAVED_STATE_REGISTRY_OWNER_KEY` activity
- `SavedStateHandleSupport.VIEW_MODEL_STORE_OWNER_KEY` this
- `SavedStateHandleSupport.DEFAULT_ARGS_KEY` 可用于获取 Activity 的 intent bundle 数据
