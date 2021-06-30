---
title: generator
date: 2020-06-21
tags:
    - js
    - javascript
---
## 初遇
生成器函数，顾名思义，生成对象，生成一个遍历器。
``` js
function* generator(){
    yield 0;
    yield 1;
    yield 2;
}

let iterator = generator();

iterator.next();    //{value:0,done:false}
iterator.next();    //{value:1,done:false}
iterator.next();    //{value:2,done:false}
iterator.next();    //{value:undefined,done:true}
```
- `generator()`为生成器函数，在`function`和`函数名`之间添加`*`表明该函数为生成器函数。
- `generaotor()`调用返回一个遍历器，赋值给`iterator`。
- `iterator`有多个方法，`next()`、`return()`、`throw()`。
- 通过`yield`和上述三个方法控制生成器函数代码块的执行。
## yield和next( )
- 生成器代码不会自动执行，多个yield将代码分成多个部分，等待信号才会执行，信号就是上述遍历器的几个方法。
- 调用`next()`时生成器代码执行，执行完含`yield`语句时停止。下一次调用`next()`时，继续执行。
- `next()`的返回值为一个对象:`{value:"",done:false`},该对象包含`value`、`done`字段。
- `value`值为本次执行代码中`yield`其后表达式的值。`done`的值为`true`或者`false`，表示当前遍历器是否执行完毕。
- 上述代码执行情况
    1.第一个`next()`启动生成器执行，执行完`yield 0`后停止，`next()`返回值为`{value:0,done:false}`。
    2.第二个`next()`调用，生成器继续执行，执行完`yield 1`后停止，`next()`返回值为`{value:1,done:false}`。
    3.第三次`next()`调用和第二次相似，`next()`返回值为`{value:2,done:false`}
    4.第四次`next()`调用时，生成器已执行完毕，`value`字段值默认值`undefined`,`done`字段值为`true`。后续调用都是如此。
  ####yield语句返回值、next( )参数
  - `yield`语句默认为值为`undefined`。
  ``` js
  function* generator () {
        const data0 = yield 0;
        console.log(data0);         //打印出值为undefined

        const data1 = yield 1;     
        console.log(data1);         //打印出值为undefined

        const data2 = yield 2;     
        console.log(data2);         //打印出值为undefined
    }

    let iterator = generator();

    iterator.next();
    iterator.next();
    iterator.next();
    iterator.next();
    //yield语句默认值为undefined，data0、data1、data2所赋到的值为undefined
  ```
  - 通过向`next()`传入参数改变上个`yield`语句的返回值。
  ``` js
    function* generator () {
        const data0 = yield 1;
        console.log(data0);         //打印出值为"data0"

        const data1 = yield 1;     
        console.log(data1);         //打印出值为"data1"

        const data2 = yield 2;     
        console.log(data2);         //打印出值为"data2"
    }

    let iterator = generator();

    iterator.next();
    iterator.next("data0");
    iterator.next("data1");
    iterator.next("data2");
  ```
## return( )
这样一段代码，生成器中含`return`语句。遍历器刚好结束遍历时，`value`字段默认值为undefined,`return`返回的值会赋给当前`next()`返回值的`value`字段。即代码块中第三次`next()`调用。
  ``` js
    function* generator(){
        yield 0;
        yield 1;
        return 2;
    }
    
    let iterator = generator();
    
    console.log(iterator.next());    //{value:0,done:false}
    console.log(iterator.next());    //{value:1,done:false}
    console.log(iterator.next());    //{value:2,done:true}
    console.log(iterator.next());    //{value:undefined,done:true}
```
 #### 遍历器的return()
遍历器的`next()`表示继续向后执行，`return`则表示直接返回，结束执行。
  ``` js
    function* generator() {
        yield 0;
        yield 1;
        yield 2;
    }

    let iterator = generator();
    console.log(iterator.next());
    console.log(iterator.return());
 ```
- 上述代码执行完`yield 0`后停止，`return()`被调用，提前结束遍历。后续`yield 1`、`yield 2`不会被执行。
- `return()`返回值默认为`{value:undefined，done:true}`。`value`字段值可由`return()`的参数设置，同`next()`。
## throw( )
- 所生成遍历器也有自己的`throw()`，会优先触发生成器内部的`try-catch`。
 ``` js
function* generator() {
        try {
            const data = yield;
        } catch(e) {
            console.log("内部检测到",e.message);
        }
    }
    let iterator = generator();
    iterator.next();
    iterator.throw(new Error("error"))
```
- 内部无` try-catch`时，触发外部`try-catch`。
- 多次 `throw()`时，第一次由内部捕获，后续由外部捕获。
## 底层原理
- 基于协程的实现。
- 单个线程上可有多个协程，线程控制权可交由不同的协程控制，每个时间点只能由一个协程控制。
- 运行生成器函数时创建新的协程，所创建它的协程的称为父协程。
- 开始时由父协程控制，调用`next()`时，将线程控制权交由生成器协程，遇到`yeild`时将控制权交回父协程。
- 每个协程在转交控制权前都会保存自己的调用栈，方便再次执行。