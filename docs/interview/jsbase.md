

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
## 实现一个 new/instanceof 操作符
### 自定义_new()实现new操作符
自定义_new()方法，模拟new操作符实现原理，分为以下三步骤：
- 行 {1} 以构造器的 prototype 属性为原型，创建新对象
  - {1.1} 创建一个新对象 obj
  - {1.2} 新对象的 proto 指向构造函数的 prototype，实现继承
- 行 {2} 改变 this 指向，将新的实例 obj 和参数传入给构造函数 fn 执行
- 行 {3} 如果构造器没有手动返回对象，则返回第一步创建的对象，例如：function Person(name) { this.name = name; return this; } 这样手动给个返回值，行 {2} result 会拿到一个返回的对象，否则 result 返回 undefined，最后就只能将 obj 给返回。
```js
/**
 * 实现一个 new 操作符
 * @param { Function } fn 构造函数
 * @param  { ...any } args
 * @returns { Object } 构造函数实例
 */
function _new(fn, ...args) {
  // {1}  以构造器的 prototype 属性为原型，创建新对象
  // 以下两行代码等价于
  // const obj = Object.create(fn.prototype)
  const obj = {}; // {1.1} 创建一个新对象 obj
  obj.__proto__ = fn.prototype; // {1.2} 新对象的 __proto__ 指向构造函数的 prototype，实现继承

  // {2} 改变 this 指向，将新的实例 obj 和参数传入给构造函数 fn 执行
  const result = fn.apply(obj, args);

  // {3} 返回实例，如果构造器没有手动返回对象，则返回第一步创建的对象
  return typeof result === 'object' ? result : obj;
}
```
将构造函数 Person 与行参传入我们自定义 _new() 方法，得到实例 zhangsan，使用 instanceof 符号检测与使用 new 是一样的。
```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const zhangsan = _new(Person, '张三', 20);
const lisi = new Person('李四', 18)

console.log(zhangsan instanceof Person, zhangsan); // true Person { name: '张三', age: 20 }
console.log(lisi instanceof Person, lisi); // true Person { name: '李四', age: 18 }
```
### 自定义 _instanceof() 实现 instanceof 操作符
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
```js
function Person() {}
const p1 = new Person();
const n1 = new Number()

console.log(p1 instanceof Person) // true
console.log(n1 instanceof Person) // false

console.log(_instanceof(p1, Person)) // true
console.log(_instanceof(n1, Person)) // false

function _instanceof(L, R) {
  L = L.__proto__;
  R = R.prototype;

  while (true) {
    if (L === null) return false;
    if (L === R) return true;
    L = L.__proto__;
  }
}
```


## 手撕 call/apply/bind 三兄弟
### 三者区别：
- call：改变 this 指向，其它参数挨个传入，会立即执行，例如：test.call(obj, 1, 2);
- apply：改变 this 指向，第二个参数需传入数组类型，会立即执行，例如：test.call(obj, [1, 2]);
- bind：改变 this 执行，会接收两次参数传递，需要手动执行，例如：const testFn = test.bind(this, 1); testFn(2);
### 自定义 mayJunCall 函数
```js
/*
 * 实现一个自己的 call 方法
 */
Function.prototype.mayJunCall = function(context) {
  // {1} 如果 context 不存，根据环境差异，浏览器设置为 window，Nodejs 设置为 global
  context = context ? context : globalThis.window ? window : global;
  const fn = Symbol(); // {2} 上下文定义的函数保持唯一，借助 ES6 Symbol 方法 
  context[fn] = this; // {3} this 为需要执行的方法，例如 function test(){}; test.call(null) 这里的 this 就代表 test() 方法
  const args = [...arguments].slice(1); // {4} 将 arguments 类数组转化为数组
  const result = context[fn](...args) // {5} 传入参数执行该方法
  delete context[fn]; // {6} 记得删除
  return result; // {7} 如果该函数有返回值，将结果返回
}

// 测试
name = 'lisi';
const obj = {
  name: 'zs'
};

function test(age, sex) {
  console.log(this.name, age, sex);
}

test(18, '男'); // lisi 18 男
test.mayJunCall(obj, 18, '男'); // zs 18 男
```
### 自定义 mayJunApply 函数
```js
/**
 * 实现一个自己的 apply 方法
 */
Function.prototype.mayJunApply = function(context) {
  //let args = [...arguments].slice(1); // 将 arguments 类数组转化为数组
  //if (args && args.length > 0 && !Array.isArray(args[0])) { // 参数校验，如果传入必须是数组
  //  throw new TypeError('CreateListFromArrayLike called on non-object');
  //}
  context = context ? context : globalThis.window ? window : global;
  const fn = Symbol();
  context[fn] = this; 
  let args = [...arguments].slice(1); // 将 arguments 类数组转化为数组
  args = args.length > 0 ? args[0] : args; // 因为本身是一个数组，此时传值了就是 [[0, 1]] 这种形式
  const result = context[fn](...args);
  delete context[fn];
  return result
}
```
### 自定义 mayJunBind 函数
bind 的实现与 call、apply 不同，但也没那么复杂，首先 bind 绑定之后并不会立即执行，而是会返回一个新的匿名函数，只有我们手动调用它才会执行。
```js
/**
 *  实现一个自己的 bind 方法
 */
Function.prototype.mayJunBind = function(context) {
  const that = this; // 保存当前调用时的 this，因为 bind 不是立即执行
  const firstArgs = [...arguments].slice(1); // 获取第一次绑定时的参数

  return function() {
    const secondArgs = [...arguments]; // 获取第二次执行时的参数
    const args = firstArgs.concat(secondArgs); // 两次参数拼接

    return that.apply(context, args); // 将函数与 context 进行绑定，传入两次获取的参数 args
  }
}
```



## 深拷贝
 ![](~@/deepClone.jpg)
```js
function deepClone(obj,map = new Map()){

    if (obj === null || obj === undefined) return obj // 不进行拷贝
    if(obj instanceof Function) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    // 解决循环引用
    if(map.has(obj)) return map.get(obj);

    // typeof obj === "object"
    if(obj instanceof Object || obj instanceof Array){
        // 数组是 key 为数字素银的特殊对象
        let res = Array.isArray(obj) ? [] : {}
        map.set(obj,res);
            // ============= Symbol
        let symKeys = Object.getOwnPropertySymbols(obj); // 查找
        if (symKeys.length) { // 查找成功	
            symKeys.forEach(key => {
                if (typeof obj[key] === 'object' && obj != null)) {
                    res[key] = deepClone(obj[key], map); 
                } else {
                    res[key] = obj[key];
                }    
            });
        }
        Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Object) {
            res[key] = deepClone(obj[key], map)
        } else {
            res[key] = obj[key]
        }
        });
        return res
    }
    return obj;
  
}
```
深拷贝通常可以通过 JSON.parse(JSON.stringify(object))来解决。
但是该方法也是有局限性的：
- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
- 不能解决循环引用的对象

浅拷贝，当对象或数组中的数据都是基本数据类型的时候，两个数据之间完全是独立的，如果对象或数组中的值是引用类型的时候，里面是引用类型的值，还是会保持共同的内存地址；
## 浅拷贝
浅拷贝是将原数据中所有的数据复制一份，放到新的变量空间中，两个变量不共享一个内存地址。
### Object.assign()
### concat()
### slice()
数组或对象中的值如果是基本类型数据，那拷贝后的数据和原数据是完全没有关联，且互不影响的两个数据，

如果数组或对象的值是引用类型数据的话，拷贝后的数组或对象中的引用类型的值跟原数据中的引用类型的值，还是存在共享同一地址的现象。
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
function debounce (func, ms = 50) {
  let timer, context, args
  // 这里返回的函数是每次实际调用的函数
  return function(...args) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = setTimeout(()=>{
          func.apply(this,args)
      },ms)
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
 
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


## es6
### Module
- import来静态加载模块,
- export对外输出一些模块内的变量，可以输出对象也可以输出函数
### Set/Map
ES6新增的Set数据结构，类似数组，但是成员唯一，不能有重复的值，经常用set进行数组去重，然后再转成数组，提升开发效率

Map()类似对象，依旧是键值的存在，但是键值是一一对应的关系，而不是像对象，键名只能是字符串

### Symbol数据类型
Symbol表示独一无二的值，它是原始数据类型，不能用New
### 属性的简洁表示法
ES6 允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
```js
    let birth ='foo';
    const Person ={
      name:'张三';
     //等同于birth: birth
     birth,   
     // 等同于hello: function ()...
     hello(){ console.log(&#39;我的名字是&#39;,this.name);}  
    };
```
### 属性名表达式
JavaScript 定义对象的属性，有两种方法。
```js
    // 方法一
    obj.foo =true;
    //方法二
    obj['a'+'bc']=123;
```
ES6 允许字面量定义对象时，用表达式作为对象的属性名。
```js
    let propKey ='foo';
    let obj ={
     [propKey]:true,
     ['a'+'bc']:123
    };
    //表达式还可以用于定义方法名。
    let obj ={
      ['h'+'ello'](){
        return 'hi' ;
      }
    };
    obj.hello()
```
### 属性的遍历
- for...in   循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
- Object.keys(obj)   返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
- Object.getOwnPropertyNames(obj)   返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
- Object.getOwnPropertySymbols(obj)   返回一个数组，包含对象自身的所有 Symbol 属性的键名。
- Reflect.ownKeys(obj)   返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。
### super 关键字
this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
```js
    const proto ={
        foo:'hello'
    };
    const obj ={
        foo:'world',
        find(){
            return super.foo;
        }
    };
    Object.setPrototypeOf(obj, proto);
    obj.find()
```
JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）。
```js
    const proto ={
        x:'hello',
        foo(){
            console.log(this.x);
        },
    };
    const obj ={
        x:'world',
        foo(){
            super.foo();
        }
    }
    Object.setPrototypeOf(obj, proto);
    obj.foo()
```
### 解构赋值
对象的解构赋值用于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。
```js
    let{ x, y,...aa }={ x:1, y:2, a:3, b:4};
    x // 1
    y // 2
    z // { a: 3, b: 4 }
```
解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用。
```js
    let obj ={ a:{ b:1}};
    let{...x }= obj;
    obj.a.b =2;
    x.a.b // 2
```
另外，扩展运算符的解构赋值，不能复制继承自原型对象的属性。
```js
    let o1 ={ a:1};
    let o2 ={ b:2};
    o2.__proto__ = o1;
    let{...o3 }= o2;
    o3 // { b: 2 }
    o3.a// undefined
```
### 扩展运算符
对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
```js
    let z ={ a:3, b:4};
    let n ={...z };
    n // { a: 3, b: 4 }
```
数组是特殊的对象，所以对象的扩展运算符也可以用于数组。
```js
    let foo ={...[a,b,c]};
    foo
    // {0: a, 1: b, 2: c}
```
### Es6对象的新增方法
#### Object.is()
ES5 比较两个值是否相等：相等运算符（==）和严格相等运算符（===）。

Object.is它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
```js
    Object.is('foo','foo')

    // true

    Object.is({},{})

    // false
    //不同之处只有两个：一是+0不等于-0，二是NaN等于自身。
    +0===-0 //true

    NaN===NaN // false

    Object.is(+0,-0) // false

    Object.is(NaN,NaN) // true
```
#### Object.assign()
用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

- Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
- 对于这种嵌套的对象，一旦遇到同名属性，Object.assign的处理方法是替换，而不是添加。
- Object.assign可以用来处理数组，但是会把数组视为对象。
- Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。

#### Object.getOwnPropertyDescriptors()
ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。
ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。

#### __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
##### Object.setPrototypeOf()
Object.setPrototypeOf方法的作用与__proto__相同，用来设置一个对象的prototype对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。
##### Object.getPrototypeOf()
该方法与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。
#### Object.keys()
ES5 的Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

ES2017 引入了跟Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。

#### Object.values()
Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
#### Object.entries()
Object.entries()方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

#### Object.fromEntries()
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。因此特别适合将 Map 结构转为对象。

## Event Loop

- 所有的同步任务都在主线程中执行,形成一个执行栈(当函数开始执行,形成一个执行上下文,推入执行栈)
- 主线程之外有一个“任务队列”,只要异步任务有了运行结果,就在“任务队列”中放置一个事件
- 一旦执行栈中的所有同步任务执行完毕,系统就会读取“任务队列”,看看有哪些事件,那么对应的异步任务,结束等待状态,进入执行栈,开始执行
- 主线程不断重复以上三个步骤
[参考资料](https://juejin.cn/post/6942882400703610916#heading-6)

## Promise
Promise 是 ES6 新增的语法，解决了回调地狱的问题。

可以把 Promise 看成一个状态机。初始是 pending 状态，可以通过函数 resolve 和 reject ，将状态转变为 resolved 或者 rejected 状态，状态一旦改变就不能再次变化。

then 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 then 调用就失去意义了。

对于 then 来说，本质上可以把它看成是 flatMap

```js
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
```
### Promise 的其他API
1. Promise.resolve(result)
```js
//制造一个成功或失败
Promise.resolve(1).then(value=>console.log(value))
Promise.resolve(new Promise((resolve,reject)=>reject('制造失败'))).then(null,error=>console.log(error))
```
1

制造失败

2. Promise.reject(reason)
```js
//制造一个失败
Promise.reject(2).then(value=>console.log(value),error=>console.log('失败'))
```
失败

3. Promise.all(array)
```js
//等待全部成功，或者有一个失败
Promise.all([Promise.reject('err1'),Promise.resolve(1)])
	.then(value=>console.log(value),error=>console.log(error))
Promise.all([Promise.resolve(1),Promise.reject('err2')])
	.then(value=>console.log(value),error=>console.log(error))
Promise.all([Promise.resolve(1),Promise.resolve(2)])
	.then(value=>console.log(value),error=>console.log(error))
Promise.all([Promise.reject('err3'),Promise.reject('err4')])
	.then(value=>console.log(value),error=>console.log(error))
```
err1

err2

[1,2]

err3


4. Promise.race(array)
```js
//等待第一个状态改变
Promise.race([Promise.reject('err1'),Promise.resolve(1)])
	.then(value=>console.log(value),error=>console.log(error))
Promise.race([Promise.resolve(1),Promise.reject('err2')])
	.then(value=>console.log(value),error=>console.log(error))
Promise.race([Promise.resolve(1),Promise.resolve(2)])
	.then(value=>console.log(value),error=>console.log(error))
Promise.race([Promise.reject('err3'),Promise.reject('err4')])
	.then(value=>console.log(value),error=>console.log(error))
```
err1

1

1

err3

4. Promise.allSettled(array)
```js
//all只要有一个失败就中断，但我们希望拿到所有结果
//allSettled等待全部promise状态改变
Promise.allSettled([Promise.reject('err1'),Promise.resolve(1)])
	.then(value=>console.log(value),error=>console.log(error))
//自己模拟实现Promise.allSettled
Promise.allSettled2=(promiseList)=>{
    return Promise.all(promiseList.map(promise=>promise.then((value)=>{return {status:"ok",value}},(value)=>({status:"not ok",value}))))
}
```
[
    {status:'reject',reason:'err1'},
      {status:'fulfilled',value:1}
]


## 跨域
是指浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对JavaScript实施的安全限制。

同源：端口相同、协议相同、域名相同；三者有一个不同就是跨域
### JSONP跨域
本质是利用了标签具有可跨域的特性；我们使用script标签请求地址，带上参数，参数值是我们在全局定义的一个函数；然后返回数据的时候，我们返回这个函数的调用，带上我们要传递回来的数据作为参数进行传递，这样浏览器会直接执行这个函数；这样就实现了跨域；

缺点：不支持post；只能是get

### CORS跨域
服务端设置响应头信息，允许跨域

JSONP只支持GET请求，CORS支持所有类型的HTTP请求

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

简单的请求：
- Access-Control-Allow-Origin
该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名

- Access-Control-Allow-Credentials
该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。

- Access-Control-Expose-Headers
该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

非简单请求
预检请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

### 代理
nginx 的proxy

### postMessage

### document.domin + iframe

### window.name + iframe

## Web Storage
客户端本地保存数据的功能
### Cookie
大小：Cookie的大小被限制在4kb。

带宽：Cookie是随HTTP事务一起被发送的,因此会浪费一部分发送Cookie时使用的带宽。
### Web Storage分为两种：sessionStorage 和localStorage。
sessionStorage将数据保存在Session 对象中。所谓 Session，是指用户在浏览某个网站时，从进入网站到浏览器关闭所经过的这段时间。存储 在sessionStorage里面的数据在页面会话结束时会被清除，页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话，不会消除数据。 

localStorage将数据保存在客户端本地的硬件设备（通常指硬盘，也可以是其他硬件设备中），即使浏览器被关闭了，该数据仍然存在，下次打开浏览器访问网站的时候仍然可以继续使用。

#### 相同点
- 都是保存在浏览器端 
都是保存在浏览器端的数据，不同浏览器无法共享localStorage和sessionStorage 信息。 
- 都是同源的 
不同源的页面无法共享localStorage和sessionStorage 信息。所谓同源就是同域名、同端口、同协议。 
- 操作方法相同 
localStorage和sessionStorage都具有相同的操作方法，不但可以用自身的 setItem()，getItem()等方便存取，也可以像普通对象一样用点“.” 操作符 ，及“ []”的方式进行数据存取。（下文有详细介绍）

#### 不同点
- 生命周期不同                             
localStorage为永久存储，除非用户手动清除localStorage信息，否则这些信息将永远存在。 

sessionStorage为临时保存，生命周期为当前窗口或标签页，一旦窗口或标签页被关闭了，那么所有通过sessionStorage 存储的数据也就被清空了。
- 作用域不同
不同浏览器无法共享localStorage或 sessionStorage信息；不同源的页面无法共享localStorage或 sessionStorage信息。

localStorage信息可以在相同浏览器 中同源的不同页面间共享，可以是不同标签页中的页面、也可以是不同窗口的页面。

sessionStorage信息不可以在不同页面或标签页间 共享，即使是相同浏览器、相同窗口中的同源页面。 
 








## 解析URL请求到页面显示完整过程
### URL 解析
### 缓存检查
### DNS 解析
获取请求域名服务器的 IP 地址
- 浏览器缓存
- 操作系统的缓存
- host 文件
- 路由器缓存
- ISP互联网服务提供商缓存
- . 根 DNS 服务器 -> .com 顶级服务器 -> 主域名服务器 -> ...，直到服务器返回对应的 IP
### TCP 连接三次握手

### HTTP请求

### 四次挥手
### 客户端解析资源
gzip 压缩后的文件则进行解压缩，如果响应头 Content-type 为 text/html，则开始解析 HTML

