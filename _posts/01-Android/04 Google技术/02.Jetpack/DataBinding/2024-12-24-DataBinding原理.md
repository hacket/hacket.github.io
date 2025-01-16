---
date created: 2024-12-24 00:32
date updated: 2024-12-24 00:32
dg-publish: true
---

# DataBinding原理

## 编译阶段

**以**`activity_test5.xml`**为例：**

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">
  <data>
    <variable
      name="workBean"
      type="com.zbt.databinding.ObservableWorkBean" />
    <variable
      name="eventBinding"
      type="com.zbt.databinding.Test5Activity.EventBinding" />
  </data>

  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layout_margin="20dp"
    android:orientation="vertical">
    <TextView
      style="@style/TvStyle"
      android:text="model - View : 双向数据绑定" />
    <TextView
      style="@style/TvStyle"
      android:text="@{workBean.name}" />
    <EditText
      style="@style/EtStyle"
      android:layout_marginTop="10dp"
      android:text="@={workBean.name}" />
    <TextView
      android:id="@+id/tv_title"
      style="@style/TvStyle"
      android:layout_marginTop="60dp"
      android:text="事件绑定" />
    <Button
      android:id="@+id/tv_binding3"
      style="@style/BtnStyle"
      android:onClick="@{()->eventBinding.onNameClick(workBean)}"
      android:text="@{workBean.name}" />
    <EditText
      style="@style/EtStyle"
      android:layout_marginTop="10dp"
      android:afterTextChanged="@{eventBinding::onAfterTextChanged}"
      android:hint="@{workBean.name}" />
  </LinearLayout>
</layout>
```

编译生成的代码：<br>编译DataBinding生成的代码主要有 `activity_test5.xml`、`activity_test5-layout.xml`、`BR`、`DataBindingMapper`、`ActivityTest5Binding`

### activity_test5.xml

路径：`build\intermediates\incremental\mergeDebugResources\stripped.dir\layout\activity_test5.xml`<br>该文件是编写的 activity_test5.xml去除 layout标签的布局文件

### actiivty_test5-layout.xml

路径：`build\intermediates\data_binding_layout_info_type_merge\debug\out\actiivty_test5-layout.xml`<br>该文件是根据标签 layout生成的，对activity_test5.xml进行了扩展，其中主要标签如下：

- 包含xml地址、包名、根节点信息。
- model信息
- model指向的目标视图信息，其中 标签绑定了 tag 和 View

### BR

生成在`build\generated\source\kapt\debug\com\xxx\databinding\BR.java`；该目录主要根据`<variable>`和用 `@Bindable`注解的字段生成id，类似如资源生成的id，ResId。

```java
public class BR {
    public static final int _all = 0;
    public static final int activity = 1;
    public static final int employeeBean = 4;
    public static final int eventBinding = 5;
    // ...
    public static final int workBean = 13;
    public static final int workContent = 14;
    public static final int workName = 15;
}
```

### DataBindingmapperImpl

路径：`build\generated\source\kapt\debug\com\xxx\databinding\DataBindingmapperImpl.java`<br>该文件主要是存储 tag绑定对应的 xml，以及BR中的ID与对应的字段

### Activity5TestBinding

kotlin编码的项目中会生成两个类：ActivityTest5Binding和ActivityTest5BindingImpl，其中前者是 abstract类，后者是前者的子类。<br>路径：

1. `build\generated\data_binding_base_class_source_out\debug\out\com\xxx\databinding\databinding\ActivityTest5Binding.java`
2. `build\generated\source\kapt\debug\com\xxx\databinding\databinding\ActivityTest5BindingImpl.java`

可以看到 ViewDataBinding实现了ViewBinding接口，所以从这里也可看出ViewBinding是DataBinding子集。而XxxBindingImpl文件主要是生成相应的 View及对 View进行数据绑定。

## 绑定过程

```java
public void setUser(@Nullable me.hacket.assistant.samples.google.architecture.databinding.demos.demo1.CommonUser User) {
    this.mUser = User;
    synchronized(this) {
        mDirtyFlags |= 0x40L;
    }
    notifyPropertyChanged(BR.user);
    super.requestRebind();
}
```

以setUser为例

- 成员变量mUser赋值
- 同步代码块中加了mDirtyFlags
- 调用notifyPropertyChanged通知user变化了
- 调用requestRebind()

接着看`requestRebind()`

```java
protected void requestRebind() {
    if (mContainingBinding != null) {
        // 1
        mContainingBinding.requestRebind();
    } else {
        final LifecycleOwner owner = this.mLifecycleOwner;
        if (owner != null) {
            Lifecycle.State state = owner.getLifecycle().getCurrentState();
            if (!state.isAtLeast(Lifecycle.State.STARTED)) {
                // 2
                return; // wait until lifecycle owner is started
            }
        }
        synchronized (this) {
            if (mPendingRebind) {
                return;
            }
            mPendingRebind = true;
        }
        if (USE_CHOREOGRAPHER) {
            // 3
            mChoreographer.postFrameCallback(mFrameCallback);
        } else {
            // 4
            mUIThreadHandler.post(mRebindRunnable);
        }
    }
}
mFrameCallback = new Choreographer.FrameCallback() {
        @Override
        public void doFrame(long frameTimeNanos) {
            mRebindRunnable.run();
        }
    };
```

1. 如果mContainingBinding不为空，先执行requestRebind()；mContainingBinding就是你当前这布局是被mContainingBinding给include了（或者说mContainingBinding include当前布局）
2. 如果当前的State不是STARTED，那么return
3. API大于等于16，走这里，用编舞者post一个FrameCallback协调vsync信号，FrameCallback就是mRebindRunnable
4. API小于16，通过post一个mRebindRunnable

接着看`mRebindRunnable`：

```java
private final Runnable mRebindRunnable = new Runnable() {
    @Override
    public void run() {
        synchronized (this) {
            mPendingRebind = false;
        }
        processReferenceQueue();
        if (VERSION.SDK_INT >= VERSION_CODES.KITKAT) {
            // Nested so that we don't get a lint warning in IntelliJ
            if (!mRoot.isAttachedToWindow()) {
                // Don't execute the pending bindings until the View
                // is attached again.
                mRoot.removeOnAttachStateChangeListener(ROOT_REATTACHED_LISTENER);
                mRoot.addOnAttachStateChangeListener(ROOT_REATTACHED_LISTENER);
                return;
            }
        }
        executePendingBindings();
    }
};
```

接着看`executePendingBindings()`

```java
public void executePendingBindings() {
    if (mContainingBinding == null) {
        executeBindingsInternal();
    } else {
        mContainingBinding.executePendingBindings();
    }
}
```

接着看`executeBindingsInternal()`

```java
private void executeBindingsInternal() {
    if (mIsExecutingPendingBindings) {
        requestRebind();
        return;
    }
    if (!hasPendingBindings()) {
        return;
    }
    mIsExecutingPendingBindings = true;
    mRebindHalted = false;
    if (mRebindCallbacks != null) {
        mRebindCallbacks.notifyCallbacks(this, REBIND, null);

        // The onRebindListeners will change mPendingHalted
        if (mRebindHalted) {
            mRebindCallbacks.notifyCallbacks(this, HALTED, null);
        }
    }
    if (!mRebindHalted) {
        executeBindings();
        if (mRebindCallbacks != null) {
            mRebindCallbacks.notifyCallbacks(this, REBOUND, null);
        }
    }
    mIsExecutingPendingBindings = false;
}
```

调用了到了`executeBindings()`，这是个抽象的方法，我们的布局都会生成XXXImple，如`AMainBindingImpl extends AMainBinding`

```java
public class AIncludBindingImpl extends AIncludBinding {
    @Override
    protected void executeBindings() {
        long dirtyFlags = 0;
        synchronized(this) {
            dirtyFlags = mDirtyFlags;
            mDirtyFlags = 0;
        }
        int catViewModelIsShowNameViewVISIBLEViewINVISIBLE = 0;
        me.hacket.assistant.samples.google.architecture.databinding.oneway.CatViewModel catViewModel = mCatViewModel;
        java.lang.String catViewModelNameGet = null;
        androidx.databinding.ObservableField<java.lang.String> catViewModelName = null;
        java.lang.String javaLangStringCatViewModelName = null;
        boolean catViewModelIsShowNameGet = false;
        androidx.databinding.ObservableBoolean catViewModelIsShowName = null;

        if ((dirtyFlags & 0x1eL) != 0) {
            if ((dirtyFlags & 0x1aL) != 0) {
                    if (catViewModel != null) {
                        // read catViewModel.name
                        catViewModelName = catViewModel.getName();
                    }
                    updateRegistration(1, catViewModelName);


                    if (catViewModelName != null) {
                        // read catViewModel.name.get()
                        catViewModelNameGet = catViewModelName.get();
                    }
                    // read ("主布局：") + (catViewModel.name.get())
                    javaLangStringCatViewModelName = ("主布局：") + (catViewModelNameGet);
            }
            if ((dirtyFlags & 0x1cL) != 0) {

                    if (catViewModel != null) {
                        // read catViewModel.isShowName()
                        catViewModelIsShowName = catViewModel.isShowName();
                    }
                    updateRegistration(2, catViewModelIsShowName);


                    if (catViewModelIsShowName != null) {
                        // read catViewModel.isShowName().get()
                        catViewModelIsShowNameGet = catViewModelIsShowName.get();
                    }
                if((dirtyFlags & 0x1cL) != 0) {
                    if(catViewModelIsShowNameGet) {
                            dirtyFlags |= 0x40L;
                    }
                    else {
                            dirtyFlags |= 0x20L;
                    }
                }


                    // read catViewModel.isShowName().get() ? View.VISIBLE : View.INVISIBLE
                    catViewModelIsShowNameViewVISIBLEViewINVISIBLE = ((catViewModelIsShowNameGet) ? (android.view.View.VISIBLE) : (android.view.View.INVISIBLE));
            }
        }
        // batch finished
        if ((dirtyFlags & 0x10L) != 0) {
            // api target 1

            this.btnChangeText.setOnClickListener(mCallback8);
            this.includeTest.setViewGone(true);
            this.includeTest.setCount(100);
        }
        if ((dirtyFlags & 0x18L) != 0) {
            // api target 1

            this.includeTest.setCatViewModel2(catViewModel);
        }
        if ((dirtyFlags & 0x1aL) != 0) {
            // api target 1

            me.hacket.assistant.samples.google.architecture.databinding.inverse.InverseMethodActivityKt.setText(this.tvNameOb2, javaLangStringCatViewModelName);
        }
        if ((dirtyFlags & 0x1cL) != 0) {
            // api target 1

            this.tvNameOb2.setVisibility(catViewModelIsShowNameViewVISIBLEViewINVISIBLE);
        }
        executeBindingsOn(includeTest);
    }
}
```

- 根据不同的dirtyFlags来执行setter操作
- 如果include其他的布局时，会执行`executeBindingsOn(includeTest);`includeTest就是被inlcude的布局的Binding

```java
protected static void executeBindingsOn(ViewDataBinding other) {
    other.executeBindingsInternal();
}
```

**dirtyFlags什么时候设置？**<br>在setter的时候设置的，`mDirtyFlags |= 0x4L` 是标志哪个属性变了，`notifyPropertyChanged(BR.workBean)`通知对应的model有变化。

```java
public void setWorkBean(@Nullable ObservableWorkBean WorkBean) {
    this.mWorkBean = WorkBean;
    synchronized (this) {
        mDirtyFlags |= 0x4L;
    }
    notifyPropertyChanged(BR.workBean);
    super.requestRebind();
}
```
