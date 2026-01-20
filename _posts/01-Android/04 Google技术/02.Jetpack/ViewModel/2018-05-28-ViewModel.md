---
banner:
date_created: Tuesday, May 28th 2018, 12:02:31 am
date_updated: Monday, September 22nd 2025, 12:04:45 am
title: ViewModel
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
date created: 2024-05-18 21:21
date updated: 2024-12-24 00:32
aliases: [ViewModel 入门]
linter-yaml-title-alias: ViewModel 入门
---

# ViewModel 入门

## 什么是 ViewModel？

<https://developer.android.com/topic/libraries/architecture/viewmodel><br>ViewModel 用来存储和管理 UI 相关的数据，可于将一个 Activity 或 Fragment 组件相关的数据逻辑抽象出来，并能适配组件的生命周期，如当屏幕旋转 Activity 重建后，ViewModel 中的数据依然有效。引入 ViewModel 之前，存在如下几个问题：

1. 通常 Android 系统来管理 UI controllers（如 Activity、Fragment）的生命周期，由系统响应用户交互或者重建组件，用户无法操控。当组件被销毁并重建后，原来组件相关的数据也会丢失，如果数据类型比较简单，同时数据量也不大，可以通过 onSaveInstanceState() 存储数据，组件重建之后通过 onCreate()，从中读取 Bundle 恢复数据。但如果是大量数据，不方便序列化及反序列化，则上述方法将不适用。
2. UI controllers 经常会发送很多异步请求，有可能会出现 UI 组件已销毁，而请求还未返回的情况，因此 UI controllers 需要做额外的工作以防止内存泄露。
3. 当 Activity 因为配置变化而销毁重建时，一般数据会重新请求，其实这是一种浪费，最好就是能够保留上次的数据。
4. UI controllers 其实只需要负责展示 UI 数据、响应用户交互和系统交互即可。但往往开发者会在 Activity 或 Fragment 中写许多数据请求和处理的工作，造成 UI controllers 类代码膨胀，也会导致单元测试难以进行。我们应该遵循职责分离原则，将数据相关的事情从 UI controllers 中分离出来。

## 使用 ViewModel

### 不带参数的 ViewModel

定义 ViewModel

```kotlin
class MainViewModel : ViewModel() {
    private val _user: MutableLiveData<User> = MutableLiveData(User(1, "测试_${DateUtils.formatDateToString(Date())}")) // ktlint-disable max-line-length
    val mUser: LiveData<User> = _user
}

data class User(
    val i: Int,
    val desc: String
)
```

用~~ViewModelProviders~~创建，已经过时：

```java
MainViewModel mMainViewModel = ViewModelProviders
        .of(getActivity())
        .get(MainViewModel.class);
```

用 `ViewModelProvider` 创建：

```kotlin
val mainViewModel = ViewModelProvider(this).get(MainViewModel::class.java)
    mainViewModel.mUser.observe(
        this,
        {
            tv_normal.text = "Normal $it"
        }
    )
```

如果 ViewModel 需要使用 Application 的上下文对象，则可以通过继承 `AndroidViewModel`，并提供一个以 Application 为参数的构造函数。

### 带参数的 ViewModel

#### 带一个 String 参数

```kotlin
// ViewModel
class MainViewModel2(private val params: String) : ViewModel() {
    private val _user: MutableLiveData<User> = MutableLiveData(User(1, "[$params]_测试_${DateUtils.formatDateToString(Date())}")) // ktlint-disable max-line-length
    val mUser: LiveData<User> = _user
}
// Factory
class MainViewModelFactory(private val params: String) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        return MainViewModel2(params) as T
    }
}

// 测试
val mainViewModel2 = ViewModelProvider(this, MainViewModelFactory("my_params")).get(MainViewModel::class.java)
    mainViewModel2.mUser.observe(
        this,
        {
            tv_param.text = "带参数 $it"
        }
    )
```

- 不能直接调用 `ViewModel` 的构造函数构造，这样无法将 `ViewModel` 存入 `ViewModelStore`

#### 带 Application 和其他参数

```kotlin
// ViewModel
class LoginModel(application: Application, val name: String, val pwd: String) :
    AndroidViewModel(application) {

    val n = ObservableField<String>(name)
    val p = ObservableField<String>(pwd)

    /**
     * 用户名改变回调的函数
     */
    fun onNameChanged(name: CharSequence) {
        n.set(name.toString())
    }

    /**
     * 密码改变的回调函数
     */
    fun onPwdChanged(pwd: CharSequence, start: Int, before: Int, count: Int) {
        p.set(pwd.toString())
    }

    fun login() {
        if (n.get().equals("hacket", false) && p.get().equals("111111", false)) {
            Toast.makeText(getApplication(), "账号密码正确，去登录成功页", Toast.LENGTH_SHORT).show()
        }
    }
}
// Factory
class ViewModelProviderFactory(
    private val app: Application,
    private val params: String,
    private val pwd: String
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return LoginModel(app, params, pwd) as T
    }
}

// 测试
class LoginActivityMVVM : AppCompatActivity() {
    val mLoginModel by lazy {
        ViewModelProvider(this, ViewModelProviderFactory(application, "hacket", "123456"))[LoginModel::class.java]
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = DataBindingUtil.setContentView<ActivityLoginMvvmBinding>(
            this,
            R.layout.activity_login_mvvm
        )
        binding.model = mLoginModel
        binding.activity = this
    }
}
```

#### Context 参数

不在 Activity 或 Fragment 中使用

```kotlin
class OnlineVerifyViewModel(val context: Context) : ViewModel() {
	// ...
}
// Factory
class OnlineVerifyViewModelFactory(  
    private val context: Context  
) : ViewModelProvider.Factory {  
  
    override fun <T : ViewModel> create(modelClass: Class<T>): T {  
        return OnlineVerifyViewModel(context) as T  
    }  
}
// 使用
private val mOnlineVerifyViewModel: OnlineVerifyViewModel? by lazy {  
    val act = lifecycleOwner as? Activity  
    if (act != null) {  
        ViewModelProvider(  
            this,  
            OnlineVerifyViewModelFactory(act)  
        )[OnlineVerifyViewModel::class.java]  
    } else {  
        null  
    }  
}
```

### `CretionExtras`

<https://juejin.cn/post/7072541180667363358>

### KTX 中 ViewModelLazy

```kotlin
implementation "androidx.activity:activity-ktx:1.2.2"
implementation "androidx.fragment:fragment-ktx:1.3.3"
```

#### viewModels Activity

**源码：**

```kotlin
// activity-ktx:1.8.0
@MainThread  
public inline fun <reified VM : ViewModel> ComponentActivity.viewModels(  
    noinline extrasProducer: (() -> CreationExtras)? = null,  
    noinline factoryProducer: (() -> Factory)? = null  
): Lazy<VM> {  
    val factoryPromise = factoryProducer ?: {  
        defaultViewModelProviderFactory  
    }  
  
    return ViewModelLazy(  
        VM::class,  
        { viewModelStore },  
        factoryPromise,  
        { extrasProducer?.invoke() ?: this.defaultViewModelCreationExtras }  
    )  
}
```

**注意：**

- 在主线程中
- 在 Activity attach Application 调用

**示例：**

```kotlin
private val vm by viewModels<MainViewModel>()
vm.mUser.observe(
    this,
    {
        tv_activityviewmodels.text = "Activity(ViewModelLazy) $it"
    }
)
```

#### viewModels/activityViewModels Fragment

在 Fragment 中我们可以使用 `activityViewModels` 或者 `viewModels` 来创建。

```kotlin
private val vm by viewModels<MainViewModel>()
vm.mUser.observe(
    viewLifecycleOwner,
    {
        tv_fragment_viewmodels.text = "Fragment(ViewModelLazy) $it"
    }
)

private val vm2 by this.activityViewModels<MainViewModel>()
```

#### ViewModelLazy 原理

Activity 和 Fragment KTX 底层原理是 ViewModelLazy。

```kotlin
public inline fun <reified VM : ViewModel> ComponentActivity.viewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> {
    val factoryPromise = factoryProducer ?: {
        defaultViewModelProviderFactory
    }

    return ViewModelLazy(VM::class, { viewModelStore }, factoryPromise)
}

public inline fun <reified VM : ViewModel> Fragment.activityViewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> = createViewModelLazy(
    VM::class, { requireActivity().viewModelStore },
    factoryProducer ?: { requireActivity().defaultViewModelProviderFactory }
)
public inline fun <reified VM : ViewModel> Fragment.viewModels(
    noinline ownerProducer: () -> ViewModelStoreOwner = { this },
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> = createViewModelLazy(VM::class, { ownerProducer().viewModelStore }, factoryProducer)

public class ViewModelLazy<VM : ViewModel> (
    private val viewModelClass: KClass<VM>,
    private val storeProducer: () -> ViewModelStore,
    private val factoryProducer: () -> ViewModelProvider.Factory
) : Lazy<VM> {
    private var cached: VM? = null

    override val value: VM
        get() {
            val viewModel = cached
            return if (viewModel == null) {
                val factory = factoryProducer()
                val store = storeProducer()
                ViewModelProvider(store, factory).get(viewModelClass.java).also {
                    cached = it
                }
            } else {
                viewModel
            }
        }

    override fun isInitialized(): Boolean = cached != null
}
```

#### 自定义 Lazy ViewModel

### 自定义 Factory，避免反射创建 ViewModel

### ViewModel 封装

#### Fragment 封装

```kotlin
import android.os.Bundle  
import androidx.fragment.app.Fragment  
import androidx.fragment.app.activityViewModels  
import androidx.fragment.app.viewModels  
import androidx.lifecycle.AbstractSavedStateViewModelFactory  
import androidx.lifecycle.SavedStateHandle  
import androidx.lifecycle.ViewModel  
import androidx.lifecycle.ViewModelProvider  
import androidx.savedstate.SavedStateRegistryOwner  
import java.lang.reflect.Constructor  
  
typealias CreateViewModel = (handle: SavedStateHandle) -> ViewModel  
  
inline fun <reified VM : ViewModel> Fragment.viewModelByFactory(  
    defaultArgs: Bundle? = null,  
    noinline create: CreateViewModel = {  
        val constructor =  
            findMatchingConstructor(VM::class.java, arrayOf(SavedStateHandle::class.java))  
        constructor!!.newInstance(it)  
    }  
): Lazy<VM> {  
    return viewModels {  
        createViewModelFactory(this, defaultArgs, create)  
    }  
}  
  
inline fun <reified VM : ViewModel> Fragment.activityViewModelByFactory(  
    defaultArgs: Bundle? = null,  
    noinline create: CreateViewModel  
): Lazy<VM> {  
    return activityViewModels {  
        createViewModelFactory(this, defaultArgs, create)  
    }  
}  
  
/**  
 * 创建ViewModelProvider.Factory  
 */fun createViewModelFactory(  
    owner: SavedStateRegistryOwner,  
    defaultArgs: Bundle?,  
    create: CreateViewModel  
): ViewModelProvider.Factory {  
    return object : AbstractSavedStateViewModelFactory(owner, defaultArgs) {  
        override fun <T : ViewModel> create(  
            key: String,  
            modelClass: Class<T>,  
            handle: SavedStateHandle  
        ): T {  
            @Suppress("UNCHECKED_CAST")  
            return create(handle) as? T  
                ?: throw IllegalArgumentException("Unknown viewmodel class!")  
        }  
    }  
}  
  
/**  
 * 寻找匹配的ViewModel构造器  
 */  
@PublishedApi  
internal fun <T> findMatchingConstructor(  
    modelClass: Class<T>,  
    signature: Array<Class<*>>  
): Constructor<T>? {  
    for (constructor in modelClass.constructors) {  
        val parameterTypes = constructor.parameterTypes  
        if (signature.contentEquals(parameterTypes)) {  
            return constructor as Constructor<T>  
        }  
    }  
    return null  
}
```

使用：

```kotlin
class DetailTaskFragment : Fragment(R.layout.fragment_detailed_task){
    
    private val viewModel by viewModelByFactory(arguments)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //...
    }
}
```

## 使用场景

### Fragment 之间通信

通过 ViewModel 实现

- [ ] Step 5 - Share a ViewModel between Fragments<br><https://codelabs.developers.google.com/codelabs/android-lifecycles/#5>

# 自定义 ViewModelStoreOwner

## View 中使用 ViewModel

### Jetpack 中的 ViewTreeViewModelStoreOwner

```kotlin
// Getting nearest ViewModelStoreOwner
@JvmName("get")
fun View.findViewTreeViewModelStoreOwner(): ViewModelStoreOwner? {
    return generateSequence(this) { view ->
        view.parent as? View
    }.mapNotNull { view ->
        view.getTag(R.id.view_tree_view_model_store_owner) as? ViewModelStoreOwner
    }.firstOrNull()
}
```

通过 `view.getTag(R.id.view_tree_view_model_store_owner)` 获取离 view 最新的 ViewTreeViewModelStoreOwner

- 如果是 Fragment 中的 View，获取的就是 Fragment 上的 ViewModelStore 实例
- 如果是 FragmentActivity 中的 View，获取的就是 ComponentActivity 上的 ViewModelStore 实例

**注意**，findViewTreeViewModelStoreOwner() 返回 null 的情况：

- Activity/Fragment 或者它们的父类里没有调用 ViewTreeViewModelStoreOwner.set 方法；
- View 还没有挂载到树上就开始调用 ViewTreeViewModelStoreOwner.get 方法 (在 onAttachedToWindow 之后)。

示例：

```kotlin
class SummaryView(context: Context, attrs: AttributeSet?) : ConstraintLayout(context, attrs) {

  private val viewModel by lazy {
    ViewModelProvider(findViewTreeViewModelStoreOwner()!!).get<SummaryViewModel>()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    viewModel.summaryModel.observe(findViewTreeLifecycleOwner()!!, ::populateSummaryView)
  }

  private fun populateSummaryView(summaryModel: SummaryModel) {
    // do stuff
  }
}
```

#### Fragment

```java
class Fragment {
    // This is initialized in performCreateView and unavailable outside of the
    // onCreateView/onDestroyView lifecycle
    @Nullable FragmentViewLifecycleOwner mViewLifecycleOwner;
    void performCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
         mViewLifecycleOwner = new FragmentViewLifecycleOwner(this, getViewModelStore());
        mView = onCreateView(inflater, container, savedInstanceState);
        if (mView != null) {
            // Initialize the view lifecycle
            mViewLifecycleOwner.initialize();
            // Tell the fragment's new view about it before we tell anyone listening
            // to mViewLifecycleOwnerLiveData and before onViewCreated, so that calls to
            // ViewTree get() methods return something meaningful
            ViewTreeLifecycleOwner.set(mView, mViewLifecycleOwner);
            ViewTreeViewModelStoreOwner.set(mView, mViewLifecycleOwner);
            // ...
        } else {
           // ...
        }
    }
}
fun View.setViewTreeViewModelStoreOwner(viewModelStoreOwner: ViewModelStoreOwner?) {
    setTag(R.id.view_tree_view_model_store_owner, viewModelStoreOwner)
}
```

Fragment 在 performCreateView() 中初始化了 ViewModeOwner，设置了 tag

#### ComponentActivity

```java
class ComponentActivity {
    public void setContentView(@LayoutRes int layoutResID) {
        initializeViewTreeOwners();
        // ...
        super.setContentView(layoutResID);
    }
    public void initializeViewTreeOwners() {
        ViewTreeLifecycleOwner.set(getWindow().getDecorView(), this);
        ViewTreeViewModelStoreOwner.set(getWindow().getDecorView(), this);
        ViewTreeSavedStateRegistryOwner.set(getWindow().getDecorView(), this);
        ViewTreeOnBackPressedDispatcherOwner.set(getWindow().getDecorView(), this);
        ViewTreeFullyDrawnReporterOwner.set(getWindow().getDecorView(), this);
    }
}
@JvmName("set")
fun View.setViewTreeViewModelStoreOwner(viewModelStoreOwner: ViewModelStoreOwner?) {
    setTag(R.id.view_tree_view_model_store_owner, viewModelStoreOwner)
}
```

ComponentActivity 在 setContentView() 中初始化了 ViewModeOwner，设置了 tag

### 自定义 View 的 ViewModelStoreOwner

目的：让 ViewModel 的生命周期跟随 View 的 detach 而销毁

#### 普通的

```kotlin
class CustomViewStoreView @JvmOverloads constructor(  
    context: Context, attrs: AttributeSet? = null  
) : LinearLayout(context, attrs), ViewModelStoreOwner {  
  
    private val mViewModelStore by lazy { ViewModelStore() }  
  
    init {  
        orientation = VERTICAL  
        val textview = TextView(context)  
        textview.text = "测试在自定义View中使用ViewModel"  
        addView(textview)  
    }  
  
    override fun onAttachedToWindow() {  
        super.onAttachedToWindow()  
        Log.d("hacket", "CustomViewStoreView onAttachedToWindow")  
    }  
  
    override fun onDetachedFromWindow() {  
        // View移除时清理所有的viewModel  
        Log.d("hacket", "CustomViewStoreView onDetachedFromWindow")  
        viewModelStore.clear()  
        super.onDetachedFromWindow()  
    }  
  
    override val viewModelStore: ViewModelStore  
        get() = mViewModelStore
}
```

#### 带 HasDefaultViewModelProviderFactory

```kotlin
class CustomViewStoreView @JvmOverloads constructor(  
    context: Context, attrs: AttributeSet? = null  
) : LinearLayout(context, attrs), ViewModelStoreOwner, HasDefaultViewModelProviderFactory {  
  
    private val mViewModelStore by lazy { ViewModelStore() }  
  
    init {  
        orientation = VERTICAL  
        val textview = TextView(context)  
        textview.text = "测试在自定义View中使用ViewModel"  
        addView(textview)  
    }  
  
    override fun onAttachedToWindow() {  
        super.onAttachedToWindow()  
        Log.d("hacket", "CustomViewStoreView onAttachedToWindow")  
    }  
  
    override fun onDetachedFromWindow() {  
        // View移除时清理所有的viewModel  
        Log.d("hacket", "CustomViewStoreView onDetachedFromWindow")  
        viewModelStore.clear()  
        super.onDetachedFromWindow()  
    }  
  
    override val viewModelStore: ViewModelStore  
        get() = mViewModelStore  
    override val defaultViewModelProviderFactory: ViewModelProvider.Factory  
        get() = if (application != null) {  
            ViewModelProvider.AndroidViewModelFactory(application!!)  
        } else {  
            ViewModelProvider.NewInstanceFactory()  
        }  
}  
  
private val View.application  
    get() = this.getApplicationFromView()  
  
private fun View.getActivityFromView(): Activity? {  
    var context: Context? = context  
    while (context is ContextWrapper) { // AppCompat的View  
        if (context is Activity) {  
            return context  
        }  
        context = context.baseContext  
    }  
    /**  
     * addView(View(context.applicationContext))     * 上述情况添加的 View 的 Context 并不是一个 Activity 或者 Activity 的 wrapper，在这种情况下  
     * 通过父布局去寻找对应的 Activity     */    return (parent as? View)?.getActivityFromView()  
}  
  
private fun View.getApplicationFromView(): Application? {  
    val activity = getActivityFromView()  
    if (activity != null) {  
        return activity.application  
    }  
    return null  
}
```

支持创建 ViewModel 和 AndroidViewModel

## 普通的类实现 ViewModelStoreOwner

```kotlin
class ChangeEmailOnlineQAVerify(
    val lifecycleOwner: LifecycleOwner,
    val application: Application?
) : ViewModelStoreOwner, DefaultLifecycleObserver, HasDefaultViewModelProviderFactory {
    override val viewModelStore: ViewModelStore
        get() = ViewModelStore()

    override fun onDestroy(owner: LifecycleOwner) {
        viewModelStore.clear()
        super.onDestroy(owner)
    }

    override val defaultViewModelProviderFactory: ViewModelProvider.Factory
        get() = if (application == null) {
            ViewModelProvider.NewInstanceFactory()
        } else {
            ViewModelProvider.AndroidViewModelFactory(application)
        }
}
```

支持创建 ViewModel 和 AndroidViewModel

默认支持 AndroidViewModel 的创建

# ViewModel 坑

## 正确使用 ViewModel

### 不暴露 Mutable 状态

ViewModel 对外暴露的数据状态，无论是 LiveData 或是 StateFlow 都应该使用 Immutable 的接口类型进行暴露而非 Mutable 的具体实现。View 只能单向订阅这些状态的变化，避免对状态反向更新。

```kotlin
class MyViewModel: ViewModel() {
	// LiveData
	private val _loading = MutableLiveData<Boolean>()
	val loading: LiveData<Boolean>
	   get() = _loading
	// StateFlow 
	private val _loading : MutableStateFlow<Boolean?> = MutableStateFlow(null) 
	val loading = _loading.asStateFlow()
}
```

StateFlow 的写法也类似，但是通过 `asStateFlow` 可以少写一个类型声明，但是要注意此时不要使用 custom get()， 不然 `asStateFlow` 会执行多次。

**解决：为 ViewModel 提取对外暴露的抽象类**

```kotlin
abstract class MyViewModel: ViewModel() {
   abstract val loading: LiveData<Boolean>
}

class MyViewModelImpl: MyViewModel() {
   override val loading = MutableLiveData<Boolean>()
   
   fun doSomeWork() {
     // ...
     loading.value = true
   }
}
class MyViewModelFactory : ViewModelProvider.Factory {  
    override fun <T : ViewModel> create(modelClass: Class<T>): T {  
        val isMyViewModel = MyViewModel::class.java.isAssignableFrom(modelClass)  
        when {  
            isMyViewModel -> MyViewModelImpl()  
        }  
        return super.create(modelClass)  
    }  
}
```

### 不暴露 suspend 方法

相对于暴露 Mutable 状态，暴露 suspend 方法的错误则更为常见。按照单向数据流的思想 ViewModel 需要提供 API 给 View 用于发送 Events，我们在定义 API 时需要注意避免使用 suspend 函数，理由如下：

1. 来自 ViewModel 的数据应该通过订阅 UiState 获取，因此 ViewModel 的其他方法方法不应该有返回值，而 suspend 函数会鼓励返回值的出现。
2. 理想的 MVVM 中 View 的职责仅仅是渲染 UI，业务逻辑尽量移动到 ViewModel 执行，利于单元测试的同时，`ViewModelScope` 可以保证一些耗时任务的稳定执行。如果暴露挂起函数给 View，则协程需要在 `lifecycleScope` 中启动，在横竖屏等场景中会中断任务的进行。

因此，ViewModel 为 View 暴露的 API 应该是非挂起且无法返回值的方法，官方示例：

```kotlin
// DO create coroutines in the ViewModel
class LatestNewsViewModel(
    private val getLatestNewsWithAuthors: GetLatestNewsWithAuthorsUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow<LatestNewsUiState>(LatestNewsUiState.Loading)
    val uiState: StateFlow<LatestNewsUiState> = _uiState

    fun loadNews() {
        viewModelScope.launch {
            val latestNewsWithAuthors = getLatestNewsWithAuthors()
            _uiState.value = LatestNewsUiState.Success(latestNewsWithAuthors)
        }
    }
}

// Prefer observable state rather than suspend functions from the ViewModel
class LatestNewsViewModel(
    private val getLatestNewsWithAuthors: GetLatestNewsWithAuthorsUseCase
) : ViewModel() {
    // DO NOT do this. News would probably need to be refreshed as well.
    // Instead of exposing a single value with a suspend function, news should
    // be exposed using a stream of data as in the code snippet above.
    suspend fun loadNews() = getLatestNewsWithAuthors()
}
```

### 利用 CreationExtras 让 Factory stateless

## Activity 成员变量中初始化 ViewModel

```kotlin
class ViewModelCreateTestActivity : AppCompatActivity() {
    private val vm = ViewModelProvider(this)[TestActLifecycleViewModel::class.java]
}
```

报错了：

```java
 Caused by: java.lang.IllegalStateException: Your activity is not yet attached to the Application instance. You can't request ViewModel before onCreate call.                                                                     
 at androidx.activity.ComponentActivity.getViewModelStore(ComponentActivity.java:603)
                                                                    at androidx.lifecycle.ViewModelProvider.<init>(ViewModelProvider.kt:118)
                                                                    at me.hacket.assistant.samples.google.architecture.viewmodel.faq.ViewModelCreateTestActivity.<init>(ViewModelCreateTestActivity.kt:15)                 	
```

分析：

这是由于 ViewModel 初始化时会调用 `ViewModelStoreOwner` 的 `getViewModelStore()` 方法，而在这个方法中，判断了 `getApplication()` 是否为空。

```java
androidx.activity.ComponentActivity
@Override
public ViewModelStore getViewModelStore() {
	if (getApplication() == null) {
		throw new IllegalStateException("Your activity is not yet attached to the "
				+ "Application instance. You can't request ViewModel before onCreate call.");
	}
	ensureViewModelStore();
	return mViewModelStore;
}
```

而 `mApplication` 变量的赋值操作是在 `Activity` 的 `attach` 方法中

```java
class Activity {
	private Application mApplication;
	public final Application getApplication() {  
	    return mApplication;  
	}
	final void attach(Context context, Application application,) {
		attachBaseContext(context);
		// ...
		mApplication = application;
	}
}
```

`Activity.attch` 方法是在 `ActivityThread` 的 `performLaunchActivity()` 方法中调用：

```java
class ActivityThread {
	mInstrumentation.newActivity();
	// ...
	activity.attach();
	// ...
	mInstrumentation.callActivityOnCreate();
	// ...
}
```

所以正确的初始化 `ViewModel` 时机，要大于 `onCreate` 的生命周期小于 `onDestroy`。

## ViewModel 持有 Activity/Fragment 实例

不用持有 Activity 或 Fragment 的引用，需要 Context，用 AndroidViewModel

> 当 Activity 被 recreate 时，ViewModel 对象并没有被销毁，如果 Model 持有 Activity 的引用时就可能会导致内存泄漏。那如果你要使用到 Context 对象怎么办呢，那就使用 ViewModel 的子类 AndroidViewModel 吧。

## 通过 Activity 获取 ViewModel 时遇到的坑

- 在 `Application.ActivityLifecycleCallbacks` 中的 `onActivityCreated` 方法中获取 `ViewModel` 时, Activity 每重建一次, 获取的 ViewModel 都是重新构建后的新实例, 并不能让 ViewModel 以及 ViewModel 中的数据幸免于 Activity 重建, 所以不要此方法中获取 ViewModel
- 在 Activity 的 `onDestroy` 方法中不能获取 ViewModel, 会报错
- 在 `onActivityStarted` 中获取可以

**示例：**

```kotlin
class ViewModelFAQ : Application.ActivityLifecycleCallbacks {

    fun init(application: Application) {
        application.registerActivityLifecycleCallbacks(this)
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        val hash = System.identityHashCode(activity)
        if (activity is FragmentActivity) {
            val viewModel = ViewModelProvider(activity).get(TestActLifecycleViewModel::class.java)
        }
    }
    // ...
}
```

## 通过 Fragment 获取 ViewModel 时遇到的坑

- 在 `FragmentManager.FragmentLifecycleCallbacks` 中的 `onFragmentAttached` 方法中获取 ViewModel 时也会出现和 Activity 一样的情况, 获取的 ViewModel 是重新构建后的新实例, ViewModel 以及 ViewModel 中的数据不能幸免于 Activity 重建, 所以也不要此方法中获取 ViewModel
- 在 `FragmentManager.FragmentLifecycleCallbacks` 中的 onFragmentDestroyed 方法中也不能获取 ViewModel, 会报错
- 在 Fragment 的 `onDestroy` 方法中不能获取 ViewModel, 会报错

## Fragment `activityViewModels` 或 `viewModels` 选择

在 Fragment 中我们可以使用 `activityViewModels()` 或者 `viewModels()` 来创建。<br>不同的选择 ViewModel 的生命周期表现不一样，要注意按照具体的场景来选择：

- `activityViewModels` 和 Activity 的生命周期一样
- `viewModels` 和 Fragment 的生命周期一样

### activityViewModels

```java
@MainThread
public inline fun <reified VM : ViewModel> Fragment.activityViewModels(
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> = createViewModelLazy(
    VM::class, { requireActivity().viewModelStore },
    factoryProducer ?: { requireActivity().defaultViewModelProviderFactory }
)
public fun <VM : ViewModel> Fragment.createViewModelLazy(
    viewModelClass: KClass<VM>,
    storeProducer: () -> ViewModelStore,
    factoryProducer: (() -> Factory)? = null
): Lazy<VM> {
    val factoryPromise = factoryProducer ?: {
        defaultViewModelProviderFactory
    }
    return ViewModelLazy(viewModelClass, storeProducer, factoryPromise)
}

public class ViewModelLazy<VM : ViewModel> @JvmOverloads constructor(
    private val viewModelClass: KClass<VM>,
    private val storeProducer: () -> ViewModelStore,
    private val factoryProducer: () -> ViewModelProvider.Factory,
    private val extrasProducer: () -> CreationExtras = { CreationExtras.Empty }
) : Lazy<VM> {
    private var cached: VM? = null

    override val value: VM
        get() {
            val viewModel = cached
            return if (viewModel == null) {
                val factory = factoryProducer()
                val store = storeProducer()
                ViewModelProvider(
                    store,
                    factory,
                    extrasProducer()
                ).get(viewModelClass.java).also {
                    cached = it
                }
            } else {
                viewModel
            }
        }

    override fun isInitialized(): Boolean = cached != null
}
```

### viewModels

```java
@MainThread
public inline fun <reified VM : ViewModel> Fragment.viewModels(
    noinline ownerProducer: () -> ViewModelStoreOwner = { this },
    noinline factoryProducer: (() -> Factory)? = null
): Lazy<VM> = createViewModelLazy(
    VM::class, { ownerProducer().viewModelStore },
    factoryProducer ?: {
        (ownerProducer() as? HasDefaultViewModelProviderFactory)?.defaultViewModelProviderFactory
            ?: defaultViewModelProviderFactory
    }
)
```

## ViewModel 数据的首次加载时机？

**错误示例：**

```kotlin
//DetailTaskViewModel.kt
class DetailTaskViewModel : ViewModel() {
    private val _task = MutableLiveData<Task>()
    val task: LiveData<Task> = _task
    fun fetchTaskData(taskId: Int) {
        viewModelScope.launch {
            _task.value = withContext(Dispatchers.IO){
                TaskRepository.getTask(taskId)
            }
        }
    }
}
//DetailTaskFragment.kt
class DetailTaskFragment : Fragment(R.layout.fragment_detailed_task){
    private val viewModel : DetailTaskViewModel by viewModels()
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //订阅 ViewModel
        viewMode.uiState.observe(viewLifecycleOwner) {
           //update ui
        }
        //请求数据
        viewModel.fetchTaskData(requireArguments().getInt(TASK_ID))
    }
}
```

**分析：** 如果 ViewModel 在 `onViewCreated` 中请求数据，当 View 因为横竖屏等原因重建时会再次请求，而我们知道 ViewModel 的生命周期长于 View，数据可以跨越 View 的生命周期存在，所以没有必要随着 View 的重建反复请求。

**正确的加载时机：**
ViewModel 的初次数据加载推荐放到 `init{}` 中进行，这样可以保证 `ViewModelScope` 中只加载一次

```kotlin
// TasksViewModel.kt
class TasksViewModel: ViewModel() {

    private val _tasks = MutableLiveData<List<Task>>()
    val tasks: LiveData<List<Task>> = _uiState
    
    init {
        viewModelScope.launch {
            _tasks.value = withContext(Dispatchers.IO){
                TasksRepository.fetchTasks()
            }
        }
    }
}
```

## ViewModel 和 Activity 生命周期的关系？如何实现旋转屏幕数据不丢失的？

ViewModel 在 Activity 的 onDestroy 时销毁，会调用 ViewModelStore 的 clear 方法，而 ViewModelStore 通过 HashMap 将 ViewModel 存储起来了，在其 clear 方法中遍历 mMap 调用 ViewModel 的 clear 方法做一些清理的工作；

当屏幕旋转或者切换系统语言时，Activity 生命周期从销毁再重建，但是 ViewModel 里面的变量值不受到影响，ViewModel 还是同一个实例

ViewModel 屏幕旋转数据是保存在 ViewModelStore 中，ViewModelStore 又被系统用一个 `NonConfigurationInstances`，在 `onRetainNonConfigurationInstance()` 保存了，最终是保存在 `ActivityClientRecord`

在需要恢复的时候，在 `Activity.attach` 会将 `NonConfigurationInstances` 给带过来，里面就保存的 `ViewModelStore`，而 ViewModelStore `里面又保存了` ViewModel，这样的话在屏幕旋转时就可以恢复 ViewModel 了
