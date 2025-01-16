---
date created: 星期二, 十二月 24日 2024, 12:30:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:55:13 晚上
title: AsyncLayoutInflater
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [AsyncLayoutInflater]
linter-yaml-title-alias: AsyncLayoutInflater
---

# AsyncLayoutInflater

AsyncLayoutInflater 用于异步布局加载

## AsyncLayoutInflater 使用

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

## AsyncLayoutInflater 不足

1. 异步转换出来的 View 并没有被加到 parent view 中，必须手动添加
2. 缓存队列默认 10 的大小限制如果超过了 10 个则会导致主线程的等待
3. AsyncLayoutInflater 不支持设置 LayoutInflater.Factory 或者 LayoutInflater.Factory2
4. 不能在非主线程中调用 AsyncLayoutInflater，因为异步线程默认没有调用 Looper.prepare()
5. 如果在异步加载 view 还没有添加到 parent 时，做一些 View 操作或者依赖 context 的操作，容易出问题，mashi 项目就出现大量这样的问题

## Ref

- [ ] Android AsyncLayoutInflater 限制及改进<https://www.jianshu.com/p/f0c0eda06ae4>
