---
date created: 2024-09-22 22:06
date updated: 2024-12-23 23:41
dg-publish: true
---

# 终端(terminal)、shell

- 终端接收命令输入，Shell 翻译并传递命令，内核执行命令

## Terminal

终端则为 shell 提供视觉界面（窗口），比如我们所熟悉的 `iTerm2`、Linux 桌面上的终端工具等。甚至于我们在 VSCode 中所使用的命令行，也是某种意义上的终端。 我们在 Windows 下所使用的 `CMD`、`Powershell` 既然是一个终端，也是一个 Shell，还是同名的脚本系统。

所以Windows Termianl只是一个终端而已，而没有提供一个更加好用的Shell，改善体验的话两个部分都需要配置

对于终端，Windows下最常用的：

- CMD的黑色背景的终端
- Powershell的蓝色背景的终端
- WSL的默认Bash终端

## Shell

 在命令行中，shell 提供了访问操作系统内核功能的途径，比如说我们所熟悉的 `bash`、`zsh`，都是不同的 shell；

## 区别

 **终端** 只是人机交互的一个接口，提供输入输出命令的交互界面。终端的主要任务是接收用户输入的命令，并提交给 Shell。

**Shell** 是命令解析器，主要任务是翻译命令。Shell 将终端输入的命令转化成内核能够理解的语言并传递给内核，由内核执行命令，并将执行结果返回给终端。

当我们打开终端时，Shell 也会自动启动，操作系统会将终端和 Shell 关联起来。接着我们在终端输入命令，Shell 就负责解释命令。

终端(Terminal):

- 它是一个程序,提供了一个窗口
- 你可以在这个窗口里输入命令和看到结果
- 就像是一个与计算机对话的界面

Shell:

- 它是一个程序,负责解释和执行你输入的命令
- 它在终端里运行,处理你输入的指令
- 常见的Shell有Bash、Zsh等

## Windows Terminal

微软开源的 Terminal，[GitHub - microsoft/terminal: The new Windows Terminal and the original Windows console host, all in the same place!](https://github.com/microsoft/terminal)
