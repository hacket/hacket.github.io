---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# AsyncLayoutInflater

AsyncLayoutInflater用于异步布局加载

## AsyncLayoutInflater使用

```kotlin
class AsyncLayoutInflaterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val pb = ProgressBar(this)
        setContentView(pb)

        val s = System.currentTimeMillis()
        thread {
            LogUtils.logi("inflate", "thread.sleep", "模拟耗时的inflate。。。")
            SystemClock.sleep(2000)
            runOnUiThread {
                // AsyncLayoutInflater不能直接在非UI线程使用
                AsyncLayoutInflater(this@AsyncLayoutInflaterActivity)
                        .inflate(R.layout.activity_async_inflater_demo, null) { view, resid, parent ->

                            setContentView(view)
                            LogUtils.logi("inflate", "onInflateFinished", "耗时${System.currentTimeMillis() - s}ms")
                        }
            }
        }
    }
}
```

## AsyncLayoutInflater不足

1. 异步转换出来的 View 并没有被加到 parent view中，必须手动添加
2. 缓存队列默认 10 的大小限制如果超过了10个则会导致主线程的等待
3. AsyncLayoutInflater 不支持设置 LayoutInflater.Factory 或者 LayoutInflater.Factory2
4. 不能在非主线程中调用AsyncLayoutInflater，因为异步线程默认没有调用 Looper.prepare()
5. 如果在异步加载view还没有添加到parent时，做一些View操作或者依赖context的操作，容易出问题，mashi项目就出现大量这样的问题

## Ref

- [ ] Android AsyncLayoutInflater 限制及改进<https://www.jianshu.com/p/f0c0eda06ae4>
