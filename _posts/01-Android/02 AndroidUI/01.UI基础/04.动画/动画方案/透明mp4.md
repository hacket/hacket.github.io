---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# 透明视频

## 使用案例

- 陌陌

> 陌陌的资源目录 sdcard/immomo/gift_video_effect/..

## 开源

- Mp4Composer-android

> <https://github.com/MasayukiSuda/Mp4Composer-android，基于MediaPlayer>

- ExoPlayerFilter<br /><https://github.com/lvpengwei/ExoPlayerFilter>

> remix用的这个，基于ExoPlayer

- AlphaPlayer<br /><https://github.com/bytedance/AlphaPlayer>
- VAP<br /><https://github.com/Tencent/vap>

> VAP是企鹅电竞开发，用于播放特效动画的实现方案。具有高压缩率、硬件解码等优点。同时支持 iOS,Android,Web 平台。;而且VAP还能在动画中融入自定义的属性（比如用户名称, 头像）

- Android播放透明视频<br /><https://blog.csdn.net/ywl5320/article/details/108812241>

## 注意

1. 视频编码手机默认的MediaPlayer兼容有很大问题
2. 集成了exoplayer后会增大apk体积大概0.4M

### 兼容问题

1. 视频编码问题。采用系统MediaPlayer播放的话，设计采用MPEG-2编码的格式的mp4文件，在有些手机是不支持的，大部分手机用H.264都支持（mpeg-2比h.264文件要小很多）
2. 视频尺寸问题。oppo a37播不了长尺寸视频，替换exoplayer后oppo a37能播短尺寸+h.264的，长尺寸和mpeg-2的都播不了；如果mp4文件的尺寸太大(1440x1560)，会出现有声音没画面的现象，改短一点尺寸(1440x1280)就可以了（如vivo x5 pro）
3. GalaxyA10系统播放器不支持h.264的视频，mpeg-2也不支持

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214346395-8b793303-83ff-4432-827f-65b0214bf36d.png#averageHue=%23f2f2f2&clientId=u65f584b9-48b2-4&from=paste&height=395&id=u6f3c46c8&originHeight=790&originWidth=504&originalType=binary&ratio=2&rotation=0&showTitle=false&size=73206&status=done&style=none&taskId=u3833d4c5-fc72-4503-a5a2-c1a3e6aad83&title=&width=252)<br />![](http://note.youdao.com/yws/res/31660/D5F94A8217F24A868498B0EAC1AE0FEE#id=lGDBE&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=240)

### 读取alpha通道有问题

存在的问题：安卓版本读取alpha通道有问题<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214354202-56cde7e8-40fb-4fed-9fde-850f72d9d1b1.png#averageHue=%23419fc0&clientId=u65f584b9-48b2-4&from=paste&height=249&id=u249bfd25&originHeight=498&originWidth=310&originalType=binary&ratio=2&rotation=0&showTitle=false&size=153469&status=done&style=none&taskId=u12d92bea-4802-4b1b-b6b7-5ebb3aa7808&title=&width=155)<br />![](http://note.youdao.com/yws/res/32864/9CE5269471204011A7CA5C939C368B15#id=QxaJT&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

正确的是 黑色部分 应该全透明；纯白→纯黑   0％透明度→100％透明度

- 以`超级跑车-陌陌1440_1280.mp4`为例<br />Android:<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214362864-5a46d87d-dfc4-4f82-88a3-54329e10d796.png#averageHue=%23419fc0&clientId=u65f584b9-48b2-4&from=paste&height=249&id=ue6963756&originHeight=498&originWidth=310&originalType=binary&ratio=2&rotation=0&showTitle=false&size=153469&status=done&style=none&taskId=u38273c39-698d-4940-844c-528c430ddeb&title=&width=155)<br />iOS:<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214391612-6aae1437-8f7e-41f3-8618-af2c56c05f97.png#averageHue=%23286495&clientId=u65f584b9-48b2-4&from=paste&height=640&id=ub3e0c961&originHeight=1280&originWidth=720&originalType=binary&ratio=2&rotation=0&showTitle=false&size=787733&status=done&style=none&taskId=ue735399b-6bf8-4e8c-a18d-f5e7d5d0886&title=&width=360)<br />![](http://note.youdao.com/yws/res/32859/9D50B0A2F5E047FABB04FD3FCC1107FA#id=q2DLH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
- 糖果色摩天轮_2_x264.mp4

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688214413563-cd7f4c6d-384c-44b2-ac72-c1ba1a5f07dd.png#averageHue=%2352876e&clientId=u65f584b9-48b2-4&from=paste&height=396&id=uf549bbcd&originHeight=792&originWidth=822&originalType=binary&ratio=2&rotation=0&showTitle=false&size=936579&status=done&style=none&taskId=ub7e45c0f-6d31-4267-af3e-8b859ef5520&title=&width=411)

- 一箭穿心<br /><https://oss.mashichat.com/img/gift/50VB33Q4YKL3P2N6.mp4>

[![一箭穿心.mp4 (2.7MB)](https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*NNs6TKOR3isAAAAAAAAAAABkARQnAQ)]()## Ref

- 企鹅电竞动效揭秘<br /><http://dopro.io/egame-animate.html>
- 精准光影动效解决之道-透明视频<br /><http://dopro.io/animation-solution-alpha-video.html>

# VAP

<https://github.com/Tencent/vap>

## 相比SVGA的效率提升有多少

```
1 原理：
svga 原理与lottie相识，都是矢量动画方案，都是使用CPU进行绘制（开启硬件加速也只是canvas的硬件加速），从实现原理上来说，支持的特效样式有限，而且复杂动画性能低下（这个只测试了lottie，结论不一定适用svga）。

2 单帧解码时间对比：
矢量动画使用CPU做复杂动画与GPU播放视频（vap实质是视频方案）单帧耗时对比，CPU可能需要10+ms，动画越复杂时间越长（当然简单的矢量动画效率会更高，但限定在简单的动画效果，这个只测试了lottie，结论不一定适用svga）；而视频解码1-3ms，无论内容多复杂，视频解码时间基本不会有太大波动。

3 实现效果上对比：
矢量动画方案天生决定某些特效无法支持，或者说代价异常高（比如复杂的粒子特效）。而vap实质是视频方案，理论上所有的视觉特效都能支持。
```

## Vap坑

### VAP 播放 Assets 目录下的视频一定的几率失败

#### 问题描述

- 在Assets目录下的同一个视频文件反复播放，间隔100毫秒（不同视频文件连续播放也会，即使增加播放时间间隔到2s），有一定的概率会出现：MediaExtractor exception：Failed to instantiate extractor

> 除了 Failed to instantiate extractor ，其他异常也很多。大部分没问题，偶尔就会出现异常

#### 运行环境

- Android 11 Google Pixel 3，但是其他所有手机也会这样，不同的系统版本都会

#### 相关日志

```
2021-04-29 11:37:21.635 24084-26873/? E/AnimPlayer.HardDecoder: MediaExtractor exception e=java.io.IOException: Failed to instantiate extractor.
java.io.IOException: Failed to instantiate extractor.
at android.media.MediaExtractor.setDataSource(Native Method)
at com.tencent.qgame.animplayer.file.AssetsFileContainer.setDataSource(AssetsFileContainer.kt:42)
at com.tencent.qgame.animplayer.util.MediaUtil.getExtractor(MediaUtil.kt:40)
at com.tencent.qgame.animplayer.HardDecoder.startPlay(HardDecoder.kt:83)
at com.tencent.qgame.animplayer.HardDecoder.access$startPlay(HardDecoder.kt:28)
at com.tencent.qgame.animplayer.HardDecoder$start$1.run(HardDecoder.kt:44)
at android.os.Handler.handleCallback(Handler.java:938)
at android.os.Handler.dispatchMessage(Handler.java:99)
at android.os.Looper.loop(Looper.java:223)
at android.os.HandlerThread.run(HandlerThread.java:67)
```

#### 播放失败的文件

> file:///android_assets/pk/live_pk_begin.mp4

#### 问题分析

- 1.通过Vap播放失败回调接口上报数据，并分析

> QbStatService.onEvent("vap_play_failed", mAnimResPath, code, msg);

- 2.从[数据](http://elk.moumentei.com/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-60d,mode:quick,to:now))&_a=(columns:!(e_e1,e_e2,e_e3),index:'logstash-qba-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:vap_play_failed)),sort:!('@timestamp',desc)))来看，99.9% 都是播放Assets目录下的资源
- 3.从vap的[issue](https://github.com/Tencent/vap/issues/38#issuecomment-748717708)作者的回答可以佐证

> 播放接口：fun startPlay(assetManager: AssetManager, assetsPath: String)

> 这里应该MediaExtractor的兼容问题，目前想到的解决方法是手动实现mp4封装，但工作量比较大，手动实现mp4解封装需要充分测试

#### 解决方案

- 1.应用启动时将vap视频资源从assets目录拷贝到sdcard
- 2.播放vap视频路径改为 fun startPlay(file: File) 的方式

#### 个人猜想

- 1.存放在assets目录下的文件，在编译打包时会将文件压缩以降低安装包大小，使用或者读取数据时需要先解压。所以播放sdcard下的文件没问题。

> [Android 文件大小限制](https://www.cnblogs.com/jacktu/archive/2012/06/29/2570075.html) 在Android 2.3以前的任何压缩的资源的原始大小超过1M将不能从APK中读出，如果你使用AssetManager 或 Resources classes方法来获取InputStream，将抛出java.io.IOException的异常如下 DEBUG/asset(1123): Data exceeds。

```
       /* these formats are already compressed, or don't compress well */ 
　　static const char* kNoCompressExt[] = { 
　　".jpg", ".jpeg", ".png", ".gif", 
　　".wav", ".mp2", ".mp3", ".ogg", ".aac", 
　　".mpg", ".mpeg", ".mid", ".midi", ".smf", ".jet", 
　　".rtttl", ".imy", ".xmf", ".mp4", ".m4a", 
　　".m4v", ".3gp", ".3gpp", ".3g2", ".3gpp2", 
　　".amr", ".awb", ".wma", ".wmv" 
　　};
```

> 从上面截图来看，我们已经是.mp4文件后缀了，应该不在压缩的资源之列。那么问题来了，到底哪里出轨了？

- 2.[有网友提到没有使用FileDescriptor](http://www.voidcn.com/article/p-bjtmejdh-bwb.html)，但是Vap播放Assets目录下的vap视频就是用的 FileDescriptor，问题也不在这里。

```
class AssetsFileContainer(assetManager: AssetManager, assetsPath: String): IFileContainer {

    ...

    private val assetFd: AssetFileDescriptor = assetManager.openFd(assetsPath)
    private val assetsInputStream: AssetManager.AssetInputStream =
        assetManager.open(assetsPath, AssetManager.ACCESS_STREAMING) as AssetManager.AssetInputStream

   ...
```
