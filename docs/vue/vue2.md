## Vue的基本原理
当一个Vue实例创建时，vue会遍历data选项的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们转为 getter/setter 并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。


### 双向数据绑定的原理
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：
1. 需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

### 使用 Object.defineProperty() 来进行数据劫持有什么缺点？

 有一些对属性的操作，使用这种方法无法拦截，比如说通过下标方式修改数组数据或者给对象新增属性，vue 内部通过重写函数解决了这个问题。在 Vue3.0 中已经不使用这种方式了，而是通过使用 Proxy 对对象进行代理，从而实现数据劫持。使用Proxy 的好处是它可以完美的监听到任何方式的数据改变，唯一的缺点是兼容性的问题，因为这是 ES6 的语法。

### MVVM和MVC的区别
MVC、MVP 和 MVVM 是三种常见的软件架构设计模式，主要通过分离关注点的方式来组织代码结构，优化我们的开发效率。
在开发单页面应用时，往往一个路由页面对应了一个脚本文件，所有的页面逻辑都在一个脚本文件里。页面的渲染、数据的获取，对用户事件的响应所有的应用逻辑都混合在一起，这样在开发简单项目时，可能看不出什么问题，当时一旦项目变得复杂，那么整个文件就会变得冗长，混乱，这样对我们的项目开发和后期的项目维护是非常不利的。
#### MVC
MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。

#### MVVM
MVVM 分为 Model、View、ViewModel 三者。
- Model代表数据模型，数据和业务逻辑都在Model层中定义；
- View代表UI视图，负责数据的展示；
- ViewModel负责监听Model中数据的改变并且控制视图的更新，处理用 户交互操作；
Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中 的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的 数据也会在Model中同步。
这种模式实现了 Model和View的数据自动同步，因此开发者只需要专注 对数据的维护操作即可，而不需要自己操作DOM。
#### MVP
 MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在 MVC 模式中我们使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的Controller 只知道 Model 的接口，因此它没有办法控制 View 层的更新，MVP 模式中，View 层的接口暴露给了 Presenter 因此我们可以在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。

 

###  Computed和Watch的区别
#### Computed
- 它支持缓存，只有依赖的数据发生了变化，才会重新计算
- 不支持异步，当Computed中有异步操作时，无法监听数据的变化
- computed的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data声明过，或者父组件传递过来的props中的数据进行计算的。
- 如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用computed
- 如果computed属性的属性值是函数，那么默认使用get方法，函数的返回值就是属性的属性值；在computed中，属性有一个get方法和一个set方法，当数据发生变化时，会调用set方法。
#### Watch
- 它不支持缓存，数据变化时，它就会触发相应的操作
- 支持异步监听
- 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
- 当一个属性发生变化时，就需要执行相应的操作
- 监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会出大其他操作，函数有两个的参数：

- immediate：组件加载立即触发回调函数
- deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。
当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用watch。
#### 总结
- computed 计算属性 : 依赖其它属性值,并且 computed 的值有缓存,只有它依赖的 属性值发生改变,下一次获取 computed 的值时才会重新计算 computed 的值。
- watch 侦听器 : 更多的是观察的作用,无缓存性,类似于某些数据的监听回调,每 当监听的数据变化时都会执行回调进行后续操作。

#### 运用场景
- 当我们需要进行数值计算,并且依赖于其它数据时,应该使用 computed,因为可以利 用 computed 的缓存特性,避免每次获取值时,都要重新计算。
- 当我们需要在数据变化时执行异步或开销较大的操作时,应该使用 watch,使用 watch 选项允许我们执行异步操作 ( 访问一个 API ),限制我们执行该操作的频率, 并在我们得到最终结果前,设置中间状态。这些都是计算属性无法做到的。

### Computed 和 Methods 的区别
我们可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的
不同点：

- computed: 计算属性是基于它们的依赖进行缓存的,只有在它的相关依赖发生改变时才会重新求值对于 method ，只要发生重新渲染，
- method 调用总会执行该函数
### slot是什么？有什么作用？原理是什么？
slot又名插槽，是Vue的内容分发机制，组件内部的模板引擎使用slot元素作为承载分发内容的出口。插槽slot是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。slot又分三类，默认插槽，具名插槽和作用域插槽。

- 默认插槽：又名匿名查抄，当slot没有指定name属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有name属性的slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。

实现原理：当子组件vm实例化时，获取到父组件传入的slot标签的内容，存放在vm.$slot中，默认插槽为vm.$slot.default，具名插槽为vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用$slot中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

### 过滤器的作用，如何实现一个过滤器
根据过滤器的名称，过滤器是用来过滤数据的，在Vue中使用filters来过滤数据，filters不会修改数据，而是过滤数据，改变用户看到的输出（计算属性 computed ，方法 methods 都是通过修改数据来处理数据格式的输出显示）。
#### 使用场景
- 需要格式化数据的情况，比如需要处理时间、价格等数据格式的输出 / 显示。
- 比如后端返回一个 年月日的日期字符串，前端需要展示为 多少天前 的数据格式，此时就可以用我们的fliters过滤器来处理数据。
过滤器是一个函数，它会把表达式中的值始终当作函数的第一个参数。过滤器用在插值表达式 {{ }} 和 v-bind 表达式 中，然后放在操作符“ | ”后面进行指示。

例如，在显示金额，给商品价格添加单位：
```js
<li>商品价格：{{item.price | filterPrice}}</li>
 filters: {
    filterPrice (price) {
      return price ? ('￥' + price) : '--'
    }
  }
```
### 如何保存页面的当前的状态
既然是要保持页面的状态（其实也就是组件的状态），那么会出现以下两种情况：
- 前组件会被卸载
- 前组件不会被卸载
那么可以按照这两种情况分别得到以下方法：
#### 组件会被卸载
 ##### （1）将状态存储在LocalStorage / SessionStorage
只需要在组件即将被销毁的生命周期 componentWillUnmount （react）中在 LocalStorage / SessionStorage 中把当前组件的 state 通过 JSON.stringify() 储存下来就可以了。在这里面需要注意的是组件更新状态的时机。
比如我们从 B 组件跳转到 A 组件的时候，A 组件需要更新自身的状态。但是如果我们从别的组件跳转到 B 组件的时候，实际上我们是希望 B 组件重新渲染的，也就是不要从 Storage 中读取信息。所以我们需要在 Storage 中的状态加入一个 flag 属性，用来控制 A 组件是否读取 Storage 中的状态。
###### 优点
- 兼容性好，不需要额外库或工具。
- 简单快捷，基本可以满足大部分需求。
###### 缺点
- 状态通过 JSON 方法储存（相当于深拷贝），如果状态中有特殊情况（比如 Date 对象、Regexp 对象等）的时候会得到字符串而不是原来的值。（具体参考用 JSON 深拷贝的缺点）
- 如果 B 组件后退或者下一页跳转并不是前组件，那么 flag 判断会失效，导致从其他页面进入 A 组件页面时 A 组件会重新读取 Storage，会造成很奇怪的现象
##### （2）路由传值
 通过 react-router 的 Link 组件的 prop —— to 可以实现路由间传递参数的效果。
在这里需要用到 state 参数，在 B 组件中通过 history.location.state 就可以拿到 state 值，保存它。返回 A 组件时再次携带 state 达到路由状态保持的效果。
###### 优点
- 简单快捷，不会污染 LocalStorage / SessionStorage。
- 可以传递 Date、RegExp 等特殊对象（不用担心 JSON.stringify / parse 的不足）
###### 缺点
- 如果 A 组件可以跳转至多个组件，那么在每一个跳转组件内都要写相同的逻辑。

#### 组件不会被卸载
##### （1）单页面渲染
 要切换的组件作为子组件全屏渲染，父组件中正常储存页面状态。
###### 优点
- 代码量少
- 不需要考虑状态传递过程中的错误
###### 缺点
- 增加 A 组件维护成本
- 需要传入额外的 prop 到 B 组件
- 无法利用路由定位页面
除此之外，在Vue中，我们还可以是用keep-alive来缓存页面，当组件在keep-alive内被切换时组件的activated、deactivated这两个生命周期钩子函数会被执行 被包裹在keep-alive中的组件的状态将会被保留：
 ```js
 <keep-alive>
	<router-view v-if="$route.meta.keepAlive"></router-view>
</kepp-alive>
```
###### router.js
```js
{
  path: '/',
  name: 'xxx',
  component: ()=>import('../src/views/xxx.vue'),
  meta:{
    keepAlive: true // 需要被缓存
  }
},

```
### 常见的事件修饰符及其作用
- .stop：等同于 JavaScript 中的 event.stopPropagation() ，防止事件冒泡；
- .prevent ：等同于 JavaScript 中的 event.preventDefault() ，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）；
- .capture ：与事件冒泡的方向相反，事件捕获由外到内；
- .self ：只会触发自己范围内的事件，不包含子元素；
- .once ：只会触发一次。
 
### v-if、v-show、v-html 的原理
- v-if会调用addIfCondition方法，生成vnode的时候会忽略对应节点，render的时候就不会渲染；
- v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改show属性值，也就是常说的display；
- v-html会先移除节点下的所有节点，调用html方法，通过addProp添加innerHTML属性，归根结底还是设置innerHTML为v-html的值。

### v-if和v-show的区别
#### 手段：
v-if是动态的向DOM树内添加或者删除DOM元素；v-show是通过设置DOM元素的display样式属性控制显隐；

#### 编译过程：
v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换；

#### 编译条件：
v-if是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; v-show是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且DOM元素保留；

#### 性能消耗：
v-if有更高的切换消耗；v-show有更高的初始渲染消耗；

#### 使用场景：
v-if适合运营条件不大可能改变；v-show适合频繁切换。

### v-model 是如何实现的，语法糖实际是什么？
#### （1）作用在表单元素上 
动态绑定了 input 的 value 指向了 messgae 变量，并且在触发 input 事件的时候去动态把 message设置为目标值：
```js
<input v-model="sth" />
//  等同于
<input 
    v-bind:value="message" 
    v-on:input="message=$event.target.value"
>
//$event 指代当前触发的事件对象;
//$event.target 指代当前触发的事件对象的dom;
//$event.target.value 就是当前dom的value值;
//在@input方法中，value => sth;
//在:value中,sth => value;
```
#### （2）作用在组件上 
在自定义组件中，v-model 默认会利用名为 value 的 prop和名为 input 的事件

本质是一个父子组件通信的语法糖，通过prop和$.emit实现。 因此父组件 v-model 语法糖本质上可以修改为：
```js
<child :value="message"  @input="function(e){message = e}"></child>
```
在组件的实现中，可以通过 v-model属性来配置子组件接收的prop名称，以及派发的事件名称。 例子：
```js
// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input v-bind:value="aa" v-on:input="aa=$event.target.value"></aa-input>
// 子组件：
<input v-bind:value="aa" v-on:input="onmessage"></aa-input>
props:{value:aa,}
methods:{
    onmessage(e){
        $emit('input',e.target.value)
    }
}
```
默认情况下，一个组件上的v-model 会把 value 用作 prop且把 input 用作 event。但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。js 监听input 输入框输入数据改变，用oninput，数据改变以后就会立刻出发这个事件。通过input事件把数据emit出去，在父组件接受。父组件设置v−model的值为inputemit 出去，在父组件接受。父组件设置v-model的值为input emit出去，在父组件接受。父组件设置v−model的值为inputemit过来的值。

### v-model 用在自定义组件
 ```js
 <input v-model="searchText">
```
实际上相当于
```js
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```
用在自定义组件上也是同理：
```js
<custom-input v-model="searchText">
```
相当于
```js
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```
显然，custom-input 与父组件的交互如下：

- 父组件将searchText变量传入custom-input 组件，使用的 prop 名为value；
- custom-input 组件向父组件传出名为input的事件，父组件将接收到的值赋值给searchText；
所以，custom-input 组件的实现应该类似于这样
```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```
### data为什么是一个函数而不是对象
JavaScript中的对象是引用类型的数据，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。

而在Vue中，我们更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会相互干扰。

所以组件的数据不能写成对象的形式，而是要写成函数的形式。数据以函数返回值的形式定义，这样当我们每次复用组件的时候，就会返回一个新的data，也就是说每个组件都有自己的私有数据空间，它们各自维护自己的数据，不会干扰其他组件的正常运行。

### keep-alive
如果需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。
#### （1）keep-alive keep-alive有以下三个属性：
- include 字符串或正则表达式，只有名称匹配的组件会被匹配
- exclude 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- max 数字。最多可以缓存多少组件实例
注意：keep-alive 包裹动态组件时，会缓存不活动的组件实例


## vue细节
### 组件的通信方式
#### 1.props / $emit
父组件通过`props`的方式向子组件传递数据，而通过`$emit`子组件可以向父组件通信
- `props` 只可以从上一级组件传递到下一级组件（父子组件），即所谓的单向数据流。而且 `props` 只读，不可被修改，所有修改都会失效并警告
- `$emit`绑定一个自定义事件，当这个语句被执行时, 就会将参数arg传递给父组件,父组件通过v-on监听并接收参数。

```js
//父组件
<Children :msg.sync="msg" ></Children> // 在父组件注册的子组件挂载修饰符.sync
// 子组件
this.$emit("update:msg", "789"); //子组件上直接调用这个方法,传值改值.
```
.sync修饰符相当于vue在内部定义方法可以修改值,相当于父组件上使用@把函数传下来这种. 在子组件打印实例，会发现在listen上出现update:msg方法。


#### 2.$children / $parent
通过 $parent 和 $children 就可以访问组件的实例。 $children 的值是数组，而$parent是个对象
#### 3.provide/ inject
provide/ inject 是vue2.2.0新增的api, 简单来说就是父组件中通过provide来提供变量, 然后再子组件中通过inject来注入变量。

不论子组件嵌套有多深, 只要调用了inject 那么就可以注入provide中的数据，而不局限于只能从当前父组件的props属性中回去数据

#### 4.ref / refs
ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据， 我们看一个ref 来访问组件的例子:
#### 5.eventBus
eventBus 又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。eventBus也有不方便之处, 当项目较大,就容易造成难以维护的灾难。
##### 1.初始化
```js
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()
```
##### 2.发送事件
```js
import {EventBus} from './event-bus.js'
EventBus.$emit('addition', {
        num:this.num++
      })
```
##### 3.接收事件
```js
EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
```
##### 4. 移除事件监听者
```js
import { eventBus } from 'event-bus.js'
EventBus.$off('addition', {})
```
#### 6.Vuex 
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化.
Vuex 解决了多个视图依赖于同一状态和来自不同视图的行为需要变更同一状态的问题，将开发者的精力聚焦于数据的更新而不是数据在组件之间的传递上
- state：用于数据的存储，是store中的唯一数据源
- getters：如vue中的计算属性一样，基于state数据的二次包装，常用于数据的筛选和多个数据的相关性计算
- mutations：类似函数，改变state数据的唯一途径，且不能用于处理异步事件
- actions：类似于mutation，用于提交mutation来改变状态，而不直接变更状态，可以包含任意异步操作
- modules：类似于命名空间，用于项目中将各个模块的状态分开定义和操作，便于维护

#### 7.localStorage / sessionStorage
这种通信比较简单,缺点是数据和状态比较混乱,不太容易维护。 通过window.localStorage.getItem(key)获取数据 通过window.localStorage.setItem(key,value)存储数据

注意用JSON.parse() / JSON.stringify() 做数据格式转换 localStorage / sessionStorage可以结合vuex, 实现数据的持久保存,同时使用vuex解决数据和状态混乱问题.

#### 8.$attrs与 $listeners
这两个属性是一个对象,$attrs 里存放的是父组件中绑定的非 Props 属性，$listeners里存放的是父组件中绑定的非原生事件。
- $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。
- $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件

## 性能优化技巧
[揭秘 Vue.js 九个性能优化技巧](https://juejin.cn/post/6922641008106668045)
### 函数式组件
优化前的组件代码如下：
```html
<template>
  <div class="cell">
    <div v-if="value" class="on"></div>
    <section v-else class="off"></section>
  </div>
</template>

<script>
export default {
  props: ['value'],
}
</script>
```
优化后的组件代码如下：
```html
<template functional>
  <div class="cell">
    <div v-if="props.value" class="on"></div>
    <section v-else class="off"></section>
  </div>
</template>
```
函数式组件和普通的对象类型的组件不同，它不会被看作成一个真正的组件，我们知道在 patch 过程中，如果遇到一个节点是组件 vnode，会递归执行子组件的初始化过程；而函数式组件的 render 生成的是普通的 vnode，不会有递归子组件的过程，因此渲染开销会低很多。

因此，函数式组件也不会有状态，不会有响应式数据，生命周期钩子函数这些东西。你可以把它当成把普通组件模板中的一部分 DOM 剥离出来，通过函数的方式渲染出来，是一种在 DOM 层面的复用。

### 子组件拆分
优化前：
```html
<template>
  <div :style="{ opacity: number / 300 }">
    <div>{{ heavy() }}</div>
  </div>
</template>

<script>
export default {
  props: ['number'],
  methods: {
    heavy () {
      const n = 100000
      let result = 0
      for (let i = 0; i < n; i++) {
        result += Math.sqrt(Math.cos(Math.sin(42)))
      }
      return result
    }
  }
}
</script>
```
优化后
```html
<template>
  <div :style="{ opacity: number / 300 }">
    <ChildComp />
  </div>
</template>

<script>
export default {
  components: {
    ChildComp: {
      methods: {
        heavy () {
          const n = 100000
          let result = 0
          for (let i = 0; i < n; i++) {
            result += Math.sqrt(Math.cos(Math.sin(42)))
          }
          return result
        },
      },
      render (h) {
        return h('div', this.heavy())
      }
    }
  },
  props: ['number']
}
</script>
```
优化后的方式是把这个耗时任务 heavy 函数的执行逻辑用子组件 ChildComp 封装了，由于 Vue 的更新是组件粒度的，虽然每一帧都通过数据修改导致了父组件的重新渲染，但是 ChildComp 却不会重新渲染，因为它的内部也没有任何响应式数据的变化。所以优化后的组件不会在每次渲染都执行耗时任务，自然执行的 JavaScript 时间就变少了。

### 避免滥用this去读取data中数据
用this读取data中数据时，会触发getter函数，在其中通过 var value = getter ? getter.call(obj) : val; 获取到值后执行 return value，实现读取数据的目的。
```js
computed: {
  d({ a, b, c, e, f }) {
  
    return a+ b+ c+ e+f;
  }
}
```




































