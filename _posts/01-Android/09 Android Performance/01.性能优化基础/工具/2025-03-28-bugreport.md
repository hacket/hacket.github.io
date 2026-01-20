---
banner: 
date_created: Friday, March 28th 2025, 11:12:55 am
date_updated: Friday, June 6th 2025, 1:11:06 am
title: bugreport
author: hacket
categories:
  - 性能优化
category: crash
tags: []
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
aliases: [Bugreport]
linter-yaml-title-alias: Bugreport
---

# Bugreport

## Bugreport 介绍

### 什么是 Bugreport？

Bugreport 是 Android 系统中一个用于收集和压缩设备状态信息的工具，它能够生成包含系统日志、内存状态、进程信息、崩溃信息等在内的详细报告。这些报告通常以压缩文件（如.zip 格式）的形式存在，便于用户发送、分享或进一步分析。通过 Bugreport，开发人员可以全面了解系统在特定时刻的状态，从而定位并解决潜在的问题。

### Bugreport 的生成与获取

当我们的应用遇到 ANR 时，可能会想到的办法是去看 `data/anr` 目录的 `trace.txt` 文件，如下图所示：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250328135942.png)

ANR 的 `trace.txt` 文件在高版本设备上是没有权限获取的，`bugreport` 工具就能解决这样的问题

```shell
adb bugreport
```

运行上面的 adb 命令后会生成一个命名为 `bugrepory_<brand>_<model>_<版本号>-<yyyy-MM-dd-HH-mm-ss>.txt` 的压缩包文件，上面是没在 bugreport 命令后加上存储路径，会自动保存在设备内部存储的 bugports 文件夹下：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250328140426.png)

解压后：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20250328140619.png)

这个时候的压缩包实际上是记录了很多个子文件，我们可以在里面找到我们需要的比如 anr 的 `trace.txt` (`FS/data/anr`) 文件：

打开后看看内容，发现其实就是我们平时需要的 anr 的 log 文件，内容是一样。

**bugreport 命令：**

```shell
# 生成报告到当前目录（默认文件名如 bugreport-<设备名>-<时间>.zip）：
adb bugreport

# 指定输出文件名
adb bugreport my_bugreport.zip

# 指定设备（多设备连接时）：
adb -s <设备序列号> bugreport

# 输出到指定目录：
adb bugreport /path/to/save/directory/
```

**Android 版本差异**：
- **Android 7.0+**：报告以 ZIP 文件格式生成，包含多个日志文件。
- **旧版本**：可能生成单个文本文件（`bugreport.txt`）。

**注意：**
 bugreport 对**日志的记录有实效和大小限制**，只能导出近期的报告，如果 app 出现问题需要排查，尽早的导出日志，避免关键信息被覆盖丢失

## Bugreport 分析工具

### ChkBugReport

见：[[ChkBugReport]]

### Battery Historian

见： [[Battery Historian]]

## Bugreport 解析

### bugreport 文件结构

该文件由各种**dumpsys 信息**、**log**以及**各种系统工具查询结果**拼接而成。其他包含文本 (.txt) 格式的 `dumpsys`（转储系统）、`dumpstate`（转储状态）、`Logcat` 数据，便于轻松搜索特定内容。以下各部分详细说明了 BugReport 的组成部分及常见问题，并提供了关于查找与这些错误相关的日志的实用提示和 grep 命令。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202505150048340.png)

#### FS

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202505290038511.png)

看 data 目录：

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202505290038147.png)

- **ANR**
- **misc**
- **tombstones**
发生 native crash 时，会在这里生成一份 tombstone log。不论是 APP/HAL/其他进程等。

#### bugreport 文件分隔

可以使用 glogg 搜索 `was the duration of` _，_ 这样每段的结尾都会搜索出来，方便定位。如果能做个工具自动分割就更好了。

### DUMPSYS CRITICAL (/system/bin/dumpsys)

这部分主要是打印系统各个重要模块的 `dumpsys` 信息。

```shell
------ DUMPSYS CRITICAL (/system/bin/dumpsys) ------
-------------------------------------------------------------------------------
DUMP OF SERVICE CRITICAL SurfaceFlinger:
Service host process PID: 1190
Threads in use: 0/5

# ...
DUMP OF SERVICE CRITICAL SurfaceFlinger:
--------- 0.236s was the duration of dumpsys SurfaceFlinger, ending at: 2025-05-21 23:47:27

# ...
DUMP OF SERVICE CRITICAL activity:
Service host process PID: 1885
Threads in use: 0/32
Client PIDs: 13237, 12565, 13116, 5316, 12173, 11344, 11194, 11099, 11079, 10316, 10091, 9919, 9835, 9231, 7062, 5821, 2811, 1886, 32086, 31987, 31869, 31334, 28401, 25943, 18693, 30469, 9714, 2618, 4654, 22676, 18182, 6503, 27096, 21578, 21823, 7242, 1025, 22427, 18649, 9148, 30468, 21707, 23145, 17358, 686, 4518, 22899, 27713, 17341, 21295, 15987, 7919, 7905, 25129, 28869, 28544, 24648, 8208, 6994, 6640, 16769, 27315, 25520, 31867, 5001, 2163, 17863, 3941, 1190, 23434, 12048, 9747, 9498, 9374, 9052, 8899, 8821, 8667, 8646, 8580, 8486, 8384, 8376, 8314, 8261, 5795, 4753, 4038, 3893, 3571, 3244, 3201, 3199, 3181, 3171, 3158, 3121, 3088, 3025, 2968, 2900, 2840, 2679, 2611, 2517, 913, 1183, 1372, 1382, 474
ACTIVITY MANAGER ACTIVITIES (dumpsys activity activities)
Display #0 (activities from top to bottom):
## ... 
--------- 0.501s was the duration of dumpsys activity, ending at: 2025-05-21 23:47:27
```

- dumpsys SurfaceFlinger
- dumpsys activity
- dumpsys cpuinfo
- dumpsys input
- dumpsys input_method
- dumpsys notification
- dumpsys power
- dumpsys sensorservice
- dumpsys window

### ANRs 和 deadlocks

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#anrs-deadlocks>

BugReport 有助于找出导致 `ANR errors` 和 `deadlock events` 的原因。

#### 识别未响应的 APP

当某个应用在一定时间内没有响应（通常是由于主线程被阻塞或繁忙）时，系统会终止该进程，并将堆栈转储到 `/data/anr`。

- 找出 ANR 罪魁祸首，搜索 `bugreport-xxx.txt` 对 `bugreport-2025-03-28-10-23-03.txt` 日志中的 `am_anr` 执行 grep 命令

```shell
grep "am_anr" bugreport.txt
# 10-01 18:12:49.599  4600  4614 I am_anr : [0,29761,com.google.android.***,953695941,executing service com.google.android.***/com.google.android.apps.***.app.offline.transfer.OfflineTransferService] 10-01 18:14:10.211  4600  4614 I am_anr : [0,30363,com.google.android.apps.plus,953728580,executing service com.google.android.apps.plus/com.google.android.apps.photos.service.PhotosService] 
```

- **搜索 Logcat**
也可以对 Logcat 日志（包含关于发生 ANR 时，是什么在占用 CPU 的更多信息）中的 `ANR in` 执行 grep 命令

```shell
$ grep "ANR in" bugreport.txt
10-01 18:13:11.984  4600  4614 E ActivityManager: ANR in com.google.android.***
10-01 18:14:31.720  4600  4614 E ActivityManager: ANR in com.google.android.apps.plus
10-01 18:14:31.720  4600  4614 E ActivityManager: PID: 30363
10-01 18:14:31.720  4600  4614 E ActivityManager: Reason: executing service com.google.android.apps.plus/com.google.android.apps.photos.service.PhotosService
10-01 18:14:31.720  4600  4614 E ActivityManager: Load: 35.27 / 23.9 / 16.18
10-01 18:14:31.720  4600  4614 E ActivityManager: CPU usage from 16ms to 21868ms later:
10-01 18:14:31.720  4600  4614 E ActivityManager:  74% 3361/mm-qcamera-daemon: 62% user + 12% kernel / faults: 15276 minor 10 major
10-01 18:14:31.720  4600  4614 E ActivityManager:  41% 4600/system_server: 18% user + 23% kernel / faults: 18597 minor 309 major
10-01 18:14:31.720  4600  4614 E ActivityManager:  32% 27420/com.google.android.GoogleCamera: 24% user + 7.8% kernel / faults: 48374 minor 338 major
10-01 18:14:31.720  4600  4614 E ActivityManager:  16% 130/kswapd0: 0% user + 16% kernel
10-01 18:14:31.720  4600  4614 E ActivityManager:  15% 283/mmcqd/0: 0% user + 15% kernel ... 10-01 18:14:31.720  4600  4614 E ActivityManager:  0.1% 27248/irq/503-synapti: 0% 10-01 18:14:31.721  4600  4614 I ActivityManager: Killing 30363:com.google.android.apps.plus/u0a206 (adj 0): bg anr 


grep "ANR in" bugreport-2015-10-01-18-13-48.txt
10-01 18:13:11.984  4600  4614 E ActivityManager: ANR in com.google.android.youtube
10-01 18:14:31.720  4600  4614 E ActivityManager: ANR in com.google.android.apps.plus
10-01 18:14:31.720  4600  4614 E ActivityManager: PID: 30363
10-01 18:14:31.720  4600  4614 E ActivityManager: Reason: executing service com.google.android.apps.plus/com.google.android.apps.photos.service.PhotosService
10-01 18:14:31.720  4600  4614 E ActivityManager: Load: 35.27 / 23.9 / 16.18
10-01 18:14:31.720  4600  4614 E ActivityManager: CPU usage from 16ms to 21868ms later:
10-01 18:14:31.720  4600  4614 E ActivityManager:   74% 3361/mm-qcamera-daemon: 62% user + 12% kernel / faults: 15276 minor 10 major
10-01 18:14:31.720  4600  4614 E ActivityManager:   41% 4600/system_server: 18% user + 23% kernel / faults: 18597 minor 309 major
10-01 18:14:31.720  4600  4614 E ActivityManager:   32% 27420/com.google.android.GoogleCamera: 24% user + 7.8% kernel / faults: 48374 minor 338 major
10-01 18:14:31.720  4600  4614 E ActivityManager:   16% 130/kswapd0: 0% user + 16% kernel
10-01 18:14:31.720  4600  4614 E ActivityManager:   15% 283/mmcqd/0: 0% user + 15% kernel
…
10-01 18:14:31.720  4600  4614 E ActivityManager:   0.1% 27248/irq/503-synapti: 0%
10-01 18:14:31.721  4600  4614 I ActivityManager: Killing 30363:com.google.android.apps.plus/u0a206 (adj 0): bg anr
```

#### 查找 ANR 堆栈轨迹

通常可以找到与 ANR 对应的堆栈轨迹。首先确保 VM traces 的 timeStamp 和 PID 与您正在调查的 ANR 相符，然后再检查进程的主线程。注意：

1. 主线程只能了解发生 ANR 时，它在做什么，这可能是导致 ANR 的真正原因，也可能不是。（BugReport 中的堆栈可能是无辜的，可能有其它线程在恢复正常之前，粘滞了很长时间，但不足以导致 ANR。）
2. 可能存在多组堆栈轨迹（`VM TRACES JUST NOW` 和 `VM TRACES AT LAST ANR`），要确保查看的是正确的部分。
	- 查找 ANR 堆栈信息，可能存在多组堆栈轨迹（**VM TRACES JUST NOW** 和 **VM TRACES AT LAST ANR**），确保你找的 时间戳 和 PID 是正确的
**示例**
- 示例 1

```shell
------ VM TRACES AT LAST ANR (/data/anr/traces.txt: 2015-10-01 18:14:41) ------

----- pid 30363 at 2015-10-01 18:14:11 -----
Cmd line: com.google.android.apps.plus
Build fingerprint: 'google/angler/angler:6.0/MDA89D/2294819:userdebug/dev-keys'
ABI: 'arm'
Build type: optimized
Zygote loaded classes=3978 post zygote classes=27
Intern table: 45068 strong; 21 weak
JNI: CheckJNI is off; globals=283 (plus 360 weak)
Libraries: /system/lib/libandroid.so /system/lib/libcompiler_rt.so /system/lib/libjavacrypto.so /system/lib/libjnigraphics.so /system/lib/libmedia_jni.so /system/lib/libwebviewchromium_loader.so libjavacore.so (7)
Heap: 29% free, 21MB/30MB; 32251 objects
Dumping cumulative Gc timings
Total number of allocations 32251
Total bytes allocated 21MB
Total bytes freed 0B
Free memory 9MB
Free memory until GC 9MB
Free memory until OOME 490MB
Total memory 30MB
Max memory 512MB
Zygote space size 1260KB
Total mutator paused time: 0
Total time waiting for GC to complete: 0
Total GC count: 0
Total GC time: 0
Total blocking GC count: 0
Total blocking GC time: 0

suspend all histogram:  Sum: 119.728ms 99% C.I. 0.010ms-107.765ms Avg: 5.442ms Max: 119.562ms
DALVIK THREADS (12):
"Signal Catcher" daemon prio=5 tid=2 Runnable
  | group="system" sCount=0 dsCount=0 obj=0x12c400a0 self=0xef460000
  | sysTid=30368 nice=0 cgrp=default sched=0/0 handle=0xf4a69930
  | state=R schedstat=( 9021773 5500523 26 ) utm=0 stm=0 core=1 HZ=100
  | stack=0xf496d000-0xf496f000 stackSize=1014KB
  | held mutexes= "mutator lock"(shared held)
  native: #00 pc 0035a217  /system/lib/libart.so (art::DumpNativeStack(std::__1::basic_ostream<char, std::__1::char_traits<char> >&, int, char const*, art::ArtMethod*, void*)+126)
  native: #01 pc 0033b03b  /system/lib/libart.so (art::Thread::Dump(std::__1::basic_ostream<char, std::__1::char_traits<char> >&) const+138)
  native: #02 pc 00344701  /system/lib/libart.so (art::DumpCheckpoint::Run(art::Thread*)+424)
  native: #03 pc 00345265  /system/lib/libart.so (art::ThreadList::RunCheckpoint(art::Closure*)+200)
  native: #04 pc 00345769  /system/lib/libart.so (art::ThreadList::Dump(std::__1::basic_ostream<char, std::__1::char_traits<char> >&)+124)
  native: #05 pc 00345e51  /system/lib/libart.so (art::ThreadList::DumpForSigQuit(std::__1::basic_ostream<char, std::__1::char_traits<char> >&)+312)
  native: #06 pc 0031f829  /system/lib/libart.so (art::Runtime::DumpForSigQuit(std::__1::basic_ostream<char, std::__1::char_traits<char> >&)+68)
  native: #07 pc 00326831  /system/lib/libart.so (art::SignalCatcher::HandleSigQuit()+896)
  native: #08 pc 003270a1  /system/lib/libart.so (art::SignalCatcher::Run(void*)+324)
  native: #09 pc 0003f813  /system/lib/libc.so (__pthread_start(void*)+30)
  native: #10 pc 00019f75  /system/lib/libc.so (__start_thread+6)
  (no managed stack frames)

"main" prio=5 tid=1 Suspended
  | group="main" sCount=1 dsCount=0 obj=0x747552a0 self=0xf5376500
  | sysTid=30363 nice=0 cgrp=default sched=0/0 handle=0xf74feb34
  | state=S schedstat=( 331107086 164153349 851 ) utm=6 stm=27 core=3 HZ=100
  | stack=0xff00f000-0xff011000 stackSize=8MB
  | held mutexes=
  kernel: __switch_to+0x7c/0x88
  kernel: futex_wait_queue_me+0xd4/0x130
  kernel: futex_wait+0xf0/0x1f4
  kernel: do_futex+0xcc/0x8f4
  kernel: compat_SyS_futex+0xd0/0x14c
  kernel: cpu_switch_to+0x48/0x4c
  native: #00 pc 000175e8  /system/lib/libc.so (syscall+28)
  native: #01 pc 000f5ced  /system/lib/libart.so (art::ConditionVariable::Wait(art::Thread*)+80)
  native: #02 pc 00335353  /system/lib/libart.so (art::Thread::FullSuspendCheck()+838)
  native: #03 pc 0011d3a7  /system/lib/libart.so (art::ClassLinker::LoadClassMembers(art::Thread*, art::DexFile const&, unsigned char const*, art::Handle<art::mirror::Class>, art::OatFile::OatClass const*)+746)
  native: #04 pc 0011d81d  /system/lib/libart.so (art::ClassLinker::LoadClass(art::Thread*, art::DexFile const&, art::DexFile::ClassDef const&, art::Handle<art::mirror::Class>)+88)
  native: #05 pc 00132059  /system/lib/libart.so (art::ClassLinker::DefineClass(art::Thread*, char const*, unsigned int, art::Handle<art::mirror::ClassLoader>, art::DexFile const&, art::DexFile::ClassDef const&)+320)
  native: #06 pc 001326c1  /system/lib/libart.so (art::ClassLinker::FindClassInPathClassLoader(art::ScopedObjectAccessAlreadyRunnable&, art::Thread*, char const*, unsigned int, art::Handle<art::mirror::ClassLoader>, art::mirror::Class**)+688)
  native: #07 pc 002cb1a1  /system/lib/libart.so (art::VMClassLoader_findLoadedClass(_JNIEnv*, _jclass*, _jobject*, _jstring*)+264)
  native: #08 pc 002847fd  /data/dalvik-cache/arm/system@framework@boot.oat (Java_java_lang_VMClassLoader_findLoadedClass__Ljava_lang_ClassLoader_2Ljava_lang_String_2+112)
  at java.lang.VMClassLoader.findLoadedClass!(Native method)
  at java.lang.ClassLoader.findLoadedClass(ClassLoader.java:362)
  at java.lang.ClassLoader.loadClass(ClassLoader.java:499)
  at java.lang.ClassLoader.loadClass(ClassLoader.java:469)
  at android.app.ActivityThread.installProvider(ActivityThread.java:5141)
  at android.app.ActivityThread.installContentProviders(ActivityThread.java:4748)
  at android.app.ActivityThread.handleBindApplication(ActivityThread.java:4688)
  at android.app.ActivityThread.-wrap1(ActivityThread.java:-1)
  at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1405)
  at android.os.Handler.dispatchMessage(Handler.java:102)
  at android.os.Looper.loop(Looper.java:148)
  at android.app.ActivityThread.main(ActivityThread.java:5417)
  at java.lang.reflect.Method.invoke!(Native method)
  at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:726)
  at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:616)

  ...
  Stacks for other threads in this process follow
  ...
```

- 示例 2

```shell
------ VM TRACES AT LAST ANR (/data/anr/anr_8582_2025-05-19-18-04-39-741: 2025-05-19 18:04:52) ------
Subject: executing service com.tencent.wework/com.tencent.luggage.wxa.standalone_open_runtime.app.WxaIPCMainService
RssHwmKb: 1062088
RssKb: 241424
RssAnonKb: 71780
RssShmemKb: 1652
VmSwapKb: 495392
```

#### 查找 deadlocks

由于线程出现粘滞，死锁往往首先表现为 ANR。如果 `system server` 进程发生死锁，`watchdog` 最终会将其终止，从而导致日志中出现类似以下的条目：` WATCHDOG KILLING SYSTEM PROCESS `。对于用户来说，他们看到的是设备重新启动，但从技术上来讲，这是运行时重启，而不是真正的设备重新启动。说明：

1. 在运行时重启时，`system server` 进程已死机并会重启，并且用户会看到设备返回到显示启动动画。
2. 在设备重新启动时，内核已崩溃，并且用户会看到设备返回到显示 Google 启动徽标。
要查找死锁，请检查 VM 跟踪部分中是否存在以下模式：线程 A 在等待线程 B 占用的某些资源，而线程 B 也在等待线程 A 占用的某些资源。

**示例：**

```shell
"Binder_B" prio=5 tid=73 Blocked
  | group="main" sCount=1 dsCount=0 obj=0x13faa0a0 self=0x95e24800
  | sysTid=2016 nice=0 cgrp=default sched=0/0 handle=0x8b68d930
  | state=S schedstat=( 9351576559 4141431119 16920 ) utm=819 stm=116 core=1 HZ=100
  | stack=0x8b591000-0x8b593000 stackSize=1014KB
  | held mutexes=
  at com.android.server.pm.UserManagerService.exists(UserManagerService.java:387)
  - waiting to lock <0x025f9b02> (a android.util.ArrayMap) held by thread 20
  at com.android.server.pm.PackageManagerService.getApplicationInfo(PackageManagerService.java:2848)
  at com.android.server.AppOpsService.getOpsRawLocked(AppOpsService.java:881)
  at com.android.server.AppOpsService.getOpsLocked(AppOpsService.java:856)
  at com.android.server.AppOpsService.noteOperationUnchecked(AppOpsService.java:719)
  - locked <0x0231885a> (a com.android.server.AppOpsService)
  at com.android.server.AppOpsService.noteOperation(AppOpsService.java:713)
  at com.android.server.AppOpsService$2.getMountMode(AppOpsService.java:260)
  at com.android.server.MountService$MountServiceInternalImpl.getExternalStorageMountMode(MountService.java:3416)
  at com.android.server.am.ActivityManagerService.startProcessLocked(ActivityManagerService.java:3228)
  at com.android.server.am.ActivityManagerService.startProcessLocked(ActivityManagerService.java:3170)
  at com.android.server.am.ActivityManagerService.startProcessLocked(ActivityManagerService.java:3059)
  at com.android.server.am.BroadcastQueue.processNextBroadcast(BroadcastQueue.java:1070)
  - locked <0x044d166f> (a com.android.server.am.ActivityManagerService)
  at com.android.server.am.ActivityManagerService.finishReceiver(ActivityManagerService.java:16950)
  at android.app.ActivityManagerNative.onTransact(ActivityManagerNative.java:494)
  at com.android.server.am.ActivityManagerService.onTransact(ActivityManagerService.java:2432)
  at android.os.Binder.execTransact(Binder.java:453)
...
  "PackageManager" prio=5 tid=20 Blocked
  | group="main" sCount=1 dsCount=0 obj=0x1304f4a0 self=0xa7f43900
  | sysTid=1300 nice=10 cgrp=bg_non_interactive sched=0/0 handle=0x9fcf9930
  | state=S schedstat=( 26190141996 13612154802 44357 ) utm=2410 stm=209 core=2 HZ=100
  | stack=0x9fbf7000-0x9fbf9000 stackSize=1038KB
  | held mutexes=
  at com.android.server.AppOpsService.noteOperationUnchecked(AppOpsService.java:718)
  - waiting to lock <0x0231885a> (a com.android.server.AppOpsService) held by thread 73
  at com.android.server.AppOpsService.noteOperation(AppOpsService.java:713)
  at com.android.server.AppOpsService$2.getMountMode(AppOpsService.java:260)
  at com.android.server.AppOpsService$2.hasExternalStorage(AppOpsService.java:273)
  at com.android.server.MountService$MountServiceInternalImpl.hasExternalStorage(MountService.java:3431)
  at com.android.server.MountService.getVolumeList(MountService.java:2609)
  at android.os.storage.StorageManager.getVolumeList(StorageManager.java:880)
  at android.os.Environment$UserEnvironment.getExternalDirs(Environment.java:83)
  at android.os.Environment.isExternalStorageEmulated(Environment.java:708)
  at com.android.server.pm.PackageManagerService.isExternalMediaAvailable(PackageManagerService.java:9327)
  at com.android.server.pm.PackageManagerService.startCleaningPackages(PackageManagerService.java:9367)
  - locked <0x025f9b02> (a android.util.ArrayMap)
  at com.android.server.pm.PackageManagerService$PackageHandler.doHandleMessage(PackageManagerService.java:1320)
  at com.android.server.pm.PackageManagerService$PackageHandler.handleMessage(PackageManagerService.java:1122)
  at android.os.Handler.dispatchMessage(Handler.java:102)
  at android.os.Looper.loop(Looper.java:148)
  at android.os.HandlerThread.run(HandlerThread.java:61)
  at com.android.server.ServiceThread.run(ServiceThread.java:46)
```

### Logcat 信息

Logcat 日志是以字符串形式 dump 了 `logcat` 信息，包括：`System Log`、`Event Log` 等。

**bugreport 抓取的 Logcat 日志：**
- `adb bugreport` 会抓取当前 Logcat 缓冲区中的**全部内容**（通常包含最近几小时到几天的日志，具体时长取决于设备日志缓冲区大小和日志生成速度）。
- 如果设备未重启，缓冲区中的日志可能包含历史记录（但无法精确指定日期）。

#### `SYSTEM LOG`

System Log 部分专门用于记录 `framework` 方面的信息。`system` 部分与包含所有其他内容的 `main` 部分相比，该部分包含更长时间内的记录。

每行都以 `timestamp PID TID log-level` 开头。`UID` 在某些旧版本系统没有。

但是由于也包含了其他进程的 log，也可以用来分析和其他进程交互的问题。

**格式：**

```shell
------ SYSTEM LOG (logcat -v threadtime -d *:v) ------
--------- beginning of crash
Blah
Blah
Blah

--------- beginning of system
Blah
Blah
Blah

--------- beginning of main
Blah 
Blah
Blah
```

**示例：**
- 这是 `bugreport` 中直接嵌入的 Logcat 输出，通过命令 `logcat -v threadtime -v printable -v uid -d *:v` 生成。
- **`-d`** 表示 " 抓取当前缓冲区日志并退出 "，因此**无法指定日期**，只能获取当前缓冲区的内容。

```shell
------ SYSTEM LOG (logcat -v threadtime -v printable -v uid -d *:v) ------
--------- beginning of crash
05-20 07:44:12.591 shell  1390  1390 I emdlogger: mtk-brm-commit-id:b3d8d0037ffa5647ff5e13b2c4f7c28d3a1fcf71
05-20 07:44:12.591 shell  1390  1390 I emdlogger: mtk-brm-change-id:I9f045b708d1992a9eff393d17f4480e88ca2134c
05-20 07:44:12.591 shell  1390  1390 I emdlogger: mtk-brm-merge-id:none
05-20 07:44:12.616  1000  1353  1353 I libimsma_adapt: mtk-brm-commit-id:d4e88d88b95533b943d742e7efb2a4468aba0243
05-20 07:44:12.616  1000  1353  1353 I libimsma_adapt: mtk-brm-change-id:I34adf21759581903d15506bc02a9581bf7cd16f2
05-20 07:44:12.616  1000  1353  1353 I libimsma_adapt: mtk-brm-merge-id:none
05-20 08:02:10.572 10127 23031 23285 E AndroidRuntime: FATAL EXCEPTION: OkHttp Dispatcher
05-20 08:02:10.572 10127 23031 23285 E AndroidRuntime: Process: com.oplus.aiunit, PID: 23031
# ......
--------- beginning of system
05-21 23:45:29.886  1000  1885  2115 D VRR [OPlusExternalRefreshRateManager]: setFrontPackageName pkgName: null CurPkgName: com.android.launcher
05-21 23:45:29.886  1000  1885  2115 D VRR [OPlusGameStatusManager]: setFrontPackageName pkgName: null CurPkgName: com.android.launcher
05-21 23:45:29.886  1000  1885  2115 D VRR [OPlusGameStatusManager]: setGameStop: CurPkgNamenull GameController: null
05-21 23:45:29.886  1000  1885  2115 D VRR [OPlusSurfaceFlingerController]:  setTouchIdle : TouchIdleBean{mEnable=false, mHwEnable=false, mSwEnable=true, mAdfrEnable=false, mAmbientEnable=false, mTimeOut=3500, mContentThreshold=-1, mContentGapMs=500, mBrightnessLimit=-1, mNitLimit=110, mPwmBrightnessLimit=-1, mPwmNitLimit=110, mBrightnessLimitMax=2147483647, mNitLimiMax=2147483647, mExitHbmNitThreshold=2147483647, mLowestRate=60, mSpecialFps=-1, mBlackList=[], mReadingWhiteList=[], mSpecialTimeOutMap={}, mSpecialContentGap={}, mSwWhiteMap={}, mSwNegligibleOverlay=[], mHwDisablePanel=[], mDefectPanel=[], mAdfrToHwList=[], mAdfrFoldToHW=-1, mLockRateNitThresholds=[]}
05-21 23:45:29.886  1000  1885  2971 I WindowManager: Window{685024 u0 NotificationShade} state from DRAW_PENDING to COMMIT_DRAW_PENDING; reason: finishDrawingLocked
05-21 23:45:29.887  1000  1885  2794 D OplusWindowAnimationManager: clearOplusLaunchViewInfoForWindow: win=Window{51f8db8 u0 com.coloros.assistantscreen}
05-21 23:45:29.887  1000  1885  2334 D WindowManager: request show transient bar, provider = com.android.server.wm.InsetsSourceProvider@f732b37 controlTarget = Window{685024 u0 NotificationShade}
05-21 23:45:29.893  1000  1885  2066 D OplusFullScreenDisplayManager: adjustInsetsStateForWin: com.tencent.mm, starting window should layout in cutout : always
05-21 23:45:29.894  1000  1885  2066 I WindowManager: Window{685024 u0 NotificationShade} state from COMMIT_DRAW_PENDING to READY_TO_SHOW; reason: commitFinishDrawingLocked
05-21 23:45:29.894  1000  1885  2066 I WindowManager: Window{685024 u0 NotificationShade} state from READY_TO_SHOW to HAS_DRAWN; reason: performShowLocked
05-21 23:45:29.894 10182  2611  2697 D WindowManagerShell: UNKNOWN MESSAGE (826113962) ComponentInfo{com.tencent.mm/com.tencent.mm.ui.LauncherUI}
05-21 23:45:29.906  1000  1885  3525 D OplusAppSwitchListener: Detect com.tencent.mm switch to foreground
05-21 23:45:29.906  1000  1885  3525 D OplusFeatureReduceBrightness: onAppEnter , info = com.tencent.mm
05-21 23:45:29.906  1000  1885  3525 D OplusEapManager: mTargetEnterName :com.tencent.mm
05-21 23:45:29.906  1000  1885  5535 D VRR [OPlusRefreshRateService]:  setFrameRateTargetControl [ 0.0 , com.android.launcher , false , com.oplus.battery ]
05-21 23:45:29.906  1000  1885  5535 D VRR [OPlusExternalRefreshRateManager]:  [FRTC] FrameRate : 0 com.android.launcher false com.oplus.battery 0 1000
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusSurfaceFlingerController]:  add frtc FrameRate : 0 com.android.launcher false com.oplus.battery
05-21 23:45:29.907  1000  1885  3525 D VRR [OPlusFrontAppManager]: OnAppSwitchObserver: onAppEnter , info.targetName = com.tencent.mm
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusRefreshRateService]: handleFrontAppChange pkgName: com.tencent.mm
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusExternalRefreshRateManager]: setFrontPackageName pkgName: com.tencent.mm CurPkgName: null
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusGameStatusManager]: setFrontPackageName pkgName: com.tencent.mm CurPkgName: null
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusGameStatusManager]: setGameStop: CurPkgNamecom.tencent.mm GameController: null
05-21 23:45:29.907  1000  1885  2115 D VRR [OPlusSAManager]: updateAutoMinfps with nits: 4.982587, mHistOK true, mAmbientOK false, mCctOK true, mIrOK false, mBrightnessOK true, isPkgOK true, SA min fps: 1
05-21 23:45:29.909  1000  1885  3311 D CompatibilityChangeReporter: Compat change id reported: 135634846; UID 10207; state: DISABLED
# ......
--------- beginning of main
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Focus inVisible Reason:isVisibleForInput(){hasInputInfo()?canReceiveInput():isVisible()}=0 has=1 can{!isHiddenByPolicy()&&(mBuffer==nullptr||getAlpha()>0.0f)}=0 Hidden=1 Buf=1 getA=1
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Find Focus windowName=<null>, notVisible=1
05-21 23:46:58.193  1000  1190  1190 D Layer   : Focus: Task=24440#37918 isHiddenByPolicy s.flags&layer_state_t::eLayerHidden=1
05-21 23:46:58.193  1000  1190  1190 D Layer   : Focus: isHiddenByPolicy parent Task=24440#37918 is hidden cause not visible
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Focus inVisible Reason:isVisibleForInput(){hasInputInfo()?canReceiveInput():isVisible()}=0 has=1 can{!isHiddenByPolicy()&&(mBuffer==nullptr||getAlpha()>0.0f)}=0 Hidden=1 Buf=1 getA=1
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Find Focus windowName=<null>, notVisible=1
05-21 23:46:58.193  1000  1190  1190 D Layer   : Focus: Task=24440#37918 isHiddenByPolicy s.flags&layer_state_t::eLayerHidden=1
05-21 23:46:58.193  1000  1190  1190 D Layer   : Focus: isHiddenByPolicy parent Task=24440#37918 is hidden cause not visible
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Focus inVisible Reason:isVisibleForInput(){hasInputInfo()?canReceiveInput():isVisible()}=0 has=1 can{!isHiddenByPolicy()&&(mBuffer==nullptr||getAlpha()>0.0f)}=0 Hidden=1 Buf=1 getA=1
05-21 23:46:58.193  1000  1190  1190 D SurfaceFlinger: Find Focus windowName=<null>, notVisible=1
# ......
------ 0.100s was the duration of 'SYSTEM LOG' ------

------ SYSTEM LOG (logcat -v threadtime -v printable -v uid -d *:v -T 2025-05-21 23:47:29.000) ------
--------- beginning of system
05-21 23:47:29.006  1000  1885  3310 D CompatibilityChangeReporter: Compat change id reported: 168419799; UID 10911; state: DISABLED
05-21 23:47:29.006  1000  1885  3310 D CompatibilityChangeReporter: Compat change id reported: 273564678; UID 10911; state: DISABLED
# ......
--------- beginning of main
05-21 23:51:43.019 10841 20179 20179 I ActivityThread: Relaunch all activities: onCoreSettingsChange
05-21 23:51:43.020 10841 20179 20179 D CompatibilityChangeReporter: Compat change id reported: 171979766; UID 10841; state: ENABLED
05-21 23:51:43.023 10178  2968  2968 D TracePrintUtil: isWindowAnimating 1 = true
05-21 23:51:43.040 10178  2968  2968 D TracePrintUtil: isWindowAnimating 1 = true
# ......
```

#### `EVENT LOG`

Event Log 中包含将二进制格式转换成了字符串形式的日志消息。它比 Logcat 日志要清晰明了，但也有些难以阅读。在查看 Event Log 时，可以在这一部分中搜索特定进程 ID (PID)，以查看相应进程一直在做什么。基本格式是：`timestamp PID TID log-level log-tag tag-values`。

注意：日志级别包括以下几种：  
<1> `V`：详细  
<2> `D`：调试  
<3> `I`：信息  
<4> `W`：警告  
<5> `E`：错误

**示例：**

```shell
------ EVENT LOG (logcat -b events -v threadtime -v printable -v uid -d *:v) ------
--------- beginning of events
05-21 22:32:04.952  1000  1885  2065 I wm_resume_activity: [0,15352134,5,com.android.launcher/.Launcher]
05-21 22:32:04.966  1000  1885  2066 I input_focus: [Focus request 14d1613 com.android.launcher/com.android.launcher.Launcher,reason=UpdateInputWindows]
05-21 22:32:04.969 10178  2968  2968 I wm_on_resume_called: [15352134,com.android.launcher.Launcher,RESUME_ACTIVITY,0]
05-21 22:32:04.970 10178  2968  2968 I wm_on_top_resumed_gained_called: [15352134,com.android.launcher.Launcher,topStateChangedWhenResumed]
05-21 22:32:04.981 10120 30095  4855 I jank_cuj_events_end_request: [69,1747837924981543000,139686036237556,100928553717861]
05-21 22:32:04.984  1000  1885  2066 I input_focus: [Focus request recents_animation_input_consumer,reason=UpdateInputWindows]
05-21 22:32:04.992  1000  1885  2341 I input_focus: [Focus leaving f913ff7 com.heytap.quicksearchbox/com.heytap.quicksearchbox.ui.activity.SearchHomeActivity (server),reason=setFocusedWindow]
05-21 22:32:04.992  1000  1885  2341 I input_focus: [Focus entering 14d1613 com.android.launcher/com.android.launcher.Launcher (server),reason=setFocusedWindow]
05-21 22:32:04.998  1000  1885  3475 I am_kill : [0,2497,com.mediatek.gnssdebugreport,999,CachedClean[(cch-empty)]]
05-21 22:32:04.998  1000  1885  3475 I am_kill : [0,30157,com.heytap.mydevices,925,CachedClean[(cch-empty)]]
05-21 22:32:04.999  1000  1885  3475 I am_kill : [0,5792,com.coloros.shortcuts,995,CachedClean[(cch-empty)]]
05-21 22:32:04.999  1000  1885  3475 I am_kill : [0,6183,com.android.printspooler,995,CachedClean[(cch-empty)]]
05-21 22:32:04.999  1000  1885  3475 I am_kill : [0,5948,com.oplus.dmp:main,915,CachedClean[(cch-empty)]]
05-21 22:32:05.024  1000  1885  2972 I wm_set_resumed_activity: [0,com.android.launcher/.Launcher,setFocusedTask-alreadyTop]
# ...
------ 0.066s was the duration of 'EVENT LOG' ------
```

**更多 event log tags 参考：**  [/services/core/java/com/android/server/EventLogTags.logtags](https://android.googlesource.com/platform/frameworks/base/+/main/services/core/java/com/android/server/EventLogTags.logtags).

```java
# See system/logging/logcat/event.logtags for a description of the format of this file.
option java_package com.android.server
# ---------------------------
# BatteryService.java
# ---------------------------
2722 battery_level (level|1|6),(voltage|1|1),(temperature|1|1)
2723 battery_status (status|1|5),(health|1|5),(present|1|5),(plugged|1|5),(technology|3)
# This is logged when battery goes from discharging to charging.
# It lets us count the total amount of time between charges and the discharge level
2730 battery_discharge (duration|2|3),(minLevel|1|6),(maxLevel|1|6)
# ---------------------------
# PowerManagerService.java
# ---------------------------
# This is logged when the device is being forced to sleep (typically by
# the user pressing the power button).
2724 power_sleep_requested (wakeLocksCleared|1|1)
# This is logged when the screen on broadcast has completed
2725 power_screen_broadcast_send (wakelockCount|1|1)
# This is logged when the screen broadcast has completed

// ......
```

#### 监视器争用

监视器争用日志记录，有时可以表明实际的监视器争用情况，但通常情况下表明系统负载过重，从而导致所有进程都变慢了。可能会在 `System Log` 或 `Event Log` 中看到 ART（Android Runtime）记录的长时间占用监视器的事件。

- 在 System Log 中：

```shell
10-01 18:12:44.343 29761 29914 W art : Long monitor contention event with owner method=void android.database.sqlite.SQLiteClosable.acquireReference() from SQLiteClosable.java:52 waiters=0 for 3.914s 
```

- 在 Event Log 中：

```shell
10-01 18:12:44.364 29761 29914 I dvm_lock_sample : [com.google.android.***,0,pool-3-thread-9,3914,ScheduledTaskMaster.java,138,SQLiteClosable.java,52,100] 
```

### Activities 信息

Activity 是一种应用组件，为用户提供一个可互动的屏幕，用来执行某些操作（如：拨号、拍照、发送电子邮件等）。从 BugReport 的角度来看，Activity 是用户可以执行的一项明确具体的操作，这使得查找在崩溃期间处于聚焦状态的 Activity 变得非常重要。Activity 通过 ActivityManager 运行进程，因此找出指定 Activity 的所有进程启动和停止事件也有助于进行问题排查。

#### View focused activities 查看历史聚焦的 activity

`am_focused_activity` 查看处于聚焦状态的 Activity 的历史记录：

```shell
$ grep "am_focused_activity" bugreport.txt
10-01 18:10:41.409  4600 14112 I am_focused_activity: [0,com.google.android.GoogleCamera/com.android.camera.CameraActivity] 10-01 18:11:17.313  4600  5687 I am_focused_activity: [0,com.google.android.googlequicksearchbox/com.google.android.launcher.GEL] 

grep "am_focused_activity" bugreport-2015-10-01-18-13-48.txt
10-01 18:10:41.409  4600 14112 I am_focused_activity: [0,com.google.android.GoogleCamera/com.android.camera.CameraActivity]
10-01 18:11:17.313  4600  5687 I am_focused_activity: [0,com.google.android.googlequicksearchbox/com.google.android.launcher.GEL]
10-01 18:11:52.747  4600 14113 I am_focused_activity: [0,com.google.android.GoogleCamera/com.android.camera.CameraActivity]
10-01 18:14:07.762  4600  5687 I am_focused_activity: [0,com.google.android.googlequicksearchbox/com.google.android.launcher.GEL]
```

#### View process starts 查看进程启动

`Start proc` 查看进程启动事件的历史记录

```shell
$ grep "Start proc" bugreport.txt
10-01 18:09:15.309  4600  4612 I ActivityManager: Start proc 24533:com.metago.astro/u0a240 for broadcast com.metago.astro/com.inmobi.commons.analytics.androidsdk.IMAdTrackerReceiver
10-01 18:09:15.687  4600 14112 I ActivityManager: Start proc 24548:com.google.android.apps.fitness/u0a173 for service com.google.android.apps.fitness/.api.services.ActivityUpsamplingService
10-01 18:09:15.777  4600  6604 I ActivityManager: Start proc 24563:cloudtv.hdwidgets/u0a145 for broadcast cloudtv.hdwidgets/cloudtv.switches.SwitchSystemUpdateReceiver
10-01 18:09:20.574  4600  6604 I ActivityManager: Start proc 24617:com.wageworks.ezreceipts/u0a111 for broadcast com.wageworks.ezreceipts/.ui.managers.IntentReceiver ... 

```

#### Determine if the device is thrashing

确定设备是否发生 [thrashing](https://en.wikipedia.org/wiki/Thrashing_\(computer_science\))，需检查在 `am_proc_died` 和 `am_proc_start` 前后的短时间内，是否出现 Activity 异常增多的情况。

**thrashing 定义**：Thrashing（抖动）是虚拟内存系统中由于物理内存严重不足，导致操作系统将绝大部分时间耗费在无益的页面置换操作上，而无法执行有效计算任务的严重性能故障状态

```shell
grep -e "am_proc_died" -e "am_proc_start" bugreport-2015-10-01-18-13-48.txt
10-01 18:07:06.494  4600  9696 I am_proc_died: [0,20074,com.android.musicfx]
10-01 18:07:06.555  4600  6606 I am_proc_died: [0,31166,com.concur.breeze]
10-01 18:07:06.566  4600 14112 I am_proc_died: [0,18812,com.google.android.apps.fitness]
10-01 18:07:07.018  4600  7513 I am_proc_start: [0,20361,10113,com.sony.playmemories.mobile,broadcast,com.sony.playmemories.mobile/.service.StartupReceiver]
10-01 18:07:07.357  4600  4614 I am_proc_start: [0,20381,10056,com.google.android.talk,service,com.google.android.talk/com.google.android.libraries.hangouts.video.CallService]
10-01 18:07:07.784  4600  4612 I am_proc_start: [0,20402,10190,com.andcreate.app.trafficmonitor:loopback_measure_serivce,service,com.andcreate.app.trafficmonitor/.loopback.LoopbackMeasureService]
10-01 18:07:10.753  4600  5997 I am_proc_start: [0,20450,10097,com.amazon.mShop.android.shopping,broadcast,com.amazon.mShop.android.shopping/com.amazon.identity.auth.device.storage.LambortishClock$ChangeTimestampsBroadcastReceiver]
10-01 18:07:15.267  4600  6605 I am_proc_start: [0,20539,10173,com.google.android.apps.fitness,service,com.google.android.apps.fitness/.api.services.ActivityUpsamplingService]
10-01 18:07:15.985  4600  4612 I am_proc_start: [0,20568,10022,com.android.musicfx,broadcast,com.android.musicfx/.ControlPanelReceiver]
10-01 18:07:16.315  4600  7512 I am_proc_died: [0,20096,com.google.android.GoogleCamera]
```

### MEMORY INFO 内存

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#memory>

由于 Android 设备的物理内存通常都存在限制，因此管理 RAM (random-access memory 随机存取存储器) 至关重要。BugReport 中包含一些用于指示 `low memory` 的指标以及一个提供内存快照的 `dumpstate`。

#### Get a memory snapshot 获取内存快照

内存快照是一种 `dumpstate`，其中会列出正在运行的 Java 进程和 native 进程（更详细，refer to [Viewing Overall Memory Allocations](https://developer.android.com/tools/debugging/debugging-memory.html#ViewingAllocations)）。

**注意**：snapshot 仅提供特定时刻的状态，在此快照之前，系统的状况可能更好，也可能更糟。

```shell
------ MEMORY INFO (/proc/meminfo) ------
MemTotal:       15804348 kB
MemFree:          240756 kB
MemAvailable:    2136468 kB
Buffers:            2748 kB
Cached:          2260608 kB
SwapCached:         9708 kB
Active:          2162596 kB
Inactive:        5084512 kB
Active(anon):    1467200 kB
Inactive(anon):  3830484 kB
Active(file):     695396 kB
Inactive(file):  1254028 kB
Unevictable:      251960 kB
Mlocked:          251960 kB
SwapTotal:      17825784 kB
SwapFree:        9108792 kB
Dirty:              1068 kB
Writeback:             0 kB
AnonPages:       5229188 kB
Mapped:          1380636 kB
Shmem:             79368 kB
KReclaimable:     368908 kB
Slab:            1113212 kB
SReclaimable:     368484 kB
SUnreclaim:       744728 kB
KernelStack:      190944 kB
ShadowCallStack:   48120 kB
PageTables:       278852 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:    25727956 kB
Committed_AS:   219363444 kB
VmallocTotal:   263061440 kB
VmallocUsed:      695928 kB
VmallocChunk:          0 kB
Percpu:            35104 kB
AnonHugePages:   2734976 kB
ShmemHugePages:        0 kB
ShmemPmdMapped:        0 kB
FileHugePages:         0 kB
FilePmdMapped:         0 kB
HugePagePool:     124480 kB
DoubleMapTHP:          0 kB
CmaTotal:        4182016 kB
CmaFree:               0 kB
IonTotalCache:       424 kB
IonTotalUsed:    1563216 kB
RsvPool:          191436 kB
GPUTotalUsed:    1162144 kB

------ 0.022s was the duration of 'MEMORY INFO' ------
```

- 理解一个进程运行了多久，见： [Process runtime](https://source.android.com/docs/core/tests/debug/read-bug-reports#process-runtime)
- 理解一个进程为什么运行了，见： [Why is a process running?](https://source.android.com/docs/core/tests/debug/read-bug-reports#why-is-process-running)

```shell
Total PSS by OOM adjustment:
    86752 kB: Native
               22645 kB: surfaceflinger (pid 197)
               18597 kB: mediaserver (pid 204)
               ...
   136959 kB: System
              136959 kB: system (pid 785)
   220218 kB: Persistent
              138859 kB: com.android.systemui (pid 947 / activities)
               39178 kB: com.android.nfc (pid 1636)
               28313 kB: com.android.phone (pid 1659)
               13868 kB: com.redbend.vdmc (pid 1646)
     9534 kB: Persistent Service
                9534 kB: com.android.bluetooth (pid 23807)
   178604 kB: Foreground
              168620 kB: com.google.android.googlequicksearchbox (pid 1675 / activities)
                9984 kB: com.google.android.apps.maps (pid 13952)
   188286 kB: Visible
               85326 kB: com.google.android.wearable.app (pid 1535)
               38978 kB: com.google.process.gapps (pid 1510)
               31936 kB: com.google.android.gms.persistent (pid 2072)
               27950 kB: com.google.android.gms.wearable (pid 1601)
                4096 kB: com.google.android.googlequicksearchbox:interactor (pid 1550)
    52948 kB: Perceptible
               52948 kB: com.google.android.inputmethod.latin (pid 1566)
   150851 kB: A Services
               81121 kB: com.google.android.gms (pid 1814)
               37586 kB: com.google.android.talk (pid 9584)
               10949 kB: com.google.android.music:main (pid 4019)
               10727 kB: com.motorola.targetnotif (pid 31071)
               10468 kB: com.google.android.GoogleCamera (pid 9984)
    33298 kB: Previous
               33298 kB: com.android.settings (pid 9673 / activities)
   165188 kB: B Services
               49490 kB: com.facebook.katana (pid 15035)
               22483 kB: com.whatsapp (pid 28694)
               21308 kB: com.iPass.OpenMobile (pid 5325)
               19788 kB: com.google.android.apps.googlevoice (pid 23934)
               17399 kB: com.google.android.googlequicksearchbox:search (pid 30359)
                9073 kB: com.google.android.apps.youtube.unplugged (pid 21194)
                7660 kB: com.iPass.OpenMobile:remote (pid 23754)
                7291 kB: com.pujie.wristwear.pujieblack (pid 24240)
                7157 kB: com.instagram.android:mqtt (pid 9530)
                3539 kB: com.qualcomm.qcrilmsgtunnel (pid 16186)
   204324 kB: Cached
               43424 kB: com.amazon.mShop.android (pid 13558)
               22563 kB: com.google.android.apps.magazines (pid 13844)
               ...
                4298 kB: com.google.android.apps.enterprise.dmagent (pid 13826)
```

##### MEMINFO in pid

这里列举了所有应用的 dumpsys meminfo 信息。

```shell
** MEMINFO in pid 12565 [me.hacket.demos] **
                   Pss      Pss   Shared  Private   Shared  Private  SwapPss      Rss     Heap     Heap     Heap
                 Total    Clean    Dirty    Dirty    Clean    Clean    Dirty    Total     Size    Alloc     Free
                ------   ------   ------   ------   ------   ------   ------   ------   ------   ------   ------
  Native Heap    29184        0     3556    29136        8        0       17    32700    39424    26234    13189
  Dalvik Heap     6917        0     7536     6852        0        0       10    14388    17061     4773    12288
 Dalvik Other     2669        0      596     2624       40        4        0     3264                           
        Stack     1132        0       12     1132        0        0        0     1144                           
       Ashmem       18        0      588        0        4        0        0      592                           
    Other dev       13        0      588        0      184       12        0      784                           
     .so mmap     4329      612     7304      512    43640      612        1    52068                           
    .jar mmap      872        0        0        0    43200        0        0    43200                           
    .apk mmap      176        0        0        0     2384        0        0     2384                           
    .ttf mmap      119       32        0        0      372       32        0      404                           
    .dex mmap     3795     3280       12      512      896     3280        0     4700                           
    .oat mmap       23        0       84        0     2788        0        0     2872                           
    .art mmap     7840        4    22108     7644      148        4        0    29904                           
   Other mmap       24        0       40        8     1040        4        0     1092                           
    GL mtrack    10464        0        0    10464        0        0        0    10464                           
      Unknown      945        0      940      928        0       16        0     1884                           
        TOTAL    68548     3928    43364    59812    94704     3964       28   201844    56485    31007    25477
```

#### 发现内存不足的情况

内存不足可能会导致系统发生 thrash 抖动，这是因为虽然内存不足时，系统会终止某些进程来释放内存，但又会继续启动其它进程。如需查看内存不足的确凿证据，请检查二进制事件日志中的 `am_proc_died` 和 `am_proc_start` 条目的密集程度。  
内存不足还可能会减慢任务切换速度，并且可能会阻止进行返回的尝试（因为用户尝试返回的任务已被终止）。如果 Launcher 被终止，它会在用户触摸主屏幕按钮时重启，并且日志中会显示启动器重新加载其内容。

- 查看历史指标
二进制事件日志中的 `am_low_memory` 条目，表示最后一个缓存的进程已终止。在此之后，系统开始终止各项服务。

```shell
$ grep "am_low_memory" bugreport.txt
10-01 18:11:02.219  4600  7513 I am_low_memory: 41
10-01 18:12:18.526  4600 14112 I am_low_memory: 39
10-01 18:12:18.874  4600  7514 I am_low_memory: 38
10-01 18:12:22.570  4600 14112 I am_low_memory: 40
10-01 18:12:34.811  4600 20319 I am_low_memory: 43
10-01 18:12:37.945  4600  6521 I am_low_memory: 43
10-01 18:12:47.804  4600 14110 I am_low_memory: 43 
```

- 查看抖动 thrashing 指标
关于系统抖动（paging 分页、direct reclaim 直接回收等）的其它指标，包括：`kswapd`、`kworker`、`mmcqd 消耗周期`。（ 注意：收集 BugReport 可能会影响抖动 thrashing 指标 ）  

```shell
------ CPU INFO (top -n 1 -d 1 -m 30 -t) ------

User 15%, System 54%, IOW 28%, IRQ 0%
User 82 + Nice 2 + Sys 287 + Idle 1 + IOW 152 + IRQ 0 + SIRQ 5 = 529

  PID   TID PR CPU% S     VSS     RSS PCY UID      Thread          Proc
15229 15229  0  19% R      0K      0K  fg root     kworker/0:2
29512 29517  1   7% D 1173524K 101188K  bg u0_a27   Signal Catcher  com.google.android.talk
24565 24570  3   6% D 2090920K 145168K  fg u0_a22   Signal Catcher  com.google.android.googlequicksearchbox:search
19525 19525  2   6% R   3476K   1644K  fg shell    top             top
24957 24962  2   5% R 1706928K 125716K  bg u0_a47   Signal Catcher  com.google.android.GoogleCamera
19519 19519  3   4% S      0K      0K  fg root     kworker/3:1
  120   120  0   3% S      0K      0K  fg root     mmcqd/1
18233 18233  1   3% S      0K      0K  fg root     kworker/1:1
25589 25594  1   2% D 1270476K  75776K  fg u0_a8    Signal Catcher  com.google.android.gms
19399 19399  2   1% S      0K      0K  fg root     kworker/2:2
 1963  1978  1   0% S 1819100K 125136K  fg system   android.fg      system_server
 1963  1981  3   0% S 1819100K 125136K  fg system   android.display system_server
```

ANR 日志可以提供类似的内存快照。

```shell
10-03 17:19:59.959  1963  1976 E ActivityManager: ANR in com.google.android.apps.magazines
10-03 17:19:59.959  1963  1976 E ActivityManager: PID: 18819
10-03 17:19:59.959  1963  1976 E ActivityManager: Reason: Broadcast of Intent { act=android.net.conn.CONNECTIVITY_CHANGE flg=0x4000010 cmp=com.google.android.apps.magazines/com.google.apps.dots.android.newsstand.appwidget.NewsWidgetProvider (has extras) }
10-03 17:19:59.959  1963  1976 E ActivityManager: Load: 19.19 / 14.76 / 12.03
10-03 17:19:59.959  1963  1976 E ActivityManager: CPU usage from 0ms to 11463ms later:
10-03 17:19:59.959  1963  1976 E ActivityManager:   54% 15229/kworker/0:2: 0% user + 54% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   38% 1963/system_server: 14% user + 23% kernel / faults: 17152 minor 1073 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   11% 120/mmcqd/1: 0% user + 11% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   10% 2737/com.android.systemui: 4.7% user + 5.6% kernel / faults: 7211 minor 149 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   0.2% 1451/debuggerd: 0% user + 0.2% kernel / faults: 15211 minor 147 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   8.7% 6162/com.twofortyfouram.locale: 4% user + 4.7% kernel / faults: 4924 minor 260 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   6.1% 24565/com.google.android.googlequicksearchbox:search: 2.4% user + 3.7% kernel / faults: 2902 minor 129 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   6% 55/kswapd0: 0% user + 6% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   4.9% 18819/com.google.android.apps.magazines: 1.5% user + 3.3% kernel / faults: 10129 minor 986 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   2.8% 18233/kworker/1:1: 0% user + 2.8% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   4.2% 3145/com.android.phone: 2% user + 2.2% kernel / faults: 3005 minor 43 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   4.2% 8084/com.android.chrome: 2% user + 2.1% kernel / faults: 4798 minor 380 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   3.4% 182/surfaceflinger: 1.1% user + 2.3% kernel / faults: 842 minor 13 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   3% 18236/kworker/1:2: 0% user + 3% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   2.9% 19231/com.android.systemui:screenshot: 0.8% user + 2.1% kernel / faults: 6119 minor 348 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   2.3% 15350/kworker/0:4: 0% user + 2.3% kernel
10-03 17:19:59.959  1963  1976 E ActivityManager:   2.2% 1454/mediaserver: 0% user + 2.2% kernel / faults: 479 minor 6 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   2% 16496/com.android.chrome:sandboxed_process10: 0.1% user + 1.8% kernel / faults: 3610 minor 234 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   1% 3119/com.android.nfc: 0.4% user + 0.5% kernel / faults: 1789 minor 17 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   1.7% 19337/com.jarettmillard.localeconnectiontype:background: 0.1% user + 1.5% kernel / faults: 7854 minor 439 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   0.7% 3066/com.google.android.inputmethod.latin: 0.3% user + 0.3% kernel / faults: 1336 minor 7 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   1% 25589/com.google.android.gms: 0.3% user + 0.6% kernel / faults: 2867 minor 237 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   0.9% 1460/sensors.qcom: 0.5% user + 0.4% kernel / faults: 262 minor 5 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   0.8% 3650/mpdecision: 0% user + 0.8% kernel / faults: 160 minor 1 major
10-03 17:19:59.959  1963  1976 E ActivityManager:   0.1% 3132/com.redbend.vdmc: 0% user + 0% kernel / faults: 1746 minor 5 major
```

### CPU INFO

```shell
------ CPU INFO (top -b -n 1 -H -s 6 -o pid,tid,user,pr,ni,%cpu,s,virt,res,pcy,cmd,name) ------
Threads: 11948 total,  24 running, 11921 sleeping,   0 stopped,   3 zombie
  Mem:    15433M total,    15089M used,      344M free,        2M buffers
 Swap:    17407M total,     8449M used,     8958M free,     2156M cached
800%cpu 309%user  32%nice 312%sys 109%idle   4%iow  21%irq  14%sirq   0%host
  PID   TID USER         PR  NI[%CPU]S VIRT  RES PCY CMD             NAME
14836 14836 shell         0 -20 70.6 R 2.0G  14M  fg top             top
32086   578 u0_a645      20   0 69.5 R 8.2G 222M  bg Thread_4        com.tencent.mobileqq:MSF
31867 15012 u0_a660      12  -8 66.3 S  67G 534M  bg cluster-0-defau com.eg.android.AlipayGphone
# ...
14384 14412 u0_a660      24   4 -31.-5 S 32G 255M bg HeapTaskDaemon  com.eg.android.AlipayGphone:sandboxed_privilege_process0
14384 14679 u0_a660      20   0 -44.-5 R 32G 255M bg CrRendererMain  com.eg.android.AlipayGphone:sandboxed_privilege_process0
------ 2.049s was the duration of 'CPU INFO' ------
```

为 linux 常用的 `top` 命令输出的结果。显示系统中各个进程的资源占用状况。

### Broadcasts 广播

应用会生成广播，以便在当前应用内或向其它应用发送事件。广播接收器可以（通过过滤器）订阅特定消息，以便收听和响应广播。BugReport 中包含已发送广播和未发送广播的相关信息，以及关于收听特定广播的所有接收器的 dumpsys。

#### View historical broadcasts 查看历史广播

历史广播（即：已发送的广播），按时间逆序排列。

- `Historical broadcasts summary` summary 摘要部分，用于提供最近 300 个前台广播和最近 300 个后台广播的概况。

```shell
 Historical broadcasts summary [foreground]:
 #0: act=android.intent.action.SCREEN_ON flg=0x50000010
    +1ms dispatch +90ms finish
    enq=2015-10-29 17:10:51 disp=2015-10-29 17:10:51 fin=2015-10-29 17:10:51
  #1: act=android.intent.action.SCREEN_OFF flg=0x50000010
    0 dispatch +60ms finish
    enq=2015-10-29 17:10:05 disp=2015-10-29 17:10:05 fin=2015-10-29 17:10:05
 ...
 Historical broadcasts summary [background]:
 ...
```

- `detail` 详情部分，包含最近 50 条前台广播和最近 50 条后台广播的完整信息，以及每个广播的接收方。其中：  
	- 具有 `BroadcastFilter` 条目的接收器是在运行时注册的，并且只会被发送到已在运行的进程。  
	- 具有 `ResolveInfo` 条目的接收器是通过清单条目注册的。ActivityManager 会为每个 ResolveInfo 启动相应进程（如果相应进程尚未在运行）。

```shell
Historical broadcasts [foreground]:
 ...
 Historical broadcasts [background]:
 Historical Broadcast background #0:
 ...
 Historical Broadcast background #5:
    BroadcastRecord{18dbb16 u0 android.intent.action.USER_PRESENT} to user 0
    Intent { act=android.intent.action.USER_PRESENT flg=0x24000010 }
    caller=com.android.systemui 2925:com.android.systemui/u0a27 pid=2925 uid=10027
    enqueueClockTime=2015-10-29 17:10:55 dispatchClockTime=2015-10-29 17:10:55
    dispatchTime=-2s321ms (0 since enq) finishTime=-2s320ms (+1ms since disp)
    Receiver #0: BroadcastFilter{8181cc1 u-1 ReceiverList{5d929a8 902 system/1000/u-1 local:eca4dcb}}
    Receiver #1: BroadcastFilter{6371c97 u-1 ReceiverList{2938b16 902 system/1000/u-1 local:840b831}}
    ...
    Receiver #19: BroadcastFilter{93f16b u0 ReceiverList{5c61eba 17016 com.google.android.gm/10079/u0 remote:24083e5}}
 ...
 Historical Broadcast background #37:
    BroadcastRecord{7f6dd6 u0 android.hardware.action.NEW_PICTURE} to user 0
    Intent { act=android.hardware.action.NEW_PICTURE dat=content://media/external/images/media/6345 flg=0x10 }
    caller=com.google.android.GoogleCamera 32734:com.google.android.GoogleCamera/u0a53 pid=32734 uid=10053
    enqueueClockTime=2015-10-29 17:09:48 dispatchClockTime=2015-10-29 17:09:49
    dispatchTime=-45s720ms (+399ms since enq) finishTime=-45s701ms (+19ms since disp)
    resultTo=null resultCode=0 resultData=null
    nextReceiver=4 receiver=null
    Receiver #0: ResolveInfo{33d2857 com.google.android.gms/com.google.android.libraries.social.mediamonitor.MediaMonitor m=0x608000}
      priority=0 preferredOrder=0 match=0x608000 specificIndex=-1 isDefault=false
      ActivityInfo:
        name=com.google.android.libraries.social.mediamonitor.MediaMonitor
        packageName=com.google.android.gms
        enabled=true exported=true processName=com.google.android.gms
        ...
    Receiver #1: ResolveInfo{d9edf44 com.google.android.apps.maps/com.google.android.apps.gmm.ugc.clientnotification.StartPhotoTakenNotifierServiceReceiver m=0x608000}
      priority=0 preferredOrder=0 match=0x608000 specificIndex=-1 isDefault=false
      ActivityInfo:
        name=com.google.android.apps.gmm.ugc.clientnotification.StartPhotoTakenNotifierServiceReceiver
        packageName=com.google.android.apps.maps
        enabled=true exported=true processName=com.google.android.apps.maps
        ...
    Receiver #2: ResolveInfo{743f82d com.google.android.apps.photos/com.google.android.libraries.social.mediamonitor.MediaMonitor m=0x608000}
      priority=0 preferredOrder=0 match=0x608000 specificIndex=-1 isDefault=false
      ActivityInfo:
        name=com.google.android.libraries.social.mediamonitor.MediaMonitor
        packageName=com.google.android.apps.photos
        enabled=true exported=true processName=com.google.android.apps.photos
        ...
    Receiver #3: ResolveInfo{d5c9162 com.google.android.apps.plus/com.google.android.libraries.social.mediamonitor.MediaMonitor m=0x608000}
      priority=0 preferredOrder=0 match=0x608000 specificIndex=-1 isDefault=false
      ActivityInfo:
        name=com.google.android.libraries.social.mediamonitor.MediaMonitor
        packageName=com.google.android.apps.plus
        enabled=true exported=true processName=com.google.android.apps.plus
        ...
```

#### View active broadcasts 查看待发送的广播

待发送的广播（即：尚未发送的广播），如果队列中存在大量广播，则意味着系统无法足够快地发送广播来跟上进度。

```shell
Active ordered broadcasts [background]:
Active Ordered Broadcast background #133: // size of queue
...
```

#### View broadcast listeners 查看广播监听器

如需查看监听广播的接收器列表，请查看 `dumpsys activity broadcasts` 中的 `Receiver Resolver Table`。以下示例显示了监听 `USER_PRESENT` 的所有接收器。

```shell
-------------------------------------------------------------------------------
ACTIVITY MANAGER BROADCAST STATE (dumpsys activity broadcasts)
..
  Receiver Resolver Table:
    Full MIME Types:
    ..
    Wild MIME Types:
    ..
    Schemes:
    ..
    Non-Data Actions:
    ..
        android.intent.action.USER_PRESENT:
          BroadcastFilter{8181cc1 u-1 ReceiverList{5d929a8 902 system/1000/u-1 local:eca4dcb}}
          BroadcastFilter{6371c97 u-1 ReceiverList{2938b16 902 system/1000/u-1 local:840b831}}
          BroadcastFilter{320c00 u0 ReceiverList{d3a6283 902 system/1000/u0 local:799c532}}
          BroadcastFilter{e486048 u0 ReceiverList{36fbaeb 902 system/1000/u0 local:5f51e3a}}
          BroadcastFilter{22b02 u-1 ReceiverList{b3f744d 902 system/1000/u-1 local:de837e4}}
          BroadcastFilter{3e989ab u0 ReceiverList{f8deffa 2981 com.google.process.gapps/10012/u0 remote:26bd225}}
          BroadcastFilter{fb56150 u0 ReceiverList{22b7b13 2925 com.android.systemui/10027/u0 remote:c54a602}}
          BroadcastFilter{63bbb6 u-1 ReceiverList{ba6c751 3484 com.android.nfc/1027/u-1 remote:5c4a478}}
          BroadcastFilter{95ad20d u0 ReceiverList{d8374a4 3586 com.google.android.googlequicksearchbox/10029/u0 remote:feb3737}}
          BroadcastFilter{fdef551 u0 ReceiverList{28ca78 3745 com.google.android.gms.persistent/10012/u0 remote:f23afdb}}
          BroadcastFilter{9830707 u0 ReceiverList{aabd946 3745 com.google.android.gms.persistent/10012/u0 remote:a4da121}}
          BroadcastFilter{83c43d2 u0 ReceiverList{d422e5d 3745 com.google.android.gms.persistent/10012/u0 remote:f585034}}
          BroadcastFilter{8890378 u0 ReceiverList{26d2cdb 3745 com.google.android.gms.persistent/10012/u0 remote:dfa61ea}}
          BroadcastFilter{7bbb7 u0 ReceiverList{214b2b6 3745 com.google.android.gms.persistent/10012/u0 remote:8353a51}}
          BroadcastFilter{38d3566 u0 ReceiverList{de859c1 3745 com.google.android.gms.persistent/10012/u0 remote:e003aa8}}
          BroadcastFilter{3435d9f u0 ReceiverList{6e38b3e 3745 com.google.android.gms.persistent/10012/u0 remote:8dd7ff9}}
          BroadcastFilter{d0a34bb u0 ReceiverList{5091d4a 3745 com.google.android.gms.persistent/10012/u0 remote:d6d22b5}}
          BroadcastFilter{d43c416 u0 ReceiverList{51a3531 3745 com.google.android.gms.persistent/10012/u0 remote:d0b9dd8}}
          BroadcastFilter{aabf36d u0 ReceiverList{a88bf84 3745 com.google.android.gms.persistent/10012/u0 remote:a9d6197}}
          BroadcastFilter{93f16b u0 ReceiverList{5c61eba 17016 com.google.android.gm/10079/u0 remote:24083e5}}
          BroadcastFilter{68f794e u0 ReceiverList{4cb1c49 947 com.google.android.googlequicksearchbox:search/10029/u0 remote:251d250}}
      ..
    MIME Typed Actions:
```

### Monitor contention 锁竞争

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#monitor%20contention>

Monitor 竞争 log 有时可以显示实际的锁竞争，但更多的是显示系统过载导致一切都变慢了。您可能会在 system 或 event log 中看到由 ART 记录的长时间的 monitor 事件。

- system log: `Long monitor contention event`

```shell
10-01 18:12:44.343 29761 29914 W art     : Long monitor contention event with owner method=void android.database.sqlite.SQLiteClosable.acquireReference() from SQLiteClosable.java:52 waiters=0 for 3.914s
```

- event log: `dvm_lock_sample`

```shell
10-01 18:12:44.364 29761 29914 I dvm_lock_sample: [com.google.android.youtube,0,pool-3-thread-9,3914,ScheduledTaskMaster.java,138,SQLiteClosable.java,52,100]
```

### Background compilation 后台编译

编译可能会占用大量资源，而且会加重设备负载。

```shell
09-14 06:27:05.670  2508  2587 E ActivityManager: CPU usage from 0ms to 5857ms later:
09-14 06:27:05.670  2508  2587 E ActivityManager:   84% 5708/dex2oat: 81% user + 2.3% kernel / faults: 3731 minor 1 major
09-14 06:27:05.670  2508  2587 E ActivityManager:   73% 2508/system_server: 21% user + 51% kernel / faults: 10019 minor 28 major
09-14 06:27:05.670  2508  2587 E ActivityManager:   1% 3935/com.android.phone: 0.3% user + 0.6% kernel / faults: 2684 minor 2 major
```

下载 Google Play 商店更新时，编译可能会在后台进行。在这种情况下，来自 Google Play 商店应用的 `finsky` 和 `installd` 的消息会显示在 `dex2oat` 消息之前。

```shell
10-07 08:42:33.725 11051 11051 D Finsky  : [1] InstallerTask.advanceState: Prepare to patch com.garmin.android.apps.virb (com.garmin.android.apps.virb) from content://downloads/my_downloads/3602 format 2
10-07 08:42:33.752   495   495 I installd: free_cache(48637657) avail 15111192576
…
10-07 08:42:39.998  2497  2567 I PackageManager.DexOptimizer: Running dexopt (dex2oat) on: /data/app/vmdl436577137.tmp/base.apk pkg=com.garmin.android.apps.virb isa=arm vmSafeMode=false debuggable=false oatDir = /data/app/vmdl436577137.tmp/oat bootComplete=true
…
```

当某个应用加载尚未编译的 dex 文件时，编译也可能会在后台进行。在这种情况下，将看不到 `finsky` 或 `installd` 日志记录。

```
09-14 07:29:20.433 15736 15736 I dex2oat : /system/bin/dex2oat -j4 --dex-file=/data/user/0/com.facebook.katana/app_secondary_program_dex/program-72cef82b591768306676e10161c886b58b34315a308602be.dex.jar --oat-file=/data/user/0/com.facebook.katana/app_secondary_program_dex_opt/program-72cef82b591768306676e10161c886b58b34315a308602be.dex.dex
...
09-14 07:29:25.102 15736 15736 I dex2oat : dex2oat took 4.669s (threads: 4) arena alloc=7MB java alloc=3MB native alloc=29MB free=4MB
```

### Power 电源

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#power>

Event Log 中包含屏幕电源状态信息 `screen_toggled`，其中： 0 表示屏幕关闭，1 表示屏幕打开，2 表示已锁屏。

```
grep screen_toggled bugreport-2015-10-18-16-52-22.txt
10-18 15:05:04.383   992   992 I screen_toggled: 1
10-18 15:05:07.010   992   992 I screen_toggled: 0
10-18 15:23:15.063   992   992 I screen_toggled: 1
10-18 15:23:25.684   992   992 I screen_toggled: 0
10-18 15:36:31.623   992   992 I screen_toggled: 1
10-18 15:36:37.660  3283  3283 I screen_toggled: 2
```

`BugReport` 中还包含关于 `wake locks` 唤醒锁定的统计信息，唤醒锁定是应用开发者采用的一种机制，用于表明其应用需要设备保持开启状态（wake locks，见 [PowerManager.WakeLock](https://developer.android.com/reference/android/os/PowerManager.WakeLock.html) and [Keep the CPU on](https://developer.android.com/training/scheduling/wakelock.html#cpu)）。  
唤醒锁定总时长统计信息，仅跟踪唤醒锁定实际负责使设备保持唤醒状态的时间，不包括屏幕处于开启状态的时间。此外，如果同时持有多个唤醒锁定，系统会在它们之间分配唤醒锁定时长。

注：若需直观呈现电源状态方面的更多信息，可以使用 `Battery Historian`（ 一种 Google 开源工具，能够利用 Android BugReport 文件分析电池消耗进程 ）。

### Packages 包信息

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#packages>

`DUMP OF SERVICE package` 部分包含了应用的包版本信息

```shell
...
DUMP OF SERVICE package:
...
Packages:
...
 Package [com.google.android.gms] (3cf534b):
   userId=10013
   sharedUser=SharedUserSetting{98f3d28 com.google.uid.shared/10013}
   pkg=Package{b8f6a41 com.google.android.gms}
   codePath=/system/priv-app/PrebuiltGmsCore
   resourcePath=/system/priv-app/PrebuiltGmsCore
   legacyNativeLibraryDir=/system/priv-app/PrebuiltGmsCore/lib
   primaryCpuAbi=arm64-v8a
   secondaryCpuAbi=armeabi-v7a
   versionCode=8186448 targetSdk=23
   versionName=8.1.86 (2287566-448)
   splits=[base]
   applicationInfo=ApplicationInfo{5158507 com.google.android.gms}
   flags=[ SYSTEM HAS_CODE ALLOW_CLEAR_USER_DATA ]
   privateFlags=[ PRIVILEGED ]
   dataDir=/data/user/0/com.google.android.gms
   supportsScreens=[small, medium, large, xlarge, resizeable, anyDensity]
   libraries:
     com.google.android.gms
   usesOptionalLibraries:
     com.android.location.provider
     com.google.android.ble
     com.android.media.remotedisplay
   usesLibraryFiles:
     /system/framework/com.android.media.remotedisplay.jar
     /system/framework/com.android.location.provider.jar
   timeStamp=2015-10-14 15:17:56
   firstInstallTime=2015-09-22 14:08:35
   lastUpdateTime=2015-10-14 15:17:56
   signatures=PackageSignatures{db63be6 [1af63d8]}
   installPermissionsFixed=true installStatus=1
   pkgFlags=[ SYSTEM HAS_CODE ALLOW_CLEAR_USER_DATA ]
   declared permissions:
     com.google.android.gms.permission.INTERNAL_BROADCAST: prot=signature, INSTALLED
     ...
     com.google.android.gms.permission.CAR_VENDOR_EXTENSION: prot=dangerous, INSTALLED
   User 0:  installed=true hidden=false stopped=false notLaunched=false enabled=0
     disabledComponents:
       com.google.android.gms.icing.service.PowerConnectedReceiver
       ...
       com.google.android.gms.icing.proxy.AppsMonitor
     enabledComponents:
       com.google.android.gms.mdm.receivers.GmsRegisteredReceiver
       ...
       com.google.android.gms.subscribedfeeds.SyncService
```

### Processes 进程

BugReport 中含有大量进程数据，包括：启动和停止时间、运行时时长、相关服务、`oom_adj` 得分等，更多查看 Android 如何管理 [Processes and Threads](http://developer.android.com/guide/components/processes-and-threads.html).

#### Determine process runtime 确定进程运行时

`procstats` 部分包含有关进程及相关服务，已运行时长的完整统计信息。  
若想快速获得便于用户阅读的摘要，可搜索："`AGGREGATED OVER`"，以查看最近 3 个小时或 24 个小时的数据，然后搜索："`Summary:`"，以查看进程列表、这些进程已以各种优先级运行的时长，以及它们使用 RAM 的情况（格式为 "`min-average-max PSS/min-average-max USS`"）。

```shell
-------------------------------------------------------------------------------
DUMP OF SERVICE processinfo:
-------------------------------------------------------------------------------
DUMP OF SERVICE procstats:
COMMITTED STATS FROM 2015-10-19-23-54-56 (checked in):
...
COMMITTED STATS FROM 2015-10-20-03-00-00 (checked in):
...
CURRENT STATS:
...
AGGREGATED OVER LAST 24 HOURS:
System memory usage:
...
Per-Package Stats:
...
Summary:
...
  * com.google.android.gms.persistent / u0a13 / v8186448:
           TOTAL: 100% (21MB-27MB-40MB/20MB-24MB-38MB over 597)
             Top: 51% (22MB-26MB-38MB/21MB-24MB-36MB over 383)
          Imp Fg: 49% (21MB-27MB-40MB/20MB-25MB-38MB over 214)
…
          Start time: 2015-10-19 09:14:37
  Total elapsed time: +1d0h22m7s390ms (partial) libart.so

AGGREGATED OVER LAST 3 HOURS:
System memory usage:
...
Per-Package Stats:
...
Summary:
  * com.google.android.gms.persistent / u0a13 / v8186448:
           TOTAL: 100% (23MB-27MB-32MB/21MB-25MB-29MB over 111)
             Top: 61% (23MB-26MB-31MB/21MB-24MB-28MB over 67)
          Imp Fg: 39% (23MB-28MB-32MB/21MB-26MB-29MB over 44)
...
          Start time: 2015-10-20 06:49:24
  Total elapsed time: +2h46m59s736ms (partial) libart.so
```

#### 某个进程为什么正在运行

`dumpsys activity processes` 部分会列出当前正在运行的所有进程，并按 oom_adj 得分排序（Android 通过为进程分配 oom_adj 值，来表明进程的重要性，该值可由 ActivityManager 动态更新）。这种输出类似于内存快照的输出，但包含有关是什么导致进程运行的更多信息。在以下示例中，以粗体显示的条目表明 `gms.persistent` 进程正在以 `vis`（可见）优先级运行，因为该系统进程已经与其 NetworkLocationService 绑定。

```shell
-------------------------------------------------------------------------------
ACTIVITY MANAGER RUNNING PROCESSES (dumpsys activity processes)
...
Process LRU list (sorted by oom_adj, 34 total, non-act at 14, non-svc at 14):
    PERS #33: sys   F/ /P  trm: 0 902:system/1000 (fixed)
    PERS #32: pers  F/ /P  trm: 0 2925:com.android.systemui/u0a27 (fixed)
    PERS #31: pers  F/ /P  trm: 0 3477:com.quicinc.cne.CNEService/1000 (fixed)
    PERS #30: pers  F/ /P  trm: 0 3484:com.android.nfc/1027 (fixed)
    PERS #29: pers  F/ /P  trm: 0 3502:com.qualcomm.qti.rcsbootstraputil/1001 (fixed)
    PERS #28: pers  F/ /P  trm: 0 3534:com.qualcomm.qti.rcsimsbootstraputil/1001 (fixed)
    PERS #27: pers  F/ /P  trm: 0 3553:com.android.phone/1001 (fixed)
    Proc #25: psvc  F/ /IF trm: 0 4951:com.android.bluetooth/1002 (service)
        com.android.bluetooth/.hfp.HeadsetService<=Proc{902:system/1000}
    Proc # 0: fore  F/A/T  trm: 0 3586:com.google.android.googlequicksearchbox/u0a29 (top-activity)
  Proc #26: vis   F/ /SB trm: 0 3374:com.google.android.googlequicksearchbox:interactor/u0a29 (service)
        com.google.android.googlequicksearchbox/com.google.android.voiceinteraction.GsaVoiceInteractionService<=Proc{902:system/1000}
    Proc # 5: vis   F/ /T  trm: 0 3745:com.google.android.gms.persistent/u0a12 (service)
        com.google.android.gms/com.google.android.location.network.NetworkLocationService<=Proc{902:system/1000}
    Proc # 3: vis   F/ /SB trm: 0 3279:com.google.android.gms/u0a12 (service)
        com.google.android.gms/.icing.service.IndexService<=Proc{947:com.google.android.googlequicksearchbox:search/u0a29}
    Proc # 2: vis   F/ /T  trm: 0 947:com.google.android.googlequicksearchbox:search/u0a29 (service)
        com.google.android.googlequicksearchbox/com.google.android.sidekick.main.remoteservice.GoogleNowRemoteService<=Proc{3586:com.google.android.googlequicksearchbox/u0a29}
    Proc # 1: vis   F/ /T  trm: 0 2981:com.google.process.gapps/u0a12 (service)
        com.google.android.gms/.tapandpay.hce.service.TpHceService<=Proc{3484:com.android.nfc/1027}
    Proc #11: prcp  B/ /IB trm: 0 3392:com.google.android.inputmethod.latin/u0a64 (service)
        com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME<=Proc{902:system/1000}
    Proc #24: svc   B/ /S  trm: 0 27071:com.google.android.music:main/u0a67 (started-services)
    Proc #22: svc   B/ /S  trm: 0 853:com.qualcomm.qcrilmsgtunnel/1001 (started-services)
    Proc # 4: prev  B/ /LA trm: 0 32734:com.google.android.GoogleCamera/u0a53 (previous)
    Proc #23: svcb  B/ /S  trm: 0 671:com.qualcomm.telephony/1000 (started-services)
    Proc #20: cch   B/ /CE trm: 0 27659:com.android.providers.calendar/u0a2 (provider)
        com.android.providers.calendar/.CalendarProvider2<=Proc{27697:com.google.android.calendar/u0a40}
    Proc #13: cch   B/ /CE trm: 0 653:com.google.android.gms.wearable/u0a12 (cch-empty)
    Proc #10: cch   B/ /S  trm: 0 4067:com.google.android.talk/u0a62 (cch-started-ui-services)
    Proc # 6: cch   B/ /CA trm: 0 27697:com.google.android.calendar/u0a40 (cch-act)
    Proc # 8: cch+1 B/ /CA trm: 0 25675:com.google.android.apps.genie.geniewidget/u0a81 (cch-act)
    Proc #16: cch+2 B/ /CE trm: 0 1272:com.google.android.keep/u0a106 (cch-empty)
    Proc #15: cch+2 B/ /CE trm: 0 885:android.process.media/u0a9 (cch-empty)
    Proc #14: cch+2 B/ /CE trm: 0 15146:android.process.acore/u0a3 (cch-empty)
    Proc # 9: cch+3 B/ /CA trm: 0 17016:com.google.android.gm/u0a79 (cch-act)
    Proc #19: cch+4 B/ /CE trm: 0 973:com.google.android.apps.maps/u0a66 (cch-empty)
    Proc #18: cch+4 B/ /CE trm: 0 1091:com.google.android.apps.photos/u0a71 (cch-empty)
    Proc #17: cch+4 B/ /CE trm: 0 1141:com.google.android.apps.plus/u0a74 (cch-empty)
    Proc #12: cch+5 B/ /CA trm: 0 22299:com.google.android.apps.dogfood/u0a105 (cch-act)
    Proc #21: cch+6 B/ /CE trm: 0 995:com.google.android.partnersetup/u0a18 (cch-empty)>
```

### Narrative

#### 时间轴

要呈现问题概况（例如：问题是如何开始的、发生了什么、系统是如何应对的），需要一个固定的事件时间轴。可以利用 BugReport 中的信息，来同步多个日志中的时间轴，并确定 BugReport 的确切时间戳。

#### Sync timelines 同步时间轴

BugReport 反映的是多个并行时间轴（system log 系统日志、event log 事件日志、kernel log 内核日志，以及针对广播、电池统计信息等的多个专用时间轴）。系统通常会使用不同的时间基准来报告不同的时间轴。

- System Log 时间戳和 Event Log 时间戳，采用**用户所用的时区**（与大多数其它时间戳一样），
例如：当用户点按主屏幕按钮时，System Log 会报告以下内容：

```shell
10-03 17:19:52.939 1963 2071 I ActivityManager : START u0 {act=android.intent.action.MAIN cat=[android.intent.category.HOME] flg=0x10200000 cmp=com.google.android.googlequicksearchbox/com.google.android.launcher.GEL (has extras)} from uid 1000 on display 0 
```

Event Log 会报告以下内容：

```
10-03 17:19:54.279 1963 2071 I am_focused_activity : [0,com.google.android.googlequicksearchbox/com.google.android.launcher.GEL] 
```

Kernel (`dmesg`) logs 采用不同的时间基准，按距离 `bootloader` (引导加载程序) 完成的时间（以秒为单位）来标记日志内容。如需按照其它时间表的时间基准记录此时间表，可以搜索 "`suspend exit`" 和 "`suspend entry`" 消息：

```
<6>[201640.779997] PM: suspend exit 2015-10-03 19:11:06.646094058 UTC
… 
<6>[201644.854315] PM: suspend entry 2015-10-03 19:11:10.720416452 UTC 
```

由于内核日志可能不包含处于 `suspend` 状态的时间，因此，应该 `suspend entry and exit` 消息之间的日志。此外，内核日志使用 UTC 时区，必须将其调整为用户时区。

#### 确定 BugReport 的生成时间

- 可以先查看系统日志 (Logcat) 中的 "`dumpstate: begin`"：

```shell
10-03 17:19:54.322 19398 19398 I dumpstate: begin 

# 或者
========================================================
== dumpstate: 2025-05-21 23:47:25
========================================================
```

- 然后查看内核日志 (dmesg) 时间戳中的 `Starting service 'bugreport'` 消息：

```
<5>[207064.285315] init: Starting service 'bugreport'…
```

进行逆向推算以关联这两个事件，同时牢记同步时间轴中提到的注意事项。尽管在初始化 BugReport 后发生了很多活动，但大多数活动并不是非常有用，因此生成 BugReport 这一活动会大大加重系统负载。

### Scans

参考：<https://source.android.com/docs/core/tests/debug/read-bug-reports#scans>

根据下面的步骤来确定是否进行过多的 `Bluetooth Low Energy (BLE)` scans：

- 找 log 带有： `BluetoothLeScanner`

```shell
$ grep 'BluetoothLeScanner' ~/downloads/bugreport.txt
07-28 15:55:19.090 24840 24851 D BluetoothLeScanner: onClientRegistered() - status=0 clientIf=5
```

- Locate the PID in the log messages. In this example, "24840" and "24851" are PID (process ID) and TID (thread ID).
- Locate the application associated with the PID: In this example, the package name is `com.badapp`.

```
PID #24840: ProcessRecord{4fe996a 24840:com.badapp/u0a105}
```

- Look up the package name on Google Play to identify the responsible application: <https://play.google.com/store/apps/details?id=com.badapp>.

**Note**: For devices running Android 7.0, the system collects data for BLE scans and associates these activities with the initiating application. For details, see [Low Energy (LE) and Bluetooth scans](https://source.android.com/docs/core/power/values#le-bt-scans).

### 其他

#### STORAGED IO INFO

```shell
adb shell storaged -u -p
```

Android 系统中用于 **监控存储 I/O（输入/输出）性能** 的命令：

1. **`-u` 选项**  
	启用 **详细时间统计**（单位：**微秒**）。  
	→ 记录每个 I/O 操作的精确耗时（例如 `read`/`write` 延迟）。
2. **`-p` 选项**  
	启用 **按进程统计 I/O 使用情况**。  
	→ 显示每个进程（APP 或系统服务）的存储 I/O 数据（如读写次数、数据量）。

**示例：**

```shell
------ STORAGED IO INFO (storaged -u -p) ------
name/uid fg_rchar fg_wchar fg_rbytes fg_wbytes bg_rchar bg_wchar bg_rbytes bg_wbytes fg_fsync bg_fsync
com.tencent.mm 15723527175 1498353528 38240956416 2244444160 49006598393 2378534274 88878596096 3585441792 19532 36913
com.tencent.wework 6886746361 870341376 31268552704 963227648 5409277709 3973801024 49060265984 3676090368 9094 29346
com.tencent.mm 3054685371 217833027 3041259520 271384576 12438033888 1265294858 29288607744 1650069504 2493 3492
com.heytap.market 3032 385 8192 0 33107261017 2606366259 28010455040 1759236096 0 2257
shared:com.google.uid.shared 19624719 764811 317775872 2113536 3709044247 161756062 29296758784 388329472 47 6892
com.tencent.mobileqq 567102851 57357679 1477885952 68694016 8996214305 94132927 25594286080 828612608 896 1289
com.coloros.phonemanager 1046653 1156 8192 0 43612918590 30290694 22657314816 38649856 0 633
```

#### SYSTEM PROPERTIES

```shell
adb shell getprop
```

能获取到很多重要的 prop。例如我们代码里很多开关是读取的 prop，在这里就可以查询了。还有一些硬件信息的确认等等。

```shell
------ SYSTEM PROPERTIES (getprop) ------
[Build.BRAND]: [MTK]
[aaudio.mmap_exclusive_policy]: [2]
[aaudio.mmap_policy]: [2]
[adjust.preinstall.path]: [/data/etc/appchannel/adjust.preinstall]
[apex.all.ready]: [true]
[apexd.status]: [ready]
[audio.offload.min.duration.secs]: [30]
[audio.offload.video]: [true]
```

#### `am_activity_launch_time`

```
03-28 10:17:21.693  1000  1410  1628 I am_activity_launch_time: [0,139413343,com.xxx/.si_main.MainTabsActivity,8412]
```

## bugreport 日志分析流程

### 内存类问题分析

如果遇到内存不足，我们需要关注的 log 有：

1. `[MEMORY INFO]`
2. `[CPU INFO]`
3. `[PROCRANK]`
4. `[MEMINFO in pid]`
5. `[EVENT LOG]` 中可以看下 am_pss 的 tag
6. `[SYSTEM LOG]` 中也有类似 lowmemorykiller 的 log

### Crash

- 搜索 `FATAL EXCEPTION` 或 `Crash`
- 在 `event log` 中搜索 `am_crash`，快速定位异常时间，进程号；然后再在 mainlog(SYSTEM LOG) 中确定具体信息
- 如果是 Native 的 crash，可在 tombstones 目录中找到对应的 tombstone 文件

### ANR

- Event log 中搜索 `am_anr` 或 `ANR in`，快速定位 anr 发生的时间，进程号等信息。
- anr 目录中找到对应的 trace
- 根据 trace 进行分析，是逻辑有问题，还是系统状态异常
- 如果是系统状态异常，可以结合系统信息（memory info、CPU INFO、PROCRANK、meminfo）等分析

### dropbox

日常工作时遇到偶现的 crash/anr，忘了抓 log 的话，可以查看 dropbox 快速定位问题原因。

```shell
adb pull /data/system/dropbox ./
```

pull 出的 dropbox，一般会有以下几类 txt 文件。且都是以时间戳结尾，标明发生的时间点。

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506052350659.png)

查看某一个文件：`cat system_app_crash@1748907850132.txt`

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202506052353087.png)

这里列举一下常见的一些文件：

| **SYSTEM_TAGS**  | **NOTE**           |
| ---------------- | ------------------ |
| system_app_crash | 系统应用 crash 的异常堆栈     |
| system_app_wtf   | 系统 app 发生严重错误        |
| system_app_anr   | 系统 app 发生 anr 的 trace 文件 |
| SYSTEM_TOMBSTONE | Native 进程崩溃日志       |

# Ref

- [官方：Read bug reports](https://source.android.com/docs/core/tests/debug/read-bug-reports)
- [Android BugReport的组成部分和常见问题（详细说明） - 鲸小鱼- - 博客园](https://www.cnblogs.com/lixuejian/p/16665410.html)
