---
date created: 2024-08-06 23:54
date updated: 2024-12-24 00:38
dg-publish: true
---

# ANR常见类型

1. **InputDispatching Timeout **5秒内无法响应屏幕触摸事件或键盘输入事件
2. **BroadcastQueue Timeout** 在执行前台广播（BroadcastReceiver）的onReceive()函数时10秒没有处理完成，后台为60秒。
3. **Service Timeout** 前台20s，后台200s；startForeground超时10s
4. **ContentProvider Timeout **内容提供者,在publish过超时10s（少见）

# ANR原理？

- [ ] [理解Android ANR的触发原理](http://gityuan.com/2016/07/02/android-anr/)

触发ANR的过程可分为三个步骤：**埋炸弹,、拆炸弹,、引爆炸弹**<br />ANR（Application Not Responding）的监测原理本质上是消息机制，设定一个delay消息，超时未被移除则触发ANR。具体逻辑处理都在system server端，包括发送超时消息，移除超时消息，处理超时消息以及ANR弹框展示等；对于app而言，触发ANR的条件是主线程阻塞。

## 1、Service Timeout

Service Timeout是位于`ActivityManager`线程中的`AMS.MainHandle`r收到`SERVICE_TIMEOUT_MSG`消息时触发。<br />对于Service有两类:

1. 对于前台服务，则超时为`SERVICE_TIMEOUT = 20s`；
2. 对于后台服务，则超时为`SERVICE_BACKGROUND_TIMEOUT = 200s`

- **埋炸弹  **在system_server进程ActiveServices.realStartServiceLocked()调用的过程会埋下一颗炸弹, 超时没有启动完成则会爆炸

```java
// How long we wait for a service to finish executing.
static final int SERVICE_TIMEOUT = 20 * 1000 * Build.HW_TIMEOUT_MULTIPLIER;

// How long we wait for a service to finish executing.
static final int SERVICE_BACKGROUND_TIMEOUT = SERVICE_TIMEOUT * 10;

private void realStartServiceLocked(ServiceRecord r, ProcessRecord app,
            IApplicationThread thread, int pid, UidRecord uidRecord, boolean execInFg,
            boolean enqueueOomAdj) throws RemoteException {
    bumpServiceExecutingLocked(r, execInFg, "create", null /* oomAdjReason */);
    // ...
}
private boolean bumpServiceExecutingLocked(ServiceRecord r, boolean fg, String why,
            @Nullable String oomAdjReason) {
    scheduleServiceTimeoutLocked(r.app);
    // ...
}
void scheduleServiceTimeoutLocked(ProcessRecord proc) {
    if (proc.mServices.numberOfExecutingServices() == 0 || proc.getThread() == null) {
        return;
    }
    Message msg = mAm.mHandler.obtainMessage(
        ActivityManagerService.SERVICE_TIMEOUT_MSG);
    msg.obj = proc;
    mAm.mHandler.sendMessageDelayed(msg, proc.mServices.shouldExecServicesFg()
                                    ? SERVICE_TIMEOUT : SERVICE_BACKGROUND_TIMEOUT);
}
```

- **拆炸弹  **主线程handleCreateService()拆除炸弹

```java
// ActivityThread.java
private void handleCreateService(CreateServiceData data) {
    // ... 
    ActivityManager.getService().serviceDoneExecuting(data.token, SERVICE_DONE_EXECUTING_ANON, 0, 0);
}
// ActivityManagerService.java
public void serviceDoneExecuting(IBinder token, int type, int startId, int res) {
    synchronized(this) {
        // ...
        mServices.serviceDoneExecutingLocked((ServiceRecord) token, type, startId, res, false);
    }
}
// ActiveServices.java
private void serviceDoneExecutingLocked(ServiceRecord r, boolean inDestroying, boolean finishing) {
    ...
    if (r.executeNesting <= 0) {
        if (r.app != null) {
            r.app.execServicesFg = false;
            r.app.executingServices.remove(r);
            if (r.app.executingServices.size() == 0) {
                // 当前服务所在进程中没有正在执行的service
                mAm.mHandler.removeMessages(ActivityManagerService.SERVICE_TIMEOUT_MSG, r.app);
        ...
    }
    ...
}
```

- **引爆炸弹**

```java
// MainHandler.java
final class MainHandler extends Handler {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case SERVICE_TIMEOUT_MSG: {
                mServices.serviceTimeout((ProcessRecord)msg.obj);
            } break;
            // ...
        }
        // ...
    }
}

// ActiveServices.java
void serviceTimeout(ProcessRecord proc) {
    if (anrMessage != null) {
        // 当存在timeout的service，则执行appNotResponding
        mAm.mAnrHelper.appNotResponding(proc, anrMessage);
    }
}
```

# 如何排除ANR？

## ANR分析办法一：Log

产生ANR后，看下Log：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1655226135328-bdb16b16-01f9-41f4-8789-ad7fb2ad0b5c.png#averageHue=%23263337&clientId=u1f98a24e-a3ad-4&from=paste&id=u8ec2d38c&originHeight=67&originWidth=1200&originalType=url&ratio=1&rotation=0&showTitle=false&size=120613&status=done&style=none&taskId=u3be15ee9-4d96-4e76-81c5-5cee69c848e&title=)<br />可以看到logcat清晰地记录了ANR发生的时间，以及线程的tid和一句话概括原因：WaitingInMainSignalCatcherLoop，大概意思为主线程等待异常。<br />最后一句The application may be doing too much work on its main thread.告知可能在主线程做了太多的工作。

## ANR分析办法二：traces.txt

### 拉取trace文件

1. 旧版本系统 `/data/anr/traces.txt`
2. 新版本系统  `/data/anr/anr_xxx`多个anr文件，也可以使用adb bugreport  xxx拉取

# ANR案例

## SP ANR

- [ ] [SharedPreferences ANR 总结](https://zhuanlan.zhihu.com/p/152623807)
- [ ] [今日头条 ANR 优化实践系列 - 告别 SharedPreference 等待](https://mp.weixin.qq.com/s/kfF83UmsGM5w43rDCH544g)
- [ ] [SharedPreferences ANR问题分析 & Android8.0的优化](https://juejin.cn/post/6844904033820377096)

### 主线程加载大文件会ANR

### Sp 主线程 getXX 方法会 ANR

### Sp 主线程调用 commit 方法 ANR

### SharedPreferences apply

案例场景复现：连送礼物过程中频繁更新免费礼物剩余个数、钻石余额，均存储于SharedPreference，每个put操作并没有合并，都是一次完整的文件IO，即使从commit改成apply，也只是把写文件操作放到队列QueuedWork里，在ActivityThread 的 handlePauseActivity、handleStopActivity 等方法中会等待该队列执行完毕，导致连送大量礼物过程中切App触发ANR（优化为连送中更新内存，结束才更新文件）<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1654617864595-282d2b7c-ca78-4147-bd6c-84c978f4b46d.png#averageHue=%23e3e6e4&clientId=u0c647ab8-1689-4&from=paste&height=551&id=u1d1f6f33&originHeight=827&originWidth=1437&originalType=binary&ratio=1&rotation=0&showTitle=false&size=926786&status=done&style=none&taskId=u859b5363-3b0d-47a9-9d66-f738b8ff6e1&title=&width=958)<br />难点：ANR报错都是在系统路径。可以看到调用了`QueueWork.java`

### SP ANR解决

#### memory Sp

用于解决sp在主线程写，activity/service start/stop生命周期回调时需要等待，导致的ANR问题

```kotlin
/**
 * https://gist.github.com/tprochazka/d91d89ec54bd6c3c1cb46f62faf3c12c
 *
 * ANR free implementation of SharedPreferences.
 *
 * Fast fix for ANR caused by writing all non written changes on main thread during activity/service start/stop.
 *
 * Disadvantage of current implementation:
 *  - OnSharedPreferenceChangeListener is called after all changes are written to disk.
 *  - If somebody will call edit() apply() several times after each other it will also several times write whole prefs file.
 *
 *  Usage:
 *
 *  Override this method in your Application class.
 *
 *  public SharedPreferences getSharedPreferences(String name, int mode) {
 *      return NoMainThreadWriteSharedPreferences.getInstance(super.getSharedPreferences(name, mode), name);
 *  }
 *
 *  You need to override also parent activity, because if somebody will use activity context instead
 *  of the application one, he will get a different implementation, you can do something like
 *
 *  public SharedPreferences getSharedPreferences(String name, int mode) {
 *      return getApplicationContext().getSharedPreferences(name, mode);
 *  }
 *
 * @author Tomáš Procházka (prochazka)
 */
@RequiresApi(11)
class NoMainThreadWriteSharedPreferences private constructor(
    private val sysPrefs: SharedPreferences,
    val name: String
) :
SharedPreferences {

    private val preferencesCache: MutableMap<String, Any?> = HashMap()

    companion object {
        private val executor: ExecutorService = Executors.newSingleThreadExecutor()
        private val INSTANCES: MutableMap<String, NoMainThreadWriteSharedPreferences> = HashMap()

        @JvmStatic
        fun getInstance(sharedPreferences: SharedPreferences, name: String): SharedPreferences {
            return INSTANCES.getOrPut(
                name,
                { NoMainThreadWriteSharedPreferences(sharedPreferences, name) })
        }

        /**
         * Remove all instances for testing purpose.
         */
        @VisibleForTesting
        @JvmStatic
        fun reset() {
            INSTANCES.clear()
        }
    }

    init {
        /**
         * I will think about it if there is no synchronization issue. But generally, I think that it will bring no difference. Because system shared preference itself loading whole properties file to memory anyway. So preferencesCache.putAll(sysPrefs.all) is just an in-memory operation that will be much faster than loading and parsing files from the storage.
         */
        preferencesCache.putAll(sysPrefs.all)
    }

    override fun contains(key: String?) = preferencesCache[key] != null

    override fun getAll() = HashMap(preferencesCache)

    override fun getBoolean(key: String, defValue: Boolean): Boolean {
        return preferencesCache[key] as Boolean? ?: defValue
    }

    override fun getInt(key: String, defValue: Int): Int {
        return preferencesCache[key] as Int? ?: defValue
    }

    override fun getLong(key: String, defValue: Long): Long {
        return preferencesCache[key] as Long? ?: defValue
    }

    override fun getFloat(key: String, defValue: Float): Float {
        return preferencesCache[key] as Float? ?: defValue
    }

    override fun getStringSet(key: String, defValues: MutableSet<String>?): MutableSet<String>? {
        @Suppress("UNCHECKED_CAST")
        return preferencesCache[key] as MutableSet<String>? ?: defValues
    }

    override fun getString(key: String, defValue: String?): String? {
        return preferencesCache[key] as String? ?: defValue
    }

    override fun edit(): SharedPreferences.Editor {
        return Editor(sysPrefs.edit())
    }

    override fun registerOnSharedPreferenceChangeListener(listener: SharedPreferences.OnSharedPreferenceChangeListener) {
        sysPrefs.registerOnSharedPreferenceChangeListener(listener)
    }

    override fun unregisterOnSharedPreferenceChangeListener(listener: SharedPreferences.OnSharedPreferenceChangeListener) {
        sysPrefs.unregisterOnSharedPreferenceChangeListener(listener)
    }

    inner class Editor(private val sysEdit: SharedPreferences.Editor) : SharedPreferences.Editor {

        private val modifiedData: MutableMap<String, Any?> = HashMap()
        private var keysToRemove: MutableSet<String> = HashSet()
        private var clear = false

        override fun commit(): Boolean {
            submit()
            return true
        }

        override fun apply() {
            submit()
        }

        private fun submit() {
            synchronized(preferencesCache) {
                storeMemCache()
                queuePersistentStore()
            }
        }

        private fun storeMemCache() {
            if (clear) {
                preferencesCache.clear()
                clear = false
            } else {
                preferencesCache.keys.removeAll(keysToRemove)
            }
            keysToRemove.clear()
            preferencesCache.putAll(modifiedData)
            modifiedData.clear()
        }

        private fun queuePersistentStore() {
            try {
                executor.submit {
                    sysEdit.commit()
                }
            } catch (ex: Exception) {
                Log.e(
                    "NoMainThreadWritePrefs",
                    "NoMainThreadWriteSharedPreferences.queuePersistentStore(), submit failed for $name"
                )
            }
        }

        override fun remove(key: String): SharedPreferences.Editor {
            keysToRemove.add(key)
            modifiedData.remove(key)
            sysEdit.remove(key)
            return this
        }

        override fun clear(): SharedPreferences.Editor {
            clear = true
            sysEdit.clear()
            return this
        }

        override fun putLong(key: String, value: Long): SharedPreferences.Editor {
            modifiedData[key] = value
            sysEdit.putLong(key, value)
            return this
        }

        override fun putInt(key: String, value: Int): SharedPreferences.Editor {
            modifiedData[key] = value
            sysEdit.putInt(key, value)
            return this
        }

        override fun putBoolean(key: String, value: Boolean): SharedPreferences.Editor {
            modifiedData[key] = value
            sysEdit.putBoolean(key, value)
            return this
        }

        override fun putStringSet(
            key: String,
            values: MutableSet<String>?
                ): SharedPreferences.Editor {
            modifiedData[key] = values
            sysEdit.putStringSet(key, values)
            return this
        }

        override fun putFloat(key: String, value: Float): SharedPreferences.Editor {
            modifiedData[key] = value
            sysEdit.putFloat(key, value)
            return this
        }

        override fun putString(key: String, value: String?): SharedPreferences.Editor {
            modifiedData[key] = value
            sysEdit.putString(key, value)
            return this
        }
    }
}
```

在Application和BaseActivity中重写getSharedPreferences

```kotlin
override fun getSharedPreferences(name: String?, mode: Int): SharedPreferences {
    return NoMainThreadWriteSharedPreferences.getInstance(super.getSharedPreferences(name, mode), name!!)
}
```

#### 反射将`QueueWork`清空

## binder 调用 ANR

涉及到了 binder 通信的。

- 获取进程名 [[多进程#获取进程名]]
- 判断 app 进程在前台

#### MMKV

见mmkv

# ANR面试题

## 什么是ANR?ANR发生的原因是什么？

ANR即Application Not Responding，顾名思义就是应用程序无响应。<br />在Android中，一般情况下，四大组件均是工作在主线程中的，Android中的Activity Manager和Window Manager会随时监控应用程序的响应情况，如果因为一些耗时操作（网络请求或者IO操作）造成主线程阻塞一定时间（例如造成5s内不能响应用户事件或者BroadcastReceiver的onReceive方法执行时间超过10s），那么系统就会显示ANR对话框提示用户对应的应用处于无响应状态。

## Android中为什么主线程不会因为Looper.loop()里的死循环卡死？

见Handler的`Android中为什么主线程不会因为Looper.loop()里的死循环卡死？`

> epoll机制

## ANR了解过吗？有没有实际的ANR定位问题的经历

> 有，协程runBlocking使用不当导致的

## 线上ANR怎么搜集？高版本？

## nativepollonce ANR怎么解决？
