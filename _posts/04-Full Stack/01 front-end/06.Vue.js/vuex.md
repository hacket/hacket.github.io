---
date created: 2024-12-08 21:28
---

# Vuex基础

## Vuex概述

在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。<br>![vuex.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706546409564-c04c9b8f-04c1-416b-ba4e-348ec2e27f08.png#averageHue=%23fdfcfa&clientId=ub36134e2-b4e9-4&from=paste&height=941&id=u58ebd1c6&originHeight=1412&originWidth=1800&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=356381&status=done&style=none&taskId=u3848eb09-8e47-4c12-a38c-b6502a3edaf&title=&width=1200)

## Vue使用

### 何时使用？

多个组件需要共享数据时

### 搭建vuex环境

1. 创建文件：`src/store/index.js`

```javascript
//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

//准备actions对象——响应组件中用户的动作
const actions = {}
//准备mutations对象——修改state中的数据
const mutations = {}
//准备state对象——保存具体的数据
const state = {}

//创建并暴露store
export default new Vuex.Store({
  actions,
  mutations,
  state
})
```

2. 在`main.js`中创建vm时传入`store`配置项

```vue
<!-- ...... -->
//引入store
import store from './store'
// ......

//创建vm
new Vue({
  el:'#app',
  render: h => h(App),
  store
})
```

### 基本使用

1. 初始化数据、配置`actions`、配置`mutations`，操作文件`index.js`

```javascript
// 引入Vue核心库
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 引用Vuex
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作，调用this.$store.dispatch('xxx', value)，可绕过直接调用commit
const actions = {
    //响应组件中加的动作
	jia(context,value){
		// console.log('actions中的jia被调用了',miniStore,value)
		context.commit('JIA',value)
	},
}
// 准备mutations——用于操作数据（state）, 调用this.$store.commit('XXX', value)
const mutations = { // 一般大写
    // 执行加
	JIA(state, value){
		// console.log('mutations中的JIA被调用了',state,value)
		state.sum += value
	}
}

// 初始化数据
const state = {
   sum:0
}

// 准备getters——用于将state中的数据进行加工
const getters = {
	bigSum(state){
		return state.sum*10
	}
}

// 创建并暴露store
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
```

2. 组件中读取vuex中的数据：`$store.state.sum`
3. 组件中修改vuex中的数据：`$store.dispatch('action中的方法名',数据)` 或 `$store.commit('mutations中的方法名',数据)`

> 备注：若没有网络请求或其他业务逻辑，组件中也可以越过actions，即不写`dispatch`，直接编写`commit`

### getters

1. 概念：当state中的数据需要经过加工后再使用时，可以使用getters加工。
2. 在`store.js`中追加`getters`配置

```javascript
// ...
const getters = {
	bigSum(state){
		return state.sum * 10
	}
}
//创建并暴露store
export default new Vuex.Store({
	// ...
	getters
})
```

3. 组件中读取数据：`$store.getters.bigSum`
4. 它不是一个必须使用的（所以官方图上也没有展示）

### mapXXX

#### mapState 简化获取state中的值

mapState方法：用于帮助我们映射`state`中的数据为计算属性 <br>需要improt：

```javascript
import { mapState } from 'vuex'
```

原有：

```vue
computed: {
    // 靠程序员自己亲自去写计算属性
    sum() {
        return this.$store.state.sum
    },
    school() {
        return this.$store.state.school
    },
    subject() {
        return this.$store.state.subject
    }
},
```

mapStates改造后：

```javascript
computed: {
    // 借助mapState生成计算属性：sum、school、subject（对象写法）
		...mapState({sum:'sum',school:'school',subject:'subject'}),
         
    // 借助mapState生成计算属性：sum、school、subject（数组写法）
    ...mapState(['sum','school','subject']),
},
```

#### mapGetters 简化获取getters中的值

mapGetters方法：用于帮助我们映射`getters`中的数据为计算属性；和上面的mapState类似，只不过mapState映射的是state中的字段，而mapGetters映射的是getters中的字段。<br>需要import：

```javascript
import { apGetters } from 'vuex'
```

示例：

```javascript
computed: {
  //借助mapGetters生成计算属性：bigSum（对象写法）
  ...mapGetters({bigSum:'bigSum'}),

  //借助mapGetters生成计算属性：bigSum（数组写法）
  ...mapGetters(['bigSum'])
},
```

#### mapMutations 简化commit的调用

mapMutations方法：用于帮助我们生成与`mutations`对话的方法，即：包含`$store.commit(xxx)`的函数

- methods中原有写法和mapMutations写法对比：

```javascript
methods: {
    //程序员亲自写方法
    /* increment(){
      this.$store.commit('JIA',this.n)
    },
    decrement(){
      this.$store.commit('JIAN',this.n)
    }, */

    //借助mapMutations生成对应的方法，方法中会调用commit去联系mutations(对象写法)
    ...mapMutations({increment:'JIA',decrement:'JIAN'}),

    //借助mapMutations生成对应的方法，方法中会调用commit去联系mutations(数组写法)
    // ...mapMutations(['JIA','JIAN']),
},
```

- store/index.js

```javascript
//准备mutations——用于操作数据（state）
const mutations = {
    JIA(state, value) {
        console.log('mutations中的JIA被调用了, state=', state, 'value=', value)
        state.sum += value
    },
    JIAN(state, value) {
        console.log('mutations中的JIAN被调用了')
        state.sum -= value
    }
}
```

- 组件引用

```vue
<button @click="JIA">+</button> <!-- 要写成JIA(n) -->
<button @click="decrement(n)">-</button>
```

> 注意：methods调用JIA不传递参数的话，就会和index.js中的JIA参数对应不上，value取到的是一个PointerEvent 参数，而不是n值，所以需要写成JIA(n)

#### mapActions 简化dispatch的调用

mapActions方法：用于帮助我们生成与`actions`对话的方法，即：包含`$store.dispatch(xxx)`的函数

```javascript
methods: {
			//程序员亲自写方法
			/* incrementOdd(){
				this.$store.dispatch('jiaOdd',this.n)
			},
			incrementWait(){
				this.$store.dispatch('jiaWait',this.n)
			}, */

			//借助mapActions生成对应的方法，方法中会调用dispatch去联系actions(对象写法)
			...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'})

			//借助mapActions生成对应的方法，方法中会调用dispatch去联系actions(数组写法)
			// ...mapActions(['jiaOdd','jiaWait'])
},
// 引用
<button @click="incrementOdd(n)">当前求和为奇数再加</button>
<button @click="incrementWait(n)">等一等再加</button>
```

> 备注：mapActions与mapMutations使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。

### vuex模块化 namespace

#### vuex模块化使用

- 目的：让代码更好维护，让多种数据分类更加明确。
- store/index.js

```javascript
const countAbout = {
   namespaced:true,//开启命名空间
   state:{x:1},
   mutations: { ... },
   actions: { ... },
   getters: {
     bigSum(state){
        // 这里的state时当前countAbout中的state
        return state.sum * 10
     }
   }
 }
 
 const personAbout = {
   namespaced:true,//开启命名空间
   state:{ ... },
   mutations: { ... },
   actions: { ... }
 }
 
 const store = new Vuex.Store({
   modules: {
     countAbout,
     personAbout
   }
 })
```

- 开启命名空间后，组件中读取state数据： mapState方式

```javascript
//方式一：自己直接读取
this.$store.state.personAbout.list
//方式二：借助mapState读取：
...mapState('countAbout',['sum','school','subject']),
```

- 开启命名空间后，组件中读取getters数据： mapGetters方式

```javascript
//方式一：自己直接读取
this.$store.getters['personAbout/firstPersonName']
//方式二：借助mapGetters读取：
...mapGetters('countAbout',['bigSum'])
```

- 开启命名空间后，组件中调用dispatch：mapActions方式

```javascript
//方式一：自己直接dispatch
this.$store.dispatch('personAbout/addPersonWang',person)
//方式二：借助mapActions：
...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
```

- 开启命名空间后，组件中调用commit ：mapMutations方式

```javascript
//方式一：自己直接commit
this.$store.commit('personAbout/ADD_PERSON',person)
//方式二：借助mapMutations：
...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'}),
```

- 开启命名空间后，原始方式
  - state需要改成：`this.$store.state.模块名.变量`
  - getters需要改成：`this.$store.getters[模块名/变量]`
  - commit需要改成：`this.$store.commit('模块名/变量'[, value])`
  - dispatch需要改成：`this.$store.dispatch('模块名/变量'[, value])`

```javascript
computed: {
		personList() {
			return this.$store.state.personAbout.personList
		},
		sum() {
			return this.$store.state.countAbout.sum
		},
		firstPersonName() {
			return this.$store.getters['personAbout/firstPersonName']
		}
	},
	methods: {
		add() {
			const personObj = { id: nanoid(), name: this.name }
			this.$store.commit('personAbout/ADD_PERSON', personObj)
			this.name = ''
		},
		addWang() {
			const personObj = { id: nanoid(), name: this.name }
			this.$store.dispatch('personAbout/addPersonWang', personObj)
			this.name = ''
		},
		addPersonServer() {
			this.$store.dispatch('personAbout/addPersonServer')
		}
	}
```

#### 案例1：不拆分到单独的文件

- 原有的store/index.js

```javascript
//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

//准备actions——用于响应组件中的动作
const actions = {
	/* jia(context,value){
		console.log('actions中的jia被调用了')
		context.commit('JIA',value)
	},
	jian(context,value){
		console.log('actions中的jian被调用了')
		context.commit('JIAN',value)
	}, */
	jiaOdd(context, value) {
		console.log('actions中的jiaOdd被调用了')
		if (context.state.sum % 2) {
			context.commit('JIA', value)
		}
	},
	jiaWait(context, value) {
		console.log('actions中的jiaWait被调用了')
		setTimeout(() => {
			context.commit('JIA', value)
		}, 500)
	}
}
//准备mutations——用于操作数据（state）
const mutations = {
	JIA(state, value) {
		console.log('mutations中的JIA被调用了')
		state.sum += value
	},
	JIAN(state, value) {
		console.log('mutations中的JIAN被调用了')
		state.sum -= value
	},
	ADD_PERSON(state, value) {
		console.log('mutations中的ADD_PERSON被调用了')
		state.personList.unshift(value)
	}
}
//准备state——用于存储数据
const state = {
	sum: 0, //当前的和
	school: '尚硅谷',
	subject: '前端',
	personList: [
		{ id: '001', name: '张三' }
	]
}
//准备getters——用于将state中的数据进行加工
const getters = {
	bigSum(state) {
		return state.sum * 10
	}
}

//创建并暴露store
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
```

- 单个store/index.js 模块化

```javascript
const countAbout = {
   namespaced:true,//开启命名空间
   state:{x:1},
   mutations: { ... },
   actions: { ... },
   getters: {
     bigSum(state){
        // 这里的state时当前countAbout中的state
        return state.sum * 10
     }
   }
 }
 
 const personAbout = {
   namespaced:true,//开启命名空间
   state:{ ... },
   mutations: { ... },
   actions: { ... }
 }
 
 const store = new Vuex.Store({
   modules: {
     countAbout,
     personAbout
   }
 })
```

#### 案例2：拆分到多个文件

- store/person.js

```javascript
//人员管理相关的配置
import axios from 'axios'
import { nanoid } from 'nanoid'
export default {
    namespaced: true,
    actions: {
        addPersonWang(context, value) {
            if (value.name.indexOf('王') === 0) {
                context.commit('ADD_PERSON', value)
            } else {
                alert('添加的人必须姓王！')
            }
        },
        addPersonServer(context) {
            axios.get('https://api.uixsj.cn/hitokoto/get?type=social').then(
                response => {
                    context.commit('ADD_PERSON', { id: nanoid(), name: response.data })
                },
                error => {
                    alert(error.message)
                }
            )
        }
    },
    mutations: {
        ADD_PERSON(state, value) {
            console.log('mutations中的ADD_PERSON被调用了')
            state.personList.unshift(value)
        }
    },
    state: {
        personList: [
            { id: '001', name: '张三' }
        ]
    },
    getters: {
        firstPersonName(state) {
            return state.personList[0].name
        }
    },
}
```

- store/count.js

```javascript
// 求和相关的配置
export default {
    namespaced: true,
    actions: {
        jiaOdd(context, value) {
            console.log('actions中的jiaOdd被调用了')
            if (context.state.sum % 2) {
                context.commit('JIA', value)
            }
        },
        jiaWait(context, value) {
            console.log('actions中的jiaWait被调用了')
            setTimeout(() => {
                context.commit('JIA', value)
            }, 500)
        }
    },
    mutations: {
        JIA(state, value) {
            console.log('mutations中的JIA被调用了')
            state.sum += value
        },
        JIAN(state, value) {
            console.log('mutations中的JIAN被调用了')
            state.sum -= value
        },
    },
    state: {
        sum: 0, // 当前的和
        school: '大圣课堂',
        subject: '前端',
    },
    getters: {
        bigSum(state) {
            return state.sum * 10
        }
    },
}
```

- store/index.js

```javascript
//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
import countOptions from './count'
import personOptions from './person'
//应用Vuex插件
Vue.use(Vuex)

//创建并暴露store
export default new Vuex.Store({
	modules: {
		countAbout: countOptions,
		personAbout: personOptions
	}
})
```

- 借助mapXXX

```vue
computed: {
		//借助mapState生成计算属性，从state中读取数据。（数组写法）
		...mapState('countAbout', ['sum', 'school', 'subject']),
		...mapState('personAbout', ['personList']),
		//借助mapGetters生成计算属性，从getters中读取数据。（数组写法）
		...mapGetters('countAbout', ['bigSum'])
	},
	methods: {
		//借助mapMutations生成对应的方法，方法中会调用commit去联系mutations(对象写法)
		...mapMutations('countAbout', { increment: 'JIA', decrement: 'JIAN' }),
		//借助mapActions生成对应的方法，方法中会调用dispatch去联系actions(对象写法)
		...mapActions('countAbout', { incrementOdd: 'jiaOdd', incrementWait: 'jiaWait' })
	},
```

- 原始方式

```vue
computed: {
		personList() {
			return this.$store.state.personAbout.personList
		},
		sum() {
			return this.$store.state.countAbout.sum
		},
		firstPersonName() {
			return this.$store.getters['personAbout/firstPersonName']
		}
	},
	methods: {
		add() {
			const personObj = { id: nanoid(), name: this.name }
			this.$store.commit('personAbout/ADD_PERSON', personObj)
			this.name = ''
		},
		addWang() {
			const personObj = { id: nanoid(), name: this.name }
			this.$store.dispatch('personAbout/addPersonWang', personObj)
			this.name = ''
		},
		addPersonServer() {
			this.$store.dispatch('personAbout/addPersonServer')
		}
	},
```

### 案例

#### 原始版vuex版本求和

- store/index.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
console.log('user插件Vuex=', Vuex)
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作
const actions = {
    jia(context, value) {
        console.log('actions中的jia被调用了', context, value)
        context.commit('JIA', value)
    },
    jian(context, value) {
        console.log('actions中的jian被调用了', context, value)
        context.commit('JIAN', value)
    },
    jiaOdd(context, value) {
        console.log('actions中的jiaOdd被调用了', context, value)
        if (context.state.sum % 2) {
            context.commit('JIA', value)
        }
    },
    jiaWait(context, value) {
        console.log('actions中的jiaWait被调用了', context, value)
        setTimeout(() => {
            context.commit('JIA', value)
        }, 500)
    }
}

// 准备mutations——用于操作数据（state）
const mutations = {
    JIA(state, value) {
        console.log('mutations中的JIA被调用了', state, value)
        state.sum += value
    },
    JIAN(state, value) {
        console.log('mutations中的JIAN被调用了', state, value)
        state.sum -= value
    },
    JIAODD(state, value) {
        console.log('mutations中的JIAODD被调用了', state, value)
        state.sum += value
    },
    JIAWAIT(state, value) {
        console.log('mutations中的JIAWAIT被调用了', state, value)
        state.sum += value
    }
}

// 准备state——用于存储数据
const state = {
    sum: 0, //当前的和
}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state,
    // getters
})
```

- Count.vue

```vue
<template>
    <div>
        <h1>当前求和为：{{ $store.state.sum }}</h1>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
export default {
    name: 'Count',
    data() {
        return {
            n: 1, //用户选择的数字
        }
    },
    methods: {
        increment() {
            // this.$store.dispatch('jia', this.n)
            this.$store.commit('JIA', this.n) // 可直接调用commit
        },
        decrement() {
            // this.$store.dispatch('jian', this.n)
            this.$store.commit('JIAN', this.n) // 可直接调用commit
        },
        incrementOdd() {
            this.$store.dispatch('jiaOdd', this.n)
        },
        incrementWait() {
            this.$store.dispatch('jiaWait', this.n)
        },
    },
}
</script>

<style lang="css">
button {
    margin-left: 5px;
}
</style>
```

#### getters版本求和

- store/index.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
console.log('user插件Vuex=', Vuex)
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作
const actions = {
    jia(context, value) {
        console.log('actions中的jia被调用了', context, value)
        context.commit('JIA', value)
    },
    jian(context, value) {
        console.log('actions中的jian被调用了', context, value)
        context.commit('JIAN', value)
    },
    jiaOdd(context, value) {
        console.log('actions中的jiaOdd被调用了', context, value)
        if (context.state.sum % 2) {
            context.commit('JIA', value)
        }
    },
    jiaWait(context, value) {
        console.log('actions中的jiaWait被调用了', context, value)
        setTimeout(() => {
            context.commit('JIA', value)
        }, 500)
    }
}

// 准备mutations——用于操作数据（state）
const mutations = {
    JIA(state, value) {
        console.log('mutations中的JIA被调用了', state, value)
        state.sum += value
    },
    JIAN(state, value) {
        console.log('mutations中的JIAN被调用了', state, value)
        state.sum -= value
    },
    JIAODD(state, value) {
        console.log('mutations中的JIAODD被调用了', state, value)
        state.sum += value
    },
    JIAWAIT(state, value) {
        console.log('mutations中的JIAWAIT被调用了', state, value)
        state.sum += value
    }
}

// 准备state——用于存储数据
const state = {
    sum: 0, //当前的和
}

const getters = {
    bigSum(state) {
        return state.sum * 10
    }
}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})
```

- Count.vue

```vue
<template>
    <div>
        <h1>当前求和为：{{ $store.state.sum }}</h1>
        <h1>当前求和*10为: {{ $store.getters.bigSum }}</h1>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
export default {
    name: 'Count',
    data() {
        return {
            n: 1, //用户选择的数字
        }
    },
    methods: {
        increment() {
            // this.$store.dispatch('jia', this.n)
            this.$store.commit('JIA', this.n) // 可直接调用commit
        },
        decrement() {
            // this.$store.dispatch('jian', this.n)
            this.$store.commit('JIAN', this.n) // 可直接调用commit
        },
        incrementOdd() {
            this.$store.dispatch('jiaOdd', this.n)
        },
        incrementWait() {
            this.$store.dispatch('jiaWait', this.n)
        },
    },
}
</script>

<style lang="css">
button {
    margin-left: 5px;
}
</style>
```

#### 通过computed简化模板表达式

```vue
<template>
    <div>
        <h1>当前求和为：{{ sum }}</h1>
        <h2>当前求和*10为: {{ $store.getters.bigSum }}</h2>
        <h3>我在{{ school }}，学习{{ subject }}</h3>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
export default {
    name: 'Count',
    data() {
        return {
            n: 1, //用户选择的数字
        }
    },
    computed: {
        sum() {
            return this.$store.state.sum
        },
        school() {
            return this.$store.state.school
        },
        subject() {
            return this.$store.state.subject
        }
    },
    methods: {
        increment() {
            // this.$store.dispatch('jia', this.n)
            this.$store.commit('JIA', this.n) // 可直接调用commit
        },
        decrement() {
            // this.$store.dispatch('jian', this.n)
            this.$store.commit('JIAN', this.n) // 可直接调用commit
        },
        incrementOdd() {
            this.$store.dispatch('jiaOdd', this.n)
        },
        incrementWait() {
            this.$store.dispatch('jiaWait', this.n)
        },
    },
}
</script>

<style lang="css">
button {
    margin-left: 5px;
}
</style>
```

通过Chrome Vue工具查看：<br>![image.png](https://cdn.nlark.com/yuque/0/2024/png/694278/1706631212808-0e5ad0e6-1025-491c-948e-8315ffbb3814.png#averageHue=%233aa675&clientId=u373d155d-b293-4&from=paste&height=517&id=u7fdf8467&originHeight=776&originWidth=2118&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=35957&status=done&style=none&taskId=u1e0ff3b6-2134-485c-89e9-6707bca1281&title=&width=1412)

#### mapState和mapGetters方式简化

```vue
<template>
    <div>
        <h1>当前求和为：{{ sum }}</h1>
        <h2>当前求和*10为: {{ $store.getters.bigSum }}</h2>
        <h3>我在{{ school }}，学习{{ subject }} --mapState</h3>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
    name: 'Count',
    data() {
        return {
            n: 1, // 用户选择的数字
        }
    },
    computed: {
        // 靠程序员自己亲自去写计算属性
        // sum() {
        //     return this.$store.state.sum
        // },
        // school() {
        //     return this.$store.state.school
        // },
        // subject() {
        //     return this.$store.state.subject
        // }
        // 写法一：借助mapState生成计算属性，从state中读取数据。（对象写法）
        // ...mapState({ 'sum1': 'sum', 'school': 'school', 'subject': 'subject' }),
        // 写法二：借助mapState生成计算属性，从state中读取数据。（数组写法）
        ...mapState(['sum', 'school', 'subject']),

        // 写法三：借助mapGetters生成计算属性，从getters中读取数据。（对象写法）
        ...mapGetters(['bigSum'])

    },
    methods: {
        increment() {
            // this.$store.dispatch('jia', this.n)
            this.$store.commit('JIA', this.n) // 可直接调用commit
        },
        decrement() {
            // this.$store.dispatch('jian', this.n)
            this.$store.commit('JIAN', this.n) // 可直接调用commit
        },
        incrementOdd() {
            this.$store.dispatch('jiaOdd', this.n)
        },
        incrementWait() {
            this.$store.dispatch('jiaWait', this.n)
        },
    },
}
</script>

<style lang="css">
button {
    margin-left: 5px;
}
</style>
```

#### mapActions和mapMutations方式

```vue
<template>
    <div>
        <h1>当前求和为：{{ sum }}</h1>
        <h2>当前求和*10为: {{ $store.getters.bigSum }}</h2>
        <h3>我在{{ school }}，学习{{ subject }} --mapState</h3>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
    name: 'Count',
    data() {
        return {
            n: 1, //用户选择的数字
        }
    },
    computed: {
        // 靠程序员自己亲自去写计算属性
        // sum() {
        //     return this.$store.state.sum
        // },
        // school() {
        //     return this.$store.state.school
        // },
        // subject() {
        //     return this.$store.state.subject
        // }
        // 写法一：借助mapState生成计算属性，从state中读取数据。（对象写法）
        // ...mapState({ 'sum1': 'sum', 'school': 'school', 'subject': 'subject' }),
        // 写法二：借助mapState生成计算属性，从state中读取数据。（数组写法）
        ...mapState(['sum', 'school', 'subject']),

        // 写法三：借助mapGetters生成计算属性，从getters中读取数据。（对象写法）
        ...mapGetters(['bigSum'])

    },
    methods: {
        increment() {
            // this.$store.dispatch('jia', this.n)
            this.$store.commit('JIA', this.n) // 可直接调用commit
        },
        decrement() {
            // this.$store.dispatch('jian', this.n)
            this.$store.commit('JIAN', this.n) // 可直接调用commit
        },
        incrementOdd() {
            this.$store.dispatch('jiaOdd', this.n)
        },
        incrementWait() {
            this.$store.dispatch('jiaWait', this.n)
        },
    },
}
</script>

<style lang="css">
button {
    margin-left: 5px;
}
</style>
```

## 遇到的问题

### store挂载不上

看vuex版本是否安装对象了

**vue和vuex版本对应关系：**<br>vue2.x→vuex3.x<br>vue3.x→vuex4.x
