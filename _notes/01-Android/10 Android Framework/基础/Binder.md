---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# Binder

## 1、Binder是什么？

Binder是Android最主要的IPC通信机制。

- 从**IPC**的角度看，Binder是Android中的一种跨进程通信的机制，Linux中没有，Android独有；
- 从** Server 进程**的角度看，Binder 指的是 Server 中的 Binder 实体对象；
- 从 **Client 进程**的角度看，Binder 指的是对 Binder 代理对象，是 Binder 实体对象的一个远程代理
- 从**传输过程**的角度看，Binder 是一个可以跨进程传输的对象；Binder 驱动会对这个跨越进程边界的对象对一点点特殊处理，自动完成代理对象和本地对象之间的转换。

## 2、Linux已有的IPC机制

**管道**<br />半双工，单向的，一般是在父子进程之间使用。<br />使用`pipe(fds)`创建文件对应的管道，然后使用write、read、close方法操作这个管道。

> 低版本 Looper::Looper

**Socket**<br />全双工，即可读又可写，两个进程之间无需存在亲缘关系

> Zygote孵化应用进程

**共享内存**<br />很快，0次拷贝，进程之间无需存在亲缘关系

> MemoryFile使用了mmap映射了匿名共享内存

**信号**<br />单向的，发出去之后怎么处理是别人的事，知道进程pid就能发信号，也可以一次给一群进程发信号，但是只能带个信号，不能带别的参数

> Process.killProcess 发送了SIGNAL_KILL信号；
> Zygote启动子进程后，需要关注子进程退出了没有，如果子进程退出了，Zygote需要发送SIGCHLD信号及时把它回收掉。

## 3、为什么不用已有的IPC机制，而是新起一个新的Binder

- [ ] [为什么 Android 要采用 Binder 作为 IPC 机制？](https://www.zhihu.com/question/39440766/answer/89210950)

### 传输效率高：Binder的传输效率和可操作性很好

传输效率主要影响因素是内存拷贝次数，拷贝次数越少，传说速率越高。

1. 消息队列、Socket和管道，数据先从发送方的缓存区拷贝到内核开辟的缓存区，再从内核缓存区拷贝到接收方的缓存区，需要2次拷贝
2. 共享内存呢，虽然使用它进行IPC通信时进行的内存拷贝次数是0。但是共享内存操作复杂，也将它排除。
3. 采用Binder机制的话，则只需要经过1次内存拷贝即可。即从发送方的缓存区拷贝到内核的缓存区，而接收方的缓存区与内核的缓存区是映射到同一块物理地址的，因此只需要1次拷贝即可。

### 稳定性好

- 共享内存性能优于Binder，但共享内存需要处理并发同步问题，容易出现死锁和资源竞争，稳定性较差
- Socket虽然基于C/S架构，但是它主要是用于网络间的通信，传输效率较低
- Binder基于C/S架构，Server端和Client端相对独立，稳定性较好

### 安全性高：Binder机制的安全性很高

传统IPC没有任何安全措施，完全依赖上层协议来确保。传统IPC的接收方无法获得对方进程可靠的UID/PID(用户ID/进程ID)，从而无法鉴别对方身份。<br />而Binder机制则为每个进程分配了UID/PID来作为鉴别身份的标示，并且在Binder通信时会根据UID/PID进行有效性检测。在实际项目中可能一些敏感的服务，不希望被乱用就可以通过UID/PID鉴权的方式来防护。<br />**为什么说Binder是安全的？**<br />在数据传输过程中有身份的校验，通过UID、PID进行校验

## Binder架构

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677513493744-ea4f3200-404a-4e4c-870c-929a0649314b.png#averageHue=%23fdfdf9&clientId=ude0eaad3-e3fc-4&from=paste&height=583&id=u175a3675&originHeight=858&originWidth=949&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=255296&status=done&style=none&taskId=ucd88d938-b9a6-42a2-80a8-24c491be4fe&title=&width=645)

- **Java层** 有一套binder C/S架构，通过JNI技术，与Native的Binder对应，Java层的Binder的功能最终都是交给Native的Binder来完成
- **Native层**有一整套完整的Binder通信的C/S架构，BPBinder作为Client，BBinder作为Server
- **Binder驱动层 **

### Binder驱动

**Binder驱动不是Linux内核的一部分，它怎么做到能访问内核空间的呢？**<br />通过Linux的动态可加载内核模块（LKM Loadable Kernel Module），它在运行时被链接到内核作为内核的一部分在内核空间运行，用户进程之间通过这个模块作为桥梁，就可以完成通信了。<br />**Binder是什么？**<br />Binder驱动实际上和硬件设备没有任何关系，只是实现方式和设备驱动程序是一样的，它工作于内核态，提供open()，mmap()，poll()，ioctl()等标准文件操作，以字符驱动设备中的misc设备注册在设备目录/dev下，用户通过/dev/binder访问它。

## **Binder 通信模型**

## ![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1675915332603-a82c0e4a-889d-4f6c-9173-82744221d1e8.webp#averageHue=%23fafafa&clientId=u3383c5ba-aa0c-4&from=paste&id=udafe896f&originHeight=892&originWidth=1728&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9827edf-5a63-41ab-aaa3-fc267b9407f&title=)

**Binder模型中的组件：**<br />Binder是基于C/S架构的，由一系列组件组成，包括Client、Server、ServiceManager和Binder驱动；其中Client、Server和ServiceManager运行在用户空间，Binder驱动运行在内核空间；其中ServiceManager和Binder驱动由系统提供，Client和Server由应用程序来实现；Client、Server和ServiceManager都是通过系统调用open、mmap和ioctl来访问设备文件/dev/binder，从而实现与Binder驱动的交互来间接的实现跨进程通信。

- Server 提供服务的进程
- Client 使用服务的进程
- ServiceManager 管理Service的注册和查询（将字符串形式的Binder名字转化成Client中对该Binder的引用）
- Binder驱动 一个虚拟设备驱动，工作在内核态，提供open、mmap和ioctl等标准文件操作；Binder驱动负责进程之间Binder通信的建立，Binder在进程之间的传递，Binder引用计数管理，数据包在进程之间的传递和交换等一系列底层支持。

**Binder通信过程：**

1. 一个进程使用`BINDER_SETCONTENT_MGR`命令通过Binder驱动将自己注册成为ServiceManager
2. **Server注册** Server进程通过Binder驱动向ServiceManager中注册Binder（Server中的Binder实体），表明可以对外提供服务。Binder驱动为这个Binder创建位于内核中的实体节点以及ServiceManager对实体的引用，将名字以及新建的引用打包传给ServiceManager，ServiceManager将其填入查找表

> 注册的过程就是向Binder驱动的全局链表`binder_procs`中插入服务端的信息，然后向service_manager的`svcinfo`列表中缓存一下注册的服务

3. Client进程通过名字在Binder驱动的帮助下从ServiceManager中获取到对Binder实体的引用，通过这个引用就能实现和Server进程的通信

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1675875326498-51c74194-cadd-48a2-b05b-451e14501a9f.png?x-oss-process=image%2Fresize%2Cw_1125%2Climit_0#averageHue=%23b3d2da&from=url&id=oFKj2&originHeight=688&originWidth=1125&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## servicemanager

### servicemanager启动流程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677598768777-4d7146e1-9d51-4707-bc72-1b6e7fc9b820.png#averageHue=%23eff8f1&clientId=u350a4c36-8ba5-4&from=paste&id=u75816f7b&originHeight=720&originWidth=960&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=435025&status=done&style=none&taskId=u0af30890-51e9-4af8-b1e2-30266d4f5c0&title=)<br />当Kernel启动加载完驱动之后，会启动Android的init程序，init进程加载了servicemanager的rc可执行程序之后加载了servicemanager的入口函数启动了servicemanager进程。<br />servicemanager启动分为三步：

1. 首先打开Binder驱动创建全局链表`binder_procs`
2. 将自己当前进程信息保存到binder_procs链表
3. 开启binder_loop不断地处理共享内存中的数据，并处理BR_xxx命令

### servicemanager作用？

- binder机制的守护进程，Binder上下文管理者（其他调用者通过**预留的0号引用**获取servicemanager的binder）；
- 注册服务（针对Server）
- 查询服务（针对Client）

#### ServiceManager注册服务

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677601843293-4771496c-5d57-45f3-a7d4-00bca04877f0.png#averageHue=%23ebebda&clientId=u350a4c36-8ba5-4&from=paste&id=ufdcf153b&originHeight=943&originWidth=1078&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=526117&status=done&style=none&taskId=u946aedee-5acf-4714-b653-8b8cb9c647f&title=)

- 通过ServiceManager的addService()方法来注册服务
- ServiceManager向Binder驱动发送`BC_TRANSACTION`命令(ioctl的命令，BC可以理解为Binder Client发过来的请求命令)携带`ADD_SERVICE_TRANSACTION`命令，同时注册服务的线程进入等待状态`waitForResponse()`
- Binder驱动收到请求命令向ServiceManager的todo队列里面添加一条注册服务的事务，事务的任务就是创建服务端进程binder_node信息并插入到binder_procs链表中
- 事务处理完之后发送`BT_TRANSACTION`命令，ServiceManager收到命令后向`svcinfo`列表中添加已经注册的服务，最后发送`BR_REPLY`命令唤醒等待的线程，通知注册成功

#### ServiceManager获取服务

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677602229088-310cc18f-66c7-4c37-b463-8c068d63a40d.png#averageHue=%23ebebda&clientId=u350a4c36-8ba5-4&from=paste&id=u42f4f6ce&originHeight=943&originWidth=1078&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=526117&status=done&style=none&taskId=u9dc6ced1-fa67-4b27-97a0-fa9c3264430&title=)

- 通过ServiceManager的getService()方法来注册服务
- ServiceManager向binder驱动发送`BC_TRANSACTION`命令携带`CHECK_SERVICE_TRANSACTION`命令，同时获取服务的线程进入等待状态`waitForResponse()`
- Binder驱动收到请求命令向ServiceManager发送`BC_TRANSACTION`查询已注册的服务，查询到直接响应`BR_REPLY`唤醒等待的线程；若查询不到将与binder_procs链表中的服务进行一次通讯再响应

### servicemanager一些疑问？

#### Client和Server怎么获取servicemanager的binder对象？

通过`getStrongProxyForHandle(0)`方法获取，因为servicemanager默认就是0号引用，便于其它系统服务查询使用，它内部会根据句柄创建对应的BpBinder对象

## Binder原理

### binder_mmap(文件描述符，用户虚拟内存空间)

> binder进程间通信效率高的核心机制：在内核虚拟地址空间，申请一块与用户虚拟内存相同大小的内存；然后再申请1个page大小的物理内存，再将同一块物理内存分别映射到内核虚拟地址空间和用户虚拟内存空间，从而实现了用户空间的buffer和内核空间的buffer同步操作的功能。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677543090168-3a3bf781-76c1-4516-8510-12e3470d9026.png#averageHue=%23d7e7d1&clientId=ude0eaad3-e3fc-4&from=paste&height=404&id=u025c04bf&originHeight=628&originWidth=669&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=151468&status=done&style=none&taskId=uf53ae808-5aef-4be2-9c64-136dc3f4f01&title=&width=430)<br />binder_mmap通过**加锁**，保证一次只有一个进程分配内存，保证多进程间的并发访问。<br />虚拟进程地址空间(vm_area_struct)和虚拟内核地址空间(vm_struct)都映射到同一块物理内存空间，当C与S发送数据时，C先从自己的进程空间把IPC通信数据_copy_from_user_拷贝到内核空间，而S端与内核共享数据，不再需要拷贝数据，而是通过内存地址空间的偏移量，即可获悉内存地址，整个过程只发生一次内存拷贝。<br />进程和内核虚拟地址映射到同一个物理内存的操作是发生在数据接收端(Server)，而数据发送端(Client)还是需要将用户态的数据拷贝到内核态。<br />Binder在进程间数据通信的流程图：Binder的内存转移关系。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677548779858-062dfb0c-4c34-412f-8474-5f68291edd69.png#averageHue=%23b2cea8&clientId=ude0eaad3-e3fc-4&from=paste&id=u1f65e704&originHeight=600&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=230417&status=done&style=none&taskId=ud82b8af8-76ca-4f54-81e2-388d1f1518f&title=)

### Binder原理

**Binder驱动：**Binder驱动运行在内核空间，负责各个用户进程的通信；Binder不是Linux系统内核的一部分，但Linux的**动态内核可加载模块**的机制，Android可动态添加一个内核模块运行在内核空间。<br />**内存映射**：内存映射是通过mmap()来实现的，将用户空间的一块内存区域映射到内核空间，映射关系建立后，用户对这块内存区域的修改可以直接反应到内核空间；反之内核空间对这段区域的修改也能直接反应到用户空间；内存映射减少了数据拷贝次数。<br />**Binder IPC实现原理**<br />Binder IPC基于内存映射来实现的。Binder IPC原理通信如下；

1. 首先Binder驱动在内核空间创建一个数据接收缓存区
2. 接着在内核空间开辟一块内核缓存区，建立**内核缓存区**和**内核中数据接收缓存区**之间的映射关系，以及**内核中数据接收缓存区**和**接收进程用户空间地址**的映射关系
3. 发送方进程通过系统调用_copy_from_user()_将数据copy到内核中的内核缓存区，由于内核缓存区和接收进程的用户空间存在映射关系，因此也就相当于把数据发送到了接收进程的用户空间，这样便完成了一次进程间的通信

![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1675930862464-c2d1ffbd-952b-4a3e-9f8f-afe63432a182.webp#averageHue=%23ded5cc&clientId=u3383c5ba-aa0c-4&from=paste&id=ud0adcc1d&originHeight=1027&originWidth=1440&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&taskId=u40369aa3-1304-46d1-9aac-841fd43e799&title=)

### Binder进程和线程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677600799772-1186f16f-5b52-4e3a-9bcf-81471b348de2.png#averageHue=%23f8e6d0&clientId=u350a4c36-8ba5-4&from=paste&height=426&id=u57defbb3&originHeight=719&originWidth=943&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=285543&status=done&style=none&taskId=ue7a0492f-92a9-46c6-bede-04f036d9386&title=&width=559)<br />**进程**<br />底层Binder驱动，通过`binder_procs`链表记录所有创建的Binder_proc结构体，Binder驱动层的每一个binder_proc结构体都与用户空间的一个用于Binder通信的进程一一对应，且每个进程有且只有一个ProcessState对象，这是通过单例模式来保证的，每个进程中可以有很多个线程，每个线程对应一个IPCThreadState对象，IPCThreadState对象也是单例模式，即一个线程对应一个IPCThreadState对象，在Binder驱动对应_binder_thread_ 结构体，在binder_proc结构体中通过成员变量rb_root_threads来记录当前进程内所有的binder_thread<br />**Binder线程池**<br />每个Server进程在启动时会创建一个Binder线程池，会注册一个Binder线程；后续Server进程可以向Binder线程池注册新的线程，Binder驱动在探测到没有空闲线程时也会主动向Server进程注册Binder线程。<br />一个Server进程默认最多16个Binder线程

## AIDL

### 什么是AIDL？

AIDL是Android Interface definition language的缩写，它是一种Android内部进程通信接口的描述语言，通过它我们可以定义进程间的通信接口。

### AIDL in out inout oneway

#### in out inout

1. in参数使得实参顺利传到服务方，但服务方对实参的任何改变，不会反应给调用方
2. out参数使得实参不会真正传递到服务方，只是传一个实参的初始值过去，但服务方对实参的任何改变，在调用结束后会反应回调用方
3. inout 是上面二者的结合，实参会顺利传到服务方，且服务方对实参的任何改变，在调用结束后会反应回调用方

> 其实inout，都是相对于服务方，in参数使得实参传到了服务方，所以是in进入了服务方，out参数使得实参在调用结束后从服务方传回给调用方，所以out是从服务方出来

#### oneway

oneway主要有两个特性：**异步调用**和**串行化处理**。

- 异步调用是指应用向binder驱动发送数据后不需要挂起线程等待binder驱动的回复，而是直接结束。像一些系统服务调用应用进程的时候就会使用oneway，比如AMS调用应用进程启动Activity，这样就算应用进程中做了耗时任务，也不会阻塞系统服务的运行
- 串行化处理是指对于一个服务端的AIDL接口而言，所有的oneway方法不会同时执行，binder驱动会将它们串行化处理，排队一个一个调用

**非oneway情况：**<br />非oneway的话，Client会挂起，相当于Thread的sleep，底层调用的是`wait_event_interruptible()`Linux系统函数。<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1676007614353-5eba2f15-15c0-432c-9d86-dc8b6cfa6fcc.png#averageHue=%23f2f2f2&clientId=u25346014-b5a6-4&from=paste&height=416&id=u27c73191&originHeight=756&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua3c7e4c1-1251-4f8d-9a3f-f6d526104be&title=&width=594)<br />**oneway情况：**<br />oneway的话，Client就不需要挂起线程等待<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1676007668540-481de144-2d51-4019-b526-58ee4c1a9c85.png#averageHue=%23eeeeee&clientId=u25346014-b5a6-4&from=paste&height=285&id=u3cfc22cb&originHeight=506&originWidth=1034&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud019bd9b-a3d0-4424-86d2-e91046f010b&title=&width=582)

# 面试题

## Binder相关问题

### Binder线程数？

默认为16个Binder线程

### Zygote孵化进程的IPC机制用Socket而不用Binder？为什么？

**为什么不用Binder？**

1. zygote在fork时，它会保持自己为单线程状态，这是因为多线程下的fork很容易在子进程中产生死锁、状态紊乱等一系列问题，根本原因是因为即便父进程为多线程，fork之后的子进程也只会有一个线程，这种多对一的转换会遗漏掉很多同步的信息
2. 19年邮件咨询过Google负责Binder的两位工程师，因为Binder压根就不支持fork，除非fork后调用exec开启全新的进程环境，这主要是因为Binder中对象生命周期的管理比较复杂，而如果为了支持fork，那么它的设计将会更加复杂
3. zygote和systemserver本就是父子关系，对于简单的消息通信，用管道或者socket非常方便。

**为什么不fork system_server？**<br />如果zygote用了binder机制，再fork systemServer，那systemServer就继承了zygote的描述符和映射的内存，这两个进程在binder驱动层就会共用一套数据结构，这肯定是不行的。那还得把旧的描述符关掉，再重新启动一遍binder机制，自找麻烦。

### ServiceManager

#### Client、Server和ServiceManager之间怎么通信的？

Client、Server和ServiceManager它们都是在不同的进程中，它们之间通信通过Binder IPC机制。Server提供服务给Client使用，这个服务是以Binder引用的形式提供的。那么Client如何拿到Server的Binder的引用呢？<br />从ServiceManager中拿，ServiceManager也是一个单独的进程，那么Client和Server如何与ServiceManager进行通信呢？这就陷入了先有鸡还是先有蛋的死循环了。<br />其实Client、Server和ServiceManager之间都是通过Binder通信的，只是ServiceManager作为特殊的Binder(handle=0)提前放入了Binder驱动里，Client和Server想要获取ServiceManager的Binder引用，只需要获取handle=0的Binder即可。

#### servicemanager进程和Binder驱动

servicemanager是用户空间的守护进程，它会在启动时和Binder驱动进行通信；<br />它会在Binder驱动新建ServiceManager对应的Binder实体，并将该Binder实体设置为全局变量。<br />**为什么要设置为全局的？**<br />因为Client和Server都需要和ServiceManager进行通信，不设置为全局的，怎么找到servicemanager。

#### ServiceManager如何注册为binder上下文管理者的？

ServiceManager提供的Binder比较特殊，它**没有名字也不需要注册**，当一个进程使用`BINDER_SET_CONTEXT_MGR`命令将自己注册成ServiceManager时Binder驱动会**自动为它创建Binder实体**（这就是那只预先造好的鸡）。其次**这个Binder的引用在所有Client中都固定为0**而无须通过其它手段获得。也就是说，一个Server若要向ServiceManager注册自己Binder就必需通过0这个引用号和ServiceManager的Binder通信。

### Android中使用binder一定要用service吗？

### 什么是匿名Binder、实名Binder？匿名Binder的应用。

- **实名Binder **在ServiceManager中注册了名字的Binder叫实名Binder；
- **匿名Binder **未在ServiceManager注册了名字就是匿名Binder，但必须通过实名Binder已经建立的Binder实体传递给Client，Client会收到这个匿名Binder的引用，通过这个引用向位于Server中的实体发送请求，匿名Binder为通信双方建立一条私密通道，只要Server没有把匿名Binder发送给其他进程，其他进程就无法通过穷举或猜测的方式获得该Binder的引用，向该Binder发送请求

### 什么是oneway？**AIDL的oneWay和非oneway有什么区别?**

oneway server端是串行处理，异步调用，Client端不用休眠等待驱动返回数据。

- 非oneway

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1652787303006-9edcaa36-f9aa-41d8-9237-a4935cdd6aeb.png#averageHue=%23fae2de&clientId=ud3d557e4-fd6b-4&from=paste&height=452&id=iBIk2&originHeight=904&originWidth=962&originalType=binary&ratio=1&rotation=0&showTitle=false&size=239264&status=done&style=none&taskId=u9aa3338f-bd09-438b-b606-6947bc15971&title=&width=481)

- oneway

![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1652787339300-16a894d1-6109-41c1-8af6-bfbc5a261cb5.png#averageHue=%23fadad6&clientId=ud3d557e4-fd6b-4&from=paste&height=337&id=t7tiB&originHeight=674&originWidth=944&originalType=binary&ratio=1&rotation=0&showTitle=false&size=167860&status=done&style=none&taskId=u6ae5894d-6523-4f64-bb23-82b37818fca&title=&width=472)

- 在AIDL中写代码时，如果接口标记了oneway，表示Server端**串行化处理(从异步队列中拿出消息指令一个个分发)、异步调用**。这个关键字主要是用于修改远程调用的行为，就如上面的两个图一样。非oneway关键字的AIDL类，**客户端需要挂起线程等待休眠，相当于调用了Sleep函数**。例如WMS 、AMS等相关系统Binder调用都是oneway的。

### **Intent跨进程传大图为什么会崩溃？**Binder传输数据大小限制？1M？怎么突破？

常规的intent传递数据，在startActivity时将Bundle的allowFds设置成了false（禁用了文件描述符）, 然后就会将 Bitmap直接写到Parcel缓冲区，不能利用共享内存，导致缓冲区超限，触发异常。如果通过 bundle.putBinder形式传递Bitmap，避免了Intent禁用描述符的影响，会开辟一个块共享匿名内存用来存Bitmap的数据，而Parcel 缓冲区只是存储 FD 。

#### Binder传输1M限制

原因：官方**TransactionTooLargeException**的文档中描述到：Binder 事务缓冲区有一个有限的固定大小，目前为 1MB，由进程所有正在进行的事务共享。继续往下看。<br />普通的应用是由Zygote孵化而来的用户进程，所映射的Binder内存大小是不到1M的，准确说是1M-8K：110241024) - (4096 *2) ：这个限制定义在frameworks/native/libs/binder/processState.cpp类中，如果传输数据超过这个大小，系统就会报错，因为Binder本身就是为了进程间频繁而灵活的通信所设计的，并不是为了拷贝大数据而使用的，所以当传递大的数据时会出现上述的错误：<br />**解决**：用Intent.putBinder<br />如果通过`bundle.putBinder`形式传递Bitmap，会开辟一个块共享匿名内存用来存Bitmap的数据，而Parcel 缓冲区只是存储 FD 。

### Binder只需要一次内存拷贝的原因？
