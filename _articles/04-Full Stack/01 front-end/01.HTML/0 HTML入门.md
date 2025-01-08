---
date created: 2024-12-25 00:20
date updated: 2024-12-25 01:02
dg-publish: true
---

# HTML入门

## HTML概述

HTML 的全名是“超文本标记语言”（HyperText Markup Language），上个世纪90年代由欧洲核子研究中心的物理学家蒂姆·伯纳斯-李（Tim Berners-Lee）发明。它的最大特点就是支持超链接，点击链接就可以跳转到其他网页，从而构成了整个互联网。<br>1999年，HTML 4.01 版发布，成为广泛接受的 HTML 标准。2014年，HTML 5 发布，这是目前正在使用的版本。<br>浏览器的网页开发，涉及三种技术：HTML、CSS 和 JavaScript。

- HTML 语言定义网页的结构和内容
- CSS 样式表定义网页的样式
- JavaScript 语言定义网页与用户的互动行为。

HTML 语言是网页开发的基础，CSS 和 JavaScript 都是基于 HTML 才能生效，即使没有这两者，HTML 本身也能使用，可以完成基本的内容展示。

## 网页的基本概念

### 标签

网页的 HTML 代码由许许多多不同的标签（tag）构成。学习 HTML 语言，就是学习各种标签的用法。

```html
<title>网页标题</title>
```

- 标签用来告诉浏览器，如何处理这段代码。标签的内容就是浏览器所要渲染的、展示在网页上的内容。

标签放在一对尖括号里面（比如`<title>`），大多数标签都是成对出现的，分成开始标签和结束标签，结束标签在标签名之前加斜杠（比如`</title>`）。但是，也有一些标签不是成对使用，而是只有开始标签，没有结束标签：`<meta>`标签就没有结束标签`</meta>`。

```html
<meta charset="utf-8">
```

- 这种单独使用的标签，通常是因为标签本身就足够完成功能了，不需要标签之间的内容。实际应用中，它们主要用来提示浏览器，做一些特别处理。
- 标签可以嵌套。
- 嵌套时，必须保证正确的闭合顺序，不能跨层嵌套，否则会出现意想不到的渲染结果。
- HTML 标签名是大小写不敏感，比如`<title>`和`<TITLE>`是同一个标签。不过，一般习惯都是使用小写。
- HTML 语言忽略缩进和换行：整个网页的 HTML 代码完全可以写成一行，浏览器照样解析，结果完全一样。所以，正式发布网页之前，开发者有时会把源码压缩成一行，以减少传输的字节数。
- 各种网页的样式效果，比如内容的缩进和换行，主要靠 CSS 来实现。

### 元素

浏览器渲染网页时，会把 HTML 源码解析成一个标签树，每个标签都是树的一个节点（node）。这种节点就称为网页元素（element）。所以，“标签”和“元素”基本上是同义词，只是使用的场合不一样：标签是从源码角度来看，元素是从编程角度来看，比如`<p>`标签对应网页的p元素。

嵌套的标签就构成了网页元素的层级关系。

### 块级元素，行内元素

所有元素可以分成两大类：块级元素（block）和行内元素（inline）。

- 块级元素默认占据一个独立的区域，在网页上会自动另起一行，占据 100% 的宽度。

```html
<p>hello</p>
`<p>world</p>`
```

- 行内元素默认与其他元素在同一行，不产生换行。比如，span就是行内元素，通常用来为某些文字指定特别的样式。

```html
<span>hello</span>
<span>world</span>
```

### 属性

属性（attribute）是标签的额外信息，使用空格与标签名和其他属性分隔。

```html
<img src="demo.jpg" width="500">
```

- 属性可以用等号指定属性值

比如上例的demo.jpg就是src的属性值。属性值一般放在双引号里面，这不是必需的，但推荐总是使用双引号。<br>注意，属性名是大小写不敏感的，onclick和onClick是同一个属性。<br>HTML 提供大量属性，用来定制标签的行为

## 网页的基本标签

符合 HTML 语法标准的网页，应该满足下面的基本结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title></title>
</head>
<body>
</body>
</html>
```

HTML 代码的缩进和换行，对于浏览器不产生作用。所以，上面的代码完全可以写成一行，渲染结果不变。上面这样分行写，只是为了提高可读性。

### `!doctype标签`

网页的第一个标签通常是`<!doctype>`，表示文档类型，告诉浏览器如何解析网页。

```html
<!doctype html>
<!-- 有时，该标签采用完全大写的形式，以便区别于正常的 HTML 标签。因为<!doctype>本质上不是标签，更像一个处理指令。-->
<!DOCTYPE html>
```

### `html标签`

`<html>`标签是网页的顶层容器，即标签树结构的顶层节点，也称为根元素（root element），其他元素都是它的子元素。一个网页只能有一个`<html>`标签。

- 标签的lang属性，表示网页内容默认的语言。

```html
<html lang="zh-CN">
```

### `head标签`

`<head>`标签是一个容器标签，用于放置网页的元信息。它的内容不会出现在网页上，而是为网页渲染提供额外信息。

```html
<!doctype html>
`<html>`
  <head>
    <title>网页标题</title>
  </head>
</html>
```

`<head>`是`<html>`的第一个子元素。如果网页不包含`<head>`，浏览器会自动创建一个。
`<head>`的子元素一般有下面七个：

- `<meta>`：设置网页的元数据。
- `<link>`：连接外部样式表。
- `<title>`：设置网页标题。
- `<style>`：放置内嵌的样式表。
- `<script>`：引入脚本。
- `<noscript>`：浏览器不支持脚本时，所要显示的内容。
- `<base>`：设置网页内部相对 URL 的计算基准。

#### `meta标签`

`<meta>`标签用于设置或说明网页的元数据，必须放在`<head>`里面。一个`<meta>`标签就是一项元数据，网页可以有多个`<meta>`。`<meta>`标签约定放在`<head>`内容的最前面。
不管什么样的网页，一般都可以放置以下两个`<meta>`标签：

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Title</title>
</head>
```

> 第一个`<meta>`标签表示网页采用 UTF-8 格式编码，第二个`<meta>`标签表示网页在手机端可以自动缩放。

`<meta>`标签有五个属性：

##### charset 属性

`<meta>`标签的charset属性，用来指定网页的编码方式。该属性非常重要，如果设置得不正确，浏览器可能无法正确解码，就会显示乱码。

```html
<meta charset="utf-8">
```

> 注意，这里声明的编码方式，应该与网页实际的编码方式一致，即声明了utf-8，网页就应该使用 UTF-8 编码保存。如果这里声明了utf-8，实际却是使用另一种编码（比如 GB2312），并不会导致浏览器的自动转码，网页可能会显示为乱码。

##### name 属性，content 属性

`<meta>`标签的name属性表示元数据的名字，content属性表示元数据的值。它们合在一起使用，就可以为网页指定一项元数据。

```html
<head>
  <meta name="description" content="HTML 语言入门">
  <meta name="keywords" content="HTML,教程">
  <meta name="author" content="张三">
</head>
```

- description是网页内容的描述
- keywords是网页内容的关键字
- author是网页作者

元数据有很多种，大部分涉及浏览器内部工作机制，或者特定的使用场景：

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="application-name" content="Application Name">
<meta name="generator" content="program">
<meta name="subject" content="your document's subject">
<meta name="referrer" content="no-referrer">
```

##### http-equiv 属性，content 属性

`<meta>`标签的http-equiv属性用来补充 HTTP 回应的头信息字段，如果服务器发回的 HTTP 回应缺少某个字段，就可以用它补充。`<meta>`标签的content属性是对应的字段内容。这两个属性与 HTTP 协议相关，属于高级用法：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

> 设定 HTTP 回应的Content-Security-Policy字段

```html
<meta http-equiv="Content-Type" content="Type=text/html; charset=utf-8">
<meta http-equiv="refresh" content="30">
<meta http-equiv="refresh" content="30;URL='http://website.com'">
```

#### `title标签`

`<title>`标签用于指定网页的标题，会显示在浏览器窗口的标题栏。

```html
<head>
  <title>网页标题</title>
</head>
```

搜索引擎根据这个标签，显示每个网页的标题。它对于网页在搜索引擎的排序，有很大的影响，应该精心安排，反映网页的主题。<br>`<title>`标签的内部，不能再放置其他标签，只能放置无格式的纯文本。

#### `body标签`

`<body>`标签是一个容器标签，用于放置网页的主体内容。浏览器显示的页面内容，都放置在它的内部。它是`<html>`的第二个子元素，紧跟在`<head>`后面。

```html
<html>
  <head>
    <title>网页标题</title>
  </head>
  <body>
    <p>hello world</p>
  </body>
</html>
```

#### `base标签`

`<base>`标签指定网页内部的所有相对 URL 的计算基准。整张网页只能有一个<base>标签，而且只能放在`<head>`里面。它是单独使用的标签，没有闭合标签，下面是一个例子。

```html
<head>
	<base href="https://www.example.com/files/" target="_blank">
</head>
```

<base>标签的href属性给出计算的基准网址，target属性给出如何打开链接的说明<br>已知计算基准是https://www.example.com/files/，那么相对 URL foo.html，就可以转成绝对 URL https://www.example.com/files/foo.html。注意，`<base>`标签必须至少具有href属性或target属性之一。
```html
<base href="http://foo.com/app/">
<base target="_blank">
```
一旦设置了<base>，就对整个网页都有效。如果要改变某个链接的行为，只能用绝对链接替代相对链接。尤其需要注意锚点，这时锚点也是针对<base>计算的，而不是针对当前网页的 URL。

## 标签的属性

网页标签的属性（attribute）可以定制标签的行为，不同的属性会导致标签有不同的行为。标签属性的写法是 HTML 标签内部的“键值对”。<br>全局属性（global attributes）是所有标签都可以使用的属性。也就是说，你可以把下面的属性，加在任意一个网页标签上面，不过有些属性对某些标签可能不产生意义。<br>下面的元素也可以理解为标签。

### id

id属性是元素在网页内的唯一标识符。比如，网页可能包含多个`<p>`标签，id属性可以指定每个`<p>`标签的唯一标识符。

```html
<p id="p1"></p>
<p id="p2"></p>
<p id="p3"></p>
```

- id属性的值必须是全局唯一的，同一个页面不能有两个相同的id属性。另外，id属性的值不得包含空格。
- id属性的值还可以在最前面加上`#`，放到 URL 中作为锚点，定位到该元素在网页内部的位置。比如，用户访问网址<https://foo.com/index.html#bar的时候，浏览器会自动将页面滚动到bar的位置，让用户第一眼就看到这部分内容。>

### class

class属性用来对网页元素进行分类。如果不同元素的class属性值相同，就表示它们是一类的。

```html
<p class="para"></p>
<p></p>
<p class="para"></p>
```

- 元素可以同时具有多个 class，它们之间使用空格分隔。

### title

title属性用来为元素添加附加说明。大多数浏览器中，鼠标悬浮在元素上面时，会将title属性值作为浮动提示，显示出来。

```html
<div title="版权说明">
  <p>本站内容使用创意共享许可证，可以自由使用。</p>
</div>
```

### style

style属性用来指定当前元素的 CSS 样式：

```html
<p style="color: red;">hello</p>
```

### tabindex

网页通常使用鼠标操作，但是某些情况下，用户可能希望使用键盘，或者只有键盘可以用。因此，浏览器允许使用 Tab 键，遍历网页元素。也就是说，只要不停按下 Tab 键，网页的焦点就会从一个元素转移到另一个元素，选定焦点元素以后，就可以进行下一步操作，比如按下回车键访问某个链接，或者直接在某个输入框输入文字。<br>这里就有一个问题，按下 Tab 键的时候，浏览器怎么知道跳到哪一个元素。HTML 提供了tabindex属性，解决这个问题。它的名字的含义，就是 Tab 的顺序（index）。<br>tabindex属性的值是一个整数，表示用户按下 Tab 键的时候，网页焦点转移的顺序。不同的属性值有不同的含义：

- 负整数：该元素可以获得焦点（比如使用 JavaScript 的focus()方法），但不参与 Tab 键对网页元素的遍历。这个值通常是-1。
- 0：该元素参与 Tab 键的遍历，顺序由浏览器指定，通常是按照其在网页里面出现的位置。
- 正整数：网页元素按照从小到大的顺序（1、2、3、……），参与 Tab 键的遍历。如果多个元素的tabindex属性相同，则按照在网页源码里面出现的顺序遍历。

> 一般来说，tabindex属性最好都设成0，按照自然顺序进行遍历，这样比较符合用户的预期，除非网页有特殊布局。如果网页所有元素都没有设置tabindex，那么只有那些默认可以遍历的元素（比如链接、输入框等）才能参与 Tab 键的遍历，顺序由其在源码的位置决定。因此实际上，只有那些无法获得焦点的元素（比如`<span>、<div>`）需要参与遍历，才有必要设置tabindex属性。

### accesskey

accesskey属性指定网页元素获得焦点的快捷键，该属性的值必须是单个的可打印字符。只要按下快捷键，该元素就会得到焦点。

```html
<button accesskey="s">提交</button>
```

> `<button>`的快捷键是s，按下快捷键，该元素就得到了焦点。

accesskey属性的字符键，必须配合功能键，一起按下才会生效。也就是说，快捷键是“功能键 + 字符键”的组合。不同的浏览器与不同的操作系统，功能键都不一样。比如，Chrome 浏览器在 Windows 系统和 Linux 系统的快捷键是`Alt + 字符键`，在 Mac 系统的快捷键是`Ctrl + Alt + 字符键`。

注意，accesskey如果跟操作系统或浏览器级别的快捷键有冲突，这时不会生效。

### hidden

hidden是一个布尔属性，表示当前的网页元素不再跟页面相关，因此浏览器不会渲染这个元素，所以就不会在网页中看到它。

```html
<p hidden>本句不会显示在页面上。</p>
```

注意，CSS 的可见性设置，高于hidden属性。如果 CSS 设为该元素可见，hidden属性将无效。

### lang，dir

lang属性指定网页元素使用的语言。

```html
<p lang="en">hello</p>
<p lang="zh">你好</p>
```

lang属性的值，必须符合 BCP47 的标准。下面是一些常见的语言代码：

- zh：中文
- zh-Hans：简体中文
- zh-Hant：繁体中文
- en：英语
- en-US：美国英语
- en-GB：英国英语
- es：西班牙语
- fr：法语

dir属性表示文字的阅读方向，有三个可能的值：

- ltr：从左到右阅读，比如英语。
- rtl：从右到左阅读，阿拉伯语、波斯语、希伯来语都属于这一类。
- auto：浏览器根据内容的解析结果，自行决定。

### translate

translate属性只用于文本元素，用来指示翻译软件，不翻译该文本。

```html
<p>
  <span translate="no">Wien<span>
  named world's most liveable city (again)!
</p>
```

如果translate设为yes，就告诉翻译软件应该翻译该文本。

### contenteditable

HTML 网页的内容默认是用户不能编辑，contenteditable属性允许用户修改内容。它有两个可能的值。

- true或空字符串：内容可以编辑
- false：不可以编辑

```html
<p contenteditable="true">
鼠标点击，本句内容可修改。
</p>
```

### spellcheck

浏览器一般会自带拼写检查功能，编辑内容时，拼错的单词下面会显示红色的波浪线。spellcheck属性就表示，是否打开拼写检查。<br>它有两个可能的值。

- true：打开拼写检查
- false：关闭拼写检查

```html
<p contenteditable="true" spellcheck="true">
英语单词 separate 容易写错成 seperate。
</p>
```

注意，由于该属性只在编辑时生效，所以这个例子必须加上contenteditable属性，表示本段内容可编辑。鼠标单击就可以进入编辑状态，这时才会看到拼写提示。不可编辑的状态下，拼写错误是不提示显示的。对于那些不可编辑的元素，该属性无效。<br>这个属性看上去像布尔属性，但是其实是枚举属性，所以最好不要省略它的值。如果没有指定这个属性，浏览器将自行决定是否打开拼写检查。

### data-属性

data-属性用于放置自定义数据。如果没有其他属性或元素合适放置数据，就可以放在`data-属性`。

```html
<a href="#" class="tooltip" data-tip="this is the tip!">链接</a>
```

data-属性只能通过 CSS 或 JavaScript 利用：

```css
/* HTML 代码如下
<div data-role="mobile">
Mobile only content
</div>
*/
div[data-role="mobile"] {
  display:none;
}

/* HTML 代码如下
<div class="test" data-content="This is the div content">test</div>
*/
.test {
  display: inline-block;
}
.test:after {
  content: attr(data-content);
}
```

# Ref

- [ ] [HTML（阮一峰）](https://wangdoc.com/html/intro)
