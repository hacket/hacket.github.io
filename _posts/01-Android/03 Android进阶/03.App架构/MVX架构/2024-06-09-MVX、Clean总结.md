---
date created: 2024-06-09 23:19
date updated: 2024-12-24 00:30
dg-publish: true
---

# MVC/MVP/MVVM/MVI

## MVC

### 什么是MVC？

MVC 其实是 Android 默认的设计。

1. **M**: Model 数据类（数据的获取、存储、数据状态变化）
2. **V**: View Layout XML 文件
3. **C**: Controller Activity 负责处理数据、业务和UI

### MVC流程

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654579740063-1628b13d-4dea-40f2-a429-5662789e9fdf.png#averageHue=%23414d2c&clientId=u328cf4eb-bd0d-4&from=paste&id=bZHy7&originHeight=161&originWidth=607&originalType=url&ratio=1&rotation=0&showTitle=false&size=81692&status=done&style=none&taskId=ufa9cc2ba-26a9-462e-8fa2-4df471ebb83&title=)

- View接收用户的交互请求，View将请求转交给Controller
- Controller操作Model进行数据更新，数据更新之后，Model通知View数据变化
- View显示更新之后的数据

### MVC缺点

**Activity责任不明、十分臃肿**<br />Activity由于其生命周期的功能，除了担任View层的部分职责（加载应用的布局、接受用户操作），还要承担Controller层的职责（业务逻辑的处理）<br />随着界面的增多 & 逻辑复杂度提高，Activity类的代码量不断增加，越加臃肿

## MVP

### 什么是MVP？

MVP是MVC架构的一个演化版，解决MVC中Activity作为V和C的问题：将Activity/Fragment中的业务逻辑分离出来，Activity/Fragment只做View展示用，业务逻辑移动到Presenter层。

1. M Model：实体类（数据的获取、存储、数据状态变化）
2. V View：Activity/Fragment/Layout XML文件
3. P Presenter：负责View和Model之间的交互和业务逻辑

> 一般地，V和P中间会定义一个契约层Contract，规定V如何向P发指令和P如何Callback给V层。

### MVP流程

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654581795143-731cf03b-d4d2-4b1f-b67f-2cbed488238d.png#averageHue=%23364424&clientId=u2dcb01ad-b68d-4&from=paste&height=304&id=u17319dc7&originHeight=349&originWidth=607&originalType=url&ratio=1&rotation=0&showTitle=false&size=157779&status=done&style=none&taskId=ua81111ce-923d-45b1-ba92-9ea0083f80e&title=&width=529)

- View接收用户交互请求，View将请求转交给Presenter（V调用P接口）
- Presenter操作Model进行数据更新（P调用M接口）
- Model通知Presenter数据发生变化（M调用P接口）
- Presenter更新View数据（P执行View的接口方法，也就调用了V的实现类）

### MVP优缺点

**优点**

1. 负责的逻辑处理放在Presenter进行处理，减少了Activity的臃肿
2. M和V解耦，Model和View层完全分离，修改View层不会影响Model层
3. 可以将一个Presenter用于多个视图，而不需要改变Presenter的逻辑
4. Presenter层和View层的交互是通过接口来进行的，便于单元测试

**缺点**

1. **双向依赖**：V和P是双向依赖的，一旦View层做出改变，相应的P也需要做出调整，V层变化是大概率事件
2. **内存泄漏风险**：P持有了V层的引用，当用户关闭V层，P层如果在子线程进行耗时操作，存在内存泄漏的风险，可以利用Lifecycle解决
3. **协议接口类膨胀**：V和P交互需要定义接口，当交互复杂时，需要定义很多接口方法和回调方法，不好维护

## MVVM

### 是什么MVVM？

MVVM与MVP的结构很相似的，就是将Presenter升级为ViewModel。

1. View：Activity/Fragment 和 Layout XML 文件，与 MVP 中 View 的概念相同；
2. Model：负责管理业务数据逻辑（如网络请求、数据库处理），与MVP中的Model概念相同
3. ViewModel：存储视图状态，负责处理表现逻辑，并将数据设置给可观察数据容器

> 实现细节上，V和P从双向依赖变成V可以向VM发送指令，但VM不会直接向V回调，而是让V通过_观察者的模式_去监听VM层数据的变化，有效的规避了MVP中V和P双向依赖的问题。

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676993602789-639a9f75-8637-43f0-b9ba-274619bcdbbd.webp#averageHue=%23cddfca&clientId=ue5227f75-e4c0-4&from=paste&id=u0a4a4abe&originHeight=321&originWidth=771&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u9c56f116-6ef4-45ab-8c84-b9434505bad&title=)

> DataBinding、ViewModel 和 LiveData 等组件是 Google 为了帮助我们实现 MVVM 模式提供的架构组件，它们并不是 MVVM 的本质，只是实现上的工具。
> ![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676964448849-00525efe-8a6b-4cc6-800d-63d7ca965ad5.webp#averageHue=%23140f08&clientId=u647ef35e-a0ba-4&from=paste&height=377&id=u7f1673dd&originHeight=720&originWidth=960&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u12994f41-133e-4cf0-bf06-af518f3f21e&title=&width=502)

### MVVM存在的缺点

1. **多数据流**：Vew和VewModel的交互分散，缺少唯一的修改源，不易于追踪
2. **LiveData膨胀**：复杂的页面需要定义多个MutablLiveData，并且都需要暴露为不可变的 LiveData。

```kotlin
class TestViewModel : ViewModel() {
    // 为保证对外暴露的LiveData不可变，增加一个状态就要添加两个LiveData变量
    private val _pageState: MutableLiveData<PageState> = MutableLiveData()
    val pageState: LiveData<PageState> = _pageState
    private val _state1: MutableLiveData<String> = MutableLiveData()
    val state1: LiveData<String> = _state1
    private val _state2: MutableLiveData<String> = MutableLiveData()
    val state2: LiveData<String> = _state2
    //...
}
```

3. 不用DataBinding的理由 [我不使用Android DataBinding的四个原因](https://www.jianshu.com/p/1df47c9400f3)
   1. JakeWharton不推荐使用
   2. xml里面写业务逻辑，难以维护
   3. 只适合用于简单的app，

## MVI

### 什么是MVI？

MVI和MVVM相似，借鉴了前框框架的思想，更加强调数据的单向流动和唯一数据源。

1. Model：与MVVM的Model不同的是，MVI的Model主要是指UI状态State，并暴露出ViewState供ViewState订阅，ViewState一般是个data class包含所有页面状态。（如页面加载状态、控件位置等）
2. View：与其他MVX的ViewState一样，通常为Activity或View；View通过订阅Model变化实现界面刷新
3. Intent：或者叫Action，指用户的操作包装成Intent发送给Model层进行数据请求

### MVI交互流程

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676994867754-56427231-2a2d-4d70-85bc-d973897a4b91.webp#averageHue=%23caddc7&clientId=ub5cd39af-4fde-4&from=paste&height=235&id=ubeea1ad5&originHeight=305&originWidth=759&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uc30ba530-ff78-4f84-ba7d-13029bf202f&title=&width=585)<br />MVI主要分为以下几步：

1. 用户操作以Intent(Action)的形式通知Model
2. Model基于Intent更新State
3. View接收到State变化刷新UI

> 在实现细节上，View 和 ViewModel 之间的多个交互（多 LiveData 数据流）变成了单数据流。无论 View 有多少个视图状态，只需要订阅一个 ViewState 便可以获取所有状态

### MVI优缺点

**优点：**

1. **强调数据单向流动**，很容易对状态变化进行跟踪和回溯
2. **State是单一信息源（全局状态管理）**，不用担心各个View的状态到处都是；使用ViewState对State集中管理，只需要订阅一个ViewState便可获取页面的所有状态（MVVM是多个State）

**缺点：**

1. **State膨胀 **所有视图变化都转换为ViewState（可以划分成几个小的分状态来缓解）
2. **局部刷新 **View根据ViewState响应，不易实现局部Diff刷新（自定义LiveData响应局部属性；Flow.distinctUntilChanged()来减少不必要的刷新）
3. **Event的黏性事件问题：**LiveData和StateFlow都有黏性问题

## MVVM和MVI的对比

- 对于新的团队，一般都熟悉MVVM，MVVM架构的接受度肯定会好
- 对于复杂的场景，采用MVI的**全局状态管理**思路更优
- MVVM和MVI的复杂度对比
  - MVVM
    - **View发起请求的复杂度**：ViewModel的各种方法调用会散落在界面不同地方（即界面向ViewModel发起请求没有统一入口）
    - **View观察数据的复杂度**：界面需要观察多个ViewModel提供的数据，导致界面状态的一致性难以维护
    - **ViewModel内部请求和数据关系的复杂度**：数据被定义为 ViewModel 的成员变量。成员变量是增加复杂度的利器，因为它可以被任何成员方法访问。也就是说，新增业务对成员变量的修改可能影响老业务的界面展示。同理，当界面展示出错时，也很难一下子定位到是哪个请求造成的。

![MVVM](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676997386626-72ef2a31-b8fd-48d2-9cf6-5c2acaff2cee.webp#averageHue=%23f9dfdf&clientId=ub5cd39af-4fde-4&from=paste&height=485&id=u55efb737&originHeight=971&originWidth=1016&originalType=url&ratio=1.5&rotation=0&showTitle=true&status=done&style=none&taskId=ua6e253c1-03cf-4d84-ae1b-3c1367bb2cd&title=MVVM&width=507 "MVVM")

- MVI：解决了上面的三个问题
  - State单一数据源
  - Event需要消除黏性，SharedFlow/SingleLiveEvent

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676997908288-e0ccc860-3a66-4552-89e7-5dab9268b98e.webp#averageHue=%23fadede&clientId=ub5cd39af-4fde-4&from=paste&height=546&id=u336d4640&originHeight=956&originWidth=906&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u93ae017f-baf0-490c-9681-a2d03c28173&title=&width=517)

## Clean

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687998026805-4d062f8d-4a1f-4227-b9fc-6471ee281cc8.png#averageHue=%23d6d4b0&clientId=u976beb9d-6a07-4&from=paste&id=u069e9a1e&originHeight=435&originWidth=595&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=259197&status=done&style=none&taskId=u7c51d233-a428-46b4-a664-c57c7322132&title=)<br />**分层**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687998051496-39f8ae45-0cdb-44b5-a04a-f06818bfa521.png#averageHue=%23585b59&clientId=u976beb9d-6a07-4&from=paste&id=u6548c108&originHeight=292&originWidth=673&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=75095&status=done&style=none&taskId=u69335027-594e-4ca7-b7aa-ccf0bb13545&title=)<br />分三层，每层都有自己的数据模型，每层之间通过接口方式来通信

### Presentation Layer

也就是MVX结构所对应的地方（MVC、MVP等），这里不处理UI以外的任何逻辑。

### Domain Layer

业务逻辑,use case实现的地方，在这里包含了use case(用例)以及Bussiness Objects(业务对象),按照洋葱图的依赖规则，这层属于最内层，也就是完全不依赖于外层。

### Data Layer

所有APP需要的数据

## Viper？

货拉拉提到
