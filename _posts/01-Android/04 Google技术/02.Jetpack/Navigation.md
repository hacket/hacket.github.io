---
date created: 2024-12-24 00:33
date updated: 2024-12-24 00:33
dg-publish: true
---

# Navigation基础

<https://developer.android.com/guide/navigation>

## 入门

### Navigation提供功能

1. 处理Fragment事务
2. 默认情况下，正确处理往返操作
3. 转场动画
4. 实现deeplink（深层链接）
5. 包括导航界面模式（例如抽屉式导航和底部导航），用户只需完成极少的额外工作
6. SafeArgs 在目标之间导航和传递数据时提供类型安全的Gradle插件
7. ViewModel支持

### 依赖

```
dependencies {
  def nav_version = "2.3.0-alpha01"

  // Java language implementation
  implementation "androidx.navigation:navigation-fragment:$nav_version"
  implementation "androidx.navigation:navigation-ui:$nav_version"

  // Kotlin
  implementation "androidx.navigation:navigation-fragment-ktx:$nav_version"
  implementation "androidx.navigation:navigation-ui-ktx:$nav_version"

  // Dynamic Feature Module Support
  implementation "androidx.navigation:navigation-dynamic-features-fragment:$nav_version"

  // Testing Navigation
  androidTestImplementation "androidx.navigation:navigation-testing:$nav_version"
}
```

### 使用入门

#### 向 Activity 添加 NavHost

导航宿主是 Navigation组件的核心部分之一。导航宿主是一个空容器，用户在您的应用中导航时，目的地会在该容器中交换进出。

导航宿主必须派生于`NavHost`。Navigation 组件的默认 NavHost 实现 (`NavHostFragment`) 负责处理 Fragment 目的地的交换。

> 注意：Navigation 组件旨在用于具有一个主 Activity 和多个 Fragment 目的地的应用。主 Activity与导航图相关联，且包含一个负责根据需要交换目的地的 NavHostFragment。在具有多个 Activity目的地的应用中，每个 Activity 均拥有其自己的导航图。

##### 通过 XML 添加 NavHostFragment

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <androidx.appcompat.widget.Toolbar
        .../>

    <fragment
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph" />

    <com.google.android.material.bottomnavigation.BottomNavigationView
        .../>
</android.support.constraint.ConstraintLayout>
```

1. `android:name`属性包含`NavHost`实现的类名称。
2. `app:navGraph`属性将``NavHostFragment`与导航图相关联。导航图会在此 NavHostFragment 中指定用户可以导航到的所有目的地。
3. `app:defaultNavHost="true"`属性确保您的 NavHostFragment会拦截系统返回按钮。请注意，只能有一个默认NavHost。如果同一布局（例如，双窗格布局）中有多个主机，请务必仅指定一个默认 NavHost。

#### 向导航图添加目的地

您可以从现有的 Fragment 或 Activity 创建目的地。您还可以使用 Navigation Editor 创建新目的地，或创建占位符以便稍后替换为 Fragment 或 Activity。

##### Activity

```xml
<activity
    android:id="@+id/nav_video_learning"
    android:name="me.hacket.assistant.samples.ui.自定义控件.tipsview.GiftTipsView测试"
    android:label="音视频学习"
    tools:layout="@layout/activity_gift_tips_view_demo" />
```

##### Fragment

```xml
<fragment
    android:id="@+id/page1Fragment"
    android:name="me.hacket.assistant.samples.google.architecture.navigation.helloworld.MainPage1Fragment"
    android:label="fragment_page1"
    tools:layout="@layout/fragment_main_page1">
    <action
        android:id="@+id/action_page2"
        app:destination="@id/page2Fragment"
        app:enterAnim="@anim/slide_right_in"
        app:exitAnim="@anim/slide_left_out"
        app:popEnterAnim="@anim/slide_left_in"
        app:popExitAnim="@anim/slide_right_out" />
</fragment>
```

##### DialogFragment

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph">
    <dialog
        android:id="@+id/my_dialog_fragment"
        android:name="androidx.navigation.myapp.MyDialogFragment">
        <argument android:name="myarg" android:defaultValue="@null" />
            <action
                android:id="@+id/myaction"
                app:destination="@+id/another_destination"/>
    </dialog>
</navigation>
```

##### placeholder

您可以使用占位符来表示尚未实现的目的地。占位符充当目的地的视觉表示形式。在 Navigation Editor 中，您可以像使用任何其他目的地一样使用占位符。

> 您必须先将占位符的类属性更改为现有目的地，然后再运行应用。占位符不会导致编译错误，但如果您尝试导航到占位符目的地，则应用会抛出运行时异常

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph">
    <fragment android:id="@+id/placeholder2" />
</navigation>
```

#### 目的地详解

点击一个目的地以将其选中，并注意 Attributes 面板中显示的以下属性：

1. `Type` 字段指示在您的源代码中，该目的地是作为 Fragment、Activity 还是其他自定义类实现的。
2. `Label` 字段包含该目的地的 XML 布局文件的名称。
3. `ID` 字段包含该目的地的 ID，它用于在代码中引用该目的地。
4. `Class` 下拉列表显示与该目的地相关联的类的名称。您可以点击此下拉列表，将相关联的类更改为其他目的地类型<br />点击 Text 标签页可查看导航图的 XML 视图。XML 中同样包含该目的地的 id、name、label 和 layout 属性，如下所示：

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:android="http://schemas.android.com/apk/res/android"
    app:startDestination="@id/blankFragment">
    <fragment
        android:id="@+id/blankFragment"
        android:name="com.example.cashdog.cashdog.BlankFragment"
        android:label="Blank"
        tools:layout="@layout/fragment_blank" />
</navigation>
```

#### 将某个屏幕指定为起始目的地

起始目的地是用户打开您的应用时看到的第一个屏幕，也是用户退出您的应用时看到的最后一个屏幕。Navigation Editor 使用房子图标![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691239378596-1fed6ed0-610f-4de0-b450-ff69a86579b5.png#averageHue=%23b0b0b0&clientId=ue1ce4949-44a3-4&from=paste&height=54&id=u062ab66a&originHeight=108&originWidth=104&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4843&status=done&style=none&taskId=u9d39183b-eb81-45f0-abfd-f7128413c47&title=&width=52)来表示起始目的地。

所有目的地就绪后，您便可以选择起始目的地，具体操作步骤如下：

1. 在 `Design` 标签页中，点击相应目的地，使其突出显示。
2. 点击 `Assign start destination` 按钮小房子。或者，您可以右键点击该目的地，然后点击`Set as Start Destination`。

#### 连接目的地

操作是指目的地之间的逻辑连接。操作在导航图中以箭头表示。操作通常会将一个目的地连接到另一个目的地

#### 导航到目的地

导航到目的地是使用 NavController 完成的，后者是一个在 NavHost 中管理应用导航的对象。每个 NavHost 均有自己的相应 NavController。您可以使用以下方法之一检索 NavController：

Kotlin：

```kotlin
Fragment.findNavController()
View.findNavController()
Activity.findNavController(viewId: Int)
```

Java:

```java
NavHostFragment.findNavController(Fragment)
Navigation.findNavController(Activity, @IdRes int viewId)
Navigation.findNavController(View)
```

##### 使用 Safe Args 确保类型安全

要在目的地之间导航，建议使用 Safe Args Gradle插件。该插件可以生成简单的对象和构建器类，这些类支持在目的地之间进行类型安全的导航和参数传递。

```
buildscript {
    repositories {
        google()
    }
    dependencies {
        def nav_version = "2.3.0-alpha01"
        classpath "androidx.navigation:navigation-safe-args-gradle-plugin:$nav_version"
    }
}
```

要生成适用于 Java 或 Java 和 Kotlin 混合模块的 Java 语言代码，请将以下行添加到应用或模块的 build.gradle 文件中：

```
apply plugin: "androidx.navigation.safeargs"
```

适用于 Kotlin 独有的模块的 Kotlin 代码：

```
apply plugin: "androidx.navigation.safeargs.kotlin"
```

> 您的 `gradle.properties` 文件 中必须具有 `android.useAndroidX=true`<br />启用 Safe Args 后，该插件会生成代码，其中包含您定义的每个操作的类和方法。对于每个操作，Safe Args 还会为每个源目的地（生成相应操作的目的地）生成一个类。生成的类的名称由源目的地类的名称和“`Directions`”一词组成

例如，如果目的地的名称为 SpecifyAmountFragment，则生成的类的名称为 SpecifyAmountFragmentDirections。生成的类为源目的地中定义的每个操作提供了一个静态方法。该方法会将任何定义的操作参数作为参数，并返回可传递到 navigate() 的 NavDirections 对象。

例如，假设我们的导航图包含一个操作，该操作将源目的地 SpecifyAmountFragment 和接收目的地 ConfirmationFragment 连接起来。

Safe Args 会生成一个 SpecifyAmountFragmentDirections 类，其中只包含一个 actionSpecifyAmountFragmentToConfirmationFragment() 方法（该方法会返回 NavDirections 对象）。然后，您可以将返回的 NavDirections 对象直接传递到 navigate()，如以下示例所示：

```kotlin
override fun onClick(view: View) {
    val action =
        SpecifyAmountFragmentDirections
            .actionSpecifyAmountFragmentToConfirmationFragment()
    view.findNavController().navigate(action)
}
```

### 传递参数

#### Fragment传统传参数

传递参数：

```
//未采用safe args的传递方式
Bundle bundle = new Bundle();
bundle.putString("user_name", "Michael");
bundle.putInt("age", 30);
Navigation.findNavController(v).navigate(R.id.action_mainFragment_to_secondFragment, bundle);
```

接收参数：

```
//未采用safe args的接收方式
Bundle bundle = getArguments();
if(bundle != null) {
    String userName = bundle.getString("user_name");
    int age = bundle.getInt("age");
    TextView tvSub = view.findViewById(R.id.tvSub);
    tvSub.setText(userName + age);
}
```

#### SafeArgs

1. 引入gradle插件

```
// 根目录build.gradle的buildscript/dependencies引入
def nav_version = "2.3.0-alpha01"
classpath "androidx.navigation:navigation-safe-args-gradle-plugin:$nav_version"

// build.gradle引入Gradle插件
apply plugin: "androidx.navigation.safeargs.kotlin"
```

2. navigation graph定义参数

```xml
<fragment
    android:id="@+id/userCenterFragment"
    android:name="me.hacket.assistant.samples.google.architecture.navigation.usercenter.fragment.UserCenterFragment"
    android:label="UserCenterFragment"
    tools:layout="@layout/fragment_main_user_center">
    <argument
        android:name="user_name"
        android:defaultValue="unknown"
        app:argType="string" />
    <argument
        android:name="user_name"
        android:defaultValue="28"
        app:argType="int" />
    <argument
        android:name="hobby"
        app:argType="reference" />
    <action
        android:id="@+id/action_userCenterInfoFragment"
        app:destination="@+id/user_center_info_graph"
        app:enterAnim="@anim/slide_right_in"
        app:exitAnim="@anim/slide_left_out"
        app:popEnterAnim="@anim/slide_left_in"
        app:popExitAnim="@anim/slide_right_out" />
    <action
        android:id="@+id/action_userLevelActivity"
        app:destination="@+id/userCenterLevelNav"
        app:enterAnim="@anim/slide_right_in"
        app:exitAnim="@anim/slide_left_out"
        app:popEnterAnim="@anim/slide_left_in"
        app:popExitAnim="@anim/slide_right_out" />
</fragment>
```

3. SafeArgs插件生成xxxArgs类和xxxDirections类<br />传递参数：

```java
//通过safe args完成参数传递
Bundle bundle = new MainFragmentArgs.Builder().setUserName("Michael").setAge(30).build().toBundle();
Navigation.findNavController(v).navigate(R.id.action_mainFragment_to_secondFragment, bundle);
```

接收参数：

```
//通过safe args完成参数接收
Bundle bundle = getArguments();
if(bundle != null) {
    String userName = MainFragmentArgs.fromBundle(getArguments()).getUserName();
    int age = MainFragmentArgs.fromBundle(getArguments()).getAge();
    TextView tvSub = view.findViewById(R.id.tvSub);
    tvSub.setText(userName + age);
}
```

### 核心类

#### 导航图 xml

Navigation 组件使用导航图管理应用导航。导航图是一种资源文件，其中包含您应用的所有目的地和逻辑连接（后者也称为“操作”，用户可以执行以从一个目的地导航到另一个目的地）。您可以使用 Android Studio 中的 Navigation Editor 管理应用的导航图。

##### Navigation Editor

##### 设计导航图

###### 顶级导航图

`<navigation>` 元素是导航图的根元素。当您向图表添加目的地和连接操作时，可以看到相应的 `<destination>` 和 `<action>`元素在此处显示为子元素

###### 嵌套导航图 `<navigation>`

可以嵌套导航视图，嵌套导航图用标签`<navigation>`包裹<br />[嵌套导航图表(介绍了Navigation Editor操作)](https://developer.android.com/guide/navigation/navigation-nested-graphs)

> navigation包裹的嵌套导航图，外部引用也只能引入对外提供的`android:id`，其里面的id外部是不知道的

###### 库模块导航图 `<include>`

可通过`<include>`引用其他导航图

```xml
<!--nav_graph_user_center_user.xml-->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    app:startDestination="@id/userCenterFragment">
    <fragment
        android:id="@+id/userCenterFragment"
        android:name="me.hacket.assistant.samples.google.architecture.navigation.usercenter.fragment.UserCenterFragment"
        android:label="UserCenterFragment"
        tools:layout="@layout/fragment_main_user_center">
        <action
            android:id="@+id/action_userCenterInfoFragment"
            app:destination="@id/user_center_info_graph"
            app:enterAnim="@anim/slide_right_in"
            app:exitAnim="@anim/slide_left_out"
            app:popEnterAnim="@anim/slide_left_in"
            app:popExitAnim="@anim/slide_right_out" />
    </fragment>
    <include app:graph="@navigation/nav_graph_user_center_user_info" />
</navigation>

<!--nav_graph_user_center_user_info.xml-->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/user_center_info_graph"
    app:startDestination="@id/userCenterInfoFragment">
    <fragment
        android:id="@+id/userCenterInfoFragment"
        android:name="me.hacket.assistant.samples.google.architecture.navigation.usercenter.fragment.UserCenterInfoFragment"
        android:label="UserCenterInfoFragment"
        tools:layout="@layout/fragment_main_user_center_info">
    </fragment>
</navigation>
```

> 通过include的导航图，需要提供一个id，否则报错，include是导航图的文件名；include的导航图，其他地方需要用到，他们的destination只能填写导航图的android:id，其里面的id是不知道的，否则报下面的错。

```
java.lang.IllegalArgumentException: navigation destination me.hacket.assistant:id/userCenterInfoFragment referenced from action me.hacket.assistant:id/action_userCenterInfoFragment is unknown to this NavController
```

###### 全局操作

您可以使用全局操作来创建多个目的地可以使用的常见操作。例如，您可能想要在不同的目的地中使用能够导航到同一应用主屏幕的按钮。

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:app="http://schemas.android.com/apk/res-auto"
            xmlns:tools="http://schemas.android.com/tools"
            xmlns:android="http://schemas.android.com/apk/res/android"
            android:id="@+id/main_nav"
            app:startDestination="@id/mainFragment">

  ...

  <action android:id="@+id/action_global_mainFragment"
          app:destination="@id/mainFragment"/>

</navigation>
```

#### NavHost接口

获取NavController；显示导航图中目标的空白容器。导航组件包含一个默认 NavHost 实现 (NavHostFragment)，可显示 Fragment 目标。

##### NavGraphFragment 导航界面的容器

默认的Fragment的容器

#### NavController

在 NavHost 中管理应用导航的对象。当用户在整个应用中移动时，NavController 会安排 NavHost 中目标内容的交换；在应用中导航时，您告诉NavController，您想沿导航图中的特定路径导航至特定目标，或直接导航至特定目标。NavController 便会在 NavHost 中显示相应目标。

# Navigation分析

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691239777324-dec46bb2-b824-429f-bcd0-f3e136aededb.png#averageHue=%23f7f7f7&clientId=ue1ce4949-44a3-4&from=paste&height=480&id=u19f712e4&originHeight=960&originWidth=1222&originalType=binary&ratio=2&rotation=0&showTitle=false&size=235590&status=done&style=none&taskId=u14baf1f9-dcd7-4b31-bced-3dc2de1fa18&title=&width=611)

## NavHostFragment

NavHostFragment 应当有两个作用：

1. 作为Activity导航界面的载体
2. 管理并控制导航的行为

### 导航界面的载体

在NavHostFragment的创建时，为它创建一个对应的FrameLayout作为 导航界面的载体

```java
public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                         @Nullable Bundle savedInstanceState) {
    FragmentContainerView containerView = new FragmentContainerView(inflater.getContext());
    // When added via XML, this has no effect (since this FragmentContainerView is given the ID
    // automatically), but this ensures that the View exists as part of this Fragment's View
    // hierarchy in cases where the NavHostFragment is added programmatically as is required
    // for child fragment transactions
    containerView.setId(getContainerId());
    return containerView;
}
```

### 管理控制导航行为 NavController

代码设计应该遵循 **单一职责原则**，因此，我们应该将 管理并控制导航的行为 交给另外一个类，这个类的作用应该仅是 控制导航行为，因此我们命名为 `NavController`。

Fragment理应持有这个NavController的实例，并将导航行为 委托 给它，这里我们将 NavController 的持有者抽象为一个 接口，以便于以后的拓展，就是 `NavHost` 接口

#### NavHost 获取NavController

```java
public interface NavHost {
    NavController getNavController();
}
```

推荐实例`NavHostController`。

Navigation hosts must:

1. 处理NavController的save和restore状态
2. 调用`Navigation.setViewNavController(View, NavController)`在其root view
3. 系统后退事件交由NavController，而不是手动调用`NavController.popBackStack()`或`NavHostController.setOnBackPressedDispatcher(androidx.activity.OnBackPressedDispatcher)`

可选Navigation host考虑调用

1. `NavHostController.setLifecycleOwner(LifecycleOwner)`让NavController关联Lifecycle
2. `NavHostController.setViewModelStore(ViewModelStore)`调用开启`NavControllerViewModel`，以便通过`NavController#getViewModelStoreOwner(int)`将nav graph保存在ViewModel生命周期内

---

为了保证导航的 安全，NavHostFragment 在其 作用域 内，理应 有且仅有一个NavController 的实例。<br />调用`Navigation.findNavController(View)`，参数中传递任意一个 view的引用似乎都可以获取 NavController，如何保证唯一？

```java
private static NavController findViewNavController(@NonNull View view) {
    while (view != null) {
        NavController controller = getViewNavController(view);
        if (controller != null) {
            return controller;
        }
        ViewParent parent = view.getParent();
        view = parent instanceof View ? (View) parent : null;
    }
    return null;
}
```

> `findNavController(View)`内部实现是通过 遍历 View树，直到找到最底部 NavHostFragment 中的NavController对象，并将其返回

NavController如何初始化？<br />在NavHostFragment中的onCreate()初始化，下面的操作都是根据NavHost注释应该提供的功能实现

```java
// NavHostFragment
public void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    final Context context = requireContext();

    mNavController = new NavHostController(context); // new一个NavHostController
    mNavController.setLifecycleOwner(this); // 关联Lifecycle 
    mNavController.setOnBackPressedDispatcher(requireActivity().getOnBackPressedDispatcher()); // back事件处理
    // Set the default state - this will be updated whenever
    // onPrimaryNavigationFragmentChanged() is called
    mNavController.enableOnBackPressed(
            mIsPrimaryBeforeOnCreate != null && mIsPrimaryBeforeOnCreate);
    mIsPrimaryBeforeOnCreate = null;
    mNavController.setViewModelStore(getViewModelStore()); // 关联ViewModel
    onCreateNavController(mNavController); // 添加默认FragmentNavigator，需要自定义Navigator，重写该方法

    // 下面就是状态的恢复和保存
    Bundle navState = null;
    if (savedInstanceState != null) {
        navState = savedInstanceState.getBundle(KEY_NAV_CONTROLLER_STATE);
        if (savedInstanceState.getBoolean(KEY_DEFAULT_NAV_HOST, false)) {
            mDefaultNavHost = true;
            getParentFragmentManager().beginTransaction()
                    .setPrimaryNavigationFragment(this)
                    .commit();
        }
        mGraphId = savedInstanceState.getInt(KEY_GRAPH_ID);
    }

    if (navState != null) {
        // Navigation controller state overrides arguments
        mNavController.restoreState(navState);
    }
    if (mGraphId != 0) {
        // Set from onInflate()
        mNavController.setGraph(mGraphId);
    } else {
        // See if it was set by NavHostFragment.create()
        final Bundle args = getArguments();
        final int graphId = args != null ? args.getInt(KEY_GRAPH_ID) : 0;
        final Bundle startDestinationArgs = args != null
                ? args.getBundle(KEY_START_DESTINATION_ARGS)
                : null;
        if (graphId != 0) {
            mNavController.setGraph(graphId, startDestinationArgs);
        }
    }
}
```

```java
@Override
public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);
    if (!(view instanceof ViewGroup)) {
        throw new IllegalStateException("created host view " + view + " is not a ViewGroup");
    }
    Navigation.setViewNavController(view, mNavController);
    // When added programmatically, we need to set the NavController on the parent - i.e.,
    // the View that has the ID matching this NavHostFragment.
    if (view.getParent() != null) {
        View rootView = (View) view.getParent();
        if (rootView.getId() == getId()) {
            Navigation.setViewNavController(rootView, mNavController);
        }
    }
}
```

在onViewCreated，设置`Navigation.setViewNavController(view, mNavController);`，保证View都可以获取到NavController实例。

## NavController

NavController 的职责：

1. 对navigation资源文件夹下nav_graph.xml的解析
2. 通过解析xml，获取所有 Destination（目标点）的 引用 或者 Class的引用
3. 记录当前栈中 Fragment的顺序
4. 管理控制 导航行为

### 对navigation资源文件夹下nav_graph.xml的解析

NavController持有了一个`NavInflater`，并通过NavInflater解析xml文件，通过`setGraph()`，最终调用到`onGraphCreated`

```java
private void onGraphCreated(@Nullable Bundle startDestinationArgs) {
    if (mNavigatorStateToRestore != null) {
        ArrayList<String> navigatorNames = mNavigatorStateToRestore.getStringArrayList(
                KEY_NAVIGATOR_STATE_NAMES);
        if (navigatorNames != null) {
            for (String name : navigatorNames) {
                Navigator<?> navigator = mNavigatorProvider.getNavigator(name);
                Bundle bundle = mNavigatorStateToRestore.getBundle(name);
                if (bundle != null) {
                    navigator.onRestoreState(bundle);
                }
            }
        }
    }
    if (mBackStackToRestore != null) {
        for (Parcelable parcelable : mBackStackToRestore) {
            NavBackStackEntryState state = (NavBackStackEntryState) parcelable;
            NavDestination node = findDestination(state.getDestinationId());
            if (node == null) {
                throw new IllegalStateException("unknown destination during restore: "
                        + mContext.getResources().getResourceName(state.getDestinationId()));
            }
            Bundle args = state.getArgs();
            if (args != null) {
                args.setClassLoader(mContext.getClassLoader());
            }
            NavBackStackEntry entry = new NavBackStackEntry(mContext, node, args,
                    mLifecycleOwner, mViewModel,
                    state.getUUID(), state.getSavedState());
            mBackStack.add(entry);
        }
        updateOnBackPressedCallbackEnabled();
        mBackStackToRestore = null;
    }
    if (mGraph != null && mBackStack.isEmpty()) {
        boolean deepLinked = !mDeepLinkHandled && mActivity != null
                && handleDeepLink(mActivity.getIntent());
        if (!deepLinked) {
            // Navigate to the first destination in the graph
            // if we haven't deep linked to a destination
            navigate(mGraph, startDestinationArgs, null, null);
        }
    }
}
```

获取了所有 Destination（即XXXFragment ） 的 Class对象，并通过反射的方式，实例化对应的 Destination，通过一个队列保存：

```
private NavInflater mInflater;  //NavInflater
private NavGraph mGraph;        //解析xml，得到NavGraph
private int mGraphId;           //xml对应的id，比如 nav_graph_main
//所有Destination的队列,用来处理回退栈
private final Deque<NavDestination> mBackStack = new ArrayDeque<>();
```

### NavGraph(NavDestination) 和 Navigator

#### NavDestination

导航的`Destination`抽象出来，这个类叫做`NavDestination` ——无论 Fragment 也好，Activity 也罢，只要实现了这个接口，对于NavController 来讲，他们都是 **Destination（目标点）** 而已。

#### Navigator

对于不同的 NavDestination 来讲，它们之间的导航方式是不同的，这完全有可能（比如Activity 和 Fragment），如何根据不同的 NavDestination 进行不同的 导航处理 呢？

Google的方式是通过抽象出一个类，这个类叫做 `Navigator`

```java
public abstract class Navigator<D extends NavDestination> {
    //省略很多代码,包括部分抽象方法，这里仅阐述设计的思路！

    //导航
    public abstract void navigate(@NonNull D destination, @Nullable Bundle args,
                                     @Nullable NavOptions navOptions);
    //实例化NavDestination（就是Fragment）
    public abstract D createDestination();

    //后退导航
    public abstract boolean popBackStack();
}
```

Navigator(导航者) 的职责很单纯：

1. 能够实例化对应的 NavDestination
2. 能够指定导航
3. 能够后退导航

不同的 Navigator 对应不同的 NavDestination，FragmentNavigator 对应的是 FragmentNavigator.Destination

以 `FragmentNavigator`为例，我们来看看它是如何执行的职责：

```java
public class FragmentNavigator extends Navigator<FragmentNavigator.Destination> {
    //省略大量非关键代码，请以实际代码为主！

    @Override
    public boolean popBackStack() {
        return mFragmentManager.popBackStackImmediate();
    }

    @NonNull
    @Override
    public Destination createDestination() {
        // 实际执行了好几层，但核心代码如下，通过反射实例化Fragment
        Class<? extends Fragment> clazz = getFragmentClass();
        return  clazz.newInstance();
    }

    @Override
    public void navigate(@NonNull Destination destination, @Nullable Bundle args,
                            @Nullable NavOptions navOptions) {
        // 实际上还是通过FragmentTransaction进行的跳转处理
        final Fragment frag = destination.createFragment(args);
        final FragmentTransaction ft = mFragmentManager.beginTransaction();
        ft.replace(mContainerId, frag);
        ft.commit();
        mFragmentManager.executePendingTransactions();
    }
}
```

NavController初始时就添加了2中Navigator：

```java
public NavController(@NonNull Context context) {
    mContext = context;
    while (context instanceof ContextWrapper) {
        if (context instanceof Activity) {
            mActivity = (Activity) context;
            break;
        }
        context = ((ContextWrapper) context).getBaseContext();
    }
    mNavigatorProvider.addNavigator(new NavGraphNavigator(mNavigatorProvider));
    mNavigatorProvider.addNavigator(new ActivityNavigator(mContext));
}
```

## Ref

- [x] Android官方架构组件Navigation：大巧不工的Fragment管理框架<br /><https://blog.csdn.net/mq2553299/article/details/80445952>
