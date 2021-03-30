

## call, apply, bind 区别
#### 相同点：
- 三者都是用来改变函数的上下文，也就是this指向的。
#### 不同点：
- fn.bind： 不会立即调用，而是返回一个绑定后的新函数。
- fn.call：立即调用，返回函数执行结果，this指向第一个参数，后面可有多个参数，并且这些都是fn函数的参数。
- fn.apply：立即调用，返回函数的执行结果，this指向第一个参数，第二个参数是个数组，这个数组里内容是fn函数的参数。
#### 应用场景
- 需要立即调用使用call/apply
- 要传递的参数不多，则可以使用fn.call(thisObj, arg1, arg2 ...)
- 要传递的参数很多，则可以用数组将参数整理好调用fn.apply(thisObj, [arg1, arg2 ...])
- 不需要立即执行，而是想生成一个新的函数长期绑定某个函数给某个对象使用，使用const newFn = fn.bind(thisObj); newFn(arg1, arg2...)
#### 封装函数 f，使 f 的 this 指向指定的对象
```js
function bindThis(f, oTarget) {
    if(f.bind){
        return f.bind(oTarget);
    } else {
        return function(){
            return f.apply(oTarget,arguments);
        };
    }
}
```


### call的实现
```js
Function.prototype.myCall = function (context) {
  var context = context || window
  // 给 context 添加一个属性
  // getValue.call(a, 'yck', '24') => a.fn = getValue
  context.fn = this
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1)
  // getValue.call(a, 'yck', '24') => a.fn('yck', '24')
  var result = context.fn(...args)
  // 删除 fn
  delete context.fn
  return result
}
```
```js
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}
bar.myCall(foo, 'kevin', 18);
// kevin
// 18
// 1
```
### apply的实现
```js
Function.prototype.myApply = function (context) {
  var context = context || window
  context.fn = this

  var result
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}
```
### bind的实现
```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```

## 深拷贝
 ![](~@/deepClone.jpg)
```js
function deepClone(obj,map = new Map()){
  if(obj instanceof Object){
    if(obj instanceof Function) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    // 解决循环引用
    if(map.has(obj)) return map.get(obj);
    // 拷贝原型链
    let allDesc = Object.getOwnPropertyDescriptors(target);
    let cloneObj = Object.create(Object.getPrototypeOf(target), allDesc);
    map.set(obj,cloneObj);
    // Reflect.ownKeys可以拿到不可枚举属性和symbol类型的键名
    for(let key of Reflect.ownKeys(obj)){
      cloneObj[key] = deepClone(obj[key],map);
    }
    return cloneObj
  }else{
    return obj;
  }
}
```
深拷贝通常可以通过 JSON.parse(JSON.stringify(object))来解决。
但是该方法也是有局限性的：
- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
- 不能解决循环引用的对象


## 模块化
在有 Babel 的情况下，我们可以直接使用 ES6 的模块化
```js
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function() {}

import {a, b} from './a.js'
import XXX from './b.js'
```
#### CommonJS
CommonJs 是 Node 独有的规范，浏览器中使用就需要用到 Browserify 解析了。
```js
// a.js
module.exports = {
    a: 1
}
// or
exports.a = 1
// b.js
var module = require('./a.js')
module.a // -> log 1
```
在上述代码中，module.exports 和 exports 很容易混淆， 大致内部实现
```js
var module = require('./a.js')
module.a
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
// 基本实现
var module = {
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
```
module.exports 和 exports，用法其实是相似的，但是不能对 exports 直接赋值，不会有任何效果。

 对于 CommonJS 和 ES6 中的模块化的两者区别是：
- 前者支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
- 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- 后者会编译成 require/exports 来执行的

#### AMD
 AMD 是由 RequireJS 提出的
```js
// AMD
define(['./a', './b'], function(a, b) {
    a.do()
    b.do()
})
define(function(require, exports, module) {
    var a = require('./a')
    a.doSomething()
    var b = require('./b')
    b.doSomething()
})
```
## 防抖
```js
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}
```
整体函数实现的不难，总结一下。
- 对于按钮防点击来说的实现：如果函数是立即执行的，就立即调用，如果函数是延迟执行的，就缓存上下文和参数，放到延迟函数中去执行。一旦我开始一个定时器，只要我定时器还在，你每次点击我都重新计时。一旦你点累了，定时器时间到，定时器重置为 null，就可以再次点击了。
- 对于延时执行函数来说的实现：清除定时器ID，如果是延迟调用就调用函数

## 节流
防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行
```js
function throttle(fn, interval) {
    let flag = true
    return function(...args) {
    	if (!flag) return;
    	flag = false
    	setTimeout(() => {
      	    fn.apply(this, args)
      	    flag = true
    	}, interval)
    }
}

// 或者可以这样，挑你喜欢的。
function throttle(fn, interval) {
    let last = 0 // 首次直接执行
    return function (...args) {
    	let now = +new Date()
    	if(now - last < interval) return;
    	last = now // 时间一到就更新 last
    	fn.apply(this, args)
    }
}
```



## 继承
在 ES5 中，我们可以使用如下方式解决继承的问题
```js
function Super() {}
Super.prototype.getNumber = function() {
  return 1
}

function Sub() {}
let s = new Sub()
Sub.prototype = Object.create(Super.prototype, {
  constructor: {
    value: Sub,
    enumerable: false,
    writable: true,
    configurable: true
  }
})
```
以上继承实现思路就是将子类的原型设置为父类的原型

在 ES6 中， 可以通过 class 语法轻松解决这个问题
```js
function MyData() {

}
MyData.prototype.test = function () {
  return this.getTime()
}
let d = new Date()
Object.setPrototypeOf(d, MyData.prototype)
Object.setPrototypeOf(MyData.prototype, Date.prototype)
```
以上继承实现思路：先创建父类实例 => 改变实例原先的 _proto__ 转而连接到子类的 prototype => 子类的 prototype 的 __proto__ 改为父类的 prototype。



## new
1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

```js
function create() {
    // 创建一个空的对象
    let obj = new Object()
    // 获得构造函数
    let Con = [].shift.call(arguments)
    // 链接到原型
    obj.__proto__ = Con.prototype
    // 绑定 this，执行构造函数
    let result = Con.apply(obj, arguments)
    // 确保 new 出来的是个对象
    return typeof result === 'object' ? result : obj
}
```
## 执行上下文
当执行 JS 代码时，会产生三种执行上下文
- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

每个执行上下文中都有三个重要的属性
- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- this

```js
var a = 10
function foo(i) {
  var b = 20
}
foo()
```
对于上述代码，执行栈中有两个上下文：全局上下文和函数 foo 上下文。
```js
stack = [
    globalContext,
    fooContext
]
```
对于全局上下文来说，VO 大概是这样的

```js
globalContext.VO === globe
globalContext.VO = {
    a: undefined,
	foo: <Function>,
}
```
对于函数 foo 来说，VO 不能访问，只能访问到活动对象（AO）
```js
fooContext.VO === foo.AO
fooContext.AO {
    i: undefined,
	b: undefined,
    arguments: <>
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```
对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 [[Scope]] 属性查找上级变量

```js
fooContext.[[Scope]] = [
    globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
    fooContext.VO,
    globalContext.VO
]
```

## this
##  数据类型
- 基本类型：Number、Boolean、String、null、undefined、symbol（ES6 新增的），BigInt（ES2020）
- 引用类型：Object，对象子类型（Array，Function）
### Number() 的存储空间
Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。
### symbol 
Symbol.for() 可以在全局访问 symbol。

主要用来提供遍历接口，布置了 symbol.iterator 的对象才可以使用 for···of 循环，可以统一处理数据结构。调用之后回返回一个遍历器对象，包含有一个 next 方法，使用 next 方法后有两个返回值 value 和 done 分别表示函数当前执行位置的值和是否遍历完毕。

Symbol.for() 可以在全局访问 symbol
## instanceof
检测数据类型，如果变量是给定引用类型的实例，那么instanceof就返回true。如果检测的是基础类型的值，那么返回false
```js
function myInstanceof(left,right){
  //如果是基础类型就直接返回false
  if(typeof left !='object' && typeof left ==null) return false
  //Object.getPrototypeOf()方法返回指定对象的原型（内部[[Prototype]]属性的值）
  let proto=Object.getPrototypeOf(left);
  while(true){
    if(!proto) return false;
    if(proto==right.prototype) return true;
    proto=Object.getPrototypeOf(proto);
  } 
}
```
## typeof

## 闭包
闭包是指有权访问另外一个函数作用域中的变量的函数

JavaScript代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶段。编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。执行阶段由引擎完成，主要任务是执行可执行代码，执行上下文在这个阶段创建。

## 作用域
ES5 中只存在两种作用域：全局作用域和函数作用域。在 JavaScript 中，我们将作用域定义为一套规则，这套规则用来管理引擎如何在当前作用域以及嵌套子作用域中根据标识符名称进行变量（变量名或者函数名）查找
### 作用域链
首先要了解作用域链，当访问一个变量时，编译器在执行这段代码时，会首先从当前的作用域中查找是否有这个标识符，如果没有找到，就会去父作用域查找，如果父作用域还没找到继续向上查找，直到全局作用域为止,，而作用域链，就是有当前作用域与上层作用域的一系列变量对象组成，它保证了当前执行的作用域对符合访问权限的变量和函数的有序访问。

### 闭包产生的本质
当前环境中存在指向父级作用域的引用
### 什么是闭包
闭包是一种特殊的对象，它由两部分组成：执行上下文（代号 A），以及在该执行上下文中创建的函数 （代号 B），当 B 执行时，如果访问了 A 中变量对象的值，那么闭包就会产生，且在 Chrome 中使用这个执行上下文 A 的函数名代指闭包。
#### 一般如何产生闭包
- 返回函数
- 函数当做参数传递
#### 闭包的应用场景
- 柯里化 bind
- 模块

[参考资料](https://segmentfault.com/a/1190000012646221)







