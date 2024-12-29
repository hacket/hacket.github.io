---
date created: 2024-12-24 00:26
date updated: 2024-12-24 00:26
dg-publish: true
---

# 如何选择 compileSdkVersion, minSdkVersion 和 targetSdkVersion

`compileSdkVersion`<br />用哪个Android SDK版本来编译你的应用，如果需要使用高版本的API，就需要把compileSdkVersion升级到对应的高版本。改变compileSdkVersion，**仅仅是改变编译的版本，不会改变应用运行时的展现，但是新的警告或者报错可能会出现**。不会包含到你的应用中，它只是纯粹的编译应用，当编译时期遇见的错误和警告，最好的解决方案就是修复它们。

强烈推荐把你的compileSdkVersion设置为最新的，用新的sdk编译应用，会检查最新的sdk对现有的代码的影响，避免使用过时的api，并且准备使用的最新的API,那样会使你的应用兼容性更加健壮。

如果你使用了[Support Library](http://developer.android.com/tools/support-library/index.html?utm_campaign=adp_series_sdkversion_010616&utm_source=medium&utm_medium=blog)，必须使用最新的sdk进行编译。

`minSdkVersion`<br />**minSdkVersion 则是应用可以运行的最低要求**。minSdkVersion 是 Google Play 商店用来判断用户设备是否可以安装某个应用的标志之一。

`targetSdkVersion`<br />**targetSdkVersion是Android提供向前兼容的主要依据**，在应用的targetSdkVersion没有更新之前，Android系统不会应用最新的行为变化。如果更新到最新的targetSdkVersion，然后随着Android系统的升级，应用的行为变化会随着targetSdkVersion的升级而变为对应版本的行为。**请一定在更新 targetSdkVersion 之前做测试！**

参考：<br />[如何选择 compileSdkVersion, minSdkVersion 和 targetSdkVersion](http://chinagdg.org/2016/01/picking-your-compilesdkversion-minsdkversion-targetsdkversion/)<br />[Android targetSdkVersion 原理](http://www.race604.com/android-targetsdkversion/)<br />[Support 库版本对应](http://developer.android.com/intl/zh-cn/tools/support-library/index.html?utm_campaign=adp_series_sdkversion_010616&utm_source=medium&utm_medium=blog)
