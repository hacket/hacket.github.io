---
title: "在高版本系统上为 Qt6 生成 AppImage"
date: 2022-11-1 10:48:12 +0800
categories: [教程, Qt]
tags: [qt, 教程, linux, appimage]     # TAG names should always be lowercase
---

## 前言

目前，大部分的 AppImage 的教程与工具都建议你在最低所支持的系统上进行编译打包，这是由于 Linux 系统的兼容性，在旧版本系统打包的软件可以正常在新版本系统中运行，反过来则不行。

但是这一点对于 Qt 用户尤其是 Qt6 用户而言很不友好：一方面，在旧版本的 Linux 系统上很难安装高版本的 Qt，另一方面，过于老旧的 GCC 不支持大量的 C++ 新特性，需要对代码进行大改特改才能让它编译成功。

相比于这一条坎坷之路，我更倾向于走另一条路：在最新版本的系统上编译打包，然后解决它在低版本系统上遇到的所有问题。

## 软件

本文需要用到两个软件，分别是 [linuxdeploy](https://github.com/linuxdeploy/linuxdeploy) 与 [appimage-builder](https://github.com/AppImageCrafters/appimage-builder)。**本文默认您已经从 Github 上下载好了软件，赋予其可执行权限，并且已经软链接到 `/usr/bin/linuxdeploy` 与 `/usr/bin/appimage-builder`**。

另外，appimage-builder 依赖 [docker](https://www.docker.com/) 进行测试，也请先安装好 docker 并测试其功能正常。

最后需要提一点，我在尝试 Ubuntu 22.04 系统官方的 Qt 6.2.4 时，在某一步骤始终无法获得有效的进展，因此本文是基于使用 Qt 官方工具安装的 **Qt 6.4.0** 来写的。

## 打包 AppImage

首先来到项目目录下，通过下面的命令进行编译：

```bash
mkdir build
cd build
qmake ../
make
```

在该目录下创建 [Desktop Entry 文件](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html)，以 `demo` 来举例，创建 `demo.desktop`，然后输入：

```plaintext
[Desktop Entry]
Type=Application
Name=Demo App
Comment=
TryExec=demo
Exec=demo
Icon=demo
Terminal=false
Categories=Qt;
```

准备好图标文件 `demo.png`，然后使用下面的命令生成 `AppDir` 目录：

```bash
linuxdeploy --appdir AppDir -e demo -i demo.png -d demo.desktop --plugin qt
```

这一步的目的主要是将 Qt 库打包到 AppDir 下。

> 不要使用参数 `--output appimage`，因为这样打包出来的 AppImage 只能在**当前或更高版本的系统**上才能运行，无法兼容低版本系统。
{:.prompt-danger}

至此，linuxdeploy 的任务就结束了，但是在进行下一步之前，我们要先把 `AppDir/demo.desktop` 与 `AppDir/demo.png` 删除，否则 appimage-builder 将抱怨无法创建这两个文件。

接下来我们执行 appimage-builder：

```bash
appimage-builder --generate
```

这一步会询问你一些项目的基本信息，并生成一个 `AppImageBuilder.yml`。填项目信息时不需要太过担心，因为都可以在 `AppImageBuilder.yml` 里面修改。

在配置文件中的 `AppDir.apt.include` 中，你需要将你项目依赖的包给包含进去，这样在构建 AppImage 时，appimage-builder 会下载这些包打包进去。

配置文件改好后，我们可以来初步进行尝试打包：

```bash
appimage-builder --appdir ./AppDir
```

这一步，appimage-builder 会在 Github 上拉取一些必要的文件，并且会拉取五个 docker 镜像。如果你的网速太慢，或者干脆连不上，请尝试科学上网，然后通过设置 `HTTPS_PROXY` 与 `HTTP_PROXY` 让 appimage-builder 走科学上网途径。

不出意外的话，这一次尝试，我们会停在这个报错上：

```plaintext
INFO:TEST CASE 'fedora-30':command
$ ./AppRun
qt.qpa.plugin: Could not find the Qt platform plugin "xcb" in ""
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.
```

这个报错可能不太明了，我们可以通过添加环境变量 `QT_DEBUG_PLUGINS` 来获得更详细的报错：

```yml
...
  test:
    fedora-30:
      env:
        QT_DEBUG_PLUGINS: 1
      image: appimagecrafters/tests-env:fedora-30
      command: ./AppRun
...
```

得到报错：

```plaintext
INFO:TEST CASE 'fedora-30':command
$ ./AppRun
qt.core.plugin.factoryloader: checking directory path "/app/usr/bin/platforms" ...
qt.qpa.plugin: Could not find the Qt platform plugin "xcb" in ""
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.
```

看来是 `platform` 打包错位置了，我们将 `AppDir/usr/plugins/platforms` 拷贝到 `AppDir/usr/bin/platforms`，继续测试。

此时，我们会发现，在 fedora-30，debian-stable，archlinux-latest 三个测试环境下，我们的程序都成功打开了，但是在 centos-7 测试环境下，报了下面的错误：

```plaintext
INFO:root:
INFO:root:Running test: centos-7
INFO:root:-----------------------------
INFO:TEST CASE 'centos-7':before command
$ useradd -mu 1000 nihil

$ mkdir -p /home/nihil/.config

INFO:TEST CASE 'centos-7':command
$ ./AppRun
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /app/usr/bin/usb-regulus)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by /app/usr/lib/libQt6Widgets.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /app/usr/lib/libQt6Widgets.so.6)
/app/usr/bin/usb-regulus: /lib64/libz.so.1: version `ZLIB_1.2.9' not found (required by /app/usr/lib/libQt6Gui.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /app/usr/lib/libQt6Gui.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by /app/usr/lib/libQt6Core.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.11' not found (required by /app/usr/lib/libQt6Core.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by /app/usr/lib/libQt6Core.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /app/usr/lib/libQt6Core.so.6)
/app/usr/bin/usb-regulus: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by /app/usr/lib/libQt6DBus.so.6)
/app/usr/bin/usb-regulus: /lib64/libgpg-error.so.0: no version information available (required by /app/usr/lib/libgcrypt.so.20)

```

这是因为低版本系统的 GLIBC 库版本太低，我们需要将本机系统的 `libstdc++6` 也打包进去：

```yml
AppDir:
  apt:
    include:
    # - libc6:amd64   # libstdc++6 包含了这个包，因此可以删除这一行
    - libstdc++6
```

之后继续打包，报错：

```plaintext
INFO:TEST CASE 'centos-7':command
$ ./AppRun
/app/usr/bin/usb-regulus: /lib64/libz.so.1: version `ZLIB_1.2.9' not found (required by /app/usr/lib/libQt6Gui.so.6)
/app/usr/bin/usb-regulus: /lib64/libgpg-error.so.0: no version information available (required by /app/usr/lib/libgcrypt.so.20)
```

同理，这是因为旧版本系统的 ZLIB 版本太低了，我们把本机的 `zlib1g` 也打包进去：

```yml
AppDir:
  apt:
    include:
    - libstdc++6
    - zlib1g
```

继续测试，仍然有报错：

```plaintext
INFO:TEST CASE 'centos-7':command
$ ./AppRun
/app/usr/bin/usb-regulus: /lib64/libgpg-error.so.0: no version information available (required by /app/usr/lib/libgcrypt.so.20)
/app/usr/bin/usb-regulus: symbol lookup error: /app/usr/lib/libgcrypt.so.20: undefined symbol: gpgrt_lock_lock, version GPG_ERROR_1.0
```

我们就不需要多说什么了，将 `libgpg-error0` 也打包进去：

```yml
AppDir:
  apt:
    include:
    - libstdc++6
    - zlib1g
    - libgpg-error0
```

完成到这一步之后，再进行打包测试，发现在五个测试系统中，我们的程序都顺利打开了。此时 appimage-builder 会继续完善剩下的工作，最终打包出 `Demo App-1.0.0-x86_64.AppImage`。

## 关于 Qt 6.2.4

在写完这篇博文之后，我尝试了 Ubuntu 22.04 官方打包的 `qt6-base-dev` 也就是 Qt 6.2.4 时，一直卡在了 `xcb` 问题上：

```plaintext
QFactoryLoader::QFactoryLoader() looking at "/app/usr/bin/platforms/libqxcb.so"
Found metadata in lib /app/usr/bin/platforms/libqxcb.so, metadata=
{
    "IID": "org.qt-project.Qt.QPA.QPlatformIntegrationFactoryInterface.5.3",
    "MetaData": {
        "Keys": [
            "xcb"
        ]
    },
    "archreq": 0,
    "className": "QXcbIntegrationPlugin",
    "debug": false,
    "version": 393728
}


Got keys from plugin meta data QList("xcb")
Cannot load library /app/usr/bin/platforms/libqxcb.so: 
QLibraryPrivate::loadPlugin failed on "/app/usr/bin/platforms/libqxcb.so" : "Cannot load library /app/usr/bin/platforms/libqxcb.so: "
qt.qpa.plugin: Could not load the Qt platform plugin "xcb" in "" even though it was found.
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.
```

前后折腾了五六个小时，把谷歌上能找到的解决方案都试了个遍，仍然没有解决这个报错。如果有大佬成功打包过 Qt 6.2.4，还请不吝赐教。
