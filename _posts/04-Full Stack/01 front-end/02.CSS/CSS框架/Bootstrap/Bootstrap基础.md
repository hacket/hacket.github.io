---
date created: 2024-12-25 00:53
date updated: 2024-12-25 00:53
dg-publish: true
---

<https://getbootstrap.com/>

# Bootstrap使用

## 引入

<https://getbootstrap.com/docs/4.0/getting-started/introduction/>

### Vue中引入

使用 `npm` 引入 Bootstrap 的安裝方式

```shell
npm install bootstrap
```

需要將bootstrap在`src/main.js`引入，供全局做使用：

```javascript
//vue2
import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css"
// ... 其他要引入的套件

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  store,
});

import "bootstrap/dist/js/bootstrap.js"
```

```javascript
//vue3
import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css"
// ... 其他要引入的套件

createApp(App).use(router).mount("#app");

import "bootstrap/dist/js/bootstrap.js"
```

## 样式

### Background

<https://getbootstrap.com/docs/5.3/utilities/background/>

#### Background color

```html
<div class="p-3 mb-2 bg-primary text-white">.bg-primary</div>
<div class="p-3 mb-2 bg-primary-subtle text-primary-emphasis">.bg-primary-subtle</div>
<div class="p-3 mb-2 bg-secondary text-white">.bg-secondary</div>
<div class="p-3 mb-2 bg-secondary-subtle text-secondary-emphasis">.bg-secondary-subtle</div>
<div class="p-3 mb-2 bg-success text-white">.bg-success</div>
<div class="p-3 mb-2 bg-success-subtle text-success-emphasis">.bg-success-subtle</div>
<div class="p-3 mb-2 bg-danger text-white">.bg-danger</div>
<div class="p-3 mb-2 bg-danger-subtle text-danger-emphasis">.bg-danger-subtle</div>
<div class="p-3 mb-2 bg-warning text-dark">.bg-warning</div>
<div class="p-3 mb-2 bg-warning-subtle text-warning-emphasis">.bg-warning-subtle</div>
<div class="p-3 mb-2 bg-info text-dark">.bg-info</div>
<div class="p-3 mb-2 bg-info-subtle text-info-emphasis">.bg-info-subtle</div>
<div class="p-3 mb-2 bg-light text-dark">.bg-light</div>
<div class="p-3 mb-2 bg-light-subtle text-light-emphasis">.bg-light-subtle</div>
<div class="p-3 mb-2 bg-dark text-white">.bg-dark</div>
<div class="p-3 mb-2 bg-dark-subtle text-dark-emphasis">.bg-dark-subtle</div>
<div class="p-3 mb-2 bg-body-secondary">.bg-body-secondary</div>
<div class="p-3 mb-2 bg-body-tertiary">.bg-body-tertiary</div>
<div class="p-3 mb-2 bg-body text-body">.bg-body</div>
<div class="p-3 mb-2 bg-black text-white">.bg-black</div>
<div class="p-3 mb-2 bg-white text-dark">.bg-white</div>
<div class="p-3 mb-2 bg-transparent text-body">.bg-transparent</div>
```

#### Background gradient

### Sizing 尺寸

<https://getbootstrap.com/docs/5.3/utilities/sizing/>

#### 相对父容器

- width

```html
<div class="w-15 m-1 bg-primary">Width 15%</div>
<div class="w-25 m-1 p-3 bg-primary">Width 25%</div>
<div class="w-50 m-1 p-3 bg-primary">Width 50%</div>
<div class="w-75 m-1 p-3 bg-primary">Width 75%</div>
<div class="w-100 m-1 p-3 bg-primary">Width 100%</div>
<div class="w-auto m-1 p-3 bg-primary">Width auto</div>
```

效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240227215536.png)

- height

```html
<div style="height: 100px">
  <div class="h-25 d-inline-block bg-success" style="width: 120px">Height 25%</div>
  <div class="h-50 d-inline-block bg-success" style="width: 120px">Height 50%</div>
  <div class="h-75 d-inline-block bg-success" style="width: 120px">Height 75%</div>
  <div class="h-100 d-inline-block bg-success" style="width: 120px">Height 100%</div>
  <div class="h-auto d-inline-block bg-success" style="width: 120px">Height auto</div>
</div>
```

效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240227215910.png)

- mx-100, mx-100 最大宽度和最大高度

```html
<div style="height: 100px;">
  <div class="mh-100" style="width: 100px; height: 200px;">Max-height 100%</div>
</div>
<div style="height: 100px;">
  <div class="mh-100" style="width: 100px; height: 200px;">Max-height 100%</div>
</div>
```

#### 相对于viewport

```html
<div class="min-vw-100">Min-width 100vw</div>
<div class="min-vh-100">Min-height 100vh</div>
<div class="vw-100">Width 100vw</div>
<div class="vh-100">Height 100vh</div>
```

### Spacing 边距

<https://getbootstrap.com/docs/5.3/utilities/spacing/>

影响元素之间的间距是可以通过style的margin或padding属性来实现，但这两个属性本意并不相同；margin影响的是本元素与相邻外界元素之间的距离，这里简称外边距；padding影响的元素本身与其内部子元素之间的距离，简称为内填充。

bootstrap提供了简写的class名，名称分别以`m-`开头和`p-`开头的类

#### margin

| class name | 等价的style                         |
| ---------- | -------------------------------- |
| m-0        | 等价于`{margin:0 !important}`       |
| m-1        | 等价于`{margin:0.25rem !important}` |
| m-2        | 等价于`{margin:0.5rem !important}`  |
| m-3        | 等价于`{margin:1rem !important}`    |
| m-4        | 等价于`{margin:1.5rem !important}`  |
| m-auto     | 等价于{margin:auto !important}      |

#### padding

| class name | 等价的style                          |
| ---------- | --------------------------------- |
| p-0        | 等价于`{padding:0 !important}`       |
| p-1        | 等价于`{padding:0.25rem !important}` |
| p-2        | 等价于`{padding:0.5rem !important}`  |
| p-3        | 等价于`{padding:1rem !important}`    |
| p-4        | 等价于`{padding:1.5rem !important}`  |
| p-auto     | 等价于{padding:auto !important}      |

#### 调整某一侧的边距

有几个缩写：t,b,s,e,x,y含义分别是top,bottom,start,end, start和end,top和bottom

- `t` - for classes that set `margin-top` or `padding-top`
- `b` - for classes that set `margin-bottom` or `padding-bottom`
- `s` - (start) for classes that set `margin-left` or `padding-left` in LTR, `margin-right` or `padding-right` in RTL
- `e` - (end) for classes that set `margin-right` or `padding-right` in LTR, `margin-left` or `padding-left` in RTL
- `x` - for classes that set both `*-left` and `*-right`
- `y` - for classes that set both `*-top` and `*-bottom`
- blank - for classes that set a `margin` or `padding` on all 4 sides of the element

| class名    | 等价的style                           |
| --------- | ---------------------------------- |
| mt-2      | {margin-top: 0.5rem !important}    |
| mb-2      | {margin-bottom: 0.5rem !important} |
| ml-2      | {margin-left: 0.5rem !important}   |
| ...       |                                    |
| padding类似 |                                    |

#### 负数

默认关闭，通过Scss开启：`$enable-negative-margins: true`

和正数不同的是前面加了个`n`

```scss
.mt-n1 {
  margin-top: -0.25rem !important;
}
```

#### Gap

用`display: grid` or `display: flex`，可以在父容器设置gap

```html
<div class="grid gap-3">
  <div class="p-2 g-col-6">Grid item 1</div>
  <div class="p-2 g-col-6">Grid item 2</div>
  <div class="p-2 g-col-6">Grid item 3</div>
  <div class="p-2 g-col-6">Grid item 4</div>
</div>
```

效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240228111639.png)

#### row-gap

`row-gap`设置垂直方向的space

```html
<div class="grid gap-0 row-gap-3">
  <div class="p-2 g-col-6">Grid item 1</div>
  <div class="p-2 g-col-6">Grid item 2</div>
  <div class="p-2 g-col-6">Grid item 3</div>
  <div class="p-2 g-col-6">Grid item 4</div>
</div>
```

效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240228112603.png)

#### column-gap

`column-gap`设置水平方向的space

```html
<div class="grid gap-0 column-gap-3">
  <div class="p-2 g-col-6">Grid item 1</div>
  <div class="p-2 g-col-6">Grid item 2</div>
  <div class="p-2 g-col-6">Grid item 3</div>
  <div class="p-2 g-col-6">Grid item 4</div>
</div>
```

效果：
![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240228112638.png)

### [Input group](https://getbootstrap.com/docs/4.0/components/input-group/) 输入框

### [List group](https://getbootstrap.com/docs/4.0/components/list-group/) 列表

#### Basic

```html
<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1708521234089-f5e0571a-4531-4f61-90e1-68bb835876ac.png#averageHue=%23fefefe&clientId=uefd24127-5e86-4&from=paste&height=204&id=u6688b9b5&originHeight=532&originWidth=834&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42350&status=done&style=none&taskId=uea6a6df4-29af-476a-8c8e-3a1a49fba5c&title=&width=320)

#### Contextual classes 带stateful backgroud的

```html
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>


  <a href="#" class="list-group-item list-group-item-action list-group-item-primary">This is a primary list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-secondary">This is a secondary list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-success">This is a success list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-danger">This is a danger list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-warning">This is a warning list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-info">This is a info list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-light">This is a light list group item</a>
  <a href="#" class="list-group-item list-group-item-action list-group-item-dark">This is a dark list group item</a>
</div>
```

![image.png|400](https://cdn.nlark.com/yuque/0/2024/png/694278/1708521321591-44d6e67d-037d-43ef-b764-79b1df9a3c00.png#averageHue=%23bbcedb&clientId=uefd24127-5e86-4&from=paste&height=358&id=ua1a4a1f4&originHeight=898&originWidth=818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88614&status=done&style=none&taskId=ub0b7557b-09c0-4b76-b773-686d1298a98&title=&width=326)
