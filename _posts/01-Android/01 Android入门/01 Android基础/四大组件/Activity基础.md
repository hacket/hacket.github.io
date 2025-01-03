---
date created: Wednesday, August 14th 2024, 5:12:00 pm
date updated: Saturday, January 4th 2025, 12:27:25 am
title: Activity基础
dg-publish: true
image-auto-upload: true
feed: show
format: list
layout: post
categories: [Android]
tags: ['#0:', '#0', '#1:', '#2:', '#3:', '#59', '#62']
aliases: [Intent- 隐式 Intent 判断]
linter-yaml-title-alias: Intent- 隐式 Intent 判断
---

# Intent- 隐式 Intent 判断

## 判断隐式 intent 跳转是否有判断有匹配的 activity

### 1、resolveActivity

```java
Uri uri = Uri.parse(url);
Intent viewIntent = new Intent(Intent.ACTION_VIEW, uri);
if (mContext.getPackageManager().resolveActivity(viewIntent, PackageManager.MATCH_DEFAULT_ONLY) != null) {
    mContext.startActivity(viewIntent);
}
```

### 2、queryIntentActivities

android11 需要适配软件包可见性 `<queries/>`，

```java
Intent intentpic = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
    PackageManager pm=getPackageManager();
    List<ResolveInfo> activities=pm.queryIntentActivities(intentpic,0);
//  pm.resolveActivity(intent, 0); // 或者
    if(activities.size()<=0) {
        //不存在匹配跳转隐式intent的Activity
        ToastUtil.toastShow(PeopleDataActivity.this,"设备不支持拍照");
    } else {
        //存在匹配跳转隐式intent的Activity
        ToastUtil.toastShow(PeopleDataActivity.this,"设备支持拍照");    
    }
}
```

## IntentFilter 匹配规则

### Action 的匹配规则

- action 可以自定义
- action 在 Intent-filter 可以设置多条
- intent 中必须指定 action 否则匹配失败且 intent 中 action 最多只有一条
- intent 中的 action 和 intent-filter 中的 action 必须完全一样时（包括大小写）才算匹配成功
- intent 中的 action 只要与 intent-filter 其中的一条匹配成功即可

常见 action 如下 (Intent 类中的常量)：

1. `Intent.ACTION_MAIN`，标识 Activity 为一个程序的开始
2. `Intent.ACTION_VIEW`，显示用户的数据
3. `Intent.ACTION_DIAL`，用户拨号面板
4. `Intent.ACTION_SENDTO`，发送消息
5. `Intent.ACTION_PICK`，从列表中选择信息，一般用于选择联系人或者图片等
6. `Intent.ACTION_ANSWER`，处理呼入的电话
7. `Intent.ACTION_CHOOSER`，显示一个 Activity 选择器，比如常见的选择分享到哪里

```xml
<activity android:name=".MainActivity">
  <intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter>

  <intent-filter>
    <action android:name="com.jrmf360.action.ENTER"/>
    <action android:name="com.jrmf360.action.ENTER2"/>
    <category android:name="android.intent.category.DEFAULT"/>
  </intent-filter>
</activity>
```

下面的两个 intent 都可以匹配上面 MainActivity 的 action 规则：

```java
Intent intent = new Intent("com.jrmf360.action.ENTER");
startActivity(intent);

Intent intent2 = new Intent("com.jrmf360.action.ENTER2");
startActivity(intent2);
```

### category 的匹配规则

category 是一个字符串，系统预定义了一些 category，同时我们也可以在应用中定义自己的 category;<br />category 的匹配规则是：

- category 在 intent-filter 中可以有多条
- category 在 intent 中也可以有多条
- intent 中可以没有 category，但是如果一旦有 category，不管有几个，每个都要能够和过滤规则中的任何一个 category 匹配;
- intent 中所有的 category 都可以在 intent-filter 中找到一样的（包括大小写）才算匹配成功
- 通过 intent 启动 Activity 的时候如果没有添加 category 会自动添加 android.intent.category.DEFAULT，如果 intent-filter 中没有添加 android.intent.category.DEFAULT 则会匹配失败

> 这里可能感觉和 action 很像，但是只要稍微注意一下就可以发现 Intent 是 setAction 和 addCategory，也就是说 action 只有一个 (注意是一个 Intent 只有一个 action，但是一个 Activity 的 intent-filter 中可以有多个 action)，而 category 可以有很多个且所有的 category 都必须出现在 Activity 的 category 集中;

### data 的匹配规则

data 的匹配规则：

- intent-filter 中可以设置多个 data
- intent 中只能设置一个 data，且要和 intent-filter 中完全匹配
- intent-filter 中指定了 data，intent 中就要指定其中的一个 data
- setType 会覆盖 setData，setData 会覆盖 setType，因此需要使用 setDataAndType 方法来设置 data 和 mimeType

data 的语法格式

```xml
<data android:scheme="string" 
    android:host="string" 
    android:port="string" 
    android:path="string" 
    android:pathPattern="string" 
    android:pathPrefix="string" 
    android:mimeType="string" />
```

data 由两部分组成： mimeType 和 URI，URI 通过如下格式，包括 scheme、host、port、path、pathPrefix 和 pathPattern;

```
<scheme>://<host>:<port>/[<path>|<pathPrefix>|<pathPattern>]
```

具体的参数解释:

- mimeType：指媒体类型，比如 image/jpeg、audio/mpeg4-generic、vidio/等，可以表示图片、文本、视频等不同的媒体格式;
- scheme：URI 的模式，如 http、file、content 等，如果 URI 中没有指定 scheme，那么整个 URI 的其他参数无效，这也意味着 URI 是无效的;
- host：URI 的主机名，如 blog.csdn.net，如果 host 未指定，那么整个 URI 中的其他参数无效，这也意味着 URI 是无效的;
- port：URI 中的端口号，比如 80，进档 URI 中指定了 scheme 和 host 参数的时候，port 参数才是有意义的;
- path：表述路径的完整信息;
- pathPrefix：表述路径的前缀信息;
- pathPattern：表述路径的完整信息，但它里面可以包含通配符 * ，表示 0 个或任意字符;

**data 的注意事项**

1. URI 可以不设置，但如果设置了，则 scheme 和 host 属性必须要设置;
2. URI 的 scheme 属性有默认值，默认值为 content 或者 file，因此，就算在 intent-filter 中没有为 data 设置 URI，也需要在匹配的时候设置 scheme 和 host 两个属性，且 scheme 属性的值必须是 content 或者 file;

```java
<intent-filter> 
<action android:name="xx" /> 
    <category android:name="android.intent.category.DEFAULT" /> 
    <data 
        android:host="www.baidu.com" 
        android:pathPrefix="/imgs" 
        android:port="8080" 
        android:scheme="https" /> 
</intent-filter> 

Intent intent = new Intent(); 
intent.setData(Uri.parse("https://www.baidu.com:8080/imgs/img1.png")); 
startActivity(intent);
```

### IntentFilter 总结

#### 1、IntentFilter 匹配优先级

查看 Intent 的过滤器 (intent-filter)，按照以下优先关系查找：`action->data->category`;

#### 2、隐式 intent

每一个通过 startActivity() 方法发出的隐式 Intent 都至少有一个 category，就是 `android.intent.category.DEFAULT`，所以只要是想接收一个隐式 Intent 的 Activity 都应该包括 `android.intent.category.DEFAULT` category，不然将导致 Intent 匹配失败

# Activity 的生命周期

Activity 常用的生命周期有以下七个，onCreate、onRestart、onStart、onResume、onPause、onStop、onDestroy。

- onCreate 和 onDestory<br />分别代表了一个 Activity 的创建和销毁、第一个生命周期和最后一个生命周期回调，期间包裹了一个完整 (entire lifetime) 的 Activity 生命周期。
  - onCreate 只调用一次；用来初始化一些总体资源比如 setContentView 或加载一些关于这个 Activity 的全局数据
- onStart 和 onStop<br />分别代表了 Activity 已经处于可见状态和不可见状态，此时的 Activity 未处在前台，不可以与用户交互，可多次被调用，期间 Activity 处于可见 (visible lifetime) 状态。
  - onStart 会被重复调用；可以加载一些当 Activity 可见时才需要加载的数据或者注册一个广播，监听 UI 的变化来刷新界面
- onResume 和 onPause<br />分别代表了 Activity 已经进入前台获得焦点和退出前台失去焦点，此时的 Activity 是可以和用户交互的，可多次被调用，期间的 Activity 处于前台 (foreground lifetime) 状态。
  - onResume 当 Activity 获取焦点时被调用，可多次调用；只做一些轻量级的数据加载和布局。
  - onPause 不能进行耗时的操作或重量级的释放操作，会影响下一个 Activity 进入前台与用户交互（只有 onPause 方法调用完毕，下一个 Activity 的 onStart 才会调用）；无论出现什么情况，比如程序突然死亡，能保证的就是 onPause 方法一定会调用，onStop 和 onDestroy 不一定，所以 onPause 是持久化相关数据最后的可靠时机
- onRestart<br />表示 Activity 正在重新启动，正常状态下，Acitivty 调用了 onPause–onStop 但是并没有被销毁，重新显示此 Activity 时，onRestory 会被调用。

## 不同场景的 Activity 生命周期回调

### 1、完整的 Activity 生命周期流转

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1677685183527-7c4f6ed4-3439-430a-b453-b291ebfba129.png#averageHue=%23f5f2ef&clientId=u4a3dd028-c1a4-4&from=paste&id=uaef81efd&originHeight=681&originWidth=529&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uce233ac9-7b56-4698-9e43-97f9566ca57&title=)

### 2、Activity 第一次启动

onCreate -> onStart -> onResume

### 3、打开新 Activity 或按 Home 键

onPause->onStop

> 如果新的 Activity 的 Theme 为 Dialog 或者 Translucent（透明）时不会调用 onStop 方法

### 4、再次回到 Activity

onRestart->onStart->onResume

### 5、按 Back 键退出 Activity

onPause->onStop->onDestroy

### 6、AActivity 启动 BActivity

1. AActivity 已经可见了，然后启动 BActivity

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676871573767-c2f561d4-34f4-4d85-8670-db90034a0c21.png#averageHue=%23302e2d&clientId=u10e332dd-6587-4&from=paste&height=127&id=u9626371b&originHeight=145&originWidth=357&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=9199&status=done&style=none&taskId=u784c4a74-985f-4d44-961d-63dc5fee71f&title=&width=312)

2. 从 BActivity 返回到 AActivity

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676871595682-1e5ef803-bf50-4b1b-b7e3-62deb3e98ae3.png#averageHue=%232a2a2a&clientId=u10e332dd-6587-4&from=paste&height=167&id=ue7ac4a22&originHeight=284&originWidth=551&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=49661&status=done&style=none&taskId=u4e0d42d1-49f8-4b5b-a886-fd5f14e188e&title=&width=324.3333435058594)<br />![ActivityB启动ActivityA并返回到ActivityB](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1676872156392-b1554f15-1a3b-4513-bba7-02b3340ab4c6.jpeg#averageHue=%23fefdf9&clientId=u10e332dd-6587-4&from=paste&id=u4df6d88a&originHeight=446&originWidth=640&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u9c4df3d5-99a4-4950-92d6-95c99382590&title=ActivityB%E5%90%AF%E5%8A%A8ActivityA%E5%B9%B6%E8%BF%94%E5%9B%9E%E5%88%B0ActivityB "ActivityB启动ActivityA并返回到ActivityB")

## onRestart 触发的情况

Activity 已经启动了，未杀死 App，此时 App 已经切换到其他 App，再从其他 App 切换回来，会调用 onRestart()

1. 按下 Home 键后，然后切换回来，会调用 onRestart()
2. 从本 Activity 跳转到另一个 Activity 后，按 back 键返回到原来的 Activity，会调用 onRestart()
3. 从本 Activity 切换到其他应用，然后再从其他应用切换回来，会调用 onRestart()

## onNewIntent() 方法何时会被调用？

**前提：**在该 Activity 的实例已经存在于 Task 或 Back stack 中，当使用 intent 来再次启动该 Activity 的时候，如果此次启动不创建该 Activity 实例，则系统会调用原有的实例的 onNewIntent() 方法来处理此 intent。<br />且在下面情况下系统不会创建该 Activity 的新实例：

1. 如果该 Activity 在 Manifest 中的 android:launchMode 定义为 singleTask 或者 singleInstance
2. 如果该 Activity 在 Manifest 中的 android:launchMode 定义为 singleTop 且该实例位于 Back stack 的栈顶
3. ,如果该 Activity 在 Manifest 中的 android:launchMode 定义为 singleTop,且上述 intent 包含 Intent.FLAG_ACTIVITY_CLEAR_TOP 标志
4. 如果上述 intent 中包含 Intent.FLAG_ACTIVITY_CLEAR_TOP 标志和且包含 Intent.FLAG_ACTIVITY_SINGLE_TOP 标志
5. 如果上述 intent 中包含 Intent.FLAG_ACTIVITY_SINGLE_TOP 标志且该实例位于 Back stack 的栈顶

## onActivityResult 的生命周期

从 dest Activity 获取 result 后，返回 src Activity 时，先回调 src 的 onActivityResult，再回调 src Activity 的 onResume/onStart。<br />如果需要在 onActivityResult 中做一些判断前后台的逻辑，可能会出问题。

> 启动 srcActivity，从 dstActivity 获取 result，并返回到 srcActivity 生命周期：
> srcActivity onCreate
> srcActivity onStart
> srcActivity onResume
> srcActivity onPause
> dstActivity onCreate
> dstActivity onStart
> dstActivity onResume
> srcActivity onStop
> dstActivity onPause
> srcActivity onActivityResult
> srcActivity onRestart
> srcActivity onStart
> srcActivity onResume
> dstActivity onStop
> dstActivity onDestroy

## onSaveInstanceState 方法在 Activity 的哪两个生命周期方法之间调用？

其实 onSaveInstanceState 方法与 onPause 方法的调用顺序没有先后之分，你需要记住的是，onSaveInstanceState 一定在 onStop 方法之前调用。

## 弹出一个 Dialog 时，onPause 会调用吗？什么情况下会，什么情况下不会？

不会

## onNewIntent: Activity 启动之后获取不到上个页面传过来的 intent 解决方法

当我们用 startActivity（intent）方法开启一个新的 activity 的时候，intent 总是能正常获取到的，但是如果开启一个已经存在的 activity，并且这个 activity 设置启动模式不是标准启动模式，比如是**singleTask**模式，那么我们启动的时候就不是新创建一个 activity 而是把之前 activity 的示例移到栈顶，这时候就会出现获取不到我们想要的 intent 中所传数据的情况。<br />首先我们看下源码中 getIntent 方法的注释：

```java
/** Return the intent that started this activity. */
public Intent getIntent() {
    return mIntent;
}
```

源码中注释说明：通过 getIntent 获取到的是 activity 创建时候的意图 intent，并且会把这个意图保存下来，之后如果在 activity 从后台调出到前台，用 getIntent 方法获取到的始终是之前锁保存的意图。<br />在要通过 getIntent 获取到 intent 的 activity 中重写如下方法：

```java
//此方法在onResume之前执行
@Override
protected void onNewIntent(Intent intent) {
    //每次重新到前台就主动更新intent并保存，之后就能获取到最新的intent
    setIntent(intent);
    super.onNewIntent(intent);
}
```

setIntent 方法是专门修改通过 getIntent 方法所获取到的 intent 的。

## moveTaskToBack

在 activity 中调用 `moveTaskToBack (boolean nonRoot)` 方法即可将 activity 退到后台，注意不是 finish() 退出。<br />参数说明：

- 参数为 false——代表只有当前 activity 是 task 根，指应用启动的第一个 activity 时，才有效;
- 参数为 true——则忽略这个限制，任何 activity 都可以有效。

说明：判断 Activity 是否是 task 根，Activity 本身给出了相关方法：`isTaskRoot()`

## Activity 之 configChanges 配置

如果 `android:configChanges` 属性没有指定特定的选项，当配置发生改变后就会导致 Activity 重新创建。配置了 configChanges 属性，Activity 不会重新创建，也不会调用 `onSaveInstanceState()` 和 `onRestoreInstanceState()` 方法来存储和恢复数据，而是调用了 `onConfigurationChanged()` 方法，这个时候我们就可以做一些特殊的处理了。

### configChanges 常用配置

- orientation<br />屏幕方向发生了改变，这个是最常用的，比如旋转了手机屏幕
- locale<br />设备的本地位置发生了改变，一般指切换了系统语言
- keyboardHidden<br />键盘的可访问性发生了变化，比如用户调出了键盘
- screenSize<br />当屏幕的尺寸信息发生了改变，当旋转设备屏幕时，屏幕尺寸会发生变化，这个选项比较特殊，它和编译选项有关，当编译选项中的 minSdkVersion 和 targetSdkVersion 均低于 13 时，此选项不会导致 Activity 重启，大于等于 13 会导致 Activity 重启

## Activity 执行 finish 后 10 秒后才调用 onStop 方法

现象：ActivityA 执行 finish 后，进入 ActivityB<br />原因：ActivityA 页面有个 View 动画在不停的跑，导致 ActivityA 的 onPause 和 onDestroy 得不到及时执行<br />分析：

- ActivityA 页面执行了 Animation 动画，由于动画是 INFINITE，所以 Animation 会无限的往 MQ 里发送绘制 UI 的消息
- ActivityA 页面执行 finish 操作，ActivityA 进入 onPause 状态
- 然后寻找下一个即将 Resume 的 ActivityB，进入 Resume 状态
- 发送一个延迟 10 秒的消息进入 MQ 中，这个消息用来执行 ActivityA 的 onStop 和 onDestroy 操作
- 发送一个 Idler 对象，在 MQ 空闲的时候执行 ActivityA 的 onStop 和 onDestroy 操作，并移除 10 秒的延迟消息
- 由于 MQ 一直有消息在执行，所以 Idler 对象没有执行的时机，10 秒后延迟的消息会执行 onStop

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678721564247-ca2e9684-5d8d-4138-940e-a40c865ebaf7.png#averageHue=%23f5f5f5&clientId=u372109f6-614f-4&from=paste&id=u59688c3f&originHeight=682&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=108527&status=done&style=none&taskId=ub4a9b646-e876-46cb-a2c2-7da476474ae&title=)<br />解决：

1. 进入 onPause 时暂停 Animation，onResume 时恢复动画
2. Animation 替换成 ValueAnimation，属性动画不会导致 Activity 的生命周期延迟执行

- [ ] [Android高级进阶:从源码对调用Activity.finish()之后10s才onDestroy问题详细分析](https://mp.weixin.qq.com/s/lglcd8hwJF9SeEXkuMSfkQ)
- [ ] [面试官：为什么 Activity.finish() 之后 10s 才 onDestroy ？](https://juejin.cn/post/6898588053451833351?utm_source=gold_browser_extension)

## finish 和 onBackPressed？

- 没有弹框，没有菜单，没有共享变换，finish 和 onBackPressed 是完全一样的
- 存在弹框、菜单等，onBackPressed 要先关闭 popWindow
- 存在共享变化（Shared Element Transition），finish 不会调用变换动画，必须使用 onBackPressed 方法

finish 源码：

```java
public void finish() {
    finish(DONT_FINISH_TASK_WITH_ACTIVITY);
}
private void finish(int finishTask) {
    if (mParent == null) {
        int resultCode;
        Intent resultData;
        synchronized (this) {
            resultCode = mResultCode;
            resultData = mResultData;
        }
        if (false) Log.v(TAG, "Finishing self: token=" + mToken);
        if (resultData != null) {
            resultData.prepareToLeaveProcess(this);
        }
        if (ActivityClient.getInstance().finishActivity(mToken, resultCode, resultData,
                finishTask)) {
            mFinished = true;
        }
    } else {
        mParent.finishFromChild(this);
    }

    getAutofillClientController().onActivityFinish(mIntent);
}
```

直接调用 ActivityClient.getInstance().finishActivity(mToken, resultCode, resultData, finishTask) 来 finish activity<br />onBackPressed 源码：

```java
@Deprecated
public void onBackPressed() {
    if (mActionBar != null && mActionBar.collapseActionView()) {
        return;
    }

    FragmentManager fragmentManager = mFragments.getFragmentManager();

    if (!fragmentManager.isStateSaved() && fragmentManager.popBackStackImmediate()) {
        return;
    }
    navigateBack();
}

private void navigateBack() {
    if (!isTaskRoot()) {
        // 如果没有回退的共享变换，直接执行finish()。
        // If the activity is not the root of the task, allow finish to proceed normally.
        finishAfterTransition();
        return;
    }
    // Inform activity task manager that the activity received a back press while at the
    // root of the task. This call allows ActivityTaskManager to intercept or move the task
    // to the back.
    ActivityClient.getInstance().onBackPressedOnTaskRoot(mToken,
            new RequestFinishCallback(new WeakReference<>(this)));

    getAutofillClientController().onActivityBackPressed(mIntent);
}
```

onBackPressed 方法，会先判断是否有弹出的窗口，popWindow，比如 dialog，比如菜单，等等，如果有，先关闭这些。<br />如果没有再来进行关闭操作。

# 任务栈和 launchMode 启动模式

## 任务栈 Task

任务栈 Task，是一种用来放置 Activity 实例的容器，他是以栈的形式进行盛放，也就是所谓的先进后出，主要有 2 个基本操作：压栈和出栈，其所存放的 Activity 是**不支持重新排序**的，只能根据压栈和出栈操作更改 Activity 的顺序。

启动一个 Application 的时候，系统会为它默认创建一个对应的 Task，用来放置根 Activity。默认启动 Activity 会放在同一个 Task 中，新启动的 Activity 会被压入启动它的那个 Activity 的栈中，并且显示它。当用户按下回退键时，这个 Activity 就会被弹出栈，按下 Home 键回到桌面，再启动另一个应用，这时候之前那个 Task 就被移到后台，成为后台任务栈，而刚启动的那个 Task 就被调到前台，成为前台任务栈，Android 系统显示的就是前台任务栈中的 Top 实例 Activity。

> 默认情况下，所有 Activity 所需的任务栈的名字为应用的包名。

- 前台任务栈
- 后台任务栈

## 启动模式 launchMode

![Activity launch mode.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1683337572980-5776ba32-d716-4489-a382-7d1f23ed0f6a.jpeg#averageHue=%23434448&clientId=u716f22e6-f28d-4&from=ui&id=Ild6j&originHeight=1920&originWidth=2071&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=306095&status=done&style=none&taskId=u322c2414-1f04-4c7a-a630-0a169cea385&title=)<br />系统提供了两种方式来设置一个 Activity 的启动模式，除了在 `AndroidManifest` 文件中设置以外，还可以通过 `Intent的Flag` 来设置一个 Activity 的启动模式。

### standard

标准的，默认的启动模式。<br />谁启动了这个 Activity，这个 Activity 就运行在启动它的那个 Activity 所在的栈中（用 Context 启动 Activity 会报错，因为 Context 没有任务栈，需要为待启动的 Activity 加上 `FLAG_ACTIVITY_NEW_TASK` 标记位，这样启动的时候就会为它创建一个新的任务栈，这个时候待启动 Activity 实际上是以 singleTask 启动的）<br />默认模式，可以不用写配置。在这个模式下，都会默认创建一个新的实例。因此，在这种模式下，可以有多个相同的实例，也允许多个相同 Activity 叠加。应用场景：绝大多数 Activity。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687795233886-de4a9672-dcca-493b-9b29-b59874917de6.png#averageHue=%23f4c7b7&clientId=u4ea8b224-9c91-4&from=paste&height=400&id=u9d047312&originHeight=924&originWidth=1273&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=135104&status=done&style=none&taskId=u4f64e380-38e1-45da-99e9-55eb5216172&title=&width=551)

> 如果以这种方式启动的 Activity 被跨进程调用，在 5.0 之前新启动的 Activity 实例会放入发送 Intent 的 Task 的栈的顶部，尽管它们属于不同的程序，这似乎有点费解看起来也不是那么合理，所以在 5.0 之后，也是放入启动它的 Intent 的任务栈用

> 5.0+ 后启动另外一个 App 为 standard/singleTop

### singleTop

**栈顶复用模式**，如果要开启的 activity 在任务栈的顶部已经存在，就不会创建新的实例，而是调用 `onNewIntent()` 方法。避免栈顶的 activity 被重复的创建。<br />应用场景：在通知栏点击收到的通知，然后需要启动一个 Activity，这个 Activity 就可以用 singleTop，否则每次点击都会新建一个 Activity。当然实际的开发过程中，测试妹纸没准给你提过这样的 bug：某个场景下连续快速点击，启动了两个 Activity。如果这个时候待启动的 Activity 使用 singleTop 模式也是可以避免这个 Bug 的。

> 同 standard 模式，如果是外部程序启动 singleTop 的 Activity，在 Android 5.0 之前新创建的 Activity 会位于调用者的 Task 中，5.0 及以后一样

### singleTask

**栈内复用模式**， activity 只会在任务栈里面存在一个实例。如果要激活的 activity，在任务栈里面已经存在，就不会创建新的 activity，而是复用这个已经存在的 activity，调用 `onNewIntent()` 方法，并且清空这个 activity 任务栈上面所有的 activity。<br />应用场景：大多数 App 的主页。对于大部分应用，当我们在主界面点击回退按钮的时候都是退出应用，那么当我们第一次进入主界面之后，主界面位于栈底，以后不管我们打开了多少个 Activity，只要我们再次回到主界面，都应该使用将主界面 Activity 上所有的 Activity 移除的方式来让主界面 Activity 处于栈顶，而不是往栈顶新加一个主界面 Activity 的实例，通过这种方式能够保证退出应用时所有的 Activity 都能报销毁。

在跨应用 Intent 传递时，如果系统中不存在 singleTask Activity 的实例，那么将创建一个新的 Task，然后创建 SingleTask Activity 的实例，将其放入新的 Task 中。

> 跨应用开启 singleTask 的，会放入到新的任务栈中

- SingleTask 与 android.intent.action.MAIN 的坑<br />无论打开多少页面，将应用推至后台再启动就回到了主页；这是由于主页配置了 singleTask，每次点击桌面都是启动主页，那么就会将主页上面的 Activity 全部清理掉。<br />解决：

```
解决方法： 
1、singleTask换成singleTop，如果需要清除栈，使用intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

2、使用一个空的Activity配置android.intent.action.MAIN，启动后跳转MainActivity。
```

### singleInstance

**单一实例模式**，整个手机操作系统里面只有一个实例存在。不同的应用去打开这个 activity  共享公用的同一个 activity。他会运行在自己单独，独立的任务栈里面，并且任务栈里面只有他一个实例存在。

应用场景：呼叫来电界面。这种模式的使用情况比较罕见，在 Launcher 中可能使用。或者你确定你需要使 Activity 只有一个实例。建议谨慎使用。

某些版本手机在设置 activity 模式为 singleInstance 模式下的时候，会默认自带一个放缩的切换动画，跟其他切换动画不协调，此时解决如下：将所有的 activity 都设置动画，覆盖掉默认的。

### Ref

- 我打赌你一定没搞明白的 Activity 启动模式<br /><https://www.jianshu.com/p/2a9fcf3c11e4>

## Intent flags

### 常见的 flags

#### FLAG_ACTIVITY_NEW_TASK

使用一个新的 Task 来启动一个 Activity，但启动的每个 Activity 都讲在一个新的 Task 中。该 Flag 通常使用在从 Service 中启动 Activity 的场景，由于 Service 中并不存在 Activity 栈，所以使用该 Flag 来创建一个新的 Activity 栈，并创建新的 Activity 实例。

首先会查找是否存在和被启动的 Activity 具有相同的亲和性的任务栈（即 taskAffinity，注意同一个应用程序中的 activity 的亲和性相同），如果有，则直接把这个栈整体移动到前台，并保持栈中旧 activity 的顺序不变，然后被启动的 Activity 会被压入栈，如果没有，则新建一个栈来存放被启动的 activity，注意，默认情况下同一个应用中的所有 Activity 拥有相同的关系 (taskAffinity)

- [ ] Android 面试官装逼失败之：Activity 的启动模式<br /><https://juejin.im/post/59b0f25551882538cb1ecae1>

> 有点深入

##### FLAG_ACTIVITY_NEW_TASK 理解

首先会查找是否存在和被启动的 Activity 具有相同的亲和性的任务栈（即 taskAffinity，注意同一个应用程序中的 activity 的亲和性相同），如果有，则直接把这个栈整体移动到前台，并保持栈中旧 activity 的顺序不变，然后被启动的 Activity 会被压入栈，如果没有，则新建一个栈来存放被启动的 activity，注意，默认情况下同一个应用中的所有 Activity 拥有相同的关系 (taskAffinity).

1. 如果目标 Activity 设置了 `FLAG_ACTIVITY_NEW_TASK`，且没有设置 `android:taskAffinity` 属性，那么默认 App 所有的 Activity 都具有相同的 taskAffinity，已经存在了任务栈了，那么目标 Activity 将直接入栈
2. 如果已经设置了 taskAffinity，看该 task stack 是否存在，存在即入栈；不存在，创建，入栈

> 默认情况下同一个应用中的所有 Activity，都拥有相同的关系 (taskAffinity)，即由 FLAG_ACTIVITY_NEW_TASK 开启的新 Activity，也都在同一个任务栈中（与 Application 相同的任务栈），若想使新 Activity 进入不同栈中，则还需要如下配置：

```xml
<activity
  android:name=".ui.activity.OtherTaskActivityXXX"
  android:taskAffinity="android.task.browser"/> //注意这里的 taskAffinity
```

并且在该 OtherTaskActivityXXX 页面中，若再开启的其他页面，那么所有的其他页面，都将被压入到这个新的任务栈中。

##### 为什么非 Activity 启动 Activity 要强制规定使用参数 FLAG_ACTIVITY_NEW_TASK

如果不是在 Activity 中启动的，那就可以看做不是用户主动的行为，也就说这个界面可能出现在任何 APP 之上，如果不用 `Intent.FLAG_ACTIVITY_NEW_TASK` 将其限制在自己的 Task 中，那用户可能会认为该 Activity 是当前可见 APP 的页面，这是不合理的。举个例子：我们在听音乐，这个时候如果邮件 Service 突然要打开一个 Activity，如果不用 Intent.FLAG_ACTIVITY_NEW_TASK 做限制，那用户可能认为这个 Activity 是属于音乐 APP 的，因为用户点击返回的时候，可能会回到音乐，而不是邮件（如果邮件之前就有界面）。

#### FLAG_ACTIVITY_SINGLE_TOP

使用 singletop 模式启动一个 Activity，与指定 android：launchMode="singleTop" 效果相同。

#### FLAG_ACTIVITY_CLEAR_TOP

使用 SingleTask 模式来启动一个 Activity，与指定 android：launchMode="singleTask" 效果相同。

#### FLAG_ACTIVITY_NO_HISTORY

Activity 使用这种模式启动 Activity，当该 Activity 启动其他 Activity 后，该 Activity 就消失了，不会保留在 Activity 栈中。

#### FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS

具有这个标记的 Activity，不会出现在历史 Activity 列表中；等同于 xml 中配置 `android:excludeFromRecents="true"`

## taskAffinity

### 查看 Activity 信息（dumpsys activity）

- adb shell dumpsys activity

查看 `me.hacket.assistant`Activity 的信息：

```
adb shell dumpsys activity a me.hacket.assistant
```

信息解读：

```java
ACTIVITY MANAGER ACTIVITIES (dumpsys activity activities)
Display #0 (activities from top to bottom): // activity从顶部到底部
  Stack #3:  
    Task id #62 // 任务栈id:62
    * TaskRecord{8e9856f #62 A=me.hacket.assistant U=0 sz=4} // 任务栈描述，A代表taskAffinity
      userId=0 effectiveUid=u0a63 mCallingUid=u0a63 mCallingPackage=me.hacket.assistant
      affinity=me.hacket.assistant
      intent={act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] flg=0x10000000 cmp=me.hacket.assistant/.home.splash.MonkeySplashActivity}
      realActivity=me.hacket.assistant/.home.splash.MonkeySplashActivity
      autoRemoveRecents=false isPersistable=true numFullscreen=4 taskType=0 
      //...
      * Hist #3: ActivityRecord{e35b602 u0 me.hacket.assistant/.samples.learning.activity.taskAffinity.ActivitytaskAffinity t62}
          packageName=me.hacket.assistant processName=me.hacket.assistant
      //...
      * Hist #0: ActivityRecord{4213af0 u0 me.hacket.assistant/.home.HomeActivity t62}
          packageName=me.hacket.assistant processName=me.hacket.assistant

          mActivityType=APPLICATION_ACTIVITY_TYPE
          waitingVisible=false nowVisible=false lastVisibleTime=-2m18s63ms

    Running activities (most recent first):
      TaskRecord{8e9856f #62 A=me.hacket.assistant U=0 sz=4}
        Run #3: ActivityRecord{e35b602 u0 me.hacket.assistant/.samples.learning.activity.taskAffinity.ActivitytaskAffinity t62}
        Run #2: ActivityRecord{1dccf11 u0 me.hacket.assistant/.samples.learning.activity.组件Activity t62}
        Run #1: ActivityRecord{6314020 u0 me.hacket.assistant/.samples.learning.LearningActivity t62}
        Run #0: ActivityRecord{4213af0 u0 me.hacket.assistant/.home.HomeActivity t62}

    mResumedActivity: ActivityRecord{e35b602 u0 me.hacket.assistant/.samples.learning.activity.taskAffinity.ActivitytaskAffinity t62}
    mLastPausedActivity: ActivityRecord{1dccf11 u0 me.hacket.assistant/.samples.learning.activity.组件Activity t62}

  Stack #0:
    Task id #59
    * TaskRecord{4269705 #59 I=com.android.launcher3/.Launcher U=0 sz=1}
      userId=0 effectiveUid=u0a8 mCallingUid=0 mCallingPackage=null
      intent={act=android.intent.action.MAIN cat=[android.intent.category.HOME] flg=0x10000000 cmp=com.android.launcher3/.Launcher}
      //...
    Running activities (most recent first):
      TaskRecord{4269705 #59 I=com.android.launcher3/.Launcher U=0 sz=1}
        Run #0: ActivityRecord{741127e u0 com.android.launcher3/.Launcher t59}

    mLastPausedActivity: ActivityRecord{741127e u0 com.android.launcher3/.Launcher t59}

  mFocusedActivity: ActivityRecord{e35b602 u0 // 当前处于前台的Activity me.hacket.assistant/.samples.learning.activity.taskAffinity.ActivitytaskAffinity t62}
  mFocusedStack=ActivityStack{9b3098b stackId=3, 1 tasks} mLastFocusedStack=ActivityStack{9b3098b stackId=3, 1 tasks}
  mSleepTimeout=false
  mCurTaskId=62
  mUserStackInFront={}
  mActivityContainers={0=ActivtyContainer{0}A, 3=ActivtyContainer{3}A}
  mLockTaskModeState=NONE mLockTaskPackages (userId:packages)=
    0:[]
 mLockTaskModeTasks[]
```

### allowTaskReparenting

它的主要作用是 activity 的迁移，即从一个 task 迁移到另一个 task，这个迁移跟 activity 的 taskAffinity 有关。当 allowTaskReparenting 的值为 "true" 时，则表示 Activity 能从启动的 Task 移动到有着 affinity 的 Task（当这个 Task 进入到前台时），当 allowTaskReparenting 的值为 "false"，表示它必须呆在启动时呆在的那个 Task 里。如果这个特性没有被设定，元素 (当然也可以作用在每次 activity 元素上) 上的 allowTaskReparenting 属性的值会应用到 Activity 上。默认值为 "false"。这样说可能还比较难理解，我们举个例子，比如现在有两个应用 A 和 B，A 启动了 B 的一个 ActivityC，然后按 Home 键回到桌面，再单击 B 应用时，如果此时，allowTaskReparenting 的值为 "true"，那么这个时候并不会启动 B 的主 Activity，而是直接显示已被应用 A 启动的 ActivityC，我们也可以认为 ActivityC 从 A 的任务栈转移到了 B 的任务栈中

1. 只对启动的 Activity（设置为 allowTaskReparenting 的 Activity 只能是 standard 和 singleTop 模式）

<https://juejin.im/entry/57ac05858ac247005fec2ca1>

### taskAffinity 解读

#### taskAffinity 在下面两种情况时会产生效果

- taskAffinity 与 FLAG_ACTIVITY_NEW_TASK 或者 singleTask 配合。如果新启动 Activity 的 taskAffinity 和栈的 taskAffinity 相同则加⼊到该栈中；如果不同，就会创建新栈
- taskAffinity 与 allowTaskReparenting 配合。如果 allowTaskReparenting 为 true ，说明 Activity 具有转移的能力。举个例⼦：当社交应⽤启动了发送邮件的 Activity ，此时发送邮件的 Activity 就是和社交应⽤处于同⼀个栈中的，并且这个栈位于前台。如果发送邮件的 Activity 的 allowTaskReparenting 设置为 true ，此后 E-mail 应⽤所在的栈位于前台时，发送邮件的 Activity 就会由社交应⽤的栈中转移到与它更亲近的邮件应⽤ ( taskAffinity 相同）所在的栈中。

`android:taskAffinity` ，默认是应用包名，可以指定不是包名；需要和 `android:allowTaskReparenting` 属性或者 singleTask 启动模式配对使用，其他情况没有意义

#### taskAffinity 特性

1. 如果不指定 taskAffinity 属性，应用程序的所有 Activity 都存放于默认 task（singleInstance 启动的 activity 除外，因为 singleInstance 启动的 activity 独占一个 task）
2. 指定 taskAffinity，只有当 Activity 设置 `FLAG_ACTIVITY_NEW_TASK` 才起作用，否则不起作用。（注意：`singleInstance` 和 `singleTask` 启动的 activity 默认是设置了 `FLAG_ACTIVITY_NEW_TASK` 的 FLAG 的）
3. 默认 Activity 的 `taskAffinity` 是 App 的 `applicationId`
4. 会启动一个新的 task，但其 taskAffinity 还是 App 的 applicationId
5. 指定 taskAffinity，`singleTask/singleInstance` 有效；`standard和singleTop` 当且仅当 Activity 设置 FLAG_ACTIVITY_NEW_TASK 才起作用，否则不起作用
6. 在指定的 taskAffinity 生效后，在这基础上启动的 launchMode 为 `standard/singleTop`Activity 都是在该 taskAffinity 的 task 中；如果启动的是 `singleTask` 的不在该该 task 中，它还是在默认的 task 任务栈中；如果启动的是 `singleInstance`，任何时刻都是新开一个任务栈，设置什么都没用，总是独占一个任务栈。如果需要将启动的 `singleTask` 也纳入到任务栈中，需要添加和启动自己 Activity 的一样的 `taskAffinity` 并设置 `allowTaskReparenting=true`；

#### taskAffinity 注意

1. `android:taskAffinity=""` 属性要么指定为空，要么要以 `.` 分<br />隔，如果这样赋值 android:taskAffinity="test"，会报错
2. 配置了 `taskAffinity` 和 `singleTask/singleInstance` 生效后，切换 Activity 会有动效

- 我打赌你一定没搞明白的 Activity 启动模式<br /><https://www.jianshu.com/p/2a9fcf3c11e4>

### 清空返回栈

如何用户将任务切换到后台之后过了很长一段时间，系统会将这个任务中除了最底层的那个 Activity 之外的其它所有 Activity 全部清除掉。当用户重新回到这个任务的时候，最底层的那个 Activity 将得到恢复。这个是系统默认的行为，因为既然过了这么长的一段时间，用户很有可能早就忘记了当时正在做什么，那么重新回到这个任务的时候，基本上应该是要去做点新的事情了。<br />当然，既然说是默认的行为，那就说明我们肯定是有办法来改变的，在 `<activity>` 元素中设置以下几种属性就可以改变系统这一默认行为：

#### clearTaskOnLaunch

这个属性用来标记是否从 task 清除除 `根Activity` 之外的所有的 Activity，"true" 表示清除，"false" 表示不清除，默认为 "false"。同样，这个属性也只对根 Activity 起作用，其他的 Activity 都会被忽略。<br />如果设置了这个属性为 "true"，每次用户重新启动这个应用时，都只会看到根 Activity，task 中的其他 Activity 都会被清除出栈。如果我们的应用中引用到了其他应用的 Activity，这些 Activity 设置了 allowTaskReparenting 属性为 "true"，则它们会被重新宿主到有共同 affinity 的 task 中。<br />小结：

1. 只作用于根 Activity，其他 Activity 无效
2. 最近列表回到 App，还是回到其他页面；从桌面点击 App 图标将回到根 Activity
3. 设置了 `allowTaskReparenting` 将回到宿主 task 中去

案例：

```
假设有A,B两个Activity，在AndroidManifest.xml中将A Activity的设置了android:clearTaskOnLaunch="true"。

然后A中的操作启动了B，进入了B：

1）如果此时用户按了Home键回到主屏幕上，然后又点击了主屏幕上的A的icon图标启动应用。那么此时不是进入B，而是进入了A。

（2）如果用户按了屏幕下方的”最近任务列表“键，调出最近任务列表中，出现的是B，用户点击，此时又进入的是B。

 以上就是设置了android:clearTaskOnLaunch="true"后的Activity运行的细微差别。属性android:clearTaskOnLaunch，顾名思义，就是说，当设置此属性为true时候，每一次启动此Activity后，将清空以此Activity为根的Task。
```

**解决的需求：**

1. 每次从桌面进入都启动根 Activity，其他 Activity 销毁

> 如果将最底层的那个 Activity 的这个属性设置为 true，那么只要用户离开了当前任务，再次返回的时候就会将最底层 Activity 之上的所有其它 Activity 全部清除掉。简单来讲，就是一种和 alwaysRetainTaskState 完全相反的工作模式，它保证每次返回任务的时候都会是一种初始化状态，即使用户仅仅离开了很短的一段时间

#### finishOnTaskLaunch

这个属性与 `clearTaskOnLaunch` 属性相似，但它仅作用于单个的 activity，而不是整个的 task。<br />当它设置为 "true" 的时候，此 activity 仅做为任务的一部分存在于当前回话中，一旦用户离开并再次回到这个任务，此 activity 将不复存在。<br />`android:finishOnTaskLaunch="true"` 在配置了该属性为 true 的 activity 中按 home 键返回到 [home screen] 屏幕后,再点击该应用的图标启动程序时,则系统会调用该 activity 的 [onDestroy] 销毁。因为点击应用的图标启动程序时,重新启动了这个任务。<br />[ps: 因为有些项目需求是,点击应用图标必须显示项目的主界面且销毁某些之前打开的界面]。暂时还不会重新启动自己分配的 [taskAffinity] 任务,所以只能使用默认系统的 taskAffinity,然后点击应用图标启动程序进行触发

1. 按 home 键后回来，就 finish 了，从最近列表中回来不会销毁
2. 对 root Activity 无效

> 这个属性和 clearTaskOnLaunch 是比较类似的，不过它不是作用于整个任务上的，而是作用于单个 Activity 上。如果某个 Activity 将这个属性设置成 true，那么用户一旦离开了当前任务，再次返回时这个 Activity 就会被清除掉。

##### clearTaskOnLaunch 和 finishOnTaskLaunch

finishOnTaskLaunch 属性与 clearTaskOnLaunch 有些类似，它们的区别是 finishOnTaskLaunch 是作用在自己身上 (把自己移除任务栈，不影响别的 Activity)，而 clearTaskOnLaunch 则是作用在别人身上 (把别的 Activity 移除任务栈)，如果我们把 Activity 的 android:finishOnTaskLaunch 属性值设置为 true 时，离开这个 Activity 所依赖的任务栈后，当我们重新返回时，该 Activity 将会被 finish 掉，而且其他 Activity 不会受到影响。

#### android:alwaysRetainTaskState

alwaysRetainTaskState 实际上是给了当前 Activity 所在的任务栈一个 " 免死金牌 "，如果当前 Activity 的 android:alwaysRetainTaskState 设置为 true 时，那么该 Activity 所在的任务栈将不会受到任何清理命令的影响，一直保持当前任务栈的状态。

> 如果将最底层的那个 Activity 的这个属性设置为 true，那么上面所描述的默认行为就将不会发生，任务中所有的 Activity 即使过了很长一段时间之后仍然会被继续保留。

### singleInstance 按返回键坑

> 查询当前任务栈：adb shell dumpsys activity

#### 问题

聊天室 App 启动顺序：<br />SplashActivity→VoiceRoomListActivity→VoiceChatRoomActivity

> VoiceChatRoomActivity 为 singleInstance，其他都为 singleTop；WXPageActivity 为 weex 的多级导航页面

现在在 VoiceChatRoomActivity 启动新的 WXPageActivity，然后点击返回，直接返回到了 VoiceRoomListActivity<br />分析：<br />因为 VoiceChatRoomActivity 是 singleInstance，单独占有一个任务栈

#### 解决（利用 TaskAffinity）

利用 `taskAffinity`，将 VoiceRoomListActivity 启动的新的 Activity 都指定到同一个 taskAffinity 为 `qsbk.app.voice.voicechatroom`。

```xml
<activity
    android:name=".VoiceChatRoomActivity"
    android:launchMode="singleTask"
    android:taskAffinity="qsbk.app.voice.voicechatroom"/>
<activity
    android:name=".VoiceChatRoomActivity"
    android:launchMode="singleTask"
    android:taskAffinity="qsbk.app.voice.voicechatroom"/>
```

> taskAffinity 必须为 xxx.xxx.xxx 格式，否则 APK 会提示无效 `INSTALL_FAILED_INVALID_APK`，一直安装不上。

#### TaskAffinity

> 1. affinity 可以用于指定一个 Activity 更加愿意依附于哪一个任务，在默认情况下，同一个应用程序中的所有 Activity 都具有相同的 affinity，所以，这些 Activity 都更加倾向于运行在相同的任务当中。当然了，你也可以去改变每个 Activity 的 affinity 值，通过元素的 taskAffinity 属性就可以实现了。
> 2. taskAffinity 属性接收一个字符串参数，你可以指定成任意的值 (经我测试字符串中至少要包含一个.)，但必须不能和应用程序的包名相同，因为系统会使用包名来作为默认的 affinity 值。

1. 如果单独设置 TaskAffinity 属性的话是没有任何效果的，只有 Activity 的 launchMode 设置成 `singleTask` 的时候才会生效的
2. TaskAffinity 的值应该是 xxx.xxx.xxx 类似包名的，如果没有包括.的话是安装不了的；
3. 如果不指定 TaskAffinity 的话，默认的值是包名。
4. 启动 Activity 的时候会根据 taskAffinity 查找是否有存在的任务栈，没有的话就创建一个新的任务栈

### Ref

- Activity 启动模式与任务栈 (Task) 全面深入记录（下）<br /><https://blog.csdn.net/javazejian/article/details/52072131>

# Activity 杂项

## Android 不让程序显示在最近程序列表中

### android:excludeFromRecents

`android:excludeFromRecents="true"` 属性用于控制程序在不在 recent 列表中显示。<br />true 时不显示；false 显示，其中 false 为默认值。<br />运行 activity 后，不会显示在 recent 列表中。<br />程序正在运行或者退出，在长按 HOME 键的最近程序列表中不显示该应用以达到隐藏进程的目的。

> 有些博客描述 android:excludeFromRecents 是否起作用的关键是与 android:launchMode="singleTask" 启动模式有关，但是经过测试发现，`android:excludeFromRecents` 与应用是否具有 `android.intent.category.LAUNCHER` 属性有关，在主 Activity 有 LAUNCHER 的前提下，android:excludeFromRecents="true",才能达到在最近任务列表中隐藏该应用的目的。

> Note：注意：它需要设置在入口 activity 的属性里才起作用，给其他的 activity 设置不起作用。

### android:noHistory="true"

设置为 TRUE，该 activity 不可见的时候就会消失

## excludeFromRecents 属性需要注意的小地方

在 Android 系统中，如果我们不想某个 Activity 出现在 "Recent screens" 中，可以设置  属性 `android:excludeFromRecents` 为 true。其中有些需要注意到的地方说明下。<br />`android:excludeFromRecents` 属性并不会仅仅影响被设置的 Activity。由此该 Activity 启动的后续同属一个 "Task" 的一系列 Activity 都不会出现在 Recent screens。也就是说该属性是对 Task 起作用的，而不仅仅是某个 Activity。<br />所以想要后续的 Activity 能够出现在 Recent screens 中，就必须让后续 Activity 在新的 Task 中。<br />但是如果设置上面属性的 Activity 正是当前正在使用的，切换到 Recent screens 也是可以看到的。但是退到后台运行后，比如按下 Home 键，属性就会发生作用。<br />所以要想属性生效设置该属性的 Activity 必须是 **Task 的根 Activity**。如果在某个 Task 非根 Activity 中设置 android:excludeFromRecents 是没有任何效果的。

## Activity 切换动画

### Activity 切换动画 (同一个任务栈之间页面切换动画)

#### 1、主题设置

```xml
<style name="AppTheme" parent="@style/Theme.AppCompat.Light.NoActionBar">
    <!--自定义页面切换动画-->
  <itemname="android:windowAnimationStyle">@style/fade</item>
</style>
```

- fade.xml

```xml
<style name="fade" parent="@android:style/Animation.Activity">
    <item name="android:activityOpenEnterAnimation">@anim/in_from_right</item>
    <item name="android:activityOpenExitAnimation">@anim/out_to_left</item>
    <item name="android:activityCloseEnterAnimation">@anim/in_from_right_close</item>
    <item name="android:activityCloseExitAnimation">@anim/out_to_left_colse</item>
</style>
```

在项目 res 目录下新建 anim 文件夹,里边放的都是动画,写入 4 个动画 in_from_right.xml ; in_from_right_close.xml ; out_to_left.xml ,out_to_left_colse.xml ;<br />具体代码如下: 和 Android 默认的动画一致

- in_from_right.xml 代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:interpolator="@android:anim/accelerate_interpolator">
    <translate
        android:duration="300"
        android:fromXDelta="100%p"
        android:toXDelta="0%p" />
</set>
```

- in_from_right_close.xml 代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:interpolator="@android:anim/accelerate_interpolator">
    <translate
        android:duration="300"
        android:fromXDelta="-100%p"
        android:toXDelta="0%p" />
</set>
```

- out_to_left.xml 代码:

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:interpolator="@android:anim/accelerate_interpolator">
    <translate
        android:duration="300"
        android:fromXDelta="0%p"
        android:toXDelta="-100%p" />
</set>
```

- out_to_left_colse.xml 代码:

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:interpolator="@android:anim/accelerate_interpolator">
    <translate
        android:duration="300"
        android:fromXDelta="0%p"
        android:toXDelta="100%p" />
</set>
```

#### 2、代码设置

1. overridePendingTransition
2. 5.0+ 转场动画

### 去除 Activity 切换动画

- 1、去掉进入时的动画

```java
public static void launchActivity(Context context) {
    Intent intent = new Intent(context, SearchActivity.class);
    if (!(context instanceof Activity)) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
    context.startActivity(intent);
}
```

- 2、去掉退出时的动画

> 在要退出的 Activity 的 finish() 加上：

```java
@Override
public void finish() {
    super.finish();
    overridePendingTransition(0,0);
}
```

### 任务栈之间页面切换动画

不同栈之间的动画切换,只需要在上边 2 步骤中加入下边 4 个属性,即可设置完成不同任务栈之间页面动画切换的设置:

```xml
<style name="AppTheme" parent="@style/Theme.AppCompat.Light.NoActionBar">
    <item name="android:taskOpenEnterAnimation">@anim/in_from_right</item>
    <item name="android:taskOpenExitAnimation">@anim/out_to_left</item>
    <item name="android:taskCloseEnterAnimation">@anim/in_from_right_close</item>
    <item name="android:taskCloseExitAnimation">@anim/out_to_left_colse</item>
</style>
```

## DialogActivity 对话框 style

- 配置 style

```xml
<style name="AppTheme.Base" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="windowActionBar">false</item>
    <item name="windowNoTitle">true</item>
    <item name="colorAccent">@color/color_ffc8a0</item>
</style>

<!-- Base application theme. -->
<style name="AppTheme" parent="AppTheme.Base">
    <item name="android:windowIsTranslucent">true</item>
    <item name="actionBarSize">50dip</item>
</style>

<style name="DialogAct" parent="AppTheme">
    <!--背景透明-->
    <item name="android:windowBackground">@android:color/transparent</item>
    <!--边框-->
    <item name="android:windowFrame">@null</item>
    <!--是否浮现在activity之上-->
    <item name="android:windowIsFloating">true</item>
    <!--模糊-->
    <item name="android:backgroundDimEnabled">true</item>
    <item name="android:windowContentOverlay">@null</item>
    <item name="android:windowCloseOnTouchOutside">false</item>
</style>
```

- 配置宽高

```java
private void initWindow() {
    WindowManager.LayoutParams attributes = getWindow().getAttributes();
    attributes.gravity = Gravity.CENTER;
    attributes.width = (int) (0.75 * ScreenUtils.getScreenWidth(this));
//        attributes.dimAmount = 0.5f;
    getWindow().setAttributes(attributes);
}
```

## 启动来源 Referrer

1. ~~Binder.getCallingUid() 和 Binder.getCallingPid()，~~然后根据 uid，pid 查找到包名；不能在调用者 startActivity() 的时候获取到调用者的包名，只能用于 Activity 用到的 Binder 同步调用的地方。
2. Activity 的 getCallingPackage() 和 getCallingActivity() 只有在 startActivityForResult() 的时候才可以得到调用者的包名。
3. Activity 的 getReferrer() （API21,Android5.1 引入）不可靠的，因为调用者可以自己设置 referrer 的值。所以不能依赖此值来判断调用者。
4. 反射的方式获取 Activity 的 mReferrer: reflectGetReferrer()（API21,Android5.1 引入）通过反射的方式 reflectGetReferrer(）获取到的 mReferrer，是调用者的包名，目前来看是可靠的，但是需要在 Android5.1(Api level 22) 以及之后才能用。

反射方式获取 referrer 安全保证

- [x] [Android Activity Deeplink启动来源获取源码分析](https://juejin.cn/post/7030977861691375629)
