---
title: "Android.bp 中启用 openmp"
date: 2023-10-16 17:12:54 +0800
categories: [教程, Android]
tags: [c++, android, 教程]     # TAG names should always be lowercase
media_subpath: /assets/img/android_openmp/
---

在找到正确答案之前，我尝试了许多方法，例如:

```plaintext
cc_binary {
    shared_libs: [
        "libopenmp",
    ],
}
```

又或者：

```plaintext
cc_binary {
    cppflags: [
        "-fopenmp"
    ],
}
```

但是毫无例外地都失败了，以至于在很长一段时间内我都以为它压根不支持 openmp。

直到有一天我翻 [Artifact viewer](https://ci.android.com/builds/submitted/10954209/linux/latest/view/soong_build.html) 的时候，眼睛一斜看到了这个:

![cc_binary](cc_binary.jpg)

![openmp](openmp.jpg)

原来 Android 把 openmp 独立做成一个选项了。。。所以只需要写：

```plaintext
cc_binary {
    openmp: true,
}
```

不用加任何 `shared_libs` 或者 `cppflags`。
