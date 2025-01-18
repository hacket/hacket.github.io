---
date created: 2024-03-08 00:21
date updated: 2024-12-24 00:38
dg-publish: true
---

# 基础知识

## UI优化思路

1. 布局文件解析：io操作
2. 创建对象：反射

## Xml inflate 原理

- [[LayoutInflater 源码解析]]
- [[AsyncLayoutInflater]]

# 渲染优化

## 布局优化

### merge

merge 就是合并的意思。使用它可以有效优化某些符合条件的多余的层级。

在定义 View 的时候，可以把 xml 的根布局设置为 `merge`，减少一层

### ViewStub，异步 ViewStub

ViewStub 是一种不可见且大小为 0 的视图，可以延迟到 View 要用的时候再去 inflate。

### 打平布局（减少布局层级）

- [ ] [Android中布局层级过深为什么会对性能有影响？为什么 Compose 没有布局嵌套问题？](https://blog.csdn.net/Androiddddd/article/details/121905524)

#### 布局过深对性能的影响

为了优化界面加载速度，要尽可能的减少布局的层级。这主要是因为布局层级的增加，可能会导致测量时间呈指数级增长。主要是因为在某些情况下ViewGroup会对子View进行多次测量

之所以需要避免布局层级过深是因为它对性能的影响是指数级的

#### 系统布局多次测量问题

##### LinearLayout测量1~3次

设置了weight的child；可能导致2次或者3次测量

##### RelativeLayout

可能测量多次

##### FrameLayout measure2次

1. FrameLayout 自身的 MeasureSpec.Mode 不等于 `MeasureSpec.EXACTLY`。
2. 有两个或以上子 view ，其中有一个设置了match_parent

#### Compose没有布局嵌套问题？

而Compose却没有这个问题，它从根本上解决了布局层级对布局性能的影响: Compose界面只允许一次测量。这意味着随着布局层级的加深，测量时间也只是线性增长的.

## LayoutInflater.Factory 反射

View 创建的 hook ，减少反射带来的损耗

自定义自己的 `androidx.appcompat.app.AppCompatViewInflater`

## XML 编译期生成 View

### 掌阅 `X2C`

[得物布局构建耗时优化方案实践 - 掘金](https://juejin.cn/post/7345405978722861106#heading-2)

### 得物 `X2C`

[得物布局构建耗时优化方案实践 - 掘金](https://juejin.cn/post/7345405978722861106#heading-5)

## 异步加载

[[View 异步加载]]

## 避免过度绘制

### 过度绘制原因

**屏幕上某一像素点在一帧中被重复绘制多次，就是过度绘制。**<br>下图中多个卡片跌在一起，但是只有第一个卡片是完全可见的。背后的卡片只有部分可见。但是 Android 系统在绘制时会将下层的卡片进行绘制，接着再将上层的卡片进行绘制。但其实，下层卡片不可见的部分是不需要进行绘制的，只有可见部分才需要进行绘制。<br>![|500](https://cdn.nlark.com/yuque/0/2022/webp/694278/1658244603937-8a9b07f9-739f-4b7e-9d19-91a8aec3dd05.webp#averageHue=%23f8eee5&clientId=ua42c74d8-0218-4&errorMessage=unknown%20error&from=paste&id=uad5ae858&originHeight=736&originWidth=800&originalType=url&ratio=1&rotation=0&showTitle=false&status=error&style=none&taskId=ua05be553-b2d1-47ad-a738-72c0fb87dce&title=)<br>**依据过度绘制的层度可以分成：**

- 无过度绘制（一个像素只被绘制了一次）：原色
- 过度绘制x1（一个像素被绘制了两次）：蓝色
- 过度绘制x2（一个像素被绘制了三次）：绿色
- 过度绘制x3（一个像素被绘制了四次）：粉色
- 过度绘制x4+（一个像素被绘制了五次以上）：红色

> 在 Android 过度绘制调试模式下，颜色的闪烁不是持续的，而是在调试模式激活时用于临时可视化显示过度绘制的情况。过度绘制的颜色覆盖会显示在屏幕上，通常不会闪烁，而是作为一个静态颜色覆盖显示。
> 如果你看到颜色闪烁，这可能是因为界面正在进行动态更新或者是有动画正在运行，导致过度绘制区域也在不断变化。但过度绘制调试颜色本身是不会闪烁的，它们以静态覆盖的形式显示在界面上，帮助开发者定位和识别性能问题。如果你需要分析动态内容的过度绘制情况，可以在该内容静止时进行观察，或者暂时停止动画以更好地评估过度绘制。

**导致过度绘制的主要原因是：**

- XML布局：控件有重叠且都有设置背景。
- View自绘：View.OnDraw里面同一个区域被绘制多次。自绘制的可以用`clipRect`

### 过度绘制优化

1. 移除不必要的视图： 避免布局层次过深，简化视图层次结构，移除布局中不需要的视图元素。

2. 避免重叠的背景： 如果可能的话，避免在堆叠的视图上绘制背景，尤其是当它们完全覆盖下方的视图时。

> ImageView 的 background 和 imageDrawable 重叠 把背景图和真正加载的图片都通过 imageDrawable 方法进行设置。

3. 使用合适的视图分组： 使用 FrameLayout，RelativeLayout 或 ConstraintLayout 来减少视图层的嵌套深度，这些布局比 LinearLayout 嵌套效率更高。

4. 优化自定义视图： 如果你正在使用自定义视图，确保在 onDraw ()方法中尽量高效地绘制，避免不必要的绘制调用。

5. 使用 ViewStub 延迟加载： 对于不立即需要显示的视图，使用 ViewStub 来延迟加载，只在它们变为可见时才进行实例化和渲染。

6. 利用 Window 背景： 如果 App 的背景是一个纯色或者一个大的图像，考虑设置为窗口背景，而不是布局内的一个视图背景。

```xml
// 去除Activity自带的默认背景颜色
<style name="AppTheme" parent="android:Theme.Light.NoTitleBar">
  <item name="android:windowBackground">@null</item>
</style>
```

7. 剪裁重绘区域： 如果只需要更新视图的一小部分，可通过剪裁操作只重绘需要更新的区域，避免整个视图的重绘。

> 使用 Canvas 的 `clipRect` 和 `clipPath` 方法限制 View 的绘制区域

8. 使用`<merge>`标签： 当你的布局被用作子布局嵌入到其他布局中时，使用`<merge>`标签可以减少不必要的视图层级。

9. 减少全屏重绘： 动画或视图变化时，尽量减少全屏重绘，使用局部更新或硬件加速的方式提高绘制效率。

10. 分析和测试： 使用 Android 开发者选项中的"显示布局边界"和"GPU 过度绘制"工具来检测

11. ImageView的background和imageDrawable重叠

> 把背景图和真正加载的图片都通过imageDrawable方法进行设置。

## RecyclerView优化

### RecyclerView的基本设置

1. **prefetch开启**，默认开启，rv版本v25且手机是`Android5.1`及以上默认开启
2. **高度固定设置 setHasFixedSize(true)** ，RecyclerView有 item 插入、删除时等数量改变，会重新测量/布局各个 item，设置为 true 后，避免每次 item 数量变更时会调用 requestLayout()去重新测量高度
3. **Item设置监听 **对 ItemView 设置监听器，不要对每个 Item 都调用 addXxListener，应该大家公用一个 XxListener，根据 ID 来进行不同的操作，优化了对象的频繁创建带来的资源消耗；在createViewHolder中设置Listener，避免在bindViewHolder中设置
4. 设置 **RecyclerView.addOnScrollListener(listener) **来对滑动过程中停止加载的操作
5. **setHasStableIds(true)**

> 用notifyDataSetChanged时，适配器不知道整个数据集的哪些内容还存在，再重新匹配ViewHolder时会发生闪烁，设置setHasStableIds(true)并重写getItemId()来给每一个item一个唯一的id，就能够使得itemView的焦点固定，解决闪烁问题

6. **LinearLayoutManager.setInitialPrefectItemCount **横向列表初次显示时可见的item个数

> 使用场景：垂直列表RV嵌套了横向列表RV。
> 问题：用户滑动到横向列表的item RecyclerView的时候，由于需要创建更复杂的RecyclerView及多个子View，可能导致页面卡顿

### Adapter数据更新时，尽量用notifyItemXXX方法，避免全局刷新

### 利用payloads，将数据更新在一小块区域内，可避免图片闪烁问题

### 开启支持DiffUtils，让数据更新支持局部，避免全局刷新

### 通过setItemViewCacheSize(size); 来加大 RecyclerView 的缓存，用空间换时间来提高滚动的流畅性。默认2个（要注意内存占用问题）

### 复用RecycledViewPool

多个 RecyclerView 设置同一个 RecycledViewPool 对象实例
适用场景：多个RecyclerView具有相同的item布局结构时使用，可避免ViewHolder的创建

### getExtraLayoutSpace 来增加 RecyclerView 预留的额外空间

RecyclerView 的 item 比较高，一屏只能显示一个元素的时候，第一次滑动到第二个元素会卡顿。这种情况可以通过设置额外的缓存空间

### RecyclerView ViewHolder 异步加载，全局 View 缓存，提前加载

- 提前异步加载 ViewHolder，全局缓存
- RecylerViewPool

[RecyclerView inflate 优化 | Agehua](https://conorlee.top/2022/07/21/async-inflate-strategy/)
[爆表！RecyclerView性能提升200%，异步预加载大杀器！-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2321405)

## WebView优化

- [ ] [满满的WebView优化干货，让你的H5实现秒开体验。](https://juejin.cn/post/7043706765879279629)

# Ref

- [ ] [Android 页面异步加载优化的几种方案](https://mp.weixin.qq.com/s/dUHDYYWvhi2fUSmoVGQ96A)
