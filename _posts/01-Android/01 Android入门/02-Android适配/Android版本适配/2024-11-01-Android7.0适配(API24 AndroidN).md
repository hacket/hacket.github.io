---
date created: Friday, November 1st 2024, 9:51:00 am
date updated: Monday, January 6th 2025, 11:03:46 pm
title: Android7.0适配(API24 AndroidN)
dg-publish: true
categories: [Android]
image-auto-upload: true
feed: show
format: list
aliases: [Android 7（API 24~25，AndroidN）]
linter-yaml-title-alias: Android 7（API 24~25，AndroidN）
---

# Android 7（API 24~25，AndroidN）

[Android 7.0 行为变更  |  Android 开发者  |  Android Developers](https://developer.android.com/about/versions/nougat/android-7.0-changes.html)

## 广播限制

见：[[BroadcastReceiver版本适配]]

## FileProvider

<https://developer.android.com/reference/android/support/v4/content/FileProvider>

### 什么是 FileProvider？

Android 7.0 去除项目中传递 `file://` 类似格式的 Uri 了，对于面向 Android 7.0 的应用，Android 框架执行的 StrictMode API 政策禁止在应用外部公开 `file://URI` ，如果一项包含文件 URI 的 intent 离开应用，则应用出现故障，并出现 `FileUriExposedException` 异常。

`FileProvider` 是 ContentProvider 的一个特殊的子类，它让应用间共享文件变得更加容易，其通过创建一个 Content URI 来代替 File URI。

一个 Content URI 允许开发者可赋予一个临时的读或写权限。当创建一个包含 Content URI 的 Intent 的时候，为了能够让另一个应用也可以使用这个 URI，你需要调用 `Intent.setFlags()` 来添加权限。只要接收 Activity 的栈是活跃的，则客户端应用就可以获取到这些权限。如果该 Intent 是用来启动一个 Service，则只要该 Service 是正在运行的，则也可以获取到这些权限。

相比之下，如果想要通过 File URI 来控制权限，开发者必须修改底层文件系统的权限。这些权限会对任意的 app 开放，直到你修改了它。这种级别的访问基本上是不安全的。

通过 Content URI 来提高文件访问的安全性，使得 FileProvider 成为 Android 安全基础设置的一个关键部分。

### FileProvider 使用场景

> 主要作用是应用间共享文件

#### 不需要使用 FileProvider 的场景

1. 比如我们下载文件到 SD 卡，当然我们一般都下载到 `download` 目录下，那么使用这个文件，需要 `FileProvider` 吗？

不需要，因为他是共享文件夹中，并不是在沙盒中。

2. 那我们把文件保存到沙盒中，比如 `getExternalFilesDir` 。那么我们使用这个沙盒中的文件，需要 `FileProvider` 吗？
3. 看情况，如果只是把此文件上传到服务器，上传到云平台，也就是我们自己 App 使用自己的沙盒，是不需要 `FileProvider` 的
4. 如果是想使用系统打开文件，或者传递给第三方 App，那么是需要 FileProvider 的。

> 也就是说一般使用场景，我们只有在自己 App 沙盒中的文件，需要给别的 App 操作的时候，我们才需要使用 FileProvider 。

比较典型的例子是，下载 Apk 到自己的沙盒文件中，然后调用 Android 的 Apk 安装器去安装应用（这是一个单独的 App），我们就需要 FileProvider 。

或者我们沙盒中的图片，需要发送到第三方的 App 里面展示，我们需要 FileProvider 。

#### 需要使用 FileProvider 的场景

##### 1. 调用照相机，指定照片存储路径

```java
/**
 * @param activity 当前activity
 * @param authority FileProvider对应的authority
 * @param file 拍照后照片存储的文件
 * @param requestCode 调用系统相机请求码
 */
public static void takePicture(Activity activity, String authority, File file, int requestCode) {
    Intent intent = new Intent();
    Uri imageUri;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        imageUri = FileProvider.getUriForFile(activity, authority, file);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    } else {
        imageUri = Uri.fromFile(file);
    }
    intent.setAction(MediaStore.ACTION_IMAGE_CAPTURE);
    intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
    activity.startActivityForResult(intent, requestCode);
}
```

##### 2. 剪裁图片

##### 3. 调用系统安装器，传递 apk 文件

```java
/**
 * 调用系统安装器安装apk
 *
 * @param context 上下文
 * @param authority FileProvider对应的authority
 * @param file apk文件
 */
public static void installApk(Context context, String authority, File file) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    Uri data;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        data = FileProvider.getUriForFile(context, authority, file);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    } else {
        data = Uri.fromFile(file);
    }
    intent.setDataAndType(data, INSTALL_TYPE);
    context.startActivity(intent);
}
```

### FileProvider 使用

#### 声明 provider

> 1. exported 必须是 false，grantUriPermissions 必须是 true，否则会报错。
> 2. 可以使用系统的 FileProvider，也可以自己定义 FileProvider

```xml
<provider
        android:name="androidx.core.content.FileProvider"
        android:authorities="${applicationId}.FileProvider"
        android:exported="false"
        android:grantUriPermissions="true">
    <meta-data
            android:name="android.support.FILE_PROVIDER_PATHS"
            android:resource="@xml/file_paths"/>
</provider>
```

解释：

```
provider 标签下，配置了几个属性：
1. name ：配置当前 FileProvider 的实现类，对于一个 App Module 而言，如果只是自己使用，可以直接使用 v4 包下的 FileProvider ，但是如果是作为一个 Lib Module 来供其他项目使用，最好还是重新空继承一个 FileProvider ，这里填写我们的继承类即可。字段中保存。
2. authorities：配置一个 FileProvider 的名字，它在当前系统内需要是唯一值。
3. exported：表示该 FileProvider 是否需要公开出去，这里不需要，所以是 false。
4. granUriPermissions：是否允许授权文件的临时访问权限。这里需要，所以是 true。
```

#### 指定可分享的文件路径 xml

> 在配置 Provider 的时候，还需要额外配置一个标签，它用于配置 FileProvider 支持分享出去的目录。这个标签的 name  值是固定的，resource 需要指向一个根节点为 paths 的 xml 资源文件。

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <root-path name="root" path="" />
    <files-path name="files" path="." />
    <cache-path name="cache" path="." />
    <external-path name="external" path="." />
    <external-files-path name="external-files" path="." />
    <external-cache-path name="external-cache" path="." />
</paths>
```

在 paths 节点内部支持以下几个子节点，分别为：

```xml
1. <root-path/> 代表设备的根目录 new File("/");
2. <files-path/> 代表context.getFilesDir() // /data/user/0/me.hacket.assistant/files
3. <cache-path/> 代表context.getCacheDir() // /data/user/0/me.hacket.assistant/files
4. <external-path/> 代表Environment.getExternalStorageDirectory()
5. <external-files-path>代表ContextCompat.getExternalFilesDirs() // /data/user/0/me.hacket.assistant/files
6. <external-cache-path>代表ContextCompat.getExternalCacheDirs() // /data/user/0/me.hacket.assistant/files
```

> 输出：content://authorities/定义的 name 属性/文件的相对路径，即 name 隐藏了可存储的文件夹路径。

- name<br>这是 URI 的 path。为了加强安全性，这个值隐藏了分享文件的子目录，具体的文件真实路径在 `path`
- path<br>分享文件的真实路径。需要注意的是，这个值表示的是一个子目录，不是一个具体的文件或者多个文件。开发者不能通过文件名来分享一个文件，也不能通过一个通配符来分享文件。

#### 使用 content://

配置工作已经全部完成，后面就需要将之前传递的 file:// 替换成 FileProvider 需要的 content:// ，这就需要用到 FileProvider.GetUriForFile () 方法了。

#### 授予临时的读写权限

在配置 provider 标签的时候，有一个属性 `android:grantUriPermissions="true"` ，它表示允许它授予 Uri 临时的权限。<br>当我们生成出一个 content:// 的 Uri 对象之后，其实也无法对其直接使用，还需要对这个 Uri 接收的 App 赋予对应的权限才可以。

而这个授权的动作，提供了两种方式来授权：

- 1、使用 `Context.grantUriPermission()` 为其他 App 授予 Uri 对象的访问权限

```
public abstract void grantUriPermission(String toPackage, Uri uri, int modeFlags);
```

GrantUriPermission () 方法包含三个参数，这三个参数都非常的好理解

```
toPackage ：表示授予权限的 App 的包名。
uri：授予权限的 content:// 的 Uri。
modeFlags：前面提到的读写权限。
```

这种情况下，授权的有效期限，从授权一刻开始，截止于设备重启或者手动调用 Context.RevokeUriPermission () 方法，才会收回对此 Uri 的授权。

- 2、配合 `Intent.addFlags()` 授权。<br>使用这种形式的授权，权限截止于该 App 所处的堆栈被销毁。也就是说，一旦授权，直到该 App 被完全退出，这段时间内，该 App 享有对此 Uri 指向的文件的对应权限，我们无法再主动收回此权限。

#### 分享这个 URI 给另一个 App

通过 Intent 来传递的，那么如匹配了该 Intent 的 Activity，就会拥有对自己 App 指定路径的 URI 具有读/写权限。

```java
private void shareFile() {
    Log.d(TAG, "shareFile: ");
    Intent intent = new Intent();
    ComponentName componentName = new ComponentName("com.ysx.fileproviderclient",
            "com.ysx.fileproviderclient.MainActivity");
    intent.setComponent(componentName);
    File file = new File(mContext.getFilesDir() + "/text", "hello.txt");
    Uri data;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        data = FileProvider.getUriForFile(mContext, FILE_PROVIDER_AUTHORITIES, file);
        // 给目标应用一个临时授权
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    } else {
        data = Uri.fromFile(file);
    }
    intent.setData(data);
    startActivity(intent);
}
```

### 坑

android 7. X+ 会报错，`android.os.FileUriExposedException`

### FitAndroid 7 (一行代码完成 Android 7 FileProvider 适配)

<https://github.com/hongyangAndroid/FitAndroid7>

一行代码完成 Android 7 FileProvider 适配~

### Ref

- [ ] [别滥用FileProvider了，Android中FileProvider的各种场景应用](https://mp.weixin.qq.com/s/ElGq9dNymxTXkDpxW_JMaw)
- [x] 我想把 FileProvider 聊的更透彻一些<br><https://www.jianshu.com/p/3879bb6ff0ed>
- [ ] Android 7.0 相机适配及 FileProvider 重复那些坑<br><https://juejin.im/post/5c25741f5188255a8750cf9c>
- [ ] Android FileProvider 的使用<br><https://blog.csdn.net/Next_Second/article/details/78585745>

> 讲的很好理解

## Network-security-config（ Android 7.0+ 网络安全性配置）

<https://developer.android.google.cn/training/articles/security-config><br>在 Android 7.0 以上的系统中，api 24 之前不适用，Google 引入了一种名为网络安全配置（Network Security Configuration）的功能。据官方文档所说，这个功能可以让开发者在一个安全的声明性 XML 配置文件中自定义应用的网络安全设置，而无需修改应用代码。也可以针对特定域和特定应用配置这些设置。<br>影响：targetSdkVersion 大于等于 24 的，不配置的话，抓包如 charles 就抓不到包具体的内容了

### SecurityConfig 配置

Application 添加

```xml
<application android:networkSecurityConfig="@xml/network_security_config"/>
```

在 `res/xml` 新建 `network_security_config.xml`，注意配置项有：

```xml
<network-security-config>
    <base-config />      <!--0 或 1 个-->
    <domain-config>     <!--任意数量-->
        <domain />      <!--1 个或多个 -->
        <trust-anchors  />    <!--0 或 1 个-->
        <pin-set />   <!--0 或 1 个-->
        <domain-config />   <!--任意数量的已嵌套-->
    </domain-config>    
    <debug-overrides />    <!--0 或 1 个 -->
</network-security-config>
```

#### 配置该应用的所有 HTTPS 链接

```xml
<?xml version="1.0"encoding="utf-8"?>
<network-security-config>
    <base-config>
        <trust-anchors>  <!-- 信任锚点集合 -->
            <certificates src="system"/>  <!-- 信任系统自带的证书 -->
            <certificates src="user"/>  <!-- 信任用户导入的证书 -->
        </trust-anchors>
    </base-config>
</network-security-config>
```

#### 配置该应用的自定义 CA

```xml
<?xml version="1.0"encoding="utf-8"?>
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="@raw/my_custom_ca"/>  <!-- 放在 res/raw 下的自定义 CA 文件 -->
        </trust-anchors>
    </base-config>
</network-security-config>
```

#### 根据域名配置 HTTPS 可信域

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config>  <!-- 与上文的 base-config 不同 -->
        <domain includeSubdomains="true">example1.iacn.me</domain>  <!-- 过滤域名，可配置多个 -->
        <domain includeSubdomains="true">example2.iacn.me</domain>  <!-- 一般会将 CDN 配置在此 -->
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </domain-config>
</network-security-config>
```

#### 开发阶段的配置

仅在 `android:debuggable=”true”` 时生效，无论你是什么包

```xml
<?xml version="1.0"encoding="utf-8"?>
<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

## Quick Settings Tile 快速设置磁贴

快速设置 `QuickSettings` 是 Android 7.0 推出的新特性，就是我们平时手机常用的下拉快捷控制，可以直接从通知栏显示一些关键的设置和操作，例如：打开/关闭手电筒、蓝牙、Wifi 等等许多功能，用户甚至无需解锁就可以操作这些功能，非常简单方便。

![|800](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240929210112.png)

### 自定义 Tile

TileService

- <https://blog.csdn.net/tracydragonlxy/article/details/131432214>

## Reference

- [ ] 绕过 Android 7.0+ 网络安全配置 <https://iacn.me/2018/03/14/network-security-configuration-newer-than-android-n/>
- [ ] SSL-NetworkSecurityConfig 证书配置解析 <https://www.jianshu.com/p/19b8294f4ac2>
- [ ] Android Charles 证书固定 <https://www.jianshu.com/p/aac74dbab730>
