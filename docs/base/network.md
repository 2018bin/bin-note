---
title: 条件类型
author: 冴羽
date: '2021-12-12'
---

## 从输入URL开始解析


### **解析URL**
 
URL 主要由 协议、主机、端口、路径、查询参数、锚点6部分组成

 ![](~@/url.png)

输入URL后，看看输入的内容是否符合 URL 规则，浏览器会解析出协议、主机/域名、端口、路径等信息，并构造一个HTTP请求。
- 浏览器发送请求前，根据请求头的expires和cache-control判断是否命中（包括是否过期）强缓存策略，如果命中，直接从缓存获取资源，并不会发送请求。如果没有命中，则进入下一步。
- 没有命中强缓存规则，浏览器会发送请求，根据请求头的If-Modified-Since和If-None-Match判断是否命中协商缓存，如果命中，直接从缓存获取资源。如果没有命中，则进入下一步。
- 如果前两步都没有命中，则直接从服务端获取资源。
- encodeURI、decodeURI可以对中文、空格等编码解码，适用于 URL 本身
- encodeURIComponent、decodeURIComponent范围更广，会编码解码一些特殊字符如 :/?=+@#$,适用于给参数编码解码

###  **浏览器缓存（缓存检查）**
URL 符合规则，浏览器进程会通过进程通信将 URL 请求发送给网络进程，网络进程会依次查找 Memory Cache、Disk Cache中是否有缓存内容，有且没过期则使用，否则则发送网络请求。
-   **强缓存：**
  强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程。强缓存又分为两种Expires和Cache-Control
    - ***Expires***
        1. 版本：HTTP/1.0
        2. 来源：存在于服务端返回的响应头中
        3. 语法：Expires: Wed, 22 Nov 2019 08:41:00 GMT
        4. 缺点：服务器的时间和浏览器的时间可能并不一致导致失效
    - ***Cache-Control***
        1. 版本：HTTP/1.1
        2. 来源：响应头和请求头
        3. 语法：Cache-Control:max-age=3600
        4. 缺点：时间最终还是会失效
-   **协商缓存：**
  协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程。

###  **DNS域名解析**
在发起http请求之前，浏览器首先要做去获得我们想访问网页的IP地址，浏览器会发送一个UDP的包给DNS域名解析服务器。
网络请求第一步就是先进行 DNS 解析，获取请求域名服务器的 IP 地址
域名解析是一个递归查询 + 迭代查询的过程
1. 浏览器缓存，向浏览器的缓存中读取上一次的访问记录
2. 操作系统的缓存，查找存储在系统运行内存中的缓存
3. 在 host 文件中查找
4. 路由器缓存：有些路由器会把访问过的域名存在路由器上
5. ISP互联网服务提供商缓存，比如 114.114.114.114，
6. 缓存中找不到，则本地 DNS 服务器进行迭代查询：. 根 DNS 服务器 -> .com 顶级服务器 -> 主域名服务器 -> ...，直到服务器返回对应的 IP

-  **递归查询：**
我们的浏览器、操作系统、路由器都会缓存一些URL对应的IP地址，统称为DNS高速缓存。这是为了加快DNS解析速度，使得不必每次都到根域名服务器中去查询。
-  **迭代查询：**
迭代查询的方式就是，局部的DNS服务器并不会自己向其他服务器进行查询，而是把能够解析该域名的服务器IP地址返回给客户端，客户端会不断的向这些服务器进行查询，直到查询到了位置，迭代的话只会帮你找到相关的服务器，然后说我现在比较忙，你自己去找吧。
-  **DNS负载均衡：**
网站对应的 IP 不止一个，DNS 可以根据每台机器的负载量、距离用户的距离等返回一个合适的服务器 IP 给用户，这个过程就是 DNS 负载均衡，又叫做 DNS 重定向。 CDN 就是利用 DNS 的重定向技术， DNS 会返回一个用户最接近的点的 IP 给用户
-  **DNS预解析：**
大型网站，有多个不同服务器资源的情况下，都可采取DNS预解析，提前解析，减少页面卡顿。
 
###  **TCP 连接三次握手**
拿到 IP 后，(检查当前域名是否达到 TCP 连接上限)，通过三次握手进行 TCP 连接
[连接三次握手](./network.html#三次握手)
###  **HTTP请求**
TCP 连接建立之后，浏览器端会构建请求行、 请求头等信息，并把和该域名相关的 Cookie 等数据附加到请求头中，然后向服务器发送构建的请求信息。如果是 HTTPS，还需要进行 TSL 协商。
###  **TCP 四次挥手**
[四次挥手](./network.html#四次挥手)
###  **客户端解析资源**
- 浏览器拿到资源会根据资源类型进行处理，比如是 gzip 压缩后的文件则进行解压缩，如果响应头 Content-type 为 text/html，则开始解析 HTML
HTML Parser 对 HTML 文件进行处理，根据 HTML 标记关系构建 DOM 树。
   - 解析过程中遇到图片、link、script会启动下载。
   - script标签会阻塞 DOM 树的构建，所以一般将 script 放在底部，或者添加 async 、defer 标识。
   - css 下载时异步，不会阻塞浏览器构建 DOM 树，但是会阻塞渲染，在构建布局树时，会等待 css 下载解析完毕后才进行。
- 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，转换样式表中的属性使其标准化em => px; bold => 700。
- 根据 DOM 树和 styleSheets 构建布局树，计算出元素的布局信息，display: none不可见节点以及 head 这种不可见标签不会插入到布局树里
   - 构建 DOM 树、构建 CSSOM 树、构建树并不是严格的先后顺序，为了让用户能尽快看到网页内容，都是并行推进的
- 对布局树进行分层，生成图层树。
   - position: fixed/absolute、z-index:2、filter: blue(5px)、opacity: .5等拥有层叠上下文属性的元素会进行分层、或者内容需要裁减
- 绘制图层需要一个个绘制指令，渲染线程将包含绘制指令的绘制列表提交给合成线程，绘制操作是由合成线程来完成的
- 合成线程将图层划分为一个个图块，优先处理靠近视口的图块，对其进行栅格化处理生成位图
   - 通常，栅格化过程会采用 GPU 加速生成，渲染进程把生成图块的指令发送给 GPU 进程，GPU 生成最终的位图并保存在内存之中
- 一旦所有图块都被光栅化，合成线程向浏览器进程提交一个绘制图块的命令，将其内容绘制到内存之中，最后显示在屏幕上

###  **参考链接**
- [全面解析URL请求到页面显示完整过程](https://juejin.cn/post/6939170194367447053)
- [从输入URL开始建立前端知识体系](https://juejin.cn/post/6935232082482298911)

## HTTP 缓存 
HTTP 缓存又分为强缓存和协商缓存：
- 首先通过 Cache-Control 验证强缓存是否可用，如果强缓存可用，那么直接读取缓存
- 如果不可以，那么进入协商缓存阶段，发起 HTTP 请求，服务器通过请求头中是否带上 If-Modified-Since 和 If-None-Match 这些条件请求字段检查资源是否更新：

· 若资源更新，那么返回资源和 200 状态码
· 如果资源未更新，那么告诉浏览器直接使用缓存获取资源

## HTTP 常用的状态码及使用场景

- 1xx：表示目前是协议的中间状态，还需要后续请求
- 2xx：表示请求成功
- 3xx：表示重定向状态，需要重新请求
- 4xx：表示请求报文错误
- 5xx：服务器端错误

常用状态码：
- 101 切换请求协议，从 HTTP 切换到 WebSocket
- 200 请求成功，有响应体
- 301 永久重定向：会缓存
- 302 临时重定向：不会缓存
- 304 协商缓存命中
- 403 服务器禁止访问
- 404 资源未找到
- 400 请求错误
- 500 服务器端错误
- 503 服务器繁忙
 
而 302 表示临时重定向，这个资源只是暂时不能被访问了，但是之后过一段时间还是可以继续访问，一般是访问某个网站的资源需要权限时，会需要用户去登录，跳转到登录页面之后登录之后，还可以继续访问。

301 类似，都会跳转到一个新的网站，但是 301 代表访问的地址的资源被永久移除了，以后都不应该访问这个地址，搜索引擎抓取的时候也会用新的地址替换这个老的。可以在返回的响应的 location 首部去获取到返回的地址
 
## HTTP 常用的请求方式，区别和用途
http/1.1 规定如下请求方法：

- GET：通用获取数据
- HEAD：获取资源的元信息
- POST：提交数据
- PUT：修改数据
- DELETE：删除数据
- CONNECT：建立连接隧道，用于代理服务器
- OPTIONS：列出可对资源实行的请求方法，常用于跨域
- TRACE：追踪请求-响应的传输路径

 ## 计算机网络
 应用层、表示层、会话层、传输层、网络层、数据链路层、物理层

 ## HTTPS 是什么？具体流程
 HTTPS 是在 HTTP 和 TCP 之间建立了一个安全层，HTTP 与 TCP 通信的时候，必须先进过一个安全层，对数据包进行加密，然后将加密后的数据包传送给 TCP，相应的 TCP 必须将数据包解密，才能传给上面的 HTTP。

浏览器传输一个 client_random 和加密方法列表，服务器收到后，传给浏览器一个 server_random、加密方法列表和数字证书（包含了公钥），然后浏览器对数字证书进行合法验证，如果验证通过，则生成一个 pre_random，然后用公钥加密传给服务器，服务器用 client_random、server_random 和 pre_random ，使用公钥加密生成 secret，然后之后的传输使用这个 secret 作为秘钥来进行数据的加解密。

 ## 三次握手和四次挥手

### 三次握手
为什么要进行三次握手：为了确认对方的发送和接收能力。

三次握手主要流程：
- 一开始双方处于 CLOSED 状态，然后服务端开始监听某个端口进入 LISTEN 状态
- 然后客户端主动发起连接，发送 SYN，然后自己变为 SYN-SENT，seq = x
- 服务端收到之后，返回 SYN seq = y 和 ACK ack = x + 1（对于客户端发来的 SYN），自己变成 SYN-REVD
- 之后客户端再次发送 ACK seq = x + 1, ack = y + 1给服务端，自己变成 EASTABLISHED 状态，服务端收到 ACK，也进入 ESTABLISHED
SYN 需要对端确认，所以 ACK 的序列化要加一，凡是需要对端确认的，一点要消耗 TCP 报文的序列化
#### 为什么不是两次？
无法确认客户端的接收能力。

如果首先客户端发送了 SYN 报文，但是滞留在网络中，TCP 以为丢包了，然后重传，两次握手建立了连接。

等到客户端关闭连接了。但是之后这个包如果到达了服务端，那么服务端接收到了，然后发送相应的数据表，就建立了链接，但是此时客户端已经关闭连接了，所以带来了链接资源的浪费

 ### 四次挥手

- 一开始都处于 ESTABLISH 状态，然后客户端发送 FIN 报文，带上 seq = p，状态变为 FIN-WAIT-1
- 服务端收到之后，发送 ACK 确认，ack = p + 1，然后进入 CLOSE-WAIT 状态
- 客户端收到之后进入 FIN-WAIT-2  状态
- 过了一会等数据处理完，再次发送 FIN、ACK，seq = q，ack = p + 1，进入 LAST-ACK 阶段
- 客户端收到 FIN 之后，客户端收到之后进入 TIME_WAIT（等待 2MSL），然后发送 ACK 给服务端 ack = 1 + 1
- 服务端收到之后进入 CLOSED 状态

客户端这个时候还需要等待两次 MSL 之后，如果没有收到服务端的重发请求，就表明 ACK 成功到达，挥手结束，客户端变为 CLOSED 状态，否则进行 ACK 重发

#### 为什么需要等待 2MSL（Maximum Segement Lifetime）：
因为如果不等待的话，如果服务端还有很多数据包要给客户端发，且此时客户端端口被新应用占据，那么就会接收到无用的数据包，造成数据包混乱，所以说最保险的方法就是等服务器发来的数据包都死翘翘了再启动新应用。

- 1个 MSL 保证四次挥手中主动关闭方最后的 ACK 报文能最终到达对端
- 1个 MSL 保证对端没有收到 ACK 那么进行重传的 FIN 报文能够到达

 
如果是三次挥手的话，那么服务端的 ACK 和 FIN 合成一个挥手，那么长时间的延迟可能让 TCP 一位 FIN 没有达到服务器端，然后让客户的不断的重发 FIN

### 维持连接
在 HTTP 中响应体的 Connection 字段指定为 keep-alive
### TCP 滑动窗口
 在 TCP 链接中，对于发送端和接收端而言，TCP 需要把发送的数据放到发送缓存区, 将接收的数据放到接收缓存区。而经常会存在发送端发送过多，而接收端无法消化的情况，所以就需要流量控制，就是在通过接收缓存区的大小，控制发送端的发送。如果对方的接收缓存区满了，就不能再继续发送了。而这种流量控制的过程就需要在发送端维护一个发送窗口，在接收端维持一个接收窗口。

TCP 滑动窗口分为两种: 发送窗口和接收窗口。

## WebSocket与Ajax的区别
本质不同

Ajax 即异步 JavaScript 和 XML，是一种创建交互式网页的应用的网页开发技术

websocket 是 HTML5 的一种新协议，实现了浏览器和服务器的实时通信

生命周期不同：

- websocket 是长连接，会话一直保持
- ajax 发送接收之后就会断开

适用范围：

- websocket 用于前后端实时交互数据
- ajax 非实时

发起人：

- AJAX 客户端发起
- WebSocket 服务器端和客户端相互推送



## localStorage、sessionStorage 和 Cookie 区别
- 数据存储方面：cookie在同源的HTTP请求里，在服务器和客户端来回传递。storage是本地保存。
- 存储数据大小：cookie限制4kb，storage约5MB。
- 数据有效期：cookie的有效期与过期时间设置有关（默认是会话），sessionStorage 当前标签页有效，  localStorage始终有效。
- 作用域：cookie、localStorage同源窗口，sessionStorage当前标签页
- 操作：cookie只作为document的一个属性可获取，没有其他操作方法。storage有getItem、setItem、removeItem、clear等方法。

 
 









