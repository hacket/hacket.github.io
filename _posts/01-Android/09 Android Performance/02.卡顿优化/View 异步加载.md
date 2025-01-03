---
date created: 2024-03-13 21:07
date updated: 2024-12-31 21:42
dg-publish: true
---

# AndroidX's AsyncLayoutInflater

## 介绍

Android 在 View 的使用中，过多的布局文件 inflate 影响性能，尤其在一些滚动列表、样式种类很丰富的场景下，inflate 次数相对较多，整体 inflate 耗时就会增加，导致滚动过程卡顿。

所以，需要 View 的异步 inflate，甚至 View 的全局缓存，通过这些方式，去减少 UI 线程 inflate 的耗时及次数，以便减少卡顿，提升性能。

## AndroidX's 限制

- 单一的线程
- 如果超过 10 个 items，主线程会 delay
- 不支持设置一个 `LayoutInflater.Factory` 和 `LayoutInflater.Factory2`
- 没有方式取消正在进行的 inflate 操作

## 异步加载，协程

[OkLayoutInflater/oklayoutinflator/src/main/java/tech/okcredit/layout\_inflator/OkLayoutInflater.kt at master · okcredit/OkLayoutInflater · GitHub](https://github.com/okcredit/OkLayoutInflater/blob/master/oklayoutinflator/src/main/java/tech/okcredit/layout_inflator/OkLayoutInflater.kt)

# View 的异步 Inflate+ 全局缓存 View：加速你的页面

- 方案：

布局异步加载，全局缓存

- 存在的问题
  1. 异步 Inflater，View 使用了 Handler，通过了反射的方式，强制把后台的线程的 Looper 设置为 mainLooper，这样后台线程 new Handler ()方式也能把消息抛到主线程消息队列 ![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403080056535.png)
  2. 异步 Inflater，在 View 中使用了 LiveData observe，注意子线程问题
  3. 全局缓存 View，View context 的问题，在全局缓存时，为了解决创建 view 的 context 不一定是 activity 导致的问题，或者是 activity 导致的内存泄露问题，对 Context 做封装：新建了 ViewContext 代理类：![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403080058213.png)
- 思路
  1. View 缓存大小控制，动态更改，LRU？
  2. View 的状态标记，方便管理 View
  3. 异步创建 View，提前缓存，减少 View inflate 的耗时
  4. 内存管理，监听 APP 内存状态，及时释放缓存
  5. RecyclerView 中的 ViewHolder
  6. 注意全局创建 View 的 LayoutParams 丢失问题

[View的异步Inflate+全局缓存：加速你的页面_文化 & 方法_阿里巴巴文娱技术_InfoQ精选文章](https://www.infoq.cn/article/pwylrfrsh8wce1ltyb1u)

### 异步加载问题

#### LiveData observe{} 主线程问题

#### AssertManager 锁问题

<https://console.firebase.google.com/u/0/project/shein-3876/crashlytics/app/android:com.zzkko/issues/78d4628954f9d5fb407d0ddb5fb09b0e?time=last-thirty-days&types=ANR&sessionEventKey=65EB7405038F000151B6ABE841EF83F8_1923387960291323411>
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240312161550.png)

```
main (blocked)
tid=1 systid=20274 | waiting to lock <0x0052b884> (android.content.res.AssetManager) held by thread 125
Triggered ANR
main (blocked):tid=1 systid=20274 | waiting to lock <0x0052b884> (android.content.res.AssetManager) held by thread 125
       at android.content.res.AssetManager.applyStyle(AssetManager.java:1180)
       at android.content.res.ResourcesImpl$ThemeImpl.obtainStyledAttributes(ResourcesImpl.java:1355)
       at android.content.res.Resources$Theme.obtainStyledAttributes(Resources.java:1690)
       at android.content.Context.obtainStyledAttributes(Context.java:887)
       at android.view.ViewGroup$MarginLayoutParams.<init>(ViewGroup.java:8556)
       at androidx.constraintlayout.widget.ConstraintLayout$LayoutParams.<init>(ConstraintLayout.java:2910)
       at androidx.constraintlayout.widget.ConstraintLayout.generateLayoutParams(ConstraintLayout.java:1934)
       at androidx.constraintlayout.widget.ConstraintLayout.generateLayoutParams(ConstraintLayout.java:486)
       at android.view.LayoutInflater.rInflate(LayoutInflater.java:1129)
       at android.view.LayoutInflater.rInflateChildren(LayoutInflater.java:1088)
       at android.view.LayoutInflater.rInflate(LayoutInflater.java:1130)
       at android.view.LayoutInflater.rInflateChildren(LayoutInflater.java:1088)
       at android.view.LayoutInflater.inflate(LayoutInflater.java:686)
       at android.view.LayoutInflater.inflate(LayoutInflater.java:538)
       at com.zzkko.si_category.CategoryFragment.onCreateView(CategoryFragment.kt:119)
       at androidx.fragment.app.Fragment.performCreateView(Fragment.java:3104)
       at androidx.fragment.app.FragmentStateManager.createView(FragmentStateManager.java:524)
       at androidx.fragment.app.FragmentStateManager.moveToExpectedState(FragmentStateManager.java:261)
       at androidx.fragment.app.FragmentManager.executeOpsTogether(FragmentManager.java:1899)
       at androidx.fragment.app.FragmentManager.removeRedundantOperationsAndExecute(FragmentManager.java:1817)
       at androidx.fragment.app.FragmentManager.execSingleAction(FragmentManager.java:1729)
       at androidx.fragment.app.BackStackRecord.commitNowAllowingStateLoss(BackStackRecord.java:323)
       at com.zzkko.si_main.MainTabsActivity.safeAddFragment(MainTabsActivity.kt:1736)
       at com.zzkko.si_main.MainTabsActivity.initFragments(MainTabsActivity.kt:1775)
       at com.zzkko.si_main.MainTabsActivity.init$lambda-23(MainTabsActivity.kt:1936)
       at com.zzkko.si_main.MainTabsActivity.$r8$lambda$qCxjN0u8Pnm_kU3fyYIR-u4a2xQ(MainTabsActivity.kt)
       at com.zzkko.si_main.MainTabsActivity$$InternalSyntheticLambda$0$41221826ff81153d89c8359c62d585def63fbe1a877da80880266ae3e21e8eef$2.queueIdle$bridge(MainTabsActivity.kt:8)
       at android.os.MessageQueue.next(MessageQueue.java:404)
       at android.os.Looper.loopOnce(Looper.java:161)
       at android.os.Looper.loop(Looper.java:288)
       at android.app.ActivityThread.main(ActivityThread.java:8115)
       at java.lang.reflect.Method.invoke(Native method)
       at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:703)
       at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:911)
```
