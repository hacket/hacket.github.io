---
date created: 2024-06-04 13:57
date updated: 2024-12-24 00:27
dg-publish: true
---

# TextView富文本

## TextView html

```java
textview.setText(Html.fromHtml("xxx"));
```

需要注意如果定义在strings.xml要支持html标签的话，需要`<![CDATA[`包裹html标签和内容`]]>`<br />如：

```
<string name="task_center_how_to_use1_invite_code_text">
    1.您首次邀请两名好友，将得<![CDATA[<font color=\'#FF0000\'>20元现金</font>]]>奖励，可提现到微信、支付宝，3秒到账！
</string>
```

## 常用的html标签

```
<br> 插入一个换行符。标签是空标签（意味着它没有结束标签，因此这是错误的：<br></br>）    
<p> 定义段落。标签会自动在其前后各添加一个空行    
<h1> 定义最大的标题
<h2> ↓
<h3> ↓
<h4> ↓
<h5> ↓
<h6> 定义最小的标题
<div> 文档分节    
<strong> 把文本定义为语气更强的强调的内容。TextView中表现为文本加粗   
<b> 文本加粗    
<em> 把文本定义为强调的内容。TextView中表现为斜体文本效果。 
<cite> 定义引用。TextView中表现为斜体文本效果。    
<dfn> 标记那些对特殊术语或短语的定义。TextView中表现为斜体文本效果。 
<i> 显示斜体文本效果。   
<big> 呈现大号字体效果    
<small> 呈现小号字体效果    
<strike> 定义删除线样式的文字
<font size="..." color="..." face="..."> 规定文本的字体、字体尺寸、字体颜色 color：文本颜色；size：文本大小；face：文本字体

<blockquote> 将<blockquote> 与 </blockquote> 之间的文本从常规文本中分离出来。

通常在左、右两边进行缩进，有时使用斜体。    

<tt> 呈现类似打字机或者等宽的文本效果    

<a> 定义超链接。最重要的属性是 href 属性，它指示链接的目标。 href：指示链接的目标

<u> 为文本添加下划线    

<sup> 定义上标文本  

<sub> 定义下标文本  

<img src="..."> 向网页中嵌入一幅图像。<img>标签并不会在网页中插入图像，而是从网页上链接图像。<img> 标签创建的是被引用图像的占位空间。 src：图像的url；alt：图像的替代文本
```

## TextView富文本

- [ ] 用TextView实现富文本展示，点击断句和语音播报 <https://juejin.im/post/59f6e2dbf265da432c23228b>

## 富文本小结

1. 自定义emotion显示，这个用SmileUtils.addSmiles低入侵
2. imagespan居中，用fresco中的`用BetterImageSpan`
3. includeFontPadding对span居中有影响，设置为false

span方案：<br /><https://github.com/iwgang/SimplifySpan>

> 有bug，drawable图片高度大于textheight，显示歪了，用BetterImageSpan重写

TODO: 做一个及显示 Emotion、Span 方便调用于一身的库
