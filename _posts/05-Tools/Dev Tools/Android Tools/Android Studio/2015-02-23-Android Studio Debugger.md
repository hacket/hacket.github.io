---
banner: 
date_created: Friday, February 23rd 2015, 10:10:45 pm
date_updated: Saturday, April 5th 2025, 1:37:10 pm
title: Android Studio Debugger
author: hacket
categories:
  - Tools
category: DevTools
tags: [IDE]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-03-13 22:04
date updated: 2024-12-23 23:22
aliases: [Android App Debugger]
linter-yaml-title-alias: Android App Debugger
---

# Android App Debugger

## 断点调试基础

### 断点种类

1. 普通断点
2. 方法断点
3. 字段断点
4. 条件断点
5. 异常断点

### 断点 BreakPoint 图示

当 Attach 到对应的进程之后，就要选择在需要的地方做打断点，对于 Android Studio 而言，常规的断点通常会有三种显示形式：

- **白板**，意味着断点不生效，一般来说都是没有 attach 到正确的进程  
![202504020031262](attachments/202504020031262.png)
- **叉叉**，意味着断点不生效，一般来说是**source code 跟 runtime code**不匹配；调试的代码跟实际编译进去的不是同一份，导致 java 字节码对不上，调试器没办法识别出来。 一般而言出现叉叉是意味着差别太大了
![202504020031038](attachments/202504020031038.png)
- **勾子**，断点会生效，运行到这里会停下来；有时候会出现断点乱跳，也有可能是因为 Runtime 代码不匹配（但是没有夸张到 "**叉叉**" 的情况）
![202504020032038](attachments/202504020032038.png)

### Android Studio 菜单栏 Debug 功能

![202504010140835](attachments/202504010140835.png)

- 1、debug 模式重新安装运行。应用场景：一般需要在程序启动时就需要进入 debug,例如在 MyApplication， main 函数等。
- 2、进入 Debug 模式。点击之后会弹窗，然后选择进程。
示例如下： 备注：非特殊情况，一般使用这种方法进入 debug。因为 debug 过程中，程序运行较慢，影响调试速度，在打开程序进入特定界面后，再执行此操作进入 Deubg 模式。
另外，**建议开发者对该功能添加快捷键**，非常实用，可以快速进入 debug 模式。快捷键对应功能名称： `Main menu | Run | Attach Debugger to Android Process`
- 3、结束 debug 模式。 备注：多数情况下会结束进程

### Android StudioDebug 菜单图解

![202504010143505](attachments/202504010143505.png)

- 1: AS 底部 debug 菜单功能按钮

**断点管理区操作按钮：**
- 11: `Resume Program` 恢复 Debug 调试；一是可从当前断点**移动**到下一个断点，断点间的代码自动执行；二是让 App 从暂停状态**恢复**到运行状态。`Pause Program`: 暂停 App。
- 12: `Stop` 结束 Deubg 调试；对于普通的 JAVA 项目则是退出调试，对于 Android 项目则是**结束**App 运行。
- 13：`View Breakpoints`：查看所有断点，并可以**管理配置**断点的行为。
- 14：`Mute Breakpoints`：切换启用或禁用**所有**断点的状态。
- 15：`Get Thread Dump`：进入线程 Dunmp 界面；获取内存 Deump

**调试区操作按钮：**
- `Show Excution Point`：**定位**到正在被执行的断点位置。在序号 2 前面
- 2: `Step Over` 单步跳过；单步执行，即**前进到下一行**代码。
- 3: `Step Into` 单步执行，遇到子函数就进入并且继续单步执行（简而言之，进入子函数）；**进入调用方法**的第一行，不能跳到类库方法。
- 4: `Force Step Into` 强制进入；与 `Step Into` 方法类似，只不过他**能跳到类库的方法里**。
- 5: `Step Out` 当单步执行到子函数内时，用 step out 就可以执行完子函数余下部分，并返回到上一层函数。与 `Drop Frame` 相似，但有区别。（前进**到当前方法之外**的下一行，可与 `Step Into` 配合使用）
	- （1）Step Out 回退到上一层调用方法  
	- （2）回退之后，原先的变量值不能回退，变量值是执行完调用方法后的值。
	- （3）回退之后，再按 Step Into 也不会进入到 getString(）方法，因为已经执行完了。  
	- （4）step out 等价于 Step Into+step over
	- （5）Drop Frame 执行后，再按 step over 还会继续执行，而 step out 会直接跳到下一步。
- 6: `Drop Frame` 回退到被调用方法处。当需要知道当前断点的上一层调用源时，可以使用这个步骤；或是希望重新执行前面的程序，可以回退到前面的方法。
- 7: `Run to Cursor` 跳转到**光标所在处**，需要当前断点已经执行到最后一个，且光标所在的代码行要符合**由上到下的执行顺序**，不能颠倒。
- 8: `Evaluate Expression` 调试窗口
- 9：debug Console 窗口（debug 日志在这里显示）
- 10：`Add To Watcehes`

**Drop Frame：**
可以用来在调试的时候，原本想点击 `Step Into` 进入方法内部看看，却**不小心**点了 `Step Over` 向下走了一行。如果调试运行的设备是 Android10 以上的版本，那么我们可以点击 `Drop Frame` 按钮——它的作用是可以把我们从当前方法**拉出来**，**放回方法开始前的地方**。
接着点击 `Resume Program` 按钮，就相当于获取到了一次**重新开始的机会**
![202504020041799](attachments/202504020041799.png)

### Breakpoints 菜单

进入方法：选择断点，点击点键→More

![202504010148057](attachments/202504010148057.png)

- 1：普通断点区域
- 2：方法断点区域
- 3：异常断点区域
- 4：异常断点区域
- 5：添加断点
- 6：删除断点
- 7：断点开关。可关闭和打开断点，默认是打开
- 8：断点暂停属性开关。默认勾选，非勾选状态下，程序执行到断点不会停留。
- 9：`Condition窗口`。添加断点执行条件。
- 10：执行到断点时打印堆栈信息
- 11：执行到断点时打印断点信息
- 12：打印自定义日志，日志都在 Deubg 控制台窗口显示
- 13：设置当前断点在某断点执行之后才会执行

**备注：** 方法断点，默认是进入和退出都会执行，这样日志会打印两次。

### Android Studio Debug 面板

#### Evaluate Expression 调试窗口

打开后可在 Evaluate 窗口输入要执行的代码，可以得到对应的结果，单行代码可省略 return 示例：

![202504010155544](attachments/202504010155544.png)

快捷键对应的功能名称： `Main menu | Run | Debugging Actions | Evaluate Expression…`

**使用场景**： 在 debug 过程中，需要得到某些函数的值，且不是一直需要，可以此功能；另外，如果已经知道某些程序执行会发生异常，可以在该窗口中执行，得到的结果是一个 Exception,通过查找这个异常的堆栈信息来找到造成异常的原因，同时还保证了 debug 不会中断，这样就不用重新写 try catch 问题代码。

#### Add To Watches

添加执行代码块。在某断点处添加了该功能，那么每次执行到该断点时都会的执行。

使用方法：选中要执行的代码段，右键→点击 Add To Watches; 或者在 Variables 窗口点击加号，再手动输入要执行的代码。

![202504010201481](attachments/202504010201481.png)

![202504010201371](attachments/202504010201371.png)

**使用场景**：在调试过程需要知道某个函数的执行结果或是要执行某个方法，或者需要修改某个字段的值。  
- 实践一：进入 H5Activity，需要修改 url，在 onCreate 方法中，获取 url 后，添加断点，然后使用 Add To Watches 功能，添加代码段 url = "new url…."。这样就可以在不修改后台数据、不重启、不修改代码的前提下快速调试  
- 实践二：在某断点处需要长期知道某些方法的值。

#### Set Value

设置值。修改某断点执行时，在 Variables 窗口中某字段的值。

备注：只有一次有效，断点再次执行时，不会生效。

使用方法：在 `Variables窗口` 中选中要修改的字段，点击右键，点击 `Set Value`, 即可修改该字段的值。

![202504010202165](attachments/202504010202165.png)

#### Resume Program 和 Pause Program

恢复 debug 程序和暂停 debug 程序

使用场景：当想暂停 debug 时，可使用 Pause Program，它与 `Mute BreakPoints` 的区别是前者暂停 Deubg 程序，后者只是关闭断点，但还在 debug 程序中。

![202504010204885](attachments/202504010204885.png)

#### Mute Breakpionts

关闭所有断点，但还在 Debug 程序里

![202504010204020](attachments/202504010204020.png)

#### 增加断点

方法一：常见增加断点的方式是在代码左侧单击左键，添加后效果如下图。

![202504010205756](attachments/202504010205756.png)

方法二：在 `Breakpionts窗口` 手动添加断点。可以添加方法断点、字段断点和异常断点。

![202504010205461](attachments/202504010205461.png)

#### 暂停断点

默认情况下程序执行到断点会暂停，但也可以将暂停取消。这样程序照样执行，同时断点日志、堆栈信息可以正常打印。这样可以通过日志去了解程序执行情况。

#### 断点状态

##### 无效断点

```java
ine 5250 in Secure.getString() (android.provider.Settings)  No executable code found at line 5,250 in class android.provider.Settings$Secure  Suspend: thread

// 翻译：在类android.provider的第5250行没有发现可执行代码。设置$安全暂停:线程
```

![202504010207260](attachments/202504010207260.png)

##### 断点关闭

关闭断点

![202504010207896](attachments/202504010207896.png)

![202504010208613](attachments/202504010208613.png)

##### 断点暂停关闭

正常断点会在程序执行到断点时会暂停，等待开发者操作，把暂停属性关闭，则程序执行到断点时不会暂停。

![202504010208929](attachments/202504010208929.png)

![202504010209379](attachments/202504010209379.png)

### 在系统源码中打断点

方法一：通过手动添加方法断点，将系统方法添加断点。这样只能添加方法断点，且影响调试过程中运行速度。

方法二：使用 Android Studio 自带的模拟器，模拟器的 API 与 APP 工程中 `compileSdkVersion ` 版本要一致。因为很多手机厂商定制系统或是因为手机系统版本与工程中 `compileSdkVersion` 版本不一致，导致无法在源码中打断点。提示断点无效。

### 示例

#### 在系统方法中打断点。统计 APP 运行过程中获取 Android Id 的调用源和次数

**应用场景**：根据隐私协议要求，获取用户敏感信息需要申报。APP 内有较多 SDK 和业务代码获取用户敏感信息。第三方（如梆梆、爱加密）采集这些信息是通过将 APP 安装在有 root 权限系统的手机上，通过 hook 对应的系统方法，打印日志来统计，而这个对一般开发者有一定门槛。

实现方法一：通过手动添加方法断点，将对应的系统方法添加断点，然后增加断点日志，打印执行时间和对应的 TAG，同时打印断点信息和堆栈信息，另外要将该断点的暂停开关关闭，不需要暂时，让其正常运行。

获取 Android ID API：

```java
String ANDROID_ID = Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
```

![202504010212107](attachments/202504010212107.png)

#### APP 运行过程中动态添加代码执行块

**应用场景**：在调试过程中，需要增加一些代码，重新编译运行代价较大。可以打断点，然后在断点的 Condition 窗口增加执行代码块和执行条件。相当于条件断点中，增加了代码执行块。Add To Weacth 只能增加一行代码，并不能增加更多代码。 示例：在某断点处添加代码块并执行

![202504010211120](attachments/202504010211120.png)

## Android Studio Debug 调试技巧

[Android Studio调试技巧.pdf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202504010158071.pdf)

### **`Condition`** 条件断点

#### 条件断点

我们把断点打到循环体里的某行代码，想看看循环到某一次时的运行状态。难道此时我们要**不停**的点 `Resume Program` 按钮，直到跳转到满足我们要求的断点吗？

![202504020042759](attachments/202504020042759.png)

不，当然不需要。假如我们想查看断点在运行到第二十次时的状态，可以右击这个断点，在弹出的窗口中的 `Condition` 里加入任何**布尔表达式**：`i==20`（可以选择语句的语言），点击 'Done' 按钮完成配置：

![202504020042020](attachments/202504020042020.png)

如果条件为 "**true**"，当代码命中这个条件时，那么就会到达这个断点。

#### 条件断点 + 代码植入

**改变变量**状态能够动态地设置变量值，**条件断点**可以控制断点是能在此处挂起，那将两者结合就能达到在程序不挂起的情况下进行动态代码植入的效果。
![insert_code](attachments/insert_code.gif)
`Condition` 里插入的代码如下：

```java
if ("黑寡妇".equals(user.getName())) {
    user.setSex("女");
}
// 此处返回false为了告诉IDE在该断点出不对程序执行挂起操作
return false;
```

这就相当于提供了运行期代码的动态植入功能，而且可以通过 `Enable/Disable` 断点的状态来进行开启 / 关闭该部分动态代码是否执行。

### 日志断点

App 在运行时击中我们打上的断点，立马会把断点信息显示在在 `Variables` 菜单中，然后我们就需要在整个菜单中**找出我们想要的信息**：

![202504020043275](attachments/202504020043275.png)

这样有时还蛮麻烦的，我们真正想做的是直接在代码中打上 Log，但却**不想把 Log 语句在代码中打得到处都是**，这时日志断点就派上用场了。

操作步骤：右击需要打 Log 的断点，在它弹出的窗口中**取消选中**`Suspend`，此时窗口会向下展开一些新内容。我们**勾选**`Evaluate and log` 选项，并在其中添加上 Log 语句，点击 'Done' 按钮。

![202504020044515](attachments/202504020044515.png)

现在，当线程遇上这个断点的时候并**不会停止**，它只会计算断点里的 Log 表达式，并把它**记录到控制台**，然后**继续运行**。

### 异常断点

App 在运行的过程中遇到各式各样未知性的异常导致的 Crash 常常令你抓狂，不过强大的 Android Studio 提供了**异常断点**的功能。帮助我们在调试运行的 App 遇到异常，能够**先快速准确的定位到产生异常的地方**，而非第一时间停止 App 的运行。

我们点击断点区工具栏上面的 `View Breakpoints` 按钮，呼出断点管理界面。然后点击 '+'，选择 `Java Exception Breakpoints`。如下图所示：

![20250404191247](attachments/20250404191247.png)

点击后呼出 `Enter Exception Class` 界面，我们在搜索栏中填入想要监控异常的关键字。Java 代码选择 `NullPointerException`，Kotlin 代码选择 `KotlinNullPointerException`，点击 'OK' 按钮即可，如下图所示：

![20250404191303](attachments/20250404191303.png)

> 在我模拟空指针异常的时候发现，如果用 Java 代码写的话，调试器确实能监控的到异常，并能定位产生异常的代码。但是，我用 Kotlin 写的话，App 直接 Crash 掉了。并未监控到异常，也没定位到产生异常的代码。

### 变量访问或修改时 debug

![xmjm8](attachments/xmjm8.png)<br>你所不知道的 Android Studio 调试技巧

> <http://www.jianshu.com/p/011eb88f4e0d>

#### 变量赋值

在 debug 期间，**通过更改断点监控到变量的值，来改变 App 执行的结果。**

首先我们在获取数据的循环体里打上断点。如下图所示：

![20250404191433](attachments/20250404191433.png)

通过 `Debug` 进入调试模式，在 `Variables` 菜单中，选中我们要改变的变量，右击它，在打开的选项中点击 `Set Value…`。如下图所示：

![20250404191449](attachments/20250404191449.png)

我们把 `i=1` 更改为 `i=28`，此时能清楚得看到，在代码中显示的变量 i 信息也从 `i:1` 变成了 `i:28`。如下图所示：

![20250404191505](attachments/20250404191505.png)

在循环中，原本变量 i 的值是从 1 到 30，但我们已经把初始 i 的值改为了 28，点击断点区工具栏上的 `Resume Program` 按钮，原本需要循环 30 下才执行完毕的断点现在点 3 下便可完成。

### Suspend 选项

右击断点的时候，`Suspend` 选项：

![20250404191608](attachments/20250404191608.png)

目前我们 "`All`" 与 "`Thread`" 之中选择了 "`All`"，意味着在当前执行线程遇到该断点的时候，**会停止 App 内的所有线程**，这样就会停止 App 整个运行状态。

但是如果你正在处理一个多线程 App，而你正在寻找一些特别麻烦的异步问题，你可以试着只去**暂停那个撞到断点的线程**。可把选中 "`All`" 改为选中 "`Thread`"。

### Disable until breakpoint is hit 直到击中某一断点才启用

在 RecyclerView 的**滑动监听里面**与**按钮的点击监听**中分别打上断点，由于断点被打在 RecyclerView 的滑动监听里，那么我们手指稍微一滑动，就会立即执行该断点。那么在调试的时候**我想必须先击中按钮监听里面的断点，才允许执行 RecyclerView 的滑动监听里面的断点。**

此时，`Disable until breakpoint is hit` 功能就派上用场了。

右击 RecyclerView 的滑动监听里断点，在弹出的窗口里面点击 `More`：

![20250404191851](attachments/20250404191851.png)

我们就会进入到**断点管理界面**，在该断点的 `Disable until breakpoint is hit` 选项中，**禁用断点，直到我们选择的按钮监听里断点被命中为止**。如下图所示：

![20250404191909](attachments/20250404191909.png)

现在手指滑动屏幕的时候并**不会触发**RecyclerVie 滑动监听里面的断点，**直到点击了按钮**，触发了点击监听里面的断点，才被**激活一次**。意味着每次执行完该断点，就会被禁用掉，**除非再点击一次按钮才被重新激活**。演示如下：

![20250404191945](attachments/20250404191945.png)

### 禁用断点

当已被打上的断点，我们暂时**不需要**命中它的时候，我们可以把它给**禁用**掉，右键断点，在弹出的窗口来取消勾选 `Enable` 选择。此时断点会变成一个**空心圆**。不过更方便的做法是通过 "Alt + 点击 "，Mac 是 "Opt + 点击 "。这样就能让它在**开/关的状态下切换**：

![20250404192048](attachments/20250404192048.png)

### 断点组

有时候我们在执行调试 App 功能的时候会遇到**一些暂时不需要使用的断点**，我们又不想把它们删掉，也许调试下个功能可能会用上，所以只能一个一个禁掉它们。

其实，只要我们学会使用**断点组**，这就方便多了。

右键断点，点击窗口的 `More`，前往断点管理界面。我们还可以点击 Debug 窗口里的断点区工具栏中的 `View Breakpoint` 按钮也能前往。

在该界面中，可以看到所有断点都在上面。我们**多选它们**，右击，创建一个新的组，**你可以把它们起名为你正在处理 Bug 的名字**。

这里我起名为 OnScrollListener，意味着该组的断点都来自 `addOnScrollListener(…)` 的监听里。如下图所示：

![20250404192158](attachments/20250404192158.png)

分组完毕后，你可以通过点击组的单选框来**切换组内断点开/关的状态**。当你处理完 Bug 后，可以选中组，并点击 "-"，即可把它们**全部删掉**。如下图所示：

![20250404192212](attachments/20250404192212.png)

### Evaluate expression

系统给 `Variables` 区的变量对象提供了**表达式求值的功能**。在抵达断点后，如果有变量对象。我们可以输入任何表达式，来**实时查看**表达式的计算结果。

首先，可通过点击工具栏上面的 `Evaluate expression` 按钮，或者右键目标代码选择 `Evaluate expression` 来呼出操作界面。如下图所示：

![20250404192319](attachments/20250404192319.png)

一般首次打开它的时候，是**单行输入模式**，我们输入一条 `textList[position]`，点击 'Evaluate' 按钮，就能在下方 `Result` 中浏览对象。如下图所示：

![20250404192335](attachments/20250404192335.png)

如果我们想输入**更加丰富的表达式**，那么单行模式不能满足我们的需求。点击输入框的右上角，将单行模式**扩展为多行**。这样，我们就能够输入更加丰富的表达式：

![20250404192348](attachments/20250404192348.png)

`Evaluate expression` 是非常适合充当实时检测器，它能够让我们清楚的观察到当前应用的状态。

### 自定义 Debug 变量视图

#### 问题

在 Debug 查看对象的变量时通常会遇到这种情况：

![20250404194534](attachments/20250404194534.png)

此时我想查看 `ShopListBean` 对象里面的具体属性值，需要点击左边的展开按钮才能查看里面具体的属性值，不能直接进行查看。更糟糕的是当 `ShopListBean` 对象在 `List` 容器中时，我们如果想快速查找到当前 `List` 里元素的某一项（或几项）属性时，就会出现在下面的情况，我们只能逐一元素进行展开操作才能查看到元素对应的信息。

#### 解决

##### 重写 toString 及其局限性

- 添加 `ShopListBean` 的 `toString` 方法之后需要重新运行
- 如果 ``ShopListBean`` 是被依赖的 `jar` 这种已经被编译的只读类，则无法更改
- 对于 `ShopListBean` 中包含大量属性（比如 20 + 个）的情况下，无法全部显示完，所以就无法根据自己的需求决定查看具体哪些属性值

##### 自定义变量视图

IDE 提供给我们一种自定义变量视图的方式，专门用来解决上面的问题并弥补了 `toString` 方法的不足。这里会有个 `变量解析器` 的概念，它用来控制当前变量的显示值（即 debug 时显示在该变量后面的内容，下称 " `变量视图`"）。

首先 Debug 状态下右击变量，选择 `Customize Data Views` 项；新增找不到，可以双击 `Shift+输入Customize Data Views`；

或者 `Settings→Build→Debugger→Data Views→Java Type Renderers`

接下来在 `Customize Data Views` 弹窗的 Tab 中选择 `Java Type Renderers` 项，如下

![20250404195145](attachments/20250404195145.png)

点击 `+` 来添加一个自定义的 `变量解析器`:

![20250404195948](attachments/20250404195948.png)

自定义一个 `变量解析器`，主要需要添加的是名称、解析类型和解析方式三部分：

- Renderer name 名称：该解析器的标识名称
- renderer type 解析类型：表示当前的解析器只对哪种类型的类进行解析
- rendering node 解析方式：此处是核心部分，可以写一个 Java 表达式，也可以写一段代码，这里的返回值就是该变量视图

我们可以在 IDE 中添加多个 `变量解析器`，通过控制它的开启、禁用、顺序、适用类等来控制当前变量的显示情况：

![CustomGoodsRenderers](attachments/CustomGoodsRenderers.gif)

通过自定义 `变量解析器` 的好处是不需要重新运行整个 Project；而且还可以在 Debug 期间动态切换变量视图。

**再进一步抽象**
写一个通用的 `变量解析器` 而不是每 debug 一种类型的变量就单独添加一个解析器。接下来要做的事情很清楚了，就是添加一个能够将对象实例序列化成字符串的方法即可。最先想到的是通过 Json 进行转化，但 Json 一般依赖三方包，而我们想让 Debug 功能能够跟 IDE 是统一基准线的，所以尽可能选择使用 JDK11 自带的 API。
于是考虑到了反射，对于一般通用的变量视图，我们可以直接通过反射取到每个属性名，然后结合当前实例来获取属性值，直接在上面的 `解析类型` 中指定为 `java.lang.Object` 以支持所有类型变量的解析，`解析方式` 中添加下面的代码

```java
if (((Object) this) instanceof String
        || ((Object) this) instanceof Number
        || ((Object) this) instanceof Class) {
    return ((Object) this);
}
StringBuilder sb = new StringBuilder("{");
Class<?> cls = ((Object) this).getClass();
java.lang.reflect.Field[] fields = cls.getDeclaredFields();
if (fields != null) {
    int size = fields.length;
    for (java.lang.reflect.Field field : fields) {
        field.setAccessible(true);
        Object value = field.get((Object) this);
        sb.append(field.getName())
                .append("=")
                .append(String.valueOf(value));
        if (--size > 0) {
            sb.append(", ");
        }
    }
}
return sb.append("}").toString();
```

![20250404200457](attachments/20250404200457.png)

添加完毕之后，会发现此时我们的 IDE 在 Debug 时异常强大，所有类型的变量视图均自动转化成 `key-value` 形式的字符串，再也不用为了 Debug 变量而重写 `toString` 方法。看下 Debug 的效果

![20250404195925](attachments/20250404195925.png)

### Analyze Stack Trace 分析堆栈轨迹

在合作开发项目中，也许我们会收到来自同事发来的一份包含调用栈的 Bug 报告，其实也就是一堆文本。我们复制 Bug 报告，回到 Android Studio，点击工具栏上面的 `Code`，然后点击 `Analyze Stack Trace or Thread Dump…`，我们会发现它找到了粘贴板上面的内容：

![20250404192705](attachments/20250404192705.png)

点击 'OK' 按钮后，它会对我们的调用栈作一个全面的注解，并显示在控制台中。我们点击其中的**链接**，就会对我们的代码库进行一个快速的检索并**定位**代码。

### App 启动时需要 Debug 应用

#### ADB Idea 插件

适用于自己启动 APP<br>![iyiz9](attachments/iyiz9.png)

#### 代码方式：waitForDebugger

`android.os.Debug.waitForDebugger();` 代码到工程中的指定位置

适用自己启动 APP 或三方启动 APP<br>添加 `android.os.Debug.waitForDebugger();` 代码到工程中的指定位置，进程启动后，在 Android Studio 点击 `Attache Debugger to Android Process` 即可。

#### 开发者模式：选择调试应用

如果三方启动 APP，如 deeplink，applink 等，ADB Idea 插件就不适用了，代码方式可以

1. 打开开发者模式，择调试应用并打开等待调试程序

![nddrh](attachments/nddrh.png)

2. 重启应用后，即会显示如下界面：

![iw6cr](attachments/iw6cr.png)

3. 在 Application 中选择断点，然后在 Android Studio 点击 `Attach Debugger to Android Process` 即可。

#### Adb 设置等待调试应用（推荐）

等待调试有 2 种方式：

- 方法 1：「开发者选项 - 选择调试应用」的方式来调试应用启动阶段代码。具体方式为 `「选择调试应用」-> 「运行应用」-> 「Attach To Process」`，然后等待断点执行即可。
- 方法 2：使用 adb 命令 `adb shell am set-debug-app -w --persistent 包名`

##### adb 命令：设置 APP 启动时等待 debugger

**单次 wait debugger**

```shell
adb shell am set-debug-app -w me.hacket.assistant.samples
```

- `set-debug-app` 用来应用为 debug 模式
- `-w` 意思为 wait，在进程启动的时候，等待 debugger 进行连接
- `me.hacket.assistant.samples` 代表想要调试的应用的包名或 applicationId

执行上面的命令，当我们再次启动目标应用时会出现等待的页面，需要在 AS 中 `Run—> Attach Debugger to Android Process` 来绑定进程 debug，然后会进入到 APP 的断点处

**持久化 wait debugger**

```shell
adb shell am set-debug-app -w --persistent me.hacket.assistant.samples
```

- `—persistent` 意思是持久的，意思是一直设置这个应用为调试模式，即每次开启（进程创建）都会弹出对话框，即使卸载再安装或者更新应用

adb 这种方式只能调试主进程，不能调试后台进程的初始化。调试后台进程需要使用 `android.os.Debug.waitForDebugger()`

##### 清除调试应用

```shell
adb shell am clear-debug-app
```

执行这个命令后会清除 `选择调试应用` 和 `等待调试程序` 选项

![xtli3](attachments/xtli3.png)

## Android Studio Debugger 的坑

### Android Debug 速度特别慢有时候卡住

- Android studio 进行 debug 测试的时候，速度又时候特别慢，最常见的原因是因为我们打了太多的断点，导致 debug 启动慢，我们只要把断点去掉，留下必要的断点，速度就会上来。
- 包含 C/C++ 代码，这个问题影响了我的 debug，导致特别慢。其实我们可以设置只调试 Java 代码或者 C/C++ 代码，或者两者都调试。

只调试 Java，速度很快。

需要调试 C/C++ 程序首先需要在 SDK Manager 安装 `CMake`、`LLDB` 和 `NDK`。但是在具体调试时，一直提示定在 `Starting LLDB server`。可能的原因是 Android Studio 编译速度太慢了，就会一直卡在 Starting LLDB server。可以通过设置 `Run/Debug Configurations ——> Debugger ——> Debug type` 为 Java 跳过 C/C++ 的调试，起码实现对 Java 程序的调试。

### Android Studio 打断点后无效

只有一个红点，没有√，一直断点不上

![202504010139783](attachments/202504010139783.png)

### Android Studio Debug 时提示 Method breakpoints may dramatically slow down debugging

**问题描述：**<br>Android Studio 打了断点开始调试时，提示：`Method breakpoints may dramatically slow down debugging`，而且非常卡，没法操作<br>![2xq8n](attachments/2xq8n.png)<br>解决：去除 Java/Kotlin 的 method breakpoints.

- 去掉 `Java Method Breakpoints`
Turn off the method breakpoints. You can see all your breakpoints through Run | View Breakpoints (Ctrl - Shift -F 8 )<br>![gyyv2](attachments/gyyv2.png)

- 去掉 `Kotlin Function Breakpoints`
![s0mlx](attachments/s0mlx.png)

# Android Framework debug
