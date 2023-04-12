## 类装饰器

类装饰器顾名思义，就是用来装饰类的。它接收一个参数：

- target: TFunction - 被装饰的类

### 普通装饰器

```js
// 定义普通装饰器
function logClass(params: any) {
  console.log(params);

  // 动态扩展的属性
  params.prototype.apiUrl = "xxx";
  // 动态扩展的方法
  params.prototype.run = function () {
    console.log("我是一个run方法");
  };
}

// 使用类装饰器（普通装饰器，无法传参）
@logClass
class HttpClient {
  constructor() {}

  getData() {}
}

let http = new HttpClient();
```

```log
class HttpClient {
    constructor() {
    }
    getData() {
    }
}
```

### 装饰器工厂

```js
// 定义装饰器工厂
function logClass(params: string) {
  return function (target: any) {
    console.log("target：", target);
    console.log("params：", params);

    target.prototype.apiUrl = params;
  };
}

// 使用类装饰器：装饰器工厂,可传参(相当于把hello给了params,下面这个类给了target)
@logClass("http:www.baidu.com")
class HttpClient {
  constructor() {}

  getData() {}
}

let http = new HttpClient();
console.log(http.apiUrl);
```

```log
[LOG]: "target：",  class HttpClient {
    constructor() {
    }
    getData() {
    }
}
[LOG]: "params：",  "http:www.baidu.com"
[LOG]: "http:www.baidu.com"
```

## 属性装饰器

属性装饰器顾名思义，用来装饰类的属性。它接收两个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 被装饰类的属性名

```js
// 定义类装饰器
function logClass(params: string) {
  return function (target: any) {
    console.log(target);
    console.log(params);
  }
}

// 定义属性装饰器
function logProperty(params: any) {
  // target--->类的原型对象；attr--->传入的参数url
  return function (target: any, attr: any) {
    console.log(target, attr);

    target[attr] = params
  }
}

@logClass('xxxx')
class HttpClient {

  @logProperty('http://www.baidu.com')
  public url: any | undefined;
  constructor() {

  }
  getData() {
    console.log(this.url);
  }
}

let http = new HttpClient();
http.getData();
```

```log
[LOG]: HttpClient: {},  "url"
[LOG]: class HttpClient {
    constructor() {
    }
    getData() {
        console.log(this.url);
    }
}
[LOG]: "xxxx"
[LOG]: "http://www.baidu.com"
```

## 方法装饰器

方法装饰器顾名思义，用来装饰类的方法。它接收三个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 方法名
- descriptor: TypePropertyDescript - 属性描述符

```js
function method(params:any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor){
    console.log('params '+params);
   console.log(target);
   console.log("prop " + propertyKey);
   console.log("desc " + JSON.stringify(descriptor) + "\n\n");
  }
};
class Http{
  name: string;
  age: number;
  constructor() {
    console.log('hello123');
    this.name = 'yugo';
  }
​
  @method('123')
  hello(){
    return 'instance method';
  }
​
  @method('456')
  static shello(){
    return 'static method';
  }
}
let http=new Http()
```

```log
[LOG]: "params 123" 
[LOG]: Http: {} 
[LOG]: "prop hello" 
[LOG]: "desc {"writable":true,"enumerable":false,"configurable":true}" 
[LOG]: "params 456" 
[LOG]: class Http {
    constructor() {
        console.log('hello123');
        this.name = 'yugo';
    }
    hello() {
        return 'instance method';
    }
    static shello() {
        return 'static method';
    }
} 
[LOG]: "prop shello" 
[LOG]: "desc {"writable":true,"enumerable":false,"configurable":true}" 
[LOG]: "hello123" 
```
## 参数装饰器
参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：
- target: Object - 被装饰的类
- propertyKey: string | symbol - 方法名
- parameterIndex: number - 方法中参数的索引值
```js
function Log(target: Function, propertyKey: any, parameterIndex: number) {
  let functionLogged = propertyKey || target.prototype.constructor.name;

  console.log(target)
  console.log(propertyKey)
  console.log(parameterIndex)
}

class Greeter {
  greeting: string;
  constructor(s:any=2,@Log phrase: any) {
	this.greeting = phrase; 
  console.log(phrase)
  }
}
 ```
 ```log
[LOG]: class Greeter {
    constructor(s = 2, phrase) {
        this.greeting = phrase;
        console.log(phrase);
    }
} 
[LOG]: undefined 
[LOG]: 1
 ```


