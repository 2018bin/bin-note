# Babel
## 原理
Babel 转换 JS 代码可以分成以下三个大步骤：
- Parser（解析）：此过程接受转换之前的源码，输出 AST（抽象语法树）。在 Babel 中负责此过程的包为 babel/parser；
- Transform（转换）：此过程接受 Parser 输出的 AST（抽象语法树），输出转换后的 AST（抽象语法树）。在 Babel 中负责此过程的包为 @babel/traverse；
- Generator（生成）：此过程接受 Transform 输出的新 AST，输出转换后的源码。在 Babel 中负责此过程的包为 @babel/generator。

### （1）code --> AST
 第一步就是把我们写的 ES6 代码字符串转换成 ES6 AST

那转换的工具为 babel 的 parser
### （2）Transform
将 ES6 的 AST 操作 JS 转换成 ES5 的 AST

### (3) Generate(代码生成)
将 ES5 的AST 转换成 ES5 代码字符串

## 常见的babel库
- @babel/core
- @babel/cli, @babel/node, @babel/register
- @babel/loader
- @babel/preset-env
- @babel/polyfill
- @babel/runtime, @babel/plugin-transform-runtime
### @babel/core
@babel/core是babel的核心库，没有它就没有转换能力，其作用是把 js 代码分析成 ast ，方便各个插件分析语法进行相应的处理。有些新语法在低版本js中是不存在的，如箭头函数，rest 参数，函数默认值等，这种语言层面的不兼容只能通过将代码转为 ast，分析其语法后再转为低版本 js。
 
其内部使用了@babel/parser，@babel/traverse，@babel/generator三个工具来负责代码的转译过程。
- @babel/parser：将js代码解析为抽象语法树；
- @babel/traverse：遍历更新@babel/parser解析后的抽象语法树；
- @babel/generator：解析@babel/traverse编辑后的抽象语法树，生成对应的es5语法。
### 工具（@babel/register、@babel/node、 @babel/cli）
@babel/register、@babel/node和@babel/cli都要把@babel/core安装上，因为编译的transform方法在这里面。

#### @babel/register
@babel/register模块改写require命令，为它加上一个钩子。node 后续运行时所需要 require 进来的扩展名为.js、.jsx、.es和.es6的文件，就会先用Babel进行转码。

#### @babel/node
它提供babel-node命令，支持ES6的REPL环境，支持Node.js CLI的所有功能，而且运行之前编译ES6代码。但node大部分es6语法都已经支持，可以通过es-checker检查es6的支持。
#### @babel/cli
@babel/cli和@babel/node都是命令行工具，


### @babel/loader
@babel/loader中es6转换为es5实际上也是使用@babel/core的transform方法来进行代码转换的。

### @babel/preset-env——智能的preset
@babel/preset-env是一个智能的babel预设, 让你能使用最新的JavaScript语法, 它会帮你转换成代码的目标运行环境支持的语法, 提升你的开发效率并让打包后的代码体积更小
 

