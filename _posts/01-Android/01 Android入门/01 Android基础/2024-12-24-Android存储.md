---
date created: Tuesday, December 24th 2024, 12:24:00 am
date updated: Saturday, January 4th 2025, 7:31:29 pm
title: Android存储
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories:
  - Android
aliases: [Android 各种 API 文件路径]
linter-yaml-title-alias: Android 各种 API 文件路径
tags: [135]
---

# Android 各种 API 文件路径

## Context 相关的

### 1、内部存储

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687800029839-76fc6221-e497-4511-9828-7af09ce7ec9b.png#averageHue=%23fbf9f7&clientId=u8b86f896-fffe-4&from=paste&height=139&id=u923dead2&originHeight=209&originWidth=306&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=21683&status=done&style=none&taskId=ua6fe074a-b9dd-4b44-97d5-f294464c569&title=&width=204)

- [getFilesDir()](http://developer.android.com/reference/android/content/Context.html#getFilesDir())<br />**内部存储**；获取 `/data/data/<package name>/files` 目录。

```java
File filesDir = this.getFilesDir();
```

如：`/data/data/me.hacket.test.code/files`

- [getCacheDir()](http://developer.android.com/reference/android/content/Context.html#getCacheDir())<br />**内部存储**；获取 `/data/data/<package name>/cache` 目录；机身内存不足时，文件会被删除，不会提示。

```java
File cacheDir = this.getCacheDir();
```

如：`/data/data/me.hacket.test.code/cache`

---

- openOrCreateDatabase(String name, int mode, CursorFactory factory)<br />打开或者创建 (如果不存在) 一个数据库 name，创建的数据库保存在 `/data/data/<package name>/databases` 目录

```java
SQLiteDatabase dbHacket = this.openOrCreateDatabase("db_hacket.db", MODE_PRIVATE, null);
```

如:`/data/data/me.hacket.test.code/databases/db_hacket.db`

- getDatabasePath(String name)<br />打开由 `openOrCreateDatabase()` 创建的数据库 name

```java
File dbPath = this.getDatabasePath("db_hacket.db");
```

如：`/data/data/me.hacket.test.code/databases/db_hacket.db`

---

- openFileOutput(String name, int mode)<br />第一参数用于指定文件名称，不能包含路径分隔符 "/" ，如果文件不存在，Android 会自动创建它。创建的文件保存在 `/data/data/<package name>/files` 目录
- openFileOutput(String name, int mode)<br />打开存放在 `/data/data/<package name>/files` 目录应用私有的文件
- getFileStreamPath(String name)<br />返回由 `openFileOutput(String name, int mode)` 创建的文件，返回以 `name` 为文件名的文件对象，`name` 为空，则等同于 `getExternalFilesDir("")`

### 2、外部存储

- getExternalCacheDir()<br />**外部存储**；获取 `/sdcard/Android/data/<package name>/cache` 目录；其实就是 `getExternalCacheDirs()[0]` 获取主外存设备。

```java
File externalCacheDir = this.getExternalCacheDir();
```

如：`/storage/emulated/0/Android/data/me.hacket.test.code/cache`

- getExternalFilesDir(String type)<br />**外部存储**；获取 `/sdcard/Android/data/<package name>/files` 目录，外部存储没有实时监控，当空间不足时，文件不会实时被删除，可能返回空对象。<br />_type_ 系统指定了几种类型:

```
String directoryMusic = Environment.DIRECTORY_MUSIC; // Music
String directoryDcim = Environment.DIRECTORY_DCIM; // DCIM
String directoryDownloads = Environment.DIRECTORY_DOWNLOADS; // Download
String directoryPictures = Environment.DIRECTORY_PICTURES; // Pictures
// ...
```

示例：

```java
File getExternalFilesDirMusic = this.getExternalFilesDir("music");
// /storage/emulated/0/Android/data/me.hacket.test.code/files/music
```

- getDir(String name, int mode)<br />目录的命名规则为 app_ + name, 通过 mode 可控制此目录为 app 私有还是其他 app 可读写。<br />示例：

```java
File dirPath = this.getDir("hacket", MODE_PRIVATE);
// /data/data/me.hacket.test.code/app_hacket
```

- getExternalMediaDirs()<br />获取 `/sdcard/Android/media/<package name>` 目录，需要 api21(android5.0+)<br />示例：

```java
File[] externalMediaDirs = this.getExternalMediaDirs();
// /storage/emulated/0/Android/media/me.hacket.test.code
```

对于用户个人资料，如果仅仅是为了方便用户导出图片、视频、音频等媒体文件，供其它应用（比如 微信）读取，建议使用 Android 5.0 新增的 API - `Context.getExternalMediaDirs()`。 存储在此位置的文件，应用自身无需存储权限即可读写，而其它应用可通过 MediaStore 或者直接访问（需存储权限），用户还可以通过文件管理器方便访问。 如果应用需要兼容 5.0 以下的 Android 版本，建议以如下版本限定的方式声明外部存储权限，并在旧版本系统上直接读写外部存<br />储。

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="20" />
```

**Note1: **从 Android 4.4 起 `getExternalFilesDir(String type)` 和 `getExternalCacheDir()` 这两个方法不需要读写权限，是针对于本应用来说，如果要访问其他应用的相关目录，还是需要声明读写权限。Android 4.4 之前的版本要访问的话还是要声明读写权限的，如果没有在 manifest 中写权限，上面两个 get 方法都会返回 null。

**Note2: **`/data/data/<package name>/(内部存储，安全的，其他应用无法读取本应用的数据)` 和 `/sdcard/Android/data/<package name>/(外部存储，其他应用程序也可访问)` 这些目录都是属于应用的，当应用被卸载的时候，里面的内容都会被移除，但是不要依赖于系统的操作。

**Note3: **在外部存储中，`/sdcard/Android/data/<package name>/files` 中的媒体文件，不会被当做媒体扫描出来，加到媒体库中。

---

## Environment 相关的

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687800058604-25fcee88-44f9-49af-b77e-2971c1aa11d3.png#averageHue=%23fbf9f7&clientId=u8b86f896-fffe-4&from=paste&height=333&id=ufe14bb3a&originHeight=500&originWidth=471&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=58617&status=done&style=none&taskId=u93cdd597-2919-4733-a5ac-66545ce5f19&title=&width=314)

##### Environment.getExternalStorageDirectory()

主要的外部存储目录<br />/storage/emulated/0

##### Environment.getDataDirectory()

获取用户数据目录<br />/data

##### Environment.getDownloadCacheDirectory()

下载缓存内容目录<br />/cache

##### Environment.getExternalStoragePublicDirectory("hacket")

/storage/emulated/0/hacket

##### Environment.getRootDirectory()

Android 的根目录<br />/system

```java
getDir("what",0):
/data/data/com.tt.filepather/app_what
```

##### Environment.isExternalStorageEmulated()

是否是仿真的

##### Environment.isExternalStorageRemovable()

可用于判断手机外置卡是否可以插拔

##### Environment.getExternalStorageState()

---

## 与存储相关权限

- 从 Android 1.0 开始，写操作受权限 WRITE_EXTERNAL_STORAGE 保护。
- 从 Android 4.1 开始，读操作受权限 READ_EXTERNAL_STORAGE 保护。
- 从 Android 4.4 开始，应用可以管理在它外部存储上的特定包名目录，而不用获取 WRITE_EXTERNAL_STORAGE 权限。

> 比如，一个包名为 com.example.foo 的应用，可以自由访问外存上的 Android/data/com.example.foo/目录。

- Android6.0 运行时权限
- Android10.0 分区存储
- Android11 强制分区存储

---

参考：<br />Storage<br /><https://source.android.com/devices/storage/>

Android 存储使用参考<br /><http://www.liaohuqiu.net/cn/posts/storage-in-android/>

# SharedPreferences

## SharedPreferences 使用

SharedPreferences 是轻量级持久化工具，把键值对写成 xml 文件保存在 `data/data/packagename/shared_prefs` 有的手机是 `data/user/0/packagename/shared_prefs` 路径下，注意 SharedPreferences 这个类并**不支持跨进程**使用。

- 获取实例

```java
//创建一个新的sh保存数据
SharedPreferences sharedPreferences = Context.getSharedPreferences("data",MODE_PRIVATE);
//创建一个新的sh的edit来写数据
editor = sharedPreferences.edit();
```

- 添加数据

```java
editor.putString("string","str");
editor.putInt("int",1)
editor.commit(); // editoer.apply();
```

> commit 和 apply 区别：commit 有返回值，同步；apply 异步

- 获取数据

```java
sharedPreferences.getString("int",null);
```

- 清除数据

> 清除数据很简单，我们只需要调用它的 clean() 方法就行了，记住，一定要 commit()，这样才是彻底清除。

```java
editor.clear();
editor.commit();
```

## SharedPreferences 源码分析

### 获取 SharedPreferences 实例 SharedPreferencesImpl

我们通过调用 Context.getSharedPreferences 获取一个 SharedPreferences 实例的时候，真正的实现在 ContextImpl：

```java
// ContextImpl.java
/**
 * Map from package name, to preference name, to cached preferences.
 */
private static ArrayMap<String, ArrayMap<File, SharedPreferencesImpl>> sSharedPrefsCache;

/**
 * Map from preference name to generated path.
 */
private ArrayMap<String, File> mSharedPrefsPaths;

public SharedPreferences getSharedPreferences(String name, int mode) {
    // At least one application in the world actually passes in a null
    // name.  This happened to work because when we generated the file name
    // we would stringify it to "null.xml".  Nice.
    if (mPackageInfo.getApplicationInfo().targetSdkVersion <
            Build.VERSION_CODES.KITKAT) {
        if (name == null) {
            name = "null";
        }
    }

    File file;
    synchronized (ContextImpl.class) {
        if (mSharedPrefsPaths == null) {
            mSharedPrefsPaths = new ArrayMap<>();
        }
        file = mSharedPrefsPaths.get(name);
        if (file == null) {
            file = getSharedPreferencesPath(name);
            mSharedPrefsPaths.put(name, file);
        }
    }
    return getSharedPreferences(file, mode);
}

// sp保存路径/data/data/packagename/shared_prefs目录下
public File getSharedPreferencesPath(String name) {
    return makeFilename(getPreferencesDir(), name + ".xml");
}
private File getPreferencesDir() {
    synchronized (mSync) {
        if (mPreferencesDir == null) {
            mPreferencesDir = new File(getDataDir(), "shared_prefs");
        }
        return ensurePrivateDirExists(mPreferencesDir);
    }
}
public SharedPreferences getSharedPreferences(File file, int mode) {
    SharedPreferencesImpl sp;
    synchronized (ContextImpl.class) {
        final ArrayMap<File, SharedPreferencesImpl> cache = getSharedPreferencesCacheLocked();
        sp = cache.get(file);
        if (sp == null) {
            checkMode(mode); // AndroidN(API24)，MODE_WORLD_READABLE和MODE_WORLD_WRITEABLE不可用，抛异常
            if (getApplicationInfo().targetSdkVersion >= android.os.Build.VERSION_CODES.O) {
                if (isCredentialProtectedStorage()
                        && !getSystemService(UserManager.class)
                                .isUserUnlockingOrUnlocked(UserHandle.myUserId())) {
                    throw new IllegalStateException("SharedPreferences in credential encrypted "
                            + "storage are not available until after user is unlocked");
                }
            }
            sp = new SharedPreferencesImpl(file, mode);
            cache.put(file, sp);
            return sp;
        }
    }
    if ((mode & Context.MODE_MULTI_PROCESS) != 0 ||
        getApplicationInfo().targetSdkVersion < android.os.Build.VERSION_CODES.HONEYCOMB) {
        // If somebody else (some other process) changed the prefs
        // file behind our back, we reload it.  This has been the
        // historical (if undocumented) behavior.
        sp.startReloadIfChangedUnexpectedly();
    }
    return sp;
}
private ArrayMap<File, SharedPreferencesImpl> getSharedPreferencesCacheLocked() {
    if (sSharedPrefsCache == null) {
        sSharedPrefsCache = new ArrayMap<>();
    }

    final String packageName = getPackageName();
    ArrayMap<File, SharedPreferencesImpl> packagePrefs = sSharedPrefsCache.get(packageName);
    if (packagePrefs == null) {
        packagePrefs = new ArrayMap<>();
        sSharedPrefsCache.put(packageName, packagePrefs);
    }

    return packagePrefs;
}
```

实例就是 `SharedPreferencesImpl`。

有趣的是 getSharedPreferencesCacheLocked 里面那个 packageName。我们知道，一个应用的包名并不会改变；在访问内存中数据时，不同进程也不会互相干扰。这样看来，用 packageName 做 key 的这个 sSharedPrefsCache 是否有点多余？<br />通过查看 git 提交记录 8e3ddab 可以看到这样一句说明：

> Otherwise multiple applications using the same process can end up leaking SharedPreferences instances between the apps

其实 Android 有一个相当不常用的特性——多个应用可以共用同一个进程。在这种情况下，这里用 package name 就能够把各个应用的 SP 区分开。<br />这里的实现还隐含了 SP 的一个特性：一旦数据加载到内存，除非我们删除整个 SP，内存中的数据在整个进程的生命周期中都存在。正常情况下，SP 中的数据量是非常小的，这个并不会导致什么问题。

#### SharedPreferencesImpl 初始化

```java
// base/core/java/android/app/SharedPreferencesImpl.java
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

可以看到，SP 一创建就开始在后台加载数据了。利用这个特性，对于比较大的 SP 并且预期很快就要用到，可以提前获取 SP 实例，以触发他的初始化。这样一来，在随后我们真正需要读取里面的数据时，他很可能就已经加载完成，从而避免了第一次读取时的卡顿。

### 获取 Editor 实例

```java
// SharedPreferencesImpl
public Editor edit() {
    // TODO: remove the need to call awaitLoadedLocked() when
    // requesting an editor.  will require some work on the
    // Editor, but then we should be able to do:
    //
    //      context.getSharedPreferences(..).edit().putString(..).apply()
    //
    // ... all without blocking.
    synchronized (mLock) {
        awaitLoadedLocked();
    }
    
    return new EditorImpl();
}
```

Editor 的实现类是 EditorImpl

### commit/apply

#### commit 同步写到磁盘

```java
// EditorImpl
private final Map<String, Object> mModified = new HashMap<>(); // 保存putXXX的数据

public boolean commit() {
    // ...
    MemoryCommitResult mcr = commitToMemory();
    SharedPreferencesImpl.this.enqueueDiskWrite(
        mcr, null /* sync write on this thread okay */);
    try {
        mcr.writtenToDiskLatch.await(); // 挂起线程  这里内部调用了CountDownLatch的awiat等待方法，只有在写完文件后才会放行
    } catch (InterruptedException e) {
        return false;
    } finally {
    }
    notifyListeners(mcr);
    return mcr.writeToDiskResult;
}
```

> commit 操作，首先它会构建 MemoryCommitResult 对象，把编辑的结果同步到内存中，然后将结果写入到磁盘文件中。在写文件的过程中，会利用 CountDownLatch 阻塞等待，直到写文件成功后才会 notify，成功写入文件后会将备份文件删除，同一个 SP 实例，下次再提交数据时，会将原文件重命名备份文件名。如果写入失败，会将原文件删除。由此可见，数据 commit 都会重新写入整个文件数据。(备份文件作用是用来给下次恢复数据使用，可以见 SP 构造函数实例。

#### apply

```java
// EditorImpl
public void apply() {
    final long startTime = System.currentTimeMillis();

    final MemoryCommitResult mcr = commitToMemory();
    final Runnable awaitCommit = new Runnable() {
            @Override
            public void run() {
                try {
                    mcr.writtenToDiskLatch.await();
                } catch (InterruptedException ignored) {
                }

                if (DEBUG && mcr.wasWritten) {
                    Log.d(TAG, mFile.getName() + ":" + mcr.memoryStateGeneration
                            + " applied after " + (System.currentTimeMillis() - startTime)
                            + " ms");
                }
            }
        };

    QueuedWork.addFinisher(awaitCommit); // 添加到QueuedWork的LinkedList<Runnable>中，在执行完毕后移除

    Runnable postWriteRunnable = new Runnable() {
            @Override
            public void run() {
                awaitCommit.run();
                QueuedWork.removeFinisher(awaitCommit); // 执行保存文件到sd卡完毕后，移除Finisher
            }
        };

    SharedPreferencesImpl.this.enqueueDiskWrite(mcr, postWriteRunnable);

    // Okay to notify the listeners before it's hit disk
    // because the listeners should always get the same
    // SharedPreferences instance back, which has the
    // changes reflected in memory.
    notifyListeners(mcr);
}
```

commit 和 apply 都调用了，只是 commit 传 null，而 apply 传了 postWriteRunnable

```java
// SharedPreferencesImpl#enqueueDiskWrite
private void enqueueDiskWrite(final MemoryCommitResult mcr,
                                  final Runnable postWriteRunnable) {
    final boolean isFromSyncCommit = (postWriteRunnable == null);

    final Runnable writeToDiskRunnable = new Runnable() {
            @Override
            public void run() {
                synchronized (mWritingToDiskLock) {
                    writeToFile(mcr, isFromSyncCommit);
                }
                synchronized (mLock) {
                    mDiskWritesInFlight--;
                }
                if (postWriteRunnable != null) {
                    postWriteRunnable.run();
                }
            }
        };

    // Typical #commit() path with fewer allocations, doing a write on
    // the current thread.
    if (isFromSyncCommit) { // commit同步执行
        boolean wasEmpty = false;
        synchronized (mLock) {
            wasEmpty = mDiskWritesInFlight == 1;
        }
        if (wasEmpty) {
            writeToDiskRunnable.run();
            return;
        }
    }

    // apply走这里
    QueuedWork.queue(writeToDiskRunnable, !isFromSyncCommit);
}
```

1. 如果是 commit，那就直接调用 `writeToDiskRunnable#run` 方法，直接写文件了
2. 如果是 apply，将其提交到 `QueueWork#queue()`

```
// QueueWork
private static final LinkedList<Runnable> sFinishers = new LinkedList<>();
private static final LinkedList<Runnable> sWork = new LinkedList<>(); // 通过queue保存在QueueWork的Runnable

public static void queue(Runnable work, boolean shouldDelay) {
    Handler handler = getHandler(); // 这个Handler是在子线程中，HandlerThread
    synchronized (sLock) {
        sWork.add(work);

        if (shouldDelay && sCanDelay) {
            handler.sendEmptyMessageDelayed(QueuedWorkHandler.MSG_RUN, DELAY); // apply走这里，有个100ms的delay
        } else {
            handler.sendEmptyMessage(QueuedWorkHandler.MSG_RUN);
        }
    }
}
private static Handler getHandler() {
    synchronized (sLock) {
        if (sHandler == null) {
            HandlerThread handlerThread = new HandlerThread("queued-work-looper",
                    Process.THREAD_PRIORITY_FOREGROUND);
            handlerThread.start();

            sHandler = new QueuedWorkHandler(handlerThread.getLooper());
        }
        return sHandler;
    }
}
private static class QueuedWorkHandler extends Handler {
    static final int MSG_RUN = 1;

    QueuedWorkHandler(Looper looper) {
        super(looper);
    }

    public void handleMessage(Message msg) {
        if (msg.what == MSG_RUN) {
            processPendingWork();
        }
    }
}

private static void processPendingWork() {
    synchronized (sProcessingWork) {
        LinkedList<Runnable> work;
        synchronized (sLock) {
            work = (LinkedList<Runnable>) sWork.clone();
            sWork.clear();
            // Remove all msg-s as all work will be processed now
            getHandler().removeMessages(QueuedWorkHandler.MSG_RUN);
        }
        if (work.size() > 0) {
            for (Runnable w : work) {
                w.run();
            }
        }
    }
}
```

apply 的通过 QueueWork 将所有的 work(Runnable) 以 List 保存起来，通过 Handler 分发给子线程处理，处理逻辑在 processPendingWork() 中

### waitToFinish

```java
// QueuedWork#waitToFinish
/**
 * Trigger queued work to be processed immediately. The queued work is processed on a separate
 * thread asynchronous. While doing that run and process all finishers on this thread. The
 * finishers can be implemented in a way to check weather the queued work is finished.
 *
 * Is called from the Activity base class's onPause(), after BroadcastReceiver's onReceive,
 * after Service command handling, etc. (so async work is never lost)
 */
public static void waitToFinish() {
    // ......
    try {
        while (true) {
            Runnable finisher;
            synchronized (sLock) {
                finisher = sFinishers.poll();
            }
            if (finisher == null) {
                break;
            }
            finisher.run();
        }
    } finally {
        sCanDelay = true;
    }
    // .....
}
```

看这段源码的注释就知道，框层架确保在切换状态之前完成使用 apply（）方法 正在执行磁盘写入的动作会在 `Activiy的 onPause()`、`BroadcastReceiver的onReceive()以` 及 `Service的onStartCommand()` 方法之前调用 waitToFinish 方法，从这一点也可以看出时会阻塞线程的。

## SharedPreferences 注意点

### SP 小结

1. 不要存放大的 key 和 value，会引起界面卡、频繁 GC、占用内存等等
2. 毫不相关的配置项就不要丢在一起了，文件越大读取越慢；
3. 读取频繁的 key 和不易变动的 key 尽量不要放在一起，影响速度。（如果整个文件很小，那么忽略吧，为了这点性能添加维护成本得不偿失）
4. 不要乱 edit 和 apply，尽量批量修改一次提交
5. 尽量不要存放 JSON 和 HTML，这种场景请直接使用 json
6. 不用来跨进程通信
7. 用 apply 替代 commit

#### commit 和 apply 区别

1. apply 方式提交的时候，会有一个消息延迟 `100ms` 发送，避免频繁的磁盘写入；而 commit 提交时，是直接利用 Handler 发送消息的
2. 推荐使用 apply，每次写数据都设计重新将数据写入文件，apply 具有 100ms 的延迟避免频繁写入
3. 这两个方法其实都是阻塞线程的，提交数据时都涉及调用 CountDownLatch 的 await，文件写入成功后才会调用 downLatch 方法，所以这是阻塞线程的。
4. 在 Activity#onPause，BroadcastReceiver#onReceive() 和 Service#onStartCommand 会调用 `QueueWork#waitToFinish` 同步的检测 apply 的数据是否写入完成，可能导致 ANR，

#### 不用用 sp 存储超大的 value

SharedPreference（下文简称 sp）是一种轻量级的存储方式，是它的设计所决定的：sp 在创建的时候会把整个文件全部加载进内存，如果你的 sp 文件比较大，那么会带来两个严重问题：

1. 第一次从 sp 中获取值的时候，有可能阻塞主线程，使界面卡顿、掉帧。
2. 解析 sp 的时候会产生大量的临时对象，导致频繁 GC，引起界面卡顿。
3. 这些 key 和 value 会永远存在于内存之中，占用大量内存。

#### 存储 JSON 等特殊符号很多的 value

JSON 或者 HTML 格式存放在 sp 里面的时候，需要转义，这样会带来很多&这种**特殊符号**，sp 在解析碰到这个特殊符号的时候会进行特殊的处理，引发额外的字符串拼接以及函数调用开销。而 JSON 本来就是可以用来做配置文件的，你干嘛又把它放在 sp 里面呢？多此一举。

#### 不要多次 edit 多次 apply，多次 edit 一次 apply

```java
SharedPreferences sp = getSharedPreferences("test", MODE_PRIVATE);
sp.edit().putString("test1", "sss").apply();
sp.edit().putString("test2", "sss").apply();
sp.edit().putString("test3", "sss").apply();
sp.edit().putString("test4", "sss").apply();
```

apply() 源码：

```java
public void apply() {
    final MemoryCommitResult mcr = commitToMemory();
    final Runnable awaitCommit = new Runnable() {
            public void run() {
                try {
                    mcr.writtenToDiskLatch.await();
                } catch (InterruptedException ignored) {
                }
            }
        };

    QueuedWork.add(awaitCommit);

    Runnable postWriteRunnable = new Runnable() {
            public void run() {
                awaitCommit.run();
                QueuedWork.remove(awaitCommit);
            }
        };

    SharedPreferencesImpl.this.enqueueDiskWrite(mcr, postWriteRunnable);
    notifyListeners(mcr);
}
```

注意两点，

- 第一，把一个带有 await 的 runnable 添加进了 QueueWork 类的一个队列；
- 第二，把这个写入任务通过 enqueueDiskWrite 丢给了 HandlerThread 串行执行。

到这里一切都 OK，在子线程里面写入不会卡 UI。但是，你去 ActivityThread 类的 handleStopActivity 里看一看：

```java
private void handleStopActivity(IBinder token, boolean show, int configChanges, int seq) {

    // 省略无关。。
    // Make sure any pending writes are now committed.
    if (!r.isPreHoneycomb()) {
        QueuedWork.waitToFinish();
    }

    // 省略无关。。
}

public static void waitToFinish() {
    Runnable toFinish;
    while ((toFinish = sPendingWorkFinishers.poll()) != null) {
        toFinish.run();
    }
}
```

还记得这个 toFinish 的 Runnable 是啥吗？就是上面那个 awaitCommit 它里面就一句话，等待写入线程！！如果在 Activity Stop 的时候，已经写入完毕了，那么万事大吉，不会有任何等待，这个函数会立马返回。但是，如果你使用了太多次的 apply，那么意味着写入队列会有很多写入任务，而那里就只有一个线程在写。当 App 规模很大的时候，这种情况简直就太常见了！

#### 不要用来跨进程，是否是进程安全的，为什么？

1. SharedPreferences 是线程安全的，这个毋庸置疑，你看方法内大量的 synchronized 就是用来保障数据正确性的。
2. `MODE_MULTI_PROCESS` 在某些 Android 版本上不可靠，并且未来也不会提供任何支持，要是用跨进程数据传输需要使用类似 ContentProvider 的东西

#### SP.apply 导致的 ANR(apply 调用次数过多容易引起 ANR)

在四大组件的生命周期在 app 进程跑完时会执行 `QueuedWork.waitToFinish();` 这个方法的左右是等待 QueuedWork 中所有的 awaitCommit 等待锁释放，如果 anr 允许时间内没有全部释放完，则会一直阻塞到产生 anr。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687800219906-6e4c95b4-79d5-4ede-b7d8-77da5240f4ba.png#averageHue=%23e2e5e2&clientId=u8b86f896-fffe-4&from=paste&height=481&id=u97bdb761&originHeight=721&originWidth=1305&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=775419&status=done&style=none&taskId=u9a443f02-ed6f-4935-9430-a60d6f23693&title=&width=870)

- [x] 剖析 SharedPreference apply 引起的 ANR 问题<br /><https://mp.weixin.qq.com/s/IFgXvPdiEYDs5cDriApkxQ>

## SharedPreferences 与多进程

- [ ] **SharedPreferences 在多进程中的使用及注意事项**<br /><http://zmywly8866.github.io/2015/09/09/sharedpreferences-in-multiprocess.html>
- [ ] **Android SharePreference 多进程访问问题 #135**<br /><https://github.com/android-cn/android-discuss/issues/135>
- [ ] **SharedPreference 在使用过程中有什么注意点**<br />[https://github.com/ZhaoKaiQiang/AndroidDifficultAnalysis/blob/master/09.SharedPreference在使用过程中有什么注意点？.md](https://github.com/ZhaoKaiQiang/AndroidDifficultAnalysis/blob/master/09.SharedPreference%E5%9C%A8%E4%BD%BF%E7%94%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E6%9C%89%E4%BB%80%E4%B9%88%E6%B3%A8%E6%84%8F%E7%82%B9%EF%BC%9F.md)
- [ ] <https://github.com/grandcentrix/tray>

# 数据库 Sqlite
