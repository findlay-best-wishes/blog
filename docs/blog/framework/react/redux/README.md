---
title: 初步上手指北
date: 2021-03-18
prev: false
tags:
    - redux
    - state
---

## 使用场景
组件中的状态可用state与setState维护。对于多个组件中都可能会用到的状态，可使用全局的状态管理，如：redux。
## 基础用法
### store
redux类似于context，将全局state数据存储在唯一的store中。再将store挂载到根组件中。根组件的子节点都可共享该store中的数据。如:
``` jsx
// store.js中
import { createStore } from 'redux';
export const store = createStore();

// index.js中
import { store } from "./store.js";
import {Provider} from "react-redux";
import App from "./App";
import ReactDom from "react-dom";

ReactDom.render(
    <Provider store = {store}>
        <App />
    <Provider />
)
```
### 数据使用
state数据存储在store中，可通过`store.getState()`获取到store中的数据。如：
``` jsx
// 在header组件中取用store中的username数据
// header.js
import store from "./store.js";

const Header = () => {
    const {username} = store.getState();
    return <div>{username}</div>
}
```
### 数据更新
数据的更新有套完整的机制。

比如在登录之后更改store中username时，需要先dispatch一个action（action为一个对象，用于说明我想要改变store中username并想更新为何值）。

然后该action会被分发到reducer中。reducer为创建store时就预定义的函数，接收state和action作为参数。负责对action进行处理，解读出意图后，返回新的state值。

redux再去更新store中的state数据。如：
``` jsx
//创建store时定义好reducer

const store = createStore(reducer);

//登录方法中dispatch一个action

dispatch({
    type: "CHANGEUSERNMAE",
    payload: {
        username: "findlay"
    }
})

//reducer为纯函数
//reducer中定义state的类型及默认值

const defaultState = {
    username: "",
}

const reducer = (state = defaultState, action){
    switch(action.type){
        case "CHANGEUSERNMAE" :
            return {...state, username:payload.username;
        default:
            return state;
    }
}
```
## store订阅
上述例子中，在dispatch action后经过多个步骤state更新。通过`store.getState()`获取到的数据不会更新。如需在dispatch后更新getState获取到的值，需要提前订阅store。如:
``` js
const handleChange = () => {
    console.log(store.getState())
}

const unsubscribe = store.subscribe(handleChange);
unsubscribe();
```
以上示例中，dispach action 后会执行传入subscribe中的回调函数，每次dispatch action后都会打印新的state值。

subscribe函数返回值即为取消订阅函数，执行该函数即可取消订阅。
## 数据流向
![redux data flow](https://note.youdao.com/yws/api/personal/file/DA93E7FB481E4F779D5669FE53B51D1E?method=download&shareKey=8ed3bc3cf8443dc1e9ec9cc23917f0cb)
