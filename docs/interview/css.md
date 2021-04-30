
## 垂直居中
### position + margin
position 元素已知宽度 绝对定位+margin反向偏移
position transform 元素未知宽度 如果元素未知宽度，transform: translate(-50%,-50%);
```css
.child {
    position: absolute;
    left: 50%;
    top: 50%;
    //margin: -50px 0 0 -50px;
    transform: translate(-50%,-50%);
}
```
###  flex布局
```css
.parent {
  display: flex;
  justify-content: center; /*使子项目水平居中*/
  align-items: center; /*使子项目垂直居中*/
}
```
### 绝对布局
div使用绝对布局，设置margin:auto;并设置top、left、right、bottom的值相等即可，不一定要都是0。
```css
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
}
```
### 给子元素相对定位，在通过translaY（）得到垂直居中
```css
.warp {
  position: relative;
  background-color: orange;
  width: 200px;
  height: 200px;
}
.example3 {
  position: relative;
  top:50%;
  transform:translateY(-50%);
  background-color: red;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
```
### 利用inline-block的vertical-align: middle去对齐after伪元素
利用inline-block的vertical-align:middle去对齐after伪元素实现效果更加好，居中块的尺寸可以做包裹性、自适应内容，兼容性也相当好。缺点是水平居中需要考虑inline-block间隔中的留白（代码换行符遗留问题。）
```css
.warp {
    text-align: center;
    overflow: auto;
    width: 200px;
    height: 200px;
    background-color: orange;
}
.example3 {
    display: inline-block;
    background-color: red;
    vertical-align: middle;
    width: 100px;
    height: 100px;
}

.warp:after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    margin-left: -0.25em;
    /* To offset spacing. May vary by font */
}
```
### display: table-cell+vertical-align: middle;
父元素设置为表格的单元格元素，而在表格单元格中的元素设置vertical-align: middle;会使其以中间对齐的方式显示；
```css
.parent {
    display: table-cell;
    vertical-align: middle
}

```


