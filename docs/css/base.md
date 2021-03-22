##  @规则
CSS 规则是样式表的主体，通常样式表会包括大量的规则列表。但有时候也需要在样式表中包括其他的一些信息，比如字符集，导入其它的外部样式表，字体等，这些需要专门的语句表示。

而 @规则 就是这样的语句。CSS 里包含了以下 @规则：
- @namespace 告诉 CSS 引擎必须考虑XML命名空间。
- @media, 如果满足媒体查询的条件则条件规则组里的规则生效。
- @page, 描述打印文档时布局的变化.
- @font-face, 描述将下载的外部的字体。
- @keyframes, 描述 CSS 动画的关键帧。
- @document, 如果文档样式表满足给定条件则条件规则组里的规则生效。 (推延至 CSS Level 4 规范)
除了以上这几个之外，下面还将对几个比较生涩的 @规则 进行介绍。
### @charset
 @charset 用于定义样式表使用的字符集。它必须是样式表中的第一个元素。如果有多个 @charset 被声明，只有第一个会被使用，而且不能在HTML元素或HTML页面的 <style> 元素内使用。

注意：值必须是双引号包裹，且和
```js
@charset "UTF-8";
```
某个样式表文件到底用的是什么字符编码，浏览器有一套识别顺序（优先级由高到低）：
- 文件开头的 Byte order mark 字符值，不过一般编辑器并不能看到文件头里的 BOM 值；
- HTTP 响应头里的 content-type 字段包含的 charset 所指定的值，比如：
```js
Content-Type: text/css; charset=utf-8
```
- CSS 文件头里定义的 @charset 规则里指定的字符编码；
- <link> 标签里的 charset 属性，该条已在 HTML5 中废除；
- 默认是 UTF-8。
### @import
@import 用于告诉 CSS 引擎引入一个外部样式表。

link 和 @import 都能导入一个样式文件，它们有什么区别嘛？
- link 是 HTML 标签，除了能导入 CSS 外，还能导入别的资源，比如图片、脚本和字体等；而 @import 是 CSS 的语法，只能用来导入 CSS；
- link 导入的样式会在页面加载时同时加载，@import 导入的样式需等页面加载完成后再加载；
- link 没有兼容性问题，@import 不兼容 ie5 以下；
- link 可以通过 JS 操作 DOM 动态引入样式表改变样式，而@import不可以。
### @supports
 @supports 用于查询特定的 CSS 是否生效，可以结合 not、and 和 or 操作符进行后续的操作
 ```js
 /* 如果支持自定义属性，则把 body 颜色设置为变量 varName 指定的颜色 */
@supports (--foo: green) {
    body {
        color: var(--varName);
    }
}
```
## 层叠性
是 CSS 中的核心特性之一，用于合并来自多个源的属性值的算法。比如说针对某个 HTML 标签，有许多的 CSS 声明都能作用到的时候，那最后谁应该起作用呢？层叠性说的大概就是这个。


## 选择器
CSS 选择器无疑是其核心之一，对于基础选择器以及一些常用伪类必须掌握。下面列出了常用的选择器
### 基础选择器
- 标签选择器：h1
- 类选择器：.checked
- ID 选择器：#picker
- 通配选择器：*
### 属性选择器
- [attr]：指定属性的元素；
- [attr=val]：属性等于指定值的元素；
- [attr*=val]：属性包含指定值的元素；
- [attr^=val]	：属性以指定值开头的元素；
- [attr$=val]：属性以指定值结尾的元素；
- [attr~=val]：属性包含指定值(完整单词)的元素(不推荐使用)；
- [attr|=val]：属性以指定值(完整单词)开头的元素(不推荐使用)；
### 组合选择器
- 相邻兄弟选择器：A + B
- 普通兄弟选择器：A ~ B
- 子选择器：A > B
- 后代选择器：A B
### 伪类
#### 条件伪类
- :lang()：基于元素语言来匹配页面元素；
- :dir()：匹配特定文字书写方向的元素；
- :has()：匹配包含指定元素的元素；
- :is()：匹配指定选择器列表里的元素；
- :not()：用来匹配不符合一组选择器的元素；
#### 行为伪类
- :active：鼠标激活的元素；
- :hover： 鼠标悬浮的元素；
- ::selection：鼠标选中的元素；
#### 状态伪类
- :target：当前锚点的元素；
- :link：未访问的链接元素；
- :visited：已访问的链接元素；
- :focus：输入聚焦的表单元素；
- :required：输入必填的表单元素；
- :valid：输入合法的表单元素；
- :invalid：输入非法的表单元素；
- :in-range：输入范围以内的表单元素；
- :out-of-range：输入范围以外的表单元素；
- :checked：选项选中的表单元素；
- :optional：选项可选的表单元素；
- :enabled：事件启用的表单元素；
- :disabled：事件禁用的表单元素；
- :read-only：只读的表单元素；
- :read-write：可读可写的表单元素；
- :blank：输入为空的表单元素；
- :current()：浏览中的元素；
- :past()：已浏览的元素；
- :future()：未浏览的元素；
#### 结构伪类
- :root：文档的根元素；
- :empty：无子元素的元素；
- :first-letter：元素的首字母；
- :first-line：元素的首行；
- :nth-child(n)：元素中指定顺序索引的元素；
- :nth-last-child(n)：元素中指定逆序索引的元素；；
- :first-child	：元素中为首的元素；
- :last-child	：元素中为尾的元素；
- :only-child：父元素仅有该元素的元素；
- :nth-of-type(n)	：标签中指定顺序索引的标签；
- :nth-last-of-type(n)：标签中指定逆序索引的标签；
- :first-of-type	：标签中为首的标签；
- :last-of-type：标签中为尾标签；
- :only-of-type：父元素仅有该标签的标签；
### 伪元素
- ::before：在元素前插入内容；
- ::after：在元素后插入内容；
## 优先级
优先级就是分配给指定的 CSS 声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。为了记忆，可以把权重分成如下几个等级，数值越大的权重越高：
- 10000：!important；
- 01000：内联样式；
- 00100：ID 选择器；
- 00010：类选择器、伪类选择器、属性选择器；
- 00001：元素选择器、伪元素选择器；
- 00000：通配选择器、后代选择器、兄弟选择器；
可以看到内联样式（通过元素中 style 属性定义的样式）的优先级大于任何选择器；而给属性值加上 !important 又可以把优先级提至最高，就是因为它的优先级最高，所以需要谨慎使用它，以下有些使用注意事项：
- 一定要优先考虑使用样式规则的优先级来解决问题而不是 !important；
- 只有在需要覆盖全站或外部 CSS 的特定页面中使用 !important；
- 永远不要在你的插件中使用 !important；
- 永远不要在全站范围的 CSS 代码中使用 !important；
 
## 继承性
在 CSS 中有一个很重要的特性就是子元素会继承父元素对应属性计算后的值。比如页面根元素 html 的文本颜色默认是黑色的，页面中的所有其他元素都将继承这个颜色，当申明了如下样式后，H1 文本将变成橙色。
```js
body {
    color: orange;
}
h1 {
    color: inherit;
}
```
CSS 属性很多，但并不是所有的属性默认都是能继承父元素对应属性的，那哪些属性存在默认继承的行为呢？一定是那些不会影响到页面布局的属性，可以分为如下几类：
- 字体相关：font-family、font-style、font-size、font-weight 等；
- 文本相关：text-align、text-indent、text-decoration、text-shadow、letter-spacing、word-spacing、white-space、line-height、color 等；
- 列表相关：list-style、list-style-image、list-style-type、list-style-position 等；
- 其他属性：visibility、cursor 等；
对于其他默认不继承的属性也可以通过以下几个属性值来控制继承行为：
- inherit：继承父元素对应属性的计算值；
- initial：应用该属性的默认值，比如 color 的默认值是 #000；
- unset：如果属性是默认可以继承的，则取 inherit 的效果，否则同 initial；
- revert：效果等同于 unset，兼容性差。
## 文档流
在 CSS 的世界中，会把内容按照从左到右、从上到下的顺序进行排列显示。正常情况下会把页面分割成一行一行的显示，而每行又可能由多列组成，所以从视觉上看起来就是从上到下从左到右，而这就是 CSS 中的流式布局，又叫文档流。文档流就像水一样，能够自适应所在的容器，一般它有如下几个特性：
- 块级元素默认会占满整行，所以多个块级盒子之间是从上到下排列的；
- 内联元素默认会在一行里一列一列的排布，当一行放不下的时候，会自动切换到下一行继续按照列排布；

### 脱离文档流
脱流文档流指节点脱流正常文档流后，在正常文档流中的其他节点将忽略该节点并填补其原先空间。文档一旦脱流，计算其父节点高度时不会将其高度纳入，脱流节点不占据空间。有两种方式可以让元素脱离文档流：浮动和定位。
- 使用浮动（float）会将元素脱离文档流，移动到容器左/右侧边界或者是另一个浮动元素旁边，该浮动元素之前占用的空间将被别的元素填补，另外浮动之后所占用的区域不会和别的元素之间发生重叠；
- 使用绝对定位（position: absolute;）或者固定定位（position: fixed;）也会使得元素脱离文档流，且空出来的位置将自动被后续节点填补。

## 盒模型
在 CSS 中任何元素都可以看成是一个盒子，而一个盒子是由 4 部分组成的：内容（content）、内边距（padding）、边框（border）和外边距（margin）。

盒模型有 2 种：标准盒模型和 IE 盒模型，本别是由 W3C 和 IExplore 制定的标准。

标准盒模型认为：盒子的实际尺寸 = 内容（设置的宽/高） + 内边距 + 边框
 ![](~@/css/box1.jpg)
所以 .box 元素内容的宽度就为 200px，而实际的宽度则是 width + padding-left + padding-right + border-left-width + border-right-width = 200 + 10 + 10 + 1 + 1 = 222。

IE 盒模型认为：盒子的实际尺寸 = 设置的宽/高 = 内容 + 内边距 + 边框
 ![](~@/css/box2.jpg)
.box 元素所占用的实际宽度为 200px，而内容的真实宽度则是 width - padding-left - padding-right - border-left-width - border-right-width = 200 - 10 - 10 - 1 - 1 = 178。

现在高版本的浏览器基本上默认都是使用标准盒模型，而像 IE6 这种老古董才是默认使用 IE 盒模型的。

在 CSS3 中新增了一个属性 box-sizing，允许开发者来指定盒子使用什么标准，它有 2 个值：
- content-box：标准盒模型；
- border-box：IE 盒模型；

## 值和单位
CSS 的声明是由属性和值组成的，而值的类型有许多种：
- 数值：长度值 ，用于指定例如元素 width、border-width、font-size 等属性的值；
- 百分比：可以用于指定尺寸或长度，例如取决于父容器的 width、height 或默认的 font-size；
- 颜色：用于指定 background-color、color 等；
- 坐标位置：以屏幕的左上角为坐标原点定位元素的位置，比如常见的 background-position、top、right、bottom 和 left 等属性；
- 函数：用于指定资源路径或背景图片的渐变，比如 url()、linear-gradient() 等；

而还有些值是需要带单位的，比如 width: 100px，这里的 px 就是表示长度的单位，长度单位除了 px 外，比较常用的还有 em、rem、vw/vh 等。那他们有什么区别呢？又应该在什么时候使用它们呢？

### px
而 px 表示的是 CSS 中的像素，在 CSS 中它是绝对的长度单位，也是最基础的单位，其他长度单位会自动被浏览器换算成 px。但是对于设备而言，它其实又是相对的长度单位，比如宽高都为 2px，在正常的屏幕下，其实就是 4 个像素点，而在设备像素比(devicePixelRatio) 为 2 的 Retina 屏幕下，它就有 16 个像素点。所以屏幕尺寸一致的情况下，屏幕分辨率越高，显示效果就越细腻。

### em
em 是 CSS 中的相对长度单位中的一个。居然是相对的，那它到底是相对的谁呢？它有 2 层意思：
- 在 font-size 中使用是相对于父元素的 font-size 大小，比如父元素 font-size: 16px，当给子元素指定 font-size: 2em 的时候，经过计算后它的字体大小会是 32px；
- 在其他属性中使用是相对于自身的字体大小，如 width/height/padding/margin 等；

我们都知道每个浏览器都会给 HTML 根元素 html 设置一个默认的 font-size，而这个值通常是 16px。这也就是为什么 1em = 16px 的原因所在了。

em 在计算的时候是会层层计算的，比如
```js
<div>
    <p></p>
</div>

div { font-size: 2em; }
p { font-size: 2em; }
```
对于如上一个结构的 HTML，由于根元素 html 的字体大小是 16px，所以 p 标签最终计算出来后的字体大小会是 16 * 2 * 2 = 64px

### rem
rem(root em) 和 em 一样，也是一个相对长度单位，不过 rem 相对的是 HTML 的根元素 html。

rem 由于是基于 html 的 font-size 来计算，所以通常用于自适应网站或者 H5 中。

比如在做 H5 的时候，前端通常会让 UI 给 750px 宽的设计图，而在开发的时候可以基于 iPhone X 的尺寸 375px * 812px 来写页面，这样一来的话，就可以用下面的 JS 依据当前页面的视口宽度自动计算出根元素 html 的基准 font-size 是多少。
```js
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        psdWidth = 750,  // 设计图宽度
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if ( !clientWidth ) return;
            if ( clientWidth >= 640 ) {
                docEl.style.fontSize = 200 * ( 640 / psdWidth ) + 'px';
            } else {
                docEl.style.fontSize = 200 * ( clientWidth / psdWidth ) + 'px';
            }
        };

    if ( !doc.addEventListener ) return;
    // 绑定事件的时候最好配合防抖函数
    win.addEventListener( resizeEvt, debounce(recalc, 1000), false );
    doc.addEventListener( 'DOMContentLoaded', recalc, false );
    
    function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timeout)
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
})(document, window);
```
比如当视口是 375px 的时候，经过计算 html 的 font-size 会是 100px，这样有什么好处呢？好处就是方便写样式，比如从设计图量出来的 header 高度是 50px 的，那我们写样式的时候就可以直接写：
```js
header {
    height: 0.5rem;
}
```
### vw/vh
vw 和 vh 分别是相对于屏幕视口宽度和高度而言的长度单位：
- 1vw = 视口宽度均分成 100 份中 1 份的长度；
- 1vh = 视口高度均分成 100 份中 1 份的长度；
在 JS 中 100vw = window.innerWidth，100vh = window.innerHeight。

vw/vh 的出现使得多了一种写自适应布局的方案，开发者不再局限于 rem 了。

相对视口的单位，除了 vw/vh 外，还有 vmin 和 vmax：
- vmin：取 vw 和 vh 中值较小的；
- vmax：取 vw 和 vh 中值较大的；

## 颜色体系
### 颜色关键字
颜色关键字（color keywords）是不区分大小写的标识符，它表示一个具体的颜色，比如 white（白），黑（black）等；

可接受的关键字列表在CSS的演变过程中发生了改变：
- CSS 标准 1 只接受 16 个基本颜色，称为 VGA 颜色，因为它们来源于 VGA 显卡所显示的颜色集合而被称为 VGA colors （视频图形阵列色彩）。
- CSS 标准 2 增加了 orange 关键字。
- 从一开始，浏览器接受其它的颜色，由于一些早期浏览器是 X11 应用程序，这些颜色大多数是 X11 命名的颜色列表，虽然有一点不同。SVG 1.0 是首个正式定义这些关键字的标准；CSS 色彩标准 3 也正式定义了这些关键字。它们经常被称作扩展的颜色关键字， X11 颜色或 SVG 颜色 。
- CSS 颜色标准 4 添加可 rebeccapurple 关键字来纪念 web 先锋 Eric Meyer。

### transparent 关键字
transparent 关键字表示一个完全透明的颜色，即该颜色看上去将是背景色。从技术上说，它是带有 alpha 通道为最小值的黑色，是 rgba(0,0,0,0) 的简写。
#### 实现三角形
下面这个图是用 4 条边框填充的正方形，看懂了它你大概就知道该如何用 CSS 写三角形了。
 ![](~@/css/sanjiao.jpg)
```js
div {
    border-top-color: #ffc107;
    border-right-color: #00bcd4;
    border-bottom-color: #e26b6b;
    border-left-color: #cc7cda;
    border-width: 50px;
    border-style: solid;
}
```
用 transparent 实现三角形的原理：
- 首先宽高必须是 0px，通过边框的粗细来填充内容；
- 那条边需要就要加上颜色，而不需要的边则用 transparent；
- 想要什么样姿势的三角形，完全由上下左右 4 条边的中有颜色的边和透明的边的位置决定；
- 等腰三角形：设置一条边有颜色，然后紧挨着的 2 边是透明，且宽度是有颜色边的一半；直角三角形：设置一条边有颜色，然后紧挨着的任何一边透明即可。
#### 增大点击区域
常常在移动端的时候点击的按钮的区域特别小，但是由于现实效果又不太好把它做大，所以常用的一个手段就是通过透明的边框来增大按钮的点击区域：
```js
.btn {
    border: 5px solid transparent;
}
```
### currentColor 关键字
currentColor 会取当前元素继承父级元素的文本颜色值或声明的文本颜色值，即 computed 后的 color 值。

比如，对于如下 CSS，该元素的边框颜色会是 red：
```js
.btn {
    color: red;
    border: 1px solid currentColor;
}
```
### RGB[A] 颜色
RGB[A] 颜色是由 R(red)-G(green)-B(blue)-A(alpha) 组成的色彩空间。
#### 十六进制符号
RGB 中的每种颜色的值范围是 00~ff，值越大表示颜色越深。所以一个颜色正常是 6 个十六进制字符加上 # 组成，比如红色就是 #ff0000。

如果 RGB 颜色需要加上不透明度，那就需要加上 alpha 通道的值，它的范围也是 00~ff，比如一个带不透明度为 67% 的红色可以这样写 #ff0000aa。

使用十六进制符号表示颜色的时候，都是用 2 个十六进制表示一个颜色，如果这 2 个字符相同，还可以缩减成只写 1 个，比如，红色 #f00；带 67% 不透明度的红色 #f00a。

#### 函数符
当 RGB 用函数表示的时候，每个值的范围是 0~255 或者 0%~100%，所以红色是 rgb(255, 0, 0)， 或者 rgb(100%, 0, 0)。
如果需要使用函数来表示带不透明度的颜色值，值的范围是 0~1 及其之间的小数或者 0%~100%，比如带 67% 不透明度的红色是 rgba(255, 0, 0, 0.67) 或者 rgba(100%, 0%, 0%, 67%)
```js
需要注意的是 RGB 这 3 个颜色值需要保持一致的写法，要嘛用数字要嘛用百分比，而不透明度的值的可以不用和 RGB 保持一致写法。比如 rgb(100%, 0, 0) 这个写法是无效的；而 rgb(100%, 0%, 0%, 0.67) 是有效的。
```
### HSL[A] 颜色
HSL[A] 颜色是由色相(hue)-饱和度(saturation)-亮度(lightness)-不透明度组成的颜色体系。
- 色相（H）是色彩的基本属性，值范围是 0360 或者 0deg360deg， 0 (或 360) 为红色, 120 为绿色, 240 为蓝色；
- 饱和度（S）是指色彩的纯度，越高色彩越纯，低则逐渐变灰，取 0~100% 的数值；0% 为灰色， 100% 全色；
- 亮度（L），取 0~100%，0% 为暗，100% 为白；
- 不透明度（A），取 0100%，或者01及之间的小数；
给一个按钮设置不透明度为 67% 的红色的 color 的写法，以下全部写法效果一致：
```js
button {
    color: #ff0000aa;
    color: #f00a;
    color: rgba(255, 0, 0, 0.67);
    color: rgb(100% 0% 0% / 67%);
    color: hsla(0, 100%, 50%, 67%);
    color: hsl(0deg 100% 50% / 67%);
}
```


















