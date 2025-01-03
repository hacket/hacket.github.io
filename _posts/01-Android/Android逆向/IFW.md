---
date created: 2024-12-24 00:45
date updated: 2024-12-24 00:45
dg-publish: true
---

# IFW

## 什么是IFW?

IFW 的全称为 Intent Firewall ，非官方中文名为 意图防火墙， 它于 Android 4.4.2 被引入到系统中，Google 没有提供官方 API 和文档来描述此功能，所以目前 IFW 是一个 Undocumented 的功能，它可能随时被更改。

## IFW 的功能

Android 软件通过 Intent （意图） 来启动新活动、新服务等，而 IFW 的功能就是通过 XML 文件的配置，过滤 Intent ，让你不想要使其生效的 Intent 无效化（注意，这个 Intent 实际上还是被发送给系统了）。

IFW 是通过读取并解析存在于 `/data/system/ifw` 中的 XML 规则文件来进行规则过滤的，所有的配置是即时生效的。

## 限制

IFW 仅能通过系统应用和 root 访问进行配置，这也是由于需要保证系统防火墙的配置安全。

IFW 在处理 Intent 时是不考虑来源的，它不去匹配这个 Intent 是来自于谁，它只关心当前 Intent 的去向和细节。

## 基础格式

```xml
<rules>
  <[component] block="[true/false]" log="[true/false]" >
    <intent-filter >
      <action name="[action]" />
    </intent-filter>
  </[component]>
</rules>
```

> 注意 IFW 只解析  标签下的    标签

## 示例：拦截国内启动App

```xml
<rules>
  <activity block="true" log="true">
    <!-- prevent third party website ad from invoking app com.taobao.taobao -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.DEFAULT" />
      <scheme name="taobao" />
    </intent-filter>
    
    <!-- prevent m.taobao.com from invoking app com.taobao.taobao -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="tbopen" />
    </intent-filter>
    
    <!-- prevent m.jd.com from invoking app com.jingdong.app.mall -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="openapp.jdmobile" />
    </intent-filter>
    
    <!-- prevent www.tmall.com from invoking app com.tmall.wireless -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="tmall" />
    </intent-filter>
    
    <!-- prevent m.douban.com from invoking app com.douban.frodo -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="douban" />
    </intent-filter>
    
    <!-- prevent wap.ha.10086.cn from invoking com.xinhang.mobileclient -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.DEFAULT" />
      <scheme name="hnmcc" />
    </intent-filter>

    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="hnmcc" />
    </intent-filter>

    <!-- prevent com.zhihu from being invoked by other apps -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.DEFAULT" />
      <scheme name="zhihu" />
    </intent-filter>

    <!-- prevent com.tencent.qqlive from being invoked by other apps -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="tenvideo2" />
    </intent-filter>

    <!-- prevent com.taobao.idlefish from being invoked by other apps -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="fleamarket" />
    </intent-filter>

    <!-- prevent com.tencent.qqmusic from being invoked by other apps -->
    <intent-filter>
      <action name="android.intent.action.VIEW" />
      <cat name="android.intent.category.BROWSABLE" />
      <scheme name="qqmusic" />
    </intent-filter>
    
    <!-- only prevent intent from other non-system app. intent from the same app will not be blocked  -->
    <not>
      <sender type="userId" />
    </not>
  </activity>
</rules>
```

> <https://github.com/lwmv/ifw/blob/master/myifw.xml>

## Ref

- [x] 这也许是一篇 IFW 科普<br /><https://bbs.letitfly.me/d/395>
