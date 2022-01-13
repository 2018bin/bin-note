# TypeScript
直接使用线上的[TypeScript Playground ](https://www.typescriptlang.org/play?#code) 来学习新的语法或新特性。
## 基础类型
### Boolean 类型
### Number  类型
### String  类型
### Array  类型
### Any  类型
使用 any 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 any 类型，就无法使用 TypeScript 提供的大量的保护机制。为了解决 any 带来的问题，TypeScript 3.0 引入了 unknown 类型。
### Unknown  类型
就像所有类型都可以赋值给 any，所有类型也都可以赋值给 unknown。这使得 unknown 成为 TypeScript 类型系统的另一种顶级类型（另一种是 any）

unknown 类型只能被赋值给 any 类型和 unknown 类型本身。
### Enum  类型
#### 数字枚举
从第一个值自动增长
```js
enum Direction {
  a ,
  b,
  c,
  d,
  e=10,
  f,
  g,
  h=3,
  i,
  j
}
```
```log
[LOG]: {
  "0": "a",
  "1": "b",
  "2": "c",
  "3": "h",
  "4": "i",
  "5": "j",
  "10": "e",
  "11": "f",
  "12": "g",
  "a": 0,
  "b": 1,
  "c": 2,
  "d": 3,
  "e": 10,
  "f": 11,
  "g": 12,
  "h": 3,
  "i": 4,
  "j": 5
} 
```
#### 字符串枚举

#### 异构枚举
异构枚举的成员值是数字和字符串的混合：


### Tuple  类型
数组一般由同种类型的值组成，但有时需要在单个变量中存储不同类型的值，这时候就可以使用元组。

元组可用于定义具有有限数量的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，必须提供每个属性的值。
```js
let tupleType: [string, boolean];
tupleType = ["Semlinker", true];
```
很明显是因为类型不匹配导致的。在元组初始化的时候，还必须提供每个属性的值，不然也会出现错误。
### Void 类型
void 类型像是与 any 类型相反，它表示没有任何类型。当一个函数没有返回值时，通常会见到其返回值类型是 void
```js
// 声明函数返回值为void
function warnUser(): void {
  console.log("This is my warning message");
}
```
声明一个 void 类型的变量没有什么作用，因为它的值只能为 undefined 或 null。
### Null 和 Undefined 类型
默认情况下 null 和 undefined 是所有类型的子类型。 就是说可以把 null 和 undefined 赋值给 number 类型的变量。

然而，如果指定了--strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自的类型。
### Never 类型
never 类型表示的是那些永不存在的值的类型。 例如，never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
```js
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

## TypeScript 断言
类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。
### “尖括号” 语法
```js
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```
### as 语法
```js
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

## 类型守卫
类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护：

### in 关键字
```js
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;
function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}
let emp={
  name:123,
  privileges:222,
  startDate:333
}
printEmployeeInformation(emp:Object)
```

### typeof 关键字
```js
function padLeft(padding: string | number) {
      return typeof padding;
}
let  padding='333'
console.log(padLeft(padding))

"string" 
```
typeof 类型保护只支持两种形式：typeof v === "typename" 和 typeof v !== typename，"typename" 必须是 "number"， "string"， "boolean" 或 "symbol"。 但是 TypeScript 并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。

### instanceof 关键字

### 自定义类型保护的类型谓词
```js
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
console.log(isString(123))
false
```
### 联合类型和类型别名
#### 联合类型
联合类型通常与 null 或 undefined 一起使用：
```js
const sayHello = (name: string | undefined) => {
  /* ... */
};
```
#### 可辨识联合
TypeScript 可辨识联合（Discriminated Unions）类型，也称为代数数据类型或标签联合类型。它包含 3 个要点：可辨识、联合类型和类型守卫。

这种类型的本质是结合联合类型和字面量类型的一种类型保护方法。如果一个类型是多个类型的联合类型，且多个类型含有一个公共属性，那么就可以利用这个公共属性，来创建不同的类型保护区块。

- 可辨识
可辨识要求联合类型中的每个元素都含有一个单例类型属性，比如：
```js
enum CarTransmission {
  Automatic = 200,
  Manual = 300
}

interface Motorcycle {
  vType: "motorcycle"; // discriminant
  make: number; // year
}

interface Car {
  vType: "car"; // discriminant
  transmission: CarTransmission
}

interface Truck {
  vType: "truck"; // discriminant
  capacity: number; // in tons
}
```
在上述代码中，我们分别定义了 Motorcycle、 Car 和 Truck 三个接口，在这些接口中都包含一个 vType 属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关
- 联合类型
```js
type Vehicle = Motorcycle | Car | Truck;
```
- 类型守卫
```js
function evaluatePrice(vehicle: Vehicle) {
  switch(vehicle.vType) {
    case "car":
      return vehicle.transmission * EVALUATION_FACTOR;
    case "truck":
      return vehicle.capacity * EVALUATION_FACTOR;
    case "motorcycle":
      return vehicle.make * EVALUATION_FACTOR;
  }
}
```
#### 类型别名
类型别名用来给一个类型起个新名字。
```js
type Message = string | string[];

let greet = (message: Message) => {
  // ...
};
```
### 交叉类型
TypeScript 交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。
```js
interface IPerson {
  id: string;
  age: number;
}

interface IWorker {
  companyId: string;
}

type IStaff = IPerson & IWorker;

const staff: IStaff = {
  id: 'E1006',
  age: 33,
  companyId: 'EFT'
};

console.dir(staff)
```
## TypeScript 函数
### 参数类型和返回类型
```js
function createUserId(name: string, id: number): string {
  return name + id;
}
console.log(createUserId('aaa',123))
'aaa123'
```
### 函数类型
```js
let IdGenerator: (chars: string, nums: number) => string;
function createUserId(name: string, id: number): string {
  return name + id;
}
IdGenerator = createUserId;
```
### 可选参数及默认参数
```js
// 可选参数
function createUserId(name: string, id: number, age?: number): string {
  return name + id;
}

// 默认参数
function createUserId(
  name: string = "Semlinker",
  id: number,
  age?: number
): string {
  return name + id;
}
```
在声明函数时，可以通过 ? 号来定义可选参数，比如 age?: number 这种形式。在实际使用时，需要注意的是可选参数要放在普通参数的后面，不然会导致编译错误。


### 剩余参数
```js
function push(array, ...items) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a = [];
push(a, 1, 2, 3);
```



### 函数重载
方法重载是指在同一个类中方法同名，参数不同（参数类型不同、参数个数不同或参数个数相同时参数的先后顺序不同），调用时根据实参的形式，选择与它匹配的方法执行操作的一种技术。所以类中成员方法满足重载的条件是：在同一个类中，方法名相同且参数列表不同。
```js
class Calculator {
  add(a: number, b: number,c:string): number;
  add(a: string, b: string): string;
  add(a: string, b: number): string;
  add(a: number, b: string,c:number): string;
  add(a: any, b: any, c: any) {
    if (typeof a === "string" || typeof b === "string") {
      return a.toString() + b.toString();
    }
    return a + b;
  }
}
const calculator = new Calculator();
console.log(calculator.add('123','123'))
```
## TypeScript 接口
### 对象的形状
```js
interface Person {
  name: string;
  age: number;
}

let Semlinker: Person = {
  name: "Semlinker",
  age: 33,
};
```
### 可选 | 只读属性
```js
interface Person {
  readonly name: string;
  age?: number;
}
```
只读属性用于限制只能在对象刚刚创建的时候修改其值。此外 TypeScript 还提供了 ReadonlyArray<T> 类型，它与 Array<T> 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改。
```js
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```
## TypeScript 类
### 类的属性与方法
```js
class Greeter {
  // 静态属性
  static cname: string = "Greeter";
  // 成员属性
  greeting: string;

  // 构造函数 - 执行初始化操作
  constructor(message: string) {
    this.greeting = message;
  }

  // 静态方法
  static getClassName() {
    return "Class name is Greeter";
  }

  // 成员方法
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```
### 访问器
在 TypeScript 中， 可以通过 getter 和 setter 方法来实现数据的封装和有效性校验，防止出现异常数据。
```js
let passcode = "Hello TypeScript";

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (passcode && passcode == "Hello TypeScript") {
      this._fullName = newName;
    } else {
      console.log("Error: Unauthorized update of employee!");
    }
  }
}

let employee = new Employee();
employee.fullName = "Semlinker";
if (employee.fullName) {
  console.log(employee.fullName);
}
```
### 类的继承
```js
class Animal {
  name: string;
  age:number;
  
  constructor(theName: string,age:number) {
    this.name = theName;
     this.age = age;
  }
  
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string,age:number) {
    super(name,age);
  
  }
  
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python",12);
sam.move();
```

### ECMAScript 私有字段
```js
class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
let semlinker = new Person("Semlinker");
console.log(semlinker)
```
与常规属性（甚至使用 private 修饰符声明的属性）不同，私有字段要牢记以下规则：

- 私有字段以 # 字符开头，有时我们称之为私有名称；
- 每个私有字段名称都唯一地限定于其包含的类；
- 不能在私有字段上使用 TypeScript 可访问性修饰符（如 public 或 private）；
- 私有字段不能在包含的类之外访问，甚至不能被检测到。


## TypeScript 泛型
### 泛型接口
```js
interface GenericIdentityFn<T> {
  (arg: T): T;
}
```
### 泛型类
```js
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```
### 泛型变量

- T（Type）：表示一个 TypeScript 类型
- K（Key）：表示对象中的键类型
- V（Value）：表示对象中的值类型
- E（Element）：表示元素类型

### 泛型工具类型
#### typeof
在 TypeScript 中，typeof 操作符可以用来获取一个变量声明或对象的类型。

#### keyof
keyof 操作符可以用来一个对象中的所有 key 值：
```js
interface Person {
    name: string;
    age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```
#### in
in 用来遍历枚举类型：
```js
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```
#### infer
在条件类型语句中，可以用 infer 声明一个类型变量并且对它进行使用。
```js
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```
#### extends
有时候定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。
```js
interface ILengthwise {
  length: number;
}

function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```
#### Partial
Partial<T> 的作用就是将某个类型里的属性全部变为可选项 ?。

## 编译上下文
### tsconfig.json 的作用
- 用于标识 TypeScript 项目的根路径；
- 用于配置 TypeScript 编译器；
- 用于指定编译的文件。

### tsconfig.json 重要字段
- files - 设置要编译的文件的名称；
- include - 设置需要进行编译的文件，支持路径模式匹配；
- exclude - 设置无需进行编译的文件，支持路径模式匹配；
- compilerOptions - 设置与编译流程相关的选项。
### compilerOptions 选项
```js
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

























































