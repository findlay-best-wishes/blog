---
title: promise
date: 2020-06-22
tags:
    - js
    - javascript
---
promise用于控制异步操作，本文涉及**promise对象、链式调用、promise.all、promise.race、手写promise**。
## promise对象
### 生命周期（三个状态）
1.pending(promise异步操作进行中)
2.Fulfilled（异步操作成功完成）
3.Rejected（异步操作未成功完成）
4.可通过`resolve( )`、`reject( )`变更状态为Fulfilled、Rejected。
### promise.then
- promise状态改变时，通过`then(  )`采取相应的操作。
- `then( )`接收两个函数作为参数。
- 第一个参数在状态变为Fulfilled时调用。
- 第二个参数在状态变为Rejected时调用。
- `resolve()`、`reject()`可向将自身的参数传递给状态处理程序，完成后续操作。
- `promise.catch()`类似于then( ),只接收一个拒绝处理程序方法，在状态为Rejected时调用。相当于`promise.then(null,function())`
- `then()`、`catch()`会被加入到微任务队列中,状态变更后由任务队列调度执行。
### 创建
通过构造函数创建。
#### 1.创建未完成的promise
``` js
const promise = new Promise((resolve,reject)=>{
    console.log("promise");
    const status  = "Fulfilled";
    resolve( “status”);
})

promise.then((status)=>{
    console.log(status)
},(status)=>{
    console.log(status)
})
```
上段代码执行情况：
- 构造函数接收一个执行器函数作为参数，执行器函数中包含所要控制的操作。
- "promise"正常打印，`resolve( )`将promise状态变为Fulfilled。
- `then() `接收两个参数，状态变为Fullfilled时，执行第一个函数，打印“resolved”
#### 2.创建已完成的promise
``` js
const promiseFulfilled = Promise.resolve("Fulfilled");
promiseFulfilled.then( (status) => {console.log(status) } );
```
只有Fulfilled状态，`Promise.rejected()`同理。
### 实例：发起请求后续进行处理。
``` js
const getInfo = (url) => {
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("Get",url,true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304){
                    resolve(xhr.response); //请求到数据后传给处理程序
                }
                else {
                    reject()
                }
            }
        }
        xhr.send();
    })
}

getInfo("http://rap2.taobao.org:38080/app/mock/244929/example/1582096559375").then((res)=>{
    console.log(res);
}，()=>{
    console.log(`错误`)
})  //在`then()`中进行具体处理
```
## promise链式调用
- `then()`除了参与事件处理程序的调度，还会返回一个新的promise。
- 全新的promise也有自己的`then()`，可设置自己的处理程序，同时又可返回新的promise。
- 先前的promise处理程序完成后会继续执行下层promise的处理程序，实现链式调用。
- 处理程序可以有返回值，返回值可传入新生promise处理程序作为参数。
``` js
const p1 = new Promise((resolve,reject)=>{
    resolve(42);
})

p1.then((value)=>{
    console.log(value);
    return value+1;
}).then((value)=>{
    console.log(value);
})
//依次打印
//42
//43
```
### 通过链式调用捕获错误
``` js
const sex = "female" ;
const p1 = new Promise((resolve,reject)=>{
    resolve(sex);
})
p1.then((sex)=>{
    if(sex === "male"){
        console.log(sex);
    }
    else throw new Error("不要female")
}).catch((error)=>{
    console.log(error.message);
})
```
比如我是gay,性别为male就打印，否则就报错，并由下一级promise处理程序打印错误信息。
### promise链中返回promise
上述链式调用中，处理程序返回值为一般的数据，也可返回Thenable数据(简单理解，可以调用data.then()的数据，如promise)。
``` js
    const p1 = new Promise((resolve,reject) => {
        resolve(42);
    })

    const p2 = new Promise((resolve,reject) => {
        resolve(43);
    })

    p1.then((value) => {      //处理程序1
        console.log(value);
        return p2;                      
    }).then((value)=>{          //处理程序2
        console.log(value)
    })

    //依次打印42、438
```
上代码中：
- p1成功处理程序返回p2。
- 处理程序1绑定到p1上，处理程序2绑定到`p1.then()`上(而不是在p2上）。
- 但只有p2处理后才会执行处理程序2。例如p2Rejected时，只能触发处理程序2的拒绝处理程序，不会触发成功处理程序。
- 返回promise不会改变promise执行器执行时机。
- 在处理程序中新建promise可推迟promise（代码中未展现）。
## 监听多个promise
### promise.all
- 可同时监听多个promise。
- 唯一参数为包含promise的可迭代对象（如数组）,非promise类型会被转化为相应promise对象。
- 返回一个promise。
- 可迭代对象中所有promise都被完成时，返回的promise才会被完成。
#### 全部完成时
各个promse传递值组成数组传给返回的promise
``` js
    const p1 = new Promise((resolve,reject)=>{
        resolve(42);
    });
    
    const p2 = new Promise((resolve,reject)=>{
        resolve(43);
    });
    
    const p3 = new Promise((resolve,reject)=>{
        resolve(44);
    });
    
    const p4 =Promise.all([p1,p2,p3]);
    
    p4.then((result)=>{
        console.log(result);       //[42,43,44]
    });
```
#### 部分拒绝时
promise传入值为第一个被拒绝的promise所传递的值。
``` js
    const p1 = new Promise((resolve,reject)=>{
        resolve(42);
    });
    
    const p2 = new Promise((resolve,reject)=>{
        reject(43);
    });

    const p3 = new Promise((resolve,reject)=>{
        resolve(44);
    });
    
    const p4 =Promise.all([p1,p2,p3]);

    p4.catch((value) => {
        console.log(value);     //43
    })
```
### promise.race
- 与promise.all相似，传入含proimise的可迭代对象（非promise对象会转化为相应promise），返回一个promise。
- 各个promise相互竞争，promise.race返回最先完成的promise。
#### 场景1
``` js
    const p1 = new Promise((resolve,reject) => {
        resolve(42);
    });

    const p2 = new Promise((resolve,reject) => {
        resolve(43);
    })

    const p3 = new Promise((resolve,reject) => {
        resolve(44);
    })

    const p4 = Promise.race([p1,p2,p3])

    p4.then((value) => {
        console.log(value)    //42
    })
```
#### 场景2
``` js
    const p1 = new Promise((resolve,reject) => {
        setTimeout(() => {resolve(42)},2000);
    });

    const p2 = new Promise((resolve,reject) => {
        resolve(43);
    })

    const p3 = new Promise((resolve,reject) => {
        resolve(44);
    })

    const p4 = Promise.race([p1,p2,p3])

    p4.then((value) => {
        console.log(value);      //打印43
    })
```
#### 场景3
``` js
    const p1 = new Promise((resolve,reject) => {
        setTimeout(()=>{resolve(42)},1000);
    });

    const p2 = new Promise((resolve,reject) => {
        reject(43);
    })

    p2.catch((value) => {
        console.log("erro")
    })

    const p3 = new Promise((resolve,reject) => {
        resolve(44);
    })

    const p4 = Promise.race([p1,p2,p3])

    p4.catch((value) => {
        console.log(value)      //43
    })
```
## 初步实现promise
### 构造函数
``` js
const MyPromise = function(execut){
    const self = this;
    //定义promise的状态、resolve所传递的数据、完成任务队列、拒绝任务队列。
    self.state = "pending";
    self.value = "undefined";
    self.onfulfilled = [];
    self.onrejected = [];

    //resolve方法
    const resolve = (value) =>{
        setTimeout(() => {
            self.value = value ;
            self.state = "fulfilled";
            self.onfulfilled.forEach(func=>func(value))
        })
    };

    //reject方法
    const reject = (value) =>{
        setTimeout(() => {
            self.value = value ;
            self.state = "rejected";
            self.onrejected.forEach(func=>func(value));
        })
    }

    //执行传入的自执行函数
    execut(resolve,reject);

};
```
### then方法
``` js
MyPromise.prototype.then =  function(execut1,execut2){
    
    const self = this;
    //事件处理程序必须初始化为函数
    const onfulfilled = typeof execut1 === "function" ? execut1 : value => value;
    const onrejected = typeof execut2 === "function" ? execut2 : value => value;

    //then()需返回promise
    return new Promise((resolve,reject) => {

        //状态为fulfilled时
        if(self.state === "fulfilled"){ 
            //执行成功完成处理程序并获取返回值
            const result = onfulfilled(self.value);

            //返回值为promise时，执行完返回的promise，在回到后续链式调用。
            if(result instanceof MyPromise){
                result.then(resolve,reject);
            }
            else
                resolve(result);   //完成当前promise异步任务，才能进行后续链式调用。
        }

        //状态为rejected时
        else if(self.state === "rejected"){
            const result = onrejected(self.value);
            if(result instanceof MyPromise){
                result.then(resove,reject);
            }else
                reject(result);
        }

        //状态为pending时
        else {

            //状态为pending时，promise内异步队列还未执行，直接向其添加任务以备执行。
            self.onfulfilled.push(function(){
                const result = onfulfilled(self.value);
                if(result instanceof MyPromise){
                    result.then(resolve,reject);
                }
                else
                    resolve(result)
            })

            self.onrejected.push(function(onrejected){
                const result = onrejected(self.value);
                if(result instanceof MyPromise){
                    result.then(resove,reject);
                }else
                    reject(result);
            });
        }
    })
}
```
