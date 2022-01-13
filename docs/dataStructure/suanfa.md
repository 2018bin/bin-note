
# 算法
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


