### 减少HTTP请求
减少页面的HTTP请求数是个起点，这是提升站点首次访问速度的重要指导原则，小字当先。

#### 合并css和js文件
合并css和js文件，合并文件大小之后，大文件gizp之后不能超过33kb（不是一股脑的打包成一个），文件数量要适量。

#### CSS Sprites
是减少图片请求数量的首选方式。把背景图片都整合到一张图片中,然后用CSS的 background-image 和 background-position 属性来定位要显示的部分。

#### 行内图片(Base64编码)
用 data: URL模式 来把图片嵌入页面。这样会增加HTML文件的大小,把行内图片放在(缓存的)样式表中是个好办法,而且成功避免了页面变“重”。但目前主流浏览器并不能很好地支持行内图片。

#### 配置多个域名和CDN加速
通常浏览器对于一个域名的并发请求是有限的，比如：有100个文件要加载，但浏览器一次只可能并发请求10个文件，这样并发多次就会耗时。因此配置多个域名能够最大限度的增加并发请求量。

但这里有个缺点就是会增加浏览器域名解析的次数，这里建议利用CDN来加载不是经常更新和修改的静态资源（图片，css库，js第三方库等等）。一个是CDN域名一般都会缓存到本地中，另一个是CDN网络请求速度是非常快的。

### 缓存策略
缓存资源是最立竿见影的手段，通过在请求头设置缓存属性，下次再次访问可以直接从本地获取资源，减少了不必要的数据传输，节省带宽、减少服务器的负担，提升网站性能、加快了客户端加载网页的速度。
关于强缓存和协商缓存的内容。

缓存的优先级：cache-control > expires > Etag > last-modified

在第一次请求时，浏览器会检查是否有缓存设置，记入内存，下次请求，服务器判断返回304从缓存取，200会从服务器取。

#### cache-control
设置过期时间长度（秒），在这个时间范围内，浏览器就会直接读取缓存，当expires和cache-control都存在时，cache-control的优先级更大。

#### expires
在http头中设置一个过期时间，这个过期时间之前，浏览器请求不会发出，从缓存中读取文件，除非缓存被清空，或者强制刷新，缺陷在于服务器时间和客户端的时间可能不一致，所有http1.1引入了cache-control来改进。
#### etag
服务器返回资源时，如果头部有etag，资源在下次请求时会把值自动加到请求头if-none-match中，服务器可以对比这个值，确定资源是否发生变化，如果没有变化返回304。
####  last-modified
服务器返回资源时，如果头部有last-modified，资源请求时机会把值加入到if-modified-since中，服务器可以对比这个值，确定资源是否发生变化返回304。

### 传输加载优化

#### 启动gzip
在nginx中配置gzip: on
#### Keep-Alive
在http请求头中加入Connection: keep-alive来告诉对方这个请求响应完成后不要关闭，下一次咱们还用这个请求继续交流.

Keep-Alive 在Http1.1 默认是开启的,可以在 Response Header 中可以看到 Connection: keep-alive。

在nginx 配置中有两个比较重要的配置
```js
keepalive_timeout 65  // 保持连接的时间，也叫超时时间，单位秒
keepalive_request 100 // 最大连接上限 
```
浏览器请求//xx.cn/a.js-->解析域名—>HTTP连接—>服务器处理文件—>返回数据-->浏览器解析、渲染文件。Keep-Alive解决的核心问题就在此，一定时间内，同一域名多次请求数据，只建立一次HTTP请求，其他请求可复用每一次建立的连接通道，以达到提高请求效率的问题。一定时间是可以配置的，

HTTP1.1还是存在效率问题
- 串行的文件传输
- 连接数过多
HTTP/2对同一域名下所有请求都是基于流，也就是说同一域名不管访问多少文件，也只建立一路连接。同样Apache的最大连接数为300，因为有了这个新特性，最大的并发就可以提升到300，比原来提升了60倍!

### 懒加载
在可视化的窗口中才去加载图片,大大提高首次的渲染速度! 原生支持加loading属性需要浏览器支持

第三方插件

- lazyload (opens new window)
- react-lazyload(opens new window)
### 渲染中性能优化
GUI线程和js线程是互斥的
重排和重绘很消耗性能
#### 把样式表放在顶部，js文件放在底部
雅虎军规规定，样式表放在顶部，js文件放在底部，这样做的意义是为了二位爷不要打架，和谐执行。
#### 减少重排和重绘
chrome DevTools可以检测到页面渲染的性能分析 我们用keyframes。来实现一个动画效果。
```html
<div class="container">
  <div class="ball" id="ball"></div>
</div>

@keyframes run-around {
  0% {
    top: 0;
    left: 0;
  }
  25% {
    top: 0;
    left: 200px;
  }
  50% {
    top: 200px;
    left: 200px;
  }
  75% {
    top: 200px;
    left: 0;
  }
}
```
##### 重排

所谓重排，实际上是根据渲染树中每个渲染对象的信息，计算出各自渲染对象的几何信息（DOM对象的位置和尺寸大小），并将其安置在界面中的正确位置。

由于浏览器渲染界面是基于流式布局模型的，也就是某一个DOM节点信息更改了，就需要对DOM结构进行重新计算，重新布局界面，再次引发回流，只是这个结构更改程度会决定周边DOM更改范围，即全局范围和局部范围，全局范围就是从根节点html开始对整个渲染树进行重新布局，例如当我们改变了窗口尺寸或方向或者是修改了根元素的尺寸或者字体大小等；而局部布局可以是对渲染树的某部分或某一个渲染对象进行重新布局。

在此，总结会引起重排的操作有：
- 页面首次渲染。
- 浏览器窗口大小发生改变。
- 元素尺寸或位置发生改变。
- 元素内容变化（文字数量或图片大小等等）。
- 元素字体大小变化。
- 添加或者删除可见的DOM元素。
- 激活CSS伪类（例如：:hover）。
- 设置style属性
- 查询某些属性或调用某些方法。

| 常见引起重排属性和方法 | -------------------- | ---- |
| ------------------------- | -------------------- | ---- |
| width | height|  margin | 
| padding | display | border | 
| position | overflow | clientWidth | 
| clientHeight | clientTop | clientLeft | 
| offsetWidth | offsetHeight | offsetTop | 
| offsetLeft | scrollWidth | scrollHeight | 
| scrollTop | scrollLeft | scrollIntoView() | 
| scrollTo() | getComputedStyle() | getBoundingClientRect() | 
| scrollIntoViewIfNeeded()|  

重排也叫回流，实际上，reflow的字面意思也是回流，之所以有的叫做重排，也许是因为重排更好理解，更符合中国人的思维。标准文档之所以叫做回流（Reflow）,是因为浏览器渲染是基于“流式布局”的模型，流实际就使我们常说的文档流，当dom或者css几何属性发生改变的时候，文档流会受到波动联动的去更改，流就好比一条河里的水，回流就好比向河里扔了一块石头，激起涟漪，然后引起周边水流受到波及，所以叫做回流，这样理解似乎更标准更规范，不过叫什么并不重要，重要的是我们真正理解了这个过程便好。
 
##### 重绘（Repainting）

 相比重排，重绘就简单多了，所谓重绘，就是当页面中元素样式的改变并不影响它在文档流中的位置时，例如更改了字体颜色,浏览器会将新样式赋予给元素并重新绘制的过程称。

 
| 常见引起浏览器绘制过程的属性包含： | -------------------- | ---- |
| ------------------------- | -------------------- | ---- |	 
| color	| border-style	| visibility	| 
| background | text-decoration	| background-image	| 
| background-position	| background-repeat | outline-color	| 
| outline	| outline-style	| border-radius| 
| outline-width	| box-shadow	| background-size| 


#### requestAnimationFrame
动画操作,可以使用 requestAnimationFrame 要求浏览器在下次重绘之前调用指定的回调函数更新动画，可以达到和浏览器同步刷新，以避免不必要的开销。

### 雅虎军规
雅虎公司制定了8个部分，35条性能优化准则，本文部分取自军规详细展开，详情可以查看`参考链接`。
### 页面加载性能指标







###

 


 













































