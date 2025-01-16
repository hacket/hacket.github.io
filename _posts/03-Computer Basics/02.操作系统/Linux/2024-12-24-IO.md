---
date created: 2024-12-24 00:15
date updated: 2024-12-24 00:15
dg-publish: true
---

# IO

## 基础

### 文件描述符（File Descriptor FD）

计算机科学中的一个术语，是一个用于表述指向文件的引用的抽象化概念。文件描述符在形式上是一个**非负整数**。实际上，它是一个索引值，指向内核为每一个进程所维护的该进程打开文件的记录表。当程序打开一个现有文件或者创建一个新文件时，内核向进程返回一个文件描述符。

Linux的设计思想：**一切皆文件（不仅仅是磁盘文件，也有可能是内存文件）。**

Linux中一切都可以看作文件，包括普通文件、链接文件、Socket以及设备驱动等，对其进行相关操作时，都可能会创建对应的文件描述符。文件描述符是内核为了高效管理已被打开的文件所创建的索引，用于指代被打开的文件，对文件所有I/O操作相关的系统调用（例如read、write等）都需要通过文件描述符

可见，在Linux中，FD就是一种宝贵的系统资源。本质上，一个Linux进程启动后，会在内核空间生成文件描述符表（FDTable），记录当前进程所有可用的FD，也即映射着该进程所有打开的文件。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684772413572-228fab33-2a08-4bad-be21-4dbabb7fe7ff.png#averageHue=%23ededed&clientId=u67633cac-a19a-4&from=paste&height=493&id=udc91ad51&originHeight=739&originWidth=1246&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=231191&status=done&style=none&taskId=uf40cc070-4dce-4aaa-b658-e21038329e6&title=&width=830.6666666666666)<br />![](https://note.youdao.com/yws/res/76449/516F0BFBAAB2435883A55940AB6AA8A3#id=i6z6W&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />**FD实际上就是文件描述符表的数组下标（所以是非负整数）。**

### 缓存IO

缓存IO又被称为标准IO，大多数文件系统的默认IO操作都是缓存IO。在 Linux 的缓存 I/O 机制中，操作系统会将 I/O 的数据缓存在文件系统的页缓存（ page cache ）中，也就是说，数据会先被拷贝到操作系统内核的缓冲区中，然后才会从操作系统内核的缓冲区拷贝到应用程序的地址空间。

**缓存 I/O 的缺点：**<br />数据在传输过程中需要在应用程序地址空间和内核进行多次数据拷贝操作，这些数据拷贝操作所带来的 CPU 以及内存开销是非常大的。

### pipe 管道

> 在类Unix操作系统（以及一些其他借用了这个设计的操作系统，如Windows）中，管道（英语：Pipeline）是一系列将标准输入输出链接起来的进程，其中每一个进程的输出被直接作为下一个进程的输入。这个概念是由道格拉斯·麦克罗伊为Unix命令行发明的，因与物理上的管道相似而得名。

管道就是通常用于进程间通信的一种机制。一个程序的输出为另外一个程序的输入。<br />如，未使用管道：

```bash
ls > abc.txt # 把当前目录的文件列表输入到abc文本
grep xxx abc.txt # adb文本作为输出，让grep程序查找内容xxx
```

使用管道：

```bash
ls | grep xxx
```

> 达到同样的效果，还不需要显式地产生文件。shell会用一个管道连接两个进程的输入输出，以此实现跨进程通信

可以把管道的本质理解成一个文件，前一个进程用写的方式打开文件，后一个进程用读的方式打开。所以管道的系统调用函数是这样的：

```c
int pipe(int pipefd[2]);
```

函数调用后会创建2个文件描述符，即填充`pipefd`数组，其中pipefd[0]是读方式打开，pipefd[1]是写方式打开，分别作为管道的读和写描述符。

管道虽然形式上是文件，但本身并不占用磁盘存储空间，而是占用的内存空间，所以管道是一个操作方式和文件相同的内存缓冲区。

写入管道的数据会被缓存到直到另一端读取为止，所以上述命令是阻塞的，在ls没有结果产生之前grep并不会执行。

## 什么是IO？

IO是计算机体系中重要的一部分，不同的IO设备有着不同的特点：数据率不一样、传送单位不一样，数据表示不一样，很难实现一种统一的输入输出方法。<br />输入输出(input/output)的对象可以是文件(file)， 网络(socket)，进程之间的管道(pipe)。在linux系统中，都用文件描述符(fd)来表示。

### **计算机角度的IO**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677334034921-db71d3d3-d3d9-4573-9b11-04db41057288.png#averageHue=%23f0d7b8&clientId=u9ce9e587-ec24-4&from=paste&height=228&id=uc2093978&originHeight=557&originWidth=1170&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=76511&status=done&style=none&taskId=u32d0da99-117d-43a3-86cd-eb2fce57d86&title=&width=479.3333740234375)<br />**冯.诺依曼结构**：它将计算机分成分为5个部分：运算器、控制器、存储器、输入设备、输出设备。

- 输入设备是向计算机输入数据和信息的设备，键盘，鼠标都属于输入设备
- 输出设备是计算机硬件系统的终端设备，用于接收计算机数据的输出显示，一般显示器、打印机属于输出设备。

### **操作系统的IO**

将内存中的数据写到磁盘，将磁盘的数据读到内存中。这些操作由操作系统内核完成，用户应用程序跑在用户空间，它不存在实质的IO过程，真正的IO是在操作系统内核执行的，即应用程序的IO操作分为两种动作：**IO调用**和**IO执行**。IO调用是由进程发起，而IO执行是由操作系统内核完成的。所以我们所说的IO是应用程序对操作系统IO功能的一次触发，即IO调用。

### I/O控制器

#### I/O控制器介绍

由于CPU无法直接控制I/O设备的机械部件，因此I/O设备还要有个电子部件作为CPU和I/O设备机械部件之间的“中介”，用于实现CPU对设备的控制，这个电子部件就是**I/O控制器**，又称为设备控制器。<br />I/O控制器是控制计算机输入输出的一个最基本的控制系统，可指挥计算机的各个部件按照指令的功能要求协调工作的部件。它由`指令寄存器IR`（InstructionRegister）、`程序计数器PC`（ProgramCounter）和`操作控制器OC`（OperationController）三个部件组成，对协调整个电脑有序工作极为重要。<br />I/O控制器所在的位置：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684202610783-57567f05-504b-4a74-8b8f-f5c297fb6e4d.png#averageHue=%23f7f6f6&clientId=u52916f10-4e69-4&from=paste&height=223&id=ucfa2fdfe&originHeight=390&originWidth=794&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86576&status=done&style=none&taskId=ubb4eeb09-c89c-4e67-add9-8d213795f0f&title=&width=454)<br />I/O控制器图：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684202835956-1f72568e-43ad-4f0d-8764-032fdaedc65c.png#averageHue=%235e8255&clientId=u52916f10-4e69-4&from=paste&height=241&id=u9fa1a57f&originHeight=449&originWidth=596&originalType=binary&ratio=2&rotation=0&showTitle=false&size=377529&status=done&style=none&taskId=ue00e1896-6d0a-4b5e-bb7a-e0fc0ed435b&title=&width=320)

#### I/O控制器功能

1. **接收设备CPU指令**：CPU的读写指令和参数存储在控制寄存器中
2. **向CPU报告设备的状态**：I/O控制器中会有相应的状态寄存器，用于记录I/O设备的当前状态。（比如1代表设备忙碌，0代表设备就绪）
3. **数据交换**：数据寄存器，暂存CPU发来的数据和设备发来的数据，之后将数据发给控制寄存器或CPU。
4. **地址识别**：类似于内存的地址，为了区分设备控制器中的各个寄存器，需要给各个寄存器设置一个特定的地址。I/O控制器通过CPU提供的地址来判断CPU要读写的是哪个寄存器。

#### I/O控制器的工作示意图

```java
       +--------------+
       |  I/O控制器  |
       +--------------+
              |
              | 控制信号
              v
+-------+   +-------+
|  CPU  |<->|  总线 |
+-------+   +-------+
              |
              | 数据传输
              v
       +--------------+
       |   外部设备   |
       +--------------+
```

在这个示意图中，I/O控制器位于计算机系统和外部设备之间，负责协调和控制两者之间的数据传输和控制信号传输。CPU通过总线与I/O控制器通信，并向其发送命令和控制信号。I/O控制器使用这些信号来控制外部设备的操作，并将数据传输到或从设备中读取。数据传输过程中，I/O控制器可以直接访问计算机的内存，以加快数据传输速度。<br />这只是一个简单的示意图，实际的I/O控制器可能包含更多的组件和子系统，例如DMA控制器、中断控制器、状态寄存器等。不同类型的外部设备也可能需要不同类型的I/O控制器来管理其输入/输出操作。

#### I/O控制方式

##### **~~程序直接控制方式（串行，低效）~~**

**工作方式**：CPU向I/O模块发出读写指令，CPU会从状态寄存器中读取I/O设备的状态，如果是忙碌状态就继续轮询检查状态，如果是已就绪，就代表I/O设备已经准备好，可以从中读取数据到CPU寄存器中，读到CPU后，CPU还要往存储器（内存）中写入数据，写完后再执行下一套指令。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684203030328-3c560089-5bec-4b7b-a198-af501b5aa3ad.png#averageHue=%23efefef&clientId=u52916f10-4e69-4&from=paste&height=388&id=ubda6a039&originHeight=776&originWidth=489&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109963&status=done&style=none&taskId=u88b8ae97-5bf3-49b1-a8e1-fe5436d98f2&title=&width=244.5)<br />**优点**：实现简单。在读写指令之后，加上实现轮询检查的一系列指令即可。<br />**缺点**：CPU和I/O设备只能串行化工作，CPU需要一直轮询检查，长期处于忙等状态，**CPU利用率很低。**

> CPU长期轮训，忙等状态，CPU利用率低

##### **中断驱动方式**

**工作方式：**中断驱动方式的思想是允许I/O设备主动打断CPU的运行并请求服务，从而“解放”CPU，使得其向I/O控制器发送读命令后可以继续做其他有用的工作。I/O控制器从CPU接收一个读命令，然后从外围设备读数据，一旦数据读入到该I/O控制器的数据寄存器，便通过控制线给CPU发出一个中断信号，表示数据已准备好，然后等待CPU请求该数据。I/O控制器收到CPU发出的取数据请求后，将数据放到数据总线上，传到CPU的寄存器中。至此，本次I/O操作完成，I/O控制器又可开始下一次I/O操作。这样就使得CPU与I/O设备能够并行工作。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684203370018-f696db1a-10ae-49b9-80a8-d12eb4eabec6.png#averageHue=%23f1f0f0&clientId=u52916f10-4e69-4&from=paste&height=395&id=uc4653cb7&originHeight=789&originWidth=503&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112882&status=done&style=none&taskId=u5d203ddb-1b06-4310-a6a8-867100c93a6&title=&width=251.5)<br />**优点：**与程序直接控制方式相比，在中断驱动方式中，I/O控制器会通过中断信号主动报告I/O已完成，CPU不再需要不停的轮询。**CPU和I/O设备可并行工作，CPU利用率得到明显提升。**<br />**缺点**：由于数据中的每个字在存储器与I/O控制器之间的传输都必须经过CPU，这就导致了中断驱动方式仍然会消耗较多的CPU时间。

> CPU被中断次数过多，CPU时间消耗过多

##### **DMA（直接存储方式）**

**工作方式：**方式的数据流向是从设备直接放入内存**（设备→内存）**，或者是从内存直接到设备**（内存→设备）**，不再使用CPU作为中间者。CPU在读写数据前要指明要读入多少数据、数据要存放在内存中的什么位置、数据放在外部磁盘的什么位置等问题，然后DMA控制器会根据CPU提出的要求完成数据的读写操作。当整块数据的传输完成后，才向CPU发出中断信号。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684203487628-fb6c263c-c614-480c-9e18-6d54fb3a3d72.png#averageHue=%23685f5a&clientId=u52916f10-4e69-4&from=paste&height=251&id=u781e9cf9&originHeight=501&originWidth=1000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=357555&status=done&style=none&taskId=u4e6fd78a-3f12-4747-bf27-365fcaf6224&title=&width=500)<br />**优点：**数据传输效率以**“块”**为单位，仅仅在传送一个或多个数据块的开始和结束时，才需要CPU的干预，CPU的介入性进一步降低；同时，CPU和I/O设备的并行性进一步提升。<br />**缺点：**CPU发出一条指令，只能读或写**一个或多个**连续的数据块。如果读写的数据块不是连续存放的而是离散的，那么CPU要分别发出多条I/O指令，进行多次中断处理才能完成。

##### 通道控制方式

工作方式：通道是一种硬件，可以理解为“低配版的CPU”。通道与CPU相比的话，CPU能够处理的指令种类比较多，而通道只能执行单一指令。使用这种控制方式，CPU干涉频率极低，通道会根据CPU的指令执行响应程序，只有完成**一组数据块**的读写后才需要发出中断信号让CPU干预。<br />**优点：**CPU、 通道、I/O设备可并行工作，资源利用率极高。<br />**缺点：**实现复杂，需要专门的通道硬件支持。

#### I/O控制方式小结

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1684203686552-b881cd9a-b208-4afa-bb5c-5a9b726e9b17.png#averageHue=%23bfcdde&clientId=u52916f10-4e69-4&from=paste&height=288&id=u6af35686&originHeight=484&originWidth=1000&originalType=binary&ratio=2&rotation=0&showTitle=false&size=706316&status=done&style=none&taskId=u6ad80eb6-3945-458f-9ece-d5130f79635&title=&width=596)

### DMA

`DMA（Direct Memory Access，直接内存访问）`是一种硬件技术，它需要通过硬件实现才能完成数据的直接内存访问。具体来说，DMA需要由DMA控制器和相关的硬件组件组成，用于管理和控制数据传输过程，以实现在不需要CPU干预的情况下实现高效的数据传输。因此，DMA是一种基于硬件的技术，不依赖于操作系统或软件的支持，可以独立地完成数据传输和处理任务。当然，在使用DMA技术时，需要使用一些驱动程序或操作系统提供的接口来控制DMA控制器的行为，以确保其能够正确地工作并提高系统的性能和效率。<br />DMA存在于计算机的主板和外设之间，作为主板和外设之间的数据传输通道。具体来说，DMA通常由以下硬件组成：

1. DMA控制器：用于管理DMA传输过程，包括控制数据传输的方向、地址和大小等。
2. DMA通道：用于连接DMA控制器和外设，传输数据。
3. DMA缓冲区：用于存储传输的数据，其大小和位置由DMA控制器管理。
4. 总线接口：用于连接DMA控制器和主板的系统总线，以实现与主板的通信和数据传输。

在计算机系统中，DMA技术被广泛应用于各种外设，例如网络适配器、声卡、硬盘、光驱等。通过使用DMA技术，这些外设可以快速地读取或写入数据，而无需CPU的干预，从而提高了系统的性能和效率。同时，DMA技术也可以用于一些特殊的数据处理任务，例如数据压缩、加密等。<br />**DMA是一种用于高效数据传输的技术，可以大大提高系统的性能和效率。它通过直接访问计算机的内存来实现数据传输，减轻了CPU的负担，提高了系统的响应速度和数据传输速度。**

### I/O过程需要CPU参与吗？

需要。

- 程序直接控制、中断驱动等IO控制方式方式，需要大量的CPU参与整个IO过程
- 基于DMA的I/O控制器在数据传输过程中可以通过DMA技术直接读写内存，从而不需要CPU的干预。但是，在数据传输开始和结束时，仍然需要`CPU的参与来初始化DMA控制器和处理传输结果`。CPU需要完成以下任务：
  1. 初始化DMA控制器：CPU需要设置DMA控制器的源地址、目的地址、传输长度等参数，以确保DMA控制器能够正确地进行数据传输。
  2. 开始传输：CPU需要启动DMA控制器开始数据传输，以便将数据从外设读入到内存中或从内存中写入到外设中。
  3. 结束传输：DMA控制器在数据传输完成后会向CPU发送中断请求信号，CPU需要响应中断请求并处理传输结果。

## 事件

- 可读事件，当文件描述符关联的内核读缓冲区可读，则触发可读事件（可读：内核缓冲区非空，有数据可以读取）
- 可写事件，当文件描述符关联的内核写缓冲区可写，则触发可写事件（可写：内核缓冲区不满，有空闲空间可以写入）

## 网络IO模型之同步IO和异步IO

**同步IO**

- blocking IO 阻塞IO
- nonblocking IO 非阻塞IO
- IO multiplexing IO多路复用
- signal driven IO 信号驱动IO（平时很少用）

**异步IO**

- asynchronous IO 异步IO

一般情况下，一次网络IO读操作会涉及到两个系统对象：用户进程Process和内核对象kernel。kernel的两个处理阶段：

- Waiting for the data to be ready 等待数据准备好
- Coping the data from the kernel to the process 将数据从内核空间的buffer拷贝到用户空间进程的buffer

IO模型的异同点就是区分在这两个系统对象、两个处理阶段的不同上。

### Blocking IO（阻塞IO，BIO）

**阻塞IO：**应用进程发起IO调用，如果内核的数据没有准备好的话，应用进程会一直阻塞等待，直到内核数据准备好了，从内核空间拷贝到用户空间，才返回成功。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677334909728-58f5c319-9a7b-48b4-9287-ffa1c6b68022.png#averageHue=%23f8f8f8&clientId=u9ce9e587-ec24-4&from=paste&id=uec6345b8&originHeight=331&originWidth=552&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=50964&status=done&style=none&taskId=u6cab564c-a5ae-42eb-98d0-b32b9b419dd&title=)

> application在Blocking IO读recvfrom操作的两个阶段都是等待的，在数据没准备好的时候，application原地等待kernel准备数据，kernel准备好数据后，application继续等待kernel将数据拷贝到application的buffer，在kernel完成数据copy后application才会从recvfrom系统调用中返回。

**阻塞IO应用**_**：

- Socket
- Java BIO

**阻塞IO缺点：**<br />如果内核数据一直没有准备好，用户进程会一直阻塞，浪费性能

### Nonblocking IO（非阻塞IO，NIO）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677335138669-feebb155-421c-4e84-9723-077888739e49.png#averageHue=%23f6f5f5&clientId=u9ce9e587-ec24-4&from=paste&id=u083cc1f4&originHeight=333&originWidth=603&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=68042&status=done&style=none&taskId=uf6f1b7d8-ac8b-4eaf-80aa-7b60de21efc&title=)<br />**非阻塞IO：**recvfrom不阻塞，用户进程不断轮询看内核进程的数据是否准备好；kernel将数据拷贝到进程空间buffer用户进程是需要等待的。

> NIO读recvfrom操作的第一个阶段是不会block等待的，如果kernel数据还没准备好，那么recvfrom会立刻返回一个EWOULDBLOCK错误；当kernel准备好数据后，进入第二个阶段，application会等到kernel将数据copy到用户空间buffer，在kernel完成数据的copy后application才会从recvfrom系统调用中返回。

**非阻塞IO缺点**：

- 频繁的轮询，导致频繁的系统调用，同样会消耗大量的CPU资源

### IO multiplexing（IO多路复用）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677338547175-a4012899-51dd-4b3e-a13b-b601ca256966.png#averageHue=%23f6f6f6&clientId=u9ce9e587-ec24-4&from=paste&id=u9a31b66d&originHeight=326&originWidth=609&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=63741&status=done&style=none&taskId=uc09b4918-669a-44af-9904-3cec18b7ca3&title=)<br />**IO多路复用**：熟知的select、poll和epoll模型。他们可以同时监控多个fd，任何一个返回内核数据就绪，应用进程再发起recvfrom系统调用。<br />IO多路复用，application在wait for data和copy data from kernel to user都是block住的<br />**IO多路复用优点：**

- 同时监听处理多个IO

### Asynchronous IO AIO 异步IO

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677339040839-2cd53f8a-044b-4630-bd91-07bd2f6dc9a9.png#averageHue=%23f8f8f8&clientId=u9ce9e587-ec24-4&from=paste&id=u5963b358&originHeight=324&originWidth=572&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=55260&status=done&style=none&taskId=u2b15dae5-abc5-4e7c-97a9-be3b17b56d9&title=)<br />**异步IO：**在recvfrom操作的两个处理阶段上都不能等待，application调用recvfrom后立刻返回，kernel自行去准备好数据并将数据从kernel的buffer中copy到application的buffer再通知application读操作完成了，然后application再去处理。<br />Linux的网络IO中是不存在异步IO的，Linux的网络IO处理的第二阶段总是阻塞等待数据copy完成的，真正的网络异步IO是Windows下的IOCP模型。

#### non-blocking IO和asynchronous IO区别

这两种容易混淆，认为是一样的，其实是不一样的。

- non-blocking IO仅仅是在发送recvfrom后不会阻塞，但它仍然要求进程去主动检查，并且当数据准备完成后，它需要进程主动地再次调用recvfrom来将数据拷贝到用户内存中
- asynchronous IO它就像是用户进程将整个IO操作都交给了内核完成，然后内核做完后发信号通知

## IO多路复用模型

**IO多路复用背景：**<br />阻塞I/O模型下，一个线程只能处理一个流的I/O事件。如果想要同时处理多个流，要么多进程，要么多线程。

### select/poll

**什么是select？**<br />应用进程通过调用select函数，可以同时监控多个fd，在select监控的fd中，只要有任何一个数据状态准备就绪了，select函数就会返回可读状态，这时应用进程再发起recvfrom请求去读取数据。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677340915990-0218896d-aa14-461b-9aff-3c4eff484f5e.png#averageHue=%23faf8f5&clientId=u9ce9e587-ec24-4&from=paste&height=467&id=u8f138f79&originHeight=700&originWidth=1204&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=184598&status=done&style=none&taskId=ub72969b4-fda0-4c23-90d9-69307577814&title=&width=802.6666666666666)<br />**select流程：**<br />select可以同时观察许多流的I/O事件，在空闲的时候，会把当前线程阻塞掉，当有一个或多个流有I/O事件时，就从阻塞态中醒来，于是我们的程序就会轮询一遍所有的流（于是我们可以把“忙”字去掉了），于是，如果没有I/O事件产生，我们的程序就会阻塞在select处。但是依然有个问题，我们从select那里仅仅知道了，有I/O事件发生了，但却并不知道是那几个流（可能有一个，多个，甚至全部），我们只能**无差别轮询**所有流，找出能读出数据，或者写入数据的流，对他们进行操作。<br />**poll背景：**<br />select存在连接限制，所以又提出了poll，解决了连接限制的问题。<br />但是呢，select和poll一样，还是需要通过遍历文件描述符来获取已经就绪的socket。如果同时连接的大量客户端，在一时刻可能只有极少处于就绪状态，伴随着监视的描述符数量的增长，效率也会线性下降。<br />**select/poll缺点：**

- 每次调用select/poll，都需要把fd集合从用户态拷贝到内核态，这个开销在fd很多时会很大
- 同时每次调用select/poll都需要在内核遍历传递进来的所有fd，这个开销在fd很多时也很多
- select支持的fd数量太小，默认1024

### epoll

#### 什么是epoll？

epoll是Linux内核的可扩展I/O事件通知机制。于Linux 2.5.44首度登场，它设计目的旨在取代既有POSIX select(2)与poll(2)系统函数，为了同时监听多个文件描述符的I/O读写事件而设计的。epoll 实现的功能与 poll 类似，都是监听多个文件描述符上的事件。<br />epoll可以理解为event poll，不同于忙轮询和无差别轮询，epoll采用事件驱动来实现，它会把哪个流发生了怎样的I/O事件通知我们。

#### epoll流程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677428499905-46318c2c-666c-4cf2-9b3b-040191de994a.png#averageHue=%23f3e9d2&clientId=u9ce9e587-ec24-4&from=paste&id=u8cfa94a5&originHeight=1232&originWidth=1407&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=541848&status=done&style=none&taskId=u362eedf4-2613-47d3-8ad6-9fe1cc2ad03&title=)<br />epoll先通过epoll_ctl()来注册一个fd，一旦基于某个fd就绪时，内核会采用回调机制，迅速激活这个fd，当进程调用epoll_wait()时便得到通知（避免了遍历所有的文件描述符），而是采用监听事件回调的机制。

- epoll_create 创建一个epoll对象
- epoll_ctl 向epoll实例添加要监控的描述符和感兴趣的事件
- epoll_wait 等待其管理的连接上的IO事件

```c
// 在内核中创建epoll实例并返回一个epoll文件描述符
int epoll_create(int size);
int epoll_create1(int flags);

// 向epfd（上面create的）对应的epoll实例添加、修改或删除对fd（即第3个参数）上事件event的监听
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);

// 它等待注册在epfd上面的事件，事件从events参数中带出
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);
```

#### epoll优点

1. 能高效检查大量文件描述符（相比select/poll，少量描述符的性能可能还不如前面两个）
2. 基于事件驱动的，不需要无差别的轮询
3. 使用mmap加速内核与用户空间的消息传递
4. 支持水平和边缘触发

### select、poll和epoll区别？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677346581544-ad44fd0f-5a20-4b69-8c3d-51feb955c202.png#averageHue=%23f8f7f6&clientId=u9ce9e587-ec24-4&from=paste&height=482&id=u45203e78&originHeight=723&originWidth=1254&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=217098&status=done&style=none&taskId=u6417b0fd-3648-40a2-beb1-fe9a6c09178&title=&width=836)

### 为什么epoll比poll/select高效？

- **select连接数限制**

select和poll的动作基本一致，只是poll采用链表来进行文件描述符的存储，而select采用fd标注位来存放，所以select会受到最大连接数的限制(Linux默认是1024，而poll不会)

- **select/poll需遍历就绪找到fd，epoll不需要**

select/poll采用轮询的方式来检查文件描述符是否处于就绪状态，而epoll采用回调机制，造成的结果就是，随着fd的增加，select和poll的效率会线性降低，而epoll不会手动太大影响，除非非活跃的Socket很多

- **mmap **select/poll都需要将有关文件描述符的数据结构拷贝进内核，最后再拷贝出来；而epoll创建的有关文件描述符的数据结构本身就存在于内核态中，系统调用返回时利用mmap文件映射内存加速与内核空间的消息传递，epoll使用mmap减少复制开销
- epoll的边缘触发模式效率高，系统不会充斥着大量不关心的就绪文件描述符
- 虽然epoll的性能最好，但是在连接数少并且连接都十分活跃的情况下，select和poll的性能可能比epoll好，毕竟epoll的通知机制需要很多函数回调。

# 磁盘IO

Linux系统下IO结构模型：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675956163533-62f4e8ae-4031-4bf2-934a-d003be10b596.png#averageHue=%23fbf3e5&clientId=u576b8402-5d99-4&from=paste&id=u98ef6e0d&originHeight=503&originWidth=862&originalType=url&ratio=1&rotation=0&showTitle=false&size=89413&status=done&style=none&taskId=uc6d08ea1-5fa8-4c4e-a847-ea5b83b1c04&title=)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1675960258157-d1c4f22b-a01a-4bfd-926a-0e04fd71f9ed.png#averageHue=%23f8f7f6&clientId=ufdd86ec2-4dbe-4&from=paste&height=410&id=u7460f9a2&originHeight=615&originWidth=1011&originalType=binary&ratio=1&rotation=0&showTitle=false&size=95464&status=done&style=none&taskId=u3b07152c-b2ff-46e5-aa15-86f12da8897&title=&width=674)

## 标准IO standard io

大多数文件系统的默认I/O操作都是标准I/O。在Linux的缓存I/O机制中，数据先从磁盘复制到内核空间的缓冲区，然后从内核空间缓冲区复制到应用程序的地址空间。

- read 操作系统检查内核的缓冲区有没有需要的数据，如果已经缓存了，那么就直接从缓存中返回；否则从磁盘中读取，然后缓存在操作系统的缓存中。
- write 将数据从用户空间复制到内核空间的缓存中。这时对用户程序来说写操作就已经完成，至于什么时候再写到磁盘中由操作系统决定，除非显示地调用了sync等同步命令。

**优点**

1. 在一定程序上分离了内核空间和用户空间，保证系统本身的运行安全
2. 可以减少读盘的次数，提高性能

**缺点**

1. 数据在传输过程中需要在应用程序地址空间和内核缓存之间进行多次数据拷贝操作，这些数据拷贝操作所带来的CPU以及内存开销是非常大的。

## 直接IO direct io 很少用

应用程序直接访问磁盘数据，而不经过内核缓冲区，目的是减少一次从内核缓冲区到用户程序缓存的数据拷贝。<br />direct io 一般很少使用，甚至有些文件系统干脆就不支持 direct io。<br />**缺点**

1. 如果访问的数据不在应用程序缓存中，那么每次数据都会直接从磁盘加载，会非常耗时。

## mmap

mmap是指将磁盘上文件的位置与进程逻辑地址空间中的一块大小相同的区域映射，当要访问内存中一段数据时，转换为访问文件的一段数据。减少了数据在用户空间和内核空间之间的拷贝。<br />**优点**

1. 减少系统调用，只需要一次mmap系统调用，不会出现大量的read/write系统调用
2. 减少数据拷贝，普通的read调用数据需要经过两次拷贝；而mmap只需要从磁盘拷贝一次就可以了

**缺点**

# 面试题

## mmap相关

### 说说mmap为什么比普通IO效率高？

**普通IO**需要两次内存拷贝，磁盘->内核pagecache->应用程序 导致有两次数据拷贝<br />**mmap**是一种内存映射文件的方法，它将一个文件映射到进程的地址空间，建立文件磁盘地址与虚拟内存的一种对应关系，如此，读写相应的虚拟地址等同于直接读写对应的文件内容了，这样映射的最大好处是进程可以直接读取内存，避免了频繁的使用read/write等系统调用；(将内核page_cache映射到用户空间的虚存地址，用户代码直接以内存的方式访问，通过 pagefault与操作系统交互)<br />mmap()高效的原因：减少了一次`copy_to_user`内核态到用户态的文件拷贝。<br />但如果mmap出现了pagefault，就不一定高效了；有人就会说了mmap 会导致pagefault,但是standard io 也需要触发io操作？因为缺页中断比io开销更高。<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1675960542408-111a8cff-ccd9-4a6f-a479-1db08f08d8c5.webp#averageHue=%23f3f3f3&clientId=ufdd86ec2-4dbe-4&from=paste&height=392&id=u4e404f10&originHeight=801&originWidth=1440&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u81587b5d-230a-404c-b420-3bf0d6a027f&title=&width=705)

## 在 4GB 物理内存的机器上，申请 8G 内存会怎么样？

应用程序通过malloc函数申请内存时，实际上申请的是虚拟内存，此时并不会分配物理内存。当应用程序读写了这块虚拟内存，CPU就会访问这个虚拟内存，这时会发现这个虚拟内存没有映射到物理内存，CPU就会产生缺页中断，进程会从用户态切换到内核态，并将缺页中断交给内核的Page Fault Handler处理

- 在32位操作系统，因为进程最大只能申请3GB大小的虚拟内存，所以直接申请8GB内存，会申请失败
- 在64位操作系统，因为进程最大只能申请 128 TB 大小的虚拟内存，即使物理内存只有 4GB，申请 8G 内存也是没问题，因为申请的内存是虚拟内存，等这块虚拟内存被访问了，因为物理空间不够，就会发生 OOM。
- [x] [在 4GB 物理内存的机器上，申请 8G 内存会怎么样？](https://mp.weixin.qq.com/s/BEYMb3B15Hih5LKx0EzfaA)
