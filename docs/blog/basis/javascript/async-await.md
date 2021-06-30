---
title: async和await
next: false
date: 2020-06-23
tags:
    - js
    - javascript
---

- async 、await语法在es7中实现，是generator的语法糖。
- 是较promise、generator更为直观、简洁的异步处理方案，以同步的写法处理异步任务。
- 本文涉及async的基本使用、语法和注意小点。
## 基本使用

``` js
async function getInfo(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
getInfo("http://rap2.taobao.org:38080/app/mock/template/1472784").then((data) => {
  console.log(data)
};
```
- `async`、`await`配合使用。有`async`关键字标记的函数内才可使用`await`,`async`函数内可不出现`await`。
- `function`声明前加`async`表明所要声明函数内有异步操作。
- 异步操作前加`await`表明应等待异步操作执行完毕后，再向后执行。
- `async`函数执行会返回一个`promise`对象，所以可用`then()`进行后续操作。
#### 上述代码分析
- `getInfo`含3个操作。
- `fetch()`发起请求并返回含响应的promise。
- `res.json()`对响应进行处理获取到数据返回含data的promise。
- 返回data。后一个操作在前一个操作完成时才能按预期执行。
- 执行时，`fetch()`获取到响应，等待当前`promise`完成时，才会赋值给`res`。
- 执行`res.json()`，这个操作同样会返回`promise`，该`promise`完成后为`data`赋值。
- 返回`data`。
## 语法
#### async
###### 使用方式
函数声明前加`async`表明函数内含异步操作。`async`函数和普通函数一样，可有多种使用方式。
- 函数声明
`async function form1 () {};`
- 函数表达式
`const form2 = async () => {};`
- 对象中使用
``` js
const obj = {
  async form3 () {}
}
```
- 类中使用
``` js
class asyncClass {
  constructor(){}
  async form4 (params) {}
}
```
###### 返回值
- `async`函数执行时最终会返回`promise`对象。
- 对函数`return`字段通过`Promise.resolve`包装成`promise`对象返回。
``` js
async function func1() {
  return 1;
}
console.log(func1())   //打印结果:Promise { 1 }

async function func2() {
  return Promise.resolve(1);
}
console.log(func2())   //打印结果:Promise { <pending> }
```
- 所以，`async`函数执行结果可用`then()`进行后续操作。
``` js
async function func2() {
  return Promise.resolve(1);
}
func2().then( ( value ) => {
  console.log ( value );     .//打印:1
})
```
- 返回`promise`状态由内部`await`后`promise`状态所影响。内部所有`promise`状态改变时，返回promise才会改变。
``` js
//内部promise全部成功完成，返回promise状态变为fulfilled。
async function func2() {
  await Promise.resolve( 1 );
  await Promise.resolve( 2 );
  return 3;
}
func2().then( ( value ) => {
  console.log( value );    
})
```
``` js
//内部promise拒绝完成，函数停止执行，返回promise状态直接变为rejected。
async function func2() {
  await Promise.reject("出错了");
  await Promise.resolve(path)(2);
  return 3;
}
func2().catch( ( error ) => {
  console.log ( error );
})
```
#### await
await后跟需等待结果的操作，完成时才会继续向后执行。常见`await` + `promise`。
## 注意小点
#### 错误处理
- 函数内`promise`拒绝完成或报错时，会跳过后续执行，直接触发async函数回调。
- 对单个`promise`错误处理，可直接设置其拒绝完成回调。
``` js
async function func2() {
    await Promise.reject("trouble").catch( ( error) => {
      console.log(error)
    })
    console.log("我还能执行");
}
```
- 对多个promise，可用`try-catch`块包裹异步操作,可确保继续向后执行。
``` js
async function func2() {
  try {
    await Promise.reject("trouble")
    await Promise.reject( "出错了" );
  } catch( error ){
    console.log( error)
  }
  console.log("我还能执行");
}
```
#### 并发执行
如果多个promise间无依赖关系，并发处理可以有更好的性能。
``` js
async function func2() {

  let finalPromise =await Promise.all([
    new Promise( ( resolve ) => {
      setTimeout( () => {resolve("p1")},3000)
    }),
    new Promise( ( resolve ) => {
      resolve("p2")
    })
  ]);
  console.log(finalPromise)
}
```
## 与协程的关联
- `async`函数执行时会创建子协程，保留当前执行上下文栈，将线程控制权交由子协程。
- 子协程执行时，遇到`await`会创建新的`promise`，将promse内任务`resolve`、`reject`添加到微任务队列中。将线程控制权交由父协程。
- 父协程调用`promise.then()`监听状态的改变，并根据之前保留的调用栈继续执行。
- 执行至结束，在结束前执行微任务，微任务包含`await`后跟`promise`内的任务。
- 然后将控制权交由子协程，继续执行。