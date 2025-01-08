---
date created: 2024-12-23 23:41
date updated: 2024-12-23 23:41
dg-publish: true
---

# WSL基础

## WSL概述

Windows Linux子系统(WSL)是一个功能强大的工具，最新版本将真正的Linux内核放在Windows 10上，将来，将支持GUI应用程序，并且仅用一个命令即可进行配置。

WSL尚不支持图形界面，因此工作是通过终端完成的。当你安装了Linux发行版(或多个版本)时，通过PowerShell进行管理和与之交互需要一定的技能。

## WSL命令

### 基本命令

如果你打开了PowerShell窗口，并希望进入默认的WSL Linux发行版：

wsl

退出会带你回到PowerShell。如果要运行特定的发行版：

wsl -d <发行名称>

要启动Debian，命令将是

wsl -d debian

可以提到用于管理WSL的更有用的工具之一，帮助电话：

wsl --help

### WSL版本控制

- 要查看为每个已安装的Linux发行版分配了哪个WSL版本：

```
wsl --list --verbose 或 wsl -l -v
```

结果将显示哪个版本是默认的wsl发行版。如果只想知道安装了哪个发行版，请取消选中详细选项。

- 如果你想更进一步，并指定默认情况下将使用哪些已安装的发行版：

wsl --set-default 或 wsl -s

- 例如，如果要安装Ubuntu作为默认发行版：

wsl -s ubuntu

- 如果你已升级到WSL2，并希望将其设置为默认值：

wsl --set-default-version 2

- 结果，将来的任何Linux安装都将使用WSL2，但不会安装已经安装的WSL的第一个版本，此转换必须手动完成。更改链接到发行版的WSL版本：

wsl --set -version <发行名称>

- 例如，要将Debian更改为WSL 2：

wsl --set -version Debian 2

## 安装linux发行版

### 安装ubuntu

```powershell
wsl --install -d ubuntu
```
