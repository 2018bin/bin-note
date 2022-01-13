# webpack
## 四个概念
### 一 入口
```js
module.exports = {
  entry: './src/index.js'
};
```
### 二 输出
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.min.js'
  }
};
```
### 三 loader
webpack loader 将所有类型的文件，转换为应用程序的依赖图可以直接引用的模块
### 四 插件(plugins)
通过require()将想要使用的插件添加到plugins数组中,多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

## 路由懒加载
路由懒加载也可以叫做路由组件懒加载，最常用的是通过import()来实现它。
```js
function load(component) {
    return () => import(`views/${component}`)
}
```
然后通过Webpack编译打包后，会把每个路由组件的代码分割成一一个js文件，初始化时不会加载这些js文件，只当激活路由组件才会去加载对应的js文件。
