## Android 手机同步方案

### Syncthing

#### 什么是 Syncthing？

Syncthing 是一款开源免费跨平台的文件同步工具，是基于 P 2 P 技术实现设备间的文件同步，所以它的同步是去中心化的，即你并不需要一个服务器，故不需要担心这个中心的服务器给你带来的种种限制，而且类似于 torrent 协议，参与同步的设备越多，同步的速度越快。针对隐私问题，Syncthing 软件只会将数据存储于个人信任的设备上，不会存储到服务器上。设备之间的通信均通过 TLS 进行，Syncthing 还使用了完全正向保密技术来进一步保障你的数据安全。对于处于不同局域网之中的设备之间的文件同步，Syncthing 也提供了支持。

#### 安装

1. Windows
   1. Syncthing 官方： <https://syncthing.net/downloads/>
   2. SyncTrayzor 图形化
2. Mac

#### 配置

##### 配置用户名和密码

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004122.png)

##### 配置主机

每台设备均会被分配一个**唯一的设备 ID（一长串字符）** 用以标识这台设备，后面同步我们会用到。点击 `操作` --> `显示ID` 即可查看。

查看主机 ID？

- 网页版的主机

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004505.png)

- Android 把抽屉拉出来就能看到：`显示设备ID`

互相添加设备：

- Web 端添加远程设备

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004720.png)

- Android 端添加远程设备

##### 新建共享文件夹

- Windows Web 端设置共享文件夹给远程设备

![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229004929.png)
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229005020.png)
![image.png ](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240229005113.png)

- Android 端接收
  - 打开 Android App 抽屉→网页管理页面
  - 会有提示刚刚共享的文件夹，选接收就好了
  - 配置忽略列表？
  - 等待同步就行了

##### 配置忽略模式

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403120815208.png)

##### 高级

- 文件夹类型，接收还是发送，设置好可以减少冲突

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202403120815192.png)

### 配置图床

参考 `图床` 章节
