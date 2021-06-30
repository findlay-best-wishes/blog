---
title: reducer划分及合并
date: 2021-03-18
tags:
   -  redux
   -  reducer
---


## 划分子reducer
store中存储多方面state数据时，可将state交由多个reducer处理维护,每个reducer维护属于自己的subState，它们最终合并成rootState。

如`rootState = {bgColor: "", username: "}`，则`bgColor`可交由`colorReducer`管理,`username`可交由`userReducer`管理。

两个reducer可合并成rootReducer传入createStore中，创建store。

如：
``` js
// colorReducer.js
export default colorReducer = (state = {bgColor: "white"}, action) => {
    switch(action.type){
        case "CHANGEBGCOLOR":
            return {...state, bgColor: action.payload};
        default :
            return state;
    }
}

//userReducer.js
export defalut userReducer = (state = {username: "",}, action ) => {
    switch(action.type){
        case "CHANGEUSERNAME" :
            return {...state, username: action.payload};
        default :
            return state;
    }
}
```

## 合并子reducer
子reducer可合并成`rootReducer`，创建`store`。
``` js
//store.js中
import {createStore, combineReducers} from "redux";
import colorReducer from "./colorReducer.js";
import userReducer from "./userReducer.js";

const rootReducer = combineReducers({
    color: bgColorReducer,
    user: userReducer,
})

const store = createStore(rootReducer);
```
## state层级变化
经过reducer的划分及合并后，state的嵌套层级多个一层，在`combineReducers`调用时引发。因此，在获取state数据时需更深入一层。

上述例子生成的`state`结构为:
``` js
const state = {
    color: {
        bgColor: "white",
    },
    user: {
        username: "",
    }
}
```
获取bgColor：`store.getState().color.bgColor`。