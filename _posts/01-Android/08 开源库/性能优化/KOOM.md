---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# KOOM

## KOOM原理

### 如何监控内存并dump

定时轮询监控当前内存是否达到最大内存的阈值或者内存连续增加多少次;<br />为什么不使用主动GC的方式，GC是stop-the-world会让进程卡死，频繁的 GC 会造成用户感知的明显卡顿，线上监控不需要太过精准。

### 如何dump内存堆栈

通过开启子进程的方式dump进程的hprof，因为Copy On Write技术下父子进程共享同一块内存

> Copy On Write技术实现原理：
> fork()之后，kernel把父进程中所有的内存页的权限都设为read-only，然后子进程的地址空间指向父进程。当父子进程都只读内存时，相安无事。当其中某个进程写内存时，CPU硬件检测到内存页是read-only的，于是触发页异常中断（page-fault），陷入kernel的一个中断例程。中断例程中，kernel就会把触发的异常的页复制一份，于是父子进程各自持有独立的一份。

#### 难点一：主线程挂起问题

在 fork 子进程的时候 dump hprof。由于 dump 前会先 suspend 所有的 java 线程，等所有线程都挂起来了，才会进行真正的 dump。由于 copy-on-write 机制，子进程也会将父进程中的 threadList 也拷贝过来，但由于 threadList 中的 java 线程活动在父进程，子进程是无法挂起父进程中的线程的，然后就会一直处于等待中。 <br />为了解决这个问题，Koom 和 Liko 采用欺骗的方式，在 fork 子进程之前，先将父进程中的 threadList 全部设置为 suspend 状态，然后 fork 子进程，子进程在 dump 的时候发现 threadList 都为挂起状态了，就立马开始 dump hprof，然后父进程在 fork 操作之后，立马 resume 恢复回 threadList 的状态 。

#### 难点二：文件过大

由于hprof文件过大，需要对hprof文件进行裁剪。裁剪还有对用户数据脱敏的好处，只上传内存中类域对象的组织结构，并不上传真实的业务数据(诸如字符串、byte 数组等含有具体数据的内容)，保护了用户的隐私。

## 分析hprof

暴力解析引用关系树的 CPU 和内存消耗都是很高的，即使在独立进程解析，很容易触发 OOM 或者被系统强杀，成功率非常低。因此需要对解析算法进行优化。<br />我们只关注泄漏对象和不合理使用的大对象：

- 泄漏对象最典型的 Activity 和 Fragment，有着明显的生命周期特征且持有大量资源，除此外我们还对自定义核心组件做了泄漏判定，比如 Presenter。
- 常见的大对象有 Bitmap、Array、TextTure 等，Bitamp/TextTure 的数量、宽高，Array 长度等等可以结合业务数据比如屏幕大小、View Size 等进行判定。
- 有些对象既是泄漏也是大对象，关键对象的选取策略需要各 App 结合实际情况来灵活定制。

### 分析工具的选择

LeakCanary 早期使用的解析引擎是 HAHA，LeakCanary 2.0 版本的发布，其研发团队推出了新一代 hporf 分析引擎 Shark。

#### 解决混淆问题

Shark 支持混淆反解析，思路也很简单，解析 mapping.txt 文件，每次读取一行，只解析类和字段：

- 类特征 ：行尾为 : 冒号结尾，然后根据 -> 作为 index 分割，左边的为原类名，右边的为混淆类名。
- 字段特征：行尾不为 : 冒号结尾，并且不包含 (括号(带括号的为方法)，即为字段特征，根据 -> 作为 index 分割，左边为原字段名，右边的为混淆字段名。

将混淆类名、字段名作为 key，原类名、原字段名作为 value 存入 map 集合，在分析出内存泄漏的引用路径类时，将类名和字段名都通过这个 map 集合去拿到原始类名和字段名即可，即完成混淆后的反解析 。

### 分析hprof总结

- GC root 剪枝，由于我们搜索 Path to GC Root 时，是从 GC Root 自顶向下 BFS，如JavaFrame、MonitorUsed等此类 GC Root 可以直接剪枝。
- 基本类型、基本类型数组不搜索、不解析。
- 同类对象超过阈值时不再搜索。
- 增加预处理，缓存每个类的所有递归 super class，减少重复计算。
- 将object ID的类型从long修改为int，Android虚拟机的object ID大小只有32位，目前shark里使用的都是long来存储的，OOM时百万级对象的情况下，可以节省10M内存。

# Ref

<https://blog.csdn.net/qq_23191031/article/details/109457009> <br /><https://juejin.cn/post/6982121209144016910><br /><https://juejin.cn/post/7018883931067908132>
