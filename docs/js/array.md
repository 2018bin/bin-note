# 数组
## 数组函数方法
### pop
pop() 方法从数组中删除最后一个元素
### push
push() 方法在数组结尾处向数组添加一个新的元素，
返回新数组的长度
### shift
shift() 删除并返回数组的第一个元素。
### unshift
unshift()向数组的开头添加一个或更多元素，并返回新的长度。
### splice
splice()从数组中添加或删除元素。
- 第一个参数（2）定义了应添加新元素的位置（拼接）。
- 第二个参数（0）定义应删除多少元素。
### slice
slice()选取数组的一部分，并返回一个新数组。

slice() 可接受两个参数，比如 (1, 3)。

该方法会从开始参数选取元素，直到结束参数（不包括）为止。
### concat
concat()连接两个或更多的数组，并返回结果。
### fill
fill()使用一个固定值来填充数组
|  参数 | 描述 | 
| ---    | --- | 
| value | 必需。填充的值。| 
| start | 可选。开始填充位置。| 
| end | 可选。停止填充位置 (默认为 array.length)| 

### every
every()检测数值元素的每个元素是否都符合条件。
```js
array.every(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"

### filter
检测数值元素，并返回符合条件所有元素的数组。
```js
array.filter(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"

### find
返回符合传入测试（函数）条件的数组元素。
```js
array.find(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"
### findIndex
返回符合传入测试（函数）条件的数组元素索引。
```js
array.findIndex(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"
### forEach
数组每个元素都执行一次回调函数。
```js
array.forEach(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"
### some
检测数组元素中是否有元素符合指定条件。
```js
array.some(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"
### map
循环返回新数组
```js
arr=array.map(function(currentValue,index,arr), thisValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  currentValue | 必须。当前元素的值            |  
|  index        | 可选。当前元素的索引值        |  
|  arr          | 可选。当前元素属于的数组对象  |  
|  thisValue    | 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。|  
如果省略了 thisValue ，"this" 的值为 "undefined"
### toString
JavaScript 方法 toString() 把数组转换为数组值（逗号分隔）的字符串
### join
join() 方法也可将所有数组元素结合为一个字符串。
它的行为类似 toString()，但是您还可以规定分隔符
### reverse
reverse()反转数组的元素顺序。
### sort
sort()对数组的元素进行排序。
### valueOf
valueOf()返回数组对象的原始值。
### copyWithin
copyWithin()从数组的指定位置拷贝元素到数组的另一个指定位置中。
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  arget | 必需。复制到指定目标索引位置。|  
|  start | 可选。元素复制的起始位置。|  
|  end | 可选。停止复制的索引位置 (默认为 array.length)。如果为负值，表示倒数。|  
### entries
entries() 方法返回一个数组的迭代对象，该对象包含数组的键值对 (key/value)。

迭代对象中数组的索引值作为 key， 数组元素作为 value。
### includes
includes()判断一个数组是否包含一个指定的值。
### from
from()通过给定的对象中创建一个数组。
### indexOf
indexOf()搜索数组中的元素，并返回它所在的位置。
### isArray
isArray()判断对象是否为数组。
### lastIndexOf
lastIndexOf()搜索数组中的元素，并返回它最后出现的位置。
### reduce
将数组元素计算为一个值（从左到右）。
```js
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
```
|  参数         | 描述                        | 
|  ---          | ---                         | 
|  total | 必需。初始值, 或者计算结束后的返回值。|  
|  currentValue | 必需。当前元素|  
|  currentIndex | 可选。当前元素的索引|  
|  arr | 可选。当前元素所属的数组对象。|  
|  initialValue | 可选。传递给函数的初始值|  

### reduceRight
reduceRight()将数组元素计算为一个值（从右到左）


# 数组常用方法

## 数组降维
- 定义 arrReduction 方法接收一个数组参数
- 行 {1} 调用递归函数 arrReductionRecursive(arr, []) 第二个参数可选，也可以在行 {2} 设置默认值，需要 ES6 以上支持
- 行 {3} 使用 forEach 对数组循环遍历
- 行 {4} 检测到当前遍历到的元素为数组继续递归遍历
- 行 {5} 如果当前元素不为数组，result 保存结果
- 行 {6} 返回结果
```js
/**
 * 数组降维递归调用
 * @param { Array } arr 
 */
function arrReductionRecursive(arr, result=[]) { // {2}
  arr.forEach(item => { // {3}
    item instanceof Array ?
      arrReductionRecursive(item, result) // {4}
    : 
      result.push(item); // {5}
  })

  return result; // {6}
}

// 测试
const arr = [[0, 1], [2, [4, [6, 7]]]];
console.log('arrReduction: ', arrReductionRecursive(arr)); // [ 0, 1, 2, 4, 6, 7 ]
```
## 数组/对象数组去重
- 定义 unique 去重方法接收两个参数 arr、name
- 行 {1} 如果待去重为对象数组则 name 必传
- 行 {2} 设置 key 是下面用来过滤的依据
- 行 {3} 如果 name 不存在，按照普通数组做过滤, key 设置为 current 即当前的数组元素
- 行 {4} 检测要过滤的 key 是否在当前对象中，如果是将值赋予 key
- 行 {5} 对于对象元素，如果 key 不在当前对象中，设置一个随机值，使得其它 key 不受影响，例如 [{a: 1}, {b: 1}] 现在对 key 为 a 的元素做过滤，但是 b 中没有 a 针对这种情况做处理
- 行 {6} 为了解决类似于 [3, '3'] 这种情况，这样会把 '3' 也过滤掉
- 行 {7} 这是我们实现的关键，如果 key 在 hash 对象中不存在什么也不做，否则，设置 hash[key] = true 且像 prev 中添加元素。
- 行 {8} 返回当前结果用户下次遍历
```js
/**
 * 数组/对象数组去重
 * @param { Array } arr 待去重的数组
 * @param { String } name 如果是对象数组，为要过滤的依据 key
 * @returns { Array }
 */
function unique (arr=[], name='') {
  if ((arr[0] instanceof Object) && !name) { // {1}
    throw new Error('对象数组请传入需要过滤的属性！');
  }

  const hash = {};
  return arr.reduce((prev, current) => {
    let key; // {2}
    if (!name) { 
      key = current; // {3}
    } else if (current.hasOwnProperty(name)) { 
      key = current[name]; // {4}
    } else {
      key = Math.random(); // {5} 保证其它 key 不受影响
    }

    if (!(Object.prototype.toString.call(key) === '[object Number]')) { // {6}
      key += '_';
    }

    hash[key] ? '' : hash[key] = true && prev.push(current); // {7}

    return prev; // {8}
  }, []);
}

let arr = [1, 2, 2, 3, '3', 4];
    arr = [{ a: 1 }, { b: 2 }, { b: 2 }]
    arr = [{ a: 1 }, { a: 1 }, { b: 2 }]

console.log(unique(arr, 'a'));
```
一种更简单的 ES6 新的数据结构 Set，因为 Set 能保证集合中的元素是唯一的，可以利用这个特性，但是支持有限，对象数组这种就不支持咯
```js
let arr = [1, 2, 2, 3, '3', 4];
[...new Set(arr)] // [ 1, 2, 3, '3', 4 ]
```
### 使用双重for和splice
```js
// 双重for加splice
function unique(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){         
            //第一个等同于第二个，splice方法删除第二个
                arr.splice(j,1);
                j--;
            }
        }
    }
return arr;
}
```
### 使用indexof和includes
```js
//使用indexof
function unique(arr) {
    var array = [];//用新数组来装
    for (let i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            //indexof返回-1表示在新数组中不存在该元素
            array.push(arr[i])//是新数组里没有的元素就push入
        }
    }
    return array;
}
// 或者可以这样，利用 filter + indexOf
function unique(arr) {
    let res = arr.filter(function(item, index, array){
        return arr.indexOf(item) === index;
    })
    return res;
}
```
使用includes也可以判断是否含有某值
```js
function unique(arr) {
    var array =[];
    for(var i = 0; i < arr.length; i++) {
            if( !array.includes(arr[i]) ) {
            //includes 检测数组是否有某个值
                    array.push(arr[i]);
              }
    }
    return array
}
```
- indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。有两个参数，第一个参数是要查找的元素，第二个参数可选，是开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即-1表示从最后一个元素开始查找，-2表示从倒数第二个元素开始查找，查找顺序仍然是从前向后查询数组。如果抵消后的索引值仍小于0，则整个数组都将会被查询。其默认值为0
- includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。其也有两个参数，第一个是要查找的元素，第二个可选，是开始查找的位置，与indexof相同的是，第二个参数为负值的话，就从末尾开始往前跳 参数 的绝对值个索引，然后往后搜寻。默认为 0

### sort方法先排序
```js
function unique(arr) {
    arr = arr.sort((a, b) => a - b)//sort先按从小到大排序
    var arrry= [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1]) {
            arrry.push(arr[i]);
        }
    }
    return arrry;
}
```
sort方法用于从小到大排序(返回一个新数组)，其参数中不带以上回调函数就会在两位数及以上时出现排序错误(如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。两位数会变为长度为二的字符串来计算)。所以自己要写一个排序标准，当回调函数返回值大于0时两个值调换顺序。

### 数据结构 Set
```js
function unique(arr) {
    const result=new Set(arr);
    return [...result];
    //使用扩展运算符将Set数据结构转为数组
}
```
Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。
### Map
```js
function unique(arr) {
    let map = new Map();
    let array = new Array();  // 数组用于返回结果
    for (let i = 0; i < arr.length; i++) {
      if(map.has(arr[i])) {  // 如果有该key值
        map.set(arr[i], true); 
      } else { 
        map.set(arr[i], false);   // 如果没有该key值
        array.push(arr[i]);
      }
    } 
    return array ;
}
```
Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。
- Map.prototype.has(key) 返回一个布尔值，表示Map实例是否包含键对应的值。
- Map.prototype.set(key, value) 设置Map对象中键的值。返回该Map对象。

### filter
```js
function unique(arr) {
    return arr.filter(function (item, index, arr) {
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        //不是那么就证明是重复项，就舍弃
        return arr.indexOf(item) === index;
    })
}
```
filter英文意思是筛选，filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。其回调函数包含三个参数(数组中当前正在处理的元素,在处理的元素在数组中的索引(可选),调用了 filter 的数组本身(可选))
### reduce加includes
```js
function unique(arr){
    let result=arr.reduce((acc,cur)=>{
        if(!acc.includes(cur)){
            acc.push(cur);
        }
        return acc;
    },[])//[]作为回调函数的第一个参数的初始值
    return result
}
```



## 新建长度为9内容全部填1的数组
```js
new Array(9).fill(1)
```

## 排序
### 冒泡排序
```js
function bubbleSort(arr) {
    let len = arr.length
    for (let i=len; i>=2; i--) { // 排完第 2 个，第一个自动为最小
    	for (let j=0; j<i-1; j++) { // 逐渐缩小范围
            if (arr[j] > arr[j+1])
            	[arr[j], arr[j+1]] = [arr[j+1], arr[j]]  //交换位置
        }
    }
    return arr
}
```
### 选择排序
实现思路：遍历自身以后的元素，最小的元素跟自己调换位置。
```js
function selectSort(arr) {
    let len = arr.length
    for (let i=0; i<len-1; i++) {
    	for (let j=i; j<len; j++) {  //循环之后的元素
        	if (arr[j] < arr[i]) 
            	[arr[i], arr[j]] = [arr[j], arr[i]]   //交换最小元素的位置
        }
    }
    return arr
}
```
### 插入排序
实现思路：将元素插入到已排序好的数组中。
```js
function insertSort(arr) {
    for (let i=1; i<arr.length; i++) { // arr[0] 默认为已排序的数组
    	for (let j=i; j>0; j--) {
            if (arr[j] < arr[j-1]) {
            	[arr[j],arr[j-1]] = [arr[j-1],arr[j]]
            } else { break }
        }
    }
    return arr
}
```
```js
function insertionSort(arr) {
    //向右移动的外循环
    for (let i = 0; i < arr.length; i++) {
        //声明内部循环指针
        let j = i
        //记录用于比较的当前数据
        let curr = arr[i]
        //内循环，让当前数据一直向左移动
        //直到遇到比当前数据小的值，或移动到数组左端为止
        //让当前i数据对比前一个数据大小，小就互换位置，一直对比之前的数据
        while (j > 0 && arr[j - 1] > curr) {

            // 将更大的数据往右推
            arr[j] = arr[j - 1]
            // 指针左移
            j--
        }
        // 将当前数据插入到正确的位置，使得0~i之间的数据有序
        arr[j] = curr
    }
    return arr
}
```
### 快速排序
实现思路：选择基准值 mid，循环原数组，小于基准值放左边数组，大于放右边数组，然后 concat 组合，最后依靠递归完成排序。
```js
function quickSort(arr) {
    if (arr.length <= 1) return arr
    let left = [], right = [], mid = arr.splice(0, 1)
    for (let i=0; i<arr.length; i++) {
    	if (arr[i] < mid) {
      	    left.push(arr[i])
      	} else {
      	    right.push(arr[i])
    	}
    }
    return quickSort(left).concat(mid, quickSort(right)) // 别忘了 mid
}
```


