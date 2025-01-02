---
date created: 2024-12-24 00:33
date updated: 2024-12-24 00:33
dg-publish: true
---

# Service not registered: com.google.android.gms.common.internal.zze[@fa44f77 ](/fa44f77)

## 错误堆栈

- 错误1

```
java.lang.IllegalArgumentException: Service not registered: com.google.android.gms.common.internal.zze@63b2f00
        at android.app.LoadedApk.forgetServiceDispatcher(LoadedApk.java:1759)
        at android.app.ContextImpl.unbindService(ContextImpl.java:1786)
        at android.content.ContextWrapper.unbindService(ContextWrapper.java:751)
        at com.google.android.gms.common.stats.ConnectionTracker.unbindService(com.google.android.gms:play-services-basement@@17.2.1:25)
        at com.google.android.gms.common.internal.zze.zzf(com.google.android.gms:play-services-basement@@17.2.1:41)
        at com.google.android.gms.common.internal.zzf.handleMessage(com.google.android.gms:play-services-basement@@17.2.1:48)
        at android.os.Handler.dispatchMessage(Handler.java:103)
        at com.google.android.gms.internal.common.zzi.dispatchMessage(com.google.android.gms:play-services-basement@@17.2.1:8)
        at android.os.Looper.loop(Looper.java:227)
        at android.app.ActivityThread.main(ActivityThread.java:7582)
        at java.lang.reflect.Method.invoke(Native Method)
        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:539)
        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:953)
```

- 错误2

```
2020-10-14 17:29:20.551 31215-31215/club.jinmei.mgvoice E/AndroidRuntime: FATAL EXCEPTION: main
Process: club.jinmei.mgvoice, PID: 31215
java.lang.IllegalArgumentException: Service not registered: bl@8a9b7b0
    at android.app.LoadedApk.forgetServiceDispatcher(LoadedApk.java:1759)
    at android.app.ContextImpl.unbindService(ContextImpl.java:1786)
    at android.content.ContextWrapper.unbindService(ContextWrapper.java:751)
    at android.content.ContextWrapper.unbindService(ContextWrapper.java:751)
    at cl.handleMessage(chromium-TrichromeWebViewGoogle.aab-stable-1:26)
    at android.os.Handler.dispatchMessage(Handler.java:103)
    at sm.dispatchMessage(chromium-TrichromeWebViewGoogle.aab-stable-1:1)
    at android.os.Looper.loop(Looper.java:227)
    at android.app.ActivityThread.main(ActivityThread.java:7582)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:539)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:953)
```

---

## 分析&解决

- 分析

Firebase使用过程中可能会出现 `Service not registered: com.google.firebase.iid.zzw` 这样的 Crash, 导致应用崩溃. 查看源码发现是 `com.google.android.gms:play-services-basement:17.0.0` 这个库中的 c`om.google.android.gms.common.stats.ConnectionTracker#unbindService()` 尝试 unbind 没有注册的 Service, 最新的 17.2.1 中的 ConnectionTracker 添加了一个 unbindServiceSafe(), 它对 unbindService 进行了 try-catch, 但是奇怪的是 Firebase 的其他类并没有调用过这个方法, 估计可能后续版本会修复这个问题, 但是目前的只能靠我们开发者自己修复了.

之前尝试过修复一次, 使用反射替换了内部的 Executor, 但是后面还是出现了这样的崩溃. 猜测是其他的地方调用了 unbindService(). 后续尝试了其他的方法,但都以失败告终. 最终发现了一个应该能完美解决的方法. Firebase 采用 FirebaseInitProvider 来无侵入的获取 Context, 而这个 Context 就是 Application 的实例, 所以我们重写 Application#unbindService() 即可, 最终调用的 unbindService() 都会在这里被捕获:

- 解决

```
@Override
public void unbindService(ServiceConnection conn) {
    try {
        super.unbindService(conn); // GMS  Service not registered: com.google.android.gms.common.internal.zze@63b2f00
    } catch (Exception e) {
        e.printStackTrace();
        // do something, ignore or report...
    }
}
```

## Ref

- [ ] Google GMS Crash 优化方案<br /><https://juejin.im/post/6844903912168751118>
