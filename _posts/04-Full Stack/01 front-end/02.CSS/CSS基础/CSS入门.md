---
date created: 2024-12-25 00:45
date updated: 2024-12-25 00:47
dg-publish: true
tags:
  - '#firstname'
  - '#para1'
  - '#ff0000;'
---

# CSS

## CSS简介

- CSS 指的是层叠样式表 (Cascading Style Sheets)
- CSS 描述了如何在屏幕、纸张或其他媒体上显示 HTML 元素
- CSS 节省了大量工作。它可以同时控制多张网页的布局
- 外部样式表存储在 CSS 文件中

## CSS 语法

CSS 规则集（rule-set）由选择器和声明块组成：<br />![](https://cdn.nlark.com/yuque/0/2023/gif/694278/1703949080812-64a2fc1b-9c4c-4e21-80de-2f91ee6f7015.gif#averageHue=%23add6af&clientId=ucd5afdfb-1f07-4&from=paste&height=101&id=ua2c16bd1&originHeight=119&originWidth=569&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u1722ed4d-fd27-4a86-b224-e704fa5c439&title=&width=485)

- 选择器指向您需要设置样式的 HTML 元素。
- 声明块包含一条或多条用分号分隔的声明。
- 每条声明都包含一个 CSS 属性名称和一个值，以冒号（`:`）分隔。
- 多条 CSS 声明用分号（`;`）分隔，声明块用花括号（`{}`）括起来。

示例：所有 `<p>` 元素都将居中对齐，并带有红色文本颜色：

```css
p {
  color: red;
  text-align: center;
}
```

- p 是 CSS 中的选择器（它指向要设置样式的 HTML 元素：`<p>`）。
- color 是属性，red 是属性值
- text-align 是属性，center 是属性值

## CSS 选择器

### CSS 选择器分类

CSS 选择器用于"查找"（或选取）要设置样式的 HTML 元素。我们可以将 CSS 选择器分为五类：

- 简单选择器（根据名称、id、类来选取元素）
- [组合器选择器](https://www.w3schools.cn/css/css_combinators.html)（根据它们之间的特定关系来选取元素）
- [伪类选择器](https://www.w3schools.cn/css/css_pseudo_classes.html)（根据特定状态选取元素）
- [伪元素选择器](https://www.w3schools.cn/css/css_pseudo_elements.html)（选取元素的一部分并设置其样式）
- [属性选择器](https://www.w3schools.cn/css/css_attribute_selectors.html)（根据属性或属性值来选取元素）

![image.png|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian20240228004218.png)

### 简单选择器

| 选择器                                                                          | 实例         | 实例描述                     |
| ---------------------------------------------------------------------------- | ---------- | ------------------------ |
| [.class](https://www.w3schools.cn/cssref/sel_class.html)                     | .intro     | 选取所有 class="intro" 的元素。  |
| [#id](https://www.w3schools.cn/cssref/sel_id.html)                           | #firstname | 选取 id="firstname" 的那个元素。 |
| [*](https://www.w3schools.cn/cssref/sel_all.html)                            | *          | 选取所有元素。                  |
| [element](https://www.w3schools.cn/cssref/sel_element.html)                  | p          | 选取所有 <p> 元素。             |
| [element,element,..](https://www.w3schools.cn/cssref/sel_element_comma.html) | div, p     | 选取所有 <div> 元素和所有 <p> 元素。 |

#### CSS 元素选择器

元素选择器根据元素名称来选择 HTML 元素。

```css
p {
  text-align: center;
  color: red;
}
```

#### CSS id 选择器 `#`

id 选择器使用 HTML 元素的 id 属性来选择特定元素。<br />元素的 id 在页面中是唯一的，因此 id 选择器用于选择一个唯一的元素！<br />要选择具有特定 id 的元素，请写一个井号（`＃`），后跟该元素的 id。

```html
<!DOCTYPE html>
<html>
<head>
<style>
#para1 {
  text-align: center;
  color: red;
}
</style>
</head>
<body>

<p id="para1">Hello World!</p>
<p>本段不受样式影响。</p>

</body>
</html>
```

**注意:** id 名称不能以数字开头。

#### CSS 类选择器 `.`

类选择器选择有特定 class 属性的 HTML 元素。<br />如需选择拥有特定 class 的元素，请写一个句点（`.`）字符，后面跟类名。<br />示例：所有带有 class="center" 的 HTML 元素将为红色且居中对齐：

```html
<!DOCTYPE html>
<html>
<head>
<style>
.center {
  text-align: center;
  color: red;
}
</style>
</head>
<body>

<h1 class="center">红色和居中对齐的标题</h1>
<p class="center">红色和居中对齐的段落。</p> 

</body>
</html>
```

还可以指定只有特定的 HTML 元素会受类的影响：只有具有 `class="center"` 的 <p> 元素会居中对齐：

```css
p.center {
  text-align: center;
  color: red;
}
```

HTML 元素也可以引用多个类。<br />示例：<p> 元素将根据 class="center" 和 class="large" 进行样式设置：

```html
<p class="center large">This paragraph refers to two classes.</p>
```

注意： 类名不能以数字开头！

#### CSS 通用选择器 `*`

通用选择器（`*`）选择页面上的所有的 HTML 元素。<br />示例：下面的 CSS 规则会影响页面上的每个 HTML 元素：

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        text-align: center;
        color: blue;
      }
    </style>
  </head>
  <body>

    <h1>Hello world!</h1>

    <p>页面上的每个元素都会受到样式的影响。</p>
    <p id="para1">我也是！</p>
    <p>还有我！</p>

  </body>
</html>
```

#### CSS 分组选择器

分组选择器选取所有具有相同样式定义的 HTML 元素。<br />如需对选择器进行分组，请用逗号来分隔每个选择器。

```css
/* 下面的 CSS 代码（h1、h2 和 p 元素具有相同的样式定义）： */
h1 {
  text-align: center;
  color: red;
}
h2 {
  text-align: center;
  color: red;
}
p {
  text-align: center;
  color: red;
}
/* 分组后： */
h1, h2, p {
  text-align: center;
  color: red;
}
```

### CSS 组合选择器

CSS 选择器可以包含多个简单选择器。在简单选择器之间，我们可以包含一个组合器。<br />CSS 中有四种不同的组合器：

- 后代选择器 (`空格`)
- 子选择器 (`>`)
- 相邻兄弟选择器 (`+`)
- 通用兄弟选择器 (`~`)

| 选择器                                                                        | 实例      | 实例描述                        |
| -------------------------------------------------------------------------- | ------- | --------------------------- |
| [elementelement](https://www.w3schools.cn/cssref/sel_element_element.html) | div p   | 选择 <div> 元素内的所有 <p> 元素。     |
| [element>element](https://www.w3schools.cn/cssref/sel_element_gt.html)     | div > p | 选择其父元素是 <div> 元素的所有 <p> 元素。 |
| [element+element](https://www.w3schools.cn/cssref/sel_element_pluss.html)  | div + p | 选择所有紧随 <div> 元素之后的 <p> 元素。  |
| [element1~element2](https://www.w3schools.cn/cssref/sel_gen_sibling.html)  | p ~ ul  | 选择前面有 <p> 元素的每个 <ul> 元素。    |

#### 后代选择器 `空格`

后代选择器匹配属于指定元素后代的所有元素。

示例：选择 `<div>` 元素内的所有 `<p>`元素：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div p {
  background-color: yellow;
}
</style>
</head>
<body>

<div>
  <p>div 中的第 1 段。</p>
  <p>div 中的第 2 段。</p>
  <section><p>div 中的第 3 段。</p></section>
</div>

<p>第 4 段。不在 div 中。</p>
<p>第 5 段。不在 div 中。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704214494865-2768d786-963a-42f7-975f-542543d915dd.png#averageHue=%23d7d7ac&clientId=u0d07662c-0c5c-4&from=paste&height=197&id=u7868cf2d&originHeight=295&originWidth=657&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4739&status=done&style=none&taskId=u81350bb9-2821-4c91-aab9-c4fbf4e0d4a&title=&width=438)

#### 子选择器 `>`

子选择器匹配属于指定元素子元素的所有元素。

示例：子选择属于 `<div>` 元素子元素的所有 `<p>` 元素：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div > p {
  background-color: yellow;
}
</style>
</head>
<body>

<div>
  <p>div 中的第 1 段。</p>
  <p>div 中的第 2 段。</p>
  <section><p>div 中的第 3 段。</p></section> <!-- not Child but Descendant -->
  <p>div 中的第 4 段。</p>
</div>

<p>第 5 段。不在 div 中。</p>
<p>第 6 段。不在 div 中。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704214435764-f5870548-fd44-44ba-94c8-6ddabdb97f37.png#averageHue=%23e3e3e3&clientId=u0d07662c-0c5c-4&from=paste&height=238&id=ube02c18a&originHeight=357&originWidth=621&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5652&status=done&style=none&taskId=uaca7e5d0-fd43-41d4-b8cd-e90d4afe723&title=&width=414)

#### 相邻兄弟选择器 `+`

相邻兄弟选择器匹配所有作为指定元素的相邻同级的元素。<br />兄弟（同级）元素必须具有相同的父元素，"相邻"的意思是"紧随其后"。

示例：选择紧随 `<div>` 元素之后的所有 `<p>` 元素：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div + p {
  background-color: yellow;
}
</style>
</head>
<body>

<div>
  <p>div 中的第 1 段。</p>
  <p>div 中的第 2 段。</p>
</div>

<p>第 3 段。不在 div 中。</p>
<p>第 4 段。不在 div 中。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704214556368-60722613-50ad-48aa-8517-41372a7777cc.png#averageHue=%23e4e4e4&clientId=u0d07662c-0c5c-4&from=paste&height=153&id=ue707145b&originHeight=229&originWidth=762&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4011&status=done&style=none&taskId=u8f95e66d-f173-4a5e-bf4f-29e59e812fa&title=&width=508)

#### 通用兄弟选择器 `~`

通用兄弟选择器匹配属于指定元素的同级元素的所有元素。

```html
<!DOCTYPE html>
<html>
<head>
<style>
div ~ p {
  background-color: yellow;
}
</style>
</head>
<body>

<p>段落1。</p>

<div>
  <p>段落2。</p>
</div>

<p>段落3。</p>
<code>一些代码。</code>
<p>段落4。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704214597761-04dd7bda-a7c0-44a6-a418-046893b7e89d.png#averageHue=%23e6e6e6&clientId=u0d07662c-0c5c-4&from=paste&height=205&id=u9322889a&originHeight=307&originWidth=622&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3421&status=done&style=none&taskId=u7c603662-41d1-4607-acbd-219c2e0896d&title=&width=414.6666666666667)

### 伪类选择器

#### 什么是伪类?

伪类用于定义元素的特殊状态。<br />例如，它可以用于：

- 设置鼠标悬停在元素上时的样式
- 为已访问和未访问链接设置不同的样式
- 设置元素获得焦点时的样式

#### 语法

```css
selector:pseudo-class {
  property: value;
}
```

#### 锚伪类

链接能够以不同的方式显示：

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 未访问的链接 */
a:link {
  color: red;
}

/* 访问过的链接 */
a:visited {
  color: green;
}

/* 鼠标悬停在链接上 */
a:hover {
  color: hotpink;
}

/* 选中的链接 */
a:active {
  color: blue;
}
</style>
</head>
<body>

<p><b><a href="default.asp" target="_blank">这是一个链接</a></b></p>
<p><b>注意：</b> a:hover 必须在 CSS 定义中的 a:link 和 a:visited 之后才能生效。</p>
<p><b>注意：</b> a:active 必须在 CSS 定义中的 a:hover 之后才能生效。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704241886908-8cfde122-0f76-41cd-8fdc-916a6de38a60.png#averageHue=%23dfdfdf&clientId=u6a97335b-4ede-4&from=paste&height=135&id=u0f7d333e&originHeight=202&originWidth=771&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=6102&status=done&style=none&taskId=u962b0b7c-f619-4f7f-8b85-32af49fe3cd&title=&width=514)<br />注意：

- `a:hover` 必须在 CSS 定义中的 `a:link` 和 `a:visited` 之后，才能生效
- `a:active` 必须在 CSS 定义中的 `a:hover` 之后才能生效
- 伪类名称对大小写不敏感。

#### 伪类和 CSS 类

伪类可以与 CSS 类结合使用：

示例：当您将鼠标悬停在例子中的链接上时，它会改变颜色：

```html
<!DOCTYPE html>
<html>
<head>
<style>
a.highlight:hover {
  color: #ff0000;
} 
</style>
</head>
<body>

<p><a class="highlight" href="css_syntax.asp">CSS 语法</a></p>
<p><a href="default.asp">CSS 教程</a></p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704242002891-8adc5277-c8f3-4442-a10c-a5d345476772.png#averageHue=%23eaeaea&clientId=u6a97335b-4ede-4&from=paste&height=96&id=ua8826d5b&originHeight=144&originWidth=246&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1491&status=done&style=none&taskId=u4d809d51-ef40-4a53-b57b-ee9d0483c50&title=&width=164)

#### 悬停在 div上

在 `<div>` 元素上使用 :hover 伪类的实例：

```html
<!DOCTYPE html>
<html>
<head>
<style>
div {
  background-color: green;
  color: white;
  padding: 25px;
  text-align: center;
}

div:hover {
  background-color: blue;
}
</style>
</head>
<body>

<p>将鼠标悬停在下面的 div 元素上以更改其背景颜色：</p>

<div>鼠标悬停在我身上</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704242049419-44e14a98-937a-42cc-9d5f-12742a7cbd7d.png#averageHue=%239393dc&clientId=u6a97335b-4ede-4&from=paste&height=138&id=uafc9654c&originHeight=207&originWidth=1243&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4254&status=done&style=none&taskId=u4d418a29-e551-4431-8981-cf4fc3a773f&title=&width=828.6666666666666)

#### 简单的工具提示悬停

把鼠标悬停到 `<div>` 元素以显示 `<p>` 元素（类似工具提示的效果）：

```html
<!DOCTYPE html>
<html>
<head>
<style>
p {
  display: none;
  background-color: yellow;
  padding: 20px;
}

div:hover p {
  display: block;
}
</style>
</head>
<body>

<div>将鼠标悬停在我身上以显示 p 元素
  <p>田田！ 我在这里！</p>
</div>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704242127796-f67a5546-e42e-4f72-8e73-4550f931d89f.png#averageHue=%23cfcf87&clientId=u6a97335b-4ede-4&from=paste&height=118&id=u7a2a3c1d&originHeight=177&originWidth=1249&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=3351&status=done&style=none&taskId=ude449ea8-2469-4dd0-b2b7-282690c5043&title=&width=832.6666666666666)

#### :first-child 伪类

`:first-child` 伪类与指定的元素匹配：该元素是另一个元素的第一个子元素。

##### 匹配第一个p元素

```html
<!DOCTYPE html>
<html>
<head>
<style>
p:first-child {
  color: red;
} 
</style>
</head>
<body>

<p>这是一些文字。</p>
<p>这是一些文字。</p>
<p><b>注意：</b>要使 :first-child 在 IE8 及更早版本中工作，必须声明 DOCTYPE。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704300506506-a83762e3-59f7-4dcd-b5c2-75f673cec98a.png#averageHue=%23e4e4e4&clientId=ucf40678a-c856-4&from=paste&height=155&id=u19ccaf63&originHeight=232&originWidth=787&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4532&status=done&style=none&taskId=u2e098418-1dfe-495d-a8bc-f22621b3e74&title=&width=524.6666666666666)

##### 匹配所有 p 元素中的首个 i 元素

```html
<!DOCTYPE html>
<html>
<head>
<style>
p i:first-child {
  color: red;
} 
</style>
</head>
<body>

<p>我是一个<i>坚强</i>的人。 我是一个<i>坚强</i>的人。</p>
<p>我是一个<i>坚强</i>的人。 我是一个<i>坚强</i>的人。</p>
<p><b>注意：</b>要使 :first-child 在 IE8 及更早版本中工作，必须声明 DOCTYPE。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704300670968-52cd8910-858f-4060-97d2-26884ff94833.png#averageHue=%23dfdede&clientId=ucf40678a-c856-4&from=paste&height=141&id=u94440758&originHeight=212&originWidth=773&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5643&status=done&style=none&taskId=u501ba07a-db21-4991-8ee8-9b7d5e40c0e&title=&width=515.3333333333334)

##### 匹配所有首个 p 元素中的所有 i 元素

```html
<!DOCTYPE html>
<html>
<head>
<style>
p:first-child i {
  color: red;
}
</style>
</head>
<body>

<p>我是一个<i>坚强</i>的人。 我是一个<i>坚强</i>的人。</p>
<p>我是一个<i>坚强</i>的人。 我是一个<i>坚强</i>的人。</p>
<p><b>注意：</b>要使 :first-child 在 IE8 及更早版本中工作，必须声明 DOCTYPE。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704300730300-6956e982-e9c2-43e0-983e-9a2722764348.png#averageHue=%23dddcdc&clientId=ucf40678a-c856-4&from=paste&height=117&id=ua77a3995&originHeight=175&originWidth=785&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5024&status=done&style=none&taskId=ub13d804e-9166-4593-a9b7-a5e610c236c&title=&width=523.3333333333334)

#### :lang 伪类

`:lang` 伪类允许您为不同的语言定义特殊的规则。
示例：:lang 为属性为 lang="no" 的 `<q>` 元素定义引号：

```html
<!DOCTYPE html>
<html>
<head>
<style>
q:lang(no) {
  quotes: "~" "~";
}
</style>
</head>
<body>

<p>一些文本 <q lang="no">段落中的引用</q> 一些文本。</p>
<p>在这个例子中，:lang 为 lang="no" 的 q 个元素定义了引号：</p>
<p><b>注意：</b> IE8 仅在指定了 !DOCTYPE 时才支持 :lang 伪类。</p>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704300892924-67f9b7d6-4c37-47fd-adb7-f6add7391ecf.png#averageHue=%23dadada&clientId=ucf40678a-c856-4&from=paste&height=119&id=u93a4a200&originHeight=178&originWidth=663&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5216&status=done&style=none&taskId=u4031be07-fed4-409b-a0c2-599737cdeb9&title=&width=442)

### [伪元素选择器](https://www.w3schools.cn/css/css_pseudo_elements.html)

## CSS 如何使用

有三种插入样式表的方法：

- 外部 CSS
- 内部 CSS
- 行内 CSS

### 外部 CSS （推荐）

每张 HTML 页面必须在 head 部分的 `<link>` 元素内包含对外部样式表文件的引用。

```html
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="mystyle.css">
</head>
<body>

<h1>这是一个标题</h1>
<p>这是一个段落。</p>

</body>
</html>
```

mystyle.css：

```css
body {
  background-color: lightblue;
}

h1 {
  color: navy;
  margin-left: 20px;
}
```

注意：请勿在属性值和单位之间添加空格（例如 `margin-left: 20 px;`）。正确的写法是：`margin-left: 20px;`

### 内部 CSS

内部样式是在 head 部分的 `<style>` 元素中进行定义。

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  background-color: linen;
}

h1 {
  color: maroon;
  margin-left: 40px;
}
</style>
</head>
<body>

<h1>This is a heading</h1>
<p>这是一个段落。</p>

</body>
</html>
```

### 行内 CSS

行内样式（也称内联样式）可用于为单个元素应用唯一的样式。<br />如需使用行内样式，请将 style 属性添加到相关元素。style 属性可包含任何 CSS 属性。

```html
!DOCTYPE html>
<html>
<body>

<h1 style="color:blue;text-align:center;">This is a heading</h1>
<p style="color:red;">这是一个段落。</p>

</body>
</html>
```

当为某个 HTML 元素指定了多个样式时，会使用哪种样式呢？<br />页面中的所有样式将按照以下规则"层叠"为新的"虚拟"样式表，其中第一优先级最高：

1. 行内样式（在 HTML 元素中）
2. 外部和内部样式表（在 head 部分）；相同的最后的覆盖前面的
3. 浏览器默认样式

因此，行内样式具有最高优先级，并且将覆盖外部和内部样式以及浏览器默认样式。
