---
title: 模块化
date: 2021-04-01
tags: 
    - 工程化
---

## 概述
模块化指对于一个项目，需要有多个功能组成部分。将多个功能拆分到多个文件中，每个文件只完成单一职责。每个模块可定义导出对象，每个模块可加载其他模块导出内容。
### 初步原理
项目运行之前需要进行预处理-对项目打包（将多个具有依赖关系的文件打包到单个文件中）。原理在于函数块级作用域和立即执行函数表达式。如：
``` js
//项目结构
- a.js
- b.js
// 其中a依赖中导出的对象{p1:"p1"}
```
模块化结果
``` js
const b = (function() => {
    //b.js中代码
    return {
        p1: "p1",
    }
})();

//在a.js中引用
console.log(b.p1);
```
### 模块化规范
在ES Module出现之前，已经有多种模块化规则。主要有CommonJS和AMD（asynchronous module defined），各有自己的特点。

随后为了统一兼容CommonJS和AMD，出现了UMD（Universal Module Definition）。UMD定义的模块启动前，会先判断该模块应使用哪种模块系统（commonJS或AMD），然后进行配置，实现了两种模块的并存。

ES6中引入了ES module，在浏览器端可直接使用。集成了CommonJS和AMD，成为了之前所讲的模块加载器的替代品。
## CommonJS
CommonJS仍广泛应用于服务端JS。NodeJS使用了稍做修改的CommonJS。

### 模块导出
通过`module.exports`定义导出结果。可为任意值。如
``` js
//导出对象
module.exports = {
    p1: "p1",
};

//导出字符串
module.exports = "module";
```
另一种导出写法为`module.exports[prop] = xxx`。模块默认会导出一个对象，通过该语法定义导出对象的属性。如
``` js
module.exports.p1 = "p1";
module.exports.p2 = "p2";
//最终导出{p1: "p1", p2: "p2"}
```
#### Tip
`module.exports`语句会覆盖之前的导出语句,`module.exports[prop] = xxx`写法只能对导出对象做修改。如：
``` js
module.exports.p1 = "p1"
module.exports = {p2: "p2"};
//最终导出{p2: "p2"}

module.exports = {p2: "p2"};
module.exports.p1 = "p1"
//最终导出{p1: "p1", p2: "p2"}

module.exports = "module";
module.exports.p1 = "p1"
//最终导出"module"，属性定义失效

module.exports = "module";
module.exports.p1 = "p1"
module.exports.p3 = "p3"
module.exports = {p4: "p4"};
//最终导出{p4: "p4"}
```
### 模块加载
CJS采用同步加载的方式。通过`require([模块标识符])`语法加载模块。其值为目标模块导出结果。如：
``` js
//a.js中已导出{p1: "p1"}
const res = require("./a");
console.log(res); //打印{p1: "p1"};
```
加载时会执行目标模块代码，加载完毕后会产生模块缓存。因此在模块中多次`require()`同一模块，目标模块代码也只会被执行一次。如：
``` js
//a.js
console.log("a模块已加载");

//b.js
require("./a")
require("./a")
require("./a")
```
以上示例中执行`b.js`，只会执行一次`a.js`，打印结果为`"a模块已加载"`。
## ES Module
### 环境支持
ES Module原生支持浏览器，浏览器环境中可使用。
``` js
<cript type = "module">
    import "../moduleA>js"
    //
    //
<script />
```
以上例子表明该脚本作为模块解析。模块script会在文档解析完成后执行。类似于`<script defer />`的执行时机。具有多个特点：
- 每个模块都只会被加载一次。
- 每个模块script都可作为入口模块。
- 嵌入式script只可作为入口模块。
- 模块按照依赖图异步加载。
### 模块导出
#### 命名导出
如；
``` js
const p1 = "p1";
const p2 = "p2";

//方式1
export p1;
export p2;

//方式2
export {
    p1, 
    p2 as p2Data, //以别名p2Data导出
}
```
#### 默认导出
如：
``` js
const p1 = "p1";

//方式1
export default p1;

//方式2
export {
    p1 as default,  //default关键字已被占用，将导出值作为默认导出值
}
```
### 模块导入
模块导入和模块导出相对应。
#### 逻辑导入
只需要运行模块逻辑，但不需要特定导出值时使用：
``` js
//a.js
console.log("a模块已加载")

//b.js
import "./a.js";    //执行a中代码，导入逻辑
```
#### 命名导入
如：
``` js
//a.js
export {p1: "p1", p2: "p2"}

//b.js
//方式1
import * as data from "./a.js";
console.log(data.p1);

//方式2
import {p1} from "./a.js";
console.log(p1);
```
#### 默认导入
如：
``` js
//a.js
export default "a";

//b.js
//方式1
import data from "./a.js";
console.log(data);

//方式2
import {default as data} "./a.js";
console.log(data);
```
### 模块转移导出
export xxx from xxx，如：
``` js
//a.js
export {
    p1 as default,
    p2 ,
    p3,
}

//b.js
export * from "./a.js";     //导出{p2: p2, p3: p3}
export {p2} from "./a.js";  //导出{p2: p2}
export {default} from "a.js";   //导出默认值为p1
export {p2 as default} from "./a.js";   //导出默认值为p2
```





