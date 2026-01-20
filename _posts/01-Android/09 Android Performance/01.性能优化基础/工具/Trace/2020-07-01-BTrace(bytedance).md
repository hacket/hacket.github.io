---
banner: 
date_created: Monday, July 1st 2020, 10:42:58 pm
date_updated: Wednesday, June 11th 2025, 1:23:13 am
title: BTrace(bytedance)
author: hacket
categories:
  - 性能优化
category: 性能优化工具
tags: [性能优化, 性能优化工具, BTrace, Systrace]
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
date created: 2024-06-16 10:06
date updated: 2024-12-24 00:37
aliases: ["`BTrace2.0`"]
linter-yaml-title-alias: "`BTrace2.0`"
---

# `BTrace2.0`

## `BTrace2.0更新`

1. 使用体验：支持 Windows 啦！此外将脚本实现从 Python 切至 Java 并去除各种权限要求，因脚本工具可用性问题引起的用户使用打断次数几乎降为 0，同时还将 Trace 产物切至 PB 协议，产物体积减小 70%，网页打开速度提升 7 倍！
2. 性能体验：通过大规模改造方法 Trace 逻辑，将 App 方法 Trace 底层结构由字符串切换为整数，实现内存占用减少 80%，存储改为 mmap 方式、优化无锁队列逻辑、提供精准插桩策略等，百万量级方法全插桩下性能损耗进一步降低至 15%！
3. 监控数据：新增 4 项数据监控能力，重磅推出渲染详情采集能力！同时还新增 Binder、线程启动、Wait/Notify/Park/Unpark 等详情数据

## 接入

[btrace/README.zh-CN.md at master · bytedance/btrace · GitHub](https://github.com/bytedance/btrace/blob/master/README.zh-CN.md#%E6%8E%A5%E5%85%A5)

### 编译配置

```groovy
dependencies {
    // rheatrace core lib
    implementation "com.bytedance.btrace:rhea-core:2.0.3-rc02"
}
apply plugin: 'com.bytedance.rhea-trace'
rheaTrace {
   compilation {
      traceFilterFilePath = "${project.rootDir}/trace-filter/traceFilter.txt"
      needPackageWithMethodMap = true
      applyMethodMappingFilePath = ""
   }
}
```

`RheaTrace 2.0` 简化编译插件参数，仅需要提供 `compilation` 配置用于控制编译期行为。RheaTrace 1.0 中 `runtime` 配置已废弃，但为保证兼容升级，我们还是保留 runtime 参数配置，即使配置也不会生效，RheaTrace 2.0 改为通过脚本命令行参数来动态配置。

| 参数                             | 默认值  | 说明                                                                                                                                            |
| ------------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **traceFilterFilePath**        | null | 该文件配置决定哪些方法需要被插桩，详细用法与 RheaTrace 1.0 一致，可以参考 [RheaTrace Gradle 参数介绍](https://github.com/bytedance/btrace/blob/master/GRADLE_CONFIG.zh-CN.MD)。 |
| **applyMethodMappingFilePath** | null | 设备方法的 ID，您可以通过指定上次编译输出的 methodMapping.txt 文件路径来保证多次编译的方法 ID 一致。                                                                               |
| **needPackageWithMethodMap**   | true | 是否将 methodMapping.txt 文件打包内置到 apk 内部。                                                                                                         |

#### traceFilterFilePath

默认值为 null，默认插桩所有方法？

#### applyMethodMappingFilePath

#### needPackageWithMethodMap

## 使用

### jar 包下载

- [Script Management](https://github.com/bytedance/btrace?tab=readme-ov-file#script-management)

### 参数

RheaTrace 2.0 在命令行参数上做了大量改进，更偏于开发者使用。

#### 必选参数

| 参数                      | 默认值 | 说明           |
| ----------------------- | --- | ------------ |
| **-a $applicationName** | N/A | 指定您的 App 的包名 |

#### 可选参数

| 参数                           | 默认值       | 说明                                                                                                                                                                                                                                                      |
| ---------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **-o $outputPath**           | 当前时间.pb   | 指定产物 trace 保存路径，默认值会根据时间戳自动生成                                                                                                                                                                                                                           |
| **-t $timeInSecond**         | 5         | 指定这次采集的时长，单位是秒                                                                                                                                                                                                                                          |
| -mode $mode                  | 根据设备而定    | 指定采集 Trace 的模式，目前支持两种模式：<br><br>1. perfetto: 8.1 及以上系统默认模式，可以采集到您的应用函数执行 trace 以及系统 atrace 和 ftrace；<br>2. simple: 8.1 以下系统默认模式，可以采集到您的应用函数执行 trace 以及系统 atrace                                                                                         |
| -maxAppTraceBufferSize $size | 500000000 | 采集 Trace 时的 buffer 大小，单位是字节，一般而言，您不需要配置此参数，除非您遇到下面类似的提醒：<br><br>> MaxAppTraceBufferSize is too small. Expected 100515704 Actual 100000000. Add -maxAppTraceBufferSize 100515704 to your command<br><br>注意：maxAppTraceBufferSize 仅在 App 启动后的首次 trace 时生效 |
| -threshold $ns               | 0         | 采集函数耗时阈值，单位纳秒。采集时长较长时该参数可减小产物体积                                                                                                                                                                                                                         |
| -s $serial                   |           | 指定 adb 连接的设备                                                                                                                                                                                                                                            |
| **-mainThreadOnly**          |           | 仅采集主线程 trace                                                                                                                                                                                                                                            |
| **-r**                       |           | 自动重启以抓取启动过程的 trace                                                                                                                                                                                                                                      |
| **-fullClassName**           |           | trace 信息默认是不包含包名的，此参数可开启包名                                                                                                                                                                                                                              |
| -deeplink $deeplink          |           | 指定 deeplink 链接                                                                                                                                                                                                                                          |
| `rhea.binder`                |           | 开启 binder 信息增强                                                                                                                                                                                                                                          |
| `rhea.render`                |           | 开启渲染监控能力                                                                                                                                                                                                                                                |
| `rhea.io`                    |           | 开启 IO 监控能力                                                                                                                                                                                                                                              |
| `rhea.thread`                |           | 开启线程创建监控能力                                                                                                                                                                                                                                              |
| `rhea.block`                 |           | 开启 park/unpark/wait/notify 监控功能                                                                                                                                                                                                                         |
| **rhea.all**                 |           | 开启上述所有 RheaTrace 增强的监控能力                                                                                                                                                                                                                                |
| **-debug**                   |           | 打印调试日志                                                                                                                                                                                                                                                  |
| --list                       |           | 查看设备支持的 category 列表                                                                                                                                                                                                                                     |

## 分析问题

### 渲染监控

在 RenderThread 中可以直观分析是具体影响渲染问题的业务代码

#### 案例

测试的布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <FrameLayout
        android:id="@+id/fl1"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <LinearLayout
            android:id="@+id/ll2"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="horizontal">
            <FrameLayout
                android:id="@+id/fl3"
                android:layout_width="match_parent"
                android:layout_height="match_parent">
                <LinearLayout
                    android:id="@+id/ll4"
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:orientation="vertical">
                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Hello World! One"
                        app:layout_constraintBottom_toBottomOf="parent"
                        app:layout_constraintEnd_toEndOf="parent"
                        app:layout_constraintStart_toStartOf="parent"
                        app:layout_constraintTop_toTopOf="parent" />
                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Hello World! Two"
                        app:layout_constraintBottom_toBottomOf="parent"
                        app:layout_constraintEnd_toEndOf="parent"
                        app:layout_constraintStart_toStartOf="parent"
                        app:layout_constraintTop_toTopOf="parent" />
                </LinearLayout>
            </FrameLayout>
        </LinearLayout>
    </FrameLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

### Binder 监控

`btrace` 的 Binder 增强目标是将 Binder 调用的接口名称与方法名称进行解析与展示

### 阻塞监控

`btrace` 可以检索到 `wait/park` 等原因导致线程等待状态

### 线程创建监控

btrace 可以检索到线程创建时机

## 已知问题

- [Known Issues](https://github.com/bytedance/btrace?tab=readme-ov-file#known-issues)

# Ref

- [btrace/INTRODUCTION.zh-CN.MD at master · bytedance/btrace · GitHub](https://github.com/bytedance/btrace/blob/master/INTRODUCTION.zh-CN.MD)
