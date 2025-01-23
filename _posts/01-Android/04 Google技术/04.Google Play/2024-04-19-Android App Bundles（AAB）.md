---
date_created: Friday, April 19th 2024, 10:45:19 pm
date_updated: Wednesday, January 22nd 2025, 12:04:04 am
title: Android App Bundles（AAB）
author: hacket
categories:
  - Android
category: GooglePlay
tags: [包体积, AAB, GooglePlay]
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
date created: 2024-04-19 17:01
date updated: 2024-12-24 00:33
aliases: [AAB]
linter-yaml-title-alias: AAB
---

# AAB

## 什么是 AAB？

重要提示：从 2021 年 8 月起，新应用必须通过 Google Play 上的 `Android App Bundle` 发布。 `Play Feature Delivery` 或 `Play Asset Delivery` 现在支持大于 200 MB 的新应用程序。从 2023 年 6 月起，新的和现有的电视应用程序都必须作为 `AAB` 发布。

Android App Bundle 是一种发布格式，其中包含应用程序的所有已编译代码和资源，并将 APK 生成和签名推迟到 Google Play。

Google Play 使用您的 `aab` 包为每个设备配置生成并提供优化的 APK，因此只会下载特定设备运行您的应用程序所需的代码和资源（根据 `abi`/`density`/`language` 等）。

您不再需要构建、签名和管理多个 APK 来优化对不同设备的支持，并且用户可以获得更小、更优化的下载。

## 配置 module

`AAB` 与 `APK` 不同，您无法将应用程序包部署到设备。相反，它是一种发布格式，将应用程序的所有已编译代码和资源包含在单个构建工件中。因此，在您上传签名的 `AAB` 后，Google Play 拥有构建和签署应用程序 APK 所需的一切，并将其提供给用户。

`splits` 块被忽略：构建应用程序包时，Gradle 会忽略 `android.splits` 块中的属性。如果您想控制您的应用程序包支持哪些类型的配置 APK，请改为使用 `android.bundle` 禁用配置 APK 类型：[[#Re-enable or disable types of configuration APKs]]

### Re-enable or disable types of configuration APKs

默认情况下，当您构建 `AAB` 时，它支持为每组语言资源、屏幕密度资源和 ABI 库生成配置 APK。使用基本模块的 `build.gradle` 文件中的 `android.bundle` 块（如下所示），您可以禁用对一种或多种配置 APK 类型的支持：

```kotlin
android {
    // When building Android App Bundles, the splits block is ignored.
    // You can remove it, unless you're going to continue to build multiple
    // APKs in parallel with the app bundle
    splits {...}

    // Instead, use the bundle block to control which types of configuration APKs
    // you want your app bundle to support.
    bundle {
        language {
            // This property is set to true by default.
            // You can specify `false` to turn off
            // generating configuration APKs for language resources.
            // These resources are instead packaged with each base and
            // feature APK.
            // Continue reading below to learn about situations when an app
            // might change setting to `false`, otherwise consider leaving
            // the default on for more optimized downloads.
            enableSplit = false
        }
        density {
            // This property is set to true by default.
            enableSplit = true
        }
        abi {
            // This property is set to true by default.
            enableSplit = true
        }
    }
}
```

### Handling language changes 处理语言更改

Google Play 根据用户设备设置中的语言选择来确定与应用一起安装哪些语言资源。

考虑一个用户在下载您的应用程序后更改了默认系统语言。如果您的应用支持该语言，设备会从 Google Play 请求并下载这些语言资源的附加配置 APK。

对于在应用程序内部提供语言选择器并动态更改应用程序语言（与系统级语言设置无关）的应用程序，您必须进行一些更改以防止由​​于缺少资源而崩溃。将 `android.bundle.language.enableSplit` 属性设置为 `false` ，或者考虑使用 Play Core 库实现按需语言下载，如下载其他语言资源中所述：[Download additional language resources](https://developer.android.com/guide/playcore/feature-delivery/on-demand#lang_resources)

## 构建 AAB 包

### Android Studio

AS 打包 Android Studio 打包：`Build`→`Generate Signed Bundle or APK`，选择 `aab`，配置 `keystore`，`输出 aab 的目录`，等待打包结果

![|500](https://cdn.nlark.com/yuque/0/2023/webp/694278/1682179630830-f25827ec-4342-417d-add4-02feea6f3967.webp#averageHue=%23404347&clientId=ua6c7f918-4928-4&from=paste&height=598&id=u51e5577f&originHeight=598&originWidth=607&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5d1e6d61-63de-484c-b745-34ae4aee950&title=&width=607)

### [Build an app bundle with Gradle](https://developer.android.com/build/building-cmdline#bundle_build_gradle)

- AGP 配置好了 `signConfig`，打出来的 `AAB` 就带签名

```shell
./gradlew :base:bundleDebug
```

- 也可以后面用 `jarsigner` 签名，不能用 `apksigner`

```shell
jarsigner -keystore pathToKeystore app-release. Aab keyAlias
```

### Build an app bundle using bundletool

- [从命令行构建您的应用  |  Android Studio  |  Android Developers](https://developer.android.com/build/building-cmdline#bundletool-build)

## `bundletool`

- [构建和测试 Android App Bundle  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/app-bundle/test#build-command-line)
- [bundletool](https://developer.android.com/tools/bundletool)

aab 是不能直接安装的，需要上传到 Google Play 后台，通过商店下载安装测试，不过其本质还是安装 apk。我们也可以通过谷歌提供的 `bundletool` 进行 aab 的本地安装测试，而不需要上传到 Google Play 后台。

谷歌规定 aab 里面的 base 文件夹不能超过 **150 MB** 大小，超过 150 MB 需要进行应用的资源分发，游戏的 aab 的 base 文件夹一般都超过了 150 MB，所以在打包前要做好资源分发的处理

下载 [bundletool](https://github.com/google/bundletool/releases)

### `aab` 转成 `apks` 命令： `build-apks`

#### 默认 debug 签名

```shell
# 用jar包
java -jar bundletool-all-1.10.0.jar build-apks --bundle=app-debug.aab --output=app.apks --local-testing
```

- `--bundle` 为输入文件的全路径（当前目录直接使用文件名）
- `--output` 为输出文件全路径，需要以 `.apks` 结尾

使用 zip 工具解压生成的 APKS 文件，可以看见在 splits 目录下，针对不同的语言、分辨率、ABI 生成了不同的 APK 文件：

![image.png|600](https://cdn.nlark.com/yuque/0/2023/png/694278/1699422153480-f3a1bd9d-9dc1-4974-8d6e-e33f82ca18e8.png#averageHue=%239cbb56&clientId=u11733774-079c-4&from=paste&height=321&id=u15e2e941&originHeight=812&originWidth=1410&originalType=binary&ratio=2&rotation=0&showTitle=false&size=273516&status=done&style=none&taskId=ucd26362f-07bd-4aca-becb-0e63de2f801&title=&width=557)

如果 `language` 的 `enableSplit` 设置为 false，则不会针对语言生成不同的 APK 文件：

![image.png|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240420113059.png)

如果只对当前连接 PC 的设备生成 APKS 文件可以使用以下命令：通过使用该命令，生成的 APKS 文件中，就只包含针对于该设备的 `base APK + 配置 APK`

```shell
java -jar bundletool-all-1.10.0.jar build-apks --connected-device --bundle=app-debug.aab --output=app.apks
```

![image.png|300](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240420113253.png)

我们使用以下命令可以获得当前连接设备的配置 `json` 文件：

```shell
java -jar bundletool-all-1.10.0.jar get-device-spec --output=device.json
```

```json
{
"supportedAbis": ["arm64-v8a", "armeabi-v7a", "armeabi"], 
"supportedLocales": ["zh-CN", "ar-JO", "en-US"], 
"deviceFeatures": ["reqGlEsVersion\u003d0x30002", "android.hardware.audio.low_latency", "android.hardware.audio.output", "android.hardware.audio.pro", "android.hardware.bluetooth", "android.hardware.bluetooth_le", "android.hardware.camera", "android.hardware.camera.any", "android.hardware.camera.autofocus", "android.hardware.camera.capability.manual_post_processing", "android.hardware.camera.capability.manual_sensor", "android.hardware.camera.capability.raw", "android.hardware.camera.concurrent", "android.hardware.camera.flash", "android.hardware.camera.front", "android.hardware.camera.level.full", "android.hardware.context_hub", "android.hardware.device_unique_attestation", "android.hardware.faketouch", "android.hardware.fingerprint", "android.hardware.identity_credential\u003d202101", "android.hardware.location", "android.hardware.location.gps", "android.hardware.location.network", "android.hardware.microphone", "android.hardware.nfc", "android.hardware.nfc.any", "android.hardware.nfc.ese", "android.hardware.nfc.hce", "android.hardware.nfc.hcef", "android.hardware.nfc.uicc", "android.hardware.opengles.aep", "android.hardware.ram.normal", "android.hardware.reboot_escrow", "android.hardware.screen.landscape", "android.hardware.screen.portrait", "android.hardware.se.omapi.ese", "android.hardware.se.omapi.uicc", "android.hardware.security.model.compatible", "android.hardware.sensor.accelerometer", "android.hardware.sensor.barometer", "android.hardware.sensor.compass", "android.hardware.sensor.gyroscope", "android.hardware.sensor.hifi_sensors", "android.hardware.sensor.light", "android.hardware.sensor.proximity", "android.hardware.sensor.stepcounter", "android.hardware.sensor.stepdetector", "android.hardware.strongbox_keystore", "android.hardware.telephony", "android.hardware.telephony.carrierlock", "android.hardware.telephony.cdma", "android.hardware.telephony.euicc", "android.hardware.telephony.gsm", "android.hardware.telephony.ims", "android.hardware.touchscreen", "android.hardware.touchscreen.multitouch", "android.hardware.touchscreen.multitouch.distinct", "android.hardware.touchscreen.multitouch.jazzhand", "android.hardware.usb.accessory", "android.hardware.usb.host", "android.hardware.vulkan.compute", "android.hardware.vulkan.level\u003d1", "android.hardware.vulkan.version\u003d4198400", "android.hardware.wifi", "android.hardware.wifi.aware", "android.hardware.wifi.direct", "android.hardware.wifi.passpoint", "android.hardware.wifi.rtt", "android.software.activities_on_secondary_displays", "android.software.app_enumeration", "android.software.app_widgets", "android.software.autofill", "android.software.backup", "android.software.cant_save_state", "android.software.companion_device_setup", "android.software.connectionservice", "android.software.controls", "android.software.cts", "android.software.device_admin", "android.software.device_id_attestation", "android.software.file_based_encryption", "android.software.home_screen", "android.software.incremental_delivery\u003d2", "android.software.input_methods", "android.software.ipsec_tunnels", "android.software.live_wallpaper", "android.software.managed_users", "android.software.midi", "android.software.opengles.deqp.level\u003d132383489", "android.software.picture_in_picture", "android.software.print", "android.software.secure_lock_screen", "android.software.securely_removes_users", "android.software.sip", "android.software.sip.voip", "android.software.verified_boot", "android.software.voice_recognizers", "android.software.vulkan.deqp.level\u003d132383489", "android.software.webview", "com.google.android.apps.dialer.SUPPORTED", "com.google.android.feature.ADAPTIVE_CHARGING", "com.google.android.feature.AER_OPTIMIZED", "com.google.android.feature.D2D_CABLE_MIGRATION_FEATURE", "com.google.android.feature.DREAMLINER", "com.google.android.feature.EXCHANGE_6_2", "com.google.android.feature.GOOGLE_BUILD", "com.google.android.feature.GOOGLE_EXPERIENCE", "com.google.android.feature.GOOGLE_FI_BUNDLED", "com.google.android.feature.NEXT_GENERATION_ASSISTANT", "com.google.android.feature.PIXEL_2017_EXPERIENCE", "com.google.android.feature.PIXEL_2018_EXPERIENCE", "com.google.android.feature.PIXEL_2019_EXPERIENCE", "com.google.android.feature.PIXEL_2019_MIDYEAR_EXPERIENCE", "com.google.android.feature.PIXEL_2020_EXPERIENCE", "com.google.android.feature.PIXEL_2020_MIDYEAR_EXPERIENCE", "com.google.android.feature.PIXEL_EXPERIENCE", "com.google.android.feature.TURBO_PRELOAD", "com.google.android.feature.WELLBEING", "com.nxp.mifare", "com.verizon.hardware.telephony.ehrpd", "com.verizon.hardware.telephony.lte"], 
"glExtensions": ["GL_OES_EGL_image", "GL_OES_EGL_image_external", "GL_OES_EGL_sync", "GL_OES_vertex_half_float", "GL_OES_framebuffer_object", "GL_OES_rgb8_rgba8", "GL_OES_compressed_ETC1_RGB8_texture", "GL_AMD_compressed_ATC_texture", "GL_KHR_texture_compression_astc_ldr", "GL_KHR_texture_compression_astc_hdr", "GL_OES_texture_compression_astc", "GL_OES_texture_npot", "GL_EXT_texture_filter_anisotropic", "GL_EXT_texture_format_BGRA8888", "GL_EXT_read_format_bgra", "GL_OES_texture_3D", "GL_EXT_color_buffer_float", "GL_EXT_color_buffer_half_float", "GL_QCOM_alpha_test", "GL_OES_depth24", "GL_OES_packed_depth_stencil", "GL_OES_depth_texture", "GL_OES_depth_texture_cube_map", "GL_EXT_sRGB", "GL_OES_texture_float", "GL_OES_texture_float_linear", "GL_OES_texture_half_float", "GL_OES_texture_half_float_linear", "GL_EXT_texture_type_2_10_10_10_REV", "GL_EXT_texture_sRGB_decode", "GL_EXT_texture_format_sRGB_override", "GL_OES_element_index_uint", "GL_EXT_copy_image", "GL_EXT_geometry_shader", "GL_EXT_tessellation_shader", "GL_OES_texture_stencil8", "GL_EXT_shader_io_blocks", "GL_OES_shader_image_atomic", "GL_OES_sample_variables", "GL_EXT_texture_border_clamp", "GL_EXT_EGL_image_external_wrap_modes", "GL_EXT_multisampled_render_to_texture", "GL_EXT_multisampled_render_to_texture2", "GL_OES_shader_multisample_interpolation", "GL_EXT_texture_cube_map_array", "GL_EXT_draw_buffers_indexed", "GL_EXT_gpu_shader5", "GL_EXT_robustness", "GL_EXT_texture_buffer", "GL_EXT_shader_framebuffer_fetch", "GL_ARM_shader_framebuffer_fetch_depth_stencil", "GL_OES_texture_storage_multisample_2d_array", "GL_OES_sample_shading", "GL_OES_get_program_binary", "GL_EXT_debug_label", "GL_KHR_blend_equation_advanced", "GL_KHR_blend_equation_advanced_coherent", "GL_QCOM_tiled_rendering", "GL_ANDROID_extension_pack_es31a", "GL_EXT_primitive_bounding_box", "GL_OES_standard_derivatives", "GL_OES_vertex_array_object", "GL_EXT_disjoint_timer_query", "GL_KHR_debug", "GL_EXT_YUV_target", "GL_EXT_sRGB_write_control", "GL_EXT_texture_norm16", "GL_EXT_discard_framebuffer", "GL_OES_surfaceless_context", "GL_OVR_multiview", "GL_OVR_multiview2", "GL_EXT_texture_sRGB_R8", "GL_KHR_no_error", "GL_EXT_debug_marker", "GL_OES_EGL_image_external_essl3", "GL_OVR_multiview_multisampled_render_to_texture", "GL_EXT_buffer_storage", "GL_EXT_external_buffer", "GL_EXT_blit_framebuffer_params", "GL_EXT_clip_cull_distance", "GL_EXT_protected_textures", "GL_EXT_shader_non_constant_global_initializers", "GL_QCOM_texture_foveated", "GL_QCOM_texture_foveated_subsampled_layout", "GL_QCOM_shader_framebuffer_fetch_noncoherent", "GL_QCOM_shader_framebuffer_fetch_rate", "GL_EXT_memory_object", "GL_EXT_memory_object_fd", "GL_EXT_EGL_image_array", "GL_NV_shader_noperspective_interpolation", "GL_KHR_robust_buffer_access_behavior", "GL_EXT_EGL_image_storage", "GL_EXT_blend_func_extended", "GL_EXT_clip_control", "GL_OES_texture_view", "GL_EXT_fragment_invocation_density", "GL_QCOM_motion_estimation", "GL_QCOM_validate_shader_binary", "GL_QCOM_YUV_texture_gather"], "screenDensity": 440, 
"sdkVersion": 31
}
```

> 从生成的 json 文件中可以看出，该设备当前添加支持的地区语言为中文、阿语和英语。所以在之前生成的 APK 中，也包含这三种语言的 APK。

#### 带签名

通过 bundletool 将 aab 转为一组 apk，也就是 apks，签名配置可不填，不填则使用默认的 debug 签名。

```shell
java -jar [ bundletool 文件] build-apks --bundle [ aab 文件] --output [ apks 文件]
> --ks=[签名文件]
> --ks-pass=[签名密码]
> --ks-key-alias=[别名]
> --key-pass=[别名密码]
```

- `--ks` 签名文件的全路径
- `--ks-pass` 签名文件密码，可以使用 `pass:xxx` 指定明文密码，也可以使用 `file:xxx` 指定文件密码
- `--ks-key-alias` 签名别名
- -`-key-pass` 签名密码，可以使用 `pass:xxx` 指定明文密码，也可以使用 `file:xxx` 指定文件密码
- `--connected-device` 只生成和设备相关的，体积可以小很多

**示例：**

```shell
java -jar bundletool. Jar build-apks --bundle app-realease.aab --output app-output.apks --ks=d:\test. Keystore --ks-pass=123456 --ks-key-alias=com.test.app --key-pass=123456
```

### 将 APKS 部署到连接设备：`install-apks`

在生成 APKS 文件以后，使用以下命令可以将 APKS  文件部署到当前所连接的设备上：

> `java -jar [ bundletool 文件] install-apks --apks [ apks 文件]`

- `--apks` 指定已经存在的 apk set
- `--device-id`= `serial-id` 多个设备连接，指定 deviceId

示例：

```shell
java -jar bundletool.jar install-apks --apks app-output.apks
```

安装成功后，我们可以使用 adb 命令来确认是否成功安装配置 APK：

```shell
adb shell pm path "包名"
# 或者
adb shell dumpsys package 包名 | findstr split
```

### 从现有的 APKS 中提取设备专用 APK： `extract-apks`

```shell
bundletool extract-apks \
--apks=/MyApp/my_existing_APK_set.apks \
--output-dir=/MyApp/my_pixel2_APK_set.apks \
--device-spec=/MyApp/bundletool/pixel2.json
```

示例：

```shell
java -jar bundletool-xxx. Jar extract-apks --apks=my.apks --output-dir=my.aab --device-spec=xxx.json
```

- 其中 json 文件可以手动创建，也可以根据已连接的 adb 设备自动创建，这里展示一下手动创建的参数格式

```json
{
  "supportedAbis": ["arm64-v8a", "armeabi-v7a"],
  "supportedLocales": ["en", "fr"],
  "screenDensity": 640,
  "sdkVersion": 27
}
```

### [预估打包成aab格式后下载文件的大小](https://developer.android.com/tools/bundletool#measure_size)： `get-size`

示例：

```shell
java -jar bundletool-xxx.jar get-size total --apks=my.apks
```

### `bundletool` 命令 Shell 脚本

- `bundletool` 脚本

```shell
## 转aab为apks命令并安装
BUNDLE_TOOL_PATH=~/Downloads/software/bundletool-all-1.15.5.jar
function aab:install() {
  keystore=$WORKSPACE_MAIN/xxx/xxx/xxx.keystore
  aab_path=$1 
  aab_name=$(basename $aab_path)
  apks_path=$aab_name.apks
  ### aab转apks
  java -jar $BUNDLE_TOOL_PATH build-apks \
  --bundle=$aab_path \
  --output=$apks_path \
  --ks=$keystore \
  --ks-pass=pass:xxx \
  --ks-key-alias=xxx \
  --key-pass=pass:xxx \
  --connected-device \
  --local-testing

  ### 安装
  apks_path=$aab_name.apks
  java -jar $BUNDLE_TOOL_PATH install-apks --apks=$apks_path
}
## 安装已经存在的apks
function aab:install-apks() {
  apks_path=$1
  java -jar $BUNDLE_TOOL_PATH install-apks --apks=$apks_path
}
## 预估打包成aab格式后下载文件的大小： get-size
function aab:getsize() {
  apks_path=$1
  java -jar $BUNDLE_TOOL_PATH get-size total --apks=$apks_path
}
```

- `install-aab`: [install-aab/install-aab at main · igorcferreira/install-aab · GitHub](https://github.com/igorcferreira/install-aab/blob/main/install-aab)

## 测试 AAB 包

### Google Play Console

使用 Play 管理中心进行测试可以提供最准确的用户体验。

### 上传到 Google Play 测试版本

当您上传应用并在 Play Console 中创建版本时，您可以在发布到生产环境之前通过多个测试阶段来推进您的版本：

### Firebase App Distribution

`Firebase App Distribution` 让您可以轻松地将应用的预发布版本分发给值得信赖的测试人员，以便您可以在发布前获得有价值的反馈。

App Distribution 允许您在中央中心管理所有预发布版本，并且使您可以灵活地直接从控制台或使用已成为工作流程一部分的命令行工具来分发这些版本。

## Code transparency for app bundles AAB 的代码透明度

代码透明度是使用 Android App Bundle 发布的应用程序的可选代码签名和验证机制。它使用代码透明签名密钥，该密钥仅由应用程序开发人员持有。

代码透明度独立于应用程序包和 APK 使用的签名方案。代码透明度密钥是独立的，与使用 Play 应用签名（[Play App Signing](https://developer.android.com/studio/publish/app-signing#app-signing-google-play)）时存储在 Google 安全基础设施上的应用签名密钥不同。

## 签名问题

### Code transparency

[app bundle 的代码透明性机制  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/app-bundle/code-transparency)

#### 什么是 Code transparency?

`Code transparency` 是使用 Android App Bundle 发布的应用程序的可选代码签名和验证机制。它使用 `Code transparency` 签名密钥，该密钥仅由应用程序开发人员持有。

代码透明度独立于应用程序包和 APK 使用的签名方案。代码透明度密钥是独立的，与使用 Play 应用签名时存储在 Google 安全基础设施上的应用签名密钥不同。

#### Code transparency 如何工作？

![|500](https://developer.android.com/static/images/app-bundle/code_transparency_diagram.png)

Code Transparency 是一种确保 Android 应用代码未被篡改的机制。它是为了给终端用户和开发者提供一种额外的保障，保证从应用商店下载的 APK 文件与开发者原本发布的文件相符。Code Transparency 通过以下几个步骤来工作：

1. 生成透明度记录： 开发者在构建 APK 时会生成一个包含 APK 文件的签名指纹和其他相关信息的透明度记录。
2. 将透明度记录加入 APK： 此记录通常以一个附加文件的形式包含在 APK 的签名区块中。
3. 验证透明度记录： 当 APK 被上传到应用商店，如 Google Play 时，商店会对透明度记录进行验证，以确认 APK 自构建以来未经改动。
4. 发布透明度记录信息： 透明度记录的公钥通过应用商店或开发者渠道公布，使任何人都可以验证 APK 的完整性。
5. 应用下载： 当用户从应用商店下载应用时，商店会为 APK 提供相应的透明度记录信息。
6. 用户验证（可选）： 如果用户拥有工具，他们可以使用商店提供的透明度记录和公开的公钥来独立验证下载的 APK 文件是否与发布者提交给应用商店的原始文件哈希相匹配。

这个过程增加了对 APK 方面供应链攻击的保护，这种攻击可能在文件由开发者上传到商店、由商店提供下载之间的任何环节对文件进行篡改。

需要注意的是，Google 并未广泛推广所有应用采用 Code Transparency，而是作为 Advanced Protection Program 的一部分，更多地用于某些需要极高安全性的敏感应用。这样，对技术便捷性要求较高的普通用途应用来说，则大多依靠 Google Play App Signing 和 Play Store 的其他安全措施来保护应用的安全。

### Google App Sign

#### 什么是 Google App Sign

[[Sign your app]]

#### 谷歌签名保护计划

将 APK 上传到 GooglePlay 后，GooglePlay 会替换你的签名，实际上用户下载的 APK 的签名并不是你最初上传的签名，而是 GooglePlay 自己的签名，这个签名存放在 Google 服务器，我们是不能下载的。

**谷歌签名保护计划 ：简单来说就是 开发者上传的应用 会被 Google 重新进行一次签名 采用 Google 的签名。**

**注意：一个应用只能替换一次签名。**

因为 `Google Play线上版本` 和 `本地版本` 的签名不一致，会导致问题:

- **Facebook 登录失败**
- **Google 登录失败**
- **微信登录失败**
- App 无法覆盖安装

#### Google App Sign 导致的问题解决

##### 旧包直接使用 Google App Sign

##### GooglePlay 签名和本地签名一致：把 GooglePlay 的签名换成我们自己的签名

已使用谷歌签名，将其改成自己的签名

第一步：应用签名菜单下，请求升级密钥：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203031.png)

第二步： 选择升级秘钥的原因，你可以选择第二个 " 我需要针对多个应用或此应用的预安装版本使用同一秘钥 "

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203002.png)

第三步：下载工具（`pepk.jar` ）生成签名压缩包，并上传即可。注意，此签名一个应用只能更新一次，只有一次机会哦

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203114.png)

在终端中执行：

```shell
java -jar pepk.jar --keystore=foo.keystore --alias=foo --output=output.zip --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a --signing-keystore=foo.keystore --signing-key-alias=foo

```

参数说明：

- `--keystore`：签名文件所在路径；
- `--alias`：别名；
- `--output`：生成要上传的压缩文件；
- `--signing-keystore`：确认一遍要签名的文件所在路径；
- `--signing-key-alias`：确认一遍别名名称；

注意：要把 `foo.keystore` 换成你的签名，把 `foo` 换成你自己的 `alias` 。

执行完命令，会在本地生成 `output.zip` , 然后上传就可以了。

交成功后可以看到谷歌的签名已经替换成想要的了。与上传签名一致。如图所示：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203304.png)

这样，**本地签名**和 **GooglePlay 签名**已经保持一致。

##### 新发布的应用如何直接选择自身签名

- 首先在自己新建的 APP 下选择 `App integrity` 发布版本

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203915.png)

- 在发布版本时选择 `Manage app signing`

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419203945.png)

- 上传自己的签名

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240419204017.png)

- 下面步骤就和替换 Google Play 签名一样了：[[#GooglePlay 签名和本地签名一致：把 GooglePlay 的签名换成我们自己的签名]]

#### Ref

- [解决Google Play发布应用后Google二次签名和我们当前App中本地自签名不一致问题_更新google play应用两次签名不一致-CSDN博客](https://blog.csdn.net/weixin_39170886/article/details/107062668)
- [Android Google Play app signing 最终完美解决方式_google play store签名可以下载吗-CSDN博客](https://blog.csdn.net/zhaoyanjun6/article/details/105561341)

## AAB 相关库

### `Qigsaw` dynamic delivery 库

Qigsaw 是一套基于 [Android App Bundles](https://developer.android.com/guide/app-bundle/) 实现的 Android 动态组件化方案，它无需应用重新安装即可动态分发插件。

[`Qigsaw`](https://github.com/iqiyi/Qigsaw)

### `AabResguard` aab 混淆

# Ref

- [Android App Bundle 简介  |  Android 开发者  |  Android Developers](https://developer.android.com/guide/app-bundle)

- [ ] [万字详解 Google Play 上架应用标准包格式 AAB](https://juejin.cn/post/7124721130614554637)
