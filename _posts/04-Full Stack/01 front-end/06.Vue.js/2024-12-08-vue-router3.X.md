---
date created: 2024-12-08 21:28
---

# vue-router

官方文档：<https://v3.router.vuejs.org/zh/guide/>

## 路由基础

### 概念

1. 理解： 一个路由（route）就是一组映射关系（key - value），多个路由需要路由器（router）进行管理。
2. 前端路由：key是路径，value是组件。
3. 后端路由：value是function，用于处理**请求路径**找到匹配的**函数**来处理(`@RequestMapping`)

## [vue-router3.x概述](https://v3.router.vuejs.org/)

Vue Router是Vue.js的官网路由。用于构建Single Page Application，包括以下特性：

- Nested的route/view mapping
- 现代化、组件化的路由配置
- 路由params、query和通配符
- 转场动画
- 细粒度的导航控制
- links自动active CSS
- HTML5 history mode or hash mode, with auto-fallback in IE9
- Customizable Scroll Behavior

## vue-router基本使用

### HelloWorld

#### 安装

安装vue-router，命令：

```shell
npm i vue-router@3
```

##### vue-router和Vue版本兼容问题

- vue2用vue-router3.x版本

```shell
npm i vue-router@3
# 如果用的Vue2.x安装错了vue-router版本，先卸载，再安装vue-router3.x版本
npm uninstall vue-router
npm i vue-router@3
```

- vue3用vue-router4.x版本

```shell
# 截止到2024年2月20日
npm i vue-router
```

#### 编写router配置项和应用插件

src/router/index.js

```javascript
import Vue from 'vue'
import VueRouter from "vue-router"
import AppTools from "../components/AppTools.vue"
import AppDeeplink from "../components/AppDeeplink.vue"
import AppOnelink from "../components/AppOnelink.vue"
import AppGPIR from "../components/AppGPIR.vue"
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: "",
            redirect: "/tools"
        },
        {
            name: "tools",
            path: "/tools",
            component: AppTools
        },
        {
            name: "deeplink",
            path: "/deeplink",
            component: AppDeeplink
        },
        {
            name: "onelink",
            path: "/onelink",
            component: AppOnelink
        }
    ],
    mode: "history",
    linkActiveClass: "active"
})

export default router;
```

#### 在main.js引入

```javascript
import Vue from 'vue'
// vue-router引入路由器
import router from './router'
import App from './App.vue'
// ...
new Vue({
  el: '#app',
  render: h => h(App),
  router
}).$mount('#app')

```

#### router-view标签指定展示位置

用`<router-view/>`标签，

```vue
<router-view></router-view>
```

#### 实现切换（active-class可配置高亮样式）

```vue
<template>
	<div>
		<div class="row">
			<div class="col-xs-offset-2 col-xs-8">
				<div class="page-header">
					<h2>Vue Router Demo</h2>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-2 col-xs-offset-2">
				<div class="list-group">
					<!-- 原始html中我们使用a标签实现页面的跳转 -->
					<!-- <a class="list-group-item active" href="./about.html">About</a>
					<a class="list-group-item" href="./home.html">Home</a> -->

					<!-- Vue中借助router-link标签实现路由的切换 -->
					<router-link class="list-group-item" active-class="active" to="/about">About</router-link>
					<router-link class="list-group-item" active-class="active" to="/home">Home</router-link>
				</div>
			</div>
			<div class="col-xs-6">
				<div class="panel">
					<div class="panel-body">
						<!-- 指定组件的呈现位置 -->
						<router-view></router-view>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'App',
}
</script>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706720379701-0239ae01-6651-4ddd-9afc-29392fc113e3.png#averageHue=%23f8f8f8&clientId=u33b932d8-00a1-4&from=paste&height=153&id=u81576492&originHeight=291&originWidth=934&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=5139&status=done&style=none&taskId=uf4be4b58-61dd-420e-8640-c8844508e16&title=&width=491.66668701171875)

### 几个注意点

1. 路由组件通常存放在`pages`文件夹，一般组件通常存放在`components`文件夹。
2. 通过切换，“隐藏”了的路由组件，默认是被销毁掉的，需要的时候再去挂载。
3. 每个组件都有自己的`$route`属性，里面存储着自己的路由信息。
4. 整个应用只有一个router，可以通过组件的`$router`属性获取到。
5. 在配置routers时，引入的compoment大小写编译器可能不报错，但是vue编译会报错。

## 基础

### 起步

#### HTML方式 [router-link标签](https://v3.router.vuejs.org/zh/api/#router-link)

`<router-link>` 组件支持用户在具有路由功能的应用中 (点击) 导航。 通过 `to` 属性指定目标地址，默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 `tag` 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名：`.router-link-active`，可以通过`active-class="active"`自定义类名。

##### 属性

###### to

- 类型: string | Location
- required

表示目标路由的链接。当被点击后，内部会立刻把 to 的值传到 router.push()，所以这个值可以是一个字符串或者是描述目标位置的对象。

```html
<!-- 字符串 -->
<router-link to="home">Home</router-link>
<!-- 渲染结果 -->
<a href="home">Home</a>

<!-- 使用 v-bind 的 JS 表达式 -->
<router-link v-bind:to="'home'">Home</router-link>

<!-- 不写 v-bind 也可以，就像绑定别的属性一样 -->
<router-link :to="'home'">Home</router-link>

<!-- 同上 -->
<router-link :to="{ path: 'home' }">Home</router-link>

<!-- 命名的路由 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

<!-- 带查询参数，下面的结果为 /register?plan=private -->
<router-link :to="{ path: 'register', query: { plan: 'private' }}"
  >Register</router-link
>
```

###### replace

- 类型: boolean
- 默认值: false

设置 replace 属性的话，当点击时，会调用 router.replace() 而不是 router.push()，于是导航后不会留下 history 记录。

1. 作用：控制路由跳转时操作浏览器历史记录的模式
2. 浏览器的历史记录有两种写入方式：分别为`push`和`replace`，`push`是追加历史记录，`replace`是替换当前记录。路由跳转时候默认为`push`
3. 如何开启`replace`模式：`<router-link replace .......>News</router-link>`

```html
<router-link :to="{ path: '/abc'}" replace></router-link>
```

###### append

- 类型: boolean
- 默认值: false

设置 append 属性后，则在当前 (相对) 路径前添加基路径。例如，我们从 /a 导航到一个相对路径 b，如果没有配置 append，则路径为 /b，如果配了，则为 /a/b

```html
<router-link :to="{ path: 'relative/path'}" append></router-link>
```

###### tag

- 类型: string
- 默认值: "a"

有时候想要 `<router-link>` 渲染成某种标签，例如 `<li>`。 于是我们使用 tag prop 类指定何种标签，同样它还是会监听点击，触发导航。

```html
<router-link to="/foo" tag="li">foo</router-link>
<!-- 渲染结果 -->
<li>foo</li>
```

###### active-class

- 类型: string
- 默认值: "router-link-active"

设置链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 `linkActiveClass` 来全局配置

###### exact

- 类型: boolean
- 默认值: false

“是否激活”默认类名的依据是包含匹配。 举个例子，如果当前的路径是 `/a` 开头的，那么 `<router-link to="/a">` 也会被设置 CSS 类名。

###### v-slot API (3.1.0 新增)

在使用 `v-slot` API 时，需要向 router-link 传入一个单独的子元素。否则 router-link 将会把子元素包裹在一个 span 元素内。

```html
<router-link
  to="/about"
  custom
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <NavLink :active="isActive" :href="href" @click="navigate"
    >{{ route.fullPath }}
  </NavLink>
</router-link>
```

- href：解析后的 URL。将会作为一个 a 元素的 href attribute。
- route：解析后的规范化的地址。
- navigate：触发导航的函数。会在必要时自动阻止事件，和 router-link 同理。
- isActive：如果需要应用[激活的 class](https://v3.router.vuejs.org/zh/api/#active-class) 则为 true。允许应用一个任意的 class。
- isExactActive：如果需要应用[精确激活的 class](https://v3.router.vuejs.org/zh/api/#exact-active-class) 则为 true。允许应用一个任意的 class。

示例：将激活的 class 应用在外层元素
有的时候我们可能想把激活的 class 应用到一个外部元素而不是 `<a>` 标签本身，这时你可以在一个 router-link 中包裹该元素并使用 v-slot property 来创建链接：

```html
<router-link
  to="/foo"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
  custom
>
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

> 如果你在 `<a>` 元素上添加一个 target="_blank"，则 @click="navigate" 处理器会被忽略。

##### 示例

```html
<script src="https://unpkg.com/vue@2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router@3/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

- 通过`router-link`组件来导航，`to`属性指定跳转的链接；router-link默认会渲染成`<a>`标签
- 通过`router-view`组件匹配路由出口

> 当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值 `router-link-active`

#### JS方式

- 注入路由

```javascript
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```

- 访问路由

可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由：

```vue
// Home.vue
export default {
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
```

### 嵌套路由/多级路由

要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：

1. 配置路由规则，使用`children`配置项：

```javascript
routes:[
	{
		path:'/about',
		component:About,
	},
	{
		path:'/home',
		component:Home,
		children:[ //通过children配置子级路由
			{
				path:'news', //此处一定不要写：/news
				component:News
			},
			{
				path:'message',//此处一定不要写：/message
				component:Message
			}
		]
	}
]
```

**要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。**
children 配置就是像 routes 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。

2. 跳转（要写完整路径）：

```vue
<router-link to="/home/news">News</router-link>
```

#### 示例：子页面的切换

- Home.vue

```vue
<template>
    <div>
        <h2>Home组件内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <li>
                    <router-link class="list-group-item" active-class="active" to="/home/news">News</router-link>
                </li>
                <li>
                    <router-link class="list-group-item" active-class="active" to="/home/message">Message</router-link>
                </li>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    beforeDestroy() {
        console.log('Home组件即将被销毁了')
    },
    mounted() {
        console.log('Home组件挂载完毕了', this)
        window.homeRoute = this.$route
        window.homeRouter = this.$router
    },
}
</script>
```

- 切换到Home的News Tab

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706720420358-045ced2b-3a16-4d5d-b446-ece091d8a5da.png#averageHue=%23fcfcfc&clientId=u33b932d8-00a1-4&from=paste&height=163&id=u97973cad&originHeight=511&originWidth=1723&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10116&status=done&style=none&taskId=u2a7c250a-fea9-4648-abca-2c90b11c5bb&title=&width=548.3333740234375)

- 切换到Home的Message Tab

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706720431039-b43929a7-68f7-49f8-b0e3-7c8597b3c156.png#averageHue=%23fdfdfd&clientId=u33b932d8-00a1-4&from=paste&height=176&id=ub81fe0c1&originHeight=561&originWidth=1753&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10977&status=done&style=none&taskId=uc3a67d07-d313-4780-9047-8ebba80b144&title=&width=549.3333740234375)

### [编程式路由导航](https://v3.router.vuejs.org/zh/guide/essentials/navigation.html)

作用：不借助`<router-link>`创建`a`标签来定义导航链接，让路由跳转更加灵活

#### router.push(location, onComplete?, onAbort?)

> 注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 `this.$router.push`

想要导航到不同的 URL，则使用 `this.$router.push` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。<br>当你点击 `<router-link>` 时，这个方法会在内部调用，所以说，点击 `<router-link :to="...">` 等同于调用 `this.$router.push(...)`。

| 声明式                       | 编程式                    |
| ------------------------- | ---------------------- |
| `<router-link :to="...">` | this.$router.push(...) |

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

```javascript
// 字符串
this.$router.push('home')

// 对象
this.$router.push({ path: 'home' })

// 命名的路由
this.$router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
this.$router.push({ path: 'register', query: { plan: 'private' }})
```

**注意：如果提供了 path，params 会被忽略（也就是说要用params，不能用path，需要用name），上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：**

```javascript
const userId = '123'
this.$router.push({ name: 'user', params: { userId }}) // -> /user/123
this.$router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
this.$router.push({ path: '/user', params: { userId }}) // -> /user
```

> 同样的规则也适用于 router-link 组件的 to 属性。

在 2.2.0+，可选的在 router.push 或 router.replace 中提供 onComplete 和 onAbort 回调作为第二个和第三个参数。这些回调将会在导航成功完成 (在所有的异步钩子被解析之后) 或终止 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由) 的时候进行相应的调用。<br>在 3.1.0+，可以省略第二个和第三个参数，此时如果支持 Promise，router.push 或 router.replace 将返回一个 Promise。<br>注意： 如果目的地和当前路由相同，只有参数发生了改变 (比如从一个用户资料到另一个 /users/1 -> /users/2)，你需要使用 `beforeRouteUpdate` 来响应这个变化 (比如抓取用户信息)。

#### router.replace(location, onComplete?, onAbort?)

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

| 声明式                             | 编程式                 |
| ------------------------------- | ------------------- |
| <router-link :to="..." replace> | router.replace(...) |

#### router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。

```javascript
// 在浏览器记录中前进一步，等同于 history.forward()
this.$router.go(1)

// 后退一步记录，等同于 history.back()
this.$router.go(-1)

// 前进 3 步记录
this.$router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
this.$router.go(-100)
this.$router.go(100)
```

#### 操作 History

```javascript
this.$router.forward() //前进
this.$router.back() //后退
this.$router.go() //可前进也可后退（传递数字，根据正负前进和后退）
```

### 路由组件传参

#### query

- 传递参数方式1：带在路由路径的query

```vue
<template>
  <div>
    <ul>
      <li v-for="m in messageList" :key="m.id">
        <!-- 跳转路由并携带query参数，to的字符串写法 -->
        <router-link :to="`/home/message/detail?id=${m.id}&title=${m.title}`">{{ m.title }}</router-link>
      </li>
    </ul>
    <hr>
      <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'Message',
    data() {
      return {
        messageList: [
          { id: '001', title: '消息001' },
          { id: '002', title: '消息002' },
          { id: '003', title: '消息003' }
        ]
      }
    },
  }
</script>
```

用模板字符串````包裹

- 传递方式2：对象方式

```vue
<template>
	<div>
		<ul>
			<li v-for="m in messageList" :key="m.id">
				<!-- 跳转路由并携带query参数，to的对象写法 -->
				<router-link :to="{
					path: '/home/message/detail',
					query: {
						id: m.id,
						title: m.title
					}
				}">
					{{ m.title }}
				</router-link>

			</li>
		</ul>
		<hr>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Message',
	data() {
		return {
			messageList: [
				{ id: '001', title: '消息001' },
				{ id: '002', title: '消息002' },
				{ id: '003', title: '消息003' }
			]
		}
	},
}
</script>
```

- 接收参数

```javascript
$route.query.id
$route.query.title
```

#### params

- 路由定义

其中Message组件定义了params参数`detail/:id/:title`，不加`:id :title`占位会被当成path处理

```javascript
// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import About from '../pages/About'
import Home from '../pages/Home'
import News from '../pages/News'
import Message from '../pages/Message'
import Detail from '../pages/Detail'

//创建并暴露一个路由器
export default new VueRouter({
	routes: [
		{
			name: 'guanyu',
			path: '/about',
			component: About
		},
		{
			path: '/home',
			component: Home,
			children: [
				{
					path: 'news',
					component: News,
				},
				{
					path: 'message',
					component: Message,
					children: [
						{
							name: 'xiangqing',
							path: 'detail/:id/:title',
							component: Detail,
						}
					]
				}
			]
		}
	]
})

```

如何传递：

- 第一种：直接在路由后面拼接
- 第二种：通过对象的params传递

```vue
<template>
	<div>
		<ul>
			<li v-for="m in messageList" :key="m.id">
				<!-- 跳转路由并携带params参数，to的字符串写法 -->
				<!-- <router-link :to="`/home/message/detail/${m.id}/${m.title}`">{{m.title}}</router-link>&nbsp;&nbsp; -->

				<!-- 跳转路由并携带params参数，to的对象写法，不能用path，只能用name -->
				<router-link :to="{
					name: 'xiangqing',
					params: {
						id: m.id,
						title: m.title
					}
				}">
					{{ m.title }}
				</router-link>

			</li>
		</ul>
		<hr>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Message',
	data() {
		return {
			messageList: [
				{ id: '001', title: '消息001' },
				{ id: '002', title: '消息002' },
				{ id: '003', title: '消息003' }
			]
		}
	},
}
</script>
```

> **特别注意：**路由携带params参数时，若使用to的对象写法，则不能使用path配置项，必须使用name配置！

- 接收params参数

```javascript
$route.params.id
$route.params.title
```

#### 路由的props配置

作用：让路由组件更方便的收到参数<br>请尽可能保持 props 函数为无状态的，因为它只会在路由发生变化时起作用。如果你需要状态来定义 props，请使用包装组件，这样 Vue 才可以对状态变化做出反应。

##### 布尔模式：取代与 `$route` 的耦合

如果 props 被设置为 true，route.params 将会被设置为组件属性。<br>示例：<br>路由配置：

```javascript
//创建并暴露一个路由器
export default new VueRouter({
	routes:[
		{
			name:'guanyu',
			path:'/about',
			component:About
		},
		{
			path:'/home',
			component:Home,
			children:[
				{
					path:'news',
					component:News,
				},
				{
					path:'message',
					component:Message,
					children:[
						{
							name:'xiangqing',
							path:'detail',
							component:Detail,
							// props的第二种写法，值为布尔值，若布尔值为真，就会把该路由组件收到的所有params参数，以props的形式传给Detail组件。
							props:true
						}
					]
				}
			]
		}
	]
})
```

通过props传递：

```vue
<!-- 跳转路由并携带params参数，to的对象写法 -->
<router-link :to="{
    name:'xiangqing',
    query:{
      id:m.id,
      title:m.title
    }
  }">
       {{m.title}}
  </router-link>
```

接收组件Detail.vue，可以用prop来接收，不用`this.$route.params`接收

```vue
<template>
	<ul>
		<li>消息编号：{{id}}</li>
		<li>消息标题：{{title}}</li>
	</ul>
</template>

<script>
	export default {
		name:'Detail',
		props:['id','title']
	}
</script>
```

##### 对象模式

如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。<br>案例：

> 该对象中的所有key-value都会以props的形式传给Detail组件

```javascript
// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import About from '../pages/About'
import Home from '../pages/Home'
import News from '../pages/News'
import Message from '../pages/Message'
import Detail from '../pages/Detail'

//创建并暴露一个路由器
export default new VueRouter({
	routes:[
		{
			name:'guanyu',
			path:'/about',
			component:About
		},
		{
			path:'/home',
			component:Home,
			children:[
				{
					path:'news',
					component:News,
				},
				{
					path:'message',
					component:Message,
					children:[
						{
							name:'xiangqing',
							path:'detail',
							component:Detail,
							//props的第一种写法，值为对象，该对象中的所有key-value都会以props的形式传给Detail组件。
							props:{a:1,b:'hello'}
						}
					]
				}
			]
		}
	]
})

```

- 接收的组件Detail.vue

```vue
<template>
	<ul>
		<li>消息编号：{{id}}</li>
		<li>消息标题：{{title}}</li>
	</ul>
</template>

<script>
	export default {
		name:'Detail',
		computed: {
			id(){
				return this.$route.query.id
			},
			title(){
				return this.$route.query.title
			},
		},
	}
</script>
```

##### 函数模式

示例：

- 路由配置：

```javascript
// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import About from '../pages/About'
import Home from '../pages/Home'
import News from '../pages/News'
import Message from '../pages/Message'
import Detail from '../pages/Detail'

//创建并暴露一个路由器
export default new VueRouter({
	routes: [
		{
			name: 'guanyu',
			path: '/about',
			component: About
		},
		{
			path: '/home',
			component: Home,
			children: [
				{
					path: 'news',
					component: News,
				},
				{
					path: 'message',
					component: Message,
					children: [
						{
							name: 'xiangqing',
							path: 'detail',
							component: Detail,
							// props的第三种写法，值为函数
							props($route) {
								return {
									id: $route.query.id,
									title: $route.query.title,
									a: 1,
									b: 'hello',
									id2: $route.params.id2,
								}
							}
						}
					]
				}
			]
		}
	]
})

```

props是一个函数，参数为`$route`；返回的是一个对象，可以在Detail.vue组件通过props接收：

```vue
<template>
	<ul>
		<li>--消息编号：{{ id }}</li>
		<li>==消息标题：{{ title }}</li>
		<li>a={{ a }}</li>
		<li>{{ id2 }}</li>
	</ul>
</template>

<script>
export default {
	name: 'Detail',
	props: ['id', 'title', 'a', 'id2'],
	mounted() {
		console.log(this.$route)
		console.log(this.$route.query)
		console.log(this.$route.params)
	},
}
</script>
```

数据发送：

```vue
<template>
	<div>
		<ul>
			<li v-for="m in messageList" :key="m.id">
				<!-- 跳转路由并携带params参数，to的对象写法 -->
				<router-link :to="{
					name: 'xiangqing',
					query: {
						id: m.id,
						title: m.title
					},
					params: {
						id2: 'id2',
						title2: 'title2'
					}
				}">
					{{ m.title }}-
				</router-link>

			</li>
		</ul>
		<hr>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Message',
	data() {
		return {
			messageList: [
				{ id: '001', title: '消息001' },
				{ id: '002', title: '消息002' },
				{ id: '003', title: '消息003' }
			]
		}
	},
}
</script>
```

![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706806164275-bd577528-01e9-4520-8e14-7fea9a05f85e.png#averageHue=%23fafafa&clientId=ua9d0affc-380a-4&from=paste&height=271&id=ue48d407c&originHeight=602&originWidth=743&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10057&status=done&style=none&taskId=u3da867ec-cdf8-4aad-810d-b2a13e2a12c&title=&width=334.3333435058594)

### [命名路由](https://v3.router.vuejs.org/zh/guide/essentials/named-routes.html)

简化路由的跳转。

1. 在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

2. 要链接到一个命名路由，可以给 `router-link` 的 `to` 属性传一个对象，对象里的name配置路由的name名称：

```javascript
<router-link :to="{
  name: 'user',
  params: { userId: 123 }
}">User</router-link>
```

> 注意是用的`:to`

3. 代码push也是一样

```javascript
router.push({ name: 'user', params: { userId: 123 } })
```

### [命名视图](https://v3.router.vuejs.org/zh/guide/essentials/named-views.html)

### [重定向和别名](https://v3.router.vuejs.org/zh/guide/essentials/redirect-and-alias.html)

### 缓存路由组件

作用：让不展示的路由组件保持挂载，不被销毁。

```vue
<keep-alive include="News"> 
  <router-view></router-view>
</keep-alive>
```

> 这段代码的作用是：当页面切换到名称为"News"的组件时，它会被缓存起来，当用户再次浏览到该组件时，直接从缓存中读取，提高了页面的响应速度和用户体验。

- `<keep-alive>`是一个抽象组件，会将其包裹的内容存储在内存中，并在需要时缓存或销毁它们。
- `include="News"`表示只有名称为"News"的组件才应该被缓存。如果不指定`include`属性，则所有组件都将被缓存。
- `<router-view>`用于渲染当前路由匹配到的组件。

如果要缓存多个组件，可以在`<keep-alive>`的`include`属性中指定一个数组来包含多个组件的名称。例如：

```html
<keep-alive :include="['News', 'Article', 'Comment']">
  <router-view></router-view>
</keep-alive>
```

> 在这个例子中，会将名为"News"、"Article"和"Comment"的三个组件都缓存起来。如果需要缓存更多的组件，只需要将它们的名称放入数组即可。

注意：当使用数组形式进行多个组件的缓存时，Vue.js会根据它们在数组中的顺序依次匹配，如果找到匹配的组件，则会缓存它并停止继续匹配，因此，组件的顺序是有影响的，需要根据实际需求进行调整。

### [HTML5 History 模式](https://v3.router.vuejs.org/zh/guide/essentials/history-mode.html#html5-history-%E6%A8%A1%E5%BC%8F)

` Vue Router  `有两种工作模式：`hash` 模式和 `history` 模式。默认hash

#### hash模式

在 `hash` 模式中，URL 中的路径部分以 `#` 开头，并且后面紧跟着一个由路由器管理的字符串，hash值不会包含在 HTTP 请求中。例如，下面的 URL 表示访问 `/home` 路径：

```javascript
http://localhost:8080/#/home
```

通过 `hash` 模式可以实现单页应用程序（SPA）的核心功能：在网页内部跳转而不需要刷新整个页面。当用户点击链接或者触发事件时，Vue Router 会解析 URL 中的 `hash` 部分，然后根据匹配的路由规则进行组件的渲染和显示。

#### history 模式

在 `history` 模式中，URL 中的路径部分不再使用 `#` 符号，而是直接使用正常的路径。例如，下面的 URL 表示访问 `/home` 路径：

```
http://localhost:8080/home
```

通过 `history` 模式可以实现更加友好的 URL，同时也可以在浏览器历史记录中记录用户浏览的页面，从而使用户可以使用“前进”、“后退”按钮进行导航。<br>要使用 `history` 模式，需要在创建 Vue Router 实例时配置 `mode: 'history'`，如下所示：

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [
    // ...
  ]
})
```

需要注意的是，在使用 `history` 模式时，需要后端服务器进行配置，以保证在刷新页面时能够正确地返回对应的页面。否则，可能会出现 404 错误或者其他问题。<br>对于 Node.js/Express，请考虑使用 [connect-history-api-fallback 中间件](https://github.com/bripkens/connect-history-api-fallback)解决访问404问题

#### 两种模式比较

1. 对于一个url来说，什么是hash值？—— `#及其后面的内容`就是hash值。
2. hash值不会包含在 HTTP 请求中，即：hash值不会带给服务器。
3. hash模式：
   1. 地址中永远带着`#`号，不美观 。
   2. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会被标记为不合法。
   3. 兼容性较好。
4. history模式：
   1. 地址干净，美观 。
   2. 兼容性和hash模式相比略差。
   3. 应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。

## 进阶

### [路由守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html)

#### 什么是路由守卫？

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的, 单个路由独享的, 或者组件级的。<br>通过使用路由守卫，我们可以实现以下功能：

- **权限验证**：在用户访问某些页面时，需要判断用户是否有访问权限。如果用户没有权限访问该页面，可以通过路由守卫拦截路由跳转，并弹出提示信息。
- **记录浏览历史**：在用户浏览网站时，需要记录用户的浏览历史。通过路由守卫，在每次路由变化时记录浏览历史。
- **异步组件处理**：在使用异步组件时，需要在组件加载完成之前显示一些占位信息。通过路由守卫，在异步组件加载完成之前显示占位信息。
- **路由重定向**：在用户访问某个路径时，需要将用户重定向到其他路径。通过路由守卫，可以在路由跳转之前进行重定向操作。

#### [全局前置守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB) beforeEach

```javascript
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。<br>每个守卫方法接收三个参数：

- to: Route: 即将要进入的目标 [路由对象](https://v3.router.vuejs.org/zh/api/#%E8%B7%AF%E7%94%B1%E5%AF%B9%E8%B1%A1)
- from: Route: 当前导航正要离开的路由
- next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  - next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
  - next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
  - next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 [router-link的toprop](https://v3.router.vuejs.org/zh/api/#to) 或 [router.push](https://v3.router.vuejs.org/zh/api/#router-push) 中的选项。
  - next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 [router.onError()](https://v3.router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

确保 `next` 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到 /login 的示例：

```javascript
// GOOD
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    else next()
})
```

#### [全局解析守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E8%A7%A3%E6%9E%90%E5%AE%88%E5%8D%AB) beforeResolve

在 2.5.0+ 你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。

#### [全局后置钩子](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%90%8E%E7%BD%AE%E9%92%A9%E5%AD%90) afterEach

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身：

```javascript
router.afterEach((to, from) => {
  // ...
})
```

#### [路由独享的守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E8%B7%AF%E7%94%B1%E7%8B%AC%E4%BA%AB%E7%9A%84%E5%AE%88%E5%8D%AB) beforeEnter

可以在路由配置上直接定义 beforeEnter 守卫：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

这些守卫与`全局前置守卫`的方法参数是一样的。

#### [组件内的守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)

可以在路由组件内直接定义以下路由导航守卫：

- beforeRouteEnter
- beforeRouteUpdate (2.2 新增)
- beforeRouteLeave

```javascript
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。<br>注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了。

这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。

```javascript
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

#### onError

当导航过程中出现未捕获的错误时调用。需要注意的是，如果在一个路由守卫中抛出了一个错误，此错误将会被传递到最后一个激活的全局错误处理程序。

#### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 路由元信息 meta

定义路由的时候可以配置 meta 字段：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

下面例子展示在全局导航守卫中检查元字段：

```javascript
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

### [数据获取](https://v3.router.vuejs.org/zh/guide/advanced/data-fetching.html#%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96)

有时候，进入某个路由后，需要从服务器获取数据。例如，在渲染用户信息时，你需要从服务器获取用户的数据。我们可以通过两种方式来实现：

- 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示“加载中”之类的指示。
- 导航完成之前获取：导航完成前，在路由进入的守卫中获取数据，在数据获取成功后执行导航。

### 数据存储位置

#### 存储在 Vuex 中

适用于需要共享变量的情况，可以让不同组件之间共享变量，并且可以在全局守卫、独享守卫和组件内守卫中进行访问。由于需要安装和配置 Vuex，因此相对麻烦一些。

```javascript
// 首先，在 Vuex 中定义一个状态
const state = {
  isAuthenticated: false // 是否已经登录
}
...
// 在需要进行变量判断的地方，通过 mutations 修改状态
this.$store.commit('setAuthenticated', true);
...
// 在路由守卫中访问状态
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

#### 存储在当前组件数据中

适用于只需要在当前组件进行变量判断的情况，可以在组件内部直接进行访问和修改，但是无法在其他组件和路由中共享变量。

```javascript
// 在组件的 data 选项中定义一个变量
data() {
  return {
    isAuthenticated: false // 是否已经登录
  }
},
// ...
// 在需要进行变量判断的地方，修改变量的值
this.isAuthenticated = true;
// ...
// 在组件内守卫中访问变量
beforeRouteEnter(to, from, next) {
  if (!this.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
}
```

#### 存储在路由中 meta

适用于只需要在当前路由进行变量判断的情况，可以在独享守卫和组件内守卫中进行访问。但是会导致路由配置变得臃肿，不易于维护。

```javascript
// 在路由配置中定义一个变量
const routes = [
  {
    path: '/home',
    component: Home,
    meta: {
      requiresAuth: true // 是否需要登录权限
    }
  },
  // ...
]
// ...
// 在需要进行变量判断的地方，通过 meta 属性修改变量的值
this.$router.push({
  path: '/home',
  meta: {
    requiresAuth: true,
    isAuthenticated: true
  }
})
// 在独享守卫和组件内守卫中访问变量
beforeEnter(to, from, next) {
  if (!to.meta.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
}

beforeRouteEnter(to, from, next) {
  if (!to.meta.isAuthenticated) {
    next('/login');
  } else {
    next(vm => {
      vm.isAuthenticated = to.meta.isAuthenticated;
    });
  }
}
```

需要注意的是，在进行路由跳转之前，需要根据变量的值决定是否进行路由跳转，并且在组件内守卫中访问变量时，需要使用 `next` 方法的回调函数来更新组件的数据。另外，将变量存储在路由中会导致路由配置变得臃肿，不易于维护，因此建议在需要共享变量的情况下使用 Vuex 状态管理中心。
