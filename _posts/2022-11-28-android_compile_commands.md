---
title: "Android C++ 生成 compile_commands.json"
date: 2022-11-28 17:10:12 +0800
categories: [教程, Android]
tags: [c++, android, 教程]     # TAG names should always be lowercase
---

## Android C++ 程序开发现状

在 Android 下开发 C++ 程序，我见过绝大多数人都是不使用任何语法插件，就靠硬写，写完之后再根据编译报错来修改语法错误。这也怪不得程序员，一方面，Android 使用 Arm 平台的 clang 编译器，跟 x86 平台的开发环境并不是很兼容；另一方面，Android 要求我们将 C++ 程序放在 `vendor` 目录下，但是我们包含的头文件却是去 `kernel/include` 下面找的。如果想要自己配置插件的开发环境，通常都是一顿操作猛如虎，结果还是各种报错。

## Bear

[Bear](https://github.com/rizsotto/Bear) 是一个用来生成包含编译时选项的数据库的工具。通常它将输出文件 `compile_commands.json`，可以供给例如 vscode 中的 Microsoft C/C++ 插件或者 vim 中的 YouCompleteMe 插件使用，让插件可以正确的解析当前 C++ 源文件的各种依赖信息，例如头文件包含路径。

但是如果想要在 Android 开发环境中使用 Bear 有个很大的问题，那就是 `mm`/`mma` 这类命令它不能被 Bear 识别，即使你将其封装为脚本，最后得到的 `compile_commands.json` 也是空空如也的。

## compdb

但是深入了解 Android 之后，我发现其实 Android 内置有 [compdb](https://android.googlesource.com/platform/build/soong/+/HEAD/docs/compdb.md) 可以用来生成 `compile_commands.json`，流程上只需要设置几个环境变量即可：

```bash
cd /path/to/android/root    # Android 源码根路径
source build/envsetup.sh
lunch xxxx-userdebug
cd /path/to/app/dir         # 项目 Android.mk/Android.bp 所在目录
export SOONG_GEN_COMPDB=1
export SOONG_GEN_COMPDB_DEBUG=1
export SOONG_LINK_COMPDB_TO=$(pwd)
mm
```
{: highlight-lines="5-7" }

等待一段时间后，就会在 `/path/to/app/dir` 目录下看到生成好的 `compile_commands.json` 了。需要注意的是，有些平台似乎不接受 `SOONG_LINK_COMPDB_TO`，不管怎么设置都固定生成在 Android 源码根目录，所以如果你在项目目录找不到该文件或者该文件无效，就去 Android 根目录看看。

如果还是没有 `compile_commands.json`，我们也可以借助 `ninja` 来生成，建议使用 Github 上最新的 `ninja`，否则可能会生成空文件：

```bash
cd /path/to/android/root    # Android 源码根路径
ninja -f out/combined-kona.ninja -t compdb | tee ./compile_commands.json
```

注意此处 `combined-xxx.ninja` 文件叫什么名字取决于你所使用的平台。

通常这个文件大的离谱，我这边生成的有 300 MB，这样如果直接给插件用的话，会导致加载时间过长。因此，我们需要对该文件进行一些裁剪。

`compile_commands.json` 的基本格式是：

```json
[
    {
        "directory": "/path/to/android/root",
        "arguments": [
            "xxx"
        ],
        "file": "xxx"
    },
    ...
]
```

如果是 `ninja` 生成的 `compile_commands.json`，格式会有些许不同，它会用 `command` 字段替换掉 `arguments` 字段，二者都是有效的，都可以被 vscode/YouCompleteMe 等识别。

我们需要关注 `file` 字段，这里指示了每个参与编译的 `cpp` 文件。我们可以将只包含我们模块内的 `cpp` 文件的那些 json 块单独提取出来，组成一个 KB 级别的小 `compile_commands.json` 文件，这样，插件读取该文件会更轻松。

这里用 python 简单写个处理程序：

```python
#!/usr/bin/python3
import sys
import json
import os
from pathlib import Path

if len(sys.argv) != 4:
    print("Usage: python3 main.py <project directory> <input compiledb path> <output compiledb path>")
    sys.exit()

files = Path(sys.argv[1])
result = list(map(os.path.realpath, map(str, list(files.rglob("*.cpp")) + list(files.rglob("*.c")))))

with open(sys.argv[2]) as compdb_input:
    compdb_origin = json.load(compdb_input)
    compdb_gen = []
    for obj in compdb_origin:
        full_path = obj["directory"] + '/' + obj["file"]
        if full_path in result:
            print("Find file: %s" % full_path)
            compdb_gen.append(obj)

with open(sys.argv[3], "w") as compdb_out:
    compdb_out.write(json.dumps(compdb_gen, indent=1))
```

用法是 `python3 main.py 模块路径 输入的json文件路径 输出的json文件路径`。

最后，配置好对应插件即可，例如对于 vscode，我们需要在 `.vscode/c_cpp_properties.json` 中添加下面高亮行的内容：

```json
{
    "configurations": [
        {
            "name": "Linux",
            "includePath": [
                "${workspaceFolder}/**"
            ],
            "defines": [],
            "intelliSenseMode": "linux-gcc-x64",
            "compileCommands": "compile_commands.json"
        }
    ],
    "version": 4
}
```
{: highlight-lines="10" }

重新打开一下工作区，然后用鼠标追踪一下 `#include` 的头文件，会发现这些头文件都指向了 Android 目录的，而不再是本机的 `/usr/include/`。
