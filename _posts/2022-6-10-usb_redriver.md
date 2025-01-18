---
title: "USB redriver: NB7VPQ904M 浅析"
date: 2022-6-10 15:45:39 +0800
categories: [杂记, USB]
tags: [usb, driver, qualcomm]     # TAG names should always be lowercase
media_subpath: /assets/img/usb_redriver/
---

## 器件介绍

NB7VPQ904M 是一颗由 *onsemi* 的子公司 *Semiconductor Components Industries, LLC* 生产的 USB redriver 器件，其官方介绍是：

`1.8V USB Type-C™ DisplayPort™ ALT Mode 10Gbps Linear Redriver`

我们来逐字解析：

1. 1.8V 指器件所需的供电电压；
2. USB Type-C 是其所支持的 USB 接口形式；
3. ALT Mode 指的是 Type-C 的备选模式（Alternate Mode），目前有五种备选模式规范：DisplayPort（即 DP 协议）备选模式，Mobile High-Definition Link 备选模式，Thunderbolt（即雷电协议）备选模式，HDMI 备选模式以及 VirtualLink 备选模式，而 NB7VPQ904M 这颗器件支持 DisplayPort 备选模式；
4. 10Gbps 指的是 NB7VPQ904M 支持 USB 3.2 Gen 2 版本，并且向下兼容其他低版本；
5. Linear Redriver 是这颗器件的具体身份。关于 redriver，网络上能找到多种翻译，有叫中继器，有叫调节器，也有暴力翻译为再驱动器的，为了保持严谨性，本文中不对该词汇进行翻译。众所周知，USB 3.2 基于自身的传输特性，在介质中传输时很容易受到各种干扰导致信号完整性下降，而 redriver 的工作就是对衰减的 USB 信号进行补偿，一定程度上解决或减轻信号完整性下降的问题。如果一颗 redriver 在一定的范围内输出与输入信号呈现近似的线性关系，则其为 Linear Redriver，这类 redriver 不会解决反射（Reflection）与串扰（Crosstalk），相反还会伴随主信号的放大而放大。

## Pinout

NB7VPQ904M 没有公开其规格书，在网络上的资料几乎没有。不过我们仍然可以在[大大通](https://www.wpgdadatong.com/)这个网站上找到一份[有关 NB7VPQ904M 的硬件原理图](https://www.wpgdadatong.com/cn/solution/detail?PID=7087)：

![NB7VPQ904M](nb7vpq904m.png)

我们可以看到，该器件最重要的部分就是位于左右两侧的 USB 3.2 信号针脚，以 `A_RXTX+` 为例：`A` 表示 A 通道，该器件一共四个通道，对应 Type-C 的四组差分线；`RXTX` 表示该针脚既可以作为发射端（Transmitter）也可以作为接收端（Receiver），另一端使用 `TXRX` 表示这两针脚是对应关系；`+` 对应一组差分信号线中的正极。

实际设计中，我们会将 Type-C 的 `TX1+`/`TX1-`, `RX1+`/`RX1-`, `TX2+`/`TX2-`, `RX2+`/`RX2-` 分别连在左侧的四组通道上，将 SoC 的 USB 线路连接在右侧对应的通道上。

我们会发现，NB7VPQ904M 没有连接 Type-C 的 `CC` 针脚，这意味着 NB7VPQ904M **不具有识别正反插、备选模式的能力**，那么 NB7VPQ904M 是如何正常工作的呢？

事实上，正反插和备选模式的识别都依赖 PMIC，在驱动中会注册一个回调函数接收来自 PMIC 的通知，由驱动主动设置 NB7VPQ904M 的寄存器来完成正反插的切换，以及 USB 模式和备选模式的切换。

## 驱动

NB7VPQ904M 几乎是高通平台的御用 redriver，你可以在几乎任何高通平台的源代码中找到一个名为 `ssusb-redriver-nb7vpq904m.c` 的驱动。这里以 Realme 的开源仓库为例，该驱动文件的 Github 链接可以[在此处找到](https://github.com/realme-kernel-opensource/realme5-kernel-source/blob/master/drivers/usb/misc/ssusb-redriver-nb7vpq904m.c)，其设备树配置可以参考[同仓库中的 sm8150-qrd.dtsi 文件](https://github.com/realme-kernel-opensource/realme5-kernel-source/blob/9f3bb6686925d092e899c49ffcd520899ca86a55/arch/arm64/boot/dts/qcom/sm8150-qrd.dtsi#L202-L226)。本文中所有的源代码都出自 Realme 开源仓库。

首先我们看到设备树中的 `extcon` 属性：

```plaintext
redriver@19 {
    compatible = "onnn,redriver";
    reg = <0x19>;
    extcon = <&pm8150b_pdphy>, <&pm8150b_pdphy>;
    ...
};
```

extcon 即 External Connector，直译为外部连接器，对于 USB 相关器件而言，是在器件自身不支持检测 USB 状态的情况下，通过一些外部的机制来通知 USB 状态变化的机制，常见的主要分为通过 GPIO 通知以及通过 PMIC 通知。对于 NB7VPQ904M 而言，其 extcon 是 PM8150B 这颗 PMIC 器件。

我们接着来关注驱动中的 `ssusb_redriver_extcon_register` 函数：

```c
static int ssusb_redriver_extcon_register(struct ssusb_redriver *redriver)
{
    struct device_node *node = redriver->dev->of_node;
    struct extcon_dev *edev;
    int ret = 0;

    if (!of_find_property(node, "extcon", NULL)) {
        dev_err(redriver->dev, "failed to get extcon for redriver\n");
        return 0;
    }

    edev = extcon_get_edev_by_phandle(redriver->dev, 0);
    if (IS_ERR(edev) && PTR_ERR(edev) != -ENODEV) {
        dev_err(redriver->dev, "failed to get phandle for redriver\n");
        return PTR_ERR(edev);
    }

    if (!IS_ERR(edev)) {
        redriver->extcon_usb = edev;

        redriver->vbus_nb.notifier_call = ssusb_redriver_vbus_notifier;
        redriver->vbus_nb.priority = NOTIFIER_PRIORITY;
        ret = extcon_register_notifier(edev, EXTCON_USB,
                &redriver->vbus_nb);
        if (ret < 0) {
            dev_err(redriver->dev,
                "failed to register notifier for redriver\n");
            return ret;
        }

        redriver->id_nb.notifier_call = ssusb_redriver_id_notifier;
        redriver->id_nb.priority = NOTIFIER_PRIORITY;
        ret = extcon_register_notifier(edev, EXTCON_USB_HOST,
                &redriver->id_nb);
        if (ret < 0) {
            dev_err(redriver->dev,
                "failed to register notifier for USB-HOST\n");
            goto err;
        }
    }

    edev = NULL;
    /* Use optional phandle (index 1) for DP lane events */
    if (of_count_phandle_with_args(node, "extcon", NULL) > 1) {
        edev = extcon_get_edev_by_phandle(redriver->dev, 1);
        if (IS_ERR(edev) && PTR_ERR(edev) != -ENODEV) {
            ret = PTR_ERR(edev);
            goto err1;
        }
    }

    if (!IS_ERR_OR_NULL(edev)) {
        redriver->extcon_dp = edev;
        redriver->dp_nb.notifier_call =
                ssusb_redriver_dp_notifier;
        redriver->dp_nb.priority = NOTIFIER_PRIORITY;
        ret = extcon_register_blocking_notifier(edev, EXTCON_DISP_DP,
                &redriver->dp_nb);
        if (ret < 0) {
            dev_err(redriver->dev,
                "failed to register blocking notifier\n");
            goto err1;
        }
    }

    /* Update initial VBUS/ID state from extcon */
    if (extcon_get_state(redriver->extcon_usb, EXTCON_USB))
        ssusb_redriver_vbus_notifier(&redriver->vbus_nb, true,
            redriver->extcon_usb);
    else if (extcon_get_state(redriver->extcon_usb, EXTCON_USB_HOST))
        ssusb_redriver_id_notifier(&redriver->id_nb, true,
                redriver->extcon_usb);

    return 0;

err1:
    if (redriver->extcon_usb)
        extcon_unregister_notifier(redriver->extcon_usb,
            EXTCON_USB_HOST, &redriver->id_nb);
err:
    if (redriver->extcon_usb)
        extcon_unregister_notifier(redriver->extcon_usb,
            EXTCON_USB, &redriver->vbus_nb);
    return ret;
}
```
{: highlight-lines="21-24,31-34,54-58" }

在这个函数中，驱动向 extcon 注册了三个函数：`ssusb_redriver_vbus_notifier`, `ssusb_redriver_id_notifier` 和 `ssusb_redriver_dp_notifier`，分别用以接收 VBUS 状态变化（USB 拔插），ID 变化（主从切换）及 DP 变化（替代模式切换）。这三个函数中做的都是基础处理，复杂的处理都依靠工作队列机制交给了 `redriver->config_work` 来做：

```c
queue_work(redriver->redriver_wq, &redriver->config_work);
```

这个工作队列的注册可以在 `redriver_i2c_probe` 中找到：

```c
INIT_WORK(&redriver->config_work, ssusb_redriver_config_work);
```

`ssusb_redriver_config_work` 这个函数根据 extcon 提供的信息具体分析了主从、正反插等状态，之后通过 `ssusb_redriver_gen_dev_set` 这个函数设置到 NB7VPQ904M 的寄存器中：

```c
static void ssusb_redriver_gen_dev_set(
        struct ssusb_redriver *redriver, bool on)
{
    int ret;
    u8 val;

    val = 0;

    switch (redriver->op_mode) {
    case OP_MODE_USB:
        /* Use source side I/O mapping */
        if (redriver->typec_orientation
                == ORIENTATION_CC1) {
            /* Enable channel C and D */
            val &= ~(CHNA_EN | CHNB_EN);
            val |= (CHNC_EN | CHND_EN);
        } else if (redriver->typec_orientation
                == ORIENTATION_CC2) {
            /* Enable channel A and B*/
            val |= (CHNA_EN | CHNB_EN);
            val &= ~(CHNC_EN | CHND_EN);
        } else {
            /* Enable channel A, B, C and D */
            val |= (CHNA_EN | CHNB_EN);
            val |= (CHNC_EN | CHND_EN);
        }

        /* Set to default USB Mode */
        val |= (0x5 << OP_MODE_SHIFT);

        break;
    case OP_MODE_DP:
        /* Enable channel A, B, C and D */
        val |= (CHNA_EN | CHNB_EN);
        val |= (CHNC_EN | CHND_EN);

        /* Set to DP 4 Lane Mode (OP Mode 2) */
        val |= (0x2 << OP_MODE_SHIFT);

        break;
    case OP_MODE_USB_AND_DP:
        /* Enable channel A, B, C and D */
        val |= (CHNA_EN | CHNB_EN);
        val |= (CHNC_EN | CHND_EN);

        if (redriver->typec_orientation
                == ORIENTATION_CC1)
            /* Set to DP 4 Lane Mode (OP Mode 1) */
            val |= (0x1 << OP_MODE_SHIFT);
        else if (redriver->typec_orientation
                == ORIENTATION_CC2)
            /* Set to DP 4 Lane Mode (OP Mode 0) */
            val |= (0x0 << OP_MODE_SHIFT);
        else {
            dev_err(redriver->dev,
                "can't get orientation, op mode %d\n",
                redriver->op_mode);
            goto err_exit;
        }

        break;
    default:
        dev_err(redriver->dev,
            "Error: op mode: %d, vbus: %d, host: %d.\n",
            redriver->op_mode, redriver->vbus_active,
            redriver->host_active);
        goto err_exit;
    }

    /* exit/enter deep-sleep power mode */
    if (on)
        val |= CHIP_EN;
    else
        val &= ~CHIP_EN;

    ret = redriver_i2c_reg_set(redriver, GEN_DEV_SET_REG, val);
    if (ret < 0)
        goto err_exit;

    dev_dbg(redriver->dev,
        "successfully (%s) the redriver chip, reg 0x00 = 0x%x\n",
        on ? "ENABLE":"DISABLE", val);

    return;

err_exit:
    dev_err(redriver->dev,
        "failure to (%s) the redriver chip, reg 0x00 = 0x%x\n",
        on ? "ENABLE":"DISABLE", val);
}
```

注意下面这段代码：

```cpp
    case OP_MODE_USB:
        /* Use source side I/O mapping */
        if (redriver->typec_orientation
                == ORIENTATION_CC1) {
            /* Enable channel C and D */
            val &= ~(CHNA_EN | CHNB_EN);
            val |= (CHNC_EN | CHND_EN);
        } else if (redriver->typec_orientation
                == ORIENTATION_CC2) {
            /* Enable channel A and B*/
            val |= (CHNA_EN | CHNB_EN);
            val &= ~(CHNC_EN | CHND_EN);
        } else {
            /* Enable channel A, B, C and D */
            val |= (CHNA_EN | CHNB_EN);
            val |= (CHNC_EN | CHND_EN);
        }

        /* Set to default USB Mode */
        val |= (0x5 << OP_MODE_SHIFT);

        break;
```

这一段代码是仅 USB 模式下的寄存器配置。我们可以看到，它在检测到方向为 CC1 时，打开了 C/D 通道，检测到方向为 CC2 时，打开了 A/B 通道，也就是说驱动默认你将 Type-C 的 TX1/RX1 接在 C/D 通道，而 TX2/RX2 接在 A/B 通道。通常来说，**建议硬件上将 A/B/C/D 四个通道分别连接到 RX1/TX1/TX2/RX2**，因为这是这颗芯片的默认配置，哪怕芯片驱动出现异常，也能保证 USB 3.0 能够正常工作。注意到有配置 `(0x5 << OP_MODE_SHIFT)`{: .language-cpp }，由于这个模式下只有 USB，可推测该值对应的模式为四通道 USB。

再看到这一段代码：

```cpp
    case OP_MODE_USB_AND_DP:
        /* Enable channel A, B, C and D */
        val |= (CHNA_EN | CHNB_EN);
        val |= (CHNC_EN | CHND_EN);

        if (redriver->typec_orientation
                == ORIENTATION_CC1)
            /* Set to DP 4 Lane Mode (OP Mode 1) */
            val |= (0x1 << OP_MODE_SHIFT);
        else if (redriver->typec_orientation
                == ORIENTATION_CC2)
            /* Set to DP 4 Lane Mode (OP Mode 0) */
            val |= (0x0 << OP_MODE_SHIFT);
        else {
            dev_err(redriver->dev,
                "can't get orientation, op mode %d\n",
                redriver->op_mode);
            goto err_exit;
        }

        break;
```

这一段常用在眼镜类的产品上，将 Type-C 的四组通道拆分，两组供给 USB 3.1 使用，另外两组供给 DP 使用，因此我们可以看到代码中将 A/B/C/D 四个通道都打开了。另一方面，对于 CC1/CC2，驱动还配置了不同的 `OP_MODE`，我们可以猜测，设置 `(0x1 << OP_MODE_SHIFT)`{: .language-cpp } 意味着将 C/D 通道配置为 USB 3.1，A/B 通道配置为 DP；反过来说，设置 `(0x0 << OP_MODE_SHIFT)`{: .language-cpp } 可以猜测是将 A/B 通道配置为 USB 3.1，C/D 通道配置为 DP。

最后看到中间这段代码：

```cpp
    case OP_MODE_DP:
        /* Enable channel A, B, C and D */
        val |= (CHNA_EN | CHNB_EN);
        val |= (CHNC_EN | CHND_EN);

        /* Set to DP 4 Lane Mode (OP Mode 2) */
        val |= (0x2 << OP_MODE_SHIFT);

        break;
```

由于该模式仅有 DP，因此可推测 `(0x2 << OP_MODE_SHIFT)`{: .language-cpp } 是四通道 DP 模式。

## 参考

[Differences between linear and limiting redrivers - David Liu, Malik Barton](https://training.ti.com/ti-precision-labs-signal-conditioning-what-difference-between-linear-and-limited-redriver)

[基于onsemi NB7VPQ904M的5M高速TYPE-C CABLE线的设计方案](https://www.wpgdadatong.com/cn/solution/detail?PID=7087)
