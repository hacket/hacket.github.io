---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# OnBackPressedDispatcher

## OnBackPressedDispatcher处理Fragment中处理返回键

Fragment中处理返回键:

```kotlin
class BaseFragment : Fragment() {
    override fun onAttach(context: Context) {
        super.onAttach(context)
        requireActivity().onBackPressedDispatcher.addCallback(this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    //这里处理拦截的逻辑
                }

            })
    }
}
```

## OnBackPressedDispatcher存在的问题

真实场景一般是fragment走到特定逻辑了，就需要拦截，没有走到就不拦截，或者随着不同的业务，会动态不断变化，而Android X的设计是：**必现提前告诉它们，要不要拦截，这就很鸡肋了**

1. 在需要拦截的时候，设置为anable为true，在不需要拦截的时候，要立马设置为flase
2. 场景复杂下，需要不断的调用true跟flase，来回切换

## 自行实现（接口）

定义一个拦截的接口：

```kotlin
/**
 * 监听activity的onBackPress事件
 */
interface BackPressedListener {
    /**
     * @return true代表响应back键点击，false代表不响应
     */
    fun handleBackPressed(): Boolean
}
```

基类fragment实现这个接口：

```kotlin
/**
 * 全局通用的基类fragment
 */
abstract class BaseFragment : Fragment(), BackPressedListener {
    override fun handleBackPressed(): Boolean {
        //默认不响应
        return false
    }
}
```

fragmentA需要响应，就override这个方法：

```kotlin
class FragmentA : BaseFragment(){
    override fun handleBackPressed(): Boolean {
        //处理自己的逻辑
        return true
    }
}
```

最后在基类activity实现逻辑打通：

```kotlin
class BaseActivity : AppCompatActivity() {
    override fun onBackPressed() {
        if (!interceptBackPressed()) {
            super.onBackPressed()
        }
    }

    /**
     * 拦截事件
     */
    private fun interceptBackPressed(): Boolean {
        supportFragmentManager.fragments.forEach {
            if (it is BackPressedListener) {
                if (it.handleBackPressed()) {
                    return true
                }
            }
        }
        return false
    }
}
```

# Activity Results API

## What?

### Activity Results API

替代`startActivityForResult`和`onActivityResult`的，避免onActivityResult回调方法各种嵌套、耦合严重、难以维护

Activity Results API 是 Google官方推荐的Activity、Fragment获取数据的方式。

### 引入

```groovy
// activity https://developer.android.com/jetpack/androidx/releases/activity
implementation "androidx.activity:activity:1.3.0-alpha07"
implementation "androidx.activity:activity-ktx:1.3.0-alpha07"

// fragment https://developer.android.com/jetpack/androidx/releases/fragment
implementation "androidx.fragment:fragment:1.3.3"
implementation "androidx.fragment:fragment-ktx:1.3.3"
```

## How

### ActivityResultContract/ActivityResultLauncher

#### `ActivityResultContract<I, O>` 协议

定义了如何传递数据和如何处理返回的数据；如果您不需要任何输入，可使用 Void（在 Kotlin 中，使用 Void? 或 Unit）作为输入类型。

在Activity或Fragment通过`registerForActivityResult(ActivityResultContract,ActivityResultCallback)`来注册，需要在start前注册，否则报错。

#### ActivityResultLauncher 启动器

调用ActivityResultLauncher的launch方法来启动页面跳转，作用相当于原来的startActivity()

#### 预定义的ActivityResultContract

| 预定义ActivityResultContract  | 用途                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| StartActivityForResult     | 通用的Contract,不做任何转换，Intent作为输入，ActivityResult作为输出，这也是最常用的一个协定                                                                    |
| RequestMultiplePermissions | 用于请求一组权限                                                                                                                        |
| RequestPermission          | 用于请求单个权限                                                                                                                        |
| TakePicturePreview         | 调用`MediaStore.ACTION_IMAGE_CAPTURE`<br />拍照，返回值为Bitmap图                                                                         |
| TakePicture                | 调用`MediaStore.ACTION_IMAGE_CAPTURE`<br />拍照，并将图片保存到给定的Uri地址，返回true表示保存成功                                                        |
| TakeVideo                  | 调用`MediaStore.ACTION_VIDEO_CAPTURE`<br />拍摄视频，保存到给定的Uri地址，返回一张缩略图                                                               |
| PickContact                | 从通讯录APP获取联系人                                                                                                                    |
| GetContent                 | 提示用选择一条内容，返回一个通过ContentResolver#openInputStream(Uri)访问原生数据的Uri地址（content://形式） 。默认情况下，它增加了 Intent#CATEGORY_OPENABLE, 返回可以表示流的内容 |
| CreateDocument             | 提示用户选择一个文档，返回一个(file:/http:/content:)开头的Uri                                                                                     |
| OpenMultipleDocuments      | 提示用户选择文档（可以选择多个），分别返回它们的Uri，以List的形式                                                                                            |
| OpenDocumentTree           | 提示用户选择一个目录，并返回用户选择的作为一个Uri返回，应用程序可以完全管理返回目录中的文档                                                                                 |

> 上面这些预定义的Contract中，除了StartActivityForResult和RequestMultiplePermissions之外，基本都是处理的与其他APP交互，返回数据的场景，比如，拍照，选择图片，选择联系人，打开文档等等。使用最多的就是StartActivityForResult和RequestMultiplePermissions了

### startActivityForResult/onActivityResult替代

#### 原始

```kotlin
val launcherV1 = registerForActivityResult(MyActivityResultContract()) {
    Toast.makeText(this, "result value is :${it}", Toast.LENGTH_LONG).show()
    tv_result.append("[ActivityResultContract]resultCode=$it\n")
}
btn_start_activity_result_api_v1.setOnClickListener {
    launcherV1.launch(123)
}

inner class MyActivityResultContract : ActivityResultContract<Int, String>() {
    override fun createIntent(context: Context, input: Int?): Intent {
        return Intent(context, ActivityResultsDestinationActivity::class.java)
                .apply {
                    putExtra("input", input)
                }
    }
    override fun parseResult(resultCode: Int, intent: Intent?): String? {
        if (resultCode == Activity.RESULT_OK) {
            return intent?.getStringExtra("data") ?: ""
        }
        return null
    }
}
```

#### StartActivityForResult

```kotlin
val launcherV3 = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
    val resultCode = result?.resultCode
    if (resultCode == Activity.RESULT_OK) {
        val data = result.data?.getStringExtra("data")
        tv_result.append("[ActivityResultContracts.StartActivityForResult]data=$data\n")
    }
}
btn_start_activity_result_api_v3.setOnClickListener {
    val intent = Intent(this, ActivityResultsDestinationActivity::class.java)
    intent.putExtra("input", 10086)
    launcherV3.launch(intent)
}
```

#### RequestPermission/RequestMultiplePermissions

```kotlin
request_permission.setOnClickListener {
    requestPermission.launch(permission.BLUETOOTH)
}

request_multiple_permission.setOnClickListener {
    requestMultiplePermissions.launch(
        arrayOf(
            permission.BLUETOOTH,
            permission.NFC,
            permission.ACCESS_FINE_LOCATION
        )
    )
}

// 请求单个权限
private val requestPermission =
    registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
        // Do something if permission granted
        if (isGranted) toast("Permission is granted")
        else toast("Permission is denied")
    }

// 请求一组权限
private val requestMultiplePermissions =
    registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions : Map<String, Boolean> ->
        // Do something if some permissions granted or denied
        permissions.entries.forEach {
            // Do checking here
        }                                                                             
}
```

## 写的库

一行代码实现权限请求、startActivityForResult、调用相机拍照及调用相机录像等，消除onActivityResult()、onRequestPermissionsResult()回调导致的代码分散的问题；支持协程<br /><https://github.com/hacket/ActivityResultHelper>
