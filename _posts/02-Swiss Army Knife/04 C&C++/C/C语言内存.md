---
date created: 2024-04-27 08:11
date updated: 2024-12-27 23:49
dg-publish: true
---

# C 语言内存申请

## 栈

> 栈内存限制  linux：ulimit -a 查看
> 但是直接分配这么大不行，因为堆栈可能保存参数，返回地址等等信息

MBP 栈内存限制：

![image.png|500|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1687537292091-d6a7c323-c923-4701-820e-ab98215015a7.png)

## 堆

- malloc 没有初始化内存的内容, 一般调用函数 memset 来初始化这部分的内存空间。
- calloc 申请内存并将初始化内存数据为 NULL，相当于 malloc 和 memset 两个操作
- realloc 对 malloc 申请的内存进行大小的调整。

```c
//当数据无法确定 或者 比较庞大 需要使用动态内存申请 在堆中
int *di1 = (int*)malloc(1 * 1024 * 1024);
//动态申请内存应该紧跟 memset 初始化内存
memset(di1, 0, 1 * 1024 * 1024);

// 申请内存并将内存初始化为 null 
int *di2 = (int*)calloc(10, sizeof(int));

// 对malloc申请的内存进行大小的调整
realloc(di1, 20 * sizeof(int));

//一定要free 并养成好习惯 将指针置为 null
//标准写法为：
if (di1) {
    free(di1);
    di1 = 0;
}
if (di2) {
    free(di2);
    di2 = 0;
}
```

**malloc**内部使用**brk**和**mmap**来申请内存，malloc 小于 128 k 的内存，使用 brk 分配内存，将`_edata` 往高地址推, 大于 128 k 则使用 mmap。

进程分配内存主要由两个系统调用完成：**brk 和 mmap** 。

1. Brk 是将_edata (指带堆位置的指针)往高地址推，效率高些；
2. Mmap 找一块空闲的虚拟内存。

## 内存布局

![image.png|900](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1687537307627-823fb516-40ef-4f7b-87e2-d0d6d82ac282.png)

内存布局解释：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian1687537318056-e5650d06-6c80-45c3-86d7-46b18b00a595.png)
