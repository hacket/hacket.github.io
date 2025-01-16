---
date created: 星期四, 八月 15日 2024, 9:40:00 晚上
date updated: 星期一, 一月 6日 2025, 9:53:56 晚上
title: Span开源库
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Span 开源库]
linter-yaml-title-alias: Span 开源库
---

# Span 开源库

## `spannable`

支持正则匹配/图文混排/图标/GIF 动画/自定义表情包。

![image.png|700](https://cdn.nlark.com/yuque/0/2023/png/694278/1689441477164-ccf5ca69-ac80-44da-b830-09026a8e42ea.png#averageHue=%23f8f8f7&clientId=u63521271-dfe4-4&from=paste&height=662&id=u421bfcd2&originHeight=1806&originWidth=1184&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=508360&status=done&style=none&taskId=u6de2be81-ce8d-49e9-8db2-3932a37afa5&title=&width=434)

- [GitHub - liangjingkanji/spannable: Android最好的Spannable富文本工具, 唯一支持正则匹配/图文混排/图标/GIF动画/自定义表情包](https://github.com/liangjingkanji/spannable)

## SimplifySpan

**示例：**

```kotlin
private fun getSpanText(  
    textview: TextView,  
    listener: OnClickableSpanListener  
): SpannableStringBuilder {  
    val linkNorTextColor = -0xb7c275  
    val linkPressBgColor = -0x783106  
  
    val spanBuild = SimplifySpanBuild()  
    spanBuild.append("无默认背景11]")  
        .append(  
            SpecialImageUnit(  
                applicationContext,  
                BitmapFactory.decodeResource(resources, R.drawable.level)  
            )  
                .setGravity(SpecialGravity.CENTER)  
  
        )  
        .append(  
            SpecialTextUnit("[点我点我000").setClickableUnit(  
                SpecialClickableUnit(  
                    textview,  
                    listener  
                ).setTag("1").setPressBgColor(-0xb000)  
            ).setTextColor(  
                Color.BLUE  
            )  
        )  
        .appendMultiClickable(  
            SpecialClickableUnit(textview, listener).setNormalTextColor(linkNorTextColor)  
                .setPressBgColor(linkPressBgColor),  
            " ",  
            SpecialImageUnit(  
                applicationContext,  
                BitmapFactory.decodeResource(resources, R.drawable.level),  
                80,  
                50  
            )  
                .setGravity(SpecialGravity.CENTER),  
            SpecialTextUnit(" 用户名 ")  
        )  
        .append(  
            SpecialTextUnit("[点我点我1").setClickableUnit(  
                SpecialClickableUnit(  
                    textview,  
                    listener  
                ).setTag("1").setPressBgColor(-0xb000)  
            ).setTextColor(  
                Color.BLUE  
            )  
        )  
        .append("哈哈哈")  
        .append(  
            SpecialTextUnit("[括号内测试富文本跨行显示，颜色红色]").setClickableUnit(  
                SpecialClickableUnit(  
                    textview,  
                    listener  
                ).setTag("1").setPressBgColor(-0xb000)  
            ).setTextColor(Color.RED)  
        )  
        .append("无默认背景显示下划线")  
        .append(  
            SpecialImageUnit(  
                applicationContext,  
                BitmapFactory.decodeResource(resources, R.drawable.level)  
            )  
                .setGravity(SpecialGravity.CENTER)  
  
        )  
        .append(  
            SpecialTextUnit("点我点我2").setClickableUnit(  
                SpecialClickableUnit(textview, listener).setTag("2").showUnderline()  
                    .setPressBgColor(-0xb000).setPressTextColor(  
                        Color.WHITE  
                    )  
            ).setTextColor(-0xb000)  
        )  
        .append("有默认背景")  
        .append(  
            SpecialImageUnit(  
                applicationContext,  
                BitmapFactory.decodeResource(resources, R.drawable.level),  
                120,  
                120  
            )  
                .setGravity(SpecialGravity.CENTER)  
  
        )  
        .append(  
            SpecialTextUnit("点我点我3").setClickableUnit(  
                SpecialClickableUnit(textview, listener).setTag("3").setPressBgColor(  
                    Color.BLUE  
                ).setPressTextColor(Color.WHITE)  
            ).setTextColor(-0xb000).setTextBackgroundColor(-0x783115)  
        )  
        .append(  
            SpecialImageUnit(  
                applicationContext,  
                BitmapFactory.decodeResource(resources, R.drawable.level),  
                180,  
                180  
            )  
                .setGravity(SpecialGravity.CENTER)  
  
        )  
        .append("我只是个结尾")  
    return spanBuild.build()  
}
```

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240604161254.png)

- [GitHub - iwgang/SimplifySpan: A easy-to-use and powerful Spannable library](https://github.com/iwgang/SimplifySpan)

## Html 富文本

xiyin 用的这个：[[Android-Rich-text-Editor/ARE/are/src/main/java/com/chinalwb/are/android/inner/Html.java at master · chinalwb/Android-Rich-text-Editor · GitHub](Html.java)](<https://github.com/chinalwb/Android-Rich-text-Editor/blob/master/ARE/are/src/main/java/com/chinalwb/are/android/inner/Html.java>)
