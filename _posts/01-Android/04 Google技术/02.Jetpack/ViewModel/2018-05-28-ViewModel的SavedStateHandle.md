---
date_created: Tuesday, May 28th 2018, 12:02:31 am
date_updated: Tuesday, January 21st 2025, 11:45:42 pm
title: ViewModel的SavedStateHandle
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
date created: 2024-05-18 21:35
date updated: 2024-12-24 00:32
aliases: [SavedStateHandle 状态保存]
linter-yaml-title-alias: SavedStateHandle 状态保存
---

# SavedStateHandle 状态保存

## 之前状态保存

以往如果需要在 `Activity` 或者 `Fragment` 中保存数据状态则需要重写**onSaveInstanceState ，使用 bundle 去存储相应的数据和状态**，但是这也只能保存轻量简单的序列化数据。而 `ViewModel` 可以做到在配置变更后依然持有状态。

## `SavadStateHandle` 介绍

在 androidX 的 `Fragment1.2.0` 或 `Activity1.1.0`，默认的 ViewModel 的 factory 支持 ViewModel 传递一个 `SavedStateHandle` 构造参数不需要任何其他配置

```kotlin
class SavedStateViewModel(private val state: SavedStateHandle) : ViewModel() { ... }
```

如果自定义 `ViewModelProvider.Factory`，需要用 `AbstractSavedStateViewModelFactory`

> 旧版本的 fragments，需要引入 `lifecycle-viewmodel-savedstate`，用 `SavedStateViewModelFactory` 作为你的 factory。

引入库：

```kotlin
implementation "androidx.lifecycle:lifecycle-viewmodel-savedstate:2.2.0"
```

## SavedStateHandle 使用

### 存/取值

`SavedStateHandle` 有下列方法：

1. get(String key)
2. contains(String key)
3. remove(String key)
4. set(String key, T value)
5. keys()
6. getLiveData(key)

### 支持的类型

```kotlin
// doesn't have Integer, Long etc box types because they are "Serializable"
private static final Class[] ACCEPTABLE_CLASSES = new Class[]{
    //baseBundle
    boolean.class,
    boolean[].class,
    double.class,
    double[].class,
    int.class,
    int[].class,
    long.class,
    long[].class,
    String.class,
    String[].class,
    //bundle
    Binder.class,
    Bundle.class,
    byte.class,
    byte[].class,
    char.class,
    char[].class,
    CharSequence.class,
    CharSequence[].class,
    // type erasure ¯\_(ツ)_/¯, we won't eagerly check elements contents
    ArrayList.class,
    float.class,
    float[].class,
    Parcelable.class,
    Parcelable[].class,
    Serializable.class,
    short.class,
    short[].class,
    SparseArray.class,
    (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP ? Size.class : int.class),
    (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP ? SizeF.class : int.class),
};
```

### 案例

#### AndroidViewModel SavedStateHandle

```kotlin
// SavedViewModel
class SavedViewModel(application: Application, private val handle: SavedStateHandle) : AndroidViewModel(application) {
    companion object {
        private const val KEY_NUMBER = "KEY_NUMBER"
        private const val KEY_USER = "KEY_USER"
    }
    fun getNumber(): MutableLiveData<Int> {
        if (!handle.contains(KEY_NUMBER)) {
            handle[KEY_NUMBER] = 0  // 判断Handle里面的值是否被初始化，如果没有，就赋值这个key的值为0
        }
        return handle.getLiveData(KEY_NUMBER)
    }
    fun addNumber(n: Int) {
        val result = getNumber().value?.plus(n)
        getNumber().value = result
    }
    fun getUser(): MutableLiveData<ViewModelUser> {
        if (!handle.contains(KEY_USER)) {
            handle[KEY_USER] = ViewModelUser("hacket", 28)
        }
        return handle.getLiveData(KEY_USER)
    }
    fun addAge(age: Int) {
        val user = getUser().value!!
        user.age = user.age.plus(age)
        getUser().postValue(user)
    }
}

// ViewModel保存状态
class ViewModel保存状态 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_model_saved_state)

        val viewModel = ViewModelProvider(this)[SavedViewModel::class.java]

        viewModel.getNumber().observe(this) {
            tv_result.text = "$it"
        }
        btn_add.setOnClickListener {
            val input = et_input.text.toString()
            viewModel.addNumber(input.toInt())
        }

        viewModel.getUser().observe(this) {
            val user = it as ViewModelUser
            tv_result_user.text = user.toString()
        }
        btn_add_user.setOnClickListener {
            val input = et_input.text.toString()
            viewModel.addAge(input.toInt())
        }
    }
}

@Parcel(value = Parcel.Serialization.BEAN)
data class ViewModelUser @ParcelConstructor constructor(val name: String, var age: Int)
```

#### 获取 Activity intent Bundle

- 启动 dest，通过 extras 传递参数

```kotlin
val dest = Intent(this, DestActivity::class.java)
val extras = Bundle()
extras.putInt("test_int", 111)
extras.putString("test_string", "hacket")
dest.putExtras(extras)
startActivity(dest, extras)
```

- ViewModel

```kotlin
class DestViewModel(  
    application: Application,  
    private val savedStateHandle: SavedStateHandle  
) : AndroidViewModel(application) {  
  
    fun parseArgus() {  
        for (key in savedStateHandle.keys()) {  
            Log.i("hacket", "parseArgus key=$key")  
        }  
        val testInt = savedStateHandle.get<Int>("test_int")  
        val testString = savedStateHandle.get<String>("test_string")  
        Log.i("hacket", "parseArgus testInt=$testInt")  
        Log.i("hacket", "parseArgus testString=$testString")  
    }  
}
```

- dest

```kotlin
class DestActivity : AppCompatActivity() {  
    val vm by lazy {  
        ViewModelProvider(this)[DestViewModel::class.java]  
    }
}
```

#### 获取 Fragment 的 arguments

```kotlin
// Fragment
class DestFragment : Fragment() {  
    val vm by lazy {  
        ViewModelProvider(this)[DestFragmentViewModel::class.java]  
    }  
    companion object {  
        fun of(): DestFragment {  
            return DestFragment().apply {  
                val args = Bundle()  
                args.putInt("test_int_frag", 120)  
                args.putString("test_string_frag", "dasheng")  
                arguments = args  
            }  
        }  
    }  
    override fun onCreateView(  
        inflater: LayoutInflater,  
        container: ViewGroup?,  
        savedInstanceState: Bundle?  
    ): View {  
        val tv = TextView(context)  
        return tv  
    }  
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {  
        super.onViewCreated(view, savedInstanceState)  
        vm.parseArgus()  
    }  
}
// ViewModel
class DestFragmentViewModel(  
    application: Application,  
    private val savedStateHandle: SavedStateHandle  
) : AndroidViewModel(application) {  
    fun parseArgus() {  
        for (key in savedStateHandle.keys()) {  
            Log.i("hacket", "parseArgus key=$key")  
        }  
        val testInt = savedStateHandle.get<Int>("test_int_frag")  
        val testString = savedStateHandle.get<String>("test_string_frag")  
        Log.i("hacket", "parseArgus testInt=$testInt")  
        Log.i("hacket", "parseArgus testString=$testString")  
    }  
}
```

### 模拟重建操作

#### 资源配置变更

1. 横竖屏切换模拟
2. 开发者选项，不保留活动

#### 模拟 App 被系统 kill（requires emulator running P+）

1. 查看要模拟的 App 的进程，看是否存活

```shell
adb shell ps -A |grep me.hacket
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691240433825-f1dfa723-e2d5-4c5a-9405-fde3f4bd51f6.png#averageHue=%23151311&clientId=ufb16f5af-ab1a-4&from=paste&height=52&id=u05f0a208&originHeight=104&originWidth=1286&originalType=binary&ratio=2&rotation=0&showTitle=false&size=34859&status=done&style=stroke&taskId=u90f115eb-be18-45cc-8467-db0ad4ab968&title=&width=643)<br>2. 按 Home 键回到桌面（不按 Home kill 不了）<br>3. 运行命令

```
adb shell am kill me.hacket.assistant
```

4. 再次确认查看是否存活，现在应该为空

```
adb shell ps -A |grep me.hacket
```

5. 再次打开该 App，就能模拟 App 被系统 kill 的操作

## 原理

### 主要类

- SavedStateProvider
- SavedStateHandle
- AbstractSavedStateViewModelFactory
- SavedStateViewModelFactory

#### SavedStateViewModelFactory

**SavedStateViewModelFactory 介绍：**

`SavedStateViewModelFactory` 用于创建带 `SavedStateHandle` 参数的 `Factory`

- 如果 `ViewModel` 是 `AndroidViewModel`，寻找构造器依次有 `Application` 和 `SavedStateHandle` 参数的
- 如果不是 `AndroidViewModel`，那么构造器只接受 `SavedStateHandle` 参数

##### 构造器

**源码：**

```kotlin
// lifecycle-viewmodel-savedstate:2.6.1 SavedStateViewModelFactory
class SavedStateViewModelFactory : ViewModelProvider.OnRequeryFactory, ViewModelProvider.Factory {
	private var application: Application? = null  
	private val factory: ViewModelProvider.Factory  
	private var defaultArgs: Bundle? = null  
	private var lifecycle: Lifecycle? = null  
	private var savedStateRegistry: SavedStateRegistry? = null
	// 1个参数
	constructor() {  
	    factory = ViewModelProvider.AndroidViewModelFactory()  
	}
	// 2个参数
	constructor(  
	    application: Application?,  
	    owner: SavedStateRegistryOwner  
	) : this(application, owner, null)
	// 3个参数
	constructor(application: Application?, owner: SavedStateRegistryOwner, defaultArgs: Bundle?) {  
	    savedStateRegistry = owner.savedStateRegistry  
	    lifecycle = owner.lifecycle  
	    this.defaultArgs = defaultArgs  
	    this.application = application  
	    factory = if (application != null) getInstance(application)  
	        else ViewModelProvider.AndroidViewModelFactory()  
	}
}
```

**参数：**

- **application：** Application，application 参数为 null 时，不支持创建 AndroidViewModel 实例
- **owner：** SavedStateRegistryOwner，提供恢复 ViewModel 状态
- **defaultArgs：** Bundle

##### create

```kotlin
// lifecycle-viewmodel-savedstate:2.6.1 SavedStateViewModelFactory
// 用了CreationExtras
override fun <T : ViewModel> create(modelClass: Class<T>, extras: CreationExtras): T {  
    val key = extras[ViewModelProvider.NewInstanceFactory.VIEW_MODEL_KEY]  
        ?: throw IllegalStateException(  
            "VIEW_MODEL_KEY must always be provided by ViewModelProvider"  
        )  
	// 如果有SAVED_STATE_REGISTRY_OWNER_KEY和VIEW_MODEL_STORE_OWNER_KEY
    return if (extras[SAVED_STATE_REGISTRY_OWNER_KEY] != null &&  
        extras[VIEW_MODEL_STORE_OWNER_KEY] != null) {  
        // 从CreationExtras获取application
        val application = extras[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] 
        // 是否是AndroidViewModel 
        val isAndroidViewModel = AndroidViewModel::class.java.isAssignableFrom(modelClass)  
        val constructor: Constructor<T>? = if (isAndroidViewModel && application != null) { 
	        // 寻找AndroidViewModel(Application, SavedStateHandle) 
            findMatchingConstructor(modelClass, ANDROID_VIEWMODEL_SIGNATURE)  
        } else {  
	        // 寻找ViewModel(SavedStateHandle)
            findMatchingConstructor(modelClass, VIEWMODEL_SIGNATURE)  
        }  
        // doesn't need SavedStateHandle  
        if (constructor == null) {  // 不需要SavedStateHandle
            return factory.create(modelClass, extras)  
        }  
        val viewModel = if (isAndroidViewModel && application != null) { 
	        // 构造AndroidViewModel(Application, SavedStateHandle)  
            newInstance(modelClass, constructor, application, extras.createSavedStateHandle())  
        } else {  
	        // 构造ViewModel(SavedStateHandle)
            newInstance(modelClass, constructor, extras.createSavedStateHandle())  
        }  
        viewModel  
    } else {  // 降级为没有CreationExtras的构造方式
        val viewModel = if (lifecycle != null) {  
            create(key, modelClass)  
        } else {  
            throw IllegalStateException("SAVED_STATE_REGISTRY_OWNER_KEY and" +  
                "VIEW_MODEL_STORE_OWNER_KEY must be provided in the creation extras to" +  
                "successfully create a ViewModel.")  
        }  
        viewModel  
    }  
}

// 没有用CreationExtras
fun <T : ViewModel> create(key: String, modelClass: Class<T>): T {  
    // empty constructor was called.  
    val lifecycle = lifecycle  
        ?: throw UnsupportedOperationException(  
            "SavedStateViewModelFactory constructed with empty constructor supports only " +  
                "calls to create(modelClass: Class<T>, extras: CreationExtras)."  
        )  
	// 判断是否为AndroidViewModel
    val isAndroidViewModel = AndroidViewModel::class.java.isAssignableFrom(modelClass)  
    // 获取匹配的构造器
    val constructor: Constructor<T>? = if (isAndroidViewModel && application != null) {  
		// 寻找有：(Application, SavedStateHandle)的构造器
        findMatchingConstructor(modelClass, ANDROID_VIEWMODEL_SIGNATURE)  
    } else {  
	    // 寻找有：(SavedStateHandle)的构造器
        findMatchingConstructor(modelClass, VIEWMODEL_SIGNATURE)  
    }  
    // constructor为空：没有找到带SavedStateHandle参数的构造器
    // doesn't need SavedStateHandle  
    constructor  
        ?: // If you are using a stateful constructor and no application is available, we  
        // use an instance factory instead.        
        return if (application != null) factory.create(modelClass) // 用AndroidViewModelFactory
        else instance.create(modelClass)  // 用NewInstanceFactory
    val controller = LegacySavedStateHandleController.create(  
        savedStateRegistry!!, lifecycle, key, defaultArgs  
    )  
    val viewModel: T = if (isAndroidViewModel && application != null) {  
	    // AndroidViewModel(Application, SavedStateHandle)
        newInstance(modelClass, constructor, application!!, controller.handle)  
    } else {  
		// ViewModel(SavedStateHandle)
        newInstance(modelClass, constructor, controller.handle)  
    }  
    viewModel.setTagIfAbsent(  
        AbstractSavedStateViewModelFactory.TAG_SAVED_STATE_HANDLE_CONTROLLER, controller  
    )  
    return viewModel  
}

override fun <T : ViewModel> create(modelClass: Class<T>): T {  
    // ViewModelProvider calls correct create that support same modelClass with different keys  
    // If a developer manually calls this method, there is no "key" in picture, so factory    // simply uses classname internally as as key.    
    val canonicalName = modelClass.canonicalName  
        ?: throw IllegalArgumentException("Local and anonymous classes can not be ViewModels")  
    return create(canonicalName, modelClass)  
}

private val ANDROID_VIEWMODEL_SIGNATURE = listOf<Class<*>>(  
    Application::class.java,  
    SavedStateHandle::class.java  
)  
private val VIEWMODEL_SIGNATURE = listOf<Class<*>>(SavedStateHandle::class.java)

// 创建modelClass实例，根据params调用对应的构造器
internal fun <T : ViewModel?> newInstance(  
    modelClass: Class<T>,  
    constructor: Constructor<T>,  
    vararg params: Any  
): T {  
    return try {  
        constructor.newInstance(*params)  
    } catch (e: XXXException) { }
}
```

看看 `findMatchingConstructor`：

```kotlin
internal fun <T> findMatchingConstructor(  
    modelClass: Class<T>,  
    signature: List<Class<*>>  
): Constructor<T>? {  
    // public me.hacket.assistant.samples.google.architecture.viewmodel.creationextras.MyExtraAndroidViewModel(android.app.Application,java.lang.String,java.lang.Integer,java.lang.Integer)  
    for (constructor in modelClass.constructors) {  
        // 返回构造器参数类型，是个数组，这里转成List：[class android.app.Application, class java.lang.String, class java.lang.Integer, class java.lang.Integer]  
        val parameterTypes = constructor.parameterTypes.toList()  
        Log.w(  
            "hacket",  
            "constructor.parameterTypes=${constructor.parameterTypes}, parameterTypes=$parameterTypes"  
        )  
        if (signature == parameterTypes) {  
            @Suppress("UNCHECKED_CAST")  
            return constructor as Constructor<T>  
        }  
        if (signature.size == parameterTypes.size && parameterTypes.containsAll(signature)) {  
            throw UnsupportedOperationException(  
                "Class ${modelClass.simpleName} must have parameters in the proper " +  
                        "order: $signature"  
            )  
        }  
    }  
    return null  
}
private val ANDROID_VIEWMODEL_SIGNATURE = listOf<Class<*>>(  
    Application::class.java,  
    SavedStateHandle::class.java  
)  
private val VIEWMODEL_SIGNATURE = listOf<Class<*>>(SavedStateHandle::class.java)
```

寻找参数匹配的 ViewModel 构造器，如：

```kotlin
class MyExtraAndroidViewModel(  
    application: Application,  
    private val param1: String?,  
    private val param2: Int?,  
    private val param3: Int?  
)
// modelClass.constructors：MyExtraAndroidViewModel(android.app.Application,java.lang.String,java.lang.Integer,java.lang.Integer)  
// constructor.parameterTypes.toList()：[class android.app.Application, class java.lang.String, class java.lang.Integer, class java.lang.Integer]
```

### 为什么 ViewModel 构造函数加个就 `SavedStateHandle` 可以保存？

ViewModelProvider 构造时，传递一个 ViewModelStoreOwner

```kotlin
class ViewModelProvider {
    public constructor(
        owner: ViewModelStoreOwner
    ) : this(owner.viewModelStore, defaultFactory(owner), defaultCreationExtras(owner))
	public constructor(owner: ViewModelStoreOwner, factory: Factory) : this(
        owner.viewModelStore,
        factory,
        defaultCreationExtras(owner)
    )
}
```

ComponentActivity 就是一个 ViewModelStoreOwner，当 owner 是一个 HasDefaultViewModelProviderFactory 时，通过 `getDefaultViewModelProviderFactory()` 来获取一个 Factory，看看 `HasDefaultViewModelProviderFactory` 是个什么东西：

```java
public interface HasDefaultViewModelProviderFactory {
    @NonNull
    ViewModelProvider.Factory getDefaultViewModelProviderFactory();
}
```

用来提供一个默认的 `ViewModelProvider.Factory`，这个 Factory 通过 `create()` 用来创建 ViewModel 的；ComponentActivity 实现了该接口，我们接着看 `getDefaultViewModelProviderFactory()` 方法：

```java
public ViewModelProvider.Factory getDefaultViewModelProviderFactory() {
    if (getApplication() == null) {
        throw new IllegalStateException("Your activity is not yet attached to the "
                + "Application instance. You can't request ViewModel before onCreate call.");
    }
    if (mDefaultFactory == null) {
        mDefaultFactory = new SavedStateViewModelFactory(
                getApplication(),
                this,
                getIntent() != null ? getIntent().getExtras() : null);
    }
    return mDefaultFactory;
}
```

直接 new 一个 `SavedStateViewModelFactory`，我们看 `create()` 方法是怎么创建 ViewModel 的。

```java
// SavedStateViewModelFactory
public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
    String canonicalName = modelClass.getCanonicalName();
    return create(canonicalName, modelClass);
}

public <T extends ViewModel> T create(@NonNull String key, @NonNull Class<T> modelClass) {
    boolean isAndroidViewModel = AndroidViewModel.class.isAssignableFrom(modelClass);
    Constructor<T> constructor;
    if (isAndroidViewModel) {
        constructor = findMatchingConstructor(modelClass, ANDROID_VIEWMODEL_SIGNATURE); // 检测是否有SavedStateHandle参数
    } else {
        constructor = findMatchingConstructor(modelClass, VIEWMODEL_SIGNATURE);
    }
    // doesn't need SavedStateHandle
    if (constructor == null) {
        return mFactory.create(modelClass);
    }
    SavedStateHandleController controller = SavedStateHandleController.create(
            mSavedStateRegistry, mLifecycle, key, mDefaultArgs);
    try {
        T viewmodel;
        if (isAndroidViewModel) {
            viewmodel = constructor.newInstance(mApplication, controller.getHandle());
        } else {
            viewmodel = constructor.newInstance(controller.getHandle());
        }
        viewmodel.setTagIfAbsent(TAG_SAVED_STATE_HANDLE_CONTROLLER, controller);
        return viewmodel;
    } catch (Exception e) {
       // ...
    }
}

private static final Class<?>[] ANDROID_VIEWMODEL_SIGNATURE = new Class[]{Application.class,
        SavedStateHandle.class};
private static final Class<?>[] VIEWMODEL_SIGNATURE = new Class[]{SavedStateHandle.class};

@SuppressWarnings("unchecked")
private static <T> Constructor<T> findMatchingConstructor(Class<T> modelClass,
        Class<?>[] signature) {
    for (Constructor<?> constructor : modelClass.getConstructors()) {
        Class<?>[] parameterTypes = constructor.getParameterTypes();
        if (Arrays.equals(signature, parameterTypes)) {
            return (Constructor<T>) constructor;
        }
    }
    return null;
}
```

通过 `findMatchingConstructor` 来寻找 ViewModel 是否有 `SavedStateHandle` 参数，然后通过反射来创建 ViewModel/AndroidViewModel 对象。

## Ref

- [x] Saved State module for ViewModel（官方）<br><https://developer.android.com/topic/libraries/architecture/viewmodel-savedstate>
- [x] 7. Step 6 - Persist ViewModel state across process recreation (beta)<br>[https://codelabs.developers.google.com/codelabs/android-lifecycles/#](https://codelabs.developers.google.com/codelabs/android-lifecycles/#6)
- [ ] ViewModels: Persistence, onSaveInstanceState (), Restoring UI State and Loaders<br><https://medium.com/androiddevelopers/viewmodels-persistence-onsaveinstancestate-restoring-ui-state-and-loaders-fc7cc4a6c090>
- [ ] 绝不丢失的状态 androidx SaveState ViewModel-SaveState 分析<br><https://www.jianshu.com/p/9772b88e3c1e>
- [ ] ViewModel 的局限，销毁重建的方案 SavedStateHandle<br><https://juejin.im/post/5e2c6914f265da3e377eff25#heading-11>
- [ ] <https://github.com/husaynhakeem/Androidx-SavedState-Playground>
