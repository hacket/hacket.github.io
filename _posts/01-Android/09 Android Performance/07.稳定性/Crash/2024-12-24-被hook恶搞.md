---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# `Fatal Exception: java.lang.IllegalArgumentException: result has type long, got java.lang.String at android.os.BaseBundle.getLong(<Xposed>)`

**报错堆栈：**<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688615236567-75533ff8-0d76-4b67-81f7-c9dad077c206.png#averageHue=%23f9f9f9&clientId=u9c12f14e-a255-4&from=paste&height=606&id=u93e2933c&originHeight=1212&originWidth=2230&originalType=binary&ratio=2&rotation=0&showTitle=false&size=285033&status=done&style=none&taskId=u423064f0-fc9b-40f1-bcbb-c91bdcef404&title=&width=1115)<br>**疑问：**

1. 代码调用是在Log输出时调用，但线上包不会输出Log
2. ReferrerDetails�的getInstallBeginTimestampSeconds逻辑，即使存了String值，获取到的也是0L默认值，不会崩溃
   - 看了代码是报错在Google Install Referer中

```java
public long getInstallBeginTimestampSeconds() {
    return this.mOriginalBundle.getLong("install_begin_timestamp_seconds");
}
```

- getLong逻辑

```java
public long getLong(String key) {
    unparcel();
    return getLong(key, 0L);
}
public long getLong(String key, long defaultValue) {
    unparcel();
    Object o = mMap.get(key);
    if (o == null) {
        return defaultValue;
    }
    try {
        return (Long) o;
    } catch (ClassCastException e) {
        typeWarning(key, o, "Long", defaultValue, e);
        return defaultValue;
    }
}
```

3. 再加上上面堆栈有带Xposed字眼，可以推测这是有人在用Xposed框架恶搞我们的APP
