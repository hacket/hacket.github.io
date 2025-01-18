---
title: "高通平台自定义按键进入 fastboot/recovery/edl 模式"
date: 2022-5-16 18:24:14 +0800
categories: [教程, Android]
tags: [android, qualcomm]     # TAG names should always be lowercase
---

在大多数高通平台上，默认都提供以下的按键功能：

1. 按住 <kbd>vol+</kbd> 键开机，进入 recovery 模式。
2. 按住 <kbd>vol-</kbd> 键开机，进入 fastboot 模式。
3. 按住 <kbd>vol+</kbd> 键及 <kbd>vol-</kbd> 键开机，进入 edl（Emergency Download）模式。

根据平台的不同，主要分为两种情况：使用 lk2nd 的高通平台以及使用 edk2 的高通平台。

## 使用 lk2nd 的平台

其源码位于 `bootable/bootloader/lk/app/aboot/aboot.c` 中。我们以 [msm8916 平台的 lk2nd](https://github.com/msm8916-mainline/lk2nd) 为例，在 [`aboot.c` 的 3967~3988 行](https://github.com/msm8916-mainline/lk2nd/blob/e34ea14a0afa63db96c67f57ef9d5acc4cbd71a2/app/aboot/aboot.c#L3967-L3988)：

```c
// 此处检测 vol+ 和 vol- 是否一起按下
if (keys_get_state(KEY_VOLUMEUP) && keys_get_state(KEY_VOLUMEDOWN))
{
    dprintf(ALWAYS,"dload mode key sequence detected\n");
    // 进入 edl 模式
    if (set_download_mode(EMERGENCY_DLOAD))
    {
        dprintf(CRITICAL,"dload mode not supported by target\n");
    }
    else
    {
        reboot_device(DLOAD);
        dprintf(CRITICAL,"Failed to reboot into dload mode\n");
    }
    boot_into_fastboot = true;
}
if (!boot_into_fastboot)
{
    // 检测 vol+，进入 recovery 模式
    if (keys_get_state(KEY_VOLUMEUP))
        boot_into_recovery = 1;
    // 检测 home/back/vol-，进入 fastboot 模式
    if (!boot_into_recovery &&
        (keys_get_state(KEY_HOME) || keys_get_state(KEY_BACK) || keys_get_state(KEY_VOLUMEDOWN)))
        boot_into_fastboot = true;
}
```

## 使用 edk2 的平台

其源代码位于 `bootable/bootloader/edk2/QcomModulePkg/Application/LinuxLoader/LinuxLoader.c` 中。在[该文件的 222 行到 227 行](https://github.com/SHIFTPHONES/android_bootable_bootloader_edk2/blob/f54e1022b2563388d0e8b0fec9f752852e819748/QcomModulePkg/Application/LinuxLoader/LinuxLoader.c#L222-L227)：

```c
if ((KeyPressed == SCAN_DOWN) || (KeyPressed == SCAN_DELETE))
    BootIntoRecovery = TRUE;
if ((KeyPressed == SCAN_UP) || (KeyPressed == SCAN_HOME))
    BootIntoFastboot = TRUE;
if (KeyPressed == SCAN_ESC)
    RebootDevice (EMERGENCY_DLOAD);
```

其中，`SCAN_UP`, `SCAN_DOWN`, `SCAN_DELETE`, `SCAN_HOME`, `SCAN_ESC` 等是 EFI Scan Codes，跟实际按键的绑定位于高通 BP 代码中。由于高通的保密性原则，我无法在此处贴出具体的代码。对于同样有高通 BP 代码访问权限的读者，请在 `boot_images` 下寻找 `ButtonsLib`，在代码中搜索上述 EFI Scan Codes 就能找到对应的代码；对于不具有高通 BP 代码访问权限的读者，这里列举出所有绑定关系：

| 按键 | EFI Scan Code |
| <kbd>vol+</kbd> | `SCAN_UP` |
| <kbd>vol-</kbd> | `SCAN_DOWN` |
| <kbd>vol+</kbd> + <kbd>vol-</kbd> | `SCAN_ESC` |
| <kbd>cam</kbd> + <kbd>vol+</kbd> | `SCAN_HOME` |
| <kbd>cam</kbd> + <kbd>vol-</kbd> | `SCAN_DELETE` |
| <kbd>power</kbd> + <kbd>vol+</kbd> | `SCAN_HOME` |
| <kbd>power</kbd> + <kbd>vol-</kbd> | `SCAN_DELETE` |
| <kbd>power</kbd> | `SCAN_SUSPEND` |
