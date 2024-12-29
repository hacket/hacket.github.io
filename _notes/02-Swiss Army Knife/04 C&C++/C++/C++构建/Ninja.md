---
date created: 2024-05-01 23:30
date updated: 2024-12-27 23:52
dg-publish: true
---

# Ninja

## Ninja 介绍

**Ninja** 是一个小型的构建系统，它专注于速度。它非常快速，特别是对于大型代码库的增量构建，比传统的 make 工具要快得多。Ninja 通过使用简单的文本文件（通常名为`build.ninja`）作为其构建文件来减少构建时的开销。

Ninja 设计的目标是在其他构建工具（如 CMake）生成具体构建规则的基础上执行这些规则。与 CMake 等高级构建系统生成器配合使用时，Ninja 能够优化生成的构建规则的执行过程。

使用 CMake 时，你可以设置生成器为 Ninja，这样 CMake 就会生成 Ninja 所需要的 `build.ninja` 文件，然后使用 Ninja 来执行构建。在这种情况下，CMake 负责解决依赖和构建规则的复杂性，而 Ninja 负责快速、高效地执行这些构建规则。

以下是一些 Ninja 的主要特点：

- 高性能：Ninja 专注于高效的依赖图确定和文件重新构建，其设计使得重新构建（例如更改一个文件后的构建）非常快。
- 精简设计：它不像 CMake 或 Autotools 那样具备生成构建文件的能力。它仅关注如何尽可能快速地执行构建规则。
- 可读的构建配置：尽管建议使用其他工具生成 Ninja 构建文件，但 `build.ninja` 文件仍然足够简单，可以手动编写或检查。

Ninja 已经成为许多大型项目构建系统的一部分，包括 Chromium 项目和 Android。对于 Android NDK 的部分构建，也可以利用 CMake 配合 Ninja 来构建 Native 库。

在实际开发中，如果你正在使用 CMake，你可以通过以下命令指定 Ninja 作为构建系统：

```shell
cmake -G Ninja <source_directory>
```
