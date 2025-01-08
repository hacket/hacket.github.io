---
date created: 2024-12-08 21:28
date updated: 2024-12-26 00:01
dg-publish: true
---

# 数据代理

## 什么是数据代理？

数据代理：通过一个对象代理对另一个对象中属性的操作（读/写）<br />示例：通过对obj2的修改，其实是对obj的修改；获取obj2也是获取到obj上的值

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>何为数据代理</title>
	</head>
	<body>
		<!-- 数据代理：通过一个对象代理对另一个对象中属性的操作（读/写）-->
		<script type="text/javascript" >
			let obj = {x:100}
			let obj2 = {y:200}

			Object.defineProperty(obj2,'x',{
				get(){
					return obj.x
				},
				set(value){
					obj.x = value
				}
			})
		</script>
	</body>
</html>
```

## Vue中的数据代理

- Vue中的数据代理：

通过vm对象来代理data对象中属性的操作（读/写）

- Vue中数据代理的好处：

更加方便的操作data中的数据

- 基本原理：
  1. 通过`Object.defineProperty()`把data对象中所有属性添加到vm上。
  2. 为每一个添加到vm上的属性，都指定一个getter/setter。
  3. 在getter/setter内部去操作（读/写）data中对应的属性。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Vue中的数据代理</title>
		<!-- 引入Vue -->
		<script type="text/javascript" src="../js/vue.js"></script>
	</head>
	<body>
		<!-- 
				1.Vue中的数据代理：
							通过vm对象来代理data对象中属性的操作（读/写）
				2.Vue中数据代理的好处：
							更加方便的操作data中的数据
				3.基本原理：
							通过Object.defineProperty()把data对象中所有属性添加到vm上。
							为每一个添加到vm上的属性，都指定一个getter/setter。
							在getter/setter内部去操作（读/写）data中对应的属性。
		 -->
		<!-- 准备好一个容器-->
		<div id="root">
			<h2>学校名称：{{name}}</h2>
			<h2>学校地址：{{address}}</h2>
		</div>
	</body>

	<script type="text/javascript">
		Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
		
		const vm = new Vue({
			el:'#root',
			data:{
				name:'尚硅谷',
				address:'宏福科技园'
			}
		})
	</script>
</html>
```

**vue为什么能获取到data中的值？**

> vue中会有_data，通过数据代理将_data代理到data

# 数据监测原理
