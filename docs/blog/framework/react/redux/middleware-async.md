---
title: 中间件机制及异步处理
date: 2021-03-18
tags:
    - 中间件
    - middleware
    - 异步
    - 异步action
    - redux
---

## 中间件
类似于express和koa中的中间件可对请求和响应进行操作，redux中的中间件可对特定的`action`进行操作。中间件会在dispatch action之后、action进入reducer之前调用。

### 包含中间件的数据流

![redux-async-data-flow](https://note.youdao.com/yws/api/personal/file/E8E9EB52198B42EBA9F74438D912B480?method=download&shareKey=7a19f8bc9e1b32444fd591e287b1354d)
### 从0实现中间件
中间件原理在于对`dispatch(action)`进行封装，下面从自定义一个打印dispatch action的中间件入手，理解中间件实现原理。
#### 简单实现
可以初步实现dispatch action前后的数据打印
``` js
const action = actionCreator("ac1");
console.log("display", action);
store.dispatch(action);
console.log("next state:", store.getState());
```
### 封装
``` js
const dispatchAndLog(store, action){
    console.log("display", action);
    store.dispatch(action);
    console.log("next state:", store.getState());
}

//使用
const action = actionCreator("ac1");
dispatchANdLog(store, action);
```
### 替换dispatch

```
function patchStoreToAddLogging(store){
    const next = store.dispatch;
    store.dispatch = function dispatchAndLog(store, action){
        console.log("display", action);
        next(action);
        console.log("next state:", store.getState()});
    }
}
```
我们可以调用该方法替换dispatch方法。

同理，我们可以这样将替换后的dispatch再次替换成其他的带有修饰作用的dispatch。

例如可这样添加错误捕获：
``` js
function patchStoreToAddCrashReporting(store){
    const next = store.dispatch;
    store.dispatch = function dispatchAndReporting(store, action){
        try{
            next(action);
        } catch(e) {
            console.log(e);
        }
    }
}
```
如果我们既想拥有打印功能，又想拥有错误捕获功能。可调用这两个函数。如下
``` js
//调用后store.dispatch可打印dispatch action信息
patchStoreToAddLogging(store);

//调用后streo.dispatch即可打印dispatch action信息
//又可捕获错误
patchStoreToAddCrashReporting(store);
```
### 隐藏monkeypatching
之前的方法都是monkeypatching的思想，将dispatch方法替换为想要的。接下来尝试隐藏monkeypatching，并提供批量应用中间件的方法。

通过返回新的dispatch方法，隐藏monkeypatching。
``` js
function logger(store){
    const next = store.dispatch;
    return function dispatchAndLogging(action){
        console.log("dispatch", action);
        const result = next(action);
        console.log("next state", store.getState());
        return result;
    }
}
```
### 中间件批量执行

批量执行多个中间件,通过该种方式可实现store.dispatch的批量替换。虽然还是monkeypatching的思想。
``` js
function applyMiddleware(store, middlewares){
    middlewares = middleware.slice();
    middleware.forEach((middleware) => {
        store.dispatch = middleware(store);
    })
}
```
使用两个中间件。
``` js
applyMiddleware(store, [logger, crashReporter]);
```
### 去除monkeypatching
目前的版本中，每个中间件中通过`store.dispatch`获取到经过上一个中间件处理的dispatch方法。除了monkeypatching的思想，也可通过将经过处理的dispatch方法作为参数传递给下一个中间件。如：
``` js
function logger(store){
    return function wrapDispatchAndLogging(next){
        return function dispatchAndLogging(action){
            console.log("dispatch:", action);
            const result = next(action);
            console.log("next state:", store.getState);
            return result;
        }
    }
}
```
通过箭头函数写成柯里化形式：
``` js
const logger = store => next => action => {
    console.log("dispatch:", action);
    const result = next(action);
    console.log("next state:", store.getState());
    return result;
}

const crashReporting = store => next => action => {
    try{
        return next(action);
    } catch(e){
        console.log(e);
    }
}
```
middleware通过`next()`获取到上级中间件传入的dispatch方法，又返回经过封装的新的dispatch方法传给下一级中间件。

此方案的中间件写法已为redux中的正式写法。通过此方式可自定义中间件
### 适应新版本的中间件批量执行
``` js
const applyMiddle = (store, middlewares) => {
    let middlewares = middlewares.slice();
    let dispatch = store.dispatch;
    middlewares.forEach((middleware) => {
        dispatch = middleware(store)(dispatch);
    })
    return Object.assign({}, store, {dispatch});
}
```
此方案重置了store对象，为保证中间件只执行一次，所以应应用在`createStore()`阶段。
## 中间件的使用
``` js
const store = createStore(rootReducer, [logger, crashReporting]);
```
中间件可进行日志记录、崩溃报告和调用异步接口等。
## 异步action
redux的模块中，reducer为纯函数，action通常为对象，而中间件可对相应action做处理。

一种思路为：创建函数action，在该函数中进行异步请求，在该函数action中dispatch其他的action。

函数action可由中间件予以支持。思路为：action类型为函数时，将action作为函数执行；action类型为其他的时，直接进入下一级中间件处理。如：
``` js
//扩展action使其支持函数类型
const thunk = (store) => (next) => (action) => {
    typeof action === "function"
    ? action(store.dispatch, store.getState)
    : next(action)
}
```

应用thunk中间件后，我们的redux就支持函数action了。就可在函数action中进行异步操作。如：
``` js
const asyncAction = async(dispatch, getState) => {
    dispatch({type: "FETCH_START"});
    try {
        const {data} = await axios.get("xxxxxx");
        dispatch({type: "FETCH_SUCCESS", payload: data});
    } catch(e){
        dispatch({type: "FETCH_FAIL", payload: e})
    }
}
```


