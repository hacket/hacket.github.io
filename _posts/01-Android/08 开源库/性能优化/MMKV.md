---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
tags:
  - '#168](https://github.com/Tencent/MMKV/issues/168#issuecomment-450301083)'
---

<https://blog.csdn.net/mp624183768/article/details/128936231>

# MMKV使用

## 简单使用

## SP迁移MMKV步骤

### 所有要迁移的sp filename，可以用个数组列举出要迁移的sp filename

```kotlin
// 需要迁移MMKV的sp filename
private val xmlIds = arrayOf(
    "buyers_guide",
    "SP_AROUTER_CACHE",
)
```

### 不能迁移到mmkv的sp，如使用到mmkv未实现的getAll方法，可以弄个blacklist

1. WebViewProfilePrefsDefault
2. WebViewChromiumPrefs

```kotlin
// 不能使用mmkv的SharedPreferences
private val blackList = arrayOf(
    "WebViewProfilePrefsDefault",  // 使用到mmkv未实现的getAll方法。
    "WebViewChromiumPrefs",
    "BraintreeApi",  // BraintreeSharedPreferences 用到 androidx.security.crypto.EncryptedSharedPreferences
    // 华为相关sp
    "move_to_de_records",
    "aaid",
    "push_notify_flag",
    "grs_move2DE_records",
    "share_pre_grs_conf_",
    "share_pre_grs_services_",
    "hms_"
)
```

### 只需要迁移一次，需要保存迁移的标记

### 重写Application和Activity的getSharedPreferences，用mmkv

1. Application

```kotlin
open class BaseApplication : Application() {
    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        MMKVUtils.init(base);
    }
    override fun getSharedPreferences(name: String, mode: Int): SharedPreferences? {
        return MMKVUtils.replaceSharedPreferences(
            applicationContext,
            super.getSharedPreferences(name, mode),
            name
        )
    }
}
```

2. Activity

```kotlin
class Activity {
	@Override
    public SharedPreferences getSharedPreferences(String name, int mode) {
        return MMKVUtils.replaceSharedPreferences(getApplicationContext(), super.getSharedPreferences(name, mode), name);
    }
}
```

### 迁移失败后返回NoMainThreadWriteSharedPreferences

#### NoMainThreadWriteSharedPreferences

NoMainThreadWriteSharedPreferences是用来避免ANR的SharedPreferences，子线程更新数据

```kotlin
/**
 *
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

注意：替换掉系统的SP，注意null的问题；我们有个项目用自己的SP，用ConcurrentHashMap替换掉HashMap，由于ConcurrentHashMap的key和value不能为null，容易导致很隐蔽的一些NPE问题

### sp迁移到mmkv时，mmkv存储时类型是擦除的，所以最好是带上类型存储，否则getAll出来的数据不知道是什么类型

在初次使用mmvk时就做好包装，带类型存储，所以避免了后期无法迁移。<br />具体见`MMKV存在的问题→MMKV不支持getAll`

### 完整工具类

- MMKVUtils

```kotlin
object MMKVUtils {

    const val TAG = "mmkv"
    private const val KEY_IMPORT = "has_old_sp_data_import"

    private const val delOldSpData = false // 是否删除旧的SharedPreferences数据

    private var hasImport = false

    // 需要迁移MMKV的sp filename
    private val xmlIds = arrayOf(
        "buyers_guide",
        "SP_AROUTER_CACHE",
    )

    // 不能使用mmkv的SharedPreferences
    private val blackList = arrayOf(
        "WebViewProfilePrefsDefault",  // 使用到mmkv未实现的getAll方法。
        "WebViewChromiumPrefs",
        "BraintreeApi",  // BraintreeSharedPreferences 用到 androidx.security.crypto.EncryptedSharedPreferences
        // 华为相关sp
        "move_to_de_records",
        "aaid",
        "push_notify_flag",
        "grs_move2DE_records",
        "share_pre_grs_conf_",
        "share_pre_grs_services_",
        "hms_"
    )

    /**
     * 是否已经纳入mmkv管理
     * @param name
     * @return
     */
    fun contains(context: Context, name: String): Boolean {
        if (name == getDefaultId(context)) return true
        for (item in xmlIds) {
            if (item == name) {
                return true
            }
        }
        return false
    }

    fun isAvailable(name: String): Boolean {
        for (item in blackList) {
            if (name.contains(item)) {
                return false
            }
        }
        return true
    }

    /**
     * 尽量提前初始化，最好是放到Application.attachBaseContext中，否则其他用了sp的地方会报错，因为在Activity和Application会替换掉系统的SharedPreferences导致出错
     */
    @JvmStatic
    fun init(context: Context) {
        val logLevel =
            if (BuildConfig.DEBUG) MMKVLogLevel.LevelDebug else MMKVLogLevel.LevelNone // 日志开关

        val path: String = MMKV.initialize(
            context,
            { libName -> ReLinker.loadLibrary(context, libName) },
            logLevel
        )
        Log.d(TAG, "MMKV存放路径: $path")
        // 迁移数据
        Log.d(TAG, ">>>>>>MMKV开始迁移<<<<<<")
        val start = System.currentTimeMillis()
        hasImport = getBoolean(getDefaultId(context), KEY_IMPORT, false)
        if (!hasImport) {
            importDefaultSharedPreferences(context, getDefaultId(context))
            importSharedPreferences(context)
            putBoolean(getDefaultId(context), KEY_IMPORT, true)
        }
        val cost = System.currentTimeMillis() - start
        Log.d(TAG, ">>>>>>MMKV迁移结束<<<<<< 总耗时：" + cost + "ms")
    }

    /**
     * 遍历数组：迁移数据到mmkv
     * @param context
     */
    private fun importSharedPreferences(context: Context) {
        try {
            for (id in xmlIds) {
                val prefs = context.getSharedPreferences(id, Context.MODE_PRIVATE)
                if (prefs.all.isNotEmpty()) {
                    val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
                    if (mmkv != null) {
                        mmkv.importFromSharedPreferences(prefs) // 迁移旧数据
                        if (delOldSpData) {
                            prefs.edit().clear().apply() // 清空旧数据
                        }
                    }
                }
            }
        } catch (e: Throwable) {
            Log.d(TAG, "数据迁移失败：" + e.message)
        }
    }


    /**
     * 迁移DefaultSharedPreferences数据，特殊处理
     *
     * @param context
     * @param id
     */
    private fun importDefaultSharedPreferences(context: Context, id: String) {
        try {
            val prefs = context.getSharedPreferences(id, Context.MODE_PRIVATE)
            val prefsKeySize = prefs.all.size
            if (prefsKeySize > 0) {

                val originMmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
                val mmkv = MMKVWrapper(originMmkv)
                if (mmkv != null) {
                    // 判断是否已经迁移
                    if (mmkv.allKeys() != null) {
                        val mmkvKeySize = mmkv.allKeys()!!.size
                        if (mmkvKeySize > prefsKeySize && prefsKeySize < 10) {
                            return
                        }
                    }
                    // 迁移旧数据
                    mmkv.importFromSharedPreferences(prefs)
                    if (delOldSpData) {
                        // 清除旧数据
                        val editor = prefs.edit()
                        for (mutableEntry in prefs.all) {
                            val key = mutableEntry.key
                            val value = mutableEntry.value
                            if (key.startsWith("com.facebook.appevents.SessionInfo")
                                || key.startsWith("IABUSPrivacy_String")
                                || key.startsWith("variations_seed_native_stored")
                            ) {
                                Log.d(
                                    TAG,
                                    "保留的三方key-value：key = $key,value = $value"
                                )
                            } else {
                                editor.remove(key)
                            }
                        }
                        editor.apply()
                    }
                }
            }
        } catch (e: Throwable) {
            Log.d(TAG, "数据迁移失败：" + e.message)
        }
    }

    /**
     * 设置字符串
     *
     * @param id
     * @param key
     * @param value
     */
    @JvmStatic
    fun putString(id: String, key: String, value: String?) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取字符串
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    @JvmStatic
    fun getString(id: String, key: String, defValue: String?): String? {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return if (mmkv != null) mmkv.decodeString(key, defValue) else defValue
    }

    /**
     * 保存Parcelable对象
     *
     * @param id
     * @param key
     * @param value
     */
    fun putParcelable(id: String, key: String, value: Parcelable?) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取Parcelable对象
     *
     * @param id
     * @param key
     * @return
     */
    fun <T : Parcelable?> getParcelable(id: String, key: String, tClass: Class<T>): T? {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeParcelable(key, tClass)
    }

    /**
     * 设置整型数值
     *
     * @param id
     * @param key
     * @param value
     */
    fun putInt(id: String, key: String, value: Int) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取整型数值
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    fun getInt(id: String, key: String, defValue: Int): Int {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeInt(key, defValue) ?: defValue
    }


    /**
     * 设置bool值
     *
     * @param id
     * @param key
     * @param value
     */
    @JvmStatic
    fun putBoolean(id: String, key: String, value: Boolean) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取bool值
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    @JvmStatic
    fun getBoolean(id: String, key: String, defValue: Boolean): Boolean {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeBool(key, defValue) ?: defValue
    }


    /**
     * 设置long值
     *
     * @param id
     * @param key
     * @param value
     */
    fun putLong(id: String, key: String, value: Long) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取long值
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    fun getLong(id: String, key: String, defValue: Long): Long {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeLong(key, defValue) ?: defValue
    }


    /**
     * 设置float值
     *
     * @param id
     * @param key
     * @param value
     */
    fun putFloat(id: String, key: String, value: Float) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取float值
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    fun getFloat(id: String, key: String, defValue: Float): Float {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeFloat(key, defValue) ?: defValue
    }

    /**
     * 设置double值
     *
     * @param id
     * @param key
     * @param value
     */
    fun putDouble(id: String, key: String, value: Double) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.encode(key, value)
    }

    /**
     * 获取double值
     *
     * @param id
     * @param key
     * @param defValue
     * @return
     */
    fun getDouble(id: String, key: String, defValue: Double): Double {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv?.decodeDouble(key, defValue) ?: defValue
    }


    /**
     * 设置字符串集合
     *
     * @param id
     * @param key
     * @param values
     */
    fun putStringSet(id: String, key: String, values: Set<String?>?) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.putStringSet(key, values)
    }


    /**
     * 获取字符串集合
     *
     * @param id
     * @param key
     * @param defValues
     */
    fun getStringSet(id: String, key: String, defValues: Set<String?>?): Set<String?>? {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return if (mmkv != null) mmkv.getStringSet(key, defValues) else defValues
    }

    /**
     * 根据Key移除value
     *
     * @param id
     * @param key
     */
    fun remove(id: String, key: String) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.removeValueForKey(key)
    }

    /**
     * 根据多个Key移除value
     *
     * @param id
     * @param arrKeys
     */
    fun removeKeys(id: String, arrKeys: Array<String?>) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.removeValuesForKeys(arrKeys)
    }

    /**
     * 根据ID清除所有数据
     *
     * @param id
     */
    fun clearAll(id: String) {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        mmkv?.clearAll()
    }

    /**
     * 判断key是否存在
     *
     * @param id
     * @param key
     * @return
     */
    fun contains(id: String, key: String): Boolean {
        val mmkv = MMKV.mmkvWithID(id, MMKV.MULTI_PROCESS_MODE)
        return mmkv != null && mmkv.contains(key)
    }

    private var defaultId: String = ""

    /**
     * 获取默认SharedPreferences_xml名称
     *
     * @return sp id
     */
    @JvmStatic
    fun getDefaultId(context: Context): String {
        if (defaultId.isBlank()) {
            defaultId = context.packageName + "_preferences"
        }
        return defaultId
    }

    /**
     * 替换掉系统的SharedPreferences
     */
    @JvmStatic
    fun replaceSharedPreferences(
        context: Context,
        oldSP: SharedPreferences,
        name: String
    ): SharedPreferences? {
//        return NoMainThreadWriteSharedPreferences.getInstance(super.getSharedPreferences(name, mode), name);
        return if (!hasImport && contains(context, name)
            || !isAvailable(name)
        /** 迁移数据时需要返回默认的SP  */
        ) {
            NoMainThreadWriteSharedPreferences.getInstance(oldSP, name)
        } else {
            if (!getBoolean(getDefaultId(context), name, false)) {
                try {
                    Log.d(TAG, ">>>>>>MMKV开始迁移<<<<<< : $name")
                    val start = System.currentTimeMillis()
                    if (oldSP.all.isNotEmpty()) {
                        val mmkv = MMKV.mmkvWithID(name, MMKV.MULTI_PROCESS_MODE)
                        if (mmkv != null) {
                            mmkv.importFromSharedPreferences(oldSP) // 迁移旧数据
                            if (delOldSpData) {
                                oldSP.edit().clear().apply() // 清空旧数据
                            }
                        }
                    }
                    val cost = System.currentTimeMillis() - start
                    Log.d(TAG, name + "： >>>>>>MMKV迁移结束<<<<<< 总耗时：" + cost + "ms")
                    putBoolean(getDefaultId(context), name, true)
                    MMKVWrapper(MMKV.mmkvWithID(name, MMKV.MULTI_PROCESS_MODE))
                } catch (e: Exception) {
                    e.printStackTrace()
                    Log.d(
                        TAG,
                        "MMKV数据迁移失败，退回NoMainThreadWriteSharedPreferences：" + e.message
                    )
                    NoMainThreadWriteSharedPreferences.getInstance(oldSP, name)
                }
            } else {
                Log.d(TAG, ">>>>>> MMKV已经迁移了，直接用MMKV <<<<<< : $name")
                MMKVWrapper(MMKV.mmkvWithID(name, MMKV.MULTI_PROCESS_MODE))
            }
        }
    }

}
```

- NoMainThreadWriteSharedPreferences

```kotlin
/**
 *
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

# MMKV存在的问题

## 替换系统SP

1. 注意NPE的问题

## MMKV不支持的API

### registerOnSharedPreferenceChangeListener/unregisterOnSharedPreferenceChangeListener不支持

这2个API在mmkv中，会抛出异常？<br />mmkv未设计数据变化监听，推荐开发者用eventbus这样的框架来实现；如果这样设计很糟糕

- [x] [registerOnSharedPreferenceChangeListener is not supported ](https://github.com/Tencent/MMKV/issues/49)

### MMKV不支持getAll

mmkv存储的时候，类型是擦除的

- [ ] [mmkv已知键的情况下 如何确定值的类型/如何正确返回值](https://github.com/Tencent/MMKV/discussions/1080)

#### 解决1：用allKeys()替代getAll()

- use allKeys() instead, getAll() not implement because type-erasure inside mmkv
- [x] [what to do with Compatibility of getAll() on Android? #168](https://github.com/Tencent/MMKV/issues/168#issuecomment-450301083)

存在的问题：mmkv存储的时候进行的类型擦除，取出来的值不知道是什么类型

#### 解决2：寻找规律，自己判断类型

```kotlin
private fun getObjectValue2(mmkv: MMKV, key: String): Any? {
    // 因为其他基础类型value会读成空字符串,所以不是空字符串即为string or string-set类型
    val str = mmkv.decodeString(key)
    if (!TextUtils.isEmpty(str)) {
        // 判断 string or string-set
        return if (str!![0].code == 5) { // mmkv v1.2.15 ENQ 对应ANSI控制字符，表示询问字符，用于数据通信中询问对方是否准备好，或者用于空操作
            val strings = mmkv.decodeStringSet(key)
            Log.d(
                TAG,
                "MMKVFlipperPlugin -> getObjectValue2 判定为Set<String>, key=$key, value=$strings"
            )
            strings
        } else {
            Log.d(
                TAG,
                "MMKVFlipperPlugin -> getObjectValue2 判定为String, key=$key, value=$str"
            )
            str
        }
    }

    // float double类型可通过string-set配合判断：
    // 通过数据分析可以看到类型为float或double时string类型为空字符串且string-set类型读出为null，此时float和double有值
    // float有值时，decodeDouble为0.0；其他情况为double
    val set = mmkv.decodeStringSet(key)
    if (str == null && set == null) {
        // float和double有值时，如果是float，decodeDouble会为0
        val valueFloat = mmkv.decodeFloat(key)
        val valueDouble = mmkv.decodeDouble(key)

        return if (valueDouble == 0.0) { // 是float
            Log.d(
                TAG,
                "MMKVFlipperPlugin -> getObjectValue2 判断为Float, key=$key, valueFloat=$valueDouble"
            )
            valueFloat
        } else {
            Log.d(
                TAG,
                "MMKVFlipperPlugin -> getObjectValue2 判断为Double, key=$key, valueDouble=$valueDouble"
            )
            valueDouble
        }
    }

    // int long bool 类型的处理放在一起, int类型1和0等价于bool类型true和false
    // 判断long或int类型时, 如果数据长度超出int的最大长度, 则long与int读出的数据不等, 可确定为long类型
    val valueInt = mmkv.decodeInt(key)
    val valueLong = mmkv.decodeLong(key)

    // 如果int/long/bool都为0，说明没有值，全部0.0F存储，可能造成String类型在Flipper中编辑不了
    if (valueInt == 0 && valueLong == 0L) {
        Log.d(
            TAG,
            "MMKVFlipperPlugin -> getObjectValue2 判断为Float, 如果int/long/bool都为0，说明没有值，全部以0.0存储 key=$key, value=$valueInt"
        )
        return 0.0F
    }
    Log.v(
        TAG,
        "MMKVFlipperPlugin -> getObjectValue2 key=$key, valueInt=$valueInt, valueLong=$valueLong"
    )
    return if (valueInt.toLong() != valueLong) {
        Log.d(
            TAG,
            "MMKVFlipperPlugin -> getObjectValue2 判断为long, key=$key, valueLong=$valueLong"
        )
        valueLong
    } else {
        Log.d(
            TAG,
            "MMKVFlipperPlugin -> getObjectValue2 判断为int, key=$key, valueInt=$valueInt"
        )
        valueInt
    }
}
```

- [ ] [微信开源库MMKV遍历读取存储的所有key以及对应的value方法](https://blog.csdn.net/xyq046463/article/details/85329322)（旧版本的，新版本不适用）

#### 解决3：sp升级到mmkv时，在key上带类型存储

具体的实现可参考这个：[在初次使用mmvk时就做好包装，所以避免了后期无法迁移。](https://github.com/Tencent/MMKV/issues/197#issuecomment-1150944992)

- [ ] [MMKV缺陷：不支持getAll?(江同学)](https://juejin.cn/post/6939473558259105805)
- [ ] [what to do with Compatibility of getAll() on Android?](https://github.com/Tencent/MMKV/issues/197)

#### 解决4：带类型存储，flipper支持getAll，自动更新

1. 存储时，key带类型存储(`key@类型`)；需要封装mmkv
2. 封装支持自动更新

完善：<https://github.com/hacket/mmkv-flipper><br />参考：<https://github.com/porum/KVCompat>

## MMKV v1.2.15类型擦除，不同类型直接decode测试

### String

- test_string="" 空串

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352059884-913be708-0ed4-4075-9780-9dcea8c9884b.png#averageHue=%23393939&clientId=uf52266ec-7e1d-4&from=paste&height=172&id=ufceddee7&originHeight=344&originWidth=1020&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64228&status=done&style=none&taskId=u0996d741-bd81-4540-b92b-78c3e391f34&title=&width=510)

- test_string = "hacket"

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396499748-db2a2bea-9eb8-49fa-83de-6fcded3e5d83.png#averageHue=%23373737&clientId=u150cdf92-f16f-4&from=paste&height=184&id=u09e10a76&originHeight=368&originWidth=1124&originalType=binary&ratio=2&rotation=0&showTitle=false&size=69338&status=done&style=none&taskId=u85e9dde0-8ff7-43bb-a5a7-e6b486e45c5&title=&width=562)

### Set<String>

- test_string_set = setOf()

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352711219-92a988d4-7ccb-4de9-81e4-67c2044f4bd4.png#averageHue=%23393939&clientId=uf52266ec-7e1d-4&from=paste&height=169&id=u5a32b521&originHeight=338&originWidth=1058&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66043&status=done&style=none&taskId=u1fd1820b-a9db-4d01-bac6-30c42a6a978&title=&width=529)

- test_string_set = setOf<String>("hello","world")

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396534781-7a8c77de-8ea9-4119-b58d-24ef2edb293a.png#averageHue=%23383838&clientId=u150cdf92-f16f-4&from=paste&height=175&id=uecf75333&originHeight=350&originWidth=1294&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78013&status=done&style=none&taskId=u8db1b900-e739-4cc8-bfa4-48b2cde3d48&title=&width=647)

### bool

- <br />
- test_bool = true

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396349603-34536cdc-77a7-4d0c-84db-703bffad0546.png#averageHue=%23383838&clientId=u150cdf92-f16f-4&from=paste&height=179&id=u950fdd3c&originHeight=358&originWidth=964&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61986&status=done&style=none&taskId=ue164683d-39b6-4ae9-b0d2-06d845e21d8&title=&width=482)

### int

- test_init = 0

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352222987-a8607d0c-85d9-4105-889c-320e1e3d5fd1.png#averageHue=%23383838&clientId=uf52266ec-7e1d-4&from=paste&height=176&id=ufa4a7607&originHeight=352&originWidth=968&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61180&status=done&style=none&taskId=u1c315e03-8ef9-4af4-8e5f-83702d4cf57&title=&width=484)

- test_init = 110

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396271168-47943d71-13da-43d6-92ba-b2c0bcaf5a5b.png#averageHue=%23373737&clientId=u150cdf92-f16f-4&from=paste&height=178&id=u333f506e&originHeight=356&originWidth=1022&originalType=binary&ratio=2&rotation=0&showTitle=false&size=61983&status=done&style=none&taskId=udd818b68-d25c-4e51-bb8d-d2c388689f5&title=&width=511)

### long

- test_long = 0L

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352160755-a06d9772-88f3-4d4e-a5e7-e5b167bfe8e9.png#averageHue=%23383838&clientId=uf52266ec-7e1d-4&from=paste&height=181&id=u28c57c77&originHeight=362&originWidth=982&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63460&status=done&style=none&taskId=u7ff5e91f-ae5d-4425-9d46-727b78e8dda&title=&width=491)

- test_long = 111110000L

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396236079-7c648600-0697-4618-b6a5-51bf3c05ff1b.png#averageHue=%23393939&clientId=u150cdf92-f16f-4&from=paste&height=177&id=u64c1d47d&originHeight=354&originWidth=960&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64116&status=done&style=none&taskId=uaca8bf8a-f285-4acf-bdea-60f76c7b6f8&title=&width=480)

### float

- test_float = 0.0F

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352134530-b868dfe1-eb72-4275-9597-e64247d10d61.png#averageHue=%23383838&clientId=uf52266ec-7e1d-4&from=paste&height=174&id=lE1P9&originHeight=348&originWidth=1020&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62940&status=done&style=none&taskId=u09eeee09-98e9-46d4-b993-a3c0087a46e&title=&width=510)

- test_float = 110.110f

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396126596-40d21053-6600-4aa4-b7b3-e911cb81811a.png#averageHue=%23383838&clientId=u150cdf92-f16f-4&from=paste&height=176&id=u29058cc4&originHeight=352&originWidth=1008&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63331&status=done&style=none&taskId=u774558c0-41c5-4d89-bf90-08bff0fa6c8&title=&width=504)

### double

- test_double = 0.0

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701352108786-75021a91-6e5c-48ca-bdfb-e6692753372f.png#averageHue=%23383838&clientId=uf52266ec-7e1d-4&from=paste&height=176&id=ZctWX&originHeight=352&originWidth=1012&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63540&status=done&style=none&taskId=uffeaa5c9-39cb-4f11-97b2-0d4fa677924&title=&width=506)

- test_double = 1111100000.111000

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701396144397-2bf965cf-9d93-4337-b9bf-ab9269def0c1.png#averageHue=%23373737&clientId=u150cdf92-f16f-4&from=paste&height=178&id=u8519f97e&originHeight=356&originWidth=1176&originalType=binary&ratio=2&rotation=0&showTitle=false&size=69592&status=done&style=none&taskId=u4bd17872-0e76-4465-9801-f7e5edce4c4&title=&width=588)

旧版本解决：

- [ ] [微信开源库MMKV遍历读取存储的所有key以及对应的value方法](https://blog.csdn.net/xyq046463/article/details/85329322)

测试的版本1.2.15，如果是bool，decodeDouble/decodeFloat返回0.0了，不再是一个`1.4E-45`或`1.4E-45`
