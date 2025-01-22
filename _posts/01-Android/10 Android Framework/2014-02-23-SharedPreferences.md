---
date_created: Friday, February 23rd 2014, 10:10:45 pm
date_updated: Wednesday, January 22nd 2025, 8:50:40 am
title: SharedPreferences
author: hacket
categories:
  - Android Framework
category: Framework基础
tags: [Framework基础]
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
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
aliases: [SharedPreferences 原理分析]
linter-yaml-title-alias: SharedPreferences 原理分析
---

# SharedPreferences 原理分析

## SP 一创建就开始在后台加载数据了

```java
private Map<String, Object> mMap;
private final File mFile;
SharedPreferencesImpl(File file, int mode) {
    mFile = file;
    mBackupFile = makeBackupFile(file);
    mMode = mode;
    mLoaded = false;
    mMap = null;
    mThrowable = null;
    startLoadFromDisk();
}
private void startLoadFromDisk() {
    synchronized (mLock) {
        mLoaded = false;
    }
    new Thread("SharedPreferencesImpl-load") {
        public void run() {
            loadFromDisk();
        }
    }.start();
}
```

## commit

```java
public boolean commit() {
   
    MemoryCommitResult mcr = commitToMemory();

    SharedPreferencesImpl.this.enqueueDiskWrite(
        mcr, null /* sync write on this thread okay */);
    try {
        mcr.writtenToDiskLatch.await();
    } catch (InterruptedException e) {
        return false;
    }
    notifyListeners(mcr);
    return mcr.writeToDiskResult;
}
```

## SP 推荐实战

1. 在工作线程中写入 sp 时，直接调用 commit 就可以，不必调用 apply, 这种情况下，commit 的开销更小
2. 在主线程中写入 sp 时，不要调用 commit，要调用 apply
3. sp 对应的文件尽量不要太大，按照模块名称去读写对应的 sp 文件，而不是一个整个应用都读写一个 sp 文件
4. sp 的适合读写轻量的、小的配置信息，不适合保存大数据量的信息，比如长串的 json 字符串
5. 当有连续的调用 PutXxx 方法操作时（特别是循环中），当确认不需要立即读取时，最后一次调用 commit 或 apply 即可
