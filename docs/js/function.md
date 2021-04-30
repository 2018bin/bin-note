
## setTimeout
setTimeout 按照顺序放到队列里面，然后等待函数调用栈清空之后才开始执行，而这些操作进入队列的顺序，则由设定的延迟时间来决定

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
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  }
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => throw r;

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === "function") {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}
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

### 手写Promise
```js
//手写Promise.all
function all(promiseArray){
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(promiseArray)){
            return reject(new Error('传入的参数必须是数组'));
        }
        let res=[];
        let counter=0;
        for(let i=0;i<promiseArray.length;i++){
            Promise.resolve(promiseArray[i]).then(value=>{
                counter++;
                res[i]=value;
                if(counter===promiseArray.length){
                    return resolve(res);
                }
            }).catch(
                e=>{
                    reject(new Error('失败'));
                }
            )
        }
    })
}

var promise1 = Promise.resolve(3);
var promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});
var promise3 = 42;

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});
```
```js
// 手写Promise.race
function race(promiseArray){
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(promiseArray)){
            return reject(new Error('传入的参数必须是数组'));
        }
        for(let i=0;i<promiseArray.length;i++){
            Promise.resolve(promiseArray[i]).then(value=>{
                resolve(value)
            }).catch(
                e=>{
                    reject(new Error('失败'));
                }
            )
        }
    })
}
var promise1 = Promise.resolve(3);
var promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});
var promise3 = 42;
Promise.race([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});
```

## async 和 await
一个函数如果加上 async ，那么该函数就会返回一个 Promise
```js
async function test() {
  return "1";
}
console.log(test()); // -> Promise {<resolved>: "1"}
```
可以把 async 看成将函数返回值使用 Promise.resolve() 包裹了下。

await 只能在 async 函数中使用
```js
function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('finish')
      resolve("sleep");
    }, 2000);
  });
}
async function test() {
  let value = await sleep();
  console.log("object");
}
test()
```
上面代码会先打印 finish 然后再打印 object 。因为 await 会等待 sleep 函数 resolve ，所以即使后面是同步代码，也不会先去执行同步代码再来执行异步代码。

async 和 await 相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码。缺点在于滥用 await 可能会导致性能问题，因为 await 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

下面来看一个使用 await 的代码
```js
var a = 0
var b = async () => {
  a = a + await 10
  console.log('2', a) // -> '2' 10
  a = (await 10) + a
  console.log('3', a) // -> '3' 20
}
b()
a++
console.log('1', a) // -> '1' 1
```
- 首先函数 b 先执行，在执行到 await 10 之前变量 a 还是 0，因为在 await 内部实现了 generators ，generators 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
- 因为 await 是异步操作，遇到await就会立即返回一个pending状态的Promise对象，暂时返回执行代码的控制权，使得函数外的代码得以继续执行，所以会先执行 console.log('1', a)
- 这时候同步代码执行完毕，开始执行异步代码，将保存下来的值拿出来使用，这时候 a = 10
- 然后后面就是常规执行代码了


## Generator 
Generator 是 ES6 中新增的语法，和 Promise 一样，都可以用来异步编程
```js
// 使用 * 表示这是一个 Generator 函数
// 内部可以通过 yield 暂停代码
// 通过调用 next 恢复执行
function* test() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}
let b = test();
console.log(b.next()); // >  { value: 2, done: false }
console.log(b.next()); // >  { value: 3, done: false }
console.log(b.next()); // >  { value: undefined, done: true }
```
从以上代码可以发现，加上 * 的函数执行后拥有了 next 函数，也就是说函数执行后返回了一个对象。每次调用 next 函数可以继续执行被暂停的代码。以下是 Generator 函数的简单实现
```js
// cb 也就是编译过的 test 函数
function generator(cb) {
  return (function() {
    var object = {
      next: 0,
      stop: function() {}
    };

    return {
      next: function() {
        var ret = cb(object);
        if (ret === undefined) return { value: undefined, done: true };
        return {
          value: ret,
          done: false
        };
      }
    };
  })();
}
// 如果你使用 babel 编译后可以发现 test 函数变成了这样
function test() {
  var a;
  return generator(function(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        // 可以发现通过 yield 将代码分割成几块
        // 每次执行 next 函数就执行一块代码
        // 并且表明下次需要执行哪块代码
        case 0:
          a = 1 + 2;
          _context.next = 4;
          return 2;
        case 4:
          _context.next = 6;
          return 3;
		// 执行完毕
        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}
```

## Proxy
Proxy 是 ES6 中新增的功能，可以用来自定义对象中的操作
```js
let p = new Proxy(target, handler);
// `target` 代表需要添加代理的对象
// `handler` 用来自定义对象中的操作
```
可以很方便的使用 Proxy 来实现一个数据绑定和监听
```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value);
      return Reflect.set(target, property, value);
    }
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 }
let value
let p = onWatch(obj, (v) => {
  value = v
}, (target, property) => {
  console.log(`Get '${property}' = ${target[property]}`);
})
p.a = 2 // bind `value` to `2`
p.a // -> Get 'a' = 2
```


## 0.1 + 0.2 != 0.3
因为 JS 采用 IEEE 754 双精度版本（64位），并且只要采用 IEEE 754 的语言都有该问题。

我们都知道计算机表示十进制是采用二进制表示的，所以 0.1 在二进制表示为
```js
// (0011) 表示循环
0.1 = 2^-4 * 1.10011(0011)
```
小数算二进制和整数不同。乘法计算时，只计算小数位，整数位用作每一位的二进制，并且得到的第一位为最高位。所以我们得出 0.1 = 2^-4 * 1.10011(0011)，那么 0.2 的演算也基本如上所示，只需要去掉第一步乘法，所以得出 0.2 = 2^-3 * 1.10011(0011)

回来继续说 IEEE 754 双精度。六十四位中符号位占一位，整数位占十一位，其余五十二位都为小数位。因为 0.1 和 0.2 都是无限循环的二进制了，所以在小数位末尾处需要判断是否进位（就和十进制的四舍五入一样）

所以 2^-4 * 1.10011...001 进位后就变成了 2^-4 * 1.10011(0011 * 12次)010 。那么把这两个二进制加起来会得出 2^-2 * 1.0011(0011 * 11次)0100 , 这个值算成十进制就是 0.30000000000000004

原生解决办法
```js
parseFloat((0.1 + 0.2).toFixed(10))
```
## 正则表达式

#### 元字符

|  元字符 | 作用 | 
| ---    | --- | 
|   .	 |  匹配任意字符除了换行符和回车符|
|   []   |匹配方括号内的任意字符。比如 [0-9] 就可以用来匹配任意数字  |
|    ^   |  ^9，这样使用代表匹配以 9 开头。[^9]，这样使用代表不匹配方括号内除了 9 的字符|
| {1, 2} |匹配 1 到 2 位字符|
|  (yck) | 只匹配和 yck 相同字符串|
|   |	 |    匹配 | 前后任意字符|
|  `\`   |转义|
|   *	 |只匹配出现 0 次及以上 * 前的字符|
|   +	 |只匹配出现 1 次及以上 + 前的字符|
|   ?	 |? 之前字符可选|
#### 修饰语

|   修饰语  |	作用            |
|    ---    |   ---             | 
|     i	    |    忽略大小写     |
|     g	    |    全局搜索       |
|     m	    |    多行           |

#### 字符简写
|     简写	| 作用                  | 
|    ---    |   ---             | 
|     \w	| 匹配字母数字或下划线  | 
|     \W	| 和上面相反            | 
|     \s	| 匹配任意的空白符          | 
|     \S	| 和上面相反            | 
|     \d	| 匹配数字              | 
|     \D	| 和上面相反            | 
|     \b	| 匹配单词的开始或结束  | 
|     \B	| 和上面相反             | 


## 实现一个 sleep 函数
```js
/**
 * 延迟函数
 * @param { Number } seconds 单位秒
 */
function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(true);
    }, seconds)
  })
}
async function test() {
  console.log('hello');
  await sleep(5000);
  console.log('world! 5 秒后输出');
}
test();
```
## 柯里化函数实现
接收函数作为参数的函数称为高阶函数，柯里化是高阶函数中的一种特殊写法。

函数柯里化是一把接受多个参数的函数转化为最初只接受一个参数且返回接受余下的参数返回结果的新函数。
```js
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    }
  }
}
console.log(add(1)(2)(3)); // 6
```
函数柯里化具备更加强大的能力，因此，我们要去想办法实现一个柯里化的通用式，上面例子中我们使用了闭包，但是代码是重复的，所以我们还需要借助递归来实现。

实现思路：
- 行 {1} 定义 addFn 函数
- 行 {2} 定义 curry 柯里化函数接收两个参数，第一个为 fn 需要柯里化的函数，第二个 ...args 实际为多个参数例如 1, 2 ...
- 行 {3} args.length 是函数传入的参数，如果小于 fn.length 说明期望的参数长度未够，继续递归调用收集参数
- 行 {4} 为一个匿名函数
- 行 {5} 获取参数，注意获取到的数据为数组，因此行 {6} 进行了解构传递
- 行 {3} 如果 args.length > fn.length 说明参数 args 收集完成，开始执行代码行 {7} 因为 args 此时为数组，所以使用了 apply 或者也可以使用 call，改动行 {7} fn.call(null, ...args)
- 行 {8} 创建一个柯里化函数 add，此时 add 返回结果 curry 的匿名函数也就是代码行 {4} 处
- 至此整个函数柯里化已完成可以自行测试。
```js
/**
 * add 函数
 * @param { Number } a 
 * @param { Number } b 
 * @param { Number } c 
 */
function addFn(a, b, c) { // {1}
  return a + b + c;
}

/**
 * 柯里化函数
 * @param { Function } fn 
 * @param { ...any } args 记录参数
 */
function curry(fn, ...args) { // {2}
  if (args.length < fn.length) { // {3}
    return function() { // {4}
      let _args = Array.prototype.slice.call(arguments); // {5}
      return curry(fn, ...args, ..._args); // {6} 上面得到的结果为数组，进行解构 
    }
  }

  return fn.apply(null, args); // {7}
}

// curry 函数简写如下，上面写法可能更易理解
// const curry = (fn, ...args) => args.length < fn.length ?
// 	(..._args) => curry(fn, ...args, ..._args)
// 	:
// 	fn.call(null, ...args);

// 柯里化 add 函数
const add = curry(addFn); // {8}

console.log(add(1)(2)(3)); // 6
console.log(add(1, 2)(3)); // 6
console.log(add(1)(2, 3)); // 6
```

## 实现 map/reduce
### 定义 mayJunMap 实现 map 函数
```js
/**
 * 实现 map 函数
 * map 的第一个参数为回调，第二个参数为回调的 this 值
 */
Array.prototype.mayJunMap = function(fn, thisValue) {
  const fnThis = thisValue || [];
  return this.reduce((prev, current, index, arr) => {
    prev.push(fn.call(fnThis, current, index, arr));
    return prev;
  }, []);
}

const arr1 = [undefined, undefined];
const arr2 = [undefined, undefined].mayJunMap(Number.call, Number);
const arr3 = [undefined, undefined].mayJunMap((element, index) => Number.call(Number, index));

// arr2 写法等价于 arr3
console.log(arr1) // [ undefined, undefined ]
console.log(arr2) // [ 0, 1 ]
console.log(arr3) // [ 0, 1 ]
```
### 定义 mayJunReduce 实现 reduce 函数
```js
Array.prototype.mayJunReduce = function(cb, initValue) {
  const that = this;

  for (let i=0; i<that.length; i++) {
    initValue = cb(initValue, that[i], i, that);
  }

  return initValue;
}

const arr = [1, 2, 3];
const arr1 = arr.mayJunReduce((prev, current) => {
  console.log(prev, current);
  prev.push(current)
  return prev;
}, [])

console.log(arr1)
```

















