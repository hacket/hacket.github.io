---
date created: 2024-12-23 23:21
date updated: 2024-12-23 23:21
dg-publish: true
---

# Flipper

<https://fbflipper.com/>

## 什么是Flipper？

一个可扩展的跨平台的调试工具，用来调试 iOS、Android和RN应用。

Flipper 是作为一个平台构建的。除了使用已经包含的工具之外，你还可以自己创建插件来可视化和调试来自移动应用程序的数据。Flipper 负责在移动应用程序上来回发送数据、调用函数和侦听事件。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677986871761-b6d66b3e-8543-4c86-a99e-1d82c54c06f9.png#averageHue=%232dc943&clientId=u7061bae9-6de9-4&from=paste&id=u4bacc5b6&originHeight=1586&originWidth=2256&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=718130&status=done&style=none&taskId=ueb83b3e4-833c-41a3-a73c-09183a0e3b4&title=)

## Flipper引入

### OpenSSL(windows)

下载OpenSSL并加入到PATH<br />**OpenSSL下载**

- <https://wiki.openssl.org/index.php/Binaries>
- <https://slproweb.com/products/Win32OpenSSL.html>

[Win64OpenSSL_Light-3_0.exe 下载链接](https://slproweb.com/download/Win64OpenSSL_Light-3_0_8.exe)<br />**加入到PATH**<br />`OpenSSL安装目录\bin`加入到PATH<br />**验证**<br />终端：`openssl version`

### WatchMan

<https://facebook.github.io/watchman/><br />下载并安装完WatchMan后将bin目录加入到PATH中

### Gradle引入

```java
repositories {
  mavenCentral()
}

dependencies {
  debugImplementation 'com.facebook.flipper:flipper:0.182.0'
  debugImplementation 'com.facebook.soloader:soloader:0.10.4'

  releaseImplementation 'com.facebook.flipper:flipper-noop:0.182.0'
}
```

## 常用的Flipper插件

Flipper 本身只提供架构平台。使它有用的是建立在它之上的插件：日志、布局检查器和网络检查器都是插件。你可以针对你的业务逻辑和应用程序中的用例构建插件。我们提供带有内置通用插件的 Flipper。

- Logs 查看log
- Crash Reporter 查看Crash
- Layout 查看布局
- Databases 查看和修改Sqlite数据库数据
- Images(Fresco) 查看Fresco加载图片
- LeakCanary
- SP 查看和修改SP
- Network 查看网络请求
- UI Debugger 查看布局，比Layout功能更强

### Logs

展示设备的log无需额外的代码引入<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1677987095150-ac3ed5c1-c7a2-4953-b458-e261f3968ae6.png#averageHue=%23b9b7b6&clientId=u7061bae9-6de9-4&from=paste&id=u4666df51&originHeight=1586&originWidth=2256&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=581914&status=done&style=none&taskId=ue59eb990-dfc6-4b5f-b99e-b3e0d195d99&title=)

### Crash Reporter

查看Crash信息

```kotlin
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin;

client.addPlugin(CrashReporterPlugin.getInstance());
```

### Layout

查看布局，现在由`UI Debugger`替换掉<br />**代码：**

```java
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;

final DescriptorMapping descriptorMapping = DescriptorMapping.withDefaults();

client.addPlugin(new InspectorFlipperPlugin(mApplicationContext, descriptorMapping));
```

**效果：**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678074116343-fe0ef4e9-dd3b-4f38-9e59-dc56ab0e59a2.png#averageHue=%23fbfbfb&clientId=ua682ba33-03b6-4&from=paste&height=1024&id=u0fcdd1e3&originHeight=1024&originWidth=1912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=143627&status=done&style=none&taskId=ub63965b2-3cf4-4372-babd-6a7eaa61ca8&title=&width=1912)

### Databases

查看Sqlite数据库<br />**代码：**

```kotlin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin;

client.addPlugin(new DatabasesFlipperPlugin(context));
```

**效果：**<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678073974269-acc32aee-af4a-4cfe-8bfb-4434055ef3bd.png#averageHue=%23060606&clientId=ua682ba33-03b6-4&from=paste&height=1024&id=u690f1086&originHeight=1024&originWidth=1912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74476&status=done&style=none&taskId=u9a480887-3d01-427b-b2d9-6af5f71d337&title=&width=1912)

### Shared Preferences Viewer Plugin

查看SP<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678073855979-4d0ed5b6-fb2a-48d2-a105-f94f9435cbf0.png#averageHue=%23060606&clientId=ua682ba33-03b6-4&from=paste&height=1024&id=u6b433a3d&originHeight=1024&originWidth=1912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=117150&status=done&style=none&taskId=u2f4b8878-15cd-4fe7-8aee-b77e8693cf3&title=&width=1912)<br />如果项目中用了mmkv，那么这个插件就用不了，初始化时会报错：

> java.lang.UnsupportedOperationException: Intentionally Not implement in MMKV 具体见源码[MMKV.java](https://github.com/Tencent/MMKV/blob/master/Android/MMKV/mmkv/src/main/java/com/tencent/mmkv/MMKV.java)

### [mmkv-viewer](https://github.com/ddyos/flipper-plugin-mmkv-viewer)

1. Flipper中安装插件`mmkv-viewer`
2. 引入`debugImplementation 'com.github.ddyos:flipper-plugin-mmkv-viewer:1.0.0'`
3. 代码引入

```kotlin
private fun initMMKVPlugin(client: FlipperClient, context: Context) {
    client.addPlugin(
        MMKVFlipperPlugin(
            listOf(
                MMKVDescriptor(getDefaultId(context)),
                //                MMKVDescriptor("another_mmkv", MMKV.MULTI_PROCESS_MODE, cryptKey)
            )
        )
    )
    //        client.addPlugin(MMKVFlipperPlugin("other_mmkv"))
}
```

### Network

查看网络请求，可用来替换Charles看抓包数据

### UI Debugger

用来替换旧版本的Layout<br />**代码：**

```kotlin
client.addPlugin(UIDebuggerFlipperPlugin(UIDContext.create(context.applicationContext as Application)))
```

### Images

目前只支持查看Fresco库加载Image

### LeakCanary

**效果：**

### ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678073816276-92b2f310-56d1-49e4-bdd9-007a329ca0d0.png#averageHue=%23b7975d&clientId=ua682ba33-03b6-4&from=paste&height=1024&id=ue0475375&originHeight=1024&originWidth=1912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=362615&status=done&style=none&taskId=u18204200-355b-4d92-8b03-ad76233d108&title=&width=1912)

## 遇到的问题

### No device found

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678072914467-f46ee60d-9cc3-4c59-90d2-005e99b637e3.png#averageHue=%23100f0f&clientId=ua682ba33-03b6-4&from=paste&height=401&id=uebbe9cfb&originHeight=401&originWidth=1357&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37378&status=done&style=none&taskId=u70e0ae80-6159-4a6f-a789-8dedf35cf23&title=&width=1357)

- 原因：Android SDK路径不对
- 解决：设置正确的SDK路径

### Windows上运行Flipper可能会报错

> Failed to start flipper-server<br />Error: It looks like you don't have OpenSSL installed. Please install it to continue.

解决：安装OpenSSL，并将bin目录加入到Path

### 不能在除debug外的其他buildType运行

初始化就会崩溃
