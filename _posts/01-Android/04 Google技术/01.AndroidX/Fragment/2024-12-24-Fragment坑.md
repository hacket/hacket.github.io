---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# Fragment常见坑

## Fragment踩过的坑

**内存重启：** app运行在后台的时候，系统资源紧张的时候导致把app的资源全部回收（杀死app的进程），这时把app再从后台返回到前台的时候，app会重启；回收之前，系统会把Activity的状态保存下来，Activity的FragmentManager负责把Activity的Fragment保存起来。在内存重启后，Activity的恢复是从栈顶逐步恢复，Fragment会在宿主Activity的onCreate()方法调用后紧接着恢复(从onAttach()生命周期开始)

### 1、getActivity()空指针

原因：调用了getActivity()时，当前的Fragment已经onDetach()了宿主Activity。

```java
@Override
public void onAttach(Context context) {
    super.onAttach(context);

    mContext = context;
    //        mContext = getActivity();
}
```

1. 切换Fragment的时候，会频繁的被crash
2. 系统内存不足
3. 横竖屏幕切换的时候

> 以上情况都会导致Activity被系统回收，但是由于fragment的生命周期不会随着Actiivty被回收而被回收，因此才会导致getActivity()出现null的问题

解决：

1. 利用getApplicationContext()
2. Fragment生命周期<br />在Fragment的生命周期中，在生命周期处于onAttach()和onDetach()之间的时候getActivity()方法才不会返回null。

### 2、Fragment重叠异常-----正确使用hide、show的姿势

见下面的`Fragment重影`

### 3、Fragment嵌套的那些坑

### 4、不靠谱的出栈方法remove()

### 5、多个Fragment同时出栈的那些深坑BUG

### 6、超级深坑 Fragment转场动画

## Fragment内存重启

- Android解惑 - 为什么要用Fragment.setArguments(Bundle bundle)来传递参数<br /><http://blog.csdn.net/tu_bingbing/article/details/24143249>

> 其实就是在Activity重新创建onCreate的时候，会将args重新赋值给Fragment，所以通过setArguments传递的会保留

- 一个Activity中，出现crash，导致重启，白屏<br />[关于Activity被回收，Fragment还在的问题](https://github.com/android-cn/android-discuss/issues/256)
- Activity后台运行一段时间回来crash问题的分析与解决<br /><http://liuling123.com/2015/09/solution-crash-activity-back.html>

> 后台app，导致getActivity()为空

- Fragment 重叠(重影)问题<br /><http://wml.farbox.com/post/fragment-overlay-problem><br /><http://blog.csdn.net/leisurelife1990/article/details/51258749>
- Android 管理多个fragment(处理Activity被回收的情况)<br />[http://www.kesarblog.cn/2016/01/11/Android-管理多个fragment-处理Activity被回收的情况/](http://www.kesarblog.cn/2016/01/11/Android-%E7%AE%A1%E7%90%86%E5%A4%9A%E4%B8%AAfragment-%E5%A4%84%E7%90%86Activity%E8%A2%AB%E5%9B%9E%E6%94%B6%E7%9A%84%E6%83%85%E5%86%B5/)
- 关于 Android，用多个 activity，还是单 activity 配合(详细，值得好好看) fragment？<https://www.zhihu.com/question/39662488>

## Fragment之 java.lang.IllegalStateException  Can not perform this action after onSaveInstanceState

> IllegalStateException: Can not perform this action after onSaveInstanceState：解决办法：onSaveInstanceState方法是在该Activity即将被销毁前调用，来保存Activity数据的，如果在保存玩状态后<br />再给它添加Fragment就会出错。解决办法就是把commit（）方法替换成 commitAllowingStateLoss()

<https://bugly.qq.com/v2/crash-reporting/crashes/d33adba520/495?pid=1>

## Fragment重影之add、hide、show

**现象**<br />假设底部有3个tab: tab1,tab2,tab3,对应的引用分别为Fragment1Fg、Fragment2Fg、Fragment3Fg；通过FragmentManager进行add/show/hide操作；切换到tab1,此时tab1 = new Fragment1Fg(),即tab1变量指向new Fragment1Fg()；这个时候,按下Home长时间后台导致内存不足,系统回收了tab1的引用变成tab1 = null；而tab1的实例还是存在内存中的，只是引用被销毁了，这时候切换到tab2，隐藏tab1，显示tab2，而tab1已经为null，无法实现hide操作，而由于tab1的Fragment实例还在内存中，就会导致tab2和tab1重叠现象，再切换到tab1，由于tab1为null会再次创建tab1 = new Fragment1Fg()，此时会再去创建一个新的Fragment，放到tab1上，导致原来的tab1上的Fragment实例一直存在与内存中导致重影，置为被垃圾回收机回收

```java
Fragment1fg f1;
Fragment2fg f2;
private void f11() {
    FragmentTransaction transaction = manager.beginTransaction();
    f1 = new Fragment1fg();
    if (!f1.isAdded()) {
        transaction.add(R.id.framelayout, f1);
    }
    if (f2 != null && f2.isAdded()) {
        transaction.hide(f2);
    }
    transaction.commit();
}
private void f22() {
    FragmentTransaction transaction = manager.beginTransaction();
    f2 = new Fragment2fg();
    if (!f2.isAdded()) {
        transaction.add(R.id.framelayout, f2);
    }
    if (f1 != null && f1.isAdded()) {
        transaction.hide(f1);
    }
    transaction.commit();
}
```

- 模拟：开发者选项，不保留活动
- 重影现象：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688604235894-64c6a97e-5f9a-4a86-9bf6-906dddee4aaa.png#averageHue=%23edeb83&clientId=ua12473de-c970-4&from=paste&height=628&id=u7e198caf&originHeight=886&originWidth=549&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u23fd6da9-feab-4337-a66c-8fe659cbf44&title=&width=389)
- 解决 通过tag解决

```java
Fragment f1;
Fragment f2;
private void f11() {
    FragmentTransaction transaction = manager.beginTransaction();
    f1 = manager.findFragmentByTag("f1");
    f2 = manager.findFragmentByTag("f2");
    if (f1 == null) {
        this.f1 = new Fragment1fg();
    }
    if (!f1.isAdded()) {
        transaction.add(R.id.framelayout, this.f1, "f1");
    } else {
        transaction.show(f1);
    }
    if (f2 != null && f2.isAdded()) {
        transaction.hide(f2);
    }
    transaction.commit();
}
private void f22() {
    FragmentTransaction transaction = manager.beginTransaction();
    f1 = manager.findFragmentByTag("f1");
    f2 = manager.findFragmentByTag("f2");
    if (f2 == null) {
        f2 = new Fragment2fg();
    }
    if (!f2.isAdded()) {
        transaction.add(R.id.framelayout, f2, "f2");
    } else {
        transaction.show(f2);
    }
    if (f1 != null && f1.isAdded()) {
        transaction.hide(f1);
    }
    transaction.commit();
}
```

- 再次验证：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688604250849-9165c7fe-c840-443c-a8a4-ec70f0c8e124.png#averageHue=%23eeeb83&clientId=ua12473de-c970-4&from=paste&height=602&id=ud1b04e3b&originHeight=886&originWidth=549&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u024e2fd6-c674-449e-863e-2ad5702594a&title=&width=373)

## Ref

1. [Fragment全解析系列（一）：那些年踩过的坑](http://www.jianshu.com/p/d9143a92ad94)
2. Fragment全解析系列（二）：正确的使用姿势
3. Fragment之我的解决方案：Fragmentation
