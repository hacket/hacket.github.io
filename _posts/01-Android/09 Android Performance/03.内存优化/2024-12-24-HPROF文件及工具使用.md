---
date created: 2024-12-24 00:38
date updated: 2024-12-24 00:38
dg-publish: true
---

# hprof基础

## 什么hprof文件？

hprof是由JVM TI Agent HPROF生成的一种二进制堆转储格式，hprof文件保存了当前Java堆上所有的内存使用信息，能够完整的反映虚拟机当前的内存状态。<br />保存的对象信息和依赖关系是静态分析内存泄漏的关键。

## 如何抓取hprof文件

### 1. Debug.dumpHprofData(path)

但这个dump过程会suspend所有的Java线程，导致用户界面无响应很久，所以不能随意dump；所以LeakCanary采用了预判的方式：在onDestroy先检测一下当前Activity是否存在泄漏的风险，如果有这种情况，就开始dump，需要注意的是在onDestroy做检测仅仅是预判，并不能断定真正发生了泄漏，真正的泄漏需要通过分析hprof文件才能知晓

#### dump原理？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681663500083-9ff06dc2-a8ed-4c7f-96db-72ff6e9e7382.png#averageHue=%23eeeeee&clientId=u1996f963-6069-4&from=paste&id=u5a22e9ed&originHeight=408&originWidth=1484&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=62881&status=done&style=none&taskId=u83436bc9-0b3e-4160-bd61-e293011ed0e&title=)

### 2. adb命令行

adb shell am dumpheap pid /data/local/tmp/x.hprof 生成指定进程的hprof文件到目标目录<br /><https://juejin.cn/post/6867335105322188813>

## hprof文件格式

- [ ] [HPROF Binary Dump Format (format=b)](https://hg.openjdk.org/jdk6/jdk6/jdk/raw-file/tip/src/share/demo/jvmti/hprof/manual.html#mozTocId848088)

### Java hprof

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681663226235-959f26c6-c076-4257-a351-dedad4a88635.png#averageHue=%23fafaf8&clientId=u1996f963-6069-4&from=paste&id=u905aaa06&originHeight=1552&originWidth=2338&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=288487&status=done&style=none&taskId=u7d6104ff-9fe0-416a-81c9-3f7194aeb45&title=)

### Android hprof

Android在Java的基础上新增了部分Tag。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681663312830-6246228e-9f0f-4f87-a70d-abfc4dd59e57.png#averageHue=%23f6f5f4&clientId=u1996f963-6069-4&from=paste&id=u57a0614e&originHeight=2016&originWidth=3242&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=506352&status=done&style=none&taskId=u34412323-dd51-48cf-898c-686ea0614cb&title=)

## hprof中一些术语

### Allocations：堆中的实例数

### Shallow Size

对象自身占用的内存大小，包含它的成员变量所占用大小，不包括它引用的对象大小

- 对于非数组类型的对象，它的大小就是对象本身与它所有成员变量大小的总和
- 对于数组类型的对象，它的大小是数组元素对象大小的总和

Shallow Size = 类定义 + 属性占用空间 + 位数对齐<br />64位机器：

- 类定义：声明一个类本身所需的空间，固定为 8 个字节。类定义空间不会重复计算，即使类继承了其他类，也只算 8 个字节。定义了一个没有任何属性的类，查看其 Shallow Size 大小为 8 个字节。
- 属性占用空间：所有属性所占空间之和，包括自身的和父类的所有属性。属性分为基本类型和引用，如 int 类型占 4 个字节，long 类型占 8 个字节，引用固定 (String, Reference) 占 4 个字节。
- 位数对齐：使总空间为 8 的倍数。比如某个类以上两项共 21 字节，那么为了对齐，会取最接近 8 的倍数的值，即它的 Shallow Size 是 24 个字节。与系统有关，有的不会对齐。

案例：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681660028785-bac87616-9984-4594-a167-0c022c8e4051.png#averageHue=%23dbdada&clientId=ua771926c-e659-4&from=paste&height=206&id=u4fcfd076&originHeight=346&originWidth=456&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=31954&status=done&style=none&taskId=u98af4a74-ca58-4380-a2cf-4609588a49d&title=&width=271)

> Object A的Shallow Size：Object A+c、d、e属性占用大小(不包括引用对象的大小)

```kotlin
// Shallow Size = 28 = 8 + 4 + 8 + 4 + 4，没有位数对齐
// Retained Size = 36 = 28 + 8
data class Resource( // 8B
    val int: Int, // 4B
    val long: Long, // 8B
    val string: String, // 4B
    val reference: Res // 4B
)

// Shallow Size = 8
class Res()
```

### Retained Size GC后能释放多少内存大小

Retained Size 是指某个实例被回收时，可以同时被回收的实例的 Shallow Size 之和；被其他所引用的对象不会被回收的不算进去

> **Retained Size就是当前对象被GC后，从Heap上总共能释放掉的内存**，需要排除被其他GC Roots直接或间接引用的对象

因此在进行内存分析时，我们需要重点关注 Retained Size 较大的实例；<br />也可以通过 Retained Size 判断出某个实例内部使用的实例是否被其他实例引用，比如说如果某个实例的 Retained Size 比较小，Shallow Size 比较大，说明它内部使用的某个实例还在其他地方被引用了(比如说对 Bitmap 实例而言，如果它的 Retained Size 很小，可以说明它内部的 byte 数组被另外的 Bitmap 实例复用了)。

实例A的Retained Size是指, 当实例A被回收时，可以同时被回收的实例的Shallow Size之和<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681660068299-3d3b3fa4-5b16-4711-ac5d-6bcbe5497da2.png#averageHue=%23dcdadc&clientId=ua771926c-e659-4&from=paste&height=215&id=uc3fe24fc&originHeight=322&originWidth=433&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=93052&status=done&style=none&taskId=uda64b82a-53da-420a-8da3-734a58dee52&title=&width=288.6666666666667)

> Object A的Retained Size=ObjectA的大小和c、d、e引用对象的大小，但e引用对象的大小不会被算入，因为该对象被ObjectB引用着，不能被GC

一个ArrayList对象持有100个对象，每一个占用16 bytes，如果这个list对象被回收，那么其中100个对象也可以被回收，可以回收16*100 + X的内存，X代表ArrayList的shallow大小。<br />**Retained Heap可以更精确的反映一个对象实际占用的大小**

### native size

native size：Android8.0之后的手机会显示，主要反应Bitmap所使用的像素内存（8.0之后，转移到了native）

# hprof文件查看

## Android Studio Profiler Momory

### Profiler Momory使用

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706187830572-a1ebab39-506d-4948-ac49-154976d2813f.png#averageHue=%23629d80&clientId=ue533e3a8-2541-4&from=paste&height=802&id=ueb993f8e&originHeight=1604&originWidth=3600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=292608&status=done&style=none&taskId=ue9309a94-ca84-46b2-94fe-4610a3b5da3&title=&width=1800)<br />有2个内存泄漏：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706188083749-e4029efe-38ad-4acd-a3b1-1721e8956b63.png#averageHue=%233e4143&clientId=ue533e3a8-2541-4&from=paste&height=737&id=uf6d7618f&originHeight=1474&originWidth=3516&originalType=binary&ratio=2&rotation=0&showTitle=false&size=575695&status=done&style=none&taskId=u5de26f26-09bb-425d-99ad-d205926e364&title=&width=1758)<br />查看内存泄漏引用链条：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706188153389-0da64889-8144-4950-b769-2121238d38bc.png#averageHue=%233d4145&clientId=ue533e3a8-2541-4&from=paste&height=734&id=u6ecac824&originHeight=1468&originWidth=3512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=493099&status=done&style=none&taskId=u37d5c176-d325-4c64-ab19-95a9d06a5e9&title=&width=1756)

### Profiler Memory查看HPROF文件

Android Studio 的 Profiler 工具支持 hprof 的解析，并且很智能的提示当前 leak 了哪些对象，打开方式很简单，将 hprof 文件拖拽至 as，然后双击 hprof 文件即可：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681575657041-47e02508-2168-4a0b-80cb-4575654c569e.png#averageHue=%233c4043&clientId=u8982ffab-b217-4&from=paste&height=828&id=u2652fb1e&originHeight=1242&originWidth=2476&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=160625&status=done&style=none&taskId=u384e4450-ad74-4818-9c42-c5029759990&title=&width=1650.6666666666667)<br />从左侧的菜单中，选择需检查的堆：

- **default heap**：当系统未指定堆时。
- **image heap**：系统启动映像，包含启动期间预加载的类。此处的分配确保绝不会移动或消失。
- **zygote heap**：写时复制堆，其中的应用进程是从 Android 系统中派生的。
- **app heap**：您的应用在其中分配内存的主堆。
- **JNI heap**：显示 Java 原生接口 (JNI) 引用被分配和释放到什么位置的堆。

从右侧的菜单中，选择如何安排分配：

- **Arrange by class**：根据类名称对所有分配进行分组。这是默认值。
- **Arrange by package**：根据软件包名称对所有分配进行分组。
- **Arrange by callstack**：将所有分配分组到其对应的调用堆栈。

如果我们的需求仅仅只是在开发阶段进行内存泄漏检测的话，并且又不想接入 LeakCanary（因为有时候想调试下自己模块的代码，其他模块经常报内存泄漏，冻结当前线程，很影响调试），那么我们可以在应用里面埋个彩蛋，比如单击 5 次版本号，然后调用 Debug.dumpHprofData ，然后将 hprof 文件导出到 as 进行分析，这就将原本可能会进行数次 dump 的过程，改成了自己需要去检测的时候再去 dump。

## MAT

### 什么是MAT？

Memory Analyzer 工具，简称：MAT 。MAT 是 Eclipse 下的一个软件，专门用来分析 Java内存堆。<br />MAT可以打开 ` .hprof  `，但是从Android里面的导出的 .hprof 文件，MAT 是不支持查看的，所以需要转化一下，Android SDK 自带了转化工具。`android_sdk/platform-tools/` 目录中提供的 `hprof-conv`工具执行此操作：`hprof-conv 源hprof文件 转换后hprof文件`

> hprof-conv heap-original.hprof heap-converted.hprof

### MAT功能介绍

**MAT分析HPROF文件：**

1. File→Open File打开hprof文件
2. 在弹出的对话框，选择默认，Leak Suspects Report，可以帮我们分析内存泄漏

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681834712732-c6c6a2ba-9ef3-4313-8fe2-dd41f440bec3.png#averageHue=%23ebeae9&clientId=u9851ef9c-c927-4&from=paste&height=314&id=u8ba7db4c&originHeight=604&originWidth=832&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=44152&status=done&style=none&taskId=u931015e5-6a62-4a8b-85fd-70d3255af1e&title=&width=432.66668701171875)

3. 打开的页面

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1681921811251-79a24f4a-0175-49da-b3e9-9abfbf6ff3ed.png#averageHue=%23fbfbfb&clientId=u9851ef9c-c927-4&from=paste&height=918&id=uca7560af&originHeight=1438&originWidth=1866&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=80695&status=done&style=none&taskId=uc158f665-84dd-4f22-9715-8c068ba11c4&title=&width=1191)

#### Overview下功能解释

Overview页签下分别包含了：**Actions**，**Reports**，**Step By Step** 三大块功能；

- Shallow Heap 对象本身大小，不包含其引用的对象大小，包含其成员变量的大小；数组的话是其成员的大小总和
- Retained Heap 当前对象的大小+当前对象直接或间接引用到的对象大小（回收当前对象可以回收多少内存，需要排除被当前对象引用但被GC Roots直接或间接引用的对象，导致回收不了）

##### Actions

1. **Histogram** 列举每个类所对应的对象个数及所占用的内存大小

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682006594148-977ac366-7394-48b8-a560-cc305f7d7787.png#averageHue=%23f9f7f6&clientId=u9851ef9c-c927-4&from=paste&height=942&id=uec77d796&originHeight=1539&originWidth=2560&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=308454&status=done&style=none&taskId=u63900e0a-1c72-4c56-95ed-8f93c7f910f&title=&width=1567)

2. **Dominator Tree** 以占用总内存的百分比的方式列举出所有的实例对象（列举出的对应的对象而不是类，这个视图是用来发现大内存对象的）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682006870462-841d4a02-5441-4de5-8b08-ca859d35b7d9.png#averageHue=%23f6f3f0&clientId=u9851ef9c-c927-4&from=paste&height=364&id=uf8124174&originHeight=546&originWidth=1732&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=125699&status=done&style=none&taskId=ue55bbe4a-5777-45fc-ac3b-00946a6011d&title=&width=1154.6666666666667)<br />现在需要查看该对象都引用了哪些数据，已经当前对象被哪几个对象所引用了：鼠标在当前所要查看的对象右键，点击List Objects可以看到分别提供了：

- **with outgoing references** 列出该类引用了哪些类
- **with incoming references **列出哪些类引入该类

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682006968116-0b598adb-9c0c-401a-a582-1a86c2e0173c.png#averageHue=%23f3efed&clientId=u9851ef9c-c927-4&from=paste&height=195&id=u73e97c69&originHeight=293&originWidth=966&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=96835&status=done&style=none&taskId=u8b9ba7f2-2775-46b5-af79-a79d34ae24e&title=&width=644)<br />快速找出某个实例没被释放的原因，可以右健 `Path to GC Roots-->exclude all phantom/weak/soft etc. references`<br />它展示了对象间的引用关系

3. Top Consumers 按照类和包分组的方式展示出占用内存最大的一个对象

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682007145961-4e16fdd8-80ab-44f7-920d-e4f202f1698b.png#averageHue=%23fafafa&clientId=u9851ef9c-c927-4&from=paste&height=471&id=u0ce7c3cb&originHeight=1438&originWidth=1994&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=123601&status=done&style=none&taskId=u88c449a1-812f-4efb-9d29-aa7252585f1&title=&width=653)

4. Duplicate Classes 检测由多个类加载器所加载的类信息（用来查找重复的类）

##### Reports

1. **Leak Suspects **通过MAT自动分析当前内存泄漏的主要原因

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682007181394-18da834e-1417-4772-9ade-20b472549ff0.png#averageHue=%23f9f9f5&clientId=u9851ef9c-c927-4&from=paste&height=959&id=u92c6cc0e&originHeight=1438&originWidth=1994&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=168097&status=done&style=none&taskId=u997e2bb9-23cd-4f67-8b41-b70c931820f&title=&width=1329.3333333333333)<br />MAT会给出内存泄漏的主要原因，点进去Detail<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682096832803-75649d83-11ef-496f-9cc9-0fe06b45b4f9.png#averageHue=%23f6f4f0&clientId=u3be70601-fba4-4&from=paste&height=959&id=uc1619b90&originHeight=1438&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=227658&status=done&style=none&taskId=u1225137c-8906-497f-b373-a512ec0bc3e&title=&width=1280)

> 可以看到占用94%内存的是一个ArrayList，其中每个Person对象占用了15%的内存

2. Top Components Top组件，列出大于总堆1%的组件的报告

##### Step By Step

1. Component Report 组件报告，分析属于公共根包或类加载器的对象

#### 其他

##### Thread_Overview

查看当前进程dump时的所有线程的堆栈信息，通过分析下面所对应的堆栈信息，可以很快速的定位到对应的线程所执行的方法等层级关系，以此来定位对应的异常问题；<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682008400593-b8e9b76c-7599-4f23-8bfc-8d346cfa57a4.png#averageHue=%23dba767&clientId=u9851ef9c-c927-4&from=paste&height=354&id=aX1EJ&originHeight=813&originWidth=1506&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=116167&status=done&style=none&taskId=u21467215-c24a-4736-a502-5703eb86052&title=&width=656)

##### Heap Dump Overview

可以查看全局的内存占用信息<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682008691554-5d1e4e8c-ebff-4313-880a-d4710573e081.png#averageHue=%23fafafa&clientId=u9851ef9c-c927-4&from=paste&height=288&id=ELRIp&originHeight=1438&originWidth=1920&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=92010&status=done&style=none&taskId=u757262a4-9c13-4d47-a0ab-c5952d20c03&title=&width=384)

### 分析hprof文件示例

#### OOM分析

**OOM示例代码**

```java
public class HeapOom {
    static List<String[]> stringList = new ArrayList<>();
    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            String[] strings = new String[4 * 1024 * 1024];  //35m的数组（堆）
            stringList.add(strings);
        }
        System.out.println("HeapOom demo " + stringList);
    }
}
```

**JVM参数配置**<br />配置JVM运行参数：`-Xms20M -Xmx20M -XX:+PrintGCDetails -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=C:\Users\hacket\Desktop`

- **-Xms** 和 **-Xmx** 参数来设置堆的初始大小和最大大小
- **-XX:+PrintGCDetails** 会在每次 GC 时打印详细信息
- **-XX:+HeapDumpOnOutOfMemoryError** 表示在发生内存溢出时导出此时堆中相关信息
- **-XX:HeapDumpPath=<file-path>** 用于指定导出堆信息时的路径或文件名

**MAT分析HPROF文件**

1. 得到hprof文件
2. 使用MAT内存分析工具去检测占用大内存可疑对象
3. 分析对象到GC Roots节点的可达性

> 流程很繁琐，是否有自动化工具，自动帮我们去分析那些常见的内存泄漏场景呢？

#### 内存泄漏分析

**示例代码：**

```java
private void initLeaks(Application application) {
    application.registerActivityLifecycleCallbacks(new EmptyActivityLifecycleCallbacks() {
        @Override
        public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {
            ActivityMaker.getList().add(activity);
        }
    );
}
object ActivityMaker {
    @JvmStatic
    val list = mutableListOf<Activity>()
}
```

**分析步骤：**

1. 通过Leak Suspects 界面提示查找可能存在内存的泄露

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682266583797-43ca2fcc-367a-4e67-9e6e-1c072855aeb4.png#averageHue=%23faf9f3&clientId=u94c2849b-b836-4&from=paste&height=423&id=u44766b28&originHeight=1364&originWidth=1914&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=153942&status=done&style=none&taskId=u6bce4f0d-1633-4907-92cd-f6b4813b5ce&title=&width=593)<br />上图可以看到发现了2处可疑内存泄漏，点进去Details，可能并没有<br />我们还可以通过`dominator tree`视图，搜索Activity，右键选择某个Activity，选择`Path To GC Roots`或 `Shortest Paths To the Accumulation Point`（表示GC root到内存消耗聚集点的最短路径，如果某个内存消耗聚集点有路径到达GC root，则该内存消耗聚集点不会被当做垃圾被回收）

> 一般选择`Path To GC Roots`或 `Shortest Paths To the Accumulation Point`后，exclude 虚/弱/软引用，它们会被GC回收，不需要分析

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682268597692-e3cd9635-3251-4066-b4a2-80f57d739483.png#averageHue=%23f5eeec&clientId=u94c2849b-b836-4&from=paste&height=207&id=ud934a247&originHeight=311&originWidth=1719&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=56147&status=done&style=none&taskId=ub6f126e1-de92-42cf-9cc7-ed56571c6b3&title=&width=1146)

#### 内存快照对比

为了更有效率的找出内存泄露的对象，一般会获取两个堆转储文件（先dump一个，隔段时间再dump一个），通过对比后的结果可以很方便定位

## 基于Haha

在 LeakCanary 的第一版的时候，是采用的 Haha 库来分析泄漏引用链，但由于后面新出的 Shark，比 HaHa 快 8 倍，并且内存占用还要少 10 倍，但查找泄漏路径的大致步骤与 Shark 无异

### Matrix

### LeakCanary 1.x

## 基于Shark

### Liko

### Koom

### LeakCanary 2.x

## MMAT

<https://github.com/hehonghui/mmat><br />在App运行结束之后进行全面、自动地离线分析app内存泄漏, 一次性分析出本次App运行产生的所有Activity、Fragment的内存泄漏, 那么将会让内存泄漏分析更加全面、高效.

# hprof文件的裁剪、压缩

## Why？为什么要裁剪hprof文件？

1. 存储不方便

hprof是堆内存快照文件，通常文件都很大，可能超过100M，会占用很大的应用空间，如果空间不够，会导致dump失败

2. 分析时容易OOM

如果hprof文件过大，在设备上进行分析操作时，可能导致OOM

3. 传输

要分析线上用户的hprof文件，需要网络传输，太大不方便传输且耗费网络，回传成功率会比较低

3. 隐私

hprof记录完整的内存数据，可能会记录一些用户的隐私数据在其中

## How？裁剪的方式

### 先dump hprof文件后裁剪

**过程**

1. 通过`Debug.dumpHprofData()`得到一个完整的hprof文件
2. 再分析hprof文件，进行裁剪，去掉一些无用的数据
3. 裁剪完成后，得到一份精简的hprof文件

**缺点：**

1. 直接dump出的hprof文件过大，存储问题不好解决
2. 裁剪过程涉及到文件IO和hprof文件解析，可能影响App性能
3. 裁剪过程不彻底，导致隐私数据的泄漏

### 在dump过程中实时裁剪（推荐）

**过程：**

1. 通过xHook对open()/write()进行hook处理，替换成自身实现；
2. 调用`Debug.dumpHprofData()`时，优先执行自身实现的open，为了过滤出写入目标文件的fd；然后再调用到自身实现的write，对目标文件写入的数据进行裁剪压缩
3. 生成hprof文件完毕后，清除之前的hook内容，避免影响后续的流程

### 需要裁剪的内容

需要裁剪掉全部基本类型数组的值，如`char[](字符串)`、`byte[](图片)`，在处理内存泄漏相关问题时，一般也只关心对象间的引用以及对象大小，裁剪掉一些消息不会影响分析<br />保证基本hprof文件功能：

- 只对`HEAP_DUMP_SEGMENT`的`Record`下进行裁剪，其他保持不变，如`STRING`、`LOAD_CLASS`等
- 在`HEAP_DUMP_SEGMENT`的`Record`下，主要删除Tag为`PRIMITIVE_ARRAY_DUMP`，这一块主要占用80%的内容
- 在裁剪`INSTANCE_DUMP(实例)`、`OBJECT_ARRAY_DUMP(对象数组)`，`CLASS_DUMP(类或接口)`和`HEAP_DUMP_INFO(记录当前堆位置)`时需要再去掉`Zygote Heap(系统堆)`和`Image Heap(图像堆)`

> 主要通过判断HEAP_DUMP_INFO的heapType是否为HEAP_ZYGOTE(Z)和HEAP_IMAGE(I)

## 开源库裁剪

### Probe（美团）

- [ ] [Probe：Android线上OOM问题定位组件](https://tech.meituan.com/2019/11/14/crash-oom-probe-practice.html)

### Tailor（西瓜视频）

- [ ] [西瓜视频稳定性治理体系建设一：Tailor 原理及实践](https://mp.weixin.qq.com/s?__biz=MzI1MzYzMjE0MQ==&mid=2247487203&idx=1&sn=182584b69910c843ae95f60e74127249&chksm=e9d0c501dea74c178e16f95a2ffc5007c5dbca89a02d56895ed9b05883cf0562da689ac6146b&mpshare=1&scene=23&srcid=1214vdTTpPyczmY38wlcDo94&sharer_sharetime=1607926324661&sharer_shareid=65073698ab9ac2983b955fa53b4ff585%23rd)

### KOOM（快手）

# dump hprof注意

## 如何解决Dump hprof时暂停所有线程问题？

**问题：**<br />在主进程进行Dump hprof操作，会在主进程上所有线程都会停止，会导致应用停顿几秒，也就无法进行任何操作；还可能触发ANR；这也是LeakCanary只能用于线下检测。<br />KOOM和Liko采用Linux的`copy-on-write`机制，从当前的主进程fork出一个子进程，然后在子进程进行dump分析

> 坑：在fork子进程的时候dump hprof，由于dump前会先suspend所有的Java进程，等所有线程都挂起来了，才会进行真正的dump。由于COW机制，子进程也会将父进程中的threadlist也拷贝过来，但由于threadlist中java线程活动在父进程，子进程是无法挂起父进程中的的线程的，会一直处于等待中。

**解决方案1：子进程**<br />启动一个子进程，并且需要从主进程fork出一个子进程，需要遵循COW机制(为了节省fork子进程的内存消耗和耗时，fork出的子进程并不会copy父进程的内存空间，而是共享)。<br />后续fork出的子进程在父进程修改时不受影响。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682095695816-f2c4214a-bfca-4cbb-9783-bbdb2b530e2a.png#averageHue=%231a3d53&clientId=u9851ef9c-c927-4&from=paste&height=361&id=uefe10f13&originHeight=953&originWidth=1139&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=105298&status=done&style=none&taskId=ub98bb3cf-bb6c-41f5-95c4-6f430bcd053&title=&width=431)<br />**解决方案2：头条FileObserver**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1682095803395-d9d06216-1115-41ed-a0fc-5ff4b76a9276.png#averageHue=%23f7f9f6&clientId=u9851ef9c-c927-4&from=paste&height=490&id=u8c4bfbb4&originHeight=1120&originWidth=624&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=131460&status=done&style=none&taskId=u762a3968-64d9-4a90-9a62-eb2a769a321&title=&width=273)

## 混淆问题

**Shark**支持混淆反解析，解析mapping.txt文件，每次读取一行，只解析类和字段；将混淆类名、字段名作为 key，原类名、原字段名作为 value 存入 map 集合，在分析出内存泄漏的引用路径类时，将类名和字段名都通过这个 map 集合去拿到原始类名和字段名即可，即完成混淆后的反解析。<br />**LeakCanary** 内部是写死的 mapping 文件为 `leakCanaryObfuscationMapping.txt`，如果打开该文件失败，则不做引用链反解析：也即意味着，如果想 LeakCanary 支持混淆反解析，只需要将自己的 mapping 文件重命名为 `leakCanaryObfuscationMapping.txt`，然后放入 asset 目录即可<br />Koom 的混淆反解析，Koom 并没有做
