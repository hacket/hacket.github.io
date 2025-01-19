---
date_created: Monday, April 1st 2024, 1:27:34 am
date_updated: Monday, January 20th 2025, 12:07:13 am
title: Activity及Fragment的数据保存和恢复
author: hacket
categories:
  - Android
category: 四大组件
tags: [四大组件, activity]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
dg-content-classes: 
image-auto-upload: true
feed: show
format: list
aliases: [Activity 及 Fragment 的数据保存和恢复]
linter-yaml-title-alias: Activity 及 Fragment 的数据保存和恢复
---

# Activity 及 Fragment 的数据保存和恢复

- [ ] Saving UI States <https://developer.android.com/topic/libraries/architecture/saving-states>

## Android 数据保存和恢复

### 模拟 App 被系统 kill（requires emulator running P+）

1. 查看要模拟的 App 的进程，看是否存活

```
adb shell ps -A |grep me.hacket
```

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501140003809.png)

2. 按 Home 键回到桌面（不按 Home kill 不了）
3. 运行命令

```
adb shell am kill me.hacket.assistant
```

4. 再次确认查看是否存活，现在应该为空

```
adb shell ps -A |grep me.hacket
```

5. 再次打开该 App，就能模拟 App 被系统 kill 的操作

### Activity 重建

在 Android 系统中，需要数据恢复有如下两种场景：

#### 配置变更

资源相关的配置发生改变导致 Activity 被杀死并重新创建。(如屏幕旋转)

- 横竖屏切换
- 键盘可用性/显示隐藏更改
- 多窗口设定
- 切换系统语言
- 切换深色模式
- 字体大小切换
- 系统导航方式变更

#### Activity 重建的细节

1. `Activity` 重建过程中，先将原来的 `Activity` 进行销毁（从 `onPause` > `onStop` > `onDestroy` > `onCreate` 的生命周期)。
2. 虽然是不同的 Activity 对象，但重建时使用的 `ActivityClientRecord` 却是相同的，而 `ActivityClientRecord` 最终是被 `ActivityThread` 持有，它是全局的。这也是 `onSaveInstanceState/onRestoreInstanceState` 能够存储与恢复数据的本质原因。

#### Activity 重建的原因分析

1. 系统内存不足
2. 配置项改变（configuration change ）\
   例如横竖屏切换，白天黑夜模式切换
3. 调用 activity 的 onCreate() 方法

#### 配置项声明不重建 activity

- 横竖屏切换

```xml
<activity android:name="" android:configChanges="orientation|screenSize"></activity>
```

- 白天/黑夜模式

```xml
<activity android:name="" android:configChanges="uiMode"></activity>
```

- 系统语言切换

```xml
<activity android:name="" android:configChanges="locale|layoutDirection|keyboard"></activity>
```

#### 内存不足

资源内存不足导致低优先级的 Activity 被杀死。（开发者选项中不保留活动可以模拟）

### 突发情况

- 点击 back 后退键
- 点击锁屏键
- 点击 home 键
- 其他 app 进入前台 (如电话来了)
- 启动了另外一个 activity
- 屏幕方向旋转
- app 被 kill 掉

> 除了按 back 键,其他情况下,`onSaveInstanceState` 方法都会调用; 而且 `onPause` 方法所有情况下都是会调用的。

### 几种数据恢复方式的总结

- [x] ViewModel 的局限，销毁重建的方案 SavedStateHandle<https://juejin.im/post/5e2c6914f265da3e377eff25>

<https://github.com/husaynhakeem/Androidx-SavedState-Playground>

## ViewModel 做数据保存恢复（官方推荐） ViewModelSavedState

见 ViewModel 章节介绍

```
 implementation "androidx.lifecycle:lifecycle-viewmodel-savedstate:2.2.0"
```

> 不需要手动引入该库，因为 fragment 库已经在内部引入该库

1. ViewModel 默认只能解决配置更改数据恢复问题，资源内存不足导致低优先级的 Activity 被杀死数据不能恢复
2. <br />

- [ ] <https://www.jianshu.com/p/9772b88e3c1e><br />【背上 Jetpack】绝不丢失的状态 androidx SaveState ViewModel-SaveState 分析

## androidx SaveState

在 `androidx` 下，提供了 `SavedState` 库帮助 activity 和 fragment 处理状态保存和恢复

```
implementation "androidx.savedstate:savedstate:1.0.0"
```

> 这是一个很小的库，不需要显示地声明，因为 activity 库内部已经引入了

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501140003810.png)

### SavedStateRegistryOwner

持有 `SavedStateRegistry` 的组件。 默认情况下，`androidx` 包中的 ComponentActivity 和 Fragment 都实现此接口

```java
public interface SavedStateRegistryOwner extends LifecycleOwner {
    @NonNull
    SavedStateRegistry getSavedStateRegistry();
}
```

### SavedStateRegistryController

一个包装 `SavedStateRegistry` 并允许通过其 2 个主要方法对其进行控制的组件：`performRestore(savedState)` 和 `performSave(outBundle)`。这两个方法将内部通过 `SavedStateRegistry` 中的方法处理。

```java
public final class SavedStateRegistryController {
    private final SavedStateRegistryOwner mOwner;
    private final SavedStateRegistry mRegistry;

    public void performRestore(@Nullable Bundle savedState) {
        // ...
        mRegistry.performRestore(lifecycle, savedState);
    }

    public void performSave(@NonNull Bundle outBundle) {
        mRegistry.performSave(outBundle);
    }
}
```

### SavedStateProvider

保存状态的组件，此状态将在以后恢复并使用

```java
public interface SavedStateProvider {
    @NonNull
    Bundle saveState();
}
```

### SavedStateRegistry

管理 SavedStateProvider 列表的组件，此注册表绑定了其所有者的生命周期（即 activity 或 fragment）。每次创建生命周期所有者都会创建一个新的实例

在调用 activity 的 `onCreate(savedInstanceState)` 方法之后，将调用其 `performRestore(state)` 方法，以恢复系统杀死其所有者之前保存的任何状态。

```java
// androidx.activity.ComponentActivity
protected void onSaveInstanceState(@NonNull Bundle outState) {
    Lifecycle lifecycle = getLifecycle();
    if (lifecycle instanceof LifecycleRegistry) {
        ((LifecycleRegistry) lifecycle).setCurrentState(Lifecycle.State.CREATED);
    }
    super.onSaveInstanceState(outState);
    mSavedStateRegistryController.performSave(outState);
}
// SavedStateRegistryController
public void performSave(@NonNull Bundle outBundle) {
    mRegistry.performSave(outBundle);
}
// SavedStateRegistry
void performSave(@NonNull Bundle outBundle) {
    Bundle components = new Bundle();
    if (mRestoredState != null) {
        components.putAll(mRestoredState);
    }
    for (Iterator<Map.Entry<String, SavedStateProvider>> it =
            mComponents.iteratorWithAdditions(); it.hasNext(); ) {
        Map.Entry<String, SavedStateProvider> entry1 = it.next();
        components.putBundle(entry1.getKey(), entry1.getValue().saveState());
    }
    outBundle.putBundle(SAVED_COMPONENTS_KEY, components);
}
```

## Activity 数据的保存和恢复

### onSaveInstanceState 与 onRestoreInstanceState -- 临时数据保存

- **何时调用？** 在 activity 变得 " 容易 " 被系统销毁时，该 activity 的 `onSaveInstanceState` 方法会被调用执行，也就是说是被动的调用，而不是用户主动按 back 键。
- **何地调用？** `onSaveInstanceState` 的调用是处于 `onPause` 和 `onStop` 之间的; 但可以保证, `onSaveInstanceState` 方法会在 `onStop` 之前调用，但是是否在 `onPause` 之前就不一定了。
- **设计的目的** 对一些**临时的、非永久性的数据**存储并恢复。如：EditText 输入的内容、CheckBox 是否勾选、ScrollView 滚动的位置，目前视频播放的位置等
- **保存**

```java
@Override
protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);

    String data = etData.getText().toString();
    outState.putString("data", data);
    LogUtil.i(TAG, getClass().getSimpleName() + ":onSaveInstanceState...");
}
```

- **恢复** 在 onCreate 或者 onRestoreInstanceState 方法中

```java
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
	// ...
}
@Override
protected void onRestoreInstanceState(Bundle savedInstanceState) {
    super.onRestoreInstanceState(savedInstanceState);
    LogUtil.i(TAG, getClass().getSimpleName() + ":onRestoreInstanceState...");

    if (savedInstanceState != null) {
        String data = savedInstanceState.getString("data");
        etData.setText(data);
    }
}
```

**注意点：** 在 Android 本身中，View 自己实现了 `onSaveInstanceState` 方法，这些控件自己就具有保存临时数据和恢复临时数据的能力,值得一提的是，只有当你给这个 wiget 在 xml 中指定**id**时，它才具有保存数据并且恢复的能力,并且不同的 wiget 还不能共用这个 id，否则会出现**数据覆盖**的情况。EditText 默认都有数据保存恢复，而 TextView 没有，需要加上属性 `android:freezesText="true"`

下面这些控件都实现了：

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501140003811.png)

使用 onSaveInstanceState 与 onRestoreInstanceState 方法，能处理场景 1 与场景 2 的情况。当你的界面数据简单且轻量时，例如原始数据类型或简单对象（比如 String)，则我们可以采用该方式。如果你需要恢复的数据较为复杂，那你应该考虑使用 `ViewModle + onSaveInstanceState()` (为什么要配合使用，会在下文进行讲解)，因为使用 onSaveInstanceState() 会导致序列化或反序列化，而这，有一定的时间消耗。

### onRetainNonConfigurationInstance 与 getLastNonConfigurationInstance（过期不推荐，推荐 ViewModel）

在 Activity 中提供了 `onRetainNonConfigurationInstance` 方法，用于处理配置发生改变时数据的保存。随后在重新创建的 Activity 中调用 `getLastNonConfigurationInstance` 获取上次保存的数据。我们不能直接重写上述方法，如果想在 Activity 中自定义想要恢复的数据，需要我们调用上述两个方法的内部方法：

1. onRetainCustomNonConfigurationInstance()
2. getLastCustomNonConfigurationInstance()

> 注意：onRetainNonConfigurationInstance 方法系统调用时机介于 onStop - onDestroy 之间，getLastNonConfigurationInstance 方法可在 onCreate 与 onStart 方法中调用。在 Android 3.0 后，官方推荐使用 Fragment#setRetainInstance(true) 的方式进行数据的恢复。之所以推荐这种方式，个人猜测是为了降低 Activity 的冗余，将数据恢复的任务从 Activity 抽离出来，这更符合单一职责的设计模式。

示例:

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String name = (String) getLastCustomNonConfigurationInstance();
        if (!TextUtils.isEmpty(name)) {
            //获取恢复后的数据，执行相应操作
        }
    }

//你可以可以在onStart中,获取恢复的数据
//    @Override
//    protected void onStart() {
//        super.onStart();
//        String name = (String) getLastCustomNonConfigurationInstance();
//        if (!TextUtils.isEmpty(name)) {
//        }
//    }

    @Nullable
    @Override
    public Object onRetainCustomNonConfigurationInstance() {
        return "AndyJennifer";
    }  
}
```

### onPause -- 持久数据保存

程序突然死亡了，能保证的就是 `onPause` 方法是一定会调用的，而 onStop 和 onDestory 方法并不一定，所以这个特性使得 onPause 是持久化相关数据的最后的可靠时机。当然 onPause 方法不能做大量的操作，这会影响下一个 Activity 入栈。

### 小结

临时数据使用 onSaveInstanceState 保存恢复，永久性数据使用 onPause 方法保存。

测试源码：

```java
public class OnSaveInstanceStateActivity extends BaseActivity {

    private static final String TAG = "OnSaveInstanceStateActivity";
    private EditText etData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_on_save_instance);

        etData = (EditText) findViewById(R.id.et_data);

        LogUtil.i(TAG, getClass().getSimpleName() + ":onCreate...savedInstanceState:" + (savedInstanceState == null));
    }

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
        LogUtil.i(TAG,
                getClass().getSimpleName() + ":onCreate..persistentState...savedInstanceState:" + (savedInstanceState
                                                                                                           == null));
    }

    @Override
    public void onRestoreInstanceState(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onRestoreInstanceState(savedInstanceState, persistentState);
        LogUtil.i(TAG, getClass().getSimpleName() + ":onRestoreInstanceState...persistentState");
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        LogUtil.i(TAG, getClass().getSimpleName() + ":onRestoreInstanceState...");

        if (savedInstanceState != null) {
            String data = savedInstanceState.getString("data");
            etData.setText(data);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        String data = etData.getText().toString();
        outState.putString("data", data);
        LogUtil.i(TAG, getClass().getSimpleName() + ":onSaveInstanceState...");
    }

    @Override
    protected void onStart() {
        super.onStart();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onStart...");
    }

    @Override
    protected void onResume() {
        super.onResume();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onResume...");
    }

    @Override
    protected void onPause() {
        super.onPause();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onPause...");
    }

    @Override
    protected void onStop() {
        super.onStop();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onStop...");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onDestroy...");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        LogUtil.i(TAG, getClass().getSimpleName() + ":onRestart...");
    }
}
```

## Android 中 Fragment 数据保存和恢复

### 返回栈

类比 Activity，Fragment 返回栈其实是保存 Fragment 的栈结构。区别在于：**Fragment 的返回栈由 Activity 管理；而 Activity 的返回栈由系统管理。**

### 单个 Fragment

和 Activity 类似

当一个 fragment 孤零零地呆在返回栈时，它所处的情况与 Activity 如出一辙。类比 Activity 对数据的保存和恢复，我们可以对此得出结论：

- 临时数据 对于**临时数据**，我们使用**onSaveInstanceState**方法进行保存，并且在**onCreateView**方法中恢复（请注意是 onCreateView）。
- 永久数据 对于**持久性数据**，我们要在 onPause 方法中进行存储。

### 多个 Fragment

- **1、add/hide/show** -- 视图和实例都不会被销毁<br />多个 Fragment 进行切换的时候，采用的是 add/hide/show 方式，那么该 Fragment 的视图和实例都不会被销毁 (即 onDestroyView 和 onDetach 都不会被调用)，如下图，Fragment1 切换到 Fragment2 的时候，只调用了 Fragment1 的 onResume()，onDestroyView 和 onDetach 都不会被调用。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202501140003812.png)

- **2、replace、remove** -- 视图会被销毁，实例不会被销毁<br />如果存在回退栈情况下，Fragment 任务栈中有多个 Fragment 时，进入到下一个 Fragment 时，并不会销毁 Fragment 实例，而仅仅是销毁 Fragment 的视图 (即最终调用的是 `onDestroyView` 方法)<br />下面是采用 replace 加入到会退栈情况：

![](https://note.youdao.com/src/D69EBCAB80D2408CB9105EAC2C62C0FD#id=QrwtT&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />按 back 键，Fragment2 出栈并销毁实例，此时 Fragment1 还在栈中，然后创建 view 视图。<br />![image.png](undefined)

> 保存临时数据，并不能仅保存在 onSaveInstanceState 中（因为它可能不会调用），还应该在 onDestoryView 方法中进行保存临时数据的操作

### 异常情况

当某个 Activity 出现异常，导致 Activity 重新启动，如果将要保持 Fragment 状态的 `onSaveInstanceState` 方法注释掉，这样就不会去保存 Fragment 的状态，当主 Activity 重启的时候，也就不会去恢复之前遗留的 Fragment。

```java
@Override
protected void onSaveInstanceState(Bundle outState) {
    //        super.onSaveInstanceState(outState);
}
```

## Ref

- Android 中 Activity 数据的保存和恢复: <http://www.jianshu.com/p/6622434511f7>
