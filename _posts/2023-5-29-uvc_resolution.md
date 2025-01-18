---
title: "抓包查看 UVC 设备选择的分辨率与帧率"
date: 2023-5-29 13:13:22 +0800
categories: [教程, USB]
tags: [usb, 教程, uvc, 抓包]     # TAG names should always be lowercase
media_subpath: /assets/img/usb/
---

**使用工具**: [Bus Hound](https://perisoft.net/bushound/), [USB Device Tree Viewer](https://www.uwe-sieber.de/usbtreeview_e.html)

打开 Bus Hound，转到 Devices 选项卡，在设备列表中找到想抓包的 UVC 设备，勾选其 UVC interface。如果你不确定，可以把全部勾上，不影响：

![Bus Hound Devices](bus_hound_devices.png)

通常，Video 帧数据通过 ISOC 传输，为了避免巨量的帧数据影响我们抓包，我们可以在 Settings 选项卡里把 ISOC 取消勾选。当然，一个更简单的方法是，除了必要的 CTL 和 OUT 以外其他的全部取消勾选：

![Bus Hound Settings](bus_hound_settings.png)

回到 Capture 选项卡，点击右下角的 Run 按钮开始抓包，然后打开使用该 UVC 设备的程序，抓取 USB 数据包。

在抓到的 USB 数据包中，我们去寻找以 `21 01 00 02` 开头的 CTL 包以及它紧邻的 OUT 包：

![Bus Hound Capture](bus_hound_capture.png)

该 CTL 包以下面的方式解析（注：都是**小端序**，即，先低字节，后高字节）：

| bmRequestType | bRequest |  wValue   |  wIndex   |  wLength  |
| :-----------: | :------: | :-------: | :-------: | :-------: |  |
|     0x21      |   0x01   | 0x00 0x02 | 0x01 0x00 | 0x1a 0x00 |

1. `bmRequestType` 指示请求的方向（Direction），类型（Type）及接收者（Recipient），`0x21` 代表：Direction = Host to Device, Type = Class, Recipient = Interface。
2. `bRequest` 指示请求的内容，`0x01` 代表 `SET_CUR`，即 Set Current 的缩写，设置当前属性。
3. `wValue` 对于 UVC 而言，其低位必须为 0，高位用于指示 CS（Control Selector）。`0x02` 对应的 CS 为 `VS_COMMIT_CONTROL`，用于提交所选择的 UVC 属性（这些属性在随后的 OUT 包中配置）。
4. `wIndex` 高位为 0，低位指示目标 interface 的 `bInterfaceNumber`，如果 UVC 设备有多个可选相机，可以以此进行区分。
5. `wLength` 指示尾随的 OUT 包的大小，`0x1a` 即 26 字节。

之后尾随的 OUT 包的数据格式，可以在规格书 UVC 1.5 Class specification 中的 Table 4-75 Video Probe and Commit Controls 找到完整定义，我们这边不解释它所有字段的含义，仅介绍我们所感兴趣的那几个：

1. 第三个字节 `0x02`，表示所选择的 UVC 格式类型描述符的 `bFormatIndex`，我们通过 USB Device Tree Viewer 可以找到该格式类型为 MJPEG：

   ![Device Tree View Format](device_tree_view_format.png)

2. 第四个字节，`0x04`，表示所选择的 UVC 帧类型描述符的 `bFrameIndex`，我们通过 USB Device Tree Viewer 可以找到 MJPEG 格式对应的该帧类型为 1920x1080 分辨率：

   ![Device Tree View Frame](device_tree_view_frame.png)

3. 第五~八字节，`0x15 0x16 0x05 0x00`，表示所选的 `dwFrameInterval`，即帧间隔（单位是 100 ns）。由于是小端序，也就是说实际值是 `0x00051615` 即 333333 * 100ns，则对应的帧率为 30 帧。
