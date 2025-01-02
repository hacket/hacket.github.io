---
date created: 2024-12-25 00:47
date updated: 2024-12-25 00:48
dg-publish: true
tags:
  - '#ff9999;'
  - '#3399ff;'
  - '#ffe5e5;'
  - '#cce5ff;'
---

# CSS列表

## HTML 列表和 CSS 列表属性

在 HTML 中，列表主要有两种类型：

- 无序列表（`<ul>`）- 列表项用的是项目符号标记
- 有序列表（`<ol>`）- 列表项用的是数字或字母标记

CSS 列表属性使您可以：

- 为有序列表设置不同的列表项标记
- 为无序列表设置不同的列表项标记
- 将图像设置为列表项标记
- 为列表和列表项添加背景色

## 不同的列表项目标记

`list-style-type` 属性指定列表项标记的类型。

```html
<!DOCTYPE html>
<html>
<head>
<style>
ul.a {
  list-style-type: circle;
}

ul.b {
  list-style-type: square;
}

ol.c {
  list-style-type: upper-roman;
}

ol.d {
  list-style-type: lower-alpha;
}
</style>
</head>
<body>

<p>无序列表示例：</p>
<ul class="a">
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

<ul class="b">
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

<p>有序列表示例：</p>
<ol class="c">
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ol>

<ol class="d">
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ol>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1704124849803-5bc975ff-ed96-4db2-8de1-cc246cc9a196.png#averageHue=%23dfdfdf&clientId=u86b462c2-c6ff-4&from=paste&height=409&id=u7d4c76d7&originHeight=613&originWidth=225&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5816&status=done&style=stroke&taskId=u1bc2dbb8-5b21-4058-b540-dd112887c42&title=&width=150)

> 注意：有些值用于无序列表，有些值用于有序列表。

## 图像作为列表项标记

`list-style-image` 属性将图像指定为列表项标记：

```html
<!DOCTYPE html>
<html>
<head>
<style>
ul {
  list-style-image: url('sqpurple.gif');
}
</style>
</head>
<body>

<ul>
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704124902179-57352a19-0c77-4dc1-9af1-5b56e56bfba9.png#averageHue=%23e4e4e4&clientId=u86b462c2-c6ff-4&from=paste&height=109&id=ue628d179&originHeight=163&originWidth=214&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1447&status=done&style=stroke&taskId=ua937507c-5ac8-4618-afa1-4d786eac95f&title=&width=142.66666666666666)

## 定位列表项标记

`list-style-position` 属性指定列表项标记（项目符号）的位置。

- "list-style-position: outside;" 表示项目符号点将在列表项之外。列表项每行的开头将垂直对齐。这是默认的：
- "list-style-position: inside;" 表示项目符号将在列表项内。由于它是列表项的一部分，因此它将成为文本的一部分，并在开头推开文本：

```html
<!DOCTYPE html>
<html>
<head>
<style>
ul.a {
  list-style-position: outside;
}

ul.b {
  list-style-position: inside;
}
</style>
</head>
<body>

<h1>list-style-position 属性</h1>

<h2>list-style-position: outside (default):</h2>
<ul class="a">
  <li>咖啡 - 一种由烘焙咖啡豆制成的冲泡饮料，咖啡豆是咖啡树浆果的种子</li>
  <li>茶 - 一种芳香饮料，通常将热水或沸水倒在茶树（Camellia sinensis）的腌制叶子上，这是一种原产于亚洲的常绿灌木（灌木）</li>
  <li>可口可乐 - 可口可乐公司生产的碳酸软饮料。 这种饮料的名字指的是它的两种原始成分，即可乐果（咖啡因的来源）和古柯叶</li>
</ul>

<h2>list-style-position: inside:</h2>
<ul class="b">
  <li>咖啡 - 一种由烘焙咖啡豆制成的冲泡饮料，咖啡豆是咖啡树浆果的种子</li>
  <li>茶 - 一种芳香饮料，通常将热水或沸水倒在茶树（Camellia sinensis）的腌制叶子上，这是一种原产于亚洲的常绿灌木（灌木）</li>
  <li>可口可乐 - 可口可乐公司生产的碳酸软饮料。 这种饮料的名字指的是它的两种原始成分，即可乐果（咖啡因的来源）和古柯叶</li>
</ul>

</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704125016867-48504575-ca05-47d6-b92a-a3fe3635e611.png#averageHue=%23d8d8d8&clientId=u86b462c2-c6ff-4&from=paste&height=298&id=u8bbc55f6&originHeight=630&originWidth=1251&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=29613&status=done&style=stroke&taskId=uc9730610-d832-4923-ae59-670e6baff8e&title=&width=592)

## 删除默认设置

`list-style-type:none` 属性也可以用于删除标记/项目符号。请注意，列表还拥有默认的外边距和内边距。要删除此内容，请在 `<ul> 或 <ol>` 中添加 margin:0 和 padding:0 ：

```html
<!DOCTYPE html>
<html>
<head>
<style>
ul.demo {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
</head>
<body>

<p>默认列表：</p>
<ul>
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

<p>删除项目符号、边距和填充：</p>
<ul class="demo">
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

</body>
</html>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1704125066460-502c210f-0e3d-4762-ac74-16c71922ec4a.png#averageHue=%23e1e1e1&clientId=u86b462c2-c6ff-4&from=paste&height=244&id=ua79ee2e0&originHeight=366&originWidth=345&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=4443&status=done&style=stroke&taskId=uc431b635-a085-462c-b87c-7702a316331&title=&width=230)

## 列表 - 简写属性

list-style 属性是一种简写属性。它用于在一条声明中设置所有列表属性。<br />在使用简写属性时，属性值的顺序为：

- list-style-type（如果指定了 list-style-image，那么在由于某种原因而无法显示图像时，会显示这个属性的值）
- list-style-position（指定列表项标记应显示在内容流的内部还是外部）
- list-style-image（将图像指定为列表项标记）

如果缺少上述属性值之一，则将插入缺失属性的默认值（如果有）。

```html
<!DOCTYPE html>
<html>
<head>
<style>
ul {
  list-style: square inside url("sqpurple.gif");
}
</style>
</head>
<body>

<ul>
  <li>咖啡</li>
  <li>茶</li>
  <li>可口可乐</li>
</ul>

</body>
</html>
```

## 设置列表的颜色样式

可以使用颜色设置列表样式，使它们看起来更有趣。<br />添加到 `<ol>` 或 `<ul>` 标记的任何样式都会影响整个列表，而添加到 `<li>` 标记的属性将影响各个列表项：

```css
ol {
  background: #ff9999;
  padding: 20px;
}

ul {
  background: #3399ff;
  padding: 20px;
}

ol li {
  background: #ffe5e5;
  padding: 5px;
  margin-left: 35px;
}

ul li {
  background: #cce5ff;
  margin: 5px;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1704125254482-4fb1d8de-3126-4610-b00d-680251cd68bc.png#averageHue=%232c2f44&clientId=u86b462c2-c6ff-4&from=paste&height=187&id=u37aff9bd&originHeight=466&originWidth=1651&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=6734&status=done&style=stroke&taskId=u956620ee-baa9-4e06-8e47-2ec7cc92159&title=&width=663)

# 列表CSS案例

## 居中

水平居中，设置 li 的 text-align: center<br />垂直居中，设置 a 的 line-height 与 li 的高度一样。
