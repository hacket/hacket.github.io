---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# SharedPreferences原理分析

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

## SP推荐实战

1. 在工作线程中写入sp时，直接调用commit就可以，不必调用apply, 这种情况下，commit的开销更小

2. 在主线程中写入sp时，不要调用commit，要调用apply

3. sp对应的文件尽量不要太大，按照模块名称去读写对应的sp文件，而不是一个整个应用都读写一个sp文件

4. sp的适合读写轻量的、小的配置信息，不适合保存大数据量的信息，比如长串的json字符串

5. 当有连续的调用PutXxx方法操作时（特别是循环中），当确认不需要立即读取时，最后一次调用commit或apply即可
