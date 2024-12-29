---
date created: 2024-08-14 17:12
tags:
  - '#0'
  - '#3:'
  - '#62'
  - '#0:'
  - '#2:'
  - '#1:'
  - '#59'
date updated: 2024-12-24 00:23
dg-publish: true
---

# Intent-隐式Intent判断

## 判断隐式intent跳转是否有判断有匹配的activity

### 1、resolveActivity

```java
Uri uri = Uri.parse(url);
Intent viewIntent = new Intent(Intent.ACTION_VIEW, uri);
if (mContext.getPackageManager().resolveActivity(viewIntent, PackageManager.MATCH_DEFAULT_ONLY) != null) {
    mContext.startActivity(viewIntent);
}
```

### 2、queryIntentActivities

android11需要适配软件包可见性`<queries/>`，

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

## IntentFilter匹配规则

### Action的匹配规则

- action可以自定义
- action在Intent-filter可以设置多条
- intent中必须指定action否则匹配失败且intent中action最多只有一条
- intent中的action和intent-filter中的action必须完全一样时（包括大小写）才算匹配成功
- intent中的action只要与intent-filter其中的一条匹配成功即可

常见action如下(Intent类中的常量)：

1. `Intent.ACTION_MAIN`，标识Activity为一个程序的开始
2. `Intent.ACTION_VIEW`，显示用户的数据
3. `Intent.ACTION_DIAL`，用户拨号面板
4. `Intent.ACTION_SENDTO`，发送消息
5. `Intent.ACTION_PICK`，从列表中选择信息，一般用于选择联系人或者图片等
6. `Intent.ACTION_ANSWER`，处理呼入的电话
7. `Intent.ACTION_CHOOSER`，显示一个Activity选择器，比如常见的选择分享到哪里

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

下面的两个intent都可以匹配上面MainActivity的action规则：

```java
Intent intent = new Intent("com.jrmf360.action.ENTER");
startActivity(intent);

Intent intent2 = new Intent("com.jrmf360.action.ENTER2");
startActivity(intent2);
```

### category的匹配规则

category是一个字符串，系统预定义了一些category，同时我们也可以在应用中定义自己的category;<br />category的匹配规则是：

- category在intent-filter中可以有多条
- category在intent中也可以有多条
- intent中可以没有category，但是如果一旦有category，不管有几个，每个都要能够和过滤规则中的任何一个category匹配;
- intent中所有的category都可以在intent-filter中找到一样的（包括大小写）才算匹配成功
- 通过intent启动Activity的时候如果没有添加category会自动添加android.intent.category.DEFAULT，如果intent-filter中没有添加android.intent.category.DEFAULT则会匹配失败

> 这里可能感觉和action很像，但是只要稍微注意一下就可以发现Intent是setAction和addCategory，也就是说action只有一个(注意是一个Intent只有一个action，但是一个Activity的intent-filter中可以有多个action)，而category可以有很多个且所有的category都必须出现在Activity的category集中;

### data的匹配规则

data的匹配规则：

- intent-filter中可以设置多个data
- intent中只能设置一个data，且要和intent-filter中完全匹配
- intent-filter中指定了data，intent中就要指定其中的一个data
- setType会覆盖setData，setData会覆盖setType，因此需要使用setDataAndType方法来设置data和mimeType

data的语法格式

```xml
<data android:scheme="string" 
    android:host="string" 
    android:port="string" 
    android:path="string" 
    android:pathPattern="string" 
    android:pathPrefix="string" 
    android:mimeType="string" />
```

data由两部分组成： mimeType和 URI，URI通过如下格式，包括scheme、host、port、path、pathPrefix和pathPattern;

```
<scheme>://<host>:<port>/[<path>|<pathPrefix>|<pathPattern>]
```

具体的参数解释:

- mimeType：指媒体类型，比如 image/jpeg、audio/mpeg4-generic、vidio/等，可以表示图片、文本、视频等不同的媒体格式;
- scheme：URI的模式，如http、file、content等，如果URI中没有指定scheme，那么整个URI的其他参数无效，这也意味着URI是无效的;
- host：URI的主机名，如blog.csdn.net，如果host未指定，那么整个URI中的其他参数无效，这也意味着URI是无效的;
- port：URI中的端口号，比如80，进档URI中指定了scheme和host参数的时候，port参数才是有意义的;
- path：表述路径的完整信息;
- pathPrefix：表述路径的前缀信息;
- pathPattern：表述路径的完整信息，但它里面可以包含通配符 * ，表示0个或任意字符;

**data的注意事项**

1. URI可以不设置，但如果设置了，则 scheme 和 host 属性必须要设置;
2. URI的 scheme属性有默认值，默认值为content 或者 file，因此，就算在intent-filter 中没有为data设置URI，也需要在匹配的时候设置scheme和host两个属性，且scheme属性的值必须是content或者file;

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

### IntentFilter总结

#### 1、IntentFilter匹配优先级

查看Intent的过滤器(intent-filter)，按照以下优先关系查找：action->data->category;

#### 2、隐式intent;

每一个通过 startActivity() 方法发出的隐式 Intent 都至少有一个 category，就是`android.intent.category.DEFAULT`，所以只要是想接收一个隐式 Intent 的 Activity 都应该包括 `android.intent.category.DEFAULT` category，不然将导致 Intent 匹配失败

# Activity的生命周期

Activity常用的生命周期有以下七个，onCreate、onRestart、onStart、onResume、onPause、onStop、onDestroy。

- onCreate和onDestory<br />分别代表了一个Activity的创建和销毁、第一个生命周期和最后一个生命周期回调，期间包裹了一个完整(entire lifetime)的Activity生命周期。
  - onCreate 只调用一次；用来初始化一些总体资源比如setContentView或加载一些关于这个Activity的全局数据
- onStart和onStop<br />分别代表了Activity已经处于可见状态和不可见状态，此时的Activity未处在前台，不可以与用户交互，可多次被调用，期间Activity处于可见(visable lifetime)状态。
  - onStart 会被重复调用；可以加载一些当Activity可见时才需要加载的数据或者注册一个广播，监听UI的变化来刷新界面
- onResume和onPause<br />分别代表了Activity已经进入前台获得焦点和退出前台失去焦点，此时的Activity是可以和用户交互的，可多次被调用，期间的Activity处于前台(foreground lifetime)状态。
  - onResume 当Activity获取焦点时被调用，可多次调用；只做一些轻量级的数据加载和布局。
  - onPause 不能进行耗时的操作或重量级的释放操作，会影响下一个Activity进入前台与用户交互（只有onPause方法调用完毕，下一个Activity的onStart才会调用）；无论出现什么情况，比如程序突然死亡，能保证的就是onPause方法一定会调用，onStop和onDestroy不一定，所以onPause是持久化相关数据最后的可靠时机
- onRestart<br />表示Activity正在重新启动，正常状态下，Acitivty调用了onPause–onStop但是并没有被销毁，重新显示此Activity时，onRestory会被调用。

## 不同场景的Activity生命周期回调

### 1、完整的Activity生命周期流转

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1677685183527-7c4f6ed4-3439-430a-b453-b291ebfba129.png#averageHue=%23f5f2ef&clientId=u4a3dd028-c1a4-4&from=paste&id=uaef81efd&originHeight=681&originWidth=529&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uce233ac9-7b56-4698-9e43-97f9566ca57&title=)

### 2、Activity第一次启动

onCreate -> onStart -> onResume

### 3、打开新Activity或按Home键

onPause->onStop

> 如果新的Activity的Theme为Dialog或者Translucent（透明）时不会调用onStop方法

### 4、再次回到Activity

onRestart->onStart->onResume

### 5、按Back键退出Activity

onPause->onStop->onDestroy

### 6、AActivity启动BActivity

1. AActivity已经可见了，然后启动BActivity

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676871573767-c2f561d4-34f4-4d85-8670-db90034a0c21.png#averageHue=%23302e2d&clientId=u10e332dd-6587-4&from=paste&height=127&id=u9626371b&originHeight=145&originWidth=357&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=9199&status=done&style=none&taskId=u784c4a74-985f-4d44-961d-63dc5fee71f&title=&width=312)

2. 从BActivity返回到AActivity

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676871595682-1e5ef803-bf50-4b1b-b7e3-62deb3e98ae3.png#averageHue=%232a2a2a&clientId=u10e332dd-6587-4&from=paste&height=167&id=ue7ac4a22&originHeight=284&originWidth=551&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=49661&status=done&style=none&taskId=u4e0d42d1-49f8-4b5b-a886-fd5f14e188e&title=&width=324.3333435058594)<br />![ActivityB启动ActivityA并返回到ActivityB](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1676872156392-b1554f15-1a3b-4513-bba7-02b3340ab4c6.jpeg#averageHue=%23fefdf9&clientId=u10e332dd-6587-4&from=paste&id=u4df6d88a&originHeight=446&originWidth=640&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=u9c4df3d5-99a4-4950-92d6-95c99382590&title=ActivityB%E5%90%AF%E5%8A%A8ActivityA%E5%B9%B6%E8%BF%94%E5%9B%9E%E5%88%B0ActivityB "ActivityB启动ActivityA并返回到ActivityB")

## onRestart触发的情况

Activity已经启动了，未杀死App，此时App已经切换到其他App，再从其他App切换回来，会调用onRestart()

1. 按下Home键后，然后切换回来，会调用onRestart()
2. 从本Activity跳转到另一个Activity后，按back键返回到原来的Activity，会调用onRestart()
3. 从本Activity切换到其他应用，然后再从其他应用切换回来，会调用onRestart()

## onNewIntent()方法何时会被调用？

**前提：**在该Activity的实例已经存在于Task或Back stack中，当使用intent来再次启动该Activity的时候，如果此次启动不创建该Activity实例，则系统会调用原有的实例的onNewIntent()方法来处理此intent。<br />且在下面情况下系统不会创建该Activity的新实例：

1. 如果该Activity在Manifest中的android:launchMode定义为singleTask或者singleInstance
2. 如果该Activity在Manifest中的android:launchMode定义为singleTop且该实例位于Back stack的栈顶
3. ,如果该Activity在Manifest中的android:launchMode定义为singleTop,且上述intent包含Intent.FLAG_ACTIVITY_CLEAR_TOP标志
4. 如果上述intent中包含 Intent.FLAG_ACTIVITY_CLEAR_TOP 标志和且包含Intent.FLAG_ACTIVITY_SINGLE_TOP 标志
5. 如果上述intent中包含 Intent.FLAG_ACTIVITY_SINGLE_TOP 标志且该实例位于Back stack的栈顶

## onActivityResult的生命周期

从dest Activity获取result后，返回src Activity时，先回调src的onActivityResult，再回调src Activity的onResume/onStart。<br />如果需要在onActivityResult中做一些判断前后台的逻辑，可能会出问题。

> 启动srcActivity，从dstActivity获取result，并返回到srcActivity生命周期：
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

## onSaveInstanceState方法在Activity的哪两个生命周期方法之间调用？

其实onSaveInstanceState方法与onPause方法的调用顺序没有先后之分，你需要记住的是，onSaveInstanceState一定在onStop方法之前调用。

## 弹出一个Dialog时，onPause会调用吗？什么情况下会，什么情况下不会？

不会

## onNewIntent: Activity启动之后获取不到上个页面传过来的intent解决方法

当我们用startActivity（intent）方法开启一个新的activity的时候，intent总是能正常获取到的，但是如果开启一个已经存在的activity，并且这个activity设置启动模式不是标准启动模式，比如是**singleTask**模式，那么我们启动的时候就不是新创建一个activity而是把之前activity的示例移到栈顶，这时候就会出现获取不到我们想要的intent中所传数据的情况。<br />首先我们看下源码中getIntent方法的注释：

```java
/** Return the intent that started this activity. */
public Intent getIntent() {
    return mIntent;
}
```

源码中注释说明：通过getIntent获取到的是activity创建时候的意图intent，并且会把这个意图保存下来，之后如果在activity从后台调出到前台，用getIntent方法获取到的始终是之前锁保存的意图。<br />在要通过getIntent获取到intent的activity中重写如下方法：

```java
//此方法在onResume之前执行
@Override
protected void onNewIntent(Intent intent) {
    //每次重新到前台就主动更新intent并保存，之后就能获取到最新的intent
    setIntent(intent);
    super.onNewIntent(intent);
}
```

setIntent方法是专门修改通过getIntent方法所获取到的intent的。

## moveTaskToBack

在activity中调用`moveTaskToBack (boolean nonRoot)`方法即可将activity 退到后台，注意不是finish()退出。<br />参数说明：

- 参数为false——代表只有当前activity是task根，指应用启动的第一个activity时，才有效;
- 参数为true——则忽略这个限制，任何activity都可以有效。

说明：判断Activity是否是task根，Activity本身给出了相关方法：`isTaskRoot()`

## Activity之configChanges配置

如果`android:configChanges`属性没有指定特定的选项，当配置发生改变后就会导致Activity重新创建。配置了configChanges属性，Activity不会重新创建，也不会调用`onSaveInstanceState()`和`onRestoreInstanceState()`方法来存储和恢复数据，而是调用了`onConfigurationChanged()`方法，这个时候我们就可以做一些特殊的处理了。

### configChanges常用配置

- orientation<br />屏幕方向发生了改变，这个是最常用的，比如旋转了手机屏幕
- locale<br />设备的本地位置发生了改变，一般指切换了系统语言
- keyboardHidden<br />键盘的可访问性发生了变化，比如用户调出了键盘
- screenSize<br />当屏幕的尺寸信息发生了改变，当旋转设备屏幕时，屏幕尺寸会发生变化，这个选项比较特殊，它和编译选项有关，当编译选项中的minSdkVersion和targetSdkVersion均低于13时，此选项不会导致Activity重启，大于等于13会导致Activity重启

## Activity执行finish后10秒后才调用onStop方法

现象：ActivityA执行finish后，进入ActivityB<br />原因：ActivityA页面有个View动画在不停的跑，导致ActivityA的onPause和onDestroy得不到及时执行<br />分析：

- ActivityA页面执行了Animation动画，由于动画是INFINITE，所以Animation会无限的往MQ里发送绘制UI的消息
- ActivityA页面执行finish操作，ActivityA进入onPause状态
- 然后寻找下一个即将Resume的ActivityB，进入Resume状态
- 发送一个延迟10秒的消息进入MQ中，这个消息用来执行ActivityA的onStop和onDestroy操作
- 发送一个Idler对象，在MQ空闲的时候执行ActivityA的onStop和onDestroy操作，并移除10秒的延迟消息
- 由于MQ一直有消息在执行，所以Idler对象没有执行的时机，10秒后延迟的消息会执行onStop

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678721564247-ca2e9684-5d8d-4138-940e-a40c865ebaf7.png#averageHue=%23f5f5f5&clientId=u372109f6-614f-4&from=paste&id=u59688c3f&originHeight=682&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=108527&status=done&style=none&taskId=ub4a9b646-e876-46cb-a2c2-7da476474ae&title=)<br />解决：

1. 进入onPause时暂停Animation，onResume时恢复动画
2. Animation替换成ValueAnimation，属性动画不会导致Activity的生命周期延迟执行

- [ ] [Android高级进阶:从源码对调用Activity.finish()之后10s才onDestroy问题详细分析](https://mp.weixin.qq.com/s/lglcd8hwJF9SeEXkuMSfkQ)
- [ ] [面试官：为什么 Activity.finish() 之后 10s 才 onDestroy ？](https://juejin.cn/post/6898588053451833351?utm_source=gold_browser_extension)

## finish和onBackPressed？

- 没有弹框，没有菜单，没有共享变换，finish和onBackPressed是完全一样的
- 存在弹框、菜单等，onBackPressed要先关闭popWindow
- 存在共享变化（Shared Element Transition），finish不会调用变换动画，必须使用onBackPressed方法

finish源码：

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

直接调用ActivityClient.getInstance().finishActivity(mToken, resultCode, resultData, finishTask)来finish activity<br />onBackPressed源码：

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

onBackPressed方法，会先判断是否有弹出的窗口，popWindow，比如dialog，比如菜单，等等，如果有，先关闭这些。<br />如果没有再来进行关闭操作。

# 任务栈和launchMode启动模式

## 任务栈Task

任务栈Task，是一种用来放置Activity实例的容器，他是以栈的形式进行盛放，也就是所谓的先进后出，主要有2个基本操作：压栈和出栈，其所存放的Activity是**不支持重新排序**的，只能根据压栈和出栈操作更改Activity的顺序。

启动一个Application的时候，系统会为它默认创建一个对应的Task，用来放置根Activity。默认启动Activity会放在同一个Task中，新启动的Activity会被压入启动它的那个Activity的栈中，并且显示它。当用户按下回退键时，这个Activity就会被弹出栈，按下Home键回到桌面，再启动另一个应用，这时候之前那个Task就被移到后台，成为后台任务栈，而刚启动的那个Task就被调到前台，成为前台任务栈，Android系统显示的就是前台任务栈中的Top实例Activity。

> 默认情况下，所有Activity所需的任务栈的名字为应用的包名。

- 前台任务栈
- 后台任务栈

## 启动模式launchMode

![Activity launch mode.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/694278/1683337572980-5776ba32-d716-4489-a382-7d1f23ed0f6a.jpeg#averageHue=%23434448&clientId=u716f22e6-f28d-4&from=ui&id=Ild6j&originHeight=1920&originWidth=2071&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=306095&status=done&style=none&taskId=u322c2414-1f04-4c7a-a630-0a169cea385&title=)<br />系统提供了两种方式来设置一个Activity的启动模式，除了在`AndroidManifest`文件中设置以外，还可以通过`Intent的Flag`来设置一个Activity的启动模式。

### standard

标准的，默认的启动模式。<br />谁启动了这个Activity，这个Activity就运行在启动它的那个Activity所在的栈中（用Context启动Activity会报错，因为Context没有任务栈，需要为待启动的Activity加上`FLAG_ACTIVITY_NEW_TASK`标记位，这样启动的时候就会为它创建一个新的任务栈，这个时候待启动Activity实际上是以singleTask启动的）<br />默认模式，可以不用写配置。在这个模式下，都会默认创建一个新的实例。因此，在这种模式下，可以有多个相同的实例，也允许多个相同Activity叠加。应用场景：绝大多数Activity。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687795233886-de4a9672-dcca-493b-9b29-b59874917de6.png#averageHue=%23f4c7b7&clientId=u4ea8b224-9c91-4&from=paste&height=400&id=u9d047312&originHeight=924&originWidth=1273&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=135104&status=done&style=none&taskId=u4f64e380-38e1-45da-99e9-55eb5216172&title=&width=551)

> 如果以这种方式启动的Activity被跨进程调用，在5.0之前新启动的Activity实例会放入发送Intent的Task的栈的顶部，尽管它们属于不同的程序，这似乎有点费解看起来也不是那么合理，所以在5.0之后，也是放入启动它的Intent的任务栈用

> 5.0+后启动另外一个App为standard/singleTop

### singleTop

**栈顶复用模式**，如果要开启的activity在任务栈的顶部已经存在，就不会创建新的实例，而是调用 `onNewIntent()` 方法。避免栈顶的activity被重复的创建。<br />应用场景：在通知栏点击收到的通知，然后需要启动一个Activity，这个Activity就可以用singleTop，否则每次点击都会新建一个Activity。当然实际的开发过程中，测试妹纸没准给你提过这样的bug：某个场景下连续快速点击，启动了两个Activity。如果这个时候待启动的Activity使用 singleTop模式也是可以避免这个Bug的。

> 同standard模式，如果是外部程序启动singleTop的Activity，在Android 5.0之前新创建的Activity会位于调用者的Task中，5.0及以后一样

### singleTask

**栈内复用模式**， activity只会在任务栈里面存在一个实例。如果要激活的activity，在任务栈里面已经存在，就不会创建新的activity，而是复用这个已经存在的activity，调用 `onNewIntent()` 方法，并且清空这个activity任务栈上面所有的activity。<br />应用场景：大多数App的主页。对于大部分应用，当我们在主界面点击回退按钮的时候都是退出应用，那么当我们第一次进入主界面之后，主界面位于栈底，以后不管我们打开了多少个Activity，只要我们再次回到主界面，都应该使用将主界面Activity上所有的Activity移除的方式来让主界面Activity处于栈顶，而不是往栈顶新加一个主界面Activity的实例，通过这种方式能够保证退出应用时所有的Activity都能报销毁。

在跨应用Intent传递时，如果系统中不存在singleTask Activity的实例，那么将创建一个新的Task，然后创建SingleTask Activity的实例，将其放入新的Task中。

> 跨应用开启singleTask的，会放入到新的任务栈中

- SingleTask与android.intent.action.MAIN的坑<br />无论打开多少页面，将应用推至后台再启动就回到了主页；这是由于主页配置了singleTask，每次点击桌面都是启动主页，那么就会将主页上面的Activity全部清理掉。<br />解决：

```
解决方法： 
1、singleTask换成singleTop，如果需要清除栈，使用intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

2、使用一个空的Activity配置android.intent.action.MAIN，启动后跳转MainActivity。
```

### singleInstance

**单一实例模式**，整个手机操作系统里面只有一个实例存在。不同的应用去打开这个activity  共享公用的同一个activity。他会运行在自己单独，独立的任务栈里面，并且任务栈里面只有他一个实例存在。

应用场景：呼叫来电界面。这种模式的使用情况比较罕见，在Launcher中可能使用。或者你确定你需要使Activity只有一个实例。建议谨慎使用。

某些版本手机在设置activity模式为singleInstance模式下的时候，会默认自带一个放缩的切换动画，跟其他切换动画不协调，此时解决如下：将所有的activity都设置动画，覆盖掉默认的。

### Ref

- 我打赌你一定没搞明白的Activity启动模式<br /><https://www.jianshu.com/p/2a9fcf3c11e4>

## Intent flags

### 常见的flags

#### FLAG_ACTIVITY_NEW_TASK

使用一个新的Task来启动一个Activity，但启动的每个Activity都讲在一个新的Task中。该Flag通常使用在从Service中启动Activity的场景，由于Service中并不存在Activity栈，所以使用该Flag来创建一个新的Activity栈，并创建新的Activity实例。

首先会查找是否存在和被启动的Activity具有相同的亲和性的任务栈（即taskAffinity，注意同一个应用程序中的activity的亲和性相同），如果有，则直接把这个栈整体移动到前台，并保持栈中旧activity的顺序不变，然后被启动的Activity会被压入栈，如果没有，则新建一个栈来存放被启动的activity，注意，默认情况下同一个应用中的所有Activity拥有相同的关系(taskAffinity)

- [ ] Android面试官装逼失败之：Activity的启动模式<br /><https://juejin.im/post/59b0f25551882538cb1ecae1>

> 有点深入

##### FLAG_ACTIVITY_NEW_TASK理解

首先会查找是否存在和被启动的Activity具有相同的亲和性的任务栈（即taskAffinity，注意同一个应用程序中的activity的亲和性相同），如果有，则直接把这个栈整体移动到前台，并保持栈中旧activity的顺序不变，然后被启动的Activity会被压入栈，如果没有，则新建一个栈来存放被启动的activity，注意，默认情况下同一个应用中的所有Activity拥有相同的关系(taskAffinity).

1. 如果目标Activity设置了`FLAG_ACTIVITY_NEW_TASK`，且没有设置`android:taskAffinity`属性，那么默认App所有的Activity都具有相同的taskAffinity，已经存在了任务栈了，那么目标Activity将直接入栈
2. 如果已经设置了taskAffinity，看该task stack是否存在，存在即入栈；不存在，创建，入栈

> 默认情况下同一个应用中的所有Activity，都拥有相同的关系(taskAffinity)，即由FLAG_ACTIVITY_NEW_TASK开启的新Activity，也都在同一个任务栈中（与Application相同的任务栈），若想使新Activity进入不同栈中，则还需要如下配置：

```xml
<activity
  android:name=".ui.activity.OtherTaskActivityXXX"
  android:taskAffinity="android.task.browser"/> //注意这里的 taskAffinity
```

并且在该OtherTaskActivityXXX页面中，若再开启的其他页面，那么所有的其他页面，都将被压入到这个新的任务栈中。

##### 为什么非Activity启动Activity要强制规定使用参数FLAG_ACTIVITY_NEW_TASK

如果不是在Activity中启动的，那就可以看做不是用户主动的行为，也就说这个界面可能出现在任何APP之上，如果不用`Intent.FLAG_ACTIVITY_NEW_TASK`将其限制在自己的Task中，那用户可能会认为该Activity是当前可见APP的页面，这是不合理的。举个例子：我们在听音乐，这个时候如果邮件Service突然要打开一个Activity，如果不用Intent.FLAG_ACTIVITY_NEW_TASK做限制，那用户可能认为这个Activity是属于音乐APP的，因为用户点击返回的时候，可能会回到音乐，而不是邮件（如果邮件之前就有界面）。

#### FLAG_ACTIVITY_SINGLE_TOP

使用singletop模式启动一个Activity，与指定android：launchMode=“singleTop”效果相同。

#### FLAG_ACTIVITY_CLEAR_TOP

使用SingleTask模式来启动一个Activity，与指定android：launchMode=“singleTask”效果相同。

#### FLAG_ACTIVITY_NO_HISTORY

Activity使用这种模式启动Activity，当该Activity启动其他Activity后，该Activity就消失了，不会保留在Activity栈中。

#### FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS

具有这个标记的Activity，不会出现在历史Activity列表中；等同于xml中配置`android:excludeFromRecents="true"`

## taskAffinity

### 查看Activity信息（dumpsys activity）

- adb shell dumpsys activity

查看`me.hacket.assistant`Activity的信息：

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

它的主要作用是activity的迁移，即从一个task迁移到另一个task，这个迁移跟activity的taskAffinity有关。当allowTaskReparenting的值为“true”时，则表示Activity能从启动的Task移动到有着affinity的Task（当这个Task进入到前台时），当allowTaskReparenting的值为“false”，表示它必须呆在启动时呆在的那个Task里。如果这个特性没有被设定，元素(当然也可以作用在每次activity元素上)上的allowTaskReparenting属性的值会应用到Activity上。默认值为“false”。这样说可能还比较难理解，我们举个例子，比如现在有两个应用A和B，A启动了B的一个ActivityC，然后按Home键回到桌面，再单击B应用时，如果此时，allowTaskReparenting的值为“true”，那么这个时候并不会启动B的主Activity，而是直接显示已被应用A启动的ActivityC，我们也可以认为ActivityC从A的任务栈转移到了B的任务栈中

1. 只对启动的Activity（设置为allowTaskReparenting的Activity只能是standard和singleTop模式）

<https://juejin.im/entry/57ac05858ac247005fec2ca1>

### taskAffinity解读

#### taskAffinity 在下面两种情况时会产生效果

- taskAffinity 与 FLAG_ACTIVITY_NEW_TASK 或者 singleTask 配合。如果新启动 Activity 的 taskAffinity 和栈的 taskAffinity 相同则加⼊到该栈中；如果不同，就会创建新栈
- taskAffinity 与 allowTaskReparenting 配合。如果allowTaskReparenting 为 true ，说明 Activity 具有转移的能力。举个例⼦：当社交应⽤启动了发送邮件的 Activity ，此时发送邮件的 Activity就是和社交应⽤处于同⼀个栈中的，并且这个栈位于前台。如果发送邮件的 Activity 的 allowTaskReparenting 设置为 true ，此后 E-mail 应⽤所在的栈位于前台时，发送邮件的 Activity 就会由社交应⽤的栈中转移到与它更亲近的邮件应⽤( taskAffinity 相同）所在的栈中。

`android:taskAffinity` ，默认是应用包名，可以指定不是包名；需要和`android:allowTaskReparenting`属性或者singleTask启动模式配对使用，其他情况没有意义

#### taskAffinity特性

1. 如果不指定taskAffinity属性，应用程序的所有Activity都存放于默认task（singleInstance启动的activity除外，因为singleInstance启动的activity独占一个task）
2. 指定taskAffinity，只有当Activity设置`FLAG_ACTIVITY_NEW_TASK`才起作用，否则不起作用。（注意：`singleInstance`和`singleTask`启动的activity默认是设置了`FLAG_ACTIVITY_NEW_TASK`的FLAG的）
3. 默认Activity的`taskAffinity`是App的`applicationId`
4. 会启动一个新的task，但其taskAffinity还是App的applicationId
5. 指定taskAffinity，`singleTask/singleInstance`有效；`standard和singleTop`当且仅当Activity设置FLAG_ACTIVITY_NEW_TASK才起作用，否则不起作用
6. 在指定的taskAffinity生效后，在这基础上启动的launchMode为`standard/singleTop`Activity都是在该taskAffinity的task中；如果启动的是`singleTask`的不在该该task中，它还是在默认的task任务栈中；如果启动的是`singleInstance`，任何时刻都是新开一个任务栈，设置什么都没用，总是独占一个任务栈。如果需要将启动的`singleTask`也纳入到任务栈中，需要添加和启动自己Activity的一样的`taskAffinity`并设置`allowTaskReparenting=true`；

#### taskAffinity注意

1. `android:taskAffinity=""`属性要么指定为空，要么要以`.`分<br />隔，如果这样赋值 android:taskAffinity=”test”，会报错
2. 配置了`taskAffinity`和`singleTask/singleInstance`生效后，切换Activity会有动效

- 我打赌你一定没搞明白的Activity启动模式<br /><https://www.jianshu.com/p/2a9fcf3c11e4>

### 清空返回栈

如何用户将任务切换到后台之后过了很长一段时间，系统会将这个任务中除了最底层的那个Activity之外的其它所有Activity全部清除掉。当用户重新回到这个任务的时候，最底层的那个Activity将得到恢复。这个是系统默认的行为，因为既然过了这么长的一段时间，用户很有可能早就忘记了当时正在做什么，那么重新回到这个任务的时候，基本上应该是要去做点新的事情了。<br />当然，既然说是默认的行为，那就说明我们肯定是有办法来改变的，在`<activity>`元素中设置以下几种属性就可以改变系统这一默认行为：

#### clearTaskOnLaunch

这个属性用来标记是否从task清除除`根Activity`之外的所有的Activity，“true”表示清除，“false”表示不清除，默认为“false”。同样，这个属性也只对根Activity起作用，其他的Activity都会被忽略。<br />如果设置了这个属性为“true”，每次用户重新启动这个应用时，都只会看到根Activity，task中的其他Activity都会被清除出栈。如果我们的应用中引用到了其他应用的Activity，这些Activity设置了allowTaskReparenting属性为“true”，则它们会被重新宿主到有共同affinity的task中。<br />小结：

1. 只作用于根Activity，其他Activity无效
2. 最近列表回到App，还是回到其他页面；从桌面点击App图标将回到根Activity
3. 设置了`allowTaskReparenting`将回到宿主task中去

案例：

```
假设有A,B两个Activity，在AndroidManifest.xml中将A Activity的设置了android:clearTaskOnLaunch="true"。

然后A中的操作启动了B，进入了B：

1）如果此时用户按了Home键回到主屏幕上，然后又点击了主屏幕上的A的icon图标启动应用。那么此时不是进入B，而是进入了A。

（2）如果用户按了屏幕下方的”最近任务列表“键，调出最近任务列表中，出现的是B，用户点击，此时又进入的是B。

 以上就是设置了android:clearTaskOnLaunch="true"后的Activity运行的细微差别。属性android:clearTaskOnLaunch，顾名思义，就是说，当设置此属性为true时候，每一次启动此Activity后，将清空以此Activity为根的Task。
```

**解决的需求：**

1. 每次从桌面进入都启动根Activity，其他Activity销毁

> 如果将最底层的那个Activity的这个属性设置为true，那么只要用户离开了当前任务，再次返回的时候就会将最底层Activity之上的所有其它Activity全部清除掉。简单来讲，就是一种和alwaysRetainTaskState完全相反的工作模式，它保证每次返回任务的时候都会是一种初始化状态，即使用户仅仅离开了很短的一段时间

#### finishOnTaskLaunch

这个属性与`clearTaskOnLaunch`属性相似，但它仅作用于单个的activity，而不是整个的task。<br />当它设置为“true”的时候，此activity仅做为任务的一部分存在于当前回话中，一旦用户离开并再次回到这个任务，此activity将不复存在。<br />`android:finishOnTaskLaunch="true"`在配置了该属性为true的activity中按home键返回到[home screen]屏幕后,再点击该应用的图标启动程序时,则系统会调用该activity的[onDestroy]销毁。因为点击应用的图标启动程序时,重新启动了这个任务。<br />[ps:因为有些项目需求是,点击应用图标必须显示项目的主界面且销毁某些之前打开的界面]。暂时还不会重新启动自己分配的[taskAffinity]任务,所以只能使用默认系统的taskAffinity,然后点击应用图标启动程序进行触发

1. 按home键后回来，就finish了，从最近列表中回来不会销毁
2. 对root Activity无效

> 这个属性和clearTaskOnLaunch是比较类似的，不过它不是作用于整个任务上的，而是作用于单个Activity上。如果某个Activity将这个属性设置成true，那么用户一旦离开了当前任务，再次返回时这个Activity就会被清除掉。

##### clearTaskOnLaunch和finishOnTaskLaunch

finishOnTaskLaunch属性与clearTaskOnLaunch 有些类似，它们的区别是finishOnTaskLaunch是作用在自己身上(把自己移除任务栈，不影响别的Activity)，而clearTaskOnLaunch则是作用在别人身上(把别的Activity移除任务栈)，如果我们把Activity的android:finishOnTaskLaunch属性值设置为true时，离开这个Activity所依赖的任务栈后，当我们重新返回时，该Activity将会被finish掉，而且其他Activity不会受到影响。

#### android:alwaysRetainTaskState

alwaysRetainTaskState实际上是给了当前Activity所在的任务栈一个“免死金牌”，如果当前Activity的android:alwaysRetainTaskState设置为true时，那么该Activity所在的任务栈将不会受到任何清理命令的影响，一直保持当前任务栈的状态。

> 如果将最底层的那个Activity的这个属性设置为true，那么上面所描述的默认行为就将不会发生，任务中所有的Activity即使过了很长一段时间之后仍然会被继续保留。

### singleInstance按返回键坑

> 查询当前任务栈：adb shell dumpsys activity

#### 问题

聊天室App启动顺序：<br />SplashActivity→VoiceRoomListActivity→VoiceChatRoomActivity

> VoiceChatRoomActivity为singleInstance，其他都为singleTop；WXPageActivity为weex的多级导航页面

现在在VoiceChatRoomActivity启动新的WXPageActivity，然后点击返回，直接返回到了VoiceRoomListActivity<br />分析：<br />因为VoiceChatRoomActivity是singleInstance，单独占有一个任务栈

#### 解决（利用TaskAffinity）

利用`taskAffinity`，将VoiceRoomListActivity启动的新的Activity都指定到同一个taskAffinity为`qsbk.app.voice.voicechatroom`。

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

> taskAffinity必须为xxx.xxx.xxx格式，否则APK会提示无效`INSTALL_FAILED_INVALID_APK`，一直安装不上。

#### TaskAffinity

> 1. affinity可以用于指定一个Activity更加愿意依附于哪一个任务，在默认情况下，同一个应用程序中的所有Activity都具有相同的affinity，所以，这些Activity都更加倾向于运行在相同的任务当中。当然了，你也可以去改变每个Activity的affinity值，通过元素的taskAffinity属性就可以实现了。
> 2. taskAffinity属性接收一个字符串参数，你可以指定成任意的值(经我测试字符串中至少要包含一个.)，但必须不能和应用程序的包名相同，因为系统会使用包名来作为默认的affinity值。

1. 如果单独设置TaskAffinity属性的话是没有任何效果的，只有Activity的launchMode设置成`singleTask`的时候才会生效的
2. TaskAffinity的值应该是xxx.xxx.xxx类似包名的，如果没有包括.的话是安装不了的；
3. 如果不指定TaskAffinity的话，默认的值是包名。
4. 启动Activity的时候会根据taskAffinity查找是否有存在的任务栈，没有的话就创建一个新的任务栈

### Ref

- Activity启动模式与任务栈(Task)全面深入记录（下）<br /><https://blog.csdn.net/javazejian/article/details/52072131>

# Activity杂项

## Android不让程序显示在最近程序列表中

### android:excludeFromRecents

`android:excludeFromRecents="true"`属性用于控制程序在不在recent列表中显示。<br />true时不显示；false显示，其中false为默认值。<br />运行activity后，不会显示在recent列表中。<br />程序正在运行或者退出，在长按HOME键的最近程序列表中不显示该应用以达到隐藏进程的目的。

> 有些博客描述android:excludeFromRecents是否起作用的关键是与android:launchMode="singleTask" 启动模式有关，但是经过测试发现，`android:excludeFromRecents`与应用是否具有`android.intent.category.LAUNCHER`属性有关，在主Activity有LAUNCHER的前提下，android:excludeFromRecents="true",才能达到在最近任务列表中隐藏该应用的目的。

> Note：注意：它需要设置在入口activity的属性里才起作用，给其他的activity设置不起作用。

### android:noHistory="true"

设置为TRUE，该activity不可见的时候就会消失

## excludeFromRecents 属性需要注意的小地方

在 Android 系统中，如果我们不想某个 Activity 出现在 “Recent screens” 中，可以设置  属性 `android:excludeFromRecents`为 true。其中有些需要注意到的地方说明下。<br />`android:excludeFromRecents` 属性并不会仅仅影响被设置的 Activity。由此该 Activity 启动的后续同属一个 “Task” 的一系列 Activity 都不会出现在 Recent screens。也就是说该属性是对 Task 起作用的，而不仅仅是某个 Activity。<br />所以想要后续的 Activity 能够出现在 Recent screens 中，就必须让后续 Activity 在新的 Task 中。<br />但是如果设置上面属性的 Activity 正是当前正在使用的，切换到 Recent screens 也是可以看到的。但是退到后台运行后，比如按下 Home 键，属性就会发生作用。<br />所以要想属性生效设置该属性的 Activity 必须是 **Task的根Activity**。如果在某个 Task 非根 Activity 中设置 android:excludeFromRecents 是没有任何效果的。

## Activity切换动画

### Activity切换动画(同一个任务栈之间页面切换动画)

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

在项目res目录下新建anim文件夹,里边放的都是动画,写入4个动画 in_from_right.xml ; in_from_right_close.xml ; out_to_left.xml ,out_to_left_colse.xml ;<br />具体代码如下:和Android默认的动画一致

- in_from_right.xml代码

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
2. 5.0+转场动画

### 去除Activity切换动画

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

> 在要退出的Activity的finish()加上：

```java
@Override
public void finish() {
    super.finish();
    overridePendingTransition(0,0);
}
```

### 任务栈之间页面切换动画

不同栈之间的动画切换,只需要在上边2步骤中加入下边4个属性,即可设置完成不同任务栈之间页面动画切换的设置:

```xml
<style name="AppTheme" parent="@style/Theme.AppCompat.Light.NoActionBar">
    <item name="android:taskOpenEnterAnimation">@anim/in_from_right</item>
    <item name="android:taskOpenExitAnimation">@anim/out_to_left</item>
    <item name="android:taskCloseEnterAnimation">@anim/in_from_right_close</item>
    <item name="android:taskCloseExitAnimation">@anim/out_to_left_colse</item>
</style>
```

## DialogActivity对话框style

- 配置style

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

## 启动来源Referrer

1. ~~Binder.getCallingUid()和 Binder.getCallingPid()，~~然后根据uid，pid查找到包名；不能在调用者startActivity()的时候获取到调用者的包名，只能用于Activity用到的Binder同步调用的地方。
2. Activity的 getCallingPackage()和 getCallingActivity() 只有在startActivityForResult()的时候才可以得到调用者的包名。
3. Activity的 getReferrer() （API21,Android5.1引入）不可靠的，因为调用者可以自己设置referrer的值。所以不能依赖此值来判断调用者。
4. 反射的方式获取Activity的 mReferrer: reflectGetReferrer()（API21,Android5.1引入）通过反射的方式reflectGetReferrer(）获取到的mReferrer，是调用者的包名，目前来看是可靠的，但是需要在Android5.1(Api level 22)以及之后才能用。

反射方式获取referrer安全保证

- [x] [Android Activity Deeplink启动来源获取源码分析](https://juejin.cn/post/7030977861691375629)
