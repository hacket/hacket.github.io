---
date_created: Friday, December 20th 2017, 10:48:39 pm
date_updated: Sunday, February 2nd 2025, 11:20:09 pm
title: Kotlin Result类
author: hacket
categories:
  - Java&Kotlin
category: Kotlin基础
tags: [Kotlin基础]
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
date created: 2024-12-20 10:04
date updated: 2024-12-27 23:46
aliases: [自定义 Result 类]
linter-yaml-title-alias: 自定义 Result 类
---

# 自定义 Result 类

```kotlin
internal suspend inline fun <reified T> BaseRxHttp.awaitResult(timeoutMillis: Long = 0L): Result<T> {  
    return runCatching {  
        if (timeoutMillis <= 0L) {  
            asClassSuspend<T>().await()  
        } else {  
            withTimeout(timeoutMillis) {  
                asClassSuspend<T>().await()  
            }  
        }  
    }  
}  
  
@OptIn(ExperimentalContracts::class)  
@SinceKotlin("1.3")  
internal inline fun <T> Result<T>.onFailure(  
    crossinline action: (exception: Throwable, isTimeout: Boolean) -> Unit  
): Result<T> {  
    contract {  
        callsInPlace(action, InvocationKind.AT_MOST_ONCE)  
    }  
    exceptionOrNull()?.let {  
        if (it is kotlinx.coroutines.TimeoutCancellationException) {  
            action(it, true)  
        } else {  
            action(it, false)  
        }  
    }  
    return this  
}  
  
  
// region AppWidget 专用  
  
@OptIn(ExperimentalContracts::class)  
inline fun <T> Result<AppWidgetData<T>>.onAppWidgetSuccess(action: (value: AppWidgetData<T>) -> Unit): Result<AppWidgetData<T>> {  
    contract {  
        callsInPlace(action, InvocationKind.AT_MOST_ONCE)  
    }  
    if (isSuccess) {  
        val data = getOrNull()  
        if (data != null && data.isValid()) {  
            WidgetMonitor.requestDataStatus(data.appWidgetLayoutCode, false)  
            action(data)  
        }  
    }  
    return this  
}  
  
@OptIn(ExperimentalContracts::class)  
internal inline fun <T> Result<AppWidgetData<T>>.onAppWidgetFailure(  
    crossinline action: (e: Throwable, value: AppWidgetData<T>) -> Unit  
): Result<AppWidgetData<T>> {  
    contract {  
        callsInPlace(action, InvocationKind.AT_MOST_ONCE)  
    }  
    if (isSuccess) {  
        val data = getOrNull()  
        if (data != null && !data.isValid()) {  
            WidgetMonitor.requestDataStatus(data.appWidgetLayoutCode, true)  
            action(data.tr ?: Throwable("data is invalid"), data)  
        }  
    }  
    return this  
}  
  
internal suspend inline fun <reified T> BaseRxHttp.awaitAppWidgetResult(  
    @AppWidgetLayoutCode  
    appWidgetLayoutCode: String,  
    callType: String? = "",  
): Result<AppWidgetData<T>> {  
    val s = SystemClock.elapsedRealtime()  
    return try {  
        callType?.let {  
            WidgetMonitor.requestData(appWidgetLayoutCode, it)  
        }  
        val data = asClassSuspend<T>().await()  
        val cost = SystemClock.elapsedRealtime() - s  
        WidgetMonitor.requestDataCost(appWidgetLayoutCode, callType, cost)  
        Result.success(  
            AppWidgetData(  
                appWidgetLayoutCode = appWidgetLayoutCode,  
                callType = callType,  
                data = data,  
                cost = cost  
            )  
        )  
    } catch (e: Throwable) {  
        val cost = SystemClock.elapsedRealtime() - s  
        WidgetMonitor.requestDataCost(appWidgetLayoutCode, callType, cost)  
        Result.success(  
            AppWidgetData(  
                appWidgetLayoutCode = appWidgetLayoutCode,  
                callType = callType,  
                data = null,  
                cost = cost,  
                tr = e  
            )  
        )  
    }  
}  
  
data class AppWidgetData<T>(  
    @AppWidgetLayoutCode  
    val appWidgetLayoutCode: String,  
    val callType: String? = "",  
    val data: T? = null,  
    val cost: Long = 0L,  
    val tr: Throwable? = null  
) {  
    fun isValid(): Boolean {  
        return data != null  
    }  
  
    fun isSuccess(): Boolean {  
        return tr == null && data != null  
    }  
}  
// endregion
```

`awaitAppWidgetResult和jacoco插件编译不过问题`

- 大意就是 google 工程师说是 jacoco 插桩问题导致字节码 invalid 了
- [com.android.tools.r8.CompilationFailedException 384636715 - Issue Tracker](https://issuetracker.google.com/issues/384636715)
- 解决方案是 jacoco 屏蔽掉该类

## Result 扩展

- [GitHub - kittinunf/Result: The modelling for success/failure of operations in Kotlin and KMM (Kotlin Multiplatform Mobile)](https://github.com/kittinunf/Result)
