---
date created: 2024-12-08 21:28
date updated: 2024-12-26 00:02
dg-publish: true
---

# viewport

## viewport背景

一个移动专属的Meta值，用于定义视口的各种行为；该特性最先由Apple引入，用于解决移动端的页面展示问题。

- 为什么需要引入viewport？

我们知道用户大规模使用手机等移动设备来进行网页浏览器，其实得益于智能手持设备的兴起，也就是近几年的事。（还记得不久前的几年，满大街都还是诺基亚的天下么？）
这时有一个很现实的问题摆在了厂商面前，用户并不能很好地通过手机等设备访问网页，因为屏幕太小。

## 几个概念

### layout viewport (布局视口)

Apple也发现了 `用户并不能很好地通过手机等设备访问网页，因为屏幕太小` 这个问题，并且适时的出现，它提出了一个方案用来解决这个问题。在iOS Safari中定义了一个`viewport meta`标签，用来创建一个虚拟的`布局视口（layout viewport）`，而这个视口的分辨率接近于PC显示器，Apple将其定义为980px（其他厂商各有不同①）
这就很好的解决了早期的页面在手机上显示的问题，由于两者之间的宽度趋近，CSS只需要像在PC上那样渲染页面就行，原有的页面结构不会被破坏。

> 数值不一定持续准确，厂商可能更改，但这个绝对值其实并非特别重要： iOS, Android基本都是: 980px BlackBerry: 1024px

### visual viewport (视觉视口)

有了layout viewport(布局视口)，我们还需要一个视口用来承载它，这个视口可以简单的认为是手持设备物理屏幕的可视区域，我们称之为（视觉视口）visual viewport。这是一个比较直观的概念，因为你能看得见你的手机屏幕。
对于`visual viewport`，开发者一般只需要知道它的存在和概念就行，因为无法对它进行任何设置或者修改。很明显，`visual viewport`的尺寸不会是一个固定的值，甚至每款设备都可能不同。大致列几种常见设备的visual viewport尺寸：

- iPhone4: `320*480px`
- iPhone5/SE: `320*568px`
- iPhone6/6s/7/8: `375*667px`
- iPhone6/6s/7/8Plus: `414*736px`
- iPhoneX: `375*812px`

以iPhone4S为例，会在其320px②的`visual viewport(视觉视口)`上，创建一个宽980px的`layout viewport(布局视口)`，于是用户可以在`visual viewport(视觉视口)`中拖动或者缩放网页，来获得良好的浏览效果；布局视口用来配合CSS渲染布局，当我们定义一个容器的宽度为100%时，这个容器的实际宽度是980px而不是320px，通过这种方式大部分网页就能以缩放的形式正常显示在手机屏幕上了。

> ②：早期移动前端开发工程师常能见到宽640px的设计稿，原因就是UI工程师以物理屏幕宽度为320px的iPhone4-iPhone5S作为参照设计； 当然，现在你还可能会见到750px和1242px尺寸的设计稿，原因当然是iPhone6的出现 当然，为了更好的适配移动端或者只为移动端设计的应用，单有布局视口和视觉视口还是不够的。

### ideal viewport(完美视口)

还需要一个视口，它类似于布局视口，但宽度和视觉视口相同，这就是`完美视口（ideal viewport）`。
有了完美视口，用户不用缩放和拖动网页就能够很好的进行网页浏览。而完美视口也是通过viewport meta的某种设置来达到。

## viewport特性

**通常情况下**，viewport有以下6种设置。当然厂商可能会增加一些特定的设置，比如iOS Safari7.1增加了一种在网页加载时隐藏地址栏与导航栏的设置：minimal-ui，不过随后又将之移除了。
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240228101433.png)

### width/height

width被用来定义`layout viewport(布局视口)`的宽度，如果不指定该属性（或者移除viewport meta标签），则layout viewport宽度为厂商默认值。如：iPhone为980px；

```html
<meta name="viewport" content="width=device-width" />
```

此时的`layout viewport(布局视口)`将成为`ideal viewport(完美视口)`，因为`layout viewport(布局视口)`宽度与设备视觉视口(visual viewport)宽度一致了。
除了width之外，还有一个属性定义也能实现`ideal viewport(完美视口)`，那就是`initial-scale`。

height: 与width类似，但实际上却不常用，因为没有太多的use case。

### initial-scale

如果想页面默认以某个比例放大或者缩小然后呈现给用户，那么可以通过定义`initial-scale`来完成。

initial-scale用于指定页面的初始缩放比例，假定你这样定义：

```html
<meta name="viewport" content="initial-scale=2" />
```

用户将会看到2倍大小的页面内容。
initial-scale也能实现`ideal viewport(完美视口)`，是的，你只需要这样做，也可以得到完美视口：

```html
<meta name="viewport" content="initial-scale=1" />
```

### maximum-scale/minimum-scale

在移动端，你可能会考虑用户浏览不便，然后给予用户放大页面的权利，但同时又希望是在一定范围内的放大，这时就可以使用maximum-scale来进行约束。

maximum-scale用于指定用户能够放大的比例。

```html
<meta name="viewport" content="initial-scale=1,maximum-scale=5" />
```

页面的默认缩放值`initial-scale`是1，用户最终能够将页面放大到这个初始页面大小的5倍。

minimum-scale：类似maximum-scale的描述，不过minimum-scale是用来指定页面缩小比例的。通常情况下，为了有更好地体验，不会定义该属性的值比1更小，因为那样页面将变得难以阅读。

### user-scalable

如果你不想页面被放大或者缩小，通过定义user-scalable来约束用户是否可以通过手势对页面进行缩放即可。
该属性的默认值为yes，即可被缩放（如果使用默认值，该属性可以不定义）；当然，如果你的应用不打算让用户拥有缩放权限，可以将该值设置为no。

```html
<meta name="viewport" content="user-scalable=no" />
```

## 小结

在移动端，无论你给viewport设置宽多少，如果没有指定默认的缩放值，则移动端浏览器会自动计算这个缩放值，以达到当前页面不会出现横向滚动条（或者说，viewport的宽度就是屏幕的宽度）

### **推荐设置一：** layout和visual viewport一样

设置layout viewport(布局视口)等于设备视觉视口(visual viewport)宽度， 此时给页面设置百分比布局：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

Vue移动端项目默认设置：

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

### 推荐设置二：

设置layout viewport(布局视口)固定宽度, 此时不可以设置 initial-scale，max-scale，min-scale, 利用手机的自动缩放来使用手机屏幕， 此时的元素100%宽度，表示设置固定的宽度

```html
<meta name="viewport" content="width=640,  user-scalable=no">
```
