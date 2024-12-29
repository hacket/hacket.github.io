---
date created: 2024-12-25 00:48
date updated: 2024-12-25 00:51
dg-publish: true
tags:
  - '#ffffff;'
  - '#ffffff'
---

# CSS基础

# CSS颜色

指定颜色是通过使用`预定义的颜色名称`，或 `RGB`、`HEX`、`HSL`、`RGBA`、`HSLA` 值。

## CSS颜色表示

### CSS 颜色名

在 CSS 中，可以使用颜色名称来指定颜色：

```html
<!DOCTYPE html>
<html>
<body>

<h1 style="background-color:Tomato;">Tomato</h1>
<h1 style="background-color:Orange;">橙色</h1>
<h1 style="background-color:DodgerBlue;">DodgerBlue</h1>
<h1 style="background-color:MediumSeaGreen;">MediumSeaGreen</h1>
<h1 style="background-color:Gray;">Gray</h1>
<h1 style="background-color:SlateBlue;">SlateBlue</h1>
<h1 style="background-color:Violet;">Violet</h1>
<h1 style="background-color:LightGray;">LightGray</h1>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703952580223-101e3e3c-232a-4d5a-a9a8-26c69db86f09.png#averageHue=%23ffa500&clientId=u0fd99950-0c58-4&from=paste&height=280&id=uac9e4715&originHeight=798&originWidth=1032&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10871&status=done&style=stroke&taskId=u79599229-86b8-4980-8b72-9c0cbd3916e&title=&width=362)<br />CSS/HTML 支持 [140 种标准颜色名](https://www.w3schools.cn/colors/colors_names.html)。

### CSS RGB 颜色

rgb(red, green, blue) 每个参数 (red、green 以及 blue) 定义了 0 到 255 之间的颜色强度。<br />例如，rgb(255, 0, 0) 显示为红色，因为红色设置为最大值（255），其他设置为 0。<br />要显示黑色，请将所有颜色参数设置为 0，如下所示：rgb(0, 0, 0)。<br />要显示白色，请将所有颜色参数设置为 255，如下所示：rgb(255, 255, 255)。

#### RGBA 值

RGBA 颜色值是具有 alpha 通道的 RGB 颜色值的扩展 - 它指定了颜色的不透明度。<br />RGBA 颜色值指定为：<br />`rgba(red, green, blue, alpha)` alpha 参数是介于 0.0（完全透明）和 1.0（完全不透明）之间的数字：

> rgba(255, 99, 71, 0.4)

### CSS HEX 颜色 （十六进制）

在 CSS 中，可以使用以下格式的十六进制值指定颜色：<br />`#rrggbb`<br />其中 rr（红色）、gg（绿色）和 bb（蓝色）是介于 00 和 ff 之间的十六进制值（与十进制 0-255 相同）。

### CSS HSL 颜色

在 CSS 中，可以使用色相、饱和度和明度（HSL）来指定颜色，格式如下：<br />`hsl(hue, saturation, lightness)`

- 色相（hue）是色轮上从 0 到 360 的度数。0 是红色，120 是绿色，240 是蓝色。
- 饱和度（saturation）是一个百分比值，0％ 表示灰色阴影，而 100％ 是全色。
- 亮度（lightness）也是百分比，0％ 是黑色，50％ 是既不明也不暗，100％是白色。

#### 饱和度

饱和度可以描述为颜色的强度。

- 100％ 是纯色，没有灰色阴影
- 50％ 是 50％ 灰色，但是您仍然可以看到颜色。
- 0％ 是完全灰色，您无法再看到颜色。

## CSS 背景色 `background-color`

可以为 HTML 元素设置背景色：

```html
<!DOCTYPE html>
<html>
<body>

<h1 style="background-color:DodgerBlue;">Hello World</h1>

<p style="background-color:Tomato;">
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</p>

</body>
</html>
```

## CSS 文本颜色 `color`

```html
<!DOCTYPE html>
<html>
<body>

<h3 style="color:Tomato;">Hello World</h3>

<p style="color:DodgerBlue;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

<p style="color:MediumSeaGreen;">Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

</body>
</html>
```

## CSS 边框颜色

```html
<!DOCTYPE html>
<html>
<body>

<h1 style="border: 2px solid Tomato;">Hello World</h1>

<h1 style="border: 2px solid DodgerBlue;">Hello World</h1>

<h1 style="border: 2px solid Violet;">Hello World</h1>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703952874274-00727e25-c973-4657-8fba-435bd9674c94.png#averageHue=%231e1b1a&clientId=u0fd99950-0c58-4&from=paste&height=135&id=uaa615cb0&originHeight=337&originWidth=1261&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4893&status=done&style=stroke&taskId=ue6a4bbd7-99b7-4cc7-bb9e-d391010b589&title=&width=506)

# CSS背景

## CSS 背景颜色

- `background-color` 属性指定元素的背景色。

```css
h1 {
  background-color: green;
}
div {
  background-color: lightblue;
}
p {
  background-color: yellow;
}
```

- ` opacity  `不透明度 / 透明度，指定元素的不透明度/透明度。取值范围为 0.0 - 1.0。值越低，越透明：

```css
div {
  background-color: green;
  opacity: 0.3;
}
```

注意：使用 opacity 属性为元素的背景添加透明度时，其所有子元素都继承相同的透明度。这可能会使完全透明的元素内的文本难以阅读。<br />也可以使用 RGBA 的透明度：

```css
div {
  background: rgba(0, 128, 0, 0.3) /* 不透明度为 30% 的绿色背景 */
}
```

## CSS 背景图像

`background-image` 属性指定用作元素背景的图像。默认情况下，图像会重复，以覆盖整个元素。

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  background-image: url("paper.gif");
}
</style>
</head>
<body>

<h1>Hello World!</h1>

<p>这个页面有一个图像作为背景！</p>

</body>
</html>
```

## CSS 背景重复

- 指定重复方向：水平、垂直

默认情况下，`background-image` 属性在水平和垂直方向上都重复图像。<br />某些图像应只适合水平或垂直方向上重复，否则它们看起来会很奇怪，如下所示：

```css
body {
  background-image: url("gradient_bg.png");
}
```

如果上面的图像仅在水平方向重复 (`background-repeat: repeat-x;`)，则背景看起来会更好：

```css
body {
  background-image: url("gradient_bg.png");
  background-repeat: repeat-x;
}
```

如需垂直重复图像，请设置 `background-repeat: repeat-y;`

- 仅展示一次图像：`no-repeat`

```css
body {
  background-image: url("img_tree.png");
  background-repeat: no-repeat;
}
```

- 指定背景图像的位置：`background-position`

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-image: url("img_tree.png");
        background-repeat: no-repeat;
        background-position: right top;
        margin-right: 200px;
      }
    </style>
  </head>
  <body>

    <h1>Hello World!</h1>
    <p>W3Schools背景不再重复，设置位置示例。</p>
    <p>现在背景图像只显示一次，并且远离文本。</p>
    <p>在本例中，我们还在右侧添加了边距，因此背景图像永远不会干扰文本。</p>

  </body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703953943256-0576360d-f522-4f06-a9d2-7c89f3a4c70b.png#averageHue=%231a1918&clientId=u0fd99950-0c58-4&from=paste&height=243&id=u99c9d95f&originHeight=559&originWidth=1252&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=58472&status=done&style=stroke&taskId=u35ad7f1e-27fb-405d-8c13-9faec92f697&title=&width=544)

## CSS 背景附着

`background-attachment` 属性指定背景图像是应该滚动还是固定的（不会随页面的其余部分一起滚动）：

- 指定应该固定背景图像：

```css
body {
  background-image: url("img_tree.png");
  background-repeat: no-repeat;
  background-position: right top;
  background-attachment: fixed;
}
```

- 指定背景图像应随页面的其余部分一起滚动：

```css
body {
  background-image: url("img_tree.png");
  background-repeat: no-repeat;
  background-position: right top;
  background-attachment: scroll;
}
```

## CSS 背景简写

如需缩短代码，也可以在一个属性中指定所有背景属性。它被称为简写属性。

```css
/* 之前写法 */
body {
  background-color: #ffffff;
  background-image: url("img_tree.png");
  background-repeat: no-repeat;
  background-position: right top;
}
/* 现在写法 */
body {
  background: #ffffff url("img_tree.png") no-repeat right top;
}
```

在使用简写属性时，属性值的顺序为：

- background-color
- background-image
- background-repeat
- background-attachment
- background-position

属性值之一缺失并不要紧，只要按照此顺序设置其他值即可。

## 所有 CSS 背景属性

| 属性                                                                                     | 描述                        |
| -------------------------------------------------------------------------------------- | ------------------------- |
| [background](https://www.w3schools.cn/cssref/css3_pr_background.html)                  | 在一条声明中设置所有背景属性的简写属性。      |
| [background-attachment](https://www.w3schools.cn/cssref/pr_background-attachment.html) | 设置背景图像是固定的还是与页面的其余部分一起滚动。 |
| [background-clip](https://www.w3schools.cn/cssref/css3_pr_background-clip.html)        | 规定背景的绘制区域。                |
| [background-color](https://www.w3schools.cn/cssref/pr_background-color.html)           | 设置元素的背景色。                 |
| [background-image](https://www.w3schools.cn/cssref/pr_background-image.html)           | 设置元素的背景图像。                |
| [background-origin](https://www.w3schools.cn/cssref/css3_pr_background-origin.html)    | 规定在何处放置背景图像。              |
| [background-position](https://www.w3schools.cn/cssref/pr_background-position.html)     | 设置背景图像的开始位置。              |
| [background-repeat](https://www.w3schools.cn/cssref/pr_background-repeat.html)         | 设置背景图像是否及如何重复。            |
| [background-size](https://www.w3schools.cn/cssref/css3_pr_background-size.html)        | 规定背景图像的尺寸。                |

# CSS边框

## CSS边框样式 border-style

`border-style` 属性指定要显示的边框类型。<br />允许以下值：

- dotted - 定义点线边框
- dashed - 定义虚线边框
- solid - 定义实线边框
- double - 定义双边框
- groove - 定义 3D 坡口边框。效果取决于 border-color 值
- ridge - 定义 3D 脊线边框。效果取决于 border-color 值
- inset - 定义 3D inset 边框。效果取决于 border-color 值
- outset - 定义 3D outset 边框。效果取决于 border-color 值
- none - 定义无边框
- hidden - 定义隐藏边框

border-style 属性可以设置一到四个值（用于上边框、右边框、下边框和左边框）。<br />示例：不同的边框样式：

```css
p.dotted {border-style: dotted;}
p.dashed {border-style: dashed;}
p.solid {border-style: solid;}
p.double {border-style: double;}
p.groove {border-style: groove;}
p.ridge {border-style: ridge;}
p.inset {border-style: inset;}
p.outset {border-style: outset;}
p.none {border-style: none;}
p.hidden {border-style: hidden;}
p.mix {border-style: dotted dashed solid double;}
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703954703569-17338e4a-e9c8-4734-8c4b-2b4ea95c0c31.png#averageHue=%23191919&clientId=u3fb9a85c-00ac-4&from=paste&height=345&id=ue88282f0&originHeight=739&originWidth=1630&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=20238&status=done&style=stroke&taskId=u620282fb-b43f-457c-88a1-eba042c9010&title=&width=760)

## CSS 边框宽度 border-width

`border-width` 属性指定四个边框的宽度。<br />可以将宽度设置为特定大小（以 px、pt、cm、em 计），也可以使用以下三个预定义值之一：thin、medium 或 thick：

```css
p.one {
  border-style: solid;
  border-width: 5px;
}
p.two {
  border-style: solid;
  border-width: medium;
}
p.three {
  border-style: dotted;
  border-width: 2px;
}
p.four {
  border-style: dotted;
  border-width: thick;
}
```

## CSS 边框颜色 border-color

border-color 属性用于设置四个边框的颜色。<br />可以通过以下方式设置颜色：

- name - 指定颜色名，比如 "red"
- HEX - 指定十六进制值，比如 "#ff0000"
- RGB - 指定 RGB 值，比如 "rgb(255,0,0)"
- HSL - 指定 HSL 值，比如 "hsl(0, 100%, 50%)"
- transparent

注释: 如果未设置 border-color ，则它将继承元素的颜色。

```css
p.one {
  border-style: solid;
  border-color: red;
}
p.two {
  border-style: solid;
  border-color: green;
}
p.three {
  border-style: dotted;
  border-color: blue;
}
```

- 指定某边的边框的颜色

border-color 属性可以设置一到四个值（用于上边框、右边框、下边框和左边框）。

```css
p.one {
  border-style: solid;
  border-color: red green blue yellow; /* 上红、右绿、下蓝、左黄 */
}
```

## CSS 边框各边

在 CSS 中，还有一些属性可用于指定每个边框（顶部、右侧、底部和左侧）：

```css
p {
  border-top-style: dotted;
  border-right-style: solid;
  border-bottom-style: dotted;
  border-left-style: solid;
}
/* 等同于 */
p {
  border-style: dotted solid;
}
```

它的工作原理是这样的：<br />如果 border-style 属性设置四个值：

- 上边框是虚线
- 右边框是实线
- 下边框是双线
- 左边框是虚线

如果 border-style 属性设置三个值：

- 上边框是虚线
- 右和左边框是实线
- 下边框是双线

如果 border-style 属性设置两个值：

- 上和下边框是虚线
- 右和左边框是实线

如果 border-style 属性设置一个值：

- 四条边均为虚线

```css
/* 四个值 */
p {
  border-style: dotted solid double dashed;
}

/* 三个值 */
p {
  border-style: dotted solid double;
}

/* 两个值 */
p {
  border-style: dotted solid;
}

/* 一个值 */
p {
  border-style: dotted;
}
```

## CSS 简写边框属性

border 属性是以下各个边框属性的简写属性：

- border-width
- border-style（必需）
- border-color

```css
p {
  border: 5px solid red;
}
```

可以只为一个边指定所有单个边框属性：

```css
p {
  border-left: 6px solid red;
  background-color: lightgrey;
}
```

## CSS 圆角边框 border-radius

`border-radius` 属性用于向元素添加圆角边框：

```css
p {
  border: 2px solid red;
  border-radius: 5px;
}
```

# CSS轮廓

轮廓是在元素周围绘制的一条线，在边框之外，以凸显元素。<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704092994382-d76b49f6-a7eb-40f8-a758-626f700b45aa.png#averageHue=%231f1f1f&clientId=ub8c4ddac-55a2-4&from=paste&height=310&id=u3f7f923b&originHeight=465&originWidth=1663&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=12464&status=done&style=stroke&taskId=u271e567f-bdd3-4f1c-9637-579fe4f9e2f&title=&width=1108.6666666666667)CSS 拥有如下轮廓属性：

- outline-style
- outline-color
- outline-width
- outline-offset
- outline

轮廓与 边框 不同！不同之处在于：轮廓是在元素边框之外绘制的，并且可能与其他内容重叠。同样，轮廓也不是元素尺寸的一部分；元素的总宽度和高度不受轮廓线宽度的影响。

## CSS 轮廓样式

outline-style 属性指定轮廓的样式，并可设置如下值：

- dotted - 定义点状的轮廓。
- dashed - 定义虚线的轮廓。
- solid - 定义实线的轮廓。
- double - 定义双线的轮廓。
- groove - 定义 3D 凹槽轮廓。
- ridge - 定义 3D 凸槽轮廓。
- inset - 定义 3D 凹边轮廓。
- outset - 定义 3D 凸边轮廓。
- none - 定义无轮廓。
- hidden - 定义隐藏的轮廓。

## CSS 轮廓宽度

outline-width 属性指定轮廓的宽度，并可设置如下值之一：

- thin（通常为 1px）
- medium（通常为 3px）
- thick （通常为 5px）
- 特定尺寸（以 px、pt、cm、em 计）

## CSS 轮廓颜色

outline-color 属性用于设置轮廓的颜色。<br />可以通过以下方式设置颜色：

- name - 指定颜色名，比如 "red"
- HEX - 指定十六进制值，比如 "#ff0000"
- RGB - 指定 RGB 值，比如 "rgb(255,0,0)"
- HSL - 指定 HSL 值，比如 "hsl(0, 100%, 50%)"
- invert - 执行颜色反转（确保轮廓可见，无论是什么颜色背景）

## CSS 轮廓简写属性

outline 属性是用于设置以下各个轮廓属性的简写属性：

- outline-width
- outline-style（必需）
- outline-color

> outline 属性可指定一个、两个或三个值。值的顺序无关紧要。

```css
p.ex1 {outline: dashed;}
p.ex2 {outline: dotted red;}
p.ex3 {outline: 5px solid yellow;}
p.ex4 {outline: thick ridge pink;}
```

## CSS 轮廓偏移

outline-offset 属性在元素的轮廓与边框之间添加空间。元素及其轮廓之间的空间是透明的。

```css
p {
  margin: 30px;
  border: 1px solid black;
  outline: 1px solid red;
  outline-offset: 15px;
}
```

# CSS边距

## 外边距 margin

CSS `margin` 属性用于在任何定义的边框之外，为元素周围创建空间。<br />通过 CSS，您可以完全控制外边距。有一些属性可用于设置元素每侧（上、右、下和左）的外边距。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703955291224-e034df16-d79d-46e2-939e-a10f9250d9cf.png#averageHue=%23030000&clientId=u3fb9a85c-00ac-4&from=paste&height=269&id=u95bc62c7&originHeight=300&originWidth=600&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=13495&status=done&style=stroke&taskId=uf00fd102-f607-4e15-8e9b-9768456b88b&title=&width=538)

### Margin - 单独的边

CSS 拥有用于为元素的每一侧指定外边距的属性：

- margin-top
- margin-right
- margin-bottom
- margin-left

所有外边距属性都可以设置以下值：

- `auto` - 浏览器来计算外边距
- `length` - 以 px、pt、cm 等单位指定外边距
- `%` - 指定以包含元素宽度的百分比计的外边距
- `inherit` - 指定应从父元素继承外边距

提示: 允许负值。<br >示例：为 `<p>` 元素的所有四个边设置不同的外边距：

```css
p {
  margin-top: 100px;
  margin-bottom: 100px;
  margin-right: 150px;
  margin-left: 80px;
}
```

### Margin - 简写属性

margin 属性是以下各外边距属性的简写属性：

- margin-top
- margin-right
- margin-bottom
- margin-left

如果 margin 属性有四个值：

- margin: 25px 50px 75px 100px;
  - 上外边距是 25px
  - 右外边距是 50px
  - 下外边距是 75px

如果 margin 属性设置三个值：

- margin: 25px 50px 75px;
  - 上外边距是 25px
  - 右和左外边距是 50px
  - 下外边距是 75px

如果 margin 属性设置两个值：

- margin: 25px 50px;
  - 上和下外边距是 25px
  - 右和左外边距是 50px

如果 margin 属性设置了一个值：

- margin: 25px;
  - 所有四个外边距都是 25px

### auto 值

可以将 margin 属性设置为 auto，以使元素在其容器中水平居中。<br >然后，该元素将占据指定的宽度，并且剩余空间将在左右边界之间平均分配。

```html
<!DOCTYPE html>
<html>
<head>
<style>
div {
  width:300px;
  margin: auto;
  border: 1px solid red;
}
</style>
</head>
<body>

<h2>margin:auto 的使用</h2>
<p>您可以将 margin 属性设置为 auto 以使元素在其容器内水平居中。 然后该元素将占用指定的宽度，剩余空间将在左右边距之间平分：</p>

<div>
这个 div 将水平居中，因为它 margin: auto;
</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703955553584-f7d459d3-5c8c-4336-9fd4-64f370ed7858.png#averageHue=%231e1d1d&clientId=u3fb9a85c-00ac-4&from=paste&height=186&id=u534d0120&originHeight=279&originWidth=1246&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=9203&status=done&style=stroke&taskId=u37d7d984-b901-4202-b8fa-052ecb435b6&title=&width=830.6666666666666)

### inherit 值

示例：使 `<p class="ex1">` 元素的左外边距继承自父元素（`<div>`）：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div {
  border: 1px solid red;
  margin-left: 100px;
}

p.ex1 {
  margin-left: inherit;
}
</style>
</head>
<body>

<h2>使用继承值</h2>
<p>让左边距从父元素继承：</p>

<div>
<p class="ex1">这个段落有一个继承的左边距（从 div 元素）。</p>
</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703955684830-8c928361-4e80-4b28-b80b-0ad94e79f992.png#averageHue=%23191818&clientId=u3fb9a85c-00ac-4&from=paste&height=166&id=u361310e8&originHeight=249&originWidth=1264&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5588&status=done&style=stroke&taskId=u3dfa49b2-6ca3-4147-869c-80800047d1f&title=&width=842.6666666666666)

### CSS 外边距合并

外边距合并指的是，当两个垂直外边距相遇时，它们将形成一个外边距。<br >合并后的外边距的高度等于两个发生合并的外边距的高度中的`较大者`。

```html
<!DOCTYPE html>
<html>
<head>
<style>
h1 {
  margin: 0 0 50px 0;
}

h2 {
  margin: 20px 0 0 0;
}
</style>
</head>
<body>

<p>在此示例中，h1 元素的下边距为 50px，h2 元素的上边距为 20px。 那么，h1 和 h2 之间的垂直边距应该是 70px（50px + 20px）。 但是，由于边距崩溃，实际边距最终为 50px。</p>

<h1>标题 1</h1>
<h2>标题 2</h2>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703955828250-cd324775-bf55-45db-9bdc-be576e8d5f6b.png#averageHue=%231c1c1c&clientId=u3fb9a85c-00ac-4&from=paste&height=205&id=ub88fdbab&originHeight=307&originWidth=1249&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=8070&status=done&style=stroke&taskId=uea92e327-6740-4115-85c9-56e1483265e&title=&width=832.6666666666666)

## 内边距 padding

CSS padding 属性用于在任何定义的边界内的元素内容周围生成空间。<br >通过 CSS，您可以完全控制内边距（填充）。有一些属性可以为元素的每一侧（上、右、下和左侧）设置内边距。

### Padding - 单独的边

CSS 拥有用于为元素的每一侧指定内边距的属性：

- padding-top
- padding-right
- padding-bottom
- padding-left

所有内边距属性都可以设置以下值：

- length - 以 px、pt、cm 等单位指定内边距
- % - 指定以包含元素宽度的百分比计的内边距
- inherit - 指定应从父元素继承内边距

注释: 不允许负值。

```html
<!DOCTYPE html>
<html>
<head>
<style>
div {
  border: 1px solid black;
  background-color: lightblue;
  padding-top: 50px;
  padding-right: 30px;
  padding-bottom: 50px;
  padding-left: 80px;
}
</style>
</head>
<body>

<h2>使用单独的填充属性</h2>

<div> 这个 div 元素的上边距为 50px，右边距为 30px，下边距为 50px，左边距为 80px。</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703955913652-de9d29f5-6b4f-43c0-952a-277b47008d18.png#averageHue=%237b969f&clientId=u3fb9a85c-00ac-4&from=paste&height=187&id=uc654e7d8&originHeight=280&originWidth=1252&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5346&status=done&style=stroke&taskId=uf3b49a09-bcfa-4847-96ec-31b79ce8f65&title=&width=834.6666666666666)

### Padding - 简写属性

为了缩减代码，可以在一个属性中指定所有内边距属性。<br />padding 属性是以下各内边距属性的简写属性：

- padding-top
- padding-right
- padding-bottom
- padding-left

基本和margin一样

### 内边距和元素宽度

CSS width 属性指定元素内容区域的宽度。内容区域是元素（盒模型）的内边距、边框和外边距内的部分。<br >因此，如果元素拥有指定的宽度，则添加到该元素的内边距会添加到元素的总宽度中。这通常是不希望的结果。<br >示例：在这里，` <div>  `元素的宽度为 300px。但是，`<div>` 元素的实际宽度将是 350px（300px + 左内边距 25px + 右内边距 25px）：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div.ex1 {
  width: 300px;
  background-color: yellow;
}

div.ex2 {
  width: 300px;
  padding: 25px;
  background-color: lightblue;
}
</style>
</head>
<body>

<h2>填充和元素宽度</h2>

<div class="ex1">这个 div 是 300px 宽。</div>
<br>

<div class="ex2">这个 div 的宽度是 350px，尽管它在 CSS 中被定义为 300px。</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1703956129079-7b86dc9f-0067-4ac2-b1d2-a3f980f8eee7.png#averageHue=%232d2400&clientId=u3fb9a85c-00ac-4&from=paste&height=215&id=u80df82e2&originHeight=322&originWidth=688&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=6011&status=done&style=stroke&taskId=u053e1ed4-bb5a-42b0-a5a5-4d1aee0841e&title=&width=458.6666666666667)<br >若要将宽度保持为 300px，无论填充量如何，那么您可以使用 `box-sizing` 属性。这将导致元素保持其宽度。如果增加内边距，则可用的内容空间会减少。

```html
<!DOCTYPE html>
<html>
<head>
<style>
div.ex1 {
  width: 300px;
  background-color: yellow;
}

div.ex2 {
  width: 300px;
  padding: 25px;
  box-sizing: border-box;
  background-color: lightblue;
}
</style>
</head>
<body>

<h2>填充和元素宽度 - 带 box-sizing</h2>

<div class="ex1">这个 div 是 300px 宽。</div>
<br>

<div class="ex2">这个 div 的宽度保持在 300px，尽管总的左右填充为 50px，因为 box-sizing: border-box 属性。
</div>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1703956246594-b8827f92-e0e4-47f7-b12b-35809e696f92.png#averageHue=%232d2400&clientId=u3fb9a85c-00ac-4&from=paste&height=225&id=u7daa598a&originHeight=337&originWidth=550&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=7401&status=done&style=stroke&taskId=u175083fe-0799-4403-bd06-82fbbd46f5e&title=&width=366.6666666666667)

# CSS 高度和宽度

- height/widget

height 和 width 属性用于设置元素的高度和宽度；height 和 width 属性不包括内边距、边框或外边距。<br />height 和 width 属性可设置如下值：

- auto - 默认。浏览器计算高度和宽度。
- length - 以 px、cm 等定义高度/宽度。
- % - 以包含块的百分比定义高度/宽度。
- initial - 将高度/宽度设置为默认值。
- inherit - 从其父值继承高度/宽度。
- max-width

max-width 属性用于设置元素的最大宽度。<br >可以用长度值（例如 px、cm 等）或包含块的百分比（％）来指定 max-width（最大宽度），也可以将其设置为 none（默认值。意味着没有最大宽度）。<br >当浏览器窗口小于元素的宽度（500px）时，会发生之前那个 `<div>` 的问题。然后，浏览器会将水平滚动条添加到页面。<br >在这种情况下，使用 max-width 能够改善浏览器对小窗口的处理。

> max-width 属性的值将覆盖 width（宽度）。

# CSS 盒子模型

所有 HTML 元素都可以视为方框。在 CSS 中，在谈论设计和布局时，会使用术语"盒模型"或"框模型"。<br >CSS 框模型实质上是一个包围每个 HTML 元素的框。它包括：外边距、边框、内边距以及实际的内容。下图展示了框模型。<br >![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704124740840-cd0f3d27-6703-4054-8a11-dbc90563a612.png#averageHue=%231b1b1b&clientId=u86b462c2-c6ff-4&from=paste&height=423&id=u34ed7492&originHeight=634&originWidth=1684&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=15423&status=done&style=stroke&taskId=ubb13afb0-fab8-43b3-8bfb-54e94939859&title=&width=1122.6666666666667)

# CSS文本

## 文本颜色 color

color 属性用于设置文本的颜色。颜色由以下值指定：

- 颜色名 - 比如 "red"
- 十六进制值 - 比如 "#ff0000"
- RGB 值 - 比如 "rgb(255,0,0)"

页面的默认文本颜色是在 `body` 选择器中定义的。

## 文字对齐&方向

### 文本对齐 text-align

text-align 属性用于设置文本的水平对齐方式。<br />文本可以左对齐或右对齐，或居中对齐。

```html
<!DOCTYPE html>
<html>
<head>
<style>
h1 {
  text-align: center;
}

h2 {
  text-align: left;
}

h3 {
  text-align: right;
}
</style>
</head>
<body>

<h1>标题 1（居中）</h1>
<h2>标题 2（左）</h2>
<h3>标题 3（右）</h3>

<p>上面的三个标题分别居中、左对齐和右对齐。</p>

</body>
</html>
```

### 文本方向

direction 和 unicode-bidi 属性可用于更改元素的文本方向：<br />示例：

```html
<!DOCTYPE html>
<html>
<head>
<style>
p.ex1 {
  direction: rtl;
  unicode-bidi: bidi-override;
}
</style>
</head>
<body>

<p>这是默认的文本方向。</p>

<p class="ex1">这是从右到左的文本方向。</p>

</body>
</html>
```

### 垂直对齐

vertical-align 属性设置元素的垂直对齐方式。<br>示例：

```html
<!DOCTYPE html>
<html>
<head>
<style>
img.top {
  vertical-align: top;
}

img.middle {
  vertical-align: middle;
}

img.bottom {
  vertical-align: bottom;
}
</style>
</head>
<body>

<p>An <img src="w3schools_logo.gif" alt="W3Schools" width="270" height="50"> 具有默认对齐方式的图像。</p><br>

<p>An <img class="top" src="w3schools_logo.gif" alt="W3Schools" width="270" height="50"> 顶部对齐的图像。</p><br>

<p>An <img class="middle" src="w3schools_logo.gif" alt="W3Schools" width="270" height="50"> 中间对齐的图像。</p><br>

<p>An <img class="bottom" src="w3schools_logo.gif" alt="W3Schools" width="270" height="50"> 底部对齐的图像。</p>

</body>
</html>
```

![image.png|500](https://cdn.nlark.com/yuque/0/2024/png/694278/1704122659230-a0fdc619-a184-4d31-b060-7ed4d4e4b0dc.png#averageHue=%23e7e7e7&clientId=u86b462c2-c6ff-4&from=paste&height=276&id=u7b9611fc&originHeight=579&originWidth=757&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=61388&status=done&style=stroke&taskId=ua1b69ca2-e24b-4641-95d5-0353344b0c1&title=&width=360.66668701171875)

## 文本修饰

text-decoration 属性用于设置或删除文本装饰。<br >text-decoration: none; 通常用于从链接上删除下划线：<br >示例：

```html
<!DOCTYPE html>
<html>
<head>
<style>
h1 {
  text-decoration: overline;
}

h2 {
  text-decoration: line-through;
}

h3 {
  text-decoration: underline;
}
</style>
</head>
<body>

<h1>这是标题 1</h1>
<h2>这是标题 2</h2>
<h3>这是标题 3</h3>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1704122728129-68a838e1-02f8-438c-a8aa-0ac7060c65bc.png#averageHue=%23c9c9c9&clientId=u86b462c2-c6ff-4&from=paste&height=168&id=u083ddc31&originHeight=252&originWidth=288&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3213&status=done&style=stroke&taskId=u718e3ce3-19ae-4466-936a-4a572a72ba2&title=&width=192)

## 文本转换

text-transform 属性用于指定文本中的大写和小写字母。<br >它可用于将所有内容转换为大写或小写字母，或将每个单词的首字母大写：

- uppercase 大写
- lowercase 小写
- capitalize 首字母大写

```html
<!DOCTYPE html>
<html>
<head>
<style>
p.uppercase {
  text-transform: uppercase;
}

p.lowercase {
  text-transform: lowercase;
}

p.capitalize {
  text-transform: capitalize;
}
</style>
</head>
<body>

<p class="uppercase">abcd。</p>
<p class="lowercase">ABCD</p>
<p class="capitalize">abcd</p>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1704122824416-d784d9bb-eb30-4ba4-ae94-1a76087bc9e0.png#averageHue=%23e6e6e6&clientId=u86b462c2-c6ff-4&from=paste&height=134&id=ude79286e&originHeight=201&originWidth=339&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1604&status=done&style=stroke&taskId=uf14b1370-f2f9-4d53-8705-8fc7927627d&title=&width=226)

## 文本间距

### 文字缩进

text-indent 属性用于指定文本第一行的缩进：

```css
p {
  text-indent: 50px;
}
```

### 字母间距

letter-spacing 属性用于指定文本中字符之间的间距。<br >示例：如何增加或减少字符之间的间距：

```css
h1 {
  letter-spacing: 3px;
}

h2 {
  letter-spacing: -3px;
}
```

### 行高

line-height 属性用于指定行之间的间距：

```css
p.small {
  line-height: 0.8;
}

p.big {
  line-height: 1.8;
}
```

### 字间距

word-spacing 属性用于指定文本中单词之间的间距。

```css
h1 {
  word-spacing: 10px;
}

h2 {
  word-spacing: -5px;
}
```

### 空白

white-space 属性指定元素内部空白的处理方式。<br >示例：禁用元素内的文本换行：

```html
<!DOCTYPE html>
<html>
<head>
<style>
p {
  white-space: nowrap;
}
</style>
</head>
<body>

<h2>White Space</h2>

<p>
这是一些文字。 这是一些文字。 这是一些文字。
这是一些文字。 这是一些文字。 这是一些文字。
这是一些文字。 这是一些文字。 这是一些文字。
这是一些文字。 这是一些文字。 这是一些文字。
这是一些文字。 这是一些文字。 这是一些文字。
</p>

<p>尝试删除 white-space 属性以查看差异。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704123029459-5f336fe2-8029-46f5-81e2-7e0157794cf8.png#averageHue=%23e1e1e1&clientId=u86b462c2-c6ff-4&from=paste&height=136&id=u3cd8d0ee&originHeight=204&originWidth=1690&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5939&status=done&style=stroke&taskId=u0dc9050f-a120-4e0a-abf7-edb63102e97&title=&width=1126.6666666666667)

## 文本阴影

text-shadow 属性为文本添加阴影。

```css
h1 {
  text-shadow: 2px 2px 5px red;
}
```

## [CSS字体](https://www.w3schools.cn/css/css_font.html)

### 字体样式

font-style 属性主要用于指定斜体文本。<br >此属性可设置三个值：

- normal - 文字正常显示
- italic - 文本以斜体显示
- oblique - 文本为"倾斜"（倾斜与斜体非常相似，但支持较少）

### 字体粗细

font-weight 属性指定字体的粗细

```css
p.normal {
  font-weight: normal;
}

p.thick {
  font-weight: bold;
}
```

### 字体变体

font-variant 属性指定是否以 small-caps 字体（小型大写字母）显示文本。<br >在 small-caps 字体中，所有小写字母都将转换为大写字母。但是，转换后的大写字母的字体大小小于文本中原始大写字母的字体大小。

### 字体大小

font-size 属性设置文本的大小。<br >font-size 值可以是绝对或相对大小。<br >绝对尺寸：

- 将文本设置为指定大小
- 不允许用户在所有浏览器中更改文本大小（可访问性不佳）
- 当输出的物理尺寸已知时，绝对尺寸很有用

相对尺寸：

- 设置相对于周围元素的大小
- 允许用户在浏览器中更改文本大小

**注意：** 如果您没有指定字体大小，则普通文本（如段落）的默认大小为 16px（16px = 1em）。

#### 以像素设置字体大小

```css
h1 {
  font-size: 40px;
}

h2 {
  font-size: 30px;
}

p {
  font-size: 14px;
}
```

> 如果您使用了像素，则仍然可以使用缩放工具来调整整个页面的大小。

#### 用 em 设置字体大小

为了允许用户调整文本大小（在浏览器菜单中），许多开发人员使用 `em` 而不是像素。<br >W3C 建议使用 em 尺寸单位。<br >1em 等于当前字体大小。浏览器中的默认文本大小为 16px。因此，默认大小 1em 为 16px。<br>可以使用这个公式从像素到 em 来计算大小：`pixels/16=em`。

```css
h1 {
  font-size: 2.5em; /* 40px/16=2.5em */
}

h2 {
  font-size: 1.875em; /* 30px/16=1.875em */
}

p {
  font-size: 0.875em; /* 14px/16=0.875em */
}
```

#### 使用百分比和 Em 的组合

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-size: 100%;
}

h1 {
  font-size: 2.5em;
}

h2 {
  font-size: 1.875em;
}

p {
  font-size: 0.875em;
}
</style>
</head>
<body>

<h1>这是标题 1</h1>
<h2>这是标题 2</h2>
<p>这是一个段落。</p>
<p>以百分比和 em 为单位指定字体大小在所有主流浏览器中显示相同的大小，并允许所有浏览器调整文本大小！</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704124123012-1df4dbb5-42b2-42e9-85be-7ea48b61a71b.png#averageHue=%23e4e4e4&clientId=u86b462c2-c6ff-4&from=paste&height=209&id=u64b14245&originHeight=418&originWidth=1252&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=8870&status=done&style=stroke&taskId=ua1215d34-1df5-40ba-a924-833053b6d73&title=&width=626)

#### 响应式字体大小

可以使用 `vw`单位设置文本大小，它的意思是"视口宽度"（"viewport width"）。<br >这样，文本大小将遵循浏览器窗口的大小，请调整浏览器窗口的大小，以查看字体大小如何缩放：

```html
<html>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<body>

<h1 style="font-size:10vw;">响应式文本</h1>

<p style="font-size:5vw;">调整浏览器窗口大小以查看文本大小如何缩放。</p>

<p style="font-size:5vw;">调整文本大小时使用“vw”单位。 10vw 会将尺寸设置为视口宽度的 10%。</p>

<p>视口是浏览器窗口的大小。 1vw = 视口宽度的 1%。 如果视口为 50cm 宽，则 1vw 为 0.5cm。</p>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1704124586419-10282781-e0f9-4a8c-8ba2-e1823f643897.png#averageHue=%23d6d6d6&clientId=u86b462c2-c6ff-4&from=paste&height=360&id=ufc0c9ee5&originHeight=826&originWidth=1252&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=23130&status=done&style=stroke&taskId=u430f5230-0e65-4f63-b602-1a7bd71c91a&title=&width=546)

> 视口（Viewport）是浏览器窗口的大小。 1vw = 视口宽度的 1％。如果视口为 50 厘米宽，则 1vw 为 0.5 厘米。

### CSS 字体简写

为了缩短代码，也可以在一个属性中指定所有单个字体属性。<br>font 属性是以下属性的简写属性：

- font-style
- font-variant
- font-weight
- font-size/line-height
- font-family

```css
p.a {
  font: 20px Arial, sans-serif;
}

p.b {
  font: italic small-caps bold 12px/30px Georgia, serif;
}
```

> font-size 和 font-family 的值是必需的。如果缺少其他值之一，则会使用其默认值。

# [CSS表格](https://www.w3schools.cn/css/css_table.html)
